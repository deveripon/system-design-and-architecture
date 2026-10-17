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
  LoadResetLab,
  SequenceDialLab,
  StoredVirtualLab,
} from "../../../components/course/topics/dml/gen-animations";
import {
  CacheBlocksDiagram,
  GeneratedAnatomyDiagram,
  SequenceLineDiagram,
  StoredVirtualSplit,
  VolatilityLadderDiagram,
} from "../../../components/course/topics/dml/gen-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const generatedColumnsSequencesContent: TopicData = {
  id: "generated-columns-sequences",
  introduction: {
    badge: "MODULE 10 · LESSON 06",
    title: <SectionTitle>নিজে থেকে হিসাব হওয়া Column, আর id এর নম্বর আসে কোথা থেকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই Module এ আপনি এতদিন Data বদলেছেন নিজের হাতে: INSERT দিয়ে নতুন Row, UPDATE দিয়ে বদল, DELETE দিয়ে মোছা, আর
          COPY দিয়ে একসাথে হাজার Row। কিন্তু একটা Table এ কিছু মান আছে যেগুলো মানুষের হাতে লেখার কথাই না। একটা Booking এর
          মোট দাম আসলে seats গুণ প্রতি Seat এর দাম, আর একটা নতুন Row এর id আসলে পরের খালি নম্বর। এই দুই ধরনের মান যদি
          মানুষ বা App লেখে, একদিন না একদিন ভুল হবেই।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে দুটো যন্ত্র শিখবেন, যারা এই কাজ Database এর হাতে তুলে দেয়। প্রথমটা Generated Column: এমন একটা Column
          যার মান Database নিজে হিসাব করে, একই Row এর অন্য Column থেকে, আর কেউ চাইলেও তাতে হাত দিতে পারে না। দ্বিতীয়টা
          Sequence: নম্বর বিলি করার সেই যন্ত্র, যেটা Module 09 এ Identity Column এর পেছনে প্রথম দেখেছিলেন। এবার তার সব
          Option, তার ফাঁক পড়ার আসল কারণ, আর পুরনো Data আনার পরে তাকে ঠিক জায়গায় ফেরানোর উপায় পুরোপুরি শিখবেন। সব
          উদাহরণ চলবে gen_ দিয়ে শুরু হওয়া আপনার নিজের Table এ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে কেউ লেখে না, আমি নিজেই জানি আমার মান কত হওয়া উচিত। আর আমার পাশের ভাই Sequence কে জিজ্ঞেস করলে সে শুধু পরের নম্বরটা দেয়, কখনো একই নম্বর দুইবার না।",
      author: "GENERATED ALWAYS AS",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবারের মিটিংয়ে দুটো অভিযোগ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, Island Tours এর সাপ্তাহিক মিটিং। Manager ফারুক সাহেবের হাতে দুটো অভিযোগ। প্রথমটা
                এসেছে Nusrat Jahan এর কাছ থেকে: তিনি ফোন করে Saint Martin এর Quote এ একজন যাত্রী বাড়িয়েছিলেন, 2 থেকে 3।
                Website এ seats ঠিকই 3 দেখাচ্ছে, কিন্তু মোট দাম এখনো 25000 টাকা, অথচ হওয়ার কথা 37500। দ্বিতীয় অভিযোগ
                অফিসের ভেতরের: বৃহস্পতিবার Developer তানিম গত বছরের Departure গুলো নতুন Table এ এনেছিলেন, আর তার পর থেকে
                নতুন Departure যোগ করতে গেলেই Error আসছে, duplicate key।
              </ContentParagraph>
              <ContentParagraph>
                দুটো অভিযোগ আলাদা মনে হলেও আসলে একই রোগ। দুই জায়গাতেই এমন একটা মান মানুষ বা App এর হাতে ছিল, যেটা Database
                নিজেই জানতে পারত। মোট দাম জানা যায় seats আর দাম থেকে। পরের id জানা যায় Table এ কোন নম্বর পর্যন্ত আছে তা থেকে।
                প্রথম অভিযোগটা নিচের Box এ নিজের চোখে দেখুন। তানিমের প্রথম Quote Table এ total_bdt একটা সাধারণ Column, App
                নিজে গুণ করে লেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হাতে লেখা Total, আর তার পিছিয়ে পড়া"
              query={`DROP TABLE IF EXISTS gen_quotes;
CREATE TABLE gen_quotes (
  quote_id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer       text NOT NULL,
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) NOT NULL
);
INSERT INTO gen_quotes (customer, seats, unit_price_bdt, total_bdt) VALUES
  ('Nusrat Jahan', 2, 12500, 25000),
  ('Rahim Uddin', 4, 8500, 34000);
-- Nusrat ফোন করে একজন বাড়ালেন, App শুধু seats বদলাল
UPDATE gen_quotes SET seats = 3 WHERE customer = 'Nusrat Jahan';
SELECT customer, seats, unit_price_bdt, total_bdt,
       seats * unit_price_bdt AS should_be
FROM gen_quotes
ORDER BY quote_id;`}
              caption="২টা Row। Nusrat এর seats 3, total_bdt এখনো 25000.00, অথচ should_be বলছে 37500.00। Rahim এর Row ঠিক আছে, কারণ তাঁর Quote কেউ বদলায়নি। Database কে কেউ বলেনি যে total_bdt আসলে seats আর দামের উপর নির্ভর করে, তাই seats বদলালেও সে চুপ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ভুলটা তানিমের অমনোযোগ না। App এর একটা জায়গায় UPDATE এর সময় total_bdt আবার হিসাব করার কোড লেখা ছিল না,
                ব্যাস। একটা Table এ যত জায়গা থেকে লেখা হয়, যেমন Website, Admin Page, রাতের Import Script, কেউ psql খুলে
                হাতে, প্রতিটা জায়গায় একই গুণ মনে রাখতে হয়। একটাতে ভুললেই দুই Column এর মধ্যে অমিল, আর সেটা চুপচাপ থেকে যায়
                যতক্ষণ না কোনো গ্রাহক ফোন করেন।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসন শেষে আপনি দুটো অভিযোগই চিরতরে বন্ধ করতে পারবেন। প্রথম অর্ধেকে Generated Column, যাতে total_bdt আর কেউ
                লিখতেই না পারে। দ্বিতীয় অর্ধেকে Sequence এর ভেতরের কাজ, যাতে বোঝেন তানিমের Import এর পরে Sequence কেন পিছিয়ে
                ছিল, আর এক লাইনে কীভাবে তাকে সামনে আনতে হয়। মাঝে দেখবেন PostgreSQL 18 এ আসা নতুন VIRTUAL ধরনের Column,
                Function এর তিন চরিত্র, আর CACHE এর কারণে নম্বরে বড় বড় ফাঁক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দুটো নতুন শব্দ, এক লাইনে",
          content: (
            <ContentList>
              <ListItem>
                <strong>Generated Column:</strong> এমন Column যার মান একটা সূত্র দিয়ে Database নিজে বের করে, Spreadsheet
                এর সূত্র লেখা ঘরের মতো। পার্থক্য হলো Spreadsheet এ কেউ সূত্রের উপরেই সংখ্যা লিখে দিতে পারে, Database এ পারে
                না।
              </ListItem>
              <ListItem>
                <strong>Sequence:</strong> ব্যাংকের Token Machine এর মতো একটা আলাদা Database Object, যার একমাত্র কাজ বাড়তে
                থাকা নম্বর বিলি করা, যাতে দুজন কখনো একই নম্বর না পান।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-is-a-generated-column",
      subHeader: { index: "002", title: "What a Generated Column Is" },
      title: <SectionTitle>যে Column এর মান Database নিজে লেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছোটবেলার অঙ্ক খাতার কথা ভাবুন। শিক্ষক বলতেন, প্রতিটা লাইনে দাম আর সংখ্যা লিখতে হবে, আর শেষ ঘরে গুণফল। আপনি
                দাম বা সংখ্যা ভুল লিখতে পারেন, কিন্তু গুণফলটা যদি একটা যন্ত্র নিজে বসিয়ে দিত, তাহলে অন্তত দুই ঘরের মধ্যে অমিল
                কখনো হতো না। Generated Column ঠিক সেই যন্ত্র।
              </ContentParagraph>
              <ContentParagraph>
                Column এর Type এর পরে লিখতে হয় <code className={CODE}>GENERATED ALWAYS AS (সূত্র)</code>, তারপর একটা শব্দ
                যেটা বলে হিসাবটা কখন হবে। এই লেসনের প্রথম অংশে আমরা লিখব <code className={CODE}>STORED</code>, যার মানে
                রেখে দেওয়া: Row লেখার সময় হিসাব হয়, আর উত্তরটা Disk এ থেকে যায়। এর জোড়া ধরন VIRTUAL, সেটা Section 05 এ।
                নিচের ছবিতে লাইনটা পাঁচ টুকরো করে দেখানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GeneratedAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই Quote Table আবার বানান, শুধু total_bdt এর জায়গায় সূত্র। লক্ষ্য করুন INSERT এ total_bdt এর নামই নেই,
              আর UPDATE শুধু seats বদলায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম Generated Column"
              query={`DROP TABLE IF EXISTS gen_quotes;
CREATE TABLE gen_quotes (
  quote_id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer       text NOT NULL,
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED
);
INSERT INTO gen_quotes (customer, seats, unit_price_bdt) VALUES
  ('Nusrat Jahan', 2, 12500),
  ('Rahim Uddin', 4, 8500);
UPDATE gen_quotes SET seats = 3 WHERE customer = 'Nusrat Jahan';
SELECT customer, seats, unit_price_bdt, total_bdt
FROM gen_quotes
ORDER BY quote_id;`}
              caption="Nusrat 3 seats, total_bdt 37500.00। Rahim 4 seats, 34000.00। কেউ total_bdt লেখেনি, UPDATE এও না। seats বদলানোর মুহূর্তে PostgreSQL নিজেই আবার গুণ করেছে। প্রথম Box এর অভিযোগ এই Table এ ঘটতেই পারে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database এই Column টাকে কীভাবে মনে রাখে? information_schema.columns এ দুটো Column আছে ঠিক এই কাজের জন্য:{" "}
                <code className={CODE}>is_generated</code> বলে Column টা Generated কিনা (ALWAYS মানে হ্যাঁ, NEVER মানে
                সাধারণ), আর <code className={CODE}>generation_expression</code> এ থাকে সূত্রটা, PostgreSQL যেভাবে বুঝেছে
                সেভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Database নিজে কী মনে রাখে"
              query={`SELECT column_name, is_generated, generation_expression
FROM information_schema.columns
WHERE table_name = 'gen_quotes'
ORDER BY ordinal_position;`}
              caption="৫টা Row। চারটা Column NEVER, শুধু total_bdt ALWAYS, আর তার সূত্র ((seats)::numeric * unit_price_bdt)। লক্ষ্য করুন PostgreSQL নিজে থেকে smallint seats কে numeric এ বদলে নিয়েছে, যাতে গুণফল numeric হয়। উপরের Box আগে চালাতে হবে, নইলে gen_quotes থাকবে না আর ফলাফল খালি আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "psql এ \\d দিয়ে দেখলে",
          content: (
            <ContentParagraph>
              নিজের psql এ <code className={CODE}>\d gen_quotes</code> লিখলে Default Column এ দেখবেন{" "}
              <code className={CODE}>generated always as ((seats::numeric * unit_price_bdt)) stored</code>। আর quote_id এর
              পাশে <code className={CODE}>generated always as identity</code>। দুটোতেই GENERATED ALWAYS শব্দ আছে, কারণ দুটোর
              মান আসে Database থেকে: একটার Sequence থেকে, আরেকটার সূত্র থেকে।
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
                  <code className={CODE}>gen_ex1_fares</code> নামে একটা Table বানান: fare_id (integer, Identity, Primary
                  Key), seats (smallint, NOT NULL), unit_price_bdt (numeric(10, 2), NOT NULL), আর total_bdt
                  (numeric(10, 2)), যেটা seats গুণ unit_price_bdt, Database নিজে হিসাব করবে। Starter এর INSERT, UPDATE আর শেষের
                  SELECT বদলাবেন না, শুধু ফাঁকা জায়গায় CREATE TABLE লিখুন।
                </>
              }
              hint={
                <>
                  উপরের Box এর gen_quotes এর total_bdt লাইনটাই নিন:{" "}
                  <code className={CODE}>GENERATED ALWAYS AS (seats * unit_price_bdt) STORED</code>। customer Column লাগবে না।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ex1_fares;
-- এখানে CREATE TABLE gen_ex1_fares লিখুন

-- নিচের তিনটা Statement বদলাবেন না
INSERT INTO gen_ex1_fares (seats, unit_price_bdt) VALUES (2, 12500), (3, 8500), (1, 3500);
UPDATE gen_ex1_fares SET seats = 4 WHERE unit_price_bdt = 8500;
SELECT f.seats, f.unit_price_bdt, f.total_bdt, c.is_generated
FROM gen_ex1_fares f
CROSS JOIN information_schema.columns c
WHERE c.table_name = 'gen_ex1_fares' AND c.column_name = 'total_bdt'
ORDER BY f.unit_price_bdt DESC;`}
              solution={`SELECT * FROM (VALUES
  (2, 12500.00, 25000.00, 'ALWAYS'),
  (4, 8500.00, 34000.00, 'ALWAYS'),
  (1, 3500.00, 3500.00, 'ALWAYS')
) AS v(seats, unit_price_bdt, total_bdt, is_generated);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "rules",
      subHeader: { index: "003", title: "Rules of a Generated Column" },
      title: <SectionTitle>যে নিয়মগুলো Generated Column ভাঙতে দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Generated Column এর পুরো শক্তি একটা প্রতিজ্ঞায়: এর মান সবসময় সূত্রের সাথে মিলবে। এই প্রতিজ্ঞা রাখতে PostgreSQL
                কয়েকটা কাজ একদম নিষেধ করে দেয়। প্রথম নিয়মটাই সবচেয়ে গুরুত্বপূর্ণ: Generated Column এ নিজের হাতে মান লেখা
                যায় না, INSERT এও না, UPDATE এও না। একটাই শব্দ চলে, <code className={CODE}>DEFAULT</code>, যার মানে এই ঘরের মান
                Database নিজে বসাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের হাতে Total লিখলে"
              query={`DROP TABLE IF EXISTS gen_rules;
CREATE TABLE gen_rules (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED
);
INSERT INTO gen_rules (seats, unit_price_bdt, total_bdt) VALUES (2, 12500, DEFAULT);
SELECT * FROM gen_rules;
INSERT INTO gen_rules (seats, unit_price_bdt, total_bdt) VALUES (2, 12500, 99999);`}
              caption={`প্রথম INSERT এ total_bdt এর জায়গায় DEFAULT, তাই চলেছে: SELECT এ 2, 12500.00, 25000.00। দ্বিতীয় INSERT এ নিজের 99999, তাই ERROR: cannot insert a non-DEFAULT value into column "total_bdt", DETAIL: Column "total_bdt" is a generated column। SQLSTATE 428C9, ঠিক সেই কোড যেটা Module 09 এ GENERATED ALWAYS AS IDENTITY তে নিজের id দিলে এসেছিল।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              UPDATE এও একই নিয়ম। seats বদলান, total নিজে বদলাবে। total কে সরাসরি বদলাতে চাইলে Error। উপরের Box চালানোর পরে
              এটা চালান, কারণ এটা gen_rules এর সেই Row টাই ব্যবহার করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UPDATE দিয়েও না"
              query={`UPDATE gen_rules SET seats = 4;
SELECT * FROM gen_rules;
UPDATE gen_rules SET total_bdt = 30000;`}
              caption={`প্রথম UPDATE চলেছে, SELECT এ 4, 12500.00, 50000.00। দ্বিতীয়টায় ERROR: column "total_bdt" can only be updated to DEFAULT, সাথে একই DETAIL আর 428C9। চাইলে লেখা যায় SET total_bdt = DEFAULT, তাতে শুধু আবার হিসাব হয়, কোনো লাভ নেই।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় নিয়ম: একটা Generated Column এর সূত্রে আরেকটা Generated Column এর নাম থাকতে পারে না। স্বাভাবিকভাবে মনে
                হয়, total_bdt তো আছেই, VAT এর জন্য লিখি <code className={CODE}>total_bdt * 0.15</code>। PostgreSQL রাজি না।
                Documentation এর ভাষায়, একটা Generation Expression অন্য Generated Column কে Reference করতে পারে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Generated Column থেকে আরেকটা"
              query={`DROP TABLE IF EXISTS gen_chain;
CREATE TABLE gen_chain (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  vat_bdt        numeric(10, 2) GENERATED ALWAYS AS (round(total_bdt * 0.15, 2)) STORED
);`}
              caption={`ERROR: cannot use generated column "total_bdt" in column generation expression, DETAIL: A generated column cannot reference another generated column। SQLSTATE 42P17। Table টা তৈরিই হয়নি।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান সহজ: সূত্রটা আবার লিখুন, মূল Column থেকে। একটু লম্বা হয়, কিন্তু প্রতিটা Generated Column এর সূত্র নিজে
              সম্পূর্ণ থাকে। নিচের Box এ unit_price_bdt থেকে NOT NULL সরানো, যাতে আরেকটা জিনিসও দেখা যায়: সূত্রের কোনো অংশ
              NULL হলে উত্তরও NULL।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সূত্র আবার লেখা, আর NULL এর প্রভাব"
              query={`DROP TABLE IF EXISTS gen_chain;
CREATE TABLE gen_chain (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2),
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  vat_bdt        numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 0.15, 2)) STORED
);
INSERT INTO gen_chain (seats, unit_price_bdt) VALUES (2, 12500), (3, 7800), (1, NULL);
SELECT * FROM gen_chain;`}
              caption="৩টা Row: 2, 12500.00, 25000.00, 3750.00; তারপর 3, 7800.00, 23400.00, 3510.00; শেষ Row এ দাম NULL, তাই total_bdt আর vat_bdt দুটোই খালি (NULL)। Module 03 এর নিয়ম এখানেও খাটে: NULL এর সাথে যেকোনো হিসাব NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>বাকি নিয়মগুলো এক জায়গায়, প্রতিটা PostgreSQL 18 এ চালিয়ে দেখা:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুধু নিজের Row:</strong> সূত্র শুধু একই Row এর Column দেখতে পারে। অন্য Table থেকে কিছু আনতে Subquery
                  লিখলে <code className={CODE}>cannot use subquery in column generation expression</code>। অন্য Table এর
                  মান লাগলে সেটা Query এর সময় JOIN এর কাজ।
                </ListItem>
                <ListItem>
                  <strong>DEFAULT আর GENERATED একসাথে না:</strong> একই Column এ দুটো দিলে{" "}
                  <code className={CODE}>both default and generation expression specified</code>। যুক্তিটা সোজা, মান
                  একটাই জায়গা থেকে আসবে।
                </ListItem>
                <ListItem>
                  <strong>Identity আর GENERATED একসাথে না:</strong> একটা Column হয় Sequence থেকে নম্বর পায়, নয় সূত্র থেকে, দুটো
                  না।
                </ListItem>
                <ListItem>
                  <strong>শুধু IMMUTABLE Function:</strong> এটা এত গুরুত্বপূর্ণ যে পরের পুরো Section এর বিষয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "immutable-only",
      subHeader: { index: "004", title: "Immutable Expressions Only" },
      title: <SectionTitle>সূত্রে শুধু সেই Function, যার উত্তর কখনো বদলায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের মাথায় একটা সুন্দর বুদ্ধি এল: প্রতিটা Booking এর পাশে একটা Column থাকুক, কত দিন আগে Booking হয়েছে।
                সূত্র তো সহজ, আজকের তারিখ বিয়োগ Booking এর তারিখ। কিন্তু একটু ভাবুন। STORED Column এর উত্তর লেখা হয় Row লেখার
                মুহূর্তে। আজ লিখলে উত্তর 0, কাল সেই উত্তর ভুল, পরশু আরও ভুল, অথচ Row কেউ ছোঁয়নি বলে কেউ আবার হিসাবও করবে না।
                PostgreSQL এই ফাঁদ আগেই ধরে ফেলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আজকের তারিখ দিয়ে Generated Column"
              query={`DROP TABLE IF EXISTS gen_clock;
CREATE TABLE gen_clock (
  booked_on date NOT NULL,
  days_ago  integer GENERATED ALWAYS AS (current_date - booked_on) STORED
);`}
              caption="ERROR: generation expression is not immutable। SQLSTATE 42P17। current_date আজ এক উত্তর দেয়, কাল আরেক, তাই সূত্রে চলে না। কত দিন আগে, এই প্রশ্নের উত্তর Query লেখার সময় হিসাব করার জিনিস, রেখে দেওয়ার জিনিস না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL প্রতিটা Function এর গায়ে একটা চরিত্রের লেবেল লাগিয়ে রাখে, যার নাম Volatility (অস্থিরতা)। তিনটা
                লেবেল:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>IMMUTABLE (i):</strong> একই Input দিলে চিরকাল একই Output। <code className={CODE}>round(12500.456, 2)</code>{" "}
                  আজও 12500.46, দশ বছর পরেও। গুণ, যোগ, <code className={CODE}>||</code> দিয়ে text জোড়া, lower(), এরা সবাই
                  এই দলে।
                </ListItem>
                <ListItem>
                  <strong>STABLE (s):</strong> একটা Statement এর ভেতরে একই উত্তর, কিন্তু সময় বা কোনো Setting বদলালে উত্তর
                  বদলাতে পারে। now(), current_date এই দলে। Documentation নিজেই সাবধান করে: যে Function এর উত্তর TimeZone এর মতো
                  কোনো Setting এর উপর নির্ভর করে, সে STABLE।
                </ListItem>
                <ListItem>
                  <strong>VOLATILE (v):</strong> প্রতিবার ডাকলে আলাদা হতে পারে। random(), clock_timestamp(), আর nextval(), যেটা
                  এই লেসনের দ্বিতীয় অর্ধেকের নায়ক।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Generated Column এর সূত্রে শুধু IMMUTABLE চলে। লেবেলগুলো লুকানো না, pg_proc নামের Catalog Table এর{" "}
                <code className={CODE}>provolatile</code> Column এ লেখা আছে। নিচের Box কয়েকটা চেনা Function এর লেবেল পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <VolatilityLadderDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Function গুলোর চরিত্র"
              query={`SELECT f AS function, p.provolatile AS volatility
FROM unnest(ARRAY[
  'now()',
  'age(timestamp with time zone)',
  'concat("any")',
  'to_char(timestamp with time zone,text)',
  'date_trunc(text,timestamp with time zone)',
  'date_trunc(text,timestamp with time zone,text)',
  'textcat(text,text)',
  'round(numeric,integer)'
]) WITH ORDINALITY AS t(f, n)
JOIN pg_proc p ON p.oid = to_regprocedure(f)
ORDER BY n;`}
              caption="৮টা Row। now, age, concat, to_char আর দুই Argument এর date_trunc সবাই s, মানে STABLE। শেষ তিনটা i: Time Zone এর নাম সহ তিন Argument এর date_trunc, textcat (যেটা || এর পেছনের Function), আর round। একই নামের date_trunc দুই রকম চরিত্রের, কারণ তৃতীয় Argument এ Time Zone বলে দিলে উত্তর আর Session এর Setting এর উপর নির্ভর করে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে অবাক করা নাম concat। দুটো text জোড়া দেওয়ার মতো নিরীহ কাজ STABLE কেন? কারণ concat যেকোনো Type নেয়, আর
                নেওয়ার আগে সবকিছুকে text বানায়। একটা date কে text বানানোর ফলাফল DateStyle নামের Setting এর উপর নির্ভর করে।
                নিজে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="concat কেন STABLE"
              query={`SELECT concat('Trip on ', DATE '2026-11-01') AS iso_style;
SET DateStyle = 'German';
SELECT concat('Trip on ', DATE '2026-11-01') AS german_style;
RESET DateStyle;
SELECT concat('Trip on ', DATE '2026-11-01') AS back_again;`}
              caption="একই Input, তিনটা উত্তর: Trip on 2026-11-01, তারপর Setting বদলানোর পরে Trip on 01.11.2026, তারপর RESET এর পরে আবার 2026-11-01। যে Function এর উত্তর একটা Setting এ বদলায়, তার উত্তর Disk এ রেখে দেওয়া বিপজ্জনক। শেষের RESET টা জরুরি, নইলে এই Page এর বাকি Box গুলোও German ধাঁচে তারিখ দেখাত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে সমাধান কী? প্রায় সব সময় একই কাজের একটা IMMUTABLE রাস্তা আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  concat এর বদলে <code className={CODE}>||</code>, যখন সবগুলো অংশ আগে থেকেই text।
                </ListItem>
                <ListItem>
                  একটা date থেকে মাসের প্রথম দিন চাইলে <code className={CODE}>date_trunc(&apos;month&apos;, starts_on)</code>{" "}
                  চলবে না, কারণ date কে PostgreSQL চুপচাপ timestamptz বানিয়ে নেয়, আর সেটা Time Zone নির্ভর। লিখুন{" "}
                  <code className={CODE}>date_trunc(&apos;month&apos;, starts_on::timestamp)::date</code>। Time Zone ছাড়া
                  timestamp এ date_trunc IMMUTABLE।
                </ListItem>
                <ListItem>
                  timestamptz এর মাস চাইলে Time Zone এর নাম সহ তিন Argument এর রূপ:{" "}
                  <code className={CODE}>date_trunc(&apos;month&apos;, booked_at, &apos;Asia/Dhaka&apos;)</code>। Project
                  Example এ এটা Island Tours এর bookings এ চালাবেন।
                </ListItem>
                <ListItem>
                  আজকের তারিখের উপর নির্ভর করা যেকোনো প্রশ্ন, যেমন বয়স বা কত দিন বাকি, Generated Column এ না। সেটা Query তে
                  হিসাব করুন, অথবা Module 14 এর{" "}
                  <Link href="/sql/topic/views" className={LINK}>
                    View
                  </Link>{" "}
                  তে রাখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে সূত্রগুলো চলে"
              query={`DROP TABLE IF EXISTS gen_trips;
CREATE TABLE gen_trips (
  first_name  text NOT NULL,
  last_name   text,
  starts_on   date NOT NULL,
  full_name   text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  start_month date GENERATED ALWAYS AS (date_trunc('month', starts_on::timestamp)::date) STORED
);
INSERT INTO gen_trips (first_name, last_name, starts_on) VALUES
  ('Nusrat', 'Jahan', '2026-11-20'),
  ('Imran', NULL, '2026-12-18');
SELECT * FROM gen_trips;`}
              caption="২টা Row। Nusrat Jahan, start_month 2026-11-01। কিন্তু Imran এর last_name NULL, তাই || এর পুরো ফলাফল NULL, full_name খালি। ঠিক করতে পদবির অংশটাকে NULL থেকে বাঁচান: first_name || coalesce(' ' || last_name, ''), coalesce নিজেও IMMUTABLE। start_month দুজনেরই ঠিক, 2026-11-01 আর 2026-12-01।"
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
                  <code className={CODE}>gen_ex2_trips</code> বানান: trip_id (Identity, Primary Key), guest (text, NOT NULL),
                  starts_on (date, NOT NULL), nights (smallint, NOT NULL), আর দুটো Generated Column: ends_on (date), যেটা
                  starts_on এর সাথে nights যোগ করে, আর start_month (date), যেটা starts_on এর মাসের প্রথম দিন। দুটোই STORED
                  রাখুন। Starter এর বাকি অংশ বদলাবেন না।
                </>
              }
              hint={
                <>
                  date এর সাথে একটা পূর্ণসংখ্যা যোগ করলে date আসে: <code className={CODE}>starts_on + nights</code>। মাসের জন্য
                  সরাসরি date_trunc দিলে Error 42P17 আসবে, আগে <code className={CODE}>::timestamp</code> করে নিন, শেষে{" "}
                  <code className={CODE}>::date</code>।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ex2_trips;
-- এখানে CREATE TABLE gen_ex2_trips লিখুন

-- নিচের দুটো Statement বদলাবেন না
INSERT INTO gen_ex2_trips (guest, starts_on, nights) VALUES
  ('Rahim Uddin', '2026-11-20', 2),
  ('Priya Sharma', '2026-11-29', 3),
  ('Oliver Bennett', '2027-01-30', 4);
SELECT guest, ends_on, start_month,
       (SELECT count(*) FROM information_schema.columns
         WHERE table_name = 'gen_ex2_trips' AND is_generated = 'ALWAYS') AS generated_columns
FROM gen_ex2_trips
ORDER BY starts_on;`}
              solution={`SELECT * FROM (VALUES
  ('Rahim Uddin', DATE '2026-11-22', DATE '2026-11-01', 2),
  ('Priya Sharma', DATE '2026-12-02', DATE '2026-11-01', 2),
  ('Oliver Bennett', DATE '2027-02-03', DATE '2027-01-01', 2)
) AS v(guest, ends_on, start_month, generated_columns);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "stored-vs-virtual",
      subHeader: { index: "005", title: "STORED vs VIRTUAL" },
      title: <SectionTitle>হিসাব কখন হবে: লেখার সময় না পড়ার সময়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ প্রতিটা Generated Column এ STORED লিখেছেন। PostgreSQL 12 এ Generated Column যখন প্রথম আসে, তখন এটাই
                একমাত্র ধরন ছিল। PostgreSQL 18 এ এসেছে দ্বিতীয় ধরন, VIRTUAL, আর Release Notes এর ভাষায় এখন এটাই Default।
                মানে শেষে কিছু না লিখলে আপনি VIRTUAL পাবেন।
              </ContentParagraph>
              <ContentParagraph>
                দুটোর পার্থক্য একটা রেস্টুরেন্টের উদাহরণে বোঝা সহজ। STORED হলো আগে থেকে রান্না করে রাখা খাবার: অর্ডার এলে শুধু
                তুলে দেওয়া, কিন্তু রান্নাঘরে জায়গা লাগে। VIRTUAL হলো অর্ডার এলে রান্না: জায়গা লাগে না, কিন্তু প্রতিটা অর্ডারে
                রান্নার সময় লাগে। STORED এ গুণটা হয় INSERT আর UPDATE এর সময়, উত্তর Disk এ থাকে। VIRTUAL এ Disk এ শুধু মূল
                Column গুলো থাকে, আর প্রতিবার SELECT এ সেই Column চাইলে গুণটা নতুন করে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StoredVirtualSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোন Column কোন ধরনের, সেটা pg_attribute এর <code className={CODE}>attgenerated</code> Column এ লেখা থাকে: s মানে
              STORED, v মানে VIRTUAL, ফাঁকা মানে সাধারণ Column। নিচের Table এ তিনটা Column: একটায় STORED, একটায় VIRTUAL, আর
              একটায় কিছুই লেখা নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL 18 এ Default কোনটা"
              query={`DROP TABLE IF EXISTS gen_kinds;
CREATE TABLE gen_kinds (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_stored   numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  total_virtual  numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) VIRTUAL,
  total_default  numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt)
);
SELECT attname, attgenerated
FROM pg_attribute
WHERE attrelid = 'gen_kinds'::regclass AND attgenerated <> ''
ORDER BY attnum;`}
              caption="৩টা Row: total_stored এর পাশে s, total_virtual এর পাশে v, আর total_default এর পাশেও v। কিছু না লিখলে PostgreSQL 18 VIRTUAL বানায়। PostgreSQL 17 বা তার আগের Server এ একই লাইনে STORED না লিখলে Table তৈরিই হতো না, তাই পুরনো Tutorial এ সবখানে STORED দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              জায়গার হিসাবটা চোখে দেখা যাক। তিনটা Table, প্রতিটায় ৫০০০ Row। প্রথমটায় শুধু seats আর দাম। দ্বিতীয়টায় তার সাথে তিনটা
              STORED হিসাব: মোট, VAT আর VAT সহ মোট। তৃতীয়টায় একই তিনটা হিসাব, কিন্তু VIRTUAL। pg_relation_size বলে দেয় Table
              টা Disk এ কত Byte নিয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Disk এ কত জায়গা"
              query={`DROP TABLE IF EXISTS gen_size_plain, gen_size_stored, gen_size_virtual;
CREATE TABLE gen_size_plain (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL
);
CREATE TABLE gen_size_stored (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  vat_bdt        numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 0.15, 2)) STORED,
  payable_bdt    numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 1.15, 2)) STORED
);
CREATE TABLE gen_size_virtual (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) VIRTUAL,
  vat_bdt        numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 0.15, 2)) VIRTUAL,
  payable_bdt    numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 1.15, 2)) VIRTUAL
);
INSERT INTO gen_size_plain SELECT g % 5 + 1, 12500 FROM generate_series(1, 5000) AS g;
INSERT INTO gen_size_stored SELECT g % 5 + 1, 12500 FROM generate_series(1, 5000) AS g;
INSERT INTO gen_size_virtual SELECT g % 5 + 1, 12500 FROM generate_series(1, 5000) AS g;
SELECT 'plain' AS kind, pg_relation_size('gen_size_plain') AS bytes
UNION ALL SELECT 'stored', pg_relation_size('gen_size_stored')
UNION ALL SELECT 'virtual', pg_relation_size('gen_size_virtual');`}
              caption="plain 229376, stored 303104, virtual 229376 Byte। VIRTUAL Table টা হুবহু হিসাবহীন Table এর সমান, কারণ Disk এ তার হিসাবের Column গুলো নেই। STORED প্রায় এক তৃতীয়াংশ বড়। PostgreSQL 18.6 Server এর psql এও ঠিক এই তিনটা সংখ্যা এসেছে। INSERT এ Column এর তালিকা নেই, তবু চলেছে, কারণ Generated Column গুলো নিজের মান নিজে পায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VIRTUAL Column যে সত্যিই পড়ার সময় হিসাব হয়, তার প্রমাণ দেখা যায় Query Plan এ। EXPLAIN একটা Query চালায় না,
                শুধু বলে PostgreSQL কীভাবে চালাত (পুরো গল্প Module 13 এর{" "}
                <Link href="/sql/topic/explain-analyze" className={LINK}>
                  EXPLAIN ANALYZE
                </Link>{" "}
                লেসনে)। উপরের Box চালানোর পরে নিচেরটা চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="VIRTUAL এর হিসাব Plan এ"
              query={`EXPLAIN (COSTS OFF)
SELECT * FROM gen_size_virtual WHERE total_bdt > 50000;
EXPLAIN (COSTS OFF)
SELECT * FROM gen_size_stored WHERE total_bdt > 50000;`}
              caption="প্রথম Plan এর Filter এ total_bdt শব্দটাই নেই, তার জায়গায় পুরো সূত্র: ((((seats)::numeric * unit_price_bdt))::numeric(10,2) > '50000'::numeric)। মানে PostgreSQL Column এর নাম সরিয়ে সূত্র বসিয়েছে, প্রতিটা Row এ গুণ করবে। দ্বিতীয় Plan এ সরল Filter: (total_bdt > '50000'::numeric), Disk থেকে তৈরি উত্তর পড়বে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হিসাব কখন হয়, তার একটা বড় ফলাফল আছে: ভুল Data কখন ধরা পড়ে। ধরুন সূত্রে ভাগ আছে, প্রতি Seat এর দাম ={" "}
                <code className={CODE}>total_bdt / seats</code>, আর কেউ ভুল করে seats 0 লিখল। শূন্য দিয়ে ভাগ Error। STORED
                এ গুণ বা ভাগ হয় লেখার সময়, তাই ভুল Row টা ঢুকতেই পারে না। VIRTUAL এ লেখার সময় কোনো হিসাব নেই, তাই Row ঢুকে যায়,
                আর Error আসে পরে, যে কেউ সেই Column পড়তে যাবে তার কাছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="VIRTUAL: ভুল Row ঢুকে যায়, Error আসে পড়ার সময়"
              query={`DROP TABLE IF EXISTS gen_per_seat_v;
CREATE TABLE gen_per_seat_v (
  total_bdt    numeric(10, 2) NOT NULL,
  seats        smallint NOT NULL,
  per_seat_bdt numeric GENERATED ALWAYS AS (round(total_bdt / seats, 2)) VIRTUAL
);
INSERT INTO gen_per_seat_v (total_bdt, seats) VALUES (25000, 2), (12000, 0);
SELECT count(*) AS rows_saved FROM gen_per_seat_v;
SELECT total_bdt, seats, per_seat_bdt FROM gen_per_seat_v;`}
              caption="INSERT চলেছে, rows_saved 2, মানে seats 0 এর Row টাও Table এ বসে আছে। শেষ SELECT এ ERROR: division by zero, SQLSTATE 22012। count(*) per_seat_bdt পড়েনি, তাই চলেছে। যে Report এই Column পড়বে, সেটাই ভেঙে পড়বে, হয়তো মাস খানেক পরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="STORED: ভুল Row ঢোকার আগেই থামে"
              query={`DROP TABLE IF EXISTS gen_per_seat_s;
CREATE TABLE gen_per_seat_s (
  total_bdt    numeric(10, 2) NOT NULL,
  seats        smallint NOT NULL,
  per_seat_bdt numeric GENERATED ALWAYS AS (round(total_bdt / seats, 2)) STORED
);
INSERT INTO gen_per_seat_s (total_bdt, seats) VALUES (25000, 2), (12000, 0);`}
              caption="ERROR: division by zero, INSERT এর মুহূর্তেই। একই Statement এ থাকা ঠিক Row টাও ঢোকেনি, কারণ একটা Statement হয় পুরোটা হয়, নয় কিছুই না। দুই ধরনেই আসল সমাধান একই: seats এ CHECK (seats > 0), Module 09 এর মতো, যাতে ভুল Data দরজাতেই আটকায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StoredVirtualLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  Starter tours এর একটা Copy বানায়, <code className={CODE}>gen_ex3_tours</code>। ফাঁকা জায়গায় একটা ALTER TABLE
                  লিখে <code className={CODE}>price_per_day_bdt</code> নামে একটা VIRTUAL Generated Column যোগ করুন: price_bdt
                  ভাগ duration_days, round করে দুই দশমিক ঘর। শেষের Query বদলাবেন না, সেটা প্রতিটা ট্যুরের উত্তর আর Column এর ধরন
                  (attgenerated) দেখায়।
                </>
              }
              hint={
                <>
                  Column যোগ করা হয় <code className={CODE}>ALTER TABLE gen_ex3_tours ADD COLUMN ...</code> দিয়ে, তারপর বাকিটা
                  CREATE TABLE এর Column লাইনের মতোই: নাম, Type, GENERATED ALWAYS AS (সূত্র), আর VIRTUAL অথবা কিছুই না।
                  STORED দিলে kind এ s আসবে, মিলবে না।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ex3_tours;
CREATE TABLE gen_ex3_tours AS
SELECT tour_id, title, duration_days, price_bdt FROM tours;
-- এখানে আপনার ALTER TABLE

-- নিচের Query বদলাবেন না
SELECT t.tour_id, t.price_per_day_bdt, a.attgenerated::text AS kind
FROM gen_ex3_tours t
JOIN pg_attribute a
  ON a.attrelid = 'gen_ex3_tours'::regclass AND a.attname = 'price_per_day_bdt'
ORDER BY t.tour_id;`}
              solution={`SELECT tour_id, round(price_bdt / duration_days, 2) AS price_per_day_bdt, 'v' AS kind
FROM tours
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "limits-of-virtual",
      subHeader: { index: "006", title: "Limits of VIRTUAL" },
      title: <SectionTitle>VIRTUAL যা এখনো পারে না, আর কখন কোনটা বাছবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                VIRTUAL নতুন, আর PostgreSQL 18 এ তার কিছু সীমা আছে। সবচেয়ে বড়টা: VIRTUAL Column এ Index বসানো যায় না। Index
                হলো বইয়ের শেষের সূচিপত্রের মতো, যেটা খোঁজাকে দ্রুত করে (পুরো গল্প Module 13 এ)। সূচিপত্র বানাতে মানগুলো কোথাও
                লেখা থাকতে হয়, আর VIRTUAL এর মান কোথাও লেখা নেই। তবে একটা রাস্তা খোলা: সূত্রটার উপরেই সরাসরি Index, যার নাম
                Expression Index।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Index: STORED এ চলে, VIRTUAL এ না"
              query={`DROP TABLE IF EXISTS gen_limits;
CREATE TABLE gen_limits (
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_virtual  numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) VIRTUAL,
  total_stored   numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED
);
CREATE INDEX gen_limits_stored_idx ON gen_limits (total_stored);
CREATE INDEX gen_limits_expr_idx ON gen_limits ((seats * unit_price_bdt));
SELECT indexname FROM pg_indexes WHERE tablename = 'gen_limits' ORDER BY indexname;
CREATE INDEX gen_limits_virtual_idx ON gen_limits (total_virtual);`}
              caption="প্রথম দুটো Index তৈরি হয়েছে, তালিকায় gen_limits_expr_idx আর gen_limits_stored_idx। তৃতীয়টায় ERROR: indexes on virtual generated columns are not supported, SQLSTATE 0A000, মানে এই কাজটা এখনো বানানো হয়নি। দ্বিতীয় Index টা লক্ষ্য করুন: Column এর নাম না, সূত্রটাই দুই জোড়া বন্ধনীর ভেতরে। Expression Index এর পুরো গল্প Module 13 এর Partial, Expression and Covering লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় সীমা নিজের লেখা Function নিয়ে। Documentation বলে VIRTUAL এর সূত্রে শুধু PostgreSQL এর নিজের Function আর
              Type চলবে, নিজের বানানো Function না। STORED এ এই বাধা নেই। নিচের Box এ CREATE FUNCTION দিয়ে VAT এর একটা ছোট
              Function বানানো হয়েছে, Module 14 এর{" "}
              <Link href="/sql/topic/sql-functions" className={LINK}>
                SQL Functions
              </Link>{" "}
              লেসনের এক ঝলক। এখন শুধু Run চাপুন। উপরের Box আগে চালাতে হবে, কারণ এটা gen_limits এ Column যোগ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের Function: STORED এ চলে, VIRTUAL এ না"
              query={`CREATE OR REPLACE FUNCTION gen_vat(amount numeric) RETURNS numeric
LANGUAGE sql IMMUTABLE
AS 'SELECT round(amount * 0.15, 2)';
ALTER TABLE gen_limits
  ADD COLUMN vat_stored numeric GENERATED ALWAYS AS (gen_vat(seats * unit_price_bdt)) STORED;
ALTER TABLE gen_limits
  ADD COLUMN vat_virtual numeric GENERATED ALWAYS AS (gen_vat(seats * unit_price_bdt)) VIRTUAL;`}
              caption="Function তৈরি হলো, STORED Column যোগ হলো। VIRTUAL এ ERROR: generation expression uses user-defined function, DETAIL: Virtual generated columns that make use of user-defined functions are not yet supported। not yet শব্দটা খেয়াল করুন, ভবিষ্যতের Version এ এই সীমা উঠে যেতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বাকি সীমাগুলোও PostgreSQL 18 এ চালিয়ে দেখা। VIRTUAL Column এ UNIQUE দিলে{" "}
              <code className={CODE}>unique constraints on virtual generated columns are not supported</code>, Foreign Key দিলে{" "}
              <code className={CODE}>foreign key constraints on virtual generated columns are not supported</code>, CREATE
              STATISTICS দিলেও একই রকম বার্তা। তবে NOT NULL আর CHECK চলে। Logical Replication (এক Server থেকে আরেক Server এ
              বদল পাঠানো, Module 19) এ PostgreSQL 18 থেকে Generated Column এর মান পাঠানো যায়, কিন্তু শুধু STORED এর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "STORED", "VIRTUAL"],
          rows: [
            ["হিসাব কখন", "INSERT আর UPDATE এর সময়", "SELECT এ Column পড়ার সময়"],
            ["Disk এ জায়গা", "লাগে, উত্তর রাখা থাকে", "লাগে না"],
            ["পড়ার খরচ", "শুধু তুলে আনা", "প্রতিটা Row এ হিসাব"],
            ["লেখার খরচ", "প্রতিটা লেখায় হিসাব", "নেই"],
            ["ভুল Data (যেমন শূন্য দিয়ে ভাগ)", "লেখার সময়ই Error", "Row ঢুকে যায়, Error আসে পড়ার সময়"],
            ["Index, UNIQUE, Foreign Key", "চলে", "চলে না (0A000), সূত্রে Expression Index চলে"],
            ["নিজের বানানো Function", "চলে, যদি IMMUTABLE", "চলে না"],
            ["Column যোগ করা (ALTER TABLE ADD)", "পুরো Table নতুন করে লেখা হয়", "শুধু Catalog বদলায়, তাৎক্ষণিক"],
            ["PostgreSQL Version", "12 থেকে", "18 থেকে, আর এখন Default"],
            ["কখন বাছবেন", "প্রায়ই পড়া হয়, খোঁজা বা সাজানো হয়, হিসাব ভারী", "কম পড়া হয়, হিসাব হালকা, Disk বাঁচাতে চান"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা সহজ নিয়ম",
          content: (
            <ContentParagraph>
              যে Column দিয়ে খুঁজবেন, সাজাবেন বা যাকে UNIQUE রাখতে হবে, তাকে STORED করুন। যে Column শুধু দেখানোর জন্য, আর সূত্র
              হালকা (একটা গুণ, দুটো text জোড়া), তাকে VIRTUAL রাখুন। দ্বিধায় থাকলে STORED দিয়ে শুরু করুন, কারণ তার কোনো সীমা
              নেই, আর পরে Disk এর চাপ বুঝলে বদলাতে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "changing-generated-columns",
      subHeader: { index: "007", title: "Changing a Generated Column" },
      title: <SectionTitle>যোগ করা, সূত্র বদলানো, সূত্র সরানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবে Generated Column প্রায়ই আসে চালু Table এ, পরে। ফারুক সাহেব একদিন জানালেন, সব দামের সাথে 5% Service
                Charge যোগ হবে, তাই সূত্রটা বদলাতে হবে। এই বদলগুলোর খরচ STORED আর VIRTUAL এ খুব আলাদা। Module 09 এর{" "}
                <Link href="/sql/topic/alter-table" className={LINK}>
                  ALTER TABLE
                </Link>{" "}
                লেসনে দেখেছেন, কিছু ALTER শুধু Catalog বদলায় (Table এর বিবরণের খাতা), আর কিছু পুরো Table কে নতুন একটা File এ
                আবার লেখে (Rewrite)। কোনটা কী করছে, ধরার উপায় <code className={CODE}>pg_relation_filenode</code>: Table এর
                File এর নম্বর। নম্বর বদলালে Table নতুন করে লেখা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন বদলে Table নতুন করে লেখা হয়"
              query={`DROP TABLE IF EXISTS gen_alter;
DROP TABLE IF EXISTS gen_files;
CREATE TABLE gen_alter (seats smallint NOT NULL, unit_price_bdt numeric(10, 2) NOT NULL);
INSERT INTO gen_alter SELECT g % 5 + 1, 12500 FROM generate_series(1, 1000) AS g;
CREATE TEMP TABLE gen_files (n integer GENERATED ALWAYS AS IDENTITY, step text, filenode oid);
INSERT INTO gen_files (step, filenode) VALUES ('start', pg_relation_filenode('gen_alter'));
ALTER TABLE gen_alter ADD COLUMN total_v numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) VIRTUAL;
INSERT INTO gen_files (step, filenode) VALUES ('ADD virtual', pg_relation_filenode('gen_alter'));
ALTER TABLE gen_alter ADD COLUMN total_s numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED;
INSERT INTO gen_files (step, filenode) VALUES ('ADD stored', pg_relation_filenode('gen_alter'));
ALTER TABLE gen_alter ALTER COLUMN total_v SET EXPRESSION AS (seats * unit_price_bdt * 1.05);
INSERT INTO gen_files (step, filenode) VALUES ('SET EXPRESSION virtual', pg_relation_filenode('gen_alter'));
ALTER TABLE gen_alter ALTER COLUMN total_s SET EXPRESSION AS (seats * unit_price_bdt * 1.05);
INSERT INTO gen_files (step, filenode) VALUES ('SET EXPRESSION stored', pg_relation_filenode('gen_alter'));
SELECT step, filenode <> lag(filenode) OVER (ORDER BY n) AS rewrote_table
FROM gen_files
ORDER BY n;`}
              caption="৫টা Row। start এর পাশে ফাঁকা, কারণ আগের কোনো ধাপ নেই। ADD virtual: f, File একই। ADD stored: t, ১০০০ Row এর পুরো Table নতুন করে লেখা হয়েছে, কারণ প্রতিটা Row এ নতুন উত্তর বসাতে হয়েছে। SET EXPRESSION virtual: f। SET EXPRESSION stored: t। প্রতিটা ধাপের পরে File এর নম্বর একটা TEMP Table এ টুকে রাখা হয়েছে, আর lag() দিয়ে আগের ধাপের সাথে মেলানো, Module 08 এর মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ছোট Table এ Rewrite চোখে পড়ে না। কিন্তু লাখ Row এর ব্যস্ত Table এ STORED Column যোগ করা মানে লম্বা সময়
                ধরে Table টা আটকে থাকা, Module 09 এর Lock এর গল্প। VIRTUAL এখানে প্রায় বিনা খরচে যোগ হয়। SET EXPRESSION এসেছে
                PostgreSQL 17 এ, তার আগে সূত্র বদলাতে Column মুছে আবার বানাতে হতো।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকের কাজ <code className={CODE}>DROP EXPRESSION</code> (PostgreSQL 13 থেকে): সূত্রটা সরিয়ে দেয়, Column
                থাকে, শেষ হিসাব করা মানগুলো সাধারণ মান হয়ে থেকে যায়, আর তখন থেকে সেটা হাতে লেখা যায়। VIRTUAL এ এটা চলে না, কারণ
                তার কোনো রেখে দেওয়া মানই নেই। আরেকটা চুপচাপ ফাঁদ: <code className={CODE}>CREATE TABLE ... AS SELECT</code> দিয়ে
                Copy বানালে মানগুলো আসে, সূত্র আসে না। উপরের Box চালানোর পরে এটা চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DROP EXPRESSION, আর Copy তে সূত্র হারায়"
              query={`ALTER TABLE gen_alter ALTER COLUMN total_s DROP EXPRESSION;
UPDATE gen_alter SET total_s = 0 WHERE seats = 1;
SELECT attname, attgenerated
FROM pg_attribute
WHERE attrelid = 'gen_alter'::regclass AND attnum > 0
ORDER BY attnum;
DROP TABLE IF EXISTS gen_alter_copy;
CREATE TABLE gen_alter_copy AS SELECT * FROM gen_alter;
SELECT column_name, is_generated
FROM information_schema.columns
WHERE table_name = 'gen_alter_copy'
ORDER BY ordinal_position;
ALTER TABLE gen_alter ALTER COLUMN total_v DROP EXPRESSION;`}
              caption={`DROP EXPRESSION এর পরে total_s এ নিজের 0 লেখা গেছে, UPDATE 200। প্রথম তালিকায় total_s এর attgenerated এখন ফাঁকা, total_v এখনো v। Copy টার চারটা Column ই NEVER, মানে সাধারণ Column। শেষ লাইনে ERROR: ALTER TABLE / DROP EXPRESSION is not supported for virtual generated columns। সূত্র সহ Copy চাইলে লিখুন CREATE TABLE নতুন (LIKE পুরনো INCLUDING GENERATED)।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Data আনা নেওয়ার যন্ত্রগুলোও Generated Column কে আলাদা চোখে দেখে।{" "}
              <Link href="/sql/topic/bulk-loading" className={LINK}>
                Bulk Loading
              </Link>{" "}
              লেসনের COPY আর Module 18 এর pg_dump, দুজনেই Generated Column বাদ দিয়ে শুধু মূল Column নেয়, কারণ বাকিটা ফিরিয়ে
              আনার সময় আবার হিসাব হবে। নিচে PostgreSQL 18.6 এর psql এ চালানো আসল ফলাফল, কারণ Query Box এ COPY এর Output
              দেখা যায় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "copy-and-generated-columns.sql",
          code: `CREATE TABLE gen_fares (
  fare_id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  per_day_bdt    numeric GENERATED ALWAYS AS (round(unit_price_bdt / 3, 2))
);
-- (দুটো Row লেখার পরে)

-- ১. Column এর তালিকা ছাড়া COPY TO: Generated Column দুটো নেই
COPY gen_fares TO STDOUT WITH (FORMAT csv, HEADER);
-- fare_id,seats,unit_price_bdt
-- 1,2,4500.00
-- 2,3,12000.50

-- ২. সব চাইলে একটা SELECT কে COPY করুন
COPY (SELECT * FROM gen_fares ORDER BY fare_id) TO STDOUT WITH (FORMAT csv, HEADER);
-- fare_id,seats,unit_price_bdt,total_bdt,per_day_bdt
-- 1,2,4500.00,9000.00,1500.00
-- 2,3,12000.50,36001.50,4000.17

-- ৩. আনার সময় Generated Column এর নাম দিলে
COPY gen_fares (seats, unit_price_bdt, total_bdt) FROM STDIN WITH (FORMAT csv);
-- ERROR:  column "total_bdt" is a generated column
-- DETAIL:  Generated columns cannot be used in COPY.

-- ৪. pg_dump এর ফাইলে Data অংশ, total_bdt আর per_day_bdt বাদ
-- COPY public.gen_fares (fare_id, seats, unit_price_bdt) FROM stdin;`,
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "identity-recap",
      subHeader: { index: "008", title: "Identity Recap" },
      title: <SectionTitle>id এর নম্বর কোথা থেকে আসে: Identity আর তার Sequence</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের দ্বিতীয় অর্ধেক, আর ফারুক সাহেবের দ্বিতীয় অভিযোগ। Module 09 এর{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Primary Keys
                </Link>{" "}
                লেসনে আপনি শিখেছেন, Island Tours এর প্রতিটা Table এর প্রথম Column এ লেখা{" "}
                <code className={CODE}>GENERATED ALWAYS AS IDENTITY</code>। এক লাইনে মনে করিয়ে দিই: Identity Column নিজের
                জন্য একটা Sequence বানায়, প্রতিটা INSERT এ সেই Sequence এর nextval() ডেকে নম্বর নেয়, আর ALWAYS হলে নিজের হাতে
                id দেওয়া নিষেধ (428C9), যদি না <code className={CODE}>OVERRIDING SYSTEM VALUE</code> লেখেন।
              </ContentParagraph>
              <ContentParagraph>
                সেই Sequence গুলো লুকানো না। প্রতিটার নাম Table_Column_seq ধাঁচে, আর{" "}
                <code className={CODE}>pg_sequences</code> নামের View তে সবার খবর একসাথে। কোন Column এর পেছনে কোন Sequence,
                সেটা বলে <code className={CODE}>pg_get_serial_sequence</code>। নামে serial থাকলেও Identity তেও চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর Sequence গুলো"
              query={`SELECT sequencename, data_type, last_value, increment_by, max_value
FROM pg_sequences
WHERE schemaname = 'public' AND sequencename NOT LIKE 'gen%'
ORDER BY sequencename;
SELECT pg_get_serial_sequence('bookings', 'booking_id') AS booking_sequence;`}
              caption="৮টা Row, প্রতিটা Table এর একটা করে। সবার data_type integer, কারণ Column গুলো integer, আর max_value 2147483647। last_value মিলে যায় Row সংখ্যার সাথে: bookings 24, payments 19, tours 9, customers 15। শেষ Query বলে booking_id এর পেছনে public.bookings_booking_id_seq। এই Page এ আগে কোনো Box এ bookings এ ব্যর্থ INSERT চালালে last_value বড় হতো, Module 09 এর ফাঁকের কারণে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Identity লেখার সময় বন্ধনীতে Sequence এর Option দেওয়া যায়, যেমন শুরু 1001 থেকে, দশ করে লাফ। পরে বদলাতে চাইলে
                ALTER TABLE এর তিনটা রূপ: <code className={CODE}>SET INCREMENT BY</code>,{" "}
                <code className={CODE}>RESTART WITH n</code>, আর শুধু <code className={CODE}>RESTART</code>। শেষেরটা নিয়ে
                সাবধান: WITH ছাড়া RESTART মানে শুরুর নম্বরে ফিরে যাওয়া, আর সেই নম্বর তো আগেই ব্যবহার হয়ে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Identity এর নিজের Option"
              query={`DROP TABLE IF EXISTS gen_vouchers;
CREATE TABLE gen_vouchers (
  voucher_id integer GENERATED ALWAYS AS IDENTITY (START WITH 1001 INCREMENT BY 10) PRIMARY KEY,
  holder     text NOT NULL
);
INSERT INTO gen_vouchers (holder) VALUES ('Rahim Uddin'), ('Nusrat Jahan') RETURNING voucher_id;
ALTER TABLE gen_vouchers ALTER COLUMN voucher_id SET INCREMENT BY 1;
INSERT INTO gen_vouchers (holder) VALUES ('Tanvir Ahmed') RETURNING voucher_id;
ALTER TABLE gen_vouchers ALTER COLUMN voucher_id RESTART;
INSERT INTO gen_vouchers (holder) VALUES ('Farhana Akter') RETURNING voucher_id;`}
              caption="প্রথম INSERT ফেরত দিল 1001 আর 1011, দশ করে লাফ। SET INCREMENT BY 1 এর পরে Tanvir পেলেন 1012। তারপর WITH ছাড়া RESTART, Sequence ফিরে গেল শুরুর 1001 এ, আর Farhana এর INSERT এ ERROR: duplicate key value violates unique constraint gen_vouchers_pkey, Key (voucher_id)=(1001) already exists। RETURNING দিয়ে নতুন id ফেরত পাওয়ার পুরো গল্প INSERT লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Identity এর আরেকটা বাস্তব সমস্যা: নম্বর ফুরিয়ে যাওয়া। integer এর শেষ সীমা 2147483647, প্রায় দুইশো চোদ্দ কোটি।
                Booking এর জন্য সেটা অনেক, কিন্তু Website এর প্রতিটা Click লেখার Table এ কয়েক বছরেই শেষ হতে পারে। শেষ হলে
                INSERT বন্ধ, আর পুরো App থেমে যায়। সমাধান Column টাকে bigint এ বদলানো, আর ভালো খবর হলো Identity এর Sequence ও
                তখন নিজে থেকে bigint হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="integer এর শেষ, আর bigint এ বদল"
              query={`DROP TABLE IF EXISTS gen_clicks;
CREATE TABLE gen_clicks (
  click_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page     text NOT NULL
);
-- ধরে নিন দুই বছরে দুইশো কোটির বেশি Click জমেছে
SELECT setval(pg_get_serial_sequence('gen_clicks', 'click_id'), 2147483646);
INSERT INTO gen_clicks (page) VALUES ('/tours/1') RETURNING click_id;
ALTER TABLE gen_clicks ALTER COLUMN click_id TYPE bigint;
SELECT data_type, max_value
FROM pg_sequences
WHERE sequencename = 'gen_clicks_click_id_seq';
INSERT INTO gen_clicks (page) VALUES ('/tours/2') RETURNING click_id;`}
              caption="setval দিয়ে Sequence কে প্রায় শেষ সীমায় পাঠানো হয়েছে, তাই প্রথম Click পেল 2147483647, integer এর একদম শেষ নম্বর। এখানে ALTER না করলে পরের INSERT এ আসত nextval: reached maximum value of sequence। ALTER এর পরে Sequence এর data_type bigint, max_value 9223372036854775807, আর পরের Click পেল 2147483648। বড় Table এ এই ALTER পুরো Table নতুন করে লেখে, তাই সময় থাকতেই করুন, অথবা শুরু থেকেই bigint নিন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "sequence-options",
      subHeader: { index: "009", title: "Sequence Options" },
      title: <SectionTitle>CREATE SEQUENCE: শুরু, লাফ, সীমা আর আবার শুরু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Identity এর পেছনের Sequence নিজে থেকে তৈরি হয়। কিন্তু Sequence আলাদা করেও বানানো যায়, এমন নম্বরের জন্য যেটা
                কোনো একটা Table এর id না: Voucher এর নম্বর, Bus এর Seat Token, Invoice এর ক্রমিক নম্বর। তখন লিখতে হয়{" "}
                <code className={CODE}>CREATE SEQUENCE নাম</code>, আর পছন্দমতো Option। Token Machine এর উদাহরণে প্রতিটা Option
                হলো মেশিনের একটা নব:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>AS smallint | integer | bigint</code>: নম্বর কত বড় হতে পারবে। কিছু না বললে bigint।
                </ListItem>
                <ListItem>
                  <code className={CODE}>START WITH</code>: প্রথম nextval কী দেবে। Default হলো MINVALUE।
                </ListItem>
                <ListItem>
                  <code className={CODE}>INCREMENT BY</code>: প্রতিবার কত লাফ। ঋণাত্মক দিলে নম্বর কমতে থাকে। Default 1।
                </ListItem>
                <ListItem>
                  <code className={CODE}>MINVALUE</code> আর <code className={CODE}>MAXVALUE</code>: সবচেয়ে ছোট আর বড় মান।
                  Documentation অনুযায়ী বাড়তে থাকা Sequence এর MINVALUE Default 1, MAXVALUE Type এর সর্বোচ্চ। কমতে থাকা
                  Sequence এ উল্টো: MAXVALUE Default -1, MINVALUE Type এর সর্বনিম্ন।
                </ListItem>
                <ListItem>
                  <code className={CODE}>CYCLE</code> বা <code className={CODE}>NO CYCLE</code>: সীমায় পৌঁছালে আবার শুরু হবে,
                  নাকি Error দেবে। Default NO CYCLE।
                </ListItem>
                <ListItem>
                  <code className={CODE}>CACHE</code>: একবারে কয়টা নম্বর আগে থেকে তুলে রাখবে। Default 1, পরের Section এর বিষয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রথমে সীমা। Bus এ Seat Token দেওয়া হবে 100, 105, 110, 115, মানে চারটা Seat। পঞ্চম যাত্রী এলে কী হয়?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MAXVALUE এ পৌঁছালে"
              query={`DROP SEQUENCE IF EXISTS gen_seat_seq;
CREATE SEQUENCE gen_seat_seq START WITH 100 INCREMENT BY 5 MAXVALUE 115;
SELECT nextval('gen_seat_seq') AS seat_token FROM generate_series(1, 4);
SELECT nextval('gen_seat_seq') AS fifth_token;`}
              caption={`প্রথম Query তে ৪টা Row: 100, 105, 110, 115। দ্বিতীয়টায় ERROR: nextval: reached maximum value of sequence "gen_seat_seq" (115), SQLSTATE 2200H। generate_series(1, 4) এখানে শুধু চারটা Row বানিয়েছে, যাতে এক Query তে চারবার nextval চাপা যায়।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা ট্রিপে Token আবার 100 থেকে শুরু হলে সুবিধা, তাই তানিম CYCLE যোগ করলেন। এখানেই এই লেসনের সবচেয়ে
                সূক্ষ্ম ফাঁদ। Documentation বলে, সীমায় পৌঁছালে পরের নম্বর হবে MINVALUE, START WITH না। আর MINVALUE না লিখলে
                সেটা 1। নিচের Box এ দুটো Sequence পাশাপাশি, একটায় MINVALUE লেখা নেই, আরেকটায় আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CYCLE এর ফাঁদ"
              query={`DROP SEQUENCE IF EXISTS gen_cycle_a, gen_cycle_b;
CREATE SEQUENCE gen_cycle_a START WITH 100 INCREMENT BY 5 MAXVALUE 115 CYCLE;
CREATE SEQUENCE gen_cycle_b START WITH 100 INCREMENT BY 5 MINVALUE 100 MAXVALUE 115 CYCLE;
SELECT g AS call_no,
       nextval('gen_cycle_a') AS without_minvalue,
       nextval('gen_cycle_b') AS with_minvalue
FROM generate_series(1, 6) AS g;`}
              caption="৬টা Row। প্রথম চারবার দুটোই 100, 105, 110, 115। পঞ্চমবার without_minvalue দিল 1, তারপর 6, অথচ with_minvalue দিল 100, তারপর 105। CYCLE ফেরে MINVALUE এ। যাত্রীর হাতে Seat Token 1 গেলে তিনি Bus এ গিয়ে এমন Seat খুঁজবেন, যেটা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SequenceLineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঋণাত্মক লাফে Sequence নিচের দিকে চলে, যেমন খালি Seat গোনা। এখানেও Default গুলো মনে রাখতে হয়। কমতে থাকা
                Sequence এর MAXVALUE Default -1, তাই শুধু <code className={CODE}>START WITH 10 INCREMENT BY -1 MINVALUE 1</code>{" "}
                লিখলে PostgreSQL 18 বলে <code className={CODE}>MINVALUE (1) must be less than MAXVALUE (-1)</code>। MAXVALUE
                10 বলে দিতে হয়। আর ছোট Type বেছে নিলে সীমাও ছোট হয়, pg_sequences সব দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উল্টো দিকে, আর ছোট Type"
              query={`DROP SEQUENCE IF EXISTS gen_countdown, gen_small;
CREATE SEQUENCE gen_countdown START WITH 10 INCREMENT BY -1 MINVALUE 1 MAXVALUE 10;
SELECT nextval('gen_countdown') AS seats_left FROM generate_series(1, 3);
CREATE SEQUENCE gen_small AS smallint;
SELECT sequencename, data_type, start_value, min_value, max_value, increment_by, cycle, cache_size
FROM pg_sequences
WHERE sequencename IN ('gen_countdown', 'gen_small')
ORDER BY sequencename;`}
              caption="প্রথম Query: 10, 9, 8। দ্বিতীয়টায় ২টা Row: gen_countdown এর data_type bigint (কিছু না বলায়), start 10, min 1, max 10, increment -1। gen_small এর data_type smallint, max_value 32767, মানে বত্রিশ হাজারের পরেই শেষ। দুজনেরই cycle f আর cache_size 1, দুটোই Default।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SequenceDialLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  Boat এ চারটা Seat, Token 100, 105, 110, 115। প্রতিটা ট্রিপে Token আবার 100 থেকে শুরু হবে, কখনো 1 বা অন্য কোনো
                  নম্বর না। <code className={CODE}>gen_ex4_seat_seq</code> নামে এমন একটা Sequence বানান। শেষের Query বদলাবেন না,
                  সেটা ছয়জন যাত্রীকে পরপর Token দেয়।
                </>
              }
              hint={
                <>
                  START WITH, INCREMENT BY আর MAXVALUE ছাড়াও দুটো জিনিস লাগবে: CYCLE, আর এমন একটা MINVALUE যাতে আবার শুরু হলে
                  1 এ না গিয়ে 100 এ ফেরে।
                </>
              }
              orderMatters
              starter={`DROP SEQUENCE IF EXISTS gen_ex4_seat_seq;
-- এখানে CREATE SEQUENCE gen_ex4_seat_seq লিখুন

-- নিচের Query বদলাবেন না
SELECT g AS passenger_no, nextval('gen_ex4_seat_seq') AS seat_token
FROM generate_series(1, 6) AS g
ORDER BY g;`}
              solution={`SELECT * FROM (VALUES (1, 100), (2, 105), (3, 110), (4, 115), (5, 100), (6, 105))
  AS v(passenger_no, seat_token);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "cache-and-gaps",
      subHeader: { index: "010", title: "CACHE and Gaps" },
      title: <SectionTitle>CACHE: নম্বরে বড় ফাঁক, আর নম্বর দিয়ে ক্রম বোঝা যায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 09 এর{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Primary Keys
                </Link>{" "}
                লেসনে দেখেছেন id তে ফাঁক কেন পড়ে: দেওয়া নম্বর কখনো ফেরত আসে না, তাই ROLLBACK, আটকে যাওয়া INSERT, আর{" "}
                <Link href="/sql/topic/upsert" className={LINK}>
                  ON CONFLICT DO NOTHING
                </Link>{" "}
                এর প্রতিটা নম্বর খায় কিন্তু Row রাখে না। এই Section এ ফাঁকের আরেকটা কারণ, যেটা সবচেয়ে বড় বড় ফাঁক তৈরি করে:
                CACHE।
              </ContentParagraph>
              <ContentParagraph>
                CACHE 20 মানে প্রতিটা Session (Database এর সাথে একটা সংযোগ, যেমন psql এর একটা জানালা বা App এর একটা
                Connection) প্রথমবার nextval চাইলে Sequence থেকে একবারে কুড়িটা নম্বর তুলে নিজের কাছে রাখে, তারপর সেখান থেকে
                দেয়। প্রতিবার Sequence এর কাছে যেতে হয় না, তাই দ্রুত। Documentation দুটো দাম বলে দেয়: Session শেষ হলে না
                দেওয়া নম্বরগুলো হারায়, আর কয়েকটা Session মিলিয়ে দেখলে নম্বরগুলো ক্রমে নাও আসতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এই Page এর Query Box এ একটাই Session, তাই এখানে শুধু প্রথম ছাপটা দেখা যায়: Disk এর হিসাব কত দূর এগিয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CACHE এর ছাপ, এক Session এ"
              query={`DROP SEQUENCE IF EXISTS gen_cached;
CREATE SEQUENCE gen_cached CACHE 20;
SELECT nextval('gen_cached') AS first_call, nextval('gen_cached') AS second_call;
SELECT last_value, cache_size
FROM pg_sequences
WHERE sequencename = 'gen_cached';`}
              caption="nextval দিল 1 আর 2। কিন্তু pg_sequences এর last_value বলছে 20। Documentation এর ব্যাখ্যা: last_value হলো Disk এ লেখা শেষ মান, আর CACHE থাকলে সেটা বিলি হওয়া শেষ নম্বরের চেয়ে বড় হতে পারে। এই Session 1 থেকে 20 তুলে রেখেছে, দিয়েছে মাত্র দুটো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আসল ঘটনা দেখতে দুটো জানালা লাগে। নিচের Transcript PostgreSQL 18.6 Server এর। জানালা A হলো psql এর মূল
              Session, আর psql এর <code className={CODE}>\!</code> Command দিয়ে মাঝে মাঝে একটা করে আলাদা psql চালানো হয়েছে,
              যেগুলো জানালা B, C আর D।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "cache-two-windows.sql",
          code: `CREATE SEQUENCE gen_token_seq CACHE 20;

SELECT nextval('gen_token_seq') AS window_a;   -- 1
SELECT nextval('gen_token_seq') AS window_a;   -- 2
\\! psql -U postgres -d island_tours -c "SELECT nextval('gen_token_seq') AS window_b"
--  window_b
-- ----------
--        21
SELECT nextval('gen_token_seq') AS window_a;   -- 3
\\! psql -U postgres -d island_tours -c "SELECT nextval('gen_token_seq') AS window_c"
--  window_c
-- ----------
--        41
SELECT last_value, cache_size FROM pg_sequences WHERE sequencename = 'gen_token_seq';
--  last_value | cache_size
-- ------------+------------
--          60 |         20

-- জানালা A বন্ধ করার পরে, একদম নতুন একটা Session:
-- psql -U postgres -d island_tours -c "SELECT nextval('gen_token_seq') AS window_d"
--  window_d
-- ----------
--        61`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CacheBlocksDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>Transcript থেকে তিনটা শিক্ষা:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বিশাল ফাঁক:</strong> পাঁচটা নম্বর বিলি হয়েছে (1, 2, 3, 21, 41), অথচ পরের নতুন Session পেল 61।
                  একটা ব্যস্ত App এ শত শত Connection, তাই CACHE বড় হলে id তে হাজার হাজার নম্বরের ফাঁক খুবই স্বাভাবিক।
                </ListItem>
                <ListItem>
                  <strong>নম্বর দিয়ে সময় বোঝা যায় না:</strong> জানালা A এর 3 এসেছে জানালা B এর 21 এর পরে। তাই id ছোট মানে আগে
                  তৈরি, এই ধারণা CACHE থাকলে ভুল। কোনটা আগে, জানতে চাইলে একটা timestamptz Column রাখুন, যেমন bookings এর
                  booked_at।
                </ListItem>
                <ListItem>
                  <strong>তবু কখনো একই নম্বর দুইবার না:</strong> Documentation এর নিশ্চয়তা, আলাদা Session সবসময় আলাদা নম্বর
                  পায়। Sequence এর আসল কাজ এটাই, আর CACHE সেটা ভাঙে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ফাঁকহীন নম্বর Sequence এর কাজ না",
          content: (
            <ContentParagraph>
              হিসাবের খাতার Invoice নম্বরের মতো কিছু কাজে আইনত ফাঁকহীন নম্বর লাগে। Sequence সেটা কখনো দেবে না, CACHE 1 হলেও
              না, কারণ ROLLBACK আর ব্যর্থ INSERT এ নম্বর হারায়। সেই কাজের জন্য একটা আলাদা Counter Table রাখা হয়, যেটা
              Transaction এর ভেতরে Lock নিয়ে বাড়ানো হয়, Module 12 এর{" "}
              <Link href="/sql/topic/row-locks" className={LINK}>
                Row Locks
              </Link>{" "}
              লেসনে সেই যন্ত্র। Island Tours এর id গুলোর জন্য ফাঁক কোনো সমস্যাই না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "moving-and-sharing",
      subHeader: { index: "011", title: "Moving and Sharing a Sequence" },
      title: <SectionTitle>setval এর তিন রূপ, এক Sequence দুই Table এ, আর কে কার মালিক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Sequence এর ভেতরে দুটো জিনিস থাকে: <code className={CODE}>last_value</code>, শেষ নম্বর, আর{" "}
                <code className={CODE}>is_called</code>, সেই নম্বর ইতিমধ্যে কাউকে দেওয়া হয়েছে কিনা। পরের nextval এর নিয়ম:
                is_called false হলে last_value নিজেই দেয়, true হলে last_value এর পরেরটা। নতুন Sequence এ is_called false,
                তাই প্রথম nextval দেয় START এর নম্বরটাই।
              </ContentParagraph>
              <ContentParagraph>
                setval দুই রকম করে ডাকা যায়। দুই Argument এ <code className={CODE}>setval(seq, 50)</code> মানে 50 দেওয়া হয়ে
                গেছে, পরের nextval 51। তিন Argument এ <code className={CODE}>setval(seq, 50, false)</code> মানে 50 এখনো দেওয়া
                হয়নি, পরের nextval ঠিক 50। আর <code className={CODE}>lastval()</code> বলে এই Session এ যেকোনো Sequence থেকে
                শেষ যে নম্বর পাওয়া গেছে, currval এর মতো, কিন্তু Sequence এর নাম ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="setval এর তৃতীয় Argument"
              query={`DROP SEQUENCE IF EXISTS gen_room_seq;
CREATE SEQUENCE gen_room_seq START WITH 10;
SELECT last_value, is_called FROM gen_room_seq;
SELECT nextval('gen_room_seq') AS first_call;
SELECT setval('gen_room_seq', 50, false);
SELECT nextval('gen_room_seq') AS after_false;
SELECT setval('gen_room_seq', 50);
SELECT nextval('gen_room_seq') AS after_true;
SELECT lastval();`}
              caption="শুরুতে last_value 10, is_called f, তাই প্রথম nextval দিল 10। setval(..., 50, false) এর পরে nextval দিল 50। setval(..., 50) এর পরে দিল 51। lastval() বলছে 51, এই Session এর শেষ nextval।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Module 09 এ দেখেছেন nextval ROLLBACK মানে না। setval ও মানে না। Transaction এর ভেতরে setval করে ROLLBACK
              করলেও Sequence সরেই থাকে। মানে ভুল setval এর কোনো Undo নেই, আরেকটা setval ছাড়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="setval ও ROLLBACK মানে না"
              query={`DROP SEQUENCE IF EXISTS gen_undo_seq;
CREATE SEQUENCE gen_undo_seq;
SELECT nextval('gen_undo_seq') AS before_begin;
BEGIN;
SELECT setval('gen_undo_seq', 500);
ROLLBACK;
SELECT nextval('gen_undo_seq') AS after_rollback;`}
              caption="BEGIN এর আগে 1। Transaction এর ভেতরে setval 500, তারপর ROLLBACK। তবু পরের nextval দিল 501। Transaction এর বাকি সব ফেরত যায়, Sequence এর কাঁটা যায় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা কাজ যেটা Identity পারে না: একটা Sequence দুই Table এ। Island Tours এ Bus আর Boat এর টিকিট আলাদা
                Table এ, কিন্তু Counter এর মানুষ চান টিকিট নম্বর দেখেই চিনতে, দুই Table মিলিয়ে কোনো নম্বর যেন দুইবার না আসে।
                সমাধান: একটা Sequence বানিয়ে দুই Table এর Column এর DEFAULT এ তার nextval। Identity প্রতিটা Table এর জন্য আলাদা
                Sequence বানায়, তাই এই কাজে চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Table, এক Sequence"
              query={`DROP TABLE IF EXISTS gen_bus_seats, gen_boat_seats;
DROP SEQUENCE IF EXISTS gen_seat_no_seq;
CREATE SEQUENCE gen_seat_no_seq;
CREATE TABLE gen_bus_seats (seat_no bigint PRIMARY KEY DEFAULT nextval('gen_seat_no_seq'), passenger text NOT NULL);
CREATE TABLE gen_boat_seats (seat_no bigint PRIMARY KEY DEFAULT nextval('gen_seat_no_seq'), passenger text NOT NULL);
INSERT INTO gen_bus_seats (passenger) VALUES ('Mitu Rahman');
INSERT INTO gen_boat_seats (passenger) VALUES ('Arif Chowdhury');
INSERT INTO gen_bus_seats (passenger) VALUES ('Shuvo Das');
SELECT 'bus' AS vehicle, seat_no, passenger FROM gen_bus_seats
UNION ALL
SELECT 'boat', seat_no, passenger FROM gen_boat_seats
ORDER BY seat_no;
DROP SEQUENCE gen_seat_no_seq;`}
              caption={`৩টা Row: bus 1 Mitu Rahman, boat 2 Arif Chowdhury, bus 3 Shuvo Das। দুই Table মিলিয়ে নম্বর পরপর, কোনোটা দুইবার নেই। শেষ লাইনে Sequence মুছতে গেলে ERROR: cannot drop sequence gen_seat_no_seq because other objects depend on it, DETAIL এ দুই Table এর দুটো DEFAULT এর নাম, আর HINT: Use DROP ... CASCADE। Table গুলোর DEFAULT এই Sequence এর উপর নির্ভর করে, তাই PostgreSQL মুছতে দেয় না।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নির্ভরতার উল্টো দিকও আছে: মালিকানা। <code className={CODE}>ALTER SEQUENCE ... OWNED BY table.column</code> লিখলে
                Sequence সেই Column এর হয়ে যায়, Column বা Table মুছলে Sequence ও মুছে যায়। serial ঠিক এটাই করত। Identity এর
                Sequence এর মালিকানা আরও শক্ত, সেটা আলাদা করে মোছাই যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কে কার মালিক"
              query={`DROP TABLE IF EXISTS gen_owned;
DROP SEQUENCE IF EXISTS gen_owned_seq;
CREATE SEQUENCE gen_owned_seq;
CREATE TABLE gen_owned (id bigint DEFAULT nextval('gen_owned_seq'));
ALTER SEQUENCE gen_owned_seq OWNED BY gen_owned.id;
DROP TABLE gen_owned;
SELECT count(*) AS sequences_left FROM pg_class WHERE relname = 'gen_owned_seq';
DROP SEQUENCE tours_tour_id_seq;`}
              caption="Table মোছার পরে sequences_left 0, মালিকের সাথে Sequence ও গেছে। শেষ লাইনে Island Tours এর tours এর Sequence মোছার চেষ্টা: ERROR: cannot drop sequence tours_tour_id_seq because column tour_id of table tours requires it, HINT: You can drop column tour_id of table tours instead। কিছুই মোছেনি, sample Table নিরাপদ।"
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
                  Bus আর Boat এর টিকিটের জন্য দুটো Table বানান, <code className={CODE}>gen_ex5_bus_tickets</code> আর{" "}
                  <code className={CODE}>gen_ex5_boat_tickets</code>, প্রতিটায় ticket_no (bigint, Primary Key) আর passenger
                  (text, NOT NULL)। দুই Table মিলিয়ে টিকিট নম্বর একটাই ধারায় চলবে, শুরু 5001 থেকে, তাই আগে{" "}
                  <code className={CODE}>gen_ex5_ticket_seq</code> নামে একটা Sequence বানান। Starter এর INSERT আর শেষের Query
                  বদলাবেন না।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CREATE SEQUENCE gen_ex5_ticket_seq START WITH 5001;</code> তারপর দুই Table এর
                  ticket_no তে <code className={CODE}>DEFAULT nextval(&apos;gen_ex5_ticket_seq&apos;)</code>। দুই Table এ
                  আলাদা Identity দিলে দুটোই 5001 থেকে গুনবে, মিলবে না।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ex5_bus_tickets, gen_ex5_boat_tickets;
DROP SEQUENCE IF EXISTS gen_ex5_ticket_seq;
-- এখানে একটা CREATE SEQUENCE আর দুটো CREATE TABLE

-- নিচের সব বদলাবেন না
INSERT INTO gen_ex5_bus_tickets (passenger) VALUES ('Rahim Uddin');
INSERT INTO gen_ex5_boat_tickets (passenger) VALUES ('Nusrat Jahan');
INSERT INTO gen_ex5_boat_tickets (passenger) VALUES ('Tanvir Ahmed');
INSERT INTO gen_ex5_bus_tickets (passenger) VALUES ('Farhana Akter');
SELECT 'bus' AS vehicle, ticket_no, passenger FROM gen_ex5_bus_tickets
UNION ALL
SELECT 'boat', ticket_no, passenger FROM gen_ex5_boat_tickets
ORDER BY ticket_no;`}
              solution={`SELECT * FROM (VALUES
  ('bus', 5001, 'Rahim Uddin'),
  ('boat', 5002, 'Nusrat Jahan'),
  ('boat', 5003, 'Tanvir Ahmed'),
  ('bus', 5004, 'Farhana Akter')
) AS v(vehicle, ticket_no, passenger);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "reset-after-bulk-load",
      subHeader: { index: "012", title: "Resetting After a Bulk Load" },
      title: <SectionTitle>পুরনো Data আনার পরে Sequence কে সামনে আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের দ্বিতীয় অভিযোগের রহস্য। তানিম গত বছরের Departure গুলো নতুন Table এ এনেছিলেন তাদের নিজেদের
                id সহ, কারণ পুরনো Booking গুলো সেই id দেখিয়েই Departure চেনে। নিজের id দিয়ে আনতে হয়েছিল{" "}
                <code className={CODE}>OVERRIDING SYSTEM VALUE</code> দিয়ে, যেটা{" "}
                <Link href="/sql/topic/insert" className={LINK}>
                  INSERT
                </Link>{" "}
                লেসনে দেখেছেন। সমস্যা হলো, নিজের id দিয়ে লেখা Row এর সময় কেউ nextval চাপে না। Table এ 16 পর্যন্ত id বসে গেল,
                আর Sequence তখনো ভাবছে পরের নম্বর 1।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো Departure আনা, তারপর প্রথম নতুনটা"
              query={`DROP TABLE IF EXISTS gen_departures;
CREATE TABLE gen_departures (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL,
  starts_on    date NOT NULL,
  seats_left   smallint NOT NULL
);
INSERT INTO gen_departures OVERRIDING SYSTEM VALUE
SELECT departure_id, tour_id, starts_on, seats_left FROM departures;
SELECT count(*) AS rows_loaded, max(departure_id) AS biggest_id FROM gen_departures;
SELECT last_value, is_called FROM gen_departures_departure_id_seq;
INSERT INTO gen_departures (tour_id, starts_on, seats_left)
VALUES (7, DATE '2026-12-26', 15);`}
              caption={`rows_loaded 16, biggest_id 16। Sequence এর last_value 1, is_called f, মানে পরের nextval দেবে 1। তাই নতুন Departure এ ERROR: duplicate key value violates unique constraint "gen_departures_pkey", DETAIL: Key (departure_id)=(1) already exists। ঠিক তানিমের বৃহস্পতিবারের Error।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান এক লাইনের, আর এই লাইনটা মুখস্থ রাখার মতো: Sequence এর কাঁটা Table এর সবচেয়ে বড় id তে বসান।{" "}
                <code className={CODE}>pg_get_serial_sequence</code> Sequence এর নাম খুঁজে দেয়, <code className={CODE}>max()</code>{" "}
                সবচেয়ে বড় id, আর দুই Argument এর setval বলে সেই নম্বর দেওয়া হয়ে গেছে। উপরের Box চালানোর পরে এটা চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="setval দিয়ে সারানো"
              query={`SELECT setval(pg_get_serial_sequence('gen_departures', 'departure_id'), max(departure_id))
FROM gen_departures;
INSERT INTO gen_departures (tour_id, starts_on, seats_left)
VALUES (7, DATE '2026-12-26', 15)
RETURNING departure_id;`}
              caption="setval ফেরত দিল 16। নতুন Departure পেল departure_id 17, কোনো Error ছাড়া। উপরের ব্যর্থ চেষ্টাটা 1 নম্বরটা খরচ করেছিল, কিন্তু setval কাঁটাটাই সরিয়ে দেওয়ায় তাতে কিছু যায় আসে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LoadResetLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ফাঁকের কথা মনে রাখুন। Table খালি থাকলে <code className={CODE}>max(id)</code> হয় NULL, আর NULL পেলে setval
                কিছুই না করে NULL ফেরত দেয়। আবার setval(seq, 0) দিলে Error, কারণ 0 MINVALUE এর নিচে। তাই এমন Script যেটা খালি
                আর ভরা দুই রকম Table এই চলবে, তাতে লেখা হয় তিন Argument এর রূপ: পরের নম্বর হবে সবচেয়ে বড় id যোগ 1, আর সেটা এখনো
                দেওয়া হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি Table এর ফাঁদ, আর সব জায়গায় চলা রূপ"
              query={`DROP TABLE IF EXISTS gen_empty;
CREATE TABLE gen_empty (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note text
);
SELECT setval(pg_get_serial_sequence('gen_empty', 'id'), max(id)) FROM gen_empty;
SELECT setval(pg_get_serial_sequence('gen_empty', 'id'), COALESCE(max(id), 0) + 1, false)
FROM gen_empty;
INSERT INTO gen_empty (note) VALUES ('first') RETURNING id;`}
              caption="প্রথম setval ফাঁকা, মানে NULL, কিছুই বদলায়নি। দ্বিতীয়টা দিল 1, কারণ COALESCE খালি Table এর NULL কে 0 বানিয়েছে, যোগ 1, আর false বলেছে 1 এখনো দেওয়া হয়নি। প্রথম Row পেল id 1। ভরা Table এ একই লাইন max + 1 এ কাঁটা বসায়, তাই এই রূপটা যেকোনো Import Script এর শেষে নিশ্চিন্তে লেখা যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Identity এর নিজের <code className={CODE}>ALTER TABLE ... ALTER COLUMN ... RESTART WITH 17</code> ও কাজ করে, কিন্তু
                শুধু একটা নির্দিষ্ট সংখ্যা নেয়। <code className={CODE}>RESTART WITH (SELECT max(...) + 1 ...)</code> লিখলে
                PostgreSQL 18 বলে syntax error। Script এ যেখানে সংখ্যাটা আগে থেকে জানা নেই, সেখানে setval ই ভরসা।
              </ContentParagraph>
              <ContentParagraph>
                <Link href="/sql/topic/bulk-loading" className={LINK}>
                  Bulk Loading
                </Link>{" "}
                লেসনের COPY তে বিপদটা আরও চুপচাপ। COPY নিজের দেওয়া id সহ Row আনার সময় GENERATED ALWAYS কে পাত্তাই দেয় না, কোনো
                OVERRIDING ছাড়াই। আর পুরনো id যদি 101 থেকে শুরু হয়, তাহলে প্রথম নতুন Row নির্বিঘ্নে 1 পায়, কোনো Error ছাড়া। Error
                আসে একশো Row পরে, যখন Sequence 101 এ পৌঁছায়, হয়তো সপ্তাহ খানেক পরে, যখন কেউ আর Import এর কথা মনেও রাখেনি।
                নিচে PostgreSQL 18.6 এর psql এ পুরো ঘটনা, একশো Row এর অপেক্ষা setval(100) দিয়ে সংক্ষেপ করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "copy-then-reset.sql",
          code: `CREATE TABLE gen_load (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL,
  starts_on    date NOT NULL
);
COPY gen_load (departure_id, tour_id, starts_on) FROM STDIN WITH (FORMAT csv);
101,1,2026-11-20
102,2,2026-11-27
103,7,2026-11-21
\\.
-- COPY 3   (GENERATED ALWAYS থাকা সত্ত্বেও নিজের id নিয়ে নিল)

INSERT INTO gen_load (tour_id, starts_on) VALUES (9, '2026-12-26') RETURNING departure_id;
--  departure_id
-- --------------
--             1     (কোনো Error নেই, টাইম বোমা চালু)

SELECT setval(pg_get_serial_sequence('gen_load', 'departure_id'), 100);   -- একশো Row পরের অবস্থা
INSERT INTO gen_load (tour_id, starts_on) VALUES (9, '2027-01-02');
-- ERROR:  duplicate key value violates unique constraint "gen_load_pkey"
-- DETAIL:  Key (departure_id)=(101) already exists.

SELECT setval(pg_get_serial_sequence('gen_load', 'departure_id'), max(departure_id)) FROM gen_load;
--  setval
-- --------
--     103
INSERT INTO gen_load (tour_id, starts_on) VALUES (9, '2027-01-02') RETURNING departure_id;
--  departure_id
-- --------------
--           104`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই নিয়মটা PostgreSQL নিজেও মানে। Module 18 এর{" "}
                <Link href="/sql/topic/pg-dump-restore" className={LINK}>
                  pg_dump
                </Link>{" "}
                যখন Island Tours এর Backup File বানায়, প্রতিটা Table এর Row আনে নিজের id সহ COPY দিয়ে, তারপর প্রতিটা Sequence
                এর জন্য ঠিক একটা setval লেখে। নিচে island_tours এর pg_dump File থেকে আসল লাইন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "island_tours.dump.sql (অংশ)",
          code: `SELECT pg_catalog.setval('public.bookings_booking_id_seq', 24, true);
SELECT pg_catalog.setval('public.customers_customer_id_seq', 15, true);
SELECT pg_catalog.setval('public.departures_departure_id_seq', 16, true);
SELECT pg_catalog.setval('public.destinations_destination_id_seq', 7, true);
SELECT pg_catalog.setval('public.guides_guide_id_seq', 5, true);
SELECT pg_catalog.setval('public.payments_payment_id_seq', 19, true);
SELECT pg_catalog.setval('public.reviews_review_id_seq', 10, true);
SELECT pg_catalog.setval('public.tours_tour_id_seq', 9, true);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              true হলো সেই তৃতীয় Argument, is_called। Import এর পরে সব ঠিক আছে কিনা এক নজরে দেখার একটা অভ্যাস করুন: প্রতিটা
              Table এর সবচেয়ে বড় id আর তার Sequence এর last_value পাশাপাশি। last_value কখনো max_id এর চেয়ে ছোট হলেই বিপদ।
              নিচের Box টা আগের দুই Box এর পরে চালান, কারণ gen_departures সেখানে তৈরি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sequence এর স্বাস্থ্য পরীক্ষা"
              query={`SELECT 'tours' AS table_name,
       (SELECT max(tour_id) FROM tours) AS max_id,
       (SELECT last_value FROM tours_tour_id_seq) AS sequence_at
UNION ALL
SELECT 'bookings', (SELECT max(booking_id) FROM bookings),
       (SELECT last_value FROM bookings_booking_id_seq)
UNION ALL
SELECT 'payments', (SELECT max(payment_id) FROM payments),
       (SELECT last_value FROM payments_payment_id_seq)
UNION ALL
SELECT 'gen_departures', (SELECT max(departure_id) FROM gen_departures),
       (SELECT last_value FROM gen_departures_departure_id_seq);`}
              caption="৪টা Row: tours 9 আর 9, bookings 24 আর 24, payments 19 আর 19, gen_departures 17 আর 17। সবখানে sequence_at আর max_id সমান, তাই পরের INSERT নিরাপদ। setval এর আগে চালালে gen_departures এ দেখা যেত max_id 16, sequence_at 1।"
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
                  Starter <code className={CODE}>gen_ex6_departures</code> বানিয়ে Island Tours এর ১৬টা Departure নিজেদের id সহ
                  আনে, তারপর দুটো নতুন Departure যোগ করার চেষ্টা করে। মাঝের ফাঁকা জায়গায় একটা Statement লিখুন, যাতে নতুন দুটো
                  Error ছাড়া ঢোকে আর পুরনোদের ঠিক পরের নম্বর পায়। শেষের Query বদলাবেন না।
                </>
              }
              hint={
                <>
                  উপরের setval এর লাইনটাই, Table এর নাম বদলে। ALTER TABLE ... RESTART WITH 17 ও চলবে, কিন্তু সংখ্যাটা আগে থেকে
                  জানতে হবে।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ex6_departures;
CREATE TABLE gen_ex6_departures (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL,
  starts_on    date NOT NULL,
  seats_left   smallint NOT NULL
);
INSERT INTO gen_ex6_departures OVERRIDING SYSTEM VALUE
SELECT departure_id, tour_id, starts_on, seats_left FROM departures;
-- এখানে আপনার একটা Statement

-- নিচের দুটো বদলাবেন না
INSERT INTO gen_ex6_departures (tour_id, starts_on, seats_left)
VALUES (7, DATE '2026-12-26', 15), (9, DATE '2027-01-02', 24);
SELECT departure_id, tour_id, starts_on
FROM gen_ex6_departures
WHERE starts_on >= DATE '2026-12-01'
ORDER BY departure_id;`}
              solution={`SELECT departure_id, tour_id, starts_on
FROM departures
WHERE starts_on >= DATE '2026-12-01'
UNION ALL
SELECT m.max_id + v.n, v.tour_id, v.starts_on
FROM (SELECT max(departure_id) AS max_id FROM departures) AS m
CROSS JOIN (VALUES (1, 7, DATE '2026-12-26'), (2, 9, DATE '2027-01-02')) AS v(n, tour_id, starts_on)
ORDER BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Generated Column আর AUTO_INCREMENT</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL কোর্সটা দেখছেন, তাতে এই লেসনের দুই অর্ধেকের MySQL রূপ পাবেন, কিন্তু কয়েকটা জায়গায় নিয়ম উল্টো।
                Generated Column MySQL এ অনেক আগে থেকে আছে, আর সেখানেও কিছু না লিখলে Default হলো VIRTUAL, MySQL 8.4 এর
                Documentation অনুযায়ী। সংক্ষিপ্ত রূপে GENERATED ALWAYS শব্দ দুটো বাদ দিয়ে শুধু <code className={CODE}>AS (...)</code>{" "}
                লেখা যায়। নিচের সব ফলাফল MySQL 8.4.11 এ চালিয়ে পাওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-generated-columns.sql",
          code: `-- MySQL 8.4
CREATE TABLE gen_fares (
  fare_id        INT AUTO_INCREMENT PRIMARY KEY,
  seats          SMALLINT NOT NULL,
  unit_price_bdt DECIMAL(10, 2) NOT NULL,
  total_bdt      DECIMAL(10, 2) AS (seats * unit_price_bdt) STORED,
  per_day_bdt    DECIMAL(10, 2) AS (ROUND(unit_price_bdt / 3, 2))
);
SELECT COLUMN_NAME, EXTRA FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'island_tours' AND TABLE_NAME = 'gen_fares'
ORDER BY ORDINAL_POSITION;
-- fare_id        | auto_increment
-- seats          |
-- unit_price_bdt |
-- total_bdt      | STORED GENERATED
-- per_day_bdt    | VIRTUAL GENERATED      (কিছু না লেখায় VIRTUAL)

INSERT INTO gen_fares (seats, unit_price_bdt) VALUES (2, 4500), (3, 12000.50);
SELECT LAST_INSERT_ID();
-- 1    (একসাথে কয়েকটা Row দিলে প্রথম Row এর id, শেষেরটার না)

INSERT INTO gen_fares (seats, unit_price_bdt, total_bdt) VALUES (1, 100, 999);
-- ERROR 3105 (HY000): The value specified for generated column 'total_bdt'
-- in table 'gen_fares' is not allowed.

CREATE INDEX gen_fares_per_day ON gen_fares (per_day_bdt);
-- Query OK   (InnoDB এ VIRTUAL Column এ Index চলে)

ALTER TABLE gen_fares ADD COLUMN grand_bdt DECIMAL(10, 2) AS (total_bdt * 1.15);
-- Query OK   (আগে লেখা Generated Column এর নাম সূত্রে চলে)

ALTER TABLE gen_fares ADD COLUMN made_at DATETIME AS (NOW());
-- ERROR 3763 (HY000): Expression of generated column 'made_at' contains a disallowed function: now.

CREATE TABLE gen_invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  code       VARCHAR(20) AS (CONCAT('IT-', invoice_id))
);
-- ERROR 3109 (HY000): Generated column 'code' cannot refer to auto-increment column.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ CREATE SEQUENCE নেই, লিখলে ERROR 1064, Syntax এর ভুল। নম্বর আসে শুধু Column এর AUTO_INCREMENT থেকে, যার
                Counter Table এর সাথেই থাকে। আর এখানে এই লেসনের সবচেয়ে বড় পার্থক্য: MySQL এ নিজের id দিয়ে Row আনলে Counter নিজেই
                সবচেয়ে বড় id এর পরে চলে যায়। তানিমের সমস্যা MySQL এ হতোই না, কোনো setval লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-auto-increment.sql",
          code: `-- MySQL 8.4
CREATE TABLE gen_departures (
  departure_id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id      INT NOT NULL,
  starts_on    DATE NOT NULL,
  seats_left   SMALLINT NOT NULL
);
INSERT INTO gen_departures SELECT departure_id, tour_id, starts_on, seats_left FROM departures;
-- Query OK, 16 rows affected
INSERT INTO gen_departures (tour_id, starts_on, seats_left) VALUES (1, '2026-12-20', 20);
SELECT LAST_INSERT_ID();
-- 17   (Counter নিজেই 16 এর পরে গেছে)

-- information_schema এর AUTO_INCREMENT পুরনো খবর দিতে পারে
SELECT @@information_schema_stats_expiry;
-- 86400   (সেকেন্ড, মানে এক দিনের পুরনো হিসাবও দেখাতে পারে)
INSERT INTO gen_departures (tour_id, starts_on, seats_left) VALUES (1, '2026-12-27', 20);
SELECT AUTO_INCREMENT FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'island_tours' AND TABLE_NAME = 'gen_departures';
-- 18   (পুরনো)
SHOW CREATE TABLE gen_departures;
-- ... ENGINE=InnoDB AUTO_INCREMENT=19 ...   (আসল)
SET SESSION information_schema_stats_expiry = 0;
-- এখন একই SELECT দেয় 19

-- Counter কে সবচেয়ে বড় id এর নিচে নামানো যায় না
DELETE FROM gen_departures WHERE departure_id > 16;
ALTER TABLE gen_departures AUTO_INCREMENT = 1;
-- Counter হলো 17, মানে সবচেয়ে বড় id যোগ 1
ALTER TABLE gen_departures AUTO_INCREMENT = 1000;
INSERT INTO gen_departures (tour_id, starts_on, seats_left) VALUES (1, '2026-12-20', 20);
SELECT LAST_INSERT_ID();
-- 1000

-- দুই Server দুজনেই লিখলে id যেন না মেলে, তার পুরনো কৌশল
SET SESSION auto_increment_increment = 10, auto_increment_offset = 3;
CREATE TABLE gen_steps (id INT AUTO_INCREMENT PRIMARY KEY, n VARCHAR(5));
INSERT INTO gen_steps (n) VALUES ('a'), ('b'), ('c');
SELECT id FROM gen_steps;
-- 3, 13, 23

CREATE SEQUENCE gen_seq;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'SEQUENCE gen_seq'`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["Generated Column এর Default", "VIRTUAL (18 থেকে)", "VIRTUAL"],
            ["নিজের মান লিখলে", "428C9: cannot insert a non-DEFAULT value", "3105: value ... is not allowed"],
            ["আরেক Generated Column এর নাম সূত্রে", "চলে না (42P17)", "চলে, যদি সেটা আগে লেখা থাকে"],
            ["VIRTUAL Column এ Index", "চলে না, Expression Index দিয়ে", "চলে (InnoDB এর Secondary Index)"],
            ["now() এর মতো বদলানো Function", "42P17: not immutable", "3763: disallowed function"],
            ["id এর Column সূত্রে", "চলে (Identity Column)", "চলে না, 3109"],
            ["আলাদা নম্বরের যন্ত্র", "CREATE SEQUENCE, এক Sequence অনেক Table এ", "নেই, শুধু Column এর AUTO_INCREMENT"],
            ["নিজের id দিয়ে Data আনার পরে", "setval লাগে, নইলে duplicate key", "Counter নিজেই এগিয়ে যায়"],
            ["নম্বর কোথায় দেখবেন", "pg_sequences, last_value", "SHOW CREATE TABLE, information_schema দেরিতে বদলায়"],
            ["শেষ নতুন id", "INSERT ... RETURNING, currval, lastval", "LAST_INSERT_ID(), কয়েক Row এ প্রথমটার id"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ: প্রতি Seat এর দাম, মাসের হিসাব, আর Invoice নম্বর</SectionTitle>,
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
                মিটিংয়ের শেষে ফারুক সাহেব তিনটা নতুন চাওয়া দিলেন। এক, Admin Page এ প্রতিটা Booking এর পাশে প্রতি Seat এর দাম।
                দুই, মাসে মাসে Confirmed আয়ের হিসাব, ঢাকার সময়ে মাস ধরে। তিন, প্রতিটা Confirmed Booking এর একটা Invoice, যার নম্বর
                শুরু হবে 5001 থেকে, পাশে VAT।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম দুটো Island Tours এর আসল bookings Table এ Column যোগ করার কাজ। কিন্তু এই Page এর সব Box একটাই Database
                ভাগ করে, তাই sample Table এ বদল করা হবে শুধু <code className={CODE}>BEGIN ... ROLLBACK</code> এর ভেতরে: Column যোগ,
                ফলাফল দেখা, তারপর সব ফেরত। প্রথম চাওয়ার জন্য VIRTUAL যথেষ্ট, কারণ এটা শুধু দেখানোর জিনিস আর হিসাব হালকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="bookings এ প্রতি Seat এর দাম, পরীক্ষা করে ফেরত"
              query={`BEGIN;
ALTER TABLE bookings
  ADD COLUMN per_seat_bdt numeric GENERATED ALWAYS AS (round(total_bdt / seats, 2));
SELECT booking_id, seats, total_bdt, per_seat_bdt
FROM bookings
ORDER BY booking_id
LIMIT 5;
ROLLBACK;
SELECT count(*) AS columns_left
FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name = 'per_seat_bdt';`}
              caption="৫টা Row: Booking 1, 2, 3 এর per_seat_bdt 12500.00 (Saint Martin), Booking 4 আর 5 এর 8500.00 (Cox's Bazar)। VIRTUAL হওয়ায় ২৪ Row এর Table নতুন করে লেখা হয়নি। ROLLBACK এর পরে columns_left 0, bookings আগের মতো। bookings এর seats এ CHECK (seats > 0) আছে, তাই এখানে শূন্য দিয়ে ভাগের ভয় নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় চাওয়ায় মাসের হিসাব বারবার Report এ লাগবে, GROUP BY তে বসবে, তাই STORED। booked_at একটা timestamptz, তাই
              দুই Argument এর date_trunc চলবে না (STABLE)। ঢাকার নাম সহ তিন Argument এর রূপ লাগবে, তারপর{" "}
              <code className={CODE}>AT TIME ZONE &apos;Asia/Dhaka&apos;</code> দিয়ে ঢাকার ঘড়ির সময়, তারপর date।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঢাকার মাস ধরে আয়, STORED Column দিয়ে"
              query={`BEGIN;
ALTER TABLE bookings ADD COLUMN booked_month date
  GENERATED ALWAYS AS ((date_trunc('month', booked_at, 'Asia/Dhaka') AT TIME ZONE 'Asia/Dhaka')::date) STORED;
SELECT booked_month, count(*) AS bookings, sum(total_bdt) AS revenue_bdt
FROM bookings WHERE status = 'confirmed' GROUP BY booked_month ORDER BY booked_month;
ROLLBACK;`}
              caption="৬টা Row: 2025-12-01 এ 2টা Booking 75000.00, 2026-01-01 এ 4টা 92000.00, 2026-02-01 এ 1টা 19000.00, 2026-03-01 এ 3টা 57600.00, 2026-09-01 এ 2টা 50500.00, 2026-10-01 এ 5টা 129500.00। যোগ করলে 423600.00, ঠিক Island Tours এর মোট Confirmed আয়। সূত্রটা গ্রহণ করা মানেই প্রমাণ যে তিন Argument এর date_trunc আর AT TIME ZONE দুটোই IMMUTABLE। শেষে ROLLBACK, bookings অক্ষত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় চাওয়া পুরো লেসনের যোগফল, তাই সেটা আপনার Challenge। একটা নতুন Table লাগবে: Invoice এর নম্বর একটা Identity
                থেকে যেটা 5001 এ শুরু, VAT একটা STORED Generated Column (টাকার হিসাব, প্রায়ই পড়া হবে), আর দেখানোর Invoice Code
                একটা VIRTUAL Generated Column, যেটা Identity এর নম্বর থেকে তৈরি। মনে রাখুন, MySQL এ এই শেষ কাজটা চলত না (3109),
                PostgreSQL এ চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  <code className={CODE}>gen_ch_invoices</code> বানান, এই ক্রমে পাঁচটা Column: invoice_id (integer, Identity, 5001
                  থেকে শুরু, Primary Key), booking_id (integer, NOT NULL), amount_bdt (numeric(10, 2), NOT NULL), vat_bdt
                  (numeric(10, 2), STORED, amount_bdt এর 15%, দুই দশমিকে round), আর invoice_code (text, VIRTUAL, যেমন IT-5001)।
                  Starter এর INSERT departure 8 আর 10 এর Confirmed Booking গুলোর Invoice বানায়। শেষের Query বদলাবেন না, সেটা
                  উত্তরের সাথে কোন Column কোন ধরনের তাও দেখায়।
                </>
              }
              hint={
                <>
                  Identity এর শুরু বন্ধনীতে: <code className={CODE}>GENERATED ALWAYS AS IDENTITY (START WITH 5001)</code>। Code
                  এর সূত্রে integer কে আগে text বানান: <code className={CODE}>&apos;IT-&apos; || invoice_id::text</code>। VAT এর
                  শেষে STORED, Code এর শেষে VIRTUAL অথবা কিছুই না।
                </>
              }
              orderMatters
              starter={`DROP TABLE IF EXISTS gen_ch_invoices;
-- এখানে CREATE TABLE gen_ch_invoices লিখুন

-- নিচের দুটো Statement বদলাবেন না
INSERT INTO gen_ch_invoices (booking_id, amount_bdt)
SELECT booking_id, total_bdt
FROM bookings
WHERE status = 'confirmed' AND departure_id IN (8, 10)
ORDER BY booking_id;
SELECT i.invoice_code, i.booking_id, i.amount_bdt, i.vat_bdt,
       (SELECT string_agg(attname || ':' || attgenerated::text, ', ' ORDER BY attnum)
          FROM pg_attribute
         WHERE attrelid = 'gen_ch_invoices'::regclass AND attgenerated <> '') AS generated
FROM gen_ch_invoices i
ORDER BY i.invoice_id;`}
              solution={`SELECT 'IT-' || (5000 + row_number() OVER (ORDER BY booking_id))::text AS invoice_code,
       booking_id,
       total_bdt AS amount_bdt,
       round(total_bdt * 0.15, 2) AS vat_bdt,
       'vat_bdt:s, invoice_code:v' AS generated
FROM bookings
WHERE status = 'confirmed' AND departure_id IN (8, 10)
ORDER BY booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যে মান নিজে থেকে ঠিক থাকা উচিত, তার জন্য সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "মানটা কি অন্য Column থেকে হিসাব করা যায়?",
              description:
                "মোট দাম, VAT, পুরো নাম, মাসের প্রথম দিন: একই Row এর অন্য Column থেকে বের হলে সেটা Generated Column এর প্রার্থী। অন্য Table লাগলে না, সেটা JOIN বা View এর কাজ।",
            },
            {
              title: "সূত্রটা কি সময় বা Setting এ বদলায়?",
              description:
                "আজকের তারিখ, now(), concat, to_char, Time Zone ছাড়া timestamptz এর date_trunc থাকলে Error 42P17। IMMUTABLE রাস্তা খুঁজুন: ||, ::timestamp, Time Zone এর নাম সহ date_trunc। না পেলে Query তে হিসাব করুন।",
            },
            {
              title: "STORED না VIRTUAL?",
              description:
                "খোঁজা, সাজানো, UNIQUE বা Index লাগলে, নিজের Function থাকলে, অথবা প্রায়ই পড়া হলে STORED। শুধু দেখানোর হালকা হিসাব হলে VIRTUAL। PostgreSQL 18 এ কিছু না লিখলে VIRTUAL, তাই ইচ্ছাটা সবসময় লিখে দিন।",
            },
            {
              title: "ভুল Data দরজাতেই আটকান",
              description:
                "সূত্রে ভাগ থাকলে ভাজকের Column এ CHECK (x > 0)। নইলে VIRTUAL এ ভুল Row ঢুকে যায় আর Report ভাঙে পরে। NULL হতে পারে এমন অংশে coalesce।",
            },
            {
              title: "নম্বরের জন্য Identity, আলাদা নম্বরের জন্য Sequence",
              description:
                "Table এর id এর জন্য GENERATED ALWAYS AS IDENTITY, দ্রুত বাড়বে মনে হলে bigint। দুই Table মিলিয়ে একটা ধারা, বা id ছাড়া অন্য নম্বর (Token, Voucher) হলে CREATE SEQUENCE আর DEFAULT nextval।",
            },
            {
              title: "Option গুলো ভেবে দিন",
              description:
                "CYCLE দিলে MINVALUE ও দিন, নইলে ফিরবে 1 এ। ক্রমিক অর্থ লাগলে CACHE 1 রাখুন, কারণ CACHE বড় ফাঁক আর এলোমেলো ক্রম আনে। ফাঁকহীন নম্বর Sequence দেবে না।",
            },
            {
              title: "নিজের id দিয়ে Data আনার পরে setval",
              description:
                "OVERRIDING SYSTEM VALUE বা COPY দিয়ে আনার পরপরই setval(pg_get_serial_sequence(...), COALESCE(max(id), 0) + 1, false)। তারপর max_id আর last_value পাশাপাশি মিলিয়ে নিন।",
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
            ["হিসাবের মান হাতে লেখা Column এ", "এক জায়গায় বদলাতে ভুললেই দুই Column এ অমিল, চুপচাপ", "GENERATED ALWAYS AS (সূত্র)"],
            ["Generated Column এ নিজের মান", "428C9, INSERT বা UPDATE আটকায়", "Column টা বাদ দিন, অথবা DEFAULT লিখুন"],
            ["সূত্রে আরেক Generated Column", "42P17: cannot use generated column", "মূল Column থেকে সূত্র আবার লিখুন"],
            ["সূত্রে now(), current_date বা concat", "42P17: generation expression is not immutable", "|| বা IMMUTABLE রূপ, অথবা Query তে হিসাব"],
            ["date এ সরাসরি date_trunc", "date চুপচাপ timestamptz হয়, 42P17", "date_trunc('month', d::timestamp)::date"],
            ["STORED ভেবে কিছু না লেখা", "PostgreSQL 18 এ VIRTUAL হয়, পরে Index দিতে গিয়ে 0A000", "STORED বা VIRTUAL সবসময় লিখে দিন"],
            ["সূত্রে ভাগ, ভাজকে CHECK নেই", "VIRTUAL এ ভুল Row ঢোকে, পরে SELECT এ division by zero", "CHECK (seats > 0)"],
            ["CYCLE দিয়ে MINVALUE ভুলে যাওয়া", "115 এর পরে 1, START এ না", "MINVALUE START এর সমান দিন"],
            ["RESTART কে WITH ছাড়া লেখা", "শুরুর নম্বরে ফেরে, duplicate key", "RESTART WITH n, অথবা setval"],
            ["নিজের id দিয়ে Import, setval নেই", "সাথে সাথে বা সপ্তাহ পরে duplicate key", "Import এর শেষে setval(..., max + 1, false)"],
            ["id ছোট মানে আগে তৈরি ভাবা", "CACHE আর একসাথে অনেক Session এ ভুল", "booked_at এর মতো সময়ের Column"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS gen_fix_guests;
CREATE TABLE gen_fix_guests (
  first_name text NOT NULL,
  last_name  text NOT NULL,
  city       text NOT NULL,
  label      text GENERATED ALWAYS AS (concat(first_name, ' ', last_name, ' (', city, ')')) STORED
);
INSERT INTO gen_fix_guests (first_name, last_name, city) VALUES ('Priya', 'Sharma', 'Kolkata');
SELECT label FROM gen_fix_guests;`}
              caption="এখানে একটা ভুল আছে, তাই ERROR: generation expression is not immutable। concat এর জায়গায় || দিয়ে জোড়া লাগান: first_name || ' ' || last_name || ' (' || city || ')'। তিনটা Column ই text আর NOT NULL, তাই || নিরাপদ। ঠিক হলে ফলাফল একটা Row: Priya Sharma (Kolkata)।"
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
                    href="https://www.postgresql.org/docs/current/ddl-generated-columns.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Generated Columns
                  </a>
                  : STORED আর VIRTUAL, সব নিয়মের তালিকা, আর VIRTUAL এর নিজের সীমা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/xfunc-volatility.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Function Volatility Categories
                  </a>
                  : IMMUTABLE, STABLE, VOLATILE এর সংজ্ঞা, আর TimeZone নির্ভর Function কেন STABLE।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-createsequence.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: CREATE SEQUENCE
                  </a>
                  : প্রতিটা Option এর Default, CYCLE কোথায় ফেরে, CACHE এর হারানো নম্বর।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-sequence.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Sequence Manipulation Functions
                  </a>
                  : nextval, currval, lastval আর setval এর তিন Argument এর রূপ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/view-pg-sequences.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: pg_sequences
                  </a>
                  : last_value কেন CACHE থাকলে বিলি হওয়া নম্বরের চেয়ে বড়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/18/release-18.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : VIRTUAL Generated Column আর তার Default হওয়ার ঘোষণা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/create-table-generated-columns.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: CREATE TABLE and Generated Columns
                  </a>
                  : VIRTUAL Default, আগের Generated Column এর নাম, AUTO_INCREMENT এর নিষেধ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/innodb-auto-increment-handling.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: AUTO_INCREMENT Handling in InnoDB
                  </a>
                  : Counter কীভাবে এগোয়, আর কেন ফাঁক পড়ে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : একটা MySQL কোর্স। AUTO_INCREMENT দেওয়া Table গুলো PostgreSQL এ Identity দিয়ে আবার লিখুন, আর নিজের id দিয়ে Row
                  আনার পরে দুই জায়গায় পরের Row কী পায় মিলিয়ে দেখুন।
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
                  যে মান একই Row এর অন্য Column থেকে বের হয়, তাকে হাতে লিখলে একদিন অমিল হবেই। Generated Column সেই মান Database এর
                  হাতে দেয়: <code className={CODE}>GENERATED ALWAYS AS (সূত্র) STORED | VIRTUAL</code>।
                </ListItem>
                <ListItem>
                  Generated Column এ নিজের মান লেখা যায় না (428C9), শুধু DEFAULT। সূত্রে আরেক Generated Column, Subquery, অন্য
                  Table চলে না, আর DEFAULT বা Identity একসাথে দেওয়া যায় না।
                </ListItem>
                <ListItem>
                  সূত্রে শুধু IMMUTABLE Function। now(), current_date, concat, to_char, Time Zone ছাড়া timestamptz এর date_trunc
                  সবাই STABLE, তাই 42P17। pg_proc এর provolatile এ সবার চরিত্র লেখা।
                </ListItem>
                <ListItem>
                  STORED হিসাব করে লেখার সময়, Disk এ রাখে, Index আর Constraint চলে। VIRTUAL হিসাব করে পড়ার সময়, জায়গা লাগে না,
                  কিন্তু PostgreSQL 18 এ Index, UNIQUE, Foreign Key আর নিজের Function চলে না। কিছু না লিখলে VIRTUAL।
                </ListItem>
                <ListItem>
                  ADD COLUMN আর SET EXPRESSION এ STORED পুরো Table নতুন করে লেখে, VIRTUAL লেখে না। DROP EXPRESSION সূত্র সরিয়ে
                  Column সাধারণ করে, শুধু STORED এ। CREATE TABLE AS এ সূত্র হারায়, COPY আর pg_dump Generated Column বাদ দেয়।
                </ListItem>
                <ListItem>
                  Identity এর পেছনে একটা Sequence, নাম pg_get_serial_sequence দিয়ে, সবার খবর pg_sequences এ। Option বন্ধনীতে,
                  বদল ALTER COLUMN দিয়ে, আর WITH ছাড়া RESTART শুরুর নম্বরে ফেরে।
                </ListItem>
                <ListItem>
                  CREATE SEQUENCE এর Option: AS, START WITH, INCREMENT BY, MINVALUE, MAXVALUE, CYCLE, CACHE। সীমা পেরোলে 2200H,
                  CYCLE ফেরে MINVALUE এ। CACHE বড় ফাঁক আনে আর নম্বরের ক্রম এলোমেলো করে, তবু কখনো একই নম্বর দুইবার না।
                </ListItem>
                <ListItem>
                  setval দুই Argument এ মানে নম্বরটা দেওয়া হয়ে গেছে, তিন Argument এ false মানে এখনো না। setval আর nextval
                  ROLLBACK মানে না। এক Sequence অনেক Table এ DEFAULT nextval দিয়ে, OWNED BY দিয়ে মালিকানা।
                </ListItem>
                <ListItem>
                  নিজের id দিয়ে Data আনলে (OVERRIDING SYSTEM VALUE বা COPY) Sequence পিছিয়ে থাকে। আনার পরপরই{" "}
                  <code className={CODE}>setval(seq, COALESCE(max(id), 0) + 1, false)</code>। pg_dump নিজেও তাই করে। MySQL এর
                  AUTO_INCREMENT নিজেই এগিয়ে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই Module এ আপনি Data লিখতে, বদলাতে, মুছতে আর একসাথে আনতে শিখলেন, আর Database কে দিয়ে কিছু মান নিজে বসাতেও। কিন্তু
                সবচেয়ে ভয়ের মুহূর্তটা এখনো বাকি: একটা UPDATE, যার WHERE লিখতে ভুলে গেছেন, আর Enter চাপার পরে বুঝলেন সব Row
                বদলে গেছে। কীভাবে এটা ঘটে, কীভাবে আটকাবেন, আর ঘটে গেলে কীভাবে ফেরাবেন, সেটাই এই Module এর শেষ লেসন{" "}
                <Link href="/sql/topic/update-without-where" className={LINK}>
                  UPDATE Without WHERE, and Recovery
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
    headers: ["ধারণা", "এক লাইনে", "এই লেসনে"],
    rows: [
      ["Generated Column", "মান আসে সূত্র থেকে, Database নিজে লেখে", "gen_quotes এর total_bdt, seats বদলালেই নতুন উত্তর"],
      ["নিজের মান লেখা", "নিষেধ, 428C9, শুধু DEFAULT চলে", "total_bdt এ 99999 দিতেই Error"],
      ["আরেক Generated Column এর নাম", "সূত্রে চলে না, 42P17", "vat_bdt এর সূত্র মূল Column থেকে আবার লেখা"],
      ["IMMUTABLE", "একই Input, চিরকাল একই Output, শুধু এটাই চলে", "current_date আর concat এ 42P17, || চলে"],
      ["provolatile", "pg_proc এ প্রতিটা Function এর চরিত্র: i, s, v", "date_trunc দুই Argument এ s, Time Zone সহ i"],
      ["STORED", "লেখার সময় হিসাব, Disk এ থাকে, Index চলে", "৫০০০ Row এ 303104 Byte"],
      ["VIRTUAL", "পড়ার সময় হিসাব, PostgreSQL 18 এ Default", "একই Table 229376 Byte, Plan এ সূত্র বসে"],
      ["VIRTUAL এর সীমা", "Index, UNIQUE, Foreign Key, নিজের Function চলে না (0A000)", "gen_limits এ Index আর gen_vat আটকাল"],
      ["ALTER এ খরচ", "STORED যোগ বা SET EXPRESSION এ পুরো Table নতুন করে লেখা", "filenode বদলাল শুধু STORED এ"],
      ["Identity এর Sequence", "Table_Column_seq, pg_get_serial_sequence, pg_sequences", "bookings_booking_id_seq এর last_value 24"],
      ["CREATE SEQUENCE", "START, INCREMENT, MIN, MAX, CYCLE, CACHE", "Seat Token 100 থেকে 115, তারপর 2200H"],
      ["CYCLE", "ফেরে MINVALUE এ, START এ না", "MINVALUE ছাড়া 115 এর পরে 1"],
      ["CACHE", "প্রতিটা Session এর নিজের গোছা, বড় ফাঁক, এলোমেলো ক্রম", "1, 2, 21, 3, 41, তারপর 61"],
      ["setval", "দুই Argument এ দেওয়া হয়ে গেছে, false এ এখনো না, ROLLBACK মানে না", "setval(50, false) এর পরে 50, setval(50) এর পরে 51"],
      ["Import এর পরে", "নিজের id দিয়ে আনলে Sequence পিছিয়ে, setval(max + 1, false)", "gen_departures এ 1 এ duplicate key, setval এর পরে 17"],
      ["MySQL", "VIRTUAL Default, VIRTUAL এ Index চলে, Sequence নেই, Counter নিজেই এগোয়", "নিজের 16 এর পরে পরের Row 17, LAST_INSERT_ID()"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "total_bdt numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED। একটা Row এ seats 2, দাম 12500.00। UPDATE ... SET seats = 3 চালানোর পরে total_bdt কত?",
        options: [
          {
            key: "A",
            text: "25000.00, কারণ total_bdt কেউ বদলায়নি",
            isCorrect: false,
            explanation: "সাধারণ Column হলে তাই হতো, প্রথম Box এর অভিযোগের মতো। Generated Column নিজের উপাদান বদলালে নিজেই আবার হিসাব হয়।",
          },
          {
            key: "B",
            text: "37500.00, UPDATE এর সময় PostgreSQL নিজেই আবার হিসাব করে",
            isCorrect: true,
            explanation: "ঠিক। STORED এ হিসাব হয় INSERT আর UPDATE এর সময়, তাই seats বদলানোর মুহূর্তে নতুন উত্তর Disk এ বসে।",
          },
          {
            key: "C",
            text: "Error, কারণ Generated Column এর উপাদান বদলানো যায় না",
            isCorrect: false,
            explanation: "উপাদান (seats, দাম) স্বাধীনভাবে বদলানো যায়। নিষেধ শুধু Generated Column এ নিজের মান লেখা।",
          },
          {
            key: "D",
            text: "NULL, নতুন হিসাব হওয়া পর্যন্ত খালি থাকে",
            isCorrect: false,
            explanation: "মাঝখানে খালি থাকার কোনো মুহূর্ত নেই। UPDATE এর ভেতরেই নতুন মান লেখা হয়।",
          },
        ],
      },
      {
        id: 2,
        text: "days_ago integer GENERATED ALWAYS AS (current_date - booked_on) STORED লিখে CREATE TABLE চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Table তৈরি হয়, days_ago প্রতিদিন নিজে থেকে বাড়ে",
            isCorrect: false,
            explanation: "STORED এর উত্তর লেখা হয় একবার, Row লেখার সময়। কাল সেটা ভুল হয়ে যেত, তাই PostgreSQL শুরুতেই আটকায়।",
          },
          {
            key: "B",
            text: "ERROR: generation expression is not immutable",
            isCorrect: true,
            explanation: "ঠিক। SQLSTATE 42P17। current_date STABLE, দিন বদলালে উত্তর বদলায়। কত দিন আগে, সেটা Query তে হিসাব করার জিনিস।",
          },
          {
            key: "C",
            text: "Table তৈরি হয়, কিন্তু days_ago সবসময় 0",
            isCorrect: false,
            explanation: "Table টাই তৈরি হয় না, তাই কোনো মান থাকার প্রশ্ন নেই।",
          },
          {
            key: "D",
            text: "VIRTUAL লিখলে চলত, STORED এ শুধু সমস্যা",
            isCorrect: false,
            explanation: "IMMUTABLE এর নিয়ম দুই ধরনেই একই। VIRTUAL লিখলেও 42P17।",
          },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL 18 এ total numeric GENERATED ALWAYS AS (seats * price) লেখা হলো, শেষে STORED বা VIRTUAL কিছুই নেই। কী তৈরি হয়?",
        options: [
          {
            key: "A",
            text: "STORED, কারণ PostgreSQL 12 থেকে সেটাই নিয়ম",
            isCorrect: false,
            explanation: "PostgreSQL 17 পর্যন্ত STORED না লিখলে Table ই তৈরি হতো না। 18 এ নিয়ম বদলেছে।",
          },
          {
            key: "B",
            text: "Syntax Error, শেষের শব্দটা বাধ্যতামূলক",
            isCorrect: false,
            explanation: "PostgreSQL 18 এ বাধ্যতামূলক না। gen_kinds এর total_default চালিয়ে দেখেছেন।",
          },
          {
            key: "C",
            text: "VIRTUAL, attgenerated এ v",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL 18 এর Release Notes অনুযায়ী VIRTUAL এখন Default। তাই ইচ্ছাটা সবসময় লিখে দেওয়াই ভালো।",
          },
          {
            key: "D",
            text: "একটা সাধারণ Column, সূত্রটা শুধু প্রথম INSERT এ কাজ করে",
            isCorrect: false,
            explanation: "GENERATED ALWAYS AS থাকলে Column টা সবসময় Generated, কখনো সাধারণ না।",
          },
        ],
      },
      {
        id: 4,
        text: "PostgreSQL 18 এ একটা VIRTUAL Generated Column এ কোনটা করা যায়?",
        options: [
          {
            key: "A",
            text: "CREATE INDEX দিয়ে Index বসানো",
            isCorrect: false,
            explanation: "indexes on virtual generated columns are not supported, 0A000। সূত্রের উপর Expression Index বসানো যায়।",
          },
          {
            key: "B",
            text: "UNIQUE Constraint দেওয়া",
            isCorrect: false,
            explanation: "UNIQUE ও PostgreSQL 18 এ চলে না, একই 0A000।",
          },
          {
            key: "C",
            text: "নিজের লেখা IMMUTABLE Function সূত্রে ব্যবহার",
            isCorrect: false,
            explanation: "VIRTUAL এ শুধু PostgreSQL এর নিজের Function। gen_vat দিয়ে চেষ্টায় not yet supported এসেছে।",
          },
          {
            key: "D",
            text: "CHECK আর NOT NULL দেওয়া",
            isCorrect: true,
            explanation: "ঠিক। এই দুটো চলে। Index, UNIQUE, Foreign Key আর নিজের Function লাগলে STORED নিন।",
          },
        ],
      },
      {
        id: 5,
        text: "CREATE SEQUENCE s START WITH 100 INCREMENT BY 5 MAXVALUE 115 CYCLE; পঞ্চমবার nextval('s') কী দেয়?",
        options: [
          {
            key: "A",
            text: "100, কারণ CYCLE আবার START এ ফেরে",
            isCorrect: false,
            explanation: "এটাই সবচেয়ে সাধারণ ভুল ধারণা। CYCLE ফেরে MINVALUE এ, START এ না।",
          },
          {
            key: "B",
            text: "1",
            isCorrect: true,
            explanation: "ঠিক। MINVALUE লেখা নেই, তাই বাড়তে থাকা Sequence এর Default MINVALUE 1। 100 এ ফেরাতে চাইলে MINVALUE 100 লাগবে।",
          },
          {
            key: "C",
            text: "120",
            isCorrect: false,
            explanation: "120 MAXVALUE এর বাইরে, Sequence কখনো সীমার বাইরের নম্বর দেয় না।",
          },
          {
            key: "D",
            text: "ERROR: reached maximum value",
            isCorrect: false,
            explanation: "CYCLE না থাকলে তাই হতো, 2200H। CYCLE থাকায় Error না দিয়ে আবার শুরু হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "CREATE SEQUENCE t CACHE 20; জানালা A দুইবার nextval নিল (1, 2)। এবার আরেকটা জানালা B প্রথমবার nextval নিলে কত পাবে?",
        options: [
          {
            key: "A",
            text: "3",
            isCorrect: false,
            explanation: "CACHE 1 হলে 3 পেত। CACHE 20 এ A আগেই 1 থেকে 20 তুলে রেখেছে, সেগুলো শুধু A এর।",
          },
          {
            key: "B",
            text: "21",
            isCorrect: true,
            explanation: "ঠিক, psql এর Transcript এ ঠিক এটাই এসেছে। B নিজের জন্য 21 থেকে 40 তুলে নেয়।",
          },
          {
            key: "C",
            text: "1, কারণ প্রতিটা Session এর নিজের Sequence",
            isCorrect: false,
            explanation: "Sequence একটাই, আর আলাদা Session কখনো একই নম্বর পায় না। শুধু গোছাগুলো আলাদা।",
          },
          {
            key: "D",
            text: "Error, কারণ A এর গোছা শেষ হয়নি",
            isCorrect: false,
            explanation: "একসাথে অনেক Session nextval নিতে পারে, কেউ কারও জন্য অপেক্ষা করে না।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT setval('gen_room_seq', 50, false); তারপর SELECT nextval('gen_room_seq'); কী দেয়?",
        options: [
          {
            key: "A",
            text: "51",
            isCorrect: false,
            explanation: "দুই Argument এর setval(..., 50) এর পরে 51 আসত। false বলছে 50 এখনো দেওয়া হয়নি।",
          },
          {
            key: "B",
            text: "50",
            isCorrect: true,
            explanation: "ঠিক। তৃতীয় Argument হলো is_called। false মানে পরের nextval last_value টাই দেবে।",
          },
          {
            key: "C",
            text: "1, কারণ false মানে আবার শুরু",
            isCorrect: false,
            explanation: "false শুরুতে ফেরায় না, শুধু বলে 50 নম্বরটা এখনো কাউকে দেওয়া হয়নি।",
          },
          {
            key: "D",
            text: "Error, কারণ setval এ তিনটা Argument চলে না",
            isCorrect: false,
            explanation: "তিন Argument এর রূপ বৈধ, আর খালি Table এর জন্য নিরাপদ setval এর ভিত্তিই এটা।",
          },
        ],
      },
      {
        id: 8,
        text: "GENERATED ALWAYS AS IDENTITY Table এ OVERRIDING SYSTEM VALUE দিয়ে id 1 থেকে 16 এর ১৬টা Row আনা হলো। তারপর id ছাড়া প্রথম INSERT এ কী হয়, আর ঠিক করার উপায় কী?",
        options: [
          {
            key: "A",
            text: "পায় 17, কারণ Identity দেখে Table এ কত পর্যন্ত আছে",
            isCorrect: false,
            explanation: "MySQL এর AUTO_INCREMENT এ তাই হয়। PostgreSQL এর Sequence নিজের id দিয়ে লেখা Row এর খবর রাখে না।",
          },
          {
            key: "B",
            text: "duplicate key, Key (id)=(1); ঠিক করতে setval(pg_get_serial_sequence(...), max(id))",
            isCorrect: true,
            explanation: "ঠিক। Sequence তখনো 1 এ। setval এর পরে পরের Row 17 পায়। খালি Table এও চলবে এমন রূপ: COALESCE(max(id), 0) + 1, false।",
          },
          {
            key: "C",
            text: "duplicate key, ঠিক করতে ALTER TABLE ... ALTER COLUMN id RESTART",
            isCorrect: false,
            explanation: "WITH ছাড়া RESTART শুরুর নম্বরে, মানে 1 এ ফেরায়, সমস্যা একই থাকে। RESTART WITH 17 চলবে, কিন্তু সংখ্যাটা জানতে হবে।",
          },
          {
            key: "D",
            text: "428C9, কারণ Import এর পরে Identity বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation: "Identity বন্ধ হয় না। id ছাড়া INSERT বৈধ, সমস্যা শুধু Sequence এর পিছিয়ে থাকা নম্বর।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর নিজে থেকে চলা হিসাব",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>হিসাবের Column:</strong> bookings এর একটা Copy বানান (CREATE TABLE ... AS), তাতে তিনটা Generated Column যোগ
        করুন: প্রতি Seat এর দাম, 15% VAT, আর VAT সহ মোট। কোনটা STORED আর কোনটা VIRTUAL রাখলেন আর কেন, প্রতিটার জন্য এক লাইন।
        শেষে seats বদলে দেখান তিনটাই নিজে থেকে বদলায়।
      </span>,
      <span key="2">
        <strong>Function এর চরিত্র:</strong> pg_proc থেকে আটটা চেনা Function এর provolatile বের করুন (now, concat, lower,
        round, to_char, random, date_trunc এর দুই রূপ)। তারপর দুটো STABLE Function এর জন্য একটা করে IMMUTABLE বিকল্প লিখে
        Generated Column এ চালিয়ে প্রমাণ দিন।
      </span>,
      <span key="3">
        <strong>জায়গা আর গতি:</strong> ১০০০০ Row এর দুটো Table বানান, একটায় তিনটা STORED আর আরেকটায় তিনটা VIRTUAL হিসাব।
        pg_relation_size, EXPLAIN এর Filter, আর Index বসানোর চেষ্টা, তিনটার ফলাফল পাশাপাশি একটা ছোট Table এ লিখুন।
      </span>,
      <span key="4">
        <strong>Token এর যন্ত্র:</strong> Sajek এর Jeep এ ছয়টা Seat, Token 10, 20, ..., 60, প্রতি ট্রিপে আবার 10 থেকে। এমন
        Sequence বানান আর ১৩ জন যাত্রীকে Token দিয়ে দেখান। তারপর নিজের psql এ দুটো জানালা খুলে CACHE 10 এর একটা Sequence এ
        দুই জানালা থেকে পালা করে nextval নিন, আর ফলাফলের ক্রম লিখে রাখুন।
      </span>,
      <span key="5">
        <strong>Import আর বন্ধুকে বোঝানো:</strong> departures আর customers এর দুটো Copy Identity সহ বানিয়ে নিজেদের id দিয়ে
        আনুন, setval এর নিরাপদ রূপ দিয়ে দুটো Sequence ঠিক করুন, আর স্বাস্থ্য পরীক্ষার Query চালান। শেষে আট লাইনে একজন বন্ধুকে
        বোঝান Generated Column কেন, Sequence কেন ফাঁক রাখে, আর Import এর পরে setval কেন লাগে।
      </span>,
    ],
    deliverables: [
      <span key="d1">bookings এর Copy, তিনটা Generated Column এর CREATE আর ALTER, STORED বনাম VIRTUAL এর কারণ, আর বদলের প্রমাণ</span>,
      <span key="d2">আটটা Function এর provolatile এর তালিকা আর দুটো IMMUTABLE বিকল্পের চালানো প্রমাণ</span>,
      <span key="d3">মাপ, Plan আর Index এর ফলাফলের তুলনার Table</span>,
      <span key="d4">Jeep এর Sequence আর ১৩টা Token, আর দুই জানালার CACHE পরীক্ষার ক্রম</span>,
      <span key="d5">Import Script, স্বাস্থ্য পরীক্ষার ফলাফল, আর বন্ধুর জন্য আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Generated Column আর Sequence",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম Generated Column",
        description:
          "প্রথম ফাইলে gen_quotes। seats বদলালে total_bdt নিজে বদলায়, \\d এ সূত্রটা দেখা যায়, আর শেষে নিজের মান লিখতে গিয়ে 428C9। psql Error এর পরেও পরের লাইনে যায়, তাই পুরো ফাইল একবারে চালানো যায়।",
      },
      {
        title: "IMMUTABLE এর পরীক্ষা",
        description:
          "দ্বিতীয় ফাইলে আজকের তারিখের সূত্র আটকায় (42P17), আর || ও ::timestamp দিয়ে লেখা সূত্র চলে। এবার Imran এর পুরো নাম NULL হয় না, কারণ coalesce দিয়ে পদবির অংশ বাঁচানো হয়েছে।",
      },
      {
        title: "STORED বনাম VIRTUAL এর মাপ",
        description:
          "তৃতীয় ফাইলে ৫০০০ Row এর দুটো Table। STORED 303104 Byte, VIRTUAL 229376 Byte, Query Box এর সংখ্যার সাথে হুবহু মেলে। শেষে VIRTUAL এ Index এর চেষ্টা আটকায়।",
      },
      {
        title: "CYCLE এর ফাঁদ আর সীমা",
        description:
          "চতুর্থ ফাইলে MINVALUE ছাড়া আর সহ দুটো CYCLE Sequence পাশাপাশি, তারপর MAXVALUE এ পৌঁছে 2200H, আর \\d দিয়ে Sequence এর সব Option।",
      },
      {
        title: "CACHE, দুই জানালায়",
        description:
          "পঞ্চম ফাইল psql এর \\! দিয়ে মাঝে মাঝে আলাদা Session চালায়। নিজের psql যে Command দিয়ে খোলেন (যেমন -h, -U, -d সহ), \\! এর পরে সেটাই লিখুন। ফলাফল 1, 2, 21, 3, 41, আর last_value 60।",
      },
      {
        title: "Import এর পরে setval, আর পরিষ্কার",
        description:
          "ষষ্ঠ ফাইলে ১৬টা Departure নিজেদের id সহ আনা, প্রথম নতুন Row এ duplicate key, নিরাপদ setval এ 17, তারপর পরের Row 17 পায়। শেষে এই লেসনের সব gen_ Table আর Sequence মুছে island_tours আগের মতো।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-generated-basics.sql",
        code: `DROP TABLE IF EXISTS gen_quotes;
CREATE TABLE gen_quotes (
  quote_id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer       text NOT NULL,
  seats          smallint NOT NULL,
  unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt      numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED
);
INSERT INTO gen_quotes (customer, seats, unit_price_bdt) VALUES
  ('Nusrat Jahan', 2, 12500), ('Rahim Uddin', 4, 8500);
UPDATE gen_quotes SET seats = 3 WHERE customer = 'Nusrat Jahan';
SELECT customer, seats, total_bdt FROM gen_quotes ORDER BY quote_id;
--  Nusrat Jahan |     3 |  37500.00
--  Rahim Uddin  |     4 |  34000.00
\\d gen_quotes
--  quote_id  | integer       | not null | generated always as identity
--  total_bdt | numeric(10,2) |          | generated always as ((seats::numeric * unit_price_bdt)) stored
INSERT INTO gen_quotes (customer, seats, unit_price_bdt, total_bdt)
VALUES ('Tanvir Ahmed', 1, 18000, 18000);
-- ERROR:  cannot insert a non-DEFAULT value into column "total_bdt"
-- DETAIL:  Column "total_bdt" is a generated column.`,
      },
      {
        language: "sql",
        filename: "02-immutable.sql",
        code: `DROP TABLE IF EXISTS gen_clock, gen_trips;
CREATE TABLE gen_clock (
  booked_on date NOT NULL,
  days_ago  integer GENERATED ALWAYS AS (current_date - booked_on) STORED
);
-- ERROR:  generation expression is not immutable
CREATE TABLE gen_trips (
  first_name  text NOT NULL,
  last_name   text,
  starts_on   date NOT NULL,
  full_name   text GENERATED ALWAYS AS (first_name || coalesce(' ' || last_name, '')) STORED,
  start_month date GENERATED ALWAYS AS (date_trunc('month', starts_on::timestamp)::date) STORED
);
INSERT INTO gen_trips (first_name, last_name, starts_on) VALUES
  ('Nusrat', 'Jahan', '2026-11-20'), ('Imran', NULL, '2026-12-18');
SELECT full_name, start_month FROM gen_trips ORDER BY starts_on;
--  Nusrat Jahan | 2026-11-01
--  Imran        | 2026-12-01`,
      },
      {
        language: "sql",
        filename: "03-stored-vs-virtual.sql",
        code: `DROP TABLE IF EXISTS gen_size_stored, gen_size_virtual;
CREATE TABLE gen_size_stored (
  seats smallint NOT NULL, unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt) STORED,
  vat_bdt numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 0.15, 2)) STORED,
  payable_bdt numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 1.15, 2)) STORED
);
CREATE TABLE gen_size_virtual (
  seats smallint NOT NULL, unit_price_bdt numeric(10, 2) NOT NULL,
  total_bdt numeric(10, 2) GENERATED ALWAYS AS (seats * unit_price_bdt),
  vat_bdt numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 0.15, 2)),
  payable_bdt numeric(10, 2) GENERATED ALWAYS AS (round(seats * unit_price_bdt * 1.15, 2))
);
INSERT INTO gen_size_stored SELECT g % 5 + 1, 12500 FROM generate_series(1, 5000) AS g;
INSERT INTO gen_size_virtual SELECT g % 5 + 1, 12500 FROM generate_series(1, 5000) AS g;
SELECT relname, pg_relation_size(oid) AS bytes
FROM pg_class WHERE relname IN ('gen_size_stored', 'gen_size_virtual') ORDER BY relname;
--  gen_size_stored  | 303104
--  gen_size_virtual | 229376
CREATE INDEX ON gen_size_stored (total_bdt);
-- CREATE INDEX
CREATE INDEX ON gen_size_virtual (total_bdt);
-- ERROR:  indexes on virtual generated columns are not supported`,
      },
      {
        language: "sql",
        filename: "04-sequence-options.sql",
        code: `DROP SEQUENCE IF EXISTS gen_cycle_a, gen_cycle_b, gen_seat_seq;
CREATE SEQUENCE gen_cycle_a START WITH 100 INCREMENT BY 5 MAXVALUE 115 CYCLE;
CREATE SEQUENCE gen_cycle_b START WITH 100 INCREMENT BY 5 MINVALUE 100 MAXVALUE 115 CYCLE;
SELECT g, nextval('gen_cycle_a') AS a, nextval('gen_cycle_b') AS b
FROM generate_series(1, 6) AS g;
-- (6 rows): a = 100, 105, 110, 115, 1, 6   b = 100, 105, 110, 115, 100, 105
CREATE SEQUENCE gen_seat_seq START WITH 100 INCREMENT BY 5 MAXVALUE 115;
SELECT nextval('gen_seat_seq') FROM generate_series(1, 4);
-- 100, 105, 110, 115
SELECT nextval('gen_seat_seq');
-- ERROR:  nextval: reached maximum value of sequence "gen_seat_seq" (115)
\\d gen_cycle_b
--   Type  | Start | Minimum | Maximum | Increment | Cycles? | Cache
--  bigint |   100 |     100 |     115 |         5 | yes     |     1`,
      },
      {
        language: "sql",
        filename: "05-cache-two-windows.sql",
        code: `DROP SEQUENCE IF EXISTS gen_token_seq;
CREATE SEQUENCE gen_token_seq CACHE 20;
SELECT nextval('gen_token_seq') AS window_a;   -- 1
SELECT nextval('gen_token_seq') AS window_a;   -- 2
\\! psql -U postgres -d island_tours -c "SELECT nextval('gen_token_seq') AS window_b"
-- 21
SELECT nextval('gen_token_seq') AS window_a;   -- 3
\\! psql -U postgres -d island_tours -c "SELECT nextval('gen_token_seq') AS window_c"
-- 41
SELECT last_value FROM pg_sequences WHERE sequencename = 'gen_token_seq';
-- 60`,
      },
      {
        language: "sql",
        filename: "06-reset-after-load.sql",
        code: `DROP TABLE IF EXISTS gen_departures;
CREATE TABLE gen_departures (
  departure_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tour_id      integer NOT NULL,
  starts_on    date NOT NULL,
  seats_left   smallint NOT NULL
);
INSERT INTO gen_departures OVERRIDING SYSTEM VALUE
SELECT departure_id, tour_id, starts_on, seats_left FROM departures;
-- INSERT 0 16
INSERT INTO gen_departures (tour_id, starts_on, seats_left) VALUES (7, '2026-12-26', 15);
-- ERROR:  duplicate key value violates unique constraint "gen_departures_pkey"
-- DETAIL:  Key (departure_id)=(1) already exists.
SELECT setval(pg_get_serial_sequence('gen_departures', 'departure_id'),
              COALESCE(max(departure_id), 0) + 1, false)
FROM gen_departures;
-- 17
INSERT INTO gen_departures (tour_id, starts_on, seats_left)
VALUES (7, '2026-12-26', 15) RETURNING departure_id;
-- 17
-- পরিষ্কার
DROP TABLE IF EXISTS gen_quotes, gen_clock, gen_trips, gen_size_stored, gen_size_virtual, gen_departures;
DROP SEQUENCE IF EXISTS gen_cycle_a, gen_cycle_b, gen_seat_seq, gen_token_seq;
SELECT count(*) AS gen_objects_left FROM pg_class WHERE relname LIKE 'gen\\_%';
-- 0`,
      },
    ],
  },
};
