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
  CollationSortLab,
  PaddingLab,
} from "../../../components/course/topics/ddl/texttype-animations";
import {
  CaseRulePlacesDiagram,
  SameLookSplit,
  TextTypesDiagram,
  Utf8LayersDiagram,
} from "../../../components/course/topics/ddl/texttype-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";
const PRE = "mt-3 overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem]";

/** The Project Example table, shared by its two boxes so each one runs on its own. */
const TRAVELLERS_TABLE = `CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS tt_travellers;
CREATE TABLE tt_travellers (
  traveller_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name    text   NOT NULL,
  name_bn      text,
  email        citext NOT NULL UNIQUE,
  country_code text   NOT NULL DEFAULT 'BD',
  CONSTRAINT tt_travellers_name_len CHECK (char_length(full_name) BETWEEN 2 AND 100),
  CONSTRAINT tt_travellers_name_nfc CHECK (name_bn IS NFC NORMALIZED),
  CONSTRAINT tt_travellers_country  CHECK (country_code ~ '^[A-Z]{2}$')
);
`;

export const textTypesContent: TopicData = {
  id: "text-types",
  introduction: {
    badge: "MODULE 09 · LESSON 04",
    title: <SectionTitle>লেখা রাখা, গোনা, মেলানো আর সাজানো</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি সংখ্যার Column বেছে নিতে শিখেছেন। এবার লেখা: নাম, Email, ঠিকানা, Tour এর কোড, বাংলা Tag।
          যেকোনো Table এ সবচেয়ে বেশি Column থাকে এই লেখারই। আর লেখার Column এ ভুল Type বা ভুল নিয়ম বাছলে সমস্যাগুলো
          আসে চুপচাপ: Error নেই, কিন্তু Login মেলে না, একই মানুষের দুইটা Account হয়, বাংলা তালিকা উল্টাপাল্টা সাজে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি PostgreSQL এর তিনটা লেখার Type চিনবেন: char(n), varchar(n) আর text, আর দেখবেন PostgreSQL নিজেই
          কেন বলে text আর দরকার হলে একটা CHECK নিতে। তারপর বাংলার আসল প্রশ্নগুলো: একটা বাংলা অক্ষর কত Byte, Database এর
          কাছে Character মানে আসলে কী, দেখতে এক এমন দুটো লেখা কেন আলাদা। শেষে Collation: কে ঠিক করে কোন লেখা আগে বসবে,
          বাংলা ঠিকমতো সাজাতে কী লাগে, আর Rahim আর rahim কে একই মানুষ ধরার তিনটা উপায়।
        </ContentParagraph>
        <ContentParagraph>
          প্রতিটা দাবি চালিয়ে দেখা: Query বক্সে যা চলে তা বক্সেই, আর যা শুধু আসল Server এ চলে তা PostgreSQL 18 এর
          Docker Container থেকে আসল Output সহ। কোনটা কোথায় চলে, প্রতিবার স্পষ্ট করে বলা থাকবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে আপনি দেখেন অক্ষর হিসেবে, আমি নিজেকে রাখি Byte হিসেবে, আর সাজাই যে নিয়ম আপনি দিয়েছেন সেই নিয়মে। নিয়ম না দিলে আমি Code নম্বর ধরে সাজাই, আর তখন উৎসব চলে যায় তালিকার একদম শেষে।",
      author: "text",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>বাংলা Website এর প্রথম রবিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর বাংলা Website চালু হয়েছে আগের সপ্তাহে। সকালে Developer তানিম
                Office এ ঢুকে দেখলেন চারটা Ticket অপেক্ষা করছে, আর চারটাই লেখা নিয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Ticket ১:</strong> Tour Code দিয়ে খোঁজার Filter কাজ করছে না। আগের একজন Developer নতুন একটা Table এ
                  Code রাখতে char(5) বেছেছিলেন। Database থেকে &apos;CXB&apos; আসছে পেছনে দুটো Space নিয়ে, আর App এর
                  ভেতরের তুলনা বলছে &apos;CXB  &apos; আর &apos;CXB&apos; এক না।
                </ListItem>
                <ListItem>
                  <strong>Ticket ২:</strong> একজন Customer বাংলায় ঠিকানা লিখে Save করতে পারছেন না, Error আসছে value too
                  long। তিনি গুনে দেখেছেন, Form এর সীমার চেয়ে অনেক কম অক্ষর লিখেছেন।
                </ListItem>
                <ListItem>
                  <strong>Ticket ৩:</strong> Rahim Uddin দুইটা Account খুলে ফেলেছেন। একবার Rahim.Uddin@mail.example দিয়ে,
                  আরেকবার rahim.uddin@mail.example দিয়ে। Database দুটোকে আলাদা মানুষ ধরেছে।
                </ListItem>
                <ListItem>
                  <strong>Ticket ৪:</strong> বাংলা Tag এর তালিকায় উৎসব একদম শেষে বসছে, যদিও বাংলা বর্ণক্রমে সেটা উত্তরার পাশে
                  থাকার কথা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                চারটা আলাদা Ticket, কিন্তু প্রশ্ন একটাই: Database লেখা কীভাবে রাখে, কীভাবে গোনে, কীভাবে মেলায় আর কীভাবে
                সাজায়। নিচের বক্সে চারটা ঘটনাই একসাথে দেখুন। এই লেসন শেষে আপনি প্রতিটার কারণ আর সমাধান দুটোই জানবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা Ticket, এক বক্সে"
              query={`SELECT concat('[', 'CXB'::char(5), ']')                         AS tour_code,
       char_length('কক্সবাজার')                                 AS bn_characters,
       'Rahim.Uddin@mail.example' = 'rahim.uddin@mail.example' AS same_email;

SELECT w AS tag
FROM (VALUES ('উৎসব'), ('উত্তরা'), ('উখিয়া'), ('উদয়'), ('উথাল')) AS t(w)
ORDER BY w;`}
              caption="প্রথম ফলাফল: [CXB  ], মানে CXB এর পরে দুটো Space। কক্সবাজার চোখে পাঁচটা ভাগ (ক, ক্স, বা, জা, র), Database গোনে 9। দুটো Email এর তুলনা f, মানে আলাদা। দ্বিতীয় ফলাফলে ৫টা Row, উৎসব সবার শেষে। চারটার কারণই এই লেসনে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Island Tours এর Table গুলো কী বেছেছে",
          content: (
            <ContentParagraph>
              Island Tours এর যে Table গুলো এতদিন পড়েছেন, খেয়াল করলে দেখবেন তাদের প্রতিটা লেখার Column text: নাম, Email,
              শহর, status। কেন varchar(255) না, কেন char না, সেই উত্তর এই লেসনের প্রথম অর্ধেক। আর এই লেসনের প্রতিটা নতুন
              Table এর নাম tt_ দিয়ে শুরু, যাতে Island Tours এর আসল Table এর সাথে কখনো না মেশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "three-types",
      subHeader: { index: "002", title: "Three Types" },
      title: <SectionTitle>char, varchar আর text: তিনটা Type এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SQL Standard লেখার জন্য দুটো Type ঠিক করেছে: character(n) আর character varying(n)। ছোট নামে char(n) আর
                varchar(n)। আর PostgreSQL নিজে যোগ করেছে তৃতীয় একটা Type: text। তিনটাই একই জিনিস রাখে, মানে লেখা।
                পার্থক্য শুধু সীমা আর ফাঁকা জায়গা নিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা শুরুতেই মনে রাখুন: বন্ধনীর n গোনে Character, Byte না। varchar(5) মানে পাঁচটা Character, সেটা ইংরেজি
                হোক বা বাংলা। বাংলায় একটা Character কত Byte নেয়, আর Character বলতে Database ঠিক কী বোঝে, সেটা আসছে লেসন
                এর মাঝামাঝি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Type", "কী রাখে", "সীমা পেরোলে", "কখন"],
          rows: [
            ["char(n)", "ঠিক n Character, কম হলে পেছনে Space বসিয়ে", "Error (শুধু বাড়তি Space হলে চুপচাপ কাটে)", "প্রায় কখনো না"],
            ["varchar(n)", "n পর্যন্ত যা আসে তাই", "Error (একই Space এর ব্যতিক্রম)", "সীমাটা যখন সত্যিই নিয়ম"],
            ["varchar", "n ছাড়া লিখলে কোনো সীমা নেই", "সীমা নেই", "text এর মতোই"],
            ["text", "যা আসে তাই, প্রায় 1 GB পর্যন্ত", "ঘোষিত সীমা নেই", "Default পছন্দ"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TextTypesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজে দেখুন। নিচের বক্স তিনটা Column এর একটা Table বানায়, তিনটাতেই একই &apos;CXB&apos; রাখে, তারপর Byte গোনে।
              শেষে information_schema থেকে Table টা আবার পড়ে, ঠিক যেভাবে Lesson 02 এ শিখেছেন। প্রথম লাইনের DROP TABLE IF
              EXISTS থাকায় বক্সটা যতবার খুশি চালাতে পারবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই মান, তিনটা Column"
              query={`DROP TABLE IF EXISTS tt_three;
CREATE TABLE tt_three (
  as_char    char(5),
  as_varchar varchar(5),
  as_text    text
);
INSERT INTO tt_three VALUES ('CXB', 'CXB', 'CXB');

SELECT concat('[', as_char, ']')    AS char_5,
       concat('[', as_varchar, ']') AS varchar_5,
       concat('[', as_text, ']')    AS text_col,
       octet_length(as_char)        AS char_bytes,
       octet_length(as_varchar)     AS varchar_bytes
FROM tt_three;

SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'tt_three'
ORDER BY ordinal_position;`}
              caption="প্রথম ফলাফলে char_5 হলো [CXB  ], বাকি দুটো [CXB]। char এ ৫ Byte, varchar এ ৩। দ্বিতীয় ফলাফলে ৩টা Row: character 5, character varying 5, আর text, যার সীমার ঘর NULL, কারণ সীমা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই Type এর কয়েকটা নাম",
          content: (
            <ContentParagraph>
              char(n) আর character(n) একই, varchar(n) আর character varying(n) একই। information_schema সবসময় লম্বা নামটা
              দেখায়, psql এর <code className={CODE}>\d</code> ও তাই। নিজে লেখার সময় ছোট নামই চলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              starter={`DROP TABLE IF EXISTS tt_ex1_tours;

-- এখানে CREATE TABLE tt_ex1_tours লিখুন


-- এই শেষের Query টা বদলাবেন না, এটাই আপনার Table মিলিয়ে দেখে
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'tt_ex1_tours'
ORDER BY ordinal_position;`}
              task={
                <>
                  <code className={CODE}>tt_ex1_tours</code> নামে একটা Table বানান, এই ক্রমে তিনটা Column: <code className={CODE}>code</code>{" "}
                  ঠিক তিন Character এর char, <code className={CODE}>title</code> সর্বোচ্চ 60 Character এর varchar, আর{" "}
                  <code className={CODE}>description</code> সীমাহীন text। বক্সে দেওয়া শেষের Query টা সবসময় শেষ Statement থাকবে।
                </>
              }
              hint={
                <>
                  উপরের tt_three এর CREATE TABLE টা দেখুন। তিনটা Column, মাঝে কমা, শেষেরটার পরে কমা নেই। ফলাফলে আসবে
                  character 3, character varying 60, আর text এর পাশে NULL।
                </>
              }
              solution={`SELECT *
FROM (VALUES ('code', 'character', 3),
             ('title', 'character varying', 60),
             ('description', 'text', NULL)
     ) AS v(column_name, data_type, character_maximum_length);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "char-padding",
      subHeader: { index: "003", title: "char(n) and Padding" },
      title: <SectionTitle>char(n): ফাঁকা ঘর ভরে রাখে Space দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                char(5) এর কথা একটাই: প্রতিটা মান ঠিক পাঁচ Character। কম এলে পেছনে Space বসিয়ে পাঁচ বানায়। সেই Space গুলো
                Disk এ রাখা হয়, আর Client এর কাছে মান যায় Space সহ। তানিমের Ticket ১ ঠিক এখানেই: App পেল &apos;CXB  &apos;,
                তুলনা করল &apos;CXB&apos; এর সাথে, আর মিলল না।
              </ContentParagraph>
              <ContentParagraph>
                মজার ব্যাপার হলো, Database এর ভেতরে char নিজেই সেই Space গুলোকে গুরুত্ব দেয় না। দুটো char তুলনার সময় পেছনের
                Space বাদ দিয়ে তুলনা হয়, length() ও সেগুলো গোনে না। কিন্তু কিছু জায়গায় Space আবার ফিরে আসে। কোন Value কোন
                Column এ কী হয়ে বসে, নিচে নিজে বেছে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PaddingLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার char এর সেই দ্বিমুখী আচরণ এক বক্সে। Space কোথায় হারায় আর কোথায় থেকে যায়, সেটা মিলিয়ে নিন। এখানে
              <code className={CODE}>||</code> আর concat দুটোই লেখা জোড়া দেয়, কিন্তু ফলাফল আলাদা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Space কখন আছে, কখন নেই"
              query={`DROP TABLE IF EXISTS tt_codes;
CREATE TABLE tt_codes (code char(5));
INSERT INTO tt_codes VALUES ('CXB');

SELECT code = 'CXB'           AS equals_plain,
       code = 'CXB  '         AS equals_padded,
       '[' || code || ']'     AS with_pipes,
       concat('[', code, ']') AS with_concat,
       code LIKE 'CXB'        AS like_plain,
       code LIKE 'CXB%'       AS like_prefix
FROM tt_codes;`}
              caption="দুটো তুলনাই t, কারণ char তুলনায় পেছনের Space বাদ যায়। || দিলে [CXB], কারণ জোড়া দেওয়ার আগে char থেকে text এ বদলাতে গিয়ে Space ঝরে যায়। concat দিলে [CXB  ], Space ফিরে এসেছে। LIKE 'CXB' হলো f, কারণ LIKE Space দেখে। LIKE 'CXB%' হলো t।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা ফাঁদ: বন্ধনী ছাড়া শুধু char লিখলে PostgreSQL ধরে নেয় char(1)। অনেকে ভাবেন সীমাহীন কিছু পাবেন, পান
              একটা মাত্র Character এর জায়গা। নিচের বক্সে প্রথমে Column এর আসল Type পড়া হয়েছে, তারপর তিন অক্ষরের একটা মান
              ঢোকানোর চেষ্টা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বন্ধনী ছাড়া char"
              query={`DROP TABLE IF EXISTS tt_flags;
CREATE TABLE tt_flags (flag char);
INSERT INTO tt_flags VALUES ('Y');

SELECT data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'tt_flags';

INSERT INTO tt_flags VALUES ('YES');`}
              caption="প্রথমে দেখা যায় character আর 1। তারপর শেষ লাইনে ERROR: value too long for type character(1)। Y গেছে, YES যায়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Space টা App পর্যন্ত যায়",
          content: (
            <ContentParagraph>
              Database এর ভেতরে char এর তুলনা পেছনের Space উপেক্ষা করে, কিন্তু Node.js, Python বা যেকোনো ভাষার Driver মান
              পায় Space সহ, আর সেই ভাষার === বা == Space উপেক্ষা করে না। তাই char(n) এর Column App এ নেওয়া মানেই প্রতিটা
              জায়গায় trim মনে রাখা। ভুলে গেলে Ticket ১ এর মতো চুপচাপ মিস। সহজ সমাধান: char(n) একদম না নেওয়া।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "varchar-length",
      subHeader: { index: "004", title: "varchar(n) and the Length Error" },
      title: <SectionTitle>varchar(n): সীমা পেরোলেই পুরো INSERT বাতিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                varchar(n) char এর মতো Space বসায় না। যা আসে তাই রাখে, শুধু n এর বেশি Character হলে পুরো INSERT ফিরিয়ে দেয়।
                Row এর অর্ধেক ঢোকে না, কোনো অংশ কেটেও রাখে না। Error এর Code 22001, নাম string_data_right_truncation, যেটা
                App এর Code এ ধরতে কাজে লাগে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Guide এর নামের জন্য দশ Character এর একটা Column। Rubel Mia (৯ Character) ঢোকে, Ayesha Siddiqua
                (১৫ Character) ঢোকে না। Island Tours এ দুজনই আসল Guide, আর দ্বিতীয়জনকে বাদ দেওয়ার কোনো ব্যবসায়িক কারণ নেই। সীমাটা
                এসেছে শুধু কারও আন্দাজ থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দশের সীমা"
              query={`DROP TABLE IF EXISTS tt_guides_short;
CREATE TABLE tt_guides_short (full_name varchar(10));
INSERT INTO tt_guides_short VALUES ('Rubel Mia');

SELECT full_name, char_length(full_name) AS chars
FROM tt_guides_short;

INSERT INTO tt_guides_short VALUES ('Ayesha Siddiqua');`}
              caption="প্রথমে Rubel Mia আর 9। তারপর ERROR: value too long for type character varying(10)। Error টা শেষ Statement এ রাখা হয়েছে, কারণ Query বক্স প্রথম Error এই থেমে যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সীমার নিয়মের দুটো ব্যতিক্রম আছে, আর দুটোই SQL Standard থেকে আসা। প্রথমত, বাড়তি অংশটা যদি শুধু Space হয়, Error
                না দিয়ে PostgreSQL চুপচাপ কেটে দেয়। উপরের Interactive এ &apos;ABCDE   &apos; এর ক্ষেত্রে সেটাই দেখেছেন।
                দ্বিতীয়ত, আপনি নিজে স্পষ্ট করে Cast করলে, যেমন <code className={CODE}>&apos;Saint Martin&apos;::varchar(5)</code>,
                লম্বা লেখা কোনো সতর্কতা ছাড়াই কেটে যায়। Cast মানে আপনি নিজেই Database কে এই মাপে আনতে বলছেন।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা লেখা কোনো Type এ ঢুকবে কিনা, ঢোকানোর আগেই জানতে চাইলে PostgreSQL 16 থেকে আছে{" "}
                <code className={CODE}>pg_input_is_valid(লেখা, &apos;Type&apos;)</code>। Error না দিয়ে শুধু true বা false বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চুপচাপ কাটা, আর আগেভাগে যাচাই"
              query={`SELECT 'Saint Martin'::varchar(5)                     AS cast_cut,
       pg_input_is_valid('Saint Martin', 'varchar(5)') AS saint_martin_fits,
       pg_input_is_valid('Sajek', 'varchar(5)')        AS sajek_fits,
       pg_input_is_valid('Kuakata   ', 'varchar(7)')   AS spaces_only_extra;`}
              caption="cast_cut হলো Saint, বাকিটা নিঃশব্দে উধাও। Saint Martin ঢুকবে না (f), Sajek ঢুকবে (t)। শেষেরটা t, কারণ Kuakata সাত Character আর বাড়তি তিনটা শুধু Space।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সীমার সীমা",
          content: (
            <ContentParagraph>
              varchar(n) এ n কমপক্ষে 1 আর সর্বোচ্চ 10485760। varchar(0) লিখলে Error: length for type varchar must be at
              least 1। তার বেশি লিখলে: length for type varchar cannot exceed 10485760। আর বন্ধনী ছাড়া শুধু varchar লিখলে
              কোনো সীমাই নেই, তখন সেটা text এর মতোই আচরণ করে। দুটো Error ই postgres:18 Container এ চালিয়ে দেখা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "text-plus-check",
      subHeader: { index: "005", title: "text plus CHECK" },
      title: <SectionTitle>PostgreSQL এর পরামর্শ: text, আর দরকার হলে একটা CHECK</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অন্য অনেক Database এ char(n) দ্রুত, কারণ সেখানে প্রতিটা Row এর মাপ নির্দিষ্ট থাকে। PostgreSQL এ তা না। তার
                Documentation সরাসরি বলে: &quot;There is no performance difference among these three types&quot;। তিনটা Type এর
                গতিতে কোনো পার্থক্য নেই, শুধু char(n) এর বাড়তি Space এর জায়গা লাগে আর varchar(n) এ সীমা যাচাইয়ের সামান্য কাজ।
                বরং বাড়তি জায়গার কারণে char(n) সাধারণত সবচেয়ে ধীর, আর Documentation পরামর্শ দেয় বেশিরভাগ ক্ষেত্রে text বা
                varchar নিতে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Wiki তে &quot;Don&apos;t Do This&quot; নামে একটা পাতা আছে, যেখানে অভিজ্ঞ মানুষেরা সাধারণ ভুলগুলো
                লিখে রেখেছেন। সেখানে স্পষ্ট দুটো কথা: char(n) নেবেন না, এমনকি নির্দিষ্ট মাপের কোডের জন্যও না। আর অভ্যাসবশত
                varchar(n) নেবেন না। কারণ আন্দাজে বসানো সীমা একদিন একজন আসল Customer এর আসল নাম ফিরিয়ে দেবে, ঠিক যেমন
                Ayesha Siddiqua এর নাম ফিরিয়ে দিয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জায়গার হিসাব"
              query={`SELECT pg_column_size('CXB'::char(10))    AS char_10,
       pg_column_size('CXB'::varchar(10)) AS varchar_10,
       pg_column_size('CXB'::text)        AS text_col;

DROP TABLE IF EXISTS tt_long_notes;
CREATE TABLE tt_long_notes (note text);
INSERT INTO tt_long_notes VALUES (repeat('Sundarbans ', 10000));

SELECT char_length(note)    AS characters,
       octet_length(note)   AS bytes,
       pg_column_size(note) AS stored_bytes
FROM tt_long_notes;`}
              caption="প্রথম ফলাফলে char(10) এ 14 Byte, varchar আর text এ 7 করে: একই CXB, char এ বাড়তি সাতটা Space এর জায়গা। দ্বিতীয় ফলাফলে 110000 Character এর একটা লম্বা text, রাখতে লেগেছে মাত্র 1280 Byte। লম্বা লেখা PostgreSQL নিজেই Compress করে, আর তাতেও বড় থাকলে আলাদা জায়গায় সরিয়ে রাখে। এই ব্যবস্থার নাম TOAST।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কি লেখার কোনো সীমাই রাখবেন না? রাখবেন, যখন সীমাটা সত্যিই একটা নিয়ম। যেমন SMS এ যাবে বলে Tour এর ছোট
                বিবরণ 160 Character এর বেশি না, বা একটা নাম অন্তত দুই Character। তখন লিখুন text, আর পাশে একটা CHECK, যার একটা
                নাম আছে:
              </ContentParagraph>
              <pre className={PRE}>{`full_name text NOT NULL,
CONSTRAINT tt_name_length CHECK (char_length(full_name) BETWEEN 2 AND 60)`}</pre>
              <ContentParagraph>
                এতে তিনটা লাভ। নিয়মটা পড়লেই বোঝা যায় (নাম দুই থেকে ষাট Character), Error এ নিয়মের নাম আসে, আর নিয়ম বদলাতে
                Column এর Type বদলাতে হয় না, শুধু পুরনো CHECK ফেলে নতুনটা বসালেই হয়। CHECK এর পুরো গল্প, NOT NULL আর
                UNIQUE এর সাথে, আছে{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Lesson 07
                </Link>{" "}
                এ। এখানে শুধু লেখার সীমার জন্য যতটুকু লাগে।
              </ContentParagraph>
              <ContentParagraph>
                Type বদলানোটা কেন ঝামেলার, তার একটা আসল উদাহরণ নিচে। একটা View মানে একটা নাম দেওয়া Query, যেটা Module 14 এ
                বিস্তারিত আসবে। কোনো View যদি Column টা পড়ে, PostgreSQL সেই Column এর Type বদলাতেই দেয় না, এমনকি varchar(20)
                থেকে varchar(40) বাড়াতেও না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="varchar(n) বাড়াতে গিয়ে আটকে যাওয়া"
              query={`DROP VIEW IF EXISTS tt_place_names;
DROP TABLE IF EXISTS tt_places;
CREATE TABLE tt_places (name varchar(20) NOT NULL);
CREATE VIEW tt_place_names AS SELECT name FROM tt_places;

ALTER TABLE tt_places ALTER COLUMN name TYPE varchar(40);`}
              caption="ERROR: cannot alter type of a column used by a view or rule, সাথে DETAIL এ View এর নাম। আসল Database এ একটা Column কে অনেক View, Report আর Function পড়তে পারে। তখন সীমা বাড়ানো মানে সবগুলো ফেলে আবার বানানো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="text আর CHECK: সীমা বদলানো সহজ"
              query={`DROP VIEW IF EXISTS tt_place2_names;
DROP TABLE IF EXISTS tt_places2;
CREATE TABLE tt_places2 (
  name text NOT NULL,
  CONSTRAINT tt_places2_name_len CHECK (char_length(name) <= 20)
);
CREATE VIEW tt_place2_names AS SELECT name FROM tt_places2;

ALTER TABLE tt_places2 DROP CONSTRAINT tt_places2_name_len;
ALTER TABLE tt_places2 ADD CONSTRAINT tt_places2_name_len CHECK (char_length(name) <= 40);

INSERT INTO tt_places2 VALUES ('Saint Martin''s Island Coral Reef');
SELECT name, char_length(name) AS chars FROM tt_place2_names;

INSERT INTO tt_places2 VALUES ('Saint Martin''s Island Coral Reef and Chera Dwip Day Trip');`}
              caption="View থাকা অবস্থাতেই সীমা 20 থেকে 40 হলো, কোনো আপত্তি নেই। 32 Character এর নামটা ঢুকল আর View দিয়ে পড়া গেল। শেষের লম্বা নামে ERROR: new row for relation tt_places2 violates check constraint tt_places2_name_len, সাথে DETAIL এ পুরো Row। Error এর ভেতরেই নিয়মের নাম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে একটা লিখুন। নিচের বক্সে একটা ছোট পরীক্ষক Function দেওয়া আছে, যেটা চারটা নাম একে একে ঢোকানোর চেষ্টা করে
              আর বলে কোনটা ঢুকল। এমন Function কীভাবে লিখতে হয় সেটা Module 14 এর বিষয়, এখন শুধু জেনে রাখুন এটা Error হলে
              থেমে না গিয়ে rejected লিখে পরেরটায় যায়। আপনার কাজ শুধু Table টা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              orderMatters
              starter={`DROP TABLE IF EXISTS tt_ex2_guides;

-- এখানে CREATE TABLE tt_ex2_guides লিখুন


-- নিচের অংশ বদলাবেন না: প্রতিটা নাম ঢোকানোর চেষ্টা করে, ঢুকল কিনা বলে
CREATE OR REPLACE FUNCTION tt_ex2_try(v text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO tt_ex2_guides (full_name) VALUES (v);
  RETURN 'accepted';
EXCEPTION
  WHEN check_violation OR string_data_right_truncation THEN
    RETURN 'rejected';
END $$;

SELECT t.n, char_length(t.v) AS chars, tt_ex2_try(t.v) AS result
FROM (VALUES (1, 'J'),
             (2, 'Jamal Hossain'),
             (3, repeat('ক', 60)),
             (4, repeat('x', 61))) AS t(n, v)
ORDER BY t.n;`}
              task={
                <>
                  <code className={CODE}>tt_ex2_guides</code> বানান, একটাই Column: <code className={CODE}>full_name</code>, Type
                  text, খালি রাখা যাবে না, আর একটা নাম দেওয়া CHECK যেটা নামের দৈর্ঘ্য 2 থেকে 60 Character এর মধ্যে রাখে। তিন নম্বর
                  নামটা ষাটটা বাংলা ক, মানে 180 Byte, সেটা যেন ঢোকে। বক্সের নিচের অংশ বদলাবেন না।
                </>
              }
              hint={
                <>
                  Character গুনতে char_length, Byte গুনতে octet_length। কোনটা লাগবে ভাবুন: octet_length দিলে বাংলা নামটা ফিরে
                  যাবে। CHECK এর ভেতরে <code className={CODE}>BETWEEN 2 AND 60</code> চলে।
                </>
              }
              solution={`SELECT *
FROM (VALUES (1, 1, 'rejected'),
             (2, 13, 'accepted'),
             (3, 60, 'accepted'),
             (4, 61, 'rejected')
     ) AS v(n, chars, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "utf8-bengali",
      subHeader: { index: "006", title: "UTF-8 and Bengali" },
      title: <SectionTitle>UTF-8: বাংলার প্রতিটা Character তিন Byte</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Computer অক্ষর চেনে না, চেনে সংখ্যা। Unicode পৃথিবীর প্রায় সব লেখার প্রতিটা চিহ্নকে একটা নম্বর দিয়েছে, যার নাম
                Code Point, লেখা হয় U+ দিয়ে। ইংরেজি D হলো U+0044, বাংলা ক হলো U+0995। বাংলার পুরো অংশটা U+0980 থেকে U+09FF
                এর মধ্যে। আর সেই নম্বরগুলোকে Byte এ সাজানোর একটা নিয়ম হলো UTF-8। এই বক্সের Database আর postgres:18 Container,
                দুটোরই Encoding UTF8, আপনার নিজের Server এরও তাই হওয়া উচিত।
              </ContentParagraph>
              <ContentParagraph>
                UTF-8 এ একটা Code Point এক থেকে চার Byte নেয়। ইংরেজি অক্ষর আর অঙ্ক এক Byte, বাংলার প্রতিটা Code Point তিন Byte,
                আর Emoji চার Byte। Module 04 এর{" "}
                <Link href="/sql/topic/string-functions" className={LINK}>
                  String Functions
                </Link>{" "}
                লেসনে আপনি দেখেছেন ঢাকা শব্দে char_length 4 আর octet_length 12। এখানে নতুন প্রশ্ন হলো, সেই 4 আসলে কী গুনছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <Utf8LayersDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL এর কাছে একটা Character মানে একটা Code Point, চোখে দেখা একটা অক্ষর না। বাংলায় এই দুটো প্রায়ই
                আলাদা। কা দেখতে একটা, কিন্তু ক আর া দুটো Code Point। ক্ষ দেখতে একটা, কিন্তু ক, হসন্ত আর ষ, তিনটা। তাই
                কক্সবাজার চোখে পাঁচটা ভাগ (ক, ক্স, বা, জা, র) হলেও Database গোনে 9।
              </ContentParagraph>
              <ContentParagraph>
                varchar(n) এর n আর char_length দুটোই এই Code Point গোনে। Ticket ২ এর রহস্য এখানেই: Customer চোখের অক্ষর
                গুনেছেন, Database গুনেছে Code Point, আর বাংলা ঠিকানায় দ্বিতীয়টা প্রায় দেড় থেকে দুইগুণ। ভালো খবর হলো, সীমা
                কখনো Byte এ না। varchar(5) এ সিলেট ঢোকে, যদিও সেটা 15 Byte।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Character, Byte আর varchar(5)"
              query={`SHOW server_encoding;

SELECT w,
       char_length(w)                     AS characters,
       octet_length(w)                    AS bytes,
       pg_input_is_valid(w, 'varchar(5)') AS fits_varchar_5
FROM (VALUES ('Dhaka'), ('Sylhet'), ('ঢাকা'), ('সিলেট'), ('কক্সবাজার'), ('ক্ষ')) AS t(w);`}
              caption="প্রথমে UTF8। তারপর ৬টা Row। Dhaka 5 আর 5, ঢোকে। Sylhet 6, ঢোকে না। ঢাকা 4 আর 12, ঢোকে। সিলেট 5 আর 15, ঢোকে, কারণ সীমা Character এ। কক্সবাজার 9 আর 27, ঢোকে না। ক্ষ 3 আর 9।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "বাংলা লেখার সীমা কীভাবে ঠিক করবেন",
          content: (
            <ContentList>
              <ListItem>
                সীমা না লাগলে রাখবেন না। ঠিকানা, বিবরণ, মন্তব্য: text, সীমা ছাড়া।
              </ListItem>
              <ListItem>
                সীমা লাগলে সেটা Code Point এ ভাবুন, আর বাংলার জন্য উদার হোন। চোখের ৩০ অক্ষরের একটা বাংলা নাম ৪৫ থেকে ৬০ Code
                Point হতে পারে।
              </ListItem>
              <ListItem>
                Form এ যদি দেখান &quot;আর কত অক্ষর বাকি&quot;, App যেন একই জিনিস গোনে, মানে Code Point। JavaScript এর
                <code className={CODE}>[...text].length</code> Code Point গোনে, কিন্তু <code className={CODE}>text.length</code> গোনে
                UTF-16 এর একক, যেটা Emoji তে আলাদা হয়।
              </ListItem>
              <ListItem>
                PostgreSQL এ চোখের অক্ষর (Grapheme) গোনার কোনো Built-in Function নেই। সেটা দরকার হলে App এ গুনুন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              starter={`SELECT name
FROM (VALUES ('সেন্ট মার্টিন'), ('কক্সবাজার'), ('সুন্দরবন'), ('সাজেক ভ্যালি'),
             ('বান্দরবান'), ('সিলেট'), ('কুয়াকাটা')) AS t(name);`}
              task={
                <>
                  বক্সে Island Tours এর সাতটা Destination এর বাংলা নাম। ধরুন একটা পুরনো Table এ নামের Column varchar(10)। কোন নামগুলো
                  সেখানে ঢুকবে না? তিনটা Column দেখান: নাম, Character এর সংখ্যা, Byte এর সংখ্যা। শুধু যেগুলো ঢুকবে না।
                </>
              }
              hint={
                <>
                  WHERE এ <code className={CODE}>char_length(name) &gt; 10</code>, অথবা{" "}
                  <code className={CODE}>NOT pg_input_is_valid(name, &apos;varchar(10)&apos;)</code>। দুটো Row আসবে।
                </>
              }
              solution={`SELECT name, char_length(name) AS characters, octet_length(name) AS bytes
FROM (VALUES ('সেন্ট মার্টিন'), ('কক্সবাজার'), ('সুন্দরবন'), ('সাজেক ভ্যালি'),
             ('বান্দরবান'), ('সিলেট'), ('কুয়াকাটা')) AS t(name)
WHERE char_length(name) > 10;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "normalization",
      subHeader: { index: "007", title: "Same Look, Different Bytes" },
      title: <SectionTitle>দেখতে এক, ভেতরে আলাদা: Normalization</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাংলায় কিছু অক্ষর Unicode এ দুইভাবে লেখা যায়। য় একটা আলাদা Code Point হিসেবে আছে (U+09DF), আবার য এর নিচে
                নুকতা (U+09AF আর U+09BC) দিয়েও লেখা যায়। ড় আর ঢ় এর ক্ষেত্রেও তাই। দুটো রূপ Screen এ হুবহু একই, কিন্তু
                ভেতরের Byte আলাদা। কোন রূপ আসবে, সেটা নির্ভর করে কোন Keyboard, কোন Phone বা কোন Website থেকে লেখাটা Copy করা।
              </ContentParagraph>
              <ContentParagraph>
                এর ফল ভয়ংকর রকম চুপচাপ: একজন Customer কুয়াকাটা লিখে খুঁজলেন, Database এ কুয়াকাটা আছে, কিন্তু Row আসে না,
                কারণ দুই জায়গার য় দুই রূপে লেখা। PostgreSQL এর সাধারণ = Byte মেলায়, চোখ না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SameLookSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query তে দুটো রূপ আলাদা করে লিখতে এখানে <code className={CODE}>U&amp;&apos;\09DF&apos;</code> এর মতো লেখা
              ব্যবহার হয়েছে। এর মানে Unicode Escape: ঠিক কোন Code Point চাই, সেটা নম্বর দিয়ে বলা। কারণ টাইপ করলে দুটো একই
              দেখায়, কোনটা কোন রূপ তা বোঝার উপায় থাকে না। <code className={CODE}>normalize(লেখা, NFC)</code> যেকোনো রূপকে একটা
              নির্দিষ্ট রূপে আনে, আর <code className={CODE}>IS NFC NORMALIZED</code> বলে লেখাটা আগে থেকেই সেই রূপে আছে কিনা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই রকম য়"
              query={`SELECT U&'\\09DF' = U&'\\09AF\\09BC'                               AS plain_equal,
       normalize(U&'\\09DF', NFC) = normalize(U&'\\09AF\\09BC', NFC) AS equal_after_nfc,
       char_length(U&'\\09DF')                                     AS one_form_chars,
       char_length(U&'\\09AF\\09BC')                                AS other_form_chars,
       U&'\\09DF' IS NFC NORMALIZED                                AS single_point_is_nfc;`}
              caption="সাধারণ তুলনা f, normalize এর পরে t। প্রথম রূপে 1 Character, দ্বিতীয়তে 2। শেষেরটা f: অবাক করা হলেও NFC রূপে য় হলো দুই Code Point এর রূপটা। Unicode এর নিয়মে একক U+09DF কে NFC তে ভেঙে য আর নুকতা করা হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান হলো দরজাতেই এক রূপে আনা। App এ লেখা Save করার আগে NFC করুন, আর Database এ একটা CHECK রাখুন, যাতে অন্য
              রূপ ভুল করে ঢুকতেই না পারে। নিচে কুয়াকাটা দুইভাবে ঢোকানোর চেষ্টা: প্রথমবার normalize করে, দ্বিতীয়বার একক
              U+09DF সহ কাঁচা রূপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দরজায় পাহারা: IS NFC NORMALIZED"
              query={`DROP TABLE IF EXISTS tt_bn_places;
CREATE TABLE tt_bn_places (
  name text NOT NULL CHECK (name IS NFC NORMALIZED)
);

INSERT INTO tt_bn_places
VALUES (normalize(U&'\\0995\\09C1\\09DF\\09BE\\0995\\09BE\\099F\\09BE', NFC));

SELECT name, char_length(name) AS chars, name = 'কুয়াকাটা' AS matches_typed
FROM tt_bn_places;

INSERT INTO tt_bn_places
VALUES (U&'\\0995\\09C1\\09DF\\09BE\\0995\\09BE\\099F\\09BE');`}
              caption="প্রথম INSERT ঢুকল, 9 Character, আর Query তে টাইপ করা কুয়াকাটার সাথে মিলল (t)। দ্বিতীয়টায় ERROR: new row for relation tt_bn_places violates check constraint tt_bn_places_name_check। চোখে একই নাম, কিন্তু অন্য রূপে, তাই ঢুকতে পারল না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আরেকটা পথ, পরে আসছে",
          content: (
            <ContentParagraph>
              Normalize না করে তুলনার সময়েই দুই রূপকে সমান ধরানো যায় একটা Nondeterministic Collation দিয়ে। সেটা এই লেসনের
              ১২ নম্বর অংশে। PostgreSQL এর Documentation দুটো পথকেই বৈধ বলে, প্রতিটার আলাদা সুবিধা আর খরচ আছে। সবচেয়ে সরল আর
              দ্রুত পথ হলো দরজায় NFC।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "collation",
      subHeader: { index: "008", title: "Collation" },
      title: <SectionTitle>Collation: লেখা সাজানোর নিয়মের বই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর{" "}
                <Link href="/sql/topic/order-by" className={LINK}>
                  ORDER BY
                </Link>{" "}
                লেসনে আপনি দেখেছেন, এই Query বক্সে বড় হাতের অক্ষর সব ছোট হাতের আগে বসে, আর Docker এর PostgreSQL এ বসে
                অভিধানের মতো। কারণ দুই জায়গার Collation আলাদা। Collation হলো লেখা তুলনার নিয়মের বই: কোন লেখা আগে, কোনটা
                পরে। এবার সেই বইয়ের ভেতরে ঢোকার পালা।
              </ContentParagraph>
              <ContentParagraph>
                Collation তিন জায়গায় ঠিক করা যায়। Database এর Default, যেটা{" "}
                <Link href="/sql/topic/create-database" className={LINK}>
                  CREATE DATABASE
                </Link>{" "}
                এর সময় বাছা হয়। একটা Column এর নিজস্ব, CREATE TABLE এ Type এর পরে <code className={CODE}>COLLATE</code> লিখে। আর
                একটা Query এর ভেতরে এক জায়গায়, যেমন <code className={CODE}>ORDER BY name COLLATE &quot;C&quot;</code>। ছোট পরিধির
                নিয়ম বড় পরিধির নিয়মকে হারায়।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মের বইগুলো আসে তিনটা উৎস থেকে, PostgreSQL যাকে বলে Provider:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>libc:</strong> Operating System এর নিজের নিয়ম, যেমন C, POSIX, en_US.utf8। C নিয়ম সবচেয়ে সরল, শুধু
                  Code নম্বর ধরে সাজায়। en_US.utf8 এর মতো নিয়ম আসে Linux এর glibc থেকে, তাই OS বদলালে বা Update হলে ক্রম বদলাতে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>ICU:</strong> Unicode এর আন্তর্জাতিক নিয়মের Library। নাম শেষ হয় -x-icu দিয়ে। und-x-icu হলো ভাষা
                  নিরপেক্ষ সাধারণ নিয়ম (und মানে undetermined), bn-x-icu হলো বাংলা ভাষার নিয়ম। একই ICU Version এ সব OS এ একই ক্রম।
                </ListItem>
                <ListItem>
                  <strong>builtin:</strong> PostgreSQL এর নিজের, কোনো বাইরের Library ছাড়া। pg_c_utf8 (PostgreSQL 17 থেকে) আর
                  pg_unicode_fast (PostgreSQL 18 থেকে) ক্রমে C এর মতো, কিন্তু বড় ছোট হাত বদলানোয় পুরো Unicode বোঝে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এই বক্সে কোন কোন নিয়মের বই আছে"
              query={`SELECT datcollate, datctype
FROM pg_database
WHERE datname = current_database();

SELECT collname, collprovider
FROM pg_collation
WHERE collname IN ('C', 'en_US.utf8', 'und-x-icu', 'bn-x-icu', 'pg_c_utf8', 'pg_unicode_fast')
ORDER BY collname;`}
              caption="প্রথমে C আর C.UTF-8: এই বক্সের Default নিয়ম C। দ্বিতীয় ফলাফলে ৫টা Row: C আর en_US.utf8 (c মানে libc), pg_c_utf8 আর pg_unicode_fast (b মানে builtin), und-x-icu (i মানে ICU)। bn-x-icu নেই। এই বক্সের ICU তে মাত্র দুটো তৈরি করা Collation, আসল Server এ শত শত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই Query postgres:18 Container এর psql এ চালালে Database এর Default পাওয়া যায় en_US.utf8, আর ICU এর
              Collation 871টা। তার মধ্যে বাংলার তিনটা:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, postgres:18 container",
          code: `island_tours=# SELECT collname, collprovider, colllocale
island_tours-# FROM pg_collation WHERE collname LIKE 'bn%' ORDER BY collname;
  collname   | collprovider | colllocale
-------------+--------------+------------
 bn-BD-x-icu | i            | bn-BD
 bn-IN-x-icu | i            | bn-IN
 bn-x-icu    | i            | bn
(3 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Column এর নিজস্ব Collation। নিচের Table এর দুটো Column এ একই ছয়টা শহরের নাম, যেমন Form এ লোকে টাইপ করে:
              কেউ ছোট হাতে, কেউ বড় হাতে, একজন বিদেশি Customer এর Zürich। একটা Column এর নিয়ম C, অন্যটার und-x-icu। ORDER BY
              তে আলাদা কিছু লিখতে হয়নি, প্রতিটা Column নিজের নিয়মে সেজেছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column এর নিজস্ব Collation"
              query={`DROP TABLE IF EXISTS tt_cities;
CREATE TABLE tt_cities (
  name_c   text COLLATE "C",
  name_icu text COLLATE "und-x-icu"
);
INSERT INTO tt_cities
SELECT w, w
FROM (VALUES ('dhaka'), ('Dhaka'), ('chattogram'), ('Sylhet'), ('Cox''s Bazar'), ('Zürich')) AS t(w);

SELECT string_agg(name_c, ', ' ORDER BY name_c)     AS by_c,
       string_agg(name_icu, ', ' ORDER BY name_icu) AS by_icu
FROM tt_cities;`}
              caption="by_c: Cox's Bazar, Dhaka, Sylhet, Zürich, chattogram, dhaka। সব বড় হাত আগে, ছোট হাতের chattogram একদম শেষের দিকে। by_icu: chattogram, Cox's Bazar, dhaka, Dhaka, Sylhet, Zürich। মানুষের চোখে যেমন স্বাভাবিক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দুই নিয়মের দুটো Column তুলনা করলে",
          content: (
            <ContentParagraph>
              উপরের Table এ <code className={CODE}>WHERE name_c = name_icu</code> লিখলে PostgreSQL বুঝতে পারে না কোন নিয়মে
              তুলনা করবে। ERROR: could not determine which collation to use for string comparison, সাথে HINT: Use the COLLATE
              clause to set the collation explicitly। সমাধান হলো এক পাশে স্পষ্ট করে বলা, যেমন{" "}
              <code className={CODE}>name_c = name_icu COLLATE &quot;C&quot;</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "libc নিয়ম বদলালে কী হয়",
          content: (
            <ContentParagraph>
              Index লেখাগুলোকে Collation এর ক্রমে সাজিয়ে রাখে (Module 13)। OS Update এ libc এর ক্রম বদলালে পুরনো Index এর ক্রম
              আর নতুন নিয়মের সাথে মেলে না, তখন খোঁজার ফলাফল ভুল আসতে পারে। তাই PostgreSQL প্রতিটা Collation এর Version মনে
              রাখে, আর না মিললে সতর্ক করে। ICU আর builtin এ এই ঝুঁকি কম, কারণ নিয়ম OS এর হাতে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "sorting-bengali",
      subHeader: { index: "009", title: "Sorting Bengali" },
      title: <SectionTitle>বাংলা সাজানো: C, ICU আর bn-x-icu</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                C নিয়ম Code নম্বর ধরে সাজায়। বাংলার জন্য সেটা প্রায় ঠিকই কাজ করে, কারণ Unicode বাংলা অক্ষরগুলোকে মোটামুটি
                বর্ণমালার ক্রমেই নম্বর দিয়েছে: অ এর পরে আ, ক এর পরে খ। কিন্তু &quot;প্রায়&quot; শব্দটাই বিপদ। কিছু অক্ষর পরে যোগ
                হয়েছে, তাই তাদের নম্বর বসেছে একদম শেষে। খণ্ড ত (ৎ) এর নম্বর U+09CE, হ এর চেয়েও বড়। তাই C নিয়মে উৎসব চলে যায়
                তালিকার শেষে। এটাই Ticket ৪।
              </ContentParagraph>
              <ContentParagraph>
                ICU এর নিয়ম ৎ কে ত এর পরিবারে বসায়, তাই উৎসব আসে উত্তরার ঠিক পরে। কিন্তু ভাষা নিরপেক্ষ und-x-icu আর বাংলার
                bn-x-icu ও সবখানে একমত না। অনুস্বার (ং) কোথায় বসবে, সেখানে দুটো আলাদা উত্তর দেয়। নিচে নিজে বেছে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CollationSortLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বক্সের C বনাম ICU"
              query={`SELECT string_agg(w, ' · ' ORDER BY w)                     AS box_default_c,
       string_agg(w, ' · ' ORDER BY w COLLATE "und-x-icu") AS icu_root
FROM (VALUES ('উৎসব'), ('উত্তরা'), ('উখিয়া'), ('উদয়'), ('উথাল')) AS t(w);

SELECT string_agg(w, ' · ' ORDER BY w)                     AS box_default_c,
       string_agg(w, ' · ' ORDER BY w COLLATE "und-x-icu") AS icu_root
FROM (VALUES ('কক্সবাজার'), ('কংস নদ'), ('কুয়াকাটা'), ('কাপ্তাই'), ('কমলগঞ্জ')) AS t(w);`}
              caption="প্রথম ফলাফলে C তে উৎসব শেষে, ICU তে উত্তরার পরে। দ্বিতীয় ফলাফলে C তে কংস নদ প্রথমে, ICU (und) তে কমলগঞ্জের পরে। কোনটা বাংলার নিয়মে ঠিক, সেটা জানতে লাগে bn-x-icu, যেটা এই বক্সে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই বক্সে <code className={CODE}>COLLATE &quot;bn-x-icu&quot;</code> লিখলে আসে ERROR: collation &quot;bn-x-icu&quot; for
              encoding &quot;UTF8&quot; does not exist। তাই বাংলার নিয়মটা postgres:18 Container এ চালানো হয়েছে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, postgres:18 container",
          code: `island_tours=# SELECT string_agg(w, ' · ' ORDER BY w COLLATE "bn-x-icu") AS bn_order
island_tours-# FROM (VALUES ('উৎসব'), ('উত্তরা'), ('উখিয়া'), ('উদয়'), ('উথাল')) AS t(w);
             bn_order
-----------------------------------
 উখিয়া · উত্তরা · উৎসব · উথাল · উদয়
(1 row)

island_tours=# SELECT string_agg(w, ' · ' ORDER BY w COLLATE "bn-x-icu") AS bn_order,
island_tours-#        string_agg(w, ' · ' ORDER BY w COLLATE "und-x-icu") AS und_order
island_tours-# FROM (VALUES ('কক্সবাজার'), ('কংস নদ'), ('কুয়াকাটা'), ('কাপ্তাই'), ('কমলগঞ্জ')) AS t(w);
                   bn_order                    |                   und_order
-----------------------------------------------+-----------------------------------------------
 কংস নদ · কক্সবাজার · কমলগঞ্জ · কাপ্তাই · কুয়াকাটা | কক্সবাজার · কমলগঞ্জ · কংস নদ · কাপ্তাই · কুয়াকাটা
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                bn-x-icu দুটো তালিকাতেই বাংলার নিয়ম মানে: উৎসব উত্তরার পরে, আর কংস নদ সবার আগে। সিদ্ধান্তটা তাই সহজ: আসল Server এ
                বাংলা লেখার Column হলে Column এর Collation দিন bn-x-icu:
              </ContentParagraph>
              <pre className={PRE}>{`name_bn text NOT NULL COLLATE "bn-x-icu"`}</pre>
              <ContentParagraph>
                এই বক্সে সবচেয়ে কাছের বিকল্প und-x-icu, যেটা অন্তত ৎ এর ভুলটা ঠিক করে। আর যে Report সব জায়গায় একই ক্রমে আসা চাই,
                তার ORDER BY তে Collation স্পষ্ট করে লিখে দিন, Database এর Default এর উপর ভরসা না করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              starter={`SELECT w
FROM (VALUES ('মৎস্য বাজার'), ('মন্দির'), ('মসজিদ'), ('মহাস্থানগড়'), ('মাছ ধরা'), ('মতিঝিল')) AS t(w)
ORDER BY w;`}
              task={
                <>
                  বক্সে ছয়টা বাংলা Tag, এখন সাজানো এই বক্সের Default নিয়মে, তাই মৎস্য বাজার পড়ে আছে একদম শেষে। Query টা এমনভাবে
                  বদলান যাতে Unicode এর নিয়মে সাজে, মৎস্য বাজার যেন মতিঝিলের ঠিক পরে আসে। একটাই Column।
                </>
              }
              hint={
                <>
                  ORDER BY এর পরে Collation এর নাম: <code className={CODE}>COLLATE &quot;und-x-icu&quot;</code>। নামটা Double Quote এ,
                  কারণ এতে হাইফেন আছে। আসল Server এ একই কাজ করত &quot;bn-x-icu&quot;, আর ফলাফলও হতো হুবহু এক।
                </>
              }
              solution={`SELECT w
FROM (VALUES ('মতিঝিল', 1), ('মৎস্য বাজার', 2), ('মন্দির', 3),
             ('মসজিদ', 4), ('মহাস্থানগড়', 5), ('মাছ ধরা', 6)) AS t(w, pos)
ORDER BY pos;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "case-in-queries",
      subHeader: { index: "010", title: "lower() and ILIKE" },
      title: <SectionTitle>বড় ছোট হাত না মেনে মেলানো: প্রতিটা Query তে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাংলায় বড় হাত ছোট হাত নেই, upper(&apos;ঢাকা&apos;) ফেরত দেয় ঢাকাই। তাই এই সমস্যাটা ইংরেজি হরফের লেখায়:
                Email, ইংরেজি নাম, Username। আর এর সবচেয়ে দামি জায়গা Email, কারণ Email দিয়েই মানুষ Login করেন, Password
                ভুলে গেলে Link পান, আর একজন মানুষের একটাই Account থাকার কথা।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর = বড় ছোট হাত আলাদা ধরে। Island Tours এর <code className={CODE}>customers.email</code> একটা সাধারণ
                text, পাশে UNIQUE। তাই Rahim.Uddin আর rahim.uddin তার চোখে দুটো আলাদা Email। এই নিয়মটা তিন জায়গায় রাখা যায়:
                প্রতিটা Query তে, Column এর Type এ, অথবা Column এর Collation এ। প্রথমটা দিয়ে শুরু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CaseRulePlacesDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Email, তিনভাবে খোঁজা"
              query={`SELECT count(*) AS exact_match
FROM customers
WHERE email = 'RAHIM.UDDIN@MAIL.EXAMPLE';

SELECT count(*) AS lower_match
FROM customers
WHERE lower(email) = lower('RAHIM.UDDIN@MAIL.EXAMPLE');

SELECT count(*) AS ilike_match
FROM customers
WHERE email ILIKE 'RAHIM.UDDIN@MAIL.EXAMPLE';`}
              caption="প্রথমটা 0, দ্বিতীয় আর তৃতীয়টা 1। lower দুই পাশকে ছোট হাতে এনে মেলায়। ILIKE আপনি Module 03 এ শিখেছেন, এটা LIKE এর বড় ছোট হাত না মানা রূপ। খেয়াল রাখুন, ILIKE এ % আর _ এর বিশেষ মানে আছে, তাই সাধারণ সমান খোঁজায় lower পরিষ্কার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              খোঁজা ঠিক হলো, কিন্তু রাখা? UNIQUE এখনো বড় ছোট হাত মানে। নিচের বক্সে একটা Transaction এর ভেতরে Rahim এর
              Email বড় হাতে আরেকবার ঢোকানো হয়েছে, তারপর ROLLBACK, যাতে আসল Table অক্ষত থাকে। Transaction এর বিস্তারিত Module
              12 তে, এখানে শুধু জেনে রাখুন ROLLBACK সব বদল ফিরিয়ে নেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UNIQUE থাকা সত্ত্বেও দুইজন Rahim"
              query={`BEGIN;

INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Uddin', 'RAHIM.UDDIN@mail.example', 'Dhaka');

SELECT full_name, email
FROM customers
WHERE lower(email) = 'rahim.uddin@mail.example'
ORDER BY email;

ROLLBACK;`}
              caption="INSERT এ কোনো Error নেই। SELECT এ ২টা Row, একই মানুষ, দুইটা Account: RAHIM.UDDIN@mail.example আর rahim.uddin@mail.example। এটাই তানিমের Ticket ৩। শেষে ROLLBACK, তাই customers আবার ১৫ জনের।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Query তে নিয়ম রাখলে অনন্য রাখতে লাগে একটা UNIQUE Index, যেটা Column এর উপর না, lower(email) এর উপর। এমন Index
                কে বলে Expression Index, Module 13 এর{" "}
                <Link href="/sql/topic/partial-expression-covering" className={LINK}>
                  Partial, Expression and Covering Indexes
                </Link>{" "}
                লেসনে বিস্তারিত আছে। এখানে শুধু এর কাজটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="lower(email) এর উপর UNIQUE Index"
              query={`DROP TABLE IF EXISTS tt_signups;
CREATE TABLE tt_signups (email text NOT NULL);
CREATE UNIQUE INDEX tt_signups_email_lower ON tt_signups (lower(email));

INSERT INTO tt_signups VALUES ('Rahim.Uddin@mail.example');
INSERT INTO tt_signups VALUES ('rahim.uddin@mail.example');`}
              caption="দ্বিতীয় INSERT এ ERROR: duplicate key value violates unique constraint tt_signups_email_lower, আর DETAIL: Key (lower(email))=(rahim.uddin@mail.example) already exists। মান যেভাবে টাইপ হয়েছিল সেভাবেই রাখা থাকে, শুধু তুলনা হয় ছোট হাতে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "PostgreSQL 18 এর casefold()",
          content: (
            <ContentParagraph>
              কিছু ভাষায় ছোট হাতে আনা আর বড় ছোট হাত মুছে ফেলা এক জিনিস না। জার্মান ß এর বড় হাত SS, তাই Straße আর STRASSE
              একই শব্দ, অথচ lower(&apos;Straße&apos;) থেকে যায় straße। PostgreSQL 18 এ এসেছে{" "}
              <code className={CODE}>casefold()</code>, যেটা তুলনার জন্যই বানানো। এই বক্সে আর Container এ দুই জায়গাতেই{" "}
              <code className={CODE}>casefold(&apos;Straße&apos; COLLATE pg_unicode_fast)</code> দেয় strasse। Email এর মতো
              ইংরেজি লেখায় lower আর casefold একই ফল দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "citext",
      subHeader: { index: "011", title: "citext" },
      title: <SectionTitle>citext: যে Type নিজেই বড় ছোট হাত ভুলে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Query তে lower লেখার সমস্যা একটাই: একজন ভুলে গেলেই চুপচাপ ভুল। তাই দ্বিতীয় পথ, নিয়মটা Column এর Type এ রাখা।
                citext (case insensitive text) একটা Extension, PostgreSQL এর সাথেই আসে, শুধু চালু করতে হয়। চালু করার পরে
                citext Column এ যেকোনো তুলনা দুই পাশকে lower করে মেলায়, আপনার কিছু লিখতে হয় না। UNIQUE, =, LIKE, ORDER BY,
                সবাই।
              </ContentParagraph>
              <ContentParagraph>
                এই Query বক্সেও citext চলে, আসল Server এর মতোই প্রথমে{" "}
                <code className={CODE}>CREATE EXTENSION IF NOT EXISTS citext;</code> লিখে। citext কে Documentation বলে
                &quot;trusted&quot;, মানে Superuser ছাড়াও যার Database এ CREATE করার অনুমতি আছে, তিনিই চালু করতে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="citext এর Email"
              query={`CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS tt_users;
CREATE TABLE tt_users (email citext NOT NULL UNIQUE);
INSERT INTO tt_users VALUES ('Rahim.Uddin@mail.example');

SELECT email,
       email = 'RAHIM.UDDIN@MAIL.EXAMPLE'       AS same,
       email LIKE 'rahim%'                      AS like_lower,
       email::text = 'RAHIM.UDDIN@MAIL.EXAMPLE' AS same_as_text
FROM tt_users;

INSERT INTO tt_users VALUES ('rahim.uddin@mail.example');`}
              caption="SELECT এ মান থাকে যেভাবে টাইপ হয়েছিল: Rahim.Uddin@mail.example। same t, like_lower t, কিন্তু text এ Cast করলে আবার বড় ছোট হাত মানে, তাই same_as_text f। শেষ INSERT এ ERROR: duplicate key value violates unique constraint tt_users_email_key।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "citext এর সীমাবদ্ধতা",
          content: (
            <ContentParagraph>
              citext ভেতরে আসলে lower ই চালায়। Documentation নিজেই বলে, Unicode এর কিছু বিশেষ ক্ষেত্রে এই পদ্ধতি ঠিক কাজ
              করে না, যেমন যেখানে একটা বড় হাতের অক্ষরের দুটো ছোট হাতের রূপ আছে। তাই citext এর Documentation এর প্রথম
              পরামর্শই হলো এর বদলে Nondeterministic Collation বিবেচনা করা, যেটা পরের অংশ। Email এর মতো ইংরেজি লেখায় citext
              সহজ আর নির্ভরযোগ্য, আর পুরনো অনেক Project এ এটাই পাবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              starter={`DROP TABLE IF EXISTS tt_ex5_customers;

-- এখানে CREATE TABLE tt_ex5_customers লিখুন (একটা Column: email)


-- নিচের অংশ বদলাবেন না
INSERT INTO tt_ex5_customers (email) VALUES
  ('Rahim.Uddin@mail.example'), ('rahim.uddin@mail.example'),
  ('Mitu.Rahman@mail.example'), ('MITU.RAHMAN@MAIL.EXAMPLE')
ON CONFLICT DO NOTHING;

SELECT email::text AS email
FROM tt_ex5_customers;`}
              task={
                <>
                  <code className={CODE}>tt_ex5_customers</code> বানান, একটাই Column <code className={CODE}>email</code>, খালি রাখা
                  যাবে না, আর বড় ছোট হাত না মেনে অনন্য: Rahim.Uddin আর rahim.uddin যেন দুইবার না থাকে। উপায় আপনার পছন্দ। বক্সের
                  নিচের INSERT এর <code className={CODE}>ON CONFLICT DO NOTHING</code> অনন্যতা ভাঙা Row গুলো চুপচাপ বাদ দেয়, তাই
                  ঠিক Table এ শুধু দুটো Email থাকবে।
                </>
              }
              hint={
                <>
                  সবচেয়ে ছোট উপায়: প্রথম লাইনে <code className={CODE}>CREATE EXTENSION IF NOT EXISTS citext;</code>, তারপর Column
                  এর Type citext আর পাশে UNIQUE। অন্য উপায়: সাধারণ text, আর আলাদা একটা{" "}
                  <code className={CODE}>CREATE UNIQUE INDEX ... (lower(email))</code>।
                </>
              }
              solution={`SELECT *
FROM (VALUES ('Rahim.Uddin@mail.example'),
             ('Mitu.Rahman@mail.example')) AS v(email);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "nondeterministic-collations",
      subHeader: { index: "012", title: "Nondeterministic Collations" },
      title: <SectionTitle>deterministic = false: Collation দিয়েই Rahim আর rahim এক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এ পর্যন্ত দেখা সব Collation, এমনকি ICU এর গুলোও, Deterministic। এর মানে সাজানোর ক্রম তারা ঠিক করে, কিন্তু সমান
                কিনা সেই শেষ সিদ্ধান্ত নেয় Byte দেখে। Dhaka আর dhaka পাশাপাশি সাজবে, তবু = বলবে আলাদা। Nondeterministic
                Collation সেই শেষ সিদ্ধান্তটাও নিয়মের হাতে দেয়: নিয়ম যদি বলে বড় ছোট হাত গুরুত্বহীন, তাহলে = বলবে সমান।
              </ContentParagraph>
              <ContentParagraph>
                এমন Collation নিজে বানাতে হয়, ICU দিয়ে। ICU এর নিয়মে তুলনার কয়েকটা স্তর আছে। প্রথম স্তর শুধু মূল অক্ষর দেখে,
                দ্বিতীয় স্তর Accent ও দেখে, তৃতীয় স্তর বড় ছোট হাতও দেখে। Locale এর নামে <code className={CODE}>ks-level2</code>{" "}
                এর মানে তুলনা চলবে দ্বিতীয় স্তর পর্যন্ত, অর্থাৎ বড় ছোট হাত উপেক্ষা করা হবে। Documentation এর উদাহরণ:
              </ContentParagraph>
              <pre className={PRE}>{`CREATE COLLATION case_insensitive (
  provider = icu,
  locale = 'und-u-ks-level2',
  deterministic = false
);`}</pre>
              <ContentParagraph>
                এরপর Column এ <code className={CODE}>email text COLLATE case_insensitive UNIQUE</code> লিখলেই Column নিজেই জানে
                Rahim আর rahim একই। PostgreSQL 18 এর আগে এমন Column এ LIKE চলত না। 18 এর Release Notes এ নতুন সুবিধা হিসেবে
                লেখা আছে: Nondeterministic Collation এ LIKE এখন চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এই বক্সের একটা সীমাবদ্ধতা, আগে জেনে রাখুন",
          content: (
            <ContentParagraph>
              চালিয়ে দেখা গেছে, এই Query বক্সের ICU und-u-ks-level2 এর মতো নতুন ধরনের নাম বোঝে না। Collation তৈরি হয়ে
              যায়, কোনো Error আসে না, কিন্তু তুলনা আগের মতোই বড় ছোট হাত মানে। একই নিয়মের পুরনো ধরনের নাম{" "}
              <code className={CODE}>und@colStrength=secondary</code> বক্সে ঠিকঠাক চলে। আসল Server দুটো নামই মানে, পুরনোটা পেলে
              একটা NOTICE দিয়ে নতুন নামে বদলে রাখে। তাই এই লেসনের বক্সে পুরনো নাম, আর নিজের Server এ Documentation এর নতুন নাম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Collation এ বড় ছোট হাত না মানা"
              query={`DROP TABLE IF EXISTS tt_members;
DROP COLLATION IF EXISTS tt_nocase;
CREATE COLLATION tt_nocase (
  provider = icu,
  locale = 'und@colStrength=secondary',
  deterministic = false
);
CREATE TABLE tt_members (email text COLLATE tt_nocase NOT NULL UNIQUE);
INSERT INTO tt_members VALUES ('Rahim.Uddin@mail.example');

SELECT email,
       email = 'RAHIM.UDDIN@MAIL.EXAMPLE' AS same,
       email LIKE 'rahim%'                AS like_works
FROM tt_members;

INSERT INTO tt_members VALUES ('rahim.uddin@mail.example');`}
              caption="same t, like_works t, আর এই Column এর Type সাধারণ text, কোনো Extension নেই। শেষ INSERT এ ERROR: duplicate key value violates unique constraint tt_members_email_key, DETAIL: Key (email)=(rahim.uddin@mail.example) already exists।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বক্সের সীমাবদ্ধতাটা নিজের চোখে দেখুন, আর একটা বোনাসও। নিচে দুটো Collation, একই নিয়ম, দুই ধরনের নামে। তৃতীয়
              Column এ সেই দুই রকম য়, যেটা ৭ নম্বর অংশে normalize দিয়ে মিলিয়েছিলেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন নাম, পুরনো নাম, আর দুই রকম য়"
              query={`DROP COLLATION IF EXISTS tt_ci_bcp47;
DROP COLLATION IF EXISTS tt_ci_legacy;
CREATE COLLATION tt_ci_bcp47 (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
CREATE COLLATION tt_ci_legacy (provider = icu, locale = 'und@colStrength=secondary', deterministic = false);

SELECT 'Dhaka' = 'DHAKA' COLLATE tt_ci_bcp47                  AS bcp47_name,
       'Dhaka' = 'DHAKA' COLLATE tt_ci_legacy                 AS legacy_name,
       U&'\\09DF' = U&'\\09AF\\09BC' COLLATE tt_ci_legacy           AS two_ya_forms;`}
              caption="এই বক্সে: bcp47_name f, legacy_name t, two_ya_forms t। মানে বক্সে নতুন নামের Collation চুপচাপ কাজ করে না। আর Nondeterministic Collation দেখতে এক এমন দুই রকম য় কে normalize ছাড়াই সমান ধরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই Query postgres:18 Container এ। এখানে তিনটাই t, আর পুরনো নামটা পেয়ে Server একটা NOTICE দিয়ে জানায় সে নতুন
              নামে রাখছে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, postgres:18 container",
          code: `island_tours=# CREATE COLLATION tt_ci_bcp47 (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
CREATE COLLATION
island_tours=# CREATE COLLATION tt_ci_legacy (provider = icu, locale = 'und@colStrength=secondary', deterministic = false);
NOTICE:  using standard form "und-u-ks-level2" for ICU locale "und@colStrength=secondary"
CREATE COLLATION
island_tours=# SELECT 'Dhaka' = 'DHAKA' COLLATE tt_ci_bcp47  AS bcp47_name,
island_tours-#        'Dhaka' = 'DHAKA' COLLATE tt_ci_legacy AS legacy_name,
island_tours-#        U&'\\09DF' = U&'\\09AF\\09BC' COLLATE tt_ci_legacy AS two_ya_forms;
 bcp47_name | legacy_name | two_ya_forms
------------+-------------+--------------
 t          | t           | t
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তাহলে কি সবখানে Nondeterministic? না। Documentation স্পষ্ট বলে এর একটা খরচ আছে: তুলনা ধীর হয়, B-tree Index
              Deduplication করতে পারে না, আর কিছু Pattern Matching এখনো চলে না। তাই শুধু সেই Column এ, যেখানে সত্যিই দরকার,
              যেমন Email বা Username। তিনটা উপায় পাশাপাশি:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "নিয়ম কোথায়", "অনন্যতা বড় ছোট হাত মানে?", "এই বক্সে", "মনে রাখুন"],
          rows: [
            ["lower() বা ILIKE", "প্রতিটা Query তে", "মানে, তাই lower(email) এর UNIQUE Index লাগে", "চলে", "একজন ভুলে গেলেই চুপচাপ মিস"],
            ["citext", "Column এর Type এ", "মানে না", "CREATE EXTENSION এর পরে চলে", "ভেতরে lower, Unicode এর সব ক্ষেত্র না"],
            ["deterministic = false", "Column এর Collation এ", "মানে না", "und@colStrength=secondary নামে চলে", "একটু ধীর, Docs এর সুপারিশ"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ: utf8mb4, Byte এর সীমা আর _ci</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ লেখার গল্পের অনেকটা আলাদা, আর আপনার MySQL কোর্সের Table গুলো পড়তে গেলে এগুলো জানা দরকার। নিচের
                সব Output mysql:8.4 Container থেকে, MySQL এর নিজের Client এ চালিয়ে। Query OK এর লাইনগুলো বাদ রাখা হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম কথা, utf8mb4।</strong> MySQL 8.4 এর Default Character Set utf8mb4, Collation utf8mb4_0900_ai_ci।
                MySQL এ length() গোনে Byte, Character গুনতে লাগে CHAR_LENGTH(), যেটা Module 04 এ দেখেছেন। VARCHAR(n) এর n
                অবশ্য PostgreSQL এর মতোই Character।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> SELECT @@character_set_server, @@collation_server;
+------------------------+--------------------+
| @@character_set_server | @@collation_server |
+------------------------+--------------------+
| utf8mb4                | utf8mb4_0900_ai_ci |
+------------------------+--------------------+

mysql> SELECT LENGTH('ঢাকা') AS bytes, CHAR_LENGTH('ঢাকা') AS chars,
    ->        CHAR_LENGTH('কক্সবাজার') AS coxs_bazar;
+-------+-------+------------+
| bytes | chars | coxs_bazar |
+-------+-------+------------+
|    12 |     4 |          9 |
+-------+-------+------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরনো অনেক Tutorial এ পাবেন CHARACTER SET utf8। MySQL এ utf8 আসলে utf8mb3 এর পুরনো নাম, যেটা একটা Character
              এ সর্বোচ্চ তিন Byte রাখে। বাংলা তাতে ঢোকে, কারণ বাংলা তিন Byte। কিন্তু Emoji চার Byte, তাই ঢোকে না। আর MySQL
              নিজেই utf8mb3 কে Deprecated বলে সতর্ক করে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> CREATE TABLE tt_mb3 (v VARCHAR(10) CHARACTER SET utf8mb3);
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------------------------------------------------------+
| Level   | Code | Message                                                                                     |
+---------+------+---------------------------------------------------------------------------------------------+
| Warning | 1287 | 'utf8mb3' is deprecated and will be removed in a future release. Please use utf8mb4 instead |
+---------+------+---------------------------------------------------------------------------------------------+

mysql> INSERT INTO tt_mb3 VALUES ('ঢাকা');
mysql> INSERT INTO tt_mb3 VALUES ('Trip 😀');
ERROR 1366 (HY000): Incorrect string value: '\\xF0\\x9F\\x98\\x80' for column 'v' at row 1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>দ্বিতীয় কথা, সীমাগুলো Byte এ।</strong> VARCHAR(n) Character গোনে, কিন্তু MySQL এর ভেতরের সীমাগুলো Byte এ
                মাপা, আর utf8mb4 এ MySQL প্রতিটা Character এর জন্য চার Byte ধরে হিসাব করে। তাই একটা Row এর সব VARCHAR মিলিয়ে
                65535 Byte এর বেশি হতে পারে না, একটা VARCHAR সর্বোচ্চ 16383 Character, আর InnoDB এর একটা Index Key সর্বোচ্চ 3072
                Byte, মানে UNIQUE দেওয়া VARCHAR সর্বোচ্চ 768 Character। পুরনো Tutorial এর VARCHAR(191) এর রহস্যও এটাই: পুরনো COMPACT Row
                Format এ, যেটা MySQL 5.6 এর যুগে সাধারণ ছিল, Key এর সীমা 767 Byte, আর 191 গুণ 4 হলো 764। 8.4 এর Container এও
                ROW_FORMAT=COMPACT দিয়ে VARCHAR(192) UNIQUE চালালে ERROR 1071 আসে, max key length is 767 bytes, আর 191 চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> CREATE TABLE tt_big (v VARCHAR(16384));
ERROR 1074 (42000): Column length too big for column 'v' (max = 16383); use BLOB or TEXT instead

mysql> CREATE TABLE tt_big (a VARCHAR(10000), b VARCHAR(10000));
ERROR 1118 (42000): Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs

mysql> CREATE TABLE tt_key (email VARCHAR(769) UNIQUE);
ERROR 1071 (42000): Specified key was too long; max key length is 3072 bytes`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এর TEXT Type গুলোর সীমাও Byte এ: TEXT সর্বোচ্চ 65535 Byte। ইংরেজিতে সেটা 65535 অক্ষর, কিন্তু বাংলায় মাত্র
              21845 Code Point। Container এ ঠিক 21845টা ক ঢুকেছে, 21846টা দিতেই ERROR 1406। বড় বাংলা লেখার জন্য MEDIUMTEXT
              (প্রায় 16 MB) নিতে হয়। PostgreSQL এর text এ এই হিসাবই নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>তৃতীয় কথা, _ci।</strong> Collation এর নামের শেষাংশগুলো পড়তে শিখুন: ci মানে case insensitive, cs মানে case
              sensitive, ai মানে accent insensitive, as মানে accent sensitive, bin মানে শুধু Byte। Default utf8mb4_0900_ai_ci
              বড় ছোট হাত আর Accent দুটোই উপেক্ষা করে। তাই MySQL এ Ticket ৩ ঘটেই না: UNIQUE নিজেই Rahim আর rahim কে একই ধরে।
              উল্টো দিকটাও মনে রাখুন: café আর cafe ও তার কাছে এক।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> SELECT 'Dhaka' = 'dhaka' AS ci, 'café' = 'cafe' AS ai,
    ->        'Dhaka' = 'dhaka' COLLATE utf8mb4_0900_as_cs AS as_cs,
    ->        'a' = 'a ' AS no_pad, 'a' = 'a ' COLLATE utf8mb4_general_ci AS pad_space;
+----+----+-------+--------+-----------+
| ci | ai | as_cs | no_pad | pad_space |
+----+----+-------+--------+-----------+
|  1 |  1 |     0 |      0 |         1 |
+----+----+-------+--------+-----------+

mysql> CREATE TABLE tt_users (email VARCHAR(255) NOT NULL UNIQUE);
mysql> INSERT INTO tt_users VALUES ('Rahim.Uddin@mail.example');
mysql> INSERT INTO tt_users VALUES ('rahim.uddin@mail.example');
ERROR 1062 (23000): Duplicate entry 'rahim.uddin@mail.example' for key 'tt_users.email'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                no_pad আর pad_space এর পার্থক্যটাও খেয়াল করুন। 0900 দিয়ে নাম এমন নতুন Collation গুলো NO PAD, পেছনের Space কে
                Data ধরে। পুরনো utf8mb4_general_ci আর utf8mb4_bin হলো PAD SPACE, পেছনের Space উপেক্ষা করে। একই Database এ
                দুই ধরনের Collation মিশলে &apos;a&apos; আর &apos;a &apos; কখনো সমান, কখনো না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>চতুর্থ কথা, CHAR আর Strict Mode।</strong> MySQL এর CHAR(n) ও Space বসিয়ে রাখে, কিন্তু পড়ার সময় পেছনের
                Space মুছে দেয়, তাই App পায় CXB, PostgreSQL এর মতো CXB আর দুটো Space না। আর সীমা পেরোলে কী হবে, সেটা নির্ভর করে
                sql_mode এর উপর। Default এ STRICT_TRANS_TABLES চালু, তখন Error। এটা বন্ধ থাকলে MySQL চুপচাপ কেটে রাখে, শুধু
                একটা Warning দেয়, যেটা App প্রায় কখনো পড়ে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> CREATE TABLE tt_codes (code CHAR(5), label VARCHAR(10));
mysql> INSERT INTO tt_codes VALUES ('CXB', 'Cox  ');
mysql> SELECT CONCAT('[', code, ']') AS code, CONCAT('[', label, ']') AS label FROM tt_codes;
+-------+---------+
| code  | label   |
+-------+---------+
| [CXB] | [Cox  ] |
+-------+---------+

mysql> INSERT INTO tt_codes VALUES ('ABC', 'Saint Martin');
ERROR 1406 (22001): Data too long for column 'label' at row 1

mysql> SET SESSION sql_mode = '';
mysql> INSERT INTO tt_codes VALUES ('ABC', 'Saint Martin');
mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------+
| Level   | Code | Message                                    |
+---------+------+--------------------------------------------+
| Warning | 1265 | Data truncated for column 'label' at row 1 |
+---------+------+--------------------------------------------+

mysql> SELECT code, label FROM tt_codes WHERE code = 'ABC';
+------+------------+
| code | label      |
+------+------------+
| ABC  | Saint Mart |
+------+------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>পঞ্চম কথা, বাংলা সাজানো।</strong> MySQL 8.4 এ বাংলার জন্য আলাদা কোনো Collation নেই, INFORMATION_SCHEMA তে
              নামে bn আছে এমন Collation শূন্য। তবে Default utf8mb4_0900_ai_ci Unicode এর সাধারণ নিয়ম মানে, তাই উৎসব ঠিক উত্তরার
              পরে বসে। utf8mb4_bin হলো PostgreSQL এর C এর মতো, শুধু Byte, সেখানে উৎসব আবার শেষে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql, mysql:8.4 container",
          code: `mysql> SELECT COUNT(*) AS bengali_collations
    -> FROM INFORMATION_SCHEMA.COLLATIONS WHERE COLLATION_NAME LIKE '%bn%';
+--------------------+
| bengali_collations |
+--------------------+
|                  0 |
+--------------------+

mysql> SELECT GROUP_CONCAT(w ORDER BY w SEPARATOR ' · ') AS ai_ci,
    ->        GROUP_CONCAT(w ORDER BY w COLLATE utf8mb4_bin SEPARATOR ' · ') AS bin
    -> FROM (SELECT 'উৎসব' AS w UNION ALL SELECT 'উত্তরা' UNION ALL SELECT 'উখিয়া'
    ->       UNION ALL SELECT 'উদয়' UNION ALL SELECT 'উথাল') AS t\\G
*************************** 1. row ***************************
ai_ci: উখিয়া · উত্তরা · উৎসব · উথাল · উদয়
  bin: উখিয়া · উত্তরা · উথাল · উদয় · উৎসব`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর বাংলা Sign-up Table</SectionTitle>,
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
                চারটা Ticket বন্ধ করার পরে Manager ফারুক সাহেব তানিমকে একটা নতুন কাজ দিলেন: বাংলা Website এর Sign-up এর জন্য
                একটা Table, যেখানে ভ্রমণকারীরা নিজের নাম ইংরেজি আর বাংলা দুই ভাষায় দেবেন। শর্ত চারটা: একজন মানুষের একটাই
                Account, বাংলা নাম যেন খোঁজায় ঠিকমতো মেলে, দেশের কোড দুই অক্ষরের বড় হাতে (BD, IN), আর কোনো আন্দাজের সীমা নয়।
              </ContentParagraph>
              <ContentParagraph>
                তানিম প্রতিটা Column এর জন্য এই লেসনের একটা করে শিক্ষা কাজে লাগালেন। ইংরেজি নাম text, সীমা 2 থেকে 100 Character
                একটা নাম দেওয়া CHECK এ। বাংলা নাম text, পাশে IS NFC NORMALIZED এর পাহারা। Email citext আর UNIQUE। দেশের কোড
                char(2) না, text আর একটা CHECK, যেটা Module 04 এর{" "}
                <Link href="/sql/topic/regular-expressions" className={LINK}>
                  Regular Expressions
                </Link>{" "}
                দিয়ে বলে ঠিক দুইটা বড় হাতের অক্ষর। traveller_id এর IDENTITY এর পুরো গল্প Lesson 08 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="tt_travellers: Table, চারজন ভ্রমণকারী, আর খোঁজা"
              query={TRAVELLERS_TABLE + `
INSERT INTO tt_travellers (full_name, name_bn, email, country_code) VALUES
  ('Nusrat Jahan',   'নুসরাত জাহান',  'Nusrat.Jahan@mail.example',   'BD'),
  ('Tanvir Ahmed',   'তানভীর আহমেদ', 'tanvir.ahmed@mail.example',   'BD'),
  ('Priya Sharma',   'প্রিয়া শর্মা',   'priya.sharma@mail.example',   'IN'),
  ('Oliver Bennett', NULL,           'oliver.bennett@mail.example', 'GB');

SELECT full_name, name_bn, country_code
FROM tt_travellers
WHERE email = 'NUSRAT.JAHAN@MAIL.EXAMPLE';

SELECT name_bn
FROM tt_travellers
WHERE name_bn IS NOT NULL
ORDER BY name_bn COLLATE "und-x-icu";`}
              caption="প্রথম SELECT এ Nusrat Jahan, Email বড় হাতে খুঁজলেও পাওয়া গেল, কারণ Column citext। দ্বিতীয়টায় ৩টা বাংলা নাম Unicode এর নিয়মে: তানভীর আহমেদ, নুসরাত জাহান, প্রিয়া শর্মা। Oliver এর বাংলা নাম NULL, আর NULL এর উপর CHECK আটকায় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Table টা ভাঙার চেষ্টা। নিচের বক্স আবার Table টা নতুন করে বানায়, তারপর একটা পরীক্ষক Function চারটা খারাপ
              Sign-up একে একে চেষ্টা করে, আর প্রতিটার আসল Error Message লিখে রাখে। Exercise 2 এর পরীক্ষকের মতোই, শুধু এবার
              rejected এর বদলে PostgreSQL এর নিজের কথা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা খারাপ Sign-up, চারটা আসল Error"
              query={TRAVELLERS_TABLE + `
INSERT INTO tt_travellers (full_name, email) VALUES ('Rahim Uddin', 'rahim.uddin@mail.example');

CREATE OR REPLACE FUNCTION tt_travellers_try(n text, e text, c text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO tt_travellers (full_name, email, country_code) VALUES (n, e, c);
  RETURN 'accepted';
EXCEPTION WHEN OTHERS THEN
  RETURN SQLERRM;
END $$;

SELECT t.n AS test, tt_travellers_try(t.full_name, t.email, t.country) AS result
FROM (VALUES (1, 'Rahim Uddin',    'RAHIM.UDDIN@mail.example',    'BD'),
             (2, 'R',              'r@mail.example',              'BD'),
             (3, 'Aiman Zulkifli', 'aiman.zulkifli@mail.example', 'my'),
             (4, 'Lamia Haque',    'lamia.haque@mail.example',    'BD')) AS t(n, full_name, email, country)
ORDER BY t.n;`}
              caption="১: duplicate key value violates unique constraint tt_travellers_email_key, কারণ citext এর চোখে বড় হাতের Email টা আগেরটারই। ২: violates check constraint tt_travellers_name_len। ৩: violates check constraint tt_travellers_country, কারণ my ছোট হাতে। ৪: accepted। প্রতিটা Error এর ভেতরে নিয়মের নাম, তাই App বুঝতে পারে কোন ঘরের ভুল দেখাতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আসল Server এ তানিম আর দুটো জিনিস বদলাতেন",
          content: (
            <ContentList>
              <ListItem>
                বাংলা নামের Column এ <code className={CODE}>COLLATE &quot;bn-x-icu&quot;</code>, যাতে ORDER BY name_bn নিজেই
                বাংলার নিয়মে সাজে। এই বক্সে bn-x-icu নেই বলে এখানে Query তে und-x-icu লেখা।
              </ListItem>
              <ListItem>
                citext এর বদলে চাইলে <code className={CODE}>email text COLLATE case_insensitive</code>, যেখানে
                case_insensitive হলো ১২ নম্বর অংশের und-u-ks-level2 এর Collation। দুটোই কাজ করে, দ্বিতীয়টা Documentation এর
                সুপারিশ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`DROP TABLE IF EXISTS tt_ch_travellers;

-- এখানে CREATE TABLE tt_ch_travellers লিখুন
-- (citext নিলে তার আগে CREATE EXTENSION লাগবে)


-- নিচের অংশ বদলাবেন না
CREATE OR REPLACE FUNCTION tt_ch_try(n text, e text, c text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO tt_ch_travellers (full_name, email, country_code) VALUES (n, e, c);
  RETURN 'accepted';
EXCEPTION
  WHEN check_violation OR unique_violation OR not_null_violation
       OR string_data_right_truncation THEN
    RETURN 'rejected';
END $$;

SELECT t.n, tt_ch_try(t.full_name, t.email, t.country) AS result
FROM (VALUES (1, 'Nusrat Jahan',     'nusrat.jahan@mail.example',   'BD'),
             (2, 'নুসরাত জাহান',      'NUSRAT.JAHAN@mail.example',   'BD'),
             (3, 'Priya Sharma',     'priya.sharma@mail.example',   'IN'),
             (4, 'P',                'p@mail.example',              'IN'),
             (5, 'Oliver Bennett',   'oliver.bennett@mail.example', 'uk'),
             (6, repeat('ক', 60),    'long.name@mail.example',      'BD'),
             (7, repeat('ক', 61),    'longer.name@mail.example',    'BD')) AS t(n, full_name, email, country)
ORDER BY t.n;`}
              task={
                <>
                  ফারুক সাহেব এবার ছোট একটা সংস্করণ চান: <code className={CODE}>tt_ch_travellers</code>, তিনটা Column।{" "}
                  <code className={CODE}>full_name</code>: খালি না, 2 থেকে 60 Character। <code className={CODE}>email</code>: খালি না,
                  বড় ছোট হাত না মেনে অনন্য। <code className={CODE}>country_code</code>: খালি না, ঠিক দুইটা বড় হাতের ইংরেজি অক্ষর।
                  বক্সের নিচের পরীক্ষক সাতটা Sign-up চেষ্টা করবে। ঠিক Table এ চারটা rejected আর তিনটা accepted আসবে, ঠিক এই
                  ক্রমে: accepted, rejected, accepted, rejected, rejected, accepted, rejected।
                </>
              }
              hint={
                <>
                  তিনটা আলাদা শিক্ষা এক জায়গায়। নামের সীমা char_length দিয়ে, octet_length দিয়ে না (৬ নম্বর Sign-up ষাটটা বাংলা ক)।
                  Email এর জন্য citext আর UNIQUE। দেশের কোডের জন্য{" "}
                  <code className={CODE}>CHECK (country_code ~ &apos;^[A-Z]{"{"}2{"}"}$&apos;)</code>।
                </>
              }
              solution={`SELECT *
FROM (VALUES (1, 'accepted'), (2, 'rejected'), (3, 'accepted'), (4, 'rejected'),
             (5, 'rejected'), (6, 'accepted'), (7, 'rejected')) AS v(n, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা লেখার Column বানানোর সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Default হিসেবে text",
              description:
                "নতুন লেখার Column মানেই text, যদি না নিচের কোনো ধাপ অন্য কিছু বলে। গতিতে পার্থক্য নেই, আর আন্দাজের সীমা একদিন আসল Data ফিরিয়ে দেবে।",
            },
            {
              title: "সীমা কি সত্যিই নিয়ম? তাহলে নাম দেওয়া CHECK",
              description:
                "SMS এর 160, নামের অন্তত 2: এমন নিয়ম থাকলে CONSTRAINT নাম CHECK (char_length(col) ...)। নিয়ম বদলালে শুধু CHECK বদলাবে, Type না।",
            },
            {
              title: "সীমা গুনুন Character এ, বাংলায় উদার হয়ে",
              description:
                "char_length, কখনো octet_length না। বাংলায় চোখের অক্ষরের চেয়ে Code Point অনেক বেশি, তাই সীমা রাখলে বড় করে রাখুন।",
            },
            {
              title: "char(n) বাদ",
              description:
                "নির্দিষ্ট মাপের কোডও text আর একটা CHECK দিয়ে, যেমন দেশের কোডে ~ '^[A-Z]{2}$'। পেছনের Space App পর্যন্ত যাওয়ার ঝুঁকিই থাকে না।",
            },
            {
              title: "বাংলা লেখা দরজাতেই এক রূপে",
              description:
                "App এ NFC করে Save, আর Database এ CHECK (col IS NFC NORMALIZED)। দুই রকম য় আর কখনো খোঁজা ভাঙবে না।",
            },
            {
              title: "Email আর Username এ বড় ছোট হাতের নিয়ম Table বানানোর দিনেই",
              description:
                "citext, অথবা deterministic = false এর Collation। পরে Data জমে গেলে দুইজন Rahim মিলিয়ে এক করা অনেক কঠিন।",
            },
            {
              title: "সাজানোর নিয়ম ঠিক করুন",
              description:
                "বাংলা Column এ আসল Server এ COLLATE \"bn-x-icu\"। আর যে Report সব জায়গায় একই ক্রমে চাই, তার ORDER BY তে Collation স্পষ্ট করে লিখুন।",
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
            ["কোড বা নামের জন্য char(n)", "App পায় পেছনে Space সহ মান, তুলনা চুপচাপ ব্যর্থ", "text, দরকার হলে CHECK"],
            ["অভ্যাসে varchar(255)", "আন্দাজের সীমা, একদিন আসল নাম ফেরত", "text, সীমা শুধু আসল নিয়মে"],
            ["বাংলার সীমা চোখের অক্ষরে গোনা", "value too long, Customer অবাক", "Code Point এ ভাবুন, উদার সীমা"],
            ["সীমার CHECK এ octet_length", "বাংলা লেখা তিনগুণ আগে আটকায়", "char_length"],
            ["Explicit Cast কে নিরাপদ ভাবা", "'Saint Martin'::varchar(5) চুপচাপ Saint", "আগে pg_input_is_valid দিয়ে যাচাই"],
            ["সাধারণ text এ Email UNIQUE", "Rahim আর rahim দুটো Account", "citext, lower Index বা Nondeterministic Collation"],
            ["কিছু Query তে lower, কিছুতে না", "একই মানুষ কোথাও মেলে, কোথাও না", "নিয়মটা Column এ রাখা"],
            ["দুই রকম য় এর কথা না জানা", "কুয়াকাটা লিখে খুঁজলে Row আসে না", "NFC আর IS NFC NORMALIZED এর CHECK"],
            ["বক্সের ক্রমকে Server এর ক্রম ভাবা", "Report এর ক্রম জায়গাভেদে আলাদা", "ORDER BY তে COLLATE স্পষ্ট"],
            ["বাংলা C নিয়মে সাজানো", "উৎসব তালিকার শেষে", "আসল Server এ bn-x-icu"],
            ["বক্সে und-u-ks-level2", "Collation তৈরি হয়, তুলনা তবু বড় ছোট হাত মানে", "বক্সে und@colStrength=secondary"],
            ["MySQL এ CHARACTER SET utf8", "Emoji তে ERROR 1366", "utf8mb4"],
            ["MySQL এ Strict Mode বন্ধ", "লম্বা লেখা চুপচাপ কাটা, শুধু Warning", "STRICT_TRANS_TABLES চালু রাখা"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS tt_tags;
CREATE TABLE tt_tags (tag varchar(5) NOT NULL);

INSERT INTO tt_tags VALUES ('নদী'), ('সমুদ্র');

SELECT tag, char_length(tag) AS chars FROM tt_tags;`}
              caption="ERROR: value too long for type character varying(5)। সমুদ্র চোখে তিনটা ভাগ (স, মু, দ্র), কিন্তু স, ম, ু, দ, ্, র মিলিয়ে ৬টা Code Point। আর একটা Statement এ দুই Row, তাই নদী ও ঢোকেনি। varchar(5) কে text বানিয়ে আবার চালান: ২টা Row, নদী 3 আর সমুদ্র 6।"
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
                    href="https://www.postgresql.org/docs/current/datatype-character.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Character Types
                  </a>
                  : char, varchar আর text এর আনুষ্ঠানিক নিয়ম, Space এর ব্যতিক্রম, আর তিনটার গতিতে পার্থক্য না থাকার কথা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://wiki.postgresql.org/wiki/Don%27t_Do_This"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Wiki: Don&apos;t Do This
                  </a>
                  : char(n) আর অভ্যাসের varchar(n) কেন না, অভিজ্ঞ মানুষদের ভাষায়। পুরো পাতাটাই পড়ার মতো।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/collation.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Collation Support
                  </a>
                  : libc, ICU আর builtin Provider, Nondeterministic Collation আর তার খরচ, ICU এর স্তরগুলোর উদাহরণ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/citext.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: citext
                  </a>
                  : citext কীভাবে তুলনা করে, তার সীমাবদ্ধতা, আর কেন Documentation নিজেই Nondeterministic Collation এর দিকে ইঙ্গিত
                  করে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-string.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: String Functions
                  </a>
                  : normalize, IS NORMALIZED, casefold আর এই লেসনের বাকি Function গুলো।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/18/release-18.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : Nondeterministic Collation এ LIKE, casefold() আর pg_unicode_fast কবে এল, সেই আনুষ্ঠানিক তালিকা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.unicode.org/charts/PDF/U0980.pdf"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Unicode Chart: Bengali
                  </a>
                  : বাংলার প্রতিটা Code Point এর তালিকা। ৎ কেন U+09CE তে, আর য় এর দুই রূপের কথা নিজের চোখে দেখুন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Joel Spolsky: The Absolute Minimum About Unicode
                  </a>
                  : পুরনো কিন্তু এখনো সবচেয়ে প্রিয় লেখা, Character Set আর Encoding এর পার্থক্য সহজ ভাষায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/char.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: The CHAR and VARCHAR Types
                  </a>
                  : CHAR এর Space মোছা, PAD SPACE আর NO PAD, আর Strict Mode এ কী হয়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/charset-unicode-utf8mb4.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: The utf8mb4 Character Set
                  </a>
                  : utf8mb4 আর utf8mb3 এর পার্থক্য।{" "}
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/charset-collation-names.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Collation Naming Conventions
                  </a>{" "}
                  পাতায় _ai, _as, _ci, _cs আর _bin এর মানে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে বা যেকোনো MySQL উদাহরণে VARCHAR(n) দেখলে এই লেসনের প্রশ্নটা করুন: সীমাটা কি সত্যিই
                  একটা নিয়ম, আর Character Set কি utf8mb4?
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
                  char(n) ঠিক n Character রাখে, কম হলে পেছনে Space। Database এর ভেতরে Space উপেক্ষা হয়, কিন্তু App পায় Space সহ।
                  বন্ধনী ছাড়া char মানে char(1)।
                </ListItem>
                <ListItem>
                  varchar(n) সীমা পেরোলে পুরো INSERT বাতিল করে, Error 22001। ব্যতিক্রম দুটো: বাড়তি শুধু Space হলে, আর Explicit Cast
                  এ, দুই ক্ষেত্রেই চুপচাপ কাটা।
                </ListItem>
                <ListItem>
                  PostgreSQL এ তিনটার গতি একই, char(n) সাধারণত সবচেয়ে ধীর। Default text, আর সীমা যখন আসল নিয়ম তখন নাম দেওয়া CHECK।
                  View থাকলে varchar(n) বাড়ানোও আটকে যায়, CHECK বদলানো যায় সহজে।
                </ListItem>
                <ListItem>
                  UTF-8 এ ইংরেজি এক Byte, বাংলা তিন, Emoji চার। PostgreSQL এর Character মানে Code Point: কা দুটো, ক্ষ তিনটা,
                  কক্সবাজার 9। সীমা সবসময় Character এ, Byte এ না।
                </ListItem>
                <ListItem>
                  য়, ড়, ঢ় দুই রূপে লেখা যায়। = Byte মেলায়, তাই দরজাতেই normalize(..., NFC), আর পাহারায় CHECK (col IS NFC
                  NORMALIZED)।
                </ListItem>
                <ListItem>
                  Collation সাজানোর নিয়ম: Database, Column বা Query তে। এই বক্সে C, সাধারণ Server এ en_US.utf8। Provider তিনটা:
                  libc, ICU, builtin।
                </ListItem>
                <ListItem>
                  C তে উৎসব শেষে, কারণ ৎ এর নম্বর U+09CE। und-x-icu ৎ ঠিক করে কিন্তু ং এ বাংলার সাথে মেলে না। বাংলা Column এ আসল
                  Server এ bn-x-icu।
                </ListItem>
                <ListItem>
                  Rahim আর rahim কে এক ধরার তিন জায়গা: Query তে lower বা ILIKE (সাথে lower এর UNIQUE Index), Type এ citext, Collation
                  এ deterministic = false। PostgreSQL 18 এ শেষেরটায় LIKE ও চলে। বক্সে তার পুরনো নাম লাগে।
                </ListItem>
                <ListItem>
                  MySQL এ utf8mb4 নিন, utf8 না। সীমাগুলো Byte এ মাপা: Row 65535 Byte, Index Key 3072 Byte, তাই utf8mb4 এ VARCHAR সর্বোচ্চ 16383 Character। Default _ci আর _ai, তাই
                  Rahim আর rahim এমনিতেই এক, café আর cafe ও। CHAR পড়ার সময় Space মুছে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                লেখা শেষ, এবার সময়। Booking কখন হলো, Departure কবে, Tour কত দিনের, Payment কোন মুহূর্তে। সময়ের Type বাছায় ভুল
                করলে ঢাকার রাত একটার Booking Report এ চলে যায় আগের দিনে, ঠিক যেমন লেখার ভুলে উৎসব চলে গিয়েছিল তালিকার শেষে।
                date, timestamp আর timestamptz এর পার্থক্য, আর কেন ঘটনার সময় সবসময় একটা মুহূর্ত হিসেবে রাখতে হয়, সেটা পরের লেসন{" "}
                <Link href="/sql/topic/date-time-types" className={LINK}>
                  Date and Time Types
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
      ["char(n)", "ঠিক n Character, কম হলে পেছনে Space, App পায় Space সহ", "Tour Code CXB হয়ে যায় [CXB  ]"],
      ["varchar(n)", "n এর বেশি হলে পুরো INSERT বাতিল, Error 22001", "varchar(10) এ Ayesha Siddiqua ঢোকে না"],
      ["text", "Default পছন্দ, ঘোষিত সীমা নেই, গতিতে পার্থক্য নেই", "Island Tours এর সব লেখার Column"],
      ["text আর CHECK", "সীমা যখন নিয়ম, নাম দেওয়া CHECK, বদলানো সহজ", "tt_places2_name_len, 20 থেকে 40"],
      ["UTF-8", "ইংরেজি 1 Byte, বাংলা 3, Emoji 4", "ঢাকা: 4 Character, 12 Byte"],
      ["Character মানে Code Point", "কার আর হসন্ত আলাদা Character", "কক্সবাজার 9, সিলেট varchar(5) এ ঢোকে"],
      ["Normalization", "দুই রূপের য় কে NFC দিয়ে এক রূপে", "কুয়াকাটা, CHECK IS NFC NORMALIZED"],
      ["Collation", "সাজানো আর তুলনার নিয়ম, Database, Column বা Query তে", "বক্সে C, Container এ en_US.utf8"],
      ["বাংলা সাজানো", "C তে ৎ শেষে, ICU তে ঠিক, ং এ bn-x-icu ই নির্ভুল", "উৎসব উত্তরার পরে, কংস নদ সবার আগে"],
      ["lower() আর ILIKE", "Query তে নিয়ম, অনন্যতার জন্য lower এর Index", "RAHIM.UDDIN দিয়ে lower তে 1 Row"],
      ["citext", "Type এই নিয়ম, CREATE EXTENSION এর পরে", "tt_users এ দ্বিতীয় Rahim আটকে গেল"],
      ["deterministic = false", "Collation এ নিয়ম, PostgreSQL 18 এ LIKE ও", "tt_members, বক্সে পুরনো নামে"],
      ["MySQL", "utf8mb4, Byte এর সীমা, Default _ci আর _ai", "Rahim এর দ্বিতীয় Account এ ERROR 1062"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "code Column টা char(5), তাতে 'CXB' রাখা। SELECT concat('[', code, ']') কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "[CXB]",
            isCorrect: false,
            explanation:
              "এটা আসত || দিয়ে জোড়া দিলে, কারণ তখন char থেকে text এ বদলানোর সময় পেছনের Space ঝরে যায়। concat Space রেখে দেয়।",
          },
          {
            key: "B",
            text: "[CXB  ], পেছনে দুটো Space সহ",
            isCorrect: true,
            explanation:
              "ঠিক। char(5) বাকি দুই ঘর Space দিয়ে ভরে রাখে, আর concat সেই Space সহ মান জোড়া দেয়। App ও মান পায় এভাবেই।",
          },
          {
            key: "C",
            text: "Error, কারণ CXB পাঁচ অক্ষরের কম",
            isCorrect: false,
            explanation: "কম হলে char Error দেয় না, Space বসিয়ে পূরণ করে। Error আসে শুধু বেশি হলে।",
          },
          {
            key: "D",
            text: "[  CXB], Space সামনে",
            isCorrect: false,
            explanation: "char সবসময় পেছনে Space বসায়, সামনে কখনো না।",
          },
        ],
      },
      {
        id: 2,
        text: "full_name varchar(10) Column এ INSERT INTO ... VALUES ('Ayesha Siddiqua') চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "প্রথম দশটা Character রাখা হয়",
            isCorrect: false,
            explanation:
              "PostgreSQL INSERT এ নিজে থেকে কাটে না। কাটে শুধু যখন আপনি স্পষ্ট করে Cast করেন, অথবা বাড়তি অংশটা শুধু Space।",
          },
          {
            key: "B",
            text: "ERROR: value too long for type character varying(10), কিছুই ঢোকে না",
            isCorrect: true,
            explanation:
              "ঠিক। নামটা ১৫ Character, সীমা ১০। পুরো INSERT বাতিল, Error Code 22001। এই লেসনের বক্সে ঠিক এটাই দেখেছেন।",
          },
          {
            key: "C",
            text: "পুরো নামটা ঢোকে, varchar এ সীমা শুধু পরামর্শ",
            isCorrect: false,
            explanation: "varchar(n) এর সীমা কড়া। পরামর্শের মতো কিছু চাইলে সীমা ছাড়া text নিন।",
          },
          {
            key: "D",
            text: "একটা Warning দিয়ে কেটে রাখে",
            isCorrect: false,
            explanation:
              "এটা MySQL এর আচরণ, তাও শুধু Strict Mode বন্ধ থাকলে। PostgreSQL এ এমন কোনো Mode নেই, সবসময় Error।",
          },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL এ char(n), varchar(n) আর text এর গতি নিয়ে কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "char(n) সবচেয়ে দ্রুত, কারণ প্রতিটা মানের মাপ সমান",
            isCorrect: false,
            explanation:
              "অন্য কিছু Database এ এটা সত্যি হতে পারে, PostgreSQL এ না। Documentation বলে char(n) সাধারণত সবচেয়ে ধীর, বাড়তি Space এর জায়গার কারণে।",
          },
          {
            key: "B",
            text: "varchar(255) text এর চেয়ে দ্রুত, কারণ সীমা আছে",
            isCorrect: false,
            explanation: "সীমা থাকায় উল্টো সামান্য বাড়তি কাজ হয়, প্রতিবার দৈর্ঘ্য যাচাই। গতির লাভ নেই।",
          },
          {
            key: "C",
            text: "গতিতে কোনো পার্থক্য নেই, char(n) বাড়তি জায়গার কারণে সাধারণত সবচেয়ে ধীর",
            isCorrect: true,
            explanation:
              "ঠিক। Documentation এর ভাষায়, তিনটার মধ্যে Performance এর কোনো পার্থক্য নেই, শুধু char(n) এর বাড়তি জায়গা আর varchar(n) এর দৈর্ঘ্য যাচাই।",
          },
          {
            key: "D",
            text: "ছোট লেখায় text ধীর, লম্বা লেখায় দ্রুত",
            isCorrect: false,
            explanation: "text ছোট লেখায় varchar এর মতোই জায়গা নেয়, বক্সে CXB তে দুটোতেই 7 Byte দেখেছেন।",
          },
        ],
      },
      {
        id: 4,
        text: "char_length('ক্ষ') কত?",
        options: [
          {
            key: "A",
            text: "1, কারণ চোখে একটাই অক্ষর",
            isCorrect: false,
            explanation: "PostgreSQL চোখের অক্ষর গোনে না, Code Point গোনে। ক্ষ এর ভেতরে তিনটা Code Point।",
          },
          {
            key: "B",
            text: "3: ক, হসন্ত আর ষ",
            isCorrect: true,
            explanation: "ঠিক। ক (U+0995), হসন্ত (U+09CD), ষ (U+09B7)। varchar(n) এর সীমাও এভাবেই গোনা হয়।",
          },
          {
            key: "C",
            text: "9",
            isCorrect: false,
            explanation: "9 হলো octet_length, মানে Byte। প্রতিটা বাংলা Code Point UTF-8 এ তিন Byte।",
          },
          {
            key: "D",
            text: "2: ক আর ষ, হসন্ত গোনা হয় না",
            isCorrect: false,
            explanation: "হসন্ত নিজেও একটা Code Point, তাই সেটাও একটা Character হিসেবে গোনা হয়।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা বাংলা নাম চোখে হুবহু একই, তবু WHERE name = 'কুয়াকাটা' Row খুঁজে পায় না। সবচেয়ে সম্ভাব্য কারণ কী?",
        options: [
          {
            key: "A",
            text: "Database এর Collation C",
            isCorrect: false,
            explanation: "C সাজানোর ক্রমে প্রভাব ফেলে। সমান কিনা, সেটা Deterministic Collation এ সবসময় Byte দেখেই ঠিক হয়।",
          },
          {
            key: "B",
            text: "য় দুই রূপে লেখা: একক U+09DF আর য তার নুকতা, তাই Byte আলাদা",
            isCorrect: true,
            explanation:
              "ঠিক। দুটো রূপ চোখে এক, = এর কাছে আলাদা। normalize(..., NFC) দিয়ে এক রূপে আনুন, আর CHECK (name IS NFC NORMALIZED) দিয়ে পাহারা দিন।",
          },
          {
            key: "C",
            text: "পেছনে লুকানো Space",
            isCorrect: false,
            explanation: "সম্ভব, text এ পেছনের Space থাকলে = মেলে না। কিন্তু সেটা char_length বা octet_length এ সহজেই ধরা পড়ে। বাংলা নামে দেখতে হুবহু এক অথচ না মেলার সবচেয়ে চেনা কারণ য় এর দুই রূপ।",
          },
          {
            key: "D",
            text: "UTF8 Database এ বাংলা খোঁজা যায় না",
            isCorrect: false,
            explanation: "UTF8 এ বাংলা পুরোপুরি চলে, এই লেসনের প্রতিটা বক্সই তার প্রমাণ।",
          },
        ],
      },
      {
        id: 6,
        text: "Query বক্সে ORDER BY w দিলে উৎসব তালিকার একদম শেষে বসে। আসল Server এ বাংলা Column এর জন্য সবচেয়ে ভালো সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "ORDER BY lower(w)",
            isCorrect: false,
            explanation: "বাংলায় বড় ছোট হাত নেই, lower কিছুই বদলায় না। সমস্যা ক্রমের নিয়মে।",
          },
          {
            key: "B",
            text: "Column এ COLLATE \"bn-x-icu\"",
            isCorrect: true,
            explanation:
              "ঠিক। bn-x-icu বাংলার নিয়মে সাজায়: ৎ কে ত এর পরিবারে, আর ং কে বাংলার নিয়মের জায়গায়। Column এ দিলে প্রতিটা ORDER BY নিজেই ঠিক।",
          },
          {
            key: "C",
            text: "Column কে char(n) বানানো",
            isCorrect: false,
            explanation: "Type বদলালে ক্রম বদলায় না, ক্রম ঠিক করে Collation।",
          },
          {
            key: "D",
            text: "ORDER BY octet_length(w)",
            isCorrect: false,
            explanation: "এটা লেখার দৈর্ঘ্য ধরে সাজায়, বর্ণক্রমে না।",
          },
        ],
      },
      {
        id: 7,
        text: "Island Tours এর customers.email সাধারণ text, পাশে UNIQUE। 'RAHIM.UDDIN@mail.example' দিয়ে নতুন Customer ঢোকালে কী হয়?",
        options: [
          {
            key: "A",
            text: "UNIQUE ভাঙার Error, কারণ rahim.uddin আগে থেকেই আছে",
            isCorrect: false,
            explanation: "সাধারণ text এর UNIQUE বড় ছোট হাত মানে। তার চোখে বড় হাতের Email টা একদম নতুন।",
          },
          {
            key: "B",
            text: "INSERT সফল, একই মানুষের দুইটা Account হয়ে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। বক্সে BEGIN আর ROLLBACK এর ভেতরে ঠিক এটাই দেখেছেন। সমাধান citext, lower(email) এর UNIQUE Index, বা Nondeterministic Collation।",
          },
          {
            key: "C",
            text: "PostgreSQL নিজে থেকে Email ছোট হাতে বদলে রাখে",
            isCorrect: false,
            explanation: "PostgreSQL মান যেভাবে আসে সেভাবেই রাখে। ছোট হাতে বদলাতে চাইলে সেটা আপনাকেই করতে হয়।",
          },
          {
            key: "D",
            text: "ERROR 22001",
            isCorrect: false,
            explanation: "22001 হলো দৈর্ঘ্যের Error। email text, তার কোনো দৈর্ঘ্যের সীমা নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ Default Setting এ email VARCHAR(255) NOT NULL UNIQUE। Rahim.Uddin@mail.example থাকা অবস্থায় rahim.uddin@mail.example ঢোকালে কী হয়?",
        options: [
          {
            key: "A",
            text: "সফল, MySQL ও বড় ছোট হাত মানে",
            isCorrect: false,
            explanation: "MySQL এর Default Collation utf8mb4_0900_ai_ci, যার ci মানে case insensitive।",
          },
          {
            key: "B",
            text: "ERROR 1062: Duplicate entry",
            isCorrect: true,
            explanation:
              "ঠিক। _ci Collation এ দুটো Email সমান, তাই UNIQUE আটকে দেয়। Container এ ঠিক এই Error এসেছে। বড় ছোট হাত মানাতে চাইলে utf8mb4_0900_as_cs বা _bin লাগে।",
          },
          {
            key: "C",
            text: "ERROR 1406: Data too long",
            isCorrect: false,
            explanation: "1406 হলো দৈর্ঘ্যের Error, আর Email টা 255 এর অনেক কম।",
          },
          {
            key: "D",
            text: "সফল, তবে একটা Warning দেয়",
            isCorrect: false,
            explanation: "অনন্যতা ভাঙা কখনো Warning না, সবসময় Error।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর লেখার Column এর অডিট",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>অডিট:</strong> information_schema.columns থেকে Island Tours এর সব লেখার Column এর তালিকা বের করুন, Table আর Type
        সহ। তারপর তিনটা Column বাছুন যেখানে সত্যিকারের নিয়ম আছে (যেমন phone এর গঠন বা email এর @), আর প্রতিটার জন্য একটা নাম দেওয়া
        CHECK লিখুন। BEGIN আর ROLLBACK এর ভেতরে ALTER TABLE ... ADD CONSTRAINT চালিয়ে দেখান, আসল Data নিয়মটা মানে কিনা।
      </span>,
      <span key="2">
        <strong>বাংলা জায়গার Table:</strong> <code className={CODE}>tt_my_places</code> বানান, যার বাংলা নামের Column এ IS NFC
        NORMALIZED এর CHECK। দশটা বাংলা জায়গার নাম ঢোকান, প্রতিটার Character আর Byte দেখান, আর তিনভাবে সাজান: C, und-x-icu, আর নিজের
        psql এ bn-x-icu। কোথায় ক্রম আলাদা হলো, লিখে রাখুন।
      </span>,
      <span key="3">
        <strong>একই নিয়ম, তিন জায়গায়:</strong> তিনটা ছোট Table বানান, একটায় lower(email) এর UNIQUE Index, একটায় citext, একটায়
        deterministic = false এর Collation। তিনটাতেই Rahim এর দুই রকম Email ঢোকানোর চেষ্টা করুন। প্রতিটার Error এর প্রথম লাইন, আর
        কোনটার জন্য কী আগে চালু করতে হলো, লিখুন।
      </span>,
      <span key="4">
        <strong>MySQL এর সাথে তুলনা:</strong> নিজের MySQL এ একই Email Table VARCHAR(255) দিয়ে বানান। Rahim এর দুই রকম Email, café
        বনাম cafe, আর CHAR(5) এ CXB, এই তিনটা পরীক্ষা চালান। PostgreSQL এর ফলাফলের সাথে পাঁচ লাইনে তুলনা লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন বন্ধু সব Table এ varchar(255) লেখেন আর বাংলা নামের সীমা চোখে গুনে ঠিক করেন। তাঁকে
        বোঝান কেন PostgreSQL এ text আর CHECK ভালো, আর কেন কক্সবাজার এর Character 9।
      </span>,
    ],
    deliverables: [
      <span key="d1">লেখার Column এর তালিকা, তিনটা CHECK আর ROLLBACK এর আগের ফলাফল</span>,
      <span key="d2">tt_my_places এর CREATE TABLE, Character আর Byte এর তালিকা, তিন রকম ক্রম</span>,
      <span key="d3">তিনটা Table এর CREATE আর তিনটা Error এর প্রথম লাইন</span>,
      <span key="d4">MySQL এর তিনটা পরীক্ষার Output আর পাঁচ লাইনের তুলনা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ লেখার Type",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "তিনটা Type আর \\d",
        description:
          "প্রথম ফাইল চালান। char এর Column এ [CXB  ] আর ৫ Byte। শেষে \\d দেখাবে character(5), character varying(5) আর text।",
      },
      {
        title: "দৈর্ঘ্যের Error আর তার Code",
        description:
          "দ্বিতীয় ফাইলে INSERT ব্যর্থ হবে, তারপর \\echo :LAST_ERROR_SQLSTATE লিখবে 22001। Cast এ Saint, আর শেষ লাইনে n এর সর্বোচ্চ সীমার Error।",
      },
      {
        title: "বাংলার Character আর Byte",
        description:
          "তৃতীয় ফাইলে Server আর আপনার psql দুটোর Encoding ই UTF8 হওয়া চাই। তারপর ৪টা Row, ক্ষ তে 3 আর 9, কক্সবাজার এ 9 আর 27।",
      },
      {
        title: "দুই রকম য়",
        description:
          "চতুর্থ ফাইলে প্রথমে f আর t। তারপর NFC এর CHECK: প্রথম INSERT ঢুকবে, দ্বিতীয়টা ব্যর্থ, শেষে count 1।",
      },
      {
        title: "Collation আর বাংলা ক্রম",
        description:
          "পঞ্চম ফাইলে আপনার Database এর Collation দেখুন, তারপর \\x চালু করে তিন রকম ক্রম। C তে উৎসব শেষে, bn-x-icu তে উত্তরার পরে।",
      },
      {
        title: "বড় ছোট হাত না মানা Email",
        description:
          "ষষ্ঠ ফাইলে citext আর Documentation এর নতুন নামের Nondeterministic Collation, দুটোই আপনার নিজের Server এ। শেষ INSERT duplicate key এর Error দেবে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-three-types.sql",
        code: `DROP TABLE IF EXISTS tt_lab_three;
CREATE TABLE tt_lab_three (as_char char(5), as_varchar varchar(5), as_text text);
INSERT INTO tt_lab_three VALUES ('CXB', 'CXB', 'CXB');

SELECT concat('[', as_char, ']') AS c, concat('[', as_varchar, ']') AS v,
       octet_length(as_char) AS c_bytes
FROM tt_lab_three;
-- [CXB  ] | [CXB] | 5

\\d tt_lab_three
--    Column   |         Type         | Collation | Nullable | Default
--  as_char    | character(5)         |           |          |
--  as_varchar | character varying(5) |           |          |
--  as_text    | text                 |           |          |`,
      },
      {
        language: "sql",
        filename: "02-length-errors.sql",
        code: `DROP TABLE IF EXISTS tt_lab_guides;
CREATE TABLE tt_lab_guides (full_name varchar(10));

INSERT INTO tt_lab_guides VALUES ('Ayesha Siddiqua');
-- ERROR:  value too long for type character varying(10)
\\echo :LAST_ERROR_SQLSTATE
-- 22001

SELECT 'Saint Martin'::varchar(5) AS cut,
       pg_input_is_valid('Ayesha Siddiqua', 'varchar(10)') AS fits;
-- Saint | f

SELECT 'x'::varchar(10485761);
-- ERROR:  length for type varchar cannot exceed 10485760`,
      },
      {
        language: "sql",
        filename: "03-bengali-bytes.sql",
        code: `SHOW server_encoding;
-- UTF8
\\encoding
-- UTF8

SELECT w, char_length(w) AS chars, octet_length(w) AS bytes
FROM (VALUES ('Dhaka'), ('ঢাকা'), ('ক্ষ'), ('কক্সবাজার')) AS t(w);
-- (4 rows)
-- Dhaka 5 5 | ঢাকা 4 12 | ক্ষ 3 9 | কক্সবাজার 9 27`,
      },
      {
        language: "sql",
        filename: "04-normalize.sql",
        code: `SELECT U&'\\09DF' = U&'\\09AF\\09BC' AS plain_equal,
       normalize(U&'\\09DF', NFC) = normalize(U&'\\09AF\\09BC', NFC) AS nfc_equal;
-- f | t

DROP TABLE IF EXISTS tt_lab_places;
CREATE TABLE tt_lab_places (name text NOT NULL CHECK (name IS NFC NORMALIZED));

INSERT INTO tt_lab_places
VALUES (normalize(U&'\\0995\\09C1\\09DF\\09BE\\0995\\09BE\\099F\\09BE', NFC));
-- INSERT 0 1

INSERT INTO tt_lab_places VALUES (U&'\\0995\\09C1\\09DF\\09BE\\0995\\09BE\\099F\\09BE');
-- ERROR:  new row for relation "tt_lab_places" violates check constraint "tt_lab_places_name_check"

SELECT count(*) FROM tt_lab_places;
-- 1`,
      },
      {
        language: "sql",
        filename: "05-collations.sql",
        code: `SELECT datcollate FROM pg_database WHERE datname = current_database();
-- Docker এর postgres:18 এ en_US.utf8, আপনার Server এ অন্য কিছুও হতে পারে

\\x on
SELECT string_agg(w, ' · ' ORDER BY w)                    AS server_default,
       string_agg(w, ' · ' ORDER BY w COLLATE "C")        AS c_rule,
       string_agg(w, ' · ' ORDER BY w COLLATE "bn-x-icu") AS bn_rule
FROM (VALUES ('উৎসব'), ('উত্তরা'), ('উখিয়া'), ('উদয়'), ('উথাল')) AS t(w);
-- server_default | উখিয়া · উত্তরা · উৎসব · উথাল · উদয়   (en_US.utf8 এ)
-- c_rule         | উখিয়া · উত্তরা · উথাল · উদয় · উৎসব
-- bn_rule        | উখিয়া · উত্তরা · উৎসব · উথাল · উদয়
\\x off`,
      },
      {
        language: "sql",
        filename: "06-case-insensitive.sql",
        code: `CREATE EXTENSION IF NOT EXISTS citext;
SELECT 'Dhaka'::citext = 'DHAKA' AS citext_same;
-- t

DROP TABLE IF EXISTS tt_lab_members;
DROP COLLATION IF EXISTS tt_lab_ci;
CREATE COLLATION tt_lab_ci (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
CREATE TABLE tt_lab_members (email text COLLATE tt_lab_ci NOT NULL UNIQUE);
INSERT INTO tt_lab_members VALUES ('Rahim.Uddin@mail.example');

SELECT email = 'RAHIM.UDDIN@MAIL.EXAMPLE' AS same, email LIKE 'rahim%' AS like_ok
FROM tt_lab_members;
-- t | t   (LIKE এর এই সুবিধা PostgreSQL 18 থেকে)

INSERT INTO tt_lab_members VALUES ('rahim.uddin@mail.example');
-- ERROR:  duplicate key value violates unique constraint "tt_lab_members_email_key"
-- DETAIL:  Key (email)=(rahim.uddin@mail.example) already exists.`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ড্রিল একটা .sql ফাইলে রেখে <code className={CODE}>\i file.sql</code> দিয়ে চালান। বাংলা লেখা উল্টাপাল্টা দেখালে আগে{" "}
        <code className={CODE}>\encoding</code> দেখুন, UTF8 না হলে <code className={CODE}>\encoding UTF8</code> দিয়ে বদলে নিন। আর
        আপনার Server PostgreSQL 17 বা তার আগের হলে ষষ্ঠ ফাইলের LIKE এর লাইনে Error আসবে, কারণ Nondeterministic Collation এ LIKE এসেছে
        18 এ।
      </ContentParagraph>
    ),
  },
};
