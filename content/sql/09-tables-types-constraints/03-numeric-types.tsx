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
  NumtypeDriftLab,
  NumtypeOverflowLab,
  NumtypeRoundingLab,
} from "../../../components/course/topics/ddl/numtype-animations";
import {
  NumtypeChooserDiagram,
  NumtypeExactVsNearestDiagram,
  NumtypeFamilyDiagram,
  NumtypePrecisionScaleDiagram,
  NumtypeRangeDiagram,
} from "../../../components/course/topics/ddl/numtype-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const MYSQL_SESSION = `-- MySQL 8.4.11, island-tours.mysql.sql Load করা, sql_mode Default (STRICT_TRANS_TABLES সহ)
CREATE TABLE num_mysql (
  seats TINYINT UNSIGNED,
  small SMALLINT,
  price DECIMAL(5,2),
  f     FLOAT,
  d     DOUBLE
);

INSERT INTO num_mysql (seats) VALUES (256);
-- ERROR 1264 (22003): Out of range value for column 'seats' at row 1
INSERT INTO num_mysql (seats) VALUES (-1);
-- ERROR 1264 (22003): Out of range value for column 'seats' at row 1

INSERT INTO num_mysql (price) VALUES (123.456);
-- Query OK, 1 row affected, 1 warning
SHOW WARNINGS;
-- Note | 1265 | Data truncated for column 'price' at row 1
-- (জমা হয়েছে 123.46, PostgreSQL এর মতোই গোল, শুধু MySQL একটা Note রেখে যায়)

INSERT INTO num_mysql (price) VALUES (1000);
-- ERROR 1264 (22003): Out of range value for column 'price' at row 1

INSERT INTO num_mysql (f, d) VALUES (0.1, 0.1), (16777217, 16777217);
SELECT f, d, f = 0.1 AS f_eq, d = 0.1 AS d_eq FROM num_mysql WHERE f IS NOT NULL;
-- +----------+----------+------+------+
-- | f        | d        | f_eq | d_eq |
-- +----------+----------+------+------+
-- |      0.1 |      0.1 |    0 |    1 |
-- | 16777200 | 16777217 |    0 |    0 |
-- +----------+----------+------+------+

-- Strict Mode বন্ধ করলে
SET SESSION sql_mode = '';
INSERT INTO num_mysql (seats, small, price) VALUES (300, 40000, 12345.678);
-- Query OK, 1 row affected, 3 warnings
-- Warning | 1264 | Out of range value for column 'seats' at row 1
-- Warning | 1264 | Out of range value for column 'small' at row 1
-- Warning | 1264 | Out of range value for column 'price' at row 1
INSERT INTO num_mysql (seats) VALUES (-5);
-- Query OK, 1 row affected, 1 warning
SELECT seats, small, price FROM num_mysql WHERE seats IS NOT NULL;
-- +-------+-------+--------+
-- | seats | small | price  |
-- +-------+-------+--------+
-- |   255 | 32767 | 999.99 |
-- |     0 |  NULL |   NULL |
-- +-------+-------+--------+
SET SESSION sql_mode = DEFAULT;`;

const MYSQL_TRAPS = `-- MySQL 8.4.11: আরও তিনটা ফাঁদ

-- ১. শুধু DECIMAL মানে DECIMAL(10,0)
CREATE TABLE num_dec (x DECIMAL);
SHOW CREATE TABLE num_dec;
-- \`x\` decimal(10,0) DEFAULT NULL
INSERT INTO num_dec VALUES (12.5);
-- Query OK, 1 row affected, 1 warning
SELECT x FROM num_dec;
-- 13

-- ২. দুটো UNSIGNED এর বিয়োগ ঋণাত্মক হলে Error
CREATE TABLE num_seats (seats_left TINYINT UNSIGNED, booked TINYINT UNSIGNED);
INSERT INTO num_seats VALUES (2, 5);
SELECT seats_left - booked FROM num_seats;
-- ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in
--   '(\`island_tours\`.\`num_seats\`.\`seats_left\` - \`island_tours\`.\`num_seats\`.\`booked\`)'
SELECT CAST(seats_left AS SIGNED) - CAST(booked AS SIGNED) AS diff FROM num_seats;
-- -3

-- ৩. যেগুলো Deprecated, লিখলে Warning 1681
CREATE TABLE num_old (a DECIMAL(10,2) UNSIGNED, b FLOAT(7,2), c INT(11));
SHOW WARNINGS;
-- UNSIGNED for decimal and floating point data types is deprecated ...
-- Specifying number of digits for floating point data types is deprecated ...
-- Integer display width is deprecated and will be removed in a future release.`;

export const numericTypesContent: TopicData = {
  id: "numeric-types",
  introduction: {
    badge: "MODULE 09 · LESSON 03",
    title: <SectionTitle>সংখ্যার Type: টাকা কেন numeric এ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি Table বানাতে শিখেছেন। Table এর প্রতিটা Column এর পাশে একটা Type লিখতে হয়, আর সংখ্যার
          জন্য PostgreSQL দেয় অনেকগুলো পছন্দ: smallint, integer, bigint, numeric, real, double precision, এমনকি money
          নামে একটা Type ও। নাম দেখে মনে হয় যেকোনোটা দিলেই চলবে। চলে না।
        </ContentParagraph>
        <ContentParagraph>
          ভুল Type এ কেউ Error দেখেন না, অন্তত শুরুতে না। দাম চুপচাপ গোল হয়ে যায়, মাস শেষের যোগফল এক পয়সা কম আসে,
          অথবা দুই বছর পরে একদিন সকালে কোনো একটা Column আর বড় সংখ্যা নিতে পারে না। এই লেসনে আপনি প্রতিটা Type এর
          ভেতরের নিয়মটা দেখবেন, প্রতিটার সীমা আর Error নিজের চোখে দেখবেন, আর শেষে Island Tours এর দাম, সিট, শতাংশ আর
          GPS এর জন্য ঠিক Type বেছে নিতে পারবেন।
        </ContentParagraph>
        <ContentParagraph>
          সংখ্যা দিয়ে হিসাব, মানে ভাগ, গোল করা আর Integer Division, এসব Module 04 এর{" "}
          <Link href="/sql/topic/numeric-functions" className={LINK}>
            Numeric Functions
          </Link>{" "}
          লেসনে শেখা হয়ে গেছে। এই লেসন সংখ্যা রাখার জায়গা নিয়ে: Column এর Type। সব উদাহরণ Island Tours এর Data তে,
          আর প্রতিটা নতুন Table এর নাম num_ দিয়ে শুরু, যাতে আসল Table এর সাথে কখনো না মেশে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি একটু ধীর, মানছি। কিন্তু আপনি আমাকে 0.10 দিলে আমি 0.10 ই রাখি, দশবার যোগ করলে ঠিক 1.00 ফেরত দিই। পয়সার হিসাবে এর চেয়ে বড় গুণ আমার জানা নেই।",
      author: "numeric",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>তানিমের তাড়াহুড়োর Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Manager ফারুক সাহেব জানালেন, এই মৌসুম থেকে Island Tours বড় দলের জন্য আলাদা
                দাম দেবে: পরিবার, স্কুলের ট্রিপ, অফিসের রিট্রিট। প্রতিটা দলের দাম ঠিক হবে আলোচনা করে, আর সেটা রাখতে হবে
                একটা নতুন Table এ। Developer তানিম এতদিন শুধু Query লিখেছেন, নিজে কখনো Table বানাননি। তিনি Internet এ
                একটা উদাহরণ দেখে দামের Column এর Type দিলেন real, কারণ দামে দশমিক থাকে আর real নামটা শুনতেও সংখ্যার
                মতো।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম সপ্তাহে কেউ কিছু টের পেলেন না। মাস শেষে অফিসের রিনা আপা Invoice বানাতে বসে দেখলেন, স্কুলের
                ট্রিপের দাম লেখা হয়েছিল 187500.50, কিন্তু Invoice এ আসছে 187500.00। অফিসের রিট্রিটের দাম 1234567.89,
                Invoice এ 1234570.00, মানে Customer কে 2.11 টাকা বেশি ধরা হচ্ছে। আর Screen এ দামটা দেখাচ্ছে
                1.2345679e+06, যেটা কোনো Customer কে দেখানো যায় না। কেউ কোনো Error দেখেননি, কারণ PostgreSQL কোনো Error
                দেয়নি। সে শুধু তাই রেখেছে, যা real এ রাখা সম্ভব।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে তানিমের Table টা হুবহু বানানো আছে। Run চাপুন, তারপর <code className={CODE}>amount</code>{" "}
                আর <code className={CODE}>invoice_amount</code> পাশাপাশি মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের real দিয়ে বানানো Table"
              query={`DROP TABLE IF EXISTS num_quick_fares;
CREATE TABLE num_quick_fares (
  fare_id integer,
  client  text,
  amount  real
);
INSERT INTO num_quick_fares VALUES
  (1, 'Family of four',    50000.00),
  (2, 'School trip',       187500.50),
  (3, 'Corporate retreat', 1234567.89);
SELECT fare_id, client, amount,
       amount::numeric(12, 2) AS invoice_amount
FROM num_quick_fares
ORDER BY fare_id;
SELECT sum(amount) AS total_real,
       50000.00 + 187500.50 + 1234567.89 AS total_exact
FROM num_quick_fares;`}
              caption="প্রথম Row ঠিক আছে: 50000 আর 50000.00। দ্বিতীয় Row তে amount দেখায় 187500.5, কিন্তু invoice_amount এ 187500.00, পঞ্চাশ পয়সা উধাও। তৃতীয় Row তে amount হলো 1.2345679e+06 আর invoice_amount 1234570.00। নিচের Table এ total_real দেখায় 1.4720684e+06, অথচ আসল যোগফল total_exact এ 1472068.39।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ঠিক কী হলো, সেটা এই লেসনের মাঝামাঝি পরিষ্কার হবে। আপাতত শুধু এটুকু জানুন: real প্রায় ছয়টা অঙ্ক পর্যন্ত
              বিশ্বাস করা যায়, আর 1234567.89 এ অঙ্ক নয়টা। তানিমের ভুল ঠিক করতে বদলাতে হয় একটাই শব্দ, real এর জায়গায়
              numeric(12, 2)। নিচের বক্সে Table, Data আর Query সব আগের মতো, শুধু Type আলাদা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Table, numeric দিয়ে"
              query={`DROP TABLE IF EXISTS num_fares;
CREATE TABLE num_fares (
  fare_id integer,
  client  text,
  amount  numeric(12, 2)
);
INSERT INTO num_fares VALUES
  (1, 'Family of four',    50000.00),
  (2, 'School trip',       187500.50),
  (3, 'Corporate retreat', 1234567.89);
SELECT fare_id, client, amount
FROM num_fares
ORDER BY fare_id;
SELECT sum(amount) AS total FROM num_fares;`}
              caption="এবার তিনটা দামই হুবহু: 50000.00, 187500.50, 1234567.89। যোগফল 1472068.39, পয়সা পর্যন্ত মিলে গেছে। বদল শুধু একটা শব্দে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Type মানে একটা কথা দেওয়া",
          content: (
            <ContentParagraph>
              Column এর Type লিখে আপনি Database কে কথা দিচ্ছেন: এই ঘরে কী ধরনের মান থাকবে, কত বড় হতে পারবে, কয় ঘর
              দশমিক পর্যন্ত হুবহু রাখতে হবে। Database সেই কথা অক্ষরে অক্ষরে মানে। কথাটা ভুল হলে সে ভুলটাও অক্ষরে অক্ষরে
              মানে। Module 03 থেকে 08 পর্যন্ত আপনি অন্যের বানানো Table পড়েছেন, তাই এই সিদ্ধান্তগুলো আগেই নেওয়া ছিল।
              এখন থেকে সিদ্ধান্তটা আপনার।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "four-families",
      subHeader: { index: "002", title: "Four Families" },
      title: <SectionTitle>সংখ্যা রাখার চার পরিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                PostgreSQL এর সংখ্যার Type গুলোকে চারটা পরিবারে ভাগ করা যায়। প্রতিটা পরিবার একটা প্রশ্নের উত্তর দেয়:
                মানটা পূর্ণসংখ্যা নাকি ভগ্নাংশ, আর ভগ্নাংশ হলে হুবহু নাকি আন্দাজে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পূর্ণসংখ্যা:</strong> smallint, integer আর bigint। দশমিক নেই। তিনজনের পার্থক্য শুধু কত বড়
                  সংখ্যা ধরে, সেখানে। দ্রুত আর হুবহু।
                </ListItem>
                <ListItem>
                  <strong>হুবহু দশমিক:</strong> numeric। প্রতিটা দশমিক অঙ্ক হুবহু রাখে, হাতে লেখা খাতার মতো। টাকার জন্য
                  এটাই।
                </ListItem>
                <ListItem>
                  <strong>আন্দাজি দশমিক:</strong> real আর double precision। মান রাখে Binary তে, খুব দ্রুত, অনেক বড় বা
                  অনেক ছোট সংখ্যা ধরে, কিন্তু 0.1 এর মতো সাধারণ দশমিকও হুবহু রাখতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>money:</strong> টাকার জন্য বানানো একটা আলাদা Type। নামে লোভনীয়, কাজে ঝামেলার। কেন, সেটা লেসনের
                  শেষ দিকে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeFamilyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই দাম, 12500.50, ছয়টা আলাদা Type এ বদলে দেখা যাক। সাথে Byte এর হিসাবও আছে:{" "}
              <code className={CODE}>pg_column_size</code> বলে দেয় একটা মান Disk এ কত জায়গা নেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই দাম, ছয়টা Type এ"
              query={`SELECT 12500.50::smallint         AS as_smallint,
       12500.50::integer          AS as_integer,
       12500.50::numeric(10, 2)   AS as_numeric,
       12500.50::real             AS as_real,
       12500.50::double precision AS as_double,
       12500.50::money            AS as_money;
SELECT pg_column_size(12500::smallint)         AS smallint_bytes,
       pg_column_size(12500::integer)          AS integer_bytes,
       pg_column_size(12500::bigint)           AS bigint_bytes,
       pg_column_size(12500.50::real)          AS real_bytes,
       pg_column_size(12500.50::double precision) AS double_bytes,
       pg_column_size(12500.50::money)         AS money_bytes;`}
              caption="as_smallint আর as_integer দুটোতেই 12501: পঞ্চাশ পয়সা গোল হয়ে পুরো এক টাকা, কোনো Warning ছাড়াই। as_numeric এ 12500.50, as_real আর as_double এ 12500.5, as_money তে $12,500.50। দ্বিতীয় Table এ Byte: smallint 2, integer 4, bigint 8, real 4, double 8, money 8।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুটো জিনিস চোখে পড়ার মতো। প্রথমত, পূর্ণসংখ্যার Type এ ভগ্নাংশ দিলে PostgreSQL Error দেয় না, গোল করে
                নেয়। দ্বিতীয়ত, money টাকার চিহ্ন হিসেবে বসিয়েছে ডলারের চিহ্ন। দুটো নিয়েই পরে বিস্তারিত আছে।
              </ContentParagraph>
              <ContentParagraph>
                numeric এর Byte এখানে দেখানো হয়নি, কারণ numeric এর আকার নির্দিষ্ট না। যত অঙ্ক, তত জায়গা। এই কারণেই
                numeric ধীর: CPU সরাসরি এর হিসাব করতে পারে না, PostgreSQL কে নিজে অঙ্ক ধরে ধরে হিসাব করতে হয়। Island
                Tours এর মাপের Data তে সেই ধীরতা টের পাওয়া যায় না।
              </ContentParagraph>
              <ContentParagraph>
                একই Type এর কয়েকটা নাম আছে। আপনি যে নামেই লিখুন, PostgreSQL ভেতরে একটা নামেই রাখে, আর{" "}
                <code className={CODE}>\d</code> বা information_schema তে সেই নামটাই দেখায়। এই লেসনে সবসময় পুরো নাম
                ব্যবহার করা হবে, কারণ পড়তে সেগুলোই পরিষ্কার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা লেখা যায়", "PostgreSQL যে নামে রাখে", "Byte"],
          rows: [
            ["smallint, int2", "smallint", "2"],
            ["integer, int, int4", "integer", "4"],
            ["bigint, int8", "bigint", "8"],
            ["numeric(p, s), decimal(p, s)", "numeric(p,s)", "অঙ্ক অনুযায়ী"],
            ["real, float4, float(1) থেকে float(24)", "real", "4"],
            ["double precision, float8, float, float(25) থেকে float(53)", "double precision", "8"],
            ["money", "money", "8"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "integer-family",
      subHeader: { index: "003", title: "The Integer Family" },
      title: <SectionTitle>smallint, integer, bigint: একই পরিবার, তিন মাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনটাই পূর্ণসংখ্যা রাখে, ধনাত্মক আর ঋণাত্মক দুটোই। পার্থক্য শুধু জায়গায়: smallint নেয় 2 Byte, integer
              4 Byte, bigint 8 Byte। জায়গা যত বেশি, তত বড় সংখ্যা ধরে। নিচের সীমাগুলো মুখস্থ করার দরকার নেই, কিন্তু
              মুখে বলা সংখ্যাগুলো মনে রাখা কাজে দেয়: ৩২ হাজার, ২১৪ কোটি, আর তারপর কার্যত অসীম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Type", "Byte", "সর্বনিম্ন", "সর্বোচ্চ", "মুখে বললে"],
          rows: [
            ["smallint", "2", "-32768", "32767", "প্রায় ৩২ হাজার"],
            ["integer", "4", "-2147483648", "2147483647", "প্রায় ২১৪ কোটি"],
            ["bigint", "8", "-9223372036854775808", "9223372036854775807", "প্রায় ৯২২ কোটি কোটি"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeRangeDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সীমাগুলো একবার নিজের চোখে দেখে রাখুন। নিচের বক্সে তিনটা Column, প্রতিটায় তার Type এর সবচেয়ে বড় আর
              সবচেয়ে ছোট মান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন ভাইয়ের সীমা"
              query={`DROP TABLE IF EXISTS num_counters;
CREATE TABLE num_counters (
  s smallint,
  i integer,
  b bigint
);
INSERT INTO num_counters VALUES (32767, 2147483647, 9223372036854775807);
INSERT INTO num_counters VALUES (-32768, -2147483648, -9223372036854775808);
SELECT s, i, b FROM num_counters;
SELECT pg_column_size(s) AS s_bytes,
       pg_column_size(i) AS i_bytes,
       pg_column_size(b) AS b_bytes
FROM num_counters
LIMIT 1;`}
              caption="দুটো Row: 32767, 2147483647, 9223372036854775807, আর ঋণাত্মক দিকে -32768, -2147483648, -9223372036854775808। ঋণাত্মক দিকে একটা বেশি ধরে, কারণ শূন্য বসে ধনাত্মক দিকের ভাগে। শেষ Table এ Byte: 2, 4, 8।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                কোনটা কখন? PostgreSQL এর Documentation এর পরামর্শ সোজা। সাধারণ পছন্দ integer, কারণ সীমা, জায়গা আর
                গতির মধ্যে এটাই সবচেয়ে ভালো ভারসাম্য। smallint তখন, যখন Disk এর জায়গা সত্যিই দামি। আর bigint তখন,
                যখন integer এর সীমায় কুলায় না।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ সিট, Rating আর দিনের সংখ্যা smallint, কারণ একটা ট্যুরে ৩২ হাজার সিট বা ৩২ হাজার দিন কখনো
                হবে না, আর Rating তো 1 থেকে 5। সব Table এর id integer, কারণ ছোট একটা ব্যবসার জন্য ২১৪ কোটি Booking অনেক
                দূরের কথা। কিন্তু যে Table এ প্রতি সেকেন্ডে হাজার Row ঢোকে, যেমন Website এর প্রতিটা Click এর Log, সেখানে
                id শুরু থেকেই bigint রাখা ভালো। কেন, সেটা পরের Section এর গল্পে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "PostgreSQL এ UNSIGNED আর tinyint নেই",
          content: (
            <ContentParagraph>
              MySQL এ সংখ্যার পাশে UNSIGNED লিখে ঋণাত্মক মান বন্ধ করা যায়, আর tinyint নামে 1 Byte এর একটা Type আছে।
              PostgreSQL এ দুটোর কোনোটাই নেই। <code className={CODE}>integer unsigned</code> লিখলে আসে{" "}
              <code className={CODE}>{'ERROR: syntax error at or near "unsigned"'}</code>, আর tinyint লিখলে{" "}
              <code className={CODE}>{'type "tinyint" does not exist'}</code>। ঋণাত্মক মান আটকাতে PostgreSQL এ লেখা হয়{" "}
              <code className={CODE}>CHECK (seats_left {">="} 0)</code>, ঠিক যেমন Island Tours এর departures Table এ আছে।
              CHECK এর পুরো আলোচনা{" "}
              <Link href="/sql/topic/basic-constraints" className={LINK}>
                Lesson 07
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "out-of-range",
      subHeader: { index: "004", title: "Out of Range" },
      title: <SectionTitle>এক বেশি দিলেই Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সীমার বাইরের মান দিলে কী হয়? PostgreSQL সোজা না বলে দেয়। নিচের বক্সে smallint Column এ প্রথমে 32767,
              তারপর 32768।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সীমার এক বেশি"
              query={`DROP TABLE IF EXISTS num_counters;
CREATE TABLE num_counters (
  s smallint,
  i integer,
  b bigint
);
INSERT INTO num_counters (s) VALUES (32767);
INSERT INTO num_counters (s) VALUES (32768);`}
              caption="প্রথম INSERT সফল। দ্বিতীয়টা থামে ERROR: smallint out of range এ, Table এ থাকে শুধু প্রথম Row। শেষ লাইনে (s) এর জায়গায় (i) লিখে আবার চালান: integer Column এ 32768 অনায়াসে ঢুকে যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই Error এর SQLSTATE কোড 22003, নাম numeric_value_out_of_range। App এর Code এ এই Error আলাদা করে ধরতে চাইলে
              এই কোডটাই দেখা হয়। নিচের Lab এ তিনটা Type আর সাতটা মান নিয়ে নিজে চেষ্টা করুন, কোন জোড়া ঢোকে আর কোনটা ফেরত
              যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeOverflowLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এর এই কড়াকড়ি আসলে একটা উপহার। অনেক Programming ভাষায় সীমা পার হলে সংখ্যা উল্টে যায়। Java তে
              একটা short এর মান 32767 থেকে এক বাড়ালে হয়ে যায় -32768, কোনো Error ছাড়া, ঠিক যেমন ঘড়ির কাঁটা বারোটা পার
              হয়ে আবার একে ফেরে। এমন একটা উল্টানো সংখ্যা Database এ বসে গেলে সেটা খুঁজে বের করতে দিন লেগে যায়। PostgreSQL
              ভুল সংখ্যা রাখার চেয়ে Row টাই ফিরিয়ে দেয়, আর Error টা আপনি সাথে সাথে দেখেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "যে ভিডিও integer এর সীমা ছুঁয়েছিল",
          content: (
            <ContentParagraph>
              December 2014 এ YouTube জানাল, তাদের View গোনার Counter ছিল একটা 32 bit integer, যার সবচেয়ে বড় মান
              2,147,483,647, ঠিক PostgreSQL এর integer এর সীমা। Gangnam Style ভিডিওটা সেই সীমার কাছে পৌঁছে গিয়েছিল, তাই
              তারা Counter টা 64 bit এ বদলে নিল। শিক্ষাটা সহজ: আজ যে সংখ্যা ছোট, দশ বছর পরেও সেটা ছোট থাকবে কিনা, Type
              বাছার সময় সেটাই আসল প্রশ্ন। পরে বদলাতে লাগে ALTER TABLE, আর বড় Table এ সেটা ধীর আর ঝুঁকির কাজ, যা{" "}
              <Link href="/sql/topic/alter-table" className={LINK}>
                Lesson 10
              </Link>{" "}
              এ দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "hidden-integer-traps",
      subHeader: { index: "005", title: "Hidden Integer Traps" },
      title: <SectionTitle>পূর্ণসংখ্যার দুটো চুপচাপ ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সীমার Error শুধু INSERT এ আসে না, হিসাবের মাঝেও আসতে পারে। দুটো smallint যোগ করলে PostgreSQL ফলাফলও
              smallint রাখে। Booking এর সিট দুইগুণ করলে সমস্যা নেই, কারণ সংখ্যাগুলো ছোট। কিন্তু 20000 আর 20000 যোগ
              করলে ফল 40000, যেটা smallint এ ধরে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হিসাবের Type"
              query={`SELECT booking_id, seats,
       seats + seats AS doubled,
       pg_typeof(seats + seats) AS result_type
FROM bookings
ORDER BY booking_id
LIMIT 3;
SELECT pg_typeof(sum(seats)) AS sum_type,
       pg_typeof(count(*))   AS count_type
FROM bookings;
SELECT 20000::smallint + 20000::smallint AS too_big;`}
              caption="প্রথম Table এ result_type হলো smallint। দ্বিতীয় Table এ sum আর count দুটোর Type ই bigint: Aggregate নিজে থেকেই বড় Type এ চলে যায়, তাই সব Booking এর সিট যোগ করায় বিপদ নেই। শেষ Query থামে ERROR: smallint out of range এ। দ্বিতীয় 20000 এর পাশের ::smallint মুছে আবার চালান: একপাশে integer থাকলে ফল integer, আসে 40000।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নিয়মটা হলো, দুই পাশের মধ্যে যেটা বড় Type, ফল সেই Type এ। দুই পাশই ছোট হলে ফলও ছোট। সন্দেহ হলে একপাশে{" "}
                <code className={CODE}>::integer</code> বা <code className={CODE}>::bigint</code> বসিয়ে দিন। integer এর
                ক্ষেত্রেও ঠিক একই কথা, 2147483647 + 1 যে Error দেয় সেটা{" "}
                <Link href="/sql/topic/numeric-functions" className={LINK}>
                  Numeric Functions
                </Link>{" "}
                লেসনে দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় ফাঁদ আগের Section এ এক ঝলক দেখেছেন: পূর্ণসংখ্যার Column এ ভগ্নাংশ দিলে PostgreSQL গোল করে রাখে।
                App থেকে কেউ ভুল করে 2.5 সিট পাঠালে Database এ বসে 3।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পূর্ণসংখ্যার Column এ ভগ্নাংশ"
              query={`DROP TABLE IF EXISTS num_seat_requests;
CREATE TABLE num_seat_requests (
  label text,
  seats smallint
);
INSERT INTO num_seat_requests VALUES
  ('number 2.4', 2.4),
  ('number 2.5', 2.5),
  ('text 3',     '3');
SELECT label, seats FROM num_seat_requests;
INSERT INTO num_seat_requests VALUES ('text 2.5', '2.5');`}
              caption={`2.4 থেকে 2, 2.5 থেকে 3, লেখা '3' থেকে 3, কোনো Warning নেই। কিন্তু শেষ INSERT এ লেখা হিসেবে '2.5' পাঠানোয় ERROR: invalid input syntax for type smallint: "2.5"। সংখ্যা হিসেবে এলে গোল হয়, লেখা হিসেবে এলে Error।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কেন এমন? 2.5 লিখলে সেটা একটা numeric মান, আর numeric থেকে smallint এ বদলানোর নিয়ম হলো গোল করা, ঠিক মাঝখানের
              মান শূন্য থেকে দূরে। আর &lsquo;2.5&rsquo; লিখলে সেটা লেখা, যেটা থেকে smallint বানাতে হলে লেখাটা দেখতে
              পূর্ণসংখ্যার মতো হতে হয়। Type বদলের এই নিয়মগুলো{" "}
              <Link href="/sql/topic/type-casting" className={LINK}>
                Type Casting
              </Link>{" "}
              লেসনে আছে। এখানে শিক্ষা একটাই: সিটের Column এ ভগ্নাংশ আসাই উচিত না, আর এলে সেটা App এর ভুল। Column এর
              Type সেই ভুল ধরবে, এমন ভরসা করবেন না।
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
                  <code className={CODE}>num_ex1_counts</code> নামে একটা Table বানান, এই ক্রমে তিনটা Column:{" "}
                  <code className={CODE}>bus_seats</code> হলো একটা বাসের সিট, কখনো 60 এর বেশি না।{" "}
                  <code className={CODE}>yearly_bookings</code> হলো এক বছরের মোট Booking, বড়জোর কয়েক লাখ।{" "}
                  <code className={CODE}>total_page_views</code> হলো Website চালুর দিন থেকে মোট Page View, যেটা একদিন
                  300 কোটি ছাড়াবে। প্রতিটার জন্য সবচেয়ে ছোট সেই Type দিন, যেটায় নিশ্চিতভাবে ধরে। শেষের SELECT টা যেমন আছে
                  তেমনই রাখুন, ওটাই উত্তর মেলায়।
                </>
              }
              hint={
                <>
                  smallint ধরে 32767 পর্যন্ত। integer ধরে 2147483647 পর্যন্ত, মানে প্রায় ২১৪ কোটি। 300 কোটি তার চেয়েও
                  বড়।
                </>
              }
              starter={`DROP TABLE IF EXISTS num_ex1_counts;
-- এখানে CREATE TABLE num_ex1_counts লিখুন

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'num_ex1_counts'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('bus_seats', 'smallint'),
  ('yearly_bookings', 'integer'),
  ('total_page_views', 'bigint')
) AS v(column_name, data_type);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "numeric-precision-scale",
      subHeader: { index: "006", title: "numeric(p, s)" },
      title: <SectionTitle>numeric(p, s): কয়টা অঙ্ক, তার কয়টা দশমিকের পরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              numeric এর পাশে বন্ধনীতে দুটো সংখ্যা বসে। প্রথমটা precision, মানে মোট কয়টা অঙ্ক রাখা যাবে, দশমিকের দুই
              পাশ মিলিয়ে। দ্বিতীয়টা scale, মানে তার মধ্যে কয়টা দশমিকের পরে। Island Tours এর{" "}
              <code className={CODE}>price_bdt</code> হলো numeric(10, 2): মোট দশটা অঙ্ক, দুটো পয়সার, তাই টাকার ভাগে
              আটটা। সবচেয়ে বড় দাম তাহলে 99999999.99, প্রায় দশ কোটি টাকা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypePrecisionScaleDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার numeric(5, 2) Column এ সাতটা মান ঢোকানো যাক, যার কয়েকটায় দশমিকের পরে দুইয়ের বেশি অঙ্ক আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="numeric(5, 2) এ সাতটা মান"
              query={`DROP TABLE IF EXISTS num_prices;
CREATE TABLE num_prices (
  label  text,
  amount numeric(5, 2)
);
INSERT INTO num_prices VALUES
  ('a', 123.456),
  ('b', 123.454),
  ('c', 0.005),
  ('d', 999.994),
  ('e', -2.345),
  ('f', 12),
  ('g', 0.015);
SELECT label, amount FROM num_prices;`}
              caption="a: 123.456 হয়েছে 123.46। b: 123.454 হয়েছে 123.45। c: 0.005 হয়েছে 0.01। d: 999.994 হয়েছে 999.99। e: -2.345 হয়েছে -2.35। f: 12 হয়েছে 12.00। g: 0.015 হয়েছে 0.02। সাতটা Row ই ঢুকেছে, একটাও Error বা Warning নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              গোল করার নিয়ম স্কুলের মতো: বাদ পড়া প্রথম অঙ্ক 5 বা তার বেশি হলে উপরে, কম হলে নিচে। ঠিক মাঝখানে, মানে বাদ
              পড়া অংশ ঠিক 5 হলে, numeric যায় শূন্য থেকে দূরে: 0.005 হয় 0.01, -2.345 হয় -2.35। PostgreSQL এর Documentation
              এ এটা স্পষ্ট লেখা আছে। float এর নিয়ম এখানে আলাদা, সেটা Numeric Functions লেসনের round এর অংশে দেখেছেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "গোল হওয়াটা নীরব",
          content: (
            <ContentParagraph>
              দশমিকের পরের বাড়তি অঙ্ক বাদ পড়লে PostgreSQL কোনো খবর দেয় না। App যদি তিন ঘর দশমিকের দাম পাঠায়, যেমন
              Dollar থেকে বদলানো 12500.456, Database রাখবে 12500.46, আর কেউ জানবেন না। তাই scale ঠিক করার সময় ভাবুন, এই
              সংখ্যায় আসলে কয় ঘর দশমিক অর্থবহ। টাকায় দুই ঘর, কারণ পয়সার নিচে কিছু নেই। কিন্তু মুদ্রা বদলের হার রাখতে হলে
              ছয় ঘর পর্যন্ত লাগতে পারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              precision আর scale না দিলে কী হয়? তখন numeric যত অঙ্ক দেওয়া হয়, সব রাখে, কিছুই গোল করে না। আর scale
              দিলে সবসময় ঠিক ততগুলো দশমিক দেখায়, দরকার হলে শেষে শূন্য বসিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="p আর s না দিলে"
              query={`DROP TABLE IF EXISTS num_open;
CREATE TABLE num_open (
  raw   numeric,
  fixed numeric(10, 2)
);
INSERT INTO num_open VALUES
  (1.1, 1.1),
  (1.10, 1.10),
  (12.3456, 12.3456),
  (0.000001, 0.000001);
SELECT raw, fixed FROM num_open;`}
              caption="raw Column, মানে শুধু numeric: 1.1, 1.10, 12.3456, 0.000001, যা দেওয়া হয়েছিল হুবহু তাই, এমনকি 1.1 আর 1.10 আলাদা দেখায়। fixed Column, numeric(10, 2): 1.10, 1.10, 12.35, 0.00। শেষ মানটা পুরোপুরি হারিয়ে গেছে, কারণ দুই ঘরে 0.000001 এর কিছুই আঁটে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শুধু numeric এর সীমা বিশাল: দশমিকের আগে 131072টা অঙ্ক, পরে 16383টা। বন্ধনীতে precision দিলে সর্বোচ্চ 1000
              দেওয়া যায়, 1001 দিলে আসে ERROR: NUMERIC precision 1001 must be between 1 and 1000। টাকার Column এ precision
              আর scale দুটোই দেওয়া ভালো, কারণ তাতে দুটো সুরক্ষা আসে: পয়সার নিচের অঙ্ক জমা হয় না, আর অবাস্তব বড় দাম ঢোকে
              না। নিচের Lab এ চার রকম Column আর সাতটা মান নিয়ে দেখুন, কোনটা কীভাবে বসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeRoundingLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "numeric-field-overflow",
      subHeader: { index: "007", title: "numeric field overflow" },
      title: <SectionTitle>দশমিকের আগে জায়গা না থাকলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দশমিকের পরের বাড়তি অঙ্ক গোল হয়, কিন্তু দশমিকের আগের বাড়তি অঙ্ক গোল করার উপায় নেই। 1234 কে তিন ঘরে আঁটানো
              মানে মানটাই বদলে ফেলা। তাই এখানে PostgreSQL থামে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক পয়সা বেশি"
              query={`DROP TABLE IF EXISTS num_prices;
CREATE TABLE num_prices (
  label  text,
  amount numeric(5, 2)
);
INSERT INTO num_prices VALUES ('fits', 999.99);
INSERT INTO num_prices VALUES ('one paisa more', 999.995);`}
              caption="999.99 ঢুকেছে, এটাই numeric(5, 2) এর সবচেয়ে বড় মান। 999.995 থামে ERROR: numeric field overflow এ, সাথে DETAIL: A field with precision 5, scale 2 must round to an absolute value less than 10^3।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DETAIL এর লাইনটা পড়তে শিখে নিন, কারণ এটা বলে দেয় সমস্যা কোথায়। precision 5, scale 2, তাই দশমিকের আগে 5
                বিয়োগ 2, মানে ৩টা ঘর। 10^3 মানে 1000। গোল করার পরে মানটা, চিহ্ন বাদ দিয়ে, 1000 এর কম হতে হবে। 999.995
                নিজে 1000 এর কম, কিন্তু দুই ঘরে গোল করলে হয় 1000.00, আর সেখানেই আটকায়। মানে PostgreSQL আগে গোল করে,
                তারপর মাপে। Error এর SQLSTATE সেই একই 22003।
              </ContentParagraph>
              <ContentParagraph>
                numeric এ তিনটা বিশেষ মানও রাখা যায়: NaN, মানে সংখ্যা না, আর Infinity ও -Infinity। Infinity রাখার সুবিধা
                এসেছে PostgreSQL 14 এ। NaN এর সাথে যেকোনো যোগ বিয়োগের ফল NaN, তাই একটা NaN পুরো যোগফল নষ্ট করে দেয়।
                precision দেওয়া Column এ Infinity ঢোকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NaN আর Infinity"
              query={`SELECT 'NaN'::numeric       AS not_a_number,
       'Infinity'::numeric  AS infinity,
       'NaN'::numeric > 1e100 AS nan_is_biggest;
SELECT 'Infinity'::numeric(10, 2) AS price;`}
              caption="প্রথম Table: NaN, Infinity, আর nan_is_biggest এ t। PostgreSQL সাজানোর সময় NaN কে সব সংখ্যার চেয়ে বড় ধরে, এমনকি 1e100 এর চেয়েও। দ্বিতীয় Query থামে ERROR: numeric field overflow এ, DETAIL: A field with precision 10, scale 2 cannot hold an infinite value।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টাকার Column এ NaN ঢুকতে দেওয়ার কোনো কারণ নেই। numeric(10, 2) Column এ NaN কিন্তু ঢোকে, precision সেটা
              আটকায় না। আটকাতে হয় CHECK দিয়ে, সেটা Lesson 07 এ। এবার নিজে একটা ভাড়ার Column এর মাপ ঠিক করুন।
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
                  <code className={CODE}>num_ex2_fares</code> নামে একটা Table বানান, দুটো Column:{" "}
                  <code className={CODE}>fare_code</code> text, আর <code className={CODE}>fare</code>। fare এ ভাড়া থাকবে
                  9999.99 টাকা পর্যন্ত, পয়সা সহ। এমন numeric দিন যার precision সবচেয়ে ছোট, কিন্তু 9999.99 আঁটে আর পয়সা
                  থাকে। Starter এর INSERT আর শেষের SELECT যেমন আছে রাখুন। তিনটা মানে তিন ঘর দশমিক আছে, সেগুলো কী হয়ে
                  বসে, সেটাও দেখে নিন।
                </>
              }
              hint={
                <>
                  পয়সার জন্য scale 2। দশমিকের আগে 9999, মানে ৪টা অঙ্ক। precision হলো দুটো মিলিয়ে। ভুল মাপ দিলে INSERT
                  এই numeric field overflow দেবে, অথবা শেষের SELECT এ precision মিলবে না।
                </>
              }
              starter={`DROP TABLE IF EXISTS num_ex2_fares;
-- এখানে CREATE TABLE num_ex2_fares লিখুন

INSERT INTO num_ex2_fares VALUES
  ('A', 2500.505),
  ('B', 9999.994),
  ('C', 0.125);

SELECT f.fare_code, f.fare, c.numeric_precision, c.numeric_scale
FROM num_ex2_fares f
CROSS JOIN information_schema.columns c
WHERE c.table_name = 'num_ex2_fares' AND c.column_name = 'fare'
ORDER BY f.fare_code;`}
              solution={`SELECT * FROM (VALUES
  ('A', 2500.51, 6, 2),
  ('B', 9999.99, 6, 2),
  ('C', 0.13, 6, 2)
) AS v(fare_code, fare, numeric_precision, numeric_scale);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "real-and-double",
      subHeader: { index: "008", title: "real and double precision" },
      title: <SectionTitle>real আর double precision: দ্রুত, বিশাল, আর আন্দাজি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার আন্দাজি দশমিকের পরিবার। real রাখে 4 Byte এ, double precision 8 Byte এ। দুটোই সংখ্যাকে রাখে Binary
                ভগ্নাংশে, দুইয়ের ঘাতের যোগফল হিসেবে। এই পদ্ধতির নাম Floating Point, আর এটা IEEE 754 নামের একটা মান মেনে
                চলে, যেটা Computer এর CPU সরাসরি বোঝে। তাই হিসাব খুব দ্রুত।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যা হলো, দশমিকে যে সংখ্যা ছোট আর নিরীহ, Binary তে সেটা শেষ না হওয়া ভগ্নাংশ হতে পারে। এক ভাগ তিন
                দশমিকে হুবহু লেখা যায় না, 0.333 চলতেই থাকে। ঠিক তেমনি 0.1 Binary তে হুবহু লেখা যায় না। তাই real বা
                double precision রাখে 0.1 এর সবচেয়ে কাছের সেই মানটা, যেটা তার পক্ষে রাখা সম্ভব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeExactVsNearestDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কতটা কাছে? PostgreSQL এর Documentation বলে, real এ অন্তত ৬টা দশমিক অঙ্ক আর double precision এ অন্তত ১৫টা
              অঙ্ক বিশ্বাস করা যায়। তার পরের অঙ্কগুলো আন্দাজ। নিচের বক্সে সেই সীমাটা দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কয় অঙ্ক পর্যন্ত বিশ্বাস করা যায়"
              query={`SELECT 16777216::real             AS r_exact,
       16777217::real             AS r_next,
       16777217::double precision AS d_next;
SELECT 1234567.89::real             AS r,
       1234567.89::double precision AS d,
       1234567.89::numeric(10, 2)   AS n;
SELECT 0.1::real::double precision AS real_point_one;`}
              caption="প্রথম Table: real এ 16777216 আর 16777217 দুটোই 1.6777216e+07, মানে real এর কাছে এই দুটো সংখ্যা এক। double precision এ 16777217 ঠিক আছে। দ্বিতীয় Table: 1234567.89 real এ 1.2345679e+06, double precision আর numeric এ হুবহু 1234567.89। শেষ Table: real এর 0.1 কে double precision এ বড় করে দেখলে আসে 0.10000000149011612, real ভেতরে আসলে এই মানটাই রেখেছিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                e+06 মানে দশের ছয় ঘাত দিয়ে গুণ, তাই 1.2345679e+06 মানে 1234567.9। real ছয় সাতটার বেশি অঙ্ক দেখাতে পারে
                না বলে PostgreSQL তাকে এভাবে লেখে। তানিমের Table এ ঠিক এটাই হয়েছিল। আর Invoice এ real থেকে numeric এ
                বদলানোর সময় PostgreSQL শুধু সেই ছয়টা বিশ্বাসযোগ্য অঙ্ক নেয়, তাই 187500.5 হয়ে গিয়েছিল 187500, আর
                ভেতরে জমা থাকা 1234567.875 হয়ে গিয়েছিল 1234570।
              </ContentParagraph>
              <ContentParagraph>
                SQL এর মান অনুযায়ী float(p) লেখাও চলে, যেখানে p হলো Binary অঙ্কের সংখ্যা। PostgreSQL এ float(1) থেকে
                float(24) মানে real, float(25) থেকে float(53) মানে double precision, আর শুধু float লিখলে double
                precision। float(54) লিখলে Error: precision for type float must be less than 54 bits।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দেখতে ঠিক, ভেতরে আন্দাজ",
          content: (
            <ContentParagraph>
              PostgreSQL 12 থেকে float এর মান দেখানো হয় সবচেয়ে ছোট সেই লেখায়, যেটা আবার পড়লে ঠিক একই Binary মান ফেরত
              আসে। তাই <code className={CODE}>0.1::double precision</code> দেখায় 0.1, যদিও ভেতরের মানটা ঠিক 0.1 না।
              Screen এ সব ঠিক, ভেতরে আন্দাজ: এই কারণেই float এর ভুল চোখে পড়ে দেরিতে, সাধারণত যোগফলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "money-never-float",
      subHeader: { index: "009", title: "Why Money Is Never Float" },
      title: <SectionTitle>টাকা কেন কখনো float এ না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Numeric Functions লেসনে আপনি দেখেছেন, 0.1 + 0.2 double precision এ 0.30000000000000004। সেটা একটা হিসাবের
              মাঝের ভুল। কিন্তু Column এর Type float হলে ভুলটা Database এ জমা হয়, প্রতিটা Row এ, প্রতিটা যোগফলে। দশটা
              0.10 টাকার Payment ধরা যাক, একটা একটা করে যোগ হচ্ছে। নিচের Lab এ বোতাম চেপে একটা একটা যোগ করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeDriftLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দশটা 0.10 টাকার Payment"
              query={`DROP TABLE IF EXISTS num_wallet;
CREATE TABLE num_wallet (
  payment_no  integer,
  amt_float   double precision,
  amt_real    real,
  amt_numeric numeric(10, 2)
);
INSERT INTO num_wallet
SELECT g, 0.10, 0.10, 0.10
FROM generate_series(1, 10) AS g;
SELECT sum(amt_float)   AS float_total,
       sum(amt_real)    AS real_total,
       sum(amt_numeric) AS numeric_total,
       sum(amt_float) = 1   AS float_is_one,
       sum(amt_numeric) = 1 AS numeric_is_one
FROM num_wallet;
SELECT payment_no,
       sum(amt_float)   OVER (ORDER BY payment_no) AS float_running,
       sum(amt_real)    OVER (ORDER BY payment_no) AS real_running,
       sum(amt_numeric) OVER (ORDER BY payment_no) AS numeric_running
FROM num_wallet
ORDER BY payment_no;`}
              caption="প্রথম Table: float_total 0.9999999999999999, real_total 1.0000001, numeric_total 1.00। float_is_one হলো f, numeric_is_one হলো t। দ্বিতীয় Table এ চলমান যোগফল, ঠিক উপরের Lab এর সংখ্যাগুলো: double precision তিন নম্বরে 0.30000000000000004, চারে আবার 0.4, আটে 0.7999999999999999। real সাত নম্বর থেকে সরে যায়। numeric প্রতিটা ধাপে ঠিক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখানে দুটো জিনিস আসল বিপদ। প্রথমত, ভুলটা আসে আর যায়: চার নম্বরে double precision এর যোগফল আবার ঠিক দেখায়।
              তাই কেউ দু একটা মিলিয়ে দেখলে ভুল পাবেন না। দ্বিতীয়ত, = দিয়ে খোঁজা ভেঙে যায়। নিচের দুটো Payment ই মুখে
              বললে 0.3 টাকা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="= 0.3 দিয়ে খোঁজা"
              query={`DROP TABLE IF EXISTS num_float_pay;
CREATE TABLE num_float_pay (
  pay_id integer,
  amount double precision
);
INSERT INTO num_float_pay VALUES (1, 0.3);
INSERT INTO num_float_pay
SELECT 2, 0.1::double precision + 0.2::double precision;
SELECT pay_id, amount FROM num_float_pay ORDER BY pay_id;
SELECT pay_id FROM num_float_pay WHERE amount = 0.3;
SELECT pay_id FROM num_float_pay WHERE abs(amount - 0.3) < 0.000001 ORDER BY pay_id;`}
              caption="প্রথমটা সরাসরি 0.3, দ্বিতীয়টা 0.1 আর 0.2 যোগ করে বানানো, তাই দেখায় 0.30000000000000004। WHERE amount = 0.3 খুঁজে পায় শুধু pay_id 1। শেষ Query তে পার্থক্য খুব ছোট কিনা দেখে খুঁজলে দুটোই আসে, কিন্তু প্রতিটা Query তে এই সহনশীলতা মনে রেখে লেখা কোনো সমাধান না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টাকার হিসাব মিলতে হয় পয়সায় পয়সায়: Customer যা দিয়েছেন, Bank এ যা ঢুকেছে, খাতায় যা লেখা, তিনটা এক হতে হবে।
              float এ সেটা কখনো নিশ্চিত না। তাই নিয়ম একটাই, ব্যতিক্রম নেই: টাকা numeric এ। Island Tours এর{" "}
              <code className={CODE}>price_bdt</code>, <code className={CODE}>total_bdt</code> আর{" "}
              <code className={CODE}>amount_bdt</code> তিনটাই numeric(10, 2), এই কারণেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আরেকটা হুবহু উপায়: পয়সায় পূর্ণসংখ্যা",
          content: (
            <ContentParagraph>
              কিছু System টাকা রাখে পয়সার পূর্ণসংখ্যায়: 12500.50 টাকা মানে 1250050 পয়সা, Column bigint। এটাও হুবহু, আর
              খুব দ্রুত। ঝামেলা হলো প্রতিটা জায়গায় মনে রাখতে হয় সংখ্যাটা পয়সায়, দেখানোর আগে একশো দিয়ে ভাগ করতে হয়।
              Payment Gateway এর API তে এই পদ্ধতি প্রায়ই দেখবেন। Database এর ভেতরে numeric পড়তে সহজ, তাই এই কোর্সে
              numeric।
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
                  <code className={CODE}>num_ex3_wallet</code> নামে একটা Table বানান, দুটো Column:{" "}
                  <code className={CODE}>payment_no</code> integer, আর <code className={CODE}>amount</code>, টাকার জন্য
                  ঠিক Type এ। Starter দশটা 0.10 টাকার Payment ঢোকায়, আর শেষের SELECT দেখে যোগফল ঠিক 1 কিনা। প্রথমে
                  amount এর Type double precision দিয়ে চালিয়ে দেখুন কী আসে, তারপর ঠিক করুন।
                </>
              }
              hint={
                <>
                  হুবহু দশমিক রাখে একটাই পরিবার। পয়সা পর্যন্ত দরকার, তাই scale 2 দিলেই চলে, যেমন Island Tours এর
                  amount_bdt।
                </>
              }
              starter={`DROP TABLE IF EXISTS num_ex3_wallet;
-- এখানে CREATE TABLE num_ex3_wallet লিখুন

INSERT INTO num_ex3_wallet
SELECT g, 0.10 FROM generate_series(1, 10) AS g;

SELECT count(*) AS payments,
       sum(amount) AS total,
       sum(amount) = 1 AS exactly_one
FROM num_ex3_wallet;`}
              solution={`SELECT * FROM (VALUES (10, 1.00, true)) AS v(payments, total, exactly_one);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "when-float-is-right",
      subHeader: { index: "010", title: "When Float Is Right" },
      title: <SectionTitle>float কোথায় ঠিক পছন্দ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                float খারাপ না, শুধু টাকার জন্য খারাপ। যেখানে সংখ্যাটা একটা মাপ, সেখানে float ই স্বাভাবিক: দূরত্ব,
                তাপমাত্রা, ওজন, বৈজ্ঞানিক হিসাব, আর GPS এর অবস্থান। মাপ কখনো হুবহু হয় না, মাপার যন্ত্রেরই একটা ভুলের সীমা
                থাকে। double precision এর পনেরো অঙ্কের নিখুঁততা সেই সীমার চেয়ে অনেক বেশি।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন Island Tours একটা Map এ প্রতিটা জায়গার Pin দেখাতে চায়। অক্ষাংশ, মানে Latitude, আর দ্রাঘিমাংশ, মানে
                Longitude, তিনভাবে রেখে তুলনা করা যাক। Coordinate গুলো আনুমানিক, শুধু উদাহরণের জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GPS তিনভাবে"
              query={`DROP TABLE IF EXISTS num_spots;
CREATE TABLE num_spots (
  name      text,
  lat_real  real,
  lat_float double precision,
  lat_exact numeric(9, 6),
  lng_float double precision
);
INSERT INTO num_spots VALUES
  ('Saint Martin''s Island', 20.623712, 20.623712, 20.623712, 92.323456),
  ('Cox''s Bazar',           21.427200, 21.427200, 21.427200, 92.005800),
  ('Sylhet',                 24.894929, 24.894929, 24.894929, 91.868706);
SELECT name, lat_real, lat_float, lat_exact, lng_float FROM num_spots;
SELECT name,
       round(((lat_real::double precision - lat_float) * 111320)::numeric, 3) AS real_error_m
FROM num_spots;`}
              caption="lat_float আর lat_exact এ দেওয়া মান হুবহু, শুধু numeric(9, 6) সবসময় ছয় ঘর দেখায়, double precision শেষের শূন্য দেখায় না। lat_real এ Saint Martin এর 20.623712 হয়ে গেছে 20.623713, Sylhet এর 24.894929 হয়ে গেছে 24.89493। দ্বিতীয় Table এ সেই ভুল মিটারে: 0.060, 0.035, 0.099, মানে সর্বোচ্চ প্রায় দশ সেন্টিমিটার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এক ডিগ্রি Latitude প্রায় 111 কিলোমিটার, তাই দশমিকের পরে ছয় ঘর মানে প্রায় 11 সেন্টিমিটার পর্যন্ত নিখুঁত।
                দ্বিতীয় Query তে ঠিক সেই হিসাবটাই আছে: ডিগ্রির পার্থক্য গুণ 111320 মিটার। একটা ট্যুরের Pickup Point এর
                জন্য real ও চলত, কিন্তু 4 Byte বাঁচাতে দশ সেন্টিমিটার হারানোর মানে নেই।
              </ContentParagraph>
              <ContentParagraph>
                দুটো ভালো পছন্দ আছে: double precision, যেটা বেশিরভাগ Map Library আর Programming ভাষা সরাসরি বোঝে, অথবা
                numeric(9, 6), যেটা ঠিক যা লেখা হয়েছে তাই রাখে। দূরত্ব মাপা বা একটা এলাকার ভেতরের Pin খোঁজার মতো আসল
                Map এর কাজের জন্য PostgreSQL এর PostGIS নামে একটা Extension আছে। সেটা এই ব্রাউজারের বক্সে নেই, তাই আপাতত
                শুধু নামটা জেনে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "মাপজোক: float চলে", "হিসাব: numeric লাগে"],
          rows: [
            ["উদাহরণ", "দূরত্ব, GPS, তাপমাত্রা, ওজন", "দাম, Payment, ছাড়ের শতাংশ, Tax"],
            ["শেষ অঙ্কের সামান্য ভুল", "কারো ক্ষতি নেই, মাপেরই ভুল তার চেয়ে বড়", "খাতা মেলে না, Customer প্রশ্ন করেন"],
            ["= দিয়ে তুলনা", "করা হয় না, পরিসর দিয়ে খোঁজা হয়", "করা যায়, করা হয়"],
            ["গতি", "খুব দ্রুত, CPU সরাসরি হিসাব করে", "একটু ধীর, ছোট Data তে টের পাওয়া যায় না"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "money-type",
      subHeader: { index: "011", title: "The money Type" },
      title: <SectionTitle>money: নামে টাকা, কাজে ঝামেলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এ money নামে একটা Type আছে। নাম দেখে মনে হয় টাকার জন্য এর চেয়ে ভালো কিছু নেই। ভেতরে এটা আসলে
              একটা 8 Byte এর পূর্ণসংখ্যা, যেটা পয়সার হিসাব রাখে, আর দেখানোর সময় চিহ্ন আর কমা বসায়। শুনতে ভালো, কিন্তু
              নিচের বক্সে চারটা অভ্যাস দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="money এর অভ্যাস"
              query={`SHOW lc_monetary;
SELECT 12500.50::money AS price,
       0.005::money    AS half_paisa;
SELECT 12500::money / 3       AS one_share,
       (12500::money / 3) * 3 AS three_shares;
SELECT avg(amount_bdt::money) AS average FROM payments;`}
              caption="lc_monetary হলো C। price দেখায় $12,500.50, half_paisa তে 0.005 গোল হয়ে $0.01। 12500 কে তিন ভাগ করলে one_share এ $4,166.66, আর তিন ভাগ যোগ করে ফেরত আসে $12,499.98, দুই পয়সা হারিয়ে গেছে। শেষ Query থামে ERROR: function avg(money) does not exist এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>চিহ্ন আর দশমিক আসে Server এর Setting থেকে।</strong> money কোন চিহ্ন বসাবে আর কয় ঘর দশমিক রাখবে, সেটা
                ঠিক করে lc_monetary Setting। এই বক্সে সেটা C, তাই ডলারের চিহ্ন। Docker এর postgres:18 এ সেটা en_US.utf8,
                সেখানেও ডলার। Column এর সাথে কোন মুদ্রা, সেটা জমা থাকে না। Setting আলাদা এমন Server এ Data সরালে একই মান
                অন্য চেহারায় দেখাতে পারে, আর PostgreSQL এর Documentation নিজেই সাবধান করে যে Dump থেকে Restore পর্যন্ত
                ব্যর্থ হতে পারে।
              </ListItem>
              <ListItem>
                <strong>integer দিয়ে ভাগ করলে পয়সার ভগ্নাংশ কেটে ফেলে।</strong> গোল করে না, কাটে। 4166.666 হয়ে যায়
                4166.66। Documentation বলে গোল করা ফল চাইলে আগে numeric এ বদলে ভাগ করতে।
              </ListItem>
              <ListItem>
                <strong>অনেক চেনা Function নেই।</strong> sum চলে, কিন্তু avg(money) নেই, round(money) ও নেই।
              </ListItem>
              <ListItem>
                <strong>বাংলা টাকার চিহ্ন পড়তে পারে না।</strong> ৳ দিয়ে লেখা মান Error দেয়, নিচের বক্সে দেখুন। আর double
                precision থেকে সরাসরি money তে বদলানোও যায় না: cannot cast type double precision to money।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="money থেকে বের হওয়ার পথ"
              query={`SELECT 12500.50::money::numeric(12, 2) AS back_to_numeric;
SELECT sum(amount_bdt::money) AS total_money FROM payments;
SELECT '৳12,500.00'::money AS taka;`}
              caption="money থেকে numeric এ ফেরা সহজ: 12500.50। sum চলে: $490,600.00। কিন্তু টাকার চিহ্ন দিয়ে লেখা '৳12,500.00' পড়তে পারে না: ERROR: invalid input syntax for type money।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এর Community Wiki তে Don&rsquo;t Do This নামে একটা পাতা আছে, যেখানে অভিজ্ঞ মানুষেরা লিখে রেখেছেন
              কোন কাজগুলো না করাই ভালো। সেখানে একটা শিরোনাম সরাসরি বলে money ব্যবহার না করতে, তার বদলে numeric। Island
              Tours এর কোনো Column money না, আর আপনার নতুন Table গুলোতেও হওয়া উচিত না। পুরনো কোনো Database এ money পেলে
              ভয়ের কিছু নেই: <code className={CODE}>::numeric</code> দিয়ে বের করে হিসাব করুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "choosing-types",
      subHeader: { index: "012", title: "Choosing Types" },
      title: <SectionTitle>দাম, সিট, শতাংশ, GPS: কোনটায় কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণের সব কথা দুটো প্রশ্নে নামিয়ে আনা যায়। কখনো ভগ্নাংশ আসবে কি? আর এলে, যোগফল কি পয়সায় পয়সায় মিলতে
              হবে? পূর্ণসংখ্যার জন্য তৃতীয় একটা প্রশ্ন: সবচেয়ে বড় কত হতে পারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NumtypeChooserDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Column", "Type", "কেন"],
          rows: [
            ["দাম, মোট, Payment", "numeric(10, 2)", "হুবহু, পয়সার দুই ঘর, প্রায় দশ কোটি টাকা পর্যন্ত"],
            ["সিট, দিনের সংখ্যা, Rating", "smallint", "ছোট পূর্ণসংখ্যা, পরিসর বাঁধতে সাথে CHECK"],
            ["id আর সাধারণ গণনা", "integer", "Documentation এর সাধারণ পছন্দ"],
            ["দ্রুত বাড়া id, মোট View", "bigint", "২১৪ কোটি পেরোতে পারে"],
            ["ছাড়ের শতাংশ, যেমন 25.50", "numeric(5, 2)", "সাথে CHECK 0 থেকে 100"],
            ["অনুপাত, যেমন 0.125", "numeric(4, 3)", "শতাংশ না ভগ্নাংশ, Column এর নামেই বলে দিন"],
            ["GPS এর Latitude আর Longitude", "double precision বা numeric(9, 6)", "মাপ, প্রায় 11 সেন্টিমিটার যথেষ্ট"],
            ["মুদ্রা বদলের হার", "numeric(12, 6)", "দশমিকের পরে ছয় ঘর অর্থবহ"],
            ["গড় Rating", "Column না, Query তে হিসাব", "জমা রাখলে নতুন Review এ পুরনো হয়ে যায়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শতাংশ নিয়ে একটা সূক্ষ্ম কথা আছে। numeric(5, 2) এ 100.00 ধরে, কিন্তু 999.99 ও ধরে। মানে Type একা 150% ছাড়
              আটকাতে পারে না। সেই কাজ CHECK এর। নিচের বক্সে আগে CHECK ছাড়া, তারপর CHECK সহ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Type ধরন ঠিক করে, CHECK পরিসর"
              query={`DROP TABLE IF EXISTS num_discounts;
CREATE TABLE num_discounts (
  code         text,
  discount_pct numeric(5, 2)
);
INSERT INTO num_discounts VALUES ('EID25', 25), ('OOPS', 100.5);
SELECT code, discount_pct FROM num_discounts;
DROP TABLE IF EXISTS num_discounts;
CREATE TABLE num_discounts (
  code         text,
  discount_pct numeric(5, 2) CHECK (discount_pct BETWEEN 0 AND 100)
);
INSERT INTO num_discounts VALUES ('EID25', 25);
INSERT INTO num_discounts VALUES ('OOPS', 100.5);`}
              caption={`প্রথম Table এ 100.50 ঢুকে গেছে, Type এর চোখে এটা বৈধ। দ্বিতীয়বার CHECK আছে, তাই 25 ঢোকে, কিন্তু 100.5 থামে ERROR: new row for relation "num_discounts" violates check constraint "num_discounts_discount_pct_check" এ, DETAIL: Failing row contains (OOPS, 100.50)।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Type ঠিক করে কোন ধরনের মান, CHECK ঠিক করে কোন পরিসরের মান। দুটো একসাথে কাজ করে। CHECK এর নাম রাখা, অন্য
                Constraint আর তাদের Error এর পুরো আলোচনা{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                নিজের বানানো Table, বা অন্য কারো বানানো Database এর Type কীভাবে পড়বেন? psql এ{" "}
                <code className={CODE}>\d table_name</code>, আর যেকোনো জায়গা থেকে{" "}
                <code className={CODE}>information_schema.columns</code>। ব্রাউজারের বক্সে psql এর \d চলে না, তাই এখানে
                দ্বিতীয়টা, সাথে <code className={CODE}>format_type</code>, যেটা ঠিক \d এর মতো করে Type লেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="tours এর Type পড়ে দেখা"
              query={`SELECT column_name, data_type, numeric_precision, numeric_precision_radix, numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'tours'
ORDER BY ordinal_position;
SELECT attname AS column_name,
       format_type(atttypid, atttypmod) AS column_type
FROM pg_attribute
WHERE attrelid = 'tours'::regclass AND attnum > 0
ORDER BY attnum;`}
              caption="প্রথম Table: price_bdt এর numeric_precision 10, numeric_precision_radix 10, numeric_scale 2। কিন্তু smallint এর precision 16 আর integer এর 32, radix 2: পূর্ণসংখ্যার precision গোনা হয় Binary অঙ্কে, মানে bit এ। দ্বিতীয় Table এ format_type সরাসরি দেখায় numeric(10,2), ঠিক যেমন psql এর \d দেখায়।"
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
                  Island Tours এর আটটা Table এ যত smallint আর numeric Column আছে, সবগুলোর তালিকা বের করুন। Column:{" "}
                  <code className={CODE}>table_name</code>, <code className={CODE}>column_name</code>,{" "}
                  <code className={CODE}>data_type</code>, <code className={CODE}>numeric_precision</code>,{" "}
                  <code className={CODE}>numeric_scale</code>। শুধু public Schema, আর num দিয়ে শুরু হওয়া আপনার নিজের
                  Table গুলো বাদ। সাজান table_name, তারপর column_name দিয়ে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"table_schema = 'public'"}</code> না দিলে PostgreSQL এর নিজের pg_catalog এর
                  Table গুলোও চলে আসে, তাদেরও অনেক smallint Column আছে। নিজের Table বাদ দিতে{" "}
                  <code className={CODE}>{"table_name NOT LIKE 'num%'"}</code>, আর দুই Type এর জন্য{" "}
                  <code className={CODE}>{"data_type IN ('smallint', 'numeric')"}</code>।
                </>
              }
              starter={`-- information_schema.columns থেকে লিখুন
`}
              solution={`SELECT * FROM (VALUES
  ('bookings',   'seats',         'smallint', 16, 0),
  ('bookings',   'total_bdt',     'numeric',  10, 2),
  ('departures', 'seats_left',    'smallint', 16, 0),
  ('payments',   'amount_bdt',    'numeric',  10, 2),
  ('reviews',    'rating',        'smallint', 16, 0),
  ('tours',      'duration_days', 'smallint', 16, 0),
  ('tours',      'max_seats',     'smallint', 16, 0),
  ('tours',      'price_bdt',     'numeric',  10, 2)
) AS v(table_name, column_name, data_type, numeric_precision, numeric_scale);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ সংখ্যার Type কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                MySQL এর সংখ্যার Type প্রায় একই পরিবারের, কিন্তু কয়েকটা পার্থক্য সরাসরি ভুল Data তৈরি করতে পারে। নিচের
                সবকিছু MySQL 8.4.11 এ চালানো, island-tours.mysql.sql Load করা Database এ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আরও দুটো পূর্ণসংখ্যা:</strong> TINYINT, 1 Byte, -128 থেকে 127। MEDIUMINT, 3 Byte। MySQL এর
                  BOOLEAN আসলে TINYINT(1), সেটা{" "}
                  <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                    Lesson 06
                  </Link>{" "}
                  এ।
                </ListItem>
                <ListItem>
                  <strong>UNSIGNED:</strong> শুধু শূন্য বা ধনাত্মক, বদলে ধনাত্মক দিকে দ্বিগুণ জায়গা। TINYINT UNSIGNED ধরে
                  0 থেকে 255, BIGINT UNSIGNED এর সর্বোচ্চ 18446744073709551615। ফাঁদ: দুটো UNSIGNED বিয়োগ করে ফল ঋণাত্মক
                  হলে Error 1690, আর একপাশ SIGNED করলেও চলে না, দুই পাশই করতে হয়।
                </ListItem>
                <ListItem>
                  <strong>DECIMAL(p, s):</strong> PostgreSQL এর numeric এর মতোই, সর্বোচ্চ precision 65, 66 দিলে Error 1426।
                  কিন্তু শুধু DECIMAL লিখলে মানে DECIMAL(10,0): 12.5 জমা হয় 13 হয়ে। PostgreSQL এ শুধু numeric মানে উল্টো,
                  সীমাহীন।
                </ListItem>
                <ListItem>
                  <strong>FLOAT আর DOUBLE:</strong> PostgreSQL এর real আর double precision। FLOAT এ 16777217 দেখায়
                  16777200। FLOAT(7,2) এর মতো অঙ্ক বলে দেওয়া, DECIMAL বা FLOAT এ UNSIGNED, আর INT(11) এর মতো Display Width,
                  তিনটাই 8.4 এ Deprecated, লিখলে Warning 1681।
                </ListItem>
                <ListItem>
                  <strong>money নেই:</strong> MySQL এ টাকা সবসময় DECIMAL(p, s) এ।
                </ListItem>
                <ListItem>
                  <strong>Strict Mode:</strong> 8.4 এর Default sql_mode এ STRICT_TRANS_TABLES আছে, তাই সীমার বাইরের মান
                  Error 1264, PostgreSQL এর মতো। কিন্তু sql_mode থেকে STRICT সরালে MySQL মান কেটে সীমায় বসিয়ে দেয়, শুধু
                  একটা Warning রেখে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-numeric-types.sql",
          code: MYSQL_SESSION,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Strict Mode বন্ধ থাকা পুরনো Server",
          content: (
            <ContentParagraph>
              পুরনো MySQL Server বা কিছু Hosting এ sql_mode থেকে STRICT সরানো থাকে। তখন 300 সিটের Booking চুপচাপ 255 হয়ে
              যায়, আর 12345.678 টাকার দাম হয়ে যায় 999.99। App এ কোনো Error আসে না, শুধু একটা Warning, যেটা প্রায় কেউ পড়েন
              না। MySQL এ কাজ শুরুর আগে <code className={CODE}>SELECT @@sql_mode;</code> চালিয়ে দেখে নিন,
              STRICT_TRANS_TABLES আছে কিনা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-numeric-traps.sql",
          code: MYSQL_TRAPS,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর মৌসুমি ভাড়া</SectionTitle>,
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
                ফারুক সাহেব এবার পুরো Feature টা চান: প্রতিটা ট্যুরের মৌসুম ভেদে আলাদা মূল দাম, ছাড়ের শতাংশ, এই দামে কয়টা
                সিট দেওয়া হবে, আর Pickup Point এর GPS। তানিম এবার প্রতিটা Column এর Type ভেবে বেছে নিলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>fare_id</code> আর <code className={CODE}>tour_id</code>: integer, কারণ tours এর
                  tour_id ও integer, আর দুই পাশের Type মিললে Join সহজ।
                </ListItem>
                <ListItem>
                  <code className={CODE}>base_bdt</code>: numeric(10, 2), tours এর price_bdt এর মতোই।
                </ListItem>
                <ListItem>
                  <code className={CODE}>discount_pct</code>: numeric(5, 2), কারণ 25.50% এর মতো ছাড় হয়।
                </ListItem>
                <ListItem>
                  <code className={CODE}>seats_offered</code>: smallint, tours এর max_seats এর মতোই।
                </ListItem>
                <ListItem>
                  <code className={CODE}>pickup_lat</code> আর <code className={CODE}>pickup_lng</code>: double precision,
                  কারণ এগুলো মাপ, হিসাব না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মৌসুমি ভাড়ার Table"
              query={`DROP TABLE IF EXISTS num_season_fares;
CREATE TABLE num_season_fares (
  fare_id       integer,
  tour_id       integer,
  season        text,
  base_bdt      numeric(10, 2),
  discount_pct  numeric(5, 2),
  seats_offered smallint,
  pickup_lat    double precision,
  pickup_lng    double precision
);
INSERT INTO num_season_fares VALUES
  (1, 1, 'winter',  12500.00, 10.00, 20, 20.8624, 92.3058),
  (2, 1, 'monsoon', 12500.00, 25.50, 12, 20.8624, 92.3058),
  (3, 3, 'winter',  18000.00,  7.25, 16, 22.8456, 89.5403),
  (4, 8, 'eid',     32000.00, 12.50, 10, 20.8624, 92.3058);
SELECT f.fare_id, t.title, f.season,
       f.base_bdt, f.discount_pct,
       round(f.base_bdt * (1 - f.discount_pct / 100), 2) AS final_bdt,
       f.seats_offered,
       round(f.base_bdt * (1 - f.discount_pct / 100), 2) * f.seats_offered AS full_revenue_bdt
FROM num_season_fares f
JOIN tours t ON t.tour_id = f.tour_id
ORDER BY f.fare_id;`}
              caption="চারটা Row। winter এ Saint Martin Island Escape: 12500.00 থেকে 10.00% ছাড়ে 11250.00, 20 সিটে 225000.00। monsoon এ 25.50% ছাড়ে 9312.50, 12 সিটে 111750.00। Sundarbans এ 7.25% ছাড়ে 16695.00, 16 সিটে 267120.00। eid এ Luxury Stay 28000.00, 10 সিটে 280000.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              final_bdt এর হিসাবে <code className={CODE}>discount_pct / 100</code> আছে। discount_pct numeric, তাই ভাগটাও
              numeric এ হয়, Integer Division এর ভয় নেই। আর <code className={CODE}>round(..., 2)</code> দিয়ে গোল করা
              হয়েছে একদম শেষে, মাঝখানে না, Numeric Functions লেসনের সেই নিয়ম মেনে। সব টাকার সংখ্যা পয়সা পর্যন্ত হুবহু,
              কারণ প্রতিটা টাকার Column numeric।
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
                  এবার আপনার পালা। অফারের জন্য <code className={CODE}>num_challenge_offers</code> Table বানান, এই ক্রমে
                  চারটা Column: <code className={CODE}>offer_code</code> text।{" "}
                  <code className={CODE}>discount_pct</code> হলো ছাড়ের শতাংশ, 0.00 থেকে 100.00, দুই ঘর দশমিক।{" "}
                  <code className={CODE}>seat_cap</code> হলো অফারে সর্বোচ্চ কয়টা সিট, বড়জোর 500।{" "}
                  <code className={CODE}>min_spend_bdt</code> হলো সর্বনিম্ন খরচ, পয়সা সহ, 9999999.99 পর্যন্ত। প্রতিটার
                  জন্য সবচেয়ে ছোট সেই Type দিন যেটায় ধরে। Starter এর তিনটা INSERT হলো পরীক্ষা: Type ছোট হলে সেখানেই Error
                  আসবে। শেষের SELECT যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  100.00 এ দশমিকের আগে ৩টা অঙ্ক, 9999999.99 এ ৭টা। দুটোতেই scale 2। 500 এর জন্য smallint ই যথেষ্ট।
                </>
              }
              starter={`DROP TABLE IF EXISTS num_challenge_offers;
-- এখানে CREATE TABLE num_challenge_offers লিখুন

INSERT INTO num_challenge_offers VALUES
  ('EID25',   25,     300, 15000),
  ('MONSOON', 12.345,  40, 8500.555),
  ('VIP',     100,     10, 9999999.99);

SELECT column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_name = 'num_challenge_offers'
ORDER BY ordinal_position;`}
              solution={`SELECT * FROM (VALUES
  ('offer_code',    'text',     NULL::integer, NULL::integer),
  ('discount_pct',  'numeric',  5,             2),
  ('seat_cap',      'smallint', 16,            0),
  ('min_spend_bdt', 'numeric',  9,             2)
) AS v(column_name, data_type, numeric_precision, numeric_scale);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>নতুন সংখ্যার Column এর Type বাছাইয়ের সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "মানটা মুখে বলুন, একক সহ",
              description:
                "সিট, টাকা, শতাংশ, মিটার, ডিগ্রি? একক বললেই অর্ধেক উত্তর আসে। টাকা আর শতাংশ হিসাব, মিটার আর ডিগ্রি মাপ।",
            },
            {
              title: "ভগ্নাংশ আসতে পারে কিনা ঠিক করুন",
              description:
                "না এলে পূর্ণসংখ্যার পরিবার। এলে পরের প্রশ্ন। মনে রাখুন, পূর্ণসংখ্যার Column এ ভগ্নাংশ দিলে PostgreSQL চুপচাপ গোল করে।",
            },
            {
              title: "পূর্ণসংখ্যা হলে দশ বছর পরের সবচেয়ে বড় মান ভাবুন",
              description:
                "integer দিয়ে শুরু করুন। নিশ্চিত ছোট হলে smallint, ২১৪ কোটি ছাড়াতে পারলে bigint। দ্রুত বাড়া Table এর id শুরু থেকেই bigint।",
            },
            {
              title: "ভগ্নাংশ হলে জিজ্ঞেস করুন যোগফল মিলতে হবে কিনা",
              description:
                "হিসাব হলে numeric, মাপ হলে double precision। money কোনো অবস্থাতেই না।",
            },
            {
              title: "numeric এর scale ঠিক করুন",
              description:
                "কয় ঘর দশমিক আসলে অর্থবহ? টাকায় ২, শতাংশে ২, মুদ্রার হারে ৬। বাড়তি অঙ্ক নীরবে গোল হবে, তাই এখানে কম দেবেন না।",
            },
            {
              title: "precision ঠিক করুন সবচেয়ে বড় মান থেকে",
              description:
                "দশমিকের আগের অঙ্কের সংখ্যা যোগ scale। একটু জায়গা রাখুন, কিন্তু অবাস্তব বড় না, কারণ precision ও একটা পাহারাদার।",
            },
            {
              title: "পরিসর CHECK দিয়ে বাঁধুন, তারপর সীমার মান দিয়ে পরীক্ষা করুন",
              description:
                "সর্বনিম্ন, সর্বোচ্চ, আর সীমার এক বেশি দিয়ে INSERT করে দেখুন কোনটা ঢোকে আর কোনটা Error দেয়। Error এর লেখা মিলিয়ে নিন।",
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
            ["টাকা real বা double precision এ", "যোগফল পয়সায় মেলে না, বড় দাম e+06 হয়ে যায়", "numeric(10, 2)"],
            ["টাকা money তে", "চিহ্ন Server এর Setting এ বাঁধা, ভাগে পয়সা কাটা যায়", "numeric, দেখানোর সময় App এ Format"],
            ["numeric(6, 2) এর মতো ছোট precision", "বড় দামে numeric field overflow", "সবচেয়ে বড় সম্ভাব্য মান থেকে হিসাব"],
            ["দরকারের চেয়ে ছোট scale", "বাড়তি দশমিক নীরবে গোল হয়", "কয় ঘর অর্থবহ, আগে ভাবুন"],
            ["সব কিছুতে smallint", "একদিন smallint out of range", "সন্দেহ হলে integer"],
            ["দ্রুত বাড়া Table এর id integer", "কয়েক বছর পরে integer out of range, বদলাতে বড় ALTER", "শুরু থেকেই bigint"],
            ["দুটো smallint যোগ বা গুণ", "হিসাবের মাঝে smallint out of range", "একপাশে ::integer"],
            ["float কে = দিয়ে মেলানো", "মুখে সমান মানও মেলে না", "numeric, অথবা পরিসর দিয়ে খোঁজা"],
            ["শতাংশের জন্য শুধু Type", "150% ছাড়ও ঢুকে যায়", "সাথে CHECK (... BETWEEN 0 AND 100)"],
            ["MySQL এ শুধু DECIMAL", "DECIMAL(10,0), পয়সা গোল হয়ে টাকা", "সবসময় DECIMAL(p, s)"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS num_bad_design;
CREATE TABLE num_bad_design (
  booking_id integer,
  seats      smallint,
  total_bdt  numeric(6, 2),
  paid_bdt   real
);
INSERT INTO num_bad_design VALUES (1, 2, 25000.00, 25000.00);
INSERT INTO num_bad_design VALUES (2, 40, 1234567.89, 1234567.89);
SELECT booking_id, seats, total_bdt, paid_bdt FROM num_bad_design;`}
              caption="এখানে দুটো ভুল আছে। প্রথমটা সাথে সাথে ধরা পড়ে: ERROR: numeric field overflow, DETAIL এ less than 10^4, কারণ numeric(6, 2) এ দশমিকের আগে ৪টা ঘর। total_bdt কে numeric(10, 2) করে আবার চালান। এবার দুটো Row ঢোকে, কিন্তু paid_bdt এ দ্বিতীয় Row দেখায় 1.2345679e+06: দ্বিতীয় ভুল, real। সেটাও numeric(10, 2) করুন, তখন দুই Column এই 1234567.89।"
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
                    href="https://www.postgresql.org/docs/current/datatype-numeric.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Numeric Types
                  </a>
                  : প্রতিটা Type এর সীমা, numeric এর precision আর scale, গোল করার নিয়ম, NaN আর Infinity, আর কোন Type কখন,
                  সেই পরামর্শ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/datatype-money.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Monetary Types
                  </a>
                  : money কীভাবে lc_monetary এর উপর নির্ভর করে, আর integer দিয়ে ভাগে কেন পয়সা কাটা যায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://wiki.postgresql.org/wiki/Don%27t_Do_This"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Wiki: Don&rsquo;t Do This
                  </a>
                  : অভিজ্ঞদের লেখা না করার তালিকা। money এর অংশটা পড়ুন, আর বাকি Type এর পরামর্শগুলোও পরের লেসনগুলোতে কাজে
                  আসবে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/numeric-types.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Numeric Data Types
                  </a>
                  : TINYINT থেকে BIGINT, UNSIGNED, DECIMAL, FLOAT আর DOUBLE, আর কোনগুলো Deprecated।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/out-of-range-and-overflow.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Out-of-Range and Overflow Handling
                  </a>
                  : Strict Mode চালু আর বন্ধ থাকলে সীমার বাইরের মানের কী হয়, আর UNSIGNED বিয়োগের Error।
                </ListItem>
                <ListItem>
                  <a href="https://floating-point-gui.de/" className={LINK} target="_blank" rel="noopener noreferrer">
                    The Floating-Point Guide
                  </a>
                  : 0.1 + 0.2 কেন 0.3 না, সহজ ভাষায়, বিভিন্ন Programming ভাষার উদাহরণ সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। Table বানানোর অংশে INT আর DECIMAL দেখলে এই লেসনের MySQL Section এর সাথে মিলিয়ে
                  নিন, বিশেষ করে DECIMAL এর পাশে precision আর scale লেখা আছে কিনা।
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
                  সংখ্যার চার পরিবার: পূর্ণসংখ্যা (smallint, integer, bigint), হুবহু দশমিক (numeric), আন্দাজি দশমিক (real,
                  double precision), আর money।
                </ListItem>
                <ListItem>
                  smallint 2 Byte, প্রায় ৩২ হাজার। integer 4 Byte, প্রায় ২১৪ কোটি। bigint 8 Byte। সাধারণ পছন্দ integer।
                  সীমার এক বেশি দিলেই out of range, SQLSTATE 22003, কোনো Row ঢোকে না।
                </ListItem>
                <ListItem>
                  দুটো smallint এর হিসাবের ফলও smallint, তাই মাঝপথে Error আসতে পারে। sum আর count নিজে থেকে bigint।
                  পূর্ণসংখ্যার Column এ ভগ্নাংশ চুপচাপ গোল হয়।
                </ListItem>
                <ListItem>
                  numeric(p, s): মোট p অঙ্ক, তার s টা দশমিকের পরে। বাড়তি দশমিক নীরবে গোল, শূন্য থেকে দূরে। দশমিকের আগে জায়গা
                  না থাকলে numeric field overflow, আর DETAIL বলে দেয় সীমা 10 এর কত ঘাত।
                </ListItem>
                <ListItem>
                  real প্রায় ৬ অঙ্ক, double precision প্রায় ১৫ অঙ্ক পর্যন্ত বিশ্বাসযোগ্য। দেখতে ঠিক, ভেতরে আন্দাজ। দশটা 0.10
                  যোগ করলে double precision এ 0.9999999999999999।
                </ListItem>
                <ListItem>
                  টাকা কখনো float এ না: যোগফল মেলে না, = দিয়ে খোঁজা ভাঙে। টাকা numeric(10, 2) এ, Island Tours এর মতো।
                </ListItem>
                <ListItem>
                  float ঠিক মাপজোকের জন্য: GPS, দূরত্ব, তাপমাত্রা। GPS এর জন্য double precision বা numeric(9, 6)।
                </ListItem>
                <ListItem>
                  money এড়িয়ে চলুন: চিহ্ন lc_monetary এ বাঁধা, ভাগে পয়সা কাটে, avg নেই। Type ধরন ঠিক করে, পরিসর ঠিক করে CHECK।
                </ListItem>
                <ListItem>
                  MySQL: UNSIGNED আর TINYINT আছে, শুধু DECIMAL মানে DECIMAL(10,0), money নেই, আর Strict Mode বন্ধ থাকলে সীমার
                  বাইরের মান চুপচাপ কেটে বসে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সংখ্যার পরে আসে লেখা: নাম, ফোন নম্বর, ঠিকানা, বাংলায় লেখা Review। সেখানেও Type এর প্রশ্ন আছে: char,
                varchar না text, একটা বাংলা অক্ষর কয় Byte, আর বাংলা নাম সাজানোর ক্রম কে ঠিক করে। পরের লেসন{" "}
                <Link href="/sql/topic/text-types" className={LINK}>
                  Text Types, Encoding and Collation
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
      ["চার পরিবার", "পূর্ণসংখ্যা, numeric, float, money", "12500.50 smallint এ 12501, numeric এ 12500.50"],
      ["smallint", "2 Byte, -32768 থেকে 32767", "max_seats, seats, rating, duration_days"],
      ["integer", "4 Byte, প্রায় ২১৪ কোটি, সাধারণ পছন্দ", "প্রতিটা Table এর id"],
      ["bigint", "8 Byte, দ্রুত বাড়া id আর বড় গণনা", "sum(seats) আর count(*) এর ফল"],
      ["out of range", "সীমার বাইরে Error 22003, উল্টে যায় না", "32768 smallint এ ঢোকে না"],
      ["হিসাবের Type", "দুটো smallint এর ফল smallint", "20000 + 20000 এ Error"],
      ["numeric(p, s)", "মোট p অঙ্ক, s টা দশমিকের পরে", "price_bdt numeric(10, 2)"],
      ["নীরব গোল", "বাড়তি দশমিক শূন্য থেকে দূরে গোল", "123.456 থেকে 123.46"],
      ["numeric field overflow", "দশমিকের আগে জায়গা নেই", "999.995 গোল হয়ে 1000.00, ধরে না"],
      ["real, double precision", "প্রায় ৬ আর ১৫ অঙ্ক, Binary আন্দাজ", "1234567.89 real এ 1.2345679e+06"],
      ["টাকা কখনো float এ না", "যোগফল আর = ভাঙে", "দশটা 0.10 এ 0.9999999999999999"],
      ["float এর জায়গা", "মাপজোক", "GPS double precision বা numeric(9, 6)"],
      ["money", "lc_monetary এ বাঁধা, ভাগে পয়সা কাটে", "12500 / 3 * 3 হয় $12,499.98"],
      ["CHECK", "Type ধরন ঠিক করে, CHECK পরিসর", "discount_pct 0 থেকে 100"],
      ["MySQL", "UNSIGNED, DECIMAL মানে (10,0), Strict Mode", "Strict বন্ধ হলে 300 সিট হয় 255"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "seats Column টা smallint। INSERT INTO t (seats) VALUES (32768); চালালে PostgreSQL এ কী হয়?",
        options: [
          {
            key: "A",
            text: "32767 জমা হয়, সাথে একটা Warning",
            isCorrect: false,
            explanation:
              "এটা Strict Mode বন্ধ থাকা MySQL এর আচরণ। PostgreSQL কখনো মান কেটে সীমায় বসায় না।",
          },
          {
            key: "B",
            text: "-32768 জমা হয়, কারণ সংখ্যা উল্টে যায়",
            isCorrect: false,
            explanation: "উল্টে যাওয়া হয় Java এর short এর মতো জায়গায়। PostgreSQL ভুল মান রাখার চেয়ে Row ফিরিয়ে দেয়।",
          },
          {
            key: "C",
            text: "ERROR: smallint out of range, কোনো Row ঢোকে না",
            isCorrect: true,
            explanation:
              "ঠিক। smallint এর সর্বোচ্চ 32767। এক বেশি দিলেই SQLSTATE 22003 সহ এই Error, আর Table আগের মতোই থাকে।",
          },
          {
            key: "D",
            text: "Column নিজে থেকে integer হয়ে যায়, 32768 জমা হয়",
            isCorrect: false,
            explanation: "Column এর Type কখনো নিজে থেকে বদলায় না। বদলাতে হলে ALTER TABLE লাগে।",
          },
        ],
      },
      {
        id: 2,
        text: "amount Column টা numeric(5, 2)। এতে 123.456 INSERT করলে কী জমা হয়?",
        options: [
          {
            key: "A",
            text: "123.46, কোনো Error বা Warning ছাড়া",
            isCorrect: true,
            explanation:
              "ঠিক। দশমিকের পরের বাড়তি অঙ্ক নীরবে গোল হয়। বাদ পড়া অঙ্ক 6, তাই উপরে, 123.46।",
          },
          {
            key: "B",
            text: "123.45, কারণ বাড়তি অঙ্ক কেটে ফেলা হয়",
            isCorrect: false,
            explanation: "numeric কাটে না, গোল করে। কাটে money, তাও শুধু integer দিয়ে ভাগের সময়।",
          },
          {
            key: "C",
            text: "ERROR: numeric field overflow",
            isCorrect: false,
            explanation:
              "overflow আসে দশমিকের আগে জায়গা না থাকলে। 123 তিন অঙ্ক, numeric(5, 2) এ দশমিকের আগে ৩টা ঘরই আছে।",
          },
          {
            key: "D",
            text: "123.456, পুরোটাই",
            isCorrect: false,
            explanation: "scale 2 মানে দশমিকের পরে ঠিক দুই ঘর। তৃতীয় ঘরের জায়গা নেই। পুরোটা রাখে শুধু সীমাহীন numeric।",
          },
        ],
      },
      {
        id: 3,
        text: "একই numeric(5, 2) Column এ 999.995 INSERT করলে কী হয়, আর কেন?",
        options: [
          {
            key: "A",
            text: "999.99 জমা হয়, কারণ সবচেয়ে বড় মানে আটকে যায়",
            isCorrect: false,
            explanation: "PostgreSQL কখনো সর্বোচ্চ মানে আটকে দেয় না। ওটা Strict Mode বন্ধ থাকা MySQL।",
          },
          {
            key: "B",
            text: "1000.00 জমা হয়",
            isCorrect: false,
            explanation: "1000.00 এ দশমিকের আগে ৪টা অঙ্ক, কিন্তু ঘর আছে ৩টা। তাই এটা জমা হতেই পারে না।",
          },
          {
            key: "C",
            text: "999.995 জমা হয়, কারণ মানটা 1000 এর কম",
            isCorrect: false,
            explanation: "scale 2, তাই তিন ঘর দশমিক রাখার জায়গা নেই। আর গোল করলে মানটা আর 1000 এর কম থাকে না।",
          },
          {
            key: "D",
            text: "ERROR: numeric field overflow, কারণ গোল করলে হয় 1000.00, যার জন্য দশমিকের আগে ঘর নেই",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL আগে গোল করে, তারপর মাপে। DETAIL বলে: must round to an absolute value less than 10^3।",
          },
        ],
      },
      {
        id: 4,
        text: "double precision Column এ দশটা Row, প্রতিটায় 0.10। SELECT sum(amount) = 1 এর ফল কী?",
        options: [
          {
            key: "A",
            text: "t, কারণ দশ গুণ 0.10 ঠিক 1",
            isCorrect: false,
            explanation: "গণিতে ঠিক 1, কিন্তু double precision এ 0.10 হুবহু থাকে না। যোগফল আসে 0.9999999999999999।",
          },
          {
            key: "B",
            text: "f, কারণ যোগফল 0.9999999999999999",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা 0.10 আসলে তার সবচেয়ে কাছের Binary মান, আর ভুলগুলো যোগ হয়ে শেষে ঠিক 1 হয় না। numeric এ একই কাজে t।",
          },
          {
            key: "C",
            text: "Error, double precision এ = চলে না",
            isCorrect: false,
            explanation: "চলে, কোনো Error নেই। সমস্যাটা ঠিক এখানেই: Error ছাড়াই ভুল উত্তর।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "কোনো Row এ NULL নেই, তাই তুলনার ফলও NULL না।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা নতুন Table এ ট্যুরের দাম রাখতে হবে, পয়সা সহ, যোগফল খাতার সাথে মিলতে হবে। কোন Type?",
        options: [
          {
            key: "A",
            text: "real, কারণ দামে দশমিক থাকে",
            isCorrect: false,
            explanation: "তানিমের ভুল। real এ ছয় অঙ্কের পরে সব আন্দাজ, 1234567.89 হয়ে যায় 1.2345679e+06।",
          },
          {
            key: "B",
            text: "money, কারণ নামেই টাকা",
            isCorrect: false,
            explanation: "money এর চিহ্ন Server এর lc_monetary এ বাঁধা, ভাগে পয়সা কাটে, avg নেই। PostgreSQL Wiki নিজেই নিষেধ করে।",
          },
          {
            key: "C",
            text: "numeric(10, 2)",
            isCorrect: true,
            explanation:
              "ঠিক। হুবহু দশমিক, পয়সার দুই ঘর, প্রায় দশ কোটি টাকা পর্যন্ত। Island Tours এর price_bdt ঠিক এটাই।",
          },
          {
            key: "D",
            text: "smallint, কারণ দাম পূর্ণসংখ্যা",
            isCorrect: false,
            explanation: "দামে পয়সা আছে, আর smallint 32767 এর বেশি ধরেই না। 12500.50 smallint এ হয়ে যায় 12501।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT (12500::money / 3) * 3; এর ফল $12,499.98। দুই পয়সা গেল কোথায়?",
        options: [
          {
            key: "A",
            text: "money কে integer দিয়ে ভাগ করলে পয়সার ভগ্নাংশ কেটে ফেলা হয়, গোল করা হয় না",
            isCorrect: true,
            explanation:
              "ঠিক। 4166.666 হয়ে যায় 4166.66, তিন গুণ করলে 12499.98। Documentation এ এটা লেখা আছে, আর গোল করা ফল চাইলে আগে numeric এ বদলাতে বলে।",
          },
          {
            key: "B",
            text: "money ভেতরে float, তাই আন্দাজের ভুল",
            isCorrect: false,
            explanation: "money ভেতরে একটা 8 Byte এর পূর্ণসংখ্যা, float না। ভুলটা আসে ভাগের নিয়ম থেকে।",
          },
          {
            key: "C",
            text: "lc_monetary C বলে পয়সা দেখায় না",
            isCorrect: false,
            explanation: "পয়সা দেখাচ্ছে: .98। সমস্যা দেখানোয় না, ভাগে।",
          },
          {
            key: "D",
            text: "গুণ করার সময় গোল হয়েছে",
            isCorrect: false,
            explanation: "4166.66 কে 3 দিয়ে গুণ করলে হুবহু 12499.98। ক্ষতিটা হয়ে গেছে আগেই, ভাগে।",
          },
        ],
      },
      {
        id: 7,
        text: "seats Column smallint। SELECT seats * seats FROM bookings; কোন অবস্থায় Error দিতে পারে?",
        options: [
          {
            key: "A",
            text: "কখনো না, গুণের ফল সবসময় bigint",
            isCorrect: false,
            explanation: "bigint হয় sum আর count এর মতো Aggregate এ। দুটো smallint এর গুণ বা যোগের ফল smallint।",
          },
          {
            key: "B",
            text: "seats এর মান 182 বা তার বেশি হলে, কারণ ফল smallint আর 182 এর বর্গ 33124",
            isCorrect: true,
            explanation:
              "ঠিক। 181 এর বর্গ 32761, ধরে যায়। 182 এর বর্গ 33124, smallint এর সীমা পার, তাই smallint out of range। একপাশে ::integer দিলে নিরাপদ।",
          },
          {
            key: "C",
            text: "seats এ NULL থাকলে",
            isCorrect: false,
            explanation: "NULL গুণ NULL হলো NULL, কোনো Error নেই।",
          },
          {
            key: "D",
            text: "Row সংখ্যা 32767 এর বেশি হলে",
            isCorrect: false,
            explanation: "Row এর সংখ্যার সাথে প্রতিটা Row এর গুণফলের কোনো সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "Strict Mode বন্ধ থাকা MySQL এ TINYINT UNSIGNED Column এ 300 INSERT করলে কী হয়?",
        options: [
          {
            key: "A",
            text: "ERROR 1264, Out of range value",
            isCorrect: false,
            explanation: "এটা Strict Mode চালু থাকলে, যেটা 8.4 এর Default। বন্ধ থাকলে Error হয় না।",
          },
          {
            key: "B",
            text: "300 জমা হয়, Column নিজে বড় হয়",
            isCorrect: false,
            explanation: "TINYINT UNSIGNED এর সীমা 255, Column নিজে থেকে বড় হয় না।",
          },
          {
            key: "C",
            text: "44 জমা হয়, কারণ 300 থেকে 256 বাদ",
            isCorrect: false,
            explanation: "MySQL উল্টে দেয় না, সীমায় বসিয়ে দেয়।",
          },
          {
            key: "D",
            text: "255 জমা হয়, শুধু একটা Warning সহ",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের MySQL সেশনে 300 হয়েছে 255, 40000 হয়েছে 32767, 12345.678 হয়েছে 999.99, প্রতিটার জন্য Warning 1264। App কিছুই টের পায় না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর নতুন Table এর জন্য সংখ্যার Type",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Type এর নিরীক্ষা:</strong> information_schema.columns থেকে Island Tours এর সব সংখ্যার Column বের করুন
        (smallint, integer, numeric)। প্রতিটার পাশে এক লাইনে লিখুন কেন এই Type ঠিক, অথবা আপনি হলে কী বদলাতেন আর কেন।
      </span>,
      <span key="2">
        <strong>Corporate Quote এর Table:</strong> <code className={CODE}>num_hw_quotes</code> বানান: quote_id, company,
        group_size (বড়জোর 400 জন), price_per_head_bdt (99999.99 পর্যন্ত), discount_pct (0 থেকে 100, দুই ঘর দশমিক, সাথে
        CHECK), pickup_lat আর pickup_lng। প্রতিটা Column এর Type এর কারণ এক লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>সীমার পরীক্ষা:</strong> Task 2 এর Table এ পাঁচটা ঠিক Row ঢোকান, তার মধ্যে অন্তত একটায় প্রতিটা Column এর
        সবচেয়ে বড় বৈধ মান। তারপর তিনটা ইচ্ছাকৃত ভুল INSERT চালান: একটা out of range, একটা numeric field overflow, একটা CHECK
        ভাঙা। প্রতিটার Error এর প্রথম লাইন লিখে রাখুন।
      </span>,
      <span key="4">
        <strong>float বনাম numeric:</strong> একশোটা 0.01 টাকার Payment double precision, real আর numeric(10, 2), তিন Column
        এ রাখুন। তিনটার যোগফল আর প্রতিটা যোগফল = 1 কিনা লিখুন। তারপর money তে 1000 টাকা সাত ভাগ করে সাত গুণ করুন, কত হারাল
        দেখান।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> দোকানের ক্যাশ বাক্সের উদাহরণ দিয়ে একজন বন্ধুকে বোঝান টাকা কেন কখনো float
        এ রাখা যায় না, আর GPS কেন রাখা যায়।
      </span>,
    ],
    deliverables: [
      <span key="d1">সংখ্যার Column এর তালিকা আর প্রতিটার পাশে এক লাইনের মন্তব্য</span>,
      <span key="d2">num_hw_quotes এর CREATE TABLE আর প্রতিটা Type এর কারণ</span>,
      <span key="d3">পাঁচটা ঠিক INSERT, তিনটা ভুল INSERT আর তাদের Error এর প্রথম লাইন</span>,
      <span key="d4">তিন Type এর যোগফল, = 1 এর ফল, আর money ভাগের ক্ষতি</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ সংখ্যার Type",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "পূর্ণসংখ্যার সীমা",
        description:
          "প্রথম ফাইল চালান। প্রথম INSERT সফল, তারপর smallint out of range আর integer out of range। শেষ দুই Query তে দেখুন একপাশে integer দিলে 40000 আসে।",
      },
      {
        title: "numeric এর নীরব গোল",
        description:
          "দ্বিতীয় ফাইলে চারটা মান গোল হয়ে বসে: 123.46, 0.01, -2.35, 12.00। 999.995 দেয় numeric field overflow, আর \\d তে Type numeric(5,2)।",
      },
      {
        title: "দশটা 0.10",
        description:
          "তৃতীয় ফাইলে double precision এর যোগফল 0.9999999999999999, numeric এর 1.00। real এ 16777217 আর বড় দাম কী হয়, সেটাও দেখুন।",
      },
      {
        title: "money এর অভ্যাস",
        description:
          "চতুর্থ ফাইলে lc_monetary দেখুন। আপনার Server এ আলাদা হতে পারে, তখন চিহ্নও আলাদা। ভাগে দুই পয়সা হারানো আর avg এর Error মিলিয়ে নিন।",
      },
      {
        title: "Type পড়া",
        description:
          "পঞ্চম ফাইলে \\d tours আর information_schema থেকে আটটা smallint ও numeric Column। এটাই Exercise 4 এর উত্তর।",
      },
      {
        title: "নিজের Table, নিজের পরীক্ষা",
        description:
          "ষষ্ঠ ফাইলে অফারের Table। লক্ষ করুন 100.5% ছাড় ঢুকে যায়, কারণ CHECK নেই। তারপর দুটো Error: numeric field overflow আর smallint out of range।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-integer-limits.sql",
        code: `DROP TABLE IF EXISTS num_counters;
CREATE TABLE num_counters (s smallint, i integer, b bigint);
INSERT INTO num_counters VALUES (32767, 2147483647, 9223372036854775807);
SELECT * FROM num_counters;
--    s   |     i      |          b
-- -------+------------+---------------------
--  32767 | 2147483647 | 9223372036854775807

INSERT INTO num_counters (s) VALUES (32768);
-- ERROR:  smallint out of range
INSERT INTO num_counters (i) VALUES (2147483648);
-- ERROR:  integer out of range

SELECT 20000::smallint + 20000::smallint;
-- ERROR:  smallint out of range
SELECT 20000::smallint + 20000 AS widened;
-- 40000`,
      },
      {
        language: "sql",
        filename: "02-numeric-rounding.sql",
        code: `DROP TABLE IF EXISTS num_prices;
CREATE TABLE num_prices (label text, amount numeric(5, 2));
INSERT INTO num_prices VALUES ('a', 123.456), ('b', 0.005), ('c', -2.345), ('d', 12);
SELECT * FROM num_prices;
--  label | amount
-- -------+--------
--  a     | 123.46
--  b     |   0.01
--  c     |  -2.35
--  d     |  12.00

INSERT INTO num_prices VALUES ('e', 999.995);
-- ERROR:  numeric field overflow
-- DETAIL:  A field with precision 5, scale 2 must round to an absolute value less than 10^3.

\\d num_prices
--  Column |     Type     | ...
--  label  | text         |
--  amount | numeric(5,2) |`,
      },
      {
        language: "sql",
        filename: "03-float-drift.sql",
        code: `DROP TABLE IF EXISTS num_wallet;
CREATE TABLE num_wallet (payment_no integer, amt_float double precision, amt_numeric numeric(10, 2));
INSERT INTO num_wallet SELECT g, 0.10, 0.10 FROM generate_series(1, 10) AS g;
SELECT sum(amt_float) AS float_total, sum(amt_numeric) AS numeric_total,
       sum(amt_float) = 1 AS float_is_one, sum(amt_numeric) = 1 AS numeric_is_one
FROM num_wallet;
--     float_total     | numeric_total | float_is_one | numeric_is_one
-- --------------------+---------------+--------------+----------------
--  0.9999999999999999 |          1.00 | f            | t

SELECT 16777217::real AS r, 1234567.89::real AS price_in_real;
--        r       | price_in_real
-- ---------------+---------------
--  1.6777216e+07 | 1.2345679e+06`,
      },
      {
        language: "sql",
        filename: "04-money.sql",
        code: `SHOW lc_monetary;
-- en_US.utf8   (Docker এর postgres:18 এ; আপনার Server এ অন্য কিছু হতে পারে)

SELECT 12500.50::money AS price, 12500::money / 3 AS one_share, (12500::money / 3) * 3 AS three_shares;
--    price    | one_share | three_shares
-- ------------+-----------+--------------
--  $12,500.50 | $4,166.66 |   $12,499.98

SELECT avg(amount_bdt::money) FROM payments;
-- ERROR:  function avg(money) does not exist

SELECT 12500.50::money::numeric(12, 2) AS back_to_numeric;
-- 12500.50`,
      },
      {
        language: "sql",
        filename: "05-read-types.sql",
        code: `\\d tours
--  duration_days  | smallint      | ... | not null |
--  price_bdt      | numeric(10,2) | ... | not null |
--  max_seats      | smallint      | ... | not null |
-- Check constraints:
--     "tours_max_seats_check" CHECK (max_seats > 0)
--     "tours_price_bdt_check" CHECK (price_bdt >= 0::numeric)

SELECT table_name, column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name NOT LIKE 'num%'
  AND data_type IN ('smallint', 'numeric')
ORDER BY table_name, column_name;
--  table_name |  column_name  | data_type | numeric_precision | numeric_scale
-- ------------+---------------+-----------+-------------------+---------------
--  bookings   | seats         | smallint  |                16 |             0
--  bookings   | total_bdt     | numeric   |                10 |             2
--  departures | seats_left    | smallint  |                16 |             0
--  payments   | amount_bdt    | numeric   |                10 |             2
--  reviews    | rating        | smallint  |                16 |             0
--  tours      | duration_days | smallint  |                16 |             0
--  tours      | max_seats     | smallint  |                16 |             0
--  tours      | price_bdt     | numeric   |                10 |             2
-- (8 rows)`,
      },
      {
        language: "sql",
        filename: "06-design-offers.sql",
        code: `DROP TABLE IF EXISTS num_lab_offers;
CREATE TABLE num_lab_offers (
  offer_code    text,
  discount_pct  numeric(5, 2),
  seat_cap      smallint,
  min_spend_bdt numeric(9, 2)
);
INSERT INTO num_lab_offers VALUES
  ('EID25', 25, 300, 15000), ('MONSOON', 12.345, 40, 8500.555), ('VIP', 100, 10, 9999999.99);
SELECT * FROM num_lab_offers ORDER BY offer_code;
--  offer_code | discount_pct | seat_cap | min_spend_bdt
-- ------------+--------------+----------+---------------
--  EID25      |        25.00 |      300 |      15000.00
--  MONSOON    |        12.35 |       40 |       8500.56
--  VIP        |       100.00 |       10 |    9999999.99

INSERT INTO num_lab_offers VALUES ('TOO_BIG', 100.5, 10, 1000);
-- INSERT 0 1   (150% ও ঢুকত: Type একা পরিসর আটকায় না, CHECK লাগে)
INSERT INTO num_lab_offers VALUES ('TOO_RICH', 10, 10, 10000000);
-- ERROR:  numeric field overflow
-- DETAIL:  A field with precision 9, scale 2 must round to an absolute value less than 10^7.
INSERT INTO num_lab_offers VALUES ('TOO_MANY', 10, 40000, 1000);
-- ERROR:  smallint out of range`,
      },
    ],
    tip: (
      <ContentParagraph>
        কোনো মানের Type নিয়ে সন্দেহ হলে psql এ <code className={CODE}>SELECT pg_typeof(মান);</code> চালান, আর Column এর
        Type দেখতে <code className={CODE}>\d table_name</code>। আপনার নিজের Server এ lc_monetary আলাদা হলে money এর চিহ্নও
        আলাদা দেখাবে, ঠিক সেই কারণেই money এড়িয়ে চলা।
      </ContentParagraph>
    ),
  },
};
