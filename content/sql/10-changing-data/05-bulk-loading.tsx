import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { CsvParserLab, StagingFlowLab } from "../../../components/course/topics/dml/bulk-animations";
import {
  BulkTripsDiagram,
  CsvAnatomyDiagram,
  FileLocationSplit,
  LoadSpeedChart,
  StagingPipelineDiagram,
} from "../../../components/course/topics/dml/bulk-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * Hill Trails Agency's file for the night of 1 November 2026, written onto the
 * query box's own small disk. Each VALUES row becomes one line of the file, so
 * the reader sees the CSV exactly as the agency sent it, mistakes included.
 */
const AGENT_FILE = `COPY (VALUES
  ('agent_ref,customer_email,tour_title,starts_on,seats,amount_bdt'),
  ('HT-1001,rahim.uddin@mail.example,Saint Martin Island Escape,2026-11-20,2,25000'),
  ('HT-1002, Nusrat.Jahan@mail.example ,Cox''s Bazar Beach Weekend,2026-11-27,3,25500'),
  ('HT-1003,lamia.haque@mail.example,Sylhet Tea Garden Tour,2026-11-14,two,15600'),
  ('HT-1004,shuvo.das@mail.example,Sundarbans Mangrove Cruise,2026-12-04,1,18000'),
  ('HT-1005,unknown.person@mail.example,Sajek Valley Cloud Trip,2026-12-11,2,19000'),
  ('HT-1006,kamal.hasan@mail.example,Kuakata Sunset Tour,2026-12-01,2,12000'),
  ('HT-1002, Nusrat.Jahan@mail.example ,Cox''s Bazar Beach Weekend,2026-11-27,3,25500'),
  ('HT-1007,imran.kabir@mail.example,Ratargul Swamp Boat Day,2026-11-21,4,14000')
) TO '/tmp/agent-2026-11-01.csv';`;

/**
 * The staging table: every column text, so COPY never refuses a line. line_no
 * starts at 2 because line 1 of the file is the header, which makes line_no the
 * same number the agency sees in its own file.
 */
const AGENT_STAGING = `DROP TABLE IF EXISTS bulk_agent_staging;
CREATE TABLE bulk_agent_staging (
  line_no        integer GENERATED ALWAYS AS IDENTITY (START WITH 2),
  agent_ref      text,
  customer_email text,
  tour_title     text,
  starts_on      text,
  seats          text,
  amount_bdt     text
);
COPY bulk_agent_staging (agent_ref, customer_email, tour_title, starts_on, seats, amount_bdt)
  FROM '/tmp/agent-2026-11-01.csv' WITH (FORMAT csv, HEADER);`;

/** Cleans and checks every staged line once, and keeps the verdict next to it. */
const AGENT_CHECK = `DROP TABLE IF EXISTS bulk_agent_checked;
CREATE TABLE bulk_agent_checked AS
SELECT s.line_no,
       trim(s.agent_ref)             AS agent_ref,
       lower(trim(s.customer_email)) AS email,
       trim(s.seats)                 AS seats,
       trim(s.amount_bdt)            AS amount_bdt,
       c.customer_id,
       d.departure_id,
       CASE
         WHEN s.line_no > min(s.line_no) OVER (PARTITION BY trim(s.agent_ref))
           THEN 'duplicate of line ' || min(s.line_no) OVER (PARTITION BY trim(s.agent_ref))
         WHEN NOT pg_input_is_valid(trim(s.seats), 'smallint') THEN 'seats is not a number'
         WHEN c.customer_id IS NULL  THEN 'unknown customer'
         WHEN d.departure_id IS NULL THEN 'unknown departure'
         ELSE 'ok'
       END AS verdict
FROM bulk_agent_staging s
LEFT JOIN customers  c ON c.email = lower(trim(s.customer_email))
LEFT JOIN tours      t ON t.title = trim(s.tour_title)
LEFT JOIN departures d ON d.tour_id = t.tour_id
                      AND to_char(d.starts_on, 'YYYY-MM-DD') = trim(s.starts_on);`;

/** A typed copy of the agency file's columns, used to show what COPY does with a bad value. */
const AGENT_TYPED = `DROP TABLE IF EXISTS bulk_agent_typed;
CREATE TABLE bulk_agent_typed (
  agent_ref      text,
  customer_email text,
  tour_title     text,
  starts_on      date,
  seats          smallint,
  amount_bdt     numeric(10, 2)
);`;

/** Real output from the client container, connected to the server container. */
const STDIN_SESSION = `# Password আসে ~/.pgpass থেকে, Module 02 এর মতো
$ psql -h localhost -U postgres -d island_tours -c 'TRUNCATE bulk_agent_staging'
TRUNCATE TABLE
$ psql -h localhost -U postgres -d island_tours -c 'COPY bulk_agent_staging FROM STDIN WITH (FORMAT csv, HEADER)' < agent-2026-11-01.csv
COPY 8

$ cat export.sql
COPY (SELECT tour_id, title, price_bdt
      FROM tours
      ORDER BY tour_id)
TO STDOUT WITH (FORMAT csv, HEADER) \\g tours.csv
$ psql -h localhost -U postgres -d island_tours -f export.sql
COPY 9
$ head -3 tours.csv
tour_id,title,price_bdt
1,Saint Martin Island Escape,12500.00
2,Cox's Bazar Beach Weekend,8500.00`;

/** Real output from the mysql:8.4 container. */
const MYSQL_SERVER_SESSION = `mysql> SHOW VARIABLES LIKE 'secure_file_priv';
+------------------+-----------------------+
| Variable_name    | Value                 |
+------------------+-----------------------+
| secure_file_priv | /var/lib/mysql-files/ |
+------------------+-----------------------+

mysql> CREATE TABLE bulk_agent_staging (agent_ref VARCHAR(20), customer_email VARCHAR(100),
    ->   tour_title VARCHAR(100), starts_on VARCHAR(20), seats VARCHAR(10), amount_bdt VARCHAR(20));

mysql> LOAD DATA INFILE '/tmp/agent-2026-11-01.csv' INTO TABLE bulk_agent_staging
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;
ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement

mysql> LOAD DATA INFILE '/var/lib/mysql-files/agent-2026-11-01.csv' INTO TABLE bulk_agent_staging
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;
Query OK, 8 rows affected (0.23 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0`;

const MYSQL_TYPED_SESSION = `mysql> CREATE TABLE bulk_agent_typed (agent_ref VARCHAR(20), customer_email VARCHAR(100),
    ->   tour_title VARCHAR(100), starts_on DATE, seats SMALLINT, amount_bdt DECIMAL(10,2));

mysql> LOAD DATA INFILE '/var/lib/mysql-files/agent-2026-11-01.csv' INTO TABLE bulk_agent_typed
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;
ERROR 1366 (HY000): Incorrect integer value: 'two' for column 'seats' at row 3
mysql> SELECT COUNT(*) FROM bulk_agent_typed;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+

mysql> LOAD DATA INFILE '/var/lib/mysql-files/agent-2026-11-01.csv' IGNORE INTO TABLE bulk_agent_typed
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;
Query OK, 8 rows affected, 1 warning (0.17 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+------------------------------------------------------------+
| Level   | Code | Message                                                    |
+---------+------+------------------------------------------------------------+
| Warning | 1366 | Incorrect integer value: 'two' for column 'seats' at row 3 |
+---------+------+------------------------------------------------------------+

mysql> SELECT agent_ref, seats FROM bulk_agent_typed WHERE agent_ref = 'HT-1003';
+-----------+-------+
| agent_ref | seats |
+-----------+-------+
| HT-1003   |     0 |
+-----------+-------+`;

const MYSQL_SET_SESSION = `mysql> TRUNCATE bulk_agent_typed;
mysql> LOAD DATA INFILE '/var/lib/mysql-files/agent-2026-11-01.csv' INTO TABLE bulk_agent_typed
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES
    ->   (agent_ref, @email, tour_title, starts_on, @seats, amount_bdt)
    ->   SET customer_email = LOWER(TRIM(@email)),
    ->       seats = IF(@seats REGEXP '^[0-9]+$', @seats, NULL);
Query OK, 8 rows affected (0.05 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM bulk_agent_typed INTO OUTFILE '/var/lib/mysql-files/typed.csv'
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n';
Query OK, 8 rows affected (0.00 sec)

mysql> SELECT * FROM bulk_agent_typed INTO OUTFILE '/var/lib/mysql-files/typed.csv'
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n';
ERROR 1086 (HY000): File '/var/lib/mysql-files/typed.csv' already exists

$ head -3 /var/lib/mysql-files/typed.csv
"HT-1001","rahim.uddin@mail.example","Saint Martin Island Escape","2026-11-20",2,25000.00
"HT-1002","nusrat.jahan@mail.example","Cox's Bazar Beach Weekend","2026-11-27",3,25500.00
"HT-1003","lamia.haque@mail.example","Sylhet Tea Garden Tour","2026-11-14",\\N,15600.00`;

const MYSQL_LOCAL_SESSION = `-- Server: local_infile = OFF (8.4 এর Default), Client: --local-infile=1
mysql> LOAD DATA LOCAL INFILE 'agent-2026-11-01.csv' INTO TABLE bulk_agent_staging
    ->   FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;
ERROR 3948 (42000): Loading local data is disabled; this must be enabled on both the client and server sides

-- Server এ SET GLOBAL local_infile = ON; Client এ কোনো Option নেই
mysql> LOAD DATA LOCAL INFILE 'agent-2026-11-01.csv' INTO TABLE bulk_agent_staging ...;
ERROR 2068 (HY000): LOAD DATA LOCAL INFILE file request rejected due to restrictions on access.

-- দুই দিকেই চালু
mysql> LOAD DATA LOCAL INFILE 'agent-2026-11-01.csv' INTO TABLE bulk_agent_staging ...;
Query OK, 8 rows affected (0.01 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0`;

/** Practical lab drill 2: the agency file made by hand, then staged with \copy. */
const DRILL_TWO = `# Terminal, একটা ফাঁকা ফোল্ডারে
cat > agent-2026-11-01.csv <<'EOF'
agent_ref,customer_email,tour_title,starts_on,seats,amount_bdt
HT-1001,rahim.uddin@mail.example,Saint Martin Island Escape,2026-11-20,2,25000
HT-1002, Nusrat.Jahan@mail.example ,Cox's Bazar Beach Weekend,2026-11-27,3,25500
HT-1003,lamia.haque@mail.example,Sylhet Tea Garden Tour,2026-11-14,two,15600
HT-1004,shuvo.das@mail.example,Sundarbans Mangrove Cruise,2026-12-04,1,18000
HT-1005,unknown.person@mail.example,Sajek Valley Cloud Trip,2026-12-11,2,19000
HT-1006,kamal.hasan@mail.example,Kuakata Sunset Tour,2026-12-01,2,12000
HT-1002, Nusrat.Jahan@mail.example ,Cox's Bazar Beach Weekend,2026-11-27,3,25500
HT-1007,imran.kabir@mail.example,Ratargul Swamp Boat Day,2026-11-21,4,14000
EOF
wc -l agent-2026-11-01.csv
# 9 agent-2026-11-01.csv

# psql, একই ফোল্ডার থেকে চালু করা
DROP TABLE IF EXISTS bulk_agent_staging;
CREATE TABLE bulk_agent_staging (
  line_no integer GENERATED ALWAYS AS IDENTITY (START WITH 2),
  agent_ref text, customer_email text, tour_title text,
  starts_on text, seats text, amount_bdt text
);
\\copy bulk_agent_staging (agent_ref, customer_email, tour_title, starts_on, seats, amount_bdt) FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER)
-- COPY 8
SELECT count(*) AS staged, min(line_no) AS first_line, max(line_no) AS last_line
FROM bulk_agent_staging;
-- (1 row) 8 | 2 | 9`;

/** Practical lab drill 3: the same check the query boxes run, then a count per verdict. */
const DRILL_THREE = `${AGENT_CHECK}
-- SELECT 8

SELECT verdict, count(*) AS lines
FROM bulk_agent_checked
GROUP BY verdict
ORDER BY verdict;
-- (5 rows) duplicate of line 3   | 1
--          ok                    | 4
--          seats is not a number | 1
--          unknown customer      | 1
--          unknown departure     | 1`;

export const bulkLoadingContent: TopicData = {
  id: "bulk-loading",
  introduction: {
    badge: "MODULE 10 · LESSON 05",
    title: <SectionTitle>Bulk Loading: COPY আর CSV দিয়ে হাজার Row একবারে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের চার লেসনে আপনি Row ঢুকিয়েছেন, বদলেছেন, মুছেছেন, আর ON CONFLICT দিয়ে দুটো কাজ এক Statement এ করেছেন। সব কাজই ছিল
          হাতে লেখা কয়েকটা Row নিয়ে। কিন্তু বাস্তবে Data অনেক সময় আসে একটা File এ: পার্টনার Agency র রাতের Booking তালিকা, পুরনো
          System থেকে সরানো দশ হাজার Customer, হিসাবরক্ষকের জন্য বছরের সব Payment। তখন প্রশ্নটা আর “একটা Row কীভাবে ঢোকাব” থাকে না,
          হয়ে যায় “হাজার হাজার Row দ্রুত, নিরাপদে, ভুল ছাড়া কীভাবে ঢোকাব আর বের করব”।
        </ContentParagraph>
        <ContentParagraph>
          PostgreSQL এর উত্তর একটা কমান্ড: <code className={CODE}>COPY</code>। এক Statement এ পুরো File পড়ে Table এ ঢোকায়, বা পুরো
          Table কে File এ লিখে দেয়। সাথে আছে psql এর <code className={CODE}>\copy</code>, যেটা দেখতে প্রায় একই কিন্তু File খোঁজে
          সম্পূর্ণ অন্য জায়গায়। এই পার্থক্যটা না বুঝলে প্রথম দিনেই একটা অদ্ভুত Error দেখবেন: File টা তো চোখের সামনে আছে, PostgreSQL
          বলছে নেই।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে থাকছে CSV এর নিয়ম, COPY TO আর COPY FROM, তাদের Option, Server আর আপনার নিজের File এর পার্থক্য, খারাপ লাইন আর
          ON_ERROR, Staging Table দিয়ে অগোছালো File পরিষ্কার করা, generate_series, এক Transaction এর Load, বড় Load দ্রুত করার উপায়, আর
          MySQL এর LOAD DATA INFILE।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি এক Statement এ হাজার লাইন নিই। শুধু বলে দিন File টা কোথায় আর কোন ভাষায় লেখা। আর একটা লাইনও ভুল থাকলে পুরো চালানটাই ফিরিয়ে দিই, যাতে অর্ধেক ভরা ট্রাক কখনো গুদামে না ঢোকে।",
      author: "COPY",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রাত এগারোটার CSV</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 নভেম্বর 2026। সাপ্তাহিক বৈঠকে ফারুক সাহেব একটা সুখবর দিলেন: সিলেটের Hill Trails Agency এখন থেকে Island Tours এর
                ট্যুর বিক্রি করবে। তাদের নিজেদের Website আছে, নিজেদের Customer আছে। প্রতি রাতে এগারোটায় তারা দিনের সব Booking একটা CSV File
                এ পাঠাবে, আর পরদিন সকালে সেগুলো Island Tours এর Database এ থাকতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম প্রথম File টা খুলে দেখলেন। প্রথম লাইনে Column এর নাম, তারপর প্রতি লাইনে একটা Booking, ঘরগুলো কমা দিয়ে আলাদা। আজ
                মাত্র আটটা লাইন। কিন্তু Agency বলেছে ঈদের মৌসুমে দিনে কয়েক হাজার হবে। আর এই আট লাইনেই তানিম তিনটা গোলমাল চোখে দেখলেন:
                একটা ঘরে সংখ্যার বদলে লেখা two, একটা লাইন হুবহু দুইবার, আর একটা Email এর দুই পাশে ফাঁকা জায়গা।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম চিন্তা: প্রতিটা লাইনের জন্য একটা করে INSERT লিখে ফেলা। আট লাইনে চলে, আট হাজারে না। একটা গুদামের কথা ভাবুন। দরজার
                বাইরে একটা ট্রাক ভর্তি এক হাজার বস্তা চাল। একজন লোক একটা একটা বস্তা কাঁধে নিয়ে হেঁটে ভেতরে রাখতে পারেন, প্রতিবার দরজা
                খোলা, খাতায় সই, দরজা বন্ধ। অথবা ট্রাকটা পিছিয়ে দরজায় লাগিয়ে একটা Conveyor Belt চালু করা যায়: দরজা একবার খোলে, খাতায় সই
                একবার, বস্তা গড়িয়ে ঢুকতে থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা একটা INSERT</strong> হলো কাঁধে করে বস্তা বওয়া। প্রতিটা Row এর জন্য আলাদা Statement, আলাদা যাতায়াত, আর
                  Transaction না দিলে আলাদা COMMIT।
                </ListItem>
                <ListItem>
                  <strong>অনেক Row এর এক INSERT</strong> হলো একবারে একটা ঠেলাগাড়ি ভরে নেওয়া।{" "}
                  <Link href="/sql/topic/insert" className={LINK}>
                    Lesson 01
                  </Link>{" "}
                  এ এটা দেখেছেন। ভালো, কিন্তু হাজার হাজার Row কে VALUES এর ভেতরে লেখা নিজেই একটা কাজ।
                </ListItem>
                <ListItem>
                  <strong>COPY</strong> হলো Conveyor Belt। File এর লাইনগুলো সরাসরি Table এ গড়িয়ে যায়, একটা Statement এ। PostgreSQL এর
                  নিজের Docs বলে, অনেক Row ঢোকানোর জন্য COPY ই বিশেষভাবে বানানো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কিন্তু Conveyor Belt এর একটা নিয়ম আছে: বস্তা ফেটে গেলে পুরো চালান থামে। COPY ও তাই করে, একটা খারাপ লাইনেই পুরো File ফেরত।
                তাই তানিমের আসল কাজ দুটো: File টা দ্রুত ঢোকানো, আর ভুল লাইনগুলো আলাদা করে Agency কে ফেরত পাঠানো, ভালো লাইনগুলো না
                হারিয়ে। এই লেসন সেই দুই কাজের পুরো পথ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Bulk Loading মানে কী",
          content: (
            <ContentParagraph>
              Bulk Loading মানে অনেক Row একসাথে Database এ ঢোকানো, সাধারণত একটা File থেকে। উল্টো দিকটা, অনেক Row একসাথে File এ বের
              করা, তাকে বলে Export বা Bulk Unloading। দুই দিকের কাজই PostgreSQL এ একটা কমান্ড করে: COPY FROM ঢোকায়, COPY TO বের করে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "three-ways",
      subHeader: { index: "002", title: "Three Ways to Add Many Rows" },
      title: <SectionTitle>অনেক Row ঢোকানোর তিন পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা INSERT Statement চালালে PostgreSQL প্রতিবার একই কয়েকটা কাজ করে: Statement টা পড়ে বোঝে (Parse), কীভাবে চালাবে ঠিক করে
                (Plan), চালায়, তারপর আপনাকে উত্তর পাঠায়। Autocommit চালু থাকলে, মানে আলাদা BEGIN না দিলে, প্রতিটা Statement এর শেষে একটা
                COMMIT ও হয়, আর COMMIT মানে Disk এ পাকা করে লেখা পর্যন্ত অপেক্ষা। আপনার App আর Database আলাদা মেশিনে থাকলে প্রতিটা Statement
                এ Network এ একবার যাওয়া আর একবার ফেরাও যোগ হয়। এক Row এর জন্য এই খরচ কিছুই না। এক লাখ Row এর জন্য এটাই পুরো সময়।
              </ContentParagraph>
              <ContentParagraph>
                অনেক Row এর এক INSERT এই খরচ ভাগ করে নেয়: একবার Parse, একবার যাতায়াত, একবার COMMIT, কিন্তু ভেতরে হাজার Row। COPY আরও এক ধাপ
                যায়। সে Data কে SQL হিসেবেই পড়ে না, পড়ে একটা সরল লেখা হিসেবে: লাইন মানে Row, কমা মানে পরের Column। প্রতিটা মান Parse করার
                জন্য SQL এর পুরো ব্যাকরণ লাগে না, তাই আরও দ্রুত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <BulkTripsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের বক্সে একই পাঁচজন গাইডের নাম তিন উপায়ে তিনটা আলাদা Table এ ঢুকবে। COPY এর জন্য একটা File লাগে। এই বক্সের PostgreSQL
                আপনার ব্রাউজারের ভেতরে চলে, আর তার নিজের একটা ছোট্ট নকল Disk আছে, যেখানে <code className={CODE}>/tmp</code> ফোল্ডারে File
                লেখা আর পড়া যায়। আপনার কম্পিউটারের আসল File এখান থেকে দেখা যায় না, তাই প্রথমে COPY TO দিয়ে guides Table থেকেই একটা CSV
                বানিয়ে নিচ্ছি, তারপর COPY FROM দিয়ে সেটা পড়ছি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই পাঁচটা Row, তিন উপায়ে"
              query={`DROP TABLE IF EXISTS bulk_one, bulk_many, bulk_copy;
CREATE TABLE bulk_one  (guide text, language text);
CREATE TABLE bulk_many (guide text, language text);
CREATE TABLE bulk_copy (guide text, language text);

-- 1. একটা একটা করে: পাঁচটা Statement
INSERT INTO bulk_one VALUES ('Jamal Hossain', 'Bangla');
INSERT INTO bulk_one VALUES ('Shirin Akter', 'English');
INSERT INTO bulk_one VALUES ('Rubel Mia', 'Bangla');
INSERT INTO bulk_one VALUES ('Ayesha Siddiqua', 'English');
INSERT INTO bulk_one VALUES ('Nazmul Karim', 'Bangla');

-- 2. এক INSERT এ পাঁচটা Row
INSERT INTO bulk_many VALUES
  ('Jamal Hossain', 'Bangla'), ('Shirin Akter', 'English'), ('Rubel Mia', 'Bangla'),
  ('Ayesha Siddiqua', 'English'), ('Nazmul Karim', 'Bangla');

-- 3. COPY: আগে File বানাই, তারপর File থেকে পড়ি
COPY (SELECT full_name, language FROM guides ORDER BY guide_id) TO '/tmp/guides.csv' WITH (FORMAT csv);
COPY bulk_copy FROM '/tmp/guides.csv' WITH (FORMAT csv);

SELECT (SELECT count(*) FROM bulk_one)  AS one_by_one,
       (SELECT count(*) FROM bulk_many) AS multi_row,
       (SELECT count(*) FROM bulk_copy) AS with_copy;`}
              caption="প্রথম পথে পাঁচবার INSERT 1, দ্বিতীয় পথে একবার INSERT 5, তৃতীয় পথে দুটো COPY 5: একটা File এ লেখার, একটা File থেকে পড়ার। শেষের SELECT এ তিনটা Table এই 5, 5, 5। ফলাফল একই, পার্থক্য শুধু কতবার Statement চলল। psql এ INSERT এর উত্তর দেখাবে INSERT 0 1, মাঝের 0 টা পুরনো দিনের একটা চিহ্ন, এখন সবসময় 0।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাঁচটা Row এ পার্থক্য চোখে পড়ে না। তাই এবার পঞ্চাশ হাজার। নিচের বক্স একই পঞ্চাশ হাজার Row দুইভাবে ঢোকায়: একটা Loop এ পঞ্চাশ
              হাজার আলাদা INSERT, আর একটা COPY। সময় মাপতে প্রতিটা ধাপের আগে আর পরে <code className={CODE}>clock_timestamp()</code>, মানে
              ঠিক এই মুহূর্তের ঘড়ির সময়, একটা ছোট Log Table এ লিখে রাখছি। Loop টা লেখা হয়েছে <code className={CODE}>DO</code> Block এ, যেটা
              PL/pgSQL নামের PostgreSQL এর নিজের ছোট Programming ভাষা। এর পুরো গল্প Module 14 এ, এখানে শুধু জানুন এটা পঞ্চাশ হাজারবার INSERT
              চালায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পঞ্চাশ হাজার Row এর দৌড়"
              query={`DROP TABLE IF EXISTS bulk_race_log, bulk_race_loop, bulk_race_copy;
CREATE TABLE bulk_race_log  (step text, at timestamptz);
CREATE TABLE bulk_race_loop (id integer, full_name text, email text);
CREATE TABLE bulk_race_copy (id integer, full_name text, email text);
COPY (SELECT g, 'Customer ' || g, 'user' || g || '@mail.example'
      FROM generate_series(1, 50000) AS g) TO '/tmp/race.csv' WITH (FORMAT csv);

INSERT INTO bulk_race_log VALUES ('start', clock_timestamp());
DO $$
BEGIN
  FOR i IN 1..50000 LOOP
    INSERT INTO bulk_race_loop VALUES (i, 'Customer ' || i, 'user' || i || '@mail.example');
  END LOOP;
END $$;
INSERT INTO bulk_race_log VALUES ('50000 single INSERTs', clock_timestamp());
COPY bulk_race_copy FROM '/tmp/race.csv' WITH (FORMAT csv);
INSERT INTO bulk_race_log VALUES ('one COPY', clock_timestamp());

SELECT step,
       round(extract(epoch FROM at - lag(at) OVER (ORDER BY at)) * 1000) AS ms
FROM bulk_race_log
ORDER BY at
OFFSET 1;`}
              caption="দুই Row এর উত্তর: 50000 single INSERTs আর one COPY, পাশে মিলিসেকেন্ড। সংখ্যা আপনার মেশিন আর ব্রাউজারে আলাদা হবে, আমাদের পরীক্ষায় Loop নিয়েছিল COPY এর প্রায় পাঁচ গুণ সময়। খেয়াল করুন, এখানে কোনো Network নেই আর পুরো Loop একটা Statement এর ভেতরে চলে। আসল App এ প্রতিটা INSERT আলাদা যাতায়াত, তখন পার্থক্য অনেক বড়: সেকশন 012 এ আসল Server এর সংখ্যা দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "একটা একটা INSERT", "অনেক Row এর এক INSERT", "COPY"],
          rows: [
            ["Statement কয়টা", "প্রতি Row এ একটা", "প্রতি ব্যাচে একটা", "পুরো File এ একটা"],
            ["Data কোথায় লেখা", "SQL এর ভেতরে", "SQL এর VALUES এর ভেতরে", "আলাদা File বা Stream এ"],
            ["Autocommit এ COMMIT", "প্রতি Row এ", "প্রতি ব্যাচে", "একবার"],
            ["কখন মানায়", "App এ একজন User এর একটা কাজ", "App থেকে কয়েকশো Row", "File, Migration, হাজার থেকে কোটি Row"],
            ["ভুল লাইনে কী হয়", "শুধু ওই Statement ব্যর্থ", "পুরো ব্যাচ ব্যর্থ", "পুরো COPY ব্যর্থ, ON_ERROR না দিলে"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "csv-file",
      subHeader: { index: "003", title: "What a CSV File Really Is" },
      title: <SectionTitle>CSV File আসলে কী নিয়মে লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CSV মানে Comma-Separated Values, কমা দিয়ে আলাদা করা মান। এটা একটা সাধারণ Text File, Notepad এ খুললেই পড়া যায়। প্রতিটা লাইন
                একটা Row, লাইনের ভেতরে কমা দিয়ে আলাদা করা প্রতিটা অংশ একটা Column এর মান, যাকে বলে Field। প্রায়ই প্রথম লাইনে থাকে Column এর
                নাম, যাকে বলে Header। Excel, Google Sheets, প্রায় সব Accounting Software আর সব Database এই File পড়তে আর লিখতে পারে, তাই
                দুই System এর মধ্যে Data দেওয়া নেওয়ার সবচেয়ে চলতি ভাষা এটাই।
              </ContentParagraph>
              <ContentParagraph>
                ঝামেলা শুরু হয় যখন মানের ভেতরেই কমা থাকে। একটা Review এর মন্তব্য, Lovely trip, the ship back was crowded, এর মাঝখানে একটা
                কমা। কোনো নিয়ম না থাকলে পড়ার সময় মনে হবে এটা দুটো আলাদা Field। তাই নিয়ম: যে মানের ভেতরে কমা, Double Quote বা নতুন লাইন আছে,
                পুরো মানটা Double Quote এর ভেতরে লেখা হয়। আর মানের ভেতরের Double Quote টা লেখা হয় পরপর দুইবার। এই নিয়মগুলো RFC 4180 নামের
                একটা দলিলে লেখা আছে, যদিও বাস্তবের অনেক File পুরোপুরি মানে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CsvAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজের চোখে দেখুন। নিচের বক্স reviews Table কে CSV File এ লেখে, তারপর <code className={CODE}>pg_read_file()</code> দিয়ে File
              এর ভেতরের লেখাটা হুবহু দেখায়। pg_read_file হলো Server এর Disk থেকে একটা File পড়ে লেখা হিসেবে ফেরত দেওয়ার Function, শুধু
              Superuser বা বিশেষ অনুমতি পাওয়া Role চালাতে পারে। বক্সে আপনি Superuser, তাই চলবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="reviews Table, CSV হয়ে"
              query={`COPY (SELECT review_id, rating, comment FROM reviews ORDER BY review_id)
  TO '/tmp/reviews.csv' WITH (FORMAT csv, HEADER);

SELECT pg_read_file('/tmp/reviews.csv') AS file_text;`}
              caption="COPY 10, তারপর File এর পুরো লেখা: প্রথম লাইনে review_id,rating,comment, তারপর দশটা লাইন। Review 2 আর 10 এর মন্তব্যে কমা আছে, তাই সেগুলো Double Quote এর ভেতরে। Review 4 আর 8 এর comment NULL, তাই লাইনের শেষে কমার পরে কিছুই নেই: 4,4, আর 8,5,।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব কঠিন ঘটনা একসাথে: সাধারণ মান, কমা ওয়ালা মান, Double Quote ওয়ালা মান, ফাঁকা লেখা, NULL, আর মানের ভেতরে নতুন লাইন।
              শেষেরটা বানাতে <code className={CODE}>{"E'Day 1\\nDay 2'"}</code> লিখেছি: E দিয়ে শুরু করা লেখায় <code className={CODE}>\n</code>{" "}
              মানে নতুন লাইন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CSV এর ছয়টা কঠিন ঘটনা"
              query={`DROP TABLE IF EXISTS bulk_csv_rules;
CREATE TABLE bulk_csv_rules (label text, value text);
INSERT INTO bulk_csv_rules VALUES
  ('plain',      'Sajek'),
  ('has comma',  'Cox''s Bazar, Chattogram'),
  ('has quote',  'The "Cloud" Valley'),
  ('empty text', ''),
  ('null',       NULL),
  ('line break', E'Day 1\\nDay 2');

COPY bulk_csv_rules TO '/tmp/rules.csv' WITH (FORMAT csv, HEADER);
SELECT pg_read_file('/tmp/rules.csv') AS file_text;`}
              caption={`পড়ুন লাইন ধরে ধরে। plain এর মান যেমন আছে। has comma এর মান Quote এর ভেতরে। has quote এর ভেতরের "Cloud" হয়ে গেছে ""Cloud"", পুরোটা আবার Quote এর ভেতরে। empty text লেখা হয়েছে "" দিয়ে, কিন্তু null এর পরে কিছুই নেই। line break এর মান দুই লাইনে ছড়িয়ে গেছে, কিন্তু Quote এর ভেতরে, তাই পড়ার সময় এটা একটাই Field।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ফাঁকা লেখা আর NULL: CSV এর সবচেয়ে বড় ফাঁদ",
          content: (
            <>
              <ContentParagraph>
                CSV এর নিজের কোনো NULL নেই, শুধু লেখা আছে। PostgreSQL তাই একটা চুক্তি মানে: Quote ছাড়া একদম ফাঁকা Field মানে NULL, আর{" "}
                <code className={CODE}>&quot;&quot;</code>, মানে Quote এর ভেতরে কিছু নেই, মানে ফাঁকা লেখা। Docs এর ভাষায়, NULL লেখা হয় Quote
                ছাড়া, আর NULL এর মতো দেখতে কোনো আসল মান লেখা হয় Quote সহ। পড়ার সময়ও একই নিয়ম।
              </ContentParagraph>
              <ContentParagraph>
                Excel বা অন্য System এই চুক্তি জানে না। ওরা প্রায়ই দুটোকেই ফাঁকা লেখে, কেউ NULL এর জায়গায় লেখে NA, NULL বা N/A। তাই অন্যের
                পাঠানো File পড়ার আগে জিজ্ঞেস করুন: “নেই” বোঝাতে আপনারা কী লেখেন? সেকশন 006 এ এর প্রতিটা উত্তরের জন্য Option দেখবেন।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "copy-to",
      subHeader: { index: "004", title: "COPY TO: Export" },
      title: <SectionTitle>COPY TO: Table বা Query থেকে File</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COPY TO এর দুই রূপ। প্রথমটা পুরো Table: <code className={CODE}>COPY tours TO &apos;/path/file.csv&apos;</code>। চাইলে Table
                এর নামের পরে বন্ধনীতে কয়েকটা Column: <code className={CODE}>COPY tours (tour_id, title) TO ...</code>। দ্বিতীয়টা যেকোনো
                Query, বন্ধনীর ভেতরে: <code className={CODE}>COPY (SELECT ...) TO ...</code>। দ্বিতীয়টাই বেশি কাজে লাগে, কারণ তখন JOIN,
                WHERE, ORDER BY, to_char দিয়ে সাজানো তারিখ, সব কিছু দিয়ে ঠিক যেমন রিপোর্ট চাই তেমন File বানানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                শেষে <code className={CODE}>WITH (...)</code> এর ভেতরে Option। সবচেয়ে জরুরি <code className={CODE}>FORMAT</code>। কিছু না
                বললে COPY লেখে text Format এ: Field গুলোর মাঝে Tab, আর NULL লেখা হয় <code className={CODE}>\N</code> দিয়ে। এটা PostgreSQL
                এর নিজের Format, psql আর pg_dump এটাই ব্যবহার করে। অন্য মানুষ বা অন্য System এর জন্য চাই <code className={CODE}>FORMAT csv</code>
                , সাথে <code className={CODE}>HEADER</code> যাতে প্রথম লাইনে Column এর নাম থাকে। তৃতীয় একটা Format আছে, binary, যেটা শুধু
                PostgreSQL থেকে PostgreSQL এ কাজে লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="text Format বনাম CSV Format"
              query={`COPY (SELECT customer_id, full_name, phone FROM customers
      WHERE customer_id <= 4 ORDER BY customer_id)
  TO '/tmp/customers.txt';
SELECT pg_read_file('/tmp/customers.txt') AS text_format;

COPY (SELECT customer_id, full_name, phone FROM customers
      WHERE customer_id <= 4 ORDER BY customer_id)
  TO '/tmp/customers.csv' WITH (FORMAT csv, HEADER);
SELECT pg_read_file('/tmp/customers.csv') AS csv_format;`}
              caption="প্রথম File এ Header নেই, Field গুলোর মাঝে Tab, আর Tanvir Ahmed এর phone NULL বলে সেখানে \N। দ্বিতীয় File এ প্রথম লাইনে customer_id,full_name,phone, Field গুলোর মাঝে কমা, আর Tanvir এর phone এর জায়গা ফাঁকা: 3,Tanvir Ahmed,।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা আসল রিপোর্ট। Island Tours এর হিসাবরক্ষক প্রতি দুই মাসে একবার Payment এর তালিকা চান, Customer এর নামসহ, তারিখ
                শুধু দিন পর্যন্ত। নিচের Query তিনটা Table জোড়া দেয়, তারিখকে <code className={CODE}>to_char</code> দিয়ে লেখা বানায়, আর{" "}
                <code className={CODE}>FORCE_QUOTE (customer)</code> Option customer Column এর প্রতিটা মানকে Quote এর ভেতরে রাখে, দরকার থাক
                বা না থাক। কিছু পুরনো Accounting Software নামের Column এ Quote আশা করে, তখন এটা কাজে লাগে।{" "}
                <code className={CODE}>FORCE_QUOTE *</code> দিলে সব Column এ Quote পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হিসাবরক্ষকের জন্য September আর October এর Payment"
              query={`COPY (
  SELECT p.payment_id,
         c.full_name AS customer,
         p.method,
         p.status,
         p.amount_bdt,
         to_char(p.paid_at, 'YYYY-MM-DD') AS paid_on
  FROM payments p
  JOIN bookings  b USING (booking_id)
  JOIN customers c USING (customer_id)
  WHERE p.paid_at >= TIMESTAMPTZ '2026-09-01 00:00:00+06'
  ORDER BY p.payment_id
) TO '/tmp/payments-sep-oct-2026.csv' WITH (FORMAT csv, HEADER, FORCE_QUOTE (customer));

SELECT pg_read_file('/tmp/payments-sep-oct-2026.csv') AS file_text;`}
              caption={`COPY 8। Header এর পরে আটটা Payment, 12 থেকে 19। প্রতিটা নাম Quote এর ভেতরে, যেমন "Nusrat Jahan", বাকি Column গুলো Quote ছাড়া। Payment 13 এর status failed, সেটাও আছে, কারণ হিসাবরক্ষক সব দেখতে চান।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সময় লিখলে Time Zone ও লেখা হয়",
          content: (
            <ContentParagraph>
              timestamptz Column সরাসরি COPY করলে মানটা লেখা হয় Session এর TimeZone ধরে, যেমন 2026-09-15 21:17:00+06। শেষের +06 দেখে অন্য
              System বুঝতে পারে এটা ঢাকার সময়। হিসাবরক্ষকের Excel এ এই লেখা অনেক সময় ঠিকমতো তারিখ হিসেবে চেনে না, তাই রিপোর্টে আমরা{" "}
              <code className={CODE}>to_char</code> দিয়ে শুধু দিনটা লিখেছি।{" "}
              <Link href="/sql/topic/date-time-types" className={LINK}>
                Module 09 এর তারিখ আর সময়ের লেসনে
              </Link>{" "}
              দেখেছেন কেন Database এ সময় সবসময় timestamptz রাখা হয়, File এ কীভাবে লিখবেন সেটা নির্ভর করে কে পড়বে তার উপর।
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
                  ফারুক সাহেব ভালো Review গুলো Website এ দেখাতে চান। reviews থেকে rating 4 বা তার বেশি Review গুলো{" "}
                  <code className={CODE}>/tmp/ex1_reviews.csv</code> File এ লিখুন: CSV Format, প্রথম লাইনে Header, Column ক্রমে
                  review_id, rating, comment, সাজানো review_id দিয়ে। Starter এর প্রথম লাইন আগের চেষ্টার File খালি করে, আর শেষের SELECT
                  File টা লাইন ধরে ধরে পড়ে। শেষের SELECT টা না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"COPY (SELECT ... WHERE rating >= 4 ORDER BY review_id) TO '/tmp/ex1_reviews.csv' WITH (FORMAT csv, HEADER);"}</code>{" "}
                  HEADER বাদ দিলে প্রথম লাইন মিলবে না, আর FORMAT csv বাদ দিলে কমার বদলে Tab বসবে।
                </>
              }
              starter={`COPY (SELECT 1 WHERE false) TO '/tmp/ex1_reviews.csv';

-- এখানে আপনার COPY লিখুন

SELECT n, line
FROM regexp_split_to_table(rtrim(pg_read_file('/tmp/ex1_reviews.csv'), E'\\n'), E'\\n')
     WITH ORDINALITY AS f(line, n)
ORDER BY n;`}
              solution={`SELECT * FROM (VALUES
  (1, 'review_id,rating,comment'),
  (2, '1,5,Crystal clear water and a very caring guide.'),
  (3, '2,4,"Lovely trip, the ship back was crowded."'),
  (4, '3,5,Worth every taka.'),
  (5, '4,4,'),
  (6, '5,5,Saw a crocodile on the second day!'),
  (7, '7,4,Sunrise above the clouds is unreal.'),
  (8, '8,5,'),
  (9, '10,4,"Tea gardens were beautiful, food was average."')
) AS v(n, line);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "copy-from",
      subHeader: { index: "005", title: "COPY FROM: Load" },
      title: <SectionTitle>COPY FROM: File থেকে Table এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COPY FROM ঠিক উল্টো কাজ: <code className={CODE}>COPY table (column, ...) FROM &apos;/path/file.csv&apos; WITH (...)</code>
                । তিনটা নিয়ম আগে মাথায় রাখুন। এক, Table টা আগে থেকে থাকতে হবে, COPY নিজে Table বানায় না। দুই, Query দিয়ে COPY FROM হয় না,
                শুধু Table বা তার কয়েকটা Column এ। তিন, File এর Field আর Column এর মিল হয় ক্রম ধরে, নাম ধরে না। File এর প্রথম Field যায়
                Column তালিকার প্রথম Column এ, দ্বিতীয়টা দ্বিতীয়তে। HEADER Option প্রথম লাইনটা শুধু বাদ দেয়, নাম মিলিয়ে দেখে না।
              </ContentParagraph>
              <ContentParagraph>
                Column তালিকা না দিলে COPY ধরে নেয় File এ Table এর সব Column আছে, Table এর নিজের ক্রমে। তালিকা দিলে বাকি Column গুলো পায়
                তাদের DEFAULT, ঠিক INSERT এর মতো। Identity Column এর বেলায় এটাই চাই: File এ id না রেখে Column তালিকা থেকে id বাদ দিন,
                PostgreSQL নিজে নম্বর দেবে। পর্যটন বোর্ড তিনটা নতুন জায়গার একটা File পাঠিয়েছে, দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন তিনটা Destination, File থেকে"
              query={`DROP TABLE IF EXISTS bulk_destinations;
CREATE TABLE bulk_destinations (
  destination_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL UNIQUE,
  region         text NOT NULL,
  kind           text NOT NULL
);

-- পর্যটন বোর্ডের File, প্রতিটা VALUES একটা লাইন
COPY (VALUES
  ('name,region,kind'),
  ('Ratargul,Sylhet,swamp'),
  ('Lalakhal,Sylhet,river'),
  ('Nijhum Dwip,Chattogram,island')
) TO '/tmp/new-destinations.csv';

COPY bulk_destinations (name, region, kind)
  FROM '/tmp/new-destinations.csv' WITH (FORMAT csv, HEADER);

SELECT * FROM bulk_destinations ORDER BY destination_id;`}
              caption="প্রথম COPY 4: File এ চারটা লাইন লেখা হলো, Header সহ। দ্বিতীয় COPY 3: Header বাদে তিনটা Row ঢুকল। destination_id দিয়েছে PostgreSQL নিজে, 1, 2, 3, কারণ Column তালিকায় id নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              File এ Field কম বা বেশি হলে COPY সাথে সাথে থামে। নিচের File এ প্রতি লাইনে দুটো Field: নাম আর শহর। Table এ তিনটা Column,
              তৃতীয়টা country, যার DEFAULT Bangladesh। প্রথম COPY তে Column তালিকা দেওয়া আছে, তাই country পায় DEFAULT। দ্বিতীয় COPY তে
              তালিকা নেই, তাই PostgreSQL প্রতি লাইনে তিনটা Field খোঁজে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Field কম পড়লে"
              query={`DROP TABLE IF EXISTS bulk_signups;
CREATE TABLE bulk_signups (
  full_name text NOT NULL,
  city      text NOT NULL,
  country   text NOT NULL DEFAULT 'Bangladesh'
);
COPY (VALUES ('Rina Akter,Dhaka'), ('Kabir Hossain,Khulna')) TO '/tmp/signups.csv';

COPY bulk_signups (full_name, city) FROM '/tmp/signups.csv' WITH (FORMAT csv);
SELECT * FROM bulk_signups;

COPY bulk_signups FROM '/tmp/signups.csv' WITH (FORMAT csv);`}
              caption={`File লেখার COPY 2 এর পরে পড়ার COPY 2, আর দুজনেরই country Bangladesh। দ্বিতীয় COPY তে Error 22P04: missing data for column "country"। উল্টোটা, File এ বেশি Field থাকলে, একই Code এর আরেকটা বার্তা দেয়: extra data after last expected column।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "COPY একবার চালালে একবার, দুইবার চালালে দুইবার",
          content: (
            <ContentParagraph>
              COPY FROM কখনো দেখে না File টা আগে Load হয়েছে কিনা। একই File দুইবার চালালে প্রতিটা Row দুইবার ঢোকে, যদি না কোনো UNIQUE বা
              PRIMARY KEY আটকায়। উপরের বক্সটা দ্বিতীয়বার Run করলে DROP TABLE দিয়ে শুরু হয় বলে সমস্যা নেই, কিন্তু আসল Table এ এটা একটা
              চেনা দুর্ঘটনা: রাতের Job একবার আটকে গেল, কেউ হাতে আবার চালালেন, সকালে সব Booking দুইবার। সেকশন 009 এর Staging Table আর
              আগের লেসনের{" "}
              <Link href="/sql/topic/upsert" className={LINK}>
                ON CONFLICT
              </Link>{" "}
              এই বিপদ থেকে বাঁচায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "csv-options",
      subHeader: { index: "006", title: "CSV Options" },
      title: <SectionTitle>HEADER, DELIMITER, NULL আর তাদের বন্ধুরা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অন্যের পাঠানো File খুব কমই একদম PostgreSQL এর পছন্দমতো হয়। ইউরোপের অনেক দেশে কমা দশমিকের চিহ্ন, তাই সেখানকার Excel অনেক সময়
                CSV লেখে সেমিকোলন দিয়ে। কেউ “নেই” বোঝাতে লেখে NA, কেউ ফাঁকা রাখে। কারো File এ Header আছে, কারো নেই। COPY এর Option গুলো দিয়ে আপনি
                PostgreSQL কে বলে দেন File টা কোন উপভাষায় লেখা। সবচেয়ে বেশি লাগে এগুলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Option", "কী করে", "কিছু না বললে"],
          rows: [
            ["FORMAT csv", "CSV এর নিয়মে পড়া বা লেখা", "text: Tab দিয়ে আলাদা, NULL মানে \\N"],
            ["HEADER", "লেখার সময় প্রথম লাইনে নাম, পড়ার সময় প্রথম লাইন বাদ", "Header নেই ধরে নেয়"],
            ["HEADER MATCH", "পড়ার সময় প্রথম লাইনের নাম আর ক্রম Column এর সাথে মেলায়, না মিললে Error", "মেলায় না"],
            ["DELIMITER ';'", "Field আলাদা করার চিহ্ন, একটাই অক্ষর", "csv এ কমা, text এ Tab"],
            ["NULL 'NA'", "কোন লেখাটা NULL মানে", "csv এ Quote ছাড়া ফাঁকা, text এ \\N"],
            ["QUOTE আর ESCAPE", "মান ঘেরার চিহ্ন, আর ভেতরের Quote লেখার চিহ্ন", "দুটোই Double Quote"],
            ["FORCE_QUOTE (col)", "লেখার সময় ওই Column এর প্রতিটা মানে Quote", "দরকার হলেই শুধু Quote"],
            ["FORCE_NULL (col)", "পড়ার সময় Quote সহ ফাঁকাকেও NULL ধরা", "\"\" মানে ফাঁকা লেখা"],
            ["FORCE_NOT_NULL (col)", "পড়ার সময় ওই Column এ কখনো NULL না, ফাঁকা লেখা", "Quote ছাড়া ফাঁকা মানে NULL"],
            ["DEFAULT 'DEFAULT'", "এই লেখাটা পেলে Column এর DEFAULT বসাও", "বন্ধ"],
            ["ENCODING 'LATIN1'", "File টা কোন Encoding এ লেখা", "Client এর Encoding"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              NULL এর নিয়মগুলো একসাথে দেখলে সবচেয়ে ভালো বোঝা যায়। নিচের File টা একটা জার্মান Partner এর ধাঁচে লেখা: সেমিকোলন দিয়ে আলাদা,
              আর তিনজনের phone তিন রকম। Rina র phone Quote সহ ফাঁকা, Jamal এর একদম ফাঁকা, Sumi র জায়গায় NA। একই File চারটা Table এ চার রকম
              Option দিয়ে পড়ছি। শেষের SELECT এ <code className={CODE}>quote_literal()</code> প্রতিটা মানকে একক Quote এর ভেতরে দেখায়, যাতে
              ফাঁকা লেখা <code className={CODE}>&apos;&apos;</code> আর NULL আলাদা করে চেনা যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই File, চার রকম NULL নিয়ম"
              query={`COPY (VALUES
  ('name;phone;city'),
  ('Rina Akter;"";Dhaka'),
  ('Jamal Uddin;;Khulna'),
  ('Sumi Das;NA;Sylhet')
) TO '/tmp/leads-eu.csv';

DROP TABLE IF EXISTS bulk_null_a, bulk_null_b, bulk_null_c, bulk_null_d;
CREATE TABLE bulk_null_a (name text, phone text, city text);
CREATE TABLE bulk_null_b (LIKE bulk_null_a);
CREATE TABLE bulk_null_c (LIKE bulk_null_a);
CREATE TABLE bulk_null_d (LIKE bulk_null_a);

COPY bulk_null_a FROM '/tmp/leads-eu.csv' WITH (FORMAT csv, HEADER, DELIMITER ';');
COPY bulk_null_b FROM '/tmp/leads-eu.csv' WITH (FORMAT csv, HEADER, DELIMITER ';', NULL 'NA');
COPY bulk_null_c FROM '/tmp/leads-eu.csv' WITH (FORMAT csv, HEADER, DELIMITER ';', FORCE_NULL (phone));
COPY bulk_null_d FROM '/tmp/leads-eu.csv' WITH (FORMAT csv, HEADER, DELIMITER ';', FORCE_NOT_NULL (phone));

SELECT a.name,
       coalesce(quote_literal(a.phone), 'NULL') AS plain,
       coalesce(quote_literal(b.phone), 'NULL') AS null_na,
       coalesce(quote_literal(c.phone), 'NULL') AS force_null,
       coalesce(quote_literal(d.phone), 'NULL') AS force_not_null
FROM bulk_null_a a
JOIN bulk_null_b b USING (name)
JOIN bulk_null_c c USING (name)
JOIN bulk_null_d d USING (name)
ORDER BY a.name;`}
              caption="Jamal এর একদম ফাঁকা ঘর: plain এ NULL, NULL 'NA' দিলে '' কারণ তখন NULL মানে শুধু NA, FORCE_NULL এ NULL, FORCE_NOT_NULL এ ''। Rina র Quote সহ ফাঁকা: শুধু FORCE_NULL এ NULL, বাকি তিনটায় ''। Sumi র NA: শুধু NULL 'NA' তে NULL, বাকিগুলোতে 'NA' নামের একটা আসল লেখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ একই কাজ নিজের হাতে করুন। পাঁচ লাইনের একটা ছোট File, তিনটা সুইচ: NULL এর লেখা, phone Column এ FORCE_NULL, আর
              ON_ERROR। প্রতিটা লাইন কীভাবে Field এ ভাঙে, আর কোন Row কী হয়ে Table এ পৌঁছায়, দেখুন। প্রতিটা ফলাফল আসল PostgreSQL 18 এ চালিয়ে
              নেওয়া। ON_ERROR এর গল্প সেকশন 008 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CsvParserLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আরও দুটো Option প্রায়ই কাজে লাগে। <code className={CODE}>HEADER MATCH</code> (PostgreSQL 15 থেকে) প্রথম লাইনটা বাদ দেওয়ার
                আগে যাচাই করে যে নামগুলো Table এর Column এর নামের সাথে হুবহু, একই ক্রমে মেলে। Partner যদি একদিন চুপচাপ দুটো Column এর জায়গা
                বদলে দেয়, সাধারণ HEADER সেটা ধরবে না, ভুল মান ভুল Column এ ঢুকবে। MATCH সাথে সাথে থামাবে।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>DEFAULT</code> Option (PostgreSQL 16 থেকে) একটা লেখা ঠিক করে দেয়, যেটা File এ পেলে PostgreSQL ওই
                Column এর DEFAULT বসায়। মনে রাখবেন, ফাঁকা Field কখনো DEFAULT পায় না, পায় NULL। তাই NOT NULL DEFAULT ওয়ালা Column এ ফাঁকা
                ঘর থাকলে Error আসে, যদিও মনে হয় DEFAULT বসা উচিত ছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFAULT চিহ্ন আর HEADER MATCH"
              query={`DROP TABLE IF EXISTS bulk_guides_in;
CREATE TABLE bulk_guides_in (
  full_name text NOT NULL,
  language  text NOT NULL DEFAULT 'Bangla',
  phone     text
);

COPY (VALUES
  ('full_name,language,phone'),
  ('Mahin Alam,DEFAULT,+8801000000301'),
  ('Tania Sultana,English,+8801000000302')
) TO '/tmp/guides-in.csv';
COPY bulk_guides_in FROM '/tmp/guides-in.csv' WITH (FORMAT csv, HEADER MATCH, DEFAULT 'DEFAULT');
SELECT * FROM bulk_guides_in;

-- এই File এর Header এ full_name এর বদলে name
COPY (VALUES ('name,language,phone'), ('Rafi Hasan,Bangla,+8801000000303')) TO '/tmp/guides-wrong.csv';
COPY bulk_guides_in FROM '/tmp/guides-wrong.csv' WITH (FORMAT csv, HEADER MATCH);`}
              caption={`File লেখার COPY 3 এর পরে Header মিলেছে, তাই COPY 2, আর Mahin Alam এর language হয়েছে DEFAULT এর Bangla। দ্বিতীয় File এ Error 22P04: column name mismatch in header line field 1: got "name", expected "full_name"। সাধারণ HEADER দিলে এই File চুপচাপ ঢুকে যেত।`}
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
                  কলকাতার Bay Trails Agency র File এ Field গুলো সেমিকোলন দিয়ে আলাদা, প্রথম লাইনে Header, আর phone না থাকলে লেখা NA। একটা
                  শহরের নামের ভেতরেই সেমিকোলন আছে, তাই সেটা Double Quote এর ভেতরে। Starter File টা{" "}
                  <code className={CODE}>/tmp/ex2-kolkata-leads.csv</code> এ লেখে আর <code className={CODE}>ex2_leads</code> Table বানায়।
                  একটা COPY দিয়ে File টা Table এ পড়ুন, যাতে NA গুলো NULL হয়। শেষের SELECT না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  তিনটা Option: <code className={CODE}>HEADER</code>, <code className={CODE}>{"DELIMITER ';'"}</code> আর{" "}
                  <code className={CODE}>{"NULL 'NA'"}</code>, সাথে <code className={CODE}>FORMAT csv</code>। DELIMITER না দিলে পুরো লাইন
                  একটাই Field মনে হবে আর Error আসবে।
                </>
              }
              starter={`COPY (VALUES
  ('full_name;phone;city'),
  ('Ananya Roy;+919800000401;"Salt Lake; Kolkata"'),
  ('Sourav Ghosh;NA;Howrah'),
  ('Megha Sen;+919800000403;Kolkata'),
  ('Arjun Das;NA;Siliguri')
) TO '/tmp/ex2-kolkata-leads.csv';
DROP TABLE IF EXISTS ex2_leads;
CREATE TABLE ex2_leads (full_name text, phone text, city text);

-- এখানে আপনার COPY লিখুন

SELECT full_name, coalesce(phone, '(missing)') AS phone, city
FROM ex2_leads
ORDER BY full_name;`}
              solution={`SELECT * FROM (VALUES
  ('Ananya Roy',   '+919800000401', 'Salt Lake; Kolkata'),
  ('Arjun Das',    '(missing)',     'Siliguri'),
  ('Megha Sen',    '+919800000403', 'Kolkata'),
  ('Sourav Ghosh', '(missing)',     'Howrah')
) AS v(full_name, phone, city);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "server-vs-client",
      subHeader: { index: "007", title: "Server File vs Your File" },
      title: <SectionTitle>COPY আর \copy: File টা কার মেশিনে?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের সবচেয়ে জরুরি সেকশন এটা। <code className={CODE}>COPY ... FROM &apos;/path/file.csv&apos;</code> লিখলে File টা
                পড়ে <strong>Database Server</strong>, নিজের মেশিনের Disk থেকে, নিজের অপারেটিং সিস্টেমের User হিসেবে। Docs এর ভাষায়, COPY তে
                দেওয়া File সরাসরি Server পড়ে বা লেখে, Client App না। আপনার Laptop এর Downloads ফোল্ডারের কথা Server জানেই না।
              </ContentParagraph>
              <ContentParagraph>
                Module 02 এ যদি PostgreSQL কে Docker এ চালিয়ে থাকেন, Server আসলে একটা আলাদা ছোট মেশিন, island-pg Container, যার নিজের
                Disk। আর Production এ Server থাকে অন্য শহরের একটা Data Center এ। দুই ক্ষেত্রেই আপনার File আর Server এর Disk আলাদা জায়গা।
              </ContentParagraph>
              <ContentParagraph>
                এর সমাধান psql এর <code className={CODE}>\copy</code>। দেখতে প্রায় একই, কিন্তু এটা SQL না, psql এর নিজের একটা Command, যাকে
                বলে Meta-command, যেমন <code className={CODE}>\dt</code>। psql নিজে আপনার মেশিন থেকে File পড়ে, আর Connection এর ভেতর দিয়ে
                Server কে পাঠায়। Server এর দিকে তখন চলে <code className={CODE}>COPY ... FROM STDIN</code>, মানে Data আসছে Client এর পাঠানো
                Stream থেকে, কোনো File থেকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FileLocationSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে আসল ঘটনা। তানিমের Laptop এ, <code className={CODE}>/home/tanim/imports</code> ফোল্ডারে Agency র File, আর PostgreSQL 18
              চলছে আলাদা একটা Container এ। তানিম প্রথমে সাধারণ COPY দিলেন, তারপর \copy। নিচের Output আমাদের দুই Container এর আসল Session
              থেকে নেওয়া, শুধু Prompt এর আগের অংশ বাদ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql, Tanim's laptop",
          code: `island_tours=# CREATE TABLE bulk_agent_staging (agent_ref text, customer_email text, tour_title text, starts_on text, seats text, amount_bdt text);
CREATE TABLE
island_tours=# COPY bulk_agent_staging FROM '/home/tanim/imports/agent-2026-11-01.csv' WITH (FORMAT csv, HEADER);
ERROR:  could not open file "/home/tanim/imports/agent-2026-11-01.csv" for reading: No such file or directory
HINT:  COPY FROM instructs the PostgreSQL server process to read a file. You may want a client-side facility such as psql's \\copy.
island_tours=# \\copy bulk_agent_staging FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER)
COPY 8
island_tours=# SELECT count(*) FROM bulk_agent_staging;
 count
-------
     8
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HINT টা পড়ুন: PostgreSQL নিজেই বলছে COPY FROM মানে Server এর Process File পড়বে, আপনি হয়তো \copy চাইছেন। \copy তে File এর নাম
                শুধু <code className={CODE}>agent-2026-11-01.csv</code>, কারণ psql যে ফোল্ডারে চালু হয়েছে, Relative Path সেখান থেকে খোঁজা হয়।
                \copy এর তিনটা নিয়ম মনে রাখুন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  পুরো Command এক লাইনে। psql এর Docs বলে, \copy এর পরে লাইনের বাকি সবটাই তার Argument, তাই একে কয়েক লাইনে ভাঙা যায় না।
                  লম্বা Query হলে আগে একটা View বা Temp Table বানিয়ে নিন, অথবা নিচের STDOUT কৌশল দেখুন।
                </ListItem>
                <ListItem>
                  শেষে সেমিকোলন লাগে না। আমাদের Container এ শেষে <code className={CODE}>;</code> দিয়েও চালিয়ে দেখেছি, psql মেনে নিয়েছে, কিন্তু
                  না দেওয়াটাই চলতি অভ্যাস।
                </ListItem>
                <ListItem>
                  File এর অনুমতি আপনার নিজের User এর। Superuser লাগে না, Server এর কোনো বিশেষ Role ও লাগে না, শুধু Table এ INSERT বা SELECT
                  এর অনুমতি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Server এর নিজের File এর বেলায় আরেকটা দেয়াল আছে: অনুমতি। Docs অনুযায়ী File এর নাম দেওয়া COPY শুধু Superuser, অথবা{" "}
              <code className={CODE}>pg_read_server_files</code>, <code className={CODE}>pg_write_server_files</code> বা{" "}
              <code className={CODE}>pg_execute_server_program</code> Role পাওয়া User চালাতে পারেন, কারণ এটা দিয়ে Server এর পড়তে পারা যেকোনো
              File পড়া যায়। আমাদের Container এ tanim নামের একটা সাধারণ Role বানিয়ে চেষ্টা করেছি, File টা এবার Server এর{" "}
              <code className={CODE}>/srv/imports</code> এ:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql as tanim, a role without superuser",
          code: `island_tours=> COPY bulk_agent_staging FROM '/srv/imports/agent-2026-11-01.csv' WITH (FORMAT csv, HEADER);
ERROR:  permission denied to COPY from a file
DETAIL:  Only roles with privileges of the "pg_read_server_files" role may COPY from a file.
HINT:  Anyone can COPY to stdout or from stdin. psql's \\copy command also works for anyone.
island_tours=> COPY (SELECT * FROM tours) TO '/srv/imports/tours.csv' WITH (FORMAT csv, HEADER);
ERROR:  permission denied to COPY to a file
DETAIL:  Only roles with privileges of the "pg_write_server_files" role may COPY to a file.
HINT:  Anyone can COPY to stdout or from stdin. psql's \\copy command also works for anyone.

-- postgres হিসেবে: GRANT pg_read_server_files TO tanim; তারপর আবার tanim হিসেবে
island_tours=> COPY bulk_agent_staging FROM '/srv/imports/agent-2026-11-01.csv' WITH (FORMAT csv, HEADER);
COPY 8`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Role পেলেও আরেকটা স্তর বাকি: অপারেটিং সিস্টেম। Server চলে postgres নামের OS User হিসেবে, আর সেই User যে File পড়তে পারে না,
              Superuser হয়েও সেটা পড়া যায় না। আমাদের Container এ <code className={CODE}>/root</code> এর একটা File এ COPY চালালে উত্তর এসেছে{" "}
              <code className={CODE}>could not open file &quot;/root/agent.csv&quot; for reading: Permission denied</code>। আর COPY TO তে
              Relative Path চলেই না: <code className={CODE}>relative path not allowed for COPY to file</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                \copy ছাড়াও Client থেকে Data পাঠানোর দুটো পথ আছে, দুটোই Script এ খুব কাজে লাগে। এক, Shell এর Redirect: psql কে{" "}
                <code className={CODE}>COPY ... FROM STDIN</code> চালাতে বলুন আর File টা <code className={CODE}>&lt;</code> দিয়ে তার Input
                এ দিন। দুই, Export এর জন্য <code className={CODE}>COPY ... TO STDOUT</code> লিখে শেষে <code className={CODE}>\g file.csv</code>
                । psql এর Docs বলে \g এর এই রূপ কয়েক লাইনে লেখা যায়, যা \copy পারে না। দুটোই আমাদের Client Container এ চালানো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal, Tanim's laptop",
          code: STDIN_SESSION,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর এই পাতার বক্স? বক্সের PostgreSQL আর বক্সের “Disk” দুটোই আপনার ব্রাউজারের ভেতরে, Server আর File একই জায়গায়, আর আপনি সেখানে
              Superuser। তাই সাধারণ COPY দিয়ে <code className={CODE}>/tmp</code> এ লেখা পড়া চলে। কিন্তু বক্সে psql নেই, তাই \copy চলে না।
              নিজেই দেখুন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সে কে আমি, আর \copy কেন চলে না"
              query={`SELECT current_user,
       (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) AS is_superuser;

COPY (SELECT tour_id, title FROM tours ORDER BY tour_id) TO '/tmp/tours.csv' WITH (FORMAT csv, HEADER);
SELECT (pg_stat_file('/tmp/tours.csv')).size AS bytes_on_box_disk;

\\copy tours TO 'tours.csv' WITH (FORMAT csv, HEADER)`}
              caption={`current_user postgres, is_superuser t। COPY 9, আর File টার আকার 255 bytes। শেষের লাইনে Error 42601: syntax error at or near "\\"। বক্স শুধু SQL বোঝে, আর \\copy SQL না, psql এর Command।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "COPY ... 'file'", "\\copy ... 'file'"],
          rows: [
            ["কে চালায়", "Server, SQL Command হিসেবে", "psql, Meta-command হিসেবে"],
            ["File কার মেশিনে", "Database Server এর", "যে মেশিনে psql চলছে"],
            ["কার অনুমতি লাগে", "Superuser বা pg_read_server_files, pg_write_server_files, আর OS User postgres এর", "আপনার নিজের OS User এর, আর Table এর সাধারণ অনুমতি"],
            ["Relative Path", "FROM এ Server এর Data Directory থেকে, TO তে নিষেধ", "psql যে ফোল্ডারে চালু হয়েছে সেখান থেকে"],
            ["কয়েক লাইনে লেখা", "যায়", "যায় না, পুরোটা এক লাইনে"],
            ["গতি", "সবচেয়ে দ্রুত, Data Network এ যায় না", "সব Data Connection দিয়ে যায়, বড় File এ একটু ধীর"],
            ["App থেকে", "শুধু Server এ File থাকলে", "Driver এর COPY FROM STDIN দিয়ে একই কাজ, Module 17 এ"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "bad-rows",
      subHeader: { index: "008", title: "When a Row Is Bad" },
      title: <SectionTitle>একটা খারাপ লাইন পেলে কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COPY একটা Statement, আর PostgreSQL এ একটা Statement হয় পুরো সফল, নয় পুরো ব্যর্থ। File এর দুই হাজার লাইনের মধ্যে একটা লাইনের
                seats এ যদি লেখা থাকে two, COPY সেখানেই থামে, আর আগের সব লাইনও বাতিল হয়। Table এ একটা Row ও ঢোকে না। আধা ভরা Table এর চেয়ে
                এটা অনেক ভালো, কারণ তখন অন্তত জানেন অবস্থাটা ঠিক কী।
              </ContentParagraph>
              <ContentParagraph>
                একটা খরচ আছে, Docs এ লেখা: COPY FROM চলার সময়ই Row গুলো Table এর File এ লিখতে থাকে। ব্যর্থ হলে সেগুলো Deleted অবস্থায় পড়ে
                থাকে, চোখে দেখা যায় না কিন্তু Disk এর জায়গা নেয়, VACUUM না চলা পর্যন্ত। দশ লাখ লাইনের File এর শেষের দিকে Error হলে সেটা
                অনেক জায়গা।{" "}
                <Link href="/sql/topic/drop-truncate-delete" className={LINK}>
                  Module 09 এর শেষ লেসনে
                </Link>{" "}
                DELETE এর মৃত Row এর একই গল্প দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                Agency র File এ ঠিক এমন একটা লাইন আছে। নিচের বক্সে আসল Type ওয়ালা একটা Table এ File টা সরাসরি পড়ছি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা two, পুরো File বাতিল"
              query={`${AGENT_TYPED}
${AGENT_FILE}
COPY bulk_agent_typed FROM '/tmp/agent-2026-11-01.csv' WITH (FORMAT csv, HEADER);`}
              caption={`File লেখা হলো, COPY 9। তারপর Error 22P02: invalid input syntax for type smallint: "two"। এই বক্স কোন লাইনে ভুল সেটা দেখায় না, psql দেখায়, নিচে দেখুন। এখন SELECT count(*) FROM bulk_agent_typed চালালে পাবেন 0।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এ একই Error এর সাথে একটা CONTEXT লাইন আসে, যেখানে লেখা কোন Table, File এর কোন লাইন, কোন Column আর কী মান। লাইন গোনা হয়
              File এর শুরু থেকে, Header সহ। তাই HT-1003 এর লাইন 4, যদিও এটা তৃতীয় Booking। Agency কে ভুল জানানোর সময় এই নম্বরটাই দিন, ওরা
              নিজেদের File খুলে সরাসরি সেখানে যেতে পারবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql, Tanim's laptop",
          code: `island_tours=# \\copy bulk_agent_typed FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER)
ERROR:  invalid input syntax for type smallint: "two"
CONTEXT:  COPY bulk_agent_typed, line 4, column seats: "two"
island_tours=# SELECT count(*) FROM bulk_agent_typed;
 count
-------
     0
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL 17 এ এসেছে <code className={CODE}>ON_ERROR</code> Option। <code className={CODE}>ON_ERROR ignore</code> দিলে
                যে লাইনের কোনো মান তার Column এর Type এ রূপান্তর করা যায় না, COPY সেই লাইনটা ফেলে দিয়ে পরের লাইনে যায়। শেষে একটা NOTICE এ
                জানায় কয়টা লাইন বাদ গেল। একই Version এ এসেছে <code className={CODE}>LOG_VERBOSITY verbose</code>, যেটা প্রতিটা বাদ পড়া
                লাইনের নম্বর আর Column আলাদা NOTICE এ জানায়। আর PostgreSQL 18 এনেছে দুটো জিনিস: <code className={CODE}>REJECT_LIMIT n</code>
                , যার মানে n টার বেশি লাইন খারাপ হলে পুরো COPY ব্যর্থ, আর <code className={CODE}>LOG_VERBOSITY silent</code>, যেটা NOTICE ও
                বন্ধ রাখে।
              </ContentParagraph>
              <ContentParagraph>
                দুটো সীমা ভালো করে মনে রাখুন। এক, ON_ERROR শুধু Type এ রূপান্তরের ভুল ধরে: two কে smallint বানানো, 2026-11-31 কে date বানানো।
                CHECK, NOT NULL, UNIQUE বা Foreign Key ভাঙলে COPY আগের মতোই পুরোটা থামায়। দুই, বাদ পড়া লাইনগুলো কোথাও জমা থাকে না। কোনগুলো
                গেল জানতে হলে verbose এর NOTICE পড়তে হবে, আর সেটা Script এ ধরা কঠিন। তাই আসল কাজে বেশিরভাগ দল ON_ERROR এর বদলে সেকশন 009 এর
                Staging Table পছন্দ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql, Tanim's laptop",
          code: `island_tours=# \\copy bulk_agent_typed FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore)
NOTICE:  1 row was skipped due to data type incompatibility
COPY 7
island_tours=# TRUNCATE bulk_agent_typed;
TRUNCATE TABLE
island_tours=# \\copy bulk_agent_typed FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore, LOG_VERBOSITY verbose)
NOTICE:  skipping row due to data type incompatibility at line 4 for column "seats": "two"
NOTICE:  1 row was skipped due to data type incompatibility
COPY 7`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বক্সে NOTICE দেখা যায় না, কিন্তু কয়টা Row ঢুকল সেটা দেখা যায়। নিচের File এ পাঁচটা Booking, তার দুটো খারাপ: একটার seats এ two,
              আরেকটার তারিখ 31 নভেম্বর, যে দিন ক্যালেন্ডারে নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON_ERROR ignore আর REJECT_LIMIT"
              query={`DROP TABLE IF EXISTS bulk_night;
CREATE TABLE bulk_night (agent_ref text PRIMARY KEY, seats smallint NOT NULL, starts_on date NOT NULL);
COPY (VALUES
  ('agent_ref,seats,starts_on'),
  ('HT-2001,2,2026-11-20'),
  ('HT-2002,two,2026-11-27'),
  ('HT-2003,3,2026-12-04'),
  ('HT-2004,2,2026-11-31'),
  ('HT-2005,1,2026-12-18')
) TO '/tmp/night.csv';

COPY bulk_night FROM '/tmp/night.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore);
SELECT * FROM bulk_night ORDER BY agent_ref;

TRUNCATE bulk_night;
COPY bulk_night FROM '/tmp/night.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore, REJECT_LIMIT 1);`}
              caption="প্রথম COPY 3: HT-2001, HT-2003 আর HT-2005 ঢুকল, খারাপ দুটো চুপচাপ বাদ। TRUNCATE এর পরে REJECT_LIMIT 1 দিয়ে আবার: দুটো খারাপ লাইন সীমার বেশি, তাই Error 22P02: skipped more than REJECT_LIMIT (1) rows due to data type incompatibility, আর Table খালিই থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CHECK ভাঙলে ON_ERROR কিছু করে না"
              query={`DROP TABLE IF EXISTS bulk_seats_rule;
CREATE TABLE bulk_seats_rule (
  agent_ref text PRIMARY KEY,
  seats     smallint NOT NULL CHECK (seats > 0)
);
COPY (VALUES ('agent_ref,seats'), ('HT-3001,2'), ('HT-3002,0'), ('HT-3003,4')) TO '/tmp/seats.csv';

COPY bulk_seats_rule FROM '/tmp/seats.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore);`}
              caption={`0 একটা ঠিকঠাক smallint, তাই Type এর দিক থেকে কোনো ভুল নেই। ভুলটা নিয়মের: Error 23514: new row for relation "bulk_seats_rule" violates check constraint "bulk_seats_rule_seats_check"। ON_ERROR ignore থাকা সত্ত্বেও পুরো COPY ব্যর্থ, একটা Row ও ঢোকেনি।`}
            />
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
                  Starter <code className={CODE}>/tmp/ex3-night.csv</code> File এ ছয়টা Booking লেখে, তার কয়েকটার seats বা তারিখ ভুল, আর{" "}
                  <code className={CODE}>ex3_import</code> Table বানায় আসল Type দিয়ে। একটা COPY লিখুন যেটা ভালো লাইনগুলো ঢোকায় আর Type এর
                  ভুল থাকা লাইনগুলো বাদ দেয়, পুরো COPY ব্যর্থ না করে। শেষের SELECT না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FORMAT csv, HEADER, ON_ERROR ignore</code>। ON_ERROR ছাড়া চালিয়ে আগে দেখুন কোন Error আসে, তারপর
                  যোগ করুন।
                </>
              }
              starter={`COPY (VALUES
  ('agent_ref,seats,starts_on'),
  ('HT-4001,2,2026-11-20'),
  ('HT-4002,3,2026-11-27'),
  ('HT-4003,1.5,2026-12-04'),
  ('HT-4004,4,2026-12-11'),
  ('HT-4005,2,2026-02-30'),
  ('HT-4006,1,2026-12-18')
) TO '/tmp/ex3-night.csv';
DROP TABLE IF EXISTS ex3_import;
CREATE TABLE ex3_import (agent_ref text, seats smallint, starts_on date);

-- এখানে আপনার COPY লিখুন

SELECT agent_ref, seats, starts_on FROM ex3_import ORDER BY agent_ref;`}
              solution={`SELECT * FROM (VALUES
  ('HT-4001', 2, DATE '2026-11-20'),
  ('HT-4002', 3, DATE '2026-11-27'),
  ('HT-4004', 4, DATE '2026-12-11'),
  ('HT-4006', 1, DATE '2026-12-18')
) AS v(agent_ref, seats, starts_on);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "staging-table",
      subHeader: { index: "009", title: "The Staging Table Pattern" },
      title: <SectionTitle>Staging Table: আগে সব নিন, তারপর বাছুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বড় হোটেলের রান্নাঘরের কথা ভাবুন। বাজার থেকে সবজি এলে সেটা সরাসরি রান্নার হাঁড়িতে যায় না। আগে যায় একটা আলাদা টেবিলে,
                যেখানে ধোয়া হয়, পচা অংশ বাদ যায়, ওজন মেলানো হয়। পচা সবজি একটা আলাদা ঝুড়িতে যায়, সরবরাহকারীকে দেখানোর জন্য। তারপর ভালোগুলো
                রান্নায়। Database এ সেই আলাদা টেবিলের নাম <strong>Staging Table</strong>।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা সহজ। Staging Table এর সব Column হয় text, কোনো Constraint নেই। তাই File এ যা ই থাকুক, two হোক বা ফাঁকা হোক, COPY কখনো
                আটকায় না। একটা ভুল লাইনের জন্য পুরো রাত নষ্ট হয় না। তারপর সাধারণ SQL দিয়ে, যা আপনি Module 03 থেকে শিখছেন, প্রতিটা লাইন
                পরিষ্কার আর যাচাই করেন। ভালো লাইন যায় আসল Table এ, খারাপ লাইন যায় একটা Rejects Table এ, কারণসহ। শেষে Staging খালি, পরের রাতের
                জন্য তৈরি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StagingPipelineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম ধাপ: Agency র File টা Staging এ নেওয়া। line_no Column টা একটা Identity, শুরু 2 থেকে। COPY File এর লাইনগুলো ক্রম ধরে
              ঢোকায়, তাই line_no হুবহু File এর লাইন নম্বর হয়, Header লাইন 1 ধরে। Email কলামটা চারকোনা বন্ধনীর ভেতরে দেখাচ্ছি, যাতে আগে পরের
              ফাঁকা জায়গা চোখে পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ 1: সব লাইন Staging এ"
              query={`${AGENT_FILE}
${AGENT_STAGING}

SELECT line_no, agent_ref, '[' || customer_email || ']' AS email_as_sent, tour_title, seats
FROM bulk_agent_staging
ORDER BY line_no;`}
              caption="দ্বিতীয় COPY 8: two সহ সব লাইন ঢুকেছে, কারণ seats এখানে শুধু লেখা। line_no 2 থেকে 9। লাইন 3 আর 8 হুবহু এক, আর তাদের Email এর দুই পাশে ফাঁকা, [ Nusrat.Jahan@mail.example ]। লাইন 7 এর ট্যুর Kuakata Sunset Tour, যেটা Island Tours এ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় ধাপ: যাচাই। প্রতিটা লাইনের জন্য একটা রায়, যাকে বলছি verdict। পরিষ্কার করতে <code className={CODE}>trim()</code> দুই
                পাশের ফাঁকা কাটে আর <code className={CODE}>lower()</code> ছোট হাতের অক্ষর বানায়, দুটোই{" "}
                <Link href="/sql/topic/string-functions" className={LINK}>
                  Module 04
                </Link>{" "}
                এ শিখেছেন। যাচাইয়ের চারটা প্রশ্ন, এই ক্রমে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এই agent_ref কি আগের কোনো লাইনে এসেছে?</strong> <code className={CODE}>min(line_no) OVER (PARTITION BY agent_ref)</code>
                  প্রতিটা লাইনের পাশে সেই ref এর প্রথম লাইন নম্বর বসায়, ঠিক{" "}
                  <Link href="/sql/topic/partition-by" className={LINK}>
                    Module 08 এর PARTITION BY
                  </Link>{" "}
                  এর মতো। নিজের নম্বর তার চেয়ে বড় হলে এটা নকল।
                </ListItem>
                <ListItem>
                  <strong>seats কি আসলেই একটা সংখ্যা?</strong> <code className={CODE}>pg_input_is_valid(&apos;two&apos;, &apos;smallint&apos;)</code>
                  , PostgreSQL 16 থেকে, Cast না করেই বলে দেয় এই লেখা ওই Type এ রূপান্তর হবে কিনা। true বা false, কোনো Error নেই।
                </ListItem>
                <ListItem>
                  <strong>এই Email এর Customer কি আছে?</strong> customers এর সাথে LEFT JOIN, না মিললে customer_id NULL।
                </ListItem>
                <ListItem>
                  <strong>এই নামের ট্যুরের এই তারিখে কি Departure আছে?</strong> tours আর departures এর সাথে LEFT JOIN। তারিখ মেলাচ্ছি লেখা
                  হিসেবে, to_char দিয়ে, যাতে File এ ভুল তারিখ থাকলেও Cast এর Error এ যাচাইটাই না আটকে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফলাফলটা একটা আলাদা Table এ রাখছি, <code className={CODE}>CREATE TABLE ... AS SELECT</code> দিয়ে, যাতে পরের ধাপে বারবার একই
                যাচাই চালাতে না হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ 2: প্রতিটা লাইনের রায়"
              query={`${AGENT_FILE}
${AGENT_STAGING}
${AGENT_CHECK}

SELECT line_no, agent_ref, email, customer_id, departure_id, verdict
FROM bulk_agent_checked
ORDER BY line_no;`}
              caption="আটটা লাইনের চারটা ok: HT-1001 (Customer 1, Departure 8), HT-1002 (2, 10), HT-1004 (13, 11) আর HT-1007 (15, 15)। লাইন 4 seats is not a number, লাইন 6 unknown customer, লাইন 7 unknown departure, আর লাইন 8 duplicate of line 3। খেয়াল করুন লাইন 3 এর Email এখন পরিষ্কার: nusrat.jahan@mail.example, তাই Customer 2 এর সাথে মিলেছে। trim আর lower না দিলে এটাও unknown customer হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় ধাপ: সরানো। ok লাইনগুলো যায় আসল Table এ, এখানে অনুশীলনের জন্য bulk_agent_bookings নামের একটা Table এ। বাকি লাইনগুলো যায়
              bulk_agent_rejects এ, কারণসহ। seats আর amount_bdt এখন নিশ্চিন্তে Cast করা যায়, কারণ শুধু ok লাইন নিচ্ছি, যাদের seats আগেই
              যাচাই হয়ে গেছে। শেষে <code className={CODE}>TRUNCATE</code> দিয়ে Staging খালি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ধাপ 3: ভালো লাইন সামনে, খারাপ লাইন আলাদা ঝুড়িতে"
              query={`${AGENT_FILE}
${AGENT_STAGING}
${AGENT_CHECK}

DROP TABLE IF EXISTS bulk_agent_bookings, bulk_agent_rejects;
CREATE TABLE bulk_agent_bookings (
  agent_ref    text PRIMARY KEY,
  customer_id  integer NOT NULL,
  departure_id integer NOT NULL,
  seats        smallint NOT NULL CHECK (seats > 0),
  total_bdt    numeric(10, 2) NOT NULL
);
CREATE TABLE bulk_agent_rejects (line_no integer, agent_ref text, reason text);

INSERT INTO bulk_agent_bookings (agent_ref, customer_id, departure_id, seats, total_bdt)
SELECT agent_ref, customer_id, departure_id, seats::smallint, amount_bdt::numeric
FROM bulk_agent_checked
WHERE verdict = 'ok';

INSERT INTO bulk_agent_rejects (line_no, agent_ref, reason)
SELECT line_no, agent_ref, verdict
FROM bulk_agent_checked
WHERE verdict <> 'ok';

TRUNCATE bulk_agent_staging;

SELECT 'loaded' AS outcome, count(*) AS line_count FROM bulk_agent_bookings
UNION ALL
SELECT 'rejected', count(*) FROM bulk_agent_rejects
UNION ALL
SELECT 'left in staging', count(*) FROM bulk_agent_staging;`}
              caption="INSERT 4 আর INSERT 4: চারটা Booking ঢুকেছে, চারটা লাইন Rejects এ। শেষের হিসাব loaded 4, rejected 4, left in staging 0। কিছু হারায়নি: 4 আর 4 মিলে File এর আট লাইন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ পুরো যাত্রাটা ধাপে ধাপে দেখুন। প্রতিটা ধাপে কোন লাইন এগোল, কোনটা কোন কারণে থামল, আর কোথায় গেল। এই রায়গুলোই উপরের
              বক্সের রায়, আসল PostgreSQL এ চালিয়ে মেলানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StagingFlowLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Rejects Table টাই Agency র জন্য উত্তর",
          content: (
            <ContentParagraph>
              Rejects Table এ লাইন নম্বর আর কারণ আছে বলে সকালে Agency কে একটা পরিষ্কার উত্তর পাঠানো যায়: “লাইন 4 এ seats সংখ্যায় দিন, লাইন 6
              এর Customer আমাদের কাছে নেই, লাইন 7 এর ট্যুর আমাদের তালিকায় নেই”। COPY TO দিয়ে Rejects Table কেই CSV বানিয়ে পাঠানো যায়, Project
              Example এ সেটা করব। ON_ERROR ignore এই সুবিধা দেয় না, কারণ বাদ পড়া লাইনগুলো কোথাও জমা থাকে না।
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
                  ঢাকা ভ্রমণ মেলা থেকে আগ্রহী মানুষের একটা তালিকা এসেছে। Starter File টা Staging এ নিয়ে রাখে আর{" "}
                  <code className={CODE}>ex4_customers</code> Table বানায় (email হলো Primary Key)। একটা INSERT ... SELECT লিখুন যেটা
                  Staging থেকে নতুন মানুষদের ex4_customers এ নেয়: নাম আর শহরের দুই পাশের ফাঁকা বাদ, Email ফাঁকা বাদ আর ছোট হাতের, Email ফাঁকা
                  থাকলে সেই লাইন বাদ, একই Email একবারই, আর যাদের Email আগে থেকেই Island Tours এর customers Table এ আছে তাদের বাদ। শেষের SELECT
                  না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>SELECT DISTINCT trim(full_name), lower(trim(email)), trim(city)</code>, তারপর{" "}
                  <code className={CODE}>WHERE email IS NOT NULL</code> আর{" "}
                  <code className={CODE}>NOT EXISTS (SELECT 1 FROM customers c WHERE c.email = lower(trim(s.email)))</code>। নকল লাইনগুলো
                  পরিষ্কার করার পরে হুবহু এক, তাই DISTINCT যথেষ্ট। ON CONFLICT (email) DO NOTHING দিয়েও করা যায়।
                </>
              }
              starter={`COPY (VALUES
  ('full_name,email,city'),
  ('  Rumana Akter ,Rumana.Akter@mail.example,Dhaka'),
  ('Habib Rahman,habib.rahman@mail.example , Gazipur'),
  ('Shuvo Das,shuvo.das@mail.example,Dhaka'),
  ('Faisal Karim,,Narayanganj'),
  ('Rumana Akter, RUMANA.AKTER@mail.example ,Dhaka'),
  ('Nadia Islam,nadia.islam@mail.example,Dhaka')
) TO '/tmp/ex4-fair-leads.csv';
DROP TABLE IF EXISTS ex4_staging, ex4_customers;
CREATE TABLE ex4_staging (full_name text, email text, city text);
COPY ex4_staging FROM '/tmp/ex4-fair-leads.csv' WITH (FORMAT csv, HEADER);
CREATE TABLE ex4_customers (
  full_name text NOT NULL,
  email     text PRIMARY KEY,
  city      text NOT NULL
);

-- এখানে আপনার INSERT INTO ex4_customers (full_name, email, city) SELECT ... FROM ex4_staging s ...

SELECT email, full_name, city FROM ex4_customers ORDER BY email;`}
              solution={`SELECT * FROM (VALUES
  ('habib.rahman@mail.example', 'Habib Rahman', 'Gazipur'),
  ('nadia.islam@mail.example',  'Nadia Islam',  'Dhaka'),
  ('rumana.akter@mail.example', 'Rumana Akter', 'Dhaka')
) AS v(email, full_name, city);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "generate-series",
      subHeader: { index: "010", title: "Test Data with generate_series" },
      title: <SectionTitle>generate_series: File ছাড়াই হাজার Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক সময় File নেই, কিন্তু অনেক Row দরকার। নতুন একটা Index কতটা দ্রুত করে মাপতে, একটা রিপোর্টের Query দশ লাখ Booking এ কেমন চলে
                দেখতে, বা Page এর Pagination পরীক্ষা করতে। আসল Customer এর Data পরীক্ষায় ব্যবহার করা ঠিক না, তাই বানানো Data চাই। PostgreSQL এর
                উত্তর <code className={CODE}>generate_series()</code>: একটা Function যেটা একটা সংখ্যা বা তারিখের ক্রম Row হিসেবে ফেরত দেয়।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>generate_series(1, 5)</code> দেয় 1 থেকে 5 পর্যন্ত পাঁচটা Row।{" "}
                <code className={CODE}>generate_series(start, stop, step)</code> এ তারিখ আর INTERVAL দিলে একটা ক্যালেন্ডার। এই Row গুলোকে একটা
                Table এর মতো FROM এ বসিয়ে প্রতিটা নম্বর থেকে একটা বানানো Row তৈরি করা যায়, আর INSERT ... SELECT দিয়ে সোজা Table এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সংখ্যা আর তারিখের ক্রম"
              query={`SELECT n, n * 8500 AS price_for_n_seats
FROM generate_series(1, 5) AS n;

SELECT d::date AS day, to_char(d, 'Dy') AS weekday
FROM generate_series(DATE '2026-11-01', DATE '2026-11-07', INTERVAL '1 day') AS d;`}
              caption="প্রথম Table এ 1 থেকে 5, পাশে 8500 থেকে 42500। দ্বিতীয় Table এ 1 থেকে 7 নভেম্বরের সাতটা দিন। 1 নভেম্বর 2026 রবিবার, তাই প্রথম weekday Sun, শেষেরটা Sat।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পঞ্চাশ হাজার নকল Booking। প্রতিটা Column এর মান আসে নম্বর g থেকে একটা সহজ নিয়মে। <code className={CODE}>g % 15</code>{" "}
                মানে g কে 15 দিয়ে ভাগ করলে যা বাকি থাকে, তাই <code className={CODE}>1 + g % 15</code> সবসময় 1 থেকে 15, মানে আমাদের পনেরো
                জন Customer এর কেউ একজন। একই কৌশলে Departure, seats আর status। এই নিয়মে বানালে Data প্রতিবার হুবহু একই হয়, তাই আপনার ফলাফল
                আর এই পাতার ফলাফল মিলবে।
              </ContentParagraph>
              <ContentParagraph>
                এলোমেলো Data চাইলে <code className={CODE}>random()</code> আছে, প্রতিবার আলাদা একটা ভগ্নাংশ দেয়, 0 থেকে 1 এর মধ্যে। তখন
                প্রতিবার Data আলাদা। একই এলোমেলো Data বারবার পেতে হলে আগে <code className={CODE}>SELECT setseed(0.42);</code> চালান: একই Seed
                দিলে random() একই ক্রমে একই সংখ্যা দেয়, আর পরীক্ষাটা আবার চালানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পঞ্চাশ হাজার নকল Booking"
              query={`DROP TABLE IF EXISTS bulk_fake_bookings;
CREATE TABLE bulk_fake_bookings (
  booking_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  integer NOT NULL,
  departure_id integer NOT NULL,
  seats        smallint NOT NULL,
  status       text NOT NULL,
  total_bdt    numeric(10, 2) NOT NULL,
  booked_at    timestamptz NOT NULL
);

INSERT INTO bulk_fake_bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
SELECT 1 + g % 15,
       1 + g % 16,
       1 + g % 4,
       (ARRAY['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled'])[1 + g % 5],
       (1 + g % 4) * 8500,
       TIMESTAMPTZ '2026-01-01 09:00:00+06' + (g % 300) * INTERVAL '1 day'
FROM generate_series(1, 50000) AS g;

SELECT status, count(*) AS bookings, sum(seats) AS seats,
       min(booked_at)::date AS first_day, max(booked_at)::date AS last_day
FROM bulk_fake_bookings
GROUP BY status
ORDER BY status;`}
              caption="INSERT 50000, তারপর তিনটা Row: cancelled 10000 Booking আর 25000 সিট, confirmed 30000 আর 75000, pending 10000 আর 25000। প্রথম আর শেষ দিন 2026-01-01 থেকে 2026-10-27 এর ভেতরে। কোথাও random() নেই, তাই প্রতিবার হুবহু এই সংখ্যাগুলোই আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বক্সে বেশি বড় কিছু না",
          content: (
            <ContentParagraph>
              এই পাতার বক্স একটা Statement কে 10 সেকেন্ডের বেশি চলতে দেয় না, তারপর থামিয়ে Database নতুন করে শুরু করে। পঞ্চাশ হাজার Row এক
              সেকেন্ডের ভেতরে হয়ে যায়। কয়েক লাখ বা কোটি Row এর পরীক্ষা নিজের মেশিনের psql এ করুন, Practical Lab এর শেষ ড্রিলে সেটাই আছে।
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
                  একটা Seat Map বানানোর জন্য প্রতিটা Departure এর প্রতিটা সিটের একটা করে Row চাই।{" "}
                  <code className={CODE}>ex5_seats</code> Table এ (departure_id, seat_no) Row ঢোকান: প্রতিটা Departure এর জন্য seat_no 1
                  থেকে সেই Departure এর ট্যুরের max_seats পর্যন্ত। একটা INSERT ... SELECT, departures, tours আর generate_series দিয়ে।
                  শেষের SELECT না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  generate_series এর শেষ মান অন্য Table এর Column হতে পারে:{" "}
                  <code className={CODE}>FROM departures d JOIN tours t USING (tour_id) CROSS JOIN LATERAL generate_series(1, t.max_seats) AS s(seat_no)</code>
                  । শুধু <code className={CODE}>generate_series(1, t.max_seats)</code> কে SELECT এর তালিকায় লিখলেও চলে।
                </>
              }
              starter={`DROP TABLE IF EXISTS ex5_seats;
CREATE TABLE ex5_seats (
  departure_id integer  NOT NULL,
  seat_no      smallint NOT NULL,
  PRIMARY KEY (departure_id, seat_no)
);

-- এখানে আপনার INSERT INTO ex5_seats (departure_id, seat_no) SELECT ...

SELECT count(*) AS seat_rows, count(DISTINCT departure_id) AS departures, max(seat_no) AS top_seat
FROM ex5_seats;`}
              solution={`SELECT sum(t.max_seats) AS seat_rows, count(*) AS departures, max(t.max_seats) AS top_seat
FROM departures d
JOIN tours t USING (tour_id);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "transaction-and-ids",
      subHeader: { index: "011", title: "One Transaction, and Ids After a Load" },
      title: <SectionTitle>পুরো Load এক Transaction এ, আর Load এর পরে id</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা COPY নিজে সব বা কিছুই না। কিন্তু একটা রাতের Load প্রায়ই কয়েকটা কাজ: দুটো File, তারপর INSERT, তারপর Staging খালি। প্রতিটা
                আলাদা Statement, আর Autocommit এ প্রতিটা আলাদা করে পাকা হয়। তৃতীয়টা ব্যর্থ হলে প্রথম দুটো থেকে যায়, আর Database পড়ে থাকে একটা
                অর্ধেক অবস্থায়, যেটা কেউ চায়নি। উপায়: সব কাজ একটা <code className={CODE}>BEGIN ... COMMIT</code> এর ভেতরে। Transaction এর পুরো
                গল্প Module 12 এ, এখানে শুধু Load এর দিকটা।
              </ContentParagraph>
              <ContentParagraph>
                আমাদের Container এ দুটো রাতের File, দ্বিতীয়টার একটা তারিখ 31 নভেম্বর। প্রথমে Transaction ছাড়া, তারপর Transaction এর ভেতরে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql, Tanim's laptop",
          code: `island_tours=# \\copy bulk_night FROM 'nov01.csv' WITH (FORMAT csv, HEADER)
COPY 3
island_tours=# \\copy bulk_night FROM 'nov02.csv' WITH (FORMAT csv, HEADER)
ERROR:  date/time field value out of range: "2026-11-31"
CONTEXT:  COPY bulk_night, line 4, column starts_on: "2026-11-31"
island_tours=# SELECT count(*) FROM bulk_night;
 count
-------
     3
(1 row)

island_tours=# TRUNCATE bulk_night;
TRUNCATE TABLE
island_tours=# BEGIN;
BEGIN
island_tours=*# \\copy bulk_night FROM 'nov01.csv' WITH (FORMAT csv, HEADER)
COPY 3
island_tours=*# \\copy bulk_night FROM 'nov02.csv' WITH (FORMAT csv, HEADER)
ERROR:  date/time field value out of range: "2026-11-31"
CONTEXT:  COPY bulk_night, line 4, column starts_on: "2026-11-31"
island_tours=!# SELECT count(*) FROM bulk_night;
ERROR:  current transaction is aborted, commands ignored until end of transaction block
island_tours=!# COMMIT;
ROLLBACK
island_tours=# SELECT count(*) FROM bulk_night;
 count
-------
     0
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার রাতটা অর্ধেক Load হয়ে থেকে গেছে: প্রথম File এর তিনটা Row আছে, দ্বিতীয়টার কিছু নেই। দ্বিতীয়বার Prompt এর চিহ্ন
                দেখুন: BEGIN এর পরে <code className={CODE}>=*#</code>, মানে Transaction খোলা। Error এর পরে <code className={CODE}>=!#</code>,
                মানে Transaction ভেঙে গেছে, এখন কোনো Command চলবে না। COMMIT লিখলেও PostgreSQL উত্তর দেয় ROLLBACK, আর Table আগের মতো খালি। সব
                বা কিছুই না, পুরো রাতের জন্য।
              </ContentParagraph>
              <ContentParagraph>
                বক্সে একই কাজ, শুধু সফল অংশটা। একটা File থেকে দুজন নতুন Customer আসল customers Table এ ঢুকছে, Transaction এর ভেতরে। SELECT এ
                তাদের দেখা যায়, তারপর ROLLBACK সব ফিরিয়ে নেয়, তাই এই পাতার বাকি বক্সগুলো আগের মতো 15 জন Customer ই দেখবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আসল customers Table এ COPY, তারপর ROLLBACK"
              query={`COPY (VALUES
  ('full_name,email,city'),
  ('Rumana Akter,rumana.akter@mail.example,Dhaka'),
  ('Habib Rahman,habib.rahman@mail.example,Gazipur')
) TO '/tmp/fair-leads.csv';

BEGIN;
COPY customers (full_name, email, city) FROM '/tmp/fair-leads.csv' WITH (FORMAT csv, HEADER);
SELECT customer_id, full_name, email, city, country
FROM customers
WHERE customer_id > 15
ORDER BY customer_id;
ROLLBACK;`}
              caption="প্রথমবার চালালে দুজন পাবেন customer_id 16 আর 17, country পেয়েছে DEFAULT Bangladesh। ROLLBACK এর পরে দুজনই নেই। কিন্তু বক্সটা আবার চালালে id হবে 18 আর 19: ROLLBACK Row ফেরায়, Identity এর পরের নম্বর ফেরায় না। কেন, সেটা পরের লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার id এর একটা ফাঁদ, যেটা পুরনো System থেকে Data সরানোর সময় প্রায় সবাই একবার পড়েন। পুরনো System এর গাইডদের নিজের id আছে,
                1 থেকে 5, আর অন্য Table গুলো সেই id দিয়ে গাইডকে চেনে। তাই নতুন Table এ একই id রাখতে হবে। Docs বলে, Identity Column এ COPY
                FROM সবসময় File এর দেওয়া মানই লেখে, ঠিক INSERT এর{" "}
                <code className={CODE}>OVERRIDING SYSTEM VALUE</code> এর মতো, এমনকি Column টা GENERATED ALWAYS হলেও।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যা হলো, Identity এর নম্বর দেওয়ার যন্ত্র, যাকে বলে Sequence, এই খবর পায় না। সে এখনো ভাবে প্রথম নম্বর 1। তাই পরের সাধারণ
                INSERT পায় 1, যেটা আগেই আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="COPY এর পরে প্রথম INSERT"
              query={`DROP TABLE IF EXISTS bulk_guides_moved;
CREATE TABLE bulk_guides_moved (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL
);
COPY (SELECT guide_id, full_name FROM guides ORDER BY guide_id) TO '/tmp/guides-old-system.csv' WITH (FORMAT csv);
COPY bulk_guides_moved (guide_id, full_name) FROM '/tmp/guides-old-system.csv' WITH (FORMAT csv);
SELECT * FROM bulk_guides_moved ORDER BY guide_id;

INSERT INTO bulk_guides_moved (full_name) VALUES ('Mahin Alam');`}
              caption={`COPY 5 দুইবার, আর পাঁচজন গাইড তাদের পুরনো id 1 থেকে 5 নিয়েই এসেছেন, GENERATED ALWAYS থাকা সত্ত্বেও। তারপর নতুন গাইড Mahin Alam এর INSERT এ Error 23505: duplicate key value violates unique constraint "bulk_guides_moved_pkey", DETAIL: Key (guide_id)=(1) already exists।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান এক লাইনের: Load এর পরে Sequence কে বলে দিন সবচেয়ে বড় id কত। <code className={CODE}>pg_get_serial_sequence()</code> একটা
              Column এর Sequence এর নাম খুঁজে দেয়, আর <code className={CODE}>setval()</code> তার বর্তমান মান বসায়। এই দুটোর পুরো ব্যাখ্যা,
              আর Sequence এ কেন ফাঁক পড়ে,{" "}
              <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                পরের লেসনে
              </Link>
              । pg_dump নিজেও ঠিক এটাই করে: Identity ওয়ালা Table এর COPY এর পরে সে একটা setval লেখে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="setval দিয়ে Sequence কে খবর দেওয়া"
              query={`DROP TABLE IF EXISTS bulk_guides_moved;
CREATE TABLE bulk_guides_moved (
  guide_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL
);
COPY (SELECT guide_id, full_name FROM guides ORDER BY guide_id) TO '/tmp/guides-old-system.csv' WITH (FORMAT csv);
COPY bulk_guides_moved (guide_id, full_name) FROM '/tmp/guides-old-system.csv' WITH (FORMAT csv);

SELECT setval(pg_get_serial_sequence('bulk_guides_moved', 'guide_id'),
              (SELECT max(guide_id) FROM bulk_guides_moved)) AS sequence_now_at;

INSERT INTO bulk_guides_moved (full_name) VALUES ('Mahin Alam') RETURNING guide_id, full_name;`}
              caption="setval উত্তর দেয় 5, মানে Sequence এখন জানে 5 পর্যন্ত নেওয়া হয়ে গেছে। তারপর INSERT এর RETURNING এ guide_id 6, Mahin Alam। কোনো Error নেই।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "faster-loads",
      subHeader: { index: "012", title: "Making Big Loads Faster" },
      title: <SectionTitle>বড় Load দ্রুত করার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল Server এর আসল সংখ্যা। আমাদের PostgreSQL 18 Container এ এক লাখ Row একই Table এ পাঁচ উপায়ে Load করেছি, প্রতিবার আগে
                TRUNCATE, প্রতিটা দুইবার। Table এ একটা Primary Key আছে। Client আলাদা একটা Container, Server এর সাথে localhost দিয়ে যুক্ত,
                তাই Network এর দেরি এখানে খুবই কম। আসল Network এ, যেখানে প্রতিটা যাতায়াতে কয়েক মিলিসেকেন্ড লাগে, একটা একটা INSERT এর সংখ্যা
                আরও অনেক খারাপ হতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LoadSpeedChart />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "কী চালানো হলো", "প্রথমবার", "দ্বিতীয়বার"],
          rows: [
            ["একটা একটা INSERT, Autocommit", "psql -f inserts.sql, এক লাখ লাইন", "9.145 s", "10.153 s"],
            ["একটা একটা INSERT, এক Transaction এ", "psql -1 -f inserts.sql", "4.900 s", "4.362 s"],
            ["এক হাজার Row এর INSERT, 100 বার", "psql -f multirow.sql", "0.231 s", "0.252 s"],
            ["\\copy, Client এর File", "\\copy bulk_speed FROM 'speed.csv'", "0.079 s", "0.092 s"],
            ["COPY, Server এর File", "COPY bulk_speed FROM '/srv/imports/speed.csv'", "0.094 s", "0.108 s"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা শিক্ষা। এক, শুধু একটা Transaction এ রাখলেই সময় অর্ধেক, কারণ এক লাখ COMMIT এর জায়গায় একটা, আর প্রতিটা COMMIT মানে Disk এ
                পাকা লেখা পর্যন্ত অপেক্ষা। psql এর <code className={CODE}>-1</code> Flag পুরো File কে একটা Transaction এ চালায়। দুই, ব্যাচ করা
                INSERT একটা একটার চেয়ে প্রায় চল্লিশ গুণ দ্রুত। App থেকে COPY করা কঠিন হলে এটাই পরের সেরা পথ। তিন, COPY আর \copy এখানে প্রায়
                সমান, কারণ Client আর Server একই মেশিনে। দূরের Server এ \copy এর Data Network দিয়ে যায়, তখন Server এর নিজের File থেকে COPY একটু
                এগিয়ে থাকে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় বড় খরচ Index। প্রতিটা নতুন Row এর জন্য প্রতিটা Index এ একটা করে জায়গা খুঁজে বসাতে হয়। দশ লাখ Row আগে থেকে Index ওয়ালা
                Table এ, আর Index ছাড়া Table এ Load করে পরে Index বানানো, দুটোর আসল সময়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql with \\timing, 1,000,000 rows",
          code: `island_tours=# CREATE TABLE bulk_idx_first (id integer PRIMARY KEY, full_name text NOT NULL, email text NOT NULL, city text NOT NULL);
island_tours=# CREATE INDEX ON bulk_idx_first (email);
island_tours=# COPY bulk_idx_first FROM '/srv/imports/million.csv' WITH (FORMAT csv);
COPY 1000000
Time: 5810.371 ms (00:05.810)

island_tours=# CREATE TABLE bulk_idx_after (id integer NOT NULL, full_name text NOT NULL, email text NOT NULL, city text NOT NULL);
island_tours=# COPY bulk_idx_after FROM '/srv/imports/million.csv' WITH (FORMAT csv);
COPY 1000000
Time: 453.070 ms
island_tours=# ALTER TABLE bulk_idx_after ADD PRIMARY KEY (id);
ALTER TABLE
Time: 174.317 ms
island_tours=# CREATE INDEX ON bulk_idx_after (email);
CREATE INDEX
Time: 980.831 ms
island_tours=# ANALYZE bulk_idx_after;
ANALYZE
Time: 107.014 ms`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Index আগে থাকলে 5.8 সেকেন্ড। পরে বানালে মোট প্রায় 1.6 সেকেন্ড: Load 0.45, Primary Key 0.17, Email এর Index 0.98। একবারে সব Row
              সাজিয়ে Index বানানো একটা একটা করে বসানোর চেয়ে অনেক কম কাজ। PostgreSQL এর Docs এর “Populating a Database” পাতায় এমন আরও কিছু
              পরামর্শ আছে। এখানে শুধু নাম আর এক লাইন, গভীরে যাবে Module 13 আর 18:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "কেন কাজ করে", "সাবধানতা"],
          rows: [
            ["INSERT এর বদলে COPY", "একটা Command, Parse আর যাতায়াত একবার", "ভুল লাইনে পুরো COPY ব্যর্থ"],
            ["এক Transaction", "একবার COMMIT", "লম্বা Transaction অনেকক্ষণ Lock ধরে রাখে"],
            ["Index পরে বানানো", "সাজানো অবস্থায় একবারে বানানো সস্তা", "চলতি Table এ Index ফেলা মানে ওই সময় Query ধীর"],
            ["Foreign Key পরে যোগ", "প্রতিটা Row এর জন্য আলাদা যাচাই বাদ", "পরে ADD CONSTRAINT এর সময় পুরো যাচাই হবে, ভুল থাকলে তখন ধরা পড়বে"],
            ["maintenance_work_mem বাড়ানো", "CREATE INDEX আর ADD FOREIGN KEY দ্রুত", "COPY নিজের গতিতে প্রায় কিছু যোগ করে না"],
            ["max_wal_size বাড়ানো", "Load এর মাঝে Checkpoint কম", "Server এর Setting, Module 18"],
            ["UNLOGGED Staging Table", "WAL লেখা হয় না, তাই দ্রুত", "Server Crash করলে Table খালি হয়ে যায়, তাই শুধু Staging এ"],
            ["COPY ... FREEZE", "একই Transaction এ বানানো বা TRUNCATE করা Table এ পরে VACUUM এর কাজ কমে", "অন্য Session সাথে সাথে Data দেখে ফেলে"],
            ["Load এর পরে ANALYZE", "Planner নতুন Data র আকার জানে", "না দিলে প্রথম Query গুলো ভুল Plan নিতে পারে"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UNLOGGED Staging, পরে Index, শেষে ANALYZE"
              query={`DROP TABLE IF EXISTS bulk_fast;
CREATE UNLOGGED TABLE bulk_fast (id integer, full_name text, email text);
COPY (SELECT g, 'Customer ' || g, 'user' || g || '@mail.example'
      FROM generate_series(1, 50000) AS g) TO '/tmp/fast.csv' WITH (FORMAT csv);

COPY bulk_fast FROM '/tmp/fast.csv' WITH (FORMAT csv);
ALTER TABLE bulk_fast ADD PRIMARY KEY (id);
CREATE INDEX bulk_fast_email_idx ON bulk_fast (email);
ANALYZE bulk_fast;

SELECT relname, relkind, relpersistence, reltuples::bigint AS planner_thinks_rows
FROM pg_class
WHERE relname IN ('bulk_fast', 'bulk_fast_pkey', 'bulk_fast_email_idx')
ORDER BY relname;`}
              caption="তিনটা Row: Table টা relkind r, দুটো Index relkind i। তিনটারই relpersistence u, মানে UNLOGGED, আর Index গুলোও Table এর সাথে UNLOGGED। ANALYZE এর পরে planner_thinks_rows তিনটাতেই 50000, Planner এখন জানে Table টা কত বড়।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ LOAD DATA INFILE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ COPY নেই। File থেকে পড়ার কমান্ড <code className={CODE}>LOAD DATA INFILE</code>, আর File এ লেখার জন্য{" "}
                <code className={CODE}>SELECT ... INTO OUTFILE</code>। ধারণা একই, কিন্তু খুঁটিনাটি আর বিপদগুলো আলাদা। নিচের সব Output আমাদের MySQL
                8.4.11 Container এর, একই Agency File দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম পার্থক্য: CSV এর নিয়ম আপনাকে নিজে লিখে দিতে হয়।{" "}
                <code className={CODE}>FIELDS TERMINATED BY &apos;,&apos;</code> মানে কমা দিয়ে আলাদা,{" "}
                <code className={CODE}>OPTIONALLY ENCLOSED BY &apos;&quot;&apos;</code> মানে কিছু মান Double Quote এর ভেতরে থাকতে পারে,{" "}
                <code className={CODE}>IGNORE 1 LINES</code> মানে Header বাদ। কিছু না বললে MySQL ধরে নেয় Field এর মাঝে Tab আর NULL মানে{" "}
                <code className={CODE}>\N</code>, PostgreSQL এর text Format এর মতো।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় পার্থক্য: Server এর File শুধু একটা নির্দিষ্ট ফোল্ডার থেকে পড়া যায়। সেই ফোল্ডারের নাম থাকে{" "}
                <code className={CODE}>secure_file_priv</code> Variable এ। Docker এর mysql:8.4 Image এ এটা{" "}
                <code className={CODE}>/var/lib/mysql-files/</code>। অন্য কোথাও File রাখলে Error 1290। এর জন্য User এর FILE Privilege ও লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4",
          code: MYSQL_SERVER_SESSION,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল Type ওয়ালা Table এ, যেখানে seats একটা SMALLINT। Strict Mode এ, যেটা MySQL 8 এর Default, two পেয়ে পুরো LOAD DATA ব্যর্থ,
                InnoDB Table এ একটা Row ও ঢোকে না, PostgreSQL এর মতোই। খেয়াল করুন MySQL বলছে row 3, কারণ সে Header বাদ দিয়ে Data এর Row
                গোনে, আর PostgreSQL বলেছিল line 4, File এর লাইন।
              </ContentParagraph>
              <ContentParagraph>
                বিপদটা আসে <code className={CODE}>IGNORE</code> শব্দে। PostgreSQL এর ON_ERROR ignore খারাপ লাইনটা ফেলে দেয়। MySQL এর IGNORE
                লাইনটা রাখে, আর ভুল মানটাকে বদলে দেয় সবচেয়ে কাছের ঠিক মানে: two হয়ে যায় 0, সাথে একটা Warning। Docs এ এটা লেখা আছে, আর
                Warning কেউ না পড়লে Database এ চুপচাপ একটা শূন্য সিটের Booking বসে থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4",
          code: MYSQL_TYPED_SESSION,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এর একটা সুবিধা PostgreSQL এর COPY তে নেই: Load এর সময়ই রূপান্তর। Column তালিকায় <code className={CODE}>@email</code>{" "}
                এর মতো একটা User Variable এ মান ধরে, তারপর <code className={CODE}>SET</code> এ যেকোনো Expression দিয়ে আসল Column ভরা যায়।
                PostgreSQL এ একই কাজ হয় Staging Table আর INSERT ... SELECT দিয়ে, যা আপনি সেকশন 009 এ করেছেন।
              </ContentParagraph>
              <ContentParagraph>
                File এ লেখার <code className={CODE}>SELECT ... INTO OUTFILE</code> ও Server এর secure_file_priv ফোল্ডারেই লেখে, Header লেখার কোনো
                Option নেই, NULL লেখে <code className={CODE}>\N</code> দিয়ে, আর File আগে থেকে থাকলে লিখতে রাজি হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4",
          code: MYSQL_SET_SESSION,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এর \copy এর মতো MySQL এ আছে <code className={CODE}>LOAD DATA LOCAL INFILE</code>: Client নিজের মেশিন থেকে File পড়ে Server
              কে পাঠায়, FILE Privilege লাগে না। কিন্তু নিরাপত্তার কারণে এটা দুই দিকেই বন্ধ থাকে: Server এ <code className={CODE}>local_infile</code>{" "}
              Variable, আর Client এ <code className={CODE}>--local-infile=1</code> Option। আমাদের দুই Container এ তিন অবস্থা:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql client in another container",
          code: MYSQL_LOCAL_SESSION,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "LOCAL মানে IGNORE, Strict Mode থাকলেও",
          content: (
            <ContentParagraph>
              MySQL এর Docs বলে, LOCAL এর প্রভাব IGNORE এর মতোই, কারণ File পাঠানোর মাঝপথে Server Client কে থামাতে পারে না। আমাদের Container এ
              LOCAL দিয়ে একই File আসল Type ওয়ালা Table এ চালিয়েছি, Strict Mode চালু থাকা অবস্থায়: Query OK, 8 rows affected, 1 warning, আর HT-1003
              এর seats 0। তাই MySQL এ LOCAL দিয়ে Load করলে সবসময় SHOW WARNINGS পড়ুন, অথবা আগে একটা সব VARCHAR এর Staging Table এ নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["Server এর File পড়া", "COPY t FROM '/path' WITH (FORMAT csv)", "LOAD DATA INFILE '/path' INTO TABLE t FIELDS ..."],
            ["Client এর File পড়া", "\\copy t FROM 'file'", "LOAD DATA LOCAL INFILE 'file' ..., দুই দিকে চালু করতে হয়"],
            ["File এ লেখা", "COPY (SELECT ...) TO '/path'", "SELECT ... INTO OUTFILE '/path' ..."],
            ["Header বাদ", "HEADER", "IGNORE 1 LINES"],
            ["Header লেখা", "HEADER", "Option নেই"],
            ["Server এর File এর অনুমতি", "Superuser বা pg_read_server_files", "FILE Privilege আর secure_file_priv ফোল্ডার"],
            ["খারাপ মান, Default", "পুরো COPY ব্যর্থ", "Strict Mode এ পুরো LOAD ব্যর্থ"],
            ["খারাপ মান, সহনশীল", "ON_ERROR ignore: লাইনটা বাদ", "IGNORE বা LOCAL: মান বদলে 0, Warning"],
            ["Load এর সময় রূপান্তর", "নেই, Staging দিয়ে", "@var আর SET"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours: Hill Trails এর রাতের Import</SectionTitle>,
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
                এবার সব জোড়া লাগাই। তানিমের রাতের Job টা আসলে চারটা কাজ: Agency র File Staging এ নেওয়া, প্রতিটা লাইনের রায় দেওয়া, ok লাইনগুলো
                আসল bookings Table এ pending হিসেবে ঢোকানো, আর বাকিগুলোর একটা CSV বানিয়ে Agency কে ফেরত পাঠানো। bookings এ ঢোকানোর অংশটা এক
                Transaction এ, যাতে মাঝপথে কিছু ভাঙলে একটা Booking ও না ঢোকে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে সেই Transaction টা সত্যিই আসল bookings Table এ চলে। Booking গুলো pending, কারণ Payment এখনো আসেনি, আর booked_at হলো
                Import এর সময়, রাত 11:30। bookings এ Row ঢোকার পরে চারজন Customer এর Booking সংখ্যা দেখছি, তারপর ROLLBACK, যাতে এই পাতার
                বাকি বক্সগুলো আগের 24টা Booking ই দেখে। আসল Job এ শেষ লাইনটা হতো COMMIT।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="রাতের Import, আসল bookings Table এ"
              query={`${AGENT_FILE}
${AGENT_STAGING}
${AGENT_CHECK}

BEGIN;

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
SELECT customer_id, departure_id, seats::smallint, 'pending', amount_bdt::numeric,
       TIMESTAMPTZ '2026-11-01 23:30:00+06'
FROM bulk_agent_checked
WHERE verdict = 'ok'
ORDER BY line_no
RETURNING booking_id, customer_id, departure_id, seats, total_bdt;

SELECT c.customer_id, c.full_name, count(b.booking_id) AS bookings
FROM customers c
LEFT JOIN bookings b USING (customer_id)
WHERE c.customer_id IN (1, 2, 13, 15)
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;

ROLLBACK;`}
              caption="প্রথমবার চালালে RETURNING এ চারটা নতুন Booking: 25 থেকে 28, File এর ক্রমে। তারপর Rahim Uddin 4, Nusrat Jahan 3, Shuvo Das 3, আর Imran Kabir 1। Imran এর এটাই প্রথম Booking, Module 06 থেকে যিনি ছিলেন Booking ছাড়া Customer। ROLLBACK এর পরে সব আগের মতো। আবার চালালে নম্বর 29 থেকে শুরু হবে, আগের বক্সের মতোই Identity ফেরে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ কাজ: Agency র জন্য উত্তর। Rejects কে COPY TO দিয়ে একটা CSV বানাই, File এর লাইন নম্বর আর কারণসহ। আসল Job এ এই File টা Email এ
              যেত। আমাদের Container এ Practical Lab এর চতুর্থ ড্রিলে \copy দিয়ে একই File তানিমের Laptop এ বানানো হয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Agency কে ফেরত পাঠানোর CSV"
              query={`${AGENT_FILE}
${AGENT_STAGING}
${AGENT_CHECK}

COPY (
  SELECT line_no, agent_ref, verdict AS reason
  FROM bulk_agent_checked
  WHERE verdict <> 'ok'
  ORDER BY line_no
) TO '/tmp/agent-2026-11-01-rejects.csv' WITH (FORMAT csv, HEADER);

SELECT pg_read_file('/tmp/agent-2026-11-01-rejects.csv') AS reply_to_agency;`}
              caption="COPY 4, আর File এ Header এর পরে চারটা লাইন: 4,HT-1003,seats is not a number; 6,HT-1005,unknown customer; 7,HT-1006,unknown departure; 8,HT-1002,duplicate of line 3। Agency নিজের File খুলে সরাসরি এই লাইনগুলোতে যেতে পারবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পরের রাতের File এ নতুন ধরনের ভুল এসেছে। এবার আপনার পালা, আর এবার দুটো নতুন নিয়মও আছে: বন্ধ ট্যুর বিক্রি হবে না, আর Departure এ যত
              সিট খালি তার বেশি নেওয়া যাবে না। টাকার অঙ্কও মেলাতে হবে।
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
                  Starter 2 নভেম্বরের File <code className={CODE}>/tmp/agent-2026-11-02.csv</code> লেখে, আর তিনটা খালি Table বানায়:{" "}
                  <code className={CODE}>ch_staging</code> (সব text), <code className={CODE}>ch_bookings</code> আর{" "}
                  <code className={CODE}>ch_rejects</code>। আপনি লিখুন: File টা ch_staging এ নেওয়ার COPY, তারপর প্রতিটা লাইন যাচাই করে ভালোগুলো
                  ch_bookings এ আর বাকিগুলো ch_rejects এ, কারণসহ। যাচাই এই ক্রমে, প্রথম যেটা ভাঙে সেটাই কারণ:{" "}
                  <code className={CODE}>bad seats</code> (seats ফাঁকা বা পূর্ণসংখ্যা না), <code className={CODE}>unknown customer</code>{" "}
                  (Email, ফাঁকা বাদ দিয়ে আর ছোট হাতের করে, customers এ নেই), <code className={CODE}>unknown departure</code> (ওই নামের ট্যুরের ওই
                  তারিখে Departure নেই), <code className={CODE}>tour not active</code> (ট্যুরের is_active false),{" "}
                  <code className={CODE}>not enough seats</code> (seats, Departure এর seats_left এর বেশি), আর{" "}
                  <code className={CODE}>amount mismatch</code> (amount_bdt, seats গুণ ট্যুরের price_bdt এর সমান না)। শেষের SELECT না বদলে রাখুন।
                </>
              }
              hint={
                <>
                  Section 009 এর AGENT_CHECK এর মতো একটা <code className={CODE}>CREATE TABLE ch_checked AS SELECT ...</code> বানান, যেখানে
                  tours থেকে is_active আর price_bdt, departures থেকে seats_left আনবেন, আর CASE এ ছয়টা WHEN এই ক্রমে। ফাঁকা seats CSV তে NULL
                  হয়ে আসে, আর <code className={CODE}>pg_input_is_valid(NULL, ...)</code> নিজেও NULL দেয়, তাই প্রথম শর্তে{" "}
                  <code className={CODE}>s.seats IS NULL OR NOT pg_input_is_valid(...)</code> লিখুন। CASE এর শর্তগুলো ক্রমে চলে, তাই পরের WHEN
                  গুলোতে <code className={CODE}>trim(s.seats)::smallint</code> নিশ্চিন্তে লেখা যায়।
                </>
              }
              starter={`COPY (VALUES
  ('agent_ref,customer_email,tour_title,starts_on,seats,amount_bdt'),
  ('HT-1101,sumaiya.islam@mail.example,Sylhet Tea Garden Tour,2026-11-14,2,15600'),
  ('HT-1102,tanvir.ahmed@mail.example,Bandarban Hill Trek,2027-01-08,12,168000'),
  ('HT-1103,arif.chowdhury@mail.example,Sundarbans Mangrove Cruise,2026-12-04,2,30000'),
  ('HT-1104,MITU.RAHMAN@mail.example,Sajek Valley Cloud Trip,2026-12-11,3,28500'),
  ('HT-1105,priya.sharma@mail.example,Saint Martin Luxury Stay,2027-02-14,2,64000'),
  ('HT-1106,oliver.bennett@mail.example,Cox''s Bazar Beach Weekend,2026-11-27,2,17000'),
  ('HT-1107,farhana.akter@mail.example,Saint Martin Island Escape,2026-11-20,,25000')
) TO '/tmp/agent-2026-11-02.csv';
DROP TABLE IF EXISTS ch_checked, ch_staging, ch_bookings, ch_rejects;
CREATE TABLE ch_staging (agent_ref text, customer_email text, tour_title text, starts_on text, seats text, amount_bdt text);
CREATE TABLE ch_bookings (
  agent_ref    text PRIMARY KEY,
  customer_id  integer NOT NULL,
  departure_id integer NOT NULL,
  seats        smallint NOT NULL,
  total_bdt    numeric(10, 2) NOT NULL
);
CREATE TABLE ch_rejects (agent_ref text PRIMARY KEY, reason text NOT NULL);

-- নিচে আপনার COPY, যাচাই আর দুটো INSERT

SELECT agent_ref, 'loaded' AS result FROM ch_bookings
UNION ALL
SELECT agent_ref, reason FROM ch_rejects
ORDER BY agent_ref;`}
              solution={`SELECT * FROM (VALUES
  ('HT-1101', 'loaded'),
  ('HT-1102', 'not enough seats'),
  ('HT-1103', 'amount mismatch'),
  ('HT-1104', 'loaded'),
  ('HT-1105', 'tour not active'),
  ('HT-1106', 'loaded'),
  ('HT-1107', 'bad seats')
) AS v(agent_ref, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা আসল CSV Load এর ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "File টা আগে চিনুন",
              description:
                "Terminal এ head -5 আর wc -l দিয়ে দেখুন: Header আছে কিনা, Field আলাদা করছে কমা না সেমিকোলন, \"নেই\" লেখা হয় কীভাবে, কয়টা লাইন। যে পাঠিয়েছে তাকে Encoding জিজ্ঞেস করুন। এই সংখ্যাটাই শেষে মেলাবেন।",
            },
            {
              title: "Staging Table বানান, আর আগে খালি করুন",
              description:
                "সব Column text, কোনো Constraint নেই, সাথে File এর লাইন নম্বরের জন্য একটা Identity। প্রতিবার Load এর আগে TRUNCATE, যাতে কাল রাতের লাইন আজকের সাথে না মেশে।",
            },
            {
              title: "COPY বা \\copy দিয়ে Staging এ নিন",
              description:
                "File Server এ থাকলে COPY, আপনার মেশিনে থাকলে \\copy। FORMAT csv, HEADER, আর দরকার হলে DELIMITER, NULL। Staging সব text বলে এই ধাপ প্রায় কখনো ব্যর্থ হয় না।",
            },
            {
              title: "প্রতিটা লাইনের রায় দিন",
              description:
                "trim, lower দিয়ে পরিষ্কার; pg_input_is_valid দিয়ে Type যাচাই; LEFT JOIN দিয়ে Customer, Departure খোঁজা; PARTITION BY দিয়ে নকল খোঁজা। প্রতিটা লাইনের একটা verdict। ok আর বাকিগুলোর যোগফল File এর লাইনের সমান কিনা মেলান।",
            },
            {
              title: "এক Transaction এ সরান",
              description:
                "BEGIN, ok লাইনগুলোর INSERT ... SELECT (দরকার হলে ON CONFLICT), বাকিগুলো Rejects এ, Staging TRUNCATE, সংখ্যা দেখে COMMIT। কিছু ভুল মনে হলে ROLLBACK, কিছুই বদলাবে না।",
            },
            {
              title: "পরের কাজগুলো",
              description:
                "বড় Load এর পরে ANALYZE। File থেকে id এসে থাকলে setval। Rejects কে COPY TO দিয়ে CSV বানিয়ে যে পাঠিয়েছে তাকে ফেরত। আর কোন File, কখন, কয়টা লাইন, কয়টা বাতিল, একটা Log এ লিখে রাখুন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রথম Load এ সবাই করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "নিজের Laptop এর File এ COPY FROM",
              "could not open file ... No such file or directory, সাথে \\copy এর HINT",
              "Client এর File এর জন্য \\copy, বা COPY ... FROM STDIN",
            ],
            [
              "HEADER দিতে ভুলে যাওয়া",
              "Type ওয়ালা Table এ প্রথম লাইনেই Type এর Error, আর text Staging এ Column এর নামগুলো চুপচাপ একটা Row হয়ে ঢোকে",
              "Header থাকলে HEADER, নাম মিলিয়ে নিতে চাইলে HEADER MATCH",
            ],
            [
              "সেমিকোলনের CSV কমা ধরে পড়া",
              "পুরো লাইন একটা Field, missing data for column",
              "DELIMITER ';'",
            ],
            [
              "ফাঁকা লেখা আর NULL গুলিয়ে ফেলা",
              "NA নামের লেখা Database এ বসে থাকে, বা ফাঁকা লেখার জায়গায় NULL",
              "আগে জিজ্ঞেস করুন \"নেই\" কীভাবে লেখা, তারপর NULL, FORCE_NULL বা FORCE_NOT_NULL",
            ],
            [
              "একই File দুইবার Load",
              "সব Row দুইবার, UNIQUE না থাকলে কোনো Error ছাড়াই",
              "Staging আগে TRUNCATE, আসল Table এ UNIQUE Key, আর ON CONFLICT DO NOTHING",
            ],
            [
              "ON_ERROR ignore কে সব সমস্যার সমাধান ভাবা",
              "CHECK বা UNIQUE ভাঙলে পুরো COPY তবু ব্যর্থ, আর বাদ পড়া লাইন কোথাও জমা থাকে না",
              "Staging Table আর একটা Rejects Table",
            ],
            [
              "File এর id দিয়ে Load, তারপর নতুন INSERT",
              "duplicate key, কারণ Sequence এখনো 1 এ",
              "Load এর পরে setval(pg_get_serial_sequence(...), max(id))",
            ],
            [
              "সব Index রেখে কোটি Row Load",
              "Load অনেক গুণ ধীর, আমাদের দশ লাখ Row এ 5.8 বনাম 1.6 সেকেন্ড",
              "নতুন Table এ আগে Load, পরে Index আর Foreign Key",
            ],
            [
              "Excel এর UTF-8 CSV এর শুরুর BOM",
              "প্রথম Header এর আগে একটা অদৃশ্য অক্ষর, তাই HEADER MATCH ব্যর্থ, আর Header না থাকলে প্রথম মানের ভেতরে ঢুকে যায়",
              "BOM ছাড়া Save করুন, বা সাধারণ HEADER দিয়ে প্রথম লাইন বাদ দিন",
            ],
            [
              "MySQL এ IGNORE বা LOCAL এর পরে Warning না পড়া",
              "two চুপচাপ 0 হয়ে বসে থাকে",
              "SHOW WARNINGS, বা আগে VARCHAR এর Staging Table",
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
                  <a href="https://www.postgresql.org/docs/18/sql-copy.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: COPY
                  </a>
                  : প্রতিটা Option, CSV এর NULL আর Quote এর নিয়ম, Identity Column এর আচরণ, আর ব্যর্থ COPY এর Row কেন জায়গা নেয়, সব এক পাতায়।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/18/app-psql.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: psql
                  </a>
                  : পাতায় \copy খুঁজুন। এক লাইনের নিয়ম, pstdin আর pstdout, আর COPY ... TO STDOUT \g এর কৌশল।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/18/populate.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Populating a Database
                  </a>
                  : বড় Load দ্রুত করার নয়টা পরামর্শ, Index আর Foreign Key পরে যোগ করা থেকে ANALYZE পর্যন্ত।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/18/functions-info.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: System Information Functions
                  </a>
                  : pg_input_is_valid আর তার সঙ্গী pg_input_error_info, যেটা ভুলের বার্তাও ফেরত দেয়।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/18/functions-srf.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Set Returning Functions
                  </a>
                  : generate_series এর সংখ্যা আর তারিখের সব রূপ।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/load-data.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: LOAD DATA
                  </a>
                  : FIELDS আর LINES, LOCAL, IGNORE, @var আর SET, আর secure_file_priv এর নিয়ম।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/select-into.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: SELECT ... INTO
                  </a>
                  : INTO OUTFILE দিয়ে Server এর ফোল্ডারে File লেখা।
                </ListItem>
                <ListItem>
                  <a href="https://en.wikipedia.org/wiki/Comma-separated_values" className={LINK} target="_blank" rel="noopener noreferrer">
                    Wikipedia: Comma-separated values
                  </a>
                  : CSV এর ইতিহাস, RFC 4180, আর কেন বাস্তবের File গুলো এত আলাদা আলাদা।
                </ListItem>
                <ListItem>
                  <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                    আপনার MySQL Course
                  </a>
                  : যে MySQL ভিডিও কোর্সটা আপনি দেখছেন, তার INSERT অংশের পাশে এই লেসনের In MySQL Section রাখুন: অনেক Row ঢোকানোর MySQL পথ
                  সেখানে।
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
      title: <SectionTitle>এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক Row এর জন্য একটা একটা INSERT হলো কাঁধে করে বস্তা বওয়া। COPY হলো Conveyor Belt: একটা Statement, পুরো File। COPY TO যেকোনো
                Query কে File বানায়, COPY FROM File কে Table এ ঢোকায়। CSV এ Quote ছাড়া ফাঁকা মানে NULL আর <code className={CODE}>&quot;&quot;</code>{" "}
                মানে ফাঁকা লেখা, আর অন্যের File এর উপভাষা বুঝতে আছে HEADER, DELIMITER, NULL, FORCE_NULL, DEFAULT আর HEADER MATCH।
              </ContentParagraph>
              <ContentParagraph>
                COPY এর File থাকে Server এর মেশিনে আর লাগে বিশেষ অনুমতি, \copy এর File থাকে যেখানে psql চলছে। একটা খারাপ লাইনে পুরো COPY ব্যর্থ,
                ON_ERROR ignore শুধু Type এর ভুল ফেলে দেয়, আর আসল কাজের নির্ভরযোগ্য পথ হলো সব text এর Staging Table, প্রতিটা লাইনের রায়, ভালো
                লাইন সামনে আর খারাপ লাইন কারণসহ ফেরত। পুরো Load এক Transaction এ, Index পরে, শেষে ANALYZE, আর File থেকে id এলে setval।
              </ContentParagraph>
              <ContentParagraph>
                setval এর কথা দুইবার এলো, কিন্তু ভেতরের গল্পটা বাকি: Identity Column এর নম্বর আসলে কোথা থেকে আসে, ROLLBACK এর পরে কেন সেটা ফেরে
                না, আর কেন Booking এর নম্বরে ফাঁক পড়ে। আর এমন Column যার মান কেউ লেখে না, PostgreSQL নিজে হিসাব করে রাখে। পরের লেসন{" "}
                <Link href="/sql/topic/generated-columns-sequences" className={LINK}>
                  Generated Columns আর Sequences
                </Link>{" "}
                সেই গল্প।
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
      ["COPY FROM", "এক Statement এ পুরো File Table এ", "Agency র আট লাইন: COPY 8"],
      ["COPY TO", "Table বা যেকোনো Query কে File বানায়", "হিসাবরক্ষকের জন্য 8টা Payment, নামসহ"],
      ["FORMAT csv আর HEADER", "কমা দিয়ে আলাদা, প্রথম লাইনে নাম", "reviews এর মন্তব্যের কমা Quote এর ভেতরে"],
      ["CSV এর NULL", "Quote ছাড়া ফাঁকা মানে NULL, \"\" মানে ফাঁকা লেখা", "Tanvir এর phone: 3,Tanvir Ahmed,"],
      ["NULL, FORCE_NULL, FORCE_NOT_NULL", "\"নেই\" কোন লেখায়, আর Quote এর ফাঁকা কী হবে", "NA লেখা Kolkata র File"],
      ["DELIMITER আর HEADER MATCH", "অন্য চিহ্ন দিয়ে আলাদা, আর Header এর নাম মিলিয়ে দেখা", "name বনাম full_name: Error 22P04"],
      ["COPY বনাম \\copy", "COPY এর File Server এর, \\copy এর File psql এর মেশিনের", "Laptop এর File এ COPY: No such file"],
      ["File এর অনুমতি", "Superuser বা pg_read_server_files, pg_write_server_files", "tanim: permission denied to COPY from a file"],
      ["একটা খারাপ লাইন", "পুরো COPY ব্যর্থ, psql এর CONTEXT এ লাইন নম্বর", "line 4, column seats: \"two\""],
      ["ON_ERROR ignore আর REJECT_LIMIT", "Type এর ভুল থাকা লাইন বাদ, সীমার বেশি হলে ব্যর্থ, Constraint এর ভুলে কিছু করে না", "পাঁচটার তিনটা ঢুকল"],
      ["Staging Table", "সব text এ নিয়ে SQL দিয়ে যাচাই, ভালো সামনে, খারাপ Rejects এ", "loaded 4, rejected 4"],
      ["generate_series", "File ছাড়াই অনেক Row বানানো", "পঞ্চাশ হাজার নকল Booking"],
      ["এক Transaction আর setval", "পুরো রাত সব বা কিছুই না, আর File এর id এর পরে Sequence ঠিক করা", "COMMIT লিখলেও উত্তর ROLLBACK; setval এর পরে id 6"],
      ["দ্রুত Load", "COPY, এক Transaction, Index পরে, শেষে ANALYZE", "এক লাখ Row: 9.1 s বনাম 0.08 s"],
      ["MySQL", "LOAD DATA INFILE, secure_file_priv, LOCAL দুই দিকে চালু করতে হয়", "IGNORE আর LOCAL এ two হয়ে যায় 0"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "তানিমের PostgreSQL চলছে Docker এর island-pg Container এ। Laptop এর psql থেকে তিনি লিখলেন COPY bulk_agent_staging FROM '/Users/tanim/Downloads/agent.csv' WITH (FORMAT csv, HEADER)। কী হবে?",
        options: [
          {
            key: "A",
            text: "COPY 8, File টা তো Laptop এ আছে",
            isCorrect: false,
            explanation: "COPY এর File পড়ে Server, নিজের Disk থেকে। Server এর Container এ /Users/tanim বলে কিছু নেই।",
          },
          {
            key: "B",
            text: "Error: could not open file ... No such file or directory, সাথে \\copy ব্যবহারের HINT",
            isCorrect: true,
            explanation: "ঠিক। File টা Client এর মেশিনে, তাই \\copy চাই, যেখানে psql নিজে File পড়ে Connection দিয়ে পাঠায়।",
          },
          {
            key: "C",
            text: "Error: permission denied, কারণ তানিম Superuser না",
            isCorrect: false,
            explanation: "postgres হিসেবে Superuser ই আছেন। সমস্যা অনুমতির না, File টা Server এর মেশিনে নেই।",
          },
          {
            key: "D",
            text: "psql নিজে থেকে \\copy তে বদলে চালিয়ে দেয়",
            isCorrect: false,
            explanation: "psql কখনো COPY কে \\copy বানায় না। শুধু Server এর HINT এ পরামর্শ আসে।",
          },
        ],
      },
      {
        id: 2,
        text: "Default CSV নিয়মে এই দুই লাইন পড়া হলো: Rina,,Dhaka আর Jamal,\"\",Khulna। দুজনের phone কী?",
        options: [
          { key: "A", text: "দুজনেরই NULL", isCorrect: false, explanation: "Quote এর ভেতরে ফাঁকা থাকলে সেটা ফাঁকা লেখা, NULL না। দুটো আলাদা করতে FORCE_NULL লাগে।" },
          { key: "B", text: "দুজনেরই ফাঁকা লেখা ''", isCorrect: false, explanation: "Quote ছাড়া একদম ফাঁকা Field কে PostgreSQL NULL ধরে।" },
          {
            key: "C",
            text: "Rina র NULL, Jamal এর ফাঁকা লেখা ''",
            isCorrect: true,
            explanation: "ঠিক। Docs এর চুক্তি: NULL লেখা হয় Quote ছাড়া, আর NULL এর মতো দেখতে আসল মান লেখা হয় Quote সহ। পড়ার সময়ও তাই।",
          },
          { key: "D", text: "Rina র ফাঁকা লেখা, Jamal এর NULL", isCorrect: false, explanation: "উল্টো।" },
        ],
      },
      {
        id: 3,
        text: "দুই হাজার লাইনের File এর লাইন 1503 এ seats এর জায়গায় two। কোনো Option ছাড়া COPY চালালে Table এ কয়টা Row থাকে?",
        options: [
          { key: "A", text: "1501টা, ভুলের আগে পর্যন্ত", isCorrect: false, explanation: "COPY একটা Statement, ব্যর্থ হলে পুরোটাই বাতিল।" },
          { key: "B", text: "1999টা, শুধু ভুল লাইন বাদ", isCorrect: false, explanation: "এটা হতো ON_ERROR ignore দিলে।" },
          {
            key: "C",
            text: "একটাও না, যদিও আগের লাইনগুলো VACUUM পর্যন্ত Disk এর জায়গা নিয়ে থাকে",
            isCorrect: true,
            explanation: "ঠিক। Docs বলে ব্যর্থ COPY এর ঢোকা Row গুলো Deleted অবস্থায় থাকে, দেখা যায় না কিন্তু জায়গা নেয়।",
          },
          { key: "D", text: "দুই হাজারটাই, two হয়ে যায় 0", isCorrect: false, explanation: "এটা MySQL এর IGNORE বা LOCAL এর আচরণ, PostgreSQL কখনো মান বদলায় না।" },
        ],
      },
      {
        id: 4,
        text: "bulk_seats_rule Table এ CHECK (seats > 0)। File এর একটা লাইনে seats 0। ON_ERROR ignore দিয়ে COPY চালালে?",
        options: [
          { key: "A", text: "ওই লাইন বাদ দিয়ে বাকিগুলো ঢোকে", isCorrect: false, explanation: "ON_ERROR শুধু Type এ রূপান্তরের ভুল ধরে। 0 একটা ঠিকঠাক smallint।" },
          {
            key: "B",
            text: "পুরো COPY ব্যর্থ, Error 23514 check constraint",
            isCorrect: true,
            explanation: "ঠিক। Constraint এর ভুলে ON_ERROR কিছু করে না। এমন ভুল আলাদা করতে Staging Table চাই।",
          },
          { key: "C", text: "0 টা NULL হয়ে ঢোকে", isCorrect: false, explanation: "COPY কখনো নিজে থেকে মান বদলায় না।" },
          { key: "D", text: "NOTICE দিয়ে সব লাইন ঢোকে, CHECK পরে যাচাই হয়", isCorrect: false, explanation: "CHECK প্রতিটা Row ঢোকার সময়ই যাচাই হয়।" },
        ],
      },
      {
        id: 5,
        text: "Staging Table এর সব Column text রাখা হয় কেন?",
        options: [
          { key: "A", text: "text Column এ COPY দ্রুত চলে", isCorrect: false, explanation: "গতি মূল কারণ না।" },
          {
            key: "B",
            text: "যাতে File এ যা ই থাকুক COPY কখনো না আটকায়, তারপর SQL দিয়ে প্রতিটা লাইন যাচাই করে কারণসহ আলাদা করা যায়",
            isCorrect: true,
            explanation: "ঠিক। two বা ফাঁকা লেখাও ঢুকে যায়, তারপর pg_input_is_valid আর JOIN দিয়ে রায়, আর খারাপ লাইনগুলো Rejects এ, লাইন নম্বরসহ।",
          },
          { key: "C", text: "কারণ COPY শুধু text Column এ লিখতে পারে", isCorrect: false, explanation: "COPY যেকোনো Type এ লেখে, ভুল লেখা পেলে থামে।" },
          { key: "D", text: "যাতে আসল Table এর Constraint না লাগে", isCorrect: false, explanation: "আসল Table এর Constraint সবসময় থাকে। Staging শুধু প্রথম ধাপকে নিরাপদ করে।" },
        ],
      },
      {
        id: 6,
        text: "আমাদের Container এ এক লাখ Row Load এর পরীক্ষায় কোনটা সবচেয়ে ধীর ছিল?",
        options: [
          {
            key: "A",
            text: "Autocommit এ একটা একটা INSERT, প্রায় 9 থেকে 10 সেকেন্ড",
            isCorrect: true,
            explanation: "ঠিক। এক লাখ Statement, এক লাখ COMMIT। এক Transaction এ সেটা প্রায় অর্ধেক, ব্যাচ করা INSERT এ 0.23 সেকেন্ড, আর \\copy তে 0.08।",
          },
          { key: "B", text: "\\copy, কারণ Data Connection দিয়ে যায়", isCorrect: false, explanation: "\\copy ছিল সবচেয়ে দ্রুতদের একটা, 0.079 সেকেন্ড।" },
          { key: "C", text: "এক হাজার Row এর INSERT", isCorrect: false, explanation: "0.231 সেকেন্ড, একটা একটার চেয়ে প্রায় চল্লিশ গুণ দ্রুত।" },
          { key: "D", text: "Server এর File থেকে COPY", isCorrect: false, explanation: "0.094 সেকেন্ড, \\copy এর প্রায় সমান।" },
        ],
      },
      {
        id: 7,
        text: "পুরনো System এর গাইডদের id 1 থেকে 5 সহ COPY দিয়ে GENERATED ALWAYS Identity Column এ Load করা হলো। তারপর INSERT INTO bulk_guides_moved (full_name) VALUES ('Mahin Alam')। কী হয়?",
        options: [
          { key: "A", text: "COPY ই ব্যর্থ হয়, ALWAYS Column এ মান দেওয়া যায় না", isCorrect: false, explanation: "Docs বলে COPY FROM সবসময় File এর মান লেখে, OVERRIDING SYSTEM VALUE এর মতো।" },
          { key: "B", text: "Mahin পান id 6", isCorrect: false, explanation: "Sequence জানেই না 1 থেকে 5 নেওয়া হয়ে গেছে।" },
          {
            key: "C",
            text: "Error 23505, Key (guide_id)=(1) already exists",
            isCorrect: true,
            explanation: "ঠিক। Sequence এখনো 1 দেয়। সমাধান Load এর পরে setval(pg_get_serial_sequence('bulk_guides_moved', 'guide_id'), max(guide_id))।",
          },
          { key: "D", text: "Mahin পান id 0", isCorrect: false, explanation: "Identity কখনো 0 দেয় না, প্রথম মান 1।" },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ Strict Mode চালু। LOAD DATA LOCAL INFILE দিয়ে Agency র File আসল SMALLINT seats এর Table এ চালানো হলো। HT-1003 এর two এর কী হয়?",
        options: [
          { key: "A", text: "পুরো LOAD ব্যর্থ, Error 1366", isCorrect: false, explanation: "LOCAL ছাড়া Strict Mode এ তাই হয়। LOCAL এর প্রভাব IGNORE এর মতো।" },
          { key: "B", text: "লাইনটা বাদ পড়ে, PostgreSQL এর ON_ERROR এর মতো", isCorrect: false, explanation: "MySQL লাইন বাদ দেয় না, মান বদলায়।" },
          {
            key: "C",
            text: "Row টা ঢোকে seats 0 নিয়ে, সাথে একটা Warning 1366",
            isCorrect: true,
            explanation: "ঠিক। Docs বলে Server মাঝপথে File পাঠানো থামাতে পারে না, তাই LOCAL মানে IGNORE। আমাদের Container এ: 8 rows affected, 1 warning, seats 0।",
          },
          { key: "D", text: "seats NULL হয়", isCorrect: false, explanation: "Docs অনুযায়ী ভুল মান সবচেয়ে কাছের ঠিক মানে বদলায়, সংখ্যার Column এ 0।" },
        ],
      },
    ],
  },
  assignment: {
    title: "নিজের হাতে File থেকে Database, আর Database থেকে File",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের রিপোর্ট:</strong> নিজের island_tours এ \copy দিয়ে একটা CSV বানান: প্রতিটা Review, Customer এর নাম আর ট্যুরের নামসহ,
        HEADER দিয়ে। File টা Spreadsheet App এ খুলুন। কোন মন্তব্যগুলো Quote এর ভেতরে গেছে আর কেন, দুই লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>অগোছালো File বানানো:</strong> নিজে একটা দশ লাইনের CSV লিখুন, যেখানে অন্তত পাঁচ রকম ভুল আছে: নকল লাইন, ফাঁকা জায়গাওয়ালা Email,
        ভুল তারিখ, অচেনা ট্যুর, সংখ্যার জায়গায় লেখা। এই লেসনের তিন ধাপ দিয়ে Staging, রায় আর Rejects বানান, আর Rejects এর CSV টা নিজের Laptop
        এ \copy দিয়ে বের করুন।
      </span>,
      <span key="3">
        <strong>NULL এর পরীক্ষা:</strong> সেকশন 006 এর চার রকম নিয়মের File টা নিজের psql এ \copy দিয়ে চার Table এ পড়ুন। তারপর পঞ্চম একটা নিয়ম
        যোগ করুন: FORCE_NULL আর FORCE_NOT_NULL একসাথে একই Column এ। Docs এর কথামতো ফলাফল মেলে কিনা, একটা ছকে লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের মেশিনের গতি:</strong> generate_series আর \copy দিয়ে এক লাখ লাইনের একটা CSV আর একটা এক লাখ INSERT এর .sql File বানান।
        তারপর চার উপায়ে মাপুন: psql -f, psql -1 -f, \copy, আর এক হাজার Row এর ব্যাচ। আপনার সংখ্যা এই লেসনের ছকের পাশে বসান।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> গুদাম আর Conveyor Belt এর উদাহরণ দিয়ে COPY কেন দ্রুত, আর COPY আর \copy এর পার্থক্য এমনভাবে
        লিখুন যাতে যিনি কখনো Docker চালাননি তিনিও বোঝেন File টা কোথায় খোঁজা হচ্ছে।
      </span>,
    ],
    deliverables: [
      <span key="d1">Review এর CSV আর Quote নিয়ে দুই লাইনের ব্যাখ্যা</span>,
      <span key="d2">নিজের অগোছালো CSV, তিন ধাপের SQL, আর Rejects এর CSV</span>,
      <span key="d3">পাঁচ নিয়মের NULL ছক</span>,
      <span key="d4">নিজের মেশিনের চার সংখ্যা, লেসনের সংখ্যার পাশে</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ COPY আর \\copy",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রত্যাশিত ফলাফলসহ, File গুলো আপনার নিজের ফোল্ডারে",
    stepName: "DRILL",
    steps: [
      {
        title: "\\copy দিয়ে Export",
        description:
          "একটা ফাঁকা ফোল্ডারে Terminal খুলে সেখান থেকে psql চালু করুন, যাতে File গুলো সেখানেই তৈরি হয়। tours এর CSV বানান, তারপর \\! দিয়ে psql থেকে বের না হয়েই File দেখুন: COPY 9, আর wc -l এ 10 লাইন, Header সহ।",
      },
      {
        title: "Agency র File, Staging এ",
        description:
          "প্রথমে Terminal এ heredoc দিয়ে Agency র File টা হুবহু বানান, wc -l এ 9। তারপর psql এ Staging Table আর \\copy। COPY 8, line_no 2 থেকে 9।",
      },
      {
        title: "প্রতিটা লাইনের রায়",
        description:
          "তৃতীয় File টা psql এর \\i দিয়ে চালান। পাঁচ রকম রায়: ok 4, আর duplicate, seats, unknown customer, unknown departure একটা করে।",
      },
      {
        title: "সরানো, তারপর ROLLBACK",
        description:
          "চতুর্থ File আসল bookings এ চারটা Booking ঢোকায় (25 থেকে 28), Transaction এর ভেতরেই Rejects এর CSV বানায়, তারপর ROLLBACK। bookings আবার 24, কিন্তু CSV টা থেকে যায়, কারণ File লেখা কোনো Transaction এর অংশ না। আসল কাজে ROLLBACK এর জায়গায় COMMIT।",
      },
      {
        title: "ON_ERROR আর LOG_VERBOSITY",
        description:
          "আসল Type এর Table এ প্রথমে সাধারণ \\copy: Error আর CONTEXT এ line 4। তারপর ON_ERROR ignore আর LOG_VERBOSITY verbose: দুটো NOTICE আর COPY 7।",
      },
      {
        title: "বড় Load আর গোছানো",
        description:
          "দুই লাখ Row এর CSV বানিয়ে \\timing দিয়ে \\copy মাপুন, তারপর একই Row INSERT ... SELECT দিয়ে। দুটোই Bulk এর পথ, তাই সময় কাছাকাছি, আমাদের Container এ 256 আর 244 ms। শেষে bulk_ দিয়ে শুরু সব Table সরান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-export.sql",
        code: `\\copy (SELECT tour_id, title, price_bdt FROM tours ORDER BY tour_id) TO 'tours.csv' WITH (FORMAT csv, HEADER)
-- COPY 9

\\! head -3 tours.csv
-- tour_id,title,price_bdt
-- 1,Saint Martin Island Escape,12500.00
-- 2,Cox's Bazar Beach Weekend,8500.00

\\! wc -l tours.csv
-- 10 tours.csv`,
      },
      {
        language: "bash",
        filename: "02-staging.sh, then psql",
        code: DRILL_TWO,
      },
      {
        language: "sql",
        filename: "03-check.sql",
        code: DRILL_THREE,
      },
      {
        language: "sql",
        filename: "04-move.sql",
        code: `BEGIN;

INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
SELECT customer_id, departure_id, seats::smallint, 'pending', amount_bdt::numeric,
       TIMESTAMPTZ '2026-11-01 23:30:00+06'
FROM bulk_agent_checked
WHERE verdict = 'ok'
ORDER BY line_no
RETURNING booking_id, customer_id, departure_id, seats, total_bdt;
-- (4 rows) 25 | 1 | 8 | 2 | 25000.00, 26 | 2 | 10 | 3 | 25500.00,
--          27 | 13 | 11 | 1 | 18000.00, 28 | 15 | 15 | 4 | 14000.00

SELECT count(*) AS bookings_now FROM bookings;
-- (1 row) 28

\\copy (SELECT line_no, agent_ref, verdict AS reason FROM bulk_agent_checked WHERE verdict <> 'ok' ORDER BY line_no) TO 'agent-2026-11-01-rejects.csv' WITH (FORMAT csv, HEADER)
-- COPY 4

ROLLBACK;

SELECT count(*) AS bookings_after_rollback FROM bookings;
-- (1 row) 24

\\! cat agent-2026-11-01-rejects.csv
-- line_no,agent_ref,reason
-- 4,HT-1003,seats is not a number
-- 6,HT-1005,unknown customer
-- 7,HT-1006,unknown departure
-- 8,HT-1002,duplicate of line 3`,
      },
      {
        language: "sql",
        filename: "05-on-error.sql",
        code: `DROP TABLE IF EXISTS bulk_agent_typed;
CREATE TABLE bulk_agent_typed (
  agent_ref      text,
  customer_email text,
  tour_title     text,
  starts_on      date,
  seats          smallint,
  amount_bdt     numeric(10, 2)
);

\\copy bulk_agent_typed FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER)
-- ERROR:  invalid input syntax for type smallint: "two"
-- CONTEXT:  COPY bulk_agent_typed, line 4, column seats: "two"

\\copy bulk_agent_typed FROM 'agent-2026-11-01.csv' WITH (FORMAT csv, HEADER, ON_ERROR ignore, LOG_VERBOSITY verbose)
-- NOTICE:  skipping row due to data type incompatibility at line 4 for column "seats": "two"
-- NOTICE:  1 row was skipped due to data type incompatibility
-- COPY 7

SELECT count(*) AS loaded FROM bulk_agent_typed;
-- (1 row) 7`,
      },
      {
        language: "sql",
        filename: "06-big-load.sql",
        code: `\\timing on
\\copy (SELECT g, 'Customer ' || g, 'user' || g || '@mail.example' FROM generate_series(1, 200000) AS g) TO 'speed.csv' WITH (FORMAT csv)
-- COPY 200000, আমাদের Container এ 55.181 ms

DROP TABLE IF EXISTS bulk_speed;
CREATE TABLE bulk_speed (id integer PRIMARY KEY, full_name text NOT NULL, email text NOT NULL);

\\copy bulk_speed FROM 'speed.csv' WITH (FORMAT csv)
-- COPY 200000, আমাদের Container এ 256.049 ms

TRUNCATE bulk_speed;
INSERT INTO bulk_speed
SELECT g, 'Customer ' || g, 'user' || g || '@mail.example'
FROM generate_series(1, 200000) AS g;
-- INSERT 0 200000, আমাদের Container এ 243.852 ms
\\timing off

DROP TABLE bulk_agent_staging, bulk_agent_checked, bulk_agent_typed, bulk_speed;
SELECT count(*) AS bulk_tables_left
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'bulk\\_%';
-- (1 row) 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        অন্যের পাঠানো File এ প্রথমবার কিছু চালানোর আগে Terminal এ <code className={CODE}>head -5 file.csv</code> আর{" "}
        <code className={CODE}>wc -l file.csv</code> দেখে নেওয়ার অভ্যাস করুন। পাঁচ সেকেন্ডে জানবেন Header আছে কিনা, কোন চিহ্ন দিয়ে আলাদা, আর
        শেষে কয়টা Row মেলাতে হবে। আর আসল Table এ Load সবসময় BEGIN দিয়ে শুরু করুন, সংখ্যা মিললে তবেই COMMIT।
      </ContentParagraph>
    ),
  },
};
