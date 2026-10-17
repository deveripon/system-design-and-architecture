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
  ConcurrentSeatsLab,
  UpdateFromLab,
  UpdateStepLab,
} from "../../../components/course/topics/dml/upd-animations";
import {
  LostUpdateSplit,
  RowVersionDiagram,
  SetReadsOldSplit,
  UpdateAnatomyDiagram,
  UpdateFromMatchDiagram,
} from "../../../components/course/topics/dml/upd-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const updateContent: TopicData = {
  id: "update",
  introduction: {
    badge: "MODULE 10 · LESSON 02",
    title: <SectionTitle>যা আছে তা বদলানো: UPDATE</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি INSERT দিয়ে নতুন Row ঢুকিয়েছেন। কিন্তু একটা Database এর বেশিরভাগ লেখার কাজ নতুন Row না, পুরনো
          Row এর মান বদলানো। Customer নতুন ফোন নম্বর দিলেন, শীতের মৌসুমে দাম বাড়ল, কেউ Booking বাতিল করলেন, একটা Departure এ
          আসন খালি হলো। প্রতিটা ঘটনা মানে কোনো একটা Table এর কোনো একটা Row এর কোনো একটা Column এ নতুন মান। সেই কাজের নাম
          UPDATE।
        </ContentParagraph>
        <ContentParagraph>
          UPDATE লেখা সহজ, তিন শব্দেই শুরু: কোন Table, কোন Column এ কী মান, কোন Row গুলোতে। কঠিন অংশটা হলো ঠিক সেই Row গুলোই
          বেছে নেওয়া, আর বদলের আগে নিশ্চিত হওয়া যে বদলটা আপনি যা ভাবছেন তাই করবে। কারণ একটা ভুল UPDATE কোনো Error দেয় না,
          চুপচাপ ভুল মান লিখে দেয়, আর সেটা ধরা পড়ে অনেক পরে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি একটা আর অনেক Row বদলাবেন, অনেক Column একসাথে, হিসাব করা মান দিয়ে। আরেক Table দেখে বদলাবেন, প্রতিটা Row
          এর জন্য আলাদা Subquery দিয়ে বদলাবেন। RETURNING দিয়ে বদলের আগের আর পরের মান একসাথে দেখবেন, updated_at Column রাখবেন,
          আর দেখবেন PostgreSQL ভেতরে ভেতরে একটা UPDATE কে আসলে কীভাবে লেখে। সব কাজ Island Tours এর আসল Data র কপিতে, আর শেষে
          আসল Table এ একটা মহড়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি রাবার আর পেন্সিল না। পুরনো লেখা মুছি না, তার পাশে নতুন লেখা বসাই, আর পুরনোটা রেখে দিই যতক্ষণ কেউ সেটা পড়ছে। শুধু বলে দিন কোন লাইনগুলো, বাকিটা আমি করব।",
      author: "UPDATE",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবারের বৈঠক, তিনটা বদল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর সাপ্তাহিক বৈঠকে Operations Manager ফারুক সাহেব তিনটা কাজ নিয়ে এলেন।
                এক, Customer Tanvir Ahmed ফোন করে নিজের নম্বর দিয়েছেন, অথচ Database এ তাঁর phone খালি। দুই, শীতের মৌসুম শুরু, তিন
                দিন বা তার বেশি দিনের ট্যুরের দাম দশ শতাংশ বাড়বে, একশো টাকায় গোল করে। তিন, Priya Sharma তাঁর Pending Booking টা
                বাতিল করেছেন, তাঁর দুটো আসন Departure এ ফেরত যাওয়া দরকার।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer তানিম গত সপ্তাহে INSERT শিখেছেন। কিন্তু এই তিনটার একটাও নতুন Row না। Tanvir এর Row আছে, ট্যুর গুলোর
                Row আছে, Booking এর Row আছে। দরকার আগে থেকে থাকা Row এর কয়েকটা Column এ নতুন মান বসানো। SQL এ সেই কাজের Statement
                একটাই: <code className={CODE}>UPDATE</code>। এটা Module 01 এর{" "}
                <Link href="/sql/topic/what-is-sql" className={LINK}>
                  What Is SQL
                </Link>{" "}
                লেসনের DML পরিবারের সদস্য, INSERT আর DELETE এর ভাই।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা শুরুতেই মনে গেঁথে নিন। UPDATE কখনো Row যোগ করে না, কখনো Row মোছে না। Table এ আগে ১৫টা Row থাকলে পরেও
                ১৫টাই থাকে। বদলায় শুধু কিছু Row এর কিছু মান। আর কোন Row বদলাবে, সেটা আপনি বলে দেন WHERE দিয়ে, ঠিক যেমন SELECT এ
                বলতেন কোন Row দেখাবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Box এ customers এর একটা কপি বানানো হয়েছে, নাম <code className={CODE}>upd_customers</code>, তারপর ফারুক সাহেবের
                প্রথম কাজটা। এই লেসনের নিজের সব Table এর নাম <code className={CODE}>upd_</code> দিয়ে শুরু, যাতে আসল Table এর সাথে
                কখনো না মেশে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম UPDATE"
              query={`-- আসল customers এর একটা অনুশীলনের কপি
DROP TABLE IF EXISTS upd_customers;
CREATE TABLE upd_customers AS
SELECT customer_id, full_name, email, phone, city
FROM customers;

-- Tanvir Ahmed (customer_id 3) এর নতুন ফোন নম্বর
UPDATE upd_customers
SET phone = '+8801000000103'
WHERE customer_id = 3;

SELECT customer_id, full_name, phone
FROM upd_customers
WHERE customer_id IN (2, 3, 4)
ORDER BY customer_id;`}
              caption="SELECT 15: কপিতে ১৫ জন Customer। তারপর UPDATE 1: ঠিক একটা Row বদলেছে, এটাই PostgreSQL এর ছোট্ট রিপোর্ট। শেষ Table এ Tanvir Ahmed এর phone এখন +8801000000103, পাশের Nusrat আর Farhana যেমন ছিলেন তেমন। আসল customers Table এ Tanvir এর phone এখনো NULL, কারণ বদলটা হয়েছে শুধু কপিতে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কেন কপিতে অনুশীলন",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                এই পাতার সব Query Box একটাই Database ভাগ করে। একটা Box যদি আসল tours এর দাম বদলে দেয়, পরের প্রতিটা Box ভুল
                সংখ্যা দেখাবে, আর লেসনের লেখা ফলাফলের সাথে মিলবে না। তাই প্রতিটা Box শুরু হয় একটা{" "}
                <code className={CODE}>DROP TABLE IF EXISTS</code> আর <code className={CODE}>CREATE TABLE ... AS SELECT</code>{" "}
                দিয়ে: প্রতিবার Run চাপলে টাটকা কপি, যত খুশি বদলান।
              </ContentParagraph>
              <ContentParagraph>
                মনে রাখবেন, Module 09 এর{" "}
                <Link href="/sql/topic/create-table" className={LINK}>
                  CREATE TABLE
                </Link>{" "}
                লেসনের মতো, এভাবে বানানো কপিতে শুধু Column আর Data আসে, Primary Key, NOT NULL, CHECK বা Default আসে না। নিয়ম
                দরকার হলে এই লেসনে আলাদা করে Table বানানো হয়েছে। আসল Table এ বদল দেখানো হয়েছে শুধু একবার, Project Example এ,
                BEGIN আর ROLLBACK এর ভেতরে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "anatomy",
      subHeader: { index: "002", title: "Anatomy" },
      title: <SectionTitle>একটা UPDATE এর প্রতিটা অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpdateAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির Statement টা এই লেসনের প্রায় সব অংশ একসাথে দেখায়। একটা একটা করে পড়া যাক:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>UPDATE Table [Alias]:</strong> কোন Table বদলাবে। একটা UPDATE সবসময় একটাই Table বদলায়। চাইলে ছোট একটা
                  Alias দিতে পারেন, যেমন <code className={CODE}>t</code>, যেটা FROM থাকলে খুব কাজে লাগে।
                </ListItem>
                <ListItem>
                  <strong>SET Column = মান:</strong> কোন Column এ কী বসবে। কমা দিয়ে যত খুশি Column। ডানদিকে লেখা যায় যেকোনো
                  Expression: একটা ধ্রুব মান, ওই Row এরই অন্য Column, হিসাব, Function, CASE, এমনকি Subquery। আর ডানদিকে যে Column
                  পড়বেন, সেটা সবসময় বদলের আগের মান।
                </ListItem>
                <ListItem>
                  <strong>FROM অন্য Table:</strong> ঐচ্ছিক, PostgreSQL এর নিজের সুবিধা। নতুন মান বা শর্ত আরেকটা Table থেকে আনতে।
                  সেকশন ৭ এ পুরোটা।
                </ListItem>
                <ListItem>
                  <strong>WHERE শর্ত:</strong> কোন Row গুলো বদলাবে। SELECT এর WHERE এর মতোই সব নিয়ম। না দিলে Table এর প্রতিটা Row
                  বদলায়, আর সেটা এত বড় বিপদ যে এই Module এর শেষ লেসন{" "}
                  <Link href="/sql/topic/update-without-where" className={LINK}>
                    UPDATE Without WHERE
                  </Link>{" "}
                  পুরোটাই তা নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>RETURNING:</strong> ঐচ্ছিক। বদলানো Row গুলো Query এর ফলাফলের মতো ফেরত দেয়। PostgreSQL 18 থেকে বদলের আগের
                  মান <code className={CODE}>old</code> আর পরের মান <code className={CODE}>new</code> দুটোই চাওয়া যায়। সেকশন ৯ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                লেখার ক্রম আর কাজের ক্রম আলাদা, ছবির নিচের সারিটা দেখুন। PostgreSQL আগে FROM আর WHERE দিয়ে Row খোঁজে। তারপর প্রতিটা
                মিলে যাওয়া Row এর জন্য SET এর হিসাব করে, পুরনো মান থেকে। তারপর নিয়মগুলো পরীক্ষা করে: CHECK, NOT NULL, UNIQUE,
                Foreign Key। তারপর নতুন মানসহ Row এর একটা নতুন Version লেখে। সবশেষে RETURNING এর তালিকা, আর ছোট্ট রিপোর্ট{" "}
                <code className={CODE}>UPDATE n</code>, যেখানে n হলো কয়টা Row বদলাল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UPDATE, তারপর RETURNING"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT * FROM tours;

UPDATE upd_tours
SET price_bdt = 13500.00
WHERE tour_id = 1
RETURNING tour_id, title, price_bdt;`}
              caption="UPDATE এর পরে কোনো SELECT লেখা হয়নি, তবু একটা Table এসেছে: 1, Saint Martin Island Escape, 13500.00। এটা RETURNING এর কাজ, বদলানো Row টা সাথে সাথে ফেরত। RETURNING না লিখলে শুধু UPDATE 1 দেখাত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Row এর পরিচয় দিয়ে বদলান",
          content: (
            <ContentParagraph>
              একটা নির্দিষ্ট Row বদলাতে চাইলে WHERE এ তার Primary Key দিন, নাম না। <code className={CODE}>WHERE customer_id = 3</code>{" "}
              ঠিক একটা Row ধরবে, প্রতিবার। <code className={CODE}>{"WHERE full_name = 'Tanvir Ahmed'"}</code> আজ একজনকে ধরছে, কাল
              একই নামের দ্বিতীয় Customer এলে দুজনকেই ধরবে। Module 09 এর{" "}
              <Link href="/sql/topic/primary-keys" className={LINK}>
                Primary Keys
              </Link>{" "}
              লেসনের সেই কথাটাই: Primary Key এর কাজ হলো একটা Row কে নিশ্চিতভাবে চেনা, আর UPDATE এ সেটাই সবচেয়ে বেশি দরকার।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "choosing-rows",
      subHeader: { index: "003", title: "Choosing Rows with WHERE" },
      title: <SectionTitle>WHERE ঠিক করে কোন Row বদলাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UPDATE এর WHERE আর SELECT এর WHERE হুবহু একই জিনিস। Module 03 এ যা শিখেছেন, সব এখানে চলে: তুলনা আর AND, OR (
                <Link href="/sql/topic/where-filters" className={LINK}>
                  WHERE Filters
                </Link>
                ), IN, BETWEEN, LIKE (
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  IN, BETWEEN, LIKE
                </Link>
                ), আর NULL এর নিয়ম (
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL Logic
                </Link>
                )। পার্থক্য শুধু ফলাফলে: SELECT মিলে যাওয়া Row গুলো দেখায়, UPDATE সেগুলো বদলায়। তাই SELECT এ যে ভুল শুধু ভুল
                তালিকা দেখাত, UPDATE এ সেই ভুল Data নষ্ট করে।
              </ContentParagraph>
              <ContentParagraph>
                দুটো জিনিস বিশেষ করে মনে রাখুন। প্রথমত, কোনো Row না মিললে সেটা Error না। PostgreSQL শান্তভাবে বলে{" "}
                <code className={CODE}>UPDATE 0</code>, আর পরের কাজে চলে যায়। বানান ভুল, ভুল id, ভুল শর্ত, সব ক্ষেত্রেই একই চুপচাপ
                শূন্য। দ্বিতীয়ত, NULL এর সাথে <code className={CODE}>=</code> কখনো সত্য হয় না। খালি ফোনগুলো ধরতে চাইলে{" "}
                <code className={CODE}>IS NULL</code>, নইলে আবার সেই চুপচাপ শূন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা WHERE, তিনটা গোনা"
              query={`DROP TABLE IF EXISTS upd_customers;
CREATE TABLE upd_customers AS
SELECT customer_id, full_name, email, phone, city, country
FROM customers;

-- বানান ভুল: Database এ লেখা Chattogram
UPDATE upd_customers SET city = 'Chattogram' WHERE city = 'Chittagong';

-- NULL এর সাথে = কখনো সত্য না
UPDATE upd_customers SET phone = 'not given' WHERE phone = NULL;

-- ঠিক উপায়
UPDATE upd_customers SET phone = 'not given' WHERE phone IS NULL;

SELECT count(*) FILTER (WHERE phone = 'not given') AS not_given,
       count(*) FILTER (WHERE phone IS NULL)       AS still_null
FROM upd_customers;`}
              caption="প্রথম দুটো UPDATE 0। প্রথমটায় Chittagong বানানে কোনো শহরই নেই, দ্বিতীয়টায় phone = NULL কোনো Row এর জন্যই সত্য হয়নি। কোনোটাই Error না, তাই খেয়াল না করলে মনে হবে কাজ হয়ে গেছে। তৃতীয়টা IS NULL দিয়ে: UPDATE 5, সাম্পল Data র পাঁচটা খালি ফোনই ভরল। শেষ Table এ not_given 5, still_null 0।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার আপনার পালা। ফারুক সাহেব বললেন, বিদেশি Customer দের ফোন নম্বর না থাকলে সেটা জানিয়ে রাখা দরকার, যাতে Email এ
              যোগাযোগ করা হয়। কিন্তু দেশি Customer দের খালি ফোন খালিই থাকবে, কারণ তাঁদের নম্বর শিগগিরই জোগাড় হবে।
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
                  Starter এ customers এর একটা কপি আছে, <code className={CODE}>upd_ex1_customers</code>। যাঁদের country
                  Bangladesh না আর phone খালি, শুধু তাঁদের phone এ বসান <code className={CODE}>not given</code>। Bangladesh এর যাঁদের
                  phone খালি, তাঁদের phone NULL ই থাকবে। শেষের যাচাইয়ের Query টা যেমন আছে তেমনই শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex1_customers;
CREATE TABLE upd_ex1_customers AS
SELECT customer_id, full_name, phone, country FROM customers;

-- এখানে আপনার UPDATE লিখুন

SELECT customer_id, full_name, phone
FROM upd_ex1_customers
ORDER BY customer_id;`}
              hint={
                <>
                  WHERE এ দুটো শর্ত, AND দিয়ে: phone IS NULL, আর country {"<>"} &apos;Bangladesh&apos;। ঠিক লিখলে PostgreSQL বলবে
                  UPDATE 3: Priya, Aiman আর Oliver। UPDATE 5 দেখলে বুঝবেন দেশের শর্তটা বাদ পড়েছে।
                </>
              }
              solution={`SELECT customer_id,
       full_name,
       CASE WHEN country <> 'Bangladesh' AND phone IS NULL THEN 'not given'
            ELSE phone
       END AS phone
FROM customers
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "several-columns",
      subHeader: { index: "004", title: "Several Columns at Once" },
      title: <SectionTitle>এক UPDATE এ অনেক Column, আর পুরনো মানের নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই Row এর কয়েকটা Column একসাথে বদলাতে আলাদা আলাদা UPDATE লাগে না। SET এর পরে কমা দিয়ে লিখে যান। আরেকটা রূপও আছে,
                নাম Row Constructor: বাম দিকে বন্ধনীতে Column এর তালিকা, ডানদিকে বন্ধনীতে মানের তালিকা, একই ক্রমে। দুটো রূপের কাজ
                একই, যেটা পড়তে সুবিধা লাগে সেটা লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর নতুন গাইড Nazmul Karim এর ফোন নম্বর বদলেছে, আর তিনি এখন ইংরেজিতেও ট্যুর করান। পরে দেখা গেল তথ্যটা
                ভুল ছিল, আগের মানই ঠিক। নিচের Box এ দুটো কাজ, দুই রূপে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো Column, দুই রকম লেখায়"
              query={`DROP TABLE IF EXISTS upd_guides;
CREATE TABLE upd_guides AS
SELECT * FROM guides;

-- কমা দিয়ে আলাদা
UPDATE upd_guides
SET phone = '+8801000000299',
    language = 'English'
WHERE guide_id = 5;

SELECT guide_id, full_name, phone, language
FROM upd_guides WHERE guide_id = 5;

-- একই কাজ, Row Constructor রূপে
UPDATE upd_guides
SET (phone, language) = ('+8801000000205', 'Bangla')
WHERE guide_id = 5;

SELECT guide_id, full_name, phone, language
FROM upd_guides WHERE guide_id = 5;`}
              caption="প্রথম UPDATE 1 এর পরে Nazmul Karim এর phone +8801000000299, language English। দ্বিতীয় UPDATE 1 এর পরে আবার +8801000000205 আর Bangla, আসল guides এর মতো। একটা জিনিস চেষ্টা করে দেখতে পারেন: একই Column দুবার লিখলে, যেমন SET language = 'English', language = 'Bangla', PostgreSQL বলে multiple assignments to same column language।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই সেকশনের আসল কথাটা। SET এর ডানদিকে যত Column পড়বেন, সবগুলো বদলের আগের মান, এমনকি সেই Column বাম দিকে
                আগে বদলে গেলেও। PostgreSQL পুরো Row এর পুরনো রূপটা হাতে রেখে সব হিসাব একসাথে করে, তারপর একবারে নতুন Row লেখে। এর
                সবচেয়ে সুন্দর প্রমাণ দুটো Column এর মান অদলবদল: <code className={CODE}>SET a = b, b = a</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SetReadsOldSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অদলবদল, এক লাইনে"
              query={`DROP TABLE IF EXISTS upd_swap;
CREATE TABLE upd_swap (id integer, a text, b text);
INSERT INTO upd_swap VALUES (1, 'left', 'right');

UPDATE upd_swap SET a = b, b = a;

SELECT * FROM upd_swap;`}
              caption="ফলাফল 1, right, left: দুটো মান জায়গা বদলেছে। b = a লেখার সময় a আসলে তখনো পুরনো left, কারণ ডানদিকের সব হিসাব পুরনো Row থেকে। অন্য ভাষায় অদলবদলের জন্য একটা তৃতীয় চলক লাগত, এখানে লাগে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই নিয়ম শুধু খেলার জন্য না, বাস্তবেও কাজে লাগে। ধরুন দুটো ট্যুর এক দিন করে লম্বা হবে, আর দিনপ্রতি দাম আগের মতোই
              থাকবে। নতুন দাম = পুরনো দাম ভাগ পুরনো দিন গুণ নতুন দিন। একই SET এ duration_days ও বদলাচ্ছে, তবু দামের হিসাবে{" "}
              <code className={CODE}>duration_days</code> লিখলে পুরনো দিনই আসবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দিন বাড়ল, দিনপ্রতি দাম একই"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, duration_days, price_bdt FROM tours;

UPDATE upd_tours
SET duration_days = duration_days + 1,
    price_bdt     = price_bdt / duration_days * (duration_days + 1)
WHERE tour_id IN (1, 4);

SELECT tour_id, title, duration_days, price_bdt
FROM upd_tours
WHERE tour_id IN (1, 4)
ORDER BY tour_id;`}
              caption="ট্যুর 1 এখন 4 দিন, দাম 16666.67: 12500 ভাগ 3 গুণ 4, আর price_bdt এর numeric(10, 2) Type সেটা দুই দশমিক ঘরে গোল করেছে। ট্যুর 4 এখন 3 দিন, দাম 14250.00: 9500 ভাগ 2 গুণ 3। দুই Assignment ই পুরনো duration_days পড়েছে। নতুনটা পড়লে ট্যুর 1 এর হিসাব হতো 12500 ভাগ 4 গুণ 5।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ এই নিয়ম আলাদা",
          content: (
            <ContentParagraph>
              MySQL এর Documentation বলে এক Table এর UPDATE এ Assignment সাধারণত বাম থেকে ডানে চলে, আর পরের Assignment আগেরটার
              লেখা নতুন মান পড়ে। একই <code className={CODE}>SET a = b, b = a</code> MySQL 8.4 এ চালালে ফল right, right। দুই
              Database এ চলবে এমন কোড লিখলে এমন Assignment এড়িয়ে চলুন। বিস্তারিত সেকশন ১৩ এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "expressions",
      subHeader: { index: "005", title: "Expressions in SET" },
      title: <SectionTitle>হিসাব করা মান: দাম বাড়ানো, গোল করা, CASE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SET এর ডানদিকে একটা SELECT এর Column এ যা যা লেখা যায়, প্রায় সবই লেখা যায়। Module 04 এর সব Function এখানে কাজে
                লাগে: <code className={CODE}>round()</code> দিয়ে টাকা গোল করা (
                <Link href="/sql/topic/numeric-functions" className={LINK}>
                  Numeric Functions
                </Link>
                ), <code className={CODE}>lower(trim(email))</code> দিয়ে Email পরিষ্কার করা, <code className={CODE}>starts_on + 7</code>{" "}
                দিয়ে Departure এক সপ্তাহ পেছানো, <code className={CODE}>COALESCE</code> দিয়ে খালি জায়গায় মান বসানো। আর আছে{" "}
                <code className={CODE}>DEFAULT</code> শব্দটা: <code className={CODE}>SET country = DEFAULT</code> Column টার Default
                মান বসায়, Default না থাকলে NULL।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেবের দ্বিতীয় কাজ: তিন দিন বা তার বেশি দিনের ট্যুরের দাম দশ শতাংশ বেশি, একশো টাকায় গোল করে।{" "}
                <code className={CODE}>round(x, -2)</code> মানে দশমিকের বাম দিকে দুই ঘরে গোল, অর্থাৎ নিকটতম একশো। 13750 হয় 13800,
                কারণ ঠিক মাঝখানের মান numeric এ শূন্য থেকে দূরের দিকে গোল হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শীতের দাম: ১০% বেশি, একশোয় গোল"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, duration_days, price_bdt, is_active FROM tours;

UPDATE upd_tours
SET price_bdt = round(price_bdt * 1.10, -2)
WHERE duration_days >= 3;

SELECT tour_id, title, duration_days, price_bdt
FROM upd_tours
ORDER BY tour_id;`}
              caption="UPDATE 5। বদলেছে পাঁচটা: ট্যুর 1 এর 12500 থেকে 13800.00, ট্যুর 3 এর 18000 থেকে 19800.00, ট্যুর 5 এর 14000 থেকে 15400.00, ট্যুর 8 এর 32000 থেকে 35200.00, ট্যুর 9 এর 15500 থেকে 17100.00 (17050 এর গোল)। দুই দিন আর এক দিনের চারটা ট্যুর আগের দামে। লক্ষ করুন ট্যুর 8, মানে বন্ধ থাকা Saint Martin Luxury Stay ও বেড়েছে। ফারুক সাহেব কি সেটাই চেয়েছিলেন? সেকশন ৬ এ এই প্রশ্নটাই ধরা পড়বে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpdateStepLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক UPDATE এ আলাদা Row এ আলাদা নিয়ম চাইলে CASE (
                <Link href="/sql/topic/case-expression" className={LINK}>
                  CASE Expression
                </Link>
                )। ধরুন এক দিনের ট্যুরে 500 টাকা বাড়বে আর চার দিনের ট্যুরে পাঁচ শতাংশ ছাড়। CASE প্রতিটা Row এর জন্য প্রথম যে WHEN
                সত্য, তার মান দেয়। কিন্তু সাবধান: কোনো WHEN না মিললে আর ELSE না থাকলে CASE দেয় NULL। SELECT এ সেটা শুধু একটা খালি
                ঘর, UPDATE এ সেটা আসল দাম মুছে ফেলা।
              </ContentParagraph>
              <ContentParagraph>
                তাই CASE দিয়ে UPDATE লিখলে দুটোর একটা অবশ্যই করুন: WHERE দিয়ে শুধু সেই Row গুলো বেছে নিন যাদের কোনো না কোনো WHEN
                মিলবে, অথবা <code className={CODE}>ELSE price_bdt</code> লিখে বাকিদের আগের মান ফেরত দিন। নিচের দুটো Box পাশাপাশি
                চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CASE, WHERE দিয়ে বাঁধা"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, duration_days, price_bdt, is_active FROM tours;

UPDATE upd_tours
SET price_bdt = CASE
      WHEN duration_days = 1  THEN price_bdt + 500
      WHEN duration_days >= 4 THEN round(price_bdt * 0.95, 2)
    END
WHERE duration_days = 1 OR duration_days >= 4;

SELECT tour_id, duration_days, price_bdt
FROM upd_tours
ORDER BY tour_id;`}
              caption="UPDATE 3। ট্যুর 7 (এক দিন) এখন 4000.00, ট্যুর 5 আর 8 (চার দিন) এখন 13300.00 আর 30400.00। বাকি ছয়টা আগের দামেই, কারণ WHERE ওদের ছুঁতেই দেয়নি। এখানে ELSE না থাকলেও বিপদ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই CASE, WHERE ছাড়া"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, duration_days, price_bdt, is_active FROM tours;

UPDATE upd_tours
SET price_bdt = CASE
      WHEN duration_days = 1  THEN price_bdt + 500
      WHEN duration_days >= 4 THEN round(price_bdt * 0.95, 2)
    END;

SELECT tour_id, duration_days, price_bdt
FROM upd_tours
ORDER BY tour_id;`}
              caption="UPDATE 9, আর ছয়টা ট্যুরের price_bdt এখন NULL: 1, 2, 3, 4, 6, 9। শুধু 5, 7, 8 এর দাম ঠিক আছে। কোনো Error আসেনি, কারণ এই কপিতে NOT NULL নেই। আসল tours এ price_bdt NOT NULL, সেখানে এই Statement পুরোটাই বাতিল হতো null value in column price_bdt of relation tours violates not-null constraint বলে। Constraint আপনাকে এখানে বাঁচাত, সেকশন ১১ তে সেই গল্প।"
            />
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
                  Starter এ tours এর কপি <code className={CODE}>upd_ex2_tours</code>। চালু (is_active সত্য) আর তিন দিন বা তার বেশি
                  দিনের ট্যুরে পাঁচ শতাংশ ছাড়, নতুন দাম নিকটতম একশো টাকায় গোল। বাকি ট্যুরের দাম যেমন আছে তেমন। যাচাইয়ের Query টা
                  শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex2_tours;
CREATE TABLE upd_ex2_tours AS
SELECT tour_id, title, duration_days, price_bdt, is_active FROM tours;

-- এখানে আপনার UPDATE লিখুন

SELECT tour_id, price_bdt
FROM upd_ex2_tours
ORDER BY tour_id;`}
              hint={
                <>
                  ছাড়ের পরের দাম মানে price_bdt * 0.95, আর একশোয় গোল মানে round(..., -2)। WHERE এ দুটো শর্ত: is_active আর
                  duration_days {">="} 3। ঠিক হলে UPDATE 4, আর ট্যুর 1 এর দাম 11875 না, 11900.00।
                </>
              }
              solution={`SELECT tour_id,
       CASE WHEN is_active AND duration_days >= 3
            THEN round(price_bdt * 0.95, -2)
            ELSE price_bdt
       END AS price_bdt
FROM tours
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "preview-and-count",
      subHeader: { index: "006", title: "Preview, Then Count" },
      title: <SectionTitle>আগে SELECT, তারপর UPDATE, তারপর গোনা মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অভিজ্ঞ Developer রা একটা অভ্যাস কখনো ছাড়েন না: UPDATE লেখার আগে একই WHERE দিয়ে একটা SELECT। SELECT কিছু বদলায়
                না, তাই যত খুশি চালানো যায়। সেটা দেখায় ঠিক কোন Row গুলো বদলাবে, কয়টা বদলাবে, আর SELECT এর তালিকায় নতুন মানটাও একটা
                হিসাব করা Column হিসেবে রাখা যায়, পুরনো মানের পাশে। চোখে সব ঠিক লাগলে তবেই SELECT কে UPDATE বানান: প্রথম লাইনটা বদলে
                যায়, WHERE হুবহু একই থাকে, একটা অক্ষরও না বদলে।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেবের শীতের দামের কাজটা এভাবে আবার করা যাক। আগের সেকশনে সরাসরি UPDATE চালানো হয়েছিল। এবার আগে দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ ১: কিছু না বদলে দেখে নেওয়া"
              query={`SELECT tour_id, title, price_bdt AS old_price,
       round(price_bdt * 1.10, -2) AS new_price
FROM tours
WHERE duration_days >= 3
ORDER BY tour_id;`}
              caption="পাঁচটা Row, প্রতিটার পুরনো আর নতুন দাম পাশাপাশি: 1, 3, 5, 8, 9। তালিকায় চোখ বোলাতেই ধরা পড়ে ট্যুর 8, Saint Martin Luxury Stay, যেটা এখন বন্ধ (is_active false)। বন্ধ ট্যুরের দাম বাড়িয়ে লাভ নেই, আর আবার চালুর সময় কেউ ভুল দাম দেখবেন। আসল Table এ কিছুই বদলায়নি, তাই শর্তটা ঠিক করে নেওয়ার সুযোগ আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ ২: ঠিক করা WHERE, তারপর গোনা মেলানো"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, duration_days, price_bdt, is_active FROM tours;

-- Preview তে AND is_active যোগ করার পর ৪টা Row দেখিয়েছিল
UPDATE upd_tours
SET price_bdt = round(price_bdt * 1.10, -2)
WHERE duration_days >= 3 AND is_active;

-- কপি আর আসল Table মিলিয়ে দেখা: কয়টা দাম আলাদা হলো
SELECT count(*) AS raised
FROM upd_tours u
JOIN tours s ON s.tour_id = u.tour_id
WHERE u.price_bdt <> s.price_bdt;`}
              caption="UPDATE 4, আর raised 4। Preview বলেছিল চারটা Row, UPDATE এর রিপোর্টও চার, আর কপির সাথে আসল Table মিলিয়ে দেখা গেল ঠিক চারটা দাম আলাদা। তিনটা সংখ্যা মিলে গেলে নিশ্চিন্ত হওয়া যায়। না মিললে থামুন, খুঁজুন কেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে <code className={CODE}>UPDATE 4</code> এর গোনা নিয়ে একটা সূক্ষ্ম কথা। PostgreSQL এর Documentation বলে এই
                সংখ্যা হলো যতগুলো Row বদলানো হয়েছে তার সংখ্যা, সেই Row গুলো সহ যাদের মান আসলে বদলায়নি। মানে, WHERE এ মিলেছে
                এমন প্রতিটা Row গোনায় আসে, নতুন মান আর পুরনো মান এক হলেও। নিচের Box এ ট্যুর 7 আগে থেকেই চালু, ট্যুর 8 বন্ধ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গোনায় আসে মিলে যাওয়া Row, বদলানো না"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, is_active FROM tours;

-- যাদের মান সত্যিই বদলাবে, শুধু তারা
UPDATE upd_tours SET is_active = true
WHERE tour_id IN (7, 8) AND is_active IS DISTINCT FROM true;

-- একই কাজ আবার, শর্ত ছাড়া
UPDATE upd_tours SET is_active = true
WHERE tour_id IN (7, 8);

SELECT tour_id, is_active
FROM upd_tours
WHERE tour_id IN (7, 8)
ORDER BY tour_id;`}
              caption="প্রথমটা UPDATE 1: শুধু ট্যুর 8 এর মান সত্যিই বদলানোর ছিল। দ্বিতীয়টা UPDATE 2, যদিও দুটো Row ই আগে থেকে true আর কিছুই বদলায়নি। PostgreSQL দুটো Row এর জন্যই নতুন Version লিখেছে (সেকশন ১২ তে চোখে দেখবেন)। IS DISTINCT FROM শর্তটা অকারণ লেখা এড়ায়, আর NULL কেও ঠিকমতো সামলায়, যেখানে <> সামলাত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                App এর কোডেও এই গোনাটাই সবচেয়ে কাজের খবর। Node.js এর <code className={CODE}>pg</code> Package এ UPDATE এর ফলাফলের{" "}
                <code className={CODE}>rowCount</code> এ ঠিক এই সংখ্যাটা আসে (node-postgres এর Documentation অনুযায়ী)। একটা Booking
                বাতিলের API ভাবুন: শর্ত দেওয়া হলো Booking টা এখনো pending কিনা। rowCount শূন্য মানে হয় Booking টাই নেই, নয়তো সেটা
                আর pending নেই। দুই ক্ষেত্রেই ব্যবহারকারীকে সেটা জানানো দরকার, চুপচাপ সফল বলা না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "cancel-booking.js",
          code: `import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // ঠিকানা ছাড়া চালু হওয়ার চেয়ে এখনই থেমে যাওয়া ভালো
  throw new Error('DATABASE_URL is not set');
}
const pool = new Pool({ connectionString });

export async function cancelBooking(bookingId) {
  const result = await pool.query(
    \`UPDATE bookings
        SET status = 'cancelled'
      WHERE booking_id = $1
        AND status = 'pending'\`,
    [bookingId]
  );

  if (result.rowCount === 0) {
    // Booking নেই, অথবা আগেই confirmed বা cancelled
    return { ok: false, reason: 'not-pending' };
  }
  return { ok: true };
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আরেক ধাপ নিরাপত্তা: Transaction এর ভেতরে",
          content: (
            <ContentParagraph>
              psql বা কোনো GUI তে হাতে UPDATE চালানোর আগে আরেকটা অভ্যাস: <code className={CODE}>BEGIN;</code> লিখে শুরু, তারপর
              UPDATE, তারপর একটা SELECT দিয়ে ফল দেখা, তারপর সব ঠিক থাকলে <code className={CODE}>COMMIT;</code>, নইলে{" "}
              <code className={CODE}>ROLLBACK;</code>। Practical Lab এর দ্বিতীয় ড্রিলে নিজের psql এ এটা করবেন। এই অভ্যাস আর
              psql এর <code className={CODE}>\set AUTOCOMMIT off</code> এর মতো আরও পাহারা এই Module এর শেষ লেসন{" "}
              <Link href="/sql/topic/update-without-where" className={LINK}>
                UPDATE Without WHERE
              </Link>{" "}
              এ পুরোটা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              task={
                <>
                  ফারুক সাহেবের নিয়ম: তিন সপ্তাহের বেশি পুরনো Pending Booking বাতিল। আজ 1 November 2026, তাই{" "}
                  <code className={CODE}>2026-10-11</code> এর আগে (ঢাকার সময়ে) করা প্রতিটা pending Booking এর status হবে{" "}
                  <code className={CODE}>cancelled</code>। Starter এর কপি <code className={CODE}>upd_ex3_bookings</code> এ কাজটা
                  করুন। চাইলে আগে একটা SELECT দিয়ে দেখে নিন কয়টা Row ধরছে। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex3_bookings;
CREATE TABLE upd_ex3_bookings AS
SELECT booking_id, customer_id, departure_id, seats, status, booked_at
FROM bookings;

-- এখানে আপনার UPDATE লিখুন

SELECT status, count(*) AS bookings, sum(seats) AS seats
FROM upd_ex3_bookings
GROUP BY status
ORDER BY status;`}
              hint={
                <>
                  WHERE এ দুটো শর্ত: status = &apos;pending&apos; আর booked_at {"<"} &apos;2026-10-11&apos;। এই পাতার সময় অঞ্চল
                  Asia/Dhaka, তাই তারিখটা ঢাকার মাঝরাত হিসেবে পড়া হবে। Preview SELECT তিনটা Row দেখাবে: Booking 14, 17 আর 20।
                  status এর শর্ত বাদ দিলে confirmed Booking ও বাতিল হয়ে যাবে।
                </>
              }
              solution={`SELECT CASE WHEN status = 'pending' AND booked_at < '2026-10-11'
            THEN 'cancelled'
            ELSE status
       END AS status,
       count(*) AS bookings,
       sum(seats) AS seats
FROM bookings
GROUP BY 1
ORDER BY 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "update-from",
      subHeader: { index: "007", title: "UPDATE ... FROM" },
      title: <SectionTitle>আরেক Table দেখে বদলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক সময় কোন Row বদলাবে বা কী মান বসবে, সেটা লেখা থাকে অন্য Table এ। ফারুক সাহেব যদি বলেন Chattogram বিভাগের সব
                ট্যুরের দাম দশ শতাংশ বেশি, তাহলে সমস্যা: tours এ region নেই, আছে destination_id। region থাকে destinations এ।
                SELECT হলে Join করতেন (Module 06 এর{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  Inner Join
                </Link>
                )। UPDATE এ PostgreSQL এর উত্তর হলো FROM: বদলানোর Table এর পাশে আরেকটা Table, আর WHERE এ দুইয়ের জোড়ার শর্ত।
              </ContentParagraph>
              <ContentParagraph>
                মনে রাখার মতো করে বললে, UPDATE ... FROM হলো একটা Join যার ফল দিয়ে বদলানো হয়। বদলানোর Table এর প্রতিটা Row তার
                জোড়া খোঁজে FROM এর Table এ, WHERE এর শর্তে। জোড়া পেলে বদলায়, আর SET এর ডানদিকে জোড়ার Column ও পড়া যায়। জোড়া না
                পেলে Row টা ছোঁয়াই হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Chattogram এর ট্যুর, destinations দেখে"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, destination_id, price_bdt FROM tours;

UPDATE upd_tours t
SET price_bdt = round(t.price_bdt * 1.10, 2)
FROM destinations d
WHERE d.destination_id = t.destination_id
  AND d.region = 'Chattogram';

SELECT t.tour_id, t.title, d.region, t.price_bdt
FROM upd_tours t
JOIN destinations d ON d.destination_id = t.destination_id
ORDER BY t.tour_id;`}
              caption="UPDATE 6। Chattogram এর ছয়টা ট্যুর বেড়েছে: 1 হলো 13750.00, 2 হলো 9350.00, 4 হলো 10450.00, 5 হলো 15400.00, 8 হলো 35200.00, 9 হলো 17050.00। Khulna র Sundarbans আর Sylhet এর দুটো ট্যুর আগের দামে, কারণ ওদের destinations এর জোড়া region শর্তে আটকে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শুধু শর্তের জন্য অন্য Table লাগলে একটা Subquery ও চলে, Module 07 এর{" "}
              <Link href="/sql/topic/in-exists-any-all" className={LINK}>
                IN, EXISTS
              </Link>{" "}
              লেসনের মতো: <code className={CODE}>{"WHERE destination_id IN (SELECT destination_id FROM destinations WHERE region = 'Chattogram')"}</code>।
              এটাও UPDATE 6 দেয়। কিন্তু নতুন মানটাই যদি অন্য Table থেকে আসে, তখন FROM ছাড়া উপায় নেই, কারণ শুধু FROM এর Table এর
              Column SET এর ডানদিকে পড়া যায়। FROM এ কয়েকটা Table Join করেও বসানো যায়, যেমন departures আর tours পেরিয়ে একটা
              Booking এর ট্যুরের দাম আনা। সেটা দেখবেন এই লেসনের Project Example এ, আসল Table এর মহড়ায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              FROM এর একটা খুব কাজের রূপ হলো VALUES তালিকা। App থেকে একসাথে অনেকগুলো Row এ আলাদা আলাদা মান বসাতে হলে প্রতিটার জন্য
              আলাদা UPDATE না পাঠিয়ে একটাই Statement: তালিকাটা একটা ছোট্ট সাময়িক Table এর মতো FROM এ বসে, আর id মিলিয়ে বদলায়।
              শুধু খেয়াল রাখবেন, তালিকার যে id কোনো Row এর সাথে মেলে না, সেটা চুপচাপ বাদ পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ আলাদা আলাদা দাম"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, destination_id, price_bdt FROM tours;

UPDATE upd_tours AS t
SET price_bdt = v.new_price
FROM (VALUES (1, 13000.00),
             (4, 9900.00),
             (42, 5000.00)) AS v(tour_id, new_price)
WHERE t.tour_id = v.tour_id
RETURNING t.tour_id, t.title, t.price_bdt;`}
              caption="দুটো Row ফেরত এসেছে: ট্যুর 1 এখন 13000.00, ট্যুর 4 এখন 9900.00। তালিকায় তিনটা ছিল, কিন্তু 42 নম্বর ট্যুর নেই, তাই সেটা কোনো Error ছাড়াই বাদ। RETURNING থাকায় এখানে UPDATE 2 এর বদলে বদলানো Row গুলোই দেখা যাচ্ছে, সেকশন ৯ এ বিস্তারিত। App এর কোডে তিনটা পাঠিয়ে দুটো ফেরত পেলে বুঝবেন একটা id ভুল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpdateFromMatchDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার FROM এর দুটো ফাঁদ, দুটোই কোনো Error দেয় না। প্রথমটা জোড়ার শর্ত ভুলে যাওয়া। WHERE এ শুধু{" "}
                <code className={CODE}>{"d.region = 'Chattogram'"}</code> লিখে <code className={CODE}>d.destination_id = t.destination_id</code>{" "}
                বাদ দিলে প্রতিটা ট্যুর Chattogram এর চারটা destination এর সাথেই জোড়া পায়, মানে প্রতিটা ট্যুরই বদলায়। Module 06 এর{" "}
                <Link href="/sql/topic/cross-join" className={LINK}>
                  Cross Join
                </Link>{" "}
                লেসনের দুর্ঘটনাটাই, এবার Data বদলে দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ ১: জোড়ার শর্ত নেই"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, destination_id, price_bdt FROM tours;

UPDATE upd_tours t
SET price_bdt = round(t.price_bdt * 1.10, 2)
FROM destinations d
WHERE d.region = 'Chattogram';   -- t আর d এর জোড়া কোথায়?

SELECT count(*) FILTER (WHERE u.price_bdt <> s.price_bdt) AS changed_tours
FROM upd_tours u
JOIN tours s ON s.tour_id = u.tour_id;`}
              caption="UPDATE 9, changed_tours 9। Sundarbans আর Sylhet এর ট্যুর ও বেড়ে গেছে, কারণ শর্তটা শুধু destinations কে ছেঁকেছে, কোন ট্যুরের সাথে কোন destination সেটা বলেনি। চোখে পড়ার মতো একমাত্র সংকেত হলো গোনা: Preview বলেছিল 6, এখানে 9।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় ফাঁদটা আরও লুকানো: একটা Row এর একাধিক জোড়া। ধরুন upd_customers এ প্রতিটা Customer এর সবশেষ Booking এর টাকা
                রাখতে চান, আর FROM এ সরাসরি bookings দিলেন। Rahim Uddin এর Booking তিনটা, তাই তাঁর Row এর জোড়া তিনটা। PostgreSQL
                এর Documentation এই ক্ষেত্রে স্পষ্ট: জোড়াগুলোর যেকোনো একটা দিয়ে Row বদলাবে, কিন্তু কোনটা, তা আগে থেকে সহজে বলা
                যায় না। কোনো Error নেই, কোনো Warning নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ ২: একাধিক জোড়া"
              query={`DROP TABLE IF EXISTS upd_customers;
CREATE TABLE upd_customers AS
SELECT customer_id, full_name FROM customers;
ALTER TABLE upd_customers ADD COLUMN last_total numeric(10, 2);

UPDATE upd_customers c
SET last_total = b.total_bdt
FROM bookings b
WHERE b.customer_id = c.customer_id;

SELECT (SELECT count(*)
        FROM upd_customers c
        JOIN bookings b ON b.customer_id = c.customer_id) AS join_pairs,
       (SELECT count(*)
        FROM upd_customers
        WHERE last_total IS NOT NULL) AS customers_updated;`}
              caption="UPDATE 14। join_pairs 24, customers_updated 14: চব্বিশটা জোড়া থেকে চোদ্দ জন Customer এর প্রত্যেকে একটা করে মান পেয়েছেন। Rahim Uddin এর last_total তাঁর তিনটা Booking (25000.00, 19000.00, 36000.00) এর একটা, কিন্তু কোনটা, সেটা আপনার স্ক্রিনে যা দেখাক, নিশ্চিত না। অন্য Server এ, অন্য দিনে, Table এর ভেতরের ক্রম বদলালে আলাদা হতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান হলো FROM এর দিকটা আগে এমনভাবে বানানো যাতে প্রতি Customer এ ঠিক একটা Row থাকে। এখানে চাই প্রত্যেকের সবশেষ Booking, তাই
              Module 03 এর{" "}
              <Link href="/sql/topic/distinct" className={LINK}>
                DISTINCT
              </Link>{" "}
              লেসনের DISTINCT ON, একটা Derived Table এর ভেতরে (Module 07 এর{" "}
              <Link href="/sql/topic/derived-tables" className={LINK}>
                Derived Tables
              </Link>
              )। মোট বা গড় চাইলে GROUP BY দিয়ে একই কাজ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সমাধান: আগে প্রতি Customer এ একটা Row"
              query={`DROP TABLE IF EXISTS upd_customers;
CREATE TABLE upd_customers AS
SELECT customer_id, full_name FROM customers;
ALTER TABLE upd_customers ADD COLUMN last_total numeric(10, 2);

UPDATE upd_customers c
SET last_total = x.total_bdt
FROM (SELECT DISTINCT ON (customer_id) customer_id, total_bdt
      FROM bookings
      ORDER BY customer_id, booked_at DESC) AS x
WHERE x.customer_id = c.customer_id;

SELECT customer_id, full_name, last_total
FROM upd_customers
WHERE customer_id IN (1, 2, 13, 15)
ORDER BY customer_id;`}
              caption="UPDATE 14, এবার প্রতিটা মান নিশ্চিত। Rahim Uddin 36000.00 (তাঁর 8 October এর Booking 17), Nusrat Jahan 25000.00, Shuvo Das 15600.00। Imran Kabir এর কোনো Booking নেই, তাই তাঁর Row এর জোড়াই নেই, last_total NULL। প্রতিবার চালালে একই ফল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpdateFromLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বদলানোর Table টা FROM এ আবার লিখবেন না",
          content: (
            <ContentParagraph>
              <code className={CODE}>UPDATE upd_tours SET ... FROM upd_tours x JOIN destinations d ...</code> লিখলে FROM এর upd_tours
              টা বদলানোর upd_tours না, একই Table এর আরেকটা আলাদা কপি। দুইয়ের মাঝে জোড়ার শর্ত না দিলে আবার সব Row বদলায়: এভাবে
              চালিয়ে দেখা হয়েছে, UPDATE 9। Documentation এর পরামর্শ: Self Join না চাইলে বদলানোর Table কখনো FROM এ আবার লিখবেন না।
              বদলানোর Table এর Column এমনিতেই WHERE আর SET এ পড়া যায়।
            </ContentParagraph>
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
                  Starter এ tours এর কপি <code className={CODE}>upd_ex4_tours</code>। Chattogram বিভাগের (destinations এর region)
                  প্রতিটা ট্যুরের দাম দশ শতাংশ বাড়ান, দুই দশমিক ঘরে গোল করে। destinations Table টা শুধু পড়বেন, বদলাবেন না। যাচাইয়ের
                  Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex4_tours;
CREATE TABLE upd_ex4_tours AS
SELECT tour_id, title, destination_id, price_bdt FROM tours;

-- এখানে আপনার UPDATE লিখুন

SELECT tour_id, price_bdt
FROM upd_ex4_tours
ORDER BY tour_id;`}
              hint={
                <>
                  UPDATE upd_ex4_tours t SET ... FROM destinations d WHERE এ দুটো শর্ত: জোড়ার শর্ত d.destination_id =
                  t.destination_id, আর d.region = &apos;Chattogram&apos;। ঠিক হলে UPDATE 6। UPDATE 9 দেখলে জোড়ার শর্তটা বাদ
                  পড়েছে। IN আর Subquery দিয়ে লিখলেও উত্তর একই।
                </>
              }
              solution={`SELECT t.tour_id,
       CASE WHEN d.region = 'Chattogram' THEN round(t.price_bdt * 1.10, 2)
            ELSE t.price_bdt
       END AS price_bdt
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id
ORDER BY t.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "correlated-update",
      subHeader: { index: "008", title: "Correlated Subquery in SET" },
      title: <SectionTitle>প্রতিটা Row এর জন্য নিজের হিসাব: Correlated UPDATE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের তৃতীয় কাজ: Priya Sharma তাঁর Booking 20 বাতিল করেছেন, দুই আসনের। Departure 14 এর seats_left এ সেই
                দুটো আসন ফেরত যাওয়া দরকার। একটা উপায় হলো সরাসরি দুই যোগ করা। আরেকটা উপায় আরও ভরসার: পুরো সংখ্যাটা আবার হিসাব করা,
                ট্যুরের মোট আসন থেকে বাতিল না হওয়া Booking এর আসন বাদ দিয়ে। এতে আগে কোথাও ভুল থেকে থাকলে সেটাও ঠিক হয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এই হিসাব প্রতিটা Departure এর জন্য আলাদা, কারণ প্রতিটার Booking আলাদা। Module 07 এর{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  Correlated Subqueries
                </Link>{" "}
                লেসনে যেমন দেখেছিলেন, ভেতরের Query বাইরের Row কে পড়তে পারে। সেখানে কথা দেওয়া হয়েছিল, এখানে সেটা SET এর ডানদিকে
                বসছে: PostgreSQL প্রতিটা বদলানোর Row এর জন্য Subquery টা একবার চালায়, সেই Row এর departure_id দিয়ে। এর নাম
                Correlated UPDATE।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking বাতিল, তারপর আসন আবার গোনা"
              query={`DROP TABLE IF EXISTS upd_bookings;
CREATE TABLE upd_bookings AS SELECT * FROM bookings;
DROP TABLE IF EXISTS upd_departures;
CREATE TABLE upd_departures AS SELECT * FROM departures;

-- Priya Sharma র Booking 20 বাতিল
UPDATE upd_bookings SET status = 'cancelled' WHERE booking_id = 20;

-- Departure 14 এর আসন আবার গোনা
UPDATE upd_departures d
SET seats_left = (SELECT t.max_seats FROM tours t WHERE t.tour_id = d.tour_id)
               - (SELECT COALESCE(sum(b.seats), 0)
                  FROM upd_bookings b
                  WHERE b.departure_id = d.departure_id
                    AND b.status <> 'cancelled')
WHERE d.departure_id = 14;

SELECT departure_id, tour_id, starts_on, seats_left
FROM upd_departures
WHERE departure_id = 14;`}
              caption="দুটো UPDATE 1। Departure 14 (Sylhet Tea Garden Tour, 14 November) এর seats_left 21 থেকে 23: ট্যুরের ২৫ আসন থেকে এখন শুধু Booking 24 এর ২ আসন বাদ। প্রথম Subquery আনে ট্যুরের max_seats, দ্বিতীয়টা ওই Departure এর বাতিল না হওয়া আসনের যোগফল, দুটোই এই Row এর নিজের id দিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে দুটো ফাঁদ আছে, দুটোই Module 07 এ দেখা, কিন্তু UPDATE এ এদের দাম অনেক বেশি। প্রথমটা NULL। যে Departure এর
                কোনো বাতিল না হওয়া Booking নেই, তার জন্য <code className={CODE}>sum()</code> কোনো Row পায় না আর দেয় NULL, শূন্য
                না (Module 05 এর{" "}
                <Link href="/sql/topic/aggregate-functions" className={LINK}>
                  Aggregate Functions
                </Link>
                )। তারপর max_seats বিয়োগ NULL মানে NULL। উপরের Box এ <code className={CODE}>COALESCE(..., 0)</code> ঠিক এই কারণেই।
                সেটা বাদ দিলে কী হয়, দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ: COALESCE ভুলে গেলে"
              query={`DROP TABLE IF EXISTS upd_departures;
CREATE TABLE upd_departures AS SELECT * FROM departures;

UPDATE upd_departures d
SET seats_left = (SELECT t.max_seats FROM tours t WHERE t.tour_id = d.tour_id)
               - (SELECT sum(b.seats)
                  FROM bookings b
                  WHERE b.departure_id = d.departure_id
                    AND b.status <> 'cancelled');

SELECT departure_id, tour_id, seats_left
FROM upd_departures
WHERE seats_left IS NULL
ORDER BY departure_id;`}
              caption="UPDATE 16, আর দুটো Departure এর seats_left এখন NULL: 12 (Sajek এর, যার একমাত্র Booking বাতিল) আর 16 (বন্ধ Luxury Stay এর, যার কোনো Booking ই নেই)। Departure 12 এর ১৮টা আর 16 এর ১০টা খালি আসন খাতা থেকে উধাও। আসল departures এ seats_left NOT NULL, সেখানে পুরো UPDATE টাই বাতিল হতো, কপিতে নিয়ম নেই বলে চুপচাপ ঢুকে গেল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় ফাঁদ: SET এর ডানদিকের Subquery একটার বেশি Row দিলে। একটা Column এ একটাই মান বসতে পারে, তাই PostgreSQL থেমে
              যায়, Module 07 এর{" "}
              <Link href="/sql/topic/scalar-subqueries" className={LINK}>
                Scalar Subqueries
              </Link>{" "}
              লেসনের সেই Error 21000। আর থামা মানে পুরো Statement বাতিল: আগের যে Row গুলোর হিসাব হয়ে গিয়েছিল, সেগুলোও বদলায় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ: Subquery থেকে অনেক Row"
              query={`DROP TABLE IF EXISTS upd_departures;
CREATE TABLE upd_departures AS SELECT * FROM departures;

-- প্রতিটা Booking এর seats আলাদা Row, যোগ করা হয়নি
UPDATE upd_departures d
SET seats_left = (SELECT b.seats
                  FROM bookings b
                  WHERE b.departure_id = d.departure_id);`}
              caption="ERROR: more than one row returned by a subquery used as an expression। Departure 1 এ দুটো Booking, তাই প্রথম Row তেই থামা। Table এর একটা Row ও বদলায়নি। সমাধান: sum() এর মতো একটা Aggregate, যেটা সবসময় একটা Row দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক Subquery থেকে কয়েকটা Column একসাথে বসাতে চাইলে সেই Row Constructor এর রূপ, ডানদিকে বন্ধনীতে একটা SELECT:{" "}
                <code className={CODE}>SET (a, b) = (SELECT x, y ...)</code>। Documentation এর নিয়ম: Subquery টা যতগুলো Column এর
                তালিকা, ততগুলো Column দেবে, আর বড়জোর একটা Row। কোনো Row না দিলে সব Column এ NULL। নিচে প্রতিটা ট্যুরের Confirmed
                Booking এর সংখ্যা আর বিক্রি হওয়া আসন, একটা Subquery তে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Subquery, দুটো Column"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title FROM tours;
ALTER TABLE upd_tours
  ADD COLUMN confirmed_bookings integer,
  ADD COLUMN seats_sold integer;

UPDATE upd_tours t
SET (confirmed_bookings, seats_sold) = (
  SELECT count(*), COALESCE(sum(b.seats), 0)
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE d.tour_id = t.tour_id
    AND b.status = 'confirmed'
);

SELECT tour_id, title, confirmed_bookings, seats_sold
FROM upd_tours
ORDER BY tour_id;`}
              caption="UPDATE 9, প্রতিটা ট্যুর একটা করে হিসাব পেয়েছে। Saint Martin Island Escape 5টা Booking, 10 আসন; Cox's Bazar Beach Weekend 3টা, 11 আসন। Luxury Stay আর Family Package এর কোনো Confirmed Booking নেই: count(*) দিয়েছে 0, আর COALESCE এর কারণে seats_sold ও 0, NULL না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই কাজ FROM দিয়েও হয়: আগে GROUP BY দিয়ে প্রতি ট্যুরে একটা Row বানিয়ে, তারপর জোড়া। দুইয়ের পার্থক্য বোঝা দরকার।
              Correlated রূপ প্রতিটা Row তে যায়, কোনো জোড়া না থাকলেও, তাই সেখানে 0 বসানোর দায়িত্ব COALESCE এর। FROM রূপ শুধু জোড়া
              পাওয়া Row বদলায়, বাকিরা আগের মানে থাকে, তাই 0 আসে Column এর Default থেকে। বড় Table এ FROM রূপ সাধারণত দ্রুত, কারণ
              পুরো হিসাব একবারে হয়, যদিও PostgreSQL এর Planner অনেক সময় নিজেই ভালো উপায় বেছে নেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই হিসাব, FROM আর GROUP BY দিয়ে"
              query={`DROP TABLE IF EXISTS upd_tours2;
CREATE TABLE upd_tours2 AS
SELECT tour_id, title FROM tours;
ALTER TABLE upd_tours2
  ADD COLUMN confirmed_bookings integer NOT NULL DEFAULT 0,
  ADD COLUMN seats_sold integer NOT NULL DEFAULT 0;

UPDATE upd_tours2 t
SET confirmed_bookings = x.n,
    seats_sold = x.seats
FROM (SELECT d.tour_id, count(*) AS n, sum(b.seats) AS seats
      FROM bookings b
      JOIN departures d ON d.departure_id = b.departure_id
      WHERE b.status = 'confirmed'
      GROUP BY d.tour_id) AS x
WHERE x.tour_id = t.tour_id;

SELECT tour_id, confirmed_bookings, seats_sold
FROM upd_tours2
ORDER BY tour_id;`}
              caption="UPDATE 7, আগের Box এর মতো 9 না: যে দুটো ট্যুরের Confirmed Booking নেই, Derived Table এ তাদের Row ই নেই, তাই তারা ছোঁয়া পায়নি আর Default 0 এ থেকে গেছে। সংখ্যাগুলো আগের Box এর সাথে হুবহু এক: 5 আর 10, 3 আর 11, শেষ দুটো 0 আর 0।"
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
                  Starter এ customers এর কপি <code className={CODE}>upd_ex5_customers</code>, সাথে নতুন Column{" "}
                  <code className={CODE}>total_spent</code> (NULL চলবে না, Default 0)। প্রতিটা Customer এর total_spent এ বসান তাঁর
                  confirmed Booking গুলোর total_bdt এর যোগফল। যাঁর কোনো confirmed Booking নেই, তাঁর 0। একটা Correlated Subquery
                  দিয়ে লিখুন। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex5_customers;
CREATE TABLE upd_ex5_customers AS
SELECT customer_id, full_name FROM customers;
ALTER TABLE upd_ex5_customers
  ADD COLUMN total_spent numeric(10, 2) NOT NULL DEFAULT 0;

-- এখানে আপনার UPDATE লিখুন

SELECT customer_id, total_spent
FROM upd_ex5_customers
ORDER BY customer_id;`}
              hint={
                <>
                  SET total_spent = (SELECT COALESCE(sum(b.total_bdt), 0) FROM bookings b WHERE b.customer_id = c.customer_id AND
                  b.status = &apos;confirmed&apos;), আর বাইরের Table এর Alias c। COALESCE বাদ দিলে Imran Kabir এর মতো
                  Customer এর জন্য NULL আসবে, আর total_spent এর NOT NULL পুরো UPDATE বাতিল করবে।
                </>
              }
              solution={`SELECT c.customer_id,
       COALESCE(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS total_spent
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "returning",
      subHeader: { index: "009", title: "RETURNING, OLD and NEW" },
      title: <SectionTitle>বদলের আগের আর পরের মান, একই Statement এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে INSERT এর সাথে RETURNING দেখেছেন: নতুন Row এর id সাথে সাথে ফেরত। UPDATE এও একই সুবিধা, আর সেটা আরও
                কাজের। App একটা Booking বদলে সাথে সাথে বদলানো Row টা ব্যবহারকারীকে দেখাতে চায়। RETURNING ছাড়া দুটো Round Trip
                লাগত: UPDATE, তারপর আবার SELECT। আর দুইয়ের মাঝে অন্য কেউ Row টা বদলে দিলে SELECT ভুল ছবি দেখাত। RETURNING একই
                Statement এর ভেতরে, ঠিক যে মান লেখা হলো, সেটাই দেয়।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 18 এ এর সাথে যোগ হয়েছে নতুন একটা সুবিধা, Release Notes এর ভাষায় RETURNING এ OLD আর NEW।{" "}
                <code className={CODE}>old.price_bdt</code> দেয় বদলের আগের মান, <code className={CODE}>new.price_bdt</code> পরের।
                শুধু <code className={CODE}>price_bdt</code> লিখলে আসে নতুন মান, আগের মতোই। এর আগে বদলের আগের মান জানতে আলাদা
                SELECT লাগত, অথবা Trigger।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কত ছিল, কত হলো, কত বাড়ল"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

UPDATE upd_tours
SET price_bdt = round(price_bdt * 1.10, -2)
WHERE tour_id IN (1, 4, 6)
RETURNING tour_id,
          old.price_bdt AS old_price,
          new.price_bdt AS new_price,
          new.price_bdt - old.price_bdt AS raised_by;`}
              caption="তিনটা Row: ট্যুর 1 এর 12500.00 থেকে 13800.00, বাড়ল 1300.00; ট্যুর 4 এর 9500.00 থেকে 10500.00 (10450 এর গোল), বাড়ল 1000.00; ট্যুর 6 এর 7800.00 থেকে 8600.00, বাড়ল 800.00। RETURNING এর Row গুলোর ক্রমের কোনো নিশ্চয়তা নেই, ক্রম দরকার হলে App এ সাজান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোনো Table এর নিজেরই যদি <code className={CODE}>old</code> বা <code className={CODE}>new</code> নামের Column থাকে, বা
              নামগুলো অন্য কোনো কারণে পছন্দ না হয়, Documentation এর রূপ{" "}
              <code className={CODE}>RETURNING WITH (OLD AS before, NEW AS after)</code>। নাম দিলে পুরনো নাম দুটো লুকিয়ে যায়, তখন
              শুধু নতুন নামই চলে। আর পুরো Row দুটো একসাথে চাইলে <code className={CODE}>RETURNING old.*, new.*</code>: তখন প্রতিটা Column এর নাম
              দুবার আসে, তাই App এর জন্য দরকারি Column গুলো আলাদা করে লিখে AS দিয়ে নাম দেওয়াই ভালো, যেমন উপরের Box এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="old আর new এর নিজের নাম"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

UPDATE upd_tours
SET title = title || ' (Winter)'
WHERE tour_id = 1
RETURNING WITH (OLD AS before, NEW AS after)
          before.title AS old_title,
          after.title  AS new_title;

-- নাম দেওয়ার পরে পুরনো old আর চলে না
UPDATE upd_tours SET title = title
WHERE tour_id = 1
RETURNING WITH (OLD AS before) old.title;`}
              caption="প্রথম Table: old_title Saint Martin Island Escape, new_title Saint Martin Island Escape (Winter)। দ্বিতীয় Statement এ ERROR: missing FROM-clause entry for table old, কারণ OLD এর নাম এখন before। Error টা Box এর শেষ Statement এ, ইচ্ছা করেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                RETURNING এর সবচেয়ে শক্তিশালী ব্যবহার Module 07 এর{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  CTE
                </Link>{" "}
                লেসনে নাম শুনে আসা Data-modifying CTE। WITH এর ভেতরে UPDATE, তার RETURNING থেকে বদলানো Row গুলো, আর মূল Statement
                সেগুলো আরেকটা Table এ লিখে রাখে। নিচে একটা ছোট্ট দামের খাতা: প্রতিটা দাম বদলের পুরনো আর নতুন মান, একই Statement এ।
                বদল আর খাতায় লেখা একসাথে হয় বা একসাথে বাতিল হয়, কখনো একটা হয়ে আরেকটা বাদ পড়ে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বদল আর খাতা, এক Statement এ"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;
DROP TABLE IF EXISTS upd_price_log;
CREATE TABLE upd_price_log (
  tour_id   integer,
  old_price numeric(10, 2),
  new_price numeric(10, 2)
);

WITH changed AS (
  UPDATE upd_tours
  SET price_bdt = price_bdt + 500
  WHERE tour_id IN (6, 7)
  RETURNING tour_id, old.price_bdt AS old_price, new.price_bdt AS new_price
)
INSERT INTO upd_price_log
SELECT * FROM changed;

SELECT * FROM upd_price_log ORDER BY tour_id;`}
              caption="INSERT 2: দুটো বদল খাতায় উঠেছে। ট্যুর 6 এর 7800.00 থেকে 8300.00, ট্যুর 7 এর 3500.00 থেকে 4000.00। এই একই কাজ Trigger দিয়ে স্বয়ংক্রিয় করা যায়, যাতে কেউ খাতায় লিখতে ভুলে না যান। সেই Audit Table এর গল্প Module 14 আর Module 16 এ।"
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
                  Starter এ tours এর কপি <code className={CODE}>upd_ex6_tours</code>। Sylhet এর destination (destination_id 6) এর
                  প্রতিটা ট্যুরের দাম 250 টাকা বাড়ান। UPDATE টা নিজেই RETURNING দিয়ে তিনটা Column ফেরত দেবে, এই ক্রমে: tour_id,
                  পুরনো দাম, নতুন দাম। এবার কোনো যাচাইয়ের Query নেই: আপনার UPDATE টাই শেষ Statement।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ex6_tours;
CREATE TABLE upd_ex6_tours AS
SELECT tour_id, title, destination_id, price_bdt FROM tours;

-- এখানে আপনার UPDATE লিখুন`}
              hint={
                <>
                  RETURNING tour_id, old.price_bdt, new.price_bdt। শুধু price_bdt দুবার লিখলে দুটোই নতুন মান দেবে, তখন মিলবে না। ঠিক
                  হলে দুটো Row: Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day।
                </>
              }
              solution={`SELECT tour_id, price_bdt AS old_price, price_bdt + 250 AS new_price
FROM tours
WHERE destination_id = 6;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "updated-at",
      subHeader: { index: "010", title: "The updated_at Column" },
      title: <SectionTitle>updated_at: শেষ কবে বদলেছিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবের প্রায় প্রতিটা Table এ দুটো Column থাকে: <code className={CODE}>created_at</code>, Row টা কবে জন্মাল, আর{" "}
                <code className={CODE}>updated_at</code>, শেষ কবে বদলাল। Customer অভিযোগ করলেন তাঁর Booking এর দাম হঠাৎ বদলে গেছে?
                updated_at বলে দেয় কখন। App এর Cache জানতে চায় কোন Row গুলো গতকালের পরে বদলেছে? updated_at দিয়ে WHERE।
              </ContentParagraph>
              <ContentParagraph>
                নতুনরা প্রথমে যেটা ভাবেন: <code className={CODE}>updated_at timestamptz DEFAULT now()</code> দিলেই তো হলো। কিন্তু
                Module 09 এর{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                লেসনের কথাটা মনে করুন: DEFAULT খাটে শুধু INSERT এ, যখন সেই Column এর মান দেওয়া হয়নি। UPDATE এ DEFAULT নিজে থেকে কিছুই
                করে না। updated_at কে নতুন সময় দিতে হলে প্রতিটা UPDATE এ নিজে লিখতে হবে, <code className={CODE}>updated_at = now()</code>{" "}
                বা <code className={CODE}>updated_at = DEFAULT</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFAULT, UPDATE এ নিজে থেকে কিছু করে না"
              query={`DROP TABLE IF EXISTS upd_notes;
CREATE TABLE upd_notes (
  note_id    integer PRIMARY KEY,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- পুরনো দুটো নোট, ১ অক্টোবরের
INSERT INTO upd_notes (note_id, body, created_at, updated_at) VALUES
  (1, 'Pickup from Sayedabad at 9 pm', '2026-10-01 09:00:00+06', '2026-10-01 09:00:00+06'),
  (2, 'Bring life jackets',           '2026-10-01 09:00:00+06', '2026-10-01 09:00:00+06');

-- ১) শুধু body বদলানো
UPDATE upd_notes SET body = 'Pickup from Sayedabad at 10 pm' WHERE note_id = 1;
SELECT note_id, body, updated_at FROM upd_notes ORDER BY note_id;

-- ২) নিজে হাতে updated_at
UPDATE upd_notes
SET body = 'Pickup from Sayedabad at 10:30 pm', updated_at = now()
WHERE note_id = 1;

-- ৩) DEFAULT শব্দটা দিয়ে, একই ফল
UPDATE upd_notes
SET body = 'Bring life jackets and water', updated_at = DEFAULT
WHERE note_id = 2;

SELECT note_id, body, updated_at > created_at AS touched
FROM upd_notes
ORDER BY note_id;`}
              caption="প্রথম SELECT এ body বদলেছে, কিন্তু দুটো নোটেরই updated_at এখনো 2026-10-01 09:00:00+06: Default চুপচাপ বসে ছিল। শেষ SELECT এ দুটো Row এরই touched t, মানে updated_at এখন created_at এর পরে। আসল সময়টা এখানে দেখানো হয়নি, কারণ সেটা আপনি যখন চালাবেন তখনকার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা UPDATE এ মনে করে updated_at লেখা মানুষের কাজ, আর মানুষ ভোলে। একজন Developer একটা নতুন API তে লিখতে ভুলে
                গেলেন, ব্যস, সেই পথে বদলানো Row গুলোর updated_at মিথ্যা বলবে। তাই বড় দলগুলো কাজটা Database কে দিয়ে দেয়, একটা
                Trigger দিয়ে: প্রতিটা UPDATE এর ঠিক আগে Database নিজেই নতুন Row এর updated_at এ এখনকার সময় বসায়। Trigger আর তার
                Function লেখার নিয়ম Module 14 এর{" "}
                <Link href="/sql/topic/triggers" className={LINK}>
                  Triggers
                </Link>{" "}
                লেসনে। এখানে শুধু চেহারাটা দেখুন আর চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক ঝলক: Trigger দিয়ে updated_at"
              query={`DROP TABLE IF EXISTS upd_notes;
CREATE TABLE upd_notes (
  note_id    integer PRIMARY KEY,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO upd_notes VALUES
  (1, 'Pickup from Sayedabad at 9 pm', '2026-10-01 09:00:00+06', '2026-10-01 09:00:00+06');

-- প্রতিটা UPDATE এর আগে নতুন Row এর updated_at এ এখনকার সময়
CREATE OR REPLACE FUNCTION upd_touch() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER upd_notes_touch
BEFORE UPDATE ON upd_notes
FOR EACH ROW EXECUTE FUNCTION upd_touch();

-- updated_at এর নামও নেওয়া হয়নি
UPDATE upd_notes SET body = 'Pickup from Sayedabad at 10 pm' WHERE note_id = 1;

SELECT note_id, body, updated_at > created_at AS touched FROM upd_notes;`}
              caption="UPDATE এ শুধু body বদলানো হয়েছে, তবু touched t: Trigger টা UPDATE এর আগে NEW নামের নতুন Row এ updated_at বসিয়েছে। এখন কোনো Developer ভুলে গেলেও কিছু যায় আসে না। Table টা মুছলে তার Trigger ও সাথে যায়, তাই Box টা যতবার খুশি চালানো যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "now() একটা Transaction এ একটাই সময়",
          content: (
            <ContentParagraph>
              Module 04 এর{" "}
              <Link href="/sql/topic/date-time-functions" className={LINK}>
                Date and Time Functions
              </Link>{" "}
              লেসনে দেখেছেন, <code className={CODE}>now()</code> দেয় Transaction শুরুর সময়, প্রতিবার ডাকলে নতুন সময় না। তাই এক
              UPDATE এ হাজার Row বদলালে সবার updated_at হুবহু একই হয়, আর এক Transaction এর তিনটা UPDATE এও একই। এটাই সাধারণত
              কাঙ্ক্ষিত: একসাথে হওয়া বদলগুলো একই সময়ের ছাপ পায়। MySQL এ এই কাজের জন্য Column এর পাশে{" "}
              <code className={CODE}>ON UPDATE CURRENT_TIMESTAMP</code> লেখা যায়, সেকশন ১৩ তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "when-update-fails",
      subHeader: { index: "011", title: "When an UPDATE Fails" },
      title: <SectionTitle>নিয়ম ভাঙলে: হয় সব Row, নয়তো একটাও না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 09 এ বানানো প্রতিটা নিয়ম INSERT এর মতো UPDATE কেও পাহারা দেয়। নতুন মান CHECK না মানলে, NOT NULL Column এ
                NULL গেলে, UNIQUE Column এ দুটো একই মান হলে, Foreign Key এর ওপারে Row না থাকলে, PostgreSQL থেমে যায়। আর থামার
                নিয়মটা গুরুত্বপূর্ণ: একটা Statement এর ভেতরে একটা Row ও নিয়ম ভাঙলে পুরো Statement বাতিল। ষোলোটা Row এর মধ্যে
                পাঁচটা বদলে ষষ্ঠটায় Error হলে প্রথম পাঁচটার বদলও ফেরত যায়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Table এ seats_left এর উপর CHECK আছে, শূন্যের নিচে যাবে না। কেউ ভুল করে সব Departure থেকে দশটা করে আসন কমাতে
                চাইলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ষষ্ঠ Row এ CHECK, পুরো UPDATE বাতিল"
              query={`DROP TABLE IF EXISTS upd_departures_c;
CREATE TABLE upd_departures_c (
  departure_id integer PRIMARY KEY,
  seats_left   smallint NOT NULL CHECK (seats_left >= 0)
);
INSERT INTO upd_departures_c
SELECT departure_id, seats_left FROM departures;

-- সব Departure থেকে দশটা করে আসন কমানো
UPDATE upd_departures_c SET seats_left = seats_left - 10;`}
              caption="ERROR: new row for relation upd_departures_c violates check constraint upd_departures_c_seats_left_check, DETAIL: Failing row contains (6, -1)। Departure 6 এ ৯টা আসন ছিল, দশ কমালে -1। এর আগের পাঁচটা Departure এর হিসাব হয়ে গিয়েছিল, কিন্তু সেগুলোর কী হলো? পরের Box চালান, এই Box এর পরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগের Box এর পরে: কিছুই বদলায়নি"
              query={`SELECT departure_id, seats_left
FROM upd_departures_c
WHERE departure_id IN (1, 6)
ORDER BY departure_id;`}
              caption="Departure 1 এ এখনো 14, Departure 6 এ এখনো 9। Departure 1 এর 14 থেকে 4 হওয়ার হিসাব হয়েছিল, কিন্তু Statement বাতিল হওয়ায় সেই নতুন Version কখনো সত্যি হয়নি। এই নিশ্চয়তার নাম Atomicity, Module 12 এর ACID এর A।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UNIQUE এর একটা ফাঁদ আছে যেটা প্রায় সবাই একবার খায়। ধরুন একটা Bus Route এর থামার জায়গাগুলোর ক্রম রাখা আছে,
                stop_no UNIQUE। সামনে নতুন একটা থামা বসাতে সবাইকে এক ঘর পেছাতে হবে: <code className={CODE}>stop_no = stop_no + 1</code>।
                শেষে কোনো দুটো মান একই থাকে না, তবু Error আসে। কারণ সাধারণ UNIQUE প্রতিটা Row লেখার সাথে সাথেই পরীক্ষা হয়, পুরো
                Statement শেষে না। 1 যখন 2 হলো, তখনো পুরনো 2 আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবাইকে এক ঘর পেছানো"
              query={`DROP TABLE IF EXISTS upd_stops;
CREATE TABLE upd_stops (
  stop_no integer UNIQUE,
  place   text NOT NULL
);
INSERT INTO upd_stops VALUES (1, 'Dhaka'), (2, 'Cumilla'), (3, 'Feni');

UPDATE upd_stops SET stop_no = stop_no + 1;`}
              caption="ERROR: duplicate key value violates unique constraint upd_stops_stop_no_key, DETAIL: Key (stop_no)=(2) already exists। Dhaka র 1 থেকে 2 হওয়ার মুহূর্তে Cumilla তখনো 2 তে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              মজার ব্যাপার হলো, একই Statement কখনো কখনো চলেও যায়। Row গুলো যদি Disk এ উল্টো ক্রমে থাকে, 3 আগে 4 হয়, তারপর 2 হয়
              3, তারপর 1 হয় 2, কোনো মুহূর্তে সংঘর্ষ হয় না। এই লেসনের জন্য একই তিনটা থামা উল্টো ক্রমে (3, 2, 1) ঢুকিয়ে একই UPDATE
              চালিয়ে দেখা হয়েছে: UPDATE 3, কোনো Error ছাড়া। আসল Table এ Row গুলো Disk এ কোন ক্রমে আছে তা আপনার হাতে নেই, তাই একই
              কোড একদিন চলে আরেকদিন চলে না। এটা ভাগ্যের উপর নির্ভর করা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিশ্চিত সমাধান হলো Constraint টাকে DEFERRABLE করা। Module 09 এর{" "}
              <Link href="/sql/topic/foreign-keys" className={LINK}>
                Foreign Keys
              </Link>{" "}
              লেসনে DEFERRABLE দেখেছেন Transaction এর শেষ পর্যন্ত পরীক্ষা পেছানোর জন্য। এর আরেকটা প্রভাব আছে: DEFERRABLE UNIQUE,
              এমনকি INITIALLY IMMEDIATE থাকলেও, প্রতিটা Row তে না, পুরো Statement শেষে পরীক্ষা হয়। তখন মাঝপথের সাময়িক সংঘর্ষে কিছু
              যায় আসে না, শুধু শেষের ফলটা UNIQUE হলেই হলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFERRABLE UNIQUE: পরীক্ষা Statement শেষে"
              query={`DROP TABLE IF EXISTS upd_stops;
CREATE TABLE upd_stops (
  stop_no integer UNIQUE DEFERRABLE,
  place   text NOT NULL
);
INSERT INTO upd_stops VALUES (1, 'Dhaka'), (2, 'Cumilla'), (3, 'Feni');

UPDATE upd_stops SET stop_no = stop_no + 1;
INSERT INTO upd_stops VALUES (1, 'Narayanganj');

SELECT * FROM upd_stops ORDER BY stop_no;`}
              caption="UPDATE 3 সফল, ক্রম যেমনই থাকুক। তারপর সামনে নতুন থামা: 1 Narayanganj, 2 Dhaka, 3 Cumilla, 4 Feni। শুধু মনে রাখবেন, DEFERRABLE UNIQUE এর উপর Upsert এর ON CONFLICT চলে না, PostgreSQL বলে ON CONFLICT does not support deferrable unique constraints। Upsert আসছে এই Module এর চতুর্থ লেসনে। তাই সব জায়গায় না, যেখানে এমন পেছানোর কাজ আছে শুধু সেখানে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Table এ UPDATE এর সময় সবচেয়ে বেশি দেখা Error গুলো, প্রতিটা এই লেসনের জন্য PostgreSQL 18 এ চালিয়ে পাওয়া। Module
              02 এর{" "}
              <Link href="/sql/topic/errors-and-help" className={LINK}>
                Errors and Help
              </Link>{" "}
              লেসনের SQLSTATE কোডগুলো আবার চিনে নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা করা হলো", "PostgreSQL যা বলে", "SQLSTATE"],
          rows: [
            [
              "NOT NULL Column এ NULL",
              "null value in column body of relation upd_notes violates not-null constraint",
              "23502",
            ],
            [
              "CHECK ভাঙে এমন নতুন মান",
              "new row for relation upd_departures_c violates check constraint upd_departures_c_seats_left_check",
              "23514",
            ],
            ["UNIQUE Column এ একই মান", "duplicate key value violates unique constraint upd_stops_stop_no_key", "23505"],
            [
              "Child এর Foreign Key এ এমন মান যা Parent এ নেই",
              "insert or update on table upd_fk_child violates foreign key constraint upd_fk_child_hotel_id_fkey, DETAIL: Key (hotel_id)=(9) is not present",
              "23503",
            ],
            [
              "Parent এর Key বদলানো, যেটা Child এখনো ব্যবহার করছে",
              "update or delete on table upd_fk_parent violates foreign key constraint ... DETAIL: Key (hotel_id)=(1) is still referenced",
              "23503",
            ],
            [
              "GENERATED ALWAYS Identity Column এ নিজের মান",
              "column id can only be updated to DEFAULT",
              "428C9",
            ],
            ["SET এর Subquery থেকে একাধিক Row", "more than one row returned by a subquery used as an expression", "21000"],
            ["একই Column দুবার SET এ", "multiple assignments to same column language", "42601"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Identity Column এ হাত দেওয়া"
              query={`DROP TABLE IF EXISTS upd_ids;
CREATE TABLE upd_ids (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);
INSERT INTO upd_ids (name) VALUES ('first'), ('second');

UPDATE upd_ids SET id = 10 WHERE id = 1;`}
              caption="ERROR: column id can only be updated to DEFAULT, DETAIL: Column id is an identity column defined as GENERATED ALWAYS। Module 09 এর Primary Keys লেসনে INSERT এ যে পাহারা দেখেছিলেন, UPDATE এও সেটা। Primary Key বদলানো এমনিতেই খারাপ অভ্যাস: অন্য Table গুলো এই id দিয়েই এই Row কে চেনে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "behind-the-scenes",
      subHeader: { index: "012", title: "Behind the Scenes" },
      title: <SectionTitle>ভেতরে কী হয়: নতুন Version, Lock, আর হারানো Booking</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ মনে হয়েছে UPDATE একটা Row এর ভেতরে গিয়ে পুরনো মান মুছে নতুন মান লিখে দেয়, পেন্সিল আর রাবারের মতো। PostgreSQL
                আসলে তা করে না। সে পুরনো Row টা যেমন আছে রেখে দেয়, আর নতুন মানসহ পুরো Row এর একটা নতুন কপি লেখে, যার নাম Row
                Version। পুরনোটা থাকে কারণ ঠিক সেই মুহূর্তে অন্য কোনো Transaction সেটা পড়ছে হতে পারে, আর UPDATE এর Transaction
                ROLLBACK হলে পুরনোটাই আবার একমাত্র সত্যি। এই পুরো ব্যবস্থার নাম MVCC, Module 12 এর{" "}
                <Link href="/sql/topic/mvcc" className={LINK}>
                  MVCC
                </Link>{" "}
                লেসনে বিস্তারিত।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Row Version এর একটা ঠিকানা আছে, নাম <code className={CODE}>ctid</code>: কোন Page এ, সেই Page এর কোন Slot এ।
                Module 09 এর Primary Keys লেসনে ctid এর নাম শুনেছেন, আর সেখানেই বলা হয়েছিল এটা দিয়ে Row চেনা যায় না, কারণ এটা
                বদলায়। কখন বদলায়, এবার নিজের চোখে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowVersionDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UPDATE এর পরে ctid বদলায়"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

SELECT ctid, tour_id, price_bdt
FROM upd_tours WHERE tour_id IN (1, 2) ORDER BY tour_id;

-- মান একই রেখে "বদল"
UPDATE upd_tours SET price_bdt = price_bdt WHERE tour_id = 1;
SELECT ctid, tour_id, price_bdt
FROM upd_tours WHERE tour_id IN (1, 2) ORDER BY tour_id;

-- এবার সত্যিকারের বদল
UPDATE upd_tours SET price_bdt = price_bdt + 1 WHERE tour_id = 1;
SELECT ctid, tour_id, price_bdt
FROM upd_tours WHERE tour_id IN (1, 2) ORDER BY tour_id;`}
              caption="শুরুতে ট্যুর 1 থাকে (0,1) এ, ট্যুর 2 (0,2) এ। মান একই রাখা UPDATE এর পরেও ট্যুর 1 সরে গেছে (0,10) এ: নয়টা Row এর পরের খালি Slot এ নতুন Version। সত্যিকারের বদলের পরে (0,11), দাম 12501.00। ট্যুর 2 কে কেউ ছোঁয়নি, সে (0,2) তেই। সেকশন ৬ এর কথাটা এখানে প্রমাণ হলো: মান না বদলালেও PostgreSQL লেখার কাজটা করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এর একটা সরাসরি ফল আছে। একটা বড় Table এর সব Row একবারে UPDATE করলে প্রতিটা Row এর নতুন কপি লেখা হয়, তাই Table এর
              File প্রায় দ্বিগুণ হয়ে যায়। পুরনো মরা Version গুলো পরিষ্কার করে VACUUM, কিন্তু সে জায়গা খালি করে পরের লেখার জন্য,
              File ছোট করে না। VACUUM আর তার স্বয়ংক্রিয় রূপ Autovacuum এর পুরো গল্প Module 18 এর{" "}
              <Link href="/sql/topic/vacuum" className={LINK}>
                VACUUM
              </Link>{" "}
              লেসনে। নিচের Box এ বিশ হাজার Row দিয়ে মাপুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব Row বদলালে Table মোটা হয়"
              query={`DROP TABLE IF EXISTS upd_big;
CREATE TABLE upd_big AS
SELECT g AS id, 'row ' || g AS note, 0 AS hits
FROM generate_series(1, 20000) AS g;

SELECT pg_size_pretty(pg_relation_size('upd_big')) AS size_at_start;

UPDATE upd_big SET hits = hits + 1;
SELECT pg_size_pretty(pg_relation_size('upd_big')) AS after_first_update;

VACUUM upd_big;
SELECT pg_size_pretty(pg_relation_size('upd_big')) AS after_vacuum;

UPDATE upd_big SET hits = hits + 1;
SELECT pg_size_pretty(pg_relation_size('upd_big')) AS after_second_update;`}
              caption="শুরুতে 1024 kB। একবার সব Row বদলানোর পরে 2024 kB, প্রায় দ্বিগুণ। VACUUM এর পরেও 2024 kB: মরা Version গুলো সরেছে, File ছোট হয়নি। কিন্তু দ্বিতীয়বার সব Row বদলানোর পরেও 2024 kB: নতুন Version গুলো VACUUM এর খালি করা জায়গায় বসেছে। বড় Table এ লাখ লাখ Row একবারে UPDATE করার আগে এই কথাটা মাথায় রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় যে কাজটা UPDATE চুপচাপ করে, সেটা Lock। একটা Row বদলানোর সময় PostgreSQL সেই Row টায় একটা Row Lock বসায়, যা
                থাকে Transaction শেষ হওয়া পর্যন্ত। আরেকটা Transaction একই Row বদলাতে এলে অপেক্ষা করে। পড়তে এলে অপেক্ষা করে না,
                পুরনো Version টা পড়ে নেয়, MVCC এর এটাই সুবিধা। Lock এর পুরো নিয়ম Module 12 এর{" "}
                <Link href="/sql/topic/row-locks" className={LINK}>
                  Row Locks
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                এই অপেক্ষা থেকেই এই লেসনের সবচেয়ে বাস্তব শিক্ষাটা আসে। দুজন কর্মী একই মুহূর্তে একই Departure এর আসন বেচছেন। App যদি
                আগে seats_left পড়ে, নিজের কোডে বিয়োগ করে, তারপর সংখ্যাটা লিখে দেয়, তাহলে দুজনের কেউ অপেক্ষা করেন না, কারণ পড়ার
                সময় কেউ কিছু বদলাচ্ছিলেন না। একজনের লেখা আরেকজনের লেখার নিচে চাপা পড়ে। এর নাম Lost Update। হিসাবটা যদি SQL এর
                ভেতরে থাকে, <code className={CODE}>SET seats_left = seats_left - 2</code>, তাহলে দ্বিতীয়জনের UPDATE Lock এর জন্য
                অপেক্ষা করে, আর প্রথমজনের COMMIT হওয়া নতুন মান থেকে বিয়োগ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LostUpdateSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConcurrentSeatsLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query Box এ একসাথে দুটো Session চালানো যায় না, সেটা Practical Lab এর শেষ ড্রিলে নিজের psql এ দুটো Window খুলে করবেন।
              কিন্তু ঠিক উপায়টার আরেকটা গুণ এখানেই দেখা যায়। WHERE এ <code className={CODE}>seats_left {">="} 2</code> যোগ করলে
              আসন না থাকলে UPDATE কিছুই বদলায় না, আর RETURNING খালি আসে। App এর জন্য সেটাই উত্তর: আসন শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ যাচাই আর বিক্রি"
              query={`DROP TABLE IF EXISTS upd_seat_counter;
CREATE TABLE upd_seat_counter (
  departure_id integer PRIMARY KEY,
  seats_left   integer NOT NULL CHECK (seats_left >= 0)
);
INSERT INTO upd_seat_counter VALUES (15, 12);

-- দুই আসন, তারপর তিন আসন, তারপর নয় আসন বেচার চেষ্টা
UPDATE upd_seat_counter SET seats_left = seats_left - 2
WHERE departure_id = 15 AND seats_left >= 2
RETURNING seats_left;

UPDATE upd_seat_counter SET seats_left = seats_left - 3
WHERE departure_id = 15 AND seats_left >= 3
RETURNING seats_left;

UPDATE upd_seat_counter SET seats_left = seats_left - 9
WHERE departure_id = 15 AND seats_left >= 9
RETURNING seats_left;`}
              caption="প্রথম RETURNING 10, দ্বিতীয় 7, তৃতীয়টা খালি: 0 rows। মাত্র সাতটা আসন বাকি, নয়টা চাওয়ায় WHERE মেলেনি, কিছুই বদলায়নি, কোনো Error ও আসেনি। App খালি ফলাফল দেখে বলবে আসন নেই। CHECK টা শেষ পাহারাদার, কিন্তু সাধারণ পথে তার কাছে পৌঁছানোই লাগে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কিছু ক্ষেত্রে হিসাবটা SQL এ পুরোপুরি বসানো যায় না, যেমন ব্যবহারকারী একটা Form এ অনেকক্ষণ ধরে Booking এর বিবরণ
              বদলাচ্ছেন। তখন একটা জনপ্রিয় কৌশল হলো একটা <code className={CODE}>version</code> Column: পড়ার সময় version মনে রাখা,
              লেখার সময় WHERE এ সেই version চাওয়া আর version এক বাড়ানো। মাঝে কেউ বদলে থাকলে version মেলে না, UPDATE 0। এর নাম
              Optimistic Locking, Module 12 এর{" "}
              <Link href="/sql/topic/optimistic-pessimistic" className={LINK}>
                Optimistic vs Pessimistic
              </Link>{" "}
              লেসনে পুরোটা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="version Column: দ্বিতীয়জন জেনে যান"
              query={`DROP TABLE IF EXISTS upd_seat_counter;
CREATE TABLE upd_seat_counter (
  departure_id integer PRIMARY KEY,
  seats_left   integer NOT NULL,
  version      integer NOT NULL
);
INSERT INTO upd_seat_counter VALUES (15, 12, 1);

-- দুজনেই আগে পড়েছিলেন: seats_left 12, version 1
UPDATE upd_seat_counter
SET seats_left = 10, version = version + 1
WHERE departure_id = 15 AND version = 1;

UPDATE upd_seat_counter
SET seats_left = 9, version = version + 1
WHERE departure_id = 15 AND version = 1;

SELECT * FROM upd_seat_counter;`}
              caption="প্রথমজনের UPDATE 1, দ্বিতীয়জনের UPDATE 0: version এখন 2, তাঁর শর্ত মেলেনি। Table এ 10 আর version 2। দ্বিতীয়জনের App UPDATE 0 দেখে তাঁকে বলবে নতুন করে পড়ে আবার চেষ্টা করতে। চাপা পড়ার বদলে জানিয়ে দেওয়া।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ UPDATE কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL Course টা দেখছেন, সেখানে UPDATE এর মূল চেহারা একই: UPDATE, SET, WHERE। পার্থক্যগুলো কিনারায়, কিন্তু
                সেগুলোতেই মানুষ আটকায়। নিচের প্রতিটা ফলাফল MySQL 8.4 এর একটা Container এ Island Tours এর MySQL ফাইল Load করে চালানো।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে বড় পাঁচটা পার্থক্য: অন্য Table দেখে বদলাতে MySQL এ FROM না, UPDATE এর পরেই JOIN, আর SET এ{" "}
                <code className={CODE}>t.price_bdt</code> এর মতো Alias সহ Column চলে। গোনা আসে দুই ভাগে, Rows matched আর Changed, আর
                Documentation অনুযায়ী বর্তমান মানই আবার বসালে MySQL সেটা লক্ষ করে, বদলায় না। এক Table এর UPDATE এ Assignment সাধারণত
                বাম থেকে ডানে চলে, তাই অদলবদল হয় না। এক Table এর UPDATE এ ORDER BY আর LIMIT চলে, JOIN থাকলে চলে না। আর RETURNING
                নেই, বদলানো মান দেখতে আলাদা SELECT।
              </ContentParagraph>
              <ContentParagraph>
                আরও তিনটা জিনিস চোখে রাখুন। যে Table বদলাচ্ছেন, WHERE এর Subquery তে সেখান থেকেই পড়লে Error 1093, Documentation এর
                সমাধান একটা Derived Table বানিয়ে JOIN। updated_at এর জন্য Trigger লাগে না, Column এর সংজ্ঞায়{" "}
                <code className={CODE}>ON UPDATE CURRENT_TIMESTAMP</code>, যেটা কোনো মান আসলে না বদলালে সময়ও বদলায় না। আর Strict Mode
                বন্ধ থাকলে Documentation অনুযায়ী NOT NULL Column এ NULL গেলে Error এর বদলে Type এর অন্তর্নিহিত Default বসে, DECIMAL এ
                0.00, শুধু একটা Warning সহ। MySQL 8.4 এ Strict Mode চালু থাকে, তাই তখন Error 1048।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-update-join.sql",
          code: `-- MySQL 8.4: Chattogram এর ট্যুর, JOIN দিয়ে
UPDATE upd_tours t
JOIN destinations d ON d.destination_id = t.destination_id
SET t.price_bdt = ROUND(t.price_bdt * 1.10, 2)
WHERE d.region = 'Chattogram';
-- Query OK, 6 rows affected (0.00 sec)
-- Rows matched: 6  Changed: 6  Warnings: 0

-- একই মান আবার বসানো: matched 2, changed 0
UPDATE upd_tours SET price_bdt = price_bdt WHERE tour_id IN (1, 2);
-- Query OK, 0 rows affected (0.01 sec)
-- Rows matched: 2  Changed: 0  Warnings: 0

-- দুটোর একটার মান সত্যিই বদলাল
UPDATE upd_tours SET price_bdt = 13750.00 WHERE tour_id IN (1, 2);
-- Query OK, 1 row affected (0.00 sec)
-- Rows matched: 2  Changed: 1  Warnings: 0

-- অদলবদল হয় না, বাম থেকে ডানে
UPDATE upd_swap SET a = b, b = a;
SELECT * FROM upd_swap;
-- +------+-------+-------+
-- | id   | a     | b     |
-- +------+-------+-------+
-- |    1 | right | right |
-- +------+-------+-------+`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-update-limits.sql",
          code: `-- এক Table: ORDER BY আর LIMIT চলে
UPDATE upd_tours SET price_bdt = price_bdt - 1000
ORDER BY price_bdt DESC LIMIT 1;
-- Query OK, 1 row affected (0.00 sec)
-- Rows matched: 1  Changed: 1  Warnings: 0

-- JOIN সহ: চলে না
UPDATE upd_tours t JOIN destinations d ON d.destination_id = t.destination_id
SET t.price_bdt = 1 ORDER BY t.price_bdt LIMIT 1;
-- ERROR 1221 (HY000): Incorrect usage of UPDATE and ORDER BY

-- RETURNING নেই
UPDATE upd_tours SET price_bdt = price_bdt + 1 WHERE tour_id = 1 RETURNING tour_id, price_bdt;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'RETURNING tour_id, price_bdt'

-- নিজের Table থেকে Subquery
UPDATE upd_tours SET price_bdt = 0
WHERE price_bdt = (SELECT MAX(price_bdt) FROM upd_tours);
-- ERROR 1093 (HY000): You can't specify target table 'upd_tours' for update in FROM clause

-- Documentation এর সমাধান: Derived Table বানিয়ে JOIN
UPDATE upd_tours u
JOIN (SELECT MAX(price_bdt) AS top FROM upd_tours) AS m ON u.price_bdt = m.top
SET u.price_bdt = u.price_bdt - 500;
-- Query OK, 1 row affected (0.00 sec)

-- UNIQUE এ সবাইকে এক ঘর পেছানো: ক্রম উল্টে দিলে চলে
UPDATE upd_stops SET stop_no = stop_no + 1;
-- ERROR 1062 (23000): Duplicate entry '2' for key 'upd_stops.stop_no'
UPDATE upd_stops SET stop_no = stop_no + 1 ORDER BY stop_no DESC;
-- Query OK, 3 rows affected (0.00 sec)`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-on-update.sql",
          code: `CREATE TABLE upd_notes (
  note_id    INT PRIMARY KEY,
  body       VARCHAR(100) NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO upd_notes VALUES (1, 'Pickup at 9 pm', '2026-10-01 09:00:00');

-- একই মান: কিছু বদলায়নি, সময়ও না
UPDATE upd_notes SET body = 'Pickup at 9 pm' WHERE note_id = 1;
-- Rows matched: 1  Changed: 0  Warnings: 0
SELECT updated_at FROM upd_notes;
-- 2026-10-01 09:00:00

-- সত্যিকারের বদল: সময় নিজে থেকে বসল
UPDATE upd_notes SET body = 'Pickup at 10 pm' WHERE note_id = 1;
SELECT updated_at > '2026-10-01 09:00:00' AS touched FROM upd_notes;
-- touched: 1

-- Strict Mode বন্ধ থাকলে NOT NULL এ NULL চুপচাপ 0.00
SET SESSION sql_mode = '';
UPDATE upd_tours2 SET price_bdt = NULL WHERE tour_id = 2;
-- Query OK, 1 row affected, 1 warning (0.00 sec)
-- Warning 1048: Column 'price_bdt' cannot be null
SELECT price_bdt FROM upd_tours2 WHERE tour_id = 2;
-- 0.00`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["অন্য Table দেখে বদলানো", "UPDATE t SET ... FROM অন্য WHERE জোড়া", "UPDATE t JOIN অন্য ON জোড়া SET ..."],
            ["SET এ Alias", "চলে না: SET target columns cannot be qualified", "চলে: SET t.price_bdt = ..."],
            ["SET a = b, b = a", "অদলবদল হয়, সব ডানদিক পুরনো Row থেকে", "হয় না, বাম থেকে ডানে"],
            ["গোনা", "UPDATE n: মিলে যাওয়া সব Row", "Rows matched আর Changed আলাদা"],
            ["RETURNING", "আছে, 18 থেকে old আর new সহ", "নেই"],
            ["ORDER BY, LIMIT", "নেই, Subquery দিয়ে", "এক Table এ আছে"],
            ["নিজের Table থেকে Subquery", "চলে", "Error 1093, Derived Table দিয়ে ঘুরিয়ে"],
            ["updated_at নিজে থেকে", "Trigger দিয়ে", "ON UPDATE CURRENT_TIMESTAMP"],
            ["NOT NULL এ NULL", "সবসময় Error 23502", "Strict Mode এ Error, বন্ধ থাকলে Default আর Warning"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এর অভ্যাস নিয়ে PostgreSQL এ এলে দুটো ভুল সবার আগে হয়। নিচের দুটো Box চালিয়ে Error গুলো চিনে রাখুন, তারপর
              PostgreSQL এর উপায়টা দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MySQL এর অভ্যাস ১: UPDATE এ ORDER BY আর LIMIT"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

-- সবচেয়ে দামি ট্যুরে ১০০০ টাকা ছাড়, MySQL এর মতো করে
UPDATE upd_tours SET price_bdt = price_bdt - 1000
ORDER BY price_bdt DESC LIMIT 1;`}
              caption="ERROR: syntax error at or near ORDER। PostgreSQL এর UPDATE এ ORDER BY বা LIMIT এর জায়গাই নেই। নিচের Box এ PostgreSQL এর উপায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL এর উপায়: Subquery তে বেছে নেওয়া"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

UPDATE upd_tours
SET price_bdt = price_bdt - 1000
WHERE tour_id = (SELECT tour_id
                 FROM upd_tours
                 ORDER BY price_bdt DESC, tour_id
                 LIMIT 1)
RETURNING tour_id, title, price_bdt;`}
              caption="ট্যুর 8, Saint Martin Luxury Stay, 32000 থেকে 31000.00। Subquery Primary Key দিয়ে ঠিক একটা ট্যুর বেছে দিয়েছে, আর ORDER BY তে tour_id রাখা হয়েছে যাতে দুটো ট্যুরের দাম সমান হলেও উত্তর নিশ্চিত থাকে। MySQL এর উল্টো, PostgreSQL এ নিজের Table থেকে এমন Subquery কোনো সমস্যা না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MySQL এর অভ্যাস ২: SET এ Alias"
              query={`DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

UPDATE upd_tours t
SET t.price_bdt = 1
WHERE t.tour_id = 1;`}
              caption="ERROR: column t of relation upd_tours does not exist, HINT: SET target columns cannot be qualified with the relation name। PostgreSQL এ SET এর বাম দিকে শুধু Column এর নাম: SET price_bdt = 1। ডানদিকে আর WHERE এ t.price_bdt লেখা চলে, শুধু বাম দিকে না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>রবিবারের তিন কাজ, আসল Table এ মহড়া</SectionTitle>,
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
                এবার ফারুক সাহেবের তিনটা কাজ একসাথে, আসল Table এ, একটা Transaction এর ভেতরে। আসল দিনে শেষ লাইন হতো COMMIT। এখানে
                এটা মহড়া, আর এই পাতার বাকি Box গুলো আসল Table এর উপর নির্ভর করে, তাই শেষ লাইন ROLLBACK। প্রতিটা UPDATE এর
                RETURNING বলে দেবে কী ছিল আর কী হলো, আলাদা SELECT ছাড়াই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বাতিল:</strong> Booking 20 এর status cancelled, শর্তে status pending, যাতে আগেই বাতিল বা confirmed হয়ে
                  থাকলে কিছু না বদলায়। তারপর তার Departure 14 এর seats_left আবার গোনা।
                </ListItem>
                <ListItem>
                  <strong>শীতের দাম:</strong> Saint Martin (destination 1) এর চালু ট্যুরের দাম দশ শতাংশ বেশি, একশোয় গোল। তারপর
                  সেই ট্যুরের Pending Booking গুলোর মোট টাকা নতুন দামে, Confirmed গুলো আগের দামে।
                </ListItem>
                <ListItem>
                  <strong>ফোন:</strong> Tanvir Ahmed এর phone, শর্তে phone IS NULL, যাতে কেউ আগে অন্য নম্বর বসিয়ে থাকলে সেটা চাপা
                  না পড়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো কাজের মহড়া, আসল Table এ"
              query={`BEGIN;

-- ১) Priya Sharma র Booking 20 বাতিল
UPDATE bookings
SET status = 'cancelled'
WHERE booking_id = 20 AND status = 'pending'
RETURNING booking_id, departure_id, seats,
          old.status AS was, new.status AS now;

-- ২) তার Departure এর আসন আবার গোনা
UPDATE departures d
SET seats_left = t.max_seats - (SELECT COALESCE(sum(b.seats), 0)
                                FROM bookings b
                                WHERE b.departure_id = d.departure_id
                                  AND b.status <> 'cancelled')
FROM tours t
WHERE t.tour_id = d.tour_id
  AND d.departure_id = 14
RETURNING d.departure_id, old.seats_left AS before, new.seats_left AS after;

-- ৩) শীতের দাম: Saint Martin এর চালু ট্যুর
UPDATE tours
SET price_bdt = round(price_bdt * 1.10, -2)
WHERE destination_id = 1 AND is_active
RETURNING tour_id, title, old.price_bdt AS before, new.price_bdt AS after;

-- ৪) সেই ট্যুরের Pending Booking নতুন দামে
UPDATE bookings b
SET total_bdt = b.seats * t.price_bdt
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.departure_id = b.departure_id
  AND b.status = 'pending'
  AND t.destination_id = 1
RETURNING b.booking_id, b.seats, old.total_bdt AS before, new.total_bdt AS after;

-- ৫) Tanvir Ahmed এর ফোন
UPDATE customers
SET phone = '+8801000000103'
WHERE customer_id = 3 AND phone IS NULL
RETURNING customer_id, full_name, old.phone AS before, new.phone AS after;

ROLLBACK;

-- প্রমাণ: আসল Table আগের মতোই
SELECT (SELECT status FROM bookings WHERE booking_id = 20)       AS booking_20,
       (SELECT seats_left FROM departures WHERE departure_id = 14) AS dep_14_seats,
       (SELECT price_bdt FROM tours WHERE tour_id = 1)             AS tour_1_price,
       (SELECT phone FROM customers WHERE customer_id = 3)         AS tanvir_phone;`}
              caption="পাঁচটা RETURNING: Booking 20 pending থেকে cancelled; Departure 14 এর seats_left 21 থেকে 23; ট্যুর 1 এর দাম 12500.00 থেকে 13800.00 (বন্ধ Luxury Stay বাদ, is_active এর কারণে); Booking 14 এর মোট 50000.00 থেকে 55200.00; Tanvir এর phone NULL থেকে +8801000000103। তারপর ROLLBACK, আর শেষ SELECT প্রমাণ করে আসল Table অটুট: pending, 21, 12500.00, NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন প্রতিটা WHERE এ একটা বাড়তি পাহারা আছে: <code className={CODE}>{"AND status = 'pending'"}</code>,{" "}
                <code className={CODE}>AND is_active</code>, <code className={CODE}>AND phone IS NULL</code>। এগুলো বলে দেয় Row টা
                ঠিক যে অবস্থায় আছে বলে আপনি ধরে নিয়েছেন, সত্যিই সেই অবস্থায় আছে কিনা। না থাকলে UPDATE 0, আর App বুঝতে পারে কিছু
                একটা আপনার জানার বাইরে বদলেছে। এই অভ্যাস চালু সিস্টেমে অনেক বিপদ ঠেকায়।
              </ContentParagraph>
              <ContentParagraph>
                এবার আপনার পালা, কপিতে। ফারুক সাহেবের Exercise 3 এর নিয়মে পুরনো Pending Booking বাতিল হবে, তারপর প্রতিটা
                Departure এর আসন আবার গোনা হবে। দুটো UPDATE, ক্রম গুরুত্বপূর্ণ।
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
                  Starter এ দুটো কপি: <code className={CODE}>upd_ch_bookings</code> আর <code className={CODE}>upd_ch_departures</code>।
                  দুটো কাজ করুন: (১) <code className={CODE}>2026-10-11</code> এর আগে করা প্রতিটা pending Booking এর status
                  cancelled; (২) প্রতিটা Departure এর seats_left নতুন করে হিসাব: তার ট্যুরের max_seats (আসল tours Table থেকে) বিয়োগ{" "}
                  <code className={CODE}>upd_ch_bookings</code> এ তার বাতিল না হওয়া Booking গুলোর seats এর যোগফল, কোনো Booking না
                  থাকলে পুরো max_seats। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS upd_ch_bookings;
CREATE TABLE upd_ch_bookings AS
SELECT booking_id, departure_id, seats, status, booked_at FROM bookings;
DROP TABLE IF EXISTS upd_ch_departures;
CREATE TABLE upd_ch_departures AS
SELECT departure_id, tour_id, seats_left FROM departures;

-- এখানে আপনার দুটো UPDATE লিখুন

SELECT departure_id, seats_left
FROM upd_ch_departures
ORDER BY departure_id;`}
              hint={
                <>
                  আগে বাতিল, তারপর গোনা: উল্টো ক্রমে চালালে গোনার সময় বাতিলগুলো এখনো pending, তাই কিছুই বদলাবে না। গোনার UPDATE এ
                  FROM tours t আর একটা Correlated Subquery, COALESCE সহ। ঠিক হলে তিনটা Departure বদলাবে: 8 হবে 18, 11 হবে 14, 14
                  হবে 23। COALESCE ভুলে গেলে 12 আর 16 এ NULL আসবে।
                </>
              }
              solution={`SELECT d.departure_id,
       t.max_seats - COALESCE(sum(b.seats) FILTER (
         WHERE b.status = 'confirmed'
            OR (b.status = 'pending' AND b.booked_at >= '2026-10-11')), 0) AS seats_left
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY d.departure_id, t.max_seats
ORDER BY d.departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা নিরাপদ UPDATE এর আট ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "বদলটা এক বাক্যে লিখুন",
              description:
                "কোন Table, কোন Row, কোন Column, আগে কী আর পরে কী। যেমন: চালু, তিন দিন বা বেশি দিনের ট্যুরের price_bdt দশ শতাংশ বেশি, একশোয় গোল।",
            },
            {
              title: "Row চেনার শর্তটা ঠিক করুন",
              description:
                "একটা Row হলে Primary Key। খালি মান হলে IS NULL। অন্য Table লাগলে FROM আর জোড়ার শর্ত, আর নিশ্চিত হোন প্রতি Row এ জোড়া একটাই।",
            },
            {
              title: "Preview SELECT চালান",
              description:
                "একই WHERE, পুরনো মান আর নতুন মানের হিসাব পাশাপাশি। কয়টা Row এল লিখে রাখুন। অপ্রত্যাশিত একটা Row ও দেখলে থামুন।",
            },
            {
              title: "হাতে চালালে Transaction খুলুন",
              description:
                "psql বা GUI তে BEGIN দিয়ে শুরু। App এর কোডে Transaction এর নিয়ম আলাদা, সেটা Module 17 এ।",
            },
            {
              title: "UPDATE চালান, WHERE হুবহু একই",
              description:
                "SELECT এর প্রথম অংশটা UPDATE ... SET এ বদলান, WHERE এর একটা অক্ষরও না ছুঁয়ে। দরকার হলে RETURNING old আর new।",
            },
            {
              title: "গোনা মেলান",
              description:
                "UPDATE n কি Preview এর সংখ্যার সমান? একটা যাচাইয়ের SELECT দিয়ে নতুন মানগুলো দেখুন। App এ rowCount দেখুন।",
            },
            {
              title: "COMMIT, নয়তো ROLLBACK",
              description:
                "সব মিললে COMMIT। একটুও সন্দেহ থাকলে ROLLBACK, শর্ত ঠিক করে আবার ধাপ ৩ থেকে।",
            },
            {
              title: "কোডে স্থায়ী অভ্যাস",
              description:
                "হিসাব SQL এর ভেতরে (seats_left - 2), অবস্থার পাহারা WHERE এ (status = pending), updated_at Trigger এ, আর rowCount শূন্য হলে ব্যবহারকারীকে জানানো।",
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
            ["WHERE phone = NULL", "UPDATE 0, কোনো Error নেই, কাজ হলো বলে মনে হয়", "WHERE phone IS NULL"],
            ["WHERE লিখতে ভুলে যাওয়া", "Table এর প্রতিটা Row বদলায়", "আগে Preview SELECT, আর এই Module এর UPDATE Without WHERE লেসন"],
            [
              "CASE এ ELSE নেই, WHERE ও চওড়া",
              "কোনো WHEN না মেলা Row এ NULL বসে, আসল মান মুছে যায়",
              "ELSE column লিখুন, অথবা WHERE দিয়ে শুধু দরকারি Row",
            ],
            ["UPDATE ... FROM এ জোড়ার শর্ত নেই", "সব Row বদলায়, Cross Join এর মতো", "WHERE এ d.id = t.id, আর গোনা মেলানো"],
            [
              "UPDATE ... FROM এ এক Row এর একাধিক জোড়া",
              "যেকোনো একটা জোড়ার মান বসে, কোনটা নিশ্চিত না, Error নেই",
              "FROM এ আগে GROUP BY বা DISTINCT ON দিয়ে প্রতি Row এ একটা",
            ],
            ["Correlated sum() এ COALESCE নেই", "Booking ছাড়া Row এ NULL", "COALESCE(sum(...), 0)"],
            ["SET এর Subquery থেকে অনেক Row", "Error 21000, পুরো Statement বাতিল", "sum(), max() এর মতো Aggregate, বা LIMIT 1 সাথে নিশ্চিত ORDER BY"],
            ["SET t.price_bdt = ... (MySQL এর অভ্যাস)", "Error: SET target columns cannot be qualified", "বাম দিকে শুধু Column এর নাম"],
            ["UPDATE ... ORDER BY ... LIMIT 1", "PostgreSQL এ Syntax Error", "WHERE id = (SELECT id ... ORDER BY ... LIMIT 1)"],
            [
              "App এ পড়ে, হিসাব করে, সংখ্যা লেখা",
              "একসাথে দুজন লিখলে একজনের বদল হারায়: Lost Update",
              "SET seats_left = seats_left - 2, সাথে WHERE seats_left >= 2",
            ],
            ["updated_at এর DEFAULT এর উপর ভরসা", "UPDATE এ পুরনো সময়ই থাকে", "SET updated_at = now(), অথবা Trigger"],
            ["UPDATE n না দেখা", "ভুল id বা বদলে যাওয়া অবস্থা চুপচাপ পার পায়", "গোনা মেলান, App এ rowCount শূন্য হলে জানান"],
            [
              "UNIQUE Column এ সবাইকে এক ঘর সরানো",
              "Row এর ক্রমের উপর নির্ভর করে কখনো 23505, কখনো সফল",
              "Constraint DEFERRABLE, অথবা দুই ধাপে সরানো",
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
                    href="https://www.postgresql.org/docs/current/sql-update.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UPDATE
                  </a>
                  : পুরো Synopsis, FROM এর একাধিক জোড়ার সতর্কবাণী, UPDATE n এর গোনার সংজ্ঞা, আর RETURNING এর old আর new।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/dml-update.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Updating Data
                  </a>
                  : একই বিষয়ের সহজ Tutorial, ছোট উদাহরণ সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/dml-returning.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Returning Data from Modified Rows
                  </a>
                  : INSERT, UPDATE, DELETE আর MERGE এ RETURNING, পাশাপাশি।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/18.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : RETURNING এ OLD আর NEW কোন Version এ এল, নিজের চোখে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/mvcc-intro.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Concurrency Control, Introduction
                  </a>
                  : কেন UPDATE নতুন Version লেখে, আর কেন পড়া আর লেখা একে অপরকে আটকায় না। Module 12 এর আগে একবার পড়ে রাখুন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/update.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Reference Manual: UPDATE Statement
                  </a>
                  : বাম থেকে ডানের নিয়ম, এক আর একাধিক Table এর পার্থক্য, Error 1093 আর তার সমাধান।
                </ListItem>
                <ListItem>
                  <a href="https://node-postgres.com/apis/result" className={LINK} target="_blank" rel="noopener noreferrer">
                    node-postgres: Result
                  </a>
                  : rowCount আর rows এর পার্থক্য, App এর কোডে UPDATE এর ফল পড়ার জন্য।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনার MySQL Course (YouTube)
                  </a>
                  : সেখানকার UPDATE অংশ দেখার সময় সেকশন ১৩ এর Table টা পাশে রাখুন।
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
                  UPDATE আছে এমন Row এর মান বদলায়, Row যোগ বা মোছে না। একবারে একটা Table, SET এ কমা দিয়ে অনেক Column, WHERE এ কোন
                  Row।
                </ListItem>
                <ListItem>
                  WHERE এর নিয়ম SELECT এর মতোই। কোনো Row না মিললে UPDATE 0, Error না। NULL ধরতে IS NULL। একটা Row বদলাতে Primary
                  Key।
                </ListItem>
                <ListItem>
                  SET এর ডানদিকের সব হিসাব পুরনো Row থেকে, তাই PostgreSQL এ SET a = b, b = a অদলবদল করে। MySQL এ বাম থেকে ডানে।
                </ListItem>
                <ListItem>
                  ডানদিকে যেকোনো Expression: round, CASE, Function, Subquery। CASE এ ELSE না থাকলে না মেলা Row এ NULL।
                </ListItem>
                <ListItem>
                  আগে একই WHERE এ Preview SELECT, তারপর UPDATE, তারপর গোনা মেলানো। PostgreSQL এর UPDATE n মানে মিলে যাওয়া সব Row,
                  মান বদলাক বা না বদলাক।
                </ListItem>
                <ListItem>
                  UPDATE ... FROM একটা Join দিয়ে বদলায়। জোড়ার শর্ত ভুললে সব Row, একাধিক জোড়া হলে অনিশ্চিত মান, দুটোই Error ছাড়া।
                  সমাধান: জোড়ার শর্ত আর আগে থেকে প্রতি Row এ একটা।
                </ListItem>
                <ListItem>
                  Correlated UPDATE প্রতিটা Row এর জন্য নিজের Subquery চালায়। COALESCE ভুললে NULL, একাধিক Row এলে Error 21000।
                </ListItem>
                <ListItem>
                  RETURNING বদলানো Row ফেরত দেয়, PostgreSQL 18 এ old আর new সহ। Data-modifying CTE তে বদল আর খাতা একসাথে।
                </ListItem>
                <ListItem>
                  DEFAULT শুধু INSERT এ খাটে। updated_at হয় প্রতিটা UPDATE এ হাতে, নয়তো Trigger এ। MySQL এ ON UPDATE
                  CURRENT_TIMESTAMP।
                </ListItem>
                <ListItem>
                  একটা Row নিয়ম ভাঙলে পুরো Statement বাতিল। সাধারণ UNIQUE প্রতিটা Row এ পরীক্ষা হয়, DEFERRABLE হলে Statement শেষে।
                </ListItem>
                <ListItem>
                  PostgreSQL প্রতিটা UPDATE এ নতুন Row Version লেখে, ctid বদলায়, Table মোটা হয়, VACUUM জায়গা ফেরায় কিন্তু File ছোট
                  করে না। একই Row এ দুটো UPDATE একটার পর একটা চলে, তাই হিসাব SQL এ রাখলে কেউ হারায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি Row বদলেছেন, কিন্তু একটা Row ও মোছেননি। Priya Sharma র Booking বাতিল হয়েছে status বদলে, Row টা থেকেই
                গেছে, আর সেটা ইচ্ছাকৃত। কখন সত্যিই Row মুছে ফেলবেন, কখন শুধু লুকিয়ে রাখবেন, আর কেন Payment এর Row কখনো মোছা হয় না,
                সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                  DELETE and Soft Delete
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
      ["UPDATE", "আছে এমন Row এর মান বদলায়, Row যোগ বা মোছে না", "Tanvir Ahmed এর phone, UPDATE 1"],
      ["WHERE", "কোন Row বদলাবে, কিছু না মিললে UPDATE 0", "Chittagong বানান আর phone = NULL, দুটোই 0"],
      ["অনেক Column", "কমা দিয়ে, অথবা (a, b) = (x, y)", "Nazmul Karim এর phone আর language"],
      ["পুরনো মানের নিয়ম", "SET এর ডানদিক সবসময় পুরনো Row পড়ে", "a আর b অদলবদল, দিনপ্রতি দাম অটুট"],
      ["Expression আর CASE", "round, CASE; ELSE ছাড়া না মেলা Row এ NULL", "ELSE ভুলে ছয়টা দাম NULL"],
      ["Preview SELECT", "একই WHERE, পুরনো আর নতুন মান পাশাপাশি", "বন্ধ Luxury Stay ধরা পড়ল, তারপর UPDATE 4"],
      ["UPDATE n", "মিলে যাওয়া সব Row, মান না বদলালেও", "is_active: UPDATE 1 বনাম UPDATE 2"],
      ["UPDATE ... FROM", "Join এর ফল দিয়ে বদলানো", "Chattogram এর ছয়টা ট্যুর, UPDATE 6"],
      ["একাধিক জোড়া", "যেকোনো একটা মান, নিশ্চিত না, Error নেই", "last_total: ২৪ জোড়া, UPDATE 14"],
      ["Correlated UPDATE", "প্রতিটা Row এর জন্য নিজের Subquery", "Departure 14 এর seats_left 21 থেকে 23"],
      ["RETURNING old, new", "PostgreSQL 18: আগের আর পরের মান একসাথে", "ট্যুর 1: 12500.00 থেকে 13800.00"],
      ["updated_at", "DEFAULT শুধু INSERT এ, UPDATE এ হাতে বা Trigger", "Trigger বসানোর পরে touched t"],
      ["Atomicity", "একটা Row ভাঙলে পুরো Statement বাতিল", "Departure 6 এ -1, বাকিরা অটুট"],
      ["Row Version", "UPDATE নতুন কপি লেখে, পুরনোটা পরে VACUUM", "ctid (0,1) থেকে (0,10); 1024 kB থেকে 2024 kB"],
      ["Lost Update", "হিসাব SQL এ রাখলে দ্বিতীয়জন অপেক্ষা করে", "12 থেকে 7, App এর হিসাবে ভুল 9"],
      ["MySQL", "JOIN, matched আর changed, RETURNING নেই", "SET a = b, b = a দেয় right, right"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "upd_customers এ পাঁচজনের phone NULL। UPDATE upd_customers SET phone = 'not given' WHERE phone = NULL; চালালে PostgreSQL কী বলবে?",
        options: [
          { key: "A", text: "UPDATE 5", isCorrect: false, explanation: "পাঁচটা খালি ফোন আছে ঠিকই, কিন্তু = NULL দিয়ে কোনোটাই ধরা পড়ে না।" },
          {
            key: "B",
            text: "UPDATE 0, কারণ = NULL এর ফল কখনো সত্য না, তাই কোনো Row মেলে না",
            isCorrect: true,
            explanation: "ঠিক। NULL এর সাথে তুলনার ফল Unknown, আর WHERE শুধু সত্যগুলো রাখে। Error ও আসে না, তাই ভুলটা চোখ এড়িয়ে যায়। ঠিক রূপ IS NULL।",
          },
          { key: "C", text: "Error: NULL এর সাথে = চলে না", isCorrect: false, explanation: "PostgreSQL এখানে কোনো Error দেয় না, চুপচাপ UPDATE 0।" },
          { key: "D", text: "UPDATE 15, সব Customer এর phone বদলায়", isCorrect: false, explanation: "WHERE আছে, আর সেটা কোনো Row এর জন্যই সত্য না, তাই একটাও বদলায় না।" },
        ],
      },
      {
        id: 2,
        text: "একটা Row এ a = 'left', b = 'right'। PostgreSQL এ UPDATE upd_swap SET a = b, b = a; চালানোর পরে Row টা কেমন?",
        options: [
          { key: "A", text: "a = right, b = right", isCorrect: false, explanation: "এটা MySQL 8.4 এর ফল, যেখানে Assignment বাম থেকে ডানে চলে।" },
          {
            key: "B",
            text: "a = right, b = left",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এ SET এর প্রতিটা ডানদিক পুরনো Row থেকে পড়া, তাই b = a লেখার সময় a তখনো left।",
          },
          { key: "C", text: "a = left, b = right, কিছুই বদলায় না", isCorrect: false, explanation: "দুটো মানই বদলায়, একে অপরের জায়গায়।" },
          { key: "D", text: "Error: একই Statement এ দুটো Column একে অপরকে পড়তে পারে না", isCorrect: false, explanation: "কোনো Error নেই। একই Column দুবার SET করলে Error হয়, এখানে Column দুটো আলাদা।" },
        ],
      },
      {
        id: 3,
        text: "ট্যুর 7 এর is_active আগে থেকেই true, ট্যুর 8 এর false। UPDATE upd_tours SET is_active = true WHERE tour_id IN (7, 8); চালালে PostgreSQL কী রিপোর্ট করে?",
        options: [
          { key: "A", text: "UPDATE 1, কারণ শুধু একটা মান সত্যিই বদলেছে", isCorrect: false, explanation: "MySQL এর Changed এই সংখ্যাটা দেখাত। PostgreSQL এর গোনা আলাদা।" },
          {
            key: "B",
            text: "UPDATE 2, কারণ দুটো Row ই WHERE মেনেছে, একটার মান না বদলালেও",
            isCorrect: true,
            explanation: "ঠিক। Documentation অনুযায়ী গোনায় আসে মিলে যাওয়া সব Row, মান না বদলানো গুলো সহ। দুটোরই নতুন Version লেখা হয়।",
          },
          { key: "C", text: "UPDATE 0, কারণ true তো আগেই ছিল", isCorrect: false, explanation: "ট্যুর 8 এর মান false ছিল, সেটা বদলেছে।" },
          { key: "D", text: "Warning সহ UPDATE 1", isCorrect: false, explanation: "PostgreSQL এখানে কোনো Warning দেয় না।" },
        ],
      },
      {
        id: 4,
        text: "UPDATE upd_customers c SET last_total = b.total_bdt FROM bookings b WHERE b.customer_id = c.customer_id; Rahim Uddin এর Booking তিনটা। তাঁর Row এর কী হয়?",
        options: [
          { key: "A", text: "Error: more than one row", isCorrect: false, explanation: "এই Error আসে SET এর Subquery থেকে, FROM এর একাধিক জোড়ায় না।" },
          { key: "B", text: "তিনটা টাকার যোগফল বসে", isCorrect: false, explanation: "FROM কোনো যোগ করে না। যোগ চাইলে আগে GROUP BY আর sum।" },
          {
            key: "C",
            text: "তিনটার যেকোনো একটা বসে, কোনটা তা আগে থেকে বলা যায় না, আর কোনো Error আসে না",
            isCorrect: true,
            explanation: "ঠিক। Documentation বলে এমন হলে জোড়াগুলোর একটা দিয়েই Row বদলায়, কিন্তু কোনটা, তা সহজে আন্দাজ করা যায় না। সমাধান: FROM এ আগে প্রতি Customer এ একটা Row।",
          },
          { key: "D", text: "Row টা তিনবার বদলায়, শেষ Booking এর মান থাকে", isCorrect: false, explanation: "একটা Statement এ একটা Row একবারই বদলায়, আর শেষ বলে কোনো নিশ্চিত ক্রমও নেই।" },
        ],
      },
      {
        id: 5,
        text: "SET seats_left = max_seats - (SELECT sum(b.seats) FROM bookings b WHERE b.departure_id = d.departure_id) চালানো হলো। যে Departure এর কোনো Booking নেই, তার seats_left কী হয়?",
        options: [
          { key: "A", text: "max_seats, কারণ বিয়োগ করার কিছু নেই", isCorrect: false, explanation: "COALESCE থাকলে তাই হতো। এখানে নেই।" },
          {
            key: "B",
            text: "NULL, কারণ কোনো Row না পেলে sum() NULL দেয়, আর কিছু বিয়োগ NULL মানে NULL",
            isCorrect: true,
            explanation: "ঠিক। কপিতে চালালে Departure 12 আর 16 এর seats_left NULL হয়েছিল। ঠিক রূপ COALESCE(sum(b.seats), 0)।",
          },
          { key: "C", text: "0", isCorrect: false, explanation: "sum() খালি ইনপুটে 0 দেয় না, NULL দেয়। count() দেয় 0।" },
          { key: "D", text: "Error 21000", isCorrect: false, explanation: "Subquery একটা Row ই দেয়, যার মান NULL। একাধিক Row না, তাই এই Error না।" },
        ],
      },
      {
        id: 6,
        text: "ষোলোটা Departure এর UPDATE এ ষষ্ঠ Row টা CHECK (seats_left >= 0) ভাঙল। Statement শেষে কয়টা Row বদলানো অবস্থায় থাকে?",
        options: [
          { key: "A", text: "পাঁচটা, Error এর আগের গুলো", isCorrect: false, explanation: "আগের পাঁচটার হিসাব হয়েছিল, কিন্তু Statement বাতিল হওয়ায় সেগুলোও ফেরত যায়।" },
          { key: "B", text: "পনেরোটা, শুধু ভাঙা Row টা বাদ", isCorrect: false, explanation: "PostgreSQL ভাঙা Row বাদ দিয়ে বাকিগুলো রাখে না।" },
          {
            key: "C",
            text: "একটাও না, পুরো Statement বাতিল",
            isCorrect: true,
            explanation: "ঠিক। একটা Statement হয় পুরোটা হয়, নয়তো একটুও না। এটাই Atomicity, আর Box এ দেখেছেন Departure 1 এর 14 অটুট ছিল।",
          },
          { key: "D", text: "ষোলোটাই, CHECK শুধু INSERT এ খাটে", isCorrect: false, explanation: "CHECK, NOT NULL, UNIQUE, Foreign Key সব UPDATE কেও পাহারা দেয়।" },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL 18 এ UPDATE upd_tours SET price_bdt = price_bdt + 100 WHERE tour_id = 7 RETURNING price_bdt; এর price_bdt কোন মান দেখায়?",
        options: [
          {
            key: "A",
            text: "নতুন মান, বদলের পরের",
            isCorrect: true,
            explanation: "ঠিক। শুধু Column এর নাম বা * দিলে নতুন মান আসে। পুরনো মান চাইলে old.price_bdt।",
          },
          { key: "B", text: "পুরনো মান, বদলের আগের", isCorrect: false, explanation: "সেটা পেতে old.price_bdt লিখতে হয়।" },
          { key: "C", text: "দুটোই, পাশাপাশি দুটো Column এ", isCorrect: false, explanation: "দুটো চাইলে old আর new দুটোই লিখতে হয়।" },
          { key: "D", text: "Error, কারণ old বা new বলা হয়নি", isCorrect: false, explanation: "old আর new ঐচ্ছিক। না বললে নতুন মান।" },
        ],
      },
      {
        id: 8,
        text: "Departure 15 এ seats_left 12। একই মুহূর্তে দুজন কর্মী চালালেন: A এর Transaction এ seats_left = seats_left - 2, B এর seats_left = seats_left - 3। A পরে COMMIT করলেন। শেষে seats_left কত, আর কেন?",
        options: [
          { key: "A", text: "9, কারণ B এর লেখা A এর লেখাকে চাপা দেয়", isCorrect: false, explanation: "এটা হতো App নিজে 12 পড়ে হিসাব করে সংখ্যা লিখলে। এখানে হিসাবটা SQL এর ভেতরে।" },
          { key: "B", text: "10, কারণ B এর UPDATE বাতিল হয়", isCorrect: false, explanation: "B এর UPDATE বাতিল হয় না, শুধু অপেক্ষা করে।" },
          {
            key: "C",
            text: "7, কারণ B এর UPDATE A এর Row Lock ছাড়া পর্যন্ত অপেক্ষা করে, তারপর COMMIT হওয়া 10 থেকে 3 কমায়",
            isCorrect: true,
            explanation: "ঠিক। দুটো psql Session এ চালিয়ে দেখা হয়েছে: B অপেক্ষা করেছিল যতক্ষণ A এর Transaction খোলা ছিল, তারপর পেয়েছিল 7।",
          },
          { key: "D", text: "Error: Deadlock", isCorrect: false, explanation: "একটা Row আর একটা ক্রমে Lock চাইলে Deadlock হয় না, শুধু অপেক্ষা। Deadlock এর গল্প Module 12 এ।" },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ফারুক সাহেবের সপ্তাহ, নিজের হাতে",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>তিন কাজ, কপিতে:</strong> customers, tours, bookings আর departures এর upd_ কপিতে রবিবারের তিনটা কাজ করুন। প্রতিটা
        UPDATE এর আগে Preview SELECT, আর পরে গোনা মেলানোর SELECT।
      </span>,
      <span key="2">
        <strong>Preview এর খাতা:</strong> নিজে তিনটা নতুন UPDATE ভাবুন (যেমন একটা শহরের সব Customer এর country, কোনো গাইডের ভাষা,
        কোনো মাসের সব Departure এক সপ্তাহ পেছানো)। প্রতিটার জন্য লিখুন: Preview এর Row সংখ্যা, UPDATE n, আর দুটো মিলল কিনা।
      </span>,
      <span key="3">
        <strong>FROM এর ফাঁদ শিকার:</strong> একাধিক জোড়ার ফাঁদটা নিজে ঘটান, তারপর দুইভাবে ঠিক করুন: DISTINCT ON দিয়ে সবশেষ
        Booking, আর GROUP BY দিয়ে মোট টাকা। দুটো ফল পাশাপাশি রাখুন।
      </span>,
      <span key="4">
        <strong>updated_at দুইভাবে:</strong> একটা Table এ হাতে updated_at বসান, আরেকটায় Trigger দিয়ে। দুটোতেই একই পাঁচটা UPDATE
        চালান (একটায় মান না বদলিয়ে), আর লিখুন কোনটায় updated_at বদলাল।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> খাতার পাতায় পেন্সিল দিয়ে মুছে লেখার বদলে নতুন লাইন লেখার উদাহরণে বোঝান PostgreSQL
        এর UPDATE কী করে, আর একই আসন দুজন একসাথে বেচলে কেন হিসাবটা SQL এ রাখতে হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">চারটা কপির Script, প্রতিটা Preview আর যাচাইয়ের ফলাফল সহ</span>,
      <span key="d2">তিনটা নিজের UPDATE এর খাতা: Preview সংখ্যা, UPDATE n, মিল বা অমিল</span>,
      <span key="d3">একাধিক জোড়ার ভুল ফল আর দুই রকম সমাধানের ফল</span>,
      <span key="d4">দুই Table এর updated_at এর তালিকা, কোন UPDATE এ বদলাল</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ UPDATE",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম UPDATE আর তিনটা গোনা",
        description:
          "প্রথম ফাইল। SELECT 15, তারপর UPDATE 1, UPDATE 0, UPDATE 0। শেষ Table এ Tanvir Ahmed এর phone ভরা, Mitu Rahman এর খালি। প্রথমবার চালালে DROP এর পাশে একটা NOTICE আসবে, সেটা স্বাভাবিক।",
      },
      {
        title: "Preview, তারপর Transaction এ মহড়া",
        description:
          "দ্বিতীয় ফাইল। Preview তে চারটা Row, তারপর BEGIN, UPDATE 4, নতুন দাম, ROLLBACK। শেষে ট্যুর 1 আবার 12500.00। আসল Table এ কিছুই বদলায়নি।",
      },
      {
        title: "FROM আর VALUES দিয়ে বদল",
        description:
          "তৃতীয় ফাইল। UPDATE 6, তারপর UPDATE 2 (তালিকার 42 চুপচাপ বাদ)। শেষে নয়টা Row: Chattogram এর ছয়টা দশ শতাংশ বেশি, ট্যুর 3 এর 18500.00, ট্যুর 6 এর 8000.00।",
      },
      {
        title: "seats_left মেলানো",
        description:
          "চতুর্থ ফাইল। প্রথম মেলানোয় differ 0: সব Departure এর আসন নিয়ম মেনে আছে। দুটো Booking বাতিলের পরে আবার গুনলে দুটো Departure আলাদা: 8 এর 14 থেকে 18, 14 এর 21 থেকে 23।",
      },
      {
        title: "RETURNING, old আর new",
        description:
          "পঞ্চম ফাইল। psql RETURNING এর Table এর পরে UPDATE 2 ও দেখায়। দুটো ট্যুর 250 টাকা বেশি, তারপর নামের বদল, আর শেষে মিলে না যাওয়া UPDATE এ খালি Table আর UPDATE 0।",
      },
      {
        title: "দুই Window, একই আসন",
        description:
          "ষষ্ঠ ফাইলের নির্দেশে দুটো psql Window। Window A Transaction খোলা রাখলে Window B এর UPDATE আটকে থাকে, A এর COMMIT এর পরে B দেখায় 7। তারপর App এর মতো পড়ে লিখলে 9। শেষে seats_left আবার 12 করে দিন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-update.sql",
        code: `DROP TABLE IF EXISTS upd_customers;
-- NOTICE:  table "upd_customers" does not exist, skipping   (শুধু প্রথমবার)
CREATE TABLE upd_customers AS
SELECT customer_id, full_name, phone, city
FROM customers;
-- SELECT 15

UPDATE upd_customers
SET phone = '+8801000000103'
WHERE customer_id = 3;
-- UPDATE 1

UPDATE upd_customers
SET city = 'Chattogram'
WHERE city = 'Chittagong';
-- UPDATE 0

UPDATE upd_customers
SET phone = 'not given'
WHERE phone = NULL;
-- UPDATE 0

SELECT customer_id, full_name, phone, city
FROM upd_customers
WHERE customer_id IN (3, 6)
ORDER BY customer_id;
--  customer_id |  full_name   |     phone      |    city
-- -------------+--------------+----------------+------------
--            3 | Tanvir Ahmed | +8801000000103 | Chattogram
--            6 | Mitu Rahman  |                | Dhaka
-- (2 rows)`,
      },
      {
        language: "sql",
        filename: "02-preview-then-update.sql",
        code: `SELECT tour_id, title, price_bdt,
       round(price_bdt * 1.10, -2) AS new_price
FROM tours
WHERE duration_days >= 3 AND is_active
ORDER BY tour_id;
--  tour_id |           title            | price_bdt | new_price
-- ---------+----------------------------+-----------+-----------
--        1 | Saint Martin Island Escape |  12500.00 |     13800
--        3 | Sundarbans Mangrove Cruise |  18000.00 |     19800
--        5 | Bandarban Hill Trek        |  14000.00 |     15400
--        9 | Cox's Bazar Family Package |  15500.00 |     17100
-- (4 rows)

BEGIN;
UPDATE tours
SET price_bdt = round(price_bdt * 1.10, -2)
WHERE duration_days >= 3 AND is_active;
-- UPDATE 4

SELECT tour_id, price_bdt
FROM tours
WHERE duration_days >= 3 AND is_active
ORDER BY tour_id;
--        1 |  13800.00
--        3 |  19800.00
--        5 |  15400.00
--        9 |  17100.00

ROLLBACK;

SELECT tour_id, price_bdt FROM tours WHERE tour_id = 1;
--        1 |  12500.00`,
      },
      {
        language: "sql",
        filename: "03-update-from.sql",
        code: `DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, destination_id, price_bdt
FROM tours;
-- SELECT 9

UPDATE upd_tours t
SET price_bdt = round(t.price_bdt * 1.10, 2)
FROM destinations d
WHERE d.destination_id = t.destination_id
  AND d.region = 'Chattogram';
-- UPDATE 6

UPDATE upd_tours AS t
SET price_bdt = v.new_price
FROM (VALUES (3, 18500.00), (6, 8000.00), (42, 5000.00))
     AS v(tour_id, new_price)
WHERE t.tour_id = v.tour_id;
-- UPDATE 2

SELECT tour_id, title, price_bdt
FROM upd_tours
ORDER BY tour_id;
--  tour_id |           title            | price_bdt
-- ---------+----------------------------+-----------
--        1 | Saint Martin Island Escape |  13750.00
--        2 | Cox's Bazar Beach Weekend  |   9350.00
--        3 | Sundarbans Mangrove Cruise |  18500.00
--        4 | Sajek Valley Cloud Trip    |  10450.00
--        5 | Bandarban Hill Trek        |  15400.00
--        6 | Sylhet Tea Garden Tour     |   8000.00
--        7 | Ratargul Swamp Boat Day    |   3500.00
--        8 | Saint Martin Luxury Stay   |  35200.00
--        9 | Cox's Bazar Family Package |  17050.00
-- (9 rows)`,
      },
      {
        language: "sql",
        filename: "04-seats-left.sql",
        code: `DROP TABLE IF EXISTS upd_bookings, upd_departures;
CREATE TABLE upd_bookings AS SELECT * FROM bookings;
-- SELECT 24
CREATE TABLE upd_departures AS SELECT * FROM departures;
-- SELECT 16

UPDATE upd_departures d
SET seats_left = t.max_seats - (SELECT COALESCE(sum(b.seats), 0)
                                FROM upd_bookings b
                                WHERE b.departure_id = d.departure_id
                                  AND b.status <> 'cancelled')
FROM tours t
WHERE t.tour_id = d.tour_id;
-- UPDATE 16

SELECT count(*) AS differ
FROM upd_departures u
JOIN departures s ON s.departure_id = u.departure_id
WHERE u.seats_left <> s.seats_left;
--  differ
-- --------
--       0

UPDATE upd_bookings SET status = 'cancelled' WHERE booking_id IN (14, 20);
-- UPDATE 2

-- একই গোনার UPDATE আবার
UPDATE upd_departures d
SET seats_left = t.max_seats - (SELECT COALESCE(sum(b.seats), 0)
                                FROM upd_bookings b
                                WHERE b.departure_id = d.departure_id
                                  AND b.status <> 'cancelled')
FROM tours t
WHERE t.tour_id = d.tour_id;
-- UPDATE 16

SELECT u.departure_id, s.seats_left AS before, u.seats_left AS after
FROM upd_departures u
JOIN departures s ON s.departure_id = u.departure_id
WHERE u.seats_left <> s.seats_left
ORDER BY u.departure_id;
--  departure_id | before | after
-- --------------+--------+-------
--             8 |     14 |    18
--            14 |     21 |    23
-- (2 rows)`,
      },
      {
        language: "sql",
        filename: "05-returning.sql",
        code: `DROP TABLE IF EXISTS upd_tours;
CREATE TABLE upd_tours AS
SELECT tour_id, title, price_bdt FROM tours;

UPDATE upd_tours
SET price_bdt = price_bdt + 250
WHERE tour_id IN (6, 7)
RETURNING tour_id, old.price_bdt AS old_price, new.price_bdt AS new_price;
--  tour_id | old_price | new_price
-- ---------+-----------+-----------
--        6 |   7800.00 |   8050.00
--        7 |   3500.00 |   3750.00
-- (2 rows)
--
-- UPDATE 2

UPDATE upd_tours
SET title = title || ' (Winter)'
WHERE tour_id = 1
RETURNING WITH (OLD AS before, NEW AS after)
          before.title AS old_title, after.title AS new_title;
--          old_title          |              new_title
-- ----------------------------+-------------------------------------
--  Saint Martin Island Escape | Saint Martin Island Escape (Winter)
-- (1 row)
--
-- UPDATE 1

UPDATE upd_tours
SET price_bdt = 0
WHERE tour_id = 99
RETURNING *;
--  tour_id | title | price_bdt
-- ---------+-------+-----------
-- (0 rows)
--
-- UPDATE 0`,
      },
      {
        language: "sql",
        filename: "06-two-windows.sql",
        code: `-- দুটো Terminal এ দুটো psql খুলুন: psql -d island_tours
-- ধাপে ধাপে, Window এর নাম দেখে চালান

-- [Window A]
BEGIN;
UPDATE departures SET seats_left = seats_left - 2
WHERE departure_id = 15 RETURNING seats_left;
--  seats_left
-- ------------
--          10

-- [Window B]  এই লাইনটা চালিয়ে দেখুন, Prompt আটকে থাকবে
\\timing on
UPDATE departures SET seats_left = seats_left - 3
WHERE departure_id = 15 RETURNING seats_left;

-- [Window A]
COMMIT;

-- [Window B]  সাথে সাথে উত্তর আসবে
--  seats_left
-- ------------
--           7
-- UPDATE 1
-- Time: 3065.751 ms (00:03.066)   (যতক্ষণ A খোলা ছিল, সংখ্যাটা আপনার আলাদা হবে)

-- এবার App এর ভুল উপায়: আগে আসন আবার 12 করুন
UPDATE departures SET seats_left = 12 WHERE departure_id = 15;
-- [Window A] SELECT seats_left FROM departures WHERE departure_id = 15;   -- 12
-- [Window B] SELECT seats_left FROM departures WHERE departure_id = 15;   -- 12
-- [Window A] UPDATE departures SET seats_left = 10 WHERE departure_id = 15;   -- UPDATE 1
-- [Window B] UPDATE departures SET seats_left = 9 WHERE departure_id = 15;    -- UPDATE 1
-- [যেকোনো Window] SELECT seats_left FROM departures WHERE departure_id = 15;  -- 9, হওয়ার কথা 7

-- শেষে আসল মান ফিরিয়ে দিন
UPDATE departures SET seats_left = 12 WHERE departure_id = 15;`,
      },
    ],
  },
};
