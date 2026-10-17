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
  CtBuildLab,
  CtTempSessionsLab,
} from "../../../components/course/topics/ddl/ct-animations";
import {
  CtAnatomyDiagram,
  CtCatalogDiagram,
  CtCopySplit,
  CtNameFoldingSplit,
  CtTableContractDiagram,
  CtTypeFamiliesDiagram,
} from "../../../components/course/topics/ddl/ct-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const EXTRAS_TABLE = `CREATE TABLE ct_tour_extras (
  extra_id    integer,
  tour_id     integer,
  name        text,
  price_bdt   numeric(8, 2),
  is_optional boolean
);`;

const EXTRAS_TABLE_FULL = `CREATE TABLE ct_tour_extras (
  extra_id    integer,
  tour_id     integer,
  name        text,
  price_bdt   numeric(8, 2),
  is_optional boolean,
  created_at  timestamptz
);`;

export const createTableContent: TopicData = {
  id: "create-table",
  introduction: {
    badge: "MODULE 09 · LESSON 02",
    title: <SectionTitle>নিজের প্রথম Table: CREATE TABLE আর নাম রাখার নিয়ম</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 03 থেকে Module 08 পর্যন্ত আপনি যত Table পড়েছেন, tours, bookings, customers, সবগুলো কেউ একজন আগে
          থেকে বানিয়ে রেখেছিলেন। আপনার কাজ ছিল শুধু পড়া। আগের লেসনে আপনি দেখেছেন Database নিজে কীভাবে তৈরি হয়। এবার
          সেই Database এর ভেতরে প্রথমবার নিজের হাতে একটা Table বানানোর পালা।
        </ContentParagraph>
        <ContentParagraph>
          Table বানানোর আদেশ একটাই: CREATE TABLE। দেখতে ছোট, কিন্তু এই একটা Statement এ আপনি ঠিক করে দেন Table এর নাম
          কী, কয়টা Column, প্রতিটা Column এ কোন ধরনের মান থাকবে। এই সিদ্ধান্তগুলো বছরের পর বছর টিকে থাকে, কারণ পরে যত
          Query, যত App, যত Report লেখা হবে, সবাই এই নামগুলো ধরেই কথা বলবে। তাই এই লেসনের অর্ধেক Syntax নিয়ে, আর বাকি
          অর্ধেক নাম রাখার নিয়ম নিয়ে, যেগুলো না জানলে পরে অনেক কষ্ট পোহাতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি CREATE TABLE এর প্রতিটা অংশ চিনবেন, প্রতিটা Column এর জন্য একটা যুক্তিসঙ্গত Type বাছতে পারবেন,
          PostgreSQL নাম কীভাবে পড়ে আর কোন নাম বিপদ ডাকে সেটা জানবেন, IF NOT EXISTS, CREATE TABLE AS, LIKE আর TEMP
          Table কখন কাজে লাগে বুঝবেন, আর বানানো Table টা আবার পড়ে দেখতে পারবেন। সাথে Island Tours এর জন্য প্রথম আসল
          Table, ct_tour_extras, ধাপে ধাপে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি একবারই কথা বলি, কিন্তু সেই কথা টিকে থাকে বছরের পর বছর। আমার বন্ধনীর ভেতরে আপনি যা লেখেন, প্রতিটা Column এর নাম আর Type, সেটাই হয়ে যায় একটা প্রতিশ্রুতি: এই Table এ এর বাইরে কিছু ঢুকবে না।",
      author: "CREATE TABLE",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রুমানার Extra এর খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এ নতুন একটা ব্যবসা শুরু হয়েছে: ট্যুরের সাথে Extra বিক্রি। Saint
                Martin এ Life jacket ভাড়া, Snorkeling kit, Sundarbans এ বনের ভেতরে নৌকার Permit। Operations দেখেন রুমানা।
                তিনি Extra গুলো একটা Spreadsheet এ লিখে রাখছেন, যেমন সবাই প্রথমে রাখেন।
              </ContentParagraph>
              <ContentParagraph>
                মাস শেষে ফারুক সাহেব জানতে চাইলেন, Extra থেকে মোট কত টাকা আসতে পারে। Developer তানিম Sheet টা খুললেন।
                দামের Column এ কোথাও লেখা 300, কোথাও ৮০০ টাকা, কোথাও free, কোথাও ফাঁকা, আর এক জায়গায় লেখা ফারুক ভাইকে
                জিজ্ঞেস করুন। যোগফল বের করতে গিয়ে অর্ধেক ঘর সংখ্যাই না। Module 01 এর{" "}
                <Link href="/sql/topic/why-not-spreadsheets" className={LINK}>
                  প্রথম লেসনে
                </Link>{" "}
                আপনি ঠিক এই সমস্যাটা দেখেছিলেন: Sheet এর ঘরে যা খুশি লেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেব বললেন, এটা Database এ তুলুন। তানিম Island Tours এর Database খুললেন, আর প্রথমবার টের পেলেন যে
                এবার কোনো Table আগে থেকে বানানো নেই। tours বা bookings এর মতো একটা Table তাঁকে নিজেকেই লিখতে হবে। নিচে
                তানিমের প্রথম চেষ্টা। চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খাতার বদলে একটা Table"
              query={`DROP TABLE IF EXISTS ct_tour_extras;
${EXTRAS_TABLE}
INSERT INTO ct_tour_extras VALUES
  (1, 1, 'Life jacket', 300, true),
  (2, 1, 'Snorkeling kit', 800, true),
  (3, 3, 'Forest boat permit', 1500, false);
SELECT * FROM ct_tour_extras;
SELECT count(*) AS extras, sum(price_bdt) AS total_bdt FROM ct_tour_extras;`}
              caption="DROP, CREATE, INSERT 3, তারপর দুটো ফলাফল: ৩টা Row, আর একটা Row যেখানে 3 আর 2600.00। 300 লেখা দাম এসেছে 300.00 হয়ে, কারণ Column টা বলে দিয়েছে দশমিকের পরে দুই ঘর। শুরুর DROP TABLE IF EXISTS এর জন্য বক্সটা যতবার খুশি চালানো যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CREATE TABLE একটা খালি Table বানিয়েছে, পাঁচটা Column, প্রতিটার একটা নাম আর একটা Type। INSERT তিনটা Row
                ঢুকিয়েছে (INSERT এর পুরো গল্প Module 10 এ)। যোগফল এবার এক চেষ্টাতেই এসেছে, কারণ দামের Column এ সংখ্যা ছাড়া
                আর কিছু নেই।
              </ContentParagraph>
              <ContentParagraph>
                কেন নেই? রুমানা যদি তাঁর অভ্যাসমতো free লিখতে চান, কী হয়? নিচের বক্সে ঠিক সেটাই চেষ্টা করা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খাতার মতো লিখতে চাইলে"
              query={`DROP TABLE IF EXISTS ct_tour_extras;
${EXTRAS_TABLE}
INSERT INTO ct_tour_extras VALUES (4, 2, 'Beach photographer', 'free', true);`}
              caption="ERROR: invalid input syntax for type numeric: &quot;free&quot;। Table বানানো হয়েছে, কিন্তু Row টা ঢোকেনি। price_bdt Column এর Type numeric(8, 2), আর free কোনো সংখ্যা না। Sheet হলে চুপচাপ মেনে নিত, Table মানে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনের মূল কথা এই দুই বক্সেই আছে। একটা Table শুধু Data রাখার জায়গা না, সে একটা প্রতিশ্রুতি। CREATE TABLE
              লেখার সময় আপনি বলে দেন প্রতিটা Column এ কী ধরনের মান থাকবে, আর তারপর থেকে Database নিজে সেই কথা পাহারা দেয়,
              প্রতিটা Row এর জন্য, প্রতিবার। ভালো Table বানানো মানে ভালো প্রতিশ্রুতি লেখা: যা দরকার সেটা ঢুকতে দেওয়া, যা
              ভুল সেটা দরজাতেই আটকে দেওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "DDL: যে SQL Data না, Data এর ঘর বানায়",
          content: (
            <ContentParagraph>
              Module 01 এর{" "}
              <Link href="/sql/topic/what-is-sql" className={LINK}>
                What is SQL
              </Link>{" "}
              লেসনে SQL এর আদেশগুলোকে কয়েকটা পরিবারে ভাগ করা হয়েছিল। এতদিন আপনি লিখেছেন DQL, মানে SELECT, যা শুধু পড়ে।
              CREATE TABLE আসে DDL পরিবার থেকে, Data Definition Language: যে আদেশগুলো Data না, Data রাখার কাঠামো বানায়,
              বদলায় বা মোছে। এই Module এর তিনটা মূল DDL আদেশ CREATE, ALTER (Lesson 10) আর DROP (Lesson 11)। Row ঢোকানো,
              বদলানো, মোছা (INSERT, UPDATE, DELETE) DML পরিবারের, সেগুলো Module 10 এর।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-table-is",
      subHeader: { index: "002", title: "What a Table Is" },
      title: <SectionTitle>সংজ্ঞা আর Data, Table এর দুই অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ফর্মের কথা ভাবুন, যেমন ব্যাংকের হিসাব খোলার ফর্ম। ফর্মে আগে থেকে ছাপা থাকে কোন ঘরে কী লিখতে হবে: নাম,
                জন্ম তারিখ, মোবাইল নম্বর। জন্ম তারিখের ঘরে দিন, মাস, বছরের জন্য আলাদা খোপ। ফর্মটা একবার ছাপা হয়, তারপর
                হাজার মানুষ সেটা পূরণ করেন। ছাপা অংশটা বদলায় না, বদলায় শুধু প্রতিটা মানুষের লেখা।
              </ContentParagraph>
              <ContentParagraph>
                Table ঠিক এরকম, দুই অংশে ভাগ করা। প্রথম অংশ সংজ্ঞা (Definition): Table এর নাম, Column গুলো কোন ক্রমে, প্রতিটা
                Column এর Type, আর পরে শিখবেন এমন কিছু নিয়ম। CREATE TABLE ঠিক এই অংশটাই লেখে, একবার। দ্বিতীয় অংশ Row,
                মানে Data, যেগুলো পরে আসে, বদলায়, চলে যায়। প্রতিটা নতুন Row কে সংজ্ঞার সাথে মিলতে হয়। Spreadsheet এ
                মাথার সারিটা শুধু কিছু লেখা, তার নিচে যে কেউ যা খুশি লিখতে পারেন। Table এ মাথার সারির প্রতিটা নামের সাথে
                একটা Type বাঁধা, আর Database সেটা মানতে বাধ্য করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtTableContractDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আট Module ধরে আপনি tours Table পড়ছেন। কিন্তু তার সংজ্ঞাটা কখনো দেখেননি। Database সংজ্ঞাটাও রাখে, আর SQL
              দিয়েই সেটা পড়া যায়। নিচের Query টা information_schema নামের একটা জায়গা থেকে tours এর প্রতিটা Column এর নাম,
              Type আর আরও দুটো তথ্য আনে। information_schema কী, সেটা এই লেসনের শেষের দিকে বিস্তারিত, আপাতত শুধু ফলাফলটা
              দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="tours এর সংজ্ঞা"
              query={`SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tours'
ORDER BY ordinal_position;`}
              caption="৯টা Row, tours এর ৯টা Column, ঠিক যে ক্রমে বানানো হয়েছিল। data_type এ প্রতিটার Type, is_nullable এ NO মানে ঘরটা ফাঁকা রাখা যাবে না (guide_id ছাড়া সবার), column_default এ কিছু না দিলে কী বসবে (is_active এ true, created_at এ now())। price_bdt এর পাশে শুধু numeric দেখাচ্ছে, তার (10,2) অংশটা এই View এ আলাদা Column এ থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই সংজ্ঞাটা এসেছে একটা CREATE TABLE থেকে, যেটা Sample Database এর ফাইলে লেখা আছে। নিচে হুবহু সেটাই। এখন হয়তো
              অর্ধেক শব্দ অচেনা লাগবে: GENERATED ALWAYS AS IDENTITY, REFERENCES, CHECK। এই Module শেষে প্রতিটা শব্দ আপনি নিজে
              লিখতে পারবেন। আজকের জন্য শুধু একটা জিনিস লক্ষ করুন: প্রতিটা লাইন শুরু হয় একটা নাম দিয়ে, তারপর একটা Type। বাকি
              সবকিছু সেই জোড়ার পরে বসানো বাড়তি নিয়ম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "public/sql/island-tours.sql",
          code: `CREATE TABLE tours (
  tour_id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- Lesson 08
  title          text NOT NULL,                                     -- Lesson 07
  destination_id integer NOT NULL REFERENCES destinations (destination_id),  -- Lesson 09
  guide_id       integer REFERENCES guides (guide_id),
  duration_days  smallint NOT NULL CHECK (duration_days > 0),
  price_bdt      numeric(10, 2) NOT NULL CHECK (price_bdt >= 0),
  max_seats      smallint NOT NULL CHECK (max_seats > 0),
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);
-- মন্তব্যগুলো এই লেসনের জন্য যোগ করা, আসল ফাইলে নেই`,
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>CREATE TABLE এর প্রতিটা অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CREATE TABLE পড়তে হয় বাঁ থেকে ডানে, উপর থেকে নিচে, ঠিক একটা বাক্যের মতো। প্রথমে কী বানাচ্ছেন (CREATE TABLE),
                তারপর তার নাম, তারপর বন্ধনীর ভেতরে Column এর তালিকা। গঠনের নিয়মগুলো কম, কিন্তু প্রতিটা কঠোর:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা Column এ নাম আর Type:</strong> নামের পরে একটা ফাঁকা জায়গা, তারপর Type। Type ছাড়া Column
                  লেখা যায় না, PostgreSQL তখন syntax error দেয়।
                </ListItem>
                <ListItem>
                  <strong>Column এর মাঝে কমা:</strong> কমা মানে পরের Column আসছে। শেষ Column এর পরে কমা দিলে PostgreSQL
                  পরের Column খোঁজে, পায় শুধু বন্ধনী, আর Error দেয়।
                </ListItem>
                <ListItem>
                  <strong>Type এর ভেতরে মাপ:</strong> কিছু Type এর পাশে বন্ধনীতে মাপ বসে, যেমন numeric(8, 2) বা varchar(100)।
                  এই কমাটা Type এর ভেতরের, Column এর তালিকার না।
                </ListItem>
                <ListItem>
                  <strong>এক Table এ একই নাম দুইবার না:</strong> দুটো Column এর নাম একই হলে ERROR: column specified more than
                  once।
                </ListItem>
                <ListItem>
                  <strong>শেষে সেমিকোলন:</strong> পুরো CREATE TABLE একটাই Statement, যত লাইনেই লিখুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবচেয়ে ছোট বৈধ Table টা দেখুন। একটা Column, একটা Type। তারপর SELECT দিয়ে পড়লে Row নেই, কিন্তু Column এর
                নামটা ঠিকই দেখা যায়, কারণ সংজ্ঞা আছে, Data নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবচেয়ে ছোট Table"
              query={`DROP TABLE IF EXISTS ct_notes;
CREATE TABLE ct_notes (note text);
SELECT * FROM ct_notes;`}
              caption="DROP, CREATE, তারপর একটা খালি ফলাফল: Column এর নাম note, (0 rows)। খালি Table আর না থাকা Table এক জিনিস না। না থাকলে SELECT এ Error হতো, এখানে হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবচেয়ে বেশি হওয়া ভুলটা। লম্বা Table লেখার সময় শেষ Column এর পরে অভ্যাসে একটা কমা চলে আসে, বিশেষ করে
              একটা Column মুছে ফেলার পরে, বা অন্য জায়গা থেকে লাইন কপি করার পরে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা কমা বেশি"
              query={`DROP TABLE IF EXISTS ct_guides_lite;
CREATE TABLE ct_guides_lite (
  guide_id  integer,
  full_name text,
);`}
              caption="ERROR: syntax error at or near &quot;)&quot;, আর তীরচিহ্ন বন্ধনীর ঠিক নিচে। Error এর জায়গা আর ভুলের জায়গা এক না: ভুলটা আগের লাইনের শেষের কমা। text এর পরের কমাটা মুছে আবার চালান, এবার শুধু CREATE আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "প্রতি লাইনে একটা Column, Type গুলো এক সারিতে",
          content: (
            <ContentParagraph>
              PostgreSQL এর কাছে পুরো Table এক লাইনে লিখলেও চলে। কিন্তু মানুষের চোখের জন্য প্রতিটা Column আলাদা লাইনে, আর
              নামের পরে ফাঁকা দিয়ে Type গুলো এক সোজা সারিতে সাজালে এক নজরে পুরো Table পড়া যায়, কোন Column এর Type কী,
              কোথাও কমা বাদ পড়েছে কিনা। এই লেসনের সব উদাহরণ সেভাবে লেখা। এক Column কে অন্য Column এর আগে বা পরে নিতে
              চাইলেও এই সাজানো লেখায় শুধু একটা লাইন সরাতে হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "column-types",
      subHeader: { index: "004", title: "Column Types" },
      title: <SectionTitle>Column এর Type, প্রথম পরিচয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Column এর জন্য Type বাছতে নিজেকে দুটো প্রশ্ন করুন। এক, এই ঘরে কী থাকবে: পূর্ণ সংখ্যা, টাকা, লেখা,
                তারিখ, নাকি হ্যাঁ/না? দুই, কোন মানটা ঢুকতে দেওয়া উচিত না? দামের ঘরে free আটকাতে চাইলে Type হতে হবে সংখ্যার।
                তারিখের ঘরে next Friday আটকাতে চাইলে Type হতে হবে তারিখের। Type বাছা মানে এই দুই প্রশ্নের উত্তর লিখে দেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ Type অনেক, কিন্তু শুরুতে চারটা পরিবার চিনলেই প্রায় সব Column এর উত্তর পেয়ে যাবেন। প্রতিটা
                পরিবারের নিজের লেসন আছে এই Module এ, সেখানে সীমা, Error আর বাছাইয়ের খুঁটিনাটি। এখানে শুধু কোন কাজে কোনটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtTypeFamiliesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>integer:</strong> পূর্ণ সংখ্যা, প্রায় 214 কোটি পর্যন্ত (ঠিক 2147483647)। পরিচয় নম্বর (tour_id), গোনা যায় এমন জিনিস।
                ছোট সংখ্যার জন্য smallint (seats, duration_days), খুব বড় হলে bigint।{" "}
                <Link href="/sql/topic/numeric-types" className={LINK}>
                  Lesson 03
                </Link>
              </ListItem>
              <ListItem>
                <strong>numeric(p, s):</strong> হুবহু দশমিক সংখ্যা, টাকার জন্য একমাত্র নিরাপদ পছন্দ। p মোট অঙ্ক, s দশমিকের
                পরের অঙ্ক। tours এর price_bdt হলো numeric(10, 2)। একই Lesson 03 এ দেখবেন কেন টাকা কখনো real বা double
                precision এ রাখবেন না।
              </ListItem>
              <ListItem>
                <strong>text:</strong> যেকোনো দৈর্ঘ্যের লেখা: নাম, শিরোনাম, মন্তব্য। দৈর্ঘ্যের সীমা দরকার হলে varchar(n)।{" "}
                <Link href="/sql/topic/text-types" className={LINK}>
                  Lesson 04
                </Link>
              </ListItem>
              <ListItem>
                <strong>date আর timestamptz:</strong> শুধু দিন হলে date (starts_on), দিনের ভেতরের নির্দিষ্ট মুহূর্ত হলে
                timestamptz (booked_at)।{" "}
                <Link href="/sql/topic/date-time-types" className={LINK}>
                  Lesson 05
                </Link>
              </ListItem>
              <ListItem>
                <strong>boolean:</strong> হ্যাঁ অথবা না (is_active)। আরও আছে uuid আর enum।{" "}
                <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                  Lesson 06
                </Link>
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা পরিবার থেকে একটা"
              query={`DROP TABLE IF EXISTS ct_type_tour;
CREATE TABLE ct_type_tour (
  tour_id   integer,
  seats     smallint,
  price_bdt numeric(10, 2),
  title     text,
  is_active boolean,
  starts_on date,
  booked_at timestamptz
);
INSERT INTO ct_type_tour VALUES
  (1, 20, 12500, 'Saint Martin Island Escape', true, '2026-11-20', '2026-11-01 10:30:00+06');
SELECT * FROM ct_type_tour;`}
              caption="একটা Row: 1, 20, 12500.00, Saint Martin Island Escape, t, 2026-11-20, 2026-11-01 10:30:00+06। প্রতিটা মান তার Type এর চেহারায় ফিরেছে: টাকায় দুই দশমিক, boolean এ t, timestamptz এ শেষে +06, কারণ এই বক্সের Time Zone ঢাকা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  <code className={CODE}>ct_ex1_destinations_lite</code> নামে একটা Table বানান, তিনটা Column সহ, এই ক্রমে:{" "}
                  <code className={CODE}>destination_id</code> পূর্ণ সংখ্যা, <code className={CODE}>name</code> লেখা,{" "}
                  <code className={CODE}>region</code> লেখা। Starter এর শেষের SELECT টা যেমন আছে তেমন রাখুন, সেটাই সবশেষে
                  চলবে আর আপনার Table এর সংজ্ঞা দেখাবে।
                </>
              }
              hint={
                <>
                  মন্তব্যের লাইনের জায়গায় CREATE TABLE লিখুন। পূর্ণ সংখ্যার জন্য integer, লেখার জন্য text। শেষ Column এর
                  পরে কমা না।
                </>
              }
              starter={`DROP TABLE IF EXISTS ct_ex1_destinations_lite;
-- এখানে CREATE TABLE ct_ex1_destinations_lite লিখুন

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'ct_ex1_destinations_lite'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('destination_id', 'integer'),
  ('name', 'text'),
  ('region', 'text')
) AS v(column_name, data_type);`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "types-guard-data",
      subHeader: { index: "005", title: "Types Guard the Data" },
      title: <SectionTitle>Type পাহারা দেয়, আবার চুপচাপ মানিয়েও নেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                থিওরিতে দেখেছেন numeric এর ঘরে free ঢোকেনি। প্রতিটা Type এভাবে প্রতিটা নতুন মান পরীক্ষা করে: মানটা কি
                এই Type এ বদলানো যায়? না গেলে পুরো Row ফিরিয়ে দেওয়া হয়। তারিখের Type দেখতে আরও কড়া, শুধু চেহারা না, তারিখটা
                সত্যিই ক্যালেন্ডারে আছে কিনা সেটাও দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্যালেন্ডারে নেই এমন তারিখ"
              query={`DROP TABLE IF EXISTS ct_departure_dates;
CREATE TABLE ct_departure_dates (tour_id integer, starts_on date);
INSERT INTO ct_departure_dates VALUES (1, '2026-11-20');
INSERT INTO ct_departure_dates VALUES (1, '2026-02-30');`}
              caption="প্রথম INSERT 1, দ্বিতীয়টায় ERROR: date/time field value out of range: &quot;2026-02-30&quot;। চেহারা ঠিকই তারিখের মতো, কিন্তু ফেব্রুয়ারিতে ৩০ তারিখ নেই। Sheet এ এই লেখা নিঃশব্দে বসে থাকত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টো দিকটা, যেটা অনেকে জানেন না। যখন একটা মানকে Column এর Type এ বদলানো সম্ভব, PostgreSQL কোনো কথা
                না বলে বদলে নেয়। এর নাম Assignment Cast: Column এ মান বসানোর সময় যে বদল নিজে থেকে হয়। বেশিরভাগ সময় এটা
                সুবিধা, কিন্তু দুই জায়গায় এটা আপনার মান বদলে দেয়, আর কেউ টের পায় না। নিচের বক্সে দুটো Row, প্রতিটা ঘরে
                ইচ্ছা করে ভুল ধরনের মান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে বদল কেউ টের পায় না"
              query={`DROP TABLE IF EXISTS ct_quiet;
CREATE TABLE ct_quiet (
  seats       integer,
  price_bdt   numeric(8, 2),
  is_optional boolean,
  note        text
);
INSERT INTO ct_quiet VALUES ('4', 12.5, 'yes', 42);
INSERT INTO ct_quiet VALUES (2.5, 99.999, 'off', 3.14);
SELECT * FROM ct_quiet;`}
              caption="দুটো INSERT ই সফল, কোনো সতর্কবার্তা নেই। Row দুটো: 4, 12.50, t, 42 আর 3, 100.00, f, 3.14। লেখা '4' সংখ্যা হয়েছে, 'yes' আর 'off' boolean, সংখ্যা 42 লেখা। কিন্তু 2.5 হয়ে গেছে 3, আর 99.999 হয়ে গেছে 100.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষের দুটো বদল ভালো করে দেখুন। integer Column এ 2.5 পাঠানো হয়েছিল। পূর্ণ সংখ্যায় দশমিক রাখা যায় না, তাই
                PostgreSQL গোল করে 3 বানিয়েছে। numeric(8, 2) এ 99.999 পাঠানো হয়েছিল। দশমিকের পরে দুই ঘরের বেশি রাখা যায়
                না, তাই গোল করে 100.00। দুটোই নিয়মমাফিক, দুটোই নিঃশব্দ। এক Booking এ আড়াই আসন কেউ বুক করেন না, কিন্তু
                হিসাবের কোনো ভুলে 2.5 এলে Database সেটা ধরিয়ে দেবে না, 3 বানিয়ে রেখে দেবে।
              </ContentParagraph>
              <ContentParagraph>
                শিক্ষাটা হলো: Type মানের চেহারা পাহারা দেয়, মানের অর্থ না। free আটকায়, ভুল তারিখ আটকায়, কিন্তু গোল করা যায়
                এমন সংখ্যা গোল করে নেয়। অর্থের পাহারা, যেমন আসন শূন্যের বেশি হতে হবে, আসে CHECK দিয়ে, Lesson 07 এ। আর কোন
                বদল নিজে থেকে হয় আর কোনটার জন্য CAST লিখতে হয়, সেটা Module 04 এর{" "}
                <Link href="/sql/topic/type-casting" className={LINK}>
                  Type Casting
                </Link>{" "}
                লেসনে বিস্তারিত।
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
                  Payment এর একটা হালকা সংস্করণ বানান: <code className={CODE}>ct_ex2_payments_lite</code>, এই ক্রমে চারটা
                  Column। <code className={CODE}>payment_id</code> পূর্ণ সংখ্যা। <code className={CODE}>amount_bdt</code>{" "}
                  টাকা, মোট ১০ অঙ্ক যার ২টা দশমিকের পরে। <code className={CODE}>method</code> লেখা।{" "}
                  <code className={CODE}>paid_on</code> শুধু তারিখ। শেষের SELECT টা প্রতিটা Column এর পুরো Type দেখায়,
                  মাপ সহ, সেটা শেষে রাখুন।
                </>
              }
              hint={
                <>
                  টাকার জন্য numeric(10, 2)। শুধু numeric লিখলে চেক মিলবে না, কারণ তখন মাপ ছাড়া Type হয়। তারিখের জন্য
                  date, মুহূর্তের জন্য না।
                </>
              }
              starter={`DROP TABLE IF EXISTS ct_ex2_payments_lite;
-- এখানে CREATE TABLE ct_ex2_payments_lite লিখুন

SELECT a.attname AS column_name, format_type(a.atttypid, a.atttypmod) AS type
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
WHERE c.relname = 'ct_ex2_payments_lite' AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY a.attnum;`}
              solution={`SELECT * FROM (VALUES
  ('payment_id', 'integer'),
  ('amount_bdt', 'numeric(10,2)'),
  ('method', 'text'),
  ('paid_on', 'date')
) AS v(column_name, type);`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "building-tour-extras",
      subHeader: { index: "006", title: "Building ct_tour_extras" },
      title: <SectionTitle>ct_tour_extras, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                থিওরির Table টা তানিম তাড়াহুড়ো করে লিখেছিলেন। এবার ধীরে, ঠিক নিয়মে। একটা নতুন Table এর নকশা শুরু হয় SQL
                দিয়ে না, প্রশ্ন দিয়ে। তানিম ফারুক সাহেব আর রুমানার সাথে বসে লিখলেন, প্রতিটা Extra সম্পর্কে তাঁরা কী কী জানতে
                চান:
              </ContentParagraph>
              <ContentList>
                <ListItem>প্রতিটা Extra কে আলাদা করে চেনার উপায় কী? একটা নম্বর।</ListItem>
                <ListItem>Extra টা কোন ট্যুরের সাথে বিক্রি হয়?</ListItem>
                <ListItem>Extra টার নাম কী?</ListItem>
                <ListItem>দাম কত টাকা?</ListItem>
                <ListItem>Customer কি না নিয়েও পারেন, নাকি নিতেই হবে?</ListItem>
                <ListItem>কবে থেকে এই Extra তালিকায় আছে?</ListItem>
              </ContentList>
              <ContentParagraph>
                প্রতিটা প্রশ্ন একটা Column, প্রতিটা উত্তরের ধরন একটা Type। নিচের Lab এ একটা একটা করে Column যোগ করুন। বাঁ দিকে
                Statement বড় হচ্ছে, ডান দিকে psql এর <code className={CODE}>\d ct_tour_extras</code> আদেশ সেই মুহূর্তে Table
                টাকে কেমন দেখায়, আর কেন এই Type।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtBuildLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab শেষে Statement টা দাঁড়াল ছয় Column এর। নিচে সেটাই চালান, তারপর information_schema থেকে পড়ে দেখুন
              PostgreSQL কী রেখেছে। এবার দুটো নতুন Column ও আনা হয়েছে: numeric_precision আর numeric_scale, যেখানে numeric(8,
              2) এর দুটো সংখ্যা আলাদা করে থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছয় Column এর ct_tour_extras"
              query={`DROP TABLE IF EXISTS ct_tour_extras;
${EXTRAS_TABLE_FULL}
SELECT column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_name = 'ct_tour_extras'
ORDER BY ordinal_position;`}
              caption="৬টা Row। price_bdt এর পাশে 8 আর 2, ঠিক যা লেখা হয়েছিল। integer এর পাশেও 32 আর 0 আছে: integer এর মাপ 32 bit, সেটাই এখানে লেখা। text, boolean আর timestamptz এর ঘরে NULL, কারণ এই দুটো মাপ শুধু সংখ্যার Type এর থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Column এর ক্রম একবারেই ঠিক করুন",
          content: (
            <ContentParagraph>
              SELECT * Column দেখায় CREATE TABLE এর ক্রমে। পরে ALTER TABLE দিয়ে যোগ করা Column সবসময় শেষে বসে, PostgreSQL এ
              ক্রম বদলানোর আদেশ নেই। Island Tours এর ক্রমটা মেনে চলুন: নিজের পরিচয় নম্বর, অন্য Table এর পরিচয় নম্বর, বর্ণনার
              Column, আর শেষে সময় (created_at)।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "naming-conventions",
      subHeader: { index: "007", title: "Naming Conventions" },
      title: <SectionTitle>নাম রাখার নিয়ম, যা পরে কষ্ট বাঁচায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Table এর নাম একবার রাখা হয়, কিন্তু লেখা হয় হাজারবার: প্রতিটা Query তে, App এর Code এ, Report এ, অন্য
                Developer এর মাথায়। পরে নাম বদলানো যায় (Lesson 10), কিন্তু তখন সেই হাজার জায়গাও বদলাতে হয়। তাই নাম রাখার
                কয়েকটা নিয়ম শুরু থেকেই মেনে চলা ভালো। প্রথম নিয়মটা বুঝতে আগে জানতে হবে PostgreSQL একটা নাম কীভাবে পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                নাম লেখার দুই উপায়। সাধারণ উপায়ে আপনি নামটা এমনি লেখেন: ct_tour_extras। এর নাম Unquoted Identifier।
                Identifier মানে যেকোনো জিনিসের নাম, Table, Column বা অন্য কিছু। দ্বিতীয় উপায়ে নামের দুই পাশে Double Quote
                দেন: &quot;TourExtras&quot;। এর নাম Quoted Identifier। PostgreSQL এর নিয়ম: উদ্ধৃতি ছাড়া লেখা নাম সে প্রথমে
                ছোট হাতের অক্ষরে বদলে নেয় (Case Folding), রাখার সময়ও, খোঁজার সময়ও। উদ্ধৃতি দিলে অক্ষর যেমন আছে তেমনই থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtNameFoldingSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় হাতে লিখলেও ছোট হাতে রাখা"
              query={`DROP TABLE IF EXISTS ct_tourextras;
CREATE TABLE CT_TourExtras (ExtraName text, PriceBDT numeric(8, 2));
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name ILIKE 'ct_tourextras'
ORDER BY ordinal_position;
SELECT * FROM ct_tourextras;`}
              caption="Table এর নাম ct_tourextras, Column দুটো extraname আর pricebdt: বড় হাতের অক্ষর কোথাও নেই। দ্বিতীয় SELECT ছোট হাতে লিখেও Table টা পেয়েছে। শব্দের সীমানাও হারিয়েছে, pricebdt পড়তে কষ্ট হয়, তাই নিয়ম হলো শব্দের মাঝে _।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার উদ্ধৃতি দিয়ে। অনেকে অন্য ভাষা বা Tool থেকে অভ্যাস নিয়ে আসেন, যেখানে নাম লেখা হয় PhotoPackages এর মতো।
              কিছু GUI Tool বা ORM ও নিজে থেকে উদ্ধৃতি দিয়ে Table বানায়। তখন কী হয়, দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উদ্ধৃতি দিয়ে বানানো নাম"
              query={`DROP TABLE IF EXISTS "Ct_PhotoPackages";
CREATE TABLE "Ct_PhotoPackages" ("PackageName" text, "PriceBDT" numeric(8, 2));
SELECT * FROM "Ct_PhotoPackages";
SELECT * FROM Ct_PhotoPackages;`}
              caption="প্রথম SELECT উদ্ধৃতি সহ, তাই খালি ফলাফল আসে, Column এর নাম PackageName আর PriceBDT হুবহু। দ্বিতীয়টায় ERROR: relation &quot;ct_photopackages&quot; does not exist। আপনি একই বানানে লিখেছেন, কিন্তু উদ্ধৃতি ছাড়া, তাই PostgreSQL ছোট হাতের নামটা খুঁজেছে। Table টা আছে, শুধু সেই নামে নেই। Column এর বেলাতেও একই নিয়ম: SELECT PackageName লিখলে column &quot;packagename&quot; does not exist, সাথে একটা HINT যে আপনি হয়তো উদ্ধৃতি ভুলে গেছেন। psql এর \dt *photo* ও এই Table খুঁজে পায় না, লিখতে হয় \dt &quot;Ct_PhotoPackages&quot;।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সবচেয়ে বিপজ্জনক অবস্থাটা আরেকটু সূক্ষ্ম। উদ্ধৃতি দেওয়া নাম আর না দেওয়া নাম যেহেতু আলাদা, একই Database এ
              দুটো Table পাশাপাশি থাকতে পারে, যাদের নাম চোখে একই রকম লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই নাম, দুটো আলাদা Table"
              query={`DROP TABLE IF EXISTS "Ct_Guests";
DROP TABLE IF EXISTS ct_guests;
CREATE TABLE "Ct_Guests" (name text);
CREATE TABLE ct_guests (name text);
INSERT INTO "Ct_Guests" VALUES ('Rumana');
INSERT INTO ct_guests VALUES ('Tanim');
SELECT * FROM Ct_Guests;
SELECT * FROM "Ct_Guests";`}
              caption="দুটো CREATE ই সফল, কারণ Ct_Guests আর ct_guests আলাদা নাম। উদ্ধৃতি ছাড়া SELECT পড়েছে ct_guests: Tanim। উদ্ধৃতি সহ: Rumana। একজন এক Table এ লেখেন, আরেকজন অন্যটা পড়েন, আর দুজনেই ভাবেন Data হারাচ্ছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সব ঝামেলার সমাধান একটা অভ্যাস: সব নাম ছোট হাতের অক্ষরে, শব্দের মাঝে underscore, আর উদ্ধৃতি কখনো না।
                এই ধরনকে বলে snake_case। তখন বড় হাত ছোট হাত নিয়ে কোনো প্রশ্নই ওঠে না, কারণ ভাঁজ করার কিছু থাকে না। বাকি
                নিয়মগুলো Island Tours এর Table থেকেই শেখা যায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক বচন না বহু বচন:</strong> tours নাকি tour? দুই দলেই অভিজ্ঞ মানুষ আছেন, কোনোটা ভুল না। এটা Team
                  এর সিদ্ধান্ত, আর আসল নিয়ম হলো একবার যা ঠিক করবেন, সব Table এ তাই। Island Tours এ সব Table বহু বচনে
                  (tours, bookings, payments), তাই নতুন Table টাও ct_tour_extras।
                </ListItem>
                <ListItem>
                  <strong>পরিচয় নম্বর:</strong> এক বচনের নাম আর _id (tour_id), অন্য Table এ রাখলেও একই নাম (bookings এর
                  customer_id)।
                </ListItem>
                <ListItem>
                  <strong>শেষে বা শুরুতে অর্থ:</strong> একক শেষে (price_bdt, duration_days), হ্যাঁ/না তে is_ (is_active),
                  মুহূর্তে _at (booked_at), শুধু তারিখে _on (starts_on)।
                </ListItem>
                <ListItem>
                  <strong>পুরো শব্দ, সংক্ষেপ না:</strong> customer_id, cust_id না। ছয় মাস পরে নিজের লেখা সংক্ষেপ নিজেও
                  চিনবেন না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নামের দৈর্ঘ্যেরও একটা সীমা আছে, যেটা অনেকে প্রথম জানেন একটা অদ্ভুত Bug এর পরে। PostgreSQL একটা নামের প্রথম ৬৩
              byte পর্যন্ত রাখে, বাকিটা কেটে ফেলে। Error না, শুধু একটা NOTICE।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="৬৩ byte এর বেশি লম্বা নাম"
              query={`DROP TABLE IF EXISTS ct_extra_services_offered_on_every_tour_departure_with_prices_in_bdt;
CREATE TABLE ct_extra_services_offered_on_every_tour_departure_with_prices_in_bdt (extra_id integer);
SELECT table_name, length(table_name) AS characters
FROM information_schema.tables
WHERE table_name LIKE 'ct_extra_services%';`}
              caption="Table টা বানানো হয়েছে, কিন্তু নাম ct_extra_services_offered_on_every_tour_departure_with_prices_i, ঠিক ৬৩ অক্ষর। শেষের n_bdt নেই। এই বক্স NOTICE দেখায় না, psql দেখায় (নিচে)। DROP এর লাইনেও একই কাটা পড়ে, তাই বক্সটা আবার চালালেও চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: island_tours",
          code: `island_tours=# CREATE TABLE ct_extra_services_offered_on_every_tour_departure_with_prices_in_bdt (extra_id integer);
NOTICE:  identifier "ct_extra_services_offered_on_every_tour_departure_with_prices_in_bdt" will be truncated to "ct_extra_services_offered_on_every_tour_departure_with_prices_i"
CREATE TABLE`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "৬৩ অক্ষর না, ৬৩ byte",
          content: (
            <ContentParagraph>
              সীমাটা byte এ, অক্ষরে না। ইংরেজি অক্ষর এক byte করে, তাই উপরের নাম ৬৩ অক্ষরে থামল। বাংলা লেখা UTF-8 এ প্রতিটা
              Unicode অক্ষরে তিন byte নেয়। ভ্রমণ শব্দটা চোখে তিনটা অক্ষর, কিন্তু ভেতরে পাঁচটা Unicode অক্ষর (হসন্ত আর ফলা
              সহ), মানে ১৫ byte, Query বক্সে octet_length দিয়ে যাচাই করা। PostgreSQL বাংলা নামও মানে, কিন্তু Table আর
              Column এর নাম ইংরেজিতে রাখাই প্রচলিত: সব Keyboard এ লেখা যায়, সব Tool ঠিকমতো দেখায়, আর অন্য দেশের
              Developer ও পড়তে পারেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  একজন সহকর্মী Guide দের ভাষার জন্য Starter এর মন্তব্যে লেখা Table টা বানাতে চেয়েছিলেন, উদ্ধৃতি আর বড়
                  হাতের অক্ষর দিয়ে। একই Table টা এই লেসনের নিয়মে লিখুন: Table এর নাম{" "}
                  <code className={CODE}>ct_ex3_guide_languages</code>, Column দুটো{" "}
                  <code className={CODE}>guide_id</code> (পূর্ণ সংখ্যা) আর <code className={CODE}>language_name</code>{" "}
                  (লেখা)। শেষের SELECT বড় হাত ছোট হাত না মেনে ct_ex3 দিয়ে শুরু হওয়া সব Table এর Column দেখায়, সেটা শেষে
                  রাখুন।
                </>
              }
              hint={
                <>
                  উদ্ধৃতি চিহ্নগুলো বাদ দিন, আর প্রতিটা শব্দের মাঝে underscore দিন। শুধু উদ্ধৃতি তুলে দিলে নাম হবে
                  ct_ex3_guidelanguages, শব্দের সীমানা ছাড়া, চেক মিলবে না।
                </>
              }
              starter={`DROP TABLE IF EXISTS "Ct_Ex3_GuideLanguages";
DROP TABLE IF EXISTS ct_ex3_guide_languages;
-- সহকর্মীর লেখা: CREATE TABLE "Ct_Ex3_GuideLanguages" ("GuideId" integer, "LanguageName" text);
-- এখানে আপনার CREATE TABLE লিখুন

SELECT table_name, column_name
FROM information_schema.columns
WHERE lower(table_name) LIKE 'ct_ex3%'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('ct_ex3_guide_languages', 'guide_id'),
  ('ct_ex3_guide_languages', 'language_name')
) AS v(table_name, column_name);`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "reserved-words",
      subHeader: { index: "008", title: "Reserved Words" },
      title: <SectionTitle>যে শব্দগুলো SQL নিজের জন্য রেখেছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT, FROM, WHERE, ORDER, TABLE, এই শব্দগুলো SQL এর নিজের ভাষার অংশ, এদের নাম Keyword। এর মধ্যে কিছু
                শব্দ এতটাই জরুরি যে PostgreSQL এগুলোকে নাম হিসেবে ব্যবহার করতে দেয় না, উদ্ধৃতি ছাড়া। এদের বলে Reserved
                Word, মানে সংরক্ষিত শব্দ। Login System বানাতে গিয়ে প্রায় সবাই একবার user নামে Table বানাতে চান। দেখুন কী হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="user নামে Table"
              query={`CREATE TABLE user (user_id integer, full_name text);`}
              caption="ERROR: syntax error at or near &quot;user&quot;। PostgreSQL এর কাছে user একটা Keyword, Table এর নাম না। তাই সে বাক্যটার মানেই বোঝেনি। নাম বদলে users বা app_users লিখে চালান, এবার CREATE আসবে। (Table টা যদি বানিয়ে ফেলেন, পরে DROP TABLE users; দিয়ে মুছে দিন।)"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোন শব্দ সংরক্ষিত, কোনটা না, মুখস্থ রাখার দরকার নেই। PostgreSQL নিজেই তালিকা দেয়, pg_get_keywords() নামের
              একটা Function এ। প্রতিটা শব্দের পাশে একটা অক্ষর: R মানে Reserved, নাম হিসেবে চলবে না। U মানে Unreserved,
              নাম হিসেবে নিশ্চিন্তে চলে। C মানে Unreserved, তবে Function বা Type এর নাম হতে পারে না, Table বা Column এর নাম
              হিসেবে চলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন শব্দ সংরক্ষিত"
              query={`SELECT word, catcode, catdesc
FROM pg_get_keywords()
WHERE word IN ('user', 'order', 'table', 'desc', 'limit',
               'name', 'type', 'date', 'value', 'year', 'time')
ORDER BY catcode, word;`}
              caption="১০টা Row। desc, limit, order, table আর user এর পাশে R। name, type, value আর year এর পাশে U, time এর পাশে C। আমরা ১১টা শব্দ চেয়েছিলাম, এসেছে ১০টা: date নেই, কারণ PostgreSQL এর কাছে date কোনো Keyword ই না, একটা সাধারণ Type এর নাম। তাই name, date, type নামে Column রাখা চলে, যদিও এর চেয়ে বর্ণনামূলক নাম (extra_name, starts_on) সাধারণত ভালো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উদ্ধৃতি দিলে সংরক্ষিত শব্দও নাম হিসেবে চলে: &quot;user&quot;, &quot;order&quot;। তাহলে সমস্যা কোথায়?
                আগের Section এর মতোই, তারপর থেকে প্রতিবার উদ্ধৃতি লিখতে হয়। আর user এর বেলায় একটা ফাঁদ আছে, যেটা কোনো
                Error দেয় না। SQL এ user শব্দটা একা লিখলে তার মানে এই মুহূর্তে যিনি Database এ Login করেছেন, তাঁর নাম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উদ্ধৃতি ভুলে গেলে চুপচাপ ভুল উত্তর"
              query={`DROP TABLE IF EXISTS ct_accounts;
CREATE TABLE ct_accounts ("user" text, city text);
INSERT INTO ct_accounts VALUES ('rumana', 'Dhaka'), ('tanim', 'Sylhet');
SELECT user, "user", city FROM ct_accounts;`}
              caption="দুটো Row, তিনটা Column, আর প্রথম Column এ দুই Row তেই postgres। উদ্ধৃতি ছাড়া user মানে Login করা মানুষ, এই বক্সে যার নাম postgres। উদ্ধৃতি সহ &quot;user&quot; হলো আসল Column: rumana আর tanim। কোনো Error নেই, শুধু ভুল উত্তর, যেটা সবচেয়ে খারাপ ধরনের Bug।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "উদ্ধৃতি শেষ উপায়, প্রথম না",
          content: (
            <ContentParagraph>
              সংরক্ষিত শব্দে ধাক্কা খেলে উদ্ধৃতি দিয়ে পার পাওয়ার চেষ্টা করবেন না, নামটা বদলে ফেলুন। user এর জায়গায় users,
              app_users বা customers। order এর জায়গায় orders বা Island Tours এর মতো bookings। desc এর জায়গায় description।
              MySQL থেকে আসা কোনো Schema তে এই সমস্যা প্রায়ই দেখা যায়: MySQL 8.4 এ user নামে Table বানানো যায়, Error ছাড়া
              (এই লেসনের MySQL কন্টেইনারে যাচাই করা), কিন্তু একই লেখা PostgreSQL এ syntax error দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "if-not-exists",
      subHeader: { index: "009", title: "IF NOT EXISTS" },
      title: <SectionTitle>IF NOT EXISTS: Error নেই, প্রশ্নও নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই নামে দ্বিতীয়বার Table বানাতে চাইলে PostgreSQL থামিয়ে দেয়। এটা ভালো, কারণ ভুল করে কারো Table এর উপরে
              নতুন Table লিখে ফেলার কোনো সুযোগ থাকে না। Error টার নিজের একটা কোডও আছে, SQLSTATE 42P07, যেটা দিয়ে App এর
              Code এই নির্দিষ্ট Error চিনতে পারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Table দুইবার"
              query={`DROP TABLE IF EXISTS ct_waitlist;
CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);`}
              caption="প্রথম CREATE সফল, দ্বিতীয়টায় ERROR: relation &quot;ct_waitlist&quot; already exists। Relation হলো PostgreSQL এর ভাষায় Table, View, Index এর মতো জিনিসগুলোর সাধারণ নাম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিন্তু কিছু Script বারবার চালানোর জন্যই লেখা, যেমন একটা Setup Script যেটা নতুন Laptop এ প্রথমবার চলে, আবার
                পুরনো Laptop এও চলে। সেখানে Table থাকলে Error চাই না, শুধু চাই না থাকলে বানানো হোক। তার জন্য CREATE TABLE IF
                NOT EXISTS। Table না থাকলে বানায়, থাকলে কিছুই করে না, Error এর বদলে শুধু একটা NOTICE দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এখানেই ফাঁদ। IF NOT EXISTS শুধু নামটা দেখে। একই নামের Table আগে থেকে থাকলে, তার Column গুলো একেবারে আলাদা
                হলেও, PostgreSQL কিছু বলে না। Documentation এ পরিষ্কার লেখা আছে, আগের Table টা নতুন লেখার মতো হবে, এমন কোনো
                নিশ্চয়তা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন সংজ্ঞা নিঃশব্দে বাদ"
              query={`DROP TABLE IF EXISTS ct_waitlist;
CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
CREATE TABLE IF NOT EXISTS ct_waitlist (
  customer_id integer,
  tour_id     integer,
  seats       smallint,
  note        text
);
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'ct_waitlist'
ORDER BY ordinal_position;`}
              caption="কোনো Error নেই, কিন্তু শেষের ফলাফলে মাত্র ২টা Column: customer_id আর tour_id। seats আর note নেই। আপনি ভাবছেন চারটা Column, আসলে দুটো। Error আসবে অনেক পরে, প্রথম যে INSERT seats লিখতে যাবে তাতে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query বক্স NOTICE দেখায় না, তাই উপরে দ্বিতীয় CREATE এর পরে শুধু CREATE লেখা এসেছে। psql এ একই কাজ করলে
              NOTICE টা চোখে পড়ে। কন্টেইনারের PostgreSQL 18 এ আসল ফলাফল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: island_tours",
          code: `island_tours=# CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
CREATE TABLE
island_tours=# CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
ERROR:  relation "ct_waitlist" already exists
island_tours=# CREATE TABLE IF NOT EXISTS ct_waitlist (customer_id integer, tour_id integer, seats smallint);
NOTICE:  relation "ct_waitlist" already exists, skipping
CREATE TABLE
island_tours=# \\d ct_waitlist
               Table "public.ct_waitlist"
   Column    |  Type   | Collation | Nullable | Default
-------------+---------+-----------+----------+---------
 customer_id | integer |           |          |
 tour_id     | integer |           |          |`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "কখন IF NOT EXISTS, কখন না",
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                IF NOT EXISTS ভালো সেই Script এ, যেখানে Table টা হয় হুবহু এই সংজ্ঞায় আছে, নয়তো নেই। এই লেসনের বক্সগুলো উল্টো
                পথ নিয়েছে: শুরুতে DROP TABLE IF EXISTS, তারপর CREATE TABLE, তাই প্রতিবার একদম নতুন Table। কিন্তু DROP সব
                Data মুছে দেয়, তাই আসল Data এর Table এ কখনো না (Lesson 11)।
              </ContentParagraph>
              <ContentParagraph>
                আসল প্রকল্পে Table এর সংজ্ঞা বদলানো হয় Migration দিয়ে: প্রতিটা বদল একটা ক্রমিক ফাইলে, যা একবারই চলে, আর
                Database নিজে মনে রাখে কোনগুলো চলেছে। সেটা শিখবেন{" "}
                <Link href="/sql/topic/migrations" className={LINK}>
                  Migrations
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "create-table-as-like",
      subHeader: { index: "010", title: "CREATE TABLE AS and LIKE" },
      title: <SectionTitle>অন্য Table থেকে নতুন Table: AS আর LIKE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণ প্রতিটা Column হাতে লিখেছেন। কিন্তু অনেক সময় নতুন Table টা আগে থেকে থাকা কিছুর উপর দাঁড়ায়। হয় একটা
              Query এর ফলাফল আলাদা Table এ রেখে দিতে চান, নয়তো একটা Table এর মতো হুবহু আরেকটা খালি Table চান। প্রথমটার জন্য
              CREATE TABLE AS, দ্বিতীয়টার জন্য LIKE। দুটো দেখতে কাছাকাছি, কাজে একদম আলাদা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtCopySplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CREATE TABLE AS এর পরে Column এর তালিকা না, একটা SELECT বসে। PostgreSQL Query টা চালায়, ফলাফলের প্রতিটা
              Column এর নাম আর Type দিয়ে Table বানায়, তারপর সব Row ঢেলে দেয়। Column এর নাম আসে SELECT এর নাম থেকে, তাই
              Alias গুলো এখানে নতুন Table এর Column এর নাম হয়ে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Query এর ফলাফল থেকে Table"
              query={`DROP TABLE IF EXISTS ct_tour_summary;
CREATE TABLE ct_tour_summary AS
SELECT t.tour_id, t.title, ds.name AS destination, t.price_bdt
FROM tours t
JOIN destinations ds ON ds.destination_id = t.destination_id;
SELECT * FROM ct_tour_summary ORDER BY tour_id;`}
              caption="CREATE এর জায়গায় আসে SELECT 9, মানে ৯টা Row ঢুকেছে। তারপর ৯টা Row, চারটা Column। destination নামটা এসেছে AS destination থেকে। এখন এই Table পড়তে আর JOIN লাগে না। শুধু আকার চাইলে, Row ছাড়া, SELECT এর শেষে WITH NO DATA লিখুন: Column আর Type আসবে, Row একটাও না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CREATE TABLE AS এর দুটো স্বভাব জানা জরুরি। প্রথমটা: সে শুধু ফলাফল কপি করে, নিয়ম না। tours এর tour_id তে NOT
              NULL ছিল, PRIMARY KEY ছিল, price_bdt তে CHECK ছিল। নতুন Table এ এর কিছুই নেই। মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Row আসে, নিয়ম আসে না"
              query={`DROP TABLE IF EXISTS ct_tour_summary;
CREATE TABLE ct_tour_summary AS
SELECT t.tour_id, t.title, ds.name AS destination, t.price_bdt
FROM tours t
JOIN destinations ds ON ds.destination_id = t.destination_id;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name IN ('tours', 'ct_tour_summary')
  AND column_name IN ('tour_id', 'title', 'price_bdt')
ORDER BY table_name DESC, ordinal_position;`}
              caption="৬টা Row। tours এ is_nullable NO, ct_tour_summary তে একই তিন Column এ YES। Type একই, কিন্তু ফাঁকা ঘর আটকানোর নিয়ম হারিয়েছে। Report এর জন্য ঠিক আছে, আসল Table হিসেবে চালাতে চাইলে নিয়মগুলো আবার যোগ করতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় স্বভাব: Query টা চলে একবারই, CREATE এর মুহূর্তে। তারপর মূল Table বদলালেও কপি বদলায় না। Documentation এর
              ভাষায়, এটা দেখতে View এর মতো, কিন্তু আসলে একদম আলাদা। নিচের বক্সে দামের একটা কপি রাখা হয়েছে, তারপর একটা
              Transaction এর ভেতরে tours এ Saint Martin এর দাম ১০% বাড়ানো হয়েছে। শেষে ROLLBACK, তাই আসল tours এ কিছুই বদলায়
              না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কপিটা একটা মুহূর্তের ছবি"
              query={`DROP TABLE IF EXISTS ct_price_snapshot;
CREATE TABLE ct_price_snapshot AS
SELECT tour_id, price_bdt FROM tours;
BEGIN;
UPDATE tours SET price_bdt = price_bdt * 1.10 WHERE tour_id = 1;
SELECT t.tour_id, s.price_bdt AS snapshot_bdt, t.price_bdt AS live_bdt
FROM tours t
JOIN ct_price_snapshot s ON s.tour_id = t.tour_id
WHERE t.tour_id = 1;
ROLLBACK;`}
              caption="মাঝের ফলাফলে একটা Row: snapshot_bdt 12500.00, live_bdt 13750.00। tours বদলেছে, কপি বদলায়নি। শেষে ROLLBACK, তাই tours আবার আগের মতো।"
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
                  পাহাড়ের ট্যুরগুলোর একটা আলাদা Table বানান, CREATE TABLE AS দিয়ে:{" "}
                  <code className={CODE}>ct_ex4_hill_tours</code>, তিনটা Column: tour_id, title আর price_bdt। শুধু সেই
                  ট্যুরগুলো, যাদের Destination এর kind হলো hills। শেষের SELECT নতুন Table টা tour_id এর ক্রমে পড়ে,
                  সেটা শেষে রাখুন।
                </>
              }
              hint={
                <>
                  kind থাকে destinations এ, তাই tours এর সাথে destination_id দিয়ে JOIN লাগবে। CREATE TABLE ... AS এর
                  পরে পুরো SELECT, WHERE সহ।
                </>
              }
              starter={`DROP TABLE IF EXISTS ct_ex4_hill_tours;
-- এখানে CREATE TABLE ct_ex4_hill_tours AS ... লিখুন

SELECT * FROM ct_ex4_hill_tours ORDER BY tour_id;`}
              solution={`SELECT * FROM (VALUES
  (4, 'Sajek Valley Cloud Trip', 9500.00),
  (5, 'Bandarban Hill Trek', 14000.00)
) AS v(tour_id, title, price_bdt);`}
              orderMatters
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার LIKE। এখানে কোনো Query নেই, বন্ধনীর ভেতরে লেখা থাকে LIKE আর একটা Table এর নাম। PostgreSQL সেই Table এর
                সব Column এর নাম, Type আর NOT NULL নতুন Table এ বসিয়ে দেয়। Row একটাও না। আর কী কী আসবে, সেটা ঠিক হয় INCLUDING
                দিয়ে: INCLUDING DEFAULTS আনে DEFAULT মান, INCLUDING CONSTRAINTS আনে CHECK, INCLUDING INDEXES আনে PRIMARY KEY
                আর UNIQUE, INCLUDING IDENTITY আনে নিজে বাড়া নম্বরের ব্যবস্থা, আর INCLUDING ALL একসাথে সব।
              </ContentParagraph>
              <ContentParagraph>
                কাজে লাগে Archive, Test বা একই আকারের যেকোনো খালি Table এর জন্য। নিচে tours থেকে দুটো Table, একটা শুধু LIKE,
                আরেকটা INCLUDING ALL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LIKE আর LIKE INCLUDING ALL"
              query={`DROP TABLE IF EXISTS ct_tours_plain;
DROP TABLE IF EXISTS ct_tours_full;
CREATE TABLE ct_tours_plain (LIKE tours);
CREATE TABLE ct_tours_full (LIKE tours INCLUDING ALL);
SELECT p.column_name,
       p.is_nullable    AS plain_nullable,
       p.column_default AS plain_default,
       f.column_default AS full_default,
       f.is_identity    AS full_identity
FROM information_schema.columns p
JOIN information_schema.columns f
  ON f.table_name = 'ct_tours_full' AND f.column_name = p.column_name
WHERE p.table_name = 'ct_tours_plain'
ORDER BY p.ordinal_position;`}
              caption="৯টা Row। plain_nullable এ guide_id ছাড়া সবার NO: NOT NULL দুই Table এই এসেছে। plain_default পুরোটা NULL, full_default এ is_active এর true আর created_at এর now()। full_identity তে tour_id YES: INCLUDING ALL Identity ও এনেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন নিয়ম এল, কোনটা এল না"
              query={`DROP TABLE IF EXISTS ct_tours_plain;
DROP TABLE IF EXISTS ct_tours_full;
CREATE TABLE ct_tours_plain (LIKE tours);
CREATE TABLE ct_tours_full (LIKE tours INCLUDING ALL);
SELECT conrelid::regclass AS table_name,
       count(*) FILTER (WHERE contype = 'p') AS primary_key,
       count(*) FILTER (WHERE contype = 'c') AS checks,
       count(*) FILTER (WHERE contype = 'f') AS foreign_keys
FROM pg_constraint
WHERE conrelid IN ('tours'::regclass, 'ct_tours_plain'::regclass, 'ct_tours_full'::regclass)
GROUP BY conrelid
ORDER BY conrelid;
SELECT count(*) AS rows_copied FROM ct_tours_full;`}
              caption="tours এ 1টা PRIMARY KEY, 3টা CHECK, 2টা FOREIGN KEY। ct_tours_plain এ সব 0। ct_tours_full এ 1, 3, 0: INCLUDING ALL ও Foreign Key আনে না। শেষে rows_copied 0। pg_constraint হলো সেই Catalog Table যেখানে প্রতিটা নিয়ম একটা Row (Catalog নিয়ে Section 012 এ)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "CREATE TABLE AS", "LIKE", "VIEW (Module 14)"],
          rows: [
            ["কী লেখা হয়", "একটা SELECT", "একটা Table এর নাম", "একটা SELECT"],
            ["Row আসে?", "হ্যাঁ, CREATE এর মুহূর্তের", "না, একটাও না", "Row রাখে না, প্রতিবার Query চালায়"],
            ["মূল Table বদলালে", "কপি বদলায় না", "সংজ্ঞাও বদলায় না", "সাথে সাথে নতুন ফলাফল"],
            ["NOT NULL", "আসে না", "সবসময় আসে", "প্রযোজ্য না"],
            ["DEFAULT, CHECK, PRIMARY KEY", "আসে না", "INCLUDING দিলে আসে", "প্রযোজ্য না"],
            ["FOREIGN KEY", "আসে না", "কখনো আসে না", "প্রযোজ্য না"],
            ["কখন", "Report এর ছবি, ভারী হিসাব একবার করে রাখা", "Archive, Test, একই আকারের খালি Table", "বারবার লাগে এমন Query কে নাম দেওয়া"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  bookings এর মতো হুবহু একটা খালি Table বানান, নাম <code className={CODE}>ct_ex5_bookings_shape</code>, যেখানে
                  Column, Type আর NOT NULL এর সাথে DEFAULT মানগুলোও থাকবে, যাতে booked_at না দিলে নিজে থেকে now() বসে।
                  শেষের SELECT প্রতিটা Column এর is_nullable আর column_default দেখায়, সেটা শেষে রাখুন।
                </>
              }
              hint={
                <>
                  CREATE TABLE AS এখানে চলবে না, কারণ সে NOT NULL আর DEFAULT কোনোটাই আনে না। বন্ধনীর ভেতরে LIKE bookings,
                  তারপর DEFAULT আনার INCLUDING।
                </>
              }
              starter={`DROP TABLE IF EXISTS ct_ex5_bookings_shape;
-- এখানে CREATE TABLE ct_ex5_bookings_shape (LIKE ...) লিখুন

SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ct_ex5_bookings_shape'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('booking_id', 'NO', NULL),
  ('customer_id', 'NO', NULL),
  ('departure_id', 'NO', NULL),
  ('seats', 'NO', NULL),
  ('status', 'NO', NULL),
  ('total_bdt', 'NO', NULL),
  ('booked_at', 'NO', 'now()')
) AS v(column_name, is_nullable, column_default);`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "temp-tables",
      subHeader: { index: "011", title: "TEMP Tables" },
      title: <SectionTitle>TEMP Table: শুধু এই Session এর জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Session মানে Database এর সাথে একটা Connection, Connect করা থেকে বের হয়ে যাওয়া পর্যন্ত। psql খুললে একটা
                Session শুরু, \q লিখে বের হলে শেষ। App এর প্রতিটা Connection ও একটা করে Session। TEMP Table (Temporary Table,
                অস্থায়ী Table) সেই Session এর নিজস্ব: যে Session বানায়, শুধু সেই দেখতে পায়, আর Session শেষ হলে PostgreSQL নিজে
                সেটা মুছে দেয়, কাউকে DROP লিখতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                কাজে লাগে লম্বা হিসাবের মাঝের ফলাফল রাখতে, বাইরে থেকে আসা CSV আগে পরিষ্কার করতে (Module 10 এর{" "}
                <Link href="/sql/topic/bulk-loading" className={LINK}>
                  Bulk Loading
                </Link>
                ), আর নিরাপদে কিছু পরীক্ষা করতে। লেখা একটাই শব্দ বেশি: CREATE TEMP TABLE, বা পুরোটা CREATE TEMPORARY TABLE।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা TEMP Table"
              query={`DROP TABLE IF EXISTS ct_cart;
CREATE TEMP TABLE ct_cart (tour_id integer, seats smallint);
INSERT INTO ct_cart VALUES (1, 2), (5, 1);
SELECT * FROM ct_cart;
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'ct_cart';`}
              caption="দুটো Row: (1, 2) আর (5, 1)। শেষের ফলাফলে schemaname pg_temp_0, public না। প্রতিটা Session এর TEMP Table থাকে তার নিজের একটা অস্থায়ী Schema তে। এই পুরো Page একটাই Session, তাই Page টা Reload না করা পর্যন্ত ct_cart এখানে থেকে যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query বক্সে একটাই Session, তাই অন্য Session থেকে না দেখতে পাওয়ার ব্যাপারটা এখানে দেখানো যায় না। সেটা দেখা হয়েছে
              কন্টেইনারের PostgreSQL 18 এ, একই সময়ে খোলা দুটো psql দিয়ে। নিচের Lab এ ধাপগুলো একটা একটা চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtTempSessionsLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              TEMP Table এর একটা বিপজ্জনক ক্ষমতা আছে। তার নাম যদি একটা স্থায়ী Table এর নামের সাথে মেলে, তাহলে সেই Session এ
              স্থায়ী Table টা ঢাকা পড়ে যায়। PostgreSQL নাম খোঁজার সময় আগে নিজের অস্থায়ী Schema দেখে, তারপর public। Module 02
              এর{" "}
              <Link href="/sql/topic/databases-schemas" className={LINK}>
                Databases and Schemas
              </Link>{" "}
              লেসনে search_path নামে যে খোঁজার ক্রম দেখেছিলেন, অস্থায়ী Schema সেই তালিকার একদম শুরুতে থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="TEMP Table স্থায়ী Table কে ঢেকে দেয়"
              query={`DROP TABLE IF EXISTS ct_shadow;
DROP TABLE IF EXISTS ct_shadow;
CREATE TABLE ct_shadow (source text);
INSERT INTO ct_shadow VALUES ('permanent');
CREATE TEMP TABLE ct_shadow (source text);
INSERT INTO ct_shadow VALUES ('temp');
SELECT * FROM ct_shadow;
SELECT * FROM public.ct_shadow;
DROP TABLE ct_shadow;
SELECT * FROM ct_shadow;`}
              caption="তিনটা ফলাফল: temp, permanent, permanent। শুধু ct_shadow লিখলে TEMP টা পড়া হয়, public.ct_shadow লিখলে স্থায়ীটা। DROP TABLE ct_shadow ও আগে TEMP টাই মোছে, তারপর নামটা আবার স্থায়ী Table কে বোঝায়। শুরুতে DROP দুইবার, কারণ একবারে একটাই মোছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই কারণে TEMP Table এর নাম কখনো আসল Table এর নামে রাখবেন না। tours নামে একটা TEMP Table বানালে সেই Session এর
                সব Query, এমনকি পুরনো Report ও, চুপচাপ ভুল Table পড়বে।
              </ContentParagraph>
              <ContentParagraph>
                Session এর চেয়েও ছোট আয়ু চাইলে ON COMMIT। ON COMMIT DROP লিখলে Transaction শেষ হতেই Table উধাও। ON COMMIT
                DELETE ROWS লিখলে Table থাকে, কিন্তু প্রতিটা Transaction শেষে Row গুলো মুছে যায়। কিছু না লিখলে ON COMMIT
                PRESERVE ROWS, মানে Session শেষ না হওয়া পর্যন্ত সব থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON COMMIT DROP"
              query={`BEGIN;
CREATE TEMP TABLE ct_checkout (tour_id integer, seats smallint) ON COMMIT DROP;
INSERT INTO ct_checkout VALUES (3, 2);
SELECT * FROM ct_checkout;
COMMIT;
SELECT * FROM ct_checkout;`}
              caption="Transaction এর ভেতরে SELECT একটা Row দেখায়: 3, 2। COMMIT এর পরের SELECT এ ERROR: relation &quot;ct_checkout&quot; does not exist। Table টা COMMIT এর সাথেই চলে গেছে। শুরুতে DROP লাগেনি, কারণ প্রতিবার চালানো শেষে Table টা নিজেই থাকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "আয়ু", "কে দেখতে পায়", "কোথায় থাকে"],
          rows: [
            ["CTE (Module 07)", "একটা Statement", "শুধু সেই Statement", "কোথাও লেখা হয় না"],
            ["TEMP Table, ON COMMIT DROP", "একটা Transaction", "শুধু নিজের Session", "pg_temp Schema"],
            ["TEMP Table", "একটা Session", "শুধু নিজের Session", "pg_temp Schema"],
            ["সাধারণ Table", "DROP না করা পর্যন্ত", "অনুমতি আছে এমন সবাই", "public বা অন্য Schema"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "reading-a-table-back",
      subHeader: { index: "012", title: "Reading a Table Back" },
      title: <SectionTitle>বানানো Table আবার পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Table বানানোর পরে প্রথম কাজ যাচাই: যা লিখতে চেয়েছিলেন, Database কি ঠিক তাই রেখেছে? IF NOT EXISTS এর ফাঁদ
                দেখার পরে এই প্রশ্নটা আর বাড়তি সতর্কতা মনে হয় না। পড়ার উপায় তিনটা, আর তিনটাই আসলে একই জায়গা থেকে পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                CREATE TABLE চালালে PostgreSQL তার নিজের কিছু Table এ নতুন Row লেখে। এই Table গুলোর নাম System Catalog, থাকে
                pg_catalog নামের Schema তে। pg_class এ প্রতিটা Table এর জন্য একটা Row, pg_attribute এ প্রতিটা Column এর জন্য
                একটা Row। মানে একটা Table এর সংজ্ঞা নিজেও Data, অন্য কিছু Table এর ভেতরে রাখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CtCatalogDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম উপায় psql এর ছোট আদেশ, যেগুলো Module 02 এর{" "}
              <Link href="/sql/topic/psql-basics" className={LINK}>
                psql Basics
              </Link>{" "}
              লেসনে দেখেছিলেন। \dt একটা Pattern এর সাথে মেলা সব Table এর তালিকা দেয়, \d একটা Table এর পুরো সংজ্ঞা। Query বক্স
              এই Backslash আদেশ বোঝে না, এগুলো psql এর নিজের। কন্টেইনারের PostgreSQL 18 এ আসল ফলাফল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: island_tours",
          code: `island_tours=# \\dt ct_*
               List of tables
 Schema |      Name      | Type  |  Owner
--------+----------------+-------+----------
 public | ct_tour_extras | table | postgres
 public | ct_waitlist    | table | postgres
(2 rows)

island_tours=# \\d ct_tour_extras
                      Table "public.ct_tour_extras"
   Column    |           Type           | Collation | Nullable | Default
-------------+--------------------------+-----------+----------+---------
 extra_id    | integer                  |           |          |
 tour_id     | integer                  |           |          |
 name        | text                     |           |          |
 price_bdt   | numeric(8,2)             |           |          |
 is_optional | boolean                  |           |          |
 created_at  | timestamp with time zone |           |          |`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                \d এর ঘরগুলো এই Module এর বাকি লেসনগুলো ভরবে: Collation (Lesson 04), Nullable আর Default (Lesson 07)।
                PRIMARY KEY, CHECK বা FOREIGN KEY থাকলে নিচে আলাদা অংশে আসে, Project Example এ দেখবেন।{" "}
                <code className={CODE}>\d+</code> আরও কয়েকটা Column দেখায়, যেমন Storage আর Description।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় উপায় information_schema, যেটা এই লেসনে বারবার ব্যবহার করেছেন। এটা SQL Standard এর অংশ, কয়েকটা View এর
                একটা Schema, যেগুলো Catalog এর Row গুলোকে একটা সাধারণ চেহারায় দেখায়। Standard বলে একই Query MySQL এও চলে।
                তৃতীয় উপায় সরাসরি pg_catalog, যেটা PostgreSQL এর নিজের, বেশি খুঁটিনাটি দেয়। যেমন numeric(8,2) এর পুরো
                চেহারা এক ঘরে পেতে format_type নামের Function লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="pg_attribute থেকে সরাসরি"
              query={`DROP TABLE IF EXISTS ct_tour_extras;
${EXTRAS_TABLE_FULL}
SELECT a.attnum, a.attname, format_type(a.atttypid, a.atttypmod) AS type
FROM pg_attribute a
WHERE a.attrelid = 'ct_tour_extras'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;`}
              caption="৬টা Row, \d এর মতোই: numeric(8,2), timestamp with time zone। attnum Column এর ক্রমিক নম্বর। attnum > 0 লুকানো System Column বাদ দেয়, NOT attisdropped বাদ দেয় ALTER TABLE দিয়ে মোছা Column। ::regclass নামটাকে pg_class এর পরিচয় নম্বরে বদলায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা জিনিস MySQL থেকে আসা মানুষ খোঁজেন: SHOW CREATE TABLE, যেটা পুরো CREATE TABLE লেখাটা ফেরত দেয়। PostgreSQL এ
              এমন কোনো SQL আদেশ নেই। কাছাকাছি কাজটা করে pg_dump নামের Tool, --schema-only দিলে শুধু সংজ্ঞা, Data ছাড়া।
              কন্টেইনারে চালিয়ে আসল ফলাফল, শুরুর SET লাইন, মন্তব্য আর \restrict এর মতো psql এর নিজের লাইনগুলো বাদ দিয়ে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ pg_dump --schema-only --table=ct_tour_extras island_tours

CREATE TABLE public.ct_tour_extras (
    extra_id integer,
    tour_id integer,
    name text,
    price_bdt numeric(8,2),
    is_optional boolean,
    created_at timestamp with time zone
);
ALTER TABLE public.ct_tour_extras OWNER TO postgres;`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  এবার কিছু বানাতে হবে না, শুধু পড়তে হবে। information_schema থেকে <code className={CODE}>bookings</code>{" "}
                  Table এর প্রতিটা Column এর নাম, data_type আর is_nullable বের করুন, Table এ Column গুলো যে ক্রমে আছে সেই
                  ক্রমে।
                </>
              }
              hint={
                <>
                  information_schema.columns, WHERE table_name = &apos;bookings&apos;, আর ক্রমের জন্য ordinal_position।
                </>
              }
              solution={`SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ CREATE TABLE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CREATE TABLE এর মূল গঠন MySQL এ একই: নাম, বন্ধনী, Column আর Type, কমা, সেমিকোলন। থিওরির ct_tour_extras প্রায়
                হুবহু চলে, শুধু Type এর নামে সামান্য বদল (integer এর জায়গায় INT, numeric এর জায়গায় DECIMAL, timestamptz এর
                জায়গায় TIMESTAMP বা DATETIME, কোনটা কখন সেটা Lesson 05 এ)। পার্থক্যগুলো আসে আশপাশে, আর প্রতিটা এই লেসনের MySQL 8.4.11 কন্টেইনারে
                যাচাই করা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বড় হাত ছোট হাত:</strong> MySQL এ Table এর নাম ভাঁজ হবে কিনা নির্ভর করে lower_case_table_names
                  Setting এর উপর। MySQL এর Documentation অনুযায়ী Linux এ এর মান 0, Windows এ 1, macOS এ 2। এই কন্টেইনার
                  Linux, মান 0, তাই TourExtras বানিয়ে tourextras খুঁজলে ERROR 1146। একই Schema এক Laptop এ চলে, Server এ
                  চলে না, এমন Bug এর উৎস এটা। Column এর নাম অবশ্য সব জায়গায় বড় হাত ছোট হাত মানে না।
                </ListItem>
                <ListItem>
                  <strong>নামের উদ্ধৃতি:</strong> MySQL এ নাম উদ্ধৃত করা হয় Backtick দিয়ে: `order`। Double Quote দিলে ERROR
                  1064, কারণ MySQL এ Double Quote সাধারণত লেখার মান বোঝায়।
                </ListItem>
                <ListItem>
                  <strong>সংরক্ষিত শব্দের তালিকা আলাদা:</strong> order আর desc দুই জায়গাতেই সংরক্ষিত। কিন্তু user MySQL এ
                  সংরক্ষিত না, PostgreSQL এ সংরক্ষিত।
                </ListItem>
                <ListItem>
                  <strong>IF NOT EXISTS:</strong> একই আচরণ, Table থাকলে কিছু না করে। NOTICE এর বদলে 1 warning, SHOW WARNINGS
                  দিলে Note 1050।
                </ListItem>
                <ListItem>
                  <strong>Table পড়া:</strong> \d এর বদলে DESCRIBE, আর SHOW CREATE TABLE দেয় পুরো CREATE লেখাটা, ENGINE=InnoDB আর
                  Character Set সহ।
                </ListItem>
                <ListItem>
                  <strong>CREATE TABLE ... AS SELECT:</strong> চলে, কিন্তু PostgreSQL এর উল্টো, NOT NULL হারায় না। LIKE এ MySQL
                  INCLUDING লিখতে দেয় না, নিজে থেকেই Index, PRIMARY KEY, AUTO_INCREMENT আর CHECK আনে, Foreign Key আনে না।
                </ListItem>
                <ListItem>
                  <strong>TEMP Table:</strong> MySQL এ পুরো শব্দ লাগে, CREATE TEMPORARY TABLE। শুধু TEMP লিখলে ERROR 1064। আর
                  SHOW TABLES এ TEMP Table দেখায় না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-session.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
CREATE TABLE ct_tour_extras (
  extra_id    INT,
  tour_id     INT,
  name        TEXT,
  price_bdt   DECIMAL(8, 2),
  is_optional BOOLEAN,
  created_at  TIMESTAMP
);
SHOW CREATE TABLE ct_tour_extras\\G
-- CREATE TABLE \`ct_tour_extras\` (
--   \`extra_id\` int DEFAULT NULL,
--   \`tour_id\` int DEFAULT NULL,
--   \`name\` text,
--   \`price_bdt\` decimal(8,2) DEFAULT NULL,
--   \`is_optional\` tinyint(1) DEFAULT NULL,
--   \`created_at\` timestamp NULL DEFAULT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE IF NOT EXISTS ct_tour_extras (extra_id INT);
-- Query OK, 0 rows affected, 1 warning
SHOW WARNINGS;
-- Note | 1050 | Table 'ct_tour_extras' already exists

CREATE TABLE TourExtras (ExtraName TEXT);
SELECT * FROM tourextras;
-- ERROR 1146 (42S02): Table 'island_tours.tourextras' doesn't exist

CREATE TABLE user (id INT);
-- Query OK, MySQL এ user সংরক্ষিত না
CREATE TABLE order (id INT);
-- ERROR 1064 (42000): You have an error in your SQL syntax ... near 'order (id INT)'
CREATE TABLE \`order\` (id INT);
-- Query OK, Backtick দিয়ে উদ্ধৃত

CREATE TABLE ct_summary AS SELECT tour_id, title, price_bdt FROM tours;
DESCRIBE ct_summary;
-- Null এর ঘরে তিনটাতেই NO: MySQL এ NOT NULL হারায়নি

CREATE TEMP TABLE ct_cart (tour_id INT);
-- ERROR 1064 (42000): ... near 'TEMP TABLE ct_cart (tour_id INT)'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সবচেয়ে বড় পার্থক্যটা চোখে পড়ে Transaction এর ভেতরে। PostgreSQL এ CREATE TABLE ও একটা Transaction এর অংশ হতে
              পারে। BEGIN এর পরে Table বানিয়ে ROLLBACK দিলে Table টা কখনো ছিলই না। নতুন Schema বসানোর সময় এটা বিরাট সুবিধা:
              মাঝপথে একটা ধাপ ভুল হলে সব একসাথে বাতিল। নিচের দুই বক্স একটার পর একটা চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CREATE TABLE, তারপর ROLLBACK"
              query={`DROP TABLE IF EXISTS ct_trial;
BEGIN;
CREATE TABLE ct_trial (extra_id integer, name text);
INSERT INTO ct_trial VALUES (1, 'Life jacket');
SELECT * FROM ct_trial;
ROLLBACK;`}
              caption="Transaction এর ভেতরে Table আছে, একটা Row ও আছে: 1, Life jacket। তারপর ROLLBACK। এবার নিচের বক্সটা চালান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROLLBACK এর পরে"
              query={`SELECT * FROM ct_trial;`}
              caption="ERROR: relation &quot;ct_trial&quot; does not exist। ROLLBACK শুধু Row না, Table টাকেও ফিরিয়ে নিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-session.sql",
          code: `-- MySQL 8.4.11: একই কাজ
START TRANSACTION;
CREATE TABLE ct_trial (a INT);
ROLLBACK;
SHOW TABLES LIKE 'ct_trial';
-- ct_trial
-- (1 row) Table টা রয়ে গেছে: MySQL এ CREATE TABLE নিজে থেকে Commit করে দেয়`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এর Implicit Commit",
          content: (
            <ContentParagraph>
              MySQL এ CREATE, ALTER আর DROP এর মতো DDL আদেশ চলার আগে চলমান Transaction কে নিজে থেকে Commit করে দেয়। এর নাম
              Implicit Commit। ফলে ROLLBACK এর আর কিছু ফেরানোর থাকে না। তাই MySQL এ Schema বদলানোর Script মাঝপথে ভাঙলে
              অর্ধেক কাজ হয়ে বসে থাকে, PostgreSQL এ পুরোটা ফেরানো যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Extra এর আসল Table, পরের লেসনগুলোর এক ঝলক সহ</SectionTitle>,
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
                তানিম ছয় Column এর ct_tour_extras ফারুক সাহেবকে দেখালেন। ফারুক সাহেব জানতে চাইলেন, কেউ নাম ছাড়া Extra
                ঢোকালে, বা এমন tour_id লিখলে যে ট্যুর নেই, তখন? দুটোই সম্ভব, কারণ Type শুধু চেহারা দেখে: 99 নম্বর ট্যুর না
                থাকলেও 99 একটা integer।
              </ContentParagraph>
              <ContentParagraph>
                এর উত্তর এই Module এর বাকি লেসনগুলো। নিচে ct_tour_extras এর সেই রূপ, যেটা Module শেষে আপনি নিজে লিখবেন,
                প্রতিটা নতুন শব্দের পাশে তার লেসন। লক্ষ করুন, প্রতিটা লাইন এখনো সেই একই জোড়া দিয়ে শুরু: নাম আর Type।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ct_tour_extras, পুরো রূপে"
              query={`DROP TABLE IF EXISTS ct_tour_extras;
CREATE TABLE ct_tour_extras (
  extra_id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Lesson 08
  tour_id     integer NOT NULL REFERENCES tours (tour_id),      -- Lesson 07, 09
  name        text NOT NULL,                                    -- Lesson 07
  price_bdt   numeric(8, 2) NOT NULL CHECK (price_bdt >= 0),    -- Lesson 03, 07
  is_optional boolean NOT NULL DEFAULT true,                    -- Lesson 06, 07
  created_at  timestamptz NOT NULL DEFAULT now()                -- Lesson 05, 07
);
INSERT INTO ct_tour_extras (tour_id, name, price_bdt, is_optional) VALUES
  (1, 'Life jacket', 300, true),
  (1, 'Snorkeling kit', 800, true),
  (3, 'Forest boat permit', 1500, false),
  (5, 'Porter for the trek', 1200, true),
  (7, 'Rain poncho', 250, true);
SELECT t.title, e.name AS extra, e.price_bdt, e.is_optional
FROM ct_tour_extras e
JOIN tours t ON t.tour_id = e.tour_id
ORDER BY t.tour_id, e.extra_id;`}
              caption="INSERT 5, তারপর ৫টা Row: Saint Martin Island Escape এর দুটো Extra, Sundarbans Mangrove Cruise এর Forest boat permit, Bandarban Hill Trek এর Porter, Ratargul Swamp Boat Day এর Rain poncho। এবার INSERT এ extra_id আর created_at লেখা হয়নি: প্রথমটা Database নিজে গুনে দিয়েছে, দ্বিতীয়টায় DEFAULT now() বসেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এ এই Table এর \d এখন অনেক ভরা। Nullable আর Default এর ঘর ভরেছে, আর নিচে তিনটা নতুন অংশ: Indexes, Check
              constraints, Foreign-key constraints। প্রতিটা নিয়মের একটা নামও আছে, যেটা PostgreSQL নিজে দিয়েছে। কন্টেইনারের
              PostgreSQL 18 এ আসল ফলাফল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: island_tours",
          code: `island_tours=# \\d ct_tour_extras
                                Table "public.ct_tour_extras"
   Column    |           Type           | Collation | Nullable |           Default
-------------+--------------------------+-----------+----------+------------------------------
 extra_id    | integer                  |           | not null | generated always as identity
 tour_id     | integer                  |           | not null |
 name        | text                     |           | not null |
 price_bdt   | numeric(8,2)             |           | not null |
 is_optional | boolean                  |           | not null | true
 created_at  | timestamp with time zone |           | not null | now()
Indexes:
    "ct_tour_extras_pkey" PRIMARY KEY, btree (extra_id)
Check constraints:
    "ct_tour_extras_price_bdt_check" CHECK (price_bdt >= 0::numeric)
Foreign-key constraints:
    "ct_tour_extras_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES tours(tour_id)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              রুমানার free এই Table এ ঢুকবে? Type এর পাহারা এখনো সবার আগে। উপরের বক্স চালানোর পরে নিচেরটা চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাহারা এখনো আছে"
              query={`INSERT INTO ct_tour_extras (tour_id, name, price_bdt)
VALUES (2, 'Beach photographer', 'free');`}
              caption="ERROR: invalid input syntax for type numeric: &quot;free&quot;। নতুন নিয়মগুলোর আগেই Type মানটা ফিরিয়ে দিয়েছে। free এর জায়গায় 1000 লিখে চালালে INSERT 1 আসবে। (উপরের বক্স না চালিয়ে এটা চালালে Error হবে relation does not exist, কারণ Table টাই তখনো নেই।)"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষে ফারুক সাহেবের আসল প্রশ্ন, যেটা দিয়ে গল্প শুরু হয়েছিল: Extra থেকে কোন ট্যুরে কত আসতে পারে। নতুন Table টা
              এখন অন্য যেকোনো Table এর মতো, আগের Module এর সব কৌশল তার উপর চলে। LEFT JOIN (Module 06) যাতে Extra নেই এমন
              ট্যুরও থাকে, আর GROUP BY (Module 05)।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ট্যুর প্রতি Extra"
              query={`SELECT t.title, count(e.extra_id) AS extras, coalesce(sum(e.price_bdt), 0) AS extras_bdt
FROM tours t
LEFT JOIN ct_tour_extras e ON e.tour_id = t.tour_id
WHERE t.is_active
GROUP BY t.tour_id, t.title
ORDER BY t.tour_id;`}
              caption="৮টা Row, সক্রিয় ৮টা ট্যুর। Saint Martin Island Escape এ 2টা Extra, 1100.00 টাকা। Sundarbans এ 1500.00, Bandarban এ 1200.00, Ratargul এ 250.00। বাকি চারটা ট্যুরে 0। পুরো বক্সটা চলে উপরের পুরো রূপের বক্স চালানোর পরে।"
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
                  Website এর জন্য ফারুক সাহেব প্রতিটা সক্রিয় ট্যুরের একটা Card চান। CREATE TABLE AS দিয়ে{" "}
                  <code className={CODE}>ct_ch_tour_cards</code> বানান, এই ক্রমে পাঁচটা Column: tour_id, title, Destination
                  এর নাম <code className={CODE}>destination</code> নামে, price_bdt, আর <code className={CODE}>is_long</code>,
                  যেটা হ্যাঁ/না বলে ট্যুরটা ৩ দিন বা তার বেশি কিনা। শুধু is_active ট্যুর। শেষের SELECT নতুন Table এর Column এর
                  নাম, Type আর মোট Row সংখ্যা দেখায়, সেটা শেষে রাখুন।
                </>
              }
              hint={
                <>
                  tours আর destinations এর JOIN, WHERE t.is_active। is_long এর জন্য একটা তুলনা লিখুন, যেমন duration_days
                  &gt;= 3, আর তার একটা Alias দিন। তুলনার ফল নিজেই boolean, তাই CASE লাগে না। Alias না দিলে Column এর নাম
                  চেকের সাথে মিলবে না।
                </>
              }
              starter={`DROP TABLE IF EXISTS ct_ch_tour_cards;
-- এখানে CREATE TABLE ct_ch_tour_cards AS ... লিখুন

SELECT column_name, data_type,
       (SELECT count(*) FROM ct_ch_tour_cards) AS row_count
FROM information_schema.columns
WHERE table_name = 'ct_ch_tour_cards'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('tour_id', 'integer', 8),
  ('title', 'text', 8),
  ('destination', 'text', 8),
  ('price_bdt', 'numeric', 8),
  ('is_long', 'boolean', 8)
) AS v(column_name, data_type, row_count);`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা নতুন Table বানানোর সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নগুলো লিখুন, SQL না",
              description:
                "যাঁরা Table টা ব্যবহার করবেন তাঁদের সাথে বসে লিখুন প্রতিটা Row সম্পর্কে কী কী জানতে চান। প্রতিটা প্রশ্ন পরে একটা Column হবে।",
            },
            {
              title: "প্রতিটা প্রশ্ন থেকে একটা নাম",
              description:
                "snake_case, ছোট হাতের অক্ষর, পুরো শব্দ, উদ্ধৃতি ছাড়া। পরিচয় নম্বরে _id, এককে _bdt বা _days, হ্যাঁ/না তে is_, মুহূর্তে _at, তারিখে _on।",
            },
            {
              title: "প্রতিটা নামের জন্য Type",
              description:
                "দুটো প্রশ্ন: কী থাকবে, আর কী আটকাতে হবে। পূর্ণ সংখ্যা integer, টাকা numeric(p, s), লেখা text, তারিখ date, মুহূর্ত timestamptz, হ্যাঁ/না boolean।",
            },
            {
              title: "যার সাথে জোড়া লাগবে, তার Type দেখে নিন",
              description:
                "অন্য Table এর পরিচয় নম্বর রাখলে সেই Table এর Type হুবহু। information_schema.columns থেকে মিলিয়ে নিন।",
            },
            {
              title: "Statement লিখুন, প্রতি লাইনে একটা Column",
              description:
                "Type গুলো এক সারিতে সাজান, শেষ Column এর পরে কমা নেই। অনুশীলনের Script এ শুরুতে DROP TABLE IF EXISTS, আসল Data এর Table এ কখনো না।",
            },
            {
              title: "চালান, তারপর পড়ে যাচাই করুন",
              description:
                "psql এ \\d table_name, অথবা information_schema.columns। নাম, ক্রম আর Type যা লিখেছিলেন হুবহু তাই আছে কিনা দেখুন।",
            },
            {
              title: "ঠিক আর ভুল দুই ধরনের Row ঢুকিয়ে দেখুন",
              description:
                "একটা ঠিক Row ঢোকে কিনা, আর একটা ইচ্ছা করে ভুল Row আটকায় কিনা। কোনটা চুপচাপ গোল হয়ে যায় সেটাও খেয়াল করুন।",
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
            ["শেষ Column এর পরে কমা", "syntax error at or near \")\"", "শেষ Column এর পরে কমা নেই"],
            ["দুই Column এর মাঝে কমা নেই", "পরের Column এর নামের কাছে syntax error", "প্রতিটা Column এর পরে কমা, শেষটা ছাড়া"],
            ["Type এর বানান ভুল, যেমন integr", "type \"integr\" does not exist", "Type এর পুরো নাম, বা int"],
            ["একই নাম দুই Column এ", "column specified more than once", "প্রতিটা Column এর আলাদা নাম"],
            ["user, order, desc নামে Table বা Column", "syntax error at or near সেই শব্দ", "users, bookings, description এর মতো নাম"],
            ["উদ্ধৃতি দিয়ে বড় হাতের নাম", "পরে উদ্ধৃতি ভুললেই relation does not exist", "snake_case, উদ্ধৃতি কখনো না"],
            ["IF NOT EXISTS কে বদল ভাবা", "পুরনো সংজ্ঞা চুপচাপ থেকে যায়", "\\d দিয়ে যাচাই, বদলের জন্য Migration"],
            ["CREATE TABLE AS কে পূর্ণ কপি ভাবা", "NOT NULL, PRIMARY KEY, CHECK, DEFAULT হারায়", "খালি কপি চাইলে LIKE ... INCLUDING ALL"],
            ["TEMP Table আসল Table এর নামে", "সেই Session এ আসল Table ঢাকা পড়ে", "TEMP Table এর আলাদা নাম"],
            ["টাকা integer বা real এ", "দশমিক গোল হয়ে যায় বা হিসাব নড়ে", "numeric(p, s), Lesson 03"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS ct_feedback;
CREATE TABLE ct_feedback (
  feedback_id integer,
  user        text,
  rating      smallint,
);`}
              caption="এখানে দুটো ভুল। প্রথমে ERROR: syntax error at or near &quot;user&quot;। user এর জায়গায় customer_name লিখে আবার চালান। এবার ERROR: syntax error at or near &quot;)&quot;, দ্বিতীয় ভুলটা: smallint এর পরের কমা। সেটা মুছলে শুধু CREATE আসবে। PostgreSQL একবারে একটা ভুলই দেখায়, প্রথম যেটায় আটকায়।"
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
                    href="https://www.postgresql.org/docs/current/ddl-basics.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Basics
                  </a>
                  : Table, Column আর Type এর ছোট আর পরিষ্কার পরিচয়, এই লেসনের প্রথম তিন Section এর আনুষ্ঠানিক রূপ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-createtable.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: CREATE TABLE
                  </a>
                  : পুরো Syntax, IF NOT EXISTS, TEMPORARY আর ON COMMIT, LIKE এর প্রতিটা INCLUDING। লম্বা Page, কিন্তু এই Module
                  এর বাকি লেসনগুলো পড়তে পড়তে বারবার এখানে আসবেন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-createtableas.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: CREATE TABLE AS
                  </a>
                  : WITH NO DATA, Column এর নাম বদলানো, আর কেন এটা View না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Lexical Structure
                  </a>
                  : Identifier এর নিয়ম, ছোট হাতে ভাঁজ হওয়া, উদ্ধৃতি, আর ৬৩ byte এর সীমা, সব এক জায়গায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-keywords-appendix.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SQL Key Words
                  </a>
                  : প্রতিটা Keyword PostgreSQL আর SQL Standard এ সংরক্ষিত কিনা, একটা বড় Table এ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/infoschema-columns.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: information_schema.columns
                  </a>
                  : এই লেসনে বারবার পড়া View এর প্রতিটা Column এর মানে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/create-table.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: CREATE TABLE Statement
                  </a>
                  {" "}আর{" "}
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Identifier Case Sensitivity
                  </a>
                  : MySQL এ Table বানানো, আর কোন Operating System এ নাম বড় হাত ছোট হাত মানে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে Table বানানোর অংশটা দেখার সময় খেয়াল করুন কোন Type গুলো এই লেসন থেকে আলাদা
                  (INT, DECIMAL, VARCHAR), আর নামগুলো এই লেসনের নিয়ম মানে কিনা।
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
                  Table এর দুই অংশ: সংজ্ঞা আর Row। CREATE TABLE সংজ্ঞাটা লেখে, একবার। তারপর প্রতিটা Row কে সেই সংজ্ঞা মানতে
                  হয়। CREATE, ALTER, DROP মিলে DDL।
                </ListItem>
                <ListItem>
                  গঠন: CREATE TABLE নাম ( Column Type, Column Type ); শেষ Column এর পরে কমা নেই। প্রতিটা Column এ অন্তত নাম
                  আর Type।
                </ListItem>
                <ListItem>
                  Type বাছতে দুই প্রশ্ন: কী থাকবে, কী আটকাতে হবে। integer, numeric(p, s), text, date, timestamptz, boolean
                  দিয়ে শুরু। প্রতিটা পরিবারের নিজের লেসন সামনে।
                </ListItem>
                <ListItem>
                  Type চেহারা পাহারা দেয়: free বা 2026-02-30 আটকায়। কিন্তু বদলানো যায় এমন মান চুপচাপ বদলায়: 2.5 integer এ 3,
                  99.999 numeric(8, 2) এ 100.00।
                </ListItem>
                <ListItem>
                  উদ্ধৃতি ছাড়া নাম ছোট হাতে ভাঁজ হয়, উদ্ধৃতি দিলে হুবহু থাকে আর তারপর চিরকাল উদ্ধৃতি লাগে। তাই snake_case,
                  উদ্ধৃতি কখনো না। নামের সীমা ৬৩ byte, বেশি হলে নিঃশব্দে কাটা পড়ে।
                </ListItem>
                <ListItem>
                  user, order, desc এর মতো সংরক্ষিত শব্দ নাম হিসেবে চলে না। pg_get_keywords() তালিকা দেয়। উদ্ধৃতি দিয়ে
                  চালানো যায়, কিন্তু নাম বদলানোই ঠিক।
                </ListItem>
                <ListItem>
                  IF NOT EXISTS শুধু নাম দেখে, সংজ্ঞা না। CREATE TABLE AS Row আর Type কপি করে, নিয়ম না, আর একবারই চলে।
                  LIKE গঠন আর NOT NULL কপি করে, INCLUDING দিলে আরও, Row আর Foreign Key কখনো না।
                </ListItem>
                <ListItem>
                  TEMP Table শুধু নিজের Session এর, Session শেষে নিজেই মুছে যায়, আর একই নামের আসল Table কে ঢেকে দেয়। ON
                  COMMIT DROP দিলে আয়ু শুধু একটা Transaction।
                </ListItem>
                <ListItem>
                  বানানো Table পড়ার তিন উপায়, তিনটাই Catalog পড়ে: psql এর \d, information_schema, আর pg_dump --schema-only।
                  MySQL এ DESCRIBE আর SHOW CREATE TABLE, আর সেখানে CREATE TABLE নিজে থেকে Commit করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে Type গুলোর শুধু চেনা পরিচয় হয়েছে। কিন্তু দেখেছেন একটা ভুল Type কী করতে পারে: 2.5 নিঃশব্দে 3,
                99.999 নিঃশব্দে 100.00। টাকা, আসন, শতাংশ, স্থানাঙ্ক, প্রতিটার জন্য কোন সংখ্যার Type, কোথায় তার সীমা, সীমা
                পেরোলে কী Error, আর কেন টাকা কখনো float এ না, সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/numeric-types" className={LINK}>
                  Numeric Types
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
      ["DDL", "Data না, Data এর কাঠামো বানানোর আদেশ", "CREATE TABLE ct_tour_extras"],
      ["সংজ্ঞা আর Row", "সংজ্ঞা একবার লেখা, প্রতিটা Row তাকে মানে", "price_bdt এ free ঢোকেনি"],
      ["গঠন", "নাম ( Column Type, ... ), শেষে কমা নেই", "শেষের কমায় syntax error at or near \")\""],
      ["Type বাছাই", "কী থাকবে, কী আটকাবে", "price_bdt numeric(8, 2), is_optional boolean"],
      ["নিঃশব্দ বদল", "বদলানো গেলে Type নিজেই বদলায়", "2.5 থেকে 3, 99.999 থেকে 100.00"],
      ["Case Folding", "উদ্ধৃতি ছাড়া নাম ছোট হাতে", "CT_TourExtras হলো ct_tourextras"],
      ["উদ্ধৃতি দেওয়া নাম", "হুবহু থাকে, চিরকাল উদ্ধৃতি লাগে", "Ct_PhotoPackages খুঁজলে relation does not exist"],
      ["নামের সীমা", "৬৩ byte, বেশি হলে কাটা", "শেষের n_bdt হারাল"],
      ["সংরক্ষিত শব্দ", "R চিহ্নের শব্দ নাম হতে পারে না", "user এ syntax error, user একা লিখলে postgres"],
      ["IF NOT EXISTS", "নাম থাকলে কিছুই না, সংজ্ঞা দেখে না", "ct_waitlist এ ২টাই Column রইল"],
      ["CREATE TABLE AS", "Query এর ফলাফল একবার, নিয়ম ছাড়া", "ct_tour_summary, SELECT 9, সব YES"],
      ["LIKE", "গঠন আর NOT NULL, INCLUDING দিলে আরও", "INCLUDING ALL এ 1 PK, 3 CHECK, 0 FK"],
      ["TEMP Table", "নিজের Session এ, শেষে নিজেই মোছে", "ct_cart থাকে pg_temp Schema তে"],
      ["পড়ে যাচাই", "\\d, information_schema, pg_dump", "format_type দেয় numeric(8,2)"],
      ["MySQL", "Backtick, DESCRIBE, Implicit Commit", "ROLLBACK এর পরেও ct_trial রয়ে গেল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "CREATE TABLE ct_x (a integer, b text,); চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Table বানানো হয়, শেষের কমা উপেক্ষা করা হয়",
            isCorrect: false,
            explanation: "PostgreSQL শেষের কমা উপেক্ষা করে না।",
          },
          {
            key: "B",
            text: "ERROR: syntax error at or near \")\"",
            isCorrect: true,
            explanation:
              "ঠিক। কমার পরে PostgreSQL একটা Column এর নাম আশা করে, পায় বন্ধনী। Error এর তীরচিহ্ন বন্ধনীর নিচে, কিন্তু ভুলটা তার আগের কমায়।",
          },
          {
            key: "C",
            text: "একটা খালি তৃতীয় Column তৈরি হয়",
            isCorrect: false,
            explanation: "নাম আর Type ছাড়া Column হয় না।",
          },
          {
            key: "D",
            text: "ERROR: column specified more than once",
            isCorrect: false,
            explanation: "এটা আসে দুটো Column এর নাম একই হলে।",
          },
        ],
      },
      {
        id: 2,
        text: "CREATE TABLE CT_TourExtras (ExtraName text); চালানোর পরে কোন Query টা Table টা খুঁজে পাবে?",
        options: [
          {
            key: "A",
            text: "শুধু SELECT * FROM \"CT_TourExtras\";",
            isCorrect: false,
            explanation: "উদ্ধৃতি দিলে হুবহু CT_TourExtras খোঁজা হয়, অথচ Table টা আছে ct_tourextras নামে। এটা Error দেবে।",
          },
          {
            key: "B",
            text: "SELECT * FROM ct_tourextras; আর SELECT * FROM CT_TOUREXTRAS; দুটোই",
            isCorrect: true,
            explanation:
              "ঠিক। উদ্ধৃতি ছাড়া লেখা নাম রাখার সময়ও ছোট হাতে ভাঁজ হয়েছিল, খোঁজার সময়ও হয়। তাই উদ্ধৃতি ছাড়া যেকোনো বানানে একই Table।",
          },
          {
            key: "C",
            text: "কোনোটাই না, বড় হাতের অক্ষর থাকায় Table বানানোই যায়নি",
            isCorrect: false,
            explanation: "বানানো গেছে, ছোট হাতের নামে।",
          },
          {
            key: "D",
            text: "শুধু SELECT * FROM CT_TourExtras; হুবহু একই বানানে",
            isCorrect: false,
            explanation: "এটাও চলে, কিন্তু একমাত্র না।",
          },
        ],
      },
      {
        id: 3,
        text: "CREATE TABLE \"Ct_PhotoPackages\" (...); এর পরে SELECT * FROM Ct_PhotoPackages; চালালে কী আসে?",
        options: [
          {
            key: "A",
            text: "খালি ফলাফল, Table টা পাওয়া যায়",
            isCorrect: false,
            explanation: "উদ্ধৃতি ছাড়া নামটা ct_photopackages হয়ে যায়, সেই নামে কিছু নেই।",
          },
          {
            key: "B",
            text: "ERROR: syntax error",
            isCorrect: false,
            explanation: "লেখায় ভুল নেই, Table টা শুধু পাওয়া যায়নি।",
          },
          {
            key: "C",
            text: "ERROR: relation \"ct_photopackages\" does not exist",
            isCorrect: true,
            explanation:
              "ঠিক। Error এ নামটা ছোট হাতে, সেটাই সূত্র: PostgreSQL ভাঁজ করা নামটা খুঁজেছে। প্রতিবার \"Ct_PhotoPackages\" উদ্ধৃতি সহ লিখতে হবে।",
          },
          {
            key: "D",
            text: "PostgreSQL নিজে থেকে উদ্ধৃতি ধরে নিয়ে Table টা পড়ে",
            isCorrect: false,
            explanation: "ধরে নেয় না, শুধু Column এর বেলায় একটা HINT দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "ct_waitlist আগে থেকে আছে দুই Column নিয়ে। এবার CREATE TABLE IF NOT EXISTS ct_waitlist (...) চার Column দিয়ে চালালেন। কী হয়?",
        options: [
          {
            key: "A",
            text: "নতুন দুটো Column যোগ হয়",
            isCorrect: false,
            explanation: "IF NOT EXISTS কখনো Table বদলায় না। Column যোগ হয় ALTER TABLE দিয়ে।",
          },
          {
            key: "B",
            text: "পুরনো Table মুছে নতুন চার Column এর Table বানানো হয়",
            isCorrect: false,
            explanation: "কিছুই মোছা হয় না।",
          },
          {
            key: "C",
            text: "ERROR: relation already exists",
            isCorrect: false,
            explanation: "IF NOT EXISTS ঠিক এই Error টাকেই চাপা দেয়।",
          },
          {
            key: "D",
            text: "কিছুই হয় না, শুধু একটা NOTICE, আর Table এ দুই Column ই থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। IF NOT EXISTS শুধু নাম দেখে। লেসনের বক্সে information_schema তে customer_id আর tour_id ছাড়া কিছু আসেনি।",
          },
        ],
      },
      {
        id: 5,
        text: "seats integer Column এ INSERT এর মান 2.5 পাঠালেন। কী হয়?",
        options: [
          {
            key: "A",
            text: "ERROR: invalid input syntax for type integer",
            isCorrect: false,
            explanation: "সংখ্যা 2.5 integer এ বদলানো যায়, তাই Error নেই।",
          },
          {
            key: "B",
            text: "3 জমা হয়, কোনো সতর্কবার্তা ছাড়া",
            isCorrect: true,
            explanation:
              "ঠিক। numeric থেকে integer এ বদলানোর সময় PostgreSQL গোল করে। লেসনের বক্সে 2.5 হয়ে গেছে 3। এমন মান আটকাতে চাইলে CHECK বা সঠিক Type লাগে।",
          },
          {
            key: "C",
            text: "2 জমা হয়, দশমিক অংশ কেটে ফেলা হয়",
            isCorrect: false,
            explanation: "কাটা হয় না, গোল করা হয়।",
          },
          {
            key: "D",
            text: "2.5 ই জমা হয়",
            isCorrect: false,
            explanation: "integer এ দশমিকের জায়গা নেই।",
          },
        ],
      },
      {
        id: 6,
        text: "CREATE TABLE ct_copy AS SELECT * FROM tours; এর পরে ct_copy তে কী থাকে?",
        options: [
          {
            key: "A",
            text: "৯টা Row আর একই Column ও Type, কিন্তু NOT NULL, PRIMARY KEY, CHECK, DEFAULT কিছুই না",
            isCorrect: true,
            explanation:
              "ঠিক। CREATE TABLE AS Query এর ফলাফল কপি করে, নিয়ম না। লেসনের বক্সে ct_tour_summary এর সব Column এ is_nullable YES।",
          },
          {
            key: "B",
            text: "tours এর হুবহু কপি, সব নিয়ম সহ",
            isCorrect: false,
            explanation: "নিয়ম সহ খালি কপি দেয় LIKE INCLUDING ALL, তাও Foreign Key ছাড়া।",
          },
          {
            key: "C",
            text: "tours এর একটা জীবন্ত রূপ, tours বদলালে এটাও বদলায়",
            isCorrect: false,
            explanation: "এটা View এর কাজ। CREATE TABLE AS একবারই চলে।",
          },
          {
            key: "D",
            text: "শুধু Column গুলো, কোনো Row না",
            isCorrect: false,
            explanation: "সেটা হয় WITH NO DATA বা LIKE দিয়ে।",
          },
        ],
      },
      {
        id: 7,
        text: "psql এর Session A তে CREATE TEMP TABLE ct_cart ... চালানো হলো। একই সময়ে Session B তে SELECT * FROM ct_cart; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "A এর Row গুলো দেখা যায়",
            isCorrect: false,
            explanation: "TEMP Table শুধু যে Session বানায় তার।",
          },
          {
            key: "B",
            text: "খালি ফলাফল, Table আছে কিন্তু B এর জন্য Row নেই",
            isCorrect: false,
            explanation: "B এর কাছে Table টাই নেই।",
          },
          {
            key: "C",
            text: "ERROR: relation \"ct_cart\" does not exist",
            isCorrect: true,
            explanation:
              "ঠিক। Table টা থাকে A এর নিজের pg_temp Schema তে। Catalog এ B তার অস্তিত্ব দেখতে পায়, কিন্তু নাম ধরে পড়তে পারে না। A বের হলে Table টা পুরো মুছে যায়।",
          },
          {
            key: "D",
            text: "B এর জন্য একটা আলাদা খালি ct_cart নিজে থেকে বানানো হয়",
            isCorrect: false,
            explanation: "নিজে থেকে কিছু বানানো হয় না।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ START TRANSACTION; CREATE TABLE ct_trial (a INT); ROLLBACK; এর পরে ct_trial এর কী অবস্থা?",
        options: [
          {
            key: "A",
            text: "নেই, PostgreSQL এর মতোই ROLLBACK তাকে ফিরিয়ে নিয়েছে",
            isCorrect: false,
            explanation: "PostgreSQL এ তাই হতো, MySQL এ না।",
          },
          {
            key: "B",
            text: "আছে, কারণ MySQL এ CREATE TABLE নিজে থেকে Commit করে, ROLLBACK এর কিছু ফেরানোর থাকে না",
            isCorrect: true,
            explanation:
              "ঠিক। এর নাম Implicit Commit। লেসনের MySQL কন্টেইনারে ROLLBACK এর পরে SHOW TABLES এ ct_trial রয়ে গেছে।",
          },
          {
            key: "C",
            text: "ROLLBACK এ Error আসে",
            isCorrect: false,
            explanation: "Error আসে না, শুধু কিছু ফেরানো হয় না।",
          },
          {
            key: "D",
            text: "Table আছে কিন্তু তার Column গুলো মুছে গেছে",
            isCorrect: false,
            explanation: "Table পুরোটাই থাকে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Guide দের সার্টিফিকেটের Table",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>প্রশ্ন থেকে নকশা:</strong> Island Tours প্রতিটা Guide এর প্রশিক্ষণের সার্টিফিকেট রাখতে চায়: কোন Guide, কোন
        সার্টিফিকেট, কবে পেয়েছেন, কবে মেয়াদ শেষ, ফি কত টাকা। আগে প্রশ্নগুলো লিখুন, তারপর প্রতিটা থেকে Column এর নাম আর Type,
        প্রতিটার পাশে এক লাইনে কেন এই Type।
      </span>,
      <span key="2">
        <strong>Table বানানো আর যাচাই:</strong> ct_guide_certificates বানান, \d দিয়ে পড়ুন, guides এর guide_id এর সাথে
        Type মেলান। দুটো ঠিক আর তিনটা ভুল Row (ভুল তারিখ, দামে লেখা, দশমিক সহ সংখ্যা) ঢুকিয়ে লিখুন কোনটা আটকাল, কোনটা
        চুপচাপ বদলাল।
      </span>,
      <span key="3">
        <strong>নামের মেরামত:</strong> এই সংজ্ঞাটা এই লেসনের নিয়মে আবার লিখুন, প্রতিটা বদলের কারণ সহ:{" "}
        <code className={CODE}>CREATE TABLE &quot;GuideCert&quot; (&quot;CertName&quot; text, desc text, &quot;user&quot; text, Fee float);</code>
      </span>,
      <span key="4">
        <strong>AS আর LIKE পাশাপাশি:</strong> confirmed Booking গুলো থেকে CREATE TABLE AS দিয়ে একটা Table, আর LIKE bookings
        INCLUDING ALL দিয়ে আরেকটা। দুটোর \d পাশাপাশি রেখে লিখুন কোনটায় কী এল আর কী এল না, আর bookings এর সাথে তুলনা করে কোন
        নিয়ম কোনোটাতেই আসেনি।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> ব্যাংকের ছাপানো ফর্মের উদাহরণ দিয়ে একজন বন্ধুকে বোঝান Table এর সংজ্ঞা আর Row কী,
        Type কেন একটা প্রতিশ্রুতি, আর কেন PostgreSQL এ নামে উদ্ধৃতি দেওয়া একটা ফাঁদ।
      </span>,
    ],
    deliverables: [
      <span key="d1">প্রশ্ন, Column আর Type এর তালিকা, প্রতিটার কারণ সহ</span>,
      <span key="d2">CREATE TABLE, \d এর ফলাফল, আর পাঁচটা INSERT এর ফলাফল</span>,
      <span key="d3">মেরামত করা সংজ্ঞা আর প্রতিটা বদলের এক লাইনের কারণ</span>,
      <span key="d4">দুটো \d পাশাপাশি আর তুলনার নোট</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ প্রথম Table",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম Table",
        description:
          "প্রথম ফাইলটা চালান। CREATE TABLE আসবে, তারপর \\d এ ৬টা Column, Nullable আর Default এর ঘর ফাঁকা।",
      },
      {
        title: "Type এর পাহারা",
        description:
          "দ্বিতীয় ফাইলের INSERT গুলো একটা একটা চালান। দুটো Error আর তিনটা সফল INSERT, শেষের SELECT এ গোল হওয়া মানগুলো খুঁজুন।",
      },
      {
        title: "নাম কীভাবে পড়া হয়",
        description:
          "তৃতীয় ফাইলে বড় হাতের নাম, উদ্ধৃতি দেওয়া নাম আর user। প্রতিটা ফলাফল মন্তব্যের সাথে মিলিয়ে নিন।",
      },
      {
        title: "IF NOT EXISTS এর NOTICE",
        description:
          "চতুর্থ ফাইলে একই Table তিনবার। দ্বিতীয়বারে ERROR, তৃতীয়বারে NOTICE, আর \\d এ মাত্র দুটো Column।",
      },
      {
        title: "AS আর LIKE",
        description:
          "পঞ্চম ফাইলে CREATE TABLE AS এর পরে SELECT 9, আর দুটো \\d। ct_tours_all এ Check constraints আছে, Foreign-key constraints নেই।",
      },
      {
        title: "দুটো Terminal, একটা TEMP Table",
        description:
          "দুটো আলাদা Terminal এ psql খুলুন। ষষ্ঠ ফাইলের প্রথম অংশ প্রথম Terminal এ, দ্বিতীয় অংশ দ্বিতীয়টায়। তারপর প্রথমটা থেকে \\q দিয়ে বের হয়ে দ্বিতীয়টায় আবার চালান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-table.sql",
        code: `CREATE TABLE ct_tour_extras (
  extra_id    integer,
  tour_id     integer,
  name        text,
  price_bdt   numeric(8, 2),
  is_optional boolean,
  created_at  timestamptz
);
-- CREATE TABLE

\\d ct_tour_extras
--  extra_id    | integer
--  tour_id     | integer
--  name        | text
--  price_bdt   | numeric(8,2)
--  is_optional | boolean
--  created_at  | timestamp with time zone`,
      },
      {
        language: "sql",
        filename: "02-type-guard.sql",
        code: `INSERT INTO ct_tour_extras (extra_id, tour_id, name, price_bdt, is_optional)
VALUES (1, 1, 'Life jacket', 300, true);
-- INSERT 0 1

INSERT INTO ct_tour_extras (extra_id, tour_id, name, price_bdt, is_optional)
VALUES (2, 2, 'Beach photographer', 'free', true);
-- ERROR:  invalid input syntax for type numeric: "free"

CREATE TABLE ct_departure_dates (tour_id integer, starts_on date);
INSERT INTO ct_departure_dates VALUES (1, '2026-02-30');
-- ERROR:  date/time field value out of range: "2026-02-30"

CREATE TABLE ct_quiet (seats integer, price_bdt numeric(8, 2), is_optional boolean, note text);
INSERT INTO ct_quiet VALUES ('4', 12.5, 'yes', 42);
-- INSERT 0 1
INSERT INTO ct_quiet VALUES (2.5, 99.999, 'off', 3.14);
-- INSERT 0 1
SELECT * FROM ct_quiet;
--  4 | 12.50  | t | 42
--  3 | 100.00 | f | 3.14`,
      },
      {
        language: "sql",
        filename: "03-names.sql",
        code: `CREATE TABLE CT_TourExtras (ExtraName text);
\\dt ct_tour*
-- ct_tour_extras আর ct_tourextras, দুটোই ছোট হাতে

CREATE TABLE "Ct_PhotoPackages" ("PackageName" text);
SELECT * FROM Ct_PhotoPackages;
-- ERROR:  relation "ct_photopackages" does not exist
SELECT * FROM "Ct_PhotoPackages";
-- (0 rows)

CREATE TABLE user (user_id integer);
-- ERROR:  syntax error at or near "user"
SELECT user;
-- postgres (অথবা যে নামে আপনি Login করেছেন)`,
      },
      {
        language: "sql",
        filename: "04-if-not-exists.sql",
        code: `CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
-- CREATE TABLE
CREATE TABLE ct_waitlist (customer_id integer, tour_id integer);
-- ERROR:  relation "ct_waitlist" already exists
CREATE TABLE IF NOT EXISTS ct_waitlist (customer_id integer, tour_id integer, seats smallint);
-- NOTICE:  relation "ct_waitlist" already exists, skipping
-- CREATE TABLE
\\d ct_waitlist
--  customer_id | integer
--  tour_id     | integer`,
      },
      {
        language: "sql",
        filename: "05-as-and-like.sql",
        code: `CREATE TABLE ct_tour_summary AS
SELECT t.tour_id, t.title, ds.name AS destination, t.price_bdt
FROM tours t
JOIN destinations ds ON ds.destination_id = t.destination_id;
-- SELECT 9

\\d ct_tour_summary
--  tour_id     | integer
--  title       | text
--  destination | text
--  price_bdt   | numeric(10,2)
-- Nullable এর ঘর সব ফাঁকা

CREATE TABLE ct_tours_all (LIKE tours INCLUDING ALL);
-- CREATE TABLE
\\d ct_tours_all
-- Indexes: "ct_tours_all_pkey" PRIMARY KEY, btree (tour_id)
-- Check constraints: tours_duration_days_check, tours_max_seats_check, tours_price_bdt_check
-- Foreign-key constraints এর অংশটাই নেই
SELECT count(*) FROM ct_tours_all;
-- 0`,
      },
      {
        language: "sql",
        filename: "06-temp-two-terminals.sql",
        code: `-- Terminal 1
CREATE TEMP TABLE ct_cart (tour_id integer, seats smallint);
INSERT INTO ct_cart VALUES (1, 2), (5, 1);
SELECT * FROM ct_cart;
-- (2 rows)

-- Terminal 2, Terminal 1 খোলা থাকা অবস্থায়
SELECT * FROM ct_cart;
-- ERROR:  relation "ct_cart" does not exist
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'ct_cart';
-- pg_temp_N | ct_cart   (N একটা সংখ্যা, Connection ভেদে আলাদা)

-- Terminal 1 এ \\q, তারপর Terminal 2 এ আবার
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'ct_cart';
-- (0 rows)`,
      },
    ],
    tip: "ড্রিল শেষে নিজের বানানো ct_ Table গুলো মুছে ফেলতে পারেন: \\dt ct_* দিয়ে তালিকা দেখে প্রতিটার জন্য DROP TABLE নাম; লিখুন। উদ্ধৃতি দেওয়া Table টার বেলায় DROP TABLE \"Ct_PhotoPackages\"; উদ্ধৃতি সহ। DROP এর পুরো গল্প Lesson 11 এ।",
  },
};
