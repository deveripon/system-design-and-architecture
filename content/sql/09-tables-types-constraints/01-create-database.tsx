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
  CreatedbCollationLab,
  CreatedbDropLab,
} from "../../../components/course/topics/ddl/createdb-animations";
import {
  CreatedbAnatomyDiagram,
  CreatedbBoxVsServerSplit,
  CreatedbEnvironmentsDiagram,
  CreatedbTemplateCopyDiagram,
} from "../../../components/course/topics/ddl/createdb-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const createDatabaseContent: TopicData = {
  id: "create-database",
  introduction: {
    badge: "MODULE 09 · LESSON 01",
    title: <SectionTitle>নিজের প্রথম Database: CREATE আর DROP DATABASE</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 03 থেকে 08 পর্যন্ত আপনি একটা তৈরি করা Database পড়েছেন। Island Tours এর আটটা Table কেউ আগে থেকে
          বানিয়ে রেখেছিল, আপনি শুধু প্রশ্ন করেছেন। এই মডিউল থেকে উল্টো দিক শুরু: এখন আপনি নিজে বানাবেন। আর বানানোর
          একদম প্রথম ধাপটা Table না, তার চেয়েও বড় একটা পাত্র, Database নিজেই।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি নিজের হাতে Database বানাবেন, তার ভেতরে ঢুকবেন, আর শেষে মুছে ফেলবেন। জানবেন CREATE DATABASE
          আসলে শূন্য থেকে কিছু বানায় না, একটা ছাঁচ Copy করে। জানবেন Owner কে হবে, লেখা কোন Encoding এ জমা থাকবে, আর
          ORDER BY কোন ভাষার নিয়মে সাজাবে, এই তিনটা সিদ্ধান্ত কেন জন্মের সময়েই নিতে হয়, কারণ পরে কয়েকটা আর বদলানো
          যায় না। দেখবেন ICU দিয়ে বাংলার নিয়মে সাজানো Database কীভাবে বানায়।
        </ContentParagraph>
        <ContentParagraph>
          তারপর আসবে সবচেয়ে বিপজ্জনক Command গুলোর একটা, DROP DATABASE। কখন সে থামে, কখন সাথে সাথে সব মুছে দেয়, IF
          EXISTS আর WITH (FORCE) কী বদলায়, আর PostgreSQL এ CREATE DATABASE এর IF NOT EXISTS কেন নেই অথচ MySQL এ আছে।
          শেষে দেখবেন একটা App এর জন্য প্রতিটা পরিবেশে আলাদা Database কেন রাখা হয়, আর নাম কীভাবে রাখলে পরে কষ্ট হয়
          না। প্রতিটা Output আসল PostgreSQL 18 আর MySQL 8.4 থেকে নেওয়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি শূন্য থেকে কিছু বানাই না। আমাকে একটা ছাঁচ দিন, আমি তার হুবহু Copy বানিয়ে আপনার নাম লিখে দেব। শুধু জন্মের দিনই বলে দিন কোন ভাষায় সাজাব, কারণ সেটা পরে আর বদলাতে পারব না। আর আমাকে মুছতে বললে আমি একবারও জিজ্ঞেস করব না আপনি নিশ্চিত কিনা।",
      author: "CREATE DATABASE",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যে Test টা Demo এর আগে সব Booking মুছে দিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর সাপ্তাহিক বৈঠকে Operations Manager ফারুক সাহেব
                গত মাসের একটা ঘটনা আবার মনে করিয়ে দিলেন। এক বিকেলে একজন বড় Client কে নতুন Booking Page দেখানোর কথা
                ছিল। Demo শুরুর দশ মিনিট আগে দেখা গেল bookings Table প্রায় খালি। কেউ Data চুরি করেনি, কোনো Hacker ও
                না।
              </ContentParagraph>
              <ContentParagraph>
                আসলে একজন Developer তাঁর Laptop থেকে Automated Test চালিয়েছিলেন। Test এর নিয়ম ছিল, শুরুতে Table খালি
                করে নতুন পরীক্ষার Data বসানো। সমস্যা হলো তাঁর App টা তখন সেই একই Database এ Connect করা ছিল, যেটা
                Demo এর জন্যও ব্যবহার হচ্ছিল। Test তার কাজ ঠিকঠাকই করেছে। ভুল ছিল জায়গায়।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেব নতুন Developer তানিমকে একটা নিয়ম দিলেন: আজ থেকে প্রত্যেক Developer এর নিজের মেশিনে নিজের
                দুটো Database থাকবে, কাজের জন্য একটা আর Test এর জন্য আরেকটা, আর আসল Production Database থাকবে সম্পূর্ণ
                আলাদা Server এ। তানিমের প্রথম কাজ নিজের দুটো Database বানানো। তিনি psql খুলে আত্মবিশ্বাসের সাথে
                লিখলেন <code className={CODE}>CREATE DATABASE island-tours-dev;</code> আর পেলেন একটা Syntax Error।
              </ContentParagraph>
              <ContentParagraph>
                ছোট একটা হাইফেন। এই লেসন শেষে আপনি জানবেন সেটা কেন Error দিল, আর তার চেয়েও জরুরি কথাগুলো: Database
                বানানোর সময় কোন সিদ্ধান্তগুলো নিতে হয়, কোনগুলো পরে আর বদলানো যায় না, আর মুছে ফেলার Command কেন একবারও
                জিজ্ঞেস করে না আপনি নিশ্চিত কিনা।
              </ContentParagraph>
              <ContentParagraph>
                শুরুর আগে একটা জিনিস দেখে নিন। এই পাতার Query বক্সে আসল PostgreSQL চলছে, আর সে এই মুহূর্তে কোনো একটা
                Database এর ভেতরে বসে আছে। কোনটায়, সেটা জানার Function হলো <code className={CODE}>current_database()</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সটা এখন কোন Database এ"
              query={`SELECT current_database() AS database_name,
       current_user       AS logged_in_as;`}
              caption="এক Row: postgres | postgres। বক্সের Database এর নাম postgres, আর আপনি ঢুকেছেন postgres নামের Role হয়ে। Island Tours এর আটটা Table এই postgres Database এর ভেতরেই Load করা। Section 004 এ দেখবেন এই বক্স কেন এই একটা Database এর বাইরে যেতে পারে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে CREATE DATABASE",
          content: (
            <ContentParagraph>
              একটা PostgreSQL Server এর ভেতরে নতুন, সম্পূর্ণ আলাদা একটা Database বানানোর Command। Server আসলে একটা ছাঁচ
              Database কে Copy করে তাতে নতুন নাম দেয়। প্রতিটা Database এর নিজের Table, নিজের Schema, নিজের Owner; এক
              Database এর Query আরেকটার Table দেখতেও পায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "copy-of-template1",
      subHeader: { index: "002", title: "A Copy of template1" },
      title: <SectionTitle>নতুন Database আসলে একটা ছাঁচের Copy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পিঠার ছাঁচের কথা ভাবুন। প্রতিবার নতুন পিঠা বানাতে আপনি নকশা নতুন করে আঁকেন না, ছাঁচে চাপ দেন, আর
                হুবহু একই নকশার পিঠা বেরিয়ে আসে। ছাঁচে একটা ফুলের নকশা খোদাই করা থাকলে প্রতিটা পিঠাতেই সেই ফুল থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর CREATE DATABASE ঠিক এভাবে কাজ করে। নতুন একটা PostgreSQL Server চালু হলে initdb নামের
                Program তিনটা Database বানিয়ে রাখে: <code className={CODE}>postgres</code>,{" "}
                <code className={CODE}>template1</code> আর <code className={CODE}>template0</code>। প্রথমটা আপনার রোজকার
                ঢোকার জায়গা। বাকি দুটো ছাঁচ। আপনি যখন <code className={CODE}>CREATE DATABASE island_tours_dev;</code>{" "}
                লেখেন, Server আসলে template1 এর ফাইলগুলো Copy করে, আর Copy টার নাম দেয় island_tours_dev।
              </ContentParagraph>
              <ContentParagraph>
                Module 02 এর{" "}
                <Link href="/sql/topic/databases-schemas" className={LINK}>
                  Databases and Schemas
                </Link>{" "}
                লেসনে template1 এ রাখা Table নতুন Database এ চলে আসতে দেখেছিলেন। এখানে দেখবেন ছাঁচ কীভাবে Encoding,
                Locale আর Copy করার নিয়মকে প্রভাবিত করে। নতুন postgres:18 Container এ <code className={CODE}>\l</code>{" "}
                চালালে তিনটার Encoding, Collate আর Ctype হুবহু এক, কারণ initdb একবার ঠিক করেছে আর সবাই ছাঁচ থেকে পেয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, নতুন postgres:18 Container",
          code: `postgres=# \\l
                                                    List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+--------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 template0 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
           |          |          |                 |            |            |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           | =c/postgres          +
           |          |          |                 |            |            |        |           | postgres=CTc/postgres
(3 rows)`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbTemplateCopyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                template1 রোজকার ছাঁচ: কিছু না বললে এটাই Copy হয়, আর চাইলে এতে কিছু যোগ করা যায়, যেমন সব নতুন Database
                এ একটা Extension। template0 আসল, কখনো না ছোঁয়া ছাঁচ, তাতে কেউ Connect ই করতে পারে না। নতুন Database এর
                Encoding বা Locale ছাঁচ থেকে আলাদা হলে template0 লাগে, Section 006 আর 008 এ আসল Error সহ দেখবেন।
                Documentation অনুযায়ী ALTER DATABASE এর Setting আর GRANT এর Permission ছাঁচ থেকে Copy হয় না, শুধু ভেতরের
                Schema, Table, Function আর Extension আসে।
              </ContentParagraph>
              <ContentParagraph>
                আর Copy চলার সময় ছাঁচে অন্য কেউ Connect থাকতে পারবেন না। অন্য একটা Window তে template1 এ Session খোলা
                রেখে চালানো আসল Output:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, অন্য Window তে কেউ template1 এ",
          code: `postgres=# SELECT datname, usename FROM pg_stat_activity WHERE datname = 'template1';
  datname  | usename
-----------+----------
 template1 | postgres
(1 row)

postgres=# CREATE DATABASE island_tours_staging;
ERROR:  source database "template1" is being accessed by other users
DETAIL:  There is 1 other session using the database.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সাধারণত কেউ GUI Tool এ ভুল করে template1 খুলে রাখলে এমন হয়; সেই Connection বন্ধ করুন। এবার বক্সে দেখুন
              কোনটা ছাঁচ আর কোনটায় Connect করা যায়। <code className={CODE}>pg_database</code> সেই System Table, যেখানে
              প্রতিটা Database এর একটা Row থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সের Server এর তিনটা Database"
              query={`SELECT datname, datistemplate, datallowconn
FROM pg_database
ORDER BY datname;`}
              caption="তিন Row। postgres: ছাঁচ না, Connect করা যায় (f, t)। template0: ছাঁচ, Connect করা যায় না (t, f)। template1: ছাঁচ, Connect করা যায় (t, t)। বক্সের ভেতরের PostgreSQL ও initdb এর সেই একই তিনটা Database নিয়ে শুরু হয়েছে।"
            />
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
                  বক্সের Server এ যেসব Database ছাঁচ হিসেবে চিহ্নিত, শুধু তাদের নাম দেখান (
                  <code className={CODE}>datname</code>), নাম অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>pg_database</code> থেকে, <code className={CODE}>WHERE datistemplate</code>, আর
                  শেষে <code className={CODE}>ORDER BY datname</code>।
                </>
              }
              solution={`SELECT datname
FROM pg_database
WHERE datistemplate
ORDER BY datname;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "create-list-connect",
      subHeader: { index: "003", title: "Create, List, Connect" },
      title: <SectionTitle>বানান, তালিকায় দেখুন, ভেতরে ঢুকুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের মতো আপনিও নিজের মেশিনে প্রথম Database বানান। Module 02 এর{" "}
                <Link href="/sql/topic/psql-basics" className={LINK}>
                  psql Basics
                </Link>{" "}
                লেসনের মতো psql খুলুন (Docker এ থাকলে <code className={CODE}>docker exec -it island-pg psql -U
                postgres</code>)। আপনি ঢুকবেন postgres Database এ, প্রম্পট দেখাবে <code className={CODE}>postgres=#</code>।
                নিচের পুরো Session টা একটা আসল postgres:18 Container এ টাইপ করে চালানো, প্রতিটা উত্তর হুবহু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, প্রথম Database",
          code: `postgres=# CREATE DATABASE island_tours_dev;
CREATE DATABASE
postgres=# \\l island_tours_dev
                                                      List of databases
       Name       |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules | Access privileges
------------------+----------+----------+-----------------+------------+------------+--------+-----------+-------------------
 island_tours_dev | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
(1 row)

postgres=# \\c island_tours_dev
You are now connected to database "island_tours_dev" as user "postgres".
island_tours_dev=# SELECT current_database();
 current_database
------------------
 island_tours_dev
(1 row)

island_tours_dev=# \\dt
Did not find any tables.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>CREATE DATABASE</strong> সফল হলে psql শুধু Command এর নামটা ফেরত দেয়, একে বলে Command Tag।
                </ListItem>
                <ListItem>
                  <strong>\l</strong> দেখায় Owner postgres, কারণ যিনি বানান তিনিই Owner, আর Encoding ও Collate হুবহু
                  template1 এর।
                </ListItem>
                <ListItem>
                  <strong>\c</strong> পুরনো Connection বন্ধ করে নতুন Database এ নতুন Connection খোলে, আর প্রম্পটের নাম বদলে
                  যায়।
                </ListItem>
                <ListItem>
                  <strong>\dt</strong> খালি, কারণ template1 এ কোনো Table ছিল না। Island Tours এর Table গুলো অন্য Database
                  এ, আর Database গুলো কিছু ভাগ করে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>এবার তিনটা ভুল ইচ্ছা করে করুন, কারণ এগুলো সবাই একবার করে:</ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, তিনটা ভুল",
          code: `island_tours_dev=# CREATE DATABASE island_tours_dev;
ERROR:  database "island_tours_dev" already exists
island_tours_dev=# CREATE DATABASE IF NOT EXISTS island_tours_dev;
ERROR:  syntax error at or near "NOT"
LINE 1: CREATE DATABASE IF NOT EXISTS island_tours_dev;
                           ^
island_tours_dev=# \\c island_tours_tset
connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "island_tours_tset" does not exist
Previous connection kept
island_tours_dev=# \\c postgres
You are now connected to database "postgres" as user "postgres".`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমটার SQLSTATE কোড 42P04, Module 02 এর{" "}
                <Link href="/sql/topic/errors-and-help" className={LINK}>
                  Errors and Help
                </Link>{" "}
                লেসনে দেখেছিলেন কোডগুলো কোথায় খুঁজতে হয়। দ্বিতীয়টা বেশি গুরুত্বপূর্ণ: PostgreSQL এর CREATE DATABASE এ IF
                NOT EXISTS নেই। <code className={CODE}>\h CREATE DATABASE</code> এর Synopsis এ এমন অংশ নেই, তাই Parser
                NOT শব্দে আটকে যায়। CREATE TABLE, CREATE SCHEMA, CREATE INDEX এ আছে, শুধু এখানে নেই; MySQL এ আছে।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয়টা psql এর ভদ্রতা: হাতে টাইপ করা Session এ \c ব্যর্থ হলে পুরনো Connection রয়ে যায়। Script এ এমন
                হয় না, psql এর Documentation বলে তখন পুরনো Connection বন্ধ হয়ে যায়। এই লেসন লেখার সময় একটা ফাইলে \c
                template0 রেখে চালাতেই Script সেখানে থেমে গিয়েছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "IF NOT EXISTS ছাড়াই বারবার চালানো যায় এমন CREATE",
          content: (
            <ContentParagraph>
              Setup Script প্রথমবার বানাবে, পরেরবার চুপ থাকবে, এটাই চাই। প্রচলিত কৌশল psql এর{" "}
              <code className={CODE}>\gexec</code>: একটা SELECT দরকার হলে CREATE DATABASE লেখাটাই Row হিসেবে ফেরত দেয়, না
              হলে কিছুই না, আর \gexec ফেরত আসা প্রতিটা Row কে Command হিসেবে চালায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, একই লাইন দুবার",
          code: `postgres=# SELECT 'CREATE DATABASE island_tours_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'island_tours_test') \\gexec
CREATE DATABASE
postgres=# SELECT 'CREATE DATABASE island_tours_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'island_tours_test') \\gexec
postgres=#`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার SELECT একটা Row দিল আর \gexec সেটা চালাল। দ্বিতীয়বার কোনো Row নেই, তাই চালানোর মতো কিছুই নেই,
                Error ও নেই। ভেতরের প্রশ্নটা, “এই নামে Database আছে কিনা”, সাধারণ SQL, তাই বক্সেও চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এই নামে Database আছে কি"
              query={`SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'island_tours_dev') AS dev_exists,
       EXISTS (SELECT 1 FROM pg_database WHERE datname = 'postgres')         AS postgres_exists;`}
              caption="এক Row: f | t। বক্সের Server এ island_tours_dev নেই, postgres আছে। আপনার নিজের মেশিনে উপরের Session চালানোর পরে একই Query দুটোতেই t দেবে।"
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
                  এক Row তে দুটো Column: প্রথমটায় <code className={CODE}>island_tours</code> নামে Database আছে কিনা, দ্বিতীয়টায়{" "}
                  <code className={CODE}>template1</code> নামে আছে কিনা, দুটোই true বা false হিসেবে।
                </>
              }
              hint={
                <>
                  উপরের বক্সের মতো দুটো <code className={CODE}>EXISTS (SELECT 1 FROM pg_database WHERE datname = ...)</code>,
                  কমা দিয়ে আলাদা, FROM ছাড়া একটা SELECT এ।
                </>
              }
              solution={`SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'island_tours') AS island_tours_exists,
       EXISTS (SELECT 1 FROM pg_database WHERE datname = 'template1')    AS template1_exists;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Terminal থেকে সরাসরি ঢুকতে <code className={CODE}>psql -U postgres -d island_tours_dev</code>; নাম ভুল হলে
              psql FATAL: database ... does not exist বলে বেরিয়ে যায়। App ও একইভাবে Connect করে, নামটা থাকে Connection
              String এর শেষে, Module 01 এর{" "}
              <Link href="/sql/topic/app-database-conversation" className={LINK}>
                App and Database
              </Link>{" "}
              লেসনের মতো: <code className={CODE}>postgres://user@localhost:5432/island_tours_dev</code>।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "box-has-one-database",
      subHeader: { index: "004", title: "Why the Box Has One Database" },
      title: <SectionTitle>এই পাতার বক্স একটা ঘর, পুরো বাড়ি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের বেশিরভাগ Command আপনাকে নিজের psql এ চালাতে বলা হচ্ছে, বক্সে না। কারণটা জানা থাকলে পরে আর
                অবাক হবেন না। বক্সের ভেতরে চলে PGlite, পুরো PostgreSQL 18 কে Browser এ চালানোর একটা সংস্করণ। আসল Server
                অনেকগুলো Connection নেয়, প্রতিটা আলাদা Database এ যেতে পারে। PGlite এ Connection একটাই, আর সেটা চালু
                হওয়ার সময় postgres Database এ বসে, তারপর আর কোথাও যায় না।
              </ContentParagraph>
              <ContentParagraph>
                মজার ব্যাপার হলো, যেহেতু ভেতরে আসল PostgreSQL, তাই CREATE DATABASE এখানেও চলে। pg_database এ নতুন নামটা
                ওঠেও। কিন্তু সেখানে যাওয়ার কোনো দরজা নেই। <code className={CODE}>\c</code> SQL না, psql নামের Program এর
                নিজের Command, আর বক্স শুধু SQL বোঝে। তাই বক্সে বানানো Database এ কোনো Table রাখা যায় না, কোনো Query
                চালানো যায় না। নিচের বক্স সেটাই দেখায়, আর শেষে নিজের বানানোটা মুছেও দেয়, যাতে বারবার Run চাপা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbBoxVsServerSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সে CREATE DATABASE: নাম ওঠে, ঢোকা যায় না"
              query={`DROP DATABASE IF EXISTS createdb_practice;
CREATE DATABASE createdb_practice;

SELECT datname FROM pg_database ORDER BY oid;

SELECT current_database();

DROP DATABASE createdb_practice;`}
              caption="প্রথম দুটো Statement এর উত্তর DROP আর CREATE, বক্স Command Tag ছোট করে দেখায়, psql যেখানে লিখত CREATE DATABASE। তারপর চার Row: template1, template0, postgres আর নতুন createdb_practice। কিন্তু current_database() তখনো postgres। শেষ লাইন নতুন Database টা মুছে দেয়, তাই পাতা আবার আগের অবস্থায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার psql এর মতো করে ঢোকার চেষ্টা করে দেখুন। বক্স প্রথম লাইনটা চালাবে, তারপর দ্বিতীয় লাইনে এসে থামবে, কারণ
              উল্টো স্ল্যাশ দিয়ে শুরু হওয়া লাইন PostgreSQL এর কাছে অচেনা লেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সে \c চলে না"
              query={`SELECT current_database();

\\c createdb_practice`}
              caption="প্রথম উত্তর postgres। তারপর ERROR: syntax error at or near “\”। Server এর কাছে \c কোনো Command না; আপনার মেশিনে psql এই লাইনটা Server এ পাঠানোর আগেই নিজে ধরে ফেলে আর নিজে নতুন Connection খোলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তাহলে এই লেসনে বক্স কী কাজে লাগে",
          content: (
            <ContentParagraph>
              Database সম্পর্কে যা কিছু পড়া যায়, সব বক্সে চলে: কোনটায় আছেন, কে Owner, কোন Encoding, কোন Locale, কোনটা
              ছাঁচ, কোনটায় Connect করা যায়। এই লেসনের প্রতিটা Exercise এরকম পড়ার প্রশ্ন। বানানো, ঢোকা আর মোছার আসল কাজ
              আপনার নিজের psql এ, আর প্রতিটার আসল Output এই পাতায় দেওয়া আছে, যাতে মিলিয়ে নিতে পারেন। আরেকটা কথা: বক্সের
              Database পাতা Reload করলেই নতুন করে শুরু হয়, তাই এখানে কিছু ভাঙার ভয় নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "owner-and-permission",
      subHeader: { index: "005", title: "Owner and Permission" },
      title: <SectionTitle>Database টা কার: OWNER আর কে বানাতে পারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ফ্ল্যাট বাড়িতে বাড়িওয়ালা ফ্ল্যাট বানান, কিন্তু চাবি থাকে ভাড়াটের কাছে। PostgreSQL এ Database এর
                ভাড়াটের নাম Owner। Documentation এর শর্ত: Database বানাতে superuser হতে হয়, অথবা Role এ CREATEDB অধিকার
                লাগে। কিছু না বললে যিনি বানান তিনিই Owner, তাই postgres হয়ে বানালে Owner postgres, আর তখন App কেও
                সবকিছু করতে পারা postgres হয়ে Connect করতে হয়। ভালো অভ্যাস হলো App এর নিজের Role কে Owner করা।
              </ContentParagraph>
              <ContentParagraph>
                Role আর অধিকারের পুরো আলোচনা Module 16 এর{" "}
                <Link href="/sql/topic/roles-and-grants" className={LINK}>
                  Roles, GRANT and REVOKE
                </Link>{" "}
                লেসনে। এখানে শুধু: <code className={CODE}>CREATE ROLE island_app LOGIN;</code> এমন Role বানায় যে Login
                করতে পারে, কিন্তু superuser না, CREATEDB ও নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, superuser postgres হয়ে",
          code: `postgres=# CREATE ROLE island_app LOGIN;
CREATE ROLE
postgres=# ALTER DATABASE island_tours_dev OWNER TO island_app;
ALTER DATABASE
postgres=# CREATE DATABASE island_tours_staging OWNER island_app;
CREATE DATABASE
postgres=# \\l island_tours_*
                                                         List of databases
         Name         |   Owner    | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules | Access privileges
----------------------+------------+----------+-----------------+------------+------------+--------+-----------+-------------------
 island_tours_dev     | island_app | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 island_tours_staging | island_app | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
 island_tours_test    | postgres   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |        |           |
(3 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুটো পথ দেখলেন: আগে বানানো Database এর Owner বদলানো{" "}
              <code className={CODE}>ALTER DATABASE ... OWNER TO</code> দিয়ে, আর জন্মের সময়েই{" "}
              <code className={CODE}>OWNER island_app</code> বলে দেওয়া। এবার একই Server এ island_app হয়ে ঢুকুন (
              <code className={CODE}>psql -U island_app -d postgres</code>)। প্রম্পটের শেষে # এর বদলে &gt; দেখবেন, এটা
              superuser না হওয়ার চিহ্ন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, island_app হয়ে",
          code: `postgres=> CREATE DATABASE island_scratch;
ERROR:  permission denied to create database
postgres=> DROP DATABASE island_tours_test;
ERROR:  must be owner of database island_tours_test
postgres=> DROP DATABASE island_tours_staging;
DROP DATABASE`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                island_app বানাতে পারে না (CREATEDB নেই), postgres এর Database মুছতে পারে না, কিন্তু নিজেরটা মুছে ফেলল,
                কোনো প্রশ্ন ছাড়াই। আর PostgreSQL 15 থেকে প্রতিটা Database এর public Schema এর Owner{" "}
                <code className={CODE}>pg_database_owner</code>, মানে “এই Database এর যে-ই Owner”, তাই Owner নিজের Database
                এর public এ Table বানাতে পারেন, অন্যরা পারেন না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, island_app হয়ে দুই Database এ",
          code: `island_tours_dev=> CREATE TABLE createdb_notes (note text);
CREATE TABLE
island_tours_dev=> \\c island_tours_test
You are now connected to database "island_tours_test" as user "island_app".
island_tours_test=> CREATE TABLE createdb_notes (note text);
ERROR:  permission denied for schema public
LINE 1: CREATE TABLE createdb_notes (note text);
                     ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাই App এর Role নিজের Database এর Owner হলে Table বানানো আর বদলানো সে নিজেই পারে, superuser লাগে না।
              Production এ আরও সাবধান হওয়ার উপায় Module 16 এর{" "}
              <Link href="/sql/topic/least-privilege-app-user" className={LINK}>
                A Least-privilege App User
              </Link>{" "}
              লেসনে। বক্সে Owner দেখুন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Database এর Owner, আর আপনি কে"
              query={`SELECT datname, pg_get_userbyid(datdba) AS owner
FROM pg_database
ORDER BY datname;

SELECT rolname, rolsuper, rolcreatedb
FROM pg_roles
WHERE rolname = current_user;`}
              caption="প্রথম ফলাফলে তিন Row, তিনটারই Owner postgres। pg_database এ Owner থাকে datdba Column এ, একটা সংখ্যা হিসেবে; pg_get_userbyid() সেটাকে নামে বদলায়। দ্বিতীয় ফলাফল: postgres | t | t, বক্সে আপনি superuser, তাই বক্সে CREATE DATABASE চলেছিল।"
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
                  বক্স এখন যে Database এ বসে আছে, শুধু তার Owner এর নাম দেখান, এক Row এক Column। Database এর নাম হাতে
                  লিখবেন না, <code className={CODE}>current_database()</code> ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>pg_get_userbyid(datdba)</code>, <code className={CODE}>pg_database</code> থেকে,{" "}
                  <code className={CODE}>WHERE datname = current_database()</code>।
                </>
              }
              solution={`SELECT pg_get_userbyid(datdba) AS owner
FROM pg_database
WHERE datname = current_database();`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "encoding",
      subHeader: { index: "006", title: "Encoding" },
      title: <SectionTitle>Encoding: লেখা কীভাবে Byte হয়ে জমা থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Computer অক্ষর চেনে না, চেনে Byte। কোন অক্ষর কোন সংখ্যা হবে, সেই চুক্তির নাম Encoding, একটা সংকেতের খাতার
                মতো: খাতা আলাদা হলে একজনের লেখা আরেকজনের কাছে আবোলতাবোল। আজকের খাতা UTF-8, PostgreSQL এ নাম UTF8: English
                অক্ষর এক Byte, é দুই Byte, বাংলার প্রতিটা অক্ষর তিন Byte। পুরনো LATIN1 এ প্রতিটা অক্ষর এক Byte, কিন্তু অক্ষর
                মোটে 256টা, বাংলার একটাও না।
              </ContentParagraph>
              <ContentParagraph>
                Database এর Encoding জন্মের সময় ঠিক হয়, আর প্রতিটা Text Column সেই Encoding এ লেখা হয়। বক্সে গুনে দেখুন,
                char_length() আর octet_length() Module 04 এর{" "}
                <Link href="/sql/topic/string-functions" className={LINK}>
                  String Functions
                </Link>{" "}
                লেসনে দেখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সের Encoding, আর অক্ষর বনাম Byte"
              query={`SHOW server_encoding;

SELECT word, char_length(word) AS characters, octet_length(word) AS bytes
FROM (VALUES ('Island'), ('Café'), ('দ্বীপ')) AS v(word);`}
              caption="প্রথম উত্তর UTF8। তারপর তিন Row: Island এ 6 অক্ষর 6 Byte, Café তে 4 অক্ষর 5 Byte (é একাই দুই Byte), আর দ্বীপ এ 5 অক্ষর 15 Byte, প্রতিটা বাংলা অক্ষর তিন Byte।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজের psql এ ইচ্ছা করে একটা LATIN1 Database বানানোর চেষ্টা করুন, আর দেখুন PostgreSQL কতবার আপনাকে
              থামায়। নিচের Session আসল postgres:18 Container এর:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, LATIN1 এর তিন ধাপ",
          code: `postgres=# CREATE DATABASE createdb_latin ENCODING 'LATIN1';
ERROR:  encoding "LATIN1" does not match locale "en_US.utf8"
DETAIL:  The chosen LC_CTYPE setting requires encoding "UTF8".
postgres=# CREATE DATABASE createdb_latin2 ENCODING 'LATIN1' LOCALE 'C';
ERROR:  new encoding (LATIN1) is incompatible with the encoding of the template database (UTF8)
HINT:  Use the same encoding as in the template database, or use template0 as template.
postgres=# CREATE DATABASE createdb_latin ENCODING 'LATIN1' LOCALE 'C' TEMPLATE template0;
CREATE DATABASE`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>প্রথম Error:</strong> Encoding আর Locale কে মিলতে হয়। Documentation বলে Locale C বা POSIX হলে
                  যেকোনো Encoding চলে, অন্য Locale এ ঠিকভাবে চলে শুধু একটা, আর en_US.utf8 এর সেটা UTF8।
                </ListItem>
                <ListItem>
                  <strong>দ্বিতীয় Error:</strong> এবার ছাঁচ। template1 এর UTF8 Data LATIN1 এ Copy করলে নষ্ট হতে পারে, HINT
                  নিজেই বলছে template0।
                </ListItem>
                <ListItem>
                  <strong>তৃতীয়টা সফল:</strong> template0 তে নষ্ট হওয়ার মতো কিছু নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>এবার সেই LATIN1 Database এ একটা বাংলা শব্দ পাঠান:</ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, LATIN1 Database এ বাংলা",
          code: `postgres=# \\c createdb_latin
You are now connected to database "createdb_latin" as user "postgres".
createdb_latin=# SET client_encoding = 'UTF8';
SET
createdb_latin=# SELECT 'Café' AS word, octet_length('Café') AS bytes;
 word | bytes
------+-------
 Café |     4
(1 row)

createdb_latin=# SELECT 'দ্বীপ' AS word;
ERROR:  character with byte sequence 0xe0 0xa6 0xa6 in encoding "UTF8" has no equivalent in encoding "LATIN1"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Café এখানে 4 Byte, কারণ LATIN1 এ é এক Byte। কিন্তু দ্বীপ এর দ, UTF8 এ যার তিন Byte 0xe0 0xa6 0xa6, LATIN1
                এর খাতায় নেই, আর PostgreSQL ভুল কিছু জমা না করে থামিয়ে দিয়েছে। SET client_encoding লাইনটা Server কে
                জানায় psql কোন Encoding এ পাঠাচ্ছে; Server সেটা নিজের Encoding এ বদলায়, আর না পারলে এই Error।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিয়মটা ছোট: সবসময় UTF8",
          content: (
            <ContentParagraph>
              নতুন Database এর জন্য UTF8 ছাড়া অন্য কিছু বাছার বাস্তব কারণ প্রায় নেই। SQL_ASCII নামে একটা Setting ও আছে,
              কিন্তু PostgreSQL এর Documentation নিজেই বলে এটা আসলে কোনো Encoding ঘোষণা না, বরং “জানি না” বলার মতো,
              আর ASCII এর বাইরের Data থাকলে এটা ব্যবহার করা বুদ্ধিমানের কাজ না। Encoding জন্মের পরে আর ALTER DATABASE
              দিয়ে বদলানো যায় না; বদলাতে হলে নতুন Database বানিয়ে পুরো Data সেখানে সরাতে হয়।
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
                  এক Row তে তিনটা Column: বক্সের বর্তমান Database এর Encoding এর নাম (pg_database থেকে, লেখা হিসেবে),
                  তারপর <code className={CODE}>&apos;কক্সবাজার&apos;</code> শব্দের অক্ষর সংখ্যা, তারপর তার Byte সংখ্যা।
                </>
              }
              hint={
                <>
                  Encoding থাকে <code className={CODE}>encoding</code> Column এ সংখ্যা হিসেবে,{" "}
                  <code className={CODE}>pg_encoding_to_char(encoding)</code> সেটাকে নাম বানায়। সাথে{" "}
                  <code className={CODE}>char_length()</code> আর <code className={CODE}>octet_length()</code>, আর{" "}
                  <code className={CODE}>WHERE datname = current_database()</code>।
                </>
              }
              solution={`SELECT pg_encoding_to_char(encoding) AS encoding,
       char_length('কক্সবাজার')       AS characters,
       octet_length('কক্সবাজার')      AS bytes
FROM pg_database
WHERE datname = current_database();`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "locale-and-collation",
      subHeader: { index: "007", title: "Locale and Collation" },
      title: <SectionTitle>Locale আর Collation: কোন ভাষার নিয়মে সাজানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাংলা আর English অভিধান দুটোই বর্ণানুক্রমে সাজানো, কিন্তু নিয়ম আলাদা; Swedish এ å, ä, ö থাকে z এর পরে।
                Database কোন নিয়মে সাজাবে, সেটা বলার নাম Locale। এর দুটো অংশ জন্মের সময় চিরদিনের জন্য ঠিক হয়:{" "}
                <code className={CODE}>LC_COLLATE</code> সাজানোর ক্রম ঠিক করে (ORDER BY, তুলনা, Text Index), আর{" "}
                <code className={CODE}>LC_CTYPE</code> অক্ষরের স্বভাব (বড় হাত, ছোট হাত, upper() আর lower())।{" "}
                <code className={CODE}>LOCALE</code> লিখলে দুটো একসাথে বসে, আর দুটোর মিলিত নিয়মকে বলে Collation।
              </ContentParagraph>
              <ContentParagraph>
                Documentation বলে পরে বদলানো যায় না কারণ এরা Text Index এর ক্রম ঠিক করে, বদলালে Index নষ্ট হতো; পথ একটাই,
                নতুন Database। নিয়মগুলো যে দেয় তার নাম Locale Provider। সবচেয়ে প্রচলিত libc, মানে Operating System এর
                Library; Docker এ ছাঁচের Locale libc এর en_US.utf8, আর <code className={CODE}>C</code> শুধু Byte এর মান ধরে
                সাজায়। একই পাঁচটা শব্দ দুই Database এ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, একই Query দুই Database এ",
          code: `postgres=# CREATE DATABASE createdb_c LOCALE 'C' TEMPLATE template0;
CREATE DATABASE
postgres=# \\c createdb_c
You are now connected to database "createdb_c" as user "postgres".
createdb_c=# SELECT string_agg(w, ', ' ORDER BY w) AS sorted FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban'), ('Bandarban')) AS v(w);
                    sorted
-----------------------------------------------
 Bandarban, Sylhet, bandarban, কক্সবাজার, সিলেট
(1 row)

createdb_c=# \\c postgres
You are now connected to database "postgres" as user "postgres".
postgres=# SELECT string_agg(w, ', ' ORDER BY w) AS sorted FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban'), ('Bandarban')) AS v(w);
                    sorted
-----------------------------------------------
 bandarban, Bandarban, Sylhet, কক্সবাজার, সিলেট
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                C তে বড় হাতের অক্ষর সবার আগে, কারণ Byte এর মান কম, তাই Bandarban আর bandarban এর মাঝে Sylhet ঢুকে পড়েছে।
                en_US.utf8 এ দুটো Bandarban পাশাপাশি, অভিধানের মতো। দুই জায়গাতেই বাংলা Latin এর পরে, কারণ Unicode এ বাংলা
                লিপির জায়গা পরে। libc এর সীমাও আছে: OS এ Install না থাকা Locale চলে না, তাই Docker এ{" "}
                <code className={CODE}>LOCALE &apos;bn_BD.utf8&apos;</code> চাইতেই এল{" "}
                <code className={CODE}>ERROR: invalid LC_COLLATE locale name: &quot;bn_BD.utf8&quot;</code>।
              </ContentParagraph>
              <ContentParagraph>
                বক্সের নিয়ম দেখুন। একই শব্দ একবার Database এর নিয়মে, আরেকবার{" "}
                <code className={CODE}>COLLATE &quot;unicode&quot;</code> দিয়ে, যেটা বক্সে থাকা একটা ICU Collation। Column
                বা Query স্তরে Collation এর পুরো গল্প এই মডিউলের{" "}
                <Link href="/sql/topic/text-types" className={LINK}>
                  Text Types
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সের Locale, আর একই শব্দ দুই নিয়মে"
              query={`SELECT datlocprovider, datcollate, datctype
FROM pg_database
WHERE datname = current_database();

SELECT string_agg(w, ', ' ORDER BY w)                   AS database_default,
       string_agg(w, ', ' ORDER BY w COLLATE "unicode") AS with_unicode
FROM (VALUES ('banana'), ('Apple'), ('cherry'), ('apple'),
             ('Banana'), ('éclair'), ('zebra')) AS v(w);`}
              caption="প্রথম উত্তর: c | C | C.UTF-8। datlocprovider এ c মানে libc, সাজানোর নিয়ম C, অক্ষরের স্বভাব C.UTF-8। দ্বিতীয় উত্তরে বাম দিকে Apple, Banana, apple, banana, cherry, zebra, éclair, ডান দিকে apple, Apple, banana, Banana, cherry, éclair, zebra। বক্সের ক্রম তাই আপনার Docker এর en_US.utf8 থেকে আলাদা দেখাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ ছয়টা Database এর আসল ফল। বোতাম বদলে দেখুন কোন শব্দ সরে যায়, আর upper(&apos;éclair&apos;) কোথায়
              é কে বড় করে। ICU আর builtin এর ব্যাখ্যা পরের Section এ।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbCollationLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার মেশিনের ছাঁচ কোন Locale এ",
          content: (
            <ContentParagraph>
              নিজের psql এ <code className={CODE}>\l</code> দিয়ে template1 এর Collate দেখুন। Docker এ en_US.utf8; Homebrew
              বা Windows এ আপনার Operating System এর ভাষা থেকে অন্য কিছু আসতে পারে। মানে একই CREATE DATABASE দুই মেশিনে দুই
              রকম Database বানাতে পারে, তাই Team এ Locale সবসময় নিজে লিখে দিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "icu-and-builtin",
      subHeader: { index: "008", title: "ICU and Builtin Providers" },
      title: <SectionTitle>ICU আর builtin: বাংলার নিয়মে সাজানো Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                libc এর দুর্বলতা দুটো: macOS, Windows আর Linux এ একই নামের Locale একটু আলাদা চলতে পারে, আর OS Upgrade এ
                নিয়ম বদলালে পুরনো নিয়মে সাজানো Index আর মেলে না। PostgreSQL তাই প্রতিটা Database এর Collation Version রাখে{" "}
                <code className={CODE}>datcollversion</code> এ, এই Container এ glibc এর 2.41।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 15 থেকে Database এর Locale হিসেবে ICU চলে, Unicode এর নিয়ম মানা একটা Library যেটা সব OS এ একই
                রকম চলে আর বাংলা সহ শত শত ভাষা জানে। <code className={CODE}>bn-BD</code> মানে Bangladesh এর বাংলা,{" "}
                <code className={CODE}>und</code> মানে Unicode এর সাধারণ নিয়ম। আর PostgreSQL 17 থেকে আছে builtin, বাইরের
                Library ছাড়া PostgreSQL এর নিজের Provider:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, ICU আর builtin",
          code: `postgres=# CREATE DATABASE createdb_bn LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD';
ERROR:  new locale provider (icu) does not match locale provider of the template database (libc)
HINT:  Use the same locale provider as in the template database, or use template0 as template.
postgres=# CREATE DATABASE createdb_bn LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD' TEMPLATE template0;
CREATE DATABASE
postgres=# CREATE DATABASE createdb_und LOCALE_PROVIDER icu ICU_LOCALE 'und' TEMPLATE template0;
CREATE DATABASE
postgres=# CREATE DATABASE createdb_typo LOCALE_PROVIDER icu ICU_LOCALE 'bd-BN' TEMPLATE template0;
WARNING:  ICU locale "bd-BN" has unknown language "bd"
HINT:  To disable ICU locale validation, set the parameter "icu_validation_level" to "disabled".
CREATE DATABASE
postgres=# CREATE DATABASE createdb_builtin LOCALE_PROVIDER builtin BUILTIN_LOCALE 'C.UTF-8' TEMPLATE template0;
CREATE DATABASE
postgres=# CREATE DATABASE createdb_fast LOCALE_PROVIDER builtin BUILTIN_LOCALE 'PG_UNICODE_FAST' TEMPLATE template0;
CREATE DATABASE`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>প্রথম Error</strong> আবার ছাঁচের নিয়ম: Provider, Encoding বা Locale, যেকোনোটা ছাঁচ থেকে আলাদা
                  হলেই template0।
                </ListItem>
                <ListItem>
                  <strong>bd-BN</strong> টাইপো, তবু শুধু WARNING দিয়ে Database তৈরি হলো, এটা{" "}
                  <code className={CODE}>icu_validation_level</code> এর ডিফল্ট। WARNING দেখলে DROP করে আবার বানান।
                </ListItem>
                <ListItem>
                  <strong>builtin</strong> এর Locale তিনটা: C, C.UTF-8 আর PostgreSQL 18 এ আসা PG_UNICODE_FAST। তিনটাই
                  সাজায় Code Point ধরে, পার্থক্য অক্ষরের স্বভাবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, ICU und, ICU bn-BD আর builtin",
          code: `createdb_und=# SELECT string_agg(w, ', ' ORDER BY w) AS sorted FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban'), ('Bandarban')) AS v(w);
                    sorted
-----------------------------------------------
 bandarban, Bandarban, Sylhet, কক্সবাজার, সিলেট
(1 row)

createdb_bn=# SELECT string_agg(w, ', ' ORDER BY w) AS sorted FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban'), ('Bandarban')) AS v(w);
                    sorted
-----------------------------------------------
 কক্সবাজার, সিলেট, bandarban, Bandarban, Sylhet
(1 row)

createdb_builtin=# SELECT string_agg(w, ', ' ORDER BY w) AS sorted FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban'), ('Bandarban')) AS v(w);
                    sorted
-----------------------------------------------
 Bandarban, Sylhet, bandarban, কক্সবাজার, সিলেট
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                bn-BD এর ফলটাই মূল কথা: বাংলা লিপি আগে, তারপর Latin, বাংলাভাষী Customer এর কাছে যেটা স্বাভাবিক। und আর
                en_US.utf8 একই ক্রম দিয়েছে, builtin দিয়েছে C এর ক্রম। builtin এর দুই Locale এর পার্থক্য upper() এ:
                Documentation অনুযায়ী C.UTF-8 এ Unicode এর “simple” Case নিয়ম, PG_UNICODE_FAST এ “full”। এই Container এ
                upper(&apos;straße&apos;) দিল C.UTF-8 এ <code className={CODE}>STRAßE</code>, PG_UNICODE_FAST আর ICU এ{" "}
                <code className={CODE}>STRASSE</code>।
              </ContentParagraph>
              <ContentParagraph>
                বক্সে ICU আর builtin দুটোই আছে, তবে ICU এর সব ভাষা নেই। <code className={CODE}>pg_collation</code> থেকে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সে কোন ICU আর builtin Collation আছে"
              query={`SELECT collname, collprovider, colllocale
FROM pg_collation
WHERE collprovider IN ('b', 'i')
ORDER BY collname;`}
              caption="পাঁচ Row। collprovider এ b মানে builtin, i মানে ICU। builtin এর pg_c_utf8 (C.UTF-8), pg_unicode_fast আর ucs_basic, ICU এর শুধু und-x-icu আর unicode, দুটোই und। বক্সে bn এর ICU Collation নেই, তাই বাংলার নিয়মে সাজানো শুধু আপনার নিজের PostgreSQL এ দেখা যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Provider", "নিয়ম আসে কোথা থেকে", "কখন বাছবেন", "সাবধান"],
          rows: [
            [
              "libc",
              "Operating System এর glibc বা তার সমতুল্য",
              "পুরনো Server এর সাথে মিল রাখতে, বা ছাঁচ যা দেয় তাতে সন্তুষ্ট হলে",
              "OS Upgrade এ ক্রম বদলাতে পারে; যে Locale Install নেই তা চলে না",
            ],
            [
              "icu",
              "ICU Library, Unicode এর নিয়ম",
              "মানুষের ভাষার নিয়মে সাজানো দরকার, যেমন bn-BD; সব OS এ একই আচরণ চাই",
              "template0 লাগে; ভুল নাম দিলে শুধু WARNING, Error না",
            ],
            [
              "builtin",
              "PostgreSQL নিজে, PostgreSQL 17 থেকে",
              "দ্রুত, স্থির, Upgrade এ না বদলানো ক্রম চাই, ভাষার নিয়ম লাগবে না",
              "সাজায় Code Point ধরে, মানুষের চোখে অভিধানের মতো না",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "every-option",
      subHeader: { index: "009", title: "Every Option in One Statement" },
      title: <SectionTitle>CREATE DATABASE এর বাকি অপশনগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণ যা শিখলেন, সব একটা Statement এ আনলে এমন দেখায়। শুধু প্রথম লাইনটা বাধ্যতামূলক, বাকি সবকিছু ঐচ্ছিক,
              আর না দিলে মান আসে ছাঁচ থেকে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো তালিকা psql নিজেই দেখায়, Module 02 এ দেখেছিলেন <code className={CODE}>\h</code> দিয়ে Synopsis পড়তে।
              বর্গবন্ধনী মানে ঐচ্ছিক, আর <code className={CODE}>[=]</code> মানে সমান চিহ্ন দিলেও চলে, না দিলেও। PostgreSQL
              18 এ:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, \\h CREATE DATABASE",
          code: `Command:     CREATE DATABASE
Description: create a new database
Syntax:
CREATE DATABASE name
    [ WITH ] [ OWNER [=] user_name ]
           [ TEMPLATE [=] template ]
           [ ENCODING [=] encoding ]
           [ STRATEGY [=] strategy ]
           [ LOCALE [=] locale ]
           [ LC_COLLATE [=] lc_collate ]
           [ LC_CTYPE [=] lc_ctype ]
           [ BUILTIN_LOCALE [=] builtin_locale ]
           [ ICU_LOCALE [=] icu_locale ]
           [ ICU_RULES [=] icu_rules ]
           [ LOCALE_PROVIDER [=] locale_provider ]
           [ COLLATION_VERSION = collation_version ]
           [ TABLESPACE [=] tablespace_name ]
           [ ALLOW_CONNECTIONS [=] allowconn ]
           [ CONNECTION LIMIT [=] connlimit ]
           [ IS_TEMPLATE [=] istemplate ]
           [ OID [=] oid ]

URL: https://www.postgresql.org/docs/18/sql-createdatabase.html`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অপশন", "কী করে", "কখন লাগে"],
          rows: [
            [
              "STRATEGY",
              "Copy কীভাবে হবে: WAL_LOG (PostgreSQL 15 থেকে ডিফল্ট) Block ধরে Copy করে প্রতিটা WAL এ লেখে; FILE_COPY পুরো Folder Copy করে, আগে আর পরে Checkpoint চালায়",
              "প্রায় কখনো না। ছাঁচ খুব বড় হলে FILE_COPY এর কথা Docs এ আছে",
            ],
            ["TABLESPACE", "Database এর ফাইল Disk এর কোন জায়গায় থাকবে", "আলাদা Disk এ Data রাখতে, বড় Server এ"],
            ["ALLOW_CONNECTIONS", "false দিলে কেউ Connect করতে পারে না, template0 এর মতো", "ছাঁচ বানাতে, বা Maintenance এর সময় দরজা বন্ধ রাখতে"],
            ["CONNECTION LIMIT", "একসাথে কতগুলো Connection; -1 মানে সীমা নেই", "একটা App যেন পুরো Server এর Connection না খেয়ে ফেলে"],
            ["IS_TEMPLATE", "true দিলে এটা নিজেই ছাঁচ, CREATEDB থাকা যে কেউ Copy করতে পারে", "প্রতিবার একই শুরুর Data সহ Test Database বানাতে"],
            ["COLLATION_VERSION, OID", "Collation এর Version আর Database এর ভেতরের নম্বর হাতে বসানো", "pg_upgrade এর মতো Tool নিজে ব্যবহার করে, আপনি না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনটা অপশন হাতে চালিয়ে দেখা যাক, কারণ তাদের Error গুলো Production এ সত্যিই দেখা যায়। island_limit এ সীমা
              একটা Connection, Owner island_app। island_template নিজেই একটা ছাঁচ। island_closed এ কেউ ঢুকতে পারে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql আর Terminal, তিনটা অপশন",
          code: `postgres=# CREATE DATABASE island_limit CONNECTION LIMIT 1 OWNER island_app;
CREATE DATABASE
postgres=# CREATE DATABASE island_template IS_TEMPLATE true;
CREATE DATABASE
postgres=# CREATE DATABASE island_closed ALLOW_CONNECTIONS false;
CREATE DATABASE
postgres=# CREATE DATABASE island_from_tpl TEMPLATE island_template;
CREATE DATABASE
postgres=# DROP DATABASE island_template;
ERROR:  cannot drop a template database
postgres=# ALTER DATABASE island_template IS_TEMPLATE false;
ALTER DATABASE
postgres=# DROP DATABASE island_template;
DROP DATABASE

# Terminal থেকে, island_app এর একটা Session আগে থেকেই island_limit এ খোলা
$ psql -U island_app -d island_limit
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  too many connections for database "island_limit"

$ psql -U postgres -d island_closed
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "island_closed" is not currently accepting connections`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছাঁচ হিসেবে চিহ্নিত Database মোছা যায় না, তাই আগে IS_TEMPLATE false করতে হয়, template1 কে ভুল করে মুছে
                ফেলা থেকে বাঁচাতে এই নিয়ম। আর CONNECTION LIMIT superuser এর ওপর খাটে না: Documentation এ লেখা আছে, আর
                এই Container এ island_app এর Session খোলা থাকা অবস্থাতেই postgres হয়ে island_limit এ ঢোকা গেছে।
              </ContentParagraph>
              <ContentParagraph>
                জন্মের পরে কয়েকটা জিনিস <code className={CODE}>ALTER DATABASE</code> দিয়ে বদলানো যায়: নাম (
                <code className={CODE}>RENAME TO</code>), Owner (<code className={CODE}>OWNER TO</code>), CONNECTION LIMIT,
                ALLOW_CONNECTIONS, IS_TEMPLATE, আর সেই Database এ ঢুকলেই চালু হবে এমন Setting, যেমন{" "}
                <code className={CODE}>ALTER DATABASE island_tours_dev SET timezone TO &apos;Asia/Dhaka&apos;;</code>। কিন্তু
                Encoding, LC_COLLATE আর LC_CTYPE কখনো না। তাই এই লেসনের মূল পরামর্শ: ওই তিনটা প্রথম দিনেই ঠিক করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সের Database গুলোর দরজা আর সীমা"
              query={`SELECT datname, datconnlimit, datallowconn, datistemplate
FROM pg_database
ORDER BY datname;`}
              caption="তিন Row, তিনটারই datconnlimit -1, মানে কোনো সীমা নেই। datallowconn শুধু template0 এ f, আর datistemplate দুই template এ t। উপরের Terminal এর দুটো FATAL Error এই দুটো Column থেকেই আসে।"
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
                  বক্সের Server এর যেসব Database এ কেউ Connect করতে পারে না, শুধু তাদের নাম দেখান।
                </>
              }
              hint={
                <>
                  <code className={CODE}>datallowconn</code> একটা boolean। “পারে না” মানে{" "}
                  <code className={CODE}>WHERE NOT datallowconn</code>।
                </>
              }
              solution={`SELECT datname
FROM pg_database
WHERE NOT datallowconn;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "createdb-and-dropdb",
      subHeader: { index: "010", title: "createdb and dropdb" },
      title: <SectionTitle>Terminal থেকে: createdb আর dropdb</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL এর সাথে psql এর পাশাপাশি দুটো ছোট Program আসে: <code className={CODE}>createdb</code> আর{" "}
                <code className={CODE}>dropdb</code>। Documentation এর ভাষায় createdb হলো CREATE DATABASE এর চারপাশে একটা
                Wrapper, সুবিধার জন্য। মানে সে নিজে কোনো জাদু করে না, Server এ Connect করে ঠিক সেই SQL পাঠায়। কোন SQL
                পাঠাল, সেটা <code className={CODE}>-e</code> (echo) দিলে দেখা যায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal, Docker এর island-pg Container এ",
          code: `$ docker exec island-pg createdb -U postgres island_tours_staging
$ docker exec island-pg createdb -U postgres island_tours_staging
createdb: error: database creation failed: ERROR:  database "island_tours_staging" already exists

$ docker exec island-pg createdb -U postgres -e -O island_app -E UTF8 \\
    --locale-provider=icu --icu-locale=bn-BD -T template0 island_tours_bn
SELECT pg_catalog.set_config('search_path', '', false);
CREATE DATABASE island_tours_bn OWNER island_app ENCODING 'UTF8' TEMPLATE template0 LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD';

$ docker exec island-pg createdb -U postgres -e island_tours_x "Development copy"
SELECT pg_catalog.set_config('search_path', '', false);
CREATE DATABASE island_tours_x;
COMMENT ON DATABASE island_tours_x IS 'Development copy';`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>সফল হলে চুপ:</strong> কিছু ছাপা না হওয়াই সাফল্য; Script এ বোঝা যায় Exit Code 0 থেকে, ব্যর্থ হলে 1।
                </ListItem>
                <ListItem>
                  <strong>ব্যর্থ হলে</strong> createdb নিজের “creation failed” এর পরে হুবহু Server এর ERROR জুড়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Flag একটা Clause:</strong> -O OWNER, -E ENCODING, -T TEMPLATE; নামের পরের লেখা হয় COMMENT
                  ON DATABASE। নাম না দিলে, Help অনুযায়ী, বর্তমান User এর নামে Database হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <code className={CODE}>set_config(&apos;search_path&apos;, &apos;&apos;, false)</code> একটা নিরাপত্তার
                অভ্যাস, যাতে কেউ একই নামের Function বানিয়ে Program টাকে ঠকাতে না পারে। আর SQL পাঠাতে createdb নিজে postgres
                Database এ Connect করে, Help এ যার নাম <code className={CODE}>--maintenance-db</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["createdb এর Flag", "CREATE DATABASE এর Clause", "dropdb এর Flag", "DROP DATABASE এর অংশ"],
          rows: [
            ["-O, --owner", "OWNER", "--if-exists", "IF EXISTS"],
            ["-T, --template", "TEMPLATE", "-f, --force", "WITH (FORCE)"],
            ["-E, --encoding", "ENCODING", "-i, --interactive", "SQL এ নেই; মোছার আগে জিজ্ঞেস করে"],
            ["-l, --locale", "LOCALE", "-e, --echo", "পাঠানো SQL দেখায়"],
            ["--locale-provider, --icu-locale, --builtin-locale", "LOCALE_PROVIDER, ICU_LOCALE, BUILTIN_LOCALE", "", ""],
            ["-S, --strategy আর -D, --tablespace", "STRATEGY আর TABLESPACE", "", ""],
            ["নামের পরে দ্বিতীয় লেখা", "আলাদা COMMENT ON DATABASE", "", ""],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal, dropdb",
          code: `$ docker exec island-pg dropdb -U postgres -e island_tours_x
SELECT pg_catalog.set_config('search_path', '', false);
DROP DATABASE island_tours_x;

$ docker exec island-pg dropdb -U postgres --if-exists island_tours_x
NOTICE:  database "island_tours_x" does not exist, skipping

$ docker exec island-pg dropdb -U postgres island_tours_x
dropdb: error: database removal failed: ERROR:  database "island_tours_x" does not exist`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এর ভেতরে SQL, Terminal Script বা CI তে createdb আর dropdb, কারণ Exit Code দিয়ে সাফল্য বোঝা সহজ। Docker
              ছাড়া চালালে <code className={CODE}>docker exec island-pg</code> বাদ দিন; Password লাগলে createdb নিজেই Prompt
              দেখাবে, Command এ কখনো লিখবেন না। <code className={CODE}>dropdb -i</code> মোছার আগে একবার জিজ্ঞেস করে, SQL
              এর DROP DATABASE এ এমন কিছু নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "drop-database",
      subHeader: { index: "011", title: "DROP DATABASE, IF EXISTS and FORCE" },
      title: <SectionTitle>DROP DATABASE: কোনো Recycle Bin নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাড়ি ভাঙলে প্রতিটা ঘর আর আসবাব একসাথে যায়। DROP DATABASE তাই: প্রতিটা Table, Row, Schema আর Disk এর
                ফাইল, এক Command এ। “আপনি কি নিশ্চিত?” নেই, Recycle Bin নেই। ফেরত আনার উপায় শুধু আগে নেওয়া Backup, Module
                18 এর{" "}
                <Link href="/sql/topic/pg-dump-restore" className={LINK}>
                  pg_dump and pg_restore
                </Link>{" "}
                লেসনে। Module 12 এ দেখবেন বেশিরভাগ বদল ROLLBACK দিয়ে ফেরানো যায়, কিন্তু CREATE আর DROP DATABASE
                Transaction এর ভেতরে চলতেই রাজি না। তবে PostgreSQL কয়েক জায়গায় আপনাকে থামায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, DROP DATABASE এর সব রূপ",
          code: `postgres=# DROP DATABASE createdb_latin;
DROP DATABASE
postgres=# DROP DATABASE createdb_latin;
ERROR:  database "createdb_latin" does not exist
postgres=# DROP DATABASE IF EXISTS createdb_latin;
NOTICE:  database "createdb_latin" does not exist, skipping
DROP DATABASE
postgres=# DROP DATABASE postgres;
ERROR:  cannot drop the currently open database
postgres=# DROP DATABASE template1;
ERROR:  cannot drop a template database
postgres=# BEGIN;
BEGIN
postgres=*# DROP DATABASE createdb_c;
ERROR:  DROP DATABASE cannot run inside a transaction block
postgres=!# ROLLBACK;
ROLLBACK
postgres=# \\c createdb_c
You are now connected to database "createdb_c" as user "postgres".
createdb_c=# DROP DATABASE createdb_c WITH (FORCE);
ERROR:  cannot drop the currently open database`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>IF EXISTS:</strong> নেই এমন Database এ Error এর বদলে NOTICE, কাজ সফল। DROP এ IF EXISTS আছে,
                  CREATE এ IF NOT EXISTS নেই, এই অসমতা মনে রাখুন।
                </ListItem>
                <ListItem>
                  <strong>নিজের বর্তমান Database</strong> মোছা যায় না, FORCE দিয়েও না; আগে{" "}
                  <code className={CODE}>\c postgres</code>। ছাঁচও মোছা যায় না।
                </ListItem>
                <ListItem>
                  <strong>Transaction:</strong> BEGIN এর পরে Error, প্রম্পট হলো =!#, মানে ROLLBACK ছাড়া আর কিছু চলবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সবচেয়ে বাস্তব অবস্থা: একটা Window তে island_app island_tours_staging এ বসে, আরেকটায় postgres সেটা মুছতে চায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Window 2, postgres হয়ে",
          code: `postgres=# SELECT datname, usename, state FROM pg_stat_activity WHERE datname = 'island_tours_staging';
       datname        |  usename   | state
----------------------+------------+-------
 island_tours_staging | island_app | idle
(1 row)

postgres=# DROP DATABASE island_tours_staging;
ERROR:  database "island_tours_staging" is being accessed by other users
DETAIL:  There is 1 other session using the database.
postgres=# DROP DATABASE island_tours_staging WITH (FORCE);
DROP DATABASE`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Window 1, island_app এর পরের Query",
          code: `island_tours_staging=> SELECT count(*) FROM pg_class;
FATAL:  terminating connection due to administrator command
server closed the connection unexpectedly
        This probably means the server terminated abnormally
        before or while processing the request.
The connection to the server was lost. Attempting reset: Failed.
The connection to the server was lost. Attempting reset: Failed.
!?>`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাধারণ DROP অন্যের Session দেখে থেমেছে, এই Container এ থামার আগে প্রায় পাঁচ সেকেন্ড অপেক্ষা করে। কেউ কাজ
                করছেন এমন Database ভুল করে মোছে না। PostgreSQL 13 এ আসা <code className={CODE}>WITH (FORCE)</code>{" "}
                Documentation অনুযায়ী আগে বাকি Connection বন্ধ করে, শুধু যেগুলো বন্ধের অধিকার আপনার আছে, তারপর মোছে;
                Prepared Transaction, Logical Replication Slot বা Subscription থাকলে বন্ধ করে না, আর কোনো Connection রয়ে
                গেলে ব্যর্থ হয়। Window 1 এর মানুষটি কোনো সতর্কবার্তা পাননি, তাই FORCE এর আগে তাঁকে জানান।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 12 বা আগের Server এ FORCE নেই; সেখানে আগে{" "}
                <code className={CODE}>pg_terminate_backend(pid)</code> দিয়ে প্রতিটা Session বন্ধ, তারপর DROP। Lab এ চার
                অবস্থা আর তিন Command এর বারোটা মিলন, আসল উত্তর সহ:
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbDropLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বক্সেও DROP DATABASE চলে, তাই নিরাপদ একটা পরীক্ষা করা যাক: নেই এমন একটা নাম IF EXISTS দিয়ে, তারপর বক্স যে
              Database এ বসে আছে সেটাই। দ্বিতীয়টা কখনো সফল হবে না, তাই কিছু ভাঙার ভয় নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সে DROP DATABASE এর দুই উত্তর"
              query={`DROP DATABASE IF EXISTS createdb_gone;

DROP DATABASE postgres;`}
              caption="প্রথমটার উত্তর DROP, যদিও মোছার মতো কিছু ছিল না; বক্স NOTICE দেখায় না, psql দেখাত। দ্বিতীয়টায় ERROR: cannot drop the currently open database। বক্স সারাক্ষণ postgres এর ভেতরে, তাই এই Database টা বক্স থেকে কখনো মোছা যাবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DROP DATABASE চালানোর আগে তিনটা প্রশ্ন",
          content: (
            <ContentList>
              <ListItem>
                আমি কোন Server এ আছি? <code className={CODE}>\conninfo</code> দেখুন। Laptop ভেবে Production এ DROP চালানো
                এই পেশার সবচেয়ে পুরনো দুঃস্বপ্নগুলোর একটা।
              </ListItem>
              <ListItem>এই নামটাই কি মুছতে চাই? island_tours_dev আর island_tours দেখতে প্রায় এক।</ListItem>
              <ListItem>দরকার হলে ফেরত আনার মতো Backup আছে কি, আর সেটা থেকে Restore কখনো করে দেখেছি কি?</ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "one-database-per-app",
      subHeader: { index: "012", title: "One Database per App and Environment" },
      title: <SectionTitle>প্রতিটা App আর প্রতিটা পরিবেশের নিজের Database, আর নামের নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Theory এর ঘটনায় Test আর Demo একই Database এ ছিল। সমাধান দেয়াল তোলা, আর PostgreSQL এ Database এর দেয়াল
                সত্যিই শক্ত: এক Database এর Query আরেকটার Table ছুঁতেও পারে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অন্য Database এর Table পড়ার চেষ্টা"
              query={`SELECT count(*) FROM template1.public.tours;`}
              caption="ERROR: cross-database references are not implemented: “template1.public.tours”। তিন অংশের নাম লিখলে প্রথম অংশটা Database এর নাম হিসেবে পড়া হয়, আর PostgreSQL বর্তমান Database এর বাইরের কিছু পড়তে রাজি না। আপনার psql এও একই Error, island_tours থেকে island_tours_dev.public.tours পড়তে চাইলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>এক App, এক Database:</strong> পরে আলাদা Accounting App এলে তার নিজের Database, যাতে একটার
                  Migration আরেকটা না ভাঙে আর Backup আলাদা হয়। একই App এর ভেতরে ভাগ করতে Schema, Module 02 এ যেমন দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>এক পরিবেশ, এক Database:</strong> Laptop এ <code className={CODE}>_dev</code> আর{" "}
                  <code className={CODE}>_test</code>, Staging আর Production আলাদা Server এ।
                </ListItem>
                <ListItem>
                  <strong>Code জানে না কোন Database:</strong> App শুধু Environment Variable থেকে DATABASE_URL পড়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CreatedbEnvironmentsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Test এর জন্য একটা পাহারা: শুরুর আগে Code দেখে নেয় DATABASE_URL এর নাম <code className={CODE}>_test</code>{" "}
              দিয়ে শেষ কিনা। নির্দিষ্ট নাম হাতে লেখা নেই, শুধু গঠন দেখা হয়। নিচের অংশটা তিনভাবে চালিয়ে দেখা:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "test/assert-test-database.mjs",
          code: `const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const dbName = decodeURIComponent(new URL(url).pathname.slice(1));
if (!dbName.endsWith("_test")) {
  throw new Error(\`Refusing to reset "\${dbName}": tests may only touch a *_test database\`);
}

console.log(\`resetting \${dbName}\`);

// DATABASE_URL নেই          -> Error: DATABASE_URL is not set
// ...5432/island_tours_dev  -> Error: Refusing to reset "island_tours_dev": tests may only touch a *_test database
// ...5432/island_tours_test -> resetting island_tours_test`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নাম। Table আর Column এর নামের পুরো নিয়ম পরের লেসন{" "}
                <Link href="/sql/topic/create-table" className={LINK}>
                  CREATE TABLE and Naming
                </Link>{" "}
                এ। Database এর নামের চারটা বিপদ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, নামের চার রকম বিপদ",
          code: `postgres=# CREATE DATABASE island-tours;
ERROR:  syntax error at or near "-"
LINE 1: CREATE DATABASE island-tours;
                              ^
postgres=# CREATE DATABASE "Island Tours";
CREATE DATABASE
postgres=# CREATE DATABASE IslandTours;
CREATE DATABASE
postgres=# CREATE DATABASE island_tours_with_a_really_long_name_for_the_staging_environment_copy;
NOTICE:  identifier "island_tours_with_a_really_long_name_for_the_staging_environment_copy" will be truncated to "island_tours_with_a_really_long_name_for_the_staging_environmen"
CREATE DATABASE
postgres=# CREATE DATABASE user;
ERROR:  syntax error at or near "user"
LINE 1: CREATE DATABASE user;
                        ^
postgres=# SELECT datname FROM pg_database WHERE datname NOT LIKE 'template%' ORDER BY datname;
                             datname
-----------------------------------------------------------------
 Island Tours
 island_tours_with_a_really_long_name_for_the_staging_environmen
 islandtours
 postgres
(4 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>হাইফেন বিয়োগ চিহ্ন।</strong> SQL এর চোখে <code className={CODE}>island-tours</code> মানে island
                  বিয়োগ tours, তাই Syntax Error। শব্দের মাঝে Underscore দিন: island_tours। এটাই ছিল তানিমের ভুল।
                </ListItem>
                <ListItem>
                  <strong>বড় হাতের অক্ষর চুপচাপ ছোট হয়।</strong> IslandTours লিখলেন, তৈরি হলো islandtours। উদ্ধৃতি চিহ্ন
                  দিয়ে লিখলে বড় হাত আর Space থেকে যায়, কিন্তু তারপর প্রতিবার ঠিক ওইভাবে উদ্ধৃতি সহ লিখতে হবে, যেমন{" "}
                  <code className={CODE}>\c &quot;Island Tours&quot;</code>। এক জায়গায় ভুললেই Database “নেই”।
                </ListItem>
                <ListItem>
                  <strong>63 Byte এর সীমা।</strong> লম্বা নাম Error দেয় না, শুধু NOTICE দিয়ে কেটে ফেলে। পরে পুরো নাম দিয়ে
                  খুঁজলে পাবেন না।
                </ListItem>
                <ListItem>
                  <strong>সংরক্ষিত শব্দ।</strong> user, order, table এর মতো SQL এর নিজের শব্দ উদ্ধৃতি ছাড়া নাম হতে পারে
                  না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই Database এর নামের জন্য একটা সহজ ছক: ছোট হাতের English অক্ষর, সংখ্যা আর Underscore; শুরুতে App এর নাম,
                শেষে পরিবেশ। island_tours_dev, island_tours_test, Server এ শুধু island_tours। কোন নাম উদ্ধৃতি ছাড়া চলবে,
                সেটা PostgreSQL কে দিয়েই যাচাই করানো যায়: <code className={CODE}>quote_ident()</code> যে নামের চারপাশে
                উদ্ধৃতি বসায়, সেটা উদ্ধৃতি ছাড়া চলবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন নাম উদ্ধৃতি চায়, আর 63 Byte এর কাঁচি"
              query={`SELECT name,
       quote_ident(name)          AS write_it_as,
       quote_ident(name) <> name  AS needs_quotes
FROM (VALUES ('island_tours_dev'), ('island-tours'), ('IslandTours'),
             ('Island Tours'), ('order'), ('island_tours_2026')) AS v(name);

SELECT octet_length('island_tours_with_a_really_long_name_for_the_staging_environment_copy')       AS typed,
       octet_length('island_tours_with_a_really_long_name_for_the_staging_environment_copy'::name) AS kept;`}
              caption="প্রথম ফলাফলে ছয় Row: island_tours_dev আর island_tours_2026 যেমন আছে তেমন চলে (f), বাকি চারটা উদ্ধৃতি চায় (t)। দ্বিতীয়টায় 69 | 63: name Type এ রাখতেই 69 Byte এর নাম 63 এ কাটা পড়ল, CREATE DATABASE এর NOTICE ঠিক এটাই বলছিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  চারটা প্রস্তাবিত নাম: <code className={CODE}>island_tours_dev</code>,{" "}
                  <code className={CODE}>island-tours</code>, <code className={CODE}>IslandTours</code> আর{" "}
                  <code className={CODE}>order</code>। VALUES দিয়ে এগুলোকে একটা Column বানান, তারপর দুটো Column দেখান: নাম, আর
                  উদ্ধৃতি লাগবে কিনা (true বা false), নাম অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM (VALUES (&apos;island_tours_dev&apos;), ...) AS v(name)</code>, দ্বিতীয় Column{" "}
                  <code className={CODE}>quote_ident(name) &lt;&gt; name</code>, শেষে{" "}
                  <code className={CODE}>ORDER BY name</code>। বক্সের Collation C, তাই বড় হাতের নাম আগে আসবে।
                </>
              }
              solution={`SELECT name, quote_ident(name) <> name AS needs_quotes
FROM (VALUES ('island_tours_dev'), ('island-tours'), ('IslandTours'), ('order')) AS v(name)
ORDER BY name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ: IF NOT EXISTS আছে, ছাঁচ নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL ভিডিও দেখছেন, সেখানে Database বানানোর অংশটা এই লেসনের সাথে মিলিয়ে দেখার মতো, কারণ দুই
                Database এর এখানে পার্থক্য অনেক। সবচেয়ে বড় কথা Module 02 এ দেখেছেন: MySQL এ DATABASE আর SCHEMA একই
                জিনিস, PostgreSQL এর মতো Database এর ভেতরে আলাদা Schema এর স্তর নেই। MySQL 8.4 এর একটা আসল Session:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, MySQL 8.4.11",
          code: `mysql> CREATE DATABASE island_tours;
Query OK, 1 row affected (0.00 sec)

mysql> CREATE DATABASE island_tours;
ERROR 1007 (HY000): Can't create database 'island_tours'; database exists
mysql> CREATE DATABASE IF NOT EXISTS island_tours;
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+-------------------------------------------------------+
| Level | Code | Message                                               |
+-------+------+-------------------------------------------------------+
| Note  | 1007 | Can't create database 'island_tours'; database exists |
+-------+------+-------------------------------------------------------+
1 row in set (0.00 sec)

mysql> SHOW CREATE DATABASE island_tours\\G
*************************** 1. row ***************************
       Database: island_tours
Create Database: CREATE DATABASE \`island_tours\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
1 row in set (0.00 sec)

mysql> CREATE SCHEMA island_tours_test;
Query OK, 1 row affected (0.08 sec)

mysql> USE island_tours;
Database changed
mysql> SELECT DATABASE();
+--------------+
| DATABASE()   |
+--------------+
| island_tours |
+--------------+
1 row in set (0.00 sec)

mysql> DROP DATABASE island_tours;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)

mysql> DROP DATABASE island_tours;
ERROR 1008 (HY000): Can't drop database 'island_tours'; database doesn't exist
mysql> DROP DATABASE IF EXISTS island_tours;
Query OK, 0 rows affected, 1 warning (0.01 sec)`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["CREATE এর IF NOT EXISTS", "নেই, Syntax Error; বদলে \\gexec কৌশল", "আছে, থাকলে Note 1007 আর কাজ সফল"],
            ["DROP এর IF EXISTS", "আছে, NOTICE দেয়", "আছে, Warning গুনে দেখায়"],
            ["CREATE SCHEMA", "Database এর ভেতরে আলাদা স্তর", "CREATE DATABASE এর আরেক নাম"],
            ["নতুন Database কোথা থেকে", "ছাঁচ Copy: template1 বা template0", "Data Directory তে নতুন একটা Folder, ছাঁচ নেই"],
            ["Owner", "OWNER Clause আছে", "নেই; অধিকার শুধু GRANT দিয়ে"],
            [
              "লেখা আর সাজানোর নিয়ম",
              "ENCODING, LOCALE, ICU_LOCALE, জন্মের পরে বদলায় না",
              "CHARACTER SET আর COLLATE, ডিফল্ট utf8mb4 আর utf8mb4_0900_ai_ci, পরে ALTER DATABASE দিয়ে বদলানো যায়",
            ],
            ["ভেতরে ঢোকা", "\\c dbname, নতুন Connection", "USE dbname, একই Connection"],
            ["এখন কোথায়", "current_database()", "DATABASE(), কোথাও না থাকলে NULL"],
            ["নিজের বর্তমান Database মোছা", "ERROR: cannot drop the currently open database", "চলে, তারপর DATABASE() হয় NULL"],
            ["অন্য কেউ Connect থাকলে", "থামে, অথবা WITH (FORCE)", "FORCE এর মতো কোনো অপশন নেই"],
            ["নামের বড় হাত", "উদ্ধৃতি ছাড়া ছোট হাতে বদলে যায়", "যেমন লিখলেন তেমন থাকে; Linux এ IslandTours আর islandtours আলাদা"],
            ["হাইফেন সহ নাম", "\"island-tours\" উদ্ধৃতি সহ", "`island-tours` Backtick সহ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো সারি আলাদা করে মনে রাখুন। MySQL এ USE করার পরেও নিজের Database মোছা যায়, DATABASE() তখন NULL, MySQL
                8.4 এর Documentation ও তাই বলে। আর MySQL এ প্রতিটা Database Disk এ একটা Folder, তাই নামের বড় হাত File
                System এর ওপর নির্ভর করে: Documentation অনুযায়ী lower_case_table_names এর ডিফল্ট Unix এ 0, Windows এ 1,
                macOS এ 2; এই Linux Container এ 0, আর IslandTours বড় হাত সহই তৈরি হয়েছিল। তাই MySQL এও ছোট হাতের নাম নিরাপদ।
                ভিডিওর <code className={CODE}>CREATE DATABASE IF NOT EXISTS shop; USE shop;</code> এর PostgreSQL অনুবাদ হলো
                Section 003 এর \gexec লাইন, তারপর <code className={CODE}>\c shop</code>।
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
      title: <SectionTitle>তানিমের Setup Script: দুটো Database, এক Command এ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিম চান এমন একটা Script, যেটা Team এর যে কেউ চালালে একই রকম দুটো Database পাবেন: island_tours_dev আর
                island_tours_test, Owner App এর Role, Encoding UTF8, Locale ICU এর bn-BD। বারবার চালালে কিছু ভাঙবে না, আর
                দরকারি তথ্য না পেলে জোরে থামবে। নাম, Owner আর Locale আসে Environment Variable থেকে;{" "}
                <code className={CODE}>{"${VAR:?message}"}</code> Variable না থাকলে বার্তা দেখিয়ে Script থামায়। শুধু UTF8
                লেখা, কারণ ওটা পছন্দ না, Section 006 এর নিয়ম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "scripts/create-app-databases.sh",
          code: `#!/usr/bin/env bash
set -euo pipefail

: "\${APP_DB_NAME:?APP_DB_NAME is not set}"
: "\${APP_DB_OWNER:?APP_DB_OWNER is not set}"
: "\${APP_DB_ICU_LOCALE:?APP_DB_ICU_LOCALE is not set}"

for db in "\${APP_DB_NAME}_dev" "\${APP_DB_NAME}_test"; do
  psql -X -d postgres -v ON_ERROR_STOP=1 \\
       -v db="$db" -v owner="$APP_DB_OWNER" -v icu="$APP_DB_ICU_LOCALE" <<'SQL'
SELECT format(
         'CREATE DATABASE %I OWNER %I TEMPLATE template0 ENCODING %L LOCALE_PROVIDER icu ICU_LOCALE %L',
         :'db', :'owner', 'UTF8', :'icu')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'db') \\gexec
SQL
  echo "ready: $db"
done`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>-v db=&quot;$db&quot;</strong> psql এর ভেতরে একটা Variable বানায়, আর SQL এ{" "}
                  <code className={CODE}>:&apos;db&apos;</code> লিখলে psql সেটা উদ্ধৃতি সহ বসিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>format() এর %I আর %L</strong> Module 04 এ দেখা format() এর দুই চিহ্ন। %I নামকে Identifier হিসেবে
                  বসায়, দরকার হলে উদ্ধৃতি সহ, %L লেখাকে Literal হিসেবে। কেউ অদ্ভুত নাম দিলেও SQL ভাঙবে না।
                </ListItem>
                <ListItem>
                  <strong>WHERE NOT EXISTS ... \gexec</strong> Section 003 এর কৌশল, তাই দ্বিতীয়বার চালালে কিছুই হয় না।
                </ListItem>
                <ListItem>
                  <strong>ON_ERROR_STOP=1</strong> কোনো Error হলেই psql থামে আর Exit Code দেয়, আর{" "}
                  <code className={CODE}>set -e</code> তখন পুরো Script থামিয়ে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Script টা postgres:18 Container এর ভেতরে তিনবার চালানো হয়েছে: Variable ছাড়া, তারপর Variable সহ দুবার।
                আসল Output:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal, তিনবার চালানো",
          code: `$ bash scripts/create-app-databases.sh
scripts/create-app-databases.sh: line 4: APP_DB_NAME: APP_DB_NAME is not set

$ export APP_DB_NAME=island_tours APP_DB_OWNER=island_app APP_DB_ICU_LOCALE=bn-BD
$ bash scripts/create-app-databases.sh
CREATE DATABASE
ready: island_tours_dev
CREATE DATABASE
ready: island_tours_test

$ bash scripts/create-app-databases.sh
ready: island_tours_dev
ready: island_tours_test

$ psql -X -c '\\l island_tours_*'
                                                       List of databases
       Name        |   Owner    | Encoding | Locale Provider |  Collate   |   Ctype    | Locale | ICU Rules | Access privileges
-------------------+------------+----------+-----------------+------------+------------+--------+-----------+-------------------
 island_tours_dev  | island_app | UTF8     | icu             | en_US.utf8 | en_US.utf8 | bn-BD  |           |
 island_tours_test | island_app | UTF8     | icu             | en_US.utf8 | en_US.utf8 | bn-BD  |           |
(2 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Owner যেহেতু island_app, তাই Sample Data Load করার জন্যও superuser লাগে না। Module 02 এর{" "}
              <Link href="/sql/topic/load-sample-database" className={LINK}>
                Load the Sample Database
              </Link>{" "}
              লেসনের ফাইলটাই island_app হয়ে চালানো হলো, তারপর গুনে দেখা হলো কী এল:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "terminal আর psql, island_app হয়ে",
          code: `$ psql -X -U island_app -d island_tours_dev -v ON_ERROR_STOP=1 -q -f island-tours.sql
psql:island-tours.sql:5: NOTICE:  table "reviews" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "payments" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "bookings" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "departures" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "tours" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "guides" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "destinations" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "customers" does not exist, skipping

$ psql -X -U island_app -d island_tours_dev
island_tours_dev=> SELECT count(*) AS tables FROM pg_tables WHERE schemaname = 'public' AND tableowner = 'island_app';
 tables
--------
      8
(1 row)

island_tours_dev=> SELECT (SELECT count(*) FROM bookings) AS bookings, (SELECT count(*) FROM customers) AS customers;
 bookings | customers
----------+-----------
       24 |        15
(1 row)

island_tours_dev=> SELECT pg_size_pretty(pg_database_size(current_database())) AS size;
  size
---------
 8222 kB
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আটটা Table, প্রতিটার Owner island_app, 24টা Booking আর 15 জন Customer, পুরো Database মোটে 8222 kB। শুরুর
                NOTICE গুলো ফাইলের প্রথম DROP TABLE IF EXISTS লাইন থেকে, নতুন Database এ মোছার মতো কিছু ছিল না বলে।
              </ContentParagraph>
              <ContentParagraph>
                শেষ ধাপ App কে জানানো: Code এ কোনো Database এর নাম নেই, শুধু প্রতিটা পরিবেশের DATABASE_URL আলাদা, শেষে{" "}
                <code className={CODE}>/island_tours_dev</code> বা <code className={CODE}>/island_tours_test</code>, আর
                Section 012 এর পাহারা Test কে অন্য নামে চলতে দেয় না। এবার Challenge: ফারুক সাহেব Admin Panel এ একটা
                “Database কার্ড” চান, App এর Database এর মূল তথ্য এক Row তে। আগে বক্সে পুরো কার্ড দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Row এ বর্তমান Database এর পরিচয়পত্র"
              query={`SELECT datname                       AS database_name,
       pg_get_userbyid(datdba)       AS owner,
       pg_encoding_to_char(encoding) AS encoding,
       datlocprovider                AS provider,
       datcollate                    AS collate,
       datctype                      AS ctype,
       datistemplate                 AS is_template,
       datallowconn                  AS allows_connections
FROM pg_database
WHERE datname = current_database();`}
              caption="এক Row: postgres | postgres | UTF8 | c | C | C.UTF-8 | f | t। তানিমের island_tours_dev এ একই Query চালালে আসত island_tours_dev | island_app | UTF8 | i | en_US.utf8 | en_US.utf8 | f | t, provider এ i মানে ICU।"
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
                  বক্সের বর্তমান Database এর কার্ড, এক Row তে সাতটা Column, এই ক্রমে: নাম, Owner এর নাম, Encoding এর নাম,
                  datcollate, datctype, ছাঁচ কিনা, আর Connect করা যায় কিনা। কোনো নাম হাতে লিখবেন না।
                </>
              }
              hint={
                <>
                  উপরের বক্স থেকে <code className={CODE}>datlocprovider</code> এর লাইনটা বাদ দিন। বাকি সব একই:{" "}
                  <code className={CODE}>pg_get_userbyid(datdba)</code>, <code className={CODE}>pg_encoding_to_char(encoding)</code>{" "}
                  আর <code className={CODE}>WHERE datname = current_database()</code>।
                </>
              }
              solution={`SELECT datname                       AS database_name,
       pg_get_userbyid(datdba)       AS owner,
       pg_encoding_to_char(encoding) AS encoding,
       datcollate                    AS collate,
       datctype                      AS ctype,
       datistemplate                 AS is_template,
       datallowconn                  AS allows_connections
FROM pg_database
WHERE datname = current_database();`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>নতুন Database বানানোর সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "কোন Server এ আছেন, নিশ্চিত হন",
              description:
                "psql এ \\conninfo। Laptop না Production, Docker না Homebrew। ভুল Server এ ঠিক Command ও বিপদ।",
            },
            {
              title: "নাম ঠিক করুন",
              description:
                "ছোট হাতের অক্ষর, সংখ্যা আর Underscore; শুরুতে App, শেষে পরিবেশ: island_tours_dev, island_tours_test। হাইফেন, Space আর বড় হাত না।",
            },
            {
              title: "Owner বাছুন",
              description:
                "App এর নিজের Role, postgres না। Role আগে CREATE ROLE দিয়ে বানান, তারপর OWNER দিয়ে বসান।",
            },
            {
              title: "Encoding আর Locale প্রথম দিনেই",
              description:
                "Encoding সবসময় UTF8। সাজানোর নিয়ম দরকার মতো libc, ICU বা builtin। ছাঁচ থেকে আলাদা হলে TEMPLATE template0। এগুলো পরে বদলায় না।",
            },
            {
              title: "বারবার চালানো যায় এমন করে লিখুন",
              description:
                "Script এ WHERE NOT EXISTS সহ \\gexec, মোছার জন্য DROP DATABASE IF EXISTS। Error হলে থামতে ON_ERROR_STOP।",
            },
            {
              title: "ঢুকে যাচাই করুন",
              description:
                "\\l দিয়ে Owner, Encoding, Locale দেখুন, \\c দিয়ে ঢুকুন, current_database() দিয়ে নিশ্চিত হন, তারপর Table বানানো শুরু।",
            },
            {
              title: "App কে URL দিন, নাম না",
              description:
                "প্রতিটা পরিবেশের DATABASE_URL Environment Variable এ। Test শুরুর আগে পাহারা: নাম _test দিয়ে শেষ না হলে থামুন।",
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
            ["নামে হাইফেন: island-tours-dev", "ERROR: syntax error at or near “-”", "Underscore: island_tours_dev"],
            [
              "CREATE DATABASE IF NOT EXISTS, MySQL এর অভ্যাসে",
              "PostgreSQL এ syntax error at or near “NOT”",
              "WHERE NOT EXISTS সহ SELECT, তারপর \\gexec",
            ],
            [
              "Encoding বা Locale বদলাতে গিয়ে template0 ভুলে যাওয়া",
              "ছাঁচের সাথে না মেলার Error, সাথে HINT",
              "TEMPLATE template0, আর LATIN1 এর মতো Encoding এ LOCALE 'C' ও",
            ],
            [
              "সব Database postgres এর নামে, App ও postgres হয়ে Connect",
              "App পুরো Server এর সব কিছু করতে পারে; একটা Bug সব ভাঙতে পারে",
              "App এর Role কে OWNER করুন",
            ],
            [
              "ICU Locale এর নামে টাইপো, যেমন bd-BN",
              "শুধু WARNING, Database তৈরি হয়ে যায়, সাজানো ভুল নিয়মে",
              "WARNING দেখলেই DROP করে ঠিক নামে আবার বানান",
            ],
            [
              "যে Database এ বসে আছেন সেটাই DROP",
              "ERROR: cannot drop the currently open database",
              "আগে \\c postgres, তারপর DROP",
            ],
            [
              "অন্যরা Connect থাকা অবস্থায় না জানিয়ে WITH (FORCE)",
              "তাঁদের Connection কেটে যায়, চলতি কাজ হারায়",
              "আগে জানান; দরকার হলে pg_stat_activity দেখে নিন কে আছেন",
            ],
            [
              "Test আর কাজের জন্য একই Database",
              "Test এর পরিষ্কার করার ধাপ আসল Data মুছে দেয়",
              "_dev আর _test আলাদা, আর Test এ নামের পাহারা",
            ],
            [
              "GUI তে template1 খোলা রেখে দেওয়া",
              "অন্য সবার CREATE DATABASE: source database is being accessed by other users",
              "রোজকার কাজে কখনো template1 এ ঢুকবেন না",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়ার আর দেখার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-createdatabase.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: CREATE DATABASE
                </a>
                : প্রতিটা অপশনের অফিসিয়াল ব্যাখ্যা, আর Notes অংশে Encoding, Locale আর ছাঁচের নিয়ম, যেগুলো এই লেসনের Error
                গুলোর উৎস।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-dropdatabase.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: DROP DATABASE
                </a>
                : ছোট্ট পাতা, কিন্তু FORCE কখন কাজ করে না, সেই তালিকাটা এখানে।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/manage-ag-templatedbs.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Template Databases
                </a>
                : template0 আর template1 এর পুরো গল্প, আর নিজের ছাঁচ বানানোর নিয়ম।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/locale.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Locale Support
                </a>
                : libc, icu আর builtin, তিন Provider এর তুলনা, আর LC_COLLATE ও LC_CTYPE কেন জন্মের পরে বদলায় না।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/multibyte.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Character Set Support
                </a>
                : সব Encoding এর তালিকা, Client আর Server এর মধ্যে বদলের নিয়ম, আর SQL_ASCII নিয়ে সতর্কবার্তা।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/app-createdb.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: createdb
                </a>{" "}
                আর{" "}
                <a href="https://www.postgresql.org/docs/current/app-dropdb.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  dropdb
                </a>
                : দুই Program এর সব Flag আর উদাহরণ।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/create-database.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: CREATE DATABASE
                </a>{" "}
                আর{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/drop-database.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  DROP DATABASE
                </a>
                : MySQL এর দিক, IF NOT EXISTS, CHARACTER SET আর বর্তমান Database মোছার নিয়ম সহ।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM&t=989s" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার দেখা SQL Course, Database বানানোর অংশ (16:29 থেকে)
                </a>
                : MySQL দিয়ে CREATE DATABASE। Section 013 এর টেবিলটা পাশে রেখে দেখুন, কোন লাইন PostgreSQL এ কীভাবে লিখবেন
                বুঝতে সুবিধা হবে।
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
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  CREATE DATABASE একটা ছাঁচ Copy করে, কিছু না বললে template1। Copy চলার সময় ছাঁচে কেউ Connect থাকলে
                  শুরুই হয় না। template0 কখনো বদলায় না, তাতে কেউ ঢুকতেও পারে না।
                </ListItem>
                <ListItem>
                  \l দিয়ে তালিকা, \c দিয়ে ভেতরে, current_database() দিয়ে নিশ্চিত হওয়া। একই নাম দ্বিতীয়বার দিলে ERROR
                  42P04।
                </ListItem>
                <ListItem>
                  PostgreSQL এ CREATE DATABASE এর IF NOT EXISTS নেই; বারবার চালানো Script এর জন্য WHERE NOT EXISTS আর
                  \gexec। MySQL এ আছে।
                </ListItem>
                <ListItem>
                  Database বানাতে superuser বা CREATEDB লাগে। Owner মুছতে পারেন, আর PostgreSQL 15 থেকে নিজের Database এর
                  public এ Table বানাতে পারেন। App এর Role কে Owner করুন।
                </ListItem>
                <ListItem>
                  Encoding সবসময় UTF8, বাংলার প্রতিটা অক্ষর তিন Byte। LATIN1 এ বাংলা ঢোকেই না।
                </ListItem>
                <ListItem>
                  LC_COLLATE আর LC_CTYPE জন্মের সময় চিরদিনের জন্য ঠিক হয়। libc আসে OS থেকে, ICU দেয় ভাষার নিয়ম যেমন
                  bn-BD, builtin দেয় স্থির Code Point এর ক্রম। ছাঁচ থেকে আলাদা হলে TEMPLATE template0।
                </ListItem>
                <ListItem>
                  createdb আর dropdb একই SQL এর Wrapper; -e দিয়ে পাঠানো SQL দেখা যায়।
                </ListItem>
                <ListItem>
                  DROP DATABASE ফেরানো যায় না, Transaction এর ভেতরেও চলে না। নিজের বর্তমান Database মোছা যায় না। অন্যরা
                  থাকলে থামে; WITH (FORCE) তাঁদের Connection কেটে দিয়ে মোছে।
                </ListItem>
                <ListItem>
                  এক App এক Database, এক পরিবেশ এক Database। Database এর মধ্যে Query চলে না। নাম ছোট হাতে, Underscore দিয়ে,
                  63 Byte এর মধ্যে।
                </ListItem>
                <ListItem>
                  বক্সে CREATE DATABASE চলে, কিন্তু \c নেই, তাই নতুন Database এ ঢোকা যায় না। বানানো আর মোছার কাজ নিজের psql এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তানিমের island_tours_dev এখন তৈরি, খালি, আর তাঁর নিজের। একটা খালি বাড়ি, যার ঘরগুলো এখনো বানানো বাকি।
                পরের লেসনে{" "}
                <Link href="/sql/topic/create-table" className={LINK}>
                  CREATE TABLE and Naming
                </Link>{" "}
                এ আপনি সেই প্রথম ঘরটা বানাবেন: Column, তাদের Type, আর এমন নাম রাখার নিয়ম যা বছরখানেক পরেও আপনাকে বা
                আপনার Team কে কষ্ট দেবে না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "এই লেসনে দেখা"],
    rows: [
      ["CREATE DATABASE", "Server এ নতুন, আলাদা একটা Database", "CREATE DATABASE island_tours_dev;"],
      ["ছাঁচ", "নতুন Database আসলে template1 এর Copy", "template1 এ কেউ থাকলে: being accessed by other users"],
      ["template0", "কখনো না বদলানো ছাঁচ, Connect নিষেধ", "ভিন্ন Encoding, Locale বা Provider এর জন্য লাগে"],
      ["\\l, \\c, current_database()", "তালিকা, ভেতরে ঢোকা, নিশ্চিত হওয়া", "প্রম্পট বদলে island_tours_dev=#"],
      ["IF NOT EXISTS", "PostgreSQL এ নেই, MySQL এ আছে", "WHERE NOT EXISTS সহ \\gexec"],
      ["OWNER", "Database কার; মোছার আর public এ লেখার অধিকার", "island_app নিজেরটা মুছল, অন্যেরটা পারল না"],
      ["CREATEDB", "Database বানানোর অধিকার", "permission denied to create database"],
      ["ENCODING", "লেখা থেকে Byte এর চুক্তি", "UTF8 এ দ্বীপ 15 Byte, LATIN1 এ ঢোকেই না"],
      ["LC_COLLATE, LC_CTYPE", "সাজানোর ক্রম আর অক্ষরের স্বভাব, পরে বদলায় না", "C আর en_US.utf8 এ আলাদা ক্রম"],
      ["Locale Provider", "libc, icu বা builtin", "bn-BD তে বাংলা আগে, তারপর Latin"],
      ["createdb, dropdb", "একই SQL এর Terminal Wrapper", "-e দেখায় পাঠানো CREATE DATABASE"],
      ["DROP DATABASE", "সব মুছে দেয়, ফেরানো যায় না", "Transaction এর ভেতরে চলে না"],
      ["WITH (FORCE)", "অন্যদের Connection কেটে মোছা, PostgreSQL 13 থেকে", "অন্য Window তে FATAL: terminating connection"],
      ["এক পরিবেশ এক Database", "Test আর কাজ আলাদা, Code এ শুধু DATABASE_URL", "নাম _test দিয়ে শেষ না হলে Test থামে"],
      ["নামের নিয়ম", "ছোট হাত, Underscore, 63 Byte", "island-tours এ Syntax Error, IslandTours হয় islandtours"],
      ["বক্সের সীমা", "একটাই Connection, postgres এ বাঁধা", "CREATE DATABASE চলে, \\c চলে না"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "কিছু না বলে CREATE DATABASE island_tours_dev; চালালে নতুন Database এর ভেতরে কী থাকে?",
        options: [
          {
            key: "A",
            text: "একদম কিছুই না, PostgreSQL শূন্য থেকে বানায়",
            isCorrect: false,
            explanation: "PostgreSQL শূন্য থেকে বানায় না, একটা ছাঁচ Copy করে। ছাঁচে কিছু থাকলে নতুন Database এও থাকবে।",
          },
          {
            key: "B",
            text: "template1 এর ভেতরে যা আছে তার হুবহু Copy",
            isCorrect: true,
            explanation: "ঠিক। ডিফল্ট ছাঁচ template1, তার Schema, Table, Extension সব Copy হয়। শুধু ALTER DATABASE এর Setting আর GRANT এর Permission আসে না।",
          },
          {
            key: "C",
            text: "যে Database এ বসে CREATE চালালেন, তার Copy",
            isCorrect: false,
            explanation: "আপনি কোন Database এ বসে আছেন তাতে কিছু যায় আসে না। ছাঁচ বদলাতে TEMPLATE লিখতে হয়।",
          },
          {
            key: "D",
            text: "template0 এর Copy, কারণ সেটাই আসল ছাঁচ",
            isCorrect: false,
            explanation: "template0 শুধু তখন, যখন TEMPLATE template0 লিখে চান। ডিফল্ট template1।",
          },
        ],
      },
      {
        id: 2,
        text: "PostgreSQL 18 এ CREATE DATABASE IF NOT EXISTS island_tours_dev; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Database না থাকলে বানায়, থাকলে একটা NOTICE দেয়",
            isCorrect: false,
            explanation: "এটা MySQL এর আচরণ, আর CREATE TABLE IF NOT EXISTS এর। CREATE DATABASE এ PostgreSQL এর এমন কোনো অংশ নেই।",
          },
          {
            key: "B",
            text: "ERROR: database already exists, সবসময়",
            isCorrect: false,
            explanation: "সেই Error আসে IF NOT EXISTS ছাড়া একই নাম দ্বিতীয়বার দিলে। এখানে Parser তার আগেই আটকে যায়।",
          },
          {
            key: "C",
            text: "ERROR: syntax error at or near \"NOT\"",
            isCorrect: true,
            explanation: "ঠিক। Synopsis এ IF NOT EXISTS নেই, তাই Parser NOT শব্দে Syntax Error দেয়। বারবার চালানোর জন্য WHERE NOT EXISTS আর \\gexec।",
          },
          {
            key: "D",
            text: "একটা WARNING দিয়ে Database বানায়",
            isCorrect: false,
            explanation: "WARNING দিয়ে বানানোর আচরণ দেখেছেন ICU Locale এর টাইপোতে, এখানে না।",
          },
        ],
      },
      {
        id: 3,
        text: "LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD' দিয়ে Database বানাতে গিয়ে HINT এ লেখা এল use template0 as template। কেন?",
        options: [
          {
            key: "A",
            text: "কারণ ICU শুধু template0 তে Install করা থাকে",
            isCorrect: false,
            explanation: "ICU পুরো Server এর জন্য Install থাকে। সমস্যা ছাঁচের Provider এর সাথে মিল নিয়ে।",
          },
          {
            key: "B",
            text: "কারণ template1 এর Provider libc, আর ভিন্ন নিয়মে Copy করলে তার Index আর Data নতুন নিয়মে নষ্ট হতে পারে",
            isCorrect: true,
            explanation: "ঠিক। Encoding, Locale বা Provider ছাঁচ থেকে আলাদা হলে PostgreSQL template1 Copy করতে রাজি না, কারণ তাতে পুরনো নিয়মে সাজানো জিনিস থাকতে পারে। template0 তে এমন কিছু নেই।",
          },
          {
            key: "C",
            text: "কারণ bn-BD ভুল নাম, template0 সেটা ঠিক করে দেয়",
            isCorrect: false,
            explanation: "bn-BD সঠিক ICU নাম। ভুল নাম হলে আসে WARNING, যেমন bd-BN এ এসেছিল।",
          },
          {
            key: "D",
            text: "কারণ superuser ছাড়া কেউ template1 Copy করতে পারে না",
            isCorrect: false,
            explanation: "template1 Copy করতে CREATEDB যথেষ্ট। এই HINT অধিকারের না, নিয়মের মিল না থাকার।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Database এর LC_COLLATE ভুল বাছা হয়েছে। ঠিক করার উপায় কী?",
        options: [
          {
            key: "A",
            text: "ALTER DATABASE ... SET lc_collate",
            isCorrect: false,
            explanation: "LC_COLLATE কোনো Setting না যা পরে বসানো যায়। Documentation বলে এটা জন্মের সময় ঠিক হয়, পরে বদলায় না।",
          },
          {
            key: "B",
            text: "Server Restart করে নতুন Locale দেওয়া",
            isCorrect: false,
            explanation: "Restart এ Database এর জন্মের Locale বদলায় না। LC_MESSAGES এর মতো কিছু Setting বদলায়, LC_COLLATE না।",
          },
          {
            key: "C",
            text: "ঠিক Locale দিয়ে নতুন Database বানিয়ে Data সেখানে সরানো",
            isCorrect: true,
            explanation: "ঠিক। Text Index এর ক্রম LC_COLLATE এর ওপর নির্ভর করে, তাই PostgreSQL এটা বদলাতে দেয় না। নতুন Database বানিয়ে pg_dump দিয়ে Data সরানোই পথ।",
          },
          {
            key: "D",
            text: "REINDEX চালানো",
            isCorrect: false,
            explanation: "REINDEX বিদ্যমান নিয়মে Index নতুন করে বানায়, Database এর নিয়ম বদলায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "island_app এর CREATEDB নেই, কিন্তু সে island_tours_staging এর Owner। নিচের কোনটা island_app পারে?",
        options: [
          {
            key: "A",
            text: "নতুন একটা Database বানানো",
            isCorrect: false,
            explanation: "ERROR: permission denied to create database। বানাতে CREATEDB বা superuser লাগে।",
          },
          {
            key: "B",
            text: "postgres এর Owner করা island_tours_test মোছা",
            isCorrect: false,
            explanation: "ERROR: must be owner of database island_tours_test। মোছার অধিকার Owner আর superuser এর।",
          },
          {
            key: "C",
            text: "নিজের island_tours_staging মোছা",
            isCorrect: true,
            explanation: "ঠিক। Owner হিসেবে নিজের Database মুছতে পারে, কোনো প্রশ্ন ছাড়াই, এই লেসনের Session এ যেমন হয়েছিল।",
          },
          {
            key: "D",
            text: "template1 মোছা",
            isCorrect: false,
            explanation: "template1 এর Owner postgres, আর সেটা ছাঁচ হিসেবে চিহ্নিত, তাই superuser ও সরাসরি মুছতে পারেন না।",
          },
        ],
      },
      {
        id: 6,
        text: "আরেকজন island_tours_staging এ Connect হয়ে আছেন। আপনি DROP DATABASE IF EXISTS island_tours_staging; চালালেন। কী হবে?",
        options: [
          {
            key: "A",
            text: "IF EXISTS আছে বলে চুপচাপ মুছে যাবে",
            isCorrect: false,
            explanation: "IF EXISTS শুধু “নেই” অবস্থার Error ঢাকে। Database আছে, সমস্যা অন্য।",
          },
          {
            key: "B",
            text: "ERROR: being accessed by other users, Database অক্ষত থাকবে",
            isCorrect: true,
            explanation: "ঠিক। অন্য কেউ থাকলে সাধারণ DROP কয়েক সেকেন্ড অপেক্ষা করে থামে, IF EXISTS থাকুক বা না থাকুক। মুছতে হলে WITH (FORCE)।",
          },
          {
            key: "C",
            text: "অন্যজনের কাজ শেষ হওয়া পর্যন্ত অপেক্ষা করবে, তারপর মুছবে",
            isCorrect: false,
            explanation: "অল্প সময় অপেক্ষা করে, কিন্তু অনির্দিষ্টকাল না। এই লেসনের Container এ প্রায় পাঁচ সেকেন্ড পরে Error দিয়েছিল।",
          },
          {
            key: "D",
            text: "অন্যজনের Connection কেটে দিয়ে মুছবে",
            isCorrect: false,
            explanation: "এটা WITH (FORCE) এর কাজ, যেটা এই Command এ লেখা নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "এই পাতার Query বক্সে CREATE DATABASE createdb_practice; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Error, কারণ বক্স CREATE DATABASE সমর্থন করে না",
            isCorrect: false,
            explanation: "বক্সের ভেতরে আসল PostgreSQL 18, তাই Command টা চলে। এই লেসনের বক্সে নিজেই দেখেছেন।",
          },
          {
            key: "B",
            text: "Database তৈরি হয় আর বক্স নিজে থেকে সেখানে চলে যায়",
            isCorrect: false,
            explanation: "current_database() তখনো postgres থাকে। CREATE DATABASE কখনো আপনাকে নতুন Database এ নিয়ে যায় না, psql এও না।",
          },
          {
            key: "C",
            text: "pg_database এ নামটা ওঠে, কিন্তু বক্স সেখানে ঢুকতে পারে না, কারণ \\c psql এর Command, SQL না",
            isCorrect: true,
            explanation: "ঠিক। বক্সে একটাই Connection, postgres এ বাঁধা, আর \\c লিখলে Syntax Error। তাই বানানো আর ঢোকার কাজ নিজের psql এ।",
          },
          {
            key: "D",
            text: "পুরো পাতার Database মুছে নতুন করে শুরু হয়",
            isCorrect: false,
            explanation: "পাতার Database নতুন করে শুরু হয় শুধু Reload বা 10 সেকেন্ডের বেশি চলা Statement এর পরে, CREATE DATABASE এ না।",
          },
        ],
      },
      {
        id: 8,
        text: "নিচের কোন নামটা PostgreSQL Database এর জন্য সবচেয়ে নিরাপদ?",
        options: [
          {
            key: "A",
            text: "island-tours-dev",
            isCorrect: false,
            explanation: "হাইফেন বিয়োগ চিহ্ন হিসেবে পড়া হয়, তাই উদ্ধৃতি ছাড়া Syntax Error, তানিমের প্রথম ভুল।",
          },
          {
            key: "B",
            text: "IslandToursDev",
            isCorrect: false,
            explanation: "উদ্ধৃতি ছাড়া islandtoursdev হয়ে যায়, উদ্ধৃতি দিলে প্রতিবার উদ্ধৃতি সহ লিখতে হয়। দুই রকমেই বিভ্রান্তি।",
          },
          {
            key: "C",
            text: "island_tours_dev",
            isCorrect: true,
            explanation: "ঠিক। ছোট হাত, Underscore, শুরুতে App, শেষে পরিবেশ। quote_ident() এর চারপাশে কোনো উদ্ধৃতি বসায় না।",
          },
          {
            key: "D",
            text: "user",
            isCorrect: false,
            explanation: "SQL এর সংরক্ষিত শব্দ, উদ্ধৃতি ছাড়া Syntax Error। আর নাম দেখে বোঝাও যায় না কোন App বা পরিবেশের।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: নিজের তিন পরিবেশের Database",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের App এর নাম:</strong> Module 02 থেকে আপনি যে নিজের অ্যাপের কথা ভাবছেন, তার জন্য একটা Role আর দুটো
        Database বানান, নামের ছক মেনে (app_dev, app_test)। Owner হবে সেই Role, Encoding UTF8, আর Locale আপনার পছন্দের,
        কিন্তু নিজে লিখে দেওয়া, ছাঁচের ভরসায় না।
      </span>,
      <span key="2">
        <strong>সাজানোর তুলনা:</strong> একই পাঁচটা বাংলা আর পাঁচটা English শব্দ তিনটা আলাদা Database এ সাজান: ICU bn-BD,
        ICU und আর builtin C.UTF-8। তিনটা ফলাফল পাশাপাশি রাখুন আর প্রতিটার জন্য এক লাইনে লিখুন কোন App এর জন্য সেটা মানাবে।
      </span>,
      <span key="3">
        <strong>ইচ্ছা করে চারটা Error:</strong> already exists, IF NOT EXISTS এর Syntax Error, ছাঁচের সাথে না মেলার HINT, আর
        cannot drop the currently open database। প্রতিটার আসল বার্তা কপি করুন আর এক লাইনে লিখুন কীভাবে সারালেন।
      </span>,
      <span key="4">
        <strong>বারবার চালানো Script:</strong> এই লেসনের Project Example এর মতো একটা Script লিখুন যেটা আপনার দুটো Database
        বানায়, Variable না থাকলে থামে, আর দ্বিতীয়বার চালালে কিছুই করে না। দুবার চালিয়ে দুটো Output রাখুন।
      </span>,
      <span key="5">
        <strong>FORCE এর দুই দিক:</strong> দুটো psql Window খুলুন। একটায় app_test এ ঢুকে বসে থাকুন, অন্যটায় আগে সাধারণ DROP,
        তারপর WITH (FORCE)। দুই Window এর Output রাখুন, আর বন্ধুকে চার লাইনে বোঝান FORCE চালানোর আগে কেন অন্যজনকে জানানো দরকার।
      </span>,
    ],
    deliverables: [
      <span key="d1">Role আর দুই Database বানানোর SQL, আর \l এর Output</span>,
      <span key="d2">তিন Database এর সাজানো তালিকা আর তিন লাইনের মতামত</span>,
      <span key="d3">চারটা আসল Error বার্তা আর প্রতিটার সমাধান</span>,
      <span key="d4">Script এর Code আর দুবার চালানোর Output</span>,
      <span key="d5">দুই Window এর Output আর বন্ধুর জন্য চার লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ CREATE আর DROP DATABASE",
    subtitle: "superuser postgres হয়ে ছয়টা ড্রিল, প্রত্যাশিত ফলাফল postgres:18 Container এ চালিয়ে নেওয়া",
    stepName: "DRILL",
    steps: [
      {
        title: "বানান আর ঢুকুন",
        description:
          "প্রথম ফাইলে একটা Database বানিয়ে \\l দিয়ে দেখুন, \\c দিয়ে ঢুকুন, current_database() দিয়ে নিশ্চিত হন, তারপর postgres এ ফিরে আসুন।",
      },
      {
        title: "ছাঁচের নিয়ম",
        description:
          "দ্বিতীয় ফাইলে ICU bn-BD Database আগে TEMPLATE ছাড়া, তারপর template0 দিয়ে। প্রথমবারের HINT টা মন দিয়ে পড়ুন।",
      },
      {
        title: "দুই রকম সাজানো",
        description:
          "তৃতীয় ফাইলে একই চারটা শব্দ দুই Database এ সাজান। আপনার মেশিনের ছাঁচ Docker এর মতো না হলে দ্বিতীয় ফলাফল আলাদা হতে পারে।",
      },
      {
        title: "Owner বদল",
        description:
          "চতুর্থ ফাইলে একটা Role বানিয়ে প্রথম Database এর Owner করুন, তারপর pg_database থেকে মিলিয়ে নিন।",
      },
      {
        title: "বারবার চালানো CREATE",
        description:
          "পঞ্চম ফাইলে \\gexec এর লাইন দুটো। আগে থেকে থাকা Database এর জন্য কিছু হয় না, নতুনটার জন্য CREATE DATABASE।",
      },
      {
        title: "পরিষ্কার করা",
        description:
          "ষষ্ঠ ফাইলে নিজের ভেতরে বসে DROP এর Error দেখুন, তারপর বেরিয়ে এসে সব মুছুন। শেষ Query তে 0 আসা মানে কিছু পড়ে রইল না।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-create-and-connect.sql",
        code: `CREATE DATABASE createdb_drill;
-- CREATE DATABASE

\\l createdb_drill
-- (1 row), Owner postgres, Encoding UTF8; Docker এ Collate en_US.utf8

\\c createdb_drill
-- You are now connected to database "createdb_drill" as user "postgres".

SELECT current_database();
-- createdb_drill (1 row)

\\c postgres`,
      },
      {
        language: "sql",
        filename: "02-template-rule.sql",
        code: `CREATE DATABASE createdb_drill_bn LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD';
-- ERROR:  new locale provider (icu) does not match locale provider of the template database (libc)
-- HINT:  Use the same locale provider as in the template database, or use template0 as template.

CREATE DATABASE createdb_drill_bn LOCALE_PROVIDER icu ICU_LOCALE 'bn-BD' TEMPLATE template0;
-- CREATE DATABASE`,
      },
      {
        language: "sql",
        filename: "03-two-orders.sql",
        code: `\\c createdb_drill_bn
SELECT string_agg(w, ', ' ORDER BY w)
FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban')) AS v(w);
-- কক্সবাজার, সিলেট, bandarban, Sylhet

\\c createdb_drill
SELECT string_agg(w, ', ' ORDER BY w)
FROM (VALUES ('সিলেট'), ('কক্সবাজার'), ('Sylhet'), ('bandarban')) AS v(w);
-- Docker এর en_US.utf8 এ: bandarban, Sylhet, কক্সবাজার, সিলেট

\\c postgres`,
      },
      {
        language: "sql",
        filename: "04-owner.sql",
        code: `CREATE ROLE createdb_drill_app LOGIN;
-- CREATE ROLE

ALTER DATABASE createdb_drill OWNER TO createdb_drill_app;
-- ALTER DATABASE

SELECT datname, pg_get_userbyid(datdba) AS owner
FROM pg_database
WHERE datname LIKE 'createdb_drill%'
ORDER BY datname;
-- (2 rows)
-- createdb_drill    | createdb_drill_app
-- createdb_drill_bn | postgres`,
      },
      {
        language: "sql",
        filename: "05-run-twice.sql",
        code: `SELECT 'CREATE DATABASE createdb_drill'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'createdb_drill') \\gexec
-- কিছুই ছাপা হয় না, Database আগে থেকেই আছে

SELECT 'CREATE DATABASE createdb_drill_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'createdb_drill_test') \\gexec
-- CREATE DATABASE`,
      },
      {
        language: "sql",
        filename: "06-clean-up.sql",
        code: `DROP DATABASE IF EXISTS createdb_nothing;
-- NOTICE:  database "createdb_nothing" does not exist, skipping
-- DROP DATABASE

\\c createdb_drill
DROP DATABASE createdb_drill;
-- ERROR:  cannot drop the currently open database

\\c postgres
DROP DATABASE createdb_drill;
DROP DATABASE createdb_drill_bn;
DROP DATABASE createdb_drill_test;
DROP ROLE createdb_drill_app;
-- DROP DATABASE (তিনবার), DROP ROLE

SELECT count(*) FROM pg_database WHERE datname LIKE 'createdb_drill%';
-- 0`,
      },
    ],
  },
};
