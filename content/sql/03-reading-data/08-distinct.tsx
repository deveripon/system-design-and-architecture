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
  DistinctOnLab,
  DistinctStepLab,
} from "../../../components/course/topics/reading-data/distinct-animations";
import {
  DistinctFunnelDiagram,
  DistinctOnDiagram,
  WholeRowDiagram,
} from "../../../components/course/topics/reading-data/distinct-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border/60";

export const distinctContent: TopicData = {
  id: "distinct",
  introduction: {
    badge: "MODULE 03 · LESSON 08",
    title: <SectionTitle>DISTINCT: একই জিনিস একবারই</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Marketing এর দায়িত্বে থাকা নাদিয়া একটা সহজ প্রশ্ন নিয়ে
          এলেন: আমাদের Customer রা কোন কোন দেশ থেকে আসেন? তিনি বিদেশি ভ্রমণকারীদের
          জন্য আলাদা বিজ্ঞাপন বানাতে চান, তাই শুধু দেশগুলোর নাম দরকার। আপনি
          আত্মবিশ্বাসের সাথে লিখলেন SELECT country FROM customers, আর উত্তরে এল পনেরোটা
          Row। তার বারোটাতে লেখা Bangladesh।
        </ContentParagraph>
        <ContentParagraph>
          Query টা ভুল না। আপনি প্রতিটা Customer এর দেশ চেয়েছেন, Database প্রতিটা
          Customer এর দেশ দিয়েছে। কিন্তু নাদিয়া চেয়েছিলেন দেশের তালিকা, Customer এর
          তালিকা না। এই দুই প্রশ্নের মাঝখানের ফাঁকটা পূরণ করে একটা ছোট শব্দ: DISTINCT।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি দেখবেন DISTINCT কীভাবে ঠিক করে কোন দুটো Row একই, কেন সে একটা
          Column না দেখে পুরো Row দেখে, পাঁচটা NULL কে কেন একটা ধরে, ORDER BY এর সাথে
          তার কোন নিয়মে Error আসে, আর PostgreSQL এর নিজস্ব DISTINCT ON দিয়ে কীভাবে
          প্রতিটা Customer এর সবচেয়ে নতুন Booking টা বের করা যায়। শেষে শিখবেন কখন
          DISTINCT লেখা আসলে একটা সতর্কসংকেত, যে Query এর অন্য কোথাও গোলমাল আছে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "হাজিরা খাতায় একজনের নাম প্রতিদিন লেখা হয়। মাস শেষে কারা ক্লাসে এসেছিল জানতে চাইলে কেউ পুরো খাতা ফেরত দেয় না, নামগুলো একবার করে লিখে দেয়।",
      author: "DISTINCT",
      role: "Lesson 08",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>হাজিরা খাতা আর নামের তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা স্কুলের হাজিরা খাতার কথা ভাবুন। প্রতিদিন যে ছাত্র আসে, তার নাম
                একটা নতুন লাইনে লেখা হয়। মাস শেষে খাতায় তিনশো লাইন, অথচ ক্লাসে ছাত্র
                মাত্র তিরিশজন। হেডস্যার যদি জানতে চান এই মাসে কারা কারা অন্তত একদিন
                এসেছে, শিক্ষক পুরো খাতা ধরিয়ে দেন না। তিনি খাতা ধরে নিচে নামেন, আর
                প্রতিটা নাম প্রথমবার চোখে পড়লে একটা কাগজে টুকে নেন। দ্বিতীয়বার সেই
                নাম এলে কিছুই লেখেন না।
              </ContentParagraph>
              <ContentParagraph>
                Database এর Table অনেকটা এই খাতার মতো। bookings Table এ প্রতিটা Booking
                এর জন্য একটা Row, তাই একজন Customer যতবার বুক করেছেন ততবার তাঁর
                customer_id এসেছে। customers Table এ প্রতিটা মানুষের জন্য একটা Row, তাই
                একই দেশ বারবার এসেছে। SELECT এর স্বভাবই হলো প্রতিটা Row এর জন্য উত্তরে
                একটা Row দেওয়া। কোনো মান আগে এসেছে কিনা, সেটা সে নিজে থেকে দেখে না।
              </ContentParagraph>
              <ContentParagraph>
                DISTINCT হলো সেই শিক্ষকের কাজটা। SELECT এর ঠিক পরে এই একটা শব্দ লিখলে
                PostgreSQL উত্তর তৈরি করে যথারীতি, তারপর উত্তরের প্রতিটা Row দেখে আর
                যেগুলো হুবহু আগে একবার এসেছে সেগুলো ফেলে দেয়। ফলে প্রতিটা আলাদা
                জিনিস উত্তরে থাকে ঠিক একবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে DISTINCT",
          content: (
            <ContentParagraph>
              DISTINCT উত্তরের Row গুলো থেকে হুবহু একই Row এর বাড়তি Copy গুলো বাদ দেয়।
              Table এর Data এতে একটুও বদলায় না। বদলায় শুধু আপনি যে উত্তরটা দেখছেন,
              সেটা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "why-repeats",
      subHeader: { index: "002", title: "Why Repeats" },
      title: <SectionTitle>উত্তরে একই জিনিস বারবার আসে কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT শেখার আগে একটা জিনিস পরিষ্কার হওয়া দরকার: পুনরাবৃত্তি কোনো
                ভুল না। Table এর প্রতিটা Row এর নিজস্ব পরিচয় আছে, Primary Key।
                customers Table এ পনেরোটা Row মানে পনেরোজন আলাদা মানুষ। কিন্তু আপনি
                যখন শুধু country Column টা চাইলেন, প্রতিটা মানুষের পরিচয় দেওয়া
                customer_id আর উত্তরে নেই। বারোজন মানুষের Row থেকে শুধু তাদের দেশটা
                রয়ে গেল, আর সেই বারোটা দেশ দেখতে হুবহু একই।
              </ContentParagraph>
              <ContentParagraph>
                মানে পুনরাবৃত্তি জন্ম নেয় যখন আপনি এমন কয়েকটা Column বেছে নেন যেগুলো
                একটা Row কে আলাদা করে চেনাতে পারে না। পুরো Row চাইলে, বা Primary Key
                সহ চাইলে, কখনো দুটো Row একই হবে না। শুধু দেশ, শুধু শহর, শুধু status চাইলে
                হবে। Island Tours এর Database এ এমন প্রশ্ন রোজ আসে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  আমাদের Customer রা কোন কোন দেশের? উত্তর country থেকে, কিন্তু Customer
                  প্রতি না, দেশ প্রতি একবার।
                </ListItem>
                <ListItem>
                  কোন কোন উপায়ে টাকা নেওয়া হয়েছে? উত্তর payments.method থেকে, প্রতিটা
                  উপায় একবার।
                </ListItem>
                <ListItem>
                  কারা কারা অন্তত একবার বুক করেছেন? উত্তর bookings.customer_id থেকে,
                  প্রতিটা মানুষ একবার, যতবারই বুক করুন।
                </ListItem>
                <ListItem>
                  কোন অঞ্চলে কোন ধরনের জায়গা আছে? উত্তর destinations এর region আর kind
                  থেকে, প্রতিটা জোড়া একবার।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চারটা প্রশ্নেরই গঠন এক: কোন কোন আলাদা মান আছে। কতবার আছে, সেটা এখানে
                প্রশ্ন না। কতবার আছে জানতে চাইলে দরকার গোনা, যেটা Module 05 এর কাজ।
                DISTINCT শুধু বলে কী কী আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DistinctFunnelDiagram /> },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "distinct",
      subHeader: { index: "003", title: "DISTINCT" },
      title: <SectionTitle>SELECT এর ঠিক পরে একটা শব্দ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT বসে SELECT এর ঠিক পরে, Column এর তালিকার আগে। এর জায়গা একটাই,
                কারণ DISTINCT কোনো একটা Column এর গায়ে লাগানো জিনিস না। এটা পুরো
                SELECT এর উপর একটা নির্দেশ: এই SELECT এর উত্তরে কোনো Row এর বাড়তি Copy
                থাকবে না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে দুটো Query একসাথে আছে। প্রথমটা DISTINCT ছাড়া, দ্বিতীয়টা
                DISTINCT সহ। Run চাপুন আর Row এর সংখ্যা মিলিয়ে দেখুন। দ্বিতীয়টায় একটা
                ORDER BY ও আছে, কারণ DISTINCT নিজে উত্তরকে সাজানোর কোনো কথা দেয় না।
                সেই কথায় একটু পরে আসছি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পনেরো থেকে চার"
              query={`SELECT country
FROM customers;

SELECT DISTINCT country
FROM customers
ORDER BY country;`}
              caption="প্রথম উত্তরে পনেরোটা Row, Bangladesh বারোবার। দ্বিতীয় উত্তরে চারটা: Bangladesh, India, Malaysia, United Kingdom। Table এ এখনো পনেরোজন Customer আছেন, কিছুই মোছা হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে লিখুন। destinations Table এ প্রতিটা জায়গার একটা region আছে,
              মানে বাংলাদেশের কোন বিভাগে। সাতটা জায়গা, কিন্তু বিভাগ এর চেয়ে কম, কারণ
              কয়েকটা জায়গা একই বিভাগে।
            </ContentParagraph>
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
                  destinations Table এ যত আলাদা <code className={CODE}>region</code>{" "}
                  আছে, সেগুলোর তালিকা দিন, বর্ণমালার ক্রমে সাজিয়ে। উত্তরে শুধু একটা
                  Column থাকবে।
                </>
              }
              hint={
                <>
                  উপরের দ্বিতীয় Query টাই প্রায়: Table এর নাম আর Column এর নাম বদলান।
                  বর্ণমালার ক্রম মানে <code className={CODE}>ORDER BY region</code>।
                </>
              }
              solution={`SELECT DISTINCT region
FROM destinations
ORDER BY region;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              জায়গা ভুল হলে কী হয়? আন্দাজ করবেন Error আসবে। PostgreSQL এ আসে না, আর
              সেটাই বিপদ। নিচের বক্সে DISTINCT লেখা হয়েছে country র পরে। চালিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল জায়গায় DISTINCT"
              query={`SELECT country DISTINCT
FROM customers;`}
              caption="কোনো Error নেই, পনেরোটা Row, আর Column এর মাথায় লেখা distinct। PostgreSQL এ AS না লিখেও Column কে নতুন নাম, মানে Alias, দেওয়া যায়, তাই সে DISTINCT শব্দটাকে country র নতুন নাম ধরে নিয়েছে। বাড়তি Copy একটাও বাদ যায়নি। Column এর নাম distinct দেখলেই বুঝবেন শব্দটা ভুল জায়গায় বসেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              SELECT DISTINCT country FROM customers ORDER BY country; MySQL 8.4 এ হুবহু
              একই লেখা, একই চারটা Row। তবে ভুল জায়গার DISTINCT এ MySQL চুপ থাকে না:
              SELECT country DISTINCT FROM customers চালালে আসে ERROR 1064 (42000), একটা
              Syntax Error। MySQL এ DISTINCTROW নামে একটা সমার্থক শব্দও আছে, একই কাজ
              করে, তবে প্রায় কেউ ব্যবহার করেন না। ভিডিওতে দেখলে চিনে নেবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "whole-row",
      subHeader: { index: "004", title: "Whole Row" },
      title: <SectionTitle>DISTINCT একটা Column দেখে না, পুরো Row দেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নতুনদের সবচেয়ে বড় ভুল ধারণা এটা: SELECT DISTINCT region, kind লিখলে
                DISTINCT শুধু region এর উপর খাটে, আর kind এমনি এমনি পাশে বসে থাকে। আসলে
                তা না। DISTINCT এর পরে যতগুলো Column লেখা আছে, সবগুলো মিলিয়ে একটা Row
                তৈরি হয়, আর দুটো Row একই ধরা হয় শুধু তখন, যখন প্রতিটা Column এর মান
                একই।
              </ContentParagraph>
              <ContentParagraph>
                destinations Table এর সাতটা Row দিয়ে পরীক্ষা করা যাক। region এর আলাদা
                মান চারটা, kind এর পাঁচটা। দুটো একসাথে চাইলে কয়টা আসবে? চার না, পাঁচও
                না। আসবে ছয়টা, কারণ সাতটা Row এর মধ্যে শুধু একটা জোড়া হুবহু দুইবার আছে:
                Sajek Valley আর Bandarban, দুটোই Chattogram এর hills।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WholeRowDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই সাত Row, তিনটা প্রশ্ন"
              query={`SELECT DISTINCT region FROM destinations ORDER BY region;

SELECT DISTINCT kind FROM destinations ORDER BY kind;

SELECT DISTINCT region, kind
FROM destinations
ORDER BY region, kind;`}
              caption="চার, পাঁচ, ছয়। তৃতীয় উত্তরে Chattogram চারবার আছে, কারণ চারটা আলাদা kind এর সাথে। DISTINCT জোড়াটা দেখছে, region একা না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এর মানে একটা সহজ নিয়ম: DISTINCT এর উত্তরে Row এর সংখ্যা কখনো কমে না যখন
              আপনি আরেকটা Column যোগ করেন। প্রতিটা নতুন Column Row গুলোকে আরও আলাদা হওয়ার
              সুযোগ দেয়। আর যদি সেই নতুন Column টা Primary Key হয়, যেমন destination_id,
              তাহলে প্রতিটা Row আলাদা হয়ে যায় আর DISTINCT এর আর কিছুই করার থাকে না।
            </ContentParagraph>
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
                  Customer রা যেসব শহর থেকে এসেছেন, তার প্রতিটা আলাদা{" "}
                  <code className={CODE}>city</code> আর{" "}
                  <code className={CODE}>country</code> এর জোড়া দিন। Column এর ক্রম:
                  আগে city, তারপর country। সাজাবেন আগে country অনুযায়ী, একই দেশের
                  ভেতরে city অনুযায়ী।
                </>
              }
              hint={
                <>
                  দুটো Column একসাথে DISTINCT এর পরে লিখুন। সাজানোর জন্য ORDER BY তে দুটো
                  Column, আগে যেটা দিয়ে মূলত সাজাতে চান সেটা:{" "}
                  <code className={CODE}>ORDER BY country, city</code>।
                </>
              }
              solution={`SELECT DISTINCT city, country
FROM customers
ORDER BY country, city;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "step-through",
      subHeader: { index: "005", title: "Step Through It" },
      title: <SectionTitle>Row ধরে ধরে DISTINCT এর কাজ দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ আসল Sample Data এর চারটা Column আছে। একটা বেছে নিন, তারপর Next
              row চাপতে থাকুন। প্রতিটা Row এ DISTINCT একই প্রশ্ন করে: এই মানটা কি আগে
              দেখেছি? bookings.status দিয়ে শুরু করলে একটা মজার জিনিস ধরা পড়বে: তেরো
              নম্বর Row পর্যন্ত মনে হবে status মাত্র দুটো। তারপর চোদ্দ নম্বরে প্রথম pending
              আসে। DISTINCT এর উত্তর তাই পুরো Table পড়া শেষ হওয়ার আগে কখনো সম্পূর্ণ না।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DistinctStepLab /> },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "nulls",
      subHeader: { index: "006", title: "NULL Counts Once" },
      title: <SectionTitle>পাঁচটা NULL, উত্তরে একটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL এর লেসনে
                </Link>{" "}
                দেখেছেন, NULL মানে অজানা, আর একটা অজানাকে আরেকটা অজানার সাথে = দিয়ে
                তুলনা করলে উত্তর সত্যও না মিথ্যাও না, অজানা। তাই WHERE guide_id = NULL
                কোনোদিন একটা Row ও আনে না।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে DISTINCT এর সামনে পাঁচটা NULL এলে কী হয়? যুক্তি মানলে মনে হতে
                পারে প্রতিটা NULL আলাদা, তাই পাঁচটাই থাকবে। কিন্তু SQL এর নিয়ম এখানে
                আলাদা: DISTINCT এর কাছে সব NULL একই দলের। উত্তরে NULL থাকে ঠিক একবার।
                PostgreSQL এর Docs এটা স্পষ্ট লিখে রেখেছে: এই তুলনায় NULL গুলোকে সমান
                ধরা হয়। মানে DISTINCT এর তুলনা চলে IS NOT DISTINCT FROM এর মতো, যে
                অপারেটর আপনি NULL এর লেসনে দেখেছেন, যেখানে NULL আর NULL একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE আর DISTINCT, NULL এর সাথে দুই রকম আচরণ"
              query={`SELECT DISTINCT guide_id
FROM tours
ORDER BY guide_id;

SELECT guide_id
FROM tours
WHERE guide_id = NULL;

SELECT DISTINCT phone
FROM customers
ORDER BY phone;`}
              caption="প্রথম উত্তরে পাঁচটা Row: 1, 2, 3, 4 আর একটা NULL (Ratargul Swamp Boat Day এর Guide নেই)। দ্বিতীয় উত্তরে শূন্য Row, কারণ = NULL কখনো সত্য না। তৃতীয় উত্তরে দশটা ফোন নম্বর আর একটা NULL, মোট এগারো, যদিও পাঁচজনের নম্বর নেই। PostgreSQL ছোট থেকে বড় সাজালে NULL কে সবার শেষে রাখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DISTINCT এর NULL আর COUNT এর NULL এক না",
          content: (
            <ContentParagraph>
              SELECT DISTINCT guide_id উত্তরে NULL কে একটা আলাদা মান হিসেবে দেখায়, তাই
              পাঁচটা Row। কিন্তু count(DISTINCT guide_id) গুনবে চারটা, কারণ গোনার Function
              গুলো NULL কে একদম বাদ দেয়। একই Data, দুই প্রশ্নে দুই উত্তর। কেন এমন হয়,
              সেটা{" "}
              <Link href="/sql/topic/aggregate-functions" className={LINK}>
                Module 05 এর প্রথম লেসনে
              </Link>{" "}
              বিস্তারিত। আপাতত মনে রাখুন: কত রকম মান আছে গুনতে গিয়ে NULL কে মান ধরবেন কিনা,
              সেটা আপনার প্রশ্নের উপর নির্ভর করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL ও DISTINCT এ সব NULL কে একটা ধরে, তাই SELECT DISTINCT guide_id সেখানেও
              পাঁচটা Row দেয়। পার্থক্য শুধু ক্রমে: MySQL ছোট থেকে বড় সাজালে NULL কে সবার
              আগে রাখে, PostgreSQL সবার শেষে। MySQL 8.4 এ চালিয়ে দেখা ফলাফল: NULL, 1, 2,
              3, 4।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "filter-first",
      subHeader: { index: "007", title: "Filter First" },
      title: <SectionTitle>আগে WHERE ছাঁকে, তারপর DISTINCT বাছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <Link href="/sql/topic/query-order" className={LINK}>
                  Query এর লজিক্যাল ক্রমের লেসনে
                </Link>{" "}
                দেখেছেন, PostgreSQL আগে FROM থেকে Row আনে, তারপর WHERE দিয়ে ছাঁকে, তারপর
                SELECT এর Column গুলো তৈরি করে, আর তারপরই DISTINCT বাড়তি Copy ফেলে দেয়।
                এর মানে DISTINCT সবসময় কাজ করে ছাঁকা হয়ে যাওয়া Row এর উপর। যে Row WHERE এ
                বাদ পড়েছে, DISTINCT তাকে কখনো দেখেই না।
              </ContentParagraph>
              <ContentParagraph>
                এই ক্রম থেকে একটা খুব কাজের প্যাটার্ন বেরিয়ে আসে, যেটা আপনি বারবার
                লিখবেন: কারা কিছু একটা করেছে। bookings Table এ প্রতিটা Booking এর
                customer_id আছে। DISTINCT customer_id মানে যাঁরা অন্তত একবার বুক
                করেছেন। আর WHERE status = &apos;confirmed&apos; যোগ করলে মানে যাঁদের অন্তত
                একটা Booking নিশ্চিত হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কারা অন্তত একবার বুক করেছেন"
              query={`SELECT DISTINCT customer_id
FROM bookings
ORDER BY customer_id;

SELECT count(*) AS booking_rows,
       count(DISTINCT customer_id) AS customers_who_booked
FROM bookings;`}
              caption="প্রথম উত্তরে চোদ্দটা customer_id, ১ থেকে ১৪। পনেরো নম্বর, Imran Kabir, এখনো কিছু বুক করেননি, তাই নেই। দ্বিতীয় Query টা Module 05 এর একটা ঝলক: চব্বিশটা Booking, কিন্তু মানুষ চোদ্দজন।"
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
                  bKash দিয়ে করা Payment গুলো কোন কোন{" "}
                  <code className={CODE}>status</code> এ আছে? শুধু status এর আলাদা মানগুলো
                  দিন, যেকোনো ক্রমে।
                </>
              }
              hint={
                <>
                  payments Table এ method Column বলে কোন উপায়ে টাকা এসেছে। আগে WHERE
                  দিয়ে শুধু <code className={CODE}>method = &apos;bkash&apos;</code> রাখুন,
                  তারপর DISTINCT status।
                </>
              }
              solution={`SELECT DISTINCT status
FROM payments
WHERE method = 'bkash';`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  যেসব Customer এর অন্তত একটা <strong>confirmed</strong> Booking আছে,
                  তাঁদের <code className={CODE}>customer_id</code> দিন, ছোট থেকে বড়।
                  একজনের নম্বর একবারই আসবে।
                </>
              }
              hint={
                <>
                  উপরের Query টার সাথে একটা WHERE। উত্তরে চোদ্দজনের চেয়ে কম মানুষ আসা
                  উচিত, কারণ কারো কারো সব Booking pending বা cancelled।
                </>
              }
              solution={`SELECT DISTINCT customer_id
FROM bookings
WHERE status = 'confirmed'
ORDER BY customer_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Exercise 4 এর উত্তরে বারোজন। বাদ পড়েছেন দুজন: customer 5, Sabbir Hossain,
              যাঁর একমাত্র Booking টা cancelled, আর customer 12, Kamal Hasan, যাঁর Booking
              এখনো pending। দুজনেই আগের চোদ্দজনের তালিকায় ছিলেন। WHERE তাঁদের Row গুলো
              আগেই সরিয়ে দিয়েছে, তাই DISTINCT তাঁদের দেখেনি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "distinct-order-by",
      subHeader: { index: "008", title: "DISTINCT and ORDER BY" },
      title: <SectionTitle>সাজানোর কথা দেয় না, আর সাজাতে নিয়ম মানতে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT নিয়ে দুটো কথা ORDER BY এর সাথে জড়িয়ে আছে। প্রথমটা সহজ: DISTINCT
                কোনো ক্রম দেয় না। বাড়তি Copy ফেলতে গিয়ে PostgreSQL কখনো Row গুলো সাজায়,
                কখনো একটা Hash Table ব্যবহার করে যেখানে ক্রম এলোমেলো হয়ে যায়। কোনটা
                করবে, সেটা সে নিজে ঠিক করে, আর Data বাড়লে সেই সিদ্ধান্ত বদলাতে পারে।
                নির্দিষ্ট ক্রম চাইলে ORDER BY লিখতেই হবে, ঠিক{" "}
                <Link href="/sql/topic/order-by" className={LINK}>
                  ORDER BY এর লেসনে
                </Link>{" "}
                যেমন দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা একটা নিয়ম, যেটা না জানলে অবাক করা Error আসে: SELECT DISTINCT এর
                সাথে ORDER BY তে শুধু সেই জিনিস দিয়েই সাজানো যায় যেটা SELECT এর তালিকায়
                আছে। কারণটা যুক্তির। ধরুন আপনি দেশের তালিকা চাইলেন, কিন্তু সাজাতে বললেন
                joined_at দিয়ে, মানে কে কবে যোগ দিয়েছেন। Bangladesh বারোজনের দেশ, বারোটা
                আলাদা joined_at। Bangladesh এর Row টা তাহলে কোন তারিখ দেখে বসবে? প্রশ্নটার
                কোনো এক উত্তর নেই, তাই PostgreSQL অনুমান না করে Error দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এই Query টা Error দেবে"
              query={`SELECT DISTINCT country
FROM customers
ORDER BY joined_at;`}
              caption="ERROR: for SELECT DISTINCT, ORDER BY expressions must appear in select list। সমাধান দুটো: হয় ORDER BY country লিখুন, নয়তো joined_at কে SELECT এর তালিকাতেও আনুন। দ্বিতীয়টায় প্রশ্নটাই বদলে যায়, কারণ তখন দেশ আর তারিখের জোড়া আলাদা হবে, আর Bangladesh আবার বারোবার আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL 8.4 ও একই Query তে Error দেয়, শুধু ভাষা আলাদা: ERROR 3065 (HY000):
              Expression #1 of ORDER BY clause is not in SELECT list, references column
              &apos;island_tours.customers.joined_at&apos; which is not in SELECT list; this is
              incompatible with DISTINCT। দুই Database একই যুক্তিতে একই সিদ্ধান্ত নেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "distinct-vs-group-by",
      subHeader: { index: "009", title: "DISTINCT vs GROUP BY" },
      title: <SectionTitle>একই উত্তর, আলাদা উদ্দেশ্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                কিছুদিন SQL লেখার পর আপনি দেখবেন অন্যদের Code এ একই কাজ আরেকভাবে করা:
                SELECT country FROM customers GROUP BY country। এটাও ঠিক চারটা দেশ দেয়।
                GROUP BY এর পুরো গল্প{" "}
                <Link href="/sql/topic/group-by" className={LINK}>
                  Module 05 এ
                </Link>
                , কিন্তু এখনই পার্থক্যটা জেনে রাখা ভালো, যাতে দুটো দেখে গুলিয়ে না যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DISTINCT</strong> এর প্রশ্ন: কী কী আছে। উত্তরে প্রতিটা আলাদা
                  Row একবার, ব্যস।
                </ListItem>
                <ListItem>
                  <strong>GROUP BY</strong> এর প্রশ্ন: প্রতিটা দলের জন্য কিছু একটা হিসাব।
                  দলগুলো বানানো তার প্রথম ধাপ, কিন্তু আসল উদ্দেশ্য প্রতিটা দলে গোনা,
                  যোগ করা বা গড় বের করা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই নিয়মটা সহজ। শুধু তালিকা চাইলে DISTINCT, পড়তে পরিষ্কার আর উদ্দেশ্য
                স্পষ্ট। প্রতিটা মানের পাশে একটা সংখ্যা চাইলে GROUP BY। দুটোর ফলাফল একই
                হলে PostgreSQL ভেতরে প্রায় একই কাজ করে, তাই গতির জন্য একটা থেকে আরেকটায়
                যাওয়ার দরকার নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Query, প্রথম দুটোর উত্তর হুবহু এক"
              query={`SELECT DISTINCT country
FROM customers
ORDER BY country;

SELECT country
FROM customers
GROUP BY country
ORDER BY country;

SELECT country, count(*) AS customers
FROM customers
GROUP BY country
ORDER BY country;`}
              caption="প্রথম দুটো একই চারটা Row দেয়। তৃতীয়টা দেখায় GROUP BY কেন আছে: প্রতিটা দেশের পাশে কতজন, Bangladesh 12, বাকিগুলো 1 করে। DISTINCT এটা পারে না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "distinct-on",
      subHeader: { index: "010", title: "DISTINCT ON" },
      title: <SectionTitle>প্রতিটা দলের একটা পুরো Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার একটা প্রশ্ন যেটা DISTINCT দিয়ে করা যায় না: প্রতিটা Customer এর সবচেয়ে
                নতুন Booking টা দেখান, তার booking_id, status আর সময়সহ। DISTINCT
                customer_id লিখলে শুধু নম্বর পাবেন। DISTINCT customer_id, booking_id লিখলে
                জোড়াগুলো সব আলাদা, তাই আবার চব্বিশটা Row। দরকার এমন কিছু যেটা
                customer_id অনুযায়ী দল ভাগ করবে, কিন্তু প্রতিটা দল থেকে একটা পুরো Row
                রাখবে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ ঠিক এই কাজের জন্য আছে DISTINCT ON। ব্র্যাকেটের ভেতরে লেখেন
                কোন জিনিস দিয়ে দল ভাগ হবে, তারপর যথারীতি যেসব Column দেখতে চান। প্রতিটা
                দল থেকে PostgreSQL ঠিক একটা Row রাখে: ORDER BY অনুযায়ী সাজানোর পর যেটা সবার
                প্রথমে আসে। তাই কোন Row টা থাকবে, সেই সিদ্ধান্ত আসলে ORDER BY এর হাতে।
                সবচেয়ে নতুন চাইলে booked_at DESC, সবচেয়ে পুরনো চাইলে booked_at।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DistinctOnDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর সবচেয়ে নতুন Booking"
              query={`SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, status, booked_at
FROM bookings
ORDER BY customer_id, booked_at DESC;`}
              caption="চোদ্দটা Row, প্রতিটা Customer এর জন্য একটা। Rahim Uddin এর তিনটা Booking এর মধ্যে এসেছে 17, অক্টোবরের pending টা, কারণ সেটাই সবচেয়ে নতুন। booked_at DESC কে booked_at বানিয়ে আবার চালান: এবার প্রতিটা Customer এর প্রথম Booking আসবে, Rahim এর জন্য 1।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT ON এর একটা কড়া নিয়ম আছে: ORDER BY এর শুরুতে ঠিক সেই জিনিসগুলোই
                থাকতে হবে যেগুলো ON এর ব্র্যাকেটে আছে, একই ক্রমে। কারণ PostgreSQL আগে Row
                গুলোকে দলে দলে পাশাপাশি আনে, তারপর প্রতিটা দলের প্রথমটা নেয়। ORDER BY
                যদি অন্য কিছু দিয়ে শুরু হয়, তাহলে একই Customer এর Row গুলো ছড়িয়ে পড়ে, আর
                প্রথম বলে কিছু থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY ভুল দিয়ে শুরু হলে"
              query={`SELECT DISTINCT ON (customer_id)
       customer_id, booking_id
FROM bookings
ORDER BY booked_at DESC;`}
              caption="ERROR: SELECT DISTINCT ON expressions must match initial ORDER BY expressions। সমাধান: ORDER BY customer_id, booked_at DESC। ON এর জিনিস আগে, তারপর দলের ভেতরে কোনটা প্রথম হবে সেটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ DISTINCT ON নেই",
          content: (
            <ContentParagraph>
              DISTINCT ON PostgreSQL এর নিজস্ব জিনিস, SQL Standard এর অংশ না। MySQL 8.4 এ
              একই Query চালালে আসে ERROR 1064 (42000), একটা সাধারণ Syntax Error। MySQL এ
              একই উত্তর পেতে লাগে Window Function, ROW_NUMBER() OVER (PARTITION BY
              customer_id ORDER BY booked_at DESC), যেটা{" "}
              <Link href="/sql/topic/top-n-gaps-islands" className={LINK}>
                Module 08 এ
              </Link>{" "}
              শিখবেন। সেই পদ্ধতি PostgreSQL এও চলে, আর প্রতিটা দলের একটা না, প্রথম তিনটা
              চাইলেও কাজ করে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "pick-the-row",
      subHeader: { index: "011", title: "Pick the Row" },
      title: <SectionTitle>কোন Row টা থাকবে, নিজের হাতে বদলে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ পাঁচজন Customer এর আসল Booking। তিনটা বোতাম তিনটা ORDER BY।
              booked_at DESC আর booked_at বদলে দেখুন, প্রতিবার প্রতিটা দলে আলাদা Row রাখা
              হয়। তারপর শুধু customer_id চাপুন। Query টা Error দেবে না, কিন্তু Lab দেখাবে
              কোন দলে উত্তর নিশ্চিত না। এটাই DISTINCT ON এর সবচেয়ে বিপজ্জনক ভুল, কারণ
              চোখে কোনো সমস্যা ধরা পড়ে না।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DistinctOnLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              task={
                <>
                  প্রতিটা ট্যুরের পরের যাত্রা: ১ নভেম্বর 2026 বা তার পরের প্রথম
                  Departure। দেখান <code className={CODE}>tour_id</code>,{" "}
                  <code className={CODE}>starts_on</code> আর{" "}
                  <code className={CODE}>seats_left</code>, tour_id অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  departures Table। আগে WHERE দিয়ে{" "}
                  <code className={CODE}>starts_on &gt;= &apos;2026-11-01&apos;</code>, তারপর
                  DISTINCT ON (tour_id), আর ORDER BY tour_id, starts_on, যাতে প্রতিটা ট্যুরের
                  সবচেয়ে আগের তারিখ প্রথমে আসে।
                </>
              }
              solution={`SELECT DISTINCT ON (tour_id)
       tour_id, starts_on, seats_left
FROM departures
WHERE starts_on >= '2026-11-01'
ORDER BY tour_id, starts_on;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উত্তরে আটটা ট্যুর। নয় নম্বর, Cox&apos;s Bazar Family Package, নেই, কারণ তার
              কোনো Departure ই নেই। Saint Martin Island Escape এর নভেম্বরের পর দুটো তারিখ,
              20 Nov আর 18 Dec, তার মধ্যে এসেছে 20 Nov। খেয়াল করুন, এখানে WHERE আগে কাজ
              করেছে, তাই জানুয়ারির পুরনো তারিখগুলো দলের ভেতরে ঢোকারই সুযোগ পায়নি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "text-traps",
      subHeader: { index: "012", title: "Text Traps" },
      title: <SectionTitle>চোখে এক, Database এর কাছে আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT দুটো লেখাকে একই ধরে শুধু তখন, যখন সেগুলো অক্ষরে অক্ষরে এক।
                মানুষের চোখে Dhaka, dhaka আর শেষে একটা ফাঁকা জায়গাসহ Dhaka একই শহর।
                PostgreSQL এর কাছে তিনটা আলাদা লেখা। বাস্তবের Data তে এমন অমিল প্রায়ই
                থাকে: কেউ Form এ ছোট হাতে লিখেছেন, কারো Copy Paste এ শেষে একটা Space
                ঢুকে গেছে। তখন DISTINCT এর উত্তরে একই শহর তিনবার দেখা যায়, আর মনে হয়
                DISTINCT কাজ করছে না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Table এর বদলে VALUES দিয়ে চারটা লেখা বানানো হয়েছে, যাতে
                Sample Data না বদলে পরীক্ষা করা যায়। লেখাগুলোর দুপাশে ব্র্যাকেট জুড়ে
                দেখানো হয়েছে, যাতে লুকানো Space চোখে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Dhaka"
              query={`SELECT DISTINCT '[' || x || ']' AS shown
FROM (VALUES ('Dhaka'), ('dhaka'), ('Dhaka '), ('Dhaka')) AS v(x);

SELECT count(DISTINCT x) AS distinct_values
FROM (VALUES ('Dhaka'), ('dhaka'), ('Dhaka '), ('Dhaka')) AS v(x);

SELECT DISTINCT lower(trim(x)) AS city
FROM (VALUES ('Dhaka'), ('dhaka'), ('Dhaka '), ('Dhaka')) AS v(x);`}
              caption="প্রথম উত্তরে তিনটা Row: [Dhaka], [dhaka] আর [Dhaka ]। চারটা লেখার মধ্যে শুধু দুটো হুবহু এক ছিল। দ্বিতীয়টা সংখ্যায় একই কথা বলে: 3। তৃতীয়টায় trim শেষের Space কাটে, lower সব ছোট হাতের করে, তারপর DISTINCT, ফলে একটাই dhaka। এই দুই Function এর পুরো গল্প Module 04 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "MySQL এ একই চারটা লেখা, উত্তর দুটো",
          content: (
            <ContentParagraph>
              MySQL 8.4 এর Island Tours Table গুলোর Collation হলো utf8mb4_0900_ai_ci।
              নামের ci মানে case insensitive, বড় ছোট হাতের অক্ষরের পার্থক্য মানে না। তাই
              একটা VARCHAR Column এ এই চারটা লেখা রেখে SELECT DISTINCT চালালে MySQL দুটো
              মান দেখায়: Dhaka আর শেষে Space সহ Dhaka। dhaka আর Dhaka তার কাছে একই, কিন্তু
              শেষের Space এই Collation এ হিসাবে ধরা হয়। একই Data, PostgreSQL এ তিন, MySQL এ
              দুই। MySQL ভিত্তিক ভিডিও দেখে PostgreSQL এ অনুশীলন করলে এই পার্থক্য মনে
              রাখবেন।{" "}
              <Link href="/sql/topic/text-types" className={LINK}>
                Collation এর পুরো আলোচনা Module 09 এ।
              </Link>
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধানের আসল জায়গা Query না, Data। Data ঢোকানোর সময়েই লেখা গুছিয়ে রাখলে
              পরে প্রতিটা Query তে lower আর trim লিখতে হয় না। কীভাবে Database কে দিয়েই
              সেটা পাহারা দেওয়ানো যায়, তা Module 09 এর Constraint এর লেসনে আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "smell",
      subHeader: { index: "013", title: "When DISTINCT Is a Smell" },
      title: <SectionTitle>DISTINCT দিয়ে ভুল ঢাকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                অভিজ্ঞ Developer রা Code Review তে একটা SELECT DISTINCT দেখলে প্রায়ই থেমে
                জিজ্ঞেস করেন: এখানে বাড়তি Copy আসছে কোথা থেকে? কারণ বাস্তবের অনেক
                DISTINCT আসলে প্রশ্নের অংশ না, একটা ভুল ঢাকার পর্দা। সবচেয়ে চেনা
                কাহিনীটা এরকম।
              </ContentParagraph>
              <ContentParagraph>
                একজন Developer যাঁরা বুক করেছেন তাঁদের নাম চাইলেন। নাম আছে customers এ,
                Booking আছে bookings এ। তিনি দুটো Table জোড়া দিলেন, যেটা{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  Module 06 এর JOIN
                </Link>
                । Rahim Uddin এর তিনটা Booking, তাই জোড়ার পর Rahim এর নাম তিনবার এল।
                Developer অবাক হলেন, তারপর SELECT এর পরে DISTINCT বসিয়ে দিলেন। নাম একবার
                করে এল, Test পাস করল, Code চলে গেল Production এ।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যাটা তিনটা স্তরে। প্রথমত, Database এখনো চব্বিশটা জোড়া Row তৈরি করছে,
                তারপর আবার খেটে সেগুলো থেকে বাড়তি Copy ফেলছে। Booking লাখে গেলে এই দুই
                কাজই ভারী। দ্বিতীয়ত, দুজন আলাদা মানুষের নাম যদি একই হয়, DISTINCT তাঁদের
                একজন বানিয়ে ফেলবে, কারণ সে শুধু নাম দেখছে, মানুষ দেখছে না। তৃতীয়ত, আসল
                প্রশ্নটা ছিল কোন Customer এর অন্তত একটা Booking আছে, যার জন্য তৈরি জিনিস
                EXISTS, যেটা{" "}
                <Link href="/sql/topic/semi-anti-join" className={LINK}>
                  Module 06 এ
                </Link>{" "}
                শিখবেন। EXISTS কোনো Copy তৈরিই করে না, তাই ফেলার প্রশ্নও আসে না।
              </ContentParagraph>
              <ContentParagraph>
                তাই নিয়মটা এভাবে মনে রাখুন। প্রশ্ন নিজেই যদি হয় কোন কোন আলাদা মান আছে,
                DISTINCT একদম ঠিক জায়গায়। কিন্তু Query লেখার পর যদি অপ্রত্যাশিত Copy দেখে
                DISTINCT বসাতে ইচ্ছা করে, আগে থামুন আর খুঁজুন Copy গুলো জন্মাচ্ছে কোথায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DISTINCT এর খরচ নিজের চোখে দেখার একটা উপায় আছে: EXPLAIN। এটা Query চালায়
              না, শুধু বলে PostgreSQL কোন পথে চালাবে।{" "}
              <Link href="/sql/topic/explain-analyze" className={LINK}>
                Module 13 এ
              </Link>{" "}
              এর পুরো ব্যাখ্যা আছে, এখন শুধু একটা শব্দ খুঁজুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DISTINCT এর পেছনের কাজ"
              query={`EXPLAIN
SELECT DISTINCT country
FROM customers;`}
              caption="উত্তরে দুটো ধাপ: নিচে Seq Scan on customers, মানে পুরো Table পড়া, আর উপরে HashAggregate, Group Key: country। দ্বিতীয় ধাপটাই DISTINCT এর কাজ, একটা Hash Table এ প্রতিটা দেশ একবার করে রাখা। DISTINCT ছাড়া চালালে এই ধাপটা থাকেই না। cost এর সংখ্যাগুলো আন্দাজ, আপনার মেশিনে আলাদা হতে পারে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর রোজকার DISTINCT</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা ট্যুর বুকিং ব্যবসায় DISTINCT সবচেয়ে বেশি আসে তিন রকম জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Filter এর Dropdown:</strong> Website এর Search Page এ অঞ্চল
                  বাছাইয়ের একটা তালিকা আছে। সেই তালিকা আসে SELECT DISTINCT region FROM
                  destinations ORDER BY region থেকে। নতুন অঞ্চলে জায়গা যোগ হলে Dropdown
                  এ নিজে থেকেই নতুন নাম চলে আসে, কাউকে Code বদলাতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>কারা কিছু করেছেন:</strong> Marketing জানতে চায় কারা অন্তত
                  একবার confirmed Booking করেছেন, যাতে তাঁদের Loyalty Offer পাঠানো যায়।
                  উত্তর DISTINCT customer_id, WHERE status = &apos;confirmed&apos;। আর এর
                  উল্টো, কারা কখনো বুক করেননি, সেই প্রশ্ন Module 06 এর NOT EXISTS এর জন্য।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটার সর্বশেষ:</strong> Support Team এর Dashboard এ প্রতিটা
                  Customer এর পাশে তাঁর সবচেয়ে নতুন Booking এর অবস্থা দেখানো হয়। একজন
                  ফোন করলে Agent এক নজরে দেখেন শেষ Booking টা pending নাকি confirmed। এর
                  পেছনে আছে DISTINCT ON (customer_id) ... ORDER BY customer_id, booked_at
                  DESC।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তৃতীয়টাই এই লেসনের সবচেয়ে বাস্তব কাজ, তাই এটা দিয়েই Challenge। এবার কোনো
                ইঙ্গিত ছাড়া চেষ্টা করুন, আটকে গেলে Hint আছে।
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
                  Support Dashboard এর জন্য: প্রতিটা Customer এর সবচেয়ে নতুন Booking।
                  Column এই ক্রমে: <code className={CODE}>customer_id</code>,{" "}
                  <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>status</code>,{" "}
                  <code className={CODE}>booked_at</code>। সাজাবেন customer_id অনুযায়ী।
                  যিনি কখনো বুক করেননি, তিনি উত্তরে থাকবেন না।
                </>
              }
              hint={
                <>
                  DISTINCT ON (customer_id), আর ORDER BY তে দুটো জিনিস: আগে দল ঠিক করতে
                  customer_id, তারপর দলের ভেতরে সবচেয়ে নতুনটা উপরে আনতে booked_at DESC।
                </>
              }
              solution={`SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, status, booked_at
FROM bookings
ORDER BY customer_id, booked_at DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>SELECT DISTINCT country, ভেতরে যা ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM থেকে Row আনা",
              description:
                "PostgreSQL customers Table এর পনেরোটা Row পড়ে। এই মুহূর্তে প্রতিটা Row এর সব Column সাথে আছে।",
            },
            {
              title: "WHERE দিয়ে ছাঁকা",
              description:
                "WHERE থাকলে যে Row গুলো শর্ত মানে না সেগুলো এখানেই বাদ। এই Query তে WHERE নেই, তাই পনেরোটাই এগোয়।",
            },
            {
              title: "SELECT এর Column তৈরি",
              description:
                "প্রতিটা Row থেকে শুধু country রাখা হয়। পনেরোটা এক Column এর Row, যার বারোটায় Bangladesh।",
            },
            {
              title: "DISTINCT বাড়তি Copy ফেলে",
              description:
                "প্রতিটা Row এর পুরো মান তুলনা হয়, NULL কে NULL এর সমান ধরে। প্রথম দেখা মান থাকে, আবার দেখা মান বাদ। পনেরো থেকে চার। PostgreSQL কাজটা করে Hash Table বা সাজিয়ে, কোনটা সে নিজে বাছে।",
            },
            {
              title: "ORDER BY সাজায়",
              description:
                "ORDER BY থাকলে শেষ চারটা Row এখন সাজানো হয়। এখানে শুধু SELECT এর তালিকার জিনিস দিয়ে সাজানো যায়, অন্য কিছু দিলে Error।",
            },
            {
              title: "LIMIT থাকলে কাটা",
              description:
                "সবশেষে LIMIT প্রথম কয়েকটা রাখে। তাই DISTINCT ... LIMIT 2 মানে দুটো আলাদা মান, দুটো Row থেকে আসা মান না।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যেখানে সবাই একবার আটকান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখবেন", "কেন হয়", "সমাধান"],
          rows: [
            [
              "ভাবা DISTINCT প্রথম Column এ খাটে",
              "SELECT DISTINCT region, kind এ Chattogram চারবার",
              "DISTINCT পুরো Row দেখে, সব Column মিলিয়ে",
              "শুধু region এর তালিকা চাইলে SELECT এ শুধু region রাখুন",
            ],
            [
              "DISTINCT কে Column এর পরে লেখা",
              "Error নেই, সব Row আসে, Column এর নাম distinct",
              "PostgreSQL শব্দটাকে Alias ধরে নেয়",
              "SELECT DISTINCT country, SELECT country DISTINCT না",
            ],
            [
              "ORDER BY তে না দেখানো Column",
              "for SELECT DISTINCT, ORDER BY expressions must appear in select list",
              "একটা মানের Row কোন মান দেখে বসবে, তার এক উত্তর নেই",
              "SELECT এ থাকা জিনিস দিয়ে সাজান",
            ],
            [
              "DISTINCT এর উপর ক্রমের ভরসা",
              "আজ সাজানো দেখায়, কাল এলোমেলো",
              "DISTINCT কোনো ক্রম দেয় না",
              "সবসময় ORDER BY লিখুন",
            ],
            [
              "DISTINCT ON এর ORDER BY অসম্পূর্ণ",
              "Error নেই, কিন্তু উত্তর মাঝে মাঝে বদলায়",
              "দলের ভেতরে কোনটা প্রথম, বলা হয়নি",
              "ON এর জিনিস, তারপর দলের ভেতরের ক্রম, যেমন booked_at DESC",
            ],
            [
              "ছোট বড় হাত বা Space এর অমিল",
              "একই শহর তিনবার",
              "DISTINCT অক্ষরে অক্ষরে তুলনা করে",
              "Data গুছিয়ে রাখুন, দরকারে lower(trim(...))",
            ],
            [
              "JOIN এর Copy ঢাকতে DISTINCT",
              "উত্তর ঠিক দেখায়, কিন্তু ধীর, আর একই নামের দুজন এক হয়ে যায়",
              "প্রশ্নটা ছিল আছে কি না, সেটা JOIN এর কাজ না",
              "EXISTS, Module 06",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>SELECT, DISTINCT Clause</strong>, PostgreSQL এর অফিসিয়াল
                Reference। DISTINCT, DISTINCT ON আর ORDER BY এর নিয়ম এখান থেকেই। Page এর
                DISTINCT Clause অংশে যান।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/sql-select.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/sql-select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Select Lists</strong>, PostgreSQL Tutorial ধাঁচের অধ্যায়, যেখানে
                বলা আছে DISTINCT এ দুটো NULL কে সমান ধরা হয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-select-lists.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-select-lists.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Comparison Functions and Operators</strong>, IS DISTINCT FROM আর
                IS NOT DISTINCT FROM এর সংজ্ঞা।{" "}
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
                <strong>MySQL 8.4: DISTINCT Optimization</strong>, MySQL DISTINCT কে
                ভেতরে কীভাবে চালায়, আর GROUP BY এর সাথে তার সম্পর্ক।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/distinct-optimization.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/distinct-optimization.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Select (SQL)</strong>, Wikipedia, SELECT এর সব অংশের একটা
                সাধারণ ছবি, কোনো একটা Database এর দিকে না ঝুঁকে।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Select_(SQL)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Select_(SQL)
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
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentList>
                <ListItem>
                  SELECT প্রতিটা Row এর জন্য উত্তরে একটা Row দেয়। Row চেনানোর মতো Column
                  বাদ দিলে একই মান বারবার আসে। এটা ভুল না, প্রশ্নের ধরন।
                </ListItem>
                <ListItem>
                  SELECT DISTINCT উত্তরের হুবহু একই Row গুলোর বাড়তি Copy ফেলে দেয়। Table
                  এর Data বদলায় না।
                </ListItem>
                <ListItem>
                  DISTINCT পুরো Row দেখে। একটা Column যোগ করলে Row এর সংখ্যা কখনো কমে না।
                </ListItem>
                <ListItem>
                  DISTINCT এর কাছে সব NULL একই, উত্তরে NULL একবার। কিন্তু count(DISTINCT)
                  NULL কে গোনে না।
                </ListItem>
                <ListItem>
                  WHERE আগে ছাঁকে, DISTINCT পরে বাছে। কারা কিছু করেছেন, এই প্রশ্নের
                  উত্তর DISTINCT id, সাথে একটা WHERE।
                </ListItem>
                <ListItem>
                  DISTINCT কোনো ক্রম দেয় না, আর SELECT DISTINCT এর ORDER BY তে শুধু SELECT
                  এর তালিকার জিনিস।
                </ListItem>
                <ListItem>
                  শুধু তালিকা চাইলে DISTINCT, প্রতিটা মানের পাশে হিসাব চাইলে GROUP BY।
                </ListItem>
                <ListItem>
                  DISTINCT ON (x) প্রতিটা দল থেকে একটা পুরো Row রাখে, কোনটা রাখবে তা ঠিক
                  করে ORDER BY, যা শুরু হতে হবে x দিয়ে। এটা শুধু PostgreSQL এ, MySQL এ
                  Window Function লাগে।
                </ListItem>
                <ListItem>
                  লেখার তুলনা অক্ষরে অক্ষরে, MySQL এর Collation বড় ছোট হাত মানে না।
                </ListItem>
                <ListItem>
                  অপ্রত্যাশিত Copy দেখে DISTINCT বসানোর আগে খুঁজুন Copy আসছে কোথা থেকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে একটা নতুন ক্ষমতা আসছে: Query এর ভেতরে যদি আর তাহলে। CASE দিয়ে
                আপনি প্রতিটা Row এর মান দেখে নতুন একটা লেবেল বানাবেন, যেমন দাম দেখে
                বাজেট, মাঝারি বা প্রিমিয়াম। আর সেটাই হবে Module 03 এর শেষ লেসন, যেখানে
                পুরো Module এর সবকিছু একটা Query তে মিলবে।{" "}
                <Link href="/sql/topic/case-expression" className={LINK}>
                  CASE Expressions লেসনে চলুন।
                </Link>
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
      ["পুনরাবৃত্তি কেন", "Row চেনানোর Column বাদ দিলে একই মান বারবার", "SELECT country FROM customers, 15 Row"],
      ["DISTINCT", "উত্তরের হুবহু একই Row এর বাড়তি Copy বাদ", "SELECT DISTINCT country, 4 Row"],
      ["জায়গা", "SELECT এর ঠিক পরে, পুরো SELECT এর উপর", "SELECT DISTINCT region, kind"],
      ["পুরো Row", "সব Column মিলিয়ে তুলনা", "region 4, kind 5, দুটো মিলে 6"],
      ["NULL", "সব NULL এক দল, উত্তরে একবার", "DISTINCT guide_id, 5 Row, একটা NULL"],
      ["count(DISTINCT)", "NULL বাদ দিয়ে আলাদা মান গোনে", "count(DISTINCT guide_id) = 4"],
      ["ক্রম", "WHERE আগে, DISTINCT পরে, ORDER BY শেষে", "confirmed Customer, 12 জন"],
      ["ORDER BY নিয়ম", "SELECT DISTINCT এ শুধু দেখানো জিনিস দিয়ে সাজানো", "ORDER BY joined_at, Error"],
      ["DISTINCT বনাম GROUP BY", "তালিকা বনাম দলপ্রতি হিসাব", "GROUP BY country সহ count(*)"],
      ["DISTINCT ON", "প্রতিটা দলের একটা পুরো Row, ORDER BY অনুযায়ী প্রথমটা", "প্রতিটা Customer এর সর্বশেষ Booking"],
      ["DISTINCT ON এর নিয়ম", "ORDER BY শুরু হবে ON এর জিনিস দিয়ে", "ORDER BY customer_id, booked_at DESC"],
      ["লেখার অমিল", "Dhaka, dhaka, Dhaka আর Space, তিনটা আলাদা", "PostgreSQL 3, MySQL 2"],
      ["সতর্কসংকেত", "JOIN এর Copy ঢাকতে DISTINCT মানে প্রশ্নটা অন্য", "EXISTS, Module 06"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "customers Table এ পনেরোজন Customer, তাঁদের বারোজন Bangladesh এর, বাকি তিনজন তিনটা আলাদা দেশের। SELECT DISTINCT country FROM customers; কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "15",
            isCorrect: false,
            explanation: "15 আসে DISTINCT ছাড়া, প্রতিটা Customer এর জন্য একটা Row।",
          },
          {
            key: "B",
            text: "12",
            isCorrect: false,
            explanation: "12 হলো Bangladesh কতবার আছে। DISTINCT সেই বারোটাকে একটা বানায়।",
          },
          {
            key: "C",
            text: "4",
            isCorrect: true,
            explanation: "ঠিক। Bangladesh একবার, আর বাকি তিনটা দেশ একবার করে, মোট চার।",
          },
          {
            key: "D",
            text: "3",
            isCorrect: false,
            explanation: "Bangladesh নিজেও একটা আলাদা মান, তাকে বাদ দেওয়া যায় না। তিনটা বিদেশি দেশ আর Bangladesh, চার।",
          },
        ],
      },
      {
        id: 2,
        text: "destinations এ DISTINCT region দেয় 4 Row, DISTINCT kind দেয় 5 Row। SELECT DISTINCT region, kind FROM destinations; কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "4, কারণ DISTINCT প্রথম Column এ খাটে",
            isCorrect: false,
            explanation: "DISTINCT কোনো একটা Column এ খাটে না। এটাই সবচেয়ে চেনা ভুল ধারণা।",
          },
          {
            key: "B",
            text: "5, কারণ বড় সংখ্যাটা জেতে",
            isCorrect: false,
            explanation: "দুটো Column একসাথে Row কে আরও আলাদা করে, তাই সংখ্যা বড়টার চেয়েও বেশি হতে পারে।",
          },
          {
            key: "C",
            text: "6, কারণ সাতটা Row এর মধ্যে শুধু একটা জোড়া দুইবার আছে",
            isCorrect: true,
            explanation: "ঠিক। DISTINCT পুরো Row দেখে। Chattogram আর hills এর জোড়াটাই শুধু হুবহু দুইবার, তাই সাত থেকে ছয়।",
          },
          {
            key: "D",
            text: "20, কারণ 4 গুণ 5",
            isCorrect: false,
            explanation: "DISTINCT নতুন জোড়া বানায় না, শুধু Data তে থাকা জোড়া থেকে বাড়তি Copy ফেলে। Data তে সাতটাই Row।",
          },
        ],
      },
      {
        id: 3,
        text: "customers.phone Column এ পাঁচটা NULL আর দশটা আলাদা নম্বর। SELECT DISTINCT phone FROM customers; এর উত্তরে NULL কয়বার আসবে?",
        options: [
          {
            key: "A",
            text: "একবারও না, DISTINCT NULL বাদ দেয়",
            isCorrect: false,
            explanation: "NULL বাদ দেয় count এর মতো Aggregate Function। DISTINCT NULL কে একটা মান হিসেবে রাখে।",
          },
          {
            key: "B",
            text: "একবার",
            isCorrect: true,
            explanation: "ঠিক। DISTINCT এর কাছে সব NULL একই দলের, তাই উত্তরে এগারোটা Row: দশটা নম্বর আর একটা NULL।",
          },
          {
            key: "C",
            text: "পাঁচবার, কারণ NULL = NULL সত্য না",
            isCorrect: false,
            explanation: "WHERE এর তুলনায় সেটা ঠিক, কিন্তু DISTINCT এর তুলনায় NULL গুলোকে সমান ধরা হয়, ঠিক IS NOT DISTINCT FROM এর মতো।",
          },
          {
            key: "D",
            text: "Error আসবে",
            isCorrect: false,
            explanation: "NULL থাকা Column এ DISTINCT একদম স্বাভাবিক Query, কোনো Error নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "কোন Query টা PostgreSQL এ Error দেবে?",
        options: [
          {
            key: "A",
            text: "SELECT DISTINCT country FROM customers ORDER BY country;",
            isCorrect: false,
            explanation: "SELECT এর তালিকার Column দিয়ে সাজানো একদম ঠিক আছে।",
          },
          {
            key: "B",
            text: "SELECT DISTINCT country FROM customers ORDER BY joined_at;",
            isCorrect: true,
            explanation: "ঠিক। joined_at SELECT এর তালিকায় নেই, আর Bangladesh এর বারোটা joined_at এর কোনটা দেখে সাজাবে তার উত্তর নেই। Error: ORDER BY expressions must appear in select list।",
          },
          {
            key: "C",
            text: "SELECT DISTINCT city, country FROM customers ORDER BY country;",
            isCorrect: false,
            explanation: "country SELECT এর তালিকায় আছে, তাই এটা চলে। সব Column দিয়ে সাজাতে হবে এমন কোনো নিয়ম নেই।",
          },
          {
            key: "D",
            text: "SELECT country FROM customers ORDER BY joined_at;",
            isCorrect: false,
            explanation: "DISTINCT না থাকলে প্রতিটা Row এর নিজের joined_at আছে, তাই যেকোনো Column দিয়ে সাজানো যায়।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT DISTINCT ON (customer_id) customer_id, booking_id FROM bookings ORDER BY customer_id; এই Query নিয়ে কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "Error দেবে, কারণ booked_at লেখা নেই",
            isCorrect: false,
            explanation: "ORDER BY customer_id দিয়ে শুরু হয়েছে, তাই নিয়ম মানা হয়েছে, Error আসবে না।",
          },
          {
            key: "B",
            text: "প্রতিটা Customer এর সবচেয়ে নতুন Booking দেবে",
            isCorrect: false,
            explanation: "সবচেয়ে নতুন চাইলে booked_at DESC বলতে হতো। এখানে দলের ভেতরের ক্রম বলাই হয়নি।",
          },
          {
            key: "C",
            text: "প্রতিটা Customer এর একটা Booking দেবে, কিন্তু কোনটা, তার কোনো নিশ্চয়তা নেই",
            isCorrect: true,
            explanation: "ঠিক। একাধিক Booking থাকা Customer এর জন্য PostgreSQL যেকোনো একটা রাখতে পারে, আর পরেরবার অন্যটা। চুপচাপ বদলে যাওয়া উত্তর।",
          },
          {
            key: "D",
            text: "সব চব্বিশটা Booking দেবে",
            isCorrect: false,
            explanation: "DISTINCT ON (customer_id) প্রতিটা Customer এর জন্য ঠিক একটা Row রাখে, তাই চোদ্দটা।",
          },
        ],
      },
      {
        id: 6,
        text: "আপনার দরকার প্রতিটা দেশের পাশে সেই দেশের Customer সংখ্যা। কোনটা লিখবেন?",
        options: [
          {
            key: "A",
            text: "SELECT DISTINCT country FROM customers;",
            isCorrect: false,
            explanation: "DISTINCT শুধু বলে কী কী আছে, কতবার আছে সেটা ফেলে দেয়।",
          },
          {
            key: "B",
            text: "SELECT country, count(*) FROM customers GROUP BY country;",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা দলের জন্য হিসাব, এটাই GROUP BY এর কাজ। Module 05 এ পুরোটা।",
          },
          {
            key: "C",
            text: "SELECT DISTINCT country, customer_id FROM customers;",
            isCorrect: false,
            explanation: "customer_id যোগ করলে প্রতিটা Row আলাদা হয়ে পনেরোটা Row আসে, গোনা হয় না।",
          },
          {
            key: "D",
            text: "SELECT DISTINCT ON (country) country FROM customers ORDER BY country;",
            isCorrect: false,
            explanation: "এটা প্রতিটা দেশের একটা Row দেয়, গোনে না। এখানে DISTINCT ON এর কোনো বাড়তি লাভও নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Column এ চারটা লেখা: Dhaka, dhaka, শেষে Space সহ Dhaka, আর আবার Dhaka। PostgreSQL এ count(DISTINCT ...) কত দেবে?",
        options: [
          {
            key: "A",
            text: "1, কারণ সবই একই শহর",
            isCorrect: false,
            explanation: "মানুষের কাছে একই শহর, কিন্তু PostgreSQL অক্ষরে অক্ষরে তুলনা করে।",
          },
          {
            key: "B",
            text: "2, কারণ বড় ছোট হাতের পার্থক্য ধরা হয় না",
            isCorrect: false,
            explanation: "এটা MySQL এর utf8mb4_0900_ai_ci Collation এর উত্তর। PostgreSQL এ বড় ছোট হাত আলাদা।",
          },
          {
            key: "C",
            text: "3",
            isCorrect: true,
            explanation: "ঠিক। শুধু দুটো Dhaka হুবহু এক। dhaka আর শেষে Space সহ Dhaka আলাদা, মোট তিন।",
          },
          {
            key: "D",
            text: "4",
            isCorrect: false,
            explanation: "প্রথম আর শেষ লেখাটা অক্ষরে অক্ষরে এক, তাই চারটা আলাদা হতে পারে না।",
          },
        ],
      },
      {
        id: 8,
        text: "একজন Developer customers আর bookings জোড়া দিয়ে নাম আনলেন, নাম বারবার এল, তিনি SELECT DISTINCT বসিয়ে সমাধান করলেন। সবচেয়ে বড় ঝুঁকি কোনটা?",
        options: [
          {
            key: "A",
            text: "DISTINCT কিছু Customer এর নাম মুছে ফেলবে Table থেকে",
            isCorrect: false,
            explanation: "DISTINCT কখনো Table বদলায় না, শুধু উত্তর বদলায়।",
          },
          {
            key: "B",
            text: "একই নামের দুজন আলাদা মানুষ একজন হয়ে যাবেন, আর Data বাড়লে Query ধীর হবে",
            isCorrect: true,
            explanation: "ঠিক। DISTINCT শুধু নাম দেখে, মানুষ দেখে না, আর প্রথমে সব জোড়া বানিয়ে তারপর ফেলার কাজ বাড়তি খরচ। আসল প্রশ্ন ছিল আছে কি না, যার জন্য EXISTS।",
          },
          {
            key: "C",
            text: "Query টা Error দেবে",
            isCorrect: false,
            explanation: "Query টা চলবে আর উত্তরও ঠিক দেখাবে, ঝুঁকিটা এখানেই, কারণ সমস্যাটা চোখে পড়ে না।",
          },
          {
            key: "D",
            text: "কোনো ঝুঁকি নেই, এটাই সঠিক পদ্ধতি",
            isCorrect: false,
            explanation: "উত্তর আজ ঠিক দেখালেও Query টা ভুল প্রশ্নের উত্তর দিচ্ছে, আর পরে ভুল ফল দিতে পারে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর তালিকা আর সর্বশেষ অবস্থা",
    time: "৪৫-৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Dropdown এর Data:</strong> নিজের island_tours এ তিনটা Query লিখুন যেগুলো
        Website এর তিনটা Filter Dropdown ভরাবে: সব আলাদা region, সব আলাদা kind, আর
        Customer দের সব আলাদা country, প্রতিটা বর্ণমালার ক্রমে।
      </span>,
      <span key="2">
        <strong>পুরো Row এর প্রমাণ:</strong> customers এ DISTINCT city, DISTINCT country আর
        DISTINCT city, country, তিনটা Row সংখ্যা লিখুন। তারপর এক লাইনে ব্যাখ্যা করুন কেন
        শেষ দুটোর সংখ্যা একই হলো, অথচ destinations এ region আর kind এর বেলায় হয়নি।
      </span>,
      <span key="3">
        <strong>NULL এর হিসাব:</strong> tours.guide_id এ SELECT DISTINCT আর
        count(DISTINCT) দুটোই চালান। দুই সংখ্যা লিখুন আর বন্ধুকে বোঝানোর মতো করে দুই লাইনে
        বলুন কেন আলাদা।
      </span>,
      <span key="4">
        <strong>Support Dashboard:</strong> প্রতিটা Customer এর সবচেয়ে নতুন Booking এর
        Query লিখুন DISTINCT ON দিয়ে। তারপর ORDER BY থেকে booked_at DESC সরিয়ে আবার
        চালান আর লিখুন কোন কোন Customer এর উত্তর অনিশ্চিত হয়ে গেল, আর কেন।
      </span>,
      <span key="5">
        <strong>Code Review:</strong> একটা ছোট নোট লিখুন, যেন একজন সহকর্মীর Code
        Review করছেন যিনি JOIN এর বাড়তি নাম ঢাকতে DISTINCT বসিয়েছেন। তিনটা ঝুঁকি আর
        বিকল্প কোন জিনিস শিখতে হবে, সেটা বলুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা Dropdown Query আর তাদের Output</span>,
      <span key="d2">DISTINCT city, country এর তিনটা সংখ্যা আর এক লাইনের ব্যাখ্যা</span>,
      <span key="d3">guide_id এর দুই সংখ্যা আর দুই লাইনের ব্যাখ্যা</span>,
      <span key="d4">DISTINCT ON Query, তার Output, আর অনিশ্চিত Customer দের তালিকা</span>,
      <span key="d5">Code Review নোট</span>,
    ],
  },
  practicalLab: {
    title: "DISTINCT Drill",
    subtitle: "নিজের island_tours এ, psql দিয়ে, প্রতিটা উত্তরের Row সংখ্যা মিলিয়ে",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, বা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। প্রথমে \\pset null '(null)' দিন, যাতে NULL খালি না দেখিয়ে লেখা দেখায়।",
      },
      {
        title: "Drill 1 আর 2: মূল কাজ আর পুরো Row",
        description:
          "প্রতিটা Query চালান আর শেষে psql যে (n rows) লেখে, সেটা Code এর পাশের মন্তব্যের সাথে মেলান। না মিললে Sample Database টা আবার Load করুন।",
      },
      {
        title: "Drill 3: NULL",
        description:
          "DISTINCT আর count(DISTINCT) পাশাপাশি চালিয়ে পাঁচ আর চারের পার্থক্য নিজের চোখে দেখুন।",
      },
      {
        title: "Drill 4: আগে ছাঁকা",
        description:
          "একই DISTINCT customer_id, একবার WHERE ছাড়া, একবার confirmed দিয়ে। চোদ্দ থেকে বারো, কারা বাদ পড়লেন খুঁজে বের করুন।",
      },
      {
        title: "Drill 5: DISTINCT ON",
        description:
          "প্রতিটা Customer এর সর্বশেষ Booking আর প্রতিটা ট্যুরের পরের Departure। তারপর DESC সরিয়ে বা যোগ করে উত্তর কীভাবে বদলায় দেখুন।",
      },
      {
        title: "Drill 6: ইচ্ছা করে Error",
        description:
          "দুটো Query Error দেবে। Error এর প্রথম লাইনটা পড়ুন, তারপর নিজে ঠিক করে আবার চালান। শেষ Query টা লেখার অমিল দেখায়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-distinct-basics.sql",
        code: `SELECT country FROM customers;
-- (15 rows)

SELECT DISTINCT country FROM customers ORDER BY country;
-- (4 rows)  Bangladesh, India, Malaysia, United Kingdom

SELECT DISTINCT city FROM customers ORDER BY city;
-- (9 rows)`,
      },
      {
        language: "sql",
        filename: "02-whole-row.sql",
        code: `SELECT DISTINCT region FROM destinations ORDER BY region;
-- (4 rows)

SELECT DISTINCT kind FROM destinations ORDER BY kind;
-- (5 rows)

SELECT DISTINCT region, kind FROM destinations ORDER BY region, kind;
-- (6 rows)  Chattogram | hills দুইবার ছিল, একবার এসেছে`,
      },
      {
        language: "sql",
        filename: "03-nulls.sql",
        code: `\\pset null '(null)'

SELECT DISTINCT guide_id FROM tours ORDER BY guide_id;
-- (5 rows)  1, 2, 3, 4, (null)

SELECT count(DISTINCT guide_id) AS guides_in_use FROM tours;
-- 4  (1 row)

SELECT DISTINCT phone FROM customers ORDER BY phone;
-- (11 rows)  দশটা নম্বর আর একটা (null)`,
      },
      {
        language: "sql",
        filename: "04-filter-first.sql",
        code: `SELECT DISTINCT customer_id FROM bookings ORDER BY customer_id;
-- (14 rows)

SELECT DISTINCT customer_id FROM bookings
WHERE status = 'confirmed'
ORDER BY customer_id;
-- (12 rows)  5 আর 12 নেই

SELECT DISTINCT status FROM payments WHERE method = 'bkash' ORDER BY status;
-- (3 rows)  failed, paid, refunded`,
      },
      {
        language: "sql",
        filename: "05-distinct-on.sql",
        code: `SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, status, booked_at
FROM bookings
ORDER BY customer_id, booked_at DESC;
-- (14 rows)  customer 1 এর জন্য booking 17

SELECT DISTINCT ON (tour_id) tour_id, starts_on, seats_left
FROM departures
WHERE starts_on >= '2026-11-01'
ORDER BY tour_id, starts_on;
-- (8 rows)  tour 9 এর কোনো Departure নেই`,
      },
      {
        language: "sql",
        filename: "06-traps.sql",
        code: `SELECT DISTINCT country FROM customers ORDER BY joined_at;
-- ERROR:  for SELECT DISTINCT, ORDER BY expressions must appear in select list

SELECT DISTINCT ON (customer_id) customer_id, booking_id
FROM bookings
ORDER BY booked_at DESC;
-- ERROR:  SELECT DISTINCT ON expressions must match initial ORDER BY expressions

SELECT count(DISTINCT x) AS distinct_values
FROM (VALUES ('Dhaka'), ('dhaka'), ('Dhaka '), ('Dhaka')) AS v(x);
-- 3  (1 row)`,
      },
    ],
    tip: (
      <>
        psql এ ভুলে NULL দেখানোর Setting না দিলে Drill 3 এর NULL একটা খালি লাইন হয়ে
        দেখাবে, আর মনে হবে উত্তরে একটা Row কম। \pset null &apos;(null)&apos; শুধু দেখানোর ধরন
        বদলায়, Data না। Docker এ চললে Time Zone UTC হতে পারে, তাই booked_at এর শেষে +00
        দেখলে অবাক হবেন না, Booking গুলো একই।
      </>
    ),
  },
};
