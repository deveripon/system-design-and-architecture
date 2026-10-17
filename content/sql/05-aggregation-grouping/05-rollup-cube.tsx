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
  GroupingBitsLab,
  RollupBuilderLab,
} from "../../../components/course/topics/aggregation/rollup-animations";
import {
  GroupingSetsMapDiagram,
  NullTwoMeaningsSplit,
  SubtotalLevelsDiagram,
} from "../../../components/course/topics/aggregation/rollup-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const rollupCubeContent: TopicData = {
  id: "rollup-cube",
  introduction: {
    badge: "MODULE 05 · LESSON 05",
    title: <SectionTitle>এক Query তে উপমোট আর সর্বমোট</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          GROUP BY আপনাকে প্রতিটা দলের একটা উত্তর দেয়: প্রতিটা Payment Method এ কয়টা Payment,
          প্রতিটা মাসে কয়টা Booking। কিন্তু একটা আসল Report এ শুধু দলগুলো থাকে না। প্রতিটা অংশের
          নিচে থাকে সেই অংশের মোট, আর একদম শেষে থাকে সবকিছুর মোট। হিসাবের খাতায় যেমন প্রতিদিনের
          বিক্রির নিচে দিনের যোগফল, আর মাসের শেষে পুরো মাসের যোগফল।
        </ContentParagraph>
        <ContentParagraph>
          এতদিন সেই মোটের লাইনগুলো মানুষ হাতে বসাতেন: Query এর ফলাফল Excel এ নিয়ে SUM লিখে। এই
          লেসনে দেখবেন SQL নিজেই সেই লাইনগুলো বানাতে পারে, একটা Query তেই। ROLLUP বানায় ধাপে
          ধাপে উপমোট, CUBE বানায় সব দিকের মোট, আর GROUPING SETS দিয়ে আপনি নিজে বলে দেন ঠিক কোন
          কোন মোট চান।
        </ContentParagraph>
        <ContentParagraph>
          সাথে থাকবে এই কাজের সবচেয়ে বড় ফাঁদ: মোটের লাইনে যে ফাঁকা ঘর আসে, সেটা দেখতে হুবহু
          Data এর NULL এর মতো। Island Tours এর Data তে দুটো একসাথে ঘটে, আর আপনি শিখবেন GROUPING()
          দিয়ে কীভাবে দুটোকে আলাদা করবেন, পরিষ্কার লেবেল বসাবেন, আর মোটের লাইনগুলো ঠিক জায়গায়
          সাজাবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি আমাকে Column গুলো বড় থেকে ছোট ক্রমে দিন। আমি প্রথমে সব Column ধরে দল বানাই, তারপর ডান দিক থেকে একটা একটা Column ছেড়ে দিয়ে আবার দল বানাই, শেষে কোনো Column না রেখে সবটা একসাথে যোগ করি। খাতার প্রতিটা উপমোট আর শেষের সর্বমোট, সব এক Query তে।",
      author: "ROLLUP",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>মাস শেষের মিটিং আর হাতে বসানো যোগফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026। Island Tours এর Finance এর দায়িত্বে আছেন শাহানা। আজ
                বিকেলে মাস শেষের মিটিং, আর তিনি চান টাকা কোন পথে এসেছে তার একটা ছোট Report:
                bKash, Nagad, Card আর Bank, প্রতিটায় কয়টা Payment আর কত টাকা। সবচেয়ে জরুরি জিনিসটা
                Report এর একদম নিচে: সব মিলিয়ে কয়টা Payment আর মোট কত টাকা।
              </ContentParagraph>
              <ContentParagraph>
                Module 05 এর আগের লেসনগুলো থেকে আপনি জানেন প্রথম অংশটা কীভাবে বানাতে হয়: GROUP BY
                method। নিচের বক্সে চালিয়ে দেখুন। চারটা লাইন আসবে, প্রতিটা Method এর একটা। কিন্তু
                নিচের মোটের লাইনটা নেই। GROUP BY শুধু দলগুলো দেয়, দলগুলোর যোগফল দেয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শাহানার Report, মোট ছাড়া"
              query={`SELECT method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY method
ORDER BY method;`}
              caption="চারটা লাইন: bank 2, bkash 7, card 7, nagad 3। মোটের লাইন নেই। মুখে যোগ করলে 2 + 7 + 7 + 3 = 19টা Payment, আর টাকা 490600.00। এই যোগফলটাই শাহানাকে প্রতি মাসে হাতে করতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শাহানা এতদিন যা করতেন: Query এর ফলাফল Excel এ কপি করে নিচে একটা SUM বসাতেন। চারটা
                লাইনের জন্য সেটা ঝামেলা না। কিন্তু মিটিংয়ে ম্যানেজার ফারুক সাহেব প্রতিবার আরও একটু
                চান: প্রতিটা Method এর ভেতরে কয়টা Payment সফল, কয়টা ব্যর্থ, কয়টা ফেরত, আর প্রতিটা
                Method এর নিজের মোট। লাইন বাড়ে, হাতে বসানো SUM বাড়ে, আর একটা SUM ভুল ঘরের উপর
                বসলেই পুরো মিটিং ভুল সংখ্যা নিয়ে চলে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের প্রশ্ন একটাই: মোটের লাইনগুলো কি Database নিজেই বানিয়ে দিতে পারে, একই Query
                তে, যাতে মানুষের হাতে আর কোনো যোগফল না থাকে? উত্তর হ্যাঁ, আর সেই কাজের তিনটা যন্ত্রের
                নাম ROLLUP, CUBE আর GROUPING SETS।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের মূল ধারণা",
          content: (
            <ContentParagraph>
              একটা Report এ কয়েক স্তরের উত্তর থাকে: খুঁটিনাটি লাইন, প্রতিটা অংশের মোট, আর সবকিছুর মোট।
              GROUP BY একটা স্তর দেয়। ROLLUP, CUBE আর GROUPING SETS একই Query তে কয়েকটা স্তর দেয়,
              একটার নিচে আরেকটা সাজিয়ে। Table এর Data একটুও বদলায় না, শুধু ফলাফলে বাড়তি মোটের লাইন
              যোগ হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "levels",
      subHeader: { index: "002", title: "Levels of a Report" },
      title: <SectionTitle>হিসাবের খাতার তিন তলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাড়ার একটা দোকানের হিসাবের খাতা ভাবুন। প্রতিটা বিক্রি একটা লাইন। প্রতিদিনের শেষে দোকানি
                একটা দাগ টেনে নিচে লেখেন সেদিনের যোগফল। আর মাসের শেষ পাতায় লেখেন পুরো মাসের যোগফল।
                একই খাতায় তিন রকম লাইন: বিক্রির লাইন, দিনের মোট, মাসের মোট। দোকানি কখনো দিনের মোটকে
                বিক্রির লাইনের সাথে গুলিয়ে ফেলেন না, কারণ মোটের লাইনটা দাগের নিচে, আলাদা করে লেখা।
              </ContentParagraph>
              <ContentParagraph>
                শাহানার Report এও ঠিক এই তিন তলা। নিচের ছবিতে ১৯টা আসল Payment এর Report টা দেখুন।
                সাধারণ লাইনগুলো method আর status দুটো দিয়ে ভাগ করা, যেমন bkash এর paid। তার নিচে
                প্রতিটা Method এর একটা মোট, যেখানে status এর ঘর ফাঁকা, কারণ এই লাইন কোনো একটা status
                এর না, সবগুলোর। আর শেষে একটা লাইন যেখানে দুটো ঘরই ফাঁকা: সব Method, সব status, সবকিছু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SubtotalLevelsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তিন রকম লাইনের নাম মনে রাখুন, কারণ পুরো লেসন জুড়ে এগুলোই আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সাধারণ লাইন (Detail Row):</strong> GROUP BY এর সব Column ধরে বানানো দল। আপনি
                  এতদিন যা দেখে এসেছেন।
                </ListItem>
                <ListItem>
                  <strong>উপমোট (Subtotal):</strong> কয়েকটা Column ছেড়ে দিয়ে বানানো বড় দল। যে Column
                  ছেড়ে দেওয়া হলো, ফলাফলে তার ঘর ফাঁকা থাকে, অর্থাৎ NULL।
                </ListItem>
                <ListItem>
                  <strong>সর্বমোট (Grand Total):</strong> কোনো Column না রেখে সব Row এর একটা দল। সব
                  ভাগের ঘর ফাঁকা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                PostgreSQL আর MySQL এর Docs এ উপমোট আর সর্বমোটকে একসাথে বলা হয় Super-aggregate,
                মানে মোটের উপর মোট। নামটা ভারী শোনালেও ধারণাটা খাতার দাগের নিচের যোগফলই।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "rollup",
      subHeader: { index: "003", title: "ROLLUP" },
      title: <SectionTitle>ROLLUP: ডান দিক থেকে একটা একটা করে ছেড়ে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শাহানার প্রথম চাওয়াটা সবচেয়ে সহজ: চার Method এর লাইন, আর নিচে সবার মোট। GROUP BY এর
                পরে Column টাকে <code className={CODE}>ROLLUP ( )</code> এর ভেতরে রাখলেই হয়। বাকি
                Query হুবহু আগের মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Column এর ROLLUP"
              query={`SELECT method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY ROLLUP (method)
ORDER BY method;`}
              caption="পাঁচটা লাইন। প্রথম চারটা আগের মতোই, আর পঞ্চম লাইনে method এর ঘর NULL, payments 19, amount 490600.00। এটাই শাহানার মোটের লাইন। ORDER BY method এ PostgreSQL NULL কে সবার শেষে রাখে, তাই মোটের লাইন নিচে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের চাওয়া: প্রতিটা Method এর ভেতরে status অনুযায়ী ভাগ, প্রতিটা Method এর
                উপমোট, আর শেষে সর্বমোট। ROLLUP এর ভেতরে দুটো Column দিন, বড় ভাগটা আগে:{" "}
                <code className={CODE}>ROLLUP (method, status)</code>।
              </ContentParagraph>
              <ContentParagraph>
                ROLLUP যা করে সেটা এক লাইনে: তালিকার সব Column ধরে একবার দল বানায়, তারপর ডান দিক থেকে
                একটা Column বাদ দিয়ে আবার, তারপর আরেকটা, যতক্ষণ না কোনো Column বাকি থাকে। দুটো Column এর
                জন্য তিনটা ধাপ: (method, status) মানে সাধারণ লাইন, (method) মানে প্রতিটা Method এর উপমোট,
                আর ( ) মানে খালি তালিকা, সর্বমোট। প্রতিটা ধাপের ফলাফল একটার নিচে আরেকটা জুড়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Column এর ROLLUP"
              query={`SELECT method,
       status,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY ROLLUP (method, status)
ORDER BY method, status;`}
              caption="এগারোটা লাইন: ছয়টা সাধারণ লাইন, চারটা Method এর উপমোট (status NULL), আর একটা সর্বমোট (দুটো ঘরই NULL)। bkash এর উপমোট দেখুন: 1 + 5 + 1 = 7টা Payment, 174000.00 টাকা। উপরের ছবির সংখ্যাগুলো ঠিক এখান থেকেই নেওয়া।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ একই ১৯টা Payment পাঁচ রকম GROUP BY দিয়ে ভাগ করে দেখুন। সাধারণ GROUP BY থেকে
              শুরু করে ROLLUP এ যান, তারপর বাকিগুলো। প্রতিটা লাইনের পাশে লেখা আছে সেটা কোন তলার।
              CUBE আর GROUPING SETS এর কথা একটু পরেই আসছে, এখন শুধু দেখে রাখুন ফলাফল কীভাবে বদলায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RollupBuilderLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              task={
                <>
                  শাহানার প্রথম Report টা নিজে লিখুন: প্রতিটা <code className={CODE}>method</code> এ কয়টা
                  Payment আর মোট কত টাকা, আর একদম শেষে সবার মোটের একটা লাইন। তিনটা Column, এই ক্রমে:
                  method, payments, amount। Method গুলো বর্ণানুক্রমে, মোটের লাইন সবার শেষে।
                </>
              }
              hint={
                <>
                  GROUP BY method এর জায়গায় <code className={CODE}>GROUP BY ROLLUP (method)</code>।
                  ORDER BY method দিলে PostgreSQL মোটের NULL লাইনটা নিজেই শেষে রাখে।
                </>
              }
              solution={`SELECT method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY ROLLUP (method)
ORDER BY method;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "column-order",
      subHeader: { index: "004", title: "Column Order" },
      title: <SectionTitle>কোন Column আগে, সেটাই ঠিক করে কোন উপমোট আসবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ROLLUP সবসময় ডান দিক থেকে Column ছাড়ে। তাই তালিকার ক্রম বদলালে উপমোটও বদলে যায়।{" "}
                <code className={CODE}>ROLLUP (method, status)</code> দেয় প্রতিটা Method এর মোট।{" "}
                <code className={CODE}>ROLLUP (status, method)</code> দেয় প্রতিটা status এর মোট, Method এর
                কোনো মোট দেয় না। সংখ্যাগুলো ভুল হয় না, শুধু অন্য প্রশ্নের উত্তর আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্রম উল্টে দেখুন"
              query={`SELECT status,
       method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY ROLLUP (status, method)
ORDER BY status, method;`}
              caption="এবার দশটা লাইন। উপমোট এখন status অনুযায়ী: failed 1, paid 17, refunded 1, আর শেষে সর্বমোট 19। Method এর উপমোট একটাও নেই। আগের Query তে এগারোটা লাইন ছিল কারণ Method চারটা, এখানে দশটা কারণ status তিনটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কোনটা আগে লিখবেন? নিয়মটা খাতার মতোই: বড় ভাগ আগে, ছোট ভাগ পরে। যে ভাগের ভেতরে অন্য
                ভাগ থাকে, সেটা বাঁয়ে। দেশের ভেতরে শহর, তাই <code className={CODE}>ROLLUP (country, city)</code>।
                বছরের ভেতরে মাস, মাসের ভেতরে দিন, তাই বছর, মাস, দিন। এভাবে লিখলে প্রতিটা উপমোট একটা অর্থপূর্ণ
                দলের মোট হয়: প্রতিটা দেশের মোট, প্রতিটা বছরের মোট।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো লিখলে, যেমন <code className={CODE}>ROLLUP (city, country)</code>, প্রতিটা শহরের একটা
                উপমোট আসবে, যেটা সেই শহরের সাধারণ লাইনেরই হুবহু কপি, কারণ একটা শহর একটাই দেশে। ভুল না,
                কিন্তু অকাজের লাইনে Report ভরে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              orderMatters
              task={
                <>
                  দেশ আর শহর অনুযায়ী Customer গুনুন: প্রতিটা দেশের ভেতরে শহরভিত্তিক সংখ্যা, প্রতিটা দেশের
                  একটা উপমোট, আর শেষে সবার মোট। তিনটা Column, এই ক্রমে: country, city, customers। ক্রম: দেশ
                  বর্ণানুক্রমে, প্রতিটা দেশের ভেতরে শহর বর্ণানুক্রমে, দেশের উপমোট তার শহরগুলোর পরে, আর
                  সর্বমোট সবার শেষে।
                </>
              }
              hint={
                <>
                  বড় ভাগ দেশ, তাই <code className={CODE}>ROLLUP (country, city)</code>। সাজাতে{" "}
                  <code className={CODE}>ORDER BY country, city</code> যথেষ্ট, কারণ ফাঁকা ঘরগুলো প্রতিটা
                  দলের শেষে চলে যায়।
                </>
              }
              solution={`SELECT country,
       city,
       count(*) AS customers
FROM customers
GROUP BY ROLLUP (country, city)
ORDER BY country, city;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "grouping-sets",
      subHeader: { index: "005", title: "GROUPING SETS" },
      title: <SectionTitle>GROUPING SETS: ঠিক যে দলগুলো চান, শুধু সেগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ROLLUP এর দলগুলো সবসময় একটা নির্দিষ্ট ছকে আসে। কিন্তু মাঝে মাঝে আপনার চাওয়া ছকে পড়ে না।
                ফারুক সাহেব চান Booking এর দুটো ছোট হিসাব একসাথে: status অনুযায়ী কয়টা, আর মাস অনুযায়ী
                কয়টা। status আর মাসের জোড়া চান না, শুধু আলাদা আলাদা দুটো তালিকা, আর পারলে শেষে সবার মোট।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য আছে GROUPING SETS। এখানে প্রতিটা দল আপনি নিজে লিখে দেন, প্রতিটা নিজের Bracket এ।{" "}
                <code className={CODE}>GROUPING SETS ((status), (month), ())</code> মানে তিনটা আলাদা GROUP BY:
                একটা status ধরে, একটা মাস ধরে, আর খালি Bracket মানে কোনো Column না ধরে, অর্থাৎ সর্বমোট।
                তিনটার ফলাফল একটার নিচে আরেকটা জুড়ে যায়। যে দলে একটা Column নেই, সেই দলের লাইনে ওই
                Column এর ঘর NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো হিসাব আর একটা মোট, এক Query তে"
              query={`SELECT status,
       to_char(booked_at, 'YYYY-MM') AS month,
       count(*) AS bookings
FROM bookings
GROUP BY GROUPING SETS ((status), (to_char(booked_at, 'YYYY-MM')), ())
ORDER BY status, month;`}
              caption="দশটা লাইন। প্রথম তিনটায় শুধু status: cancelled 3, confirmed 17, pending 4, month ফাঁকা। পরের ছয়টায় শুধু মাস, 2025-12 থেকে 2026-10, status ফাঁকা। আর শেষ লাইনে দুটোই ফাঁকা, 24, সব Booking। মাসগুলো Dhaka সময় ধরে গোনা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা গোপন কথা: ROLLUP আসলে GROUPING SETS এর একটা সংক্ষিপ্ত রূপ।{" "}
                <code className={CODE}>ROLLUP (method, status)</code> হুবহু{" "}
                <code className={CODE}>GROUPING SETS ((method, status), (method), ())</code>। PostgreSQL এর
                Docs এ ঠিক এভাবেই লেখা। তাই যখনই কোনো ROLLUP এর ফলাফল বুঝতে কষ্ট হয়, মনে মনে সেটাকে
                GROUPING SETS এ ভেঙে লিখুন, প্রতিটা Bracket একটা আলাদা GROUP BY।
              </ContentParagraph>
              <ContentParagraph>
                কখন কোনটা? ছকটা যদি বড় থেকে ছোট সিঁড়ির মতো হয়, যেমন দেশ, শহর, ROLLUP সবচেয়ে ছোট আর
                পরিষ্কার। ছকে না পড়লে, যেমন দুটো স্বাধীন তালিকা পাশাপাশি, GROUPING SETS।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  একটা Query তেই Payment এর দুটো ছোট হিসাব: <code className={CODE}>method</code> অনুযায়ী কয়টা
                  Payment, আর <code className={CODE}>status</code> অনুযায়ী কয়টা। জোড়া বা সর্বমোট চাই না।
                  তিনটা Column, এই ক্রমে: method, status, payments। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  দুটো আলাদা দল, প্রতিটা নিজের Bracket এ:{" "}
                  <code className={CODE}>GROUPING SETS ((method), (status))</code>। খালি Bracket দেবেন না,
                  কারণ সর্বমোট চাওয়া হয়নি।
                </>
              }
              solution={`SELECT method,
       status,
       count(*) AS payments
FROM payments
GROUP BY GROUPING SETS ((method), (status));`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "cube",
      subHeader: { index: "006", title: "CUBE" },
      title: <SectionTitle>CUBE: সব দিক থেকে মোট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ROLLUP একটা দিক বেছে নেয়: method এর মোট দেয়, status এর মোট দেয় না। কিন্তু শাহানার মিটিংয়ে
                দুটো প্রশ্নই আসে। প্রতিটা Method এ কত এসেছে, আর সব Method মিলিয়ে কতগুলো Payment সফল, কতগুলো
                ব্যর্থ। দুই দিকের মোট একসাথে চাইলে CUBE।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>CUBE (method, status)</code> সম্ভাব্য সব দল বানায়: দুটো Column ধরে,
                শুধু method ধরে, শুধু status ধরে, আর কোনোটা না ধরে। চারটা দল। নামটা এসেছে Module 01 এ দেখা{" "}
                <Link href="/sql/topic/oltp-vs-olap" className={LINK}>
                  OLAP
                </Link>{" "}
                এর জগৎ থেকে, যেখানে Report এর Data কে একটা ঘনক বা Cube হিসেবে ভাবা হয়, যার প্রতিটা দিক একটা
                Column, আর প্রতিটা দিক বরাবর যোগ করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই দিকের মোট"
              query={`SELECT method,
       status,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY CUBE (method, status)
ORDER BY method, status;`}
              caption="চোদ্দটা লাইন। ROLLUP এর এগারোটার সাথে নতুন তিনটা: method ফাঁকা কিন্তু status আছে, failed 1, paid 17, refunded 1। মানে সব Method মিলিয়ে কয়টা Payment কোন অবস্থায়। শেষ লাইন আগের মতোই সর্বমোট, 19, 490600.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupingSetsMapDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিতে দুটো হিসাব পাশাপাশি দেখুন। ROLLUP এ n টা Column থাকলে দল হয় n + 1 টা: দুটো Column এ
                তিনটা। CUBE এ দল হয় 2 এর ঘাত n টা, কারণ প্রতিটা Column হয় দলে আছে, নয়তো নেই: দুটো Column এ
                চারটা, তিনটায় আটটা, চারটায় ষোলোটা। প্রতিটা দল মানে Data টা আবার একবার ভাগ করা, তাই বেশি
                Column এ CUBE দিলে ফলাফলের লাইন আর কাজ দুটোই দ্রুত ফুলে ওঠে। CUBE এ দুই বা তিনটা Column
                রাখুন, তার বেশি লাগলে সম্ভবত আপনার আসলে GROUPING SETS দিয়ে বাছাই করা কয়েকটা দল দরকার।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর ভাষায়, CUBE (a, b) হুবহু GROUPING SETS ((a, b), (a), (b), ())। ROLLUP আর CUBE
                দুটোই আসলে GROUPING SETS লেখার শর্টকাট।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  <code className={CODE}>tours</code> Table এ <code className={CODE}>destination_id</code> আর{" "}
                  <code className={CODE}>is_active</code> এর সব রকম মোট বের করুন: প্রতিটা জোড়া, প্রতিটা
                  Destination এর মোট, চালু আর বন্ধ ট্যুরের আলাদা মোট, আর সব ট্যুরের মোট। তিনটা Column, এই
                  ক্রমে: destination_id, is_active, tours। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  দুই দিকের সব মোট মানে <code className={CODE}>CUBE (destination_id, is_active)</code>।
                  ষোলোটা লাইন আসার কথা।
                </>
              }
              solution={`SELECT destination_id,
       is_active,
       count(*) AS tours
FROM tours
GROUP BY CUBE (destination_id, is_active);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "two-nulls",
      subHeader: { index: "007", title: "Two Kinds of NULL" },
      title: <SectionTitle>একই ফাঁকা ঘর, দুটো আলাদা মানে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ মোটের লাইন চিনতে কোনো কষ্ট হয়নি, কারণ ফাঁকা ঘর মানেই মোট। Payment এর method বা
                status কখনো NULL হয় না, Table এর নিয়মেই আটকানো। কিন্তু যে Column এ আসল Data তেই NULL থাকে,
                সেখানে ROLLUP চালালে একটা বিপদ ঘটে।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এর{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL লেসন
                </Link>{" "}
                থেকে মনে আছে, Ratargul Swamp Boat Day ট্যুরের এখনো কোনো Guide ঠিক হয়নি, তার guide_id NULL।
                এবার Guide অনুযায়ী ট্যুর গুনে, শেষে সবার মোট চাই। নিচের বক্সটা চালান আর ফলাফলের দুটো ফাঁকা
                লাইন খুঁজুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো ফাঁকা লাইন, কোনটা কী?"
              query={`SELECT guide_id,
       count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id)
ORDER BY guide_id;`}
              caption="ছয়টা লাইন: চারজন Guide এর প্রত্যেকের 2টা ট্যুর, আর দুটো লাইন যেখানে guide_id NULL, একটায় 1, আরেকটায় 9। একটা হলো Ratargul এর আসল দল, অন্যটা ROLLUP এর সর্বমোট। দুটো লাইনই NULL, তাই ORDER BY তাদের মধ্যে কোনো নির্দিষ্ট ক্রম দেয় না। শুধু চোখে দেখে আপনি নিশ্চিত হতে পারবেন না কোনটা কী।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullTwoMeaningsSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে বুদ্ধি করে লেবেল বসাতে গিয়ে বেশিরভাগ মানুষ প্রথমে COALESCE এর কথা ভাবেন: ফাঁকা হলে
                লেখা থাকুক All guides। কিন্তু COALESCE জানে না কোন ফাঁকাটা কেন ফাঁকা। সে দুটো NULL কেই একই
                লেবেল দিয়ে দেয়। নিচে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="COALESCE এর ভুল লেবেল"
              query={`SELECT COALESCE(guide_id::text, 'All guides') AS guide,
       count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id)
ORDER BY guide;`}
              caption="দুটো লাইনে লেখা All guides, একটায় 9, একটায় 1। পাঠক ধরে নেবেন সব Guide মিলিয়ে কখনো 9, কখনো 1, আর Ratargul এর Guide না থাকার খবরটা পুরো হারিয়ে গেল। guide_id সংখ্যা, তাই লেবেল বসাতে আগে ::text দিয়ে লেখায় বদলাতে হয়েছে, সেটা Module 04 এর Type Casting এর নিয়ম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ফাঁকা ঘর দেখে মোট ধরে নেবেন না",
          content: (
            <ContentParagraph>
              ROLLUP, CUBE বা GROUPING SETS এর ফলাফলে একটা NULL দুই রকম হতে পারে: Data তে সত্যিই মান নেই,
              অথবা এই লাইনটা ওই Column ছেড়ে দিয়ে বানানো মোট। যে Column এ আসল NULL থাকতে পারে, সেখানে
              NULL দেখে কিছু ধরে নেওয়া বা COALESCE দিয়ে লেবেল বসানো দুটোই ভুল। ঠিক যন্ত্রটা পরের অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "grouping-function",
      subHeader: { index: "008", title: "GROUPING()" },
      title: <SectionTitle>GROUPING(): কোন লাইন মোট, সেটা জিজ্ঞেস করার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>GROUPING(column)</code> একটা ছোট Function, যেটা প্রতিটা লাইনের জন্য
                একটা প্রশ্নের উত্তর দেয়: এই লাইনটা বানানোর সময় এই Column টা কি দলে ছিল? ছিল হলে 0, ছেড়ে
                দেওয়া হলে 1। Data তে কী আছে সেটা সে দেখে না, দেখে লাইনটা কোন দল থেকে এসেছে। তাই Ratargul এর
                আসল দলে GROUPING(guide_id) হয় 0, আর সর্বমোটে 1, যদিও দুটো লাইনেই guide_id NULL।
              </ContentParagraph>
              <ContentParagraph>
                এবার CASE দিয়ে তিনটা পরিস্থিতিকে তিনটা লেবেল দিন। CASE এর ক্রমটা গুরুত্বপূর্ণ: আগে
                জিজ্ঞেস করুন লাইনটা মোট কিনা, তারপর মান NULL কিনা। Module 03 এর{" "}
                <Link href="/sql/topic/case-expression" className={LINK}>
                  CASE লেসন
                </Link>{" "}
                এ দেখেছেন, প্রথম যে শর্ত সত্য হয় সেটাই জেতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUPING দিয়ে সঠিক লেবেল"
              query={`SELECT CASE
         WHEN GROUPING(guide_id) = 1 THEN 'All guides'
         WHEN guide_id IS NULL THEN 'No guide yet'
         ELSE 'Guide ' || guide_id
       END AS guide,
       GROUPING(guide_id) AS is_total,
       count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id)
ORDER BY GROUPING(guide_id), guide_id NULLS LAST;`}
              caption="ছয়টা লাইন, প্রতিটার নিজের পরিচয়: Guide 1 থেকে Guide 4, প্রত্যেকের 2টা, তারপর No guide yet 1, আর শেষে All guides 9। is_total Column এ দেখুন, শুধু শেষ লাইনে 1। ORDER BY তে আগে GROUPING, তাই মোট সবসময় শেষে, আর NULLS LAST এর কারণে No guide yet থাকে Guide দের পরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GROUPING এর ভেতরে একসাথে কয়েকটা Column দেওয়া যায়। তখন সে প্রতিটা Column এর জন্য একটা
                করে 0 বা 1 পাশাপাশি বসিয়ে একটা Binary সংখ্যা বানায়, ঠিক যেভাবে কম্পিউটার 0 আর 1 এর
                সারি দিয়ে সংখ্যা লেখে। সবচেয়ে ডানের Column হয় সবচেয়ে ছোট Bit। দুটো Column হলে সম্ভাব্য মান
                0, 1, 2 আর 3।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query তে মাস আর status এর ROLLUP, আর পাশে তিনটা GROUPING। খেয়াল করুন মাসটা একটা
                হিসাব করা Expression, to_char(booked_at, ...)। GROUPING এর ভেতরে ঠিক সেই Expression টাই
                লিখতে হয়েছে, SELECT এ দেওয়া নাম month সেখানে চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Bit গুলো পড়ুন"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       status,
       count(*) AS bookings,
       GROUPING(to_char(booked_at, 'YYYY-MM')) AS g_month,
       GROUPING(status) AS g_status,
       GROUPING(to_char(booked_at, 'YYYY-MM'), status) AS bits
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'), status)
ORDER BY month, status;`}
              caption="ষোলোটা লাইন। সাধারণ লাইনে bits 0। প্রতিটা মাসের উপমোটে g_status 1, তাই bits 1 (Binary তে 01)। আর শেষ লাইনে দুটোই 1, Binary তে 11, দশমিকে 3: সর্বমোট, 24টা Booking।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupingBitsLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  Guide অনুযায়ী ট্যুর গুনুন, পরিষ্কার লেবেলসহ। যে দলের guide_id আসলেই ফাঁকা সেখানে লেখা
                  থাকবে <code className={CODE}>No guide yet</code>, মোটের লাইনে{" "}
                  <code className={CODE}>All guides</code>, আর বাকিগুলোতে guide_id সংখ্যাটাই লেখা হিসেবে,
                  যেমন 1। দুটো Column, এই ক্রমে: guide, tours। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  CASE এ আগে <code className={CODE}>GROUPING(guide_id) = 1</code>, তারপর{" "}
                  <code className={CODE}>guide_id IS NULL</code>, আর ELSE এ{" "}
                  <code className={CODE}>guide_id::text</code>। ক্রম উল্টালে মোটের লাইনও No guide yet হয়ে
                  যাবে।
                </>
              }
              solution={`SELECT CASE
         WHEN GROUPING(guide_id) = 1 THEN 'All guides'
         WHEN guide_id IS NULL THEN 'No guide yet'
         ELSE guide_id::text
       END AS guide,
       count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "sorting",
      subHeader: { index: "009", title: "Sorting and LIMIT" },
      title: <SectionTitle>মোটের লাইন যেন ঠিক জায়গায় থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ মোটের লাইন নিচে এসেছে একটা সুবিধার কারণে: ছোট থেকে বড় সাজালে PostgreSQL NULL কে শেষে
                রাখে। কিন্তু Report সাধারণত সাজানো হয় বড় সংখ্যা আগে রেখে। শাহানা চান যে Method এ সবচেয়ে
                বেশি Payment এসেছে সেটা উপরে। <code className={CODE}>ORDER BY payments DESC</code> দিলে কী
                হয় দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় আগে সাজালে মোট উঠে যায় উপরে"
              query={`SELECT method, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method)
ORDER BY payments DESC, method;

SELECT method, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method)
ORDER BY GROUPING(method), payments DESC, method;`}
              caption="প্রথম ফলাফলে সর্বমোট 19 সবার উপরে, কারণ সেটাই সবচেয়ে বড় সংখ্যা। দ্বিতীয়টায় আগে GROUPING(method): সাধারণ লাইনের 0 আগে, মোটের 1 পরে। তাই bkash 7, card 7, nagad 3, bank 2, আর তারপর 19। bkash আর card দুটোই 7, তাই তাদের ক্রম ঠিক করতে শেষে method রাখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা মনে রাখার মতো: ROLLUP, CUBE বা GROUPING SETS এর Report সাজাতে প্রতিটা ভাগের আগে
                তার GROUPING দিন। দুই Column হলে{" "}
                <code className={CODE}>ORDER BY GROUPING(a), a, GROUPING(b), b</code>। তাহলে প্রতিটা উপমোট
                তার দলের লাইনগুলোর পরে বসে, আর সর্বমোট সবার শেষে, আপনি যেভাবেই সাজান না কেন।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা ছোট সতর্কতা: LIMIT কাজ করে সবশেষে, মোটের লাইন যোগ হওয়ার পরে। তাই ROLLUP এর
                Report এ <code className={CODE}>LIMIT 3</code> দিলে প্রথম তিনটা লাইন আসে, তার মধ্যে উপমোটও
                থাকতে পারে, আর সর্বমোট প্রায় সবসময় কাটা পড়ে।{" "}
                <Link href="/sql/topic/limit-pagination" className={LINK}>
                  LIMIT লেসন
                </Link>{" "}
                এ যেভাবে পাতায় পাতায় দেখানো শিখেছেন, মোটসহ Report এ সেটা সাধারণত ভালো ধারণা না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LIMIT কাটে মোট যোগ হওয়ার পরে"
              query={`SELECT method, status, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method, status)
ORDER BY method, status
LIMIT 3;`}
              caption="তিনটা লাইন: bank paid 2, bank এর উপমোট 2, আর bkash failed 1। দ্বিতীয় লাইনটা একটা উপমোট, আর সর্বমোট বাদ পড়েছে। LIMIT জানে না কোন লাইন কী, সে শুধু গোনে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "partial-totals",
      subHeader: { index: "010", title: "Partial Totals" },
      title: <SectionTitle>শুধু উপমোট, সর্বমোট ছাড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবসময় সর্বমোট দরকার হয় না। ফারুক সাহেব প্রতিটা মাসের Report আলাদা পাতায় ছাপেন, প্রতিটা
                পাতায় সেই মাসের status ভিত্তিক সংখ্যা আর মাসের মোট। সব মাস মিলিয়ে একটা মোট তাঁর কোনো
                পাতায় লাগে না।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য GROUP BY তে সাধারণ Column আর ROLLUP একসাথে লিখুন:{" "}
                <code className={CODE}>GROUP BY month, ROLLUP (status)</code>। ROLLUP এর বাইরের Column টা
                প্রতিটা দলে সবসময় থাকে, কখনো ছেড়ে দেওয়া হয় না। তাই প্রতিটা মাসের উপমোট আসে, কিন্তু মাস
                ছেড়ে দেওয়া সর্বমোট আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা মাসের মোট, সর্বমোট নেই"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       status,
       count(*) AS bookings
FROM bookings
GROUP BY to_char(booked_at, 'YYYY-MM'), ROLLUP (status)
ORDER BY month, GROUPING(status), status;`}
              caption="পনেরোটা লাইন, আগের ষোলোটার চেয়ে একটা কম। প্রতিটা মাসের নিচে তার উপমোট আছে, যেমন 2026-10 এ 9, কিন্তু শেষে 24 এর সর্বমোট লাইনটা নেই।"
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
                  প্রতিটা Booking এর <code className={CODE}>status</code> এর ভেতরে{" "}
                  <code className={CODE}>seats</code> অনুযায়ী Booking গুনুন: কয়টা Booking এ 1টা সিট, কয়টায়
                  2টা, এভাবে। সাথে প্রতিটা status এর নিজের মোট, কিন্তু সব status মিলিয়ে সর্বমোট চাই না।
                  তিনটা Column, এই ক্রমে: status, seats, bookings। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  status সবসময় দলে থাকবে, seats ছেড়ে দেওয়া যাবে:{" "}
                  <code className={CODE}>GROUP BY status, ROLLUP (seats)</code>। বারোটা লাইন আসার কথা।
                </>
              }
              solution={`SELECT status,
       seats,
       count(*) AS bookings
FROM bookings
GROUP BY status, ROLLUP (seats);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "filters-and-totals",
      subHeader: { index: "011", title: "Filters and Totals" },
      title: <SectionTitle>WHERE, HAVING আর মোটের লাইন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Module এর{" "}
                <Link href="/sql/topic/having-vs-where" className={LINK}>
                  HAVING বনাম WHERE লেসন
                </Link>{" "}
                এ দেখেছেন, WHERE কাজ করে দল বানানোর আগে, HAVING পরে। ROLLUP এর সাথে এই পার্থক্যটা আরও বড়
                হয়ে যায়, কারণ এখন মোটের লাইনও একটা দল।
              </ContentParagraph>
              <ContentParagraph>
                WHERE আগে Row ছাঁকে, তারপর দল আর মোট হয়। তাই মোটগুলো শুধু ছাঁকা Row এর মোট। শাহানা যদি
                শুধু সফল Payment চান, তাহলে সর্বমোট 19 থেকে নেমে 17 হবে, আর সেটাই ঠিক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE এর পরে মোট"
              query={`SELECT method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
WHERE status = 'paid'
GROUP BY ROLLUP (method)
ORDER BY GROUPING(method), method;`}
              caption="পাঁচটা লাইন। bkash এখন 5, কারণ ব্যর্থ আর ফেরত দেওয়া দুটো Payment WHERE এ বাদ পড়েছে। সর্বমোট 17টা Payment, 423600.00 টাকা, যেটা আসলে প্রতিষ্ঠানের হাতে আসা টাকা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              HAVING উল্টো জায়গায় বসে: মোটের লাইন বানানোর পরে। তাই HAVING এর শর্ত মোটের লাইনের উপরেও খাটে।
              ছোট দলগুলো বাদ দিতে গিয়ে আপনি অজান্তে কোনো Method এর উপমোটও বাদ দিয়ে ফেলতে পারেন। নিচে{" "}
              <code className={CODE}>HAVING count(*) &gt; 2</code> দিয়ে দেখুন bank এর কী হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="HAVING মোটের লাইনও কাটে"
              query={`SELECT method, status, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method, status)
HAVING count(*) > 2
ORDER BY GROUPING(method), method, GROUPING(status), status;`}
              caption="সাতটা লাইন। bank এর দুটো লাইনই নেই, কারণ তার সাধারণ লাইন আর উপমোট দুটোতেই সংখ্যা 2। bkash এর failed আর refunded এর একটা করে লাইনও গেছে। অথচ সর্বমোট এখনও 19, সব Payment ধরে। পাঠক উপরের লাইনগুলো যোগ করে কখনো 19 পাবেন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষে একটা অদ্ভুত কিন্তু কাজের ঘটনা। WHERE যদি সব Row ছেঁকে ফেলে, তাহলে কোনো দল তৈরি হয় না,
              কিন্তু সর্বমোটের দলটা তবু আসে, কারণ PostgreSQL এর Docs অনুযায়ী খালি Bracket এর দল কোনো Row
              না থাকলেও একটা লাইন দেয়। 2027 সালে এখনো কোনো Payment হয়নি, দেখুন কী আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোনো Row না থাকলেও সর্বমোট"
              query={`SELECT method,
       count(*) AS payments,
       sum(amount_bdt) AS amount
FROM payments
WHERE paid_at >= '2027-01-01'
GROUP BY ROLLUP (method);`}
              caption="একটাই লাইন: method NULL, payments 0, amount NULL। count কিছু না পেলে 0 দেয়, sum কিছু না পেলে NULL, এই Module এর Aggregate লেসনের সেই নিয়ম। Report এ এটা ভালো: খালি মাসেও একটা পরিষ্কার শূন্যের লাইন আসে। MySQL এ ঠিক এই Query কোনো লাইনই দেয় না, সেটা পরের অংশে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "in-mysql",
      subHeader: { index: "012", title: "In MySQL" },
      title: <SectionTitle>MySQL এ ROLLUP আছে, CUBE নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ উপমোটের ঐতিহ্যবাহী লেখা হলো GROUP BY এর শেষে <code className={CODE}>WITH ROLLUP</code>।
                MySQL 8.4 এর Docs এ PostgreSQL এর মতো <code className={CODE}>ROLLUP (a, b)</code> লেখাকেও
                বিকল্প হিসেবে দেখানো আছে, আর পরীক্ষা করে দুটোর ফলাফল হুবহু একই পাওয়া গেছে। GROUPING() ও আছে, আর লেবেল বসাতে অনেকে MySQL এর{" "}
                <code className={CODE}>IF()</code> ব্যবহার করেন। নিচের ফলাফল MySQL 8.4.11 এ এই ট্র্যাকের
                MySQL Sample Database এ চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4",
          code: `SELECT IF(GROUPING(method), 'All methods', method) AS method,
       IF(GROUPING(status), 'All', status) AS status,
       COUNT(*) AS payments,
       SUM(amount_bdt) AS amount
FROM payments
GROUP BY method, status WITH ROLLUP;

+-------------+----------+----------+-----------+
| method      | status   | payments | amount    |
+-------------+----------+----------+-----------+
| bank        | paid     |        2 |  54000.00 |
| bank        | All      |        2 |  54000.00 |
| bkash       | failed   |        1 |  50000.00 |
| bkash       | paid     |        5 | 107000.00 |
| bkash       | refunded |        1 |  17000.00 |
| bkash       | All      |        7 | 174000.00 |
| card        | paid     |        7 | 211600.00 |
| card        | All      |        7 | 211600.00 |
| nagad       | paid     |        3 |  51000.00 |
| nagad       | All      |        3 |  51000.00 |
| All methods | All      |       19 | 490600.00 |
+-------------+----------+----------+-----------+`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["উপমোট", "GROUP BY ROLLUP (a, b)", "GROUP BY a, b WITH ROLLUP, অথবা ROLLUP (a, b)"],
            ["সব দিকের মোট", "GROUP BY CUBE (a, b)", "নেই। ERROR 3889, শুধু HeatWave নামের আলাদা Engine এ চলে"],
            ["নিজের বাছাই করা দল", "GROUPING SETS ((a), (b))", "নেই। ERROR 1064, Syntax ই নেই"],
            ["আংশিক ROLLUP", "GROUP BY a, ROLLUP (b)", "নেই। ERROR 1064"],
            ["মোটের লাইন চেনা", "GROUPING(a)", "GROUPING(a), একই নিয়মে"],
            ["কোনো Row না থাকলে", "সর্বমোটের একটা লাইন, count 0", "কোনো লাইনই আসে না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CUBE এর Error টা একটু অদ্ভুত। MySQL Syntax টা চেনে, কিন্তু সাধারণ Table এ চালাতে গেলে বলে:{" "}
                <code className={CODE}>ERROR 3889 (HY000): Secondary engine operation failed. Reason: &quot;No
                secondary engine defined for at least one of the query tables&quot;</code>। MySQL এর Docs
                অনুযায়ী CUBE শুধু Oracle এর HeatWave নামের Analytics সেবার Secondary Engine এ চলে, সাধারণ
                MySQL Server এর Table এ না। সাধারণ MySQL এ
                দুই দিকের মোট দরকার হলে দুটো আলাদা ROLLUP চালাতে হয়, অথবা Module 07 এর UNION দিয়ে
                ফলাফল জুড়তে হয়।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা পার্থক্য: MySQL এ GROUP BY তে মাসের মতো হিসাব করা Expression থাকলে GROUPING দিয়ে
                লেবেল বসাতে গিয়ে ONLY_FULL_GROUP_BY এর Error আসে (ERROR 1055)। সেটা সামলানোর সহজ কৌশল
                আসবে Module 07 এর{" "}
                <Link href="/sql/topic/derived-tables" className={LINK}>
                  Derived Table
                </Link>{" "}
                লেসনে। PostgreSQL এ একই Expression হুবহু লিখলেই চলে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "when-a-tool",
      subHeader: { index: "013", title: "When a Tool Is Better" },
      title: <SectionTitle>কখন SQL এ মোট, কখন Report Tool এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ROLLUP জানার পরে সব Report SQL এ বানাতে ইচ্ছা হয়। কিন্তু অনেক জায়গায় মোটের কাজটা Report
                Tool এ ছেড়ে দেওয়াই ভালো। Excel বা Google Sheets এর Pivot Table, আর Metabase বা Power BI এর
                মতো Business Intelligence Tool এ মানুষ নিজে ক্লিক করে মোট বানান, ভাগ বদলান, Chart বানান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SQL এর মোট ভালো যখন:</strong> Report একটা নির্দিষ্ট ছকে বারবার লাগে, যেমন প্রতি
                  মাসের Email, CSV Export, বা একটা API যেটা মোটসহ ফলাফল পাঠায়। অথবা psql এ দ্রুত একটা
                  হিসাব মিলিয়ে নিতে।
                </ListItem>
                <ListItem>
                  <strong>Tool ভালো যখন:</strong> মানুষ একই সংখ্যা দশ রকম ভাবে ঘুরিয়ে দেখতে চান, ক্লিক করে
                  ভেতরে ঢুকতে চান, বা মোটের লাইন মোটা অক্ষরে সাজিয়ে দেখাতে চান। সাজসজ্জা Tool এর কাজ, SQL
                  এর না।
                </ListItem>
                <ListItem>
                  <strong>Data অনেক বড় হলে:</strong> লক্ষ লক্ষ Row এর উপর বারবার CUBE চালানো ভারী কাজ। তখন
                  ফলাফল আগে থেকে হিসাব করে রাখা হয়, যেটা Module 14 এর{" "}
                  <Link href="/sql/topic/materialized-views" className={LINK}>
                    Materialized View
                  </Link>
                  , অথবা আলাদা Report এর Database এ নেওয়া হয়, যেটা Module 20 এর{" "}
                  <Link href="/sql/topic/warehouses-columnar" className={LINK}>
                    Warehouse
                  </Link>{" "}
                  লেসন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মোটসহ ফলাফল Excel এ নিলে সাবধান",
          content: (
            <ContentParagraph>
              ROLLUP এর ফলাফল Excel এ নিয়ে কেউ যদি পুরো payments Column এর নিচে আবার SUM বসান, যোগফল আসবে
              57, আসল 19 এর তিনগুণ, কারণ সাধারণ লাইন, উপমোট আর সর্বমোট তিনটাই যোগ হয়ে যায়। টাকার Column এ
              একইভাবে আসে 1471800.00, আসল 490600.00 এর তিনগুণ। মোটসহ Report পাঠালে সাথে লিখে দিন যে এর ভেতরে
              মোট আছে, অথবা GROUPING এর Column টা রেখে দিন যাতে Excel এ ছেঁকে নেওয়া যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>মালিকের জন্য মাসিক Report</SectionTitle>,
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
                প্রতি মাসের এক তারিখে Island Tours এর মালিকের কাছে একটা ছোট Report যায়: প্রতিটা মাসে কয়টা
                Booking, তার কয়টা বাতিল, আর নিশ্চিত Booking থেকে কত টাকা, সাথে নিচে সব মাসের মোট। এই একটা
                Query তে এই Module এর আগের লেসনের FILTER আর এই লেসনের ROLLUP একসাথে কাজ করে। FILTER এর
                বিস্তারিত আছে{" "}
                <Link href="/sql/topic/conditional-aggregation" className={LINK}>
                  Conditional Aggregation লেসনে
                </Link>
                ।
              </ContentParagraph>
              <ContentParagraph>
                মাসের ঘরে মোটের লাইনে লেখা থাকবে Total। এখানে মাস কখনো NULL হয় না, কারণ booked_at সবসময়
                ভরা, তবু লেবেলের জন্য COALESCE না, GROUPING ব্যবহার করা হয়েছে, যাতে অভ্যাসটা সঠিক থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মালিকের মাসিক Report"
              query={`SELECT CASE
         WHEN GROUPING(to_char(booked_at, 'YYYY-MM')) = 1 THEN 'Total'
         ELSE to_char(booked_at, 'YYYY-MM')
       END AS month,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_bdt
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'))
ORDER BY GROUPING(to_char(booked_at, 'YYYY-MM')), to_char(booked_at, 'YYYY-MM');`}
              caption="সাতটা লাইন, ছয় মাস আর একটা Total। 2026-01 এ 6টা Booking, তার 2টা বাতিল, নিশ্চিত থেকে 92000.00। Total এ 24টা Booking, 3টা বাতিল, নিশ্চিত থেকে 423600.00। FILTER প্রতিটা মোটের লাইনেও ঠিকমতো কাজ করে, কারণ মোটের লাইনও একটা দল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার শেষ চ্যালেঞ্জ। ফারুক সাহেব চান আরও খুঁটিনাটি Report: প্রতিটা মাসের ভেতরে প্রতিটা status
              এর সংখ্যা আর টাকা, মাসের মোট, আর সবশেষে সর্বমোট, প্রতিটা মোটের লাইনে পরিষ্কার লেখা।
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
                  Booking এর মাসিক Report বানান। চারটা Column, এই ক্রমে: month (মাস{" "}
                  <code className={CODE}>to_char(booked_at, &apos;YYYY-MM&apos;)</code> হিসেবে, সর্বমোটের
                  লাইনে লেখা <code className={CODE}>Grand total</code>), status (মাসের মোটের লাইনে আর
                  সর্বমোটের লাইনে লেখা <code className={CODE}>All</code>), bookings (সংখ্যা), amount
                  (total_bdt এর যোগফল)। ক্রম: মাস পুরনো থেকে নতুন, প্রতিটা মাসের ভেতরে status বর্ণানুক্রমে,
                  প্রতিটা মাসের All লাইন তার status গুলোর পরে, আর Grand total সবার শেষে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>ROLLUP (to_char(booked_at, &apos;YYYY-MM&apos;), status)</code>, দুটো
                  CASE তে GROUPING দিয়ে লেবেল, আর সাজাতে{" "}
                  <code className={CODE}>ORDER BY GROUPING(মাস), মাস, GROUPING(status), status</code>, যেখানে
                  মাসের জায়গায় পুরো to_char Expression। লেবেলের নাম দিয়ে সাজালে All উপরে চলে আসে, কারণ বড়
                  হাতের A ছোট হাতের অক্ষরের আগে।
                </>
              }
              solution={`SELECT CASE
         WHEN GROUPING(to_char(booked_at, 'YYYY-MM')) = 1 THEN 'Grand total'
         ELSE to_char(booked_at, 'YYYY-MM')
       END AS month,
       CASE WHEN GROUPING(status) = 1 THEN 'All' ELSE status END AS status,
       count(*) AS bookings,
       sum(total_bdt) AS amount
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'), status)
ORDER BY GROUPING(to_char(booked_at, 'YYYY-MM')),
         to_char(booked_at, 'YYYY-MM'),
         GROUPING(status),
         status;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>মোটসহ একটা Report বানানোর আট ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "কোন কোন মোট চাই, আগে লিখুন",
              description:
                "কাগজে Report এর ছক আঁকুন: কোন লাইনগুলো খুঁটিনাটি, কোথায় উপমোট, সর্বমোট লাগবে কিনা। এটাই ঠিক করে দেবে ROLLUP, CUBE নাকি GROUPING SETS।",
            },
            {
              title: "Column গুলো বড় থেকে ছোট সাজান",
              description:
                "যে ভাগের ভেতরে অন্য ভাগ, সেটা বাঁয়ে: দেশ তারপর শহর, মাস তারপর status। ROLLUP ডান দিক থেকে ছাড়ে, তাই এই ক্রমই উপমোট ঠিক করে।",
            },
            {
              title: "আগে সাধারণ GROUP BY চালান",
              description:
                "মোট ছাড়া Query টা আগে চালিয়ে দেখুন খুঁটিনাটি লাইনগুলো ঠিক আছে কিনা। ভুল এখানে থাকলে মোটগুলোও ভুল হবে।",
            },
            {
              title: "ROLLUP, CUBE বা GROUPING SETS এ মুড়ে দিন",
              description:
                "GROUP BY এর Column গুলো ঠিক যন্ত্রের ভেতরে রাখুন। সর্বমোট না চাইলে GROUP BY a, ROLLUP (b) এর মতো আংশিক রূপ।",
            },
            {
              title: "Data তে আসল NULL আছে কিনা দেখুন",
              description:
                "যে Column গুলো দিয়ে ভাগ করছেন, তাদের কোনোটায় NULL থাকতে পারে কিনা Table এর নিয়ম দেখে নিশ্চিত হন। থাকলে ফাঁকা ঘর দেখে মোট ধরে নেওয়া যাবে না।",
            },
            {
              title: "GROUPING দিয়ে লেবেল বসান",
              description:
                "CASE WHEN GROUPING(col) = 1 THEN 'All' দিয়ে মোটের লাইনে লেখা বসান, আর আসল NULL এর জন্য আলাদা লেবেল। COALESCE এখানে ব্যবহার করবেন না।",
            },
            {
              title: "GROUPING দিয়ে সাজান",
              description:
                "প্রতিটা ভাগের আগে তার GROUPING: ORDER BY GROUPING(a), a, GROUPING(b), b। তাহলে মোট সবসময় তার দলের পরে, যেভাবেই সাজান।",
            },
            {
              title: "মোটটা আলাদা করে মিলিয়ে নিন",
              description:
                "SELECT count(*) FROM table এর মতো একটা সহজ Query চালিয়ে সর্বমোটের সাথে মিলিয়ে দেখুন। না মিললে WHERE বা HAVING এর কোনো শর্ত মোটকে বদলে দিচ্ছে।",
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
              "COALESCE দিয়ে মোটের লেবেল",
              "Data এর আসল NULL ও মোটের লেবেল পায়, দুটো All guides লাইন",
              "CASE WHEN GROUPING(col) = 1",
            ],
            [
              "শুধু payments DESC দিয়ে সাজানো",
              "সর্বমোট সবচেয়ে বড়, তাই উঠে যায় একদম উপরে",
              "ORDER BY GROUPING(col), payments DESC",
            ],
            [
              "GROUPING এর ভেতরে SELECT এর Alias",
              "ERROR: column \"month\" does not exist",
              "GROUPING এর ভেতরে পুরো Expression লিখুন",
            ],
            [
              "HAVING দিয়ে ছোট দল বাদ",
              "উপমোটও কাটা পড়ে, লাইন যোগ করে সর্বমোট মেলে না",
              "Row ছাঁকতে WHERE, মোটের লাইন বাঁচাতে HAVING এ GROUPING দেখুন",
            ],
            [
              "ROLLUP এ Column উল্টো ক্রমে",
              "অকাজের উপমোট, যেমন প্রতিটা শহরের মোট, যেটা শহরের লাইনেরই কপি",
              "বড় ভাগ বাঁয়ে: ROLLUP (country, city)",
            ],
            [
              "মোটসহ Report এ LIMIT",
              "উপমোট গোনায় পড়ে, সর্বমোট কাটা যায়",
              "মোটসহ Report এ LIMIT দেবেন না, বা মোট ছাড়া Query তে দিন",
            ],
            [
              "Excel এ পুরো Column আবার SUM",
              "সংখ্যা তিনগুণ: 57, আসল 19",
              "Report এর সাথে GROUPING এর Column রাখুন, বা মোট আছে লিখে দিন",
            ],
            [
              "MySQL এ CUBE বা GROUPING SETS",
              "ERROR 3889 বা ERROR 1064",
              "MySQL এ WITH ROLLUP, বাকিটা UNION দিয়ে",
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
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: GROUPING SETS, CUBE, and ROLLUP
                  </a>
                  : ROLLUP আর CUBE যে GROUPING SETS এর সংক্ষিপ্ত রূপ, খালি Bracket এর দল, আর GROUP BY
                  DISTINCT, সব এক অংশে, উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-aggregate.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Aggregate Functions
                  </a>
                  : পাতার শেষের দিকে Grouping Operations টেবিলে GROUPING() এর সংজ্ঞা, কোন Bit কোন Column
                  এর।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/group-by-modifiers.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: GROUP BY Modifiers
                  </a>
                  : WITH ROLLUP, ROLLUP ( ) এর বিকল্প লেখা, GROUPING(), আর ORDER BY ও LIMIT এর সাথে ROLLUP
                  কীভাবে আচরণ করে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/OLAP_cube"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: OLAP cube
                  </a>
                  : CUBE নামটা কোথা থেকে এলো, আর Data কে ঘনকের মতো কয়েক দিক থেকে কাটার ধারণা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে MySQL কোর্সটা দেখছেন, GROUP BY অংশ
                  </a>
                  : GROUP BY, COUNT, MAX, SUM আর HAVING এর ঝালাই। ROLLUP সেখানে নেই, তাই এই লেসনটা ভিডিওর
                  পরের ধাপ।
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
                  একটা Report এ তিন রকম লাইন: সাধারণ লাইন, উপমোট আর সর্বমোট। GROUP BY শুধু প্রথমটা দেয়।
                </ListItem>
                <ListItem>
                  <code className={CODE}>ROLLUP (a, b)</code> ডান দিক থেকে একটা একটা Column ছাড়ে: (a, b),
                  (a), ( )। Column এর ক্রম বড় থেকে ছোট।
                </ListItem>
                <ListItem>
                  <code className={CODE}>CUBE (a, b)</code> সব দিকের মোট দেয়: (a, b), (a), (b), ( )। দল হয়
                  2 এর ঘাত n টা, তাই অল্প Column এ।
                </ListItem>
                <ListItem>
                  <code className={CODE}>GROUPING SETS</code> এ প্রতিটা দল নিজে লেখেন। ROLLUP আর CUBE এর
                  শর্টকাট।
                </ListItem>
                <ListItem>
                  মোটের লাইনের ফাঁকা ঘর আর Data এর NULL দেখতে এক। <code className={CODE}>GROUPING(col)</code>{" "}
                  বলে দেয় কোনটা মোট: 1 মানে মোট।
                </ListItem>
                <ListItem>
                  লেবেল বসাতে CASE এ GROUPING, সাজাতে ORDER BY তে প্রতিটা ভাগের আগে GROUPING। COALESCE দিয়ে
                  লেবেল নয়।
                </ListItem>
                <ListItem>
                  WHERE মোটের আগে ছাঁকে, HAVING মোটের পরে, তাই HAVING মোটের লাইনও কাটে। LIMIT কাটে সবশেষে।
                </ListItem>
                <ListItem>
                  MySQL এ WITH ROLLUP আর GROUPING() আছে, CUBE আর GROUPING SETS সাধারণ Server এ নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন আপনি একটা Query তেই খাতার মতো Report বানাতে পারেন। কিন্তু এখনো প্রতিটা দল ফলাফলে একটা
                সংখ্যা। পরের লেসনে দেখবেন একটা দলের সব মানকে এক লাইনে জুড়ে দেওয়া যায়, যেমন প্রতিটা Customer
                এর সব Booking এর নম্বর কমা দিয়ে একসাথে:{" "}
                <Link href="/sql/topic/string-array-agg" className={LINK}>
                  string_agg আর array_agg
                </Link>
                , আর সাথে পুরো Module 05 এর সারসংক্ষেপ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ কোথায়"],
    rows: [
      ["তিন তলার Report", "সাধারণ লাইন, উপমোট, সর্বমোট", "শাহানার Payment এর Report"],
      ["ROLLUP", "ডান দিক থেকে একটা একটা Column ছাড়ে", "ROLLUP (method, status), এগারো লাইন"],
      ["Column এর ক্রম", "বড় ভাগ বাঁয়ে, উপমোট সেই অনুযায়ী", "ROLLUP (country, city)"],
      ["GROUPING SETS", "প্রতিটা দল নিজে লেখা", "status আর মাস আলাদা, এক Query তে"],
      ["CUBE", "সব দিকের মোট, 2 এর ঘাত n টা দল", "CUBE (method, status), চোদ্দ লাইন"],
      ["দুই রকম NULL", "মোটের ফাঁকা আর Data এর ফাঁকা দেখতে এক", "Ratargul এর Guide নেই"],
      ["GROUPING()", "0 মানে দলে ছিল, 1 মানে মোট", "All guides বনাম No guide yet"],
      ["Bit এর সংখ্যা", "ডানের Column সবচেয়ে ছোট Bit", "সর্বমোটে GROUPING(মাস, status) = 3"],
      ["মোট সাজানো", "ORDER BY তে আগে GROUPING", "বড় আগে সাজালেও মোট নিচে"],
      ["আংশিক মোট", "GROUP BY a, ROLLUP (b)", "প্রতিটা মাসের মোট, সর্বমোট ছাড়া"],
      ["WHERE আর HAVING", "WHERE মোটের আগে, HAVING পরে", "HAVING এ bank এর উপমোট হারায়"],
      ["খালি ফলাফল", "PostgreSQL তবু সর্বমোট দেয়, count 0", "2027 সালের Payment"],
      ["MySQL", "WITH ROLLUP আছে, CUBE নেই", "ERROR 3889, ERROR 1064"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ROLLUP (method, status) কোন কোন দল বানায়?",
        options: [
          {
            key: "A",
            text: "(method, status) আর (method)",
            isCorrect: false,
            explanation: "খালি দলটা বাদ পড়েছে। ROLLUP শেষে কোনো Column না রেখে একটা সর্বমোটও বানায়।",
          },
          {
            key: "B",
            text: "(method, status), (method), ( )",
            isCorrect: true,
            explanation: "ঠিক। ডান দিক থেকে একটা একটা Column ছাড়ে: আগে status, তারপর method, শেষে খালি দল মানে সর্বমোট।",
          },
          {
            key: "C",
            text: "(method, status), (method), (status), ( )",
            isCorrect: false,
            explanation: "এটা CUBE। ROLLUP শুধু ডান দিক থেকে ছাড়ে, তাই শুধু status ধরে কোনো দল বানায় না।",
          },
          {
            key: "D",
            text: "(method), (status)",
            isCorrect: false,
            explanation: "এটা GROUPING SETS ((method), (status)), যেখানে সাধারণ লাইন আর সর্বমোট কোনোটাই নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "শাহানা প্রতিটা status এর উপমোট চান, Method এর না। কোনটা লিখবেন?",
        options: [
          {
            key: "A",
            text: "GROUP BY ROLLUP (method, status)",
            isCorrect: false,
            explanation: "এটা ডান দিকের status ছাড়ে, তাই উপমোট আসে প্রতিটা Method এর।",
          },
          {
            key: "B",
            text: "GROUP BY ROLLUP (status, method)",
            isCorrect: true,
            explanation: "ঠিক। এবার method ডানে, সেটাই আগে ছাড়া হয়, তাই প্রতিটা status এর উপমোট আসে: failed 1, paid 17, refunded 1।",
          },
          {
            key: "C",
            text: "GROUP BY method, status WITH CUBE",
            isCorrect: false,
            explanation: "WITH CUBE কোনো Database এর Syntax না। MySQL এ চালালে ERROR 1064।",
          },
          {
            key: "D",
            text: "GROUP BY status, method, ROLLUP ()",
            isCorrect: false,
            explanation: "খালি ROLLUP দিয়ে কোনো উপমোট আসে না। Column গুলো ROLLUP এর ভেতরেই দিতে হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "tours এ ROLLUP (guide_id) চালালে দুটো লাইনে guide_id NULL আসে, একটায় 1, একটায় 9। কোনটা সর্বমোট, নিশ্চিতভাবে কীভাবে জানবেন?",
        options: [
          {
            key: "A",
            text: "যেটা শেষে আছে সেটা",
            isCorrect: false,
            explanation: "দুটো লাইনই NULL, তাই ORDER BY guide_id তাদের মধ্যে কোনো নির্দিষ্ট ক্রম দেয় না।",
          },
          {
            key: "B",
            text: "যেটায় সংখ্যা বড়",
            isCorrect: false,
            explanation: "এখানে কাকতালীয়ভাবে মিলে যায়, কিন্তু নিয়ম হিসেবে ভুল। WHERE বা HAVING দিলে বা অন্য Data তে এই অনুমান ভেঙে যায়।",
          },
          {
            key: "C",
            text: "GROUPING(guide_id) যে লাইনে 1",
            isCorrect: true,
            explanation: "ঠিক। GROUPING দেখে লাইনটা কোন দল থেকে এসেছে, Data তে কী আছে না। মোটের লাইনে 1, Ratargul এর আসল দলে 0।",
          },
          {
            key: "D",
            text: "COALESCE(guide_id, 0) যে লাইনে 0",
            isCorrect: false,
            explanation: "COALESCE দুটো NULL কেই 0 বানায়, তাই দুটো লাইনই একই রকম দেখায়।",
          },
        ],
      },
      {
        id: 4,
        text: "CUBE এ চারটা Column দিলে কয়টা দল তৈরি হয়?",
        options: [
          {
            key: "A",
            text: "৪টা",
            isCorrect: false,
            explanation: "প্রতিটা Column একটা দল না। প্রতিটা Column হয় দলে আছে নয়তো নেই, তাই সম্ভাবনা গুণ হয়।",
          },
          {
            key: "B",
            text: "৫টা",
            isCorrect: false,
            explanation: "n + 1 হলো ROLLUP এর হিসাব, চারটা Column এ পাঁচটা দল। CUBE এ আরও অনেক বেশি।",
          },
          {
            key: "C",
            text: "৮টা",
            isCorrect: false,
            explanation: "৮টা হয় তিনটা Column এ। চারটায় তার দ্বিগুণ।",
          },
          {
            key: "D",
            text: "১৬টা",
            isCorrect: true,
            explanation: "ঠিক। 2 এর ঘাত 4 = 16। এই কারণেই CUBE এ অল্প Column রাখতে হয়।",
          },
        ],
      },
      {
        id: 5,
        text: "ROLLUP এর Report এ ORDER BY payments DESC দিলে কী হয়?",
        options: [
          {
            key: "A",
            text: "সর্বমোট একদম উপরে চলে যায়",
            isCorrect: true,
            explanation: "ঠিক। সর্বমোট সবচেয়ে বড় সংখ্যা, তাই বড় আগে সাজালে সেটাই প্রথমে। আগে GROUPING দিয়ে সাজালে সমস্যা মেটে।",
          },
          {
            key: "B",
            text: "সর্বমোট বাদ পড়ে যায়",
            isCorrect: false,
            explanation: "ORDER BY কোনো লাইন বাদ দেয় না, শুধু ক্রম বদলায়।",
          },
          {
            key: "C",
            text: "Error আসে, কারণ মোটের লাইন সাজানো যায় না",
            isCorrect: false,
            explanation: "মোটের লাইনও সাধারণ লাইনের মতো সাজানো যায়, কোনো Error নেই।",
          },
          {
            key: "D",
            text: "মোট সবসময় নিচেই থাকে",
            isCorrect: false,
            explanation: "মোট নিচে থাকার কোনো নিশ্চয়তা নেই। ছোট থেকে বড় সাজালে NULL শেষে আসে বলে মনে হয়, বড় থেকে ছোট সাজালে উল্টো।",
          },
        ],
      },
      {
        id: 6,
        text: "GROUP BY ROLLUP (method, status) এর সাথে HAVING count(*) > 2 দিলে bank এর কী হয়?",
        options: [
          {
            key: "A",
            text: "bank এর সাধারণ লাইন যায়, উপমোট থাকে",
            isCorrect: false,
            explanation: "bank এর উপমোটেও সংখ্যা 2, আর HAVING মোটের লাইনেও খাটে, তাই সেটাও যায়।",
          },
          {
            key: "B",
            text: "bank এর দুটো লাইনই হারিয়ে যায়, সর্বমোট তবু 19 থাকে",
            isCorrect: true,
            explanation: "ঠিক। HAVING কাজ করে মোট বানানোর পরে, তাই 2 এর উপমোটও কাটে। সর্বমোট 19 বলে HAVING পার হয়, অথচ উপরের লাইন যোগ করে আর 19 হয় না।",
          },
          {
            key: "C",
            text: "সর্বমোট কমে 17 হয়ে যায়",
            isCorrect: false,
            explanation: "সংখ্যা কমে WHERE দিলে, কারণ WHERE মোটের আগে Row ছাঁকে। HAVING মোটের সংখ্যা বদলায় না, শুধু লাইন বাদ দেয়।",
          },
          {
            key: "D",
            text: "কিছুই বদলায় না",
            isCorrect: false,
            explanation: "bank এর দুটো লাইনেই সংখ্যা 2, যেটা 2 এর বেশি না, তাই দুটোই বাদ পড়ে।",
          },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL এ GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'), status) এর মোটের লাইন চিনতে GROUPING(month) লিখলেন, যেখানে month হলো SELECT এ দেওয়া নাম। কী হবে?",
        options: [
          {
            key: "A",
            text: "ঠিকঠাক কাজ করবে",
            isCorrect: false,
            explanation: "GROUP BY তে Alias চললেও GROUPING এর ভেতরে চলে না। PostgreSQL 18 এ চালিয়ে দেখা।",
          },
          {
            key: "B",
            text: "ERROR: column \"month\" does not exist",
            isCorrect: true,
            explanation: "ঠিক। GROUPING এর ভেতরে GROUP BY তে লেখা পুরো Expression টাই লিখতে হয়: GROUPING(to_char(booked_at, 'YYYY-MM'))।",
          },
          {
            key: "C",
            text: "সব লাইনে 0 আসবে",
            isCorrect: false,
            explanation: "Query চলেই না, তাই কোনো মান আসে না।",
          },
          {
            key: "D",
            text: "সব লাইনে 1 আসবে",
            isCorrect: false,
            explanation: "Query চলেই না, Error দিয়ে থেমে যায়।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এর সাধারণ Server এ কোনটা চলে?",
        options: [
          {
            key: "A",
            text: "GROUP BY CUBE (method, status)",
            isCorrect: false,
            explanation: "ERROR 3889: CUBE শুধু HeatWave নামের Secondary Engine এ চলে, সাধারণ Table এ না।",
          },
          {
            key: "B",
            text: "GROUP BY GROUPING SETS ((method), (status))",
            isCorrect: false,
            explanation: "MySQL এ GROUPING SETS এর Syntax ই নেই, ERROR 1064।",
          },
          {
            key: "C",
            text: "GROUP BY method, status WITH ROLLUP",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর ঐতিহ্যবাহী উপমোটের লেখা, সাথে GROUPING() দিয়ে লেবেলও বসানো যায়।",
          },
          {
            key: "D",
            text: "GROUP BY method, ROLLUP (status)",
            isCorrect: false,
            explanation: "আংশিক ROLLUP MySQL এ চলে না, ERROR 1064।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: হাতে বসানো যোগফল ছাড়া একটা Report",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>শাহানার Report:</strong> payments Table থেকে method আর status অনুযায়ী Report, প্রতিটা Method এর
        উপমোট আর সর্বমোট, GROUPING দিয়ে All লেবেলসহ। নিচে লিখুন সর্বমোটের সংখ্যা আলাদা একটা count(*) Query র
        সাথে মিলেছে কিনা।
      </span>,
      <span key="2">
        <strong>দুই দিক:</strong> একই Report CUBE দিয়ে বানান, তারপর GROUPING SETS দিয়ে হুবহু একই ফলাফল আনুন।
        দুটো Query আর দুটোর লাইনের সংখ্যা জমা দিন।
      </span>,
      <span key="3">
        <strong>NULL এর ফাঁদ:</strong> tours এ ROLLUP (guide_id) চালিয়ে আগে COALESCE দিয়ে লেবেল বসান, তারপর
        GROUPING দিয়ে। দুটো ফলাফল পাশাপাশি রেখে তিন লাইনে লিখুন প্রথমটা কেন ভুল।
      </span>,
      <span key="4">
        <strong>রিভিউ:</strong> একজন সহকর্মী লিখেছেন GROUP BY ROLLUP (method, status) HAVING count(*) &gt; 2
        ORDER BY payments DESC। এই Query তে কয়টা সমস্যা আছে খুঁজে বের করুন, প্রতিটার কারণ আর ঠিক করা Query
        লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু Excel এ Pivot Table বানান। তাঁকে ছয় লাইনে বোঝান
        ROLLUP আর CUBE কী, Pivot Table এর কোন জিনিসের সাথে মেলে, আর কখন তিনি Pivot Table ই ব্যবহার করবেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">শাহানার Report এর Query, ফলাফল আর মিলিয়ে দেখার Query</span>,
      <span key="d2">CUBE আর GROUPING SETS এর দুটো Query, লাইনের সংখ্যাসহ</span>,
      <span key="d3">COALESCE আর GROUPING এর দুটো ফলাফল আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d4">সহকর্মীর Query এর সমস্যার তালিকা আর ঠিক করা Query</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ মোটসহ Report",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "ROLLUP এর প্রথম স্বাদ",
        description:
          "প্রথম ফাইল চালান। এক Column এর ROLLUP এ কয়টা লাইন, আর দুই Column এ কয়টা, মন্তব্যের সাথে মেলান। psql এ NULL ফাঁকা দেখায়, তাই \\pset null '(null)' দিয়ে নিন।",
      },
      {
        title: "ক্রম উল্টে দেখা",
        description:
          "দ্বিতীয় ফাইলে একই Data, ROLLUP এর Column উল্টো ক্রমে। উপমোট কোন Column এর হলো, আর লাইনের সংখ্যা কেন এক কম, নিজের খাতায় লিখুন।",
      },
      {
        title: "GROUPING SETS আর CUBE",
        description:
          "তৃতীয় ফাইলে দুটো Query। দুটোর লাইনের সংখ্যা গুনুন, আর CUBE এর কোন তিনটা লাইন ROLLUP এ ছিল না, চিহ্নিত করুন।",
      },
      {
        title: "দুই রকম NULL",
        description:
          "চতুর্থ ফাইলের প্রথম Query তে দুটো All guides লাইন আসবে, দ্বিতীয়টায় ঠিক লেবেল। পার্থক্যটা নিজের চোখে দেখুন।",
      },
      {
        title: "সাজানো আর ছাঁকা",
        description:
          "পঞ্চম ফাইলে DESC সাজানো, GROUPING দিয়ে সাজানো, আর HAVING এর ফাঁদ। প্রতিটার প্রথম লাইন মন্তব্যের সাথে মেলান।",
      },
      {
        title: "মালিকের Report",
        description:
          "ষষ্ঠ ফাইলটা এই লেসনের Project Example। ফলাফলের Total লাইনের তিনটা সংখ্যা আলাদা তিনটা ছোট Query দিয়ে মিলিয়ে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-rollup.sql",
        code: `\\pset null '(null)'

SELECT method, count(*) AS payments, sum(amount_bdt) AS amount
FROM payments
GROUP BY ROLLUP (method)
ORDER BY method;
-- (5 rows), শেষ লাইন: (null) | 19 | 490600.00

SELECT method, status, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method, status)
ORDER BY method, status;
-- (11 rows): 6টা সাধারণ, 4টা উপমোট, 1টা সর্বমোট`,
      },
      {
        language: "sql",
        filename: "02-order.sql",
        code: `SELECT status, method, count(*) AS payments
FROM payments
GROUP BY ROLLUP (status, method)
ORDER BY status, method;
-- (10 rows), উপমোট: failed 1, paid 17, refunded 1, সর্বমোট 19

SELECT country, city, count(*) AS customers
FROM customers
GROUP BY ROLLUP (country, city)
ORDER BY country, city;
-- (14 rows), Bangladesh এর উপমোট 12, সর্বমোট 15`,
      },
      {
        language: "sql",
        filename: "03-sets-and-cube.sql",
        code: `SELECT status, to_char(booked_at, 'YYYY-MM') AS month, count(*) AS bookings
FROM bookings
GROUP BY GROUPING SETS ((status), (to_char(booked_at, 'YYYY-MM')), ())
ORDER BY status, month;
-- (10 rows), শেষ লাইন: (null) | (null) | 24

SELECT method, status, count(*) AS payments
FROM payments
GROUP BY CUBE (method, status)
ORDER BY method, status;
-- (14 rows), নতুন তিনটা: (null) failed 1, (null) paid 17, (null) refunded 1`,
      },
      {
        language: "sql",
        filename: "04-two-nulls.sql",
        code: `SELECT COALESCE(guide_id::text, 'All guides') AS guide, count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id)
ORDER BY guide;
-- (6 rows), দুটো লাইনে All guides: একটায় 9, একটায় 1

SELECT CASE
         WHEN GROUPING(guide_id) = 1 THEN 'All guides'
         WHEN guide_id IS NULL THEN 'No guide yet'
         ELSE 'Guide ' || guide_id
       END AS guide,
       count(*) AS tours
FROM tours
GROUP BY ROLLUP (guide_id)
ORDER BY GROUPING(guide_id), guide_id NULLS LAST;
-- (6 rows), শেষ দুটো: No guide yet 1, All guides 9`,
      },
      {
        language: "sql",
        filename: "05-sort-and-filter.sql",
        code: `SELECT method, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method)
ORDER BY payments DESC, method;
-- (5 rows), প্রথম লাইন: (null) | 19

SELECT method, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method)
ORDER BY GROUPING(method), payments DESC, method;
-- (5 rows), প্রথম লাইন: bkash | 7, শেষ লাইন: (null) | 19

SELECT method, status, count(*) AS payments
FROM payments
GROUP BY ROLLUP (method, status)
HAVING count(*) > 2
ORDER BY GROUPING(method), method, GROUPING(status), status;
-- (7 rows), bank এর কোনো লাইন নেই, সর্বমোট 19`,
      },
      {
        language: "sql",
        filename: "06-owner-report.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT CASE
         WHEN GROUPING(to_char(booked_at, 'YYYY-MM')) = 1 THEN 'Total'
         ELSE to_char(booked_at, 'YYYY-MM')
       END AS month,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_bdt
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'))
ORDER BY GROUPING(to_char(booked_at, 'YYYY-MM')), to_char(booked_at, 'YYYY-MM');
-- (7 rows), শেষ লাইন: Total | 24 | 3 | 423600.00

SELECT count(*) FROM bookings;                                       -- 24
SELECT count(*) FROM bookings WHERE status = 'cancelled';            -- 3
SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed';      -- 423600.00`,
      },
    ],
    tip: (
      <ContentParagraph>
        psql এ মোটের লাইনের ফাঁকা ঘর চোখে পড়ে না, তাই প্রথমেই <code className={CODE}>\pset null &apos;(null)&apos;</code>{" "}
        দিন। মাস দিয়ে ভাগ করা Query গুলো Dhaka সময়ে গোনা, তাই আপনার psql এর TimeZone আলাদা হলে ষষ্ঠ ফাইলের মতো
        শুরুতে SET TimeZone দিয়ে নিন।
      </ContentParagraph>
    ),
  },
};
