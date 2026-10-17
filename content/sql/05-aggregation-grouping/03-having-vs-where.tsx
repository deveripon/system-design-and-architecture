import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import {
  SievesLab,
  WhereOrHavingLab,
} from "../../../components/course/topics/aggregation/having-animations";
import {
  CancelledLeakSplit,
  ClauseTimelineDiagram,
  TwoSievesDiagram,
} from "../../../components/course/topics/aggregation/having-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const havingVsWhereContent: TopicData = {
  id: "having-vs-where",
  introduction: {
    badge: "MODULE 05 · LESSON 03",
    title: <SectionTitle>দুটো ছাঁকনি: আগে Row, পরে দল</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি GROUP BY দিয়ে অনেকগুলো Row কে দলে ভাগ করতে শিখেছেন: প্রতিটা Customer এর
          কয়টা Booking, প্রতিটা Departure এ কয়টা সিট। কিন্তু Report এ প্রায় কখনো সব দল দরকার হয় না।
          Manager জানতে চান শুধু তাঁদের কথা, যাঁরা দুইবার বা তার বেশি বুক করেছেন। Operations জানতে চায়
          শুধু সেই Departure গুলো, যেখানে চারটার বেশি সিট বিক্রি হয়ে গেছে। মানে দল বানানোর পরে আবার
          ছাঁকতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজের জন্য SQL এ আছে HAVING। শুনতে WHERE এর মতোই, দুটোই শর্ত দিয়ে ছাঁকে। কিন্তু দুটো
          কাজ করে Query এর দুই আলাদা মুহূর্তে। WHERE ছাঁকে একটা একটা Row, দল তৈরির আগে। HAVING ছাঁকে
          একটা একটা দল, দলের হিসাব হয়ে যাওয়ার পরে। এই একটা পার্থক্য না বুঝলে দুই রকম বিপদ হয়: হয়
          Database Error দিয়ে থেমে যায়, নয়তো কোনো Error ছাড়াই একটা ভুল সংখ্যা Report এ চলে যায়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন কোন শর্ত কোথায় বসে, দুটো একসাথে কীভাবে কাজ করে, GROUP BY ছাড়াও
          HAVING কেন চলে, কেন Row এর শর্ত WHERE এ রাখাই নিয়ম, আর PostgreSQL আর MySQL এ HAVING এর
          নিয়ম কোথায় আলাদা। প্রতিটা কথা দেখবেন Island Tours এর আসল ২৪টা Booking এর উপর।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি আসি সবার শেষে, যখন দলগুলো তৈরি হয়ে গেছে আর প্রতিটার যোগফল গোনা শেষ। আলাদা কোনো Row আমি দেখি না, দেখি শুধু দল। কোন Row দলে ঢুকবে, সেটা আমার আগেই WHERE ঠিক করে রেখেছে।",
      author: "HAVING",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুইবারের Customer দের তালিকা, তিনবারের চেষ্টা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Manager ফারুক সাহেব শীতের মৌসুমের আগে একটা ছোট Campaign চালাতে চান।
                যাঁরা আগে অন্তত দুইবার Island Tours এর সাথে বুক করেছেন, তাঁদেরকে একটা ধন্যবাদের SMS আর
                পরের ট্যুরে ছাড়। তিনি নতুন Developer তানিমকে বললেন, দুই বা তার বেশি Booking আছে এমন
                Customer দের তালিকাটা বের করে দিতে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আগের লেসন থেকে জানেন, প্রতিটা Customer এর Booking গুনতে লাগে GROUP BY customer_id
                আর count(*)। শর্ত বসানোর জন্য তিনি এতদিন একটাই জায়গা চিনতেন, WHERE। তাই প্রথম চেষ্টায়
                তিনি লিখলেন <code className={CODE}>WHERE count(*) &gt;= 2</code>। Database সাথে সাথে
                থামিয়ে দিল: aggregate functions are not allowed in WHERE। দলের হিসাব WHERE এ চলবে না।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় চেষ্টায় একজন সিনিয়র পাশ থেকে বললেন, দলের শর্তের জায়গা HAVING। তানিম লিখলেন{" "}
                <code className={CODE}>HAVING count(*) &gt;= 2</code>, আর নয়জন Customer এর তালিকা চলে এল।
                Error নেই, সংখ্যাও দেখতে ঠিক। তালিকাটা গেল ফারুক সাহেবের কাছে।
              </ContentParagraph>
              <ContentParagraph>
                পরদিন সকালে Support এর নাবিলা একটা অভিযোগ নিয়ে এলেন। Mitu Rahman ধন্যবাদের SMS পেয়ে ফোন
                করেছেন, কারণ তিনি আসলে একবারই ঘুরতে গেছেন। তাঁর দ্বিতীয় Booking টা তো বাতিল হয়ে গিয়েছিল।
                Oliver Bennett এর বেলাতেও একই ঘটনা। তানিমের Query ভুল ছিল না, Error ও ছিল না, কিন্তু উত্তরটা
                ভুল ছিল। কারণ cancelled Booking গুলোও দলে ঢুকে গুনতিতে বসে গিয়েছিল।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় চেষ্টায় ঠিক উত্তর এল সাতজন, আর সেটা এল দুটো ছাঁকনি একসাথে বসিয়ে: WHERE দিয়ে বাতিল
                Booking গুলো দলে ঢোকার আগেই ফেলে দেওয়া, আর HAVING দিয়ে দল তৈরির পরে দুইয়ের কম দলগুলো
                ফেলে দেওয়া। এই পুরো লেসনটা এই তিনটা চেষ্টার গল্প: কেন প্রথমটা Error দিল, কেন দ্বিতীয়টা চুপচাপ
                ভুল হলো, আর তৃতীয়টা কেন ঠিক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সবচেয়ে বিপজ্জনক ভুলটা Error দেয় না",
          content: (
            <ContentParagraph>
              প্রথম ভুলটা নিরীহ, কারণ Database নিজেই থামিয়ে দেয়। দ্বিতীয় ভুলটা বিপজ্জনক, কারণ Query
              চলে, সংখ্যা আসে, আর কেউ টের পায় না। WHERE আর HAVING এর পার্থক্য বোঝার আসল কারণ এই দ্বিতীয়
              ধরনের ভুল থেকে বাঁচা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "two-sieves",
      subHeader: { index: "002", title: "Two Sieves" },
      title: <SectionTitle>খাতা জমা আর মেধাতালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পরীক্ষার কথা ভাবুন। পরীক্ষা শেষে হলের পরিদর্শক খাতাগুলো জমা নেন। যে খাতায় রোল নম্বর
                লেখা নেই, সেটা তিনি বাক্সেই তোলেন না। এই সিদ্ধান্তটা তিনি নেন একটা একটা খাতা দেখে, কারো
                মোট নম্বর তখনো কেউ জানে না। এটাই WHERE এর কাজ: একটা একটা Row দেখে ঠিক করা, কোনটা হিসাবে
                ঢুকবে।
              </ContentParagraph>
              <ContentParagraph>
                এরপর বাক্সের খাতাগুলো ছাত্র অনুযায়ী ভাগ হয়, প্রতিটা ছাত্রের সব বিষয়ের নম্বর যোগ হয়। এটা
                GROUP BY আর SUM এর কাজ। সবশেষে বোর্ড মেধাতালিকা বানায়: যাঁদের মোট নম্বর আশির উপরে, শুধু
                তাঁরা। এই সিদ্ধান্তটা একটা খাতা দেখে নেওয়া যায় না, প্রতিটা ছাত্রের যোগফল লাগে। এটাই HAVING
                এর কাজ: পুরো দলের হিসাব দেখে ঠিক করা, কোন দল ফলাফলে থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                দুটো ছাঁকনিই একই রকম শর্ত লেখে, একই রকম AND, OR, NOT মানে। তফাত শুধু কখন আর কী দেখে। নিচের
                ছবিতে Island Tours এর একটা আসল প্রশ্ন দুই ছাঁকনির ভেতর দিয়ে যাচ্ছে: কোন Departure গুলোতে
                চারটার বেশি সিট বুক হয়েছে, বাতিলগুলো বাদ দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoSievesDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "WHERE", "HAVING"],
          rows: [
            ["কী ছাঁকে", "একটা একটা Row", "একটা একটা দল (Group)"],
            ["কখন চলে", "দল তৈরির আগে", "দল আর তার হিসাব তৈরির পরে"],
            ["কী দেখতে পায়", "Row এর Column: status, seats, booked_at", "দলের হিসাব: count(*), sum(seats), avg(...)"],
            ["Aggregate লেখা যায়?", "না, Error দেয়", "হ্যাঁ, এটাই তার আসল কাজ"],
            ["কী বদলায়", "দলে কোন Row ঢুকবে, তাই দলের হিসাবও", "কোন দল ফলাফলে থাকবে, দলের হিসাব না"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "rows-first",
      subHeader: { index: "003", title: "Rows First" },
      title: <SectionTitle>WHERE ঠিক করে, দলে কী ঢুকবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HAVING এ যাওয়ার আগে WHERE কে GROUP BY এর পাশে একবার কাজ করতে দেখুন। প্রথম বক্সে কোনো শর্ত
                নেই: সব ২৪টা Booking চোদ্দজন Customer এর দলে ভাগ হচ্ছে। Imran Kabir এর কোনো Booking নেই,
                তাই তাঁর দলই নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর Booking, সব মিলিয়ে"
              query={`SELECT customer_id,
       count(*)   AS bookings,
       sum(seats) AS seats
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;`}
              caption="চোদ্দটা দল। Customer 1 এর তিনটা Booking, আটজনের দুটো করে, আর বাকি পাঁচজনের একটা করে। Customer 5, 6 আর 11 এর গুনতিতে একটা করে cancelled Booking ও ঢুকে আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই Query তে একটা WHERE যোগ করুন। লক্ষ করুন, WHERE বসে GROUP BY এর আগে, লেখার ক্রমেও,
                চলার ক্রমেও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শুধু বাতিল নয় এমন Booking"
              query={`SELECT customer_id,
       count(*)   AS bookings,
       sum(seats) AS seats
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
ORDER BY customer_id;`}
              caption="এবার তেরোটা দল। Customer 5 পুরোপুরি হারিয়ে গেছেন, কারণ তাঁর একমাত্র Booking টাই বাতিল, তাই দলে ঢোকার মতো কোনো Row ই রইল না। Customer 6 আর 11 এর গুনতি দুই থেকে নেমে এক হয়েছে। WHERE কোনো দলকে ছোঁয়নি, শুধু Row ফেলেছে, আর তাতেই দলের হিসাব বদলে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "WHERE দল মোছে না, কিন্তু দল খালি করে দিতে পারে",
          content: (
            <ContentParagraph>
              WHERE এর কাছে দল বলে কিছু নেই, সে শুধু Row দেখে। কিন্তু একটা দলের সব Row যদি WHERE এ বাদ
              পড়ে, তাহলে GROUP BY এর কাছে সেই দলের জন্য কিছুই পৌঁছায় না, তাই দলটা তৈরিই হয় না। Customer 5
              এর বেলায় ঠিক এটাই হয়েছে। এমন দল HAVING কখনো দেখতেই পায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "having",
      subHeader: { index: "004", title: "HAVING" },
      title: <SectionTitle>দল তৈরির পরে ছাঁকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HAVING বসে GROUP BY এর ঠিক পরে, ORDER BY এর আগে। তার ভেতরে যেকোনো শর্ত লেখা যায়, কিন্তু
                তার আসল কাজ Aggregate এর উপর শর্ত: <code className={CODE}>count(*) &gt;= 2</code>,{" "}
                <code className={CODE}>sum(seats) &gt; 4</code>,{" "}
                <code className={CODE}>avg(rating) &lt; 3</code>। প্রতিটা দলের জন্য শর্তটা একবার হিসাব
                হয়। সত্য হলে দলটা ফলাফলে থাকে, মিথ্যা বা অজানা হলে বাদ।
              </ContentParagraph>
              <ContentParagraph>
                লেখার ক্রমটা মনে রাখার সহজ উপায়: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT।
                HAVING সবসময় GROUP BY এর পরে আসে, কারণ যা এখনো তৈরি হয়নি তাকে ছাঁকা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "having-shape.sql",
          code: `SELECT   column, aggregate(...)
FROM     table
WHERE    row_condition        -- ঐচ্ছিক: Row ছাঁকে, দল তৈরির আগে
GROUP BY column
HAVING   group_condition      -- ঐচ্ছিক: দল ছাঁকে, হিসাবের পরে
ORDER BY ...;`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের দ্বিতীয় চেষ্টা"
              query={`SELECT customer_id,
       count(*) AS bookings
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`}
              caption="নয়টা Row: Customer 1, 2, 3, 4, 6, 8, 9, 11 আর 13। HAVING কোনো Row বাদ দেয়নি, প্রথম বক্সের চোদ্দটা দলের মধ্যে যাদের bookings এক, সেই পাঁচটা দল বাদ দিয়েছে। এই তালিকাতেই Customer 6 আর 11 আছেন, যাঁদের একটা Booking বাতিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে একটা লিখুন। এই প্রশ্নের উত্তর একটা Table থেকেই আসে: departures Table এ প্রতিটা Row
              একটা ট্যুরের একটা তারিখ, আর তাতে <code className={CODE}>tour_id</code> আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  কোন ট্যুরগুলোর অন্তত দুটো Departure আছে? departures Table থেকে{" "}
                  <code className={CODE}>tour_id</code> আর সেই ট্যুরের Departure এর সংখ্যা দেখান, শুধু
                  যেখানে সংখ্যাটা দুই বা তার বেশি। দুটো Column, এই ক্রমে। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>GROUP BY tour_id</code>, গুনতে{" "}
                  <code className={CODE}>count(*)</code>, আর দলের শর্ত{" "}
                  <code className={CODE}>HAVING count(*) &gt;= 2</code>।
                </>
              }
              solution={`SELECT tour_id,
       count(*) AS departures
FROM departures
GROUP BY tour_id
HAVING count(*) >= 2;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "aggregate-in-where",
      subHeader: { index: "005", title: "Aggregates in WHERE" },
      title: <SectionTitle>WHERE এ count(*) কেন চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের প্রথম চেষ্টাটা নিজে চালিয়ে দেখুন। Error টা একবার নিজের চোখে দেখলে পরে চিনতে সুবিধা
                হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা"
              query={`SELECT customer_id,
       count(*) AS bookings
FROM bookings
WHERE count(*) >= 2
GROUP BY customer_id;`}
              caption="ERROR: aggregate functions are not allowed in WHERE। ভুলটা লেখার না, সময়ের। WHERE যখন চলে, তখনো কোনো দল তৈরি হয়নি, তাই গোনার মতো কিছু নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যাপারটা নিজের ভাষায় এভাবে ভাবুন। WHERE এর কাছে আসে একটা Row, ধরুন Booking 6। WHERE কে
                জিজ্ঞেস করা হচ্ছে, এই Booking এর count(*) কি দুই বা তার বেশি? কিন্তু একটা Booking এর
                count হয় না, count হয় অনেকগুলো Row এর, আর সেই অনেকগুলো Row কে এক জায়গায় আনার কাজটা
                এখনো হয়নি। PostgreSQL এর Docs এটাকে এভাবেই ব্যাখ্যা করে: যে Row গুলো Aggregate এর ভেতরে
                যাবে, সেগুলো বাছাই করতে Aggregate ব্যবহার করার কোনো মানে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                এর উল্টোটাও আছে। HAVING এর কাছে আর একটা একটা Row নেই, শুধু দল। তাই HAVING এ এমন একটা
                Column এর শর্ত লিখলে, যেটা দিয়ে দল হয়নি আর কোনো Aggregate এর ভেতরেও নেই, সেটাও Error
                দেয়। একটা দলের ভেতরে অনেকগুলো আলাদা status থাকতে পারে, HAVING কোনটার কথা বলবে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উল্টো দিকের ভুল: HAVING এ একটা Row এর Column"
              query={`SELECT customer_id,
       count(*) AS bookings
FROM bookings
GROUP BY customer_id
HAVING status = 'confirmed';`}
              caption={`ERROR: column "bookings.status" must appear in the GROUP BY clause or be used in an aggregate function। Customer 1 এর দলে confirmed আর pending দুটোই আছে, তাই "এই দলের status" বলে কিছু নেই। এই শর্তের জায়গা WHERE।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা লিখলেন", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            ["WHERE count(*) >= 2", "ERROR: aggregate functions are not allowed in WHERE", "HAVING count(*) >= 2"],
            ["HAVING status = 'confirmed'", "ERROR: column \"bookings.status\" must appear in the GROUP BY clause ...", "WHERE status = 'confirmed'"],
            ["WHERE booking_count >= 2  (booking_count একটা Alias)", "ERROR: column \"booking_count\" does not exist", "HAVING count(*) >= 2"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "both",
      subHeader: { index: "006", title: "Both in One Query" },
      title: <SectionTitle>তৃতীয় চেষ্টা: দুই ছাঁকনি একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দেখা যাক তানিমের দ্বিতীয় চেষ্টাটা চুপচাপ ভুল হলো কেন। প্রথমে Mitu Rahman (Customer 6)
                আর Oliver Bennett (Customer 11) এর Booking গুলো আলাদা করে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই অভিযোগকারীর Booking"
              query={`SELECT booking_id, customer_id, status
FROM bookings
WHERE customer_id IN (6, 11)
ORDER BY customer_id, booking_id;`}
              caption="চারটা Row। দুজনেরই একটা confirmed আর একটা cancelled। count(*) দুটোকেই গোনে, কারণ count(*) Row গোনে, Row এর status দেখে না। তাই HAVING count(*) >= 2 এর চোখে দুজনেই দুইবারের Customer।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HAVING এর হাতে এই ভুল শোধরানোর উপায় নেই। সে যখন দলটা দেখে, তখন সেটা শুধু একটা সংখ্যা: দুই।
                কোন দুটো Row থেকে সংখ্যাটা এল, সেই খবর আর তার কাছে নেই। তাই বাতিল Booking কে বাদ দেওয়ার
                কাজটা করতে হবে দল তৈরির আগেই, মানে WHERE এ। তারপর দুইয়ের নিয়মটা থাকবে HAVING এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঠিক তালিকা: WHERE তারপর HAVING"
              query={`SELECT customer_id,
       count(*) AS bookings
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`}
              caption="সাতটা Row: Customer 1, 2, 3, 4, 8, 9 আর 13। Customer 6 আর 11 বাদ পড়েছেন, কারণ তাঁদের বাতিল Booking দলেই ঢোকেনি, তাই দলের গুনতি এক। এটাই ফারুক সাহেবের আসল তালিকা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ দুটো ছাঁকনি নিজের হাতে চালিয়ে দেখুন। Customer আর Departure দুই রকম দলেই WHERE
              চালু আর বন্ধ করুন, আর HAVING এর শর্ত বদলান। প্রতিবার লক্ষ করুন বাঁ দিকে কয়টা Row দলে ঢুকছে, আর
              ডান দিকে কয়টা দল টিকছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SievesLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  এবার আপনি তানিমের জায়গায়। বাতিল Booking বাদ দিয়ে যে Customer দের অন্তত দুটো Booking আছে,
                  তাঁদের <code className={CODE}>customer_id</code> আর Booking এর সংখ্যা দেখান। দুটো Column,
                  এই ক্রমে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  বাতিল বাদ দেওয়া একটা Row এর শর্ত, তাই{" "}
                  <code className={CODE}>WHERE status &lt;&gt; &apos;cancelled&apos;</code>। দুইয়ের শর্ত
                  দলের, তাই <code className={CODE}>HAVING count(*) &gt;= 2</code>।
                </>
              }
              solution={`SELECT customer_id,
       count(*) AS bookings
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 2;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "step-by-step",
      subHeader: { index: "007", title: "Step by Step" },
      title: <SectionTitle>আসল Row ধরে, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ আপনি দেখেছিলেন, Database একটা Query লেখার ক্রমে চালায় না, চালায় নিজের একটা
                ক্রমে। এবার সেই ক্রমে GROUP BY আর HAVING এর জায়গাগুলো স্পষ্ট করে দেখুন। নিচের ছবিতে প্রতিটা
                ছাঁকনির নিচে লেখা, সেই মুহূর্তে সে কী দেখতে পায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ClauseTimelineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন Operations এর প্রশ্নটা ধরে ধাপগুলো আসল সংখ্যায় হাঁটুন: কোন Departure এ বাতিল বাদ দিয়ে
              চারটার বেশি সিট বুক হয়েছে?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM bookings",
              description: "Database Table থেকে ২৪টা Row তোলে। এখনো কোনো শর্ত নেই, কোনো দল নেই।",
            },
            {
              title: "WHERE status <> 'cancelled'",
              description:
                "প্রতিটা Row একবার করে দেখা হয়। Booking 5, 12 আর 18 বাতিল, তাই বাদ। থাকে ২১টা Row।",
            },
            {
              title: "GROUP BY departure_id",
              description:
                "২১টা Row ১৪টা দলে ভাগ হয়। Departure 12 এর একমাত্র Booking বাতিল ছিল, তাই তার কোনো দলই হয় না। এই মুহূর্তে প্রতিটা দলের sum(seats) হিসাব হয়ে যায়।",
            },
            {
              title: "HAVING sum(seats) > 4",
              description:
                "প্রতিটা দলের যোগফল দেখা হয়। Departure 1 আর 8 এ ছয়, Departure 10 এ আট। বাকি এগারোটা দল চার বা তার কম, তাই বাদ। থাকে তিনটা দল।",
            },
            {
              title: "SELECT departure_id, sum(seats) AS booked",
              description: "এবার Column গুলো তৈরি হয়, Alias booked এর জন্ম এখানে।",
            },
            {
              title: "ORDER BY departure_id",
              description: "তিনটা Row সাজানো হয়: 1, 8, 10।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভিড় জমা Departure"
              query={`SELECT departure_id,
       sum(seats) AS booked
FROM bookings
WHERE status <> 'cancelled'
GROUP BY departure_id
HAVING sum(seats) > 4
ORDER BY departure_id;`}
              caption="তিনটা Row: Departure 1 এ ৬, Departure 8 এ ৬, Departure 10 এ ৮। ঠিক উপরের ধাপগুলোর শেষ ফলাফল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই Query থেকে শুধু WHERE লাইনটা মুছে দেখুন। HAVING একই আছে, অথচ উত্তর বদলে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE ছাড়া একই প্রশ্ন"
              query={`SELECT departure_id,
       sum(seats) AS booked
FROM bookings
GROUP BY departure_id
HAVING sum(seats) > 4
ORDER BY departure_id;`}
              caption="চারটা Row। নতুন এসেছে Departure 3, পাঁচ সিট নিয়ে। অথচ সেখানে আসলে বুক আছে তিনটা সিট, বাকি দুটো একটা বাতিল Booking এর। Operations এই তালিকা ধরে Departure 3 এ বাড়তি নৌকা ভাড়া করলে টাকাটা নষ্ট হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CancelledLeakSplit />,
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "which-filter",
      subHeader: { index: "008", title: "Which Filter Where" },
      title: <SectionTitle>শর্তটা কোথায় বসবে, এক প্রশ্নে সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা শর্ত হাতে পেলে নিজেকে একটাই প্রশ্ন করুন: এই শর্তটা কি একটা Row দেখেই বলা যায়? Booking টা
                বাতিল কিনা, কত সিটের, কবে করা, এসব একটা Row দেখে বলা যায়, তাই এদের জায়গা WHERE। কয়টা Booking,
                মোট কত টাকা, গড় কত সিট, এসব একটা Row দেখে বলা যায় না, পুরো দল লাগে, তাই এদের জায়গা HAVING।
              </ContentParagraph>
              <ContentParagraph>
                মাঝখানে একটা ধূসর জায়গা আছে: যে Column দিয়ে দল হচ্ছে, তার শর্ত। GROUP BY customer_id এর পরে{" "}
                <code className={CODE}>customer_id &lt;&gt; 15</code> দুই জায়গাতেই চলে, কারণ পুরো দলে
                customer_id একটাই। কিন্তু সেটাও WHERE এ লেখাই নিয়ম, কেন, সেটা পরের Section এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["শর্তের ধরন", "উদাহরণ", "কোথায়"],
          rows: [
            ["একটা Row এর Column", "status <> 'cancelled', seats > 1, booked_at >= '2026-10-01'", "শুধু WHERE"],
            ["দলের Aggregate", "count(*) >= 2, sum(total_bdt) >= 30000, max(booked_at) >= '2026-10-01'", "শুধু HAVING"],
            ["যে Column দিয়ে দল হচ্ছে", "customer_id <> 15  (GROUP BY customer_id)", "দুটোতেই চলে, লিখুন WHERE এ"],
            ["Row আর দল দুটোর শর্ত", "বাতিল বাদ, আর দুইয়ের বেশি", "দুই ভাগ করুন: WHERE আর HAVING"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereOrHavingLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "seats > 1 আর sum(seats) > 1 এক জিনিস না",
          content: (
            <ContentParagraph>
              <code className={CODE}>WHERE seats &gt; 1</code> এর মানে, শুধু একাধিক সিটের Booking গুলো দলে
              ঢুকবে। <code className={CODE}>HAVING sum(seats) &gt; 1</code> এর মানে, সব Booking দলে ঢুকবে,
              তারপর শুধু সেই দলগুলো থাকবে যাদের মোট সিট একের বেশি। দুটো লাইন দেখতে কাছাকাছি, প্রশ্ন সম্পূর্ণ
              আলাদা। শর্ত লেখার আগে বাক্যটা বাংলায় একবার বলুন, তারপর ঠিক করুন সেটা Row এর না দলের।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  Finance জানতে চায়, কোন Payment Method এ অন্তত পাঁচটা সফল Payment হয়েছে। payments Table
                  থেকে <code className={CODE}>method</code> আর <code className={CODE}>status</code> যেখানে{" "}
                  <code className={CODE}>paid</code>, সেই Payment এর সংখ্যা দেখান, শুধু যেখানে সংখ্যাটা পাঁচ
                  বা তার বেশি। দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  কোনটা Row এর শর্ত আর কোনটা দলের, আলাদা করুন:{" "}
                  <code className={CODE}>status = &apos;paid&apos;</code> একটা Payment এর ব্যাপার, পাঁচের
                  নিয়মটা একটা Method এর সব Payment এর।
                </>
              }
              solution={`SELECT method,
       count(*) AS paid
FROM payments
WHERE status = 'paid'
GROUP BY method
HAVING count(*) >= 5;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "less-work",
      subHeader: { index: "009", title: "Less Work" },
      title: <SectionTitle>Row এর শর্ত WHERE এ, কারণ কম কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                যে শর্ত দুই জায়গাতেই চলে, সেটা WHERE এ লেখার পেছনে একটা হিসাবের যুক্তি আছে। WHERE এ ফেলে দেওয়া
                Row কখনো দলে ঢোকে না, তার জন্য কোনো যোগ বা গোনা হয় না। HAVING এ ফেলতে হলে আগে সেই Row গুলো
                দলে তুলতে হয়, হিসাব করতে হয়, তারপর দলটা ফেলে দিতে হয়। ছোট Table এ এই পার্থক্য চোখে পড়ে
                না, কয়েক কোটি Row এ পড়ে। PostgreSQL এর নিজের Tutorial ও বলে, Aggregate ছাড়া HAVING লেখা
                যায় বটে, তবে সেটা কমই কাজে লাগে, একই শর্ত WHERE ধাপে বেশি কার্যকরভাবে চলে।
              </ContentParagraph>
              <ContentParagraph>
                একটা মজার কথা আছে। সহজ ক্ষেত্রে PostgreSQL এর Planner নিজেই বুঝে ফেলে যে দলের Column এর
                একটা শর্ত আসলে WHERE এর কাজ, আর সেটা নিজে থেকে আগের ধাপে সরিয়ে দেয়। নিচের বক্সে দুটো Query
                এর EXPLAIN পাশাপাশি দেখুন, আর তৃতীয়টার সাথে মেলান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Planner কোথায় ছাঁকে"
              query={`EXPLAIN
SELECT status, count(*)
FROM bookings
GROUP BY status
HAVING status <> 'cancelled';

EXPLAIN
SELECT status, count(*)
FROM bookings
WHERE status <> 'cancelled'
GROUP BY status;

EXPLAIN
SELECT customer_id, count(*)
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2;`}
              caption="প্রথম দুটো Plan হুবহু এক: দুটোতেই Filter বসেছে Seq Scan এর নিচে, মানে Row পড়ার সময়, দল তৈরির আগে। PostgreSQL প্রথম Query এর HAVING টা নিজেই WHERE এর জায়গায় সরিয়ে নিয়েছে। তৃতীয়টায় Filter বসেছে HashAggregate এর ভেতরে, কারণ count(*) দল তৈরির আগে জানা সম্ভব না। Plan পড়া শিখবেন Module 13 এ, আপাতত শুধু Filter লাইনটা কোথায় বসেছে সেটা দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কি জায়গা বদলালে কিছু আসে যায় না? আসে যায়, তিনটা কারণে। প্রথমত, এই চালাকি সব Database
                এ নেই। MySQL এর Manual সোজা ভাষায় লেখে, HAVING চলে প্রায় সবার শেষে, Client কে ফলাফল পাঠানোর
                ঠিক আগে, কোনো Optimization ছাড়া। আর একই পাতায় পরামর্শ: যে শর্ত WHERE এ থাকার কথা, সেটা
                HAVING এ লিখবেন না।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়ত, Planner এর এই সরানো কাজ করে শুধু সহজ শর্তে। আপনি কোডে কী লিখলেন সেটাই আপনার
                ইচ্ছার দলিল, Planner কী সরাবে সেটার উপর ভরসা করে লেখা ঠিক না। তৃতীয়ত, আর সবচেয়ে বড় কারণ:
                পড়ার সুবিধা। যিনি পরে Query টা পড়বেন, তিনি WHERE দেখলেই বুঝবেন এটা Row এর ছাঁকনি, HAVING
                দেখলেই বুঝবেন দলের। দুটো গুলিয়ে ফেললে পাঠককেও গুলিয়ে দেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এক লাইনের নিয়ম",
          content: (
            <ContentParagraph>
              Aggregate থাকলে HAVING, না থাকলে WHERE। এর বাইরে খুব কম ক্ষেত্রেই যেতে হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "without-group-by",
      subHeader: { index: "010", title: "HAVING Without GROUP BY" },
      title: <SectionTitle>GROUP BY নেই, তবু HAVING</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 এ আপনি দেখেছেন, GROUP BY ছাড়া count(*) লিখলে পুরো Table টা একটাই দল হয়ে যায়, আর
                ফলাফল আসে এক Row। HAVING এর বেলাতেও একই নিয়ম। GROUP BY ছাড়া HAVING লিখলে পুরো Table একটা
                দল, আর HAVING ঠিক করে সেই একমাত্র দলটা থাকবে কিনা। তাই উত্তর হয় এক Row, নয়তো একটাও না।
                PostgreSQL এর Docs এ এটা স্পষ্ট লেখা: শর্তে বাদ পড়লে সেই একমাত্র দলের Row টাও চলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Table এক দল"
              query={`SELECT count(*) AS bookings
FROM bookings
HAVING count(*) > 20;

SELECT count(*) AS bookings
FROM bookings
HAVING count(*) > 100;`}
              caption="প্রথমটা এক Row: 24। দ্বিতীয়টা কোনো Row না, (0 rows)। দ্বিতীয় ফলাফলটা শূন্য লেখা একটা Row না, একদম খালি। এই পার্থক্যটা App এর কোডে গুরুত্বপূর্ণ: খালি ফলাফল মানে শর্ত পূরণ হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটা কোথায় কাজে লাগে? সবচেয়ে সুন্দর ব্যবহারটা Data এর স্বাস্থ্য পরীক্ষায়। একটা Query লিখুন যেটা
                সমস্যা থাকলে Row দেয়, আর না থাকলে খালি আসে। নিচের বক্সে প্রশ্নটা: কোনো দুজন Customer এর Email
                কি এক? যদি মোট Customer আর আলাদা Email এর সংখ্যা না মেলে, তাহলে কোথাও একই Email দুইবার আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Email কি সবার আলাদা?"
              query={`SELECT count(*)              AS customers,
       count(DISTINCT email) AS emails
FROM customers
HAVING count(*) <> count(DISTINCT email);`}
              caption="(0 rows): খালি ফলাফল মানে ভালো খবর, পনেরোজন Customer এর পনেরোটা আলাদা Email। শেষের HAVING লাইনটা মুছে চালালে দুটো সংখ্যাই দেখবেন: 15 আর 15। রাতের একটা Job এই রকম Query চালিয়ে কোনো Row পেলেই Alert পাঠাতে পারে।"
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
                  একটা ছোট পরীক্ষা: confirmed Booking এর মোট সংখ্যা এক Column এ দেখান, কিন্তু শুধু তখনই যখন
                  সংখ্যাটা পনেরোর বেশি। পনেরো বা তার কম হলে ফলাফল খালি আসবে। GROUP BY লাগবে না।
                </>
              }
              hint={
                <>
                  confirmed বাছাই একটা Row এর কাজ, WHERE এ। পনেরোর বেশি কিনা, সেটা পুরো দলের হিসাব:{" "}
                  <code className={CODE}>HAVING count(*) &gt; 15</code>।
                </>
              }
              solution={`SELECT count(*) AS confirmed
FROM bookings
WHERE status = 'confirmed'
HAVING count(*) > 15;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "several-conditions",
      subHeader: { index: "011", title: "Several Conditions" },
      title: <SectionTitle>HAVING এ কয়েকটা শর্ত, আর না দেখানো হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HAVING এর শর্ত WHERE এর মতোই AND, OR, NOT আর বন্ধনী দিয়ে জোড়া যায়। আর একটা সুবিধা অনেকে
                জানেন না: HAVING এ যে Aggregate লিখছেন, সেটা SELECT এ দেখাতেই হবে এমন না। দলের যেকোনো হিসাব
                দিয়ে ছাঁকা যায়, দেখাবেন অন্য কিছু।
              </ContentParagraph>
              <ContentParagraph>
                নিচের প্রশ্নটা Operations এর: কোন Departure এ বাতিল বাদে মাত্র একটা Booking, অথচ সেই একটাই অন্তত
                তিন সিটের? এমন জায়গায় একটা পরিবার একা একটা নৌকা পাচ্ছে, Guide কে আগে থেকে জানানো দরকার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একা একটা বড় দল"
              query={`SELECT departure_id,
       count(*) AS bookings
FROM bookings
WHERE status <> 'cancelled'
GROUP BY departure_id
HAVING count(*) = 1;

SELECT departure_id
FROM bookings
WHERE status <> 'cancelled'
GROUP BY departure_id
HAVING count(*) = 1
   AND sum(seats) >= 3;`}
              caption="প্রথম Query সাতটা Departure দেয়, যেগুলোতে একটাই চালু Booking: 2, 3, 5, 7, 9, 13, 15। দ্বিতীয়টায় আরেকটা শর্ত যোগ হয়েছে, আর থাকে দুটো: Departure 3 আর 15, দুটোতেই তিন সিটের একটা Booking। লক্ষ করুন, দ্বিতীয় Query এর SELECT এ sum(seats) নেই, তবু HAVING সেটা দিয়ে ছেঁকেছে।"
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
                  বাতিল বাদ দিয়ে যে Customer দের অন্তত দুটো Booking, আর সব Booking মিলিয়ে অন্তত চারটা সিট,
                  তাঁদের <code className={CODE}>customer_id</code>, Booking এর সংখ্যা আর মোট সিট দেখান।
                  তিনটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  দুটো দলের শর্ত একসাথে:{" "}
                  <code className={CODE}>HAVING count(*) &gt;= 2 AND sum(seats) &gt;= 4</code>। শুধু সিটের
                  শর্ত দিলে একটা বাড়তি Customer চলে আসবেন, যাঁর একটাই চার সিটের Booking।
                </>
              }
              solution={`SELECT customer_id,
       count(*)   AS bookings,
       sum(seats) AS seats
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 2
   AND sum(seats) >= 4;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "duplicates",
      subHeader: { index: "012", title: "Finding Duplicates" },
      title: <SectionTitle>দুইবার আছে এমন জিনিস খোঁজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GROUP BY আর HAVING count(*) &gt; 1 এর জুটি SQL এর সবচেয়ে পরিচিত কৌশলগুলোর একটা: একই জিনিস
                একাধিকবার আছে কিনা খোঁজা। Interview তে প্রায় নিশ্চিতভাবে এই প্রশ্নটা আসে, আর কাজের জায়গায়
                আসে আরও বেশি: একই Customer এর দুটো Account, একই Booking এর জন্য দুইবার টাকা কাটা, একই
                তারিখে একই ট্যুরের দুটো Departure।
              </ContentParagraph>
              <ContentParagraph>
                কৌশলটা সহজ। যেটা “একই” হওয়ার কথা না, সেটা দিয়ে দল বানান। তারপর যে দলে একের বেশি Row,
                সেগুলোই সন্দেহজনক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর দুটো স্বাস্থ্য পরীক্ষা"
              query={`-- একই Customer কি একই Departure দুইবার বুক করেছেন?
SELECT customer_id, departure_id, count(*)
FROM bookings
GROUP BY customer_id, departure_id
HAVING count(*) > 1;

-- একই Booking এর কি একাধিক Payment আছে?
SELECT booking_id, count(*)
FROM payments
GROUP BY booking_id
HAVING count(*) > 1;`}
              caption="দুটোই (0 rows)। Sample Data পরিষ্কার: কোনো Customer একই তারিখ দুইবার বুক করেননি, আর কোনো Booking এর জন্য দুইবার Payment হয়নি। আসল Production এ এই দুটো Query নিয়মিত চালানো একটা ভালো অভ্যাস।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  Marketing টিম শহরভিত্তিক অনুষ্ঠান করতে চায়, তবে শুধু যে শহরে একাধিক Customer থাকেন।
                  customers Table থেকে <code className={CODE}>city</code> আর সেই শহরের Customer এর সংখ্যা
                  দেখান, শুধু যেখানে সংখ্যাটা একের বেশি। দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>GROUP BY city</code> আর{" "}
                  <code className={CODE}>HAVING count(*) &gt; 1</code>।
                </>
              }
              solution={`SELECT city,
       count(*) AS customers
FROM customers
GROUP BY city
HAVING count(*) > 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "aliases-and-mysql",
      subHeader: { index: "013", title: "Aliases and MySQL" },
      title: <SectionTitle>HAVING এ Alias: PostgreSQL না বলে, MySQL হ্যাঁ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT এ <code className={CODE}>count(*) AS booking_count</code> লেখার পর HAVING এ আবার পুরো
                count(*) লিখতে কারো ভালো লাগে না। মনে হয়{" "}
                <code className={CODE}>HAVING booking_count &gt;= 2</code> লিখলেই তো হয়। PostgreSQL এ হয় না।
                উপরের ধাপের ছবিটা মনে করুন: HAVING চলে চার নম্বরে, Alias তৈরি হয় পাঁচ নম্বরে। HAVING যখন চলে,
                তখন booking_count নামের কিছু এখনো নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Alias দিয়ে HAVING"
              query={`-- যেটা সব জায়গায় চলে
SELECT customer_id, count(*) AS booking_count
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2;

-- যেটা PostgreSQL এ চলে না
SELECT customer_id, count(*) AS booking_count
FROM bookings
GROUP BY customer_id
HAVING booking_count >= 2;`}
              caption={`প্রথমটা নয়টা Row দেয়। দ্বিতীয়টা থামে: ERROR: column "booking_count" does not exist। ORDER BY booking_count কিন্তু চলত, কারণ ORDER BY চলে SELECT এর পরে।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ছোট ফাঁদের কথাও জেনে রাখুন। Alias এর নাম যদি Table এর নামের মতো হয়, যেমন{" "}
                <code className={CODE}>count(*) AS bookings</code> আর তারপর{" "}
                <code className={CODE}>HAVING bookings &gt;= 2</code>, তাহলে PostgreSQL এর Error আরও অদ্ভুত
                দেখায়: operator does not exist: bookings &gt;= integer। কারণ PostgreSQL এ শুধু Table এর নাম
                লিখলে সেটা সেই Table এর পুরো Row বোঝায়, আর পুরো একটা Row কে দুইয়ের সাথে তুলনা করা যায় না।
                এই Error দেখলে বুঝবেন, নামটা Table এর নামের সাথে মিলে গেছে।
              </ContentParagraph>
              <ContentParagraph>
                MySQL এখানে আলাদা। তার Manual লেখে, SQL Standard অনুযায়ী HAVING শুধু GROUP BY এর Column আর
                Aggregate দেখতে পায়, কিন্তু MySQL একটা বাড়তি সুবিধা দেয়: HAVING এ SELECT এর Column আর Alias
                ও চলে। তাই আপনি যে MySQL ভিডিওটা দেখছেন, সেখানে HAVING এ Alias দেখলে অবাক হবেন না, কিন্তু
                PostgreSQL এ সেটা হুবহু চলবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Query", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["HAVING booking_count >= 2  (Alias)", "ERROR: column \"booking_count\" does not exist", "চলে, ৯টা Row"],
            ["WHERE count(*) >= 2", "ERROR: aggregate functions are not allowed in WHERE", "ERROR 1111 (HY000): Invalid use of group function"],
            ["HAVING status = 'confirmed'  (GROUP BY customer_id)", "ERROR: column \"bookings.status\" must appear in the GROUP BY clause ...", "ERROR 1054 (42S22): Unknown column 'status' in 'having clause'"],
            ["WHERE booking_count >= 2  (Alias)", "ERROR: column \"booking_count\" does not exist", "ERROR 1054 (42S22): Unknown column 'booking_count' in 'where clause'"],
            ["HAVING count(*) > 20, GROUP BY ছাড়া", "এক Row: 24", "এক Row: 24"],
            ["WHERE তারপর HAVING, departure > 4 সিট", "৩টা Row: 1, 8, 10", "৩টা Row: 1, 8, 10"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুই জায়গায় চলে এমন অভ্যাস",
          content: (
            <ContentParagraph>
              HAVING এ সবসময় পুরো Aggregate টা আবার লিখুন: <code className={CODE}>HAVING count(*) &gt;= 2</code>।
              এটা PostgreSQL, MySQL, SQL Server, সবখানে চলে। MySQL এর Manual নিজেও একটা বিপদের কথা লেখে:
              Alias এর নাম যদি কোনো Column এর নামের সাথে মিলে যায়, তাহলে HAVING কোনটা বুঝবে সেটা ঝুঁকির।
              পুরো হিসাব লিখলে সেই প্রশ্নই ওঠে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর দুটো আসল Report</SectionTitle>,
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
                প্রতি মাসের প্রথম সোমবার Island Tours এর মালিকের কাছে একটা ছোট Report যায়। তার প্রথম অংশ:
                কোন মাসে confirmed Booking থেকে অন্তত পঞ্চাশ হাজার টাকা এসেছে। মাস বের করা Module 04 এর
                date_trunc, মাস অনুযায়ী দল Lesson 02 এর GROUP BY, আর পঞ্চাশ হাজারের নিয়ম এই লেসনের HAVING।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভালো মাসগুলো"
              query={`SELECT date_trunc('month', booked_at)::date AS month,
       count(*)       AS bookings,
       sum(total_bdt) AS revenue
FROM bookings
WHERE status = 'confirmed'
GROUP BY date_trunc('month', booked_at)
HAVING sum(total_bdt) >= 50000
ORDER BY month;`}
              caption="পাঁচটা মাস: ডিসেম্বর 2025 (75000.00), জানুয়ারি (92000.00), মার্চ (57600.00), সেপ্টেম্বর (50500.00) আর অক্টোবর 2026 (129500.00)। ফেব্রুয়ারি বাদ পড়েছে, সেই মাসে একটাই confirmed Booking, 19000.00 টাকার। মাসগুলো Dhaka সময় ধরে, কারণ এই বক্সের TimeZone Asia/Dhaka।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Report এর দ্বিতীয় অংশ ফারুক সাহেবের Campaign এর জন্য: বিশ্বস্ত Customer। তাঁর সংজ্ঞাটা এবার
                আরও কড়া। শুধু confirmed Booking গুনবে, অন্তত দুটো থাকতে হবে, আর সব মিলিয়ে অন্তত ত্রিশ হাজার
                টাকা খরচ। নামগুলো আলাদা Table এ, সেগুলো জোড়া লাগানো শিখবেন Module 06 এ। আপাতত customer_id
                দিয়েই তালিকা।
              </ContentParagraph>
            </div>
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
                  বিশ্বস্ত Customer দের তালিকা: শুধু confirmed Booking ধরে যাঁদের অন্তত দুটো Booking আর মোট{" "}
                  <code className={CODE}>total_bdt</code> অন্তত 30000। দেখান{" "}
                  <code className={CODE}>customer_id</code>, confirmed Booking এর সংখ্যা আর মোট খরচ, এই
                  ক্রমে তিনটা Column। সবচেয়ে বেশি খরচ করা Customer আগে।
                </>
              }
              hint={
                <>
                  একটা Row এর শর্ত (confirmed) যায় WHERE এ। দুটো দলের শর্ত যায় HAVING এ, AND দিয়ে জোড়া।
                  শেষে <code className={CODE}>ORDER BY sum(total_bdt) DESC</code>। দুইয়ের শর্তটা ভুলে
                  গেলে দুজন বাড়তি Customer চলে আসবেন, যাঁদের একটাই বড় Booking।
                </>
              }
              solution={`SELECT customer_id,
       count(*)       AS confirmed,
       sum(total_bdt) AS spent
FROM bookings
WHERE status = 'confirmed'
GROUP BY customer_id
HAVING count(*) >= 2
   AND sum(total_bdt) >= 30000
ORDER BY spent DESC;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Operations এর সকালের তালিকা:</strong> প্রতিদিন সকালে ভিড় জমা Departure, মানে বাতিল
                বাদে চারটার বেশি সিট, যাতে বাড়তি নৌকা আর খাবারের ব্যবস্থা আগে থেকে হয়।
              </ListItem>
              <ListItem>
                <strong>Finance এর পরীক্ষা:</strong> কোনো Booking এর একাধিক Payment আছে কিনা, GROUP BY
                booking_id আর HAVING count(*) &gt; 1, খালি এলেই শান্তি।
              </ListItem>
              <ListItem>
                <strong>Support এর সতর্কতা:</strong> যে Customer এর দুইটা বা বেশি Booking বাতিল হয়েছে,
                WHERE status = &apos;cancelled&apos; আর HAVING count(*) &gt;= 2, তাঁকে একটা ফোন করে কারণ
                জানতে চাওয়া।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা ছাঁকা Report লেখার পাঁচ ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা বাংলায় পুরো লিখুন",
              description:
                "যেমন: বাতিল বাদে, অন্তত দুটো Booking আছে এমন Customer। প্রতিটা শর্ত আলাদা করে চিহ্নিত করুন।",
            },
            {
              title: "প্রতিটা শর্তকে Row বা দল হিসেবে ভাগ করুন",
              description:
                "একটা Booking দেখে বলা যায়? তাহলে Row এর শর্ত। গোনা, যোগ, গড় লাগে? তাহলে দলের শর্ত।",
            },
            {
              title: "Row এর শর্ত WHERE এ, দল ছাড়া চালিয়ে দেখুন",
              description:
                "শুধু SELECT, FROM আর WHERE দিয়ে চালান। যে Row গুলো দলে ঢুকবে, সেগুলো ঠিক কিনা চোখে দেখুন।",
            },
            {
              title: "GROUP BY যোগ করুন, HAVING ছাড়া চালান",
              description:
                "সব দল আর তাদের হিসাব দেখুন। HAVING এর সীমানা কোথায় বসালে কোন দল থাকবে, আগে থেকেই আন্দাজ করুন।",
            },
            {
              title: "HAVING বসান, আন্দাজের সাথে মেলান",
              description:
                "পুরো Aggregate টা লিখুন, Alias না। ফলাফলের সংখ্যা আন্দাজের সাথে না মিললে আগের ধাপে ফিরে যান।",
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
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            ["WHERE এ count(*) বা sum()", "Error: aggregate functions are not allowed in WHERE", "দলের শর্ত HAVING এ"],
            ["বাতিল বাদ দেওয়া ভুলে যাওয়া", "Error ছাড়াই ভুল গুনতি, Mitu আর Oliver তালিকায়", "WHERE status <> 'cancelled' আগে"],
            ["Row এর শর্ত HAVING এ", "দলে না থাকা Column হলে Error, থাকলে বাড়তি কাজ আর ঘোলাটে কোড", "Aggregate নেই মানে WHERE"],
            ["PostgreSQL এ HAVING এ Alias", "ERROR: column \"booking_count\" does not exist", "পুরো Aggregate আবার লিখুন"],
            ["seats > 1 আর sum(seats) > 1 গুলিয়ে ফেলা", "সম্পূর্ণ আলাদা প্রশ্নের উত্তর", "বাক্যটা বাংলায় বলে দেখুন Row না দল"],
            ["GROUP BY ছাড়া HAVING এর খালি ফলাফলকে শূন্য ভাবা", "App ভাবে Row আছে, আসলে নেই", "খালি ফলাফল মানে শর্ত পূরণ হয়নি"],
            ["HAVING কে WHERE এর পরে, GROUP BY এর আগে লেখা", "Syntax Error", "ক্রম: WHERE, GROUP BY, HAVING, ORDER BY"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ক্রমে লেখা"
              query={`SELECT customer_id, count(*)
FROM bookings
HAVING count(*) >= 2
GROUP BY customer_id;`}
              caption={`ERROR: syntax error at or near "GROUP"। লেখার ক্রম বাঁধা: GROUP BY আগে, HAVING পরে। ঠিক করে চালালে নয়টা Row আসবে।`}
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
                    href="https://www.postgresql.org/docs/current/tutorial-agg.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Aggregate Functions
                  </a>
                  : WHERE আর HAVING এর মূল পার্থক্যের সবচেয়ে পরিষ্কার ব্যাখ্যা, আর কেন Row এর শর্ত WHERE এ
                  বেশি কার্যকর।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : The GROUP BY and HAVING Clauses অংশ, GROUP BY ছাড়া HAVING এর নিয়মসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-select.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SELECT
                  </a>
                  : HAVING Clause অংশে কোন Column এর উল্লেখ কখন বৈধ, তার আনুষ্ঠানিক নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/select.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: SELECT Statement
                  </a>
                  : HAVING এ Alias এর MySQL সুবিধা, নামের দ্বন্দ্বের সতর্কতা, আর HAVING যে প্রায় শেষে চলে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, GROUP BY আর HAVING এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে, তাই সেখানে HAVING এ Alias দেখলে মনে রাখবেন PostgreSQL এ পুরো
                  Aggregate লিখতে হয়।
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
                  <strong>WHERE</strong> একটা একটা Row ছাঁকে, দল তৈরির আগে। ঠিক করে দলে কী ঢুকবে, তাই দলের
                  হিসাবও বদলায়।
                </ListItem>
                <ListItem>
                  <strong>HAVING</strong> একটা একটা দল ছাঁকে, দল আর তার হিসাব তৈরির পরে। দলের হিসাব বদলায় না,
                  শুধু দল রাখে বা ফেলে।
                </ListItem>
                <ListItem>
                  Aggregate থাকলে HAVING, না থাকলে WHERE। WHERE এ count(*) দিলে Error, HAVING এ দলের বাইরের
                  Column দিলে Error।
                </ListItem>
                <ListItem>
                  সবচেয়ে বিপজ্জনক ভুল Error দেয় না: বাতিল Booking WHERE এ বাদ না দিলে HAVING ভুল দলকে পাশ
                  করিয়ে দেয়, যেমন Departure 3 বা Mitu Rahman।
                </ListItem>
                <ListItem>
                  GROUP BY ছাড়া HAVING পুরো Table কে এক দল ধরে, উত্তর এক Row নয়তো খালি। Data এর স্বাস্থ্য
                  পরীক্ষায় দারুণ কাজের।
                </ListItem>
                <ListItem>
                  HAVING এ দেখানো হয়নি এমন Aggregate দিয়েও ছাঁকা যায়, AND আর OR দিয়ে কয়েকটা শর্ত জোড়া যায়।
                </ListItem>
                <ListItem>
                  PostgreSQL এ HAVING Alias চেনে না, MySQL চেনে। দুই জায়গায় চলে পুরো Aggregate লেখা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন পর্যন্ত একটা Query তে আপনি একটা জিনিসই গুনতে পারছেন: হয় সব Booking, নয়তো শুধু confirmed।
                কিন্তু Dashboard চায় এক লাইনে সব: কয়টা confirmed, কয়টা pending, কয়টা বাতিল, পাশাপাশি। প্রতিটার
                জন্য আলাদা Query না লিখে এক Query তেই সেটা কীভাবে হয়, সেটা পরের লেসন{" "}
                <Link href="/sql/topic/conditional-aggregation" className={LINK}>
                  Conditional Aggregation and FILTER
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
      ["WHERE", "Row ছাঁকে, দল তৈরির আগে", "WHERE status <> 'cancelled'"],
      ["HAVING", "দল ছাঁকে, হিসাবের পরে", "HAVING count(*) >= 2"],
      ["লেখার ক্রম", "WHERE, GROUP BY, HAVING, ORDER BY", "বিশ্বস্ত Customer এর Query"],
      ["চলার ক্রম", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT", "২৪ Row থেকে ৩টা Departure"],
      ["WHERE এ Aggregate", "Error, কারণ তখনো দল নেই", "WHERE count(*) >= 2"],
      ["HAVING এ দলের বাইরের Column", "Error, দলে অনেক মান থাকতে পারে", "HAVING status = 'confirmed'"],
      ["নিঃশব্দ ভুল", "বাতিল Row দলে ঢুকে হিসাব ফোলায়", "Departure 3 এর ৫ সিট, আসলে ৩"],
      ["WHERE দল খালি করে", "সব Row বাদ গেলে দলই তৈরি হয় না", "Customer 5, Departure 12"],
      ["GROUP BY ছাড়া HAVING", "পুরো Table এক দল, এক Row নয়তো খালি", "Email এর পুনরাবৃত্তি পরীক্ষা"],
      ["না দেখানো Aggregate", "HAVING এ চলে, SELECT এ লাগে না", "HAVING count(*) = 1 AND sum(seats) >= 3"],
      ["Duplicate খোঁজা", "GROUP BY তারপর HAVING count(*) > 1", "একই Booking এর একাধিক Payment"],
      ["Alias", "PostgreSQL এর HAVING এ না, MySQL এ হ্যাঁ", "HAVING booking_count >= 2"],
      ["কম কাজের নিয়ম", "Aggregate নেই মানে WHERE", "customer_id <> 15 WHERE এ"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "WHERE আর HAVING এর মূল পার্থক্য কোনটা?",
        options: [
          {
            key: "A",
            text: "WHERE সংখ্যার শর্ত নেয়, HAVING লেখার শর্ত",
            isCorrect: false,
            explanation: "দুটোই যেকোনো ধরনের মানের শর্ত নিতে পারে। তফাত মানের ধরনে না, সময় আর বিষয়ে।",
          },
          {
            key: "B",
            text: "WHERE দল তৈরির আগে Row ছাঁকে, HAVING দল তৈরির পরে দল ছাঁকে",
            isCorrect: true,
            explanation: "ঠিক। WHERE ঠিক করে কোন Row দলে ঢুকবে, HAVING ঠিক করে কোন দল ফলাফলে থাকবে।",
          },
          {
            key: "C",
            text: "HAVING শুধু MySQL এ আছে",
            isCorrect: false,
            explanation: "HAVING SQL Standard এর অংশ, PostgreSQL সহ সব বড় Database এ আছে।",
          },
          {
            key: "D",
            text: "দুটো একই, শুধু নাম আলাদা",
            isCorrect: false,
            explanation: "একই হলে WHERE এ count(*) চলত। চলে না, কারণ WHERE এর সময় কোনো দল থাকে না।",
          },
        ],
      },
      {
        id: 2,
        text: "নিচের কোন Query টা PostgreSQL এ Error দেবে?",
        options: [
          {
            key: "A",
            text: "SELECT customer_id, count(*) FROM bookings GROUP BY customer_id HAVING count(*) >= 2",
            isCorrect: false,
            explanation: "এটা একদম ঠিক, নয়টা Row দেয়।",
          },
          {
            key: "B",
            text: "SELECT customer_id, count(*) FROM bookings WHERE count(*) >= 2 GROUP BY customer_id",
            isCorrect: true,
            explanation: "ঠিক। WHERE এ Aggregate নিষেধ: aggregate functions are not allowed in WHERE।",
          },
          {
            key: "C",
            text: "SELECT count(*) FROM bookings HAVING count(*) > 20",
            isCorrect: false,
            explanation: "GROUP BY ছাড়া HAVING বৈধ, পুরো Table একটা দল। এক Row আসে: 24।",
          },
          {
            key: "D",
            text: "SELECT customer_id FROM bookings WHERE status <> 'cancelled' GROUP BY customer_id",
            isCorrect: false,
            explanation: "Row এর শর্ত WHERE এ, ঠিক জায়গায়। তেরোটা Row আসে।",
          },
        ],
      },
      {
        id: 3,
        text: "HAVING count(*) >= 2 নয়জন দেয়, কিন্তু আগে WHERE status <> 'cancelled' যোগ করলে সাতজন। দুজন কেন বাদ পড়লেন?",
        options: [
          {
            key: "A",
            text: "HAVING দুটো Row মুছে দিয়েছে",
            isCorrect: false,
            explanation: "HAVING কখনো একটা Row মোছে না, শুধু পুরো দল রাখে বা ফেলে।",
          },
          {
            key: "B",
            text: "তাঁদের বাতিল Booking দলে ঢোকেনি, তাই দলের গুনতি দুই থেকে এক হয়ে HAVING এ বাদ পড়েছে",
            isCorrect: true,
            explanation: "ঠিক। Customer 6 আর 11 এর একটা করে Booking বাতিল। WHERE সেটা আগেই ফেলেছে, তাই count(*) এক।",
          },
          {
            key: "C",
            text: "WHERE পুরো দলটা মুছে দিয়েছে",
            isCorrect: false,
            explanation: "তাঁদের দল তৈরি হয়েছে, একটা confirmed Booking দিয়ে। দল বাদ পড়েছে HAVING এ, গুনতি এক বলে।",
          },
          {
            key: "D",
            text: "Query টা র‍্যান্ডমভাবে ফল দেয়",
            isCorrect: false,
            explanation: "একই Data তে একই Query সবসময় একই দল দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT count(*) FROM bookings HAVING count(*) > 100 কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "একটা Row, যাতে 0 লেখা",
            isCorrect: false,
            explanation: "শর্ত মিথ্যা হলে HAVING দলটাই ফেলে দেয়, শূন্য লেখা Row বানায় না।",
          },
          {
            key: "B",
            text: "একটা Row, যাতে 24 লেখা",
            isCorrect: false,
            explanation: "24 > 100 মিথ্যা, তাই দলটা টেকে না।",
          },
          {
            key: "C",
            text: "কোনো Row না",
            isCorrect: true,
            explanation: "ঠিক। পুরো Table একটা দল, শর্তে বাদ পড়ায় ফলাফল খালি: (0 rows)।",
          },
          {
            key: "D",
            text: "Error, কারণ GROUP BY নেই",
            isCorrect: false,
            explanation: "GROUP BY ছাড়া HAVING বৈধ। PostgreSQL এর Docs এই নিয়মটা আলাদা করে লেখে।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT customer_id, count(*) AS booking_count FROM bookings GROUP BY customer_id HAVING booking_count >= 2, কোথায় চলবে?",
        options: [
          {
            key: "A",
            text: "PostgreSQL আর MySQL দুটোতেই",
            isCorrect: false,
            explanation: "PostgreSQL এ HAVING চলে SELECT এর আগে, তাই Alias তখনো জন্মায়নি।",
          },
          {
            key: "B",
            text: "শুধু PostgreSQL এ",
            isCorrect: false,
            explanation: "উল্টো। PostgreSQL বলে column \"booking_count\" does not exist।",
          },
          {
            key: "C",
            text: "শুধু MySQL এ",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর একটা বাড়তি সুবিধা HAVING এ SELECT এর Alias চেনা। PostgreSQL Standard মেনে চলে।",
          },
          {
            key: "D",
            text: "কোথাও না",
            isCorrect: false,
            explanation: "MySQL 8.4 এ এটা চলে আর নয়টা Row দেয়, এই লেসনের জন্য আসল MySQL এ চালিয়ে দেখা।",
          },
        ],
      },
      {
        id: 6,
        text: "GROUP BY customer_id এর পরে কোন শর্তটা শুধু WHERE এ বসতে পারে?",
        options: [
          {
            key: "A",
            text: "count(*) >= 2",
            isCorrect: false,
            explanation: "এটা দলের হিসাব, শুধু HAVING এ চলে।",
          },
          {
            key: "B",
            text: "status = 'confirmed'",
            isCorrect: true,
            explanation: "ঠিক। status একটা Row এর Column, দল দিয়ে না, Aggregate এর ভেতরেও না। HAVING এ দিলে Error।",
          },
          {
            key: "C",
            text: "sum(total_bdt) >= 30000",
            isCorrect: false,
            explanation: "Aggregate, তাই HAVING।",
          },
          {
            key: "D",
            text: "customer_id <> 15",
            isCorrect: false,
            explanation: "দলের Column, দুই জায়গাতেই চলে। লেখা ভালো WHERE এ, কিন্তু শুধু WHERE না।",
          },
        ],
      },
      {
        id: 7,
        text: "WHERE status <> 'cancelled' যোগ করার পর GROUP BY departure_id এর ফলাফল থেকে Departure 12 পুরো হারিয়ে গেল। কেন?",
        options: [
          {
            key: "A",
            text: "HAVING তাকে বাদ দিয়েছে",
            isCorrect: false,
            explanation: "এই প্রশ্নে HAVING ই নেই।",
          },
          {
            key: "B",
            text: "তার একমাত্র Booking বাতিল ছিল, তাই দলে ঢোকার মতো কোনো Row রইল না",
            isCorrect: true,
            explanation: "ঠিক। Booking 18 বাতিল, WHERE সেটা ফেলেছে, তাই Departure 12 এর জন্য কোনো দলই তৈরি হয়নি।",
          },
          {
            key: "C",
            text: "Departure 12 এর তারিখ পুরনো",
            isCorrect: false,
            explanation: "Query তে কোনো তারিখের শর্ত নেই।",
          },
          {
            key: "D",
            text: "WHERE দল মুছে দিতে পারে",
            isCorrect: false,
            explanation: "WHERE দল চেনেই না। সে শুধু Row ফেলেছে, খালি হয়ে যাওয়ায় দলটা আর তৈরি হয়নি।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা Query তে WHERE, GROUP BY, HAVING আর SELECT এর Alias আছে। Database কোন ক্রমে চালায়?",
        options: [
          {
            key: "A",
            text: "SELECT, WHERE, GROUP BY, HAVING",
            isCorrect: false,
            explanation: "এটা লেখার ক্রমের কাছাকাছি, চলার না।",
          },
          {
            key: "B",
            text: "WHERE, GROUP BY, HAVING, SELECT",
            isCorrect: true,
            explanation: "ঠিক। তাই HAVING চলার সময় SELECT এর Alias এখনো জন্মায়নি, আর PostgreSQL তাকে চেনে না।",
          },
          {
            key: "C",
            text: "GROUP BY, WHERE, HAVING, SELECT",
            isCorrect: false,
            explanation: "WHERE দলের আগে চলে, তাই তো সে দলে কী ঢুকবে ঠিক করতে পারে।",
          },
          {
            key: "D",
            text: "HAVING, GROUP BY, WHERE, SELECT",
            isCorrect: false,
            explanation: "যে দল তৈরি হয়নি, HAVING তাকে ছাঁকতে পারে না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর ছাঁকা Report",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দুইবারের ভুল তালিকা:</strong> HAVING count(*) &gt;= 2 দিয়ে নয়জনের তালিকা বের করুন, তারপর
        WHERE status &lt;&gt; &apos;cancelled&apos; যোগ করে সাতজনের। কোন দুজন বাদ পড়লেন, আর কেন, তিন
        লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>Support এর সতর্কতা:</strong> যে Customer এর অন্তত একটা Booking বাতিল হয়েছে, তাঁদের
        customer_id আর বাতিলের সংখ্যা। তারপর সীমাটা দুই করুন। কয়জন থাকলেন? দুটো Output ই রাখুন।
      </span>,
      <span key="3">
        <strong>ভিড়ের তালিকা দুইভাবে:</strong> চারটার বেশি সিট বুক হয়েছে এমন Departure, একবার WHERE ছাড়া,
        একবার বাতিল বাদ দিয়ে। কোন Departure পার্থক্য তৈরি করল, আর Operations ভুল তালিকা পেলে কী ক্ষতি হতো।
      </span>,
      <span key="4">
        <strong>একটা স্বাস্থ্য পরীক্ষা নিজে বানান:</strong> GROUP BY ছাড়া HAVING দিয়ে এমন একটা Query লিখুন,
        যেটা কোনো Customer এর ফোন নম্বর দুইবার থাকলে Row দেয়, নইলে খালি আসে। Sample Data তে কী এল?
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> খাতা জমা আর মেধাতালিকার উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে
        বোঝান, WHERE আর HAVING কেন দুটো আলাদা ছাঁকনি।
      </span>,
    ],
    deliverables: [
      <span key="d1">নয় আর সাতজনের দুটো Query, আর বাদ পড়া দুজনের ব্যাখ্যা</span>,
      <span key="d2">বাতিলের তালিকার দুটো Output</span>,
      <span key="d3">ভিড়ের তালিকার দুটো সংস্করণ আর পার্থক্যের ব্যাখ্যা</span>,
      <span key="d4">ফোন নম্বরের স্বাস্থ্য পরীক্ষার Query আর তার ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ দুই ছাঁকনি",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "দল আর WHERE",
        description:
          "প্রথম ফাইলের দুটো Query চালান। দলের সংখ্যা চোদ্দ থেকে তেরো কেন হলো, Customer 5 এর Booking দেখে নিজে ব্যাখ্যা করুন।",
      },
      {
        title: "HAVING এর গুনতি",
        description:
          "দ্বিতীয় ফাইলে নয় আর সাত। প্রতিটা ফলাফলের Row সংখ্যা মন্তব্যের সাথে মেলান।",
      },
      {
        title: "তিনটা Error চেনা",
        description:
          "তৃতীয় ফাইলের তিনটা Query ই Error দেবে। psql এ ON_ERROR_STOP বন্ধ রেখে চালান, তিনটা Error এর লেখা খাতায় টুকে রাখুন।",
      },
      {
        title: "ভিড় জমা Departure",
        description:
          "চতুর্থ ফাইলে একই HAVING, WHERE সহ আর WHERE ছাড়া। কোন Departure দ্বিতীয়টায় বাড়তি এল, মিলিয়ে দেখুন।",
      },
      {
        title: "GROUP BY ছাড়া HAVING",
        description:
          "পঞ্চম ফাইলে এক Row, খালি, আর Email পরীক্ষা। psql খালি ফলাফলে কী লেখে, লক্ষ করুন।",
      },
      {
        title: "মালিকের Report",
        description:
          "ষষ্ঠ ফাইলে বিশ্বস্ত Customer আর ভালো মাস। দুটোর Row সংখ্যা মিলিয়ে নিন। মাসগুলো আপনার মেশিনের TimeZone ধরে, প্রথম লাইনে Dhaka বসিয়ে নিন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-groups.sql",
        code: `SELECT customer_id, count(*) AS bookings
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;
-- (14 rows)

SELECT customer_id, count(*) AS bookings
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
ORDER BY customer_id;
-- (13 rows), customer 5 নেই`,
      },
      {
        language: "sql",
        filename: "02-having.sql",
        code: `SELECT customer_id, count(*) AS bookings
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2;
-- (9 rows)

SELECT customer_id, count(*) AS bookings
FROM bookings
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING count(*) >= 2;
-- (7 rows), customer 6 আর 11 নেই`,
      },
      {
        language: "sql",
        filename: "03-errors.sql",
        code: `SELECT customer_id, count(*) FROM bookings
WHERE count(*) >= 2 GROUP BY customer_id;
-- ERROR:  aggregate functions are not allowed in WHERE

SELECT customer_id, count(*) AS booking_count FROM bookings
GROUP BY customer_id HAVING booking_count >= 2;
-- ERROR:  column "booking_count" does not exist

SELECT customer_id, count(*) FROM bookings
GROUP BY customer_id HAVING status = 'confirmed';
-- ERROR:  column "bookings.status" must appear in the GROUP BY clause or be used in an aggregate function`,
      },
      {
        language: "sql",
        filename: "04-departures.sql",
        code: `SELECT departure_id, sum(seats) AS booked
FROM bookings
WHERE status <> 'cancelled'
GROUP BY departure_id
HAVING sum(seats) > 4
ORDER BY departure_id;
-- (3 rows): 1, 8, 10

SELECT departure_id, sum(seats) AS booked
FROM bookings
GROUP BY departure_id
HAVING sum(seats) > 4
ORDER BY departure_id;
-- (4 rows): 1, 3, 8, 10`,
      },
      {
        language: "sql",
        filename: "05-no-group-by.sql",
        code: `SELECT count(*) AS bookings FROM bookings HAVING count(*) > 20;
-- (1 row): 24

SELECT count(*) AS bookings FROM bookings HAVING count(*) > 100;
-- (0 rows)

SELECT count(*) AS customers, count(DISTINCT email) AS emails
FROM customers
HAVING count(*) <> count(DISTINCT email);
-- (0 rows), সব Email আলাদা`,
      },
      {
        language: "sql",
        filename: "06-owner-report.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT customer_id, count(*) AS confirmed, sum(total_bdt) AS spent
FROM bookings
WHERE status = 'confirmed'
GROUP BY customer_id
HAVING count(*) >= 2 AND sum(total_bdt) >= 30000
ORDER BY spent DESC;
-- (4 rows): 2, 8, 1, 4

SELECT date_trunc('month', booked_at)::date AS month, sum(total_bdt) AS revenue
FROM bookings
WHERE status = 'confirmed'
GROUP BY date_trunc('month', booked_at)
HAVING sum(total_bdt) >= 50000
ORDER BY month;
-- (5 rows), ফেব্রুয়ারি 2026 নেই`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ড্রিলে আগে HAVING ছাড়া চালিয়ে সব দল দেখুন, তারপর HAVING বসান। কোন দলগুলো পড়ে যাবে সেটা আগে
        আন্দাজ করতে পারলে বুঝবেন ধারণাটা হাতে এসেছে।
      </ContentParagraph>
    ),
  },
};
