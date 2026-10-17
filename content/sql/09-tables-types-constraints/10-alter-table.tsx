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
  AlterCostLab,
  LockQueueLab,
  NotValidLab,
} from "../../../components/course/topics/ddl/alter-animations";
import {
  AlterAnatomyDiagram,
  AlterWorkDiagram,
  ExpandContractDiagram,
  NotValidTimelineDiagram,
  RenameFollowsDiagram,
  UsingFlowDiagram,
} from "../../../components/course/topics/ddl/alter-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const alterTableContent: TopicData = {
  id: "alter-table",
  introduction: {
    badge: "MODULE 09 · LESSON 10",
    title: <SectionTitle>চালু Table বদলানো, Data না হারিয়ে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি Table বানিয়েছেন একদম শুরু থেকে: Column, Type, Default, NOT NULL, CHECK, Primary Key,
          Foreign Key। কিন্তু বাস্তবে একটা Table একবার বানিয়ে আর কেউ ছোঁয় না, এমন হয় না। ব্যবসা বদলায়, নতুন প্রশ্ন আসে,
          পুরনো ভুল ধরা পড়ে। তখন Table টা বদলাতে হয়, অথচ তার ভেতরে ততদিনে হাজার হাজার Row জমে আছে, আর সাইট চলছে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই কাজের হাতিয়ার নিয়ে: ALTER TABLE। এটা দিয়ে চালু Table এ Column যোগ করা যায়, মোছা যায়, নাম বদলানো
          যায়, Type বদলানো যায়, Default আর NOT NULL বসানো বা সরানো যায়, Constraint যোগ বা মোছা যায়, এমনকি Table এর নামও
          বদলানো যায়। সবকিছু Data রেখেই।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি প্রতিটা বদল নিজে চালাবেন, কোনটা চোখের পলকে হয় আর কোনটা পুরো Table নতুন করে লেখে তা মাপবেন, পুরনো
          ভুল Data রেখেই নতুন নিয়ম বসাবেন, আর চালু সাইটে একটা ছোট ALTER কীভাবে পুরো সাইট থামাতে পারে ও তা কীভাবে ঠেকাতে হয়,
          সেটাও বুঝবেন। সব উদাহরণ Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি দর্জির মতো। পুরনো জামা ফেলে নতুন জামা বানাই না, যেটা গায়ে আছে সেটাই খুলে, মেপে, একটু বাড়াই বা কমাই। শুধু মনে রাখবেন, আমার কাজ চলার সময় জামাটা কেউ পরতে পারে না।",
      author: "ALTER TABLE",
      role: "Lesson 10",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ফারুক সাহেবের তিনটা অনুরোধ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর সাইট চালু, প্রতিদিন Booking আসছে। সাপ্তাহিক বৈঠকে Operations Manager
                ফারুক সাহেব তিনটা অনুরোধ নিয়ে এলেন। এক, Customer রা চান তাঁদের সাথে WhatsApp এ যোগাযোগ হোক, তাই প্রতিটা
                Customer এর WhatsApp নম্বর রাখার জায়গা চাই। দুই, সাইটে প্রতিটা ট্যুরের পাশে লেখা থাকবে সেটা কতটা কঠিন: easy,
                moderate নাকি hard। তিন, গত মাসে একটা ট্যুরের দাম ভুল করে 0 টাকা হয়ে গিয়েছিল, এমন যেন আর কখনো না হয়।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer তানিম প্রথমে ভাবলেন, CREATE TABLE তো শিখেছি, নতুন করে Table বানিয়ে ফেলি। তারপর থামলেন।
                customers Table এ ১৫ জন Customer এর নাম, Email, ফোন। tours এ ৯টা ট্যুর। তাদের সাথে Foreign Key দিয়ে জোড়া
                departures, bookings, payments, reviews। Table মুছে নতুন বানালে সব Data হারায়, আর যে Table গুলো এদের দিকে
                তাকিয়ে আছে, তাদের সম্পর্কও ভাঙে। তাঁর দরকার এমন কিছু, যেটা Table টা রেখে শুধু তার গঠন বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                সেটাই ALTER TABLE: চালু Table এর সংজ্ঞা বদলানো, মানে কোন Column, কোন Type, কোন নিয়ম, Table এর নাম কী। Row গুলো
                যেখানে ছিল সেখানেই থাকে। Module 01 এর{" "}
                <Link href="/sql/topic/what-is-sql" className={LINK}>
                  What Is SQL
                </Link>{" "}
                লেসনের দুই রকম SQL মনে করুন: Data নিয়ে DML (SELECT, INSERT, UPDATE, DELETE), গঠন নিয়ে DDL (CREATE, ALTER, DROP)।
                CREATE জন্ম দেয়, DROP বিদায় দেয়, ALTER সারা জীবন বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে একটা অভ্যাস প্রথম থেকেই রাখবেন: আসল Table এ হাত দেওয়ার আগে একটা কপিতে অনুশীলন। নিচের Box এ{" "}
                <code className={CODE}>CREATE TABLE ... AS SELECT</code> দিয়ে customers এর একটা কপি বানানো হয়েছে, নাম{" "}
                <code className={CODE}>alter_customers</code>, তারপর তাতে প্রথম ALTER। এই লেসনের সব নিজের Table এর নাম{" "}
                <code className={CODE}>alter_</code> দিয়ে শুরু, যাতে আসল Table এর সাথে কখনো গুলিয়ে না যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চালু Table এ প্রথম ALTER"
              query={`-- আসল customers এর একটা অনুশীলনের কপি
DROP TABLE IF EXISTS alter_customers;
CREATE TABLE alter_customers AS
SELECT customer_id, full_name, email, phone, city
FROM customers;

-- ফারুক সাহেবের প্রথম অনুরোধ: WhatsApp নম্বরের জায়গা
ALTER TABLE alter_customers ADD COLUMN whatsapp text;

SELECT count(*) AS customers_still_here FROM alter_customers;

SELECT customer_id, full_name, phone, whatsapp
FROM alter_customers
ORDER BY customer_id
LIMIT 5;`}
              caption="প্রথম Table এ ১৫, কোনো Row হারায়নি। দ্বিতীয় Table এ নতুন whatsapp Column সবার শেষে, প্রতিটা Row এ NULL, কারণ পুরনো Row গুলোর জন্য কেউ মান দেয়নি। Tanvir Ahmed এর phone আগে থেকেই খালি, Sample Data র পাঁচটা NULL ফোনের একটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Catalog: Table এর বর্ণনার খাতা",
          content: (
            <ContentParagraph>
              PostgreSQL প্রতিটা Table এর বর্ণনা রাখে কয়েকটা বিশেষ System Table এ, একসাথে যাদের নাম Catalog। কোন Table এ কোন
              Column, কোন Type, কোন Constraint, সব সেখানে লেখা। Row গুলো থাকে আলাদা একটা Data File এ। ALTER TABLE সবসময় Catalog
              বদলায়। কোনো কোনো ALTER এর সাথে Data File এর প্রতিটা Row ও পড়তে বা নতুন করে লিখতে হয়, আর সেখানেই সময় আর ঝুঁকি।
              কোনটা কোন দলে, এই লেসনের বড় একটা অংশ সেটা নিয়েই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "anatomy",
      subHeader: { index: "002", title: "Anatomy" },
      title: <SectionTitle>একটা ALTER TABLE এর প্রতিটা অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AlterAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা ALTER TABLE শুরু হয় একই ভাবে: <code className={CODE}>ALTER TABLE</code>, তারপর ঐচ্ছিক{" "}
                <code className={CODE}>IF EXISTS</code>, তারপর একটাই Table এর নাম। তার পরে আসে এক বা একাধিক Action। Action গুলো
                কমা দিয়ে আলাদা, আর পুরো Statement শেষ হয় একটা সেমিকোলনে। প্রধান Action গুলোর পরিবার এরকম:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Column নিয়ে:</strong> <code className={CODE}>ADD COLUMN</code>,{" "}
                  <code className={CODE}>DROP COLUMN</code>, <code className={CODE}>RENAME COLUMN ... TO ...</code>।
                </ListItem>
                <ListItem>
                  <strong>একটা Column এর ভেতরের নিয়ম নিয়ে:</strong>{" "}
                  <code className={CODE}>ALTER COLUMN ... TYPE</code>,{" "}
                  <code className={CODE}>ALTER COLUMN ... SET DEFAULT</code> বা <code className={CODE}>DROP DEFAULT</code>,{" "}
                  <code className={CODE}>ALTER COLUMN ... SET NOT NULL</code> বা <code className={CODE}>DROP NOT NULL</code>।
                </ListItem>
                <ListItem>
                  <strong>Constraint নিয়ে:</strong> <code className={CODE}>ADD CONSTRAINT</code>,{" "}
                  <code className={CODE}>DROP CONSTRAINT</code>, <code className={CODE}>VALIDATE CONSTRAINT</code>,{" "}
                  <code className={CODE}>RENAME CONSTRAINT</code>।
                </ListItem>
                <ListItem>
                  <strong>পুরো Table নিয়ে:</strong> <code className={CODE}>RENAME TO</code> (নতুন নাম),{" "}
                  <code className={CODE}>SET SCHEMA</code> (অন্য Schema তে সরানো, Module 02 এর{" "}
                  <Link href="/sql/topic/databases-schemas" className={LINK}>
                    Databases and Schemas
                  </Link>{" "}
                  লেসনের সেই Schema)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একাধিক Action এক Statement এ লেখার দুটো লাভ। প্রথমত সবগুলো একটা Lock এর ভেতরে হয়, আর যদি Table নতুন করে লিখতেই
                হয়, সেটা একবারই হয়, প্রতিটা Action এর জন্য আলাদা করে না। দ্বিতীয়ত পুরোটা একটা কাজ: শেষ Action এ Error হলে আগের
                Action গুলোও বাতিল, অর্ধেক বদলানো Table কখনো থাকে না। শুধু RENAME আর SET SCHEMA এই দলে মেশে না, এদের আলাদা
                Statement চাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ চারটা Action"
              query={`DROP TABLE IF EXISTS alter_customers;
CREATE TABLE alter_customers AS
SELECT customer_id, full_name, email, phone, city
FROM customers;

ALTER TABLE IF EXISTS alter_customers
  ADD COLUMN whatsapp text,
  ADD COLUMN vip boolean NOT NULL DEFAULT false,
  ALTER COLUMN city SET DEFAULT 'Dhaka',
  ADD CONSTRAINT alter_customers_city_check CHECK (length(city) > 1);

-- Table এর বর্ণনা, information_schema থেকে পড়া
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'alter_customers'
ORDER BY ordinal_position;`}
              caption="সাতটা Column। whatsapp আর vip শেষে, vip এর is_nullable NO আর Default false, city এর Default 'Dhaka'::text। বাকি সব YES, কারণ CREATE TABLE AS দিয়ে বানানো কপি শুধু Data আনে, NOT NULL বা Default আনে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              information_schema হলো SQL Standard এর একটা Schema, যেটা প্রতিটা Database কে নিজের বর্ণনা Table আকারে দেখাতে বলে।
              psql এ একই জিনিস দেখার ছোট পথ <code className={CODE}>{"\\d alter_customers"}</code>, যেটা Module 02 এর{" "}
              <Link href="/sql/topic/psql-basics" className={LINK}>
                psql Basics
              </Link>{" "}
              লেসনে দেখেছেন। Query Box এ psql এর Backslash Command চলে না, তাই এখানে information_schema। আর IF EXISTS এর কাজ:
              না থাকা Table এ <code className={CODE}>ALTER TABLE IF EXISTS alter_no_such_table ...</code> কিছুই করে না, psql শুধু
              একটা NOTICE দেখায় (relation does not exist, skipping); IF EXISTS ছাড়া একই লাইন Error দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "add-column",
      subHeader: { index: "003", title: "Adding Columns" },
      title: <SectionTitle>ADD COLUMN: নতুন Column, পুরনো Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন Column যোগ করার সময় আসল প্রশ্ন একটাই: যে Row গুলো আগে থেকে আছে, তারা এই Column এ কী পাবে? উত্তর তিন রকম
                হতে পারে, আর তিনটাই নিচের Box এ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Default ছাড়া:</strong> <code className={CODE}>ADD COLUMN written_by text</code>। পুরনো সব Row এ NULL।
                </ListItem>
                <ListItem>
                  <strong>একটা ধ্রুব Default সহ:</strong>{" "}
                  <code className={CODE}>ADD COLUMN priority smallint NOT NULL DEFAULT 3</code>। পুরনো সব Row পায় 3, আর ভবিষ্যতে
                  INSERT এ মান না দিলেও 3।
                </ListItem>
                <ListItem>
                  <strong>একটা Function Default সহ:</strong>{" "}
                  <code className={CODE}>ADD COLUMN added_at timestamptz NOT NULL DEFAULT now()</code>। এখানে একটা সূক্ষ্ম কথা আছে:
                  now() একটা Transaction এর ভেতরে সবসময় একই মান দেয়, তাই পুরনো সব Row ঠিক একই মুহূর্ত পায়, ALTER চালানোর মুহূর্ত।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন রকম ADD COLUMN"
              query={`DROP TABLE IF EXISTS alter_tour_notes;
CREATE TABLE alter_tour_notes (
  note_id integer PRIMARY KEY,
  tour_id integer NOT NULL,
  note    text
);
INSERT INTO alter_tour_notes VALUES
  (1, 1, 'Bring sunscreen'),
  (2, 3, 'Boat leaves at 7'),
  (3, 5, NULL);

ALTER TABLE alter_tour_notes ADD COLUMN written_by text;
ALTER TABLE alter_tour_notes ADD COLUMN priority smallint NOT NULL DEFAULT 3;
ALTER TABLE alter_tour_notes ADD COLUMN added_at timestamptz NOT NULL DEFAULT now();

SELECT note_id, note, written_by, priority,
       added_at = (SELECT min(added_at) FROM alter_tour_notes) AS same_moment
FROM alter_tour_notes
ORDER BY note_id;`}
              caption="তিনটা Row। written_by সবার খালি, priority সবার 3, আর same_moment সবার t (true): তিনটা Row এর added_at হুবহু এক। এর পরে নতুন কোনো Row INSERT করলে সে নিজের মুহূর্ত পাবে, কারণ Default টা তখন আবার হিসাব হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার যেটা প্রায় সবাই একবার করে ভুল করেন: <code className={CODE}>NOT NULL</code> Column, কিন্তু Default ছাড়া।
                নতুন Column এ পুরনো Row গুলো কী পাবে? Default নেই, তাই NULL। কিন্তু NOT NULL বলছে NULL চলবে না। PostgreSQL দুটো
                কথা একসাথে মানতে পারে না, তাই পুরো ALTER বাতিল করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT NULL, কিন্তু পুরনো Row কী পাবে?"
              query={`DROP TABLE IF EXISTS alter_tour_notes;
CREATE TABLE alter_tour_notes (
  note_id integer PRIMARY KEY,
  tour_id integer NOT NULL,
  note    text
);
INSERT INTO alter_tour_notes VALUES
  (1, 1, 'Bring sunscreen'),
  (2, 3, 'Boat leaves at 7');

-- একই নামে আবার যোগ: IF NOT EXISTS থাকায় Error না
ALTER TABLE alter_tour_notes ADD COLUMN IF NOT EXISTS note text;

-- এবার আসল ভুল
ALTER TABLE alter_tour_notes ADD COLUMN reviewed_on date NOT NULL;`}
              caption="শেষ Statement এ ERROR: column reviewed_on of relation alter_tour_notes contains null values, SQLSTATE 23502। IF NOT EXISTS এর লাইন শুধু ALTER বলে পার (psql হলে NOTICE: already exists, skipping)। Table খালি হলে শেষ লাইনও চলত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই Error এর তিনটা সমাধান:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যুক্তিসঙ্গত Default:</strong>{" "}
                  <code className={CODE}>{"ADD COLUMN reviewed_on date NOT NULL DEFAULT DATE '2026-11-01'"}</code>, যদি মানটা
                  পুরনো Row গুলোর জন্য সত্যিই গ্রহণযোগ্য হয়।
                </ListItem>
                <ListItem>
                  <strong>তিন ধাপ:</strong> NULL রাখার মতো ADD COLUMN, UPDATE দিয়ে আসল মান, তারপর{" "}
                  <code className={CODE}>SET NOT NULL</code> (সেকশন ৮)। বড় Table এ এটাই নিরাপদ, মাঝের ধাপ ছোট ছোট ভাগে করা যায়।
                </ListItem>
                <ListItem>
                  <strong>NOT NULL বাদ:</strong> পুরনো Row এর মান সত্যিই অজানা হলে NULL ই সৎ উত্তর, মিথ্যা মানের চেয়ে ভালো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AlterWorkDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির বাঁ দিকের প্রথম দুটো লাইন এই সেকশনের সবচেয়ে কাজের খবর। PostgreSQL 11 এর আগে Default সহ ADD COLUMN মানে
                ছিল পুরো Table নতুন করে লেখা, দশ কোটি Row এ ঘণ্টার কাজ। PostgreSQL 11 থেকে ধ্রুব Default টা Catalog এ একবার লেখা
                থাকে, পুরনো Row পড়ার সময় PostgreSQL নিজেই সেটা দেখায়। তাই Table যত বড়ই হোক, কাজটা এক মুহূর্তের। কিন্তু Default
                যদি প্রতি Row এ আলাদা মান দেয়, যেমন <code className={CODE}>gen_random_uuid()</code> বা{" "}
                <code className={CODE}>clock_timestamp()</code>, তখন আবার পুরো Table নতুন করে লেখা। now() এই দলে পড়ে না, কারণ
                এক Transaction এ তার মান একটাই। সেকশন ১২ তে এটা নিজের চোখে মাপবেন।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা কথা: PostgreSQL এ নতুন Column সবসময় শেষে বসে। <code className={CODE}>AFTER</code> বা{" "}
                <code className={CODE}>FIRST</code> নেই, লিখলে Syntax Error। ক্রমটা আসলে গুরুত্বপূর্ণ না, কারণ ভালো Query তে
                Column এর নাম যে ক্রমে লিখবেন, সেই ক্রমেই আসে। MySQL এ AFTER আছে, সেকশন ১৩ তে।
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
                  Starter এ guides এর একটা কপি বানানো আছে, নাম <code className={CODE}>alter_ex1_guides</code>। একটা ALTER
                  TABLE এ দুটো Column যোগ করুন: <code className={CODE}>whatsapp</code>, Type text, খালি রাখা চলবে; আর{" "}
                  <code className={CODE}>is_freelance</code>, Type boolean, NULL চলবে না, Default false। শেষের যাচাইয়ের Query
                  টা যেমন আছে তেমনই শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex1_guides;
CREATE TABLE alter_ex1_guides AS
SELECT guide_id, full_name, language FROM guides;

-- এখানে আপনার ALTER TABLE লিখুন

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'alter_ex1_guides'
ORDER BY ordinal_position;`}
              hint={
                <>
                  একটাই ALTER TABLE, তার পরে দুটো ADD COLUMN, মাঝে কমা। NOT NULL আর DEFAULT false দুটোই is_freelance এর
                  সংজ্ঞায় বসবে। যাচাইয়ের ফলাফলে is_freelance এর is_nullable হবে NO।
                </>
              }
              solution={`SELECT *
FROM (VALUES
  ('guide_id', 'integer', 'YES', NULL),
  ('full_name', 'text', 'YES', NULL),
  ('language', 'text', 'YES', NULL),
  ('whatsapp', 'text', 'YES', NULL),
  ('is_freelance', 'boolean', 'NO', 'false')
) AS v(column_name, data_type, is_nullable, column_default);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "drop-column",
      subHeader: { index: "004", title: "Dropping Columns" },
      title: <SectionTitle>DROP COLUMN: সবচেয়ে সহজ, সবচেয়ে অফেরতযোগ্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>ALTER TABLE ... DROP COLUMN</code> একটা Column আর তার ভেতরের সব মান সরিয়ে দেয়। লেখা সবচেয়ে
                সহজ, কিন্তু Transaction এর বাইরে চালালে এর কোনো Undo নেই। Backup থেকে ফেরত আনা ছাড়া সেই Data আর পাওয়া যায় না
                (Backup এর গল্প Module 18 এ)। তাই DROP COLUMN এর আগে তিনটা প্রশ্ন: এই Column কেউ পড়ে কিনা, কোনো View বা অন্য
                Table এর উপর নির্ভর করে কিনা, আর Data টা কোথাও রেখে দেওয়া দরকার কিনা।
              </ContentParagraph>
              <ContentParagraph>
                Column মুছলে সেই Column এর উপর বসানো Index আর Constraint ও নিজে থেকে মুছে যায়। নিচের Box এ email এর উপর একটা
                UNIQUE Constraint বসিয়ে তারপর email মোছা হয়েছে। আর <code className={CODE}>DROP COLUMN IF EXISTS</code> না থাকা
                Column এর জন্য Error দেয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column মুছলে তার Constraint ও যায়"
              query={`DROP VIEW IF EXISTS alter_contact_list;
DROP TABLE IF EXISTS alter_contacts;
CREATE TABLE alter_contacts AS
SELECT customer_id, full_name, email, phone, city
FROM customers;
ALTER TABLE alter_contacts
  ADD CONSTRAINT alter_contacts_email_key UNIQUE (email);

SELECT conname AS before_drop
FROM pg_constraint
WHERE conrelid = 'alter_contacts'::regclass AND contype = 'u';

ALTER TABLE alter_contacts DROP COLUMN email;
ALTER TABLE alter_contacts DROP COLUMN IF EXISTS fax;

SELECT count(*) AS unique_constraints_left
FROM pg_constraint
WHERE conrelid = 'alter_contacts'::regclass AND contype = 'u';

SELECT * FROM alter_contacts ORDER BY customer_id LIMIT 3;`}
              caption="প্রথমে alter_contacts_email_key, email মোছার পরে UNIQUE এর সংখ্যা 0। fax ছিলই না, IF EXISTS থাকায় Error নেই। শেষ Table এ চারটা Column। pg_constraint এ প্রতিটা Constraint এর একটা Row, contype = 'u' মানে UNIQUE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিন্তু Table এর বাইরের কেউ যদি Column টার উপর নির্ভর করে, PostgreSQL মুছতে দেয় না। সবচেয়ে চেনা উদাহরণ View। View
                হলো নাম দেওয়া একটা সংরক্ষিত SELECT, যেটাকে Table এর মতো পড়া যায় (পুরো লেসন Module 14 এর{" "}
                <Link href="/sql/topic/views" className={LINK}>
                  Views
                </Link>{" "}
                এ)। নিচে একটা View phone পড়ে, city পড়ে না। তাই city মোছা যায়, phone মোছা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="View যে Column পড়ে, সেটা মোছা যায় না"
              query={`DROP VIEW IF EXISTS alter_contact_list;
DROP TABLE IF EXISTS alter_contacts;
CREATE TABLE alter_contacts AS
SELECT customer_id, full_name, email, phone, city
FROM customers;

CREATE VIEW alter_contact_list AS
SELECT full_name, phone FROM alter_contacts;

ALTER TABLE alter_contacts DROP COLUMN city;
ALTER TABLE alter_contacts DROP COLUMN phone;`}
              caption="city মুছে গেছে। phone এ ERROR: cannot drop column phone of table alter_contacts because other objects depend on it, DETAIL এ View এর নাম, HINT: Use DROP ... CASCADE। CASCADE View টাও মুছত, যেটা প্রায় কখনো চান না। CASCADE এর আলোচনা পরের লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মোছা Column আসলে কোথায় যায়",
          content: (
            <ContentParagraph>
              DROP COLUMN Table নতুন করে লেখে না। PostgreSQL শুধু Catalog এ Column টাকে মুছে ফেলা হিসেবে চিহ্নিত করে, তাই কাজটা এক
              মুহূর্তের। পুরনো মানগুলো Disk এর Row তে পড়ে থাকে, কিন্তু কোনো Query আর সেগুলো দেখতে পায় না। জায়গাটা খালি হয় পরে, যখন
              কোনো কারণে Table নতুন করে লেখা হয়। psql এ{" "}
              <code className={CODE}>{"SELECT attname, attisdropped FROM pg_attribute WHERE attrelid = 'alter_contacts'::regclass AND attnum > 0;"}</code>{" "}
              চালালে মোছা Column টা অদ্ভুত একটা নামে দেখা যায়, যেমন{" "}
              <code className={CODE}>........pg.dropped.3........</code>, পাশে attisdropped = t। শেষের সংখ্যাটা মোছা Column এর পুরনো ক্রমিক নম্বর। এই চিহ্ন থাকা মানে মান উদ্ধারযোগ্য না, শুধু জায়গা এখনো ফেরত আসেনি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "renaming",
      subHeader: { index: "005", title: "Renaming Columns and Tables" },
      title: <SectionTitle>RENAME: Database এ সহজ, কোডে বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাম বদলানোর দুটো রূপ: Column এর জন্য{" "}
                <code className={CODE}>ALTER TABLE t RENAME COLUMN old TO new</code>, Table এর জন্য{" "}
                <code className={CODE}>ALTER TABLE old RENAME TO new</code>। দুটোই শুধু Catalog বদলায়, Table এ কোটি Row থাকলেও
                এক মুহূর্তে শেষ। নতুন নামে একই নামের আরেকটা Column থাকলে Error:{" "}
                <code className={CODE}>column email of relation alter_customers already exists</code>।
              </ContentParagraph>
              <ContentParagraph>
                মজার ব্যাপারটা ঘটে Database এর ভেতরে। PostgreSQL প্রতিটা Table, Column, View, Index কে চেনে একটা ভেতরের নম্বর দিয়ে,
                যার নাম OID (Object Identifier)। নাম তার কাছে শুধু একটা লেবেল। তাই নাম বদলালে যে View বা Foreign Key এই Table এর
                দিকে তাকিয়ে ছিল, তারা নম্বর ধরে চিনে নেয়, কিছুই ভাঙে না। নিচের Box এ একটা Column আর Table দুটোরই নাম বদলে View টা
                আবার পড়া হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম বদলালে View কী দেখে"
              query={`DROP VIEW IF EXISTS alter_trip_list;
DROP TABLE IF EXISTS alter_tour_plans;
DROP TABLE IF EXISTS alter_trips;
CREATE TABLE alter_trips (
  trip_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title   text NOT NULL UNIQUE,
  seats   smallint CHECK (seats > 0)
);
INSERT INTO alter_trips (title, seats) VALUES
  ('Sajek weekend', 12),
  ('Sundarbans 3 days', 20);
CREATE VIEW alter_trip_list AS
SELECT trip_id, title, seats FROM alter_trips;

ALTER TABLE alter_trips RENAME COLUMN seats TO seat_limit;
ALTER TABLE alter_trips RENAME TO alter_tour_plans;

SELECT * FROM alter_trip_list;
SELECT pg_get_viewdef('alter_trip_list') AS view_now_reads;

SELECT conname AS constraint_name
FROM pg_constraint
WHERE conrelid = 'alter_tour_plans'::regclass AND contype IN ('p', 'u', 'c')
ORDER BY conname;`}
              caption="View এখনো দুটো Row দেখায়, Column এর নাম এখনো seats, আর সংজ্ঞা নিজেই হয়ে গেছে seat_limit AS seats, FROM alter_tour_plans। শেষ Table এর তিনটা Constraint এর নাম কিন্তু পুরনো: alter_trips_pkey, alter_trips_seats_check, alter_trips_title_key।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RenameFollowsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো নামগুলো কাজে সমস্যা করে না, কিন্তু পরে কেউ Error এ <code className={CODE}>alter_trips_seats_check</code>{" "}
                দেখে alter_trips খুঁজবেন, পাবেন না। তাই দলে নিয়ম থাকলে এগুলোও বদলানো হয়:{" "}
                <code className={CODE}>ALTER TABLE ... RENAME CONSTRAINT</code>, আর Index এর জন্য{" "}
                <code className={CODE}>ALTER INDEX ... RENAME TO</code>। Primary Key আর UNIQUE এর পেছনে একই নামের একটা Index থাকে,
                তাই একটার নাম বদলালে অন্যটাও বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                আসল বিপদ Database এর বাইরে: App, Report আর রাতের Script এ যেখানে <code className={CODE}>FROM alter_trips</code>{" "}
                লেখা, নাম বদলের পরের মুহূর্ত থেকে সবাই পাবে <code className={CODE}>relation alter_trips does not exist</code>, আর
                Database কাউকে সাবধান করে না। সাময়িক সমাধান: পুরনো নামে একটা View, যতদিন না সব কোড নতুন নামে যায়। সাধারণ{" "}
                <code className={CODE}>SELECT * FROM</code> View এ PostgreSQL INSERT, UPDATE, DELETE ও চালাতে দেয়, তাই পুরনো কোড
                প্রায় টেরই পায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম বদল, নাম গোছানো, আর পুরনো কোডের জন্য View"
              query={`DROP VIEW IF EXISTS alter_rooms;
DROP TABLE IF EXISTS alter_room_types;
CREATE TABLE alter_rooms (
  room_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name    text NOT NULL,
  beds    smallint NOT NULL
);
INSERT INTO alter_rooms (name, beds) VALUES
  ('Sea view double', 2),
  ('Hill cottage', 3);

ALTER TABLE alter_rooms RENAME TO alter_room_types;
ALTER INDEX alter_rooms_pkey RENAME TO alter_room_types_pkey;

-- পুরনো কোড যাতে না ভাঙে: পুরনো নামে একটা View
CREATE VIEW alter_rooms AS SELECT * FROM alter_room_types;
INSERT INTO alter_rooms (name, beds) VALUES ('Tent for four', 4);

SELECT * FROM alter_room_types ORDER BY room_id;

SELECT conname FROM pg_constraint
WHERE conrelid = 'alter_room_types'::regclass AND contype = 'p';`}
              caption="তিনটা Room, তৃতীয়টা ঢুকেছে পুরনো নামের View দিয়ে, জমা হয়েছে নতুন নামের Table এ, room_id এসেছে Identity থেকে। Primary Key এর নাম এখন alter_room_types_pkey: Index এর নাম বদলাতেই Constraint এর নামও বদলেছে।"
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
                  Starter এ <code className={CODE}>alter_ex2_tour_plan</code> নামে একটা Table আছে, Primary Key সহ। তিনটা নাম
                  বদলান: Table এর নাম হবে <code className={CODE}>alter_ex2_trips</code>, Column{" "}
                  <code className={CODE}>max_seats</code> হবে <code className={CODE}>seat_limit</code>, আর Primary Key এর নাম
                  হবে <code className={CODE}>alter_ex2_trips_pkey</code>। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex2_trips;
DROP TABLE IF EXISTS alter_ex2_tour_plan;
CREATE TABLE alter_ex2_tour_plan AS
SELECT tour_id, title, max_seats FROM tours;
ALTER TABLE alter_ex2_tour_plan ADD PRIMARY KEY (tour_id);

-- এখানে আপনার তিনটা RENAME লিখুন

SELECT 'column' AS kind, column_name::text AS name
FROM information_schema.columns
WHERE table_name = 'alter_ex2_trips'
UNION ALL
SELECT 'constraint', conname::text
FROM pg_constraint
WHERE conrelid = to_regclass('alter_ex2_trips') AND contype = 'p'
ORDER BY 1, 2;`}
              hint={
                <>
                  RENAME একা একটা Statement চায়, তাই তিনটা আলাদা ALTER। Primary Key এর এখনকার নাম PostgreSQL এর দেওয়া:{" "}
                  <code className={CODE}>alter_ex2_tour_plan_pkey</code>। সেটা বদলাতে{" "}
                  <code className={CODE}>ALTER INDEX ... RENAME TO</code> বা{" "}
                  <code className={CODE}>ALTER TABLE ... RENAME CONSTRAINT ... TO</code>, যেকোনোটা চলবে।
                </>
              }
              orderMatters
              solution={`SELECT *
FROM (VALUES
  ('column', 'seat_limit'),
  ('column', 'title'),
  ('column', 'tour_id'),
  ('constraint', 'alter_ex2_trips_pkey')
) AS v(kind, name)
ORDER BY 1, 2;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "changing-types",
      subHeader: { index: "006", title: "Changing a Column's Type" },
      title: <SectionTitle>ALTER COLUMN TYPE: যখন PostgreSQL নিজেই রূপান্তর করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>ALTER TABLE t ALTER COLUMN c TYPE new_type</code> একটা Column এর Type বদলায়, আর প্রতিটা
                পুরনো মানকে নতুন Type এ রূপান্তর করে। পুরনো Type থেকে নতুন Type এ যাওয়ার একটা স্বাভাবিক পথ থাকলে, Module 04 এর{" "}
                <Link href="/sql/topic/type-casting" className={LINK}>
                  Type Casting
                </Link>{" "}
                লেসনের সেই Cast, PostgreSQL সেটাই নিজে থেকে ব্যবহার করে: smallint থেকে integer, varchar(20) থেকে varchar(50),
                numeric(10, 3) থেকে numeric(10, 2)।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু নিজে থেকে রূপান্তর মানে সবসময় নিরাপদ রূপান্তর না। নিচের Box এ দুটো রূপান্তর আছে যেগুলো কোনো Error ছাড়াই
                মান বদলে দেয়। পড়ার আগে আন্দাজ করুন 99.995 শেষে কী হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চুপচাপ Round হয়ে যাওয়া"
              query={`DROP TABLE IF EXISTS alter_rates;
CREATE TABLE alter_rates (
  rate_id integer PRIMARY KEY,
  label   varchar(20),
  rate    numeric(10, 3)
);
INSERT INTO alter_rates VALUES
  (1, 'bKash fee', 12.345),
  (2, 'Nagad fee', 12.344),
  (3, 'Card fee', 99.995);

-- সীমা বাড়ানো: কোনো মান বদলায় না
ALTER TABLE alter_rates ALTER COLUMN label TYPE varchar(50);

-- দশমিকের পরে তিন ঘর থেকে দুই ঘর
ALTER TABLE alter_rates ALTER COLUMN rate TYPE numeric(10, 2);
SELECT * FROM alter_rates ORDER BY rate_id;

-- এবার পূর্ণসংখ্যা
ALTER TABLE alter_rates ALTER COLUMN rate TYPE integer;
SELECT * FROM alter_rates ORDER BY rate_id;`}
              caption="প্রথম Table এ 12.35, 12.34 আর 100.00, দ্বিতীয়তে 12, 12, 100। কোনো Error বা Warning নেই, আসল মানগুলো আর কোথাও নেই। Scale কমানো আর দশমিক থেকে পূর্ণসংখ্যা, দুটোই Round করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টাকার Column এ এই রকম চুপচাপ Round হওয়া মানে হিসাব না মেলা, আর কেউ টেরও পাবে না কবে থেকে। Module 09 এর{" "}
                <Link href="/sql/topic/numeric-types" className={LINK}>
                  Numeric Types
                </Link>{" "}
                লেসনে দেখেছেন numeric(p, s) এ Insert এর সময়ও Round হয়, Type বদলের সময়ও ঠিক একই নিয়ম। তাই Type ছোট করার আগে
                দেখে নিন কতগুলো মান বদলাবে:{" "}
                <code className={CODE}>SELECT count(*) FROM alter_rates WHERE rate &lt;&gt; round(rate, 2);</code>। উত্তর শূন্য না
                হলে সিদ্ধান্তটা হিসাবরক্ষকের, Developer এর না।
              </ContentParagraph>
              <ContentParagraph>
                অন্যদিকে Text এর সীমা ছোট করার সময় PostgreSQL Round করে না, সরাসরি থামে। নিচে label কে varchar(5) করতে গেলে একটা
                মানও পাঁচ অক্ষরে আঁটে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সীমা ছোট করলে আগে খুঁজুন, তারপর বদলান"
              query={`DROP TABLE IF EXISTS alter_rates;
CREATE TABLE alter_rates (
  rate_id integer PRIMARY KEY,
  label   varchar(20),
  rate    numeric(10, 3)
);
INSERT INTO alter_rates VALUES
  (1, 'bKash fee', 12.345),
  (2, 'Nagad fee', 12.344),
  (3, 'Card fee', 99.995);

-- কোন মানগুলো নতুন সীমায় আঁটবে না
SELECT rate_id, label, length(label) AS chars
FROM alter_rates
WHERE length(label) > 5;

ALTER TABLE alter_rates ALTER COLUMN label TYPE varchar(5);`}
              caption="প্রথম Query তিনটা Row ই দেখায়, সবচেয়ে ছোটটাও ৮ অক্ষরের। তারপর ERROR: value too long for type character varying(5), SQLSTATE 22001। পুরো ALTER বাতিল, label এখনো varchar(20)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Type বদলের আরও দুটো বাধা, দুটোই Error দিয়ে জানায়। কোনো View Column টা পড়লে:{" "}
                <code className={CODE}>cannot alter type of a column used by a view or rule</code>, তখন View মুছে, Type বদলে, View
                আবার বানাতে হয়, একটা Transaction এ। আর Foreign Key এর দুই দিকের Type না মিললে:{" "}
                <code className={CODE}>foreign key constraint ... cannot be implemented</code>।
              </ContentParagraph>
              <ContentParagraph>
                আর মনে রাখবেন, বেশিরভাগ Type বদলে পুরো Table নতুন করে লেখা হয়। smallint থেকে integer এ প্রতিটা মান দুই Byte থেকে
                চার Byte হয়, তাই প্রতিটা Row এর আকার বদলায়। ব্যতিক্রম শুধু সেই বদলগুলো যেখানে Disk এ লেখার ধরন একই থাকে আর পুরনো
                কোনো মান ভাঙার সুযোগ নেই, যেমন varchar এর সীমা বাড়ানো বা varchar থেকে text। সেকশন ১২ এর Box এ এটা মাপা আছে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "using",
      subHeader: { index: "007", title: "Converting with USING" },
      title: <SectionTitle>USING: রূপান্তরের সূত্র নিজে লিখে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো সাইটের একটা Spreadsheet Import করার সময় সবকিছু text Column এ ঢুকেছে: দাম{" "}
                <code className={CODE}>12,500</code>, তারিখ <code className={CODE}>05/11/2026</code>, পেমেন্ট{" "}
                <code className={CODE}>yes</code> বা <code className={CODE}>no</code>। text থেকে numeric এ PostgreSQL নিজে থেকে
                রূপান্তর করে না, কারণ যেকোনো লেখা সংখ্যা হবে এমন কথা নেই। তাই সরাসরি Type বদলাতে গেলে সে থামে আর একটা HINT দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="USING ছাড়া text থেকে integer"
              query={`DROP TABLE IF EXISTS alter_seat_imports;
CREATE TABLE alter_seat_imports (
  import_id integer PRIMARY KEY,
  seats     text
);
INSERT INTO alter_seat_imports VALUES
  (1, '2'),
  (2, '4'),
  (3, 'three');

ALTER TABLE alter_seat_imports ALTER COLUMN seats TYPE integer;`}
              caption="ERROR: column seats cannot be cast automatically to type integer, HINT: You might need to specify USING seats::integer। এবার সেমিকোলনের আগে USING seats::integer লিখে আবার চালান: দ্বিতীয় Error আসবে Data থেকে, invalid input syntax for type integer: three।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UsingFlowDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>USING</code> এর পরে যেকোনো Expression লেখা যায়, যেটা পুরনো Row এর মান থেকে নতুন Type এর
                একটা মান বানায়। PostgreSQL প্রতিটা Row এর জন্য Expression টা একবার চালায়। এতে Module 04 এর সব Function কাজে
                লাগে: <code className={CODE}>replace()</code> দিয়ে কমা সরানো,{" "}
                <code className={CODE}>to_date()</code> দিয়ে নিজের ফরম্যাটে তারিখ পড়া, একটা তুলনা দিয়ে boolean বানানো, ভাগ দিয়ে
                পয়সা থেকে টাকা। নিচের Box এ পাঁচটা রূপান্তর, প্রতিটার নিজের সূত্র।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো Spreadsheet কে আসল Type এ"
              query={`DROP TABLE IF EXISTS alter_imports;
CREATE TABLE alter_imports (
  import_id   integer PRIMARY KEY,
  seats       text,
  price       text,
  paid        text,
  travel_date text,
  fee_paisa   integer
);
INSERT INTO alter_imports VALUES
  (1, '2', '12,500',    'yes', '05/11/2026', 125000),
  (2, '4', '9500',      'no',  '18/11/2026', 95050),
  (3, '1', '18,000.50', 'YES', '02/12/2026', 1800050);

ALTER TABLE alter_imports
  ALTER COLUMN seats       TYPE smallint USING seats::smallint,
  ALTER COLUMN price       TYPE numeric(10, 2) USING replace(price, ',', '')::numeric,
  ALTER COLUMN paid        TYPE boolean USING lower(paid) = 'yes',
  ALTER COLUMN travel_date TYPE date USING to_date(travel_date, 'DD/MM/YYYY'),
  ALTER COLUMN fee_paisa   TYPE numeric(10, 2) USING fee_paisa / 100.0;

ALTER TABLE alter_imports RENAME COLUMN fee_paisa TO fee_bdt;

SELECT * FROM alter_imports ORDER BY import_id;`}
              caption="price এখন 12500.00, 9500.00, 18000.50; paid t, f, t (lower() এর কারণে YES ও true); travel_date 2026-11-05, 2026-11-18, 2026-12-02; fee_bdt 1250.00, 950.50, 18000.50। পাঁচটা রূপান্তর এক ALTER এ, তাই Rewrite একবার। RENAME আলাদা Statement এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই three ওয়ালা Table এ ফেরা যাক। বাস্তবে হাজার Row এর মধ্যে দুই তিনটা লেখা অদ্ভুত থাকে। ঠিক পথ: আগে খোঁজা,
                তারপর মানুষের সিদ্ধান্তে ঠিক করা, তারপর ALTER। খোঁজার জন্য Module 04 এর{" "}
                <Link href="/sql/topic/regular-expressions" className={LINK}>
                  Regular Expressions
                </Link>{" "}
                লেসনের <code className={CODE}>!~</code>, যেটা দিয়ে শুধু অঙ্কে তৈরি নয় এমন লেখা খোঁজা যায়। ঠিক করার জন্য UPDATE
                (পুরো লেসন Module 10 এর{" "}
                <Link href="/sql/topic/update" className={LINK}>
                  UPDATE
                </Link>
                ): <code className={CODE}>UPDATE table SET column = value WHERE condition</code>, শর্ত মেলা Row এর মান বদলায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খুঁজুন, ঠিক করুন, তারপর ALTER"
              query={`DROP TABLE IF EXISTS alter_seat_imports;
CREATE TABLE alter_seat_imports (
  import_id integer PRIMARY KEY,
  seats     text
);
INSERT INTO alter_seat_imports VALUES
  (1, '2'),
  (2, '4'),
  (3, 'three');

-- ১) কোন মানগুলো শুধু অঙ্ক না
SELECT import_id, seats
FROM alter_seat_imports
WHERE seats !~ '^[0-9]+$';

-- ২) মানুষের সিদ্ধান্তে ঠিক করা
UPDATE alter_seat_imports SET seats = '3' WHERE import_id = 3;

-- ৩) এবার রূপান্তর নিশ্চিন্তে
ALTER TABLE alter_seat_imports
  ALTER COLUMN seats TYPE integer USING seats::integer;

SELECT import_id, seats, pg_typeof(seats) AS seats_type
FROM alter_seat_imports
ORDER BY import_id;`}
              caption="প্রথম Query একটাই Row দেখায়: 3, three। UPDATE এর পরে ALTER নির্বিঘ্নে চলে, seats এখন 2, 4, 3 আর seats_type integer। pg_typeof() যেকোনো মানের Type বলে দেয়।"
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
                  <code className={CODE}>alter_ex3_payments</code> এ দুটো text Column আছে।{" "}
                  <code className={CODE}>amount</code> কে numeric(10, 2) করুন (মানগুলোতে হাজারের কমা আছে), আর{" "}
                  <code className={CODE}>paid_on</code> কে date করুন (মানগুলো দিন/মাস/বছর ফরম্যাটে)। যাচাইয়ের Query টা শেষে
                  রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex3_payments;
CREATE TABLE alter_ex3_payments (
  payment_ref text PRIMARY KEY,
  amount      text NOT NULL,
  paid_on     text NOT NULL
);
INSERT INTO alter_ex3_payments VALUES
  ('P-101', '12,500.00', '05/10/2026'),
  ('P-102', '9,500.00',  '18/10/2026'),
  ('P-103', '25,000.00', '30/10/2026');

-- এখানে দুটো ALTER COLUMN ... TYPE ... USING লিখুন

SELECT payment_ref, amount, paid_on,
       pg_typeof(amount)::text  AS amount_type,
       pg_typeof(paid_on)::text AS paid_on_type
FROM alter_ex3_payments
ORDER BY payment_ref;`}
              hint={
                <>
                  amount এর জন্য <code className={CODE}>{"USING replace(amount, ',', '')::numeric"}</code>। paid_on এর জন্য{" "}
                  <code className={CODE}>to_date()</code>, আর ফরম্যাট লেখা হয় <code className={CODE}>{"'DD/MM/YYYY'"}</code>।
                  ভুল করে MM/DD লিখলে 18 নম্বর মাস খুঁজতে গিয়ে Error আসবে।
                </>
              }
              solution={`SELECT *
FROM (VALUES
  ('P-101', 12500.00, '2026-10-05', 'numeric', 'date'),
  ('P-102',  9500.00, '2026-10-18', 'numeric', 'date'),
  ('P-103', 25000.00, '2026-10-30', 'numeric', 'date')
) AS v(payment_ref, amount, paid_on, amount_type, paid_on_type);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "defaults-not-null",
      subHeader: { index: "008", title: "Defaults and NOT NULL" },
      title: <SectionTitle>SET DEFAULT আর SET NOT NULL: আগে Data, পরে নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>ALTER COLUMN city SET DEFAULT &apos;Dhaka&apos;</code> একটা নিয়ম বসায়: এখন থেকে INSERT এ
                city না দিলে Dhaka বসবে। <code className={CODE}>DROP DEFAULT</code> নিয়মটা তুলে নেয়, তখন না দিলে NULL। দুটোরই
                মূল কথা একটাই, আর সেটা ভুলে যাওয়া খুব সহজ: Default শুধু ভবিষ্যতের জন্য। যে Row আগে থেকে আছে, তাতে হাত পড়ে না।
                ADD COLUMN এর Default এর সাথে এখানেই পার্থক্য: সেখানে Column টা নতুন, তাই পুরনো Row গুলোও মানটা পায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Default শুধু নতুন Row এর জন্য"
              query={`DROP TABLE IF EXISTS alter_signups;
CREATE TABLE alter_signups AS
SELECT customer_id, full_name, phone, city
FROM customers;

ALTER TABLE alter_signups ALTER COLUMN city SET DEFAULT 'Dhaka';
INSERT INTO alter_signups (customer_id, full_name) VALUES (101, 'Test Customer');

SELECT customer_id, full_name, city
FROM alter_signups
WHERE customer_id IN (1, 3, 101)
ORDER BY customer_id;

ALTER TABLE alter_signups ALTER COLUMN city DROP DEFAULT;
INSERT INTO alter_signups (customer_id, full_name) VALUES (102, 'Second Test');

SELECT customer_id, city
FROM alter_signups
WHERE customer_id >= 101
ORDER BY customer_id;`}
              caption="Customer 1 এর city Dhaka, 3 এর Chattogram, আগের মতোই; শুধু নতুন 101 পেয়েছে Default এর Dhaka। DROP DEFAULT এর পরে আসা 102 এর city NULL। কোনো পুরনো Row বদলায়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>SET NOT NULL</code> উল্টো দিক থেকে কাজ করে। এটা একটা প্রতিজ্ঞা: এই Column এ কখনো NULL
                থাকবে না, আগেও না, পরেও না। প্রথম অংশ প্রমাণ করতে PostgreSQL প্রতিটা Row পড়ে দেখে, একটা NULL পেলেই পুরো ALTER
                বাতিল। customers এর কপিতে phone এ SET NOT NULL চালালে ঠিক এটাই হয়:{" "}
                <code className={CODE}>column phone of relation alter_signups contains null values</code>, SQLSTATE 23502, কারণ
                পাঁচজনের phone NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান সবসময় একই ক্রমে: আগে Data, পরে নিয়ম। NULL গুলোর কী হবে ঠিক করুন, UPDATE দিয়ে বসান, তারপর SET NOT NULL।
                তারপর NULL ঢোকানোর যেকোনো চেষ্টা থামবে, যেমন{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                এ দেখেছেন। <code className={CODE}>DROP NOT NULL</code> সবসময় সফল, কারণ নিয়ম তুলে নিতে কিছু প্রমাণ লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে Data ঠিক, তারপর NOT NULL"
              query={`DROP TABLE IF EXISTS alter_signups;
CREATE TABLE alter_signups AS
SELECT customer_id, full_name, phone, city
FROM customers;

UPDATE alter_signups SET phone = 'unknown' WHERE phone IS NULL;
ALTER TABLE alter_signups ALTER COLUMN phone SET NOT NULL;

SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'alter_signups'
ORDER BY ordinal_position;

-- নিয়ম এখন পাহারা দিচ্ছে
INSERT INTO alter_signups (customer_id, full_name, city)
VALUES (103, 'No Phone', 'Dhaka');`}
              caption="UPDATE পাঁচটা Row বদলায়, SET NOT NULL এবার সফল, phone এর is_nullable NO। শেষ INSERT এ phone নেই, Default ও নেই, তাই ERROR: null value in column phone of relation alter_signups violates not-null constraint।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "'unknown' কি আসলেই ভালো?",
          content: (
            <ContentParagraph>
              unknown বসানো হয়েছে শুধু কৌশলটা দেখাতে। NULL বলে আমরা জানি না, আর সেটা সত্য; unknown একটা মিথ্যা ফোন নম্বর, যেটা
              কোনো SMS কোড একদিন ডায়াল করতে চাইবে, আর <code className={CODE}>count(phone)</code> বলবে ১৫ জনেরই ফোন আছে। NOT NULL
              বসান তখনই, যখন প্রতিটা পুরনো Row এর সত্যিকারের মান আছে বা ব্যবসা একটা নির্দিষ্ট মানে রাজি।
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
                  <code className={CODE}>alter_ex4_customers</code> এ তিনটা কাজ করুন: phone এর NULL গুলোতে{" "}
                  <code className={CODE}>unknown</code> বসান, phone কে NOT NULL করুন, আর country Column এর Default করুন{" "}
                  <code className={CODE}>Bangladesh</code>। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex4_customers;
CREATE TABLE alter_ex4_customers AS
SELECT customer_id, full_name, phone, country FROM customers;

-- এখানে আপনার UPDATE আর ALTER TABLE লিখুন

SELECT
  (SELECT is_nullable FROM information_schema.columns
   WHERE table_name = 'alter_ex4_customers' AND column_name = 'phone') AS phone_nullable,
  (SELECT column_default FROM information_schema.columns
   WHERE table_name = 'alter_ex4_customers' AND column_name = 'country') AS country_default,
  count(*) FILTER (WHERE phone = 'unknown') AS unknown_phones
FROM alter_ex4_customers;`}
              hint={
                <>
                  ক্রমটাই আসল: UPDATE আগে, SET NOT NULL পরে। উল্টো ক্রমে চালালে contains null values Error। SET NOT NULL আর
                  SET DEFAULT একটা ALTER এ, কমা দিয়ে, লেখা যায়। ফলাফলে country_default দেখাবে{" "}
                  <code className={CODE}>{"'Bangladesh'::text"}</code>।
                </>
              }
              solution={`SELECT 'NO' AS phone_nullable,
       '''Bangladesh''::text' AS country_default,
       5 AS unknown_phones;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "constraints",
      subHeader: { index: "009", title: "Adding and Dropping Constraints" },
      title: <SectionTitle>ADD CONSTRAINT আর DROP CONSTRAINT</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 07, 08 আর 09 এ CHECK, UNIQUE, Primary Key আর Foreign Key বসেছিল CREATE TABLE এর ভেতরে। চালু Table এ
                একই জিনিস বসে <code className={CODE}>ADD CONSTRAINT name ...</code> দিয়ে, ওঠে{" "}
                <code className={CODE}>DROP CONSTRAINT name</code> দিয়ে। নাম নিজে দেওয়া ঐচ্ছিক কিন্তু কাজের: মোছার সময় আর Error
                Message এ সেই নামটাই লাগে। না দিলে PostgreSQL বানায় Table, Column আর একটা শেষাংশ জুড়ে:{" "}
                <code className={CODE}>_pkey</code>, <code className={CODE}>_key</code>, <code className={CODE}>_check</code>,{" "}
                <code className={CODE}>_fkey</code>।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Box এ নিয়মবিহীন একটা Table এ এক ALTER এ তিনটা Constraint বসিয়ে pg_constraint থেকে সব পড়া হয়েছে। ফলাফলে
                একটা চতুর্থ Row ও আসবে, যেটা আপনি লেখেননি: PostgreSQL 18 এর নতুন আচরণ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চালু Table এ তিনটা Constraint"
              query={`DROP TABLE IF EXISTS alter_feedback;
CREATE TABLE alter_feedback (
  feedback_id integer,
  tour_id     integer,
  rating      smallint,
  message     text
);
INSERT INTO alter_feedback VALUES
  (1, 1, 5, 'Great boat'),
  (2, 5, 4, 'Steep trail'),
  (3, 3, 5, 'Saw a deer');

ALTER TABLE alter_feedback
  ADD PRIMARY KEY (feedback_id),
  ADD CONSTRAINT alter_feedback_rating_check CHECK (rating BETWEEN 1 AND 5),
  ADD CONSTRAINT alter_feedback_tour_fk
      FOREIGN KEY (tour_id) REFERENCES tours (tour_id);

SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'alter_feedback'::regclass
ORDER BY conname;

ALTER TABLE alter_feedback DROP CONSTRAINT alter_feedback_rating_check;
ALTER TABLE alter_feedback DROP CONSTRAINT IF EXISTS alter_feedback_rating_check;

SELECT count(*) AS constraints_left
FROM pg_constraint
WHERE conrelid = 'alter_feedback'::regclass;`}
              caption="চারটা Row: alter_feedback_feedback_id_not_null (n), alter_feedback_pkey (p), alter_feedback_rating_check (c), alter_feedback_tour_fk (f), পাশে সংজ্ঞা। CHECK মোছার পরে দ্বিতীয় DROP এ IF EXISTS থাকায় Error নেই, শেষে constraints_left 3।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "PostgreSQL 18: NOT NULL এরও এখন নাম আছে",
          content: (
            <ContentParagraph>
              PostgreSQL 17 পর্যন্ত NOT NULL ছিল Column এর একটা বৈশিষ্ট্য মাত্র, pg_constraint এ তার কোনো Row থাকত না। PostgreSQL 18
              থেকে প্রতিটা NOT NULL একটা পুরো Constraint, contype = &apos;n&apos;, নিজের নাম সহ:{" "}
              <code className={CODE}>table_column_not_null</code>। Primary Key নিজেই NOT NULL দাবি করে, তাই উপরে
              feedback_id এর জন্য একটা তৈরি হয়েছে। নাম থাকার একটা বড় লাভ পরের সেকশনে দেখবেন: NOT NULL কেও এখন NOT VALID করে বসানো
              যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CREATE TABLE এর সময় Table খালি, তাই কোনো Constraint কখনো পুরনো Data র কারণে ব্যর্থ হয় না। ALTER এ উল্টো: প্রতিটা
                নতুন Constraint আগে সব পুরনো Row পরীক্ষা করে, একটাও না মানলে বাতিল। তিন রকম Constraint এর তিন রকম Error:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা বসাতে চাইলেন", "পুরনো Data তে যা ছিল", "PostgreSQL যা বলে"],
          rows: [
            [
              "UNIQUE (city)",
              "একই শহরের একাধিক Customer",
              "ERROR: could not create unique index alter_customers_city_key, DETAIL: Key (city)=(Dhaka) is duplicated। SQLSTATE 23505",
            ],
            [
              "CHECK (phone IS NOT NULL)",
              "পাঁচটা NULL ফোন",
              "ERROR: check constraint alter_customers_phone_check of relation alter_customers is violated by some row। SQLSTATE 23514",
            ],
            [
              "FOREIGN KEY (tour_id) REFERENCES tours",
              "একটা Row এ tour_id 42, অথচ tours এ ৯টা ট্যুর",
              "ERROR: insert or update on table alter_feedback violates foreign key constraint alter_feedback_tour_fk, DETAIL: Key (tour_id)=(42) is not present in table tours। SQLSTATE 23503",
            ],
            [
              "দ্বিতীয় একটা PRIMARY KEY",
              "Table এ আগে থেকেই একটা আছে",
              "ERROR: multiple primary keys for table alter_customers are not allowed। SQLSTATE 42P16",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে খোঁজা, তারপর UNIQUE"
              query={`DROP TABLE IF EXISTS alter_customers;
CREATE TABLE alter_customers AS
SELECT customer_id, full_name, email, phone, city
FROM customers;

-- একই মান একাধিকবার আছে কিনা, আগে দেখে নিন
SELECT email, count(*) FROM alter_customers GROUP BY email HAVING count(*) > 1;
SELECT city,  count(*) FROM alter_customers GROUP BY city  HAVING count(*) > 1 ORDER BY city;

ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_email_key UNIQUE (email);
ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_city_key  UNIQUE (city);`}
              caption="email এর খোঁজে কোনো Row নেই, তাই তার UNIQUE সফল। city র খোঁজে Chattogram 2, Dhaka 6, তাই শেষ লাইনে ERROR: could not create unique index alter_customers_city_key, DETAIL: Key (city)=(Dhaka) is duplicated। যেকোনো UNIQUE এর আগে এই GROUP BY খোঁজাই প্রথম কাজ।"
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
                  <code className={CODE}>alter_ex5_reviews</code> হলো reviews এর একটা কপি, কোনো নিয়ম ছাড়া। একটা ALTER এ তিনটা
                  Constraint বসান: review_id এর উপর Primary Key (নাম PostgreSQL কে দিতে দিন); rating 1 থেকে 5 এর মধ্যে, এই CHECK
                  এর নাম <code className={CODE}>alter_ex5_rating_range</code>; আর একটা Booking এ একটার বেশি Review না, এই UNIQUE
                  এর নাম <code className={CODE}>alter_ex5_one_review_per_booking</code>। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex5_reviews;
CREATE TABLE alter_ex5_reviews AS
SELECT review_id, booking_id, rating, comment FROM reviews;

-- এখানে তিনটা Constraint যোগ করুন

SELECT conname::text AS name, contype::text AS kind
FROM pg_constraint
WHERE conrelid = 'alter_ex5_reviews'::regclass AND contype <> 'n'
ORDER BY conname;`}
              hint={
                <>
                  <code className={CODE}>ADD PRIMARY KEY (review_id)</code>, তারপর কমা,{" "}
                  <code className={CODE}>ADD CONSTRAINT alter_ex5_rating_range CHECK (...)</code>, তারপর কমা,{" "}
                  <code className={CODE}>ADD CONSTRAINT ... UNIQUE (booking_id)</code>। নাম না দিলে UNIQUE এর নাম হতো
                  alter_ex5_reviews_booking_id_key, যেটা এখানে চাওয়া হয়নি।
                </>
              }
              orderMatters
              solution={`SELECT *
FROM (VALUES
  ('alter_ex5_one_review_per_booking', 'u'),
  ('alter_ex5_rating_range', 'c'),
  ('alter_ex5_reviews_pkey', 'p')
) AS v(name, kind)
ORDER BY name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "not-valid",
      subHeader: { index: "010", title: "NOT VALID, then VALIDATE" },
      title: <SectionTitle>পুরনো ভুল রেখেই নতুন নিয়ম: NOT VALID</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের তৃতীয় অনুরোধ: কোনো ট্যুরের দাম যেন আর 0 না হয়। কিন্তু পুরনো Data তে দুটো ট্যুরের দাম আসলেই 0, তাই
                সাধারণ ADD CONSTRAINT ব্যর্থ। ওই দুটোর কী হবে, ঠিক করবেন ফারুক সাহেব, আর তিনি এই সপ্তাহে ব্যস্ত। ততদিন কি নতুন
                ভুলের দরজা খোলা থাকবে?
              </ContentParagraph>
              <ContentParagraph>
                না। <code className={CODE}>NOT VALID</code> ঠিক এই পরিস্থিতির জন্য। Constraint এর শেষে NOT VALID লিখলে PostgreSQL
                পুরনো Row পরীক্ষা করে না, কিন্তু এই মুহূর্ত থেকে প্রতিটা নতুন বা বদলানো Row পরীক্ষা করে। পরে, পুরনো ভুলগুলো ঠিক
                হলে, <code className={CODE}>VALIDATE CONSTRAINT</code> পুরনো Row গুলোও একবার পরীক্ষা করে Constraint কে পুরো বৈধ
                ঘোষণা করে। NOT VALID চলে CHECK আর Foreign Key এ, আর PostgreSQL 18 থেকে NOT NULL এও। UNIQUE আর Primary Key এ চলে
                না, চেষ্টা করলে <code className={CODE}>UNIQUE constraints cannot be marked NOT VALID</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NotValidTimelineDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NotValidLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এর ধাপ ৪ মনে রাখুন: পুরনো ভুল Row এ যেকোনো UPDATE ব্যর্থ, এমনকি যেটা ভুল Column ছোঁয়ই না, কারণ PostgreSQL পুরো
              নতুন Row পরীক্ষা করে। তাই NOT VALID একটা অস্থায়ী অবস্থা, যার শেষে VALIDATE। এবার পুরো পথটা নিজে চালান:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT VALID, খোঁজা, ঠিক করা, VALIDATE"
              query={`DROP TABLE IF EXISTS alter_prices;
CREATE TABLE alter_prices (
  trip_id   integer PRIMARY KEY,
  title     text NOT NULL,
  price_bdt numeric(10, 2) NOT NULL
);
INSERT INTO alter_prices VALUES
  (1, 'Old promo trip', 0),
  (2, 'Sajek weekend', 9500),
  (3, 'Free city walk', 0),
  (4, 'Sundarbans 3 days', 18000);

-- ১) নিয়ম এখনই, পুরনো Row পরে
ALTER TABLE alter_prices
  ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500) NOT VALID;
SELECT conname, convalidated FROM pg_constraint
WHERE conname = 'alter_prices_min_check';

-- ২) পুরনো ভুলগুলো কোথায়
SELECT * FROM alter_prices WHERE NOT (price_bdt >= 500);

-- ৩) ঠিক করা, ৪) VALIDATE
UPDATE alter_prices SET price_bdt = 500 WHERE price_bdt < 500;
ALTER TABLE alter_prices VALIDATE CONSTRAINT alter_prices_min_check;

SELECT conname, convalidated FROM pg_constraint
WHERE conname = 'alter_prices_min_check';`}
              caption="প্রথমে convalidated f, তারপর দুটো ভুল Row (1 আর 3, দাম 0.00), UPDATE দুটো বদলায়, VALIDATE সফল, শেষে convalidated t। খোঁজার শর্ত হুবহু Constraint এর উল্টো, তাই VALIDATE যা খুঁজবে, আপনিও তাই খুঁজছেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL 18 এ NOT NULL ও এভাবে চলে: <code className={CODE}>ADD CONSTRAINT name NOT NULL column NOT VALID</code>, আর
                psql এর <code className={CODE}>{"\\d+"}</code> দেখায় <code className={CODE}>NOT NULL phone NOT VALID</code>। SET
                NOT NULL এর লম্বা Scan তাই দুই ভাগে ভাঙা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL 18: NOT NULL ও NOT VALID"
              query={`DROP TABLE IF EXISTS alter_phonebook;
CREATE TABLE alter_phonebook AS
SELECT customer_id, full_name, phone FROM customers;

ALTER TABLE alter_phonebook
  ADD CONSTRAINT alter_phonebook_phone_not_null NOT NULL phone NOT VALID;

SELECT conname, contype, convalidated
FROM pg_constraint
WHERE conrelid = 'alter_phonebook'::regclass;

SELECT count(*) FILTER (WHERE phone IS NULL) AS old_nulls FROM alter_phonebook;

UPDATE alter_phonebook SET phone = 'unknown' WHERE phone IS NULL;
ALTER TABLE alter_phonebook VALIDATE CONSTRAINT alter_phonebook_phone_not_null;

SELECT conname, convalidated
FROM pg_constraint
WHERE conrelid = 'alter_phonebook'::regclass;`}
              caption="প্রথমে একটা Constraint, contype n, convalidated f, অথচ পাঁচটা NULL তখনো আছে। সেগুলো ঠিক করার পরে VALIDATE সফল, convalidated t।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "fk-not-valid.sql (Foreign Key এ একই পথ, পুরনো Row এ tour_id 42 যে ট্যুর কখনো ছিল না)",
          code: `ALTER TABLE alter_feedback
  ADD CONSTRAINT alter_feedback_tour_fk
  FOREIGN KEY (tour_id) REFERENCES tours (tour_id) NOT VALID;
-- ALTER TABLE  (পুরনো 42 পরীক্ষা হয়নি, নতুন Row এখন থেকে পরীক্ষা হবে)

INSERT INTO alter_feedback VALUES (4, 77, 'new orphan');
-- ERROR:  insert or update on table "alter_feedback" violates foreign key constraint "alter_feedback_tour_fk"
-- DETAIL:  Key (tour_id)=(77) is not present in table "tours".

SELECT f.* FROM alter_feedback f
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.tour_id = f.tour_id);
-- 3 | 42 | Imported from old site

UPDATE alter_feedback SET tour_id = NULL WHERE feedback_id = 3;
ALTER TABLE alter_feedback VALIDATE CONSTRAINT alter_feedback_tour_fk;
-- ALTER TABLE  (VALIDATE এর Lock: alter_feedback এ ShareUpdateExclusiveLock, tours এ RowShareLock)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  <code className={CODE}>alter_ex6_departures</code> এ পুরনো সিস্টেম থেকে আসা দুটো Row এর seats_left ঋণাত্মক।
                  তিনটা ধাপ করুন: <code className={CODE}>alter_ex6_seats_check</code> নামে{" "}
                  <code className={CODE}>CHECK (seats_left &gt;= 0)</code> বসান NOT VALID দিয়ে; ঋণাত্মক মানগুলো 0 করুন; তারপর
                  Constraint টা VALIDATE করুন। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ex6_departures;
CREATE TABLE alter_ex6_departures AS
SELECT departure_id, tour_id, starts_on, seats_left FROM departures;
-- পুরনো সিস্টেম থেকে আসা দুটো ভুল Row
INSERT INTO alter_ex6_departures VALUES
  (17, 2, DATE '2026-03-14', -2),
  (18, 4, DATE '2026-03-21', -1);

-- ধাপ ১: NOT VALID দিয়ে CHECK যোগ করুন
-- ধাপ ২: ভুল Row গুলো ঠিক করুন
-- ধাপ ৩: VALIDATE করুন

SELECT conname::text AS name,
       convalidated,
       (SELECT count(*) FROM alter_ex6_departures WHERE seats_left < 0) AS bad_rows
FROM pg_constraint
WHERE conrelid = 'alter_ex6_departures'::regclass AND contype = 'c';`}
              hint={
                <>
                  ধাপ ২ এর জন্য <code className={CODE}>UPDATE alter_ex6_departures SET seats_left = 0 WHERE seats_left &lt; 0;</code>{" "}
                  ধাপ ৩ এর জন্য <code className={CODE}>ALTER TABLE ... VALIDATE CONSTRAINT alter_ex6_seats_check;</code> শুধু ধাপ ১
                  করে Check চাপলে ফলাফলে convalidated f আর bad_rows 2 দেখবেন, অর্ধেক কাজ।
                </>
              }
              solution={`SELECT 'alter_ex6_seats_check' AS name, true AS convalidated, 0 AS bad_rows;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "transactional-ddl",
      subHeader: { index: "011", title: "ALTER Inside a Transaction" },
      title: <SectionTitle>PostgreSQL এ ALTER ও ফিরিয়ে নেওয়া যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Transaction মানে কয়েকটা কাজকে একটা কাজ হিসেবে চালানো: <code className={CODE}>BEGIN</code> দিয়ে শুরু,{" "}
                <code className={CODE}>COMMIT</code> দিয়ে পাকা, <code className={CODE}>ROLLBACK</code> দিয়ে সব বাতিল (পুরো লেসন
                Module 12 এর{" "}
                <Link href="/sql/topic/transactions-basics" className={LINK}>
                  BEGIN, COMMIT, ROLLBACK and SAVEPOINT
                </Link>
                )। PostgreSQL এ DDL ও Transaction এর অংশ: BEGIN এর পরে ALTER চালিয়ে ROLLBACK করলে ALTER ও উধাও।
              </ContentParagraph>
              <ContentParagraph>
                তাই এই লেসনে আসল Sample Table এ হাত পড়ে শুধু BEGIN আর ROLLBACK এর মাঝে। নিচে আসল tours এ ফারুক সাহেবের দ্বিতীয়
                অনুরোধ পুরো চালিয়ে, ফলাফল দেখে, সব ফেরত দেওয়া হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আসল tours এ ALTER, তারপর ROLLBACK"
              query={`BEGIN;

ALTER TABLE tours ADD COLUMN difficulty text NOT NULL DEFAULT 'easy';
UPDATE tours SET difficulty = 'hard' WHERE duration_days >= 4;

SELECT tour_id, title, duration_days, difficulty
FROM tours
ORDER BY tour_id;

ROLLBACK;

-- ROLLBACK এর পরে: Column টা আছে কি?
SELECT count(*) AS difficulty_columns
FROM information_schema.columns
WHERE table_name = 'tours' AND column_name = 'difficulty';`}
              caption="মাঝের Table এ ৯টা ট্যুর, চার দিনের Bandarban Hill Trek আর Saint Martin Luxury Stay hard, বাকি সাত easy। ROLLBACK এর পরে difficulty_columns 0: Column, Default, UPDATE করা মান, সব ফেরত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর একটা খুব কাজের ব্যবহার: আসল Data তে Migration এর মহড়া। পুরো Migration BEGIN আর ROLLBACK এর মাঝে চালান, Error আর
                ফলাফল দেখুন, psql এ <code className={CODE}>{"\\timing on"}</code> দিয়ে সময় মাপুন। সেকশন ১৪ তে ঠিক এটাই করা হয়েছে।
                সতর্কতা: মহড়ার Lock ও আসল, তাই চালু Production এ নয়, তার একটা কপিতে (Staging) মহড়া দেবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "MySQL এ এটা হয় না",
          content: (
            <ContentParagraph>
              MySQL এ প্রায় প্রতিটা DDL চালানোর আগে চুপচাপ একটা COMMIT করে, যার নাম Implicit Commit। তাই START TRANSACTION এর পরে
              ALTER চালালে আগের কাজ তখনই পাকা, আর ALTER নিজেও ROLLBACK এ ফেরে না। mysql:8.4 এর আসল Output সেকশন ১৩ তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "production",
      subHeader: { index: "012", title: "ALTER on a Busy Production Table" },
      title: <SectionTitle>চালু সাইটে ALTER: Lock, Rewrite আর লাইনের ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ সব ALTER চলেছে এমন Table এ, যেখানে আপনি ছাড়া কেউ নেই। চালু সাইটে একই মুহূর্তে শত শত Query একই Table
                পড়ছে আর লিখছে, আর Database তাদের শৃঙ্খলা রাখে Lock দিয়ে। Lock মানে একটা Table এর উপর একটা দাবি: আমি কাজ করছি, আমার
                কাজের সাথে যে কাজ মেলে না, সে অপেক্ষা করুক।
              </ContentParagraph>
              <ContentParagraph>
                সাধারণ SELECT নেয় সবচেয়ে হালকা Lock, AccessShareLock। বেশিরভাগ ALTER নেয় সবচেয়ে কড়া Lock, AccessExclusiveLock,
                যেটা কারও সাথে মেলে না, SELECT এর সাথেও না: গঠন বদলানোর মাঝে কেউ অর্ধেক পুরনো অর্ধেক নতুন গঠন পড়ুক, PostgreSQL তা
                হতে দেয় না। নিচের Box এ দুটো Lock দেখুন। pg_locks হলো সেই System View, যেখানে এই মুহূর্তে কে কোন Lock ধরে আছে লেখা
                থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ALTER কোন Lock নেয়, SELECT কোনটা"
              query={`-- ১) একটা ছোট ADD COLUMN
BEGIN;
ALTER TABLE tours ADD COLUMN difficulty text;
SELECT mode, granted FROM pg_locks WHERE relation = 'tours'::regclass;
ROLLBACK;

-- ২) একটা সাধারণ SELECT
BEGIN;
SELECT count(*) FROM tours;
SELECT mode, granted FROM pg_locks WHERE relation = 'tours'::regclass;
ROLLBACK;`}
              caption="প্রথমটায় AccessExclusiveLock, দ্বিতীয়টায় AccessShareLock। Transaction শেষ না হওয়া পর্যন্ত Lock ধরা থাকে, তাই BEGIN এর ভেতরে দেখা যায়। দুটোই ROLLBACK, tours অক্ষত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AlterCostLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ALTER এর দাম তাই দুটো জিনিসের গুণফল: কোন Lock, আর কতক্ষণ। এক মুহূর্তের AccessExclusiveLock কেউ টের পায় না, কিন্তু
                Rewrite চলার পুরো সময় সেই Lock ধরা থাকলে ততক্ষণ Table বন্ধ। লেখার সময় postgres:18 Container এ দশ লাখ Row এর (50
                MB) Table এ মাপা: ধ্রুব Default সহ ADD COLUMN 0.7 ms, SET NOT NULL এর Scan 33 ms, smallint থেকে integer 362 ms,
                gen_random_uuid() Default সহ ADD COLUMN 941 ms। দশ কোটি Row হলে শেষ দুটো মিনিটের ঘরে।
              </ContentParagraph>
              <ContentParagraph>
                Rewrite হলো কিনা তার প্রমাণ <code className={CODE}>pg_relation_filenode()</code>: Table এর Data কোন File নম্বরে
                আছে। Rewrite মানে নতুন File, তাই নম্বর বদলায়। নিচের Box প্রতিটা ALTER এর পরে নম্বরটা একটা খাতায় লেখে, শেষে Module
                08 এর{" "}
                <Link href="/sql/topic/lag-lead" className={LINK}>
                  LAG
                </Link>{" "}
                দিয়ে আগের নম্বরের সাথে মেলায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন ALTER Table নতুন করে লিখল"
              query={`DROP TABLE IF EXISTS alter_rw_log;
DROP TABLE IF EXISTS alter_rw;
CREATE TABLE alter_rw AS
SELECT booking_id, seats, status, total_bdt FROM bookings;
CREATE TABLE alter_rw_log (step_no integer, step text, file_no oid);

INSERT INTO alter_rw_log VALUES (0, 'শুরু', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw ADD COLUMN note text;
INSERT INTO alter_rw_log VALUES (1, 'ADD COLUMN, Default ছাড়া', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw ADD COLUMN is_paid boolean NOT NULL DEFAULT false;
INSERT INTO alter_rw_log VALUES (2, 'ADD COLUMN, DEFAULT false', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw RENAME COLUMN note TO staff_note;
INSERT INTO alter_rw_log VALUES (3, 'RENAME COLUMN', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw ALTER COLUMN seats TYPE integer;
INSERT INTO alter_rw_log VALUES (4, 'seats: smallint থেকে integer', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw ALTER COLUMN status SET NOT NULL;
INSERT INTO alter_rw_log VALUES (5, 'SET NOT NULL', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw ADD COLUMN ref uuid NOT NULL DEFAULT gen_random_uuid();
INSERT INTO alter_rw_log VALUES (6, 'ADD COLUMN, DEFAULT gen_random_uuid()', pg_relation_filenode('alter_rw'));
ALTER TABLE alter_rw DROP COLUMN staff_note;
INSERT INTO alter_rw_log VALUES (7, 'DROP COLUMN', pg_relation_filenode('alter_rw'));

SELECT step_no, step,
       file_no <> lag(file_no) OVER (ORDER BY step_no) AS rewritten
FROM alter_rw_log
ORDER BY step_no;`}
              caption="আটটা Row। rewritten t শুধু ধাপ ৪ (smallint থেকে integer) আর ধাপ ৬ (gen_random_uuid() Default) এ, বাকি সব f, SET NOT NULL ও (সে পড়ে, লেখে না)। ধাপ ০ খালি, তুলনার কেউ নেই। File নম্বর আপনার Box এ আলাদা হতে পারে, বদলেছে কিনা সেটাই আসল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই বিপদ, যেটা বেশিরভাগ মানুষ প্রথমবার Production এ শেখেন। এক বৃহস্পতিবার দুপুরে তানিম tours এ Default
                ছাড়া একটা Column যোগ করলেন, এক মুহূর্তের কাজ। অথচ পরের দশ সেকেন্ড সাইট সাড়া দিল না, কারণ ঠিক তখন শারমিন আপার
                মাসিক রিপোর্ট একটা লম্বা Transaction এ tours পড়ছিল।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Lock এর লাইন ন্যায্য: কেউ লাইন ভেঙে আগে যায় না। রিপোর্টের কারণে ALTER অপেক্ষায়, আর তারপর আসা প্রতিটা
                SELECT রিপোর্টের সাথে মিললেও দাঁড়াল ALTER এর পেছনে। এক মুহূর্তের ALTER পুরো সাইটকে রিপোর্টের সমান লম্বা অপেক্ষায়
                ফেলল। Lab এ ধাপে ধাপে দেখুন, তারপর lock_timeout দিয়ে আবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LockQueueLab />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "lock-queue.psql (postgres:18, চারটা psql Session)",
          code: `-- Session A: রিপোর্ট, একটা খোলা Transaction এ ১২ সেকেন্ড
BEGIN;
SELECT count(*) FROM alter_busy;
SELECT pg_sleep(12);

-- Session B: lock_timeout সহ ALTER
SET lock_timeout = '2s';
ALTER TABLE alter_busy ADD COLUMN note text;
-- ERROR:  canceling statement due to lock timeout

-- Session C আর D: lock_timeout ছাড়া ALTER, তার পেছনে একটা SELECT
-- পঞ্চম একটা Session থেকে তখন দেখা গেল:
SELECT a.pid, l.mode, l.granted, left(a.query, 40) AS query
FROM pg_locks l JOIN pg_stat_activity a USING (pid)
WHERE l.relation = 'alter_busy'::regclass;
--  pid |        mode         | granted |                  query
-- -----+---------------------+---------+------------------------------------------
--  131 | AccessShareLock     | t       | SELECT pg_sleep(12);
--  145 | AccessExclusiveLock | f       | ALTER TABLE alter_busy ADD COLUMN note2
--  152 | AccessShareLock     | f       | SELECT count(*) FROM alter_busy;

-- রিপোর্ট শেষ হওয়ার পরে, \\timing দিয়ে মাপা:
-- ALTER TABLE alter_busy ADD COLUMN note2 text;   Time: 8177.174 ms
-- SELECT count(*) FROM alter_busy;                Time: 7686.803 ms   (২৪ Row এর Table!)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>SET lock_timeout = &apos;2s&apos;</code> বলে: Lock পেতে দুই সেকেন্ডের বেশি অপেক্ষা নয়, না
                পেলে নিজে থেকে বাতিল। ALTER ব্যর্থ হতে পারে, কিন্তু সাইট থামে বড়জোর দুই সেকেন্ড, আর পরে আবার চেষ্টা করা যায়। পেশাদার
                দলগুলো চালু Database এ প্রতিটা ALTER এর আগে এটা দেয়, সাথে একটা ছোট Retry। বাকি নিরাপদ অভ্যাসগুলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা করতে চান", "সরাসরি করলে বিপদ", "নিরাপদ পথ"],
          rows: [
            [
              "Default সহ নতুন Column",
              "Default যদি প্রতি Row এ আলাদা (gen_random_uuid()), পুরো Rewrite",
              "ধ্রুব Default দিন, বা Default ছাড়া যোগ করে পরে ছোট ছোট ভাগে UPDATE",
            ],
            [
              "নতুন CHECK বা Foreign Key",
              "পুরো Scan কড়া Lock ধরে",
              "ADD ... NOT VALID, পুরনো ভুল ঠিক, তারপর VALIDATE CONSTRAINT",
            ],
            [
              "SET NOT NULL",
              "পুরো Scan, AccessExclusiveLock ধরে",
              "CHECK (col IS NOT NULL) NOT VALID, VALIDATE, তারপর SET NOT NULL, শেষে CHECK মোছা। VALIDATE করা CHECK থাকলে SET NOT NULL আর Table পড়ে না (psql এর debug1 এ: existing constraints ... are sufficient to prove ...)। PostgreSQL 18 এ সরাসরি NOT NULL ... NOT VALID",
            ],
            [
              "Column এর Type বদল",
              "পুরো Rewrite, সব Index নতুন করে, পুরো সময় Lock",
              "নতুন Column যোগ, ছোট ভাগে কপি, কোড বদল, পুরনো Column মোছা",
            ],
            [
              "Column বা Table এর নাম বদল",
              "Database এ এক মুহূর্ত, কিন্তু চালু পুরনো কোড সাথে সাথে ভাঙে",
              "Expand and Contract (নিচের ছবি), বা সাময়িকভাবে পুরনো নামে View",
            ],
            [
              "UNIQUE বা Primary Key",
              "Index বানানোর পুরো সময় লেখা বন্ধ",
              "CREATE UNIQUE INDEX CONCURRENTLY, তারপর ADD CONSTRAINT ... UNIQUE USING INDEX (Module 13)",
            ],
            [
              "যেকোনো ALTER",
              "লম্বা Query এর পেছনে আটকে সাইট থামানো",
              "SET lock_timeout, ব্যর্থ হলে আবার চেষ্টা, ভিড় কম এমন সময়ে চালানো",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ExpandContractDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Migration: হাতে লেখা ALTER নয়, কোডের মতো ফাইল",
          content: (
            <ContentParagraph>
              বাস্তব দলে কেউ Production এ হাতে ALTER লেখেন না। প্রতিটা বদল একটা নম্বর দেওয়া ফাইল, যার নাম Migration, Git এ কোডের পাশে
              রাখা। একটা Tool সেই ফাইলগুলো ক্রমানুসারে চালায়, মনে রাখে কোনগুলো চলেছে, আর Development, Staging, Production সব জায়গায়
              একই ক্রমে একই বদল পৌঁছায়। এই লেসনের সব কৌশল, lock_timeout, NOT VALID, Expand and Contract, সেই ফাইলগুলোর ভেতরেই
              লেখা হয়। পুরো গল্প Module 17 এর{" "}
              <Link href="/sql/topic/migrations" className={LINK}>
                Migrations and Zero-downtime Schema Changes
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ ALTER: MODIFY, CHANGE আর Implicit Commit</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ADD COLUMN, DROP COLUMN, RENAME COLUMN (8.0 থেকে), ADD CONSTRAINT, ALTER COLUMN SET DEFAULT, এগুলো MySQL এ প্রায় একই
                রকম। পার্থক্য শুরু হয় Column এর Type বদলাতে গিয়ে। MySQL এ <code className={CODE}>ALTER COLUMN ... TYPE</code> নেই,
                লিখলে Syntax Error। তার বদলে দুটো শব্দ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>MODIFY:</strong> <code className={CODE}>MODIFY city VARCHAR(80)</code>। Column এর পুরো সংজ্ঞা নতুন করে
                  লেখে। পুরো, মানে NOT NULL, DEFAULT, COMMENT, যা যা আগে ছিল, সব আবার লিখতে হয়। যা লিখবেন না, তা হারাবে।
                </ListItem>
                <ListItem>
                  <strong>CHANGE:</strong> <code className={CODE}>CHANGE whatsapp whatsapp_no VARCHAR(20)</code>। পুরনো নাম, নতুন নাম,
                  তারপর পুরো সংজ্ঞা। নাম আর সংজ্ঞা একসাথে বদলায়, আর এখানেও পুরো সংজ্ঞা আবার লেখার নিয়ম।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর বাইরে MySQL এ এমন কিছু আছে যা PostgreSQL এ নেই: Column কোথায় বসবে সেটা <code className={CODE}>AFTER col</code>{" "}
                বা <code className={CODE}>FIRST</code> দিয়ে বলা যায়; আর <code className={CODE}>ALGORITHM</code> আর{" "}
                <code className={CODE}>LOCK</code> দিয়ে আপনি দাবি করতে পারেন কাজটা কীভাবে হবে। INSTANT মানে শুধু Metadata বদল;
                INPLACE মানে InnoDB কাজটা নিজের ভেতরে করে, সাধারণত চলার সময় লেখা না থামিয়ে, যদিও ভেতরে Table নতুন করে বানাতে
                পারে; COPY মানে পুরো Table একটা নতুন কপিতে, চলার সময় লেখা বন্ধ। দাবি পূরণ করা না গেলে MySQL কাজ শুরুই করে না, Error
                দেয়। এটা একটা ভালো সুরক্ষা: Production এ <code className={CODE}>ALGORITHM=INSTANT</code> লিখলে ভুল করে লম্বা কপি
                চালানোর ভয় থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "alter-in-mysql.sql (mysql:8.4, আসল Output)",
          code: `ALTER TABLE alter_customers ADD COLUMN whatsapp VARCHAR(20) AFTER phone, ALGORITHM=INSTANT;
-- Query OK, 0 rows affected
ALTER TABLE alter_customers ADD COLUMN vip BOOLEAN NOT NULL DEFAULT FALSE FIRST, ALGORITHM=INSTANT;
-- Query OK, 0 rows affected

-- MODIFY এর ফাঁদ: প্রথমে পুরো সংজ্ঞা
ALTER TABLE alter_customers MODIFY city VARCHAR(60) NOT NULL DEFAULT 'Dhaka' COMMENT 'home city';
-- Query OK, 15 rows affected
--   \`city\` varchar(60) NOT NULL DEFAULT 'Dhaka' COMMENT 'home city',
-- তারপর শুধু Type বদলাতে চেয়ে
ALTER TABLE alter_customers MODIFY city VARCHAR(80);
-- Query OK, 15 rows affected
--   \`city\` varchar(80) DEFAULT NULL,        <- NOT NULL, DEFAULT, COMMENT সব হারাল

ALTER TABLE alter_customers CHANGE whatsapp whatsapp_no VARCHAR(20);
-- Query OK, 0 rows affected
ALTER TABLE alter_customers RENAME COLUMN whatsapp_no TO wa_number;
-- Query OK, 0 rows affected

ALTER TABLE alter_customers MODIFY city VARCHAR(5);
-- ERROR 1406 (22001): Data too long for column 'city' at row 3
ALTER TABLE alter_customers MODIFY city INT;
-- ERROR 1366 (HY000): Incorrect integer value: 'Dhaka' for column 'city' at row 1

ALTER TABLE alter_customers MODIFY customer_id BIGINT, ALGORITHM=INSTANT;
-- ERROR 1846 (0A000): ALGORITHM=INSTANT is not supported. Reason: Need to rebuild
--   the table to change column type. Try ALGORITHM=COPY/INPLACE.
ALTER TABLE alter_customers MODIFY customer_id BIGINT NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
-- ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason: Cannot change
--   column type INPLACE. Try ALGORITHM=COPY.

ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_phone_check CHECK (phone IS NOT NULL);
-- ERROR 3819 (HY000): Check constraint 'alter_customers_phone_check' is violated.
ALTER TABLE alter_customers ADD CONSTRAINT alter_customers_x CHECK (city <> '') NOT VALID;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'VALID'
ALTER TABLE alter_customers ALTER COLUMN city TYPE text;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'TYPE text'

RENAME TABLE alter_customers TO alter_clients;
-- Query OK, 0 rows affected
ALTER TABLE alter_clients RENAME TO alter_customers;
-- Query OK, 0 rows affected`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস সবচেয়ে বেশি সাবধানতা চায়। প্রথমটা Strict Mode। MySQL 8.4 এর Default sql_mode এ STRICT_TRANS_TABLES
                আছে, তাই উপরের VARCHAR(5) Error দিয়েছে। Strict Mode বন্ধ থাকা Server এ একই ALTER শুধু Warning দিয়ে মান কেটে ফেলে।
                লেখার সময় <code className={CODE}>{"SET SESSION sql_mode = ''"}</code> দিয়ে চালানো হয়েছিল:{" "}
                <code className={CODE}>Query OK, 15 rows affected, 9 warnings</code>, আর Chattogram হলো Chatt, Sylhet হলো Sylhe।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা Implicit Commit, যেটা সেকশন ১১ তে বলা হয়েছিল। নিচে একই কাজ দুই Database এ, পাশাপাশি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "implicit-commit.sql (mysql:8.4 বনাম postgres:18)",
          code: `-- দুই জায়গাতেই একই কাজ
CREATE TABLE alter_tx (id INT PRIMARY KEY, note VARCHAR(20));
START TRANSACTION;                                   -- PostgreSQL এ BEGIN;
INSERT INTO alter_tx VALUES (1, 'before alter');
ALTER TABLE alter_tx ADD COLUMN extra INT;
INSERT INTO alter_tx VALUES (2, 'after alter', 5);
ROLLBACK;
SELECT * FROM alter_tx;

-- MySQL 8.4:
-- +----+--------------+-------+
-- | id | note         | extra |
-- +----+--------------+-------+
-- |  1 | before alter |  NULL |      <- ALTER এর আগেই চুপচাপ COMMIT হয়েছিল
-- |  2 | after alter  |     5 |      <- ALTER এর পরে Transaction ই ছিল না
-- +----+--------------+-------+
-- আর SHOW COLUMNS এ extra Column টাও আছে

-- PostgreSQL 18:
--  id | note
-- ----+------
-- (0 rows)                            <- দুটো INSERT আর ALTER, তিনটাই ফেরত`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>ফারুক সাহেবের তিন অনুরোধ, একটা Migration এ</SectionTitle>,
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
                এবার সব একসাথে: তিন অনুরোধ একটা Migration এ, আসল Table এ। আসল দিনে শেষ লাইন হতো COMMIT, এখানে মহড়া, তাই
                ROLLBACK।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>tours:</strong> difficulty, Default easy, শুধু তিনটা মান; ৪ দিন বা বেশি hard, ৩ দিনের moderate।
                </ListItem>
                <ListItem>
                  <strong>customers:</strong> whatsapp, আপাতত যাঁদের ফোন আছে তাঁদের ফোন নম্বর।
                </ListItem>
                <ListItem>
                  <strong>bookings:</strong> total_bdt কখনো শূন্য বা ঋণাত্মক না, NOT VALID দিয়ে বসিয়ে VALIDATE।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Migration এর মহড়া, আসল Table এ"
              query={`BEGIN;

-- ১) ট্যুরের কঠিনতা
ALTER TABLE tours
  ADD COLUMN difficulty text NOT NULL DEFAULT 'easy',
  ADD CONSTRAINT tours_difficulty_check
      CHECK (difficulty IN ('easy', 'moderate', 'hard'));
UPDATE tours SET difficulty = 'hard'     WHERE duration_days >= 4;
UPDATE tours SET difficulty = 'moderate' WHERE duration_days = 3;

-- ২) WhatsApp
ALTER TABLE customers ADD COLUMN whatsapp text;
UPDATE customers SET whatsapp = phone WHERE phone IS NOT NULL;

-- ৩) দাম কখনো শূন্য না
ALTER TABLE bookings
  ADD CONSTRAINT bookings_total_positive CHECK (total_bdt > 0) NOT VALID;
ALTER TABLE bookings VALIDATE CONSTRAINT bookings_total_positive;

-- যাচাই
SELECT difficulty, count(*) AS tours
FROM tours GROUP BY difficulty ORDER BY difficulty;

SELECT count(whatsapp) AS with_whatsapp, count(*) AS customers
FROM customers;

SELECT conname, convalidated
FROM pg_constraint
WHERE conname = 'bookings_total_positive';

ROLLBACK;`}
              caption="tours এ easy 4, hard 2, moderate 3। with_whatsapp 10, customers 15 (পাঁচজনের ফোন NULL)। bookings_total_positive এর convalidated t: ২৪টা Booking এর একটাও শূন্য বা ঋণাত্মক না। তারপর ROLLBACK।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              লক্ষ করুন, এই Migration এর কোনো অংশ পুরো Table নতুন করে লেখেনি: difficulty এর Default ধ্রুব, whatsapp এর কোনো Default
              নেই, CHECK বসেছে NOT VALID দিয়ে। Production এ শুরুতে একটা <code className={CODE}>SET lock_timeout</code> যোগ করলেই
              এটা চালু সাইটে চালানোর মতো। এবার আপনার পালা, একটা কপিতে, পাঁচটা বদল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  Starter এ tours এর একটা কপি আছে, <code className={CODE}>alter_ch_tours</code>, কোনো নিয়ম ছাড়া। পাঁচটা বদল
                  করুন: (১) tour_id এর উপর Primary Key, নাম PostgreSQL এর দেওয়া; (২){" "}
                  <code className={CODE}>difficulty</code> Column, text, NULL চলবে না, Default easy; (৩) difficulty তে শুধু easy,
                  moderate, hard চলবে, এই CHECK এর নাম <code className={CODE}>alter_ch_tours_difficulty_check</code>; (৪) ৪ দিন বা
                  তার বেশি দিনের ট্যুরের difficulty hard; (৫) <code className={CODE}>max_seats</code> এর Type integer আর নাম{" "}
                  <code className={CODE}>seat_limit</code>। যাচাইয়ের Query টা শেষে রাখুন।
                </>
              }
              starter={`DROP TABLE IF EXISTS alter_ch_tours;
CREATE TABLE alter_ch_tours AS
SELECT tour_id, title, duration_days, price_bdt, max_seats FROM tours;

-- এখানে ফারুক সাহেবের পাঁচটা বদল লিখুন

SELECT
  (SELECT string_agg(column_name || ' ' || data_type, ', ' ORDER BY ordinal_position)
   FROM information_schema.columns
   WHERE table_name = 'alter_ch_tours') AS columns,
  (SELECT string_agg(conname, ', ' ORDER BY conname)
   FROM pg_constraint
   WHERE conrelid = 'alter_ch_tours'::regclass AND contype IN ('c', 'p')) AS constraints,
  (SELECT count(*) FROM alter_ch_tours WHERE difficulty = 'hard') AS hard_tours;`}
              hint={
                <>
                  একটা ALTER এ ADD PRIMARY KEY, ADD COLUMN, ADD CONSTRAINT আর ALTER COLUMN max_seats TYPE integer, সব কমা দিয়ে।
                  তারপর UPDATE দিয়ে hard। শেষে আলাদা Statement এ RENAME COLUMN, কারণ RENAME দলে মেশে না। ফলাফলে hard_tours 2।
                  difficulty Column বানানোর আগেই Check চাপলে যাচাইয়ের Query টাই column difficulty does not exist বলবে।
                </>
              }
              solution={`SELECT
  'tour_id integer, title text, duration_days smallint, price_bdt numeric, seat_limit integer, difficulty text' AS columns,
  'alter_ch_tours_difficulty_check, alter_ch_tours_pkey' AS constraints,
  2 AS hard_tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা চালু Table বদলানোর আট ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "বদলটা এক বাক্যে লিখুন",
              description:
                "কোন Table, কোন Column, আগে কী, পরে কী, আর পুরনো Row গুলো কী পাবে: NULL, Default, নাকি হিসাব করা মান।",
            },
            {
              title: "পুরনো Data এর খোঁজ নিন",
              description:
                "নতুন নিয়ম যা নিষেধ করবে, আগে SELECT দিয়ে খুঁজুন: NULL গোনা, HAVING count(*) > 1, WHERE NOT (শর্ত)। শূন্য না হলে আগে সিদ্ধান্ত।",
            },
            {
              title: "খরচটা চিনে নিন",
              description:
                "শুধু Catalog, পুরো Scan, নাকি Rewrite? কোন Lock? সন্দেহ হলে কপিতে pg_relation_filenode আর \\timing দিয়ে মাপুন।",
            },
            {
              title: "নিরাপদ রূপ বেছে নিন",
              description:
                "Scan হলে NOT VALID আর পরে VALIDATE। Rewrite হলে নতুন Column আর ধাপে ধাপে কপি। নাম বদলে Expand and Contract।",
            },
            {
              title: "মহড়া দিন",
              description:
                "BEGIN, পুরো Migration, যাচাইয়ের SELECT, ROLLBACK। Error নেই আর ফলাফল আন্দাজের সাথে মেলে, তবেই এগোন।",
            },
            {
              title: "Migration ফাইলে লিখুন",
              description:
                "হাতে চালানো নয়: নম্বর দেওয়া ফাইল, Git এ, Review সহ। শুরুতে SET lock_timeout, প্রতিটা Constraint এর নিজের নাম।",
            },
            {
              title: "চালান, নজর রাখুন, দরকারে আবার",
              description:
                "ভিড় কম এমন সময়ে চালান। lock timeout এ ব্যর্থ হলে pg_stat_activity তে লম্বা Query টা খুঁজুন, পরে আবার চালান।",
            },
            {
              title: "শেষে যাচাই, তারপর পরিষ্কার",
              description:
                "গঠন, convalidated, App এর লগ দেখুন। সব ঠিক থাকলে সাময়িক View, পুরনো Column আর সাহায্যকারী CHECK মুছে দিন।",
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
              "Default ছাড়া NOT NULL Column যোগ",
              "column ... contains null values, SQLSTATE 23502",
              "ধ্রুব Default দিন, অথবা আগে NULL রাখার মতো যোগ করে ভরুন, তারপর SET NOT NULL",
            ],
            [
              "SET DEFAULT দিয়ে পুরনো NULL ভরার আশা",
              "কোনো Error নেই, কিন্তু পুরনো Row আগের মতোই NULL",
              "Default শুধু ভবিষ্যতের INSERT এর জন্য। পুরনো Row এর জন্য UPDATE",
            ],
            [
              "numeric বা integer এ Type ছোট করা, না দেখে",
              "চুপচাপ Round: 99.995 থেকে 100.00, তারপর 100",
              "আগে WHERE col <> round(col, 2) দিয়ে গুনুন, সিদ্ধান্ত নিন, তারপর বদলান",
            ],
            [
              "text থেকে সংখ্যা বা তারিখে USING ছাড়া",
              "cannot be cast automatically, সাথে USING এর HINT",
              "USING দিয়ে সূত্র লিখুন, আর অদ্ভুত মান আগে খুঁজে ঠিক করুন",
            ],
            [
              "নাম বদলে App এর কোড ভুলে যাওয়া",
              "Database চুপ, App এ relation does not exist বা column does not exist",
              "Expand and Contract, অথবা সাময়িকভাবে পুরনো নামে View",
            ],
            [
              "NOT VALID বসিয়ে VALIDATE ভুলে যাওয়া",
              "convalidated f চিরকাল, পুরনো ভুল Row এ যেকোনো UPDATE ব্যর্থ",
              "NOT VALID একটা অস্থায়ী ধাপ। ভুল ঠিক করে VALIDATE CONSTRAINT",
            ],
            [
              "চালু সাইটে lock_timeout ছাড়া ALTER",
              "লম্বা Query এর পেছনে ALTER, ALTER এর পেছনে পুরো সাইট",
              "SET lock_timeout = '2s', ব্যর্থ হলে আবার চেষ্টা",
            ],
            [
              "PostgreSQL এর মতো লিখতে গিয়ে AFTER, বা MySQL এর অভ্যাসে MODIFY",
              "syntax error at or near AFTER বা MODIFY",
              "PostgreSQL এ Column সবসময় শেষে, Type বদল ALTER COLUMN ... TYPE দিয়ে",
            ],
            [
              "MySQL এ MODIFY দিয়ে শুধু Type বদল",
              "NOT NULL, DEFAULT, COMMENT চুপচাপ হারায়",
              "MODIFY তে পুরো সংজ্ঞা আবার লিখুন, আগে SHOW CREATE TABLE দেখে",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MySQL এর অভ্যাস PostgreSQL এ"
              query={`ALTER TABLE alter_customers ADD COLUMN whatsapp2 text AFTER phone;`}
              caption="ERROR: syntax error at or near AFTER। Table আছে কিনা দেখার আগেই PostgreSQL থামে, কারণ এই লেখা তার ভাষাতেই নেই। AFTER phone মুছে চালালে Column টা সবার শেষে বসবে। MODIFY লিখলেও একই রকম Syntax Error।"
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
                    href="https://www.postgresql.org/docs/current/sql-altertable.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: ALTER TABLE
                  </a>
                  : প্রতিটা Action, কোনটা কোন Lock নেয়, কোনটা Table নতুন করে লেখে, আর NOT VALID এর নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/ddl-alter.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Modifying Tables
                  </a>
                  : একই বিষয়ের সহজ Tutorial, ছোট ছোট উদাহরণ সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/explicit-locking.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Explicit Locking
                  </a>
                  : আটটা Table Lock আর কোনটা কোনটার সাথে মেলে না তার ছক।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/18.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : NOT NULL এর নাম পাওয়া, NOT NULL এর NOT VALID, আর NOT ENFORCED।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/11.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 11 Release Notes
                  </a>
                  : কবে থেকে ধ্রুব Default সহ ADD COLUMN Table নতুন করে লেখে না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/alter-table.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: ALTER TABLE Statement
                  </a>
                  : MODIFY, CHANGE, RENAME COLUMN, AFTER, FIRST, ALGORITHM আর LOCK।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Online DDL Operations
                  </a>
                  : প্রতিটা ALTER এর জন্য INSTANT, INPLACE নাকি COPY, আর চলার সময় লেখা চলে কিনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Statements That Cause an Implicit Commit
                  </a>
                  : কোন কোন Statement চুপচাপ COMMIT করে, ALTER TABLE সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://github.com/ankane/strong_migrations"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    strong_migrations (GitHub)
                  </a>
                  : Rails এর জন্য লেখা, কিন্তু README টা সবার কাজের: কোন ALTER চালু Database এ বিপজ্জনক আর তার নিরাপদ বিকল্প।
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
                  ALTER TABLE চালু Table এর গঠন বদলায়, Row গুলো রেখে। একটা Statement এ একটা Table, কমা দিয়ে অনেক Action, সব একসাথে
                  হয় বা একটাও না। RENAME একা চলে।
                </ListItem>
                <ListItem>
                  ADD COLUMN সবসময় শেষে বসে। Default না থাকলে পুরনো Row এ NULL, ধ্রুব Default থাকলে সবাই সেটা পায়, আর PostgreSQL 11
                  থেকে সেটা এক মুহূর্তের কাজ। Default ছাড়া NOT NULL মানে 23502।
                </ListItem>
                <ListItem>
                  DROP COLUMN এর Undo নেই, Column এর Index আর Constraint সাথে যায়, আর কোনো View নির্ভর করলে PostgreSQL থামায়।
                </ListItem>
                <ListItem>
                  RENAME Database এর ভেতরে নিরাপদ, কারণ সবাই OID দিয়ে চেনে। পুরনো নাম থেকে বানানো Constraint আর Index এর নাম, আর
                  বাইরের কোড, পেছনে থেকে যায়।
                </ListItem>
                <ListItem>
                  ALTER COLUMN TYPE সম্ভব হলে নিজেই রূপান্তর করে, আর তাতে চুপচাপ Round ও হয়। text থেকে সংখ্যা বা তারিখে USING লাগে,
                  আর একটা Row না মিললে পুরো ALTER বাতিল।
                </ListItem>
                <ListItem>
                  SET DEFAULT শুধু ভবিষ্যতের জন্য। SET NOT NULL প্রতিটা Row পড়ে প্রমাণ চায়। দুই ক্ষেত্রেই নিয়ম: আগে Data, পরে নিয়ম।
                </ListItem>
                <ListItem>
                  নতুন Constraint পুরনো Data পরীক্ষা করে। NOT VALID দিয়ে নতুন Row এখনই পাহারায়, পুরনো ভুল ঠিক করে VALIDATE, হালকা Lock
                  এ। PostgreSQL 18 এ NOT NULL এও চলে।
                </ListItem>
                <ListItem>
                  PostgreSQL এ ALTER Transaction এর অংশ, ROLLBACK এ ফেরে, তাই আসল Data তে মহড়া দেওয়া যায়। MySQL এ DDL চুপচাপ COMMIT
                  করে।
                </ListItem>
                <ListItem>
                  বেশিরভাগ ALTER এ AccessExclusiveLock। Rewrite হলে সেটা লম্বা, আর এক মুহূর্তের ALTER ও লম্বা Query এর পেছনে লাইনে
                  দাঁড়িয়ে পুরো সাইট থামাতে পারে। lock_timeout, NOT VALID, Expand and Contract, আর Module 17 এর Migration।
                </ListItem>
                <ListItem>
                  MySQL এ MODIFY আর CHANGE পুরো সংজ্ঞা চায়, না লিখলে NOT NULL আর DEFAULT হারায়। ALGORITHM=INSTANT দাবি করে লম্বা কপি
                  এড়ানো যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি Table বদলেছেন, কিন্তু কখনো পুরো Table মোছেননি, আর অনুশীলনের প্রতিটা Box শুরু হয়েছে একটা{" "}
                <code className={CODE}>DROP TABLE IF EXISTS</code> দিয়ে, যেটার কথা এখনো ঠিকমতো বলা হয়নি। Data সরানোর তিনটা পথ
                আছে, তিনটা আলাদা জিনিস মোছে, আলাদা গতিতে, আলাদা ঝুঁকিতে: Table সহ সব, Table রেখে সব Row, আর বেছে বেছে কয়েকটা Row।
                সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/drop-truncate-delete" className={LINK}>
                  DROP vs TRUNCATE vs DELETE
                </Link>
                , আর সেখানেই Module 09 এর সমাপ্তি।
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
      ["ALTER TABLE", "চালু Table এর গঠন বদলায়, Row রেখে", "alter_customers এ whatsapp, ১৫ Row অটুট"],
      ["ADD COLUMN", "শেষে বসে, Default না থাকলে পুরনো Row এ NULL", "priority সবার 3, added_at সবার একই মুহূর্ত"],
      ["Default ছাড়া NOT NULL", "পুরনো Row এর কোনো মান নেই, তাই বাতিল", "reviewed_on এ contains null values, 23502"],
      ["DROP COLUMN", "Data যায়, Constraint যায়, View থাকলে থামে", "alter_contact_list এর phone, 2BP01"],
      ["RENAME", "OID ধরে সবাই সঙ্গে যায়, বাইরের কোড ভাঙে", "View এখনো seats দেখায়, Constraint এর নাম পুরনো"],
      ["ALTER COLUMN TYPE", "স্বাভাবিক Cast থাকলে নিজেই রূপান্তর, Round ও", "99.995 থেকে 100.00, তারপর 100"],
      ["USING", "প্রতিটা Row এর রূপান্তরের সূত্র", "'12,500' থেকে 12500.00, 'yes' থেকে true"],
      ["SET DEFAULT", "শুধু ভবিষ্যতের INSERT", "Customer 3 এর Chattogram বদলায়নি"],
      ["SET NOT NULL", "প্রতিটা Row পড়ে প্রমাণ চায়", "phone এর ৫টা NULL, আগে UPDATE"],
      ["ADD CONSTRAINT", "পুরনো Data পরীক্ষা করে, নাম দিন", "UNIQUE (city) এ Key (city)=(Dhaka) is duplicated"],
      ["NOT VALID, VALIDATE", "নতুন Row এখনই, পুরনো Row পরে, হালকা Lock এ", "alter_prices এর দুটো 0, convalidated f থেকে t"],
      ["Transactional DDL", "PostgreSQL এ ROLLBACK এ ALTER ও ফেরে", "tours এর difficulty মহড়ার পরে উধাও"],
      ["Lock আর Rewrite", "বেশিরভাগ ALTER এ AccessExclusiveLock", "smallint থেকে integer আর gen_random_uuid() এ নতুন File"],
      ["lock_timeout", "অপেক্ষার সীমা, লাইন আটকে থাকে না", "দুই সেকেন্ডে বাতিল, না হলে count(*) এ ৭.৬৯ সেকেন্ড"],
      ["MySQL", "MODIFY, CHANGE, AFTER, ALGORITHM, Implicit Commit", "MODIFY এ NOT NULL আর DEFAULT হারাল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "১৫ Row এর alter_customers এ ALTER TABLE alter_customers ADD COLUMN joined_on date NOT NULL; চালালে কী হয়?",
        options: [
          { key: "A", text: "Column যোগ হয়, পুরনো Row গুলো আজকের তারিখ পায়", isCorrect: false, explanation: "Default না দিলে PostgreSQL নিজে কোনো তারিখ বসায় না।" },
          { key: "B", text: "ERROR: column joined_on contains null values, কারণ পুরনো Row গুলো NULL পেত, অথচ NOT NULL চাওয়া হয়েছে", isCorrect: true, explanation: "ঠিক। Default ছাড়া পুরনো Row এর মান NULL, NOT NULL সেটা নিষেধ করে, তাই পুরো ALTER বাতিল, SQLSTATE 23502।" },
          { key: "C", text: "Column যোগ হয়, NOT NULL শুধু নতুন Row এর জন্য খাটে", isCorrect: false, explanation: "NOT NULL পুরনো আর নতুন সব Row এর প্রতিজ্ঞা। পুরনো Row বাদ দেওয়ার উপায় শুধু NOT VALID।" },
          { key: "D", text: "Table খালি হয়ে যায়, তারপর Column যোগ হয়", isCorrect: false, explanation: "ALTER কখনো নিজে থেকে Row মোছে না।" },
        ],
      },
      {
        id: 2,
        text: "দশ কোটি Row এর একটা Table এ কোন ALTER টা Table এর আকার যাই হোক, প্রায় সাথে সাথে শেষ হবে?",
        options: [
          { key: "A", text: "ALTER COLUMN seats TYPE integer (smallint থেকে)", isCorrect: false, explanation: "প্রতিটা মান দুই থেকে চার Byte, তাই পুরো Rewrite।" },
          { key: "B", text: "ADD COLUMN token uuid DEFAULT gen_random_uuid()", isCorrect: false, explanation: "প্রতি Row এ আলাদা মান, তাই পুরো Rewrite।" },
          { key: "C", text: "ADD COLUMN is_paid boolean NOT NULL DEFAULT false", isCorrect: true, explanation: "ঠিক। PostgreSQL 11 থেকে ধ্রুব Default Catalog এ থাকে। দশ লাখ Row এ মাপা 0.7 ms।" },
          { key: "D", text: "ALTER COLUMN status SET NOT NULL", isCorrect: false, explanation: "লেখে না, কিন্তু প্রতিটা Row পড়ে, তাই সময় Row সংখ্যার সাথে বাড়ে।" },
        ],
      },
      {
        id: 3,
        text: "price Column text, মানগুলো '12,500' এর মতো। ALTER TABLE t ALTER COLUMN price TYPE numeric; চালালে কী হয়?",
        options: [
          { key: "A", text: "কমা সহ সব মান নিজে থেকে 12500 হয়ে যায়", isCorrect: false, explanation: "text থেকে numeric এ নিজে থেকে কোনো রূপান্তর নেই।" },
          { key: "B", text: "যে মানগুলো রূপান্তর হয় সেগুলো বদলায়, বাকিগুলো NULL হয়", isCorrect: false, explanation: "PostgreSQL কখনো অর্ধেক রূপান্তর করে না।" },
          { key: "C", text: "ERROR: cannot be cast automatically, সাথে USING লেখার HINT", isCorrect: true, explanation: "ঠিক। সমাধান USING replace(price, ',', '')::numeric, আর অদ্ভুত মান আগে খুঁজে ঠিক করা।" },
          { key: "D", text: "Column মুছে নতুন numeric Column বসে, পুরনো মান হারায়", isCorrect: false, explanation: "TYPE বদল মান রূপান্তর করে রাখে, অথবা পুরোটা ব্যর্থ হয়।" },
        ],
      },
      {
        id: 4,
        text: "alter_signups এ কয়েকজনের city NULL। ALTER TABLE alter_signups ALTER COLUMN city SET DEFAULT 'Dhaka'; এর পরে সেই Row গুলোর city কী?",
        options: [
          { key: "A", text: "Dhaka, কারণ Default খালি জায়গা ভরে দেয়", isCorrect: false, explanation: "Default শুধু INSERT এর সময় খাটে, পুরনো Row তে না।" },
          { key: "B", text: "এখনো NULL, Default শুধু ভবিষ্যতের INSERT এর জন্য", isCorrect: true, explanation: "ঠিক। পুরনো NULL ভরতে UPDATE লাগবে। ADD COLUMN এর Default এর সাথে এখানেই পার্থক্য।" },
          { key: "C", text: "ALTER ব্যর্থ হয়, কারণ NULL থাকা অবস্থায় Default বসে না", isCorrect: false, explanation: "SET DEFAULT কিছু প্রমাণ চায় না, সবসময় সফল।" },
          { key: "D", text: "খালি text, ''", isCorrect: false, explanation: "NULL আর খালি text আলাদা, আর এখানে কিছুই বদলায় না।" },
        ],
      },
      {
        id: 5,
        text: "alter_prices এ CHECK (price_bdt >= 500) বসানো NOT VALID দিয়ে, trip_id 1 এর দাম এখনো 0। UPDATE alter_prices SET title = 'Old promo trip (2024)' WHERE trip_id = 1; চালালে কী হয়?",
        options: [
          { key: "A", text: "সফল, কারণ শুধু title বদলাচ্ছে, দাম না", isCorrect: false, explanation: "CHECK পুরো নতুন Row পরীক্ষা করে, আর তাতে দাম এখনো 0।" },
          { key: "B", text: "সফল, কারণ NOT VALID মানে পুরনো Row কখনো পরীক্ষা হবে না", isCorrect: false, explanation: "যে Row বদলায়, সে নতুন Row হিসেবে পরীক্ষা হয়।" },
          { key: "C", text: "ERROR: new row ... violates check constraint, Failing row contains (1, Old promo trip (2024), 0.00)", isCorrect: true, explanation: "ঠিক। NOT VALID এর ফাঁদ: পুরনো ভুল Row ঠিক না করা পর্যন্ত তাদের কিছুই বদলানো যায় না, তাই শেষে VALIDATE।" },
          { key: "D", text: "দাম নিজে থেকে 500 হয়ে যায়", isCorrect: false, explanation: "Constraint কখনো মান বদলায় না।" },
        ],
      },
      {
        id: 6,
        text: "alter_trips এর নাম বদলে alter_tour_plans করা হলো। এর পরে কোনটা পুরনো নামেই থেকে যায়?",
        options: [
          { key: "A", text: "alter_trips কে পড়া View টা, যেটা এখন ভেঙে গেছে", isCorrect: false, explanation: "View OID ধরে চেনে, চলতেই থাকে।" },
          { key: "B", text: "Primary Key এর Index আর Constraint এর নাম, alter_trips_pkey", isCorrect: true, explanation: "ঠিক। পুরনো নাম থেকে বানানো নাম নিজে বদলায় না, ALTER INDEX ... RENAME TO দিয়ে বদলাতে হয়।" },
          { key: "C", text: "Table এর Data, যেটা পুরনো নামে আলাদা পড়ে থাকে", isCorrect: false, explanation: "Table একটাই, শুধু নাম বদলেছে।" },
          { key: "D", text: "অন্য Table এর Foreign Key, যেটা এখন ভুল Table দেখায়", isCorrect: false, explanation: "Foreign Key ও OID ধরে চেনে।" },
        ],
      },
      {
        id: 7,
        text: "একটা লম্বা রিপোর্ট tours পড়ছে। তানিম ALTER TABLE tours ADD COLUMN note text; চালালেন। পরে আসা সাধারণ SELECT গুলোও কেন আটকে গেল?",
        options: [
          { key: "A", text: "ADD COLUMN পুরো Table নতুন করে লিখছিল", isCorrect: false, explanation: "Default ছাড়া ADD COLUMN শুধু Catalog বদলায়।" },
          { key: "B", text: "ALTER চাইছিল AccessExclusiveLock, রিপোর্টের জন্য অপেক্ষা করছিল, আর পরের SELECT গুলো লাইনে তার পেছনে দাঁড়াল", isCorrect: true, explanation: "ঠিক। লাইন ভেঙে কেউ ALTER এর আগে যেতে পারে না। সমাধান SET lock_timeout আর পরে আবার চেষ্টা।" },
          { key: "C", text: "রিপোর্ট নিজেই AccessExclusiveLock ধরে ছিল", isCorrect: false, explanation: "SELECT নেয় AccessShareLock, যেটা অন্য SELECT এর সাথে মেলে।" },
          { key: "D", text: "PostgreSQL একসাথে একটার বেশি Query চালাতে পারে না", isCorrect: false, explanation: "পারে, শত শত। সমস্যা ছিল Lock এর লাইনে।" },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ: START TRANSACTION; INSERT (1); ALTER TABLE ... ADD COLUMN extra INT; INSERT (2); ROLLBACK; এর পরে Table এ কী থাকে?",
        options: [
          { key: "A", text: "কিছুই না, ROLLBACK সব ফিরিয়ে দেয়", isCorrect: false, explanation: "এটা PostgreSQL এর আচরণ, MySQL এর না।" },
          { key: "B", text: "শুধু Row 1, Row 2 ফেরত গেছে", isCorrect: false, explanation: "ALTER এর পরে Transaction ই ছিল না, Row 2 সাথে সাথে পাকা হয়েছিল।" },
          { key: "C", text: "দুটো Row আর নতুন extra Column, কারণ ALTER চুপচাপ COMMIT করে Transaction শেষ করে দিয়েছিল", isCorrect: true, explanation: "ঠিক, mysql:8.4 এ ঠিক এটাই দেখা গেছে। এর নাম Implicit Commit।" },
          { key: "D", text: "ROLLBACK এ Error আসে", isCorrect: false, explanation: "ROLLBACK চলে, শুধু ফেরানোর মতো কিছু থাকে না।" },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ফারুক সাহেবের Migration, নিজের হাতে",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিন অনুরোধ, কপিতে:</strong> customers, tours আর bookings এর alter_ কপিতে ফারুক সাহেবের তিন অনুরোধ চালান,
        প্রতিটা ALTER এর আগে খোঁজার আর পরে যাচাইয়ের SELECT সহ।
      </span>,
      <span key="2">
        <strong>অগোছালো Import:</strong> পাঁচ Row এর একটা Table বানান, দাম, তারিখ আর হ্যাঁ বা না সব text এ, একটা অদ্ভুত মান সহ।
        USING দিয়ে রূপান্তরের Error দেখুন, তারপর খুঁজে ঠিক করে আবার চালান।
      </span>,
      <span key="3">
        <strong>Rewrite গোয়েন্দা:</strong> সেকশন ১২ এর খাতার কৌশলে আটটা ALTER চালান। প্রতিটার আগে আন্দাজ লিখুন: Catalog, Scan
        নাকি Rewrite। শেষে আন্দাজ আর ফলাফল পাশাপাশি।
      </span>,
      <span key="4">
        <strong>Lock এর লাইন:</strong> নিজের psql এ ড্রিল ৬ চালান, lock_timeout সহ আর ছাড়া, SELECT এর অপেক্ষা \timing দিয়ে মেপে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> চালু দোকানে তাক বদলানোর উদাহরণে বোঝান ALTER TABLE কী, কেন কিছু বদল এক মুহূর্তের
        আর কিছু ঘণ্টার, আর দোকান খোলা রেখে তাক বদলাতে কী সাবধানতা লাগে।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিন কপির Migration Script, খোঁজা আর যাচাইয়ের SELECT এর ফলাফল সহ</span>,
      <span key="d2">Import Table, প্রথম Error এর লেখা, আর ঠিক করার পরের ফলাফল</span>,
      <span key="d3">আটটা ALTER এর আন্দাজ আর আসল rewritten এর তালিকা</span>,
      <span key="d4">lock_timeout সহ আর ছাড়া মাপা সময়</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ ALTER TABLE",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম ALTER আর \\d",
        description:
          "প্রথম ফাইল। \\d এ সাতটা Column, vip এর পাশে not null আর false। শেষ দুই লাইনের প্রথমটা Error, দ্বিতীয়টা শুধু NOTICE।",
      },
      {
        title: "আগে Data, পরে NOT NULL",
        description:
          "দ্বিতীয় ফাইল। প্রথমে contains null values, তারপর 5, UPDATE 5, ALTER সফল। \\d এ phone not null, city এর Default 'Dhaka'::text।",
      },
      {
        title: "USING দিয়ে রূপান্তর",
        description:
          "তৃতীয় ফাইল। USING ছাড়া Error আর HINT, USING সহ সফল। শেষে তিনটা Row, দাম numeric, তারিখ date।",
      },
      {
        title: "NOT VALID থেকে VALIDATE",
        description:
          "চতুর্থ ফাইল। সাধারণ ADD CONSTRAINT ব্যর্থ, NOT VALID সফল, নতুন 0 দামের INSERT ব্যর্থ, UPDATE 2, VALIDATE সফল।",
      },
      {
        title: "দশ লাখ Row এ সময় মাপা",
        description:
          "পঞ্চম ফাইল, \\timing চালু রেখে। সংখ্যা আপনার মেশিনে আলাদা, ক্রম একই: Default false এক মিলিসেকেন্ডের কম, SET NOT NULL কয়েক দশক মিলিসেকেন্ড, দুটো Rewrite কয়েকশো, আর file_no বদলায় শুধু Rewrite এ।",
      },
      {
        title: "Lock এর লাইন, তিনটা Window এ",
        description:
          "ষষ্ঠ ফাইলের নির্দেশে তিনটা psql Window। lock_timeout ছাড়া Window C এর SELECT আটকে থাকে। lock_timeout সহ ALTER দুই সেকেন্ডে বাতিল, SELECT সাথে সাথে উত্তর পায়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-alter.sql",
        code: `DROP TABLE IF EXISTS alter_customers;
CREATE TABLE alter_customers AS
SELECT customer_id, full_name, email, phone, city
FROM customers;
-- SELECT 15

ALTER TABLE alter_customers
  ADD COLUMN whatsapp text,
  ADD COLUMN vip boolean NOT NULL DEFAULT false;
-- ALTER TABLE

\\d alter_customers
--    Column    |  Type   | Collation | Nullable | Default
-- -------------+---------+-----------+----------+---------
--  customer_id | integer |           |          |
--  full_name   | text    |           |          |
--  email       | text    |           |          |
--  phone       | text    |           |          |
--  city        | text    |           |          |
--  whatsapp    | text    |           |          |
--  vip         | boolean |           | not null | false

ALTER TABLE alter_customers ADD COLUMN whatsapp text;
-- ERROR:  column "whatsapp" of relation "alter_customers" already exists
ALTER TABLE alter_customers ADD COLUMN IF NOT EXISTS whatsapp text;
-- NOTICE:  column "whatsapp" of relation "alter_customers" already exists, skipping`,
      },
      {
        language: "sql",
        filename: "02-data-first.sql",
        code: `ALTER TABLE alter_customers ALTER COLUMN phone SET NOT NULL;
-- ERROR:  column "phone" of relation "alter_customers" contains null values

SELECT count(*) FROM alter_customers WHERE phone IS NULL;
-- 5

UPDATE alter_customers SET phone = 'unknown' WHERE phone IS NULL;
-- UPDATE 5

ALTER TABLE alter_customers
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN city SET DEFAULT 'Dhaka';
-- ALTER TABLE

\\d alter_customers
--  phone       | text    |           | not null |
--  city        | text    |           |          | 'Dhaka'::text`,
      },
      {
        language: "sql",
        filename: "03-using.sql",
        code: `DROP TABLE IF EXISTS alter_imports;
CREATE TABLE alter_imports (
  import_id   integer PRIMARY KEY,
  price       text,
  travel_date text
);
INSERT INTO alter_imports VALUES
  (1, '12,500', '05/11/2026'),
  (2, '9500', '18/11/2026'),
  (3, '18,000.50', '02/12/2026');

ALTER TABLE alter_imports ALTER COLUMN price TYPE numeric(10, 2);
-- ERROR:  column "price" cannot be cast automatically to type numeric
-- HINT:  You might need to specify "USING price::numeric(10,2)".

ALTER TABLE alter_imports
  ALTER COLUMN price TYPE numeric(10, 2) USING replace(price, ',', '')::numeric,
  ALTER COLUMN travel_date TYPE date USING to_date(travel_date, 'DD/MM/YYYY');
-- ALTER TABLE

SELECT * FROM alter_imports ORDER BY import_id;
--  import_id |  price   | travel_date
-- -----------+----------+-------------
--          1 | 12500.00 | 2026-11-05
--          2 |  9500.00 | 2026-11-18
--          3 | 18000.50 | 2026-12-02
-- (3 rows)`,
      },
      {
        language: "sql",
        filename: "04-not-valid.sql",
        code: `DROP TABLE IF EXISTS alter_prices;
CREATE TABLE alter_prices (
  trip_id   integer PRIMARY KEY,
  title     text NOT NULL,
  price_bdt numeric(10, 2) NOT NULL
);
INSERT INTO alter_prices VALUES
  (1, 'Old promo trip', 0), (2, 'Sajek weekend', 9500),
  (3, 'Free city walk', 0), (4, 'Sundarbans 3 days', 18000);

ALTER TABLE alter_prices ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500);
-- ERROR:  check constraint "alter_prices_min_check" of relation "alter_prices" is violated by some row

ALTER TABLE alter_prices ADD CONSTRAINT alter_prices_min_check CHECK (price_bdt >= 500) NOT VALID;
-- ALTER TABLE

INSERT INTO alter_prices VALUES (5, 'New free trip', 0);
-- ERROR:  new row for relation "alter_prices" violates check constraint "alter_prices_min_check"
-- DETAIL:  Failing row contains (5, New free trip, 0.00).

UPDATE alter_prices SET price_bdt = 500 WHERE price_bdt < 500;
-- UPDATE 2
ALTER TABLE alter_prices VALIDATE CONSTRAINT alter_prices_min_check;
-- ALTER TABLE

\\d alter_prices
-- Check constraints:
--     "alter_prices_min_check" CHECK (price_bdt >= 500::numeric)`,
      },
      {
        language: "sql",
        filename: "05-million-rows.sql",
        code: `\\timing on
DROP TABLE IF EXISTS alter_big;
CREATE TABLE alter_big AS
SELECT g AS id, (g % 50)::smallint AS seats, 'row ' || g AS note
FROM generate_series(1, 1000000) AS g;
-- SELECT 1000000

SELECT pg_size_pretty(pg_relation_size('alter_big')) AS size,
       pg_relation_filenode('alter_big') AS file_no;
-- 50 MB | 16584

ALTER TABLE alter_big ADD COLUMN is_paid boolean NOT NULL DEFAULT false;
-- Time: 0.723 ms        (file_no একই: 16584)

ALTER TABLE alter_big ALTER COLUMN seats TYPE integer;
-- Time: 361.699 ms      (file_no বদলাল: 16591)

ALTER TABLE alter_big ALTER COLUMN note SET NOT NULL;
-- Time: 33.277 ms       (শুধু পড়া, file_no একই)

ALTER TABLE alter_big ADD COLUMN ref uuid NOT NULL DEFAULT gen_random_uuid();
-- Time: 940.589 ms      (file_no বদলাল: 16599, আকার এখন 66 MB)

DROP TABLE alter_big;
-- সংখ্যাগুলো লেখার সময় postgres:18 Container এর, আপনার মেশিনে আলাদা হবে`,
      },
      {
        language: "sql",
        filename: "06-lock-queue.sql",
        code: `-- Window A: রিপোর্টের মতো একটা খোলা Transaction
BEGIN;
SELECT count(*) FROM alter_customers;
-- এখানে থামুন, COMMIT এখনো না

-- Window B: lock_timeout ছাড়া ALTER, এটা অপেক্ষা করবে
ALTER TABLE alter_customers ADD COLUMN note text;

-- Window C: একটা সাধারণ SELECT, এটাও আটকে যাবে
\\timing on
SELECT count(*) FROM alter_customers;

-- চতুর্থ একটা Window থেকে দেখুন কে কার অপেক্ষায়
SELECT pid, mode, granted
FROM pg_locks
WHERE relation = 'alter_customers'::regclass
ORDER BY granted DESC, pid;
-- AccessShareLock t (A), AccessExclusiveLock f (B), AccessShareLock f (C)

-- Window A তে COMMIT; লিখুন: B আর C দুজনেই সাথে সাথে শেষ হবে
-- এবার Window B তে আগে SET lock_timeout = '2s'; লিখে একই পরীক্ষা আবার:
-- ERROR:  canceling statement due to lock timeout
-- আর Window C এর SELECT আর আটকে থাকে না`,
      },
    ],
  },
};
