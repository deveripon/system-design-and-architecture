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
  CascadeExplorerLab,
  DropChooserLab,
  DropCommandLab,
} from "../../../components/course/topics/ddl/drop-animations";
import {
  DeleteVsTruncateDiskSplit,
  DropCascadeSplit,
  DropThreeWaysDiagram,
  ModuleNineStoryDiagram,
  TruncateBlastDiagram,
  UndoTimelineDiagram,
} from "../../../components/course/topics/ddl/drop-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * A small parent and child pair that several boxes rebuild from scratch, so
 * each box runs on its own and can be run again. The view is dropped first
 * because a plain DROP TABLE refuses while a view still depends on the table.
 */
const TOURS_SETUP = `DROP VIEW IF EXISTS drop_tour_list;
DROP TABLE IF EXISTS drop_departures, drop_tours;
CREATE TABLE drop_tours (
  tour_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title   text NOT NULL
);
CREATE TABLE drop_departures (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES drop_tours (tour_id),
  starts_on    date NOT NULL
);
INSERT INTO drop_tours (title) VALUES
  ('Sundarbans Mangrove Safari'),
  ('Sajek Cloud Valley'),
  ('Kuakata Sunrise Weekend');`;

/** Three departures for the first two tours; the third tour has none. */
const TOURS_DEPARTURES = `INSERT INTO drop_departures (tour_id, starts_on) VALUES
  (1, DATE '2026-11-20'),
  (1, DATE '2026-12-18'),
  (2, DATE '2026-11-27');`;

/** Runs one statement and reports "ok" or the SQLSTATE and message, so one query can prove many constraints. */
const DROP_TRY = `CREATE OR REPLACE FUNCTION drop_try(stmt text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'ok';
EXCEPTION WHEN others THEN
  RETURN SQLSTATE || ': ' || SQLERRM;
END;
$$;`;

export const dropTruncateDeleteContent: TopicData = {
  id: "drop-truncate-delete",
  introduction: {
    badge: "MODULE 09 · LESSON 11",
    title: <SectionTitle>DROP, TRUNCATE আর DELETE: মুছে ফেলার তিন মাত্রা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের দশটা লেসনে আপনি শুধু বানিয়েছেন। একটা Database, তার ভেতরে Table, প্রতিটা Column এর ঠিক Type, ভুল Data আটকানোর
          Constraint, আর আগের লেসনে ALTER TABLE দিয়ে সেই কাঠামো বদলানো। শেষ লেসনে উল্টো কাজ: সরানো।
        </ContentParagraph>
        <ContentParagraph>
          SQL এ কিছু সরানোর তিনটা কমান্ড আছে, আর তিনটার নামই শুনতে কাছাকাছি। কিন্তু কী সরে, কত দ্রুত সরে, কে খবর পায়, আর ভুল
          হলে ফেরত আনা যায় কিনা, এই চার প্রশ্নে তিনটা একদম আলাদা। ভুলটা বেছে নিলে কখনো শুধু কাজ ধীর হয়, কখনো একটা Audit Log চুপচাপ
          ফাঁকা থেকে যায়, আর কখনো একটা ছোট্ট CASCADE শব্দ চারটা Table এর সব Row মুছে দেয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন DELETE কীভাবে বেছে বেছে Row সরায় আর RETURNING দিয়ে কী সরল দেখায়, TRUNCATE কেন এক ঝটকায় সব
          খালি করে আর RESTART IDENTITY কী করে, Foreign Key থাকলে দুটো কমান্ড কী বলে, CASCADE শব্দের দুই রকম মানে, কোন কমান্ড
          Trigger চালায় আর কোনটা চালায় না, DROP TABLE আর IF EXISTS, PostgreSQL এ সব কিছু ROLLBACK দিয়ে ফেরত আনা, গতি, Disk এর জায়গা
          আর Lock, আর MySQL এ কোথায় নিয়ম বদলে যায়। শেষে পুরো Module 09 একটা Capstone এ জুড়ে মডিউলটা গুছিয়ে নেবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমরা তিনজনই জিনিস সরাই। একজন বেছে বেছে, একটা একটা করে, প্রতিটার হিসাব রেখে। একজন এক ঝটকায় সব। আর একজন ঘরটাসহ। কাকে ডাকবেন, সেটা আপনার সিদ্ধান্ত, আর ফলাফলের দায়ও।",
      author: "DELETE, TRUNCATE, DROP",
      role: "Lesson 11",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>শীতের আগে Staging Database পরিষ্কার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, ১ নভেম্বর 2026। সাপ্তাহিক বৈঠকে ফারুক সাহেব তানিমকে একটা কাজ দিলেন। দলের Staging Database, আসল Database এর একটা
                নকল যেখানে নতুন Feature আগে পরীক্ষা হয়, গত কয়েক সপ্তাহে অগোছালো হয়ে গেছে। তিনটা কাজ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Website পরীক্ষার সময় QA দল কিছু নকল Booking বানিয়েছিল। সেগুলো যাবে, কিন্তু আসল Booking এর একটাও যেন না যায়।
                </ListItem>
                <ListItem>
                  প্রতি রাতে Agent দের CSV একটা Import Table এ ঢোকে। আজ রাতের Load এর আগে Table টা খালি চাই, আর নম্বর যেন আবার 1
                  থেকে শুরু হয়।
                </ListItem>
                <ListItem>
                  এই মডিউলে অনুশীলনের জন্য যত Table বানানো হয়েছে, কেউ আর সেগুলো ব্যবহার করে না। সেগুলো পুরোপুরি সরাতে হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তানিম অবাক হলেন: তিনটাই তো মুছে ফেলা, তিনটা আলাদা কমান্ড কেন? একটা হোটেলের রেজিস্টার খাতার কথা ভাবুন। উপরে কলামের নাম
                ছাপা: অতিথির নম্বর, নাম, অবস্থা। প্রতিদিন নতুন লাইন লেখা হয়। মুছে ফেলা যায় তিন রকমে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>রাবার দিয়ে কয়েকটা লাইন মোছা।</strong> যে লাইনগুলো বাতিল, শুধু সেগুলো, একটা একটা করে। ম্যানেজার চাইলে
                  প্রতিটা মোছার পাশে একটা নোট রাখতে পারেন। এটা DELETE।
                </ListItem>
                <ListItem>
                  <strong>লেখা সব পাতা একসাথে ছিঁড়ে ফেলা।</strong> মলাট আর উপরের কলামের নাম থাকে, কাল থেকে নতুন লেখা শুরু। কোন লাইন
                  কী ছিল, কেউ একটা একটা করে দেখে না। এটা TRUNCATE।
                </ListItem>
                <ListItem>
                  <strong>পুরো খাতাটাই ফেলে দেওয়া।</strong> কলামের নাম, নিয়ম, মলাট, সব। কাল কেউ লিখতে চাইলে আগে নতুন খাতা কিনতে
                  হবে। এটা DROP TABLE।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে ছোট <code className={CODE}>drop_guests</code> Table এ তিনটা কমান্ড পরপর। এই লেসনের প্রতিটা বক্স নিজের Table
                বানায়, নাম শুরু <code className={CODE}>drop_</code> দিয়ে, আর শুরুতে আগের বারের Table সরিয়ে নেয়, তাই যতবার খুশি Run চাপতে
                পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Table, তিনটা কমান্ড"
              query={`DROP TABLE IF EXISTS drop_guests;
CREATE TABLE drop_guests (
  guest_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  status    text NOT NULL
);
INSERT INTO drop_guests (full_name, status) VALUES
  ('Nusrat Jahan', 'confirmed'),
  ('Arif Hasan',   'cancelled'),
  ('Mitu Rahman',  'confirmed'),
  ('Sohel Rana',   'cancelled'),
  ('Tania Akter',  'pending');

DELETE FROM drop_guests WHERE status = 'cancelled';
SELECT * FROM drop_guests ORDER BY guest_id;

TRUNCATE drop_guests;
SELECT count(*) AS rows_left FROM drop_guests;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'drop_guests'
ORDER BY ordinal_position;

DROP TABLE drop_guests;
SELECT count(*) AS tables_named_drop_guests
FROM information_schema.tables
WHERE table_name = 'drop_guests';`}
              caption="DELETE বলে DELETE 2, আর বাকি থাকে ৩ জন: guest_id 1, 3 আর 5। TRUNCATE এর পরে rows_left 0, কিন্তু information_schema তখনো তিনটা Column দেখায়: guest_id, full_name, status। খাতার মলাট আছে, পাতা নেই। DROP TABLE এর পরে tables_named_drop_guests 0: খাতাটাই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তিনটা প্রশ্ন, তিনটা কমান্ড",
          content: (
            <ContentParagraph>
              কিছু Row যাবে, কিছু থাকবে? তাহলে DELETE ... WHERE। সব Row যাবে কিন্তু Table টা পরেও লাগবে? তাহলে TRUNCATE। Table টাই
              আর লাগবে না? তাহলে DROP TABLE। তানিমের তিনটা কাজ ঠিক এই তিন প্রশ্নের তিন উত্তর: নকল Booking এর জন্য DELETE, Import
              Table এর জন্য TRUNCATE, অনুশীলনের Table এর জন্য DROP।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "three-levels",
      subHeader: { index: "002", title: "Three Levels" },
      title: <SectionTitle>কী যায়, কী থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা কমান্ডকে তিনটা মাত্রা হিসেবে ভাবুন। DELETE কাজ করে Row এর মাত্রায়: প্রতিটা Row আলাদা করে বিচার করে, শর্ত মিললে
                সরায়। TRUNCATE কাজ করে পুরো Data র মাত্রায়: Row গুলো আলাদা করে দেখেই না, সব একসাথে ফেলে দেয়। DROP TABLE কাজ করে
                কাঠামোর মাত্রায়: Data র সাথে Table এর সংজ্ঞাটাও মুছে দেয়, যেন সেটা কখনো ছিলই না।
              </ContentParagraph>
              <ContentParagraph>
                Module 01 এর কমান্ড পরিবারের ভাষায়, DELETE হলো DML, Data বদলানোর কমান্ড, আর DROP TABLE হলো DDL, কাঠামো বদলানোর কমান্ড।
                TRUNCATE মাঝখানে: কাজ করে Data র উপর, আচরণ করে DDL এর মতো, আর MySQL এর Manual তাকে সরাসরি DDL বলে। এই লেসনের অনেক
                পার্থক্য এখান থেকেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DropThreeWaysDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "DELETE", "TRUNCATE", "DROP TABLE"],
          rows: [
            ["কোন Row যায়", "WHERE এর শর্ত মেলা Row, WHERE না দিলে সব", "সব Row, কোনো বাছাই নেই", "সব Row, Table এর সাথে"],
            ["Table এর কাঠামো", "থাকে", "থাকে", "যায়"],
            ["Index, Constraint, Trigger", "থাকে", "থাকে", "Table এর সাথে যায়"],
            ["Identity এর পরের নম্বর", "আগের মতোই চলে", "আগের মতো, RESTART IDENTITY দিলে 1", "Sequence টাই যায়"],
            ["উত্তরে কী আসে", "DELETE 2, কয়টা Row গেল", "TRUNCATE TABLE, কোনো সংখ্যা না", "DROP TABLE"],
            ["কমান্ড পরিবার", "DML", "DDL এর মতো আচরণ", "DDL"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ একই পাঁচজন অতিথি আর সাতটা কমান্ড, যেকোনো ক্রমে চাপুন। ডান পাশে দেখুন কয়টা Row জীবিত, কয়টা মৃত হয়ে জায়গা
              দখল করে আছে, পরের অতিথি কোন নম্বর পাবেন, আর Trigger কতবার চলেছে। DELETE এর পরে INSERT, RESTART IDENTITY এর পরে INSERT,
              আর শেষে DROP এর পরে যেকোনো কিছু চেষ্টা করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DropCommandLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "delete",
      subHeader: { index: "003", title: "DELETE" },
      title: <SectionTitle>DELETE: বেছে বেছে, একটা একটা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DELETE এর গঠন খুব ছোট: <code className={CODE}>DELETE FROM table WHERE শর্ত;</code>। WHERE অংশটা হুবহু সেই WHERE যা আপনি{" "}
                <Link href="/sql/topic/where-filters" className={LINK}>
                  Module 03
                </Link>{" "}
                থেকে SELECT এ লিখছেন: তুলনা, AND, OR, IN, IS NULL, সব চলে। পার্থক্য শুধু একটা জায়গায়। SELECT শর্ত মেলা Row গুলো
                দেখায়, DELETE সেগুলো সরিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                তাই অভিজ্ঞদের অভ্যাস: DELETE এর আগে একই WHERE দিয়ে SELECT চালান। যে Row আসে, ঠিক সেগুলোই মুছবে। নিশ্চিত হলে তারপর{" "}
                <code className={CODE}>SELECT *</code> কে <code className={CODE}>DELETE</code> বানান।
              </ContentParagraph>
              <ContentParagraph>
                কী মুছল দেখার আরেক উপায় <code className={CODE}>RETURNING</code>: DELETE এর শেষে কয়েকটা Column লিখলে মুছে ফেলা প্রতিটা
                Row ফলাফল হিসেবে ফেরত আসে, মোছার রসিদের মতো। এর পুরো গল্প Module 10 এ।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে আমরা আসল Table থেকে সরাসরি মুছব না।{" "}
                <Link href="/sql/topic/create-table" className={LINK}>
                  Lesson 02
                </Link>{" "}
                এর <code className={CODE}>CREATE TABLE ... AS SELECT</code> দিয়ে নকল বানিয়ে তার উপর কাজ করব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="cancelled Booking সরানো, রসিদসহ"
              query={`DROP TABLE IF EXISTS drop_bookings;
CREATE TABLE drop_bookings AS
  SELECT booking_id, customer_id, status, total_bdt
  FROM bookings;

DELETE FROM drop_bookings
WHERE status = 'cancelled'
RETURNING booking_id, customer_id, total_bdt;

SELECT status, count(*) AS bookings, sum(total_bdt) AS total_bdt
FROM drop_bookings
GROUP BY status
ORDER BY status;`}
              caption="RETURNING ৩টা Row ফেরত দেয়: Booking 5 (17000.00), 12 (25000.00) আর 18 (9500.00), ঠিক তিনটা cancelled Booking। তারপরের SELECT এ শুধু দুটো অবস্থা বাকি: confirmed ১৭টা, 423600.00 টাকা, আর pending ৪টা, 117200.00 টাকা। আসল bookings Table এ এখনো ২৪টা Row, কারণ আমরা মুছেছি নকল থেকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা ভয়ের দৃশ্য। WHERE লিখতে ভুলে গেলে কী হয়? DELETE তখন কোনো শর্ত পায় না, তাই ধরে নেয় প্রতিটা Row ই যাওয়ার
              যোগ্য। নিচের বক্সে সেটাই, নকল Table এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE ছাড়া DELETE"
              query={`DROP TABLE IF EXISTS drop_bookings;
CREATE TABLE drop_bookings AS
  SELECT booking_id, customer_id, status, total_bdt
  FROM bookings;

DELETE FROM drop_bookings;
SELECT count(*) AS rows_left FROM drop_bookings;`}
              caption="DELETE 24, rows_left 0। কোনো সতর্কবার্তা নেই, কোনো প্রশ্ন নেই, PostgreSQL ধরে নেয় আপনি জেনেশুনেই চাইছেন। Table টা কিন্তু আছে, শুধু খালি। ফলাফল TRUNCATE এর মতো দেখালেও ভেতরের কাজ আলাদা, সেটা এই লেসনের Speed Section এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "WHERE ভুলে যাওয়া DELETE এর গল্প Module 10 এ",
          content: (
            <ContentParagraph>
              Production এ WHERE ছাড়া DELETE বা UPDATE সবচেয়ে পরিচিত বিপর্যয়গুলোর একটা। আটকানো আর ফেরানোর লেসন:{" "}
              <Link href="/sql/topic/update-without-where" className={LINK}>
                UPDATE Without WHERE, and Recovery
              </Link>
              । মোছার বদলে চিহ্ন দিয়ে রাখার কৌশল, Soft Delete, আছে{" "}
              <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                DELETE and Soft Delete
              </Link>{" "}
              লেসনে।
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
                  Starter Query <code className={CODE}>drop_ex1_bookings</code> নামে bookings এর একটা নকল বানায়। মাঝের মন্তব্যের
                  জায়গায় একটা DELETE লিখুন যা সব cancelled Booking সরায়, আর সেই pending Booking গুলোও সরায় যাদের{" "}
                  <code className={CODE}>total_bdt</code> 20000 এর কম। শেষের যাচাইয়ের Query টা না বদলে শেষ Statement হিসেবেই রাখুন:
                  সে বাকি Booking এর সংখ্যা আর টাকার যোগফল দেখায়।
                </>
              }
              hint={
                <>
                  দুটো শর্ত OR দিয়ে জোড়া, আর দ্বিতীয়টার ভেতরে AND। বন্ধনী দিন:{" "}
                  <code className={CODE}>{"status = 'cancelled' OR (status = 'pending' AND total_bdt < 20000)"}</code>। চাইলে আগে একই
                  WHERE দিয়ে SELECT চালিয়ে দেখুন কোন পাঁচটা Row আসে।
                </>
              }
              starter={`DROP TABLE IF EXISTS drop_ex1_bookings;
CREATE TABLE drop_ex1_bookings AS
  SELECT booking_id, status, total_bdt
  FROM bookings;

-- এখানে আপনার DELETE লিখুন

SELECT count(*) AS bookings_left, sum(total_bdt) AS total_left
FROM drop_ex1_bookings;`}
              solution={`SELECT count(*), sum(total_bdt)
FROM bookings
WHERE NOT (status = 'cancelled' OR (status = 'pending' AND total_bdt < 20000));`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "truncate",
      subHeader: { index: "004", title: "TRUNCATE" },
      title: <SectionTitle>TRUNCATE: এক ঝটকায় সব Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TRUNCATE এর গঠন আরও ছোট: <code className={CODE}>TRUNCATE table;</code>। চাইলে মাঝে TABLE শব্দটা লিখতে পারেন,{" "}
                <code className={CODE}>TRUNCATE TABLE table;</code>, মানে একই। একসাথে কয়েকটা Table ও দেওয়া যায়, কমা দিয়ে আলাদা করে।
                WHERE নেই, থাকার কথাও না: TRUNCATE এর পুরো অর্থই হলো সব।
              </ContentParagraph>
              <ContentParagraph>
                DELETE বলেছিল DELETE 24, TRUNCATE শুধু বলে TRUNCATE TABLE, কোনো সংখ্যা ছাড়া। গুনতে হলে Row ছুঁতে হতো, আর না ছোঁয়াটাই তার
                গতির রহস্য। সংখ্যা চাইলে আগে নিজে <code className={CODE}>count(*)</code> চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="TRUNCATE এর পরে কী থাকে"
              query={`DROP TABLE IF EXISTS drop_bookings;
CREATE TABLE drop_bookings AS
  SELECT booking_id, customer_id, status, total_bdt
  FROM bookings;
SELECT count(*) AS before_truncate FROM drop_bookings;

TRUNCATE drop_bookings;
SELECT count(*) AS after_truncate FROM drop_bookings;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'drop_bookings'
ORDER BY ordinal_position;`}
              caption="আগে ২৪, পরে ০। তারপর information_schema দেখায় চারটা Column তাদের Type সহ: booking_id integer, customer_id integer, status text, total_bdt numeric। Table টা ঠিক আগের মতো আছে, যেন সবে CREATE হয়েছে, এখনই INSERT নিতে তৈরি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "TRUNCATE কোথায় সবচেয়ে বেশি দেখবেন",
          content: (
            <ContentParagraph>
              বাস্তবে TRUNCATE চলে তিন জায়গায়: Import বা Staging Table, যেখানে নতুন Data আসার আগে পুরনোটা ফেলতে হয়; Test Database, যেখানে
              প্রতিটা Test এর আগে Table খালি করা হয়, গল্পটা{" "}
              <Link href="/sql/topic/seeds-and-test-databases" className={LINK}>
                Seed Data and Test Databases
              </Link>{" "}
              লেসনে; আর বড় Log বা Cache Table। মিল একটাই: কেউ জানতে চায় না কোন Row গেল, শুধু চায় সব যাক, দ্রুত।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "restart-identity",
      subHeader: { index: "005", title: "RESTART IDENTITY" },
      title: <SectionTitle>নম্বর আবার কোথা থেকে শুরু হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Lesson 08
                </Link>{" "}
                এ আপনি দেখেছেন, <code className={CODE}>GENERATED ALWAYS AS IDENTITY</code> Column এর পেছনে একটা Sequence থাকে, একটা
                গুনতির যন্ত্র যে প্রতিটা নতুন Row কে পরের নম্বর দেয়। ব্যাংকের টোকেন মেশিনের মতো: আপনার আগের সবাই চলে গেলেও মেশিন
                নিজে থেকে আবার 1 এ ফেরে না।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্ন হলো, Table খালি করলে মেশিনের কী হয়। DELETE মেশিনে হাত দেয় না: তিনটা Row মুছে নতুন একটা দিলে সে পায় 4।
                TRUNCATE ও নিজে থেকে হাত দেয় না, তার Default আচরণের নাম <code className={CODE}>CONTINUE IDENTITY</code>। মেশিন 1 এ
                ফেরাতে চাইলে আলাদা করে বলতে হয়: <code className={CODE}>TRUNCATE table RESTART IDENTITY;</code>। তখন সেই Table এর
                Column গুলোর মালিকানায় থাকা সব Sequence আবার শুরু থেকে গোনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DELETE, TRUNCATE আর RESTART IDENTITY এর পরে পরের নম্বর"
              query={`DROP TABLE IF EXISTS drop_imports;
CREATE TABLE drop_imports (
  import_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note      text NOT NULL
);
INSERT INTO drop_imports (note) VALUES ('night 1, row a'), ('night 1, row b'), ('night 1, row c');

DELETE FROM drop_imports;
INSERT INTO drop_imports (note) VALUES ('after DELETE');
SELECT * FROM drop_imports;

TRUNCATE drop_imports;
INSERT INTO drop_imports (note) VALUES ('after TRUNCATE');
SELECT * FROM drop_imports;

TRUNCATE drop_imports RESTART IDENTITY;
INSERT INTO drop_imports (note) VALUES ('after RESTART IDENTITY');
SELECT * FROM drop_imports;`}
              caption="তিনটা ফলাফল, তিনটা নম্বর। DELETE এর পরে নতুন Row পায় 4, কারণ 1, 2, 3 আগেই দেওয়া হয়ে গেছে। সাধারণ TRUNCATE এর পরে 5, মেশিন থামেনি। RESTART IDENTITY এর পরে 1, মেশিন শূন্য থেকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নম্বর আবার শুরু করা মানে পুরনো নম্বর আবার ফিরে আসা",
          content: (
            <ContentParagraph>
              Import Table এর নম্বরের বাইরের কোনো মানে নেই, তাই সেখানে এটা নিরাপদ। কিন্তু যে নম্বর বাইরে গেছে, যেমন Customer কে পাঠানো
              Booking বা Invoice নম্বর, সেখানে আবার শুরু করলে পুরনো Email এর Booking #1 আর নতুন Booking #1 দুটো আলাদা জিনিস হবে। তাই
              RESTART IDENTITY শুধু সেই Table এ, যার নম্বর কেউ মনে রাখে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এর Docs এ আরেকটা কথা স্পষ্ট: মেশিন ফেরানোটাও Transaction এর অংশ। BEGIN এর পরে{" "}
              <code className={CODE}>TRUNCATE ... RESTART IDENTITY</code> চালিয়ে ROLLBACK করলে Row এর সাথে আগের নম্বরও ফেরে। আমাদের
              পরীক্ষায় তিনটা Row থাকা অবস্থায় এমন ROLLBACK এর পরে নতুন Row পেয়েছে 4, 1 না।
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
                  <code className={CODE}>drop_ex2_imports</code> এ গত রাতের তিনটা Row আছে। মন্তব্যের জায়গায় একটাই Statement লিখুন যা
                  Table টা খালি করে আর import_id এর গুনতি আবার 1 থেকে শুরু করে। তারপরের INSERT আর শেষের যাচাইয়ের Query না বদলে রাখুন।
                  ঠিক হলে আজ রাতের দুটো Row পাবে 1 আর 2।
                </>
              }
              hint={
                <>
                  সাধারণ TRUNCATE বা DELETE দিলে নতুন দুটো Row পাবে 4 আর 5। TRUNCATE এর শেষে দুটো শব্দ যোগ করতে হবে।
                </>
              }
              starter={`DROP TABLE IF EXISTS drop_ex2_imports;
CREATE TABLE drop_ex2_imports (
  import_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent     text NOT NULL,
  seats     smallint NOT NULL
);
INSERT INTO drop_ex2_imports (agent, seats) VALUES
  ('Cox Bazar Desk', 4), ('Sylhet Desk', 2), ('Khulna Desk', 6);

-- এখানে একটা Statement: Table খালি করুন, নম্বর যেন আবার 1 থেকে শুরু হয়

INSERT INTO drop_ex2_imports (agent, seats) VALUES
  ('Bandarban Desk', 3), ('Sajek Desk', 5);
SELECT import_id, agent, seats
FROM drop_ex2_imports
ORDER BY import_id;`}
              solution={`SELECT *
FROM (VALUES (1, 'Bandarban Desk', 3),
             (2, 'Sajek Desk', 5)) AS v(import_id, agent, seats);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "truncate-and-foreign-keys",
      subHeader: { index: "006", title: "TRUNCATE and Foreign Keys" },
      title: <SectionTitle>Foreign Key থাকলে TRUNCATE কী বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Lesson 09
                </Link>{" "}
                এ দেখেছেন, Foreign Key একটা প্রতিশ্রুতি: Child এর প্রতিটা Row যে Parent কে দেখায়, সেই Parent আছে। DELETE এটা রাখে Row ধরে
                পরীক্ষা করে। TRUNCATE Row ছোঁয় না, পরীক্ষাও করতে পারে না। তাই নিয়ম কড়া: অন্য কোনো Table এই Table কে Foreign Key দিয়ে
                দেখালে সাধারণ TRUNCATE চলবে না, Child খালি হলেও না।
              </ContentParagraph>
              <ContentParagraph>
                শেষের কথাটা অনেককে অবাক করে, তাই নিচের বক্সে নিজে দেখুন। তিনটা ট্যুর আছে, Departure একটাও নেই, তবু TRUNCATE রাজি না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Child খালি, তবু TRUNCATE রাজি না"
              query={`${TOURS_SETUP}

SELECT count(*) AS departures FROM drop_departures;
TRUNCATE drop_tours;`}
              caption="departures এর সংখ্যা 0, তারপর Error: cannot truncate a table referenced in a foreign key constraint। DETAIL বলে কে দেখায়: Table drop_departures references drop_tours। HINT এ দুটো পথ: একই সাথে drop_departures ও TRUNCATE করুন, অথবা TRUNCATE ... CASCADE। SQLSTATE 0A000। Data দেখে না, শুধু দেখে কোনো Foreign Key আছে কিনা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম পথটা সবচেয়ে পরিষ্কার: Parent আর Child দুটোকেই একই TRUNCATE এ দিন। দুটো একসাথে খালি হলে কোনো Child Row কোনো
              হারানো Parent কে দেখাতে পারে না, তাই প্রতিশ্রুতি ভাঙার প্রশ্নই নেই। কোনটা আগে লিখলেন, তাতে কিছু যায় আসে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Parent আর Child একসাথে"
              query={`${TOURS_SETUP}
${TOURS_DEPARTURES}

TRUNCATE drop_departures, drop_tours;
SELECT (SELECT count(*) FROM drop_tours)      AS tours,
       (SELECT count(*) FROM drop_departures) AS departures;`}
              caption="tours 0, departures 0, কোনো Error নেই। আপনি নিজে বলে দিয়েছেন কোন কোন Table যাবে, তাই PostgreSQL নিশ্চিত যে কোনো Row একা পড়ে থাকবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় পথ <code className={CODE}>CASCADE</code>: এই Table কে যারা দেখায় তারাও খালি হবে, তাদের যারা দেখায় তারাও, শিকলের
                শেষ পর্যন্ত। তালিকাটা আপনি লিখছেন না, PostgreSQL নিজে খুঁজে নিচ্ছে। কতদূর যায়, আসল Island Tours এ দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                বক্সটা আসল Table এ হাত দেয়, তাই পুরোটা BEGIN আর ROLLBACK এর মাঝে। BEGIN একটা Transaction খোলে, আর ROLLBACK তার ভেতরের
                সব পরিবর্তন বাতিল করে, যেন কিছুই ঘটেনি। তাই পাতার Database অক্ষত থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="TRUNCATE customers CASCADE, তারপর ROLLBACK"
              query={`BEGIN;
TRUNCATE customers CASCADE;
SELECT (SELECT count(*) FROM destinations) AS destinations,
       (SELECT count(*) FROM guides)       AS guides,
       (SELECT count(*) FROM tours)        AS tours,
       (SELECT count(*) FROM departures)   AS departures,
       (SELECT count(*) FROM customers)    AS customers,
       (SELECT count(*) FROM bookings)     AS bookings,
       (SELECT count(*) FROM payments)     AS payments,
       (SELECT count(*) FROM reviews)      AS reviews;
ROLLBACK;`}
              caption="শুধু customers খালি করতে বলা হয়েছিল, কিন্তু খালি হয়েছে চারটা Table: customers, bookings, payments আর reviews, সবগুলো 0। destinations 7, guides 5, tours 9, departures 16 অক্ষত। ROLLBACK এর পরে সব ফেরত, নিচের বক্সে মিলিয়ে নিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROLLBACK এর পরে গোনা"
              query={`SELECT (SELECT count(*) FROM customers) AS customers,
       (SELECT count(*) FROM bookings)  AS bookings,
       (SELECT count(*) FROM payments)  AS payments,
       (SELECT count(*) FROM reviews)   AS reviews;`}
              caption="15, 24, 19, 10। একটা Row ও হারায়নি। PostgreSQL এ TRUNCATE ও Transaction এর ভেতরে চলে, তাই ROLLBACK তাকে পুরোপুরি ফিরিয়ে আনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TruncateBlastDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                psql এ PostgreSQL প্রতিটা বাড়তি Table এর জন্য একটা NOTICE দেখায়, যা এই পাতার বক্স দেখায় না। আমাদের Container এর আসল
                ফলাফল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: TRUNCATE customers CASCADE",
          code: `-- psql -e: প্রতিটা কমান্ড, তার নিচে তার ফলাফল
BEGIN;
BEGIN
TRUNCATE customers CASCADE;
NOTICE:  truncate cascades to table "bookings"
NOTICE:  truncate cascades to table "payments"
NOTICE:  truncate cascades to table "reviews"
TRUNCATE TABLE
ROLLBACK;
ROLLBACK`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "CASCADE Data দেখে না, শুধু তীর দেখে",
          content: (
            <ContentParagraph>
              <code className={CODE}>TRUNCATE guides CASCADE</code> guides এর সাথে আরও পাঁচটা Table খালি করে: tours, departures,
              bookings, payments, reviews। Booking এর সাথে Guide এর সরাসরি সম্পর্ক নেই, তবু শিকল সেখানে পৌঁছায়। guide_id NULL এমন ট্যুরও
              বাঁচে না, কারণ CASCADE Row দেখে না, তীর ধরে পুরো Table খালি করে। নিচের Lab এ প্রতিটা Table বেছে দেখুন, আর Production এ
              CASCADE এর আগে কোন Table যাবে তার তালিকা নিজে লিখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CascadeExplorerLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  Starter Query চারটা Table বানায়: <code className={CODE}>drop_ex3_customers</code>, তাকে দেখানো{" "}
                  <code className={CODE}>drop_ex3_bookings</code>, তাকে দেখানো <code className={CODE}>drop_ex3_payments</code>, আর একদম
                  আলাদা <code className={CODE}>drop_ex3_guides</code>, সবগুলোতে আসল Data। মন্তব্যের জায়গায় একটাই TRUNCATE লিখুন যা
                  Customer আর তাদের উপর নির্ভর করা সব Row মুছে দেয়, কিন্তু guides এর ৫টা Row অক্ষত রাখে। যাচাইয়ের Query না বদলে
                  রাখুন।
                </>
              }
              hint={
                <>
                  শুধু <code className={CODE}>TRUNCATE drop_ex3_customers;</code> দিলে Error আসবে। দুই পথের যেকোনোটা নিন: তিনটা
                  Table এর নাম নিজে লিখুন, অথবা CASCADE। চারটার নাম একসাথে লিখলে guides ও খালি হয়ে যাবে।
                </>
              }
              starter={`DROP TABLE IF EXISTS drop_ex3_payments, drop_ex3_bookings, drop_ex3_customers, drop_ex3_guides;
CREATE TABLE drop_ex3_customers (
  customer_id integer PRIMARY KEY,
  full_name   text NOT NULL
);
CREATE TABLE drop_ex3_bookings (
  booking_id  integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES drop_ex3_customers (customer_id)
);
CREATE TABLE drop_ex3_payments (
  payment_id integer PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES drop_ex3_bookings (booking_id)
);
CREATE TABLE drop_ex3_guides (
  guide_id  integer PRIMARY KEY,
  full_name text NOT NULL
);
INSERT INTO drop_ex3_customers SELECT customer_id, full_name FROM customers;
INSERT INTO drop_ex3_bookings  SELECT booking_id, customer_id FROM bookings;
INSERT INTO drop_ex3_payments  SELECT payment_id, booking_id FROM payments;
INSERT INTO drop_ex3_guides    SELECT guide_id, full_name FROM guides;

-- এখানে একটা TRUNCATE: Customer আর তাদের উপর নির্ভর করা সব Row, guides অক্ষত

SELECT (SELECT count(*) FROM drop_ex3_customers) AS customers,
       (SELECT count(*) FROM drop_ex3_bookings)  AS bookings,
       (SELECT count(*) FROM drop_ex3_payments)  AS payments,
       (SELECT count(*) FROM drop_ex3_guides)    AS guides;`}
              solution={`SELECT *
FROM (VALUES (0, 0, 0, 5)) AS v(customers, bookings, payments, guides);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "who-notices",
      subHeader: { index: "007", title: "Who Notices" },
      title: <SectionTitle>DELETE এর খবর সবাই পায়, TRUNCATE এর না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DELETE প্রতিটা Row সরানোর সময় দুই পাহারাদারকে খবর দেয়। প্রথমজন Foreign Key: Parent এর একটা Row মুছলে PostgreSQL দেখে
                কোনো Child Row তাকে এখনো দেখায় কিনা, আর দেখালে কী হবে তা ঠিক করে ON DELETE নিয়ম, যা{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Lesson 09
                </Link>{" "}
                এ দেখেছেন। Default নিয়মে মোছা আটকে যায়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Kuakata র কোনো Departure নেই, তাই সে চলে যায়। Sundarbans এর দুটো আছে, তাই Foreign Key আটকায়। Error টা শেষ
                Statement এ, যাতে আগের কাজ দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DELETE প্রতিটা Row এর জন্য Foreign Key দেখে"
              query={`${TOURS_SETUP}
${TOURS_DEPARTURES}

DELETE FROM drop_tours WHERE tour_id = 3;
SELECT tour_id, title FROM drop_tours ORDER BY tour_id;
DELETE FROM drop_tours WHERE tour_id = 1;`}
              caption="প্রথম DELETE বলে DELETE 1, Kuakata Sunrise Weekend চলে গেল, বাকি দুটো ট্যুর। দ্বিতীয়টায় Error 23503: update or delete on table drop_tours violates foreign key constraint drop_departures_tour_id_fkey। DETAIL এ ঠিক কোন Row আটকাচ্ছে: Key (tour_id)=(1) is still referenced from table drop_departures। TRUNCATE এর Error বলেছিল কোন Table দেখায়, DELETE এর Error বলে কোন Row দেখায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয়জন Trigger: একটা ছোট Function যা Database নিজে চালায় কোনো ঘটনা ঘটলে, যেমন প্রতিটা Row মোছার পরে, দরজা খুললেই
                বাজা ঘণ্টার মতো। Audit Log, অর্থাৎ কে কখন কী মুছল তার খাতা, প্রায়ই Trigger দিয়ে রাখা হয়। পুরো লেসন Module 14 এ,{" "}
                <Link href="/sql/topic/triggers" className={LINK}>
                  Triggers: Building an Audit Log
                </Link>
                । এখানে শুধু দেখুন কোন কমান্ডে ঘণ্টা বাজে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে <code className={CODE}>drop_bookings</code> এ দুটো Trigger। প্রথমটা Row Level: প্রতিটা মোছা Row এর জন্য{" "}
                <code className={CODE}>drop_audit</code> এ একটা লাইন। দ্বিতীয়টা Statement Level, শুধু TRUNCATE এ, পুরো কমান্ডে একবার।
                Function এর ভেতরটা এখন না বুঝলেও চলবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন কমান্ডে Trigger চলে"
              query={`DROP TABLE IF EXISTS drop_bookings, drop_audit;
CREATE TABLE drop_bookings AS
  SELECT booking_id, status, total_bdt FROM bookings;
CREATE TABLE drop_audit (
  action     text NOT NULL,
  booking_id integer
);

CREATE OR REPLACE FUNCTION drop_log_row() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO drop_audit (action, booking_id) VALUES ('DELETE', OLD.booking_id);
  RETURN OLD;
END;
$$;
CREATE OR REPLACE FUNCTION drop_log_truncate() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO drop_audit (action) VALUES ('TRUNCATE');
  RETURN NULL;
END;
$$;
CREATE TRIGGER drop_bookings_row_log
  AFTER DELETE ON drop_bookings
  FOR EACH ROW EXECUTE FUNCTION drop_log_row();
CREATE TRIGGER drop_bookings_truncate_log
  AFTER TRUNCATE ON drop_bookings
  FOR EACH STATEMENT EXECUTE FUNCTION drop_log_truncate();

DELETE FROM drop_bookings WHERE status = 'cancelled';
SELECT count(*) AS bookings_left FROM drop_bookings;
TRUNCATE drop_bookings;
SELECT action, booking_id FROM drop_audit ORDER BY action, booking_id;`}
              caption="DELETE তিনটা Row সরায়, আর Log এ তিনটা লাইন: DELETE 5, DELETE 12, DELETE 18। তারপর TRUNCATE বাকি ২১টা Row সরায়, কিন্তু Row Level Trigger একবারও চলে না। Log এ শুধু একটা লাইন যোগ হয়, TRUNCATE, booking_id ফাঁকা, আর সেটাও এসেছে আলাদা করে বসানো ON TRUNCATE Trigger থেকে। সেটা না থাকলে ২১টা Booking চলে যেত, Log এ একটা দাগও না রেখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যে Table এর মোছার হিসাব রাখতে হয়",
          content: (
            <ContentParagraph>
              PostgreSQL এর Docs বলে, TRUNCATE কোনো ON DELETE Trigger চালাবে না। তাই যে Table এর প্রতিটা মোছার হিসাব জরুরি, সেখানে
              মুছতে DELETE ব্যবহার করুন, অথবা একটা ON TRUNCATE Trigger বসান, অথবা App এর User থেকে TRUNCATE এর অনুমতি সরিয়ে রাখুন, যা
              PostgreSQL এ DELETE এর অনুমতি থেকে আলাদা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "drop-table",
      subHeader: { index: "008", title: "DROP TABLE" },
      title: <SectionTitle>DROP TABLE: খাতাটাই ফেলে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>DROP TABLE table;</code> Table টাকে পুরোপুরি সরিয়ে দেয়। শুধু Row না, সাথে যায় Column এর সংজ্ঞা,
                Primary Key, প্রতিটা Index, প্রতিটা Constraint, Table এর Trigger, Identity এর Sequence, আর এই Table এ কাকে কী অনুমতি
                দেওয়া ছিল সেই হিসাবও। PostgreSQL এর Docs এর ভাষায় DROP TABLE সবসময় Table এর Index, Rule, Trigger আর Constraint সরিয়ে
                দেয়। কাল একই নামে Table চাইলে আবার CREATE TABLE দিয়ে শুরু থেকে বানাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Table টা যদি অন্য কোনো জিনিসের ভিত্তি হয়? যেমন অন্য Table এর Foreign Key তাকে দেখায়, বা কেউ তার উপর একটা View
                বানিয়েছে। View হলো একটা নাম দেওয়া SELECT, যাকে Table এর মতো পড়া যায়, এর পুরো লেসন{" "}
                <Link href="/sql/topic/views" className={LINK}>
                  Module 14
                </Link>{" "}
                এ। এমন নির্ভরতা থাকলে DROP TABLE এর Default আচরণ, যার নাম <code className={CODE}>RESTRICT</code>, সোজা না বলে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নির্ভর করা জিনিস থাকলে DROP TABLE না বলে"
              query={`${TOURS_SETUP}
CREATE VIEW drop_tour_list AS
  SELECT tour_id, title FROM drop_tours;

DROP TABLE drop_tours;`}
              caption="Error 2BP01: cannot drop table drop_tours because other objects depend on it। DETAIL এ দুটো লাইন, দুটো নির্ভর করা জিনিস: drop_departures এর Constraint drop_departures_tour_id_fkey, আর View drop_tour_list। HINT: Use DROP ... CASCADE to drop the dependent objects too। কিছুই মোছা হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HINT যেটা বলছে, <code className={CODE}>DROP TABLE ... CASCADE</code>, সেটার মানে TRUNCATE এর CASCADE থেকে আলাদা, আর এই
                পার্থক্যটাই লেসনের সবচেয়ে গুরুত্বপূর্ণ কথাগুলোর একটা। DROP এর CASCADE নির্ভর করা View কে পুরোপুরি সরিয়ে দেয়। কিন্তু
                Foreign Key এর বেলায় সে শুধু অন্য Table এর Constraint টা সরায়, অন্য Table টাকে না। Child Table থাকে, তার সব Row ও
                থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DROP TABLE ... CASCADE আসলে কী সরায়"
              query={`${TOURS_SETUP}
${TOURS_DEPARTURES}
CREATE VIEW drop_tour_list AS
  SELECT tour_id, title FROM drop_tours;

DROP TABLE drop_tours CASCADE;
SELECT relname AS name, relkind::text AS kind
FROM pg_class
WHERE relname IN ('drop_tours', 'drop_departures', 'drop_tour_list')
ORDER BY relname;
SELECT departure_id, tour_id, starts_on FROM drop_departures ORDER BY departure_id;
SELECT count(*) AS foreign_keys_left
FROM pg_constraint
WHERE conrelid = 'drop_departures'::regclass AND contype = 'f';`}
              caption="তিনটা নামের মধ্যে টিকে আছে শুধু drop_departures, kind r মানে সাধারণ Table। View টা নেই, drop_tours নেই। কিন্তু drop_departures এর তিনটা Row অক্ষত, tour_id এখনো 1, 1 আর 2, আর foreign_keys_left 0। মানে এই সংখ্যাগুলো এখন এমন ট্যুরকে দেখায় যার অস্তিত্বই নেই, আর পাহারা দেওয়ার কেউ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DropCascadeSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আসল Island Tours এ একই জিনিস দেখুন, আবার BEGIN আর ROLLBACK এর মাঝে। bookings কে দেখায় payments আর reviews। bookings কে
              CASCADE দিয়ে সরালে ওই দুটো Table টিকে থাকে, তাদের ১৯ আর ১০টা Row সহ, শুধু হারায় তাদের Foreign Key।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DROP TABLE bookings CASCADE, তারপর ROLLBACK"
              query={`BEGIN;
DROP TABLE bookings CASCADE;
SELECT (SELECT count(*) FROM payments) AS payments,
       (SELECT count(*) FROM reviews)  AS reviews;
SELECT conrelid::regclass::text AS on_table, conname
FROM pg_constraint
WHERE contype = 'f'
ORDER BY 1, 2;
ROLLBACK;`}
              caption="payments 19, reviews 10, দুটোই অক্ষত। কিন্তু পুরো Database এ Foreign Key বাকি মাত্র তিনটা: departures_tour_id_fkey, tours_destination_id_fkey আর tours_guide_id_fkey। চলে গেছে চারটা: bookings এর নিজের দুটো, Table এর সাথেই, আর payments ও reviews এর দুটো, CASCADE এর কারণে। নিচের বক্সে ROLLBACK এর পরে সাতটাই ফেরত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROLLBACK এর পরে Foreign Key গুলো"
              query={`SELECT conrelid::regclass::text AS on_table, conname
FROM pg_constraint
WHERE contype = 'f'
ORDER BY 1, 2;`}
              caption="সাতটা Foreign Key, ঠিক আগের মতো। PostgreSQL এ DROP TABLE ও Transaction এর অংশ, তাই ROLLBACK পুরো Table, তার Data আর সব নিয়ম ফিরিয়ে আনে। MySQL এ এটা হয় না, সেটা In MySQL Section এ।"
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
                  Starter Query <code className={CODE}>drop_ex4_tours</code>, তাকে দেখানো{" "}
                  <code className={CODE}>drop_ex4_departures</code> (১৬টা আসল Departure) আর একটা View{" "}
                  <code className={CODE}>drop_ex4_tour_list</code> বানায়। মন্তব্যের জায়গায় একটাই Statement লিখুন যা drop_ex4_tours
                  সরিয়ে দেয়, আর drop_ex4_departures কে তার Row সহ রেখে দেয়। যাচাইয়ের Query দেখায় drop_ex4 দিয়ে শুরু কোন Table আর View
                  টিকে আছে, আর প্রতিটার কয়টা Foreign Key।
                </>
              }
              hint={
                <>
                  সাধারণ DROP TABLE এ Error আসবে, কারণ দুটো জিনিস নির্ভর করছে। DETAIL পড়ুন, HINT এর শব্দটা যোগ করুন। drop_ex4_departures
                  এর নাম DROP এ লিখবেন না।
                </>
              }
              starter={`DROP VIEW IF EXISTS drop_ex4_tour_list;
DROP TABLE IF EXISTS drop_ex4_departures, drop_ex4_tours;
CREATE TABLE drop_ex4_tours (
  tour_id integer PRIMARY KEY,
  title   text NOT NULL
);
CREATE TABLE drop_ex4_departures (
  departure_id integer PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES drop_ex4_tours (tour_id),
  starts_on    date NOT NULL
);
INSERT INTO drop_ex4_tours SELECT tour_id, title FROM tours;
INSERT INTO drop_ex4_departures SELECT departure_id, tour_id, starts_on FROM departures;
CREATE VIEW drop_ex4_tour_list AS
  SELECT tour_id, title FROM drop_ex4_tours;

-- এখানে একটা Statement: drop_ex4_tours সরান, drop_ex4_departures যেন থাকে

SELECT c.relname AS name,
       c.relkind::text AS kind,
       (SELECT count(*) FROM pg_constraint k
        WHERE k.conrelid = c.oid AND k.contype = 'f') AS foreign_keys
FROM pg_class c
WHERE c.relname LIKE 'drop_ex4%' AND c.relkind IN ('r', 'v')
ORDER BY c.relname;`}
              solution={`SELECT *
FROM (VALUES ('drop_ex4_departures', 'r', 0)) AS v(name, kind, foreign_keys);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "if-exists",
      subHeader: { index: "009", title: "IF EXISTS" },
      title: <SectionTitle>IF EXISTS আর বারবার চালানো যায় এমন Script</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                না থাকা Table কে DROP করতে বললে PostgreSQL Error দেয়। <code className={CODE}>IF EXISTS</code> দিলে সে বলে, নেই তো নেই, আর
                পরের কাজে যায়। এর উপর দাঁড়িয়ে আছে Idempotent Script এর ধারণা: একবার চালালে যা হয়, দশবার চালালেও তাই।
              </ContentParagraph>
              <ContentParagraph>
                খেয়াল করেছেন নিশ্চয়ই, এই মডিউলের প্রায় প্রতিটা বক্স শুরু হয়েছে <code className={CODE}>DROP TABLE IF EXISTS</code>{" "}
                দিয়ে। কারণটা এটাই: প্রথমবার Table থাকে না, IF EXISTS চুপ থাকে। দ্বিতীয়বার আগের বারের Table থাকে, DROP তাকে সরায়, আর
                CREATE নতুন করে বানায়। দুইবারই ফলাফল এক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="IF EXISTS থাকলে আর না থাকলে"
              query={`DROP TABLE IF EXISTS drop_ghost;
DROP TABLE drop_ghost;`}
              caption="প্রথম Statement শুধু বলে DROP TABLE, কোনো Error নেই, যদিও drop_ghost কখনো ছিলই না। দ্বিতীয়টা IF EXISTS ছাড়া, তাই Error 42P01: table drop_ghost does not exist।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              IF EXISTS কিন্তু পুরোপুরি চুপ থাকে না। psql এ সে একটা NOTICE দেয়। আপনি এই NOTICE গুলো আগেই দেখেছেন,{" "}
              <Link href="/sql/topic/load-sample-database" className={LINK}>
                Module 02
              </Link>{" "}
              এ প্রথমবার Island Tours Load করার সময়। আমাদের Container এ নতুন Database এ ফাইলটা Load করলে আসল ফলাফল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `createdb island_tours
psql -d island_tours -q -f island-tours.sql
NOTICE:  table "reviews" does not exist, skipping
NOTICE:  table "payments" does not exist, skipping
NOTICE:  table "bookings" does not exist, skipping
NOTICE:  table "departures" does not exist, skipping
NOTICE:  table "tours" does not exist, skipping
NOTICE:  table "guides" does not exist, skipping
NOTICE:  table "destinations" does not exist, skipping
NOTICE:  table "customers" does not exist, skipping`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NOTICE গুলো আসে ফাইলের প্রথম আসল লাইন থেকে, যেটা এখন আপনি পুরোপুরি পড়তে পারবেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "island-tours.sql, line 5",
          code: `DROP TABLE IF EXISTS reviews, payments, bookings, departures, tours, guides, destinations, customers CASCADE;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IF EXISTS এর জন্য প্রথমবার Load এ Error হয় না। একই DROP এ আটটাই আছে বলে তাদের নিজেদের Foreign Key বাধা দেয় না। তাহলে
                CASCADE কেন? আপনি যদি এই Table গুলোর উপর একটা View বানান, বা নিজের Table থেকে bookings কে Foreign Key দিয়ে দেখান, CASCADE
                ছাড়া ফাইলটা আবার Load করা আটকে যেত।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকটাও মনে রাখুন: সেই কারণেই ফাইলটা আবার Load করলে আপনার View আর আপনার Table এর Foreign Key নিঃশব্দে মুছে যাবে।
                Reset Script এ এটাই চাওয়া, অন্য কোথাও বিপদ। CASCADE এর আগে দেখে নিন কী নির্ভর করছে, psql এর{" "}
                <code className={CODE}>\d+ table</code> বা pg_constraint দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কমান্ড", "IF EXISTS আছে?", "না থাকা Table এ কী হয়"],
          rows: [
            ["DROP TABLE", "আছে: DROP TABLE IF EXISTS", "IF EXISTS থাকলে NOTICE, না থাকলে Error 42P01"],
            ["TRUNCATE", "নেই, লিখলে Syntax Error", "Error: relation does not exist"],
            ["DELETE", "নেই", "Error: relation does not exist"],
            ["DROP VIEW, DROP INDEX, DROP TYPE, DROP SCHEMA", "সবগুলোতে আছে", "একই আচরণ, একই NOTICE"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সরানোর ক্রম",
          content: (
            <ContentParagraph>
              কয়েকটা সম্পর্কিত জিনিস সরানোর সময় ক্রম মানুন: আগে যারা নির্ভর করে, পরে যার উপর নির্ভর করে। এই লেসনের বক্সগুলো তাই আগে{" "}
              <code className={CODE}>DROP VIEW IF EXISTS drop_tour_list</code>, তারপর{" "}
              <code className={CODE}>DROP TABLE IF EXISTS drop_departures, drop_tours</code>। দুটো Table একই Statement এ, তাই তাদের
              মধ্যের Foreign Key বাধা দেয় না। View টা আগে না সরালে সাধারণ DROP TABLE আটকে যেত, আর CASCADE লিখে সেই বাধা পার হওয়া
              মানে না জেনে কিছু মুছে ফেলার ঝুঁকি নেওয়া।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "undo",
      subHeader: { index: "010", title: "Undo" },
      title: <SectionTitle>ভুল হলে ফেরত আনার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনে আপনি বারবার একটা কৌশল দেখেছেন: BEGIN, তারপর বিপজ্জনক কাজ, তারপর ROLLBACK, আর সব আগের মতো। PostgreSQL এর একটা
                বিশেষ শক্তি এখানে কাজ করছে: এখানে DDL ও Transaction এর অংশ। DELETE তো বটেই, TRUNCATE আর DROP TABLE ও COMMIT এর আগ পর্যন্ত
                পাকা হয় না। নিচের বক্সে তিনটাই একসাথে, আসল Table এ, তারপর একটা ROLLBACK।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা কমান্ড, একটা ROLLBACK"
              query={`BEGIN;
DELETE FROM reviews WHERE rating <= 3;
TRUNCATE payments;
DROP TABLE reviews;
SELECT (SELECT count(*) FROM payments) AS payments,
       (SELECT count(*) FROM pg_tables WHERE tablename = 'reviews') AS reviews_tables;
ROLLBACK;`}
              caption="DELETE 2 (rating 2 আর 3 এর দুটো Review), তারপর payments খালি, তারপর reviews Table টাই নেই: payments 0, reviews_tables 0। শেষে ROLLBACK। নিচের বক্সে দেখুন কী ফিরল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROLLBACK এর পরে"
              query={`SELECT (SELECT count(*) FROM payments) AS payments,
       (SELECT count(*) FROM reviews)  AS reviews;`}
              caption="payments 19, reviews 10। মুছে ফেলা দুটো Review, খালি করা Payment, এমনকি সরিয়ে দেওয়া পুরো reviews Table, সব ফিরে এসেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UndoTimelineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর থেকে আসে সবচেয়ে দরকারি অভ্যাস: Production এ হাতে DELETE, TRUNCATE বা DROP চালানোর আগে BEGIN, তারপর SELECT দিয়ে সংখ্যা
                যাচাই, ঠিক থাকলে COMMIT, না থাকলে ROLLBACK। SAVEPOINT সহ বিস্তারিত{" "}
                <Link href="/sql/topic/transactions-basics" className={LINK}>
                  BEGIN, COMMIT, ROLLBACK and SAVEPOINT
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                COMMIT এর পরে কোনো Database এই Undo বোতাম নেই। ফেরার উপায় শুধু Backup, যত পুরনো Backup তত পুরনো Data। Point-in-time
                Recovery আগে থেকে চালু থাকলে ভুলের এক মুহূর্ত আগে ফেরা যায়। পুরো গল্প Module 18 এ:{" "}
                <Link href="/sql/topic/pg-dump-restore" className={LINK}>
                  pg_dump and pg_restore
                </Link>{" "}
                আর{" "}
                <Link href="/sql/topic/physical-backups-pitr" className={LINK}>
                  Physical Backups and Point-in-time Recovery
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "BEGIN এর ভেতরে Error হলে",
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Transaction এর ভেতরে কোনো Statement Error দিলে PostgreSQL পুরো Transaction কে বাতিলযোগ্য ধরে নেয়, আর ROLLBACK না দেওয়া
                পর্যন্ত আর কোনো কমান্ড নেয় না। psql এ সেটা দেখতে এমন:
              </ContentParagraph>
              <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed">
                {`BEGIN
ERROR:  cannot truncate a table referenced in a foreign key constraint
DETAIL:  Table "payments" references "bookings".
HINT:  Truncate table "payments" at the same time, or use TRUNCATE ... CASCADE.
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK`}
              </pre>
              <ContentParagraph>
                এই পাতার বক্সগুলোও একটাই Session ভাগ করে চলে। তাই কোনো বক্সে BEGIN দিয়ে নিজে কিছু বদলে Error পেলে, যেকোনো বক্সে
                শুধু <code className={CODE}>ROLLBACK;</code> চালিয়ে নিন, তারপর আবার সব স্বাভাবিক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা সূক্ষ্ম ব্যতিক্রম: Docs বলে TRUNCATE MVCC-safe না। TRUNCATE এর আগে নেওয়া Snapshot দিয়ে পড়তে থাকা অন্য Transaction,
              TRUNCATE COMMIT হওয়ার পরে Table টাকে খালি দেখতে পারে। Snapshot আর MVCC কী, সেটা{" "}
              <Link href="/sql/topic/mvcc" className={LINK}>
                MVCC
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "speed-space-locks",
      subHeader: { index: "011", title: "Speed, Space and Locks" },
      title: <SectionTitle>গতি, Disk এর জায়গা, Lock আর অনুমতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WHERE ছাড়া DELETE আর TRUNCATE এর ফলাফল একই দেখায়, কিন্তু ভেতরের কাজ আলাদা। DELETE প্রতিটা Row কে মৃত চিহ্ন দেয়, সেটা
                WAL নামের লগে লেখে যাতে Crash হলেও হিসাব থাকে, Foreign Key দেখে, Trigger চালায়। দশ লাখ Row মানে দশ লাখ বার। মৃত Row
                গুলো Disk এ পড়ে থাকে, যতক্ষণ না VACUUM সেই জায়গা নতুন Row এর জন্য খালি ঘোষণা করে। VACUUM এর লেসন{" "}
                <Link href="/sql/topic/vacuum" className={LINK}>
                  Module 18
                </Link>{" "}
                এ।
              </ContentParagraph>
              <ContentParagraph>
                TRUNCATE কোনো Row এর কাছে যায় না। সে Table কে একটা নতুন, ফাঁকা ফাইল দেয়, আর COMMIT হলে পুরনো ফাইলটা পুরোটা মুছে
                দেয়। Docs এর ভাষায় সে Disk এর জায়গা সাথে সাথে ফেরত দেয়, পরে VACUUM এর দরকার পড়ে না। নিচের বক্সে ২ লাখ Row এর একটা
                Table, তার Disk এর আকার আর ফাইল নম্বর, তিন সময়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DELETE আর TRUNCATE এর পরে Disk এ কত জায়গা"
              query={`DROP TABLE IF EXISTS drop_big;
CREATE TABLE drop_big AS
  SELECT g AS id, md5(g::text) AS note
  FROM generate_series(1, 200000) AS g;
SELECT count(*) AS rows, pg_size_pretty(pg_relation_size('drop_big')) AS on_disk,
       pg_relation_filenode('drop_big') AS file_no
FROM drop_big;

DELETE FROM drop_big;
SELECT count(*) AS rows, pg_size_pretty(pg_relation_size('drop_big')) AS on_disk,
       pg_relation_filenode('drop_big') AS file_no
FROM drop_big;

TRUNCATE drop_big;
SELECT count(*) AS rows, pg_size_pretty(pg_relation_size('drop_big')) AS on_disk,
       pg_relation_filenode('drop_big') AS file_no
FROM drop_big;`}
              caption="প্রথমে ২০০০০০ Row, 14 MB। DELETE এর পরে Row 0, কিন্তু Disk এ এখনো 14 MB, আর ফাইল নম্বর একই: মৃত Row গুলো জায়গা ধরে আছে। TRUNCATE এর পরে 0 bytes, আর ফাইল নম্বর বদলে গেছে, কারণ এটা একটা নতুন ফাইল। নম্বরটা আপনার পাতায় অন্য হবে, আমাদের চালানোয় 16771 থেকে 16776, কিন্তু বদলানোটাই আসল কথা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DeleteVsTruncateDiskSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সময়। নিচের বক্সে একটা ছোট কৌশল: প্রতিটা কাজের আগে আর পরে <code className={CODE}>clock_timestamp()</code> একটা Table
              এ লিখে রাখা, তারপর LAG দিয়ে পাশাপাশি দুটো সময়ের পার্থক্য, যেটা{" "}
              <Link href="/sql/topic/lag-lead" className={LINK}>
                Module 08
              </Link>{" "}
              এ শিখেছেন। clock_timestamp() প্রতিবার ডাকার মুহূর্তের আসল সময় দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="২ লাখ Row: DELETE বনাম TRUNCATE এর সময়"
              query={`DROP TABLE IF EXISTS drop_big, drop_clock;
CREATE TABLE drop_big AS
  SELECT g AS id, md5(g::text) AS note
  FROM generate_series(1, 200000) AS g;
CREATE TABLE drop_clock (step text NOT NULL, at timestamptz NOT NULL);

INSERT INTO drop_clock VALUES ('start', clock_timestamp());
DELETE FROM drop_big;
INSERT INTO drop_clock VALUES ('DELETE 200000 rows', clock_timestamp());
INSERT INTO drop_big SELECT g, md5(g::text) FROM generate_series(1, 200000) AS g;
INSERT INTO drop_clock VALUES ('refill', clock_timestamp());
TRUNCATE drop_big;
INSERT INTO drop_clock VALUES ('TRUNCATE 200000 rows', clock_timestamp());

SELECT step,
       round(extract(epoch FROM at - lag(at) OVER (ORDER BY at)) * 1000) AS took_ms
FROM drop_clock
ORDER BY at;`}
              caption="সংখ্যাগুলো আপনার কম্পিউটার আর Browser এর উপর নির্ভর করে, তাই হুবহু মিলবে না। একই PGlite Engine এ আমাদের এক চালানোয় DELETE নিয়েছিল 86 ms, আবার ভরতে 246 ms, আর TRUNCATE মাত্র 2 ms। Row দ্বিগুণ করে চালান: DELETE এর সময় অনেকটা বাড়বে, TRUNCATE এর প্রায় একই থাকবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আসল PostgreSQL Server এ, psql এর <code className={CODE}>\timing</code> চালু রেখে, দশ লাখ Row আর একটা Primary Key সহ
              আমাদের Container এর ফলাফল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: \\timing on",
          code: `CREATE TABLE drop_big (id integer PRIMARY KEY, note text NOT NULL);
INSERT INTO drop_big SELECT g, md5(g::text) FROM generate_series(1, 1000000) AS g;
-- INSERT 0 1000000, Time: 3241.833 ms (00:03.242)
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- 87 MB

DELETE FROM drop_big;
-- DELETE 1000000, Time: 410.860 ms
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- 87 MB, Row নেই কিন্তু জায়গা আছে

INSERT INTO drop_big SELECT g, md5(g::text) FROM generate_series(1, 1000000) AS g;
TRUNCATE drop_big;
-- TRUNCATE TABLE, Time: 32.935 ms
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- 16 kB, শুধু ফাঁকা Table আর তার Index এর শুরুর অংশ`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দশ লাখে প্রায় বারো গুণ পার্থক্য, আর Trigger বা Foreign Key থাকলে আরও বেশি। কিন্তু গতির দাম আছে: Lock। Lock হলো একটা তালা,
                যা Transaction তার কাজের সময় Table এ ঝুলিয়ে রাখে। কোন কমান্ড কোন তালা নেয়, pg_locks থেকে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DELETE আর TRUNCATE কোন Lock নেয়"
              query={`BEGIN;
DELETE FROM reviews WHERE rating = 2;
SELECT 'DELETE' AS command, mode FROM pg_locks WHERE relation = 'reviews'::regclass;
ROLLBACK;
BEGIN;
TRUNCATE reviews;
SELECT 'TRUNCATE' AS command, mode FROM pg_locks WHERE relation = 'reviews'::regclass ORDER BY mode;
ROLLBACK;`}
              caption="DELETE নেয় RowExclusiveLock, একটা হালকা তালা: অন্যরা একই সময়ে Table পড়তে পারে, এমনকি অন্য Row বদলাতেও পারে। TRUNCATE এর তালিকায় আছে AccessExclusiveLock, সবচেয়ে কড়া তালা, যা অন্য সব Lock এর সাথে সংঘাত করে, সাধারণ SELECT এর নেওয়া AccessShareLock এর সাথেও। সাথের ShareLock টা একটা দুর্বল তালা, যা PostgreSQL পথে নেয়, কিন্তু কে অপেক্ষা করবে সেটা ঠিক করে সবচেয়ে কড়া তালাটাই। দুটো Transaction ই ROLLBACK দিয়ে শেষ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দ্রুত TRUNCATE, কিন্তু সবাইকে দাঁড় করিয়ে",
          content: (
            <ContentParagraph>
              TRUNCATE শুরু করতে অপেক্ষা করে যতক্ষণ না Table এর চলমান প্রতিটা Query শেষ হয়, আর তার অপেক্ষার শুরু থেকে COMMIT পর্যন্ত
              নতুন SELECT ও লাইনে দাঁড়ায়। ব্যস্ত Production Table এ লম্বা একটা Report চলার সময় TRUNCATE দিলে Website এর সব Query আটকে
              থাকতে পারে। DROP TABLE ও একই কড়া তালা নেয়। বিস্তারিত Module 12 এর{" "}
              <Link href="/sql/topic/row-locks" className={LINK}>
                Row Locks and FOR UPDATE
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বিশাল Table থেকে অনেক Row, কিন্তু সব না, মুছতে হলে এক DELETE এ না মুছে ছোট দলে মোছা হয়, যাতে প্রতিটা Transaction ছোট
                থাকে। PostgreSQL এ DELETE এ সরাসরি LIMIT চলে না, তাই <code className={CODE}>WHERE id IN (SELECT id ... LIMIT 10000)</code>{" "}
                লেখা হয়। এর পুরো কৌশল{" "}
                <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                  DELETE and Soft Delete
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                শেষে অনুমতি, তিন কমান্ডের তিন রকম: DELETE অনুমতি, আলাদা TRUNCATE অনুমতি, আর DROP TABLE শুধু Table বা Schema র মালিক বা
                Superuser। শুধু SELECT আর DELETE পাওয়া একটা Role দিয়ে আমাদের Container এর ফলাফল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: অনুমতি আলাদা",
          code: `CREATE ROLE drop_app_user;
CREATE TABLE drop_imports AS SELECT booking_id FROM bookings;
GRANT SELECT, DELETE ON drop_imports TO drop_app_user;
SET ROLE drop_app_user;

DELETE FROM drop_imports WHERE booking_id = 1;
-- DELETE 1
TRUNCATE drop_imports;
-- ERROR:  permission denied for table drop_imports
DROP TABLE drop_imports;
-- ERROR:  must be owner of table drop_imports

RESET ROLE;
DROP TABLE drop_imports;
DROP ROLE drop_app_user;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাই App এর User এর TRUNCATE আর DROP এর ক্ষমতা না থাকাই ভালো, যাতে Bug বা SQL Injection হলেও সবচেয়ে বড় ক্ষতির পথ বন্ধ থাকে।
              বিস্তারিত Module 16 এর{" "}
              <Link href="/sql/topic/least-privilege-app-user" className={LINK}>
                A Least-privilege App User
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "in-mysql",
      subHeader: { index: "012", title: "In MySQL" },
      title: <SectionTitle>MySQL এ যেখানে নিয়ম বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ তিনটা কমান্ডের নাম আর মূল কাজ একই, কিন্তু কয়েকটা জায়গায় আচরণ এত আলাদা যে PostgreSQL এর অভ্যাস নিয়ে গেলে বিপদ।
                নিচের প্রতিটা কথা আমাদের <code className={CODE}>mysql:8.4</code> Container এ, MySQL 8.4.11 এ, Island Tours এর MySQL
                ফাইল Load করে চালিয়ে দেখা।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে বড় পার্থক্য: MySQL এ TRUNCATE আর DROP TABLE Transaction এর ভেতরে থাকে না। তারা চালানোর আগে চুপচাপ একটা COMMIT
                করে নেয়, যাকে MySQL বলে Implicit Commit। ফলে তাদের পরে ROLLBACK কিছুই ফেরায় না। আরও ভয়ের কথা, সেই COMMIT আগের কাজগুলোকেও
                পাকা করে দেয়: একই Transaction এ আগে চালানো DELETE ও আর ফেরত আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4: Implicit Commit",
          code: `CREATE TABLE drop_bookings AS SELECT booking_id, status, total_bdt FROM bookings;
CREATE TABLE drop_imports (import_id INT AUTO_INCREMENT PRIMARY KEY, note VARCHAR(50) NOT NULL);
INSERT INTO drop_imports (note) VALUES ('a'), ('b');

START TRANSACTION;
DELETE FROM drop_bookings WHERE status = 'cancelled';   -- Query OK, 3 rows affected
TRUNCATE TABLE drop_imports;                            -- এখানে চুপচাপ COMMIT
ROLLBACK;

SELECT (SELECT COUNT(*) FROM drop_bookings) AS bookings,
       (SELECT COUNT(*) FROM drop_imports)  AS imports;
-- +----------+---------+
-- | bookings | imports |
-- +----------+---------+
-- |       21 |       0 |
-- +----------+---------+
-- ROLLBACK এর পরেও DELETE এর ৩টা Row ফেরেনি, imports ও খালি`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Foreign Key এর বেলায় MySQL আরও কড়া। PostgreSQL এর মতো সেও Child খালি থাকলেও Parent কে TRUNCATE করতে দেয় না, কিন্তু
              PostgreSQL যে দুটো পথ দেয়, তার একটাও MySQL এ নেই: TRUNCATE একবারে একটাই Table নেয়, আর CASCADE শব্দটাই চেনে না। DROP TABLE
              এ CASCADE শব্দটা লেখা যায়, কিন্তু সেটা কিছুই করে না, একই Error আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4: Foreign Key, TRUNCATE আর DROP",
          code: `-- drop_departures এর tour_id দেখায় drop_tours কে, drop_departures খালি
TRUNCATE TABLE drop_tours;
-- ERROR 1701 (42000): Cannot truncate a table referenced in a foreign key constraint
--   (\`island_tours\`.\`drop_departures\`, CONSTRAINT \`drop_departures_ibfk_1\`)
TRUNCATE TABLE drop_tours CASCADE;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'CASCADE'
TRUNCATE TABLE drop_departures, drop_tours;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near ', drop_tours'
DROP TABLE drop_tours;
-- ERROR 3730 (HY000): Cannot drop table 'drop_tours' referenced by a foreign key
--   constraint 'drop_departures_ibfk_1' on table 'drop_departures'.
DROP TABLE drop_tours CASCADE;
-- ERROR 3730 (HY000): একই Error, CASCADE কিছুই করেনি
DROP TABLE IF EXISTS drop_nothing_here;
-- Query OK, 0 rows affected, 1 warning
SHOW WARNINGS;
-- | Note | 1051 | Unknown table 'island_tours.drop_nothing_here' |
DROP TABLE drop_departures, drop_tours;
-- Query OK: দুটো একসাথে দিলে চলে`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["TRUNCATE এর পরে ROLLBACK", "সব ফেরত আসে", "কিছুই ফেরে না, আগের DELETE ও না"],
            ["DROP TABLE এর পরে ROLLBACK", "Table, Data, নিয়ম সব ফেরত", "ফেরে না, আগের কাজও পাকা হয়ে যায়"],
            ["TRUNCATE এর পরে নম্বর", "চলতে থাকে, RESTART IDENTITY দিলে 1", "সবসময় 1 থেকে, AUTO_INCREMENT শূন্য হয়"],
            ["একসাথে কয়েকটা Table TRUNCATE", "চলে: TRUNCATE a, b", "চলে না, একবারে একটা"],
            ["TRUNCATE ... CASCADE", "আছে", "নেই, Syntax Error"],
            ["DROP TABLE ... CASCADE", "Child এর Constraint সরিয়ে দেয়", "শব্দটা চলে, কাজ করে না, Error 3730"],
            ["TRUNCATE এ ON DELETE Trigger", "চলে না", "চলে না"],
            ["DELETE ... ORDER BY ... LIMIT", "নেই, Syntax Error", "আছে"],
            ["DROP TABLE IF EXISTS, না থাকলে", "NOTICE", "Warning, Note 1051"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Container এ আরও মিলিয়েছি: DELETE এর পরে নতুন Row পেয়েছে 4, TRUNCATE এর পরে সোজা 1। START TRANSACTION, DELETE, ROLLBACK
                দিলে ৩টা Row ফিরে এসেছে। আর AFTER DELETE Trigger pending মোছায় Log এ ৪টা লাইন লিখেছে, পরের TRUNCATE একটাও না।
              </ContentParagraph>
              <ContentParagraph>
                Foreign Key এর বাধা পার হতে অনেকে <code className={CODE}>SET FOREIGN_KEY_CHECKS = 0</code> লেখেন। এতে পাহারাটাই বন্ধ হয়,
                আর Child এ এমন Row থেকে যেতে পারে যার Parent নেই। সেই পথে যাবেন না: Child আগে, Parent পরে, অথবা DELETE।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "choosing",
      subHeader: { index: "013", title: "Choosing" },
      title: <SectionTitle>কোন কাজে কোনটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা এক ছকে। কোনো কাজ আসলে উপর থেকে নিচে পড়ুন, যেখানে আপনার প্রয়োজন মেলে সেই Column এর কমান্ড।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "DELETE", "TRUNCATE", "DROP TABLE"],
          rows: [
            ["কিছু Row বাছাই করে?", "হ্যাঁ, WHERE দিয়ে", "না", "না"],
            ["Table পরে থাকে?", "হ্যাঁ", "হ্যাঁ", "না"],
            ["কয়টা গেল জানায়?", "হ্যাঁ, RETURNING ও আছে", "না", "না"],
            ["Row Trigger চলে?", "হ্যাঁ, প্রতিটা Row এ", "না, শুধু ON TRUNCATE", "না"],
            ["Foreign Key এ কী করে", "প্রতিটা Row দেখে, ON DELETE মানে", "কেউ দেখালেই না, CASCADE বা একসাথে", "নির্ভরতা থাকলে না, CASCADE এ Constraint সরায়"],
            ["বড় Table এ গতি", "Row এর সংখ্যার সাথে বাড়ে", "প্রায় একই, মুহূর্তে", "মুহূর্তে"],
            ["Disk এর জায়গা", "VACUUM পর্যন্ত আটকে থাকে", "সাথে সাথে ফেরত", "সাথে সাথে ফেরত"],
            ["Lock", "RowExclusiveLock, পড়া চলে", "AccessExclusiveLock, সব থামে", "AccessExclusiveLock"],
            ["PostgreSQL এ ROLLBACK", "চলে", "চলে", "চলে"],
            ["MySQL এ ROLLBACK", "চলে", "চলে না", "চলে না"],
            ["অনুমতি", "DELETE", "TRUNCATE", "মালিক বা Superuser"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Island Tours দলের ছয়টা আসল পরিস্থিতি। প্রতিটায় একটা কমান্ড বেছে নিন, তারপর কারণটা পড়ুন। ভুল হলে ভালোই, ভুলের
              কারণটাই সবচেয়ে বেশি মনে থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DropChooserLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>তানিমের পরিষ্কারের Script</SectionTitle>,
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
                এবার তানিমের তিনটা কাজ একটা Script এ। Staging Database এর ছোট একটা ছবি নিচের বক্সে বানানো: Customer এর একটা Table,
                যেখানে QA দলের দুজন নকল Customer আছেন (<code className={CODE}>is_test</code> true), তাদের Booking এর Table, রাতের
                Import Table, আর একটা পুরনো Report Table যা কেউ আর পড়ে না। তানিম লিখলেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  আগে নকল Customer দের Booking, তারপর নকল Customer। ক্রমটা Foreign Key এর জন্য: Booking গুলো Customer কে দেখায়, তাই
                  Customer আগে মুছতে গেলে Error। দুটোতেই RETURNING, যাতে রসিদ থাকে।
                </ListItem>
                <ListItem>Import Table এ TRUNCATE ... RESTART IDENTITY, আজ রাতের প্রথম Row পাবে 1।</ListItem>
                <ListItem>পুরনো Report এ DROP TABLE IF EXISTS, দুইবার চালালেও Error নেই।</ListItem>
                <ListItem>সবটা একটা BEGIN আর COMMIT এর মাঝে, আর COMMIT এর ঠিক আগে একটা যাচাইয়ের SELECT।</ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Staging পরিষ্কার, এক Transaction এ"
              query={`DROP TABLE IF EXISTS drop_staging_bookings, drop_staging_customers, drop_staging_imports, drop_staging_old_report;
CREATE TABLE drop_staging_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  is_test     boolean NOT NULL DEFAULT false
);
CREATE TABLE drop_staging_bookings (
  booking_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES drop_staging_customers (customer_id),
  total_bdt   numeric(10, 2) NOT NULL
);
CREATE TABLE drop_staging_imports (
  import_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  line      text NOT NULL
);
CREATE TABLE drop_staging_old_report AS
  SELECT status, count(*) AS bookings FROM bookings GROUP BY status;
INSERT INTO drop_staging_customers (full_name, email, is_test) VALUES
  ('Nusrat Jahan',  'nusrat@mail.example', false),
  ('QA Tester One', 'qa1@mail.example',    true),
  ('Arif Hasan',    'arif@mail.example',   false),
  ('QA Tester Two', 'qa2@mail.example',    true);
INSERT INTO drop_staging_bookings (customer_id, total_bdt) VALUES
  (1, 25000), (2, 1), (3, 12500), (2, 1), (4, 1);
INSERT INTO drop_staging_imports (line) VALUES ('row 1'), ('row 2'), ('row 3');

BEGIN;
DELETE FROM drop_staging_bookings
WHERE customer_id IN (SELECT customer_id FROM drop_staging_customers WHERE is_test)
RETURNING booking_id, customer_id, total_bdt;
DELETE FROM drop_staging_customers
WHERE is_test
RETURNING customer_id, full_name;
TRUNCATE drop_staging_imports RESTART IDENTITY;
DROP TABLE IF EXISTS drop_staging_old_report;
SELECT (SELECT count(*) FROM drop_staging_customers) AS customers,
       (SELECT count(*) FROM drop_staging_bookings)  AS bookings,
       (SELECT count(*) FROM drop_staging_imports)   AS imports,
       (SELECT count(*) FROM pg_tables WHERE tablename = 'drop_staging_old_report') AS old_report_tables;
COMMIT;`}
              caption="প্রথম রসিদে তিনটা নকল Booking: 2, 4 আর 5, প্রতিটা 1.00 টাকার, Customer 2 আর 4 এর। দ্বিতীয় রসিদে দুজন নকল Customer: QA Tester One আর QA Tester Two। যাচাইয়ে customers 2, bookings 2, imports 0, old_report_tables 0, সব প্রত্যাশামতো, তাই COMMIT। এই বক্স শুধু নিজের drop_staging Table গুলো ছোঁয়। নিজে বদলে চালানোর সময় মাঝে Error এলে একটা আলাদা ROLLBACK চালিয়ে নেবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা কাজে তার কমান্ড: বাছাই করে যাবে, তাই DELETE ... WHERE; সব যাবে কিন্তু Table থাকবে, তাই TRUNCATE; কাঠামোও লাগবে
              না, তাই DROP। আর পুরোটা এক Transaction এ। এবার আপনার পালা।
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
                  Starter Query তানিমের মতো একটা Staging বানায়, নাম শুরু <code className={CODE}>drop_ch_</code> দিয়ে: পাঁচজন Customer
                  যাদের দুজন নকল (<code className={CODE}>is_test</code> true), সাতটা Booking যার তিনটা নকলদের, চারটা Row এর Import
                  Table, আর একটা পুরনো Report। মন্তব্যের জায়গায় তিনটা কাজ করুন: নকল Customer আর তাদের Booking সরান; Import Table খালি
                  করে নম্বর 1 থেকে শুরু করুন; পুরনো Report Table টা সরান। শেষের INSERT আর যাচাইয়ের Query না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  drop_ch_bookings এর Foreign Key তে কোনো ON DELETE নেই, তাই Booking আগে, Customer পরে। নকলদের Booking ধরতে{" "}
                  <code className={CODE}>WHERE customer_id IN (SELECT customer_id FROM drop_ch_customers WHERE is_test)</code>। এখানে
                  BEGIN লিখবেন না, শুধু কমান্ডগুলো। ঠিক হলে ফলাফল 3, 4, 1, 0।
                </>
              }
              starter={`DROP TABLE IF EXISTS drop_ch_bookings, drop_ch_customers, drop_ch_imports, drop_ch_old_report;
CREATE TABLE drop_ch_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  is_test     boolean NOT NULL DEFAULT false
);
CREATE TABLE drop_ch_bookings (
  booking_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES drop_ch_customers (customer_id),
  total_bdt   numeric(10, 2) NOT NULL
);
CREATE TABLE drop_ch_imports (
  import_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  line      text NOT NULL
);
CREATE TABLE drop_ch_old_report AS
  SELECT status, count(*) AS bookings FROM bookings GROUP BY status;
INSERT INTO drop_ch_customers (full_name, email, is_test) VALUES
  ('Nusrat Jahan',  'nusrat@mail.example', false),
  ('QA Tester One', 'qa1@mail.example',    true),
  ('Arif Hasan',    'arif@mail.example',   false),
  ('QA Tester Two', 'qa2@mail.example',    true),
  ('Mitu Rahman',   'mitu@mail.example',   false);
INSERT INTO drop_ch_bookings (customer_id, total_bdt) VALUES
  (1, 25000), (2, 1), (3, 12500), (2, 1), (4, 1), (5, 18000), (1, 9500);
INSERT INTO drop_ch_imports (line) VALUES ('row 1'), ('row 2'), ('row 3'), ('row 4');

-- এখানে আপনার পরিষ্কারের কমান্ডগুলো, তিনটা কাজ

INSERT INTO drop_ch_imports (line) VALUES ('tonight, row 1');
SELECT (SELECT count(*) FROM drop_ch_customers) AS customers,
       (SELECT count(*) FROM drop_ch_bookings)  AS bookings,
       (SELECT min(import_id) FROM drop_ch_imports) AS first_import_id,
       (SELECT count(*) FROM pg_tables WHERE tablename = 'drop_ch_old_report') AS old_report_tables;`}
              solution={`SELECT *
FROM (VALUES (3, 4, 1, 0)) AS v(customers, bookings, first_import_id, old_report_tables);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>কিছু মোছার আগে ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা ঠিক করুন: কিছু Row, সব Row, নাকি পুরো Table",
              description:
                "কিছু Row হলে DELETE ... WHERE, সব Row কিন্তু Table থাকবে হলে TRUNCATE, Table টাই না লাগলে DROP TABLE। এই এক সিদ্ধান্তেই অর্ধেক কাজ।",
            },
            {
              title: "আগে দেখুন, তারপর মুছুন",
              description:
                "DELETE এর আগে একই WHERE দিয়ে SELECT count(*) আর কয়েকটা Row। TRUNCATE বা DROP এর আগে দেখুন কে এই Table কে দেখায়: psql এ \\d+ table, অথবা pg_constraint এ contype = 'f'।",
            },
            {
              title: "কে খবর রাখে, খুঁজে নিন",
              description:
                "Table এ কি Audit Trigger আছে? তাহলে TRUNCATE সেই খবর এড়িয়ে যাবে। Foreign Key আছে? তাহলে DELETE এর ON DELETE নিয়ম কী, আর TRUNCATE এ কোন Table গুলো একসাথে লাগবে।",
            },
            {
              title: "CASCADE লেখার আগে তালিকা নিজে লিখুন",
              description:
                "TRUNCATE ... CASCADE শিকল ধরে Row মোছে, DROP ... CASCADE Constraint আর View মোছে। সম্ভব হলে CASCADE এর বদলে যে Table গুলো যাবে তাদের নাম নিজে লিখুন, যাতে কোনো চমক না থাকে।",
            },
            {
              title: "BEGIN দিন, চালান, যাচাই করুন",
              description:
                "PostgreSQL এ তিনটা কমান্ডই Transaction এর ভেতরে চলে। BEGIN, কমান্ড, তারপর SELECT দিয়ে সংখ্যা মিলিয়ে দেখুন। MySQL এ মনে রাখুন TRUNCATE আর DROP আগেই COMMIT করে দেয়।",
            },
            {
              title: "ঠিক থাকলে COMMIT, না থাকলে ROLLBACK",
              description:
                "সংখ্যা প্রত্যাশামতো হলে COMMIT। একটু সন্দেহ থাকলেও ROLLBACK, তারপর আবার ভাবুন। COMMIT এর পরে ফেরার পথ শুধু Backup, তাই Production এ বড় মোছার আগে জেনে নিন শেষ Backup কখন হয়েছে।",
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
          headers: ["ভুল", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "DELETE এ WHERE ভুলে যাওয়া",
              "সব Row চলে যায়, কোনো সতর্কবার্তা ছাড়া",
              "আগে একই WHERE দিয়ে SELECT, আর BEGIN এর ভেতরে চালানো",
            ],
            [
              "ভাবা যে Child খালি হলে Parent TRUNCATE হবে",
              "Error 0A000, কারণ TRUNCATE Data না, Foreign Key দেখে",
              "দুটো একসাথে TRUNCATE, অথবা জেনেবুঝে CASCADE",
            ],
            [
              "TRUNCATE ... CASCADE না ভেবে লেখা",
              "শিকলের শেষ পর্যন্ত সব Table খালি, guides থেকে bookings পর্যন্ত",
              "আগে দেখুন কোন Table যাবে, তালিকা নিজে লিখুন",
            ],
            [
              "ভাবা যে DROP ... CASCADE Child Table ও মুছবে",
              "Child থাকে, তার Foreign Key যায়, Row গুলো এতিম হয়ে যায়",
              "Child কে আলাদা করে DROP করুন, অথবা আগে সিদ্ধান্ত নিন তার Data র কী হবে",
            ],
            [
              "Audit করা Table এ TRUNCATE",
              "Row Trigger চলে না, Log এ কোনো দাগ থাকে না",
              "DELETE ব্যবহার, ON TRUNCATE Trigger, বা TRUNCATE এর অনুমতি সরানো",
            ],
            [
              "যে Table এর নম্বর বাইরে যায় সেখানে RESTART IDENTITY",
              "পুরনো Booking #1 আর নতুন Booking #1 আলাদা জিনিস",
              "RESTART IDENTITY শুধু Import বা Test Table এ",
            ],
            [
              "MySQL এ Transaction এর ভেতরে TRUNCATE",
              "চুপচাপ COMMIT, আগের DELETE ও আর ফেরে না",
              "ফেরার দরকার থাকলে DELETE, অথবা TRUNCATE কে Transaction এর বাইরে রাখা",
            ],
            [
              "ব্যস্ত Production Table এ দুপুরবেলা TRUNCATE বা DROP",
              "AccessExclusiveLock, সব SELECT লাইনে দাঁড়ায়",
              "কম ভিড়ের সময়, আর আগে দেখে নেওয়া কোনো লম্বা Query চলছে কিনা",
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
                  <a href="https://www.postgresql.org/docs/current/sql-truncate.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: TRUNCATE
                  </a>
                  : RESTART IDENTITY, CASCADE, ACCESS EXCLUSIVE Lock, ON DELETE Trigger না চলা, আর MVCC-safe না হওয়ার কথা, সব এক পাতায়।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/sql-droptable.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: DROP TABLE
                  </a>
                  : CASCADE View কে পুরো সরায় কিন্তু Foreign Key এর বেলায় শুধু Constraint, এই বাক্যটা এখানেই।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/sql-delete.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: DELETE
                  </a>
                  : WHERE, USING, RETURNING, আর পুরো Table খালি করতে TRUNCATE কেন দ্রুত।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/ddl-depend.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Dependency Tracking
                  </a>
                  : RESTRICT আর CASCADE কীভাবে নির্ভরতা খোঁজে, আর কেন CASCADE এর আগে NOTICE গুলো পড়া উচিত।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/explicit-locking.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Explicit Locking
                  </a>
                  : প্রতিটা Lock এর নাম, কোন কমান্ড কোনটা নেয়, আর কোনটা কার সাথে সংঘাত করে।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/truncate-table.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: TRUNCATE TABLE
                  </a>
                  : কেন MySQL একে DDL ধরে, Implicit Commit, Foreign Key এ ব্যর্থ হওয়া আর AUTO_INCREMENT শূন্য হওয়া।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: Statements That Cause an Implicit Commit
                  </a>
                  : কোন কোন কমান্ড চুপচাপ COMMIT করে, তার পুরো তালিকা। MySQL এ কাজ করলে একবার পড়ে রাখুন।
                </ListItem>
                <ListItem>
                  <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                    আপনার MySQL Course
                  </a>
                  : যে MySQL ভিডিও কোর্সটা আপনি দেখছেন, তার DELETE, TRUNCATE আর DROP অংশ এই লেসনের In MySQL Section এর সাথে মিলিয়ে দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "module-recap",
      subHeader: { index: "018", title: "Module 09 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>তানিমের Staging পরিষ্কার। এই লেসনের মূল কথাগুলো:</ContentParagraph>
              <ContentList>
                <ListItem>DELETE বাছাই করে Row সরায়, প্রতিটা Row এ Foreign Key দেখে আর Trigger চালায়, কয়টা গেল জানায়।</ListItem>
                <ListItem>TRUNCATE সব Row এক ঝটকায় সরায়, Table রাখে, Row Trigger চালায় না, জায়গা সাথে সাথে ফেরত দেয়।</ListItem>
                <ListItem>DROP TABLE কাঠামোসহ সব সরায়: Column, Index, Constraint, Trigger, Sequence।</ListItem>
                <ListItem>Identity থামে না: DELETE বা সাধারণ TRUNCATE এর পরেও পরের নম্বর, RESTART IDENTITY দিলে 1।</ListItem>
                <ListItem>কেউ Foreign Key দিয়ে দেখালে TRUNCATE না বলে, Child খালি হলেও। একসাথে TRUNCATE বা CASCADE।</ListItem>
                <ListItem>TRUNCATE এর CASCADE শিকল ধরে Row মোছে, DROP এর CASCADE শুধু Constraint আর View সরায়।</ListItem>
                <ListItem>PostgreSQL এ তিনটাই ROLLBACK এ ফেরে, MySQL এ TRUNCATE আর DROP চুপচাপ COMMIT করে।</ListItem>
                <ListItem>TRUNCATE আর DROP সবচেয়ে কড়া Lock নেয়, আর তাদের অনুমতি DELETE থেকে আলাদা।</ListItem>
              </ContentList>
              <ContentParagraph>
                আর এই লেসন দিয়ে শেষ হলো পুরো Module 09। ছবিটা একবার এক নজরে দেখে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleNineStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "যে প্রশ্নের উত্তর", "মূল হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/create-database" className={LINK}>
                CREATE and DROP DATABASE
              </Link>,
              "Table রাখার ঘরটা কীভাবে বানাই আর সরাই?",
              "CREATE DATABASE, DROP DATABASE WITH (FORCE)",
            ],
            [
              <Link key="l2" href="/sql/topic/create-table" className={LINK}>
                CREATE TABLE and Naming
              </Link>,
              "একটা Table এর গঠন কেমন, আর নাম কীভাবে দিই?",
              "CREATE TABLE, CREATE TABLE AS, snake_case",
            ],
            [
              <Link key="l3" href="/sql/topic/numeric-types" className={LINK}>
                Number Types: Why Money Is numeric
              </Link>,
              "সংখ্যা আর টাকা কোন Type এ রাখি?",
              "integer, bigint, numeric(p, s)",
            ],
            [
              <Link key="l4" href="/sql/topic/text-types" className={LINK}>
                Text Types, Encoding and Collation
              </Link>,
              "লেখা, বাংলা আর সাজানোর নিয়ম কীভাবে?",
              "text, varchar(n), UTF-8, Collation",
            ],
            [
              <Link key="l5" href="/sql/topic/date-time-types" className={LINK}>
                Date and Time Types
              </Link>,
              "সময় কোন Type এ রাখি যাতে Time Zone এ না ঠকি?",
              "date, timestamptz, interval",
            ],
            [
              <Link key="l6" href="/sql/topic/boolean-uuid-enum" className={LINK}>
                Boolean, UUID and Enum
              </Link>,
              "হ্যাঁ বা না, বিশ্বজুড়ে অনন্য id, আর নির্দিষ্ট তালিকার মান কীভাবে?",
              "boolean, uuid, ENUM বনাম CHECK",
            ],
            [
              <Link key="l7" href="/sql/topic/basic-constraints" className={LINK}>
                NOT NULL, DEFAULT, UNIQUE and CHECK
              </Link>,
              "ভুল Data কে দরজায় কীভাবে আটকাই?",
              "NOT NULL, DEFAULT, UNIQUE, CHECK",
            ],
            [
              <Link key="l8" href="/sql/topic/primary-keys" className={LINK}>
                Primary Keys: Identity, Serial, UUID
              </Link>,
              "প্রতিটা Row কে কীভাবে আলাদা করে চিনি?",
              "PRIMARY KEY, GENERATED ALWAYS AS IDENTITY",
            ],
            [
              <Link key="l9" href="/sql/topic/foreign-keys" className={LINK}>
                Foreign Keys and ON DELETE
              </Link>,
              "Table গুলোর সম্পর্ক কীভাবে পাহারা দিই?",
              "REFERENCES, ON DELETE CASCADE, SET NULL",
            ],
            [
              <Link key="l10" href="/sql/topic/alter-table" className={LINK}>
                ALTER TABLE
              </Link>,
              "চালু Table এর কাঠামো কীভাবে বদলাই?",
              "ADD COLUMN, ALTER COLUMN TYPE, ADD CONSTRAINT",
            ],
            [
              <Link key="l11" href="/sql/topic/drop-truncate-delete" className={LINK}>
                DROP vs TRUNCATE vs DELETE
              </Link>,
              "কিছু Row, সব Row, নাকি পুরো Table সরাব?",
              "DELETE ... WHERE, TRUNCATE, DROP TABLE",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ পরীক্ষা, পুরো মডিউল এক জায়গায়: পার্টনার হোটেলের জন্য <code className={CODE}>drop_hotels</code> আর তার ঘর{" "}
                <code className={CODE}>drop_rooms</code>। এতে মডিউলের প্রতিটা Constraint আছে: Identity সহ PRIMARY KEY, NOT NULL, এক আর
                দুই Column এর UNIQUE, Column এর আর Table এর CHECK, DEFAULT, আর ON DELETE CASCADE সহ FOREIGN KEY। Type ও মডিউল মেনে: টাকা
                numeric, তারা smallint, সক্রিয় কিনা boolean।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Capstone, ধাপ ১: দুটো Table, সব Constraint"
              query={`DROP TABLE IF EXISTS drop_rooms, drop_hotels;
CREATE TABLE drop_hotels (
  hotel_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      text NOT NULL UNIQUE,
  city      text NOT NULL,
  stars     smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE drop_rooms (
  room_id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hotel_id     integer NOT NULL REFERENCES drop_hotels (hotel_id) ON DELETE CASCADE,
  room_no      text NOT NULL,
  beds         smallint NOT NULL DEFAULT 2 CHECK (beds BETWEEN 1 AND 4),
  price_bdt    numeric(10, 2) NOT NULL CHECK (price_bdt > 0),
  discount_bdt numeric(10, 2) NOT NULL DEFAULT 0,
  CONSTRAINT drop_rooms_hotel_room_uq UNIQUE (hotel_id, room_no),
  CONSTRAINT drop_rooms_discount_ck CHECK (discount_bdt >= 0 AND discount_bdt < price_bdt)
);
INSERT INTO drop_hotels (name, city, stars) VALUES
  ('Sea Pearl Resort', 'Cox''s Bazar', 5),
  ('Mangrove Lodge',   'Khulna',       3);
INSERT INTO drop_rooms (hotel_id, room_no, price_bdt) VALUES
  (1, '101', 9500.00),
  (1, '102', 9500.00),
  (2, '1',   4200.00);

SELECT h.name, h.is_active, r.room_no, r.beds, r.price_bdt, r.discount_bdt
FROM drop_hotels h
JOIN drop_rooms r ON r.hotel_id = h.hotel_id
ORDER BY r.room_id;`}
              caption="তিনটা ঘর, দুটো হোটেলে। INSERT এ আমরা is_active, beds বা discount_bdt দিইনি, তবু ফলাফলে is_active t, beds 2, discount_bdt 0.00: তিনটা DEFAULT কাজ করছে। এটাই DEFAULT এর প্রমাণ, ভালো একটা INSERT দিয়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার প্রমাণ: প্রতিটা Constraint কে একটা ভুল INSERT দিয়ে খোঁচা। বক্স প্রথম Error এ থামে, তাই একটা ছোট সাহায্যকারী
              Function, <code className={CODE}>drop_try</code>: সে একটা Statement চালায়, সফল হলে বলে ok, Error হলে তার SQLSTATE আর বার্তা
              ফেরত দেয়। আসল Test Tool গুলোও এভাবে Constraint পরীক্ষা করে। Function লেখা শিখবেন{" "}
              <Link href="/sql/topic/sql-functions" className={LINK}>
                Module 14
              </Link>{" "}
              এ, এখন শুধু ফলাফলটা পড়ুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Capstone, ধাপ ২: প্রতিটা Constraint একটা ভুল INSERT এ"
              query={`${DROP_TRY}

SELECT t.n, t.rule, drop_try(t.stmt) AS result
FROM (VALUES
  (1, 'NOT NULL',     $s$INSERT INTO drop_hotels (name, stars) VALUES ('No City Inn', 3)$s$),
  (2, 'UNIQUE',       $s$INSERT INTO drop_hotels (name, city, stars) VALUES ('Sea Pearl Resort', 'Dhaka', 4)$s$),
  (3, 'CHECK',        $s$INSERT INTO drop_hotels (name, city, stars) VALUES ('Seven Star', 'Dhaka', 7)$s$),
  (4, 'IDENTITY',     $s$INSERT INTO drop_hotels (hotel_id, name, city, stars) VALUES (1, 'Copy Inn', 'Dhaka', 2)$s$),
  (5, 'PRIMARY KEY',  $s$INSERT INTO drop_hotels (hotel_id, name, city, stars) OVERRIDING SYSTEM VALUE VALUES (1, 'Copy Inn', 'Dhaka', 2)$s$),
  (6, 'FOREIGN KEY',  $s$INSERT INTO drop_rooms (hotel_id, room_no, price_bdt) VALUES (99, '1', 3000)$s$),
  (7, 'UNIQUE pair',  $s$INSERT INTO drop_rooms (hotel_id, room_no, price_bdt) VALUES (1, '101', 9000)$s$),
  (8, 'TABLE CHECK',  $s$INSERT INTO drop_rooms (hotel_id, room_no, price_bdt, discount_bdt) VALUES (2, '2', 4200, 5000)$s$)
) AS t(n, rule, stmt)
ORDER BY t.n;
SELECT (SELECT count(*) FROM drop_hotels) AS hotels,
       (SELECT count(*) FROM drop_rooms)  AS rooms;`}
              caption="আটটা চেষ্টা, আটটা Error, প্রতিটা নিজের Constraint এর নামে: 23502 city নেই, 23505 একই নামের হোটেল, 23514 সাত তারা, 428C9 GENERATED ALWAYS Column এ নিজে id, OVERRIDING SYSTEM VALUE দিয়ে জোর করলে 23505 drop_hotels_pkey, 23503 হোটেল 99 নেই, 23505 একই হোটেলে একই ঘর, 23514 দামের চেয়ে বড় ছাড়। শেষে hotels 2, rooms 3: একটা ভুল Row ও ঢোকেনি। আগে ধাপ ১ চালিয়ে নেবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Capstone, ধাপ ৩: ON DELETE CASCADE"
              query={`DELETE FROM drop_hotels WHERE name = 'Sea Pearl Resort';
SELECT (SELECT count(*) FROM drop_hotels) AS hotels,
       (SELECT count(*) FROM drop_rooms)  AS rooms;`}
              caption="DELETE 1, আর hotels 1, rooms 1। Sea Pearl Resort এর সাথে তার দুটো ঘরও চলে গেছে, কারণ Foreign Key এ ON DELETE CASCADE। এই লেসনের ভাষায়: DELETE প্রতিটা Row এর জন্য Foreign Key কে খবর দিয়েছে, আর Foreign Key তার নিয়ম মেনেছে। TRUNCATE হলে এই প্রশ্নই উঠত না, সে আগেই না বলে দিত। ধাপ ১ এর পরে চালান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে বানান। আপনার CREATE TABLE এর পরে Starter ভালো Row ঢোকায়, তারপর নয়টা পরীক্ষা: সাতটা ভুল INSERT যাদের ব্যর্থ হওয়ার
              কথা, DEFAULT এর উপর ভরসা করা একটা INSERT, আর একটা DELETE যা ON DELETE CASCADE ছাড়া আটকে যেত। ফলাফল শুধু SQLSTATE, বা ok।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Module 09 Capstone"
              orderMatters
              task={
                <>
                  মন্তব্যের জায়গায় দুটো CREATE TABLE লিখুন। <code className={CODE}>drop_cap_hotels</code>: hotel_id integer, GENERATED
                  ALWAYS AS IDENTITY, PRIMARY KEY; name text, খালি না, অনন্য; city text, খালি না; stars smallint, খালি না, 1 থেকে 5;
                  is_active boolean, খালি না, Default true। <code className={CODE}>drop_cap_rooms</code>: room_id একই রকম Identity Primary
                  Key; hotel_id integer, খালি না, drop_cap_hotels কে দেখায়, হোটেল মুছলে ঘরও মুছবে; room_no text, খালি না; beds smallint,
                  খালি না, Default 2, 1 থেকে 4; price_bdt numeric(10, 2), খালি না, শূন্যের বেশি; discount_bdt numeric(10, 2), খালি না,
                  Default 0; একই হোটেলে একই room_no দুইবার না; আর discount_bdt শূন্য বা বেশি কিন্তু price_bdt এর কম। বাকি Starter না বদলে
                  রাখুন।
                </>
              }
              hint={
                <>
                  উপরের Capstone এর ধাপ ১ প্রায় হুবহু এই উত্তর, শুধু নাম আলাদা: drop_hotels এর জায়গায় drop_cap_hotels, drop_rooms এর
                  জায়গায় drop_cap_rooms। দুই Column এর UNIQUE আর দুই Column এর CHECK Table এর শেষে লিখুন। ON DELETE CASCADE বাদ দিলে
                  শেষ পরীক্ষায় 23503 আসবে, BY DEFAULT Identity দিলে চতুর্থটায় অন্য Code।
                </>
              }
              starter={`${DROP_TRY}
DROP TABLE IF EXISTS drop_cap_rooms, drop_cap_hotels;

-- এখানে আপনার দুটো CREATE TABLE: আগে drop_cap_hotels, তারপর drop_cap_rooms

INSERT INTO drop_cap_hotels (name, city, stars) VALUES
  ('Sea Pearl Resort', 'Cox''s Bazar', 5),
  ('Mangrove Lodge', 'Khulna', 3);
INSERT INTO drop_cap_rooms (hotel_id, room_no, price_bdt) VALUES
  (1, '101', 9500), (1, '102', 9500), (2, '1', 4200);

SELECT t.n, t.rule, split_part(drop_try(t.stmt), ':', 1) AS result
FROM (VALUES
  (1, 'NOT NULL',    $s$INSERT INTO drop_cap_hotels (name, stars) VALUES ('No City Inn', 3)$s$),
  (2, 'UNIQUE',      $s$INSERT INTO drop_cap_hotels (name, city, stars) VALUES ('Sea Pearl Resort', 'Dhaka', 4)$s$),
  (3, 'CHECK',       $s$INSERT INTO drop_cap_hotels (name, city, stars) VALUES ('Seven Star', 'Dhaka', 7)$s$),
  (4, 'IDENTITY',    $s$INSERT INTO drop_cap_hotels (hotel_id, name, city, stars) VALUES (9, 'Copy Inn', 'Dhaka', 2)$s$),
  (5, 'FOREIGN KEY', $s$INSERT INTO drop_cap_rooms (hotel_id, room_no, price_bdt) VALUES (99, '1', 3000)$s$),
  (6, 'UNIQUE pair', $s$INSERT INTO drop_cap_rooms (hotel_id, room_no, price_bdt) VALUES (1, '101', 9000)$s$),
  (7, 'TABLE CHECK', $s$INSERT INTO drop_cap_rooms (hotel_id, room_no, price_bdt, discount_bdt) VALUES (2, '2', 4200, 5000)$s$),
  (8, 'DEFAULT',     $s$INSERT INTO drop_cap_rooms (hotel_id, room_no, price_bdt) VALUES (1, '103', 9500)$s$),
  (9, 'ON DELETE',   $s$DELETE FROM drop_cap_hotels WHERE hotel_id = 2$s$)
) AS t(n, rule, stmt)
ORDER BY t.n;`}
              solution={`SELECT *
FROM (VALUES (1, 'NOT NULL',    '23502'),
             (2, 'UNIQUE',      '23505'),
             (3, 'CHECK',       '23514'),
             (4, 'IDENTITY',    '428C9'),
             (5, 'FOREIGN KEY', '23503'),
             (6, 'UNIQUE pair', '23505'),
             (7, 'TABLE CHECK', '23514'),
             (8, 'DEFAULT',     'ok'),
             (9, 'ON DELETE',   'ok')) AS v(n, rule, result);`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজেকে যাচাই করুন। প্রতিটা প্রশ্নের উত্তর কাউকে মুখে বুঝিয়ে বলতে পারলে মডিউলটা আপনার হয়ে গেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>CREATE DATABASE আসলে কোন Database কে নকল করে, আর একটা App এর জন্য কয়টা Database রাখা ভালো?</ListItem>
                <ListItem>টাকার Column কেন কখনো real বা double precision না, আর numeric(10, 2) তে 10 আর 2 এর মানে কী?</ListItem>
                <ListItem>একটা Booking এর সময় কেন timestamptz এ রাখবেন, timestamp এ না?</ListItem>
                <ListItem>UNIQUE Column এ দুটো NULL কেন একসাথে ঢুকতে পারে, আর কীভাবে আটকাবেন?</ListItem>
                <ListItem>GENERATED ALWAYS আর GENERATED BY DEFAULT এর পার্থক্য কোন INSERT এ ধরা পড়ে?</ListItem>
                <ListItem>ON DELETE CASCADE, SET NULL আর Default নিয়ম, প্রতিটার একটা Island Tours উদাহরণ দিন।</ListItem>
                <ListItem>DROP ... CASCADE আর TRUNCATE ... CASCADE, একই শব্দের দুই মানে, এক লাইনে বলুন।</ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউলে আপনি প্রথমবার Database এর মালিকের চেয়ারে বসেছেন: ফাঁকা Server থেকে এমন Table, যা নিজের নিয়ম নিজে পাহারা দেয়।
                কিন্তু Table বানানো গল্পের অর্ধেক। আসল জীবনে Data প্রতিদিন আসে, বদলায় আর যায়: নতুন Booking, দামের পরিবর্তন, একই Customer
                দুইবার, হাজার Row এর CSV। পরের মডিউলে সেই কাজ, INSERT থেকে Upsert আর Bulk Loading পর্যন্ত, আর DELETE আরও গভীরে। চলুন{" "}
                <Link href="/sql/topic/changing-data-overview" className={LINK}>
                  Module 10, Changing Data
                </Link>{" "}
                এ।
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
      ["DELETE", "WHERE মেলা Row একটা একটা করে সরায়, কয়টা গেল জানায়", "cancelled তিনটা: DELETE 3, বাকি ২১"],
      ["RETURNING", "মুছে ফেলা Row গুলো ফলাফল হিসেবে ফেরত দেয়", "Booking 5, 12, 18 এর রসিদ"],
      ["TRUNCATE", "সব Row এক ঝটকায়, Table থাকে, কোনো সংখ্যা না", "২৪ থেকে ০, চারটা Column অক্ষত"],
      ["RESTART IDENTITY", "Identity এর গুনতি আবার 1 থেকে", "DELETE এর পরে 4, TRUNCATE এর পরে 5, RESTART এর পরে 1"],
      ["TRUNCATE আর Foreign Key", "কেউ দেখালেই না, Child খালি হলেও, Error 0A000", "drop_departures খালি, তবু drop_tours আটকায়"],
      ["TRUNCATE ... CASCADE", "Foreign Key এর শিকল ধরে সব Table খালি", "customers থেকে bookings, payments, reviews"],
      ["DELETE আর Trigger", "প্রতিটা Row এ Row Level Trigger চলে", "Log এ তিনটা DELETE লাইন"],
      ["TRUNCATE আর Trigger", "ON DELETE Trigger চলে না, শুধু ON TRUNCATE", "২১টা Row গেল, Log এ একটা TRUNCATE লাইন"],
      ["DROP TABLE", "কাঠামো, Index, Constraint, Trigger, Sequence সব যায়", "নির্ভরতা থাকলে Error 2BP01"],
      ["DROP ... CASCADE", "View পুরো যায়, Child এর শুধু Foreign Key", "bookings গেলে payments এর ১৯টা Row থাকে"],
      ["IF EXISTS", "না থাকলে Error এর বদলে NOTICE", "island-tours.sql এর প্রথম লাইন"],
      ["ROLLBACK", "PostgreSQL এ তিনটাই Transaction এর ভেতরে", "DELETE, TRUNCATE, DROP এর পরে payments 19, reviews 10"],
      ["জায়গা আর গতি", "DELETE জায়গা ধরে রাখে, TRUNCATE নতুন ফাইল দেয়", "২ লাখ Row: 14 MB বনাম 0 bytes"],
      ["Lock", "DELETE RowExclusiveLock, TRUNCATE AccessExclusiveLock", "TRUNCATE এর সময় SELECT ও অপেক্ষা করে"],
      ["MySQL", "TRUNCATE আর DROP চুপচাপ COMMIT করে, CASCADE নেই", "ROLLBACK এর পরে bookings 21, imports 0"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "তানিমকে শুধু QA দলের নকল Booking সরাতে হবে, আসল Booking থাকবে। কোন কমান্ড?",
        options: [
          { key: "A", text: "TRUNCATE bookings", isCorrect: false, explanation: "TRUNCATE এর WHERE নেই, আসল Booking সহ সব যায়।" },
          {
            key: "B",
            text: "DELETE FROM bookings WHERE ... (নকলদের শর্ত দিয়ে)",
            isCorrect: true,
            explanation: "ঠিক। কিছু Row যাবে, কিছু থাকবে, তাই WHERE, আর WHERE শুধু DELETE এর। আগে একই WHERE দিয়ে SELECT চালিয়ে নিন।",
          },
          { key: "C", text: "DROP TABLE bookings", isCorrect: false, explanation: "DROP কাঠামোসহ পুরো Table সরায়।" },
          {
            key: "D",
            text: "TRUNCATE bookings RESTART IDENTITY",
            isCorrect: false,
            explanation: "RESTART IDENTITY শুধু নম্বর আবার শুরু করে, TRUNCATE তবু সব Row সরায়।",
          },
        ],
      },
      {
        id: 2,
        text: "Identity Column এর Table এ ৩টা Row ছিল। DELETE FROM দিয়ে সব মুছে নতুন Row দিলে সে কোন নম্বর পাবে?",
        options: [
          { key: "A", text: "1, কারণ Table খালি", isCorrect: false, explanation: "Sequence থামে না। 1 পেতে TRUNCATE ... RESTART IDENTITY লাগে।" },
          { key: "B", text: "3, শেষ নম্বরটা আবার", isCorrect: false, explanation: "Sequence কোনো নম্বর দুইবার দেয় না।" },
          {
            key: "C",
            text: "4",
            isCorrect: true,
            explanation: "ঠিক। DELETE Sequence এ হাত দেয় না। বক্সেও after DELETE পেয়েছিল 4, আর সাধারণ TRUNCATE এর পরে 5।",
          },
          { key: "D", text: "NULL, কারণ Sequence মুছে গেছে", isCorrect: false, explanation: "Sequence যায় শুধু DROP TABLE এ।" },
        ],
      },
      {
        id: 3,
        text: "drop_departures এর Foreign Key drop_tours কে দেখায়, কিন্তু drop_departures এ কোনো Row নেই। TRUNCATE drop_tours চালালে?",
        options: [
          { key: "A", text: "চলে যায়, কোনো Departure তো নেই", isCorrect: false, explanation: "TRUNCATE Data দেখে না, শুধু Foreign Key আছে কিনা দেখে।" },
          {
            key: "B",
            text: "Error 0A000: cannot truncate a table referenced in a foreign key constraint",
            isCorrect: true,
            explanation: "ঠিক। Child খালি হলেও না। পথ দুটো: দুটো Table একই TRUNCATE এ, অথবা CASCADE।",
          },
          {
            key: "C",
            text: "drop_tours খালি হয়, Child এর Foreign Key সরে যায়",
            isCorrect: false,
            explanation: "Constraint সরানো DROP ... CASCADE এর আচরণ, TRUNCATE এর না।",
          },
          { key: "D", text: "দুটো Table ই খালি হয়", isCorrect: false, explanation: "সেটা হয় দুটোর নাম দিলে বা CASCADE দিলে।" },
        ],
      },
      {
        id: 4,
        text: "DROP TABLE drop_tours CASCADE চালানো হলো। drop_departures তাকে Foreign Key দিয়ে দেখায়, আর তার উপর drop_tour_list View আছে। ফলাফল?",
        options: [
          { key: "A", text: "তিনটাই মুছে যায়", isCorrect: false, explanation: "Foreign Key এর বেলায় CASCADE শুধু Constraint সরায়, Table না।" },
          {
            key: "B",
            text: "শুধু drop_tours যায়, View আর Foreign Key অক্ষত",
            isCorrect: false,
            explanation: "মুছে যাওয়া Table এর উপর নির্ভর করা View আর Constraint টিকতে পারে না।",
          },
          {
            key: "C",
            text: "drop_tours আর View যায়; drop_departures তার Row সহ থাকে, শুধু Foreign Key যায়",
            isCorrect: true,
            explanation: "ঠিক। বক্সে টিকে ছিল শুধু drop_departures, তিনটা Row সহ, foreign_keys_left 0।",
          },
          { key: "D", text: "Error, কারণ View থাকলে DROP চলে না", isCorrect: false, explanation: "Error 2BP01 আসে CASCADE ছাড়া চালালে।" },
        ],
      },
      {
        id: 5,
        text: "Island Tours এ BEGIN এর পরে TRUNCATE customers CASCADE চালালে কোন Table গুলো খালি হয়?",
        options: [
          { key: "A", text: "শুধু customers", isCorrect: false, explanation: "customers কে দেখায় bookings, সেও খালি হয়।" },
          { key: "B", text: "customers আর bookings", isCorrect: false, explanation: "bookings কে দেখায় payments আর reviews, তারাও যায়।" },
          {
            key: "C",
            text: "customers, bookings, payments আর reviews; departures সহ বাকিরা অক্ষত",
            isCorrect: true,
            explanation: "ঠিক। CASCADE শুধু তাদের দিকে যায় যারা খালি হওয়া Table কে দেখায়। departures এর ১৬টা Row থাকে।",
          },
          { key: "D", text: "আটটা Table ই", isCorrect: false, explanation: "destinations, guides, tours, departures অক্ষত: 7, 5, 9, 16।" },
        ],
      },
      {
        id: 6,
        text: "Table এ AFTER DELETE ... FOR EACH ROW Trigger আছে। DELETE তিনটা Row সরাল, তারপর TRUNCATE বাকি ২১টা। Row Trigger মোট কতবার চলেছে?",
        options: [
          { key: "A", text: "২৪ বার", isCorrect: false, explanation: "TRUNCATE কোনো ON DELETE Trigger চালায় না।" },
          {
            key: "B",
            text: "৩ বার",
            isCorrect: true,
            explanation: "ঠিক। শুধু DELETE এর তিনটা Row এ। TRUNCATE ধরতে আলাদা AFTER TRUNCATE ... FOR EACH STATEMENT Trigger লাগে।",
          },
          { key: "C", text: "১ বার", isCorrect: false, explanation: "Row Trigger প্রতিটা মোছা Row এ একবার চলে।" },
          { key: "D", text: "২১ বার", isCorrect: false, explanation: "উল্টো: TRUNCATE এর ২১টায় একবারও না।" },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ: START TRANSACTION; ৩টা Row এর DELETE; অন্য Table এ TRUNCATE TABLE; ROLLBACK। কী ফেরত আসে?",
        options: [
          { key: "A", text: "সব, ROLLBACK পুরো Transaction বাতিল করে", isCorrect: false, explanation: "PostgreSQL এ তাই হতো। MySQL এ TRUNCATE আগে Implicit Commit করে।" },
          { key: "B", text: "শুধু TRUNCATE করা Row গুলো", isCorrect: false, explanation: "TRUNCATE ই ফেরানো যায় না।" },
          { key: "C", text: "শুধু DELETE এর ৩টা Row", isCorrect: false, explanation: "Implicit Commit আগের DELETE কেও পাকা করেছে।" },
          {
            key: "D",
            text: "কিছুই না; DELETE ও পাকা, TRUNCATE ও",
            isCorrect: true,
            explanation: "ঠিক। আমাদের Container এ ফলাফল bookings 21, imports 0।",
          },
        ],
      },
      {
        id: 8,
        text: "২ লাখ Row এর Table এ DELETE FROM এর ঠিক পরে Disk এ তার আকার কেমন, আর TRUNCATE এর পরে?",
        options: [
          { key: "A", text: "দুই ক্ষেত্রেই সাথে সাথে 0 bytes", isCorrect: false, explanation: "DELETE এর মৃত Row VACUUM পর্যন্ত জায়গা ধরে রাখে।" },
          {
            key: "B",
            text: "DELETE এর পরে আগের মতো 14 MB, TRUNCATE এর পরে 0 bytes আর নতুন ফাইল নম্বর",
            isCorrect: true,
            explanation: "ঠিক। DELETE Row কে মৃত চিহ্ন দেয়, TRUNCATE নতুন ফাঁকা ফাইল দেয়, তাই pg_relation_filenode বদলায়।",
          },
          { key: "C", text: "DELETE এর পরে 0 bytes, TRUNCATE এর পরে 14 MB", isCorrect: false, explanation: "উল্টো।" },
          { key: "D", text: "দুই ক্ষেত্রেই 14 MB, VACUUM পর্যন্ত", isCorrect: false, explanation: "TRUNCATE এর পরে VACUUM লাগেই না।" },
        ],
      },
    ],
  },
  assignment: {
    title: "নিজের হাতে তিন মাত্রার মুছে ফেলা",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিন কমান্ডের খাতা:</strong> <code className={CODE}>CREATE TABLE drop_pay AS SELECT * FROM payments</code> দিয়ে
        payments এর নকল বানান। তারপর failed Payment গুলো DELETE করুন RETURNING সহ, তারপর TRUNCATE, তারপর DROP TABLE। প্রতিটার পরে
        Row সংখ্যা আর কমান্ডের উত্তর (DELETE n, TRUNCATE TABLE, DROP TABLE) একটা ছকে লিখুন।
      </span>,
      <span key="2">
        <strong>নম্বরের পরীক্ষা:</strong> একটা Identity Column এর Table এ তিনটা Row দিন। তারপর এই ক্রমে চালান: DELETE, INSERT;
        TRUNCATE, INSERT; TRUNCATE RESTART IDENTITY, INSERT; শেষে BEGIN, TRUNCATE RESTART IDENTITY, ROLLBACK, INSERT। প্রতিটা নতুন Row
        এর নম্বর লিখুন, আর শেষেরটা কেন 1 না, এক লাইনে ব্যাখ্যা করুন।
      </span>,
      <span key="3">
        <strong>CASCADE এর মানচিত্র:</strong> নিজের island_tours এ আটটা Table এর প্রতিটার জন্য BEGIN, TRUNCATE ... CASCADE, আটটা
        Table এর count, ROLLBACK চালান। কোন Table খালি করলে কোনগুলো খালি হয়, একটা ছকে লিখুন, তারপর এই লেসনের Cascade Lab এর সাথে
        মেলান। কোন Table সবচেয়ে বেশি Table টেনে নেয়, আর কেন?
      </span>,
      <span key="4">
        <strong>গতির মাপ:</strong> psql এ <code className={CODE}>\timing on</code> দিয়ে ১ লাখ, ১০ লাখ আর ২০ লাখ Row এর Table এ DELETE আর
        TRUNCATE এর সময় মাপুন, প্রতিবার আবার ভরে। একটা ছোট ছক বানান, আর লিখুন কোনটার সময় Row এর সাথে বাড়ে আর কোনটার প্রায় একই থাকে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> হোটেলের রেজিস্টার খাতার উদাহরণ দিয়ে DELETE, TRUNCATE আর DROP এর পার্থক্য, আর MySQL এ
        TRUNCATE এর পরে ROLLBACK কেন কিছু ফেরায় না, ছয় লাইনে।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিন কমান্ডের ছক, প্রতিটার উত্তর আর Row সংখ্যা সহ</span>,
      <span key="d2">নম্বরের পরীক্ষার চারটা নম্বর আর ROLLBACK এর ব্যাখ্যা</span>,
      <span key="d3">আট Table এর CASCADE মানচিত্র আর Lab এর সাথে মিলিয়ে দেখার নোট</span>,
      <span key="d4">DELETE বনাম TRUNCATE এর সময়ের ছক</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ DROP, TRUNCATE আর DELETE",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "DELETE আর RETURNING",
        description:
          "bookings এর নকলে pending মোছা: count 4, RETURNING সেই ৪টা Row, শেষে ২০টা বাকি। আসল bookings এ তখনো ২৪।",
      },
      {
        title: "নম্বর কোথা থেকে",
        description:
          "দ্বিতীয় ফাইলে চারটা INSERT ... RETURNING import_id। প্রত্যাশিত নম্বর 4, 5, 1, 2। শেষেরটা 2, কারণ ROLLBACK RESTART IDENTITY কেও ফিরিয়ে দিয়েছে।",
      },
      {
        title: "CASCADE এর দুই মানে",
        description:
          "দুটো Transaction, দুটোই ROLLBACK, তারপর ইচ্ছা করে দুটো Error। NOTICE এ TRUNCATE এর তিনটা Table আর DROP এর দুটো Constraint পড়ুন।",
      },
      {
        title: "গতি আর জায়গা",
        description:
          "দশ লাখ Row। সময় আপনার মেশিনে আলাদা হবে, কিন্তু DELETE এর পরে আকার একই, TRUNCATE এর পরে প্রায় শূন্য। দুই সময়ের অনুপাত লিখে রাখুন।",
      },
      {
        title: "সব ফেরত",
        description:
          "পঞ্চম ফাইলে এক Transaction এ DELETE, TRUNCATE আর DROP TABLE, তারপর ROLLBACK। শেষের SELECT এ payments 19 আর reviews 10, কিছুই হারায়নি।",
      },
      {
        title: "নিজের পরে গোছানো",
        description:
          "ড্রিলের তিনটা Table একসাথে সরানো, আর যাচাই যে drop_ দিয়ে শুরু কোনো Table নেই। তানিমের তৃতীয় কাজ, আপনার Database এ।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-delete-returning.sql",
        code: `DROP TABLE IF EXISTS drop_bookings;
CREATE TABLE drop_bookings AS
  SELECT booking_id, customer_id, status, total_bdt FROM bookings;
-- SELECT 24

SELECT count(*) AS pending FROM drop_bookings WHERE status = 'pending';
-- (1 row) 4

DELETE FROM drop_bookings
WHERE status = 'pending'
RETURNING booking_id, total_bdt;
-- (4 rows) 14 | 50000.00, 17 | 36000.00, 20 | 15600.00, 24 | 15600.00
-- DELETE 4

SELECT count(*) AS rows_left FROM drop_bookings;
-- (1 row) 20`,
      },
      {
        language: "sql",
        filename: "02-identity.sql",
        code: `DROP TABLE IF EXISTS drop_imports;
CREATE TABLE drop_imports (
  import_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note      text NOT NULL
);
INSERT INTO drop_imports (note) VALUES ('a'), ('b'), ('c');

DELETE FROM drop_imports;
INSERT INTO drop_imports (note) VALUES ('after DELETE') RETURNING import_id;
-- (1 row) 4

TRUNCATE drop_imports;
INSERT INTO drop_imports (note) VALUES ('after TRUNCATE') RETURNING import_id;
-- (1 row) 5

TRUNCATE drop_imports RESTART IDENTITY;
INSERT INTO drop_imports (note) VALUES ('after RESTART') RETURNING import_id;
-- (1 row) 1

BEGIN;
TRUNCATE drop_imports RESTART IDENTITY;
ROLLBACK;
INSERT INTO drop_imports (note) VALUES ('after ROLLBACK') RETURNING import_id;
-- (1 row) 2`,
      },
      {
        language: "sql",
        filename: "03-cascade.sql",
        code: `BEGIN;
TRUNCATE customers CASCADE;
-- NOTICE:  truncate cascades to table "bookings"
-- NOTICE:  truncate cascades to table "payments"
-- NOTICE:  truncate cascades to table "reviews"
SELECT count(*) AS bookings FROM bookings;
-- (1 row) 0
ROLLBACK;

BEGIN;
DROP TABLE bookings CASCADE;
-- NOTICE:  drop cascades to 2 other objects
-- DETAIL:  drop cascades to constraint payments_booking_id_fkey on table payments
-- drop cascades to constraint reviews_booking_id_fkey on table reviews
SELECT count(*) AS payments FROM payments;
-- (1 row) 19
ROLLBACK;

TRUNCATE bookings;
-- ERROR:  cannot truncate a table referenced in a foreign key constraint
-- DETAIL:  Table "payments" references "bookings".
DROP TABLE bookings;
-- ERROR:  cannot drop table bookings because other objects depend on it`,
      },
      {
        language: "sql",
        filename: "04-speed-and-space.sql",
        code: `\\timing on
DROP TABLE IF EXISTS drop_big;
CREATE TABLE drop_big (id integer PRIMARY KEY, note text NOT NULL);
INSERT INTO drop_big SELECT g, md5(g::text) FROM generate_series(1, 1000000) AS g;
-- INSERT 0 1000000
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- (1 row) 87 MB

DELETE FROM drop_big;
-- DELETE 1000000, আমাদের Container এ 410.860 ms
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- (1 row) 87 MB

INSERT INTO drop_big SELECT g, md5(g::text) FROM generate_series(1, 1000000) AS g;
TRUNCATE drop_big;
-- TRUNCATE TABLE, আমাদের Container এ 32.935 ms
SELECT pg_size_pretty(pg_total_relation_size('drop_big')) AS on_disk;
-- (1 row) 16 kB`,
      },
      {
        language: "sql",
        filename: "05-undo.sql",
        code: `BEGIN;
DELETE FROM reviews WHERE rating <= 3;
-- DELETE 2
TRUNCATE payments;
DROP TABLE reviews;
SELECT count(*) AS payments FROM payments;
-- (1 row) 0
ROLLBACK;

SELECT (SELECT count(*) FROM payments) AS payments,
       (SELECT count(*) FROM reviews)  AS reviews;
-- (1 row) 19 | 10`,
      },
      {
        language: "sql",
        filename: "06-clean-up.sql",
        code: `DROP TABLE IF EXISTS drop_bookings, drop_imports, drop_big;
-- DROP TABLE

SELECT count(*) AS drop_tables_left
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'drop\\_%';
-- (1 row) 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        নিজের Database এ যেকোনো DELETE, TRUNCATE বা DROP চালানোর আগে psql এ <code className={CODE}>\set ON_ERROR_STOP on</code> আর একটা
        BEGIN দিয়ে শুরু করার অভ্যাস করুন। ফলাফল দেখে সন্তুষ্ট হলে COMMIT, না হলে ROLLBACK। PostgreSQL আপনাকে এই দ্বিতীয় সুযোগটা দেয়,
        MySQL সবসময় দেয় না, আর COMMIT এর পরে কেউই দেয় না।
      </ContentParagraph>
    ),
  },
};
