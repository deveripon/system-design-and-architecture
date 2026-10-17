import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  FanOutFixLab,
  TwoLevelLab,
} from "../../../components/course/topics/subqueries/derived-animations";
import {
  DerivedAnatomyDiagram,
  PreAggregateSplit,
  QuestionLevelsDiagram,
  TwoDerivedDiagram,
} from "../../../components/course/topics/subqueries/derived-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const derivedTablesContent: TopicData = {
  id: "derived-tables",
  introduction: {
    badge: "MODULE 07 · LESSON 04",
    title: <SectionTitle>Query থেকে বানানো Table</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের তিনটা লেসনে Subquery বসেছে একটা মানের জায়গায়: SELECT এর একটা ঘরে, WHERE এর একটা তুলনায়,
          EXISTS এর ভেতরে। এবার সে বসবে সবচেয়ে বড় জায়গায়, FROM এ, যেখানে সাধারণত একটা Table এর নাম
          থাকে। কারণ খুব সোজা: প্রতিটা SELECT এর ফলাফল নিজেই একটা Table। আর যেটা Table, তাকে FROM এ বসানো
          যায়, তার সাথে Join করা যায়, তার উপর আবার GROUP BY চালানো যায়।
        </ContentParagraph>
        <ContentParagraph>
          এই ছোট্ট ধারণাটা তিনটা বড় সমস্যার সমাধান। এক, গড়ের গড় বা মোটের সর্বোচ্চ, অর্থাৎ দুই ধাপের
          হিসাব, যেটা এক Query তে লেখা যায় না। দুই, SELECT এ বানানো একটা Column দিয়ে ছাঁকা, যেটা WHERE
          দেখতে পায় না। তিন, Module 06 এর সেই Fan-out, যেখানে Join এর পরে একই সংখ্যা বারবার যোগ হয়ে
          Report ফুলে ওঠে। তিনটার উত্তরই এক: আগে একটা ছোট Query তে কাজটা সেরে নিন, তার ফলাফলকে Table
          বানিয়ে ব্যবহার করুন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি যেকোনো দুই ধাপের প্রশ্নকে দুই স্তরের Query তে ভাঙতে পারবেন, Derived Table এর
          নাম আর Column এর নিয়ম জানবেন, Join এর আগে যোগ করে Fan-out ঠেকাতে পারবেন, আর দেখবেন Database
          এই ভেতরের Query গুলো আসলে কীভাবে চালায়। প্রতিটা উদাহরণ চলবে Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমার জন্ম একটা Query এর ভেতরে, আর আমার আয়ু ঠিক সেই Query টুকু। কেউ আমাকে CREATE করে না, কোথাও আমি জমা থাকি না। তবু যতক্ষণ বেঁচে আছি, আমি একটা পুরো Table: আমার Row আছে, Column আছে, নাম আছে।",
      author: "Derived Table",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা প্রশ্ন, তিনটা উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। শীতের মৌসুম শুরুর আগে Island Tours এর মালিক রুমানা আপা একটা
                ছোট প্রশ্ন নিয়ে বসলেন: &ldquo;একজন Customer আমাদের কাছে গড়ে কত টাকার confirmed ট্যুর
                কিনেছেন?&rdquo; উত্তরটা দিয়ে তিনি ঠিক করবেন নতুন Loyalty Card এর সীমা কত হবে।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer তানিম Module 05 শিখেছেন। তিনি সাথে সাথে লিখলেন{" "}
                <code className={CODE}>{"SELECT round(avg(total_bdt), 2) FROM bookings WHERE status = 'confirmed'"}</code>{" "}
                আর উত্তর পেলেন 24917.65। Manager ফারুক সাহেব সংখ্যাটা দেখে একটু থামলেন। Nusrat Jahan একাই
                দুটো confirmed Booking করেছেন, মোট 75000 টাকা। এই গড়ে তিনি দুইবার গোনা হয়েছেন, দুটো
                আলাদা মানুষের মতো। তানিমের সংখ্যাটা ভুল হিসাব না, কিন্তু অন্য প্রশ্নের উত্তর: এটা{" "}
                <strong>Booking প্রতি</strong> গড়, মানুষ প্রতি না।
              </ContentParagraph>
              <ContentParagraph>
                মানুষ প্রতি গড় পেতে কাজটা দুই ধাপে করতে হয়। প্রথমে প্রতিজন Customer এর সব confirmed Booking
                যোগ করে তাঁর মোট বের করা, তারপর সেই মোটগুলোর গড় নেওয়া। এভাবে উত্তর আসে 35300.00। আর রুমানা
                আপা যদি বলেন &ldquo;Account খোলা সবাই, যাঁরা এখনো কিছু কেনেননি তাঁরাও&rdquo;, তাহলে উত্তর
                28240.00। একই প্রশ্নের মতো শোনানো তিনটা প্রশ্ন, তিনটা আলাদা সংখ্যা।
              </ContentParagraph>
              <ContentParagraph>
                তানিম ভাবলেন দুই ধাপ এক লাইনেই লিখে ফেলবেন: <code className={CODE}>avg(sum(total_bdt))</code>,
                GROUP BY customer_id দিয়ে। PostgreSQL সাথে সাথে থামিয়ে দিল। একটা Aggregate এর ভেতরে আরেকটা
                Aggregate বসানো যায় না, কারণ GROUP BY একটা Query তে একবারই দল বানায়। দুই ধাপের হিসাবের
                জন্য দুই স্তরের Query লাগে। ভেতরের স্তর প্রতিজনের মোট বানায়, বাইরের স্তর সেই মোটগুলোর গড়
                নেয়। ভেতরের Query টা বসে বাইরের Query এর FROM এ, ঠিক একটা Table এর মতো। একেই বলে{" "}
                <strong>Derived Table</strong>: অন্য একটা Query থেকে জন্ম নেওয়া Table।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <QuestionLevelsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের দুই চেষ্টা"
              query={`-- প্রথম চেষ্টা: চলে, কিন্তু এটা Booking প্রতি গড়
SELECT round(avg(total_bdt), 2) AS avg_per_booking
FROM bookings
WHERE status = 'confirmed';

-- দ্বিতীয় চেষ্টা: দুই ধাপ এক লাইনে, PostgreSQL মানবে না
SELECT avg(sum(total_bdt))
FROM bookings
WHERE status = 'confirmed'
GROUP BY customer_id;`}
              caption="প্রথম Statement দেয় 24917.65, ১৭টা Booking এর গড়। দ্বিতীয়টা থামে ERROR: aggregate function calls cannot be nested এ। একটা Aggregate আরেকটার ভেতরে বসতে পারে না। এই লেসনের বাকিটা সেই বাধা পেরোনোর উপায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের একটাই মূল কথা",
          content: (
            <ContentParagraph>
              প্রতিটা SELECT এর ফলাফল একটা Table: তার Row আছে, Column আছে। তাই একটা Query কে বন্ধনীতে
              মুড়ে আরেকটা Query এর FROM এ বসানো যায়, একটা নাম দিয়ে। ভেতরের Query আগে কাজ সারে, বাইরের
              Query সেই ফলাফলকে সাধারণ Table এর মতো পড়ে। দুই ধাপের যেকোনো প্রশ্ন এভাবেই লেখা হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "a-query-as-a-table",
      subHeader: { index: "002", title: "A Query as a Table" },
      title: <SectionTitle>FROM এর জায়গায় একটা আস্ত Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর প্রথম লেসনেই আপনি একটা কথা দেখেছিলেন: SELECT এর ফলাফল একটা নতুন, অস্থায়ী
                Table। তখন সেই কথার ব্যবহার ছিল না, এখন আছে। FROM এর কাজ হলো Query কে বলে দেওয়া কোথা
                থেকে Row আসবে। সেখানে একটা আসল Table এর নাম দেওয়া যায়, আর দেওয়া যায় বন্ধনীতে মোড়া একটা
                পুরো Query।
              </ContentParagraph>
              <ContentParagraph>
                একটা রান্নাঘরের কথা ভাবুন। বাবুর্চি বিরিয়ানি রাঁধবেন। মশলা তিনি সরাসরি বাজার থেকে আনেন না,
                আগে আলাদা করে বেটে একটা বাটিতে রাখেন, তারপর সেই বাটি থেকে নেন। বাটার কাজটা আলাদা ধাপ, আর
                বাটিটা অস্থায়ী: রান্না শেষ হলে ধুয়ে রাখা হয়। Derived Table ঠিক সেই বাটি। ভেতরের Query হলো
                মশলা বাটা, বাইরের Query হলো রান্না।
              </ContentParagraph>
              <ContentParagraph>
                গঠনটা এমন: <code className={CODE}>{"FROM ( ভেতরের SELECT ) AS নাম"}</code>। ভেতরের Query একটা
                সম্পূর্ণ, নিজে নিজে চলার মতো SELECT। বন্ধনী Database কে বলে দেয় কোথায় ভেতরের Query শুরু আর
                শেষ। আর <code className={CODE}>AS per_customer</code> সেই অস্থায়ী Table এর নাম, যে নামে
                বাইরের Query তাকে ডাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DerivedAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Derived Table লেখার সবচেয়ে ভালো অভ্যাস হলো ভেতর থেকে বাইরে। আগে ভেতরের Query টা একা চালান,
                দেখুন সে ঠিক কোন Table টা বানাচ্ছে, কয়টা Row, কোন Column। তারপর তাকে বন্ধনীতে মুড়ে বাইরের
                Query লিখুন। নিচের বক্সে ঠিক সেটাই, দুই ধাপে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে ভেতরের Query একা, তারপর মুড়ে দেওয়া"
              query={`-- ধাপ ১: ভেতরের Query একা চালিয়ে দেখা
SELECT customer_id,
       sum(total_bdt) AS spent
FROM bookings
WHERE status = 'confirmed'
GROUP BY customer_id
ORDER BY customer_id;

-- ধাপ ২: সেটাকে FROM এ বসিয়ে গড়
SELECT round(avg(spent), 2) AS avg_per_customer,
       count(*)             AS customers
FROM (
    SELECT customer_id,
           sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS per_customer;`}
              caption="প্রথম ফলাফল ১২ Row: যে ১২ জনের অন্তত একটা confirmed Booking আছে, প্রতিজনের মোট। Rahim Uddin 44000.00, Nusrat Jahan 75000.00। দ্বিতীয় ফলাফল এক Row: avg_per_customer 35300.00, customers 12। বাইরের count(*) গুনেছে ভেতরের Table এর Row, মানে মানুষ, Booking না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "VALUES ও একটা Derived Table",
          content: (
            <ContentParagraph>
              আগের মডিউলগুলোতে কয়েকবার <code className={CODE}>{"FROM (VALUES (1, 'a'), (2, 'b')) AS t(id, label)"}</code>{" "}
              দেখেছেন। সেটাও এই একই জিনিস: বন্ধনীর ভেতরে Row বানানোর একটা প্রকাশ, বাইরে একটা নাম আর
              Column এর নাম। পার্থক্য শুধু এটুকু যে সেখানে Row গুলো হাতে লেখা, এখানে একটা Query থেকে আসে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "the-alias-rule",
      subHeader: { index: "003", title: "The Alias Rule" },
      title: <SectionTitle>নাম দিন, Table কেও, Column কেও</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SQL Standard বলে, FROM এর প্রতিটা Subquery এর একটা নাম থাকতেই হবে। MySQL এই নিয়ম কড়াভাবে
                মানে: নাম না দিলে সে চালায়ই না। PostgreSQL ও আগে মানত, কিন্তু Version 16 থেকে নামটা ঐচ্ছিক
                করে দিয়েছে। এই লেসনের বক্সগুলো PostgreSQL 18 এ চলে, তাই নাম ছাড়া লিখলেও চলবে। তবু PostgreSQL
                এর নিজের Documentation পরামর্শ দেয় নাম লিখতে, কারণ অন্য Database এ নিতে গেলে নাম ছাড়া
                Query ভাঙবে, আর নাম থাকলে Query পড়া সহজ হয়।
              </ContentParagraph>
              <ContentParagraph>
                Table এর নামের চেয়েও জরুরি Column এর নাম। ভেতরের Query তে{" "}
                <code className={CODE}>sum(total_bdt)</code> লিখে নাম না দিলে PostgreSQL নিজে থেকে Column
                টার নাম রাখে <code className={CODE}>sum</code>, আর হিসাবের Column হলে{" "}
                <code className={CODE}>?column?</code>। বাইরের Query কে তখন সেই অদ্ভুত নামে ডাকতে হয়। আর
                ভেতরে দুটো <code className={CODE}>count(*)</code> থাকলে দুটোরই নাম count, তখন বাইরে থেকে
                count বললে Database বুঝতে পারে না কোনটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম না দিলে কী হয়"
              query={`-- PostgreSQL 16+ এ নাম ছাড়াও চলে
SELECT count(*) AS customers_with_bookings
FROM (
    SELECT customer_id
    FROM bookings
    GROUP BY customer_id
);

-- Column এর নাম না দিলে PostgreSQL নিজে নাম রাখে: sum
SELECT *
FROM (
    SELECT customer_id, sum(total_bdt)
    FROM bookings
    GROUP BY customer_id
) AS t
ORDER BY customer_id
LIMIT 3;

-- দুটো Column এর নামই count: বাইরে থেকে ডাকলে Error
SELECT count
FROM (
    SELECT customer_id, count(*), count(DISTINCT departure_id)
    FROM bookings
    GROUP BY customer_id
) AS t;`}
              caption="প্রথম Statement দেয় 14: নাম ছাড়া Subquery PostgreSQL 18 মেনে নিয়েছে। দ্বিতীয়টার Column দুটোর নাম customer_id আর sum, প্রথম তিন Row এ 80000.00, 75000.00, 25000.00 (এখানে সব Status এর Booking)। তৃতীয়টা থামে ERROR: column reference &quot;count&quot; is ambiguous এ, কারণ ভেতরের দুটো Column এর নামই count।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান দুটো, আর দুটোই ভালো অভ্যাস। এক, ভেতরের প্রতিটা হিসাবের Column কে AS দিয়ে নাম দেওয়া:{" "}
                <code className={CODE}>sum(total_bdt) AS spent</code>। দুই, Table এর নামের পরে বন্ধনীতে
                Column গুলোর নতুন নাম লিখে দেওয়া: <code className={CODE}>{") AS t(cid, spent)"}</code>। দ্বিতীয়
                উপায়ে ভেতরের Column গুলো ক্রম অনুযায়ী নতুন নাম পায়, প্রথমটা cid, দ্বিতীয়টা spent। তালিকায় নাম
                কম দিলে বাকি Column গুলো নিজেদের নাম রাখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Table এর নামের পাশে Column এর নাম"
              query={`SELECT cid, spent
FROM (
    SELECT customer_id, sum(total_bdt)
    FROM bookings
    GROUP BY customer_id
) AS t(cid, spent)
ORDER BY spent DESC
LIMIT 3;`}
              caption="ভেতরে কোনো AS নেই, তবু বাইরে থেকে cid আর spent নামে ডাকা গেছে। সবচেয়ে বেশি খরচ: customer 1 এর 80000.00, তারপর 2 এর 75000.00, তারপর 8 এর 70500.00। একই Query MySQL 8.4 এও হুবহু চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিস্থিতি", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["FROM এর Subquery এর নাম নেই", "চলে (Version 16 থেকে)", "ERROR 1248: Every derived table must have its own alias"],
            ["হিসাবের Column এর নাম নেই", "নিজে নাম রাখে: sum, count, ?column?", "Expression টাই নাম: SUM(total_bdt), Backtick দিয়ে ডাকতে হয়"],
            ["ভেতরে দুটো Column এর একই নাম", "চলে, কিন্তু বাইরে থেকে ডাকলে ambiguous Error", "ERROR 1060: Duplicate column name"],
            ["AS t(cid, spent) Column তালিকা", "চলে", "চলে"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-run",
      subHeader: { index: "004", title: "Watch It Run" },
      title: <SectionTitle>ভেতরে আগে, বাইরে পরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Derived Table বোঝার সবচেয়ে সহজ উপায় হলো মনে মনে দুটো আলাদা Query কল্পনা করা। প্রথম Query
                চলে, একটা ফলাফল দেয়। সেই ফলাফলটা যেন কাগজে লিখে রাখা হলো, উপরে একটা নাম দিয়ে। দ্বিতীয়
                Query সেই কাগজটা হাতে নেয়, আর এমনভাবে কাজ করে যেন ওটাই Database এর একটা Table। নিচের Lab
                এ তিনটা স্তরের গড় ধাপে ধাপে দেখুন। লক্ষ করুন, এক ধাপের গড়ে মাঝের ধাপটা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoLevelLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডেলের একটা গুরুত্বপূর্ণ ফল আছে। বাইরের Query শুধু ভেতরের Query এর{" "}
                <strong>ফলাফলের Column</strong> দেখতে পায়। ভেতরে কোন Table ছিল, কোন Column দিয়ে ছাঁকা হয়েছিল,
                সেসব বাইরে অদৃশ্য। কাগজে যা লেখা হয়নি, তা কাগজ থেকে পড়া যায় না। ভেতরের Query তে status
                দিয়ে ছাঁকা হলেও, status যদি ভেতরের SELECT এর তালিকায় না থাকে, বাইরের Query তার নামও জানে
                না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাইরে থেকে ভেতরের Table দেখা যায় না"
              query={`SELECT status
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    GROUP BY customer_id
) AS per_customer;`}
              caption="ERROR: column &quot;status&quot; does not exist। bookings এ status আছে, কিন্তু per_customer এর Column মাত্র দুটো: customer_id আর spent। বাইরের Query এর কাছে per_customer ই একমাত্র Table। কোনো Column বাইরে লাগলে সেটা ভেতরের SELECT তালিকায় রাখতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "কাগজের মডেলটা মনের মডেল, Database এর আসল কাজ না",
          content: (
            <ContentParagraph>
              Database সবসময় ভেতরের ফলাফল আলাদা করে লিখে রাখে না। অনেক সময় সে দুই স্তর মিলিয়ে একটা
              Query বানিয়ে ফেলে, যেটা আরও দ্রুত চলে। Section 12 এ EXPLAIN দিয়ে সেটা দেখবেন। কিন্তু
              ফলাফল সবসময় ঠিক এমন হয় যেন ভেতরেরটা আগে চলেছে। তাই Query লেখা আর পড়ার সময় কাগজের মডেলটাই
              নির্ভরযোগ্য।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "two-level-aggregation",
      subHeader: { index: "005", title: "Two-Level Aggregation" },
      title: <SectionTitle>মোটের গড়, গণনার সর্বোচ্চ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুই ধাপের হিসাব বাস্তবে সব জায়গায়। মাসপ্রতি কয়টা Booking, তার মধ্যে সবচেয়ে ব্যস্ত মাসে
                কয়টা। প্রতি Customer কয়টা Booking করেছেন, তারপর কতজন একটা, কতজন দুটো, কতজন তিনটা করেছেন।
                প্রতি Departure কয়টা সিট বিক্রি হয়েছে, তারপর গড়ে একটা Departure কতটা ভরে। প্রতিটার গড়ন
                একই: ভেতরে GROUP BY একটা জিনিস ধরে, বাইরে সেই দলগুলোর উপর আরেকটা Aggregate।
              </ContentParagraph>
              <ContentParagraph>
                এই প্রশ্নগুলো পড়ার একটা কৌশল আছে। প্রশ্নে যদি দুটো &ldquo;প্রতি&rdquo; বা একটা
                &ldquo;প্রতি&rdquo; আর একটা &ldquo;গড়ে / সর্বোচ্চ / কতজন&rdquo; থাকে, তাহলে প্রায় নিশ্চিত এটা দুই
                স্তরের Query। &ldquo;মাসপ্রতি Booking এর সর্বোচ্চ&rdquo;: ভেতরে মাসপ্রতি গণনা, বাইরে max।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসপ্রতি গণনা, তারপর সর্বোচ্চ আর গড়"
              query={`-- ভেতরের Query একা: মাসপ্রতি কয়টা Booking
SELECT to_char(booked_at, 'YYYY-MM') AS month,
       count(*)                       AS bookings
FROM bookings
GROUP BY 1
ORDER BY 1;

-- বাইরে: সবচেয়ে ব্যস্ত মাস আর মাসপ্রতি গড়
SELECT max(bookings)           AS busiest,
       round(avg(bookings), 2) AS avg_per_month,
       count(*)                AS months
FROM (
    SELECT to_char(booked_at, 'YYYY-MM') AS month,
           count(*)                       AS bookings
    FROM bookings
    GROUP BY 1
) AS m;`}
              caption="ভেতরের Query দেয় ৬টা মাস: 2025-12 এ 2, 2026-01 এ 6, 2026-02 এ 1, 2026-03 এ 3, 2026-09 এ 3, আর 2026-10 এ 9। বাইরের Query দেয় busiest 9, avg_per_month 4.00, months 6। মাসগুলো Dhaka সময় ধরে গোনা, এই বক্সের Time Zone Asia/Dhaka।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কতজন Customer কয়টা করে Booking করেছেন"
              query={`SELECT bookings AS bookings_per_customer,
       count(*) AS customers
FROM (
    SELECT customer_id, count(*) AS bookings
    FROM bookings
    GROUP BY customer_id
) AS per_customer
GROUP BY bookings
ORDER BY bookings;`}
              caption="তিনটা Row: ১টা Booking করেছেন 5 জন, ২টা করেছেন 8 জন, ৩টা করেছেন 1 জন (Rahim Uddin)। মোট 14 জন। বাইরের Query ভেতরের ফলাফলের উপর আবার GROUP BY চালিয়েছে, যেটা এক Query তে কখনো সম্ভব না। Imran Kabir এর কোনো Booking নেই, তাই তিনি কোনো দলে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  তানিমের প্রশ্নটা ঠিকভাবে লিখুন: প্রতিজন Customer এর confirmed Booking এর মোট টাকা বের করে, সেই
                  মোটগুলোর গড়, দুই দশমিক পর্যন্ত (<code className={CODE}>round(..., 2)</code>)। শুধু যাঁদের
                  অন্তত একটা confirmed Booking আছে, তাঁরা গড়ে থাকবেন। ফলাফল এক Row, এক Column।
                </>
              }
              hint={
                <>
                  ভেতরে <code className={CODE}>{"WHERE status = 'confirmed'"}</code> আর{" "}
                  <code className={CODE}>GROUP BY customer_id</code> দিয়ে প্রতিজনের{" "}
                  <code className={CODE}>sum(total_bdt)</code>। বাইরে সেই Column এর{" "}
                  <code className={CODE}>round(avg(...), 2)</code>। Derived Table কে একটা নাম দিতে ভুলবেন না।
                </>
              }
              solution={`SELECT round(avg(spent), 2) AS avg_spent
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS per_customer;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "filtering-computed-columns",
      subHeader: { index: "006", title: "Filtering on Computed Columns" },
      title: <SectionTitle>যে Column WHERE দেখতে পায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর দ্বিতীয় লেসনে আপনি দেখেছেন, Query লেখার ক্রম আর চলার ক্রম আলাদা। WHERE চলে
                SELECT এর আগে। তাই SELECT এ বানানো Alias, যেমন{" "}
                <code className={CODE}>round(price_bdt / duration_days, 2) AS per_day</code>, WHERE এর সময়
                তখনো জন্মায়নি। WHERE এ per_day লিখলে Error আসে। তখন উপায় ছিল পুরো হিসাবটা WHERE এ আবার
                লেখা।
              </ContentParagraph>
              <ContentParagraph>
                Derived Table এর পরে আরেকটা, আরও পরিষ্কার উপায় আছে। হিসাবটা ভেতরের Query তে একবার করুন আর
                নাম দিন। ভেতরের Query শেষ হলে per_day একটা সাধারণ Column, আর বাইরের Query এর WHERE তাকে আর
                সব Column এর মতোই দেখে। হিসাব একবার, নাম একবার, ব্যবহার যতবার খুশি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Alias দিয়ে ছাঁকা: Error, তারপর সমাধান"
              query={`-- WHERE এখনো per_day কে চেনে না
SELECT title, round(price_bdt / duration_days, 2) AS per_day
FROM tours
WHERE per_day > 4000;

-- ভেতরে হিসাব করে নাম দিলে বাইরের WHERE চেনে
SELECT title, per_day
FROM (
    SELECT title,
           round(price_bdt / duration_days, 2) AS per_day
    FROM tours
) AS t
WHERE per_day > 4000
ORDER BY per_day DESC;`}
              caption="প্রথমটা থামে ERROR: column &quot;per_day&quot; does not exist এ। বক্সটা প্রথম Error এই থামে, তাই দ্বিতীয় Query এর ফলাফল দেখতে উপরের ভুল Query টা মুছে আবার Run চাপুন: ৬টা ট্যুর আসবে, Saint Martin Luxury Stay 8000.00 থেকে Saint Martin Island Escape 4166.67 পর্যন্ত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই কৌশল Aggregate এর বেলাতেও চলে। &ldquo;যাঁদের মোট খরচ 50000 এর বেশি&rdquo; লিখতে আপনি
                Module 05 এ HAVING শিখেছেন। Derived Table দিয়ে একই কাজ করা যায়: ভেতরে প্রতিজনের মোট, বাইরে
                সাধারণ WHERE। দুটোর ফলাফল হুবহু এক। ছোট Query তে HAVING বেশি সংক্ষিপ্ত, কিন্তু যখন মোটটা দিয়ে
                আরও কিছু করতে হবে, যেমন আরেকটা Table এর সাথে জোড়া বা আরেকবার Group, তখন Derived Table ই
                স্বাভাবিক পথ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="HAVING ছাড়া বড় খরচকারী"
              query={`SELECT customer_id, spent
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    GROUP BY customer_id
) AS per_customer
WHERE spent > 50000
ORDER BY spent DESC;`}
              caption="৪ জন: customer 1 (80000.00), 2 (75000.00), 8 (70500.00), 11 (53000.00)। এখানে সব Status এর Booking গোনা হয়েছে। একই ফলাফল আসে GROUP BY customer_id HAVING sum(total_bdt) > 50000 দিয়েও।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পরের মডিউলে এই কৌশলটা লাগবেই",
          content: (
            <ContentParagraph>
              Module 08 এ Window Function শিখবেন, যেমন ROW_NUMBER, যেটা প্রতিটা Row কে একটা ক্রমিক নম্বর
              দেয়। সেই নম্বরও SELECT এ জন্মায়, তাই WHERE তাকে দেখে না। &ldquo;প্রতি ট্যুরের সেরা তিনটা
              Booking&rdquo; লিখতে ঠিক এই লেসনের কৌশল লাগবে: নম্বর ভেতরে, ছাঁকা বাইরে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  শুধু চালু ট্যুর (<code className={CODE}>is_active</code>) ধরে, যাদের দিনপ্রতি দাম (
                  <code className={CODE}>round(price_bdt / duration_days, 2)</code>) 5000 এর বেশি, তাদের{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>per_day</code>। দিনপ্রতি দাম বেশি
                  থেকে কম ক্রমে সাজান। হিসাবটা একবারই লিখবেন, ভেতরের Query তে।
                </>
              }
              hint={
                <>
                  ভেতরের SELECT এ title, is_active আর per_day তিনটাই রাখুন, কারণ বাইরের WHERE এ is_active ও
                  লাগবে। বাইরে <code className={CODE}>WHERE is_active AND per_day &gt; 5000</code>।
                </>
              }
              orderMatters
              solution={`SELECT title, per_day
FROM (
    SELECT title,
           is_active,
           round(price_bdt / duration_days, 2) AS per_day
    FROM tours
) AS t
WHERE is_active
  AND per_day > 5000
ORDER BY per_day DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "fan-out-again",
      subHeader: { index: "007", title: "Fan-out Comes Back" },
      title: <SectionTitle>Module 06 এর ফুলে ওঠা সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/multi-table-joins" className={LINK}>
                  Module 06 এর Multi-table Joins
                </Link>{" "}
                লেসনে একটা সমস্যা আধখানা রেখে আসা হয়েছিল। Operations জানতে চেয়েছিল প্রতিটা ট্যুরের কয়টা
                Departure, কয়টা সিট খালি, আর কয়টা বিক্রি হয়েছে। tours, departures আর bookings একসাথে জোড়া
                দিয়ে tour_id ধরে Group করতেই Tour 1 এর Departure 4 থেকে 7 হয়ে গেল, খালি সিট 66 থেকে 113।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা মনে করিয়ে দিই। Departure 1 এ দুটো Booking। bookings জোড়া দেওয়ার পরে Departure 1 এর
                Row দুইবার আসে, দুটোতেই seats_left 14। তারপর sum(seats_left) সেই 14 কে দুইবার যোগ করে। একটা
                Row পাখার মতো ছড়িয়ে অনেক Row হয়েছে, আর তার সাথে তার সংখ্যাগুলোও। নিচের বক্সে Join এর পরের
                Row গুলো নিজের চোখে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Join এর পরে Tour 1 এর Row গুলো"
              query={`SELECT d.departure_id,
       d.seats_left,
       b.booking_id,
       b.seats
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
WHERE d.tour_id = 1
ORDER BY d.departure_id, b.booking_id;`}
              caption="৪টা Departure থেকে ৭টা Row। Departure 1, 2 আর 8 প্রতিটা দুইবার এসেছে, প্রতিবার একই seats_left নিয়ে (14, 19, 14)। এই ৭টা Row এর seats_left যোগ করলে 113, অথচ আসল খালি সিট 14 + 19 + 14 + 19 = 66।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PreAggregateSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 06 এ দুটো জোড়াতালি দেখেছিলেন। গোনার বেলায় <code className={CODE}>count(DISTINCT ...)</code>{" "}
                কাজ করে। যোগের বেলায় <code className={CODE}>sum(DISTINCT ...)</code> উল্টো বিপদ ডাকে, কারণ সে
                এক Row কে একবার না, একটা মানকে একবার যোগ করে: দুটো আলাদা Departure এর seats_left যদি দুটোই 14
                হয়, একটা হারিয়ে যায়। আসল সমাধান জোড়াতালি না, ক্রম বদলানো। সেটাই পরের Section।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FanOutFixLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "pre-aggregation",
      subHeader: { index: "008", title: "Pre-aggregation" },
      title: <SectionTitle>আগে যোগ, পরে জোড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা এক বাক্যে: <strong>কোনো Table এর সংখ্যা যোগ করুন ঠিক সেই স্তরে, যে স্তরে সে Join
                হবে।</strong> bookings কে departures এর সাথে জোড়া দেওয়ার আগে bookings কে Departure প্রতি এক Row
                এ নামিয়ে আনুন। তখন জোড়ার সময় প্রতিটা Departure ঠিক একটা Row পায়, কোনো Row দুইবার আসে না, আর
                Fan-out এর প্রশ্নই ওঠে না। এই কৌশলের নাম <strong>Pre-aggregation</strong>, আর এটা Derived
                Table এর সবচেয়ে বেশি ব্যবহারের জায়গা।
              </ContentParagraph>
              <ContentParagraph>
                বাস্তবের একটা তুলনা: একটা স্কুলে প্রতিটা ক্লাসের ছাত্রসংখ্যা আর প্রতিটা ক্লাসের পরীক্ষার
                খাতার সংখ্যা মেলাতে হবে। কেউ যদি প্রতিটা খাতার পাশে ক্লাসের ছাত্রসংখ্যা লিখে তারপর সব যোগ
                করেন, ছাত্রসংখ্যা খাতার সংখ্যা দিয়ে গুণ হয়ে যাবে। ঠিক পদ্ধতি হলো আগে প্রতি ক্লাসের খাতা গুনে
                একটা ছোট তালিকা বানানো, তারপর সেই তালিকা ক্লাসের তালিকার পাশে বসানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Pre-aggregation: প্রতিটা ট্যুরের ঠিক সংখ্যা"
              query={`SELECT t.tour_id,
       count(*)                   AS departures,
       sum(d.seats_left)          AS free_seats,
       coalesce(sum(bk.seats), 0) AS booked
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (
    SELECT departure_id,
           sum(seats) AS seats
    FROM bookings
    GROUP BY departure_id
) AS bk ON bk.departure_id = d.departure_id
GROUP BY t.tour_id
ORDER BY t.tour_id;`}
              caption="৮ Row, Departure আছে এমন প্রতিটা ট্যুর একবার। Tour 1: departures 4, free_seats 66, booked 16, তিনটাই ঠিক। Tour 8 (Saint Martin Luxury Stay): 1, 10, 0, কারণ তার Departure এ কোনো Booking নেই, LEFT JOIN আর COALESCE শূন্য বসিয়েছে। bk এর প্রতিটা Row এক Departure এর, তাই d এর কোনো Row দ্বিগুণ হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার টাকার হিসাব, যেখানে ভুলটা সবচেয়ে দামি। Sample Data তে প্রতিটা Booking এর সর্বোচ্চ একটা
                Payment, তাই আজ bookings আর payments জোড়া দিলে কিছু ফোলে না। কিন্তু বাস্তবে একটা Booking এর
                একাধিক Payment খুব স্বাভাবিক: প্রথম চেষ্টা ব্যর্থ, দ্বিতীয়টা সফল। Kamal Hasan এর Booking 14 এর
                bKash চেষ্টা ব্যর্থ হয়েছিল। ধরুন তিনি এবার Card দিয়ে আবার চেষ্টা করলেন আর সফল হলেন।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সটা সেই দ্বিতীয় Payment টা একটা Transaction এর ভেতরে যোগ করে, দুইভাবে হিসাব দেখায়,
                তারপর ROLLBACK দিয়ে সব আগের মতো ফিরিয়ে দেয়। Transaction এর খুঁটিনাটি Module 12 এ। এখন শুধু
                জানুন BEGIN থেকে ROLLBACK পর্যন্ত যা ঘটে, শেষে তার কোনো চিহ্ন থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় Payment: সরাসরি Join বনাম আগে যোগ"
              query={`BEGIN;

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
VALUES (14, 50000.00, 'card', 'paid', '2026-10-01 12:40:00+06');

-- সরাসরি Join: Booking এর টাকা দুইবার
SELECT c.full_name,
       sum(b.total_bdt) AS booked,
       sum(p.amount_bdt) FILTER (WHERE p.status = 'paid') AS paid,
       count(*) AS rows_seen
FROM customers c
JOIN bookings b      ON b.customer_id = c.customer_id
LEFT JOIN payments p ON p.booking_id  = b.booking_id
WHERE c.customer_id = 12
GROUP BY c.full_name;

-- আগে payments কে Booking প্রতি এক Row এ নামানো
SELECT c.full_name,
       sum(b.total_bdt)          AS booked,
       coalesce(sum(pay.paid), 0) AS paid
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
LEFT JOIN (
    SELECT booking_id,
           sum(amount_bdt) FILTER (WHERE status = 'paid') AS paid
    FROM payments
    GROUP BY booking_id
) AS pay ON pay.booking_id = b.booking_id
WHERE c.customer_id = 12
GROUP BY c.full_name;

ROLLBACK;`}
              caption="সরাসরি Join দেয় booked 100000.00, paid 50000.00, rows_seen 2: Booking 14 এর Row দুটো Payment এর সাথে জোড়া লেগে দুইবার এসেছে, তাই 50000 টাকার Booking দেখাচ্ছে 100000। দ্বিতীয় Query দেয় booked 50000.00, paid 50000.00: pay এর প্রতিটা Row এক Booking এর, তাই কিছু ফোলেনি। শেষের ROLLBACK নতুন Payment টা মুছে দিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  Departure আছে এমন প্রতিটা ট্যুরের <code className={CODE}>tour_id</code>, Departure এর সংখ্যা,
                  মোট খালি সিট (<code className={CODE}>seats_left</code> এর যোগ), আর বাতিল নয় এমন Booking এর মোট
                  সিট (কোনো না থাকলে 0)। Fan-out যেন না হয়। tour_id অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  ভেতরের Query তে <code className={CODE}>{"WHERE status <> 'cancelled'"}</code> দিয়ে bookings কে{" "}
                  <code className={CODE}>departure_id</code> প্রতি এক Row এ নামান। বাইরে tours JOIN departures,
                  তারপর সেই Derived Table এর সাথে LEFT JOIN, শেষে{" "}
                  <code className={CODE}>coalesce(sum(...), 0)</code>।
                </>
              }
              orderMatters
              solution={`SELECT t.tour_id,
       count(*)                   AS departures,
       sum(d.seats_left)          AS free_seats,
       coalesce(sum(bk.seats), 0) AS live_seats
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (
    SELECT departure_id, sum(seats) AS seats
    FROM bookings
    WHERE status <> 'cancelled'
    GROUP BY departure_id
) AS bk ON bk.departure_id = d.departure_id
GROUP BY t.tour_id
ORDER BY t.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "two-derived-tables",
      subHeader: { index: "009", title: "Two Derived Tables" },
      title: <SectionTitle>দুটো সারাংশ, একটা Report</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব এবার প্রতিটা ট্যুরের একটা পূর্ণ তালিকা চান: ট্যুরের নাম, কয়টা Departure, কয়টা
                সিট খালি, কয়টা Booking, আর confirmed আয় কত। departures আর bookings দুটোই tours এর নিচের
                Table, দুটো আলাদা শাখা। দুটো একসাথে tours এর সাথে জোড়া দিলে আবার Fan-out, এবার আরও খারাপ:
                Departure এর সংখ্যা Booking এর সংখ্যা দিয়ে গুণ হবে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান একই নিয়মের দুইবার প্রয়োগ। প্রতিটা শাখাকে আলাদা Derived Table এ tour_id প্রতি এক Row এ
                নামান। তারপর tours এর সাথে দুটোকেই LEFT JOIN করুন। এখন tours এর প্রতিটা Row প্রতিটা Derived
                Table থেকে সর্বোচ্চ একটা জোড়া পায়, তাই কিছুই দ্বিগুণ হয় না। আর LEFT JOIN বলে যে ট্যুরের কোনো
                Departure বা Booking নেই, সেও তালিকায় থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoDerivedDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের পূর্ণ সারাংশ"
              query={`SELECT t.tour_id,
       t.title,
       coalesce(dep.departures, 0) AS departures,
       coalesce(dep.free_seats, 0) AS free_seats,
       coalesce(s.bookings, 0)     AS bookings,
       coalesce(s.revenue, 0)      AS revenue
FROM tours t
LEFT JOIN (
    SELECT tour_id,
           count(*)        AS departures,
           sum(seats_left) AS free_seats
    FROM departures
    GROUP BY tour_id
) AS dep ON dep.tour_id = t.tour_id
LEFT JOIN (
    SELECT d.tour_id,
           count(*) AS bookings,
           sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS revenue
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    GROUP BY d.tour_id
) AS s ON s.tour_id = t.tour_id
ORDER BY t.tour_id;`}
              caption="৯ Row, প্রতিটা ট্যুর একবার। Saint Martin Island Escape: 4 Departure, 66 খালি সিট, 7 Booking, আয় 125000.00। Saint Martin Luxury Stay: 1, 10, 0, 0। Cox's Bazar Family Package এর কোনো Departure নেই, তাই চারটা ঘরেই 0। আয়ের সব ঘর যোগ করলে 423600.00, মোট confirmed আয়ের সাথে হুবহু মেলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো Derived Table জোড়ার আরেকটা চেনা ধরন হলো এক Row এর একটা সারাংশের সাথে জোড়া।
                &ldquo;যাঁদের confirmed খরচ গড় Customer এর চেয়ে বেশি&rdquo;: এখানে প্রতিজনের মোট লাগে (একটা
                Derived Table, ১২ Row), আর সেই মোটগুলোর গড় লাগে (আরেকটা Derived Table, এক Row)। এক Row এর
                Table কে বাকি সবার পাশে বসাতে CROSS JOIN, ঠিক যেমন Module 06 এ এক Row এর VALUES কে বসিয়েছিলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড়ের চেয়ে বেশি খরচ করেছেন যাঁরা"
              query={`SELECT c.full_name,
       s.spent,
       round(a.avg_spent, 2) AS avg_spent
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS s
CROSS JOIN (
    SELECT avg(spent) AS avg_spent
    FROM (
        SELECT customer_id, sum(total_bdt) AS spent
        FROM bookings
        WHERE status = 'confirmed'
        GROUP BY customer_id
    ) AS x
) AS a
JOIN customers c ON c.customer_id = s.customer_id
WHERE s.spent > a.avg_spent
ORDER BY s.spent DESC, c.full_name;`}
              caption="৬ জন, গড় 35300.00 এর উপরে: Nusrat Jahan 75000.00, Sumaiya Islam 70500.00, Rahim Uddin 44000.00, তারপর তিনজন 36000.00 করে (Farhana Akter, Lamia Haque, Mitu Rahman)। লক্ষ করুন, প্রতিজনের মোটের Query টা দুইবার লেখা হয়েছে, হুবহু একই। পরের লেসনের CTE ঠিক এই পুনরাবৃত্তি দূর করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  প্রতিজন Guide এর <code className={CODE}>guide_id</code>, <code className={CODE}>full_name</code>,
                  তাঁর ট্যুরের সংখ্যা, আর তাঁর সব ট্যুর মিলিয়ে মোট Booking এর সংখ্যা (সব Status)। যাঁর কোনো ট্যুর
                  নেই, তিনিও থাকবেন, সংখ্যার ঘরে 0। guide_id অনুযায়ী সাজান। দুটো আলাদা Derived Table ব্যবহার
                  করুন, যাতে ট্যুরের সংখ্যা ফুলে না ওঠে।
                </>
              }
              hint={
                <>
                  একটা Derived Table: <code className={CODE}>tours</code> থেকে guide_id প্রতি{" "}
                  <code className={CODE}>count(*)</code>। আরেকটা: bookings JOIN departures JOIN tours, guide_id প্রতি{" "}
                  <code className={CODE}>count(*)</code>। guides থেকে দুটোর সাথেই LEFT JOIN, তারপর COALESCE।
                </>
              }
              orderMatters
              solution={`SELECT g.guide_id,
       g.full_name,
       coalesce(tc.tours, 0)    AS tours,
       coalesce(bc.bookings, 0) AS bookings
FROM guides g
LEFT JOIN (
    SELECT guide_id, count(*) AS tours
    FROM tours
    GROUP BY guide_id
) AS tc ON tc.guide_id = g.guide_id
LEFT JOIN (
    SELECT t.guide_id, count(*) AS bookings
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours t      ON t.tour_id = d.tour_id
    GROUP BY t.guide_id
) AS bc ON bc.guide_id = g.guide_id
ORDER BY g.guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "keeping-the-zeros",
      subHeader: { index: "010", title: "Keeping the Zeros" },
      title: <SectionTitle>যাঁরা কিছু কেনেননি, তাঁরাও গোনায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Derived Table কে আসল Table এর সাথে জোড়া দেওয়ার সময় Join এর ধরন আবার গুরুত্বপূর্ণ। per_customer
                এ শুধু তাঁরাই আছেন, যাঁদের অন্তত একটা Booking আছে। customers এর সাথে INNER JOIN দিলে Imran
                Kabir হারিয়ে যান, কারণ per_customer এ তাঁর কোনো Row নেই। Module 06 এর তৃতীয় লেসনের সেই পুরনো
                সমস্যা, শুধু এবার ডান দিকের Table টা একটা Query থেকে বানানো।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানও পুরনো: LEFT JOIN, আর ফাঁকা ঘরে COALESCE। এর একটা দারুণ সুবিধা আছে। Pre-aggregation এর
                পরে LEFT JOIN দিলে Module 06 এর count(*) এর ফাঁদও আর থাকে না। ভেতরের count(*) গুনেছে আসল
                Booking, আর যাঁর কোনো Booking নেই, তাঁর ঘরে NULL, যেটা COALESCE বানায় 0। কোনো ভুয়া 1 আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="INNER দিলে ১৪ জন, LEFT দিলে ১৫ জন"
              query={`-- INNER JOIN: Booking ছাড়া মানুষ বাদ
SELECT count(*) AS customers_shown
FROM customers c
JOIN (
    SELECT customer_id, count(*) AS bookings
    FROM bookings
    GROUP BY customer_id
) AS s ON s.customer_id = c.customer_id;

-- LEFT JOIN আর COALESCE: সবাই, শূন্যসহ
SELECT c.customer_id,
       c.full_name,
       coalesce(s.bookings, 0) AS bookings,
       coalesce(s.spent, 0)    AS confirmed_spent
FROM customers c
LEFT JOIN (
    SELECT customer_id,
           count(*) AS bookings,
           sum(total_bdt) FILTER (WHERE status = 'confirmed') AS spent
    FROM bookings
    GROUP BY customer_id
) AS s ON s.customer_id = c.customer_id
ORDER BY c.customer_id;`}
              caption="প্রথমটা দেয় 14। দ্বিতীয়টা দেয় পুরো 15 জন। তিনজনের confirmed_spent 0: Sabbir Hossain (একমাত্র Booking বাতিল), Kamal Hasan (Booking এখনো pending), আর Imran Kabir (কোনো Booking নেই, bookings ও 0)। Sabbir আর Kamal এর bookings 1, কারণ তাঁদের Booking আছে, শুধু confirmed না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Theory এর তৃতীয় সংখ্যাটা, 28240.00, ব্যাখ্যা করা যায়। রুমানা আপা যদি জানতে চান
                &ldquo;Account খোলা প্রতিজন গড়ে কত কেনেন&rdquo;, তাহলে যাঁরা কিছু কেনেননি তাঁরাও শূন্য নিয়ে
                গড়ে বসবেন। ঠিক উপরের Query এর বাইরে একটা avg বসালেই উত্তর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব Customer এর গড়, শূন্যসহ"
              query={`SELECT round(avg(coalesce(s.spent, 0)), 2) AS avg_all_customers,
       count(*)                              AS customers
FROM customers c
LEFT JOIN (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS s ON s.customer_id = c.customer_id;`}
              caption="avg_all_customers 28240.00, customers 15। মোট আয় 423600.00 কে 15 দিয়ে ভাগ। COALESCE না দিলে avg NULL গুলোকে বাদ দিত আর উত্তর আসত 35300.00, ১২ জনের গড়: Module 05 এর সেই নিয়ম, Aggregate NULL কে এড়িয়ে যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  Admin Panel এর Customer তালিকা: সব ১৫ জনের <code className={CODE}>customer_id</code>,{" "}
                  <code className={CODE}>full_name</code>, তাঁদের Booking এর সংখ্যা (সব Status), আর confirmed
                  Booking এর মোট টাকা। কোনো কিছু না থাকলে NULL না, 0। customer_id অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  bookings কে customer_id প্রতি এক Row এ নামান, একই Query তে{" "}
                  <code className={CODE}>count(*)</code> আর{" "}
                  <code className={CODE}>{"sum(total_bdt) FILTER (WHERE status = 'confirmed')"}</code>। customers থেকে
                  LEFT JOIN, দুটো ঘরেই COALESCE।
                </>
              }
              orderMatters
              solution={`SELECT c.customer_id,
       c.full_name,
       coalesce(s.bookings, 0) AS bookings,
       coalesce(s.spent, 0)    AS confirmed_spent
FROM customers c
LEFT JOIN (
    SELECT customer_id,
           count(*) AS bookings,
           sum(total_bdt) FILTER (WHERE status = 'confirmed') AS spent
    FROM bookings
    GROUP BY customer_id
) AS s ON s.customer_id = c.customer_id
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "nesting-and-readability",
      subHeader: { index: "011", title: "Nesting and Readability" },
      title: <SectionTitle>বাটির ভেতরে বাটি, আর কোথায় থামবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Derived Table এর ভেতরে আরেকটা Derived Table বসানো যায়, তার ভেতরে আরেকটা। Database এর কোনো
                আপত্তি নেই। আপত্তি পাঠকের, মানে ছয় মাস পরের আপনার। &ldquo;যে মাসগুলোতে Booking গড় মাসের চেয়ে
                বেশি&rdquo;: এর জন্য মাসপ্রতি গণনা লাগে দুইবার, একবার মাসগুলোর জন্য, একবার গড়ের জন্য। লিখলে
                এমন দাঁড়ায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ভেতরের Query দুইবার"
              query={`SELECT m.month, m.bookings
FROM (
    SELECT to_char(booked_at, 'YYYY-MM') AS month,
           count(*)                       AS bookings
    FROM bookings
    GROUP BY 1
) AS m
CROSS JOIN (
    SELECT avg(bookings) AS avg_bookings
    FROM (
        SELECT to_char(booked_at, 'YYYY-MM') AS month,
               count(*)                       AS bookings
        FROM bookings
        GROUP BY 1
    ) AS x
) AS a
WHERE m.bookings > a.avg_bookings
ORDER BY m.month;`}
              caption="২টা মাস, গড় 4 এর উপরে: 2026-01 (6টা) আর 2026-10 (9টা)। ফলাফল ঠিক, কিন্তু Query টা পড়তে হয় ভেতর থেকে বাইরে, আর মাসপ্রতি গণনা হুবহু দুইবার লেখা। একটায় কিছু বদলালে আরেকটায় বদলাতে ভুলে গেলে দুটো আলাদা হিসাব হয়ে যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Derived Table এর দুটো সীমাবদ্ধতা এখানে পরিষ্কার। এক, তাকে পড়তে হয় ভেতর থেকে বাইরে, অথচ মানুষ
                পড়ে উপর থেকে নিচে। দুই, একটা Derived Table এর নাম শুধু তার নিজের Query এর ভেতরে চলে, তাই একই
                জিনিস দুই জায়গায় লাগলে দুইবার লিখতে হয়। পরের লেসনের{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  CTE
                </Link>{" "}
                ঠিক এই দুটো সমস্যার উত্তর: ভেতরের Query গুলো উপরে নাম দিয়ে একবার লেখা, তারপর নিচে যতবার খুশি
                ব্যবহার। ভাবনাটা একদম এক, শুধু লেখার ক্রম বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                ততক্ষণ একটা কাজের নিয়ম: এক স্তরের Derived Table প্রায় সবসময় পরিষ্কার। দুই স্তর হলে থেমে ভাবুন।
                একই ভেতরের Query দুইবার লিখতে হলে, বা Query পড়তে গিয়ে নিজেই হারিয়ে গেলে, সেটা CTE তে নেওয়ার
                সময়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্নের ধরন", "সবচেয়ে মানানসই হাতিয়ার", "কোথায় শিখবেন"],
          rows: [
            ["একটা মানের সাথে তুলনা: গড়ের চেয়ে দামি ট্যুর", "Scalar Subquery", "Lesson 01"],
            ["আছে কি নেই: কোনো confirmed Booking আছে এমন Customer", "EXISTS / IN", "Lesson 02, Module 06"],
            ["প্রতিটা Row এর নিজের হিসাব: প্রতি Customer এর সর্বশেষ Booking", "Correlated Subquery বা LATERAL", "Lesson 03, Module 06"],
            ["দুই ধাপের হিসাব, হিসাবের Column দিয়ে ছাঁকা, Join এর আগে যোগ", "Derived Table", "এই লেসন"],
            ["একই মাঝের ফলাফল একাধিকবার, বা লম্বা Report", "CTE", "Lesson 05"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "what-the-planner-does",
      subHeader: { index: "012", title: "What the Planner Does" },
      title: <SectionTitle>Database কি সত্যিই আগে ভেতরেরটা চালায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেকে ভাবেন Derived Table মানেই ধীর Query, কারণ Database কে আগে একটা আলাদা Table বানাতে হয়।
                বাস্তব আরও বুদ্ধিমান। PostgreSQL এর Planner, মানে যে অংশ ঠিক করে Query কোন পথে চলবে, প্রায়ই
                দুই স্তর মিলিয়ে একটা সাধারণ Query বানিয়ে ফেলে। এটাকে বলে Subquery কে টেনে তোলা বা Flatten
                করা। আর যেখানে মেলানো যায় না, যেমন ভেতরে GROUP BY থাকলে, সেখানেও সে বাইরের শর্তকে ভেতরে ঠেলে
                দেয়, যাতে কম Row নিয়ে কাজ হয়।
              </ContentParagraph>
              <ContentParagraph>
                এটা দেখার উপায় <code className={CODE}>EXPLAIN</code>, যেটা Query না চালিয়ে শুধু তার পরিকল্পনা
                দেখায়। <code className={CODE}>(COSTS OFF)</code> দিলে খরচের সংখ্যাগুলো লুকায়, শুধু ধাপগুলো থাকে।
                Plan পড়ার পুরো বিদ্যা Module 13 এ। এখানে শুধু তিনটা জিনিস খুঁজুন: কোন Table পড়া হচ্ছে, কোথায়
                Filter বসেছে, আর কোথায় Aggregate।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Derived Table, Planner এর চোখে"
              query={`-- ১. সাধারণ হিসাব আর ছাঁকা: পুরোটা মিলিয়ে একটা Query
EXPLAIN (COSTS OFF)
SELECT title, per_day
FROM (
    SELECT title, round(price_bdt / duration_days, 2) AS per_day
    FROM tours
) AS t
WHERE per_day > 4000;

-- ২. ভেতরে GROUP BY, বাইরে avg: দুই স্তরই থাকে
EXPLAIN (COSTS OFF)
SELECT round(avg(spent), 2)
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
) AS per_customer;

-- ৩. বাইরের শর্ত ভেতরে ঠেলে দেওয়া
EXPLAIN (COSTS OFF)
SELECT *
FROM (
    SELECT customer_id, sum(total_bdt) AS spent
    FROM bookings
    GROUP BY customer_id
) AS s
WHERE customer_id = 1;`}
              caption="প্রথম Plan এ মাত্র দুই লাইন: Seq Scan on tours, তার নিচে Filter এ পুরো per_day এর হিসাব। কোনো Subquery এর চিহ্ন নেই, Planner দুই স্তর মিলিয়ে ফেলেছে। দ্বিতীয়টায় উপরে Aggregate, নিচে GroupAggregate আর Seq Scan on bookings, দুই স্তর আলাদা থেকেছে। তৃতীয়টায় Filter: (customer_id = 1) বসেছে একদম নিচে, Seq Scan on bookings এ: বাইরের WHERE ভেতরে চলে গেছে, তাই মাত্র একজনের Row Group হয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "তাহলে Derived Table কখন ধীর",
          content: (
            <ContentList>
              <ListItem>
                ভেতরের Query যখন বিশাল একটা Table কে পুরোটা Group করে, অথচ বাইরে লাগে কয়েকটা Row, আর শর্তটা ভেতরে
                ঠেলে দেওয়া যায় না। তখন হয় শর্তটা নিজে ভেতরে লিখুন, নয়তো LATERAL ভাবুন।
              </ListItem>
              <ListItem>
                একই ভারী Derived Table একই Query তে দুইবার লেখা হলে, যেমন Section 11 এ, Database দুইবারই হিসাব করতে
                পারে। CTE বা একবার লেখার অন্য উপায় খুঁজুন।
              </ListItem>
              <ListItem>
                সন্দেহ হলে আন্দাজ না করে EXPLAIN চালান। কোন ধাপে কত Row, সেটাই আসল উত্তর।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Derived Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভাবনাটা MySQL এও হুবহু এক, আর এই লেসনের প্রায় সব Query MySQL 8.4 এ চলে। পার্থক্যগুলো ছোট,
                কিন্তু Error দেয়, তাই চেনা দরকার। নিচের প্রতিটা ফলাফল MySQL 8.4.11 এ আসল Island Tours Data তে
                চালানো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নাম বাধ্যতামূলক।</strong> নাম ছাড়া Derived Table এ MySQL বলে ERROR 1248: Every derived
                  table must have its own alias। PostgreSQL 16 এর আগের সব Version ও একই কথা বলত।
                </ListItem>
                <ListItem>
                  <strong>Column এর নাম অবশ্যই আলাদা।</strong> ভেতরে দুটো customer_id থাকলে MySQL শুরুতেই থামায়:
                  ERROR 1060: Duplicate column name। PostgreSQL চালায়, Error দেয় শুধু বাইরে থেকে ডাকলে।
                </ListItem>
                <ListItem>
                  <strong>নাম না দেওয়া হিসাবের Column</strong> এর নাম হয় পুরো Expression,{" "}
                  <code className={CODE}>SUM(total_bdt)</code>। বাইরে থেকে ডাকতে Backtick লাগে।
                </ListItem>
                <ListItem>
                  <strong>FILTER নেই।</strong> এই লেসনের যেখানে{" "}
                  <code className={CODE}>{"sum(...) FILTER (WHERE ...)"}</code>, MySQL এ সেখানে{" "}
                  <code className={CODE}>{"SUM(CASE WHEN ... THEN ... END)"}</code>।
                </ListItem>
                <ListItem>
                  <strong>Planner একই রকম বুদ্ধিমান।</strong> MySQL এর Optimizer সাধারণ Derived Table কে বাইরের
                  Query তে মিশিয়ে দেয় (derived_merge, Default এ চালু)। Aggregate থাকলে আলাদা করে বানায়, EXPLAIN
                  এ সেটা Materialize নামে দেখায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-derived.sql",
          code: `-- নাম ছাড়া
SELECT COUNT(*) FROM (SELECT customer_id FROM bookings GROUP BY customer_id);
-- ERROR 1248 (42000): Every derived table must have its own alias

-- দুই ধাপের গড়: PostgreSQL এর মতোই
SELECT ROUND(AVG(spent), 2) AS avg_spent
FROM (SELECT customer_id, SUM(total_bdt) AS spent
      FROM bookings WHERE status = 'confirmed'
      GROUP BY customer_id) AS per_customer;
-- 35300.00

-- নাম না দেওয়া Column: Backtick দিয়ে পুরো Expression
SELECT \`SUM(total_bdt)\` FROM (SELECT customer_id, SUM(total_bdt)
                              FROM bookings GROUP BY customer_id) AS t
ORDER BY 1 LIMIT 1;
-- 15600.00

-- একই নামের দুটো Column
SELECT * FROM (SELECT b.customer_id, c.customer_id
               FROM bookings b JOIN customers c ON c.customer_id = b.customer_id) AS t;
-- ERROR 1060 (42S21): Duplicate column name 'customer_id'

-- FILTER এর জায়গায় SUM(CASE ...)
SELECT c.customer_id, COALESCE(s.spent, 0) AS confirmed_spent
FROM customers c
LEFT JOIN (SELECT customer_id,
                  SUM(CASE WHEN status = 'confirmed' THEN total_bdt END) AS spent
           FROM bookings GROUP BY customer_id) AS s
       ON s.customer_id = c.customer_id
WHERE c.customer_id IN (5, 12, 15);
-- 5 | 0.00,  12 | 0.00,  15 | 0.00

-- Aggregate এর ভেতরে Aggregate
SELECT AVG(SUM(total_bdt)) FROM bookings GROUP BY customer_id;
-- ERROR 1111 (HY000): Invalid use of group function`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ COALESCE এর ফলাফল",
          content: (
            <ContentParagraph>
              উপরের শেষ উদাহরণে MySQL শূন্যকে দেখিয়েছে 0.00, আর PostgreSQL দেখায় 0। কারণ PostgreSQL এ{" "}
              <code className={CODE}>coalesce(NULL, 0)</code> এর 0 একটা সাধারণ পূর্ণসংখ্যা হিসেবে আসে, আর MySQL
              পুরো Column কে DECIMAL ধরে দুই দশমিক দেখায়। মান একই, শুধু দেখানোর ধরন আলাদা। দুই দশমিক চাইলে
              PostgreSQL এ <code className={CODE}>coalesce(s.spent, 0.00)</code> লিখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours: Destination প্রতি আয়ের Report</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের শেষে রুমানা আপা Destination প্রতি একটা Report দেখেন: প্রতিটা জায়গায় কয়টা ট্যুর চালু
                আছে, কয়টা Booking এসেছে, আর confirmed আয় কত। এই Report দেখে তিনি ঠিক করেন সামনের মৌসুমে
                কোথায় নতুন ট্যুর খুলবেন। আগের Report টা এক টানা Join দিয়ে লেখা ছিল, আর সেটা বলছিল Saint
                Martin&apos;s Island এ আটটা ট্যুর আছে। আসলে আছে দুটো।
              </ContentParagraph>
              <ContentParagraph>
                ভুলটা চেনা: destinations থেকে tours, tours থেকে departures, departures থেকে bookings। প্রতিটা
                Booking এর জন্য তার ট্যুরের Row একবার করে আসে, তাই count(tour_id) আসলে Booking গুনছে। নিচের
                বক্সে আগে পুরনো Report, তারপর Pre-aggregation দিয়ে ঠিক করা Report।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো Report বনাম ঠিক Report"
              query={`-- পুরনো: এক টানা Join, ট্যুরের সংখ্যা ফুলে গেছে
SELECT ds.name,
       count(tr.tour_id)   AS tours,
       count(b.booking_id) AS bookings,
       sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS revenue
FROM destinations ds
LEFT JOIN tours tr     ON tr.destination_id = ds.destination_id
LEFT JOIN departures d ON d.tour_id = tr.tour_id
LEFT JOIN bookings b   ON b.departure_id = d.departure_id
GROUP BY ds.name
ORDER BY revenue DESC NULLS LAST, ds.name;

-- ঠিক: প্রতিটা শাখা আগে নিজের স্তরে, তারপর জোড়া
SELECT ds.name,
       coalesce(t.tours, 0)    AS tours,
       coalesce(s.bookings, 0) AS bookings,
       coalesce(s.revenue, 0)  AS revenue
FROM destinations ds
LEFT JOIN (
    SELECT destination_id, count(*) AS tours
    FROM tours
    GROUP BY destination_id
) AS t ON t.destination_id = ds.destination_id
LEFT JOIN (
    SELECT tr.destination_id,
           count(*) AS bookings,
           sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS revenue
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours tr     ON tr.tour_id = d.tour_id
    GROUP BY tr.destination_id
) AS s ON s.destination_id = ds.destination_id
ORDER BY revenue DESC, ds.name;`}
              caption="পুরনো Report এ Saint Martin's Island এর tours 8, Cox's Bazar 5, Sundarbans 4। ঠিক Report এ যথাক্রমে 2, 2, 1। bookings আর revenue দুটো Report এই এক, কারণ সেগুলো সবচেয়ে নিচের স্তরের, কোনো Fan-out এর শিকার না। দুটোই ৭ Row, Kuakata তে সব শূন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Finance এবার এই Report এ আরেকটা Column চায়: সত্যিই কত টাকা এসেছে, মানে payments এ paid অবস্থার
                টাকার যোগ। payments ঝুলে আছে bookings এর আরও এক ধাপ নিচে। সেটাকে বাকি সবার সাথে একই Join এ জুড়ে
                দিলে বিপদ ফিরে আসবে, যেই মুহূর্তে কোনো Booking এর দুটো Payment হবে। নিচের Challenge এ আপনি ঠিক
                সেটা নিরাপদে যোগ করবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  Destination প্রতি Report: <code className={CODE}>name</code>, ট্যুরের সংখ্যা, Booking এর সংখ্যা (সব
                  Status), confirmed আয়, আর paid Payment এর মোট টাকা (<code className={CODE}>payments.status</code>{" "}
                  ={" "}
                  <code className={CODE}>{"'paid'"}</code>)। সাতটা Destination ই থাকবে, ঘাটতির ঘরে 0। আয় বেশি থেকে কম
                  ক্রমে, আয় সমান হলে নাম অনুযায়ী সাজান। কোনো শাখা যেন আরেকটাকে না ফোলায়।
                </>
              }
              hint={
                <>
                  তিনটা আলাদা Derived Table: tours থেকে destination প্রতি ট্যুর গণনা; bookings JOIN departures JOIN tours
                  থেকে destination প্রতি Booking আর আয়; payments JOIN bookings JOIN departures JOIN tours থেকে{" "}
                  <code className={CODE}>{"WHERE p.status = 'paid'"}</code> দিয়ে destination প্রতি paid। destinations থেকে
                  তিনটার সাথেই LEFT JOIN, তারপর <code className={CODE}>ORDER BY revenue DESC, ds.name</code>।
                </>
              }
              orderMatters
              solution={`SELECT ds.name,
       coalesce(t.tours, 0)    AS tours,
       coalesce(s.bookings, 0) AS bookings,
       coalesce(s.revenue, 0)  AS revenue,
       coalesce(p.paid, 0)     AS paid
FROM destinations ds
LEFT JOIN (
    SELECT destination_id, count(*) AS tours
    FROM tours
    GROUP BY destination_id
) AS t ON t.destination_id = ds.destination_id
LEFT JOIN (
    SELECT tr.destination_id,
           count(*) AS bookings,
           sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS revenue
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours tr     ON tr.tour_id = d.tour_id
    GROUP BY tr.destination_id
) AS s ON s.destination_id = ds.destination_id
LEFT JOIN (
    SELECT tr.destination_id,
           sum(pm.amount_bdt) AS paid
    FROM payments pm
    JOIN bookings b   ON b.booking_id = pm.booking_id
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours tr     ON tr.tour_id = d.tour_id
    WHERE pm.status = 'paid'
    GROUP BY tr.destination_id
) AS p ON p.destination_id = ds.destination_id
ORDER BY revenue DESC, ds.name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Derived Table Query লেখার ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "উত্তরের এক Row কী বোঝাবে, আগে ঠিক করুন",
              description:
                "প্রশ্নটা পড়ে লিখে ফেলুন ফলাফলের প্রতিটা Row কী: একজন মানুষ, একটা মাস, একটা ট্যুর, নাকি পুরো ব্যবসা এক Row এ। Theory এর তিনটা উত্তর আলাদা হয়েছিল ঠিক এই সিদ্ধান্তে।",
            },
            {
              title: "দুই স্তর লাগবে কিনা চিনুন",
              description:
                "প্রশ্নে একটা হিসাবের উপর আরেকটা হিসাব থাকলে (মোটের গড়, গণনার সর্বোচ্চ), অথবা SELECT এ বানানো কিছু দিয়ে ছাঁকতে হলে, অথবা একাধিক শাখা জোড়া দিয়ে যোগ করতে হলে, Derived Table লাগবে।",
            },
            {
              title: "ভেতরের Query টা একা লিখে চালান",
              description:
                "বন্ধনী ছাড়া, স্বাধীনভাবে। Row গুনুন, Column দেখুন। ভেতরের ফলাফল ভুল হলে বাইরের কিছুই ঠিক হবে না, আর একা চালালে ভুলটা সবচেয়ে সহজে ধরা পড়ে।",
            },
            {
              title: "প্রতিটা হিসাবের Column কে নাম দিন",
              description:
                "sum, count, round, সবকিছুর পাশে AS দিয়ে একটা অর্থপূর্ণ নাম। বাইরে যে Column গুলো লাগবে, সেগুলো ভেতরের SELECT তালিকায় আছে কিনা মিলিয়ে নিন।",
            },
            {
              title: "বন্ধনীতে মুড়ে নাম দিন",
              description:
                "FROM ( ... ) AS অর্থপূর্ণ_নাম। per_customer, monthly, bk: নামটা যেন বলে দেয় এই Table এর এক Row কী।",
            },
            {
              title: "বাইরের Query লিখুন, যেন এটা একটা সাধারণ Table",
              description:
                "WHERE, GROUP BY, JOIN, ORDER BY, সবই আগের মতো। শুধু মনে রাখুন, বাইরে থেকে কেবল ভেতরের ফলাফলের Column দেখা যায়।",
            },
            {
              title: "Join থাকলে আগে যোগ, পরে জোড়া",
              description:
                "কোনো নিচের Table এর সংখ্যা যোগ করতে হলে আগে তাকে Join এর চাবি প্রতি এক Row এ নামান। LEFT JOIN দিলে ফাঁকা ঘরে COALESCE।",
            },
            {
              title: "একটা সহজ Query দিয়ে মিলিয়ে দেখুন",
              description:
                "মোট আয়, মোট Booking, মোট মানুষ: যেকোনো একটা পরিচিত মোট আলাদা Query তে বের করে Report এর যোগফলের সাথে মেলান। না মিললে কোথাও Fan-out বা হারানো Row আছে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "যা দেখবেন", "ঠিক করার উপায়"],
          rows: [
            [
              "Aggregate এর ভেতরে Aggregate: avg(sum(x))",
              "aggregate function calls cannot be nested (MySQL: ERROR 1111)",
              "ভেতরের Aggregate কে Derived Table এ নিন, বাইরে দ্বিতীয়টা",
            ],
            [
              "Derived Table এর নাম নেই",
              "PostgreSQL 16+ এ চলে, MySQL এ ERROR 1248",
              "সবসময় AS অর্থপূর্ণ_নাম লিখুন",
            ],
            [
              "হিসাবের Column এর নাম নেই",
              "বাইরে sum, count, ?column? নামে ডাকতে হয়, দুটো একই নাম হলে ambiguous",
              "ভেতরে AS spent, অথবা AS t(cid, spent)",
            ],
            [
              "বাইরে থেকে ভেতরের Table এর Column ডাকা",
              "column \"status\" does not exist",
              "লাগলে Column টা ভেতরের SELECT তালিকায় রাখুন",
            ],
            [
              "নিচের Table জোড়া দিয়ে তারপর উপরের সংখ্যা যোগ",
              "সংখ্যা ফুলে ওঠে, Error নেই: 66 এর জায়গায় 113",
              "Pre-aggregation: আগে নিচের Table কে চাবি প্রতি এক Row এ",
            ],
            [
              "Fan-out ঢাকতে sum(DISTINCT ...)",
              "সমান মানের আলাদা Row হারায়, সংখ্যা কমে যায়",
              "DISTINCT না, ক্রম বদলান: আগে যোগ, পরে জোড়া",
            ],
            [
              "Derived Table এর সাথে INNER JOIN, অথচ সবাইকে চাই",
              "Imran এর মতো শূন্যের মানুষ হারিয়ে যান",
              "LEFT JOIN আর COALESCE",
            ],
            [
              "ভেতরে ORDER BY দিয়ে ভাবা বাইরের ক্রমও তাই হবে",
              "কখনো ঠিক আসে, কখনো না, কোনো নিশ্চয়তা নেই",
              "ক্রম চাইলে সবচেয়ে বাইরের Query তে ORDER BY",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে বিপজ্জনকটা Error দেয় না",
          content: (
            <ContentParagraph>
              তালিকার প্রথম চারটা ভুল Database নিজেই ধরে, Error দিয়ে থামিয়ে দেয়। পরের চারটা নীরব: Query
              চলে, সংখ্যা আসে, শুধু সংখ্যাটা ভুল। এগুলো ধরার একমাত্র উপায় Step-by-step Flow এর শেষ ধাপ: একটা
              পরিচিত মোট দিয়ে Report মিলিয়ে দেখা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-SUBQUERIES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  PostgreSQL Docs: Subqueries in FROM
                </a>
                : Derived Table এর অফিসিয়াল বর্ণনা, VALUES সহ, আর কেন নাম লেখা ভালো অভ্যাস।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/release/16.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  PostgreSQL 16 Release Notes
                </a>
                : যেখানে লেখা আছে FROM এর Subquery এর নাম ঐচ্ছিক হলো।
              </ListItem>
              <ListItem>
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/derived-tables.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  MySQL 8.4 Manual: Derived Tables
                </a>
                : নামের বাধ্যবাধকতা, আলাদা Column নাম, আর Column তালিকার নিয়ম।
              </ListItem>
              <ListItem>
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/derived-table-optimization.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  MySQL 8.4 Manual: Optimizing Derived Tables
                </a>
                : কখন MySQL Derived Table কে মিশিয়ে দেয় আর কখন আলাদা করে বানায়।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  আপনার MySQL ভিডিও কোর্সের Subquery অংশ (02:53:54 থেকে)
                </a>
                : MySQL এ লেখা, তাই নামের বাধ্যবাধকতাটা সেখানে সবসময় দেখবেন।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>এক নজরে Derived Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  প্রতিটা SELECT এর ফলাফল একটা Table। তাকে বন্ধনীতে মুড়ে নাম দিয়ে FROM এ বসালে সেটা Derived
                  Table, একটা অস্থায়ী Table যার আয়ু শুধু সেই Query।
                </ListItem>
                <ListItem>
                  দুই ধাপের হিসাব, যেমন মোটের গড় বা গণনার সর্বোচ্চ, এক Query তে হয় না, কারণ Aggregate এর ভেতরে
                  Aggregate চলে না। ভেতরে প্রথম ধাপ, বাইরে দ্বিতীয়।
                </ListItem>
                <ListItem>
                  &ldquo;গড়ে কত&rdquo; প্রশ্নের আগে ঠিক করুন গড়টা কীসের উপর: Booking প্রতি 24917.65, কেনা মানুষ প্রতি
                  35300.00, সব মানুষ প্রতি 28240.00।
                </ListItem>
                <ListItem>
                  নাম দিন: Table কে (MySQL এ বাধ্যতামূলক, PostgreSQL 16 থেকে ঐচ্ছিক) আর প্রতিটা হিসাবের Column কে।
                  বাইরে থেকে শুধু ভেতরের ফলাফলের Column দেখা যায়।
                </ListItem>
                <ListItem>
                  SELECT এ বানানো Column দিয়ে ছাঁকতে চাইলে হিসাবটা ভেতরে করে নাম দিন, বাইরের WHERE তাকে চিনবে।
                </ListItem>
                <ListItem>
                  Join এর পরে সংখ্যা ফুলে উঠলে ক্রম বদলান: আগে নিচের Table কে চাবি প্রতি এক Row এ যোগ করুন, তারপর
                  জোড়া দিন। Tour 1 এর খালি সিট তখন 113 না, ঠিক 66।
                </ListItem>
                <ListItem>
                  সবাইকে রাখতে LEFT JOIN আর COALESCE। Planner প্রায়ই Derived Table কে মিশিয়ে দেয় বা শর্ত ভেতরে
                  ঠেলে দেয়, তাই এটা নিজে থেকে ধীর না। সন্দেহ হলে EXPLAIN।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Section 11 এ দেখেছেন একই ভেতরের Query দুইবার লেখার কষ্ট, আর ভেতর থেকে বাইরে পড়ার ঝামেলা। পরের
                লেসনে সেই একই ভাবনা লেখা হবে উপর থেকে নিচে, নাম দিয়ে, একবার:{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  CTEs with WITH
                </Link>
                । এই লেসনের প্রতিটা Query সেখানে আরও পড়ার মতো হয়ে ফিরবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক কথায়", "Island Tours এ উদাহরণ"],
    rows: [
      ["Derived Table", "FROM এ বন্ধনীতে মোড়া একটা Query, নাম সহ", "FROM (SELECT ... GROUP BY customer_id) AS per_customer"],
      ["দুই স্তরের হিসাব", "ভেতরে প্রথম Aggregate, বাইরে দ্বিতীয়", "কেনা মানুষ প্রতি গড় 35300.00"],
      ["Aggregate এর ভেতরে Aggregate", "চলে না, Error দেয়", "avg(sum(total_bdt)) থামে"],
      ["প্রশ্নের স্তর", "গড়টা কীসের উপর, আগে ঠিক করা", "24917.65, 35300.00, 28240.00"],
      ["নামের নিয়ম", "MySQL এ বাধ্যতামূলক, PostgreSQL 16 থেকে ঐচ্ছিক", "ERROR 1248 বনাম চলে যাওয়া"],
      ["Column এর নাম", "হিসাবের Column এ AS, অথবা AS t(cid, spent)", "দুটো count হলে ambiguous"],
      ["বাইরের দৃষ্টি", "শুধু ভেতরের ফলাফলের Column দেখা যায়", "status does not exist"],
      ["হিসাবের Column দিয়ে ছাঁকা", "ভেতরে হিসাব, বাইরে WHERE", "per_day > 4000: ৬টা ট্যুর"],
      ["Pre-aggregation", "আগে চাবি প্রতি এক Row এ যোগ, পরে জোড়া", "Tour 1 এর খালি সিট 66, 113 না"],
      ["দুটো Derived Table", "প্রতিটা শাখা আলাদা, তারপর LEFT JOIN", "৯ ট্যুরের পূর্ণ সারাংশ"],
      ["শূন্য রাখা", "LEFT JOIN আর COALESCE", "১৫ জন Customer, Imran এর 0"],
      ["Planner", "প্রায়ই মিশিয়ে দেয় বা শর্ত ভেতরে ঠেলে দেয়", "EXPLAIN এ শুধু Seq Scan on tours"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "তানিম লিখলেন SELECT avg(sum(total_bdt)) FROM bookings GROUP BY customer_id। PostgreSQL কী করবে?",
        options: [
          {
            key: "A",
            text: "প্রতিজনের মোটের গড় দেবে, 42307.14",
            isCorrect: false,
            explanation: "সংখ্যাটা ঠিক হিসাবের, কিন্তু এই লেখায় PostgreSQL সেখানে পৌঁছায়ই না। একটা Aggregate আরেকটার ভেতরে বসতে পারে না।",
          },
          {
            key: "B",
            text: "Error দেবে: aggregate function calls cannot be nested",
            isCorrect: true,
            explanation: "ঠিক। GROUP BY একবারই দল বানায়, তাই দুই ধাপের হিসাবের জন্য দুই স্তরের Query লাগে: ভেতরে sum, বাইরে avg।",
          },
          {
            key: "C",
            text: "প্রতিটা Customer এর জন্য একটা করে Row দেবে",
            isCorrect: false,
            explanation: "GROUP BY দেখে তাই মনে হতে পারে, কিন্তু Query টা চলার আগেই Error এ থামে।",
          },
          {
            key: "D",
            text: "Booking প্রতি গড় দেবে, 24679.17",
            isCorrect: false,
            explanation: "সেটা avg(total_bdt) এর উত্তর। নেস্ট করা Aggregate কোনো উত্তরই দেয় না, Error দেয়।",
          },
        ],
      },
      {
        id: 2,
        text: "ভেতরের Query তে WHERE status = 'confirmed' আছে, কিন্তু ভেতরের SELECT এ শুধু customer_id আর spent। বাইরের Query তে SELECT status লিখলে কী হবে?",
        options: [
          {
            key: "A",
            text: "সব Row এ confirmed দেখাবে",
            isCorrect: false,
            explanation: "ভেতরে ছাঁকা হয়েছে ঠিকই, কিন্তু status ফলাফলের Column না। বাইরে থেকে তার নাম জানাই যায় না।",
          },
          {
            key: "B",
            text: "NULL দেখাবে",
            isCorrect: false,
            explanation: "না-থাকা Column NULL হয় না, Error দেয়।",
          },
          {
            key: "C",
            text: "Error: column \"status\" does not exist",
            isCorrect: true,
            explanation: "ঠিক। বাইরের Query এর কাছে Derived Table ই একমাত্র Table, আর তার Column মাত্র দুটো। লাগলে status কে ভেতরের SELECT তালিকায় রাখতে হয়।",
          },
          {
            key: "D",
            text: "PostgreSQL নিজে থেকে bookings.status খুঁজে নেবে",
            isCorrect: false,
            explanation: "বাইরের Query bookings কে দেখেই না, শুধু per_customer কে দেখে।",
          },
        ],
      },
      {
        id: 3,
        text: "FROM (SELECT customer_id FROM bookings GROUP BY customer_id) লিখলেন, কোনো নাম ছাড়া। কোন কথাটা সঠিক?",
        options: [
          {
            key: "A",
            text: "PostgreSQL 18 আর MySQL 8.4 দুটোই Error দেবে",
            isCorrect: false,
            explanation: "PostgreSQL 16 থেকে নাম ঐচ্ছিক, তাই PostgreSQL 18 চালায়। শুধু MySQL Error দেয়।",
          },
          {
            key: "B",
            text: "PostgreSQL 18 চালাবে, MySQL 8.4 দেবে ERROR 1248, তাই নাম লেখাই ভালো অভ্যাস",
            isCorrect: true,
            explanation: "ঠিক। SQL Standard নাম চায়, MySQL কড়াভাবে মানে, আর PostgreSQL এর Docs ও নাম লেখার পরামর্শ দেয়।",
          },
          {
            key: "C",
            text: "দুটোই চালাবে, নাম শুধু সৌন্দর্যের জন্য",
            isCorrect: false,
            explanation: "MySQL নাম ছাড়া Derived Table চালায়ই না: Every derived table must have its own alias।",
          },
          {
            key: "D",
            text: "MySQL চালাবে, PostgreSQL Error দেবে",
            isCorrect: false,
            explanation: "উল্টো। নাম নিয়ে কড়া MySQL, ঢিলে PostgreSQL 16 আর তার পরের Version।",
          },
        ],
      },
      {
        id: 4,
        text: "tours, departures আর bookings একসাথে জোড়া দিয়ে tour_id ধরে sum(d.seats_left) নিলে Tour 1 এর খালি সিট আসে 113, আসলে 66। কারণ কী?",
        options: [
          {
            key: "A",
            text: "seats_left এ ভুল Data আছে",
            isCorrect: false,
            explanation: "Data ঠিক আছে। departures থেকে একা যোগ করলে 66 ই আসে।",
          },
          {
            key: "B",
            text: "LEFT JOIN এর কারণে NULL যোগ হয়েছে",
            isCorrect: false,
            explanation: "NULL যোগফলে কিছু বাড়ায় না, Aggregate NULL এড়িয়ে যায়।",
          },
          {
            key: "C",
            text: "যে Departure এ একাধিক Booking, তার Row প্রতিটা Booking এর জন্য একবার করে এসেছে, তাই তার seats_left বারবার যোগ হয়েছে",
            isCorrect: true,
            explanation: "ঠিক, এটাই Fan-out। Departure 1, 2 আর 8 এ দুটো করে Booking, তাই তাদের seats_left দুইবার করে। ৪টা Departure থেকে ৭টা Row।",
          },
          {
            key: "D",
            text: "GROUP BY ভুল Column এ হয়েছে",
            isCorrect: false,
            explanation: "tour_id ধরে Group করাটা ঠিকই আছে। সমস্যা Group এর আগে Row গুলোর পুনরাবৃত্তিতে।",
          },
        ],
      },
      {
        id: 5,
        text: "Fan-out ঠিক করার নির্ভরযোগ্য উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "sum(DISTINCT d.seats_left)",
            isCorrect: false,
            explanation: "DISTINCT একটা মানকে একবার যোগ করে, Row কে না। দুটো Departure এর seats_left যদি দুটোই 14 হয়, একটা হারায়।",
          },
          {
            key: "B",
            text: "bookings কে আগে Derived Table এ departure_id প্রতি এক Row এ যোগ করে নিয়ে তারপর জোড়া দেওয়া",
            isCorrect: true,
            explanation: "ঠিক, Pre-aggregation। তখন প্রতিটা Departure Join এ ঠিক একটা Row পায়, কিছু দ্বিগুণ হয় না।",
          },
          {
            key: "C",
            text: "LEFT JOIN এর জায়গায় INNER JOIN দেওয়া",
            isCorrect: false,
            explanation: "Join এর ধরন বদলালে কোন Row থাকবে সেটা বদলায়, পুনরাবৃত্তি বন্ধ হয় না।",
          },
          {
            key: "D",
            text: "শেষে ফলাফলকে Booking সংখ্যা দিয়ে ভাগ করা",
            isCorrect: false,
            explanation: "প্রতিটা Departure এর Booking সংখ্যা আলাদা, তাই একটা ভাগে সব ঠিক হয় না। জোড়াতালি না, ক্রম বদলাতে হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "customers এর সাথে প্রতিজনের Booking গণনার Derived Table INNER JOIN করলে ১৪ জন আসেন, অথচ Customer ১৫ জন। কে বাদ পড়লেন, আর কেন?",
        options: [
          {
            key: "A",
            text: "Sabbir Hossain, কারণ তাঁর Booking বাতিল",
            isCorrect: false,
            explanation: "বাতিল হলেও Booking আছে, তাই Derived Table এ তাঁর Row আছে, bookings 1।",
          },
          {
            key: "B",
            text: "Imran Kabir, কারণ তাঁর কোনো Booking নেই, তাই Derived Table এ তাঁর Row নেই",
            isCorrect: true,
            explanation: "ঠিক। INNER JOIN জোড়া না পেলে Row ফেলে দেয়। সবাইকে রাখতে LEFT JOIN আর COALESCE, তখন তাঁর ঘরে 0।",
          },
          {
            key: "C",
            text: "Kamal Hasan, কারণ তাঁর Booking pending",
            isCorrect: false,
            explanation: "pending হলেও Booking আছে। Derived Table এ সব Status গোনা হয়েছে।",
          },
          {
            key: "D",
            text: "কেউ বাদ পড়েননি, Derived Table নিজেই ১৪ জন বানায়",
            isCorrect: false,
            explanation: "Derived Table ১৪ Row বানায় ঠিকই, আর সেই কারণেই customers এর একজনের জোড়া নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT title, per_day FROM (SELECT title, round(price_bdt / duration_days, 2) AS per_day FROM tours) AS t WHERE per_day > 4000 এর EXPLAIN এ শুধু দেখা গেল Seq Scan on tours আর তার Filter। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Planner Derived Table টা বাদ দিয়ে ভুল Query চালিয়েছে",
            isCorrect: false,
            explanation: "ফলাফল একই থাকে। Planner শুধু লেখার ধরন বদলেছে, অর্থ না।",
          },
          {
            key: "B",
            text: "Planner দুই স্তর মিলিয়ে একটা সাধারণ Query বানিয়েছে, per_day এর হিসাব সরাসরি Filter এ বসেছে",
            isCorrect: true,
            explanation: "ঠিক। ভেতরে GROUP BY বা এমন কিছু না থাকলে Planner Subquery টেনে তোলে। তাই সাধারণ Derived Table নিজে থেকে ধীর না।",
          },
          {
            key: "C",
            text: "Derived Table আগে আলাদা Table হিসেবে Disk এ লেখা হয়েছে",
            isCorrect: false,
            explanation: "তাহলে Plan এ আলাদা একটা ধাপ দেখা যেত। এখানে মাত্র একটা Scan।",
          },
          {
            key: "D",
            text: "Query টা চলেনি কারণ EXPLAIN Error দিয়েছে",
            isCorrect: false,
            explanation: "EXPLAIN Query চালায় না, শুধু পরিকল্পনা দেখায়, আর এখানে কোনো Error নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "রুমানা আপা জানতে চান: যাঁরা অন্তত একটা confirmed ট্যুর কিনেছেন, তাঁরা মানুষ প্রতি গড়ে কত টাকার confirmed ট্যুর কিনেছেন? সঠিক উত্তর কোনটা?",
        options: [
          {
            key: "A",
            text: "24917.65",
            isCorrect: false,
            explanation: "এটা confirmed Booking প্রতি গড়, যেখানে দুটো Booking করা মানুষ দুইবার গোনা হন।",
          },
          {
            key: "B",
            text: "28240.00",
            isCorrect: false,
            explanation: "এটা সব ১৫ জন Customer এর গড়, যাঁরা কিছু কেনেননি তাঁদের শূন্যসহ।",
          },
          {
            key: "C",
            text: "35300.00",
            isCorrect: true,
            explanation: "ঠিক। প্রথমে ১২ জনের প্রতিজনের confirmed মোট, তারপর সেই ১২টা মোটের গড়: 423600 কে 12 দিয়ে ভাগ।",
          },
          {
            key: "D",
            text: "42307.14",
            isCorrect: false,
            explanation: "এটা প্রতিজনের মোটের গড়, কিন্তু সব Status এর Booking ধরে, বাতিল আর pending সহ। প্রশ্ন শুধু confirmed চেয়েছে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Derived Table দিয়ে Island Tours এর Report",
    time: "২-৩ ঘণ্টা",
    difficulty: "Intermediate",
    tasks: [
      <>
        <strong>তিনটা গড়, তিনটা প্রশ্ন:</strong> নিজের PostgreSQL এর island_tours এ Booking প্রতি, কেনা মানুষ প্রতি
        আর সব মানুষ প্রতি confirmed গড় তিনটা আলাদা Query তে বের করুন। প্রতিটার পাশে এক লাইনে লিখুন সেটা ঠিক কোন
        প্রশ্নের উত্তর, আর কোন পরিস্থিতিতে রুমানা আপার ওটাই দরকার।
      </>,
      <>
        <strong>মাসের হিসাব:</strong> Derived Table দিয়ে মাসপ্রতি Booking গণনার উপর সবচেয়ে ব্যস্ত মাস, সবচেয়ে
        শান্ত মাস আর মাসপ্রতি গড় বের করুন। তারপর গড়ের চেয়ে বেশি Booking এর মাসগুলো তালিকা করুন। শুরুতে{" "}
        <code className={CODE}>{"SET TimeZone = 'Asia/Dhaka';"}</code> দিতে ভুলবেন না।
      </>,
      <>
        <strong>Fan-out শিকার:</strong> guides থেকে tours, departures আর bookings এক টানা LEFT JOIN দিয়ে প্রতি
        Guide এর ট্যুর সংখ্যা আর Booking সংখ্যা বের করুন। কোন সংখ্যা ফুলেছে আর কেন, লিখুন। তারপর দুটো Derived
        Table দিয়ে ঠিক করুন আর দুই ফলাফল পাশাপাশি রাখুন।
      </>,
      <>
        <strong>Payment এর স্বাস্থ্য:</strong> প্রতিটা Payment Method (bkash, nagad, card, bank) এর জন্য কয়টা
        Booking এর টাকা সেই Method এ এসেছে আর তাদের মোট Booking অঙ্ক কত, এমন একটা Report লিখুন যেখানে একটা Booking
        এর একাধিক Payment থাকলেও কিছু দ্বিগুণ হবে না। একটা Transaction এর ভেতরে একটা দ্বিতীয় Payment যোগ করে
        প্রমাণ দেখান, শেষে ROLLBACK।
      </>,
      <>
        <strong>শেখান:</strong> একজন বন্ধুকে Derived Table বোঝান per_customer এর উদাহরণ দিয়ে। পাঁচ বাক্যে লিখুন:
        Derived Table কী, কেন লাগে, নামের নিয়ম, Fan-out এ এর কাজ, আর কখন CTE ভালো।
      </>,
    ],
    deliverables: [
      <>একটা <code className={CODE}>derived-tables.sql</code> ফাইল, প্রতিটা কাজের Query আলাদা মন্তব্যসহ।</>,
      <>প্রতিটা Query এর আসল ফলাফল (psql এর Output কপি করে), Row সংখ্যাসহ।</>,
      <>Fan-out শিকারের ভুল আর ঠিক ফলাফল পাশাপাশি, কোন ঘর কত ফুলেছিল চিহ্নিত।</>,
      <>পাঁচ বাক্যের ব্যাখ্যা, যেটা পড়ে একজন নতুন মানুষ বুঝতে পারবেন।</>,
    ],
  },
  practicalLab: {
    title: "নিজের PostgreSQL এ Derived Table Drill",
    subtitle: "Module 02 এ Load করা island_tours এ psql দিয়ে ছয়টা Drill, প্রতিটার প্রত্যাশিত ফলাফল মন্তব্যে",
    stepName: "ধাপ",
    steps: [
      {
        title: "Database এ ঢুকুন",
        description: "Terminal এ psql -d island_tours চালান। Prompt এ island_tours=# দেখলে ঠিক আছে। প্রতিটা ফাইল \\i দিয়ে বা কপি করে চালাতে পারেন।",
      },
      {
        title: "দুই স্তরের গড় আর মাসের হিসাব",
        description: "01 নম্বর ফাইল চালান। তিনটা গড় আর মাসের সারাংশ মন্তব্যের সংখ্যার সাথে মিলিয়ে নিন।",
      },
      {
        title: "নামের নিয়ম পরীক্ষা",
        description: "02 নম্বর ফাইলে নাম ছাড়া Derived Table, Column তালিকা আর ambiguous Error নিজের চোখে দেখুন।",
      },
      {
        title: "হিসাবের Column দিয়ে ছাঁকা",
        description: "03 নম্বর ফাইল: per_day আর বড় খরচকারী। Row সংখ্যা মিলিয়ে দেখুন।",
      },
      {
        title: "Fan-out আর তার সমাধান",
        description: "04 নম্বর ফাইলের দুটো Query পাশাপাশি চালিয়ে Tour 1 এর সংখ্যা তুলনা করুন।",
      },
      {
        title: "শূন্য রাখা আর পূর্ণ Report",
        description: "05 আর 06 নম্বর ফাইল: ১৫ জনের তালিকা, ৯ ট্যুরের সারাংশ, আর শেষে EXPLAIN। আয়ের যোগফল 423600.00 মিলছে কিনা দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-two-levels.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

-- Booking প্রতি গড়: 24917.65
SELECT round(avg(total_bdt), 2) FROM bookings WHERE status = 'confirmed';

-- কেনা মানুষ প্রতি গড়: 35300.00 (12 জন)
SELECT round(avg(spent), 2), count(*)
FROM (SELECT customer_id, sum(total_bdt) AS spent
      FROM bookings WHERE status = 'confirmed'
      GROUP BY customer_id) AS per_customer;

-- মাসের সারাংশ: busiest 9, avg_per_month 4.00, months 6
SELECT max(bookings) AS busiest, round(avg(bookings), 2) AS avg_per_month, count(*) AS months
FROM (SELECT to_char(booked_at, 'YYYY-MM') AS month, count(*) AS bookings
      FROM bookings GROUP BY 1) AS m;`,
      },
      {
        language: "sql",
        filename: "02-alias-rules.sql",
        code: `-- নাম ছাড়া: PostgreSQL 16+ এ চলে, 14
SELECT count(*) FROM (SELECT customer_id FROM bookings GROUP BY customer_id);

-- Column তালিকা: 3 Row, 1 | 80000.00, 2 | 75000.00, 8 | 70500.00
SELECT cid, spent
FROM (SELECT customer_id, sum(total_bdt) FROM bookings GROUP BY customer_id) AS t(cid, spent)
ORDER BY spent DESC LIMIT 3;

-- দুটো count: ERROR:  column reference "count" is ambiguous
SELECT count
FROM (SELECT customer_id, count(*), count(DISTINCT departure_id)
      FROM bookings GROUP BY customer_id) AS t;`,
      },
      {
        language: "sql",
        filename: "03-filter-computed.sql",
        code: `-- দিনপ্রতি দাম 4000 এর বেশি: 6 Row
SELECT title, per_day
FROM (SELECT title, round(price_bdt / duration_days, 2) AS per_day FROM tours) AS t
WHERE per_day > 4000
ORDER BY per_day DESC;

-- মোট খরচ 50000 এর বেশি: 4 Row (1, 2, 8, 11)
SELECT customer_id, spent
FROM (SELECT customer_id, sum(total_bdt) AS spent FROM bookings GROUP BY customer_id) AS s
WHERE spent > 50000
ORDER BY spent DESC;`,
      },
      {
        language: "sql",
        filename: "04-fan-out-fix.sql",
        code: `-- আগে Join: 8 Row, Tour 1 = 7 | 113 | 16 (ফুলে গেছে)
SELECT t.tour_id, count(*) AS departures, sum(d.seats_left) AS free_seats, sum(b.seats) AS booked
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY t.tour_id ORDER BY t.tour_id;

-- আগে যোগ: 8 Row, Tour 1 = 4 | 66 | 16 (ঠিক)
SELECT t.tour_id, count(*) AS departures, sum(d.seats_left) AS free_seats,
       coalesce(sum(bk.seats), 0) AS booked
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (SELECT departure_id, sum(seats) AS seats FROM bookings GROUP BY departure_id) AS bk
       ON bk.departure_id = d.departure_id
GROUP BY t.tour_id ORDER BY t.tour_id;`,
      },
      {
        language: "sql",
        filename: "05-keeping-zeros.sql",
        code: `-- INNER: 14
SELECT count(*)
FROM customers c
JOIN (SELECT customer_id, count(*) AS bookings FROM bookings GROUP BY customer_id) AS s
  ON s.customer_id = c.customer_id;

-- LEFT আর COALESCE: 15 Row, Imran Kabir এর 0 | 0
SELECT c.customer_id, c.full_name,
       coalesce(s.bookings, 0) AS bookings,
       coalesce(s.spent, 0)    AS confirmed_spent
FROM customers c
LEFT JOIN (SELECT customer_id, count(*) AS bookings,
                  sum(total_bdt) FILTER (WHERE status = 'confirmed') AS spent
           FROM bookings GROUP BY customer_id) AS s
       ON s.customer_id = c.customer_id
ORDER BY c.customer_id;

-- সব মানুষ প্রতি গড়: 28240.00
SELECT round(avg(coalesce(s.spent, 0)), 2)
FROM customers c
LEFT JOIN (SELECT customer_id, sum(total_bdt) AS spent
           FROM bookings WHERE status = 'confirmed' GROUP BY customer_id) AS s
       ON s.customer_id = c.customer_id;`,
      },
      {
        language: "sql",
        filename: "06-tour-report.sql",
        code: `-- 9 Row; revenue এর যোগ 423600.00
SELECT t.tour_id, t.title,
       coalesce(dep.departures, 0) AS departures,
       coalesce(s.bookings, 0)     AS bookings,
       coalesce(s.revenue, 0)      AS revenue
FROM tours t
LEFT JOIN (SELECT tour_id, count(*) AS departures FROM departures GROUP BY tour_id) AS dep
       ON dep.tour_id = t.tour_id
LEFT JOIN (SELECT d.tour_id, count(*) AS bookings,
                  sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS revenue
           FROM bookings b JOIN departures d ON d.departure_id = b.departure_id
           GROUP BY d.tour_id) AS s
       ON s.tour_id = t.tour_id
ORDER BY t.tour_id;

-- Planner দুই স্তর মিলিয়ে ফেলে: শুধু Seq Scan on tours আর Filter
EXPLAIN (COSTS OFF)
SELECT title, per_day
FROM (SELECT title, round(price_bdt / duration_days, 2) AS per_day FROM tours) AS t
WHERE per_day > 4000;`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Drill এ আগে ভেতরের Query টা একা চালান, তারপর পুরোটা। ভেতরের Row সংখ্যা জানা থাকলে বাইরের ফলাফল
        কেন এমন এল, সেটা নিজেই বুঝতে পারবেন।
      </ContentParagraph>
    ),
  },
};
