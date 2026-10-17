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
  PlacementLab,
  WindowLab,
} from "../../../components/course/topics/windows/window-animations";
import {
  CollapseVsKeepSplit,
  OverAnatomyDiagram,
  ShareOfTotalDiagram,
  WindowOrderDiagram,
} from "../../../components/course/topics/windows/window-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const TOUR_REPORT = `-- ধাপ ১: প্রতিটা Tour এর confirmed আয়, আয় না থাকলে 0.00
WITH tour_revenue AS (
  SELECT t.title,
         coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0.00) AS revenue
  FROM tours t
  LEFT JOIN departures d ON d.tour_id = t.tour_id
  LEFT JOIN bookings b   ON b.departure_id = d.departure_id
  GROUP BY t.tour_id, t.title
)
-- ধাপ ২: প্রতিটা Row রেখে পাশে মোটের ভাগ আর গড় থেকে দূরত্ব
SELECT title,
       revenue,
       round(100 * revenue / sum(revenue) OVER (), 1) AS share_pct,
       round(revenue - avg(revenue) OVER (), 2)       AS vs_avg
FROM tour_revenue
ORDER BY revenue DESC, title;`;

export const whatAreWindowFunctionsContent: TopicData = {
  id: "what-are-window-functions",
  introduction: {
    badge: "MODULE 08 · LESSON 01",
    title: <SectionTitle>Row না হারিয়ে হিসাব</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 05 এ আপনি শিখেছেন অনেক Row থেকে একটা উত্তর বের করতে: count, sum, avg। কিন্তু সেই উত্তরের দাম ছিল
          Row গুলো হারানো। GROUP BY দিলে চব্বিশটা Booking ভাঁজ হয়ে তিনটা Row হয়ে যায়, আর তখন আর জানা যায় না কোন
          Booking কোনটা ছিল। Module 07 এ আপনি একটা পথ পেয়েছেন: প্রতিটা Row এর পাশে একটা Scalar Subquery বসিয়ে গড়টা
          আলাদা করে আনা। কাজ চলে, কিন্তু একই Subquery বারবার লিখতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন তৃতীয় পথ নিয়ে, যেটা Analytics SQL এর সবচেয়ে বড় হাতিয়ার: Window Function। Window Function একটা
          Aggregate এর মতোই হিসাব করে, কিন্তু Row গুলোকে ভাঁজ করে না। প্রতিটা Row নিজের জায়গায় থাকে, আর তার পাশে
          পুরো দলের হিসাবটা বসে যায়। এর চাবিকাঠি একটা শব্দ: OVER।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি প্রতিটা Booking এর পাশে সব Booking এর গড়, মোট আর গড় থেকে দূরত্ব বসাতে পারবেন, বুঝবেন
          GROUP BY আর Window এর ফলাফলের আকার কেন আলাদা, Query এর কোন ধাপে Window এর হিসাব হয় আর তাই কেন WHERE এ
          Window লেখা যায় না, Window দিয়ে ছাঁকতে হলে কীভাবে CTE তে মুড়তে হয়, WINDOW Clause দিয়ে Window এর নাম দিতে
          পারবেন, আর GROUP BY এর পরে Window বসিয়ে প্রতিটা দলের ভাগ বের করতে পারবেন। সব উদাহরণ Island Tours এর আসল
          Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি Row গুলোকে ভাঁজ করি না। প্রতিটা Row যেমন আছে তেমনই থাকে, আর আমি তার পাশে চুপচাপ পুরো দলের হিসাবটা লিখে দিই। শিক্ষক যেমন প্রতিটা খাতায় ছাত্রের নিজের নম্বরের পাশে ক্লাসের গড়ও লিখে দেন।",
      author: "OVER",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>প্রতিটা Booking, আর গড় থেকে কত দূরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর Manager ফারুক সাহেব সাপ্তাহিক বৈঠকে একটা নতুন তালিকা চাইলেন।
                তিনি সব Booking এক নজরে দেখতে চান, চব্বিশটাই, প্রতিটা আলাদা লাইনে। আর প্রতিটা লাইনের পাশে দুটো জিনিস:
                সব Booking এর গড় টাকার পরিমাণ, আর এই Booking টা সেই গড় থেকে কত বেশি বা কত কম। তাঁর যুক্তি সহজ: গড়ের
                অনেক উপরের Booking গুলো বড় পরিবারের, তাদের জন্য বিশেষ যত্ন লাগে, আর গড়ের অনেক নিচের গুলো একা ভ্রমণকারী।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer তানিম Module 05 এর কথা মনে করলেন: গড় মানে avg। তিনি লিখলেন booking_id, total_bdt, আর
                পাশে avg(total_bdt)। PostgreSQL সাথে সাথে থামিয়ে দিল। নিচের বক্সে Run চাপুন, Error টা নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা"
              query={`SELECT booking_id, total_bdt, avg(total_bdt)
FROM bookings;`}
              caption="Error: column bookings.booking_id must appear in the GROUP BY clause or be used in an aggregate function। avg চব্বিশটা Row থেকে একটাই উত্তর বানাতে চায়, আর booking_id চায় চব্বিশটা আলাদা Row। দুটো একসাথে এক ফলাফলে বসতে পারে না। এটা Module 05 এর সেই পুরনো নিয়ম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তারপর তানিমের মনে পড়ল Module 07 এর কথা। Scalar Subquery একটাই মান দেয়, আর সেই মান যেকোনো Row এর পাশে
                বসানো যায়। তিনি গড়টা একটা ছোট Query তে আলাদা করে আনলেন, আর গড় থেকে দূরত্ব বের করতে সেটা আরেকবার লিখলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 07 এর পথ: Scalar Subquery"
              query={`SELECT booking_id, total_bdt,
       round((SELECT avg(total_bdt) FROM bookings), 2) AS avg_all,
       round(total_bdt - (SELECT avg(total_bdt) FROM bookings), 2) AS diff
FROM bookings
ORDER BY booking_id;`}
              caption="চব্বিশটা Row, প্রতিটার পাশে গড় 24679.17, আর দূরত্ব: Booking 1 গড়ের 320.83 উপরে, Booking 3 গড়ের 12179.17 নিচে। উত্তর ঠিক। কিন্তু একই Subquery দুইবার লেখা, আর মোট বা সর্বোচ্চ চাইলে আরও দুইবার। এই লেসন একটা ছোট আর পরিষ্কার পথ দেখাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো চেষ্টাই একটা আসল প্রশ্নের দিকে ইশারা করে। আমরা চাই একটা হিসাব যেটা অনেক Row দেখে, কিন্তু উত্তরটা
                প্রতিটা Row এর পাশে বসায়, কোনো Row না হারিয়ে। SQL এ ঠিক এই কাজের জন্য আলাদা একটা ধারণা আছে, যার নাম
                Window Function। তানিমের Query টা Window দিয়ে লিখলে এমন দাঁড়ায়, আর এই লেসন শেষে এর প্রতিটা শব্দ আপনার
                চেনা হয়ে যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "the-window-way.sql",
          code: `SELECT booking_id, total_bdt,
       round(avg(total_bdt) OVER (), 2)             AS avg_all,
       round(total_bdt - avg(total_bdt) OVER (), 2) AS diff
FROM bookings
ORDER BY booking_id;`,
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "keep-every-row",
      subHeader: { index: "002", title: "Keep Every Row" },
      title: <SectionTitle>খাতায় নিজের নম্বর, পাশে ক্লাসের গড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের পরীক্ষার কথা ভাবুন। খাতা দেখা শেষে শিক্ষকের হাতে দুটো কাজ থাকতে পারে। এক, প্রধান শিক্ষকের
                জন্য একটা সারসংক্ষেপ: প্রতিটা শাখার গড় নম্বর, এক শাখা এক লাইন। এই কাগজে আর কোনো ছাত্রের নাম থাকে না।
                দুই, প্রতিটা ছাত্রের খাতা ফেরত দেওয়া, যেখানে তার নিজের নম্বর লেখা আর পাশে ছোট করে ক্লাসের গড়, যাতে সে
                নিজেই বোঝে সে কোথায় দাঁড়িয়ে। দুটো কাজেই গড় একই নিয়মে হিসাব হয়েছে। তফাত শুধু ফলাফলের আকারে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম কাজটা GROUP BY। অনেক Row ভাঁজ হয়ে দলপ্রতি একটা Row। দ্বিতীয় কাজটা Window Function। প্রতিটা Row
                যেমন ছিল তেমনই থাকে, শুধু পাশে একটা নতুন Column যোগ হয়, যেখানে অনেক Row দেখে করা হিসাবের উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                দুটো শব্দ এখনই পরিষ্কার করে নেওয়া যাক, কারণ পুরো মডিউল এদের উপর দাঁড়িয়ে। <strong>Window</strong> মানে
                Row গুলোর সেই দল, যেটা দেখে একটা নির্দিষ্ট Row এর জন্য হিসাবটা হয়। নামটা জানালা থেকে: বর্তমান Row টা যেন
                একটা জানালা দিয়ে কয়েকটা Row দেখছে, আর শুধু সেগুলো দিয়েই হিসাব করছে। <strong>Window Function</strong> মানে
                যে Function এমন একটা Window এর উপর হিসাব করে আর উত্তরটা প্রতিটা Row এর পাশে বসায়। এই লেসনে জানালাটা সবচেয়ে
                বড়: ফলাফলের সব Row। পরের লেসনগুলোতে জানালা ছোট হবে, প্রতিটা Row এর জন্য আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CollapseVsKeepSplit />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা বাক্যে পুরো মডিউল",
          content: (
            <ContentParagraph>
              GROUP BY অনেক Row কে একটা Row বানায়। Window Function অনেক Row দেখে হিসাব করে, কিন্তু প্রতিটা Row কে নিজের
              জায়গায় রেখে তার পাশে উত্তরটা লেখে। Row সংখ্যা বদলায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "over",
      subHeader: { index: "003", title: "OVER ()" },
      title: <SectionTitle>একটা শব্দ, Aggregate কে Window বানায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Window Function লেখার জন্য নতুন কোনো Function শিখতে হয় না। চেনা avg টাই লিখুন, তারপর তার ঠিক পরে
                <code className={CODE}>OVER ()</code>। এই একটা শব্দ আর এক জোড়া বন্ধনী PostgreSQL কে বলে দেয়: এটা সাধারণ
                Aggregate না, এটা Window Function। Row ভাঁজ করা হবে না। বন্ধনীর ভেতরে লেখা থাকে Window কোন Row গুলো নিয়ে।
                বন্ধনী খালি থাকলে মানে ফলাফলের সব Row মিলে একটাই Window।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OverAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম Window Function"
              query={`SELECT booking_id, status, total_bdt,
       avg(total_bdt) OVER () AS avg_all
FROM bookings
ORDER BY booking_id;`}
              caption="চব্বিশটা Row, আর প্রতিটার পাশে একই সংখ্যা: 24679.166666666667। তানিমের প্রথম চেষ্টার মতো Error নেই, কারণ OVER থাকায় avg আর Row ভাঁজ করতে চায় না। দশমিকের পরে এত অঙ্ক কারণ numeric এর গড় নির্ভুল রাখা হয়, দেখানোর জন্য round(..., 2) লাগবে। ORDER BY booking_id বাদ দিয়ে চালান: Row এর ক্রম বদলাতে পারে, কিন্তু avg_all বদলায় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Row এ একই সংখ্যা দেখে প্রথমে মনে হতে পারে, এ আর এমন কী। কিন্তু খেয়াল করুন কী ঘটেছে: একটা Query
                তে একসাথে চব্বিশটা আলাদা Row আর তাদের সবার গড়। GROUP BY দিয়ে এটা সম্ভব ছিল না, আর Subquery দিয়ে করতে
                আলাদা একটা Query লাগত। এখন গড়টা Row এর পাশেই একটা সাধারণ Column, যেটা দিয়ে হিসাব করা যায়, সাজানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                একই নিয়মে চেনা অন্য Aggregate গুলোও Window হয়ে যায়। count(*) OVER () দেয় মোট কয়টা Row, sum(total_bdt)
                OVER () দেয় সব টাকার যোগফল, min আর max দেয় সবচেয়ে ছোট আর বড়টা। প্রতিটা Row এর পাশে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  প্রতিটা Booking এর <code className={CODE}>booking_id</code> আর <code className={CODE}>total_bdt</code>,
                  আর তৃতীয় Column এ সব Booking এর <code className={CODE}>total_bdt</code> এর যোগফল, প্রতিটা Row এর পাশে।
                  চব্বিশটা Row আসার কথা।
                </>
              }
              hint={
                <>
                  যোগফল মানে sum। Row না হারাতে sum এর পরে <code className={CODE}>OVER ()</code>।
                </>
              }
              solution={`SELECT booking_id, total_bdt,
       sum(total_bdt) OVER () AS all_bookings
FROM bookings;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "distance-from-average",
      subHeader: { index: "004", title: "Distance From Average" },
      title: <SectionTitle>Window এর মান দিয়ে হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Window Function এর ফলাফল একটা সাধারণ সংখ্যা, তাই সেটা দিয়ে আর দশটা সংখ্যার মতোই যোগ, বিয়োগ, ভাগ করা
                যায়। ফারুক সাহেবের আসল প্রশ্ন ছিল প্রতিটা Booking গড় থেকে কত দূরে। সেটা মানে total_bdt থেকে গড় বিয়োগ।
                আর গড়ের তুলনায় শতাংশে দেখতে চাইলে total_bdt কে গড় দিয়ে ভাগ, গুণ ১০০।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড় থেকে দূরত্ব, টাকায় আর শতাংশে"
              query={`SELECT booking_id, total_bdt,
       round(total_bdt - avg(total_bdt) OVER (), 2)      AS diff,
       round(100 * total_bdt / avg(total_bdt) OVER (), 1) AS pct_of_avg
FROM bookings
ORDER BY booking_id;`}
              caption="Booking 1: গড়ের 320.83 উপরে, গড়ের 101.3%। Booking 2: 25320.83 উপরে, 202.6%, মানে গড়ের দ্বিগুণের বেশি। Booking 3: 12179.17 নিচে, গড়ের 50.7%। ধনাত্মক diff মানে গড়ের উপরে, ঋণাত্মক মানে নিচে। একটাই Query, কোনো Subquery নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শতাংশের হিসাবে একটা পুরনো ফাঁদ আবার ফিরে আসে, Module 04 এর Integer Division। seats একটা পূর্ণসংখ্যার Column,
                আর sum(seats) ও পূর্ণসংখ্যা। <code className={CODE}>100 * seats / sum(seats) OVER ()</code> লিখলে
                PostgreSQL পূর্ণসংখ্যা দিয়ে ভাগ করে, আর দশমিকের পরের অংশ হারিয়ে যায়। তাই ভাগের আগে একটা পক্ষকে দশমিক
                বানাতে হয়, যেমন <code className={CODE}>100.0 * seats</code>। total_bdt এর বেলায় এই ভয় নেই, কারণ সেটা
                numeric।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সিটের ভাগ: পূর্ণসংখ্যা বনাম দশমিক"
              query={`SELECT booking_id, seats,
       100 * seats / sum(seats) OVER ()             AS wrong_pct,
       round(100.0 * seats / sum(seats) OVER (), 1) AS seat_pct
FROM bookings
ORDER BY booking_id;`}
              caption="Booking 1 এর 2টা সিট, সব মিলিয়ে 53টা সিট। wrong_pct দেখায় 3, কারণ 200 / 53 পূর্ণসংখ্যার ভাগে 3। seat_pct দেখায় 3.8, যেটা আসল। Booking 3 এর 1টা সিট: wrong_pct 1, seat_pct 1.9। এই ফাঁদ PostgreSQL এর: MySQL এ / সবসময় দশমিক ভাগ করে, সেখানে wrong_pct দেখায় 3.7736।"
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
                  <code className={CODE}>payments</code> Table থেকে প্রতিটা Payment এর{" "}
                  <code className={CODE}>payment_id</code>, <code className={CODE}>amount_bdt</code>, আর তৃতীয় Column এ
                  সেই Payment সব Payment এর গড় থেকে কত দূরে, দুই দশমিক পর্যন্ত গোল করে। উনিশটা Row।
                </>
              }
              hint={
                <>
                  <code className={CODE}>round(amount_bdt - avg(amount_bdt) OVER (), 2)</code>। গড় হিসাব হয় সব Payment
                  এর উপর, paid, refunded আর failed মিলিয়ে।
                </>
              }
              solution={`SELECT payment_id, amount_bdt,
       round(amount_bdt - avg(amount_bdt) OVER (), 2) AS vs_avg
FROM payments;`}
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
                  প্রতিটা Booking এর <code className={CODE}>booking_id</code>, <code className={CODE}>seats</code>, আর সব
                  Booking এর মোট সিটের কত শতাংশ এই Booking এর, এক দশমিক পর্যন্ত গোল করে। Booking 1 এর পাশে 3.8 আসার কথা।
                </>
              }
              hint={
                <>
                  পূর্ণসংখ্যার ভাগের ফাঁদ এড়াতে <code className={CODE}>100.0 * seats</code> দিয়ে শুরু করুন, তারপর{" "}
                  <code className={CODE}>/ sum(seats) OVER ()</code>।
                </>
              }
              solution={`SELECT booking_id, seats,
       round(100.0 * seats / sum(seats) OVER (), 1) AS seat_pct
FROM bookings;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "group-by-vs-window",
      subHeader: { index: "005", title: "GROUP BY vs Window" },
      title: <SectionTitle>একই হিসাব, দুই আকারের ফলাফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের বক্সে দুটো Query পাশাপাশি। দুটোই count আর sum ব্যবহার করে। প্রথমটা GROUP BY দিয়ে, দ্বিতীয়টা OVER
                দিয়ে। Run চাপার আগে আন্দাজ করুন প্রতিটা কয়টা Row দেবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY ভাঁজ করে, Window রাখে"
              query={`-- GROUP BY: প্রতিটা status এর জন্য একটা Row
SELECT status, count(*) AS bookings, sum(total_bdt) AS total
FROM bookings
GROUP BY status
ORDER BY status;

-- Window: প্রতিটা Booking এর জন্য একটা Row, পাশে সবার হিসাব
SELECT booking_id, status, total_bdt,
       count(*) OVER ()       AS bookings,
       sum(total_bdt) OVER () AS all_total
FROM bookings
ORDER BY booking_id;`}
              caption="প্রথম Query দেয় ৩টা Row: cancelled 3 টা 51500.00, confirmed 17 টা 423600.00, pending 4 টা 117200.00। দ্বিতীয়টা দেয় ২৪টা Row, প্রতিটার পাশে 24 আর 592300.00। একই count আর sum, কিন্তু প্রথমটা দলের উত্তর, দ্বিতীয়টা প্রতিটা Row এর পাশে সবার উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনটা কখন, তার প্রশ্নটা খুব সহজ: উত্তরে Row কয়টা চাই? প্রতিটা দলের জন্য একটা লাইন চাইলে, যেমন status
                প্রতি মোট আয়, সেটা GROUP BY এর কাজ। প্রতিটা আলাদা জিনিসের লাইন চাই, কিন্তু পাশে বড় দলের হিসাবও দরকার,
                যেমন প্রতিটা Booking আর পাশে সবার গড়, সেটা Window এর কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "GROUP BY", "Window Function"],
          rows: [
            ["ফলাফলে কয়টা Row", "দলের সংখ্যা (৩)", "আসল Row এর সংখ্যা (২৪)"],
            ["আলাদা Row এর বিবরণ", "হারিয়ে যায়, দলের Column ছাড়া", "পুরোটা থাকে"],
            ["Aggregate এর উত্তর কোথায়", "দলের একমাত্র লাইনে", "প্রতিটা Row এর পাশে, বারবার"],
            ["SELECT এ সাধারণ Column", "শুধু GROUP BY এর Column", "যেকোনো Column"],
            ["চেনার উপায়", "Query তে GROUP BY", "Function এর পরে OVER"],
            ["সাধারণ ব্যবহার", "Report এর সারসংক্ষেপ", "প্রতিটা Row কে বড় ছবির সাথে তুলনা"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "watch-the-window",
      subHeader: { index: "006", title: "Watch the Window" },
      title: <SectionTitle>বর্তমান Row কোন Row গুলো দেখছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Window Function এর মনের ছবিটা এমন: PostgreSQL ফলাফলের Row গুলো একটা একটা করে হাতে নেয়। প্রতিটা Row এর
                জন্য সে জিজ্ঞেস করে, এই Row এর Window এ কোন Row গুলো আছে? তারপর শুধু সেই Row গুলো দিয়ে হিসাব করে উত্তরটা
                এই Row এর পাশে লেখে। নিচের Lab এ পরের Row চাপতে থাকুন। বর্তমান Row বদলায়, কিন্তু আলো জ্বলে সবসময় সব Row
                এ, কারণ <code className={CODE}>OVER ()</code> এর Window সবসময় পুরো ফলাফল। তাই উত্তরও সবার জন্য একই।
              </ContentParagraph>
              <ContentParagraph>
                এবার WHERE বদলে <code className={CODE}>status = &apos;confirmed&apos;</code> করুন। Window ছোট হয়ে ১৭টা Row
                হয়ে যায়, আর avg বদলে 24917.65। কেন, তার উত্তর এই লেসনের ৮ নম্বর অংশে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WindowLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আজকের Window বড়, কালকের Window ছোট",
          content: (
            <ContentParagraph>
              এই লেসনের প্রতিটা Window একই: সব Row। তাই প্রতিটা Row এর পাশে একই উত্তর। পুরো মডিউলের বাকি অংশ এই
              জানালাকে ছোট করার গল্প: শুধু একই status এর Row (Lesson 03, PARTITION BY), শুধু এখন পর্যন্ত আসা Row
              (Lesson 04, চলমান যোগফল), শুধু আগের Row টা (Lesson 05, LAG)। জানালা ছোট হলে প্রতিটা Row এর উত্তর আলাদা হয়,
              আর তখনই Window Function আসল শক্তি দেখায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "which-functions-fit",
      subHeader: { index: "007", title: "Which Functions Fit" },
      title: <SectionTitle>কোন Function Window হতে পারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Window Function দুই রকম। প্রথম রকম চেনা Aggregate গুলো: count, sum, avg, min, max, string_agg, bool_and,
                এমন প্রায় সব। OVER ছাড়া এরা Row ভাঁজ করে, OVER দিলে Row রেখে দেয়। দ্বিতীয় রকম শুধু Window এর জন্য তৈরি
                Function: row_number, rank, dense_rank, lag, lead, first_value, ntile আর এমন কয়েকটা। এদের OVER ছাড়া
                লেখাই যায় না, কারণ এদের পুরো কাজটা Window এর ভেতরে Row এর অবস্থান নিয়ে। এই দ্বিতীয় দলটা এই মডিউলের
                পরের লেসনগুলোর বিষয়, যেমন{" "}
                <Link href="/sql/topic/ranking-functions" className={LINK}>
                  ROW_NUMBER, RANK and DENSE_RANK
                </Link>{" "}
                আর{" "}
                <Link href="/sql/topic/lag-lead" className={LINK}>
                  LAG, LEAD, FIRST_VALUE and NTILE
                </Link>
                ।
              </ContentParagraph>
              <ContentParagraph>
                এক Query তে যতগুলো খুশি Window Function বসানো যায়। নিচের বক্সে একই Row এর পাশে পাঁচটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Row এর পাশে পাঁচটা Window"
              query={`SELECT booking_id, seats,
       count(*) OVER ()   AS bookings,
       sum(seats) OVER () AS all_seats,
       min(seats) OVER () AS fewest,
       max(seats) OVER () AS most,
       round(avg(seats) OVER (), 2) AS avg_seats
FROM bookings
ORDER BY booking_id;`}
              caption="প্রতিটা Row এ 24, 53, 1, 5 আর 2.21। Booking 23 এর 5টা সিট, সেটাই most। পাঁচটা হিসাব আলাদা আলাদা লেখা, কিন্তু সবগুলোর Window একই, তাই পরের অংশে এদের একটা নাম দিয়ে ছোট করা হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Window Aggregate এর সাথে দুটো জিনিস চলে না। প্রথমটা DISTINCT। <code className={CODE}>count(DISTINCT
                customer_id) OVER ()</code> লিখলে PostgreSQL বলে DISTINCT is not implemented for window functions। কতজন আলাদা
                Customer, সেই সংখ্যা প্রতিটা Row এর পাশে চাইলে Module 07 এর Scalar Subquery এখনো সবচেয়ে সহজ পথ।
                দ্বিতীয়টা একটা সাধারণ Aggregate এর ভেতরে Window রাখা, যেমন <code className={CODE}>sum(avg(x) OVER ())</code>।
                সেটার কারণ ৮ নম্বর অংশে পরিষ্কার হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আলাদা Customer গোনা: যা চলে আর যা চলে না"
              query={`-- চলে: আলাদা Customer গোনা Scalar Subquery তে
SELECT booking_id, customer_id,
       (SELECT count(DISTINCT customer_id) FROM bookings) AS customers
FROM bookings
ORDER BY booking_id
LIMIT 3;

-- চলে না: Window এর ভেতরে DISTINCT
SELECT booking_id, count(DISTINCT customer_id) OVER () AS customers
FROM bookings;`}
              caption="প্রথম Query তিনটা Row দেয়, প্রতিটার পাশে 14, কারণ ২৪টা Booking এসেছে ১৪ জন আলাদা Customer থেকে। দ্বিতীয় Query তে Error: DISTINCT is not implemented for window functions। MySQL এও একই সীমা, সেখানে ERROR 1235।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "where-windows-run",
      subHeader: { index: "008", title: "Where Windows Run" },
      title: <SectionTitle>Query এর কোন ধাপে Window এর হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ আপনি দেখেছেন, Query যে ক্রমে লেখা হয় সে ক্রমে চলে না। আগে FROM, তারপর WHERE, তারপর GROUP BY,
                HAVING, তারপর SELECT, DISTINCT, ORDER BY আর শেষে LIMIT। Window এর হিসাব এই সারিতে একটা নির্দিষ্ট জায়গায়
                বসে: WHERE, GROUP BY আর HAVING শেষ হওয়ার পরে, ORDER BY আর LIMIT এর আগে। PostgreSQL এর Docs সোজা কথায় বলে,
                Window Function শুধু SELECT তালিকা আর ORDER BY তে লেখা যায়, কারণ যুক্তির দিক থেকে এরা WHERE, GROUP BY আর
                HAVING এর পরে চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WindowOrderDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই একটা তথ্য থেকে তিনটা জরুরি ফল বের হয়। <strong>প্রথম</strong>, WHERE আগে Row ছেঁটে ফেলে, তাই Window শুধু
                টিকে থাকা Row দেখে। <strong>দ্বিতীয়</strong>, LIMIT পরে আসে, তাই LIMIT 3 লিখলেও Window সব Row দেখে নেয়,
                তিনটা Row শুধু দেখানো হয়। <strong>তৃতীয়</strong>, ORDER BY পরে আসে, তাই Window এর মান দিয়ে সাজানো যায়।
                প্রথম দুটো একসাথে নিচের বক্সে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE আগে, LIMIT পরে"
              query={`-- WHERE আগে চলে: Window শুধু confirmed Row দেখে
SELECT booking_id, total_bdt,
       round(avg(total_bdt) OVER (), 2) AS avg_seen
FROM bookings
WHERE status = 'confirmed'
ORDER BY booking_id;

-- LIMIT পরে চলে: তিনটা Row দেখায়, কিন্তু গড় চব্বিশটার
SELECT booking_id, total_bdt,
       round(avg(total_bdt) OVER (), 2) AS avg_seen
FROM bookings
ORDER BY booking_id
LIMIT 3;`}
              caption="প্রথম Query: ১৭টা Row, গড় 24917.65, শুধু confirmed Booking এর গড়। দ্বিতীয়: ৩টা Row, কিন্তু গড় 24679.17, সব ২৪টার। একই avg(total_bdt) OVER (), দুই রকম উত্তর, কারণ একটায় WHERE Window এর আগে Row কমিয়েছে, অন্যটায় LIMIT Window এর পরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ক্রমটা শুধু বইয়ের কথা না, PostgreSQL এর Query Plan এও সরাসরি দেখা যায়। EXPLAIN দিয়ে Plan চাইলে সেটা
                নিচ থেকে উপরে পড়তে হয় (Module 13 এ বিস্তারিত)। নিচের Plan এ সবচেয়ে নিচে Table পড়া আর Filter, মানে WHERE।
                তার উপরে WindowAgg, মানে Window এর হিসাব। তার উপরে Sort, মানে ORDER BY। একদম উপরে Limit।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Plan এ ধাপগুলোর ক্রম"
              query={`EXPLAIN (COSTS OFF)
SELECT booking_id, total_bdt, avg(total_bdt) OVER ()
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt DESC
LIMIT 3;`}
              caption="নিচ থেকে উপরে: Seq Scan on bookings আর Filter: (status = 'confirmed'::text), তারপর WindowAgg (Window: w1 AS ()), তারপর Sort (Sort Key: total_bdt DESC), শেষে Limit। ছবির সারিটাই, কিন্তু PostgreSQL এর নিজের মুখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় ফল, ORDER BY তে Window। ফারুক সাহেব গড় থেকে সবচেয়ে উপরের তিনটা Booking আগে দেখতে চাইলে দূরত্বটা
                দিয়েই সাজানো যায়। সমান হলে ক্রম যেন নিশ্চিত থাকে, তাই booking_id দিয়ে দ্বিতীয় সাজানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY তে Window এর মান"
              query={`SELECT booking_id, total_bdt
FROM bookings
ORDER BY total_bdt - avg(total_bdt) OVER () DESC, booking_id
LIMIT 3;`}
              caption="তিনটা Row: Booking 2 আর 14 (দুটোই 50000.00), তারপর 23 (42500.00)। ORDER BY Window এর পরে চলে, তাই মানটা দেখতে পায়। একই জিনিস WHERE এ লিখলে কী হয়, সেটা পরের অংশে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "filtering-a-window",
      subHeader: { index: "009", title: "Filtering a Window" },
      title: <SectionTitle>গড়ের উপরের Booking গুলো শুধু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের পরের অনুরোধটা স্বাভাবিক: শুধু গড়ের উপরের Booking গুলো দেখান। তানিম সবচেয়ে সোজা পথ ধরলেন,
                Window এর মানটা WHERE এ লিখলেন। আগের অংশের ছবি মনে থাকলে উত্তরটা আগেই আন্দাজ করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE এ Window: চলে না"
              query={`SELECT booking_id, total_bdt
FROM bookings
WHERE total_bdt > avg(total_bdt) OVER ();`}
              caption="Error: window functions are not allowed in WHERE। WHERE চলে Window এর অনেক আগে, যখন গড়টা হিসাবই হয়নি। একই কারণে HAVING আর GROUP BY তেও Window লেখা যায় না। MySQL এ ERROR 3593: You cannot use the window function 'avg' in this context."
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধানটা Module 07 থেকে আপনার চেনা। Query টাকে দুই তলায় ভাগ করুন। নিচের তলায়, একটা CTE এর ভেতরে, Window
                এর হিসাব শেষ করে মানটাকে একটা নাম দিন। উপরের তলায় সেই নামটা আর Window না, সাধারণ একটা Column। সাধারণ
                Column দিয়ে WHERE লেখা যায়। PostgreSQL এর Docs ও এই পথটাই বলে: Window এর হিসাবের পরে ছাঁকতে হলে একটা
                Sub-select ব্যবহার করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CTE তে Window, বাইরে WHERE"
              query={`WITH with_avg AS (
  SELECT booking_id, customer_id, total_bdt,
         avg(total_bdt) OVER () AS avg_all
  FROM bookings
)
SELECT booking_id, customer_id, total_bdt,
       round(avg_all, 2) AS avg_all
FROM with_avg
WHERE total_bdt > avg_all
ORDER BY total_bdt DESC, booking_id;`}
              caption="১৩টা Row, 50000.00 থেকে 25000.00 পর্যন্ত, প্রতিটার পাশে গড় 24679.17। CTE এর ভেতরে Window শেষ, বাইরের Query এর কাছে avg_all একটা সাধারণ Column। CTE এর বদলে FROM এর ভেতরে Derived Table দিলেও একই কাজ হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা খুঁটিনাটি খেয়াল করুন। CTE এর ভেতরে কোনো WHERE নেই। থাকলে, যেমন{" "}
                <code className={CODE}>WHERE status = &apos;confirmed&apos;</code>, গড়টা শুধু confirmed এর হতো, কারণ Window
                টিকে থাকা Row দেখে। কোন Row গুলোর গড়ের সাথে তুলনা চান, সেই ছাঁকা যায় ভেতরে। গড় হিসাবের পরে কোন Row
                দেখাবেন, সেই ছাঁকা যায় বাইরে। দুই তলার দুই আলাদা কাজ।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ সাতটা জায়গায় Window লেখার চেষ্টা আছে। প্রতিটার জন্য আগে আন্দাজ করুন চলবে কিনা, তারপর
                PostgreSQL আর MySQL এর আসল উত্তর দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PlacementLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  যেসব Booking এ সিট সব Booking এর গড় সিটের চেয়ে বেশি, তাদের <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>seats</code>, booking_id এর ক্রমে। গড় সিট 2.21, তাই 3 বা তার বেশি সিটের Booking
                  গুলো আসবে।
                </>
              }
              hint={
                <>
                  WHERE এ Window চলে না। প্রথমে একটা CTE তে <code className={CODE}>avg(seats) OVER () AS avg_seats</code>,
                  তারপর বাইরে <code className={CODE}>WHERE seats &gt; avg_seats</code>।
                </>
              }
              solution={`WITH s AS (
  SELECT booking_id, seats, avg(seats) OVER () AS avg_seats
  FROM bookings
)
SELECT booking_id, seats
FROM s
WHERE seats > avg_seats
ORDER BY booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "window-clause",
      subHeader: { index: "010", title: "The WINDOW Clause" },
      title: <SectionTitle>Window কে একটা নাম দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ৭ নম্বর অংশের পাঁচটা Window Function এর প্রতিটায় একই <code className={CODE}>OVER ()</code>। এই লেসনে
                বন্ধনী খালি, তাই পুনরাবৃত্তি ছোট। কিন্তু পরের লেসনগুলোতে বন্ধনীর ভেতরে লম্বা লেখা আসবে, যেমন PARTITION BY
                আর ORDER BY। তখন একই লম্বা বর্ণনা পাঁচবার লিখলে ভুলের সুযোগ পাঁচগুণ, ঠিক Module 07 এর CTE লেসনের সমস্যা।
              </ContentParagraph>
              <ContentParagraph>
                এর সমাধান WINDOW Clause। Window এর বর্ণনা একবার লিখে একটা নাম দিন, তারপর প্রতিটা Function এ{" "}
                <code className={CODE}>OVER নাম</code>। WINDOW Clause বসে HAVING এর পরে, ORDER BY এর আগে। একাধিক Window
                থাকলে কমা দিয়ে: <code className={CODE}>WINDOW a AS (...), b AS (...)</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একবার বর্ণনা, চারবার ব্যবহার"
              query={`SELECT booking_id, seats,
       count(*) OVER w   AS bookings,
       sum(seats) OVER w AS all_seats,
       min(seats) OVER w AS fewest,
       max(seats) OVER w AS most
FROM bookings
WINDOW w AS ()
ORDER BY booking_id;`}
              caption="ফলাফল ৭ নম্বর অংশের মতোই, প্রতিটা Row এ 24, 53, 1, 5। খেয়াল করুন OVER w তে বন্ধনী নেই, কারণ বন্ধনীসহ পুরো বর্ণনা w এর ভেতরে। PostgreSQL নিজেও ভেতরে প্রতিটা Window এর একটা নাম রাখে: ৮ নম্বর অংশের Plan এ যে Window: w1 AS () দেখেছেন, সেটাই।"
            />
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
                  প্রতিটা Tour এর <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>, তারপর
                  সব Tour এর মধ্যে সবচেয়ে সস্তা দাম, সবচেয়ে দামি দাম, আর গড় দাম দুই দশমিক পর্যন্ত গোল করে। Window টা{" "}
                  <code className={CODE}>WINDOW w AS ()</code> দিয়ে একবার লিখুন। tour_id এর ক্রমে, নয়টা Row।
                </>
              }
              hint={
                <>
                  তিনটা Function, একই <code className={CODE}>OVER w</code>: min, max আর{" "}
                  <code className={CODE}>round(avg(price_bdt) OVER w, 2)</code>। WINDOW Clause বসবে ORDER BY এর ঠিক আগে।
                </>
              }
              solution={`SELECT title, price_bdt,
       min(price_bdt) OVER w AS cheapest,
       max(price_bdt) OVER w AS dearest,
       round(avg(price_bdt) OVER w, 2) AS avg_price
FROM tours
WINDOW w AS ()
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "after-group-by",
      subHeader: { index: "011", title: "Windows After GROUP BY" },
      title: <SectionTitle>দলের যোগফল, আর সব দলের যোগফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ৮ নম্বর অংশের ছবিতে Window এর হিসাব GROUP BY এর পরে। এর একটা দারুণ ফল আছে: একই Query তে আগে GROUP BY দল
                বানায়, তারপর Window সেই দলের Row গুলোর উপর হিসাব করে। মানে Window তখন আসল চব্বিশটা Booking দেখে না, দেখে
                GROUP BY এর তৈরি করা দলের Row গুলো।
              </ContentParagraph>
              <ContentParagraph>
                মালিকের সবচেয়ে পরিচিত প্রশ্ন এটাই: প্রতিটা status এ কত টাকা, আর সেটা মোটের কত শতাংশ। দলের যোগফল দেয়{" "}
                <code className={CODE}>sum(total_bdt)</code>, এটা Module 05। সব দলের যোগফল দেয় সেই যোগফলগুলোর যোগফল,{" "}
                <code className={CODE}>sum(sum(total_bdt)) OVER ()</code>। ভেতরের sum সাধারণ Aggregate, প্রতিটা দলের। বাইরের
                sum Window, সব দল মিলিয়ে। Window এর ভেতরে Aggregate রাখা চলে, কারণ Aggregate আগে চলে আর Window পরে। উল্টোটা,
                Aggregate এর ভেতরে Window, চলে না, ঠিক এই একই কারণে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ShareOfTotalDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা status এর আয়, মোটের কত ভাগ"
              query={`SELECT status,
       count(*)       AS bookings,
       sum(total_bdt) AS revenue,
       sum(sum(total_bdt)) OVER () AS all_revenue,
       round(100 * sum(total_bdt) / sum(sum(total_bdt)) OVER (), 1) AS pct
FROM bookings
GROUP BY status
ORDER BY revenue DESC;`}
              caption="তিনটা Row: confirmed 423600.00, মোটের 71.5%। pending 117200.00, 19.8%। cancelled 51500.00, 8.7%। all_revenue সব Row এ 592300.00। তিনটা শতাংশ মিলে 100।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই কারণে GROUP BY এর পরে <code className={CODE}>count(*) OVER ()</code> আসল Row না, দল গোনে। নিচের
                Query তে প্রতিটা Departure এর Booking গোনা হয়েছে GROUP BY দিয়ে, আর পাশে count(*) OVER () বলছে মোট কয়টা
                Departure। Booking এর সংখ্যা ২৪, কিন্তু উত্তর আসে ১৬, কারণ Window দেখছে ১৬টা দলের Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY এর পরে count(*) OVER () গোনে দল"
              query={`SELECT d.departure_id,
       count(b.booking_id) AS bookings,
       count(*) OVER ()    AS departures
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY d.departure_id
ORDER BY d.departure_id;`}
              caption="১৬টা Row, প্রতিটা Departure একটা। departures Column সব Row এ 16। Departure 16 এর কোনো Booking নেই, তাই bookings 0, তবু সে একটা দল, তাই গোনায় আছে (LEFT JOIN, Module 06)।"
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
                  <code className={CODE}>payments</code> Table থেকে প্রতিটা Payment Method এর জন্য একটা Row:{" "}
                  <code className={CODE}>method</code>, কয়টা Payment, আর সব Payment এর কত শতাংশ এই Method এর, এক দশমিক
                  পর্যন্ত গোল করে। চারটা Row, bkash আর card এর পাশে 36.8।
                </>
              }
              hint={
                <>
                  GROUP BY method, তারপর <code className={CODE}>round(100.0 * count(*) / sum(count(*)) OVER (), 1)</code>।
                  count পূর্ণসংখ্যা, তাই 100.0।
                </>
              }
              solution={`SELECT method, count(*) AS payments,
       round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct
FROM payments
GROUP BY method;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "peek-inside-over",
      subHeader: { index: "012", title: "A Peek Inside OVER" },
      title: <SectionTitle>বন্ধনীর ভেতরে কী বসবে, এক ঝলক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসন জুড়ে বন্ধনী খালি ছিল। শেষ করার আগে এক ঝলক দেখে নিন বন্ধনীর ভেতরে কিছু লিখলে কী বদলায়, কারণ
                পরের লেসনগুলো ঠিক এখান থেকেই শুরু। <code className={CODE}>OVER (PARTITION BY status)</code> লিখলে প্রতিটা
                Row এর Window হয় শুধু একই status এর Row গুলো। <code className={CODE}>OVER (ORDER BY booking_id)</code> লিখলে
                প্রতিটা Row এর Window হয় শুরু থেকে এই Row পর্যন্ত, আর sum হয়ে যায় চলমান যোগফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পরের লেসনগুলোর এক ঝলক"
              query={`SELECT booking_id, status, total_bdt,
       round(avg(total_bdt) OVER (PARTITION BY status), 2) AS avg_in_status,
       sum(total_bdt) OVER (ORDER BY booking_id)           AS running_total
FROM bookings
ORDER BY booking_id;`}
              caption="Booking 1 থেকে 4 confirmed, তাদের avg_in_status 24917.65। Booking 5 cancelled, তার 17166.67। এখন প্রতিটা Row এর উত্তর আলাদা হতে পারে। running_total: 25000.00, 75000.00, 87500.00, 113000.00, প্রতিটা Row এ আগের সবগুলোর যোগফল। এগুলো এই লেসনের বিষয় না, শুধু দরজাটা খুলে রাখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  ORDER BY দিয়ে ক্রমিক নম্বর আর র‍্যাংক:{" "}
                  <Link href="/sql/topic/ranking-functions" className={LINK}>
                    ROW_NUMBER, RANK and DENSE_RANK
                  </Link>
                </ListItem>
                <ListItem>
                  প্রতিটা দলের ভেতরে আলাদা Window:{" "}
                  <Link href="/sql/topic/partition-by" className={LINK}>
                    PARTITION BY
                  </Link>
                </ListItem>
                <ListItem>
                  চলমান যোগফল আর Window এর সীমানা:{" "}
                  <Link href="/sql/topic/running-totals-frames" className={LINK}>
                    Running Totals and Window Frames
                  </Link>
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Window Function</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Window Function এসেছে 8.0 তে। MySQL এর নিজের What Is New in MySQL 8.0 পাতায় লেখা আছে, MySQL এখন
                Window Function সমর্থন করে, আর SUM, AVG এর মতো আগের কয়েকটা Aggregate এখন Window Function হিসেবেও চলে। তাই
                8.0 এর আগের MySQL এ, যেমন 5.7 এ, Window Function নেই, আর OVER লেখা Query সেখানে চলে না। পুরনো অনেক
                Tutorial এ যে @rank এর মতো Variable দিয়ে জটিল কৌশল দেখা যায়, সেগুলো এই অভাব পূরণের জন্য ছিল। MySQL 8.4 এ
                এই লেসনের Window এর Query গুলো প্রায় হুবহু চলে। ব্যতিক্রম শুধু PostgreSQL এর নিজের দুটো জিনিস: FILTER (Project
                Example এ আছে) আর EXPLAIN (COSTS OFF)।
              </ContentParagraph>
              <ContentParagraph>
                তফাত চারটা, চারটাই MySQL 8.4.11 এ চালিয়ে দেখা। এক, গড়ের দশমিক: PostgreSQL দেখায় 24679.166666666667,
                MySQL দেখায় 24679.166667। round(..., 2) দিলে দুটোই 24679.17। দুই, MySQL এ / সবসময় দশমিক ভাগ, তাই ৪ নম্বর
                অংশের পূর্ণসংখ্যার ফাঁদ সেখানে নেই: 100 * seats / SUM(seats) OVER () দেয় 3.7736। তিন, ভুল জায়গায় Window
                লিখলে MySQL এর বার্তা একটাই, ERROR 3593, যেখানে PostgreSQL বলে ঠিক কোন Clause এ সমস্যা। চার, Window এর ভেতরে
                DISTINCT এর বার্তা ERROR 1235।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-window.sql",
          code: `-- MySQL 8.4.11, island_tours (MySQL সংস্করণ) এ চালানো
SELECT booking_id, total_bdt,
       AVG(total_bdt) OVER () AS avg_all,
       ROUND(AVG(total_bdt) OVER (), 2) AS r
FROM bookings ORDER BY booking_id LIMIT 3;
-- 1 | 25000.00 | 24679.166667 | 24679.17
-- 2 | 50000.00 | 24679.166667 | 24679.17
-- 3 | 12500.00 | 24679.166667 | 24679.17

-- WINDOW Clause আর GROUP BY এর পরে Window, দুটোই একই রকম চলে
SELECT status, SUM(total_bdt) AS revenue,
       ROUND(100 * SUM(total_bdt) / SUM(SUM(total_bdt)) OVER (), 1) AS pct
FROM bookings GROUP BY status ORDER BY revenue DESC;
-- confirmed 423600.00 71.5 | pending 117200.00 19.8 | cancelled 51500.00 8.7

SELECT booking_id FROM bookings WHERE total_bdt > AVG(total_bdt) OVER ();
-- ERROR 3593 (HY000): You cannot use the window function 'avg' in this context.'

SELECT COUNT(DISTINCT customer_id) OVER () FROM bookings;
-- ERROR 1235 (42000): This version of MySQL doesn't yet support
-- '<window function>(DISTINCT ..)'`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Tour এর আয়ের বোর্ড</SectionTitle>,
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
                Island Tours এর Admin Panel এ মালিকের জন্য একটা বোর্ড বানানো হবে। প্রতিটা Tour একটা লাইনে, নয়টাই, এমনকি যে
                Tour এ এখনো কোনো confirmed আয় নেই সেটাও। প্রতিটা লাইনে Tour এর confirmed আয়, সব Tour এর মোট আয়ের কত ভাগ
                এই Tour এর, আর সব Tour এর গড় আয় থেকে এই Tour কত উপরে বা নিচে। মালিক এক নজরে দেখতে চান কোন Tour টানছে আর
                কোনটা পিছিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম এবার কাজটা দুই ধাপে ভাবলেন। প্রথম ধাপ Module 05 আর 06 এর জিনিস: LEFT JOIN দিয়ে সব Tour রাখা, GROUP BY
                দিয়ে Tour প্রতি confirmed আয়। সেটা একটা CTE তে, যাতে দ্বিতীয় ধাপ পরিষ্কার থাকে। দ্বিতীয় ধাপ এই লেসনের:
                প্রতিটা Tour এর Row রেখে পাশে সব Tour এর মোট আর গড়, Window দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground title="মালিকের Tour বোর্ড" query={TOUR_REPORT} caption="নয়টা Row। Saint Martin Island Escape সবার উপরে, 125000.00, মোটের 29.5%, গড়ের 77933.33 উপরে। শেষের দুটো, Family Package আর Luxury Stay, 0.00 আয়, 0.0%, গড়ের 47066.67 নিচে। গড় আয় 47066.67 = 423600.00 / 9, কারণ শূন্য আয়ের Tour গুলোও গড়ে গোনা হয়েছে। এই সিদ্ধান্তটা ইচ্ছাকৃত: বোর্ডে যে Tour দেখা যায়, গড়েও সে থাকে।" />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সিদ্ধান্ত খেয়াল করার মতো। গড় হয়েছে নয়টা Tour এর, শূন্য আয়ের দুটো সহ। ফারুক সাহেব যদি শুধু বিক্রি
                হওয়া Tour গুলোর গড় চাইতেন, তাহলে বাইরের Query তে <code className={CODE}>WHERE revenue &gt; 0</code> দিলে চলত
                না, কারণ WHERE Window এর আগে চলে আর Row কমিয়ে দেয়, তাতে বোর্ড থেকে শূন্যের Tour গুলোই হারিয়ে যেত। এর
                সঠিক উত্তর Module 05 এর FILTER, যেটা Window Aggregate এর সাথেও চলে:{" "}
                <code className={CODE}>avg(revenue) FILTER (WHERE revenue &gt; 0) OVER ()</code>। এটা দেয় 60514.29, শুধু
                বিক্রি হওয়া সাতটা Tour এর গড়, অথচ বোর্ডে নয়টা Tour ই থাকে। MySQL এ FILTER নেই, সেখানে একই কাজ করে{" "}
                <code className={CODE}>AVG(CASE WHEN revenue &gt; 0 THEN revenue END) OVER ()</code>।
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
                  ফারুক সাহেব শুধু confirmed Booking গুলোর মধ্যে তুলনা চান। confirmed Booking গুলোর গড়ের নিচে যেগুলো, তাদের{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>total_bdt</code>, আর গড় থেকে কত নিচে{" "}
                  (<code className={CODE}>below_by</code>, দুই দশমিক পর্যন্ত, ধনাত্মক সংখ্যা)। সবচেয়ে বেশি নিচে যেটা সেটা
                  আগে, সমান হলে booking_id এর ক্রমে। গড় হতে হবে শুধু confirmed Booking এর।
                </>
              }
              hint={
                <>
                  কোন Row গুলোর গড়, সেই ছাঁকা ভেতরে: CTE তে <code className={CODE}>WHERE status = &apos;confirmed&apos;</code>{" "}
                  আর <code className={CODE}>avg(total_bdt) OVER ()</code>। কোন Row দেখাবেন, সেই ছাঁকা বাইরে:{" "}
                  <code className={CODE}>WHERE total_bdt &lt; avg_confirmed</code>। below_by = গড় বিয়োগ total_bdt।
                </>
              }
              solution={`WITH confirmed AS (
  SELECT booking_id, total_bdt,
         avg(total_bdt) OVER () AS avg_confirmed
  FROM bookings
  WHERE status = 'confirmed'
)
SELECT booking_id, total_bdt,
       round(avg_confirmed - total_bdt, 2) AS below_by
FROM confirmed
WHERE total_bdt < avg_confirmed
ORDER BY below_by DESC, booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Window দিয়ে একটা প্রশ্নের উত্তর লেখার ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "উত্তরে কয়টা Row, আগে ঠিক করুন",
              description:
                "প্রতিটা Booking এর লাইন চাই, নাকি প্রতিটা দলের? প্রতিটা Booking এর লাইন আর পাশে বড় হিসাব চাইলে Window। দলপ্রতি এক লাইন চাইলে GROUP BY।",
            },
            {
              title: "চেনা Aggregate টা লিখুন, পরে OVER ()",
              description:
                "গড় হলে avg, মোট হলে sum, গোনা হলে count(*)। তার ঠিক পরে OVER ()। খালি বন্ধনী মানে ফলাফলের সব Row মিলে একটাই Window।",
            },
            {
              title: "Window কোন Row দেখবে, সেটা WHERE ঠিক করে",
              description:
                "WHERE আগে চলে। শুধু confirmed এর গড় চাইলে WHERE status = 'confirmed'। সব Booking এর গড় চাইলে WHERE বাদ।",
            },
            {
              title: "মানটা দিয়ে হিসাব আর round",
              description:
                "দূরত্ব হলে বিয়োগ, শতাংশ হলে ভাগ গুণ ১০০। পূর্ণসংখ্যার Column হলে 100.0 দিয়ে শুরু। দেখানোর জন্য round(..., 2)।",
            },
            {
              title: "Window দিয়ে ছাঁকতে হলে দুই তলা",
              description:
                "WHERE, GROUP BY আর HAVING এ Window চলে না। ভেতরে CTE তে Window এর হিসাব আর একটা নাম, বাইরে সেই নাম দিয়ে WHERE।",
            },
            {
              title: "একই Window বারবার হলে নাম দিন",
              description:
                "WINDOW w AS (...) একবার, প্রতিটা Function এ OVER w। শেষে ORDER BY, সমান হলে একটা অনন্য Column দিয়ে দ্বিতীয় সাজানো।",
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
            [
              "OVER লিখতে ভুলে যাওয়া",
              "column must appear in the GROUP BY clause, কারণ avg আবার Row ভাঁজ করতে চায়",
              "avg(total_bdt) OVER ()",
            ],
            [
              "WHERE এ Window লেখা",
              "window functions are not allowed in WHERE",
              "CTE তে Window, বাইরে WHERE",
            ],
            [
              "ভাবা যে WHERE এর পরেও Window সব Row দেখে",
              "গড় চুপচাপ শুধু টিকে থাকা Row এর হয়, Error ছাড়াই",
              "কোন Row এর গড় চাই, সেটা ভেবে WHERE লিখুন",
            ],
            [
              "ভাবা যে LIMIT দিলে Window কম Row দেখে",
              "LIMIT 3 তেও গড় সব Row এর, কারণ LIMIT পরে চলে",
              "অল্প Row এর হিসাব চাইলে আগে CTE তে LIMIT, পরে Window",
            ],
            [
              "Window এর ভেতরে DISTINCT",
              "DISTINCT is not implemented for window functions",
              "Scalar Subquery বা CTE তে আলাদা করে গোনা",
            ],
            [
              "পূর্ণসংখ্যা দিয়ে শতাংশ",
              "100 * seats / sum(seats) OVER () দেয় 3, আসল 3.8",
              "100.0 * seats দিয়ে শুরু",
            ],
            [
              "সব Row এর মোট চেয়ে OVER (ORDER BY ...) লেখা",
              "মোটের বদলে চলমান যোগফল আসে: 25000.00, 75000.00, 87500.00",
              "সব Row এর মোট চাইলে বন্ধনী খালি, OVER ()",
            ],
            [
              "Aggregate এর ভেতরে Window",
              "aggregate function calls cannot contain window function calls",
              "উল্টোটা চলে: sum(sum(x)) OVER ()",
            ],
          ],
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
                    href="https://www.postgresql.org/docs/current/tutorial-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Window Functions
                  </a>
                  : ছোট আর পরিষ্কার পরিচিতি। Window Function কোথায় লেখা যায় আর ছাঁকতে হলে Sub-select, এই লেসনের দুটো
                  নিয়মই এখান থেকে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Value Expressions, Window Function Calls অংশ
                  </a>
                  : OVER এর পুরো Syntax, বন্ধনীর ভেতরে কী কী বসতে পারে তার আনুষ্ঠানিক বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Functions তালিকা
                  </a>
                  : row_number থেকে nth_value পর্যন্ত শুধু Window এর জন্য তৈরি Function গুলোর তালিকা, এই মডিউলের পরের
                  লেসনগুলোর জন্য হাতের কাছে রাখুন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Function Concepts and Syntax
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা, উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-functions-named-windows.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Named Windows
                  </a>
                  : MySQL এ WINDOW Clause এর নিয়ম।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনি যে MySQL ভিডিও কোর্সটা দেখছেন, তার বিষয়ের তালিকায় Window Function নেই। এই মডিউলটা সেই জায়গা পূরণ
                করবে, আর Interview এ এটাই সবচেয়ে বেশি জিজ্ঞেস করা অংশগুলোর একটা।
              </ContentParagraph>
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
                  Window Function অনেক Row দেখে হিসাব করে, কিন্তু Row ভাঁজ করে না। প্রতিটা Row থাকে, পাশে উত্তর বসে।
                  GROUP BY এর সাথে মূল তফাত ফলাফলের Row সংখ্যায়।
                </ListItem>
                <ListItem>
                  চেনা Aggregate এর পরে OVER দিলেই Window Function। বন্ধনী খালি মানে ফলাফলের সব Row মিলে একটা Window, তাই
                  প্রতিটা Row এর পাশে একই উত্তর।
                </ListItem>
                <ListItem>
                  Window এর মান সাধারণ সংখ্যা: বিয়োগ করে গড় থেকে দূরত্ব, ভাগ করে শতাংশ। পূর্ণসংখ্যার ভাগে 100.0।
                </ListItem>
                <ListItem>
                  Window এর হিসাব হয় WHERE, GROUP BY আর HAVING এর পরে, ORDER BY আর LIMIT এর আগে। তাই WHERE Window এর আকার
                  বদলায়, LIMIT বদলায় না, আর ORDER BY তে Window এর মান ব্যবহার করা যায়।
                </ListItem>
                <ListItem>
                  WHERE, GROUP BY আর HAVING এ Window লেখা যায় না। Window দিয়ে ছাঁকতে হলে দুই তলা: CTE তে হিসাব, বাইরে
                  WHERE।
                </ListItem>
                <ListItem>WINDOW w AS (...) দিয়ে একই Window এর বর্ণনা একবার লিখে বারবার OVER w।</ListItem>
                <ListItem>
                  GROUP BY এর পরে Window দলের Row দেখে। sum(sum(x)) OVER () দেয় সব দলের মোট, আর তা দিয়ে প্রতিটা দলের ভাগ।
                </ListItem>
                <ListItem>
                  Window এর ভেতরে DISTINCT চলে না, আর Aggregate এর ভেতরে Window চলে না। MySQL 8.0 থেকে Window Function,
                  আচরণ প্রায় একই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা Window এর বন্ধনী খালি ছিল, তাই প্রতিটা Row একই জিনিস দেখেছে। পরের লেসনে বন্ধনীর ভেতরে
                প্রথম জিনিসটা বসবে, ORDER BY। তখন প্রতিটা Row জানবে সারিতে সে কত নম্বরে আছে, আর সমান মানের Row গুলো একই
                নম্বর পাবে কিনা, সেটাই তিনটা আলাদা Function এর তফাত। পরের লেসন{" "}
                <Link href="/sql/topic/ranking-functions" className={LINK}>
                  ROW_NUMBER, RANK and DENSE_RANK
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
      ["Window", "যে Row গুলো দেখে একটা Row এর হিসাব হয়", "OVER () তে ২৪টা Booking এর সবগুলো"],
      ["Window Function", "Aggregate এর মতো হিসাব, কিন্তু Row রাখে", "avg(total_bdt) OVER () = 24679.166666666667"],
      ["OVER ()", "খালি বন্ধনী মানে ফলাফলের সব Row", "২৪টা Row এর প্রতিটায় একই গড়"],
      ["GROUP BY বনাম Window", "দলপ্রতি এক Row বনাম প্রতিটা Row", "status এ ৩টা Row, Window এ ২৪টা"],
      ["গড় থেকে দূরত্ব", "total বিয়োগ গড়, বা গড়ের শতাংশ", "Booking 2: +25320.83, 202.6%"],
      ["পূর্ণসংখ্যার শতাংশ", "100.0 দিয়ে শুরু, নইলে দশমিক হারায়", "Booking 1 এর সিট: 3 বনাম 3.8"],
      ["WHERE আগে", "Window শুধু টিকে থাকা Row দেখে", "confirmed এর গড় 24917.65"],
      ["LIMIT পরে", "LIMIT দেখানো কমায়, Window কমায় না", "LIMIT 3 তেও গড় 24679.17"],
      ["Window দিয়ে ছাঁকা", "WHERE এ Error, CTE তে মুড়ে বাইরে WHERE", "গড়ের উপরে ১৩টা Booking"],
      ["WINDOW Clause", "Window এর নাম, একবার লিখে বারবার OVER w", "count, sum, min, max একই w তে"],
      ["GROUP BY এর পরে Window", "sum(sum(x)) OVER () সব দলের মোট", "confirmed 71.5%, pending 19.8%, cancelled 8.7%"],
      ["যা চলে না", "Window এ DISTINCT, Aggregate এর ভেতরে Window", "count(DISTINCT customer_id) OVER () এ Error"],
      ["MySQL", "8.0 থেকে, ভুল জায়গায় ERROR 3593", "গড় দেখায় 24679.166667"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "bookings Table এ ২৪টা Row। SELECT booking_id, avg(total_bdt) OVER () FROM bookings; কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "১টা, কারণ avg একটাই উত্তর দেয়",
            isCorrect: false,
            explanation: "OVER ছাড়া avg একটা Row দিত। OVER থাকায় avg আর Row ভাঁজ করে না।",
          },
          {
            key: "B",
            text: "২৪টা, প্রতিটার পাশে একই গড়",
            isCorrect: true,
            explanation:
              "ঠিক। Window Function Row সংখ্যা বদলায় না। খালি বন্ধনীর Window সব Row, তাই প্রতিটা Row এর পাশে একই গড় 24679.166666666667।",
          },
          {
            key: "C",
            text: "৩টা, প্রতিটা status এর জন্য একটা",
            isCorrect: false,
            explanation: "Query তে GROUP BY status বা PARTITION BY status কিছুই নেই, তাই দল তৈরি হয় না।",
          },
          {
            key: "D",
            text: "Error, কারণ booking_id GROUP BY তে নেই",
            isCorrect: false,
            explanation: "এই Error আসে OVER ছাড়া avg লিখলে। OVER থাকলে booking_id এর পাশে গড় বসানোয় কোনো বাধা নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "SELECT booking_id, avg(total_bdt) OVER () FROM bookings WHERE status = 'confirmed'; এ প্রতিটা Row এর পাশে কোন গড় আসবে?",
        options: [
          {
            key: "A",
            text: "সব ২৪টা Booking এর গড়, 24679.17",
            isCorrect: false,
            explanation: "WHERE চলে Window এর আগে, তাই Window শুধু টিকে থাকা ১৭টা Row দেখে।",
          },
          {
            key: "B",
            text: "শুধু confirmed ১৭টা Booking এর গড়, 24917.65",
            isCorrect: true,
            explanation: "ঠিক। WHERE আগে Row ছাঁকে, Window সেই ১৭টা Row এর উপর হিসাব করে।",
          },
          {
            key: "C",
            text: "প্রতিটা Row এর নিজের total_bdt",
            isCorrect: false,
            explanation: "খালি বন্ধনীর Window সব টিকে থাকা Row নিয়ে, একটা Row নিয়ে না।",
          },
          {
            key: "D",
            text: "Error, কারণ WHERE আর Window একসাথে চলে না",
            isCorrect: false,
            explanation: "WHERE এর ভেতরে Window লেখা যায় না, কিন্তু একই Query তে WHERE আর SELECT এ Window থাকতে কোনো বাধা নেই।",
          },
        ],
      },
      {
        id: 3,
        text: "WHERE total_bdt > avg(total_bdt) OVER () কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "কারণ avg এর সাথে > তুলনা করা যায় না",
            isCorrect: false,
            explanation: "তুলনায় কোনো সমস্যা নেই। সমস্যা সময়ের: WHERE এর সময় গড়ের মানই তৈরি হয়নি।",
          },
          {
            key: "B",
            text: "কারণ WHERE চলে Window এর আগে, তখনো Window এর মান হিসাব হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। Window এর হিসাব হয় WHERE, GROUP BY আর HAVING এর পরে। PostgreSQL বলে window functions are not allowed in WHERE।",
          },
          {
            key: "C",
            text: "কারণ OVER () এর বন্ধনী খালি",
            isCorrect: false,
            explanation: "বন্ধনী ভরা থাকলেও একই Error। জায়গাটাই নিষিদ্ধ, বন্ধনী নয়।",
          },
          {
            key: "D",
            text: "কারণ total_bdt numeric, আর Window শুধু integer এ চলে",
            isCorrect: false,
            explanation: "Window Function numeric এ দিব্যি চলে, এই লেসনের প্রায় সব উদাহরণই numeric এর উপর।",
          },
        ],
      },
      {
        id: 4,
        text: "গড়ের উপরের Booking গুলো দেখাতে কোন পথটা ঠিক?",
        options: [
          {
            key: "A",
            text: "HAVING total_bdt > avg(total_bdt) OVER ()",
            isCorrect: false,
            explanation: "HAVING ও Window এর আগে চলে, তাই window functions are not allowed in HAVING।",
          },
          {
            key: "B",
            text: "CTE তে avg(total_bdt) OVER () AS avg_all, বাইরে WHERE total_bdt > avg_all",
            isCorrect: true,
            explanation:
              "ঠিক। ভেতরের তলায় Window এর হিসাব শেষ, বাইরের তলায় avg_all একটা সাধারণ Column। ফলাফল ১৩টা Booking।",
          },
          {
            key: "C",
            text: "GROUP BY booking_id দিয়ে, তারপর WHERE",
            isCorrect: false,
            explanation: "প্রতিটা Booking একটা দল হলে গড়টা সেই একটা Booking এরই, সবার না। আর WHERE তো GROUP BY এর আগেই চলে।",
          },
          {
            key: "D",
            text: "LIMIT দিয়ে উপরের অর্ধেক নেওয়া",
            isCorrect: false,
            explanation: "গড়ের উপরের Booking এর সংখ্যা অর্ধেক হবে এমন কোনো নিয়ম নেই। এখানে ২৪টার মধ্যে ১৩টা।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT booking_id, avg(total_bdt) OVER () FROM bookings ORDER BY booking_id LIMIT 3; এর গড় কোন Row গুলোর?",
        options: [
          {
            key: "A",
            text: "প্রথম তিনটা Booking এর",
            isCorrect: false,
            explanation: "LIMIT চলে Window এর পরে। Window আগেই সব Row দেখে নিয়েছে।",
          },
          {
            key: "B",
            text: "সব ২৪টা Booking এর",
            isCorrect: true,
            explanation: "ঠিক। LIMIT শুধু কয়টা Row দেখানো হবে সেটা ঠিক করে, Window কী দেখবে সেটা না। গড় 24679.17।",
          },
          {
            key: "C",
            text: "তিনটা Row এর প্রতিটার নিজের মান",
            isCorrect: false,
            explanation: "খালি বন্ধনীর Window একটা Row এর হয় না।",
          },
          {
            key: "D",
            text: "Error, LIMIT আর Window একসাথে চলে না",
            isCorrect: false,
            explanation: "দুটো একসাথে দিব্যি চলে, ৮ নম্বর অংশের বক্সেই চলেছে।",
          },
        ],
      },
      {
        id: 6,
        text: "প্রতিটা status এর আয় মোটের কত শতাংশ, এক Query তে। কোন অংশটা মোট দেয়?",
        options: [
          {
            key: "A",
            text: "sum(total_bdt)",
            isCorrect: false,
            explanation: "GROUP BY status থাকায় এটা প্রতিটা দলের নিজের যোগফল, মোট না।",
          },
          {
            key: "B",
            text: "sum(sum(total_bdt)) OVER ()",
            isCorrect: true,
            explanation:
              "ঠিক। ভেতরের sum প্রতিটা দলের, বাইরের sum Window, যেটা GROUP BY এর পরে সব দলের যোগফলগুলো যোগ করে: 592300.00।",
          },
          {
            key: "C",
            text: "sum(sum(total_bdt)) OVER (PARTITION BY status)",
            isCorrect: false,
            explanation:
              "PARTITION BY status মানে প্রতিটা status এর আলাদা Window। GROUP BY এর পরে প্রতিটা status এর Row একটাই, তাই উত্তর আসে দলের নিজের যোগফল, মোট না।",
          },
          {
            key: "D",
            text: "count(*) OVER ()",
            isCorrect: false,
            explanation: "GROUP BY এর পরে এটা দল গোনে, এখানে 3, টাকার মোট না।",
          },
        ],
      },
      {
        id: 7,
        text: "count(DISTINCT customer_id) OVER () চালালে PostgreSQL কী বলে?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Row এর পাশে 14",
            isCorrect: false,
            explanation: "ফলাফলটা যুক্তিসঙ্গত হতো, কিন্তু PostgreSQL এখনো এটা সমর্থন করে না।",
          },
          {
            key: "B",
            text: "DISTINCT is not implemented for window functions",
            isCorrect: true,
            explanation: "ঠিক। আলাদা Customer গোনা পাশে চাইলে Scalar Subquery: (SELECT count(DISTINCT customer_id) FROM bookings)।",
          },
          {
            key: "C",
            text: "প্রতিটা Row এর পাশে 24",
            isCorrect: false,
            explanation: "24 হলো সব Booking এর সংখ্যা, আলাদা Customer না, আর এই Query তো চলেই না।",
          },
          {
            key: "D",
            text: "Syntax Error, কারণ DISTINCT শুধু SELECT এর শুরুতে বসে",
            isCorrect: false,
            explanation: "DISTINCT সাধারণ Aggregate এর ভেতরে দিব্যি বসে, যেমন count(DISTINCT customer_id)। সীমাটা শুধু Window এর বেলায়।",
          },
        ],
      },
      {
        id: 8,
        text: "এক Query তে চারটা Window Function, চারটার বন্ধনীতেই হুবহু একই লম্বা বর্ণনা। কোনটা সবচেয়ে ভালো অভ্যাস?",
        options: [
          {
            key: "A",
            text: "চারবারই পুরো বর্ণনা লেখা",
            isCorrect: false,
            explanation: "চলবে, কিন্তু একটা বদলাতে গিয়ে বাকিগুলো ভুলে যাওয়ার সুযোগ চারগুণ।",
          },
          {
            key: "B",
            text: "WINDOW w AS (...) একবার, চারটায় OVER w",
            isCorrect: true,
            explanation: "ঠিক। WINDOW Clause বসে HAVING এর পরে, ORDER BY এর আগে। PostgreSQL আর MySQL দুটোতেই চলে।",
          },
          {
            key: "C",
            text: "চারটা আলাদা CTE",
            isCorrect: false,
            explanation: "কাজ হবে, কিন্তু অকারণে Query লম্বা আর ধীর। একই Window এর জন্য একটা নামই যথেষ্ট।",
          },
          {
            key: "D",
            text: "GROUP BY দিয়ে একবারে হিসাব",
            isCorrect: false,
            explanation: "GROUP BY Row ভাঁজ করবে, অথচ প্রশ্নটা ছিল প্রতিটা Row রেখে পাশে হিসাব।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Customer দের খাতায় নম্বর আর গড়",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুই পথে একই উত্তর:</strong> প্রতিটা Payment এর পাশে সব Payment এর গড় amount_bdt, একবার Module 07 এর Scalar
        Subquery দিয়ে, একবার Window দিয়ে। দুটোর ফলাফল হুবহু মেলে দেখান, আর কোনটা পড়তে সহজ লিখুন।
      </span>,
      <span key="2">
        <strong>Customer দের খরচের বোর্ড:</strong> প্রথমে প্রতিটা Customer এর বাতিল নয় এমন Booking এর মোট খরচ, একটা CTE তে।
        তারপর প্রতিটা Customer এর পাশে সবার মোট খরচের কত শতাংশ তাঁর, আর সবার গড় খরচ থেকে কত দূরে। যিনি কিছুই বুক
        করেননি, তিনিও যেন থাকেন।
      </span>,
      <span key="3">
        <strong>গড়ের উপরের Customer:</strong> Task 2 এর ফলাফল থেকে শুধু গড়ের উপরের Customer গুলো দেখান, দুই তলার নিয়মে।
        গড়টা কি সব Customer এর, নাকি শুধু যাঁরা বুক করেছেন তাঁদের? সিদ্ধান্তটা এক লাইনে লিখুন।
      </span>,
      <span key="4">
        <strong>WHERE আর LIMIT এর পরীক্ষা:</strong> একই Window Query তিনভাবে চালান: কিছু ছাড়া, WHERE status =
        &apos;pending&apos; দিয়ে, আর LIMIT 2 দিয়ে। তিনটা গড় লিখে রাখুন আর প্রতিটা কেন এমন, এক লাইনে ব্যাখ্যা করুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> পরীক্ষার খাতায় নিজের নম্বরের পাশে ক্লাসের গড় লেখার উদাহরণ দিয়ে একজন বন্ধুকে
        বোঝান GROUP BY আর Window Function এর তফাত কী, আর কেন WHERE এ Window লেখা যায় না।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুটো Query, মিলে যাওয়ার প্রমাণ, আর এক লাইনের মতামত</span>,
      <span key="d2">Customer বোর্ডের পুরো Query আর ১৫টা Row এর ফলাফল</span>,
      <span key="d3">গড়ের উপরের Customer এর Query, ফলাফল আর গড়ের সিদ্ধান্ত</span>,
      <span key="d4">তিনটা গড় আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Window Function",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম Window",
        description:
          "প্রথম ফাইল চালান। ২৪টা Row, প্রতিটার পাশে 24679.17 আর গড় থেকে দূরত্ব। Booking 1 এর পাশে 320.83।",
      },
      {
        title: "GROUP BY বনাম Window",
        description: "দ্বিতীয় ফাইলের দুটো Query। প্রথমটা ৩টা Row, দ্বিতীয়টা ২৪টা। Row সংখ্যা লিখে রাখুন।",
      },
      {
        title: "WHERE আগে, LIMIT পরে",
        description: "তৃতীয় ফাইল। confirmed এর গড় 24917.65, LIMIT 3 এর পরেও গড় 24679.17।",
      },
      {
        title: "চেনা Error",
        description:
          "চতুর্থ ফাইলের তিনটা Query একটা একটা চালান। প্রতিটার Error এর প্রথম লাইন ফাইলের মন্তব্যের সাথে মিলিয়ে নিন।",
      },
      {
        title: "দুই তলায় ছাঁকা",
        description: "পঞ্চম ফাইলে CTE তে Window, বাইরে WHERE। ১৩টা Row আসার কথা।",
      },
      {
        title: "মোটের কত ভাগ",
        description: "ষষ্ঠ ফাইলে GROUP BY এর পরে Window। তিনটা Row, শতাংশ 71.5, 19.8 আর 8.7।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-window.sql",
        code: `SELECT booking_id, total_bdt,
       round(avg(total_bdt) OVER (), 2)             AS avg_all,
       round(total_bdt - avg(total_bdt) OVER (), 2) AS diff
FROM bookings
ORDER BY booking_id;
-- (24 rows)
-- 1 | 25000.00 | 24679.17 |    320.83
-- 2 | 50000.00 | 24679.17 |  25320.83
-- 3 | 12500.00 | 24679.17 | -12179.17`,
      },
      {
        language: "sql",
        filename: "02-group-by-vs-window.sql",
        code: `SELECT status, count(*), sum(total_bdt)
FROM bookings GROUP BY status ORDER BY status;
-- (3 rows)
-- cancelled 3 51500.00 | confirmed 17 423600.00 | pending 4 117200.00

SELECT booking_id, status, count(*) OVER (), sum(total_bdt) OVER ()
FROM bookings ORDER BY booking_id;
-- (24 rows), প্রতিটায় 24 আর 592300.00`,
      },
      {
        language: "sql",
        filename: "03-where-before-limit-after.sql",
        code: `SELECT booking_id, round(avg(total_bdt) OVER (), 2) AS avg_seen
FROM bookings WHERE status = 'confirmed' ORDER BY booking_id;
-- (17 rows), avg_seen 24917.65

SELECT booking_id, round(avg(total_bdt) OVER (), 2) AS avg_seen
FROM bookings ORDER BY booking_id LIMIT 3;
-- (3 rows), avg_seen 24679.17`,
      },
      {
        language: "sql",
        filename: "04-familiar-errors.sql",
        code: `SELECT booking_id, total_bdt, avg(total_bdt) FROM bookings;
-- ERROR:  column "bookings.booking_id" must appear in the GROUP BY
--         clause or be used in an aggregate function

SELECT booking_id FROM bookings WHERE total_bdt > avg(total_bdt) OVER ();
-- ERROR:  window functions are not allowed in WHERE

SELECT count(DISTINCT customer_id) OVER () FROM bookings;
-- ERROR:  DISTINCT is not implemented for window functions`,
      },
      {
        language: "sql",
        filename: "05-filter-in-two-floors.sql",
        code: `WITH with_avg AS (
  SELECT booking_id, total_bdt, avg(total_bdt) OVER () AS avg_all
  FROM bookings
)
SELECT booking_id, total_bdt
FROM with_avg
WHERE total_bdt > avg_all
ORDER BY total_bdt DESC, booking_id;
-- (13 rows), প্রথম তিনটা: 2, 14, 23`,
      },
      {
        language: "sql",
        filename: "06-share-of-total.sql",
        code: `SELECT status,
       sum(total_bdt) AS revenue,
       round(100 * sum(total_bdt) / sum(sum(total_bdt)) OVER (), 1) AS pct
FROM bookings
GROUP BY status
ORDER BY revenue DESC;
-- (3 rows)
-- confirmed 423600.00 71.5 | pending 117200.00 19.8 | cancelled 51500.00 8.7`,
      },
    ],
  },
};
