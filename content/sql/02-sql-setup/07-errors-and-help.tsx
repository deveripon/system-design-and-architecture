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
  ErrorAnatomyLab,
  ErrorTriageLab,
} from "../../../components/course/topics/sql-setup/errors-animations";
import {
  ErrorSourcesDiagram,
  HelpLadderDiagram,
  ModuleTwoStoryDiagram,
  SqlstateClassesDiagram,
  SynopsisDiagram,
} from "../../../components/course/topics/sql-setup/errors-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

const SQLSTATE_DETECTOR = `-- প্রথম অংশ একটা ছোট Function: একটা Statement চালায়,
-- ভাঙলে Error এর SQLSTATE আর Message ফেরত দেয়, কিছুই বদলায় না।
-- এমন Function লেখা Module 14 এ শিখবেন, এখন শুধু Run চাপুন।
CREATE OR REPLACE FUNCTION try_sql(statement text)
RETURNS TABLE (sqlstate_code text, message text)
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE statement;
  RETURN QUERY SELECT '00000'::text, 'OK'::text;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT SQLSTATE::text, SQLERRM::text;
END;
$$;

-- দ্বিতীয় অংশ: দশটা Statement, প্রতিটার পাশে তার SQLSTATE
SELECT t.statement, r.sqlstate_code, r.message
FROM (VALUES
  ('SELEC title FROM tours'),
  ('SELECT * FROM tour'),
  ('SELECT titel FROM tours'),
  ('SELECT lenght(title) FROM tours'),
  ($q$INSERT INTO customers (full_name, email, city) VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka')$q$),
  ('DELETE FROM customers WHERE customer_id = 1'),
  ($q$INSERT INTO customers (full_name, email) VALUES ('Imran Kabir', 'imran.k2@mail.example')$q$),
  ($q$INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt) VALUES (1, 8, -2, 'pending', 0)$q$),
  ($q$SELECT * FROM tours WHERE tour_id = 'abc'$q$),
  ('SELECT 1 / 0')
) AS t(statement)
CROSS JOIN LATERAL try_sql(t.statement) AS r;`;

export const errorsAndHelpContent: TopicData = {
  id: "errors-and-help",
  introduction: {
    badge: "MODULE 02 · LESSON 07",
    title: <SectionTitle>লাল লেখা পড়তে শেখা, আর আটকে গেলে নিজে পথ খোঁজা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই Module এর ছয়টা লেসন পার হয়ে আপনার মেশিনে এখন একটা আসল PostgreSQL
          চলছে, তার ভেতরে island_tours Database, আর আপনি psql খুলে প্রথম কয়েকটা
          Query লিখতে শুরু করেছেন। তারপর একদিন Enter চাপলেন, আর উত্তরের জায়গায়
          এল কয়েক লাইন ইংরেজি লেখা, শুরুতে বড় করে ERROR। প্রথম কয়েকবার এটা
          দেখলে বুক ধক করে ওঠে। মনে হয় কিছু একটা ভেঙে ফেলেছি।
        </ContentParagraph>
        <ContentParagraph>
          আসলে কিছুই ভাঙেনি। PostgreSQL শুধু বলছে, এই কাজটা আমি করিনি, আর কেন
          করিনি সেটাও বলে দিচ্ছি। একটা ভালো লেখা Error Message আপনার সবচেয়ে কাজের
          শিক্ষক: কী হয়েছে, কোথায় হয়েছে, কোন নিয়মে আটকেছে, আর অনেক সময় কী করলে
          ঠিক হবে, সব এক জায়গায়। যাঁরা বছরের পর বছর Database নিয়ে কাজ করেন, তাঁরা
          আপনার চেয়ে কম Error দেখেন না। তাঁরা শুধু দ্রুত পড়তে পারেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের শেষে আপনি যেকোনো Error এর প্রথম শব্দ দেখেই বলতে পারবেন
          আপত্তিটা কে করছে: আপনার Terminal, Network, PostgreSQL এর দারোয়ান, নাকি
          আপনার SQL নিজে। ERROR আর FATAL এর তফাত জানবেন, DETAIL, HINT, LINE আর ^
          চিহ্ন পড়তে পারবেন, পাঁচ অক্ষরের SQLSTATE কোড চিনবেন, একজন নতুন মানুষ
          সবচেয়ে বেশি যে দশটা Error দেখেন তাদের কারণ আর সমাধান জানবেন, PostgreSQL
          এর অফিসিয়াল Docs থেকে নিজে উত্তর বের করতে পারবেন, আর কাউকে জিজ্ঞেস
          করতে হলে কীভাবে জিজ্ঞেস করলে দ্রুত উত্তর আসে সেটাও। শেষে পুরো Module 02
          এক জায়গায় গুছিয়ে Module 03 এর দরজায় পৌঁছাবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনার কাজটা আমি ফিরিয়ে দিয়েছি ঠিকই, কিন্তু খালি হাতে না। কোন লাইনে, কোন শব্দে, কোন নিয়মে আটকেছি, সব লিখে দিয়েছি। একবার মন দিয়ে পড়ুন, অর্ধেক কাজ সেখানেই শেষ।",
      author: "PostgreSQL",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Error মানে PostgreSQL আপনার সাথে কথা বলছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। আপনি psql এ island_tours খুলে লিখলেন, সব ট্যুরের
                নাম, দাম আর কত দিনের, দেখতে চাই। হাত দ্রুত চলছিল, তাই লিখলেন{" "}
                <code>SELECT title price_bdt duration_days FROM tours;</code>। Enter
                চাপতেই এল:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql (PostgreSQL 18)",
          code: `island_tours=# SELECT title price_bdt duration_days FROM tours;
ERROR:  syntax error at or near "duration_days"
LINE 1: SELECT title price_bdt duration_days FROM tours;
                               ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                প্রথম দেখায় মনে হয় একটা শাস্তি। কিন্তু একটু থেমে পড়ুন। তিন লাইনে
                PostgreSQL আপনাকে তিনটা কথা বলেছে। এক, সমস্যাটা বাক্যের গঠনে (syntax
                error)। দুই, সে duration_days শব্দে এসে আটকেছে। তিন, আপনার বাক্যটা
                আবার লিখে ^ চিহ্ন দিয়ে ঠিক জায়গাটা দেখিয়ে দিয়েছে। এখন ^ এর ঠিক আগে
                তাকালেই ভুলটা চোখে পড়ে: title আর price_bdt এর মাঝে কমা নেই। কমা
                বসালেন, আবার চালালেন, নয়টা ট্যুর চলে এল। পুরো ঘটনায় লেগেছে দশ সেকেন্ড।
              </ContentParagraph>
              <ContentParagraph>
                একই Error এ একজন নতুন মানুষ আটকে থাকেন আধা ঘণ্টা। কারণ তিনি লাল লেখা
                দেখে সেটা না পড়েই Query টা আবার প্রথম থেকে লেখেন, বা কোথাও কপি করে
                খুঁজতে শুরু করেন। তফাতটা জ্ঞানে না, অভ্যাসে। এই লেসন সেই অভ্যাসটা
                তৈরি করবে: আগে পুরোটা পড়া, তারপর ভাবা কে বলছে আর কী বলছে, তারপর ঠিক
                করা।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা কথা শুরুতেই মনে গেঁথে নিন, কারণ এটা ভয়টা অর্ধেক কমিয়ে দেয়।
                ERROR আসা মানে সেই Statement টা পুরোটাই বাতিল হয়েছে। অর্ধেক কাজ হয়ে
                থেমে যায়নি। কোনো Row অর্ধেক বদলায়নি, Table নষ্ট হয়নি। Module 01 এ
                যে কথাটা দেখেছিলেন, একটা কাজ হয় পুরো হবে নয়তো একটুও না, সেটা এখানে
                আপনাকে রক্ষা করছে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা ERROR কখনো কিছু নষ্ট করে না",
          content: (
            <ContentParagraph>
              ERROR মানে PostgreSQL এই Statement টা করেনি। আপনার Data ঠিক আগের মতো
              আছে, Connection চালু আছে, আর পরের লাইনেই আবার চেষ্টা করতে পারবেন। তাই
              Error দেখে ভয় না পেয়ে কৌতূহলী হোন: এটা একটা সূত্র, শাস্তি না। একটাই
              ব্যতিক্রম আছে, Transaction এর ভেতরে Error হলে, সেটা এই লেসনের ১০ নম্বর
              অংশে দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "who-is-speaking",
      subHeader: { index: "002", title: "Who Is Speaking" },
      title: <SectionTitle>প্রথম প্রশ্ন: আপত্তিটা কে করছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ডাক্তারের কাছে গেলে তিনি প্রথমে জানতে চান ব্যথাটা কোথায়। মাথায় হলে এক
                পরীক্ষা, পেটে হলে আরেক। Error এর বেলাতেও প্রথম প্রশ্ন একটাই: আপত্তিটা
                কে করছে? কারণ আপনি psql এ Enter চাপা থেকে উত্তর আসা পর্যন্ত আপনার
                কথাটা ছয়টা ধাপ পার হয়, আর যেকোনো ধাপ থামিয়ে দিতে পারে। প্রতিটা ধাপের
                Error এর চেহারা আলাদা, আর সমাধানের জায়গাও আলাদা।
              </ContentParagraph>
            </>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ErrorSourcesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Shell:</strong> আপনার Terminal নিজেই psql নামের Program টা
                খুঁজে পায়নি। লেখাটা শুরু হয় Shell এর নাম দিয়ে, যেমন{" "}
                <code>zsh: command not found: psql</code>। PostgreSQL এর এখানে কোনো
                ভূমিকাই নেই, সমস্যা PATH এ, মানে Terminal কোন কোন Folder এ Program
                খোঁজে সেই তালিকায়।
              </ListItem>
              <ListItem>
                <strong>Network:</strong> psql চালু হয়েছে, কিন্তু যে ঠিকানা আর Port এ
                সে দরজায় টোকা দিল, সেখানে কেউ সাড়া দেয়নি। লেখায় থাকে{" "}
                <code>Connection refused</code>। Server বন্ধ, অথবা অন্য Port এ শুনছে।
              </ListItem>
              <ListItem>
                <strong>Login:</strong> দরজা খুলেছে, কিন্তু PostgreSQL এর দারোয়ান
                আপনাকে চেনেনি: Password ভুল, এই নামে কোনো User নেই, বা এই নামে কোনো
                Database নেই। এখানে প্রথম শব্দ হয় FATAL।
              </ListItem>
              <ListItem>
                <strong>Parser:</strong> PostgreSQL আপনার বাক্যটা পড়তে গিয়ে গঠনেই
                আটকে গেছে: কমা নেই, বানান ভুল Keyword, Quote খোলা থেকে গেছে।
                লেখায় থাকে <code>syntax error at or near</code>।
              </ListItem>
              <ListItem>
                <strong>Analyzer:</strong> বাক্যের গঠন ঠিক, কিন্তু নামগুলো মেলেনি।
                এই নামে Table, Column বা Function নেই। লেখায় থাকে{" "}
                <code>does not exist</code>।
              </ListItem>
              <ListItem>
                <strong>Executor:</strong> বাক্য আর নাম দুটোই ঠিক, কাজ শুরুও হয়েছে,
                কিন্তু Data তে আপত্তি: একটা নিয়ম ভাঙছে, বা মানটা ভুল ধরনের, বা শূন্য
                দিয়ে ভাগ। লেখায় থাকে <code>violates</code>, <code>invalid input</code>{" "}
                বা <code>division by zero</code>।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                শেষের চারটা ধাপ PostgreSQL এর ভেতরে। Module 01 এর Lesson 06 এ একটা
                Query এর যাত্রা দেখেছিলেন: Parse, তারপর নাম মেলানো আর পরিকল্পনা,
                তারপর Execute। ঠিক সেই ধাপগুলোই এখানে, শুধু এবার দেখছেন কোন ধাপ কী
                ধরনের আপত্তি করে।
              </ContentParagraph>
              <ContentParagraph>
                এবার দ্বিতীয় সূত্র: প্রথম শব্দটা। PostgreSQL প্রতিটা বার্তার শুরুতে
                তার গুরুত্ব লিখে দেয়, যাকে বলে Severity। নতুন অবস্থায় আপনি মূলত
                তিনটা দেখবেন, আর দুটো আরও হালকা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Severity", "মানে", "এরপর কী অবস্থা", "কখন দেখবেন"],
          rows: [
            ["NOTICE", "শুধু জানিয়ে রাখা, কোনো সমস্যা না", "কাজ হয়েছে", "DROP TABLE IF EXISTS এ Table না থাকলে"],
            ["WARNING", "কাজ হয়েছে, কিন্তু কিছু একটা ঠিক মনে হচ্ছে না", "কাজ হয়েছে", "কম দেখবেন, পরের Module গুলোতে আসবে"],
            ["ERROR", "এই একটা Statement বাতিল", "Connection চালু, পরের Statement লিখতে পারবেন", "প্রতিদিন, বাক্য, নাম বা Data এর ভুলে"],
            ["FATAL", "পুরো Session শেষ, বা শুরুই হয়নি", "আবার Connect করতে হবে", "Login এর সময়, ভুল Password, User বা Database"],
            ["PANIC", "সব Session একসাথে বন্ধ", "Server Crash Recovery করে আবার চালু হয়", "প্রায় কখনো না, Server এর ভেতরের গুরুতর সমস্যায়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              NOTICE টা Lesson 06 এ Sample Database প্রথমবার Load করার সময়েই দেখে
              থাকবেন। ফাইলটা প্রথমে পুরনো Table গুলো মুছে দেয়, আর নতুন Database এ
              তখনো কোনো Table নেই, তাই PostgreSQL ভদ্রভাবে জানায় মোছার কিছু পায়নি।
              এটা Error না, কাজ ঠিকঠাক এগিয়েছে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "প্রথমবার Load করার সময় (PostgreSQL 18)",
          code: `NOTICE:  table "reviews" does not exist, skipping
NOTICE:  table "payments" does not exist, skipping
NOTICE:  table "bookings" does not exist, skipping
...
NOTICE:  table "customers" does not exist, skipping`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ERROR আর FATAL আলাদা করার সহজ পরীক্ষা",
          content: (
            <ContentParagraph>
              Error এর পরে psql এর Prompt আবার ফিরে এলে, মানে island_tours=# দেখলে,
              সেটা ERROR: আপনি এখনো ভেতরে আছেন। আর Prompt না এসে Terminal এ ফিরে
              গেলে, শুরুতে psql: error লেখা থাকলে, সেটা Connection এর সমস্যা, প্রায়
              সবসময় FATAL বা Network। প্রথমটায় SQL ঠিক করবেন, দ্বিতীয়টায় Connection
              এর তথ্য।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>একটা Error এর প্রতিটা লাইন কী বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একটা PostgreSQL Error কয়েকটা আলাদা অংশে তৈরি, অনেকটা হাসপাতালের
                রিপোর্টের মতো: উপরে রোগের নাম, তারপর মাপজোকের বিবরণ, তারপর ডাক্তারের
                পরামর্শ। সব Error এ সব অংশ থাকে না। কোন অংশ আছে আর কোনটা নেই, সেটাও
                একটা সূত্র।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Severity আর Message:</strong> প্রথম লাইন, যেমন{" "}
                  <code>ERROR:  column &quot;titel&quot; does not exist</code>। এটাই
                  আসল খবর। একটা Error থেকে যদি শুধু একটা লাইন পড়ার সময় থাকে, এটা
                  পড়ুন।
                </ListItem>
                <ListItem>
                  <strong>LINE আর ^ চিহ্ন:</strong> আপনার বাক্যের যে লাইনে সমস্যা,
                  সেটা হুবহু, আর তার নিচে ^ দিয়ে ঠিক জায়গাটা। লম্বা লাইনে PostgreSQL
                  শুধু আশপাশটুকু দেখায়, বাকিটা ... দিয়ে কেটে দেয়। এই দুটো আসে যখন
                  ভুলটা আপনার লেখার কোনো নির্দিষ্ট জায়গায়।
                </ListItem>
                <ListItem>
                  <strong>DETAIL:</strong> ঠিক কোন মান বা কোন Row নিয়ে সমস্যা। নিয়ম
                  ভাঙার Error এ প্রায় সবসময় থাকে, যেমন{" "}
                  <code>Key (email)=(rahim.uddin@mail.example) already exists.</code>
                </ListItem>
                <ListItem>
                  <strong>HINT:</strong> PostgreSQL এর পরামর্শ। সবসময় আসে না, কিন্তু
                  এলে প্রায়ই সেটাই উত্তর, যেমন{" "}
                  <code>Perhaps you meant to reference the column &quot;tours.title&quot;.</code>
                </ListItem>
                <ListItem>
                  <strong>SQLSTATE আর LOCATION:</strong> Default অবস্থায় psql এগুলো
                  দেখায় না। চাইলে দেখানো যায়, পরের অংশে দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ ছয়টা আসল Error আছে, প্রতিটা PostgreSQL 18 এ হুবহু চালিয়ে
                নেওয়া। একটা বেছে নিন, তারপর লেখার যেকোনো রঙিন অংশে চাপুন। খেয়াল
                করুন কোন Error এ LINE আর ^ আছে আর কোনটায় নেই, আর কেন।
              </ContentParagraph>
            </>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ErrorAnatomyLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা নিয়ম Lab থেকেই বেরিয়ে এল: LINE আর ^ থাকলে ভুলটা আপনার লেখায়,
              বাক্য বা নামে। LINE না থেকে DETAIL থাকলে লেখা ঠিক ছিল, ভুল Data তে বা
              Table এর কোনো নিয়মে। আর শুরুতে psql: error আর FATAL থাকলে SQL পর্যন্ত
              পৌঁছানোই হয়নি। এই তিন চেহারা চিনে ফেললে প্রতিটা Error এর অর্ধেক রহস্য
              প্রথম দেখাতেই মিটে যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "sqlstate",
      subHeader: { index: "004", title: "SQLSTATE" },
      title: <SectionTitle>পাঁচ অক্ষরের কোড: SQLSTATE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                হাসপাতালে রোগের নাম মানুষের ভাষায় লেখা হয়, কিন্তু Insurance এর কাগজে
                লেখা হয় একটা কোড, যাতে সব দেশের সব অফিস একই জিনিস বোঝে। PostgreSQL
                এর প্রতিটা Error এর সাথেও এমন একটা কোড থাকে, পাঁচ অক্ষরের, নাম{" "}
                <strong>SQLSTATE</strong>। SQL Standard থেকে আসা ব্যবস্থা, তাই অন্য
                Database গুলোও এটা ব্যবহার করে।
              </ContentParagraph>
              <ContentParagraph>
                কোডটা কেন দরকার, যখন Message তো আছেই? কারণ Message মানুষের জন্য, আর
                মানুষের ভাষা বদলায়। PostgreSQL এর lc_messages Setting বদলালে Message
                অন্য ভাষায় আসতে পারে, আর নতুন Version এ শব্দ একটু বদলাতেও পারে। কোড
                বদলায় না। তাই আপনার App কখনো Message এর লেখা মিলিয়ে সিদ্ধান্ত নেবে
                না, নেবে কোড দেখে। আর পুরো কোড মুখস্থ করারও দরকার নেই: প্রথম দুই
                অক্ষর বলে দেয় কোন পরিবারের Error।
              </ContentParagraph>
            </>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SqlstateClassesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এ কোড দেখার তিনটা উপায় আছে। প্রথমটা সবচেয়ে কাজের: ঠিক এইমাত্র
              পাওয়া Error টা পুরো বিস্তারিত দেখতে চাইলে <code>\errverbose</code>।
              দ্বিতীয়টা, এখন থেকে প্রতিটা Error বিস্তারিত দেখতে চাইলে{" "}
              <code>\set VERBOSITY verbose</code>। তৃতীয়টা, শুধু কোডটা একটা
              Variable থেকে পড়া, যেটা Script লেখার সময় কাজে লাগে। তিনটাই নিচে, একটা
              PostgreSQL 18 Server এ চালানো আসল Output:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql: SQLSTATE দেখার তিন উপায়",
          code: `-- ১. এইমাত্র পাওয়া Error টা পুরো বিস্তারিত
island_tours=# SELECT titel FROM tours;
ERROR:  column "titel" does not exist
LINE 1: SELECT titel FROM tours;
               ^
HINT:  Perhaps you meant to reference the column "tours.title".
island_tours=# \\errverbose
ERROR:  42703: column "titel" does not exist
LINE 1: SELECT titel FROM tours;
               ^
HINT:  Perhaps you meant to reference the column "tours.title".
LOCATION:  errorMissingColumn, parse_relation.c:3861

-- ২. এখন থেকে সব Error বিস্তারিত
island_tours=# \\set VERBOSITY verbose
island_tours=# INSERT INTO customers (full_name, email, city)
island_tours-#   VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka');
ERROR:  23505: duplicate key value violates unique constraint "customers_email_key"
DETAIL:  Key (email)=(rahim.uddin@mail.example) already exists.
SCHEMA NAME:  public
TABLE NAME:  customers
CONSTRAINT NAME:  customers_email_key
LOCATION:  _bt_check_unique, nbtinsert.c:666

-- ৩. শুধু কোড আর Message, একটা psql Variable থেকে
island_tours=# \\echo :LAST_ERROR_SQLSTATE :LAST_ERROR_MESSAGE
42703 column "titel" does not exist`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                দ্বিতীয় উদাহরণটা খেয়াল করুন। VERBOSITY verbose এ Error এর সাথে আরও
                তিনটা লাইন এসেছে: কোন Schema, কোন Table, কোন Constraint। এগুলো
                আলাদা আলাদা ঘর হিসেবে আপনার App এর কাছেও যায়, তাই App চাইলে লেখা
                ভেঙে বের না করেই জানতে পারে কোন নিয়মটা ভাঙল। এই লেসনের Project
                Example এ দেখবেন Island Tours ঠিক এটাই করে।
              </ContentParagraph>
              <ContentParagraph>
                LOCATION লাইনটা PostgreSQL এর নিজের Source Code এর ঠিকানা, কোন ফাইলের
                কোন লাইন Error টা তুলেছে। এটা PostgreSQL বানান যাঁরা, তাঁদের জন্য।
                আপনি নিশ্চিন্তে উপেক্ষা করতে পারেন। আবার স্বাভাবিক অবস্থায় ফিরতে চাইলে{" "}
                <code>\set VERBOSITY default</code>।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "In MySQL",
          content: (
            <ContentParagraph>
              MySQL এর Error এর শুরুতে থাকে তার নিজের একটা নম্বর, আর বন্ধনীর ভেতরে
              SQLSTATE। MySQL 8.4 এ Island Tours এর MySQL ফাইলে একটা ভুল Customer এর
              Booking ঢোকাতে গেলে আসে{" "}
              <code>ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails ...</code>{" "}
              আর ঋণাত্মক সিটে আসে{" "}
              <code>ERROR 3819 (HY000): Check constraint &apos;bookings_chk_1&apos; is violated.</code>{" "}
              খেয়াল করুন, MySQL এখানে সাধারণ কোড (23000, HY000) দেয়, PostgreSQL এর
              মতো 23503 বা 23514 এর মতো নির্দিষ্ট না। তাই MySQL এর App গুলো সাধারণত
              প্রথম নম্বরটা (1452, 3819) দেখে সিদ্ধান্ত নেয়। আর Script থেকে চালালে
              MySQL লেখার সাথে at line 1 এর মতো লাইন নম্বরও জুড়ে দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "syntax-errors",
      subHeader: { index: "005", title: "Syntax Errors" },
      title: <SectionTitle>বাক্যটাই ভাঙা: 42601</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এবার একে একে সেই Error গুলো, যেগুলো নতুন অবস্থায় সবচেয়ে বেশি দেখবেন।
                প্রথম পরিবার Syntax Error, SQLSTATE 42601। PostgreSQL এর Parser
                আপনার বাক্যটা শব্দে শব্দে পড়ে, আর যে শব্দে এসে বাক্যটা আর SQL এর
                ব্যাকরণে মেলে না, সেখানে থামে। Message প্রায় সবসময় একই:{" "}
                <code>syntax error at or near</code>, তারপর Quote এর ভেতরে সেই শব্দটা।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে জরুরি কৌশলটা হলো: Syntax Error এ ^ চিহ্ন দেখায় PostgreSQL কোথায়
                থামল, আপনি কোথায় ভুল করলেন সেটা না। আসল ভুল প্রায়ই ঠিক তার আগে।
                নিচের চারটা আসল উদাহরণে নিজেই মিলিয়ে দেখুন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "চারটা Syntax Error (PostgreSQL 18)",
          code: `-- ১. Keyword এর বানান ভুল
SELEC title FROM tours;
ERROR:  syntax error at or near "SELEC"
LINE 1: SELEC title FROM tours;
        ^

-- ২. Column এর মাঝে কমা নেই: ^ পড়েছে তৃতীয় নামে, ভুল আগে
SELECT title price_bdt duration_days FROM tours;
ERROR:  syntax error at or near "duration_days"
LINE 1: SELECT title price_bdt duration_days FROM tours;
                               ^

-- ৩. শেষ Column এর পরে বাড়তি কমা: ^ পড়েছে পরের লাইনে
SELECT title,
FROM tours;
ERROR:  syntax error at or near "FROM"
LINE 2: FROM tours;
        ^

-- ৪. Quote খুলে বন্ধ করা হয়নি
SELECT * FROM tours WHERE title = 'Sajek Valley Cloud Trip;
ERROR:  unterminated quoted string at or near "'Sajek Valley Cloud Trip;"
LINE 1: SELECT * FROM tours WHERE title = 'Sajek Valley Cloud Trip;
                                          ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                দ্বিতীয় উদাহরণটা সবচেয়ে শিক্ষণীয়। কমা না থাকায় PostgreSQL ধরে
                নিয়েছে price_bdt হলো title এর একটা ডাকনাম, যাকে বলে Alias (Module 03
                এ দেখবেন)। এই পর্যন্ত তার কাছে বাক্যটা বৈধ ছিল। গোলমাল বাধল তৃতীয়
                শব্দে। তাই ^ পড়েছে duration_days এ, যদিও ভুলটা দুই শব্দ আগে। তৃতীয়
                উদাহরণে একই ব্যাপার, শুধু আরও স্পষ্ট: ভুল প্রথম লাইনের শেষে, ^ দ্বিতীয়
                লাইনের শুরুতে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা Syntax Error আছে যেটা Error ই দেখায় না, শুধু অপেক্ষা করে:
                Semicolon ভুলে যাওয়া। psql এ Enter চাপলে Semicolon না পেলে সে ধরে
                নেয় বাক্য শেষ হয়নি, আর Prompt বদলে <code>island_tours-#</code> করে
                দেয়, মানে আরও লিখুন। তখন যদি নতুন একটা Query লিখে ফেলেন, দুটো জুড়ে
                একটা ভাঙা বাক্য হয়:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Semicolon ভুলে গেলে (psql, PostgreSQL 18)",
          code: `island_tours=# SELECT title
island_tours-# FROM tours
island_tours-# WHERE price_bdt < 9000
island_tours-# SELECT count(*) FROM tours;
ERROR:  syntax error at or near "SELECT"
LINE 4: SELECT count(*) FROM tours;
        ^`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Prompt এর =# বদলে -# হয়ে যাওয়াটাই আসল সংকেত ছিল। এই Module এর Lesson
              03 এ psql এর Prompt এর প্রতিটা চিহ্ন দেখেছেন, এখানে সেটা কাজে লাগল।
              এখন নিজে একবার চেষ্টা করুন। নিচের বক্সে কমা ছাড়া Query টা আছে। প্রথমে
              Run চাপুন, Error টা পড়ুন, তারপর দুটো কমা বসিয়ে আবার চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কমাটা কোথায় হারাল"
              query={`SELECT title price_bdt duration_days
FROM tours;`}
              caption="প্রথমবার চালালে syntax error at or near duration_days আসবে, আর ^ পড়বে তৃতীয় নামে। title, price_bdt, duration_days এভাবে কমা দিয়ে লিখে আবার চালান, নয়টা ট্যুর আসবে। এই বক্সে আসল PostgreSQL চলছে, তাই Error গুলো আপনার নিজের psql এর মতো হুবহু।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "name-errors",
      subHeader: { index: "006", title: "Name Errors" },
      title: <SectionTitle>নাম মেলেনি: 42P01, 42703, 42883</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                দ্বিতীয় পরিবার, আর নতুনদের সবচেয়ে চেনা: বাক্যের গঠন ঠিক, কিন্তু যে
                নামটা লিখেছেন সেটা PostgreSQL খুঁজে পায়নি। তিন ধরনের নাম, তিনটা কোড।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>42P01, relation does not exist:</strong> Table (বা View) এর
                  নাম পাওয়া যায়নি। relation শব্দটা ভয়ের কিছু না, Module 01 এর Lesson
                  04 এ দেখেছেন, Relational Model এ Table এর আনুষ্ঠানিক নামই Relation।
                </ListItem>
                <ListItem>
                  <strong>42703, column does not exist:</strong> Table আছে, কিন্তু এই
                  নামে Column নেই। প্রায়ই সাথে একটা HINT আসে কাছাকাছি নামের।
                </ListItem>
                <ListItem>
                  <strong>42883, function does not exist:</strong> এই নামে, অথবা
                  এই ধরনের মান নেয় এমন কোনো Function নেই। দ্বিতীয় অংশটা গুরুত্বপূর্ণ,
                  নিচে দেখবেন।
                </ListItem>
              </ContentList>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "নামের Error (PostgreSQL 18)",
          code: `-- Table এর নামে এক অক্ষর কম (tours না, tour)
SELECT * FROM tour;
ERROR:  relation "tour" does not exist
LINE 1: SELECT * FROM tour;
                      ^

-- Column এর বানান উল্টো, আর PostgreSQL এর পরামর্শ
SELECT titel FROM tours;
ERROR:  column "titel" does not exist
LINE 1: SELECT titel FROM tours;
               ^
HINT:  Perhaps you meant to reference the column "tours.title".

-- লেখা মুড়েছেন Double Quote এ: PostgreSQL ভাবল এটা একটা Column এর নাম
SELECT tour_id FROM tours WHERE title = "Sajek Valley Cloud Trip";
ERROR:  column "Sajek Valley Cloud Trip" does not exist
LINE 1: SELECT tour_id FROM tours WHERE title = "Sajek Valley Cloud ...
                                                ^

-- Function এর বানান ভুল (length না, lenght)
SELECT lenght(title) FROM tours;
ERROR:  function lenght(text) does not exist
LINE 1: SELECT lenght(title) FROM tours;
               ^
HINT:  No function matches the given name and argument types. You might need to add explicit type casts.

-- নাম ঠিক, কিন্তু এই ধরনের মানের জন্য round এর এমন রূপ নেই
SELECT round(price_bdt::float8, 1) FROM tours;
ERROR:  function round(double precision, integer) does not exist
LINE 1: SELECT round(price_bdt::float8, 1) FROM tours;
               ^
HINT:  No function matches the given name and argument types. You might need to add explicit type casts.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                তৃতীয় উদাহরণটা MySQL থেকে আসা মানুষদের সবচেয়ে বেশি আটকায়। PostgreSQL
                এ লেখা (Text) যায় Single Quote এ, আর Double Quote দিয়ে মোড়ানো হয়
                নাম। তাই <code>&quot;Sajek Valley Cloud Trip&quot;</code> দেখে PostgreSQL ভাবল এটা একটা
                Column এর নাম, আর খুঁজে পেল না। ঠিক রূপ{" "}
                <code>WHERE title = &apos;Sajek Valley Cloud Trip&apos;</code>। Module 01
                এর Lesson 05 এ Quote এর এই নিয়ম দেখেছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                শেষ উদাহরণটা একটু গভীর, কিন্তু HINT টা পড়লেই বোঝা যায়। round নামে
                Function আছে, কিন্তু দশমিকের ঘর বলে দেওয়ার রূপটা কাজ করে numeric এর
                সাথে, float এর সাথে না। PostgreSQL Function খোঁজে নাম আর মানের ধরন
                দুটো মিলিয়ে, তাই Message এ নামের পাশে বন্ধনীতে ধরনগুলোও লিখে দেয়:{" "}
                <code>round(double precision, integer)</code>। HINT বলছে ধরন বদলে
                দেখুন। আসলে price_bdt এমনিতেই numeric, তাই{" "}
                <code>round(price_bdt, 1)</code> সরাসরি কাজ করে। ধরন বদলানো, মানে
                Casting, Module 04 এ বিস্তারিত।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা পরিস্থিতি, যেখানে নাম একদম ঠিক লিখেও 42P01 আসে। আপনি ভুল
                Database এ আছেন (psql এর Prompt এ নামটা দেখুন), অথবা Table টা অন্য
                একটা Schema তে, যেটা PostgreSQL এখন খুঁজছে না। এই Module এর Lesson 05
                এ search_path দেখেছেন: PostgreSQL কোন কোন Schema তে কোন ক্রমে নাম
                খোঁজে। তখন <code>\dt</code> দিয়ে Table এর তালিকা দেখুন, আর{" "}
                <code>SHOW search_path;</code> দিয়ে খোঁজার তালিকা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="HINT টা পড়ুন"
              query={`SELECT titel, price_bdt
FROM tours;`}
              caption="চালালে column titel does not exist আসবে, আর নিচে HINT এ PostgreSQL ঠিক নামটা বলে দেবে। HINT মেনে নামটা ঠিক করুন। তারপর tours কে tour লিখে দেখুন, এবার HINT আসে কি না, আর কেন আসে না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "rule-errors",
      subHeader: { index: "007", title: "Rule Errors" },
      title: <SectionTitle>Table এর নিয়ম ভেঙেছে: 23 পরিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এবার এমন Error, যেখানে আপনার SQL পুরোপুরি ঠিক, তবু PostgreSQL কাজটা
                করেনি। কারণ Data টা Table এর কোনো নিয়ম ভাঙছিল। এই নিয়মগুলোকে বলে
                Constraint, আর Island Tours এর Database এ সেগুলো ইচ্ছা করেই বসানো
                হয়েছে, যাতে ভুল Data কখনো ঢুকতে না পারে। এই পরিবারের কোড শুরু হয় 23
                দিয়ে, যার অফিসিয়াল নাম Integrity Constraint Violation।
              </ContentParagraph>
              <ContentParagraph>
                এদের সবচেয়ে উপকারী অংশ দুটো। প্রথমটা Constraint এর নাম, Message এ
                Quote এর ভেতরে। PostgreSQL নিজে নাম দিলে সেটা সাধারণত Table, Column আর
                নিয়মের ধরন জুড়ে বানায়, তাই নামটা পড়লেই বোঝা যায় কোথায়:{" "}
                <code>customers_email_key</code> মানে customers Table এর email এর
                Unique নিয়ম, <code>bookings_seats_check</code> মানে bookings এর seats
                এর Check। দ্বিতীয়টা DETAIL, যেখানে ঠিক কোন মান সমস্যা করল।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "নিয়ম ভাঙার Error (PostgreSQL 18, Asia/Dhaka)",
          code: `-- 23505: একই Email দুবার
INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka');
ERROR:  duplicate key value violates unique constraint "customers_email_key"
DETAIL:  Key (email)=(rahim.uddin@mail.example) already exists.

-- 23503: নেই এমন Customer এর Booking
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (99, 8, 2, 'pending', 25000);
ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customers".

-- 23503, উল্টো দিক থেকে: যে Customer এর Booking আছে তাঁকে মোছা
DELETE FROM customers WHERE customer_id = 1;
ERROR:  update or delete on table "customers" violates foreign key constraint "bookings_customer_id_fkey" on table "bookings"
DETAIL:  Key (customer_id)=(1) is still referenced from table "bookings".

-- 23502: বাধ্যতামূলক ঘর (city) খালি
INSERT INTO customers (full_name, email)
VALUES ('Imran Kabir', 'imran.k2@mail.example');
ERROR:  null value in column "city" of relation "customers" violates not-null constraint
DETAIL:  Failing row contains (16, Imran Kabir, imran.k2@mail.example, null, null, Bangladesh, 2026-10-17 13:05:22.749019+06).

-- 23514: সিটের সংখ্যা ঋণাত্মক
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, -2, 'pending', 0);
ERROR:  new row for relation "bookings" violates check constraint "bookings_seats_check"
DETAIL:  Failing row contains (25, 1, 8, -2, pending, 0.00, 2026-10-17 13:05:22.79129+06).`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                দুটো জিনিস খেয়াল করার মতো। Foreign Key এর Error দুই দিক থেকেই আসে:
                বাচ্চা Row এমন কাউকে দেখাতে চাইলে যিনি নেই, আর বাবা Row মুছতে চাইলে
                যাঁকে এখনো কেউ দেখাচ্ছে। দুটোর একই নিয়ম, একই নাম, শুধু Message আর
                DETAIL আলাদা। আর Not Null আর Check এর DETAIL এ পুরো Row টা দেখানো হয়,
                Table এর Column এর ক্রমে, যাতে বুঝতে পারেন ঠিক কী ঢোকাতে চেয়েছিলেন।
                শেষের তারিখ আর সময়টা যখন চালাবেন তখনকার হবে, প্রতিবার আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম Row এর প্রথম মানটা দেখুন: 16। Island Tours এ এখন পনেরোজন
                Customer, তাই নতুন জন পেতেন 16। কিন্তু Error এর পর যদি সঠিক একটা
                Customer ঢোকান, তিনি পেতে পারেন 17। ব্যর্থ চেষ্টাটাও একটা নম্বর
                খরচ করে ফেলেছে, আর PostgreSQL সেটা ফেরত নেয় না। এটা Error না, ইচ্ছাকৃত
                আচরণ, আর Module 10 এ এর কারণ দেখবেন। এখন শুধু জেনে রাখুন, ID এর
                মাঝে ফাঁক দেখে ভয় পাওয়ার কিছু নেই।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Rahim Uddin কে মোছার চেষ্টা আছে। চালিয়ে দেখুন PostgreSQL
                কীভাবে আপত্তি করে, আর DETAIL কী বলে। ভয় নেই, কিছুই মোছা হবে না।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking আছে এমন Customer কে মোছা"
              query={`DELETE FROM customers WHERE customer_id = 1;`}
              caption="Error আসবে, আর DETAIL বলবে customer_id 1 এখনো bookings থেকে উল্লেখ করা হয়েছে। এরপর SELECT * FROM customers WHERE customer_id = 1; চালিয়ে নিশ্চিত হন, Rahim Uddin আগের মতোই আছেন। কোনো কারণে কিছু বদলে ফেললে Reset চাপুন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "data-errors",
      subHeader: { index: "008", title: "Data Errors" },
      title: <SectionTitle>মানটাই ভুল ধরনের: 22 পরিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়ম ভাঙার আগেই আরেক ধরনের Error আসতে পারে: মানটা Column এর ধরনেই ঢোকে
              না। সংখ্যার ঘরে লেখা, অসম্ভব তারিখ, শূন্য দিয়ে ভাগ। এই পরিবারের কোড শুরু
              হয় 22 দিয়ে, নাম Data Exception। এগুলো App থেকে খুব আসে, কারণ Form এর
              একটা ঘরে মানুষ যা খুশি লিখতে পারেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "মানের Error (PostgreSQL 18)",
          code: `-- 22P02: সংখ্যার Column এ লেখা
SELECT * FROM tours WHERE tour_id = 'abc';
ERROR:  invalid input syntax for type integer: "abc"
LINE 1: SELECT * FROM tours WHERE tour_id = 'abc';
                                            ^

-- 22P02: সিটের ঘরে কথায় লেখা সংখ্যা
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 'five', 'pending', 0);
ERROR:  invalid input syntax for type smallint: "five"
LINE 1: ...rture_id, seats, status, total_bdt) VALUES (1, 8, 'five', 'p...
                                                             ^

-- 22008: ফেব্রুয়ারির ৩০ তারিখ নেই
SELECT DATE '2026-02-30';
ERROR:  date/time field value out of range: "2026-02-30"
LINE 1: SELECT DATE '2026-02-30';
                    ^

-- 22012: শূন্য দিয়ে ভাগ
SELECT total_bdt / 0 FROM bookings LIMIT 1;
ERROR:  division by zero`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                দ্বিতীয় উদাহরণের LINE লাইনটা দেখুন। বাক্যটা লম্বা, তাই PostgreSQL
                পুরোটা না দেখিয়ে শুধু ভুলের আশপাশটুকু দেখিয়েছে, দুই পাশে ... দিয়ে।
                Spreadsheet এর দিনে Module 01 এর Lesson 01 এ যে সমস্যা দেখেছিলেন,
                সিটের ঘরে কেউ লিখেছিল পাঁচ, Database সেটা এখানে দরজাতেই আটকে দিচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                শেষ উদাহরণে LINE বা ^ নেই। কেন? কারণ বাক্যে কোনো ভুল জায়গা নেই, সমস্যা
                তৈরি হয়েছে হিসাব করার মুহূর্তে। Data Error কখনো লেখার জায়গা দেখায়,
                কখনো দেখায় না। তাই এখানে প্রধান সূত্র Message এর লেখা, আর কোডের প্রথম
                দুই অক্ষর 22।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "connection-errors",
      subHeader: { index: "009", title: "Connection Errors" },
      title: <SectionTitle>দরজাতেই আটকে গেলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এতক্ষণ সব Error এসেছে ভেতরে ঢোকার পরে। এবার সেই Error গুলো, যেখানে
                আপনি ভেতরেই ঢুকতে পারেননি। এগুলো সবচেয়ে হতাশার, কারণ কোনো SQL লেখার
                সুযোগই আসে না। কিন্তু চেনা সহজ: সবগুলোর শুরুতে psql: error, আর এরপর
                psql আপনাকে Terminal এ ফিরিয়ে দেয়। এই Module এর Lesson 01 এ প্রতিটা
                Operating System এ ইনস্টলের সময় এগুলোর কয়েকটা দেখেছেন, এখানে সবগুলো এক
                জায়গায়, পড়ার নিয়মসহ।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Connection এর Error (psql 18, একটা Docker Container এর ভেতরে)",
          code: `# Shell: psql ই খুঁজে পাওয়া যায়নি (macOS এর zsh)
zsh: command not found: psql

# Network: TCP দিয়ে, যে Port এ কেউ শুনছে না
$ psql -h 127.0.0.1 -p 5499 -U postgres
psql: error: connection to server at "127.0.0.1", port 5499 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?

# Network: একই মেশিনের Socket দিয়ে, যে Port এ Server নেই
$ psql -p 5499 -U postgres
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5499" failed: No such file or directory
	Is the server running locally and accepting connections on that socket?

# Login: Password মেলেনি (SQLSTATE 28P01)
psql: error: connection to server at "127.0.0.1", port 15407 failed: FATAL:  password authentication failed for user "postgres"

# Login: এই নামে Role নেই (SQLSTATE 28000)
$ psql -U riya -d island_tours
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "riya" does not exist

# Login: এই নামে Database নেই (SQLSTATE 3D000)
$ psql -U postgres -d islandtours
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "islandtours" does not exist

# Login: Linux এর peer নিয়ম, Operating System এর User আর Database এর User আলাদা (SQLSTATE 28000)
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Socket এর ঠিকানা আর Port আপনার মেশিনে আলাদা হবে। যেমন macOS এ Homebrew
              এর PostgreSQL তার Socket রাখে /tmp এর ভেতরে। Host আর Port এর জায়গায়
              আপনার নিজের মান দেখবেন, বাকি লেখাটা একই। এবার প্রতিটার কারণ আর প্রথম
              পরীক্ষা, এক টেবিলে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["যা দেখছেন", "কে আপত্তি করছে", "সবচেয়ে সম্ভাব্য কারণ", "প্রথম যা পরীক্ষা করবেন"],
          rows: [
            ["command not found: psql", "Shell", "psql এর Folder PATH এ নেই", "Lesson 01 এর PATH এর লাইন, নতুন Terminal খুলে আবার"],
            ["Connection refused", "Network", "Server বন্ধ, বা অন্য Port এ", "pg_isready, আর Port 5432 না 5433"],
            ["No such file or directory (socket)", "Network", "এই Port এ এই মেশিনে কোনো Server নেই", "pg_isready, Server চালু করা"],
            ["password authentication failed", "Login, 28P01", "Password ভুল বা Variable খালি", "echo দিয়ে POSTGRES_PASSWORD সেট আছে কিনা"],
            ["role ... does not exist", "Login, 28000", "-U দেননি, তাই OS এর User এর নাম গেছে", "psql -U postgres, অথবা নিজের Role বানানো"],
            ["database ... does not exist", "Login, 3D000", "নামের বানান, বা Database বানানো হয়নি", "psql -l দিয়ে তালিকা, তারপর createdb"],
            ["Peer authentication failed", "Login, 28000", "Linux এ OS এর User আর Database এর User মিলছে না", "sudo -u postgres psql, Lesson 01 এর Linux অংশ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একটা লুকানো নিয়ম জানা থাকলে অনেক বিভ্রান্তি কমে। -d দিয়ে Database
                এর নাম না দিলে psql Database হিসেবে আপনার User এর নামই পাঠায়। তাই
                শুধু <code>psql -U riya</code> লিখলে PostgreSQL riya নামের একটা
                Database ও খুঁজবে। PostgreSQL এর Docs এ কথাটা স্পষ্ট লেখা আছে, আর
                প্রথমবার এই কারণেই অনেকে database does not exist দেখে অবাক হন, যদিও
                কোনো Database এর নাম লেখেনইনি।
              </ContentParagraph>
              <ContentParagraph>
                আর Password এর Error নিয়ে একটা কথা। Client এর কাছে আসে শুধু ছোট
                বাক্যটা: password authentication failed। কোন নিয়মে, কোন ফাইলের কোন লাইনে
                আটকেছেন, সেই বিস্তারিত থাকে Server এর নিজের Log এ। আমাদের পরীক্ষার
                Server এর Log এ ঠিক এই ঘটনার পাশে লেখা ছিল, Connection মিলেছে
                pg_hba.conf ফাইলের একটা নির্দিষ্ট লাইনের সাথে, যেটা Password চায়।
                PostgreSQL এর Docs ও বলে, Login এর রহস্য না মিটলে Server এর Log দেখুন।
                pg_hba.conf নিজে Module 18 এ।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "aborted-transaction",
      subHeader: { index: "010", title: "Aborted Transaction" },
      title: <SectionTitle>যে Error এর পরে সব কিছুই Error: 25P02</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                প্রথম অংশে বলেছিলাম, ERROR এর পরে আবার লিখলেই হয়। একটাই ব্যতিক্রম।
                আপনি যদি BEGIN লিখে একটা Transaction খুলে থাকেন, মানে বলে থাকেন যে
                এখন থেকে কয়েকটা কাজ একসাথে হবে, হয় সবগুলো নয়তো একটাও না, তাহলে তার
                ভেতরে একটা Error হলেই পুরো Transaction ভাঙা অবস্থায় চলে যায়। তারপর
                আপনি যা-ই লিখুন, একদম ঠিক Query হলেও, PostgreSQL ফিরিয়ে দেবে। Transaction
                নিজে Module 12 এ, এখন শুধু এই Error টা চিনে রাখুন, কারণ নতুনরা এটায়
                সবচেয়ে বেশি সময় হারান।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql, PostgreSQL 18: Prompt এর মাঝের চিহ্নটা খেয়াল করুন",
          code: `island_tours=# BEGIN;
BEGIN
island_tours=*# SELECT * FROM tour;
ERROR:  relation "tour" does not exist
LINE 1: SELECT * FROM tour;
                      ^
island_tours=!# SELECT count(*) FROM tours;
ERROR:  current transaction is aborted, commands ignored until end of transaction block
island_tours=!# ROLLBACK;
ROLLBACK
island_tours=# SELECT count(*) FROM tours;
 count
-------
     9
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                psql এর Prompt পুরো গল্পটা বলে দিচ্ছে। শুরুতে <code>=#</code>,
                কোনো Transaction নেই। BEGIN এর পরে <code>=*#</code>, মানে একটা
                Transaction খোলা আছে। Error এর পরে <code>=!#</code>, মানে খোলা
                Transaction টা ভাঙা। এই অবস্থায় count(*) এর মতো নিরীহ Query ও ফিরে এল,
                কোড 25P02 নিয়ে। ROLLBACK লেখার পর Transaction বাতিল, Prompt আবার{" "}
                <code>=#</code>, আর একই Query সাথে সাথে কাজ করল।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা সম্পর্কিত Setting, যেটা Script চালানোর সময় খুব কাজের: psql
                এর <code>ON_ERROR_STOP</code>। স্বাভাবিকভাবে psql একটা ফাইল চালাতে
                গিয়ে Error পেলে পরের লাইনে চলে যায়, ফলে একশ লাইনের ফাইলে প্রথম Error টা
                অন্য লেখার ভিড়ে হারিয়ে যায়। <code>\set ON_ERROR_STOP on</code> দিলে
                প্রথম Error এই থেমে যায়, আর Script থেকে চালালে psql একটা আলাদা Exit
                Code (3) দিয়ে বের হয়, যাতে বোঝা যায় কাজ মাঝপথে থেমেছে। ফাইল চালানোর
                নিয়ম এই Module এর Lesson 03 আর 06 এ দেখেছেন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "=!# দেখলে আগে ROLLBACK",
          content: (
            <ContentParagraph>
              Prompt এ =!# দেখলে আর একটাও Query লেখার আগে ROLLBACK লিখুন। তারপর
              ভাঙা Statement টা ঠিক করে আবার BEGIN থেকে শুরু করুন। Transaction এর
              ভেতরে Error এর আগে যা যা করেছিলেন, সেগুলোও বাতিল হয়ে গেছে, তাই সেগুলোও
              আবার করতে হবে। এটাই Transaction এর প্রতিশ্রুতি: অর্ধেক কাজ কখনো থাকবে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "reading-docs",
      subHeader: { index: "011", title: "Reading the Docs" },
      title: <SectionTitle>অফিসিয়াল Docs থেকে নিজে উত্তর বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Error পড়ে কারণ বুঝলেন, কিন্তু সঠিক লেখাটা কী? এখানেই আসে PostgreSQL এর
                অফিসিয়াল Documentation, postgresql.org/docs এ। অনেকে এটাকে ভয় পান,
                কারণ বিশাল। কিন্তু এটা একটা অভিধানের মতো, শুরু থেকে শেষ পড়ার জন্য না,
                দরকারি পাতাটা খুলে নেওয়ার জন্য। আর একবার পাতার গঠন চিনে ফেললে, যেকোনো
                Command এর উত্তর এক মিনিটে পাবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Version বেছে নিন:</strong> প্রতিটা পাতার উপরে Version এর
                  তালিকা থাকে, যেমন Current (18), 17, 16, 15, 14। ঠিকানায় current থাকলে
                  সবসময় সর্বশেষ Version এর পাতা খোলে, আর 18 বা 17 লিখলে সেই
                  নির্দিষ্ট Version এর। আপনার Server যে Version এর, সেই পাতা পড়ুন।
                  নিজের Version জানতে <code>SELECT version();</code>।
                </ListItem>
                <ListItem>
                  <strong>SQL Commands অংশ:</strong> CREATE TABLE, SELECT, DROP TABLE,
                  প্রতিটা Command এর জন্য একটা করে পাতা, একটা তালিকায়। Command এর নাম
                  জানলে সরাসরি সেখানে যান।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Command পাতার গঠন:</strong> উপরে Synopsis, মানে
                  বাক্যের ছাঁচ। তারপর Description, এটা কী করে। তারপর Parameters, ছাঁচের
                  প্রতিটা অংশের মানে। কিছু পাতায় Notes, তারপর Examples, তারপর
                  Compatibility, মানে SQL Standard থেকে কোথায় আলাদা, আর See Also। প্রথম
                  পড়ায় Synopsis দেখে সরাসরি Examples এ নেমে যাওয়া একটা চমৎকার কৌশল।
                </ListItem>
                <ListItem>
                  <strong>Appendix A, Error Codes:</strong> সব SQLSTATE কোড, পরিবার
                  ধরে সাজানো, প্রতিটার পাশে একটা নাম, যেমন 23505 unique_violation।
                  কোনো অচেনা কোড দেখলে এখানে খুঁজুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Synopsis এর লাইনটাই প্রথমবার সবচেয়ে অচেনা লাগে, কারণ তাতে কয়েকটা চিহ্ন
                থাকে যেগুলো আপনি লিখবেন না, শুধু পড়বেন। PostgreSQL এর Docs এর শুরুতেই
                নিয়মগুলো লেখা আছে, আর সংখ্যায় মাত্র কয়েকটা:
              </ContentParagraph>
            </>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SynopsisDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর সবচেয়ে মজার কথা, এই Synopsis পেতে Browser খোলারও দরকার নেই। psql এর
              ভেতরেই <code>\h</code> আছে, Lesson 03 এ দেখেছেন। <code>\h</code> এর পরে
              Command এর নাম লিখলে Synopsis আসে, আর সাথে আপনার Version এর Docs পাতার
              ঠিকানা। অর্ধেক নাম লিখলে, যেমন শুধু <code>\h DROP</code>, ওই নামে শুরু
              হওয়া সব Command দেখায়। নিচে PostgreSQL 18 এর psql থেকে হুবহু:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql: \\h দিয়ে Synopsis",
          code: `island_tours=# \\h DROP TABLE
Command:     DROP TABLE
Description: remove a table
Syntax:
DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]

URL: https://www.postgresql.org/docs/18/sql-droptable.html`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন Synopsis টা নিজে পড়ুন। DROP TABLE হুবহু লিখতে হবে। IF EXISTS
              বন্ধনীর ভেতরে, তাই ঐচ্ছিক, দিলে Table না থাকলে Error এর বদলে NOTICE আসে,
              ঠিক যেমন Sample Database Load করার সময় দেখেছেন। name হলো Table এর নাম,
              আর [, ...] মানে কমা দিয়ে আরও নাম দেওয়া যায়। শেষে CASCADE বা RESTRICT এর
              যেকোনো একটা, বা কোনোটাই না। একটা লাইন পড়ে আপনি এখন জানেন এই Command
              এর সব রূপ। এটাই Docs এর শক্তি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "In MySQL",
          content: (
            <ContentParagraph>
              MySQL এর Docs আছে dev.mysql.com/doc এ, আর সেখানেও প্রতিটা Version এর
              আলাদা Manual। এই কোর্সে MySQL 8.4, তাই 8.4 এর Reference Manual খুলবেন।
              MySQL এর Client এ <code>help DROP TABLE</code> লিখলেও Synopsis পাওয়া
              যায়। চিহ্নগুলোর নিয়ম প্রায় একই: বন্ধনী মানে ঐচ্ছিক, | মানে বিকল্প।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "asking-for-help",
      subHeader: { index: "012", title: "Asking for Help" },
      title: <SectionTitle>খোঁজা, জিজ্ঞেস করা, আর AI কে যাচাই করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কখনো কখনো Error পড়ে, \h দেখে, Docs খুলেও উত্তর মেলে না। তখন বাইরে খুঁজতে
              হয়, আর সেখানে একটা ক্রম মেনে চললে সময় অনেক বাঁচে। প্রথম তিন ধাপ আপনি
              এতক্ষণ শিখেছেন, বাকি তিনটা এখন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HelpLadderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentList>
                <ListItem>
                  <strong>হুবহু Message দিয়ে খুঁজুন, কিন্তু নিজের নাম বাদ দিয়ে:</strong>{" "}
                  Search এ পুরো Error টা Quote এর ভেতরে দিন, তবে আপনার নিজের Table বা
                  Column এর নাম সরিয়ে। <code>&quot;violates foreign key constraint&quot;</code>{" "}
                  দিয়ে খুঁজলে হাজার মানুষের আলোচনা পাবেন, কিন্তু{" "}
                  <code>bookings_customer_id_fkey</code> দিয়ে খুঁজলে প্রায় কিছুই না,
                  কারণ নামটা শুধু আপনার। আর Version যোগ করুন, যেমন postgresql 18, কারণ
                  পুরনো উত্তর অনেক সময় পুরনো Version এর।
                </ListItem>
                <ListItem>
                  <strong>ছোট একটা উদাহরণ বানান:</strong> যত কম লাইনে Error টা আবার
                  আনা যায়। একটা ছোট Table, দুইটা Row, যে Query টা ভাঙছে। একে বলে
                  Minimal Reproducible Example। আশ্চর্যজনকভাবে, এটা বানাতে গিয়েই
                  প্রায় অর্ধেক সময় আপনি নিজে ভুলটা ধরে ফেলবেন, কারণ বাড়তি সবকিছু বাদ
                  দিলে আসল সমস্যাটা একা দাঁড়িয়ে থাকে।
                </ListItem>
                <ListItem>
                  <strong>মানুষকে জিজ্ঞেস করুন, সব তথ্যসহ:</strong> PostgreSQL এর
                  একটা বড় Community আছে: Mailing List (pgsql-general), Stack Overflow
                  এর postgresql Tag, আর নানা ফোরাম। যেখানেই জিজ্ঞেস করুন, নিচের ছাঁচটা
                  মেনে লিখলে উত্তর আসে দ্রুত।
                </ListItem>
              </ContentList>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "help-request.md (প্রশ্ন করার ছাঁচ)",
          code: `## যা করতে চাইছি
departure 8 এর জন্য একটা নতুন Booking ঢোকাতে চাইছি।

## Version
PostgreSQL 18.6 (SELECT version(); এর Output), psql 18, macOS

## সবচেয়ে ছোট উদাহরণ (যেকেউ কপি করে চালাতে পারবেন)
CREATE TABLE customers (customer_id int PRIMARY KEY);
CREATE TABLE bookings (
  booking_id  int PRIMARY KEY,
  customer_id int REFERENCES customers (customer_id)
);
INSERT INTO bookings VALUES (1, 99);

## পুরো Error, হুবহু
ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customers".

## যা আশা করেছিলাম, আর যা যা চেষ্টা করেছি
...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                খেয়াল করুন ছাঁচে কী নেই: আসল Customer এর নাম, Email বা ফোন নম্বর, আর
                কোনো Password বা Connection String। প্রশ্ন করার সময় Production এর
                আসল Data কখনো দেবেন না। উদাহরণটা ছোট আর বানানো রাখলে দুটো লাভ: কারো
                তথ্য বাইরে যায় না, আর যিনি উত্তর দেবেন তিনি নিজের মেশিনে সাথে সাথে
                চালিয়ে দেখতে পারেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>AI Assistant এর বেলায়ও একই নিয়ম, আর একটা বাড়তি।</strong>{" "}
                ChatGPT বা Claude এর মতো একটা AI কে পুরো Error, আপনার Version আর ছোট
                উদাহরণটা দিলে প্রায়ই চমৎকার ব্যাখ্যা পাবেন। কিন্তু AI মাঝে মাঝে খুব
                আত্মবিশ্বাসের সাথে ভুল বলে: এমন Function এর নাম দেয় যেটা নেই, বা অন্য
                Database এর লেখা দেয় PostgreSQL এর বলে। তাই বাড়তি নিয়মটা হলো, AI এর
                উত্তর নিজে চালিয়ে দেখার আগে বিশ্বাস করবেন না। এই পাতার Query বক্স বা
                নিজের psql ঠিক এই কাজের জন্যই। আর Production Database এ AI এর দেওয়া
                কোনো UPDATE বা DELETE আগে একটা পরীক্ষার Database এ চালিয়ে দেখবেন,
                সরাসরি কখনো না।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it-yourself",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>নিজে চিনুন, নিজে মিলিয়ে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার অনুশীলন। নিচের Lab এ নয়টা আসল Error একটা একটা করে আসবে। প্রতিটা
              দেখে বলুন আপত্তিটা কে করছে। উত্তর দিলেই কারণ আর সমাধান দেখাবে। চেষ্টা
              করুন প্রথম শব্দ আর LINE বা DETAIL আছে কিনা, শুধু এই দুটো দেখে সিদ্ধান্ত
              নিতে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ErrorTriageLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর এবার একটা ছোট যাদু। নিচের বক্সে দশটা ভাঙা Statement আছে, আর একটা ছোট
              Function, যেটা প্রতিটা চালিয়ে দেখে, ভাঙলে তার SQLSTATE আর Message একটা
              Table এ সাজিয়ে দেয়। Function টা কীভাবে লেখা হয় সেটা Module 14 এর বিষয়,
              এখন শুধু Run চাপুন আর কোডের পরিবারগুলো মিলিয়ে দেখুন: 42 বাক্য আর নাম, 23
              নিয়ম, 22 মান। প্রতিটা চেষ্টা আলাদাভাবে ফিরিয়ে নেওয়া হয়, তাই কিছুই বদলায়
              না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দশটা Error, দশটা কোড"
              query={SQLSTATE_DETECTOR}
              caption="প্রথমে CREATE আসবে, তারপর দশ Row এর একটা Table: প্রতিটা ভাঙা Statement এর পাশে তার SQLSTATE আর Message। নিজের একটা ভাঙা Statement তালিকায় যোগ করে দেখুন সেটা কোন পরিবারে পড়ে। শেষে SELECT count(*) FROM customers; চালালে দেখবেন এখনো পনেরো জনই আছেন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর API Error দেখে কী করে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Island Tours এর Website এ একজন Customer যখন Account খোলেন, তিনি psql
                দেখেন না, দেখেন একটা সুন্দর Form। কিন্তু পেছনে ঠিক সেই Error গুলোই
                ঘটে, যেগুলো এই লেসনে পড়লেন। কেউ পুরনো Email দিয়ে আবার Account খুলতে
                চাইলেন, PostgreSQL দিল 23505। প্রশ্ন হলো, এরপর API কী করে?
              </ContentParagraph>
              <ContentParagraph>
                দুটো জিনিস সে কখনো করে না। প্রথমত, PostgreSQL এর লেখাটা হুবহু Customer
                কে দেখায় না। duplicate key value violates unique constraint
                customers_email_key একজন সাধারণ মানুষের কাছে অর্থহীন, আর তার চেয়েও
                খারাপ, এটা বাইরের যে কাউকে আপনার Table আর Constraint এর নাম জানিয়ে দেয়,
                যা একজন আক্রমণকারীর কাছে মূল্যবান তথ্য। দ্বিতীয়ত, Message এর লেখা মিলিয়ে
                সিদ্ধান্ত নেয় না, কারণ লেখা বদলাতে পারে। সে দেখে কোড।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["PostgreSQL যা বলল", "API যা বোঝে", "Customer যা দেখেন", "Log এ যা যায়"],
          rows: [
            ["23505, customers_email_key", "এই Email এ আগে থেকেই Account আছে", "এই Email দিয়ে আগেই Account খোলা আছে, Login করুন", "পুরো Error, কোন Email না রেখে"],
            ["23503, Booking এর customer_id", "Customer নেই, সম্ভবত পুরনো Session", "আবার Login করে চেষ্টা করুন", "পুরো Error আর Request এর ID"],
            ["23514, bookings_seats_check", "সিট শূন্য বা ঋণাত্মক, Form এ যাচাই ফসকে গেছে", "অন্তত একটা সিট বেছে নিন", "পুরো Error, কারণ এটা App এর Bug এর চিহ্ন"],
            ["22P02, tour_id", "URL এ সংখ্যার জায়গায় অন্য কিছু", "ট্যুরটা পাওয়া যায়নি (404)", "ছোট একটা লাইন"],
            ["08 বা 57 পরিবার, বা Connection নেই", "Database এর সাথে যোগাযোগে সমস্যা", "একটু পরে আবার চেষ্টা করুন", "জরুরি, কারণ সবার জন্য বন্ধ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Code এ এটা দেখতে কেমন, নিচে একটা ছোট উদাহরণ, Node.js আর pg Package দিয়ে।
              Module 01 এর Lesson 06 এ এই Package দেখেছেন, আর নিজে হাতে লিখবেন Module
              17 এ। node-postgres Error এর SQLSTATE রাখে err.code এ, আর Constraint এর
              নাম err.constraint এ, ঠিক যে ঘরগুলো psql এ VERBOSITY verbose দিয়ে দেখেছেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "register-customer.js (Module 17 এর পরে চালানোর জন্য)",
          code: `import pg from "pg";

// Connection এর ঠিকানা আসে Environment থেকে। না থাকলে সাথে সাথে থামি,
// কোনো বিকল্প ঠিকানা ধরে নিয়ে চুপচাপ চলি না।
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// SQLSTATE কোড, Message এর লেখা না। লেখা বদলাতে পারে, কোড না।
const UNIQUE_VIOLATION = "23505";

export async function registerCustomer({ fullName, email, city }) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO customers (full_name, email, city) VALUES ($1, $2, $3) RETURNING customer_id",
      [fullName, email, city],
    );
    return { ok: true, customerId: rows[0].customer_id };
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION && err.constraint === "customers_email_key") {
      // Customer এর জন্য ভদ্র একটা কারণ, Database এর ভেতরের কোনো নাম না।
      return { ok: false, reason: "email_already_registered" };
    }
    // অচেনা Error: পুরোটা Log এ, Customer এর কাছে শুধু সাধারণ একটা বার্তা।
    console.error("registerCustomer failed", { code: err.code, message: err.message });
    throw err;
  }
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই ছোট Code টায় এই লেসনের প্রায় সব শিক্ষা আছে। কোড দেখে সিদ্ধান্ত, কারণ
              কোড স্থির। Constraint এর নাম দেখে নিশ্চিত হওয়া, কারণ একই Table এ একাধিক
              Unique নিয়ম থাকতে পারে। Customer এর কাছে মানুষের ভাষা, Log এ পুরো
              বিবরণ। আর অচেনা Error লুকিয়ে না ফেলা, কারণ চুপচাপ গিলে ফেলা Error পরে
              অনেক বড় হয়ে ফিরে আসে। আর Query তে $1, $2, $3 লেখার কারণ, মানে Parameter
              দিয়ে মান পাঠানো, Module 01 এর Lesson 06 এ দেখেছেন: SQL Injection থেকে
              বাঁচার উপায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো Error এর মুখোমুখি হলে, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "থামুন, পুরোটা পড়ুন",
              description:
                "Query আবার লেখার আগে Error এর প্রতিটা লাইন পড়ুন: প্রথম লাইন, LINE আর ^, DETAIL, HINT। শুধু প্রথম শব্দে থেমে যাবেন না, উত্তর প্রায়ই নিচের লাইনে।",
            },
            {
              title: "কে কথা বলছে, ঠিক করুন",
              description:
                "শুরুতে zsh বা bash থাকলে Shell, Connection refused থাকলে Network, FATAL থাকলে Login, ERROR থাকলে আপনার SQL বা Data। এই সিদ্ধান্তটাই বলে দেয় পরের পাঁচ মিনিট কোথায় খুঁজবেন।",
            },
            {
              title: "জায়গাটা চিহ্নিত করুন",
              description:
                "Syntax Error এ ^ এর ঠিক আগের অংশটা দেখুন। নামের Error এ Quote এর ভেতরের নামটা আর HINT। নিয়মের Error এ Constraint এর নাম আর DETAIL এর মান। Connection এ Host, Port, User আর Database।",
            },
            {
              title: "পরিবারটা চিনুন",
              description:
                "দরকার হলে \\errverbose দিয়ে SQLSTATE দেখুন। প্রথম দুই অক্ষর: 42 লেখা, 23 নিয়ম, 22 মান, 28 পরিচয়, 08 যোগাযোগ, 25 Transaction।",
            },
            {
              title: "একটা জিনিস বদলে আবার চালান",
              description:
                "একবারে একটাই পরিবর্তন। একসাথে তিনটা বদলালে কাজ হলেও জানবেন না কোনটায় হলো, আর না হলে নতুন একটা ভুলও ঢুকে যেতে পারে।",
            },
            {
              title: "না মিটলে Docs আর \\h",
              description:
                "Command এর Synopsis দেখুন, নিজের Version এর Docs পাতা খুলুন, Examples পড়ুন। অচেনা কোড হলে Appendix A।",
            },
            {
              title: "তবুও না মিটলে, খুঁজুন আর জিজ্ঞেস করুন",
              description:
                "Message হুবহু খুঁজুন, নিজের নাম বাদ দিয়ে। ছোট একটা উদাহরণ বানান। মানুষ বা AI কে Version, উদাহরণ আর পুরো Error দিন, আসল Data বা Password কখনো না।",
            },
            {
              title: "যাচাই করুন, তারপর লিখে রাখুন",
              description:
                "যে উত্তরই পান, নিজে চালিয়ে দেখুন। কাজ হলে নিজের একটা নোটে Error আর সমাধান এক লাইনে লিখে রাখুন। পরেরবার একই Error এ দশ সেকেন্ড লাগবে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>Error এর সাথে যে ভুলগুলো সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Error না পড়ে Query আবার লেখা:</strong> সবচেয়ে সাধারণ, আর
                সবচেয়ে দামি। নতুন করে লিখলে প্রায়ই একই ভুল আবার হয়, বা নতুন একটা ঢোকে।
                আগে পড়ুন।
              </ListItem>
              <ListItem>
                <strong>^ যেখানে, ভুলও সেখানে ভাবা:</strong> Syntax Error এ ^ দেখায়
                PostgreSQL কোথায় থেমেছে। ভুল প্রায়ই তার আগে, কখনো আগের লাইনে।
              </ListItem>
              <ListItem>
                <strong>Text এ Double Quote:</strong> PostgreSQL এ লেখা যায় Single
                Quote এ। Double Quote মানে নাম, তাই column does not exist আসে। MySQL
                থেকে এলে এই অভ্যাস বদলাতে একটু সময় লাগে।
              </ListItem>
              <ListItem>
                <strong>Connection এর Error এ SQL ঠিক করতে বসা:</strong> psql: error
                আর FATAL দেখলে আপনার SQL তখনো Server এ পৌঁছায়ইনি। Host, Port, User,
                Password আর Database দেখুন, Query না।
              </ListItem>
              <ListItem>
                <strong>=!# অবস্থায় একের পর এক Query চালানো:</strong> ভাঙা Transaction
                এ সবকিছু ফিরে আসবে। আগে ROLLBACK।
              </ListItem>
              <ListItem>
                <strong>ID এর ফাঁককে Error ভাবা:</strong> ব্যর্থ INSERT ও একটা নম্বর
                খরচ করে, PostgreSQL সেটা ফেরত নেয় না। 16 এর পরে 18 আসা স্বাভাবিক।
              </ListItem>
              <ListItem>
                <strong>Database এর লেখা হুবহু ব্যবহারকারীকে দেখানো:</strong> এটা
                বিভ্রান্ত করে, আর Table আর Constraint এর নাম বাইরে ফাঁস করে। কোড দেখে
                মানুষের ভাষায় বার্তা দিন, পুরো লেখা রাখুন Log এ।
              </ListItem>
              <ListItem>
                <strong>Message এর লেখা মিলিয়ে Code এ সিদ্ধান্ত:</strong>{" "}
                <code>if (err.message.includes(&quot;duplicate&quot;))</code> একদিন
                ভাঙবে। err.code ব্যবহার করুন।
              </ListItem>
              <ListItem>
                <strong>খোঁজার সময় নিজের Table এর নাম দেওয়া, Version না দেওয়া:</strong>{" "}
                আপনার Constraint এর নাম শুধু আপনার। আর পুরনো Version এর উত্তর নতুন
                Version এ ভুল হতে পারে।
              </ListItem>
              <ListItem>
                <strong>AI এর উত্তর না চালিয়েই বিশ্বাস করা:</strong> বিশেষ করে UPDATE
                আর DELETE। আগে পরীক্ষার Database এ, তারপর অন্য কোথাও।
              </ListItem>
              <ListItem>
                <strong>Help চাইতে গিয়ে Password বা আসল Customer এর তথ্য দেওয়া:</strong>{" "}
                ছোট, বানানো উদাহরণই যথেষ্ট, আর সেটাই নিরাপদ।
              </ListItem>
            </ContentList>
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
                <strong>Appendix A, PostgreSQL Error Codes:</strong> সব SQLSTATE,
                পরিবার ধরে সাজানো, প্রতিটার নামসহ। অচেনা কোড দেখলে প্রথম গন্তব্য।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/errcodes-appendix.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/errcodes-appendix.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Conventions:</strong> Synopsis এর চিহ্নগুলোর অফিসিয়াল ব্যাখ্যা,
                এক অনুচ্ছেদে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/notation.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/notation.html
                </a>
              </ListItem>
              <ListItem>
                <strong>SQL Commands:</strong> প্রতিটা Command এর পাতার তালিকা।
                Bookmark করে রাখুন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/sql-commands.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/sql-commands.html
                </a>
              </ListItem>
              <ListItem>
                <strong>psql এর Docs:</strong> VERBOSITY, \errverbose,
                LAST_ERROR_SQLSTATE, ON_ERROR_STOP আর Prompt এর চিহ্নগুলো, সবকিছুর
                অফিসিয়াল বর্ণনা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/app-psql.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/app-psql.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Authentication Problems:</strong> Login এর সময়ের সাধারণ Error
                গুলো, আর কেন Server এর Log দেখা দরকার।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/client-authentication-problems.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/client-authentication-problems.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Error Message Fields:</strong> একটা Error এর সাথে কোন কোন ঘর
                আসে (Severity, Code, Detail, Hint, Constraint), App এর দিক থেকে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/protocol-error-fields.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/protocol-error-fields.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Guide to Reporting Problems:</strong> PostgreSQL Wiki তে প্রশ্ন
                করার ভালো নিয়ম, এই লেসনের ছাঁচের বিস্তারিত রূপ।{" "}
                <a
                  href="https://wiki.postgresql.org/wiki/Guide_to_reporting_problems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  wiki.postgresql.org/wiki/Guide_to_reporting_problems
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Community:</strong> Mailing List আর অন্য জায়গা, যেখানে
                PostgreSQL এর মানুষেরা প্রশ্নের উত্তর দেন।{" "}
                <a
                  href="https://www.postgresql.org/community/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/community
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "module-recap",
      subHeader: { index: "018", title: "Module 02 Recap" },
      title: <SectionTitle>Module 02 শেষ: আপনার হাতে এখন একটা আসল Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এই লেসনের মূল কথা পাঁচ লাইনে। Error মানে কিছু নষ্ট হয়নি, একটা কাজ
                ফিরিয়ে দেওয়া হয়েছে কারণসহ। প্রথম প্রশ্ন সবসময়, কে কথা বলছে: Shell,
                Network, Login, না আপনার SQL। LINE আর ^ থাকলে ভুল লেখায়, DETAIL থাকলে
                Data তে, FATAL থাকলে Connection এ। পাঁচ অক্ষরের SQLSTATE এর প্রথম দুই
                অক্ষর পরিবার বলে, আর App সিদ্ধান্ত নেয় কোড দেখে, লেখা দেখে না। আর আটকে
                গেলে সিঁড়িটা মেনে চলুন, Docs থেকে শুরু, আর যা-ই পান নিজে চালিয়ে যাচাই।
              </ContentParagraph>
              <ContentParagraph>
                এবার পুরো Module টা এক নজরে দেখা যাক, কারণ সাতটা লেসন মিলে একটাই
                কাজ করেছে।
              </ContentParagraph>
            </>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ModuleTwoStoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <Link href="/sql/topic/install-postgresql" className={LINK}>
                  Lesson 01, Installing PostgreSQL
                </Link>
                : নিজের মেশিনে একটা চালু Server, Port 5432 এ, macOS, Windows, Linux বা
                Docker, যেটা আপনার।
              </ListItem>
              <ListItem>
                <Link href="/sql/topic/install-mysql" className={LINK}>
                  Lesson 02, Installing MySQL
                </Link>
                : MySQL দিয়ে কোনো কোর্স বা ভিডিও ফলো করার জন্য পাশাপাশি একটা MySQL,
                Port 3306 এ।
              </ListItem>
              <ListItem>
                <Link href="/sql/topic/psql-basics" className={LINK}>
                  Lesson 03, psql
                </Link>
                : Terminal থেকে Connect করা, Prompt এর চিহ্ন, আর \l, \dt, \d এর মতো
                Meta-command।
              </ListItem>
              <ListItem>
                <Link href="/sql/topic/gui-clients" className={LINK}>
                  Lesson 04, GUI Clients
                </Link>
                : একই Connection এর তথ্য দিয়ে মাউসে Database দেখা, আর Production এর
                সাথে সাবধানতা।
              </ListItem>
              <ListItem>
                <Link href="/sql/topic/databases-schemas" className={LINK}>
                  Lesson 05, Databases and Schemas
                </Link>
                : এক Server, অনেক Database, Database এর ভেতর Schema, আর search_path
                দিয়ে নাম খোঁজা।
              </ListItem>
              <ListItem>
                <Link href="/sql/topic/load-sample-database" className={LINK}>
                  Lesson 06, Loading the Island Tours Database
                </Link>
                : আটটা Table আর তাদের Data, নিজের মেশিনে, যতবার খুশি আবার শুরু থেকে।
              </ListItem>
              <ListItem>
                <strong>Lesson 07, এই লেসন:</strong> লাল লেখা পড়া, আর আটকে গেলে নিজে
                পথ খোঁজা।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিজেকে যাচাই: কাউকে বোঝাতে পারবেন?",
          content: (
            <ContentList>
              <ListItem>PostgreSQL Server, psql আর একটা GUI, এই তিনটা আলাদা কেন, আর কে কার সাথে কথা বলে?</ListItem>
              <ListItem>আপনার Server চালু আছে কিনা, কোন Port এ, এক Command এ কীভাবে দেখবেন?</ListItem>
              <ListItem>একটা Server এ কয়টা Database থাকতে পারে, আর Schema তাদের থেকে কোথায় আলাদা?</ListItem>
              <ListItem>island_tours নষ্ট করে ফেললে পাঁচ মিনিটে কীভাবে আবার শুরুর অবস্থায় ফিরবেন?</ListItem>
              <ListItem>connection refused, password authentication failed আর relation does not exist, তিনটার প্রথম পরীক্ষা কী কী?</ListItem>
              <ListItem>Prompt এ =!# দেখলে কী করবেন, আর কেন?</ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ছয়টা প্রশ্নের উত্তর মুখে বলতে পারলে Module 02 আপনার হয়ে গেছে। আর এবার
                আসল মজা শুরু। এতদিন আপনি Database বানিয়েছেন, চালু করেছেন, তার সাথে
                কথা বলার রাস্তা তৈরি করেছেন। Module 03 থেকে সেই রাস্তা দিয়ে প্রশ্ন
                পাঠাবেন: কোন ট্যুর সবচেয়ে দামি, কোন Customer এর ফোন নম্বর নেই, কোন
                বুকিং এখনো pending। SELECT আর FROM দিয়ে শুরু, তারপর WHERE দিয়ে ছাঁকা,
                ORDER BY দিয়ে সাজানো, আর NULL এর সেই অদ্ভুত আচরণ, যার কিছু ঝলক এই
                লেসনেই দেখেছেন। প্রতিটা Query আপনি চালাবেন দুই জায়গায়: পাতার Query
                বক্সে, আর নিজের psql এ। আর কোনো Query ভাঙলে, এখন আপনি জানেন কী করতে
                হয়।
              </ContentParagraph>
              <ContentParagraph>
                পরের গন্তব্য:{" "}
                <Link href="/sql/topic/reading-data-overview" className={LINK}>
                  Module 03, Reading Data: Module Overview
                </Link>
                ।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      ["ERROR", "একটা Statement বাতিল, Data অক্ষত, Connection চালু", "island_tours=# এ ফিরে আসা"],
      ["FATAL", "Session শেষ বা শুরুই হয়নি, সমস্যা Connection এ", "psql: error ... FATAL"],
      ["NOTICE", "শুধু জানানো, কাজ হয়েছে", "DROP TABLE IF EXISTS"],
      ["কে কথা বলছে", "Shell, Network, Login, Parser, Analyzer, Executor", "Error এর প্রথম শব্দ"],
      ["LINE আর ^", "লেখার কোন জায়গায় থেমেছে, ভুল প্রায়ই ঠিক আগে", "Syntax আর নামের Error"],
      ["DETAIL", "কোন মান বা Row নিয়ে সমস্যা", "নিয়ম ভাঙার Error"],
      ["HINT", "PostgreSQL এর পরামর্শ", "column titel, round(double precision, integer)"],
      ["SQLSTATE", "পাঁচ অক্ষরের স্থির কোড, প্রথম দুই অক্ষর পরিবার", "\\errverbose, err.code"],
      ["42 / 23 / 22", "লেখা বা নাম / Table এর নিয়ম / মানের ধরন", "42P01, 23505, 22P02"],
      ["25P02", "ভাঙা Transaction, আগে ROLLBACK", "Prompt এ =!#"],
      ["\\h আর Docs", "Synopsis: [ ] ঐচ্ছিক, | বিকল্প, ... আরও", "\\h DROP TABLE, Appendix A"],
      ["সাহায্য চাওয়া", "হুবহু Message, Version, ছোট উদাহরণ, আসল Data না", "help-request.md ছাঁচ"],
      ["App এ Error", "কোড দেখে সিদ্ধান্ত, Customer কে মানুষের ভাষা, Log এ পুরোটা", "register-customer.js"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "psql এ একটা INSERT চালানোর পর ERROR এল, আর Prompt আবার island_tours=# হয়ে গেল (কোনো Transaction খোলা ছিল না)। আপনার Data এর এখন কী অবস্থা?",
        options: [
          {
            key: "A",
            text: "INSERT এর অর্ধেক কাজ হয়ে থেমে গেছে, Table টা দেখে ঠিক করতে হবে",
            isCorrect: false,
            explanation: "PostgreSQL এ একটা Statement হয় পুরো হয়, নয়তো একটুও না। অর্ধেক অবস্থা থাকে না।",
          },
          {
            key: "B",
            text: "INSERT টা পুরোপুরি বাতিল হয়েছে, Data আগের মতোই আছে, আর পরের Statement লিখতে পারবেন",
            isCorrect: true,
            explanation:
              "ঠিক। ERROR মানে এই একটা Statement বাতিল। Connection চালু, Data অক্ষত। ঠিক করে আবার চালান।",
          },
          {
            key: "C",
            text: "Connection কেটে গেছে, আবার psql খুলতে হবে",
            isCorrect: false,
            explanation: "Connection কাটলে Prompt ফিরে আসত না। সেটা FATAL এর আচরণ, ERROR এর না।",
          },
          {
            key: "D",
            text: "পুরো Table টা Lock হয়ে গেছে, অন্য কেউ আর লিখতে পারবেন না",
            isCorrect: false,
            explanation: "একটা ব্যর্থ Statement কোনো Lock রেখে যায় না। সব আগের মতো।",
          },
        ],
      },
      {
        id: 2,
        text: "SELECT title, FROM tours; চালালে আসে syntax error at or near \"FROM\", আর ^ পড়ে FROM এর নিচে। আসল ভুলটা কোথায়?",
        options: [
          {
            key: "A",
            text: "FROM শব্দের বানানে",
            isCorrect: false,
            explanation: "FROM ঠিকই লেখা। PostgreSQL শুধু এখানে এসে থেমেছে।",
          },
          {
            key: "B",
            text: "tours Table টা নেই",
            isCorrect: false,
            explanation: "Table না থাকলে আসত relation does not exist, আর সেটা আসত গঠন ঠিক থাকলে, তার পরের ধাপে।",
          },
          {
            key: "C",
            text: "title এর পরের বাড়তি কমায়: কমা দেখে PostgreSQL আরেকটা Column আশা করছিল, পেল FROM",
            isCorrect: true,
            explanation:
              "ঠিক। Syntax Error এ ^ দেখায় PostgreSQL কোথায় থামল। ভুলটা প্রায়ই ঠিক তার আগে।",
          },
          {
            key: "D",
            text: "Semicolon টা ভুল জায়গায়",
            isCorrect: false,
            explanation: "Semicolon শেষেই আছে, ঠিক জায়গায়।",
          },
        ],
      },
      {
        id: 3,
        text: "psql চালাতেই এল: psql: error: connection to server at \"127.0.0.1\", port 5432 failed: Connection refused। আপনার প্রথম কাজ কোনটা?",
        options: [
          {
            key: "A",
            text: "Query এর বানান দেখা",
            isCorrect: false,
            explanation: "কোনো Query Server এ পৌঁছায়ইনি। এখানে SQL এর কোনো ভূমিকা নেই।",
          },
          {
            key: "B",
            text: "Password বদলে আবার চেষ্টা করা",
            isCorrect: false,
            explanation: "Password ভুল হলে আসত FATAL: password authentication failed। এখানে দরজাই খোলেনি, Password চাওয়ার সুযোগই আসেনি।",
          },
          {
            key: "C",
            text: "pg_isready দিয়ে দেখা Server চালু কিনা, আর Port টা ঠিক কিনা",
            isCorrect: true,
            explanation:
              "ঠিক। Connection refused মানে ওই ঠিকানা আর Port এ কেউ শুনছে না: Server বন্ধ, বা অন্য Port এ (যেমন 5433)।",
          },
          {
            key: "D",
            text: "island_tours Database আবার Load করা",
            isCorrect: false,
            explanation: "Database এর সমস্যা হলে Server আগে সাড়া দিত, তারপর বলত database does not exist।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Error এ LINE বা ^ নেই, কিন্তু DETAIL আছে: Key (email)=(rahim.uddin@mail.example) already exists. এটা কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "আপনার SQL এর গঠন ঠিক ছিল, সমস্যা Data তে: এই Email আগে থেকেই আছে, আর Table এর Unique নিয়ম সেটা মানে না",
            isCorrect: true,
            explanation:
              "ঠিক। LINE আর ^ না থাকা মানে লেখায় কোনো নির্দিষ্ট ভুল জায়গা নেই। DETAIL ঠিক কোন মান সমস্যা করল সেটা বলছে। কোড 23505।",
          },
          {
            key: "B",
            text: "Email Column টা Table এ নেই",
            isCorrect: false,
            explanation: "Column না থাকলে আসত column does not exist, সাথে LINE আর ^।",
          },
          {
            key: "C",
            text: "PostgreSQL Email ধরনের মান বোঝে না",
            isCorrect: false,
            explanation: "email একটা text Column, যেকোনো লেখা নেয়। সমস্যা মান একই হওয়ায়।",
          },
          {
            key: "D",
            text: "Connection এ সমস্যা, আবার Login করতে হবে",
            isCorrect: false,
            explanation: "Connection এর সমস্যা হলে শুরুতে FATAL থাকত। এটা একটা সাধারণ ERROR।",
          },
        ],
      },
      {
        id: 5,
        text: "Island Tours এর API তে এই Code লেখা আছে: if (err.message.includes(\"duplicate\")) { ... }। একজন অভিজ্ঞ Developer এটা বদলাতে বললেন। কেন?",
        options: [
          {
            key: "A",
            text: "includes খুব ধীর",
            isCorrect: false,
            explanation: "গতি এখানে সমস্যা না। সমস্যা নির্ভরযোগ্যতায়।",
          },
          {
            key: "B",
            text: "Message এর লেখা ভাষা বা Version বদলালে বদলে যেতে পারে, কিন্তু SQLSTATE কোড (err.code === \"23505\") স্থির থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। lc_messages বদলালে বা নতুন Version এ শব্দ বদলালে এই Code চুপচাপ ভেঙে যাবে। কোড দেখে সিদ্ধান্ত নিন, আর দরকার হলে err.constraint দিয়ে নির্দিষ্ট নিয়মটাও মিলিয়ে নিন।",
          },
          {
            key: "C",
            text: "PostgreSQL এর Error এ message নামে কোনো ঘর নেই",
            isCorrect: false,
            explanation: "message আছে। কিন্তু এটা মানুষের জন্য, Program এর সিদ্ধান্তের জন্য না।",
          },
          {
            key: "D",
            text: "duplicate শব্দটা শুধু MySQL এ আসে",
            isCorrect: false,
            explanation: "PostgreSQL এর Message এও duplicate key value আছে। তবু Message এর উপর নির্ভর করা ঠিক না।",
          },
        ],
      },
      {
        id: 6,
        text: "psql এর Prompt দেখাচ্ছে island_tours=!#, আর আপনি যা-ই চালান, আসছে current transaction is aborted। ঠিক কী করবেন?",
        options: [
          {
            key: "A",
            text: "একই Query বারবার চালাতে থাকা, একসময় কাজ করবে",
            isCorrect: false,
            explanation: "ভাঙা Transaction এ সব Statement ফিরে আসবে, যতবারই চালান।",
          },
          {
            key: "B",
            text: "psql বন্ধ করে পুরো মেশিন Restart",
            isCorrect: false,
            explanation: "এত বড় কিছুর দরকার নেই। একটা শব্দই যথেষ্ট।",
          },
          {
            key: "C",
            text: "ROLLBACK লেখা, তারপর ভাঙা Statement ঠিক করে আবার BEGIN থেকে শুরু করা",
            isCorrect: true,
            explanation:
              "ঠিক। =!# মানে খোলা Transaction টা ভাঙা (কোড 25P02)। ROLLBACK পুরো Transaction বাতিল করে Prompt কে আবার =# এ ফেরায়।",
          },
          {
            key: "D",
            text: "COMMIT লিখে যা হয়েছে তা রেখে দেওয়া",
            isCorrect: false,
            explanation: "ভাঙা Transaction এ COMMIT লিখলেও কিছু রাখা হয় না, PostgreSQL সেটাকে ROLLBACK হিসেবেই নেয়। পরিষ্কার উপায় নিজেই ROLLBACK লেখা।",
          },
        ],
      },
      {
        id: 7,
        text: "\\h DROP TABLE এর Synopsis: DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]। নিচের কোনটা এই ছাঁচ মানে না?",
        options: [
          {
            key: "A",
            text: "DROP TABLE tour_notes;",
            isCorrect: false,
            explanation: "বৈধ। বন্ধনীর ভেতরের সব অংশ ঐচ্ছিক।",
          },
          {
            key: "B",
            text: "DROP TABLE IF EXISTS tour_notes, tour_drafts;",
            isCorrect: false,
            explanation: "বৈধ। [, ...] মানে কমা দিয়ে আরও নাম দেওয়া যায়।",
          },
          {
            key: "C",
            text: "DROP TABLE tour_notes CASCADE RESTRICT;",
            isCorrect: true,
            explanation:
              "ঠিক, এটাই ছাঁচ মানে না। | মানে বিকল্পগুলোর যেকোনো একটা, দুটো একসাথে না।",
          },
          {
            key: "D",
            text: "DROP TABLE tour_notes RESTRICT;",
            isCorrect: false,
            explanation: "বৈধ। CASCADE বা RESTRICT এর একটা বেছে নেওয়া হয়েছে।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা Error এর সমাধান খুঁজতে কোন Search সবচেয়ে কাজের হবে?",
        options: [
          {
            key: "A",
            text: "postgres error help",
            isCorrect: false,
            explanation: "খুব সাধারণ। হাজার রকমের Error এর পাতা আসবে, আপনারটা না।",
          },
          {
            key: "B",
            text: "\"bookings_customer_id_fkey\" error",
            isCorrect: false,
            explanation: "এই Constraint এর নাম শুধু আপনার Database এর। প্রায় কেউই এই নামে লেখেননি।",
          },
          {
            key: "C",
            text: "\"violates foreign key constraint\" \"is still referenced from table\" postgresql 18",
            isCorrect: true,
            explanation:
              "ঠিক। Message এর সাধারণ অংশ হুবহু, নিজের নাম বাদ দিয়ে, সাথে Version। এতে ঠিক এই ধরনের সমস্যার আলোচনাই আসবে।",
          },
          {
            key: "D",
            text: "আমার Database এর পুরো Error, Customer এর আসল Email সহ",
            isCorrect: false,
            explanation: "নিজের নাম আর আসল Data খোঁজাকে আরও খারাপ করে, আর তথ্যটা বাইরে চলে যায়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের মেশিনে Error এর সাথে বন্ধুত্ব",
    subtitle: "ইচ্ছা করে ভাঙা, তারপর পড়া, তারপর সারানো, নিজের psql আর island_tours এ",
    stepName: "LAB",
    steps: [
      {
        title: "পাঁচটা Error ইচ্ছা করে আনুন",
        description:
          "psql -d island_tours দিয়ে ঢুকে প্রথম ফাইলের Statement গুলো একটা একটা করে চালান। প্রতিটার পাশে লিখুন কে আপত্তি করল আর LINE, DETAIL, HINT এর কোনটা এসেছে।",
      },
      {
        title: "কোডগুলো বের করুন",
        description:
          "দ্বিতীয় ফাইলের তিন উপায়ে SQLSTATE দেখুন: \\errverbose, VERBOSITY verbose, আর LAST_ERROR_SQLSTATE। প্রতিটা কোডের প্রথম দুই অক্ষর থেকে পরিবারটা বলুন।",
      },
      {
        title: "একটা Transaction ভাঙুন, তারপর সারান",
        description:
          "তৃতীয় ফাইলের ধাপগুলো চালান। Prompt এর =#, =*# আর =!# নিজের চোখে বদলাতে দেখুন, আর ROLLBACK দিয়ে ফিরে আসুন।",
      },
      {
        title: "দরজায় আটকে দেখুন",
        description:
          "চতুর্থ ফাইলের Command গুলো Terminal এ চালান: ভুল Database, ভুল Role, ভুল Port। প্রতিটার Message আপনার মেশিনে কেমন দেখাল, আর Lab এর Output থেকে কোথায় আলাদা, লিখে রাখুন।",
      },
      {
        title: "Docs থেকে নিজে উত্তর",
        description:
          "পঞ্চম ফাইলের মতো \\h দিয়ে তিনটা Command এর Synopsis দেখুন, আর প্রতিটার জন্য Docs পাতা খুলে একটা Example নিজে চালান।",
      },
      {
        title: "SQLSTATE এর যন্ত্র নিজের মেশিনে",
        description:
          "ষষ্ঠ ফাইলটা psql -d island_tours -f দিয়ে চালান। দশটা Statement এর কোড পাতার Query বক্সের সাথে মেলান, তারপর নিজের দুটো ভাঙা Statement যোগ করে আবার চালান।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-five-errors.sql",
        language: "sql",
        code: `-- একটা একটা করে চালান। প্রতিটার নিচে PostgreSQL 18 এর আসল উত্তর।

SELEC title FROM tours;
-- ERROR:  syntax error at or near "SELEC"

SELECT titel FROM tours;
-- ERROR:  column "titel" does not exist
-- HINT:  Perhaps you meant to reference the column "tours.title".

SELECT * FROM tours WHERE title = "Sajek Valley Cloud Trip";
-- ERROR:  column "Sajek Valley Cloud Trip" does not exist

INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka');
-- ERROR:  duplicate key value violates unique constraint "customers_email_key"
-- DETAIL:  Key (email)=(rahim.uddin@mail.example) already exists.

SELECT * FROM tours WHERE tour_id = 'abc';
-- ERROR:  invalid input syntax for type integer: "abc"`,
      },
      {
        filename: "2-find-the-code.sql",
        language: "sql",
        code: `-- উপায় ১: এইমাত্র পাওয়া Error টা পুরো বিস্তারিত
SELECT * FROM tour;
\\errverbose
-- ERROR:  42P01: relation "tour" does not exist

-- উপায় ২: এখন থেকে সব Error বিস্তারিত
\\set VERBOSITY verbose
DELETE FROM customers WHERE customer_id = 1;
-- ERROR:  23503: update or delete on table "customers" violates foreign key constraint ...
\\set VERBOSITY default

-- উপায় ৩: শুধু কোড, একটা Variable থেকে
SELECT 1 / 0;
\\echo :LAST_ERROR_SQLSTATE
-- 22012`,
      },
      {
        filename: "3-broken-transaction.sql",
        language: "sql",
        code: `-- Prompt এর মাঝের চিহ্নটা প্রতিবার খেয়াল করুন: =#, তারপর =*#, তারপর =!#
BEGIN;
SELECT * FROM tour;            -- ERROR: relation "tour" does not exist
SELECT count(*) FROM tours;    -- ERROR: current transaction is aborted, ...
ROLLBACK;
SELECT count(*) FROM tours;    -- 9`,
      },
      {
        filename: "4-wrong-door.sh",
        language: "bash",
        code: `# Terminal এ চালান। Socket এর ঠিকানা, Host আর Port আপনার মেশিনে আলাদা হবে।

# এই নামে কোনো Database নেই (3D000)
psql -d islandtours
# ... FATAL:  database "islandtours" does not exist

# এই নামে কোনো Role নেই (28000)
psql -U riya -d island_tours
# ... FATAL:  role "riya" does not exist

# এই Port এ কেউ শুনছে না
psql -h 127.0.0.1 -p 5499 -d island_tours
# ... failed: Connection refused

# Server চালু আছে কিনা, এক লাইনে
pg_isready`,
      },
      {
        filename: "5-ask-psql.sql",
        language: "sql",
        code: `-- Synopsis আর আপনার Version এর Docs এর ঠিকানা, psql এর ভেতরেই
\\h DROP TABLE
\\h CREATE SCHEMA
\\h INSERT

-- সব Command এর তালিকা, আর psql এর নিজের সব Meta-command
\\h
\\?`,
      },
      {
        filename: "6-sqlstate-detector.sql",
        language: "sql",
        code: SQLSTATE_DETECTOR,
      },
    ],
  },
  assignment: {
    title: "Mini Project: নিজের Error এর খাতা",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দশটা Error সংগ্রহ:</strong> নিজের psql আর island_tours এ ইচ্ছা করে
        দশটা আলাদা Error আনুন, প্রতিটা আলাদা SQLSTATE এর। অন্তত একটা Shell এর,
        একটা Login এর, তিনটা বাক্য বা নামের, তিনটা নিয়মের, আর একটা মানের।
      </span>,
      <span key="2">
        <strong>খাতা বানান:</strong> প্রতিটা Error এর জন্য একটা লাইন: হুবহু প্রথম
        লাইন, SQLSTATE, কে আপত্তি করল, কারণ এক বাক্যে, আর সমাধান। এটাই আপনার নিজের
        Error অভিধানের শুরু, পরের Module গুলোতে এতে যোগ করতে থাকবেন।
      </span>,
      <span key="3">
        <strong>Docs থেকে একটা উত্তর:</strong> এই লেসনে নেই এমন একটা Command বেছে
        নিন, যেমন TRUNCATE বা ALTER TABLE। \h আর Docs পাতা থেকে তার Synopsis পড়ে নিজের
        ভাষায় লিখুন কোন অংশ ঐচ্ছিক, কোথায় বিকল্প বেছে নিতে হয়, আর একটা বৈধ আর একটা
        অবৈধ উদাহরণ দিন।
      </span>,
      <span key="4">
        <strong>একটা সাহায্যের অনুরোধ লিখুন:</strong> ১২ নম্বর অংশের ছাঁচ মেনে আপনার
        দশটার যেকোনো একটা Error নিয়ে একটা প্রশ্ন লিখুন, এমন ছোট উদাহরণসহ যেটা একজন
        অপরিচিত মানুষ কপি করে চালিয়ে একই Error পাবেন। কোনো আসল তথ্য বা Password থাকবে
        না।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন নতুন বন্ধুকে আট লাইনে বোঝান,
        ERROR আর FATAL এর তফাত কী, LINE আর DETAIL কী বলে, আর Error দেখলে প্রথম কোন
        প্রশ্নটা করতে হয়। তারপর Module 02 এর ছয়টা যাচাইয়ের প্রশ্নের উত্তর মুখে
        বলে দেখুন।
      </span>,
    ],
    deliverables: [
      <span key="1">দশটা Error এর হুবহু Output</span>,
      <span key="2">দশ লাইনের Error খাতা, প্রতিটায় SQLSTATE, উৎস, কারণ আর সমাধান</span>,
      <span key="3">একটা Command এর Synopsis এর ব্যাখ্যা, একটা বৈধ আর একটা অবৈধ উদাহরণসহ</span>,
      <span key="4">ছাঁচ মেনে লেখা একটা সাহায্যের অনুরোধ, চালানোর মতো ছোট উদাহরণসহ</span>,
      <span key="5">বন্ধুর জন্য আট লাইনের ব্যাখ্যা</span>,
    ],
  },
};
