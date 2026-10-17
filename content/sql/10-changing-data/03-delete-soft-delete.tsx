import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { DeleteFateLab, ForgottenFilterLab } from "../../../components/course/topics/dml/del-animations";
import {
  DelChainSplit,
  DelFourFatesDiagram,
  DelSoftLifecycleDiagram,
  DelUniqueSplit,
  DelUsingDiagram,
} from "../../../components/course/topics/dml/del-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * Copies of customers, bookings and payments joined by ordinary foreign keys,
 * so the boxes can show a DELETE being refused without touching the sample
 * tables. The three are dropped in one statement because they depend on each
 * other.
 */
const FK_SETUP = `DROP TABLE IF EXISTS del_fk_payments, del_fk_bookings, del_fk_customers;
CREATE TABLE del_fk_customers AS SELECT * FROM customers;
ALTER TABLE del_fk_customers ADD PRIMARY KEY (customer_id);
CREATE TABLE del_fk_bookings AS SELECT * FROM bookings;
ALTER TABLE del_fk_bookings
  ADD PRIMARY KEY (booking_id),
  ADD FOREIGN KEY (customer_id) REFERENCES del_fk_customers (customer_id);
CREATE TABLE del_fk_payments AS SELECT * FROM payments;
ALTER TABLE del_fk_payments
  ADD PRIMARY KEY (payment_id),
  ADD FOREIGN KEY (booking_id) REFERENCES del_fk_bookings (booking_id);`;

/** The same three copies, but every foreign key says ON DELETE CASCADE. */
const FK_CASCADE_SETUP = `DROP TABLE IF EXISTS del_fk_payments, del_fk_bookings, del_fk_customers;
CREATE TABLE del_fk_customers AS SELECT * FROM customers;
ALTER TABLE del_fk_customers ADD PRIMARY KEY (customer_id);
CREATE TABLE del_fk_bookings AS SELECT * FROM bookings;
ALTER TABLE del_fk_bookings
  ADD PRIMARY KEY (booking_id),
  ADD FOREIGN KEY (customer_id) REFERENCES del_fk_customers (customer_id)
      ON DELETE CASCADE;
CREATE TABLE del_fk_payments AS SELECT * FROM payments;
ALTER TABLE del_fk_payments
  ADD PRIMARY KEY (payment_id),
  ADD FOREIGN KEY (booking_id) REFERENCES del_fk_bookings (booking_id)
      ON DELETE CASCADE;`;

/**
 * A copy of tours with a deleted_at column. The view is dropped first because
 * a later box builds del_live_tours on top of this table, and DROP TABLE
 * refuses while a view still depends on it.
 */
const TOURS_SETUP = `DROP VIEW IF EXISTS del_live_tours;
DROP TABLE IF EXISTS del_tours;
CREATE TABLE del_tours AS
  SELECT tour_id, title, price_bdt, is_active FROM tours;
ALTER TABLE del_tours ADD COLUMN deleted_at timestamptz;`;

/** Customers and bookings copies where customer 11 has been soft deleted. */
const SOFT_SETUP = `DROP TABLE IF EXISTS del_soft_bookings, del_soft_customers;
CREATE TABLE del_soft_customers AS SELECT * FROM customers;
ALTER TABLE del_soft_customers
  ADD PRIMARY KEY (customer_id),
  ADD COLUMN deleted_at timestamptz;
CREATE TABLE del_soft_bookings AS SELECT * FROM bookings;
ALTER TABLE del_soft_bookings
  ADD PRIMARY KEY (booking_id),
  ADD FOREIGN KEY (customer_id) REFERENCES del_soft_customers (customer_id);
UPDATE del_soft_customers
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE customer_id = 11;`;

export const deleteSoftDeleteContent: TopicData = {
  id: "delete-soft-delete",
  introduction: {
    badge: "MODULE 10 · LESSON 03",
    title: <SectionTitle>DELETE আর Soft Delete: মুছবেন, নাকি চিহ্ন দিয়ে রাখবেন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে আপনি Row ঢুকিয়েছেন আর বদলেছেন। এবার তৃতীয় কাজ: সরানো। SQL এ এর কমান্ড একটাই, DELETE, আর লিখতে লাগে এক
          লাইন। কিন্তু Production এ কাজ করা যেকোনো Engineer কে জিজ্ঞেস করুন, তিনি বলবেন আসল প্রশ্ন কমান্ডটা না। আসল প্রশ্ন হলো, এই
          Row টা কি সত্যিই মুছে ফেলা উচিত?
        </ContentParagraph>
        <ContentParagraph>
          একজন গ্রাহক Account মুছতে বললে তার Booking আর Payment এর কী হবে? একটা ভুল DELETE এর পরে ফেরার পথ কী? মাস শেষের আয়ের হিসাব
          যেন হঠাৎ কমে না যায়, সেটা কে নিশ্চিত করবে? এই প্রশ্নগুলোর উত্তর থেকেই এসেছে Soft Delete, Archive Table আর Anonymize, যেগুলো
          প্রায় প্রতিটা বড় Product এ আপনি দেখবেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি শিখবেন DELETE কীভাবে বেছে বেছে Row সরায় আর কয়টা গেল জানায়, মোছার আগে দেখে নেওয়ার অভ্যাস, RETURNING দিয়ে
          মোছা Row এর রসিদ রাখা আর PostgreSQL 18 এর OLD ও NEW, USING দিয়ে আরেক Table দেখে মোছা আর তার একটা ভয়ংকর ফাঁদ, Foreign Key
          মোছা আটকালে বা সাথে নিয়ে গেলে কী হয়, কেন Payment এর Row কখনো মোছা হয় না, Soft Delete কীভাবে বানাতে হয় আর তার আসল খরচ কী,
          Soft Delete এর পরে UNIQUE কেন ভাঙে আর Partial Unique Index কীভাবে সারায়, জীবিত Row এর View, Archive Table আর বড় মোছা ভাগে
          ভাগে করা, Anonymize, আর MySQL এ কোথায় নিয়ম আলাদা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি এক মুহূর্তে কাজ শেষ করি, কিন্তু আমার কাজ কেউ ফেরাতে পারে না। তাই আমাকে ডাকার আগে একবার জিজ্ঞেস করুন: আপনি কি সত্যিই চান এটা আর কখনো না থাকুক?",
      author: "DELETE",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবারের তিনটা অনুরোধ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, ১ নভেম্বর 2026। বাংলাদেশে রবিবার কাজের দিন, আর Island Tours এর সাপ্তাহিক বৈঠক এই দিনেই। ফারুক সাহেব তানিমের সামনে
                তিনটা কাগজ রাখলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Imran Kabir এর Email:</strong> &quot;অক্টোবরে Sign up করেছিলাম, কিন্তু কোনো Trip নিইনি। আমার Account টা মুছে
                  দিন।&quot; তিনি Customer 15, Database এ তার কোনো Booking নেই।
                </ListItem>
                <ListItem>
                  <strong>London থেকে Oliver Bennett এর Email:</strong> &quot;আমার Account আর আমার সব ব্যক্তিগত তথ্য মুছে দিন।&quot;
                  তিনি Customer 11। তার দুটো Booking আছে: Booking 12 বাতিল হয়েছিল, আর Booking 19 confirmed, যার জন্য তিনি 28000 টাকা Card
                  এ দিয়েছেন।
                </ListItem>
                <ListItem>
                  <strong>ফারুক সাহেবের নিজের নোট:</strong> &quot;সামনের 30 দিনের Departure গুলোতে কয়েকটা pending Booking Seat আটকে রেখেছে,
                  টাকা আসেনি। ওগুলো সরিয়ে Seat ছেড়ে দিন।&quot;
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটাই শুনতে একই কাজ: মুছে ফেলা। তানিম প্রথমে ভাবলেন তিনটা DELETE লিখলেই হবে। ঠিক তখন দলের হিসাবরক্ষক পাশ থেকে বললেন,
                &quot;Oliver এর Payment যদি মুছে যায়, ডিসেম্বরের Audit এ Card Company র Statement এর সাথে আমাদের খাতা মিলবে না।&quot; তানিম
                থামলেন। মোছা জিনিসটা যতটা সহজ ভেবেছিলেন, ততটা না।
              </ContentParagraph>
              <ContentParagraph>
                একটা অফিসের পুরনো ফাইলের আলমারির কথা ভাবুন। কোনো ফাইল আর দরকার নেই মনে হলে অফিসের হাতে চারটা উপায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Shredder এ দেওয়া।</strong> ফাইলটা কুচি কুচি হয়ে গেল, আর কখনো ফিরবে না। এটা DELETE, যাকে অনেকে Hard Delete বলেন।
                </ListItem>
                <ListItem>
                  <strong>মলাটে লাল সিল মারা: &quot;বাতিল&quot;।</strong> ফাইলটা আলমারিতেই থাকে, কিন্তু সবাই জানে এটা আর চালু না। দরকার হলে
                  সিলের পাশে &quot;ভুল করে বাতিল&quot; লিখে আবার চালু করা যায়। এটা Soft Delete।
                </ListItem>
                <ListItem>
                  <strong>পুরনো ফাইলের ঘরে সরিয়ে রাখা।</strong> রোজকার আলমারি হালকা হয়, কিন্তু দরকার হলে পুরনো ঘরে গিয়ে খুঁজে পাওয়া যায়।
                  এটা Archive Table।
                </ListItem>
                <ListItem>
                  <strong>কালো কালিতে নাম আর ঠিকানা ঢেকে দেওয়া।</strong> রসিদ, টাকার অঙ্ক আর তারিখ থাকে, মানুষটাকে আর চেনা যায় না। এটা
                  Anonymize।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসন শেষে আপনি তানিমের তিনটা অনুরোধের প্রতিটার জন্য ঠিক উপায়টা বেছে নিতে পারবেন, আর প্রতিটা SQL নিজের হাতে চালিয়ে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DelFourFatesDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের আগে যা জানা থাকলে ভালো",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                DELETE এর প্রথম পরিচয়, TRUNCATE আর DROP থেকে তার পার্থক্য, আর WHERE ভুলে গেলে কী হয়, সেটা আপনি{" "}
                <Link href="/sql/topic/drop-truncate-delete" className={LINK}>
                  Module 09 এর DROP, TRUNCATE আর DELETE
                </Link>{" "}
                লেসনে দেখেছেন। Foreign Key এর ON DELETE নিয়মগুলো আছে{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Foreign Keys
                </Link>{" "}
                লেসনে। এখানে আমরা সেখান থেকে শুরু করে আরও গভীরে যাব: বাস্তব অনুরোধে কোন উপায়, আর কেন।
              </ContentParagraph>
              <ContentParagraph>
                এই পাতার সব Query বক্স একটাই Database ভাগ করে। তাই আমরা আসল Table থেকে সরাসরি মুছব না। হয় <code className={CODE}>del_</code>{" "}
                দিয়ে শুরু নকল Table এ কাজ করব, নয়তো BEGIN আর ROLLBACK এর মাঝে, যাতে শেষে সব আগের মতো ফিরে আসে। Page বদলালে বক্সের Database
                আবার নতুন করে শুরু হয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "delete-anatomy",
      subHeader: { index: "002", title: "DELETE Anatomy" },
      title: <SectionTitle>DELETE এর গঠন, আর আগে দেখে নেওয়ার অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DELETE এর পুরো গঠন এক লাইনের: <code className={CODE}>DELETE FROM table WHERE শর্ত;</code>। তিনটা অংশ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DELETE FROM table:</strong> কোন Table থেকে মুছবেন। একবারে একটাই Table, অন্য Table দেখতে হলে আলাদা উপায় আছে, সেটা
                  এই লেসনের USING Section এ।
                </ListItem>
                <ListItem>
                  <strong>WHERE শর্ত:</strong> কোন Row যাবে। এটা হুবহু সেই WHERE যা আপনি{" "}
                  <Link href="/sql/topic/where-filters" className={LINK}>
                    Module 03
                  </Link>{" "}
                  থেকে SELECT এ লিখছেন: তুলনা, AND, OR, IN, IS NULL, Subquery, সব চলে। WHERE না দিলে প্রতিটা Row শর্ত মেলে, তাই সব যায়।
                </ListItem>
                <ListItem>
                  <strong>উত্তর:</strong> কাজ শেষে PostgreSQL একটা ছোট বার্তা দেয়, <code className={CODE}>DELETE 3</code>, মানে তিনটা Row গেল।
                  একে Command Tag বলে। কোনো Row শর্ত না মিললে <code className={CODE}>DELETE 0</code>: এটা Error না, শুধু কাজ ছিল না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                অভিজ্ঞ Engineer দের প্রথম অভ্যাস: DELETE লেখার আগে একই WHERE দিয়ে SELECT চালানো। যে Row গুলো আসে, ঠিক সেগুলোই মুছবে, একটাও
                বেশি না, একটাও কম না। সংখ্যা আর Row দেখে নিশ্চিত হলে তবেই <code className={CODE}>SELECT ...</code> এর জায়গায়{" "}
                <code className={CODE}>DELETE</code> লিখুন, WHERE অংশে একটা অক্ষরও না বদলে। নিচের বক্সে ঠিক এটাই, bookings এর একটা নকলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে দেখুন, তারপর মুছুন"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

SELECT booking_id, customer_id, status, total_bdt
FROM del_bookings
WHERE status = 'cancelled';

DELETE FROM del_bookings WHERE status = 'cancelled';
DELETE FROM del_bookings WHERE status = 'cancelled';

SELECT count(*) AS bookings_left FROM del_bookings;`}
              caption="প্রথম SELECT তিনটা Row দেখায়: Booking 5 (17000.00), 12 (25000.00) আর 18 (9500.00)। তারপর প্রথম DELETE বলে DELETE 3, ঠিক সেই তিনটা। একই DELETE আবার চালালে DELETE 0, কারণ মেলার মতো আর কেউ নেই, আর এটা Error না। শেষে 24 থেকে 21টা Row বাকি। আসল bookings Table এ এখনো 24, কারণ আমরা মুছেছি নকল থেকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় অভ্যাস আরও শক্তিশালী: মোছার কাজটা একটা Transaction এর ভেতরে করা। Transaction মানে কয়েকটা কমান্ডের একটা খাম, যা
                শেষে হয় পুরোটা পাকা হয় (COMMIT), নয়তো পুরোটা বাতিল হয় (ROLLBACK)। BEGIN লিখে খাম খোলেন, ভেতরে DELETE চালান, তারপর SELECT
                দিয়ে ফলাফল দেখেন। ঠিক থাকলে COMMIT, একটু সন্দেহ থাকলেও ROLLBACK। Transaction এর পুরো গল্প{" "}
                <Link href="/sql/topic/transactions-basics" className={LINK}>
                  Module 12
                </Link>{" "}
                এ, আজ শুধু এই নিরাপত্তা বেল্টটা পরে নিন।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্স আসল reviews Table এ চলে, কিন্তু ভয় নেই: শেষে ROLLBACK আছে। ভেতরে প্রতিটা Statement সফল হওয়া জরুরি, কারণ খোলা
                Transaction এর ভেতরে একটা Error হলে পরের সব কমান্ড আটকে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খামের ভেতরে মোছা, তারপর ফেরত"
              query={`BEGIN;
DELETE FROM reviews
WHERE comment IS NULL
RETURNING review_id, booking_id, rating;
SELECT count(*) AS reviews_inside_transaction FROM reviews;
ROLLBACK;
SELECT count(*) AS reviews_after_rollback FROM reviews;`}
              caption="মন্তব্য ছাড়া দুটো Review মুছল: review_id 4 (Booking 4, রেটিং 4) আর 8 (Booking 9, রেটিং 5)। Transaction এর ভেতরে গুনলে 8টা। তারপর ROLLBACK, আর শেষের SELECT আবার 10 দেখায়। Transaction এর বাইরের কেউ এই মোছা কখনো দেখেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Command Tag টা পড়ুন, প্রতিবার",
          content: (
            <ContentParagraph>
              আপনি ভেবেছিলেন 3টা Row যাবে, আর উত্তর এল DELETE 300? থামুন, ROLLBACK করুন। Production এর বেশিরভাগ মোছার দুর্ঘটনা এই একটা
              সংখ্যা না পড়ার কারণে। App এর Code এও এই সংখ্যা পাওয়া যায় (node-postgres এ <code className={CODE}>result.rowCount</code>), আর ভালো
              Code প্রত্যাশার সাথে না মিললে কাজ থামিয়ে দেয়।{" "}
              <Link href="/sql/topic/update-without-where" className={LINK}>
                UPDATE Without WHERE
              </Link>{" "}
              লেসনে এর পুরো প্রতিরোধের গল্প আছে।
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
                  Starter Query <code className={CODE}>del_ex1_bookings</code> নামে bookings এর একটা নকল বানায়। মাঝের মন্তব্যের জায়গায়
                  একটা DELETE লিখুন যা সেই pending Booking গুলো সরায় যেগুলো <strong>11 October 2026 এর আগে</strong> করা হয়েছিল (তিন সপ্তাহের
                  বেশি পুরনো Hold)। অন্য কোনো অবস্থার Booking যেন না যায়। শেষের যাচাইয়ের Query টা না বদলে শেষ Statement হিসেবেই রাখুন: সে
                  প্রতিটা status এ কয়টা Booking বাকি, status এর ক্রমে দেখায়।
                </>
              }
              hint={
                <>
                  দুটো শর্ত, দুটোই সত্যি হওয়া চাই, তাই AND: <code className={CODE}>{"status = 'pending'"}</code> আর{" "}
                  <code className={CODE}>{"booked_at < DATE '2026-10-11'"}</code>। <code className={CODE}>{"<= DATE '2026-10-10'"}</code>{" "}
                  লিখলে কিন্তু 10 October সন্ধ্যার Booking 20 বাদ পড়ে যায়, কারণ DATE মানে সেই দিনের মাঝরাত। আগে একই WHERE দিয়ে SELECT চালিয়ে
                  দেখুন কোন তিনটা Row আসে।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex1_bookings;
CREATE TABLE del_ex1_bookings AS SELECT * FROM bookings;

-- এখানে আপনার DELETE লিখুন

SELECT status, count(*) AS bookings
FROM del_ex1_bookings
GROUP BY status
ORDER BY status;`}
              solution={`SELECT status, count(*)
FROM bookings
WHERE NOT (status = 'pending' AND booked_at < DATE '2026-10-11')
GROUP BY status
ORDER BY status;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "returning",
      subHeader: { index: "003", title: "RETURNING" },
      title: <SectionTitle>RETURNING: মোছার রসিদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DELETE এর উত্তর শুধু একটা সংখ্যা। কিন্তু কোন কোন Row গেল? COMMIT এর পরে এই প্রশ্নের উত্তর আর Database এ নেই, কারণ Row গুলোই
                নেই। তাই PostgreSQL একটা সুযোগ দেয়: DELETE এর শেষে <code className={CODE}>RETURNING</code> আর কয়েকটা Column লিখলে মুছে ফেলা
                প্রতিটা Row ফলাফল হিসেবে ফেরত আসে, ঠিক SELECT এর মতো। দোকানে জিনিস ফেরত দিলে যেমন একটা রসিদ পান, তেমন।
              </ContentParagraph>
              <ContentParagraph>
                RETURNING এর পরে SELECT এর তালিকার মতোই যা খুশি লেখা যায়: <code className={CODE}>*</code>, কয়েকটা Column, হিসাব, এমনকি লেখা।
                বাস্তবে এর তিনটা বড় কাজ। এক, App ব্যবহারকারীকে দেখাতে পারে ঠিক কী মুছল। দুই, মোছা Row গুলো একটা Log বা Audit Table এ লিখে
                রাখা যায়। তিন, মোছা আর অন্য জায়গায় সরানো একটা Statement এ করা যায়, সেটা এই লেসনের Archive Section এ।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>INSERT ... RETURNING</code> আর <code className={CODE}>UPDATE ... RETURNING</code> আপনি{" "}
                <Link href="/sql/topic/insert" className={LINK}>
                  INSERT
                </Link>{" "}
                আর{" "}
                <Link href="/sql/topic/update" className={LINK}>
                  UPDATE
                </Link>{" "}
                লেসনে দেখেছেন, DELETE এ নিয়মটা একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RETURNING *: পুরো Row ফেরত"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

DELETE FROM del_bookings
WHERE status = 'pending'
RETURNING *;`}
              caption="চারটা pending Booking মুছল, আর প্রতিটার সাতটা Column ই ফেরত এল: Booking 14 (Customer 12, 50000.00), 17 (Customer 1, 36000.00), 20 (Customer 9, 15600.00) আর 24 (Customer 13, 15600.00)। RETURNING থাকলে বক্স DELETE 4 লেখার বদলে এই Table টাই দেখায়, যেন একটা SELECT চলেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RETURNING এ হিসাব আর লেখা"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

DELETE FROM del_bookings
WHERE status = 'cancelled'
RETURNING booking_id,
          total_bdt,
          round(total_bdt / seats, 2) AS per_seat,
          'deleted on 2026-11-01' AS note;`}
              caption="তিনটা cancelled Booking এর রসিদ, সাথে প্রতি Seat এর দাম আর একটা নোট: Booking 5 এর per_seat 8500.00, 12 এর 12500.00, 18 এর 9500.00। RETURNING এর তালিকা হুবহু SELECT এর তালিকার মতো, Function আর Alias সহ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL 18 এ RETURNING একটা নতুন ক্ষমতা পেয়েছে: <code className={CODE}>old</code> আর <code className={CODE}>new</code>।{" "}
                <code className={CODE}>old.column</code> মানে কমান্ড চলার আগের মান, <code className={CODE}>new.column</code> মানে পরের মান। UPDATE
                এ এটা খুব কাজের, কারণ একই Row এর আগে আর পরে পাশাপাশি দেখা যায়। DELETE এ পরের মান বলে কিছু নেই, তাই Docs এর ভাষায়, সাধারণ
                DELETE এ সব new মান NULL। নিচের বক্সে সেটা নিজে দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                নাম দুটো অন্য কিছুর সাথে মিলে গেলে Alias দেওয়া যায়: <code className={CODE}>RETURNING WITH (OLD AS o, NEW AS n) o.*, n.*</code>।
                আর কোনো কিছু না লিখে শুধু Column এর নাম লিখলে DELETE এ সেটা পুরনো মানই বোঝায়, তাই আগের দুই বক্সের RETURNING এ old লিখতে হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL 18: old আর new"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

DELETE FROM del_bookings
WHERE status = 'cancelled'
RETURNING old.booking_id AS old_id,
          new.booking_id AS new_id,
          old.status     AS old_status,
          new.status     AS new_status;`}
              caption="old_id তে 5, 12 আর 18, old_status এ cancelled। new_id আর new_status তিনটা Row তেই ফাঁকা, মানে NULL, কারণ মোছার পরে Row এর কোনো নতুন রূপ নেই। PostgreSQL 17 বা তার আগের Version এ old আর new লেখা যায় না, সেখানে শুধু Column এর নাম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "RETURNING এর ক্রমের উপর ভরসা করবেন না",
          content: (
            <ContentParagraph>
              RETURNING এর Row গুলো কোন ক্রমে আসবে, তার কোনো নিশ্চয়তা নেই, আর RETURNING এ ORDER BY লেখাও যায় না। ক্রম লাগলে DELETE কে একটা
              CTE তে রেখে বাইরের SELECT এ সাজান: <code className={CODE}>WITH gone AS (DELETE ... RETURNING *) SELECT * FROM gone ORDER BY booking_id;</code>
              । CTE এর ভেতরে DELETE বা INSERT রাখাকে Data-Modifying CTE বলে, Archive Section এ এর আসল ব্যবহার দেখবেন।
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
                  Starter Query <code className={CODE}>del_ex2_reviews</code> নামে reviews এর একটা নকল বানায়। এবার কোনো আলাদা যাচাইয়ের Query
                  নেই: আপনার DELETE টাই শেষ Statement। যে Review গুলোর রেটিং 3 বা তার কম, সেগুলো মুছুন, আর RETURNING দিয়ে এই ক্রমে তিনটা Column
                  ফেরত দিন: <code className={CODE}>review_id</code>, <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>rating</code>।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"DELETE FROM del_ex2_reviews WHERE rating <= 3 RETURNING ..."}</code>। &quot;3 বা তার কম&quot; মানে{" "}
                  <code className={CODE}>{"<="}</code>, শুধু <code className={CODE}>{"<"}</code> দিলে রেটিং 3 এর Review টা থেকে যায়।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex2_reviews;
CREATE TABLE del_ex2_reviews AS SELECT * FROM reviews;

-- এখানে DELETE ... RETURNING লিখুন, শেষ Statement হিসেবে`}
              solution={`SELECT review_id, booking_id, rating
FROM reviews
WHERE rating <= 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "delete-using",
      subHeader: { index: "004", title: "DELETE ... USING" },
      title: <SectionTitle>USING: আরেক Table দেখে মোছা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের নোট: সামনের 30 দিনের Departure এ যে pending Booking গুলো Seat আটকে রেখেছে, সেগুলো যাবে। সমস্যা হলো,
                Booking এর Table এ যাত্রার তারিখ নেই। তারিখ আছে departures এ। মানে মুছব bookings থেকে, কিন্তু কোনটা মুছব সেটা ঠিক হবে
                departures দেখে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ এর জন্য <code className={CODE}>USING</code>: DELETE এর পরে আরেকটা Table এর নাম লিখুন, তারপর WHERE এ দুই Table
                জোড়ার শর্ত আর বাছাইয়ের শর্ত। ব্যাপারটা ঠিক{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  INNER JOIN
                </Link>{" "}
                এর মতো: যে Booking এর সাথে শর্ত মেলা একটা Departure জোড়া পায়, সে মোছে। শুধু মোছে প্রথম Table এর Row, USING এর Table এ কেউ হাত
                দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                আজ ১ নভেম্বর, তাই &quot;সামনের 30 দিন&quot; মানে <code className={CODE}>{"DATE '2026-11-01' + 30"}</code>, অর্থাৎ 1 December
                2026 এর আগে। DATE এর সাথে একটা পূর্ণসংখ্যা যোগ করলে PostgreSQL ততদিন পরের তারিখ দেয়, এটা আপনি{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Date and Time Functions
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
              title="মেয়াদ পেরোনো Hold সরানো, USING দিয়ে"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

DELETE FROM del_bookings AS b
USING departures AS d
WHERE b.departure_id = d.departure_id
  AND b.status = 'pending'
  AND d.starts_on < DATE '2026-11-01' + 30
RETURNING b.booking_id, b.customer_id, d.departure_id, d.starts_on;

SELECT booking_id, departure_id, status
FROM del_bookings
WHERE status = 'pending';`}
              caption="তিনটা Booking মুছল: 14 (Departure 8, যাত্রা 2026-11-20), 20 আর 24 (দুটোই Departure 14, যাত্রা 2026-11-14)। লক্ষ্য করুন, RETURNING এ departures এর Column ও ফেরত আনা গেছে। শেষের SELECT এ একটাই pending বাকি: Booking 17, কারণ তার Departure 11 এর যাত্রা 2026-12-04, 30 দিনের বাইরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DelUsingDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই কাজ USING ছাড়াও হয়। PostgreSQL এর Docs নিজেই বলে, আরেক Table এর তথ্য দেখে মোছার দুটো উপায় আছে: Subquery, অথবা USING,
                আর কোনটা ভালো সেটা পরিস্থিতির উপর নির্ভর করে। Subquery র দুটো রূপ আপনি{" "}
                <Link href="/sql/topic/in-exists-any-all" className={LINK}>
                  Module 07
                </Link>{" "}
                এ শিখেছেন: IN আর EXISTS। নিচের বক্সে দুটো রূপেই একই তিনটা Booking বাছাই হয়, SELECT দিয়ে, যাতে আগে দেখে নেওয়ার অভ্যাসটাও থাকে।
                SELECT এর জায়গায় DELETE লিখলেই মোছার Query তৈরি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই বাছাই, IN আর EXISTS দিয়ে"
              query={`SELECT booking_id
FROM bookings
WHERE status = 'pending'
  AND departure_id IN (
    SELECT departure_id FROM departures
    WHERE starts_on < DATE '2026-11-01' + 30
  )
ORDER BY booking_id;

SELECT booking_id
FROM bookings AS b
WHERE status = 'pending'
  AND EXISTS (
    SELECT 1 FROM departures AS d
    WHERE d.departure_id = b.departure_id
      AND d.starts_on < DATE '2026-11-01' + 30
  )
ORDER BY booking_id;`}
              caption="দুটো Query ই 14, 20, 24 দেয়, USING এর ফলাফলের সাথে হুবহু মিল। এই বক্স শুধু পড়ে, কিছু মোছে না। কোনটা লিখবেন? যেটা আপনার দলের কাছে পড়তে সহজ। PostgreSQL এর Planner তিনটাকে প্রায়ই একই রকম Plan এ চালায়, সেটা Module 13 এ EXPLAIN দিয়ে দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার USING এর সবচেয়ে বিপজ্জনক ফাঁদ। ধরুন তাড়াহুড়োয় জোড়ার শর্তটা, <code className={CODE}>b.departure_id = d.departure_id</code>,
              লিখতে ভুলে গেলেন। তখন প্রতিটা Booking এর সাথে প্রতিটা Departure জোড়া হয়, ঠিক{" "}
              <Link href="/sql/topic/cross-join" className={LINK}>
                CROSS JOIN
              </Link>{" "}
              এর মতো। আর একটা pending Booking এর জন্য &quot;30 দিনের ভেতরের কোনো একটা Departure&quot; তো আছেই। ফল দেখুন, অবশ্যই নকল Table এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ: জোড়ার শর্ত ছাড়া USING"
              query={`DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;

DELETE FROM del_bookings AS b
USING departures AS d
WHERE b.status = 'pending'
  AND d.starts_on < DATE '2026-11-01' + 30;

SELECT count(*) AS pending_left FROM del_bookings WHERE status = 'pending';`}
              caption="DELETE 4, pending_left 0। Booking 17 ও চলে গেল, যার যাত্রা 4 December এ। কোনো Error নেই, কোনো সতর্কবার্তা নেই। শর্তটা Booking কে তার নিজের Departure এর সাথে না জুড়ে যেকোনো Departure এর সাথে জুড়েছে। এখানে 1টা বাড়তি Row গেল, আসল Database এ যেত হাজারটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "USING লিখলে প্রথমে জোড়ার শর্ত",
          content: (
            <ContentParagraph>
              অভ্যাস করুন: USING লেখার পরের লাইনেই, অন্য কোনো শর্তের আগে, দুই Table জোড়ার শর্তটা লিখুন। আর চালানোর আগে DELETE কে SELECT বানিয়ে
              দেখুন: <code className={CODE}>SELECT b.booking_id FROM del_bookings AS b, departures AS d WHERE ...</code>। একই Booking বারবার
              আসা, বা প্রত্যাশার চেয়ে অনেক বেশি Row, মানে জোড়ার শর্তে গোলমাল।
            </ContentParagraph>
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
                  একটা স্থানীয় বাজারের Report এর জন্য Starter Query <code className={CODE}>del_ex3_bookings</code> নামে bookings এর নকল বানায়।
                  USING দিয়ে আসল <code className={CODE}>customers</code> Table দেখে সেই সব Booking মুছুন যাদের Customer এর country{" "}
                  <strong>Bangladesh না</strong>। শেষের যাচাইয়ের Query টা শেষ Statement হিসেবে রাখুন: সে বাকি Booking গুলোর id ক্রমানুসারে দেখায়।
                </>
              }
              hint={
                <>
                  <code className={CODE}>DELETE FROM del_ex3_bookings AS b USING customers AS c WHERE ...</code>। প্রথম শর্ত জোড়ার:{" "}
                  <code className={CODE}>b.customer_id = c.customer_id</code>। দ্বিতীয়টা বাছাইয়ের:{" "}
                  <code className={CODE}>{"c.country <> 'Bangladesh'"}</code>। জোড়ার শর্ত ভুলে গেলে সব Booking মুছে যাবে, কারণ বিদেশি Customer
                  অন্তত একজন তো আছেনই।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex3_bookings;
CREATE TABLE del_ex3_bookings AS SELECT * FROM bookings;

-- এখানে DELETE ... USING customers লিখুন

SELECT booking_id
FROM del_ex3_bookings
ORDER BY booking_id;`}
              solution={`SELECT b.booking_id
FROM bookings AS b
JOIN customers AS c USING (customer_id)
WHERE c.country = 'Bangladesh'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "foreign-keys",
      subHeader: { index: "005", title: "Foreign Keys" },
      title: <SectionTitle>Foreign Key: মোছা আটকায়, নাকি সাথে নিয়ে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দুটো Account মোছার অনুরোধ। Island Tours এ <code className={CODE}>bookings.customer_id</code> একটা Foreign Key, যা{" "}
                <code className={CODE}>customers</code> কে দেখায়। আর <code className={CODE}>payments.booking_id</code> দেখায় bookings কে। মানে
                একটা শিকল: Customer থেকে Booking, Booking থেকে Payment। কোনো Customer কে মুছতে গেলে PostgreSQL প্রথমে দেখে, কেউ কি এখনো তাকে
                দেখাচ্ছে?
              </ContentParagraph>
              <ContentParagraph>
                কেউ দেখালে কী হবে, সেটা ঠিক হয় Foreign Key বানানোর সময়ের ON DELETE নিয়ম দিয়ে, যা আপনি{" "}
                <Link href="/sql/topic/foreign-keys" className={LINK}>
                  Foreign Keys
                </Link>{" "}
                লেসনে পাঁচটাই দেখেছেন। দুটো এখানে সবচেয়ে জরুরি:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NO ACTION (কিছু না লিখলে এটাই):</strong> কেউ দেখালে মোছা বাতিল, Error 23503। RESTRICT প্রায় একই, শুধু যাচাই আরও
                  আগে হয়।
                </ListItem>
                <ListItem>
                  <strong>CASCADE:</strong> Parent মুছলে যারা তাকে দেখায় তারাও মোছে, আর তাদের যারা দেখায় তারাও, শিকলের শেষ পর্যন্ত।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্স আসল Table গুলোর নকল বানায়, সাধারণ Foreign Key সহ, তারপর দুটো Account মোছার চেষ্টা করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Imran যায়, Oliver আটকায়"
              query={`${FK_SETUP}

DELETE FROM del_fk_customers
WHERE customer_id = 15
RETURNING customer_id, full_name;

DELETE FROM del_fk_customers WHERE customer_id = 11;`}
              caption="Imran Kabir (Customer 15) নির্বিঘ্নে মুছলেন, কারণ কোনো Booking তাকে দেখায় না। Oliver এর বেলায় Error 23503: update or delete on table del_fk_customers violates foreign key constraint del_fk_bookings_customer_id_fkey, আর DETAIL বলে Key (customer_id)=(11) is still referenced from table del_fk_bookings। Error টা শেষ Statement এ, কোনো খোলা Transaction এর ভেতরে না, তাই কিছুই আটকে থাকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Error টা আসলে একটা উপকার। Database বলছে: &quot;এই মানুষটার সাথে ইতিহাস জড়িয়ে আছে, আপনি কি নিশ্চিত?&quot; তবু কেউ জোর করে
                মুছতে চাইলে শিকলের নিচ থেকে উপরে যেতে হয়: আগে Payment, তারপর Booking, শেষে Customer। নিচের বক্সে সেটাই, আর শেষে একটা হিসাব যা
                দেখাবে এর দাম কত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিচ থেকে উপরে মোছা, আর তার দাম"
              query={`${FK_SETUP}

DELETE FROM del_fk_payments
WHERE booking_id IN (SELECT booking_id FROM del_fk_bookings WHERE customer_id = 11)
RETURNING payment_id, booking_id, amount_bdt, status;

DELETE FROM del_fk_bookings
WHERE customer_id = 11
RETURNING booking_id, status, total_bdt;

DELETE FROM del_fk_customers
WHERE customer_id = 11
RETURNING customer_id, full_name;

SELECT (SELECT count(*) FROM del_fk_customers) AS customers,
       (SELECT count(*) FROM del_fk_bookings)  AS bookings,
       (SELECT count(*) FROM del_fk_payments)  AS payments,
       (SELECT sum(amount_bdt) FROM del_fk_payments WHERE status = 'paid') AS paid_bdt;`}
              caption="প্রথমে Payment 16 (Booking 19, 28000.00, paid), তারপর Booking 12 আর 19, শেষে Oliver নিজে। তিনটা DELETE ই সফল। কিন্তু শেষের হিসাব দেখুন: customers 14, bookings 22, payments 18, আর paid_bdt 423600.00 থেকে নেমে 395600.00। একজন গ্রাহকের অনুরোধ রাখতে গিয়ে কোম্পানির খাতা থেকে 28000 টাকার আয় মুছে গেল, যে টাকা সত্যিই এসেছিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CASCADE একই কাজ করে, শুধু চুপচাপ, এক লাইনে। এটাই তার বিপদ। নিচের বক্সে একই নকল, কিন্তু প্রতিটা Foreign Key তে ON DELETE CASCADE।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CASCADE: এক লাইনে সব"
              query={`${FK_CASCADE_SETUP}

DELETE FROM del_fk_customers WHERE customer_id = 11;

SELECT (SELECT count(*) FROM del_fk_bookings) AS bookings,
       (SELECT count(*) FROM del_fk_payments) AS payments,
       (SELECT sum(amount_bdt) FROM del_fk_payments WHERE status = 'paid') AS paid_bdt;`}
              caption="উত্তর শুধু DELETE 1। দেখে মনে হয় একটা Row গেল। কিন্তু হিসাব বলে bookings 22, payments 18, paid_bdt 395600.00: আগের বক্সের তিনটা DELETE এর ফল একটাতেই। Command Tag শুধু প্রথম Table এর সংখ্যা জানায়, CASCADE এ আর কী কী গেল তা বলে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DelChainSplit />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "CASCADE কোথায় ঠিক, কোথায় বিপদ",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                CASCADE ঠিক সেখানে, যেখানে Child এর Parent ছাড়া কোনো অর্থ নেই আর তার নিজের কোনো ইতিহাসের মূল্য নেই: একটা Shopping Cart মুছলে
                তার ভেতরের জিনিসের তালিকা, একটা Draft মুছলে তার Attachment এর তালিকা। কিন্তু Booking আর Payment এর মতো যেকোনো কিছু যা টাকা,
                আইন বা ইতিহাসের সাথে জড়িত, সেখানে CASCADE মানে একটা ভুল DELETE এ কোম্পানির ইতিহাসের একটা অংশ চুপচাপ উধাও।
              </ContentParagraph>
              <ContentParagraph>
                তাই Island Tours এর Foreign Key গুলোতে কোনো ON DELETE লেখা নেই, মানে NO ACTION। এটা ইচ্ছাকৃত: Database নিজেই পাহারাদার।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "never-delete-payments",
      subHeader: { index: "006", title: "Rows You Never Delete" },
      title: <SectionTitle>কিছু Row কখনো মোছা হয় না: Payment এর খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হিসাবরক্ষকের সেই কথায় ফিরি। টাকার খাতার একটা পুরনো নিয়ম আছে, শত বছরের পুরনো: খাতায় একবার যা লেখা হলো, তা কেটে বা ছিঁড়ে
                ফেলা যায় না। ভুল হলে বা টাকা ফেরত দিলে উল্টো একটা নতুন লাইন লেখা হয়। কেন এত কড়াকড়ি? কারণ টাকার প্রতিটা নড়াচড়ার একটা
                বাইরের সাক্ষী আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>bKash, Nagad, Card Company আর Bank:</strong> তাদের নিজেদের Statement এ প্রতিটা লেনদেন থাকে। মাস শেষে দুই হিসাব মেলানো
                  হয়, যাকে Reconciliation বলে। আপনার Database থেকে একটা Payment মুছে গেলে তাদের Statement এর একটা লাইনের কোনো জোড়া থাকে না।
                </ListItem>
                <ListItem>
                  <strong>Tax আর Audit:</strong> প্রায় সব দেশে ব্যবসাকে আর্থিক রেকর্ড কয়েক বছর রেখে দিতে হয়। কত বছর, তা দেশ আর ব্যবসাভেদে
                  আলাদা, আপনার হিসাবরক্ষকের কাছে জেনে নিন। কিন্তু &quot;মুছে ফেলেছি&quot; কোনো দেশেই উত্তর না।
                </ListItem>
                <ListItem>
                  <strong>বিরোধ আর ফেরত:</strong> একজন গ্রাহক ছয় মাস পরে বললেন, &quot;আমি তো টাকা দিয়েছিলাম।&quot; Payment এর Row টাই তখন
                  একমাত্র প্রমাণ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এর Database এই নিয়ম আগে থেকেই মানে। Booking 5 বাতিল হয়েছিল, টাকা ফেরত গেছে, কিন্তু তার Payment মোছা হয়নি:{" "}
                <code className={CODE}>status</code> বদলে <code className={CODE}>refunded</code> হয়েছে। Booking 14 এর bKash Payment ব্যর্থ
                হয়েছিল, সেটাও আছে, <code className={CODE}>failed</code> হয়ে। দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফেরত আর ব্যর্থ Payment, দুটোই খাতায়"
              query={`SELECT b.booking_id, b.status AS booking_status,
       p.payment_id, p.amount_bdt, p.method, p.status AS payment_status, p.paid_at
FROM bookings AS b
JOIN payments AS p USING (booking_id)
WHERE b.booking_id IN (5, 14);

SELECT status, count(*) AS payments, sum(amount_bdt) AS amount_bdt
FROM payments
GROUP BY status
ORDER BY status;`}
              caption="Booking 5 বাতিল, তার Payment 5 (17000.00, bkash) refunded। Booking 14 pending, তার Payment 13 (50000.00, bkash) failed। দ্বিতীয় Table পুরো খাতার ছবি: failed 1টা 50000.00, paid 17টা 423600.00, refunded 1টা 17000.00। আয়ের হিসাব শুধু paid যোগ করে, কিন্তু বাকি দুটো লাইনও আছে, কারণ bKash এর Statement এও আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক কোম্পানি আরও এক ধাপ যায়। ফেরতকে status বদল না করে উল্টো একটা নতুন Row হিসেবে লেখে, ঋণাত্মক অঙ্কে। একে Reversal Entry
                বলে। তখন খাতা শুধু বাড়ে, কখনো কিছু বদলায় না বা মোছে না, যাকে Append-only খাতা বলে। কোনো Booking এর আসল অবস্থা জানতে সব
                লাইন যোগ করলেই হয়। একটা ছোট নকল খাতায় দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Reversal Entry: মোছার বদলে উল্টো লাইন"
              query={`DROP TABLE IF EXISTS del_ledger;
CREATE TABLE del_ledger (
  entry_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id integer NOT NULL,
  amount_bdt numeric(10, 2) NOT NULL,
  note       text NOT NULL,
  entered_at timestamptz NOT NULL
);
INSERT INTO del_ledger (booking_id, amount_bdt, note, entered_at) VALUES
  (5,  17000.00, 'bKash payment received', TIMESTAMPTZ '2026-01-06 12:19:00+06'),
  (5, -17000.00, 'refund for cancelled booking', TIMESTAMPTZ '2026-01-08 11:00:00+06'),
  (1,  25000.00, 'bKash payment received', TIMESTAMPTZ '2025-12-20 10:21:00+06');

SELECT booking_id, count(*) AS entries, sum(amount_bdt) AS balance_bdt
FROM del_ledger
GROUP BY booking_id
ORDER BY booking_id;`}
              caption="Booking 1 এর একটা লাইন, ব্যালান্স 25000.00। Booking 5 এর দুটো লাইন, টাকা আসা আর ফেরত যাওয়া, ব্যালান্স 0.00। কিছুই মোছা হয়নি, তবু হিসাব ঠিক, আর কবে কী হয়েছিল তার পুরো গল্প খাতায়। ফেরতের তারিখটা এখানে উদাহরণ, আসল Database এ সেটা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পাহারা Database এর হাতেও দিন",
          content: (
            <ContentParagraph>
              &quot;Payment কখনো মুছবেন না&quot; শুধু একটা নিয়ম হয়ে থাকলে একদিন কেউ ভুলবেই। তাই বড় দলগুলো এটা Database দিয়েই আটকায়। App যে
              User দিয়ে Database এ ঢোকে, তার কাছ থেকে payments এ DELETE এর অনুমতি সরিয়ে নেওয়া হয়, যা আপনি{" "}
              <Link href="/sql/topic/least-privilege-app-user" className={LINK}>
                Module 16
              </Link>{" "}
              এ শিখবেন। অথবা একটা Trigger বসানো হয় যা যেকোনো DELETE কে Error দিয়ে থামায়, সেটা{" "}
              <Link href="/sql/topic/triggers" className={LINK}>
                Module 14
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "soft-delete",
      subHeader: { index: "007", title: "Soft Delete" },
      title: <SectionTitle>Soft Delete: মুছে না ফেলে চিহ্ন দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে এমন কিছু যা ব্যবহারকারীর চোখ থেকে সরাতে হবে, কিন্তু Database থেকে সরানো যাবে না, তার কী হবে? উত্তর Soft Delete: Row টা
                মোছেন না, শুধু একটা Column এ লিখে রাখেন যে এটা মুছে ফেলা ধরা হচ্ছে। তারপর যেখানে যেখানে জীবিত Row দরকার, সেখানে সেই Column দিয়ে
                Filter করেন।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে প্রচলিত রূপ একটা <code className={CODE}>deleted_at timestamptz</code> Column:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NULL মানে জীবিত।</strong> নতুন Row এ এটা ফাঁকা থাকে, কোনো DEFAULT লাগে না।
                </ListItem>
                <ListItem>
                  <strong>একটা সময় মানে মুছে ফেলা।</strong> &quot;মোছা&quot; এখন একটা UPDATE:{" "}
                  <code className={CODE}>SET deleted_at = now()</code>। সাথে বিনামূল্যে জানা যায় কবে মোছা হয়েছিল।
                </ListItem>
                <ListItem>
                  <strong>ফেরত আনা আরেকটা UPDATE:</strong> <code className={CODE}>SET deleted_at = NULL</code>। কোনো Backup লাগে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কেউ কেউ <code className={CODE}>is_deleted boolean</code> ব্যবহার করেন। সেটাও চলে, কিন্তু তাতে শুধু হ্যাঁ বা না থাকে, কবে মুছল তা
                জানতে আলাদা Column লাগে। অনেক দল আরও দুটো Column যোগ করে: <code className={CODE}>deleted_by</code> (কে মুছলেন) আর{" "}
                <code className={CODE}>delete_reason</code> (কেন)। এগুলো পরে Support আর Audit এ অমূল্য।
              </ContentParagraph>
              <ContentParagraph>
                এই বক্সগুলোতে আমরা <code className={CODE}>now()</code> এর বদলে একটা নির্দিষ্ট সময় লিখব,{" "}
                <code className={CODE}>{"TIMESTAMPTZ '2026-11-01 10:00:00+06'"}</code>, যাতে আপনি আর আমি একই ফলাফল দেখি। আসল App এ এখানে{" "}
                <code className={CODE}>now()</code> থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Family Package কে Soft Delete"
              query={`${TOURS_SETUP}

UPDATE del_tours
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE tour_id = 9
RETURNING tour_id, title, is_active, deleted_at;

SELECT count(*) AS all_rows,
       count(*) FILTER (WHERE deleted_at IS NULL) AS live_rows,
       count(*) FILTER (WHERE NOT is_active) AS inactive_rows
FROM del_tours;`}
              caption="Cox's Bazar Family Package এর Partner Hotel চুক্তি বাতিল করেছে, তাই এই Tour আর থাকবে না। UPDATE এর রসিদে tour_id 9, is_active এখনো t, আর deleted_at 2026-11-01 10:00:00+06। তারপর গুনে দেখুন: all_rows 9, live_rows 8, inactive_rows 1। Row টা Table এ আছে, শুধু জীবিতদের তালিকায় নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ সংখ্যাটা লক্ষ্য করুন: inactive_rows 1। সেটা Family Package না, Saint Martin Luxury Stay, যার{" "}
                <code className={CODE}>is_active</code> false। এখানে দুটো আলাদা ধারণা, গুলিয়ে ফেলবেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>is_active false:</strong> ব্যবসার একটা অবস্থা। Tour টা আছে, এখন বিক্রি হচ্ছে না, হয়তো আগামী শীতে আবার চালু হবে। Luxury
                  Stay এর একটা Departure এখনো তালিকায় আছে, ফেব্রুয়ারি 2027 এ।
                </ListItem>
                <ListItem>
                  <strong>deleted_at একটা সময়:</strong> এই Row টা ব্যবহারকারীর কাছে আর নেই। কেউ ভুল করে বানিয়েছিল, বা চিরতরে বন্ধ। এটা রাখা
                  শুধু ইতিহাস আর ফেরত আনার সুযোগের জন্য।
                </ListItem>
              </ContentList>
              <ContentParagraph>এবার ফেরত আনা। ধরুন Hotel আবার রাজি হলো।</ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফেরত আনা: deleted_at আবার NULL"
              query={`${TOURS_SETUP}
UPDATE del_tours
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE tour_id = 9;

UPDATE del_tours
SET deleted_at = NULL
WHERE tour_id = 9
RETURNING tour_id, title, deleted_at;

SELECT count(*) FILTER (WHERE deleted_at IS NULL) AS live_rows FROM del_tours;`}
              caption="প্রথম UPDATE মোছে, দ্বিতীয়টা ফেরত আনে। রসিদে deleted_at ফাঁকা, আর live_rows আবার 9। DELETE এর পরে এটা সম্ভব ছিল শুধু Backup থেকে, ঘণ্টার কাজ। এখানে এক লাইন। Soft Delete এর সবচেয়ে বড় উপহার এটাই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DelSoftLifecycleDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  Starter Query <code className={CODE}>del_ex4_customers</code> নামে customers এর একটা নকল বানায় আর তাতে{" "}
                  <code className={CODE}>deleted_at</code> Column যোগ করে। একটা UPDATE লিখে Soft Delete করুন সেই সব Customer কে যাদের এমন কোনো
                  Booking নেই যা cancelled না। মানে যাদের কোনো Booking ই নেই, অথবা সব Booking ই বাতিল। Booking দেখবেন আসল{" "}
                  <code className={CODE}>bookings</code> Table থেকে। deleted_at এ লিখুন ঠিক{" "}
                  <code className={CODE}>{"TIMESTAMPTZ '2026-11-01 10:00:00+06'"}</code>। শেষের যাচাইয়ের Query শেষ Statement হিসেবে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>UPDATE del_ex4_customers AS c SET deleted_at = ... WHERE NOT EXISTS (...)</code>। ভেতরের Subquery:{" "}
                  <code className={CODE}>{"SELECT 1 FROM bookings AS b WHERE b.customer_id = c.customer_id AND b.status <> 'cancelled'"}</code>।
                  শুধু &quot;কোনো Booking নেই&quot; খুঁজলে Imran আসেন, কিন্তু Sabbir Hossain বাদ পড়েন, যার একমাত্র Booking টা বাতিল।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex4_customers;
CREATE TABLE del_ex4_customers AS SELECT * FROM customers;
ALTER TABLE del_ex4_customers ADD COLUMN deleted_at timestamptz;

-- এখানে আপনার Soft Delete (UPDATE) লিখুন

SELECT count(*) FILTER (WHERE deleted_at IS NULL) AS live_customers,
       string_agg(customer_id::text, ',' ORDER BY customer_id)
         FILTER (WHERE deleted_at IS NOT NULL) AS deleted_ids,
       max(deleted_at) AS deleted_at
FROM del_ex4_customers;`}
              solution={`SELECT count(*) FILTER (WHERE active),
       string_agg(customer_id::text, ',' ORDER BY customer_id) FILTER (WHERE NOT active),
       TIMESTAMPTZ '2026-11-01 10:00:00+06'
FROM (
  SELECT c.customer_id,
         EXISTS (SELECT 1 FROM bookings AS b
                 WHERE b.customer_id = c.customer_id
                   AND b.status <> 'cancelled') AS active
  FROM customers AS c
) AS s;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "soft-delete-cost",
      subHeader: { index: "008", title: "The Cost of Soft Delete" },
      title: <SectionTitle>Soft Delete এর দাম: প্রতিটা Query তে মনে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Soft Delete শুনতে নিখুঁত, কিন্তু এর একটা দাম আছে, আর দামটা মেটাতে হয় প্রতিদিন। Database এর কাছে deleted_at শুধু আরেকটা Column।
                সে জানে না এর মানে &quot;এই Row টা আর নেই&quot;। তাই প্রতিটা Query লেখার সময় আপনাকে মনে রাখতে হয় Filter দেবেন কিনা। একবার ভুললেই
                মুছে ফেলা জিনিস ফিরে আসে।
              </ContentParagraph>
              <ContentParagraph>
                এবার customers এ Soft Delete। নিচের বক্সে Oliver কে Soft Delete করা একটা নকল, তারপর দুটো প্রশ্ন, প্রতিটা দুইভাবে। প্রথমটা: এই
                মাসের অফারের Newsletter কতজনকে যাবে? দ্বিতীয়টা: confirmed Booking থেকে আয় কত?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Filter, দুই প্রশ্নে দুই রকম উত্তর"
              query={`${SOFT_SETUP}

SELECT count(*) AS newsletter_without_filter FROM del_soft_customers;
SELECT count(*) AS newsletter_with_filter
FROM del_soft_customers
WHERE deleted_at IS NULL;

SELECT sum(b.total_bdt) AS revenue_with_filter
FROM del_soft_bookings AS b
JOIN del_soft_customers AS c USING (customer_id)
WHERE b.status = 'confirmed' AND c.deleted_at IS NULL;

SELECT sum(total_bdt) AS revenue_without_filter
FROM del_soft_bookings
WHERE status = 'confirmed';`}
              caption="Newsletter: Filter ছাড়া 15, Filter দিয়ে 14। এখানে Filter ছাড়া Query ভুল, কারণ যিনি তথ্য মুছতে বলেছেন তাকেই অফার পাঠানো হবে। আয়: Filter দিয়ে 395600.00, Filter ছাড়া 423600.00। এখানে উল্টো, Filter দেওয়াটা ভুল, কারণ Oliver এর Booking 19 সত্যিই হয়েছিল। একই Column, একই নিয়ম, কিন্তু কোন প্রশ্নে Filter লাগবে তা ঠিক করে প্রশ্নটা, Column না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ এমন পাঁচটা Query, যেগুলো যেকোনো App প্রতিদিন চালায়। প্রতিটার জন্য Filter বেছে দেখুন কোনটা ঠিক উত্তর দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ForgottenFilterLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় দাম আরও লুকানো: Foreign Key Soft Delete চেনে না। Foreign Key শুধু দেখে Parent Row আছে কিনা, আর Soft Delete করা Row তো
                আছেই। তাই মুছে ফেলা ধরা একজন Customer এর নামে নতুন Booking অনায়াসে ঢুকে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মুছে ফেলা Customer এর নামে নতুন Booking"
              query={`${SOFT_SETUP}

INSERT INTO del_soft_bookings
  (booking_id, customer_id, departure_id, seats, status, total_bdt, booked_at)
VALUES
  (25, 11, 10, 1, 'pending', 8500.00, TIMESTAMPTZ '2026-11-01 11:00:00+06')
RETURNING booking_id, customer_id, status;

SELECT b.booking_id, c.full_name, c.deleted_at
FROM del_soft_bookings AS b
JOIN del_soft_customers AS c USING (customer_id)
WHERE b.booking_id = 25;`}
              caption="INSERT সফল: Booking 25, Customer 11, pending। দ্বিতীয় SELECT দেখায় এই Booking এর মালিক Oliver Bennett, যার deleted_at 2026-11-01 10:00:00+06। সাধারণ DELETE এ এটা অসম্ভব হতো, কারণ Foreign Key Error দিত। Soft Delete এ এই পাহারা App এর Code কে দিতে হয়, অথবা একটা Trigger কে, যা Module 14 এ শিখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>পুরো দামের তালিকা, যাতে Soft Delete বেছে নেওয়ার আগে জেনেশুনে নেন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা Query তে সিদ্ধান্ত:</strong> Filter লাগবে কিনা, আর কোনটা। একজন নতুন Developer দলে এলে তাকে শুরুতেই এটা শেখাতে
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>Foreign Key আর CASCADE কাজ করে না:</strong> Customer কে Soft Delete করলে তার Booking নিজে থেকে কিছু জানে না। সেগুলোরও
                  কিছু হওয়া দরকার হলে সেটাও আপনার Code এ।
                </ListItem>
                <ListItem>
                  <strong>UNIQUE ভাঙে:</strong> মুছে ফেলা Row ও তার Email ধরে রাখে। পরের Section এ এর সমাধান।
                </ListItem>
                <ListItem>
                  <strong>Table শুধু বাড়ে:</strong> কিছু কখনো যায় না, তাই Index আর Table বড় হতে থাকে, আর প্রতিটা Query মরা Row পার হয়ে জীবিত
                  Row খোঁজে।
                </ListItem>
                <ListItem>
                  <strong>তথ্য আসলে মোছে না:</strong> গ্রাহক তার ব্যক্তিগত তথ্য মুছতে বললে Soft Delete একা যথেষ্ট না। নাম, Email, ফোন তখনো
                  Database এ, আর Backup এ। এর উত্তর Anonymize, এই লেসনেই আসছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "soft-delete-unique",
      subHeader: { index: "009", title: "Soft Delete and UNIQUE" },
      title: <SectionTitle>Soft Delete আর UNIQUE: Partial Unique Index</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছয় মাস পরে Oliver আবার Island Tours এ ফিরতে চাইলেন, একই Email দিয়ে Sign up করলেন। Email Column এ UNIQUE আছে, যাতে দুটো Account
                একই Email না পায়। কিন্তু তার পুরনো, মুছে ফেলা Row টা এখনো সেই Email ধরে আছে। UNIQUE জানে না যে ওটা মুছে ফেলা ধরা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাধারণ UNIQUE: ফিরে আসা যায় না"
              query={`DROP TABLE IF EXISTS del_accounts;
CREATE TABLE del_accounts (
  account_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  full_name  text NOT NULL,
  deleted_at timestamptz
);
INSERT INTO del_accounts (email, full_name) VALUES
  ('oliver.bennett@mail.example', 'Oliver Bennett'),
  ('priya.sharma@mail.example',   'Priya Sharma');
UPDATE del_accounts
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE email = 'oliver.bennett@mail.example';

INSERT INTO del_accounts (email, full_name)
VALUES ('oliver.bennett@mail.example', 'Oliver Bennett');`}
              caption="শেষ INSERT এ Error 23505: duplicate key value violates unique constraint del_accounts_email_key, DETAIL: Key (email)=(oliver.bennett@mail.example) already exists। মুছে ফেলা Row টা Email আটকে রেখেছে। Hard Delete হলে এই সমস্যা হতো না, Soft Delete এর এটা নিজস্ব সমস্যা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান একটা <strong>Partial Unique Index</strong>। Index মানে বইয়ের শেষের সূচির মতো একটা আলাদা কাঠামো, যা Database কে দ্রুত
                খুঁজতে সাহায্য করে, আর UNIQUE Index একই মান দুবার ঢুকতে দেয় না। Partial মানে এই সূচিতে সব Row ঢোকে না, শুধু একটা WHERE শর্ত মেলা
                Row। আমরা বলব: Email অনন্য হবে শুধু জীবিত Row গুলোর মধ্যে।
              </ContentParagraph>
              <ContentParagraph>
                Index এর গভীর গল্প, কীভাবে বানানো হয় আর কখন সাহায্য করে, পুরোটা{" "}
                <Link href="/sql/topic/partial-expression-covering" className={LINK}>
                  Module 13
                </Link>{" "}
                এ। আজ শুধু এই একটা ব্যবহার, কারণ Soft Delete এর সাথে এটা প্রায় সবসময় লাগে। একটা জিনিস খেয়াল করুন: Column এ আর UNIQUE লেখা নেই,
                নিয়মটা এখন পুরোপুরি Index এর হাতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Partial Unique Index: শুধু জীবিতদের মধ্যে অনন্য"
              query={`DROP TABLE IF EXISTS del_accounts;
CREATE TABLE del_accounts (
  account_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  full_name  text NOT NULL,
  deleted_at timestamptz
);
CREATE UNIQUE INDEX del_accounts_live_email
  ON del_accounts (email)
  WHERE deleted_at IS NULL;
INSERT INTO del_accounts (email, full_name) VALUES
  ('oliver.bennett@mail.example', 'Oliver Bennett'),
  ('priya.sharma@mail.example',   'Priya Sharma');
UPDATE del_accounts
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE email = 'oliver.bennett@mail.example';

INSERT INTO del_accounts (email, full_name)
VALUES ('oliver.bennett@mail.example', 'Oliver Bennett');

SELECT account_id, email, deleted_at
FROM del_accounts
ORDER BY account_id;

INSERT INTO del_accounts (email, full_name)
VALUES ('priya.sharma@mail.example', 'Priya Sharma');`}
              caption="Oliver এর নতুন Sign up সফল: Table এ এখন তিনটা Row, account 1 (পুরনো Oliver, deleted_at 2026-11-01 10:00:00+06), 2 (Priya) আর 3 (নতুন Oliver, deleted_at ফাঁকা)। কিন্তু শেষ INSERT এ দ্বিতীয় জীবিত Priya ঢুকতে গেলে Error 23505, এবার del_accounts_live_email Index এর নামে। পাহারা আছে, শুধু মুছে ফেলা Row গুলো তার বাইরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DelUniqueSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেকে প্রথমে একটা সহজ বুদ্ধি খাটান: &quot;UNIQUE টা email আর deleted_at দুটো মিলিয়ে দিই, তাহলে মুছে ফেলা Row এর deleted_at আলাদা
                বলে নতুন Row ঢুকবে।&quot; শুনতে যুক্তিসঙ্গত। কিন্তু{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                লেসনের কথা মনে করুন: UNIQUE এর চোখে দুটো NULL সমান না। আর জীবিত প্রতিটা Row এর deleted_at তো NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদ: UNIQUE (email, deleted_at)"
              query={`DROP TABLE IF EXISTS del_accounts;
CREATE TABLE del_accounts (
  account_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  full_name  text NOT NULL,
  deleted_at timestamptz,
  UNIQUE (email, deleted_at)
);
INSERT INTO del_accounts (email, full_name) VALUES
  ('priya.sharma@mail.example', 'Priya Sharma'),
  ('priya.sharma@mail.example', 'Priya Sharma');

SELECT email, count(*) AS live_accounts
FROM del_accounts
WHERE deleted_at IS NULL
GROUP BY email;`}
              caption="দুটো INSERT ই সফল, আর শেষের Query বলে priya.sharma@mail.example এর জীবিত Account 2টা। যে নিয়মের জন্য UNIQUE বসানো, ঠিক সেটাই ভাঙল, কোনো Error ছাড়া। কারণ দুই Row এর deleted_at ই NULL, আর UNIQUE দুটো NULL কে আলাদা ধরে। PostgreSQL 15 থেকে UNIQUE NULLS NOT DISTINCT দিলে এই ফাঁদ বন্ধ হয়, কিন্তু তখন একই Email এর দুটো Row ঠিক একই deleted_at পেলে আটকায়, আর MySQL এ এই সুবিধা নেই। Partial Unique Index ই সবচেয়ে পরিষ্কার উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              task={
                <>
                  Starter Query <code className={CODE}>del_ex5_guides</code> বানায়, যেখানে একজন আগেই মুছে ফেলা Guide আর একজন জীবিত Guide আছেন।
                  আরও বানায় <code className={CODE}>del_try</code> নামে একটা ছোট Function, যা একটা Statement চালিয়ে <code className={CODE}>ok</code>{" "}
                  বা Error এর SQLSTATE ফেরত দেয়। আপনার কাজ একটা <code className={CODE}>CREATE UNIQUE INDEX</code> লেখা, যাতে ফোন নম্বর শুধু জীবিত
                  Guide দের মধ্যে অনন্য হয়। শেষের যাচাইয়ের Query চারটা পরীক্ষা চালায়, সেটা শেষ Statement হিসেবে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CREATE UNIQUE INDEX del_ex5_live_phone ON del_ex5_guides (phone) WHERE deleted_at IS NULL;</code>।
                  প্রত্যাশিত ফল: পুরনো Guide এর নম্বর নতুন কেউ নিতে পারেন (ok), একই নম্বরে দুজন জীবিত Guide না (23505), আর Jamal কে Soft Delete
                  করার পরে তার নম্বর আবার নেওয়া যায় (ok)।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex5_guides;
CREATE TABLE del_ex5_guides (
  guide_id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name  text NOT NULL,
  phone      text NOT NULL,
  deleted_at timestamptz
);
INSERT INTO del_ex5_guides (full_name, phone, deleted_at) VALUES
  ('Old Guide',     '+8801000000299', TIMESTAMPTZ '2026-10-01 10:00:00+06'),
  ('Jamal Hossain', '+8801000000201', NULL);

CREATE OR REPLACE FUNCTION del_try(stmt text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'ok';
EXCEPTION WHEN others THEN
  RETURN SQLSTATE;
END;
$$;

-- এখানে আপনার CREATE UNIQUE INDEX লিখুন

SELECT step, del_try(stmt) AS result
FROM (VALUES
  (1, $$INSERT INTO del_ex5_guides (full_name, phone) VALUES ('New Guide', '+8801000000299')$$),
  (2, $$INSERT INTO del_ex5_guides (full_name, phone) VALUES ('Copy of Jamal', '+8801000000201')$$),
  (3, $$UPDATE del_ex5_guides SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06' WHERE full_name = 'Jamal Hossain'$$),
  (4, $$INSERT INTO del_ex5_guides (full_name, phone) VALUES ('Jamal Again', '+8801000000201')$$)
) AS t(step, stmt)
ORDER BY step;`}
              solution={`SELECT *
FROM (VALUES (1, 'ok'), (2, '23505'), (3, 'ok'), (4, 'ok')) AS v(step, result);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "live-rows-view",
      subHeader: { index: "010", title: "A View of Live Rows" },
      title: <SectionTitle>জীবিত Row এর একটা View</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Query তে <code className={CODE}>WHERE deleted_at IS NULL</code> লিখতে মনে রাখা কঠিন। তাই অনেক দল একটা View বানায়। View
                মানে একটা নাম দেওয়া, সংরক্ষিত SELECT: Table এর মতো দেখতে, Table এর মতো তার থেকে SELECT করা যায়, কিন্তু নিজের কোনো Data নেই।
                প্রতিবার কেউ View থেকে পড়লে PostgreSQL ভেতরের SELECT টা চালায়।
              </ContentParagraph>
              <ContentParagraph>
                ধারণাটা সহজ: Filter একবার View এর ভেতরে লেখা থাকে, আর App এর বেশিরভাগ Query সরাসরি Table না পড়ে View পড়ে। Filter ভোলার সুযোগই
                থাকে না। শুধু যে Query গুলোর সত্যিই মুছে ফেলা Row লাগে, যেমন আয়ের Report বা Admin Panel, সেগুলো আসল Table পড়ে। View এর পুরো গল্প,
                তাতে লেখা যায় কিনা, আর Materialized View কী, সেটা{" "}
                <Link href="/sql/topic/views" className={LINK}>
                  Module 14
                </Link>{" "}
                এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="del_live_tours: Filter একবারই লেখা"
              query={`${TOURS_SETUP}
UPDATE del_tours
SET deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE tour_id = 9;

CREATE VIEW del_live_tours AS
  SELECT tour_id, title, price_bdt, is_active
  FROM del_tours
  WHERE deleted_at IS NULL;

SELECT count(*) AS live_tours FROM del_live_tours;

SELECT tour_id, title, price_bdt
FROM del_live_tours
WHERE price_bdt > 15000
ORDER BY tour_id;`}
              caption="View এ 8টা Tour, Family Package নেই। দ্বিতীয় Query তে 15000 এর বেশি দামের দুটো: Sundarbans Mangrove Cruise (18000.00) আর Saint Martin Luxury Stay (32000.00)। Family Package (15500.00) শর্ত মিললেও আসেনি, কারণ View তাকে আগেই সরিয়েছে। কিন্তু Luxury Stay এসেছে, যদিও সে বিক্রি বন্ধ: View শুধু মুছে ফেলা Row সরায়, is_active এর Filter Website এর Query কে আলাদা দিতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আরও কড়া পাহারা: Row Level Security",
          content: (
            <ContentParagraph>
              View শুধু একটা ভদ্র অনুরোধ: কেউ চাইলে আসল Table পড়তেই পারে। PostgreSQL এ আরও কড়া একটা উপায় আছে, Row Level Security, যেখানে
              Database নিজেই ঠিক করে কোন User কোন Row দেখতে পাবে, এমনকি আসল Table পড়লেও। যেমন App এর User মুছে ফেলা Row দেখতেই পাবে না, আর
              Admin সব দেখবে। এটা{" "}
              <Link href="/sql/topic/row-level-security" className={LINK}>
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
      id: "archive-tables",
      subHeader: { index: "011", title: "Archive Tables" },
      title: <SectionTitle>Archive Table, আর বড় মোছা ভাগে ভাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তৃতীয় উপায় Archive: পুরনো, বন্ধ হয়ে যাওয়া Row গুলো মূল Table থেকে সরিয়ে একটা আলাদা Table এ রাখা। কোনো ইতিহাস হারায় না,
                কিন্তু রোজকার Table হালকা থাকে, তার Index ছোট থাকে, আর রোজকার Query কে পুরনো বছরের Row পার হতে হয় না। Soft Delete এর মতো
                প্রতিটা Query তে Filter ও লাগে না, কারণ মূল Table এ শুধু চালু জিনিস।
              </ContentParagraph>
              <ContentParagraph>
                Archive এর মূল কৌশল হলো সরানোটা একটা Statement এ করা। দুটো আলাদা কমান্ড, আগে INSERT তারপর DELETE, লিখলে মাঝখানে কিছু ভাঙলে
                Row হয় দুই জায়গায় থাকে, নয়তো কোথাও না। PostgreSQL এ উত্তর Data-Modifying CTE: <code className={CODE}>WITH</code> এর ভেতরে DELETE ...
                RETURNING, আর বাইরের INSERT সেই ফেরত আসা Row গুলো Archive এ লেখে। পুরোটা একটা Statement, তাই হয় দুটোই হয়, নয়তো কোনোটাই না।
                PostgreSQL এর Docs এ ঠিক এই উদাহরণ আছে, নাম moved_rows। CTE আপনি{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  Module 07
                </Link>{" "}
                এ শিখেছেন, সেখানে বলেছিলাম Data-Modifying CTE Module 10 এ আসবে। এই সেই জায়গা।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে জুন 2026 এর আগে শুরু হওয়া Departure এর সব Booking Archive এ যায়। Archive Table এ একটা বাড়তি Column থাকে,{" "}
                <code className={CODE}>archived_at</code>, কবে সরানো হলো তার জন্য। <code className={CODE}>CREATE TABLE ... AS ... WITH NO DATA</code>{" "}
                শুধু কাঠামো বানায়, কোনো Row ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ সরানো: DELETE ... RETURNING থেকে INSERT"
              query={`DROP TABLE IF EXISTS del_bookings, del_bookings_archive;
CREATE TABLE del_bookings AS SELECT * FROM bookings;
CREATE TABLE del_bookings_archive AS
  SELECT *, NULL::timestamptz AS archived_at
  FROM bookings
  WITH NO DATA;

WITH moved AS (
  DELETE FROM del_bookings AS b
  USING departures AS d
  WHERE b.departure_id = d.departure_id
    AND d.starts_on < DATE '2026-06-01'
  RETURNING b.*
)
INSERT INTO del_bookings_archive
SELECT moved.*, TIMESTAMPTZ '2026-11-01 10:00:00+06'
FROM moved;

SELECT (SELECT count(*) FROM del_bookings)         AS live_rows,
       (SELECT count(*) FROM del_bookings_archive) AS archived_rows,
       (SELECT min(booking_id) FROM del_bookings_archive) AS first_archived,
       (SELECT max(booking_id) FROM del_bookings_archive) AS last_archived;`}
              caption="উত্তর INSERT 12: একটা Statement এ 12টা Booking মূল Table থেকে গেল আর Archive এ ঢুকল। শেষের হিসাব: live_rows 12, archived_rows 12, Archive এ Booking 1 থেকে 12। এগুলো জানুয়ারি থেকে এপ্রিল 2026 এর যাত্রা, সব শেষ হয়ে গেছে। RETURNING b.* শুধু del_bookings এর Column ফেরত দেয়, departures এর না, তাই Column গুলো Archive এর সাথে হুবহু মেলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা বাস্তব সমস্যা। Island Tours এর Website প্রতিটা Page দেখার একটা Log রাখে, আর দুই বছরে সেটা লাখ লাখ Row। পুরনোগুলো
                সরাতে একটা বিশাল DELETE চালালে কী হয়? সেটা অনেকক্ষণ চলে, যত Row মোছে সবগুলোতে Lock ধরে রাখে, আর Database কে প্রতিটা বদলের হিসাব
                লিখতে হয়, যা Replica তে পাঠাতে দেরি হয়। অন্য কাজ আটকে যেতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                অভিজ্ঞদের উত্তর: ভাগে ভাগে মোছা, প্রতিবার ধরুন 10000 Row, যতক্ষণ না শেষ হয়। মুশকিল হলো PostgreSQL এর DELETE এ LIMIT নেই, Docs
                নিজেই বলে। তাই একটা Subquery প্রথমে 10000টা id বাছে, আর DELETE শুধু সেগুলো মোছে। প্রথম বক্স 50000 Row এর একটা নকল Log বানায়,
                দ্বিতীয় বক্স একবারে একটা ভাগ মোছে। দ্বিতীয় বক্সটা বারবার Run করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথমে: 50000 Row এর একটা Log"
              query={`DROP TABLE IF EXISTS del_logs;
CREATE TABLE del_logs AS
  SELECT g AS log_id,
         DATE '2025-01-01' + (g % 600) AS created_on,
         'page view ' || g AS message
  FROM generate_series(1, 50000) AS g;
ALTER TABLE del_logs ADD PRIMARY KEY (log_id);

SELECT count(*) AS all_rows,
       count(*) FILTER (WHERE created_on < DATE '2026-01-01') AS old_rows
FROM del_logs;`}
              caption="generate_series 1 থেকে 50000 পর্যন্ত সংখ্যা দেয়, আর প্রতিটা Row পায় 2025 এর শুরু থেকে 600 দিনের মধ্যে একটা তারিখ। মোট 50000 Row, তার মধ্যে 30495টা 2026 এর আগের। এগুলোই সরাতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তারপর: একবারে 10000, বারবার Run করুন"
              query={`DELETE FROM del_logs
WHERE log_id IN (
  SELECT log_id
  FROM del_logs
  WHERE created_on < DATE '2026-01-01'
  ORDER BY log_id
  LIMIT 10000
);

SELECT count(*) FILTER (WHERE created_on < DATE '2026-01-01') AS old_rows_left,
       count(*) AS all_rows_left
FROM del_logs;`}
              caption="এই বক্স আগের বক্সের del_logs এর উপর চলে, তাই আগে সেটা Run করুন। প্রথমবার DELETE 10000, old_rows_left 20495, all_rows_left 40000। আবার Run করলে 10495, তারপর 495। চতুর্থবার DELETE 495, আর পঞ্চমবার DELETE 0: কাজ শেষ। আসল Production এ একটা ছোট Script এই কাজটা একটা Loop এ চালায়, প্রতি ভাগের মাঝে একটু থেমে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মোছার জায়গা ফেরত আসে কখন, আর আরও বড় হলে কী",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                DELETE এর পরে Disk এর জায়গা সাথে সাথে খালি হয় না। মোছা Row গুলো মরা Row হয়ে পড়ে থাকে, আর VACUUM নামের একটা কাজ পরে সেই জায়গা
                নতুন Row এর জন্য ফিরিয়ে দেয়।{" "}
                <Link href="/sql/topic/drop-truncate-delete" className={LINK}>
                  Module 09 এর মোছার লেসনে
                </Link>{" "}
                এর একটা ঝলক দেখেছেন, পুরো গল্প{" "}
                <Link href="/sql/topic/vacuum" className={LINK}>
                  Module 18
                </Link>{" "}
                এ।
              </ContentParagraph>
              <ContentParagraph>
                আর যে Table এ প্রতি মাসে লাখ লাখ Row আসে আর যায়, সেখানে বড় দলগুলো DELETE ই করে না। তারা Table কে মাস ধরে টুকরো করে রাখে, যাকে
                Partitioning বলে, আর পুরনো মাসের পুরো টুকরোটা এক কমান্ডে সরিয়ে দেয়। সেটা{" "}
                <Link href="/sql/topic/partitioning" className={LINK}>
                  Module 19
                </Link>{" "}
                এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  Starter Query <code className={CODE}>del_ex6_bookings</code> (bookings এর নকল) আর একটা খালি{" "}
                  <code className={CODE}>del_ex6_archive</code> বানায়, যাতে bookings এর সব Column আর একটা বাড়তি{" "}
                  <code className={CODE}>archived_at</code> আছে। একটা Statement লিখুন, WITH ... DELETE ... RETURNING আর INSERT দিয়ে, যা সব cancelled
                  Booking কে del_ex6_bookings থেকে সরিয়ে Archive এ রাখে। archived_at এ দিন ঠিক{" "}
                  <code className={CODE}>{"TIMESTAMPTZ '2026-11-01 10:00:00+06'"}</code>। শেষের যাচাইয়ের Query শেষ Statement হিসেবে রাখুন।
                </>
              }
              hint={
                <>
                  Archive Section এর বক্সটাই নকশা, শুধু USING এর দরকার নেই:{" "}
                  <code className={CODE}>{"WITH moved AS (DELETE FROM del_ex6_bookings WHERE status = 'cancelled' RETURNING *)"}</code>, তারপর{" "}
                  <code className={CODE}>INSERT INTO del_ex6_archive SELECT moved.*, TIMESTAMPTZ ... FROM moved;</code>। সঠিক হলে মূল Table এ 21টা
                  Row থাকবে আর Archive এ 5, 12, 18।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ex6_bookings, del_ex6_archive;
CREATE TABLE del_ex6_bookings AS SELECT * FROM bookings;
CREATE TABLE del_ex6_archive AS
  SELECT *, NULL::timestamptz AS archived_at FROM bookings WITH NO DATA;

-- এখানে একটা Statement: WITH ... DELETE ... RETURNING, তারপর INSERT

SELECT (SELECT count(*) FROM del_ex6_bookings) AS live_rows,
       (SELECT string_agg(booking_id::text, ',' ORDER BY booking_id)
          FROM del_ex6_archive) AS archived_ids,
       (SELECT sum(total_bdt) FROM del_ex6_archive) AS archived_bdt,
       (SELECT max(archived_at) FROM del_ex6_archive) AS archived_at;`}
              solution={`SELECT count(*) FILTER (WHERE status <> 'cancelled'),
       string_agg(booking_id::text, ',' ORDER BY booking_id) FILTER (WHERE status = 'cancelled'),
       sum(total_bdt) FILTER (WHERE status = 'cancelled'),
       TIMESTAMPTZ '2026-11-01 10:00:00+06'
FROM bookings;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "choosing",
      subHeader: { index: "012", title: "Choosing, and Anonymize" },
      title: <SectionTitle>কোনটা কখন: Hard Delete, Soft Delete, Archive, Anonymize</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার চতুর্থ উপায়, যা Oliver এর অনুরোধের আসল উত্তর। UK আর ইউরোপের GDPR এর মতো অনেক দেশের গোপনীয়তার আইনে একজন মানুষ তার
                ব্যক্তিগত তথ্য মুছে ফেলতে বলতে পারেন, GDPR এ একে Right to Erasure বলে। কিন্তু একই আইন হিসাব আর Tax এর মতো আইনি দায়িত্বের জন্য
                দরকারি রেকর্ড রাখার সুযোগও দেয়। মানে Oliver এর নাম, Email আর ফোন যাবে, কিন্তু তার Booking আর Payment এর হিসাব থাকবে। নিজের
                দেশের আইনে ঠিক কী লাগে, সেটা একজন আইনজ্ঞের কাছে জেনে নেওয়া দলের দায়িত্ব, এই লেসন সেই পরামর্শ না।
              </ContentParagraph>
              <ContentParagraph>
                এর কারিগরি উত্তর Anonymize: Row টা রাখুন, কিন্তু যা দিয়ে মানুষটাকে চেনা যায় তা মুছে দিন বা বদলে দিন। নাম হয়ে যায়
                &quot;Deleted customer&quot;, ফোন NULL, শহর &quot;Unknown&quot;। Email এর বেলায় একটু সাবধান: Column টা NOT NULL আর UNIQUE, তাই
                ফাঁকা রাখা যায় না, আর সবার একই Email দেওয়া যায় না। সাধারণ কৌশল হলো id দিয়ে একটা অনন্য, অর্থহীন ঠিকানা বানানো,{" "}
                <code className={CODE}>deleted-11@mail.example</code>। country রেখে দিচ্ছি, কারণ দেশ দিয়ে একজন মানুষকে আলাদা করে চেনা যায় না আর
                দেশভিত্তিক Report এ সেটা কাজে লাগে। কোন Column থাকবে আর কোনটা যাবে, সেটা প্রতিটা দলের নিজের সিদ্ধান্ত।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্স আসল customers Table এ চলে, BEGIN আর ROLLBACK এর মাঝে। প্রথমে একটা <code className={CODE}>deleted_at</code> Column যোগ
                হয়। PostgreSQL এ ALTER TABLE ও Transaction এর অংশ, তাই ROLLBACK এ সেটাও ফিরে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Oliver কে Anonymize, ইতিহাস রেখে"
              query={`BEGIN;
ALTER TABLE customers ADD COLUMN deleted_at timestamptz;

UPDATE customers
SET full_name  = 'Deleted customer',
    email      = 'deleted-' || customer_id || '@mail.example',
    phone      = NULL,
    city       = 'Unknown',
    deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE customer_id = 11
RETURNING customer_id, full_name, email, phone, city, country, deleted_at;

SELECT b.booking_id, c.full_name, b.status, b.total_bdt, p.amount_bdt AS paid_bdt
FROM bookings AS b
JOIN customers AS c USING (customer_id)
LEFT JOIN payments AS p ON p.booking_id = b.booking_id AND p.status = 'paid'
WHERE b.customer_id = 11
ORDER BY b.booking_id;

SELECT sum(total_bdt) AS confirmed_revenue
FROM bookings
WHERE status = 'confirmed';
ROLLBACK;`}
              caption="UPDATE এর রসিদ: Customer 11 এখন Deleted customer, Email deleted-11@mail.example, ফোন ফাঁকা, শহর Unknown, দেশ United Kingdom, deleted_at 2026-11-01 10:00:00+06। তার দুটো Booking এখনো জোড়া: 12 (cancelled, 25000.00, কোনো Payment নেই) আর 19 (confirmed, 28000.00, paid 28000.00)। আয় 423600.00, এক টাকাও কমেনি। শেষে ROLLBACK, তাই আসল Table আগের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "কী হয়", "কখন বেছে নেবেন", "সাবধান"],
          rows: [
            [
              "Hard Delete (DELETE)",
              "Row পুরোপুরি যায়",
              "কোনো ইতিহাস জড়িয়ে নেই: Booking ছাড়া Account, ভুল করে ঢোকা Test Row, পুরনো Log",
              "ফেরত শুধু Backup থেকে, Foreign Key আর CASCADE আগে দেখুন",
            ],
            [
              "Soft Delete (deleted_at)",
              "Row থাকে, লুকানো থাকে",
              "ভুল করে মোছা ফেরত আনার সুযোগ চাই, বা মোছার পরেও ইতিহাস লাগে",
              "প্রতিটা Query তে Filter, UNIQUE এর জন্য Partial Index, ব্যক্তিগত তথ্য থেকে যায়",
            ],
            [
              "Status বদল",
              "status Column নতুন অবস্থা পায়",
              "Row এর নিজের একটা জীবনচক্র আছে: Booking cancelled, Payment refunded",
              "সম্ভাব্য সব অবস্থা CHECK দিয়ে বেঁধে রাখুন",
            ],
            [
              "Archive",
              "Row অন্য Table এ সরে",
              "পুরনো, বন্ধ ইতিহাস যা রোজ লাগে না: গত বছরের শেষ হওয়া Trip",
              "এক Statement এ সরান, Foreign Key থাকলে আগে Child",
            ],
            [
              "Anonymize",
              "Row থাকে, চেনার তথ্য যায়",
              "মানুষটা মুছে যেতে চান, কিন্তু তার লেনদেনের হিসাব রাখা বাধ্যতামূলক",
              "UNIQUE Column এ অনন্য অর্থহীন মান, Backup এ পুরনো তথ্য থেকে যায়",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তালিকা পড়ে সিদ্ধান্ত নেওয়া এক জিনিস, নিজে চেষ্টা করা আরেক জিনিস। নিচের Lab এ Island Tours এর চারটা আসল অনুরোধ, প্রতিটার জন্য চারটা
              উপায়। প্রতিটা ফলাফল Sample Database এ চালিয়ে পাওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DeleteFateLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Backup এ পুরনো তথ্য থেকে যায়",
          content: (
            <ContentParagraph>
              Anonymize বা Hard Delete এর পরেও গত সপ্তাহের Backup এ Oliver এর নাম আর Email আছে। এটা স্বাভাবিক, আর বেশিরভাগ দল এর জন্য একটা নিয়ম
              রাখে: Backup কতদিন রাখা হবে, আর কোনো Backup থেকে Restore করলে মুছে ফেলা মানুষদের আবার Anonymize করার একটা তালিকা। Backup আর Restore
              এর পুরো আলোচনা{" "}
              <Link href="/sql/topic/pg-dump-restore" className={LINK}>
                Module 18
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ DELETE কোথায় আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>DELETE FROM table WHERE ...</code> MySQL এ হুবহু একই। Soft Delete এর ধারণা, deleted_at Column আর UPDATE ও
                একই। পার্থক্যগুলো আশেপাশে, আর আপনার MySQL Course এ এগুলো দেখলে চিনতে পারবেন। নিচের প্রতিটা উত্তর MySQL 8.4.11 এ island_tours
                Load করে চালানো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>RETURNING নেই।</strong> MySQL 8.4 এ DELETE ... RETURNING Syntax Error দেয়। কয়টা Row গেল জানতে{" "}
                  <code className={CODE}>ROW_COUNT()</code>, আর কোন Row গেল জানতে আগে SELECT।
                </ListItem>
                <ListItem>
                  <strong>অন্য Table দেখে মোছার Syntax আলাদা।</strong> PostgreSQL এর <code className={CODE}>DELETE FROM b USING d</code> MySQL এ
                  Syntax Error। MySQL এর রূপ <code className={CODE}>DELETE b FROM b JOIN d ON ...</code>: DELETE এর পরে কোন Table থেকে মুছবেন তার
                  নাম। MySQL এরও একটা USING রূপ আছে, <code className={CODE}>DELETE FROM b USING b JOIN d ...</code>, যেখানে মূল Table টাকেও USING এর
                  তালিকায় লিখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>ORDER BY আর LIMIT চলে, শুধু এক Table এর DELETE এ।</strong> তাই ভাগে ভাগে মোছা সেখানে সরাসরি লেখা যায়। PostgreSQL এ একই
                  লেখা Syntax Error।
                </ListItem>
                <ListItem>
                  <strong>একই Table কে Subquery তে পড়া যায় না।</strong> <code className={CODE}>WHERE id IN (SELECT id FROM same_table ...)</code>{" "}
                  দিলে Error 1093। পথ হলো Subquery টাকে আরেকটা Derived Table এ মুড়ে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>Data-Modifying CTE নেই, Partial Index নেই।</strong> Archive হয় একটা Transaction এ INSERT ... SELECT তারপর DELETE। আর Soft
                  Delete এর UNIQUE এর জন্য একটা Functional Index: যে Expression জীবিত Row এ Email দেয় আর মুছে ফেলা Row এ NULL, তার উপর UNIQUE।
                  MySQL এর UNIQUE ও অনেকগুলো NULL ঢুকতে দেয়, তাই মুছে ফেলা Row গুলো একে অপরকে আটকায় না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-delete.sql",
          code: `-- MySQL 8.4, island_tours Database এ
DELETE FROM bookings WHERE status = 'cancelled' RETURNING booking_id;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ...
--   near 'RETURNING booking_id' at line 1

CREATE TABLE del_bookings AS SELECT * FROM bookings;
-- Query OK, 24 rows affected

DELETE b
FROM del_bookings AS b
JOIN departures AS d ON d.departure_id = b.departure_id
WHERE b.status = 'pending'
  AND d.starts_on < '2026-12-01';
-- Query OK, 3 rows affected

SELECT ROW_COUNT() AS deleted;
-- deleted: 3

DELETE FROM del_bookings
WHERE status = 'confirmed'
ORDER BY booked_at
LIMIT 2;
-- Query OK, 2 rows affected

DELETE FROM del_bookings
WHERE booking_id IN (SELECT booking_id FROM del_bookings WHERE status = 'cancelled');
-- ERROR 1093 (HY000): You can't specify target table 'del_bookings'
--   for update in FROM clause

DELETE FROM del_bookings
WHERE booking_id IN (
  SELECT booking_id FROM (
    SELECT booking_id FROM del_bookings WHERE status = 'cancelled'
  ) AS doomed
);
-- Query OK, 3 rows affected

SELECT COUNT(*) AS rows_left FROM del_bookings;
-- rows_left: 16

DELETE FROM customers WHERE customer_id = 11;
-- ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key
--   constraint fails (\`island_tours\`.\`bookings\`, CONSTRAINT \`bookings_ibfk_1\`
--   FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`customer_id\`))`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-soft-delete-and-archive.sql",
          code: `CREATE TABLE del_accounts (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  full_name  VARCHAR(100) NOT NULL,
  deleted_at DATETIME NULL
);

CREATE UNIQUE INDEX del_accounts_live_email
  ON del_accounts (email) WHERE deleted_at IS NULL;
-- ERROR 1064 (42000): ... near 'WHERE deleted_at IS NULL' at line 2

CREATE UNIQUE INDEX del_accounts_live_email
  ON del_accounts ((CASE WHEN deleted_at IS NULL THEN email END));
-- Query OK

INSERT INTO del_accounts (email, full_name) VALUES
  ('oliver.bennett@mail.example', 'Oliver Bennett'),
  ('priya.sharma@mail.example',   'Priya Sharma');
UPDATE del_accounts SET deleted_at = '2026-11-01 10:00:00'
WHERE email = 'oliver.bennett@mail.example';

INSERT INTO del_accounts (email, full_name)
VALUES ('oliver.bennett@mail.example', 'Oliver Bennett');
-- Query OK, 1 row affected

INSERT INTO del_accounts (email, full_name)
VALUES ('priya.sharma@mail.example', 'Priya Sharma');
-- ERROR 1062 (23000): Duplicate entry 'priya.sharma@mail.example'
--   for key 'del_accounts.del_accounts_live_email'

-- Archive: Data-Modifying CTE নেই, তাই এক Transaction এ দুই কমান্ড
DROP TABLE IF EXISTS del_bookings, del_bookings_archive;
CREATE TABLE del_bookings AS SELECT * FROM bookings;
CREATE TABLE del_bookings_archive AS
  SELECT *, CAST(NULL AS DATETIME) AS archived_at FROM bookings WHERE FALSE;

START TRANSACTION;
INSERT INTO del_bookings_archive
  SELECT b.*, '2026-11-01 10:00:00'
  FROM del_bookings AS b
  JOIN departures AS d ON d.departure_id = b.departure_id
  WHERE d.starts_on < '2026-06-01';
-- Query OK, 12 rows affected
DELETE b
FROM del_bookings AS b
JOIN departures AS d ON d.departure_id = b.departure_id
WHERE d.starts_on < '2026-06-01';
-- Query OK, 12 rows affected
COMMIT;

SELECT (SELECT COUNT(*) FROM del_bookings) AS live,
       (SELECT COUNT(*) FROM del_bookings_archive) AS archived;
-- live: 12, archived: 12`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["মোছা Row ফেরত দেখা", "RETURNING, আর 18 থেকে old ও new", "নেই, আগে SELECT, পরে ROW_COUNT()"],
            ["আরেক Table দেখে মোছা", "DELETE FROM b USING d WHERE ...", "DELETE b FROM b JOIN d ON ..."],
            ["ORDER BY ... LIMIT", "নেই, Subquery তে LIMIT দিয়ে id বাছা", "এক Table এর DELETE এ চলে"],
            ["একই Table Subquery তে", "চলে", "Error 1093, Derived Table এ মুড়তে হয়"],
            ["এক Statement এ সরানো", "WITH moved AS (DELETE ... RETURNING *) INSERT ...", "Transaction এ INSERT ... SELECT, তারপর DELETE"],
            ["Soft Delete এর UNIQUE", "Partial Unique Index ... WHERE deleted_at IS NULL", "CASE দিয়ে Functional Unique Index"],
            ["Foreign Key এ আটকালে", "Error 23503", "Error 1451, SQLSTATE 23000"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>তানিমের তিনটা অনুরোধ, এক Transaction এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এবার তানিম তিনটা অনুরোধের জন্য ঠিক উপায় বেছে নিলেন, আর প্রতিটার কারণ লিখে রাখলেন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Imran Kabir: Hard Delete।</strong> কোনো Booking নেই, রাখার মতো কোনো ইতিহাস নেই। তবু নিরাপত্তার জন্য DELETE এর WHERE এ
                  একটা NOT EXISTS: যদি এর মধ্যে তিনি একটা Booking করে ফেলেন, DELETE কিছু না মুছে DELETE 0 বলবে।
                </ListItem>
                <ListItem>
                  <strong>Oliver Bennett: Anonymize আর Soft Delete।</strong> তার Payment আছে, তাই Row থাকবে, কিন্তু চেনার তথ্য যাবে। deleted_at
                  তাকে সব তালিকা থেকে লুকাবে।
                </ListItem>
                <ListItem>
                  <strong>মেয়াদ পেরোনো Hold: DELETE না, status বদল।</strong> তানিম প্রথমে USING দিয়ে মুছতে চেয়েছিলেন। তারপর দেখলেন Booking 14 এর
                  একটা failed Payment আছে, আসল Table এ মুছতে গেলে Error 23503। আর মুছলে কে কোন Trip চেয়েছিলেন সেই তথ্যও হারায়। তাই এই তিনটা
                  Booking এর status হবে cancelled, যা এই Table এর নিজস্ব Soft Delete।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সব একটা BEGIN এর ভেতরে, শেষে একটা যাচাইয়ের SELECT। আসল কাজে সেই সংখ্যা মিললে COMMIT। এই বক্সে শেষে ROLLBACK, যাতে আপনার পাতার
                Database অক্ষত থাকে। Hold বাতিল হলে Departure এর seats_left ও বাড়ানো দরকার, সেটা একটা Join করা UPDATE, যা{" "}
                <Link href="/sql/topic/update" className={LINK}>
                  UPDATE
                </Link>{" "}
                লেসনের কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন অনুরোধ, তিন উপায়, এক Transaction"
              query={`BEGIN;
ALTER TABLE customers ADD COLUMN deleted_at timestamptz;

DELETE FROM customers
WHERE customer_id = 15
  AND NOT EXISTS (SELECT 1 FROM bookings AS b WHERE b.customer_id = 15)
RETURNING customer_id, full_name;

UPDATE customers
SET full_name  = 'Deleted customer',
    email      = 'deleted-' || customer_id || '@mail.example',
    phone      = NULL,
    city       = 'Unknown',
    deleted_at = TIMESTAMPTZ '2026-11-01 10:00:00+06'
WHERE customer_id = 11
RETURNING customer_id, full_name, email;

UPDATE bookings
SET status = 'cancelled'
WHERE status = 'pending'
  AND departure_id IN (
    SELECT departure_id FROM departures
    WHERE starts_on < DATE '2026-11-01' + 30
  )
RETURNING booking_id, customer_id, status;

SELECT (SELECT count(*) FROM customers) AS customers,
       (SELECT count(*) FROM customers WHERE deleted_at IS NULL) AS live_customers,
       (SELECT count(*) FROM bookings WHERE status = 'cancelled') AS cancelled,
       (SELECT count(*) FROM bookings WHERE status = 'pending') AS pending,
       (SELECT count(*) FROM payments) AS payments,
       (SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed') AS confirmed_revenue;
ROLLBACK;`}
              caption="Imran মুছলেন (Customer 15)। Oliver হলেন Deleted customer, deleted-11@mail.example। Booking 14, 20 আর 24 এখন cancelled। যাচাইয়ের Row: customers 14, live_customers 13, cancelled 6 (আগের 3 আর নতুন 3), pending 1 (শুধু Booking 17), payments 19 (একটাও হারায়নি), confirmed_revenue 423600.00 (এক টাকাও কমেনি)। ঠিক এই সংখ্যাগুলোই তানিম চেয়েছিলেন। শেষে ROLLBACK।"
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
                  Starter Query তিনটা নকল বানায়, আসল Foreign Key সহ: <code className={CODE}>del_ch_customers</code> (একটা{" "}
                  <code className={CODE}>deleted_at</code> Column সহ), <code className={CODE}>del_ch_bookings</code> আর{" "}
                  <code className={CODE}>del_ch_payments</code>, সাথে একটা খালি <code className={CODE}>del_ch_archive</code>। মন্তব্যের জায়গায়
                  তিনটা কাজ করুন: (১) যে Customer দের কোনো Booking নেই তাদের Hard Delete। (২) Customer 11 কে Anonymize আর Soft Delete: নাম{" "}
                  <code className={CODE}>Deleted customer</code>, Email <code className={CODE}>deleted-11@mail.example</code>, ফোন NULL, শহর{" "}
                  <code className={CODE}>Unknown</code>, deleted_at <code className={CODE}>{"TIMESTAMPTZ '2026-11-01 10:00:00+06'"}</code>। (৩) যে
                  cancelled Booking এর কোনো Payment নেই, শুধু সেগুলো এক Statement এ del_ch_archive এ সরান, একই archived_at দিয়ে। শেষের যাচাইয়ের
                  Query শেষ Statement হিসেবে রাখুন।
                </>
              }
              hint={
                <>
                  (১) <code className={CODE}>DELETE FROM del_ch_customers AS c WHERE NOT EXISTS (SELECT 1 FROM del_ch_bookings AS b WHERE ...)</code>
                  । (২) Anonymize বক্সের UPDATE টাই, Table এর নাম বদলে। (৩) Archive এর WITH ... DELETE ... RETURNING, শর্তে{" "}
                  <code className={CODE}>{"status = 'cancelled'"}</code> আর একটা NOT EXISTS যা del_ch_payments দেখে। সব cancelled Booking মুছতে গেলে
                  Booking 5 এ Error 23503, কারণ তার একটা refunded Payment আছে। সঠিক হলে Archive এ যাবে 12 আর 18।
                </>
              }
              starter={`DROP TABLE IF EXISTS del_ch_payments, del_ch_bookings, del_ch_customers, del_ch_archive;
CREATE TABLE del_ch_customers AS SELECT * FROM customers;
ALTER TABLE del_ch_customers
  ADD PRIMARY KEY (customer_id),
  ADD COLUMN deleted_at timestamptz;
CREATE TABLE del_ch_bookings AS SELECT * FROM bookings;
ALTER TABLE del_ch_bookings
  ADD PRIMARY KEY (booking_id),
  ADD FOREIGN KEY (customer_id) REFERENCES del_ch_customers (customer_id);
CREATE TABLE del_ch_payments AS SELECT * FROM payments;
ALTER TABLE del_ch_payments
  ADD PRIMARY KEY (payment_id),
  ADD FOREIGN KEY (booking_id) REFERENCES del_ch_bookings (booking_id);
CREATE TABLE del_ch_archive AS
  SELECT *, NULL::timestamptz AS archived_at FROM bookings WITH NO DATA;

-- ১. যাদের কোনো Booking নেই, সেই Customer দের Hard Delete
-- ২. Customer 11 কে Anonymize আর Soft Delete
-- ৩. Payment ছাড়া cancelled Booking গুলো Archive এ সরান

SELECT (SELECT count(*) FROM del_ch_customers) AS customer_rows,
       (SELECT count(*) FROM del_ch_customers WHERE deleted_at IS NULL) AS live_customers,
       (SELECT email FROM del_ch_customers WHERE customer_id = 11) AS email_11,
       (SELECT count(*) FROM del_ch_bookings) AS booking_rows,
       (SELECT string_agg(booking_id::text, ',' ORDER BY booking_id)
          FROM del_ch_archive) AS archived_ids,
       (SELECT sum(amount_bdt) FROM del_ch_payments WHERE status = 'paid') AS paid_bdt;`}
              solution={`SELECT *
FROM (VALUES (14, 13, 'deleted-11@mail.example', 22, '12,18', 423600.00))
  AS v(customer_rows, live_customers, email_11, booking_rows, archived_ids, paid_bdt);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>মোছার অনুরোধ এলে সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্ন করুন: এই Row কি টাকা, আইন বা ইতিহাসের সাথে জড়িত?",
              description:
                "Payment, Invoice, Booking এর মতো কিছু হলে উত্তর প্রায় সবসময় Hard Delete না। কোনো ইতিহাস জড়িয়ে না থাকলে, যেমন Booking ছাড়া একটা Account বা পুরনো Log, তখন DELETE ই সবচেয়ে সৎ।",
            },
            {
              title: "Foreign Key এর শিকল দেখুন",
              description:
                "কে এই Table কে দেখায়, আর তাদের কে দেখায়? psql এ \\d+ table এর Referenced by অংশ পড়ুন। NO ACTION হলে Error আসবে, CASCADE হলে নিচের সব যাবে, দুটোই আগে জানা চাই।",
            },
            {
              title: "উপায় বেছে নিন",
              description:
                "Hard Delete, Soft Delete, status বদল, Archive, নাকি Anonymize। মানুষটা তথ্য মুছতে চাইছেন কিন্তু লেনদেন আছে? Anonymize। পুরনো, বন্ধ ইতিহাস? Archive। ভুল করে মোছা ফেরত আনার সুযোগ চাই? Soft Delete।",
            },
            {
              title: "একই WHERE দিয়ে আগে SELECT",
              description:
                "কয়টা Row, কোন কোন Row। USING থাকলে বিশেষ করে দেখুন একই Row বারবার আসছে কিনা, কারণ সেটা জোড়ার শর্ত ভুলে যাওয়ার লক্ষণ।",
            },
            {
              title: "BEGIN, চালান, Command Tag পড়ুন",
              description:
                "DELETE এর উত্তরের সংখ্যা আগের SELECT এর সংখ্যার সাথে মিলছে কিনা দেখুন। না মিললে আর কিছু করার আগে ROLLBACK। RETURNING দিলে মোছা Row গুলো চোখের সামনে থাকে।",
            },
            {
              title: "যাচাইয়ের SELECT চালান",
              description:
                "শুধু মোছা Table না, আশেপাশেরটাও: মোট Row, আয়ের যোগফল, Payment এর সংখ্যা। Project Example এর মতো একটা ছোট Row যেখানে প্রত্যাশিত প্রতিটা সংখ্যা এক নজরে দেখা যায়।",
            },
            {
              title: "COMMIT বা ROLLBACK, আর লিখে রাখুন",
              description:
                "সব মিললে COMMIT, সামান্য সন্দেহেও ROLLBACK। তারপর কে, কবে, কেন মুছলেন সেটা Ticket বা deleted_by আর delete_reason Column এ লিখুন। ছয় মাস পরে কেউ জিজ্ঞেস করবেই।",
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
          headers: ["ভুল", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "আগে SELECT না চালিয়ে সরাসরি DELETE",
              "কত Row যাবে জানা থাকে না, ভুল WHERE এ শত শত Row যায়",
              "একই WHERE দিয়ে SELECT, তারপর BEGIN এর ভেতরে DELETE",
            ],
            [
              "Command Tag না পড়া",
              "DELETE 300 এর পরেও কাজ চলতে থাকে, তারপর COMMIT",
              "প্রত্যাশিত সংখ্যা আগে লিখে রাখুন, না মিললে ROLLBACK",
            ],
            [
              "USING এ জোড়ার শর্ত ভুলে যাওয়া",
              "প্রতিটা Row সবার সাথে জোড়া পায়, যে Row যাওয়ার কথা না সেটাও যায়",
              "USING এর ঠিক পরের লাইনে জোড়ার শর্ত, আগে SELECT দিয়ে পরীক্ষা",
            ],
            [
              "Booking বা Payment এর Foreign Key তে ON DELETE CASCADE",
              "একটা Customer মুছলে চুপচাপ Booking আর Payment ও যায়, আয় কমে",
              "টাকা আর ইতিহাসের Table এ NO ACTION রাখুন, Database কে পাহারাদার হতে দিন",
            ],
            [
              "ফেরত দেওয়া Payment মুছে ফেলা",
              "Card বা bKash এর Statement এর সাথে খাতা মেলে না",
              "status বদল (refunded), অথবা ঋণাত্মক একটা Reversal Entry",
            ],
            [
              "Soft Delete এর পরে Filter ভুলে যাওয়া",
              "মুছে ফেলা মানুষ Newsletter পান, Login করতে পারেন",
              "জীবিত Row এর View, আর প্রতিটা নতুন Query তে প্রশ্নটা করা",
            ],
            [
              "ইতিহাসের Report এ deleted_at দিয়ে Filter",
              "চলে যাওয়া গ্রাহকের আসল আয় Report থেকে উধাও",
              "Report এর প্রশ্ন ইতিহাস নিয়ে হলে মুছে ফেলা Row ও গুনুন",
            ],
            [
              "UNIQUE (email, deleted_at) দিয়ে Soft Delete সামলানো",
              "দুটো NULL আলাদা ধরা হয়, তাই একই Email এ দুটো জীবিত Account",
              "Partial Unique Index: UNIQUE (email) WHERE deleted_at IS NULL",
            ],
            [
              "ভাবা যে Soft Delete মানেই তথ্য মোছা",
              "নাম, Email, ফোন Database এ রয়েই যায়, গোপনীয়তার অনুরোধ পূরণ হয় না",
              "চেনার তথ্য Anonymize করুন, ইতিহাস রাখুন",
            ],
            [
              "Archive এ INSERT আর DELETE আলাদা, Transaction ছাড়া",
              "মাঝে কিছু ভাঙলে Row দুই জায়গায়, বা কোথাও না",
              "PostgreSQL এ WITH ... DELETE ... RETURNING দিয়ে এক Statement, MySQL এ এক Transaction",
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
                  <a href="https://www.postgresql.org/docs/current/sql-delete.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: DELETE
                  </a>
                  : USING আর Subquery এর দুই উপায়, RETURNING এ OLD আর NEW, Command Tag, আর LIMIT ছাড়া ভাগে ভাগে মোছার উদাহরণ।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/dml-returning.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Returning Data from Modified Rows
                  </a>
                  : INSERT, UPDATE আর DELETE তিনটাতেই RETURNING কীভাবে কাজ করে, এক পাতায়।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/queries-with.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: WITH Queries
                  </a>
                  : Data-Modifying Statements in WITH অংশে moved_rows উদাহরণ, যা Archive Section এর ভিত্তি।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/indexes-partial.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Partial Indexes
                  </a>
                  : Partial Unique Index এর উদাহরণ সহ, Soft Delete এর UNIQUE সমস্যার ঠিক সমাধান।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/ddl-constraints.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: Constraints
                  </a>
                  : Foreign Key এর ON DELETE নিয়মগুলো, NO ACTION, RESTRICT আর CASCADE এর পার্থক্য।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/delete.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: DELETE Statement
                  </a>
                  : দুই রকম Multiple-table DELETE, আর ORDER BY ও LIMIT শুধু এক Table এর DELETE এ।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/create-index.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: CREATE INDEX
                  </a>
                  : Functional Key Parts, যা দিয়ে MySQL এ Soft Delete এর UNIQUE বানানো হয়।
                </ListItem>
                <ListItem>
                  <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                    আপনার MySQL Course
                  </a>
                  : যে MySQL ভিডিও কোর্সটা আপনি দেখছেন, তার DELETE অংশ এই লেসনের In MySQL Section এর সাথে মিলিয়ে দেখুন।
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
      title: <SectionTitle>সারসংক্ষেপ: মোছা একটা সিদ্ধান্ত, কমান্ড না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের রবিবার শেষ। Imran এর Account সত্যিই মুছে গেছে, কারণ তার সাথে কোনো ইতিহাস জড়িয়ে ছিল না। Oliver এর নাম আর Email চলে গেছে,
                কিন্তু তার 28000 টাকার Booking আর Payment খাতায় আছে, হিসাবরক্ষক খুশি। আর তিনটা মেয়াদ পেরোনো Hold মোছা হয়নি, বাতিল হয়েছে,
                যাতে Seat ছাড়া পায় আর ইতিহাসও থাকে। তিনটা অনুরোধ, তিনটা আলাদা উত্তর।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DELETE</strong> WHERE মেলা Row সরায় আর DELETE n দিয়ে জানায় কয়টা গেল। DELETE 0 Error না। আগে একই WHERE দিয়ে SELECT,
                  তারপর BEGIN এর ভেতরে DELETE।
                </ListItem>
                <ListItem>
                  <strong>RETURNING</strong> মোছা Row এর রসিদ দেয়, COMMIT এর আগে শেষ সুযোগ। PostgreSQL 18 এ old আর new, DELETE এ new সবসময় NULL।
                </ListItem>
                <ListItem>
                  <strong>USING</strong> আরেক Table দেখে মোছে, IN আর EXISTS এর মতোই। জোড়ার শর্ত ভুললে প্রায় সব যায়।
                </ListItem>
                <ListItem>
                  <strong>Foreign Key</strong> এর NO ACTION মোছা আটকায় (23503), CASCADE চুপচাপ শিকল ধরে সব নেয়। টাকা আর ইতিহাসের Table এ NO
                  ACTION।
                </ListItem>
                <ListItem>
                  <strong>Payment কখনো মোছা হয় না:</strong> ফেরত মানে status বদল বা উল্টো একটা লাইন, কারণ বাইরের Statement এর সাথে খাতা মিলতে হয়।
                </ListItem>
                <ListItem>
                  <strong>Soft Delete</strong> মানে deleted_at এ সময়, ফেরত আনা এক UPDATE। দাম: প্রতিটা Query তে Filter এর সিদ্ধান্ত, Foreign Key এর
                  অন্ধত্ব, আর UNIQUE এর জন্য Partial Unique Index।
                </ListItem>
                <ListItem>
                  <strong>View</strong> Filter একবার লেখে, <strong>Archive</strong> পুরনো ইতিহাস এক Statement এ সরায়, আর বড় মোছা হয় ভাগে ভাগে।
                </ListItem>
                <ListItem>
                  <strong>Anonymize</strong> মানুষটাকে মোছে, হিসাব রাখে। গোপনীয়তা আর আইনি রেকর্ড, দুটোই একসাথে রক্ষা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে একটা নতুন প্রশ্ন: Row টা আগে থেকেই থাকলে বদলানো, না থাকলে ঢোকানো, আর সেটা এক Statement এ, যাতে দুজন একসাথে
                চেষ্টা করলেও গোলমাল না হয়। এর নাম Upsert, PostgreSQL এ ON CONFLICT আর MySQL এ ON DUPLICATE KEY UPDATE।{" "}
                <Link href="/sql/topic/upsert" className={LINK}>
                  Upsert: ON CONFLICT and ON DUPLICATE KEY
                </Link>{" "}
                লেসনে চলুন।
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
      ["DELETE ... WHERE", "শর্ত মেলা Row সরায়, DELETE n জানায়", "cancelled তিনটা: DELETE 3, আবার চালালে DELETE 0"],
      ["আগে দেখা আর BEGIN", "একই WHERE এ SELECT, তারপর খামের ভেতরে মোছা", "reviews থেকে 2টা গেল, ROLLBACK এ আবার 10"],
      ["RETURNING", "মোছা Row গুলো ফলাফল হিসেবে ফেরত", "pending চারটা: 14, 17, 20, 24"],
      ["old আর new", "PostgreSQL 18 এ আগের আর পরের মান, DELETE এ new NULL", "old_id 5, 12, 18, new_id ফাঁকা"],
      ["USING", "আরেক Table জুড়ে মোছা", "30 দিনের Hold: 14, 20, 24 গেল, 17 থাকল"],
      ["USING এর ফাঁদ", "জোড়ার শর্ত ছাড়া সবাই সবার সাথে জোড়া", "DELETE 4, pending_left 0"],
      ["NO ACTION", "কেউ দেখালে মোছা বাতিল, Error 23503", "Imran গেলেন, Oliver আটকালেন"],
      ["CASCADE", "শিকল ধরে নিচের সব মোছে", "DELETE 1, কিন্তু paid 423600.00 থেকে 395600.00"],
      ["Payment এর খাতা", "মোছা না, status বদল বা Reversal Entry", "refunded 1, failed 1, paid 17"],
      ["Soft Delete", "deleted_at এ সময়, ফেরত আনা এক UPDATE", "Family Package: all 9, live 8"],
      ["Filter এর সিদ্ধান্ত", "প্রশ্ন ঠিক করে Filter লাগবে কিনা", "Newsletter 14, আয় 423600.00"],
      ["Partial Unique Index", "শুধু জীবিত Row এ অনন্য", "নতুন Oliver ঢুকলেন, দ্বিতীয় জীবিত Priya আটকালেন"],
      ["View", "Filter একবার লেখা", "del_live_tours এ 8টা Tour"],
      ["Archive", "WITH ... DELETE ... RETURNING থেকে INSERT", "12টা পুরনো Booking এক Statement এ সরল"],
      ["ভাগে ভাগে মোছা", "Subquery তে LIMIT দিয়ে id বাছা", "30495টা পুরনো Log, প্রতিবার 10000"],
      ["Anonymize", "চেনার তথ্য মোছা, Row রাখা", "Deleted customer, deleted-11@mail.example, আয় অক্ষত"],
      ["MySQL", "RETURNING নেই, DELETE b FROM b JOIN, LIMIT চলে, Error 1093", "Functional Index দিয়ে Soft Delete এর UNIQUE"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা DELETE চালানোর পরে উত্তর এল DELETE 0। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Query তে Error হয়েছে, কিছু চলেনি",
            isCorrect: false,
            explanation: "Error হলে ERROR লেখা বার্তা আসে। DELETE 0 একটা সফল কমান্ডের উত্তর।",
          },
          {
            key: "B",
            text: "কোনো Row শর্ত মেলেনি, তাই কিছু মোছেনি, আর এটা Error না",
            isCorrect: true,
            explanation: "ঠিক। লেসনের প্রথম বক্সে একই DELETE দ্বিতীয়বার চালালে DELETE 0 এসেছিল, কারণ cancelled Booking আর বাকি ছিল না।",
          },
          {
            key: "C",
            text: "সব Row মুছে গেছে, 0 Row বাকি",
            isCorrect: false,
            explanation: "সংখ্যাটা মোছা Row এর, বাকি Row এর না। সব মুছলে উত্তর হতো DELETE 24।",
          },
          {
            key: "D",
            text: "Row গুলো Soft Delete হয়েছে",
            isCorrect: false,
            explanation: "DELETE সবসময় Hard Delete। Soft Delete একটা UPDATE, যার উত্তর UPDATE n।",
          },
        ],
      },
      {
        id: 2,
        text: "সাধারণ Foreign Key (কোনো ON DELETE লেখা নেই) থাকা অবস্থায় Oliver এর Customer Row মোছার চেষ্টা করলে, যার দুটো Booking আছে, কী হয়?",
        options: [
          {
            key: "A",
            text: "Customer মোছে, Booking গুলোর customer_id NULL হয়ে যায়",
            isCorrect: false,
            explanation: "সেটা ON DELETE SET NULL এর আচরণ, আর bookings.customer_id NOT NULL বলে সেটাও এখানে ব্যর্থ হতো।",
          },
          {
            key: "B",
            text: "Customer আর তার দুই Booking সব মোছে",
            isCorrect: false,
            explanation: "সেটা CASCADE। কিছু না লিখলে নিয়ম NO ACTION।",
          },
          {
            key: "C",
            text: "Error 23503, আর কিছুই মোছে না",
            isCorrect: true,
            explanation: "ঠিক। DETAIL বলে Key (customer_id)=(11) is still referenced from table bookings। Database ইতিহাস পাহারা দিচ্ছে।",
          },
          {
            key: "D",
            text: "Customer মোছে, Booking গুলো এতিম হয়ে থাকে",
            isCorrect: false,
            explanation: "Foreign Key ঠিক এই এতিম Row আটকাতেই আছে। PostgreSQL এটা কখনো হতে দেয় না।",
          },
        ],
      },
      {
        id: 3,
        text: "তানিম লিখলেন DELETE FROM del_bookings AS b USING departures AS d WHERE b.status = 'pending' AND d.starts_on < DATE '2026-12-01'; জোড়ার শর্ত দিতে ভুলে গেছেন। কী হলো?",
        options: [
          {
            key: "A",
            text: "PostgreSQL Error দেয়, কারণ USING এ জোড়ার শর্ত বাধ্যতামূলক",
            isCorrect: false,
            explanation: "কোনো Error নেই। Syntax পুরোপুরি বৈধ, আর এটাই বিপদ।",
          },
          {
            key: "B",
            text: "শুধু 30 দিনের ভেতরের তিনটা Hold মোছে",
            isCorrect: false,
            explanation: "সেটা হতো জোড়ার শর্ত থাকলে। শর্ত ছাড়া Booking নিজের Departure এর সাথে বাঁধা থাকে না।",
          },
          {
            key: "C",
            text: "সব চারটা pending Booking মোছে, Booking 17 সহ",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা Booking প্রতিটা Departure এর সাথে জোড়া পায়, আর 30 দিনের ভেতরের কোনো একটা Departure তো আছেই। বক্সে DELETE 4, pending_left 0।",
          },
          {
            key: "D",
            text: "departures Table থেকেও Row মোছে",
            isCorrect: false,
            explanation: "USING এর Table শুধু পড়া হয়। মোছে শুধু DELETE FROM এর Table।",
          },
        ],
      },
      {
        id: 4,
        text: "PostgreSQL 18 এ DELETE ... RETURNING old.booking_id, new.booking_id লিখলে new.booking_id এ কী আসে?",
        options: [
          { key: "A", text: "old এর সমান মান", isCorrect: false, explanation: "মোছার পরে Row এর কোনো নতুন রূপ নেই, তাই মান থাকার কথা না।" },
          {
            key: "B",
            text: "NULL, প্রতিটা Row এ",
            isCorrect: true,
            explanation: "ঠিক। Docs এর ভাষায়, সাধারণ DELETE এ সব new মান NULL। বক্সে new_id কলাম তিনটা Row তেই ফাঁকা ছিল।",
          },
          { key: "C", text: "Syntax Error", isCorrect: false, explanation: "PostgreSQL 18 এ old আর new বৈধ। 17 বা তার আগে Error হতো।" },
          {
            key: "D",
            text: "পরের Identity নম্বর",
            isCorrect: false,
            explanation: "DELETE নতুন কোনো Row বানায় না, Identity ও ছোঁয় না।",
          },
        ],
      },
      {
        id: 5,
        text: "accounts Table এর email এ সাধারণ UNIQUE। Oliver কে Soft Delete করার পরে তিনি একই Email দিয়ে আবার Sign up করলেন। কী হবে, আর সমাধান কী?",
        options: [
          {
            key: "A",
            text: "সফল হবে, কারণ পুরনো Row মুছে ফেলা ধরা হয়",
            isCorrect: false,
            explanation: "UNIQUE জানে না deleted_at এর মানে কী। তার কাছে পুরনো Row এখনো আছে।",
          },
          {
            key: "B",
            text: "Error 23505। সমাধান: UNIQUE সরিয়ে দেওয়া",
            isCorrect: false,
            explanation: "UNIQUE সরালে দুজন জীবিত মানুষ একই Email পাবেন, আসল সমস্যা আরও বড় হবে।",
          },
          {
            key: "C",
            text: "Error 23505। সমাধান: UNIQUE এর বদলে CREATE UNIQUE INDEX ... (email) WHERE deleted_at IS NULL",
            isCorrect: true,
            explanation: "ঠিক। Partial Unique Index শুধু জীবিত Row এ অনন্যতা চায়। বক্সে নতুন Oliver ঢুকলেন, আর দ্বিতীয় জীবিত Priya আটকালেন।",
          },
          {
            key: "D",
            text: "Error 23503, কারণ Foreign Key আটকায়",
            isCorrect: false,
            explanation: "23503 Foreign Key এর কোড। এখানে সমস্যা UNIQUE এর, কোড 23505।",
          },
        ],
      },
      {
        id: 6,
        text: "একজন UNIQUE (email, deleted_at) দিয়ে Soft Delete সামলাতে চাইলেন। এতে কী ভুল?",
        options: [
          {
            key: "A",
            text: "কিছু ভুল নেই, এটাই প্রচলিত পদ্ধতি",
            isCorrect: false,
            explanation: "শুনতে যুক্তিসঙ্গত, কিন্তু বক্সে একই Email এ দুটো জীবিত Account ঢুকে গেছে।",
          },
          {
            key: "B",
            text: "জীবিত সব Row এর deleted_at NULL, আর UNIQUE দুটো NULL কে আলাদা ধরে, তাই একই Email এ একাধিক জীবিত Account সম্ভব",
            isCorrect: true,
            explanation: "ঠিক। যে নিয়মের জন্য UNIQUE, ঠিক সেটাই ভাঙে, কোনো Error ছাড়া। live_accounts 2।",
          },
          {
            key: "C",
            text: "PostgreSQL দুই Column এর UNIQUE দেয় না",
            isCorrect: false,
            explanation: "দেয়, Multi-column UNIQUE আপনি Basic Constraints লেসনে দেখেছেন।",
          },
          {
            key: "D",
            text: "মুছে ফেলা Row আর কখনো ফেরত আনা যায় না",
            isCorrect: false,
            explanation: "ফেরত আনা যায়, সমস্যা অন্য জায়গায়: জীবিত Row এর মধ্যে অনন্যতা হারায়।",
          },
        ],
      },
      {
        id: 7,
        text: "Customer 11 Soft Delete করা। মাসিক আয়ের Report (confirmed Booking এর যোগফল) এ deleted_at IS NULL দিয়ে Filter দেওয়া উচিত?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, মুছে ফেলা জিনিস কোথাও দেখানো উচিত না",
            isCorrect: false,
            explanation: "তাহলে আয় 395600.00 দেখাবে, অথচ Oliver এর 28000 টাকা সত্যিই এসেছিল।",
          },
          {
            key: "B",
            text: "না। Booking সত্যিই হয়েছিল, ইতিহাসের Report এ চলে যাওয়া গ্রাহকের আয়ও গুনতে হয়",
            isCorrect: true,
            explanation: "ঠিক। Filter লাগবে কিনা তা ঠিক করে প্রশ্নটা। Newsletter এ লাগে, আয়ের Report এ লাগে না। সঠিক উত্তর 423600.00।",
          },
          {
            key: "C",
            text: "IS NOT NULL দিয়ে Filter দেওয়া উচিত",
            isCorrect: false,
            explanation: "তাহলে শুধু Oliver এর 28000 টাকা আসবে, বাকি সবার আয় বাদ।",
          },
          {
            key: "D",
            text: "Report চালানোর আগে মুছে ফেলা Customer দের Hard Delete করা উচিত",
            isCorrect: false,
            explanation: "Payment থাকায় Foreign Key আটকাবে, আর আটকালেও ইতিহাস হারাত।",
          },
        ],
      },
      {
        id: 8,
        text: "পুরনো Booking গুলো Archive Table এ সরাতে WITH moved AS (DELETE ... RETURNING *) INSERT INTO archive SELECT * FROM moved; লেখা হয়। আলাদা INSERT তারপর DELETE লেখার বদলে এটা কেন ভালো?",
        options: [
          {
            key: "A",
            text: "এটা দ্রুত, কারণ PostgreSQL Row গুলো Disk থেকে একবারও পড়ে না",
            isCorrect: false,
            explanation: "Row পড়তেই হয়। সুবিধাটা গতির না, নিরাপত্তার।",
          },
          {
            key: "B",
            text: "এক Statement বলে হয় দুটোই হয়, নয়তো কোনোটাই না, Row কখনো দুই জায়গায় বা কোথাও না থাকে না",
            isCorrect: true,
            explanation: "ঠিক। মাঝে কিছু ভাঙলে পুরো Statement বাতিল। MySQL এ এই সুবিধা নেই, সেখানে দুটো কমান্ড এক Transaction এ রাখতে হয়।",
          },
          {
            key: "C",
            text: "এতে Foreign Key এর যাচাই হয় না",
            isCorrect: false,
            explanation: "Foreign Key সবসময় যাচাই হয়। Child থাকলে এই DELETE ও আটকাত।",
          },
          {
            key: "D",
            text: "MySQL এও হুবহু এভাবেই লেখা যায়",
            isCorrect: false,
            explanation: "MySQL 8.4 এ WITH এর ভেতরে DELETE Syntax Error দেয়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "নিজের হাতে চার রকম মোছা",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>আগে দেখার খাতা:</strong> bookings, reviews আর payments এর নকল বানিয়ে তিনটা আলাদা DELETE এর জন্য একটা ছক বানান: WHERE শর্ত, আগের
        SELECT count, BEGIN এর ভেতরে DELETE এর Command Tag, আর ROLLBACK এর পরে count। তিনটার একটায় ইচ্ছা করে WHERE এ এমন ভুল করুন যাতে সংখ্যা না
        মেলে, আর লিখুন আপনি কীভাবে ধরলেন।
      </span>,
      <span key="2">
        <strong>Foreign Key এর মানচিত্র:</strong> নিজের island_tours এর আটটা Table এর জন্য লিখুন, কোন Table এর একটা Row মুছতে গেলে কে আটকায়। প্রতিটা
        Table থেকে একটা করে Row মুছে দেখুন, BEGIN আর ROLLBACK এর মাঝে, আর কোনগুলো সফল আর কোনগুলো 23503 দিল তা ছকে লিখুন। কোন Table এর Row সবচেয়ে
        সহজে মোছা যায়, আর কেন?
      </span>,
      <span key="3">
        <strong>Guide দের Soft Delete:</strong> guides এর একটা নকলে deleted_at যোগ করুন, ফোনের জন্য Partial Unique Index বানান, আর জীবিত Guide দের
        একটা View। তারপর তিনটা Query লিখুন: Website এর Guide তালিকা, প্রতিটা Guide কতগুলো Tour চালিয়েছেন তার ইতিহাস, আর মুছে ফেলা Guide দের তালিকা।
        প্রতিটায় কোন Filter দিলেন আর কেন, এক লাইনে।
      </span>,
      <span key="4">
        <strong>Archive এর Job:</strong> bookings এর নকল থেকে জুন 2026 এর আগের Departure এর Booking গুলো Archive এ সরান, কিন্তু একবারে সর্বোচ্চ 5টা: WITH
        এর ভেতরের DELETE এর WHERE এ একটা Subquery যা LIMIT 5 দিয়ে booking_id বাছে। যতবার চালাতে হলো আর প্রতিবারের Command Tag লিখুন, শেষে দুই Table এর
        count।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> অফিসের ফাইলের আলমারির উদাহরণ দিয়ে Hard Delete, Soft Delete, Archive আর Anonymize এর পার্থক্য, আর কেন
        Payment এর Row কখনো মোছা হয় না, ছয় লাইনে।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিন DELETE এর ছক, ইচ্ছাকৃত ভুলটা কীভাবে ধরা পড়ল তার নোট সহ</span>,
      <span key="d2">আট Table এর Foreign Key মানচিত্র আর পরীক্ষার ফলাফল</span>,
      <span key="d3">Guide দের Soft Delete এর SQL, তিন Query আর প্রতিটার Filter এর কারণ</span>,
      <span key="d4">Archive Job এর SQL, চালানোর সংখ্যা আর শেষের count</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ মোছা, লুকানো আর সরানো",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, এই ক্রমেই চালান, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "আগে দেখুন, খামের ভেতরে মুছুন",
        description:
          "bookings এর নকল, তারপর একই WHERE দিয়ে count: 3। BEGIN এর ভেতরে DELETE 3, বাকি 21, তারপর ROLLBACK, আর আবার 24। প্রথম ফাইলের NOTICE টা শুধু বলে del_bookings আগে ছিল না।",
      },
      {
        title: "রসিদ, old আর new সহ",
        description:
          "আগের ড্রিলের del_bookings থেকে cancelled তিনটা মোছা। psql আগে RETURNING এর তিনটা Row দেখায়, new_id ফাঁকা, তারপর নিচে DELETE 3।",
      },
      {
        title: "USING, আর Foreign Key এর পাহারা",
        description:
          "30 দিনের ভেতরের তিনটা Hold মোছে: 14, 20, 24। তারপর আসল customers থেকে Oliver কে মোছার চেষ্টা, Error 23503। আসল Table এ কিছুই বদলায় না, কারণ Error হলে কমান্ডটা বাতিল।",
      },
      {
        title: "Soft Delete, View আর Partial Unique Index",
        description:
          "customers এর নকলে deleted_at, Partial Unique Index আর একটা View। Oliver কে Soft Delete করার পরে View এ 14 জন, আর একই Email এ নতুন Oliver (Customer 16) ঢুকতে পারেন।",
      },
      {
        title: "এক Statement এ Archive",
        description:
          "জুন 2026 এর আগের Departure এর Booking গুলো সরে। psql এর উত্তর INSERT 0 12, শেষে live_rows 12 আর archived_rows 12। এখানে now() চলে, কারণ কোনো সময় আমরা উদ্ধৃত করছি না।",
      },
      {
        title: "নিজের পরে গোছানো",
        description: "ড্রিলের View আর তিনটা Table সরানো, আর যাচাই যে del_ দিয়ে শুরু কোনো Table নেই: 0।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-look-first.sql",
        code: `DROP TABLE IF EXISTS del_bookings;
CREATE TABLE del_bookings AS SELECT * FROM bookings;
-- SELECT 24

SELECT count(*) AS doomed
FROM del_bookings
WHERE status = 'pending' AND booked_at < DATE '2026-10-11';
-- (1 row) 3

BEGIN;
DELETE FROM del_bookings
WHERE status = 'pending' AND booked_at < DATE '2026-10-11';
-- DELETE 3
SELECT count(*) AS rows_left FROM del_bookings;
-- (1 row) 21
ROLLBACK;

SELECT count(*) AS rows_after_rollback FROM del_bookings;
-- (1 row) 24`,
      },
      {
        language: "sql",
        filename: "02-returning.sql",
        code: `DELETE FROM del_bookings
WHERE status = 'cancelled'
RETURNING old.booking_id, new.booking_id AS new_id, old.total_bdt;
--  booking_id | new_id | total_bdt
-- ------------+--------+-----------
--           5 |        |  17000.00
--          12 |        |  25000.00
--          18 |        |   9500.00
-- (3 rows)
--
-- DELETE 3`,
      },
      {
        language: "sql",
        filename: "03-using-and-fk.sql",
        code: `DELETE FROM del_bookings AS b
USING departures AS d
WHERE b.departure_id = d.departure_id
  AND b.status = 'pending'
  AND d.starts_on < DATE '2026-11-01' + 30
RETURNING b.booking_id, d.starts_on;
-- (3 rows) 14 | 2026-11-20, 20 | 2026-11-14, 24 | 2026-11-14
-- DELETE 3

DELETE FROM customers WHERE customer_id = 11;
-- ERROR:  update or delete on table "customers" violates foreign key
--         constraint "bookings_customer_id_fkey" on table "bookings"
-- DETAIL:  Key (customer_id)=(11) is still referenced from table "bookings".`,
      },
      {
        language: "sql",
        filename: "04-soft-delete.sql",
        code: `DROP VIEW IF EXISTS del_live_customers;
DROP TABLE IF EXISTS del_customers;
CREATE TABLE del_customers AS SELECT * FROM customers;
ALTER TABLE del_customers ADD COLUMN deleted_at timestamptz;
CREATE UNIQUE INDEX del_customers_live_email
  ON del_customers (email)
  WHERE deleted_at IS NULL;
-- CREATE INDEX
CREATE VIEW del_live_customers AS
  SELECT * FROM del_customers WHERE deleted_at IS NULL;
-- CREATE VIEW

UPDATE del_customers SET deleted_at = now() WHERE customer_id = 11;
-- UPDATE 1
SELECT count(*) AS live_customers FROM del_live_customers;
-- (1 row) 14

INSERT INTO del_customers (customer_id, full_name, email, city, country)
VALUES (16, 'Oliver Bennett', 'oliver.bennett@mail.example', 'London', 'United Kingdom');
-- INSERT 0 1
SELECT customer_id, deleted_at IS NOT NULL AS deleted
FROM del_customers
WHERE email = 'oliver.bennett@mail.example'
ORDER BY customer_id;
-- (2 rows) 11 | t, 16 | f`,
      },
      {
        language: "sql",
        filename: "05-archive.sql",
        code: `DROP TABLE IF EXISTS del_bookings, del_bookings_archive;
CREATE TABLE del_bookings AS SELECT * FROM bookings;
CREATE TABLE del_bookings_archive AS
  SELECT *, NULL::timestamptz AS archived_at FROM bookings WITH NO DATA;

WITH moved AS (
  DELETE FROM del_bookings AS b
  USING departures AS d
  WHERE b.departure_id = d.departure_id
    AND d.starts_on < DATE '2026-06-01'
  RETURNING b.*
)
INSERT INTO del_bookings_archive
SELECT moved.*, now() FROM moved;
-- INSERT 0 12

SELECT (SELECT count(*) FROM del_bookings) AS live_rows,
       (SELECT count(*) FROM del_bookings_archive) AS archived_rows;
-- (1 row) 12 | 12`,
      },
      {
        language: "sql",
        filename: "06-clean-up.sql",
        code: `DROP VIEW IF EXISTS del_live_customers;
DROP TABLE IF EXISTS del_customers, del_bookings, del_bookings_archive;
-- DROP TABLE

SELECT count(*) AS del_tables_left
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'del\\_%';
-- (1 row) 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        নিজের Database এ যেকোনো মোছার আগে psql এ <code className={CODE}>\set ON_ERROR_STOP on</code> দিন আর BEGIN দিয়ে শুরু করুন। চাইলে{" "}
        <code className={CODE}>\set AUTOCOMMIT off</code> দিয়ে psql কে এমন বানাতে পারেন যে প্রতিটা কমান্ড নিজে থেকেই একটা খোলা Transaction এ থাকে,
        আপনি COMMIT না লেখা পর্যন্ত। এর পুরো আলোচনা{" "}
        <Link href="/sql/topic/update-without-where" className={LINK}>
          UPDATE Without WHERE
        </Link>{" "}
        লেসনে।
      </ContentParagraph>
    ),
  },
};
