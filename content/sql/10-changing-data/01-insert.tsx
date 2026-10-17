import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { ColumnMappingLab, InsertOutcomeLab } from "../../../components/course/topics/dml/ins-animations";
import {
  BookingChainDiagram,
  BurnedNumbersDiagram,
  ColumnListSplit,
  InsertAnatomyDiagram,
  MaxIdRaceDiagram,
} from "../../../components/course/topics/dml/ins-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * The practice customers table most boxes rebuild first, so each box runs on
 * its own, gives the same numbers every time, and never touches the sample
 * customers table.
 */
const CUSTOMERS_SETUP = `DROP TABLE IF EXISTS ins_customers;
CREATE TABLE ins_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,
  city        text NOT NULL,
  country     text NOT NULL DEFAULT 'Bangladesh',
  joined_at   timestamptz NOT NULL DEFAULT now()
);`;

/** A sign-up log where every column but email has a default. */
const SIGNUPS_SETUP = `DROP TABLE IF EXISTS ins_signups;
CREATE TABLE ins_signups (
  signup_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  source     text NOT NULL DEFAULT 'website',
  newsletter boolean NOT NULL DEFAULT false,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);`;

/** The call list the sales desk fills from pending bookings. */
const FOLLOWUPS_SETUP = `DROP TABLE IF EXISTS ins_followups;
CREATE TABLE ins_followups (
  followup_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id  integer NOT NULL UNIQUE,
  customer    text NOT NULL,
  phone       text,
  total_bdt   numeric(10, 2) NOT NULL,
  call_on     date NOT NULL DEFAULT DATE '2026-11-02'
);`;

/** A booking table with every kind of rule, pointing at the real customers and departures. */
const BOOKINGS_SETUP = `DROP TABLE IF EXISTS ins_bookings;
CREATE TABLE ins_bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL REFERENCES customers (customer_id),
  departure_id integer NOT NULL REFERENCES departures (departure_id),
  seats        smallint NOT NULL CHECK (seats > 0),
  status       text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_bdt    numeric(10, 2) NOT NULL,
  booked_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (customer_id, departure_id)
);`;

/** Runs one statement and reports "ok" or its SQLSTATE and message, so one query can show many outcomes. */
const TRY_FUNCTION = `CREATE OR REPLACE FUNCTION ins_try(stmt text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'ok';
EXCEPTION WHEN others THEN
  RETURN SQLSTATE || ': ' || SQLERRM;
END;
$$;`;

/** Three staff rows that already used identity numbers 1 to 3. */
const STAFF_SETUP = `DROP TABLE IF EXISTS ins_staff;
CREATE TABLE ins_staff (
  staff_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  role      text NOT NULL
);
INSERT INTO ins_staff (full_name, role)
VALUES ('Sharmin Sultana', 'sales'), ('Kamrul Hasan', 'accounts'), ('Selina Parvin', 'support');`;

export const insertContent: TopicData = {
  id: "insert",
  introduction: {
    badge: "MODULE 10 · LESSON 01",
    title: <SectionTitle>INSERT আর RETURNING: নতুন Row লেখা, নতুন নম্বর ফেরত পাওয়া</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন আপনি Data পড়েছেন, তারপর Module 09 এ নিজের Table বানিয়েছেন। কিন্তু সেই Table গুলোতে Row এসেছে প্রায় সবসময় তৈরি
          Script থেকে। এই লেসন থেকে আপনি নিজে Row লিখবেন, ঠিক যেভাবে একটা Website প্রতিটা নতুন Customer, প্রতিটা Booking আর প্রতিটা
          Payment লেখে।
        </ContentParagraph>
        <ContentParagraph>
          INSERT দেখতে সবচেয়ে সহজ SQL কমান্ড: Table এর নাম, কয়েকটা মান, শেষ। অথচ বাস্তবের অনেক চুপচাপ ভুল এখানেই জন্মায়। Column
          এর তালিকা না লিখলে মান ভুল ঘরে বসে আর কেউ টের পায় না। নতুন নম্বর জানতে SELECT max(id) চালালে দুজন একসাথে Booking করলে
          একজন আরেকজনের নম্বর পায়। Booking লেখা হলো কিন্তু Payment এর আগে কোড থেমে গেল, তখন টাকা ছাড়া একটা Booking পড়ে থাকে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন একটা INSERT এর প্রতিটা অংশ কী করে, Column এর তালিকা কেন সবসময় লিখবেন, এক Statement এ অনেক Row,
          DEFAULT আর DEFAULT VALUES, অন্য Query থেকে INSERT ... SELECT, RETURNING দিয়ে নতুন নম্বর সাথে সাথে ফেরত পাওয়া, প্রতিটা
          Constraint একটা INSERT কে কী বলে, Identity Column এ নিজে নম্বর দেওয়ার নিয়ম, মানগুলো কীভাবে লিখবেন, Booking আর তার Payment
          একসাথে লেখা, App এর কোড থেকে নিরাপদে INSERT, আর MySQL এ কোথায় নিয়ম আলাদা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি শুধু একটা নতুন লাইন লিখি। কিন্তু কোন ঘরে কী বসবে, কে নম্বর দেবে, আর লেখা শেষে আপনি রসিদ পাবেন কিনা, সেটা ঠিক হয় আপনি আমাকে কতটা পরিষ্কার করে বলেন তার উপর।",
      author: "INSERT",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Website এর Booking Form চালু হচ্ছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। সাপ্তাহিক বৈঠকে ফারুক সাহেব খবরটা দিলেন: আগামী সপ্তাহে Island Tours এর Website এ Booking
                Form চালু হবে। এতদিন Customer ফোন করতেন, অফিসের কেউ খাতায় লিখতেন, পরে কেউ একজন সেটা Database এ তুলতেন। এখন থেকে
                Customer নিজেই Form পূরণ করবেন, bKash এ টাকা দেবেন, আর সাথে সাথে স্ক্রিনে দেখবেন: আপনার Booking নম্বর 25।
              </ContentParagraph>
              <ContentParagraph>
                কোড লেখার দায়িত্ব তানিমের। ফারুক সাহেব তিনটা প্রশ্ন রাখলেন, আর এই লেসন সেই তিন প্রশ্নের উত্তর:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>নতুন Customer এর তথ্য Database এ ঠিক ঠিক ঘরে বসবে তো?</strong> নাম যেন ফোনের ঘরে না যায়, আর যে তথ্য
                  Customer দেননি, যেমন ফোন নম্বর, সেটা যেন ফাঁকা থাকে, বানানো কিছু না।
                </ListItem>
                <ListItem>
                  <strong>Booking আর Payment দুটোই লেখা হবে, নাকি একটাও না?</strong> টাকা নেওয়া হলো কিন্তু Booking নেই, বা Booking আছে
                  কিন্তু টাকার কোনো হিসাব নেই, এমন অর্ধেক কাজ কোনোভাবেই চলবে না।
                </ListItem>
                <ListItem>
                  <strong>লেখার পরে Website কীভাবে জানবে নতুন Booking এর নম্বর কত?</strong> একই সময়ে দশজন Booking করলেও প্রত্যেকে যেন
                  নিজের নম্বরটাই দেখেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা হোটেলের অতিথি খাতার কথা ভাবুন। খাতার প্রতিটা পাতার উপরে ঘরের নাম ছাপা: ক্রমিক নম্বর, নাম, ফোন, শহর, দেশ, আসার
                সময়। নতুন অতিথি এলে খাতায় একটা নতুন লাইন লেখা হয়। একজন যত্নশীল কেরানি নামের ঘরে নামই লেখেন, কোন ঘরে কী লিখছেন সেটা
                ঘরের নাম দেখে ঠিক করেন, ক্রমের উপর ভরসা করে না। ক্রমিক নম্বর তিনি নিজে বানান না, খাতাতেই ছাপা থাকে। “দেশ” ঘরে কিছু না
                বললে সিল মেরে দেন “বাংলাদেশ”, আর আসার সময়ের ঘরে ঘড়ি দেখে সময়। শেষে অতিথির হাতে একটা রসিদ দেন, তাতে ক্রমিক নম্বরটা
                লেখা।
              </ContentParagraph>
              <ContentParagraph>
                SQL এর INSERT ঠিক এই কেরানি। নতুন লাইন মানে নতুন Row, ঘরের নাম মানে Column এর তালিকা, ছাপা ক্রমিক নম্বর মানে Identity
                Column, সিল আর ঘড়ি মানে DEFAULT, আর রসিদ মানে RETURNING। পার্থক্য একটাই: কেরানি নিজে বুদ্ধি খাটিয়ে ভুল ধরতে পারেন,
                Database পারে শুধু সেই নিয়মগুলো দিয়ে যেগুলো আপনি Module 09 এ Constraint হিসেবে লিখে দিয়েছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Module 10 এর চার কাজ",
          content: (
            <ContentParagraph>
              Data বদলানোর চারটা মৌলিক কাজকে একসাথে বলা হয় DML (Data Manipulation Language): নতুন Row লেখা (INSERT), আছে এমন Row
              বদলানো (UPDATE), Row সরানো (DELETE), আর থাকলে বদলানো, না থাকলে নতুন লেখা (Upsert)। এই লেসন প্রথমটার। বাকিগুলো এই মডিউলের পরের
              লেসনগুলোতে, আর পুরো মডিউলের ছবি আছে{" "}
              <Link href="/sql/topic/changing-data-overview" className={LINK}>
                Module 10 এর Overview
              </Link>{" "}
              তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "anatomy",
      subHeader: { index: "002", title: "Anatomy of INSERT" },
      title: <SectionTitle>একটা INSERT এর চার অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে সাধারণ INSERT এর গঠন:{" "}
                <code className={CODE}>INSERT INTO table (column, column, ...) VALUES (value, value, ...);</code>। এর চারটা অংশ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>INSERT INTO table:</strong> কোন Table এ নতুন Row যাবে। একটা INSERT সবসময় একটা Table এই লেখে।
                </ListItem>
                <ListItem>
                  <strong>Column এর তালিকা:</strong> বন্ধনীর ভেতরে সেই Column গুলোর নাম যেগুলোর মান আপনি দিচ্ছেন, আপনার পছন্দের ক্রমে।
                  তালিকায় নেই এমন প্রতিটা Column Database নিজে ভরে: তার DEFAULT থাকলে সেটা, না থাকলে NULL।
                </ListItem>
                <ListItem>
                  <strong>VALUES:</strong> মানগুলো, ঠিক তালিকার ক্রমে। প্রথম মান যায় তালিকার প্রথম Column এ, দ্বিতীয়টা দ্বিতীয় Column এ,
                  এভাবে বাঁ থেকে ডানে।
                </ListItem>
                <ListItem>
                  <strong>RETURNING (ইচ্ছা হলে):</strong> নতুন Row থেকে কোন Column গুলো ফেরত চান। না লিখলে INSERT শুধু জানায় কয়টা Row
                  ঢুকল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছবিতে এই লেসনের প্রথম INSERT আর তার বানানো Row। খেয়াল করুন, Row এর সাতটা ঘরের মাত্র তিনটা আপনি দিয়েছেন, বাকি
                চারটা Database নিজে ভরেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InsertAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নিজে চালান। বক্সটা আগে <code className={CODE}>ins_customers</code> নামে একটা অনুশীলনের Table বানায়, আসল
                customers এর মতোই গঠন। এই লেসনের প্রতিটা অনুশীলনের Table এর নাম <code className={CODE}>ins_</code> দিয়ে শুরু, আর
                প্রতিটা বক্স শুরু হয় <code className={CODE}>DROP TABLE IF EXISTS</code> দিয়ে, তাই যতবার খুশি Run চাপতে পারেন, ফলাফল একই
                থাকবে। আসল Island Tours এর Table এ সরাসরি কিছু লিখব শুধু একটা <code className={CODE}>BEGIN ... ROLLBACK</code> এর
                ভেতরে, যাতে পাতার বাকি বক্সগুলো সবসময় একই Data দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম INSERT"
              query={`${CUSTOMERS_SETUP}

INSERT INTO ins_customers (full_name, email, city)
VALUES ('Rafiq Islam', 'rafiq.islam@mail.example', 'Dhaka');

SELECT customer_id, full_name, email, phone, city, country
FROM ins_customers;`}
              caption="INSERT এর উত্তর INSERT 1: একটা Row ঢুকেছে। SELECT দেখায় customer_id 1 (Identity দিয়েছে), phone এ NULL (তালিকায় ছিল না, DEFAULT ও নেই), আর country তে Bangladesh (DEFAULT)। joined_at ও ভরেছে now() দিয়ে, কিন্তু সময়টা প্রতিবার আলাদা বলে SELECT এ রাখিনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "INSERT 0 1 এর 0 টা কী",
          content: (
            <ContentParagraph>
              psql এ একই INSERT চালালে উত্তর আসে <code className={CODE}>INSERT 0 1</code>, আর তিনটা Row দিলে{" "}
              <code className={CODE}>INSERT 0 3</code>। শেষের সংখ্যাটা কয়টা Row ঢুকল। মাঝের 0 টা ইতিহাসের চিহ্ন: অনেক আগে PostgreSQL
              প্রতিটা Row কে একটা OID নামের গোপন নম্বর দিত, আর একটা Row ঢুকলে সেটা এখানে দেখাত। PostgreSQL এর Docs বলে এখন সেটা সবসময়
              0, কারণ OID সহ Table আর বানানোই যায় না। এই পাতার বক্স সেই অর্থহীন 0 বাদ দিয়ে শুধু INSERT 1 দেখায়। আর App এর কোডে এই
              সংখ্যাটাই আসে rowCount নামে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "column-list",
      subHeader: { index: "003", title: "Always Name the Columns" },
      title: <SectionTitle>Column এর তালিকা সবসময় লিখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Column এর তালিকা না লিখেও INSERT চলে: <code className={CODE}>INSERT INTO table VALUES (...);</code>। তখন PostgreSQL
                ধরে নেয় আপনি Table এর সব Column দিচ্ছেন, Table বানানোর সময় যে ক্রমে লেখা হয়েছিল সেই ক্রমে। PostgreSQL এর Docs আরও
                একটা কথা বলে: আপনি N টা মান দিলে সে প্রথম N টা Column ধরে নেয়, বাকিগুলো DEFAULT বা NULL পায়।
              </ContentParagraph>
              <ContentParagraph>
                শুনতে সুবিধার, কিন্তু এর মানে আপনার কোড এমন একটা জিনিসের উপর ভরসা করছে যা কোডে লেখা নেই: Table এর ভেতরের Column এর
                ক্রম। কেউ Table নতুন করে বানালে, মাঝখানে Column যোগ করলে, বা আপনি নিজেই ক্রম ভুলে গেলে, মানগুলো ভুল ঘরে যায়। আর সবচেয়ে
                বিপজ্জনক ব্যাপার, অনেক সময় কোনো Error ই আসে না। নিচের বক্সে গাইডদের একটা Table, তিনটা Column ই text। তালিকা ছাড়া INSERT
                এ মান দুটো উল্টো ক্রমে লেখা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকা ছাড়া: চুপচাপ জায়গা বদল"
              query={`DROP TABLE IF EXISTS ins_guides;
CREATE TABLE ins_guides (
  full_name text NOT NULL,
  phone     text NOT NULL,
  language  text NOT NULL
);

-- Column এর তালিকা নেই, আর মান দুটো ভুল ক্রমে
INSERT INTO ins_guides
VALUES ('Mahfuz Alam', 'English', '+8801000000206');

SELECT full_name, phone, language FROM ins_guides;`}
              caption="INSERT 1, কোনো Error নেই। কিন্তু Row এ phone এর ঘরে English আর language এর ঘরে +8801000000206। তিনটা Column ই text, তাই PostgreSQL এর কাছে English একটা ঠিকঠাক ফোন নম্বর। এই ভুল ধরা পড়বে কয়েক সপ্তাহ পরে, যখন কেউ গাইডকে ফোন করতে যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রায় প্রতিটা আসল Table এর প্রথম Column একটা Identity নম্বর। তালিকা ছাড়া INSERT এ প্রথম মানটা তখন সেই নম্বরের ঘরে যেতে
              চায়। এখানে অন্তত Error আসে, কারণ নাম দিয়ে তো integer হয় না:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম Column যখন Identity"
              query={`DROP TABLE IF EXISTS ins_guides;
CREATE TABLE ins_guides (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  phone     text NOT NULL,
  language  text NOT NULL
);

INSERT INTO ins_guides
VALUES ('Mahfuz Alam', '+8801000000206', 'English');`}
              caption={`ERROR: invalid input syntax for type integer: "Mahfuz Alam", SQLSTATE 22P02। PostgreSQL প্রথম মানটা guide_id এ বসাতে চেয়েছে, কারণ তালিকা না থাকলে প্রথম মান মানে প্রথম Column। Error দেখে প্রথমে মনে হয় নামে সমস্যা, আসলে সমস্যা তালিকা না থাকায়।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই Table এ তালিকা সহ। তালিকা থাকলে দুটো স্বাধীনতা আসে। এক, তালিকার ক্রম আপনার ইচ্ছা, Table এর ক্রম মানতে হয় না।
                দুই, যে Column এর মান নেই বা দরকার নেই, সেটা তালিকা থেকে বাদ দিলেই সে নিজের DEFAULT পায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকা থাকলে ক্রম আপনার"
              query={`DROP TABLE IF EXISTS ins_guides;
CREATE TABLE ins_guides (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  phone     text NOT NULL,
  language  text NOT NULL DEFAULT 'Bangla'
);

-- তালিকার ক্রম Table এর ক্রম থেকে আলাদা
INSERT INTO ins_guides (language, phone, full_name)
VALUES ('English', '+8801000000206', 'Mahfuz Alam');

-- language বাদ, তাই সে নিজের DEFAULT পায়
INSERT INTO ins_guides (full_name, phone)
VALUES ('Tania Akter', '+8801000000207');

SELECT guide_id, full_name, phone, language
FROM ins_guides
ORDER BY guide_id;`}
              caption="দুটো INSERT 1। Mahfuz Alam এর তিনটা মান উল্টো ক্রমে লেখা, তবু প্রতিটা নিজের নামের ঘরে: phone এ নম্বর, language এ English। Tania Akter এর language লেখা হয়নি, তাই সে পেয়েছে DEFAULT, Bangla। guide_id দুজনের 1 আর 2, দুটোই Identity দিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে বাস্তব বিপদটা আসে Table বদলালে। PostgreSQL এ ALTER TABLE ... ADD COLUMN নতুন Column সবসময় শেষে বসায় (
                <Link href="/sql/topic/alter-table" className={LINK}>
                  Module 09 এর ALTER TABLE লেসন
                </Link>
                )। তাই পুরনো, তালিকা ছাড়া কোড চলতেই থাকে: সে দুটো মান দেয়, PostgreSQL প্রথম দুটো Column ধরে নেয়, আর নতুন Column টা চুপচাপ
                DEFAULT পায়, সেটা ঠিক হোক বা না হোক। MySQL এ ADD COLUMN ... AFTER দিয়ে মাঝখানেও Column বসানো যায়। তখন পুরনো কোড প্রথমে
                Error দেয়, আর তাড়াহুড়োয় কেউ শেষে একটা মান জুড়ে দিলে Error চলে যায়, কিন্তু দুটো মান একে অন্যের ঘরে বসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ColumnListSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ আটটা পরিস্থিতি, PostgreSQL আর MySQL দুটোতেই। প্রতিটা ফলাফল আসল Database এ একই Statement চালিয়ে নেওয়া।
              বিশেষ করে দুটো লাল দাগের পরিস্থিতি খেয়াল করুন: সেখানে কোনো Error নেই, শুধু ভুল Data।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ColumnMappingLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিয়মটা এক লাইনে",
          content: (
            <ContentParagraph>
              Production এর কোডে, Migration এ, Seed Script এ, সব জায়গায় INSERT এর সাথে Column এর তালিকা লিখুন। তালিকা ছাড়া INSERT চলে
              শুধু psql এ নিজের হাতে এক মিনিটের পরীক্ষায়, যেখানে আপনি এইমাত্র{" "}
              <code className={CODE}>\d table</code> দিয়ে Column এর ক্রম দেখে নিয়েছেন।
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
                  Starter Query <code className={CODE}>ins_ex1_customers</code> বানায়, গঠন ins_customers এর মতো। মাঝের মন্তব্যের
                  জায়গায় একটা INSERT লিখুন, Column এর তালিকা সহ: নাম Shirin Sultana, email{" "}
                  <code className={CODE}>shirin.sultana@mail.example</code>, শহর Rajshahi। ফোন নম্বর তিনি দেননি, আর দেশ বাংলাদেশ। ফোনের
                  ঘর যেন সত্যিই NULL থাকে, আর দেশের মান আপনি নিজে না লিখে DEFAULT কে দিতে দিন। শেষের যাচাইয়ের Query না বদলে শেষ
                  Statement হিসেবে রাখুন।
                </>
              }
              hint={
                <>
                  তালিকায় শুধু তিনটা Column: <code className={CODE}>(full_name, email, city)</code>। phone আর country তালিকায় না থাকলে
                  phone পায় NULL আর country পায় DEFAULT। ফোনে <code className={CODE}>{"''"}</code> লিখবেন না, ফাঁকা লেখা আর অজানা এক
                  জিনিস না।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ex1_customers;
CREATE TABLE ins_ex1_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,
  city        text NOT NULL,
  country     text NOT NULL DEFAULT 'Bangladesh',
  joined_at   timestamptz NOT NULL DEFAULT now()
);

-- এখানে আপনার INSERT লিখুন

SELECT customer_id, full_name, email, phone IS NULL AS no_phone, city, country
FROM ins_ex1_customers;`}
              solution={`SELECT * FROM (VALUES
  (1, 'Shirin Sultana', 'shirin.sultana@mail.example', true, 'Rajshahi', 'Bangladesh')
) AS v(customer_id, full_name, email, no_phone, city, country);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "many-rows",
      subHeader: { index: "004", title: "Many Rows at Once" },
      title: <SectionTitle>এক Statement এ অনেক Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VALUES এর পরে একটার বেশি বন্ধনী দিলে, কমা দিয়ে আলাদা করে, এক Statement এ অনেক Row ঢোকে:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>{"INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y'), (3, 'z');"}</code>
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা বন্ধনী একটা Row, আর প্রতিটা বন্ধনীতে তালিকার সমান সংখ্যক মান লাগে। একটা একটা করে তিনটা INSERT এর চেয়ে এটা কেন
                ভালো? প্রতিটা Statement এর একটা খরচ আছে: App থেকে Server পর্যন্ত যাওয়া আসা, Statement টা পড়ে বোঝা, আর শেষে Disk এ পাকা
                করে লেখা। তিনটা Row এক Statement এ মানে সেই খরচ একবার। কয়েক হাজার Row এর বেলায় পার্থক্যটা চোখে পড়ার মতো। লাখ লাখ Row
                এর জন্য আরও দ্রুত পথ আছে, COPY, সেটা{" "}
                <Link href="/sql/topic/bulk-loading" className={LINK}>
                  Bulk Loading লেসনে
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ তিনটা Customer"
              query={`${CUSTOMERS_SETUP}

INSERT INTO ins_customers (full_name, email, phone, city, country)
VALUES
  ('Nadia Karim', 'nadia.karim@mail.example', '+8801000000116', 'Sylhet', 'Bangladesh'),
  ('Joy Barua', 'joy.barua@mail.example', NULL, 'Chattogram', 'Bangladesh'),
  ('Ananya Sen', 'ananya.sen@mail.example', NULL, 'Kolkata', 'India');

SELECT customer_id, full_name, phone, city, country
FROM ins_customers
ORDER BY customer_id;`}
              caption="উত্তর INSERT 3, একবারে তিনটা Row। নম্বর পেয়েছে VALUES এর ক্রমে: Nadia 1, Joy 2, Ananya 3। Joy আর Ananya এর ফোনের ঘরে নিজে লেখা NULL, আর Ananya এর দেশ India, কারণ তালিকায় country আছে আর মানটা দেওয়া।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন জরুরি প্রশ্ন: তিনটা Row এর একটায় সমস্যা থাকলে কী হয়? প্রথমটা ঢুকে যায়, শুধু খারাপটা বাদ পড়ে? না। একটা Statement
                একটা অবিভাজ্য কাজ: হয় সব Row ঢোকে, নয়তো একটাও না। পরের বক্সে দ্বিতীয় Row এর শহর NULL, অথচ city তে NOT NULL আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা খারাপ Row, পুরো Statement বাতিল"
              query={`${CUSTOMERS_SETUP}

INSERT INTO ins_customers (full_name, email, city)
VALUES
  ('Nadia Karim', 'nadia.karim@mail.example', 'Sylhet'),
  ('Joy Barua', 'joy.barua@mail.example', NULL),
  ('Ananya Sen', 'ananya.sen@mail.example', 'Kolkata');`}
              caption={`ERROR: null value in column "city" of relation "ins_customers" violates not-null constraint, SQLSTATE 23502। DETAIL এর Failing row এর শুরুতে 2: Joy এর Row টা নম্বর 2 পেয়ে তবেই আটকেছে। Nadia এর Row কি থেকে গেল? ঠিক পরের বক্সটা এই বক্সের পরে চালিয়ে দেখুন।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কিছুই ঢোকেনি, তবু নম্বর গেছে"
              query={`SELECT count(*) AS rows_in_table FROM ins_customers;

INSERT INTO ins_customers (full_name, email, city)
VALUES ('Nadia Karim', 'nadia.karim@mail.example', 'Sylhet')
RETURNING customer_id;`}
              caption="আগের বক্সের ঠিক পরে চালালে rows_in_table 0: Nadia এর Row ও নেই, কারণ পুরো Statement বাতিল। তারপর Nadia কে একা ঢোকালে সে পায় 3, 1 না। বাতিল Statement টা 1 আর 2 খরচ করে ফেলেছে (Ananya পর্যন্ত যাওয়াই হয়নি)। এই ফাঁক কেন স্বাভাবিক, সেটা এই লেসনের Constraint অংশে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক Statement মানে এক Transaction",
          content: (
            <ContentParagraph>
              আলাদা করে BEGIN না লিখলে PostgreSQL প্রতিটা Statement কে নিজস্ব একটা ছোট Transaction এ চালায়, শেষে নিজেই COMMIT করে। তাই
              একটা Statement এর ভেতরে সব বা কিছুই না, এটা বিনা খরচে পাওয়া। কয়েকটা আলাদা Statement কে একসাথে সব বা কিছুই না বানাতে
              হলে নিজে BEGIN আর COMMIT লিখতে হয়, সেটা এই লেসনের Booking আর Payment অংশে দেখবেন, আর পুরো গল্প{" "}
              <Link href="/sql/topic/transactions-basics" className={LINK}>
                Module 12 এ
              </Link>
              ।
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
                  Starter Query <code className={CODE}>ins_ex2_guides</code> বানিয়ে তাতে আসল guides এর পাঁচজনকে ঢোকায়, নম্বর 1 থেকে 5।
                  মন্তব্যের জায়গায় <strong>একটাই</strong> INSERT লিখুন যা এই ক্রমে তিনজন নতুন গাইড যোগ করে: Mahfuz Alam (
                  <code className={CODE}>+8801000000206</code>, English, যোগ দিচ্ছেন 2026-11-01), Tania Akter (
                  <code className={CODE}>+8801000000207</code>, Bangla, 2026-11-01), Dipankar Roy (
                  <code className={CODE}>+8801000000208</code>, Bangla, 2026-11-15)। যাচাইয়ের Query নতুন তিনজনকে নম্বরসহ দেখায়, তাই ক্রমটা
                  জরুরি।
                </>
              }
              hint={
                <>
                  তালিকা <code className={CODE}>(full_name, phone, language, hired_on)</code>, তারপর VALUES এর পরে কমা দিয়ে তিনটা
                  বন্ধনী। তারিখ লিখুন <code className={CODE}>{"'2026-11-01'"}</code> এর মতো, Single Quote এর ভেতরে।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ex2_guides;
CREATE TABLE ins_ex2_guides (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  phone     text NOT NULL,
  language  text NOT NULL,
  hired_on  date NOT NULL
);
INSERT INTO ins_ex2_guides (full_name, phone, language, hired_on)
SELECT full_name, phone, language, hired_on
FROM guides
ORDER BY guide_id;

-- এখানে আপনার INSERT লিখুন

SELECT guide_id, full_name, language, hired_on
FROM ins_ex2_guides
WHERE guide_id > 5
ORDER BY guide_id;`}
              solution={`SELECT * FROM (VALUES
  (6, 'Mahfuz Alam', 'English', DATE '2026-11-01'),
  (7, 'Tania Akter', 'Bangla', DATE '2026-11-01'),
  (8, 'Dipankar Roy', 'Bangla', DATE '2026-11-15')
) AS v(guide_id, full_name, language, hired_on);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "defaults",
      subHeader: { index: "005", title: "DEFAULT and DEFAULT VALUES" },
      title: <SectionTitle>DEFAULT: Database যখন নিজে মান বসায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Module 09 এ
                </Link>{" "}
                আপনি Column এ DEFAULT লিখেছেন। INSERT এর দিক থেকে DEFAULT পাওয়ার তিনটা পথ, আর একটা ফাঁদ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Column টা তালিকা থেকে বাদ দেওয়া।</strong> সবচেয়ে সাধারণ পথ। তালিকায় নেই মানে আপনি কিছু বলছেন না, Database
                  DEFAULT বসায়, DEFAULT না থাকলে NULL।
                </ListItem>
                <ListItem>
                  <strong>তালিকায় রেখে মানের জায়গায় DEFAULT শব্দটা লেখা।</strong> Quote ছাড়া, কারণ এটা একটা SQL শব্দ, লেখা না। কাজে
                  লাগে যখন অনেক Row এর কয়েকটায় নিজের মান আর কয়েকটায় DEFAULT চান, অথবা কোড সবসময় একই তালিকা পাঠায়।
                </ListItem>
                <ListItem>
                  <strong>DEFAULT VALUES:</strong> কোনো তালিকা, কোনো মান নয়, পুরো Row টাই DEFAULT দিয়ে। শুধু তখনই চলে যখন প্রতিটা NOT
                  NULL Column এর একটা DEFAULT আছে।
                </ListItem>
                <ListItem>
                  <strong>ফাঁদ: নিজে NULL লিখলে DEFAULT বসে না।</strong> NULL একটা মান হিসেবেই ধরা হয়: আপনি বলছেন “এটা অজানা”। Column
                  এ NOT NULL থাকলে তখন Error।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাদ দেওয়া, DEFAULT লেখা, আর নিজে NULL"
              query={`${SIGNUPS_SETUP}

-- ১. শুধু email, বাকিরা নিজের DEFAULT পায়
INSERT INTO ins_signups (email)
VALUES ('rafiq.islam@mail.example');

-- ২. source এ DEFAULT শব্দটা, newsletter এ নিজের মান
INSERT INTO ins_signups (email, source, newsletter)
VALUES ('nadia.karim@mail.example', DEFAULT, true);

-- ৩. source এ অন্য মান, note এ নিজে NULL
INSERT INTO ins_signups (email, source, note)
VALUES ('joy.barua@mail.example', 'facebook', NULL);

SELECT signup_id, email, source, newsletter, note
FROM ins_signups
ORDER BY signup_id;`}
              caption="তিনটা Row। Rafiq পেয়েছেন source website আর newsletter f, দুটোই DEFAULT। Nadia এর source এ DEFAULT লেখা ছিল, তাই website, আর newsletter t কারণ সেটা নিজে দেওয়া। Joy এর source facebook। note তিনজনেরই NULL: দুজনের তালিকায় ছিল না আর DEFAULT ও নেই, Joy এর ক্ষেত্রে নিজে লেখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজে NULL লিখলে DEFAULT বসে না"
              query={`${SIGNUPS_SETUP}

INSERT INTO ins_signups (email, source)
VALUES ('ananya.sen@mail.example', NULL);`}
              caption={`ERROR: null value in column "source" of relation "ins_signups" violates not-null constraint, 23502। source এর DEFAULT website আছে, তবু বসেনি, কারণ আপনি নিজে NULL চেয়েছেন। App এর কোডে এটা খুব হয়: Form এর খালি ঘর থেকে null আসে আর সোজা INSERT এ চলে যায়। DEFAULT চাইলে Column টা তালিকা থেকেই বাদ দিন, বা DEFAULT লিখুন।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DEFAULT হিসেবে <code className={CODE}>now()</code> থাকলে একটা মজার ব্যাপার ঘটে। PostgreSQL এর now() দেয় Transaction শুরু
                হওয়ার মুহূর্ত, Statement চলার প্রতিটা মাইক্রোসেকেন্ড না। তাই এক Statement এ তিনটা Row দিলে তিনজনের সময় হুবহু এক।
                হিসাবের জন্য এটা ভালো: একসাথে আসা Row গুলো একসাথেই দেখায়। Module 04 এর{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Date and Time Functions
                </Link>{" "}
                লেসনে now() আর clock_timestamp() এর পার্থক্য দেখেছিলেন, এটা তারই ফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFAULT VALUES, আর একই now()"
              query={`DROP TABLE IF EXISTS ins_page_views;
CREATE TABLE ins_page_views (
  view_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page      text NOT NULL DEFAULT '/tours',
  viewed_at timestamptz NOT NULL DEFAULT now()
);

-- কোনো Column না বলে একটা পুরো DEFAULT Row
INSERT INTO ins_page_views DEFAULT VALUES;

-- এক Statement এ তিনটা Row, প্রথমটায় DEFAULT শব্দ
INSERT INTO ins_page_views (page)
VALUES (DEFAULT), ('/tours/sajek'), ('/tours/sundarbans');

SELECT view_id, page FROM ins_page_views ORDER BY view_id;

SELECT count(*) AS rows_in_second_insert,
       count(DISTINCT viewed_at) AS different_times
FROM ins_page_views
WHERE view_id > 1;`}
              caption="প্রথম Table এ চারটা Row: view 1 আর 2 এর page /tours, দুটোই DEFAULT থেকে, বাকি দুটো নিজের মান। দ্বিতীয় Table এ rows_in_second_insert 3 কিন্তু different_times 1: এক Statement এর তিনটা Row এর viewed_at হুবহু এক মুহূর্ত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "DEFAULT VALUES কোথায় কাজে লাগে",
          content: (
            <ContentParagraph>
              বাস্তবে DEFAULT VALUES কম দেখা যায়, কারণ প্রায় সব Table এ অন্তত একটা Column থাকে যার মান আপনাকেই দিতে হয়। তবু কিছু জায়গায়
              এটা ঠিক জিনিস: শুধু একটা নতুন নম্বর চাই এমন কাউন্টার Table, বা এমন Log যার সব তথ্য DEFAULT থেকে আসে। MySQL এ এই রূপটা নেই,
              সেখানে লেখা হয় <code className={CODE}>{"INSERT INTO t () VALUES ();"}</code>, সেটা In MySQL অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "insert-select",
      subHeader: { index: "006", title: "INSERT ... SELECT" },
      title: <SectionTitle>INSERT ... SELECT: অন্য Query থেকে Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VALUES এ আপনি Row গুলো নিজের হাতে লেখেন। কিন্তু অনেক সময় নতুন Row গুলো আগে থেকেই Database এ আছে, শুধু অন্য আকারে।
                বিক্রয় দল চায় সব pending Booking এর একটা ফোন তালিকা, প্রতিটার পাশে Customer এর নাম আর নম্বর, যাতে সোমবার ফোন করা যায়।
                সেই তালিকার প্রতিটা Row আসলে একটা SELECT এর ফলাফল। তাই VALUES এর জায়গায় পুরো একটা SELECT বসানো যায়:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>INSERT INTO target (col1, col2, ...) SELECT expr1, expr2, ... FROM ... WHERE ...;</code>
              </ContentParagraph>
              <ContentParagraph>
                নিয়ম VALUES এর মতোই: SELECT এর প্রথম Column যায় তালিকার প্রথম Column এ, দ্বিতীয়টা দ্বিতীয়তে। নাম মিলতে হয় না, ক্রম আর
                Type মিলতে হয়। SELECT এর ভেতরে আপনি Module 03 থেকে 08 এ যা শিখেছেন সব চলে: JOIN, WHERE, GROUP BY, CASE, Window Function।
                কয়টা Row যাবে সেটা ঠিক করে SELECT নিজে, শূন্যও হতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="pending Booking থেকে ফোনের তালিকা"
              query={`${FOLLOWUPS_SETUP}

INSERT INTO ins_followups (booking_id, customer, phone, total_bdt)
SELECT b.booking_id, c.full_name, c.phone, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
ORDER BY b.booking_id;

SELECT followup_id, booking_id, customer, phone, total_bdt, call_on
FROM ins_followups
ORDER BY followup_id;`}
              caption="INSERT 4: চারটা pending Booking থেকে চারটা Row। Booking 14 (Kamal Hasan, 50000.00), 17 (Rahim Uddin, 36000.00), 20 (Priya Sharma, 15600.00) আর 24 (Shuvo Das, 15600.00)। Priya র ফোন NULL, কারণ customers এ তাঁর ফোন নেই। call_on সবার 2026-11-02, সেটা DEFAULT। followup_id 1 থেকে 4, SELECT এর ORDER BY এর ক্রমে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              SELECT এ একটা Column বেশি হয়ে গেলে, ধরুন email ও তুলে আনলেন কিন্তু তালিকায় তার জায়গা নেই, PostgreSQL পরিষ্কার জানিয়ে দেয়:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SELECT এ একটা Column বেশি"
              query={`${FOLLOWUPS_SETUP}

INSERT INTO ins_followups (booking_id, customer, phone, total_bdt)
SELECT b.booking_id, c.full_name, c.phone, c.email, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending';`}
              caption="ERROR: INSERT has more expressions than target columns, SQLSTATE 42601। তালিকায় চারটা Column, SELECT এ পাঁচটা মান। উল্টোটা, মানে SELECT এ কম, Error দেয় না যদি বাদ পড়া Column গুলোর DEFAULT থাকে বা NULL চলে, তাই সেটা আরও চুপচাপ ভুল। VALUES এও একই Error আসে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা বাস্তব সমস্যা। বিক্রয় দলের Script প্রতিদিন সকালে চলে। আজ চলল, কাল আবার চলল: একই চারটা Booking দ্বিতীয়বার
                তালিকায় ঢুকবে? এখানে ins_followups এর booking_id তে UNIQUE আছে, তাই দ্বিতীয় দিনে Error আসবে আর পুরো Script থেমে যাবে।
                ভালো উপায় হলো SELECT কেই বলে দেওয়া যে আগে থেকে আছে এমন Row বাদ যাবে।{" "}
                <Link href="/sql/topic/semi-anti-join" className={LINK}>
                  Module 06 এর NOT EXISTS
                </Link>{" "}
                ঠিক এই কাজের জন্য। এমন Script কে বলে Idempotent: যতবার চালান, ফলাফল প্রথমবারের মতোই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আবার চালালেও দুবার ঢোকে না"
              query={`${FOLLOWUPS_SETUP}

-- একই INSERT দুইবার। দ্বিতীয়বার NOT EXISTS আগের Row গুলো বাদ দেয়
INSERT INTO ins_followups (booking_id, customer, phone, total_bdt)
SELECT b.booking_id, c.full_name, c.phone, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 FROM ins_followups f WHERE f.booking_id = b.booking_id
  );

INSERT INTO ins_followups (booking_id, customer, phone, total_bdt)
SELECT b.booking_id, c.full_name, c.phone, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 FROM ins_followups f WHERE f.booking_id = b.booking_id
  );

SELECT count(*) AS followups FROM ins_followups;`}
              caption="প্রথম INSERT 4, দ্বিতীয় INSERT 0, আর শেষে followups 4। দ্বিতীয়বার SELECT একটা Row ও দেয়নি, তাই INSERT করার কিছু ছিল না, Error ও আসেনি। Upsert লেসনে এর আরও শক্ত রূপ দেখবেন, ON CONFLICT DO NOTHING, যেটা একই সময়ে দুটো Script চললেও টেকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "CREATE TABLE AS বনাম INSERT ... SELECT",
          content: (
            <ContentParagraph>
              <Link href="/sql/topic/create-table" className={LINK}>
                Module 09 এ
              </Link>{" "}
              দেখেছেন CREATE TABLE ... AS SELECT একবারে Table বানিয়ে ভরে দেয়, কিন্তু Constraint, DEFAULT বা Identity আনে না। INSERT ...
              SELECT আগে থেকে সাজানো Table এ ঢালে, তাই সেই Table এর সব নিয়ম প্রতিটা Row এ খাটে। তাই নিয়মিত কাজ, Archive, Report এর Table
              ভরা, এসবে আগে নিয়মসহ Table, তারপর INSERT ... SELECT।
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
                  ফারুক সাহেব বাতিল হওয়া Booking গুলোর একটা Archive চান। Starter Query{" "}
                  <code className={CODE}>ins_ex3_cancelled</code> বানায়। একটা INSERT ... SELECT লিখুন যা প্রতিটা cancelled Booking এর
                  booking_id, Customer এর পুরো নাম (<code className={CODE}>customer</code> এ), ট্যুরের title (
                  <code className={CODE}>tour</code> এ) আর total_bdt তুলে আনে। archived_on এ হাত দেবেন না, DEFAULT বসবে। ট্যুরের নাম
                  পেতে bookings থেকে departures হয়ে tours এ যেতে হবে।
                </>
              }
              hint={
                <>
                  চারটা Table এর JOIN: <code className={CODE}>bookings b</code>, <code className={CODE}>customers c</code>,{" "}
                  <code className={CODE}>departures d</code>, <code className={CODE}>tours t</code>। শর্ত{" "}
                  <code className={CODE}>{"b.status = 'cancelled'"}</code>। INSERT এর তালিকা{" "}
                  <code className={CODE}>(booking_id, customer, tour, total_bdt)</code>, SELECT এ ঠিক সেই ক্রমে চারটা Column।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ex3_cancelled;
CREATE TABLE ins_ex3_cancelled (
  archive_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id  integer NOT NULL UNIQUE,
  customer    text NOT NULL,
  tour        text NOT NULL,
  total_bdt   numeric(10, 2) NOT NULL,
  archived_on date NOT NULL DEFAULT DATE '2026-11-01'
);

-- এখানে আপনার INSERT ... SELECT লিখুন

SELECT booking_id, customer, tour, total_bdt, archived_on
FROM ins_ex3_cancelled
ORDER BY booking_id;`}
              solution={`SELECT b.booking_id, c.full_name, t.title, b.total_bdt, DATE '2026-11-01'
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
WHERE b.status = 'cancelled'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "returning",
      subHeader: { index: "007", title: "RETURNING" },
      title: <SectionTitle>RETURNING: লেখার সাথে সাথে রসিদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের তৃতীয় প্রশ্নে ফিরি: Booking লেখার পরে Website জানবে কীভাবে নম্বরটা কত? নম্বরটা দিয়েছে Database, Identity
                দিয়ে, App জানে না। উত্তর <code className={CODE}>RETURNING</code>। INSERT এর শেষে RETURNING আর কয়েকটা Column লিখলে, যে
                Row গুলো আসলেই ঢুকেছে, প্রতিটা ঢোকার পরের চেহারায় ফলাফল হিসেবে ফেরত আসে, ঠিক যেন একটা SELECT। তাতে থাকে Database এর
                নিজের ভরা মানগুলোও: Identity নম্বর, DEFAULT, now()।
              </ContentParagraph>
              <ContentParagraph>
                RETURNING এর পরে যা লিখতে পারেন: Column এর নাম, <code className={CODE}>*</code> মানে সব Column, আর যেকোনো Expression,
                যেমন নম্বর থেকে একটা Member Code বানানো। AS দিয়ে নামও দেওয়া যায়। অনেক Row ঢোকালে অনেক Row ফেরত আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন নম্বর, DEFAULT আর একটা হিসাব, সব ফেরত"
              query={`${CUSTOMERS_SETUP}

INSERT INTO ins_customers (full_name, email, city, country)
VALUES
  ('Nadia Karim', 'nadia.karim@mail.example', 'Sylhet', DEFAULT),
  ('Ananya Sen', 'ananya.sen@mail.example', 'Kolkata', 'India')
RETURNING customer_id,
          full_name,
          country,
          'IT-' || lpad(customer_id::text, 5, '0') AS member_code;`}
              caption="আলাদা কোনো SELECT ছাড়াই দুটো Row ফেরত: Nadia Karim, customer_id 1, country Bangladesh (DEFAULT), member_code IT-00001; Ananya Sen, 2, India, IT-00002। খেয়াল করুন, Table এ member_code নামে কোনো Column নেই, এটা RETURNING এর ভেতরে হিসাব করা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                RETURNING না জানলে মানুষ প্রায়ই একটা বিপজ্জনক কৌশল নেয়: INSERT এর পরে{" "}
                <code className={CODE}>SELECT max(booking_id) FROM bookings</code>, সবচেয়ে বড় নম্বরটাই তো আমার, তাই না? একজন মানুষ একা
                psql এ বসে থাকলে হয়তো তাই। কিন্তু একটা Website এ একই মুহূর্তে অনেক Request আসে, প্রত্যেকে নিজের Connection এ। আমরা দুটো
                psql জানালায় আসল PostgreSQL 18 এ এটা চালিয়ে দেখেছি:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MaxIdRaceDiagram />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: Session A, Session B মাঝখানে একটা INSERT করার পরে",
          code: `-- Session A
INSERT INTO ins_race (customer) VALUES ('Rafiq') RETURNING booking_id;
 booking_id
------------
          1
(1 row)

INSERT 0 1

-- (এর মধ্যে Session B: INSERT ... VALUES ('Nadia') RETURNING booking_id;  উত্তর 2)

-- Session A, আবার
SELECT max(booking_id) AS max_id,
       currval(pg_get_serial_sequence('ins_race', 'booking_id')) AS my_currval,
       lastval() AS my_lastval
FROM ins_race;
 max_id | my_currval | my_lastval
--------+------------+------------
      2 |          1 |          1
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                max দিল 2, যেটা Nadia এর। currval আর lastval দিল 1, ঠিক উত্তর, কারণ এরা নিজের Session এ শেষ পাওয়া নম্বর মনে রাখে, অন্যের
                না। তবু এদেরও দুর্বলতা আছে: lastval মানে এই Session এ যেকোনো Sequence থেকে শেষ নম্বর, মাঝে আরেকটা Table এ INSERT হলে
                সেটাই আসবে। currval এর জন্য Sequence এর নাম জানতে হয়। Sequence নিজে কী, কীভাবে নম্বর দেয়, সেটা এই মডিউলের{" "}
                <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                  Generated Columns and Sequences
                </Link>{" "}
                লেসনে। সবচেয়ে পরিষ্কার পথ RETURNING: যে Statement Row বানাল, নম্বর আসে সেখান থেকেই, আলাদা প্রশ্নের দরকারই নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL 18 এ RETURNING এ নতুন দুটো নাম এসেছে: <code className={CODE}>old</code> আর <code className={CODE}>new</code>,
              বদলের আগের আর পরের Row। INSERT এ আগের Row বলে কিছু নেই, তাই Docs অনুযায়ী সাধারণ INSERT এ old এর সব মান NULL। আসল কাজে
              লাগে UPDATE এ, যেটা{" "}
              <Link href="/sql/topic/update" className={LINK}>
                পরের লেসনে
              </Link>
              , আর Upsert এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL 18: old আর new"
              query={`${CUSTOMERS_SETUP}

INSERT INTO ins_customers (full_name, email, city)
VALUES ('Joy Barua', 'joy.barua@mail.example', 'Chattogram')
RETURNING old.customer_id AS old_id,
          new.customer_id AS new_id,
          new.country;`}
              caption="old_id NULL, new_id 1, country Bangladesh। নতুন Row এর আগে কিছু ছিল না, তাই old ফাঁকা। শুধু RETURNING customer_id লেখা মানে new.customer_id ই, আলাদা করে new লিখতে হয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  Starter Query <code className={CODE}>ins_ex4_tours</code> বানিয়ে আসল নয়টা ট্যুর ঢোকায় (নম্বর 1 থেকে 9)। max_seats এর
                  DEFAULT 20 আর is_active এর DEFAULT true। <strong>একটা</strong> INSERT লিখুন যা দুটো ট্যুর যোগ করে: Rangamati Lake Day
                  (6500.00 টাকা) আর Tanguar Haor Houseboat (11000.00 টাকা), শুধু title আর price_bdt দিয়ে। একই INSERT যেন RETURNING দিয়ে
                  ফেরত দেয় <code className={CODE}>tour_id, title, max_seats, is_active</code>, এই ক্রমে। এই INSERT ই হবে আপনার শেষ
                  Statement, তার পরে কোনো SELECT লিখবেন না।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"INSERT INTO ins_ex4_tours (title, price_bdt) VALUES (...), (...) RETURNING ...;"}</code>।
                  max_seats আর is_active তালিকায় নেই, তাই তারা DEFAULT পাবে, আর RETURNING সেটাই দেখাবে।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ex4_tours;
CREATE TABLE ins_ex4_tours (
  tour_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title     text NOT NULL,
  price_bdt numeric(10, 2) NOT NULL CHECK (price_bdt >= 0),
  max_seats smallint NOT NULL DEFAULT 20,
  is_active boolean NOT NULL DEFAULT true
);
INSERT INTO ins_ex4_tours (title, price_bdt, max_seats, is_active)
SELECT title, price_bdt, max_seats, is_active
FROM tours
ORDER BY tour_id;

-- এখানে আপনার INSERT ... RETURNING লিখুন, এটাই হবে শেষ Statement
`}
              solution={`SELECT * FROM (VALUES
  (10, 'Rangamati Lake Day', 20, true),
  (11, 'Tanguar Haor Houseboat', 20, true)
) AS v(tour_id, title, max_seats, is_active);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "constraints",
      subHeader: { index: "008", title: "Constraints Guard Every Insert" },
      title: <SectionTitle>প্রতিটা INSERT কে পাহারা দেয় Constraint</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 09 এ আপনি নিয়ম লিখেছিলেন: NOT NULL, CHECK, UNIQUE, Foreign Key। এখন দেখবেন সেই নিয়মগুলো আসলে কখন কাজ করে:
                প্রতিটা INSERT এর প্রতিটা Row এ। একটা নিয়ম ভাঙলে Row টা Table এ যায় না, আর সেই Statement এর আগের Row গুলোও না। ঠিক এটাই
                Constraint এর মূল্য: Website এর কোডে যতই ভুল থাকুক, ভুল Data Table পর্যন্ত পৌঁছায় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্স <code className={CODE}>ins_bookings</code> বানায়, আসল bookings এর মতো, সাথে একটা বাড়তি নিয়ম: একই Customer একই
                Departure এ একবারই। Foreign Key দুটো দেখায় আসল customers আর departures কে। তারপর Module 09 এর মতোই ছোট একটা Helper,{" "}
                <code className={CODE}>ins_try</code>, যা একটা Statement চালিয়ে ok বা Error এর SQLSTATE আর বার্তা ফেরত দেয়, যাতে একটা Query
                তেই সাতটা চেষ্টার ফল দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাতটা চেষ্টা, প্রতিটা নিয়ম একবার করে"
              query={`${BOOKINGS_SETUP}
${TRY_FUNCTION}

SELECT attempt, label, ins_try(stmt) AS result
FROM (VALUES
  (1, 'ঠিকঠাক Row', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (15, 12, 2, 'pending', 19000.00)$$),
  (2, 'নেই এমন Customer', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (99, 12, 2, 'pending', 19000.00)$$),
  (3, 'শূন্য সিট', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (14, 12, 0, 'pending', 0)$$),
  (4, 'বড় হাতের Pending', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (14, 12, 2, 'Pending', 19000.00)$$),
  (5, 'total_bdt বাদ', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status) VALUES (14, 12, 2, 'pending')$$),
  (6, 'একই Customer, একই Departure', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (15, 12, 1, 'pending', 9500.00)$$),
  (7, 'সিট লেখা অক্ষরে', $$INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (14, 12, 'two', 'pending', 19000.00)$$)
) AS t(attempt, label, stmt)
ORDER BY attempt;

SELECT booking_id, customer_id, seats, status FROM ins_bookings;

INSERT INTO ins_bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (14, 12, 1, 'confirmed', 9500.00)
RETURNING booking_id;`}
              caption={`প্রথম Table এ সাতটা ফল। 1 ok। 2: 23503, foreign key constraint "ins_bookings_customer_id_fkey"। 3: 23514, "ins_bookings_seats_check"। 4: 23514, "ins_bookings_status_check", কারণ CHECK বড় হাত ছোট হাত আলাদা ধরে। 5: 23502, total_bdt এ NULL। 6: 23505, "ins_bookings_customer_id_departure_id_key"। 7: 22P02, invalid input syntax for type smallint: "two"। দ্বিতীয় Table এ মাত্র একটা Row, booking 1। আর শেষ INSERT এর নতুন নম্বর 7, 2 না।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "SQLSTATE", "কখন ধরা পড়ে", "বার্তার মূল কথা"],
          rows: [
            ["Type এর সাথে না মেলা লেখা মান", "22P02, 22003", "সরাসরি লেখা মানে: Row বানানোর আগেই", "invalid input syntax, out of range"],
            ["NOT NULL", "23502", "Row বানিয়ে, প্রথমে", "null value in column ... violates not-null constraint"],
            ["CHECK", "23514", "NOT NULL এর পরে, নামের বর্ণক্রমে", "violates check constraint ..."],
            ["UNIQUE, PRIMARY KEY", "23505", "Index এ লেখার সময়, Row ধরে ধরে", "duplicate key value violates unique constraint ..."],
            ["Foreign Key", "23503", "Statement এর সব Row লেখার পরে", "violates foreign key constraint ..."],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ INSERT 7 পেল কেন? প্রতিটা চেষ্টা যেখানে PostgreSQL আগে Row বানিয়েছে আর তারপর কোনো নিয়মে আটকেছে, সেখানে Row বানানোর
                সময়েই Identity থেকে একটা নম্বর নেওয়া হয়ে গেছে। Row বাতিল হলো, নম্বর ফেরত গেল না। চেষ্টা 2 থেকে 6, পাঁচটা নম্বর। চেষ্টা 7
                আটকেছে Row বানানোর আগেই, <code className={CODE}>{"'two'"}</code> কে smallint হিসেবে পড়তেই পারেনি, তাই নম্বর নেয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BurnedNumbersDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এটা কোনো ত্রুটি না, ইচ্ছাকৃত নকশা। হাজারটা Connection একসাথে নম্বর চাইলে প্রত্যেককে অপেক্ষা করিয়ে আগে দেখা যে Row টা
                টিকবে কিনা, তারপর নম্বর দেওয়া, অসম্ভব ধীর হতো। তাই Sequence দ্রুত নম্বর দিয়ে দেয় আর ফেরত নেয় না। ফল: Identity নম্বর অনন্য, ক্রমে বাড়ে, কিন্তু
                ফাঁক থাকতে পারে। তাই Invoice নম্বরের মতো জিনিস, যেখানে আইনত কোনো ফাঁক চলে না, Identity দিয়ে বানানো হয় না। কেন আর কীভাবে,
                সেটা{" "}
                <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                  Sequences লেসনে
                </Link>
                ।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একই ins_bookings, কিন্তু এবার একটা একটা করে আপনি পাঠাবেন, আর ডানে দেখবেন Sequence এর খাতা: কোন নম্বর Table এ
                আছে, কোনটা খরচ হয়ে গেছে। শেষের দুটো বোতাম তিনটা Row একসাথে পাঠায়, তুলনা করে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InsertOutcomeLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "identity",
      subHeader: { index: "009", title: "Inserting into Identity Columns" },
      title: <SectionTitle>Identity Column এ নিজে নম্বর দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Module 09 এর Primary Keys লেসনে
                </Link>{" "}
                দেখেছেন Identity দুই রকম: <code className={CODE}>GENERATED ALWAYS</code> আর{" "}
                <code className={CODE}>GENERATED BY DEFAULT</code>। সাধারণ INSERT এ দুটোর আচরণ এক: Column টা তালিকায় না থাকলে, বা মানের
                জায়গায় DEFAULT লিখলে, পরের নম্বর বসে। পার্থক্য দেখা যায় শুধু তখন, যখন কেউ নিজে একটা নম্বর দিতে চায়। আর সেটা বাস্তবে হয়:
                পুরনো খাতা বা পুরনো System থেকে Data আনার সময়, যেখানে প্রতিটা Customer এর নম্বর আগে থেকেই ঠিক করা আর বদলানো যাবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GENERATED ALWAYS এ নিজে নম্বর দিলে"
              query={`${STAFF_SETUP}

-- DEFAULT লিখলে Identity নিজেই নম্বর দেয়
INSERT INTO ins_staff (staff_id, full_name, role)
VALUES (DEFAULT, 'Kalam Sheikh', 'driver')
RETURNING staff_id;

-- নিজে নম্বর দিলে?
INSERT INTO ins_staff (staff_id, full_name, role)
VALUES (10, 'Mitu Akter', 'marketing');`}
              caption={`প্রথম INSERT staff_id 4 ফেরত দেয়, কারণ 1 থেকে 3 আগের তিনজনের। দ্বিতীয়টায় ERROR: cannot insert a non-DEFAULT value into column "staff_id", DETAIL: Column "staff_id" is an identity column defined as GENERATED ALWAYS, HINT: Use OVERRIDING SYSTEM VALUE to override। SQLSTATE 428C9। ALWAYS মানে ঠিক তাই: নম্বর সবসময় Database দেবে।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HINT নিজেই পথ বলে দিচ্ছে: <code className={CODE}>OVERRIDING SYSTEM VALUE</code>। Column এর তালিকার পরে, VALUES এর আগে এই
                দুই শব্দ লিখলে PostgreSQL আপনার দেওয়া নম্বর মেনে নেয়। এটা জেনেবুঝে দেওয়া একটা ছাড়, যাতে কেউ ভুল করে নম্বর না পাঠায়, কিন্তু
                Migration এর মতো কাজ আটকে না থাকে। আর এখানেই একটা পরিচিত ফাঁদ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OVERRIDING SYSTEM VALUE, তারপর ধাক্কা"
              query={`${STAFF_SETUP}

-- পুরনো খাতা থেকে আসা কর্মী, তাঁর নম্বর 4 রাখতেই হবে
INSERT INTO ins_staff (staff_id, full_name, role)
OVERRIDING SYSTEM VALUE
VALUES (4, 'Kalam Sheikh', 'driver');

SELECT staff_id, full_name, role FROM ins_staff ORDER BY staff_id;

-- এবার সাধারণ একটা INSERT, নম্বর ছাড়া
INSERT INTO ins_staff (full_name, role)
VALUES ('Mitu Akter', 'marketing');`}
              caption={`প্রথম INSERT ঢোকে, SELECT এ চারজন, Kalam Sheikh এর নম্বর 4। তারপর সাধারণ INSERT এ ERROR: duplicate key value violates unique constraint "ins_staff_pkey", DETAIL: Key (staff_id)=(4) already exists। Identity এর Sequence জানেই না যে 4 কেউ হাতে বসিয়েছে, সে নিজের হিসাবে 3 এর পরে 4 দিয়েছে। একই Session এ আরেকবার চালালে 5 পাবে, কারণ এই ব্যর্থ চেষ্টাটা 4 খরচ করে ফেলেছে।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা নম্বর হাতে দিলে একবার ধাক্কা। পুরনো System থেকে এক হাজার Customer তাঁদের নম্বরসহ আনলে পরের এক হাজার সাধারণ INSERT একে
                একে ব্যর্থ হবে, যতক্ষণ না Sequence 1000 পার হয়। তাই নম্বরসহ Data আনার পরে সবসময় Sequence কে সবচেয়ে বড় নম্বরের পরে সরিয়ে
                দিতে হয়, setval দিয়ে। সেটা কীভাবে, এই মডিউলের{" "}
                <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                  Sequences লেসনে
                </Link>{" "}
                পুরোটা।
              </ContentParagraph>
              <ContentParagraph>
                BY DEFAULT এ ছাড়টা চাইতেই হয় না: নিজে নম্বর দিলে সে চুপচাপ মেনে নেয়। শুনতে আরামের, কিন্তু ফাঁদটা তাতে আরও লুকানো, কারণ
                কোনো HINT ই আসে না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="BY DEFAULT চুপচাপ মেনে নেয়"
              query={`DROP TABLE IF EXISTS ins_drivers;
CREATE TABLE ins_drivers (
  driver_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL
);

-- BY DEFAULT: নিজের দেওয়া নম্বর কোনো প্রশ্ন ছাড়াই
INSERT INTO ins_drivers (driver_id, full_name)
VALUES (1, 'Babul Das'), (2, 'Habib Rahman');

-- এবার নম্বর ছাড়া
INSERT INTO ins_drivers (full_name) VALUES ('Kalam Sheikh');`}
              caption={`প্রথম INSERT 2, কোনো আপত্তি নেই। দ্বিতীয়টায় ERROR: duplicate key value violates unique constraint "ins_drivers_pkey", DETAIL: Key (driver_id)=(1) already exists। Sequence তখনো একবারও ব্যবহার হয়নি, তাই সে দিয়েছে 1। এই কারণেই নতুন Table এ GENERATED ALWAYS ভালো: ভুল করে নম্বর পাঠানো কোড প্রথম দিনেই Error দেয়।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "OVERRIDING USER VALUE: উল্টো ছাড়",
          content: (
            <ContentParagraph>
              আরেকটা রূপ আছে, <code className={CODE}>OVERRIDING USER VALUE</code>: এটা Database কে বলে আপনার দেওয়া নম্বর উপেক্ষা
              করে Sequence থেকে নতুন নম্বর বসাতে। Docs এর উদাহরণ, এক Table এর সব Row আরেকটায় কপি করা, যেখানে নতুন Table নিজের নম্বর দেবে:{" "}
              <code className={CODE}>INSERT INTO tbl2 OVERRIDING USER VALUE SELECT * FROM tbl1;</code>। তবে এখানেও তালিকা ছাড়া SELECT *,
              তাই দুটো Table এর Column এর ক্রম হুবহু এক হতে হবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "values-and-quotes",
      subHeader: { index: "010", title: "Values: Quotes, NULL and Types" },
      title: <SectionTitle>মান লেখার নিয়ম: Quote, NULL আর Type</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VALUES এর ভেতরে প্রতিটা মান একটা Literal, মানে সরাসরি লেখা মান। কোনটা কীভাবে লিখবেন, এর অনেকটা আপনি Module 03 আর 04 এ
                দেখেছেন। INSERT এ ভুলগুলোর দাম বেশি, কারণ ভুল মান এবার শুধু ফলাফলে দেখানো হয় না, Table এ থেকে যায়। ছয়টা নিয়ম:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেখা যায় Single Quote এ:</strong> <code className={CODE}>{"'Sylhet'"}</code>। Double Quote নাম বোঝায়, মান না।
                </ListItem>
                <ListItem>
                  <strong>লেখার ভেতরে Apostrophe থাকলে দুবার:</strong>{" "}
                  <code className={CODE}>{"'Cox''s Bazar'"}</code>। নমুনা Database এর ফাইলেও ঠিক এভাবে লেখা।
                </ListItem>
                <ListItem>
                  <strong>সংখ্যা Quote ছাড়া:</strong> <code className={CODE}>150.50</code>। দশমিক বিন্দু দিয়ে, কমা দিয়ে না।
                </ListItem>
                <ListItem>
                  <strong>তারিখ আর সময় Quote এ, ISO ক্রমে:</strong> <code className={CODE}>{"'2026-12-01'"}</code>, সময়সহ হলে{" "}
                  <code className={CODE}>{"'2026-11-01 10:30:00+06'"}</code>। Column এর Type জানা থাকায় PostgreSQL নিজেই পড়ে নেয়, চাইলে
                  সামনে <code className={CODE}>DATE</code> লিখে স্পষ্ট করতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>NULL Quote ছাড়া:</strong> <code className={CODE}>NULL</code> মানে অজানা।{" "}
                  <code className={CODE}>{"'NULL'"}</code> মানে চার অক্ষরের একটা লেখা, আর <code className={CODE}>{"''"}</code> মানে ফাঁকা
                  লেখা। তিনটা আলাদা জিনিস।
                </ListItem>
                <ListItem>
                  <strong>boolean:</strong> <code className={CODE}>true</code>, <code className={CODE}>false</code>, আর PostgreSQL{" "}
                  <code className={CODE}>{"'yes'"}</code>, <code className={CODE}>{"'no'"}</code> এর মতো লেখাও মেনে নেয় (
                  <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                    Module 09
                  </Link>
                  )।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Apostrophe, NULL, 'NULL' আর ফাঁকা লেখা"
              query={`DROP TABLE IF EXISTS ins_places;
CREATE TABLE ins_places (
  name     text NOT NULL,
  opens_on date,
  fee_bdt  numeric(8, 2),
  note     text,
  is_open  boolean
);

INSERT INTO ins_places (name, opens_on, fee_bdt, note, is_open)
VALUES
  ('Cox''s Bazar Marine Drive', DATE '2026-11-01', 0, NULL, true),
  ('Saint Martin''s Chera Dwip', '2026-12-01', 150.50, 'NULL', 'yes'),
  ('Ratargul Watch Tower', NULL, 50, '', false);

SELECT name, opens_on, fee_bdt, note,
       note IS NULL AS note_is_null,
       is_open
FROM ins_places;`}
              caption="তিনটা Row। নামে একটাই Apostrophe দেখা যায়, দুবার লেখাটা শুধু SQL এর ভেতরে। fee_bdt 0.00, 150.50, 50.00, কারণ Column এর scale 2। এবার note দেখুন: প্রথম Row এ আসল NULL, বক্সে হালকা বাঁকা অক্ষরে; দ্বিতীয় Row এ লেখা NULL, সাধারণ অক্ষরে, আর note_is_null f; তৃতীয় Row এ ফাঁকা লেখা, তাও f। 'yes' হয়ে গেছে t।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "'NULL' লেখা কোথা থেকে আসে",
          content: (
            <ContentParagraph>
              বাস্তবে <code className={CODE}>{"'NULL'"}</code> লেখা প্রায়ই আসে CSV বা Excel থেকে, যেখানে ফাঁকা ঘরে কেউ NULL লিখে রেখেছিল, অথবা এমন কোড থেকে যে null কে
              লেখায় বদলে SQL বানায়। পরে <code className={CODE}>WHERE phone IS NULL</code> সেই Row খুঁজে পায় না, আর রিপোর্টে আসে আজব
              সংখ্যা। চোখে দেখে ধরা কঠিন, তাই সন্দেহ হলে <code className={CODE}>{"WHERE note = 'NULL'"}</code> দিয়ে খুঁজুন। আর এমন ফাইল
              Load করার নিরাপদ পথ{" "}
              <Link href="/sql/topic/bulk-loading" className={LINK}>
                Bulk Loading লেসনে
              </Link>
              , যেখানে COPY কে বলে দেওয়া যায় কোন লেখাটা আসলে NULL।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "booking-with-payment",
      subHeader: { index: "011", title: "A Booking and Its Payment Together" },
      title: <SectionTitle>Booking আর তার Payment, একসাথে নয়তো একটাও না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের দ্বিতীয় প্রশ্ন। Customer bKash এ টাকা দিলেন, এখন দুটো Row লাগবে: bookings এ একটা, payments এ একটা। Payment
                এর booking_id তে বসবে নতুন Booking এর নম্বর, যেটা আগে থেকে কেউ জানে না। আর দুটোর মাঝখানে কিছু ভাঙলে, ধরুন Server বন্ধ হয়ে
                গেল বা Payment এর method এ বানান ভুল, একটা থেকে যাবে আর অন্যটা না। দুটো সমস্যা: নম্বরটা এক INSERT থেকে আরেকটায় নেওয়া, আর
                দুটোকে একটা অবিভাজ্য কাজ বানানো।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ দুটোর সমাধান একসাথে দেয় WITH এর ভেতরের INSERT।{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  Module 07 এ CTE
                </Link>{" "}
                ছিল শুধু SELECT। কিন্তু WITH এর ভেতরে INSERT ও লেখা যায়, আর তার RETURNING হয়ে যায় একটা ছোট Table, পরের অংশ যেটা থেকে SELECT
                করতে পারে। পুরোটা একটাই Statement, তাই হয় সব, নয়তো কিছুই না। একে বলে Data-modifying CTE।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking আর Payment এক Statement এ"
              query={`BEGIN;

WITH new_booking AS (
  INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
  VALUES (15, 12, 2, 'confirmed', 19000.00)
  RETURNING booking_id, total_bdt
)
INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
SELECT booking_id, total_bdt, 'bkash', 'paid', TIMESTAMPTZ '2026-11-01 10:30:00+06'
FROM new_booking
RETURNING payment_id, booking_id, amount_bdt, method;

SELECT b.booking_id, c.full_name, b.seats, b.status, p.amount_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN payments p ON p.booking_id = b.booking_id
WHERE c.full_name = 'Imran Kabir';

ROLLBACK;

SELECT (SELECT count(*) FROM bookings) AS bookings,
       (SELECT count(*) FROM payments) AS payments;`}
              caption="Imran Kabir, যাঁর এতদিন কোনো Booking ছিল না, Sajek এর Departure 12 এ দুটো সিট নিলেন। পাতা খোলার পরে এটাই প্রথম Booking হলে RETURNING দেয় payment_id 20, booking_id 25, 19000.00, bkash, আর দ্বিতীয় SELECT এ Imran এর Booking আর Payment পাশাপাশি। তারপর ROLLBACK, তাই শেষে আবার bookings 24, payments 19। আবার Run চাপলে নম্বর বেড়ে যায়, প্রথমবারের ঠিক পরে চাপলে 26 আর 21: ROLLBACK Row ফেরায়, নম্বর না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বক্সে BEGIN আর ROLLBACK কেন? শুধু এই পাতার জন্য: আসল bookings আর payments এ লিখে সাথে সাথে মুছে দিতে, যাতে পরের বক্সগুলো
                এখনো 24 আর 19 দেখে। আসল Website এ শেষ লাইনটা হতো COMMIT। আর খেয়াল করুন, Data-modifying CTE নিজেই এক Statement, তাই BEGIN
                ছাড়াও সেটা সব বা কিছুই না। BEGIN লাগে যখন কাজটা কয়েকটা আলাদা Statement এ ভাগ করা, যেমন App এর কোডে প্রথম INSERT এর
                RETURNING পড়ে তারপর দ্বিতীয় INSERT পাঠানো। সেই ধরন দেখবেন এই লেসনের App অংশে, আর Transaction এর পুরো বিজ্ঞান{" "}
                <Link href="/sql/topic/transactions-basics" className={LINK}>
                  Module 12 এ
                </Link>
                ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "WITH এর সব অংশ একই ছবি দেখে",
          content: (
            <ContentParagraph>
              PostgreSQL এর Docs বলে WITH এর ভেতরের সব অংশ একই Snapshot এ চলে: একটা অংশ আরেকটার করা বদল Table থেকে পড়ে দেখতে পায় না।
              নতুন Booking এর তথ্য পেতে তাই bookings Table থেকে SELECT করলে চলবে না, পড়তে হবে new_booking থেকে, মানে RETURNING এর ফল
              থেকে। এই লেসনের উদাহরণগুলো ঠিক তাই করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  Starter Query দুটো অনুশীলনের Table বানায়, <code className={CODE}>ins_ex5_bookings</code> আর{" "}
                  <code className={CODE}>ins_ex5_payments</code>, আর আসল ২৪টা Booking আর ১৯টা Payment সেখানে কপি করে, একই নম্বরে।
                  মন্তব্যের জায়গায় <strong>একটা Statement</strong> লিখুন যা Customer 15 এর জন্য Departure 12 এ 2 সিটের একটা confirmed
                  Booking লেখে, total_bdt 19000.00, আর সাথে তার Payment: একই টাকা, method bkash, status paid, paid_at{" "}
                  <code className={CODE}>2026-11-01 10:30:00+06</code>। Payment এর booking_id যেন নতুন Booking এর নম্বরটাই হয়, হাতে লেখা
                  সংখ্যা না।
                </>
              }
              hint={
                <>
                  <code className={CODE}>WITH new_booking AS (INSERT INTO ins_ex5_bookings ... RETURNING booking_id, total_bdt)</code>{" "}
                  তারপর <code className={CODE}>INSERT INTO ins_ex5_payments (...) SELECT booking_id, total_bdt, ... FROM new_booking;</code>।
                  সময়ের মান <code className={CODE}>{"TIMESTAMPTZ '2026-11-01 10:30:00+06'"}</code>।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ex5_payments, ins_ex5_bookings;
CREATE TABLE ins_ex5_bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL,
  departure_id integer NOT NULL,
  seats        smallint NOT NULL CHECK (seats > 0),
  status       text NOT NULL,
  total_bdt    numeric(10, 2) NOT NULL
);
CREATE TABLE ins_ex5_payments (
  payment_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES ins_ex5_bookings (booking_id),
  amount_bdt numeric(10, 2) NOT NULL,
  method     text NOT NULL,
  status     text NOT NULL,
  paid_at    timestamptz NOT NULL
);
INSERT INTO ins_ex5_bookings (customer_id, departure_id, seats, status, total_bdt)
SELECT customer_id, departure_id, seats, status, total_bdt
FROM bookings
ORDER BY booking_id;
INSERT INTO ins_ex5_payments (booking_id, amount_bdt, method, status, paid_at)
SELECT booking_id, amount_bdt, method, status, paid_at
FROM payments
ORDER BY payment_id;

-- এখানে একটা Statement এ Booking আর তার Payment লিখুন

SELECT b.booking_id, b.customer_id, b.seats, b.total_bdt,
       p.payment_id, p.amount_bdt, p.method
FROM ins_ex5_bookings b
JOIN ins_ex5_payments p ON p.booking_id = b.booking_id
WHERE b.customer_id = 15;`}
              solution={`SELECT * FROM (VALUES
  (25, 15, 2, 19000.00, 20, 19000.00, 'bkash')
) AS v(booking_id, customer_id, seats, total_bdt, payment_id, amount_bdt, method);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "from-application",
      subHeader: { index: "012", title: "INSERT from Application Code" },
      title: <SectionTitle>App এর কোড থেকে INSERT</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Website এর Form থেকে আসা নাম, email, সিটের সংখ্যা কখনো সরাসরি SQL লেখার সাথে জোড়া লাগাবেন না। ধরুন কোড লেখে{" "}
                <code className={CODE}>{"\"... VALUES ('\" + name + \"')\""}</code>, আর কেউ নামের ঘরে লিখল এমন কিছু যাতে একটা Quote আর
                তারপর অন্য SQL আছে। তখন সেই লেখা আপনার SQL এর অংশ হয়ে যায়, আর Database অচেনা মানুষের লেখা কমান্ড চালায়। একে বলে SQL
                Injection, পুরো গল্প{" "}
                <Link href="/sql/topic/sql-injection" className={LINK}>
                  Module 16 এ
                </Link>
                । ছোট উদাহরণও আছে: {"Cox's"} Bazar এর মতো একটা নির্দোষ Apostrophe ই তখন SQL ভেঙে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                সঠিক পথ Parameter: SQL এর লেখায় মানের জায়গায় <code className={CODE}>$1</code>, <code className={CODE}>$2</code> এর মতো
                চিহ্ন, আর মানগুলো আলাদা একটা তালিকায়। Driver দুটো আলাদা পাঠায়, তাই মান কখনো SQL হয়ে ওঠে না। Node.js এর{" "}
                <code className={CODE}>pg</code> Package এর Docs এর ধরনে একটা Booking আর তার Payment, এক Transaction এ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "save-booking.mjs (Module 17 এ নিজের মেশিনে চালাবেন)",
          code: `import pg from 'pg';

// Connection এর ঠিকানা আসে Environment Variable থেকে, কোডে লেখা থাকে না।
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new pg.Pool({ connectionString: databaseUrl });

export async function saveBooking({ customerId, departureId, seats, method }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // দাম Form থেকে নয়, Database এর tours থেকে হিসাব হয়
    const booking = await client.query(
      \`INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
       SELECT $1, d.departure_id, $3::smallint, 'confirmed', t.price_bdt * $3::smallint
       FROM departures d
       JOIN tours t ON t.tour_id = d.tour_id
       WHERE d.departure_id = $2
       RETURNING booking_id, total_bdt\`,
      [customerId, departureId, seats]
    );
    if (booking.rowCount === 0) {
      throw new Error(\`Departure \${departureId} does not exist\`);
    }
    const { booking_id: bookingId, total_bdt: totalBdt } = booking.rows[0];

    await client.query(
      \`INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
       VALUES ($1, $2, $3, 'paid', now())\`,
      [bookingId, totalBdt, method]
    );

    await client.query('COMMIT');
    return bookingId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই কোডের পাঁচটা সিদ্ধান্ত এই লেসনেরই শিক্ষা। Column এর তালিকা সবসময় লেখা। নতুন নম্বর আসে RETURNING থেকে, max থেকে না।
                দুটো INSERT একই <code className={CODE}>client</code> এ, BEGIN আর COMMIT এর মাঝে, কিছু ভাঙলে ROLLBACK; node-postgres এর
                Docs ও সতর্ক করে যে Transaction এর জন্য pool.query না, একটা নির্দিষ্ট client লাগে, কারণ pool.query প্রতিবার যেকোনো খালি
                Connection নেয়। দাম Form থেকে বিশ্বাস করা হয়নি, INSERT ... SELECT দিয়ে tours থেকে হিসাব করা, নইলে কেউ ব্রাউজারে দাম 1 টাকা
                করে পাঠাতে পারত। আর Departure না থাকলে SELECT কোনো Row দেয় না, INSERT 0 0 হয়, তাই rowCount দেখে Error।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>$3::smallint</code> এর Cast টা কেন? একই Parameter দুই জায়গায়: seats এ, যার Type smallint, আর দামের
                গুণে, যেখানে PostgreSQL numeric ভাবে। Cast না দিলে PostgreSQL সিদ্ধান্ত নিতে পারে না। আমরা psql এ PREPARE দিয়ে Cast ছাড়া
                রূপটা চালিয়েছিলাম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: একই Parameter, দুই রকম Type",
          code: `PREPARE save_booking AS
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
SELECT $1, d.departure_id, $3, 'confirmed', t.price_bdt * $3
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.departure_id = $2
RETURNING booking_id, total_bdt;
ERROR:  inconsistent types deduced for parameter $3
LINE 3: SELECT $1, d.departure_id, $3, 'confirmed', t.price_bdt * $3
                                   ^
DETAIL:  numeric versus smallint

-- দুই জায়গায় $3::smallint লেখার পরে PREPARE চলে, আর
-- নেই এমন Departure (999) দিয়ে EXECUTE করলে উত্তর আসে INSERT 0 0`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেকগুলো Row একসাথে পাঠাতে হলে, ধরুন একটা ট্যুরের দশটা Tag, প্রতিটার জন্য আলাদা Parameter বানানো ঝামেলার। PostgreSQL এর
                একটা পরিচিত কৌশল: প্রতিটা Column এর মানগুলো একটা করে Array তে পাঠানো, আর <code className={CODE}>unnest</code> দিয়ে সেগুলো
                পাশাপাশি খুলে Row বানানো। App থেকে তখন Parameter মাত্র দুটো, Row যতই হোক। Array নিয়ে বিস্তারিত{" "}
                <Link href="/sql/topic/arrays" className={LINK}>
                  Module 15 এ
                </Link>
                , এখানে শুধু Literal দিয়ে আকারটা দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অনেক Row, দুটো Array থেকে"
              query={`DROP TABLE IF EXISTS ins_tour_tags;
CREATE TABLE ins_tour_tags (
  tag_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id integer NOT NULL REFERENCES tours (tour_id),
  tag     text NOT NULL
);

-- একই অবস্থানের দুটো মান একই Row এ বসে
INSERT INTO ins_tour_tags (tour_id, tag)
SELECT *
FROM unnest(ARRAY[1, 1, 3, 4], ARRAY['island', 'snorkeling', 'mangrove', 'clouds'])
RETURNING tag_id, tour_id, tag;`}
              caption="চারটা Row ফেরত: (1, 1, island), (2, 1, snorkeling), (3, 3, mangrove), (4, 4, clouds)। প্রথম Array এর প্রথম মান আর দ্বিতীয় Array এর প্রথম মান মিলে প্রথম Row। App এর কোডে দুটো Array হতো দুটো Parameter: $1::integer[] আর $2::text[]।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ INSERT কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মূল আকার দুই জায়গায় এক: Column এর তালিকা, VALUES এ এক বা অনেক Row, INSERT ... SELECT, DEFAULT শব্দ। আপনি যে MySQL Course
                দেখছেন সেখানেও এগুলো একই রকম দেখবেন। পার্থক্যগুলো বেশিরভাগ নতুন নম্বর ফেরত পাওয়া আর ভুল সামলানো নিয়ে। নিচের প্রতিটা
                Output আমাদের mysql:8.4 Container এ (8.4.11) নমুনা Database Load করে চালানো, mysql Client এর verbose রূপে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>এক, RETURNING নেই।</strong> MySQL 8.4 এ INSERT এর শেষে RETURNING লিখলে Syntax Error। নতুন নম্বর জানার পথ{" "}
                <code className={CODE}>LAST_INSERT_ID()</code>, যেটা প্রতিটা Connection এর জন্য আলাদা মনে রাখা হয়, তাই অন্য কারো INSERT এ
                বদলায় না, ঠিক PostgreSQL এর currval এর মতো। দুটো খুঁটিনাটি জানা জরুরি: অনেক Row একসাথে ঢোকালে এটা দেয় প্রথম Row এর নম্বর,
                শেষেরটার না; আর নিজে নম্বর দিয়ে ঢোকালে এটা বদলায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: LAST_INSERT_ID()",
          code: `mysql> INSERT INTO ins_customers (full_name, email, city)
    -> VALUES ('Rafiq Islam', 'rafiq.islam@mail.example', 'Dhaka');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT LAST_INSERT_ID();
+------------------+
| LAST_INSERT_ID() |
+------------------+
|                1 |
+------------------+

mysql> INSERT INTO ins_customers (full_name, email, city)
    -> VALUES ('Nadia Karim', 'nadia.karim@mail.example', 'Sylhet'),
    ->        ('Joy Barua', 'joy.barua@mail.example', 'Chattogram'),
    ->        ('Tisha Roy', 'tisha.roy@mail.example', 'Khulna');
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT LAST_INSERT_ID();      -- 4 না, 2: তিনটার প্রথমটা
+------------------+
| LAST_INSERT_ID() |
+------------------+
|                2 |
+------------------+

mysql> INSERT INTO ins_customers (full_name, email, city) VALUES ('Ret Test', 'ret@mail.example', 'Dhaka')
    -> RETURNING customer_id;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds
to your MySQL server version for the right syntax to use near 'RETURNING customer_id' at line 1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>দুই, Booking আর Payment এর জন্য নম্বর আগে Variable এ রাখুন।</strong> Payment ঢোকার সাথে সাথে LAST_INSERT_ID() হয়ে
              যায় Payment এর নম্বর। পরে আবার Booking এর নম্বর লাগলে সেটা হারিয়ে গেছে। তাই অভ্যাস: Booking এর পরেই{" "}
              <code className={CODE}>SET @booking_id = LAST_INSERT_ID();</code>। নিচের Output এ নম্বর 26 আর 21, কারণ এর আগে একই Container
              এ একটা ROLLBACK করা চেষ্টা 25 আর 20 খরচ করেছিল। MySQL ও ROLLBACK এ নম্বর ফেরত দেয় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: Booking আর Payment, এক Transaction এ",
          code: `mysql> START TRANSACTION;
mysql> INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
    -> VALUES (15, 12, 2, 'confirmed', 19000.00);
Query OK, 1 row affected (0.01 sec)

mysql> SET @booking_id = LAST_INSERT_ID();
mysql> INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
    -> VALUES (@booking_id, 19000.00, 'bkash', 'paid', '2026-11-01 10:30:00');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @booking_id AS booking_id, LAST_INSERT_ID() AS last_insert_id;
+------------+----------------+
| booking_id | last_insert_id |
+------------+----------------+
|         26 |             21 |
+------------+----------------+

mysql> ROLLBACK;
mysql> SELECT COUNT(*) AS bookings FROM bookings;
+----------+
| bookings |
+----------+
|       24 |
+----------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>তিন, DEFAULT VALUES নেই।</strong> সব Column DEFAULT দিয়ে ভরতে MySQL এ লেখা হয়{" "}
                <code className={CODE}>{"INSERT INTO t () VALUES ();"}</code>, খালি তালিকা আর খালি VALUES। MySQL এর{" "}
                <code className={CODE}>INSERT ... SET column = value</code> রূপও আছে, যেখানে প্রতিটা মান তার Column এর নামের পাশে লেখা।
                PostgreSQL এ এই রূপ নেই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>চার, তালিকা ছাড়া INSERT এ MySQL কড়া।</strong> PostgreSQL কম মান পেলে প্রথম কয়েকটা Column ধরে নেয়, MySQL এর Manual
                বলে তালিকা না থাকলে প্রতিটা Column এর মান দিতেই হবে। আর MySQL এ ALTER TABLE ... ADD COLUMN ... AFTER দিয়ে মাঝখানে Column বসে।
                দুটো মিলে এই লেসনের শুরুর গল্পটা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: DEFAULT VALUES, () VALUES (), আর মাঝখানে নতুন Column",
          code: `mysql> INSERT INTO ins_visits DEFAULT VALUES;
ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'DEFAULT VALUES' at line 1

mysql> INSERT INTO ins_visits () VALUES ();
Query OK, 1 row affected (0.01 sec)

mysql> ALTER TABLE ins_guides ADD COLUMN language VARCHAR(20) NOT NULL DEFAULT 'Bangla' AFTER full_name;
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO ins_guides VALUES ('Tania Akter', '+8801000000207');
ERROR 1136 (21S01): Column count doesn't match value count at row 1

mysql> INSERT INTO ins_guides VALUES ('Tania Akter', '+8801000000207', 'English');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM ins_guides;
+-------------+----------------+----------------+
| full_name   | language       | phone          |
+-------------+----------------+----------------+
| Mahfuz Alam | Bangla         | +8801000000206 |
| Tania Akter | +8801000000207 | English        |
+-------------+----------------+----------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>পাঁচ, এক Statement এ সব বা কিছুই না, MySQL এও।</strong> InnoDB Table এ, Strict Mode চালু থাকলে (8.4 এ এটাই
                Default), তিনটা Row এর একটায় CHECK বা UNIQUE ভাঙলে একটা Row ও থাকে না। AUTO_INCREMENT এর নম্বরও খরচ হয়, PostgreSQL এর মতোই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ছয়, INSERT IGNORE: সাবধান।</strong> IGNORE লিখলে MySQL Error কে Warning বানিয়ে দেয়: খারাপ Row গুলো চুপচাপ বাদ,
                ভালোগুলো ঢোকে, আর উত্তর আসে Query OK। Manual বলে Type এর ভুলে IGNORE মানটাকে কাছাকাছি একটা মানে বদলে ঢুকিয়েও দেয়। শুনতে
                সুবিধার, কিন্তু কোন Row কেন বাদ গেল সেটা শুধু SHOW WARNINGS জানে, আর কেউ সাধারণত দেখে না। ডুপ্লিকেট বাদ দেওয়ার পরিষ্কার পথ
                Upsert লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: একটা খারাপ Row, আর INSERT IGNORE",
          code: `mysql> CREATE TABLE ins_tags (tag_id INT AUTO_INCREMENT PRIMARY KEY,
    ->   tag VARCHAR(20) NOT NULL UNIQUE, seats INT NOT NULL CHECK (seats > 0));

mysql> INSERT INTO ins_tags (tag, seats) VALUES ('island', 1), ('beach', 0), ('hills', 2);
ERROR 3819 (HY000): Check constraint 'ins_tags_chk_1' is violated.

mysql> SELECT COUNT(*) FROM ins_tags;          -- 0: island ও থাকেনি

mysql> INSERT IGNORE INTO ins_tags (tag, seats)
    -> VALUES ('island', 1), ('island', 2), ('hills', 2), ('beach', 0);
Query OK, 2 rows affected, 2 warnings (0.02 sec)
Records: 3  Duplicates: 1  Warnings: 2

mysql> SHOW WARNINGS;
+---------+------+-------------------------------------------------+
| Level   | Code | Message                                         |
+---------+------+-------------------------------------------------+
| Warning | 1062 | Duplicate entry 'island' for key 'ins_tags.tag' |
| Warning | 3819 | Check constraint 'ins_tags_chk_1' is violated.  |
+---------+------+-------------------------------------------------+

mysql> SELECT * FROM ins_tags;   -- নম্বর 7 আর 8: আগের ব্যর্থ চেষ্টাগুলো 1 থেকে 6 খেয়েছে
+--------+--------+-------+
| tag_id | tag    | seats |
+--------+--------+-------+
|      7 | island |     1 |
|      8 | hills  |     2 |
+--------+--------+-------+`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["নতুন নম্বর ফেরত", "INSERT ... RETURNING id", "LAST_INSERT_ID(), প্রতি Connection আলাদা"],
            ["অনেক Row এর পরে নম্বর", "RETURNING সব Row দেয়", "LAST_INSERT_ID() দেয় প্রথম Row এর নম্বর"],
            ["সব DEFAULT এর একটা Row", "INSERT INTO t DEFAULT VALUES", "INSERT INTO t () VALUES ()"],
            ["তালিকা ছাড়া কম মান", "প্রথম কয়টা Column ধরে নেয়", "ERROR 1136"],
            ["Identity তে নিজের নম্বর", "ALWAYS এ OVERRIDING SYSTEM VALUE লাগে", "AUTO_INCREMENT সবসময় মেনে নেয়"],
            ["Error কে উপেক্ষা", "নেই; ON CONFLICT DO NOTHING শুধু Unique এর জন্য", "INSERT IGNORE, সব ধরনের Error কে Warning"],
            ["Booking আর Payment এক Statement এ", "WITH ... INSERT ... RETURNING", "নেই; Transaction আর @variable"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours: Website এর প্রথম Booking</SectionTitle>,
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
                এবার পুরো ঘটনাটা, Form জমা হওয়া থেকে Booking নম্বর দেখানো পর্যন্ত। Sylhet এর Nadia Karim আগে কখনো Island Tours এ আসেননি।
                তিনি Form এ নাম, email, ফোন আর শহর লিখলেন, 14 November এর Sylhet Tea Garden Tour এ (Departure 14) তিনটা সিট বাছলেন, আর Nagad
                এ টাকা দিলেন। Database কে চারটা কাজ করতে হবে: নতুন Customer লেখা, তাঁর নম্বর দিয়ে Booking লেখা, Booking এর নম্বর দিয়ে
                Payment লেখা, আর Departure এর খালি সিট তিনটা কমানো। টাকার অঙ্ক Form থেকে নেওয়া চলবে না, ট্যুরের দাম থেকে হিসাব হবে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম তিনটা কাজ একটা Data-modifying CTE এর তিন ধাপ, প্রতিটা নিজের নতুন নম্বর পরের ধাপকে দেয়। চতুর্থটা একটা UPDATE, যেটা
                পুরোপুরি শিখবেন{" "}
                <Link href="/sql/topic/update" className={LINK}>
                  পরের লেসনে
                </Link>
                ; এখানে শুধু ঝলক। সব একটা BEGIN এর ভেতরে। আসল Website এ শেষে COMMIT, এই পাতায় ROLLBACK।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BookingChainDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Signup, Booking, Payment আর সিট, এক Transaction এ"
              query={`BEGIN;

WITH new_customer AS (
  INSERT INTO customers (full_name, email, phone, city)
  VALUES ('Nadia Karim', 'nadia.karim@mail.example', '+8801000000116', 'Sylhet')
  RETURNING customer_id
),
new_booking AS (
  INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
  SELECT nc.customer_id, d.departure_id, 3, 'confirmed', t.price_bdt * 3
  FROM new_customer nc
  CROSS JOIN departures d
  JOIN tours t ON t.tour_id = d.tour_id
  WHERE d.departure_id = 14
  RETURNING booking_id, customer_id, total_bdt
)
INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
SELECT booking_id, total_bdt, 'nagad', 'paid', TIMESTAMPTZ '2026-11-01 11:00:00+06'
FROM new_booking
RETURNING payment_id, booking_id, amount_bdt;

-- পরের লেসনের ঝলক: খালি সিট কমানো
UPDATE departures
SET seats_left = seats_left - 3
WHERE departure_id = 14
RETURNING departure_id, seats_left;

SELECT c.customer_id, c.full_name, c.country, b.booking_id, b.seats,
       b.total_bdt, p.payment_id, p.method
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
JOIN payments p ON p.booking_id = b.booking_id
WHERE c.email = 'nadia.karim@mail.example';

ROLLBACK;

SELECT (SELECT count(*) FROM customers) AS customers,
       (SELECT count(*) FROM bookings) AS bookings,
       (SELECT seats_left FROM departures WHERE departure_id = 14) AS seats_left;`}
              caption="Sylhet Tea Garden Tour এর দাম 7800.00, তিন সিটে 23400.00, Database নিজে হিসাব করেছে। পাতা খোলার পরে এটাই প্রথম INSERT হলে নম্বরগুলো customer_id 16, booking_id 25, payment_id 20; উপরের Booking বক্সটা আগে চালিয়ে থাকলে Booking 26 আর Payment 21। UPDATE দেখায় seats_left 18, 21 থেকে তিন কম। শেষ SELECT এ Nadia র দেশ Bangladesh, DEFAULT থেকে। ROLLBACK এর পরে customers 15, bookings 24, seats_left আবার 21।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা প্রশ্ন জাগা উচিত: খালি সিট যদি 2 থাকত আর Nadia 3 টা চাইতেন? departures এর CHECK (seats_left &gt;= 0) UPDATE
                টা আটকাত, আর Transaction এর বাকি সব বাতিল হতো। ভালো। কিন্তু দুজন একই মুহূর্তে শেষ সিটটা চাইলে কী হয়, সেটা আরও সূক্ষ্ম
                প্রশ্ন, আর তার উত্তর{" "}
                <Link href="/sql/topic/double-booking" className={LINK}>
                  Module 12 এর Double Booking লেসনে
                </Link>
                । আপাতত মনে রাখুন: INSERT সঠিক লেখা এক জিনিস, একসাথে অনেকে লিখলে সঠিক থাকা আরেক জিনিস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  Starter Query তিনটা অনুশীলনের Table বানায়, <code className={CODE}>ins_ch_customers</code>,{" "}
                  <code className={CODE}>ins_ch_bookings</code> আর <code className={CODE}>ins_ch_payments</code>, আর আসল Customer, Booking
                  আর Payment সেখানে কপি করে, একই নম্বরে। <strong>একটা Statement</strong> লিখুন, তিন ধাপের WITH, যা Project Example এর
                  কাজটা এই Table গুলোতে করে: নতুন Customer Nadia Karim (<code className={CODE}>nadia.karim@mail.example</code>, Sylhet),
                  তাঁর Departure 14 এ 3 সিটের confirmed Booking, আর Nagad এর paid Payment, paid_at{" "}
                  <code className={CODE}>2026-11-01 11:00:00+06</code>। total_bdt আর Payment এর টাকা আসল tours এর দাম থেকে হিসাব করবেন,
                  সংখ্যা হাতে লিখবেন না। কোনো নম্বরও হাতে লিখবেন না, সব আসবে RETURNING থেকে।
                </>
              }
              hint={
                <>
                  Project Example এর বক্সটাই, শুধু তিনটা Table এর নাম বদলে <code className={CODE}>ins_ch_</code> দিয়ে। দাম আসে{" "}
                  <code className={CODE}>departures d JOIN tours t ON t.tour_id = d.tour_id</code> থেকে,{" "}
                  <code className={CODE}>WHERE d.departure_id = 14</code>। ins_ch_customers এ phone বা country নেই, তালিকা মিলিয়ে নিন।
                </>
              }
              starter={`DROP TABLE IF EXISTS ins_ch_payments, ins_ch_bookings, ins_ch_customers;
CREATE TABLE ins_ch_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  city        text NOT NULL
);
CREATE TABLE ins_ch_bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL REFERENCES ins_ch_customers (customer_id),
  departure_id integer NOT NULL REFERENCES departures (departure_id),
  seats        smallint NOT NULL CHECK (seats > 0),
  status       text NOT NULL,
  total_bdt    numeric(10, 2) NOT NULL
);
CREATE TABLE ins_ch_payments (
  payment_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES ins_ch_bookings (booking_id),
  amount_bdt numeric(10, 2) NOT NULL,
  method     text NOT NULL,
  status     text NOT NULL,
  paid_at    timestamptz NOT NULL
);
INSERT INTO ins_ch_customers (full_name, email, city)
SELECT full_name, email, city FROM customers ORDER BY customer_id;
INSERT INTO ins_ch_bookings (customer_id, departure_id, seats, status, total_bdt)
SELECT customer_id, departure_id, seats, status, total_bdt FROM bookings ORDER BY booking_id;
INSERT INTO ins_ch_payments (booking_id, amount_bdt, method, status, paid_at)
SELECT booking_id, amount_bdt, method, status, paid_at FROM payments ORDER BY payment_id;

-- এখানে আপনার এক Statement এর তিন ধাপের INSERT লিখুন

SELECT c.customer_id, c.full_name, b.booking_id, b.seats, b.total_bdt,
       p.payment_id, p.amount_bdt, p.method
FROM ins_ch_customers c
JOIN ins_ch_bookings b ON b.customer_id = c.customer_id
JOIN ins_ch_payments p ON p.booking_id = b.booking_id
WHERE c.email = 'nadia.karim@mail.example';`}
              solution={`SELECT 16, 'Nadia Karim', 25, 3, t.price_bdt * 3, 20, t.price_bdt * 3, 'nagad'
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.departure_id = 14;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা INSERT লেখার আগে, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Table এর গঠন দেখুন",
              description:
                "psql এ \\d table, বা information_schema.columns। কোন Column NOT NULL, কার DEFAULT আছে, কোনটা Identity, কোন CHECK আর Foreign Key আছে, লিখে ফেলুন।",
            },
            {
              title: "কোন Column আপনি ভরবেন, ঠিক করুন",
              description:
                "Identity আর DEFAULT এর Column সাধারণত বাদ। যার মান সত্যিই অজানা, সেটাও বাদ বা NULL। বাকিগুলো দিয়ে Column এর তালিকা।",
            },
            {
              title: "মানগুলো ঠিক Type আর Quote এ লিখুন",
              description:
                "লেখা Single Quote এ, Apostrophe দুবার, সংখ্যা Quote ছাড়া, তারিখ ISO ক্রমে, NULL Quote ছাড়া। App এর কোডে মান কখনো SQL এর লেখায় না, Parameter এ।",
            },
            {
              title: "মান কি অন্য Table থেকে আসবে?",
              description:
                "হলে VALUES না, INSERT ... SELECT। দাম, নাম, Total এর মতো তথ্য Database থেকে হিসাব করুন, বাইরে থেকে বিশ্বাস করবেন না। আবার চালানোর সম্ভাবনা থাকলে NOT EXISTS।",
            },
            {
              title: "নতুন নম্বর বা DEFAULT লাগবে? RETURNING",
              description:
                "পরের কাজে নতুন id লাগলে RETURNING, max(id) কখনো না। অনেক Row হলে RETURNING সবগুলোর নম্বর দেয়।",
            },
            {
              title: "একাধিক Table? এক Statement বা এক Transaction",
              description:
                "Booking আর Payment এর মতো জোড়া কাজ হয় Data-modifying CTE তে, নয়তো BEGIN আর COMMIT এর মাঝে, ভাঙলে ROLLBACK।",
            },
            {
              title: "চালিয়ে উত্তরটা পড়ুন",
              description:
                "INSERT 0 n এর n যা আশা করেছিলেন তাই কিনা। Error এলে SQLSTATE দেখুন: 23502, 23514, 23505, 23503 মানে কোন নিয়ম আটকাল, আর মনে রাখুন কিছুই ঢোকেনি।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবচেয়ে বেশি হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Column এর তালিকা না লেখা।</strong> আজ চলছে, কাল কেউ Table বদলালে মান ভুল ঘরে যাবে, আর একই Type এর দুটো Column
                  হলে কোনো Error ও আসবে না। সবসময় তালিকা।
                </ListItem>
                <ListItem>
                  <strong>নতুন নম্বর জানতে SELECT max(id)।</strong> দুজন একসাথে লিখলে একজন আরেকজনের নম্বর পায়, আমরা দুটো Session এ সেটাই
                  দেখেছি। RETURNING, MySQL এ LAST_INSERT_ID()।
                </ListItem>
                <ListItem>
                  <strong>DEFAULT চেয়ে NULL পাঠানো।</strong> Form এর খালি ঘর থেকে আসা null সোজা INSERT এ গেলে DEFAULT বসে না, NOT NULL হলে
                  23502। DEFAULT চাইলে Column টা বাদ দিন বা DEFAULT লিখুন।
                </ListItem>
                <ListItem>
                  <strong>NULL এর বদলে {"'NULL'"} বা ফাঁকা লেখা।</strong> দেখতে একই রকম, কিন্তু IS NULL খুঁজে পায় না। বক্সে আসল NULL হালকা বাঁকা
                  অক্ষরে দেখায়, লেখা NULL সাধারণ অক্ষরে।
                </ListItem>
                <ListItem>
                  <strong>Apostrophe একবার লেখা।</strong> <code className={CODE}>{"'Cox's Bazar'"}</code> লিখলে লেখা মাঝখানে শেষ হয়ে Syntax
                  Error। দুবার লিখুন, আর App এ Parameter ব্যবহার করুন, তখন এই সমস্যাই থাকে না।
                </ListItem>
                <ListItem>
                  <strong>ভাবা যে খারাপ Row বাদ দিয়ে বাকিগুলো ঢুকবে।</strong> এক Statement এর একটা Row ভাঙলে কিছুই ঢোকে না। বাকিগুলো দরকার
                  হলে খারাপটা ঠিক করে আবার চালান, অথবা Row আলাদা আলাদা Statement এ।
                </ListItem>
                <ListItem>
                  <strong>Identity নম্বরে ফাঁক দেখে ভয় পাওয়া, বা ফাঁক বন্ধ করতে চাওয়া।</strong> ব্যর্থ INSERT আর ROLLBACK নম্বর খায়,
                  এটাই স্বাভাবিক। ফাঁকহীন ক্রমিক নম্বর লাগলে সেটা আলাদা নকশা, Identity না।
                </ListItem>
                <ListItem>
                  <strong>হাতে নম্বর দিয়ে Data আনার পরে Sequence ঠিক না করা।</strong> OVERRIDING SYSTEM VALUE বা BY DEFAULT দিয়ে নম্বরসহ Row
                  আনার পরে প্রথম সাধারণ INSERT গুলো 23505 দেয়। setval দিয়ে Sequence এগিয়ে দিন, Sequences লেসনে যেমন দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>Booking আর Payment দুটো আলাদা Statement এ, Transaction ছাড়া।</strong> মাঝে কিছু ভাঙলে অর্ধেক কাজ থেকে যায়।
                  Data-modifying CTE, নয়তো BEGIN আর COMMIT।
                </ListItem>
                <ListItem>
                  <strong>দাম বা Total ব্রাউজার থেকে বিশ্বাস করা।</strong> Form এর লুকানো ঘর যে কেউ বদলাতে পারে। টাকার হিসাব INSERT ...
                  SELECT দিয়ে Database এর দাম থেকে।
                </ListItem>
                <ListItem>
                  <strong>MySQL এ INSERT IGNORE দিয়ে Error চাপা দেওয়া।</strong> শুধু ডুপ্লিকেট না, CHECK আর Type এর ভুলও চুপচাপ বাদ বা বদল
                  হয়ে যায়। Upsert লেসনের পথ নিন।
                </ListItem>
              </ContentList>
            </div>
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
                  <a href="https://www.postgresql.org/docs/current/sql-insert.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: INSERT
                  </a>
                  : পুরো Syntax। তালিকা না থাকলে প্রথম N টা Column, OVERRIDING SYSTEM VALUE আর USER VALUE, INSERT oid count এর অর্থ, আর
                  RETURNING এ old ও new, এই লেসনের সেই কথাগুলো এখান থেকে।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/dml-insert.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Inserting Data
                  </a>
                  : Tutorial এর ভঙ্গিতে ছোট অধ্যায়, তালিকাসহ আর তালিকা ছাড়া INSERT, DEFAULT আর অনেক Row।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/dml-returning.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Returning Data from Modified Rows
                  </a>
                  : INSERT, UPDATE, DELETE আর MERGE এ RETURNING, পরের লেসনগুলোর জন্যও।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-MODIFYING"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Data-Modifying Statements in WITH
                  </a>
                  : WITH এর ভেতরে INSERT, RETURNING দিয়ে পরের অংশে মান দেওয়া, আর সব অংশ কেন একই Snapshot দেখে।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/ddl-identity-columns.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Identity Columns
                  </a>
                  : ALWAYS আর BY DEFAULT এর পার্থক্য, আর নিজে মান দিলে কী হয়।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/insert.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: INSERT Statement
                  </a>
                  : তালিকা ছাড়া INSERT এর নিয়ম, INSERT ... SET, () VALUES (), আর IGNORE কী কী Error কে Warning বানায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/information-functions.html#function_last-insert-id"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: LAST_INSERT_ID()
                  </a>
                  : প্রতি Connection আলাদা, অনেক Row এর পরে প্রথম নম্বর, আর নিজে নম্বর দিলে কেন বদলায় না।
                </ListItem>
                <ListItem>
                  <a href="https://node-postgres.com/features/queries" className={LINK} target="_blank" rel="noopener noreferrer">
                    node-postgres: Queries
                  </a>{" "}
                  আর{" "}
                  <a href="https://node-postgres.com/features/transactions" className={LINK} target="_blank" rel="noopener noreferrer">
                    Transactions
                  </a>
                  : Parameter দিয়ে INSERT ... RETURNING, আর একটা client এ BEGIN, COMMIT, ROLLBACK।
                </ListItem>
                <ListItem>
                  <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                    আপনার দেখা MySQL Course
                  </a>
                  : এটা MySQL এর Course। INSERT এর অংশ দেখার সময় এই লেসনের In MySQL অংশটা পাশে রাখুন, LAST_INSERT_ID আর RETURNING এর
                  পার্থক্য সেখানেই চোখে পড়বে।
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
                  INSERT INTO table (তালিকা) VALUES (মান) একটা নতুন Row লেখে। তালিকায় নেই এমন Column পায় DEFAULT, না থাকলে NULL। psql
                  জানায় INSERT 0 n, বক্স জানায় INSERT n।
                </ListItem>
                <ListItem>
                  Column এর তালিকা সবসময়। তালিকা ছাড়া মান যায় Table এর ক্রমে, Table বদলালে ভুল ঘরে, আর একই Type হলে কোনো Error ছাড়াই।
                </ListItem>
                <ListItem>
                  VALUES এ কমা দিয়ে অনেক Row, এক Statement এ। একটা Row ভাঙলে কিছুই ঢোকে না।
                </ListItem>
                <ListItem>
                  DEFAULT পেতে Column বাদ দিন বা DEFAULT লিখুন। নিজে NULL লিখলে DEFAULT বসে না। DEFAULT VALUES পুরো Row টাই DEFAULT দিয়ে।
                  এক Statement এর সব Row এর now() একই।
                </ListItem>
                <ListItem>
                  INSERT ... SELECT অন্য Query এর ফলাফল ঢালে, ক্রম আর Type মিলিয়ে। NOT EXISTS দিয়ে আবার চালালেও দুবার ঢোকে না।
                </ListItem>
                <ListItem>
                  RETURNING নতুন Row ফেরত দেয়, Identity আর DEFAULT সহ, Expression ও চলে। max(id) কখনো না।
                </ListItem>
                <ListItem>
                  প্রতিটা Constraint প্রতিটা Row এ: 23502, 23514, 23505, 23503। Row বানিয়ে আটকালে Identity এর নম্বর খরচ হয়, তাই ফাঁক
                  স্বাভাবিক।
                </ListItem>
                <ListItem>
                  GENERATED ALWAYS এ নিজের নম্বর দিতে OVERRIDING SYSTEM VALUE; তারপর Sequence ঠিক না করলে পরের INSERT এ 23505। BY DEFAULT
                  একই ফাঁদ, শুধু সতর্কবার্তা ছাড়া।
                </ListItem>
                <ListItem>
                  লেখা Single Quote এ, Apostrophe দুবার, NULL Quote ছাড়া। NULL, <code className={CODE}>{"'NULL'"}</code> আর ফাঁকা লেখা তিনটা আলাদা জিনিস।
                </ListItem>
                <ListItem>
                  Booking আর Payment একসাথে: Data-modifying CTE তে RETURNING দিয়ে নম্বর হাতবদল, নয়তো BEGIN আর COMMIT। App থেকে সবসময়
                  Parameter, দাম Database থেকে।
                </ListItem>
                <ListItem>
                  MySQL এ RETURNING আর DEFAULT VALUES নেই; LAST_INSERT_ID() দেয় প্রথম Row এর নম্বর; তালিকা ছাড়া কম মান মানে 1136; INSERT
                  IGNORE Error চাপা দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আজ আপনি নতুন Row লিখতে শিখলেন। কিন্তু Booking একবার লেখা হলেই শেষ না: Nadia একটা সিট বাড়াবেন, pending Booking confirmed
                হবে, ট্যুরের দাম বছরে একবার বাড়বে। আছে এমন Row বদলানোর কাজ UPDATE এর, আর সেখানে একটা ভুল WHERE কয়েক হাজার Row একসাথে
                বদলে দিতে পারে। সেটাই পরের লেসন,{" "}
                <Link href="/sql/topic/update" className={LINK}>
                  UPDATE
                </Link>
                , যেখানে PostgreSQL 18 এর old আর new দুটোই আসল কাজে লাগবে।
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
      ["INSERT ... VALUES", "নতুন Row, তালিকার ক্রমে মান", "Rafiq Islam: customer_id 1, country Bangladesh"],
      ["Column এর তালিকা", "নাম দিয়ে মেলায়, Table এর ক্রম লাগে না", "তালিকা ছাড়া phone এ English, কোনো Error নেই"],
      ["অনেক Row", "কমা দিয়ে, এক Statement, সব বা কিছুই না", "Joy এর NULL শহরে তিনজনের একজনও না"],
      ["DEFAULT", "বাদ দিলে বা DEFAULT লিখলে বসে, NULL লিখলে না", "source এ NULL দিলে 23502"],
      ["DEFAULT VALUES", "পুরো Row DEFAULT দিয়ে, MySQL এ () VALUES ()", "page /tours, এক Statement এর now() একই"],
      ["INSERT ... SELECT", "Query এর ফলাফল ঢালা, ক্রম আর Type মিলিয়ে", "চারটা pending Booking এর ফোন তালিকা"],
      ["NOT EXISTS", "আবার চালালেও দুবার না", "দ্বিতীয়বার INSERT 0"],
      ["RETURNING", "নতুন Row ফেরত, Identity আর DEFAULT সহ", "member_code IT-00001, IT-00002"],
      ["max(id) এর দৌড়", "অন্যের নম্বর পাওয়া যায়", "Rafiq পেলেন 2, তাঁর আসলে 1"],
      ["Constraint", "প্রতিটা Row এ, ভাঙলে কিছুই না", "সাত চেষ্টায় 23503, 23514, 23502, 23505, 22P02"],
      ["নম্বর খরচ", "Row বানিয়ে আটকালে নম্বর যায়", "পাঁচটা ব্যর্থ চেষ্টার পরে নতুন নম্বর 7"],
      ["OVERRIDING SYSTEM VALUE", "ALWAYS এ নিজের নম্বর, তারপর Sequence ঠিক করা", "Kalam Sheikh 4, পরের INSERT এ 23505"],
      ["Data-modifying CTE", "এক Statement এ কয়েকটা INSERT, নম্বর হাতবদল", "Nadia: Customer, Booking, Payment একসাথে"],
      ["Parameter", "মান আলাদা পাঠানো, SQL Injection বন্ধ", "$3::smallint, নইলে inconsistent types"],
      ["MySQL", "LAST_INSERT_ID, RETURNING নেই, IGNORE সাবধানে", "তিন Row এর পরে LAST_INSERT_ID 2"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ins_guides এ তিনটা text Column: full_name, phone, language। কেউ লিখল INSERT INTO ins_guides VALUES ('Mahfuz Alam', 'English', '+8801000000206'); কী হয়?",
        options: [
          {
            key: "A",
            text: "Error, কারণ ফোন নম্বরের ঘরে English",
            isCorrect: false,
            explanation: "তিনটা Column ই text, তাই English একটা বৈধ text। PostgreSQL অর্থ বোঝে না, শুধু Type দেখে।",
          },
          {
            key: "B",
            text: "INSERT 0 1, আর phone এ English, language এ নম্বর",
            isCorrect: true,
            explanation: "ঠিক। তালিকা না থাকলে মান যায় Table এর ক্রমে। এই লেসনের বক্সে ঠিক এটাই হয়েছিল, কোনো Error ছাড়া।",
          },
          {
            key: "C",
            text: "PostgreSQL নিজে বুঝে ঠিক ঘরে বসায়",
            isCorrect: false,
            explanation: "Database মানের অর্থ দেখে ঘর বাছে না। ঘর ঠিক হয় তালিকা বা Table এর ক্রম দিয়ে।",
          },
          {
            key: "D",
            text: "শুধু full_name ঢোকে, বাকিগুলো NULL",
            isCorrect: false,
            explanation: "তিনটা মানই দেওয়া, তাই তিনটা ঘরেই কিছু বসে, শুধু ভুল ক্রমে।",
          },
        ],
      },
      {
        id: 2,
        text: "INSERT INTO ins_customers (full_name, email, city) VALUES (...), (..., NULL), (...); দ্বিতীয় Row এর city NULL, আর city তে NOT NULL। Table এ কয়টা নতুন Row থাকে?",
        options: [
          { key: "A", text: "2, শুধু খারাপটা বাদ", isCorrect: false, explanation: "PostgreSQL বেছে বেছে বাদ দেয় না। এক Statement একটা অবিভাজ্য কাজ।" },
          { key: "B", text: "1, খারাপটার আগ পর্যন্ত", isCorrect: false, explanation: "প্রথম Row ও থাকে না, পুরো Statement বাতিল।" },
          {
            key: "C",
            text: "0",
            isCorrect: true,
            explanation: "ঠিক। বক্সে Error এর পরে rows_in_table 0। তবে প্রথম দুটো Row Identity থেকে 1 আর 2 নিয়ে ফেলেছিল, তাই পরের INSERT পেল 3।",
          },
          { key: "D", text: "3, NULL এর জায়গায় DEFAULT বসে", isCorrect: false, explanation: "নিজে NULL লিখলে DEFAULT বসে না, আর city র কোনো DEFAULT ও নেই।" },
        ],
      },
      {
        id: 3,
        text: "source এর DEFAULT 'website' আর NOT NULL। INSERT INTO ins_signups (email, source) VALUES ('x@mail.example', NULL); কী হয়?",
        options: [
          { key: "A", text: "source এ website বসে", isCorrect: false, explanation: "DEFAULT বসে শুধু Column বাদ দিলে বা DEFAULT লিখলে। NULL একটা মান হিসেবে ধরা হয়।" },
          { key: "B", text: "source এ NULL বসে", isCorrect: false, explanation: "Column এ NOT NULL আছে, তাই NULL বসতে পারে না।" },
          {
            key: "C",
            text: "ERROR 23502, null value in column source",
            isCorrect: true,
            explanation: "ঠিক। App এর কোডে খালি ঘরের null এভাবেই সমস্যা বাধায়। Column টা তালিকা থেকে বাদ দিন বা DEFAULT লিখুন।",
          },
          { key: "D", text: "source এ খালি লেখা বসে", isCorrect: false, explanation: "PostgreSQL NULL কে কখনো নিজে থেকে '' বানায় না।" },
        ],
      },
      {
        id: 4,
        text: "Website এ Booking লেখার পরে কোড চালায় SELECT max(booking_id) FROM bookings; একই সময়ে আরেকজনও Booking করছেন। সমস্যা কী, আর ঠিক পথ কোনটা?",
        options: [
          {
            key: "A",
            text: "কোনো সমস্যা নেই, নিজের INSERT এর পরে সবচেয়ে বড় নম্বর নিজেরই",
            isCorrect: false,
            explanation: "দুই Session এর পরীক্ষায় Rafiq এর max দিয়েছিল 2, যেটা Nadia এর Booking।",
          },
          {
            key: "B",
            text: "অন্যের নম্বর আসতে পারে; INSERT ... RETURNING booking_id",
            isCorrect: true,
            explanation: "ঠিক। নম্বর আসে সেই Statement থেকে যেটা Row বানাল। MySQL এ একই কাজ LAST_INSERT_ID()।",
          },
          {
            key: "C",
            text: "max ধীর; count(*) দিয়ে নম্বর বের করা ভালো",
            isCorrect: false,
            explanation: "count দিয়ে নম্বর মেলেই না, কারণ Identity তে ফাঁক থাকে, আর একই দৌড়ের সমস্যাও থাকে।",
          },
          {
            key: "D",
            text: "lastval() সবসময় সবচেয়ে নিরাপদ",
            isCorrect: false,
            explanation: "lastval এই Session এর ঠিক নম্বর দেয়, কিন্তু মাঝে অন্য কোনো Table এ INSERT হলে সেটার নম্বর দেবে। RETURNING সবচেয়ে পরিষ্কার।",
          },
        ],
      },
      {
        id: 5,
        text: "ins_bookings এ পাঁচটা চেষ্টা ব্যর্থ হলো: Foreign Key, দুটো CHECK, NOT NULL, UNIQUE। তারপর সিটের ঘরে 'two' দিয়ে একটা চেষ্টা। শেষে একটা ঠিকঠাক INSERT। আগে শুধু booking 1 ছিল। নতুন নম্বর কত?",
        options: [
          { key: "A", text: "2", isCorrect: false, explanation: "ব্যর্থ চেষ্টাগুলো নম্বর ফেরত দেয় না।" },
          {
            key: "B",
            text: "7",
            isCorrect: true,
            explanation: "ঠিক। পাঁচটা চেষ্টা Row বানিয়ে আটকেছে, 2 থেকে 6 খরচ। 'two' আটকেছে Row বানানোর আগেই, তাই নম্বর নেয়নি।",
          },
          { key: "C", text: "8", isCorrect: false, explanation: "Type এর ভুলটা নম্বর খায়নি, বক্সে নতুন নম্বর ছিল 7।" },
          { key: "D", text: "1, কারণ Table এ একটাই Row", isCorrect: false, explanation: "Identity এর নম্বর কখনো আবার দেওয়া হয় না, আর 1 তো আছেই।" },
        ],
      },
      {
        id: 6,
        text: "ins_staff এ GENERATED ALWAYS Identity, আগে নম্বর 1 থেকে 3। OVERRIDING SYSTEM VALUE দিয়ে নম্বর 4 এর একজনকে ঢোকানো হলো। তারপর নম্বর ছাড়া সাধারণ INSERT?",
        options: [
          { key: "A", text: "নম্বর 5 পায়, Sequence নিজেই বুঝে নেয়", isCorrect: false, explanation: "Sequence জানে না কেউ 4 হাতে বসিয়েছে।" },
          {
            key: "B",
            text: "ERROR 23505, Key (staff_id)=(4) already exists",
            isCorrect: true,
            explanation: "ঠিক। Sequence 3 এর পরে 4 দেয়। এরপর আবার চালালে 5, কারণ ব্যর্থ চেষ্টা 4 খেয়ে ফেলেছে। বড় Import এর পরে setval লাগে।",
          },
          { key: "C", text: "ERROR 428C9, cannot insert a non-DEFAULT value", isCorrect: false, explanation: "সেটা আসে নিজে নম্বর দিলে। এখানে নম্বর দেওয়া হয়নি।" },
          { key: "D", text: "নম্বর 4 পায়, আগেরটার জায়গায়", isCorrect: false, explanation: "Primary Key দুটো Row কে একই নম্বর নিতে দেয় না।" },
        ],
      },
      {
        id: 7,
        text: "WITH new_booking AS (INSERT INTO bookings ... RETURNING booking_id) INSERT INTO payments (...) SELECT booking_id, ... FROM new_booking; Payment এর method এ বানান ভুল থাকায় CHECK ভাঙল। bookings এ কী থাকে?",
        options: [
          {
            key: "A",
            text: "নতুন Booking থেকে যায়, শুধু Payment নেই",
            isCorrect: false,
            explanation: "দুটো INSERT একই Statement এর অংশ, আলাদা কাজ না।",
          },
          {
            key: "B",
            text: "কিছুই না; পুরো Statement বাতিল, Booking ও না",
            isCorrect: true,
            explanation: "ঠিক। Data-modifying CTE একটা Statement, তাই সব বা কিছুই না। অর্ধেক Booking তৈরিই হতে পারে না।",
          },
          {
            key: "C",
            text: "Booking থাকে status pending হয়ে",
            isCorrect: false,
            explanation: "PostgreSQL নিজে থেকে কোনো মান বদলায় না, পুরো Statement বাতিল করে।",
          },
          {
            key: "D",
            text: "BEGIN না লিখলে Booking থাকে",
            isCorrect: false,
            explanation: "BEGIN ছাড়াও প্রতিটা Statement নিজের Transaction এ চলে। BEGIN লাগে কয়েকটা আলাদা Statement কে জুড়তে।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ এক INSERT এ তিনটা Customer ঢোকানো হলো, তাঁদের নম্বর 2, 3, 4। ঠিক পরে SELECT LAST_INSERT_ID(); কী দেয়?",
        options: [
          { key: "A", text: "4, শেষ Row এর নম্বর", isCorrect: false, explanation: "MySQL এর Manual বলে অনেক Row এর পরে এটা প্রথম Row এর নম্বর দেয়।" },
          {
            key: "B",
            text: "2, প্রথম Row এর নম্বর",
            isCorrect: true,
            explanation: "ঠিক। আমাদের Container এও 2 এসেছিল। সব নম্বর লাগলে PostgreSQL এর RETURNING এর মতো সহজ পথ MySQL এ নেই।",
          },
          { key: "C", text: "3, তিনটার গড়", isCorrect: false, explanation: "এমন কোনো নিয়ম নেই।" },
          {
            key: "D",
            text: "Error, কারণ অনেক Row এর পরে LAST_INSERT_ID চলে না",
            isCorrect: false,
            explanation: "চলে, শুধু প্রথম Row এর নম্বর দেয়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "নিজের হাতে INSERT এর পুরো পথ",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>অতিথি খাতা:</strong> নিজের island_tours এ <code className={CODE}>ins_my_guests</code> নামে একটা Table বানান: Identity
        নম্বর, নাম (NOT NULL), ফোন (NULL চলে), শহর (NOT NULL), দেশ (DEFAULT Bangladesh), আসার সময় (DEFAULT now())। তারপর তিনটা আলাদা
        INSERT লিখুন: একটায় শুধু নাম আর শহর, একটায় দেশ DEFAULT শব্দ দিয়ে, একটায় তিনজন একসাথে। প্রতিটার পরে psql এর উত্তর (INSERT 0
        n) লিখে রাখুন।
      </span>,
      <span key="2">
        <strong>তালিকার পরীক্ষা:</strong> ins_my_guests এ তালিকা ছাড়া একটা INSERT লিখুন যা ভুল ক্রমের কারণে চুপচাপ ভুল ঘরে বসে, আর আরেকটা
        যা Error দেয়। দুটোর জন্য এক লাইনে লিখুন কেন একটায় Error এল আর অন্যটায় এল না।
      </span>,
      <span key="3">
        <strong>নম্বরের খাতা:</strong> একটা UNIQUE Column এর Table এ তিন Row এর একটা INSERT চালান যার দ্বিতীয় Row ডুপ্লিকেট। তারপর একটা
        ঠিকঠাক INSERT ... RETURNING। কোন নম্বরগুলো খরচ হলো আর কেন, একটা ছোট ছকে দেখান।
      </span>,
      <span key="4">
        <strong>একসাথে লেখা:</strong> একটা Transaction এ নিজের নামে একটা Customer, তাঁর একটা Booking আর একটা Payment লিখুন, প্রথমে
        Data-modifying CTE দিয়ে, তারপর psql এর \gset দিয়ে আলাদা তিনটা Statement এ। দুবারই শেষে ROLLBACK, আর প্রমাণ করুন customers 15,
        bookings 24, payments 19 আছে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> হোটেলের অতিথি খাতার উদাহরণ দিয়ে Column এর তালিকা, DEFAULT আর RETURNING, আর কেন SELECT
        max(id) দিয়ে নতুন নম্বর খোঁজা বিপজ্জনক, ছয় লাইনে।
      </span>,
    ],
    deliverables: [
      <span key="d1">ins_my_guests এর CREATE TABLE আর তিনটা INSERT, প্রতিটার উত্তরসহ</span>,
      <span key="d2">তালিকা ছাড়া দুটো INSERT আর তাদের ব্যাখ্যা</span>,
      <span key="d3">খরচ হওয়া নম্বরের ছক</span>,
      <span key="d4">দুই রকম Transaction এর Script আর শেষের তিনটা count</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ INSERT আর RETURNING",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম INSERT, অনেক Row আর RETURNING",
        description:
          "একটা অনুশীলনের Customer Table, তারপর একটা INSERT (উত্তর INSERT 0 1) আর দুই Row এর INSERT ... RETURNING (উত্তর INSERT 0 2, নম্বর 2 আর 3)। শেষে count 3।",
      },
      {
        title: "একটা খারাপ Row",
        description:
          "UNIQUE Tag এর Table। তিন Row এর INSERT এ beach দ্বিতীয়বার, তাই ERROR 23505 আর count 2, hills ও ঢোকেনি। পরের hills পায় 5, কারণ ব্যর্থ Statement 3 আর 4 খেয়েছে।",
      },
      {
        title: "DEFAULT আর একই সময়",
        description:
          "বাদ দেওয়া Column, DEFAULT শব্দ, নিজে NULL (ERROR 23502, নম্বর 3 খরচ), আর তিন Row এর INSERT যার তিনজনের created_at একই: different_times 1।",
      },
      {
        title: "INSERT ... SELECT, দুবার",
        description:
          "pending Booking থেকে ফোনের তালিকা: প্রথমবার INSERT 0 4, দ্বিতীয়বার NOT EXISTS এর কারণে INSERT 0 0। তালিকায় Booking 14, 17, 20, 24।",
      },
      {
        title: "Identity তে হাতের নম্বর",
        description:
          "নিজে 4 দিলে 428C9, OVERRIDING SYSTEM VALUE দিয়ে ঢোকে, তারপর সাধারণ INSERT এ 23505, আর তার পরেরটা পায় 5।",
      },
      {
        title: "Booking আর Payment, \\gset দিয়ে",
        description:
          "BEGIN, Booking এর RETURNING booking_id কে \\gset দিয়ে psql এর Variable এ রাখা, সেই নম্বরে Payment, তারপর ROLLBACK। নতুন করে Load করা Database এ নম্বর 25 আর 20; শেষে bookings 24, payments 19। শেষ লাইন ড্রিলের সব Table সরায়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-insert.sql",
        code: `DROP TABLE IF EXISTS ins_lab_customers;
CREATE TABLE ins_lab_customers (
  customer_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,
  city        text NOT NULL,
  country     text NOT NULL DEFAULT 'Bangladesh'
);

INSERT INTO ins_lab_customers (full_name, email, city)
VALUES ('Rafiq Islam', 'rafiq.islam@mail.example', 'Dhaka');
-- INSERT 0 1

INSERT INTO ins_lab_customers (full_name, email, phone, city, country)
VALUES
  ('Nadia Karim', 'nadia.karim@mail.example', '+8801000000116', 'Sylhet', DEFAULT),
  ('Ananya Sen', 'ananya.sen@mail.example', NULL, 'Kolkata', 'India')
RETURNING customer_id, full_name, country;
-- (2 rows) 2 | Nadia Karim | Bangladesh, 3 | Ananya Sen | India
-- INSERT 0 2

SELECT count(*) AS customers FROM ins_lab_customers;
-- (1 row) 3`,
      },
      {
        language: "sql",
        filename: "02-one-bad-row.sql",
        code: `DROP TABLE IF EXISTS ins_lab_tags;
CREATE TABLE ins_lab_tags (
  tag_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tag    text NOT NULL UNIQUE
);

INSERT INTO ins_lab_tags (tag) VALUES ('island'), ('beach');
-- INSERT 0 2

INSERT INTO ins_lab_tags (tag) VALUES ('hills'), ('beach'), ('forest');
-- ERROR:  duplicate key value violates unique constraint "ins_lab_tags_tag_key"
-- DETAIL:  Key (tag)=(beach) already exists.

SELECT count(*) AS tags FROM ins_lab_tags;
-- (1 row) 2

INSERT INTO ins_lab_tags (tag) VALUES ('hills') RETURNING tag_id;
-- (1 row) 5`,
      },
      {
        language: "sql",
        filename: "03-defaults.sql",
        code: `DROP TABLE IF EXISTS ins_lab_signups;
CREATE TABLE ins_lab_signups (
  signup_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  source     text NOT NULL DEFAULT 'website',
  newsletter boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO ins_lab_signups (email) VALUES ('rafiq.islam@mail.example');
INSERT INTO ins_lab_signups (email, source, newsletter)
VALUES ('nadia.karim@mail.example', DEFAULT, true);
INSERT INTO ins_lab_signups (email, source) VALUES ('joy.barua@mail.example', NULL);
-- ERROR:  null value in column "source" of relation "ins_lab_signups" violates not-null constraint
INSERT INTO ins_lab_signups (email)
VALUES ('a@mail.example'), ('b@mail.example'), ('c@mail.example');
-- INSERT 0 3

SELECT signup_id, email, source, newsletter FROM ins_lab_signups ORDER BY signup_id;
-- (5 rows) signup_id 1, 2, 4, 5, 6: নম্বর 3 ব্যর্থ INSERT খেয়েছে
-- Nadia র newsletter t, বাকিদের f; সবার source website

SELECT count(DISTINCT created_at) AS different_times
FROM ins_lab_signups
WHERE signup_id >= 4;
-- (1 row) 1`,
      },
      {
        language: "sql",
        filename: "04-insert-select.sql",
        code: `DROP TABLE IF EXISTS ins_lab_followups;
CREATE TABLE ins_lab_followups (
  followup_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id  integer NOT NULL UNIQUE,
  customer    text NOT NULL,
  phone       text,
  total_bdt   numeric(10, 2) NOT NULL
);

-- একই INSERT দুবার চালান
INSERT INTO ins_lab_followups (booking_id, customer, phone, total_bdt)
SELECT b.booking_id, c.full_name, c.phone, b.total_bdt
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
  AND NOT EXISTS (SELECT 1 FROM ins_lab_followups f WHERE f.booking_id = b.booking_id);
-- প্রথমবার INSERT 0 4, দ্বিতীয়বার INSERT 0 0

SELECT booking_id, customer, phone, total_bdt
FROM ins_lab_followups
ORDER BY booking_id;
-- (4 rows) 14 Kamal Hasan 50000.00, 17 Rahim Uddin 36000.00,
--          20 Priya Sharma (ফোন NULL) 15600.00, 24 Shuvo Das 15600.00`,
      },
      {
        language: "sql",
        filename: "05-identity.sql",
        code: `DROP TABLE IF EXISTS ins_lab_staff;
CREATE TABLE ins_lab_staff (
  staff_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL
);
INSERT INTO ins_lab_staff (full_name)
VALUES ('Sharmin Sultana'), ('Kamrul Hasan'), ('Selina Parvin');

INSERT INTO ins_lab_staff (staff_id, full_name) VALUES (4, 'Kalam Sheikh');
-- ERROR:  cannot insert a non-DEFAULT value into column "staff_id"
-- HINT:  Use OVERRIDING SYSTEM VALUE to override.

INSERT INTO ins_lab_staff (staff_id, full_name)
OVERRIDING SYSTEM VALUE
VALUES (4, 'Kalam Sheikh');
-- INSERT 0 1

INSERT INTO ins_lab_staff (full_name) VALUES ('Mitu Akter');
-- ERROR:  duplicate key value violates unique constraint "ins_lab_staff_pkey"
-- DETAIL:  Key (staff_id)=(4) already exists.

INSERT INTO ins_lab_staff (full_name) VALUES ('Mitu Akter') RETURNING staff_id;
-- (1 row) 5`,
      },
      {
        language: "sql",
        filename: "06-booking-and-payment.sql",
        code: `BEGIN;

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 12, 2, 'confirmed', 19000.00)
RETURNING booking_id \\gset

\\echo new booking: :booking_id
-- new booking: 25   (নতুন করে Load করা island_tours এ)

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
VALUES (:booking_id, 19000.00, 'bkash', 'paid', '2026-11-01 10:30:00+06')
RETURNING payment_id, booking_id;
-- (1 row) 20 | 25

SELECT b.booking_id, b.status, p.amount_bdt, p.method
FROM bookings b
JOIN payments p ON p.booking_id = b.booking_id
WHERE b.booking_id = :booking_id;
-- (1 row) 25 | confirmed | 19000.00 | bkash

ROLLBACK;

SELECT (SELECT count(*) FROM bookings) AS bookings,
       (SELECT count(*) FROM payments) AS payments;
-- (1 row) 24 | 19

DROP TABLE IF EXISTS ins_lab_customers, ins_lab_tags, ins_lab_signups,
  ins_lab_followups, ins_lab_staff;`,
      },
    ],
  },
};
