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
  FkActionLab,
  FkCheckLab,
} from "../../../components/course/topics/ddl/fk-animations";
import {
  FkActionsDiagram,
  FkCheckSplit,
  FkIndexSplit,
  FkParentChildDiagram,
} from "../../../components/course/topics/ddl/fk-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const foreignKeysContent: TopicData = {
  id: "foreign-keys",
  introduction: {
    badge: "MODULE 09 · LESSON 09",
    title: <SectionTitle>দুটো Table এর সম্পর্ক পাহারা দেওয়া</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি প্রতিটা Row কে একটা অনন্য পরিচয় দিয়েছেন, Primary Key। এখন সেই পরিচয় অন্য Table থেকে
          ব্যবহার করার পালা। bookings এর প্রতিটা Row এ লেখা থাকে customer_id, মানে কোন Customer এই Booking করেছেন। কিন্তু
          শুধু একটা সংখ্যা লিখে রাখলেই সম্পর্ক তৈরি হয় না। সেই সংখ্যার Customer যদি না থাকেন, অথবা পরে মুছে যান,
          Database কিছুই বলবে না, যদি না আপনি তাকে নিয়মটা বলে দেন।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই নিয়ম নিয়ে: Foreign Key। একটা লাইন, REFERENCES, আর Database নিজেই পাহারা দেয় যেন Child Table এ
          এমন কোনো মান না ঢোকে যার Parent নেই, আর Parent থেকে এমন কোনো Row না সরে যাকে কেউ এখনো দেখাচ্ছে। সাথে
          আপনি আগেই ঠিক করে রাখবেন, Parent মুছলে Child এর কী হবে: আটকে দেওয়া, সাথে মুছে ফেলা, ফাঁকা করে দেওয়া, নাকি
          একটা Default মানে পাঠিয়ে দেওয়া।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি REFERENCES লিখতে পারবেন, জানবেন কোন চারটা কাজে Check হয় আর কোন দুটোয় হয় না, পাঁচটা ON DELETE
          নিয়মের প্রতিটা নিজে চালিয়ে দেখবেন, DEFERRABLE কী আর কখন লাগে বুঝবেন, আর জানবেন কেন PostgreSQL এ Foreign Key
          Column এ Index নিজে দিতে হয়। MySQL এর একটা বড় ফাঁদও দেখবেন: Column এর পাশে লেখা REFERENCES সেখানে কিছুই করে না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি দুটো Table এর মাঝের সেতুর পাহারাদার। কেউ এমন Booking লিখতে চাইলে যার Customer নেই, আমি দরজা বন্ধ করি। কেউ এমন Customer মুছতে চাইলে যাঁর Booking আছে, আমি জিজ্ঞেস করি: তাহলে Booking গুলোর কী হবে? উত্তরটা আপনি আমাকে আগেই বলে রাখেন, Table বানানোর দিনেই।",
      author: "REFERENCES",
      role: "Lesson 09",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যে Booking এর কোনো Customer নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর Manager ফারুক সাহেব নতুন Developer তানিমকে একটা পুরনো গল্প
                শোনালেন। PostgreSQL এ আসার আগে Booking রাখা হতো একজন Freelancer এর বানানো ছোট একটা App এ। সেখানেও
                customers আর bookings আলাদা Table ছিল, আর প্রতিটা Booking এ ছিল customer_id। কিন্তু Database কে কেউ বলেনি
                যে customer_id এর মান customers এ থাকতেই হবে। Database এর চোখে মানটা ছিল শুধু একটা সংখ্যা।
              </ContentParagraph>
              <ContentParagraph>
                একদিন একজন কর্মী Customer তালিকা পরিষ্কার করতে গিয়ে Rahim Uddin এর Row মুছে ফেললেন। তিনি ভেবেছিলেন এটা
                দুইবার লেখা একটা Row। Database কোনো আপত্তি করল না। Rahim সাহেবের দুটো Booking, মোট 75000 টাকা, রয়ে গেল
                customer_id = 1 নিয়ে, অথচ 1 নম্বর Customer আর কোথাও নেই। এমন Row কে বলে Orphan Row, অনাথ Row: সে একজন
                Parent কে দেখায়, কিন্তু সেই Parent আর নেই।
              </ContentParagraph>
              <ContentParagraph>
                মাস শেষের আয়ের Report টা নাম দেখানোর জন্য bookings কে customers এর সাথে JOIN করত। Module 06 এর{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  INNER JOIN
                </Link>{" "}
                লেসনে আপনি দেখেছেন, জোড়া না পাওয়া Row INNER JOIN চুপচাপ বাদ দেয়। তাই Report এ সেই দুটো Booking আর আসেনি।
                Report দেখাল 38000, আসল আয় 113000। কোনো Error নেই, কোনো সতর্কবার্তা নেই। তিন সপ্তাহ পরে হিসাবরক্ষক টাকার
                হিসাব মেলাতে না পেরে প্রশ্ন তুললেন, তখন খোঁজ শুরু হলো। নিচের বক্সে সেই পুরনো App এর ঘটনাটা ছোট করে
                আবার ঘটানো হয়েছে, Foreign Key ছাড়া দুটো Table দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো App: Foreign Key ছাড়া"
              query={`DROP TABLE IF EXISTS fk_old_bookings, fk_old_customers;

CREATE TABLE fk_old_customers (
  customer_id integer PRIMARY KEY,
  full_name   text NOT NULL
);

-- customer_id আছে, কিন্তু কোনো REFERENCES নেই
CREATE TABLE fk_old_bookings (
  booking_id  integer PRIMARY KEY,
  customer_id integer NOT NULL,
  total_bdt   numeric(10, 2) NOT NULL
);

INSERT INTO fk_old_customers VALUES
  (1, 'Rahim Uddin'), (2, 'Nusrat Jahan'), (3, 'Tanvir Ahmed');
INSERT INTO fk_old_bookings VALUES
  (1, 1, 25000), (2, 1, 50000), (3, 2, 12500), (4, 3, 25500);

SELECT sum(total_bdt) AS all_bookings FROM fk_old_bookings;

-- "পরিষ্কার" করার নামে একজন Customer মোছা
DELETE FROM fk_old_customers WHERE customer_id = 1;

-- মাস শেষের Report, নামের জন্য JOIN
SELECT sum(b.total_bdt) AS report_revenue
FROM fk_old_bookings b
JOIN fk_old_customers c ON c.customer_id = b.customer_id;

-- অনাথ Row খোঁজা: যে Booking এর Customer নেই
SELECT b.booking_id, b.customer_id, b.total_bdt
FROM fk_old_bookings b
LEFT JOIN fk_old_customers c ON c.customer_id = b.customer_id
WHERE c.customer_id IS NULL
ORDER BY b.booking_id;`}
              caption="প্রথম SELECT এ সব Booking এর যোগফল 113000.00। Customer 1 মোছার পরে JOIN করা Report বলছে 38000.00, অথচ bookings থেকে একটা Row ও মোছেনি। শেষ Query টা LEFT JOIN দিয়ে অনাথ Row খোঁজে: Booking 1 আর 2, দুটোই এমন Customer কে দেখায় যিনি আর নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আজকের Island Tours এর Database এ এই ঘটনা ঘটতেই পারে না। নিচের বক্সে একই কাজ, এবার আসল customers Table থেকে
              Rahim Uddin কে মোছার চেষ্টা। চালিয়ে দেখুন কী হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আসল Database এ একই চেষ্টা"
              query={`DELETE FROM customers WHERE customer_id = 1;`}
              caption="ERROR, আর কিছুই মোছেনি। বার্তা বলছে bookings Table এর bookings_customer_id_fkey নামের একটা Constraint মোছা আটকে দিয়েছে, আর DETAIL এ কারণ: Key (customer_id)=(1) is still referenced from table bookings। এই পাহারাদারের নাম Foreign Key, আর পুরো লেসন এটা নিয়েই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Referential Integrity",
          content: (
            <ContentParagraph>
              যে Column আরেক Table এর Row কে দেখায়, তার প্রতিটা মান যেন সত্যিই কোনো Row কে দেখায়, কেউ যেন অনাথ না থাকে,
              এই নিশ্চয়তার নাম Referential Integrity। Foreign Key হলো এই নিশ্চয়তা Database এর ভেতরে লিখে রাখার উপায়। একই
              Check App এর Code এ লিখলে একদিন কেউ সরাসরি psql থেকে, অন্য কোনো App থেকে, অথবা একটা ভুল Script থেকে Data
              বদলাবে, আর Check টা পাশ কাটিয়ে যাবে। Database এর ভেতরের নিয়ম কোনো পথ দিয়েই পাশ কাটানো যায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-is-a-foreign-key",
      subHeader: { index: "002", title: "What a Foreign Key Is" },
      title: <SectionTitle>Parent, Child আর মাঝের একটা প্রতিশ্রুতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Foreign Key একটা Constraint।{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Lesson 07
                </Link>{" "}
                এর NOT NULL, UNIQUE আর CHECK এর মতোই এটা একটা নিয়ম, যেটা Table এর গায়ে লেখা থাকে আর প্রতিটা বদলের সময়
                খাটে। পার্থক্য একটাই: বাকি নিয়মগুলো এক Table এর ভেতরে তাকায়, Foreign Key তাকায় দুটো Table এর মাঝে। শব্দগুলো
                এই লেসনে বারবার আসবে, তাই আগে চিনে নিন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Parent Table, বা Referenced Table:</strong> যাকে দেখানো হয়। এখানে customers।
                </ListItem>
                <ListItem>
                  <strong>Child Table, বা Referencing Table:</strong> যে দেখায়। এখানে bookings।
                </ListItem>
                <ListItem>
                  <strong>Referencing Column:</strong> Child এর যে Column এ Parent এর Key লেখা থাকে, এখানে
                  bookings.customer_id। সাধারণ কথায় অনেকে এই Column টাকেই Foreign Key বলেন।
                </ListItem>
                <ListItem>
                  <strong>Referenced Column:</strong> Parent এর যে Column কে দেখানো হয়, এখানে customers.customer_id।
                  সাধারণত এটা Primary Key, আর অন্তত UNIQUE হতেই হবে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিশ্রুতি:</strong> Child এর Referencing Column এ যে মান থাকবে, সেটা হয় NULL, নয়তো Parent এর
                  Referenced Column এ ঠিক সেই মানের একটা Row আছে। এর বাইরে কিছু না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkParentChildDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামটা Foreign কেন? কারণ Key টা এই Table এর নিজের না, আরেক Table এর, মানে বিদেশি। bookings এর নিজের Key হলো
                booking_id। customer_id হলো customers এর Key, যেটা bookings এ অতিথি হয়ে বসে আছে। Island Tours এর ৮টা Table কে
                জুড়ে রেখেছে এমন ৭টা Foreign Key:
              </ContentParagraph>
              <ContentList>
                <ListItem>tours.destination_id থেকে destinations, প্রতিটা ট্যুর কোনো একটা জায়গার।</ListItem>
                <ListItem>tours.guide_id থেকে guides, তবে এখানে NULL চলে, কারণ কোনো ট্যুরের Guide এখনো ঠিক না হতে পারে।</ListItem>
                <ListItem>departures.tour_id থেকে tours, প্রতিটা যাত্রার তারিখ কোনো একটা ট্যুরের।</ListItem>
                <ListItem>bookings.customer_id থেকে customers, আর bookings.departure_id থেকে departures।</ListItem>
                <ListItem>payments.booking_id থেকে bookings, প্রতিটা টাকা কোনো একটা Booking এর।</ListItem>
                <ListItem>
                  reviews.booking_id থেকে bookings। এই Column এ UNIQUE ও আছে, তাই একটা Booking এ সর্বোচ্চ একটা Review।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একজন Customer এর অনেক Booking থাকতে পারে, কিন্তু প্রতিটা Booking এর Customer ঠিক একজন। এই এক থেকে অনেক
                (One-to-Many) সম্পর্কই Foreign Key এর সবচেয়ে সাধারণ চেহারা, আর Foreign Key সবসময় বসে &quot;অনেক&quot; এর দিকের Table
                এ। কোন সম্পর্ক কীভাবে আঁকতে আর বানাতে হয়, সেটা Module 11 এর{" "}
                <Link href="/sql/topic/relationship-types" className={LINK}>
                  One-to-One, One-to-Many, Many-to-Many
                </Link>{" "}
                লেসনে। এখন দেখুন প্রতিশ্রুতিটা আসলেই রাখা হচ্ছে কিনা: থিওরির অনাথ খোঁজার Query টা আসল Data তে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আসল Data তে অনাথ Booking আছে কি?"
              query={`SELECT count(*) AS orphan_bookings
FROM bookings b
LEFT JOIN customers c ON c.customer_id = b.customer_id
WHERE c.customer_id IS NULL;`}
              caption="0। Foreign Key থাকলে এই প্রশ্নের উত্তর সবসময় 0, আজ, কাল, দশ বছর পরেও, কে কোন পথে Data বদলাল তাতে কিছু যায় আসে না। পুরনো App এ এই একই Query দিয়েছিল 2।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "writing-references",
      subHeader: { index: "003", title: "Writing REFERENCES" },
      title: <SectionTitle>প্রথম Foreign Key, নিজের হাতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এখন ট্যুরের সাথে Hotel এর থাকাও বিক্রি করবে। তানিমের প্রথম কাজ দুটো Table: Partner Hotel গুলো,
                আর প্রতিটা Hotel এর Room। প্রতিটা Room কোনো একটা Hotel এর, তাই Room এর Table এ থাকবে hotel_id, আর সেটা
                দেখাবে Hotel এর Table কে। লেসনের সব Table এর নাম fk_ দিয়ে শুরু, যাতে Island Tours এর আসল Table এর সাথে না
                মেশে। প্রতিটা বক্স শুরু হয় DROP TABLE IF EXISTS দিয়ে, তাই যতবার খুশি চালাতে পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Hotel আর তার Room"
              query={`DROP TABLE IF EXISTS fk_rooms, fk_hotels;

-- আগে Parent
CREATE TABLE fk_hotels (
  hotel_id integer PRIMARY KEY,
  name     text NOT NULL
);

-- তারপর Child, hotel_id দেখায় fk_hotels এর hotel_id কে
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_hotels (hotel_id),
  label    text NOT NULL
);

-- PostgreSQL কী মনে রাখল
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'fk_rooms'::regclass AND contype = 'f';`}
              caption="একটা Row: fk_rooms_hotel_id_fkey, আর তার সংজ্ঞা FOREIGN KEY (hotel_id) REFERENCES fk_hotels(hotel_id)। নামটা আপনি দেননি, PostgreSQL নিজে বানিয়েছে: Table এর নাম, Column এর নাম, শেষে fkey।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লাইনটা ভেঙে পড়লে: <code className={CODE}>hotel_id integer NOT NULL REFERENCES fk_hotels (hotel_id)</code>।
                প্রথম অংশ আগের লেসনগুলোর মতোই, Column এর নাম, Type, আর NOT NULL। নতুন শুধু শেষটা: REFERENCES, তারপর Parent
                Table এর নাম, বন্ধনীতে Parent এর কোন Column। মানে দাঁড়ায়, এই Column এ যা লেখা হবে তা fk_hotels এর hotel_id
                তে থাকতে হবে। NOT NULL আলাদা নিয়ম: প্রতিটা Room কোনো না কোনো Hotel এর হতেই হবে, ফাঁকা চলবে না।
              </ContentParagraph>
              <ContentParagraph>
                শেষের SELECT পড়েছে pg_constraint, PostgreSQL এর একটা Catalog Table, যেখানে প্রতিটা Constraint এর একটা Row
                থাকে। contype = &apos;f&apos; মানে Foreign Key (p হলে Primary Key, u UNIQUE, c CHECK)। আর psql এ{" "}
                <code className={CODE}>\d fk_rooms</code> লিখলে একই তথ্য মানুষের ভাষায় আসে। আর Parent এর দিকে{" "}
                <code className={CODE}>\d fk_hotels</code> দেখায় কে তাকে দেখাচ্ছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql (PostgreSQL 18.6)",
          code: `island_tours=# \\d fk_rooms
               Table "public.fk_rooms"
  Column  |  Type   | Collation | Nullable | Default
----------+---------+-----------+----------+---------
 room_id  | integer |           | not null |
 hotel_id | integer |           | not null |
 label    | text    |           | not null |
Indexes:
    "fk_rooms_pkey" PRIMARY KEY, btree (room_id)
Foreign-key constraints:
    "fk_rooms_hotel_id_fkey" FOREIGN KEY (hotel_id) REFERENCES fk_hotels(hotel_id)

island_tours=# \\d fk_hotels
              Table "public.fk_hotels"
  Column  |  Type   | Collation | Nullable | Default
----------+---------+-----------+----------+---------
 hotel_id | integer |           | not null |
 name     | text    |           | not null |
Indexes:
    "fk_hotels_pkey" PRIMARY KEY, btree (hotel_id)
Referenced by:
    TABLE "fk_rooms" CONSTRAINT "fk_rooms_hotel_id_fkey" FOREIGN KEY (hotel_id) REFERENCES fk_hotels(hotel_id)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জিনিস লক্ষ করুন: fk_rooms এর Indexes এ শুধু fk_rooms_pkey, hotel_id তে কোনো Index নেই। Foreign Key
                বানালেই Index হয় না। কেন এটা গুরুত্বপূর্ণ, সেটা এই লেসনের Indexing অংশে।
              </ContentParagraph>
              <ContentParagraph>
                একই Foreign Key চারভাবে লেখা যায়। Column এর পাশে পুরো রূপ, যেটা উপরে দেখলেন। Column এর পাশে ছোট রূপ, যেখানে
                Parent এর Column এর নাম বাদ: তখন PostgreSQL ধরে নেয় Parent এর Primary Key। Table এর শেষে আলাদা লাইনে, FOREIGN
                KEY (column) REFERENCES দিয়ে। আর সেই আলাদা লাইনের আগে CONSTRAINT দিয়ে নিজের দেওয়া নাম। নিচের বক্সে চারটাই,
                আর PostgreSQL চারটাকে একই জিনিস হিসেবে মনে রাখে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Foreign Key, চার রকম লেখা"
              query={`DROP TABLE IF EXISTS fk_spell_a, fk_spell_b, fk_spell_c, fk_spell_d, fk_spell_hotels;

CREATE TABLE fk_spell_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);

-- ১. Column এর পাশে, পুরো রূপ
CREATE TABLE fk_spell_a (
  room_id  integer PRIMARY KEY,
  hotel_id integer REFERENCES fk_spell_hotels (hotel_id)
);

-- ২. Column এর পাশে, ছোট রূপ: Parent এর Primary Key ধরে নেওয়া হয়
CREATE TABLE fk_spell_b (
  room_id  integer PRIMARY KEY,
  hotel_id integer REFERENCES fk_spell_hotels
);

-- ৩. Table এর শেষে আলাদা লাইনে
CREATE TABLE fk_spell_c (
  room_id  integer PRIMARY KEY,
  hotel_id integer,
  FOREIGN KEY (hotel_id) REFERENCES fk_spell_hotels (hotel_id)
);

-- ৪. আলাদা লাইনে, নিজের দেওয়া নাম সহ
CREATE TABLE fk_spell_d (
  room_id  integer PRIMARY KEY,
  hotel_id integer,
  CONSTRAINT fk_spell_d_hotel_fk
    FOREIGN KEY (hotel_id) REFERENCES fk_spell_hotels (hotel_id)
);

SELECT conrelid::regclass AS child_table, conname,
       pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'f' AND conrelid::regclass::text LIKE 'fk_spell_%'
ORDER BY 1;`}
              caption="৪টা Row, চারটার definition হুবহু এক: FOREIGN KEY (hotel_id) REFERENCES fk_spell_hotels(hotel_id)। পার্থক্য শুধু নামে। প্রথম তিনটার নাম PostgreSQL এর বানানো, যেমন fk_spell_a_hotel_id_fkey। চতুর্থটার নাম আপনার দেওয়া fk_spell_d_hotel_fk।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন রূপটা কখন",
          content: (
            <ContentParagraph>
              এক Column এর সাধারণ Foreign Key এর জন্য Column এর পাশের রূপটাই সবচেয়ে পরিষ্কার, পড়লেই বোঝা যায় কোন Column কাকে
              দেখায়। দুই বা বেশি Column মিলে Foreign Key হলে আলাদা লাইনের রূপ ছাড়া উপায় নেই, এটা পরের একটা অংশে দেখবেন।
              আর আসল Project এ নিজের দেওয়া নামের অভ্যাস ভালো: Error বার্তায় নামটাই আসে, আর{" "}
              <Link href="/sql/topic/alter-table" className={LINK}>
                পরের লেসনে
              </Link>{" "}
              ALTER TABLE দিয়ে Constraint মুছতে বা বদলাতে গেলে নামটা ধরেই ডাকতে হয়। তবে MySQL এ যাবেন এমন Code হলে সাবধান:
              সেখানে Column এর পাশের রূপ একেবারেই কাজ করে না, In MySQL অংশে দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              REFERENCES লেখার সময় চারটা নিয়ম মানতে হয়। প্রতিটা ভাঙলে একটা চেনা Error আসে, আর সেটা আসে CREATE TABLE এর
              সময়েই, Data ঢোকানোর আগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "ভাঙলে কী আসে", "ঠিক করার উপায়"],
          rows: [
            [
              "Parent Table আগে থাকতে হবে",
              "ERROR: relation \"fk_late_hotels\" does not exist (SQLSTATE 42P01)",
              "আগে Parent এর CREATE TABLE, তারপর Child",
            ],
            [
              "Referenced Column এ PRIMARY KEY বা UNIQUE থাকতে হবে",
              "ERROR: there is no unique constraint matching given keys for referenced table (42830)",
              "Parent এর সেই Column এ PRIMARY KEY বা UNIQUE দিন",
            ],
            [
              "দুই দিকের Type মিলতে হবে",
              "ERROR: foreign key constraint cannot be implemented, DETAIL: ... are of incompatible types: text and integer (42804)",
              "দুই দিকে একই Type, integer এর সাথে integer",
            ],
            [
              "দুই দিকের Column সংখ্যা সমান",
              "ERROR: number of referencing and referenced columns for foreign key disagree (42830)",
              "যতগুলো Column দেখাচ্ছেন, Parent এ ততগুলোই দিন",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Parent এর Column এ UNIQUE নেই"
              query={`DROP TABLE IF EXISTS fk_codes_rooms, fk_codes_hotels;

-- code এ PRIMARY KEY বা UNIQUE কিছুই নেই
CREATE TABLE fk_codes_hotels (
  code text,
  name text NOT NULL
);

CREATE TABLE fk_codes_rooms (
  room_id    integer PRIMARY KEY,
  hotel_code text REFERENCES fk_codes_hotels (code)
);`}
              caption="শেষ Statement এ ERROR: there is no unique constraint matching given keys for referenced table fk_codes_hotels। কারণটা যুক্তির: code এ একই মান দুইবার থাকতে পারলে Room টা কোন Hotel এর, সেটা বলাই যেত না। প্রথম CREATE TABLE এ code text এর জায়গায় code text PRIMARY KEY লিখে আবার চালান, এবার সব চলবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              integer এর সাথে bigint এর মতো কাছাকাছি সংখ্যার Type এ PostgreSQL আপত্তি করে না, Foreign Key তৈরি হয়ে যায়। তবু
              অভ্যাস রাখুন দুই দিকে হুবহু একই Type দেওয়ার। Parent এর Key যদি{" "}
              <Link href="/sql/topic/primary-keys" className={LINK}>
                আগের লেসনের
              </Link>{" "}
              মতো integer Identity হয়, Child এর Column ও integer।
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
                  fk_ex1_hotels তৈরি করাই আছে। তার নিচে <code className={CODE}>fk_ex1_rooms</code> লিখুন: room_id integer
                  Primary Key, hotel_id integer যেটা খালি থাকতে পারবে না আর fk_ex1_hotels এর hotel_id কে দেখাবে, আর label
                  text যেটা খালি থাকতে পারবে না। কোনো ON DELETE লিখবেন না। শেষের Check Query টা যেমন আছে তেমন শেষেই রাখুন।
                </>
              }
              hint={
                <>
                  Column এর পাশে <code className={CODE}>NOT NULL REFERENCES fk_ex1_hotels (hotel_id)</code>। আলাদা লাইনে
                  FOREIGN KEY লিখলেও চলবে, Check Query দুটোকে একই দেখে।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ex1_rooms, fk_ex1_hotels;

CREATE TABLE fk_ex1_hotels (
  hotel_id integer PRIMARY KEY,
  name     text NOT NULL
);

-- এখানে CREATE TABLE fk_ex1_rooms লিখুন


-- এই Check Query টা শেষেই থাকবে
SELECT a.attname AS fk_column,
       c.confrelid::regclass::text AS parent_table,
       c.confdeltype AS on_delete
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.conrelid = 'fk_ex1_rooms'::regclass AND c.contype = 'f';`}
              solution={`SELECT * FROM (VALUES ('hotel_id', 'fk_ex1_hotels', 'a'))
  AS v(fk_column, parent_table, on_delete);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "what-is-checked",
      subHeader: { index: "004", title: "What Gets Checked" },
      title: <SectionTitle>কোন চারটা কাজে পাহারা, কোন দুটোয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো Table এর উপর মোট ছয় রকম কাজ করা যায়: Child এ INSERT, UPDATE, DELETE, আর Parent এ INSERT, UPDATE,
                DELETE। প্রতিটা কাজের আগে প্রশ্ন একটাই: এই কাজে কি কোনো Row অনাথ হতে পারে? যেখানে পারে, সেখানে PostgreSQL
                Check করে। যেখানে পারে না, সেখানে Check চালানোর কোনো মানেই নেই, তাই চলে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Child এ INSERT:</strong> নতুন Room বলছে সে Hotel 99 এর। Hotel 99 আছে তো? না থাকলে ERROR।
                </ListItem>
                <ListItem>
                  <strong>Child এ UPDATE, Referencing Column বদলালে:</strong> নতুন মানটার জন্য একই প্রশ্ন।
                </ListItem>
                <ListItem>
                  <strong>Parent এ DELETE:</strong> এই Hotel কে কোনো Room কি এখনো দেখাচ্ছে? দেখালে ON DELETE এর নিয়ম খাটে,
                  আর কিছু না লিখলে নিয়মটা হলো আটকে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>Parent এ UPDATE, Key বদলালে:</strong> পুরনো Key কি কেউ দেখাচ্ছে? দেখালে ON UPDATE এর নিয়ম।
                </ListItem>
                <ListItem>
                  <strong>Child এ DELETE আর Parent এ INSERT:</strong> কোনো Check নেই। Room মুছলে কেউ অনাথ হয় না। নতুন Hotel
                  এলেও কারও কিছু হারায় না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkCheckSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের তিনটা বক্সে একই তিনটা Hotel আর তিনটা Room। Riverside Inn এর কোনো Room নেই, ইচ্ছে করেই। প্রথম বক্সে Child এর
              দিক থেকে একটা অনাথ ঢোকানোর চেষ্টা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অনাথ Room ঢোকানোর চেষ্টা"
              query={`DROP TABLE IF EXISTS fk_rooms, fk_hotels;
CREATE TABLE fk_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_hotels (hotel_id),
  label    text NOT NULL
);
INSERT INTO fk_hotels VALUES
  (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge'), (3, 'Riverside Inn');
INSERT INTO fk_rooms VALUES
  (101, 1, 'Sea view double'), (102, 1, 'Garden twin'), (201, 2, 'Cloud deck single');

-- Hotel 99 নেই
INSERT INTO fk_rooms VALUES (301, 99, 'Ghost room');`}
              caption="শেষ লাইনে ERROR: insert or update on table fk_rooms violates foreign key constraint fk_rooms_hotel_id_fkey, DETAIL: Key (hotel_id)=(99) is not present in table fk_hotels। SQLSTATE 23503, নাম foreign_key_violation। আগের সব লাইন ঠিকঠাক চলেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কাউকে দেখানো Hotel মোছার চেষ্টা"
              query={`DROP TABLE IF EXISTS fk_rooms, fk_hotels;
CREATE TABLE fk_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_hotels (hotel_id),
  label    text NOT NULL
);
INSERT INTO fk_hotels VALUES
  (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge'), (3, 'Riverside Inn');
INSERT INTO fk_rooms VALUES
  (101, 1, 'Sea view double'), (102, 1, 'Garden twin'), (201, 2, 'Cloud deck single');

-- Room 101 আর 102 এখনো Hotel 1 দেখায়
DELETE FROM fk_hotels WHERE hotel_id = 1;`}
              caption="ERROR: update or delete on table fk_hotels violates foreign key constraint fk_rooms_hotel_id_fkey on table fk_rooms, DETAIL: Key (hotel_id)=(1) is still referenced from table fk_rooms। একই SQLSTATE 23503, কিন্তু বার্তার শুরুটা আলাদা: Child এর দিকে insert or update, Parent এর দিকে update or delete। শুরুর শব্দ দেখেই বুঝবেন কোন দিক থেকে ভেঙেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে কাজগুলো কাউকে অনাথ করে না"
              query={`DROP TABLE IF EXISTS fk_rooms, fk_hotels;
CREATE TABLE fk_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_hotels (hotel_id),
  label    text NOT NULL
);
INSERT INTO fk_hotels VALUES
  (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge'), (3, 'Riverside Inn');
INSERT INTO fk_rooms VALUES
  (101, 1, 'Sea view double'), (102, 1, 'Garden twin'), (201, 2, 'Cloud deck single');

DELETE FROM fk_rooms WHERE room_id = 102;            -- Child মোছা: Check নেই
INSERT INTO fk_hotels VALUES (4, 'Kuakata Sea Inn'); -- নতুন Parent: Check নেই
DELETE FROM fk_hotels WHERE hotel_id = 3;            -- Check হলো, কেউ দেখায় না

SELECT h.hotel_id, h.name, count(r.room_id) AS rooms
FROM fk_hotels h
LEFT JOIN fk_rooms r ON r.hotel_id = h.hotel_id
GROUP BY h.hotel_id, h.name
ORDER BY h.hotel_id;`}
              caption="তিনটা Statement ই সফল। ফলাফলে ৩টা Row: Sea Pearl Resort এর এখন 1টা Room, Hill View Lodge এর 1টা, নতুন Kuakata Sea Inn এর 0টা। Riverside Inn মুছে গেছে, কারণ তাকে কোনো Room দেখাত না। Parent মোছায় Check হয়েছে ঠিকই, শুধু আটকানোর মতো কাউকে পায়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবগুলো একসাথে, নিজের হাতে। নিচের Lab এ যেকোনো Statement বেছে নিন। দেখবেন সেখানে Check হয় কিনা, PostgreSQL
              কী উত্তর দিল, আর কোন Row গুলো ঘটনায় জড়িত। শেষের দুটো, DROP TABLE আর TRUNCATE, পুরো Parent Table এর উপর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkCheckLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>NULL এর বেলায় কোনো Check নেই।</strong> প্রতিশ্রুতির কথাটা আবার পড়ুন: মান হয় NULL, নয়তো Parent এ
                আছে। NULL মানে &quot;এখনো জানা নেই&quot; বা &quot;প্রযোজ্য না&quot;, তাই PostgreSQL NULL এর জন্য Parent
                খোঁজে না। এভাবেই একটা সম্পর্ককে ঐচ্ছিক বানানো হয়: Referencing Column এ NOT NULL না দিলে সম্পর্ক ঐচ্ছিক,
                দিলে বাধ্যতামূলক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL হলে Parent খোঁজা হয় না"
              query={`DROP TABLE IF EXISTS fk_rooms, fk_hotels;
CREATE TABLE fk_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
-- এবার hotel_id এ NOT NULL নেই
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer REFERENCES fk_hotels (hotel_id),
  label    text NOT NULL
);
INSERT INTO fk_hotels VALUES (1, 'Sea Pearl Resort');
INSERT INTO fk_rooms VALUES
  (101, 1, 'Sea view double'),
  (900, NULL, 'Not yet assigned');

SELECT * FROM fk_rooms ORDER BY room_id;

-- আসল Data তে ঐচ্ছিক সম্পর্ক
SELECT tour_id, title, guide_id FROM tours WHERE guide_id IS NULL;`}
              caption="Room 900 কোনো Hotel ছাড়াই ঢুকে গেছে। শেষের Query তে আসল Data র একটা Row: Ratargul Swamp Boat Day, guide_id ফাঁকা। tours.guide_id এ NOT NULL নেই, তাই Guide ঠিক না হওয়া ট্যুর রাখা যায়। tours.destination_id এ NOT NULL আছে, তাই জায়গা ছাড়া ট্যুর রাখা যায় না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "on-delete",
      subHeader: { index: "005", title: "ON DELETE: Five Choices" },
      title: <SectionTitle>Parent মুছলে Child এর কী হবে, আগেই ঠিক করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ কাউকে দেখানো Hotel মুছতে গেলেই Error এসেছে। এটা Default আচরণ, কিন্তু একমাত্র না। REFERENCES এর
                পরে <code className={CODE}>ON DELETE</code> লিখে আপনি বলে দিতে পারেন, Parent এর Row গেলে তাকে দেখানো Child
                Row গুলোর কী হবে। পছন্দ পাঁচটা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NO ACTION:</strong> কিছু না লিখলে এটাই। কেউ দেখালে Error, তবে Check হয় Statement এর একদম শেষে।
                </ListItem>
                <ListItem>
                  <strong>RESTRICT:</strong> কেউ দেখালে Error, আর Check হয় সাথে সাথে, অপেক্ষা ছাড়া।
                </ListItem>
                <ListItem>
                  <strong>CASCADE:</strong> Parent এর সাথে তাকে দেখানো Child Row গুলোও মুছে যায়।
                </ListItem>
                <ListItem>
                  <strong>SET NULL:</strong> Child Row থাকে, কিন্তু তার Referencing Column হয়ে যায় NULL।
                </ListItem>
                <ListItem>
                  <strong>SET DEFAULT:</strong> Child Row থাকে, Referencing Column হয়ে যায় সেই Column এর Default মান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                লেখার জায়গা REFERENCES এর ঠিক পরে:{" "}
                <code className={CODE}>hotel_id integer REFERENCES fk_hotels (hotel_id) ON DELETE CASCADE</code>। নিচের ছবিতে
                একই DELETE পাঁচবার, প্রতিবার শুধু ON DELETE এর পরের শব্দটা বদলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkActionsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবিতে শুধু শেষ ফল। ভেতরে আসলে তিনটা ধাপে কাজ হয়: Parent এর Row মোছার জন্য চিহ্নিত হয়, Foreign Key খুঁজে বের করে
              কোন Child Row গুলো তাকে দেখায়, তারপর নিয়ম ঠিক করে তাদের কী হবে। নিচের Lab এ একটা নিয়ম বেছে নিয়ে ধাপগুলো এক এক
              করে চালান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkActionLab />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "Child Row এর কী হয়", "কখন বেছে নেবেন"],
          rows: [
            ["NO ACTION (Default)", "কিছু না, DELETE বাতিল, ERROR 23503", "বেশিরভাগ সম্পর্কে, যেখানে Child এর নিজের মূল্য আছে"],
            ["RESTRICT", "কিছু না, DELETE বাতিল, ERROR 23001", "যখন চান এক মুহূর্তের জন্যও ব্যতিক্রম না হোক"],
            ["CASCADE", "সাথে মুছে যায়", "যখন Child এর Parent ছাড়া কোনো অর্থই নেই, যেমন একটা Hotel এর ছবির তালিকা"],
            ["SET NULL", "থাকে, Referencing Column NULL", "ঐচ্ছিক সম্পর্কে, যেমন Guide চলে গেলে ট্যুর থাকে, Guide ফাঁকা"],
            ["SET DEFAULT", "থাকে, Referencing Column Default মানে", "যখন একটা নির্দিষ্ট জায়গায় সরিয়ে রাখতে চান, যেমন Unassigned"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সিদ্ধান্তটা Data র, Syntax এর না",
          content: (
            <ContentParagraph>
              কোন নিয়ম ঠিক, সেটা কোনো SQL বই বলে দিতে পারে না। প্রশ্ন করুন: Parent না থাকলে এই Child Row এর কি নিজের কোনো
              মূল্য আছে? একটা Booking এর মূল্য আছে, সেখানে টাকা আর ইতিহাস। Customer মুছলে Booking ও মুছে যাওয়া মানে আয়ের হিসাব
              বদলে যাওয়া, তাই সেখানে আটকে দেওয়াই ঠিক। একটা Hotel এর ছবির তালিকার Hotel ছাড়া কোনো অর্থ নেই, সেখানে CASCADE
              মানানসই। সন্দেহ হলে Default রাখুন: আটকে দেওয়া ভুলটা সাথে সাথে চোখে পড়ে, ভুল CASCADE চুপচাপ Data মুছে দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "no-action-restrict",
      subHeader: { index: "006", title: "NO ACTION and RESTRICT" },
      title: <SectionTitle>দুটোই আটকায়, তফাত শুধু কখন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বেশিরভাগ সময় NO ACTION আর RESTRICT এর ফল হুবহু এক: কাউকে দেখানো Parent মোছা যায় না, কিছুই বদলায় না। তফাতটা
                সময়ে। NO ACTION Check করে Statement পুরো শেষ হওয়ার পরে। RESTRICT Check করে Row টা মোছার সাথে সাথে। তাই একটাই
                Statement এর ভেতরে যদি Parent মুছে একই Key দিয়ে আবার লেখা হয়, শেষ মুহূর্তে আর কেউ অনাথ থাকে না: NO ACTION
                সেটা মেনে নেয়, RESTRICT নেয় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের দুটো বক্সে ঠিক এমন একটা Statement। এতে আছে Module 07 এর CTE এর একটা রূপ, যেখানে WITH এর ভেতরে DELETE
                চলে আর মুছে যাওয়া Row গুলো RETURNING দিয়ে ফেরত আসে। এভাবে Data বদলানো CTE এর বিস্তারিত Module 10 এ। এখানে
                শুধু এটুকু জানলেই চলবে: পুরোটা একটাই Statement, তাই NO ACTION এর Check চলে DELETE আর INSERT দুটোই শেষ হওয়ার
                পরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NO ACTION: Statement এর শেষে Check"
              query={`DROP TABLE IF EXISTS fk_na_rooms, fk_na_hotels;
CREATE TABLE fk_na_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_na_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_na_hotels ON DELETE NO ACTION
);
INSERT INTO fk_na_hotels VALUES (1, 'Sea Pearl Resort');
INSERT INTO fk_na_rooms VALUES (101, 1);

-- একটাই Statement: Hotel 1 মোছা, আর একই Key দিয়ে নতুন নামে আবার লেখা
WITH gone AS (
  DELETE FROM fk_na_hotels WHERE hotel_id = 1 RETURNING hotel_id
)
INSERT INTO fk_na_hotels
SELECT hotel_id, 'Sea Pearl Beach Resort' FROM gone;

SELECT * FROM fk_na_hotels;`}
              caption="সফল। শেষ SELECT এ একটা Row: 1, Sea Pearl Beach Resort। Statement শেষ হওয়ার মুহূর্তে Hotel 1 আবার আছে, তাই Room 101 অনাথ না, NO ACTION খুশি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RESTRICT: সাথে সাথে Check"
              query={`DROP TABLE IF EXISTS fk_re_rooms, fk_re_hotels;
CREATE TABLE fk_re_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_re_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_re_hotels ON DELETE RESTRICT
);
INSERT INTO fk_re_hotels VALUES (1, 'Sea Pearl Resort');
INSERT INTO fk_re_rooms VALUES (101, 1);

WITH gone AS (
  DELETE FROM fk_re_hotels WHERE hotel_id = 1 RETURNING hotel_id
)
INSERT INTO fk_re_hotels
SELECT hotel_id, 'Sea Pearl Beach Resort' FROM gone;`}
              caption="ERROR: update or delete on table fk_re_hotels violates RESTRICT setting of foreign key constraint fk_re_rooms_hotel_id_fkey, DETAIL: Key (hotel_id)=(1) is referenced from table fk_re_rooms। SQLSTATE এবার 23001, নাম restrict_violation। একই কাজ, শুধু নিয়মের নাম বদলে ফল উল্টো। চাইলে শেষে SELECT * FROM fk_re_hotels; দিয়ে দেখুন, আগের নামটাই আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>দৈনন্দিন কাজে:</strong> দুটোর ফল একই। কিছু না লিখলে NO ACTION, আর বেশিরভাগ Project এ সেটাই যথেষ্ট।
              </ListItem>
              <ListItem>
                <strong>RESTRICT বেছে নেওয়ার কারণ:</strong> আপনি চান নিয়মটা কোনো অবস্থাতেই এক মুহূর্তের জন্যও না ভাঙুক। আর
                Table এর সংজ্ঞা পড়ে কেউ যেন সাথে সাথে বোঝে, এখানে মোছা নিষেধ।
              </ListItem>
              <ListItem>
                <strong>NO ACTION এর একটা বাড়তি ক্ষমতা:</strong> এর Check Transaction এর শেষ পর্যন্ত পিছিয়ে দেওয়া যায়
                (DEFERRABLE), এই লেসনের শেষের দিকে দেখবেন। RESTRICT এর Check কখনো পেছায় না।
              </ListItem>
              <ListItem>
                <strong>MySQL এ:</strong> InnoDB তে দুটো শব্দের মানে হুবহু এক, দুটোই সাথে সাথে Check করে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "cascade",
      subHeader: { index: "007", title: "CASCADE" },
      title: <SectionTitle>Parent এর সাথে Child ও চলে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CASCADE মানে ঢেউ: Parent এ একটা DELETE, আর সেটা গড়িয়ে নামে তাকে দেখানো সব Child এ। নিচের বক্সে দুটো ট্যুর আর তাদের
              যাত্রার তারিখ। Sundarbans এর ট্যুর বাতিল হলো, আর তার দুটো তারিখও একই সাথে চলে গেল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ট্যুর মুছলে তার তারিখও"
              query={`DROP TABLE IF EXISTS fk_departures, fk_tours;
CREATE TABLE fk_tours (tour_id integer PRIMARY KEY, title text NOT NULL);
CREATE TABLE fk_departures (
  departure_id integer PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES fk_tours (tour_id) ON DELETE CASCADE,
  start_date   date NOT NULL
);
INSERT INTO fk_tours VALUES
  (1, 'Sundarbans Mangrove Cruise'), (2, 'Sajek Valley Cloud Trip');
INSERT INTO fk_departures VALUES
  (11, 1, '2026-11-20'), (12, 1, '2026-12-18'), (21, 2, '2026-11-27');

DELETE FROM fk_tours WHERE tour_id = 1;

SELECT * FROM fk_departures ORDER BY departure_id;`}
              caption="DELETE এর উত্তর DELETE 1, কারণ আপনি মুছেছেন একটা ট্যুর। কিন্তু fk_departures এ এখন একটাই Row: 21, Sajek এর। Departure 11 আর 12 মুছেছে Foreign Key নিজে, আর সেই সংখ্যা DELETE 1 এ গোনা হয় না। CASCADE এর সবচেয়ে বড় বিপদ এটাই: কত Row গেল, সেটা কোথাও লেখা থাকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঢেউ এক ধাপে থামে না। Child নিজেও যদি কারও Parent হয় আর সেখানেও CASCADE থাকে, ঢেউ আরও নিচে নামে। তবে শিকলের
                কোথাও যদি একটা আটকানো নিয়ম থাকে, পুরো ঢেউটাই বাতিল হয়, একটা Row ও মোছে না। নিচের বক্সে Island Tours এর মতো
                চারতলা শিকল: ট্যুর, তারিখ, Booking, টাকা। প্রথম তিনটা CASCADE দিয়ে জোড়া, কিন্তু টাকা থেকে Booking এ RESTRICT,
                কারণ টাকার রেকর্ড কখনো নিজে থেকে মুছে যাওয়া উচিত না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারতলা শিকল, নিচে একটা RESTRICT"
              query={`DROP TABLE IF EXISTS fk_c_payments, fk_c_bookings, fk_c_departures, fk_c_tours;
CREATE TABLE fk_c_tours (tour_id integer PRIMARY KEY);
CREATE TABLE fk_c_departures (
  departure_id integer PRIMARY KEY,
  tour_id      integer NOT NULL REFERENCES fk_c_tours ON DELETE CASCADE
);
CREATE TABLE fk_c_bookings (
  booking_id   integer PRIMARY KEY,
  departure_id integer NOT NULL REFERENCES fk_c_departures ON DELETE CASCADE
);
CREATE TABLE fk_c_payments (
  payment_id integer PRIMARY KEY,
  booking_id integer NOT NULL REFERENCES fk_c_bookings ON DELETE RESTRICT
);
INSERT INTO fk_c_tours VALUES (1), (2);
INSERT INTO fk_c_departures VALUES (11, 1), (12, 1), (21, 2);
INSERT INTO fk_c_bookings VALUES (101, 11), (102, 12), (201, 21);
INSERT INTO fk_c_payments VALUES (1001, 101);   -- শুধু Booking 101 এ টাকা

-- ট্যুর 2 এর নিচে কোনো টাকা নেই: পুরো ঢেউ নামে
DELETE FROM fk_c_tours WHERE tour_id = 2;

SELECT (SELECT count(*) FROM fk_c_tours)      AS tours,
       (SELECT count(*) FROM fk_c_departures) AS departures,
       (SELECT count(*) FROM fk_c_bookings)   AS bookings;

-- ট্যুর 1 এর নিচে টাকা আছে: ঢেউ RESTRICT এ ধাক্কা খায়
DELETE FROM fk_c_tours WHERE tour_id = 1;`}
              caption="প্রথম DELETE সফল: ফলাফল 1, 2, 2, মানে ট্যুর 2, তার তারিখ 21 আর Booking 201 একসাথে গেছে। দ্বিতীয় DELETE এ ERROR: update or delete on table fk_c_bookings violates RESTRICT setting of foreign key constraint fk_c_payments_booking_id_fkey। লক্ষ করুন, Error টা এসেছে Booking এর Table থেকে, দুই ধাপ নিচে, আর ট্যুর 1, তার তারিখ, তার Booking, কিছুই মোছেনি। শেষে SELECT টা আবার চালালে একই 1, 2, 2 দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "CASCADE কোথায় দেবেন না",
          content: (
            <ContentParagraph>
              যে Row এর নিজের ইতিহাস বা টাকার হিসাব আছে, সেখানে CASCADE দিলে একটা ভুল DELETE সব মুছে দেয়, আর DELETE 1 ছাড়া
              কোনো চিহ্ন থাকে না। Booking, Payment, Invoice, Audit Log এর মতো Table এ আটকানো নিয়ম রাখুন। একজন Customer আর না
              থাকলে তাঁর Row মোছার বদলে অনেক Project তাঁকে &quot;নিষ্ক্রিয়&quot; চিহ্ন দেয়, যাকে Soft Delete বলে, Module 10 এর{" "}
              <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                DELETE and Soft Delete
              </Link>{" "}
              লেসনে। CASCADE এর সঠিক জায়গা হলো এমন Child, যার Parent ছাড়া কোনো অর্থই নেই: একটা Hotel এর ছবি, একটা Order এর
              লাইনগুলো, একটা ট্যুরের দিনভিত্তিক ভ্রমণসূচি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              orderMatters
              task={
                <>
                  <code className={CODE}>fk_ex2_departures</code> লিখুন: departure_id integer Primary Key, tour_id integer
                  যেটা খালি থাকবে না আর fk_ex2_tours কে দেখাবে, start_date date যেটা খালি থাকবে না। Column এর ক্রম ঠিক এটাই।
                  ট্যুর মুছলে তার সব তারিখও যেন মুছে যায়। নিচের INSERT, DELETE আর শেষের SELECT যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  REFERENCES এর পরে <code className={CODE}>ON DELETE CASCADE</code>। এটা ছাড়া চালালে DELETE লাইনে 23503 আসবে,
                  সেটাই প্রমাণ যে Default নিয়ম আটকে দেয়।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ex2_departures, fk_ex2_tours;

CREATE TABLE fk_ex2_tours (
  tour_id integer PRIMARY KEY,
  title   text NOT NULL
);

-- এখানে CREATE TABLE fk_ex2_departures লিখুন


-- নিচের লাইনগুলো যেমন আছে তেমন রাখুন
INSERT INTO fk_ex2_tours VALUES
  (1, 'Sundarbans Mangrove Cruise'), (2, 'Sajek Valley Cloud Trip');
INSERT INTO fk_ex2_departures VALUES
  (11, 1, '2026-11-20'), (12, 1, '2026-12-18'), (21, 2, '2026-11-27');
DELETE FROM fk_ex2_tours WHERE tour_id = 1;
SELECT departure_id, tour_id, start_date
FROM fk_ex2_departures
ORDER BY departure_id;`}
              solution={`SELECT * FROM (VALUES (21, 2, DATE '2026-11-27'))
  AS v(departure_id, tour_id, start_date);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "set-null-set-default",
      subHeader: { index: "008", title: "SET NULL and SET DEFAULT" },
      title: <SectionTitle>Child থাকে, শুধু ঠিকানা বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কিছু সম্পর্কে Parent চলে গেলেও Child এর নিজের জীবন থাকে। একজন Guide চাকরি ছেড়ে দিলে তাঁর ট্যুরগুলো বাতিল হয় না,
              শুধু নতুন Guide না পাওয়া পর্যন্ত ঘরটা ফাঁকা থাকে। ঠিক এই কাজ SET NULL এর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide চলে গেলে ট্যুর থাকে, Guide ফাঁকা"
              query={`DROP TABLE IF EXISTS fk_trips, fk_guides;
CREATE TABLE fk_guides (guide_id integer PRIMARY KEY, full_name text NOT NULL);
CREATE TABLE fk_trips (
  trip_id  integer PRIMARY KEY,
  title    text NOT NULL,
  guide_id integer REFERENCES fk_guides (guide_id) ON DELETE SET NULL
);
INSERT INTO fk_guides VALUES (1, 'Jamal Hossain'), (2, 'Shirin Akter');
INSERT INTO fk_trips VALUES
  (101, 'Saint Martin Island Escape', 1),
  (102, 'Sajek Valley Cloud Trip', 1),
  (103, 'Cox''s Bazar Beach Weekend', 2);

DELETE FROM fk_guides WHERE guide_id = 1;

SELECT * FROM fk_trips ORDER BY trip_id;`}
              caption="৩টা ট্যুরই আছে। Jamal Hossain এর দুটো ট্যুর, 101 আর 102, এখন guide_id ফাঁকা। 103 এর Guide Shirin Akter, তাই অক্ষত। পরে নতুন Guide এলে শুধু একটা UPDATE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              SET NULL এর একটা শর্ত আছে: Column এ NULL বসতে পারতে হবে। Column এ NOT NULL থাকলে দুটো নিয়ম মুখোমুখি। PostgreSQL
              Table বানানোর সময় এই বিরোধ ধরে না, ধরে প্রথম যেদিন সত্যিই একটা Parent মোছা হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SET NULL কিন্তু Column এ NOT NULL"
              query={`DROP TABLE IF EXISTS fk_nn_trips, fk_nn_guides;
CREATE TABLE fk_nn_guides (guide_id integer PRIMARY KEY);
CREATE TABLE fk_nn_trips (
  trip_id  integer PRIMARY KEY,
  guide_id integer NOT NULL REFERENCES fk_nn_guides ON DELETE SET NULL
);
INSERT INTO fk_nn_guides VALUES (1);
INSERT INTO fk_nn_trips VALUES (101, 1);

DELETE FROM fk_nn_guides WHERE guide_id = 1;`}
              caption="CREATE TABLE দুটো কোনো আপত্তি ছাড়াই চলেছে। Error এসেছে DELETE এ: null value in column guide_id of relation fk_nn_trips violates not-null constraint, DETAIL: Failing row contains (101, null)। SQLSTATE 23502, Foreign Key এর না, NOT NULL এর। মানে ভুলটা মাসের পর মাস লুকিয়ে থাকতে পারে। MySQL এখানে কড়া, CREATE TABLE এর সময়েই ধরে, In MySQL অংশে দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              SET DEFAULT একই রকম, শুধু NULL এর জায়গায় Column এর Default মান বসে। Room গুলো মুছতে বা ফাঁকা রাখতে না চাইলে
              একটা &quot;Unassigned&quot; Hotel রাখা যায়, Key 0, আর Room এর hotel_id এর Default ও 0। শর্তটা এবার উল্টো দিকে:
              Default মানের Row টা Parent এ থাকতেই হবে, কারণ নতুন মানটাও Foreign Key এর Check পার হতে হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Hotel বন্ধ হলে Room যায় Unassigned এ"
              query={`DROP TABLE IF EXISTS fk_sd_rooms, fk_sd_hotels;
CREATE TABLE fk_sd_hotels (hotel_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_sd_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL DEFAULT 0
           REFERENCES fk_sd_hotels ON DELETE SET DEFAULT
);
INSERT INTO fk_sd_hotels VALUES
  (0, 'Unassigned'), (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge');
INSERT INTO fk_sd_rooms VALUES (101, 1), (102, 1), (201, 2);

DELETE FROM fk_sd_hotels WHERE hotel_id = 1;

SELECT r.room_id, r.hotel_id, h.name AS hotel
FROM fk_sd_rooms r
JOIN fk_sd_hotels h ON h.hotel_id = r.hotel_id
ORDER BY r.room_id;`}
              caption="Room 101 আর 102 এখন Hotel 0, Unassigned এর ঘরে, Room 201 আগের মতো Hill View Lodge এ। এখানে NOT NULL থাকলেও সমস্যা নেই, কারণ বসছে 0, NULL না। কিন্তু এবার Unassigned কে মুছতে গেলে কী হবে? Room গুলোকে আবার 0 তে পাঠাতে হবে, আর 0 তো আর থাকবে না, তাই ERROR 23503।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SET DEFAULT কিন্তু Default এর Parent নেই"
              query={`DROP TABLE IF EXISTS fk_nd_rooms, fk_nd_hotels;
CREATE TABLE fk_nd_hotels (hotel_id integer PRIMARY KEY);
CREATE TABLE fk_nd_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL DEFAULT 0
           REFERENCES fk_nd_hotels ON DELETE SET DEFAULT
);
INSERT INTO fk_nd_hotels VALUES (1);   -- Hotel 0 নেই
INSERT INTO fk_nd_rooms VALUES (101, 1);

DELETE FROM fk_nd_hotels WHERE hotel_id = 1;`}
              caption="ERROR: insert or update on table fk_nd_rooms violates foreign key constraint fk_nd_rooms_hotel_id_fkey, DETAIL: Key (hotel_id)=(0) is not present in table fk_nd_hotels। মজার ব্যাপার: আপনি DELETE চালিয়েছেন, অথচ বার্তা বলছে insert or update। কারণ SET DEFAULT ভেতরে ভেতরে Room টাকে UPDATE করে 0 বসাতে চেয়েছিল, আর সেই UPDATE ধরা পড়েছে Child এর দিকের Check এ। পুরো DELETE বাতিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>দুই বা বেশি Column এর Foreign Key তে শুধু একটা Column ফাঁকা করা।</strong> PostgreSQL 15 থেকে SET NULL
                আর SET DEFAULT এর পরে বন্ধনীতে Column এর তালিকা দেওয়া যায়, তখন শুধু সেই Column গুলো বদলায়। ধরুন একটা Bus
                Company র Bus নম্বর দিয়ে Ticket। Bus টা বাতিল হলে Ticket এর Company থাকবে, শুধু Bus নম্বর ফাঁকা হবে। দুই Column
                এর Foreign Key কীভাবে লেখে, সেটা পরের পরের অংশে বিস্তারিত, এখানে শুধু এই একটা সুবিধা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SET NULL (bus_no): শুধু একটা Column ফাঁকা"
              query={`DROP TABLE IF EXISTS fk_tickets, fk_buses;
CREATE TABLE fk_buses (
  company_id integer,
  bus_no     text,
  PRIMARY KEY (company_id, bus_no)
);
CREATE TABLE fk_tickets (
  ticket_id  integer PRIMARY KEY,
  company_id integer NOT NULL,
  bus_no     text,
  FOREIGN KEY (company_id, bus_no) REFERENCES fk_buses
    ON DELETE SET NULL (bus_no)
);
INSERT INTO fk_buses VALUES (1, 'BUS-1'), (1, 'BUS-2');
INSERT INTO fk_tickets VALUES (100, 1, 'BUS-1'), (101, 1, 'BUS-2');

DELETE FROM fk_buses WHERE bus_no = 'BUS-1';

SELECT * FROM fk_tickets ORDER BY ticket_id;`}
              caption="Ticket 100 এর company_id এখনো 1, শুধু bus_no ফাঁকা। company_id তে NOT NULL থাকায় পুরো SET NULL হলে এখানে Error আসত। Column এর তালিকা দিয়ে আপনি ঠিক যেটুকু দরকার সেটুকুই বদলালেন।"
            />
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
                  <code className={CODE}>fk_ex3_trips</code> লিখুন: trip_id integer Primary Key, title text যেটা খালি থাকবে
                  না, guide_id integer যেটা fk_ex3_guides কে দেখাবে। Guide মুছলে ট্যুর যেন থেকে যায়, শুধু guide_id ফাঁকা
                  হয়। নিচের লাইনগুলো যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>ON DELETE SET NULL</code>, আর guide_id তে NOT NULL দেবেন না। দিলে DELETE লাইনে 23502
                  আসবে।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ex3_trips, fk_ex3_guides;

CREATE TABLE fk_ex3_guides (
  guide_id  integer PRIMARY KEY,
  full_name text NOT NULL
);

-- এখানে CREATE TABLE fk_ex3_trips লিখুন


-- নিচের লাইনগুলো যেমন আছে তেমন রাখুন
INSERT INTO fk_ex3_guides VALUES (1, 'Jamal Hossain'), (2, 'Shirin Akter');
INSERT INTO fk_ex3_trips VALUES
  (101, 'Saint Martin Island Escape', 1),
  (102, 'Sajek Valley Cloud Trip', 1),
  (103, 'Cox''s Bazar Beach Weekend', 2);
DELETE FROM fk_ex3_guides WHERE guide_id = 1;
SELECT trip_id, guide_id FROM fk_ex3_trips ORDER BY trip_id;`}
              solution={`SELECT * FROM (VALUES (101, NULL::integer), (102, NULL), (103, 2))
  AS v(trip_id, guide_id);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "on-update",
      subHeader: { index: "009", title: "ON UPDATE" },
      title: <SectionTitle>Parent এর Key বদলালে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ON DELETE এর মতোই আছে ON UPDATE, একই পাঁচটা নিয়ম নিয়ে। এটা খাটে যখন Parent এর Referenced Column এর মান
                বদলায়, মানে Key নিজেই বদলায়। নাম বা অন্য Column বদলালে Foreign Key এর কিছুই যায় আসে না, What Gets Checked অংশের Lab
                এ সেটা দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                আসল প্রশ্ন হলো, Key বদলায় কখন? Island Tours এর মতো যেখানে Key একটা Identity নম্বর, সেখানে প্রায় কখনোই না।
                বরং{" "}
                <Link href="/sql/topic/primary-keys" className={LINK}>
                  আগের লেসনের
                </Link>{" "}
                GENERATED ALWAYS Identity তে PostgreSQL নিজেই Key বদলাতে দেয় না। চেষ্টা করে দেখুন, Imran Kabir এর কোনো Booking
                নেই, তবু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Identity Key বদলানো যায় না"
              query={`UPDATE customers SET customer_id = 100 WHERE customer_id = 15;`}
              caption="ERROR: column customer_id can only be updated to DEFAULT, DETAIL: Column customer_id is an identity column defined as GENERATED ALWAYS। Foreign Key পর্যন্ত যাওয়াই হয়নি, Identity আগেই থামিয়েছে। Key কখনো বদলায় না, এটাই Surrogate Key এর একটা বড় সুবিধা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কিন্তু Key যদি এমন কিছু হয় যার বাস্তব অর্থ আছে, যেমন Hotel এর তিন অক্ষরের Code, তাহলে বদলাতেই পারে। Sea Pearl
              Resort নাম বদলে Sea Pearl Cove হলো, Code SPR থেকে SPC। তখন ON UPDATE CASCADE সব Room এ নতুন Code পৌঁছে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Hotel Code বদলালে Room ও বদলায়"
              query={`DROP TABLE IF EXISTS fk_uc_rooms, fk_uc_hotels;
CREATE TABLE fk_uc_hotels (code text PRIMARY KEY, name text NOT NULL);
CREATE TABLE fk_uc_rooms (
  room_id    integer PRIMARY KEY,
  hotel_code text NOT NULL REFERENCES fk_uc_hotels ON UPDATE CASCADE
);
INSERT INTO fk_uc_hotels VALUES ('SPR', 'Sea Pearl Resort'), ('HVL', 'Hill View Lodge');
INSERT INTO fk_uc_rooms VALUES (101, 'SPR'), (102, 'SPR'), (201, 'HVL');

UPDATE fk_uc_hotels SET code = 'SPC' WHERE code = 'SPR';

SELECT * FROM fk_uc_rooms ORDER BY room_id;

-- ON DELETE কিছু লেখা হয়নি, তাই মোছায় এখনো Default নিয়ম
DELETE FROM fk_uc_hotels WHERE code = 'SPC';`}
              caption="UPDATE এর পরে Room 101 আর 102 এর hotel_code নিজে থেকেই SPC। শেষ লাইনে ERROR 23503, কারণ ON UPDATE আর ON DELETE আলাদা দুটো সিদ্ধান্ত: একটা লিখলে অন্যটা Default থেকে যায়। দুটোই চাইলে পাশাপাশি লিখুন, ON DELETE CASCADE ON UPDATE CASCADE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Natural Key (বাস্তব অর্থওয়ালা Key) বনাম Surrogate Key (অর্থহীন নম্বর) এর পুরো বিতর্ক Module 11 এ। এখানে মনে রাখুন:
              Key বদলাতে পারলে ON UPDATE CASCADE আপনাকে হাজারটা Row হাতে বদলানো থেকে বাঁচায়। Key কখনো না বদলালে ON UPDATE
              নিয়ে ভাবারই দরকার নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  <code className={CODE}>fk_ex4_rooms</code> লিখুন: room_id integer Primary Key, hotel_code text যেটা খালি
                  থাকবে না আর fk_ex4_hotels এর code কে দেখাবে। Foreign Key টার নাম হবে ঠিক{" "}
                  <code className={CODE}>fk_ex4_rooms_hotel_fk</code>, আর Hotel এর Code বদলালে Room এর Code ও যেন বদলায়।
                  নিচের লাইনগুলো যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  নাম দিতে হলে আলাদা লাইন: <code className={CODE}>CONSTRAINT fk_ex4_rooms_hotel_fk FOREIGN KEY (hotel_code)
                  REFERENCES fk_ex4_hotels (code) ON UPDATE CASCADE</code>।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ex4_rooms, fk_ex4_hotels;

CREATE TABLE fk_ex4_hotels (
  code text PRIMARY KEY,
  name text NOT NULL
);

-- এখানে CREATE TABLE fk_ex4_rooms লিখুন


-- নিচের লাইনগুলো যেমন আছে তেমন রাখুন
INSERT INTO fk_ex4_hotels VALUES ('SPR', 'Sea Pearl Resort'), ('HVL', 'Hill View Lodge');
INSERT INTO fk_ex4_rooms VALUES (101, 'SPR'), (102, 'SPR'), (201, 'HVL');
UPDATE fk_ex4_hotels SET code = 'SPC' WHERE code = 'SPR';
SELECT r.room_id, r.hotel_code, k.conname
FROM fk_ex4_rooms r
CROSS JOIN (SELECT conname FROM pg_constraint
            WHERE conrelid = 'fk_ex4_rooms'::regclass AND contype = 'f') k
ORDER BY r.room_id;`}
              solution={`SELECT * FROM (VALUES
  (101, 'SPC', 'fk_ex4_rooms_hotel_fk'),
  (102, 'SPC', 'fk_ex4_rooms_hotel_fk'),
  (201, 'HVL', 'fk_ex4_rooms_hotel_fk')
) AS v(room_id, hotel_code, conname);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "composite-self",
      subHeader: { index: "010", title: "Composite and Self-referencing Keys" },
      title: <SectionTitle>দুই Column এর Key, আর নিজেকেই দেখানো Table</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Composite Foreign Key।</strong> Parent এর Key যদি দুই Column মিলে হয়, Child কেও দুই Column দিয়েই
                দেখাতে হয়। একটা Bus এর Seat এর তালিকা ভাবুন: Seat A1 আছে BUS-1 এ, BUS-2 তেও, তাই শুধু Seat নম্বর দিয়ে চেনা যায়
                না, Bus আর Seat মিলিয়ে চিনতে হয়। Ticket তখন দুটো Column দিয়ে দেখায়, আর লিখতে হয় আলাদা লাইনের রূপে:{" "}
                <code className={CODE}>FOREIGN KEY (bus_no, seat_no) REFERENCES fk_seat_map (bus_no, seat_no)</code>।
              </ContentParagraph>
              <ContentParagraph>
                এখানে NULL এর নিয়মে একটা সূক্ষ্মতা আছে। Default নিয়মের নাম MATCH SIMPLE: দুই Column এর যেকোনো একটা NULL হলেই
                পুরো Check বাদ, অন্যটায় যা খুশি থাকুক। কড়া নিয়ম চাইলে MATCH FULL: হয় সব Column NULL, নয়তো কোনোটাই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Bus আর Seat মিলিয়ে চেনা"
              query={`DROP TABLE IF EXISTS fk_seats, fk_seat_map;
CREATE TABLE fk_seat_map (
  bus_no  text,
  seat_no text,
  PRIMARY KEY (bus_no, seat_no)
);
CREATE TABLE fk_seats (
  ticket_id integer PRIMARY KEY,
  bus_no    text,
  seat_no   text,
  FOREIGN KEY (bus_no, seat_no) REFERENCES fk_seat_map (bus_no, seat_no)
);
INSERT INTO fk_seat_map VALUES ('BUS-1', 'A1'), ('BUS-1', 'A2'), ('BUS-2', 'A1');

INSERT INTO fk_seats VALUES (1, 'BUS-1', 'A1');  -- জোড়াটা আছে
INSERT INTO fk_seats VALUES (3, 'BUS-9', NULL);  -- MATCH SIMPLE: একটা NULL, তাই Check নেই

SELECT * FROM fk_seats ORDER BY ticket_id;

INSERT INTO fk_seats VALUES (2, 'BUS-2', 'A2');  -- দুটোই আছে, কিন্তু জোড়া হিসেবে নেই`}
              caption="প্রথম দুটো INSERT সফল। লক্ষ করুন Ticket 3: BUS-9 বলে কোনো Bus ই নেই, তবু ঢুকে গেছে, কারণ seat_no NULL। শেষ লাইনে ERROR, DETAIL: Key (bus_no, seat_no)=(BUS-2, A2) is not present in table fk_seat_map। BUS-2 আছে, A2 ও আছে, কিন্তু BUS-2 তে A2 নেই। Check হয় জোড়া ধরে, আলাদা আলাদা না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MATCH FULL: আধা ফাঁকা চলবে না"
              query={`DROP TABLE IF EXISTS fk_seats_full, fk_seat_map_full;
CREATE TABLE fk_seat_map_full (bus_no text, seat_no text, PRIMARY KEY (bus_no, seat_no));
CREATE TABLE fk_seats_full (
  ticket_id integer PRIMARY KEY,
  bus_no    text,
  seat_no   text,
  FOREIGN KEY (bus_no, seat_no)
    REFERENCES fk_seat_map_full (bus_no, seat_no) MATCH FULL
);
INSERT INTO fk_seats_full VALUES (4, NULL, NULL);    -- সব NULL: চলে
INSERT INTO fk_seats_full VALUES (3, 'BUS-9', NULL); -- আধা NULL: চলে না`}
              caption="প্রথম INSERT সফল, দ্বিতীয়টায় ERROR, DETAIL: MATCH FULL does not allow mixing of null and nonnull key values। Composite Foreign Key তে আধা ফাঁকা Row এর কোনো অর্থ না থাকলে MATCH FULL দিন, অথবা দুটো Column এই NOT NULL দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Self-referencing Foreign Key।</strong> Parent আর Child একই Table হতে পারে। Island Tours এর কর্মীদের
                তালিকায় প্রতিটা কর্মীর একজন Manager আছেন, আর Manager নিজেও একজন কর্মী। তাই manager_id দেখায় একই Table এর
                staff_id কে। শীর্ষে যিনি আছেন, তাঁর Manager নেই, তাই manager_id তে NULL চলতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কর্মী আর তাঁর Manager, একই Table এ"
              query={`DROP TABLE IF EXISTS fk_staff;
CREATE TABLE fk_staff (
  staff_id   integer PRIMARY KEY,
  full_name  text NOT NULL,
  manager_id integer REFERENCES fk_staff (staff_id)
);
INSERT INTO fk_staff VALUES
  (1, 'Farhana Islam', NULL),
  (2, 'Rafiq Ahmed', 1),
  (3, 'Nusrat Jahan', 1);

SELECT s.full_name, m.full_name AS manager
FROM fk_staff s
LEFT JOIN fk_staff m ON m.staff_id = s.manager_id
ORDER BY s.staff_id;

-- যাঁর অধীনে লোক আছে, তাঁকে মোছা
DELETE FROM fk_staff WHERE staff_id = 1;`}
              caption="SELECT এ ৩টা Row, Farhana Islam এর Manager ফাঁকা, বাকি দুজনের Farhana। এটা Module 06 এর Self Join। শেষ লাইনে ERROR 23503: Farhana কে মোছা যায় না, কারণ দুজন কর্মী এখনো তাঁকে দেখায়। একই Table এর ভেতরেও Foreign Key একইভাবে পাহারা দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Self-referencing Table এ INSERT এর ক্রম গুরুত্বপূর্ণ: Manager এর Row আগে, তাঁর অধীনের কর্মী পরে। একটা Multi-row
              INSERT এর ভেতরে Manager আগে থাকলেই চলে, যেমন উপরে। আর এমন Table থেকে পুরো শিকল, Manager এর Manager এর Manager,
              বের করার উপায় Module 07 এর{" "}
              <Link href="/sql/topic/recursive-ctes" className={LINK}>
                Recursive CTEs
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "deferrable",
      subHeader: { index: "011", title: "DEFERRABLE" },
      title: <SectionTitle>Check টা Transaction এর শেষ পর্যন্ত পিছিয়ে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ প্রতিটা Check হয়েছে প্রতিটা Statement এর শেষে, এর নাম IMMEDIATE। কখনো কখনো এতে সমস্যা হয়: একসাথে
                কয়েকটা Row লিখতে হবে, আর সব লেখা শেষ হলে তবেই সব মিলবে, মাঝপথে না। যেমন একটা Order আর তার Item যদি দুটো আলাদা
                Program থেকে আসে, আর Item আগে পৌঁছায়। অথবা দুটো Table একে অপরকে দেখায়, তখন কাকে আগে লিখবেন?
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য Foreign Key কে DEFERRABLE বলা যায়। <code className={CODE}>DEFERRABLE INITIALLY DEFERRED</code> লিখলে
                Check হয় Transaction এর একদম শেষে, COMMIT এর মুহূর্তে। মাঝখানে অনাথ থাকতে পারে, শুধু COMMIT এর সময় কেউ
                অনাথ থাকা চলবে না। Transaction মানে BEGIN থেকে COMMIT পর্যন্ত কয়েকটা Statement কে একটা কাজ হিসেবে চালানো, এর
                পুরো গল্প Module 12 এর{" "}
                <Link href="/sql/topic/transactions-concurrency-overview" className={LINK}>
                  Transactions
                </Link>{" "}
                অংশে। এখানে শুধু DEFERRABLE বোঝার মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Item আগে, Order পরে, COMMIT এ সব মেলে"
              query={`DROP TABLE IF EXISTS fk_items, fk_orders;
CREATE TABLE fk_orders (order_id integer PRIMARY KEY, note text);
CREATE TABLE fk_items (
  item_id  integer PRIMARY KEY,
  order_id integer NOT NULL
           REFERENCES fk_orders DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
INSERT INTO fk_items VALUES (1, 500);   -- Order 500 এখনো নেই, তবু চলে
INSERT INTO fk_orders VALUES (500, 'parent came second');
COMMIT;                                 -- এখানে Check: সব মেলে

SELECT * FROM fk_items;`}
              caption="প্রতিটা Statement সফল, শেষে একটা Row: 1, 500। প্রথম INSERT এর মুহূর্তে Item টা অনাথ ছিল, কিন্তু Check হয়েছে COMMIT এ, আর তখন Order 500 এসে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর COMMIT এর সময়েও যদি কেউ অনাথ থাকে? তখন Error আসে COMMIT এ, আর পুরো Transaction বাতিল হয়, ভেতরের সব
              Statement সহ। নিচের বক্সে সেটাই। COMMIT ব্যর্থ হলে Transaction নিজেই শেষ হয়ে যায়, তাই এই পাতার বাকি বক্সগুলো
              স্বাভাবিকভাবে চলবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="COMMIT এর সময়েও অনাথ"
              query={`DROP TABLE IF EXISTS fk_items, fk_orders;
CREATE TABLE fk_orders (order_id integer PRIMARY KEY, note text);
CREATE TABLE fk_items (
  item_id  integer PRIMARY KEY,
  order_id integer NOT NULL
           REFERENCES fk_orders DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
INSERT INTO fk_items VALUES (2, 777);   -- Order 777 কখনো আসবে না
COMMIT;`}
              caption="INSERT এর উত্তর INSERT 1, কোনো আপত্তি নেই। ERROR এসেছে COMMIT এ: insert or update on table fk_items violates foreign key constraint fk_items_order_id_fkey, DETAIL: Key (order_id)=(777) is not present in table fk_orders। Transaction বাতিল, তাই এখন SELECT count(*) FROM fk_items; চালালে 0 আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>তিনটা অবস্থা:</strong> NOT DEFERRABLE (Default, কখনো পেছানো যায় না), DEFERRABLE INITIALLY IMMEDIATE
                  (সাধারণত সাথে সাথে, চাইলে পেছানো যায়), আর DEFERRABLE INITIALLY DEFERRED (সাধারণত COMMIT এ)।
                </ListItem>
                <ListItem>
                  <strong>এক Transaction এর জন্য পেছানো:</strong> INITIALLY IMMEDIATE Constraint কেও একটা Transaction এর ভেতরে{" "}
                  <code className={CODE}>SET CONSTRAINTS ALL DEFERRED;</code> লিখে সেই Transaction এর জন্য পিছিয়ে দেওয়া যায়।
                  NOT DEFERRABLE Constraint এর উপর এর কোনো প্রভাব নেই।
                </ListItem>
                <ListItem>
                  <strong>RESTRICT কখনো পেছায় না:</strong> PostgreSQL 18 এ ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED
                  লিখে Table বানানো যায়, কিন্তু কাউকে দেখানো Parent মোছার চেষ্টায় Error সাথে সাথেই আসে, 23001, COMMIT এর
                  অপেক্ষা ছাড়া। পেছানো শুধু NO ACTION এর বেলায় কাজ করে, আগের অংশে সেটাই বলা হয়েছিল।
                </ListItem>
                <ListItem>
                  <strong>কখন দরকার:</strong> কম। বেশিরভাগ Project এ সঠিক ক্রমে INSERT করলেই চলে, আগে Parent, তারপর Child।
                  DEFERRABLE লাগে দুই দিক থেকে দেখানো Table এ, অনেক Row একসাথে অদলবদলে, অথবা এমন Import এ যেখানে ক্রম আপনার
                  হাতে নেই।
                </ListItem>
                <ListItem>
                  <strong>MySQL এ:</strong> InnoDB তে DEFERRABLE নেই। লিখলে ERROR 1064, Syntax Error।
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
              task={
                <>
                  <code className={CODE}>fk_ex5_items</code> লিখুন: item_id integer Primary Key, order_id integer যেটা খালি
                  থাকবে না আর fk_ex5_orders কে দেখাবে। Foreign Key এর Check যেন Default অবস্থায় COMMIT পর্যন্ত পিছিয়ে থাকে।
                  শেষের Check Query টা শেষেই রাখুন।
                </>
              }
              hint={
                <>
                  REFERENCES এর পরে দুটো অংশই লাগবে: <code className={CODE}>DEFERRABLE INITIALLY DEFERRED</code>। শুধু
                  DEFERRABLE লিখলে condeferred হবে f।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ex5_items, fk_ex5_orders;

CREATE TABLE fk_ex5_orders (
  order_id integer PRIMARY KEY,
  note     text
);

-- এখানে CREATE TABLE fk_ex5_items লিখুন


-- এই Check Query টা শেষেই থাকবে
SELECT condeferrable, condeferred
FROM pg_constraint
WHERE conrelid = 'fk_ex5_items'::regclass AND contype = 'f';`}
              solution={`SELECT * FROM (VALUES (true, true)) AS v(condeferrable, condeferred);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "indexing-the-referencing-column",
      subHeader: { index: "012", title: "Indexing the Referencing Column" },
      title: <SectionTitle>PostgreSQL যে Index টা নিজে দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Foreign Key এর Check দুই দিকে দুই রকম খরচের। Child এ INSERT হলে PostgreSQL Parent এ Key খোঁজে, আর Parent এর
                Key তো Primary Key বা UNIQUE, তাদের Index সবসময় আছে, খোঁজাটা দ্রুত। কিন্তু Parent থেকে একটা Row মুছলে উল্টো
                প্রশ্ন: Child এ কারা এই Key দেখায়? সেই খোঁজ চলে Child এর Referencing Column এ, আর সেখানে Index আছে কিনা, সেটা
                আপনার উপর।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL Foreign Key বানালে Referencing Column এ নিজে থেকে Index দেয় না। PostgreSQL এর Documentation এর
                যুক্তি: সব ক্ষেত্রে দরকার হয় না, আর Index বানানোর অনেক রকম উপায় আছে, তাই সিদ্ধান্তটা আপনার। Island Tours এর ৭টা
                Foreign Key তে কী অবস্থা, Catalog থেকে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন Foreign Key Column এ Index আছে"
              query={`SELECT c.conrelid::regclass AS child_table,
       a.attname            AS fk_column,
       EXISTS (SELECT 1 FROM pg_index i
               WHERE i.indrelid = c.conrelid
                 AND i.indkey[0] = c.conkey[1]) AS has_index
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
  AND c.conrelid::regclass::text NOT LIKE 'fk%'   -- এই পাতায় বানানো fk_ Table বাদ
ORDER BY c.conrelid::regclass::text, a.attname;`}
              caption="৭টা Row, ৬টায় has_index f। একমাত্র reviews.booking_id তে t, আর সেটাও Foreign Key এর জন্য না: ওই Column এ UNIQUE আছে, আর UNIQUE নিজের জন্য একটা Index বানায়। বাকি ছয়টা Column এ কোনো Parent মুছলে PostgreSQL কে পুরো Child Table পড়তে হয়। Query টা প্রতিটা Index এর প্রথম Column এর সাথে Foreign Key এর প্রথম Column মেলায়, এক Column এর Foreign Key এর জন্য এটুকুই যথেষ্ট।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Table গুলো ছোট, ২৪টা Booking পড়তে কোনো সময়ই লাগে না। খরচটা চোখে পড়ে বড় Table এ। নিচের বক্সে ৫০০টা
              Hotel আর ১ লাখ Room, ON DELETE CASCADE। প্রথমে Index ছাড়া ২০টা Hotel মোছা, তারপর hotel_id তে Index দিয়ে আরও ২০টা।
              EXPLAIN ANALYZE আসল কাজটা চালায় আর জানায় কোন অংশে কত সময় গেল। এর পুরো পাঠ Module 13 এ, এখানে শুধু একটা লাইন
              দেখুন: <code className={CODE}>Trigger for constraint fk_big_rooms_hotel_id_fkey</code>, Foreign Key এর কাজে কত সময়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="১ লাখ Room: Index ছাড়া আর Index সহ"
              query={`DROP TABLE IF EXISTS fk_big_rooms, fk_big_hotels;
CREATE TABLE fk_big_hotels (hotel_id integer PRIMARY KEY);
CREATE TABLE fk_big_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES fk_big_hotels ON DELETE CASCADE
);
INSERT INTO fk_big_hotels SELECT g FROM generate_series(1, 500) AS g;
INSERT INTO fk_big_rooms SELECT g, 1 + g % 500 FROM generate_series(1, 100000) AS g;
ANALYZE fk_big_rooms;

-- Index ছাড়া: ২০টা Hotel মোছা
EXPLAIN (ANALYZE, COSTS OFF, BUFFERS OFF)
DELETE FROM fk_big_hotels WHERE hotel_id BETWEEN 1 AND 20;

CREATE INDEX fk_big_rooms_hotel_id_idx ON fk_big_rooms (hotel_id);

-- Index সহ: পরের ২০টা
EXPLAIN (ANALYZE, COSTS OFF, BUFFERS OFF)
DELETE FROM fk_big_hotels WHERE hotel_id BETWEEN 21 AND 40;`}
              caption="দুটো Plan এর শেষের দিকে Trigger for constraint লাইনটা মেলান, দুটোতেই calls=20, প্রতিটা মোছা Hotel এর জন্য একবার। এই লেসন লেখার সময়ের একটা Run এ Index ছাড়া time=91.155, Index সহ time=3.652 (millisecond)। আপনার মেশিনে সংখ্যা আলাদা হবে, কিন্তু পার্থক্যটা কয়েক গুণের। Row যত বাড়বে, পার্থক্যও তত বাড়বে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FkIndexSplit />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিয়মটা এক লাইনে",
          content: (
            <ContentParagraph>
              যে Parent থেকে কখনো কখনো Row মোছা হয় বা Key বদলায়, আর Child Table বড়, সেই Foreign Key Column এ Index দিন:{" "}
              <code className={CODE}>CREATE INDEX ON bookings (customer_id);</code>। আরেকটা লাভ ফাউ: Parent আর Child এর JOIN
              প্রায় সবসময় এই Column দিয়েই হয়, তাই সেই Query গুলোও এই Index পেতে পারে। Index এর নিজেরও খরচ আছে, প্রতিটা
              INSERT এ সেটাও বদলাতে হয়। কখন দেবেন আর কখন না, সেই হিসাব Module 13 এর{" "}
              <Link href="/sql/topic/indexes-performance-overview" className={LINK}>
                Indexes &amp; Performance
              </Link>{" "}
              অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Foreign Key, আর তার বড় ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Foreign Key এর ধারণা একই, Error এর ভাষা আলাদা, আর কয়েকটা আচরণ এতটাই আলাদা যে না জানলে Data নষ্ট
                হবে। এই ট্র্যাকের MySQL 8.4 এ নিচের প্রতিটা লাইন চালিয়ে দেখা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>InnoDB লাগবে:</strong> Foreign Key মানে শুধু InnoDB (আর NDB Cluster)। MySQL 8.4 এ Default Storage
                  Engine InnoDB, তাই সাধারণত সমস্যা নেই। কিন্তু কোনো Table ENGINE=MyISAM হলে MySQL FOREIGN KEY লাইনটা পড়ে,
                  তারপর চুপচাপ ফেলে দেয়, কোনো Error ছাড়া।
                </ListItem>
                <ListItem>
                  <strong>Column এর পাশে REFERENCES কিছুই করে না:</strong> MySQL এর Manual এর ভাষায় এটা parsed but ignored,
                  পড়া হয় কিন্তু উপেক্ষা করা হয়। কাজ করে শুধু আলাদা লাইনের FOREIGN KEY (column) REFERENCES। এই লেসনের প্রথম
                  বক্সের মতো লেখা MySQL এ চালালে Table তৈরি হবে, পাহারা থাকবে না।
                </ListItem>
                <ListItem>
                  <strong>Index নিজে থেকে:</strong> PostgreSQL এর উল্টো, MySQL Referencing Column এ Index না থাকলে নিজেই
                  বানিয়ে নেয়।
                </ListItem>
                <ListItem>
                  <strong>NO ACTION আর RESTRICT এক:</strong> InnoDB তে দুটোই সাথে সাথে Check করে। DEFERRABLE নেই।
                </ListItem>
                <ListItem>
                  <strong>SET NULL আর NOT NULL এর বিরোধ CREATE এর সময়েই ধরা পড়ে:</strong> ERROR 1830। PostgreSQL এ ধরা পড়ত
                  প্রথম DELETE এ।
                </ListItem>
                <ListItem>
                  <strong>SET DEFAULT কাজ করে না:</strong> MySQL 8.4 এর Manual বলে InnoDB এমন Table এর সংজ্ঞাই প্রত্যাখ্যান করে।
                  এই ট্র্যাকের 8.4.11 এ আসলে দেখা গেল CREATE TABLE কোনো আপত্তি ছাড়াই চলে, কিন্তু Parent মোছার চেষ্টায় ERROR
                  1451 আসে, মানে আচরণ NO ACTION এর মতো। দুই ক্ষেত্রেই ফল একটা: MySQL এ SET DEFAULT এর উপর ভরসা করবেন না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-inline-vs-foreign-key.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
CREATE TABLE fk_hotels (hotel_id INT PRIMARY KEY, name VARCHAR(100) NOT NULL);
INSERT INTO fk_hotels VALUES (1, 'Sea Pearl Resort');

-- ১. Column এর পাশে REFERENCES: পড়া হয়, মানা হয় না
CREATE TABLE fk_rooms (
  room_id  INT PRIMARY KEY,
  hotel_id INT NOT NULL REFERENCES fk_hotels (hotel_id),
  label    VARCHAR(100) NOT NULL
);
INSERT INTO fk_rooms VALUES (301, 99, 'Ghost room');   -- কোনো Error নেই
SELECT * FROM fk_rooms;
-- 301 | 99 | Ghost room        <- অনাথ Row ঢুকে গেছে

SHOW CREATE TABLE fk_rooms\\G
-- CREATE TABLE \`fk_rooms\` (
--   \`room_id\` int NOT NULL,
--   \`hotel_id\` int NOT NULL,
--   \`label\` varchar(100) NOT NULL,
--   PRIMARY KEY (\`room_id\`)
-- ) ENGINE=InnoDB ...         <- কোনো FOREIGN KEY ই নেই

-- ২. আলাদা লাইনে FOREIGN KEY: এবার আসল পাহারা
DROP TABLE fk_rooms;
CREATE TABLE fk_rooms (
  room_id  INT PRIMARY KEY,
  hotel_id INT NOT NULL,
  label    VARCHAR(100) NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES fk_hotels (hotel_id)
);
SHOW CREATE TABLE fk_rooms\\G
--   PRIMARY KEY (\`room_id\`),
--   KEY \`hotel_id\` (\`hotel_id\`),     <- Index নিজে থেকেই তৈরি
--   CONSTRAINT \`fk_rooms_ibfk_1\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`fk_hotels\` (\`hotel_id\`)

INSERT INTO fk_rooms VALUES (101, 1, 'Sea view double');
INSERT INTO fk_rooms VALUES (301, 99, 'Ghost room');
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
--   (\`island_tours\`.\`fk_rooms\`, CONSTRAINT \`fk_rooms_ibfk_1\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`fk_hotels\` (\`hotel_id\`))

DELETE FROM fk_hotels WHERE hotel_id = 1;
-- ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
--   (\`island_tours\`.\`fk_rooms\`, CONSTRAINT \`fk_rooms_ibfk_1\` ...)`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-differences.sql",
          code: `-- SET NULL কিন্তু Column NOT NULL: CREATE এর সময়েই Error
CREATE TABLE fk_trips2 (
  trip_id INT PRIMARY KEY,
  tour_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES fk_tours (tour_id) ON DELETE SET NULL
);
-- ERROR 1830 (HY000): Column 'tour_id' cannot be NOT NULL: needed in a foreign key constraint 'fk_trips2_ibfk_1' SET NULL

-- SET DEFAULT: CREATE চলে, কাজ করে না
CREATE TABLE fk_rooms_sd (
  room_id  INT PRIMARY KEY,
  hotel_id INT NOT NULL DEFAULT 0,
  FOREIGN KEY (hotel_id) REFERENCES fk_hotels (hotel_id) ON DELETE SET DEFAULT
);
-- (Hotel 0, 1, 2 আর Room 101, 102 Hotel 1 এ)
DELETE FROM fk_hotels WHERE hotel_id = 1;
-- ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (... \`fk_rooms_sd_ibfk_1\` ...)

-- DEFERRABLE নেই
CREATE TABLE fk_rooms_df (room_id INT PRIMARY KEY, hotel_id INT,
  FOREIGN KEY (hotel_id) REFERENCES fk_hotels (hotel_id) DEFERRABLE INITIALLY DEFERRED);
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'DEFERRABLE INITIALLY DEFERRED)'

-- MyISAM: FOREIGN KEY চুপচাপ বাদ
CREATE TABLE fk_rooms_my (room_id INT PRIMARY KEY, hotel_id INT NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES fk_hotels (hotel_id)) ENGINE=MyISAM;
INSERT INTO fk_rooms_my VALUES (1, 99);   -- ঢুকে গেল
-- SHOW CREATE TABLE এ শুধু KEY \`hotel_id\`, কোনো CONSTRAINT নেই

-- Parent এর Column এ UNIQUE বা PRIMARY KEY নেই
-- ERROR 6125 (HY000): Failed to add the foreign key constraint. Missing unique key
--   for constraint 'fk_bad_child_ibfk_1' in the referenced table 'fk_bad_parent'

-- Island Tours এর কোন Foreign Key এর কী নিয়ম
SELECT TABLE_NAME, CONSTRAINT_NAME, DELETE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'island_tours' AND TABLE_NAME NOT LIKE 'fk_%'
ORDER BY TABLE_NAME, CONSTRAINT_NAME;
-- (7 rows), সবগুলোর DELETE_RULE NO ACTION:
-- bookings_ibfk_1, bookings_ibfk_2, departures_ibfk_1, payments_ibfk_1,
-- reviews_ibfk_1, tours_ibfk_1, tours_ibfk_2`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "FOREIGN_KEY_CHECKS = 0",
          content: (
            <ContentParagraph>
              MySQL এ একটা Session Variable দিয়ে সব Foreign Key Check বন্ধ করা যায়: SET FOREIGN_KEY_CHECKS = 0। mysqldump
              নিজের বানানো Backup ফাইলের শুরুতে ঠিক এটাই লেখে, যাতে Table গুলো যেকোনো ক্রমে Load হয়। কিন্তু হাতে এটা চালিয়ে
              একটা অনাথ Row ঢুকিয়ে আবার 1 করলে MySQL পুরনো Row গুলো আর যাচাই করে না: এই ট্র্যাকের 8.4 এ Room 301, Hotel 99,
              চুপচাপ থেকে গেছে। পুরনো App এর গল্পটা আবার শুরু। Backup Load ছাড়া এটা ছোঁবেন না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর সাতটা সেতু, আর প্রতিটার সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তানিমের এবারের কাজ পুরো Database এর Foreign Key গুলো পর্যালোচনা করা: কোনটা কাকে দেখায়, আর প্রতিটায় এখন কোন ON
              DELETE নিয়ম। pg_constraint এর confdeltype Column এ নিয়মটা এক অক্ষরে লেখা থাকে: a মানে NO ACTION, r RESTRICT, c
              CASCADE, n SET NULL, d SET DEFAULT। ON UPDATE এর জন্য একই অক্ষর confupdtype এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর Foreign Key মানচিত্র"
              query={`SELECT c.conrelid::regclass  AS child_table,
       a.attname             AS fk_column,
       c.confrelid::regclass AS parent_table,
       c.confdeltype         AS on_delete,
       c.confupdtype         AS on_update
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
  AND c.conrelid::regclass::text NOT LIKE 'fk%'   -- এই পাতায় বানানো fk_ Table বাদ
ORDER BY c.conrelid::regclass::text, a.attname;`}
              caption="৭টা Row, সবগুলোয় on_delete আর on_update a, মানে NO ACTION। Sample Database বানানোর সময় কোনো ON DELETE লেখা হয়নি, তাই সব জায়গায় Default। নিরাপদ, কিন্তু প্রতিটা সম্পর্কের জন্য সবচেয়ে ভালো কিনা, সেটা আলাদা প্রশ্ন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তানিম প্রতিটা Foreign Key এর জন্য একটাই প্রশ্ন করলেন: Parent না থাকলে এই Child Row এর কি নিজের কোনো মূল্য আছে?
              উত্তরগুলো নিচের Table এ। এটা একটা প্রস্তাব, Sample Database বদলানো হয়নি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Foreign Key", "প্রস্তাবিত ON DELETE", "কারণ"],
          rows: [
            ["tours.destination_id", "RESTRICT", "ট্যুর চলছে এমন জায়গা তালিকা থেকে সরানো চলবে না। আগে ট্যুরগুলো সরাতে হবে।"],
            ["tours.guide_id", "SET NULL", "Guide চলে গেলেও ট্যুর থাকে। Column এ আগে থেকেই NULL চলে, Ratargul তার উদাহরণ।"],
            ["departures.tour_id", "RESTRICT", "তারিখে Booking থাকতে পারে, টাকা থাকতে পারে। ট্যুর মুছে সব হারানো যাবে না।"],
            ["bookings.customer_id", "RESTRICT", "Booking আয়ের রেকর্ড। Customer চলে গেলে Soft Delete, Row মোছা না।"],
            ["bookings.departure_id", "RESTRICT", "একই কারণ: Booking এর ইতিহাস আছে।"],
            ["payments.booking_id", "RESTRICT", "টাকার রেকর্ড কখনো নিজে থেকে মুছবে না। হিসাবরক্ষকের প্রথম শর্ত।"],
            ["reviews.booking_id", "CASCADE", "Review এর Booking ছাড়া অর্থ নেই। কোনো Booking সত্যিই মুছতে হলে তার Review ও যাক।"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা প্রস্তাব চালিয়ে দেখা যাক, তবে আসল Table নষ্ট না করে। নিচের বক্স একটা Transaction খোলে, tours.guide_id এর
              Foreign Key কে SET NULL দিয়ে নতুন করে বানায়, Jamal Hossain কে মোছে, ফল দেখে, তারপর ROLLBACK দিয়ে সব আগের মতো
              ফিরিয়ে দেয়। ALTER TABLE এর বিস্তারিত পরের লেসনে, এখানে শুধু দুটো লাইন: পুরনো Constraint মোছা, নতুন বসানো।
              PostgreSQL এ Table এর গঠন বদলানোও ROLLBACK এ ফিরে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রস্তাবটা চালিয়ে দেখা, তারপর ফিরিয়ে দেওয়া"
              query={`BEGIN;

ALTER TABLE tours DROP CONSTRAINT tours_guide_id_fkey;
ALTER TABLE tours ADD CONSTRAINT tours_guide_id_fkey
  FOREIGN KEY (guide_id) REFERENCES guides (guide_id) ON DELETE SET NULL;

DELETE FROM guides WHERE guide_id = 1;   -- Jamal Hossain

SELECT tour_id, title, guide_id
FROM tours
WHERE guide_id IS NULL
ORDER BY tour_id;

ROLLBACK;`}
              caption="Transaction এর ভেতরে SELECT এ ৩টা Row: Saint Martin Island Escape আর Sajek Valley Cloud Trip, Jamal সাহেবের দুটো ট্যুর, এখন Guide ফাঁকা, সাথে আগে থেকেই ফাঁকা Ratargul। ROLLBACK এর পরে সব আগের মতো: Jamal Hossain ফিরে এসেছেন, ট্যুর 1 আর 4 এ আবার guide_id 1, Constraint আবার NO ACTION। চাইলে এরপর SELECT tour_id, guide_id FROM tours WHERE tour_id IN (1, 4); চালিয়ে মিলিয়ে নিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আটকানো নিয়মের সাথে কাজ করার একটা ভালো অভ্যাস: মোছার আগে জিজ্ঞেস করে নিন, কে এখনো এই Row কে দেখায়। তাহলে Error এর
              বদলে আগেই পরিষ্কার উত্তর পান, আর App এ মানুষকে বোঝানো যায় কেন মোছা যাচ্ছে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মোছার আগে: কে এখনো দেখায়?"
              query={`SELECT c.customer_id, c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c
WHERE c.customer_id IN (1, 15)
ORDER BY c.customer_id;`}
              caption="Rahim Uddin এর 3টা Booking, তাই তাঁকে মোছা যাবে না, থিওরির বক্সে সেটাই দেখেছেন। Imran Kabir এর 0, তাঁকে মোছা যায়। Sample Database এ এমন আরও আছে: Kuakata তে কোনো ট্যুর নেই, Nazmul Karim এর কোনো ট্যুর নেই, Cox's Bazar Family Package এর কোনো তারিখ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              task={
                <>
                  Island Tours এর Hotel অংশের তিনটা Table নিজে লিখুন। <code className={CODE}>fk_ch_hotels</code>: hotel_id
                  integer Primary Key, name text খালি না। <code className={CODE}>fk_ch_rooms</code>: room_id integer Primary
                  Key, hotel_id খালি না আর fk_ch_hotels কে দেখায়, Hotel মুছলে তার Room ও যাবে; label text খালি না।{" "}
                  <code className={CODE}>fk_ch_stays</code>: stay_id integer Primary Key; room_id খালি না আর fk_ch_rooms কে
                  দেখায়, কেউ থেকেছেন এমন Room মোছা সাথে সাথে আটকে যাবে (RESTRICT); customer_id খালি না আর Island Tours এর
                  আসল customers Table কে দেখায়, Default নিয়মে; check_in date খালি না। Column এর ক্রম ঠিক এটাই। নিচের লাইনগুলো
                  যেমন আছে রাখুন।
                </>
              }
              hint={
                <>
                  তিনটা আলাদা নিয়ম: rooms এ <code className={CODE}>ON DELETE CASCADE</code>, stays এর room_id তে{" "}
                  <code className={CODE}>ON DELETE RESTRICT</code>, stays এর customer_id তে কিছুই না লিখে{" "}
                  <code className={CODE}>REFERENCES customers (customer_id)</code>। Table তিনটা লিখুন Parent থেকে Child এর
                  ক্রমে।
                </>
              }
              starter={`DROP TABLE IF EXISTS fk_ch_stays, fk_ch_rooms, fk_ch_hotels;

-- এখানে তিনটা CREATE TABLE লিখুন: hotels, rooms, stays


-- নিচের লাইনগুলো যেমন আছে তেমন রাখুন
INSERT INTO fk_ch_hotels VALUES (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge');
INSERT INTO fk_ch_rooms VALUES (101, 1, 'Sea view double'), (201, 2, 'Cloud deck single');
INSERT INTO fk_ch_stays VALUES (9001, 101, 1, '2026-11-20');
DELETE FROM fk_ch_hotels WHERE hotel_id = 2;   -- কেউ থাকেনি, Room 201 ও যাবে
SELECT c.conrelid::regclass::text  AS child_table,
       a.attname                   AS fk_column,
       c.confrelid::regclass::text AS parent_table,
       c.confdeltype               AS on_delete,
       (SELECT count(*) FROM fk_ch_rooms) AS rooms_left
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f' AND c.conrelid::regclass::text LIKE 'fk_ch_%'
ORDER BY child_table, fk_column;`}
              solution={`SELECT * FROM (VALUES
  ('fk_ch_rooms', 'hotel_id',    'fk_ch_hotels', 'c', 1),
  ('fk_ch_stays', 'customer_id', 'customers',    'a', 1),
  ('fk_ch_stays', 'room_id',     'fk_ch_rooms',  'r', 1)
) AS v(child_table, fk_column, parent_table, on_delete, rooms_left);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Foreign Key বানানোর সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "সম্পর্কটা মুখে বলুন",
              description:
                "প্রতিটা Room একটা Hotel এর, একটা Hotel এর অনেক Room। যেদিকে 'অনেক', Foreign Key সেই Table এ, এখানে fk_rooms।",
            },
            {
              title: "Parent এর Key ঠিক করুন",
              description:
                "Parent এর যে Column কে দেখাবেন, তাতে PRIMARY KEY বা UNIQUE আছে তো? Type কী? Child এর Column এ হুবহু সেই Type দিন।",
            },
            {
              title: "সম্পর্কটা বাধ্যতামূলক নাকি ঐচ্ছিক",
              description:
                "Parent ছাড়া Child থাকতে পারে কি? না পারলে Referencing Column এ NOT NULL। পারলে NULL চলতে দিন।",
            },
            {
              title: "ON DELETE এর প্রশ্ন",
              description:
                "Parent না থাকলে এই Child এর কি নিজের মূল্য আছে? আছে আর মোছা চলবে না: Default বা RESTRICT। মূল্য নেই: CASCADE। থাকবে কিন্তু ঠিকানা ছাড়া: SET NULL।",
            },
            {
              title: "ON UPDATE এর প্রশ্ন",
              description:
                "Parent এর Key কি কখনো বদলায়? Identity নম্বর হলে না, কিছু লেখার দরকার নেই। অর্থওয়ালা Code হলে ON UPDATE CASCADE।",
            },
            {
              title: "নাম দিন, আর Parent আগে বানান",
              description:
                "CONSTRAINT fk_rooms_hotel_fk FOREIGN KEY ... দিয়ে নিজের নাম। CREATE TABLE এর ক্রম Parent থেকে Child, DROP এর ক্রম উল্টো।",
            },
            {
              title: "Index আর প্রমাণ",
              description:
                "Parent থেকে মোছা হলে আর Child বড় হলে Referencing Column এ Index। শেষে একটা অনাথ INSERT আর একটা Parent DELETE চালিয়ে দেখুন নিয়মটা সত্যিই খাটছে।",
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
            ["Child এর Table আগে বানানো", "relation does not exist", "আগে Parent, তারপর Child"],
            ["Parent এর Column এ UNIQUE নেই", "there is no unique constraint matching given keys", "Parent এর Column এ PRIMARY KEY বা UNIQUE"],
            ["দুই দিকে আলাদা Type", "incompatible types, অথবা চুপচাপ বেমানান Type", "দুই দিকে হুবহু একই Type"],
            ["SET NULL এর সাথে NOT NULL", "PostgreSQL এ প্রথম DELETE এ 23502, MySQL এ CREATE এ 1830", "SET NULL দিলে Column এ NULL চলতে দিন"],
            ["SET DEFAULT কিন্তু Default এর Parent নেই", "DELETE এ 23503, বার্তায় insert or update", "Default মানের Row Parent এ রাখুন"],
            ["টাকার Table এ CASCADE", "একটা DELETE এ ইতিহাস উধাও, শুধু DELETE 1 দেখায়", "RESTRICT বা Default, আর Soft Delete"],
            ["ON DELETE লিখে ভাবা ON UPDATE ও হলো", "Key বদলাতে গিয়ে 23503", "দুটো আলাদা, দরকার হলে দুটোই লিখুন"],
            ["PostgreSQL এ Index না দেওয়া", "বড় Table এ Parent মোছা ধীর", "Referencing Column এ CREATE INDEX"],
            ["MySQL এ Column এর পাশে REFERENCES", "কোনো পাহারা নেই, অনাথ ঢুকে যায়", "আলাদা লাইনে FOREIGN KEY (column) REFERENCES"],
            ["MySQL এ FOREIGN_KEY_CHECKS = 0 করে ভুলে যাওয়া", "পুরনো অনাথ Row আর যাচাই হয় না", "শুধু Backup Load এ, শেষে আবার 1"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`DROP TABLE IF EXISTS fk_mis_trips, fk_mis_guides;
CREATE TABLE fk_mis_guides (guide_id integer PRIMARY KEY, full_name text NOT NULL);
CREATE TABLE fk_mis_trips (
  trip_id  integer PRIMARY KEY,
  title    text NOT NULL,
  guide_id integer NOT NULL REFERENCES fk_mis_guides ON DELETE SET NULL
);
INSERT INTO fk_mis_guides VALUES (1, 'Jamal Hossain'), (2, 'Shirin Akter');
INSERT INTO fk_mis_trips VALUES
  (101, 'Saint Martin Island Escape', 1),
  (103, 'Cox''s Bazar Beach Weekend', 2);

DELETE FROM fk_mis_guides WHERE guide_id = 1;

SELECT * FROM fk_mis_trips ORDER BY trip_id;`}
              caption="এখানে একটা ভুল আছে, তাই DELETE লাইনে ERROR: null value in column guide_id of relation fk_mis_trips violates not-null constraint। guide_id এর লাইন থেকে NOT NULL শব্দ দুটো মুছে আবার চালান। ঠিক হলে ২টা Row আসবে: ট্যুর 101 এর guide_id ফাঁকা, ট্যুর 103 এর 2।"
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
                  : Foreign Keys অংশে পাঁচটা নিয়মের আনুষ্ঠানিক ব্যাখ্যা, NO ACTION আর RESTRICT এর তফাত, MATCH, আর কেন Referencing
                  Column এ Index নিজে থেকে তৈরি হয় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-createtable.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: CREATE TABLE
                  </a>
                  : REFERENCES আর FOREIGN KEY এর পুরো Syntax, SET NULL (column) এর তালিকা, DEFERRABLE আর INITIALLY DEFERRED।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-set-constraints.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SET CONSTRAINTS
                  </a>
                  : একটা Transaction এর ভেতরে DEFERRABLE Constraint এর Check কখন হবে, সেটা বদলানোর নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: FOREIGN KEY Constraints
                  </a>
                  : InnoDB তে নিয়মগুলো কীভাবে কাজ করে, Index এর শর্ত, NO ACTION আর RESTRICT এর সমতা, আর SET DEFAULT নিয়ে Manual
                  এর বক্তব্য।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/ansi-diff-foreign-keys.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: FOREIGN KEY Constraint Differences
                  </a>
                  : যেখানে লেখা আছে Column এর পাশের REFERENCES কেন শুধু একটা মন্তব্যের মতো, আর MyISAM কেন Foreign Key ফেলে দেয়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে কোনো Table এ Foreign Key দেখলে মিলিয়ে নিন সেটা আলাদা লাইনের FOREIGN KEY দিয়ে লেখা
                  কিনা, আর একই Table PostgreSQL এ বানালে কোন ON DELETE দিতেন।
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
                  Foreign Key একটা প্রতিশ্রুতি: Child এর Referencing Column এ যে মান থাকবে, সেটা হয় NULL, নয়তো Parent এর Key
                  তে আছে। অনাথ Row অসম্ভব, কে কোন পথে Data বদলাক।
                </ListItem>
                <ListItem>
                  লেখা: <code className={CODE}>REFERENCES parent (column)</code> Column এর পাশে, অথবা আলাদা লাইনে{" "}
                  <code className={CODE}>FOREIGN KEY (column) REFERENCES parent (column)</code>। Parent আগে থাকতে হবে, তার
                  Column এ PRIMARY KEY বা UNIQUE, দুই দিকে একই Type।
                </ListItem>
                <ListItem>
                  Check হয় চার কাজে: Child এ INSERT, Child এর Column বদলানো, Parent এ DELETE, Parent এর Key বদলানো। Child
                  মোছা আর নতুন Parent এ Check নেই। Parent এর DROP আর TRUNCATE আটকে যায়।
                </ListItem>
                <ListItem>NULL এর জন্য Parent খোঁজা হয় না। NOT NULL দিলে সম্পর্ক বাধ্যতামূলক, না দিলে ঐচ্ছিক।</ListItem>
                <ListItem>
                  ON DELETE এর পাঁচ নিয়ম: NO ACTION (Default, Statement এর শেষে Check, 23503), RESTRICT (সাথে সাথে, 23001),
                  CASCADE (সাথে মোছা), SET NULL (Column এ NULL চলতে হবে), SET DEFAULT (Default এর Parent থাকতে হবে)।
                </ListItem>
                <ListItem>
                  CASCADE শিকল ধরে নামে, আর কোথাও আটকালে পুরোটা বাতিল। টাকা আর ইতিহাসের Table এ CASCADE না।
                </ListItem>
                <ListItem>
                  ON UPDATE আলাদা সিদ্ধান্ত। Identity Key কখনো বদলায় না, অর্থওয়ালা Code বদলালে ON UPDATE CASCADE।
                </ListItem>
                <ListItem>
                  DEFERRABLE INITIALLY DEFERRED দিলে Check হয় COMMIT এ। দরকার কম, MySQL এ নেই।
                </ListItem>
                <ListItem>
                  PostgreSQL Referencing Column এ Index দেয় না, বড় Table এ নিজে দিন। MySQL দেয়, কিন্তু সেখানে Column এর পাশের
                  REFERENCES কিছুই করে না, আর MyISAM Foreign Key ফেলে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে প্রতিটা Foreign Key বসেছে Table বানানোর দিনেই, CREATE TABLE এর ভেতরে। কিন্তু আসল জীবনে Table আগে থেকেই
                থাকে, Data সহ, আর পরে বোঝা যায় একটা Foreign Key দরকার, অথবা একটা নতুন Column, অথবা একটা নিয়ম বদলাতে হবে।
                Project Example এ আপনি ALTER TABLE এর এক ঝলক দেখেছেন। চলমান Table কে নিরাপদে বদলানোর পুরো উপায় পরের লেসন{" "}
                <Link href="/sql/topic/alter-table" className={LINK}>
                  ALTER TABLE
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
      ["Foreign Key", "Child এর মান হয় NULL, নয়তো Parent এ আছে", "bookings.customer_id থেকে customers"],
      ["Orphan Row", "এমন Parent কে দেখানো Row, যে আর নেই", "পুরনো App এ 75000 টাকার দুটো Booking"],
      ["REFERENCES", "Column এর পাশে বা আলাদা লাইনে, চার রূপ এক জিনিস", "fk_rooms_hotel_id_fkey"],
      ["Parent এর শর্ত", "আগে বানানো, PRIMARY KEY বা UNIQUE, একই Type", "UNIQUE না থাকলে 42830"],
      ["Check হয়", "Child এ INSERT ও UPDATE, Parent এ DELETE ও Key UPDATE", "Hotel 99 নেই: 23503"],
      ["Check হয় না", "Child মোছা, নতুন Parent, NULL", "Room 900, Hotel ছাড়া"],
      ["NO ACTION", "Default, Statement এর শেষে Check", "মুছে একই Key লেখা: চলে"],
      ["RESTRICT", "সাথে সাথে Check, কখনো পেছায় না", "একই কাজে 23001"],
      ["CASCADE", "Parent এর সাথে Child ও মোছে, শিকল ধরে", "চারতলা শিকল, RESTRICT এ বাতিল"],
      ["SET NULL", "Child থাকে, Column NULL", "Jamal এর দুটো ট্যুর, Guide ফাঁকা"],
      ["SET DEFAULT", "Child থাকে, Column Default এ, সেই Parent থাকতে হবে", "Room গেল Unassigned এ"],
      ["ON UPDATE CASCADE", "Parent এর Key বদলালে Child ও বদলায়", "SPR থেকে SPC"],
      ["MATCH SIMPLE ও FULL", "একটা NULL হলে Check নেই, নাকি আধা NULL নিষেধ", "BUS-9 আর NULL"],
      ["DEFERRABLE", "Check COMMIT পর্যন্ত পেছানো", "Item আগে, Order পরে"],
      ["Index", "PostgreSQL দেয় না, MySQL দেয়", "Index ছাড়া 91 ms, সহ 3.7 ms"],
      ["MySQL", "InnoDB, আলাদা লাইনের FOREIGN KEY, 1452 আর 1451", "Column এর পাশের REFERENCES উপেক্ষিত"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "bookings.customer_id থেকে customers এ একটা Foreign Key আছে। নিচের কোন Statement এ এই Foreign Key কখনো Check হয় না?",
        options: [
          {
            key: "A",
            text: "INSERT INTO bookings ...",
            isCorrect: false,
            explanation: "নতুন Booking এর customer_id customers এ আছে কিনা, সেটা দেখা হয়। এটাই সবচেয়ে চেনা Check, না থাকলে 23503।",
          },
          {
            key: "B",
            text: "DELETE FROM bookings WHERE booking_id = 5",
            isCorrect: true,
            explanation:
              "ঠিক। Child মুছলে কেউ অনাথ হয় না, Customer আগের মতোই থাকেন। প্রতিশ্রুতি ভাঙার কোনো সম্ভাবনা নেই, তাই Check চলেই না।",
          },
          {
            key: "C",
            text: "DELETE FROM customers WHERE customer_id = 1",
            isCorrect: false,
            explanation: "Parent মোছায় Check হয়: কোনো Booking এখনো Customer 1 কে দেখায় কিনা। দেখায়, তাই থিওরির বক্সে Error এসেছিল।",
          },
          {
            key: "D",
            text: "UPDATE bookings SET customer_id = 3 WHERE booking_id = 5",
            isCorrect: false,
            explanation: "Referencing Column এ নতুন মান লেখা INSERT এর মতোই, Customer 3 আছে কিনা Check হয়।",
          },
        ],
      },
      {
        id: 2,
        text: "fk_rooms.hotel_id integer REFERENCES fk_hotels (hotel_id), NOT NULL ছাড়া। INSERT INTO fk_rooms VALUES (900, NULL, 'Not yet assigned'); চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Row ঢুকে যায়",
            isCorrect: true,
            explanation:
              "ঠিক। NULL এর জন্য Parent খোঁজা হয় না, এটাই প্রতিশ্রুতির NULL অংশ। Room 900 কোনো Hotel ছাড়াই আছে। বাধ্যতামূলক করতে চাইলে NOT NULL লাগে।",
          },
          {
            key: "B",
            text: "ERROR 23503, কারণ NULL কোনো Hotel এ নেই",
            isCorrect: false,
            explanation: "NULL কোনো মান না, তাই তার জন্য Parent খোঁজার প্রশ্নই আসে না। 23503 আসে শুধু এমন মানে, যেটা Parent এ নেই।",
          },
          {
            key: "C",
            text: "ERROR 23502, NOT NULL ভাঙার জন্য",
            isCorrect: false,
            explanation: "Column এ NOT NULL দেওয়াই হয়নি। REFERENCES নিজে থেকে NOT NULL আনে না, দুটো আলাদা নিয়ম।",
          },
          {
            key: "D",
            text: "Row ঢোকে, কিন্তু hotel_id নিজে থেকে 0 হয়ে যায়",
            isCorrect: false,
            explanation: "INSERT এ আপনি নিজে NULL দিয়েছেন, তাই NULL ই থাকে। Default বসে শুধু Column বাদ দিলে, বা SET DEFAULT নিয়মে Parent মুছলে।",
          },
        ],
      },
      {
        id: 3,
        text: "REFERENCES এর পরে কোনো ON DELETE লেখা না থাকলে PostgreSQL কোন নিয়ম ধরে নেয়?",
        options: [
          {
            key: "A",
            text: "NO ACTION",
            isCorrect: true,
            explanation:
              "ঠিক। Island Tours এর সাতটা Foreign Key তেই confdeltype a, মানে NO ACTION। কাউকে দেখানো Parent মোছা আটকায়, Check হয় Statement এর শেষে।",
          },
          {
            key: "B",
            text: "RESTRICT",
            isCorrect: false,
            explanation: "ফল প্রায় একই, কিন্তু Default এর নাম NO ACTION। RESTRICT নিজে লিখতে হয়, আর তার Error এর SQLSTATE আলাদা, 23001।",
          },
          {
            key: "C",
            text: "CASCADE",
            isCorrect: false,
            explanation: "CASCADE কখনো Default না। হলে থিওরির বক্সে Rahim Uddin এর সাথে তাঁর সব Booking চুপচাপ মুছে যেত।",
          },
          {
            key: "D",
            text: "SET NULL",
            isCorrect: false,
            explanation: "SET NULL নিজে লিখতে হয়। Default হলে bookings.customer_id এর NOT NULL এর সাথে বিরোধ বাধত।",
          },
        ],
      },
      {
        id: 4,
        text: "PostgreSQL এ ON DELETE NO ACTION আর ON DELETE RESTRICT এর আসল তফাত কী?",
        options: [
          {
            key: "A",
            text: "কোনো তফাত নেই, দুটো একই শব্দের দুই নাম",
            isCorrect: false,
            explanation: "MySQL এর InnoDB তে কথাটা সত্যি, PostgreSQL এ না। এই লেসনের CTE বক্সে একই কাজ একটায় চলেছে, অন্যটায় আটকেছে।",
          },
          {
            key: "B",
            text: "NO ACTION Check করে Statement এর শেষে আর পেছানো যায়, RESTRICT সাথে সাথে আর পেছায় না",
            isCorrect: true,
            explanation:
              "ঠিক। তাই একই Statement এ মুছে একই Key আবার লিখলে NO ACTION মেনে নেয়, RESTRICT দেয় 23001। DEFERRABLE ও কাজ করে শুধু NO ACTION এ।",
          },
          {
            key: "C",
            text: "RESTRICT Child Row গুলোও মুছে দেয়",
            isCorrect: false,
            explanation: "সেটা CASCADE এর কাজ। RESTRICT কিছুই মোছে না, শুধু আটকায়।",
          },
          {
            key: "D",
            text: "NO ACTION অনাথ Row থাকতে দেয়, RESTRICT দেয় না",
            isCorrect: false,
            explanation: "NO ACTION ও অনাথ থাকতে দেয় না। Statement শেষে কেউ অনাথ থাকলে 23503 আর পুরো Statement বাতিল।",
          },
        ],
      },
      {
        id: 5,
        text: "PostgreSQL এ guide_id integer NOT NULL REFERENCES guides ON DELETE SET NULL লিখে Table বানালেন। কী হবে?",
        options: [
          {
            key: "A",
            text: "CREATE TABLE এ সাথে সাথে Error",
            isCorrect: false,
            explanation: "MySQL এ এমনটাই হয়, ERROR 1830। PostgreSQL CREATE এর সময় এই বিরোধ ধরে না।",
          },
          {
            key: "B",
            text: "Table তৈরি হয়, কিন্তু কাউকে দেখানো Guide মুছলেই ERROR 23502",
            isCorrect: true,
            explanation:
              "ঠিক। SET NULL চায় NULL বসাতে, NOT NULL দেয় না। বিরোধটা ধরা পড়ে প্রথম আসল DELETE এ, যেটা হয়তো মাস কয়েক পরে।",
          },
          {
            key: "C",
            text: "Guide মুছলে ট্যুরের guide_id 0 হয়ে যায়",
            isCorrect: false,
            explanation: "0 বসানো SET DEFAULT এর কাজ, আর তার জন্য Column এ DEFAULT 0 থাকতে হয়। এখানে তেমন কিছু নেই।",
          },
          {
            key: "D",
            text: "Guide মুছলে তাঁর ট্যুরগুলোও মুছে যায়",
            isCorrect: false,
            explanation: "PostgreSQL নিজে থেকে নিয়ম বদলে CASCADE করে না। লেখা নিয়ম খাটাতে না পারলে Error দেয়।",
          },
        ],
      },
      {
        id: 6,
        text: "ট্যুর থেকে তারিখ আর তারিখ থেকে Booking এ CASCADE, কিন্তু Payment থেকে Booking এ RESTRICT। যে ট্যুরের একটা Booking এ টাকা দেওয়া আছে, সেই ট্যুর মুছলে কী হয়?",
        options: [
          {
            key: "A",
            text: "ট্যুর, তারিখ, Booking মুছে যায়, শুধু Payment থাকে",
            isCorrect: false,
            explanation: "তাহলে Payment অনাথ হতো, যেটা RESTRICT হতে দেয় না। ঢেউ আংশিক থামে না।",
          },
          {
            key: "B",
            text: "পুরো DELETE বাতিল, কিছুই মোছে না",
            isCorrect: true,
            explanation:
              "ঠিক। ঢেউ Booking এ পৌঁছে RESTRICT এ ধাক্কা খায়, Error আসে Booking এর Table থেকে, আর একটা Statement হিসেবে পুরোটা ফিরে যায়। লেসনের চারতলা শিকলে 1, 2, 2 একই থেকেছিল।",
          },
          {
            key: "C",
            text: "শুধু ট্যুরটা মোছে, নিচের কিছু না",
            isCorrect: false,
            explanation: "ট্যুর মুছে তারিখ রেখে দিলে তারিখগুলো অনাথ হতো। হয় পুরো ঢেউ, নয়তো কিছুই না।",
          },
          {
            key: "D",
            text: "Payment এর booking_id NULL হয়ে যায়",
            isCorrect: false,
            explanation: "NULL বসানো SET NULL এর কাজ। RESTRICT কিছু বদলায় না, শুধু আটকায়।",
          },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL এ bookings.customer_id তে Foreign Key আছে। এই Column এর Index নিয়ে কোন কথাটা সত্যি?",
        options: [
          {
            key: "A",
            text: "Foreign Key বানালে PostgreSQL নিজে Index বানিয়ে দেয়",
            isCorrect: false,
            explanation: "দেয় না। Catalog Query তে Island Tours এর ছয়টা Foreign Key Column এ কোনো Index পাওয়া যায়নি।",
          },
          {
            key: "B",
            text: "Index নেই, তাই Customer মুছলে PostgreSQL কে পুরো bookings পড়ে খুঁজতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। Parent মোছার Check চলে Child এর Column এ। ছোট Table এ টের পাওয়া যায় না, ১ লাখ Row এ Index ছাড়া আর সহ পার্থক্য কয়েক গুণের।",
          },
          {
            key: "C",
            text: "Index ছাড়া Foreign Key বানানোই যায় না",
            isCorrect: false,
            explanation: "যায়, Sample Database এ সেভাবেই আছে। Index লাগে Parent এর দিকে (PRIMARY KEY বা UNIQUE), Child এর দিকে না।",
          },
          {
            key: "D",
            text: "Index লাগে শুধু Child এ INSERT দ্রুত করতে",
            isCorrect: false,
            explanation: "INSERT এর Check খোঁজে Parent এর Key তে, সেখানে Primary Key এর Index আগে থেকেই আছে। Child এর Index লাগে Parent মোছা বা Key বদলানোয়।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ CREATE TABLE fk_rooms (room_id INT PRIMARY KEY, hotel_id INT NOT NULL REFERENCES fk_hotels (hotel_id)); লিখে Hotel 99 এর Room ঢোকালে কী হয়?",
        options: [
          {
            key: "A",
            text: "ERROR 1452, Foreign Key ভাঙার জন্য",
            isCorrect: false,
            explanation: "1452 আসে আলাদা লাইনের FOREIGN KEY থাকলে। Column এর পাশের REFERENCES কোনো Constraint ই তৈরি করেনি।",
          },
          {
            key: "B",
            text: "Row ঢুকে যায়, কারণ MySQL Column এর পাশের REFERENCES পড়ে কিন্তু উপেক্ষা করে",
            isCorrect: true,
            explanation:
              "ঠিক। SHOW CREATE TABLE এ কোনো FOREIGN KEY নেই, অনাথ Row 301, 99 ঢুকে গেছে, কোনো Warning ছাড়া। MySQL এ সবসময় আলাদা লাইনে FOREIGN KEY লিখুন।",
          },
          {
            key: "C",
            text: "ERROR 1064, Syntax Error",
            isCorrect: false,
            explanation: "Syntax টা MySQL মেনে নেয়, তাই ফাঁদটা এত বিপজ্জনক। Error এলে অন্তত চোখে পড়ত।",
          },
          {
            key: "D",
            text: "শুধু MyISAM Table এ ঢুকে যায়, InnoDB তে Error",
            isCorrect: false,
            explanation: "এখানে Table টা InnoDB, তবু ঢুকে গেছে। MyISAM আলাদা লাইনের FOREIGN KEY ও ফেলে দেয়, এটা ভিন্ন আরেকটা ফাঁদ।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর Hotel অংশ, পাহারা সহ",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিনটা Table:</strong> নিজের psql এ fk_hotels, fk_rooms আর fk_stays বানান, প্রতিটা Foreign Key তে নিজের দেওয়া
        নাম। fk_stays থেকে Island Tours এর আসল customers এও একটা Foreign Key দিন। প্রতিটা Foreign Key এর ON DELETE কেন বেছে
        নিলেন, এক লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>প্রতিটা নিয়মের প্রমাণ:</strong> প্রতিটা Foreign Key এর জন্য একটা ব্যর্থ Statement চালান, একটা অনাথ INSERT আর একটা
        Parent DELETE। Error এর প্রথম লাইন, DETAIL আর SQLSTATE লিখে রাখুন।
      </span>,
      <span key="3">
        <strong>পাঁচ নিয়মের Table:</strong> একটা Hotel আর তিনটা Room নিয়ে একই DELETE পাঁচবার চালান, প্রতিবার ON DELETE বদলে।
        প্রতিবার Room গুলোর কী হলো, পাঁচ Row এর একটা Table এ লিখুন।
      </span>,
      <span key="4">
        <strong>Index এর হিসাব:</strong> লেসনের Catalog Query দিয়ে island_tours এর কোন Foreign Key Column এ Index নেই খুঁজুন।
        তারপর fk_big_ Table দুটো বানিয়ে EXPLAIN ANALYZE দিয়ে Index এর আগে আর পরে Trigger for constraint এর সময় মাপুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> Hotel আর তার Room এর উদাহরণ দিয়ে একজন বন্ধুকে বোঝান Foreign Key কী প্রতিশ্রুতি দেয়,
        কোন কাজে Check হয়, আর Hotel বন্ধ হলে Room এর পাঁচ রকম পরিণতি কী কী।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা CREATE TABLE আর প্রতিটা ON DELETE এর এক লাইনের কারণ</span>,
      <span key="d2">প্রতিটা Foreign Key এর ব্যর্থ Statement, Error আর SQLSTATE</span>,
      <span key="d3">পাঁচ নিয়মের ফলাফলের Table</span>,
      <span key="d4">Index ছাড়া Column এর তালিকা আর দুটো EXPLAIN ANALYZE এর সময়</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Foreign Key",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Foreign Key পড়া",
        description:
          "প্রথম ফাইলে \\d bookings: Foreign-key constraints এ দুটো, Referenced by এ দুটো। তারপর Catalog Query, ৭টা Row।",
      },
      {
        title: "কোথায় Check হয়",
        description:
          "দ্বিতীয় ফাইলের দুটো Error চিনুন: Child এর দিকে insert or update, Parent এর দিকে update or delete। Imran Kabir কে মোছা যায়, কিন্তু ROLLBACK, তাই শেষে আবার 15 জন।",
      },
      {
        title: "ON DELETE বদলে বদলে",
        description:
          "তৃতীয় ফাইল CASCADE দিয়ে লেখা, ১টা Row থাকে। CASCADE এর জায়গায় RESTRICT, SET NULL, SET DEFAULT বসিয়ে আবার চালান, মন্তব্যের ফলাফলের সাথে মেলান।",
      },
      {
        title: "DEFERRABLE",
        description:
          "চতুর্থ ফাইলে প্রথম Transaction সফল, দ্বিতীয়টার Error আসে COMMIT এ। শেষে fk_items এ শুধু Item 1।",
      },
      {
        title: "Index ছাড়া Foreign Key",
        description:
          "পঞ্চম ফাইলের Catalog Query। আগের ড্রিলের fk_rooms আর fk_items ও তালিকায় আসবে, আর দুটোরই has_index f: আপনার বানানো Foreign Key তেও PostgreSQL Index দেয়নি।",
      },
      {
        title: "পরিষ্কার করা",
        description: "ষষ্ঠ ফাইল লেসনের Table গুলো মুছে দেয়। শেষে fk_ দিয়ে শুরু কোনো Table থাকে না।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-read-fks.sql",
        code: `\\d bookings
-- Foreign-key constraints:
--     "bookings_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
--     "bookings_departure_id_fkey" FOREIGN KEY (departure_id) REFERENCES departures(departure_id)
-- Referenced by:
--     TABLE "payments" CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
--     TABLE "reviews" CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)

SELECT conrelid::regclass AS child_table,
       conname            AS constraint_name,
       pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'f'
ORDER BY conrelid::regclass::text, conname;
-- (7 rows): bookings 2টা, departures 1, payments 1, reviews 1, tours 2`,
      },
      {
        language: "sql",
        filename: "02-what-is-checked.sql",
        code: `INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (999, 1, 1, 'pending', 12500);
-- ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_customer_id_fkey"
-- DETAIL:  Key (customer_id)=(999) is not present in table "customers".

DELETE FROM customers WHERE customer_id = 1;
-- ERROR:  update or delete on table "customers" violates foreign key constraint "bookings_customer_id_fkey" on table "bookings"
-- DETAIL:  Key (customer_id)=(1) is still referenced from table "bookings".

BEGIN;
DELETE FROM customers WHERE customer_id = 15;   -- Imran Kabir, কোনো Booking নেই
-- DELETE 1
ROLLBACK;

SELECT count(*) FROM customers;
-- 15`,
      },
      {
        language: "sql",
        filename: "03-on-delete.sql",
        code: `DROP TABLE IF EXISTS fk_rooms, fk_hotels;
CREATE TABLE fk_hotels (
  hotel_id integer PRIMARY KEY,
  name     text NOT NULL
);
CREATE TABLE fk_rooms (
  room_id  integer PRIMARY KEY,
  hotel_id integer DEFAULT 0
           REFERENCES fk_hotels (hotel_id) ON DELETE CASCADE,
  label    text NOT NULL
);
INSERT INTO fk_hotels VALUES (0, 'Unassigned'), (1, 'Sea Pearl Resort'), (2, 'Hill View Lodge');
INSERT INTO fk_rooms VALUES (101, 1, 'Sea view double'), (102, 1, 'Garden twin'), (201, 2, 'Cloud deck single');
DELETE FROM fk_hotels WHERE hotel_id = 1;
SELECT * FROM fk_rooms ORDER BY room_id;
-- CASCADE:     (1 row)  201 | 2 | Cloud deck single
-- RESTRICT:    ERROR ... violates RESTRICT setting ..., তারপর 3 rows, কিছুই বদলায়নি
-- SET NULL:    (3 rows) 101 আর 102 এর hotel_id ফাঁকা
-- SET DEFAULT: (3 rows) 101 আর 102 এর hotel_id 0`,
      },
      {
        language: "sql",
        filename: "04-deferrable.sql",
        code: `DROP TABLE IF EXISTS fk_items, fk_orders;
CREATE TABLE fk_orders (order_id integer PRIMARY KEY, note text);
CREATE TABLE fk_items (
  item_id  integer PRIMARY KEY,
  order_id integer NOT NULL REFERENCES fk_orders DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
INSERT INTO fk_items VALUES (1, 500);
INSERT INTO fk_orders VALUES (500, 'parent came second');
COMMIT;
-- COMMIT

BEGIN;
INSERT INTO fk_items VALUES (2, 777);
COMMIT;
-- ERROR:  insert or update on table "fk_items" violates foreign key constraint "fk_items_order_id_fkey"
-- DETAIL:  Key (order_id)=(777) is not present in table "fk_orders".

SELECT * FROM fk_items;
-- (1 row) 1 | 500`,
      },
      {
        language: "sql",
        filename: "05-unindexed-fks.sql",
        code: `SELECT c.conrelid::regclass AS child_table,
       a.attname            AS fk_column,
       EXISTS (SELECT 1 FROM pg_index i
               WHERE i.indrelid = c.conrelid
                 AND i.indkey[0] = c.conkey[1]) AS has_index
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
ORDER BY c.conrelid::regclass::text, a.attname;
-- (9 rows), শুধু reviews.booking_id তে t
-- fk_items.order_id আর fk_rooms.hotel_id ও আছে, দুটোই f`,
      },
      {
        language: "sql",
        filename: "06-cleanup.sql",
        code: `DROP TABLE IF EXISTS fk_rooms, fk_hotels, fk_items, fk_orders;

SELECT count(*) AS fk_tables_left
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'fk\\_%';
-- 0`,
      },
    ],
  },
};
