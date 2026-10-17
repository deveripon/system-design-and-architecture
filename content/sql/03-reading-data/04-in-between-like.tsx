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
  DateRangeLab,
  PatternMatchLab,
} from "../../../components/course/topics/reading-data/match-animations";
import {
  BetweenRangeDiagram,
  InListDiagram,
  PatternAnatomyDiagram,
  TimestampTrapDiagram,
} from "../../../components/course/topics/reading-data/match-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em]";

export const inBetweenLikeContent: TopicData = {
  id: "in-between-like",
  introduction: {
    badge: "MODULE 03 · LESSON 04",
    title: <SectionTitle>তালিকা, সীমা আর ছাঁচ: IN, BETWEEN, LIKE</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Support Desk এ সকালবেলা সাদিয়ার টেবিলে তিনটা অনুরোধ জমা
          পড়ল। Accounts চাইছে যেসব Booking এখনো pending বা cancelled, তাদের তালিকা।
          Operations জানতে চাইছে নভেম্বরে কোন কোন তারিখে ট্যুর ছাড়ছে। আর একজন
          Customer ফোন করে নিজের Booking এর খোঁজ চাইছেন, কিন্তু লাইন এত খারাপ যে
          সাদিয়া তাঁর নামের শুধু শুরুটা শুনতে পেলেন: Sa।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনে শেখা =, &lt;, &gt;, AND আর OR দিয়ে প্রথম দুটো লেখা যায়, তবে
          লম্বা আর ভুল হওয়ার মতো করে। তৃতীয়টা একদমই লেখা যায় না, কারণ = শুধু পুরো
          মানের সাথে হুবহু মেলায়, নামের একটা অংশ দিয়ে খুঁজতে পারে না। এই লেসনে আপনি
          তিনটা নতুন হাতিয়ার পাবেন: একটা তালিকার সাথে মেলানোর জন্য IN, একটা সীমার
          ভেতরে খোঁজার জন্য BETWEEN, আর লেখার একটা ছাঁচ দিয়ে খোঁজার জন্য LIKE। সাথে
          পাবেন তিনটার তিনটা ফাঁদ, যেগুলো বাস্তবে চুপচাপ ভুল উত্তর দেয়, Error দেয় না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দারোয়ানের হাতে অতিথিদের তালিকা থাকলে তাঁকে প্রত্যেক অতিথির জন্য আলাদা করে ফোন করতে হয় না। তিনি শুধু দেখেন নামটা তালিকায় আছে কিনা। IN ঠিক এই তালিকাটা।",
      author: "IN, BETWEEN, LIKE",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একই প্রশ্ন, তিনবার OR</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাদিয়ার প্রথম অনুরোধটা আগের লেসনের জ্ঞান দিয়েই লেখা যায়। status
                pending হলে চলবে, cancelled হলেও চলবে। দুটো শর্ত, মাঝখানে OR:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "with-or.sql",
          code: `SELECT booking_id, status, total_bdt
FROM bookings
WHERE status = 'pending'
   OR status = 'cancelled';`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটা কাজ করে। কিন্তু ভাবুন, Accounts কাল বলল আরও তিনটা status যোগ করতে।
                তখন পাঁচটা = আর চারটা OR। প্রতিবার Column এর নাম আবার লিখতে হবে, আর
                মাঝখানে কোথাও একটা AND ঢুকে গেলে পুরো শর্তের মানে বদলে যাবে, যেটা আগের
                লেসনে দেখেছেন। দ্বিতীয় অনুরোধটাও একই রকম: নভেম্বরের তারিখ মানে
                starts_on &gt;= &apos;2026-11-01&apos; AND starts_on &lt;=
                &apos;2026-11-30&apos;। একই Column দুইবার, আর কোন দিকে = বসবে সেটা মনে
                রাখার ঝামেলা।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় অনুরোধে = পুরোপুরি অসহায়। full_name = &apos;Sa&apos; লিখলে
                PostgreSQL এমন একজন Customer খুঁজবে যাঁর পুরো নামটাই শুধু Sa, যেটা
                কারো নেই। নামের শুরু, শেষ বা মাঝখানের একটা টুকরো দিয়ে খুঁজতে হলে একটা
                আলাদা ধরনের তুলনা লাগে, যেটা পুরো মান না, একটা ছাঁচ মেলায়।
              </ContentParagraph>
              <ContentParagraph>
                SQL এই তিনটা খুব সাধারণ প্রয়োজনের জন্য তিনটা আলাদা শব্দ রেখেছে। IN
                মানে একটা তালিকার যেকোনো একটার সাথে মিলুক। BETWEEN মানে দুটো সীমার
                মাঝখানে পড়ুক। LIKE মানে একটা ছাঁচের সাথে মিলুক, যার কিছু জায়গা খালি,
                যেকোনো অক্ষর বসতে পারে। তিনটাই WHERE এর ভেতরে বসে, আর প্রতিটা Row এর
                জন্য একটা হ্যাঁ বা না দেয়, ঠিক আগের লেসনের = এর মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নতুন কিছু না, ছোট করে লেখা",
          content: (
            <ContentParagraph>
              IN আর BETWEEN আসলে নতুন কোনো ক্ষমতা আনে না। IN হলো কয়েকটা = আর OR এর
              সংক্ষেপ, BETWEEN হলো একটা &gt;= আর একটা &lt;= এর সংক্ষেপ। Database ভেতরে
              ঠিক সেভাবেই হিসাব করে। তবু এগুলো জরুরি, কারণ ছোট লেখা মানে কম ভুল, আর
              পড়তে গেলে উদ্দেশ্যটা এক নজরে বোঝা যায়। LIKE আলাদা: সেটা এমন একটা কাজ
              করে যা = দিয়ে কোনোভাবেই করা যায় না। আগের লেসনের{" "}
              <Link href="/sql/topic/where-filters" className={LINK}>
                WHERE, AND, OR, NOT
              </Link>{" "}
              এর পুরো জ্ঞানটা এখানে লাগবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "in-list",
      subHeader: { index: "002", title: "IN" },
      title: <SectionTitle>দরজায় ঝোলানো একটা তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বিয়েবাড়ির দারোয়ানের কথা ভাবুন। তাঁর হাতে নিমন্ত্রিতদের একটা
                তালিকা। কেউ এলে তিনি শুধু দেখেন নামটা তালিকায় আছে কিনা। থাকলে ভেতরে,
                না থাকলে বাইরে। তালিকায় দশটা নাম থাকুক বা একশটা, নিয়ম একটাই। IN ঠিক
                এই দারোয়ান। Column এর পরে IN লিখে, বন্ধনীর ভেতরে কমা দিয়ে মানগুলো
                সাজিয়ে দেন। প্রতিটা Row এর ওই Column এর মান তালিকার কোনো একটার সাথে
                মিললেই Row টা ফলাফলে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InListDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সাদিয়ার প্রথম অনুরোধটা IN দিয়ে লিখুন। নিচের বক্সে তিনটা Statement:
              প্রথমটা আসল তালিকা, পরের দুটো গুনে দেখায় যে IN আর OR এর উত্তর হুবহু এক।
              Run চাপুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="IN দিয়ে pending আর cancelled"
              query={`SELECT booking_id, status, total_bdt
FROM bookings
WHERE status IN ('pending', 'cancelled')
ORDER BY booking_id;

SELECT count(*) AS with_in
FROM bookings
WHERE status IN ('pending', 'cancelled');

SELECT count(*) AS with_or
FROM bookings
WHERE status = 'pending' OR status = 'cancelled';`}
              caption="সাতটা Booking আসবে: তিনটা cancelled আর চারটা pending। নিচের দুই গোনাই সাত, কারণ IN এর ভেতরে Database ঠিক ওই OR গুলোই হিসাব করে। ORDER BY শুধু Row গুলো নম্বর অনুযায়ী সাজানোর জন্য, সেটা এই Module এর ষষ্ঠ লেসনে আসছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN লেখার কয়েকটা নিয়ম আছে, যেগুলো প্রথমবার ভুল হয়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেখা মান Single Quote এর ভেতরে, সংখ্যা Quote ছাড়া।</strong>{" "}
                  status IN (&apos;pending&apos;, &apos;cancelled&apos;) আর booking_id IN
                  (1, 5, 99)। Module 01 এর Lesson 05 এর নিয়মটাই এখানে খাটে।
                </ListItem>
                <ListItem>
                  <strong>তালিকার ক্রমের কোনো মানে নেই।</strong> (&apos;pending&apos;,
                  &apos;cancelled&apos;) আর (&apos;cancelled&apos;, &apos;pending&apos;)
                  একই ফল দেয়। ফলাফলের Row গুলো তালিকার ক্রমে সাজানো আসে না।
                </ListItem>
                <ListItem>
                  <strong>তালিকার কোনো মান Data তে না থাকলে কোনো Error হয় না।</strong>{" "}
                  সে শুধু কিছুই মেলায় না। নিচের বক্সে 99 নম্বর Booking নেই, তাই দুটো Row
                  আসে, তিনটা না।
                </ListItem>
                <ListItem>
                  <strong>তালিকার মান Column এর ধরনের সাথে মিলতে হয়।</strong> status
                  একটা লেখা, তাই status IN (1, 2) লিখলে PostgreSQL তুলনাই করতে পারে না
                  আর Error দেয়, যেটা নিচের দ্বিতীয় বক্সে দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="না থাকা মান আর ভুল ধরনের মান"
              query={`SELECT booking_id, status
FROM bookings
WHERE booking_id IN (1, 5, 99)
ORDER BY booking_id;

SELECT booking_id
FROM bookings
WHERE status IN (1, 2);`}
              caption="প্রথম Statement দুটো Row আনে, 1 আর 5। 99 নম্বর Booking নেই, তাই চুপচাপ বাদ। দ্বিতীয়টা থামে ERROR: operator does not exist: text = integer দিয়ে। লেখার সাথে সংখ্যা তুলনা করার কোনো নিয়ম PostgreSQL জানে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              task={
                <>
                  যেসব Customer Sylhet, Khulna অথবা Barishal শহরে থাকেন, তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>city</code> দেখান, নাম অনুযায়ী বর্ণক্রমে
                  সাজিয়ে। একটাও OR লিখবেন না।
                </>
              }
              hint={
                <>
                  শহরের তিনটা নাম এক বন্ধনীতে, প্রতিটা Single Quote এ:{" "}
                  <code className={CODE}>WHERE city IN (...)</code>। শেষে{" "}
                  <code className={CODE}>ORDER BY full_name</code>।
                </>
              }
              solution={`SELECT full_name, city
FROM customers
WHERE city IN ('Sylhet', 'Khulna', 'Barishal')
ORDER BY full_name;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              IN আর NOT IN MySQL এ হুবহু একই। এই লেসনের প্রতিটা IN এর উদাহরণ MySQL
              8.4 এ island-tours.mysql.sql Load করে চালিয়ে একই সংখ্যা পাওয়া গেছে।
              পার্থক্য আসে LIKE এ, সেটা নবম অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "not-in",
      subHeader: { index: "003", title: "NOT IN" },
      title: <SectionTitle>তালিকার বাইরে সবাই, প্রায় সবাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN এর উল্টোটা NOT IN: তালিকার কোনোটার সাথে না মিললে Row আসবে। ধরুন
                Operations জানতে চায় কোন কোন ট্যুর Jamal Hossain (guide_id 1) বা Shirin
                Akter (guide_id 2) ছাড়া অন্য কেউ নিয়ে যান। সোজা উত্তর: guide_id NOT IN
                (1, 2)।
              </ContentParagraph>
              <ContentParagraph>
                এখানেই প্রথম ফাঁদ। মোট ট্যুর নয়টা। যাঁদের Guide 1 বা 2, তাঁরা চারটা
                ট্যুর নিয়ে যান। তাহলে বাকি থাকার কথা পাঁচটা। নিচের বক্স চালিয়ে গুনে
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার আর চার, নয় হলো না"
              query={`SELECT title, guide_id
FROM tours
WHERE guide_id NOT IN (1, 2)
ORDER BY tour_id;

SELECT count(*) AS in_1_2
FROM tours
WHERE guide_id IN (1, 2);

SELECT count(*) AS all_tours
FROM tours;`}
              caption="NOT IN চারটা ট্যুর আনে, IN আনে আরও চারটা, অথচ মোট নয়টা। একটা ট্যুর দুই দলের কোনোটাতেই নেই: Ratargul Swamp Boat Day, যার guide_id খালি, মানে NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Ratargul Swamp Boat Day এর এখনো কোনো Guide ঠিক হয়নি, তাই তার guide_id
                এর ঘরে কোনো মান নেই। SQL এর ভাষায় সেটা NULL, মানে অজানা। এখন PostgreSQL
                কে জিজ্ঞেস করা হচ্ছে: এই অজানা Guide কি 1 বা 2? উত্তর হ্যাঁ ও না, না
                ও না। উত্তর হলো জানি না। আর তার উল্টো, অজানা Guide কি 1 বা 2 ছাড়া অন্য
                কেউ? সেটাও জানি না। WHERE শুধু সেই Row রাখে যার উত্তর পরিষ্কার হ্যাঁ।
                জানি না মানে বাদ। তাই Ratargul দুই দিক থেকেই বাদ পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                NULL এর পুরো গল্প পরের লেসনের, সেখানে দেখবেন কেন অজানার সাথে যেকোনো
                তুলনার উত্তরও অজানা। আপাতত মনে রাখুন: NOT IN দিয়ে বাদ দিলে, যাদের ঘর
                খালি, তারা চুপচাপ উধাও হয়ে যায়। Report এর সংখ্যা মেলাতে গিয়ে একটা Row
                কম পড়লে প্রথমে এটাই সন্দেহ করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "তালিকার ভেতরে NULL থাকলে আরও ভয়ংকর",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                উল্টো দিক থেকেও একই সমস্যা হয়। তালিকার ভেতরে একটা NULL থাকলে NOT IN
                একটা Row ও ফেরত দেয় না। guide_id NOT IN (1, NULL) চালালে নয়টা ট্যুরের
                একটাও আসে না, কারণ প্রতিটা ট্যুরের জন্য প্রশ্ন দাঁড়ায় এই Guide কি 1
                না, আর অজানা কোনো একজনও না? দ্বিতীয় অংশের উত্তর সবসময় জানি না।
              </ContentParagraph>
              <ContentParagraph>
                হাতে লেখা তালিকায় কেউ NULL লেখে না। কিন্তু Module 07 এ যখন তালিকাটা
                আরেকটা Query থেকে আসবে, তখন সেখানে NULL ঢুকে পড়া খুব সাধারণ। সেই
                লেসনে,{" "}
                <Link href="/sql/topic/in-exists-any-all" className={LINK}>
                  IN, EXISTS, ANY and ALL
                </Link>
                , এর নিরাপদ বিকল্প NOT EXISTS শিখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  বাংলাদেশের বাইরের Customer দের{" "}
                  <code className={CODE}>customer_id</code>,{" "}
                  <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>country</code> দেখান। এবার NOT IN ব্যবহার
                  করুন। এই Column এ কোনো NULL নেই, তাই ফাঁদের ভয় নেই।
                </>
              }
              hint={
                <>
                  তালিকায় একটাই মান থাকলেও বন্ধনী লাগে:{" "}
                  <code className={CODE}>WHERE country NOT IN (&apos;Bangladesh&apos;)</code>।
                </>
              }
              solution={`SELECT customer_id, full_name, country
FROM customers
WHERE country NOT IN ('Bangladesh');`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "between",
      subHeader: { index: "004", title: "BETWEEN" },
      title: <SectionTitle>দুই সীমার মাঝখানে, সীমা দুটোও ভেতরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাজারে কেউ যদি বলেন আট থেকে সাড়ে বারো হাজারের মধ্যে একটা ট্যুর চাই,
                তিনি আট হাজার পাঁচশ টাকার ট্যুরটাও দেখতে চান, সাড়ে বারো হাজারেরটাও।
                সীমার মান দুটো তাঁর বাজেটের ভেতরে। BETWEEN ঠিক এভাবে ভাবে: x BETWEEN a
                AND b মানে x &gt;= a AND x &lt;= b। দুই মাথাই ভেতরে। ইংরেজিতে একে বলে
                Inclusive।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BetweenRangeDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের বক্সে চারটা Statement। প্রথমটা আসল প্রশ্ন। দ্বিতীয়টায় সীমা দুটো
              উল্টো করে লেখা, তৃতীয়টায় সেই উল্টো সীমার সাথে একটা বাড়তি শব্দ
              SYMMETRIC, আর চতুর্থটা NOT BETWEEN, মানে সীমার বাইরে। চালিয়ে চারটা
              সংখ্যা মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="BETWEEN, উল্টো সীমা, SYMMETRIC আর NOT BETWEEN"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt BETWEEN 8500 AND 12500
ORDER BY price_bdt;

SELECT count(*) AS reversed
FROM tours
WHERE price_bdt BETWEEN 12500 AND 8500;

SELECT count(*) AS symmetric
FROM tours
WHERE price_bdt BETWEEN SYMMETRIC 12500 AND 8500;

SELECT title, price_bdt
FROM tours
WHERE price_bdt NOT BETWEEN 8500 AND 12500
ORDER BY price_bdt;`}
              caption="প্রথমটা তিনটা ট্যুর আনে, দুই মাথার 8500 আর 12500 সহ। উল্টো সীমায় শূন্য, কারণ কোনো দাম একই সাথে 12500 এর বেশি আর 8500 এর কম হতে পারে না। SYMMETRIC নিজে থেকে ছোটটা আগে বসিয়ে নেয়, তাই আবার তিনটা। NOT BETWEEN আনে বাকি ছয়টা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উল্টো সীমার ব্যাপারটা খুব গুরুত্বপূর্ণ, কারণ PostgreSQL এখানে কোনো
                Error দেয় না। শুধু শূন্য Row দেয়, আর শূন্য Row দেখে মনে হতে পারে এমন
                কোনো ট্যুর আসলেই নেই। BETWEEN এর পরে সবসময় ছোট মানটা আগে, বড়টা পরে।
                SYMMETRIC এই ভুলের হাত থেকে বাঁচায়, তবে সেটা MySQL এ নেই, MySQL 8.4 এ
                চালালে Syntax Error আসে। তাই সবচেয়ে নিরাপদ অভ্যাস হলো সীমা ঠিক ক্রমে
                লেখা।
              </ContentParagraph>
              <ContentParagraph>
                BETWEEN তারিখের Column এও চলে। starts_on একটা date, মানে এতে শুধু দিন
                আছে, সময় নেই। তাই নভেম্বরের সব Departure খোঁজা একদম সোজা, সাদিয়ার
                দ্বিতীয় অনুরোধের উত্তর:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নভেম্বরের Departure"
              query={`SELECT departure_id, tour_id, starts_on
FROM departures
WHERE starts_on BETWEEN '2026-11-01' AND '2026-11-30'
ORDER BY starts_on;`}
              caption="চারটা Departure: ১৪, ২০, ২১ আর ২৭ নভেম্বর। তারিখ লেখা হয় 'বছর-মাস-দিন' ধরনে, Quote এর ভেতরে। date Column এ সময় নেই, তাই ৩০ নভেম্বর লিখলে পুরো ৩০ তারিখটাই ভেতরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              লেখার Column এও BETWEEN চলে, বর্ণক্রম ধরে। city BETWEEN &apos;B&apos; AND
              &apos;D&apos; চালালে Barishal আর Chattogram আসে। কিন্তু খেয়াল করুন, D দিয়ে
              শুরু Dhaka আসে না, কারণ বর্ণক্রমে Dhaka শব্দটা একা D অক্ষরের পরে বসে। আর
              বর্ণক্রম কীভাবে সাজবে সেটা Database এর Collation ঠিক করে, যেটা Module 09
              এ আসবে। তাই লেখার জন্য BETWEEN এড়িয়ে চলাই ভালো, এর জন্য LIKE আর IN অনেক
              পরিষ্কার।
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
                  যেসব ট্যুর দুই থেকে তিন দিনের, দুই আর তিন দিন সহ, তাদের{" "}
                  <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>duration_days</code> দেখান। ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>duration_days BETWEEN 2 AND 3</code>। ছোট মানটা
                  আগে।
                </>
              }
              solution={`SELECT title, duration_days
FROM tours
WHERE duration_days BETWEEN 2 AND 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "timestamp-trap",
      subHeader: { index: "005", title: "The Timestamp Trap" },
      title: <SectionTitle>শেষ দিনটা কোথায় গেল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Accounts জানতে চাইল, ১ থেকে ১৪ অক্টোবরের মধ্যে কতগুলো Booking
                হয়েছে। সাদিয়া সদ্য শেখা BETWEEN দিয়ে লিখলেন booked_at BETWEEN
                &apos;2026-10-01&apos; AND &apos;2026-10-14&apos;। উত্তর এল আট। পরে
                Accounts নিজের খাতা মিলিয়ে বলল, আসলে নয়টা। একটা Booking কোথায় গেল?
              </ContentParagraph>
              <ContentParagraph>
                পার্থক্যটা Column এর ধরনে। starts_on শুধু দিন রাখে, কিন্তু booked_at
                রাখে একটা পুরো মুহূর্ত: দিন, ঘণ্টা, মিনিট, সেকেন্ড, আর সময় অঞ্চল। এর
                ধরন timestamptz। এমন Column এর সাথে শুধু &apos;2026-10-14&apos; তুলনা করলে
                PostgreSQL সেটাকে পড়ে ১৪ অক্টোবরের একদম শুরুর মুহূর্ত, রাত বারোটা।
                তাই BETWEEN এর জানালা ১৪ তারিখ শুরু হতেই বন্ধ হয়ে যায়। ১৪ তারিখ সকাল
                ১১টা ৫ মিনিটের Booking #24 সেই জানালার বাইরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TimestampTrapDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আট না নয়"
              query={`SELECT count(*) AS with_between
FROM bookings
WHERE booked_at BETWEEN '2026-10-01' AND '2026-10-14';

SELECT count(*) AS half_open
FROM bookings
WHERE booked_at >= '2026-10-01'
  AND booked_at <  '2026-10-15';

SELECT booking_id, booked_at
FROM bookings
WHERE booked_at >= '2026-10-14'
  AND booked_at <  '2026-10-15';

SELECT timestamptz '2026-10-14' AS what_the_bound_means;`}
              caption="BETWEEN দেয় ৮, দ্বিতীয় শর্ত দেয় ৯। তৃতীয় Statement হারানো Booking টা দেখায়: #24, 2026-10-14 11:05:00+06। শেষ লাইন প্রমাণ দেয় যে শুধু তারিখ লিখলে সেটা হয় 2026-10-14 00:00:00+06। এই বক্সের সময় অঞ্চল Asia/Dhaka, তাই +06।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঠিক উপায়টা দ্বিতীয় Statement এ। শুরুর সীমা &gt;= দিয়ে, মানে শুরুটা সহ।
                শেষের সীমা &lt; দিয়ে, মানে শেষটা বাদ, আর শেষটা হিসেবে লিখুন পরের দিনের
                শুরু, ১৫ তারিখ। এভাবে পুরো ১৪ তারিখ ভেতরে চলে আসে, শেষ সেকেন্ডের
                শেষ ভগ্নাংশ পর্যন্ত। এই ধরনের সীমাকে বলে Half-open Interval: এক মাথা
                খোলা, এক মাথা বন্ধ। সময়ের Column এ সবসময় এভাবে লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                কেউ কেউ বলেন, তাহলে BETWEEN &apos;2026-10-01&apos; AND &apos;2026-10-14
                23:59:59&apos; লিখলেই তো হয়। এই Data তে ফল ঠিক আসবে, কিন্তু
                timestamptz সেকেন্ডের ভগ্নাংশও রাখে, তাই 23:59:59.5 এ ঘটা কিছু বাদ পড়ে
                যাবে। আর প্রতিবার মাসের শেষ দিনটা ২৮, ৩০ না ৩১, সেটাও হিসাব করতে হবে।
                Half-open এ সেই ঝামেলাই নেই: পরের মাসের ১ তারিখ সবসময় একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DateRangeLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সময় অঞ্চলও সীমার অংশ",
          content: (
            <ContentParagraph>
              &apos;2026-10-14&apos; মানে কোন শহরের রাত বারোটা? আপনার Connection এর
              TimeZone Setting এর। এই Page এর বক্সগুলো Asia/Dhaka তে চলে। নিজের psql
              এ Docker এর ভেতরের PostgreSQL এ চালালে Default প্রায়ই UTC, তখন সীমা সরে
              যায় ছয় ঘণ্টা, আর গোনা বদলে যেতে পারে। তাই এই লেসনের Lab এর শুরুতে SET
              TimeZone = &apos;Asia/Dhaka&apos; লেখা আছে। সময় অঞ্চলের পুরো হিসাব Module
              04 এর{" "}
              <Link href="/sql/topic/date-time-functions" className={LINK}>
                Dates, Times and Time Zones
              </Link>{" "}
              লেসনে।
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
                  ১৪ অক্টোবর 2026 তারিখে, ঢাকার সময়ে, যত Booking হয়েছে তাদের{" "}
                  <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>booked_at</code> দেখান। আগে{" "}
                  <code className={CODE}>booked_at = &apos;2026-10-14&apos;</code> লিখে
                  Check চেপে দেখুন কী হয়।
                </>
              }
              hint={
                <>
                  একটা পুরো দিন মানে সেই দিনের শুরু থেকে পরের দিনের শুরুর ঠিক আগ পর্যন্ত:{" "}
                  <code className={CODE}>&gt;= &apos;2026-10-14&apos; AND &lt; &apos;2026-10-15&apos;</code>।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
WHERE booked_at >= '2026-10-14'
  AND booked_at <  '2026-10-15';`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL এর নমুনা ফাইলে booked_at একটা DATETIME, যেটা ঢাকার ঘড়ির সময় রাখে
              কোনো অঞ্চল ছাড়া। কিন্তু ফাঁদটা একই: MySQL 8.4 এ BETWEEN
              &apos;2026-10-01&apos; AND &apos;2026-10-14&apos; দেয় ৮, আর Half-open শর্ত
              দেয় ৯। নিয়মটাও তাই একই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "like",
      subHeader: { index: "006", title: "LIKE" },
      title: <SectionTitle>পুরো নাম না জানলেও খোঁজা যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছোটবেলায় শব্দজটের খেলা খেলেছেন হয়তো: S দিয়ে শুরু, পাঁচ অক্ষরের একটা
                শহর। কিছু অক্ষর জানা, কিছু ফাঁকা। LIKE ঠিক এরকম একটা ছাঁচ দিয়ে খোঁজে,
                যাকে বলে Pattern। Pattern এ দুটো বিশেষ চিহ্ন আছে, যাদের বলে Wildcard:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>% মানে যত খুশি অক্ষর।</strong> শূন্যটা, একটা, একশটা, সব চলে।
                  &apos;Saint%&apos; মানে Saint দিয়ে শুরু, তারপর যা খুশি।
                </ListItem>
                <ListItem>
                  <strong>_ মানে ঠিক একটা অক্ষর।</strong> কম না, বেশি না, যেকোনো একটা।
                  এটা পরের অংশে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                % কোথায় বসাচ্ছেন, তার উপর মানে বদলায়। &apos;Saint%&apos; মানে শুরুটা
                Saint। &apos;%Trip&apos; মানে শেষটা Trip। &apos;%Bazar%&apos; মানে
                কোথাও না কোথাও Bazar, শুরুতে, মাঝে বা শেষে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PatternAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শুরু, শেষ, মাঝখান"
              query={`SELECT title FROM tours WHERE title LIKE 'Saint%';

SELECT title FROM tours WHERE title LIKE '%Trip';

SELECT title FROM tours WHERE title LIKE '%Bazar%';

SELECT title FROM tours WHERE title LIKE 'Saint';`}
              caption="Saint দিয়ে শুরু দুটো, Trip দিয়ে শেষ একটা, ভেতরে Bazar আছে এমন দুটো। শেষ Statement শূন্য Row দেয়: % ছাড়া 'Saint' মানে পুরো নামটাই শুধু Saint, যেমন কোনো ট্যুর নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ Statement টা থেকে LIKE এর সবচেয়ে গুরুত্বপূর্ণ নিয়মটা বোঝা যায়:
                Pattern কে পুরো লেখাটা ঢাকতে হয়, শুরু থেকে শেষ পর্যন্ত। লেখার কোথাও
                Saint আছে কিনা, এটা LIKE নিজে থেকে দেখে না। আপনি যতটুকু খোলা রাখবেন,
                শুধু ততটুকুই খোলা। তাই কোনো Wildcard ছাড়া LIKE আর = হুবহু একই কাজ
                করে, PostgreSQL এর Docs ও তাই বলে।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো ভুলটাও খুব হয়: = এর সাথে % লেখা। title = &apos;Saint%&apos;
                লিখলে PostgreSQL খুঁজবে এমন ট্যুর যার নাম হুবহু S, a, i, n, t আর একটা
                % চিহ্ন। শূন্য Row। % আর _ এর বিশেষ মানে শুধু LIKE এর ভেতরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              task={
                <>
                  যেসব Customer এর Email s অক্ষর দিয়ে শুরু, তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>email</code> দেখান, নাম অনুযায়ী সাজিয়ে।
                  সাদিয়ার Customer এদের মধ্যেই কেউ।
                </>
              }
              hint={
                <>
                  শুরুটা জানা, বাকিটা যা খুশি:{" "}
                  <code className={CODE}>WHERE email LIKE &apos;s%&apos;</code>। সব Email ছোট
                  হাতের অক্ষরে লেখা।
                </>
              }
              solution={`SELECT full_name, email
FROM customers
WHERE email LIKE 's%'
ORDER BY full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "underscore",
      subHeader: { index: "007", title: "The Underscore" },
      title: <SectionTitle>ঠিক একটা অক্ষর, কম না বেশি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                _ চিহ্নটা % এর ছোট ভাই। % যেখানে যত খুশি অক্ষর ঢাকে, _ ঢাকে ঠিক একটা।
                তাই _ দিয়ে লেখার দৈর্ঘ্য বা নির্দিষ্ট অবস্থান ধরে খোঁজা যায়।
                &apos;_a%&apos; মানে প্রথম অক্ষর যেকোনো, দ্বিতীয়টা a, তারপর যা খুশি।
                &apos;____ %&apos; মানে চারটা অক্ষর, তারপর একটা ফাঁকা জায়গা, তারপর যা
                খুশি, মানে নামের প্রথম অংশ ঠিক চার অক্ষরের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অবস্থান আর দৈর্ঘ্য ধরে খোঁজা"
              query={`SELECT full_name
FROM customers
WHERE full_name LIKE '_a%'
ORDER BY full_name;

SELECT full_name
FROM customers
WHERE full_name LIKE '____ %'
ORDER BY full_name;`}
              caption="দ্বিতীয় অক্ষর a, এমন ছয়জন: Farhana, Kamal, Lamia, Rahim, Sabbir আর Tanvir। নামের প্রথম অংশ ঠিক চার অক্ষর, এমন দুজন: Arif আর Mitu।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিচের Lab এ নিজে হাত লাগান। দুটো আসল Column আছে: নয়টা ট্যুরের নাম
              আর সাতটা Destination এর ধরন। আগে থেকে রাখা Pattern গুলো চেপে দেখুন,
              তারপর নিজে লিখে দেখুন। ডান দিকে প্রতিটা Row এর পাশে সাথে সাথে দেখবেন মিলল
              কিনা। তৃতীয় সারির বোতামগুলো পরের দুই অংশের বিষয়, একটু পরে আবার ফিরে আসবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PatternMatchLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "escaping",
      subHeader: { index: "008", title: "Escaping" },
      title: <SectionTitle>Data তেই যখন % বা _ থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা মজার সমস্যা। destinations এর kind Column এ একটা মান আছে
                tea_garden, যার মাঝখানে একটা আসল Underscore। ধরুন আপনি খুঁজতে চান কোন
                ধরনের নামে Underscore আছে। স্বাভাবিকভাবে লিখবেন kind LIKE
                &apos;%_%&apos;। কিন্তু Pattern এর ভেতরে _ তো বিশেষ চিহ্ন, মানে যেকোনো
                একটা অক্ষর। তাই এই Pattern এর মানে দাঁড়ায় অন্তত একটা অক্ষর আছে, যেটা
                সাতটা ধরনের সবগুলোর জন্যই সত্যি।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো চিহ্নটার বিশেষ ক্ষমতা কেড়ে নেওয়া, যাকে বলে Escape করা।
                PostgreSQL এ LIKE এর Default Escape চিহ্ন Backslash। _ এর আগে একটা \
                বসালে \_ মানে আর যেকোনো অক্ষর না, একটা সত্যিকারের Underscore। % এর
                জন্যও একই: \% মানে আসল একটা Percent চিহ্ন। Backslash পছন্দ না হলে ESCAPE
                দিয়ে নিজের চিহ্ন ঠিক করে দেওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যেকোনো অক্ষর বনাম আসল Underscore"
              query={`SELECT count(*) AS any_char
FROM destinations
WHERE kind LIKE '%_%';

SELECT name, kind
FROM destinations
WHERE kind LIKE '%\\_%';

SELECT name, kind
FROM destinations
WHERE kind LIKE '%!_%' ESCAPE '!';`}
              caption="প্রথমটা সাতটাই গোনে। দ্বিতীয়টায় \_ মানে আসল Underscore, তাই শুধু Sylhet এর tea_garden। তৃতীয়টা একই কাজ করে, শুধু Escape চিহ্ন হিসেবে ! ব্যবহার করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটা কাল্পনিক সমস্যা না। বাস্তবে এমন অনেক Data আছে যাতে % বা _ থাকে:
                ছাড়ের বিবরণে 20%, Username এ rahim_99, ফাইলের নামে tour_photo_01।
                সবচেয়ে বড় বিপদ আসে Search Box থেকে। একজন ইউজার যদি Search এ tea_ লেখেন,
                আর App সেটা সরাসরি LIKE এর ভেতরে বসিয়ে দেয়, তাহলে _ টা Wildcard হয়ে
                যায়, আর ইউজার এমন ফলও পান যা তিনি চাননি। তাই App থেকে LIKE এ ইউজারের
                লেখা বসানোর আগে তার % আর _ Escape করে নিতে হয়। এই লেসনের Project
                Example এ সেটা আবার আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Backslash নিয়ে একটা ছোট কথা",
          content: (
            <ContentParagraph>
              PostgreSQL এ standard_conforming_strings নামের Setting টা চালু থাকে, তাই
              সাধারণ Quote এর ভেতরে \ একটা সাধারণ অক্ষর, LIKE এর কাছে পৌঁছায় হুবহু।
              MySQL এর নিয়ম আলাদা, সেখানে লেখার ভেতরেও \ এর বিশেষ মানে আছে। তবু
              MySQL এর Docs অনুযায়ী \_ আর \% LIKE এর ভেতরে আসল _ আর % বোঝায়, আর MySQL
              8.4 এ kind LIKE &apos;%\_%&apos; চালিয়েও শুধু tea_garden ই এসেছে। আর ESCAPE
              &apos;!&apos; দুই Database এই একইভাবে চলে, তাই দুই জায়গায় চলবে এমন Query
              লিখতে চাইলে সেটাই নিরাপদ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  যেসব Destination এর <code className={CODE}>kind</code> এর ভেতরে একটা
                  আসল Underscore আছে, তাদের <code className={CODE}>name</code> আর{" "}
                  <code className={CODE}>kind</code> দেখান। প্রথমে Escape ছাড়া লিখে
                  Check চেপে দেখুন কী বলে।
                </>
              }
              hint={
                <>
                  Pattern এর ভেতরে _ এর আগে একটা Backslash:{" "}
                  <code className={CODE}>&apos;%\_%&apos;</code>, অথবা{" "}
                  <code className={CODE}>&apos;%!_%&apos; ESCAPE &apos;!&apos;</code>।
                </>
              }
              solution={`SELECT name, kind
FROM destinations
WHERE kind LIKE '%\\_%';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "case-and-ilike",
      subHeader: { index: "009", title: "Case and ILIKE" },
      title: <SectionTitle>Bazar আর bazar এক না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL এর LIKE বড় হাতের আর ছোট হাতের অক্ষরকে আলাদা ধরে। ট্যুরের নামে
                লেখা Bazar, বড় হাতের B দিয়ে। তাই title LIKE &apos;%bazar%&apos; একটা
                Row ও আনে না। Search Box এ ইউজার কোন হাতে লিখবেন, আপনি জানেন না, তাই এটা
                বাস্তবে বড় সমস্যা।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর উত্তর ILIKE, মানে Insensitive LIKE। সব নিয়ম LIKE এর মতো,
                শুধু বড় ছোট অক্ষর এক ধরে। ILIKE SQL Standard এর অংশ না, PostgreSQL এর
                নিজস্ব বাড়তি সুবিধা, PostgreSQL এর Docs এ এটা স্পষ্ট লেখা। তাই যেখানে
                অন্য Database এও চলতে হবে, সেখানে আরেকটা উপায় আছে: দুই দিককেই ছোট হাতে
                এনে LIKE। lower() নামের Function টা লেখাকে ছোট হাতে বদলায়, সেটা Module
                04 এ বিস্তারিত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LIKE, ILIKE আর lower()"
              query={`SELECT title FROM tours WHERE title LIKE '%bazar%';

SELECT title FROM tours WHERE title ILIKE '%bazar%';

SELECT title FROM tours WHERE lower(title) LIKE '%bazar%';`}
              caption="LIKE শূন্য, ILIKE দুটো, আর lower() দিয়ে LIKE ও দুটো। শেষ দুটোর ফল এক, কিন্তু শেষটা প্রায় যেকোনো Database এ চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ গল্পটা উল্টো, আর MySQL এর ভিডিও দেখে যাঁরা শিখছেন তাঁদের জন্য এটা
                খুব জরুরি। MySQL 8.4 এর Default Collation হলো utf8mb4_0900_ai_ci।
                নামের শেষের ci মানে Case Insensitive। তাই MySQL এ সাধারণ LIKE ই বড় ছোট
                অক্ষর এক ধরে, title LIKE &apos;%bazar%&apos; দুটো Row আনে। ভিডিওতে যে
                Query চলে, PostgreSQL এ সেটা হঠাৎ কম Row দিলে প্রথমে এটাই সন্দেহ করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "PostgreSQL", "MySQL 8.4 (Default)"],
          rows: [
            ["title LIKE '%bazar%'", "০ Row, বড় ছোট অক্ষর আলাদা", "২ Row, বড় ছোট অক্ষর এক"],
            ["title ILIKE '%bazar%'", "২ Row", "Syntax Error, ILIKE নেই"],
            ["বড় ছোট আলাদা চাইলে", "সাধারণ LIKE", "title COLLATE utf8mb4_bin LIKE '%bazar%', ০ Row"],
            ["দুই জায়গায় একই ফল", "lower(title) LIKE '%bazar%'", "lower(title) LIKE '%bazar%'"],
            ["আসল _ খুঁজতে", "'%\\_%' বা ESCAPE '!'", "'%\\_%' বা ESCAPE '!'"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টেবিলের প্রতিটা ঘর MySQL 8.4 এর একটা Container এ island-tours.mysql.sql
              Load করে চালিয়ে মেলানো। এখন একটু উপরে ফিরে Lab এর তৃতীয় সারির তিনটা বোতাম
              চেপে %bazar% দিয়ে পরীক্ষা করুন: LIKE এ শূন্য, ILIKE আর MySQL এ দুটো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "not-like-and-null",
      subHeader: { index: "010", title: "NOT LIKE and NULL" },
      title: <SectionTitle>দশ আর শূন্য, পনেরো হলো না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NOT LIKE এর মানে সোজা: ছাঁচের সাথে না মিললে Row আসবে। কিন্তু NOT IN এর
                মতো এখানেও NULL লুকিয়ে আছে। Customer দের ফোন নম্বর হয় +880 দিয়ে শুরু,
                নয়তো একদম খালি। নিচের বক্সে চারটা গোনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফোন নম্বরের হিসাব"
              query={`SELECT count(*) AS starts_880
FROM customers
WHERE phone LIKE '+880%';

SELECT count(*) AS not_880
FROM customers
WHERE phone NOT LIKE '+880%';

SELECT count(*) AS no_phone
FROM customers
WHERE phone IS NULL;

SELECT count(*) AS everyone
FROM customers;`}
              caption="LIKE দশ, NOT LIKE শূন্য, অথচ মোট পনেরো। বাকি পাঁচজনের phone খালি। খালি ঘরের সাথে LIKE এর উত্তর জানি না, NOT LIKE এর উত্তরও জানি না, তাই দুই দিক থেকেই বাদ। তাঁদের ধরতে লাগে IS NULL, যেটা পরের লেসনের বিষয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়মটা IN, BETWEEN আর LIKE তিনটার জন্যই এক: যে Row এর ওই Column খালি, সে
              ইতিবাচক শর্তেও আসে না, নেতিবাচক শর্তেও আসে না। কেউ যদি জিজ্ঞেস করেন কাদের
              ফোন +880 না, আর আপনি NOT LIKE দিয়ে শূন্য দেখান, উত্তরটা Database এর চোখে
              ঠিক, কিন্তু প্রশ্নকারীর চোখে ভুল। তিনি ফোন নেই এমন পাঁচজনকেও চাইছিলেন।
              এমন জায়গায় সবসময় নিজেকে জিজ্ঞেস করুন, খালি ঘরগুলো কোন দলে পড়বে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  যেসব Customer এর ফোন নম্বর +880 দিয়ে শুরু হয় না, যাঁদের ফোন নম্বরই নেই
                  তাঁদেরও ধরে, তাঁদের <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>phone</code> দেখান। এই প্রশ্নটা পরের লেসনের
                  একটু আগাম স্বাদ।
                </>
              }
              hint={
                <>
                  দুটো শর্ত OR দিয়ে:{" "}
                  <code className={CODE}>phone NOT LIKE &apos;+880%&apos; OR phone IS NULL</code>।
                  IS NULL মানে ঘরটা খালি কিনা।
                </>
              }
              solution={`SELECT full_name, phone
FROM customers
WHERE phone NOT LIKE '+880%'
   OR phone IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "speed-and-limits",
      subHeader: { index: "011", title: "Speed and Limits" },
      title: <SectionTitle>LIKE কোথায় থেমে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আমাদের Sample Database এ ট্যুর মাত্র নয়টা, তাই সব Query চোখের পলকে চলে।
                বাস্তবে একটা Table এ লাখ লাখ Row থাকে, আর তখন Pattern কোথা থেকে শুরু
                হচ্ছে সেটা গতির জন্য বড় ব্যাপার হয়ে দাঁড়ায়।
              </ContentParagraph>
              <ContentParagraph>
                অভিধানের কথা ভাবুন। Sa দিয়ে শুরু শব্দ খুঁজতে আপনি সোজা S এর পাতায় চলে
                যান, কারণ অভিধান বর্ণক্রমে সাজানো। কিন্তু যেসব শব্দের ভেতরে কোথাও ar
                আছে, সেগুলো খুঁজতে প্রথম পাতা থেকে শেষ পাতা পর্যন্ত পড়তে হয়। Database
                এর Index অনেকটা এই অভিধানের সাজানো ক্রমের মতো, Module 13 এ এর পুরো ভেতরটা
                দেখবেন। &apos;Saint%&apos; এর মতো শুরু জানা Pattern এ ঠিকভাবে বানানো Index
                কাজে লাগতে পারে। কিন্তু শুরুতে % থাকলে, যেমন &apos;%Bazar%&apos;, সাধারণ
                Index কোনো সাহায্য করতে পারে না, Database কে প্রতিটা Row পড়ে দেখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় সীমা হলো, LIKE আসল Search না। কেউ Sundorbon লিখলে LIKE
                Sundarbans খুঁজে পাবে না, বানান ভুলের ক্ষমা নেই। boat লিখলে boats পাবে না
                যদি Pattern শব্দের শেষে বন্ধ থাকে, আর কোন ফল বেশি প্রাসঙ্গিক সেটা সাজাতেও
                পারে না। এসবের জন্য PostgreSQL এ আলাদা ব্যবস্থা আছে: আরও জটিল Pattern এর
                জন্য Regular Expression, যেটা Module 04 এর{" "}
                <Link href="/sql/topic/regular-expressions" className={LINK}>
                  Regular Expressions
                </Link>{" "}
                লেসনে, আর সত্যিকারের Search এর জন্য Module 15 এর{" "}
                <Link href="/sql/topic/full-text-search" className={LINK}>
                  Full-text Search
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কখন কোনটা",
          content: (
            <ContentList>
              <ListItem>
                নির্দিষ্ট কয়েকটা জানা মানের যেকোনোটা: <strong>IN</strong>।
              </ListItem>
              <ListItem>
                সংখ্যা বা তারিখের একটা সীমা: <strong>BETWEEN</strong>, আর timestamp হলে{" "}
                <strong>&gt;= আর &lt;</strong>।
              </ListItem>
              <ListItem>
                লেখার শুরু, শেষ বা ভেতরের একটা টুকরো: <strong>LIKE</strong> বা{" "}
                <strong>ILIKE</strong>।
              </ListItem>
              <ListItem>
                বানান ভুল সহ, প্রাসঙ্গিকতা অনুযায়ী খোঁজা: LIKE না, Full-text Search।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "combining",
      subHeader: { index: "012", title: "Combining" },
      title: <SectionTitle>তিনটা একসাথে, বন্ধনী মনে রেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN, BETWEEN আর LIKE প্রতিটা একেকটা শর্ত, তাই আগের লেসনের AND, OR, NOT
                দিয়ে এদের যত খুশি জোড়া যায়। ধরুন Accounts চাইল সেপ্টেম্বর থেকে হওয়া
                এমন Booking, যাদের status confirmed বা pending, আর মোট দাম বিশ থেকে
                চল্লিশ হাজারের মধ্যে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন রকম শর্ত এক Query তে"
              query={`SELECT booking_id, status, seats, total_bdt
FROM bookings
WHERE status IN ('confirmed', 'pending')
  AND total_bdt BETWEEN 20000 AND 40000
  AND booked_at >= '2026-09-01'
ORDER BY booking_id;`}
              caption="পাঁচটা Booking: 13, 15, 16, 17 আর 19। সব শর্ত AND দিয়ে জোড়া, তাই প্রতিটা Row কে তিনটাই পার হতে হয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OR ঢুকলেই বন্ধনীর কথা মনে রাখুন। আগের লেসনে দেখেছেন, AND আগে খাটে, OR
                পরে। প্রশ্ন: Saint বা Cox দিয়ে শুরু, আর দাম দশ হাজারের কম, এমন ট্যুর।
                বন্ধনী ছাড়া লিখলে PostgreSQL পড়ে: Saint দিয়ে শুরু যেকোনো ট্যুর, অথবা Cox
                দিয়ে শুরু আর দশ হাজারের কম। তাই বত্রিশ হাজার টাকার Luxury Stay ও চলে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বন্ধনী ছাড়া আর বন্ধনী সহ"
              query={`SELECT title, price_bdt
FROM tours
WHERE title LIKE 'Saint%' OR title LIKE 'Cox%'
  AND price_bdt < 10000
ORDER BY tour_id;

SELECT title, price_bdt
FROM tours
WHERE (title LIKE 'Saint%' OR title LIKE 'Cox%')
  AND price_bdt < 10000
ORDER BY tour_id;`}
              caption="বন্ধনী ছাড়া তিনটা ট্যুর, তার দুটো দশ হাজারের বেশি। বন্ধনী সহ শুধু একটা: Cox's Bazar Beach Weekend, 8500। Error আসেনি, শুধু উত্তর ভুল, এটাই এই ভুলের ভয়।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "practice-set",
      subHeader: { index: "013", title: "Practice Set" },
      title: <SectionTitle>দুটো Challenge, সব একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার এই লেসনের সব হাতিয়ার একসাথে লাগবে। প্রশ্নগুলো Support Desk এ আসা
              অনুরোধের মতো করে লেখা। আগে নিজে চেষ্টা করুন, আটকে গেলে Hint দেখুন, আর
              Solution দেখার আগে অন্তত দুইবার Check চাপুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge 1"
              orderMatters
              task={
                <>
                  Operations জানতে চায় ট্যুর 1, 2 আর 5 এর কোন কোন Departure ১ নভেম্বর
                  2026 থেকে ৩১ জানুয়ারি 2027 এর মধ্যে, দুই দিন সহ। দেখান{" "}
                  <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>tour_id</code>,{" "}
                  <code className={CODE}>starts_on</code> আর{" "}
                  <code className={CODE}>seats_left</code>, তারিখ অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  ট্যুরের জন্য IN, তারিখের জন্য BETWEEN। starts_on একটা date, তাই এখানে
                  BETWEEN নিরাপদ। শেষে <code className={CODE}>ORDER BY starts_on</code>।
                </>
              }
              solution={`SELECT departure_id, tour_id, starts_on, seats_left
FROM departures
WHERE tour_id IN (1, 2, 5)
  AND starts_on BETWEEN '2026-11-01' AND '2027-01-31'
ORDER BY starts_on;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge 2"
              orderMatters
              task={
                <>
                  Accounts চায় ১ থেকে ১৪ অক্টোবর 2026 এর মধ্যে, দুই দিন সহ, ঢাকার সময়ে
                  হওয়া এমন Booking যাদের status pending অথবা cancelled, আর মোট দাম ১৫
                  থেকে ৩০ হাজারের মধ্যে। দেখান <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>status</code>,{" "}
                  <code className={CODE}>total_bdt</code> আর{" "}
                  <code className={CODE}>booked_at</code>, Booking এর সময় অনুযায়ী
                  সাজিয়ে। সাবধান, এখানে একটা ফাঁদ আছে।
                </>
              }
              hint={
                <>
                  booked_at একটা timestamptz। ১৪ তারিখ সহ মানে{" "}
                  <code className={CODE}>&lt; &apos;2026-10-15&apos;</code>, BETWEEN দিয়ে লিখলে
                  একটা Row হারাবেন।
                </>
              }
              solution={`SELECT booking_id, status, total_bdt, booked_at
FROM bookings
WHERE status IN ('pending', 'cancelled')
  AND total_bdt BETWEEN 15000 AND 30000
  AND booked_at >= '2026-10-01'
  AND booked_at <  '2026-10-15'
ORDER BY booked_at;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর তিনটা পর্দার পেছনে</SectionTitle>,
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
                এই লেসনের তিনটা হাতিয়ার Island Tours এর Admin Panel এ প্রতিদিন কাজ করে,
                শুধু চোখে পড়ে না। Staff এর পর্দায় তিনটা জিনিস আছে, আর প্রতিটার পেছনে
                এই লেসনের একটা করে শর্ত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Status এর Filter Chip।</strong> Booking তালিকার উপরে কয়েকটা
                  বোতাম: Pending, Confirmed, Cancelled। Staff দুটো বেছে নিলে App পাঠায়
                  status IN (&apos;pending&apos;, &apos;cancelled&apos;)। যতগুলো Chip চাপা,
                  তালিকায় ততগুলো মান।
                </ListItem>
                <ListItem>
                  <strong>তারিখের Range Picker।</strong> Staff ১ থেকে ১৪ অক্টোবর বাছলে
                  একটা ভালো App কখনো BETWEEN &apos;2026-10-01&apos; AND
                  &apos;2026-10-14&apos; পাঠায় না। সে শেষ তারিখের সাথে একদিন যোগ করে
                  পাঠায় booked_at &gt;= &apos;2026-10-01&apos; AND booked_at &lt;
                  &apos;2026-10-15&apos;। নইলে প্রতিটা Report এর শেষ দিনটা প্রায় খালি দেখাত।
                </ListItem>
                <ListItem>
                  <strong>Customer Search Box।</strong> সাদিয়া Search এ Sa লিখলে App
                  পাঠায় full_name ILIKE &apos;%Sa%&apos; এর মতো কিছু। কিন্তু App ইউজারের লেখা
                  কখনো সরাসরি SQL এর ভেতরে জোড়া দেয় না। সে লেখাটাকে Parameter হিসেবে
                  আলাদা পাঠায়, আর তার আগে % আর _ কে Escape করে নেয়, যাতে কেউ শুধু % লিখে
                  পুরো Customer তালিকা না দেখে ফেলে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ কথাটা Module 01 এর{" "}
                <Link href="/sql/topic/app-database-conversation" className={LINK}>
                  How an App Talks to a Database
                </Link>{" "}
                লেসনের Parameter এর গল্পের সাথে মিলে যায়। সেখানে দেখেছেন, $1 এর জায়গায়
                মান আলাদা যায়, তাই ইউজার Query এর কাঠামো বদলাতে পারে না। কিন্তু Parameter
                দিয়ে পাঠানো লেখার ভেতরের % এখনো LIKE এর কাছে Wildcard। তাই Search এর
                জন্য দুটো কাজই লাগে: Parameter, আর Wildcard Escape। এর পুরো নিরাপত্তার
                দিক Module 16 এর{" "}
                <Link href="/sql/topic/sql-injection" className={LINK}>
                  SQL Injection
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "customer-search.sql",
          code: `-- App থেকে যা যায়: Query এর কাঠামো স্থির, ইউজারের লেখা $1 এ আলাদা।
-- App লেখাটা পাঠানোর আগে \\, % আর _ এর আগে একটা করে \\ বসিয়ে নেয়।
SELECT customer_id, full_name, email
FROM customers
WHERE full_name ILIKE '%' || $1 || '%'
ORDER BY full_name
LIMIT 20;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              || চিহ্নটা PostgreSQL এ দুটো লেখা জোড়া দেয়, Module 04 এ এটা আসবে। $1
              এর জায়গায় bazar বসালে কী হয়, সেটা নিচের বক্সে Parameter এর বদলে সরাসরি
              লেখা দিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Search Box এর Query, হাতে মান বসিয়ে"
              query={`SELECT title
FROM tours
WHERE title ILIKE '%' || 'bazar' || '%';`}
              caption="দুটো ট্যুর আসে, ঠিক ILIKE '%bazar%' এর মতো। App এ 'bazar' এর জায়গায় থাকে $1, আর মানটা আলাদা পাঠানো হয়।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা অনুরোধ থেকে একটা শর্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যেকোনো অনুরোধ এলে এই সাতটা ধাপ মাথায় রাখলে সঠিক হাতিয়ার আর সঠিক সীমা
              প্রায় নিজে থেকেই বেরিয়ে আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "কোন Column, সেটা আগে ঠিক করুন",
              description:
                "অনুরোধের ভেতর থেকে Column টা বের করুন: status, starts_on, booked_at, full_name। একটা Column এর উপর একটা শর্ত, তারপর দরকার হলে AND বা OR দিয়ে জোড়া।",
            },
            {
              title: "জানা কয়েকটা মান হলে IN",
              description:
                "pending বা cancelled, Sylhet বা Khulna বা Barishal, ট্যুর 1, 2 বা 5। মানগুলো এক বন্ধনীতে, লেখা হলে Single Quote এ।",
            },
            {
              title: "সীমা হলে BETWEEN, ছোটটা আগে",
              description:
                "সংখ্যা আর date Column এ BETWEEN নিরাপদ, দুই মাথা ভেতরে। সীমা উল্টো লিখলে শূন্য Row আসে, Error আসে না।",
            },
            {
              title: "সময়ের Column হলে Half-open",
              description:
                "timestamptz বা DATETIME এ >= শুরু AND < পরের দিনের শুরু। কোন সময় অঞ্চলে হিসাব হচ্ছে সেটাও মিলিয়ে নিন।",
            },
            {
              title: "লেখার টুকরো হলে LIKE বা ILIKE",
              description:
                "শুরু জানা হলে 'Sa%', শেষ জানা হলে '%Trip', ভেতরে কোথাও হলে '%Bazar%'। বড় ছোট অক্ষর নিয়ে নিশ্চিত না হলে ILIKE বা lower()। Data তে % বা _ থাকলে Escape।",
            },
            {
              title: "খালি ঘরগুলো কোন দলে",
              description:
                "NOT IN, NOT LIKE বা NOT BETWEEN লিখলে নিজেকে জিজ্ঞেস করুন, যেসব Row এর ঘর NULL তাদের কি চাই? চাইলে OR ... IS NULL যোগ করুন।",
            },
            {
              title: "আগে গুনুন, তারপর সীমার মান দিয়ে পরীক্ষা",
              description:
                "count(*) দিয়ে সংখ্যাটা যুক্তিসঙ্গত কিনা দেখুন। তারপর ঠিক সীমার উপর থাকা একটা মান, যেমন 8500 বা ১৪ তারিখের একটা Booking, ফলাফলে আছে কিনা মিলিয়ে নিন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো Error দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের বেশিরভাগ ভুলের একটা মিল আছে: PostgreSQL কোনো আপত্তি করে না,
                শুধু ভুল সংখ্যা দেয়। তাই এগুলো চিনে রাখা দরকার।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>timestamp এ BETWEEN দিয়ে শেষ তারিখ।</strong> শেষ দিনের প্রায় সব
                  Row হারায়। Half-open লিখুন।
                </ListItem>
                <ListItem>
                  <strong>BETWEEN এর সীমা উল্টো।</strong> BETWEEN 12500 AND 8500 শূন্য
                  দেয়। ছোটটা আগে।
                </ListItem>
                <ListItem>
                  <strong>% ছাড়া LIKE।</strong> title LIKE &apos;Saint&apos; শূন্য দেয়,
                  কারণ Pattern পুরো লেখাটা ঢাকতে হয়।
                </ListItem>
                <ListItem>
                  <strong>= এর সাথে %।</strong> title = &apos;Saint%&apos; আসল %
                  চিহ্ন খোঁজে, শূন্য দেয়।
                </ListItem>
                <ListItem>
                  <strong>বড় ছোট অক্ষর ভুলে যাওয়া।</strong> PostgreSQL এর LIKE এ
                  &apos;%bazar%&apos; শূন্য, MySQL এ দুটো। একই Query, দুই উত্তর।
                </ListItem>
                <ListItem>
                  <strong>Data র _ বা % কে Wildcard ভাবা।</strong> &apos;%_%&apos;
                  সাতটাই মেলায়। আসল চিহ্ন খুঁজতে Escape।
                </ListItem>
                <ListItem>
                  <strong>NOT IN আর NOT LIKE এ NULL ভুলে যাওয়া।</strong> খালি ঘরগুলো
                  দুই দিক থেকেই বাদ পড়ে, আর তালিকায় একটা NULL থাকলে NOT IN শূন্য দেয়।
                </ListItem>
                <ListItem>
                  <strong>IN এর লেখায় Quote ভুলে যাওয়া।</strong> city IN (Sylhet,
                  Khulna) লিখলে PostgreSQL Sylhet নামের Column খোঁজে আর column
                  &quot;sylhet&quot; does not exist Error দেয়।
                </ListItem>
                <ListItem>
                  <strong>OR এর পাশে বন্ধনী না দেওয়া।</strong> AND আগে খাটে, তাই উত্তরে
                  এমন Row চলে আসে যা আসার কথা না।
                </ListItem>
                <ListItem>
                  <strong>বড় Table এ শুরুতে %।</strong> লাখো Row তে &apos;%...%&apos;
                  প্রতিটা Row পড়ে। ঘন ঘন এমন খোঁজা লাগলে Module 13 আর 15 এর পথ ধরুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Pattern Matching</strong>, PostgreSQL এর Docs এ LIKE, ILIKE,
                Escape এর নিয়ম, আর তার পরে SIMILAR TO আর Regular Expression।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-matching.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-matching.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Comparison Functions and Operators</strong>, BETWEEN, BETWEEN
                SYMMETRIC আর NOT BETWEEN এর অফিসিয়াল সংজ্ঞা, উদাহরণসহ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-comparison.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-comparison.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Row and Array Comparisons</strong>, IN আর NOT IN কীভাবে হিসাব
                হয়, আর তালিকায় NULL থাকলে কী হয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-comparisons.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-comparisons.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL এর String Comparison Functions</strong>, MySQL এর
                Reference Manual এর এই অধ্যায়ে LIKE, তার Wildcard, \_ আর ESCAPE এর
                নিয়ম, আর Case Sensitivity in String Searches অংশে Default Collation কেন
                বড় ছোট অক্ষর এক ধরে। dev.mysql.com এ গিয়ে অধ্যায়ের নাম দিয়ে খুঁজুন।
              </ListItem>
              <ListItem>
                <strong>আপনার MySQL কোর্সের ভিডিও</strong>, WHERE দিয়ে Filter করার অংশ,
                প্রায় 01:13:04 থেকে। ভিডিওটা MySQL এ, তাই LIKE এর বড় ছোট অক্ষরের
                পার্থক্যটা মাথায় রেখে দেখুন।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  youtube.com/watch?v=hlGoQC332VM
                </a>
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
      title: <SectionTitle>তালিকা, সীমা, ছাঁচ, আর তিনটা ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাদিয়ার তিনটা অনুরোধ এখন তিন লাইনের কাজ। IN দিয়ে status এর তালিকা,
                BETWEEN দিয়ে নভেম্বরের Departure, আর LIKE দিয়ে Sa দিয়ে শুরু নাম।
                সাথে আপনি তিনটা নীরব ফাঁদও চিনলেন, যেগুলো Error দেয় না, শুধু ভুল উত্তর
                দেয়: timestamp এ BETWEEN এর হারানো শেষ দিন, Data র ভেতরের _ আর %, আর NOT
                IN বা NOT LIKE এ চুপচাপ উধাও হওয়া NULL।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  IN মানে কয়েকটা = আর OR, NOT IN মানে তালিকার কোনোটাই না, তবে খালি ঘর বাদ।
                </ListItem>
                <ListItem>
                  BETWEEN দুই মাথা সহ, ছোটটা আগে। SYMMETRIC শুধু PostgreSQL এ।
                </ListItem>
                <ListItem>
                  সময়ের Column এ সবসময় &gt;= শুরু AND &lt; পরের দিনের শুরু।
                </ListItem>
                <ListItem>
                  LIKE পুরো লেখা ঢাকে। % যত খুশি অক্ষর, _ ঠিক একটা, \ এর পরের চিহ্ন হুবহু।
                </ListItem>
                <ListItem>
                  PostgreSQL এর LIKE বড় ছোট অক্ষর আলাদা ধরে, ILIKE ধরে না। MySQL এ Default
                  LIKE ই ধরে না।
                </ListItem>
                <ListItem>
                  শুরুতে % দিলে সাধারণ Index কাজ করে না, আর LIKE আসল Search না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা চরিত্র সামনে এসেছে: খালি ঘর, NULL। Ratargul এর Guide,
                পাঁচজনের ফোন, NOT IN এর তালিকা। প্রতিবার সে চুপচাপ উত্তর বদলে দিয়েছে। পরের
                লেসনে,{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL and Three-valued Logic
                </Link>
                , তাকে সামনাসামনি দেখবেন: কেন NULL = NULL সত্য না, কেন জানি না নামের
                তৃতীয় একটা উত্তর আছে, আর IS NULL কেন আলাদা করে লাগে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["IN", "তালিকার যেকোনো একটার সাথে মিলুক", "status IN ('pending', 'cancelled'), ৭ Row"],
      ["IN এর ভেতরে", "কয়েকটা = আর OR এর সংক্ষেপ", "IN আর OR দুটোই ৭"],
      ["NOT IN", "তালিকার কোনোটার সাথে না মিলুক, খালি ঘর বাদ", "guide_id NOT IN (1, 2), Ratargul বাদ"],
      ["তালিকায় NULL", "NOT IN কিছুই ফেরত দেয় না", "NOT IN (1, NULL), ০ Row"],
      ["BETWEEN", "দুই সীমার মাঝে, দুই মাথা সহ", "8500 AND 12500, ৩ ট্যুর"],
      ["উল্টো সীমা", "Error না, শুধু শূন্য Row", "BETWEEN 12500 AND 8500, ০"],
      ["Timestamp এর ফাঁদ", "শুধু তারিখ মানে সেই দিনের রাত ১২টা", "BETWEEN দেয় ৮, আসল ৯"],
      ["Half-open", ">= শুরু AND < পরের দিনের শুরু", "< '2026-10-15'"],
      ["%", "যত খুশি অক্ষর, শূন্যটাও", "'Saint%', '%Trip', '%Bazar%'"],
      ["_", "ঠিক একটা অক্ষর", "'_a%', ৬ জন"],
      ["Escape", "\\ বা ESCAPE দিয়ে চিহ্নের আসল মানে", "'%\\_%', শুধু tea_garden"],
      ["ILIKE", "বড় ছোট অক্ষর এক ধরে, PostgreSQL এর নিজস্ব", "'%bazar%', ২ Row"],
      ["MySQL এর LIKE", "Default Collation এ বড় ছোট অক্ষর এক", "utf8mb4_0900_ai_ci"],
      ["NOT LIKE আর NULL", "খালি ঘর দুই দিক থেকেই বাদ", "১০ + ০, মোট ১৫"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "status IN ('pending', 'cancelled') এর মানে PostgreSQL এর কাছে আসলে কী?",
        options: [
          {
            key: "A",
            text: "status = 'pending' AND status = 'cancelled'",
            isCorrect: false,
            explanation: "একটা Row এর status একই সাথে দুটো হতে পারে না, তাই AND হলে কোনো Row ই আসত না।",
          },
          {
            key: "B",
            text: "status = 'pending' OR status = 'cancelled'",
            isCorrect: true,
            explanation: "ঠিক। IN হলো কয়েকটা = আর OR এর সংক্ষেপ। Sample Data তে দুটো লেখাই সাতটা Row দেয়।",
          },
          {
            key: "C",
            text: "status এর মান 'pending' থেকে 'cancelled' এর মধ্যে, বর্ণক্রমে",
            isCorrect: false,
            explanation: "সেটা BETWEEN এর কাজ। IN শুধু তালিকার মানগুলোর সাথে হুবহু মেলায়।",
          },
          {
            key: "D",
            text: "status এর ভেতরে কোথাও pending বা cancelled শব্দ আছে",
            isCorrect: false,
            explanation: "লেখার ভেতরে খোঁজা LIKE এর কাজ। IN পুরো মান মেলায়।",
          },
        ],
      },
      {
        id: 2,
        text: "WHERE price_bdt BETWEEN 8500 AND 12500 চালালে 8500 টাকার Cox's Bazar Beach Weekend কি আসবে?",
        options: [
          {
            key: "A",
            text: "না, BETWEEN শুধু দুই সীমার মাঝখানের মান নেয়",
            isCorrect: false,
            explanation: "BETWEEN এর দুই মাথাই ভেতরে। এটা >= 8500 AND <= 12500 এর সমান।",
          },
          {
            key: "B",
            text: "হ্যাঁ, আর 12500 টাকার Saint Martin Island Escape ও আসবে",
            isCorrect: true,
            explanation: "ঠিক। দুই মাথা সহ, তাই মোট তিনটা ট্যুর: 8500, 9500 আর 12500।",
          },
          {
            key: "C",
            text: "শুধু 8500 আসবে, 12500 আসবে না",
            isCorrect: false,
            explanation: "দুই দিকের নিয়ম একই, দুটোই ভেতরে।",
          },
          {
            key: "D",
            text: "Database এর Setting এর উপর নির্ভর করে",
            isCorrect: false,
            explanation: "BETWEEN এর অর্থ SQL Standard এ ঠিক করা, কোনো Setting এটা বদলায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "WHERE price_bdt BETWEEN 12500 AND 8500 চালালে PostgreSQL কী করে?",
        options: [
          {
            key: "A",
            text: "নিজে থেকে সীমা উল্টে তিনটা ট্যুর দেখায়",
            isCorrect: false,
            explanation: "সেটা করে BETWEEN SYMMETRIC। সাধারণ BETWEEN ক্রম যেমন আছে তেমনই নেয়।",
          },
          {
            key: "B",
            text: "Syntax Error দেয়",
            isCorrect: false,
            explanation: "লেখাটা পুরোপুরি বৈধ। কোনো Error আসে না, এটাই বিপদ।",
          },
          {
            key: "C",
            text: "শূন্য Row দেয়, কোনো Error ছাড়া",
            isCorrect: true,
            explanation: "ঠিক। কোনো দাম একই সাথে 12500 এর বেশি আর 8500 এর কম হতে পারে না। চুপচাপ শূন্য।",
          },
          {
            key: "D",
            text: "সব নয়টা ট্যুর দেখায়",
            isCorrect: false,
            explanation: "শর্ত কোনো Row এর জন্যই সত্য হয় না, তাই একটাও আসে না।",
          },
        ],
      },
      {
        id: 4,
        text: "booked_at একটা timestamptz। booked_at BETWEEN '2026-10-01' AND '2026-10-14' দেয় ৮, অথচ ১ থেকে ১৪ অক্টোবরে Booking নয়টা। কেন?",
        options: [
          {
            key: "A",
            text: "BETWEEN শেষ সীমাটা বাদ দেয়",
            isCorrect: false,
            explanation: "BETWEEN শেষ সীমা সহই নেয়। সমস্যা শেষ সীমার মানে।",
          },
          {
            key: "B",
            text: "'2026-10-14' মানে ১৪ তারিখের রাত ১২টা, তাই সেদিন সকাল ১১টা ৫ মিনিটের Booking #24 বাইরে",
            isCorrect: true,
            explanation: "ঠিক। শুধু তারিখ লিখলে সেটা দিনের শুরুর মুহূর্ত। সমাধান: >= '2026-10-01' AND < '2026-10-15'।",
          },
          {
            key: "C",
            text: "একটা Booking এর booked_at খালি",
            isCorrect: false,
            explanation: "booked_at NOT NULL, কোনো Booking এর সময় খালি নেই।",
          },
          {
            key: "D",
            text: "PostgreSQL তারিখ তুলনায় ভুল করে",
            isCorrect: false,
            explanation: "PostgreSQL ঠিক যা বলা হয়েছে তাই করেছে। ভুলটা শর্ত লেখায়।",
          },
        ],
      },
      {
        id: 5,
        text: "WHERE title LIKE 'Saint' কতগুলো ট্যুর আনবে, যেখানে দুটো ট্যুরের নাম Saint দিয়ে শুরু?",
        options: [
          {
            key: "A",
            text: "দুটো, কারণ দুটোর নামেই Saint আছে",
            isCorrect: false,
            explanation: "LIKE নিজে থেকে ভেতরে খোঁজে না। Pattern কে পুরো লেখাটা ঢাকতে হয়।",
          },
          {
            key: "B",
            text: "শূন্য, কারণ % ছাড়া LIKE আর = একই, আর কোনো ট্যুরের পুরো নাম শুধু Saint না",
            isCorrect: true,
            explanation: "ঠিক। শুরুটা ধরতে 'Saint%' লিখতে হয়।",
          },
          {
            key: "C",
            text: "Error, কারণ LIKE এ % লাগবেই",
            isCorrect: false,
            explanation: "Wildcard ছাড়া LIKE বৈধ, শুধু = এর মতো আচরণ করে।",
          },
          {
            key: "D",
            text: "নয়টাই, কারণ কোনো Wildcard নেই",
            isCorrect: false,
            explanation: "Wildcard না থাকলে মিল আরও কঠিন হয়, সহজ না।",
          },
        ],
      },
      {
        id: 6,
        text: "destinations এ kind LIKE '%_%' সাতটা Row ই আনে, অথচ Underscore আছে শুধু tea_garden এ। ঠিক Pattern কোনটা?",
        options: [
          {
            key: "A",
            text: "'%__%'",
            isCorrect: false,
            explanation: "দুটো _ মানে অন্তত দুটো যেকোনো অক্ষর। এটাও প্রায় সবগুলো মেলায়।",
          },
          {
            key: "B",
            text: "'_'",
            isCorrect: false,
            explanation: "এটা মেলায় ঠিক এক অক্ষরের মান, যেমন কোনো kind নেই।",
          },
          {
            key: "C",
            text: "'%\\_%'",
            isCorrect: true,
            explanation: "ঠিক। Backslash এর পরের _ আর Wildcard না, একটা আসল Underscore। ফল শুধু tea_garden।",
          },
          {
            key: "D",
            text: "'tea%'",
            isCorrect: false,
            explanation: "এটা এই Data তে ঠিক Row আনে, কিন্তু প্রশ্ন ছিল Underscore আছে এমন সব মান, শুধু tea দিয়ে শুরু না।",
          },
        ],
      },
      {
        id: 7,
        text: "একজন MySQL এর ভিডিও দেখে title LIKE '%bazar%' লিখলেন। MySQL এ দুটো Row এল, PostgreSQL এ শূন্য। কারণ কী?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর Data তে Cox's Bazar নেই",
            isCorrect: false,
            explanation: "দুই ফাইলে একই Row। পার্থক্যটা তুলনার নিয়মে।",
          },
          {
            key: "B",
            text: "MySQL এর Default Collation utf8mb4_0900_ai_ci বড় ছোট অক্ষর এক ধরে, PostgreSQL এর LIKE ধরে না",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এ একই ফল চাইলে ILIKE বা lower(title) LIKE '%bazar%'।",
          },
          {
            key: "C",
            text: "PostgreSQL এ LIKE শুধু শুরু থেকে মেলায়",
            isCorrect: false,
            explanation: "শুরুতে % থাকলে PostgreSQL যেকোনো জায়গা থেকে মেলায়।",
          },
          {
            key: "D",
            text: "MySQL এ % এর মানে আলাদা",
            isCorrect: false,
            explanation: "% আর _ দুই Database এ একই মানে রাখে।",
          },
        ],
      },
      {
        id: 8,
        text: "নয়টা ট্যুরের মধ্যে guide_id IN (1, 2) দেয় চারটা, guide_id NOT IN (1, 2) দেয় চারটা। নবম ট্যুরটা কোথায়?",
        options: [
          {
            key: "A",
            text: "তার guide_id NULL, তাই দুই শর্তের উত্তরই জানি না, আর WHERE জানি না কে বাদ দেয়",
            isCorrect: true,
            explanation: "ঠিক। Ratargul Swamp Boat Day এর Guide এখনো ঠিক হয়নি। তাকে ধরতে লাগে IS NULL, পরের লেসনে।",
          },
          {
            key: "B",
            text: "সেটা is_active false, তাই লুকানো",
            isCorrect: false,
            explanation: "is_active কোনো শর্তে নেই। আর বন্ধ ট্যুরটার Guide 4, সে NOT IN এর ফলে আছে।",
          },
          {
            key: "C",
            text: "NOT IN এ একটা Bug আছে",
            isCorrect: false,
            explanation: "এটা SQL এর নিয়ম মেনেই হয়, Bug না।",
          },
          {
            key: "D",
            text: "তার guide_id 0",
            isCorrect: false,
            explanation: "0 হলে NOT IN (1, 2) তাকে আনত। ঘরটা আসলে খালি।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Support Desk এর এক সকাল",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Status তালিকা:</strong> নিজের মেশিনের island_tours এ pending আর
        cancelled Booking গুলো IN দিয়ে বের করুন। তারপর একই প্রশ্ন OR দিয়ে লিখে দেখান যে
        দুটো গোনা একই।
      </span>,
      <span key="2">
        <strong>NOT IN এর হিসাব:</strong> guide_id IN (1, 2), NOT IN (1, 2) আর IS NULL,
        তিনটার গোনা লিখুন আর যোগ করে দেখান মোট নয় হয়। কোন ট্যুরটা কোন দলে, এক লাইনে
        লিখুন।
      </span>,
      <span key="3">
        <strong>Timestamp এর ফাঁদ ধরুন:</strong> SET TimeZone = &apos;Asia/Dhaka&apos;
        দিয়ে শুরু করে সেপ্টেম্বর 2026 এ হওয়া Booking দুইভাবে গুনুন: BETWEEN দিয়ে আর
        Half-open দিয়ে। এই Data তে দুটোর ফল কি এক? কেন এক বা কেন আলাদা, ব্যাখ্যা করুন,
        আর এমন একটা তারিখের সীমা খুঁজে বের করুন যেখানে দুটো আলাদা ফল দেয়।
      </span>,
      <span key="4">
        <strong>Search Box বানানোর আগে:</strong> তিনটা Pattern লিখুন যা দিয়ে Customer
        খোঁজা যায়: নামের শুরু দিয়ে, Email এর Domain দিয়ে, আর নামের ভেতরের একটা টুকরো
        দিয়ে বড় ছোট অক্ষর না মেনে। প্রতিটার ফলের সংখ্যা লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু MySQL দিয়ে শিখছেন। তাঁকে
        ছয় লাইনে বোঝান LIKE এর বড় ছোট অক্ষরের নিয়ম দুই Database এ কীভাবে আলাদা, আর
        দুই জায়গায় একই ফল পেতে কী লিখবেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">পাঁচটা কাজের প্রতিটার Query আর তার Output, psql থেকে Copy করা</span>,
      <span key="d2">NOT IN এর হিসাবের তিনটা সংখ্যা আর এক লাইনের ব্যাখ্যা</span>,
      <span key="d3">BETWEEN আর Half-open আলাদা ফল দেয় এমন একটা তারিখের সীমা, দুই ফলসহ</span>,
      <span key="d4">বন্ধুর জন্য লেখা ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "IN, BETWEEN, LIKE এর Drill",
    subtitle: "নিজের island_tours এ psql দিয়ে, প্রতিটার প্রত্যাশিত গোনাসহ",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, অথবা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। Module 02 এর Load করা Database টাই লাগবে। প্রথম লাইনে সময় অঞ্চল ঢাকা করে নিন, নইলে সময়ের গোনা বদলে যেতে পারে।",
      },
      {
        title: "IN আর NOT IN",
        description:
          "প্রথম আর দ্বিতীয় ফাইল চালান। প্রতিটা Query এর পাশে লেখা গোনার সাথে নিজের ফল মিলিয়ে দেখুন, বিশেষ করে NOT IN (1, NULL) এর শূন্য।",
      },
      {
        title: "BETWEEN আর উল্টো সীমা",
        description:
          "তৃতীয় ফাইল চালান। উল্টো সীমায় শূন্য আর SYMMETRIC এ তিন, নিজের চোখে দেখুন।",
      },
      {
        title: "সময়ের ফাঁদ",
        description:
          "চতুর্থ ফাইল চালান। BETWEEN এ আট, Half-open এ নয়। তারপর SET TimeZone = 'UTC' দিয়ে একই দুটো Query আবার চালিয়ে দেখুন সংখ্যা বদলায় কিনা, আর কেন।",
      },
      {
        title: "LIKE, Escape আর ILIKE",
        description:
          "পঞ্চম ফাইল চালান। প্রতিটা Pattern এর পাশে লেখা Row সংখ্যা মিলিয়ে নিন।",
      },
      {
        title: "NULL আর সব একসাথে",
        description:
          "ষষ্ঠ ফাইল চালান। ১০ + ০ যে ১৫ না, সেটা দেখুন, তারপর শেষ Query টা নিজে বদলে আরও একটা শর্ত যোগ করে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-in.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT booking_id, status FROM bookings
WHERE status IN ('pending', 'cancelled');             -- 7 rows

SELECT full_name, city FROM customers
WHERE city IN ('Sylhet', 'Khulna', 'Barishal');      -- 3 rows

SELECT booking_id FROM bookings
WHERE booking_id IN (1, 5, 99);                       -- 2 rows, 99 নেই`,
      },
      {
        language: "sql",
        filename: "02-not-in.sql",
        code: `SELECT count(*) FROM tours WHERE guide_id IN (1, 2);      -- 4
SELECT count(*) FROM tours WHERE guide_id NOT IN (1, 2);  -- 4
SELECT count(*) FROM tours WHERE guide_id IS NULL;        -- 1
SELECT count(*) FROM tours;                                -- 9

SELECT title FROM tours WHERE guide_id NOT IN (1, NULL);  -- 0 rows`,
      },
      {
        language: "sql",
        filename: "03-between.sql",
        code: `SELECT title, price_bdt FROM tours
WHERE price_bdt BETWEEN 8500 AND 12500;               -- 3 rows

SELECT count(*) FROM tours
WHERE price_bdt BETWEEN 12500 AND 8500;               -- 0

SELECT count(*) FROM tours
WHERE price_bdt BETWEEN SYMMETRIC 12500 AND 8500;     -- 3

SELECT departure_id, starts_on FROM departures
WHERE starts_on BETWEEN '2026-11-01' AND '2026-11-30'; -- 4 rows`,
      },
      {
        language: "sql",
        filename: "04-timestamps.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT count(*) FROM bookings
WHERE booked_at BETWEEN '2026-10-01' AND '2026-10-14'; -- 8

SELECT count(*) FROM bookings
WHERE booked_at >= '2026-10-01'
  AND booked_at <  '2026-10-15';                      -- 9

SELECT booking_id, booked_at FROM bookings
WHERE booked_at >= '2026-10-14'
  AND booked_at <  '2026-10-15';                      -- 1 row, #24`,
      },
      {
        language: "sql",
        filename: "05-like.sql",
        code: `SELECT title FROM tours WHERE title LIKE 'Saint%';        -- 2 rows
SELECT full_name FROM customers WHERE full_name LIKE '_a%'; -- 6 rows
SELECT count(*) FROM destinations WHERE kind LIKE '%_%';   -- 7
SELECT kind FROM destinations WHERE kind LIKE '%\\_%';      -- 1 row, tea_garden
SELECT title FROM tours WHERE title LIKE '%bazar%';        -- 0 rows
SELECT title FROM tours WHERE title ILIKE '%bazar%';       -- 2 rows`,
      },
      {
        language: "sql",
        filename: "06-null-and-combine.sql",
        code: `SELECT count(*) FROM customers WHERE phone LIKE '+880%';      -- 10
SELECT count(*) FROM customers WHERE phone NOT LIKE '+880%';  -- 0
SELECT count(*) FROM customers WHERE phone IS NULL;           -- 5

SELECT booking_id, status, total_bdt FROM bookings
WHERE status IN ('confirmed', 'pending')
  AND total_bdt BETWEEN 20000 AND 40000
  AND booked_at >= '2026-09-01';                              -- 5 rows`,
      },
    ],
    tip: (
      <>
        psql এ একটা Query এর গোনা মেলাতে চাইলে সেটার SELECT এর জায়গায় count(*) বসিয়ে
        আগে সংখ্যাটা দেখে নিন, তারপর আসল Column গুলো ফিরিয়ে আনুন। সংখ্যা না মিললে
        প্রথম সন্দেহ: সময় অঞ্চল, তারপর NULL, তারপর বড় ছোট অক্ষর।
      </>
    ),
  },
};
