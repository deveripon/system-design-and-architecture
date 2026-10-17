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
  SearchPathLab,
  WhereToPutLab,
} from "../../../components/course/topics/sql-setup/schemas-animations";
import {
  ClusterLevelsDiagram,
  NameLookupDiagram,
  PostgresMysqlLevelsSplit,
} from "../../../components/course/topics/sql-setup/schemas-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

export const databasesSchemasContent: TopicData = {
  id: "databases-schemas",
  introduction: {
    badge: "MODULE 02 · LESSON 05",
    title: <SectionTitle>Server, Database, Schema, Table: ঠিকানার চারটা স্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি নিজের মেশিনে PostgreSQL চালু করেছেন, psql দিয়ে
          Connect করেছেন, আর হয়তো একটা GUI ও খুলে দেখেছেন। এবার একটা প্রশ্ন, যেটা
          প্রায় সবাই প্রথম সপ্তাহে একবার না একবার ঠেকে: Table টা তো আছে, তাহলে
          PostgreSQL বলছে কেন relation does not exist?
        </ContentParagraph>
        <ContentParagraph>
          উত্তর লুকিয়ে আছে একটা ঠিকানার ভেতরে। চিঠির ঠিকানায় যেমন দেশ, শহর, রাস্তা
          আর বাড়ির নম্বর থাকে, PostgreSQL এর প্রতিটা Table এর ঠিকানাতেও চারটা স্তর
          আছে: Server, Database, Schema আর Table। এই লেসনে চারটা স্তর একটা একটা করে
          চিনবেন, প্রতিটা নিজের হাতে বানাবেন আর দেখবেন, আর শিখবেন PostgreSQL একটা
          নাম পেলে কোন ক্রমে কোথায় কোথায় খোঁজে। এর নাম search_path। শেষে MySQL এর
          সাথে একটা বড় পার্থক্যও পরিষ্কার হবে, কারণ MySQL এ Schema শব্দের মানে একদম
          আলাদা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ঠিকানা অসম্পূর্ণ হলে ডাকপিয়ন চিঠি ফেরত দেন, কারণ তিনি জানেন না কোন শহরের কোন রাস্তা। PostgreSQL ও তাই করে। পার্থক্য শুধু এটুকু: সে নিজের একটা তালিকা ধরে কয়েকটা জায়গায় খুঁজে দেখে, তারপর ফেরত দেয়।",
      author: "search_path",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Table আছে, তবু নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এ নতুন যোগ দিয়েছেন নাদিয়া। প্রথম দিন তিনি নিজের Laptop
                এ PostgreSQL চালু করলেন, Sample Database Load করলেন, তারপর Terminal
                খুলে লিখলেন psql। Connect হয়ে গেল। এবার তিনি লিখলেন SELECT * FROM
                tours; আর উত্তর এল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `postgres=# SELECT count(*) FROM tours;
ERROR:  relation "tours" does not exist
LINE 1: SELECT count(*) FROM tours;
                             ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাদিয়া নিশ্চিত, Table টা আছে। তিনি নিজের চোখে Load হতে দেখেছেন। তাহলে
                সমস্যা কোথায়? প্রম্পটের দিকে খেয়াল করুন: postgres=#। নাদিয়া Connect
                হয়েছেন postgres নামের Database এ, আর Table গুলো আছে island_tours নামের
                Database এ। একই Server, কিন্তু আলাদা ঘর। PostgreSQL কোনো ভুল করেনি,
                নাদিয়া ভুল ঘরে দাঁড়িয়ে খুঁজছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                ঠিক একই Error আরেকটা কারণেও আসে, যেটা আরও লুকানো। ধরুন নাদিয়া ঠিক
                Database এই আছেন, কিন্তু একজন সহকর্মী Report এর Table গুলো রেখেছেন
                analytics নামের একটা আলাদা Schema তে। নাদিয়া SELECT * FROM
                daily_revenue লিখলেন, আর আবার সেই একই Error। এবার Database ঠিক, কিন্তু
                PostgreSQL যে তালিকা ধরে Table খোঁজে, analytics সেই তালিকায় নেই।
              </ContentParagraph>
              <ContentParagraph>
                দুটো সমস্যাই আসলে একটা জিনিস না জানার ফল: PostgreSQL এর ভেতরে একটা
                Table এর পুরো ঠিকানা কী, আর ঠিকানার কোন অংশ না লিখলে PostgreSQL নিজে কী
                ধরে নেয়। এই লেসনের শেষে এই Error দেখলে আপনি দশ সেকেন্ডে বলে দিতে
                পারবেন সমস্যাটা কোন স্তরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Relation মানে এখানে Table",
          content: (
            <ContentParagraph>
              Error এ relation শব্দটা দেখে ভয় পাবেন না। Module 01 এর Relational
              Model লেসনে দেখেছেন, Relation হলো Table এর গাণিতিক নাম। PostgreSQL এর
              Error Message এ relation বললে Table, View বা এরকম Table এর মতো যেকোনো
              জিনিস বোঝায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "four-levels",
      subHeader: { index: "002", title: "Four Levels" },
      title: <SectionTitle>দালান, অফিস, আলমারি, ড্রয়ার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এর{" "}
                <Link href="/sql/topic/what-is-a-database" className={LINK}>
                  What a Database and a DBMS Are
                </Link>{" "}
                লেসনে একটা ছবি ছিল: মেশিন একটা দালান, তার ভেতরে 5432 নম্বর দরজার একটা
                অফিস, মানে চালু PostgreSQL, আর অফিসের ভেতরে নাম লেখা কয়েকটা আলমারি,
                প্রতিটা একটা Database। আজ সেই ছবিতে আরও একটা স্তর যোগ হচ্ছে। প্রতিটা
                আলমারির ভেতরে কয়েকটা ড্রয়ার থাকে, আর ড্রয়ারের ভেতরে থাকে আসল ফাইল।
                ড্রয়ার হলো Schema, ফাইল হলো Table।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server (Cluster):</strong> একটা চালু PostgreSQL, যার নিজের
                  Data Directory আর নিজের Port আছে। PostgreSQL এর Docs এটাকে Database
                  Cluster বলে।
                </ListItem>
                <ListItem>
                  <strong>Database:</strong> Server এর ভেতরে একটা নাম দেওয়া, অন্যদের
                  থেকে বন্ধ ঘর। যেমন island_tours। Connect করার সময় আপনি একটা
                  Database বেছে নেন, আর পুরো Connection সেই Database এর ভেতরেই থাকে।
                </ListItem>
                <ListItem>
                  <strong>Schema:</strong> একটা Database এর ভেতরে নামের একটা ভাগ,
                  ড্রয়ারের মতো। একই Database এ public, analytics, audit এর মতো কয়েকটা
                  Schema থাকতে পারে, আর দুটো আলাদা Schema তে একই নামের Table থাকতে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>Table:</strong> যেটা আপনি Module 01 থেকে চেনেন। Row আর
                  Column এর সেই তালিকা, যেমন tours বা bookings।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ClusterLevelsDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["স্তর", "উপমা", "উদাহরণ", "psql এ দেখার উপায়", "SQL এ দেখার উপায়"],
          rows: [
            ["Server (Cluster)", "দালানের ভেতরে 5432 নম্বর অফিস", "localhost:5432", "psql --version, SELECT version();", "SHOW port;"],
            ["Database", "অফিসের একটা আলমারি", "island_tours", "\\l", "SELECT datname FROM pg_database;"],
            ["Schema", "আলমারির একটা ড্রয়ার", "public, analytics", "\\dn", "SELECT schema_name FROM information_schema.schemata;"],
            ["Table", "ড্রয়ারের একটা ফাইল", "tours, bookings", "\\dt", "SELECT table_name FROM information_schema.tables;"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা Table এর পুরো ঠিকানা",
          content: (
            <ContentParagraph>
              চার স্তর মিলিয়ে একটা Table এর পুরো ঠিকানা দাঁড়ায় এরকম: localhost এর
              5432 Port এর Server, তার island_tours Database, তার public Schema, তার
              tours Table। Connection এর সময় প্রথম দুটো ঠিক হয়ে যায়। Query তে আপনি
              সাধারণত শুধু শেষেরটা লেখেন, tours। মাঝখানের Schema টা PostgreSQL নিজে
              খুঁজে নেয়। এই খুঁজে নেওয়াটাই আজকের লেসনের সবচেয়ে জরুরি অংশ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "cluster",
      subHeader: { index: "003", title: "The Cluster" },
      title: <SectionTitle>Cluster মানে অনেক মেশিন না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Cluster শব্দটা শুনলে অনেকের মাথায় ভেসে ওঠে একসারি Server, একে অপরের
                সাথে জোড়া। PostgreSQL এর ভাষায় শব্দটার মানে অনেক সাধারণ। PostgreSQL
                এর Docs বলে, Database Cluster হলো এমন কয়েকটা Database এর সংগ্রহ, যা
                একটাই চালু Server সামলায়। মানে আপনার Laptop এ একটা PostgreSQL চলছে,
                সেটাই একটা Cluster। এর নিজের একটা Data Directory থাকে, মানে Disk এর যে
                Folder এ সব Data জমা হয়, আর নিজের একটা Port।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL প্রথমবার চালু করার আগে এই Data Directory তৈরি করতে হয়।
                কাজটা করে initdb নামের একটা Program। ইনস্টলার, Homebrew বা Docker
                Image সাধারণত আপনার হয়ে এটা চালিয়ে দেয়, তাই আপনি হয়তো কখনো নামটাও
                দেখেননি। initdb তিনটা Database বানিয়ে রাখে: postgres, template1 আর
                template0। একটা নতুন Docker Container এ \l চালালে ঠিক এই তিনটাই দেখবেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, নতুন postgres:18 Container এ",
          code: `postgres=# \\l
                                                    List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+--------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 template0 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
           |          |          |                 |            |            |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
           |          |          |                 |            |            |        |           | postgres=CTc/postgres
(3 rows)

postgres=# SHOW data_directory;
        data_directory
-------------------------------
 /var/lib/postgresql/18/docker
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Table টা চওড়া, ঘাবড়াবেন না। আপাতত শুধু প্রথম Column, Name, দেখুন।
                Encoding আর Collate কলামের মানে Module 09 এর Text Types লেসনে আসবে।
                Data Directory এর পথটা আপনার মেশিনে অন্যরকম হবে। যেমন Apple Silicon
                Mac এ Homebrew এর postgresql@18 রাখে /opt/homebrew/var/postgresql@18
                এ। ঠিক পথ জানতে নিজের Server কে SHOW data_directory জিজ্ঞেস করুন,
                অনুমান করবেন না।
              </ContentParagraph>
              <ContentParagraph>
                postgres Database টা কারো ব্যক্তিগত না। Docs অনুযায়ী এটা রাখা হয়
                Tool আর অন্য Program গুলোর জন্য, যারা ধরে নেয় এই নামের একটা Database
                সবসময় থাকবে। আপনার নিজের Table এখানে না রেখে নিজের নামে আলাদা Database
                বানানো ভালো অভ্যাস। নাদিয়ার গল্পে ঠিক এই postgres এই তিনি আটকে
                ছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস Cluster এর স্তরে থাকে, কোনো একটা Database এর ভেতরে না:
                Role, মানে কে Login করতে পারবেন। postgres নামের যে Superuser দিয়ে আপনি
                Connect করেন, তিনি একটাই, আর তিনি সব Database এ চেনা। Role আর
                Permission এর পুরো গল্প Module 16 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দুই রকম Cluster, গুলিয়ে ফেলবেন না",
          content: (
            <ContentParagraph>
              Kubernetes বা High Availability এর আলোচনায় Cluster মানে অনেকগুলো মেশিন
              মিলে একটা দল। PostgreSQL এর Database Cluster মানে একটা চালু Server আর
              তার Data Directory। কেউ বললেন আমাদের দুটো PostgreSQL Cluster আছে, মানে
              দুটো আলাদা চালু Server, হয়তো একই মেশিনে দুটো আলাদা Port এ। এটা
              Replication এর Cluster না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "databases",
      subHeader: { index: "004", title: "Databases" },
      title: <SectionTitle>Database: বন্ধ দরজার আলাদা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন Database বানানোর দুটো উপায়, ফল একই। psql এর ভেতর থেকে SQL দিয়ে,
                অথবা Terminal থেকে createdb নামের ছোট Program দিয়ে। createdb আসলে
                ভেতরে ভেতরে ঠিক ওই একই CREATE DATABASE পাঠায়। আপনার মেশিনে PostgreSQL
                কীভাবে বসিয়েছেন তার উপর নির্ভর করে নিচের কোন লাইনটা চালাবেন। Docker
                এ চালালে Container এর ভেতরে চালাতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `# psql এর ভেতরে, SQL দিয়ে
CREATE DATABASE my_tours;

# Terminal থেকে, নিজের মেশিনে PostgreSQL থাকলে
createdb my_tours

# Docker এ, island-pg Container এর ভেতরে
docker exec island-pg createdb -U postgres my_tours

# একই নাম দ্বিতীয়বার দিলে
createdb: error: database creation failed: ERROR:  database "my_tours" already exists`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সফল হলে createdb কিছুই লেখে না। Terminal এ চুপচাপ পরের লাইন চলে আসা
                মানেই কাজ হয়েছে। এবার সবচেয়ে জরুরি নিয়মটা, যেটা PostgreSQL এর Docs এ
                সোজা লেখা: Connect করার সময় একটা Database এর নাম দিতেই হয়, আর একটা
                Connection একসাথে একটার বেশি Database দেখতে পারে না। Database বদলাতে
                হলে নতুন করে Connect করতে হয়। psql এ এর ছোট উপায় \c:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `postgres=# SELECT count(*) FROM tours;
ERROR:  relation "tours" does not exist
LINE 1: SELECT count(*) FROM tours;
                             ^
postgres=# \\c island_tours
You are now connected to database "island_tours" as user "postgres".
island_tours=# SELECT current_database(), current_user, current_schema();
 current_database | current_user | current_schema
------------------+--------------+----------------
 island_tours     | postgres     | public
(1 row)

island_tours=# SELECT count(*) FROM tours;
 count
-------
     9
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রম্পটের প্রথম শব্দটা সবসময় বলে দেয় আপনি কোন Database এ আছেন।
                postgres=# থেকে island_tours=# এ বদলে যাওয়া মানে আলমারি বদলেছে। এই
                অভ্যাসটা গড়ে তুলুন: কোনো Error এ থমকে গেলে প্রথমে প্রম্পট দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                দুটো Database একে অপরকে কতটা দেখে না, সেটা নিজের চোখে দেখুন। island_tours
                এ বসে my_tours এর একটা Table পড়ার চেষ্টা করলে PostgreSQL সাফ মানা করে
                দেয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# SELECT count(*) FROM my_tours.public.tours;
ERROR:  cross-database references are not implemented: "my_tours.public.tours"
LINE 1: SELECT count(*) FROM my_tours.public.tours;
                             ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই দেয়ালটা ইচ্ছা করে রাখা। আলাদা Database মানে আলাদা অ্যাপ, আলাদা
                Test, আলাদা দায়িত্ব। একটার Table অন্যটার Query তে ঢুকে পড়ার সুযোগ না
                থাকাই নিরাপদ। দুটো Database এর Data একসাথে লাগলে হয় একই Database এ
                রাখতে হয়, নয়তো App থেকে দুটো আলাদা Connection খুলে মেলাতে হয়।
                PostgreSQL এর কিছু Extension দিয়ে এই দেয়াল পার হওয়া যায়, কিন্তু সেটা
                অনেক পরের বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                Database মোছার নিয়মও একই যুক্তি মানে। যে Database এ আপনি নিজে দাঁড়িয়ে
                আছেন, সেটা মোছা যায় না। আগে অন্য Database এ সরে যেতে হয়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `my_tours=# DROP DATABASE my_tours;
ERROR:  cannot drop the currently open database
my_tours=# \\c postgres
You are now connected to database "postgres" as user "postgres".
postgres=# DROP DATABASE my_tours;
DROP DATABASE`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DROP DATABASE কোনো প্রশ্ন করে না",
          content: (
            <ContentParagraph>
              DROP DATABASE এর পর কোনো আপনি কি নিশ্চিত প্রশ্ন আসে না, আর কোনো
              Recycle Bin নেই। পুরো আলমারি, ভেতরের সব ড্রয়ার আর সব ফাইলসহ, এক লাইনে
              চলে যায়। নিজের Laptop এ শেখার Database এ ভয় নেই, কারণ Sample Database
              আবার Load করা যায়। কিন্তু কোনো দিন কোনো চালু Server এ এই লাইন লেখার
              আগে প্রম্পটে Server আর Database এর নাম দুইবার পড়ে নেবেন। Backup এর গল্প
              Module 18 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "templates",
      subHeader: { index: "005", title: "Templates" },
      title: <SectionTitle>নতুন Database আসলে একটা Copy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                template1 আর template0 নাম দুটো একটা মজার সত্য লুকিয়ে রাখে। PostgreSQL
                এর Docs বলে, CREATE DATABASE আসলে শূন্য থেকে কিছু বানায় না, একটা
                বিদ্যমান Database কে Copy করে। কিছু না বললে সে Copy করে template1 কে।
                মানে template1 হলো নতুন প্রতিটা Database এর ছাঁচ। ছাঁচে কিছু রাখলে
                তারপর থেকে বানানো প্রতিটা Database এ সেটা চলে আসবে। নিজের চোখে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `template1=# CREATE TABLE house_rules (rule text);
CREATE TABLE
template1=# INSERT INTO house_rules VALUES ('Every table needs a primary key');
INSERT 0 1
template1=# \\c postgres
postgres=# CREATE DATABASE seagull_tours;
CREATE DATABASE
postgres=# \\c seagull_tours
seagull_tours=# SELECT * FROM house_rules;
              rule
---------------------------------
 Every table needs a primary key
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                seagull_tours এ কেউ house_rules বানায়নি, তবু সেটা আছে, কারণ নতুন
                Database টা template1 এর Copy। বাস্তবে কেউ কেউ এভাবে প্রতিটা নতুন
                Database এ একই Extension বা একই Function আগে থেকে রেখে দেন। শেখার সময়
                অবশ্য উল্টো পরামর্শটাই কাজের: template1 এ হাত দেবেন না। ভুল করে সেখানে
                Table বানিয়ে ফেললে তারপর থেকে প্রতিটা নতুন Database সেই আবর্জনা নিয়ে
                জন্মাবে। পরীক্ষা শেষে উপরের house_rules টা template1 থেকে মুছে ফেলা
                হয়েছিল।
              </ContentParagraph>
              <ContentParagraph>
                template0 হলো একদম আসল, কখনো না বদলানো ছাঁচ। template1 কোনো কারণে
                নোংরা হয়ে গেলে, বা নতুন Database এর Encoding বা Locale আলাদা হতে হলে,
                লেখা হয় CREATE DATABASE নাম TEMPLATE template0। এই খুঁটিনাটি এখন মুখস্থ
                করার দরকার নেই, শুধু মনে রাখুন \l এ এই দুটো নাম কেন দেখেন, আর এ দুটো
                মুছবেন না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "schemas",
      subHeader: { index: "006", title: "Schemas" },
      title: <SectionTitle>Schema: একই আলমারিতে আলাদা ড্রয়ার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আলমারির ভেতরে ঢুকি। Schema হলো একটা Database এর ভেতরে নামের একটা
                আলাদা জায়গা। প্রোগ্রামিং এর ভাষায় একে বলে Namespace, মানে এমন একটা
                সীমানা যার ভেতরে নামগুলো আলাদা থাকে। দুটো ভিন্ন ড্রয়ারে একই নামের দুটো
                ফাইল রাখলে কোনো ঝামেলা নেই, কারণ ড্রয়ারের নাম দিয়ে আলাদা করা যায়।
                একইভাবে public.tours আর analytics.tours দুটো সম্পূর্ণ আলাদা Table।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা নতুন Database এ public নামের একটা Schema আগে থেকেই থাকে। আপনি
                এখন পর্যন্ত যত Table বানিয়েছেন বা Load করেছেন, Schema এর নাম না বলায়
                সবগুলো গিয়ে বসেছে public এ। Sample Database এর আটটা Table ও public
                এ। নতুন Schema বানানো এক লাইনের কাজ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, island_tours এ",
          code: `island_tours=# \\dn
      List of schemas
  Name  |       Owner
--------+-------------------
 public | pg_database_owner
(1 row)

island_tours=# CREATE SCHEMA analytics;
CREATE SCHEMA
island_tours=# CREATE TABLE analytics.tours (tour_id integer, title text, bookings integer);
CREATE TABLE
island_tours=# INSERT INTO analytics.tours VALUES (1, 'summary row', 6);
INSERT 0 1
island_tours=# \\dn
        List of schemas
   Name    |       Owner
-----------+-------------------
 analytics | postgres
 public    | pg_database_owner
(2 rows)

island_tours=# SELECT count(*) FROM tours;
 count
-------
     9
(1 row)

island_tours=# SELECT count(*) FROM analytics.tours;
 count
-------
     1
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই নাম tours, দুটো আলাদা উত্তর: ৯ আর ১। Schema এর নাম না লেখা
                tours গিয়ে পড়েছে public এর Table এ, আর analytics.tours পড়েছে নতুন
                Table টা। কেন শুধু tours লিখলে public ই বেছে নেওয়া হলো, সেটা আসছে দুই
                Section পরে, search_path এ।
              </ContentParagraph>
              <ContentParagraph>
                public ছাড়াও প্রতিটা Database এ কয়েকটা Schema থাকে, যেগুলো PostgreSQL
                নিজের কাজে রাখে। pg_catalog এ থাকে PostgreSQL এর নিজের খাতা: কোন Table
                আছে, কোন Column আছে, কোন Function আছে। now() বা count() এর মতো Function
                ও এখানে থাকে। information_schema হলো SQL Standard মেনে বানানো একই
                তথ্যের আরেকটা জানালা, যেটা অন্য Database এও প্রায় একই রকম। pg_toast এ
                থাকে খুব বড় মানগুলোর টুকরো। এগুলোতে আপনি হাত দেবেন না, কিন্তু নাম দেখে
                চমকেও যাবেন না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "\\dn দেখায় শুধু আপনার Schema",
          content: (
            <ContentParagraph>
              psql এর \dn শুধু সাধারণ Schema গুলো দেখায়, pg_catalog বা
              information_schema এর মতো নিজস্বগুলো লুকিয়ে রাখে। সব দেখতে চাইলে \dnS
              লিখুন। আর \dn+ দিলে প্রতিটা Schema এর Permission আর বর্ণনাও আসে। psql এর
              পুরো অভ্যাস{" "}
              <Link href="/sql/topic/psql-basics" className={LINK}>
                psql: The Command-line Client
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "qualified-names",
      subHeader: { index: "007", title: "Qualified Names" },
      title: <SectionTitle>পুরো নাম লেখা: schema.table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Schema এর নাম আর Table এর নাম মাঝে একটা বিন্দু দিয়ে লিখলে তাকে বলে
                Qualified Name, মানে পূর্ণ নাম। public.tours, analytics.tours,
                audit.audit_log। পূর্ণ নাম লিখলে PostgreSQL আর কিছু অনুমান করে না, সোজা
                সেই Schema তে যায়। কোনো Query তে কোন Table পড়া হচ্ছে তা নিয়ে সন্দেহ
                থাকলে পূর্ণ নাম লেখাই সবচেয়ে নিরাপদ।
              </ContentParagraph>
              <ContentParagraph>
                চাইলে Database এর নামসহ তিন অংশে লেখা যায়, যেমন
                island_tours.public.tours। কিন্তু এটা শুধু তখনই চলে, যখন প্রথম অংশটা
                আপনার বর্তমান Database এর নামই। অন্য কোনো Database এর নাম দিলে আগের
                Section এর cross-database Error আসে। তাই বাস্তবে এই তিন অংশের রূপ খুব
                কম দেখবেন, দুই অংশের schema.table ই যথেষ্ট।
              </ContentParagraph>
              <ContentParagraph>
                নাম লেখায় আরেকটা নিয়ম আছে, যেটা না জানলে অদ্ভুত Error আসে। PostgreSQL
                Double Quote ছাড়া লেখা সব নাম ছোট হাতের অক্ষরে বদলে নেয়। TOURS, Tours
                আর tours, তিনটাই আসলে tours। কিন্তু Double Quote দিলে নামটা হুবহু রাখা
                হয়, বড় হাতের অক্ষরসহ। একটা পরীক্ষা দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# CREATE TABLE "Tours" (id int);
CREATE TABLE
island_tours=# SELECT count(*) FROM Tours;
 count
-------
     9
(1 row)

island_tours=# SELECT count(*) FROM "Tours";
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
                Tours লিখলে PostgreSQL পড়েছে tours, মানে Island Tours এর ৯টা ট্যুর।
                আর &quot;Tours&quot; লিখলে পড়েছে বড় T ওয়ালা নতুন খালি Table টা।
                দুটো আলাদা Table, প্রায় একই নামে। এই কারণেই PostgreSQL এর জগতে সবাই
                Schema, Table আর Column এর নাম ছোট হাতের অক্ষরে আর Underscore দিয়ে
                লেখেন, যেমন daily_revenue। তাহলে কখনো Quote লাগে না, আর কোনো বিভ্রান্তিও
                থাকে না। নাম রাখার পুরো নিয়ম Module 09 এর CREATE TABLE লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "search-path",
      subHeader: { index: "008", title: "search_path" },
      title: <SectionTitle>search_path: PostgreSQL কোন ক্রমে খোঁজে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল প্রশ্ন। শুধু tours লিখলে PostgreSQL কীভাবে ঠিক করে কোন Schema
                এর tours? উত্তর একটা Setting, যার নাম search_path। এটা Schema এর নামের
                একটা তালিকা। Schema এর নাম ছাড়া কোনো নাম পেলে PostgreSQL এই তালিকা ধরে
                বাম থেকে ডানে একটা একটা Schema এ খোঁজে, আর প্রথম যেখানে নামটা পায়,
                সেখানেই থামে। কোথাও না পেলে আসে relation does not exist।
              </ContentParagraph>
              <ContentParagraph>
                একটা সাধারণ PostgreSQL Server এ search_path এর শুরুর মান দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# SHOW search_path;
   search_path
-----------------
 "$user", public
(1 row)

island_tours=# SELECT current_schemas(true);
   current_schemas
---------------------
 {pg_catalog,public}
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকার প্রথম নাম &quot;$user&quot; একটা বিশেষ শব্দ। এর মানে, আপনি
                যে User হিসেবে Connect করেছেন, ঠিক সেই নামের একটা Schema। আপনি postgres
                হিসেবে Connect করলে &quot;$user&quot; মানে postgres নামের Schema। সেরকম
                কোনো Schema সাধারণত থাকে না, আর PostgreSQL এর Docs বলে, যে Schema নেই
                বা যেখানে আপনার ঢোকার অনুমতি নেই, তালিকা থেকে সেটা চুপচাপ বাদ পড়ে।
                তাই কার্যত খোঁজা হয় শুধু public এ।
              </ContentParagraph>
              <ContentParagraph>
                current_schemas(true) দেখায় আসলে কোন কোন Schema খোঁজা হচ্ছে। সেখানে
                &quot;$user&quot; নেই, কারণ সেটা বাদ পড়েছে, আর সামনে একটা বাড়তি নাম
                আছে: pg_catalog। Docs অনুযায়ী pg_catalog সবসময় খোঁজা হয়, তালিকায়
                লেখা না থাকলেও, আর না লেখা থাকলে সবার আগে। এজন্যই আপনি কোনো Schema না
                লিখেই count() বা now() ডাকতে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NameLookupDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির দ্বিতীয় সারিটাই বিপদের জায়গা। analytics কে তালিকার প্রথমে রাখলে
                একই SELECT * FROM tours হঠাৎ analytics.tours পড়ে, কোনো Error ছাড়া।
                আসল ৯টা ট্যুর তখনো আছে, শুধু আড়ালে চলে গেছে। psql এর \dt ও তখন আসলটা
                দেখায় না, কারণ \dt শুধু সেই Table গুলো দেখায় যেগুলো Schema এর নাম ছাড়া
                লিখলে পাওয়া যায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql",
          code: `island_tours=# SET search_path TO analytics, public;
SET
island_tours=# SELECT count(*) FROM tours;
 count
-------
     1
(1 row)

island_tours=# \\dt
                List of tables
  Schema   |     Name      | Type  |  Owner
-----------+---------------+-------+----------
 analytics | daily_revenue | table | postgres
 analytics | tours         | table | postgres
 public    | bookings      | table | postgres
 public    | customers     | table | postgres
 public    | departures    | table | postgres
 public    | destinations  | table | postgres
 public    | guides        | table | postgres
 public    | payments      | table | postgres
 public    | reviews       | table | postgres
(9 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকায় public এর আটটার মধ্যে সাতটা Table আছে। public.tours নেই, কারণ
                নামটা analytics.tours ঢেকে দিয়েছে। এখানে একটা জিনিস খেয়াল করুন: তালিকায়
                daily_revenue ও আছে। এটা analytics এ বানানো হয়েছিল ঠিক এই search_path
                থাকা অবস্থায়, CREATE TABLE daily_revenue লিখে, Schema এর নাম ছাড়া।
                Docs এর নিয়ম: Schema না বললে নতুন জিনিস তৈরি হয় search_path এর প্রথম
                বৈধ Schema তে। তালিকার ক্রম তাই শুধু পড়া না, লেখার জায়গাও ঠিক করে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ ক্রম আর নাম বদলে বদলে নিজে দেখুন কোন Table পাওয়া যায়, কখন
                Error আসে, আর নতুন Table কোথায় গিয়ে বসবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SearchPathLab /> },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "changing-search-path",
      subHeader: { index: "009", title: "Changing search_path" },
      title: <SectionTitle>search_path বদলানোর পাঁচটা জায়গা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                search_path বদলানো যায় কয়েকটা স্তরে, আর কোনটা কতক্ষণ টেকে সেটা জানা
                জরুরি। সবচেয়ে ছোট স্তর হলো SET, যেটা শুধু এই Connection এর জন্য।
                psql বন্ধ করে আবার খুললে সেটা আর থাকে না। RESET search_path দিয়ে
                Connection এর মাঝখানেই আগের মানে ফেরা যায়।
              </ContentParagraph>
              <ContentParagraph>
                স্থায়ীভাবে রাখতে চাইলে Database বা Role এর গায়ে লিখে দেওয়া যায়। তখন
                প্রতিটা নতুন Connection শুরুতেই সেই মান পায়। নিচের পরীক্ষায় island_tours
                Database এর জন্য একটা মান আর app_user নামের Role এর জন্য আরেকটা মান
                রাখা হয়েছে, তারপর দুজন আলাদা করে নতুন Connection খুলেছেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, postgres হিসেবে",
          code: `island_tours=# ALTER DATABASE island_tours SET search_path = public, analytics;
ALTER DATABASE
island_tours=# ALTER ROLE app_user SET search_path = audit, public;
ALTER ROLE

-- নতুন Connection, postgres হিসেবে
island_tours=# SHOW search_path;
    search_path
-------------------
 public, analytics
(1 row)

-- নতুন Connection, app_user হিসেবে
island_tours=> SHOW search_path;
  search_path
---------------
 audit, public
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                postgres পেলেন Database এর মান, কারণ তাঁর Role এ আলাদা কিছু লেখা নেই।
                app_user পেলেন নিজের Role এর মান, Database এর মান তাঁর বেলায় চাপা পড়ে
                গেছে। প্রম্পটের শেষে =# আর =&gt; এর পার্থক্যও খেয়াল করুন: # মানে আপনি
                Superuser, &gt; মানে সাধারণ User। কোন Setting কাকে হারায়, তার পুরো
                ক্রম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কোথায় লেখা", "উদাহরণ", "কতক্ষণ টেকে", "কাকে হারায়"],
          rows: [
            ["এই Connection এ SET", "SET search_path TO analytics, public;", "Connection বন্ধ বা RESET পর্যন্ত", "নিচের সবাইকে"],
            ["একটা Role, একটা Database এ", "ALTER ROLE app_user IN DATABASE island_tours SET search_path = ...;", "স্থায়ী, পরের Login থেকে", "শুধু Role বা শুধু Database এর মানকে"],
            ["শুধু Role", "ALTER ROLE app_user SET search_path = audit, public;", "স্থায়ী, পরের Login থেকে", "Database আর Server এর মানকে"],
            ["শুধু Database", "ALTER DATABASE island_tours SET search_path = public, analytics;", "স্থায়ী, পরের Connection থেকে", "Server এর মানকে"],
            ["পুরো Server", "postgresql.conf এর search_path", "Server Reload এর পর থেকে", "কাউকে না, এটাই শুরুর মান"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "অন্যরা লিখতে পারেন এমন Schema তালিকার সামনে রাখবেন না",
          content: (
            <ContentParagraph>
              search_path এর সামনের দিকের কোনো Schema তে যদি অন্য কেউ Table বা Function
              বানাতে পারেন, তাহলে তিনি আপনার পরিচিত নামের একটা নকল জিনিস সেখানে রেখে
              দিতে পারেন, আর আপনার Query টের না পেয়েই সেটা ব্যবহার করবে। PostgreSQL এর
              Docs তাই নিরাপদ নিয়ম সুপারিশ করে: যে Schema এ যে কেউ লিখতে পারেন, সেটা
              তালিকা থেকে বাদ দিন, নয়তো পূর্ণ নাম লিখুন। পরের Section এর PostgreSQL 15
              এর পরিবর্তনটা ঠিক এই বিপদ কমানোর জন্যই এসেছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "public-schema",
      subHeader: { index: "010", title: "public and PostgreSQL 15" },
      title: <SectionTitle>public এ সবাই লিখতে পারেন না, PostgreSQL 15 থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরনো Tutorial আর Stack Overflow এর অনেক উত্তর ধরে নেয়, যেকোনো User
                public Schema তে Table বানাতে পারেন। PostgreSQL 14 পর্যন্ত সেটাই
                সত্যি ছিল। PostgreSQL 15 এর Release Notes এ লেখা আছে, public Schema তে
                সবার Table বানানোর অনুমতি তুলে নেওয়া হয়েছে। এখন public এর মালিক
                pg_database_owner, মানে যিনি Database টার মালিক, আর বাকিরা শুধু ভেতরের
                জিনিস ব্যবহার করতে পারেন, নতুন কিছু বানাতে না। নতুন একটা সাধারণ Role
                দিয়ে চেষ্টা করলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, PostgreSQL 18",
          code: `island_tours=# CREATE ROLE app_user LOGIN;
CREATE ROLE
island_tours=# SET ROLE app_user;
SET
island_tours=> CREATE TABLE public.notes (id int);
ERROR:  permission denied for schema public
LINE 1: CREATE TABLE public.notes (id int);
                     ^
island_tours=> RESET ROLE;
RESET
island_tours=# GRANT CREATE ON SCHEMA public TO app_user;
GRANT
island_tours=# SET ROLE app_user;
SET
island_tours=> CREATE TABLE public.notes (id int);
CREATE TABLE`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SET ROLE দিয়ে postgres কিছুক্ষণের জন্য app_user এর জুতায় পা দিয়েছেন,
                আর RESET ROLE দিয়ে ফিরে এসেছেন। প্রম্পট # থেকে &gt; হয়ে আবার # হওয়াটা
                খেয়াল করুন। এই Error এর দুটো সঠিক সমাধান আছে। এক, যাঁর দরকার তাঁকে
                public এ CREATE এর অনুমতি দেওয়া, যেমন উপরে GRANT দিয়ে করা হলো। দুই,
                তাঁর নিজের একটা Schema বানিয়ে দেওয়া, যার মালিক তিনি নিজেই: CREATE
                SCHEMA audit AUTHORIZATION app_user। নিজের নামের Schema হলে
                &quot;$user&quot; ও তখন কাজে লাগে, কারণ app_user নামের Schema থাকলে
                তাঁর search_path এর প্রথম জায়গাটা সেটাই।
              </ContentParagraph>
              <ContentParagraph>
                Release Notes এ আরেকটা জরুরি লাইন আছে: পুরনো Version থেকে Upgrade করা
                বা পুরনো Dump থেকে Restore করা Database এ public এর পুরনো Permission
                থেকে যায়। তাই একই PostgreSQL 18 এ একটা Database এ নতুন নিয়ম, আরেকটায়
                পুরনো নিয়ম দেখতে পারেন। সন্দেহ হলে \dn+ দিয়ে public এর Access
                privileges দেখে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Superuser হিসেবে শিখছেন? তাহলে এই Error দেখবেন না",
          content: (
            <ContentParagraph>
              নিজের Laptop এ আপনি সাধারণত postgres হিসেবে, মানে Superuser হিসেবে কাজ
              করেন। Superuser এর জন্য কোনো Permission এর বাধা নেই, তাই এই Error আপনি
              প্রথম দেখবেন কোনো চালু Server এ, যখন App একটা সাধারণ Role দিয়ে Connect
              করবে। তখন এই Section টা মনে পড়লেই চলবে। Role আর GRANT এর পুরো পাঠ{" "}
              <Link href="/sql/topic/roles-and-grants" className={LINK}>
                Module 16
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "why-schemas",
      subHeader: { index: "011", title: "Why Teams Add Schemas" },
      title: <SectionTitle>কখন নতুন Schema, কখন নতুন Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছোট একটা অ্যাপের পুরো জীবন শুধু public Schema তেই কেটে যেতে পারে, আর
                তাতে কোনো দোষ নেই। কিন্তু Database বড় হলে দলগুলো কয়েকটা চেনা কারণে
                নতুন Schema যোগ করে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>analytics বা reporting:</strong> Report এর জন্য হিসাব করে রাখা
                  Table আর View। একই Data থেকে তৈরি বলে একই Database এ থাকে, কিন্তু
                  App এর Table এর ভিড়ে মিশে যায় না, আর Report এর লোকজনকে শুধু এই
                  Schema তে অনুমতি দেওয়া যায়।
                </ListItem>
                <ListItem>
                  <strong>audit:</strong> কে কখন কী বদলেছেন তার ইতিহাস। App এর Role যেন
                  এখানে লিখতে পারে কিন্তু মুছতে না পারে, এমন Permission Schema ধরে দেওয়া
                  সহজ। এই Audit Log আপনি Module 14 এ নিজে হাতে বানাবেন।
                </ListItem>
                <ListItem>
                  <strong>staging বা import:</strong> বাইরে থেকে আসা কাঁচা CSV প্রথমে
                  এখানে নামে, যাচাইয়ের পর আসল Table এ যায়। কাঁচা Data আসল Table এর
                  নামের সাথে কখনো ধাক্কা খায় না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Customer কোম্পানির জন্য একটা Schema:</strong> কিছু
                  SaaS অ্যাপ একই Table গুলো প্রতিটা Tenant এর জন্য আলাদা Schema তে রাখে।
                  আলাদা রাখা সহজ হয়, কিন্তু হাজারটা Schema হলে প্রতিটা Schema বদল
                  হাজারবার চালাতে হয়। এই সিদ্ধান্তের হিসাব Module 19 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর আলাদা Database তখন, যখন জিনিসটা পুরো আলাদা অ্যাপ, যখন একটা ভুল
                অন্যটায় ছড়ানো চলবে না, যেমন Test এর Database, অথবা যখন দুটোর Join লাগবে
                না। একদম আলাদা Admin, আলাদা Backup বা আলাদা মেশিন লাগলে আলাদা Server।
                নিচের Lab এ ছয়টা বাস্তব পরিস্থিতিতে নিজে সিদ্ধান্ত নিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhereToPutLab /> },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "postgres-vs-mysql",
      subHeader: { index: "012", title: "PostgreSQL vs MySQL" },
      title: <SectionTitle>MySQL এ Schema মানে Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL দিয়ে কোনো কোর্স দেখলে এই জায়গায় সবচেয়ে বেশি গুলিয়ে যায়। MySQL এ
                Schema আলাদা কোনো স্তর না, Database এরই আরেক নাম। MySQL এর Docs এ
                সোজা লেখা, CREATE SCHEMA আর CREATE DATABASE একই কাজ করে। MySQL এ স্তর
                তাই তিনটা: Server, Database, Table। আর একই Server এর দুটো Database এর
                Table একটা Query তেই জোড়া যায়, যেটা PostgreSQL এ যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PostgresMysqlLevelsSplit /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, MySQL 8.4.11 Container এ",
          code: `mysql> CREATE SCHEMA island_tours;
mysql> CREATE DATABASE reports;
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| island_tours       |
| mysql              |
| performance_schema |
| reports            |
| sys                |
+--------------------+

mysql> SELECT t.title, s.seats
    -> FROM island_tours.tours t
    -> JOIN reports.tour_sales s ON s.tour_id = t.tour_id;
+----------------------------+-------+
| title                      | seats |
+----------------------------+-------+
| Saint Martin Island Escape |     6 |
+----------------------------+-------+

mysql> USE island_tours;
mysql> SELECT DATABASE(), SCHEMA();
+--------------+--------------+
| DATABASE()   | SCHEMA()     |
+--------------+--------------+
| island_tours | island_tours |
+--------------+--------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CREATE SCHEMA দিয়ে বানানো island_tours ও SHOW DATABASES এর তালিকায়
                Database হিসেবেই এসেছে, আর DATABASE() আর SCHEMA() একই উত্তর দিয়েছে।
                দুটো Database এর Table একটা JOIN এ মিলেছে কোনো আপত্তি ছাড়া।
              </ContentParagraph>
              <ContentParagraph>
                অনুবাদের নিয়মটা তাই এরকম। MySQL এর ভিডিওতে Database বা Schema শুনলে,
                PostgreSQL এ সেটাকে Database ভাবুন। MySQL এর USE island_tours মানে
                PostgreSQL এর \c island_tours। আর MySQL এর db.table লেখাটা PostgreSQL
                এ লিখলে PostgreSQL সেটাকে schema.table পড়বে, Database ভাববে না। MySQL
                এর দুই Database এর Join এর মতো কিছু PostgreSQL এ চাইলে দুটোকে একই
                Database এর দুটো Schema বানানোই স্বাভাবিক পথ। দুই Database এর খুঁটিনাটি
                তুলনা Module 21 এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it-yourself",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>Query বক্সে নিজে হাতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই পাতার Query বক্সগুলোতে আসল PostgreSQL 18 চলছে, তবে একটা ছোট
                পার্থক্য আগে জেনে নিন। বক্সের ভেতরে আছে একটাই Database, যার নাম
                postgres, আর Island Tours এর আটটা Table তার public Schema তে Load
                করা। নিজের মেশিনের মতো island_tours নামের আলাদা Database এখানে নেই,
                আর CREATE DATABASE এখানে চলে না। Schema অবশ্য পুরোপুরি চলে। SELECT
                এর নিয়ম এখনো শেখেননি, তাতে সমস্যা নেই, Run চাপুন আর উত্তর মেলান।
                SELECT শুরু হবে Module 03 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আমি এখন কোথায়"
              query={`SELECT current_database(), current_user, current_schema();
SHOW search_path;
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;`}
              caption={
                <>
                  তিনটা উত্তর আসবে: Database postgres, User postgres, Schema public।
                  তারপর search_path, যেটা এই বক্সে শুধু public। নিজের মেশিনে একই
                  প্রশ্ন করলে দেখবেন &quot;$user&quot;, public, কারণ সেটাই একটা সাধারণ
                  Server এর শুরুর মান। শেষে Schema এর তালিকায় public এর পাশে
                  PostgreSQL এর নিজের তিনটা Schema।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই নাম, দুটো Table"
              query={`CREATE SCHEMA IF NOT EXISTS analytics;
DROP TABLE IF EXISTS analytics.tours;
CREATE TABLE analytics.tours (tour_id integer, title text, bookings integer);
INSERT INTO analytics.tours VALUES (1, 'Saint Martin Island Escape', 6);

SELECT count(*) AS public_tours FROM tours;
SELECT count(*) AS analytics_tours FROM analytics.tours;

SET search_path TO analytics, public;
SELECT count(*) AS which_tours FROM tours;
SELECT count(*) AS bookings FROM bookings;

RESET search_path;
SHOW search_path;`}
              caption={
                <>
                  প্রথমে tours মানে public এর ৯টা Row। search_path এ analytics সামনে
                  আনতেই একই tours মানে analytics এর ১টা Row, অথচ bookings এখনো ২৪টা,
                  কারণ analytics এ bookings নেই, খোঁজা গড়িয়ে public এ গেছে। শেষে RESET
                  আগের মানে ফিরিয়ে আনে। মাঝপথে কোনো Error হলে search_path বদলানো
                  অবস্থায় থেকে যেতে পারে, তখন Reset চাপুন।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বিন্দু দিয়ে পুরো নাম"
              query={`SELECT count(*) FROM public.tours;
SELECT count(*) FROM postgres.public.tours;
SELECT count(*) FROM island_tours.public.tours;`}
              caption={
                <>
                  প্রথম দুটো চলবে, দুটোতেই ৯, কারণ এই বক্সের Database এর নাম postgres।
                  তৃতীয়টায় cross-database Error, কারণ island_tours এখানে বর্তমান
                  Database না। নিজের মেশিনে island_tours এ বসে চালালে উল্টোটা ঘটবে।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের একটা Schema বানান"
              query={`CREATE SCHEMA IF NOT EXISTS audit;
DROP TABLE IF EXISTS audit.audit_log;
CREATE TABLE audit.audit_log (
  log_id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  happened_at timestamptz NOT NULL DEFAULT now(),
  what        text NOT NULL
);
INSERT INTO audit.audit_log (what) VALUES ('booking 17: pending to confirmed');
SELECT log_id, what FROM audit.audit_log;

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('public', 'analytics', 'audit')
ORDER BY table_schema, table_name;`}
              caption={
                <>
                  audit Schema আর তার ভেতরে audit_log Table তৈরি হবে। শেষের তালিকায়
                  public এর আটটা Table এর সাথে audit_log দেখবেন। আগের বক্সটা চালিয়ে
                  থাকলে analytics.tours ও তালিকায় আসবে, কারণ এই পাতার সব বক্স একই
                  Database ভাগ করে।
                </>
              }
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর ঘরগুলো কীভাবে সাজানো</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ট্র্যাকে Island Tours এর Database কে যেভাবে সাজানো ধরে নিয়ে এগোনো
                হবে, সেটা একবার পুরোটা দেখে নিন। পরের মডিউলগুলোর অনেক উদাহরণ এই নকশার
                উপর দাঁড়াবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Production Server এ island_tours Database:</strong> public
                  Schema তে App এর আটটা Table, analytics Schema তে মাস শেষের Report এর
                  Table আর View, audit Schema তে বদলের ইতিহাস।
                </ListItem>
                <ListItem>
                  <strong>Developer এর মেশিনে island_tours_test:</strong> Test চলার
                  সময় প্রতিবার খালি হয়ে নতুন Data পায়। আসল Data এর Database এর সাথে
                  কোনো দেয়ালও ভাগ করে না।
                </ListItem>
                <ListItem>
                  <strong>আপনার মেশিনে my_tours:</strong> এই ট্র্যাকের Assignment এ
                  আপনি নিজের যে অ্যাপ ধাপে ধাপে বানাবেন, তার নিজের Database। Island Tours
                  এর Sample Data নষ্ট না করেই যা খুশি পরীক্ষা করা যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কে Connect করেন", "Role", "search_path", "কী পারেন"],
          rows: [
            ["Website এর API", "api", "public", "public এর Table পড়া আর লেখা, audit এ শুধু লেখা"],
            ["হিসাব বিভাগের Report Tool", "reporting", "analytics, public", "analytics পড়া, public শুধু পড়া"],
            ["Database Admin", "postgres", "\"$user\", public", "সবকিছু, তাই শুধু জরুরি দরকারে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Report Tool এর search_path এ analytics সামনে রাখা হয়েছে, যাতে তাদের
                Query তে daily_revenue এর মতো নাম Schema ছাড়াই চলে। কিন্তু এর ফলেই
                analytics এ কেউ tours নামে Table বানালে Report Tool এর tours বদলে যাবে,
                ঠিক Section 008 এর ছবির মতো। তাই নিয়ম রাখা হয়েছে, analytics এ App এর
                Table এর নাম কখনো ব্যবহার হবে না, আর API এর Code এ শুধু public, কোনো
                অনুমান নেই। ছোট একটা সিদ্ধান্ত, কিন্তু এক দুপুরের রহস্যময় Bug বাঁচায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>SELECT * FROM tours, PostgreSQL এর ভেতরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Connection একটা Database বেছে নেয়",
              description:
                "psql -d island_tours বা Connection String এর শেষের নাম ঠিক করে দেয় কোন আলমারি খোলা হবে। এই Connection এর পুরো জীবন এই Database এর ভেতরেই কাটবে।",
            },
            {
              title: "search_path ঠিক হয়",
              description:
                "Server এর মান, তার উপর Database এর মান, তার উপর Role এর মান, আর সবশেষে Connection এ চালানো SET। সবচেয়ে কাছের স্তরের মানটাই জেতে।",
            },
            {
              title: "Query তে নামটা পড়া হয়",
              description:
                "PostgreSQL দেখে tours এর আগে কোনো Schema এর নাম আছে কিনা। public.tours লেখা থাকলে সোজা সেখানে যায়, পরের ধাপ বাদ।",
            },
            {
              title: "তালিকা ধরে খোঁজা",
              description:
                "আগে pg_catalog, তারপর search_path এর Schema গুলো বাম থেকে ডানে। যে Schema নেই, বা যেখানে আপনার ঢোকার অনুমতি নেই, সেটা চুপচাপ বাদ।",
            },
            {
              title: "প্রথম মিলেই থামা",
              description:
                "যে Schema এ প্রথম tours পাওয়া যায়, সেটাই। পরের Schema গুলোতে আরও tours থাকলেও সেগুলো দেখাই হয় না।",
            },
            {
              title: "কোথাও না পেলে Error",
              description:
                "সব Schema খুঁজেও না পেলে ERROR: relation \"tours\" does not exist, যার SQLSTATE কোড 42P01। এর মানে ভুল Database, অথবা ঠিক Schema তালিকায় নেই।",
            },
            {
              title: "পাওয়ার পর অনুমতি দেখা",
              description:
                "Table পাওয়া গেলেও আপনার পড়ার অনুমতি না থাকলে আসে permission denied for table tours। এটা খোঁজার সমস্যা না, Permission এর সমস্যা, সমাধানও আলাদা।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যেখানে সবাই একবার পা হড়কান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখবেন", "কেন হয়", "সমাধান"],
          rows: [
            [
              "ভুল Database এ Connect",
              "relation \"tours\" does not exist",
              "psql -d না দিলে অনেক সময় postgres বা আপনার User নামের Database এ ঢোকেন",
              "প্রম্পট দেখুন, \\c island_tours",
            ],
            [
              "Table ভুল Schema তে বানানো",
              "Table টা \\dt তে নেই, অথচ CREATE TABLE সফল হয়েছিল",
              "search_path এর প্রথম বৈধ Schema তে গিয়ে বসেছে",
              "SELECT table_schema FROM information_schema.tables WHERE table_name = 'নাম';",
            ],
            [
              "বড় হাতের অক্ষরে Quote দিয়ে নাম",
              "relation \"tours\" does not exist, যদিও \"Tours\" আছে",
              "Quote ছাড়া নাম ছোট হাতের হয়ে যায়",
              "সব নাম ছোট হাতের অক্ষরে, Underscore দিয়ে",
            ],
            [
              "দুই Database এর Join চাওয়া",
              "cross-database references are not implemented",
              "PostgreSQL এ এক Connection এক Database",
              "দুটোকে এক Database এর দুই Schema বানান",
            ],
            [
              "SET search_path কে স্থায়ী ভাবা",
              "পরের দিন আবার পুরনো আচরণ",
              "SET শুধু এই Connection এর জন্য",
              "ALTER ROLE বা ALTER DATABASE ... SET",
            ],
            [
              "template1 এ পরীক্ষা করা",
              "নতুন প্রতিটা Database এ অচেনা Table",
              "নতুন Database template1 এর Copy",
              "template1 থেকে সেই জিনিস মুছে দিন",
            ],
            [
              "MySQL এর Schema কে PostgreSQL এর Schema ভাবা",
              "ভিডিওর CREATE SCHEMA এর পর \\c কাজ করে না",
              "MySQL এ Schema মানে Database",
              "PostgreSQL এ CREATE DATABASE লিখুন",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "যেকোনো Table খুঁজে বের করার এক লাইন",
          content: (
            <ContentParagraph>
              কোনো Table কোথায় আছে বুঝতে না পারলে বর্তমান Database এ এই Query চালান:
              SELECT table_schema, table_name FROM information_schema.tables WHERE
              table_name = &apos;tours&apos;; উত্তরে যত Schema এ ওই নামের Table আছে,
              সবগুলো আসবে। কোনো Row না এলে Table টা এই Database এই নেই, তখন অন্য
              Database এ Connect করে আবার চালান।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Schemas</strong>, PostgreSQL এর Docs এর পুরো অধ্যায়।
                search_path, public Schema আর নিরাপদ ব্যবহারের নিয়ম, এই লেসনের সবকিছুর
                মূল উৎস।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/ddl-schemas.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/ddl-schemas.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Managing Databases: Overview</strong>, Cluster, Database,
                Schema আর Table এর ক্রম, আর এক Connection এ এক Database এর নিয়ম।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/manage-ag-overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/manage-ag-overview.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Template Databases</strong>, template1 আর template0 এর পুরো
                ব্যাখ্যা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/manage-ag-templatedbs.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/manage-ag-templatedbs.html
                </a>
              </ListItem>
              <ListItem>
                <strong>search_path Setting</strong>, অফিসিয়াল সংজ্ঞা: বাদ পড়া Schema,
                &quot;$user&quot;, pg_catalog আর নতুন জিনিস কোথায় তৈরি হয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/runtime-config-client.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/runtime-config-client.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL 15 Release Notes</strong>, public Schema এর
                Permission বদলের ঘোষণা আর Upgrade করা Database এর ব্যতিক্রম।{" "}
                <a
                  href="https://www.postgresql.org/docs/release/15.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/release/15.0
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL CREATE DATABASE</strong>, MySQL 8.4 এর Docs, যেখানে লেখা
                CREATE SCHEMA আর CREATE DATABASE একই জিনিস।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/create-database.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/create-database.html
                </a>
              </ListItem>
              <ListItem>
                <strong>একটা পূর্ণ SQL ভিডিও কোর্স</strong>, MySQL দিয়ে বানানো। সেখানে
                Database বানানোর অংশ দেখার সময় এই লেসনের অনুবাদের নিয়ম মনে রাখুন:
                MySQL এর Schema মানে PostgreSQL এর Database।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  youtube.com/watch?v=hlGoQC332VM
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
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  PostgreSQL এর প্রতিটা Table এর ঠিকানায় চারটা স্তর: Server (Cluster),
                  Database, Schema, Table।
                </ListItem>
                <ListItem>
                  Cluster মানে একটা চালু Server আর তার Data Directory, অনেক মেশিন না।
                  initdb তাতে postgres, template1 আর template0 বানিয়ে রাখে। Role থাকে
                  পুরো Cluster এর স্তরে।
                </ListItem>
                <ListItem>
                  একটা Connection একটাই Database দেখে। Database বদলাতে \c, আর অন্য
                  Database এর Table পড়তে চাইলে cross-database Error।
                </ListItem>
                <ListItem>
                  CREATE DATABASE আসলে template1 এর Copy। template1 এ পরীক্ষা করবেন না।
                </ListItem>
                <ListItem>
                  Schema হলো Database এর ভেতরের Namespace। প্রতিটা Database এ public
                  থাকে, আর দুটো Schema তে একই নামের Table থাকতে পারে।
                </ListItem>
                <ListItem>
                  Schema এর নাম না লিখলে PostgreSQL search_path ধরে খোঁজে, প্রথম মিলেই
                  থামে, আর নতুন জিনিস বানায় প্রথম বৈধ Schema তে। শুরুর মান
                  &quot;$user&quot;, public।
                </ListItem>
                <ListItem>
                  search_path বদলানো যায় SET দিয়ে এই Connection এ, অথবা ALTER ROLE
                  আর ALTER DATABASE দিয়ে স্থায়ীভাবে। কাছের স্তর জেতে।
                </ListItem>
                <ListItem>
                  PostgreSQL 15 থেকে সাধারণ User public এ Table বানাতে পারেন না। GRANT
                  CREATE দিন, অথবা নিজের Schema বানিয়ে দিন।
                </ListItem>
                <ListItem>
                  MySQL এ Schema মানে Database, স্তর তিনটা, আর দুই Database এর Join
                  চলে। PostgreSQL এ সেটা দুটো Schema দিয়ে করা হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার আপনার হাতে পুরো মানচিত্র: কোন Server, কোন Database, কোন Schema।
                পরের লেসন{" "}
                <Link href="/sql/topic/load-sample-database" className={LINK}>
                  Loading the Island Tours Database
                </Link>{" "}
                এ এই মানচিত্র ধরেই নিজের মেশিনে island_tours Database বানিয়ে পুরো Sample
                Data Load করবেন, আর জানবেন কোন Table কোন Schema তে গিয়ে বসল আর কেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      ["Cluster", "একটা চালু Server আর তার Data Directory", "SHOW data_directory;"],
      ["Database", "Server এর ভেতরে বন্ধ দরজার আলাদা ঘর, Connect করার একক", "\\l, \\c island_tours"],
      ["এক Connection, এক Database", "অন্য Database এর Table সরাসরি পড়া যায় না", "cross-database references are not implemented"],
      ["Template", "নতুন Database আসলে template1 এর Copy", "CREATE DATABASE ... TEMPLATE template0"],
      ["Schema", "Database এর ভেতরে নামের আলাদা জায়গা", "\\dn, CREATE SCHEMA analytics;"],
      ["public", "প্রতিটা Database এ আগে থেকে থাকা Schema", "Sample Database এর আটটা Table"],
      ["Qualified Name", "schema.table, অনুমানের জায়গা নেই", "analytics.tours"],
      ["Case Folding", "Quote ছাড়া নাম ছোট হাতের, Quote দিলে হুবহু", "\"Tours\" বনাম tours"],
      ["search_path", "Schema ছাড়া নাম খোঁজার ক্রম, প্রথম মিলেই থামা", "SHOW search_path;"],
      ["\"$user\"", "Connect করা User এর নামের Schema, না থাকলে বাদ", "current_schemas(true)"],
      ["Setting এর স্তর", "SET, Role, Database, Server, কাছেরটা জেতে", "ALTER ROLE ... SET search_path"],
      ["PostgreSQL 15 এর পরিবর্তন", "public এ সবার CREATE অনুমতি নেই", "permission denied for schema public"],
      ["MySQL", "Schema মানে Database, তিন স্তর, দুই Database এর Join চলে", "SHOW DATABASES; USE island_tours;"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "নাদিয়া psql খুলে SELECT count(*) FROM tours; লিখলেন, এল relation \"tours\" does not exist। প্রম্পটে লেখা postgres=#। Table টা island_tours এ আছে। সবচেয়ে সম্ভাব্য কারণ কী?",
        options: [
          {
            key: "A",
            text: "Table টা মুছে গেছে",
            isCorrect: false,
            explanation: "প্রম্পট দেখেই বোঝা যায় তিনি অন্য Database এ আছেন। আগে সেটা ঠিক করুন, তারপর মুছে যাওয়ার সন্দেহ।",
          },
          {
            key: "B",
            text: "তিনি postgres Database এ Connect হয়েছেন, island_tours এ না",
            isCorrect: true,
            explanation:
              "ঠিক। প্রম্পটের প্রথম শব্দ বর্তমান Database। \\c island_tours দিয়ে সরলেই Query চলবে।",
          },
          {
            key: "C",
            text: "PostgreSQL Server বন্ধ",
            isCorrect: false,
            explanation: "Server বন্ধ থাকলে Connect ই হতো না, Error আসত Connection এর।",
          },
          {
            key: "D",
            text: "tours লিখতে হবে বড় হাতের অক্ষরে",
            isCorrect: false,
            explanation: "Quote ছাড়া নাম এমনিতেই ছোট হাতের হয়ে যায়, বড় হাতে লিখলে কিছুই বদলাত না।",
          },
        ],
      },
      {
        id: 2,
        text: "PostgreSQL এর Database Cluster বলতে কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "কয়েকটা মেশিনে ছড়ানো PostgreSQL এর দল",
            isCorrect: false,
            explanation: "সেটা High Availability এর আলোচনার Cluster। PostgreSQL এর Docs এ শব্দটার মানে আলাদা।",
          },
          {
            key: "B",
            text: "একটা চালু Server যে কয়েকটা Database সামলায়, তার নিজের Data Directory সহ",
            isCorrect: true,
            explanation:
              "ঠিক। আপনার Laptop এর একটা PostgreSQL ই একটা Cluster। initdb তাতে postgres, template1 আর template0 বানায়।",
          },
          {
            key: "C",
            text: "একটা Database এর ভেতরের সব Schema",
            isCorrect: false,
            explanation: "Schema গুলো Database এর ভেতরে থাকে। Cluster তার এক স্তর উপরে।",
          },
          {
            key: "D",
            text: "একই ধরনের কয়েকটা Table এর দল",
            isCorrect: false,
            explanation: "Table এর দলকে কোনো বিশেষ নাম দেওয়া হয় না, সাজানো হয় Schema দিয়ে।",
          },
        ],
      },
      {
        id: 3,
        text: "island_tours এ বসে SELECT * FROM my_tours.public.tours; চালালে কী হবে?",
        options: [
          {
            key: "A",
            text: "my_tours এর tours Table পড়া যাবে",
            isCorrect: false,
            explanation: "MySQL এ এরকম চলে, PostgreSQL এ না।",
          },
          {
            key: "B",
            text: "Error: cross-database references are not implemented",
            isCorrect: true,
            explanation:
              "ঠিক। এক Connection এক Database। তিন অংশের নাম শুধু তখনই চলে, যখন প্রথম অংশ বর্তমান Database এর নাম।",
          },
          {
            key: "C",
            text: "PostgreSQL নিজে থেকে my_tours এ Connect হয়ে যাবে",
            isCorrect: false,
            explanation: "Query এর মাঝখানে Database বদলায় না। বদলাতে নতুন Connection লাগে।",
          },
          {
            key: "D",
            text: "island_tours এর public.tours পড়া হবে",
            isCorrect: false,
            explanation: "PostgreSQL প্রথম অংশটা উপেক্ষা করে না, ভুল Database এর নাম দেখলে Error দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "template1 এ একটা Table বানানোর পর CREATE DATABASE seagull_tours; চালানো হলো। seagull_tours এ কী থাকবে?",
        options: [
          {
            key: "A",
            text: "কিছুই না, নতুন Database সবসময় খালি",
            isCorrect: false,
            explanation: "নতুন Database শূন্য থেকে তৈরি হয় না, একটা ছাঁচের Copy হয়।",
          },
          {
            key: "B",
            text: "template1 এর সেই Table টাও, কারণ CREATE DATABASE template1 কে Copy করে",
            isCorrect: true,
            explanation:
              "ঠিক। এজন্যই শেখার সময় template1 এ পরীক্ষা করা বারণ। আসল ছাঁচ লাগলে TEMPLATE template0।",
          },
          {
            key: "C",
            text: "postgres Database এর সব Table",
            isCorrect: false,
            explanation: "ছাঁচ হিসেবে কিছু না বললে template1 ব্যবহার হয়, postgres না।",
          },
          {
            key: "D",
            text: "Error, কারণ template1 এ Table রাখা নিষেধ",
            isCorrect: false,
            explanation: "রাখা যায়, আর ঠিক সেটাই ঝুঁকি। PostgreSQL থামায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "search_path হলো \"$user\", public। আপনি postgres হিসেবে Connect করেছেন, আর postgres নামে কোনো Schema নেই। CREATE TABLE notes (id int); কোথায় তৈরি হবে?",
        options: [
          {
            key: "A",
            text: "postgres Schema তে, PostgreSQL সেটা নিজে বানিয়ে নেবে",
            isCorrect: false,
            explanation: "search_path এর জন্য PostgreSQL কোনো Schema নিজে বানায় না। না থাকা Schema চুপচাপ বাদ পড়ে।",
          },
          {
            key: "B",
            text: "public এ, কারণ নতুন জিনিস তৈরি হয় তালিকার প্রথম বৈধ Schema তে",
            isCorrect: true,
            explanation:
              "ঠিক। \"$user\" বাদ পড়ায় প্রথম বৈধ Schema public। পরে postgres নামে Schema বানালে তখন থেকে নতুন Table সেখানে যাবে।",
          },
          {
            key: "C",
            text: "pg_catalog এ",
            isCorrect: false,
            explanation: "pg_catalog খোঁজায় থাকে, কিন্তু Schema না বললে নতুন Table সেখানে বসে না।",
          },
          {
            key: "D",
            text: "Error আসবে, কারণ Schema বলা হয়নি",
            isCorrect: false,
            explanation: "Schema না বলা পুরোপুরি স্বাভাবিক। Error আসে শুধু search_path এ কোনো বৈধ Schema না থাকলে।",
          },
        ],
      },
      {
        id: 6,
        text: "search_path বদলে analytics, public করা হলো। analytics এ tours নামে একটা Table আছে। এখন SELECT count(*) FROM tours; কী ফেরত দেবে?",
        options: [
          {
            key: "A",
            text: "public.tours এর ৯, কারণ আসল Table সেখানে",
            isCorrect: false,
            explanation: "PostgreSQL আসল নকল বোঝে না, শুধু তালিকার ক্রম মানে।",
          },
          {
            key: "B",
            text: "analytics.tours এর Row সংখ্যা, কারণ তালিকায় analytics আগে",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথম মিলেই থামা। কোনো Error বা সতর্কবার্তা ছাড়াই অন্য Table পড়া হয়, তাই ঝুঁকিটা লুকানো।",
          },
          {
            key: "C",
            text: "দুটোর যোগফল",
            isCorrect: false,
            explanation: "PostgreSQL একটা নামের জন্য একটাই Table বেছে নেয়।",
          },
          {
            key: "D",
            text: "Error, কারণ দুই Schema তে একই নাম",
            isCorrect: false,
            explanation: "দুই Schema তে একই নাম রাখাই Schema এর মূল সুবিধা, এতে Error নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL 18 এ নতুন একটা সাধারণ Role, app_user, CREATE TABLE public.notes (id int); চালালেন। কী ঘটবে?",
        options: [
          {
            key: "A",
            text: "Table তৈরি হবে, public এ সবাই লিখতে পারেন",
            isCorrect: false,
            explanation: "PostgreSQL 14 পর্যন্ত এমন ছিল। 15 থেকে নতুন Database এ নিয়ম বদলেছে।",
          },
          {
            key: "B",
            text: "permission denied for schema public, কারণ PostgreSQL 15 থেকে public এ সবার CREATE অনুমতি তুলে নেওয়া হয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। সমাধান GRANT CREATE ON SCHEMA public TO app_user, অথবা তাঁর নিজের Schema। Upgrade করা পুরনো Database এ অবশ্য পুরনো নিয়ম থেকে যেতে পারে।",
          },
          {
            key: "C",
            text: "Table তৈরি হবে app_user Schema তে",
            isCorrect: false,
            explanation: "public.notes লেখায় Schema নির্দিষ্ট, search_path এর প্রশ্নই আসে না।",
          },
          {
            key: "D",
            text: "relation does not exist",
            isCorrect: false,
            explanation: "এটা খোঁজার Error, এখানে সমস্যা অনুমতির।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা MySQL ভিডিওতে শিক্ষক লিখলেন CREATE SCHEMA shop; তারপর USE shop;। PostgreSQL এ একই কাজের সবচেয়ে কাছের রূপ কোনটা?",
        options: [
          {
            key: "A",
            text: "CREATE SCHEMA shop; তারপর SET search_path TO shop;",
            isCorrect: false,
            explanation: "এটা PostgreSQL এর Schema বানায়, কিন্তু MySQL এর Schema আসলে Database।",
          },
          {
            key: "B",
            text: "CREATE DATABASE shop; তারপর \\c shop",
            isCorrect: true,
            explanation:
              "ঠিক। MySQL এ Schema মানে Database, আর USE মানে PostgreSQL এর \\c, মানে নতুন করে সেই Database এ Connect।",
          },
          {
            key: "C",
            text: "CREATE TABLE shop; তারপর SELECT * FROM shop;",
            isCorrect: false,
            explanation: "Table একদম আলাদা স্তর, আর CREATE TABLE এ Column ও লাগে।",
          },
          {
            key: "D",
            text: "PostgreSQL এ এরকম কিছু করা যায় না",
            isCorrect: false,
            explanation: "যায়, শুধু নাম আলাদা। এটাই এই লেসনের অনুবাদের নিয়ম।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: my_tours এর ঘর গোছান",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের Database:</strong> নিজের মেশিনের PostgreSQL এ my_tours নামে একটা
        Database বানান, \l দিয়ে দেখুন, তারপর \c দিয়ে তার ভেতরে যান। প্রম্পট কীভাবে
        বদলাল, লিখে রাখুন।
      </span>,
      <span key="2">
        <strong>তিনটা Schema:</strong> my_tours এ app, reporting আর audit নামে তিনটা
        Schema বানান। প্রতিটায় একটা ছোট Table রাখুন, যেমন app.trips, reporting.trips
        আর audit.changes। \dn দিয়ে তিনটা Schema দেখুন, আর \dt app.* এর মতো করে
        প্রতিটা Schema এর Table আলাদা করে দেখুন।
      </span>,
      <span key="3">
        <strong>search_path এর পরীক্ষা:</strong> একবার SET search_path TO app, reporting
        আর একবার reporting, app দিয়ে SELECT count(*) FROM trips চালান। দুই উত্তর লিখে
        রাখুন আর এক লাইনে ব্যাখ্যা করুন কেন আলাদা।
      </span>,
      <span key="4">
        <strong>স্থায়ী করুন:</strong> ALTER DATABASE my_tours SET search_path = app,
        public দিয়ে স্থায়ী মান রাখুন। psql বন্ধ করে আবার খুলে SHOW search_path দিয়ে
        প্রমাণ দিন যে মানটা টিকে আছে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> এক বন্ধু MySQL দিয়ে শিখছেন। তাঁকে
        ছয় লাইনে বোঝান PostgreSQL এর Database আর Schema কী, MySQL এর Schema এর সাথে
        তফাত কোথায়, আর তাঁর ভিডিওর CREATE SCHEMA আর USE এর বদলে PostgreSQL এ কী লিখবেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">\l, \dn আর \dt app.* এর Output এর Screenshot বা Copy</span>,
      <span key="d2">দুই search_path এর দুটো আলাদা count এর ফলাফল, ব্যাখ্যাসহ</span>,
      <span key="d3">psql আবার খোলার পর SHOW search_path এর Output</span>,
      <span key="d4">বন্ধুর জন্য লেখা ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "চার স্তর নিজের হাতে",
    subtitle: "নিজের মেশিনের PostgreSQL এ Database, Schema আর search_path",
    stepName: "LAB",
    steps: [
      {
        title: "Server আর Database দেখুন",
        description:
          "psql খুলে প্রথম কোড চালান। কোন Server, কোন Data Directory, কোন Database গুলো আছে, তিনটা উত্তর পড়ুন। Docker এ চালালে docker exec -it island-pg psql -U postgres দিয়ে ঢুকুন।",
      },
      {
        title: "নতুন Database আর তার ভেতরে যাওয়া",
        description:
          "দ্বিতীয় কোড দিয়ে lab_tours বানান, \\c দিয়ে ঢুকুন, আর current_database() দিয়ে নিশ্চিত হন।",
      },
      {
        title: "দুটো Schema, একই নামের Table",
        description:
          "তৃতীয় কোড চালিয়ে public আর analytics দুই জায়গায় trips বানান, আলাদা আলাদা Row রাখুন, আর count মিলিয়ে দেখুন।",
      },
      {
        title: "search_path বদলে দেখুন",
        description:
          "চতুর্থ কোডে search_path এর ক্রম বদলে একই Query চালান, তারপর RESET। প্রতিবার কোন Table পড়া হলো লিখে রাখুন।",
      },
      {
        title: "দেয়ালটা পরীক্ষা করুন আর গুছিয়ে ফেলুন",
        description:
          "পঞ্চম কোডে অন্য Database এর Table পড়ার চেষ্টা করে cross-database Error দেখুন, তারপর postgres এ ফিরে lab_tours মুছে ফেলুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-where-am-i.sql",
        code: `SELECT version();
SHOW port;
SHOW data_directory;
\\l
SELECT current_database(), current_user, current_schema();`,
      },
      {
        language: "sql",
        filename: "02-new-database.sql",
        code: `CREATE DATABASE lab_tours;
\\c lab_tours
SELECT current_database();
-- lab_tours`,
      },
      {
        language: "sql",
        filename: "03-two-schemas.sql",
        code: `CREATE SCHEMA analytics;
CREATE TABLE public.trips (trip_id integer, place text);
CREATE TABLE analytics.trips (trip_id integer, place text);
INSERT INTO public.trips VALUES (1, 'Sajek'), (2, 'Sylhet'), (3, 'Bandarban');
INSERT INTO analytics.trips VALUES (1, 'summary');
\\dn
SELECT count(*) FROM trips;            -- 3, public.trips
SELECT count(*) FROM analytics.trips;  -- 1`,
      },
      {
        language: "sql",
        filename: "04-search-path.sql",
        code: `SHOW search_path;                      -- "$user", public
SET search_path TO analytics, public;
SELECT count(*) FROM trips;            -- 1, এবার analytics.trips
\\dt
RESET search_path;
SELECT count(*) FROM trips;            -- 3, আবার public.trips`,
      },
      {
        language: "sql",
        filename: "05-the-wall.sql",
        code: `SELECT count(*) FROM island_tours.public.tours;
-- ERROR:  cross-database references are not implemented: "island_tours.public.tours"

\\c postgres
DROP DATABASE lab_tours;
-- DROP DATABASE`,
      },
    ],
    tip: (
      <>
        PostgreSQL এর Docs অনুযায়ী অন্য কোনো Connection lab_tours এ খোলা থাকলে
        DROP DATABASE ব্যর্থ হয়। মুছতে না পারলে দেখুন আরেকটা psql Window বা কোনো
        GUI তে lab_tours খোলা আছে কিনা। সেটা বন্ধ করে আবার চেষ্টা করুন।
      </>
    ),
  },
};
