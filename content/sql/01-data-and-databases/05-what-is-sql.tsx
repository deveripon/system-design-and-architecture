import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CommandFamilyLab,
  DialectTranslatorLab,
} from "../../../components/course/topics/sql-basics/sqllang-animations";
import {
  CommandFamiliesDiagram,
  DeclarativeSplit,
  LanguageVsProgramDiagram,
  SqlTimelineDiagram,
  StandardCoreDiagram,
  StatementAnatomyDiagram,
} from "../../../components/course/topics/sql-basics/sqllang-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const whatIsSqlContent: TopicData = {
  id: "what-is-sql",
  introduction: {
    badge: "MODULE 01 · LESSON 05",
    title: <SectionTitle>SQL একটা ভাষা, MySQL আর PostgreSQL তার বক্তা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          ধরুন আপনি সন্ধ্যায় বসে YouTube এ একটা লম্বা SQL কোর্স দেখছেন। ভিডিওর
          শিক্ষক বারবার বলছেন MySQL, স্ক্রিনে MySQL Workbench খোলা। আর এই ট্র্যাক
          বলছে সব কিছু শেখানো হবে PostgreSQL দিয়ে। মনে একটা খটকা লাগা খুব
          স্বাভাবিক। আমি কি তাহলে দুটো আলাদা জিনিস শিখছি? ভিডিওর সময়টা কি নষ্ট
          হলো? SQL, MySQL আর PostgreSQL, এই তিনটা নামের মধ্যে সম্পর্কটা আসলে কী?
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন ঠিক সেই প্রশ্নের উত্তর দিয়ে শুরু হবে, আর উত্তরটা আপনাকে স্বস্তি
          দেবে। তারপর আমরা ভাষাটাকে কাছ থেকে দেখব। SQL কেন অন্য Programming ভাষার
          মতো না, তার জন্ম কোথায়, একটা Standard থাকা সত্ত্বেও প্রতিটা Database কেন
          একটু আলাদা করে লেখে, SQL এর Command গুলো কোন পাঁচটা পরিবারে ভাগ করা,
          আর একটা SQL বাক্য কোন কোন টুকরো দিয়ে তৈরি।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি নিজের Browser এর ভেতরে চলা আসল PostgreSQL এ কয়েকটা Statement
          চালাবেন, আর আপনার হাতে থাকবে একটা অনুবাদের তালিকা, যেটা দিয়ে MySQL এর
          যেকোনো ভিডিও দেখতে দেখতে PostgreSQL এ অনুশীলন করতে পারবেন। SELECT এর
          পুরো নিয়ম এখনই শিখতে হবে না, সেটা Module 03 এর কাজ। আজকের লক্ষ্য
          ভাষাটার চেহারা চেনা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ঢাকা আর চট্টগ্রামের দুজন মানুষ নিজেদের টানে কথা বলেন, তবু একে অপরের কথা বোঝেন, কারণ ভাষাটা একই। PostgreSQL আর MySQL ও তাই, ভাষা SQL, টান আলাদা।",
      author: "SQL",
      role: "Lesson 05",
    },
  },
  sections: [
    {
      id: "the-question",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>আপনার প্রশ্নটা দিয়েই শুরু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                উত্তরটা এক বাক্যে বলা যায়: SQL একটা ভাষা, আর MySQL আর PostgreSQL
                হলো দুটো Program যারা এই ভাষা বোঝে। আপনি ভিডিওতে যা শিখছেন তার
                বেশিরভাগটাই SQL, মানে ভাষাটা। আর ভাষাটা দুই Program এই কাজ করে।
              </ContentParagraph>
              <ContentParagraph>
                একটা চেনা উদাহরণ দিয়ে ভাবুন। বাংলা একটা ভাষা। ঢাকার একজন মানুষ
                আর চট্টগ্রামের একজন মানুষ দুজনেই বাংলায় কথা বলেন। দুজনের টান আলাদা,
                কিছু শব্দ আলাদা, কিন্তু “আমি কাল আসব” বাক্যটা দুজনেই বোঝেন। কেউ যদি
                বাংলা শেখেন, তিনি দুজনের সাথেই কথা বলতে পারবেন। শুধু কয়েকটা
                আঞ্চলিক শব্দ আলাদা করে জেনে নিতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                SQL এর বেলায় ঠিক এটাই ঘটে। SQL এর একটা প্রমিত রূপ আছে, যাকে বলে
                Standard। PostgreSQL, MySQL, SQLite, SQL Server, Oracle, সবাই সেই
                Standard মেনে চলে, আর প্রত্যেকে নিজের কিছু শব্দ আর অভ্যাস যোগ করে।
                এই আঞ্চলিক রূপকে বলে Dialect, বাংলায় উপভাষা। তাই আপনার প্রশ্নের
                সোজা উত্তর: না, আপনি দুটো আলাদা জিনিস শিখছেন না। ভিডিও দেখা চালিয়ে
                যান। শুধু কোথায় কোথায় MySQL এর টান আর PostgreSQL এর টান আলাদা,
                সেটা এই লেসনে আমরা একটা তালিকায় তুলে রাখব।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তিনটা নাম, তিনটা আলাদা জিনিস",
          content: (
            <ContentList>
              <ListItem>
                <strong>SQL</strong>: একটা ভাষা। Database কে প্রশ্ন করার আর নির্দেশ
                দেওয়ার নিয়মের সংকলন। এটা কোনো Program না, ইনস্টল করা যায় না।
              </ListItem>
              <ListItem>
                <strong>MySQL</strong>: একটা DBMS, মানে Database চালানোর Program।
                এটা SQL বোঝে, নিজের কিছু টানসহ। আপনার ভিডিও এটা দিয়ে।
              </ListItem>
              <ListItem>
                <strong>PostgreSQL</strong>: আরেকটা DBMS। এটাও SQL বোঝে, নিজের কিছু
                টানসহ। এই ট্র্যাক এটা দিয়ে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DBMS শব্দটা আপনি Lesson 02 তে দেখেছেন: Database Management System,
              সেই Program যে Data রাখে, খোঁজে আর পাহারা দেয়। আজকের লেসনে আমাদের
              নজর সেই Program এর সাথে কথা বলার ভাষার উপর। নিচের বক্সে এই মুহূর্তে
              আপনার Browser এর ভেতরে আসল PostgreSQL চলছে। SQL এর নিয়ম এখনো জানার
              দরকার নেই, শুধু Run চাপুন আর দেখুন একটা SQL বাক্য কী ফেরত দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আপনার প্রথম SQL বাক্য"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt < 10000
ORDER BY price_bdt;`}
              caption="বাক্যটা প্রায় ইংরেজির মতো পড়া যায়: tours থেকে title আর price_bdt চাই, শুধু যেগুলোর দাম দশ হাজারের কম, দাম অনুযায়ী সাজিয়ে। চারটা ট্যুর ফেরত আসবে। ঠিক এই বাক্যটা MySQL এও হুবহু চলে।"
            />
          ),
        },
      ],
    },
    {
      id: "language-not-program",
      subHeader: { index: "002", title: "Language, Not a Program" },
      title: <SectionTitle>ভাষা আর Program এর তফাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                SQL এর পুরো নাম Structured Query Language। Query মানে প্রশ্ন।
                নামটাই বলে দেয় এটা কী: কাঠামো মেনে প্রশ্ন করার একটা ভাষা। আপনি
                SQL এ একটা বাক্য লেখেন, সেটা লেখা হিসেবে, মানে Text হিসেবে, একটা
                DBMS এর কাছে যায়। DBMS বাক্যটা পড়ে, বোঝে, নিজের ডিস্কে রাখা Data
                থেকে উত্তর খুঁজে বের করে, আর ফলাফল ফেরত পাঠায়।
              </ContentParagraph>
              <ContentParagraph>
                তাই SQL নিজে কিছু রাখে না, কিছু চালায় না। SQL হলো আপনার আর DBMS
                এর মাঝখানের চুক্তি: একপক্ষ এই নিয়মে লিখবে, অন্যপক্ষ এই নিয়মে
                বুঝবে, এমন একটা সমঝোতা। যে Program এই চুক্তি মানে, তার সাথেই আপনি SQL এ কথা
                বলতে পারবেন। আর এই চুক্তি অনেক Program মানে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LanguageVsProgramDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ছবিটা থেকে তিনটা জিনিস মনে রাখুন। প্রথমত, পাঁচটা Program আলাদা আলাদা
                কোম্পানি বা দলের বানানো, প্রত্যেকে নিজের ডিস্কে নিজের ফরম্যাটে Data
                রাখে। MySQL এর Data ফাইল PostgreSQL খুলতে পারে না। দ্বিতীয়ত, তবু
                সবাই একই ভাষার বাক্য বোঝে। তৃতীয়ত, আপনি যে Program ই ইনস্টল করুন,
                তার সাথে কথা বলবেন SQL এ।
              </ContentParagraph>
              <ContentParagraph>
                এই কারণেই চাকরির বিজ্ঞাপনে প্রায়ই লেখা থাকে “SQL জানা আবশ্যক”,
                নির্দিষ্ট Program এর নাম ছাড়াই। কোম্পানি জানে, যিনি PostgreSQL এ
                ভালো SQL লেখেন, তিনি MySQL এর কাজও কয়েক দিনে ধরে ফেলবেন। আর
                বাস্তবে একজন Developer তাঁর ক্যারিয়ারে প্রায়ই একাধিক DBMS ছুঁয়ে
                দেখেন: অফিসে PostgreSQL, পুরনো একটা Project এ MySQL, ফোনের App এ
                SQLite।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নামের উচ্চারণ নিয়ে দুশ্চিন্তা নেই",
          content: (
            <ContentParagraph>
              SQL কে কেউ বলেন এস কিউ এল, কেউ বলেন সিকুয়েল। দুটোই চলে, আর কাজের
              জায়গায় দুটোই শুনবেন। PostgreSQL কে সবাই ছোট করে Postgres বলেন,
              উচ্চারণ পোস্টগ্রেস। MySQL এর প্রচলিত উচ্চারণ মাই এস কিউ এল। নামের
              পেছনের ইতিহাসটা একটু পরে, Section 007 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "standard-and-dialects",
      subHeader: { index: "003", title: "Standard and Dialects" },
      title: <SectionTitle>প্রমিত রূপ আর আঞ্চলিক টান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Standard মানে একটা লিখিত নিয়মের বই, যেটা একটা আন্তর্জাতিক সংস্থা
                প্রকাশ করে। SQL এর Standard প্রকাশ করে ISO, International
                Organization for Standardization। সেখানে লেখা থাকে SELECT কীভাবে
                লিখতে হয়, JOIN এর মানে কী, একটা Table বানানোর বাক্য কেমন। প্রথম
                Standard এসেছিল ১৯৮৬ সালে, সর্বশেষটার নাম SQL:2023।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে সবাই হুবহু এক রকম লেখে না কেন? তিনটা কারণে। এক, Standard
                বিশাল, কোনো Program তার প্রতিটা অংশ মানে না। দুই, অনেক Program
                Standard এ কোনো জিনিস আসার আগেই নিজের মতো করে সেটা বানিয়ে ফেলেছিল,
                পরে আর বদলায়নি, কারণ বদলালে হাজারো পুরনো App ভেঙে যাবে। তিন,
                প্রত্যেকে নিজের ব্যবহারকারীদের জন্য বাড়তি সুবিধা যোগ করে, যেটা
                Standard এ নেই।
              </ContentParagraph>
              <ContentParagraph>
                ফলাফলটা দেখতে নিচের ছবির মতো। মাঝখানে একটা বড় অংশ, যেটা সবার জন্য
                এক। এখানেই থাকে SELECT, WHERE, JOIN, GROUP BY, INSERT, UPDATE, DELETE,
                CREATE TABLE, Transaction। আপনার শেখার প্রায় পুরোটা এই অংশ। দুই পাশে
                প্রত্যেকের নিজের সংযোজন, যেগুলো অন্য Program এ সাধারণত চলে না।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StandardCoreDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Dialect এর মধ্যে কোনটা “ভালো” আর কোনটা “খারাপ”, এমন না। ঢাকার টান
              চট্টগ্রামের টানের চেয়ে শুদ্ধ না, শুধু আলাদা। তবে একটা ব্যবহারিক কথা
              আছে: PostgreSQL Standard এর অনেকটা কাছাকাছি থাকার জন্য পরিচিত, আর
              নিজের Documentation এ একটা পুরো অধ্যায় রাখে যে Standard এর কোন অংশ
              সে মানে আর কোনটা মানে না। তাই PostgreSQL এ শেখা অভ্যাস অন্য
              Program এ নিতে সাধারণত কম বদলাতে হয়। Dialect নিয়ে পুরো একটা মডিউল
              আছে ট্র্যাকের শেষ দিকে, Module 21।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "sql-mysql-postgresql",
      subHeader: { index: "004", title: "SQL vs MySQL vs PostgreSQL" },
      title: <SectionTitle>MySQL আর PostgreSQL ঠিক কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এবার সুনির্দিষ্ট হই। আপনার ভিডিওর বিষয়গুলো যেখানে যেখানে ছুঁয়ে যায়,
                সেখানে দুই Program এর লেখা কোথায় আলাদা, তার একটা তালিকা নিচে। প্রতিটা
                সারি MySQL এর অফিসিয়াল Documentation আর আসল PostgreSQL এ চালিয়ে
                মিলিয়ে দেখা। এখনই সব মুখস্থ করার দরকার নেই। এই Table টা একটা
                অভিধান, দরকার হলে ফিরে আসবেন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "MySQL (ভিডিও)", "PostgreSQL (এই ট্র্যাক)"],
          rows: [
            [
              "নিজে থেকে বাড়া ID",
              <code key="m1">id INT AUTO_INCREMENT</code>,
              <code key="p1">id integer GENERATED ALWAYS AS IDENTITY</code>,
            ],
            [
              "অদ্ভুত বা Keyword নাম মুড়িয়ে লেখা",
              <code key="m2">`order`</code>,
              <code key="p2">&quot;order&quot;</code>,
            ],
            [
              "LIKE আর ছোট বড় হাতের অক্ষর",
              "Default এ ছোট বড় একই ধরে",
              "অক্ষরে অক্ষরে মেলায়, না মানতে চাইলে ILIKE",
            ],
            [
              "|| চিহ্নের মানে",
              "Default এ OR, এই ব্যবহার এখন Deprecated",
              "লেখা জোড়া দেওয়া",
            ],
            [
              "FULL OUTER JOIN",
              "নেই, LEFT আর RIGHT JOIN কে UNION দিয়ে জুড়তে হয়",
              "সরাসরি লেখা যায়",
            ],
            [
              "CHECK Constraint",
              "8.0.16 থেকে মানা হয়, তার আগে লেখা যেত কিন্তু উপেক্ষা হতো",
              "সবসময় মানা হয়",
            ],
            [
              "তারিখ আর সময়ের Column",
              <code key="m3">DATETIME</code>,
              <code key="p3">timestamptz</code>,
            ],
            [
              "তারিখকে নিজের Format এ লেখা",
              <code key="m4">DATE_FORMAT(d, &apos;%Y-%m&apos;)</code>,
              <code key="p4">to_char(d, &apos;YYYY-MM&apos;)</code>,
            ],
            [
              "থাকলে বদলানো, না থাকলে ঢোকানো",
              <code key="m5">ON DUPLICATE KEY UPDATE</code>,
              <code key="p5">ON CONFLICT ... DO UPDATE</code>,
            ],
            [
              "GROUP BY এর কড়াকড়ি",
              "ONLY_FULL_GROUP_BY Setting এর উপর নির্ভর করে, 8.0 তে Default চালু",
              "সবসময় কড়া",
            ],
            [
              "Transaction এর ভেতরে CREATE বা DROP TABLE",
              "সাথে সাথে স্থায়ী হয়ে যায়, ROLLBACK এ ফেরে না",
              "ROLLBACK করলে ফিরে যায়",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                শেষ সারিটা একটু ব্যাখ্যা চায়, কারণ এটা শুধু লেখার তফাত না, আচরণের
                তফাত। Transaction মানে কয়েকটা কাজকে একসাথে বেঁধে দেওয়া, যাতে হয়
                সবগুলো টেকে, নয়তো একটাও না। ROLLBACK মানে বাঁধা কাজগুলো বাতিল করা।
                PostgreSQL এ আপনি একটা Transaction এর ভেতরে নতুন Table বানিয়ে
                ROLLBACK করলে Table টা আর থাকে না। MySQL এর Documentation স্পষ্ট
                বলে যে CREATE TABLE, DROP TABLE, ALTER TABLE এর মতো Statement আগের
                সব কাজ সাথে সাথে Commit করে দেয়, তাই সেগুলো আর ফেরানো যায় না।
                Transaction এর পুরো গল্প Module 12 তে। আজ শুধু জেনে রাখুন যে কিছু
                তফাত লেখায় না, আচরণে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Version দেখে নিন",
          content: (
            <ContentParagraph>
              MySQL এর কিছু আচরণ Version ভেদে বদলায়। যেমন CHECK Constraint আসলে
              কাজ করতে শুরু করেছে MySQL 8.0.16 থেকে, আর || কে OR হিসেবে ব্যবহার
              করা 8.0.17 থেকে Deprecated, মানে ভবিষ্যতে সরিয়ে ফেলা হবে। আপনার
              ভিডিও যদি পুরনো Version এ বানানো হয়, কিছু জিনিস আজকের MySQL এ
              অন্যরকম আচরণ করতে পারে। নিজের Version দেখতে MySQL এ লিখবেন{" "}
              <code>SELECT VERSION();</code>, PostgreSQL এ{" "}
              <code>SELECT version();</code>। SQL এর Function এর নাম ছোট বড়
              হাতের অক্ষর মানে না, তাই দুটোই একই কাজ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ভিডিওর প্রথম দিকেই আরেক ধরনের তফাত চোখে পড়বে, যেটা আসলে SQL এর তফাত
                না। শিক্ষক লিখবেন SHOW DATABASES, USE, SHOW TABLES, DESCRIBE। এগুলো
                MySQL এর নিজের Statement, Standard SQL এ নেই। PostgreSQL এর সাথে কথা
                বলার Terminal Program psql এ একই কাজ হয় ব্যাকস্ল্যাশ দিয়ে শুরু হওয়া
                ছোট Command দিয়ে, যাদের বলে Meta-command। এগুলো SQL না, psql নামের
                Tool টার নিজের Command। psql চালানো শিখবেন Module 02 তে, তালিকাটা এখন
                শুধু চিনে রাখুন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "MySQL (ভিডিও)", "psql (PostgreSQL)"],
          rows: [
            ["সব Database এর তালিকা", <code key="l1">SHOW DATABASES;</code>, <code key="l2">\l</code>],
            ["একটা Database এ ঢোকা", <code key="c1">USE island_tours;</code>, <code key="c2">\c island_tours</code>],
            ["সব Table এর তালিকা", <code key="t1">SHOW TABLES;</code>, <code key="t2">\dt</code>],
            ["একটা Table এর Column গুলো", <code key="d1">DESCRIBE tours;</code>, <code key="d2">\d tours</code>],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুই Program এই একটা Standard উপায়ও আছে, যেটা আসলেই SQL: information_schema
              নামের একটা বিশেষ জায়গা, যেখানে Database নিজের সব Table আর Column এর
              তালিকা রাখে। নিচের Query টা এই পাতার বক্সে চালালে Island Tours এর
              আটটা Table এর নাম আসবে। Schema আর public শব্দটার মানে Module 02 তে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "list-tables.sql",
          code: `SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;`,
        },
      ],
    },
    {
      id: "following-a-mysql-video",
      subHeader: { index: "005", title: "Following a MySQL Video" },
      title: <SectionTitle>MySQL এর ভিডিও দেখে PostgreSQL এ অনুশীলন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab টা সেই তালিকাটাকে হাতে ধরার মতো করে সাজানো। একটা কাজ বেছে
              নিন, বাম দিকে দেখবেন ভিডিওতে কীভাবে লেখা, ডান দিকে এই ট্র্যাকে কীভাবে।
              প্রথম কাজটা ইচ্ছা করে রাখা, যেখানে দুই দিক হুবহু এক, কারণ বাস্তবে
              বেশিরভাগ Query ঠিক এরকমই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DialectTranslatorLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার ভিডিওর বিষয়গুলো এই ট্র্যাকের কোন মডিউলে আসছে, সেটাও মিলিয়ে
              রাখুন। তাহলে ভিডিওতে কোনো জায়গা অস্পষ্ট লাগলে জানবেন কোথায় গেলে সেটা
              ধীরে, ছবি আর Lab সহ পাবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভিডিওর বিষয়", "এই ট্র্যাকে কোথায়", "PostgreSQL এ কিছু বদলাতে হবে?"],
          rows: [
            ["Database, DBMS, RDBMS", "Module 01, Lesson 02 আর 04", "না, ধারণা একই"],
            ["CREATE DATABASE, CREATE TABLE, Data Type", "Module 09", "হ্যাঁ, কয়েকটা Type এর নাম আলাদা"],
            ["Primary Key আর Foreign Key", "Module 01 এর Lesson 04, পরে Module 09", "শুধু AUTO_INCREMENT এর জায়গায় IDENTITY"],
            ["SELECT, WHERE, LIMIT, ORDER BY", "Module 03", "না, প্রায় হুবহু এক"],
            ["COUNT, MAX, SUM, GROUP BY, HAVING", "Module 05", "না, শুধু GROUP BY এর কড়াকড়ি খেয়াল রাখুন"],
            ["UPDATE আর DELETE", "Module 10", "না"],
            ["ALTER, CHECK, DEFAULT", "Module 09", "সামান্য, ALTER এর কিছু রূপ আলাদা"],
            ["INNER, LEFT, RIGHT JOIN", "Module 06", "না, আর বাড়তি পাবেন FULL OUTER JOIN"],
            ["Subquery আর View", "Module 07 আর Module 14", "না"],
          ],
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "Step",
          steps: [
            {
              title: "ভিডিও থামিয়ে Query টা পড়ুন",
              description:
                "কপি করার আগে একবার পড়ে বুঝুন Query টা কী চাইছে। কোন Table, কোন শর্ত, কোন ক্রম।",
            },
            {
              title: "নিজের হাতে টাইপ করুন",
              description:
                "কপি না, টাইপ। হাতে লিখলে ভাষাটা আঙুলে বসে যায়, আর ভুল হলে সেই ভুল থেকেই সবচেয়ে বেশি শেখা হয়।",
            },
            {
              title: "চালান, আর Error এলে ঘাবড়াবেন না",
              description:
                "Error এলে প্রথমে এই লেসনের তালিকা দেখুন। AUTO_INCREMENT, Backtick, DATE_FORMAT, LIKE এর মতো চেনা তফাতের কোনোটা কিনা।",
            },
            {
              title: "PostgreSQL এর রূপে লিখে আবার চালান",
              description:
                "তালিকা থেকে PostgreSQL এর রূপটা বসান। কাজ করলে দুটো রূপ পাশাপাশি নিজের খাতায় লিখে রাখুন।",
            },
            {
              title: "তালিকায় না থাকলে Docs দেখুন",
              description:
                "Error Message এর শব্দ দিয়ে PostgreSQL এর Documentation এ খুঁজুন। Error পড়ার পুরো কৌশল Module 02 এর শেষ লেসনে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুটো Program ইনস্টল করার দরকার নেই",
          content: (
            <ContentParagraph>
              শুরুতে একটাই Database ইনস্টল রাখুন, PostgreSQL। দুটো একসাথে চালালে
              কোন Window কোন Database এর, সেটা নিয়েই গুলিয়ে যায়। তবু যদি কোনো
              জায়গায় আটকে যান আর ভিডিওর সাথে হুবহু মিলিয়ে দেখতে চান, Module 02 তে
              MySQL পাশাপাশি চালানোর একটা আলাদা লেসন আছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "declarative",
      subHeader: { index: "006", title: "Declarative" },
      title: <SectionTitle>কীভাবে না, কী চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                SQL এর সবচেয়ে বড় বৈশিষ্ট্যটা এবার। ধরুন আপনি একটা রেস্তোরাঁয়
                গেলেন। ওয়েটারকে বললেন, “এক প্লেট কাচ্চি দিন।” আপনি বলেননি চাল কতক্ষণ
                ভেজাতে হবে, মাংস কোন হাঁড়িতে চড়াতে হবে, আগুন কত হবে। আপনি বলেছেন
                কী চান। কীভাবে বানাবেন, সেটা রাঁধুনির কাজ। রাঁধুনি রান্নাঘরে ঢুকে
                দেখবেন কী আছে, কোন চুলা খালি, আর নিজের অভিজ্ঞতা দিয়ে সবচেয়ে ভালো
                পথটা বেছে নেবেন।
              </ContentParagraph>
              <ContentParagraph>
                SQL ঠিক এভাবে কাজ করে। এই ধরনের ভাষাকে বলে Declarative, মানে
                ঘোষণামূলক: আপনি ফলাফলটা ঘোষণা করেন, পথ না। এর উল্টো হলো
                Imperative ভাষা, যেমন JavaScript বা Python, যেখানে আপনি প্রতিটা ধাপ
                লিখে দেন। দুটো পাশাপাশি দেখুন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DeclarativeSplit />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "cheap-tours.js (Imperative: প্রতিটা ধাপ আপনার)",
          code: `// সব ট্যুর একটা Array তে আছে ধরে নিয়ে
const cheap = [];
for (const tour of tours) {
  if (tour.price_bdt < 10000) {
    cheap.push({ title: tour.title, price_bdt: tour.price_bdt });
  }
}
cheap.sort((a, b) => a.price_bdt - b.price_bdt);`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "cheap-tours.sql (Declarative: শুধু কী চাই)",
          code: `SELECT title, price_bdt
FROM tours
WHERE price_bdt < 10000
ORDER BY price_bdt;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                JavaScript এর লেখায় আপনি বলে দিয়েছেন প্রথম থেকে শেষ পর্যন্ত একটা
                একটা করে দেখতে, শর্ত মিললে আলাদা জায়গায় রাখতে, শেষে সাজাতে। এই পথ
                নয় ট্যুরের জন্য ঠিক আছে। কিন্তু Table এ যদি নয় কোটি Row থাকে? তখন
                প্রতিটা Row খোলা খুব ধীর। SQL এর লেখায় কোনো পথ বলা নেই, তাই DBMS
                নিজে ঠিক করতে পারে। যদি দামের উপর একটা Index থাকে, মানে বইয়ের
                শেষের সূচির মতো একটা সাজানো তালিকা, তাহলে DBMS সরাসরি সেখানে গিয়ে
                দশ হাজারের কম দামগুলো তুলে নেবে, বাকি Row ছোঁবেও না।
              </ContentParagraph>
              <ContentParagraph>
                আপনার লেখা একই থাকল, শুধু DBMS এর পরিকল্পনা বদলাল। DBMS এর যে অংশ
                এই পরিকল্পনা করে তার নাম Planner, আর তার পরিকল্পনা কীভাবে পড়তে হয়
                সেটা শিখবেন Module 13 তে। আপাতত এই একটা কথা মনে রাখুন: SQL লেখার
                সময় ভাববেন কী চাই, কীভাবে খুঁজবে সেটা DBMS এর মাথাব্যথা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "লেখার ক্রম আর কাজের ক্রম আলাদা",
          content: (
            <ContentParagraph>
              Declarative হওয়ার একটা মজার ফল আছে। SQL বাক্যে SELECT লেখা হয়
              সবার আগে, কিন্তু DBMS কাজ শুরু করে FROM থেকে: আগে Table টা ধরে,
              তারপর শর্ত দিয়ে ছাঁকে, তারপর Column বাছে, শেষে সাজায়। বাক্যটা লেখা
              হয়েছে মানুষের পড়ার সুবিধার জন্য, কাজের ক্রমে না। এই বিষয়ের পুরো
              একটা লেসন আছে Module 03 তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "history",
      subHeader: { index: "007", title: "A Short History" },
      title: <SectionTitle>পঞ্চাশ বছরের পুরনো একটা ভাষা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                SQL এর গল্প শুরু ১৯৭০ সালে। IBM এর গবেষক Edgar F. Codd একটা Paper
                লিখলেন, যেখানে প্রস্তাব দিলেন Data কে Table এর মতো সারি আর কলামে
                সাজিয়ে রাখার, যার নাম Relational Model। এই মডেলের বিস্তারিত পরের
                লেসনে, Lesson 04 এ আপনি সেটা Island Tours এর Table দিয়ে হাতে ধরে
                দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                Codd এর ধারণা পড়ে IBM এরই দুই গবেষক, Donald Chamberlin আর Raymond
                Boyce, ১৯৭০ এর দশকের শুরুতে এমন একটা ভাষা বানালেন যেটা দিয়ে এই
                Table গুলোকে প্রশ্ন করা যায়, প্রায় ইংরেজি বাক্যের মতো করে। নাম
                দিলেন SEQUEL, Structured English Query Language। পরে দেখা গেল SEQUEL
                নামটা যুক্তরাজ্যের একটা কোম্পানির Trademark, তাই নাম ছোট হয়ে হলো SQL।
                আজও যে অনেকে সিকুয়েল উচ্চারণ করেন, সেটা সেই পুরনো নামের রেশ।
              </ContentParagraph>
              <ContentParagraph>
                ১৯৭৯ সালে Relational Software নামের একটা কোম্পানি, যার আজকের নাম
                Oracle, বাজারে আনল প্রথম দিকের বিক্রিযোগ্য SQL Database গুলোর একটা।
                এরপর অনেকে নিজের মতো করে SQL বানাতে শুরু করায় একটা Standard দরকার
                হলো। ১৯৮৬ সালে আমেরিকার ANSI আর ১৯৮৭ সালে আন্তর্জাতিক ISO SQL কে
                Standard হিসেবে গ্রহণ করল। তখন থেকে কয়েক বছর পরপর নতুন Version আসে,
                সর্বশেষটা SQL:2023।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SqlTimelineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আজকের দুই জনপ্রিয় Program এসেছে অনেক পরে। MySQL এর প্রথম Release
              ১৯৯৫ সালে, সুইডেনের MySQL AB কোম্পানি থেকে, আর আজ এর মালিক Oracle।
              PostgreSQL এর শুরু ১৯৮৫ সালে UC Berkeley তে POSTGRES নামের একটা
              গবেষণা Project হিসেবে। ১৯৯৪ সালে তাতে SQL যোগ হয়, আর ১৯৯৬ সালে SQL
              বোঝে বলে নাম রাখা হয় PostgreSQL। আজ এটা কোনো একক কোম্পানির না, একটা
              বিশ্বব্যাপী Open Source সম্প্রদায় এটা চালায়। এই ইতিহাসের একটাই শিক্ষা:
              ভাষাটা Program গুলোর চেয়ে পুরনো, আর তারা সবাই ভাষাটার ব্যবহারকারী।
              তাই ভাষাটা শিখলে সেটা দশকের পর দশক কাজে লাগে।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "command-families",
      subHeader: { index: "008", title: "Five Families" },
      title: <SectionTitle>SQL এর পাঁচ পরিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                SQL এ শত শত Command আছে, কিন্তু সবগুলো পাঁচটা পরিবারে ভাগ করা যায়।
                ভাগটা হয় একটা সহজ প্রশ্ন দিয়ে: এই Command কী বদলায়? Island Tours
                কে একটা লাইব্রেরি ভাবুন। লাইব্রেরিতে তাক আছে, তাকে বই আছে, পাঠক
                আছেন, আর কে কোন তাকে হাত দিতে পারবেন তার নিয়ম আছে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CommandFamiliesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>DDL, Data Definition Language।</strong> কাঠামো বানায়,
                বদলায়, মোছে। নতুন Table তৈরি, Table এ নতুন Column যোগ, পুরো Table
                মুছে ফেলা। লাইব্রেরিতে নতুন তাক বানানোর মতো। Command গুলো CREATE,
                ALTER, DROP। Island Tours এ নতুন একটা Feature আসলে, যেমন ট্যুরে
                নোট রাখার সুবিধা, প্রথম কাজ হয় একটা DDL: নতুন Table বানানো।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DML, Data Manipulation Language।</strong> কাঠামো ঠিক রেখে
                ভেতরের Data বদলায়। নতুন Row ঢোকানো, কোনো Row এর মান বদলানো, Row
                মুছে ফেলা। তাকে বই রাখা আর সরানোর মতো। Command গুলো INSERT, UPDATE,
                DELETE। একজন Customer যখন Island Tours এ একটা ট্যুর বুক করেন, পেছনে
                bookings Table এ একটা INSERT চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DQL, Data Query Language।</strong> কিছুই বদলায় না, শুধু
                পড়ে। Command একটাই, SELECT, কিন্তু এর ক্ষমতা এত বিশাল যে এই
                ট্র্যাকের Module 03 থেকে 08, ছয়টা মডিউল শুধু এটা নিয়ে। Website এ
                ট্যুরের তালিকা দেখানো, একজন Customer এর পুরনো Booking দেখানো, মাসের
                আয়ের Report, সব SELECT।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DCL, Data Control Language।</strong> Data বা কাঠামো না,
                অনুমতি বদলায়। কে কোন Table পড়তে পারবেন, কে লিখতে পারবেন। লাইব্রেরি
                কার্ড কাকে কোন তাকের জন্য দেবেন, সেই সিদ্ধান্তের মতো। Command গুলো
                GRANT আর REVOKE। Island Tours এর হিসাব বিভাগের একজনকে শুধু পড়ার
                অনুমতি দেওয়া, কিছু বদলানোর না, এটা DCL এর কাজ। পুরো বিষয়টা Module 16
                তে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>TCL, Transaction Control Language।</strong> কয়েকটা কাজকে
                একসাথে বাঁধে। একটা Booking মানে দুটো কাজ: departures Table এ খালি
                সিট কমানো, আর bookings Table এ নতুন Row। মাঝপথে বিদ্যুৎ চলে গেলে
                যেন সিট কমে গিয়ে Booking হারিয়ে না যায়, তাই দুটোকে BEGIN আর COMMIT
                দিয়ে বেঁধে দেওয়া হয়। কিছু ভুল হলে ROLLBACK, যেন কিছুই হয়নি।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "island-tours-families.sql",
          code: `-- DDL: কাঠামো বানানো
CREATE TABLE tour_notes (
  note_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note    text NOT NULL
);

-- DML: Data বদলানো
UPDATE tours SET price_bdt = 9000 WHERE tour_id = 2;

-- DQL: শুধু পড়া
SELECT title, price_bdt FROM tours WHERE tour_id = 2;

-- DCL: অনুমতি দেওয়া
CREATE ROLE report_reader;
GRANT SELECT ON tours TO report_reader;

-- TCL: দুটো কাজ একসাথে বাঁধা
BEGIN;
UPDATE departures SET seats_left = seats_left - 2 WHERE departure_id = 9;
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 9, 2, 'pending', 25000.00);
COMMIT;`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "বইভেদে ভাগ একটু আলাদা",
          content: (
            <ContentParagraph>
              এই পাঁচ ভাগ কোনো আইন না, শেখার সুবিধার জন্য একটা চলতি রীতি। অনেক বই
              আর টিউটোরিয়াল SELECT কে আলাদা পরিবার না ধরে DML এর ভেতরেই রাখে, আর
              কেউ কেউ TCL কে আলাদা না ধরে চারটা ভাগের কথা বলে। আপনার ভিডিও বা অন্য
              কোথাও চার ভাগ দেখলে অবাক হবেন না। যে প্রশ্নটা দিয়ে ভাগ করা হয়, সেটা
              সবখানে এক: Command টা কী বদলায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "families-at-work",
      subHeader: { index: "009", title: "Sort the Statements" },
      title: <SectionTitle>নিজে হাতে ভাগ করে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পরিবারগুলো একবার পড়ে মনে থাকে না, কয়েকবার নিজে ভাগ করলে থাকে। নিচে
              Island Tours এর বারোটা আসল Statement। প্রতিটা পড়ে বলুন সেটা কোন
              পরিবারের। দুটো ফাঁদ ইচ্ছা করে রাখা আছে: DELETE আর DROP দেখতে একই রকম
              ভয়ের, কিন্তু আলাদা পরিবার, আর count এর মতো হিসাব করা Query ও আসলে শুধু
              পড়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CommandFamilyLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পরিবার চেনার একটা বাস্তব লাভ আছে। Production Database এ কিছু চালানোর
              আগে অভিজ্ঞ Developer রা প্রথমে এটাই দেখেন। DQL হলে নিশ্চিন্তে চালানো
              যায়, কারণ কিছু বদলাবে না। DML হলে দেখতে হয় WHERE ঠিক আছে কিনা,
              নইলে ভুল Row বদলে যাবে। DDL হলে আরও সাবধান, কারণ DROP এর পরে Table
              ফেরানোর একমাত্র উপায় Backup। এই অভ্যাসটা আজ থেকেই গড়ে তুলুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "anatomy",
      subHeader: { index: "010", title: "Anatomy of a Statement" },
      title: <SectionTitle>একটা SQL বাক্যের শরীর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বাংলা বাক্যে যেমন কর্তা, ক্রিয়া, কর্ম থাকে, SQL বাক্যেও কয়েক ধরনের
              টুকরো থাকে। SQL এর একটা বাক্যকে বলে Statement। টুকরোগুলোর নাম জানা
              থাকলে Documentation পড়া সহজ হয়, আর Error Message কোন টুকরোর কথা
              বলছে সেটা ধরতে পারবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StatementAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Keyword</strong>: SQL এর নিজের সংরক্ষিত শব্দ, যেমন SELECT,
                FROM, WHERE, ORDER BY, INSERT। এগুলোর মানে ভাষাই ঠিক করে দেয়।
              </ListItem>
              <ListItem>
                <strong>Identifier</strong>: আপনার Database এর জিনিসের নাম। Table
                এর নাম tours, Column এর নাম title আর price_bdt। এগুলো আপনি বা
                Database এর ডিজাইনার ঠিক করেছেন।
              </ListItem>
              <ListItem>
                <strong>Literal</strong>: হাতে লেখা একটা মান, যেমন সংখ্যা 10000 বা
                লেখা &apos;confirmed&apos;।
              </ListItem>
              <ListItem>
                <strong>Operator</strong>: তুলনা বা হিসাবের চিহ্ন, যেমন {"<"}, =, +।
              </ListItem>
              <ListItem>
                <strong>Clause</strong>: একটা Keyword দিয়ে শুরু হওয়া পুরো একটা অংশ।
                WHERE price_bdt {"<"} 10000 পুরোটা মিলে একটা WHERE Clause।
              </ListItem>
              <ListItem>
                <strong>Semicolon</strong>: Statement শেষ হওয়ার চিহ্ন, বাংলায় দাঁড়ির
                মতো। একটার বেশি Statement পরপর লিখলে Semicolon দিয়ে আলাদা করতে হয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    {
      id: "writing-rules",
      subHeader: { index: "011", title: "Writing Rules" },
      title: <SectionTitle>লেখার ছয়টা নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>এক, Keyword এর ছোট বড় হাতের অক্ষর মানা হয় না।</strong>{" "}
                SELECT, select, SeLeCt, তিনটাই এক। চলতি রীতি হলো Keyword বড় হাতে আর
                নাম ছোট হাতে লেখা, যাতে চোখে আলাদা করা যায়। এই ট্র্যাকে সেই রীতি
                মানা হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দুই, ফাঁকা জায়গা আর নতুন লাইন যত খুশি।</strong> পুরো
                Statement এক লাইনে লিখলেও চলে, দশ লাইনে ভাঙলেও চলে। প্রতিটা Clause
                নতুন লাইনে লিখলে পড়া সহজ হয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>তিন, Statement শেষে Semicolon।</strong> psql এর মতো Tool এ
                Semicolon না দিলে Enter চাপলেও Query চলে না, Tool অপেক্ষা করে আরও
                কিছু লেখার জন্য। শুরুতে এটা অনেককে বিভ্রান্ত করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>চার, Comment লেখা যায়।</strong> দুটো Hyphen দিয়ে শুরু করলে
                লাইনের বাকিটা Database উপেক্ষা করে। কয়েক লাইনের Comment এর জন্য
                শুরুতে /* আর শেষে */। Comment দিয়ে নিজের জন্য নোট রাখুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পাঁচ, লেখা মানে Single Quote।</strong> &apos;confirmed&apos;,
                &apos;Dhaka&apos;। লেখার ভেতরেই যদি Single Quote থাকে, যেমন Cox&apos;s
                Bazar, তাহলে সেটা পরপর দুইবার লিখতে হয়: &apos;Cox&apos;&apos;s
                Bazar&apos;।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ছয়, নাম মুড়াতে Double Quote।</strong> PostgreSQL এ
                Double Quote মানে লেখা না, একটা নাম। আর Double Quote ছাড়া লেখা নাম
                PostgreSQL ছোট হাতের অক্ষরে বদলে নেয়। তাই TITLE লিখলে সেটা title
                Column খুঁজে পায়, কিন্তু &quot;Title&quot; লিখলে খোঁজে ঠিক বড় T সহ
                Title, যেটা নেই। MySQL এ নাম মোড়ানো হয় Backtick দিয়ে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিয়মগুলো নিজে পরখ করুন"
              query={`SeLeCt count(*) FrOm customers; -- ছোট বড় অক্ষর মেশানো, তবু চলে

SELECT name
FROM destinations
WHERE name = 'Cox''s Bazar';  -- লেখার ভেতরের Quote দুইবার`}
              caption="দুটো Statement একসাথে চলবে, দুটো ফলাফল আলাদা আলাদা দেখাবে। এবার দ্বিতীয়টার Single Quote বদলে Double Quote দিন, মানে WHERE name = &quot;Cox's Bazar&quot;, আর চালিয়ে Error টা পড়ুন। PostgreSQL ভাববে আপনি একটা Column এর নাম বলছেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL এর Default Setting এ Double Quote ও লেখা হিসেবে চলে, তাই
              ভিডিওতে কখনো WHERE status = &quot;confirmed&quot; দেখতে পারেন।
              PostgreSQL এ সেটা Error দেবে। সবচেয়ে নিরাপদ অভ্যাস: লেখা সবসময়
              Single Quote এ। এটা দুই জায়গাতেই চলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "where-sql-lives",
      subHeader: { index: "012", title: "Where You Write SQL" },
      title: <SectionTitle>SQL কোথায় কোথায় লেখা হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এখন পর্যন্ত আপনি SQL লিখেছেন এই পাতার Query বক্সে। কাজের জীবনে একই
                ভাষা আপনি পাঁচ রকম জায়গায় লিখবেন বা দেখবেন। জায়গা বদলায়, ভাষা
                বদলায় না। এটা আগে থেকে জানা থাকলে নতুন কোনো Tool খুললে আর অচেনা
                লাগবে না।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম জায়গা Terminal, যেখানে psql নামের একটা Program খুলে সরাসরি
                SQL টাইপ করেন। দ্বিতীয়টা GUI Client, মানে মাউস দিয়ে চালানো একটা
                Window, যেমন pgAdmin, DBeaver বা TablePlus, যার ভেতরে একটা Query
                লেখার জায়গা থাকে। এই দুটো ইনস্টল আর ব্যবহার করা Module 02 তে। তৃতীয়
                জায়গা আপনার App এর Code, যেখানে SQL লেখা থাকে একটা লেখা হিসেবে, আর
                Code সেটা Database এ পাঠায়। চতুর্থ জায়গা ORM, এমন একটা Library যেটা
                আপনার Code দেখে নিজেই SQL বানিয়ে নেয়। আপনি হয়তো SQL লেখেননি, কিন্তু
                পেছনে SQL ই চলেছে। পঞ্চম জায়গা Migration ফাইল, যেখানে Table বানানো
                আর বদলানোর DDL গুলো ক্রম অনুযায়ী জমা থাকে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["জায়গা", "কে লেখে", "কখন", "এই ট্র্যাকে কোথায়"],
          rows: [
            ["psql, Terminal এ", "Developer, Database এর দায়িত্বে থাকা মানুষ", "পরীক্ষা, Debug, Production এ জরুরি কাজ", "Module 02"],
            ["GUI Client", "Developer, Analyst", "Data দেখা, Report, শেখা", "Module 02"],
            ["App এর Code এ", "Backend Developer", "প্রতিটা Request এ", "Lesson 06 আর Module 17"],
            ["ORM এর পেছনে", "Library নিজে, আপনার Code দেখে", "প্রতিটা Request এ", "Module 17"],
            ["Migration ফাইল", "Developer", "Deploy এর সময়", "Module 17"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে একই প্রশ্ন, confirmed Booking এর সংখ্যা, তিন জায়গায় কেমন দেখায়।
              psql এর অংশটা শুধু দেখার জন্য, ইনস্টল করে চালাবেন Module 02 এর পরে।
              Node.js এর অংশটা চালাবেন Lesson 06 আর Module 17 এর পরে। খেয়াল করুন,
              তিনটাতেই ভেতরের SQL বাক্যটা প্রায় একই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql (Module 02 এর পরে চালাবেন)",
          code: `island_tours=# SELECT count(*) FROM bookings WHERE status = 'confirmed';
 count
-------
    17
(1 row)`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "count-confirmed.js (Lesson 06 আর Module 17 এর পরে চালাবেন)",
          code: `import pg from "pg";

// Connection এর ঠিকানা আসে Environment Variable থেকে, Code এ লেখা থাকে না
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });

// SQL টা একটা সাধারণ লেখা, শুধু মানটা আলাদা করে পাঠানো হয় ($1)
const result = await pool.query(
  "SELECT count(*) FROM bookings WHERE status = $1",
  ["confirmed"],
);
console.log(result.rows[0].count);

await pool.end();`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Code এ SQL লেখার একটা নিয়ম আজই জেনে রাখুন",
          content: (
            <ContentParagraph>
              উপরের Code এ confirmed শব্দটা সরাসরি SQL লেখার ভেতরে বসানো হয়নি,
              আলাদা করে $1 এর জায়গায় পাঠানো হয়েছে। ব্যবহারকারীর দেওয়া কোনো মান
              কখনো SQL লেখার সাথে জোড়া লাগিয়ে পাঠাবেন না। জোড়া লাগালে একজন দুষ্টু
              ব্যবহারকারী মানের জায়গায় নিজের SQL ঢুকিয়ে দিতে পারেন, যার নাম SQL
              Injection, Database এর সবচেয়ে পরিচিত আক্রমণ। কীভাবে ঘটে আর কেন এই
              আলাদা করে পাঠানোই সমাধান, সেটা Lesson 06 এ একটু আর Module 16 তে
              পুরোটা।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "see-it-yourself",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দুটো পরীক্ষা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম পরীক্ষা: MySQL এর ভিডিও থেকে LIKE এর একটা Query সরাসরি
              PostgreSQL এ চালালে কী হয়। একই বক্সে দুটো Statement, একটা LIKE দিয়ে,
              একটা ILIKE দিয়ে। Run চাপার আগে আন্দাজ করুন প্রথমটা কয়টা Row দেবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LIKE বনাম ILIKE"
              query={`SELECT title FROM tours WHERE title LIKE 'saint%';

SELECT title FROM tours WHERE title ILIKE 'saint%';`}
              caption="প্রথমটা শূন্য Row দেয়, কারণ PostgreSQL এ LIKE ছোট s আর বড় S কে আলাদা ধরে, আর সব ট্যুরের নাম বড় S দিয়ে শুরু। দ্বিতীয়টা দুটো ট্যুর দেয়। MySQL এর Default Setting এ প্রথমটাই দুটো দিত। এটাই সেই নিঃশব্দ তফাত, যেখানে Error আসে না, শুধু উত্তরটা ভুল আসে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় পরীক্ষা: তিনটা পরিবার একসাথে। প্রথমে DDL দিয়ে একটা নতুন Table,
              তারপর DML দিয়ে দুটো Row, শেষে DQL দিয়ে পড়া। চালানোর পরে আরেকবার Run
              চাপুন। এবার একটা Error আসবে, কারণ Table টা তো আগেই বানানো হয়ে গেছে।
              Error টা পড়ুন, তারপর Reset চাপলে সব আগের মতো হয়ে যাবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DDL, DML, DQL পরপর"
              query={`CREATE TABLE tour_notes (
  note_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note    text NOT NULL
);

INSERT INTO tour_notes (note)
VALUES ('Life jackets on the boat'), ('Bring sunscreen');

SELECT * FROM tour_notes;`}
              caption="ফলাফলে প্রথমে CREATE, তারপর INSERT 2, তারপর দুই Row এর একটা Table দেখবেন। note_id নিজে থেকে 1 আর 2 হয়েছে, কারণ GENERATED ALWAYS AS IDENTITY। MySQL এ এই জায়গায় লিখতেন AUTO_INCREMENT।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা জিনিস খেয়াল করুন। এই পাতার সব বক্স একই Database ব্যবহার করে,
              ঠিক একটা psql Session এর মতো। তাই এখানে বানানো tour_notes Table টা
              অন্য বক্স থেকেও দেখা যাবে, যতক্ষণ না Reset চাপেন বা পাতাটা আবার Load
              করেন। ভয় পাওয়ার কিছু নেই, এই Database আপনার Browser এর ভেতরে, কোনো
              আসল Data নষ্ট হওয়ার উপায় নেই। যত খুশি ভাঙুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কে কোন SQL চালায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একটা চালু ব্যবসায় পাঁচ পরিবারের SQL পাঁচ রকম মানুষ আর Program চালায়,
                পাঁচ রকম সময়ে। Island Tours এর একটা সাধারণ দিন দিয়ে দেখি।
              </ContentParagraph>
              <ContentParagraph>
                সকালে একজন পর্যটক Website খুললেন। তাঁর ফোনে ট্যুরের তালিকা দেখানোর
                জন্য Island Tours এর API, মানে পেছনের Server এর Program, একটা SELECT
                চালাল: চালু ট্যুরগুলো, দাম সহ। এটা DQL, আর সারাদিনে এই ধরনের Query
                সবচেয়ে বেশি চলে, হাজারবার।
              </ContentParagraph>
              <ContentParagraph>
                দুপুরে তিনি একটা ট্যুর বুক করলেন। API একটা Transaction খুলল,
                departures এ খালি সিট কমাল, bookings এ নতুন Row ঢোকাল, আর COMMIT
                করল। এখানে TCL আর DML একসাথে। পর্যটক এসবের কিছুই দেখেননি, শুধু
                দেখেছেন “Booking সফল”।
              </ContentParagraph>
              <ContentParagraph>
                বিকেলে Developer একটা নতুন Feature Deploy করলেন: ট্যুরে নোট রাখার
                সুবিধা। Deploy এর সময় একটা Migration চলল, মানে আগে থেকে লেখা একটা
                DDL ফাইল, যেটা tour_notes Table বানাল। Migration নিয়ে পুরো আলোচনা
                Module 17 তে।
              </ContentParagraph>
              <ContentParagraph>
                সন্ধ্যায় হিসাব বিভাগের নতুন কর্মী যোগ দিলেন। Database এর দায়িত্বে থাকা
                মানুষটি তাঁর জন্য একটা Role বানিয়ে শুধু পড়ার অনুমতি দিলেন। DCL।
                এতে তিনি Report বানাতে পারবেন, কিন্তু ভুল করে কোনো Booking মুছে
                ফেলতে পারবেন না।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিবার", "Island Tours এ কখন", "কে চালায়", "কত ঘন ঘন"],
          rows: [
            ["DQL", "ট্যুরের তালিকা, Booking এর ইতিহাস, Report", "API আর Analyst", "সারাক্ষণ"],
            ["DML", "নতুন Booking, দাম বদল, Review", "API", "প্রতিটা ক্লিকে"],
            ["TCL", "Booking আর Payment এর মতো একাধিক ধাপের কাজ", "API", "প্রতিটা গুরুত্বপূর্ণ লেখায়"],
            ["DDL", "নতুন Feature এর Table বা Column", "Deploy এর সময় Migration", "সপ্তাহে কয়েকবার"],
            ["DCL", "নতুন কর্মী, নতুন Service", "Database এর দায়িত্বে থাকা মানুষ", "কালেভদ্রে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আপনার my-tours Project এর জন্য",
          content: (
            <ContentParagraph>
              নিজের Project এ কাজ শুরু করলে প্রথম যে SQL লিখবেন সেটা হবে DDL, Table
              বানানো। কিন্তু সারাজীবন সবচেয়ে বেশি লিখবেন DQL। তাই এই ট্র্যাক
              DDL এর আগে SELECT শেখায়: Module 03 থেকে 08 পড়া, তারপর Module 09 এ
              নিজের Table বানানো। আগে ভালো Table দেখে চোখ তৈরি হোক, তারপর নিজে
              বানানো।
            </ContentParagraph>
          ),
        },
      ],
    },
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা প্রশ্ন থেকে একটা SQL বাক্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর মালিক জানতে চান, এখন পর্যন্ত কতগুলো Booking confirmed
              হয়েছে। এই সাধারণ প্রশ্নটা থেকে একটা SQL বাক্য পর্যন্ত যাওয়ার পথটা ধাপে
              ধাপে দেখুন। এই অভ্যাসটাই পুরো ট্র্যাকে বারবার কাজে লাগবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "Step",
          steps: [
            {
              title: "প্রশ্নটা নিজের ভাষায় পরিষ্কার করুন",
              description:
                "কতগুলো Booking এর status confirmed? মানে একটা সংখ্যা চাই, তালিকা না।",
            },
            {
              title: "Data কোন Table এ আছে খুঁজুন",
              description:
                "Booking এর তথ্য bookings Table এ, আর status একটা Column। Sample Database এর পাতায় প্রতিটা Column এর মানে লেখা আছে।",
            },
            {
              title: "কোন পরিবারের কাজ ঠিক করুন",
              description:
                "কিছু বদলাচ্ছি না, শুধু গুনছি। তাই DQL, মানে SELECT।",
            },
            {
              title: "Keyword দিয়ে কঙ্কাল বানান",
              description:
                "SELECT ... FROM ... WHERE ...; কোন Keyword লাগবে আগে বসিয়ে নিন, ফাঁকা জায়গা পরে ভরবেন।",
            },
            {
              title: "Identifier আর Literal বসান",
              description:
                "SELECT count(*) FROM bookings WHERE status = 'confirmed'; লেখাটা Single Quote এ, নামগুলো যেমন আছে তেমন।",
            },
            {
              title: "চালান আর উত্তরটা যাচাই করুন",
              description:
                "উত্তর আসে 17। যুক্তি দিয়ে মিলিয়ে নিন: মোট ২৪টা Booking, তার মধ্যে কিছু pending আর কিছু cancelled, তাই 17 বিশ্বাসযোগ্য।",
            },
            {
              title: "MySQL এ লিখলে কিছু বদলাবে কিনা দেখুন",
              description:
                "এই বাক্যে কোনো আঞ্চলিক শব্দ নেই, তাই MySQL এও হুবহু চলবে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "confirmed-bookings.sql",
          code: `SELECT count(*) AS confirmed_bookings
FROM bookings
WHERE status = 'confirmed';

--  confirmed_bookings
-- --------------------
--                  17
-- (1 row)`,
        },
      ],
    },
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>নতুনরা যেখানে আটকান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>SQL আর MySQL কে একই ভাবা।</strong> Interview তে “SQL জানেন?”
                প্রশ্নের উত্তরে “আমি PostgreSQL ব্যবহার করি, SQL পারি” বলা আর “আমি
                MySQL জানি না” বলার মধ্যে বড় পার্থক্য। প্রথমটা সঠিক বোঝাপড়া দেখায়।
              </ListItem>
              <ListItem>
                <strong>লেখার জন্য Double Quote।</strong> PostgreSQL এ WHERE title =
                &quot;Sylhet Tea Garden Tour&quot; চালালে Error আসে column
                &quot;Sylhet Tea Garden Tour&quot; does not exist। PostgreSQL লেখাটাকে
                একটা Column এর নাম ভেবেছে। সমাধান Single Quote।
              </ListItem>
              <ListItem>
                <strong>PostgreSQL এ Backtick।</strong> MySQL থেকে কপি করা Query তে
                Backtick থাকলে PostgreSQL দেয় syntax error at or near। Backtick
                সরিয়ে দিন, নাম Keyword হলে Double Quote দিন।
              </ListItem>
              <ListItem>
                <strong>LIKE কে ছোট বড় না মানা ধরে নেওয়া।</strong> এখানে Error আসে
                না, শুধু কম Row আসে। সবচেয়ে বিপজ্জনক ভুল সেগুলো, যেগুলো চুপচাপ ভুল
                উত্তর দেয়।
              </ListItem>
              <ListItem>
                <strong>MySQL এ || দিয়ে লেখা জোড়া।</strong> MySQL এর Default
                Setting এ এটা OR, তাই ফলাফল আসে 0 বা 1 এর মতো অদ্ভুত কিছু। দুই
                জায়গায় চলে এমন উপায় CONCAT()।
              </ListItem>
              <ListItem>
                <strong>Semicolon ভুলে যাওয়া।</strong> psql এ Enter চাপলেও কিছু হয়
                না, Prompt বদলে অপেক্ষা করে। Semicolon দিয়ে আবার Enter চাপুন।
              </ListItem>
              <ListItem>
                <strong>পুরো ভাষা একসাথে মুখস্থ করার চেষ্টা।</strong> SQL এর
                Keyword এর তালিকা লম্বা, কিন্তু রোজকার কাজের নব্বই ভাগ চলে দশ বারোটা
                দিয়ে। একটা একটা করে, Lab করে শিখুন।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  আপনি যে SQL কোর্সটা দেখছেন (YouTube)
                </a>
                : MySQL দিয়ে শেখানো। এই লেসনের অনুবাদের তালিকা পাশে রেখে দেখুন।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/tutorial-sql-intro.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  PostgreSQL Tutorial: The SQL Language
                </a>
                : অফিসিয়াল Documentation এর শুরুর অধ্যায়, ছোট আর নির্ভরযোগ্য।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  PostgreSQL: Lexical Structure
                </a>
                : Keyword, Identifier, Literal, Quote আর Comment এর সব নিয়ম এক জায়গায়।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/features.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  PostgreSQL: SQL Conformance
                </a>
                : PostgreSQL Standard এর কোন অংশ মানে, নিজেই লিখে রেখেছে।
              </ListItem>
              <ListItem>
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  MySQL 8.4 Reference Manual
                </a>
                : ভিডিওর কোনো আচরণ নিয়ে সন্দেহ হলে MySQL এর নিজের কথা এখানে।
              </ListItem>
              <ListItem>
                <a
                  href="https://en.wikipedia.org/wiki/SQL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Wikipedia: SQL
                </a>
                : ইতিহাস, Standard এর Version আর ভাষার গঠনের একটা ভালো সারসংক্ষেপ।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                SQL একটা ভাষা, Database কে প্রশ্ন করার আর নির্দেশ দেওয়ার। MySQL আর
                PostgreSQL দুটো আলাদা Program, দুটোই এই ভাষা বোঝে, প্রত্যেকে নিজের
                টানে। ভাষার প্রমিত রূপ ISO এর Standard এ লেখা, আর প্রতিটা Program
                এর আঞ্চলিক রূপকে বলে Dialect। আপনার শেখার প্রায় পুরোটা দুই জায়গায়
                এক, তাই MySQL এর ভিডিও দেখে PostgreSQL এ অনুশীলন করা পুরোপুরি চলে,
                শুধু অনুবাদের তালিকাটা পাশে রাখুন।
              </ContentParagraph>
              <ContentParagraph>
                SQL Declarative: আপনি বলেন কী চাই, কীভাবে খুঁজবে সেটা DBMS ঠিক করে।
                ভাষাটা জন্মেছে ১৯৭০ এর দশকে IBM এ, Standard হয়েছে ১৯৮৬ আর ১৯৮৭ তে,
                আর MySQL আর PostgreSQL এসেছে তার অনেক পরে। Command গুলো পাঁচ পরিবারে
                ভাগ: কাঠামো বদলায় DDL, Data বদলায় DML, শুধু পড়ে DQL, অনুমতি বদলায়
                DCL, কাজ একসাথে বাঁধে TCL। একটা Statement তৈরি Keyword, Identifier,
                Literal, Operator দিয়ে, Clause এ ভাগ করা, শেষে Semicolon। লেখা থাকে
                Single Quote এ, নাম মোড়ানো হয় Double Quote এ।
              </ContentParagraph>
              <ContentParagraph>
                পরের লেসনে আমরা দেখব এই SQL বাক্য আসলে কীভাবে একটা App থেকে Database
                পর্যন্ত যায়: Connection খোলা, Query পাঠানো, আর উত্তর ফেরত আসা।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক কথায়"],
    rows: [
      ["SQL", "Database এর সাথে কথা বলার ভাষা, কোনো Program না"],
      ["MySQL আর PostgreSQL", "দুটো DBMS, দুটোই SQL বোঝে, নিজের টানে"],
      ["Standard", "ISO এর লেখা প্রমিত নিয়ম, প্রথম ১৯৮৬, সর্বশেষ SQL:2023"],
      ["Dialect", "প্রতিটা Program এর নিজের সংযোজন আর অভ্যাস"],
      ["Declarative", "কী চাই বলা হয়, কীভাবে খুঁজবে DBMS ঠিক করে"],
      ["পাঁচ পরিবার", "DDL কাঠামো, DML Data, DQL পড়া, DCL অনুমতি, TCL Transaction"],
      ["Statement এর টুকরো", "Keyword, Identifier, Literal, Operator, Clause, Semicolon"],
      ["Quote এর নিয়ম", "লেখা Single Quote এ, নাম Double Quote এ, MySQL এ নাম Backtick এ"],
      ["MySQL ভিডিওর সাথে", "বেশিরভাগ Query হুবহু চলে, তফাতগুলো তালিকায় রাখুন"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SQL, MySQL আর PostgreSQL এর সম্পর্ক কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "MySQL হলো SQL এর নতুন Version",
            isCorrect: false,
            explanation:
              "SQL এর Version এর নাম SQL:2016, SQL:2023 এরকম। MySQL একটা Program, ভাষার Version না।",
          },
          {
            key: "B",
            text: "SQL একটা ভাষা, MySQL আর PostgreSQL সেই ভাষা বোঝে এমন দুটো DBMS",
            isCorrect: true,
            explanation:
              "ঠিক। ভাষা একটা, Program অনেক। প্রত্যেক Program ভাষাটার একটা Dialect বলে।",
          },
          {
            key: "C",
            text: "PostgreSQL এর ভেতরে MySQL চলে",
            isCorrect: false,
            explanation:
              "দুটো সম্পূর্ণ আলাদা Program, আলাদা দলের বানানো, নিজের নিজের ফাইলে Data রাখে।",
          },
          {
            key: "D",
            text: "SQL শুধু MySQL এ চলে, PostgreSQL এর ভাষা আলাদা",
            isCorrect: false,
            explanation:
              "PostgreSQL এর নামেই SQL আছে। ১৯৯৬ সালে SQL বোঝে বলেই নামটা রাখা হয়েছিল।",
          },
        ],
      },
      {
        id: 2,
        text: "SQL কে Declarative ভাষা বলা হয় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ এতে প্রতিটা ধাপ লিখে দিতে হয়",
            isCorrect: false,
            explanation: "এটা Imperative ভাষার বৈশিষ্ট্য, যেমন JavaScript এর for Loop।",
          },
          {
            key: "B",
            text: "কারণ এটা শুধু ঘোষণা করে কোন Table আছে",
            isCorrect: false,
            explanation:
              "Table ঘোষণা করা DDL এর একটা কাজ মাত্র। Declarative কথাটা পুরো ভাষার চরিত্র নিয়ে।",
          },
          {
            key: "C",
            text: "কারণ আপনি বলেন কী ফলাফল চাই, আর কীভাবে খুঁজবে সেটা DBMS ঠিক করে",
            isCorrect: true,
            explanation:
              "ঠিক। ওয়েটারকে কাচ্চি চাওয়ার মতো, রান্নার পদ্ধতি রাঁধুনির। DBMS এর Planner পথ বেছে নেয়।",
          },
          {
            key: "D",
            text: "কারণ এর Keyword বড় হাতের অক্ষরে লিখতে হয়",
            isCorrect: false,
            explanation:
              "Keyword এর ছোট বড় হাতের অক্ষর মানাই হয় না। বড় হাতে লেখা শুধু চলতি রীতি।",
          },
        ],
      },
      {
        id: 3,
        text: "ALTER TABLE customers ADD COLUMN referral_code text; এই Statement কোন পরিবারের?",
        options: [
          {
            key: "A",
            text: "DML, কারণ প্রতিটা Customer এর Row তে নতুন ঘর আসছে",
            isCorrect: false,
            explanation:
              "Row তে নতুন ঘর আসছে ঠিক, কিন্তু সেটা কাঠামোর বদল। কোনো মান ঢোকানো বা বদলানো হচ্ছে না।",
          },
          {
            key: "B",
            text: "DDL",
            isCorrect: true,
            explanation:
              "ঠিক। Table এর কাঠামো, মানে কোন কোন Column আছে, সেটা বদলাচ্ছে। CREATE, ALTER, DROP তিনটাই DDL।",
          },
          {
            key: "C",
            text: "DCL",
            isCorrect: false,
            explanation: "DCL অনুমতি বদলায়, GRANT আর REVOKE দিয়ে। এখানে অনুমতির কোনো কথা নেই।",
          },
          {
            key: "D",
            text: "DQL",
            isCorrect: false,
            explanation: "DQL কিছুই বদলায় না, শুধু পড়ে। এই Statement Table বদলাচ্ছে।",
          },
        ],
      },
      {
        id: 4,
        text: "Island Tours এর Database এ PostgreSQL এ চালালেন: SELECT title FROM tours WHERE title LIKE 'saint%'; কয়টা Row আসবে?",
        options: [
          {
            key: "A",
            text: "২টা, Saint Martin এর দুটো ট্যুর",
            isCorrect: false,
            explanation:
              "MySQL এর Default Setting এ এটাই হতো। কিন্তু PostgreSQL এ LIKE ছোট আর বড় হাতের অক্ষর আলাদা ধরে।",
          },
          {
            key: "B",
            text: "০টা",
            isCorrect: true,
            explanation:
              "ঠিক। সব নাম বড় S দিয়ে শুরু, আর Pattern এ ছোট s। ILIKE লিখলে ২টা আসত। Error আসে না, শুধু উত্তর বদলে যায়।",
          },
          {
            key: "C",
            text: "Error আসবে, কারণ PostgreSQL এ LIKE নেই",
            isCorrect: false,
            explanation: "LIKE Standard SQL, PostgreSQL এ আছে। ILIKE তার বাড়তি সংযোজন।",
          },
          {
            key: "D",
            text: "৯টা, সব ট্যুর",
            isCorrect: false,
            explanation: "% এর আগে saint আছে, তাই শুধু সেই লেখা দিয়ে শুরু হওয়া নাম মেলানো হয়।",
          },
        ],
      },
      {
        id: 5,
        text: "PostgreSQL এ WHERE title = \"Sylhet Tea Garden Tour\" লিখলে Error আসে কেন?",
        options: [
          {
            key: "A",
            text: "কারণ Double Quote এর ভেতরের লেখাকে PostgreSQL একটা Column এর নাম ভাবে",
            isCorrect: true,
            explanation:
              "ঠিক। Error টাও তাই বলে: column \"Sylhet Tea Garden Tour\" does not exist। লেখার জন্য Single Quote লাগে।",
          },
          {
            key: "B",
            text: "কারণ ট্যুরের নামে ফাঁকা জায়গা থাকতে পারে না",
            isCorrect: false,
            explanation: "Single Quote এর ভেতরে ফাঁকা জায়গা থাকলে কোনো সমস্যা নেই।",
          },
          {
            key: "C",
            text: "কারণ এই নামের কোনো ট্যুর নেই",
            isCorrect: false,
            explanation:
              "এই নামের ট্যুর আছে। নাম না মিললে Error আসত না, শুধু শূন্য Row আসত।",
          },
          {
            key: "D",
            text: "কারণ WHERE এর পরে = লেখা যায় না",
            isCorrect: false,
            explanation: "= দিয়ে তুলনা করাই WHERE এর সবচেয়ে সাধারণ ব্যবহার।",
          },
        ],
      },
      {
        id: 6,
        text: "MySQL এর Default Setting এ || চিহ্নের মানে কী?",
        options: [
          {
            key: "A",
            text: "লেখা জোড়া দেওয়া, PostgreSQL এর মতোই",
            isCorrect: false,
            explanation:
              "শুধু PIPES_AS_CONCAT নামের Setting চালু থাকলে। Default এ না।",
          },
          {
            key: "B",
            text: "Comment শুরু",
            isCorrect: false,
            explanation: "Comment শুরু হয় দুটো Hyphen দিয়ে, দুই জায়গাতেই।",
          },
          {
            key: "C",
            text: "Logical OR, আর এই ব্যবহার এখন Deprecated",
            isCorrect: true,
            explanation:
              "ঠিক। তাই MySQL এ লেখা জোড়ার জন্য CONCAT() ব্যবহার হয়, যেটা PostgreSQL এও চলে।",
          },
          {
            key: "D",
            text: "দুটো সংখ্যা গুণ করা",
            isCorrect: false,
            explanation: "গুণের চিহ্ন * দুই জায়গাতেই।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Transaction এর ভেতরে CREATE TABLE চালিয়ে তারপর ROLLBACK করলেন। কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "দুই Program এই Table টা থেকে যায়",
            isCorrect: false,
            explanation: "PostgreSQL এ ROLLBACK এর পরে Table টা আর থাকে না।",
          },
          {
            key: "B",
            text: "PostgreSQL এ Table টা চলে যায়, MySQL এ CREATE TABLE সাথে সাথে Commit হয়ে যায় বলে থেকে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL এর DDL Transaction মানে। MySQL এর Documentation বলে CREATE, ALTER, DROP এর মতো Statement নিজে থেকে Commit ঘটায়।",
          },
          {
            key: "C",
            text: "দুই Program এই Table টা চলে যায়",
            isCorrect: false,
            explanation: "MySQL এ DDL কে ROLLBACK দিয়ে ফেরানো যায় না।",
          },
          {
            key: "D",
            text: "Transaction এর ভেতরে CREATE TABLE লেখাই যায় না",
            isCorrect: false,
            explanation: "লেখা যায়। পার্থক্য হলো ROLLBACK এর পরে কী হয়।",
          },
        ],
      },
      {
        id: 8,
        text: "ভিডিওতে এই Query দেখলেন: SELECT title, price_bdt FROM tours WHERE price_bdt < 10000 ORDER BY price_bdt LIMIT 3; PostgreSQL এ চালাতে কী বদলাতে হবে?",
        options: [
          {
            key: "A",
            text: "LIMIT এর জায়গায় TOP লিখতে হবে",
            isCorrect: false,
            explanation: "TOP হলো SQL Server এর টান। PostgreSQL আর MySQL দুটোই LIMIT বোঝে।",
          },
          {
            key: "B",
            text: "সব Keyword ছোট হাতে লিখতে হবে",
            isCorrect: false,
            explanation: "Keyword এর ছোট বড় হাতের অক্ষর মানা হয় না।",
          },
          {
            key: "C",
            text: "price_bdt কে Double Quote দিয়ে মুড়াতে হবে",
            isCorrect: false,
            explanation: "সাধারণ ছোট হাতের নাম মোড়ানোর দরকার নেই।",
          },
          {
            key: "D",
            text: "কিছুই না, হুবহু চলবে",
            isCorrect: true,
            explanation:
              "ঠিক। এখানে সবকিছু Standard এর মূল অংশ থেকে। আপনার লেখা বেশিরভাগ Query এরকমই হবে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Assignment: ভাষা আর Program আলাদা করে চেনা",
    time: "৪৫-৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="t1">
        কোনো বন্ধু বা পরিবারের সদস্যকে, যিনি Programming জানেন না, পাঁচ মিনিটে
        বুঝিয়ে বলুন SQL, MySQL আর PostgreSQL এর সম্পর্ক কী। নিজের একটা উদাহরণ
        ব্যবহার করুন, এই লেসনের ঢাকা আর চট্টগ্রামের উদাহরণ না। তাঁর প্রশ্নগুলো
        লিখে রাখুন।
      </span>,
      <span key="t2">
        আপনার ভিডিও থেকে অন্তত দশটা Query খুঁজে বের করুন। প্রতিটার পাশে লিখুন সেটা
        DDL, DML, DQL, DCL নাকি TCL, আর এক লাইনে কেন।
      </span>,
      <span key="t3">
        সেই দশটা থেকে পাঁচটা Query এই লেসনের যেকোনো Query বক্সে PostgreSQL এ
        চালান। যেগুলোতে কিছু বদলাতে হয়েছে, সেগুলোর আগের আর পরের রূপ পাশাপাশি
        লিখুন। Island Tours এর Table এ না মিললে Table আর Column এর নাম বদলে নিন।
      </span>,
      <span key="t4">
        একটা Query বক্সে ইচ্ছা করে তিনটা আলাদা ভুল করুন: Double Quote এ লেখা,
        Backtick এ নাম, আর একটা নেই এমন Table। প্রতিটা Error Message হুবহু লিখে রাখুন
        আর নিজের ভাষায় ব্যাখ্যা করুন Error টা কী বলছে।
      </span>,
      <span key="t5">
        নিজের জন্য এক পাতার একটা অনুবাদের তালিকা বানান: বাম কলামে MySQL, ডান কলামে
        PostgreSQL। এই লেসনের তালিকা দিয়ে শুরু করুন, আর ভিডিও দেখতে দেখতে নতুন
        তফাত পেলে যোগ করতে থাকুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">বন্ধুকে বোঝানোর উদাহরণ আর তাঁর প্রশ্নের তালিকা</span>,
      <span key="d2">দশটা Query আর তাদের পরিবারের তালিকা, কারণসহ</span>,
      <span key="d3">পাঁচটা Query এর PostgreSQL রূপ, বদলগুলো চিহ্নিত</span>,
      <span key="d4">তিনটা Error Message আর তাদের ব্যাখ্যা</span>,
      <span key="d5">নিজের MySQL থেকে PostgreSQL অনুবাদের তালিকা</span>,
    ],
  },
  practicalLab: {
    title: "Practical Lab: Browser এর PostgreSQL এ ভাষাটা ছুঁয়ে দেখা",
    subtitle:
      "এই লেসনের যেকোনো Query বক্সে নিচের প্রতিটা ব্লক একটা একটা করে Paste করে চালান। কিছু ভাঙলে Reset চাপুন। Module 02 এর পরে একই ব্লক নিজের psql এও চালাতে পারবেন।",
    stepName: "Lab",
    steps: [
      {
        title: "প্রথম Statement আর তার টুকরো",
        description:
          "প্রথম ব্লক চালান। তারপর প্রতিটা Comment পড়ে মিলিয়ে নিন কোনটা Keyword, কোনটা Identifier, কোনটা Literal।",
      },
      {
        title: "লেখার নিয়ম পরখ",
        description:
          "দ্বিতীয় ব্লক চালান। Comment করে রাখা লাইনগুলো একটা একটা করে খুলে চালান আর প্রতিবারের Error পড়ুন।",
      },
      {
        title: "তিন পরিবার পরপর",
        description:
          "তৃতীয় ব্লকে DDL, DML, DQL আর শেষে আবার DDL। প্রতিটা ধাপের ফলাফল আলাদা করে দেখুন।",
      },
      {
        title: "Transaction এর জাদু",
        description:
          "চতুর্থ ব্লক চালান। ROLLBACK এর পরে Table টা আর নেই, তাই শেষ SELECT একটা Error দেবে। এটাই প্রমাণ যে PostgreSQL এ DDL ও ফেরানো যায়।",
      },
      {
        title: "দুই টানের পার্থক্য",
        description:
          "পঞ্চম ব্লক চালান। LIKE আর ILIKE এর ফলাফল তুলনা করুন, আর লেখা জোড়ার দুই উপায় পাশাপাশি দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "lab-1-anatomy.sql",
        code: `-- Keyword: SELECT, FROM, WHERE, ORDER BY
-- Identifier: title, price_bdt, duration_days, tours
-- Literal: 10000
SELECT title, price_bdt, duration_days
FROM tours
WHERE price_bdt < 10000
ORDER BY price_bdt;`,
      },
      {
        language: "sql",
        filename: "lab-2-writing-rules.sql",
        code: `-- Keyword এর ছোট বড় হাতের অক্ষর মানা হয় না
select count(*) from customers;
SELECT COUNT(*) FROM CUSTOMERS;

-- লেখার ভেতরের Single Quote দুইবার
SELECT name FROM destinations WHERE name = 'Cox''s Bazar';

-- নিচের লাইনগুলো একটা একটা করে সামনের দুটো Hyphen মুছে চালান,
-- প্রতিবার Error টা পড়ুন
-- SELECT title FROM tours WHERE title = "Sylhet Tea Garden Tour";
-- SELECT "Title" FROM tours;
-- SELECT title FROM tuors;`,
      },
      {
        language: "sql",
        filename: "lab-3-three-families.sql",
        code: `-- DDL
CREATE TABLE tour_notes (
  note_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note    text NOT NULL
);

-- DML
INSERT INTO tour_notes (note)
VALUES ('Life jackets on the boat'), ('Bring sunscreen');
UPDATE tour_notes SET note = 'Bring sunscreen and a hat' WHERE note_id = 2;

-- DQL
SELECT * FROM tour_notes ORDER BY note_id;

-- আবার DDL: Table টা মুছে পরিষ্কার করা
DROP TABLE tour_notes;`,
      },
      {
        language: "sql",
        filename: "lab-4-transaction.sql",
        code: `BEGIN;
CREATE TABLE scratch (id integer);
INSERT INTO scratch VALUES (1), (2);
ROLLBACK;

-- ROLLBACK এর পরে Table টা আর নেই, তাই এখানে Error আসবে:
-- relation "scratch" does not exist
SELECT * FROM scratch;`,
      },
      {
        language: "sql",
        filename: "lab-5-two-accents.sql",
        code: `-- PostgreSQL এ LIKE অক্ষরে অক্ষরে মেলায়: শূন্য Row
SELECT title FROM tours WHERE title LIKE 'saint%';

-- ছোট বড় না মেনে: দুই Row
SELECT title FROM tours WHERE title ILIKE 'saint%';

-- লেখা জোড়ার দুই উপায়, প্রথমটা MySQL এ OR হয়ে যেত
SELECT full_name || ' (' || city || ')' AS with_pipes,
       CONCAT(full_name, ' (', city, ')') AS with_concat
FROM customers
ORDER BY customer_id
LIMIT 3;`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ব্লক চালানোর আগে আন্দাজ করুন ফলাফল কী হবে, তারপর চালিয়ে মিলিয়ে
        দেখুন। আন্দাজ ভুল হওয়াটাই সবচেয়ে ভালো শেখার মুহূর্ত, কারণ তখনই বোঝা যায়
        মাথার ছবিটা কোথায় আলাদা ছিল।
      </ContentParagraph>
    ),
  },
};
