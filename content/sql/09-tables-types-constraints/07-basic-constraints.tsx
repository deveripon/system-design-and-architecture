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
  ConstraintGuardLab,
  UniquePairLab,
} from "../../../components/course/topics/ddl/cons-animations";
import {
  CheckOrderDiagram,
  CheckOutcomeDiagram,
  ConstraintAnatomyDiagram,
  RuleLayersDiagram,
  UniqueNullsSplit,
} from "../../../components/course/topics/ddl/cons-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * A tiny test harness: runs one statement and reports "ok" or the SQLSTATE
 * that stopped it, so one query can prove several rules without the box
 * stopping at the first error. Every exercise that needs it creates it again,
 * so each one works on its own.
 */
const TRY_HELPER = `CREATE OR REPLACE FUNCTION cons_try(stmt text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'ok';
EXCEPTION WHEN others THEN
  RETURN SQLSTATE;
END $$;`;

/** The lesson's finished table: every rule from the lesson, each with a name. */
const PROMO_TABLE = `DROP TABLE IF EXISTS cons_promo_codes;
CREATE TABLE cons_promo_codes (
  code        text        NOT NULL,
  percent_off integer     NOT NULL,
  starts_on   date        NOT NULL,
  ends_on     date        NOT NULL,
  max_uses    integer     NOT NULL DEFAULT 100,
  times_used  integer     NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT promo_code_unique        UNIQUE (code),
  CONSTRAINT promo_code_format        CHECK (code ~ '^[A-Z0-9]{4,12}$'),
  CONSTRAINT promo_percent_range      CHECK (percent_off BETWEEN 1 AND 50),
  CONSTRAINT promo_dates_in_order     CHECK (ends_on > starts_on),
  CONSTRAINT promo_max_uses_positive  CHECK (max_uses > 0),
  CONSTRAINT promo_usage_within_limit CHECK (times_used BETWEEN 0 AND max_uses)
);`;

const RAW_BOX = `DROP TABLE IF EXISTS cons_promo_raw;
CREATE TABLE cons_promo_raw (
  code        text,
  percent_off integer,
  starts_on   date,
  ends_on     date
);

INSERT INTO cons_promo_raw VALUES
  ('EID25',  25,  '2026-11-01', '2026-11-30'),
  ('EID25',  30,  '2026-11-01', '2026-11-30'),
  ('BIG50',  250, '2026-11-01', '2026-11-30'),
  (NULL,     20,  '2026-11-01', '2026-11-30'),
  ('PUJA10', 10,  '2026-11-30', '2026-11-01');

SELECT code, percent_off, starts_on, ends_on,
       12000 * (100 - percent_off) / 100 AS price_for_12000
FROM cons_promo_raw;`;

const GUARDED_BOX = `DROP TABLE IF EXISTS cons_promo_guarded;
CREATE TABLE cons_promo_guarded (
  code        text    NOT NULL UNIQUE,
  percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 50),
  starts_on   date    NOT NULL,
  ends_on     date    NOT NULL,
  CHECK (ends_on > starts_on)
);

INSERT INTO cons_promo_guarded VALUES ('EID25', 25, '2026-11-01', '2026-11-30');
INSERT INTO cons_promo_guarded VALUES ('BIG50', 250, '2026-11-01', '2026-11-30');`;

const PROOF_BOX = `${TRY_HELPER}

${PROMO_TABLE}

SELECT n, attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, 'ঈদের কোড',          $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('EID25', 25, '2026-11-01', '2026-11-30')$$),
  (2, 'একই কোড আবার',      $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('EID25', 30, '2026-11-01', '2026-11-30')$$),
  (3, '250 শতাংশ',          $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('BIG50', 250, '2026-11-01', '2026-11-30')$$),
  (4, 'কোড ছাড়া',           $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES (NULL, 20, '2026-11-01', '2026-11-30')$$),
  (5, 'ছোট হাতের কোড',      $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('eid25', 25, '2026-11-01', '2026-11-30')$$),
  (6, 'তারিখ উল্টো',         $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('PUJA10', 10, '2026-11-30', '2026-11-01')$$),
  (7, 'সীমার বেশি ব্যবহার',  $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on, max_uses, times_used) VALUES ('WINTER15', 15, '2026-12-01', '2027-01-31', 100, 120)$$),
  (8, 'পূজার কোড',          $$INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on) VALUES ('PUJA10', 10, '2026-10-10', '2026-10-25')$$)
) AS t(n, attempt, stmt)
ORDER BY n;

SELECT code, percent_off, starts_on, ends_on, max_uses, times_used, is_active
FROM cons_promo_codes
ORDER BY code;`;

export const basicConstraintsContent: TopicData = {
  id: "basic-constraints",
  introduction: {
    badge: "MODULE 09 · LESSON 07",
    title: <SectionTitle>Table এর নিজের নিয়ম: NOT NULL, DEFAULT, UNIQUE আর CHECK</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি Table বানিয়েছেন আর প্রতিটা Column এর জন্য ঠিক Type বেছে নিয়েছেন। Type একটা বড় কাজ করে:
          integer Column এ কেউ &quot;পাঁচ&quot; লিখতে পারে না। কিন্তু Type জানে না আপনার ব্যবসার নিয়ম। integer Column এ 250
          ঢুকবে, অথচ 250 শতাংশ ছাড় মানে Customer কে টাকা ফেরত দেওয়া। text Column এ একই Promo Code দুইবার ঢুকবে। কোনো ঘর
          খালি থাকলেও Type আপত্তি করে না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই ফাঁক বন্ধ করা নিয়ে। Constraint মানে Table এর গায়ে লেখা একটা নিয়ম, যেটা Database নিজে প্রতিটা নতুন বা বদলানো
          Row এর উপর খাটায়। নিয়ম ভাঙলে Row টা Table এ ঢোকেই না, আর আপনি একটা নির্দিষ্ট Error পান। কে কোন পথ দিয়ে Data
          পাঠাল, তাতে কিছু যায় আসে না: Website, CSV Import বা হাতে লেখা psql, সবাইকে একই দরজা পার হতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি NOT NULL, DEFAULT, UNIQUE আর CHECK লিখতে পারবেন, Column এর পাশে এবং Table এর শেষে দুইভাবেই। জানবেন
          UNIQUE আর CHECK কেন NULL কে আলাদা চোখে দেখে, NULLS NOT DISTINCT কী বদলায়, Constraint কে নিজের নাম দিলে কী লাভ, আর
          প্রতিটা নিয়ম ভাঙলে PostgreSQL ঠিক কোন Error আর কোন SQLSTATE Code দেয়। শেষে Island Tours এর জন্য একটা Promo Code
          Table বানাবেন, যার প্রতিটা নিয়ম আপনি নিজেই একটা ভুল INSERT দিয়ে প্রমাণ করবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি ঘুমাই না, ছুটি নিই না, আর কারো সুপারিশ শুনি না। Website থেকে আসুন বা রাত দুটোয় psql খুলে, নিয়মের বাইরে একটা Row ও আমার দরজা পার হবে না। আপনি শুধু একবার লিখে দিন নিয়মটা কী।",
      author: "Constraint",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ঈদের অফার আর ঋণাত্মক টাকার বিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর মার্কেটিং দল ঈদের আগে Promo Code চালু করতে চায়: Customer Booking এর
                সময় একটা কোড লিখবেন, আর মোট টাকা থেকে কিছু শতাংশ কমে যাবে। Developer তানিম এক বিকেলে একটা Table বানালেন।
                চারটা Column: কোড, কত শতাংশ ছাড়, কবে শুরু, কবে শেষ। প্রতিটার ঠিক Type দিলেন, কিন্তু আর কোনো নিয়ম না। ভাবলেন,
                Website এর Form তো JavaScript দিয়ে সব যাচাই করছে, Database এ আবার নিয়ম লেখার কী দরকার।
              </ContentParagraph>
              <ContentParagraph>
                দুই সপ্তাহে চারটা জিনিস ঘটল। Sales দলের দুজন আলাদা আলাদা করে একই কোড EID25 ঢোকালেন, একজন 25 শতাংশ দিয়ে,
                আরেকজন 30। Customer কোনটা পাবেন, সেটা নির্ভর করল App কোন Row আগে খুঁজে পায় তার উপর। তারপর একজন সহকর্মী একটা
                CSV ফাইল থেকে psql দিয়ে সরাসরি কোড Load করলেন, Website এর Form এর ধারেকাছেও না গিয়ে। সেই ফাইলে টাইপো: 25 এর
                জায়গায় 250। একটা কোডের নামই নেই, ঘরটা খালি। আর পূজার একটা অফারের শেষ তারিখ শুরুর তারিখের আগে, ফলে অফারটা
                বিজ্ঞাপনে আছে কিন্তু কোনোদিন চালু হয় না।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে খারাপটা ঘটল এক সন্ধ্যায়। একজন Customer 12000 টাকার একটা ট্যুরে BIG50 কোড লাগালেন। App হিসাব করল 12000
                থেকে 250 শতাংশ কম, মানে বিল দাঁড়াল মাইনাস 18000 টাকা। App সেটা ফেরতযোগ্য টাকা ধরে নিল। নিচের বক্সে ঠিক তানিমের
                Table টা বানানো আছে, সেই পাঁচটা Row সহ। চালিয়ে দেখুন Database একটা আপত্তিও করে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের নিয়মহীন Table"
              query={RAW_BOX}
              caption="পাঁচটা Row ই ঢুকে গেছে, একটা Error ও নেই। EID25 দুইবার, BIG50 এর পাশে price_for_12000 এর ঘরে -18000, একটা Row এর code NULL, আর PUJA10 শেষ হয় শুরুর আগে। Database এর চোখে সব ঠিক, কারণ তাকে কেউ বলেনি কোনটা ভুল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই ধরনের Table, শুধু প্রতিটা Column এর পাশে কয়েকটা শব্দ বেশি: NOT NULL, UNIQUE, CHECK। প্রথম Row টা ঠিকঠাক,
              দ্বিতীয়টা সেই 250 শতাংশের টাইপো। কোন লাইনে কী লেখা, সেটা এখনই বুঝতে হবে না, পুরো লেসন জুড়ে একটা একটা করে শিখবেন।
              আপাতত শুধু ফলাফলটা দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ভুল, এবার নিয়ম সহ"
              query={GUARDED_BOX}
              caption={`প্রথম INSERT সফল। দ্বিতীয়টায় ERROR: new row for relation "cons_promo_guarded" violates check constraint "cons_promo_guarded_percent_off_check", আর DETAIL এ সেই Row টা। 250 এর জায়গায় 25 লিখে আবার চালান: তখন UNIQUE আটকাবে না, কারণ কোডটা BIG50, EID25 না। এরপর দ্বিতীয় INSERT এর কোড বদলে EID25 করে দেখুন কে থামায়।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Form এর যাচাই কেন যথেষ্ট না",
          content: (
            <ContentParagraph>
              তানিমের ভুল ছিল একটা ধারণায়: সব Data একটা পথ দিয়েই আসবে। বাস্তবে আসে না। আজ Website, কাল Mobile App, পরশু একটা
              CSV Import, কোনো এক রাতে কেউ হাতে psql খুলে একটা Row ঠিক করবেন। প্রতিটা পথে আলাদা যাচাই লিখলে কোনো একটা পথে একদিন
              একটা নিয়ম বাদ পড়বেই। Database এর নিয়ম লেখা থাকে এক জায়গায়, আর সব পথ সেই এক জায়গা দিয়েই যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-constraint-is",
      subHeader: { index: "002", title: "What a Constraint Is" },
      title: <SectionTitle>Constraint: Table এর দরজায় দাঁড়ানো পাহারাদার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা অফিস ভবনের কথা ভাবুন। ভেতরে ঢোকার দরজা কয়েকটা: সামনের গেট, পেছনের গেট, পার্কিং থেকে লিফট। প্রতিটা দরজায়
                আলাদা লোক বসিয়ে আলাদা খাতায় নিয়ম লিখে দিলে একদিন একজন একটা নিয়ম ভুলে যাবেন। তার চেয়ে ভালো হলো ভেতরের একটাই
                জায়গায়, যেখান দিয়ে সবাইকে যেতে হয়, একজন পাহারাদার রাখা, যাঁর হাতে একটাই তালিকা। তিনি প্রত্যেককে একই তালিকা
                ধরে দেখেন, আর তালিকার বাইরে কেউ গেলে তাঁকে ফেরত পাঠান।
              </ContentParagraph>
              <ContentParagraph>
                Constraint হলো Database এর সেই পাহারাদার। CREATE TABLE এর সময় (অথবা পরে ALTER TABLE দিয়ে) আপনি Table এর গায়ে
                নিয়ম লিখে দেন। এরপর প্রতিটা INSERT আর প্রতিটা UPDATE এর সময় Database নিজে নতুন Row টা সেই নিয়মগুলো দিয়ে মেপে
                দেখে। মিললে Row জমা হয়, না মিললে পুরো Statement টা বাতিল আর একটা Error। কোনো App, কোনো Script, কোনো মানুষ এই
                পাহারা এড়িয়ে Table এ Row রাখতে পারে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RuleLayersDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তার মানে কি App এর যাচাই বাদ? না। App এর যাচাই থাকে মানুষের সুবিধার জন্য: Form এ লাল দাগ দিয়ে সাথে সাথে বলে দেওয়া
              যে ঘরটা খালি। Database এর Constraint থাকে Data এর নিরাপত্তার জন্য: যা কিছুই হোক, ভুল Row জমা হবে না। দুটো একসাথে
              থাকে, একটা আরেকটার বদলে না। এই লেসনের চারটা হাতিয়ার, পরের দুই লেসনের দুটো, আর Module 15 এর একটা মিলিয়ে PostgreSQL এর পুরো তালিকা এরকম:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "কী বলে", "উদাহরণ", "কোথায় শিখবেন"],
          rows: [
            ["NOT NULL", "এই ঘর খালি রাখা যাবে না", "code text NOT NULL", "এই লেসন"],
            ["DEFAULT", "মান না দিলে এটা বসবে (বাধা না, পূরণ)", "times_used integer DEFAULT 0", "এই লেসন"],
            ["UNIQUE", "এই মান বা মানের জোড়া দুইবার আসবে না", "UNIQUE (code)", "এই লেসন"],
            ["CHECK", "প্রতিটা Row এ এই শর্ত সত্য হতে হবে", "CHECK (percent_off BETWEEN 1 AND 50)", "এই লেসন"],
            ["PRIMARY KEY", "প্রতিটা Row এর একমাত্র পরিচয়, UNIQUE আর NOT NULL একসাথে", "booking_id ... PRIMARY KEY", "Lesson 08"],
            ["FOREIGN KEY", "এই মান অন্য Table এ থাকতেই হবে", "REFERENCES customers (customer_id)", "Lesson 09"],
            ["EXCLUDE", "দুটো Row এর মধ্যে ওভারল্যাপ চলবে না, যেমন একই গাইডের দুটো ট্যুর একই দিনে", "EXCLUDE USING gist (...)", "Module 15"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি এতদিন যে Island Tours Database পড়েছেন, তার গায়েও এমন নিয়ম লেখা আছে। PostgreSQL প্রতিটা Constraint মনে রাখে{" "}
              <code className={CODE}>pg_constraint</code> নামের একটা System Table এ। নিচের Query সেখান থেকে আটটা Sample Table এর
              UNIQUE আর CHECK নিয়মগুলো পড়ে। <code className={CODE}>contype</code> Column এ এক অক্ষরের সংকেত থাকে: c মানে CHECK, u
              মানে UNIQUE। <code className={CODE}>pg_get_constraintdef</code> নিয়মটা আবার SQL হিসেবে লিখে দেখায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sample Database এর নিজের নিয়ম"
              query={`SELECT conrelid::regclass AS table_name,
       conname,
       pg_get_constraintdef(oid) AS rule
FROM pg_constraint
WHERE conrelid::regclass::text IN ('destinations', 'guides', 'tours', 'customers',
                                   'departures', 'bookings', 'payments', 'reviews')
  AND contype IN ('c', 'u')
ORDER BY conname;`}
              caption="১২টা Row। bookings এ seats > 0 আর status এর তিনটা মান, reviews এ rating 1 থেকে 5 আর প্রতিটা Booking এ একটাই Review, customers এ Email একবারই। লক্ষ করুন BETWEEN 1 AND 5 লেখা নিয়মটা PostgreSQL নিজের ভাষায় (rating >= 1) AND (rating <= 5) করে রেখেছে, আর IN তালিকাটা = ANY (ARRAY[...])। মানে একই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সেই নিয়ম ভাঙার চেষ্টা করুন। Review এর rating 6 দেওয়া যায় কিনা দেখুন। এটা একটা ব্যর্থ INSERT, তাই Sample Data
              একটুও বদলাবে না: Row টা ঢোকার আগেই ফেরত যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sample Database এর নিয়ম ভাঙার চেষ্টা"
              query={`INSERT INTO reviews (booking_id, rating, created_at)
VALUES (13, 6, now());`}
              caption={`ERROR: new row for relation "reviews" violates check constraint "reviews_rating_check"। DETAIL এর লাইনে পুরো Row টা দেখা যায়, যেখানে 6 বসে আছে। SELECT count(*) FROM reviews; চালালে এখনো ১০, কিছুই জমা হয়নি।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConstraintAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির দুটো শব্দ এই লেসনে বারবার আসবে, তাই এখনই পরিষ্কার করে রাখা ভালো:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Column Constraint:</strong> Column এর নাম আর Type এর ঠিক পরেই লেখা নিয়ম, যেমন{" "}
                  <code className={CODE}>code text NOT NULL UNIQUE</code>। সাধারণত শুধু সেই Column এর কথা বলে।
                </ListItem>
                <ListItem>
                  <strong>Table Constraint:</strong> সব Column লেখা শেষ হওয়ার পরে, কমা দিয়ে আলাদা লাইনে লেখা নিয়ম, যেমন{" "}
                  <code className={CODE}>CHECK (ends_on &gt; starts_on)</code>। কয়েকটা Column একসাথে লাগলে এটাই স্বাভাবিক জায়গা।
                </ListItem>
                <ListItem>
                  <strong>CONSTRAINT নাম:</strong> যেকোনো নিয়মের আগে <code className={CODE}>CONSTRAINT promo_percent_range</code>{" "}
                  লিখে নিজের নাম দেওয়া যায়। না দিলে PostgreSQL নিজে একটা নাম বানায়। অংশ 010 এ দেখবেন নাম কেন গুরুত্বপূর্ণ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "not-null",
      subHeader: { index: "003", title: "NOT NULL" },
      title: <SectionTitle>NOT NULL: এই ঘর খালি রাখা যাবে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যাংকের ফর্মে কিছু ঘরের পাশে লাল তারা থাকে: নাম, জাতীয় পরিচয়পত্রের নম্বর, স্বাক্ষর। ওগুলো খালি রেখে জমা দিলে
                কাউন্টারের লোক ফর্ম ফেরত দেন। বাকি ঘর, যেমন দ্বিতীয় ফোন নম্বর, খালি থাকলেও চলে। NOT NULL হলো সেই লাল তারা।
              </ContentParagraph>
              <ContentParagraph>
                মনে করিয়ে দিই, NULL মানে &quot;জানা নেই&quot;, শূন্য না, খালি লেখাও না (Module 03 এর{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  NULL Logic
                </Link>{" "}
                লেসনে বিস্তারিত)। কোনো Column এ NOT NULL লিখলে Database কথা দেয় যে এই Column এর প্রতিটা ঘরে একটা জানা মান
                থাকবে। দুইভাবে কেউ NULL ঢোকানোর চেষ্টা করতে পারে: সরাসরি NULL লিখে, অথবা INSERT এ Column টা বাদ দিয়ে, যখন সেই
                Column এর কোনো DEFAULT নেই। দুই ক্ষেত্রেই একই Error।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT NULL কাজ করছে"
              query={`DROP TABLE IF EXISTS cons_nn_guests;
CREATE TABLE cons_nn_guests (
  full_name text NOT NULL,
  phone     text
);

INSERT INTO cons_nn_guests (full_name, phone) VALUES ('Nadia Islam', '+8801000000201');
INSERT INTO cons_nn_guests (full_name) VALUES ('Sabbir Hasan');
SELECT * FROM cons_nn_guests;
INSERT INTO cons_nn_guests (phone) VALUES ('+8801000000203');`}
              caption={`প্রথম দুটো INSERT সফল: Sabbir এর phone বাদ দেওয়া হয়েছে, তাই সেখানে NULL, আর phone এ কোনো নিয়ম নেই। SELECT এ ২টা Row। শেষ INSERT এ full_name বাদ, তাই ERROR: null value in column "full_name" of relation "cons_nn_guests" violates not-null constraint, সাথে DETAIL: Failing row contains (null, +8801000000203)।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Error টা খুঁটিয়ে পড়ুন, কারণ প্রতিটা অংশ কাজের। প্রথম লাইন বলে কোন Column আর কোন Table। DETAIL বলে Database যে
                Row টা জমা দিতে যাচ্ছিল সেটা দেখতে কেমন ছিল, Column এর ক্রমে। সেখানে null শব্দটা ঠিক সেই জায়গায়, যে ঘরটা খালি
                ছিল। অনেক Column এর বড় Table এ এই DETAIL দিয়েই বোঝা যায় কোন মানটা গোলমাল করছে।
              </ContentParagraph>
              <ContentParagraph>
                এখন একটা প্রশ্ন, যেটা অনেককে ধোঁকা দেয়: খালি লেখা, মানে <code className={CODE}>&apos;&apos;</code>, কি NULL? না।
                খালি লেখা একটা জানা মান, যার দৈর্ঘ্য শূন্য। তাই NOT NULL তাকে আটকায় না। শুধু স্পেস দেওয়া লেখাও আটকায় না। সত্যিকারের
                খালি নিষেধ করতে হলে NOT NULL এর সাথে একটা CHECK লাগে, যেটা লেখার দুই পাশের স্পেস কেটে দেখে কিছু বাকি থাকে কিনা।
                CHECK এর পুরো গল্প অংশ 008 এ, এখানে শুধু প্রয়োজনটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি লেখা NULL না"
              query={`DROP TABLE IF EXISTS cons_nn_codes;
CREATE TABLE cons_nn_codes (code text NOT NULL);
INSERT INTO cons_nn_codes VALUES (''), ('   ');
SELECT code, char_length(code) AS length, code IS NULL AS is_null
FROM cons_nn_codes;

DROP TABLE IF EXISTS cons_nn_codes2;
CREATE TABLE cons_nn_codes2 (
  code text NOT NULL CHECK (btrim(code) <> '')
);
INSERT INTO cons_nn_codes2 VALUES ('   ');`}
              caption={`প্রথম Table এ দুটো Row ই ঢুকেছে: length 0 আর 3, is_null দুটোতেই f। দ্বিতীয় Table এ btrim স্পেস কেটে দেখে কিছুই নেই, তাই ERROR: new row for relation "cons_nn_codes2" violates check constraint "cons_nn_codes2_code_check"।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন Column এ NOT NULL দেবেন",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                অভিজ্ঞ Developer দের একটা সহজ অভ্যাস আছে: ধরে নিন প্রতিটা Column NOT NULL, তারপর প্রতিটার জন্য প্রশ্ন করুন,
                &quot;এই তথ্যটা কি সত্যিই কখনো অজানা থাকতে পারে?&quot; উত্তর হ্যাঁ হলে তবেই NOT NULL বাদ দিন।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর customers Table ঠিক এভাবে বানানো: full_name, email, city সব NOT NULL, কিন্তু phone খালি থাকতে পারে,
                কারণ কেউ কেউ ফোন নম্বর দিতে চান না। সেজন্যই Sample Data তে পাঁচজন Customer এর phone NULL। অন্যদিকে tours এর guide_id
                খালি থাকতে পারে, কারণ নতুন ট্যুরের গাইড এখনো ঠিক না হতেই পারে, যেমন Ratargul।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "PostgreSQL 18 এ NOT NULL এরও নাম আছে",
          content: (
            <ContentParagraph>
              PostgreSQL 18 থেকে NOT NULL ও বাকি Constraint এর মতো pg_constraint এ জমা থাকে, contype n দিয়ে, আর নাম না দিলে তার নাম হয়
              Table_Column_not_null, যেমন <code className={CODE}>cons_nn_guests_full_name_not_null</code>। নিজের নাম দিতে চাইলে{" "}
              <code className={CODE}>full_name text CONSTRAINT guest_name_required NOT NULL</code>। তবে Error এর বার্তা এখনো নাম না, Column
              এর নামই বলে। পুরনো Version এ NOT NULL ছিল শুধু Column এর একটা চিহ্ন, তাই অনেক পুরনো লেখায় পাবেন NOT NULL এর কোনো নাম
              হয় না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              starter={`DROP TABLE IF EXISTS cons_ex1_pickups;
-- এখানে CREATE TABLE cons_ex1_pickups লিখুন


-- নিচের Query টা বদলাবেন না, এটাই আপনার Table পরীক্ষা করে
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cons_ex1_pickups'
ORDER BY ordinal_position;`}
              task={
                <>
                  Island Tours ঢাকার কয়েকটা জায়গা থেকে যাত্রী তোলে। <code className={CODE}>cons_ex1_pickups</code> নামে একটা Table
                  বানান, এই ক্রমে তিনটা Column: <code className={CODE}>place</code> (text, খালি রাখা যাবে না),{" "}
                  <code className={CODE}>landmark</code> (text, খালি থাকতে পারে), <code className={CODE}>pickup_time</code> (time, খালি
                  রাখা যাবে না)। Starter এর শেষের Query টা শেষেই রাখুন।
                </>
              }
              hint={
                <>
                  দুটো Column এর Type এর পরে NOT NULL, landmark এর পরে কিছু না। পরীক্ষার Query তে is_nullable এর ঘরে NO আর YES
                  দেখবেন, আর time এর data_type দেখাবে time without time zone।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('place', 'text', 'NO'),
  ('landmark', 'text', 'YES'),
  ('pickup_time', 'time without time zone', 'NO')
) AS v(column_name, data_type, is_nullable);`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনে আপনি অনেক নিয়ম বানাবেন আর প্রতিটা ভাঙার চেষ্টা করবেন। কিন্তু Query বক্স প্রথম Error এই থেমে যায়, তাই
                একবারে একটার বেশি ভুল INSERT দেখা যায় না। এর জন্য একটা ছোট পরীক্ষার যন্ত্র বানিয়ে নিই: নাম{" "}
                <code className={CODE}>cons_try</code>। আপনি তাকে একটা SQL Statement লেখা হিসেবে দেবেন। সে Statement টা চালাবে।
                সফল হলে বলবে ok, আর কোনো নিয়ম থামালে বলবে সেই Error এর পাঁচ অক্ষরের Code, যার নাম SQLSTATE।
              </ContentParagraph>
              <ContentParagraph>
                যন্ত্রটা ভেতরে কীভাবে কাজ করে, অর্থাৎ Function কীভাবে লেখে, সেটা শিখবেন Module 14 এর{" "}
                <Link href="/sql/topic/sql-functions" className={LINK}>
                  SQL Functions
                </Link>{" "}
                লেসনে। আজ এটাকে ক্যালকুলেটরের মতো ব্যবহার করুন। আর একটা নতুন লেখা চোখে পড়বে:{" "}
                <code className={CODE}>$$ ... $$</code>। দুটো ডলার চিহ্নের মাঝের সবকিছু একটা Text, ঠিক single quote এর মতো, শুধু ভেতরে
                single quote নিশ্চিন্তে লেখা যায়। তাই একটা পুরো INSERT কে আমরা $$ দিয়ে ঘিরে Text বানাতে পারি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পরীক্ষার যন্ত্র cons_try"
              query={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_nn_guests;
CREATE TABLE cons_nn_guests (
  full_name text NOT NULL,
  phone     text
);

SELECT attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_nn_guests (full_name) VALUES ('Rumana Akter')$$),
  (2, $$INSERT INTO cons_nn_guests (full_name) VALUES (NULL)$$),
  (3, $$INSERT INTO cons_nn_guests (phone) VALUES ('+8801000000204')$$),
  (4, $$INSERT INTO cons_nn_guests (full_name, phone) VALUES ('Joy Das', NULL)$$)
) AS t(attempt, stmt)
ORDER BY attempt;

SELECT * FROM cons_nn_guests;`}
              caption="প্রথম Table এ চারটা চেষ্টা: 1 ok, 2 আর 3 দুটোই 23502, 4 ok। 23502 হলো NOT NULL ভাঙার SQLSTATE। শেষের SELECT প্রমাণ করে শুধু Rumana আর Joy ঢুকেছেন, Joy এর phone NULL, যেটা এখানে বৈধ। ব্যর্থ চেষ্টাগুলোর কোনো চিহ্ন Table এ নেই।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "default",
      subHeader: { index: "004", title: "DEFAULT" },
      title: <SectionTitle>DEFAULT: মান না দিলে যা বসবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক Online ফর্মে দেশের ঘরে আগে থেকেই Bangladesh লেখা থাকে। বেশিরভাগ মানুষ ঘরটা ছুঁয়েও দেখেন না, আর যিনি অন্য দেশের,
                তিনি বদলে নেন। DEFAULT ঠিক এটাই: INSERT এ কোনো Column এর মান না দিলে Database নিজে যে মান বসিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                একটা কথা আগেই পরিষ্কার করি। DEFAULT আসলে কোনো বাধা না, কাউকে ফেরতও পাঠায় না। এটা খালি জায়গা পূরণ করে। PostgreSQL এর
                Documentation ও একে Constraint এর অধ্যায়ে না রেখে আলাদা করে Default Values বলে। তবু সবাই একে NOT NULL এর সাথে
                শেখায়, কারণ দুটো প্রায় সবসময় জোড়ায় আসে: &quot;এই ঘর খালি থাকবে না, আর কেউ কিছু না দিলে এটা বসবে।&quot;
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ আপনি ইতিমধ্যে পাঁচটা DEFAULT দেখেছেন: customers এর country তে Bangladesh, tours এর is_active এ true, আর
                bookings এর booked_at, customers এর joined_at ও tours এর created_at এ now()। তিনটা নিয়ম মনে রাখুন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Column বাদ দিলে DEFAULT বসে।</strong> INSERT এর Column তালিকায় নামটাই না থাকলে।
                </ListItem>
                <ListItem>
                  <strong>নিজে NULL লিখলে NULL ই বসে।</strong> DEFAULT তখন চুপ। আপনি একটা মান দিয়েছেন, সেটা NULL হলেও। সেই Column এ NOT NULL
                  থাকলে তখন Error।
                </ListItem>
                <ListItem>
                  <strong>DEFAULT শব্দটাও লেখা যায়।</strong> VALUES এর ভেতরে কোনো জায়গায় <code className={CODE}>DEFAULT</code> লিখলে সেখানে সেই
                  Column এর DEFAULT বসে। সব Column এর মান লিখছেন অথচ একটার জন্য DEFAULT চান, তখন কাজে লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনভাবে DEFAULT, আর একটা ফাঁদ"
              query={`DROP TABLE IF EXISTS cons_df_guests;
CREATE TABLE cons_df_guests (
  full_name text    NOT NULL,
  city      text    DEFAULT 'Dhaka',
  country   text    NOT NULL DEFAULT 'Bangladesh',
  seats     integer NOT NULL DEFAULT 1
);

INSERT INTO cons_df_guests (full_name) VALUES ('Nadia Islam');
INSERT INTO cons_df_guests (full_name, city) VALUES ('Tanvir Ahmed', NULL);
INSERT INTO cons_df_guests VALUES ('Shila Roy', DEFAULT, DEFAULT, 3);
SELECT * FROM cons_df_guests;

INSERT INTO cons_df_guests (full_name, seats) VALUES ('Mitu Rahman', NULL);`}
              caption={`SELECT এ ৩টা Row। Nadia: Dhaka, Bangladesh, 1, সব DEFAULT থেকে। Tanvir: city তে NULL, কারণ NULL নিজে লেখা হয়েছে, আর city তে NOT NULL নেই। Shila: DEFAULT শব্দ দিয়ে Dhaka আর Bangladesh, seats নিজের দেওয়া 3। শেষ INSERT এ seats এ নিজে NULL লেখা, তাই DEFAULT 1 বসেনি: ERROR: null value in column "seats" of relation "cons_df_guests" violates not-null constraint।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DEFAULT এ শুধু স্থির মান না, একটা Expression ও দেওয়া যায়, যেটা প্রতিটা INSERT এর মুহূর্তে হিসাব হয়। সবচেয়ে চেনা উদাহরণ{" "}
                <code className={CODE}>DEFAULT now()</code>: Row তৈরির সময়টা নিজে থেকে লেখা হয়ে যায়। Island Tours এর booked_at ঠিক এভাবেই
                ভরে। কিন্তু DEFAULT এর Expression অন্য Column পড়তে পারে না। ধরুন আপনি চাইলেন sale_bdt এর DEFAULT হোক price_bdt এর 90
                শতাংশ। PostgreSQL সেটা Table বানানোর সময়েই নিষেধ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DEFAULT now(), আর যা DEFAULT পারে না"
              query={`DROP TABLE IF EXISTS cons_df_log;
CREATE TABLE cons_df_log (
  note       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO cons_df_log (note) VALUES ('first');
INSERT INTO cons_df_log (note) VALUES ('second');
SELECT note, created_at FROM cons_df_log;

SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'cons_df_log'
ORDER BY ordinal_position;

CREATE TABLE cons_df_bad (
  price_bdt numeric NOT NULL,
  sale_bdt  numeric DEFAULT price_bdt * 0.9
);`}
              caption="প্রথম SELECT এ দুটো Row, created_at এ আজকের তারিখ আর ঠিক যে মুহূর্তে আপনি চালালেন সেই সময়, তাই আপনার পর্দায় সংখ্যাটা অন্যরকম হবে। দ্বিতীয় SELECT দেখায় column_default: note এ NULL (কোনো DEFAULT নেই), created_at এ now()। শেষ Statement এ ERROR: cannot use column reference in DEFAULT expression।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DEFAULT বদলালে পুরনো Row বদলায় না",
          content: (
            <ContentParagraph>
              DEFAULT শুধু ভবিষ্যতের INSERT এর জন্য। পরে কোনোদিন DEFAULT 100 কে 200 করলে আগের Row গুলোতে 100 ই থাকবে, কারণ সেগুলোতে
              মানটা তখনই লেখা হয়ে গিয়েছিল। DEFAULT বদলানো হয় ALTER TABLE দিয়ে, সেটা Lesson 10{" "}
              <Link href="/sql/topic/alter-table" className={LINK}>
                ALTER TABLE
              </Link>{" "}
              এ। আর যে Column এর মান অন্য Column থেকে হিসাব হয়, যেমন sale_bdt, তার জন্য আলাদা ব্যবস্থা আছে: Generated Column, Module 10 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              starter={`DROP TABLE IF EXISTS cons_ex2_guests;
-- এখানে CREATE TABLE cons_ex2_guests লিখুন


-- নিচের দুই লাইন বদলাবেন না
INSERT INTO cons_ex2_guests (full_name) VALUES ('Nadia Islam');
SELECT full_name, city, country, seats FROM cons_ex2_guests;`}
              task={
                <>
                  <code className={CODE}>cons_ex2_guests</code> নামে Table বানান, চারটা Column:{" "}
                  <code className={CODE}>full_name</code> text খালি রাখা যাবে না; <code className={CODE}>city</code> text, খালি রাখা যাবে
                  না, মান না দিলে Dhaka; <code className={CODE}>country</code> text, খালি রাখা যাবে না, মান না দিলে Bangladesh;{" "}
                  <code className={CODE}>seats</code> integer, খালি রাখা যাবে না, মান না দিলে 1। Starter এর শেষের দুই লাইন শুধু নাম দিয়ে
                  একটা Row ঢোকায় আর পড়ে।
                </>
              }
              hint={
                <>
                  প্রতিটা Column এ <code className={CODE}>NOT NULL DEFAULT ...</code>। Text এর DEFAULT single quote এ, সংখ্যার DEFAULT
                  quote ছাড়া। ঠিক হলে একটা Row: Nadia Islam, Dhaka, Bangladesh, 1।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('Nadia Islam', 'Dhaka', 'Bangladesh', 1)
) AS v(full_name, city, country, seats);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "unique",
      subHeader: { index: "005", title: "UNIQUE" },
      title: <SectionTitle>UNIQUE: একই মান দুইবার না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা মোবাইল নম্বর দুজন মানুষের হতে পারে না, একটা গাড়ির নম্বর প্লেট দুটো গাড়িতে থাকে না। কিছু তথ্যের স্বভাবই এমন যে
                সেটা একবারই আসবে। UNIQUE সেই কথাটা Database কে জানায়: এই Column এর কোনো দুটো Row এ একই মান থাকবে না। Promo Code ঠিক
                এমন তথ্য। EID25 যদি দুইবার থাকে, App জানে না কোনটা আসল।
              </ContentParagraph>
              <ContentParagraph>
                লেখার দুটো ধরন আছে, কাজ একই। Column এর পাশে <code className={CODE}>code text UNIQUE</code>, অথবা সব Column এর পরে{" "}
                <code className={CODE}>UNIQUE (code)</code>। নতুন Row এর মান যদি আগের কোনো Row এর সাথে মিলে যায়, Database সেটা থামায়
                আর Error এর DETAIL এ বলে দেয় কোন মানটা আগেই আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই কোড দুইবার"
              query={`DROP TABLE IF EXISTS cons_uq_codes;
CREATE TABLE cons_uq_codes (
  code        text    NOT NULL UNIQUE,
  percent_off integer NOT NULL
);

INSERT INTO cons_uq_codes VALUES ('EID25', 25);

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'cons_uq_codes';

INSERT INTO cons_uq_codes VALUES ('EID25', 30);`}
              caption={`প্রথম INSERT সফল। মাঝের SELECT এ একটা Row: cons_uq_codes_code_key নামের একটা UNIQUE INDEX, যেটা আপনি বানাননি। শেষ INSERT এ ERROR: duplicate key value violates unique constraint "cons_uq_codes_code_key", আর DETAIL: Key (code)=(EID25) already exists.`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাঝের Query টা একটা গোপন কথা ফাঁস করে। প্রতিটা নতুন Row এর জন্য পুরো Table পড়ে মিল খোঁজা ধীর হতো, বিশেষ করে লাখ
                লাখ Row এ। তাই UNIQUE লিখলেই PostgreSQL নিজে থেকে একটা Unique Index বানায়, বইয়ের শেষের সূচিপত্রের মতো একটা সাজানো
                তালিকা, যেখানে একটা মান আছে কিনা মুহূর্তে দেখা যায়। Documentation এর ভাষায়, UNIQUE যোগ করলে সেই Column বা Column
                গুলোর উপর একটা Unique B-tree Index তৈরি হয়। Index কী আর কীভাবে কাজ করে, পুরোটা Module 13 এর{" "}
                <Link href="/sql/topic/btree-intuition" className={LINK}>
                  B-tree Intuition
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা ফাঁদ। PostgreSQL এ লেখার তুলনা অক্ষর ধরে ধরে হয়, বড় হাতের আর ছোট হাতের অক্ষর আলাদা। তাই EID25, eid25 আর
                Eid25 তিনটা আলাদা মান, UNIQUE তিনটাকেই ঢুকতে দেয়। অথচ Customer এর কাছে তিনটাই একই কোড।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় হাত, ছোট হাত"
              query={`DROP TABLE IF EXISTS cons_uq_case;
CREATE TABLE cons_uq_case (code text NOT NULL UNIQUE);
INSERT INTO cons_uq_case VALUES ('EID25'), ('eid25'), ('Eid25');
SELECT code FROM cons_uq_case;

DROP TABLE IF EXISTS cons_uq_lower;
CREATE TABLE cons_uq_lower (code text NOT NULL);
CREATE UNIQUE INDEX cons_uq_lower_key ON cons_uq_lower (lower(code));
INSERT INTO cons_uq_lower VALUES ('EID25');
INSERT INTO cons_uq_lower VALUES ('eid25');`}
              caption={`প্রথম Table এ তিনটা Row ই ঢুকেছে। দ্বিতীয় Table এ UNIQUE এর বদলে lower(code) এর উপর একটা Unique Index, মানে ছোট হাতের রূপটা দুইবার আসবে না। তাই eid25 থামে: ERROR: duplicate key value violates unique constraint "cons_uq_lower_key", DETAIL: Key (lower(code))=(eid25) already exists.`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এই সমস্যার তিনটা পরিচিত সমাধান, প্রতিটার নিজের জায়গা:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটাই রূপে রাখা:</strong> নিয়ম করে দিন কোড সবসময় বড় হাতের, একটা CHECK দিয়ে। তখন eid25 ঢোকার আগেই CHECK থামাবে। এই
                  লেসনের শেষের Promo Table ঠিক এটাই করে।
                </ListItem>
                <ListItem>
                  <strong>Expression এর উপর Unique Index:</strong> উপরের বক্সের মতো lower(code)। মানুষ যেভাবে খুশি লিখুক, তুলনা হবে ছোট হাতে।
                  এটা আর Constraint না, Index, তাই Module 13 এর{" "}
                  <Link href="/sql/topic/partial-expression-covering" className={LINK}>
                    Partial, Expression and Covering Indexes
                  </Link>{" "}
                  লেসনে বিস্তারিত।
                </ListItem>
                <ListItem>
                  <strong>citext Type:</strong> এমন একটা text Type, যার তুলনাই হয় বড় ছোট হাত না দেখে। সেটা এই মডিউলের{" "}
                  <Link href="/sql/topic/text-types" className={LINK}>
                    Text Types
                  </Link>{" "}
                  লেসনের বিষয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "unique-and-null",
      subHeader: { index: "006", title: "UNIQUE and NULL" },
      title: <SectionTitle>দুটো NULL কি একই? UNIQUE এর উত্তর: না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরুন অফিসের Staff Table এ email UNIQUE, কিন্তু খালি থাকতে পারে, কারণ নতুন কেউ যোগ দেওয়ার প্রথম দিন তাঁর অফিসের Email
                তৈরি হয়নি। এখন দুজন নতুন মানুষ একই দিনে যোগ দিলেন। দুজনেরই email NULL। UNIQUE কি দ্বিতীয়জনকে থামাবে?
              </ContentParagraph>
              <ContentParagraph>
                উত্তর বুঝতে NULL এর অর্থে ফিরে যান: অজানা। Joy এর Email অজানা, Mitu এর Email ও অজানা। দুটো অজানা জিনিস কি সমান? কেউ
                বলতে পারে না। হয়তো পরে দুজনের আলাদা Email হবে। তাই PostgreSQL এর Default নিয়মে UNIQUE এর চোখে দুটো NULL সমান না,
                দুজনেই ঢোকেন। Documentation এর ভাষায়, Unique Constraint থাকলেও এমন Row রাখা সম্ভব যার Constrained Column গুলোর অন্তত
                একটায় NULL, আর এই আচরণ বদলানো যায় NULLS NOT DISTINCT দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                কখনো কখনো আপনি উল্টোটাই চান: &quot;খালি থাকতে পারে, কিন্তু খালি Row একটাই থাকবে।&quot; যেমন প্রতিটা Tour এর একটাই Default
                ছবি, অথবা কোনো Setting Table এ কোনো একটা মালিকহীন Row একটাই। এর জন্য PostgreSQL 15 এ এসেছে{" "}
                <code className={CODE}>UNIQUE NULLS NOT DISTINCT</code>: এখানে NULL কেও একটা মান ধরা হয়, তাই দ্বিতীয় NULL নকল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UniqueNullsSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Default নিয়ম আর NULLS NOT DISTINCT"
              query={`DROP TABLE IF EXISTS cons_nd_staff;
CREATE TABLE cons_nd_staff (
  full_name text NOT NULL,
  email     text UNIQUE
);
INSERT INTO cons_nd_staff VALUES
  ('Rina', 'rina@mail.example'),
  ('Joy',  NULL),
  ('Mitu', NULL);
SELECT * FROM cons_nd_staff;

DROP TABLE IF EXISTS cons_nd_staff2;
CREATE TABLE cons_nd_staff2 (
  full_name text NOT NULL,
  email     text UNIQUE NULLS NOT DISTINCT
);
INSERT INTO cons_nd_staff2 VALUES ('Rina', 'rina@mail.example'), ('Joy', NULL);
INSERT INTO cons_nd_staff2 VALUES ('Mitu', NULL);`}
              caption={`প্রথম Table এ ৩টা Row: Joy আর Mitu দুজনেরই email NULL, কোনো আপত্তি নেই। দ্বিতীয় Table এ Mitu থামেন: ERROR: duplicate key value violates unique constraint "cons_nd_staff2_email_key", DETAIL: Key (email)=(null) already exists. লক্ষ করুন DETAIL এ null, মানে NULL টাই এখানে নকল মান।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "অন্য Database এ নিয়ম আলাদা হতে পারে",
          content: (
            <ContentParagraph>
              Documentation নিজেই সাবধান করে: SQL Standard UNIQUE এ NULL এর আচরণ নির্দিষ্ট করেনি, প্রতিটা Database নিজের মতো ঠিক করে।
              MySQL ও PostgreSQL এর Default এর মতো একাধিক NULL রাখতে দেয়, কিন্তু NULLS NOT DISTINCT বোঝে না (অংশ 013)। তাই যে App অনেক
              Database এ চলবে, সেখানে এই আচরণের উপর ভরসা করার আগে প্রতিটায় পরীক্ষা করে নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              starter={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_ex3_staff;
-- এখানে CREATE TABLE cons_ex3_staff লিখুন


-- নিচের Query টা বদলাবেন না
SELECT attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_ex3_staff VALUES ('Rina', 'rina@mail.example')$$),
  (2, $$INSERT INTO cons_ex3_staff VALUES ('Rina Akter', 'rina@mail.example')$$),
  (3, $$INSERT INTO cons_ex3_staff VALUES ('Joy', NULL)$$),
  (4, $$INSERT INTO cons_ex3_staff VALUES ('Mitu', NULL)$$),
  (5, $$INSERT INTO cons_ex3_staff VALUES (NULL, 'new@mail.example')$$)
) AS t(attempt, stmt)
ORDER BY attempt;`}
              task={
                <>
                  <code className={CODE}>cons_ex3_staff</code> Table বানান, দুটো Column এই ক্রমে:{" "}
                  <code className={CODE}>full_name</code> text খালি রাখা যাবে না, আর <code className={CODE}>email</code> text, খালি
                  থাকতে পারে, কিন্তু কোনো Email দুইবার আসবে না, আর খালি Email ও পুরো Table এ একবারের বেশি না। শেষের পরীক্ষা পাঁচটা
                  INSERT চেষ্টা করে, ঠিক হলে ফলাফল: ok, 23505, ok, 23505, 23502।
                </>
              }
              hint={
                <>
                  সাধারণ UNIQUE দিলে চার নম্বর চেষ্টাও ok হয়ে যাবে, কারণ দুটো NULL তখন আলাদা।{" "}
                  <code className={CODE}>email text UNIQUE NULLS NOT DISTINCT</code> লিখুন।
                </>
              }
              solution={`SELECT * FROM (VALUES
  (1, 'ok'),
  (2, '23505'),
  (3, 'ok'),
  (4, '23505'),
  (5, '23502')
) AS v(attempt, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "multi-column-unique",
      subHeader: { index: "007", title: "Multi-column UNIQUE" },
      title: <SectionTitle>জোড়া হিসেবে UNIQUE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সিনেমা হলের টিকিটের কথা ভাবুন। সিট নম্বর A5 প্রতিদিনই বিক্রি হয়, তারিখ 1 December এ শত শত টিকিট বিক্রি হয়। কিন্তু
                1 December এর A5 একটাই। আলাদা করে সিট নম্বর UNIQUE না, তারিখও না। UNIQUE হলো দুটোর জোড়া।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর departures এ ঠিক এমন একটা নিয়ম থাকা উচিত: একটা Tour একই দিনে দুইবার ছাড়ে না। Tour 1 এর অনেক Departure,
                1 December এ অনেক Tour ছাড়তে পারে, কিন্তু Tour 1 আর 1 December এর জোড়া একবারই। এই নিয়ম একটা Column এর পাশে লেখা যায় না,
                কারণ কথা দুটো Column এর। তাই এটা Table Constraint:{" "}
                <code className={CODE}>UNIQUE (tour_id, starts_on)</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Tour আর দিনের জোড়া"
              query={`DROP TABLE IF EXISTS cons_mc_slots;
CREATE TABLE cons_mc_slots (
  tour_id   integer NOT NULL,
  starts_on date    NOT NULL,
  seats     integer NOT NULL,
  UNIQUE (tour_id, starts_on)
);

INSERT INTO cons_mc_slots VALUES
  (1, '2026-12-01', 20),
  (1, '2026-12-08', 20),
  (2, '2026-12-01', 30);
SELECT * FROM cons_mc_slots ORDER BY tour_id, starts_on;

INSERT INTO cons_mc_slots VALUES (1, '2026-12-01', 12);`}
              caption={`SELECT এ ৩টা Row: tour_id 1 দুইবার, 2026-12-01 দুইবার, তবু কোনো জোড়া দুইবার না। শেষ INSERT এ সেই একই জোড়া: ERROR: duplicate key value violates unique constraint "cons_mc_slots_tour_id_starts_on_key", DETAIL: Key (tour_id, starts_on)=(1, 2026-12-01) already exists. seats আলাদা হলেও কিছু যায় আসে না, নিয়মটা শুধু জোড়ার।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নামটাও খেয়াল করুন: নাম না দিলে PostgreSQL Table, প্রতিটা Column আর key জুড়ে নাম বানায়, তাই এখানে
              cons_mc_slots_tour_id_starts_on_key। এবার নিচের Lab এ নিজে Departure যোগ করে দেখুন কোনটা ঢোকে আর কোনটা থামে। তারপর NULL এর
              নিয়ম বদলে দেখুন একই খেলা কীভাবে বদলায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UniquePairLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এর NULL এর ঘটনাটা জোড়ার UNIQUE এ আরও বিপজ্জনক, কারণ জোড়ার একটা অংশ NULL হলেই পুরো জোড়া &quot;অজানা&quot; হয়ে যায়, আর তখন
              অন্য কোনো জোড়ার সাথে মেলে না। নিচের বক্সে একই জোড়া (1, NULL) তিনবার ঢোকানো হয়েছে। এজন্যই জোড়ার UNIQUE এর Column গুলোতে
              প্রায় সবসময় NOT NULL ও দেওয়া হয়, উপরের cons_mc_slots এর মতো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়ায় একটা NULL থাকলে"
              query={`DROP TABLE IF EXISTS cons_mc_null;
CREATE TABLE cons_mc_null (
  tour_id   integer,
  starts_on date,
  UNIQUE (tour_id, starts_on)
);
INSERT INTO cons_mc_null VALUES (1, NULL), (1, NULL), (1, NULL);
SELECT count(*) FROM cons_mc_null;`}
              caption="count 3। তিনটা Row দেখতে হুবহু একই, তবু UNIQUE একটাকেও থামায়নি, কারণ প্রতিটা জোড়ায় starts_on অজানা। এখানে NULLS NOT DISTINCT দিলে দ্বিতীয় Row থেকেই 23505 আসত, আর NOT NULL দিলে প্রথম Row ই ঢুকত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              starter={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_ex4_guide_days;
-- এখানে CREATE TABLE cons_ex4_guide_days লিখুন


-- নিচের Query টা বদলাবেন না
SELECT attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_ex4_guide_days VALUES (1, '2026-12-01')$$),
  (2, $$INSERT INTO cons_ex4_guide_days VALUES (1, '2026-12-02')$$),
  (3, $$INSERT INTO cons_ex4_guide_days VALUES (2, '2026-12-01')$$),
  (4, $$INSERT INTO cons_ex4_guide_days VALUES (1, '2026-12-01')$$),
  (5, $$INSERT INTO cons_ex4_guide_days VALUES (3, NULL)$$)
) AS t(attempt, stmt)
ORDER BY attempt;`}
              task={
                <>
                  একজন গাইড একই দিনে দুটো ট্যুরে যেতে পারেন না। <code className={CODE}>cons_ex4_guide_days</code> Table বানান, দুটো
                  Column এই ক্রমে: <code className={CODE}>guide_id</code> integer আর <code className={CODE}>work_on</code> date, দুটোই
                  খালি রাখা যাবে না, আর একই গাইড আর একই দিনের জোড়া দুইবার আসবে না। ঠিক হলে পরীক্ষার ফল: ok, ok, ok, 23505, 23502।
                </>
              }
              hint={
                <>
                  দুটো Column এ NOT NULL, আর সব Column এর পরে কমা দিয়ে <code className={CODE}>UNIQUE (guide_id, work_on)</code>। দুটো
                  Column এ আলাদা আলাদা UNIQUE দিলে দুই নম্বর চেষ্টাই থেমে যাবে, কারণ guide_id 1 তখন একবারই চলবে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  (1, 'ok'),
  (2, 'ok'),
  (3, 'ok'),
  (4, '23505'),
  (5, '23502')
) AS v(attempt, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "check-on-a-column",
      subHeader: { index: "008", title: "CHECK on a Column" },
      title: <SectionTitle>CHECK: প্রতিটা Row কে একটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NOT NULL আর UNIQUE দুটোই খুব নির্দিষ্ট কথা বলে: খালি না, দুইবার না। বাকি সব নিয়মের জন্য আছে CHECK। CHECK এর ভেতরে
                আপনি একটা শর্ত লেখেন, ঠিক WHERE এর মতো, যার উত্তর হয় true বা false। প্রতিটা নতুন Row এর জন্য Database সেই শর্তটা
                হিসাব করে। ট্রেনের টিকিট চেকারের মতো ভাবুন, যিনি প্রত্যেক যাত্রীকে একই প্রশ্ন করেন: &quot;টিকিট আছে?&quot;
              </ContentParagraph>
              <ContentParagraph>
                ছাড়ের শতাংশ 1 থেকে 50 এর মধ্যে, সিট শূন্যের বেশি, দাম ঋণাত্মক না, status তিনটা মানের একটা: সবই CHECK। Island Tours এর
                bookings এ লেখা আছে <code className={CODE}>CHECK (seats &gt; 0)</code> আর{" "}
                <code className={CODE}>CHECK (status IN (&apos;pending&apos;, &apos;confirmed&apos;, &apos;cancelled&apos;))</code>। কিন্তু
                CHECK এর একটা তৃতীয় উত্তরও আছে, আর সেটাই এই লেসনের সবচেয়ে বড় ফাঁদ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CheckOutcomeDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Documentation এর ভাষায়, Check Constraint সন্তুষ্ট হয় যদি শর্তটা true অথবা NULL হয়। NULL BETWEEN 1 AND 50 এর উত্তর true ও
              না, false ও না, অজানা। CHECK শুধু false কে থামায়, তাই অজানা পার পেয়ে যায়। নিচের বক্সে ঠিক এটাই দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CHECK থামায় false, ছেড়ে দেয় NULL"
              query={`DROP TABLE IF EXISTS cons_ck_promos;
CREATE TABLE cons_ck_promos (
  code        text    NOT NULL,
  percent_off integer CHECK (percent_off BETWEEN 1 AND 50)
);

INSERT INTO cons_ck_promos VALUES ('EID25', 25);
INSERT INTO cons_ck_promos VALUES ('NOPCT', NULL);
SELECT * FROM cons_ck_promos;

INSERT INTO cons_ck_promos VALUES ('BIG50', 250);`}
              caption={`SELECT এ ২টা Row: EID25 এর 25, আর NOPCT এর percent_off NULL। CHECK থাকা সত্ত্বেও NULL ঢুকেছে। শেষ INSERT এ ERROR: new row for relation "cons_ck_promos" violates check constraint "cons_ck_promos_percent_off_check"। নাম না দেওয়ায় PostgreSQL নাম বানিয়েছে Table_Column_check।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "CHECK এর সাথে প্রায় সবসময় NOT NULL",
          content: (
            <ContentParagraph>
              যে Column খালি থাকতে পারে না, সেখানে CHECK একা যথেষ্ট না। লিখুন{" "}
              <code className={CODE}>percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 50)</code>। NOT NULL আগে খালিকে থামায়,
              তারপর CHECK সীমা দেখে। দুটো মিলে কথাটা পুরো হয়: &quot;একটা মান থাকতেই হবে, আর সেটা 1 থেকে 50 এর মধ্যে।&quot;
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CHECK এর ভেতরে প্রায় যেকোনো Expression চলে, যা একই Row এর Column পড়ে: তুলনা, BETWEEN, IN তালিকা, লেখার দৈর্ঘ্য, এমনকি
                Module 04 এর{" "}
                <Link href="/sql/topic/regular-expressions" className={LINK}>
                  Regular Expression
                </Link>
                । কোড সবসময় বড় হাতের অক্ষর আর সংখ্যায়, চার থেকে বারো অক্ষর, এই নিয়মটা একটা regex দিয়েই লেখা যায়, যেটা আগের অংশের বড়
                হাত ছোট হাতের সমস্যাও মিটিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                IN দিয়ে মানের তালিকা বেঁধে দেওয়ার আরও দুটো উপায় আছে: ENUM Type আর একটা আলাদা Lookup Table। কোনটা কখন ভালো, সেই তুলনা
                এই মডিউলের{" "}
                <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                  Boolean, UUID and Enum
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
              title="CHECK এর ভেতরে নানা রকম শর্ত"
              query={`DROP TABLE IF EXISTS cons_ck_variety;
CREATE TABLE cons_ck_variety (
  code   text NOT NULL CHECK (code ~ '^[A-Z0-9]{4,12}$'),
  method text NOT NULL CHECK (method IN ('bkash', 'nagad', 'card')),
  note   text CHECK (char_length(note) <= 20)
);

INSERT INTO cons_ck_variety VALUES ('EID25', 'bkash', 'ঈদের অফার');
INSERT INTO cons_ck_variety VALUES ('PUJA10', 'nagad', NULL);
SELECT * FROM cons_ck_variety;

INSERT INTO cons_ck_variety VALUES ('WINTER15', 'cash', NULL);`}
              caption={`SELECT এ ২টা Row। ঈদের অফার লেখাটা বাংলায় নয় অক্ষর, char_length অক্ষর গোনে, Byte না, তাই 20 এর নিচে। PUJA10 এর note NULL, char_length(NULL) <= 20 অজানা, তাই পাস। শেষ INSERT এ cash তালিকায় নেই: ERROR: new row for relation "cons_ck_variety" violates check constraint "cons_ck_variety_method_check"।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_ex5_boats;
-- এখানে CREATE TABLE cons_ex5_boats লিখুন


-- নিচের Query টা বদলাবেন না
SELECT attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_ex5_boats VALUES ('Sea Bird', 40, 100)$$),
  (2, $$INSERT INTO cons_ex5_boats VALUES ('Gangchil', 0, 50)$$),
  (3, $$INSERT INTO cons_ex5_boats VALUES ('Dolphin', 41, NULL)$$),
  (4, $$INSERT INTO cons_ex5_boats VALUES ('Kingfisher', NULL, 20)$$),
  (5, $$INSERT INTO cons_ex5_boats VALUES ('Shapla', 12, -5)$$),
  (6, $$INSERT INTO cons_ex5_boats VALUES ('Doyel', 12, NULL)$$)
) AS t(attempt, stmt)
ORDER BY attempt;`}
              task={
                <>
                  Saint Martin এর ট্যুরে নৌকা লাগে। <code className={CODE}>cons_ex5_boats</code> বানান, তিনটা Column এই ক্রমে:{" "}
                  <code className={CODE}>boat_name</code> text খালি রাখা যাবে না; <code className={CODE}>capacity</code> integer, খালি রাখা
                  যাবে না, 1 থেকে 40 এর মধ্যে; <code className={CODE}>fuel_litres</code> numeric, খালি থাকতে পারে (জানা নেই), কিন্তু থাকলে
                  ঋণাত্মক না। ঠিক হলে ফল: ok, 23514, 23514, 23502, 23514, ok।
                </>
              }
              hint={
                <>
                  capacity তে NOT NULL আর <code className={CODE}>CHECK (capacity BETWEEN 1 AND 40)</code>। fuel_litres এ শুধু{" "}
                  <code className={CODE}>CHECK (fuel_litres &gt;= 0)</code>, NOT NULL না। ছয় নম্বর চেষ্টায় NULL কেন ok, সেটা অংশ 008 এর
                  ছবিটা মনে করলেই বুঝবেন।
                </>
              }
              solution={`SELECT * FROM (VALUES
  (1, 'ok'),
  (2, '23514'),
  (3, '23514'),
  (4, '23502'),
  (5, '23514'),
  (6, 'ok')
) AS v(attempt, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "check-across-columns",
      subHeader: { index: "009", title: "CHECK Across Columns" },
      title: <SectionTitle>কয়েকটা Column এর মধ্যে সম্পর্কের নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু নিয়ম কোনো একটা Column এর না, দুটো Column এর সম্পর্কের। অফারের শেষ তারিখ শুরুর তারিখের পরে। যতবার ব্যবহার হয়েছে, সেটা
                সর্বোচ্চ সীমার বেশি না। ছাড়ের দাম আসল দামের কম। আলাদা করে প্রতিটা মান ঠিক হতে পারে, তবু দুটো মিলে ভুল।
              </ContentParagraph>
              <ContentParagraph>
                এমন নিয়মের স্বাভাবিক জায়গা Table Constraint: সব Column এর পরে আলাদা লাইনে{" "}
                <code className={CODE}>CHECK (ends_on &gt; starts_on)</code>। নাম না দিলে PostgreSQL এর বানানো নাম এখানে একটু অদ্ভুত হয়:
                শুধু Table এর নাম আর check, দ্বিতীয়টায় check1। কারণ নিয়মটা কোনো একটা Column এর না, নামে কোন Column বসাবে তা ঠিক করা যায়
                না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Column এর নিয়ম, আর আবার সেই NULL"
              query={`DROP TABLE IF EXISTS cons_tc_promos;
CREATE TABLE cons_tc_promos (
  code       text    NOT NULL,
  starts_on  date    NOT NULL,
  ends_on    date    NOT NULL,
  max_uses   integer,
  times_used integer NOT NULL DEFAULT 0,
  CHECK (ends_on > starts_on),
  CHECK (times_used <= max_uses)
);

SELECT conname, pg_get_constraintdef(oid) AS rule
FROM pg_constraint
WHERE conrelid = 'cons_tc_promos'::regclass AND contype = 'c'
ORDER BY conname;

INSERT INTO cons_tc_promos (code, starts_on, ends_on, max_uses, times_used)
VALUES ('WINTER15', '2026-12-01', '2027-01-31', NULL, 999);
SELECT code, max_uses, times_used FROM cons_tc_promos;

INSERT INTO cons_tc_promos (code, starts_on, ends_on)
VALUES ('PUJA10', '2026-11-30', '2026-11-01');`}
              caption={`প্রথম SELECT এ দুটো নাম: cons_tc_promos_check আর cons_tc_promos_check1। তারপর WINTER15 ঢুকে গেছে, max_uses NULL অথচ times_used 999, কারণ 999 <= NULL অজানা। শেষ INSERT এ তারিখ উল্টো: ERROR: new row for relation "cons_tc_promos" violates check constraint "cons_tc_promos_check"। এই নাম দেখে কি বোঝা যায় কোন নিয়ম ভাঙল? এর উত্তর অংশ 010।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CHECK শক্তিশালী, কিন্তু তার একটা সীমানা আছে, আর সেটা জানা জরুরি। CHECK শুধু সেই Row টা দেখে, যেটা এখন ঢুকছে বা বদলাচ্ছে।
                Documentation এর ভাষায়, CHECK এর ভেতরে Subquery চলে না, আর বর্তমান Row এর Column ছাড়া অন্য কিছুর উল্লেখও চলে না। ফলে তিন
                ধরনের নিয়ম CHECK দিয়ে হয় না:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অন্য Table দেখা:</strong> &quot;tour_id টা tours এ থাকতে হবে&quot; হলো Foreign Key, Lesson 09{" "}
                  <Link href="/sql/topic/foreign-keys" className={LINK}>
                    Foreign Keys
                  </Link>
                  । &quot;Departure এর seats_left ট্যুরের max_seats এর বেশি না&quot; এর জন্য লাগে Trigger, Module 14 এর{" "}
                  <Link href="/sql/topic/triggers" className={LINK}>
                    Triggers
                  </Link>{" "}
                  লেসনে।
                </ListItem>
                <ListItem>
                  <strong>একই Table এর অন্য Row দেখা:</strong> &quot;দুইবার না&quot; হলো UNIQUE। &quot;একই গাইডের দুটো ট্যুরের তারিখ যেন না
                  মেশে&quot; হলো EXCLUDE, Module 15 এর{" "}
                  <Link href="/sql/topic/ranges-exclusion" className={LINK}>
                    Ranges and Exclusion
                  </Link>{" "}
                  লেসনে।
                </ListItem>
                <ListItem>
                  <strong>সময়ের সাথে বদলায় এমন কিছু:</strong> <code className={CODE}>CHECK (starts_on &gt;= current_date)</code> লিখলে
                  PostgreSQL আপত্তি করে না, কিন্তু নিয়মটা ভুল। Documentation বলে, PostgreSQL ধরে নেয় CHECK এর শর্ত একই Row এর জন্য সবসময়
                  একই উত্তর দেবে, আর সেই কারণেই শুধু INSERT আর UPDATE এর সময় CHECK পরীক্ষা করে, অন্য সময় না। আজ যে অফার বৈধ, কাল সেটা
                  আপনা থেকে অবৈধ হয়ে যায়, অথচ Database কিছুই জানে না। পরে Backup থেকে Data ফেরত আনার সময় সেই পুরনো Row গুলো এই নিয়মে
                  আটকে যেতে পারে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CHECK এর সীমানা"
              query={`DROP TABLE IF EXISTS cons_tc_today;
CREATE TABLE cons_tc_today (
  starts_on date CHECK (starts_on >= current_date)
);

CREATE TABLE cons_tc_bad (
  tour_id integer CHECK (tour_id IN (SELECT tour_id FROM tours))
);`}
              caption="প্রথম Table কোনো আপত্তি ছাড়াই তৈরি হয়েছে, যদিও উপরে দেখলেন নিয়মটা কেন ভুল। দ্বিতীয়টায় ERROR: cannot use subquery in check constraint। অন্য Table এর সাথে মেলানোর কাজটা Foreign Key এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              starter={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_ex6_offers;
-- এখানে CREATE TABLE cons_ex6_offers লিখুন


-- নিচের Query টা বদলাবেন না
SELECT attempt, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_ex6_offers VALUES ('Sundarbans Saver', 18000, 15000, '2026-12-01', '2026-12-15')$$),
  (2, $$INSERT INTO cons_ex6_offers VALUES ('Same Price', 18000, 18000, '2026-12-01', '2026-12-15')$$),
  (3, $$INSERT INTO cons_ex6_offers VALUES ('Higher Sale', 18000, 19000, '2026-12-01', '2026-12-15')$$),
  (4, $$INSERT INTO cons_ex6_offers VALUES ('One Day Deal', 9000, 8000, '2026-12-25', '2026-12-25')$$),
  (5, $$INSERT INTO cons_ex6_offers VALUES ('Backwards', 9000, 8000, '2026-12-25', '2026-12-20')$$),
  (6, $$INSERT INTO cons_ex6_offers VALUES ('Free Trip', 0, 0, '2026-12-01', '2026-12-02')$$)
) AS t(attempt, stmt)
ORDER BY attempt;`}
              task={
                <>
                  <code className={CODE}>cons_ex6_offers</code> বানান, পাঁচটা Column এই ক্রমে, সবগুলো খালি রাখা যাবে না:{" "}
                  <code className={CODE}>title</code> text, <code className={CODE}>price_bdt</code> numeric (শূন্যের বেশি),{" "}
                  <code className={CODE}>sale_bdt</code> numeric, <code className={CODE}>starts_on</code> date,{" "}
                  <code className={CODE}>ends_on</code> date। নিয়ম: ছাড়ের দাম আসল দামের চেয়ে কম, আর অফার শেষ হয় শুরুর দিনে বা তার পরে
                  (এক দিনের অফার চলবে)। ঠিক হলে ফল: ok, 23514, 23514, ok, 23514, 23514।
                </>
              }
              hint={
                <>
                  price_bdt এর পাশে <code className={CODE}>CHECK (price_bdt &gt; 0)</code>। সব Column এর পরে দুটো Table Constraint:{" "}
                  <code className={CODE}>CHECK (sale_bdt &lt; price_bdt)</code> আর{" "}
                  <code className={CODE}>CHECK (ends_on &gt;= starts_on)</code>। এক দিনের অফারে দুই তারিখ সমান, তাই &gt; না, &gt;=।
                </>
              }
              solution={`SELECT * FROM (VALUES
  (1, 'ok'),
  (2, '23514'),
  (3, '23514'),
  (4, 'ok'),
  (5, '23514'),
  (6, '23514')
) AS v(attempt, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "naming-constraints",
      subHeader: { index: "010", title: "Naming Constraints" },
      title: <SectionTitle>নিয়মের নাম: Error এ যা লেখা থাকবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের অংশের শেষ Error টা আবার পড়ুন: violates check constraint cons_tc_promos_check। কোন নিয়ম? তারিখের, নাকি ব্যবহারের সীমার?
                নাম দেখে বোঝার উপায় নেই, Table এর সংজ্ঞা খুলে মিলিয়ে দেখতে হয়। এখন ভাবুন রাত এগারোটায় Production এর Log এ এই লাইনটা
                দেখছেন।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান সহজ: নিয়মের আগে <code className={CODE}>CONSTRAINT নাম</code> লিখে নিজের নাম দিন। Column Constraint আর Table Constraint,
                দুটোতেই চলে। CREATE TABLE এর Documentation নিজেই বলে, নিয়ম ভাঙলে Error এর বার্তায় Constraint এর নাম থাকে, তাই ভালো নাম দিয়ে
                App কে কাজের তথ্য জানানো যায়। নাম না দিলে PostgreSQL যেভাবে নাম বানায়, এই লেসনের বক্সগুলোতে আপনি তার সবগুলো রূপ দেখেছেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "PostgreSQL এর বানানো নাম", "এই লেসনের উদাহরণ"],
          rows: [
            ["NOT NULL", "Table_Column_not_null", "cons_nn_guests_full_name_not_null"],
            ["একটা Column এর CHECK", "Table_Column_check", "cons_ck_promos_percent_off_check"],
            ["কয়েকটা Column এর CHECK", "Table_check, তারপর check1, check2", "cons_tc_promos_check, cons_tc_promos_check1"],
            ["UNIQUE", "Table_Column_key", "cons_uq_codes_code_key"],
            ["জোড়ার UNIQUE", "Table_Column_Column_key", "cons_mc_slots_tour_id_starts_on_key"],
            ["PRIMARY KEY", "Table_pkey", "reviews_pkey (Lesson 08)"],
            ["FOREIGN KEY", "Table_Column_fkey", "reviews_booking_id_fkey (Lesson 09)"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভালো নাম কেমন হয়? একটা চলতি রীতি: আগে কোন জিনিসের নিয়ম, তারপর কোন Column, তারপর নিয়মটা কী, ছোট হাতে আর আন্ডারস্কোর দিয়ে।
                যেমন <code className={CODE}>promo_percent_range</code>, <code className={CODE}>promo_dates_in_order</code>,{" "}
                <code className={CODE}>promo_code_unique</code>। নাম পড়েই যেন বোঝা যায় কী ভাঙল। নামের তিনটা লাভ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Error পড়া যায়:</strong> Log এ promo_dates_in_order দেখলেই বোঝা যায় সমস্যা তারিখে।
                </ListItem>
                <ListItem>
                  <strong>App বুঝতে পারে:</strong> Error এর সাথে নামটা আলাদা ঘরেও আসে, তাই App নাম দেখে Customer কে নিজের ভাষায় বার্তা
                  দেখাতে পারে। অংশ 011 এ Code দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>পরে বদলানো সহজ:</strong> নিয়ম মুছতে বা বদলাতে নাম লাগে, যেমন{" "}
                  <code className={CODE}>ALTER TABLE ... DROP CONSTRAINT promo_percent_range</code>। নিজের দেওয়া নাম মনে রাখা সহজ, Lesson 10
                  এ এর পুরো ব্যবহার।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের দেওয়া নাম"
              query={`DROP TABLE IF EXISTS cons_nm_promos;
CREATE TABLE cons_nm_promos (
  code        text    CONSTRAINT promo_code_required NOT NULL,
  percent_off integer NOT NULL,
  CONSTRAINT promo_code_must_be_unique UNIQUE (code),
  CONSTRAINT promo_percent_between_1_and_50 CHECK (percent_off BETWEEN 1 AND 50)
);

SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'cons_nm_promos'::regclass
ORDER BY conname;

INSERT INTO cons_nm_promos VALUES ('BIG50', 250);`}
              caption={`SELECT এ ৪টা Row: আপনার দেওয়া তিনটা নাম (n, u, c), আর percent_off এর NOT NULL এর জন্য PostgreSQL এর বানানো cons_nm_promos_percent_off_not_null। শেষ INSERT এ ERROR: new row for relation "cons_nm_promos" violates check constraint "promo_percent_between_1_and_50"। এবার Error নিজেই বলে দিচ্ছে নিয়মটা কী।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>নাম দেওয়ার সময় দুটো নিয়ম জানা থাকলে অবাক হবেন না:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একই Table এ দুটো Constraint এর একই নাম চলে না।</strong> কিন্তু আলাদা Table এ একই নামের CHECK চলে, কারণ PostgreSQL
                  CHECK এর নাম শুধু Table এর ভেতরে আলাদা চায়।
                </ListItem>
                <ListItem>
                  <strong>UNIQUE এর নাম পুরো Schema তে আলাদা হতে হয়।</strong> কারণ UNIQUE এর সাথে যে Index তৈরি হয়, তার নামও সেটাই, আর
                  Index এর নাম Schema এর সব Table, Index আর View এর মধ্যে একটাই হতে পারে। Documentation এটা স্পষ্ট করে বলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নামের সংঘর্ষ"
              query={`DROP TABLE IF EXISTS cons_nm_a;
DROP TABLE IF EXISTS cons_nm_b;
DROP TABLE IF EXISTS cons_nm_c;
DROP TABLE IF EXISTS cons_nm_d;

CREATE TABLE cons_nm_a (code text CONSTRAINT shared_rule CHECK (code <> ''));
CREATE TABLE cons_nm_b (code text CONSTRAINT shared_rule CHECK (code <> ''));

CREATE TABLE cons_nm_c (code text CONSTRAINT cons_nm_code_key UNIQUE);
CREATE TABLE cons_nm_d (code text CONSTRAINT cons_nm_code_key UNIQUE);`}
              caption={`দুটো আলাদা Table এ একই নামের CHECK, shared_rule, দুটোই তৈরি হয়েছে। তৃতীয় Table ও ঠিক আছে। চতুর্থটায় ERROR: relation "cons_nm_code_key" already exists। Error টা relation বলছে, Constraint না, কারণ সংঘর্ষটা আসলে Index এর নামে।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              orderMatters
              starter={`DROP TABLE IF EXISTS cons_ex7_rooms;
-- এখানে CREATE TABLE cons_ex7_rooms লিখুন


-- নিচের Query টা বদলাবেন না
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'cons_ex7_rooms'::regclass
  AND contype IN ('c', 'u')
ORDER BY conname;`}
              task={
                <>
                  Cox&apos;s Bazar এর হোটেলের ঘরের Table <code className={CODE}>cons_ex7_rooms</code> বানান, তিনটা Column:{" "}
                  <code className={CODE}>room_no</code> text, <code className={CODE}>beds</code> integer,{" "}
                  <code className={CODE}>rate_bdt</code> numeric, তিনটাই খালি রাখা যাবে না। নিয়মগুলোর নাম ঠিক এরকম হবে:{" "}
                  <code className={CODE}>room_no_unique</code> (room_no দুইবার না),{" "}
                  <code className={CODE}>room_beds_range</code> (beds 1 থেকে 4),{" "}
                  <code className={CODE}>room_rate_positive</code> (rate_bdt শূন্যের বেশি)। পরীক্ষার Query নামগুলো বর্ণক্রমে দেখায়।
                </>
              }
              hint={
                <>
                  Column এর পাশে লিখলে: <code className={CODE}>beds integer NOT NULL CONSTRAINT room_beds_range CHECK (beds BETWEEN 1 AND 4)</code>।
                  অথবা সব Column এর পরে <code className={CODE}>CONSTRAINT room_no_unique UNIQUE (room_no)</code> এর মতো। দুই জায়গাতেই
                  নামটা একই থাকবে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('room_beds_range', 'c'),
  ('room_no_unique', 'u'),
  ('room_rate_positive', 'c')
) AS v(conname, contype);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "errors-and-sqlstate",
      subHeader: { index: "011", title: "Violation Errors and SQLSTATE" },
      title: <SectionTitle>প্রতিটা ভাঙা নিয়মের নিজের Code</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 02 এর{" "}
                <Link href="/sql/topic/errors-and-help" className={LINK}>
                  Errors and Help
                </Link>{" "}
                লেসনে আপনি দেখেছেন প্রতিটা PostgreSQL Error এর সাথে একটা পাঁচ অক্ষরের Code আসে, SQLSTATE। মানুষ পড়ে বার্তা, Program পড়ে Code।
                বার্তার ভাষা Version ভেদে একটু বদলাতে পারে, অনুবাদও হতে পারে, কিন্তু Code বদলায় না। প্রথম দুই অক্ষর বলে Error এর শ্রেণি।
                Constraint ভাঙার সব Error এর শ্রেণি 23, যার নাম Integrity Constraint Violation:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["SQLSTATE", "নাম", "কখন আসে", "কোথায় শিখবেন"],
          rows: [
            ["23502", "not_null_violation", "NOT NULL Column এ NULL", "এই লেসন"],
            ["23505", "unique_violation", "UNIQUE বা PRIMARY KEY এ নকল মান", "এই লেসন, Lesson 08"],
            ["23514", "check_violation", "CHECK এর শর্ত false", "এই লেসন"],
            ["23503", "foreign_key_violation", "অন্য Table এ নেই এমন মান", "Lesson 09"],
            ["23P01", "exclusion_violation", "EXCLUDE এর ওভারল্যাপ", "Module 15"],
            ["22P02", "invalid_text_representation", "শ্রেণি 22, Constraint না: Type এ মানই মানায় না, যেমন integer এ ten", "Module 04"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক নজরে সব Code"
              query={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_er_promos;
CREATE TABLE cons_er_promos (
  code        text    NOT NULL UNIQUE,
  percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 50)
);

SELECT n, attempt, cons_try(stmt) AS sqlstate
FROM (VALUES
  (1, 'good row',       $$INSERT INTO cons_er_promos VALUES ('EID25', 25)$$),
  (2, 'same code',      $$INSERT INTO cons_er_promos VALUES ('EID25', 30)$$),
  (3, 'no code',        $$INSERT INTO cons_er_promos VALUES (NULL, 20)$$),
  (4, '250 percent',    $$INSERT INTO cons_er_promos VALUES ('BIG50', 250)$$),
  (5, 'text as number', $$INSERT INTO cons_er_promos VALUES ('ABC1', 'ten')$$)
) AS t(n, attempt, stmt)
ORDER BY n;`}
              caption="পাঁচটা Row: ok, 23505, 23502, 23514, 22P02। প্রথম চারটা Constraint এর পাহারা। পাঁচ নম্বরটা পাহারাদার পর্যন্ত পৌঁছায়ইনি: ten কে integer বানানো যায় না, তাই Type ই আগে থামিয়েছে। Type প্রথম দরজা, Constraint দ্বিতীয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql এ <code className={CODE}>\set VERBOSITY verbose</code> চালালে Error এর সব ঘর দেখা যায়: SQLSTATE সামনে, আর আলাদা লাইনে
              কোন Schema, কোন Table, কোন Constraint বা কোন Column। নিচের Output আমাদের postgres:18 Container থেকে, এই লেসনের শেষের Promo Table
              এ। DETAIL এর শেষে created_at এর সময়টা ছেঁটে … রাখা হয়েছে, আর LOCATION লাইন বলে PostgreSQL এর নিজের Source Code এর কোন
              জায়গা থেকে Error টা এসেছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql-verbose-errors.sql",
          code: `-- psql, island_tours Database, cons_promo_codes এ আগে থেকেই EID25 আছে
\\set VERBOSITY verbose

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES ('EID25', 30, '2026-11-01', '2026-11-30');
-- ERROR:  23505: duplicate key value violates unique constraint "promo_code_unique"
-- DETAIL:  Key (code)=(EID25) already exists.
-- SCHEMA NAME:  public
-- TABLE NAME:  cons_promo_codes
-- CONSTRAINT NAME:  promo_code_unique
-- LOCATION:  _bt_check_unique, nbtinsert.c:666

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES ('BIG50', 250, '2026-11-01', '2026-11-30');
-- ERROR:  23514: new row for relation "cons_promo_codes" violates check constraint "promo_percent_range"
-- DETAIL:  Failing row contains (BIG50, 250, 2026-11-01, 2026-11-30, 100, 0, t, …).
-- SCHEMA NAME:  public
-- TABLE NAME:  cons_promo_codes
-- CONSTRAINT NAME:  promo_percent_range
-- LOCATION:  ExecConstraints, execMain.c:2076

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES (NULL, 20, '2026-11-01', '2026-11-30');
-- ERROR:  23502: null value in column "code" of relation "cons_promo_codes" violates not-null constraint
-- DETAIL:  Failing row contains (null, 20, 2026-11-01, 2026-11-30, 100, 0, t, …).
-- SCHEMA NAME:  public
-- TABLE NAME:  cons_promo_codes
-- COLUMN NAME:  code
-- LOCATION:  ReportNotNullViolationError, execMain.c:2213`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন, UNIQUE আর CHECK এ আসে CONSTRAINT NAME, আর NOT NULL এ আসে COLUMN NAME। এই ঘরগুলো শুধু psql এর সাজসজ্জা না।
                PostgreSQL এগুলো আলাদা আলাদা ঘর হিসেবে App এর কাছে পাঠায়, আর Node.js এর pg Package সেগুলো Error Object এর{" "}
                <code className={CODE}>code</code>, <code className={CODE}>constraint</code>, <code className={CODE}>column</code>,{" "}
                <code className={CODE}>detail</code> নামের Property তে রেখে দেয়। তাই App বার্তার লেখা খুঁটে খুঁটে পড়ে না, সরাসরি Code আর
                নাম দেখে সিদ্ধান্ত নেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Code টা দেখুন, এখনই চালানোর দরকার নেই। Node.js থেকে Database এ কাজ করা পুরোটা শিখবেন Module 17 এর{" "}
                <Link href="/sql/topic/node-pg" className={LINK}>
                  node-postgres
                </Link>{" "}
                লেসনে। এখানে শুধু দেখুন অংশ 010 এর নামগুলো কীভাবে Customer এর জন্য সুন্দর বার্তা হয়ে যায়। Database এর ঠিকানা আসে
                Environment Variable থেকে, Code এ লেখা থাকে না, আর না থাকলে Program শুরুতেই জোরে আপত্তি করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "create-promo.js",
          code: `import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pool = new pg.Pool({ connectionString });

// Constraint এর নাম থেকে Customer এর জন্য বার্তা
const MESSAGES = {
  promo_code_unique: "এই কোডটা আগেই আছে, অন্য একটা কোড দিন।",
  promo_code_format: "কোড হবে 4 থেকে 12 অক্ষরের, শুধু বড় হাতের অক্ষর আর সংখ্যা।",
  promo_percent_range: "ছাড় হবে 1 থেকে 50 শতাংশের মধ্যে।",
  promo_dates_in_order: "শেষের তারিখ শুরুর তারিখের পরে হতে হবে।",
};

export async function createPromo(code, percentOff, startsOn, endsOn) {
  try {
    await pool.query(
      \`INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
       VALUES ($1, $2, $3, $4)\`,
      [code, percentOff, startsOn, endsOn],
    );
    return { ok: true };
  } catch (err) {
    if (err.code === "23505" || err.code === "23514") {
      return { ok: false, message: MESSAGES[err.constraint] ?? "তথ্যগুলো আরেকবার দেখুন।" };
    }
    if (err.code === "23502") {
      return { ok: false, message: \`\${err.column} খালি রাখা যাবে না।\` };
    }
    throw err; // অন্য যেকোনো Error আসল সমস্যা, লুকানো যাবে না
  }
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা Row একসাথে কয়েকটা নিয়ম ভাঙলে Error কিন্তু একটাই আসে। কোনটা? সেটা নির্ভর করে পাহারাদারদের ক্রমের উপর। CREATE TABLE এর
              Documentation বলে, একাধিক CHECK থাকলে প্রতিটা Row এর জন্য সেগুলো পরীক্ষা হয় নামের বর্ণক্রমে, NOT NULL পরীক্ষার পরে। আর UNIQUE
              ধরা পড়ে Row টা Index এ লেখার সময়, যেটা আসে এই তিনটার মধ্যে সবার শেষে। নিচের তিনটা উদাহরণ আসল PostgreSQL 18 থেকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CheckOrderDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো ব্যাপারটা হাতে কলমে। নিচের Lab এ লেসনের শেষের Promo Table টা আছে, তার ছয়টা নিয়ম সহ। একটা একটা Row পাঠান, দেখুন কোন
              পাহারাদার পাস করাল আর কে থামাল। একই কোড দুইবার পাঠালে কী হয়, আর একটা Row দুটো নিয়ম ভাঙলে কোন Error আসে, নিজে মিলিয়ে নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConstraintGuardLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আরেকটা জরুরি কথা: একটা INSERT এ দশটা Row থাকলে আর তার একটা নিয়ম ভাঙলে, বাকি নয়টাও জমা হয় না। একটা Statement হয় পুরোপুরি
                সফল, নয়তো কিছুই না। প্রথম দুটো Row আগে ঢুকে গেল আর তৃতীয়টায় এসে থামল, এমন অর্ধেক অবস্থা কখনো থাকে না। এই &quot;সব নয়তো
                কিছুই না&quot; গুণের নাম Atomicity, পুরো গল্প Module 12 এর{" "}
                <Link href="/sql/topic/acid" className={LINK}>
                  ACID
                </Link>{" "}
                লেসনে। নিচে cons_try দিয়ে তিন Row এর একটা INSERT চালানো হয়েছে, যার তৃতীয় Row টা 90 শতাংশ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Row ভুল, পুরো INSERT বাতিল"
              query={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_er_batch;
CREATE TABLE cons_er_batch (
  code        text    NOT NULL UNIQUE,
  percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 50)
);

SELECT cons_try($$INSERT INTO cons_er_batch VALUES
  ('EID25', 25), ('PUJA10', 10), ('BIG90', 90)$$) AS result;

SELECT count(*) FROM cons_er_batch;`}
              caption="result এ 23514, আর count 0। EID25 আর PUJA10 নিজেরা একদম ঠিক ছিল, তবু তারাও Table এ নেই, কারণ তারা একই Statement এর অংশ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষে একটা সূক্ষ্ম ব্যাপার, যেটা একদিন আপনাকে অবাক করবে। PostgreSQL এর Documentation বলে, UNIQUE যদি Deferrable না হয়, PostgreSQL
              প্রতিটা Row ঢোকানো বা বদলানোর সাথে সাথেই নকল খোঁজে, যদিও SQL Standard বলে পুরো Statement শেষে খুঁজতে। পার্থক্যটা ধরা পড়ে যখন একটা
              UPDATE একসাথে অনেক Row এর UNIQUE মান সরায়, যেমন লাইনের সবার ক্রম এক ঘর পেছানো। শেষ অবস্থা ঠিক থাকলেও মাঝপথে 1 থেকে 2 হওয়ার মুহূর্তে
              আগের 2 তখনো আছে। Documentation এর সমাধান: Constraint কে <code className={CODE}>DEFERRABLE</code> করা, তখন পরীক্ষা হয় Statement শেষে।
              তবে Documentation সাবধানও করে যে এতে কাজ বেশ ধীর হতে পারে, তাই শুধু দরকার হলে। UPDATE শিখবেন Module 10 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবাইকে এক ঘর পেছানো"
              query={`DROP TABLE IF EXISTS cons_er_queue;
CREATE TABLE cons_er_queue (
  place_no integer UNIQUE DEFERRABLE,
  guest    text
);
INSERT INTO cons_er_queue VALUES (1, 'Rina'), (2, 'Joy'), (3, 'Mitu');
UPDATE cons_er_queue SET place_no = place_no + 1;
SELECT * FROM cons_er_queue ORDER BY place_no;

DROP TABLE IF EXISTS cons_er_queue2;
CREATE TABLE cons_er_queue2 (
  place_no integer UNIQUE,
  guest    text
);
INSERT INTO cons_er_queue2 VALUES (1, 'Rina'), (2, 'Joy'), (3, 'Mitu');
UPDATE cons_er_queue2 SET place_no = place_no + 1;`}
              caption={`DEFERRABLE Table এ UPDATE সফল, SELECT এ 2 Rina, 3 Joy, 4 Mitu। সাধারণ UNIQUE এর Table এ একই UPDATE থামে: ERROR: duplicate key value violates unique constraint "cons_er_queue2_place_no_key", DETAIL: Key (place_no)=(2) already exists. Rina কে 2 বানানোর মুহূর্তে Joy তখনো 2 তে।`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "adding-rules-later",
      subHeader: { index: "012", title: "Adding Rules to an Existing Table" },
      title: <SectionTitle>পুরনো Table এ নতুন নিয়ম, এক ঝলক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের Table এর কথা মনে আছে? সেখানে ইতিমধ্যে ভুল Row জমে আছে। এখন নিয়ম যোগ করলে কী হবে? নিয়ম যোগ করা হয়{" "}
                <code className={CODE}>ALTER TABLE ... ADD CONSTRAINT</code> দিয়ে, আর PostgreSQL তখন শুধু ভবিষ্যতের Row না, এখনকার সব Row
                ও পরীক্ষা করে। একটা Row ও নিয়ম ভাঙলে পুরো ALTER বাতিল, নিয়ম যোগই হয় না।
              </ContentParagraph>
              <ContentParagraph>
                তাই সঠিক ক্রম সবসময় তিন ধাপের: আগে একটা SELECT দিয়ে নিয়ম ভাঙা Row গুলো খুঁজুন, সেগুলো ঠিক করুন, তারপর নিয়ম যোগ করুন। ALTER
                TABLE এর পুরো গল্প Lesson 10{" "}
                <Link href="/sql/topic/alter-table" className={LINK}>
                  ALTER TABLE
                </Link>{" "}
                এ। এখানে শুধু দুটো বক্সে চেহারাটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল Row থাকলে নিয়ম যোগ হয় না"
              query={`DROP TABLE IF EXISTS cons_al_promos;
CREATE TABLE cons_al_promos (code text, percent_off integer);
INSERT INTO cons_al_promos VALUES ('EID25', 25), ('BIG50', 250), ('PUJA10', 10);

SELECT * FROM cons_al_promos
WHERE NOT (percent_off BETWEEN 1 AND 50);

ALTER TABLE cons_al_promos
  ADD CONSTRAINT cons_al_percent_range CHECK (percent_off BETWEEN 1 AND 50);`}
              caption={`খোঁজার SELECT এ একটা Row: BIG50, 250। তারপর ERROR: check constraint "cons_al_percent_range" of relation "cons_al_promos" is violated by some row। এখানে DETAIL নেই, কোন Row তা বলে না, তাই আগে নিজে খুঁজে নেওয়ার অভ্যাসটা জরুরি।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে ঠিক করুন, তারপর নিয়ম"
              query={`DROP TABLE IF EXISTS cons_al_promos;
CREATE TABLE cons_al_promos (code text, percent_off integer);
INSERT INTO cons_al_promos VALUES ('EID25', 25), ('BIG50', 250), ('PUJA10', 10);

UPDATE cons_al_promos SET percent_off = 25 WHERE code = 'BIG50';

ALTER TABLE cons_al_promos
  ADD CONSTRAINT cons_al_percent_range CHECK (percent_off BETWEEN 1 AND 50);

SELECT conname, pg_get_constraintdef(oid) AS rule
FROM pg_constraint
WHERE conrelid = 'cons_al_promos'::regclass;`}
              caption="UPDATE এ BIG50 এর 250 হলো 25 (টাইপোটা ঠিক করা)। এবার ALTER সফল, আর শেষের SELECT এ নতুন নিয়মটা: cons_al_percent_range, CHECK (((percent_off >= 1) AND (percent_off <= 50)))।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বড় Table এ দুটো নতুন শব্দ, শুধু নাম",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                লাখ লাখ Row এর Production Table এ সব Row একবারে পরীক্ষা করা সময় নেয়, আর সেই সময়টা Table এর কাজ আটকে থাকতে পারে। এর জন্য
                আছে <code className={CODE}>NOT VALID</code>: নিয়ম এখনই নতুন Row এর উপর খাটে, পুরনো Row পরে আলাদা করে{" "}
                <code className={CODE}>VALIDATE CONSTRAINT</code> দিয়ে পরীক্ষা হয়। PostgreSQL 18 এ NOT NULL এর জন্যও NOT VALID এসেছে। Lesson 10 এ
                এর পুরো ব্যবহার।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 18 আরেকটা জিনিস এনেছে: CHECK কে <code className={CODE}>NOT ENFORCED</code> লেখা যায়। তখন নিয়মটা Table এর সংজ্ঞায়
                লেখা থাকে কিন্তু খাটে না, ভুল Row ও ঢুকে যায়। নতুন অবস্থায় এটা ব্যবহারের কারণ প্রায় নেই, শুধু জেনে রাখুন যে কোনো Table এ CHECK
                লেখা দেখলেই ধরে নেবেন না সেটা খাটছে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই নিয়ম, কিছু আলাদা অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এর ভিডিও কোর্সে যা দেখবেন, তার বেশিরভাগ এই লেসনের মতোই: NOT NULL, DEFAULT, UNIQUE আর CHECK একই শব্দে লেখা হয়। পার্থক্যগুলো
              ছোট, কিন্তু না জানলে বিভ্রান্তি তৈরি করে। নিচের প্রতিটা কথা আমাদের mysql:8.4 Container এ, MySQL 8.4.11 এ চালিয়ে মেলানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["NOT NULL ভাঙলে", "23502, null value in column ...", "ERROR 1048: Column 'code' cannot be null"],
            ["UNIQUE ভাঙলে", "23505, duplicate key value ...", "ERROR 1062: Duplicate entry 'EID25' for key 'cons_promo.code'"],
            ["CHECK ভাঙলে", "23514, violates check constraint ...", "ERROR 3819: Check constraint 'cons_promo_chk_1' is violated."],
            ["CHECK কবে থেকে খাটে", "বহু আগে থেকে", "8.0.16 থেকে। তার আগে Documentation এর ভাষায় CHECK লেখা যেত, কিন্তু parsed and ignored"],
            ["নাম না দিলে CHECK এর নাম", "cons_promo_percent_off_check", "cons_promo_chk_1, cons_promo_chk_2"],
            ["CHECK এর নামের এলাকা", "শুধু Table এর ভেতরে আলাদা", "পুরো Schema তে আলাদা, নইলে ERROR 3822 Duplicate check constraint name"],
            ["UNIQUE এ বড় ছোট হাত", "EID25 আর eid25 আলাদা", "Default Collation utf8mb4_0900_ai_ci বড় ছোট হাত মানে না, তাই eid25 নকল"],
            ["UNIQUE এ একাধিক NULL", "Default এ চলে", "চলে"],
            ["NULLS NOT DISTINCT", "PostgreSQL 15 থেকে", "নেই, ERROR 1064 Syntax Error"],
            ["CHECK এ CURDATE বা NOW", "চুপচাপ মেনে নেয় (তবু ভুল)", "ERROR 3814, disallowed function"],
            ["Column CHECK এ অন্য Column", "মেনে নেয়, Table Constraint এর মতো নাম দেয়", "ERROR 3813, references other column"],
            ["DEFAULT এ অন্য Column", "ERROR: cannot use column reference", "বন্ধনীতে লিখলে চলে: DEFAULT (price * 0.9)"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-session.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা Database এ
CREATE TABLE cons_promo (
  code        VARCHAR(20) NOT NULL UNIQUE,
  percent_off INT CHECK (percent_off BETWEEN 1 AND 50),
  starts_on   DATE NOT NULL,
  ends_on     DATE NOT NULL,
  CHECK (ends_on > starts_on),
  email       VARCHAR(100) UNIQUE
);

INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('EID25', 25, '2026-11-01', '2026-11-30');      -- সফল
INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('EID25', 25, '2026-11-01', '2026-11-30');
-- ERROR 1062 (23000): Duplicate entry 'EID25' for key 'cons_promo.code'
INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES (NULL, 25, '2026-11-01', '2026-11-30');
-- ERROR 1048 (23000): Column 'code' cannot be null
INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('BIG', 250, '2026-11-01', '2026-11-30');
-- ERROR 3819 (HY000): Check constraint 'cons_promo_chk_1' is violated.
INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('BACK', 25, '2026-11-30', '2026-11-01');
-- ERROR 3819 (HY000): Check constraint 'cons_promo_chk_2' is violated.
INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('eid25', 25, '2026-11-01', '2026-11-30');
-- ERROR 1062 (23000): Duplicate entry 'eid25' for key 'cons_promo.code'

INSERT INTO cons_promo (code, percent_off, starts_on, ends_on) VALUES
  ('A1', 10, '2026-11-01', '2026-11-30'),
  ('A2', 10, '2026-11-01', '2026-11-30'),
  ('A3', 90, '2026-11-01', '2026-11-30');
-- ERROR 3819 (HY000): Check constraint 'cons_promo_chk_1' is violated.
SELECT COUNT(*) FROM cons_promo;
-- 1    <- শুধু EID25, A1 আর A2 ও জমা হয়নি

CREATE TABLE cons_n (email VARCHAR(100) UNIQUE NULLS NOT DISTINCT);
-- ERROR 1064 (42000): You have an error in your SQL syntax ... near 'NULLS NOT DISTINCT)'
CREATE TABLE cons_vol (starts_on DATE CHECK (starts_on >= CURDATE()));
-- ERROR 3814 (HY000): An expression of a check constraint 'cons_vol_chk_1' contains disallowed function: curdate.
CREATE TABLE cons_x1 (a INT, CONSTRAINT a_positive CHECK (a > 0));   -- সফল
CREATE TABLE cons_x2 (b INT, CONSTRAINT a_positive CHECK (b > 0));
-- ERROR 3822 (HY000): Duplicate check constraint name 'a_positive'.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এর সবচেয়ে বড় আলাদা অভ্যাসটা SQL Mode নিয়ে। MySQL 8 এর Default এ Strict Mode চালু, তাই ভুল মান Error দেয়, ঠিক PostgreSQL
                এর মতো। কিন্তু কোনো পুরনো Server এ বা কারো Config এ Strict Mode বন্ধ থাকলে MySQL অনেক ভুল মান Error এর বদলে চুপচাপ &quot;ঠিক&quot;
                করে নেয় আর শুধু একটা Warning দেয়। MySQL এর Documentation নিজেই এই নরম আচরণ চালু করতে নিষেধ করে। নিচে Strict Mode বন্ধ করে একটা
                দুই Row এর INSERT, যার দ্বিতীয় Row এর code NULL:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-non-strict.sql",
          code: `SET SESSION sql_mode = '';

INSERT INTO cons_promo (code, percent_off, starts_on, ends_on)
VALUES ('Q1', 10, '2026-11-01', '2026-11-30'),
       (NULL, 10, '2026-11-01', '2026-11-30');
-- Query OK, 2 rows affected, 1 warning
SHOW WARNINGS;
-- Warning | 1048 | Column 'code' cannot be null

SELECT code, percent_off FROM cons_promo WHERE code IN ('Q1', '');
-- ''  | 10      <- NULL এর জায়গায় খালি লেখা বসে গেছে
-- Q1  | 10

-- এক Row এর INSERT এ NULL দিলে Strict Mode বন্ধ থাকলেও ERROR 1048
-- CHECK সবসময় খাটে: 99 শতাংশ দিলে এখনো ERROR 3819

SET SESSION sql_mode = DEFAULT;`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিজের MySQL এ একবার দেখে নিন",
          content: (
            <ContentParagraph>
              MySQL এ কাজ করলে প্রথম দিনেই <code className={CODE}>SELECT @@sql_mode;</code> চালিয়ে দেখুন তালিকায় STRICT_TRANS_TABLES আছে কিনা। আমাদের
              mysql:8.4 Container এ আছে। না থাকলে উপরের মতো খালি লেখা আর শূন্য চুপচাপ জমা হতে পারে, আর সেই ভুল ধরা পড়বে অনেক পরে, Report এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর নিয়মের খাতা, আর নতুন Promo Table</SectionTitle>,
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
                ফারুক সাহেব তানিমকে দুটো কাজ দিলেন। প্রথম, পুরনো Table গুলোর নিয়ম পরীক্ষা করে দেখা কোথায় ফাঁক আছে। দ্বিতীয়, Promo Code এর
                Table নতুন করে বানানো, এবার সব নিয়ম সহ, আর প্রতিটা নিয়ম যে সত্যিই কাজ করে তার প্রমাণ সহ।
              </ContentParagraph>
              <ContentParagraph>
                অংশ 002 এর Query তে আপনি Sample Database এর ১২টা UNIQUE আর CHECK দেখেছেন। তানিম সেই তালিকা পড়ে তিনটা ফাঁক খুঁজে পেলেন। bookings এর
                total_bdt এ কোনো CHECK নেই, তাই BIG50 এর সেই মাইনাস 18000 টাকা এখানে চুপচাপ জমা হয়ে যেত। departures এ কোনো নিয়ম নেই যে একটা Tour একই
                দিনে একবারই ছাড়বে। আর payments এর amount_bdt শূন্য বা ঋণাত্মক হলেও কেউ আটকাবে না।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম দুটো নিয়ম যোগ করার আগে তানিম আগে দেখলেন এখনকার Data নিয়ম মানে কিনা। নিচের বক্স পুরোটা BEGIN আর ROLLBACK এর মাঝে চলে, তাই
                Sample Database শেষে ঠিক আগের মতোই থাকে। ভেতরের প্রতিটা Statement সফল হয়, কারণ এখনকার সবচেয়ে ছোট total_bdt 9500.00, আর কোনো Tour
                এর একই দিনে দুটো Departure নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sample Table এ নিয়ম যোগ, তারপর ROLLBACK"
              query={`BEGIN;

SELECT min(total_bdt) FROM bookings;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_total_not_negative CHECK (total_bdt >= 0);

ALTER TABLE departures
  ADD CONSTRAINT departures_one_per_day UNIQUE (tour_id, starts_on);

SELECT conrelid::regclass AS table_name, conname
FROM pg_constraint
WHERE conname IN ('bookings_total_not_negative', 'departures_one_per_day')
ORDER BY conname;

ROLLBACK;

SELECT count(*) AS still_there
FROM pg_constraint
WHERE conname IN ('bookings_total_not_negative', 'departures_one_per_day');`}
              caption="min 9500.00, তারপর দুটো ALTER সফল, আর SELECT এ দুটো নতুন নিয়ম: bookings এ bookings_total_not_negative, departures এ departures_one_per_day। ROLLBACK এর পরে still_there 0, সব আগের মতো। নিজের psql এ ROLLBACK এর বদলে COMMIT দিলে নিয়ম দুটো স্থায়ী হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Promo Table। তানিম প্রতিটা Column এর জন্য তিনটা প্রশ্ন করলেন: খালি থাকতে পারে কি? দুইবার আসতে পারে কি? কোন মান অর্থহীন?
                তারপর প্রতিটা নিয়মের একটা নাম দিলেন, যাতে App অংশ 011 এর মতো করে Customer কে বার্তা দেখাতে পারে। সিদ্ধান্তগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>code:</strong> খালি না, দুইবার না, আর শুধু বড় হাতের অক্ষর ও সংখ্যা, 4 থেকে 12 অক্ষর। Format এর নিয়মটা eid25 আর খালি
                  লেখা দুটোকেই থামায়, তাই আলাদা করে lower() এর Index লাগল না।
                </ListItem>
                <ListItem>
                  <strong>percent_off:</strong> খালি না, 1 থেকে 50।
                </ListItem>
                <ListItem>
                  <strong>starts_on, ends_on:</strong> দুটোই খালি না, আর শেষ শুরুর পরে।
                </ListItem>
                <ListItem>
                  <strong>max_uses, times_used:</strong> খালি না, DEFAULT 100 আর 0, সীমা শূন্যের বেশি, ব্যবহার শূন্য থেকে সীমা পর্যন্ত। দুটোই NOT
                  NULL বলে অংশ 009 এর সেই 999 এর ফাঁদ এখানে আর খাটে না।
                </ListItem>
                <ListItem>
                  <strong>is_active, created_at:</strong> খালি না, DEFAULT true আর now()।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে পুরো Table, তারপর cons_try দিয়ে আটটা চেষ্টা, প্রতিটা একটা করে নিয়মের পরীক্ষা, আর শেষে Table এ কী জমা হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground title="Promo Table আর প্রতিটা নিয়মের প্রমাণ" query={PROOF_BOX} caption="প্রথম SELECT এ আটটা Row: ok, 23505, 23514, 23502, 23514, 23514, 23514, ok। দ্বিতীয় SELECT এ শুধু দুটো Row, EID25 আর PUJA10, দুটোতেই max_uses 100, times_used 0, is_active t, সব DEFAULT থেকে। ছয়টা ভুল চেষ্টার একটাও Table এ পৌঁছায়নি।" />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তিনটা 23514 আলাদা আলাদা নিয়মের: ছোট হাতের কোড থামিয়েছে promo_code_format, উল্টো তারিখ promo_dates_in_order, আর 120 বার ব্যবহার
              promo_usage_within_limit। cons_try শুধু Code বলে, নাম না। কোন নামের নিয়ম থামাল দেখতে চাইলে সেই INSERT টা একা চালান, Error এর বার্তায়
              নামটা পাবেন। তানিম শেষে Table টা <code className={CODE}>\d cons_promo_codes</code> দিয়ে psql এ দেখলেন, Output নিচের Practical Lab এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`${TRY_HELPER}

DROP TABLE IF EXISTS cons_ch_gift_cards;
-- এখানে CREATE TABLE cons_ch_gift_cards লিখুন


-- নিচের Query টা বদলাবেন না: আগে আটটা চেষ্টার ফল, তারপর নিয়মগুলোর নাম
SELECT n::text AS item, cons_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000001', 5000, 5000, '2026-11-01', '2027-10-31')$$),
  (2, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000001', 2000, 2000, '2026-11-01', '2027-10-31')$$),
  (3, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('gc000002', 2000, 2000, '2026-11-01', '2027-10-31')$$),
  (4, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000003', 100, 100, '2026-11-01', '2027-10-31')$$),
  (5, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000004', 3000, 3500, '2026-11-01', '2027-10-31')$$),
  (6, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000005', 3000, 0, '2026-11-01', '2026-10-01')$$),
  (7, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000006', 3000, NULL, '2026-11-01', '2027-10-31')$$),
  (8, $$INSERT INTO cons_ch_gift_cards (card_code, amount_bdt, balance_bdt, issued_on, expires_on) VALUES ('GC000007', 50000, 0, '2026-11-01', '2027-10-31')$$)
) AS t(n, stmt)
UNION ALL
SELECT conname, contype::text
FROM pg_constraint
WHERE conrelid = 'cons_ch_gift_cards'::regclass
  AND contype IN ('c', 'u')
ORDER BY item;`}
              task={
                <>
                  Island Tours এখন Gift Card বিক্রি করবে। <code className={CODE}>cons_ch_gift_cards</code> বানান, এই Column গুলো, সব খালি রাখা
                  যাবে না: <code className={CODE}>card_code</code> text, <code className={CODE}>amount_bdt</code> numeric,{" "}
                  <code className={CODE}>balance_bdt</code> numeric, <code className={CODE}>issued_on</code> date,{" "}
                  <code className={CODE}>expires_on</code> date, আর <code className={CODE}>is_active</code> boolean, মান না দিলে true। পাঁচটা
                  নিয়ম, ঠিক এই নামে: <code className={CODE}>gift_code_unique</code> (card_code দুইবার না),{" "}
                  <code className={CODE}>gift_code_format</code> (GC তারপর ঠিক ছয়টা অঙ্ক),{" "}
                  <code className={CODE}>gift_amount_range</code> (500 থেকে 50000),{" "}
                  <code className={CODE}>gift_balance_valid</code> (balance শূন্য থেকে amount পর্যন্ত),{" "}
                  <code className={CODE}>gift_dates_in_order</code> (expires_on, issued_on এর পরে)। ঠিক হলে প্রথম আট Row এ: ok, 23505, 23514,
                  23514, 23514, 23514, 23502, ok, তারপর পাঁচটা নাম বর্ণক্রমে, পাশে c বা u।
                </>
              }
              hint={
                <>
                  Format এর জন্য <code className={CODE}>CHECK (card_code ~ &apos;^GC[0-9]{"{6}"}$&apos;)</code>। balance এর জন্য{" "}
                  <code className={CODE}>CHECK (balance_bdt BETWEEN 0 AND amount_bdt)</code>, এটা দুই Column এর নিয়ম, তাই সব Column এর পরে
                  লেখাই স্বাভাবিক। প্রতিটা নিয়মের আগে <code className={CODE}>CONSTRAINT নাম</code>। সাত নম্বর চেষ্টায় 23502 আসার জন্য
                  balance_bdt এ NOT NULL লাগবেই, নইলে NULL টা CHECK পার হয়ে যাবে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('1', 'ok'),
  ('2', '23505'),
  ('3', '23514'),
  ('4', '23514'),
  ('5', '23514'),
  ('6', '23514'),
  ('7', '23502'),
  ('8', 'ok'),
  ('gift_amount_range', 'c'),
  ('gift_balance_valid', 'c'),
  ('gift_code_format', 'c'),
  ('gift_code_unique', 'u'),
  ('gift_dates_in_order', 'c')
) AS v(item, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Table এর নিয়ম ঠিক করার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রতিটা Column কে জিজ্ঞেস করুন: খালি থাকতে পারে?",
              description:
                "ধরে নিন সব NOT NULL। শুধু যেখানে অজানা থাকাটা বাস্তবে সম্ভব, যেমন ফোন নম্বর বা এখনো ঠিক না হওয়া গাইড, সেখানে NOT NULL বাদ দিন।",
            },
            {
              title: "যেখানে স্বাভাবিক মান আছে, DEFAULT দিন",
              description:
                "শূন্য থেকে শুরু হওয়া গণনা, true দিয়ে শুরু হওয়া অবস্থা, তৈরির সময় now()। মনে রাখুন, নিজে NULL লিখলে DEFAULT বসে না।",
            },
            {
              title: "যা দুইবার আসতে পারে না, UNIQUE",
              description:
                "একটা Column হলে তার পাশে, জোড়া হলে Table এর শেষে। খালি থাকা Column এ NULL এর আচরণ ঠিক করুন: Default নাকি NULLS NOT DISTINCT।",
            },
            {
              title: "অর্থহীন মানগুলো লিখে ফেলুন, তারপর CHECK",
              description:
                "ঋণাত্মক দাম, শূন্য সিট, 250 শতাংশ, উল্টো তারিখ। প্রতিটা একটা CHECK। দুই Column এর নিয়ম Table Constraint হিসেবে।",
            },
            {
              title: "CHECK এর প্রতিটা Column এ NOT NULL আছে কিনা দেখুন",
              description:
                "CHECK অজানাকে ছেড়ে দেয়। যে Column খালি থাকা চলবে না, সেখানে দুটোই লাগবে।",
            },
            {
              title: "প্রতিটা নিয়মের একটা নাম দিন",
              description:
                "জিনিস, Column, নিয়ম: promo_percent_range। Error এ এই নামটাই দেখা যাবে, App এই নাম দেখেই বার্তা বাছবে।",
            },
            {
              title: "প্রতিটা নিয়ম একটা ভুল INSERT দিয়ে প্রমাণ করুন",
              description:
                "একটা ঠিক Row আর প্রতিটা নিয়মের জন্য একটা ভুল Row। প্রত্যাশিত SQLSTATE না এলে নিয়মটা হয় নেই, নয় ভুল লেখা।",
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
            ["শুধু App এ যাচাই, Database এ কোনো নিয়ম না", "CSV বা psql দিয়ে ভুল Data ঢুকে যায়", "App এর যাচাই থাকুক, Constraint ও থাকুক"],
            ["CHECK আছে, NOT NULL নেই", "NULL চুপচাপ CHECK পার হয়", "খালি চলবে না এমন Column এ দুটোই"],
            ["NOT NULL দিয়ে খালি লেখা আটকানোর আশা", "'' আর স্পেস ঢুকে যায়", "CHECK (btrim(col) <> '')"],
            ["নিজে NULL লিখে DEFAULT এর আশা", "NULL বসে, NOT NULL থাকলে Error", "Column বাদ দিন অথবা DEFAULT শব্দ লিখুন"],
            ["UNIQUE ধরে নেয় বড় ছোট হাত এক", "EID25 আর eid25 দুটোই ঢোকে", "Format এর CHECK, lower() এর Index, বা citext"],
            ["জোড়ার UNIQUE এর Column খালি রাখা", "(1, NULL) যতবার খুশি ঢোকে", "জোড়ার Column গুলোতে NOT NULL"],
            ["CHECK এ current_date বা now()", "চুপচাপ তৈরি হয়, পরে মিথ্যা হয়ে যায়", "সময়ের নিয়ম App এ বা Trigger এ"],
            ["CHECK দিয়ে অন্য Table দেখার চেষ্টা", "cannot use subquery in check constraint", "Foreign Key বা Trigger"],
            ["নিয়মের নাম না দেওয়া", "Error এ cons_tc_promos_check, কিছুই বোঝা যায় না", "CONSTRAINT promo_dates_in_order"],
            ["ভুল Row রেখে নিয়ম যোগ করা", "violated by some row, নিয়ম যোগই হয় না", "আগে খুঁজুন, ঠিক করুন, তারপর ADD CONSTRAINT"],
            ["Constraint এর লাইনের পরে কমা ভুলে যাওয়া", "syntax error at or near পরের লাইনের প্রথম শব্দ", "প্রতিটা Column আর নিয়মের মাঝে কমা, শেষেরটার পরে না"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS cons_cm_offers;
CREATE TABLE cons_cm_offers (
  title     text    NOT NULL,
  price_bdt numeric NOT NULL CHECK (price_bdt > 0)
  sale_bdt  numeric CHECK (sale_bdt < price_bdt)
);`}
              caption={`ERROR: syntax error at or near "sale_bdt"। Error টা যে শব্দে, ভুলটা তার ঠিক আগের লাইনে: price_bdt এর লাইনের শেষে কমা নেই। কমা বসিয়ে চালান। তারপর ভেবে দেখুন sale_bdt এ NOT NULL না থাকলে কী হবে, আর দরকার হলে যোগ করুন।`}
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
                    href="https://www.postgresql.org/docs/current/ddl-constraints.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Constraints
                  </a>
                  : CHECK, NOT NULL, UNIQUE, NULLS NOT DISTINCT আর Primary ও Foreign Key এর আনুষ্ঠানিক অধ্যায়। CHECK কেন অজানাকে ছেড়ে দেয় আর
                  কেন অপরিবর্তনীয় হতে হয়, এই লেসনের সেই কথাগুলো এখান থেকে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-createtable.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: CREATE TABLE
                  </a>
                  : Column Constraint আর Table Constraint এর পুরো Syntax, CHECK পরীক্ষার বর্ণক্রম, আর Non-Deferred Uniqueness এর ব্যাখ্যা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/errcodes-appendix.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Error Codes
                  </a>
                  : সব SQLSTATE এর তালিকা। Class 23 এর অংশটা খুলে এই লেসনের Code গুলো মিলিয়ে নিন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/protocol-error-fields.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Error and Notice Message Fields
                  </a>
                  : Error এর সাথে যে আলাদা ঘরগুলো App এর কাছে যায়, Schema, Table, Column আর Constraint এর নাম সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/create-table-check-constraints.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: CHECK Constraints
                  </a>
                  : MySQL এর CHECK এর নাম, Schema জুড়ে নামের নিয়ম, NOT ENFORCED, আর কোন Function CHECK এ নিষেধ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Server SQL Modes
                  </a>
                  : Strict Mode কী বদলায়, আর সেটা বন্ধ থাকলে MySQL ভুল মান কীভাবে বদলে নেয়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে যখনই Table বানানো দেখবেন, এই লেসনের MySQL অংশের তালিকাটা পাশে রাখুন, আর প্রতিটা নিয়ম PostgreSQL এর
                  Query বক্সে আবার লিখে দেখুন।
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
                  Constraint হলো Table এর গায়ে লেখা নিয়ম, যা Database নিজে প্রতিটা INSERT আর UPDATE এ খাটায়। App এর যাচাই মানুষের সুবিধার
                  জন্য, Constraint Data এর নিরাপত্তার জন্য। সব পথ এই এক দরজা দিয়েই যায়।
                </ListItem>
                <ListItem>
                  NOT NULL খালি ঘর থামায়, SQLSTATE 23502। খালি লেখা NULL না, সেটা থামাতে CHECK লাগে। PostgreSQL 18 এ NOT NULL এরও নাম থাকে।
                </ListItem>
                <ListItem>
                  DEFAULT কোনো বাধা না, Column বাদ দিলে মান বসায়। নিজে NULL লিখলে NULL ই বসে। DEFAULT অন্য Column পড়তে পারে না।
                </ListItem>
                <ListItem>
                  UNIQUE একই মান দুইবার থামায়, 23505, আর নিজে থেকে একটা Unique Index বানায়। বড় ছোট হাত আলাদা ধরে। জোড়ার UNIQUE Table এর শেষে।
                </ListItem>
                <ListItem>
                  UNIQUE এ দুটো NULL সমান না, তাই একাধিক NULL চলে। NULLS NOT DISTINCT (PostgreSQL 15) সেটা বদলায়। জোড়ায় একটা NULL থাকলেও একই
                  কথা।
                </ListItem>
                <ListItem>
                  CHECK একটা শর্ত, false হলে 23514। কিন্তু NULL হলে পাস, তাই সাথে NOT NULL। দুই Column এর নিয়ম Table Constraint। Subquery চলে না,
                  সময়ের সাথে বদলায় এমন কিছুও না।
                </ListItem>
                <ListItem>
                  CONSTRAINT নাম দিলে Error নিজেই বলে কী ভাঙল, App নাম দেখে বার্তা বাছে। CHECK এর নাম Table এর ভেতরে আলাদা, UNIQUE এর নাম পুরো
                  Schema তে।
                </ListItem>
                <ListItem>
                  ক্রম: NOT NULL, তারপর CHECK নামের বর্ণক্রমে, তারপর UNIQUE। একটা Statement হয় পুরো সফল, নয় কিছুই না।
                </ListItem>
                <ListItem>
                  পুরনো Table এ নিয়ম যোগ করলে সব পুরনো Row পরীক্ষা হয়। আগে খুঁজুন, ঠিক করুন, তারপর ADD CONSTRAINT।
                </ListItem>
                <ListItem>
                  MySQL এ একই শব্দ, Error এর Code আলাদা (1048, 1062, 3819), CHECK খাটে 8.0.16 থেকে, CHECK এর নাম Schema জুড়ে আলাদা, NULLS NOT
                  DISTINCT নেই, আর Strict Mode বন্ধ থাকলে ভুল মান চুপচাপ বদলে যেতে পারে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা Table এ একটা জিনিস ইচ্ছা করে বাদ রাখা হয়েছে: Row গুলোর নিজস্ব পরিচয়। cons_promo_codes এ code UNIQUE আর NOT
                NULL, যেটা প্রায় পরিচয়ের মতোই কাজ করে, কিন্তু কোড কি কখনো বদলাতে পারে? Booking এর পরিচয় কী হবে, যেখানে কোনো স্বাভাবিক
                UNIQUE তথ্যই নেই? UNIQUE আর NOT NULL একসাথে, প্রতিটা Table এ একটাই, আর নিজে থেকে বাড়তে থাকা নম্বর: সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  Primary Keys
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
      ["Constraint", "Table এর নিয়ম, Database নিজে প্রতিটা লেখায় খাটায়", "Sample Database এ ১২টা UNIQUE আর CHECK"],
      ["NOT NULL", "খালি ঘর চলবে না, 23502", "customers এর full_name, কিন্তু phone না"],
      ["খালি লেখা", "'' NULL না, NOT NULL থামায় না", "CHECK (btrim(code) <> '')"],
      ["DEFAULT", "Column বাদ দিলে বসে, নিজে NULL দিলে না", "country তে Bangladesh, booked_at এ now()"],
      ["UNIQUE", "একই মান দুইবার না, 23505, নিজে Index বানায়", "customers এর email, destinations এর name"],
      ["বড় ছোট হাত", "UNIQUE এ EID25 আর eid25 আলাদা", "Format এর CHECK বা lower() এর Index"],
      ["UNIQUE আর NULL", "দুটো NULL আলাদা, NULLS NOT DISTINCT বদলায়", "Joy আর Mitu দুজনেরই email NULL"],
      ["জোড়ার UNIQUE", "জোড়া দুইবার না, আলাদা মান চলে", "departures এ (tour_id, starts_on)"],
      ["CHECK", "শর্ত false হলে 23514, NULL হলে পাস", "reviews এর rating 1 থেকে 5"],
      ["দুই Column এর CHECK", "Table Constraint, Subquery চলে না", "ends_on > starts_on"],
      ["নাম", "CONSTRAINT নাম, Error আর App এর জন্য", "promo_percent_range"],
      ["ক্রম", "NOT NULL, CHECK বর্ণক্রমে, তারপর UNIQUE", "('X', 250) থামায় promo_code_format"],
      ["Atomicity", "এক Row ভুল হলে পুরো INSERT বাতিল", "তিন Row এর INSERT, count 0"],
      ["পরে যোগ করা", "পুরনো সব Row পরীক্ষা হয়", "bookings এ total_bdt >= 0, ROLLBACK সহ"],
      ["MySQL", "1048, 1062, 3819, CHECK 8.0.16 থেকে", "eid25 MySQL এ নকল"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "percent_off integer CHECK (percent_off BETWEEN 1 AND 50), এই Column এ NOT NULL নেই। INSERT এ percent_off এর জায়গায় NULL দিলে কী হয়?",
        options: [
          {
            key: "A",
            text: "23514, কারণ NULL তো 1 থেকে 50 এর মধ্যে না",
            isCorrect: false,
            explanation: "NULL BETWEEN 1 AND 50 এর উত্তর false না, অজানা। CHECK শুধু false কে থামায়।",
          },
          {
            key: "B",
            text: "Row ঢুকে যায়, কারণ CHECK এর শর্ত NULL হলে সেটা পাস ধরা হয়",
            isCorrect: true,
            explanation:
              "ঠিক। Documentation বলে, CHECK সন্তুষ্ট হয় শর্ত true অথবা NULL হলে। লেসনের NOPCT Row ঠিক এভাবে ঢুকেছিল। থামাতে চাইলে NOT NULL ও লাগবে।",
          },
          {
            key: "C",
            text: "23502, কারণ CHECK থাকলে NOT NULL নিজে থেকে যোগ হয়",
            isCorrect: false,
            explanation: "CHECK কখনো নিজে থেকে NOT NULL যোগ করে না। দুটো আলাদা নিয়ম, আলাদা করে লিখতে হয়।",
          },
          {
            key: "D",
            text: "NULL এর জায়গায় 1 বসে যায়",
            isCorrect: false,
            explanation: "PostgreSQL কোনো মান বদলে নেয় না। DEFAULT ও নেই, তাই NULL ই জমা হয়।",
          },
        ],
      },
      {
        id: 2,
        text: "email text UNIQUE, আর Table এ Joy এর email NULL। এখন Mitu কে email NULL দিয়ে ঢোকালে কী হয়?",
        options: [
          {
            key: "A",
            text: "23505, কারণ NULL আগেই আছে",
            isCorrect: false,
            explanation: "এটা হতো UNIQUE NULLS NOT DISTINCT হলে। সাধারণ UNIQUE এ দুটো NULL সমান না।",
          },
          {
            key: "B",
            text: "Mitu ঢুকে যান, কারণ Default নিয়মে দুটো NULL আলাদা ধরা হয়",
            isCorrect: true,
            explanation:
              "ঠিক। NULL মানে অজানা, আর দুটো অজানা সমান কিনা বলা যায় না। লেসনের প্রথম Staff Table এ Joy আর Mitu দুজনেই ঢুকেছিলেন।",
          },
          {
            key: "C",
            text: "23502, কারণ UNIQUE Column এ NULL চলে না",
            isCorrect: false,
            explanation: "UNIQUE নিজে NULL নিষেধ করে না। NULL নিষেধ করে NOT NULL, আর এখানে সেটা নেই।",
          },
          {
            key: "D",
            text: "PostgreSQL Mitu এর email নিজে থেকে খালি লেখা বানিয়ে দেয়",
            isCorrect: false,
            explanation: "এমন কিছু PostgreSQL করে না। এই ধরনের বদলে নেওয়া দেখা যায় MySQL এ Strict Mode বন্ধ থাকলে।",
          },
        ],
      },
      {
        id: 3,
        text: "city text DEFAULT 'Dhaka'। INSERT INTO t (full_name, city) VALUES ('Tanvir', NULL); চালালে city তে কী থাকে?",
        options: [
          {
            key: "A",
            text: "Dhaka, কারণ NULL পেলে DEFAULT বসে",
            isCorrect: false,
            explanation: "DEFAULT বসে শুধু Column বাদ দিলে বা DEFAULT শব্দ লিখলে। নিজে NULL লিখলে সেটাই আপনার দেওয়া মান।",
          },
          {
            key: "B",
            text: "Error, কারণ DEFAULT থাকা Column এ NULL দেওয়া যায় না",
            isCorrect: false,
            explanation: "DEFAULT কোনো বাধা না। Error আসত শুধু city তে NOT NULL থাকলে।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: true,
            explanation: "ঠিক। লেসনের Tanvir Ahmed এর Row এ city NULL এসেছিল। Dhaka চাইলে city Column টা INSERT থেকে বাদ দিন বা DEFAULT লিখুন।",
          },
          {
            key: "D",
            text: "খালি লেখা ''",
            isCorrect: false,
            explanation: "PostgreSQL NULL কে খালি লেখায় বদলায় না।",
          },
        ],
      },
      {
        id: 4,
        text: "cons_promo_codes এ ('X', 250, ...) ঢোকানো হলো। code এর Format ভুল, percent_off ও সীমার বাইরে। কোন Error আসে?",
        options: [
          {
            key: "A",
            text: "দুটো Error একসাথে",
            isCorrect: false,
            explanation: "PostgreSQL প্রথম যে নিয়ম ভাঙে সেটাতেই থামে। একটা Statement এ একটাই Error।",
          },
          {
            key: "B",
            text: "promo_percent_range, কারণ টাকার নিয়ম বেশি জরুরি",
            isCorrect: false,
            explanation: "PostgreSQL নিয়মের গুরুত্ব বোঝে না, শুধু ক্রম মানে।",
          },
          {
            key: "C",
            text: "promo_code_format, কারণ CHECK গুলো নামের বর্ণক্রমে পরীক্ষা হয়",
            isCorrect: true,
            explanation:
              "ঠিক। CREATE TABLE এর Documentation বলে CHECK পরীক্ষা হয় NOT NULL এর পরে, নামের বর্ণক্রমে। promo_code_format বর্ণক্রমে promo_percent_range এর আগে।",
          },
          {
            key: "D",
            text: "যে নিয়ম CREATE TABLE এ আগে লেখা, সেটা",
            isCorrect: false,
            explanation: "লেখার ক্রম না, নামের বর্ণক্রম। লেসনের Promo Table এ format আগে লেখাও আছে, কিন্তু কারণটা নাম।",
          },
        ],
      },
      {
        id: 5,
        text: "UNIQUE আর CHECK সহ একটা Table এ তিন Row এর একটা INSERT চালানো হলো। প্রথম দুটো ঠিক, তৃতীয়টা CHECK ভাঙে। Table এ কয়টা Row জমা হয়?",
        options: [
          {
            key: "A",
            text: "দুটো, ঠিক Row গুলো",
            isCorrect: false,
            explanation: "একটা Statement অর্ধেক সফল হয় না।",
          },
          {
            key: "B",
            text: "একটাও না, পুরো Statement বাতিল",
            isCorrect: true,
            explanation: "ঠিক। লেসনের cons_er_batch এ count 0 এসেছিল। এই সব নয়তো কিছুই না গুণের নাম Atomicity, Module 12 এ বিস্তারিত।",
          },
          {
            key: "C",
            text: "তিনটাই, তৃতীয়টার percent_off NULL হয়ে",
            isCorrect: false,
            explanation: "PostgreSQL ভুল মান বদলে NULL বসায় না।",
          },
          {
            key: "D",
            text: "PostgreSQL এ দুটো, MySQL এ একটাও না",
            isCorrect: false,
            explanation: "InnoDB Table এ MySQL ও পুরো Statement বাতিল করে, লেসনের MySQL পরীক্ষায় COUNT বদলায়নি।",
          },
        ],
      },
      {
        id: 6,
        text: "cons_a Table এ CONSTRAINT promo_rule UNIQUE (code) আছে। এখন cons_b Table এ একই নামে CONSTRAINT promo_rule UNIQUE (code) লিখলে কী হয়?",
        options: [
          {
            key: "A",
            text: "সমস্যা নেই, নাম শুধু Table এর ভেতরে আলাদা হলেই চলে",
            isCorrect: false,
            explanation: "এটা CHECK এর জন্য সত্যি। UNIQUE এর সাথে একই নামের Index তৈরি হয়, তাই নিয়ম আলাদা।",
          },
          {
            key: "B",
            text: "relation already exists Error, কারণ UNIQUE এর Index এর নাম পুরো Schema তে একটাই হতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের cons_nm_d এ ERROR: relation cons_nm_code_key already exists এসেছিল। Documentation বলে Index ভিত্তিক Constraint এর এই স্বাধীনতা নেই।",
          },
          {
            key: "C",
            text: "PostgreSQL দ্বিতীয়টার নাম নিজে থেকে promo_rule1 করে দেয়",
            isCorrect: false,
            explanation: "নিজের দেওয়া নাম PostgreSQL বদলায় না। নাম না দিলে তবেই সে নিজে নাম বানায়।",
          },
          {
            key: "D",
            text: "দুটো Table একই Index ভাগ করে নেয়",
            isCorrect: false,
            explanation: "একটা Index একটাই Table এর। তাই নামের সংঘর্ষে Error।",
          },
        ],
      },
      {
        id: 7,
        text: "একজন লিখলেন CHECK (starts_on >= current_date)। PostgreSQL Table টা তৈরি করে দিল। সমস্যা কোথায়?",
        options: [
          {
            key: "A",
            text: "কোনো সমস্যা নেই, PostgreSQL প্রতিদিন নিয়মটা আবার পরীক্ষা করে",
            isCorrect: false,
            explanation: "PostgreSQL CHECK পরীক্ষা করে শুধু INSERT আর UPDATE এর সময়, প্রতিদিন না।",
          },
          {
            key: "B",
            text: "Table তৈরি হয়নি আসলে, Error লুকানো আছে",
            isCorrect: false,
            explanation: "Table সত্যিই তৈরি হয়, লেসনের বক্সে কোনো Error আসেনি। সমস্যা আরও সূক্ষ্ম।",
          },
          {
            key: "C",
            text: "PostgreSQL ধরে নেয় CHECK একই Row এ সবসময় একই উত্তর দেবে, তাই আজকের বৈধ Row কাল অবৈধ হলেও কেউ ধরবে না, আর পরে Backup ফেরত আনায় আটকাতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। Documentation বলে CHECK এর শর্ত অপরিবর্তনীয় ধরে নেওয়া হয়। সময়ের সাথে বদলায় এমন নিয়ম App এ বা Trigger এ রাখুন। MySQL এমন CHECK লিখতেই দেয় না, ERROR 3814।",
          },
          {
            key: "D",
            text: "current_date CHECK এ লিখলে সব Row এর তারিখ আজকের হয়ে যায়",
            isCorrect: false,
            explanation: "CHECK কখনো মান বদলায় না, শুধু শর্ত দেখে।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এর Default Collation এ code VARCHAR(20) UNIQUE। EID25 থাকা অবস্থায় eid25 ঢোকালে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতো ঢুকে যায়",
            isCorrect: false,
            explanation: "PostgreSQL এ ঢুকত, কারণ সেখানে তুলনা বড় ছোট হাত মানে। MySQL এর Default Collation মানে না।",
          },
          {
            key: "B",
            text: "ERROR 3819, Check constraint violated",
            isCorrect: false,
            explanation: "এখানে কোনো CHECK নেই, প্রশ্নটা UNIQUE এর।",
          },
          {
            key: "C",
            text: "Warning দিয়ে ঢুকে যায়",
            isCorrect: false,
            explanation: "Strict Mode চালু থাকুক বা না থাকুক, নকল মান UNIQUE এ সবসময় Error।",
          },
          {
            key: "D",
            text: "ERROR 1062 Duplicate entry, কারণ utf8mb4_0900_ai_ci বড় ছোট হাতকে একই ধরে",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের MySQL পরীক্ষায় Duplicate entry 'eid25' for key 'cons_promo.code' এসেছিল। একই Schema PostgreSQL থেকে MySQL এ নিলে এই পার্থক্য চোখে রাখুন।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: নিয়মের খাতা আর একটা প্রমাণিত Table",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিয়মের হিসাব:</strong> Island Tours এর আটটা Table এর প্রতিটার NOT NULL, DEFAULT, UNIQUE আর CHECK একটা ছকে লিখুন
        (pg_constraint আর information_schema.columns থেকে)। তারপর এই লেসনে বলা তিনটা ছাড়াও অন্তত দুটো ফাঁক খুঁজুন, যেমন guides এর phone।
      </span>,
      <span key="2">
        <strong>Pickup Point Table:</strong> <code className={CODE}>cons_pickup_points</code> বানান: জায়গার নাম, এলাকা, সময়, একসাথে কতজন
        উঠতে পারে, চালু আছে কিনা। NOT NULL, DEFAULT, একটা জোড়ার UNIQUE আর অন্তত দুটো নাম দেওয়া CHECK রাখুন।
      </span>,
      <span key="3">
        <strong>প্রমাণ:</strong> Task 2 এর প্রতিটা নিয়মের জন্য একটা ভুল INSERT লিখুন, cons_try দিয়ে সবগুলো এক Query তে চালান, আর প্রত্যাশিত
        SQLSTATE এর পাশে আসল ফল লিখুন।
      </span>,
      <span key="4">
        <strong>App এর বার্তা:</strong> Task 2 এর প্রতিটা Constraint এর নামের পাশে Customer এর জন্য এক লাইনের বাংলা বার্তা লিখুন, অংশ 011 এর
        MESSAGES এর মতো করে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> অফিসের ভেতরের একমাত্র পাহারাদারের উদাহরণ দিয়ে বোঝান কেন শুধু Form এর যাচাই যথেষ্ট না, আর
        CHECK কেন NULL কে ছেড়ে দেয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">আটটা Table এর নিয়মের ছক আর পাঁচটা ফাঁকের তালিকা</span>,
      <span key="d2">cons_pickup_points এর CREATE TABLE</span>,
      <span key="d3">cons_try এর Query আর প্রত্যাশিত বনাম আসল ফলের ছক</span>,
      <span key="d4">Constraint নাম আর বার্তার তালিকা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Constraint",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Sample Table এর নিয়ম পড়া",
        description:
          "প্রথম ফাইল চালান। \\d reviews এ একটা Check constraint, একটা UNIQUE CONSTRAINT আর একটা Foreign-key। pg_constraint এর Query তে ১২টা Row।",
      },
      {
        title: "কোথায় কোথায় DEFAULT",
        description: "দ্বিতীয় ফাইলের Query তে ৫টা Row: booked_at, country, joined_at, created_at আর is_active।",
      },
      {
        title: "Promo Table বানানো",
        description:
          "তৃতীয় ফাইল Table বানায় আর \\d দেখায়। Indexes এর নিচে promo_code_unique, Check constraints এর নিচে পাঁচটা নাম, বর্ণক্রমে।",
      },
      {
        title: "নিয়ম ভেঙে Error পড়া",
        description:
          "চতুর্থ ফাইল VERBOSITY verbose করে চারটা INSERT চালায়। প্রথমটা INSERT 0 1, বাকি তিনটায় 23505, 23514 আর 23502, প্রতিটার নিচে CONSTRAINT NAME বা COLUMN NAME।",
      },
      {
        title: "UNIQUE আর NULL",
        description: "পঞ্চম ফাইলে দুটো Table। প্রথমটায় count 2, দ্বিতীয়টায় দ্বিতীয় NULL এ 23505।",
      },
      {
        title: "Sample Table এ নিয়ম যোগ, তারপর ROLLBACK",
        description:
          "ষষ্ঠ ফাইল BEGIN এর ভেতরে দুটো ALTER চালায়, \\d departures এ নতুন UNIQUE দেখায়, তারপর ROLLBACK। শেষে লেসনের Table গুলো মুছে ফেলে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-read-rules.sql",
        code: `\\d reviews
-- Indexes:
--     "reviews_pkey" PRIMARY KEY, btree (review_id)
--     "reviews_booking_id_key" UNIQUE CONSTRAINT, btree (booking_id)
-- Check constraints:
--     "reviews_rating_check" CHECK (rating >= 1 AND rating <= 5)
-- Foreign-key constraints:
--     "reviews_booking_id_fkey" FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)

SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS rule
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace AND contype IN ('c', 'u')
ORDER BY conname;
-- (12 rows): bookings_seats_check থেকে tours_price_bdt_check`,
      },
      {
        language: "sql",
        filename: "02-defaults.sql",
        code: `SELECT table_name, column_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND column_default IS NOT NULL
ORDER BY table_name, column_name;
-- bookings  | booked_at  | now()
-- customers | country    | 'Bangladesh'::text
-- customers | joined_at  | now()
-- tours     | created_at | now()
-- tours     | is_active  | true
-- (5 rows)`,
      },
      {
        language: "sql",
        filename: "03-promo-table.sql",
        code: `${PROMO_TABLE}

\\d cons_promo_codes
-- Indexes:
--     "promo_code_unique" UNIQUE CONSTRAINT, btree (code)
-- Check constraints:
--     "promo_code_format" CHECK (code ~ '^[A-Z0-9]{4,12}$'::text)
--     "promo_dates_in_order" CHECK (ends_on > starts_on)
--     "promo_max_uses_positive" CHECK (max_uses > 0)
--     "promo_percent_range" CHECK (percent_off >= 1 AND percent_off <= 50)
--     "promo_usage_within_limit" CHECK (times_used >= 0 AND times_used <= max_uses)`,
      },
      {
        language: "sql",
        filename: "04-break-rules.sql",
        code: `\\set VERBOSITY verbose

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES ('EID25', 25, '2026-11-01', '2026-11-30');
-- INSERT 0 1

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES ('EID25', 30, '2026-11-01', '2026-11-30');
-- ERROR:  23505: duplicate key value violates unique constraint "promo_code_unique"
-- CONSTRAINT NAME:  promo_code_unique

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES ('BIG50', 250, '2026-11-01', '2026-11-30');
-- ERROR:  23514: new row for relation "cons_promo_codes" violates check constraint "promo_percent_range"

INSERT INTO cons_promo_codes (code, percent_off, starts_on, ends_on)
VALUES (NULL, 20, '2026-11-01', '2026-11-30');
-- ERROR:  23502: null value in column "code" of relation "cons_promo_codes" violates not-null constraint
-- COLUMN NAME:  code

\\set VERBOSITY default`,
      },
      {
        language: "sql",
        filename: "05-unique-and-null.sql",
        code: `CREATE TABLE cons_lab_staff (full_name text NOT NULL, email text UNIQUE);
INSERT INTO cons_lab_staff VALUES ('Joy', NULL), ('Mitu', NULL);
SELECT count(*) FROM cons_lab_staff;
-- 2

CREATE TABLE cons_lab_staff2 (full_name text NOT NULL, email text UNIQUE NULLS NOT DISTINCT);
INSERT INTO cons_lab_staff2 VALUES ('Joy', NULL);
INSERT INTO cons_lab_staff2 VALUES ('Mitu', NULL);
-- ERROR:  duplicate key value violates unique constraint "cons_lab_staff2_email_key"
-- DETAIL:  Key (email)=(null) already exists.`,
      },
      {
        language: "sql",
        filename: "06-add-rule-and-clean-up.sql",
        code: `BEGIN;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_total_not_negative CHECK (total_bdt >= 0);
ALTER TABLE departures
  ADD CONSTRAINT departures_one_per_day UNIQUE (tour_id, starts_on);
\\d departures
-- Indexes:
--     "departures_pkey" PRIMARY KEY, btree (departure_id)
--     "departures_one_per_day" UNIQUE CONSTRAINT, btree (tour_id, starts_on)
ROLLBACK;

-- লেসনের Table গুলো মুছে ফেলা
DROP TABLE IF EXISTS cons_promo_codes, cons_lab_staff, cons_lab_staff2;`,
      },
    ],
    tip: (
      <ContentParagraph>
        Constraint এর নাম মনে না থাকলে psql এ <code className={CODE}>\d table_name</code> সবচেয়ে দ্রুত উপায়: Indexes, Check constraints আর
        Foreign-key constraints আলাদা আলাদা শিরোনামে নাম সহ দেখায়। NOT NULL আর DEFAULT দেখা যায় উপরের Column এর তালিকায়, Nullable আর Default
        Column এ।
      </ContentParagraph>
    ),
  },
};
