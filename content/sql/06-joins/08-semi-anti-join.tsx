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
  NotInTrapLab,
  SemiJoinStepLab,
} from "../../../components/course/topics/joins/semi-animations";
import {
  CorrelatedLoopDiagram,
  JoinVsExistsDiagram,
  NotInChainDiagram,
  SemiAntiSplit,
} from "../../../components/course/topics/joins/semi-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const semiAntiJoinContent: TopicData = {
  id: "semi-anti-join",
  introduction: {
    badge: "MODULE 06 · LESSON 08",
    title: <SectionTitle>আছে কি, নেই কি: Semi Join আর Anti Join</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতক্ষণ এই মডিউলে আপনি যত Join শিখেছেন, সবগুলো একই কাজ করে: দুই Table এর Row জোড়া লাগিয়ে
          নতুন, চওড়া Row বানায়। Booking এর পাশে Customer এর নাম, Tour এর পাশে Destination এর নাম। কিন্তু
          বাস্তবের অনেক প্রশ্নে অন্য Table থেকে কিছু দেখানোর দরকারই নেই। দরকার শুধু একটা হ্যাঁ বা না:
          এই Customer কি অন্তত একবার বুক করেছেন? এই Guide এর কি একটাও ট্যুর আছে?
        </ContentParagraph>
        <ContentParagraph>
          এই দুই ধরনের প্রশ্নের নাম আছে। &ldquo;অন্তত একটা আছে কি&rdquo; প্রশ্নকে বলে Semi Join, আর
          &ldquo;একটাও নেই কি&rdquo; প্রশ্নকে বলে Anti Join। নাম দুটো SQL এর কোনো Keyword না, ধারণার নাম।
          SQL এ এগুলো লেখা হয় EXISTS আর NOT EXISTS দিয়ে, আর Anti Join এর জন্য আরও দুটো পরিচিত উপায় আছে:
          LEFT JOIN দিয়ে খালি দিক খোঁজা, আর NOT IN। এই শেষেরটার ভেতরে একটা ফাঁদ লুকিয়ে আছে, যেটা কোনো
          Error ছাড়াই আপনার Report থেকে সঠিক উত্তর গায়েব করে দেয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন JOIN কেন একই Customer কে বারবার আনে আর EXISTS কেন আনে না, Query এর
          ভেতরে Query কীভাবে লিখতে হয় আর ভেতরের Query কীভাবে বাইরের Row কে দেখে, NOT EXISTS, LEFT JOIN
          আর NOT IN এর মধ্যে কোনটা কখন নিরাপদ, আর NOT IN এর NULL ফাঁদটা ঠিক কোথায়। প্রতিটা কথা দেখবেন
          Island Tours এর আসল Data তে, যেখানে Imran Kabir এর কোনো Booking নেই আর Nazmul Karim এর কোনো ট্যুর
          নেই।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে একটাই প্রশ্ন করুন: আছে কি না। কয়টা আছে, কী আছে, সেটা আমার জানার দরকার নেই। প্রথমটা পেলেই আমি হ্যাঁ বলে দিই, আর একটাও না পেলে না।",
      author: "EXISTS",
      role: "Lesson 08",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুটো SMS, দুটো তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকালের বৈঠকে Island Tours এর Manager ফারুক সাহেব দুটো ছোট কাজ দিলেন। শীতের মৌসুম শুরু
                হচ্ছে, তাই দুই দল মানুষকে দুই রকম SMS যাবে। যাঁরা আগে অন্তত একবার Island Tours এ বুক করেছেন,
                তাঁদের কাছে যাবে একটা ধন্যবাদ। আর যাঁরা Account খুলেছেন কিন্তু একবারও বুক করেননি, তাঁদের কাছে
                যাবে প্রথম ট্যুরে ছাড়ের একটা প্রস্তাব। Developer তানিমকে বলা হলো দুটো তালিকা বের করে দিতে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আগের লেসনগুলোতে JOIN শিখেছেন। প্রথম তালিকার জন্য তিনি customers আর bookings কে
                customer_id দিয়ে জোড়া দিলেন। ফলাফল এল চব্বিশটা Row। অথচ Island Tours এর Customer মোটে পনেরো
                জন। তালিকায় Rahim Uddin এর নাম তিনবার, Nusrat Jahan এর দুইবার। এই তালিকা ধরে SMS পাঠালে Rahim
                সাহেব একই ধন্যবাদ তিনবার পাবেন।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় তালিকা আরও কঠিন মনে হলো। যিনি একবারও বুক করেননি, তাঁর তো bookings Table এ কোনো Row নেই।
                INNER JOIN তাঁকে খুঁজেই পায় না, কারণ মিল না থাকলে Row টা বাদ পড়ে। তাহলে যিনি নেই, তাঁকে তালিকায়
                আনা যায় কীভাবে?
              </ContentParagraph>
              <ContentParagraph>
                দুটো প্রশ্নেরই সমস্যা একই জায়গায়। ফারুক সাহেব Booking এর কোনো তথ্য চাননি, না নম্বর, না তারিখ। তিনি
                চেয়েছেন Customer এর তালিকা, আর প্রতিটা Customer এর জন্য একটা হ্যাঁ বা না: Booking আছে কি? JOIN
                এই হ্যাঁ বা না দেয় না, দেয় প্রতিটা মিলের জন্য একটা জোড়া। এই লেসন সেই হ্যাঁ বা না প্রশ্ন লেখার
                সঠিক উপায় নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: JOIN দিয়ে ধন্যবাদের তালিকা"
              query={`SELECT c.full_name, b.booking_id
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
ORDER BY c.customer_id, b.booking_id;`}
              caption="চব্বিশটা Row, প্রতিটা Booking এর জন্য একটা। Rahim Uddin তিনবার (Booking 1, 8, 17), আরও আটজন দুইবার করে। Imran Kabir একবারও নেই, কারণ তাঁর কোনো Booking নেই। ধন্যবাদের তালিকায় তাঁর না থাকাটা ঠিকই আছে, কিন্তু বাকিদের পুনরাবৃত্তি ঠিক না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "প্রশ্নটা কী চায়, সেটা আগে ঠিক করুন",
          content: (
            <ContentParagraph>
              Query লেখার আগে নিজেকে জিজ্ঞেস করুন: উত্তরে কি অন্য Table থেকে কোনো Column লাগবে? লাগলে JOIN।
              না লাগলে, শুধু &ldquo;আছে কি&rdquo; বা &ldquo;নেই কি&rdquo; জানতে চাইলে, এই লেসনের EXISTS আর NOT
              EXISTS। এই একটা প্রশ্ন ঠিক করলে অর্ধেক ভুল আর হয় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "two-questions",
      subHeader: { index: "002", title: "Two Questions" },
      title: <SectionTitle>আছে কি, আর নেই কি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বিয়ের দাওয়াতের কথা ভাবুন। দাওয়াতের তালিকা হাতে নিয়ে বাড়ির কর্তা জানতে চাইলেন, কোন কোন
                পরিবার থেকে অন্তত একজন এসেছেন। গেটে একটা খাতায় যিনি এসেছেন তিনি নাম লিখেছেন। কোনো পরিবার থেকে
                পাঁচজন এসেছেন, তাঁদের নাম পাঁচবার। কর্তা কিন্তু পাঁচবার সেই পরিবারের নাম শুনতে চান না। তিনি চান
                দাওয়াতের তালিকার প্রতিটা পরিবারের পাশে একটা টিক: এসেছে, বা আসেনি।
              </ContentParagraph>
              <ContentParagraph>
                এখানে দাওয়াতের তালিকা হলো customers Table, আর গেটের খাতা bookings Table। &ldquo;অন্তত একজন
                এসেছেন&rdquo; প্রশ্নের উত্তরে প্রতিটা পরিবার বড়জোর একবার আসে, আর খাতা থেকে কিছুই ফলাফলে যায় না,
                খাতা শুধু যাচাইয়ের জন্য। এই ধরনের প্রশ্নকে বলে <strong>Semi Join</strong>। &ldquo;Semi&rdquo;
                মানে আধা: এক Table এর Row রাখা হয় অন্য Table এর সাথে মিলিয়ে, কিন্তু অন্য Table এর কোনো Column
                ফলাফলে আসে না।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো প্রশ্নটাও সমান জরুরি: কোন পরিবার থেকে একজনও আসেননি? তাঁদের খোঁজ নিতে হবে, হয়তো দাওয়াত
                পৌঁছায়নি। এই প্রশ্নকে বলে <strong>Anti Join</strong>। এখানেও ফলাফলে শুধু দাওয়াতের তালিকার
                পরিবার, খাতার কিছু না। শুধু রাখা হয় তাঁদের, যাঁদের খাতায় একটাও মিল নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SemiAntiSplit />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "নাম", "বাঁ দিকের প্রতিটা Row আসে", "ডান দিকের Column"],
          rows: [
            ["কার সাথে কী মিলেছে, দেখাও", "INNER JOIN", "প্রতিটা মিলের জন্য একবার, শূন্য থেকে অনেকবার", "আসে"],
            ["অন্তত একটা মিল আছে কি", "Semi Join", "বড়জোর একবার", "আসে না"],
            ["একটাও মিল নেই কি", "Anti Join", "বড়জোর একবার", "আসে না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Data তে এই দুই প্রশ্নের উত্তর আগে থেকেই আন্দাজ করা যায়, কারণ Sample Database এ
              কিছু Row ইচ্ছা করে রাখা আছে। পনেরো জন Customer এর মধ্যে চোদ্দ জনের অন্তত একটা Booking আছে, আর
              একজনের, Imran Kabir এর, একটাও নেই। পাঁচজন Guide এর মধ্যে Nazmul Karim এর কোনো ট্যুর নেই। সাতটা
              Destination এর মধ্যে Kuakata তে কোনো ট্যুর নেই। আর নয়টা ট্যুরের মধ্যে Cox&apos;s Bazar Family
              Package এর একটাও Departure নেই। এই লেসনের প্রতিটা Anti Join এদেরকেই খুঁজে বের করবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "join-repeats",
      subHeader: { index: "003", title: "Why JOIN Repeats" },
      title: <SectionTitle>JOIN কেন একই Customer কে বারবার আনে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/inner-join" className={LINK}>
                  INNER JOIN লেসনে
                </Link>{" "}
                দেখেছেন, JOIN প্রতিটা মিলের জন্য একটা করে Row বানায়। এটা JOIN এর দোষ না, এটাই তার কাজ। Rahim
                Uddin এর তিনটা Booking, তাই তিনটা জোড়া, তাই তিনটা Row। JOIN জানতে চায় না আপনি জোড়া চাইছেন নাকি
                শুধু হ্যাঁ বা না চাইছেন। আপনি জোড়া বানাতে বলেছেন, সে বানিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                এই পুনরাবৃত্তি ঠিক করার প্রথম যে উপায়টা মাথায় আসে, সেটা{" "}
                <Link href="/sql/topic/distinct" className={LINK}>
                  DISTINCT
                </Link>
                । JOIN এর পরে DISTINCT বসালে একই নাম একবারই থাকে, আর চোদ্দটা নাম আসে। উত্তরটা মিলে যায়। কিন্তু
                এখানে তিনটা সমস্যা লুকিয়ে আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আগে বেশি কাজ, পরে ফেলে দেওয়া।</strong> Database প্রথমে চব্বিশটা জোড়া বানায়, তারপর
                  দশটা ফেলে দেয়। এখানে সংখ্যাটা ছোট, কিন্তু লাখ Booking এর Table এ এটা লাখটা অদরকারি জোড়া।
                </ListItem>
                <ListItem>
                  <strong>DISTINCT দেখে মান, মানুষ না।</strong> শুধু full_name নিয়ে DISTINCT করলে একই নামের দুজন
                  আলাদা Customer এক হয়ে যাবেন। Island Tours এ এখন একই নামের দুজন নেই, কিন্তু ঢাকা শহরে দুজন
                  Rahim Uddin থাকা মোটেও অস্বাভাবিক না।
                </ListItem>
                <ListItem>
                  <strong>DISTINCT উদ্দেশ্য লুকায়।</strong> যিনি পরে Query টা পড়বেন, তিনি JOIN দেখে ভাববেন
                  bookings থেকে কিছু দরকার, তারপর DISTINCT দেখে অবাক হবেন। Query যা চায়, সেটা সরাসরি বলতে পারাই
                  ভালো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinVsExistsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চব্বিশ জোড়া, চোদ্দ জন"
              query={`SELECT count(*) AS join_rows,
       count(DISTINCT c.customer_id) AS customers
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;

SELECT DISTINCT c.full_name
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
ORDER BY c.full_name;`}
              caption="প্রথম Query: join_rows 24, customers 14। দ্বিতীয়টা DISTINCT দিয়ে চোদ্দটা নাম দেয়, উত্তর ঠিক। পরের Section এর EXISTS একই চোদ্দ জন দেবে, কিন্তু কোনো জোড়া বানিয়ে ফেলে না দিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "JOIN এর পরে DISTINCT দেখলে একটু থামুন",
          content: (
            <ContentParagraph>
              কোনো Query তে JOIN এর ঠিক পরে DISTINCT দেখলে প্রায়ই সেটা আসলে একটা Semi Join, যেটা JOIN দিয়ে লেখা
              হয়েছে। নিজেকে জিজ্ঞেস করুন, অন্য Table থেকে কি সত্যিই কোনো Column দেখানো হচ্ছে? না হলে EXISTS দিয়ে
              লিখলে Query ছোট হয়, পরিষ্কার হয়, আর পুনরাবৃত্তির ঝামেলা থাকে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "query-inside",
      subHeader: { index: "004", title: "A Query Inside a Query" },
      title: <SectionTitle>Query এর ভেতরে একটা Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EXISTS বোঝার আগে একটা নতুন জিনিস চিনতে হবে, কারণ EXISTS তার উপরেই দাঁড়িয়ে আছে। এতদিন আপনার
                প্রতিটা Query একটাই SELECT ছিল। কিন্তু SQL এ একটা SELECT কে বন্ধনীর ভেতরে রেখে আরেকটা Query এর
                ভেতরে বসানো যায়। ভেতরের এই Query কে বলে <strong>Subquery</strong>। Subquery নিয়ে পুরো একটা মডিউল
                আসছে,{" "}
                <Link href="/sql/topic/subqueries-ctes-overview" className={LINK}>
                  Module 07
                </Link>
                । এই লেসনে আমরা শুধু ততটুকু নেব, যতটুকু &ldquo;আছে কি নেই কি&rdquo; প্রশ্নের জন্য লাগে।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে সহজ রূপটা দিয়ে শুরু করি। ভেতরের Query টা একা চালালে কী আসে, আগে সেটা দেখুন:{" "}
                <code className={CODE}>SELECT customer_id FROM bookings</code>। চব্বিশটা নম্বর, যাদের মধ্যে অনেকগুলো
                বারবার, কারণ প্রতিটা Booking এর জন্য একটা। এই নম্বরের তালিকাটা এবার বাইরের Query তে{" "}
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  IN
                </Link>{" "}
                এর ভেতরে বসান। Module 03 এ IN এর ভেতরে হাতে লেখা তালিকা দিয়েছিলেন, যেমন{" "}
                <code className={CODE}>IN (1, 2, 5)</code>। এখন সেই তালিকা আসছে আরেকটা Query থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "subquery-anatomy.sql",
          code: `SELECT customer_id, full_name          -- বাইরের Query
FROM customers
WHERE customer_id IN (
    SELECT customer_id FROM bookings   -- ভেতরের Query, বন্ধনীর ভেতরে
);`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে ভেতরেরটা একা, তারপর একসাথে"
              query={`SELECT customer_id FROM bookings ORDER BY customer_id;

SELECT customer_id, full_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings)
ORDER BY customer_id;`}
              caption="প্রথম Query চব্বিশটা নম্বর দেয়, 1 তিনবার, 2 দুইবার, এভাবে। 15 একবারও নেই। দ্বিতীয় Query চোদ্দ জন Customer দেয়, প্রত্যেকে একবার। তালিকায় একটা নম্বর তিনবার থাকলেও IN শুধু দেখে নম্বরটা তালিকায় আছে কি না, তাই কারো নাম বারবার আসে না। এটাও একটা Semi Join।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখানে ভেতরের Query টা বাইরের Query এর কোনো কিছু জানে না। সে একবার চলে, একটা তালিকা বানায়, আর বাইরের
              Query সেই তালিকার সাথে প্রতিটা Customer মেলায়। এই ধরনের Subquery এর ভেতরের লেখাটা আলাদা করে কেটে
              নিয়ে একা চালানো যায়, যেমন আপনি এইমাত্র করলেন। পরের Section এ এমন Subquery দেখবেন, যেটা একা চলে না,
              কারণ সে বাইরের Row এর দিকে তাকায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "exists",
      subHeader: { index: "005", title: "EXISTS" },
      title: <SectionTitle>EXISTS: অন্তত একটা Row আসে কি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EXISTS একটা প্রশ্ন, যার উত্তর সত্য বা মিথ্যা। তার ভেতরে একটা Subquery থাকে। Subquery অন্তত একটা Row
                ফেরত দিলে EXISTS সত্য, একটাও না দিলে মিথ্যা। ব্যস, এর বেশি কিছু না। Row গুলোতে কী লেখা আছে, কয়টা
                আছে, EXISTS সেদিকে তাকায়ই না।
              </ContentParagraph>
              <ContentParagraph>
                এবার ধন্যবাদের তালিকাটা EXISTS দিয়ে লিখি। বাংলায় প্রশ্নটা: সেই সব Customer দেখাও, যাঁদের জন্য
                bookings Table এ অন্তত একটা Row আছে, যার customer_id তাঁর নিজের customer_id এর সমান। SQL এ ঠিক
                তেমনই লেখা হয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "exists-shape.sql",
          code: `SELECT c.customer_id, c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.customer_id = c.customer_id   -- এই c বাইরের Query এর Customer
);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভেতরের WHERE এর ডান দিকটা লক্ষ করুন: <code className={CODE}>c.customer_id</code>। c হলো বাইরের
                Query এর customers Table এর Alias। মানে ভেতরের Query বাইরের Query এর বর্তমান Row টার দিকে তাকাচ্ছে।
                বাইরের Query যখন Rahim Uddin এর Row এ, তখন ভেতরের Query টা আসলে{" "}
                <code className={CODE}>WHERE b.customer_id = 1</code>। যখন Imran Kabir এর Row এ, তখন{" "}
                <code className={CODE}>WHERE b.customer_id = 15</code>।
              </ContentParagraph>
              <ContentParagraph>
                বাইরের Row এর দিকে তাকানো এই Subquery কে বলে <strong>Correlated Subquery</strong>, বাংলায়
                সম্পর্কযুক্ত Subquery। আগের Section এর IN এর Subquery একা চালানো যেত। এটা একা চালানো যায় না,
                কারণ c বলে কিছু তার নিজের ভেতরে নেই। এটা অর্থবহ শুধু বাইরের একটা নির্দিষ্ট Row এর সাথে।
              </ContentParagraph>
              <ContentParagraph>
                আর <code className={CODE}>SELECT 1</code> কেন? কারণ EXISTS কলামের মান দেখে না, শুধু দেখে Row এসেছে
                কি না। তাই কী SELECT করলেন সেটা কোনো ব্যাপার না। লেখার সুবিধার জন্য সবাই একটা ছোট কিছু লেখেন,
                সাধারণত 1। PostgreSQL এর Documentation ও ঠিক এই রীতির কথা বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CorrelatedLoopDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধন্যবাদের তালিকা, EXISTS দিয়ে"
              query={`SELECT c.customer_id, c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.customer_id = c.customer_id
)
ORDER BY c.customer_id;`}
              caption="চোদ্দটা Row, Customer 1 থেকে 14, প্রত্যেকে একবার। Rahim Uddin এর তিনটা Booking থাকলেও তিনি একবারই আছেন। Imran Kabir (15) নেই। এই Query bookings এর কোনো Column দেখায় না, দেখাতে পারেও না: ভেতরের Query এর Column বাইরে আসে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SemiJoinStepLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  ধন্যবাদের SMS এর তালিকাটা নিজে লিখুন: যাঁদের অন্তত একটা Booking আছে, শুধু তাঁদের{" "}
                  <code className={CODE}>full_name</code>। একটাই Column। প্রত্যেক Customer একবারের বেশি আসবেন না।
                  Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM customers c WHERE EXISTS (SELECT 1 FROM bookings b WHERE ...)</code>,
                  আর ভেতরের WHERE এ bookings এর customer_id কে বাইরের c.customer_id এর সাথে মেলান।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.customer_id = c.customer_id
);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "how-exists-thinks",
      subHeader: { index: "006", title: "How EXISTS Thinks" },
      title: <SectionTitle>EXISTS কীভাবে ভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                EXISTS এর আচরণ চারটা ছোট নিয়মে পুরোটা ধরা যায়। প্রতিটা নিয়ম নিচের বক্সে নিজে যাচাই করতে পারবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>উত্তর শুধু সত্য বা মিথ্যা।</strong> EXISTS কখনো NULL দেয় না, কখনো সংখ্যা দেয় না। তাই
                  WHERE এ সরাসরি বসে, আর SELECT এ বসালে একটা t বা f দেখায়।
                </ListItem>
                <ListItem>
                  <strong>প্রথম Row পেলেই থামে।</strong> PostgreSQL এর Documentation বলে, Subquery সাধারণত ততক্ষণই
                  চলে, যতক্ষণ না বোঝা যায় অন্তত একটা Row আছে কি না, শেষ পর্যন্ত না। Rahim এর তিনটা Booking এর
                  প্রথমটা পেলেই উত্তর জানা হয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>কী SELECT করলেন, সেটা অর্থহীন।</strong> <code className={CODE}>SELECT 1</code>,{" "}
                  <code className={CODE}>SELECT *</code>, এমনকি <code className={CODE}>SELECT NULL</code>, সব একই।
                  একটা Row যার একমাত্র মান NULL, সেটাও একটা Row, তাই EXISTS সত্য।
                </ListItem>
                <ListItem>
                  <strong>খালি ফলাফল মানে মিথ্যা।</strong> Subquery একটাও Row না দিলে EXISTS মিথ্যা, আর NOT EXISTS
                  সত্য। এর মাঝামাঝি কিছু নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="EXISTS কে সরাসরি প্রশ্ন করুন"
              query={`SELECT EXISTS (SELECT 1 FROM bookings WHERE customer_id = 1)  AS rahim,
       EXISTS (SELECT 1 FROM bookings WHERE customer_id = 15) AS imran;

SELECT EXISTS (SELECT NULL)         AS a_row_of_null,
       EXISTS (SELECT 1 WHERE false) AS no_row_at_all;`}
              caption="প্রথম Query: rahim t, imran f। দ্বিতীয়টা: a_row_of_null t, কারণ একটা Row এসেছে, তার মান NULL হলেও। no_row_at_all f, কারণ WHERE false কোনো Row আসতেই দেয় না। EXISTS মান দেখে না, Row আছে কি না দেখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বোঝার মডেল আর আসল কাজ এক না",
          content: (
            <ContentParagraph>
              &ldquo;প্রতিটা Customer এর জন্য ভেতরের Query একবার চলে&rdquo;, এটা বোঝার জন্য সবচেয়ে সহজ মডেল, আর
              ফলাফল সবসময় এই মডেলের সাথে মিলবে। কিন্তু PostgreSQL আসলে প্রায়ই অনেক বুদ্ধিমানের মতো কাজ করে:
              bookings একবার পড়ে, সব customer_id একবারে মিলিয়ে নেয়। Section 011 এ EXPLAIN দিয়ে এর একটা ঝলক
              দেখবেন। আপনার কাজ সঠিক প্রশ্ন লেখা, দ্রুত চালানোর কৌশল Planner এর দায়িত্ব।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "conditions-inside",
      subHeader: { index: "007", title: "Conditions Inside EXISTS" },
      title: <SectionTitle>ভেতরে আরও শর্ত, আরও Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                &ldquo;অন্তত একটা Booking&rdquo; প্রশ্নটা খুব সাধারণ। বাস্তবের প্রশ্ন সাধারণত বেশি নির্দিষ্ট:
                অন্তত একটা confirmed Booking আছে কি? অন্তত একবার Saint Martin গেছেন কি? এই বাড়তি শর্তগুলো বসে
                ভেতরের Query এর WHERE এ, সংযোগের শর্তের পাশে, AND দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেব আসলে বলেছিলেন, ধন্যবাদ যাবে তাঁদের কাছে, যাঁরা সত্যিই ঘুরেছেন বা ঘুরতে যাচ্ছেন। মানে
                confirmed Booking আছে এমন Customer। চোদ্দ জনের মধ্যে Sabbir Hossain এর একমাত্র Booking বাতিল হয়ে
                গেছে, আর Kamal Hasan এর একমাত্র Booking এখনো pending। তাঁরা দুজন বাদ যাবেন, আর বারো জন থাকবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="confirmed Booking আছে এমন Customer"
              query={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.customer_id = c.customer_id
      AND b.status = 'confirmed'
)
ORDER BY c.full_name;`}
              caption="বারোটা নাম। Sabbir Hossain আর Kamal Hasan নেই, কারণ তাঁদের ভেতরের Query তে confirmed শর্ত বসার পরে একটাও Row আসে না। Rahim Uddin এর একটা pending Booking থাকলেও তিনি আছেন, কারণ তাঁর confirmed Booking ও আছে, আর EXISTS এর জন্য একটাই যথেষ্ট।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ভেতরের Query নিজেও JOIN করতে পারে। ধরুন প্রশ্ন: কোন Customer রা অন্তত একবার Saint Martin&apos;s
              Island এ যাওয়ার কোনো ট্যুর বুক করেছেন? Booking থেকে Destination এ পৌঁছাতে তিনটা Table পেরোতে হয়:
              bookings থেকে departures, departures থেকে tours, আর tours এর destination_id। সেই পুরো পথটা ভেতরের
              Query তে, আর বাইরের Query তে শুধু Customer।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Saint Martin এর যাত্রী, প্রত্যেকে একবার"
              query={`SELECT c.customer_id, c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours t      ON t.tour_id = d.tour_id
    WHERE b.customer_id = c.customer_id
      AND t.destination_id = 1
)
ORDER BY c.customer_id;`}
              caption="পাঁচজন: Rahim Uddin, Nusrat Jahan, Tanvir Ahmed, Oliver Bennett আর Kamal Hasan। Destination 1 মানে Saint Martin's Island, যেখানে ট্যুর 1 আর 8 যায়। Nusrat এর Saint Martin এ দুটো Booking, তবু তিনি একবারই। Oliver এর Booking টা বাতিল, তবু তিনি আছেন, কারণ প্রশ্নে status এর কোনো শর্ত নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  ফারুক সাহেবের সংশোধিত তালিকা: যাঁদের অন্তত একটা <strong>confirmed</strong> Booking আছে, তাঁদের{" "}
                  <code className={CODE}>full_name</code>। একটা Column, প্রত্যেকে একবার, ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  Exercise 1 এর ভেতরের WHERE এ একটা শর্ত যোগ করুন:{" "}
                  <code className={CODE}>AND b.status = &apos;confirmed&apos;</code>।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.customer_id = c.customer_id
      AND b.status = 'confirmed'
);`}
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
                  কোন ট্যুরগুলোর অন্তত একটা Departure ডিসেম্বর 2026 এ শুরু হচ্ছে? tours থেকে{" "}
                  <code className={CODE}>tour_id</code> আর <code className={CODE}>title</code>, এই ক্রমে। প্রতিটা
                  ট্যুর একবার। ডিসেম্বর মানে <code className={CODE}>starts_on</code> 2026-12-01 বা তার পরে, আর
                  2027-01-01 এর আগে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  বাইরে <code className={CODE}>FROM tours t</code>, ভেতরে{" "}
                  <code className={CODE}>FROM departures d WHERE d.tour_id = t.tour_id AND ...</code>, তারিখের জন্য
                  দুটো শর্ত।
                </>
              }
              solution={`SELECT t.tour_id, t.title
FROM tours t
WHERE EXISTS (
    SELECT 1
    FROM departures d
    WHERE d.tour_id = t.tour_id
      AND d.starts_on >= DATE '2026-12-01'
      AND d.starts_on <  DATE '2027-01-01'
);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "not-exists",
      subHeader: { index: "008", title: "NOT EXISTS" },
      title: <SectionTitle>NOT EXISTS: একটাও নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দ্বিতীয় তালিকা, যেটা JOIN দিয়ে ধরাই যাচ্ছিল না: যাঁরা একবারও বুক করেননি। উত্তরটা আশ্চর্য রকম
                সহজ। EXISTS এর আগে একটা NOT বসান। ভেতরের Query হুবহু আগের মতো, শুধু প্রশ্নটা উল্টে গেছে: এই
                Customer এর জন্য bookings এ একটাও Row নেই তো?
              </ContentParagraph>
              <ContentParagraph>
                এটাই Anti Join। একটা জিনিস লক্ষ করুন, যেটা প্রথমবার শুনলে অদ্ভুত লাগে: আমরা এমন Row খুঁজছি, যার
                অস্তিত্বই নেই। Imran Kabir এর কোনো Booking এর Row bookings Table এ কোথাও লেখা নেই। কিন্তু NOT EXISTS
                প্রতিটা Customer এর জন্য খোঁজ চালায়, আর যাঁর বেলায় খোঁজ খালি হাতে ফেরে, তাঁকে রাখে। না থাকাটাকেই
                সে উত্তর বানায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা Anti Join, চারটা ইচ্ছা করে রাখা ফাঁক"
              query={`SELECT c.full_name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);

SELECT d.name
FROM destinations d
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.destination_id = d.destination_id);

SELECT g.full_name
FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);

SELECT t.title
FROM tours t
WHERE NOT EXISTS (SELECT 1 FROM departures d WHERE d.tour_id = t.tour_id);`}
              caption="চারটা Query, প্রতিটা এক Row: Imran Kabir (কোনো Booking নেই), Kuakata (কোনো ট্যুর নেই), Nazmul Karim (কোনো ট্যুর দেওয়া হয়নি), আর Cox's Bazar Family Package (কোনো তারিখ নেই)। Sample Database এ এই চারটা ফাঁক ঠিক এই লেসনের জন্যই রাখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উপরের EXISTS Section এর Interactive Lab এ ফিরে গিয়ে NOT EXISTS বেছে নিন আর Customer ধরে
              ধরে এগোন। Rahim এর বেলায় প্রথম Booking পেয়েই থামে আর তাঁকে বাদ দেয়। শেষ পর্যন্ত শুধু Imran Kabir
              টিকে থাকেন, কারণ তাঁর বেলায় খোঁজ একটাও Booking পায় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  Operations জানতে চায়, কোন Guide কে এখনো কোনো ট্যুর দেওয়া হয়নি। guides থেকে শুধু{" "}
                  <code className={CODE}>full_name</code>। এই প্রশ্নে NOT EXISTS ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM guides g WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id)</code>
                  ।
                </>
              }
              solution={`SELECT g.full_name
FROM guides g
WHERE NOT EXISTS (
    SELECT 1
    FROM tours t
    WHERE t.guide_id = g.guide_id
);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "left-join-anti",
      subHeader: { index: "009", title: "Anti Join with LEFT JOIN" },
      title: <SectionTitle>দ্বিতীয় উপায়: LEFT JOIN দিয়ে খালি দিক খোঁজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/left-right-join" className={LINK}>
                  LEFT JOIN লেসনে
                </Link>{" "}
                আপনি এই কৌশলটা আগেই দেখেছেন: LEFT JOIN বাঁ দিকের প্রতিটা Row রাখে, আর যার ডান দিকে কোনো মিল নেই,
                তার ডানের সব Column এ NULL বসায়। তাই LEFT JOIN এর পরে{" "}
                <code className={CODE}>WHERE ডানের_key IS NULL</code> দিলে টিকে থাকে শুধু মিলহীন Row গুলো। এটাও
                একটা Anti Join, শুধু অন্যভাবে লেখা।
              </ContentParagraph>
              <ContentParagraph>
                দুটো লেখার মধ্যে একটা গুরুত্বপূর্ণ পার্থক্য আছে। NOT EXISTS প্রশ্নটা সরাসরি বলে: &ldquo;নেই
                তো?&rdquo; LEFT JOIN প্রথমে জোড়া বানায়, তারপর জোড়া না পাওয়াদের বেছে নেয়। ফলাফল একই, কিন্তু LEFT JOIN
                এর লেখায় একটা জায়গায় ভুল করার সুযোগ আছে: কোন Column টা NULL কি না দেখছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LEFT JOIN দিয়ে একই উত্তর"
              query={`SELECT c.full_name
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booking_id IS NULL;`}
              caption="এক Row: Imran Kabir। LEFT JOIN তাঁর Row রেখেছে আর booking_id তে NULL বসিয়েছে, কারণ তাঁর কোনো মিল নেই। বাকি চোদ্দ জনের প্রতিটা জোড়ায় booking_id আছে, তাই তাঁরা WHERE এ বাদ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফাঁদটা। ধরুন প্রশ্ন: কোন Booking গুলোর কোনো Review নেই? কেউ লিখলেন LEFT JOIN reviews, তারপর{" "}
                <code className={CODE}>WHERE r.comment IS NULL</code>। শুনতে ঠিক লাগে, কারণ মিল না থাকলে comment ও
                NULL হয়। কিন্তু comment নিজেই NULL হতে পারে: দুটো আসল Review আছে, যেখানে Customer কোনো মন্তব্য
                লেখেননি। সেই দুটো Booking এর Review আছে, তবু তারা উত্তরে ঢুকে যায়।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা তাই এরকম: LEFT JOIN দিয়ে Anti Join লিখলে IS NULL দেখুন ডান দিকের এমন একটা Column এ, যেটা
                আসল Row তে কখনো NULL হতে পারে না। ডান Table এর Primary Key সবচেয়ে নিরাপদ, কারণ Primary Key কখনো
                NULL হয় না। সেটা NULL দেখালে একটাই অর্থ হতে পারে: মিল নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল Column দেখলে ভুল গুনতি"
              query={`SELECT count(*) AS checks_comment
FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.comment IS NULL;

SELECT count(*) AS checks_primary_key
FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.review_id IS NULL;`}
              caption="প্রথমটা 16, দ্বিতীয়টা 14। চব্বিশটা Booking এর মধ্যে দশটার Review আছে, তাই Review ছাড়া Booking আসলে চোদ্দটা। প্রথম Query বাড়তি দুটো এনেছে: যাদের Review আছে কিন্তু comment ফাঁকা। কোনো Error নেই, শুধু ভুল সংখ্যা।"
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
                  কোন ট্যুরের একটাও Departure নেই? এবার LEFT JOIN দিয়ে লিখুন, NOT EXISTS ছাড়া। tours থেকে শুধু{" "}
                  <code className={CODE}>title</code>।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours t LEFT JOIN departures d ON d.tour_id = t.tour_id</code>, তারপর
                  departures এর Primary Key টা NULL কি না দেখুন।
                </>
              }
              solution={`SELECT t.title
FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
WHERE d.departure_id IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "not-in-trap",
      subHeader: { index: "010", title: "NOT IN and Its Trap" },
      title: <SectionTitle>তৃতীয় উপায় NOT IN, আর তার NULL ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Section 004 এ IN এর ভেতরে Subquery বসিয়েছিলেন। তার আগে NOT বসালে তৃতীয় একটা Anti Join পাওয়া যায়:
                যে Customer এর নম্বর bookings এর customer_id তালিকায় নেই। পড়তে সবচেয়ে সহজ, আর অনেক মানুষ প্রথমে
                এটাই লেখেন। customers এর বেলায় এটা ঠিকঠাক কাজ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT IN যখন ঠিক কাজ করে"
              query={`SELECT c.full_name
FROM customers c
WHERE c.customer_id NOT IN (SELECT customer_id FROM bookings);`}
              caption="এক Row: Imran Kabir, NOT EXISTS আর LEFT JOIN এর মতোই। কারণ bookings.customer_id কখনো NULL হতে পারে না, Column টা NOT NULL। তালিকায় কোনো NULL নেই, তাই কোনো ফাঁদও নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই কৌশল Guide এর উপর। প্রশ্ন: কোন Guide এর কোনো ট্যুর নেই? Section 008 এ NOT EXISTS উত্তর
                দিয়েছিল Nazmul Karim। NOT IN দিয়ে লিখলে উত্তর আসে শূন্য Row। কোনো Error নেই, কোনো সতর্কবার্তা নেই।
                Database জোর দিয়ে বলছে, এমন কোনো Guide নেই যাঁর ট্যুর নেই। অথচ Nazmul Karim এর সত্যিই কোনো ট্যুর নেই।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা লুকিয়ে আছে tours এর guide_id Column এ। Ratargul Swamp Boat Day ট্যুরের এখনো কোনো Guide ঠিক
                হয়নি, তাই তার guide_id হলো NULL। ভেতরের তালিকা তাই আসলে (1, 2, 3, 1, 4, 2, NULL, 4, 3)।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>x NOT IN (a, b, c)</code> আসলে একটা সংক্ষিপ্ত লেখা, যার পুরো রূপ{" "}
                <code className={CODE}>x &lt;&gt; a AND x &lt;&gt; b AND x &lt;&gt; c</code>।{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL লেসনে
                </Link>{" "}
                দেখেছেন, NULL এর সাথে যেকোনো তুলনার উত্তর অজানা, সত্যও না মিথ্যাও না। Nazmul এর নম্বর 5। 5 &lt;&gt; 1
                সত্য, 5 &lt;&gt; 2 সত্য, 5 &lt;&gt; 3 সত্য, 5 &lt;&gt; 4 সত্য, কিন্তু 5 &lt;&gt; NULL অজানা। AND এর
                নিয়মে একটাও মিথ্যা না থাকলে আর একটা অজানা থাকলে পুরোটা অজানা। আর WHERE রাখে শুধু সত্য। তাই Nazmul বাদ।
                আর বাকি চারজনের বেলায় একটা তুলনা মিথ্যা, তাই তাঁরা তো বাদই। ফলাফল শূন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NotInChainDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদটা নিজের চোখে"
              query={`SELECT guide_id FROM tours ORDER BY guide_id;

SELECT g.full_name
FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours);

SELECT 5 NOT IN (1, 2, NULL) AS five,
       1 NOT IN (1, 2, NULL) AS one,
       5 NOT IN (1, 2)       AS five_no_null;`}
              caption="প্রথম Query নয়টা guide_id দেখায়, শেষেরটা ফাঁকা, মানে NULL। দ্বিতীয়টা (0 rows), এটাই ফাঁদ। তৃতীয়টা ফাঁদের কারণ খুলে দেখায়: five ফাঁকা মানে NULL (অজানা), one f, five_no_null t। তালিকায় NULL না থাকলেই উত্তর সত্য হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NotInTrapLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ফাঁদ থেকে বেরোনোর দুটো উপায়। প্রথমটা NOT IN রেখেই ভেতরের তালিকা থেকে NULL ছেঁকে ফেলা:{" "}
                <code className={CODE}>WHERE guide_id IS NOT NULL</code>। দ্বিতীয়টা NOT IN ছেড়ে NOT EXISTS লেখা।
                NOT EXISTS কখনো এই ফাঁদে পড়ে না, কারণ সে তুলনার ফলাফল AND করে না, শুধু দেখে মিলের একটা Row আছে কি না।
                NULL guide_id এর ট্যুরটা কারো সাথেই মেলে না, তাই কারো উত্তর নষ্টও করে না।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Documentation এই আচরণ সরাসরি লিখে রেখেছে: সমান কোনো মান না পাওয়া গেলে আর ডান দিকের
                অন্তত একটা Row NULL হলে NOT IN এর ফলাফল সত্য না, NULL। এটা কোনো Bug না, SQL এর NULL নিয়মের
                স্বাভাবিক পরিণতি। MySQL এও হুবহু একই, নিচের MySQL Section এ দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              starter={`SELECT g.full_name
FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours);`}
              task={
                <>
                  নিচের Query টা শূন্য Row দেয়, অথচ একজন Guide এর সত্যিই কোনো ট্যুর নেই। <strong>NOT IN রেখেই</strong>{" "}
                  Query টা এমনভাবে ঠিক করুন যাতে সঠিক Guide এর <code className={CODE}>full_name</code> আসে।
                </>
              }
              hint={
                <>
                  ভেতরের Query তে একটা WHERE যোগ করুন, যেটা NULL guide_id গুলো তালিকা থেকে বের করে দেয়।
                </>
              }
              solution={`SELECT g.full_name
FROM guides g
WHERE g.guide_id NOT IN (
    SELECT guide_id
    FROM tours
    WHERE guide_id IS NOT NULL
);`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আজ NULL নেই মানে কাল থাকবে না, তা না",
          content: (
            <ContentParagraph>
              customers এর NOT IN আজ ঠিক কাজ করছে, কারণ bookings.customer_id এ NULL ঢুকতেই পারে না। কিন্তু অনেক
              Column আজ ফাঁকা না থাকলেও NULL নিতে পারে। যেদিন প্রথম NULL টা ঢুকবে, সেদিন আপনার পুরনো NOT IN Report
              চুপচাপ খালি হয়ে যাবে, আর কোনো Error কেউ দেখবে না। তাই অভ্যাস করুন: Anti Join মানে NOT EXISTS।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "which-to-prefer",
      subHeader: { index: "011", title: "Which One to Prefer" },
      title: <SectionTitle>তিনটার মধ্যে কোনটা কখন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Semi Join আর Anti Join দুটোরই একাধিক লেখা আছে, আর সবগুলোর ফলাফল সাধারণত একই। পার্থক্য তিন জায়গায়:
              NULL এর সামনে নিরাপদ কি না, পড়লে উদ্দেশ্য বোঝা যায় কি না, আর পুনরাবৃত্তির ঝুঁকি আছে কি না। এক নজরে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা", "প্রশ্ন", "NULL এর সামনে", "পুনরাবৃত্তি", "কখন বেছে নেবেন"],
          rows: [
            ["EXISTS", "অন্তত একটা আছে", "নিরাপদ", "হয় না", "Semi Join এর স্বাভাবিক পছন্দ, বিশেষত ভেতরে কয়েকটা শর্ত থাকলে"],
            ["IN (Subquery)", "অন্তত একটা আছে", "নিরাপদ, IN এ NULL ফলাফল নষ্ট করে না", "হয় না", "একটা Column মেলালেই চলে, আর পড়তে সহজ চাইলে"],
            ["JOIN + DISTINCT", "অন্তত একটা আছে", "নিরাপদ", "হয়, DISTINCT লুকায়", "শুধু যখন অন্য Table এর Column ও দেখাতে হবে"],
            ["NOT EXISTS", "একটাও নেই", "নিরাপদ", "হয় না", "Anti Join এর স্বাভাবিক পছন্দ"],
            ["LEFT JOIN + IS NULL", "একটাও নেই", "নিরাপদ, যদি NOT NULL Column দেখেন", "হয় না", "যখন একই Query তে মিলহীন আর মিলওয়ালা দুটোই দেখতে চান"],
            ["NOT IN (Subquery)", "একটাও নেই", "বিপজ্জনক, তালিকায় একটা NULL থাকলে খালি", "হয় না", "শুধু যখন নিশ্চিত, Column টা NOT NULL"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গতির কথা উঠলে একটা জিনিস জানা ভালো। PostgreSQL এর Planner NOT EXISTS দেখলে সেটাকে সরাসরি একটা Anti
                Join হিসেবে চালাতে পারে, যেটা দুই Table একবারে মিলিয়ে নেয়। NOT IN এর বেলায় NULL এর ঐ নিয়মের কারণে সে
                সাধারণত এটা পারে না, আলাদা একটা SubPlan চালায়। নিচের বক্সে EXPLAIN দিয়ে দুটোর পরিকল্পনা পাশাপাশি
                দেখুন। EXPLAIN পড়া পুরোপুরি শিখবেন{" "}
                <Link href="/sql/topic/explain-analyze" className={LINK}>
                  Module 13 এ
                </Link>
                , এখন শুধু Plan এর প্রথম লাইনের নামগুলো দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Planner কী দেখছে"
              query={`EXPLAIN
SELECT g.full_name
FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);

EXPLAIN
SELECT g.full_name
FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours);`}
              caption="প্রথম Plan এর শুরুতে Anti Join শব্দটা আছে (এই Box এ লেখা Hash Right Anti Join)। দ্বিতীয়টায় Anti Join নেই, আছে guides এর উপর একটা Filter আর তার নিচে SubPlan। cost এর সংখ্যাগুলো মেশিন আর Data ভেদে আলাদা হয়, সেগুলো নিয়ে এখন মাথা ঘামানোর দরকার নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে সিদ্ধান্ত",
          content: (
            <ContentParagraph>
              আছে কি জানতে EXISTS, নেই কি জানতে NOT EXISTS। অন্য Table এর Column দেখাতে হলে JOIN। NOT IN ব্যবহার
              করবেন শুধু তখন, যখন ভেতরের Column এ NULL আসা অসম্ভব, আর সেটা আপনি নিশ্চিতভাবে জানেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "together",
      subHeader: { index: "012", title: "Semi and Anti Together" },
      title: <SectionTitle>দুটো প্রশ্ন একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবের অনেক প্রশ্ন আসলে একটা হ্যাঁ আর একটা না এর জোড়া। Sales টিম জানতে চায়: কোন Customer এর একটা
                Booking ঝুলে আছে, অথচ একটাও confirmed নেই? এই মানুষগুলো সিদ্ধান্ত নিতে দ্বিধায় আছেন, একটা ফোন কল
                তাঁদের রাজি করাতে পারে। প্রশ্নটা দুই ভাগ: pending আছে (EXISTS), আর confirmed নেই (NOT EXISTS)।
                WHERE এ দুটো শর্ত AND দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                pending Booking আছে চারজনের: Rahim Uddin, Kamal Hasan, Priya Sharma আর Shuvo Das। এঁদের মধ্যে Rahim,
                Priya আর Shuvo এর confirmed Booking ও আছে। বাকি থাকেন একজন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিধায় থাকা Customer"
              query={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.customer_id = c.customer_id AND b.status = 'pending')
  AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');`}
              caption="এক Row: Kamal Hasan। তাঁর একমাত্র Booking (14) pending, কোনো confirmed নেই। দুটো Subquery তেই b নামটা আলাদা আলাদা Subquery এর ভেতরে, তাই কোনো সংঘাত নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  Sales এর তালিকা নিজে লিখুন: যাঁদের অন্তত একটা <strong>pending</strong> Booking আছে কিন্তু একটাও{" "}
                  <strong>confirmed</strong> Booking নেই, তাঁদের <code className={CODE}>full_name</code>।
                </>
              }
              hint={
                <>
                  WHERE এ দুটো শর্ত: <code className={CODE}>EXISTS (... status = &apos;pending&apos;)</code> AND{" "}
                  <code className={CODE}>NOT EXISTS (... status = &apos;confirmed&apos;)</code>।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.customer_id = c.customer_id AND b.status = 'pending')
  AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা কঠিনতর জোড়া। Marketing চায় এমন মানুষদের কাছে একটা ছোট জরিপ পাঠাতে, যাঁরা Island Tours এ
              অন্তত একবার বুক করেছেন কিন্তু কখনো কোনো Review লেখেননি। এখানে না এর অংশটা দুই Table পেরোয়: Review
              থাকে reviews Table এ, কিন্তু reviews সরাসরি Customer কে চেনে না, চেনে booking_id। তাই NOT EXISTS এর
              ভেতরে reviews আর bookings এর একটা JOIN লাগবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              task={
                <>
                  যাঁদের অন্তত একটা Booking আছে, কিন্তু তাঁদের কোনো Booking এর জন্যই কোনো Review লেখা হয়নি, তাঁদের{" "}
                  <code className={CODE}>full_name</code>, নাম অনুযায়ী বর্ণানুক্রমে সাজিয়ে।
                </>
              }
              hint={
                <>
                  প্রথম শর্ত সাধারণ EXISTS bookings এ। দ্বিতীয়টা{" "}
                  <code className={CODE}>NOT EXISTS (SELECT 1 FROM reviews r JOIN bookings b2 ON b2.booking_id = r.booking_id WHERE b2.customer_id = c.customer_id)</code>
                  । শেষে <code className={CODE}>ORDER BY c.full_name</code>।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.customer_id = c.customer_id)
  AND NOT EXISTS (
        SELECT 1
        FROM reviews r
        JOIN bookings b2 ON b2.booking_id = r.booking_id
        WHERE b2.customer_id = c.customer_id)
ORDER BY c.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ সব একই, ফাঁদটাও</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের প্রতিটা লেখা MySQL এ হুবহু একইভাবে চলে: EXISTS, NOT EXISTS, IN এর ভেতরে Subquery, LEFT JOIN
                দিয়ে খালি দিক খোঁজা। MySQL 8.4 এ Island Tours এর MySQL কপি Load করে প্রতিটা Query চালানো হয়েছে, নিচে
                তার ফলাফল। দুটো জিনিস আলাদা করে লক্ষ করুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NOT IN এর NULL ফাঁদ MySQL এও আছে।</strong> একই Guide এর প্রশ্নে শূন্য Row আসে। এটা কোনো
                  Database এর খেয়াল না, SQL Standard এর NULL নিয়ম, যেটা সবাই মানে।
                </ListItem>
                <ListItem>
                  <strong>সত্য মিথ্যা দেখায় 1 আর 0 দিয়ে।</strong> PostgreSQL যেখানে t আর f লেখে, MySQL সেখানে 1 আর 0,
                  আর অজানা হলে NULL।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                MySQL এর Documentation বলে, NOT EXISTS আর NOT IN দুটোকেই সে Antijoin এ রূপান্তর করতে পারে। EXPLAIN
                FORMAT=TREE চালালে সেটা দেখাও যায়, নিচের শেষ লাইনে Nested loop antijoin। তবু Planner যেভাবেই চালাক,
                NOT IN এর অর্থ বদলায় না: তালিকায় NULL থাকলে উত্তর খালি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-semi-anti.sql",
          code: `-- MySQL 8.4.11, island_tours এর MySQL কপি

SELECT COUNT(*) AS exists_count FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);
-- 14

SELECT c.full_name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);
-- Imran Kabir

SELECT g.full_name FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours);
-- Empty set: একই ফাঁদ

SELECT g.full_name FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);
-- Nazmul Karim

SELECT 5 NOT IN (1, 2, NULL) AS five, 1 NOT IN (1, 2, NULL) AS one, 5 NOT IN (1, 2) AS five_no_null;
-- five: NULL, one: 0, five_no_null: 1

EXPLAIN FORMAT=TREE
SELECT g.full_name FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);
-- -> Nested loop antijoin ...`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Data Health পাতা</SectionTitle>,
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
                Island Tours এর Admin Panel এ একটা পাতা আছে, নাম Data Health। প্রতি রবিবার সকালে Operations এর কেউ
                এটা খোলেন। পাতাটা কোনো Chart দেখায় না, দেখায় কয়েকটা ছোট তালিকা, আর প্রতিটা তালিকা একটা কাজের ইঙ্গিত।
                প্রতিটা তালিকার পেছনে একটা Anti Join।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Booking ছাড়া Customer:</strong> Account খুলেছেন, কিছু বুক করেননি। Marketing তাঁদের প্রথম
                  ট্যুরের প্রস্তাব পাঠায়।
                </ListItem>
                <ListItem>
                  <strong>তারিখ ছাড়া ট্যুর:</strong> Website এ বিক্রির জন্য আছে, কিন্তু বুক করার মতো কোনো Departure
                  নেই। Operations কে তারিখ ঠিক করতে হবে, নইলে Customer পাতায় এসে খালি হাতে ফিরবেন।
                </ListItem>
                <ListItem>
                  <strong>ট্যুর ছাড়া Destination আর Guide:</strong> হয় নতুন ট্যুর বানানোর সুযোগ, নয়তো পুরনো Data
                  পরিষ্কারের সময়।
                </ListItem>
                <ListItem>
                  <strong>Payment ছাড়া Booking:</strong> Finance দেখে কোনগুলো এখনো টাকার অপেক্ষায়, আর কোনগুলো বাতিল
                  হয়ে গেছে টাকা আসার আগেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Data Health পাতার পাঁচটা তালিকা"
              query={`SELECT c.full_name AS customer_without_booking
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);

SELECT t.title AS tour_without_departure
FROM tours t
WHERE NOT EXISTS (SELECT 1 FROM departures d WHERE d.tour_id = t.tour_id);

SELECT d.name AS destination_without_tour
FROM destinations d
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.destination_id = d.destination_id);

SELECT g.full_name AS guide_without_tour
FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);

SELECT b.booking_id, b.status AS booking_without_payment
FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM payments p WHERE p.booking_id = b.booking_id)
ORDER BY b.booking_id;`}
              caption="প্রথম চারটা তালিকায় একটা করে নাম: Imran Kabir, Cox's Bazar Family Package, Kuakata, Nazmul Karim। শেষেরটায় পাঁচটা Booking: 12 আর 18 বাতিল, 17, 20 আর 24 pending। কোনো confirmed Booking Payment ছাড়া নেই, যেটা Finance এর জন্য সুখবর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8"
              orderMatters
              task={
                <>
                  Finance এর তালিকা নিজে লিখুন: কোন Booking গুলোর জন্য payments Table এ একটাও Row নেই?{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>status</code>, এই ক্রমে,{" "}
                  booking_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM bookings b WHERE NOT EXISTS (SELECT 1 FROM payments p WHERE p.booking_id = b.booking_id)</code>
                  , শেষে ORDER BY।
                </>
              }
              solution={`SELECT b.booking_id, b.status
FROM bookings b
WHERE NOT EXISTS (
    SELECT 1
    FROM payments p
    WHERE p.booking_id = b.booking_id
)
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা NOT EXISTS, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Data Health পাতার প্রথম তালিকা, Booking ছাড়া Customer, Database এর চোখে কীভাবে তৈরি হয়, সেটা বোঝার
              মডেল দিয়ে ধাপে ধাপে দেখি। মনে রাখবেন, ফলাফল এই মডেলের সাথে হুবহু মিলবে, যদিও PostgreSQL আসলে কাজটা আরও
              চালাকির সাথে একবারে সারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM customers c",
              description:
                "বাইরের Query পনেরোটা Customer এর Row নিয়ে শুরু করে। প্রতিটা Row এর জন্য WHERE এর শর্ত যাচাই হবে।",
            },
            {
              title: "প্রথম Row: Rahim Uddin, customer_id 1",
              description:
                "ভেতরের Query তে c.customer_id এর জায়গায় 1 বসে: SELECT 1 FROM bookings WHERE customer_id = 1। প্রথম মিলটা Booking 1, পাওয়া মাত্র খোঁজ থামে।",
            },
            {
              title: "NOT EXISTS এর রায়",
              description:
                "ভেতরের Query অন্তত একটা Row পেয়েছে, তাই EXISTS সত্য, NOT EXISTS মিথ্যা। Rahim বাদ। Booking 8 আর 17 দেখাই লাগেনি।",
            },
            {
              title: "একে একে বাকি তেরো জন",
              description:
                "Nusrat থেকে Lamia পর্যন্ত প্রত্যেকের অন্তত একটা Booking আছে। প্রত্যেকের বেলায় প্রথম মিলেই থামা, প্রত্যেকে বাদ।",
            },
            {
              title: "পনেরোতম Row: Imran Kabir, customer_id 15",
              description:
                "ভেতরের Query: SELECT 1 FROM bookings WHERE customer_id = 15। পুরো bookings খুঁজেও একটা Row আসে না।",
            },
            {
              title: "রায়: রাখা হলো",
              description:
                "ভেতরের Query খালি, তাই EXISTS মিথ্যা, NOT EXISTS সত্য। Imran ফলাফলে।",
            },
            {
              title: "SELECT c.full_name",
              description:
                "টিকে থাকা Row থেকে শুধু customers এর Column নেওয়া হয়। bookings এর কিছু বাইরে আসার উপায়ই নেই। ফলাফল: এক Row, Imran Kabir।",
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
          headers: ["ভুল", "কী ঘটে", "ঠিক উপায়"],
          rows: [
            [
              "ভেতরের Query তে সংযোগের শর্ত ভুলে যাওয়া",
              "EXISTS সবার জন্য সত্য (১৫ জন), NOT EXISTS সবার জন্য মিথ্যা (০ জন)",
              "ভেতরের WHERE এ b.customer_id = c.customer_id",
            ],
            [
              "তালিকায় NULL থাকতে পারে এমন Column এ NOT IN",
              "শূন্য Row, কোনো Error ছাড়া",
              "NOT EXISTS, অথবা ভেতরে WHERE ... IS NOT NULL",
            ],
            [
              "LEFT JOIN এর পরে NULL হতে পারে এমন Column এ IS NULL",
              "বাড়তি Row ঢুকে পড়ে (১৪ এর জায়গায় ১৬)",
              "ডান Table এর Primary Key এ IS NULL",
            ],
            [
              "শুধু হ্যাঁ বা না চাইলেও JOIN, তারপর DISTINCT",
              "অদরকারি জোড়া, একই নামের দুজন এক হয়ে যাওয়ার ঝুঁকি",
              "EXISTS",
            ],
            [
              "ভেতরের Query এর Column বাইরে দেখাতে চাওয়া",
              "Error: ভেতরের Alias বাইরে কেউ চেনে না",
              "সেই Column লাগলে JOIN",
            ],
            [
              "ভেতরের শর্ত বাইরের WHERE এ লিখে ফেলা",
              "প্রশ্নের অর্থ বদলে যায় বা Error",
              "যে শর্ত মিলের Row বাছাই করে, সেটা ভেতরের WHERE এ",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম ভুলটা সবচেয়ে বেশি দেখা যায়, আর সবচেয়ে বিপজ্জনক, কারণ Query চলে, শুধু উত্তরটা অর্থহীন। ভেতরের
              Query তে বাইরের Row এর উল্লেখ না থাকলে সেটা আর Correlated না। সে প্রতিবার একই প্রশ্ন করে: bookings এ
              কোনো Row আছে কি? আছে, চব্বিশটা। তাই উত্তর সবার জন্য একই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সংযোগের শর্ত ছাড়া EXISTS"
              query={`SELECT count(*) AS forgot_exists
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings);

SELECT count(*) AS forgot_not_exists
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings);`}
              caption="forgot_exists 15, forgot_not_exists 0। Imran Kabir ও প্রথম তালিকায় চলে এসেছেন, আর দ্বিতীয় তালিকা খালি। এই দুই সংখ্যা দেখলে সাথে সাথে বুঝবেন, ভেতরের Query বাইরের দিকে তাকাচ্ছে না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-subquery.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Subquery Expressions
                  </a>
                  : EXISTS, IN আর NOT IN এর আনুষ্ঠানিক নিয়ম, SELECT 1 এর রীতি, আর NOT IN কেন NULL দেয়, সব এক পাতায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-comparisons.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Row and Array Comparisons
                  </a>
                  : হাতে লেখা তালিকার IN আর NOT IN এর একই NULL নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/exists-and-not-exists-subqueries.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Subqueries with EXISTS or NOT EXISTS
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা, উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/semijoins-antijoins.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Semijoin and Antijoin Transformations
                  </a>
                  : MySQL কোন Subquery গুলোকে Semijoin আর Antijoin এ রূপান্তর করে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Relational_algebra"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Relational algebra
                  </a>
                  : Semijoin আর Antijoin শব্দ দুটো কোথা থেকে এল, গণিতের ভাষায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Subquery এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে NOT IN দেখলে এই লেসনের NULL ফাঁদটা মনে রাখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Semi Join</strong> মানে &ldquo;অন্তত একটা আছে কি&rdquo;, <strong>Anti Join</strong> মানে
                  &ldquo;একটাও নেই কি&rdquo;। দুটোতেই বাঁ দিকের প্রতিটা Row বড়জোর একবার, ডান দিকের কোনো Column না।
                </ListItem>
                <ListItem>
                  JOIN প্রতিটা মিলের জন্য একটা Row দেয়, তাই হ্যাঁ বা না প্রশ্নে পুনরাবৃত্তি আনে। DISTINCT সেটা ঢাকে,
                  ঠিক করে না।
                </ListItem>
                <ListItem>
                  Subquery হলো বন্ধনীর ভেতরের একটা SELECT। যেটা বাইরের Row এর দিকে তাকায়, সেটা Correlated Subquery।
                </ListItem>
                <ListItem>
                  EXISTS সত্য হয় ভেতরের Query অন্তত একটা Row দিলে। প্রথম Row পেলেই থামে, আর কী SELECT করলেন সেটা
                  অর্থহীন, তাই SELECT 1।
                </ListItem>
                <ListItem>
                  Anti Join তিনভাবে লেখা যায়: NOT EXISTS, LEFT JOIN দিয়ে Primary Key IS NULL, আর NOT IN।
                </ListItem>
                <ListItem>
                  NOT IN এর তালিকায় একটা NULL থাকলে উত্তর খালি হয়, কোনো Error ছাড়া। guides আর tours এ শূন্য Row,
                  অথচ Nazmul Karim এর কোনো ট্যুর নেই। PostgreSQL আর MySQL দুই জায়গাতেই।
                </ListItem>
                <ListItem>
                  অভ্যাস: আছে কি জানতে EXISTS, নেই কি জানতে NOT EXISTS, অন্য Table এর Column লাগলে JOIN।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে ভেতরের Query শুধু হ্যাঁ বা না দিতে পারত। কিন্তু অনেক প্রশ্নে প্রতিটা Row এর জন্য ভেতর থেকে
                আসল Row আনতে হয়: প্রতিটা Customer এর সবশেষ দুটো Booking, প্রতিটা ট্যুরের পরের Departure। সাধারণ JOIN
                এটা পারে না, আর EXISTS শুধু সত্য মিথ্যা বলে। এই কাজের জন্য আছে বাইরের Row দেখতে পাওয়া এক বিশেষ Join,
                পরের লেসন{" "}
                <Link href="/sql/topic/lateral-join" className={LINK}>
                  LATERAL Joins
                </Link>
                । আর Subquery এর পুরো জগৎ, তার সব রূপ আর ফাঁদ, অপেক্ষা করছে{" "}
                <Link href="/sql/topic/in-exists-any-all" className={LINK}>
                  Module 07 এ
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ"],
    rows: [
      ["Semi Join", "অন্তত একটা মিল আছে কি, প্রত্যেকে একবার", "Booking আছে এমন ১৪ জন"],
      ["Anti Join", "একটাও মিল নেই কি", "Imran Kabir, Kuakata, Nazmul Karim"],
      ["JOIN এর পুনরাবৃত্তি", "প্রতিটা মিলের জন্য একটা Row", "২৪ জোড়া, ১৪ জন মানুষ"],
      ["Subquery", "বন্ধনীর ভেতরের SELECT", "IN (SELECT customer_id FROM bookings)"],
      ["Correlated Subquery", "ভেতরের Query বাইরের Row দেখে", "b.customer_id = c.customer_id"],
      ["EXISTS", "ভেতরে অন্তত একটা Row এলে সত্য", "EXISTS (SELECT 1 FROM bookings b WHERE ...)"],
      ["SELECT 1", "EXISTS মান দেখে না, শুধু Row আছে কি না", "EXISTS (SELECT NULL) ও সত্য"],
      ["NOT EXISTS", "Anti Join এর নিরাপদ লেখা", "ট্যুর ছাড়া Guide: Nazmul Karim"],
      ["LEFT JOIN + IS NULL", "মিলহীন Row, Primary Key দেখে", "r.review_id IS NULL: ১৪, r.comment: ১৬"],
      ["NOT IN এর ফাঁদ", "তালিকায় NULL থাকলে খালি উত্তর", "Ratargul এর NULL guide_id, তাই ০ Row"],
      ["ফাঁদ থেকে মুক্তি", "ভেতরে IS NOT NULL, অথবা NOT EXISTS", "Nazmul Karim ফিরে আসেন"],
      ["দুটো একসাথে", "EXISTS AND NOT EXISTS", "pending আছে, confirmed নেই: Kamal Hasan"],
      ["সংযোগ ভুলে গেলে", "সবাই সত্য বা সবাই মিথ্যা", "১৫ আর ০"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Semi Join এর ফলাফলের বৈশিষ্ট্য কোনটা?",
        options: [
          {
            key: "A",
            text: "বাঁ দিকের প্রতিটা Row প্রতিটা মিলের জন্য একবার করে আসে",
            isCorrect: false,
            explanation: "এটা সাধারণ INNER JOIN এর আচরণ। Rahim Uddin এর তিনটা Booking থাকলে তিনি তিনবার আসেন।",
          },
          {
            key: "B",
            text: "বাঁ দিকের প্রতিটা Row বড়জোর একবার আসে, আর ডান দিকের কোনো Column আসে না",
            isCorrect: true,
            explanation: "ঠিক। Semi Join শুধু জানতে চায় অন্তত একটা মিল আছে কি না। মিল আছে এমন প্রতিটা Row একবার, অন্য Table এর কিছু না।",
          },
          {
            key: "C",
            text: "শুধু সেই Row আসে, যার কোনো মিল নেই",
            isCorrect: false,
            explanation: "এটা Anti Join, Semi Join এর উল্টো প্রশ্ন।",
          },
          {
            key: "D",
            text: "দুই Table এর সব Row আসে, মিলুক বা না মিলুক",
            isCorrect: false,
            explanation: "এটা FULL OUTER JOIN এর বর্ণনা, Semi Join এর সাথে এর সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "customers আর bookings এর JOIN ২৪টা Row দেয়, অথচ EXISTS দিয়ে লেখা একই প্রশ্ন ১৪টা। কেন?",
        options: [
          {
            key: "A",
            text: "EXISTS কিছু Booking ভুল করে বাদ দেয়",
            isCorrect: false,
            explanation: "কোনো Booking বাদ পড়েনি। EXISTS Booking গুনছে না, Customer রাখছে।",
          },
          {
            key: "B",
            text: "JOIN প্রতিটা Booking এর জন্য একটা Row দেয়, EXISTS প্রতিটা Customer কে বড়জোর একবার রাখে",
            isCorrect: true,
            explanation: "ঠিক। ১৪ জন Customer এর মোট ২৪টা Booking। JOIN জোড়া গোনে, EXISTS মানুষ।",
          },
          {
            key: "C",
            text: "EXISTS শুধু confirmed Booking দেখে",
            isCorrect: false,
            explanation: "EXISTS এর নিজের কোনো status এর শর্ত নেই। শর্ত না দিলে যেকোনো Booking ই যথেষ্ট।",
          },
          {
            key: "D",
            text: "JOIN এ Imran Kabir দশবার এসেছেন",
            isCorrect: false,
            explanation: "Imran Kabir এর কোনো Booking নেই, JOIN এ তিনি একবারও আসেন না।",
          },
        ],
      },
      {
        id: 3,
        text: "EXISTS (SELECT NULL FROM bookings b WHERE b.customer_id = c.customer_id) Rahim Uddin এর জন্য কী দেয়?",
        options: [
          {
            key: "A",
            text: "NULL, কারণ SELECT NULL",
            isCorrect: false,
            explanation: "EXISTS কখনো NULL দেয় না। সে Row এর মান দেখে না।",
          },
          {
            key: "B",
            text: "মিথ্যা, কারণ ভেতরের মানগুলো সব NULL",
            isCorrect: false,
            explanation: "মান NULL হলেও Row তো এসেছে, তিনটা। EXISTS শুধু Row আছে কি না দেখে।",
          },
          {
            key: "C",
            text: "সত্য",
            isCorrect: true,
            explanation: "ঠিক। Rahim এর তিনটা Booking, তাই ভেতরের Query তিনটা Row দেয়। প্রতিটার মান NULL হলেও Row তো আছে।",
          },
          {
            key: "D",
            text: "Error, কারণ EXISTS এর ভেতরে Column লাগে",
            isCorrect: false,
            explanation: "ভেতরে যেকোনো কিছু SELECT করা যায়, এমনকি NULL। কোনো Error নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT g.full_name FROM guides g WHERE g.guide_id NOT IN (SELECT guide_id FROM tours) শূন্য Row দেয়, অথচ Nazmul Karim এর কোনো ট্যুর নেই। কারণ কী?",
        options: [
          {
            key: "A",
            text: "guides Table এ Nazmul Karim নেই",
            isCorrect: false,
            explanation: "তিনি আছেন, guide_id 5। NOT EXISTS দিয়ে লিখলে তিনি ঠিকই আসেন।",
          },
          {
            key: "B",
            text: "tours এর guide_id তে একটা NULL আছে, তাই 5 <> NULL অজানা, আর পুরো শর্ত অজানা হয়ে যায়",
            isCorrect: true,
            explanation: "ঠিক। Ratargul Swamp Boat Day এর guide_id NULL। NOT IN হলো অনেকগুলো <> এর AND, আর একটা অজানা পুরো উত্তর অজানা করে দেয়। WHERE শুধু সত্য রাখে।",
          },
          {
            key: "C",
            text: "NOT IN Subquery এর সাথে চলে না",
            isCorrect: false,
            explanation: "চলে। customers এর বেলায় একই লেখা ঠিক Imran Kabir কে দেয়, কারণ সেখানে তালিকায় NULL নেই।",
          },
          {
            key: "D",
            text: "PostgreSQL এর Bug, MySQL এ ঠিক আসে",
            isCorrect: false,
            explanation: "MySQL এও শূন্য Row আসে। এটা SQL এর NULL নিয়ম, কোনো Database এর Bug না।",
          },
        ],
      },
      {
        id: 5,
        text: "আগের প্রশ্নের Query ঠিক করার সঠিক উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "NOT IN এর জায়গায় IN লেখা",
            isCorrect: false,
            explanation: "IN লিখলে প্রশ্ন উল্টে যায়: যাঁদের ট্যুর আছে তাঁদের তালিকা।",
          },
          {
            key: "B",
            text: "ভেতরের Query তে WHERE guide_id IS NOT NULL যোগ করা, অথবা NOT EXISTS দিয়ে লেখা",
            isCorrect: true,
            explanation: "ঠিক। দুটোই Nazmul Karim কে ফেরত আনে। NOT EXISTS বেশি নিরাপদ, কারণ ভবিষ্যতে নতুন NULL এলেও ভাঙে না।",
          },
          {
            key: "C",
            text: "বাইরে DISTINCT বসানো",
            isCorrect: false,
            explanation: "শূন্য Row এর উপর DISTINCT বসালেও শূন্য Row। সমস্যাটা পুনরাবৃত্তির না।",
          },
          {
            key: "D",
            text: "Ratargul ট্যুরটা মুছে ফেলা",
            isCorrect: false,
            explanation: "Query ঠিক করতে Data মুছে ফেলা চলে না। আর পরের NULL এলে আবার একই সমস্যা।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT count(*) FROM customers c WHERE EXISTS (SELECT 1 FROM bookings) কী দেয়?",
        options: [
          {
            key: "A",
            text: "14, Booking আছে এমন Customer",
            isCorrect: false,
            explanation: "সেটা পেতে ভেতরে b.customer_id = c.customer_id লাগত। এখানে ভেতরের Query বাইরের Row এর দিকে তাকায়ই না।",
          },
          {
            key: "B",
            text: "15, কারণ ভেতরের Query প্রতিবার একই প্রশ্ন করে আর প্রতিবার Row পায়",
            isCorrect: true,
            explanation: "ঠিক। সংযোগের শর্ত নেই, তাই প্রশ্নটা দাঁড়ায় bookings এ কোনো Row আছে কি। আছে, তাই সবাই সত্য, Imran ও।",
          },
          {
            key: "C",
            text: "24, প্রতিটা Booking এর জন্য একটা",
            isCorrect: false,
            explanation: "EXISTS কখনো Row বাড়ায় না। বাইরের প্রতিটা Customer বড়জোর একবার।",
          },
          {
            key: "D",
            text: "Error, Correlated শর্ত ছাড়া EXISTS চলে না",
            isCorrect: false,
            explanation: "চলে, কোনো Error ছাড়াই। সেটাই বিপদ।",
          },
        ],
      },
      {
        id: 7,
        text: "Review ছাড়া Booking খুঁজতে LEFT JOIN reviews r এর পরে কোন শর্তটা নিরাপদ?",
        options: [
          {
            key: "A",
            text: "WHERE r.comment IS NULL",
            isCorrect: false,
            explanation: "comment নিজেই NULL হতে পারে। মন্তব্য ছাড়া দুটো আসল Review ও ঢুকে যায়, ১৪ এর জায়গায় ১৬।",
          },
          {
            key: "B",
            text: "WHERE r.rating = 0",
            isCorrect: false,
            explanation: "মিল না থাকলে rating NULL হয়, 0 না। আর NULL = 0 কখনো সত্য না, তাই এটা কিছুই দেবে না।",
          },
          {
            key: "C",
            text: "WHERE r.review_id IS NULL",
            isCorrect: true,
            explanation: "ঠিক। review_id Primary Key, আসল Row তে কখনো NULL না। NULL দেখালে মানে একটাই: কোনো Review নেই। ফলাফল ১৪।",
          },
          {
            key: "D",
            text: "WHERE b.booking_id IS NULL",
            isCorrect: false,
            explanation: "এটা বাঁ দিকের Column। LEFT JOIN বাঁ দিকের প্রতিটা Row আসল রাখে, তাই এটা কখনো NULL না, ফলাফল শূন্য।",
          },
        ],
      },
      {
        id: 8,
        text: "যাঁদের pending Booking আছে কিন্তু confirmed নেই, তাঁদের খোঁজার সঠিক কাঠামো কোনটা?",
        options: [
          {
            key: "A",
            text: "JOIN bookings ... WHERE status = 'pending' AND status <> 'confirmed'",
            isCorrect: false,
            explanation: "একটা Row একসাথে একটাই status রাখে। এই শর্ত প্রতিটা pending Row এর জন্য সত্য, তাই Rahim, Priya, Shuvo ও এসে যান।",
          },
          {
            key: "B",
            text: "WHERE EXISTS (... status = 'pending') AND NOT EXISTS (... status = 'confirmed')",
            isCorrect: true,
            explanation: "ঠিক। একটা প্রশ্ন Customer এর সব Booking জুড়ে: pending আছে, আর confirmed একটাও নেই। উত্তর Kamal Hasan।",
          },
          {
            key: "C",
            text: "WHERE NOT EXISTS (... status = 'pending')",
            isCorrect: false,
            explanation: "এটা উল্টো প্রশ্ন: যাঁদের কোনো pending নেই।",
          },
          {
            key: "D",
            text: "WHERE status IN ('pending') NOT IN ('confirmed')",
            isCorrect: false,
            explanation: "এটা বৈধ SQL ই না, আর একটা Row এর status দিয়ে একজন Customer এর সব Booking এর প্রশ্ন বলা যায় না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর Data Health Report",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুটো SMS তালিকা:</strong> EXISTS দিয়ে ধন্যবাদের তালিকা আর NOT EXISTS দিয়ে প্রথম ট্যুরের প্রস্তাবের তালিকা
        বানান। দুই তালিকার মোট Row যোগ করে customers এর মোট সংখ্যার সাথে মেলান। কেন মেলা উচিত, দুই লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>এক প্রশ্ন, তিন লেখা:</strong> ট্যুর ছাড়া Destination খুঁজুন NOT EXISTS, LEFT JOIN আর NOT IN দিয়ে। তিনটার
        ফলাফল মেলান। NOT IN এখানে নিরাপদ কি না, destination_id Column এর NOT NULL নিয়ম দেখে সিদ্ধান্ত দিন।
      </span>,
      <span key="3">
        <strong>ফাঁদটা নিজে ধরুন:</strong> guides আর tours এ NOT IN এর শূন্য Row বের করুন, তারপর দুইভাবে ঠিক করুন। তিন
        লাইনে লিখুন, Ratargul এর NULL guide_id কীভাবে Nazmul Karim কে গায়েব করল।
      </span>,
      <span key="4">
        <strong>Data Health Report:</strong> পাঁচটা Anti Join এক ফাইলে: Booking ছাড়া Customer, Departure ছাড়া ট্যুর, ট্যুর
        ছাড়া Destination, ট্যুর ছাড়া Guide, Payment ছাড়া Booking। প্রতিটার পাশে এক লাইনে লিখুন, কোন দল এই তালিকা দেখে কী
        কাজ করবে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> Rahim Uddin এর তিনটা Booking এর উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে
        বোঝান, JOIN আর EXISTS এর ফলাফল কেন আলাদা, আর কখন কোনটা লিখবেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুটো তালিকার Query, Row সংখ্যা আর মিলানোর ব্যাখ্যা</span>,
      <span key="d2">তিনটা লেখা, তিনটা ফলাফল আর NOT IN নিয়ে সিদ্ধান্ত</span>,
      <span key="d3">ফাঁদের Query, দুটো সমাধান আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d4">পাঁচটা Anti Join এর একটা .sql ফাইল, প্রতিটার সাথে কাজের নোট</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ আছে কি, নেই কি",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "পুনরাবৃত্তি দেখা",
        description:
          "প্রথম ফাইলের তিনটা Query চালান। JOIN এর ২৪, DISTINCT এর ১৪ আর EXISTS এর ১৪ পাশাপাশি রাখুন, আর কোন Customer কতবার এসেছেন গুনে দেখুন।",
      },
      {
        title: "ভেতরে শর্ত",
        description:
          "দ্বিতীয় ফাইলে confirmed এর ১২ জন, Saint Martin এর ৫ জন আর ডিসেম্বরের ৩টা ট্যুর। প্রতিটার Row সংখ্যা মন্তব্যের সাথে মেলান।",
      },
      {
        title: "চারটা ফাঁক",
        description:
          "তৃতীয় ফাইলের চারটা NOT EXISTS, প্রতিটা এক Row। Sample Database এর পাতায় ইচ্ছা করে রাখা Row এর তালিকার সাথে মিলিয়ে নিন।",
      },
      {
        title: "Anti Join তিনভাবে",
        description:
          "চতুর্থ ফাইলে customers এর বেলায় তিনটা লেখাই Imran দেয়, কিন্তু guides এর বেলায় NOT IN শূন্য Row দেয়। পার্থক্যটা নিজে ব্যাখ্যা করুন।",
      },
      {
        title: "দুটো প্রশ্ন একসাথে",
        description:
          "পঞ্চম ফাইলে Kamal Hasan, Payment ছাড়া পাঁচটা Booking, আর Review না লেখা পাঁচজন। শেষেরটা কেন দুই Table পেরোয়, লক্ষ করুন।",
      },
      {
        title: "ভুলের চেহারা চেনা",
        description:
          "ষষ্ঠ ফাইলে সংযোগ ভুলে যাওয়ার ১৫ আর ০, আর ভুল Column দেখার ১৬ বনাম ১৪। এই সংখ্যাগুলো দেখলে কোন ভুল হয়েছে, সেটা চিনে রাখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-repeats.sql",
        code: `SELECT c.full_name, b.booking_id
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;
-- (24 rows)

SELECT DISTINCT c.full_name
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;
-- (14 rows)

SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);
-- (14 rows)`,
      },
      {
        language: "sql",
        filename: "02-conditions-inside.sql",
        code: `SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');
-- (12 rows), Sabbir Hossain আর Kamal Hasan নেই

SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1
              FROM bookings b
              JOIN departures d ON d.departure_id = b.departure_id
              JOIN tours t ON t.tour_id = d.tour_id
              WHERE b.customer_id = c.customer_id AND t.destination_id = 1);
-- (5 rows)

SELECT t.title
FROM tours t
WHERE EXISTS (SELECT 1 FROM departures d
              WHERE d.tour_id = t.tour_id
                AND d.starts_on >= DATE '2026-12-01'
                AND d.starts_on <  DATE '2027-01-01');
-- (3 rows): ট্যুর 1, 3, 4`,
      },
      {
        language: "sql",
        filename: "03-not-exists.sql",
        code: `SELECT c.full_name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);
-- (1 row): Imran Kabir

SELECT d.name FROM destinations d
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.destination_id = d.destination_id);
-- (1 row): Kuakata

SELECT g.full_name FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);
-- (1 row): Nazmul Karim

SELECT t.title FROM tours t
WHERE NOT EXISTS (SELECT 1 FROM departures d WHERE d.tour_id = t.tour_id);
-- (1 row): Cox's Bazar Family Package`,
      },
      {
        language: "sql",
        filename: "04-anti-three-ways.sql",
        code: `SELECT c.full_name FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booking_id IS NULL;
-- (1 row): Imran Kabir

SELECT c.full_name FROM customers c
WHERE c.customer_id NOT IN (SELECT customer_id FROM bookings);
-- (1 row): Imran Kabir

SELECT g.full_name FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours);
-- (0 rows): NULL ফাঁদ

SELECT g.full_name FROM guides g
WHERE g.guide_id NOT IN (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);
-- (1 row): Nazmul Karim`,
      },
      {
        language: "sql",
        filename: "05-together.sql",
        code: `SELECT c.full_name FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id AND b.status = 'pending')
  AND NOT EXISTS (SELECT 1 FROM bookings b
                  WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');
-- (1 row): Kamal Hasan

SELECT b.booking_id, b.status FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM payments p WHERE p.booking_id = b.booking_id)
ORDER BY b.booking_id;
-- (5 rows): 12, 17, 18, 20, 24

SELECT c.full_name FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id)
  AND NOT EXISTS (SELECT 1 FROM reviews r
                  JOIN bookings b2 ON b2.booking_id = r.booking_id
                  WHERE b2.customer_id = c.customer_id)
ORDER BY c.full_name;
-- (5 rows)`,
      },
      {
        language: "sql",
        filename: "06-mistakes.sql",
        code: `SELECT count(*) FROM customers c WHERE EXISTS (SELECT 1 FROM bookings);
-- 15: সংযোগের শর্ত নেই

SELECT count(*) FROM customers c WHERE NOT EXISTS (SELECT 1 FROM bookings);
-- 0

SELECT count(*) FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.comment IS NULL;
-- 16: ভুল Column

SELECT count(*) FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.review_id IS NULL;
-- 14: ঠিক`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Anti Join লেখার পরে উল্টো Semi Join টাও চালান। দুটোর Row সংখ্যা যোগ করলে বাঁ দিকের Table এর মোট Row পাওয়া
        উচিত, যেমন ১৪ আর ১ মিলে ১৫ জন Customer। না মিললে কোথাও NULL বা সংযোগের ভুল লুকিয়ে আছে।
      </ContentParagraph>
    ),
  },
};
