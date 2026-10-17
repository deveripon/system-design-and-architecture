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
  ExpressionLab,
  InstallmentLab,
  RoundingLab,
} from "../../../components/course/topics/functions/num-animations";
import {
  DivisionTypeGridDiagram,
  ExactVsApproxSplit,
  PrecedenceTreeSplit,
  RoundingNumberLineDiagram,
  SharingMangoesDiagram,
} from "../../../components/course/topics/functions/num-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em]";

export const numericFunctionsContent: TopicData = {
  id: "numeric-functions",
  introduction: {
    badge: "MODULE 04 · LESSON 02",
    title: <SectionTitle>সংখ্যার হিসাব, আর integer ভাগের ফাঁদ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর হিসাব দেখেন রুমানা আপা। মাসের শুরুতে তিনি নতুন Developer সাকিবকে
          পাঁচটা কাজ দিলেন: Website এ প্রতিটা ট্যুরের দিনপ্রতি খরচ দেখাতে হবে, অপারেশনের জন্য
          দিনপ্রতি কয়টা সিট, আগাম বুকিংয়ে দশ শতাংশ ছাড়ের দাম, VAT সহ দাম, আর তিন কিস্তিতে
          টাকা দেওয়ার হিসাব। সাকিব সব Query লিখে ফেললেন, Run চাপলেন, ফলাফলও এল। কোনো Error
          নেই।
        </ContentParagraph>
        <ContentParagraph>
          তারপর রুমানা আপা Calculator হাতে মিলিয়ে দেখলেন। Saint Martin Island Escape এ ২০টা
          সিট, ৩ দিনের ট্যুর। দিনপ্রতি সিট হওয়ার কথা ৬.৬৭, Query দেখাচ্ছে ৬। আর ১২,৫০০ টাকাকে
          তিন কিস্তিতে ভাগ করে আবার যোগ করলে আসছে ১২,৫০০.০১ টাকা, এক পয়সা বেশি। Database ভুল
          করেনি। সে ঠিক তাই করেছে যা তাকে বলা হয়েছিল। সমস্যা হলো, সাকিব জানতেন না তিনি আসলে
          কী বলছেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি শিখবেন SQL এ সংখ্যার হিসাব কীভাবে চলে: যোগ, বিয়োগ, গুণ, ভাগ আর
          ভাগশেষ, কোন চিহ্ন আগে খাটে, দুটো integer ভাগ করলে দশমিক কেন হারিয়ে যায় আর তিনভাবে
          সেটা ঠিক করা যায়, numeric আর double precision এর তফাত, round, ceil, floor আর
          trunc, আর টাকার হিসাবে শতাংশ, ছাড় আর কিস্তি নির্ভুল রাখার উপায়। পুরো লেসন জুড়ে
          Query বক্স আর অনুশীলন আছে, আর প্রতিটা সংখ্যা Island Tours এর আসল Data থেকে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দুইজনকে পাঁচটা আম ভাগ করে দিতে বললে কেউ দেবেন দুটো করে, কেউ দেবেন আড়াইটা করে। দুজনেই ঠিক, শুধু প্রশ্নটা আলাদা। SQL এ সেই প্রশ্নটা ঠিক করে দেয় সংখ্যার Type।",
      author: "Numbers",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Database ও একটা Calculator</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Module 03 এ আপনি SELECT এর তালিকায় একটা হিসাব লিখেছিলেন:{" "}
                <code className={CODE}>price_bdt * 2</code>। সেটাকে বলে Expression, মানে এমন
                কিছু যা হিসাব করে একটা মান বানায়। Database প্রতিটা Row এর জন্য আলাদা করে সেই
                হিসাবটা করে, আর ফলাফলটা একটা নতুন Column হয়ে ফেরত আসে। Table এর আসল Data তে
                কিছুই বদলায় না।
              </ContentParagraph>
              <ContentParagraph>
                রুমানা আপার পাঁচটা কাজের প্রতিটাই আসলে এমন এক একটা Expression। কিন্তু টাকা আর
                সংখ্যার হিসাবে দুটো জিনিস জানা না থাকলে Query চলে, ফলাফল আসে, আর ফলাফলটা চুপচাপ
                ভুল থাকে। এক, কোন চিহ্ন আগে খাটে। দুই, সংখ্যার Type কী, কারণ একই 5 / 2 এর উত্তর
                Type এর উপর নির্ভর করে 2 ও হতে পারে, 2.5 ও হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                Lesson 01 এ আপনি দেখেছেন Function কী: নাম, ভেতরে কিছু মান, আর ফেরত একটা মান।
                এখানে Function গুলো সংখ্যার: round, ceil, floor, trunc, abs, power, sqrt, আর
                আরও কয়েকটা। তবে তার আগে সবচেয়ে সাধারণ জিনিস, চিহ্নগুলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["রুমানা আপার কাজ", "দরকার কী", "কোন Section এ"],
          rows: [
            ["দিনপ্রতি খরচ", "ভাগ আর গোল করা", "004, 008"],
            ["দিনপ্রতি সিট", "integer ভাগের ফাঁদ এড়ানো", "004, 005"],
            ["আগাম বুকিংয়ে ১০% ছাড়", "গুণ আর দুই ঘর দশমিকে গোল", "011"],
            ["VAT সহ দাম", "Parentheses আর শতাংশ", "003, 011"],
            ["তিন কিস্তি", "হারানো পয়সা খুঁজে বের করা", "011"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ভাগ, তিন উত্তর"
              query={`SELECT 5 / 2   AS a,
       5.0 / 2 AS b,
       5 % 2   AS c;`}
              caption="Run চাপুন। a তে আসবে 2, b তে 2.5000000000000000, c তে 1। প্রথম দুটো একই ভাগ, শুধু একটায় দশমিক বিন্দু আছে। এই একটা বিন্দুর গল্পই এই লেসনের অর্ধেক।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "operators",
      subHeader: { index: "002", title: "Operators" },
      title: <SectionTitle>যোগ, বিয়োগ, গুণ, ভাগ, ভাগশেষ আর ঘাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুটো মানের মাঝে বসে যে চিহ্ন একটা হিসাব করে, তাকে বলে Operator। যোগের + একটা
                Operator, তুলনার &lt; ও একটা Operator, যেটা আপনি Module 03 এ WHERE এ ব্যবহার
                করেছেন। সংখ্যার জন্য PostgreSQL এর মূল Operator গুলো এই ছয়টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Operator", "কাজ", "উদাহরণ", "ফলাফল"],
          rows: [
            ["+", "যোগ", "12500 + 500", "13000"],
            ["-", "বিয়োগ, আর সামনে বসলে চিহ্ন উল্টানো", "12500 - 2000, -5", "10500, -5"],
            ["*", "গুণ", "price_bdt * 4", "চারজনের দাম"],
            ["/", "ভাগ", "5.0 / 2, আর 5 / 2", "2.5000000000000000, আর 2"],
            ["%", "ভাগশেষ (Modulo)", "7 % 3", "1"],
            ["^", "ঘাত (Power)", "2 ^ 10", "1024"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Operator এর দুই পাশে শুধু লেখা সংখ্যা না, Column ও বসতে পারে। তখন হিসাবটা হয়
                প্রতিটা Row এর নিজের মান দিয়ে। নিচের Query তে প্রতিটা ট্যুরের দাম তার সর্বোচ্চ
                সিট দিয়ে গুণ করা হয়েছে: একটা Departure এ সব সিট বিক্রি হলে সর্বোচ্চ কত টাকা আসতে
                পারে। ফলাফলের Column এর একটা নাম দেওয়া হয়েছে AS দিয়ে, আর সেই নাম ধরেই সাজানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব সিট বিক্রি হলে কত টাকা"
              query={`SELECT title,
       price_bdt,
       max_seats,
       price_bdt * max_seats AS full_revenue
FROM tours
ORDER BY full_revenue DESC;`}
              caption="নয়টা Row। সবার উপরে Cox's Bazar Family Package, 15500 × 24 = 372000.00। দাম সবচেয়ে বেশি Saint Martin Luxury Stay এর, তবু সে দ্বিতীয়, কারণ তাতে সিট মাত্র দশটা। price_bdt numeric, তাই গুণফলেও দুই ঘর দশমিক থেকে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ ^ মানে ঘাত না",
          content: (
            <ContentParagraph>
              PostgreSQL এ <code className={CODE}>2 ^ 10</code> হলো ১০২৪। MySQL এ একই লেখা
              দেয় 8, কারণ সেখানে ^ হলো Bitwise XOR, একেবারে আলাদা একটা কাজ। MySQL এ ঘাতের
              জন্য লিখতে হয় <code className={CODE}>POW(2, 10)</code> বা{" "}
              <code className={CODE}>POWER(2, 10)</code>। দুই জায়গাতেই কাজ করে এমন লেখা
              চাইলে power() নামটাই ব্যবহার করুন, PostgreSQL এও ওটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1 · Easy"
              task={
                <>
                  চারজনের একটা পরিবার একসাথে যেতে চায়। প্রতিটা ট্যুরের{" "}
                  <code className={CODE}>title</code> আর চারজনের মোট দাম দেখান। দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  মোট দাম মানে একজনের দাম গুণ চার। Table হলো tours, দামের Column{" "}
                  <code className={CODE}>price_bdt</code>।
                </>
              }
              solution={`SELECT title, price_bdt * 4 AS family_of_four
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "precedence",
      subHeader: { index: "003", title: "Precedence" },
      title: <SectionTitle>কোন চিহ্ন আগে খাটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                স্কুলের অঙ্কের নিয়মটা মনে আছে? আগে গুণ ভাগ, পরে যোগ বিয়োগ। SQL ও একই নিয়ম মানে।{" "}
                <code className={CODE}>2 + 3 * 4</code> এর উত্তর 14, 20 না, কারণ 3 * 4 আগে
                হয়। এই আগে পরের নিয়মকে বলে Precedence। Module 03 এ AND আর OR এর বেলায় একই জিনিস
                দেখেছিলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সবার আগে Parentheses:</strong> ( ) এর ভেতরের অংশ সবসময় আগে হিসাব হয়।
                </ListItem>
                <ListItem>
                  <strong>তারপর ঘাত ^:</strong> তবে PostgreSQL এ কয়েকটা ^ পরপর থাকলে বাঁ থেকে ডানে
                  চলে, অঙ্ক বইয়ের মতো ডান থেকে বাঁয়ে না। তাই <code className={CODE}>2 ^ 3 ^ 2</code>{" "}
                  হয় (2 ^ 3) ^ 2 = 64। PostgreSQL এর Documentation এ এটা আলাদা করে লেখা আছে।
                </ListItem>
                <ListItem>
                  <strong>তারপর * / %:</strong> এই তিনটা একই স্তরের। পাশাপাশি থাকলে বাঁ থেকে ডানে:{" "}
                  <code className={CODE}>100 / 10 / 5</code> হয় (100 / 10) / 5 = 2।
                </ListItem>
                <ListItem>
                  <strong>সবার শেষে + আর -:</strong> এরাও পাশাপাশি থাকলে বাঁ থেকে ডানে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে পরের নিয়ম চোখে দেখা"
              query={`SELECT 2 + 3 * 4     AS a,
       (2 + 3) * 4   AS b,
       100 / 10 / 5  AS c,
       2 ^ 3 ^ 2     AS d,
       2 ^ (3 ^ 2)   AS e,
       -2 ^ 2        AS f;`}
              caption="a = 14, b = 20, c = 2, d = 64, e = 512, f = 4। শেষেরটা অবাক করার মতো: PostgreSQL এ সামনের মাইনাস চিহ্ন ^ এর চেয়েও আগে খাটে, তাই -2 ^ 2 মানে (-2) ^ 2 = 4। এইসব জায়গায় অনুমান না করে Parentheses দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার সাকিবের আসল ভুলটা। রুমানা আপা বলেছিলেন দামের সাথে ১৫ শতাংশ VAT যোগ করতে
                (এই লেসনে আমরা ধরে নিচ্ছি VAT ১৫ শতাংশ)। সাকিব লিখলেন{" "}
                <code className={CODE}>price_bdt * 1 + 15 / 100</code>। পড়তে ঠিক লাগে, কিন্তু
                এখানে দুটো ভুল একসাথে। গুণ ভাগ আগে হয় বলে এটা আসলে দামের সাথে শুধু 15 / 100
                যোগ করছে। আর 15 / 100 দুটোই integer, তাই তার উত্তর 0। পরের Section এ দেখবেন
                কেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PrecedenceTreeSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="VAT: দুই ভুল, দুই সঠিক"
              query={`SELECT 12500 * 1 + 15 / 100         AS wrong1,
       12500 * (1 + 15 / 100)       AS wrong2,
       12500 * (1 + 15 / 100.0)     AS right1,
       12500 * 1.15                 AS right2;`}
              caption="wrong1 আর wrong2 দুটোই 12500, VAT একদম গায়েব। wrong2 তে Parentheses ঠিক আছে, কিন্তু ভেতরের 15 / 100 এখনো integer ভাগ, তাই 0। right1 দেয় 14375.00000000000000000000, right2 দেয় 14375.00। সংখ্যাটা একই, শুধু দশমিকের ঘর আলাদা, যেটা পরে round দিয়ে সামলাবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মনে রাখার দরকার নেই, Parentheses দিন",
          content: (
            <ContentParagraph>
              Precedence এর নিয়ম মুখস্থ থাকলেও যে পরে আপনার Query পড়বে, তার মাথায় নাও থাকতে
              পারে। তাই যেখানে একটুও সন্দেহ, সেখানে Parentheses দিন। এতে Query একটুও ধীর হয়
              না, শুধু পড়তে সহজ হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "integer-division",
      subHeader: { index: "004", title: "Integer Division" },
      title: <SectionTitle>5 / 2 কেন 2</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুইজনকে পাঁচটা আম ভাগ করে দিতে বললে দুই রকম উত্তর হতে পারে। আম না কেটে দিলে
                প্রত্যেকে পাবেন দুটো করে, আর একটা পড়ে থাকবে। আম কেটে দিলে প্রত্যেকে পাবেন আড়াইটা।
                দুটোই সঠিক ভাগ, শুধু প্রশ্নটা আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ কোন প্রশ্নটা করা হচ্ছে, সেটা ঠিক করে দুই পাশের সংখ্যার Type। দুই পাশেই
                integer হলে, মানে দশমিক ছাড়া পূর্ণসংখ্যা, PostgreSQL ধরে নেয় আপনি আস্ত আমের
                প্রশ্ন করছেন। এই ভাগকে বলে Integer Division। উত্তরের দশমিকের পরের অংশটা সে কেটে
                ফেলে দেয়, গোল করে না। 5 / 2 এর আসল উত্তর 2.5, কাটার পরে 2। ঋণাত্মক সংখ্যাও কাটা
                হয় শূন্যের দিকে, তাই -5 / 2 হয় -2, -3 না। PostgreSQL এর Documentation এ ঠিক
                এই কথাই লেখা: integer ভাগে ফলাফল শূন্যের দিকে কাটা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SharingMangoesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখন কোন Column কোন Type, সেটা জানা জরুরি হয়ে গেল। Island Tours এ{" "}
                <code className={CODE}>price_bdt</code> আর <code className={CODE}>total_bdt</code>{" "}
                হলো numeric, মানে দশমিকসহ সংখ্যা। কিন্তু <code className={CODE}>max_seats</code>,{" "}
                <code className={CODE}>duration_days</code>, <code className={CODE}>seats</code>{" "}
                আর <code className={CODE}>seats_left</code> হলো smallint, মানে ছোট পূর্ণসংখ্যা।
                smallint, integer আর bigint একই পরিবারের, শুধু আকারে আলাদা। তাই দুটো smallint
                Column ভাগ করলেও Integer Division হয়। সাকিবের দিনপ্রতি সিটের ভুল ঠিক এখানেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দিনপ্রতি সিট: কাটা উত্তর আর আসল উত্তর"
              query={`SELECT title,
       max_seats,
       duration_days,
       max_seats / duration_days          AS per_day_int,
       max_seats::numeric / duration_days AS per_day_exact
FROM tours
ORDER BY tour_id;`}
              caption="প্রথম Row: Saint Martin Island Escape, 20 / 3। per_day_int দেখায় 6, per_day_exact দেখায় 6.6666666666666667। Sylhet Tea Garden Tour এ 25 / 2 হয়ে যায় 12, আসলে 12.5। যেখানে ভাগ মিলে যায় (Cox's Bazar Beach Weekend এ 30 / 2 = 15), সেখানে দুটো একই। তাই এই ভুল সবখানে চোখে পড়ে না, আর সেজন্যই বিপজ্জনক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DivisionTypeGridDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নিয়ম একটাই",
          content: (
            <ContentParagraph>
              দুই পাশেই পূর্ণসংখ্যা হলে ফলাফলও পূর্ণসংখ্যা, দশমিক কেটে। এক পাশে দশমিকসহ সংখ্যা
              থাকলেই ফলাফল দশমিকসহ। কোনো Column এর Type জানতে চাইলে Query তে লিখুন{" "}
              <code className={CODE}>SELECT pg_typeof(max_seats) FROM tours LIMIT 1;</code>, বা
              psql এ <code className={CODE}>\d tours</code>। Type নিয়ে পুরো আলোচনা Module 09
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "three-fixes",
      subHeader: { index: "005", title: "Three Fixes" },
      title: <SectionTitle>দশমিক ফেরত আনার তিন উপায়, আর এক ভুল উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ঠিক করার বুদ্ধিটা সহজ: ভাগের আগে অন্তত এক পাশকে দশমিকসহ সংখ্যা বানিয়ে দিন। তিনভাবে
                করা যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Cast:</strong> <code className={CODE}>max_seats::numeric / duration_days</code>।
                  <code className={CODE}>::numeric</code> মানে মানটাকে numeric হিসেবে ধরে
                  নেওয়া। Column এর জন্য এটাই সবচেয়ে পরিষ্কার উপায়। Cast নিয়ে পুরো লেসন এই
                  Module এর Lesson 04।
                </ListItem>
                <ListItem>
                  <strong>1.0 দিয়ে আগে গুণ:</strong> <code className={CODE}>max_seats * 1.0 / duration_days</code>।
                  গুণটা আগে হয়, আর গুণফল numeric হয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>দশমিকসহ লেখা সংখ্যা:</strong> হাতে লেখা সংখ্যা হলে{" "}
                  <code className={CODE}>5 / 2.0</code> বা <code className={CODE}>5.0 / 2</code>।
                  দশমিক বিন্দুসহ লেখা সংখ্যা নিজেই numeric।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর ভুল উপায়টা খুব চেনা: <code className={CODE}>5 / 2 * 1.0</code>। এখানে ভাগটা
                আগে হয়, তখনই .5 কেটে গেছে। তারপর 1.0 দিয়ে গুণ করে শুধু 2 কে 2.0 লেখা হলো। যে অংশ
                একবার কাটা গেছে, পরে আর ফেরত আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন সমাধান আর এক দেরি"
              query={`SELECT 5 / 2            AS trap,
       5::numeric / 2   AS fix1,
       5 * 1.0 / 2      AS fix2,
       5 / 2.0          AS fix3,
       5 / 2 * 1.0      AS too_late;`}
              caption="trap = 2, তিনটা fix ই 2.5000000000000000, আর too_late = 2.0। শেষেরটায় দশমিক বিন্দু আছে বলে ঠিক মনে হতে পারে, কিন্তু .5 টা আগেই হারিয়ে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ExpressionLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ইচ্ছা করে ভাগফল চাইলে div() লিখুন",
          content: (
            <ContentParagraph>
              কখনো কখনো আস্ত ভাগফলই দরকার, যেমন কয়টা পুরো জোড়া হলো। তখনও 5 / 2 লিখলে কাজ হয়,
              কিন্তু পরে যে পড়বেন তিনি বুঝবেন না এটা ভুল না সিদ্ধান্ত। <code className={CODE}>div(5, 2)</code>{" "}
              লিখলে উদ্দেশ্যটা পরিষ্কার থাকে। div() ও শূন্যের দিকে কাটে, আর numeric ফেরত দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2 · Easy"
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর দিনপ্রতি সিট দেখান:{" "}
                  <code className={CODE}>max_seats</code> ভাগ <code className={CODE}>duration_days</code>,
                  আসল দশমিকসহ উত্তর, দুই ঘর দশমিকে গোল করা (round(…, 2))। Saint Martin Island Escape এ
                  আসার কথা 6.67।
                </>
              }
              hint={
                <>
                  দুটো Column ই smallint। ভাগের আগে একটাকে <code className={CODE}>::numeric</code>{" "}
                  দিয়ে বদলান, তারপর পুরো ভাগটাকে <code className={CODE}>round(…, 2)</code> এর ভেতরে রাখুন।
                </>
              }
              solution={`SELECT title,
       round(max_seats::numeric / duration_days, 2) AS seats_per_day
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "modulo",
      subHeader: { index: "006", title: "Modulo" },
      title: <SectionTitle>% দিয়ে ভাগশেষ: যা বাকি থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Integer ভাগে যে অংশটা পড়ে থাকে, তাকে চাইলে আলাদা করে পাওয়া যায়। তার Operator হলো
                %, নাম Modulo। <code className={CODE}>7 % 3</code> হলো 1, কারণ 7 = 3 × 2 + 1।
                একই কাজের Function ও আছে: <code className={CODE}>mod(7, 3)</code>। ভাগফল আর
                ভাগশেষ মিলিয়ে সবসময় আসল সংখ্যাটা ফেরত আসে: (9 / 2) * 2 + 9 % 2 = 9।
              </ContentParagraph>
              <ContentParagraph>
                বাস্তবে % এর সবচেয়ে চেনা কাজ তিনটা। একটা সংখ্যা জোড় না বিজোড় (x % 2 = 0 মানে
                জোড়)। কোনো কিছুকে সমান দলে ভাগ করার পর কয়টা বাকি থাকে। আর পালাক্রমে ভাগ করা, যেমন
                প্রতি তৃতীয় Row। Island Tours এ হোটেলের ঘরে দুজন করে থাকেন। একটা Booking এ কয়টা পুরো
                জোড়া হলো আর কেউ একা থাকলেন কিনা, সেটা ভাগ আর ভাগশেষ দিয়েই বের হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়া আর একা"
              query={`SELECT booking_id,
       seats,
       seats / 2 AS full_pairs,
       seats % 2 AS single
FROM bookings
WHERE status = 'confirmed'
ORDER BY booking_id;`}
              caption="১৭টা confirmed Booking। Booking 23 এ পাঁচজন: দুটো পুরো জোড়া, একজন একা (single = 1)। Booking 2 এ চারজন: দুটো জোড়া, কেউ একা না। এখানে Integer Division টাই আমাদের দরকার, তাই এটা ভুল না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঋণাত্মক সংখ্যায় ভাগশেষ"
              query={`SELECT mod(-7, 3)   AS a,
       -7 % 3       AS b,
       7 % -3       AS c,
       mod(7.5, 2)  AS d;`}
              caption="a আর b দুটোই -1, c হলো 1, d হলো 1.5। ভাগশেষের চিহ্ন মেলে প্রথম সংখ্যার সাথে। আর % শুধু পূর্ণসংখ্যায় না, numeric এও চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3 · Easy"
              task={
                <>
                  যে Booking গুলোতে সিটের সংখ্যা বিজোড়, মানে কাউকে একা ঘরে থাকতে হবে, সেগুলোর{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>seats</code> দেখান।
                  সব status এর Booking ধরুন।
                </>
              }
              hint={
                <>
                  বিজোড় মানে দুই দিয়ে ভাগ করলে এক বাকি থাকে: <code className={CODE}>seats % 2 = 1</code>।
                  শর্তটা যায় WHERE এ।
                </>
              }
              solution={`SELECT booking_id, seats
FROM bookings
WHERE seats % 2 = 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "exact-vs-approximate",
      subHeader: { index: "007", title: "Exact vs Approximate" },
      title: <SectionTitle>numeric বনাম double precision: খাতা বনাম আন্দাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দশমিকসহ সংখ্যা রাখার দুই রকম উপায় আছে, আর দুটোর চরিত্র একেবারে আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>numeric:</strong> প্রতিটা দশমিক অঙ্ক হুবহু রাখে, ঠিক খাতায় হাতে লেখা
                  হিসাবের মতো। যোগ, বিয়োগ আর গুণ নির্ভুল। একটু ধীর, কিন্তু টাকার জন্য এটাই একমাত্র
                  ঠিক পছন্দ। Island Tours এর সব টাকার Column numeric।
                </ListItem>
                <ListItem>
                  <strong>double precision (float8) আর real (float4):</strong> সংখ্যা রাখে
                  দুইয়ের ঘাতে, মানে Binary তে। খুব দ্রুত, অনেক বড় আর অনেক ছোট সংখ্যা রাখতে পারে।
                  কিন্তু 0.1 এর মতো অনেক সাধারণ দশমিক Binary তে হুবহু লেখা যায় না, যেমন এক ভাগ তিন
                  দশমিকে হুবহু লেখা যায় না। তাই সে রাখে সবচেয়ে কাছের মানটা। এই ধরনকে বলে Floating
                  Point।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ExactVsApproxSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="0.1 + 0.2 দুইভাবে"
              query={`SELECT 0.1 + 0.2                          AS numeric_sum,
       0.1::float8 + 0.2::float8          AS float_sum,
       0.1 + 0.2 = 0.3                    AS numeric_eq,
       0.1::float8 + 0.2::float8 = 0.3::float8 AS float_eq;`}
              caption="numeric_sum = 0.3, float_sum = 0.30000000000000004। numeric_eq হলো t, কিন্তু float_eq হলো f। double precision এ দুটো হিসাব চোখে একই হলেও = দিয়ে মেলালে না মিলতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                numeric ও সব জায়গায় অসীম না। এক ভাগ তিন দশমিকে শেষ হয় না, তাই numeric এর ভাগকেও
                একটা নির্দিষ্ট সংখ্যক অঙ্কের পরে থামতে হয়। নিচের বক্সে দেখুন, আগে ভাগ পরে গুণ করলে
                শেষ অঙ্কে একটু গরমিল থেকে যায়। আগে গুণ পরে ভাগ করলে উত্তর একদম ঠিক। তাই টাকার
                হিসাবে ভাগ যত পরে করা যায়, তত ভালো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="numeric এ ভাগের সীমা"
              query={`SELECT 1.0 / 3 * 3 AS divide_first,
       1.0 * 3 / 3 AS multiply_first;`}
              caption="divide_first = 0.99999999999999999999, multiply_first = 1.00000000000000000000। দুটো Query গাণিতিকভাবে একই, কিন্তু ভাগটা আগে করায় এক তৃতীয়াংশের শেষ না হওয়া অঙ্কগুলো কোথাও না কোথাও কাটতে হয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "টাকা কখনো float এ না",
          content: (
            <ContentParagraph>
              double precision ভালো কাজ করে মাপজোকের জন্য: দূরত্ব, তাপমাত্রা, GPS এর অবস্থান,
              বৈজ্ঞানিক হিসাব, যেখানে শেষ অঙ্কের সামান্য গরমিল কারো ক্ষতি করে না। টাকায় সেই এক পয়সার
              গরমিলই হিসাব না মেলার কারণ হয়। নিয়ম তিনটা: টাকা রাখুন numeric এ, double precision কে
              কখনো = দিয়ে মেলাবেন না, আর সংখ্যার Type বেছে নেওয়ার পুরো আলোচনা আসবে Module 09 এর{" "}
              <Link href="/sql/topic/numeric-types" className={LINK}>
                Number Types
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "rounding",
      subHeader: { index: "008", title: "Rounding" },
      title: <SectionTitle>round: কাছের মানে গোল করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ভাগের পরে আসে লম্বা লেজওয়ালা সংখ্যা: 4166.6666666666666667। Website এ এটা দেখানো
                যায় না। round Function সংখ্যাটাকে কাছের মানে গোল করে। দুইভাবে ব্যবহার করা যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>round(v)</code>: কাছের পূর্ণসংখ্যা। round(4166.67) হলো 4167।
                </ListItem>
                <ListItem>
                  <code className={CODE}>round(v, n)</code>: দশমিকের পরে n ঘর রেখে।
                  round(1234.5678, 2) হলো 1234.57। টাকার জন্য সাধারণত n = 2, মানে পয়সা পর্যন্ত।
                </ListItem>
                <ListItem>
                  <code className={CODE}>round(v, -n)</code>: n ঋণাত্মক হলে দশমিকের বাঁ দিকে গোল
                  হয়। round(12500, -3) হলো 13000, মানে কাছের হাজারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সমস্যা হয় ঠিক মাঝখানে: 2.5 কি 2 হবে না 3? numeric এ নিয়ম হলো শূন্য থেকে দূরে, তাই
                2.5 হয় 3 আর -2.5 হয় -3। double precision এ PostgreSQL এর Documentation বলছে নিয়মটা
                Platform এর উপর নির্ভর করে, তবে সবচেয়ে প্রচলিত নিয়ম হলো কাছের জোড় সংখ্যায়, তাই 2.5
                হয় 2 আর 3.5 হয় 4। এই Server এও ঠিক তাই হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RoundingLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="round এর তিন রূপ"
              query={`SELECT round(2.5)          AS a,
       round(-2.5)         AS b,
       round(2.5::float8)  AS c,
       round(1234.5678, 2) AS d,
       round(12500, -3)    AS e;`}
              caption="a = 3, b = -3, c = 2, d = 1234.57, e = 13000। c দেখুন: একই 2.5, শুধু double precision বলে উত্তর আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                আরেকটা চেনা Error: double precision এর একটা মান দুই ঘর দশমিকে গোল করতে চাইলে
                PostgreSQL রাজি হয় না। কারণ round(v, n) রূপটা শুধু numeric এর জন্য বানানো। Error
                টা পড়ুন, তার HINT টা ঠিক সমাধানের দিকেই ইশারা করছে: Type বদলে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="round(double precision, integer) নেই"
              query={`SELECT round(2.5::float8::numeric, 1) AS fixed;

SELECT round(2.5::float8, 1) AS broken;`}
              caption="প্রথমটা দেয় 2.5, কারণ আগে numeric এ বদলে তারপর গোল করা হয়েছে। দ্বিতীয়টা থামে Error এ: function round(double precision, integer) does not exist, সাথে HINT: You might need to add explicit type casts।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4 · Easy"
              task={
                <>
                  Website এ প্রতিটা ট্যুরের দিনপ্রতি খরচ দেখাতে হবে, পূর্ণ টাকায় গোল করে।{" "}
                  <code className={CODE}>title</code> আর দিনপ্রতি খরচ দেখান। Saint Martin Island Escape এ
                  আসার কথা 4167।
                </>
              }
              hint={
                <>
                  <code className={CODE}>price_bdt</code> numeric, তাই এখানে Integer Division এর ভয় নেই।
                  ভাগ করুন <code className={CODE}>duration_days</code> দিয়ে, আর পুরোটা round() এর ভেতরে।
                </>
              }
              solution={`SELECT title, round(price_bdt / duration_days) AS per_day
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "ceil-floor-trunc",
      subHeader: { index: "009", title: "Up, Down, Cut" },
      title: <SectionTitle>ceil, floor আর trunc: সবসময় এক দিকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                round কাছের দিকে যায়। কিন্তু কখনো কখনো দরকার সবসময় একই দিকে যাওয়া।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ceil (বা ceiling):</strong> সবসময় উপরের পূর্ণসংখ্যায়। ceil(2.1) হলো 3।
                  নাম এসেছে ছাদ থেকে। যখনই প্রশ্নটা &ldquo;কয়টা লাগবে&rdquo;, তখন ceil: পাঁচজনের
                  জন্য দুইজনের ঘর লাগবে তিনটা, আড়াইটা ঘর ভাড়া হয় না।
                </ListItem>
                <ListItem>
                  <strong>floor:</strong> সবসময় নিচের পূর্ণসংখ্যায়। floor(2.9) হলো 2। নাম মেঝে থেকে।
                </ListItem>
                <ListItem>
                  <strong>trunc:</strong> দশমিকের অংশটা কেটে ফেলা, শূন্যের দিকে। trunc(2.9) হলো 2।
                  trunc(v, n) দিয়ে n ঘর রেখে কাটা যায়: trunc(1234.5678, 2) হলো 1234.56, গোল করা না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ধনাত্মক সংখ্যায় floor আর trunc একই উত্তর দেয়। পার্থক্য ধরা পড়ে ঋণাত্মক সংখ্যায়:
                floor(-2.9) হলো -3, মানে আরও নিচে, আর trunc(-2.9) হলো -2, মানে শূন্যের দিকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RoundingNumberLineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার হোটেলের ঘর। প্রতিটা ঘরে দুজন, তাই একটা Booking এ ঘর লাগবে সিটের সংখ্যা ভাগ দুই,
                উপরের দিকে গোল করে। এখানে দুটো ফাঁদ একসাথে: seats একটা smallint, তাই{" "}
                <code className={CODE}>ceil(seats / 2)</code> লিখলে ভাগটা আগেই কেটে যায়, তারপর ceil
                করার আর কিছু থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কয়টা ঘর লাগবে"
              query={`SELECT booking_id,
       seats,
       seats / 2          AS rooms_wrong,
       ceil(seats / 2)    AS still_wrong,
       ceil(seats / 2.0)  AS rooms
FROM bookings
WHERE status = 'confirmed'
ORDER BY booking_id;`}
              caption="Booking 3 এ একজন: rooms_wrong আর still_wrong দুটোই 0, যেন তাঁর কোনো ঘর লাগবে না। rooms দেয় 1। Booking 23 এ পাঁচজন: ভুল দুটো দেয় 2, সঠিকটা 3। ceil এর আগে ভাগটাকে দশমিকসহ রাখতেই হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5 · Medium"
              task={
                <>
                  প্রতিটা confirmed Booking এর জন্য কয়টা দুইজনের ঘর লাগবে বের করুন।{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>seats</code> আর ঘরের
                  সংখ্যা দেখান। একজন হলেও একটা পুরো ঘর লাগে।
                </>
              }
              hint={
                <>
                  ঘরের সংখ্যা সবসময় উপরের দিকে গোল হয়, তাই ceil। আর ceil এর ভেতরের ভাগটা যেন Integer
                  Division না হয়: 2 না লিখে 2.0 লিখুন। শর্ত WHERE এ:{" "}
                  <code className={CODE}>status = &apos;confirmed&apos;</code>।
                </>
              }
              solution={`SELECT booking_id, seats, ceil(seats / 2.0) AS rooms
FROM bookings
WHERE status = 'confirmed';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "more-math",
      subHeader: { index: "010", title: "More Math" },
      title: <SectionTitle>abs, sign, power, sqrt আর random</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Function", "কাজ", "উদাহরণ", "ফলাফল"],
          rows: [
            ["abs(v)", "চিহ্ন বাদ দিয়ে মান, মানে দূরত্ব", "abs(-12.5)", "12.5"],
            ["sign(v)", "ঋণাত্মক হলে -1, শূন্য হলে 0, ধনাত্মক হলে 1", "sign(-3)", "-1"],
            ["power(a, b)", "a এর b ঘাত, ^ এর আরেক রূপ", "power(2, 10)", "1024"],
            ["sqrt(v)", "বর্গমূল", "sqrt(16)", "4"],
            ["cbrt(v)", "ঘনমূল", "cbrt(27)", "3"],
            ["random()", "0 থেকে 1 এর মধ্যে এলোমেলো সংখ্যা, প্রতিবার আলাদা", "random()", "প্রতিবার নতুন"],
            ["random(a, b)", "a থেকে b পর্যন্ত এলোমেলো পূর্ণসংখ্যা", "random(1, 6)", "লুডুর ছক্কার মতো"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাঁচটা Function একসাথে"
              query={`SELECT abs(-12.5)   AS a,
       sign(-3)     AS b,
       power(2, 10) AS c,
       sqrt(16)     AS d,
       cbrt(27)     AS e;`}
              caption="a = 12.5, b = -1, c = 1024, d = 4, e = 3।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                abs এর সবচেয়ে কাজের ব্যবহার হলো দূরত্ব মাপা। একজন Customer বললেন তাঁর বাজেট দশ হাজার
                টাকা। কোন ট্যুরগুলোর দাম বাজেটের সবচেয়ে কাছে, বেশি হোক বা কম? দাম থেকে বাজেট বিয়োগ
                করলে কোথাও ধনাত্মক, কোথাও ঋণাত্মক আসে। abs দিলে দুটোই হয়ে যায় দূরত্ব, আর সেই দূরত্ব
                ধরে সাজালেই উত্তর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6 · Medium"
              orderMatters
              task={
                <>
                  বাজেট ১০,০০০ টাকা। দাম এই বাজেটের সবচেয়ে কাছে এমন তিনটা ট্যুর দেখান, সবচেয়ে কাছেরটা আগে:{" "}
                  <code className={CODE}>title</code>, <code className={CODE}>price_bdt</code>, আর বাজেট থেকে
                  দূরত্ব (সবসময় ধনাত্মক)।
                </>
              }
              hint={
                <>
                  দূরত্ব হলো <code className={CODE}>abs(price_bdt - 10000)</code>। সেটাকে একটা নাম দিন,
                  সেই নাম ধরে ORDER BY করুন, আর LIMIT 3।
                </>
              }
              solution={`SELECT title, price_bdt, abs(price_bdt - 10000) AS distance
FROM tours
ORDER BY distance
LIMIT 3;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                random() প্রতিবার একটা নতুন সংখ্যা দেয়, 0 বা তার বেশি কিন্তু 1 এর কম। PostgreSQL 17 থেকে
                random(a, b) দিয়ে সরাসরি একটা সীমার মধ্যে পূর্ণসংখ্যাও পাওয়া যায়। নিচের বক্সটা কয়েকবার
                চালান, প্রতিবার আলাদা উত্তর আসবে। সেজন্যই এই লেসনে random এর কোনো উত্তর লেখা নেই, আর
                অনুশীলনেও এটা নেই: যে উত্তর প্রতিবার বদলায়, তাকে মিলিয়ে দেখা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                একই এলোমেলো ক্রম আবার পেতে চাইলে আগে <code className={CODE}>SELECT setseed(0.42);</code>{" "}
                চালিয়ে নিন। একই Seed দিলে পরের random() গুলো প্রতিবার একই ক্রমে আসে, যেটা Test লেখার সময়
                কাজে লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এলোমেলো, প্রতিবার আলাদা"
              query={`SELECT random()      AS between_0_and_1,
       random(1, 6)  AS dice;

SELECT title
FROM tours
ORDER BY random()
LIMIT 1;`}
              caption="দ্বিতীয় Query টা একটা এলোমেলো ট্যুর বেছে নেয়, যেমন Homepage এ &ldquo;আজকের পরামর্শ&rdquo;। ছোট Table এ এটা চলে, কিন্তু লাখো Row এ ORDER BY random() পুরো Table সাজায়, তাই ধীর। বড় Table এর উপায় Module 13 এ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "money-and-percentages",
      subHeader: { index: "011", title: "Money and Percentages" },
      title: <SectionTitle>ছাড়, VAT, কিস্তি আর শতাংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার রুমানা আপার আসল কাজগুলো। প্রথমটা আগাম বুকিংয়ে দশ শতাংশ ছাড়। দশ শতাংশ ছাড় মানে
                দামের নব্বই শতাংশ দিতে হবে, তাই গুণ 0.9। ফলাফল পয়সা পর্যন্ত গোল, round(…, 2)।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগাম বুকিংয়ে ১০% ছাড়"
              query={`SELECT title,
       price_bdt,
       round(price_bdt * 0.9, 2) AS early_bird
FROM tours
WHERE is_active
ORDER BY tour_id;`}
              caption="আটটা চালু ট্যুর। Saint Martin Island Escape 12500.00 থেকে 11250.00, Ratargul Swamp Boat Day 3500.00 থেকে 3150.00। বন্ধ ট্যুর Saint Martin Luxury Stay WHERE is_active এর কারণে বাদ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7 · Easy"
              task={
                <>
                  শুধু চালু ট্যুরগুলোর <code className={CODE}>title</code> আর দশ শতাংশ ছাড়ের পরের দাম দেখান,
                  পয়সা পর্যন্ত (দুই ঘর দশমিক) গোল করে।
                </>
              }
              hint={
                <>
                  দশ শতাংশ ছাড় মানে <code className={CODE}>price_bdt * 0.9</code>। গোল করতে{" "}
                  <code className={CODE}>round(…, 2)</code>, আর চালু ট্যুরের শর্ত{" "}
                  <code className={CODE}>WHERE is_active</code>।
                </>
              }
              solution={`SELECT title, round(price_bdt * 0.9, 2) AS early_bird
FROM tours
WHERE is_active;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দ্বিতীয় কাজ কিস্তি। ১২,৫০০ টাকা তিন কিস্তিতে: প্রতি কিস্তি 4166.6666…, পয়সা পর্যন্ত গোল
                করলে 4166.67। এখন তিনটা কিস্তি যোগ করুন: 12500.01। Customer এক পয়সা বেশি দেবেন। দাম আর
                কিস্তি সংখ্যা বদলালে কখনো এক পয়সা বেশি, কখনো দুই পয়সা কম, আর কখনো একদম মিলে যায়। একটা
                Booking এ এক পয়সা কিছুই না। কিন্তু হাজার হাজার Booking এ হিসাবের খাতা আর Bank এর হিসাব
                আর মেলে না।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো প্রথম কিস্তিগুলো গোল করা মান, আর শেষ কিস্তি বাকি যা থাকে: দাম থেকে আগের
                কিস্তিগুলোর যোগফল বাদ দিয়ে। তাহলে মোট সবসময় দামের সমান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InstallmentLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হারানো পয়সা, আর তার সমাধান"
              query={`SELECT round(12500 / 3.0, 2)     AS installment,
       round(12500 / 3.0, 2) * 3 AS naive_total;

SELECT round(12500 / 3.0, 2)                   AS first_two,
       12500 - 2 * round(12500 / 3.0, 2)       AS last_one;`}
              caption="প্রথম Query: কিস্তি 4166.67, তিনটা মিলে 12500.01। দ্বিতীয়টা: প্রথম দুটো কিস্তি 4166.67 করে, শেষটা 4166.66। যোগ করে দেখুন, ঠিক 12500.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তৃতীয় কাজ শতাংশ। শতাংশের সূত্র হলো অংশ গুণ ১০০ ভাগ পুরো। এখানেও Integer Division ওত পেতে
                থাকে। ২৪টা Booking এর মধ্যে ৩টা cancelled। <code className={CODE}>3 * 100 / 24</code> দেয়
                12, অথচ আসল উত্তর 12.5। ১০০ এর জায়গায় 100.0 লিখলেই সমাধান।
              </ContentParagraph>
              <ContentParagraph>
                Saint Martin Island Escape এর প্রতিটা Departure এ সিট ২০টা। প্রতিটা Departure এর কত শতাংশ
                সিট ভরেছে? ভরা সিট হলো 20 বিয়োগ <code className={CODE}>seats_left</code>। ট্যুরের সর্বোচ্চ সিট
                থাকে আরেক Table এ, tours এ। দুই Table জোড়া দেওয়ার উপায় শিখবেন Module 06 এ, তাই এখানে
                সংখ্যাটা হাতে লেখা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শতাংশ: কাটা আর আসল"
              query={`SELECT 3 * 100 / 24             AS pct_int,
       round(3 * 100.0 / 24, 1)   AS pct;

SELECT departure_id,
       seats_left,
       (20 - seats_left) * 100 / 20                AS pct_int,
       round((20 - seats_left) * 100.0 / 20, 1)    AS pct_filled
FROM departures
WHERE tour_id = 1
ORDER BY departure_id;`}
              caption="প্রথম Query: 12 আর 12.5। দ্বিতীয়টায় চারটা Departure: 30.0, 5.0, 30.0, 5.0। এই Data তে ২০ এর ভাগগুলো মিলে গেছে বলে কাটা উত্তরটাও ঠিক দেখাচ্ছে। Data বদলালেই সেটা চুপচাপ ভুল হবে, তাই 100.0 লেখার অভ্যাস রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8 · Medium"
              task={
                <>
                  Saint Martin Island Escape (<code className={CODE}>tour_id = 1</code>, প্রতি Departure এ ২০টা
                  সিট) এর প্রতিটা Departure এর <code className={CODE}>departure_id</code> আর কত শতাংশ সিট
                  ভরেছে দেখান, এক ঘর দশমিকে গোল করে।
                </>
              }
              hint={
                <>
                  ভরা সিট = 20 - seats_left। শতাংশ = ভরা সিট * 100.0 / 20। পুরোটা{" "}
                  <code className={CODE}>round(…, 1)</code> এর ভেতরে, আর WHERE tour_id = 1।
                </>
              }
              solution={`SELECT departure_id,
       round((20 - seats_left) * 100.0 / 20, 1) AS pct_filled
FROM departures
WHERE tour_id = 1;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "গোল করুন শেষে, মাঝখানে না",
          content: (
            <ContentParagraph>
              হিসাবের মাঝখানে গোল করলে প্রতিটা ধাপে একটু করে গরমিল জমে। পুরো হিসাব numeric এ শেষ করে
              একদম শেষে একবার round করুন। ব্যতিক্রম একটাই: যে সংখ্যাটা Customer দেখবেন আর দেবেন, যেমন
              প্রতিটা কিস্তি, সেটা আগে গোল করে নিন, আর বাকি গরমিলটা শেষ কিস্তিতে মিলিয়ে দিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "division-by-zero",
      subHeader: { index: "012", title: "Division by Zero" },
      title: <SectionTitle>শূন্য দিয়ে ভাগ, আর খুব বড় সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                শূন্য দিয়ে ভাগ অঙ্কে অর্থহীন, আর PostgreSQL সেটা চুপচাপ মেনে নেয় না। পূর্ণসংখ্যা, numeric বা
                double precision, যেটাই হোক, ভাগে শূন্য পেলে পুরো Query টা থামে Error দিয়ে: division by
                zero, SQLSTATE 22012। ভাগশেষেও (%) একই।
              </ContentParagraph>
              <ContentParagraph>
                বাস্তবে এটা হয় যখন ভাজকটা একটা হিসাব, আর কোনো এক Row তে সেটা শূন্য হয়ে যায়। যেমন কোনো
                মাসে একটাও Booking না হলে &ldquo;Booking প্রতি গড় আয়&rdquo; এর ভাজক শূন্য। লাখো Row এর মধ্যে
                একটা Row তে শূন্য থাকলেই পুরো Report আটকে যায়। একটা ছোট্ট সমাধান আছে:{" "}
                <code className={CODE}>NULLIF(x, 0)</code>, যেটা x শূন্য হলে NULL বানিয়ে দেয়, আর কোনো
                কিছুকে NULL দিয়ে ভাগ করলে উত্তর NULL, Error না। NULLIF এর পুরো গল্প এই Module এর Lesson 05
                এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শূন্য দিয়ে ভাগ, আর তার পাহারা"
              query={`SELECT 10 / NULLIF(0, 0) AS safe;

SELECT 10 / 0 AS broken;`}
              caption="প্রথম Query দেয় একটা খালি ঘর, মানে NULL। দ্বিতীয়টা থামে ERROR: division by zero এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রতিটা পূর্ণসংখ্যার Type এর একটা সীমা আছে। integer ধরতে পারে প্রায় ২১৪ কোটি পর্যন্ত, ঠিক
                2147483647। তার বেশি হলে PostgreSQL উত্তর কেটে বা উল্টে না দিয়ে Error দেয়: integer out of
                range। বড় সংখ্যার দরকার হলে bigint ব্যবহার করুন, তার সীমা অনেক অনেক বড়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="integer এর সীমা"
              query={`SELECT 2147483647::bigint + 1 AS ok;

SELECT 2147483647 + 1 AS overflow;`}
              caption="প্রথমটা দেয় 2147483648। দ্বিতীয়টা থামে ERROR: integer out of range এ। PostgreSQL ভুল উত্তর দেওয়ার চেয়ে থেমে যাওয়া পছন্দ করে, আর টাকার হিসাবে এটাই নিরাপদ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ সংখ্যার হিসাব কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                MySQL দিয়ে কোনো কোর্স ফলো করলে এই পার্থক্যগুলো জানা দরকার, কারণ এখানে একই লেখা দুই Database এ
                আলাদা উত্তর দেয়। নিচের প্রতিটা উত্তর MySQL 8.4 এ চালিয়ে নেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["5 / 2", "2 (integer ভাগ)", "2.5000, / সবসময় দশমিক দেয়"],
            ["1 / 3", "0", "0.3333, দশমিকের পরে ৪ ঘর (div_precision_increment)"],
            ["আস্ত ভাগফল", "5 / 2 বা div(5, 2)", "5 DIV 2 = 2"],
            ["2 ^ 3", "8 (ঘাত)", "1, কারণ ^ হলো Bitwise XOR"],
            ["ঘাত", "power(2, 10) বা 2 ^ 10", "POW(2, 10) বা POWER(2, 10)"],
            ["দশমিক কাটা", "trunc(1234.5678, 2)", "TRUNCATE(1234.5678, 2)"],
            ["round(2.5), round(-2.5)", "3, -3", "3, -3, একই নিয়ম"],
            ["float এ round(2.5)", "round(2.5::float8) = 2", "ROUND(2.5e0) = 2, এখানেও কাছের জোড় সংখ্যায়"],
            ["10 / 0 SELECT এ", "ERROR: division by zero", "NULL, সাথে Warning 1365"],
            ["10 / 0 INSERT এ", "ERROR", "Strict Mode এ ERROR 1365 (22012)"],
            ["2147483647 + 1", "ERROR: integer out of range", "2147483648, BIGINT এ হিসাব করে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ শূন্য দিয়ে ভাগ চুপচাপ NULL",
          content: (
            <ContentParagraph>
              SELECT এর ভেতরে MySQL শূন্য দিয়ে ভাগ করলে Error দেয় না, NULL দেয়, আর একটা Warning রেখে দেয়
              যেটা শুধু <code className={CODE}>SHOW WARNINGS;</code> চালালে দেখা যায়। Report এ সেই NULL চুপচাপ
              একটা খালি ঘর হয়ে থাকে। কিন্তু INSERT বা UPDATE এর সময়, MySQL 8.4 এর Default Strict Mode এ,
              একই ভাগ Error দিয়ে থামে। একই Database এ দুই জায়গায় দুই আচরণ, তাই NULLIF দিয়ে ভাজক পাহারা দেওয়ার
              অভ্যাসটা MySQL এ আরও জরুরি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>রুমানা আপার মূল্য তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এই লেসনের সবকিছু মিলিয়ে রুমানা আপার একটাই তালিকা, যেটা ফাইন্যান্স আর Marketing দুই দলই ব্যবহার
                করে। প্রতিটা চালু ট্যুরের দাম, দিনপ্রতি খরচ পূর্ণ টাকায়, আগাম বুকিংয়ের দাম পয়সা পর্যন্ত, VAT সহ
                দাম পূর্ণ টাকায়, আর তিন কিস্তির প্রতিটা কিস্তি উপরের দিকে গোল করে। দামি ট্যুর আগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাইন্যান্সের মূল্য তালিকা"
              query={`SELECT title,
       price_bdt,
       round(price_bdt / duration_days)  AS per_day,
       round(price_bdt * 0.9, 2)         AS early_bird,
       round(price_bdt * 1.15)           AS with_vat,
       ceil(price_bdt * 1.15 / 3)        AS installment
FROM tours
WHERE is_active
ORDER BY price_bdt DESC;`}
              caption="আটটা Row। প্রথমটা Sundarbans Mangrove Cruise: দিনপ্রতি 6000, আগাম বুকিংয়ে 16200.00, VAT সহ 20700, কিস্তি 6900। কিস্তি ceil দিয়ে করা, তাই তিন কিস্তির মোট VAT সহ দামের সমান বা দুই এক টাকা বেশি হতে পারে। পয়সা পর্যন্ত মেলাতে হলে আগের Section এর শেষ কিস্তির কৌশলটা লাগবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "App এর Code এও একই সাবধানতা",
          content: (
            <ContentParagraph>
              Island Tours এর মতো App এ এই হিসাবগুলো কখনো Database এ হয়, কখনো App এর Code এ। JavaScript এর
              সাধারণ number আসলে double precision, তাই সেখানেও 0.1 + 0.2 হয় 0.30000000000000004। তাই টাকার
              হিসাব হয় Database এর numeric এ করা হয়, নয়তো Code এ পয়সায় (পূর্ণসংখ্যায়) করা হয়, যেমনটা উপরের
              কিস্তির Lab করে। আর Database থেকে numeric পড়ার সময় Node.js এর pg Driver সেটা লেখা (string)
              হিসেবেই দেয়, যাতে দশমিক না হারায়। কোড থেকে SQL এর পুরো আলোচনা Module 17 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা হিসাব Database এর ভেতরে কীভাবে চলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ধরুন Query টা <code className={CODE}>round(price_bdt * 1.15 / 3, 2)</code>, আর Row টা Saint Martin
              Island Escape। PostgreSQL ধাপে ধাপে এভাবে এগোয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Row থেকে মান পড়া",
              description: "এই Row এর price_bdt হলো 12500.00, Type numeric।",
            },
            {
              title: "প্রতিটা অংশের Type ঠিক করা",
              description:
                "1.15 দশমিকসহ লেখা, তাই numeric। 3 পূর্ণসংখ্যা, integer। Type দেখে PostgreSQL ঠিক করে কোন গুণ আর কোন ভাগ ব্যবহার করবে।",
            },
            {
              title: "Precedence মেনে সাজানো",
              description:
                "* আর / একই স্তরের, তাই বাঁ থেকে ডানে: আগে 12500.00 * 1.15, তারপর সেটা ভাগ 3। round সবার শেষে, কারণ পুরোটা তার ভেতরে।",
            },
            {
              title: "গুণ",
              description: "numeric × numeric = 14375.0000, হুবহু, কোনো গরমিল ছাড়া।",
            },
            {
              title: "ভাগ",
              description:
                "numeric ÷ integer, এক পাশে numeric বলে দশমিকসহ ভাগ: 4791.6666…, একটা নির্দিষ্ট সংখ্যক অঙ্ক পর্যন্ত।",
            },
            {
              title: "গোল করা",
              description: "round(…, 2) দুই ঘর রেখে কাছের মানে: 4791.67।",
            },
            {
              title: "ফলাফল",
              description:
                "পরের Row এর জন্য আবার প্রথম ধাপ থেকে। প্রতিটা Row এর হিসাব আলাদা, Table এর Data অপরিবর্তিত।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "যেকোনো হিসাব লেখার আগে চার প্রশ্ন",
          content: (
            <ContentList>
              <ListItem>প্রতিটা Column আর সংখ্যার Type কী? দুই পাশেই পূর্ণসংখ্যা থাকলে ভাগ কাটা যাবে।</ListItem>
              <ListItem>কোন অংশ আগে হবে? সন্দেহ হলে Parentheses।</ListItem>
              <ListItem>ভাজক কি কখনো শূন্য হতে পারে? পারলে NULLIF।</ListItem>
              <ListItem>গোল কোথায় আর কোন দিকে? কাছের দিকে round, &ldquo;কয়টা লাগবে&rdquo; হলে ceil, আর শেষে একবার।</ListItem>
            </ContentList>
          ),
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
            <ContentParagraph>
              এই লেসনের বেশিরভাগ ভুলের সবচেয়ে বিপজ্জনক দিক হলো, এরা Error দেয় না। Query চলে, ফলাফল আসে, আর
              কেউ খেয়াল না করা পর্যন্ত ভুল সংখ্যাটা Report এ বসে থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "সমাধান"],
          rows: [
            ["max_seats / duration_days", "Integer Division, 6.67 এর জায়গায় 6", "max_seats::numeric / duration_days"],
            ["5 / 2 * 1.0", "কাটা যাওয়ার পরে দশমিক যোগ, 2.0", "গুণটা আগে: 5 * 1.0 / 2"],
            ["price * 1 + 15 / 100", "VAT শূন্য, Precedence আর Integer Division দুটোই", "price * (1 + 15 / 100.0) বা price * 1.15"],
            ["3 * 100 / 24", "শতাংশ 12, আসলে 12.5", "3 * 100.0 / 24"],
            ["ceil(seats / 2)", "একজনের জন্য 0 টা ঘর", "ceil(seats / 2.0)"],
            ["টাকা double precision এ", "0.30000000000000004 এর মতো গরমিল", "numeric"],
            ["float এ = দিয়ে মেলানো", "সমান সংখ্যাও f দেয়", "numeric, বা একটা ছোট সহনসীমা"],
            ["প্রতিটা কিস্তি গোল করে যোগ", "মোট এক দুই পয়সা বেশি বা কম", "শেষ কিস্তি = দাম − আগের কিস্তির যোগফল"],
            ["round(float8_value, 2)", "ERROR: function does not exist", "আগে ::numeric"],
            ["MySQL এ 2 ^ 3", "ঘাতের বদলে XOR, উত্তর 1", "POW(2, 3)"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-math.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Mathematical Functions and Operators
                </a>
                : এই লেসনের প্রতিটা Operator আর Function, উদাহরণসহ। Integer Division এর নিয়ম, round এর মাঝখানের নিয়ম আর
                random(a, b) এখানেই লেখা।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Lexical Structure
                </a>
                : পাতার নিচের দিকে Operator Precedence এর ছক, কোন চিহ্ন আগে।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-numeric.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Numeric Types
                </a>
                : numeric, integer আর double precision এর সীমা আর চরিত্র। Module 09 এর আগে একবার চোখ বুলিয়ে রাখুন।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/arithmetic-functions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Arithmetic Operators
                </a>
                : MySQL এর /, DIV, % আর শূন্য দিয়ে ভাগের আচরণ।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/precision-math-rounding.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Rounding Behavior
                </a>
                : দশমিক আর float এ ROUND কেন আলাদা আচরণ করে।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Floating-point_arithmetic" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: Floating-point arithmetic
                </a>
                : 0.1 + 0.2 কেন 0.3 হয় না, তার পুরো ব্যাখ্যা। গভীরে যেতে চাইলে।
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
      title: <SectionTitle>এক নজরে, শেষ চ্যালেঞ্জ, আর এরপর কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                SQL এ সংখ্যার হিসাব চলে Operator আর Function দিয়ে, প্রতিটা Row এর জন্য আলাদা করে। আগে Parentheses, তারপর
                ঘাত, তারপর গুণ ভাগ ভাগশেষ, শেষে যোগ বিয়োগ। দুই পাশেই পূর্ণসংখ্যা হলে ভাগ দশমিক কেটে ফেলে, আর সেটা ঠিক
                করতে ভাগের আগে এক পাশকে numeric বানাতে হয়। % দেয় ভাগশেষ। numeric হুবহু, double precision আন্দাজে, তাই টাকা
                numeric এ। round কাছের দিকে, ceil উপরে, floor নিচে, trunc শূন্যের দিকে। শতাংশে 100.0 লিখুন, কিস্তির হারানো
                পয়সা শেষ কিস্তিতে মিলিয়ে দিন, আর ভাজক শূন্য হতে পারলে NULLIF দিয়ে পাহারা দিন।
              </ContentParagraph>
              <ContentParagraph>
                নিজেকে তিনটা প্রশ্ন করুন। এক, max_seats / duration_days কেন 6 দিল, আর ঠিক করার তিনটা উপায় কী? দুই, ১২,৫০০
                টাকার তিন কিস্তি যোগ করলে এক পয়সা বেশি কেন, আর সমাধান কী? তিন, 2.5 numeric এ আর double precision এ গোল করলে
                কী কী আসে? তিনটার উত্তর একজন বন্ধুকে মুখে বোঝাতে পারলে লেসনটা আপনার।
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
                  প্রতিটা চালু ট্যুরের জন্য তিনটা Column দেখান: <code className={CODE}>title</code>, ১৫% VAT সহ দাম পূর্ণ টাকায়
                  গোল করে, আর সেই VAT সহ দামকে তিন কিস্তিতে ভাগ করলে প্রতিটা কিস্তি, পূর্ণ টাকায় উপরের দিকে গোল করে। দামি
                  ট্যুর আগে (<code className={CODE}>price_bdt</code> ধরে)।
                </>
              }
              hint={
                <>
                  VAT সহ দাম <code className={CODE}>round(price_bdt * 1.15)</code>। কিস্তি{" "}
                  <code className={CODE}>ceil(price_bdt * 1.15 / 3)</code>: price_bdt numeric, তাই ভাগ কাটা যাবে না। শর্ত{" "}
                  <code className={CODE}>WHERE is_active</code>, সাজানো{" "}
                  <code className={CODE}>ORDER BY price_bdt DESC</code>।
                </>
              }
              solution={`SELECT title,
       round(price_bdt * 1.15)    AS with_vat,
       ceil(price_bdt * 1.15 / 3) AS installment
FROM tours
WHERE is_active
ORDER BY price_bdt DESC;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সংখ্যা হলো। কিন্তু Island Tours এর অর্ধেক প্রশ্ন সময় নিয়ে: কতদিন পরে রওনা, কোন মাসে কত Booking, ঢাকার কোন
              তারিখে Booking টা হয়েছিল। পরের লেসনে তারিখ, সময় আর Time Zone:{" "}
              <Link href="/sql/topic/date-time-functions" className={LINK}>
                Dates, Times and Time Zones
              </Link>
              ।
            </ContentParagraph>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["Operator", "দুই মানের মাঝে বসে হিসাব করে", "+ - * / % ^"],
      ["Precedence", "Parentheses, ঘাত, গুণ ভাগ, তারপর যোগ বিয়োগ", "2 + 3 * 4 = 14"],
      ["^ বাঁ থেকে ডানে", "PostgreSQL এ, অঙ্ক বইয়ের উল্টো", "2 ^ 3 ^ 2 = 64"],
      ["Integer Division", "দুই পাশে পূর্ণসংখ্যা, দশমিক শূন্যের দিকে কাটা", "5 / 2 = 2, -5 / 2 = -2"],
      ["তিন সমাধান", "ভাগের আগে এক পাশ numeric", "x::numeric / y, x * 1.0 / y, 5 / 2.0"],
      ["Modulo", "ভাগশেষ, চিহ্ন প্রথম সংখ্যার", "7 % 3 = 1, mod(-7, 3) = -1"],
      ["numeric", "হুবহু দশমিক, টাকার জন্য", "0.1 + 0.2 = 0.3"],
      ["double precision", "Binary তে কাছাকাছি মান, মাপজোকের জন্য", "0.30000000000000004"],
      ["round", "কাছের মান, n ঘর বা ঋণাত্মক n", "round(1234.5678, 2), round(12500, -3)"],
      ["মাঝখানের নিয়ম", "numeric শূন্য থেকে দূরে, float কাছের জোড়ে", "round(2.5) = 3, round(2.5::float8) = 2"],
      ["ceil, floor, trunc", "উপরে, নিচে, শূন্যের দিকে কেটে", "ceil(seats / 2.0)"],
      ["শতাংশ", "অংশ * 100.0 / পুরো", "3 * 100.0 / 24 = 12.5"],
      ["কিস্তি", "শেষ কিস্তি = দাম − বাকিগুলোর যোগ", "12500 − 2 × 4166.67 = 4166.66"],
      ["শূন্য দিয়ে ভাগ", "PostgreSQL এ Error, NULLIF দিয়ে পাহারা", "x / NULLIF(y, 0)"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT max_seats / duration_days FROM tours WHERE tour_id = 1; (20 সিট, 3 দিন) কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "6.67",
            isCorrect: false,
            explanation: "6.67 হতো যদি অন্তত এক পাশ দশমিকসহ সংখ্যা হতো। দুটো Column ই smallint, তাই ভাগ কাটা হয়।",
          },
          {
            key: "B",
            text: "7",
            isCorrect: false,
            explanation: "Integer Division গোল করে না, কাটে। 6.67 গোল করলে 7 হতো, কিন্তু PostgreSQL দশমিকের অংশটা ফেলে দেয়।",
          },
          {
            key: "C",
            text: "6",
            isCorrect: true,
            explanation: "ঠিক। smallint ভাগ smallint হলো Integer Division, দশমিক শূন্যের দিকে কাটা। আসল উত্তর পেতে max_seats::numeric / duration_days।",
          },
          {
            key: "D",
            text: "Error, কারণ smallint ভাগ করা যায় না",
            isCorrect: false,
            explanation: "ভাগ করা যায়, Error হয় না। ঠিক সেজন্যই এই ভুলটা বিপজ্জনক: Query চলে, শুধু উত্তরটা কাটা।",
          },
        ],
      },
      {
        id: 2,
        text: "নিচের কোনটা 5 ভাগ 2 এর আসল উত্তর (2.5) দেয় না?",
        options: [
          {
            key: "A",
            text: "5::numeric / 2",
            isCorrect: false,
            explanation: "এটা দেয় 2.5000000000000000। ভাগের আগে এক পাশ numeric, তাই দশমিকসহ ভাগ।",
          },
          {
            key: "B",
            text: "5 * 1.0 / 2",
            isCorrect: false,
            explanation: "গুণ আগে হয়, গুণফল numeric, তারপর ভাগ। উত্তর 2.5000000000000000।",
          },
          {
            key: "C",
            text: "5 / 2 * 1.0",
            isCorrect: true,
            explanation: "ঠিক। ভাগ আগে হয়ে গেছে, .5 কাটা গেছে। তারপর 1.0 দিয়ে গুণ শুধু 2 কে 2.0 লিখল।",
          },
          {
            key: "D",
            text: "5 / 2.0",
            isCorrect: false,
            explanation: "দশমিক বিন্দুসহ লেখা 2.0 numeric, তাই ভাগও numeric। উত্তর 2.5000000000000000।",
          },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL এ SELECT 12500 * 1 + 15 / 100; কত দেয়?",
        options: [
          {
            key: "A",
            text: "14375",
            isCorrect: false,
            explanation: "14375 হলো VAT সহ দাম, যেটা এই লেখার উদ্দেশ্য ছিল। কিন্তু গুণ ভাগ আগে হয়, আর 15 / 100 integer ভাগে 0।",
          },
          {
            key: "B",
            text: "12500",
            isCorrect: true,
            explanation: "ঠিক। আগে 12500 * 1 = 12500 আর 15 / 100 = 0, তারপর যোগ। Precedence আর Integer Division মিলে VAT গায়েব।",
          },
          {
            key: "C",
            text: "12500.15",
            isCorrect: false,
            explanation: "15 / 100 হলে 0.15 হতো যদি দশমিকসহ ভাগ হতো। দুটোই integer বলে ভাগফল 0।",
          },
          {
            key: "D",
            text: "Error",
            isCorrect: false,
            explanation: "সব অংশই বৈধ সংখ্যা, তাই Error হয় না। উত্তর আসে, শুধু ভুল।",
          },
        ],
      },
      {
        id: 4,
        text: "টাকার Column এর জন্য কোন Type ঠিক, আর কেন?",
        options: [
          {
            key: "A",
            text: "double precision, কারণ দ্রুত",
            isCorrect: false,
            explanation: "দ্রুত, কিন্তু 0.1 এর মতো দশমিক হুবহু রাখতে পারে না। 0.1 + 0.2 হয় 0.30000000000000004।",
          },
          {
            key: "B",
            text: "integer, কারণ পয়সা নেই",
            isCorrect: false,
            explanation: "integer এ পয়সা রাখা যায় না, আর ভাগ করলে দশমিক কাটা যায়। পয়সায় পূর্ণসংখ্যা রাখা একটা কৌশল, কিন্তু টাকার Column এ নয়।",
          },
          {
            key: "C",
            text: "numeric, কারণ দশমিক হুবহু রাখে",
            isCorrect: true,
            explanation: "ঠিক। numeric প্রতিটা দশমিক অঙ্ক হুবহু রাখে, যোগ বিয়োগ গুণে কোনো গরমিল হয় না। Island Tours এর সব টাকার Column numeric।",
          },
          {
            key: "D",
            text: "real, কারণ জায়গা কম লাগে",
            isCorrect: false,
            explanation: "real আরও কম নির্ভুল double precision। টাকার জন্য একেবারেই না।",
          },
        ],
      },
      {
        id: 5,
        text: "PostgreSQL এ round(2.5) আর round(2.5::float8) কত দেয়?",
        options: [
          {
            key: "A",
            text: "3 আর 3",
            isCorrect: false,
            explanation: "numeric এ 3, কিন্তু double precision এ মাঝখানের মান কাছের জোড় সংখ্যায় যায়, তাই 2।",
          },
          {
            key: "B",
            text: "3 আর 2",
            isCorrect: true,
            explanation: "ঠিক। numeric এ মাঝখানে হলে শূন্য থেকে দূরে, তাই 3। double precision এ সবচেয়ে প্রচলিত নিয়ম কাছের জোড়ে, তাই 2।",
          },
          {
            key: "C",
            text: "2 আর 2",
            isCorrect: false,
            explanation: "numeric এ round(2.5) হলো 3, কারণ মাঝখানের মান শূন্য থেকে দূরে যায়।",
          },
          {
            key: "D",
            text: "2 আর 3",
            isCorrect: false,
            explanation: "উল্টো হয়ে গেছে। numeric এ 3, double precision এ 2।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা Booking এ ৫ জন, প্রতিটা ঘরে ২ জন। কোন Expression ঠিক ঘরের সংখ্যা (3) দেয়?",
        options: [
          {
            key: "A",
            text: "seats / 2",
            isCorrect: false,
            explanation: "Integer Division, 5 / 2 = 2। একজন ঘর ছাড়া থেকে যাবেন।",
          },
          {
            key: "B",
            text: "ceil(seats / 2)",
            isCorrect: false,
            explanation: "ভেতরের ভাগটা আগেই কেটে 2 হয়ে গেছে, তারপর ceil(2) = 2। ceil এর আর করার কিছু নেই।",
          },
          {
            key: "C",
            text: "floor(seats / 2.0)",
            isCorrect: false,
            explanation: "ভাগটা দশমিকসহ হলো, 2.5, কিন্তু floor সবসময় নিচে নামে, তাই 2। কয়টা লাগবে প্রশ্নে নিচে নামা মানে কারো জায়গা না হওয়া।",
          },
          {
            key: "D",
            text: "ceil(seats / 2.0)",
            isCorrect: true,
            explanation: "ঠিক। 2.0 ভাগটাকে দশমিকসহ রাখে, 2.5, আর ceil সবসময় উপরে নিয়ে যায়, 3। কয়টা লাগবে প্রশ্নের উত্তর সবসময় ceil।",
          },
        ],
      },
      {
        id: 7,
        text: "১২,৫০০ টাকা তিন কিস্তিতে, প্রতিটা round(12500 / 3.0, 2)। তিনটা যোগ করলে কত, আর সমাধান কী?",
        options: [
          {
            key: "A",
            text: "12500.00, কোনো সমস্যা নেই",
            isCorrect: false,
            explanation: "প্রতিটা কিস্তি 4166.67, তিনটা মিলে 12500.01। এক পয়সা বেশি।",
          },
          {
            key: "B",
            text: "12500.01, তাই কিস্তি double precision এ রাখতে হবে",
            isCorrect: false,
            explanation: "double precision এ সমস্যা আরও বাড়ে। সমস্যাটা গোল করার, Type এর না।",
          },
          {
            key: "C",
            text: "12500.01, তাই শেষ কিস্তি হবে দাম থেকে আগের দুটো বাদ দিয়ে",
            isCorrect: true,
            explanation: "ঠিক। প্রথম দুটো 4166.67, শেষটা 12500 − 8333.34 = 4166.66। মোট সবসময় দামের সমান।",
          },
          {
            key: "D",
            text: "12499.99, তাই ceil দিয়ে গোল করতে হবে",
            isCorrect: false,
            explanation: "যোগফল 12500.01, কম না। আর ceil দিলে প্রতিটা কিস্তি আরও বাড়ত, গরমিল বাড়ত।",
          },
        ],
      },
      {
        id: 8,
        text: "PostgreSQL আর MySQL এ SELECT 10 / 0; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "দুই জায়গাতেই NULL",
            isCorrect: false,
            explanation: "MySQL এ SELECT এর ভেতরে NULL আর একটা Warning, কিন্তু PostgreSQL এ Error।",
          },
          {
            key: "B",
            text: "PostgreSQL এ ERROR: division by zero, MySQL এ NULL সাথে Warning",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL থামে, MySQL SELECT এ চুপচাপ NULL দেয়। দুই জায়গাতেই ভাজক পাহারা দেওয়ার উপায় NULLIF(y, 0)।",
          },
          {
            key: "C",
            text: "দুই জায়গাতেই Error",
            isCorrect: false,
            explanation: "MySQL এ INSERT বা UPDATE এর ভেতরে Strict Mode এ Error হয়, কিন্তু সাধারণ SELECT এ NULL আসে।",
          },
          {
            key: "D",
            text: "দুই জায়গাতেই 0",
            isCorrect: false,
            explanation: "কোনো Database ই শূন্য দিয়ে ভাগকে 0 বলে না। সেটা হতো চুপচাপ ভুল উত্তর।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: my_tours এর মূল্য তালিকা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দিনপ্রতি হিসাব:</strong> নিজের island_tours এ প্রতিটা ট্যুরের দিনপ্রতি দাম (পূর্ণ টাকায়) আর দিনপ্রতি সিট (দুই ঘর
        দশমিকে) একটা Query তে বের করুন। দিনপ্রতি সিট একবার Integer Division দিয়ে, একবার সঠিকভাবে চালান, আর কোন কোন ট্যুরে দুটো
        আলাদা হলো লিখে রাখুন।
      </span>,
      <span key="2">
        <strong>ছাড় আর VAT:</strong> আগাম বুকিংয়ে ১৫% ছাড় আর তারপর ১৫% VAT, এই ক্রমে, পয়সা পর্যন্ত গোল করে। একবার মাঝখানে গোল
        করে, একবার শুধু শেষে গোল করে হিসাব করুন। কোনো ট্যুরে দুটোর উত্তর আলাদা হলো কিনা দেখুন, আর কেন হলো বা হলো না, তিন লাইনে
        লিখুন।
      </span>,
      <span key="3">
        <strong>কিস্তির টেবিল:</strong> প্রতিটা চালু ট্যুরের দাম ৪ কিস্তি আর ৬ কিস্তিতে ভাগ করে দেখান: প্রতি কিস্তি, সরলভাবে যোগ করলে
        মোট, আর শেষ কিস্তির কৌশল দিয়ে শেষ কিস্তি। কোন দাম কোন ভাগে মেলে না তার তালিকা করুন।
      </span>,
      <span key="4">
        <strong>ঘর আর গাড়ি:</strong> প্রতিটা confirmed Booking এর জন্য দুইজনের ঘর কয়টা আর চারজনের গাড়ি কয়টা লাগবে, দুটোই ceil
        দিয়ে। তারপর ইচ্ছা করে ceil(seats / 2) লিখে দেখান কোন Booking এ ভুল উত্তর আসে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন বন্ধু Excel জানেন কিন্তু SQL না। তাঁকে আট লাইনে বোঝান কেন SQL এ 5 / 2 এর উত্তর
        2, কেন টাকা numeric এ রাখতে হয়, আর কিস্তির এক পয়সা কোথায় হারায়।
      </span>,
    ],
    deliverables: [
      <span key="d1">পাঁচটা কাজের Query আর ফলাফলের Row সংখ্যাসহ একটা .sql ফাইল</span>,
      <span key="d2">মাঝখানে গোল বনাম শেষে গোল এর তুলনা আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d3">কিস্তি না মেলা দাম আর ভাগের তালিকা</span>,
      <span key="d4">বন্ধুর জন্য লেখা আট লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "Number Drill: নিজের psql এ",
    subtitle: "Module 02 এ Load করা island_tours এ, প্রতিটা লাইনের পাশে প্রত্যাশিত উত্তর",
    stepName: "LAB",
    steps: [
      {
        title: "island_tours এ ঢুকুন",
        description:
          "psql -d island_tours দিয়ে Connect করুন (Docker এ হলে docker exec -it island-pg psql -U postgres -d island_tours)। প্রম্পটে island_tours=# দেখে নিশ্চিত হন।",
      },
      {
        title: "Operator আর Precedence",
        description:
          "প্রথম ফাইলের প্রতিটা লাইন চালান। প্রতিটা চালানোর আগে মনে মনে উত্তর আন্দাজ করুন, তারপর মন্তব্যে লেখা উত্তরের সাথে মেলান।",
      },
      {
        title: "Integer Division",
        description:
          "দ্বিতীয় ফাইল চালান। 6 আর 6.67 পাশাপাশি দেখে নিন, আর psql এ \\d tours চালিয়ে মিলিয়ে নিন কোন Column smallint।",
      },
      {
        title: "numeric বনাম double precision",
        description: "তৃতীয় ফাইল চালান। t আর f দুটোই নিজের চোখে দেখুন।",
      },
      {
        title: "গোল করা আর টাকা",
        description: "চতুর্থ আর পঞ্চম ফাইল চালান। কিস্তির এক পয়সা গরমিল আর তার সমাধান দুটোই নিজে বের করুন।",
      },
      {
        title: "ইচ্ছা করে ভাঙুন",
        description:
          "ষষ্ঠ ফাইলের প্রতিটা লাইন চালিয়ে Error গুলো পড়ুন। শেষ লাইনটা কেন Error দেয় না, সেটা নিজের ভাষায় লিখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-operators.sql",
        code: `SELECT 2 + 3 * 4;            -- 14
SELECT (2 + 3) * 4;          -- 20
SELECT 2 ^ 3 ^ 2;            -- 64, বাঁ থেকে ডানে
SELECT title, price_bdt * max_seats AS full_revenue
FROM tours ORDER BY full_revenue DESC LIMIT 1;
-- Cox's Bazar Family Package | 372000.00`,
      },
      {
        language: "sql",
        filename: "02-integer-division.sql",
        code: `SELECT 5 / 2, -5 / 2, 5 % 2;                                   -- 2 | -2 | 1
SELECT title, max_seats / duration_days FROM tours WHERE tour_id = 1;
-- Saint Martin Island Escape | 6
SELECT title, round(max_seats::numeric / duration_days, 2) FROM tours WHERE tour_id = 1;
-- Saint Martin Island Escape | 6.67
SELECT count(*) FROM bookings WHERE seats % 2 = 1;                 -- 9`,
      },
      {
        language: "sql",
        filename: "03-exact-vs-float.sql",
        code: `SELECT 0.1 + 0.2 = 0.3;                          -- t
SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;  -- f
SELECT 1.0 / 3 * 3, 1.0 * 3 / 3;
-- 0.99999999999999999999 | 1.00000000000000000000`,
      },
      {
        language: "sql",
        filename: "04-rounding.sql",
        code: `SELECT round(2.5), round(2.5::float8), round(-2.5);   -- 3 | 2 | -3
SELECT ceil(2.1), floor(-2.9), trunc(-2.9);            -- 3 | -3 | -2
SELECT round(12500, -3), round(1234.5678, 2);          -- 13000 | 1234.57
SELECT count(*) FROM bookings
WHERE status = 'confirmed' AND ceil(seats / 2.0) = 2;  -- 4`,
      },
      {
        language: "sql",
        filename: "05-money.sql",
        code: `SELECT round(12500 / 3.0, 2) * 3;              -- 12500.01
SELECT 12500 - 2 * round(12500 / 3.0, 2);      -- 4166.66
SELECT title, round(price_bdt * 1.15) FROM tours WHERE tour_id = 3;
-- Sundarbans Mangrove Cruise | 20700
SELECT round((20 - seats_left) * 100.0 / 20, 1)
FROM departures WHERE departure_id = 1;        -- 30.0`,
      },
      {
        language: "sql",
        filename: "06-break-it.sql",
        code: `SELECT 10 / 0;
-- ERROR:  division by zero

SELECT round(2.5::float8, 1);
-- ERROR:  function round(double precision, integer) does not exist

SELECT 2147483647 + 1;
-- ERROR:  integer out of range

SELECT 10 / NULLIF(0, 0);
-- একটা খালি ঘর, মানে NULL। Error না।`,
      },
    ],
    tip: (
      <ContentParagraph>
        কোনো হিসাব লেখার আগে প্রতিটা Column এর Type দেখে নেওয়ার অভ্যাস করুন, psql এ \d table_name দিয়ে। কোথায় দুই পাশেই
        পূর্ণসংখ্যা, সেটা জানলে এই লেসনের অর্ধেক ভুল আর কখনো হবে না।
      </ContentParagraph>
    ),
  },
};
