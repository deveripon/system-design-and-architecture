import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  BeforeAfterSplit,
  ModuleBridgeDiagram,
  ModuleRoadmap,
} from "../../../components/course/topics/overview/module-overview";
import { RealLifeLab } from "../../../components/course/topics/overview/overview-animations";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const tablesTypesConstraintsOverviewContent: TopicData = {
  id: "tables-types-constraints-overview",
  introduction: {
    badge: "MODULE 09 · OVERVIEW",
    title: <SectionTitle>এবার পড়া নয়, নিজের Table নিজে বানানো</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 08 শেষে আপনি প্রায় যেকোনো প্রশ্নের উত্তর SQL এ লিখতে পারেন। কিন্তু একটু খেয়াল করলে
          দেখবেন, ছয়টা মডিউল ধরে আপনি শুধু পড়েছেন। tours, bookings, payments, প্রতিটা Table অন্য কেউ
          বানিয়ে রেখেছিলেন। প্রতিটা দাম ছিল ঠিকঠাক টাকার অঙ্ক, প্রতিটা Booking এর একজন সত্যিকারের
          Customer ছিলেন, প্রতিটা status ছিল তিনটা শব্দের একটা। এগুলো কে নিশ্চিত করেছিল, সেই প্রশ্ন
          আপনাকে কখনো করতে হয়নি।
        </ContentParagraph>
        <ContentParagraph>
          এই মডিউল সেই প্রশ্নের উত্তর দেয়। যিনি Table গুলো বানিয়েছিলেন, তিনি প্রতিটা Column এর জন্য
          Database কে কয়েকটা নিয়ম বলে দিয়েছিলেন, আর Database প্রতিটা Row ঢোকার সময় সেই নিয়ম পাহারা
          দিয়েছে। এবার সেই কাজটা আপনার: নিজের Database আর Table বানানো, প্রতিটা Column এর জন্য ঠিক Data
          Type বাছা, ভুল Data কে দরজাতেই আটকানোর Constraint বসানো, চালু Table বদলানো, আর নিরাপদে মোছা।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার, এগারোটা লেসনে কী কী
          শিখবেন, না শিখলে কোথায় চুপচাপ ভুল Data ঢোকে আর মাস পরে কোথায় সেটা ফাটে, আর কাজের জায়গায়
          এগুলো কোথায় লাগে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ব্যাংকের ফর্মে টাকার ঘরে শুধু টাকা, তারিখের ঘরে শুধু তারিখ লেখা যায়। তারকা চিহ্নের ঘর ফাঁকা রাখলে কাউন্টার থেকেই ফর্ম ফেরত আসে। কারণ ভুলটা মাস পরে খুঁজে বের করার চেয়ে দরজায় আটকানো অনেক সস্তা।",
      author: "Tables, Data Types & Constraints",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>এবার কোনো তৈরি Table নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, ফারুক সাহেবের সাপ্তাহিক বৈঠক। শীতের মৌসুম থেকে Island Tours
                প্রতিটা ট্যুরের সাথে কিছু বাড়তি জিনিস বিক্রি করবে, যাকে দল বলছে Extras: Cox&apos;s Bazar
                Beach Weekend এ Life jacket ভাড়া, Sajek Valley Cloud Trip এ Jeep ride, Saint Martin এর ট্যুরে
                একজন Photographer। Website দল প্রস্তুত, শুধু একটা জিনিস বাকি: এগুলো রাখার একটা Table। এই
                ট্র্যাকে এই প্রথম কোনো প্রশ্নের উত্তর পড়ে পাওয়া যাবে না, কারণ পড়ার মতো Table টাই নেই।
                ফারুক সাহেব কাজটা আপনাকে দিলেন: কোন ট্যুরের সাথে, জিনিসটার নাম, দাম, আর কোন তারিখ থেকে
                পাওয়া যাবে।
              </ContentParagraph>
              <ContentParagraph>
                তাড়ার মধ্যে সবচেয়ে সহজ পথটাই নেওয়া হলো। চারটা Column, চারটাই text, কারণ text এ যেকোনো
                কিছু রাখা যায় আর কখনো Error আসে না, ঠিক Excel এর একটা Sheet এর মতো। এক সপ্তাহের মধ্যে চারটা
                চমক এল, আর একটারও কোনো Row ঢোকার সময় কোনো Error আসেনি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দুইবার ঢোকা Row।</strong> Admin Panel এর Save বোতামে কেউ দ্রুত দুইবার চাপ
                  দিয়েছিলেন, তাই মেনুতে Life jacket দুইবার, আর মাস শেষের হিসাবে তার বিক্রি দুইবার করে গোনা।
                  হুবহু এক দুইটা Row এর একটাকে আলাদা করে মোছার সহজ উপায়ও নেই।
                </ListItem>
                <ListItem>
                  <strong>অসম্ভব Row।</strong> একটা Jeep ride এর tour_id 99, অথচ ট্যুর মাত্র নয়টা। আরেকটার
                  দাম -1500, ছাড় বোঝাতে কেউ মাইনাস দিয়েছিলেন। আর একটা Row এ ট্যুর নেই, নাম নেই, দাম free,
                  তারিখ next Friday।
                </ListItem>
                <ListItem>
                  <strong>পড়ার সময় বিস্ফোরণ।</strong> মাস শেষে মালিক মোট দাম জানতে চাইলেন, আর যোগফলের
                  Query থামল{" "}
                  <code className={CODE}>{'invalid input syntax for type numeric: "free"'}</code> দিয়ে। তিন
                  সপ্তাহ আগে ঢোকা একটা শব্দ আজ পুরো Report আটকে দিল, যখন কে লিখেছিলেন কেউ মনে করতে পারেন
                  না।
                </ListItem>
                <ListItem>
                  <strong>পয়সার গরমিল।</strong> এক সহকর্মী দামের Column টা float করে দিলেন, দশমিকসহ সংখ্যা
                  তো। এই মাসে 99.99 টাকার Snack Box বিক্রি হয়েছে একশোটা, আর PostgreSQL যোগফল দেখায়
                  9998.999999999984। হিসাবরক্ষক sum = 9999 লিখে মেলাতে গেলে উত্তর আসে false।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চারটা দৃশ্যের মূল কথা একটাই। Database ঠিক তাই রাখে, যা আপনি তাকে দেন, যদি না আগে থেকে তাকে
                নিয়ম বলে দেন। নিয়ম দুই রকম। <strong>Data Type</strong> বলে একটা ঘরে কী ধরনের মান বসতে পারে:
                সংখ্যা, তারিখ না লেখা, আর সংখ্যা হলে কতটা নিখুঁত। <strong>Constraint</strong> বলে কোন মান
                চলবে না: ফাঁকা, ডুপ্লিকেট, মাইনাস, বা অন্য Table এ না থাকা ট্যুর। একবার বলে দিলে Database
                প্রতিটা Row এ নিয়মগুলো যাচাই করে, Row টা Website থেকে আসুক, রাতের Script থেকে, বা কোনো
                সহকর্মীর psql থেকে।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা কথা খোলাখুলি বলা দরকার। Module 03 থেকে 08 পর্যন্ত এই ট্র্যাক ইচ্ছা করেই আপনাকে
                শুধু পড়তে শিখিয়েছে, Table বানাতে নয়। Module 01 এর{" "}
                <Link href="/sql/topic/what-is-sql" className={LINK}>
                  What SQL Is
                </Link>{" "}
                লেসনে কারণটা বলা ছিল: আগে ভালো Table দেখে চোখ তৈরি হোক, তারপর নিজে বানানো। সেই চোখ এখন
                আপনার আছে, আর এই মডিউলের অনেক নিয়ম আপনি পাঠক হিসেবে আগেই দেখেছেন, না জেনে। Module 03 এর CASE
                লেসনে duration_days কখনো শূন্য ছিল না, কারণ একটা CHECK সেটা আটকে রেখেছিল। Module 08 এর ছকে
                অবস্থাগুলো ঠিক তিনটা Column এ ধরে গেছে, কারণ status এ তিনটার বাইরে কোনো শব্দ ঢুকতেই পারে না।
                এবার আপনি দেখবেন দরজার ওপাশ থেকে, যেখানে এই নিয়মগুলো লেখা হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল শেষে ফারুক সাহেবের Extras Table আপনি এমনভাবে বানাবেন যে উপরের চারটা চমকের একটাও আর
                ঘটতে পারবে না, আর প্রতিটা নিয়ম কেন বসালেন, সেটা একজন নতুন সহকর্মীকে বুঝিয়ে বলতে পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এখনই সব বুঝতে হবে না",
          content: (
            <p>
              প্রতিটা চমকের কারণ আর সমাধান এখানে ইচ্ছা করেই খুলে বলা হয়নি। দুইবার ঢোকা Row আর মাইনাস দাম
              আটকানো লেসন ৭ এ, নেই এমন ট্যুর আটকানো লেসন ৯ এ, আর টাকার Type লেসন ৩ এ। মডিউল শেষে এই অংশটা
              আবার পড়ে দেখুন, প্রতিটা চমকের পেছনের নিয়মটা তখন নিজেই বলতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>সাদা কাগজ বনাম ছাপানো ফর্ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যাংকে Account খোলার ফর্মটা মনে করুন। ব্যাংক আপনাকে সাদা কাগজ দিলে কেউ নাম লিখতেন, কেউ
                লিখতেন না, কেউ জন্মতারিখ লিখতেন 5/6/90, কেউ পাঁচ জুন। তাই ব্যাংক ছাপানো ফর্ম দেয়, আর
                কাউন্টারের কর্মকর্তা ফর্ম নেওয়ার আগেই সেটা দেখে নেন। সেই ফর্মের প্রতিটা অংশ এই মডিউলের একটা
                করে লেসন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আলমারি:</strong> ফর্ম রাখার জায়গা। নতুন App এর জন্য নতুন Database, লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>ফর্মের নকশা:</strong> কোন কোন ঘর, আর প্রতিটার নাম। Table আর Column বানানো, লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>টাকার ঘর:</strong> টাকা আর পয়সার আলাদা খোপ, যাতে পয়সা আন্দাজে না বসে। সংখ্যার
                  Type, লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>নামের ঘর:</strong> কয়টা অক্ষর ধরে, বাংলা লেখা যায় কি না, কোন বর্ণক্রমে সাজবে।
                  লেখার Type আর Collation, লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>তারিখের ঘর:</strong> দিন, মাস, বছরের আলাদা খোপ, যাতে 5/6 কে কেউ মে না জুন বলে ভুল
                  না পড়েন। তারিখ আর সময়ের Type, লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>টিক আর বাছাইয়ের ঘর:</strong> হ্যাঁ বা না, কখনো না মেলা রেফারেন্স নম্বর, আর ছাপানো
                  কয়েকটা বিকল্পের একটা। Boolean, UUID আর Enum, লেসন ৬।
                </ListItem>
                <ListItem>
                  <strong>তারকা চিহ্ন আর শর্ত:</strong> ফাঁকা রাখা যাবে না, ফাঁকা থাকলে ধরে নেওয়া হবে
                  বাংলাদেশ, এক পরিচয়পত্রে দুইটা Account নয়, বয়স আঠারোর কম নয়। NOT NULL, DEFAULT, UNIQUE আর
                  CHECK, লেসন ৭।
                </ListItem>
                <ListItem>
                  <strong>ছাপানো ক্রমিক নম্বর:</strong> প্রতিটা ফর্মের এমন একটা নম্বর, যা আর কোনো ফর্মে নেই।
                  Primary Key, লেসন ৮।
                </ListItem>
                <ListItem>
                  <strong>শাখার কোড:</strong> লেখা শাখাটা সত্যিই থাকতে হবে, আর শাখা বন্ধ হলে তার Account
                  গুলোর কী হবে, আগে থেকে ঠিক করা। Foreign Key, লেসন ৯।
                </ListItem>
                <ListItem>
                  <strong>নতুন সংস্করণ:</strong> একটা ঘর যোগ হলো, অথচ পুরনো হাজার ফর্ম আলমারিতে। ALTER TABLE,
                  লেসন ১০।
                </ListItem>
                <ListItem>
                  <strong>ফেলে দেওয়ার তিন উপায়:</strong> একটা ফর্ম ছেঁড়া, আলমারি খালি করে নকশা রাখা, আর
                  নকশাসহ সব ফেলে দেওয়া। DELETE, TRUNCATE আর DROP, লেসন ১১।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবগুলোর পেছনে একটাই নীতি:{" "}
                <strong>নিয়মটা Table এ লিখুন, Database সেটা প্রতিটা Row এ পাহারা দেবে।</strong> আর প্রতিটা
                Column বানানোর সময় তিনটা প্রশ্নের উত্তর দিতে হয়। এই ঘরে কী ধরনের মান বসবে, যার উত্তর Data
                Type। কোন মান এখানে চলবে না, যার উত্তর Constraint। আর এই ঘরটা অন্য কোন Table এর সাথে বাঁধা,
                যার উত্তর Key। তিনটার উত্তর না দিলেও Table তৈরি হয়ে যায়, কোনো Error আসে না। ঠিক সেজন্যই
                উপরের চমকগুলো এত চুপচাপ আসে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Extras Table এর তাড়াহুড়োর রূপ, সাদা কাগজের মতো: চারটা text Column, কোনো নিয়ম
                নেই। এতে উপরের দৃশ্যগুলোর চারটা Row ঢোকানো হয়েছে, তারপর মোট দাম চাওয়া হয়েছে। CREATE TABLE
                এর নিয়ম এখনই জানার দরকার নেই। শুধু Run চাপুন, আর দেখুন Table কোন কোন Row রেখে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাদা কাগজের Table: সব ঢোকে, পরে ফাটে"
              query={`DROP TABLE IF EXISTS ov_extras_loose;
CREATE TABLE ov_extras_loose (
  tour_id   text,
  name      text,
  price     text,
  available text
);
INSERT INTO ov_extras_loose VALUES
  ('2',  'Life jacket', '300',   '2026-11-01'),
  ('2',  'Life jacket', '300',   '2026-11-01'),
  ('99', 'Jeep ride',   '-1500', '10/11/2026'),
  (NULL, NULL,          'free',  'next Friday');
SELECT * FROM ov_extras_loose;
SELECT sum(price::numeric) AS total FROM ov_extras_loose;`}
              caption={`চারটা Row ই ঢুকেছে, কোনো আপত্তি ছাড়া: একই Life jacket দুইবার, নেই এমন tour 99, দাম -1500, আর এমন একটা Row যার ট্যুর আর নাম NULL, দাম free আর তারিখ next Friday। শেষ লাইনে দাম যোগ করতে চাইতেই এসেছে ERROR: invalid input syntax for type numeric: "free"। ভুলটা ঢোকার সময় কেউ থামায়নি, থামল পড়ার সময়। প্রথম লাইনের DROP TABLE IF EXISTS আগের Table সরিয়ে দেয়, তাই বক্সটা যতবার খুশি চালান। একই ভুলগুলো নিয়মসহ Table এ কী হয়, In Real Life অংশের বক্সে দেখবেন।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 08 পর্যন্ত আপনি শুধু পড়েছেন, শেষে Window Function দিয়ে প্রতিটা Row এর পাশে অনেক Row এর হিসাব বসিয়েছেন। Module 09 এ আপনি প্রথমবার লেখার দিকে আসেন: Database আর Table বানানো, প্রতিটা Column এর জন্য ঠিক Data Type, আর ভুল Data আটকানোর Constraint। Module 10 সেই Table গুলোতে Data ঢোকায়, বদলায় আর মোছে, আর প্রতিটা লেখায় এই মডিউলের নিয়মগুলোই পাহারা দেয়।"
              before={{
                tag: "Module 08",
                title: "Window Functions",
                lines: ["Row না হারিয়ে হিসাব", "র‍্যাংক আর চলমান যোগফল", "আগের Row এর সাথে তুলনা"],
              }}
              current={{
                tag: "Module 09",
                title: "Tables & Constraints",
                lines: ["নিজের Table নিজে বানানো", "ঠিক Data Type বাছাই", "Constraint এর পাহারা"],
              }}
              after={{
                tag: "Module 10",
                title: "Changing Data",
                lines: ["INSERT দিয়ে Data ঢোকানো", "UPDATE, DELETE আর Upsert", "ভুল বদল থেকে বাঁচা"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Module 04 এর{" "}
              <Link href="/sql/topic/type-casting" className={LINK}>
                Casting Between Types
              </Link>{" "}
              লেসনে ভুল মান এক Type থেকে আরেক Type এ বদলাতে গিয়ে আপনি ঠিক এই Error পেয়েছিলেন। পার্থক্য
              শুধু সময়ে: Column এর Type ঠিক থাকলে Error টা আসত Row ঢোকার মুহূর্তে, যিনি free লিখেছিলেন তাঁর
              সামনেই। আর Module 10 এ আপনি যত INSERT, UPDATE আর DELETE লিখবেন, তার প্রতিটার ভাগ্য ঠিক করে দেবে
              এই মডিউলে বসানো নিয়মগুলো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>এগারোটা লেসন, প্রতিটা Column এর তিনটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে
              প্রথমবার ক্রম ধরে যাওয়াই ভালো, কারণ পরের লেসনগুলো আগের লেসনে বানানো জিনিসের উপর দাঁড়ায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="tables-types-constraints"
              questions={{
                "create-database":
                  "নিজের প্রথম Database কীভাবে বানাবেন, জন্মের সময়েই তার Encoding আর Collation কেন ঠিক করে দিতে হয়, আর DROP DATABASE এর আগে কী কী ভাবতে হয়?",
                "create-table":
                  "একটা Table ঠিক কোন কোন অংশে তৈরি, নাম রাখার কোন নিয়ম বছর পরেও কষ্ট বাঁচায়, আর বানানো Table এর গঠন আবার কীভাবে পড়বেন?",
                "numeric-types":
                  "সিট, দাম, শতাংশ আর অক্ষাংশের জন্য কোন সংখ্যার Type, সীমা পেরোলে কী Error আসে, আর টাকা কেন কখনো float এ রাখা যায় না?",
                "text-types":
                  "char, varchar আর text এর আসল পার্থক্য কী, বাংলা নামে অক্ষর আর Byte এর হিসাব কেন আলাদা, আর লেখাগুলো কোন ক্রমে সাজবে, সেটা কে ঠিক করে?",
                "date-time-types":
                  "date, timestamp আর timestamptz এর কোনটা কখন, ঘটনার সময় কেন timestamptz এ রাখতে হয়, আর Time Zone আসলে জমা থাকে কি না?",
                "boolean-uuid-enum":
                  "হ্যাঁ বা না কীভাবে রাখবেন, কখনো না মেলা ID কীভাবে পাবেন, আর নির্দিষ্ট কয়েকটা মানের জন্য Enum, CHECK না আলাদা একটা Table?",
                "basic-constraints":
                  "ফাঁকা, ডুপ্লিকেট আর অসম্ভব মান Database কে দিয়ে কীভাবে আটকাবেন, দুইটা NULL কেন UNIQUE ভাঙে না, আর প্রতিটা নিয়ম ভাঙলে কোন Error আসে?",
                "primary-keys":
                  "প্রতিটা Row এর অনন্য পরিচয় কীভাবে বসাবেন, IDENTITY আর serial এর পার্থক্য কী, নম্বরে ফাঁক কেন পড়ে, আর নম্বর না UUID?",
                "foreign-keys":
                  "দুইটা Table এর সম্পর্ক Database কে দিয়ে কীভাবে পাহারা দেবেন, আর মূল Row মুছলে বাঁধা Row গুলোর কী হবে, সেটা আগে থেকে কীভাবে ঠিক করবেন?",
                "alter-table":
                  "Data ভরা চালু Table এ Column, Type আর Constraint কীভাবে যোগ বা বদল করবেন, আর বড় Table এ কোন ALTER কেন সবাইকে আটকে দিতে পারে?",
                "drop-truncate-delete":
                  "DROP, TRUNCATE আর DELETE তিনটাই মোছে, তবু কেন তিনটা আলাদা জিনিস, কোনটা কত দ্রুত, আর কোনটা ভুল করলে ফেরানো যায়?",
              }}
              footer="এগারোটা লেসন চার ভাগে মনে রাখা সহজ। প্রথম দুইটা জায়গা বানায়: Database আর Table। পরের চারটা প্রথম প্রশ্নের উত্তর, Data Type। পরের তিনটা দ্বিতীয় আর তৃতীয় প্রশ্নের উত্তর, পাহারা: সাধারণ Constraint, Primary Key আর Foreign Key। শেষ দুইটা বানানো জিনিস বদলানো আর মোছা, আর শেষেরটায় পুরো মডিউলের Recap।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনগুলো একটা গল্পের মতো পড়ুন। শুরু <strong>CREATE and DROP DATABASE</strong> দিয়ে, যেখানে
                দেখবেন CREATE DATABASE শূন্য থেকে কিছু বানায় না, template1 নামের একটা তৈরি Database কে কপি
                করে, আর তার Encoding আর Collation জন্মের সময়েই ঠিক হয়। psql এ{" "}
                <code className={CODE}>{"\\c"}</code> দিয়ে নতুন Database এ ঢোকা, প্রতিটা App আর পরিবেশের জন্য
                আলাদা Database, আর DROP DATABASE এর আগে কী কী দেখে নিতে হয়। এই লেসন চলে আপনার নিজের
                PostgreSQL এ, কারণ পাতার বক্সে Database একটাই।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় লেসন <strong>CREATE TABLE and Naming</strong> একটা Table এর গঠন খুলে দেখায়, আর নাম
                রাখার নিয়ম শেখায়: snake_case, সংরক্ষিত শব্দ এড়ানো, আর উদ্ধৃতিচিহ্ন দেওয়া বড় হাতের নামের
                ফাঁদ। <code className={CODE}>{'"TourExtras"'}</code> নামে Table বানিয়ে পরে উদ্ধৃতিচিহ্ন ছাড়া
                লিখলে PostgreSQL বলে{" "}
                <code className={CODE}>{'relation "tourextras" does not exist'}</code>। সাথে CREATE TABLE AS,
                LIKE, TEMP Table, আর বানানো Table <code className={CODE}>{"\\d"}</code> দিয়ে পড়া। এখানেই Extras
                এর একটা Table আপনি ধাপে ধাপে নিজে বানাবেন।
              </ContentParagraph>
              <ContentParagraph>
                পরের চারটা লেসন Type এর। <strong>Number Types: Why Money Is numeric</strong> এ পূর্ণসংখ্যার
                তিনটা আকার আর তাদের সীমা, numeric(10, 2) এর দুইটা সংখ্যার মানে, আর real ও double precision কেন
                আনুমানিক, যেখান থেকে Snack Box এর 9998.999999999984 আসে।{" "}
                <strong>Text Types, Encoding and Collation</strong> এ char, varchar আর text, একটা বাংলা অক্ষর কত
                Byte নেয়, আর লেখা সাজানোর ক্রম কে ঠিক করে। <strong>Date and Time Types</strong> এ ঘটনার সময় কেন
                timestamptz এ, আর কেন timestamptz আসলে Time Zone জমা রাখে না, রাখে একটা নির্দিষ্ট মুহূর্ত।{" "}
                <strong>Boolean, UUID and Enum</strong> এ হ্যাঁ না, কখনো না মেলা ID, আর নির্দিষ্ট কয়েকটা মানের
                তালিকা রাখার তিন উপায়ের লাভ ক্ষতি।
              </ContentParagraph>
              <ContentParagraph>
                তারপর পাহারার তিনটা লেসন। <strong>NOT NULL, DEFAULT, UNIQUE and CHECK</strong> এই মডিউলের
                কেন্দ্র: ফাঁকা, ডুপ্লিকেট আর অসম্ভব মান আটকানো, দুইটা Column মিলিয়ে UNIQUE, আর একটা চমক, UNIQUE
                Column এ দুইটা NULL ঠিকই ঢুকে যায়। <strong>Primary Keys: Identity, Serial, UUID</strong> এ
                IDENTITY এর দুই রূপ, পুরনো serial, আর নম্বরে ফাঁক কেন পড়ে।{" "}
                <strong>Foreign Keys and ON DELETE</strong> এ মূল Row মুছলে বাঁধা Row গুলোর কী হবে, তার পাঁচটা
                উত্তর চালিয়ে দেখা, আর এমন দুইটা জিনিস যা অনেকেই জানেন না: PostgreSQL Foreign Key এর Column এ
                নিজে থেকে Index বানায় না, আর MySQL Column এর লাইনে লেখা REFERENCES পড়ে কিন্তু মানে না।
              </ContentParagraph>
              <ContentParagraph>
                শেষে দুইটা লেসন বানানো জিনিস নিয়ে। <strong>ALTER TABLE</strong> চালু Table এ Column আর নিয়ম যোগ
                করে, Type বদলায়, আর দেখায় কেন ব্যস্ত বড় Table এ কিছু ALTER সবাইকে অপেক্ষা করায়। আর{" "}
                <strong>DROP vs TRUNCATE vs DELETE</strong> তিনটা মোছার পার্থক্য দেখায়, PostgreSQL আর MySQL এ
                কোনটা ROLLBACK দিয়ে ফেরে, আর শেষ হয় পুরো মডিউলের Recap দিয়ে: দুইটা Table এর একটা ছোট Schema,
                যার প্রতিটা নিয়ম একটা করে ইচ্ছাকৃত ভুল INSERT দিয়ে প্রমাণ করা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-learn-it",
      subHeader: { index: "004", title: "Why Learn It" },
      title: <SectionTitle>Framework তো নিজেই Table বানিয়ে দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম আপত্তি: Prisma, TypeORM বা Django এর মতো Framework তো Model দেখে নিজেই Table বানিয়ে
                দেয়। কথাটা আধা সত্যি। Framework CREATE TABLE লেখে ঠিকই, কিন্তু কোন Column এ কোন Type, কোনটা
                ফাঁকা থাকতে পারবে, আর একজন Customer মুছলে তাঁর Booking গুলোর কী হবে, এই সিদ্ধান্তগুলো আপনিই
                Model এ লিখে দেন। float আর numeric এর পার্থক্য না জানলে Framework বিশ্বস্তভাবে ভুল Table
                বানাবে। আর কিছু ভাঙলে Error আসে Database থেকে, তার নিজের ভাষায়। ORM আর Migration এর পুরো গল্প
                Module 17 এ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় আপত্তি: App এর Code এ তো Validation আছেই। সেটা দরকারি, ব্যবহারকারীকে সুন্দর করে ভুলটা
                বলার জন্য, কিন্তু Database এর নিয়মের জায়গা নিতে পারে না। Data ঢোকার দরজা অনেক: Website, Admin
                Panel, রাতের Import Script, কোনো সহকর্মীর psql, আর একটায় যাচাই ভুলে গেলেই হলো। একই মুহূর্তে
                দুইটা Request এলে দুইটাই জিজ্ঞেস করে এই Email কি আগে আছে, দুইটাই উত্তর পায় নেই, আর দুইটাই
                ঢোকে, এই দৌড় থামাতে পারে শুধু Database এর UNIQUE। আর App এর Code প্রতি সপ্তাহে বদলায়, কিন্তু
                Table এ লেখা নিয়ম থেকে যায়।
              </ContentParagraph>
              <ContentParagraph>এই মডিউল বাদ দিয়ে এগোলে খরচটা যেখানে দিতে হয়:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পয়সার গরমিল।</strong> float এ রাখা টাকার যোগ আর তুলনা কখনো ঠিক মেলে না।
                </ListItem>
                <ListItem>
                  <strong>দুইবার গোনা আর মালিকহীন Row।</strong> UNIQUE আর Foreign Key না থাকলে দুইবার চাপা
                  বোতাম দুইটা Row হয়, আর মুছে ফেলা Customer এর Booking JOIN এ চুপচাপ বাদ পড়ে।
                </ListItem>
                <ListItem>
                  <strong>ভুল দিনের হিসাব।</strong> Time Zone ছাড়া রাখা সময়ে রাত সাড়ে বারোটার Booking আগের
                  দিনে, এমনকি আগের মাসে চলে যায়।
                </ListItem>
                <ListItem>
                  <strong>চালু Table এ আটকে যাওয়া।</strong> নতুন NOT NULL Column যোগ করতে গিয়ে Error, বা এমন
                  ALTER যা কয়েক মিনিট সবাইকে আটকে রাখে।
                </ListItem>
                <ListItem>
                  <strong>ভুল জিনিস মোছা।</strong> একটা Table খালি করতে CASCADE লিখে আরও তিনটা Table খালি করে
                  ফেলা, যা Transaction এর বাইরে আর ফেরে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>আর কয়েকটা প্রচলিত ভুল ধারণা, যেগুলো এই মডিউল ভাঙবে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CREATE DATABASE খালি একটা জায়গা বানায়।</strong> আসলে template1 কে কপি করে। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>Table এর নামে বড় হাতের অক্ষর দিলে সুন্দর।</strong> উদ্ধৃতিচিহ্ন দিয়ে বানালে সারাজীবন
                  উদ্ধৃতিচিহ্ন দিয়েই লিখতে হয়। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>float এ টাকা চলে, দেখানোর সময় দুই ঘর রাখলেই হলো।</strong> দেখানোটা ঠিক দেখায়, ভেতরের
                  যোগ ভুলই থাকে। লেসন ৩।
                </ListItem>
                <ListItem>
                  <strong>varchar(255) সবচেয়ে নিরাপদ।</strong> PostgreSQL এ text আর varchar এর গতি একই, সংখ্যাটা
                  শুধু একটা নিয়ম। লেসন ৪।
                </ListItem>
                <ListItem>
                  <strong>timestamptz Time Zone টাও রাখে।</strong> রাখে শুধু মুহূর্তটা। লেসন ৫।
                </ListItem>
                <ListItem>
                  <strong>UNIQUE Column এ দুইটা NULL ঢুকবে না।</strong> ঢুকে যায়, যদি না NULLS NOT DISTINCT লেখেন।
                  লেসন ৭।
                </ListItem>
                <ListItem>
                  <strong>id এর নম্বরে ফাঁক মানে কেউ Row মুছেছেন।</strong> ব্যর্থ INSERT ও নম্বর খরচ করে। লেসন ৮।
                </ListItem>
                <ListItem>
                  <strong>Foreign Key দিলে Index ও তৈরি হয়।</strong> PostgreSQL এ হয় না, MySQL এ হয়। লেসন ৯।
                </ListItem>
                <ListItem>
                  <strong>TRUNCATE মানে দ্রুত একটা DELETE।</strong> তাতে WHERE নেই, আর MySQL এ ROLLBACK দিয়েও
                  ফেরে না। লেসন ১১।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা কথা মনে রাখুন",
          content: (
            <p>
              Database ঠিক তাই রাখে, যা আপনি দেন। নিয়ম না বললে সে সব মেনে নেয়, আর ভুলটা ফাটে মাস পরে, পড়ার
              সময়। প্রতিটা Column বানানোর সময় তিনটা প্রশ্নের উত্তর মুখে বলুন: এখানে কী ধরনের মান বসবে, কোন
              মান চলবে না, আর এটা অন্য কোন Table এর সাথে বাঁধা। Table এ লেখা নিয়ম প্রতিটা লেখায় যাচাই হয়,
              App এর Code এ লেখা নিয়ম শুধু সেখানে, যেখানে কেউ মনে করে লিখেছিলেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের সাতটা ঘটনা যেকোনো দলের কাজে বারবার আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা
              কেমন যায় আর জানলে কেমন যায়, আর কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "float-money",
                  label: "float এ টাকা",
                  situation:
                    "99.99 টাকার Snack Box এর দামের Column বানানো হয়েছিল float দিয়ে। এই মাসে বিক্রি একশোটা, আর হিসাবরক্ষক Payment এর তালিকায় পেয়েছেন ঠিক 9999.00 টাকা।",
                  without:
                    "Query তে যোগফল আসে 9998.999999999984, আর sum(price) = 9999 এর উত্তর false। কেউ Report এ round() বসিয়ে ঢেকে দেন, কিন্তু প্রতিটা মেলানো আর তুলনা ভেতরে ভুলই থাকে।",
                  withIt:
                    "আপনি টাকার Column বানান numeric(10, 2) দিয়ে। একই একশোটা বিক্রির যোগফল ঠিক 9999.00, আর = 9999 এর উত্তর true।",
                  lessons: ["Number Types: Why Money Is numeric"],
                },
                {
                  id: "long-name",
                  label: "লম্বা নামের Customer",
                  situation:
                    "full_name Column কেউ একটা পুরনো Tutorial দেখে varchar(20) বানিয়েছিলেন। আজ Mohammad Abdullah Al Mamun Chowdhury নামে একজন Account খুলতে এলেন, নামটা ছত্রিশ অক্ষরের।",
                  without:
                    "INSERT থামে ERROR: value too long for type character varying(20) দিয়ে, আর Customer চলে যান। আরেক জায়গায় কেউ মানটা ::varchar(20) দিয়ে বদলে নিয়েছিলেন, সেখানে কোনো Error ছাড়াই নামটা কেটে Mohammad Abdullah Al হয়ে জমা হয়েছে।",
                  withIt:
                    "আপনি জানেন PostgreSQL এ text আর varchar এর গতি একই, তাই নামের জন্য text নেন, আর সত্যিই সীমা লাগলে যুক্তিসঙ্গত একটা CHECK বসান।",
                  lessons: ["Text Types, Encoding and Collation"],
                },
                {
                  id: "midnight-booking",
                  label: "রাত সাড়ে বারোটার Booking",
                  situation:
                    "1 November 2026, রাত সাড়ে বারোটায় ঢাকা থেকে একটা Booking হলো। Server এর ঘড়ি চলে UTC তে, আর booked_at Column Time Zone ছাড়া timestamp।",
                  without:
                    "Column এ জমা হয় 2026-10-31 18:30:00। Booking টা November এর Report এ নেই, October এ আছে, আর সংখ্যাটা দেখতে এত স্বাভাবিক যে কেউ টের পান না।",
                  withIt:
                    "আপনি ঘটনার সময় রাখেন timestamptz এ। Database মুহূর্তটা রাখে, আর ঢাকার Session এ দেখায় 2026-11-01 00:30:00+06।",
                  lessons: ["Date and Time Types"],
                },
                {
                  id: "double-save",
                  label: "Save বোতামে দুইবার চাপ",
                  situation:
                    "ধীর Internet এ Admin Panel থেকে Life jacket যোগ করার সময় Save বোতামে দুইবার চাপ পড়ল। দুইটা Request প্রায় একই মুহূর্তে Server এ পৌঁছাল।",
                  without:
                    "App দুইবারই দেখে নিয়েছিল এই নামে আগে কিছু আছে কি না, দুইবারই উত্তর পেয়েছিল নেই। মেনুতে এখন দুইটা Life jacket, আর বিক্রির হিসাব দ্বিগুণ।",
                  withIt:
                    "Table এ UNIQUE (tour_id, name) বসানো, তাই দ্বিতীয় INSERT থামে duplicate key value violates unique constraint দিয়ে। App এই Error ধরে বলে, এটা আগেই যোগ করা আছে।",
                  lessons: ["NOT NULL, DEFAULT, UNIQUE and CHECK", "Primary Keys: Identity, Serial, UUID"],
                },
                {
                  id: "deleted-customer",
                  label: "Customer মুছলেন, Booking রয়ে গেল",
                  situation:
                    "Rahim Uddin Account বন্ধ করতে বললেন, আর Support দলের একজন customers থেকে customer_id 1 মুছতে চাইলেন। তাঁর তিনটা Booking আছে, দুইটা confirmed, মোট 44000.00 টাকা।",
                  without:
                    "Foreign Key না থাকলে Row টা মুছে যায়, আর তিনটা Booking এ পড়ে থাকে customer_id 1, যেটা আর কাউকে বোঝায় না। আয়ের Report এ JOIN করলে confirmed আয় 44000.00 টাকা কম দেখায়।",
                  withIt:
                    "bookings এ Foreign Key আছে, তাই DELETE থামে, আর DETAIL বলে Key (customer_id)=(1) is still referenced from table \"bookings\"। Booking গুলোর কী হবে, আটকানো, একসাথে মোছা, না ফাঁকা করা, সেটা Table বানানোর সময়েই লিখে রাখা যায়।",
                  lessons: ["Foreign Keys and ON DELETE"],
                },
                {
                  id: "new-column",
                  label: "গাইডদের জরুরি নম্বর",
                  situation:
                    "ফারুক সাহেব চান পাঁচজন গাইডের প্রত্যেকের একটা জরুরি নম্বর থাকুক, যা কখনো ফাঁকা থাকবে না।",
                  without:
                    "ALTER TABLE guides ADD COLUMN emergency_phone text NOT NULL লিখতেই আসে column \"emergency_phone\" of relation \"guides\" contains null values। Error সরাতে NOT NULL মুছে দেন, আর Column চিরকাল ফাঁকা থাকে।",
                  withIt:
                    "আপনি জানেন পুরনো পাঁচটা Row এ নতুন Column এর মান নেই। আগে NOT NULL ছাড়া যোগ করেন, নম্বরগুলো বসান, তারপর SET NOT NULL।",
                  lessons: ["ALTER TABLE"],
                },
                {
                  id: "staging-cleanup",
                  label: "Staging খালি করতে গিয়ে",
                  situation:
                    "Staging Server এ Test এর Customer গুলো সরিয়ে নতুন করে শুরু করতে আপনি লিখলেন TRUNCATE customers।",
                  without:
                    "আসে cannot truncate a table referenced in a foreign key constraint। HINT এর পরামর্শে না ভেবে CASCADE জুড়ে দেন, আর customers এর সাথে bookings, payments আর reviews ও খালি হয়ে যায়।",
                  withIt:
                    "আপনি আগে দেখে নেন CASCADE কোন কোন Table টানবে। PostgreSQL এ TRUNCATE ও Transaction এর ভেতরে চলে, তাই BEGIN এর ভেতরে চালিয়ে Row গুনে দেখেন, তারপর COMMIT বা ROLLBACK। MySQL এ এই সুযোগ নেই।",
                  lessons: ["DROP vs TRUNCATE vs DELETE", "Foreign Keys and ON DELETE"],
                },
              ]}
              footer="প্রতিটা ঘটনার Error আর সংখ্যা Island Tours এর Sample Database এ PostgreSQL 18 এ সত্যি চালিয়ে পাওয়া। MySQL 8.4 এ কোথায় কী আলাদা, সেটা নিচে How to Study অংশে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এর বাইরেও কয়েকটা জায়গায় এই মডিউল নিয়মিত কাজে আসে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা নতুন Feature আর Code Review।</strong> নতুন Feature মানে প্রায় সবসময় নতুন
                  Table বা নতুন Column, আর Review তে প্রশ্ন ওঠে ঠিক এখানে: এই Column ফাঁকা থাকতে পারবে কেন, এই
                  দাম numeric নয় কেন।
                </ListItem>
                <ListItem>
                  <strong>Migration File।</strong> দলে Table এর প্রতিটা বদল যায় একটা Migration File এ, যার
                  ভেতরে থাকে এই মডিউলের CREATE আর ALTER। পূর্ণ গল্প Module 17 এ।
                </ListItem>
                <ListItem>
                  <strong>বাইরের Data আমদানি।</strong> অন্য কারো পাঠানো CSV তে উল্টো তারিখ আর ফাঁকা ঘর। ঠিক Type
                  আর Constraint থাকলে খারাপ Row ঢোকার সময়েই ধরা পড়ে। COPY দিয়ে আমদানি Module 10 এ।
                </ListItem>
                <ListItem>
                  <strong>Interview।</strong> একটা Booking System এর Table ডিজাইন, DELETE আর TRUNCATE এর
                  পার্থক্য, টাকা float এ নয় কেন, Primary Key হিসেবে নম্বর না UUID। Backend Interview এর খুব
                  পরিচিত প্রশ্ন এগুলো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "in-real-life",
      subHeader: { index: "006", title: "In Real Life" },
      title: <SectionTitle>Island Tours এর Table গুলো যেভাবে বানানো</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যে আটটা Table আপনি ছয়টা মডিউল ধরে পড়েছেন, সেগুলো ঠিক এই মডিউলের হাতিয়ার দিয়েই বানানো।
              Sample Database এর নিজের Catalog থেকে গুনলে: সাতচল্লিশটা Column এর মধ্যে মাত্র তিনটা ফাঁকা থাকতে
              পারে, customers এর phone, reviews এর comment আর tours এর guide_id। প্রতিটা Table এর একটা করে মোট
              আটটা Primary Key, সবগুলো IDENTITY। সাতটা Foreign Key, নয়টা CHECK, আর তিনটা UNIQUE: destinations
              এর name, customers এর email, আর reviews এর booking_id, যাতে এক Booking এ একটার বেশি Review না
              হয়। নিচে tours আর bookings যেভাবে বানানো হয়েছিল, হুবহু। মডিউল শেষে এর প্রতিটা শব্দ আপনি ব্যাখ্যা
              করতে পারবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "public/sql/island-tours.sql",
          code: `CREATE TABLE tours (
  tour_id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          text NOT NULL,
  destination_id integer NOT NULL REFERENCES destinations (destination_id),
  guide_id       integer REFERENCES guides (guide_id),
  duration_days  smallint NOT NULL CHECK (duration_days > 0),
  price_bdt      numeric(10, 2) NOT NULL CHECK (price_bdt >= 0),
  max_seats      smallint NOT NULL CHECK (max_seats > 0),
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL REFERENCES customers (customer_id),
  departure_id integer NOT NULL REFERENCES departures (departure_id),
  seats        smallint NOT NULL CHECK (seats > 0),
  status       text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_bdt    numeric(10, 2) NOT NULL,
  booked_at    timestamptz NOT NULL DEFAULT now()
);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <code className={CODE}>GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code>: নম্বর Database নিজে
                  দেয়, আর আপনি নিজে দিতে চাইলে আপত্তি করে। লেসন ৮।
                </ListItem>
                <ListItem>
                  <code className={CODE}>REFERENCES destinations (destination_id)</code>: নেই এমন গন্তব্যের
                  ট্যুর হয় না। guide_id এ NOT NULL নেই, কারণ গাইড এখনো ঠিক নাও হতে পারে, যেমন Ratargul Swamp
                  Boat Day এর। লেসন ৭ আর ৯।
                </ListItem>
                <ListItem>
                  <code className={CODE}>smallint</code> আর <code className={CODE}>numeric(10, 2)</code>: দিন
                  আর সিট ছোট পূর্ণসংখ্যা, দাম পয়সা পর্যন্ত নিখুঁত। লেসন ৩।
                </ListItem>
                <ListItem>
                  <code className={CODE}>{"CHECK (price_bdt >= 0)"}</code>: অসম্ভব মান দরজাতেই ফেরত। লেসন ৭।
                </ListItem>
                <ListItem>
                  <code className={CODE}>timestamptz NOT NULL DEFAULT now()</code>: ঘটনার মুহূর্ত, না দিলে
                  এখনকার সময়। লেসন ৫।
                </ListItem>
                <ListItem>
                  <code className={CODE}>{"CHECK (status IN (...))"}</code>: status এর জন্য Enum নয়, text আর
                  তিনটা মানের তালিকা। এই পছন্দের লাভ ক্ষতি লেসন ৬ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে ফারুক সাহেবের Extras Table, এবার ছাপানো ফর্মের মতো, নিয়মসহ: extra_id নিজে থেকে বসা
                অনন্য নম্বর, tour_id অবশ্যই tours এ থাকা একটা ট্যুর, দাম নিখুঁত দশমিক আর মাইনাস নয়, তারিখ
                সত্যিকারের তারিখ, আর একই ট্যুরে একই নাম দুইবার নয়। প্রথম Life jacket ঢোকে, তারপর Save বোতামে
                দুইবার চাপের মতো ঠিক সেই Row টা আবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছাপানো ফর্মের Table: ভুল ফেরে দরজাতেই"
              query={`DROP TABLE IF EXISTS ov_extras;
CREATE TABLE ov_extras (
  extra_id     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES tours (tour_id),
  name         text NOT NULL,
  price_bdt    numeric(10, 2) NOT NULL CHECK (price_bdt >= 0),
  available_on date NOT NULL,
  UNIQUE (tour_id, name)
);
INSERT INTO ov_extras (tour_id, name, price_bdt, available_on)
VALUES (2, 'Life jacket', 300, '2026-11-01');
SELECT * FROM ov_extras;
INSERT INTO ov_extras (tour_id, name, price_bdt, available_on)
VALUES (2, 'Life jacket', 300, '2026-11-01');`}
              caption={`প্রথম Life jacket ঢুকেছে, extra_id 1 Database নিজে বসিয়েছে, আর দাম 300.00, কারণ Column টা পয়সা পর্যন্ত রাখে। দ্বিতীয়বার দিতেই ERROR: duplicate key value violates unique constraint "ov_extras_tour_id_name_key", DETAIL: Key (tour_id, name)=(2, Life jacket) already exists। এবার শেষ VALUES লাইনটা বদলে একটা একটা করে ভুল দিন, আর প্রতিবার বক্সটা আবার চালান। tour_id 99 দিলে Foreign Key বলে Key (tour_id)=(99) is not present in table "tours"। দাম -1500 দিলে CHECK থামায়, আর Failing row এর প্রথম ঘরে 2: Row না ঢুকলেও একটা নম্বর খরচ হয়েছে, কারণ লেসন ৮ এ। দাম 'free' বা তারিখ 'next Friday' দিলে invalid input syntax, নামের জায়গায় NULL দিলে violates not-null constraint। শেষে নাম 'Photographer', দাম 2000, তারিখ '10/11/2026' দিন, আর একদম শেষে SELECT * FROM ov_extras; যোগ করুন। Row ঢুকে যায়, আর তারিখ দেখায় 2026-10-11, এগারো অক্টোবর, কারণ এখানে DateStyle হলো ISO, MDY, মানে স্ল্যাশ দেওয়া তারিখে আগে মাস। Type যাচাই করে মানটা দেখতে তারিখের মতো কি না, আপনি কী বোঝাতে চেয়েছিলেন সেটা নয়। তাই তারিখ সবসময় 2026-11-10 এর মতো বছর, মাস, দিন ক্রমে লিখুন।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই মডিউলে আপনি নিজে যা যা করবেন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  নিজের PostgreSQL এ একটা Database বানাবেন, তার Encoding আর Collation পড়বেন, তারপর সাবধানে
                  মুছবেন।
                </ListItem>
                <ListItem>একই দামগুলো float আর numeric এ যোগ করে গরমিলটা নিজের চোখে দেখবেন।</ListItem>
                <ListItem>
                  প্রতিটা Constraint এর জন্য একটা ইচ্ছাকৃত ভুল INSERT চালিয়ে Error আর DETAIL পুরো পড়বেন।
                </ListItem>
                <ListItem>
                  ON DELETE এর প্রতিটা বিকল্প দিয়ে একটা মূল Row মুছে দেখবেন বাঁধা Row গুলোর কী হয়।
                </ListItem>
                <ListItem>
                  Data ভরা Table এ NOT NULL Column যোগ করবেন, আগে ভুল উপায়ে, তারপর ঠিক উপায়ে।
                </ListItem>
                <ListItem>
                  একই রকম Table DELETE, TRUNCATE আর DROP দিয়ে মুছে দেখবেন প্রতিবার কী থাকে আর কী যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "before-and-after",
      subHeader: { index: "007", title: "Before and After" },
      title: <SectionTitle>এই মডিউল আপনাকে কোথা থেকে কোথায় নিয়ে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <BeforeAfterSplit
              before={[
                "নতুন Table লাগলে সব Column text করে দেন, কারণ তাতে কখনো Error আসে না",
                "টাকার Column এ float দেন, কারণ দশমিকসহ সংখ্যা তো",
                "নামের জন্য অভ্যাসবশে varchar(255) লেখেন, কেন জানেন না",
                "ঘটনার সময় রাখেন Time Zone ছাড়া timestamp এ",
                "ডুপ্লিকেট আর মালিকহীন Row ঠেকানোর দায়িত্ব পুরোটা App এর Code এ ছেড়ে দেন",
                "Error এ নিয়মের নাম দেখে বুঝতে পারেন না কোন নিয়মটা ভাঙল",
                "চালু Table এ Column যোগের Error সরাতে নিয়মটাই মুছে দেন",
                "DELETE, TRUNCATE আর DROP কে একই কাজের তিনটা নাম ভাবেন",
              ]}
              after={[
                "প্রতিটা Column এর তিনটা প্রশ্নের উত্তর দিয়ে Type আর নিয়ম বেছে Table বানান",
                "টাকা রাখেন numeric এ, আর float কেন চলে না, একটা উদাহরণ দিয়ে দেখাতে পারেন",
                "লেখার জন্য text নেন, আর সীমা লাগলে কারণসহ একটা CHECK বসান",
                "ঘটনার সময় রাখেন timestamptz এ, আর জানেন Database আসলে কী জমা রাখে",
                "UNIQUE, CHECK, NOT NULL আর Foreign Key দিয়ে ভুল Data দরজাতেই ফেরান",
                "Error এর নিয়মের নাম আর DETAIL পড়ে সাথে সাথে বলেন কোন Row কোন নিয়ম ভেঙেছে",
                "চালু Table এ ধাপে ধাপে ALTER করেন, আর জানেন কোন ALTER বড় Table কে আটকে রাখে",
                "কাজ বুঝে DELETE, TRUNCATE বা DROP বাছেন, আর ঝুঁকির কাজ আগে BEGIN এর ভেতরে চালিয়ে দেখেন",
              ]}
              footer="বাঁ দিকের প্রায় প্রতিটা অভ্যাস অভিজ্ঞ Developer দেরও একসময় ছিল। মডিউল শেষে ডান দিকের তালিকাটা দিয়ে নিজেকে যাচাই করুন, আর যেটায় দ্বিধা থাকে, তার লেসনে আবার ফিরে যান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের মানদণ্ড হলো যেকোনো CREATE TABLE পড়ে তার প্রতিটা শব্দ ব্যাখ্যা করতে পারা। কেউ
                আপনাকে bookings এর status লাইনটা দেখালে আপনি তিনটা প্রশ্ন ধরে বলবেন। কী ধরনের মান: লেখা। কোন
                মান চলবে না: ফাঁকা নয়, আর pending, confirmed, cancelled এর বাইরে কিছুই নয়, বড় হাতের C দিয়ে
                লেখা Confirmed ও নয়। কোন Table এর সাথে বাঁধা: কোনোটার সাথে নয়, তালিকাটা নিয়মের ভেতরেই লেখা।
                তারপর যোগ করবেন, নতুন একটা অবস্থা এলে এই CHECK টা ALTER দিয়ে বদলাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি একটা Table কে আর শুধু Data রাখার জায়গা হিসেবে দেখবেন না, দেখবেন নিয়মের একটা
                চুক্তি হিসেবে, যেটা প্রতিটা App আর প্রতিটা মানুষকে মানতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "how-to-study",
      subHeader: { index: "008", title: "How to Study" },
      title: <SectionTitle>এই মডিউল কীভাবে পড়লে সবচেয়ে বেশি পাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আগে যা লাগবে।</strong> Module 01 এর{" "}
                <Link href="/sql/topic/relational-model" className={LINK}>
                  The Relational Model
                </Link>{" "}
                লেসন, কারণ Primary Key আর Foreign Key এর ধারণা সেখানে প্রথম এসেছিল, এখানে আপনি সেগুলো নিজে
                লিখবেন। Module 02 এর psql আর{" "}
                <Link href="/sql/topic/databases-schemas" className={LINK}>
                  Databases, Schemas and search_path
                </Link>
                , কারণ প্রথম লেসন চলে আপনার নিজের PostgreSQL এ। Module 03 এর NULL লেসন, কারণ NOT NULL বুঝতে
                আগে NULL বুঝতে হয়। আর Module 04 এর Casting Between Types, কারণ প্রতিটা Type এর লেসনে মান বদলাতে
                গিয়ে Error দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সময় আর ক্রম।</strong> পুরো মডিউলের জন্য ছয় সাত দিন ধরে রাখুন। এগারোটা লেসন পড়তে মোট
                প্রায় পাঁচ ঘণ্টা দশ মিনিট থেকে সাত ঘণ্টা লাগে, আর লেসন ৩, ৫ আর ৯ এ একটু বেশি সময় রাখুন, কারণ
                টাকা আর সময়ের ভুল চোখে দেখা যায় না, আর ON DELETE এর পাঁচটা বিকল্প নিজে চালালে তবেই মনে থাকে। লেসন
                ১ আর ২ আগে পড়ুন। ৩ থেকে ৬ এর Type গুলো যেকোনো ক্রমে চলে। ৭, ৮ আর ৯ ক্রম ধরে, কারণ Primary Key
                আসলে দুইটা সাধারণ Constraint এর যোগফল, আর Foreign Key সাধারণত একটা Primary Key এর দিকেই আঙুল
                তোলে। ১০ আগের সবকিছু বদলায়, আর ১১ এ পুরো মডিউলের Recap।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ইচ্ছা করে নিয়ম ভাঙুন।</strong> এই মডিউলের সবচেয়ে বড় অনুশীলন: প্রতিটা CREATE TABLE এর
                পরে অন্তত একটা ভুল Row ঢোকানোর চেষ্টা করুন, আর Error টা পুরো পড়ুন। কোন নিয়মের নাম এল, DETAIL এ
                কোন মান, আর আপনি যেটা আশা করেছিলেন সেটাই কি না। ভুল Row টা যদি ঢুকেই যায়, যেমন উপরের বক্সের
                10/11/2026, শেখার আসল জিনিসটা ঠিক সেখানে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Query বক্স আর অনুশীলন।</strong> Table বানানোর প্রতিটা বক্স DROP TABLE IF EXISTS দিয়ে শুরু,
                তাই যতবার খুশি চালান, আর নামের সামনে লেসনের ছোট নাম থাকে, যেমন এই পাতার ov_extras, যাতে Sample
                Table এর সাথে না মেলে। একই পাতার সব বক্স একটাই Database ভাগ করে। Sample Table বদলানোর বক্স সবসময়
                BEGIN দিয়ে শুরু আর ROLLBACK দিয়ে শেষ, যাতে পরের বক্সগুলোর সংখ্যা না বদলায়। Table বানানোর
                অনুশীলনে শুরুর Code এর শেষে একটা যাচাইয়ের Query থাকে। তার উপরে আপনার CREATE TABLE লিখুন, আর
                যাচাইয়ের Query টা শেষ লাইনেই রাখুন, কারণ বক্স সেটার ফলাফলই সমাধানের সাথে মেলায়। কোনো Statement
                দশ সেকেন্ডের বেশি চললে বক্স Database নতুন করে শুরু করে, তখন এই পাতায় বানানো Table গুলোও চলে যায়,
                বক্সগুলো আবার চালালেই ফিরে আসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখছেন?</strong> এই পাতার নিয়মসহ Extras Table টা MySQL 8.4 এ চালিয়ে দেখা
                হয়েছে, IDENTITY এর জায়গায় AUTO_INCREMENT আর numeric এর জায়গায় DECIMAL(10, 2) দিয়ে। ডুপ্লিকেট
                থেমেছে ERROR 1062 এ, মাইনাস দাম ERROR 3819 এ, free দাম ERROR 1366 এ, next Friday ERROR 1292 এ,
                ফাঁকা নাম ERROR 1048 এ, আর 10/11/2026 ও ERROR 1292 এ, যেটা PostgreSQL চুপচাপ এগারো অক্টোবর
                বানিয়েছিল। কিন্তু tour 99 এর Row টা MySQL এ ঢুকে গেছে, কারণ MySQL Column এর লাইনে লেখা REFERENCES
                পড়ে কিন্তু মানে না, SHOW CREATE TABLE এ কোনো Foreign Key নেই। আলাদা লাইনে{" "}
                <code className={CODE}>FOREIGN KEY (tour_id) REFERENCES tours (tour_id)</code> লিখলে তবেই ERROR
                1452 আসে, লেসন ৯ এ। আর MySQL এর FLOAT চার Byte এর: FLOAT Column এ রাখা 99.99 এর সাথে price =
                99.99 তুলনায় MySQL উত্তর দিয়েছে 0, মানে মেলেনি। তাই MySQL এ টাকা সবসময় DECIMAL এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটকে গেলে।</strong> প্রথমে Error এ নিয়মের নামটা পড়ুন। নিজে নাম না দিলে PostgreSQL নাম
                বানায় Table, Column আর নিয়মের ধরন জুড়ে: ov_extras_price_bdt_check মানে ov_extras এর price_bdt এর
                CHECK, শেষে _fkey মানে Foreign Key, _key মানে UNIQUE, _pkey মানে Primary Key। তারপর DETAIL পড়ুন,
                সেখানে ঠিক কোন মানটা সমস্যা, লেখা থাকে। Table এর গঠন মনে না থাকলে psql এ{" "}
                <code className={CODE}>{"\\d ov_extras"}</code> দিয়ে দেখুন। আর বক্সে বানানো Table অদ্ভুত আচরণ
                করলে বক্সটা আবার চালান, প্রথম লাইনের DROP TABLE IF EXISTS সব নতুন করে শুরু করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পরের ধাপ।</strong> এখান থেকে সোজা চলে যান প্রথম লেসনে,{" "}
                <strong>CREATE and DROP DATABASE</strong>, যেখানে আপনি প্রথমবার নিজের একটা Database বানাবেন, আর
                দেখবেন সেটা আসলে শূন্য থেকে নয়, একটা ছাঁচ থেকে জন্মায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["লেসন", "এক লাইনে যা নিয়ে ফিরবেন"],
    rows: [
      [
        "CREATE and DROP DATABASE",
        "CREATE DATABASE template1 কে কপি করে নতুন Database বানায়, Encoding আর Collation জন্মের সময়েই ঠিক হয়, আর DROP এর আগে কে কে যুক্ত আছেন দেখে নিতে হয়",
      ],
      [
        "CREATE TABLE and Naming",
        "Table মানে নাম, Column, Type আর নিয়ম, আর snake_case এ উদ্ধৃতিচিহ্ন ছাড়া নাম রাখলে বছর পরেও কষ্ট হয় না",
      ],
      [
        "Number Types: Why Money Is numeric",
        "পূর্ণসংখ্যার জন্য integer পরিবার, টাকার জন্য numeric, আর float আনুমানিক বলে টাকায় কখনো নয়",
      ],
      [
        "Text Types, Encoding and Collation",
        "PostgreSQL এ text আর varchar এর গতি একই, বাংলা অক্ষর আর Byte আলাদা গোনা হয়, আর সাজানোর ক্রম ঠিক করে Collation",
      ],
      [
        "Date and Time Types",
        "ঘটনার সময় timestamptz এ, কারণ সে একটা নির্দিষ্ট মুহূর্ত রাখে, Time Zone নয়, আর দেখানোর সময় Session এর Zone এ সাজায়",
      ],
      [
        "Boolean, UUID and Enum",
        "হ্যাঁ না এর জন্য boolean, কখনো না মেলা ID এর জন্য uuid, আর কয়েকটা মানের তালিকার জন্য Enum, CHECK বা আলাদা Table, লাভ ক্ষতি বুঝে",
      ],
      [
        "NOT NULL, DEFAULT, UNIQUE and CHECK",
        "চারটা নিয়ম ভুল Data দরজাতেই ফেরায়, আর প্রতিটা ভাঙলে নিয়মের নাম আর SQLSTATE সহ Error দেয়",
      ],
      [
        "Primary Keys: Identity, Serial, UUID",
        "Primary Key মানে UNIQUE আর NOT NULL একসাথে, নম্বর দেওয়ার আধুনিক উপায় IDENTITY, আর নম্বরে ফাঁক পড়া স্বাভাবিক",
      ],
      [
        "Foreign Keys and ON DELETE",
        "Foreign Key নেই এমন Row এর দিকে আঙুল তুলতে দেয় না, আর মূল Row মুছলে কী হবে তা ON DELETE এ আগেই লেখা থাকে",
      ],
      [
        "ALTER TABLE",
        "চালু Table এ Column আর নিয়ম যোগ বা বদল করা যায়, তবে ব্যস্ত বড় Table এ কিছু ALTER সবাইকে আটকে রাখে",
      ],
      [
        "DROP vs TRUNCATE vs DELETE",
        "DROP Table সরায়, TRUNCATE সব Row খালি করে নকশা রাখে, DELETE বেছে বেছে মোছে, আর কোনটা ফেরানো যায় তা Database ভেদে আলাদা",
      ],
    ],
  },
};
