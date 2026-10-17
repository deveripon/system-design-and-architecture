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
  IdentityModesLab,
  SequenceGapLab,
} from "../../../components/course/topics/ddl/pk-animations";
import {
  CompositeKeyDiagram,
  KeyLocalitySplit,
  PkPromisesDiagram,
  SequenceGapsDiagram,
} from "../../../components/course/topics/ddl/pk-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * The fixed check query for the exercises that build a table: one row per
 * column, its type, a third fact the exercise cares about, and whether the
 * column belongs to the primary key. Readers keep it as the last statement.
 */
function columnCheck(table: string, third: "is_nullable" | "identity_generation") {
  return `SELECT c.column_name, c.data_type, c.${third},
       EXISTS (
         SELECT 1
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage k
           ON k.constraint_name = tc.constraint_name
          AND k.table_name = tc.table_name
         WHERE tc.table_name = c.table_name
           AND tc.constraint_type = 'PRIMARY KEY'
           AND k.column_name = c.column_name
       ) AS in_primary_key
FROM information_schema.columns c
WHERE c.table_name = '${table}'
ORDER BY c.ordinal_position;`;
}

export const primaryKeysContent: TopicData = {
  id: "primary-keys",
  introduction: {
    badge: "MODULE 09 · LESSON 08",
    title: <SectionTitle>প্রতিটা Row এর একটা অনন্য পরিচয়: Primary Key</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি NOT NULL আর UNIQUE দিয়ে ভুল Data আটকাতে শিখেছেন। এই লেসনে সেই দুটো মিলে তৈরি হয় একটা
          বিশেষ নিয়ম, যেটা প্রায় প্রতিটা Table এ থাকে: Primary Key। Primary Key হলো সেই Column (বা কয়েকটা Column
          মিলে), যার মান দেখে একটা Row কে নিশ্চিতভাবে আলাদা করে চেনা যায়, ঠিক যেমন জাতীয় পরিচয়পত্রের নম্বর দেখে একজন
          মানুষকে চেনা যায়।
        </ContentParagraph>
        <ContentParagraph>
          শুধু নিয়ম জানলেই হবে না, নম্বরটা আসবে কোথা থেকে সেটাও জানতে হবে। Island Tours এর প্রতিটা Table এর প্রথম
          Column এ লেখা আছে <code className={CODE}>GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code>। এই লেসন শেষে এই
          লাইনের প্রতিটা শব্দের মানে আপনি জানবেন: Sequence কী, পুরনো serial আর নতুন Identity এর পার্থক্য কী, নিজের
          হাতে id দিলে কেন Error আসে, id তে ফাঁক কেন পড়ে, আর নম্বরের বদলে UUID কখন ভালো। সব উদাহরণ চলবে আপনার নিজের
          বানানো ছোট Table এ, যাদের নাম শুরু হয় pk_ দিয়ে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি প্রতিটা Row কে একটা নাম দিই, যে নাম আর কারও নেই, আর যে নাম কখনো খালি থাকে না। আমাকে ধরে আপনি একটা Row খুঁজে পান, বদলান, মোছেন, আর অন্য Table আমাকে দেখিয়েই বলে, আমি ওই Row এর সাথে যুক্ত।",
      author: "PRIMARY KEY",
      role: "Lesson 08",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুটো হুবহু একই Row, কোনটা মুছবেন?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর Sajek, Bandarban আর Sylhet এর ট্যুরগুলো শুরু হয় ঢাকা থেকে
                রাতের Bus এ। যাত্রীরা ওঠেন শহরের আলাদা আলাদা Counter থেকে: Kalabagan, Arambagh, Abdullahpur। Manager
                ফারুক সাহেব চান Website এ প্রতিটা Departure এর পাশে লেখা থাকুক কোন Counter থেকে কয়টায় Bus ছাড়বে। নতুন
                Developer তানিম প্রথম ধাপ হিসেবে Counter গুলোর একটা তালিকা বানালেন: দুটো Column, নাম আর এলাকা।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম দিনেই ফারুক সাহেব Admin Page এ Kalabagan Counter লিখে Save চাপলেন, Page ধীরে চলছিল, তাই আরেকবার।
                Database এ এখন Kalabagan দুইবার। নিচের Box এ ঘটনাটা চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চাবি ছাড়া একটা Table"
              query={`DROP TABLE IF EXISTS pk_draft_points;
CREATE TABLE pk_draft_points (
  name text,
  area text
);
INSERT INTO pk_draft_points VALUES ('Kalabagan Counter', 'Dhanmondi');
INSERT INTO pk_draft_points VALUES ('Arambagh Counter', 'Motijheel');
-- Save বোতামে দ্বিতীয় চাপ, একই Row আবার
INSERT INTO pk_draft_points VALUES ('Kalabagan Counter', 'Dhanmondi');
SELECT * FROM pk_draft_points;`}
              caption="৩টা Row, প্রথম আর তৃতীয়টা অক্ষরে অক্ষরে এক। Database কে কেউ বলেনি যে একই Counter দুইবার থাকতে পারবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিম ভাবলেন, সমস্যা নেই, বাড়তি Row টা মুছে দিলেই হলো। কিন্তু কোন শর্তে মুছবেন? DELETE এর WHERE এ একটা
                শর্ত লাগে, যেটা মুছতে চাওয়া Row টাকে বাকিদের থেকে আলাদা করে। এখানে দুটো Row এর প্রতিটা Column একই, তাই
                এমন কোনো শর্ত লেখাই সম্ভব না যেটা একটায় মেলে আর অন্যটায় মেলে না। যে শর্তই লিখুন, হয় দুটোই মিলবে, নয়তো
                কোনোটাই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা মুছতে চাইলেন, গেল দুটোই"
              query={`DROP TABLE IF EXISTS pk_draft_points;
CREATE TABLE pk_draft_points (name text, area text);
INSERT INTO pk_draft_points VALUES
  ('Kalabagan Counter', 'Dhanmondi'),
  ('Arambagh Counter', 'Motijheel'),
  ('Kalabagan Counter', 'Dhanmondi');
-- বাড়তি Kalabagan টা মুছতে চাই, কিন্তু শর্তটা দুটোতেই মেলে
DELETE FROM pk_draft_points
WHERE name = 'Kalabagan Counter' AND area = 'Dhanmondi';
SELECT * FROM pk_draft_points;`}
              caption="DELETE দুটো Row ই মুছল, শুধু Arambagh বাকি। UPDATE এও একই বিপদ: একটার বানান ঠিক করতে গেলে দুটোই বদলায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো Row কে আলাদা করে চেনার উপায় না থাকলে একটা নির্দিষ্ট Row কে খোঁজা, বদলানো বা মোছা যায় না। পরে আরও
                বড় সমস্যা: Booking যদি বলতে চায় যাত্রী Kalabagan থেকে উঠবেন, তাহলে কোন Kalabagan? অন্য Table থেকে একটা
                Row কে দেখাতে হলে সেই Row এর একটা স্থায়ী, অনন্য পরিচয় লাগে।
              </ContentParagraph>
              <ContentParagraph>
                এই অনন্য পরিচয়কেই বলে Key, আর যে Key কে আমরা Table এর প্রধান পরিচয় হিসেবে বেছে নিয়ে Database কে দিয়ে
                পাহারা দেওয়াই, সেটাই Primary Key। ক্লাসের Roll Number এর মতো: দুজনের একই নাম থাকতে পারে, কিন্তু Roll
                Number কখনো এক হয় না, আর Roll Number ছাড়া কোনো ছাত্র থাকে না। শিক্ষক Roll 17 ডাকলে ঠিক একজনই দাঁড়ায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "লুকানো ctid দিয়ে কাজ চালানোর লোভ",
          content: (
            <ContentParagraph>
              PostgreSQL এর প্রতিটা Row এর একটা লুকানো ঠিকানা আছে, নাম ctid: Disk এর কোন Page এর কত নম্বর জায়গায় Row টা
              বসে আছে। দুটো হুবহু একই Row এর ctid আলাদা, তাই মনে হতে পারে এটাই চাবি। কিন্তু Row বদলালে PostgreSQL নতুন
              একটা Row লেখে, তাই ঠিকানাও বদলে যায়। জরুরি মেরামতে ctid কাজে লাগে, কিন্তু কোনো App বা Table একে পরিচয়
              হিসেবে মনে রাখতে পারে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ctid বদলে যায়"
              query={`DROP TABLE IF EXISTS pk_draft_points;
CREATE TABLE pk_draft_points (name text, area text);
INSERT INTO pk_draft_points VALUES
  ('Kalabagan Counter', 'Dhanmondi'),
  ('Kalabagan Counter', 'Dhanmondi');
SELECT ctid, * FROM pk_draft_points;
UPDATE pk_draft_points SET area = 'Dhanmondi 27';
SELECT ctid, * FROM pk_draft_points;`}
              caption="আগে ctid (0,1) আর (0,2), UPDATE এর পরে (0,3) আর (0,4)। Row একই, ঠিকানা বদলে গেছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-primary-key-is",
      subHeader: { index: "002", title: "What a Primary Key Is" },
      title: <SectionTitle>PRIMARY KEY লিখলে Database কী কথা দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিম এবার Table টা নতুন করে বানালেন। প্রথমে একটা নতুন Column, <code className={CODE}>point_id</code>,
                যেটা প্রতিটা Counter এর একটা নম্বর। তার পাশে দুটো শব্দ: PRIMARY KEY। এই দুটো শব্দ লিখে আপনি Database
                কে দুটো কাজের দায়িত্ব দেন, যেগুলো সে প্রতিটা INSERT আর UPDATE এ নিজে থেকে পাহারা দেবে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অনন্য (UNIQUE):</strong> কোনো দুটো Row এর point_id কখনো এক হবে না। দ্বিতীয়বার একই মান এলে
                  Database সেই Row টা ঢুকতেই দেবে না।
                </ListItem>
                <ListItem>
                  <strong>খালি নয় (NOT NULL):</strong> কোনো Row এর point_id কখনো NULL হবে না। NULL মানে অজানা, আর অজানা
                  কিছু দিয়ে কাউকে চেনা যায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                অর্থাৎ PRIMARY KEY = UNIQUE + NOT NULL। আগের লেসনের দুটো Constraint একসাথে, এক শব্দে। নিচের Box এ প্রথমে
                দুটো ঠিকঠাক Row, তারপর আবার সেই পুরনো ভুল: একই Counter, একই নম্বর দিয়ে দ্বিতীয়বার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PRIMARY KEY দেওয়া Table, আর দ্বিতীয় 1"
              query={`DROP TABLE IF EXISTS pk_pickup_points;
CREATE TABLE pk_pickup_points (
  point_id integer PRIMARY KEY,
  name     text NOT NULL,
  area     text NOT NULL
);
INSERT INTO pk_pickup_points VALUES (1, 'Kalabagan Counter', 'Dhanmondi');
INSERT INTO pk_pickup_points VALUES (2, 'Arambagh Counter', 'Motijheel');
INSERT INTO pk_pickup_points VALUES (1, 'Kalabagan Counter', 'Dhanmondi');`}
              caption={`প্রথম দুটো INSERT চলে, তৃতীয়টায় ERROR: duplicate key value violates unique constraint "pk_pickup_points_pkey", সাথে DETAIL: Key (point_id)=(1) already exists. দ্বিতীয় চাপটা এবার Database এর দরজাতেই আটকে গেল।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Error এর নামটা <code className={CODE}>pk_pickup_points_pkey</code> আপনি দেননি, PostgreSQL বানিয়েছে: Table এর
                নাম, তারপর <code className={CODE}>_pkey</code>। DETAIL বলে কোন মানটা নিয়ে ঝামেলা। আর SQLSTATE কোড 23505
                (unique_violation) দেখে App বোঝে, ব্যবহারকারীকে বলতে হবে এটা আগেই আছে।
              </ContentParagraph>
              <ContentParagraph>
                এবার দ্বিতীয় প্রতিজ্ঞা। নম্বর না জেনে কেউ point_id এর জায়গায় NULL পাঠালে কী হয়, দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি চাবি"
              query={`DROP TABLE IF EXISTS pk_pickup_points;
CREATE TABLE pk_pickup_points (
  point_id integer PRIMARY KEY,
  name     text NOT NULL,
  area     text NOT NULL
);
INSERT INTO pk_pickup_points VALUES
  (1, 'Kalabagan Counter', 'Dhanmondi'),
  (2, 'Arambagh Counter', 'Motijheel');
INSERT INTO pk_pickup_points VALUES (NULL, 'Uttara Counter', 'Uttara');`}
              caption={`ERROR: null value in column "point_id" of relation "pk_pickup_points" violates not-null constraint, সাথে DETAIL: Failing row contains (null, Uttara Counter, Uttara). লক্ষ করুন, CREATE TABLE এ point_id এর পাশে NOT NULL লেখা নেই, তবু NULL আটকাল। PRIMARY KEY নিজেই NOT NULL এর দায়িত্ব নেয়।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PkPromisesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির তৃতীয় প্রতিজ্ঞা, একটা Table এ একটাই Primary Key, আসছে Section 04 এ। আর একটা নিয়ম Database পাহারা দেয়
                না কিন্তু সবাই মানে: Primary Key এর মান একবার দেওয়ার পরে আর বদলানো হয় না, কারণ অন্য Table গুলো এই মান দিয়েই
                Row টাকে দেখায়। Roll Number বছরের মাঝখানে বদলালে খাতার সব নম্বর ভুল জায়গায় চলে যায়।
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
                  Saint Martin এর জাহাজগুলোর জন্য <code className={CODE}>pk_ex_boats</code> নামে একটা Table বানান, এই ক্রমে
                  তিনটা Column: <code className={CODE}>boat_id</code> integer, যেটা Primary Key;{" "}
                  <code className={CODE}>name</code> text, খালি থাকতে পারবে না; <code className={CODE}>seats</code> integer,
                  খালি থাকতে পারবে না। Starter এর শেষের যাচাইয়ের Query টা না মুছে শেষে রেখে দিন।
                </>
              }
              hint={
                <>
                  উপরের pk_pickup_points এর CREATE TABLE টা দেখুন। boat_id এর পাশে PRIMARY KEY লিখলেই NOT NULL আলাদা করে
                  লাগে না, বাকি দুটোয় লাগে।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS pk_ex_boats;
-- এখানে CREATE TABLE pk_ex_boats লিখুন


-- যাচাইয়ের Query, এটা শেষে রেখে দিন
${columnCheck("pk_ex_boats", "is_nullable")}`}
              solution={`SELECT * FROM (VALUES
  ('boat_id', 'integer', 'NO', true),
  ('name',    'text',    'NO', false),
  ('seats',   'integer', 'NO', false)
) AS v(column_name, data_type, is_nullable, in_primary_key);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "behind-the-key",
      subHeader: { index: "003", title: "Behind the Key" },
      title: <SectionTitle>এক লাইনের PRIMARY KEY, পেছনে তিনটা জিনিস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database প্রতিটা INSERT এ কীভাবে জানে যে 1 আগে থেকে আছে? পুরো Table পড়ে মিলিয়ে দেখলে লাখ Row এর Table এ
                প্রতিটা INSERT এ লাখবার তুলনা লাগত। তাই PRIMARY KEY লেখার সাথে সাথে PostgreSQL পেছনে একটা Index বানায়।
              </ContentParagraph>
              <ContentParagraph>
                Index মানে বইয়ের শেষের সূচিপত্রের মতো আলাদা একটা সাজানো তালিকা: শব্দ খুঁজতে পুরো বই পড়তে হয় না। Primary Key
                এর Index এ point_id গুলো ছোট থেকে বড় ক্রমে, পাশে প্রতিটা Row এর ঠিকানা। নতুন 1 এলে PostgreSQL তালিকায় 1 এর
                জায়গা খোঁজে, কেউ বসে থাকলে Error। এই সাজানো তালিকার নাম B-tree (Module 13)।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 18 এ আরও তৈরি হয় নিজের নাম সহ একটা NOT NULL Constraint। নিচে দেখুন{" "}
                <code className={CODE}>pg_constraint</code> (Database এর সব Constraint এর খাতা) আর{" "}
                <code className={CODE}>pg_indexes</code> (সব Index দেখানো View) থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PRIMARY KEY পেছনে কী রেখে গেল"
              query={`DROP TABLE IF EXISTS pk_pickup_points;
CREATE TABLE pk_pickup_points (
  point_id integer PRIMARY KEY,
  name     text NOT NULL,
  area     text NOT NULL
);
SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'pk_pickup_points'::regclass
ORDER BY conname;
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'pk_pickup_points';`}
              caption="৪টা Constraint: p (Primary Key) pk_pickup_points_pkey, আর তিনটা n (NOT NULL), যার pk_pickup_points_point_id_not_null টা PRIMARY KEY নিজে বানিয়েছে। দ্বিতীয় ফলাফলে CREATE UNIQUE INDEX pk_pickup_points_pkey ... USING btree (point_id)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অর্থাৎ PRIMARY KEY লেখা মানে তিনটা জিনিস: <code className={CODE}>_pkey</code> নামের Constraint, একই নামের Unique
                B-tree Index, আর <code className={CODE}>_not_null</code> নামের Constraint। PRIMARY KEY = UNIQUE + NOT NULL
                কথাটা Catalog এ সত্যিই আলাদা করে দেখা যায়। Index টা id দিয়ে খোঁজার সময়ও কাজে লাগে। EXPLAIN কোনো Query এর আগে
                বসালে Query চলে না, PostgreSQL শুধু বলে সে কীভাবে চালাত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="id দিয়ে খোঁজায় Index"
              query={`EXPLAIN (COSTS OFF)
SELECT * FROM bookings WHERE booking_id = 17;`}
              caption="Index Scan using bookings_pkey on bookings, নিচে Index Cond: (booking_id = 17)। পুরো Table না পড়ে Index এ 17 খুঁজে সরাসরি সেই Row এ। নিজের psql এর PostgreSQL 18 এও একই Plan।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এর <code className={CODE}>\d</code> এও দেখা যায় (PostgreSQL 18 Container থেকে): point_id এর পাশে not
              null, আর Indexes এ PRIMARY KEY, btree।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql-describe-pk.txt",
          code: `island_tours=# \\d pk_pickup_points
           Table "public.pk_pickup_points"
  Column  |  Type   | Collation | Nullable | Default
----------+---------+-----------+----------+---------
 point_id | integer |           | not null |
 name     | text    |           | not null |
 area     | text    |           | not null |
Indexes:
    "pk_pickup_points_pkey" PRIMARY KEY, btree (point_id)`,
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "one-per-table",
      subHeader: { index: "004", title: "One Key per Table" },
      title: <SectionTitle>একটা Table, একটাই Primary Key</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একজন মানুষের জাতীয় পরিচয়পত্রের নম্বর, Passport নম্বর, Mobile নম্বর, সবই অনন্য হতে পারে। কিন্তু সরকারি
                খাতায় তাঁর মূল পরিচয় একটাই। Table এর ক্ষেত্রেও তাই। একটা Table এ অনন্য Column অনেকগুলো থাকতে পারে (যেমন
                customers এ customer_id আর email দুটোই অনন্য), কিন্তু তাদের মধ্যে একটাকেই আপনি মূল পরিচয় হিসেবে বেছে নেন।
                Database এর ভাষায় যেসব Column বা Column এর জোড়া একটা Row কে অনন্যভাবে চেনাতে পারে, তাদের বলে Candidate
                Key, আর তাদের মধ্যে বেছে নেওয়া একটা হলো Primary Key।
              </ContentParagraph>
              <ContentParagraph>
                দুটো Column এর পাশে PRIMARY KEY লিখলে PostgreSQL সোজা না বলে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় PRIMARY KEY"
              query={`DROP TABLE IF EXISTS pk_two_keys;
CREATE TABLE pk_two_keys (
  point_id integer PRIMARY KEY,
  code     text PRIMARY KEY
);`}
              caption={`ERROR: multiple primary keys for table "pk_two_keys" are not allowed। SQLSTATE 42P16। Table টা তৈরিই হয় না। code কেও অনন্য রাখতে চাইলে তার পাশে লিখুন UNIQUE NOT NULL।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে UNIQUE আর NOT NULL আলাদা করে লিখলে কি একই কাজ হয়? পাহারার দিক থেকে হ্যাঁ: দুটোই Duplicate আর NULL
                আটকায়, দুটোর পেছনেই Unique Index। pg_constraint এ শুধু একটার গায়ে লেখা থাকে p (Primary Key), অন্যটার গায়ে
                u (Unique)। আর ওই p অক্ষরটাই পার্থক্য তৈরি করে, কারণ Database আর তার চারপাশের Tool গুলো Primary Key কে
                বিশেষভাবে চেনে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>REFERENCES এর স্বাভাবিক লক্ষ্য:</strong> অন্য Table থেকে শুধু Table এর নাম লিখে REFERENCES দিলে
                  (কোন Column সেটা না বলে) PostgreSQL ধরে নেয় আপনি Primary Key কে দেখাচ্ছেন। Primary Key না থাকলে Error।
                  নিচের Box এ দেখুন।
                </ListItem>
                <ListItem>
                  <strong>ORM আর Admin Tool:</strong> Prisma, Django বা pgAdmin একটা Row আলাদা করে বদলাতে Primary Key খোঁজে,
                  না পেলে অনেকে Edit করতে দেয় না।
                </ListItem>
                <ListItem>
                  <strong>Replication:</strong> এক Server এর বদল Row ধরে ধরে আরেক Server এ পাঠানোর পদ্ধতি Logical
                  Replication। UPDATE বা DELETE হলে অন্য Server কে বলতে হয় ঠিক কোন Row বদলাল, আর PostgreSQL স্বাভাবিকভাবে
                  সেটা বলে Primary Key দিয়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="REFERENCES খোঁজে Primary Key"
              query={`DROP TABLE IF EXISTS pk_ref_child;
DROP TABLE IF EXISTS pk_with_pk;
DROP TABLE IF EXISTS pk_with_unique;
CREATE TABLE pk_with_pk     (code text PRIMARY KEY);
CREATE TABLE pk_with_unique (code text UNIQUE NOT NULL);
-- শুধু Table এর নাম, কোন Column সেটা বলা নেই
CREATE TABLE pk_ref_child (code text REFERENCES pk_with_pk);
DROP TABLE pk_ref_child;
CREATE TABLE pk_ref_child (code text REFERENCES pk_with_unique);`}
              caption={`pk_with_pk কে দেখানো Table তৈরি হয়, PostgreSQL নিজে তার Primary Key ধরে নেয়। pk_with_unique এ ERROR: there is no primary key for referenced table "pk_with_unique"। REFERENCES pk_with_unique (code) লিখলে এটাও চলত।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PRIMARY KEY লেখার দুটো জায়গা আছে। এতক্ষণ লিখেছেন Column এর পাশে, একে বলে Column Constraint। আরেকটা উপায়
                হলো সব Column লেখার পরে আলাদা একটা লাইনে, একে বলে Table Constraint। সেই লাইনে চাইলে CONSTRAINT শব্দ দিয়ে
                নিজের পছন্দের নামও দেওয়া যায়। কাজ একই, পার্থক্য দুটো জায়গায়: দুই বা বেশি Column মিলে চাবি বানাতে হলে
                (পরের Section) Table Constraint ছাড়া উপায় নেই, আর নিজের দেওয়া নাম Error বার্তায় দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের দেওয়া নাম, Table স্তরে লেখা"
              query={`DROP TABLE IF EXISTS pk_named_points;
CREATE TABLE pk_named_points (
  point_id integer,
  name     text NOT NULL,
  CONSTRAINT pk_named_points_pk PRIMARY KEY (point_id)
);
INSERT INTO pk_named_points VALUES (1, 'Kalabagan Counter');
INSERT INTO pk_named_points VALUES (1, 'Arambagh Counter');`}
              caption={`ERROR: duplicate key value violates unique constraint "pk_named_points_pk"। এবার নামটা আপনার দেওয়া। বেশিরভাগ দল PostgreSQL এর table_pkey নামটাই রাখে।`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "composite-keys",
      subHeader: { index: "005", title: "Composite Keys" },
      title: <SectionTitle>দুই Column মিলে একটা চাবি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                guides Table এ প্রতিটা Guide এর <code className={CODE}>language</code> একটাই। কিন্তু Jamal Hossain বলেন
                Bangla আর English, Shirin Akter বলেন English আর Hindi। এক Column এ কমা দিয়ে লেখা খারাপ উপায় (Module 11),
                ভালো উপায় আলাদা Table, যেখানে প্রতিটা Guide আর ভাষার জোড়া এক একটা Row।
              </ContentParagraph>
              <ContentParagraph>
                এই Table এর চাবি কী হবে? guide_id একা না, কারণ একজন Guide এর একাধিক Row থাকবে। language একা ও না, কারণ
                অনেক Guide Bangla বলেন। কিন্তু একই Guide একই ভাষা দুইবার থাকার কোনো মানে নেই। অর্থাৎ guide_id আর
                language এর জোড়াটা অনন্য। যে চাবি একাধিক Column মিলে তৈরি, তাকে বলে Composite Key। লেখা হয় Table
                Constraint হিসেবে: <code className={CODE}>PRIMARY KEY (guide_id, language)</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide এর ভাষা, জোড়া চাবিতে"
              query={`DROP TABLE IF EXISTS pk_guide_languages;
CREATE TABLE pk_guide_languages (
  guide_id integer,
  language text,
  level    text NOT NULL,
  PRIMARY KEY (guide_id, language)
);
INSERT INTO pk_guide_languages VALUES
  (1, 'Bangla',  'native'),
  (1, 'English', 'fluent'),
  (2, 'English', 'native'),
  (2, 'Hindi',   'basic');
SELECT g.full_name, l.language, l.level
FROM pk_guide_languages l
JOIN guides g ON g.guide_id = l.guide_id
ORDER BY l.guide_id, l.language;
-- একই জোড়া আবার
INSERT INTO pk_guide_languages VALUES (1, 'English', 'basic');`}
              caption={`SELECT এ ৪টা Row: Jamal Hossain এর Bangla আর English, Shirin Akter এর English আর Hindi। guide_id 1 দুইবার, English দুইবার, কোনো সমস্যা নেই। শেষের INSERT এ ERROR: duplicate key value violates unique constraint "pk_guide_languages_pkey", DETAIL: Key (guide_id, language)=(1, English) already exists।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CompositeKeyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Composite Key এর NOT NULL নিয়মটা জোড়ার প্রতিটা অংশে আলাদা করে খাটে। জোড়ার একটা অংশ খালি থাকলে জোড়াটা
                অসম্পূর্ণ, আর অসম্পূর্ণ পরিচয় দিয়ে কাউকে চেনা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়ার একটা অংশ খালি"
              query={`DROP TABLE IF EXISTS pk_guide_languages;
CREATE TABLE pk_guide_languages (
  guide_id integer,
  language text,
  level    text NOT NULL,
  PRIMARY KEY (guide_id, language)
);
INSERT INTO pk_guide_languages VALUES (2, NULL, 'basic');`}
              caption={`ERROR: null value in column "language" of relation "pk_guide_languages" violates not-null constraint। guide_id ঠিক আছে, তবু Row টা ঢুকল না। psql এর \\d এ দুটো Column এর পাশেই not null দেখা যায়, আর Indexes এ "pk_guide_languages_pkey" PRIMARY KEY, btree (guide_id, language)।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Composite Key বেশি দেখা যায় সম্পর্ক রাখার Table এ (কোন Guide কোন ভাষা, কোন ট্যুরে কোন Tag)। এদের বলে
                Junction Table, Module 11 এর Many-to-Many তে পুরো রূপ।
              </ContentParagraph>
              <ContentParagraph>
                Column এর ক্রমও গুরুত্বপূর্ণ: Index সাজানো হয় আগে guide_id, তারপর তার ভেতরে language, ফোনবইয়ের পদবি আর
                নামের মতো। তাই <code className={CODE}>WHERE guide_id = 1</code> এ Index দ্রুত, শুধু language দিয়ে খুঁজলে ততটা
                না। যে Column দিয়ে বেশি খোঁজা হয়, সেটা আগে (Module 13)।
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
                  Saint Martin এর জাহাজে প্রতিটা Departure এর Seat ভাগ করে দিতে <code className={CODE}>pk_ex_seats</code>{" "}
                  Table বানান: <code className={CODE}>departure_id</code> integer, <code className={CODE}>seat_no</code>{" "}
                  integer, <code className={CODE}>booking_id</code> integer NOT NULL। একই Departure এ একটা Seat একবারই
                  দেওয়া যাবে, কিন্তু Seat 7 আলাদা আলাদা Departure এ থাকতেই পারে। চাবির Column এর ক্রম: আগে departure_id,
                  পরে seat_no।
                </>
              }
              hint={
                <>
                  তিনটা Column লেখার পরে কমা দিয়ে আলাদা লাইনে PRIMARY KEY, বন্ধনীতে দুটো Column। Column এর পাশে দুটো
                  PRIMARY KEY লিখলে multiple primary keys Error আসবে।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS pk_ex_seats;
-- এখানে CREATE TABLE pk_ex_seats লিখুন


-- যাচাইয়ের Query, এটা শেষে রেখে দিন
SELECT k.column_name, k.ordinal_position
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage k
  ON k.constraint_name = tc.constraint_name
 AND k.table_name = tc.table_name
WHERE tc.table_name = 'pk_ex_seats'
  AND tc.constraint_type = 'PRIMARY KEY'
ORDER BY k.ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('departure_id', 1),
  ('seat_no', 2)
) AS v(column_name, ordinal_position);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "sequences",
      subHeader: { index: "006", title: "Sequences" },
      title: <SectionTitle>নম্বরগুলো আসে কোথা থেকে: Sequence</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ point_id নিজের হাতে লিখেছেন। দুজন একসাথে নতুন Counter যোগ করলে দুজনেই ভাববেন পরের নম্বর 4।{" "}
                <code className={CODE}>max(point_id) + 1</code> এও একই বিপদ, দুজন একই মুহূর্তে একই max পড়েন। নম্বর দিতে হবে
                এমন কাউকে, যে হাজার জন একসাথে চাইলেও প্রত্যেককে আলাদা নম্বর দেয়।
              </ContentParagraph>
              <ContentParagraph>
                ব্যাংকের Token Machine এর কথা ভাবুন। বোতাম চাপলেই পরের নম্বর: 41, তারপর 42। দুজন একসাথে চাপলেও দুজন আলাদা
                নম্বর পান, আর কেউ 42 নিয়ে চলে গেলে 42 আর কাউকে দেওয়া হয় না। PostgreSQL এ এই মেশিনের নাম Sequence: একটা
                আলাদা Database Object, যার কাজ শুধু বাড়তে থাকা নম্বর বিলি করা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>nextval(&apos;name&apos;)</code>: বোতাম চাপা। পরের নম্বর দেয় আর Sequence কে এক ঘর
                  এগিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <code className={CODE}>currval(&apos;name&apos;)</code>: এই Session এ (Database এর সাথে আপনার একটা সংযোগ,
                  যেমন psql এর একটা জানালা বা এই Page এর সব Box মিলে) nextval শেষবার যা দিয়েছিল। Sequence এগোয় না।
                </ListItem>
                <ListItem>
                  <code className={CODE}>setval(&apos;name&apos;, n)</code>: মেশিনের কাঁটা ঘুরিয়ে দেওয়া। এরপরের nextval
                  দেবে n + 1।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Token Machine"
              query={`DROP SEQUENCE IF EXISTS pk_token_seq;
CREATE SEQUENCE pk_token_seq;
SELECT nextval('pk_token_seq') AS first_token;
SELECT nextval('pk_token_seq') AS second_token;
SELECT currval('pk_token_seq') AS current_token;
SELECT last_value, is_called FROM pk_token_seq;`}
              caption="1, তারপর 2, তারপর currval আবার 2 (এগোয়নি)। শেষ লাইনে Sequence কে Table এর মতো পড়া হয়েছে: last_value 2, is_called t, মানে 2 বিলি হয়ে গেছে আর পরের nextval দেবে 3।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              currval এর একটা নিয়ম আছে: এই Session এ ওই Sequence এর nextval একবারও না চাপলে currval বলার মতো কিছু থাকে না।
              তখন Error, যেটা App লেখার সময় অনেকে প্রথমবার দেখেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="nextval এর আগে currval"
              query={`DROP SEQUENCE IF EXISTS pk_ticket_seq;
CREATE SEQUENCE pk_ticket_seq START WITH 1001;
SELECT currval('pk_ticket_seq');`}
              caption={`ERROR: currval of sequence "pk_ticket_seq" is not yet defined in this session। SQLSTATE 55000। মেশিন থেকে এখনো কোনো Token নেননি, তাই শেষ Token কত সেই প্রশ্নের উত্তর নেই।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="START WITH আর setval"
              query={`DROP SEQUENCE IF EXISTS pk_ticket_seq;
CREATE SEQUENCE pk_ticket_seq START WITH 1001;
SELECT nextval('pk_ticket_seq') AS ticket;
SELECT nextval('pk_ticket_seq') AS ticket;
SELECT setval('pk_ticket_seq', 5000);
SELECT nextval('pk_ticket_seq') AS ticket;`}
              caption="1001, 1002, তারপর setval এর ফলাফল 5000, আর পরের nextval 5001। START WITH শুধু প্রথম নম্বর ঠিক করে, setval যেকোনো সময় কাঁটা সরায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Sequence এর সবচেয়ে গুরুত্বপূর্ণ স্বভাব। Transaction মানে কয়েকটা Statement কে বাঁধা: BEGIN দিয়ে শুরু,
                COMMIT এ সব থাকে, ROLLBACK এ সব ফেরত যায় (Module 12)। কিন্তু nextval এর নম্বর ROLLBACK এও ফেরত যায় না।
              </ContentParagraph>
              <ContentParagraph>
                কেন? প্রথমজন nextval চেপে 42 পেলেন, তাঁর Transaction এখনো চলছে। Sequence ফেরত নেওয়ার কথা ভাবলে দ্বিতীয়জনকে
                অপেক্ষা করতে হতো প্রথমজন COMMIT করেন নাকি ROLLBACK। হাজার জনের ভিড়ে সবাই লাইনে দাঁড়াতেন। তাই PostgreSQL
                ইচ্ছা করেই Sequence কে Transaction এর বাইরে রেখেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROLLBACK নম্বর ফেরত দেয় না"
              query={`DROP SEQUENCE IF EXISTS pk_token_seq;
CREATE SEQUENCE pk_token_seq;
SELECT nextval('pk_token_seq') AS before_begin;
BEGIN;
SELECT nextval('pk_token_seq') AS inside_transaction;
ROLLBACK;
SELECT nextval('pk_token_seq') AS after_rollback;`}
              caption="1, তারপর Transaction এর ভেতরে 2, তারপর ROLLBACK, তারপর 3। ROLLBACK সবকিছু ফেরত নিয়েছে, শুধু 2 নম্বরটা ছাড়া। Section 10 এ এই স্বভাবের ফলাফল দেখবেন Table এর id তে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Sequence এর বাকি গল্প Module 10 এ",
          content: (
            <ContentParagraph>
              Sequence এর আরও অনেক Option আছে: INCREMENT BY দিয়ে লাফের মাপ, MINVALUE আর MAXVALUE, CYCLE দিয়ে শেষে গিয়ে
              আবার শুরু, CACHE দিয়ে একসাথে কয়েকটা নম্বর আগে থেকে তুলে রাখা। এগুলো Module 10 এর{" "}
              <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                Generated Columns and Sequences
              </Link>{" "}
              লেসনে। Primary Key বোঝার জন্য এখানে যতটুকু দেখলেন, ততটুকুই যথেষ্ট: nextval, currval, setval, আর ROLLBACK এ
              ফেরত না যাওয়া।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "serial",
      subHeader: { index: "007", title: "serial, the Older Way" },
      title: <SectionTitle>serial: পুরনো দিনের সহজ পথ, আর তার ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Table এর জন্য নিজে Sequence বানিয়ে DEFAULT এ nextval বসানো ঝামেলার কাজ। তাই PostgreSQL অনেক বছর
                আগে একটা Shortcut দিয়েছিল: <code className={CODE}>serial</code>। পুরনো Tutorial আর Project এ আজও এটাই দেখবেন।
                দেখতে Data Type এর মতো, কিন্তু আসলে Type না, Documentation এর ভাষায় শুধু লেখার সুবিধা।{" "}
                <code className={CODE}>point_id serial</code> লিখলে PostgreSQL পেছনে চারটা কাজ করে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>pk_serial_points_point_id_seq</code> নামে একটা Sequence বানায় (Table, Column, তারপর
                  _seq)।
                </ListItem>
                <ListItem>Column টাকে integer বানায়, আর NOT NULL দেয়।</ListItem>
                <ListItem>
                  Column এর DEFAULT বসায় <code className={CODE}>nextval(&apos;pk_serial_points_point_id_seq&apos;)</code>,
                  অর্থাৎ মান না দিলে Token Machine এর বোতাম চাপা হবে।
                </ListItem>
                <ListItem>
                  Sequence টাকে Column এর মালিকানায় দেয় (OWNED BY), যাতে Table মুছলে Sequence ও মুছে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একই রকম আরও দুটো আছে: <code className={CODE}>smallserial</code> (smallint এর উপর) আর{" "}
                <code className={CODE}>bigserial</code> (bigint এর উপর)। নিচের Box এ দেখুন serial আসলে কী লিখে রেখে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="serial আসলে কী লেখে"
              query={`DROP TABLE IF EXISTS pk_serial_points;
CREATE TABLE pk_serial_points (
  point_id serial PRIMARY KEY,
  name     text NOT NULL
);
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'pk_serial_points'
ORDER BY ordinal_position;
SELECT pg_get_serial_sequence('pk_serial_points', 'point_id') AS sequence_name;`}
              caption="point_id এর data_type integer, serial না। column_default এ nextval('pk_serial_points_point_id_seq'::regclass), is_nullable NO। দ্বিতীয় ফলাফলে pg_get_serial_sequence জানাল Column এর পেছনের Sequence: public.pk_serial_points_point_id_seq।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফাঁদটা। DEFAULT কাজ করে শুধু মান না দিলে। কেউ নিজের হাতে নম্বর দিলে PostgreSQL চুপচাপ মেনে নেয়, আর
                Sequence জানেই না যে 3 এখন দখল। একদিন তার নিজের পালা আসে 3 দেওয়ার, আর তখন Error। বাস্তবে এটা ঘটে পুরনো
                Excel থেকে নিজেদের নম্বর সহ Row আনার পরে, প্রথম নতুন Booking এই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চুপচাপ ঢুকে পড়া 3"
              query={`DROP TABLE IF EXISTS pk_serial_points;
CREATE TABLE pk_serial_points (
  point_id serial PRIMARY KEY,
  name     text NOT NULL
);
INSERT INTO pk_serial_points (name) VALUES ('Kalabagan Counter');
-- পুরনো খাতা থেকে কেউ নিজের হাতে 3 বসাল
INSERT INTO pk_serial_points (point_id, name) VALUES (3, 'Uttara Counter');
INSERT INTO pk_serial_points (name) VALUES ('Arambagh Counter');
INSERT INTO pk_serial_points (name) VALUES ('Gabtoli Counter');`}
              caption={`Kalabagan পায় 1, Uttara নেয় নিজের 3, Arambagh পায় 2। চতুর্থটায় Sequence দেয় 3: ERROR: duplicate key value violates unique constraint "pk_serial_points_pkey", DETAIL: Key (point_id)=(3) already exists। দোষ Gabtoli এর না, দ্বিতীয় লাইনের।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই INSERT আবার চালালে এবার চলে যায়, কারণ ব্যর্থ চেষ্টাতেও 3 খরচ হয়ে গেছে, পরের চাপে আসে 4। কখনো Error, কখনো
              না, এমন Bug খোঁজাই সবচেয়ে কঠিন। উপরের Box এর পরে এটা চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আবার চাপ দিলেই চলে"
              query={`INSERT INTO pk_serial_points (name) VALUES ('Gabtoli Counter');
SELECT * FROM pk_serial_points ORDER BY point_id;`}
              caption="৪টা Row: 1 Kalabagan, 2 Arambagh, 3 Uttara, 4 Gabtoli। উপরের Box না চালালে relation does not exist আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আরেকটা অসুবিধা: serial এর Sequence Table থেকে আলাদা Object, তাই Table এ INSERT এর অনুমতি দিলেই হয় না,
                Sequence এর অনুমতিও আলাদা লাগে। নিচে PostgreSQL 18 Container এ একটা Role কে দুই Table এ শুধু INSERT এর অনুমতি
                দেওয়া হয়েছে (অনুমতির গল্প Module 16 এ)। Identity তে চলে, serial এ চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "serial-vs-identity-privileges.sql",
          code: `-- PostgreSQL 18.6, psql, island_tours
CREATE ROLE pk_clerk;
CREATE TABLE pk_serial_points (point_id serial PRIMARY KEY, name text NOT NULL);
CREATE TABLE pk_points (point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text NOT NULL);
GRANT INSERT ON pk_serial_points, pk_points TO pk_clerk;

SET ROLE pk_clerk;
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter');
-- INSERT 0 1
INSERT INTO pk_serial_points (name) VALUES ('Kalabagan Counter');
-- ERROR:  permission denied for sequence pk_serial_points_point_id_seq
RESET ROLE;

\\d pk_serial_points_point_id_seq
--            Sequence "public.pk_serial_points_point_id_seq"
--   Type   | Start | Minimum |  Maximum   | Increment | Cycles? | Cache
-- ---------+-------+---------+------------+-----------+---------+-------
--  integer |     1 |       1 | 2147483647 |         1 | no      |     1
-- Owned by: public.pk_serial_points.point_id`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নতুন Table এ serial না",
          content: (
            <ContentParagraph>
              serial PostgreSQL এর নিজস্ব, SQL Standard এ নেই। PostgreSQL 10 (2017) থেকে Standard এর Identity Column একই কাজ
              করে আরও নিরাপদে, আর PostgreSQL Wiki এর Don&apos;t Do This পাতা নতুন কাজে serial এর বদলে Identity ব্যবহার করতে
              বলে। পুরনো Project এর serial চলবে, শুধু নিজের হাতে id দিলে কী হয় জেনে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "identity-always",
      subHeader: { index: "008", title: "GENERATED ALWAYS AS IDENTITY" },
      title: <SectionTitle>নম্বর দেবে শুধু Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Island Tours এর প্রতিটা Table এর প্রথম লাইনটা পড়া যাক: <code className={CODE}>guide_id integer
                GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code>। শব্দে শব্দে ভাঙলে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>integer:</strong> Column এর আসল Type। serial এর মতো ছদ্মবেশ নেই।
                </ListItem>
                <ListItem>
                  <strong>GENERATED ... AS IDENTITY:</strong> মান Database বানাবে, নিজের বানানো একটা Sequence থেকে
                  (guides_guide_id_seq), যেটা Column এরই অংশ।
                </ListItem>
                <ListItem>
                  <strong>ALWAYS:</strong> সবসময় Database বানাবে। কেউ নিজের হাতে মান দিলে সেটা Error, চুপচাপ মেনে নেওয়া না।
                </ListItem>
                <ListItem>
                  <strong>PRIMARY KEY:</strong> আলাদা জিনিস। Identity নম্বর বানায়, অনন্যতা পাহারা দেয় PRIMARY KEY।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                serial এর ফাঁদটা এবার এই Column এ চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GENERATED ALWAYS, আর নিজের নম্বর"
              query={`DROP TABLE IF EXISTS pk_points;
CREATE TABLE pk_points (
  point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name     text NOT NULL
);
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter'), ('Arambagh Counter');
SELECT * FROM pk_points ORDER BY point_id;
-- পুরনো খাতার সেই 3
INSERT INTO pk_points (point_id, name) VALUES (3, 'Uttara Counter');`}
              caption={`SELECT এ 1 Kalabagan আর 2 Arambagh। তারপর ERROR: cannot insert a non-DEFAULT value into column "point_id", DETAIL: Column "point_id" is an identity column defined as GENERATED ALWAYS., HINT: Use OVERRIDING SYSTEM VALUE to override.। SQLSTATE 428C9। ভুলটা এবার যেখানে হয়েছে, Error ও ঠিক সেখানেই।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটাই ALWAYS এর উপহার: serial এ ভুলটা চুপচাপ ঢুকত আর Error আসত দিন পরে, অন্য কারও Insert এ। ALWAYS এ ভুলের
                মুহূর্তেই Error, সাথে লেখা কী লিখলে পার পাবেন। এই চেষ্টা কোনো নম্বরও খরচ করেনি, পরের DEFAULT পাবে 3। Island
                Tours এর আসল Table ও একই কথা বলে, নিচে guides এ নিজের id 6 সহ একজন Guide। Error হয়ে Statement বাতিল হয়, Sample
                Data বদলায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর guides ও একই কথা বলে"
              query={`INSERT INTO guides (guide_id, full_name, phone, language, hired_on)
VALUES (6, 'Test Guide', '+8801700000000', 'Bangla', DATE '2026-11-01');`}
              caption={`ERROR: cannot insert a non-DEFAULT value into column "guide_id", একই DETAIL আর HINT। guide_id বাদ দিলে Insert চলত, নতুন Guide পেতেন 6, আর এই Page এর guides এ একজন বাড়তি Guide থেকে যেত।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ALWAYS UPDATE ও পাহারা দেয়, Section 02 এর “চাবি বদলাবেন না” কথাটাকে নিয়ম বানিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ALWAYS এ id বদলানো যায় না"
              query={`DROP TABLE IF EXISTS pk_points;
CREATE TABLE pk_points (
  point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name     text NOT NULL
);
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter');
UPDATE pk_points SET point_id = 10 WHERE point_id = 1;`}
              caption={`ERROR: column "point_id" can only be updated to DEFAULT, DETAIL: Column "point_id" is an identity column defined as GENERATED ALWAYS.। SQLSTATE আবার 428C9।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো Data আনতে নম্বরগুলো ধরে রাখতে হলে HINT এর পথ: <code className={CODE}>OVERRIDING SYSTEM VALUE</code>,
                Column এর তালিকার পরে আর VALUES এর আগে। জেনেশুনে নিজের নম্বর বসানো, কিন্তু Sequence তখনো কিছু জানে না, আর
                serial এর পুরনো ফাঁদ ফিরে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OVERRIDING SYSTEM VALUE, আর আবার সেই ফাঁদ"
              query={`DROP TABLE IF EXISTS pk_points;
CREATE TABLE pk_points (
  point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name     text NOT NULL
);
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter'), ('Arambagh Counter');
INSERT INTO pk_points (point_id, name)
OVERRIDING SYSTEM VALUE
VALUES (3, 'Uttara Counter');
INSERT INTO pk_points (name) VALUES ('Gabtoli Counter');`}
              caption={`OVERRIDING দেওয়া INSERT চলে, Uttara বসে 3 এ। শেষ INSERT এ Sequence দেয় 3: ERROR: duplicate key value violates unique constraint "pk_points_pkey"। Sequence এগিয়ে দেওয়া আপনার দায়িত্ব, পরের Section এ।`}
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
                  Pickup Counter এর জন্য <code className={CODE}>pk_ex_pickups</code> Table বানান, এই ক্রমে দুটো Column:{" "}
                  <code className={CODE}>pickup_id</code> integer, যার মান সবসময় Database বানাবে আর নিজের হাতে দেওয়া মান
                  Error দেবে, আর যেটা Primary Key; <code className={CODE}>place</code> text NOT NULL। যাচাইয়ের Query টা শেষে
                  রেখে দিন।
                </>
              }
              hint={
                <>
                  Island Tours এর guides এর প্রথম লাইনটাই ছাঁচ। serial বা BY DEFAULT লিখলে identity_generation এর ঘরে মিলবে
                  না।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS pk_ex_pickups;
-- এখানে CREATE TABLE pk_ex_pickups লিখুন


-- যাচাইয়ের Query, এটা শেষে রেখে দিন
${columnCheck("pk_ex_pickups", "identity_generation")}`}
              solution={`SELECT * FROM (VALUES
  ('pickup_id', 'integer', 'ALWAYS', true),
  ('place',     'text',    NULL,     false)
) AS v(column_name, data_type, identity_generation, in_primary_key);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "by-default-vs-always",
      subHeader: { index: "009", title: "BY DEFAULT vs ALWAYS" },
      title: <SectionTitle>BY DEFAULT না ALWAYS, আর পিছিয়ে পড়া Sequence সারানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Identity এর দ্বিতীয় রূপ <code className={CODE}>GENERATED BY DEFAULT AS IDENTITY</code>: মান না দিলে Database
                বানায়, দিলে আপনারটা নেয়, Error ছাড়া। আচরণে serial এর মতো, তবে Standard আর আলাদা অনুমতি লাগে না। নিচের Lab এ
                তিনটা ধরন পাশাপাশি চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IdentityModesLab />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "serial", "GENERATED BY DEFAULT", "GENERATED ALWAYS"],
          rows: [
            ["নিজের হাতে id দিলে", "চুপচাপ মেনে নেয়", "চুপচাপ মেনে নেয়", "Error 428C9, OVERRIDING SYSTEM VALUE লাগে"],
            ["id UPDATE করলে", "চলে", "চলে", "Error: can only be updated to DEFAULT"],
            ["SQL Standard", "না, PostgreSQL এর নিজস্ব", "হ্যাঁ", "হ্যাঁ"],
            ["Sequence এর অনুমতি", "আলাদা করে দিতে হয়", "লাগে না", "লাগে না"],
            ["psql এর \\d এ Default", "nextval('..._seq'::regclass)", "generated by default as identity", "generated always as identity"],
            ["কখন বাছবেন", "নতুন কাজে না, পুরনো Project এ চলবে", "পুরনো Data নিয়মিত আনতে হলে", "প্রায় সব নতুন Table, Island Tours এর মতো"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়ম: নতুন Table এ ALWAYS। BY DEFAULT তখনই, যখন বাইরে থেকে নিয়মিত নিজেদের নম্বর সহ Row আসবে। আর নিজের হাতে
                নম্বর বসানোর পরে Sequence কে সবচেয়ে বড় id এর পরে এগিয়ে দিতেই হবে। নিচে পুরনো Excel এর তিনটা Row, তারপর প্রথম
                নতুন Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="BY DEFAULT: দিলে আপনারটা, না দিলে Sequence এর"
              query={`DROP TABLE IF EXISTS pk_imports;
CREATE TABLE pk_imports (
  import_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  note      text NOT NULL
);
-- পুরনো Excel এর তিনটা Row, নিজেদের নম্বর সহ
INSERT INTO pk_imports (import_id, note) VALUES
  (1, 'old 1'), (2, 'old 2'), (3, 'old 3');
-- Website থেকে প্রথম নতুন Row
INSERT INTO pk_imports (note) VALUES ('new');`}
              caption={`পুরনো তিনটা Row নির্বিঘ্নে ঢোকে, কোনো OVERRIDING লাগেনি। নতুন Row এ Sequence দেয় 1, তাই ERROR: duplicate key value violates unique constraint "pk_imports_pkey", DETAIL: Key (import_id)=(1) already exists।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সারানোর দুটো উপায়, দুটোই Section 06 এর জ্ঞান দিয়ে বোঝা যায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>setval:</strong> <code className={CODE}>pg_get_serial_sequence</code> দিয়ে Column এর Sequence এর
                  নাম বের করুন (নামটা serial এর জন্য বানানো, কিন্তু Identity তেও চলে), তারপর তার কাঁটা Table এর সবচেয়ে
                  বড় id তে বসান। পরের nextval দেবে তার পরেরটা।
                </ListItem>
                <ListItem>
                  <strong>ALTER TABLE ... RESTART:</strong> Identity Column এর নিজস্ব উপায়।{" "}
                  <code className={CODE}>ALTER TABLE pk_imports ALTER COLUMN import_id RESTART WITH 4;</code> মানে পরের নম্বর
                  হবে 4। ALTER TABLE এর বাকি সব কাজ আসবে Lesson 10 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নতুন Row এর id জানতে আবার SELECT লাগে না: INSERT এর শেষে <code className={CODE}>RETURNING import_id</code>।
                App এ এটা প্রতিদিনের কাজ, নতুন Booking এর id পেয়েই তার Payment লেখা হয়। পুরো রূপ Module 10 এর{" "}
                <Link href="/sql/topic/insert" className={LINK}>
                  INSERT and RETURNING
                </Link>{" "}
                লেসনে। উপরের Box চালানোর পরে নিচেরটা চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পিছিয়ে পড়া Sequence সারানো"
              query={`SELECT setval(
  pg_get_serial_sequence('pk_imports', 'import_id'),
  (SELECT max(import_id) FROM pk_imports)
);
INSERT INTO pk_imports (note) VALUES ('new') RETURNING import_id;
SELECT * FROM pk_imports ORDER BY import_id;`}
              caption="setval এর ফলাফল 3। তারপর INSERT ফেরত দিল import_id 4। শেষ SELECT এ ৪টা Row: old 1, old 2, old 3, new। প্রথম ব্যর্থ চেষ্টায় খরচ হওয়া 1 নিয়ে আর চিন্তা নেই, কারণ setval কাঁটাটাই সরিয়ে দিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Identity এর নিজস্ব শুরু আর লাফ",
          content: (
            <ContentParagraph>
              বন্ধনীতে Sequence এর Option দেওয়া যায়, যেমন{" "}
              <code className={CODE}>GENERATED ALWAYS AS IDENTITY (START WITH 1001)</code>। তবে নম্বর দেখতে কেমন, সেটা চাবির
              কাজ না। গ্রাহককে দেখানোর নম্বর চাইলে আলাদা Column রাখুন, কারণ পরের Section এ দেখবেন চাবিতে ফাঁক পড়বেই।
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
                  Starter এ <code className={CODE}>pk_ex_imports</code> এ পুরনো System থেকে ৫টা Row এসেছে, id 1 থেকে 5।
                  মাঝের ফাঁকা জায়গায় একটা Statement লিখুন, যাতে পরের নতুন Row Error না দিয়ে id 6 পায়। setval বা ALTER TABLE
                  ... RESTART, যেকোনোটা চলবে। বাকি Starter বদলাবেন না।
                </>
              }
              hint={
                <>
                  উপরের Box এর setval টা নিন, Table আর Column এর নাম বদলান। অথবা RESTART WITH 6।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS pk_ex_imports;
CREATE TABLE pk_ex_imports (
  import_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  note      text NOT NULL
);
INSERT INTO pk_ex_imports (import_id, note) VALUES
  (1, 'old 1'), (2, 'old 2'), (3, 'old 3'), (4, 'old 4'), (5, 'old 5');

-- এখানে আপনার Statement


-- নিচের দুটো বদলাবেন না
INSERT INTO pk_ex_imports (note) VALUES ('new');
SELECT import_id, note FROM pk_ex_imports ORDER BY import_id;`}
              solution={`SELECT * FROM (VALUES
  (1, 'old 1'), (2, 'old 2'), (3, 'old 3'),
  (4, 'old 4'), (5, 'old 5'), (6, 'new')
) AS v(import_id, note);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "gaps",
      subHeader: { index: "010", title: "Why Gaps Appear" },
      title: <SectionTitle>id তে ফাঁক কেন পড়ে, আর কেন সেটা ঠিক আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের প্রশ্ন: Booking এ 41 এর পরে 43, 42 কে মুছল? কেউ মোছেনি। 42 এর Booking কখনো তৈরিই হয়নি:
                গ্রাহক Payment এর আগে Page বন্ধ করেছিলেন, আর App পুরো কাজটা ROLLBACK করেছিল।
              </ContentParagraph>
              <ContentParagraph>
                Identity বা serial এ প্রতিটা INSERT সবার আগে nextval চাপে, তারপর NOT NULL দেখা, UNIQUE দেখা, Row লেখা। আর
                Section 06 এ দেখেছেন, দেওয়া নম্বর ফেরত আসে না। তাই এসব ঘটনায় নম্বর খরচ হয়, Row তৈরি হয় না:
              </ContentParagraph>
              <ContentList>
                <ListItem>INSERT হলো, কিন্তু পরে Transaction ROLLBACK হলো।</ListItem>
                <ListItem>INSERT অন্য কোনো Column এর NOT NULL, CHECK বা UNIQUE নিয়মে আটকে গেল।</ListItem>
                <ListItem>
                  <code className={CODE}>ON CONFLICT DO NOTHING</code> এ মিল পাওয়া গেল, Row বাদ পড়ল, কোনো Error ছাড়া। পুরো
                  গল্প Module 10 এর{" "}
                  <Link href="/sql/topic/upsert" className={LINK}>
                    Upsert
                  </Link>{" "}
                  লেসনে।
                </ListItem>
                <ListItem>Server হঠাৎ বন্ধ হয়ে গেল (Crash), তখন কিছু নম্বর হারাতে পারে।</ListItem>
                <ListItem>আর অবশ্যই, কেউ একটা Row DELETE করল।</ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের তিনটা Box ক্রম মেনে একবার করে চালান: একটা ROLLBACK, একটা ব্যর্থ INSERT, একটা সফল INSERT।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ ১: ROLLBACK এর পরে"
              query={`DROP TABLE IF EXISTS pk_tickets;
CREATE TABLE pk_tickets (
  ticket_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  passenger text NOT NULL
);
INSERT INTO pk_tickets (passenger) VALUES ('Nasrin');
BEGIN;
INSERT INTO pk_tickets (passenger) VALUES ('Rafiq');
ROLLBACK;
INSERT INTO pk_tickets (passenger) VALUES ('Sumon');
SELECT * FROM pk_tickets ORDER BY ticket_id;`}
              caption="২টা Row: 1 Nasrin আর 3 Sumon। Rafiq এর Row ROLLBACK এ চলে গেছে, কিন্তু তার নেওয়া 2 আর ফেরত আসেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ ২: ব্যর্থ INSERT"
              query={`INSERT INTO pk_tickets (passenger) VALUES (NULL);`}
              caption={`ERROR: null value in column "passenger" of relation "pk_tickets" violates not-null constraint, DETAIL: Failing row contains (4, null)। DETAIL টা ভালো করে দেখুন: আটকে যাওয়া Row এর ticket_id এর ঘরে 4। মানে NOT NULL দেখার আগেই নম্বরটা নেওয়া হয়ে গিয়েছিল।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ ৩: পরের সফল INSERT"
              query={`INSERT INTO pk_tickets (passenger) VALUES ('Mitu');
SELECT * FROM pk_tickets ORDER BY ticket_id;`}
              caption="৩টা Row: 1 Nasrin, 3 Sumon, 5 Mitu। কেউ কিছু মোছেনি, তবু 2 আর 4 নেই। ধাপ ২ বারবার চালালে Mitu আরও বড় নম্বর পাবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SequenceGapsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ON CONFLICT এর ঘটনা সবচেয়ে চুপচাপ, কোনো Error ই আসে না। নিচে Newsletter এর গ্রাহক, email অনন্য।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON CONFLICT ও নম্বর খায়"
              query={`DROP TABLE IF EXISTS pk_subscribers;
CREATE TABLE pk_subscribers (
  subscriber_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text NOT NULL UNIQUE
);
INSERT INTO pk_subscribers (email) VALUES ('nasrin@mail.example')
ON CONFLICT (email) DO NOTHING;
-- একই email আবার, কোনো Error আসবে না
INSERT INTO pk_subscribers (email) VALUES ('nasrin@mail.example')
ON CONFLICT (email) DO NOTHING;
INSERT INTO pk_subscribers (email) VALUES ('rafiq@mail.example')
ON CONFLICT (email) DO NOTHING;
SELECT * FROM pk_subscribers ORDER BY subscriber_id;`}
              caption="কোনো Error নেই, তবু 1 nasrin আর 3 rafiq। দ্বিতীয় INSERT কোনো Row ঢোকায়নি (psql এ INSERT 0 0), কিন্তু মিল খোঁজার আগেই 2 নিয়েছিল। Documentation এর nextval সতর্কবাণীতে ঠিক এই ঘটনার উল্লেখ আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SequenceGapLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ফাঁকহীন নম্বর চাইলে Primary Key দিয়ে না",
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Primary Key এর কাজ শুধু Row চেনানো, 1, 3, 5 দিয়েও সেটা নিখুঁত হয়। তাই ফাঁক ভরানোর চেষ্টা করবেন না, আর id দিয়ে
                Row গুনবেন না: সবচেয়ে বড় id 5 মানে Row ৫টা না, count(*) লাগে।
              </ContentParagraph>
              <ContentParagraph>
                হিসাবের খাতার Invoice নম্বরের মতো কিছু কাজে সত্যিই ফাঁকহীন নম্বর লাগে। সেটা চাবির কাজ না। শুধু দেখানোর জন্য হলে{" "}
                <Link href="/sql/topic/ranking-functions" className={LINK}>
                  ROW_NUMBER()
                </Link>{" "}
                দিয়ে Report এর সময় ক্রমিক নম্বর বসান। সংরক্ষণ করতে হলে আলাদা একটা Counter Table, যেটা Transaction এর ভেতরে Lock
                নিয়ে বাড়ানো হয়। Documentation নিজেই বলে এটা Sequence এর চেয়ে অনেক ধীর, কারণ সবাইকে লাইনে দাঁড়াতে হয় (Module 12)।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "uuid-keys",
      subHeader: { index: "011", title: "UUID Keys" },
      title: <SectionTitle>নম্বরের বদলে UUID</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব Website এ নিজের Booking দেখছিলেন, ঠিকানায় <code className={CODE}>/bookings/17</code>। কৌতূহলে 18
                লিখলেন, আর আরেকজন গ্রাহকের নাম আর ফোন খুলে গেল। আসল দোষ App এর, সে দেখেনি Booking টা কার (Module 16)। কিন্তু
                বাড়তে থাকা নম্বর আন্দাজ করা সহজ, আর নম্বর দেখে বোঝাও যায় মোট কয়টা Booking হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা সমাধান UUID (Universally Unique Identifier): 128 bit এর মান, লেখা হয় 36 অক্ষরে, যেমন{" "}
                <code className={CODE}>5b30857f-0bfa-48b5-ac0b-5c64e28078d1</code>। এত বড় জগৎ থেকে এলোমেলো বাছা হয় যে দুই
                জায়গায় একই UUID হওয়ার সম্ভাবনা কার্যত শূন্য। তাই Sequence লাগে না, App বা Phone নিজেও বানাতে পারে। uuid Type
                দেখেছেন{" "}
                <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                  Lesson 06
                </Link>{" "}
                এ, এখানে দেখবেন চাবি হিসেবে UUID কেমন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UUID চাবির Table"
              query={`DROP TABLE IF EXISTS pk_vouchers;
CREATE TABLE pk_vouchers (
  voucher_id   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code         text NOT NULL UNIQUE,
  discount_pct integer NOT NULL
);
INSERT INTO pk_vouchers (code, discount_pct)
VALUES ('EID-2026', 10), ('PUJA-2026', 15)
RETURNING voucher_id, code;`}
              caption="২টা Row, প্রতিটার voucher_id একটা নতুন UUID, প্রতিবার আলাদা। Identity নেই, চাবি আসে DEFAULT gen_random_uuid() থেকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                gen_random_uuid() বানায় প্রায় পুরোটা এলোমেলো Version 4 (PostgreSQL 18 এ আরেক নাম uuidv4())। PostgreSQL 18 এর
                নতুন <code className={CODE}>uuidv7()</code> এর শুরুতে থাকে তৈরির সময়, বাকিটা এলোমেলো, তাই মানগুলো সময়ের ক্রমে
                বাড়ে অথচ আন্দাজ করা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Version 7 বনাম Version 4"
              query={`SELECT id, uuid_extract_version(id) AS version,
       uuid_extract_timestamp(id) AS made_at
FROM (SELECT uuidv7() AS id FROM generate_series(1, 3)) AS t;
SELECT id, uuid_extract_version(id) AS version,
       uuid_extract_timestamp(id) AS made_at
FROM (SELECT gen_random_uuid() AS id FROM generate_series(1, 3)) AS t;`}
              caption="প্রথম ফলাফলে version 7, id এর শুরুর অক্ষর প্রায় এক আর ক্রমে বাড়ছে, made_at এ এখনকার সময়। দ্বিতীয়টায় version 4, id এলোমেলো, made_at NULL, কারণ Version 4 এ কোনো সময় থাকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UUID এর প্রথম দাম জায়গা, আর text Column এ রাখলে আরও বেশি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা চাবির মাপ কত Byte"
              query={`SELECT pg_column_size(1::integer)              AS integer_bytes,
       pg_column_size(1::bigint)               AS bigint_bytes,
       pg_column_size(gen_random_uuid())       AS uuid_bytes,
       pg_column_size(gen_random_uuid()::text) AS uuid_as_text_bytes;`}
              caption="4, 8, 16, 40। চাবি থাকে Table এ, তার Index এ, আর যত Table তাকে দেখায় তাদের Column আর Index এ। তাই প্রতিটা বাড়তি Byte অনেকবার গুণ হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় দাম Index এ: বাড়তে থাকা চাবি সবসময় B-tree এর শেষে বসে, এলোমেলো UUID যেকোনো জায়গায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <KeyLocalitySplit />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "integer বা bigint Identity", "uuid, Version 4", "uuid, Version 7"],
          rows: [
            ["মাপ", "4 বা 8 Byte", "16 Byte", "16 Byte"],
            ["কে বানায়", "Database এর Sequence", "যে কেউ: Database, App, Phone", "যে কেউ: Database, App, Phone"],
            ["আন্দাজ করা যায়?", "হ্যাঁ, 17 এর পরে 18", "না", "না, তবে তৈরির সময় পড়া যায়"],
            ["নতুন চাবি Index এর কোথায়", "সবসময় শেষে", "যেকোনো জায়গায়", "প্রায় সবসময় শেষে"],
            ["মানুষের পড়া আর বলা", "সহজ: Booking 17", "কঠিন", "কঠিন"],
            ["দুই Database এর Data মেলানো", "একই নম্বর দুই জায়গায় থাকতে পারে", "সংঘর্ষের ভয় নেই", "সংঘর্ষের ভয় নেই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাধারণ সিদ্ধান্ত: একটা Database এর ছোট বা মাঝারি App এ integer বা bigint Identity। চাবি বাইরে দেখা গেলে (URL,
                API) বা Data অনেক জায়গায় তৈরি হয়ে পরে মিললে UUID, PostgreSQL 18 এ uuidv7। অনেক দল দুটোই রাখে: ভেতরে integer
                চাবি, বাইরে দেখানোর জন্য UNIQUE একটা UUID Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  <code className={CODE}>pk_ex_vouchers</code> Table বানান: <code className={CODE}>voucher_id</code> uuid,
                  Primary Key, মান না দিলে Database নিজে একটা এলোমেলো UUID বসাবে; <code className={CODE}>code</code> text,
                  খালি না, অনন্য। Starter এর শেষের INSERT আর যাচাইয়ের Query দুটোই রেখে দিন।
                </>
              }
              hint={
                <>
                  উপরের pk_vouchers এর CREATE TABLE থেকে discount_pct বাদ দিলেই হয়। DEFAULT না দিলে শেষের INSERT এ voucher_id
                  NULL হয়ে Error আসবে।
                </>
              }
              starter={`DROP TABLE IF EXISTS pk_ex_vouchers;
-- এখানে CREATE TABLE pk_ex_vouchers লিখুন


-- নিচের দুটো রেখে দিন
INSERT INTO pk_ex_vouchers (code) VALUES ('EID-2026'), ('PUJA-2026');
SELECT count(*) AS vouchers,
       count(DISTINCT voucher_id) AS distinct_ids,
       (SELECT data_type FROM information_schema.columns
        WHERE table_name = 'pk_ex_vouchers'
          AND column_name = 'voucher_id') AS id_type,
       (SELECT count(*) FROM pg_constraint
        WHERE conrelid = 'pk_ex_vouchers'::regclass
          AND contype = 'p') AS primary_keys
FROM pk_ex_vouchers;`}
              solution={`SELECT 2 AS vouchers, 2 AS distinct_ids, 'uuid' AS id_type, 1 AS primary_keys;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "choosing-a-key",
      subHeader: { index: "012", title: "Choosing a Key" },
      title: <SectionTitle>integer না bigint, আর কোন Column হবে চাবি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                integer এর সবচেয়ে বড় মান 2147483647, প্রায় ২১৪ কোটি। ২৪টা Booking এর পাশে অসীম মনে হয়, কিন্তু Click, Log বা
                Notification এর Table খুব দ্রুত বাড়ে। নিচে RESTART WITH দিয়ে কাঁটা সোজা সীমায়, যেন কয়েক বছর পার হয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="integer এর শেষ সীমা"
              query={`DROP TABLE IF EXISTS pk_clicks;
CREATE TABLE pk_clicks (
  click_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page     text NOT NULL
);
-- কয়েক বছরের Click এক লাফে পার
ALTER TABLE pk_clicks ALTER COLUMN click_id RESTART WITH 2147483647;
INSERT INTO pk_clicks (page) VALUES ('/tours') RETURNING click_id;
INSERT INTO pk_clicks (page) VALUES ('/tours/7');`}
              caption={`প্রথম INSERT পায় 2147483647, শেষ বৈধ নম্বর। দ্বিতীয়টায় ERROR: nextval: reached maximum value of sequence "pk_clicks_click_id_seq" (2147483647)। এখন থেকে এই Table এ আর একটা Row ও ঢুকবে না।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সেকেন্ডে 100টা Row হলে কত বছর"
              query={`SELECT round(2147483647 / (100 * 86400 * 365.0), 2) AS integer_years,
       round(9223372036854775807 / (100 * 86400 * 365.0)) AS bigint_years;`}
              caption="integer শেষ 0.68 বছরে, মানে আট মাসের একটু বেশি। bigint শেষ হতে লাগবে 2924712087 বছর, প্রায় ২৯২ কোটি বছর। একটা দিনে 86400 সেকেন্ড, এক বছরে 365 দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছোট Table এ integer যথেষ্ট, কিন্তু যে Table বছরের পর বছর দ্রুত বাড়বে, সেখানে শুরু থেকেই bigint, প্রতি Row এ
                মাত্র ৪ Byte বেশি। পরে বদলানো যায় (Lesson 10), কিন্তু বড় Table এ সেটা পুরো Table নতুন করে লেখে, আর যত Table এই
                চাবিকে দেখায় তাদেরও বদলাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় প্রশ্ন: email ও তো অনন্য, তাহলে customer_id কেন? যে চাবির নিজের কোনো অর্থ নেই, শুধু চেনানোর জন্য
                বানানো (customer_id 7), তাকে বলে Surrogate Key। যে চাবি বাস্তবের তথ্য (email, NID, Passport নম্বর), সেটা
                Natural Key।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বদলায়:</strong> মানুষ email বদলান, তখন সব Table এ বদলাতে হতো।
                </ListItem>
                <ListItem>
                  <strong>সবসময় থাকে না:</strong> বিদেশি পর্যটকের NID নেই।
                </ListItem>
                <ListItem>
                  <strong>গোপন হতে পারে:</strong> চাবি URL আর Log এ ছড়ায়, NID সেখানে থাকা উচিত না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই বেশিরভাগ চাবি Surrogate। কিন্তু তার একটা ফাঁদ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="id দিলেই Duplicate বন্ধ হয় না"
              query={`DROP TABLE IF EXISTS pk_counters;
CREATE TABLE pk_counters (
  counter_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL
);
INSERT INTO pk_counters (name) VALUES ('Kalabagan Counter');
INSERT INTO pk_counters (name) VALUES ('Kalabagan Counter');
SELECT * FROM pk_counters ORDER BY counter_id;`}
              caption="২টা Row: 1 Kalabagan Counter, 2 Kalabagan Counter। Primary Key কোনো আপত্তি করেনি, কারণ 1 আর 2 আলাদা। Section 01 এর সেই দ্বিতীয় চাপ আবার ঢুকে গেল, এবার শুধু আলাদা নম্বর গায়ে নিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Surrogate Key Row গুলোকে আলাদা করে চেনায়, কিন্তু বাস্তবের একই জিনিস দুইবার ঢোকা আটকায় না। সেই কাজ Natural
              Column এর UNIQUE এর। Island Tours এর customers ঠিক এভাবে বানানো: চাবি customer_id, আর email এর উপর আলাদা
              UNIQUE।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="customers: Surrogate চাবি, Natural UNIQUE"
              query={`SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'customers'::regclass
  AND contype IN ('p', 'u')
ORDER BY contype;`}
              caption="২টা Row: customers_pkey (p) PRIMARY KEY (customer_id), আর customers_email_key (u) UNIQUE (email)। চেনানোর জন্য নম্বর, Duplicate আটকানোর জন্য email। দুটো আলাদা কাজ, দুটো আলাদা Constraint।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Natural বনাম Surrogate এর পুরো তর্ক Module 11 এ",
          content: (
            <ContentParagraph>
              কখন Natural Key ই ভালো (দেশের কোড BD বা মুদ্রার কোড BDT, যেগুলো প্রায় বদলায় না), Candidate Key কীভাবে খুঁজবেন,
              এসবের বিস্তারিত Module 11 এর{" "}
              <Link href="/sql/topic/keys-deep-dive" className={LINK}>
                Keys in Depth
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
      title: <SectionTitle>MySQL এ AUTO_INCREMENT</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PRIMARY KEY এর Syntax MySQL এ হুবহু একই, Composite Key ও একইভাবে লেখা হয়। পার্থক্য নম্বর বানানোয়। MySQL এ
                Identity Column নেই, Sequence ও নেই (দুটোই লিখলে ERROR 1064)। আছে একটা শব্দ:{" "}
                <code className={CODE}>AUTO_INCREMENT</code>। Island Tours এর MySQL সংস্করণে প্রতিটা Table এর প্রথম লাইন{" "}
                <code className={CODE}>guide_id INT AUTO_INCREMENT PRIMARY KEY</code>। নিচের সব ফলাফল এই ট্র্যাকের MySQL
                8.4 Container থেকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নিজের id দিলে Counter এগিয়ে যায়:</strong> serial এর সাথে সবচেয়ে বড় পার্থক্য। 1 এর পরে কেউ নিজে 3
                  দিলে Counter চলে যায় 4 এ, পরের নতুন Row পায় 4, কোনো Error নেই।
                </ListItem>
                <ListItem>
                  <strong>NULL বা 0 দিলেও নতুন নম্বর:</strong> id এর ঘরে NULL বা 0 পাঠালে MySQL সেটাকে মান না দেওয়ার মতোই
                  ধরে (0 এর এই আচরণ NO_AUTO_VALUE_ON_ZERO নামের SQL Mode বদলে দেয়)।
                </ListItem>
                <ListItem>
                  <strong>ফাঁক এখানেও পড়ে:</strong> ROLLBACK, অন্য কোনো UNIQUE Column এ আটকে যাওয়া INSERT, আর INSERT IGNORE,
                  তিনটাতেই নম্বর খরচ হয়েছে। একটা পার্থক্য দেখা গেছে: NOT NULL এ আটকে যাওয়া INSERT এ MySQL 8.4 নম্বর খরচ
                  করেনি, PostgreSQL করেছিল।
                </ListItem>
                <ListItem>
                  <strong>Counter Restart এর পরেও মনে থাকে:</strong> MySQL 8.0 থেকে। 1 থেকে 5 এর মধ্যে 4 আর 5 মুছে Restart
                  দেওয়ার পরেও নতুন Row পেয়েছে 6। MySQL 5.7 এ Restart এর পরে Counter হতো বাকি Row এর max + 1।
                </ListItem>
                <ListItem>
                  <strong>নতুন id:</strong> RETURNING নেই, তার বদলে একই Connection এ <code className={CODE}>SELECT
                  LAST_INSERT_ID();</code>।
                </ListItem>
                <ListItem>
                  <strong>নাম সবসময় PRIMARY:</strong> নিজের নাম দিলেও MySQL রাখে PRIMARY, Error এ table.PRIMARY।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-auto-increment.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
CREATE TABLE pk_points (
  point_id INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL
);
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter');            -- পায় 1
SELECT LAST_INSERT_ID();                                              -- 1
INSERT INTO pk_points (point_id, name) VALUES (3, 'Uttara Counter');  -- নিজের 3
INSERT INTO pk_points (name) VALUES ('Arambagh Counter');             -- পায় 4, Error নেই
INSERT INTO pk_points (point_id, name) VALUES (2, 'Gabtoli Counter'); -- ফাঁকা 2 এ বসল
INSERT INTO pk_points (point_id, name) VALUES (NULL, 'Mohakhali Counter'); -- পায় 5
INSERT INTO pk_points (point_id, name) VALUES (0, 'Sayedabad Counter');    -- পায় 6

INSERT INTO pk_points (point_id, name) VALUES (1, 'Duplicate');
-- ERROR 1062 (23000): Duplicate entry '1' for key 'pk_points.PRIMARY'

START TRANSACTION;
INSERT INTO pk_points (name) VALUES ('Rolled back');                  -- নেয় 7
ROLLBACK;
INSERT INTO pk_points (name) VALUES ('After rollback');               -- পায় 8, 7 হারাল

SHOW CREATE TABLE pk_points\\G
-- ... PRIMARY KEY (\`point_id\`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 ...

CREATE TABLE pk_two (a INT PRIMARY KEY, b INT PRIMARY KEY);
-- ERROR 1068 (42000): Multiple primary key defined

CREATE TABLE pk_bad_auto (a INT AUTO_INCREMENT, b INT);
-- ERROR 1075 (42000): Incorrect table definition; there can be only one auto column
--                     and it must be defined as a key

CREATE TABLE pk_ident (a INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY);
-- ERROR 1064 (42000): ... near 'IDENTITY PRIMARY KEY)'
CREATE SEQUENCE pk_token_seq;
-- ERROR 1064 (42000): ... near 'SEQUENCE pk_token_seq'

CREATE TABLE pk_guide_languages (
  guide_id INT, language VARCHAR(30), level VARCHAR(20) NOT NULL,
  PRIMARY KEY (guide_id, language)
);
INSERT INTO pk_guide_languages VALUES (1, 'English', 'fluent');
INSERT INTO pk_guide_languages VALUES (1, 'English', 'basic');
-- ERROR 1062 (23000): Duplicate entry '1-English' for key 'pk_guide_languages.PRIMARY'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Primary Key এর গুরুত্ব আরও বেশি। এর InnoDB Storage Engine Table টাকেই Primary Key এর ক্রমে সাজিয়ে রাখে
                (Clustered Index), আর বাকি সব Index এ প্রতিটা Row এর পাশে তার Primary Key লেখা থাকে। তাই লম্বা চাবি (CHAR(36)
                এ UUID) সব Index কে মোটা করে, আর এলোমেলো চাবি পুরো Table কে এলোমেলো জায়গায় লেখায়। UUID রাখতে হলে প্রচলিত
                উপায় BINARY(16) আর <code className={CODE}>UUID_TO_BIN(UUID(), 1)</code>, যেটা সময়ের অংশ সামনে এনে ক্রম ঠিক
                রাখে। Primary Key না দিলে InnoDB প্রথম UNIQUE NOT NULL Index টা নেয়, সেটাও না থাকলে একটা লুকানো 6 Byte এর Row
                ID বানায়। <code className={CODE}>sql_require_primary_key</code> চালু করলে (8.4 এ স্বাভাবিকভাবে বন্ধ) চাবি ছাড়া
                CREATE TABLE এ ERROR 3750। PostgreSQL এ Table আর Index আলাদা থাকে, সেই পার্থক্য Module 13 এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Counter আর কোন Bus কোথা থেকে, দুটো Table</SectionTitle>,
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
                এবার শুরুর কাজটা শেষ করা যাক: প্রতিটা Departure এর পাশে কোন Counter থেকে কয়টায় Bus। তানিম আগে দুটো প্রশ্নের
                উত্তর দিলেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>pk_pickups এর একটা Row কী?</strong> একটা Counter। তাই Surrogate চাবি, Identity দিয়ে, আর Section 01
                  এর দ্বিতীয় চাপ আটকাতে নামের উপর UNIQUE।
                </ListItem>
                <ListItem>
                  <strong>pk_departure_pickups এর একটা Row কী?</strong> একটা Departure আর একটা Counter এর সম্পর্ক, সাথে
                  সময়। তাই চাবি জোড়াটা: <code className={CODE}>PRIMARY KEY (departure_id, pickup_id)</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                departure_id আর pickup_id সত্যিই আছে কিনা, সেই পাহারা Foreign Key এর, পরের লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো Table, দুই রকম চাবি"
              query={`DROP TABLE IF EXISTS pk_departure_pickups;
DROP TABLE IF EXISTS pk_pickups;
CREATE TABLE pk_pickups (
  pickup_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      text NOT NULL UNIQUE,
  area      text NOT NULL
);
CREATE TABLE pk_departure_pickups (
  departure_id integer,
  pickup_id    integer,
  pickup_time  time NOT NULL,
  PRIMARY KEY (departure_id, pickup_id)
);
INSERT INTO pk_pickups (name, area) VALUES
  ('Kalabagan Counter',   'Dhanmondi'),
  ('Arambagh Counter',    'Motijheel'),
  ('Abdullahpur Counter', 'Uttara'),
  ('Sayedabad Counter',   'Jatrabari')
RETURNING pickup_id, name;`}
              caption="RETURNING ৪টা Row ফেরত দিল: 1 Kalabagan, 2 Arambagh, 3 Abdullahpur, 4 Sayedabad। নম্বরগুলো কেউ লেখেনি, Identity দিয়েছে, আর RETURNING দিয়ে সাথে সাথে জানা গেল, যাতে পরের Table এ ব্যবহার করা যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার ঢাকা থেকে ছাড়া তিনটা আসন্ন Departure: 14 (Sylhet, 14 November), 12 (Sajek, 11 December), 13 (Bandarban, 8
              January)। প্রতিটার দুটো করে Counter। উপরের Box চালানোর পরে নিচেরটা চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন Departure কোন Counter থেকে"
              query={`INSERT INTO pk_departure_pickups (departure_id, pickup_id, pickup_time) VALUES
  (14, 1, '22:00'), (14, 3, '23:00'),
  (12, 1, '21:00'), (12, 4, '21:45'),
  (13, 2, '20:30'), (13, 4, '21:15');
SELECT d.departure_id, t.title, d.starts_on, p.name AS pickup, dp.pickup_time
FROM pk_departure_pickups dp
JOIN departures d ON d.departure_id = dp.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
JOIN pk_pickups p ON p.pickup_id = dp.pickup_id
ORDER BY d.starts_on, dp.pickup_time;`}
              caption="৬টা Row: Sylhet এর Kalabagan 22:00:00 আর Abdullahpur 23:00:00, Sajek এর Kalabagan 21:00:00 আর Sayedabad 21:45:00, Bandarban এর Arambagh 20:30:00 আর Sayedabad 21:15:00। প্রতিটা জোড়া একবার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার দুই পাহারার পরীক্ষা: Sajek এর Kalabagan আবার, তারপর Kalabagan Counter নতুন করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়া চাবির পাহারা"
              query={`INSERT INTO pk_departure_pickups (departure_id, pickup_id, pickup_time)
VALUES (12, 1, '21:10');`}
              caption={`ERROR: duplicate key value violates unique constraint "pk_departure_pickups_pkey", DETAIL: Key (departure_id, pickup_id)=(12, 1) already exists। সময় বদলাতে চাইলে নতুন Row না, পুরনো Row টা UPDATE (Module 10)।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নামের UNIQUE এর পাহারা"
              query={`INSERT INTO pk_pickups (name, area) VALUES ('Kalabagan Counter', 'Dhanmondi');`}
              caption={`ERROR: duplicate key value violates unique constraint "pk_pickups_name_key"। Surrogate চাবি একা এটা আটকাত না। আর এই ব্যর্থ চেষ্টাও একটা নম্বর খেয়েছে: পরের Counter পাবে 6, 5 না।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পরের Counter এর নম্বর"
              query={`INSERT INTO pk_pickups (name, area) VALUES ('Mohakhali Counter', 'Mohakhali')
RETURNING pickup_id, name;`}
              caption="pickup_id 6, Mohakhali Counter। ঠিক আগের Box এর ব্যর্থ INSERT 5 নিয়ে গেছে। কোনো Row মোছা হয়নি, তবু ফাঁক, আর এতে কোনো ক্ষতি নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  Saint Martin এর জাহাজের জন্য দুটো Table বানান। <code className={CODE}>pk_ch_ships</code>:{" "}
                  <code className={CODE}>ship_id</code> integer, সবসময় Database এর বানানো, Primary Key;{" "}
                  <code className={CODE}>name</code> text, খালি না, অনন্য। <code className={CODE}>pk_ch_ship_seats</code>:{" "}
                  <code className={CODE}>ship_id</code> integer, <code className={CODE}>seat_code</code> text,{" "}
                  <code className={CODE}>deck</code> text NOT NULL, যেখানে একই জাহাজে একটা Seat Code একবারই থাকতে পারে, কিন্তু
                  আলাদা জাহাজে একই Seat Code থাকতে পারে। চাবির ক্রম: আগে ship_id। যাচাইয়ের Query টা শেষে রেখে দিন।
                </>
              }
              hint={
                <>
                  প্রথম Table এর ছাঁচ এই Section এর pk_pickups, দ্বিতীয়টার ছাঁচ pk_departure_pickups। ফলাফলে ৪টা Row আসার
                  কথা: দুটো Primary Key এর তিনটা Column আর একটা UNIQUE।
                </>
              }
              starter={`DROP TABLE IF EXISTS pk_ch_ship_seats;
DROP TABLE IF EXISTS pk_ch_ships;
-- এখানে দুটো CREATE TABLE লিখুন


-- যাচাইয়ের Query, এটা শেষে রেখে দিন
SELECT tc.table_name, tc.constraint_type, k.column_name, k.ordinal_position,
       (SELECT c.identity_generation
        FROM information_schema.columns c
        WHERE c.table_name = k.table_name
          AND c.column_name = k.column_name) AS identity_generation
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage k
  ON k.constraint_name = tc.constraint_name
 AND k.table_name = tc.table_name
WHERE tc.table_name IN ('pk_ch_ships', 'pk_ch_ship_seats')
  AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE');`}
              solution={`SELECT * FROM (VALUES
  ('pk_ch_ships',      'PRIMARY KEY', 'ship_id',   1, 'ALWAYS'),
  ('pk_ch_ships',      'UNIQUE',      'name',      1, NULL),
  ('pk_ch_ship_seats', 'PRIMARY KEY', 'ship_id',   1, NULL),
  ('pk_ch_ship_seats', 'PRIMARY KEY', 'seat_code', 2, NULL)
) AS v(table_name, constraint_type, column_name, ordinal_position, identity_generation);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>নতুন Table এর চাবি ঠিক করার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "এক বাক্যে বলুন, একটা Row কী",
              description:
                "একটা Counter? একটা Booking? একজন Guide এর একটা ভাষা? এই বাক্যটাই ঠিক করে চাবি কী হবে। বাক্য পরিষ্কার না হলে Table টাই হয়তো দুটো Table হওয়ার কথা।",
            },
            {
              title: "Row কি দুটো জিনিসের সম্পর্ক?",
              description:
                "হলে সেই দুই জিনিসের id মিলে Composite Key: PRIMARY KEY (departure_id, pickup_id)। যে Column দিয়ে বেশি খোঁজা হবে, সেটা আগে।",
            },
            {
              title: "না হলে Surrogate চাবি, Identity দিয়ে",
              description:
                "integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY। Table বছরের পর বছর দ্রুত বাড়বে (Click, Log, Event) মনে হলে integer এর জায়গায় bigint। serial না।",
            },
            {
              title: "চাবি কি বাইরে দেখা যাবে?",
              description:
                "URL বা API তে চাবি দেখা গেলে, অথবা Data অনেক জায়গায় তৈরি হয়ে পরে মিললে uuid, PostgreSQL 18 এ DEFAULT uuidv7()। নয়তো ভেতরে নম্বর রেখে বাইরের জন্য আলাদা UUID Column।",
            },
            {
              title: "বাস্তবের অনন্য জিনিসে UNIQUE",
              description:
                "email, Counter এর নাম, Voucher Code: যে জিনিস বাস্তবে দুইবার থাকার কথা না, তার উপর UNIQUE। Surrogate চাবি একা Duplicate আটকায় না।",
            },
            {
              title: "পুরনো Data আনার পরিকল্পনা",
              description:
                "নিজেদের নম্বর সহ Row আনতে হলে ALWAYS এ OVERRIDING SYSTEM VALUE, অথবা BY DEFAULT। আনার পরপরই setval বা ALTER TABLE ... RESTART WITH, নইলে প্রথম নতুন Row এ duplicate key।",
            },
            {
              title: "চালিয়ে যাচাই",
              description:
                "psql এ \\d দিয়ে দেখুন Indexes এ PRIMARY KEY আছে কিনা। তারপর একবার Duplicate আর একবার NULL দিয়ে Insert চেষ্টা করুন, দুটোই Error দিলে চাবি কাজ করছে।",
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
          headers: ["ভুল", "যা ঘটে", "ঠিক উপায়"],
          rows: [
            ["চাবি ছাড়া Table", "হুবহু একই Row, তার একটাকে আলাদা করে মোছা বা বদলানো যায় না", "প্রতিটা Table এ একটা Primary Key"],
            ["Composite Key এর দুই Column এর পাশে আলাদা PRIMARY KEY", "multiple primary keys ... are not allowed", "শেষে এক লাইনে PRIMARY KEY (a, b)"],
            ["নতুন Table এ serial", "নিজের হাতে দেওয়া id চুপচাপ ঢোকে, দিন পরে অন্য কারও Insert এ duplicate key", "integer GENERATED ALWAYS AS IDENTITY"],
            ["নিজের id বসিয়ে Sequence না সারানো", "কয়েকটা Insert পরে duplicate key, এলোমেলোভাবে", "আনার পরপরই setval বা RESTART WITH"],
            ["id এর ফাঁক ভরানোর চেষ্টা", "অকারণ কাজ, আর পুরনো id আবার ব্যবহারে ভুল Data জোড়া লাগে", "ফাঁক স্বাভাবিক, দেখানোর নম্বর আলাদা রাখুন"],
            ["সবচেয়ে বড় id দিয়ে Row গোনা", "1, 3, 5 এ max 5, Row আসলে ৩টা", "count(*)"],
            ["Surrogate চাবিকেই Duplicate এর পাহারাদার ভাবা", "একই Counter দুই id তে দুইবার", "Natural Column এ UNIQUE"],
            ["দ্রুত বাড়া Table এ integer", "reached maximum value of sequence, Insert বন্ধ", "শুরু থেকেই bigint"],
            ["email বা ফোন নম্বরকে চাবি বানানো", "বদলালে সব Table এ বদলাতে হয়, গোপন তথ্য URL এ ছড়ায়", "Surrogate চাবি আর email এ UNIQUE"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS pk_fix_tour_tags;
CREATE TABLE pk_fix_tour_tags (
  tour_id integer PRIMARY KEY,
  tag     text PRIMARY KEY
);
INSERT INTO pk_fix_tour_tags VALUES (1, 'beach'), (1, 'family'), (2, 'beach');
SELECT count(*) AS tags FROM pk_fix_tour_tags;`}
              caption={`এখানে একটা ভুল আছে, তাই ERROR: multiple primary keys for table "pk_fix_tour_tags" are not allowed। দুটো Column এর পাশ থেকে PRIMARY KEY মুছে দিন, tag এর পরে কমা দিয়ে নতুন লাইনে লিখুন PRIMARY KEY (tour_id, tag)। ঠিক হলে ফলাফল একটা Row: tags 3।`}
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
                    href="https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Primary Keys
                  </a>
                  : UNIQUE আর NOT NULL এর যোগফল, একটা Table এ একটাই, পেছনে Unique B-tree Index।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/ddl-identity-columns.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Identity Columns
                  </a>
                  : ALWAYS বনাম BY DEFAULT আর OVERRIDING SYSTEM VALUE।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-sequence.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Sequence Manipulation Functions
                  </a>
                  : nextval, currval, setval, আর ফাঁক নিয়ে সেই সতর্কবাণী।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Serial Types
                  </a>
                  : serial আসলে কী লেখে, সেই চারটা কাজ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don.27t_use_serial"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Wiki: Don&apos;t Do This, Don&apos;t use serial
                  </a>
                  : PostgreSQL এর মানুষদের নিজেদের তালিকা, কোন অভ্যাস ছাড়তে হবে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-uuid.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UUID Functions
                  </a>
                  : gen_random_uuid, uuidv7 আর uuid_extract_ ফাংশনগুলো।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/example-auto-increment.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Using AUTO_INCREMENT
                  </a>
                  : NULL বা 0 দিলে নতুন নম্বর, নিজের বড় নম্বরে Counter এগোনো।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/innodb-auto-increment-handling.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: AUTO_INCREMENT Handling in InnoDB
                  </a>
                  : Restart এর পরেও Counter টিকে থাকা আর ফাঁকের কারণ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Clustered and Secondary Indexes
                  </a>
                  : Table কেন Primary Key এর ক্রমে, আর লুকানো Row ID।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সের AUTO_INCREMENT দেওয়া Table গুলো PostgreSQL এ GENERATED ALWAYS AS IDENTITY দিয়ে আবার লিখুন, আর
                  নিজের হাতে id দিলে দুই জায়গায় কী হয় মিলিয়ে নিন।
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
                  Primary Key একটা Row এর অনন্য, কখনো খালি না থাকা পরিচয়। PRIMARY KEY = UNIQUE + NOT NULL, একটা Table এ
                  একটাই।
                </ListItem>
                <ListItem>
                  PRIMARY KEY লিখলে পেছনে তৈরি হয় table_pkey নামের Constraint, একই নামের Unique B-tree Index, আর PostgreSQL
                  18 এ একটা আলাদা NOT NULL Constraint। ভাঙলে 23505 বা 23502, দ্বিতীয় চাবি দিলে 42P16।
                </ListItem>
                <ListItem>
                  Composite Key: একাধিক Column মিলে চাবি, লেখা হয় Table স্তরে PRIMARY KEY (a, b)। প্রতিটা অংশ NOT NULL, জোড়াটা
                  অনন্য। সম্পর্ক রাখার Table এ সবচেয়ে বেশি।
                </ListItem>
                <ListItem>
                  Sequence একটা Token Machine: nextval নতুন নম্বর দেয়, currval এই Session এর শেষ নম্বর দেখায়, setval কাঁটা
                  সরায়। দেওয়া নম্বর কখনো ফেরত আসে না, ROLLBACK এও না।
                </ListItem>
                <ListItem>
                  serial পুরনো Shortcut: integer, NOT NULL, nextval এর DEFAULT আর একটা নিজস্ব Sequence। নিজের হাতে id দিলে চুপচাপ
                  মেনে নেয়, পরে duplicate key। নতুন কাজে না।
                </ListItem>
                <ListItem>
                  GENERATED ALWAYS AS IDENTITY: Standard, নিরাপদ, নিজের id দিলে সাথে সাথে Error 428C9, পার পেতে OVERRIDING SYSTEM
                  VALUE। BY DEFAULT নিজের id মেনে নেয়। নিজের id বসানোর পরে setval বা RESTART WITH বাধ্যতামূলক। নতুন id জানতে
                  RETURNING।
                </ListItem>
                <ListItem>
                  ফাঁক পড়ে ROLLBACK, ব্যর্থ INSERT, ON CONFLICT, Crash আর DELETE এ। চাবির কাজে ফাঁক কোনো ক্ষতি করে না। ফাঁকহীন
                  নম্বর চাইলে সেটা আলাদা ব্যবস্থা, চাবি না।
                </ListItem>
                <ListItem>
                  UUID: 16 Byte, আন্দাজ করা যায় না, যে কেউ বানাতে পারে। Version 4 এলোমেলো তাই Index এ ছড়িয়ে বসে, PostgreSQL
                  18 এর uuidv7 সময়ের ক্রমে বাড়ে। দ্রুত বাড়া Table এ integer না, bigint।
                </ListItem>
                <ListItem>
                  বেশিরভাগ Table এ Surrogate চাবি, আর বাস্তবের অনন্য জিনিসে UNIQUE। MySQL এর AUTO_INCREMENT এ নিজের id দিলে
                  Counter এগিয়ে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                pk_departure_pickups এ departure_id 999 লিখলেও Database কিছু বলবে না, যদিও সেই Departure নেই। অন্য Table এর
                Row সত্যিই আছে কিনা, আর মুছলে কী হবে, সেই পাহারা Foreign Key এর। সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Foreign Keys and ON DELETE
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
      ["Primary Key", "একটা Row এর অনন্য, কখনো খালি না থাকা পরিচয়", "প্রতিটা Table এর প্রথম Column"],
      ["UNIQUE + NOT NULL", "PRIMARY KEY এর দুই প্রতিজ্ঞা, ভাঙলে 23505 আর 23502", "pk_pickup_points এ দ্বিতীয় 1 আর NULL দুটোই আটকাল"],
      ["একটাই চাবি", "দ্বিতীয় PRIMARY KEY দিলে 42P16", "customers এ customer_id চাবি, email শুধু UNIQUE"],
      ["পেছনের Index", "table_pkey নামের Unique B-tree", "bookings_pkey দিয়ে booking_id = 17 খোঁজা"],
      ["Composite Key", "কয়েকটা Column মিলে, Table স্তরে লেখা", "pk_guide_languages (guide_id, language)"],
      ["Sequence", "nextval, currval, setval, ফেরত আসে না", "bookings_booking_id_seq এর last_value 24"],
      ["serial", "পুরনো Shortcut, নিজের id চুপচাপ মানে", "নিজের 3 এর পরে চতুর্থ INSERT এ duplicate key"],
      ["GENERATED ALWAYS", "নিজের id দিলে 428C9, OVERRIDING SYSTEM VALUE", "guides এ guide_id 6 দিলে Error"],
      ["GENERATED BY DEFAULT", "নিজের id মানে, পরে Sequence সারাতে হয়", "pk_imports এ setval 3, পরের id 4"],
      ["ফাঁক", "ROLLBACK, ব্যর্থ INSERT, ON CONFLICT এ নম্বর হারায়", "pk_tickets এ 1, 3, 5"],
      ["UUID চাবি", "16 Byte, আন্দাজ করা যায় না, uuidv7 সময়ের ক্রমে", "pk_vouchers এ gen_random_uuid()"],
      ["integer বনাম bigint", "integer শেষ 2147483647 এ", "pk_clicks এ reached maximum value"],
      ["Surrogate বনাম Natural", "নম্বর চেনায়, UNIQUE Duplicate আটকায়", "customers_pkey আর customers_email_key"],
      ["MySQL", "AUTO_INCREMENT, নিজের id দিলে Counter এগোয়", "নিজের 3 এর পরে নতুন Row পায় 4"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "point_id integer PRIMARY KEY দেওয়া একটা Table এ একসাথে কোন দুটো নিয়ম পাহারা পায়?",
        options: [
          {
            key: "A",
            text: "UNIQUE আর CHECK",
            isCorrect: false,
            explanation: "CHECK একটা শর্ত যাচাই করে, যেমন দাম শূন্যের বেশি। PRIMARY KEY কোনো CHECK যোগ করে না।",
          },
          {
            key: "B",
            text: "UNIQUE আর NOT NULL",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL 18 এর pg_constraint এ দুটো আলাদা করেই দেখা যায়: table_pkey (p) আর table_point_id_not_null (n)।",
          },
          {
            key: "C",
            text: "শুধু UNIQUE, NULL আলাদা করে আটকাতে হয়",
            isCorrect: false,
            explanation:
              "শুধু UNIQUE হলে NULL একাধিকবার ঢুকত। PRIMARY KEY নিজেই NOT NULL দেয়, NULL দিলে 23502।",
          },
          {
            key: "D",
            text: "NOT NULL আর নিজে থেকে বাড়তে থাকা নম্বর",
            isCorrect: false,
            explanation:
              "নিজে থেকে নম্বর আসে Identity বা serial থেকে, PRIMARY KEY থেকে না।",
          },
        ],
      },
      {
        id: 2,
        text: "guide_id integer PRIMARY KEY, language text PRIMARY KEY লিখে Composite Key বানাতে চাইলে কী হয়?",
        options: [
          {
            key: "A",
            text: "দুই Column মিলে একটা Composite Key তৈরি হয়",
            isCorrect: false,
            explanation: "Column এর পাশের প্রতিটা PRIMARY KEY আলাদা একটা চাবি চায়, তাই Error।",
          },
          {
            key: "B",
            text: "শুধু প্রথম PRIMARY KEY টা কাজ করে, দ্বিতীয়টা চুপচাপ বাদ",
            isCorrect: false,
            explanation: "PostgreSQL চুপচাপ কিছু বাদ দেয় না। Table টাই তৈরি হয় না।",
          },
          {
            key: "C",
            text: "ERROR: multiple primary keys for table ... are not allowed",
            isCorrect: true,
            explanation:
              "ঠিক। Composite Key লিখতে হয় Table স্তরে, এক লাইনে: PRIMARY KEY (guide_id, language)।",
          },
          {
            key: "D",
            text: "দুটো আলাদা Primary Key তৈরি হয়, দুটোই অনন্য",
            isCorrect: false,
            explanation: "দুটো Primary Key কোনো Table এ থাকে না। দ্বিতীয় অনন্য Column এ UNIQUE NOT NULL।",
          },
        ],
      },
      {
        id: 3,
        text: "pk_guide_languages এর চাবি (guide_id, language), আর Table এ আছে (1, 'English')। কোন INSERT আটকাবে?",
        options: [
          {
            key: "A",
            text: "(2, 'English', 'basic')",
            isCorrect: false,
            explanation: "English আগে আছে, কিন্তু Guide 1 এর সাথে। জোড়া (2, English) নতুন, তাই চলবে।",
          },
          {
            key: "B",
            text: "(1, 'Hindi', 'basic')",
            isCorrect: false,
            explanation: "Guide 1 আগে আছে, কিন্তু Hindi এর সাথে না। জোড়া (1, Hindi) নতুন।",
          },
          {
            key: "C",
            text: "(1, 'English', 'basic')",
            isCorrect: true,
            explanation:
              "ঠিক। level আলাদা হলেও জোড়া (1, English) পুরনো, তাই duplicate key।",
          },
          {
            key: "D",
            text: "কোনোটাই না, কারণ level Column আলাদা",
            isCorrect: false,
            explanation: "level চাবির অংশ না, অনন্যতার হিসাবে শুধু guide_id আর language এর জোড়া।",
          },
        ],
      },
      {
        id: 4,
        text: "point_id serial PRIMARY KEY। ক্রমে চলল: DEFAULT দিয়ে Insert, নিজের 3 দিয়ে Insert, DEFAULT দিয়ে Insert, DEFAULT দিয়ে Insert। শেষেরটায় কী হয়?",
        options: [
          {
            key: "A",
            text: "পায় 4, কারণ Sequence দেখে যে 3 দখল",
            isCorrect: false,
            explanation: "serial এর Sequence নিজের হাতে দেওয়া 3 এর কথা জানে না।",
          },
          {
            key: "B",
            text: "duplicate key Error, Key (point_id)=(3) already exists",
            isCorrect: true,
            explanation:
              "ঠিক। DEFAULT গুলো পায় 1, 2, তারপর 3, যেটা আগেই দখল। আবার চালালে পায় 4, কারণ ব্যর্থ চেষ্টাতেও 3 খরচ হয়েছে।",
          },
          {
            key: "C",
            text: "নিজের 3 দেওয়ার মুহূর্তেই Error হয়েছিল",
            isCorrect: false,
            explanation: "এটা GENERATED ALWAYS এর আচরণ। serial নিজের হাতে দেওয়া মান চুপচাপ মেনে নেয়।",
          },
          {
            key: "D",
            text: "পায় 3, আর আগের Uttara Row টা মুছে যায়",
            isCorrect: false,
            explanation: "INSERT অন্য Row মোছে না, নতুন Row টাই বাতিল হয়।",
          },
        ],
      },
      {
        id: 5,
        text: "INSERT INTO guides (guide_id, full_name, phone, language, hired_on) VALUES (6, ...) চালালে Island Tours এ কী আসে?",
        options: [
          {
            key: "A",
            text: "নতুন Guide 6 নম্বরে বসে",
            isCorrect: false,
            explanation: "guide_id GENERATED ALWAYS AS IDENTITY। নিজের হাতে মান দিলে Insert হয় না।",
          },
          {
            key: "B",
            text: "duplicate key Error",
            isCorrect: false,
            explanation: "6 নম্বরে কোনো Guide নেই। আটকায় তার আগেই।",
          },
          {
            key: "C",
            text: "ERROR: cannot insert a non-DEFAULT value into column \"guide_id\", সাথে OVERRIDING SYSTEM VALUE এর HINT",
            isCorrect: true,
            explanation:
              "ঠিক। SQLSTATE 428C9। guide_id বাদ দিলে Database নিজে 6 দিত।",
          },
          {
            key: "D",
            text: "PostgreSQL 6 বাদ দিয়ে নিজের নম্বর বসায়, কোনো বার্তা ছাড়া",
            isCorrect: false,
            explanation:
              "দেওয়া নম্বর বাদ দিয়ে Sequence এর নম্বর বসে শুধু OVERRIDING USER VALUE লিখলে।",
          },
        ],
      },
      {
        id: 6,
        text: "ticket_id GENERATED ALWAYS AS IDENTITY। Insert Nasrin, তারপর BEGIN, Insert Rafiq, ROLLBACK, তারপর Insert Sumon। Sumon এর ticket_id কত?",
        options: [
          {
            key: "A",
            text: "2, কারণ ROLLBACK সব ফেরত নিয়েছে",
            isCorrect: false,
            explanation: "ROLLBACK Row ফেরত নেয়, Sequence এর দেওয়া 2 না।",
          },
          {
            key: "B",
            text: "3",
            isCorrect: true,
            explanation:
              "ঠিক। Rafiq এর INSERT 2 নিয়েছিল, ROLLBACK এ নম্বর ফেরত আসে না। ইচ্ছাকৃত, যাতে একসাথে অনেকে নম্বর নিতে গিয়ে কাউকে অপেক্ষা করতে না হয়।",
          },
          {
            key: "C",
            text: "ROLLBACK এর পরে Sequence 1 এ ফিরে যায়, তাই duplicate key",
            isCorrect: false,
            explanation: "Sequence কখনো পিছিয়ে যায় না, যদি না কেউ setval বা RESTART দিয়ে সরান।",
          },
          {
            key: "D",
            text: "Error, কারণ ROLLBACK এর পরে Identity Column কাজ করে না",
            isCorrect: false,
            explanation: "Sumon নির্বিঘ্নে ঢোকেন, শুধু 3 পান।",
          },
        ],
      },
      {
        id: 7,
        text: "চাবি হিসেবে gen_random_uuid() আর integer Identity এর তুলনায় কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "uuid চাবি integer এর চেয়ে ছোট, তাই Index ও ছোট",
            isCorrect: false,
            explanation: "উল্টো। integer 4 Byte, uuid 16 Byte। text এ রাখলে আরও বেশি, 40।",
          },
          {
            key: "B",
            text: "Version 4 UUID এলোমেলো, তাই আন্দাজ করা যায় না, কিন্তু নতুন চাবি Index এর যেকোনো জায়গায় বসে",
            isCorrect: true,
            explanation:
              "ঠিক। আন্দাজ করা যায় না, কিন্তু প্রতিটা Insert Index এর আলাদা পাতা ছোঁয়। uuidv7 সময়ের ক্রমে বাড়ে, তাই দ্বিতীয় সমস্যা কমে।",
          },
          {
            key: "C",
            text: "uuid চাবির জন্যও Sequence লাগে",
            isCorrect: false,
            explanation: "UUID বানাতে Sequence লাগে না, App বা Phone নিজেও বানাতে পারে।",
          },
          {
            key: "D",
            text: "uuid চাবিতে ফাঁক পড়ে না বলে Invoice নম্বরের জন্য ভালো",
            isCorrect: false,
            explanation: "UUID এর ক্রমিক অর্থই নেই। ফাঁকহীন Invoice নম্বর আলাদা ব্যবস্থা।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ point_id INT AUTO_INCREMENT PRIMARY KEY। ক্রমে: মান না দিয়ে Insert, নিজের 3 দিয়ে Insert, মান না দিয়ে Insert। শেষের Row কত পায়?",
        options: [
          {
            key: "A",
            text: "2",
            isCorrect: false,
            explanation: "PostgreSQL এর serial হলে 2 পেত। MySQL এ Counter নিজের বড় মানের পরে চলে যায়।",
          },
          {
            key: "B",
            text: "3, তারপর Duplicate entry Error",
            isCorrect: false,
            explanation: "MySQL 3 দেখে Counter এগিয়ে দেয়, 3 আর দেওয়া হয় না।",
          },
          {
            key: "C",
            text: "4, কোনো Error ছাড়া",
            isCorrect: true,
            explanation:
              "ঠিক, MySQL 8.4 এ চালিয়ে দেখা। মাঝের 2 ফাঁকা থাকে।",
          },
          {
            key: "D",
            text: "ERROR 1064, কারণ AUTO_INCREMENT Column এ মান দেওয়া যায় না",
            isCorrect: false,
            explanation: "নিজের মান দেওয়া বৈধ। 1064 আসে GENERATED ALWAYS AS IDENTITY লিখলে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর চাবির খাতা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>চাবির হিসাব:</strong> Island Tours এর ৮টা Table এর Primary Key এর নাম, Column, Identity এর ধরন আর
        Sequence এর নাম (pg_get_serial_sequence) এর তালিকা বানান, আর প্রতিটা last_value কে Row সংখ্যার সাথে মেলান।
      </span>,
      <span key="2">
        <strong>Junction Table:</strong> ট্যুরের গায়ে Tag লাগানোর জন্য একটা Table বানান (beach, family, hill), চাবি tour_id
        আর tag এর জোড়া। দেখান একই ট্যুরে একই Tag দুইবার ঢোকে না, কিন্তু একই Tag অনেক ট্যুরে বসে। চাবিতে কোন Column আগে
        রাখলেন আর কেন, দুই লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>তিন ধরনের তুলনা:</strong> serial, BY DEFAULT আর ALWAYS এর তিনটা Table এ একই চারটা INSERT চালান (DEFAULT,
        নিজের 3, DEFAULT, DEFAULT) আর ফলাফল লিখুন। তারপর ALWAYS এ OVERRIDING SYSTEM VALUE দিয়ে 50 বসিয়ে setval করুন, আর
        দেখান পরের Row পায় 51।
      </span>,
      <span key="4">
        <strong>ফাঁকের কারণ:</strong> একটা Identity Table এ তিনটা আলাদা উপায়ে ফাঁক তৈরি করুন: ROLLBACK, NOT NULL এ আটকে যাওয়া
        INSERT, আর ON CONFLICT DO NOTHING। শেষে count(*) আর max(id) পাশাপাশি দেখান, আর ফারুক সাহেবকে তিন লাইনে বুঝিয়ে লিখুন
        কেন এতে কোনো ক্ষতি নেই।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> ক্লাসের Roll Number আর ব্যাংকের Token Machine এর উদাহরণ দিয়ে বোঝান Primary Key কী,
        Sequence কী, নম্বরে ফাঁক কেন পড়ে, আর কখন নম্বরের বদলে UUID ভালো।
      </span>,
    ],
    deliverables: [
      <span key="d1">৮টা Table এর চাবির তালিকা আর last_value বনাম Row সংখ্যার মিলানো</span>,
      <span key="d2">Tag Table এর CREATE TABLE, দুটো সফল আর একটা আটকে যাওয়া INSERT, আর Column এর ক্রমের ব্যাখ্যা</span>,
      <span key="d3">তিন ধরনের Column এর ফলাফলের তুলনা আর 51 পাওয়ার প্রমাণ</span>,
      <span key="d4">তিন রকম ফাঁকের Script, count আর max এর ফলাফল, আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Primary Key",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Island Tours এর চাবিগুলো",
        description:
          "প্রথম ফাইলে ৮টা Table এর Primary Key, সবগুলো Identity ALWAYS কিনা, আর bookings এর Sequence এর অবস্থা। last_value 24 মানে এখন পর্যন্ত ২৪টা নম্বর বিলি হয়েছে। আগের কোনো লেসনে নিজের psql এ bookings এ আটকে যাওয়া INSERT চালিয়ে থাকলে সংখ্যাটা বড় হবে, ঠিক এই লেসনের ফাঁকের কারণে।",
      },
      {
        title: "প্রথম চাবি আর তার দুই Error",
        description:
          "দ্বিতীয় ফাইলে pk_pickup_points। psql Error এর পরেও পরের লাইনে যায়, তাই দুটো Error আর শেষে ৪টা Constraint।",
      },
      {
        title: "জোড়া চাবি",
        description:
          "তৃতীয় ফাইলে pk_guide_languages। পুরনো জোড়া আর খালি অংশ, দুটোই আটকায়, শেষে প্রতিটা Guide এর ২টা করে ভাষা।",
      },
      {
        title: "serial বনাম Identity",
        description:
          "চতুর্থ ফাইলে serial এর চুপচাপ ফাঁদ, ALWAYS এর সাথে সাথে Error, OVERRIDING দিয়ে 10, setval, আর পরের Row 11। শেষে \\d pk_points।",
      },
      {
        title: "ফাঁক তৈরি করা",
        description:
          "পঞ্চম ফাইলে ROLLBACK আর ব্যর্থ INSERT মিলে 1, 3, 5। count 3 আর max 5 পাশাপাশি দেখে নিন।",
      },
      {
        title: "UUID, শেষ সীমা আর পরিষ্কার",
        description:
          "ষষ্ঠ ফাইলে uuidv7 চাবি, integer এর শেষ সীমা, আর শেষে সব pk_ Table মুছে island_tours আগের মতো।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-keys-of-island-tours.sql",
        code: `SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'p'
  AND conrelid::regclass::text IN ('destinations', 'guides', 'tours', 'customers',
                                   'departures', 'bookings', 'payments', 'reviews')
ORDER BY 1;
-- (8 rows), তৈরির ক্রমে: destinations_pkey PRIMARY KEY (destination_id),
-- guides_pkey (guide_id), tours_pkey (tour_id), customers_pkey (customer_id),
-- departures_pkey (departure_id), bookings_pkey (booking_id),
-- payments_pkey (payment_id), reviews_pkey (review_id)

SELECT table_name, column_name, data_type, identity_generation
FROM information_schema.columns
WHERE table_schema = 'public' AND is_identity = 'YES'
ORDER BY table_name;
-- (8 rows), সবগুলো integer আর ALWAYS

SELECT pg_get_serial_sequence('bookings', 'booking_id') AS seq;
-- public.bookings_booking_id_seq
SELECT last_value, is_called FROM bookings_booking_id_seq;
-- 24 | t   (আগে bookings এ ব্যর্থ INSERT চালিয়ে থাকলে বড় সংখ্যা)`,
      },
      {
        language: "sql",
        filename: "02-first-key.sql",
        code: `DROP TABLE IF EXISTS pk_pickup_points;
CREATE TABLE pk_pickup_points (
  point_id integer PRIMARY KEY,
  name     text NOT NULL,
  area     text NOT NULL
);
INSERT INTO pk_pickup_points VALUES (1, 'Kalabagan Counter', 'Dhanmondi');
INSERT INTO pk_pickup_points VALUES (2, 'Arambagh Counter', 'Motijheel');
INSERT INTO pk_pickup_points VALUES (1, 'Kalabagan Counter', 'Dhanmondi');
-- ERROR:  duplicate key value violates unique constraint "pk_pickup_points_pkey"
-- DETAIL:  Key (point_id)=(1) already exists.
INSERT INTO pk_pickup_points VALUES (NULL, 'Uttara Counter', 'Uttara');
-- ERROR:  null value in column "point_id" of relation "pk_pickup_points" violates not-null constraint
-- DETAIL:  Failing row contains (null, Uttara Counter, Uttara).
SELECT conname, contype FROM pg_constraint
WHERE conrelid = 'pk_pickup_points'::regclass ORDER BY conname;
-- pk_pickup_points_area_not_null     | n
-- pk_pickup_points_name_not_null     | n
-- pk_pickup_points_pkey              | p
-- pk_pickup_points_point_id_not_null | n`,
      },
      {
        language: "sql",
        filename: "03-composite.sql",
        code: `DROP TABLE IF EXISTS pk_guide_languages;
CREATE TABLE pk_guide_languages (
  guide_id integer,
  language text,
  level    text NOT NULL,
  PRIMARY KEY (guide_id, language)
);
INSERT INTO pk_guide_languages VALUES
  (1, 'Bangla', 'native'), (1, 'English', 'fluent'),
  (2, 'English', 'native'), (2, 'Hindi', 'basic');
-- INSERT 0 4
INSERT INTO pk_guide_languages VALUES (1, 'English', 'basic');
-- ERROR:  duplicate key value violates unique constraint "pk_guide_languages_pkey"
-- DETAIL:  Key (guide_id, language)=(1, English) already exists.
INSERT INTO pk_guide_languages VALUES (2, NULL, 'basic');
-- ERROR:  null value in column "language" of relation "pk_guide_languages" violates not-null constraint
SELECT guide_id, count(*) AS languages
FROM pk_guide_languages GROUP BY guide_id ORDER BY guide_id;
-- 1 | 2
-- 2 | 2`,
      },
      {
        language: "sql",
        filename: "04-serial-vs-identity.sql",
        code: `DROP TABLE IF EXISTS pk_serial_points, pk_points;
CREATE TABLE pk_serial_points (point_id serial PRIMARY KEY, name text NOT NULL);
INSERT INTO pk_serial_points (name) VALUES ('Kalabagan Counter');
INSERT INTO pk_serial_points (point_id, name) VALUES (3, 'Uttara Counter');
INSERT INTO pk_serial_points (name) VALUES ('Arambagh Counter');
INSERT INTO pk_serial_points (name) VALUES ('Gabtoli Counter');
-- ERROR:  duplicate key value violates unique constraint "pk_serial_points_pkey"
-- DETAIL:  Key (point_id)=(3) already exists.

CREATE TABLE pk_points (
  point_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name     text NOT NULL
);
INSERT INTO pk_points (name) VALUES ('Kalabagan Counter'), ('Arambagh Counter');
INSERT INTO pk_points (point_id, name) VALUES (3, 'Uttara Counter');
-- ERROR:  cannot insert a non-DEFAULT value into column "point_id"
-- DETAIL:  Column "point_id" is an identity column defined as GENERATED ALWAYS.
-- HINT:  Use OVERRIDING SYSTEM VALUE to override.
INSERT INTO pk_points (point_id, name) OVERRIDING SYSTEM VALUE VALUES (10, 'Uttara Counter');
-- INSERT 0 1
SELECT setval(pg_get_serial_sequence('pk_points', 'point_id'),
              (SELECT max(point_id) FROM pk_points));
-- 10
INSERT INTO pk_points (name) VALUES ('Gabtoli Counter') RETURNING point_id;
-- 11
\\d pk_points
-- point_id | integer | not null | generated always as identity
-- Indexes: "pk_points_pkey" PRIMARY KEY, btree (point_id)`,
      },
      {
        language: "sql",
        filename: "05-gaps.sql",
        code: `DROP TABLE IF EXISTS pk_tickets;
CREATE TABLE pk_tickets (
  ticket_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  passenger text NOT NULL
);
INSERT INTO pk_tickets (passenger) VALUES ('Nasrin');
BEGIN;
INSERT INTO pk_tickets (passenger) VALUES ('Rafiq');
ROLLBACK;
INSERT INTO pk_tickets (passenger) VALUES ('Sumon');
INSERT INTO pk_tickets (passenger) VALUES (NULL);
-- ERROR:  null value in column "passenger" of relation "pk_tickets" violates not-null constraint
-- DETAIL:  Failing row contains (4, null).
INSERT INTO pk_tickets (passenger) VALUES ('Mitu');
SELECT * FROM pk_tickets ORDER BY ticket_id;
-- 1 Nasrin | 3 Sumon | 5 Mitu
SELECT count(*) AS rows, max(ticket_id) AS biggest_id FROM pk_tickets;
-- 3 | 5`,
      },
      {
        language: "sql",
        filename: "06-uuid-and-limits.sql",
        code: `DROP TABLE IF EXISTS pk_vouchers, pk_clicks;
CREATE TABLE pk_vouchers (
  voucher_id uuid DEFAULT uuidv7() PRIMARY KEY,
  code       text NOT NULL UNIQUE
);
INSERT INTO pk_vouchers (code) VALUES ('EID-2026'), ('PUJA-2026');
SELECT uuid_extract_version(voucher_id) AS version, code FROM pk_vouchers ORDER BY voucher_id;
-- 7 | EID-2026
-- 7 | PUJA-2026   (uuidv7 সময়ের ক্রমে, তাই চাবির ক্রম আর Insert এর ক্রম এক)

CREATE TABLE pk_clicks (
  click_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page     text NOT NULL
);
ALTER TABLE pk_clicks ALTER COLUMN click_id RESTART WITH 2147483647;
INSERT INTO pk_clicks (page) VALUES ('/tours');
-- INSERT 0 1
INSERT INTO pk_clicks (page) VALUES ('/tours/7');
-- ERROR:  nextval: reached maximum value of sequence "pk_clicks_click_id_seq" (2147483647)

-- পরিষ্কার: এই লেসনের সব Table মুছে island_tours আগের মতো
DROP TABLE pk_pickup_points, pk_guide_languages, pk_serial_points,
           pk_points, pk_tickets, pk_vouchers, pk_clicks;
-- DROP TABLE`,
      },
    ],
  },
};
