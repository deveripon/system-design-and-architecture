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
  ThreeValuedLab,
  WhereVerdictLab,
} from "../../../components/course/topics/reading-data/null-animations";
import {
  NullBoxesDiagram,
  NullSpreadDiagram,
  TruthTablesDiagram,
  WhereGateDiagram,
} from "../../../components/course/topics/reading-data/null-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const nullLogicContent: TopicData = {
  id: "null-logic",
  introduction: {
    badge: "MODULE 03 · LESSON 05",
    title: <SectionTitle>NULL: যে মানটা কেউ জানে না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি WHERE দিয়ে Row ছাঁকতে শিখেছেন। প্রতিটা শর্ত প্রতিটা Row
          কে একটা প্রশ্ন করেছে, আর উত্তর এসেছে হ্যাঁ বা না। দামটা দশ হাজারের কম কিনা,
          হ্যাঁ বা না। ট্যুরটা চালু কিনা, হ্যাঁ বা না। এতদিন পৃথিবীটা ছিল দুই রঙের।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু সত্যিকারের Database এ একটা তৃতীয় উত্তর আছে: জানি না। একজন Customer
          ফোন নম্বর দেননি, তাহলে তাঁর নম্বর কি অমুক নম্বরের সমান? হ্যাঁ বলা যায় না, না
          বলাও যায় না। SQL এই অবস্থার নাম দিয়েছে NULL, আর এই একটা শব্দ Query কে এমনভাবে
          বদলে দেয় যে কোনো Error ছাড়াই Row হারিয়ে যায়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি দেখবেন NULL আসলে কী আর কী না, কেন = NULL কখনো কাজ করে না, SQL এর
          তিন মানের যুক্তি কীভাবে চলে, WHERE কেন অজানা উত্তরকে বাদ দেয়, IS NULL আর IS
          DISTINCT FROM দিয়ে কীভাবে সঠিক প্রশ্ন করবেন, যোগ বিয়োগ বা লেখা জোড়ায় NULL কী
          করে, আর একটা Table ডিজাইনের সময় NULL নিয়ে কী ভাবতে হয়। শেষে চুপচাপ হারিয়ে যাওয়া
          Row আপনি এক নজরে ধরতে পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "যে প্রশ্নের উত্তর জানা নেই, সেখানে হ্যাঁ বা না বলা মানে আন্দাজে বলা। আমি তাই সৎভাবে বলি: জানি না। আমাকে খুঁজতে চাইলে সমান চিহ্ন দিয়ে ডাকবেন না, আমার নাম ধরে ডাকুন: IS NULL।",
      author: "NULL",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>পাঁচজন Customer কোথায় গেলেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শীতের মৌসুম শুরুর আগে Island Tours এর Marketing এর দায়িত্বে থাকা সাদিয়া
                সব Customer কে একটা Email Newsletter পাঠাতে চান। শুধু একজন বাদ: Rahim
                Uddin গতকাল Support এ ফোন করে বলেছেন তাঁকে যেন আর কোনো প্রচারের বার্তা না
                পাঠানো হয়। Support টিমের খাতায় তাঁর পরিচয় লেখা আছে ফোন নম্বর দিয়ে,
                +8801000000101।
              </ContentParagraph>
              <ContentParagraph>
                Developer তানিম কাজটা পেলেন। Database এ মোট Customer ১৫ জন, একজন বাদ, তাই
                তালিকায় থাকার কথা ১৪ জন। তানিম যুক্তি মেনেই লিখলেন: যাঁদের ফোন নম্বর
                Rahim এর নম্বরের সমান না, তাঁরা সবাই। Query চলল, কোনো Error নেই। কিন্তু
                তালিকায় এল ৯ জন।
              </ContentParagraph>
              <ContentParagraph>
                তানিম ভাবলেন, হয়তো কয়েকজনের ফোন নম্বরই নেই, তাঁদের আলাদা করে খুঁজে যোগ করে
                দিলেই হবে। লিখলেন: যাঁদের ফোন নম্বর NULL এর সমান। এবারও কোনো Error নেই।
                ফলাফল এল শূন্য Row। নিচের বক্সে তানিমের দুটো Query আর মোট সংখ্যাটা একসাথে
                চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের দুটো Query"
              query={`SELECT count(*) FROM customers;

SELECT full_name, phone
FROM customers
WHERE phone <> '+8801000000101';

SELECT full_name, phone
FROM customers
WHERE phone = NULL;`}
              caption="প্রথম Query বলবে ১৫, দ্বিতীয়টা দেবে ৯টা Row, তৃতীয়টা শূন্য। ১৫ থেকে একজন বাদ দিলে ১৪ হওয়ার কথা। বাকি পাঁচজন কোনো Query তেই নেই, অথচ কোনো Error ও আসেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাঁচজন Customer দুই Query থেকেই উধাও। তাঁরা Rahim না, তাই প্রথম তালিকায়
                থাকার কথা ছিল। তাঁদের ফোন নম্বর নেই, তাই দ্বিতীয় তালিকায় থাকার কথা ছিল।
                অথচ কোথাও নেই। তানিম যদি সংখ্যাটা মিলিয়ে না দেখতেন, এই পাঁচজন কোনোদিন
                Newsletter পেতেন না, আর কেউ টেরও পেত না।
              </ContentParagraph>
              <ContentParagraph>
                এই পাঁচজনের মিল একটাই: Customer Table এর phone Column এ তাঁদের ঘরে কোনো মান
                নেই। সেখানে আছে NULL। আর NULL এর সাথে কোনো তুলনাই সাধারণ নিয়মে চলে না। এই
                লেসন ঠিক এই নিয়মগুলো নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Error এর চেয়েও খারাপ: চুপচাপ ভুল উত্তর",
          content: (
            <ContentParagraph>
              Syntax ভুল হলে PostgreSQL চিৎকার করে Error দেয়, আপনি সাথে সাথে ঠিক করেন।
              NULL এর ভুলে কোনো চিৎকার নেই। Query নিখুঁতভাবে চলে, শুধু কয়েকটা Row নিঃশব্দে
              বাদ পড়ে। Report এর সংখ্যা একটু কম আসে, Newsletter কয়েকজন কম মানুষ পান, আর
              মাসের পর মাস কেউ খেয়াল করে না। তাই NULL শেখা মানে আসলে এই নিঃশব্দ ভুল ধরার
              চোখ তৈরি করা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-null-is",
      subHeader: { index: "002", title: "What NULL Is" },
      title: <SectionTitle>শূন্য না, খালি না, অজানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Registration Form কল্পনা করুন। নাম আর Email এর ঘরে তারকা চিহ্ন, ওগুলো
                দিতেই হবে। ফোন নম্বরের ঘরে লেখা ঐচ্ছিক। একজন Customer ফোনের ঘরটা ফাঁকা রেখে
                Submit চাপলেন। এখন Database এ তাঁর ফোনের জায়গায় কী রাখা হবে?
              </ContentParagraph>
              <ContentParagraph>
                শূন্য রাখা যায় না, কারণ শূন্য একটা নম্বর, আর তাঁর ফোন নম্বর শূন্য না। খালি
                লেখা রাখাও ঠিক না, কারণ খালি লেখা মানে আমরা জানি তাঁর নম্বরটা কিছুই না। আসল
                সত্যটা হলো: আমরা তাঁর নম্বর জানি না। SQL এই জানি না অবস্থাটা রাখার জন্য একটা
                বিশেষ চিহ্ন ব্যবহার করে, যার নাম NULL।
              </ContentParagraph>
              <ContentParagraph>
                মাথায় রাখার মতো ছবিটা হলো একটা বাক্স। শূন্য হলো একটা বাক্স যার ভেতরে শূন্য
                লেখা কাগজ আছে। খালি লেখা হলো একটা বাক্স যার ভেতরে একটা সাদা কাগজ আছে। আর NULL
                হলো এমন একটা বাক্স যার ভেতরে কোনো কাগজই নেই, বাইরে শুধু একটা চিরকুট লাগানো:
                জানা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullBoxesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Column এ NULL আসে সাধারণত তিনটা কারণে, আর তিনটাই Island Tours এর Data তে
                আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মান অজানা:</strong> মানটা বাস্তবে আছে, কিন্তু আমাদের জানা নেই।
                  Tanvir Ahmed এর নিশ্চয়ই একটা ফোন আছে, তিনি শুধু দেননি। phone Column এর NULL
                  এই ধরনের।
                </ListItem>
                <ListItem>
                  <strong>প্রযোজ্য না:</strong> মানটা থাকার কথাই না। একজন Customer রেটিং দিলেন
                  কিন্তু কোনো মন্তব্য লিখলেন না। মন্তব্যটা অজানা না, মন্তব্যটা নেই। reviews
                  Table এর comment Column এর NULL এই ধরনের।
                </ListItem>
                <ListItem>
                  <strong>এখনো ঠিক হয়নি:</strong> মানটা পরে আসবে। Ratargul Swamp Boat Day
                  ট্যুরের জন্য এখনো কোনো Guide ঠিক করা হয়নি। tours Table এর guide_id Column এর
                  NULL এই ধরনের।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মজার ব্যাপার, SQL এই তিনটাকে আলাদা করে না। তিনটাই একই NULL। কোনটা কোন অর্থে,
                সেটা জানে শুধু Table টা যিনি ডিজাইন করেছেন। নিচের বক্সে দেখুন PostgreSQL নিজে
                NULL, শূন্য আর খালি লেখাকে কীভাবে আলাদা করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা বাক্স পাশাপাশি"
              query={`SELECT NULL AS nothing, 0 AS zero, '' AS empty_text;

SELECT NULL IS NULL AS null_is_null,
       0    IS NULL AS zero_is_null,
       ''   IS NULL AS empty_is_null;`}
              caption="প্রথম ফলাফলে তিনটা ঘর তিন রকম: NULL, 0 আর একটা ফাঁকা ঘর। দ্বিতীয় ফলাফলে শুধু প্রথমটা t, মানে TRUE। শূন্য আর খালি লেখা NULL না, ওরা দুটোই জানা মান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই বক্সটা NULL কে আলাদা করে NULL লিখে দেখায়, যাতে চোখে পড়ে। আপনার নিজের psql
                এ কিন্তু NULL দেখাবে পুরোপুরি ফাঁকা ঘর হিসেবে, ঠিক খালি লেখার মতো। এতে প্রথম
                প্রথম খুব বিভ্রান্তি হয়। psql কে একটা Setting দিলেই সে NULL কে আলাদা করে
                দেখাতে শুরু করে। নিচের Output টা একটা PostgreSQL 18 Server এ আসলেই চালানো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, PostgreSQL 18",
          code: `island_tours=# SELECT customer_id, full_name, phone FROM customers WHERE customer_id IN (2, 3);
 customer_id |  full_name   |     phone
-------------+--------------+----------------
           2 | Nusrat Jahan | +8801000000102
           3 | Tanvir Ahmed |
(2 rows)

island_tours=# \\pset null '(null)'
Null display is "(null)".
island_tours=# SELECT customer_id, full_name, phone FROM customers WHERE customer_id IN (2, 3);
 customer_id |  full_name   |     phone
-------------+--------------+----------------
           2 | Nusrat Jahan | +8801000000102
           3 | Tanvir Ahmed | (null)
(2 rows)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL এর mysql Client NULL কে শুরু থেকেই বড় হাতের NULL লিখে দেখায়, আলাদা
              Setting লাগে না। আর PostgreSQL এ \pset null Setting টা Module 02 এর{" "}
              <Link href="/sql/topic/psql-basics" className={LINK}>
                psql লেসনে
              </Link>{" "}
              দেখা ~/.psqlrc ফাইলে লিখে রাখলে প্রতিবার আর লিখতে হয় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "where-nulls-live",
      subHeader: { index: "003", title: "Where NULLs Live" },
      title: <SectionTitle>Island Tours এ NULL থাকে কোথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সব Column এ NULL রাখা যায় না। Table বানানোর সময় একটা Column কে NOT NULL বলে
                দেওয়া যায়, মানে এই ঘর কখনো ফাঁকা থাকবে না। তখন NULL ঢোকাতে গেলে PostgreSQL
                নিজেই আটকে দেয়। Island Tours এর Database ডিজাইন করার সময় প্রায় সব Column কেই
                NOT NULL করা হয়েছে, কারণ একটা Booking এর তারিখ বা দাম না জানা থাকলে সেটা
                Booking ই না।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে NULL কোথায় কোথায় থাকতে পারে? PostgreSQL নিজেই বলে দিতে পারে। প্রতিটা
                Database এর ভেতরে information_schema নামে একটা জায়গা আছে, যেখানে সব Table আর
                Column এর বিবরণ রাখা। তার is_nullable ঘর বলে দেয় কোন Column এ NULL চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন Column এ NULL চলে, আর কতগুলো আছে"
              query={`SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND is_nullable = 'YES'
ORDER BY table_name, ordinal_position;

SELECT count(*) AS no_phone   FROM customers WHERE phone IS NULL;
SELECT count(*) AS no_guide   FROM tours     WHERE guide_id IS NULL;
SELECT count(*) AS no_comment FROM reviews   WHERE comment IS NULL;`}
              caption="আটটা Table এর সব Column মিলিয়ে মাত্র তিনটা Column এ NULL চলে: customers.phone, reviews.comment আর tours.guide_id। নিচের তিন লাইন গুনে বলে দেয় সেখানে কতগুলো NULL আছে: ৫, ১ আর ২। IS NULL এর মানে একটু পরেই পরিষ্কার হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই আটটা NULL ইচ্ছা করেই রাখা হয়েছে, যাতে আপনি শেখার সময়ই এই ফাঁদগুলোতে পা দেন
                আর চিনে রাখেন।{" "}
                <Link href="/sql/database" className={LINK}>
                  Island Tours Database এর পাতায়
                </Link>{" "}
                ইচ্ছা করে রাখা অদ্ভুত Data এর তালিকায় এদের নাম আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পাঁচজনের ফোন নেই:</strong> Tanvir Ahmed, Mitu Rahman, Priya Sharma,
                  Aiman Zulkifli আর Oliver Bennett। শেষের তিনজন দেশের বাইরের Customer।
                </ListItem>
                <ListItem>
                  <strong>একটা ট্যুরের Guide নেই:</strong> Ratargul Swamp Boat Day, tour_id 7।
                  ট্যুরটা চালু আছে, তারিখও আছে, শুধু Guide ঠিক হয়নি।
                </ListItem>
                <ListItem>
                  <strong>দুটো Review এ মন্তব্য নেই:</strong> review_id 4 আর 8। দুজনেই রেটিং
                  দিয়েছেন, একজন ৪ আর একজন ৫, কিন্তু কিছু লেখেননি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "NOT NULL একটা প্রতিশ্রুতি",
          content: (
            <ContentParagraph>
              কোনো Column এ NOT NULL থাকলে সেই Column নিয়ে আপনাকে NULL এর কথা ভাবতেই হয় না,
              কারণ Database নিজে কথা দিচ্ছে সেখানে কখনো ফাঁকা ঘর থাকবে না। তাই একটা অচেনা
              Database এ Query লেখার আগে প্রথম কাজ: কোন Column গুলো NULL নিতে পারে সেটা দেখে
              নেওয়া। psql এ \d customers লিখলে প্রতিটা Column এর পাশে not null লেখা থাকে কিনা
              দেখা যায়। NOT NULL নিজে বসানো শিখবেন Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "comparing-with-null",
      subHeader: { index: "004", title: "Comparing with NULL" },
      title: <SectionTitle>অজানার সাথে তুলনা করলে উত্তরও অজানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো মুখ বন্ধ খাম আপনার সামনে। দুটোতেই কিছু টাকা আছে, কত আছে কেউ জানে না।
                কেউ জিজ্ঞেস করল: দুই খামে কি সমান টাকা? সৎ উত্তর একটাই: জানি না। হ্যাঁ বললে
                আন্দাজ, না বললেও আন্দাজ।
              </ContentParagraph>
              <ContentParagraph>
                SQL ঠিক এই সৎ উত্তরটাই দেয়। NULL এর সাথে যেকোনো তুলনা, সমান, অসমান, বড় বা
                ছোট, যেটাই হোক, উত্তর আসে NULL। মানে, তুলনার উত্তর নিজেই অজানা। এমনকি দুটো
                NULL একে অপরের সমান কিনা, সেটাও অজানা, ঠিক দুই বন্ধ খামের মতো। নিজে চালিয়ে
                দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL এর সাথে চারটা তুলনা"
              query={`SELECT NULL = NULL  AS a,
       NULL <> NULL AS b,
       1 = NULL     AS c,
       NULL = 0     AS d;`}
              caption="চারটা ঘরেই NULL। একটাও t বা f না। NULL = NULL ও সত্য না, মিথ্যাও না, অজানা। এটা কোনো Bug না, SQL Standard ইচ্ছা করেই এভাবে বানানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের দ্বিতীয় Query টা আবার ভাবুন: WHERE phone = NULL। PostgreSQL ১৫
                জন Customer এর প্রত্যেকের জন্য phone = NULL হিসাব করে। যাঁর নম্বর আছে, তাঁর
                জন্য উত্তর অজানা, কারণ একটা জানা নম্বর আর একটা অজানার তুলনা। যাঁর নম্বর নেই,
                তাঁর জন্যও উত্তর অজানা, কারণ দুই অজানার তুলনা। কারো জন্যই উত্তর সত্য হয় না।
                তাই ফলাফল শূন্য Row, প্রতিবার, যেকোনো Table এ।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর অফিসিয়াল Docs এ এই কথাটা প্রায় সতর্কবার্তার মতো লেখা আছে: =
                NULL লিখবেন না, কারণ NULL নিজেই NULL এর সমান না। অজানা মান দুটো সমান কিনা,
                সেটা জানার উপায় নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মনে রাখার এক লাইন",
          content: (
            <ContentParagraph>
              NULL কে একটা মান ভাববেন না, ভাববেন একটা প্রশ্নবোধক চিহ্ন। প্রশ্নবোধক চিহ্নের
              সাথে যোগ, তুলনা, যা-ই করুন, উত্তরেও প্রশ্নবোধক চিহ্নই থাকবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "three-valued-logic",
      subHeader: { index: "005", title: "Three-valued Logic" },
      title: <SectionTitle>সত্য, মিথ্যা আর অজানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                স্কুলের যুক্তিবিদ্যায় একটা কথা হয় সত্য, নয়তো মিথ্যা। দুইটাই সম্ভাবনা, তাই
                একে বলে দুই মানের যুক্তি। SQL এর যুক্তিতে সম্ভাবনা তিনটা: TRUE, FALSE আর
                UNKNOWN। একে বলে Three-valued Logic, তিন মানের যুক্তি। আগের বক্সে যে NULL গুলো
                দেখলেন, ওগুলো আসলে এই তৃতীয় মান, UNKNOWN, যা SQL লেখে NULL হিসেবে।
              </ContentParagraph>
              <ContentParagraph>
                মজার প্রশ্ন আসে যখন শর্ত জোড়া লাগে। WHERE এ আপনি AND আর OR দিয়ে কয়েকটা শর্ত
                জোড়েন। এখন একটা শর্তের উত্তর যদি UNKNOWN হয় আর আরেকটার FALSE, তাহলে AND এর
                উত্তর কী? উত্তর পেতে একটা সুন্দর কৌশল আছে, যেটা আপনি নিজেই খাটাতে পারবেন:
                UNKNOWN এর জায়গায় একবার TRUE বসান, একবার FALSE বসান। দুইবারই একই উত্তর এলে
                সেটাই আসল উত্তর। দুইবার আলাদা এলে উত্তর UNKNOWN।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন UNKNOWN AND FALSE। UNKNOWN কে TRUE ধরলে TRUE AND FALSE, মানে FALSE। FALSE
                ধরলে FALSE AND FALSE, সেটাও FALSE। দুইবারই FALSE, তাই উত্তর FALSE। অজানা মানটা
                যা-ই হোক, একটা FALSE থাকলে AND কখনো সত্য হতে পারে না। আবার UNKNOWN AND TRUE:
                TRUE ধরলে TRUE, FALSE ধরলে FALSE। দুইবার দুই রকম, তাই উত্তর UNKNOWN। পুরো নিয়ম
                তিনটা টেবিলে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TruthTablesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টেবিল মুখস্থ করার দরকার নেই। নিচের ল্যাবে নিজে মান বেছে দেখুন, আর প্রতিবার
              খেয়াল করুন TRUE আর FALSE বসানোর কৌশলটা কীভাবে উত্তর বের করে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ThreeValuedLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার PostgreSQL কে দিয়েই প্রমাণ করিয়ে নিন। NULL::boolean মানে Boolean ধরনের
              একটা NULL, অর্থাৎ UNKNOWN। :: চিহ্ন দিয়ে এক ধরনের মানকে আরেক ধরনে বদলানো হয়,
              সেটা Module 04 এ বিস্তারিত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL এর রায়"
              query={`SELECT (NULL::boolean AND false) AS u_and_f,
       (NULL::boolean AND true)  AS u_and_t,
       (NULL::boolean OR  true)  AS u_or_t,
       (NULL::boolean OR  false) AS u_or_f,
       (NOT NULL::boolean)       AS not_u;`}
              caption="উত্তর আসবে f, NULL, t, NULL, NULL। ঠিক টেবিলের মতো: UNKNOWN AND FALSE হলো FALSE, UNKNOWN OR TRUE হলো TRUE, বাকি তিনটা অজানা। আর অজানার উল্টোও অজানা।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "how-where-decides",
      subHeader: { index: "006", title: "How WHERE Decides" },
      title: <SectionTitle>WHERE শুধু TRUE কে ঢুকতে দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার রহস্যের পুরো সমাধান। WHERE প্রতিটা Row এর জন্য শর্তটা হিসাব করে একটা রায়
                দেয়: TRUE, FALSE অথবা UNKNOWN। তারপর একটা কঠিন নিয়ম মানে: শুধু TRUE পাওয়া
                Row ফলাফলে যায়। FALSE বাদ, আর UNKNOWN ও বাদ। WHERE এর কাছে না জানা আর না
                একই জিনিস।
              </ContentParagraph>
              <ContentParagraph>
                তানিমের প্রথম Query তে শর্ত ছিল phone {"<>"} Rahim এর নম্বর। নম্বর আছে এমন ৯
                জনের জন্য উত্তর TRUE। Rahim নিজের জন্য FALSE। আর যে ৫ জনের নম্বর নেই, তাঁদের
                জন্য উত্তর UNKNOWN, কারণ অজানা নম্বরটা Rahim এর নম্বরের সমান কিনা কেউ জানে না।
                দরজায় শুধু ৯ জন ঢুকলেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereGateDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের ল্যাবে সেই ১৫ জন Customer এর তালিকা। একেকটা শর্ত বেছে নিয়ে দেখুন প্রত্যেকের
              জন্য WHERE কী রায় দেয়। বিশেষ করে প্রথম দুটো শর্ত পরপর চাপুন: একটা প্রশ্ন আর তার
              ঠিক উল্টো প্রশ্ন। দুটোর ফলাফল যোগ করলে ১৫ হওয়ার কথা, হয় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereVerdictLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই অঙ্কটা মনে রাখার মতো। দুই মানের পৃথিবীতে একটা প্রশ্ন আর তার উল্টো প্রশ্ন
                মিলে সবাইকে ধরে ফেলে: যাঁরা Rahim, আর যাঁরা Rahim না। তিন মানের পৃথিবীতে
                মাঝখানে একটা তৃতীয় দল থেকে যায়, যাঁদের ব্যাপারে কিছুই বলা যায় না। সংখ্যা
                দিয়ে মিলিয়ে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রশ্ন আর উল্টো প্রশ্ন মিলিয়ে কতজন"
              query={`SELECT count(*) AS is_rahim     FROM customers WHERE phone = '+8801000000101';
SELECT count(*) AS is_not_rahim FROM customers WHERE phone <> '+8801000000101';
SELECT count(*) AS no_phone     FROM customers WHERE phone IS NULL;
SELECT count(*) AS everyone     FROM customers;`}
              caption="১ আর ৯ মিলে ১০। বাকি ৫ জন আছেন তৃতীয় দলে, যাঁদের নম্বর নেই। ১ + ৯ + ৫ = ১৫, তবেই হিসাব মেলে। NULL নিতে পারে এমন Column এ শর্ত লিখলে এই তৃতীয় দলের কথা প্রতিবার নিজে ভাবতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের সবচেয়ে জরুরি বাক্য",
          content: (
            <ContentParagraph>
              WHERE শুধু সেই Row রাখে যার শর্ত নিশ্চিতভাবে TRUE। যে Column এ NULL থাকতে পারে,
              তার উপর লেখা প্রতিটা শর্তের তিনটা ফলাফল আছে, দুইটা না। Query লেখার সময় নিজেকে
              জিজ্ঞেস করুন: এই Column এ NULL থাকলে Row টা কোথায় যাবে, আর আমি কি সেটাই চাই?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "is-null",
      subHeader: { index: "007", title: "IS NULL" },
      title: <SectionTitle>NULL কে তার নাম ধরে ডাকুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                = দিয়ে NULL খোঁজা যায় না, তাই SQL এর জন্য আলাদা একটা প্রশ্ন রেখেছে: IS NULL।
                এটা তুলনা না, এটা একটা পরীক্ষা: এই ঘরটা কি ফাঁকা? আর এর সবচেয়ে বড় গুণ, IS NULL
                এর উত্তর কখনো অজানা হয় না। ঘরে মান থাকলে FALSE, না থাকলে TRUE, ব্যস।
              </ContentParagraph>
              <ContentParagraph>
                এর উল্টো IS NOT NULL, মানে ঘরে কোনো একটা মান আছে। দুটো মিলে সবসময় সব Row কে
                ধরে ফেলে, কারণ এখানে তৃতীয় কোনো দল নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন জায়গার NULL খুঁজে বের করা"
              query={`SELECT customer_id, full_name, city
FROM customers
WHERE phone IS NULL;

SELECT tour_id, title
FROM tours
WHERE guide_id IS NULL;

SELECT review_id, booking_id, rating
FROM reviews
WHERE comment IS NULL;`}
              caption="প্রথমটা দেবে নম্বরহীন সেই পাঁচজনকে, দ্বিতীয়টা Ratargul Swamp Boat Day, তৃতীয়টা review 4 আর 8। তানিমের WHERE phone = NULL যা পারেনি, IS NULL এক কথায় সেটা পারল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের আসল কাজটা ঠিক করা যায়। দরকার ছিল Rahim ছাড়া বাকি সবাই। যাঁদের
                নম্বর Rahim এর না, তাঁরা তো আছেনই, সাথে যোগ করতে হবে যাঁদের নম্বরই নেই। দুটো
                শর্ত OR দিয়ে জুড়ে দিলেই হয়: phone {"<>"} Rahim এর নম্বর OR phone IS NULL।
                নম্বরহীন একজনের জন্য প্রথম অংশ UNKNOWN, দ্বিতীয় অংশ TRUE, আর UNKNOWN OR TRUE
                হলো TRUE। তিনি ঢুকে পড়লেন।
              </ContentParagraph>
              <ContentParagraph>
                নিচের দুটো অনুশীলন এখন নিজে করুন। Check চাপলে আপনার Query আর একটা সঠিক উত্তর
                একই Database এ চলে, আর ফলাফল মিলিয়ে বলে দেয় ঠিক হলো কিনা। Column এর নাম বা
                Row এর ক্রম আলাদা হলেও সমস্যা নেই, ফলাফলটা মিললেই চলবে।
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
                  যেসব Customer এর ফোন নম্বর নেই, তাঁদের <code className={CODE}>full_name</code>{" "}
                  আর <code className={CODE}>city</code> বের করুন। এই দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  নম্বর নেই মানে phone ঘরটা ফাঁকা। ফাঁকা ঘর খোঁজার প্রশ্নটা ={" "}
                  দিয়ে হয় না, হয় <code className={CODE}>IS NULL</code> দিয়ে।
                </>
              }
              solution={`SELECT full_name, city
FROM customers
WHERE phone IS NULL;`}
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
                  তানিমের কাজটা ঠিক করে দিন: Rahim Uddin (ফোন +8801000000101) ছাড়া বাকি সব
                  Customer এর <code className={CODE}>full_name</code>। শর্তটা লিখবেন phone
                  Column দিয়েই, নাম দিয়ে না। ঠিক হলে ১৪টা Row আসবে।
                </>
              }
              hint={
                <>
                  দুই দলের কথা ভাবুন: যাঁদের নম্বর আছে কিন্তু Rahim এর না, আর যাঁদের নম্বরই
                  নেই। দুটো শর্ত <code className={CODE}>OR</code> দিয়ে জুড়ুন।
                </>
              }
              solution={`SELECT full_name
FROM customers
WHERE phone <> '+8801000000101'
   OR phone IS NULL;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ISNULL আর NOTNULL",
          content: (
            <ContentParagraph>
              PostgreSQL এর Docs এ IS NULL এর পাশে ISNULL আর NOTNULL নামে দুটো ছোট রূপও আছে,
              কাজ একই। কিন্তু Docs নিজেই বলে এগুলো Standard না, অন্য Database এ চলবে না। তাই
              সবসময় পুরো রূপটা লিখুন: IS NULL আর IS NOT NULL। MySQL এও এই দুটো হুবহু একই
              অর্থে চলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "is-distinct-from",
      subHeader: { index: "008", title: "IS DISTINCT FROM" },
      title: <SectionTitle>NULL কে সাধারণ মানের মতো তুলনা করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Exercise 2 এর সমাধানে দুটো শর্ত লাগল। এমন প্রশ্ন এত ঘন ঘন আসে যে SQL একটা
                আলাদা তুলনাই বানিয়ে রেখেছে, যেটা NULL কে অজানা না ভেবে একটা সাধারণ মানের মতো
                দেখে: IS DISTINCT FROM, মানে আলাদা কিনা।
              </ContentParagraph>
              <ContentParagraph>
                a IS DISTINCT FROM b এর উত্তর কখনো UNKNOWN হয় না। দুই পাশে দুটো আলাদা মান হলে
                TRUE। একই মান হলে FALSE। একপাশে NULL আর অন্যপাশে মান থাকলে TRUE, কারণ ফাঁকা
                ঘর আর একটা নম্বর অবশ্যই আলাদা জিনিস। দুই পাশেই NULL হলে FALSE, কারণ দুটোই
                ফাঁকা, আলাদা কিছু না। এর উল্টো IS NOT DISTINCT FROM, মানে NULL কে মাথায় রেখে
                সমান কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["তুলনা", "a <> b", "a IS DISTINCT FROM b"],
          rows: [
            ["1 আর 2", "TRUE", "TRUE"],
            ["1 আর 1", "FALSE", "FALSE"],
            ["1 আর NULL", "NULL (অজানা)", "TRUE"],
            ["NULL আর NULL", "NULL (অজানা)", "FALSE"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টেবিলের নিচের দুই লাইনেই পার্থক্য। Island Tours এর Data তে দেখুন: Jamal Hossain
              (guide_id 1) দুটো ট্যুর চালান। অপারেশন টিম জানতে চায় কোন ট্যুরগুলো Jamal এর না।
              দুইভাবে প্রশ্নটা করে ফলাফল মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Jamal এর না এমন ট্যুর, দুইভাবে"
              query={`SELECT tour_id, title, guide_id
FROM tours
WHERE guide_id <> 1;

SELECT tour_id, title, guide_id
FROM tours
WHERE guide_id IS DISTINCT FROM 1;

SELECT tour_id, title
FROM tours
WHERE guide_id IS NOT DISTINCT FROM NULL;`}
              caption="প্রথমটা ৬টা ট্যুর দেয়, দ্বিতীয়টা ৭টা। বাড়তি ট্যুরটা Ratargul Swamp Boat Day, যার Guide নেই। তার Guide অবশ্যই Jamal না, অথচ <> তাকে বাদ দিয়েছে। তৃতীয়টা দেখায় IS NOT DISTINCT FROM NULL আসলে IS NULL এর মতোই কাজ করে।"
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
                  যেসব ট্যুরের Guide Shirin Akter (<code className={CODE}>guide_id</code> 2) না,
                  Guide না থাকা ট্যুরসহ, তাদের <code className={CODE}>tour_id</code> আর{" "}
                  <code className={CODE}>title</code>। একটা শর্তেই লিখে দেখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>guide_id {"<>"} 2</code> লিখলে Guide ছাড়া ট্যুরটা হারিয়ে
                  যাবে। NULL কে সাধারণ মান ধরে তুলনা করে কোন Operator?
                </>
              }
              solution={`SELECT tour_id, title
FROM tours
WHERE guide_id IS DISTINCT FROM 2;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কখন কোনটা? যখন প্রশ্নের মানেই হলো ফাঁকা ঘরও আলাদা গণ্য হবে, যেমন Rahim ছাড়া
              সবাই বা Jamal এর না এমন সব ট্যুর, তখন IS DISTINCT FROM পরিষ্কার আর নিরাপদ। যখন
              আপনি সত্যিই শুধু জানা মানের মধ্যে খুঁজছেন, যেমন যাঁদের নম্বর আছে আর সেটা Rahim
              এর না, তখন সাধারণ {"<>"} ই ঠিক, কারণ সে নিজে থেকেই ফাঁকা ঘর বাদ দেয়। ভুলটা হয় তখনই,
              যখন আপনি কোনটা চান সেটা না ভেবে লিখে ফেলেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ: <=> Operator",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                MySQL 8.4 IS DISTINCT FROM চেনে না। একই কাজের জন্য তার নিজস্ব একটা Operator
                আছে, {"<=>"}, যার নাম NULL-safe equal। এটা NULL কে মান হিসেবে ধরে সমান কিনা বলে,
                তাই PostgreSQL এর IS NOT DISTINCT FROM এর মতো। আলাদা কিনা জানতে সামনে NOT বসান।
                নিচের Output টা MySQL 8.4.11 এ চালানো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, MySQL 8.4",
          code: `mysql> SELECT NULL = NULL AS a, NULL <=> NULL AS null_safe, 1 <=> NULL AS one_vs_null;
+------+-----------+-------------+
| a    | null_safe | one_vs_null |
+------+-----------+-------------+
| NULL |         1 |           0 |
+------+-----------+-------------+

mysql> SELECT tour_id FROM tours WHERE guide_id IS DISTINCT FROM 1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near
'DISTINCT FROM 1' at line 1

mysql> SELECT tour_id, title FROM tours WHERE NOT (guide_id <=> 1);
-- ৭টা Row, Ratargul Swamp Boat Day সহ`,
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "arithmetic-and-text",
      subHeader: { index: "009", title: "Arithmetic and Text" },
      title: <SectionTitle>NULL যেখানে ছোঁয়, সেখানে NULL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তুলনার মতো হিসাবেও একই নিয়ম। বারো হাজার পাঁচশো টাকার সাথে একটা অজানা অঙ্ক
                যোগ করলে উত্তর কত? অজানা। একটা অজানা সংখ্যার দ্বিগুণ কত? অজানা। যোগ, বিয়োগ,
                গুণ, ভাগ, যেকোনো Operator এর একপাশে NULL থাকলে উত্তর NULL। NULL এভাবে পুরো
                হিসাবে ছড়িয়ে পড়ে, তাই অনেকে একে বলেন NULL এর সংক্রমণ।
              </ContentParagraph>
              <ContentParagraph>
                লেখা জোড়ার ক্ষেত্রেও তাই। PostgreSQL এ দুটো লেখা জোড়া হয় || দিয়ে, যেমন
                &apos;Rahim&apos; || &apos; Uddin&apos;। কিন্তু একপাশে NULL থাকলে পুরো লেখাটাই
                NULL হয়ে যায়। এর সমাধানে PostgreSQL এ দুটো Function আছে, যারা ইচ্ছা করে NULL
                কে বাদ দিয়ে বাকিটা জোড়ে: concat আর concat_ws। concat_ws এর ws মানে with
                separator, প্রথম যে লেখাটা দেবেন সেটা প্রতিটা অংশের মাঝে বসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullSpreadDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হিসাবে আর লেখায় NULL"
              query={`SELECT 12500 + NULL                       AS plus,
       NULL * 2                            AS times,
       'Rahim' || NULL                     AS glued,
       concat('Rahim', NULL)               AS concat_fn,
       concat_ws(' ', 'Rahim', NULL, 'Uddin') AS concat_ws_fn;`}
              caption="প্রথম তিনটা NULL, শেষ দুটো আসল লেখা: Rahim আর Rahim Uddin। concat_ws মাঝের NULL টা ফেলে দিয়ে বাকি দুটো শব্দ একটা ফাঁকা জায়গা দিয়ে জুড়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বাস্তবে এটা কোথায় লাগে? Customer এর জন্য একটা যোগাযোগের লাইন বানাতে চান, নাম আর
              ফোন জুড়ে। full_name || &apos;: &apos; || phone লিখলে নম্বরহীন পাঁচজনের পুরো লাইনটাই
              NULL হয়ে যাবে, নামটা পর্যন্ত হারিয়ে যাবে। concat_ws দিলে তাঁদের লাইনে অন্তত নামটা
              থাকবে।
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
                  প্রতিটা Customer এর জন্য একটা Column বানান, যেখানে নাম আর ফোন কোলন দিয়ে জোড়া,
                  যেমন <code className={CODE}>Rahim Uddin: +8801000000101</code>। যাঁর ফোন নেই, তাঁর
                  লাইনে শুধু নামটা থাকবে, কোলন ছাড়া, যেমন{" "}
                  <code className={CODE}>Tanvir Ahmed</code>। ১৫টা Row, একটাই Column।
                </>
              }
              hint={
                <>
                  || দিলে নম্বরহীনদের লাইন পুরো NULL হয়ে যায়। যে Function NULL বাদ দিয়ে, মাঝে
                  একটা নির্দিষ্ট লেখা বসিয়ে জোড়ে, সেটা খুঁজুন। আলাদা করার লেখাটা হবে{" "}
                  <code className={CODE}>{"': '"}</code>।
                </>
              }
              solution={`SELECT concat_ws(': ', full_name, phone) AS contact_line
FROM customers;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ CONCAT আলাদা",
          content: (
            <ContentParagraph>
              এখানে দুই Database এর আচরণ উল্টো, তাই সাবধান। MySQL এর CONCAT এ কোনো একটা অংশ
              NULL হলে পুরো উত্তর NULL, PostgreSQL এর concat এর মতো NULL বাদ দেয় না। MySQL 8.4
              এ CONCAT(&apos;Rahim&apos;, NULL) চালালে আসে NULL। তবে CONCAT_WS দুই জায়গাতেই NULL
              বাদ দেয়, MySQL এ CONCAT_WS(&apos; &apos;, &apos;Rahim&apos;, NULL, &apos;Uddin&apos;)
              দেয় Rahim Uddin। আর মনে রাখবেন, MySQL এ || লেখা জোড়ে না, Module 01 এর Lesson 05
              এ দেখেছেন সেটা সেখানে OR।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "is-true",
      subHeader: { index: "010", title: "IS TRUE and Friends" },
      title: <SectionTitle>যে Boolean নিজেও অজানা হতে পারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                tours Table এর is_active Column টা Boolean, হ্যাঁ বা না। Island Tours এর ডিজাইনে
                এটা NOT NULL, তাই সেখানে তৃতীয় সম্ভাবনা নেই, WHERE is_active লিখলেই নিশ্চিন্ত।
                কিন্তু ধরুন কোনো একদিন customers Table এ wants_sms নামে একটা Column যোগ হলো, যার
                মানে Customer SMS চান কিনা। পুরনো Customer দের কেউ জিজ্ঞেসই করেনি, তাই তাঁদের ঘরে
                NULL। এখন সমস্যা: WHERE NOT wants_sms লিখলে যাঁরা স্পষ্ট না বলেছেন তাঁরা আসবেন,
                কিন্তু যাঁদের জিজ্ঞেস করা হয়নি তাঁরা আসবেন না, কারণ NOT UNKNOWN ও UNKNOWN।
              </ContentParagraph>
              <ContentParagraph>
                এমন Boolean এর জন্য SQL এ ছয়টা পরীক্ষা আছে, যাদের উত্তর কখনো অজানা হয় না: IS
                TRUE, IS NOT TRUE, IS FALSE, IS NOT FALSE, IS UNKNOWN আর IS NOT UNKNOWN। IS NOT
                TRUE মানে FALSE অথবা অজানা, দুটোই। ঠিক এই পার্থক্যটাই NOT এর সাথে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অজানা Boolean এর ছয় পরীক্ষার পাঁচটা"
              query={`SELECT NULL::boolean IS TRUE     AS is_true,
       NULL::boolean IS NOT TRUE AS is_not_true,
       NULL::boolean IS UNKNOWN  AS is_unknown,
       NULL::boolean IS FALSE    AS is_false,
       false IS NOT TRUE         AS f_not_true;`}
              caption="উত্তর f, t, t, f, t। খেয়াল করুন, একটাও NULL না। অজানা মান TRUE না, তাই IS TRUE মিথ্যা। আবার সে নিশ্চিতভাবে TRUE না, তাই IS NOT TRUE সত্য। শেষেরটা দেখায় সাধারণ false ও IS NOT TRUE এর পরীক্ষায় পাশ করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["আপনি যা চান", "লিখবেন", "অজানা Row কোথায় যায়"],
          rows: [
            ["শুধু যাঁরা স্পষ্ট হ্যাঁ বলেছেন", "WHERE wants_sms (বা IS TRUE)", "বাদ"],
            ["শুধু যাঁরা স্পষ্ট না বলেছেন", "WHERE wants_sms IS FALSE", "বাদ"],
            ["যাঁরা না বলেননি, মানে হ্যাঁ বা অজানা", "WHERE wants_sms IS NOT FALSE", "থাকে"],
            ["যাঁদের জিজ্ঞেসই করা হয়নি", "WHERE wants_sms IS UNKNOWN", "শুধু এরাই"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL 8.4 ও IS TRUE, IS NOT TRUE আর IS UNKNOWN চেনে, শুধু উত্তর দেখায় 1 আর 0
              দিয়ে, t আর f দিয়ে না। একই পরীক্ষায় MySQL দিয়েছে 0, 1, 1, অর্থাৎ PostgreSQL এর
              মতোই রায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "null-elsewhere",
      subHeader: { index: "011", title: "NULL Elsewhere" },
      title: <SectionTitle>সামনের লেসনগুলোতে NULL আবার আসবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NULL শুধু WHERE এর সমস্যা না। SQL এর প্রায় প্রতিটা অংশ NULL এর সাথে নিজের মতো
                করে আচরণ করে। সেগুলোর প্রতিটা নিজের লেসনে বিস্তারিত আসবে, এখানে শুধু একবার দেখে
                রাখুন, যাতে সামনে দেখা হলে চেনা মনে হয়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সাজানো:</strong> PostgreSQL ছোট থেকে বড় সাজালে NULL রাখে সবার শেষে।
                  ঠিক পরের লেসন{" "}
                  <Link href="/sql/topic/order-by" className={LINK}>
                    ORDER BY
                  </Link>{" "}
                  তে এটা কীভাবে বদলাবেন আর MySQL এর আচরণ কী, সব আছে।
                </ListItem>
                <ListItem>
                  <strong>DISTINCT:</strong> আলাদা আলাদা মান বের করার সময় সব NULL মিলে একটাই
                  মান গণ্য হয়।{" "}
                  <Link href="/sql/topic/distinct" className={LINK}>
                    DISTINCT
                  </Link>{" "}
                  লেসনে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>গোনা:</strong> count(*) সব Row গোনে, কিন্তু count(phone) গোনে শুধু
                  যেখানে phone NULL না। Module 05 এর বিষয়।
                </ListItem>
                <ListItem>
                  <strong>NOT IN:</strong> তালিকার ভেতরে একটা NULL থাকলে NOT IN একটা Row ও
                  ফেরত দেয় না। Module 07 এর সবচেয়ে বিখ্যাত ফাঁদ।
                </ListItem>
                <ListItem>
                  <strong>COALESCE:</strong> NULL এর জায়গায় একটা বিকল্প মান বসানোর Function,
                  যেমন ফোন না থাকলে লেখা দেখানো। Module 04 এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সামনের পাঁচ লেসনের এক ঝলক"
              query={`SELECT customer_id, full_name, phone
FROM customers
WHERE customer_id IN (1, 3, 15)
ORDER BY phone;

SELECT DISTINCT phone FROM customers;

SELECT count(*) AS all_rows, count(phone) AS with_phone
FROM customers;

SELECT title FROM tours WHERE guide_id NOT IN (1, NULL);

SELECT full_name, COALESCE(phone, 'no phone') AS phone
FROM customers
WHERE customer_id IN (2, 3);`}
              caption="প্রথমটায় Tanvir এর NULL সবার শেষে। দ্বিতীয়টায় ১১টা Row, দশটা নম্বর আর একটা NULL। তৃতীয়টায় ১৫ আর ১০। চতুর্থটায় শূন্য Row, অথচ Jamal এর না এমন সাতটা ট্যুর আছে। পঞ্চমটায় Tanvir এর ফোনের জায়গায় no phone। এখন শুধু দেখে রাখুন, কারণগুলো নিজ নিজ লেসনে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "designing-with-null",
      subHeader: { index: "012", title: "Designing With NULL" },
      title: <SectionTitle>কোন ঘর ফাঁকা থাকতে পারবে, সেটা একটা সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ আপনি NULL পড়েছেন। কিন্তু Table কে NULL নিতে দেওয়া বা না দেওয়া একটা
                ডিজাইনের সিদ্ধান্ত, আর এই সিদ্ধান্ত পরে প্রতিটা Query কে প্রভাবিত করে। নিয়মটা
                সহজ: একটা ঘর তখনই ফাঁকা থাকতে দিন, যখন সত্যিই মানটা ঐচ্ছিক, প্রযোজ্য না, বা
                পরে আসবে। আর যদি একটা ভালো Default থাকে, ফাঁকা না রেখে সেটা বসান।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর ডিজাইনে প্রতিটা Column নিয়ে এই প্রশ্নটা করা হয়েছিল। কয়েকটা
                সিদ্ধান্ত আর তার কারণ:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Column", "NULL চলে?", "কারণ"],
          rows: [
            ["customers.email", "না", "Login আর যোগাযোগের মূল পথ, ছাড়া Account হয় না"],
            ["customers.phone", "হ্যাঁ", "ঐচ্ছিক, অনেকে দিতে চান না, বিদেশি নম্বর থাকতেই পারে"],
            ["customers.country", "না, Default Bangladesh", "প্রায় সবাই দেশের, তাই ফাঁকা না রেখে একটা Default"],
            ["tours.guide_id", "হ্যাঁ", "নতুন ট্যুরে Guide পরে ঠিক হয়"],
            ["tours.price_bdt", "না", "দাম ছাড়া ট্যুর বিক্রিই হয় না"],
            ["bookings.status", "না", "প্রতিটা Booking এর একটা অবস্থা থাকতেই হবে"],
            ["reviews.comment", "হ্যাঁ", "রেটিং দেওয়া বাধ্যতামূলক, লেখা ঐচ্ছিক"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পুরনো কিন্তু ক্ষতিকর অভ্যাস হলো NULL এর বদলে নকল মান বসানো: ফোনের জায়গায়
                N/A, দামের জায়গায় 0, জন্মতারিখের জায়গায় 1900-01-01। এগুলো দেখতে নিরীহ, কিন্তু
                মিথ্যা বলে। 0 টাকার একটা ট্যুর গড় দাম কমিয়ে দেয়, N/A লেখা ফোন নম্বরের দিকে SMS
                চলে যায়, আর ১৯০০ সালের জন্মদিনে Customer দের বয়স হয়ে যায় একশো পঁচিশ। NULL
                অন্তত সৎভাবে বলে আমি জানি না, আর SQL এর গোনা, গড় আর তুলনা সেই অনুযায়ী আচরণ
                করে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা সিদ্ধান্ত: একই Column এ NULL আর খালি লেখা দুটোই রাখবেন না। reviews.comment
                এ মন্তব্য নেই বোঝাতে যদি কোথাও NULL আর কোথাও খালি লেখা থাকে, তাহলে মন্তব্যহীন
                Review খুঁজতে প্রতিবার দুটো শর্ত লাগবে, আর কেউ একদিন একটা ভুলে যাবেন। একটা অর্থ,
                একটা রূপ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নকল মান NULL এর চেয়ে খারাপ",
          content: (
            <ContentParagraph>
              NULL এর ঝামেলা দেখে মনে হতে পারে সব জায়গায় একটা নকল মান বসিয়ে দিলেই শান্তি।
              উল্টোটা সত্যি। NULL এর নিয়ম শিখলে সে প্রতিবার একইভাবে আচরণ করে। নকল মানের কোনো
              নিয়ম নেই, প্রতিটা Query তে মনে রাখতে হয় কোন Column এ কোন নকল মান কী বোঝায়। Table
              নিজে বানানো আর NOT NULL ও Default বসানো শিখবেন Module 09 এ, আর পুরো ডিজাইনের ভাবনা
              Module 11 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "practice",
      subHeader: { index: "013", title: "Practice" },
      title: <SectionTitle>নিজের হাতে তিনটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তিনটা অনুশীলন, শেষেরটা একটু কঠিন। প্রতিটায় আগে নিজে ভাবুন NULL থাকা Row গুলো
              কোথায় যাওয়ার কথা, তারপর লিখুন। আটকে গেলে Hint দেখুন, তারপরও আটকে গেলে Solution।
              Solution দেখে নিজে আবার টাইপ করে চালান, শুধু পড়ে গেলে হাতে বসে না।
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
                  Website এ শুধু সেই Review গুলো দেখানো হবে যেগুলোতে মন্তব্য লেখা আছে। এমন সব
                  Review এর <code className={CODE}>review_id</code> আর{" "}
                  <code className={CODE}>rating</code> বের করুন।
                </>
              }
              hint={
                <>
                  মন্তব্য আছে মানে comment ঘরে কোনো একটা মান আছে। IS NULL এর উল্টোটা কী?
                </>
              }
              solution={`SELECT review_id, rating
FROM reviews
WHERE comment IS NOT NULL;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  মৌসুম শুরুর আগে অপারেশন টিম জানতে চায়: কোন কোন ট্যুর এখন বিক্রি হচ্ছে (
                  <code className={CODE}>is_active</code> সত্য) কিন্তু তার Guide এখনো ঠিক হয়নি?{" "}
                  <code className={CODE}>tour_id</code> আর <code className={CODE}>title</code>।
                </>
              }
              hint={
                <>
                  দুটো শর্ত, দুটোই সত্য হতে হবে, তাই AND। is_active NOT NULL, তাই সেটা সোজা লেখা
                  যায়। Guide এর অংশে = NULL লিখবেন না।
                </>
              }
              solution={`SELECT tour_id, title
FROM tours
WHERE is_active
  AND guide_id IS NULL;`}
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
                  Island Tours বিদেশি Customer দের জন্য একটা WhatsApp গ্রুপ খুলতে চায়, কিন্তু
                  কয়েকজনের নম্বর নেই। বাংলাদেশের বাইরের যেসব Customer এর ফোন নম্বর নেই, তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>country</code>{" "}
                  বের করুন, যাতে Support তাঁদের Email এ নম্বর চাইতে পারে।
                </>
              }
              hint={
                <>
                  বাইরের মানে country Bangladesh এর সমান না। country Column এ কি NULL থাকতে পারে?
                  উত্তরটা এই লেসনের তৃতীয় Section এ আছে, আর সেটাই বলে দেবে {"<>"} এখানে নিরাপদ
                  কিনা।
                </>
              }
              solution={`SELECT full_name, country
FROM customers
WHERE country <> 'Bangladesh'
  AND phone IS NULL;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Challenge এর পেছনের চিন্তা",
          content: (
            <ContentParagraph>
              country {"<>"} &apos;Bangladesh&apos; এখানে নিরাপদ, কারণ country Column NOT NULL, তাই
              সেখানে UNKNOWN জন্মানোর সুযোগই নেই। একই শর্ত phone এর উপর লিখলে নিরাপদ হতো না।
              অচেনা Database এ প্রতিটা {"<>"} লেখার আগে এই এক সেকেন্ডের প্রশ্নটা করার অভ্যাস করুন:
              এই Column এ কি NULL থাকতে পারে?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর তিনটা কাজে NULL</SectionTitle>,
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
                একটা চালু ব্যবসায় NULL কোনো তাত্ত্বিক বিষয় না, প্রতি সপ্তাহের কাজে সে সামনে
                আসে। Island Tours এর তিনটা বাস্তব কাজ দেখুন, প্রতিটায় NULL ভুল সামলালে কী হতো আর
                ঠিক সামলালে কী হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Newsletter এর তালিকা:</strong> লেসনের শুরুর গল্প। ভুল Query তে ৫ জন
                  চুপচাপ বাদ পড়তেন। সঠিক Query তে phone {"<>"} নম্বর OR phone IS NULL, অথবা phone
                  IS DISTINCT FROM নম্বর, আর তালিকায় ঠিক ১৪ জন। পরীক্ষার কৌশল: মোট সংখ্যা থেকে
                  যাঁদের বাদ দেওয়ার কথা তাঁদের বিয়োগ করে মিলিয়ে নেওয়া।
                </ListItem>
                <ListItem>
                  <strong>Guide বণ্টনের Report:</strong> প্রতি মৌসুমের আগে অপারেশন টিম একটা
                  তালিকা চায়, কোন চালু ট্যুরের Guide নেই। এখানে IS NULL ই প্রশ্নের মূল, আর আজ
                  উত্তর Ratargul Swamp Boat Day। এই Report না থাকলে একদিন একদল পর্যটক Guide ছাড়াই
                  নৌকায় বসে থাকতেন।
                </ListItem>
                <ListItem>
                  <strong>Website এর Review অংশ:</strong> Frontend টিম শুধু মন্তব্যসহ Review দেখায়,
                  যাতে ফাঁকা উদ্ধৃতি চিহ্নের বাক্স না আসে। Query তে comment IS NOT NULL। আর গড়
                  রেটিং হিসাবে সব Review ই গোনা হয়, মন্তব্য থাক বা না থাক, কারণ rating Column এ
                  কোনো NULL নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের my-tours Project এ এখন একটা কাজ: যেসব Column এ NULL চলে সেগুলোর
                একটা তালিকা বানান, আর প্রতিটার পাশে এক লাইনে লিখুন NULL সেখানে কী বোঝায়, অজানা,
                প্রযোজ্য না, নাকি এখনো ঠিক হয়নি। এই তালিকাটা পরে প্রতিটা Query লেখার সময় কাজে
                লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Row এর উপর WHERE এর হিসাব, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query টা হলো SELECT full_name FROM customers WHERE phone {"<>"}{" "}
              &apos;+8801000000101&apos; OR phone IS NULL। PostgreSQL Tanvir Ahmed এর Row টার
              উপর, যাঁর ফোন NULL, ঠিক এই ক্রমে কাজ করে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Row পড়া",
              description:
                "customers Table থেকে customer_id 3 এর Row আসে। full_name Tanvir Ahmed, phone ফাঁকা, মানে NULL।",
            },
            {
              title: "প্রথম অংশের হিসাব",
              description:
                "phone <> '+8801000000101'। একপাশে অজানা, তাই তুলনার উত্তর UNKNOWN। দুই মানের যুক্তি হলে এখানেই সব শেষ হয়ে যেত।",
            },
            {
              title: "দ্বিতীয় অংশের হিসাব",
              description:
                "phone IS NULL। এটা পরীক্ষা, তুলনা না। ঘর ফাঁকা, তাই উত্তর নিশ্চিতভাবে TRUE। IS NULL কখনো UNKNOWN দেয় না।",
            },
            {
              title: "OR দিয়ে জোড়া",
              description:
                "UNKNOWN OR TRUE। কৌশল খাটান: UNKNOWN কে TRUE ধরলে TRUE, FALSE ধরলে ও TRUE। দুইবারই TRUE, তাই পুরো শর্ত TRUE।",
            },
            {
              title: "দরজার রায়",
              description:
                "WHERE এর কাছে শর্ত নিশ্চিতভাবে TRUE, তাই Tanvir এর Row ফলাফলে যায়। শুধু প্রথম অংশ থাকলে UNKNOWN হতো, আর তিনি বাদ পড়তেন।",
            },
            {
              title: "Rahim এর Row এর সাথে তুলনা",
              description:
                "Rahim এর Row তে প্রথম অংশ FALSE, কারণ নম্বর হুবহু মেলে। দ্বিতীয় অংশও FALSE, কারণ ঘর ফাঁকা না। FALSE OR FALSE হলো FALSE, Rahim বাদ। ঠিক যা চাওয়া হয়েছিল।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>NULL এর ছয়টা চেনা ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "সঠিক উপায়"],
          rows: [
            [
              "WHERE phone = NULL",
              "কোনো Error নেই, সবসময় শূন্য Row",
              "WHERE phone IS NULL",
            ],
            [
              "WHERE phone <> 'X' দিয়ে বাকি সবাইকে খোঁজা",
              "NULL থাকা Row চুপচাপ বাদ পড়ে",
              "phone <> 'X' OR phone IS NULL, অথবা phone IS DISTINCT FROM 'X'",
            ],
            [
              "NULL আর খালি লেখাকে এক ভাবা",
              "IS NULL খালি লেখা খুঁজে পায় না, = '' NULL খুঁজে পায় না",
              "Column এ একটাই অর্থ রাখুন, সাধারণত NULL",
            ],
            [
              "নাম আর ফোন || দিয়ে জোড়া",
              "ফোন না থাকলে পুরো লাইন NULL, নামও হারায়",
              "concat_ws(': ', full_name, phone)",
            ],
            [
              "NULL এর বদলে 0, N/A বা 1900-01-01 বসানো",
              "গড়, গোনা আর তুলনা ভুল হয়, আর কেউ টের পায় না",
              "সত্যিই অজানা হলে NULL, ভালো Default থাকলে সেটা",
            ],
            [
              "psql এ ফাঁকা ঘর দেখে খালি লেখা ভাবা",
              "NULL কে খালি লেখা ভেবে ভুল Query লেখা",
              "\\pset null '(null)' দিয়ে NULL কে আলাদা করে দেখা",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "transform_null_equals এর লোভ",
          content: (
            <ContentParagraph>
              PostgreSQL এর একটা Setting আছে, transform_null_equals, যেটা চালু করলে = NULL লেখাকে
              নিজে থেকে IS NULL এ বদলে দেয়। পুরনো কিছু Software এর জন্য এটা রাখা। কিন্তু Docs
              নিজেই জোর দিয়ে বলে, এটা চালু না করে বরং Query গুলো SQL Standard মেনে ঠিক করুন।
              কারণটা সহজ: আপনার Query তখন অন্য কোনো Database এ, এমনকি এই Setting ছাড়া অন্য একটা
              PostgreSQL এও, ভুল উত্তর দেবে।
            </ContentParagraph>
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
                    href="https://www.postgresql.org/docs/current/functions-comparison.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Comparison Functions and Operators
                  </a>
                  : IS NULL, IS DISTINCT FROM আর IS TRUE এর অফিসিয়াল বর্ণনা, আর = NULL না লেখার
                  সেই সতর্কবার্তা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-logical.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Logical Operators
                  </a>
                  : AND, OR আর NOT এর তিন মানের সত্য সারণি, এই লেসনের টেবিলের মূল উৎস।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-string.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: String Functions
                  </a>
                  : concat আর concat_ws কীভাবে NULL বাদ দেয়, আর || কেন দেয় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/working-with-null.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Working with NULL Values
                  </a>{" "}
                  আর{" "}
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Comparison Operators
                  </a>
                  : MySQL এর দৃষ্টিতে NULL, আর {"<=>"} Operator এর বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Null_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Null (SQL)
                  </a>
                  : NULL এর ইতিহাস, তিন মানের যুক্তি নিয়ে বিতর্ক, আর বিভিন্ন Database এর আচরণের
                  তুলনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : এটা MySQL দিয়ে শেখানো, তাই NULL দেখানো হবে বড় হাতের NULL লিখে, আর CONCAT
                  এর আচরণ এই লেসনের MySQL বাক্সের মতো হবে।
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
                  NULL কোনো মান না, একটা চিরকুট: জানা নেই। শূন্য আর খালি লেখা দুটোই জানা মান,
                  NULL না।
                </ListItem>
                <ListItem>
                  NULL আসে তিন কারণে: মান অজানা, প্রযোজ্য না, বা এখনো ঠিক হয়নি। SQL তিনটাকে একই
                  NULL দিয়ে লেখে।
                </ListItem>
                <ListItem>
                  NULL এর সাথে যেকোনো তুলনার উত্তর NULL, এমনকি NULL = NULL ও। তাই = NULL কখনো
                  কাজ করে না।
                </ListItem>
                <ListItem>
                  SQL এর যুক্তিতে তিনটা মান: TRUE, FALSE, UNKNOWN। অজানা মানে একবার TRUE আর
                  একবার FALSE বসিয়ে দেখুন, মিললে সেটাই উত্তর, না মিললে UNKNOWN।
                </ListItem>
                <ListItem>
                  WHERE শুধু TRUE রাখে। FALSE আর UNKNOWN দুটোই বাদ। তাই একটা প্রশ্ন আর তার উল্টো
                  প্রশ্ন মিলে সব Row পাওয়া যায় না।
                </ListItem>
                <ListItem>
                  ফাঁকা ঘর খুঁজতে IS NULL, মান আছে এমন ঘর খুঁজতে IS NOT NULL। এদের উত্তর কখনো
                  অজানা হয় না।
                </ListItem>
                <ListItem>
                  IS DISTINCT FROM NULL কে সাধারণ মান ধরে তুলনা করে। MySQL এ এর জায়গায় {"<=>"}।
                </ListItem>
                <ListItem>
                  হিসাবে বা || দিয়ে জোড়ায় NULL ছড়িয়ে পড়ে। PostgreSQL এর concat আর concat_ws NULL
                  বাদ দেয়, MySQL এর CONCAT দেয় না।
                </ListItem>
                <ListItem>
                  NULL নিতে পারে এমন Boolean এর জন্য IS TRUE, IS NOT FALSE, IS UNKNOWN এর মতো
                  পরীক্ষা।
                </ListItem>
                <ListItem>
                  ডিজাইনে NULL তখনই, যখন মান সত্যিই অজানা বা ঐচ্ছিক। নকল মান বসানো NULL এর চেয়েও
                  ক্ষতিকর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসন{" "}
                <Link href="/sql/topic/order-by" className={LINK}>
                  ORDER BY
                </Link>
                । এতক্ষণ যে Row গুলো পেয়েছেন সেগুলো এসেছে যেকোনো ক্রমে। এবার সেগুলো নিজের
                ইচ্ছামতো সাজাবেন, দামের ক্রমে, তারিখের ক্রমে, কয়েকটা Column মিলিয়ে। আর সেখানে NULL
                আবার আসবে একটা প্রশ্ন নিয়ে: যে মান অজানা, সে সারির শুরুতে বসবে না শেষে?
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
      ["NULL", "জানা নেই, কোনো মান না", "customers.phone এর পাঁচটা ফাঁকা ঘর"],
      ["শূন্য আর খালি লেখা", "দুটোই জানা মান, NULL না", "SELECT 0 IS NULL, '' IS NULL"],
      ["NULL এর তিন কারণ", "অজানা, প্রযোজ্য না, এখনো ঠিক হয়নি", "phone, comment, guide_id"],
      ["NULL এর সাথে তুলনা", "উত্তর NULL, এমনকি NULL = NULL ও", "SELECT NULL = NULL"],
      ["Three-valued Logic", "TRUE, FALSE, UNKNOWN", "UNKNOWN AND FALSE = FALSE"],
      ["WHERE এর নিয়ম", "শুধু TRUE রাখে, UNKNOWN বাদ", "phone <> X দেয় ৯ জন, ১৪ না"],
      ["IS NULL / IS NOT NULL", "ফাঁকা কিনা, উত্তর কখনো অজানা না", "WHERE guide_id IS NULL"],
      ["IS DISTINCT FROM", "NULL কে মান ধরে আলাদা কিনা", "guide_id IS DISTINCT FROM 1 দেয় ৭টা"],
      ["MySQL এর <=>", "NULL-safe equal", "NOT (guide_id <=> 1)"],
      ["NULL এর ছড়ানো", "যোগ, গুণ, || এ উত্তর NULL", "12500 + NULL"],
      ["concat_ws", "NULL বাদ দিয়ে জোড়ে", "concat_ws(': ', full_name, phone)"],
      ["IS TRUE, IS NOT FALSE", "অজানা Boolean এর নিরাপদ পরীক্ষা", "NULL::boolean IS NOT TRUE"],
      ["নকল মান", "0, N/A, 1900 মিথ্যা বলে", "ডিজাইনে NULL বা সত্যিকারের Default"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT count(*) FROM customers WHERE phone = NULL; চালালে Island Tours এর Database এ কী আসবে?",
        options: [
          {
            key: "A",
            text: "5, কারণ পাঁচজনের ফোন নেই",
            isCorrect: false,
            explanation: "NULL এর সাথে = এর উত্তর সবসময় UNKNOWN, তাই ফোন না থাকা পাঁচজনের জন্যও শর্ত TRUE হয় না।",
          },
          {
            key: "B",
            text: "0, কারণ কারো জন্যই শর্তটা TRUE হয় না",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা Row এ phone = NULL এর উত্তর অজানা, আর WHERE শুধু TRUE রাখে। তাই গোনা শূন্য।",
          },
          {
            key: "C",
            text: "একটা Syntax Error",
            isCorrect: false,
            explanation: "Query টা পুরোপুরি বৈধ, কোনো Error আসে না। ঠিক এটাই বিপদ: চুপচাপ ভুল উত্তর।",
          },
          {
            key: "D",
            text: "15, কারণ NULL সবকিছুর সাথে মেলে",
            isCorrect: false,
            explanation: "NULL কিছুর সাথেই নিশ্চিতভাবে মেলে না, নিজের সাথেও না।",
          },
        ],
      },
      {
        id: 2,
        text: "শূন্য, খালি লেখা আর NULL এর মধ্যে কোন কথাটা সঠিক?",
        options: [
          {
            key: "A",
            text: "তিনটাই আসলে একই, শুধু দেখানোর ধরন আলাদা",
            isCorrect: false,
            explanation: "0 IS NULL আর '' IS NULL দুটোই f দেয়। PostgreSQL এদের আলাদা জিনিস হিসেবে দেখে।",
          },
          {
            key: "B",
            text: "শূন্য আর খালি লেখা জানা মান, NULL মানে মানটাই জানা নেই",
            isCorrect: true,
            explanation: "ঠিক। প্রথম দুটো বাক্সে একটা ছোট মান আছে, NULL এর বাক্সে কোনো মান নেই, আছে শুধু জানা নেই চিরকুট।",
          },
          {
            key: "C",
            text: "NULL মানে শূন্য, কিন্তু শুধু সংখ্যার Column এ",
            isCorrect: false,
            explanation: "NULL যেকোনো ধরনের Column এ থাকতে পারে, আর কোথাও তার মানে শূন্য না।",
          },
          {
            key: "D",
            text: "খালি লেখা আর NULL একই, শূন্য আলাদা",
            isCorrect: false,
            explanation: "psql এ দুটো একই রকম ফাঁকা দেখায় বলে এই ভুলটা হয়। আসলে খালি লেখা একটা জানা মান।",
          },
        ],
      },
      {
        id: 3,
        text: "NULL::boolean AND false এর উত্তর কী?",
        options: [
          {
            key: "A",
            text: "NULL, কারণ একপাশে অজানা",
            isCorrect: false,
            explanation: "অজানাকে TRUE বা FALSE যা-ই ধরুন, AND false এর উত্তর FALSE ই থাকে। তাই উত্তর নিশ্চিত।",
          },
          {
            key: "B",
            text: "TRUE",
            isCorrect: false,
            explanation: "একটা FALSE থাকলে AND কখনো TRUE হতে পারে না।",
          },
          {
            key: "C",
            text: "FALSE",
            isCorrect: true,
            explanation: "ঠিক। অজানা মানটা যা-ই হোক, FALSE এর সাথে AND করলে উত্তর FALSE। PostgreSQL ও f দেয়।",
          },
          {
            key: "D",
            text: "Error, কারণ NULL কে Boolean বানানো যায় না",
            isCorrect: false,
            explanation: "NULL::boolean পুরোপুরি বৈধ, এটাই SQL এর UNKNOWN।",
          },
        ],
      },
      {
        id: 4,
        text: "WHERE phone <> '+8801000000101' চালালে ৯ জন আসে, অথচ মোট ১৫ জনের মধ্যে Rahim মাত্র একজন। বাকি ৫ জন কোথায়?",
        options: [
          {
            key: "A",
            text: "তাঁদের ফোন NULL, তাই শর্তের উত্তর UNKNOWN, আর WHERE UNKNOWN বাদ দেয়",
            isCorrect: true,
            explanation: "ঠিক। অজানা নম্বর Rahim এর নম্বরের সমান কিনা কেউ জানে না। WHERE শুধু TRUE রাখে।",
          },
          {
            key: "B",
            text: "তাঁরা মুছে গেছেন",
            isCorrect: false,
            explanation: "count(*) এখনো ১৫ দেয়, কেউ মুছে যাননি। শুধু শর্তটা তাঁদের জন্য TRUE হয়নি।",
          },
          {
            key: "C",
            text: "তাঁদের নম্বর Rahim এর নম্বরের সমান",
            isCorrect: false,
            explanation: "তাহলে phone = নম্বর এ তাঁরা আসতেন, কিন্তু সেটা দেয় মাত্র ১ জন।",
          },
          {
            key: "D",
            text: "<> Operator শুধু সংখ্যার জন্য কাজ করে",
            isCorrect: false,
            explanation: "<> লেখার তুলনাতেও কাজ করে, তাই তো ৯ জন এসেছে। সমস্যা শুধু NULL এর Row গুলোতে।",
          },
        ],
      },
      {
        id: 5,
        text: "Rahim ছাড়া বাকি ১৪ জনকে পেতে কোন শর্তটা সঠিক?",
        options: [
          {
            key: "A",
            text: "WHERE phone <> '+8801000000101'",
            isCorrect: false,
            explanation: "এটা নম্বরহীন পাঁচজনকে বাদ দেয়, ৯ জন আসে।",
          },
          {
            key: "B",
            text: "WHERE phone <> '+8801000000101' AND phone IS NULL",
            isCorrect: false,
            explanation: "একই Row এ দুটো একসাথে সত্য হতে পারে না: নম্বর না থাকলে প্রথমটা UNKNOWN। ফলাফল শূন্য।",
          },
          {
            key: "C",
            text: "WHERE phone IS DISTINCT FROM '+8801000000101'",
            isCorrect: true,
            explanation: "ঠিক। NULL কে মান ধরে তুলনা করে, তাই নম্বরহীনরা আলাদা গণ্য হন। phone <> X OR phone IS NULL ও একই কাজ করে।",
          },
          {
            key: "D",
            text: "WHERE NOT (phone = '+8801000000101')",
            isCorrect: false,
            explanation: "NOT UNKNOWN ও UNKNOWN, তাই এটাও ৯ জন দেয়। PostgreSQL এ চালালে ঠিক ৯ আসে।",
          },
        ],
      },
      {
        id: 6,
        text: "PostgreSQL এ concat_ws(' ', 'Rahim', NULL, 'Uddin') আর 'Rahim' || NULL এর উত্তর কী?",
        options: [
          {
            key: "A",
            text: "দুটোই NULL",
            isCorrect: false,
            explanation: "concat_ws ইচ্ছা করে NULL বাদ দেয়, তাই প্রথমটা NULL না।",
          },
          {
            key: "B",
            text: "Rahim Uddin আর NULL",
            isCorrect: true,
            explanation: "ঠিক। concat_ws NULL ফেলে বাকি দুটো জোড়ে, কিন্তু || এর একপাশে NULL থাকলে উত্তর NULL।",
          },
          {
            key: "C",
            text: "Rahim NULL Uddin আর Rahim",
            isCorrect: false,
            explanation: "NULL কখনো NULL শব্দটা হিসেবে লেখায় ঢোকে না। আর || NULL বাদ দেয় না।",
          },
          {
            key: "D",
            text: "Error, কারণ লেখার সাথে NULL জোড়া যায় না",
            isCorrect: false,
            explanation: "দুটোই বৈধ, কোনো Error নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ guide_id IS DISTINCT FROM 1 লিখলে কী হয়, আর এর বদলে কী লিখবেন?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতোই চলে",
            isCorrect: false,
            explanation: "MySQL 8.4 এ এটা ERROR 1064, Syntax Error দেয়।",
          },
          {
            key: "B",
            text: "Syntax Error, বদলে NOT (guide_id <=> 1)",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর <=> হলো NULL-safe equal, সামনে NOT দিলে NULL-safe আলাদা।",
          },
          {
            key: "C",
            text: "Syntax Error, বদলে guide_id != 1",
            isCorrect: false,
            explanation: "!= আর <> একই জিনিস, NULL থাকা ট্যুরকে বাদ দেয়।",
          },
          {
            key: "D",
            text: "চলে, কিন্তু উল্টো উত্তর দেয়",
            isCorrect: false,
            explanation: "চলেই না, Syntax Error আসে।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours এর একজন Developer প্রস্তাব দিলেন: ফোন না থাকলে NULL না রেখে 'N/A' লিখে রাখি, তাহলে NULL এর ঝামেলাই থাকবে না। এর সবচেয়ে বড় সমস্যা কী?",
        options: [
          {
            key: "A",
            text: "কোনো সমস্যা নেই, এটা ভালো অভ্যাস",
            isCorrect: false,
            explanation: "নকল মান Database কে মিথ্যা বলায়, আর তার কোনো নিয়ম নেই যা SQL নিজে মানে।",
          },
          {
            key: "B",
            text: "'N/A' একটা জানা মানের মতো আচরণ করে: SMS তালিকায় ঢুকে পড়ে, গোনায় নম্বর হিসেবে গণ্য হয়",
            isCorrect: true,
            explanation: "ঠিক। count(phone) তখন ১৫ দেবে, phone IS NOT NULL এ সবাই আসবেন, আর SMS যাবে N/A নামের নম্বরে। NULL অন্তত সৎ।",
          },
          {
            key: "C",
            text: "PostgreSQL 'N/A' লেখা রাখতে দেয় না",
            isCorrect: false,
            explanation: "phone একটা text Column, সেখানে যেকোনো লেখা রাখা যায়। সমস্যাটা অর্থের, নিয়মের না।",
          },
          {
            key: "D",
            text: "'N/A' অনেক বেশি জায়গা নেয়",
            isCorrect: false,
            explanation: "জায়গা এখানে আসল সমস্যা না। ভুল ফলাফলই আসল ক্ষতি।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: NULL এর গোয়েন্দা",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>NULL এর মানচিত্র:</strong> নিজের মেশিনের island_tours এ information_schema দিয়ে
        বের করুন কোন কোন Column NULL নিতে পারে। প্রতিটা Column এর পাশে লিখুন সেখানে NULL কী
        বোঝায়: অজানা, প্রযোজ্য না, নাকি এখনো ঠিক হয়নি।
      </span>,
      <span key="2">
        <strong>হিসাব মেলানো:</strong> phone = Rahim এর নম্বর, phone {"<>"} Rahim এর নম্বর আর
        phone IS NULL, তিনটা count চালান। তিনটার যোগফল মোট Customer এর সমান কিনা দেখান, আর
        প্রথম দুটোর যোগফল কেন মেলে না সেটা দুই লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>একই প্রশ্ন, তিন উত্তর:</strong> Jamal (guide_id 1) এর না এমন ট্যুর তিনভাবে বের
        করুন: guide_id {"<>"} 1, guide_id {"<>"} 1 OR guide_id IS NULL, আর guide_id IS DISTINCT FROM
        1। কোনটা কত Row দিল আর কেন, ছোট একটা টেবিলে লিখুন।
      </span>,
      <span key="4">
        <strong>যোগাযোগের তালিকা:</strong> সব Customer এর জন্য একটা Column বানান যেখানে নাম, শহর
        আর ফোন একটা কমা আর ফাঁকা জায়গা দিয়ে জোড়া, ফোন না থাকলে শুধু নাম আর শহর। একবার || দিয়ে
        আর একবার concat_ws দিয়ে চেষ্টা করে দুই ফলাফলের পার্থক্য দেখান।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> এক বন্ধু বলছেন WHERE phone = NULL কেন কাজ করে না
        বুঝতে পারছেন না। তাঁকে দুই বন্ধ খামের উদাহরণ আর TRUE ও FALSE বসানোর কৌশল দিয়ে ছয় লাইনে
        বুঝিয়ে লিখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">NULL নিতে পারে এমন Column এর তালিকা, প্রতিটার অর্থসহ</span>,
      <span key="d2">তিনটা count এর Output আর মেলানোর হিসাব</span>,
      <span key="d3">Jamal এর তিন Query এর তুলনামূলক টেবিল</span>,
      <span key="d4">|| আর concat_ws এর দুই ফলাফলের Screenshot বা Copy</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ NULL শিকার",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "NULL কে চোখে দেখা",
        description:
          "psql এ island_tours এ ঢুকে প্রথম ফাইলের লাইনগুলো চালান। \\pset null দেওয়ার আগে আর পরে phone Column কেমন দেখায়, মিলিয়ে দেখুন।",
      },
      {
        title: "ভুল পথটা নিজে হাঁটা",
        description:
          "দ্বিতীয় ফাইলে = NULL আর <> দিয়ে লেখা Query চালান। প্রতিটার পাশে লেখা প্রত্যাশিত সংখ্যার সাথে নিজের ফলাফল মেলান।",
      },
      {
        title: "সঠিক পথ",
        description:
          "তৃতীয় ফাইলে IS NULL, IS NOT NULL আর OR দিয়ে জোড়া শর্ত। তিনটা সংখ্যা মিলে মোটের সমান হচ্ছে কিনা দেখুন।",
      },
      {
        title: "IS DISTINCT FROM এর পরীক্ষা",
        description:
          "চতুর্থ ফাইলে <> আর IS DISTINCT FROM পাশাপাশি। কোন ট্যুরটা একটায় আছে আর অন্যটায় নেই, নাম লিখে রাখুন।",
      },
      {
        title: "হিসাব আর লেখায় NULL",
        description:
          "পঞ্চম ফাইলে যোগ, || আর concat_ws। কোনটা NULL দিল আর কোনটা দিল না, লিখে রাখুন।",
      },
      {
        title: "সামনের ফাঁদের এক ঝলক",
        description:
          "ষষ্ঠ ফাইলে NOT IN এর সাথে NULL। শূন্য Row আসবে। কেন আসছে সেটা এখনই বোঝার দরকার নেই, শুধু ফলাফলটা মনে রাখুন, Module 07 এ উত্তর মিলবে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-see-null.sql",
        code: `SELECT customer_id, full_name, phone FROM customers WHERE customer_id IN (2, 3);
-- (2 rows), Tanvir Ahmed এর phone ঘর ফাঁকা দেখায়

\\pset null '(null)'
SELECT customer_id, full_name, phone FROM customers WHERE customer_id IN (2, 3);
-- (2 rows), এবার Tanvir Ahmed এর phone ঘরে (null)`,
      },
      {
        language: "sql",
        filename: "02-wrong-way.sql",
        code: `SELECT count(*) FROM customers WHERE phone = NULL;
-- 0

SELECT count(*) FROM customers WHERE phone <> '+8801000000101';
-- 9

SELECT count(*) FROM customers WHERE NOT (phone = '+8801000000101');
-- 9, NOT UNKNOWN ও UNKNOWN`,
      },
      {
        language: "sql",
        filename: "03-right-way.sql",
        code: `SELECT count(*) FROM customers WHERE phone IS NULL;
-- 5

SELECT count(*) FROM customers WHERE phone IS NOT NULL;
-- 10

SELECT count(*) FROM customers
WHERE phone <> '+8801000000101' OR phone IS NULL;
-- 14`,
      },
      {
        language: "sql",
        filename: "04-distinct-from.sql",
        code: `SELECT tour_id, title FROM tours WHERE guide_id <> 1;
-- (6 rows)

SELECT tour_id, title FROM tours WHERE guide_id IS DISTINCT FROM 1;
-- (7 rows), বাড়তি একটা Ratargul Swamp Boat Day`,
      },
      {
        language: "sql",
        filename: "05-spread.sql",
        code: `SELECT 12500 + NULL AS plus,
       'Rahim' || NULL AS glued,
       concat_ws(' ', 'Rahim', NULL, 'Uddin') AS joined;
-- plus আর glued NULL, joined হলো Rahim Uddin

SELECT concat_ws(': ', full_name, phone) AS contact_line
FROM customers
WHERE customer_id IN (1, 3, 9);
-- (3 rows): Rahim Uddin: +8801000000101, Tanvir Ahmed, Priya Sharma`,
      },
      {
        language: "sql",
        filename: "06-not-in-preview.sql",
        code: `SELECT title FROM tours WHERE guide_id NOT IN (1, 2);
-- (4 rows)

SELECT title FROM tours WHERE guide_id NOT IN (1, NULL);
-- (0 rows), তালিকায় একটা NULL ঢুকতেই সব হারাল`,
      },
    ],
    tip: (
      <>
        প্রতিটা ড্রিলের মন্তব্যে লেখা সংখ্যাগুলো একটা নতুন Load করা island_tours থেকে নেওয়া। আপনার
        সংখ্যা না মিললে আগে দেখুন Database টা আগের কোনো পরীক্ষায় বদলে গেছে কিনা। Module 02 এর
        Load লেসনের মতো ফাইলটা আবার চালিয়ে দিলেই সব শুরুর অবস্থায় ফিরে আসে।
      </>
    ),
  },
};
