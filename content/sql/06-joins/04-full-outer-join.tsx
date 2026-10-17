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
  JoinTypeLab,
  ReconcileLab,
} from "../../../components/course/topics/joins/full-animations";
import {
  FourJoinsDiagram,
  FullJoinPartsDiagram,
  MysqlEmulationDiagram,
  OnVsWhereSplit,
} from "../../../components/course/topics/joins/full-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/** The made-up gateway statement used throughout the lesson, as an inline table. */
const STATEMENT_VALUES = `(VALUES
  (1, 25000.00), (2, 50000.00), (3, 12500.00), (4, 25500.00),
  (5, 17000.00), (6, 36000.00), (7, 18000.00), (8, 19000.00),
  (9, 28000.00), (10, 14000.00), (11, 15000.00), (12, 25000.00),
  (14, 25500.00), (15, 36000.00), (16, 28000.00), (17, 10500.00),
  (18, 12500.00), (19, 42500.00), (20, 9500.00)
) AS s (payment_id, amount_bdt)`;

/** HR's winter roster: Rubel is missing, a new guide Tasnim is not in the database yet. */
const ROSTER_VALUES = `(VALUES
  (1, 'Jamal Hossain'), (2, 'Shirin Akter'), (4, 'Ayesha Siddiqua'),
  (5, 'Nazmul Karim'), (6, 'Tasnim Ara')
) AS r (guide_id, full_name)`;

export const fullOuterJoinContent: TopicData = {
  id: "full-outer-join",
  introduction: {
    badge: "MODULE 06 · LESSON 04",
    title: <SectionTitle>দুই দিকের কাউকেই বাদ দেবেন না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি দেখেছেন LEFT JOIN কীভাবে বাম Table এর প্রতিটা Row রেখে দেয়, মিল না পেলেও।
          তাতেই Imran Kabir কে পাওয়া গেছে, যিনি এখনো কিছু বুক করেননি, আর Kuakata কে, যেখানে এখনো
          কোনো ট্যুর নেই। কিন্তু LEFT JOIN একটা দিকেরই কথা দেয়। ডান দিকে কেউ একা থাকলে সে চুপচাপ
          হারিয়ে যায়। RIGHT JOIN এর বেলায় ঠিক উল্টো।
        </ContentParagraph>
        <ContentParagraph>
          বাস্তবে এমন প্রশ্ন প্রায়ই আসে, যেখানে দুই দিকের একা Row ই দরকার। দুটো তালিকা মিলে যাওয়ার
          কথা, অথচ মেলে না: Database এ টাকা জমার হিসাব আর Payment Gateway এর Statement, HR এর খাতায়
          Guide দের নাম আর Database এর guides Table। এখানে প্রশ্নটা দুই দিকেরই: কোনটা শুধু আমার কাছে
          আছে, আর কোনটা শুধু ওদের কাছে। এই কাজের জন্য SQL এর হাতিয়ার FULL OUTER JOIN।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন FULL OUTER JOIN ঠিক কী রাখে, তিন রকম Row কীভাবে চিনতে হয়, দুই
          দিকের Key কীভাবে এক Column এ আনতে হয়, টাকার হিসাব মেলানোর পুরো Query কীভাবে লেখা হয়,
          WHERE আর ON এ শর্ত বসালে কী কী অঘটন ঘটে, আর MySQL এ FULL JOIN না থাকলে একই কাজ কীভাবে
          করতে হয়। প্রতিটা কথা দেখবেন Island Tours এর আসল guides, tours আর payments এর উপর।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কাউকে ফেলে দিই না। যাদের জোড়া মেলে তাদের পাশাপাশি বসাই, আর যারা একা তাদেরও রাখি, পাশের খালি ঘরে NULL বসিয়ে। তাই আমার ফলাফলেই আপনি দেখতে পান কোন হিসাব মেলেনি।",
      author: "FULL OUTER JOIN",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুই দিকের একা মানুষ, এক তালিকায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শীতের মৌসুম শুরুর আগে Island Tours এর Operations Manager ফারুক সাহেব একটা Staffing বৈঠক
                ডাকলেন। বৈঠকের জন্য তিনি নতুন Developer তানিমের কাছে একটা তালিকা চাইলেন: প্রতিটা Guide আর
                প্রতিটা ট্যুর, পাশাপাশি। সাথে দুটো বিশেষ প্রশ্ন। কোন Guide এর হাতে এখনো কোনো ট্যুর নেই, যাতে
                তাঁকে কাজ দেওয়া যায়? আর কোন ট্যুরের এখনো কোনো Guide নেই, যাতে বুকিং আসার আগেই কাউকে দায়িত্ব
                দেওয়া যায়? দুটো প্রশ্নের উত্তর এক তালিকায় চাই।
              </ContentParagraph>
              <ContentParagraph>
                তানিম প্রথমে লিখলেন সাধারণ JOIN, মানে INNER JOIN। আটটা Row এল, প্রতিটা ট্যুরের পাশে তার
                Guide। দেখতে সুন্দর, কিন্তু ফারুক সাহেবের দুটো প্রশ্নের একটারও উত্তর নেই। Nazmul Karim
                তালিকায় নেই, কারণ তাঁর কোনো ট্যুর নেই। Ratargul Swamp Boat Day ও নেই, কারণ তার কোনো Guide
                নেই। INNER JOIN শুধু জোড়া রাখে, একা কাউকে না।
              </ContentParagraph>
              <ContentParagraph>
                আগের লেসন মনে করে তানিম লিখলেন guides LEFT JOIN tours। এবার নয়টা Row, আর শেষে Nazmul
                Karim, পাশে ট্যুরের ঘর খালি। একটা প্রশ্নের উত্তর মিলল। কিন্তু Ratargul এখনো নেই। তারপর
                তিনি লিখলেন RIGHT JOIN। আবার নয়টা Row, এবার Ratargul আছে, কিন্তু Nazmul উধাও। দুটো Query তে
                দুটো উত্তর, কিন্তু কোনোটাতেই পুরো ছবি নেই।
              </ContentParagraph>
              <ContentParagraph>
                তানিম যা খুঁজছিলেন, সেটা LEFT আর RIGHT এর যোগফল: সব জোড়া, তার সাথে বামের একা Row আর
                ডানের একা Row, সবাই এক ফলাফলে। SQL এ এর জন্য আলাদা একটা Join আছে, FULL OUTER JOIN। এক
                Query, দশটা Row, আর দুটো প্রশ্নের উত্তর একসাথে। এই লেসন সেই Join এর পুরো গল্প।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের তিন চেষ্টা আর চতুর্থ উত্তর"
              query={`SELECT count(*) AS inner_rows
FROM guides AS g
JOIN tours AS t ON t.guide_id = g.guide_id;

SELECT count(*) AS left_rows
FROM guides AS g
LEFT JOIN tours AS t ON t.guide_id = g.guide_id;

SELECT count(*) AS right_rows
FROM guides AS g
RIGHT JOIN tours AS t ON t.guide_id = g.guide_id;

SELECT count(*) AS full_rows
FROM guides AS g
FULL OUTER JOIN tours AS t ON t.guide_id = g.guide_id;`}
              caption="চারটা ফলাফল: 8, 9, 9, 10। INNER শুধু জোড়া গোনে। LEFT তার সাথে Nazmul কে যোগ করে, RIGHT যোগ করে Ratargul কে। FULL দুজনকেই রাখে। এই চারটা সংখ্যা পুরো লেসনে বারবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "FULL OUTER JOIN এর একটাই কথা",
          content: (
            <ContentParagraph>
              দুই Table এর কোনো Row ই বাদ যাবে না। যাদের মিল আছে তারা পাশাপাশি এক Row তে, যাদের নেই
              তারা নিজের Row তে, অন্য দিকের Column গুলোতে NULL নিয়ে। ফলাফলের প্রতিটা Row তিন রকমের একটা:
              মিল, শুধু বামের, অথবা শুধু ডানের।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "both-sides",
      subHeader: { index: "002", title: "Both Sides" },
      title: <SectionTitle>দুটো হাজিরা খাতা মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের কথা ভাবুন। পরীক্ষার দিন দুটো খাতা তৈরি হয়। একটা ক্লাস শিক্ষকের খাতা, যেখানে
                ক্লাসের সব ছাত্রের নাম। আরেকটা পরীক্ষার হলের খাতা, যেখানে যারা হলে এসে সই করেছে তাদের নাম।
                প্রধান শিক্ষক দুটো খাতা পাশাপাশি রেখে তিন রকম মানুষ খোঁজেন। যাদের নাম দুই খাতাতেই আছে,
                তারা ঠিকমতো পরীক্ষা দিয়েছে। যাদের নাম শুধু ক্লাসের খাতায়, তারা অনুপস্থিত। আর যাদের নাম শুধু
                হলের খাতায়, তারা আসলে এই ক্লাসের ছাত্রই না, ভুল হলে ঢুকে পড়েছে।
              </ContentParagraph>
              <ContentParagraph>
                প্রধান শিক্ষক যদি শুধু ক্লাসের খাতা ধরে মেলান, অনুপস্থিতদের পাবেন, কিন্তু ভুল হলে ঢোকা
                ছাত্রটা চোখ এড়িয়ে যাবে। শুধু হলের খাতা ধরে মেলালে উল্টোটা। দুই খাতার একা নামগুলো একসাথে
                পেতে হলে দুটো খাতাকেই সমান গুরুত্ব দিতে হবে। FULL OUTER JOIN ঠিক এটাই করে। LEFT JOIN একটা
                খাতাকে প্রধান ধরে, RIGHT JOIN অন্যটাকে, আর FULL দুটোকেই।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Data তে দুই খাতা হলো guides আর tours, আর মেলানোর নিয়ম{" "}
                <code className={CODE}>t.guide_id = g.guide_id</code>। নিচের ছবিতে আসল পাঁচজন Guide আর নয়টা
                ট্যুর, প্রতিটা মিলের জন্য একটা দাগ। দুই পাশে একজন করে একা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FullJoinPartsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো ছবিটা, এক Query তে"
              query={`SELECT g.full_name, t.title
FROM guides AS g
FULL OUTER JOIN tours AS t
  ON t.guide_id = g.guide_id
ORDER BY g.guide_id NULLS LAST, t.tour_id;`}
              caption="দশটা Row। প্রথম আটটা জোড়া, প্রতিটা Guide তাঁর দুটো ট্যুরের সাথে। নবম Row তে Nazmul Karim, title এর ঘরে NULL, কারণ তাঁর কোনো ট্যুর নেই। দশম Row তে Ratargul Swamp Boat Day, full_name এর ঘরে NULL, কারণ তার কোনো Guide নেই। NULLS LAST না লিখলেও PostgreSQL এর ASC তে NULL শেষেই যায়, তবু লিখে রাখা ভালো, কারণ MySQL এ ASC তে NULL আসে সবার আগে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              লক্ষ করুন, Database নতুন কোনো তথ্য বানায়নি। Nazmul এর পাশের NULL মানে শুধু এটুকু: এই Row তে
              ট্যুরের দিকে বসানোর মতো কেউ ছিল না। আগের লেসনের LEFT JOIN এর NULL আর এখানকার NULL একই জিনিস,
              শুধু এবার দুই দিকেই দেখা দিতে পারে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "syntax",
      subHeader: { index: "003", title: "The Syntax" },
      title: <SectionTitle>লেখার নিয়ম, আর কোন শব্দ বাদ দেওয়া যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FULL OUTER JOIN লেখা হয় বাকি Join গুলোর মতোই। FROM এ প্রথম Table, তারপর Join এর নাম, তারপর
                দ্বিতীয় Table, আর ON এ মেলানোর শর্ত। নতুন কিছু শিখতে হয় না, শুধু Join এর নামটা বদলায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>OUTER শব্দটা ঐচ্ছিক।</strong> <code className={CODE}>FULL OUTER JOIN</code> আর{" "}
                  <code className={CODE}>FULL JOIN</code> হুবহু একই জিনিস, যেমন LEFT OUTER JOIN আর LEFT JOIN
                  একই। অনেক Team ছোট রূপটাই লেখে। এই লেসনে দুটোই দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>বাম আর ডান শুধু নামের জন্য।</strong> FULL JOIN এ কোন Table আগে লিখলেন তাতে ফলাফলের
                  Row বদলায় না, দুই দিকই সমান রাখা হয়। বদলায় শুধু Column এর ক্রম, আর কোন একা Row কে
                  আপনি মুখে &ldquo;শুধু বামের&rdquo; বলবেন।
                </ListItem>
                <ListItem>
                  <strong>ON এ সাধারণত দুই দিকের Key।</strong> এখানে{" "}
                  <code className={CODE}>t.guide_id = g.guide_id</code>, মানে ট্যুরের Foreign Key আর Guide এর
                  Primary Key। আগের লেসনগুলোর মতোই।
                </ListItem>
                <ListItem>
                  <strong>Alias প্রায় অপরিহার্য।</strong> দুই দিকেই guide_id নামের Column আছে, তাই g আর t
                  ছাড়া Database বুঝবে না কোন guide_id এর কথা বলছেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "full-join-shape.sql",
          code: `SELECT columns_from_both_sides
FROM   left_table  AS a
FULL [OUTER] JOIN right_table AS b
  ON   b.key = a.key        -- কোন জোড়া মিল, সেটা ঠিক করে
WHERE  ...                  -- ঐচ্ছিক, Join এর পরে চলে (সাবধান, Section 010)
ORDER BY ...;`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Table এর ক্রম উল্টালে কী হয়"
              query={`SELECT count(*) AS guides_first
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id;

SELECT count(*) AS tours_first
FROM tours AS t
FULL JOIN guides AS g ON g.guide_id = t.guide_id;

SELECT t.title, g.full_name
FROM tours AS t
FULL JOIN guides AS g ON g.guide_id = t.guide_id
ORDER BY t.tour_id NULLS LAST;`}
              caption="দুই ক্রমেই দশটা Row, একই দশটা জোড়া আর একা। শেষ Query তে tours আগে, তাই এবার Ratargul বামের একা Row, আর Nazmul ডানের একা Row, title এর ঘরে NULL নিয়ে শেষে বসেছেন। FULL JOIN এ বাম আর ডান শুধু নাম, রাখার নিয়ম দুই দিকে সমান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে লিখুন। ফারুক সাহেবের চাওয়া তালিকাটাই, কোনো সাজানো ছাড়া।
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
                  প্রতিটা Guide আর প্রতিটা ট্যুর, একটাও বাদ না দিয়ে। দুটো Column: Guide এর{" "}
                  <code className={CODE}>full_name</code> আর ট্যুরের <code className={CODE}>title</code>, এই
                  ক্রমে। Row এর ক্রম যেকোনো হতে পারে। দশটা Row আসার কথা।
                </>
              }
              hint={
                <>
                  guides আর tours কে FULL JOIN দিয়ে জুড়ুন, শর্ত{" "}
                  <code className={CODE}>t.guide_id = g.guide_id</code>।
                </>
              }
              solution={`SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-join",
      subHeader: { index: "004", title: "Watch It Join" },
      title: <SectionTitle>চার রকম Join, একই তিন স্তূপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Join গুলোকে চারটা আলাদা যন্ত্র হিসেবে মনে রাখার দরকার নেই। ভেতরে সবাই একই কাজ করে। আগে
                দুই Table এর Row গুলো মেলানো হয়, আর তাতে তিনটা স্তূপ তৈরি হয়: মিলে যাওয়া জোড়া, বামের যারা
                কারো সাথে মেলেনি, আর ডানের যারা কারো সাথে মেলেনি। তারপর Join এর নাম ঠিক করে কোন স্তূপ
                ফলাফলে যাবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একটা একটা করে সম্ভাব্য Row তৈরি হতে দেখুন। Join বদলালে Row তৈরির ক্রম একই থাকে,
                বদলায় শুধু কোন Row রাখা হলো আর কোনটা ফেলে দেওয়া হলো। FULL OUTER JOIN দিয়ে শুরু করুন, তারপর
                INNER বেছে নিয়ে একই ধাপগুলো আবার দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinTypeLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FourJoinsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ছবি থেকে একটা ছোট হিসাব বের হয়, যেটা Query যাচাই করতে খুব কাজে লাগে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  FULL এর Row = INNER এর Row + বামের একা + ডানের একা। এখানে 10 = 8 + 1 + 1।
                </ListItem>
                <ListItem>
                  LEFT এর Row = INNER + বামের একা, তাই বামের একা = LEFT থেকে INNER বাদ = 9 থেকে 8 = 1।
                </ListItem>
                <ListItem>
                  একইভাবে ডানের একা = RIGHT থেকে INNER বাদ = 1। চারটা count জানলে একা Row কয়টা, সেটা
                  Query না দেখেই বলে দেওয়া যায়।
                </ListItem>
                <ListItem>
                  FULL কখনো LEFT বা RIGHT এর চেয়ে কম Row দেয় না। কম এলে বুঝবেন মাঝখানে কিছু Row ছেঁকে
                  ফেলা হয়েছে, যেটা Section 010 এর বিষয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এক Guide এর দুই ট্যুর মানে দুই Row",
          content: (
            <ContentParagraph>
              FULL JOIN ও অন্য Join এর মতো Row বাড়ায়। Jamal Hossain এর দুটো ট্যুর, তাই তিনি ফলাফলে দুইবার।
              guides এর পাঁচজন আর tours এর নয়টা থেকে দশটা Row এসেছে, পাঁচ বা নয় না। FULL শুধু এটুকু কথা দেয়
              যে কেউ হারাবে না, কতবার আসবে সেটা মিলের সংখ্যা ঠিক করে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "lonely-rows",
      subHeader: { index: "005", title: "Lonely Rows" },
      title: <SectionTitle>শুধু একা Row গুলো বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের আসল আগ্রহ আটটা জোড়ায় না, দুই একা Row তে। বৈঠকে তিনি পুরো দশ লাইনের তালিকা
                পড়তে চান না, চান শুধু সমস্যাগুলো। আগের লেসনে LEFT JOIN এর পরে{" "}
                <code className={CODE}>WHERE ... IS NULL</code> দিয়ে আপনি একা Row খুঁজেছেন। FULL JOIN এও একই
                কৌশল, শুধু এবার দুই দিকেই খুঁজতে হয়, তাই দুটো শর্ত OR দিয়ে জোড়া।
              </ContentParagraph>
              <ContentParagraph>
                বামের একা Row মানে ডান দিকে কেউ নেই, তাই ডান Table এর সব Column NULL। ডানের একা Row মানে বাম
                দিকের সব Column NULL। তাহলে কোন Column দিয়ে পরীক্ষা করবেন? নিয়মটা হলো, প্রতিটা দিকের
                Primary Key দিয়ে, কারণ আসল কোনো Row তে Primary Key কখনো NULL হয় না। Primary Key NULL দেখা
                মানেই সেই দিকের Row টাই নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শুধু সমস্যা, লেবেলসহ"
              query={`SELECT g.full_name,
       t.title,
       CASE
         WHEN t.tour_id IS NULL THEN 'guide has no tour'
         WHEN g.guide_id IS NULL THEN 'tour has no guide'
         ELSE 'matched'
       END AS kind
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
WHERE g.guide_id IS NULL
   OR t.tour_id IS NULL;`}
              caption="দুটো Row: Nazmul Karim এর পাশে guide has no tour, আর Ratargul Swamp Boat Day এর পাশে tour has no guide। WHERE এর দুটো শর্তের একটা বামের একা Row ধরে, অন্যটা ডানের। CASE দিয়ে প্রতিটা Row এর রকম লিখে দেওয়ায় তালিকাটা বৈঠকে সরাসরি পড়া যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "NULL হতে পারে এমন Column দিয়ে একা Row খুঁজবেন না",
          content: (
            <ContentParagraph>
              <code className={CODE}>t.guide_id IS NULL</code> লিখলেও এই Data তে একই দুটো Row আসে, তাই
              ভুলটা চোখে পড়ে না। কিন্তু কারণটা কাকতালীয়। Ratargul একটা আসল ট্যুর, তার guide_id নিজেই NULL।
              অন্য কোনো Join এ এমন Column দিয়ে পরীক্ষা করলে মিলে যাওয়া Row ও &ldquo;একা&rdquo; বলে ধরা পড়বে।
              customers এর phone এর কথা ভাবুন: পাঁচজন আসল Customer এর phone NULL। একা Row চেনার জন্য সবসময়
              Primary Key, যেমন <code className={CODE}>t.tour_id</code> আর{" "}
              <code className={CODE}>g.guide_id</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  বৈঠকের ছোট তালিকা: শুধু সেই Row গুলো যেখানে Guide আছেন কিন্তু ট্যুর নেই, অথবা ট্যুর আছে কিন্তু
                  Guide নেই। দুটো Column: <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>title</code>। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  FULL JOIN এর পরে <code className={CODE}>WHERE g.guide_id IS NULL OR t.tour_id IS NULL</code>,
                  দুই দিকের Primary Key দিয়ে।
                </>
              }
              solution={`SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
WHERE g.guide_id IS NULL
   OR t.tour_id IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "coalesce-keys",
      subHeader: { index: "006", title: "COALESCE the Keys" },
      title: <SectionTitle>দুই ঘরের Key, এক Column এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FULL JOIN এর ফলাফলে একটা ছোট অসুবিধা আছে। একই জিনিসের পরিচয় দুই জায়গায় ছড়িয়ে থাকে। মিলে
                যাওয়া Row তে Guide এর নম্বর দুই দিকেই আছে, g.guide_id আর t.guide_id এ। কিন্তু বামের একা Row তে
                নম্বরটা শুধু g.guide_id এ, আর দুই তালিকা তুলনার সময় ডানের একা Row তে নম্বরটা শুধু ডান দিকে। কোনো
                একটা Column দিয়ে সাজাতে গেলে বা দেখাতে গেলে একদিকের একা Row গুলোর ঘর খালি থাকে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান Module 04 এর একটা পুরনো বন্ধু,{" "}
                <Link href="/sql/topic/null-functions" className={LINK}>
                  COALESCE
                </Link>
                । <code className={CODE}>COALESCE(g.guide_id, t.guide_id)</code> প্রথম যে দিকে মান পায় সেটাই
                দেয়, তাই এক Column এ সবার নম্বর আসে। FULL JOIN এর প্রায় প্রতিটা বাস্তব Query তে Key এর জন্য এই
                COALESCE থাকে।
              </ContentParagraph>
              <ContentParagraph>
                দুই দিকের Column এর নাম হুবহু এক হলে PostgreSQL একটা শর্টকাট দেয়:{" "}
                <code className={CODE}>USING (guide_id)</code>। ON এর বদলে USING লিখলে মেলানোর নিয়ম একই
                থাকে, কিন্তু ফলাফলে guide_id নামে একটাই Column আসে। FULL JOIN এর বেলায় সেই Column টা আসলে দুই
                দিকের COALESCE, Database নিজেই বানিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="USING দিয়ে একটাই guide_id"
              query={`SELECT guide_id, full_name, title
FROM guides
FULL JOIN tours USING (guide_id)
ORDER BY guide_id NULLS LAST, title;`}
              caption="দশটা Row আর একটাই guide_id Column। Nazmul এর Row তে 5, কারণ বামের দিকে মান আছে। Ratargul এর Row তে guide_id খালি, কারণ দুই দিকেই এর কোনো মান নেই: guides এ এর কোনো Row নেই, আর ট্যুরের নিজের guide_id ও NULL। এখানে guide_id এর আগে কোনো Table এর নাম নেই, কারণ এটা USING এর বানানো মিলিত Column, কোনো এক Table এর না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COALESCE এর আসল দাপট দেখা যায় দুটো তালিকা তুলনার সময়, যেখানে দুই দিকের Key ই একই জিনিসের
                নম্বর। শীতের মৌসুমের জন্য HR বিভাগ একটা Roster বানিয়েছে, একটা Spreadsheet এ: কোন কোন Guide এই
                মৌসুমে কাজ করবেন। ফারুক সাহেব জানতে চান HR এর তালিকা আর Database এর guides Table কোথায় মেলে না।
              </ContentParagraph>
              <ContentParagraph>
                HR এর তালিকাটা Database এ নেই, তাই Query এর ভেতরেই একটা ছোট Table হাতে লিখে দেওয়া যায়।
                এর নাম VALUES: বন্ধনীর ভেতরে Row গুলো, প্রতিটা Row আবার বন্ধনীতে, আর শেষে{" "}
                <code className={CODE}>AS r (guide_id, full_name)</code> দিয়ে Table টার নাম আর Column গুলোর নাম।
                এরপর r কে একদম সাধারণ Table এর মতো Join করা যায়। HR এর তালিকায় Rubel Mia নেই, কারণ তিনি এই
                মৌসুমে ছুটিতে, আর আছেন নতুন Guide Tasnim Ara, যাঁকে Database এ এখনো যোগ করা হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="HR এর Roster বনাম guides Table"
              query={`SELECT g.guide_id AS db_id,
       g.full_name AS in_database,
       r.guide_id AS roster_id,
       r.full_name AS in_roster
FROM guides AS g
FULL JOIN ${ROSTER_VALUES}
  ON r.guide_id = g.guide_id
ORDER BY COALESCE(g.guide_id, r.guide_id);`}
              caption="ছয়টা Row। চারজন দুই তালিকাতেই। Rubel Mia এর Row তে roster এর দুটো ঘর খালি, কারণ HR এর তালিকায় তিনি নেই। শেষ Row তে Tasnim Ara, Database এর দুটো ঘর খালি, কারণ guides এ তিনি নেই। ORDER BY তে COALESCE না দিলে Tasnim এর Row কোথায় বসবে, সেটা db_id এর NULL ঠিক করত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              starter={`SELECT ...
FROM guides AS g
FULL JOIN ${ROSTER_VALUES}
  ON r.guide_id = g.guide_id
ORDER BY ...;`}
              task={
                <>
                  ফারুক সাহেবের জন্য পরিষ্কার তালিকা। চারটা Column, এই ক্রমে: দুই দিকের নম্বর মিলিয়ে একটা{" "}
                  <code className={CODE}>guide_id</code>, Database এর নাম, Roster এর নাম, আর একটা{" "}
                  <code className={CODE}>status</code> যেখানে লেখা থাকবে <code className={CODE}>both</code>,{" "}
                  <code className={CODE}>database only</code> অথবা <code className={CODE}>roster only</code>।
                  guide_id অনুযায়ী ছোট থেকে বড় সাজান। নিচের বক্সে VALUES অংশটা লেখা আছে।
                </>
              }
              hint={
                <>
                  নম্বরের জন্য <code className={CODE}>COALESCE(g.guide_id, r.guide_id)</code>। status এর জন্য
                  CASE: <code className={CODE}>g.guide_id IS NULL</code> হলে roster only,{" "}
                  <code className={CODE}>r.guide_id IS NULL</code> হলে database only, নইলে both।
                </>
              }
              solution={`SELECT COALESCE(g.guide_id, r.guide_id) AS guide_id,
       g.full_name AS in_database,
       r.full_name AS in_roster,
       CASE
         WHEN g.guide_id IS NULL THEN 'roster only'
         WHEN r.guide_id IS NULL THEN 'database only'
         ELSE 'both'
       END AS status
FROM guides AS g
FULL JOIN ${ROSTER_VALUES}
  ON r.guide_id = g.guide_id
ORDER BY 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "counting-parts",
      subHeader: { index: "007", title: "Counting the Parts" },
      title: <SectionTitle>তিন স্তূপ গোনা, আর দলের হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বড় Table এ একা Row গুলোর তালিকা শত শত লাইনের হতে পারে। তখন প্রথম প্রশ্ন থাকে কয়টা, তালিকা
                পরে। Module 05 এর FILTER দিয়ে এক Query তেই তিন স্তূপ আলাদা করে গোনা যায়, যেহেতু প্রতিটা স্তূপ
                চেনার শর্ত আপনি এখন জানেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক লাইনে তিন স্তূপ"
              query={`SELECT count(*) FILTER (WHERE g.guide_id IS NOT NULL
                         AND t.tour_id IS NOT NULL) AS matched,
       count(*) FILTER (WHERE t.tour_id IS NULL)  AS guide_only,
       count(*) FILTER (WHERE g.guide_id IS NULL) AS tour_only,
       count(*)                                    AS total
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id;`}
              caption="8, 1, 1, 10। Section 004 এর হিসাব এবার Database নিজে করে দিল। কোনো Report এ এই এক লাইন থাকলে পাঠক এক নজরে বোঝেন হিসাব কতটা মিলেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FULL JOIN এর পরে GROUP BY ও চলে, আর সেখানে একটা মজার ব্যাপার ঘটে। প্রতিটা Guide এর হাতে কয়টা
                ট্যুর, এই প্রশ্নে LEFT JOIN দিলে Nazmul শূন্য নিয়ে আসেন, কিন্তু Guide ছাড়া ট্যুরটার কোনো
                জায়গা থাকে না। FULL JOIN দিলে Ratargul এর Row এ full_name NULL, তাই GROUP BY তাকে একটা আলাদা
                দলে রাখে, NULL এর দলে।{" "}
                <Link href="/sql/topic/group-by" className={LINK}>
                  GROUP BY এর লেসনে
                </Link>{" "}
                দেখেছেন, NULL নিজেই একটা দল। COALESCE দিয়ে সেই দলের একটা মানুষের মতো নাম দেওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Guide এর ট্যুর, আর Guide ছাড়া ট্যুরগুলোর দল"
              query={`SELECT COALESCE(g.full_name, 'No guide yet') AS guide,
       count(t.tour_id)                    AS tours
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
GROUP BY COALESCE(g.full_name, 'No guide yet')
ORDER BY tours DESC, guide;`}
              caption="ছয়টা দল। চারজন Guide এর দুটো করে ট্যুর। No guide yet এর দলে একটা, Ratargul। Nazmul Karim এর শূন্য, কারণ count(t.tour_id) শুধু আসল ট্যুর গোনে, আর তাঁর Row তে t.tour_id NULL। count(*) দিলে Nazmul ভুল করে 1 পেতেন, ঠিক আগের লেসনের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              starter={`SELECT ...
FROM guides AS g
FULL JOIN ${ROSTER_VALUES}
  ON r.guide_id = g.guide_id;`}
              task={
                <>
                  HR এর Roster আর guides Table এর তুলনা, শুধু সংখ্যায়। এক Row, তিনটা Column এই ক্রমে: দুই
                  তালিকাতেই আছেন কয়জন (<code className={CODE}>both_lists</code>), শুধু Database এ কয়জন (
                  <code className={CODE}>database_only</code>), আর শুধু Roster এ কয়জন (
                  <code className={CODE}>roster_only</code>)।
                </>
              }
              hint={
                <>
                  তিনটা <code className={CODE}>count(*) FILTER (WHERE ...)</code>। দুই তালিকায় থাকা মানে দুই দিকের
                  guide_id ই NOT NULL।
                </>
              }
              solution={`SELECT count(*) FILTER (WHERE g.guide_id IS NOT NULL
                         AND r.guide_id IS NOT NULL) AS both_lists,
       count(*) FILTER (WHERE r.guide_id IS NULL) AS database_only,
       count(*) FILTER (WHERE g.guide_id IS NULL) AS roster_only
FROM guides AS g
FULL JOIN ${ROSTER_VALUES}
  ON r.guide_id = g.guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "reconciliation",
      subHeader: { index: "008", title: "Reconciliation" },
      title: <SectionTitle>মাস শেষের টাকার হিসাব মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FULL OUTER JOIN এর সবচেয়ে বড় কাজের জায়গা হলো হিসাব মেলানো, ইংরেজিতে Reconciliation। দুটো
                আলাদা উৎস একই ঘটনার হিসাব রাখে, আর মাস শেষে দেখতে হয় দুটো মেলে কিনা। Island Tours এর ক্ষেত্রে
                একটা উৎস নিজেদের payments Table, যেখানে App প্রতিটা টাকা দেওয়ার চেষ্টা লিখে রাখে। অন্য উৎস
                Payment Gateway, মানে bKash, Card বা Bank এর দিক থেকে আসা Statement, যেখানে লেখা থাকে আসলে কোন
                টাকা কাটা হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                মালিক রুমানা আপা প্রতি মাসের শেষে এই দুটো মেলাতে বলেন, কারণ অমিল মানেই ঝুঁকি। তিন রকম অমিল
                হতে পারে, আর তিনটাই FULL JOIN এর তিন স্তূপের সাথে মিলে যায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দুই দিকেই আছে, কিন্তু টাকা আলাদা।</strong> মিলে যাওয়া Row, তবে amount এর দুটো ঘর
                  সমান না। হয়তো Gateway Fee কেটেছে, হয়তো কোথাও ভুল লেখা।
                </ListItem>
                <ListItem>
                  <strong>শুধু Database এ আছে।</strong> App মনে করছে টাকা এসেছে বা আসার চেষ্টা হয়েছে, কিন্তু
                  Gateway এর Statement এ তার চিহ্ন নেই।
                </ListItem>
                <ListItem>
                  <strong>শুধু Statement এ আছে।</strong> Gateway বলছে টাকা কেটেছে, অথচ Database তা জানে না। এটাই
                  সবচেয়ে ভয়ের: একজন Customer এর টাকা গেছে, কিন্তু তাঁর Booking এর কোনো Payment লেখা নেই।
                  হয়তো টাকা কাটার ঠিক পরে App টা থেমে গিয়েছিল।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের Statement টা বানানো, কিন্তু payments Table আসল। Statement টা Query এর ভেতরে VALUES
                হিসেবে বসানো, Section 006 এর Roster এর মতো। নিচে আগে পুরো FULL JOIN দেখুন, সমস্যা খোঁজা পরের
                Section এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="payments বনাম Gateway Statement, পুরোটা"
              query={`SELECT p.payment_id AS db_id,
       s.payment_id AS statement_id,
       p.amount_bdt AS db_amount,
       s.amount_bdt AS statement_amount
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
ORDER BY COALESCE(p.payment_id, s.payment_id);`}
              caption="বিশটা Row। আঠারোটা Payment দুই দিকেই আছে। Payment 13 এর Row তে Statement এর দুটো ঘর খালি: Database এ আছে, Statement এ নেই। শেষ Row Payment 20, Database এর দুটো ঘর খালি: Statement এ আছে, Database এ নেই। আর Payment 11 এর দুই ঘরে টাকা আলাদা, 15600.00 আর 15000.00। চোখ দিয়ে খুঁজলে বিশ লাইনেই তিনটা সমস্যা ধরা কঠিন, হাজার লাইনে অসম্ভব।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ReconcileLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "only-problems",
      subHeader: { index: "009", title: "Only the Problems" },
      title: <SectionTitle>শুধু অমিল, আর NULL এর পুরনো ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রুমানা আপা বিশ লাইন পড়তে চান না, চান শুধু অমিলগুলো। তানিমের প্রথম চিন্তা খুব স্বাভাবিক: যেখানে
                দুই দিকের টাকা সমান না, শুধু সেগুলো দেখানো। তিনি লিখলেন{" "}
                <code className={CODE}>WHERE p.amount_bdt &lt;&gt; s.amount_bdt</code>। ফলাফলে মাত্র একটা Row,
                Payment 11। Payment 13 আর 20 উধাও।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা Module 03 এর{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL এর লেসনে
                </Link>{" "}
                শেখা। একা Row তে একদিকের amount NULL। আর 50000.00 <code className={CODE}>&lt;&gt;</code> NULL এর
                উত্তর সত্যও না, মিথ্যাও না, অজানা। WHERE শুধু সত্য Row রাখে, তাই দুটো একা Row চুপচাপ পড়ে গেল।
                মজার ব্যাপার, ঠিক যে দুটো Row সবচেয়ে জরুরি, সেগুলোই হারাল। কোনো Error নেই, শুধু একটা কম ভয়ের
                Report।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানও সেই লেসনেই আছে: <code className={CODE}>IS DISTINCT FROM</code>। এর কাছে NULL আর একটা
                সংখ্যা স্পষ্টভাবে আলাদা, আর দুটো NULL একই। তাই একটা শর্তেই তিন রকম অমিল ধরা পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="<> বনাম IS DISTINCT FROM"
              query={`SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE p.amount_bdt <> s.amount_bdt;

SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id,
       p.status,
       p.amount_bdt AS db_amount,
       s.amount_bdt AS statement_amount
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE p.amount_bdt IS DISTINCT FROM s.amount_bdt
ORDER BY 1;`}
              caption="প্রথম Query তে এক Row, শুধু 11। দ্বিতীয় Query তে তিনটা: 11 এর টাকা আলাদা, 13 Statement এ নেই, 20 Database এ নেই। status Column টা দেখুন: Payment 13 failed, মানে টাকা আসলে কাটেইনি, তাই Statement এ না থাকাটাই স্বাভাবিক। Payment 20 এর status NULL, কারণ Database এ এর কোনো Row ই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তিনটা Row এর মানে বুঝে নিন, কারণ হিসাব মেলানোর আসল কাজ এখান থেকেই শুরু:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Payment 11:</strong> Database এ 15600.00, Statement এ 15000.00। ছয়শো টাকার অমিল।
                  Accounts এর কেউ Gateway কে জিজ্ঞেস করবেন, Fee কেটেছে নাকি কোথাও ভুল।
                </ListItem>
                <ListItem>
                  <strong>Payment 13:</strong> failed, টাকা কাটেনি, তাই Statement এ নেই। এটা আসলে কোনো সমস্যা না,
                  কিন্তু Query সেটা জানে না। এরকম জানা কারণগুলো পরে বাদ দেওয়ার নিয়ম যোগ করা যায়।
                </ListItem>
                <ListItem>
                  <strong>Payment 20:</strong> 9500.00 টাকা কাটা হয়েছে, কিন্তু Database এ এর কোনো চিহ্ন নেই। কোন
                  Customer, কোন Booking, কেউ জানে না। এটাই আজকের সবচেয়ে জরুরি কাজ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              starter={`SELECT ...
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE ...;`}
              task={
                <>
                  শুধু দুই দিকের একা Payment, মানে যেগুলো একটা উৎসে আছে কিন্তু অন্যটায় নেই। টাকার অমিল এখানে
                  চাই না। তিনটা Column এই ক্রমে: দুই দিক মিলিয়ে একটা <code className={CODE}>payment_id</code>,
                  Database এর টাকা, Statement এর টাকা। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  একা Row চেনার নিয়ম Section 005 এর: দুই দিকের Primary Key এর যেকোনো একটা NULL। এখানে{" "}
                  <code className={CODE}>p.payment_id</code> আর <code className={CODE}>s.payment_id</code>।
                </>
              }
              solution={`SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id,
       p.amount_bdt AS db_amount,
       s.amount_bdt AS statement_amount
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE p.payment_id IS NULL
   OR s.payment_id IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "where-after-full",
      subHeader: { index: "010", title: "WHERE After a FULL JOIN" },
      title: <SectionTitle>WHERE বসালেই FULL আর FULL থাকে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বৈঠকের আগের দিন ফারুক সাহেব তালিকায় একটা বদল চাইলেন: বন্ধ ট্যুরগুলো বাদ, মানে Saint Martin
                Luxury Stay, যার is_active false। তানিম FULL JOIN এর শেষে লিখলেন{" "}
                <code className={CODE}>WHERE t.is_active</code>। আশা ছিল দশ থেকে নয়টা Row, শুধু Luxury Stay বাদ।
                এল আটটা। Nazmul Karim ও হারিয়ে গেছেন।
              </ContentParagraph>
              <ContentParagraph>
                মনে রাখুন, WHERE চলে Join শেষ হওয়ার পরে, তৈরি হয়ে যাওয়া দশটা Row এর উপর। Nazmul এর Row তে
                ট্যুরের দিকের সব Column NULL, তাই t.is_active ও NULL। NULL কে WHERE সত্য মনে করে না, তাই Row টা
                বাদ। ফলাফল: যে শর্ত শুধু ট্যুর বাছাইয়ের জন্য লেখা, সেটা বামের একা Row গুলোকেও মুছে দিল। FULL JOIN
                চুপচাপ RIGHT JOIN এর মতো আচরণ শুরু করল। LEFT JOIN এর বেলাতেও একই ফাঁদ আছে, যেটা{" "}
                <Link href="/sql/topic/multi-table-joins" className={LINK}>
                  Lesson 07
                </Link>{" "}
                এ বিস্তারিত দেখবেন। FULL এ ফাঁদটা দুই দিকেই পাতা থাকে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান একটা লাইন: শর্তটা যে দিকের Column এর উপর, সেই দিকের একা Row কে স্পষ্ট করে ছাড় দিন।{" "}
                <code className={CODE}>WHERE t.is_active OR t.tour_id IS NULL</code> মানে &ldquo;চালু ট্যুর, অথবা
                এমন Row যেখানে ট্যুরই নেই&rdquo;। এবার নয়টা Row, Nazmul ফিরে এসেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ আর তার মেরামত"
              query={`SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
WHERE t.is_active
ORDER BY g.guide_id NULLS LAST, t.tour_id;

SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
WHERE t.is_active
   OR t.tour_id IS NULL
ORDER BY g.guide_id NULLS LAST, t.tour_id;`}
              caption="প্রথম Query তে আটটা Row: Luxury Stay বাদ, যেমন চাওয়া হয়েছিল, কিন্তু Nazmul ও বাদ, যেটা চাওয়া হয়নি। Ratargul টিকে গেছে, কারণ তার is_active true, Guide না থাকলেও। দ্বিতীয় Query তে নয়টা, Nazmul ফিরে এসেছেন। একই নিয়ম Guide এর দিকের শর্তেও খাটে: g এর কোনো Column এ শর্ত দিলে OR g.guide_id IS NULL যোগ করতে হয়।"
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
                  সব Guide আর শুধু চালু ট্যুর। যে Guide এর কোনো চালু ট্যুর নেই, তিনিও তালিকায় থাকবেন, আর Guide
                  ছাড়া চালু ট্যুরও থাকবে। দুটো Column: <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>title</code>। Row এর ক্রম যেকোনো। নয়টা Row আসার কথা।
                </>
              }
              hint={
                <>
                  FULL JOIN এর পরে <code className={CODE}>WHERE t.is_active OR t.tour_id IS NULL</code>। শুধু{" "}
                  <code className={CODE}>WHERE t.is_active</code> দিলে আটটা আসবে।
                </>
              }
              solution={`SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id
WHERE t.is_active
   OR t.tour_id IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "conditions-in-on",
      subHeader: { index: "011", title: "Conditions in ON" },
      title: <SectionTitle>ON এ শর্ত: কেউ বাদ যায় না, কিন্তু কেউ মিথ্যা বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LEFT JOIN নিয়ে একটা পরিচিত পরামর্শ আছে: একদিকের শর্ত WHERE এর বদলে ON এ বসালে বাম দিকের Row
                হারায় না, Lesson 07 এ যেটা বিস্তারিত দেখবেন। তানিম ভাবলেন, FULL JOIN এও তাহলে শর্তটা ON এ নিয়ে যাই:{" "}
                <code className={CODE}>ON t.guide_id = g.guide_id AND t.is_active</code>। Query চলল, দশটা Row,
                Nazmul আছেন। কিন্তু তালিকার শেষে একটা নতুন লাইন: Saint Martin Luxury Stay, পাশে Guide এর ঘর
                খালি। অথচ এই ট্যুরের Guide আছেন, Ayesha Siddiqua।
              </ContentParagraph>
              <ContentParagraph>
                FULL JOIN এ ON এর কাজ একটাই: ঠিক করা কোন দুটো Row একটা জোড়া। ON কখনো কোনো Row ফেলে দেয় না,
                কারণ FULL JOIN দুই দিকের সবাইকে রাখার কথা দিয়েছে। শর্ত যোগ করায় Luxury Stay আর Ayesha এর জোড়া
                আর মিল বলে গণ্য হলো না। তাই Luxury Stay ডানের একা Row হয়ে ফিরল, যেন তার কোনো Guide নেই। Row
                সংখ্যা ঠিক, কিন্তু একটা Row মিথ্যা বলছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OnVsWhereSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই শর্ত, ON এ"
              query={`SELECT g.full_name, t.title, t.is_active
FROM guides AS g
FULL JOIN tours AS t
  ON t.guide_id = g.guide_id
 AND t.is_active
ORDER BY g.guide_id NULLS LAST, t.tour_id;`}
              caption="দশটা Row। Ayesha Siddiqua এখন শুধু Bandarban Hill Trek এর সাথে। শেষ Row তে Saint Martin Luxury Stay, is_active f, আর full_name খালি। বন্ধ ট্যুরটা বাদ যায়নি, উল্টো একটা ভুল দাবি নিয়ে এসেছে: এর কোনো Guide নেই। এই তালিকা দেখে কেউ Luxury Stay এর জন্য নতুন Guide খুঁজতে নামতে পারেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "FULL JOIN এ একদিকের Row ছাঁকার ঠিক জায়গা",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                FULL JOIN এ ON শুধু মেলানোর নিয়ম, আর WHERE এর বেলায় অন্য দিকের একা Row কে ছাড় দিতে হয়।
                সবচেয়ে পরিষ্কার পথ হলো Join এর আগেই সেই Table ছেঁকে নেওয়া, মানে শুধু চালু ট্যুরগুলোকে একটা
                ছোট Table বানিয়ে তারপর FULL JOIN। এর জন্য লাগে Subquery বা CTE, যেটা{" "}
                <Link href="/sql/topic/subqueries-ctes-overview" className={LINK}>
                  Module 07
                </Link>{" "}
                এর বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                ততদিন নিয়ম দুটো: মেলানোর শর্ত ON এ, বাছাইয়ের শর্ত WHERE এ, সাথে একা Row এর ছাড়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "limits",
      subHeader: { index: "012", title: "When Not to Use It" },
      title: <SectionTitle>FULL যখন আসলে LEFT, আর যে শর্ত FULL নেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FULL JOIN শিখে ফেলার পর সব জায়গায় সেটা লিখতে ইচ্ছা করে, &ldquo;নিরাপদ থাকার জন্য&rdquo;। কিন্তু
                অনেক Join এ এক দিকের একা Row থাকা অসম্ভব, কারণ Database নিজেই সেটা আটকায়। tours এর
                destination_id একটা Foreign Key, আর NOT NULL। তাই এমন কোনো ট্যুর থাকতে পারে না যার Destination
                নেই। destinations FULL JOIN tours এ ডানের একা Row কখনো আসবে না, তাই ফলাফল হুবহু destinations
                LEFT JOIN tours এর সমান।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে সমস্যা কোথায়? ফলাফল একই, কিন্তু Query পড়ে যিনি বুঝতে চাইবেন, তিনি ভাববেন দুই দিকেই একা
                Row আসতে পারে, আর খামোখা খুঁজবেন। Query তে লেখা Join এর নাম একটা বার্তা। FULL লিখলে বলা হয়
                &ldquo;দুই দিকেই অনাথ থাকতে পারে&rdquo;। যেখানে তা সম্ভব না, সেখানে LEFT লিখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Foreign Key থাকলে FULL = LEFT"
              query={`SELECT count(*) AS full_rows
FROM destinations AS d
FULL JOIN tours AS t ON t.destination_id = d.destination_id;

SELECT count(*) AS left_rows
FROM destinations AS d
LEFT JOIN tours AS t ON t.destination_id = d.destination_id;

SELECT d.name, t.title
FROM destinations AS d
FULL JOIN tours AS t ON t.destination_id = d.destination_id
WHERE d.destination_id IS NULL
   OR t.tour_id IS NULL;`}
              caption="দশ আর দশ, একই সংখ্যা। একা Row খুঁজলে আসে একটাই: Kuakata, যেখানে কোনো ট্যুর নেই। উল্টো দিকের একা Row নেই, Foreign Key তা হতে দেয় না। এখানে LEFT JOIN ই সৎ নাম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  tours আর departures কে FULL JOIN দিয়ে জুড়ে শুধু একা Row গুলো দেখান: ট্যুরের{" "}
                  <code className={CODE}>title</code> আর Departure এর <code className={CODE}>starts_on</code>, এই
                  ক্রমে। কয়টা Row এল, আর কোন দিকের একা Row একটাও এল না, সেটা খেয়াল করুন।
                </>
              }
              hint={
                <>
                  শর্ত <code className={CODE}>d.tour_id = t.tour_id</code>, তারপর{" "}
                  <code className={CODE}>WHERE d.departure_id IS NULL OR t.tour_id IS NULL</code>।
                </>
              }
              solution={`SELECT t.title, d.starts_on
FROM tours AS t
FULL JOIN departures AS d ON d.tour_id = t.tour_id
WHERE d.departure_id IS NULL
   OR t.tour_id IS NULL;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক Row: Cox&apos;s Bazar Family Package, যার কোনো Departure নেই। Departure ছাড়া ট্যুর থাকতে পারে,
                কিন্তু ট্যুর ছাড়া Departure পারে না, কারণ departures এর tour_id ও Foreign Key। এই জোড়াতেও FULL
                আর LEFT একই।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় সীমাটা PostgreSQL এর একটা নিয়ম। FULL JOIN এর ON এ মেলানোর শর্ত সমান চিহ্ন দিয়ে হতে
                হয়, মানে দুই দিকের মান সমান কিনা। বড় বা ছোট দিয়ে FULL JOIN লিখলে PostgreSQL সরাসরি না বলে দেয়।
                INNER বা LEFT JOIN এ এমন শর্ত চলে, FULL এ চলে না। কারণ PostgreSQL FULL JOIN চালাতে যে দুটো
                পদ্ধতি ব্যবহার করে, Merge Join আর Hash Join (Module 13 এ দেখবেন), দুটোই সমান চিহ্নের শর্তের উপর
                দাঁড়ানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সমান চিহ্ন ছাড়া FULL JOIN"
              query={`SELECT g.full_name, t.title
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id > g.guide_id;`}
              caption="ERROR: FULL JOIN is only supported with merge-joinable or hash-joinable join conditions। কথাটার সহজ মানে: FULL JOIN এ শর্ত হতে হবে সমান চিহ্নের। বাস্তবে এটা প্রায় কখনো বাধা হয় না, কারণ হিসাব মেলানোর Join সবসময় নম্বর বা কোডের সমতা দিয়েই হয়।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ FULL JOIN নেই, আর একটা চুপচাপ ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL কোর্সটা দেখছেন, সেখানে INNER, LEFT আর RIGHT JOIN আছে, FULL নেই। কারণ MySQL এ
                FULL OUTER JOIN নেই। MySQL 8.4 এ লিখলে সোজা Syntax Error আসে। Error আসাটা ভালো, কারণ অন্তত জানা
                যায় কিছু ভুল হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                বিপদ হলো যখন Error আসে না। MySQL এ FULL শব্দটা সংরক্ষিত না, তাই Table এর পরে লিখলে MySQL
                সেটাকে Table এর Alias মনে করে। <code className={CODE}>FROM guides FULL JOIN tours USING (guide_id)</code>{" "}
                MySQL এর চোখে হলো: guides Table, যার ডাকনাম FULL, তার সাথে সাধারণ JOIN। Query চলে, কোনো
                সতর্কবার্তা নেই, আর আসে আটটা Row, মানে INNER JOIN এর ফলাফল। দুই দিকের একা Row দুটোই নিঃশব্দে
                হারাল। Table এর নিজের Alias থাকলে, যেমন <code className={CODE}>guides g FULL JOIN</code>, তখন
                অবশ্য Syntax Error আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-full-join.sql",
          code: `-- MySQL 8.4, আসল Output

SELECT g.full_name, t.title
FROM guides g FULL OUTER JOIN tours t ON t.guide_id = g.guide_id;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ...
--   near 'FULL OUTER JOIN tours t ON t.guide_id = g.guide_id'

SELECT COUNT(*) AS rows_back
FROM guides FULL JOIN tours USING (guide_id);
-- rows_back: 8      কোনো Error নেই! FULL এখানে guides এর Alias,
--                   তাই এটা আসলে একটা সাধারণ INNER JOIN`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ FULL JOIN এর ফলাফল পেতে হলে দুই টুকরো জোড়া লাগাতে হয়। প্রথম টুকরো LEFT JOIN, যেটা মিল
                আর বামের একা Row দেয়। দ্বিতীয় টুকরো RIGHT JOIN, কিন্তু{" "}
                <code className={CODE}>WHERE g.guide_id IS NULL</code> দিয়ে শুধু ডানের একা Row রাখা, কারণ মিলগুলো
                প্রথম টুকরোতেই আছে। তারপর UNION ALL দুই টুকরোর Row গুলো একটার নিচে আরেকটা বসায়। UNION আর
                UNION ALL নিয়ে বিস্তারিত{" "}
                <Link href="/sql/topic/set-operations" className={LINK}>
                  Module 07 এ
                </Link>
                , এখানে শুধু এটুকু জানলেই চলবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MysqlEmulationDiagram />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-full-join-emulation.sql",
          code: `-- MySQL 8.4: FULL JOIN এর বদলে দুই টুকরো
SELECT g.full_name, t.title
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id      -- মিল + শুধু বামের: 9

UNION ALL

SELECT g.full_name, t.title
FROM guides g
RIGHT JOIN tours t ON t.guide_id = g.guide_id
WHERE g.guide_id IS NULL;                         -- শুধু ডানের: 1
-- মোট 10 Row, PostgreSQL এর FULL JOIN এর সমান

-- MySQL এ VALUES দিয়ে Table বানাতে প্রতিটা Row এর আগে ROW লাগে:
-- (VALUES ROW(1, 'Jamal Hossain'), ROW(6, 'Tasnim Ara')) AS r (guide_id, full_name)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অনেক জায়গায় দেখবেন UNION ALL এর বদলে শুধু UNION, আর দ্বিতীয় টুকরোয় WHERE নেই। UNION নিজে থেকে
              একই রকম দেখতে Row গুলো এক করে দেয়, তাই মিলের Row দুইবার আসে না। ছোট উদাহরণে ঠিক দেখায়, কিন্তু
              ফলাফলের দুটো আসল আলাদা Row যদি দেখতে হুবহু এক হয়, UNION তাদেরও এক করে ফেলে। নিচের বক্সে
              PostgreSQL এ একই পরীক্ষা: Guide এর ভাষা আর ট্যুরের দিনের সংখ্যা বাছলে UNION দশটা আসল Row কে
              ছয়টায় নামিয়ে আনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UNION আসল Row খেয়ে ফেলে"
              query={`SELECT count(*) AS full_join_rows
FROM guides AS g
FULL JOIN tours AS t ON t.guide_id = g.guide_id;

SELECT count(*) AS union_rows
FROM (
  SELECT g.language, t.duration_days
  FROM guides AS g LEFT JOIN tours AS t ON t.guide_id = g.guide_id
  UNION
  SELECT g.language, t.duration_days
  FROM guides AS g RIGHT JOIN tours AS t ON t.guide_id = g.guide_id
) AS pieces;

SELECT count(*) AS union_all_rows
FROM (
  SELECT g.language, t.duration_days
  FROM guides AS g LEFT JOIN tours AS t ON t.guide_id = g.guide_id
  UNION ALL
  SELECT g.language, t.duration_days
  FROM guides AS g RIGHT JOIN tours AS t ON t.guide_id = g.guide_id
  WHERE g.guide_id IS NULL
) AS pieces;`}
              caption="10, 6, 10। ভাষা আর দিনের জোড়া অনেক ট্যুরে একই, যেমন Bangla আর 3 তিনটা আলাদা ট্যুরে। UNION সেগুলোকে একটা করে ফেলেছে। UNION ALL আর WHERE g.guide_id IS NULL দিলে ঠিক দশটা থাকে। এখানে FROM এর ভেতরের বন্ধনী একটা Subquery, যেটা Module 07 এর বিষয়, এখানে শুধু গুনে দেখানোর জন্য। MySQL 8.4 এ একই তিনটা Query চালিয়ে একই 10, 6, 10 পাওয়া গেছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর মাসিক Reconciliation Report</SectionTitle>,
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
                বাস্তবে Island Tours এর হিসাব মেলানো একবারের কাজ না। প্রতি মাসের প্রথম কর্মদিবসে Accounts এর
                কাছে Gateway থেকে আগের মাসের Statement আসে, সাধারণত একটা CSV ফাইল হিসেবে। সেই ফাইল Database এর
                একটা আলাদা Table এ তোলা হয় (ফাইল থেকে Row তোলা Module 10 এ শিখবেন), আর তারপর ঠিক এই লেসনের
                মতো একটা FULL JOIN চলে। Report এ থাকে শুধু অমিলগুলো, প্রতিটার পাশে লেখা কী ধরনের সমস্যা, যাতে
                পড়ে বোঝা যায় কোনটা আগে ধরতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                একই ধরনের FULL JOIN আরও কয়েক জায়গায় চলে। HR এর Roster আর guides Table, যেমন Section 006 এ
                দেখেছেন। গত সপ্তাহের Departure তালিকা আর এই সপ্তাহের, কোন তারিখ যোগ হলো আর কোনটা বাদ গেল।
                Booking Partner এর পাঠানো তালিকা আর নিজেদের bookings। প্রতিটার কাঠামো একই: দুই উৎস, একটা মিলের
                Key, আর তিন রকম Row।
              </ContentParagraph>
              <ContentParagraph>
                এবার পুরো Report টা নিজে লিখুন। এটাই এই লেসনের Challenge।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`SELECT ...
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE ...
ORDER BY ...;`}
              task={
                <>
                  রুমানা আপার Report: শুধু অমিলগুলো, চারটা Column এই ক্রমে। দুই দিক মিলিয়ে একটা{" "}
                  <code className={CODE}>payment_id</code>, Database এর টাকা, Statement এর টাকা, আর একটা{" "}
                  <code className={CODE}>problem</code> Column যেখানে লেখা থাকবে{" "}
                  <code className={CODE}>missing from statement</code>,{" "}
                  <code className={CODE}>unknown to our database</code> অথবা{" "}
                  <code className={CODE}>amount differs</code>। payment_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  ছাঁকার জন্য <code className={CODE}>WHERE p.amount_bdt IS DISTINCT FROM s.amount_bdt</code>, তাহলে
                  তিন রকম অমিলই আসে। problem এর জন্য CASE: আগে দেখুন s.payment_id NULL কিনা, তারপর p.payment_id,
                  বাকি থাকলে টাকা আলাদা।
                </>
              }
              solution={`SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id,
       p.amount_bdt AS db_amount,
       s.amount_bdt AS statement_amount,
       CASE
         WHEN s.payment_id IS NULL THEN 'missing from statement'
         WHEN p.payment_id IS NULL THEN 'unknown to our database'
         ELSE 'amount differs'
       END AS problem
FROM payments AS p
FULL JOIN ${STATEMENT_VALUES}
  ON s.payment_id = p.payment_id
WHERE p.amount_bdt IS DISTINCT FROM s.amount_bdt
ORDER BY 1;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ঠিক লিখলে তিনটা Row আসবে: 11 amount differs, 13 missing from statement, 20 unknown to our
              database। WHERE এ <code className={CODE}>&lt;&gt;</code> দিলে শুধু 11 আসবে, আর Report দেখে মনে হবে
              সব প্রায় ঠিক আছে। সেটাই এই লেসনের সবচেয়ে দামি শিক্ষা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো দুই তালিকা মেলানোর ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "দুই উৎস আর মিলের Key ঠিক করুন",
              description:
                "কোন দুটো তালিকা, আর কোন Column দুই তালিকায় একই জিনিসের পরিচয়: payment_id, guide_id, অথবা কোনো কোড।",
            },
            {
              title: "জিজ্ঞেস করুন, দুই দিকেই কি একা Row সম্ভব?",
              description:
                "Foreign Key যদি এক দিকের অনাথ আটকে দেয়, তাহলে LEFT JOIN ই যথেষ্ট আর সৎ। দুই দিকেই সম্ভব হলে FULL।",
            },
            {
              title: "শর্ত ছাড়া FULL JOIN চালিয়ে গুনুন",
              description:
                "আগে মোট Row গুনুন, তারপর FILTER দিয়ে তিন স্তূপ। মিল + বামের একা + ডানের একা = মোট, মিলে গেলে Join ঠিক।",
            },
            {
              title: "Key এর জন্য COALESCE, একা Row এর জন্য Primary Key",
              description:
                "দেখানো আর সাজানোর জন্য COALESCE(a.key, b.key)। একা Row চিনতে দুই দিকের Primary Key IS NULL।",
            },
            {
              title: "অমিল ছাঁকুন IS DISTINCT FROM দিয়ে",
              description:
                "<> দিলে NULL এর Row হারায়। IS DISTINCT FROM একসাথে টাকার অমিল আর দুই দিকের একা Row ধরে।",
            },
            {
              title: "লেবেল দিন, সাজান, আর একটা Row হাতে মিলিয়ে দেখুন",
              description:
                "CASE দিয়ে সমস্যার নাম, ORDER BY দিয়ে ক্রম। তারপর একটা অমিল Row নিয়ে দুই উৎসে আলাদা করে খুঁজে নিশ্চিত হোন।",
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
            [
              "WHERE এ একদিকের Column এর শর্ত",
              "অন্য দিকের একা Row NULL এর কারণে বাদ পড়ে, FULL চুপচাপ LEFT বা RIGHT হয়ে যায়",
              "OR সেই দিকের Primary Key IS NULL যোগ করুন",
            ],
            [
              "একদিকের বাছাই ON এ",
              "কোনো Row বাদ যায় না, কিন্তু আসল জোড়া ভেঙে একা Row হয়ে মিথ্যা দাবি করে",
              "বাছাই WHERE এ ছাড়সহ, অথবা Join এর আগে ছেঁকে নিন (Module 07)",
            ],
            [
              "অমিল খুঁজতে <>",
              "NULL এর সাথে তুলনা অজানা, তাই দুই দিকের একা Row হারায়",
              "IS DISTINCT FROM",
            ],
            [
              "NULL হতে পারে এমন Column দিয়ে একা Row চেনা",
              "আসল Row যার সেই Column NULL, সেটাও একা বলে ধরা পড়ে",
              "দুই দিকের Primary Key দিয়ে পরীক্ষা",
            ],
            [
              "Key দেখানো বা সাজানো একদিকের Column দিয়ে",
              "অন্য দিকের একা Row এর ঘর খালি, ক্রম এলোমেলো",
              "COALESCE(a.key, b.key), অথবা নাম এক হলে USING",
            ],
            [
              "Foreign Key থাকা সত্ত্বেও FULL",
              "ফলাফল LEFT এর সমান, কিন্তু পাঠক অকারণে দুই দিকের অনাথ খোঁজেন",
              "যেখানে এক দিকের অনাথ অসম্ভব, সেখানে LEFT JOIN",
            ],
            [
              "MySQL এ FULL JOIN লেখা",
              "Alias থাকলে Error, না থাকলে FULL হয়ে যায় Alias আর ফলাফল INNER",
              "LEFT JOIN UNION ALL RIGHT JOIN ... WHERE বাম IS NULL",
            ],
            [
              "Emulation এ শুধু UNION",
              "দেখতে এক রকম আসল Row গুলো এক হয়ে যায়, 10 থেকে 6",
              "UNION ALL, দ্বিতীয় টুকরোয় শুধু ডানের একা Row",
            ],
            [
              "count(*) দিয়ে প্রতিটা দিকের সংখ্যা",
              "একা Row ও 1 হিসেবে গোনা হয়, যেমন Nazmul এর ট্যুর 1",
              "count(t.tour_id) বা FILTER দিয়ে নির্দিষ্ট স্তূপ",
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
                  <a
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : Joined Tables অংশে FULL OUTER JOIN এর আনুষ্ঠানিক সংজ্ঞা, ON আর USING এর পার্থক্য, আর ON এর
                  শর্ত বনাম WHERE এর শর্তের সতর্কতা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/tutorial-join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Joins Between Tables
                  </a>
                  : সব Join একসাথে, ছোট উদাহরণে। Outer Join এর অংশটা এই লেসনের সাথে মিলিয়ে পড়ুন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: JOIN Clause
                  </a>
                  : MySQL কোন কোন Join সমর্থন করে তার পুরো Syntax। সেখানে FULL এর কোনো উল্লেখ নেই, সেটাই উত্তর।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/union.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: UNION Clause
                  </a>
                  : UNION আর UNION ALL এর পার্থক্য, Emulation লেখার আগে একবার পড়ে নিন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Join_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Join (SQL)
                  </a>
                  : Full outer join অংশে একই ধারণা অন্য উদাহরণে, আর বিভিন্ন Database এ এর সমর্থনের কথা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Joins এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে, তাই সেখানে INNER, LEFT আর RIGHT JOIN পাবেন, FULL পাবেন না। এই লেসনের
                  Section 013 সেই ফাঁকটা পূরণ করে।
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
                  <strong>FULL OUTER JOIN</strong> দুই Table এর প্রতিটা Row রাখে। ফলাফলের প্রতিটা Row তিন রকমের
                  একটা: মিল, শুধু বামের, শুধু ডানের। OUTER শব্দটা ঐচ্ছিক।
                </ListItem>
                <ListItem>
                  guides আর tours এ INNER 8, LEFT 9, RIGHT 9, FULL 10। FULL = INNER + বামের একা + ডানের একা।
                </ListItem>
                <ListItem>
                  একা Row চিনুন দুই দিকের Primary Key IS NULL দিয়ে, NULL হতে পারে এমন Column দিয়ে না।
                </ListItem>
                <ListItem>
                  দুই দিকের Key এক Column এ আনতে COALESCE, নাম এক হলে USING নিজেই সেটা করে দেয়।
                </ListItem>
                <ListItem>
                  হিসাব মেলানো FULL JOIN এর আসল কাজ। অমিল ছাঁকতে IS DISTINCT FROM, কারণ{" "}
                  <code className={CODE}>&lt;&gt;</code> দুই দিকের একা Row চুপচাপ ফেলে দেয়: তিনটার জায়গায় এক।
                </ListItem>
                <ListItem>
                  WHERE এ একদিকের শর্ত দিলে অন্য দিকের একা Row হারায়, ছাড় দিন OR ... IS NULL দিয়ে। ON এ
                  শর্ত দিলে কেউ হারায় না, কিন্তু আসল জোড়া ভেঙে মিথ্যা একা Row তৈরি হয়।
                </ListItem>
                <ListItem>
                  Foreign Key এক দিকের অনাথ আটকালে FULL আর LEFT একই, তখন LEFT লিখুন। PostgreSQL এ FULL JOIN
                  এর শর্ত সমান চিহ্নের হতে হয়।
                </ListItem>
                <ListItem>
                  MySQL এ FULL JOIN নেই। লিখলে Error, অথবা আরও খারাপ, FULL শব্দটা Alias হয়ে INNER JOIN। বদলে
                  LEFT JOIN UNION ALL RIGHT JOIN, দ্বিতীয়টায় শুধু ডানের একা Row।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এ পর্যন্ত প্রতিটা Join একটা শর্ত দিয়ে Row মিলিয়েছে। পরের লেসনে এমন একটা Join, যেটা কোনো শর্তই
                দেখে না: প্রতিটা Row এর সাথে অন্য দিকের প্রতিটা Row। শুনতে অদ্ভুত, কিন্তু ঠিক জায়গায় দারুণ কাজের,
                আর ভুল জায়গায় এক নিমেষে লাখ লাখ Row বানিয়ে ফেলে। সেটা{" "}
                <Link href="/sql/topic/cross-join" className={LINK}>
                  CROSS JOIN and Accidental Cartesian Products
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
      ["FULL OUTER JOIN", "দুই দিকের সব Row রাখে, মিল না পেলে অন্য দিকে NULL", "guides FULL JOIN tours: 10 Row"],
      ["তিন রকম Row", "মিল, শুধু বামের, শুধু ডানের", "8 জোড়া, Nazmul, Ratargul"],
      ["Join এর হিসাব", "FULL = INNER + বামের একা + ডানের একা", "10 = 8 + 1 + 1"],
      ["বাম আর ডান", "FULL এ Table এর ক্রম Row বদলায় না", "tours FULL JOIN guides ও 10"],
      ["একা Row খোঁজা", "দুই দিকের Primary Key IS NULL, OR দিয়ে", "g.guide_id IS NULL OR t.tour_id IS NULL"],
      ["COALESCE এর Key", "দুই ঘরের Key এক Column এ", "COALESCE(g.guide_id, r.guide_id)"],
      ["USING", "নাম এক হলে মিলিয়ে দেওয়া একটাই Column", "FULL JOIN tours USING (guide_id)"],
      ["VALUES", "Query এর ভেতরে হাতে লেখা ছোট Table", "HR Roster, Gateway Statement"],
      ["Reconciliation", "দুই উৎসের অমিল খোঁজা", "Payment 11, 13, 20"],
      ["<> বনাম IS DISTINCT FROM", "NULL এর সাথে <> অজানা, তাই একা Row হারায়", "এক Row বনাম তিন Row"],
      ["WHERE এর ফাঁদ", "একদিকের শর্ত অন্য দিকের একা Row মুছে দেয়", "WHERE t.is_active: Nazmul উধাও"],
      ["ON এর ফাঁদ", "কেউ বাদ যায় না, কিন্তু জোড়া ভেঙে মিথ্যা একা Row", "Luxury Stay Guide ছাড়া দেখায়"],
      ["FULL যখন LEFT", "Foreign Key এক দিকের অনাথ আটকায়", "destinations আর tours: 10 = 10"],
      ["MySQL", "FULL নেই, LEFT UNION ALL RIGHT এর শুধু ডানের অংশ", "UNION দিলে 10 থেকে 6"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "FULL OUTER JOIN এর ফলাফলে কোন Row গুলো থাকে?",
        options: [
          {
            key: "A",
            text: "শুধু যে Row গুলো দুই Table এ মেলে",
            isCorrect: false,
            explanation: "সেটা INNER JOIN। FULL এর সাথে আরও দুই রকম Row থাকে।",
          },
          {
            key: "B",
            text: "বাম Table এর সব Row, আর ডানের শুধু মিলে যাওয়াগুলো",
            isCorrect: false,
            explanation: "সেটা LEFT JOIN। ডানের একা Row এখানে হারায়।",
          },
          {
            key: "C",
            text: "মিলে যাওয়া জোড়া, বামের একা Row আর ডানের একা Row, সবাই",
            isCorrect: true,
            explanation: "ঠিক। FULL দুই দিকের কাউকে বাদ দেয় না, একা Row গুলোর অন্য দিকে NULL বসায়।",
          },
          {
            key: "D",
            text: "দুই Table এর প্রতিটা Row এর সাথে অন্যটার প্রতিটা Row",
            isCorrect: false,
            explanation: "সেটা CROSS JOIN, পরের লেসনের বিষয়। FULL JOIN একটা মেলানোর শর্ত মানে।",
          },
        ],
      },
      {
        id: 2,
        text: "guides আর tours এ INNER JOIN দেয় 8 Row, LEFT JOIN 9, RIGHT JOIN 9। FULL JOIN কয়টা দেবে?",
        options: [
          {
            key: "A",
            text: "9",
            isCorrect: false,
            explanation: "9 হতো যদি শুধু এক দিকে একা Row থাকত। এখানে দুই দিকেই একজন করে আছে।",
          },
          {
            key: "B",
            text: "10",
            isCorrect: true,
            explanation: "ঠিক। বামের একা = 9 থেকে 8 = 1, ডানের একা = 1, তাই FULL = 8 + 1 + 1 = 10।",
          },
          {
            key: "C",
            text: "18",
            isCorrect: false,
            explanation: "LEFT আর RIGHT যোগ করলে মিলগুলো দুইবার গোনা হয়। মিল একবারই আসে।",
          },
          {
            key: "D",
            text: "45",
            isCorrect: false,
            explanation: "5 গুণ 9 হলো CROSS JOIN এর Row সংখ্যা, FULL JOIN এর না।",
          },
        ],
      },
      {
        id: 3,
        text: "FULL JOIN এর পরে শুধু একা Row গুলো পেতে কোন WHERE সবচেয়ে নির্ভরযোগ্য?",
        options: [
          {
            key: "A",
            text: "WHERE g.guide_id IS NULL OR t.tour_id IS NULL",
            isCorrect: true,
            explanation: "ঠিক। দুই দিকের Primary Key, যা আসল Row তে কখনো NULL না। NULL মানেই সেই দিকের Row নেই।",
          },
          {
            key: "B",
            text: "WHERE t.guide_id IS NULL",
            isCorrect: false,
            explanation: "এই Data তে কাকতালীয়ভাবে মেলে, কিন্তু guide_id একটা NULL হতে পারে এমন Column। নিয়ম হিসেবে ভরসা করা যায় না।",
          },
          {
            key: "C",
            text: "WHERE g.guide_id IS NULL AND t.tour_id IS NULL",
            isCorrect: false,
            explanation: "দুই দিকই একসাথে NULL কোনো Row তে হয় না, তাই এটা খালি ফলাফল দেয়।",
          },
          {
            key: "D",
            text: "WHERE g.guide_id <> t.guide_id",
            isCorrect: false,
            explanation: "একা Row তে একদিক NULL, আর NULL এর সাথে <> অজানা, তাই একা Row গুলোই বাদ পড়ে।",
          },
        ],
      },
      {
        id: 4,
        text: "guides FULL JOIN tours এর পরে WHERE t.is_active দিলে 10 থেকে 8 Row হয়। Nazmul Karim কেন হারান?",
        options: [
          {
            key: "A",
            text: "কারণ Nazmul এর is_active false",
            isCorrect: false,
            explanation: "is_active ট্যুরের Column, Guide এর না। Nazmul এর Row তে ট্যুরই নেই।",
          },
          {
            key: "B",
            text: "কারণ তাঁর Row তে ট্যুরের Column গুলো NULL, তাই t.is_active NULL, আর WHERE শুধু সত্য Row রাখে",
            isCorrect: true,
            explanation: "ঠিক। WHERE Join এর পরে চলে। ছাড় দিতে লিখুন WHERE t.is_active OR t.tour_id IS NULL।",
          },
          {
            key: "C",
            text: "কারণ FULL JOIN এ WHERE লেখা নিষেধ",
            isCorrect: false,
            explanation: "WHERE চলে, শুধু তার ফলাফল নিয়ে সাবধান থাকতে হয়।",
          },
          {
            key: "D",
            text: "কারণ PostgreSQL FULL JOIN কে নিজে থেকে INNER JOIN বানিয়ে দেয়",
            isCorrect: false,
            explanation: "PostgreSQL কিছু বদলায় না। NULL কে সত্য না ধরার নিয়মই Row টা ফেলে দিয়েছে।",
          },
        ],
      },
      {
        id: 5,
        text: "একই শর্ত ON এ বসালে, মানে ON t.guide_id = g.guide_id AND t.is_active, কী হয়?",
        options: [
          {
            key: "A",
            text: "বন্ধ ট্যুরটা ফলাফল থেকে বাদ যায়, বাকি সব একই",
            isCorrect: false,
            explanation: "FULL JOIN এ ON কোনো Row বাদ দেয় না। বন্ধ ট্যুরটা থাকে, অন্য রূপে।",
          },
          {
            key: "B",
            text: "Error আসে, কারণ ON এ শুধু সমান চিহ্নের শর্ত চলে",
            isCorrect: false,
            explanation: "একটা সমান চিহ্নের শর্ত থাকলেই চলে, বাড়তি AND শর্ত বৈধ।",
          },
          {
            key: "C",
            text: "দশটা Row থাকে, কিন্তু Luxury Stay তার Guide থেকে আলাদা হয়ে ডানের একা Row হয়ে আসে",
            isCorrect: true,
            explanation: "ঠিক। ON শুধু ঠিক করে কোনটা মিল। জোড়াটা আর মিল না, তাই ট্যুরটা Guide ছাড়া দেখায়, যা মিথ্যা।",
          },
          {
            key: "D",
            text: "WHERE এর মতোই 8 Row আসে",
            isCorrect: false,
            explanation: "WHERE আর ON এর ফলাফল এখানে আলাদা: 8 বনাম 10।",
          },
        ],
      },
      {
        id: 6,
        text: "MySQL 8.4 এ SELECT COUNT(*) FROM guides FULL JOIN tours USING (guide_id) চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "10, ঠিক PostgreSQL এর মতো",
            isCorrect: false,
            explanation: "MySQL এ FULL JOIN নেই, তাই 10 আসার কোনো উপায় নেই।",
          },
          {
            key: "B",
            text: "Syntax Error",
            isCorrect: false,
            explanation: "Table এর Alias থাকলে Error আসে। এখানে নেই, তাই MySQL অন্যভাবে পড়ে।",
          },
          {
            key: "C",
            text: "8, কোনো Error ছাড়া, কারণ FULL শব্দটা guides এর Alias হয়ে যায় আর Join টা INNER",
            isCorrect: true,
            explanation: "ঠিক। এটা MySQL 8.4 এ চালিয়ে দেখা আসল ফলাফল। সবচেয়ে বিপজ্জনক, কারণ কোনো সতর্কবার্তা নেই।",
          },
          {
            key: "D",
            text: "9, কারণ MySQL এটাকে LEFT JOIN ধরে",
            isCorrect: false,
            explanation: "MySQL এটাকে সাধারণ JOIN ধরে, LEFT না। তাই একা Row দুটোই হারায়।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL এ FULL JOIN বানাতে LEFT JOIN আর RIGHT JOIN কে UNION দিয়ে জোড়ার চেয়ে UNION ALL কেন নিরাপদ?",
        options: [
          {
            key: "A",
            text: "UNION ALL দ্রুত, ফলাফল একই",
            isCorrect: false,
            explanation: "শুধু গতি না, ফলাফলও আলাদা হতে পারে। language আর duration_days বাছলে UNION 10 থেকে 6 করে।",
          },
          {
            key: "B",
            text: "UNION দেখতে হুবহু এক রকম আসল Row গুলোকেও এক করে ফেলে, UNION ALL রাখে",
            isCorrect: true,
            explanation: "ঠিক। তাই UNION ALL, আর দ্বিতীয় টুকরোয় WHERE বামের Key IS NULL দিয়ে শুধু ডানের একা Row।",
          },
          {
            key: "C",
            text: "UNION শুধু PostgreSQL এ চলে",
            isCorrect: false,
            explanation: "UNION দুই Database এই আছে।",
          },
          {
            key: "D",
            text: "UNION ALL নিজে থেকে NULL বাদ দেয়",
            isCorrect: false,
            explanation: "UNION ALL কিছুই বাদ দেয় না, সেটাই তার গুণ।",
          },
        ],
      },
      {
        id: 8,
        text: "payments আর Gateway Statement এর FULL JOIN এ WHERE p.amount_bdt <> s.amount_bdt দিলে এক Row আসে, IS DISTINCT FROM দিলে তিন। কারণ কী?",
        options: [
          {
            key: "A",
            text: "<> শুধু সংখ্যা তুলনা করে, IS DISTINCT FROM লেখাও",
            isCorrect: false,
            explanation: "দুটোই সংখ্যা তুলনা করতে পারে। পার্থক্য NULL এর বেলায়।",
          },
          {
            key: "B",
            text: "একা Row তে একদিকের amount NULL, আর NULL এর সাথে <> অজানা, তাই WHERE সেগুলো ফেলে দেয়",
            isCorrect: true,
            explanation: "ঠিক। IS DISTINCT FROM NULL আর সংখ্যাকে আলাদা বলে, তাই Payment 13 আর 20 ও ধরা পড়ে।",
          },
          {
            key: "C",
            text: "IS DISTINCT FROM ভুল করে মিলে যাওয়া Row ও দেখায়",
            isCorrect: false,
            explanation: "তিনটা Row ই আসল অমিল: টাকা আলাদা, Statement এ নেই, Database এ নেই।",
          },
          {
            key: "D",
            text: "VALUES Table এর সাথে <> কাজ করে না",
            isCorrect: false,
            explanation: "Payment 11 এর বেলায় <> ঠিকই কাজ করেছে। সমস্যা শুধু NULL এর Row গুলোতে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: দুই তালিকার হিসাব মেলানো",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>চার সংখ্যা, এক যাচাই:</strong> guides আর tours এ INNER, LEFT, RIGHT আর FULL JOIN এর Row গুনুন।
        শুধু এই চারটা সংখ্যা থেকে বামের একা আর ডানের একা Row কয়টা, হিসাব করে লিখুন, তারপর FILTER দিয়ে মিলিয়ে
        দেখুন।
      </span>,
      <span key="2">
        <strong>নিজের Roster:</strong> Section 006 এর HR তালিকা বদলে নিজের একটা তালিকা বানান: একজন Guide
        বাদ দিন, দুজন নতুন নাম যোগ করুন। status লেবেলসহ তুলনার Query চালান, আর ফলাফলের প্রতিটা Row এর পাশে
        এক লাইনে লিখুন HR কে কী জানাতে হবে।
      </span>,
      <span key="3">
        <strong>Reconciliation, নিজের Statement এ:</strong> Gateway Statement এ আরও দুটো অমিল যোগ করুন, একটা টাকা
        আলাদা আর একটা অজানা Payment। <code>&lt;&gt;</code> আর IS DISTINCT FROM দুই রকমে চালিয়ে দুটো ফলাফল রাখুন,
        আর লিখুন কোন সংস্করণ Accounts কে ভুল নিশ্চয়তা দিত।
      </span>,
      <span key="4">
        <strong>WHERE বনাম ON:</strong> is_active এর শর্তটা তিন জায়গায় বসিয়ে চালান: শুধু WHERE, WHERE সাথে ছাড়,
        আর ON। তিনটা ফলাফলের Row সংখ্যা আর একটা করে বিশেষ Row লিখুন, আর বলুন কোনটা ফারুক সাহেবের প্রশ্নের
        সৎ উত্তর।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> দুটো হাজিরা খাতার উদাহরণ দিয়ে একজন বন্ধুকে বোঝান FULL OUTER JOIN
        কী, কোথায় কাজে লাগে, আর MySQL এ কেন সাবধান থাকতে হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">চারটা count আর একা Row এর হিসাব, FILTER দিয়ে যাচাইসহ</span>,
      <span key="d2">নিজের Roster এর Query, ফলাফল আর HR এর জন্য নোট</span>,
      <span key="d3">Reconciliation এর দুটো সংস্করণের Output আর তুলনা</span>,
      <span key="d4">WHERE আর ON এর তিনটা পরীক্ষার ফলাফল আর সিদ্ধান্ত</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ FULL OUTER JOIN",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "চার Join, চার সংখ্যা",
        description:
          "প্রথম ফাইলের চারটা count চালান। 8, 9, 9, 10 মিলিয়ে নিন, আর FULL এর সংখ্যা কেন বাকিদের চেয়ে বেশি, নিজের ভাষায় খাতায় লিখুন।",
      },
      {
        title: "একা Row আর তিন স্তূপ",
        description:
          "দ্বিতীয় ফাইলে একা Row এর তালিকা আর FILTER এর গোনা। psql এ NULL ঘর খালি দেখায়, \\pset null '(null)' দিয়ে দেখা সহজ হয়।",
      },
      {
        title: "Key মেলানো",
        description:
          "তৃতীয় ফাইলে USING আর Roster এর তুলনা। Tasnim Ara এর Row এ COALESCE কোথা থেকে 6 আনল, খেয়াল করুন।",
      },
      {
        title: "টাকার হিসাব",
        description:
          "চতুর্থ ফাইলে পুরো Reconciliation: বিশ Row, তারপর <> দিয়ে এক Row, তারপর IS DISTINCT FROM দিয়ে তিন Row।",
      },
      {
        title: "WHERE আর ON",
        description:
          "পঞ্চম ফাইলে একই শর্ত তিন জায়গায়: 8, 9 আর 10 Row। দশটার মধ্যে Luxury Stay এর Row টা খুঁজে বের করুন।",
      },
      {
        title: "সীমানা",
        description:
          "ষষ্ঠ ফাইলে FULL আর LEFT সমান হওয়ার দুটো উদাহরণ, আর সমান চিহ্ন ছাড়া FULL JOIN এর Error। Error এর লেখাটা খাতায় টুকে রাখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-four-joins.sql",
        code: `SELECT count(*) FROM guides g JOIN tours t ON t.guide_id = g.guide_id;
-- 8
SELECT count(*) FROM guides g LEFT JOIN tours t ON t.guide_id = g.guide_id;
-- 9
SELECT count(*) FROM guides g RIGHT JOIN tours t ON t.guide_id = g.guide_id;
-- 9
SELECT count(*) FROM guides g FULL JOIN tours t ON t.guide_id = g.guide_id;
-- 10`,
      },
      {
        language: "sql",
        filename: "02-lonely-rows.sql",
        code: `SELECT g.full_name, t.title
FROM guides g
FULL JOIN tours t ON t.guide_id = g.guide_id
WHERE g.guide_id IS NULL OR t.tour_id IS NULL;
-- (2 rows): Nazmul Karim আর Ratargul Swamp Boat Day, প্রতিটার পাশের ঘর খালি

SELECT count(*) FILTER (WHERE g.guide_id IS NOT NULL AND t.tour_id IS NOT NULL) AS matched,
       count(*) FILTER (WHERE t.tour_id IS NULL)  AS guide_only,
       count(*) FILTER (WHERE g.guide_id IS NULL) AS tour_only
FROM guides g
FULL JOIN tours t ON t.guide_id = g.guide_id;
-- (1 row): 8 | 1 | 1`,
      },
      {
        language: "sql",
        filename: "03-keys.sql",
        code: `SELECT guide_id, full_name, title
FROM guides
FULL JOIN tours USING (guide_id)
ORDER BY guide_id NULLS LAST, title;
-- (10 rows), শেষ Row এ guide_id খালি: Ratargul Swamp Boat Day

SELECT COALESCE(g.guide_id, r.guide_id) AS guide_id,
       g.full_name AS in_database,
       r.full_name AS in_roster
FROM guides g
FULL JOIN (VALUES (1, 'Jamal Hossain'), (2, 'Shirin Akter'), (4, 'Ayesha Siddiqua'),
                  (5, 'Nazmul Karim'), (6, 'Tasnim Ara')) AS r (guide_id, full_name)
  ON r.guide_id = g.guide_id
ORDER BY 1;
-- (6 rows): 3 Rubel Mia শুধু Database এ, 6 Tasnim Ara শুধু Roster এ`,
      },
      {
        language: "sql",
        filename: "04-reconcile.sql",
        code: `-- Statement টা প্রতিটা Query তে একই VALUES
SELECT COALESCE(p.payment_id, s.payment_id) AS payment_id,
       p.amount_bdt AS db_amount, s.amount_bdt AS statement_amount
FROM payments p
FULL JOIN (VALUES (1, 25000.00), (2, 50000.00), (3, 12500.00), (4, 25500.00),
                  (5, 17000.00), (6, 36000.00), (7, 18000.00), (8, 19000.00),
                  (9, 28000.00), (10, 14000.00), (11, 15000.00), (12, 25000.00),
                  (14, 25500.00), (15, 36000.00), (16, 28000.00), (17, 10500.00),
                  (18, 12500.00), (19, 42500.00), (20, 9500.00)) AS s (payment_id, amount_bdt)
  ON s.payment_id = p.payment_id
ORDER BY 1;
-- (20 rows)

-- একই Query, শেষে WHERE p.amount_bdt <> s.amount_bdt
-- (1 row): 11

-- একই Query, শেষে WHERE p.amount_bdt IS DISTINCT FROM s.amount_bdt
-- (3 rows): 11, 13, 20`,
      },
      {
        language: "sql",
        filename: "05-where-and-on.sql",
        code: `SELECT g.full_name, t.title
FROM guides g FULL JOIN tours t ON t.guide_id = g.guide_id
WHERE t.is_active;
-- (8 rows), Nazmul আর Luxury Stay নেই

SELECT g.full_name, t.title
FROM guides g FULL JOIN tours t ON t.guide_id = g.guide_id
WHERE t.is_active OR t.tour_id IS NULL;
-- (9 rows), Nazmul ফিরে এসেছেন

SELECT g.full_name, t.title, t.is_active
FROM guides g FULL JOIN tours t ON t.guide_id = g.guide_id AND t.is_active;
-- (10 rows), Saint Martin Luxury Stay এর পাশে full_name খালি`,
      },
      {
        language: "sql",
        filename: "06-limits.sql",
        code: `SELECT count(*) FROM destinations d FULL JOIN tours t ON t.destination_id = d.destination_id;
-- 10
SELECT count(*) FROM destinations d LEFT JOIN tours t ON t.destination_id = d.destination_id;
-- 10, একই

SELECT count(*) FROM tours t FULL JOIN departures d ON d.tour_id = t.tour_id;
-- 17: ষোলোটা Departure আর Family Package

SELECT g.full_name, t.title
FROM guides g FULL JOIN tours t ON t.guide_id > g.guide_id;
-- ERROR:  FULL JOIN is only supported with merge-joinable or hash-joinable join conditions`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা FULL JOIN লেখার পর আগে মোট Row গুনুন, তারপর FILTER দিয়ে তিন স্তূপ। মিল আর দুই দিকের একা যোগ
        করে মোটের সমান হলে Join ঠিক আছে। না মিললে কোথাও WHERE চুপচাপ কিছু ফেলে দিচ্ছে।
      </ContentParagraph>
    ),
  },
};
