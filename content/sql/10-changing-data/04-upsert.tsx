import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlExercise } from "../../../components/course/sql/sql-exercise";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { RaceLab, UpsertModeLab } from "../../../components/course/topics/dml/ups-animations";
import {
  CheckThenInsertRaceDiagram,
  ExcludedSplit,
  MergeAnatomyDiagram,
  ReplaceVsUpsertSplit,
  UpsertPathsDiagram,
} from "../../../components/course/topics/dml/ups-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * A copy of the customers table keyed by email, so boxes can insert and
 * update freely without touching the sample data. Every box that needs it
 * builds it again, so each box works on its own and can be run twice.
 */
const SETUP_CUSTOMERS = `DROP TABLE IF EXISTS ups_customers;
CREATE TABLE ups_customers AS
SELECT email, full_name, phone, city FROM customers;
ALTER TABLE ups_customers ADD PRIMARY KEY (email);`;

/** A copy of the tours table keyed by tour_id, rebuilt by every box that uses it. */
const SETUP_TOURS = `DROP TABLE IF EXISTS ups_tours;
CREATE TABLE ups_tours AS
SELECT tour_id, title, price_bdt, is_active FROM tours;
ALTER TABLE ups_tours ADD PRIMARY KEY (tour_id);`;

/** The partner's price list used by the MERGE boxes: one changed price, one unchanged, one new tour. */
const PRICE_FEED = `DROP TABLE IF EXISTS ups_price_feed;
CREATE TABLE ups_price_feed (
  tour_id   integer PRIMARY KEY,
  title     text NOT NULL,
  price_bdt numeric(10, 2) NOT NULL
);
INSERT INTO ups_price_feed VALUES
  (1,  'Saint Martin Island Escape', 13000.00),
  (2,  'Cox''s Bazar Beach Weekend',  8500.00),
  (10, 'Kuakata Sunrise Weekend',     9000.00);`;

/** The project's raw nightly feed: a tour sent twice, an unchanged price, an inactive tour and a new one. */
const PARTNER_FEED = `DROP TABLE IF EXISTS ups_partner_feed;
CREATE TABLE ups_partner_feed (
  tour_id     integer,
  title       text,
  price_bdt   numeric(10, 2),
  received_at timestamptz
);
INSERT INTO ups_partner_feed VALUES
  (1,  'Saint Martin Island Escape', 12800.00, '2026-11-01 01:00+06'),
  (1,  'Saint Martin Island Escape', 13000.00, '2026-11-01 01:40+06'),
  (2,  'Cox''s Bazar Beach Weekend',  8500.00, '2026-11-01 01:05+06'),
  (4,  'Sajek Valley Cloud Trip',     9800.00, '2026-11-01 01:10+06'),
  (8,  'Saint Martin Luxury Stay',   30000.00, '2026-11-01 01:15+06'),
  (10, 'Kuakata Sunrise Weekend',     9000.00, '2026-11-01 01:20+06');`;

const DOUBLE_CLICK_BOX = `${SETUP_CUSTOMERS}

-- প্রথম Tab থেকে Booking Form: Jui নতুন Customer
INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('jui.sarker@mail.example', 'Jui Sarker', '+8801000000116', 'Rangpur');

-- এক সেকেন্ড পরে দ্বিতীয় Tab থেকে হুবহু একই অনুরোধ
INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('jui.sarker@mail.example', 'Jui Sarker', '+8801000000116', 'Rangpur');`;

const FIXED_BOX = `${SETUP_CUSTOMERS}

INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('jui.sarker@mail.example', 'Jui Sarker', '+8801000000116', 'Rangpur')
ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone;

INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('jui.sarker@mail.example', 'Jui Sarker', '+8801000000116', 'Rangpur')
ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone;

SELECT email, full_name, phone, city
FROM ups_customers
WHERE email = 'jui.sarker@mail.example';`;

const OLD_TRICK_BOX = `${SETUP_CUSTOMERS}

-- ধাপ 1: আগে বদলানোর চেষ্টা। ধাপ 2: কিছু না বদলালে তবেই ঢোকানো
WITH changed AS (
  UPDATE ups_customers
  SET phone = '+8801000000303'
  WHERE email = 'tanvir.ahmed@mail.example'
  RETURNING email
)
INSERT INTO ups_customers (email, full_name, phone, city)
SELECT 'tanvir.ahmed@mail.example', 'Tanvir Ahmed', '+8801000000303', 'Chattogram'
WHERE NOT EXISTS (SELECT 1 FROM changed);

SELECT email, full_name, phone, city
FROM ups_customers
WHERE email = 'tanvir.ahmed@mail.example';`;

const DO_NOTHING_BOX = `${SETUP_CUSTOMERS}

-- Newsletter এর Form থেকে আসা চারটা নাম, একটা দুইবার
INSERT INTO ups_customers (email, full_name, phone, city) VALUES
  ('rahim.uddin@mail.example', 'Rahim Uddin', NULL, 'Dhaka'),
  ('jui.sarker@mail.example',  'Jui Sarker',  NULL, 'Rangpur'),
  ('kona.roy@mail.example',    'Kona Roy',    NULL, 'Dhaka'),
  ('jui.sarker@mail.example',  'Jui Sarker',  NULL, 'Rangpur')
ON CONFLICT (email) DO NOTHING
RETURNING email, full_name;

SELECT count(*) AS customers FROM ups_customers;`;

const IDENTITY_BURN_BOX = `BEGIN;

-- Rahim আগে থেকেই আছেন, তাই এই Row বাদ পড়বে
INSERT INTO customers (full_name, email, city)
VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka')
ON CONFLICT DO NOTHING;

-- Jui নতুন, তাঁর customer_id কত হবে?
INSERT INTO customers (full_name, email, city)
VALUES ('Jui Sarker', 'jui.sarker@mail.example', 'Rangpur')
ON CONFLICT DO NOTHING
RETURNING customer_id, full_name;

ROLLBACK;`;

const NO_INDEX_BOX = `${SETUP_CUSTOMERS}

INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', NULL, 'Dhaka')
ON CONFLICT (full_name) DO NOTHING;`;

const TWO_COLUMN_BOX = `DROP TABLE IF EXISTS ups_departures;
CREATE TABLE ups_departures AS
SELECT tour_id, starts_on, seats_left FROM departures;
ALTER TABLE ups_departures ADD UNIQUE (tour_id, starts_on);

INSERT INTO ups_departures (tour_id, starts_on, seats_left) VALUES
  (1, '2026-11-20', 12),
  (1, '2026-12-25', 20)
ON CONFLICT (starts_on, tour_id) DO UPDATE SET seats_left = EXCLUDED.seats_left
RETURNING tour_id, starts_on, seats_left;

SELECT tour_id, starts_on, seats_left
FROM ups_departures
WHERE tour_id = 1
ORDER BY starts_on;`;

const EXPRESSION_BOX = `DROP TABLE IF EXISTS ups_subscribers;
CREATE TABLE ups_subscribers (
  email         text NOT NULL,
  full_name     text NOT NULL,
  subscribed_on date NOT NULL
);
CREATE UNIQUE INDEX ups_subscribers_email_lower ON ups_subscribers (lower(email));

INSERT INTO ups_subscribers VALUES ('Rahim.Uddin@mail.example', 'Rahim', '2026-10-01');

-- একই ঠিকানা, ছোট হাতে। Target এ ঠিক Index এর Expression টাই লিখতে হয়
INSERT INTO ups_subscribers VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', '2026-11-01')
ON CONFLICT (lower(email)) DO UPDATE SET full_name = EXCLUDED.full_name
RETURNING email, full_name, subscribed_on;

-- Expression বাদ দিয়ে শুধু Column লিখলে?
INSERT INTO ups_subscribers VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', '2026-11-01')
ON CONFLICT (email) DO NOTHING;`;

const PARTIAL_BOX = `DROP TABLE IF EXISTS ups_members;
CREATE TABLE ups_members (
  member_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  full_name  text NOT NULL,
  deleted_at timestamptz
);
-- শুধু জীবিত Row গুলোর মধ্যে Email একবারই
CREATE UNIQUE INDEX ups_members_live_email ON ups_members (email)
WHERE deleted_at IS NULL;

INSERT INTO ups_members (email, full_name, deleted_at) VALUES
  ('rahim.uddin@mail.example', 'Rahim Uddin', '2026-06-01 10:00+06'),
  ('rahim.uddin@mail.example', 'Rahim Uddin', NULL);

INSERT INTO ups_members (email, full_name)
VALUES ('rahim.uddin@mail.example', 'Rahim U.')
ON CONFLICT (email) WHERE deleted_at IS NULL
DO UPDATE SET full_name = EXCLUDED.full_name
RETURNING member_id, email, full_name, deleted_at;

-- WHERE অংশটা বাদ দিলে?
INSERT INTO ups_members (email, full_name)
VALUES ('rahim.uddin@mail.example', 'Rahim U.')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;`;

const DO_UPDATE_BOX = `${SETUP_TOURS}

INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1,  'Saint Martin Island Escape', 13000.00, true),
  (4,  'Sajek Valley Cloud Trip',     9800.00, true),
  (10, 'Kuakata Sunrise Weekend',     9000.00, true)
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
RETURNING t.tour_id, t.title, t.price_bdt;

SELECT tour_id, title, price_bdt, is_active
FROM ups_tours
ORDER BY tour_id;`;

const NULL_TRAP_BOX = `${SETUP_CUSTOMERS}

-- Booking Form এ ফোন ঘরটা ঐচ্ছিক, Rahim এবার খালি রেখেছেন
INSERT INTO ups_customers AS c (email, full_name, city)
VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', 'Dhaka')
ON CONFLICT (email) DO UPDATE
SET phone = EXCLUDED.phone, city = EXCLUDED.city
RETURNING c.email, old.phone AS phone_before, new.phone AS phone_after;

-- একই কাজ, এবার পুরনো ফোন রক্ষা করে
INSERT INTO ups_customers AS c (email, full_name, city)
VALUES ('nusrat.jahan@mail.example', 'Nusrat Jahan', 'Dhaka')
ON CONFLICT (email) DO UPDATE
SET phone = COALESCE(EXCLUDED.phone, c.phone), city = EXCLUDED.city
RETURNING c.email, old.phone AS phone_before, new.phone AS phone_after;`;

const ON_CONSTRAINT_BOX = `${SETUP_CUSTOMERS}

INSERT INTO ups_customers (email, full_name, phone, city)
VALUES ('nusrat.jahan@mail.example', 'Nusrat Jahan', '+8801000000202', 'Dhaka')
ON CONFLICT ON CONSTRAINT ups_customers_pkey
DO UPDATE SET phone = EXCLUDED.phone
RETURNING email, phone;

-- আগের বক্সের Unique Index টা Constraint না, শুধু Index
DROP TABLE IF EXISTS ups_subscribers;
CREATE TABLE ups_subscribers (email text NOT NULL, full_name text NOT NULL, subscribed_on date NOT NULL);
CREATE UNIQUE INDEX ups_subscribers_email_lower ON ups_subscribers (lower(email));

INSERT INTO ups_subscribers VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', '2026-11-01')
ON CONFLICT ON CONSTRAINT ups_subscribers_email_lower DO NOTHING;`;

const WHERE_CHANGED_BOX = `${SETUP_TOURS}

INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1,  'Saint Martin Island Escape', 13000.00, true),
  (2,  'Cox''s Bazar Beach Weekend',  8500.00, true),
  (10, 'Kuakata Sunrise Weekend',     9000.00, true)
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
WHERE t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt
RETURNING t.tour_id, t.price_bdt;`;

const INACTIVE_BOX = `${SETUP_TOURS}

-- Partner এর তালিকায় বন্ধ থাকা Luxury Stay ও আছে
INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (5, 'Bandarban Hill Trek',      14500.00, true),
  (8, 'Saint Martin Luxury Stay', 30000.00, true)
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
WHERE t.is_active
RETURNING t.tour_id, t.title, t.price_bdt, t.is_active;

SELECT tour_id, title, price_bdt, is_active
FROM ups_tours
WHERE tour_id IN (5, 8)
ORDER BY tour_id;`;

const SAME_KEY_BOX = `${SETUP_TOURS}

INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1, 'Saint Martin Island Escape', 12800.00, true),
  (1, 'Saint Martin Island Escape', 13000.00, true)
ON CONFLICT (tour_id) DO UPDATE SET price_bdt = EXCLUDED.price_bdt;`;

const DISTINCT_ON_BOX = `${SETUP_TOURS}

DROP TABLE IF EXISTS ups_price_feed;
CREATE TABLE ups_price_feed (
  tour_id     integer,
  price_bdt   numeric(10, 2),
  received_at timestamptz
);
INSERT INTO ups_price_feed VALUES
  (1, 12800.00, '2026-11-01 01:00+06'),
  (1, 13000.00, '2026-11-01 01:30+06'),
  (4,  9800.00, '2026-11-01 01:10+06');

-- প্রতিটা Tour এর শুধু সবচেয়ে নতুন Row টা পাঠানো
INSERT INTO ups_tours AS t (tour_id, price_bdt)
SELECT DISTINCT ON (tour_id) tour_id, price_bdt
FROM ups_price_feed
ORDER BY tour_id, received_at DESC
ON CONFLICT (tour_id) DO UPDATE SET price_bdt = EXCLUDED.price_bdt
RETURNING t.tour_id, t.title, t.price_bdt;`;

const COUNTER_BOX = `DROP TABLE IF EXISTS ups_tour_views;
CREATE TABLE ups_tour_views (
  tour_id       integer     NOT NULL,
  view_on       date        NOT NULL,
  views         integer     NOT NULL DEFAULT 1,
  first_seen_at timestamptz NOT NULL,
  last_seen_at  timestamptz NOT NULL,
  PRIMARY KEY (tour_id, view_on)
);

-- Saint Martin এর পাতা তিনবার খোলা হলো। তৃতীয় খবরটা দেরিতে পৌঁছাল
INSERT INTO ups_tour_views AS v (tour_id, view_on, first_seen_at, last_seen_at)
VALUES (1, '2026-11-01', '2026-11-01 09:15+06', '2026-11-01 09:15+06')
ON CONFLICT (tour_id, view_on) DO UPDATE
SET views = v.views + 1,
    last_seen_at = GREATEST(v.last_seen_at, EXCLUDED.last_seen_at);

INSERT INTO ups_tour_views AS v (tour_id, view_on, first_seen_at, last_seen_at)
VALUES (1, '2026-11-01', '2026-11-01 10:40+06', '2026-11-01 10:40+06')
ON CONFLICT (tour_id, view_on) DO UPDATE
SET views = v.views + 1,
    last_seen_at = GREATEST(v.last_seen_at, EXCLUDED.last_seen_at);

INSERT INTO ups_tour_views AS v (tour_id, view_on, first_seen_at, last_seen_at)
VALUES (1, '2026-11-01', '2026-11-01 09:50+06', '2026-11-01 09:50+06')
ON CONFLICT (tour_id, view_on) DO UPDATE
SET views = v.views + 1,
    last_seen_at = GREATEST(v.last_seen_at, EXCLUDED.last_seen_at);

SELECT tour_id, view_on, views, first_seen_at, last_seen_at
FROM ups_tour_views;`;

const BATCH_COUNTER_BOX = `DROP TABLE IF EXISTS ups_tour_views;
CREATE TABLE ups_tour_views (
  tour_id integer NOT NULL,
  view_on date    NOT NULL,
  views   integer NOT NULL,
  PRIMARY KEY (tour_id, view_on)
);
INSERT INTO ups_tour_views VALUES (1, '2026-11-01', 3), (2, '2026-11-01', 5);

-- পাঁচ মিনিটের Log, প্রতিটা Row মানে একবার পাতা খোলা
DROP TABLE IF EXISTS ups_view_log;
CREATE TABLE ups_view_log (tour_id integer NOT NULL, viewed_on date NOT NULL);
INSERT INTO ups_view_log VALUES
  (1, '2026-11-01'), (2, '2026-11-01'), (1, '2026-11-01'),
  (4, '2026-11-01'), (1, '2026-11-01'), (4, '2026-11-01');

INSERT INTO ups_tour_views AS v (tour_id, view_on, views)
SELECT tour_id, viewed_on, count(*)
FROM ups_view_log
GROUP BY tour_id, viewed_on
ON CONFLICT (tour_id, view_on) DO UPDATE
SET views = v.views + EXCLUDED.views;

SELECT tour_id, view_on, views
FROM ups_tour_views
ORDER BY tour_id;`;

const RETURNING_BOX = `${SETUP_TOURS}

INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1,  'Saint Martin Island Escape', 13000.00, true),
  (2,  'Cox''s Bazar Beach Weekend',  8500.00, true),
  (10, 'Kuakata Sunrise Weekend',     9000.00, true)
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
RETURNING t.tour_id,
          CASE WHEN old.tour_id IS NULL THEN 'inserted' ELSE 'updated' END AS what_happened,
          old.price_bdt AS old_price,
          new.price_bdt AS new_price;`;

const INSERT_OR_SELECT_BOX = `${SETUP_CUSTOMERS}

-- নতুন হলে ঢোকানো, পুরনো হলে যা আছে সেটাই ফেরত: দুটো ঠিকানা একসাথে
WITH incoming (email, full_name, city) AS (
  VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', 'Dhaka'),
         ('kona.roy@mail.example',    'Kona Roy',    'Dhaka')
),
added AS (
  INSERT INTO ups_customers (email, full_name, city)
  SELECT email, full_name, city FROM incoming
  ON CONFLICT (email) DO NOTHING
  RETURNING email, full_name
)
SELECT email, full_name, 'new' AS source FROM added
UNION ALL
SELECT c.email, c.full_name, 'existing'
FROM ups_customers AS c
JOIN incoming AS i USING (email)
ORDER BY email;`;

const MERGE_BASIC_BOX = `${SETUP_TOURS}

${PRICE_FEED}

MERGE INTO ups_tours AS t
USING ups_price_feed AS f
ON t.tour_id = f.tour_id
WHEN MATCHED AND t.price_bdt <> f.price_bdt THEN
  UPDATE SET price_bdt = f.price_bdt
WHEN NOT MATCHED THEN
  INSERT (tour_id, title, price_bdt, is_active)
  VALUES (f.tour_id, f.title, f.price_bdt, true);

SELECT tour_id, title, price_bdt, is_active
FROM ups_tours
ORDER BY tour_id;`;

const MERGE_FULL_BOX = `${SETUP_TOURS}

${PRICE_FEED}

WITH changes AS (
  MERGE INTO ups_tours AS t
  USING ups_price_feed AS f
  ON t.tour_id = f.tour_id
  WHEN MATCHED AND t.price_bdt <> f.price_bdt THEN
    UPDATE SET price_bdt = f.price_bdt
  WHEN NOT MATCHED THEN
    INSERT (tour_id, title, price_bdt, is_active)
    VALUES (f.tour_id, f.title, f.price_bdt, true)
  WHEN NOT MATCHED BY SOURCE AND t.is_active THEN
    UPDATE SET is_active = false
  RETURNING merge_action() AS action, t.tour_id,
            old.price_bdt AS old_price, new.price_bdt AS new_price,
            old.is_active AS was_active, new.is_active AS now_active
)
SELECT * FROM changes ORDER BY tour_id;`;

const MERGE_DUPLICATE_BOX = `${SETUP_TOURS}

MERGE INTO ups_tours AS t
USING (VALUES (1, 12800.00), (1, 13000.00)) AS f (tour_id, price_bdt)
ON t.tour_id = f.tour_id
WHEN MATCHED THEN UPDATE SET price_bdt = f.price_bdt;`;

const PROJECT_FEED_BOX = `${SETUP_TOURS}

${PARTNER_FEED}

SELECT tour_id, title, price_bdt, received_at
FROM ups_partner_feed
ORDER BY tour_id, received_at;`;

const PROJECT_UPSERT_BOX = `${SETUP_TOURS}

${PARTNER_FEED}

WITH latest AS (
  SELECT DISTINCT ON (tour_id) tour_id, title, price_bdt
  FROM ups_partner_feed
  ORDER BY tour_id, received_at DESC
),
applied AS (
  INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active)
  SELECT tour_id, title, price_bdt, true FROM latest
  ON CONFLICT (tour_id) DO UPDATE
  SET price_bdt = EXCLUDED.price_bdt
  WHERE t.is_active
    AND t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt
  RETURNING t.tour_id, t.title,
            CASE WHEN old.tour_id IS NULL THEN 'new tour' ELSE 'price changed' END AS change,
            old.price_bdt AS old_price, new.price_bdt AS new_price
)
SELECT * FROM applied ORDER BY tour_id;`;

const PROJECT_CHECK_BOX = `${SETUP_TOURS}

${PARTNER_FEED}

-- আগের বক্সের পুরো কাজ আবার, তারপর ফলাফল যাচাই
WITH latest AS (
  SELECT DISTINCT ON (tour_id) tour_id, title, price_bdt
  FROM ups_partner_feed
  ORDER BY tour_id, received_at DESC
)
INSERT INTO ups_tours AS t (tour_id, title, price_bdt, is_active)
SELECT tour_id, title, price_bdt, true FROM latest
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
WHERE t.is_active
  AND t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt;

SELECT t.tour_id, t.title, t.price_bdt AS now_bdt, o.price_bdt AS before_bdt,
       t.price_bdt - coalesce(o.price_bdt, 0) AS difference
FROM ups_tours AS t
LEFT JOIN tours AS o USING (tour_id)
ORDER BY t.tour_id;`;

const AMBIGUOUS_BOX = `${SETUP_TOURS}

INSERT INTO ups_tours (tour_id, title, price_bdt, is_active)
VALUES (1, 'Saint Martin Island Escape', 13000.00, true)
ON CONFLICT (tour_id) DO UPDATE SET price_bdt = price_bdt;`;

export const upsertContent: TopicData = {
  id: "upsert",
  introduction: {
    badge: "MODULE 10 · LESSON 04",
    title: <SectionTitle>Upsert: থাকলে বদলানো, না থাকলে ঢোকানো, এক Statement এ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের তিন লেসনে আপনি তিনটা আলাদা কাজ শিখেছেন: INSERT নতুন Row ঢোকায়, UPDATE পুরনো Row বদলায়, DELETE Row মুছে ফেলে। কিন্তু
          বাস্তবের অনেক কাজ এই তিন ভাগে পরিষ্কার করে পড়ে না। Booking Form থেকে একজন Customer এর তথ্য এলো: তিনি নতুন হলে ঢোকাতে হবে, পুরনো
          হলে ফোন নম্বরটা বদলাতে হবে। Partner কোম্পানি রাতে দামের তালিকা পাঠাল: কিছু ট্যুর আগে থেকেই আছে, কিছু একদম নতুন। আগে থেকে জানা
          নেই কোন Row কোন দলে।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজের নাম Upsert, মানে UPDATE আর INSERT মিলিয়ে একটা শব্দ। শুনতে সহজ লাগে: আগে খুঁজে দেখা, তারপর সিদ্ধান্ত। কিন্তু ঠিক
          এই সহজ পথটাই সবচেয়ে বেশি ভাঙে, কারণ একই মুহূর্তে দুটো অনুরোধ এলে দুজনেই খুঁজে কিছু পায় না, আর দুজনেই ঢোকাতে যায়। এই লেসনে আপনি
          দেখবেন সেটা কেন ঘটে, আর PostgreSQL কীভাবে এই সিদ্ধান্তটা নিজের হাতে নিয়ে এক Statement এ নিরাপদে সেরে ফেলে।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি INSERT ... ON CONFLICT এর প্রতিটা অংশ লিখতে পারবেন: DO NOTHING, DO UPDATE, EXCLUDED, Conflict Target, ON
          CONSTRAINT, DO UPDATE এর WHERE, আর RETURNING দিয়ে কোন Row নতুন আর কোনটা বদলানো সেটা জানা। শিখবেন MERGE, যেটা একটা পুরো তালিকা
          দিয়ে আরেকটা Table মিলিয়ে নেয়, আর জানবেন কখন কোনটা বাছবেন। শেষে MySQL এর ON DUPLICATE KEY UPDATE, INSERT IGNORE আর REPLACE INTO,
          সাথে REPLACE এর সেই লুকোনো বিপদ, যেটা না জানলে একদিন সম্পর্কিত Data চুপচাপ মুছে যায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনি শুধু বলে দিন কোন Column দিয়ে একই জিনিস চেনা যায়, আর মিললে কী করতে হবে। খোঁজা, সিদ্ধান্ত নেওয়া আর লেখা, তিনটাই আমি এক নিঃশ্বাসে করি, পাশের জানালায় কে কী করছে তা দেখে।",
      author: "ON CONFLICT",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুইবার চাপা Book বোতাম আর একটা ভাঙা পাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, Island Tours এর সাপ্তাহিক মিটিং। Developer তানিম গত সপ্তাহের দুটো ঘটনা নিয়ে এসেছেন। প্রথমটা ঈদের
                অফারের রাতের। Rangpur থেকে Jui Sarker ধীর Mobile Internet এ Booking করছিলেন। পাতা আটকে আছে ভেবে তিনি আরেকটা Tab খুলে আবার
                Book চাপলেন। দুটো অনুরোধ প্রায় একই সাথে API Server এ পৌঁছাল।
              </ContentParagraph>
              <ContentParagraph>
                API এর Code সহজ: আগে Email দিয়ে Customer খোঁজা, না পেলে নতুন Customer ঢোকানো, তারপর Booking বানানো। দুটো অনুরোধই খুঁজে
                দেখল, দুটোই কাউকে পেল না, কারণ প্রথমটার INSERT তখনো শেষ হয়নি। দুটোই INSERT করতে গেল। প্রথমটা সফল, দ্বিতীয়টা পেল একটা
                Error, আর Jui এর পর্দায় এলো একটা লাল ভাঙা পাতা। তিনি ধরে নিলেন Booking হয়নি, আর পরদিন অন্য একটা ট্যুর কোম্পানিতে চলে গেলেন।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় ঘটনাটা প্রতিরাতের। Partner কোম্পানি রাত দুটোয় দামের একটা তালিকা পাঠায়। তানিমের Script তালিকার প্রতিটা ট্যুরের জন্য
                আগে একটা SELECT চালায়, তারপর হয় UPDATE নয় INSERT। নয়টা ট্যুরের জন্য আঠারোটা Query, একটা একটা করে। একরাতে মাঝপথে Server
                Restart হলো, আর সকালে দেখা গেল অর্ধেক ট্যুরের দাম নতুন, অর্ধেকের পুরনো। নিচের বক্সে প্রথম ঘটনাটা হুবহু সাজানো আছে, Sample
                Database এর customers এর একটা Copy তে। চালিয়ে দেখুন দ্বিতীয় Tab এর অনুরোধ কী পায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই অনুরোধ দুইবার"
              query={DOUBLE_CLICK_BOX}
              caption={`প্রথম INSERT সফল, বক্সে লেখা আসে INSERT 1। দ্বিতীয়টায় ERROR: duplicate key value violates unique constraint "ups_customers_pkey", DETAIL এ Key (email)=(jui.sarker@mail.example) already exists। এই Error টাই Jui এর পর্দায় ভাঙা পাতা হয়ে এসেছিল। লক্ষ করুন, Data কিন্তু ঠিক আছে: Primary Key একই Email দুইবার ঢুকতে দেয়নি। সমস্যা হলো App টা জানত না এরপর কী করতে হবে।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই দুটো অনুরোধ, শুধু প্রতিটা INSERT এর শেষে এক লাইন বেশি:{" "}
              <code className={CODE}>ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone</code>। লাইনটার মানে এখনই পুরোটা বুঝতে হবে না,
              পুরো লেসন জুড়ে একটা একটা করে খুলবেন। আপাতত এভাবে পড়ুন: &quot;email নিয়ে সংঘর্ষ হলে Error আসবে না, বরং পুরনো Row এর ফোনটা
              নতুন অনুরোধের ফোন দিয়ে বদলে যাবে।&quot;
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই অনুরোধ, এবার ON CONFLICT সহ"
              query={FIXED_BOX}
              caption="দুটো INSERT ই সফল, দুইবারই INSERT 1। প্রথমবার Jui নতুন, তাই সাধারণ INSERT। দ্বিতীয়বার Email মিলে গেল, তাই Error এর বদলে পুরনো Row এর ফোন বদলাল (এখানে একই নম্বর, তাই দেখতে কিছুই বদলায়নি)। শেষ SELECT এ Jui একবারই আছেন। App কে আর কিছু খুঁজতে হয়নি, কোনো Error ও ধরতে হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Upsert শব্দটা কোথা থেকে",
          content: (
            <ContentParagraph>
              Upsert কোনো SQL Keyword না, এটা UPDATE আর INSERT জোড়া লাগিয়ে বানানো একটা ডাকনাম। PostgreSQL এর INSERT এর Documentation
              নিজেই এই নামটা ব্যবহার করে: ON CONFLICT DO UPDATE নিশ্চিত করে যে প্রতিটা Row হয় ঢুকবে নয় বদলাবে, অনেক Session একসাথে চললেও।
              এই সুবিধা PostgreSQL এ এসেছে 9.5 Version এ, 2016 সালের জানুয়ারিতে। MySQL এ একই কাজের নাম ON DUPLICATE KEY UPDATE, আর SQL
              Standard এর নাম MERGE। তিনটাই এই লেসনে আছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-upsert-means",
      subHeader: { index: "002", title: "What Upsert Means" },
      title: <SectionTitle>আগে খুঁজে তারপর সিদ্ধান্ত: কেন এই সহজ পথ ভাঙে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রেলস্টেশনের টিকিট কাউন্টারের কথা ভাবুন, যেখানে শেষ একটা সিট বাকি। দুটো জানালায় দুজন কর্মী বসে আছেন। দুজন যাত্রী একই
                মুহূর্তে দুই জানালায় এসে সেই সিটটা চাইলেন। দুই কর্মীই খাতা দেখলেন: সিট খালি। দুজনেই টিকিট লিখে দিলেন। ট্রেনে উঠে দুই যাত্রী
                একই সিটের সামনে দাঁড়িয়ে। দোষটা কারো একার না: দেখা আর লেখার মাঝখানে একটা ফাঁক ছিল, আর সেই ফাঁকে অন্যজন ঢুকে পড়েছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                Upsert এর প্রতিটা পুরনো কৌশলে এই ফাঁকটা থাকে। Developer রা সাধারণত তিনটা পথ ধরেন, আর প্রতিটার নিজের দুর্বলতা আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আগে SELECT, তারপর সিদ্ধান্ত।</strong> খুঁজে না পেলে INSERT, পেলে UPDATE। একা চললে নিখুঁত। কিন্তু দুটো অনুরোধ একসাথে
                  এলে দুজনেই খুঁজে কিছু পায় না, কারণ অন্যজনের INSERT তখনো COMMIT হয়নি, আর COMMIT না হওয়া Row অন্য কেউ দেখতে পায় না। দুজনেই
                  INSERT করে, একজন 23505 Error পায়। Jui এর ঘটনা ঠিক এটাই।
                </ListItem>
                <ListItem>
                  <strong>আগে INSERT, Error এলে UPDATE।</strong> সংঘর্ষ হলে Error ধরে UPDATE চালানো। কাজ করে, কিন্তু একটা Transaction এর
                  ভেতরে একটা Error পুরো Transaction কে বাতিল অবস্থায় ফেলে দেয় (SQLSTATE 25P02, পরের সব Statement অগ্রাহ্য), তাই প্রতিটা
                  INSERT এর আগে একটা SAVEPOINT লাগে। প্রতিটা সংঘর্ষ Server এর Log এ একটা ERROR লাইন রেখে যায়, আর সত্যিকারের Error গুলো সেই
                  ভিড়ে হারিয়ে যায়।
                </ListItem>
                <ListItem>
                  <strong>আগে UPDATE, কিছু না বদলালে INSERT।</strong> UPDATE এর Row Count 0 হলে INSERT। এটাও একা চললে ঠিক, একসাথে চললে
                  ভাঙে: দুজনেরই UPDATE কিছু খুঁজে পায় না (Row টা তখনো নেই), দুজনেই INSERT করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CheckThenInsertRaceDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় কৌশলটা PostgreSQL 9.5 এর আগে অনেকে এক Statement এই লিখতেন, একটা Data বদলানো CTE দিয়ে (
              <Link href="/sql/topic/ctes" className={LINK}>
                CTE
              </Link>{" "}
              এর লেসনে এর নাম শুনেছিলেন): WITH এর ভেতরে UPDATE ... RETURNING, তারপর বাইরে INSERT ... WHERE NOT EXISTS। এখনো অনেক পুরনো
              Codebase এ এটা দেখবেন, তাই একবার চালিয়ে চিনে রাখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো কৌশল: আগে UPDATE, তারপর দরকার হলে INSERT"
              query={OLD_TRICK_BOX}
              caption="বক্সে INSERT 0, কারণ Tanvir আগে থেকেই ছিলেন: ভেতরের UPDATE তাঁর ফোন বদলে দিয়েছে, তাই NOT EXISTS মিথ্যা হয়ে INSERT কিছুই ঢোকায়নি। শেষ SELECT এ ফোন +8801000000303। email টা বদলে নতুন কারো ঠিকানা দিন: তখন UPDATE কাউকে পাবে না আর INSERT একটা Row ঢোকাবে। এক Session এ নিখুঁত, কিন্তু দুটো Session একসাথে নতুন একই Email পাঠালে দুজনেরই UPDATE খালি হাতে ফেরে আর দুজনেই INSERT করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সিদ্ধান্তটা কেন Database কে নিতে হয়",
          content: (
            <ContentParagraph>
              একই Email দুইবার আছে কিনা, সেটা নিশ্চিত করে জানে শুধু একটা জিনিস: Unique Index। প্রতিটা নতুন Row ঢোকার সময় PostgreSQL সেই
              Index এ জায়গা খোঁজে, আর অন্য কেউ একই জায়গায় তখনো COMMIT না হওয়া একটা Row রেখে থাকলে অপেক্ষা করে, যতক্ষণ না সেই Transaction
              শেষ হয়। ON CONFLICT ঠিক এই মুহূর্তটাকে কাজে লাগায়: অপেক্ষা শেষে মিল পেলে Error না দিয়ে আপনার বলা বিকল্প কাজটা করে। খোঁজা আর
              লেখার মাঝে কোনো ফাঁক থাকে না, কারণ দুটোই একই জায়গায়, একই মুহূর্তে ঘটে। App এর Code কখনো এটা নিজে নিজে করতে পারে না, কারণ App
              অন্য Connection এর অসমাপ্ত কাজ দেখতেই পায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "on-conflict-do-nothing",
      subHeader: { index: "003", title: "ON CONFLICT DO NOTHING" },
      title: <SectionTitle>DO NOTHING: আগে থেকে থাকলে চুপচাপ বাদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ON CONFLICT এর সবচেয়ে সরল রূপ দিয়ে শুরু করা যাক। একটা বিয়েবাড়ির অতিথি তালিকা ভাবুন। দরজায় একজন দাঁড়িয়ে নাম লিখছেন। কেউ
                দ্বিতীয়বার বাইরে গিয়ে আবার ঢুকলে তিনি তাঁর নাম আবার লেখেন না, আবার তাঁকে ফিরিয়েও দেন না, শুধু মাথা নেড়ে ভেতরে যেতে দেন।
                DO NOTHING ঠিক এই কাজটা করে: Row টা আগে থেকে থাকলে নতুনটা বাদ, কোনো Error ছাড়া। গঠনটা এরকম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "do-nothing-shape.sql",
          code: `INSERT INTO table_name (column, ...)
VALUES (...), (...)
ON CONFLICT (conflict_column, ...)   -- কোন Unique নিয়মে মিল খুঁজবেন
DO NOTHING                           -- মিললে Row টা বাদ
RETURNING ...;                       -- ঐচ্ছিক: শুধু যারা সত্যিই ঢুকল`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Website এ একটা Newsletter এর Form আছে। চারজন নাম লিখলেন: Rahim আগে থেকেই Customer, Jui আর Kona নতুন, আর Jui
              ভুল করে দুইবার Submit করেছেন। সবগুলো একটা INSERT এ পাঠানো হলো। চালিয়ে দেখুন কে ঢুকল আর কে বাদ পড়ল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Newsletter এর তালিকা, DO NOTHING দিয়ে"
              query={DO_NOTHING_BOX}
              caption="RETURNING এ মাত্র দুটো Row: jui.sarker আর kona.roy। Rahim আগে থেকেই ছিলেন, তাই বাদ। Jui এর দ্বিতীয় Row ও বাদ, কারণ একই Statement এ প্রথম Jui ঢুকে যাওয়ার পরে দ্বিতীয়টা তার সাথে সংঘর্ষ করেছে। Customer এর সংখ্যা 15 থেকে 17। RETURNING থাকলে বক্স Command Tag এর বদলে ফেরত আসা Table টাই দেখায়, (2 rows)। psql এ সেই Table এর নিচে Command Tag ও আসত, INSERT 0 2: দুটোই বলে দুটো Row ঢুকেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই বক্স থেকে তিনটা কথা মনে রাখুন। প্রথমত, RETURNING শুধু সেই Row গুলো ফেরত দেয়, যারা সত্যিই ঢুকেছে, বাদ পড়াগুলো না। তাই
                RETURNING এর Row গুনে App বুঝতে পারে কতজন নতুন। দ্বিতীয়ত, Command Tag এর সংখ্যাটাও শুধু ঢোকানো Row গোনে। তৃতীয়ত, একই
                Statement এর ভেতরে দুইবার আসা একই মান DO NOTHING ঠিকঠাক সামলায়: প্রথমটা ঢোকে, দ্বিতীয়টা তার সাথে মিলে বাদ পড়ে। পরে দেখবেন,
                DO UPDATE এর বেলায় ঠিক এই জায়গায় Error আসে।
              </ContentParagraph>
              <ContentParagraph>
                Conflict Target বাদ দিয়ে শুধু <code className={CODE}>ON CONFLICT DO NOTHING</code> ও লেখা যায়। তখন PostgreSQL Table এর যেকোনো
                Unique নিয়মে সংঘর্ষ হলেই Row টা বাদ দেয়: Primary Key, UNIQUE, এমনকি পরের মডিউলের Exclusion Constraint ও। সুবিধা আছে, কিন্তু
                সাবধানও থাকতে হয়, কারণ যে নিয়মের কথা আপনি ভাবেননি, সেটা ভাঙলেও Row চুপচাপ হারিয়ে যাবে। নিচের বক্সে আসল customers Table এ,
                একটা BEGIN ... ROLLBACK এর ভেতরে, Target ছাড়া DO NOTHING চালানো হয়েছে। সাথে একটা অপ্রত্যাশিত জিনিস দেখুন: বাদ পড়া Row ও
                একটা নম্বর খেয়ে ফেলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাদ পড়া Row ও একটা ID খরচ করে"
              query={IDENTITY_BURN_BOX}
              caption="প্রথম INSERT বাদ পড়েছে (বক্সে INSERT 0)। তবু Jui পেলেন customer_id 17, 16 না। Identity Column এর পরের নম্বরটা নেওয়া হয় মিল খোঁজার আগেই, আর Rahim এর বাদ পড়া Row টা 16 নিয়ে ফেলেছিল। শেষে ROLLBACK, তাই customers আবার আগের মতো 15 জন। কিন্তু Sequence ROLLBACK এ ফেরে না: বক্সটা আবার চালালে Jui পাবেন 19, তারপর 21।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "DO NOTHING সব Error ঢাকে না",
          content: (
            <ContentParagraph>
              DO NOTHING শুধু Unique আর Exclusion নিয়মের সংঘর্ষ সামলায়। একই INSERT এ দাম ঋণাত্মক হলে CHECK এর 23514, Primary Key খালি হলে
              23502, ভুল Foreign Key হলে 23503, এগুলো আগের মতোই Error দেয় আর পুরো Statement বাতিল করে। এটা ভালো খবর: ON CONFLICT ভুল Data কে
              লুকায় না, শুধু &quot;এটা আগে থেকেই আছে&quot; পরিস্থিতিটা সামলায়। নম্বর খরচ হওয়ার ব্যাপারটা{" "}
              <Link href="/sql/topic/primary-keys" className={LINK}>
                Primary Keys
              </Link>{" "}
              লেসনের Sequence এর ফাঁকের আলোচনার সাথে মিলিয়ে নিন: ID তে ফাঁক থাকা স্বাভাবিক, ফাঁক দেখে ভয় পাবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ex1_destinations;
CREATE TABLE ups_ex1_destinations AS
SELECT name, region, kind FROM destinations;
ALTER TABLE ups_ex1_destinations ADD PRIMARY KEY (name);

-- এই INSERT এর শেষে কিছু যোগ করুন, যাতে আগে থেকে থাকা নাম চুপচাপ বাদ পড়ে
INSERT INTO ups_ex1_destinations (name, region, kind) VALUES
  ('Sajek Valley', 'Chattogram', 'hills'),
  ('Tanguar Haor', 'Sylhet', 'wetland'),
  ('Kuakata', 'Barishal', 'beach'),
  ('Paharpur', 'Rajshahi', 'heritage');

-- নিচের Query টা বদলাবেন না
SELECT name, region, kind FROM ups_ex1_destinations ORDER BY name;`}
              task={
                <>
                  একজন সহকর্মী চারটা নতুন গন্তব্যের তালিকা পাঠিয়েছেন, কিন্তু তার দুটো (Sajek Valley আর Kuakata) আগে থেকেই আছে। Starter
                  এর INSERT টা এখন চালালে 23505 Error আসে। INSERT এর শেষে এমন একটা অংশ যোগ করুন, যাতে আগে থেকে থাকা নাম বাদ পড়ে আর নতুন
                  দুটো ঢোকে, কোনো Error ছাড়া। শেষের SELECT টা রেখে দিন: ঠিক হলে 9টা গন্তব্য, নাম অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  সেমিকোলনের ঠিক আগে <code className={CODE}>ON CONFLICT (name) DO NOTHING</code>। এখানে name ই Primary Key, তাই Target
                  বাদ দিয়ে শুধু <code className={CODE}>ON CONFLICT DO NOTHING</code> লিখলেও চলবে।
                </>
              }
              solution={`SELECT name, region, kind FROM destinations
UNION ALL
VALUES ('Tanguar Haor', 'Sylhet', 'wetland'), ('Paharpur', 'Rajshahi', 'heritage')
ORDER BY name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "conflict-target",
      subHeader: { index: "004", title: "The Conflict Target" },
      title: <SectionTitle>Conflict Target: কোন নিয়মে মিল খুঁজবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>ON CONFLICT (email)</code> এর বন্ধনীর অংশটার নাম Conflict Target। এটা দিয়ে আপনি PostgreSQL কে বলেন,
                &quot;মিল খুঁজবে এই Column গুলোর Unique নিয়মে।&quot; একটা গুরুত্বপূর্ণ কথা: Target কোনো ইচ্ছামতো শর্ত না। PostgreSQL এই
                Column এর তালিকা দেখে Table এর Unique Index গুলোর মধ্যে ঠিক সেই Column দিয়ে বানানো একটা Index খুঁজে বের করে। Documentation
                এই কাজকে বলে Inference, আর বেছে নেওয়া Index টাকে বলে Arbiter Index, মানে সালিশ। মিল খোঁজা হয় শুধু সেই Index এ।
              </ContentParagraph>
              <ContentParagraph>
                এর মানে, Target এর Column গুলো দিয়ে কোনো Unique Index বা Unique Constraint না থাকলে PostgreSQL আপনার কথা মানতে পারে না।
                Customer এর নাম দিয়ে মিল খোঁজার চেষ্টা করে দেখুন। full_name এর উপর কোনো Unique নিয়ম নেই, আর থাকা উচিতও না, কারণ একই নামের
                দুজন মানুষ থাকতেই পারেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Unique নিয়ম নেই এমন Column এ Target"
              query={NO_INDEX_BOX}
              caption="ERROR: there is no unique or exclusion constraint matching the ON CONFLICT specification, SQLSTATE 42P10। PostgreSQL full_name দিয়ে বানানো কোনো Unique Index খুঁজে পায়নি, তাই কোথায় মিল খুঁজবে সেটাই ঠিক করতে পারেনি। Target বদলে (email) করুন: তখন Rahim বাদ পড়বেন, Error ছাড়া।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpsertPathsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>একাধিক Column এর Target।</strong> একটা Departure চেনা যায় ট্যুর আর শুরুর তারিখের জোড়া দিয়ে। Table এ{" "}
                <code className={CODE}>UNIQUE (tour_id, starts_on)</code> থাকলে Target এ দুটো Column ই লিখতে হয়। Documentation বলে Column এর
                ক্রম এখানে কোনো ব্যাপার না: Index টা (tour_id, starts_on) হলেও Target (starts_on, tour_id) লিখলে একই Index বাছা হয়। নিচের বক্সে
                ইচ্ছা করেই উল্টো ক্রমে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Column এর Target, উল্টো ক্রমে"
              query={TWO_COLUMN_BOX}
              caption="RETURNING এ দুটো Row: 20 November এর Departure আগে থেকেই ছিল, তার seats_left 14 থেকে 12 হলো। 25 December নতুন, ঢুকল 20 সিট নিয়ে। শেষ SELECT এ Tour 1 এর পাঁচটা Departure, তারিখ অনুযায়ী। Target এর Column এর ক্রম উল্টো হলেও PostgreSQL ঠিক Index টাই খুঁজে পেয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>Expression দিয়ে বানানো Index।</strong> Email এ বড় ছোট হাতের পার্থক্য সাধারণত মানা হয় না: Rahim.Uddin আর rahim.uddin
              একই মানুষ। এর একটা প্রচলিত সমাধান হলো <code className={CODE}>lower(email)</code> এর উপর Unique Index (Index এর এই রূপটা Module
              13 এর{" "}
              <Link href="/sql/topic/partial-expression-covering" className={LINK}>
                Partial, Expression আর Covering Index
              </Link>{" "}
              লেসনে বিস্তারিত)। তখন Target এও হুবহু সেই Expression টা লিখতে হয়, বন্ধনী সহ। শুধু Column এর নাম দিলে PostgreSQL মিল খুঁজে পায়
              না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="lower(email) এর Index আর তার Target"
              query={EXPRESSION_BOX}
              caption="প্রথম ON CONFLICT ঠিকঠাক: rahim.uddin আর Rahim.Uddin একই ধরা হলো, পুরনো Row এর নাম বদলে Rahim Uddin হলো। লক্ষ করুন email আর subscribed_on বদলায়নি, কারণ SET এ শুধু full_name। শেষ Statement এ শুধু (email) লেখা, আর এসেছে সেই 42P10 Error: email Column এর উপর সরাসরি কোনো Unique Index নেই, আছে lower(email) এর উপর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>Partial Index, মানে কিছু Row এর উপর Unique নিয়ম।</strong> পরের লেসনের{" "}
              <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                Soft Delete
              </Link>{" "}
              Pattern এ মুছে ফেলা Customer আসলে Table এই থাকেন, শুধু deleted_at এ একটা সময় বসে। তখন একই Email একবার মুছে ফেলা আর একবার জীবিত
              থাকতে পারে, তাই Unique নিয়মটা লাগাতে হয় শুধু জীবিত Row এর উপর:{" "}
              <code className={CODE}>CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL</code>। এমন Index কে Target হিসেবে বাছতে হলে Target এর
              পরে সেই একই WHERE লিখতে হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Partial Unique Index আর Target এর WHERE"
              query={PARTIAL_BOX}
              caption="শুরুতে দুটো Rahim: একজন June এ মুছে ফেলা, একজন জীবিত। Target এর পরে WHERE deleted_at IS NULL লেখায় PostgreSQL ঠিক Partial Index টা বাছল, আর বদলাল শুধু জীবিত Rahim কে (member_id 2), মুছে ফেলা Row ছুঁয়েও দেখেনি। শেষ Statement এ WHERE বাদ, আর আবার 42P10: শর্ত ছাড়া Target এর সাথে কোনো পুরো Table এর Unique Index মেলে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Table এ যে Unique নিয়ম আছে", "ঠিক Target", "যা লিখলে 42P10"],
          rows: [
            ["PRIMARY KEY (email)", "ON CONFLICT (email)", "ON CONFLICT (full_name)"],
            ["UNIQUE (tour_id, starts_on)", "(tour_id, starts_on) বা (starts_on, tour_id)", "(tour_id), শুধু একটা Column"],
            ["UNIQUE INDEX ON (lower(email))", "ON CONFLICT (lower(email))", "ON CONFLICT (email)"],
            ["UNIQUE INDEX ON (email) WHERE deleted_at IS NULL", "ON CONFLICT (email) WHERE deleted_at IS NULL", "ON CONFLICT (email)"],
            ["যেকোনো একটা, আর কাজ DO NOTHING", "Target ছাড়া ON CONFLICT DO NOTHING", "Target ছাড়া DO UPDATE (42601)"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "DO UPDATE এ Target বাধ্যতামূলক",
          content: (
            <ContentParagraph>
              DO NOTHING এ Target ঐচ্ছিক, কিন্তু DO UPDATE এ বাধ্যতামূলক। Target ছাড়া{" "}
              <code className={CODE}>ON CONFLICT DO UPDATE SET ...</code> লিখলে PostgreSQL বলে ON CONFLICT DO UPDATE requires inference
              specification or constraint name, সাথে HINT: For example, ON CONFLICT (column_name)। কারণটা যুক্তিসঙ্গত: কোন Row টা বদলাবে,
              সেটা ঠিক করতে PostgreSQL কে জানতে হবে কোন নিয়মের সংঘর্ষের কথা হচ্ছে। আরেকটা নিয়ম: Documentation অনুযায়ী Arbiter হতে পারে শুধু
              NOT DEFERRABLE Constraint আর Unique Index, তাই{" "}
              <Link href="/sql/topic/basic-constraints" className={LINK}>
                Basic Constraints
              </Link>{" "}
              লেসনে দেখা UNIQUE DEFERRABLE কে Target বানালে PostgreSQL বলে ON CONFLICT does not support deferrable unique
              constraints/exclusion constraints as arbiters।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "do-update-excluded",
      subHeader: { index: "005", title: "DO UPDATE and EXCLUDED" },
      title: <SectionTitle>DO UPDATE আর EXCLUDED: প্রত্যাখ্যাত Row এর মান পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DO NOTHING নতুন তথ্য ফেলে দেয়। বেশিরভাগ সময় আপনি সেটা চান না: Partner নতুন দাম পাঠিয়েছে, পুরনো Row এ সেটা বসাতে হবে। এর জন্য
                DO UPDATE SET, যেটা দেখতে প্রায় সাধারণ UPDATE এর মতো, শুধু WHERE লেখার দরকার নেই: কোন Row বদলাবে সেটা Conflict নিজেই ঠিক করে
                দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্ন হলো, SET এর ডান পাশে নতুন দামটা পাবেন কোথায়? INSERT এর VALUES এ যা লিখেছিলেন, সেটা তো ঢুকতে পারেনি। PostgreSQL সেই
                প্রত্যাখ্যাত Row টাকে একটা বিশেষ নামে আপনার হাতে দেয়: <code className={CODE}>EXCLUDED</code>, মানে যাকে বাদ দেওয়া হয়েছে।
                অফিসের ভাষায় ভাবুন: আপনার টেবিলে পুরনো ফাইলটা খোলা আছে, আর পাশে রাখা আছে নতুন আবেদনপত্র, যেটা ফাইলে ঢোকানো যায়নি কারণ একই
                নামের ফাইল আগেই আছে। আপনি আবেদনপত্র থেকে যা দরকার তা পুরনো ফাইলে তুলে নেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ExcludedSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরনো Row টাকে ডাকা হয় Table এর নাম দিয়ে, অথবা <code className={CODE}>INSERT INTO ups_tours AS t</code> লিখে দেওয়া Alias দিয়ে।
              নতুন প্রস্তাবটা সবসময় EXCLUDED। নিচের বক্সে Partner এর তিন লাইনের দামের তালিকা: দুটো পুরনো ট্যুরের নতুন দাম আর একটা নতুন ট্যুর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন দাম EXCLUDED থেকে"
              query={DO_UPDATE_BOX}
              caption="RETURNING এ তিনটা Row, সবগুলোর নতুন চেহারা: Saint Martin 12500.00 থেকে 13000.00, Sajek 9500.00 থেকে 9800.00, আর Kuakata নতুন ঢুকল 9000.00 এ। psql এ এর নিচে Command Tag আসত INSERT 0 3, কারণ সেটা ঢোকানো আর বদলানো দুটোই গোনে। পুরো Table এ এখন দশটা ট্যুর। title আর is_active বদলায়নি, কারণ SET এ শুধু price_bdt।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SET এ দুই Row একসাথেও পড়া যায়, কারণ দুটোই হাতের কাছে আছে: <code className={CODE}>price_bdt = EXCLUDED.price_bdt</code>{" "}
                নতুন মান বসায়, <code className={CODE}>price_bdt = t.price_bdt + 500</code> পুরনো মানের উপর হিসাব করে, আর{" "}
                <code className={CODE}>(price_bdt, title) = (EXCLUDED.price_bdt, EXCLUDED.title)</code> একবারে কয়েকটা Column বসায়। SET এ যে
                Column এর নাম নেই, তার মান আগের মতোই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                এখন একটা ফাঁদ, যেটা বাস্তবে প্রায় প্রতিটা দলই একবার ধরা খায়। INSERT এর Column এর তালিকায় যে Column নেই, EXCLUDED এ তার মান
                কী? উত্তর: সেই Column এর DEFAULT, যা না থাকলে NULL। Documentation এও বলা আছে, BEFORE INSERT Trigger যদি কোনো মান বদলায়, সেটাও
                EXCLUDED এ দেখা যায়, কারণ EXCLUDED হলো সেই Row যেটা ঢুকতে চেয়েছিল, ঠিক যেমনটা ঢুকত। তাই Booking Form এ কেউ ফোনের ঘর খালি
                রাখলে আর SET এ লেখা থাকলে <code className={CODE}>phone = EXCLUDED.phone</code>, পুরনো ফোন নম্বরটা মুছে NULL বসে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি ঘর পুরনো তথ্য মুছে দেয়"
              query={NULL_TRAP_BOX}
              caption="প্রথম Statement এ Rahim এর phone_before +8801000000101, phone_after খালি, মানে NULL: Form এর খালি ঘর তাঁর আসল নম্বর মুছে দিয়েছে। দ্বিতীয়টায় COALESCE(EXCLUDED.phone, c.phone): নতুন মান NULL হলে পুরনোটাই থাকবে। Nusrat এর ফোন আগে পরে একই, +8801000000102। RETURNING এর old আর new এর বিস্তারিত আলোচনা অংশ 010 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "SET এর ডান পাশে নাম অস্পষ্ট হলে",
          content: (
            <ContentParagraph>
              DO UPDATE SET এর ডান পাশে দুটো Row একসাথে দেখা যায়: পুরনো Row আর EXCLUDED। তাই শুধু <code className={CODE}>price_bdt</code>{" "}
              লিখলে PostgreSQL বুঝতে পারে না কোনটার কথা হচ্ছে, আর বলে column reference &quot;price_bdt&quot; is ambiguous (42702)। সবসময়
              পরিষ্কার করে লিখুন: হয় EXCLUDED.price_bdt, নয় t.price_bdt। আর Table এ Alias দিলে পুরো নাম আর চলে না, শুধু Alias: AS t লিখে
              ups_tours.price_bdt লিখলে PostgreSQL বলে invalid reference to FROM-clause entry, সাথে HINT এ Alias এর নাম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ex2_tours;
CREATE TABLE ups_ex2_tours AS
SELECT tour_id, title, price_bdt FROM tours;
ALTER TABLE ups_ex2_tours ADD PRIMARY KEY (tour_id);

-- Partner এর নতুন দামের তালিকা। INSERT এর শেষে ON CONFLICT যোগ করুন
INSERT INTO ups_ex2_tours (tour_id, title, price_bdt) VALUES
  (2, 'Cox''s Bazar Beach Weekend', 9000.00),
  (6, 'Sylhet Tea Garden Tour', 8200.00),
  (10, 'Kuakata Sunrise Weekend', 9900.00);

-- নিচের Query টা বদলাবেন না
SELECT tour_id, title, price_bdt FROM ups_ex2_tours ORDER BY tour_id;`}
              task={
                <>
                  Partner তিনটা ট্যুরের দাম পাঠিয়েছে: Cox&apos;s Bazar Beach Weekend (tour 2) এর নতুন দাম 9000.00, Sylhet Tea Garden Tour
                  (tour 6) এর 8200.00, আর একদম নতুন ট্যুর Kuakata Sunrise Weekend (tour 10), 9900.00। INSERT এর শেষে এমন ON CONFLICT লিখুন, যাতে
                  পুরনো ট্যুরের দাম নতুন দামে বদলায় আর নতুন ট্যুরটা ঢোকে। ঠিক হলে শেষ SELECT এ দশটা ট্যুর।
                </>
              }
              hint={
                <>
                  Target হবে Primary Key: <code className={CODE}>ON CONFLICT (tour_id)</code>। তারপর{" "}
                  <code className={CODE}>DO UPDATE SET price_bdt = EXCLUDED.price_bdt</code>। EXCLUDED মানে VALUES এর যে Row টা ঢুকতে
                  পারেনি।
                </>
              }
              solution={`SELECT tour_id, title,
       CASE tour_id WHEN 2 THEN 9000.00 WHEN 6 THEN 8200.00 ELSE price_bdt END
FROM tours
UNION ALL
SELECT 10, 'Kuakata Sunrise Weekend', 9900.00
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "on-constraint",
      subHeader: { index: "006", title: "ON CONFLICT ON CONSTRAINT" },
      title: <SectionTitle>ON CONSTRAINT: Column এর বদলে নিয়মের নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Column এর তালিকা দিয়ে Index খুঁজিয়ে নেওয়ার বদলে আপনি সরাসরি Constraint এর নামও বলে দিতে পারেন:{" "}
                <code className={CODE}>ON CONFLICT ON CONSTRAINT ups_customers_pkey</code>।{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                লেসনে শিখেছিলেন প্রতিটা নিয়মের একটা নাম থাকে, নিজে না দিলে PostgreSQL দিয়ে দেয়। এখানে সেই নামটাই কাজে লাগছে।
              </ContentParagraph>
              <ContentParagraph>
                তবে একটা সূক্ষ্ম পার্থক্য আছে। ON CONSTRAINT শুধু Constraint এর নাম নেয়: PRIMARY KEY, UNIQUE বা EXCLUDE দিয়ে বানানো নিয়ম।
                CREATE UNIQUE INDEX দিয়ে সরাসরি বানানো Index দেখতে একই রকম কাজ করে, কিন্তু সেটা Constraint না, তাই তার নাম এখানে চলে না।
                নিচের বক্সে দুটোই চেষ্টা করা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Constraint এর নাম দিয়ে Target"
              query={ON_CONSTRAINT_BOX}
              caption={`প্রথম Statement সফল: ups_customers_pkey নামের Primary Key দিয়ে মিল খোঁজা হলো, Nusrat এর ফোন বদলে +8801000000202। শেষ Statement এ ERROR: constraint "ups_subscribers_email_lower" for table "ups_subscribers" does not exist, SQLSTATE 42704। Index টা আছে, কিন্তু Constraint হিসেবে না, তাই ON CONSTRAINT তাকে চেনে না। এখানে Target লিখতে হবে (lower(email))।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোনটা লিখবেন? PostgreSQL এর Documentation নিজেই একটা পরামর্শ দেয়: সাধারণত Column এর তালিকা দিয়ে Inference ভালো। কারণ ধরুন একদিন
              Index টা নতুন করে বানাতে হলো। Production এ প্রচলিত পথ হলো আগে একটা নতুন Index বানানো (CONCURRENTLY, Module 13 এ), তারপর পুরনোটা
              ফেলে দেওয়া। নতুন Index এর নাম আলাদা হবে। Column এর তালিকা দিয়ে লেখা Upsert তখনো ঠিকঠাক চলবে, কারণ সে Column দেখে Index খোঁজে।
              নাম ধরে লেখা Upsert ভেঙে যাবে। ON CONSTRAINT তখন কাজে আসে, যখন Column এর তালিকা দিয়ে প্রকাশ করা যায় না এমন নিয়মের কথা বলতে হয়,
              যেমন Exclusion Constraint।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Exclusion Constraint আর ON CONFLICT",
          content: (
            <ContentParagraph>
              Exclusion Constraint দুটো Row এর মধ্যে সমান না, ওভারল্যাপ ধরে, যেমন একই নৌকার দুটো Booking এর সময় একটু হলেও মিলে গেলে আটকানো (
              <Link href="/sql/topic/ranges-exclusion" className={LINK}>
                Ranges আর Exclusion
              </Link>{" "}
              লেসন, Module 15)। এমন নিয়মের সাথে DO NOTHING চলে, Target ছাড়া অথবা ON CONSTRAINT দিয়ে। কিন্তু DO UPDATE চলে না: চেষ্টা করলে
              PostgreSQL বলে ON CONFLICT DO UPDATE not supported with exclusion constraints, SQLSTATE 42809। যুক্তিটা সহজ: ওভারল্যাপ করা Row
              একাধিক হতে পারে, তাহলে কোনটা বদলাবে?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "where-on-do-update",
      subHeader: { index: "007", title: "WHERE on DO UPDATE" },
      title: <SectionTitle>DO UPDATE এর WHERE: মিল পেলেও সবসময় বদলানো না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ মিল পেলেই বদলানো হয়েছে। কিন্তু কখনো কখনো মিল পাওয়ার পরেও আপনি একটা শর্ত দেখতে চান। দামের তালিকায় Cox&apos;s Bazar এর
                দাম আগের মতোই 8500.00 থাকলে Row টা আবার লেখার কোনো মানে নেই। বন্ধ থাকা ট্যুরের দাম Partner এর তালিকা থেকে বদলানো উচিত না।
                পুরনো একটা খবর দেরিতে এসে নতুন খবরকে মুছে দেওয়া উচিত না। এর জন্য DO UPDATE SET এর পরে একটা WHERE বসে।
              </ContentParagraph>
              <ContentParagraph>
                এই WHERE সাধারণ UPDATE এর WHERE এর মতো Row খোঁজে না, Row টা Conflict আগেই খুঁজে দিয়েছে। এটা শুধু শেষ অনুমতি দেয়: শর্ত সত্য হলে
                বদল, মিথ্যা হলে কিছুই না। Documentation এর ভাষায়, শর্তটা মূল্যায়ন হয় সবার শেষে, Conflict চিহ্নিত হওয়ার পরে। আর শর্ত মিথ্যা
                হলেও Row টা Lock হয়, যাতে অন্য কেউ ঠিক তখন সেটা বদলাতে না পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দাম না বদলালে Row ও না"
              query={WHERE_CHANGED_BOX}
              caption="RETURNING এ মাত্র দুটো Row: Saint Martin (দাম বদলেছে) আর Kuakata (নতুন)। Cox's Bazar এর দাম আগের মতোই 8500.00, তাই WHERE মিথ্যা: Row টা বদলায়নি, গোনায়ও আসেনি (psql এর Command Tag হতো INSERT 0 2), RETURNING এও নেই। WHERE অংশটা মুছে আবার চালান: তখন RETURNING এ তিনটা Row, Cox's Bazar সহ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শর্তে <code className={CODE}>&lt;&gt;</code> না লিখে <code className={CODE}>IS DISTINCT FROM</code> কেন? কারণ দুই পাশের যেকোনো
              একটা NULL হলে <code className={CODE}>&lt;&gt;</code> এর উত্তর অজানা, আর WHERE অজানাকে মিথ্যা ধরে। ফলে পুরনো দাম NULL থাকলে নতুন
              দাম কখনো বসত না।{" "}
              <Link href="/sql/topic/null-logic" className={LINK}>
                NULL Logic
              </Link>{" "}
              লেসনের সেই কথা: IS DISTINCT FROM দুটো NULL কে সমান আর NULL বনাম মান কে আলাদা ধরে, কখনো অজানা দেয় না। এবার দ্বিতীয় ধরনের শর্ত:
              পুরনো Row এর অবস্থা দেখে সিদ্ধান্ত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বন্ধ ট্যুরের দাম ছোঁয়া যাবে না"
              query={INACTIVE_BOX}
              caption="Bandarban চালু, তাই তার দাম 14000.00 থেকে 14500.00। Saint Martin Luxury Stay বন্ধ (is_active f), WHERE t.is_active মিথ্যা, তাই দাম আগের মতোই 32000.00, আর RETURNING এ শুধু Bandarban। লক্ষ করুন, Partner এর তালিকায় is_active true লেখা থাকলেও সেটা বসেনি, কারণ SET এ is_active নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UpsertModeLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ex3_guide_status;
CREATE TABLE ups_ex3_guide_status (
  guide_id    integer PRIMARY KEY,
  status      text NOT NULL,
  reported_at timestamptz NOT NULL
);
INSERT INTO ups_ex3_guide_status VALUES
  (1, 'on_tour',   '2026-11-01 08:00+06'),
  (2, 'available', '2026-11-01 09:30+06'),
  (3, 'on_leave',  '2026-10-31 18:00+06');

-- Mobile App থেকে আসা খবর, এলোমেলো ক্রমে। INSERT এর শেষে ON CONFLICT যোগ করুন
INSERT INTO ups_ex3_guide_status AS s (guide_id, status, reported_at) VALUES
  (1, 'available', '2026-11-01 10:15+06'),
  (2, 'on_tour',   '2026-11-01 07:45+06'),
  (3, 'on_tour',   '2026-11-01 06:30+06'),
  (5, 'available', '2026-11-01 11:00+06');

-- নিচের Query টা বদলাবেন না
SELECT guide_id, status, to_char(reported_at, 'YYYY-MM-DD HH24:MI') AS reported
FROM ups_ex3_guide_status
ORDER BY guide_id;`}
              task={
                <>
                  গাইডদের Mobile App প্রতিবার তাঁদের অবস্থা (status) আর খবরের সময় (reported_at) পাঠায়, কিন্তু Network এর কারণে খবর এলোমেলো
                  ক্রমে পৌঁছায়। নিয়ম: নতুন খবর তখনই পুরনোটার জায়গা নেবে, যখন তার reported_at বেশি নতুন। পুরনো খবর দেরিতে এলে বাদ। নতুন গাইড
                  (guide 5) হলে সরাসরি ঢুকবে। INSERT এর শেষে এমন ON CONFLICT লিখুন। ঠিক হলে guide 2 আগের মতোই available থাকবেন, কারণ তাঁর
                  নতুন আসা খবরটা আসলে পুরনো (07:45, যেখানে Table এ আছে 09:30)।
                </>
              }
              hint={
                <>
                  <code className={CODE}>ON CONFLICT (guide_id) DO UPDATE SET status = EXCLUDED.status, reported_at = EXCLUDED.reported_at</code>
                  , তারপর <code className={CODE}>WHERE EXCLUDED.reported_at &gt; s.reported_at</code>। Starter এ Table এর Alias s দেওয়াই
                  আছে।
                </>
              }
              solution={`SELECT * FROM (VALUES
  (1, 'available', '2026-11-01 10:15'),
  (2, 'available', '2026-11-01 09:30'),
  (3, 'on_tour',   '2026-11-01 06:30'),
  (5, 'available', '2026-11-01 11:00')
) AS v(guide_id, status, reported);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "same-key-twice",
      subHeader: { index: "008", title: "The Same Key Twice" },
      title: <SectionTitle>একই Statement এ একই Key দুইবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Partner এর তালিকা প্রায়ই নিখুঁত হয় না। রাত একটায় Saint Martin এর দাম 12800.00 পাঠাল, আধঘণ্টা পরে সংশোধন করে 13000.00, আর দুটো
              লাইনই একই ফাইলে রয়ে গেল। এই দুটো লাইন একটা INSERT ... ON CONFLICT DO UPDATE এ পাঠালে কী হয়? প্রথম লাইন Row টা বদলাবে, দ্বিতীয় লাইন
              আবার সেই একই Row বদলাতে চাইবে। শেষ পর্যন্ত কোন দাম থাকবে?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই tour_id দুইবার, DO UPDATE এ"
              query={SAME_KEY_BOX}
              caption="ERROR: ON CONFLICT DO UPDATE command cannot affect row a second time, SQLSTATE 21000, আর HINT: Ensure that no rows proposed for insertion within the same command have duplicate constrained values। PostgreSQL অনুমান করে কোনো একটা দাম বেছে নেয় না, পুরো Statement টাই বাতিল করে। কোনো দামই বসেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Error টা আসলে PostgreSQL এর সততা। একই Statement এ একটা Row দুইবার বদলালে ফলাফল নির্ভর করত Row গুলো কোন ক্রমে প্রক্রিয়া হলো
                তার উপর, আর সেই ক্রম SQL এ নিশ্চিত না। তাই Documentation বলে, প্রস্তাবিত Row গুলো Arbiter নিয়মের Column এ একে অপরের নকল হওয়া
                চলবে না। খেয়াল করুন DO NOTHING এর আচরণ আলাদা ছিল: অংশ 003 এ দ্বিতীয় Jui চুপচাপ বাদ পড়েছিল, কারণ কিছু না করাটা দুইবার করলেও
                ফলাফল একই।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো পাঠানোর আগেই প্রতিটা Key এর জন্য একটা Row বেছে নেওয়া। সবচেয়ে নতুনটা চাইলে{" "}
                <Link href="/sql/topic/distinct" className={LINK}>
                  DISTINCT
                </Link>{" "}
                লেসনের DISTINCT ON আর ORDER BY: প্রতিটা tour_id এর প্রথম Row টা থাকবে, আর ORDER BY received_at DESC বলে দেয় প্রথম মানে সবচেয়ে
                নতুন। যোগফল চাইলে GROUP BY, সেটা পরের অংশে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাঠানোর আগে DISTINCT ON"
              query={DISTINCT_ON_BOX}
              caption="Feed এ তিনটা Row, কিন্তু Upsert এ গেছে দুটো: Tour 1 এর শুধু 01:30 এর Row (13000.00), আর Tour 4 (9800.00)। কোনো Error নেই। লক্ষ করুন INSERT এ title দেওয়া হয়নি, তবু RETURNING এ title আছে: Row গুলো পুরনো, DO UPDATE শুধু দাম বদলেছে। একদম নতুন কোনো ট্যুর এই Feed এ এলে তার title খালি থেকে যেত, তাই বাস্তবের Feed এ title ও রাখুন, যেমন অংশ 014 এ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "counters-last-seen",
      subHeader: { index: "009", title: "Counters and Last Seen" },
      title: <SectionTitle>গণনা আর শেষ দেখা: Upsert এর সবচেয়ে প্রচলিত দুই কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Faruk জানতে চান কোন ট্যুরের পাতা দিনে কতবার খোলা হয়। প্রতিবার কেউ পাতা খুললে একটা নতুন Row রাখা যায়, কিন্তু দিনে হাজার Row জমে।
                তার চেয়ে ভালো হলো প্রতিটা ট্যুর আর প্রতিটা দিনের জন্য একটা Row, আর প্রতিবার পাতা খুললে সেই Row এর গণনা এক বাড়ানো। দিনের প্রথম
                খোলায় Row টা থাকে না, তখন নতুন Row লাগে। ঠিক Upsert এর কাজ।
              </ContentParagraph>
              <ContentParagraph>
                এখানে দুটো বিশেষ কৌশল আছে। এক, গণনা বাড়াতে হয় পুরনো মানের উপর: <code className={CODE}>views = v.views + 1</code>, EXCLUDED
                থেকে না। দুই, শেষ কখন দেখা হয়েছে সেটা রাখতে <code className={CODE}>GREATEST(v.last_seen_at, EXCLUDED.last_seen_at)</code>, যাতে
                দেরিতে পৌঁছানো একটা পুরনো খবর নতুন সময়কে পেছনে ঠেলে না দেয়। আর প্রথম দেখার সময় SET এ লেখাই হয় না, তাই সেটা প্রথম INSERT এর
                মানেই থেকে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাতা খোলার গণনা, একটা একটা করে"
              query={COUNTER_BOX}
              caption="তিনটা INSERT, প্রতিটায় INSERT 1: প্রথমটা নতুন Row, পরের দুটো সেই Row বদলাল। শেষে views 3, first_seen_at 09:15 (প্রথম INSERT এর পরে আর কেউ ছোঁয়নি), last_seen_at 10:40। তৃতীয় খবরটা 09:50 এর, দেরিতে এসেছে, কিন্তু GREATEST তাকে 10:40 কে সরাতে দেয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা খোলায় একটা করে Statement ঠিক আছে, কিন্তু অনেক সময় খবরগুলো আগে একটা Log Table এ জমে, আর কয়েক মিনিট পরপর একবারে Table এ
              যোগ হয়। তখন সরাসরি Log থেকে INSERT করলে একই ট্যুর অনেকবার আসবে, আর অংশ 008 এর 21000 Error। সমাধান: আগে{" "}
              <Link href="/sql/topic/group-by" className={LINK}>
                GROUP BY
              </Link>{" "}
              দিয়ে প্রতিটা ট্যুর আর দিনের জন্য একটা Row বানিয়ে নেওয়া, তারপর পুরনো গণনার সাথে নতুন গণনা যোগ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Log থেকে একবারে গণনা"
              query={BATCH_COUNTER_BOX}
              caption="Log এ ছয়টা Row, GROUP BY এর পরে তিনটা: Tour 1 তিনবার, Tour 2 একবার, Tour 4 দুইবার। Upsert এ INSERT 3: Tour 1 এর পুরনো 3 এর সাথে 3 যোগ হয়ে 6, Tour 2 এর 5 এর সাথে 1 হয়ে 6, আর Tour 4 নতুন Row, 2। GROUP BY বাদ দিলে কী হয়, সেটা Exercise 4 এ নিজে দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা Row এ খুব বেশি ভিড় হলে",
          content: (
            <ContentParagraph>
              একই Row বদলাতে চাওয়া দুটো Session একসাথে চলতে পারে না: দ্বিতীয়টা প্রথমটার Transaction শেষ হওয়ার অপেক্ষা করে। দিনে কয়েক হাজার
              খোলায় এটা টেরও পাবেন না। কিন্তু কোনো একটা Row এ প্রতি সেকেন্ডে শত শত বদল এলে (যেমন Website এর মোট ভিজিটর গণনা) সবাই একটা লাইনে
              দাঁড়িয়ে যায়। তখন উপরের Log আর একবারে যোগ করার Pattern টাই সমাধান। কেন এই অপেক্ষা হয় আর Lock কীভাবে কাজ করে, সেটা Module 12 এর{" "}
              <Link href="/sql/topic/row-locks" className={LINK}>
                Row Locks
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ex4_searches;
CREATE TABLE ups_ex4_searches (
  term             text PRIMARY KEY,
  searches         integer NOT NULL,
  last_searched_on date NOT NULL
);
INSERT INTO ups_ex4_searches VALUES
  ('saint martin', 40, '2026-10-30'),
  ('sajek',        25, '2026-10-31');

DROP TABLE IF EXISTS ups_ex4_search_log;
CREATE TABLE ups_ex4_search_log (term text NOT NULL, searched_on date NOT NULL);
INSERT INTO ups_ex4_search_log VALUES
  ('saint martin', '2026-11-01'),
  ('sajek',        '2026-10-28'),
  ('saint martin', '2026-11-01'),
  ('kuakata',      '2026-10-31'),
  ('saint martin', '2026-10-29'),
  ('kuakata',      '2026-11-01');

-- এখানে একটা INSERT ... SELECT ... ON CONFLICT লিখুন


-- নিচের Query টা বদলাবেন না
SELECT term, searches, last_searched_on FROM ups_ex4_searches ORDER BY term;`}
              task={
                <>
                  Website এর Search Box এ কী কী খোঁজা হয়, তার একটা সারাংশ Table আছে (ups_ex4_searches), আর নতুন খোঁজগুলো জমেছে একটা Log এ
                  (ups_ex4_search_log), প্রতিটা Row মানে একবার খোঁজা। একটা INSERT ... SELECT ... ON CONFLICT লিখুন, যেটা প্রতিটা শব্দের জন্য
                  Log এর খোঁজগুলো গুনে পুরনো সংখ্যার সাথে যোগ করবে, আর last_searched_on এ রাখবে সবচেয়ে নতুন তারিখ, পুরনো আর নতুন মিলিয়ে। নতুন
                  শব্দ হলে নতুন Row। খেয়াল করুন sajek এর Log এ একটা পুরনো তারিখ এসেছে, সেটা যেন সারাংশের নতুন তারিখকে পেছনে না ঠেলে।
                </>
              }
              hint={
                <>
                  SELECT এ <code className={CODE}>term, count(*), max(searched_on)</code> আর <code className={CODE}>GROUP BY term</code>।
                  তারপর <code className={CODE}>ON CONFLICT (term) DO UPDATE</code>, যেখানে searches এ পুরনো আর EXCLUDED এর যোগফল, আর
                  last_searched_on এ <code className={CODE}>GREATEST(...)</code>। Table এ Alias দিলে লেখা সহজ হয়:{" "}
                  <code className={CODE}>INSERT INTO ups_ex4_searches AS s</code>।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('kuakata',      2,  DATE '2026-11-01'),
  ('saint martin', 43, DATE '2026-11-01'),
  ('sajek',        26, DATE '2026-10-31')
) AS v(term, searches, last_searched_on);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "returning-with-upsert",
      subHeader: { index: "010", title: "RETURNING with Upsert" },
      title: <SectionTitle>RETURNING: কোন Row নতুন আর কোনটা বদলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/insert" className={LINK}>
                  INSERT
                </Link>{" "}
                লেসনে RETURNING দিয়ে নতুন ID ফেরত নিয়েছিলেন। Upsert এ RETURNING আরও দরকারি, কারণ App প্রায়ই জানতে চায় ঠিক কী ঘটল: Customer
                নতুন হলে স্বাগত Email পাঠাতে হবে, পুরনো হলে না। দাম বদলালে Partner কে একটা নিশ্চিতকরণ পাঠাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL 18 এ RETURNING এ দুটো নতুন শব্দ এসেছে: <code className={CODE}>old</code> আর <code className={CODE}>new</code>। old
                মানে বদলের আগের Row, new মানে পরের। Upsert এ একটা নতুন ঢোকানো Row এর কোনো আগের চেহারা নেই, তাই তার old এর সব Column NULL।
                Documentation এর উদাহরণও ঠিক এটাই দেখায়: সংঘর্ষ হয়নি এমন Row এর old এর মান NULL। এই একটা তথ্য দিয়েই আলাদা করা যায় কোনটা
                ঢুকল আর কোনটা বদলাল। শুধু Table এর নাম বা Alias দিয়ে Column চাইলে আগের মতোই new এর মান আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RETURNING old আর new"
              query={RETURNING_BOX}
              caption="তিনটা Row: Tour 1 updated, old_price 12500.00, new_price 13000.00। Tour 2 updated, কিন্তু দাম আগে পরে একই 8500.00, কারণ এখানে কোনো WHERE নেই। Tour 10 inserted, old_price খালি (NULL)। old.tour_id IS NULL শর্তটাই বলে দিচ্ছে কোন Row নতুন। Primary Key এর মতো কখনো NULL না হওয়া একটা Column দিয়ে এই পরীক্ষা করুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পুরনো কৌশল: xmax = 0",
          content: (
            <ContentParagraph>
              PostgreSQL 18 এর আগে অনেকে একই কাজ করতেন <code className={CODE}>RETURNING (xmax = 0) AS inserted</code> লিখে। xmax প্রতিটা Row এর
              একটা লুকোনো System Column, আর Upsert এর পরে নতুন Row এ এর মান 0 হয়। এই লেসনের পরীক্ষাতেও কৌশলটা ঠিক উত্তর দিয়েছে, কিন্তু
              এটা PostgreSQL এর ভেতরের খুঁটিনাটির উপর দাঁড়ানো, Documentation এ এর কোনো প্রতিশ্রুতি নেই। পুরনো Code এ দেখলে চিনে নিন, নতুন Code
              এ old আর new লিখুন। xmax আসলে কী, সেটা Module 12 এর{" "}
              <Link href="/sql/topic/mvcc" className={LINK}>
                MVCC
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আরেকটা খুব প্রচলিত প্রয়োজন: &quot;Customer নতুন হলে ঢোকানো, পুরনো হলে যা আছে সেটাই, আর দুই ক্ষেত্রেই Row টা আমার হাতে
                ফেরত চাই।&quot; DO NOTHING এর RETURNING পুরনো Row ফেরত দেয় না, কারণ সেটা ঢোকানো বা বদলানো হয়নি। সমাধান হলো একটা CTE: ভেতরে Upsert
                এর RETURNING, বাইরে সেই ফলের সাথে Table থেকে পুরনো Row গুলো UNION ALL।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা সূক্ষ্ম নিয়ম কাজ করছে। একটা Statement এর সব অংশ, WITH এর ভেতরের INSERT আর বাইরের SELECT, একই Snapshot দেখে, মানে
                Statement শুরুর মুহূর্তের Data। তাই বাইরের SELECT ভেতরের INSERT এর নতুন Row দেখতে পায় না। নতুন Row গুলো আসে শুধু RETURNING থেকে,
                আর পুরনো Row গুলো আসে Table থেকে। দুটো মিলে প্রত্যেকে ঠিক একবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন হলে ঢোকানো, পুরনো হলে খুঁজে আনা"
              query={INSERT_OR_SELECT_BOX}
              caption="দুটো Row, প্রত্যেকে একবার: kona.roy এসেছেন added থেকে, source new। rahim.uddin এসেছেন Table থেকে, source existing। Kona কে বাইরের SELECT Table এ খুঁজে পায়নি, কারণ সে Statement শুরুর আগের Data দেখে। এই কারণেই দুই ভাগের Row কখনো দুইবার আসে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "PostgreSQL 19 আসছে: ON CONFLICT DO SELECT",
          content: (
            <ContentParagraph>
              উপরের CTE টা একটু ঘুরপথ, আর PostgreSQL এর Developer রাও সেটা জানেন। PostgreSQL 19 এর Release Notes এ একটা নতুন রূপ আছে:{" "}
              <code className={CODE}>INSERT ... ON CONFLICT DO SELECT ... RETURNING</code>, যেটা সংঘর্ষ হওয়া পুরনো Row টাও RETURNING এ ফেরত
              দেয়, চাইলে FOR UPDATE বা FOR SHARE দিয়ে Lock সহ। 15 October 2026 এ PostgreSQL 19 এর প্রথম Release Candidate বেরিয়েছে, চূড়ান্ত
              Version তখনো আসেনি। এই লেসনের Query বক্স আর আপনার PostgreSQL 18 এ এটা চলবে না, তাই এখনকার জন্য উপরের CTE টাই পথ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "merge",
      subHeader: { index: "011", title: "MERGE" },
      title: <SectionTitle>MERGE: একটা তালিকা দিয়ে আরেকটা Table মিলিয়ে নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ON CONFLICT এর একটা সীমা আছে: এটা শুধু ঢোকানো বা বদলানো জানে, আর শুধু সেই Row গুলোর কথা, যেগুলো আপনি পাঠাচ্ছেন। ধরুন Partner এর
                তালিকাটাই এখন সত্যের উৎস। তালিকায় যে ট্যুর আছে তার দাম মেলাতে হবে, যে ট্যুর নতুন সেটা ঢোকাতে হবে, আর যে ট্যুর তালিকায় আর নেই
                সেটা বন্ধ করে দিতে হবে। শেষ কাজটা ON CONFLICT দিয়ে অসম্ভব, কারণ তালিকায় না থাকা Row কে সে দেখতেই পায় না।
              </ContentParagraph>
              <ContentParagraph>
                এই কাজের জন্য SQL Standard এর Statement হলো MERGE, যেটা PostgreSQL এ এসেছে Version 15 এ (2022)। Release Notes এর ভাষায় এটা ON
                CONFLICT এর মতোই, কিন্তু বেশি Batch ধরনের: একটা উৎস (USING) আর একটা লক্ষ্য (INTO) কে একটা শর্তে জোড়া লাগিয়ে, প্রতিটা জোড়ার
                জন্য আলাদা আলাদা নির্দেশ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "merge-shape.sql",
          code: `MERGE INTO target_table AS t              -- যে Table বদলাবে
USING source_table_or_query AS s          -- যার সাথে মেলাবেন
ON t.key = s.key                          -- কীভাবে জোড়া লাগবে
WHEN MATCHED [AND condition] THEN         -- দুই দিকেই আছে
  UPDATE SET ... | DELETE | DO NOTHING
WHEN NOT MATCHED [BY TARGET] [AND condition] THEN   -- শুধু উৎসে আছে
  INSERT (...) VALUES (...) | DO NOTHING
WHEN NOT MATCHED BY SOURCE [AND condition] THEN     -- শুধু লক্ষ্যে আছে (17+)
  UPDATE SET ... | DELETE | DO NOTHING
RETURNING merge_action(), ...;            -- ঐচ্ছিক (17+), old আর new (18+)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MergeAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়মগুলো ছোট কিন্তু গুরুত্বপূর্ণ। একটা জোড়া প্রথমে তিন ঝুড়ির একটায় পড়ে, তারপর WHEN গুলো লেখা ক্রমে পরীক্ষা হয়, আর প্রথম যে
              WHEN সত্য, শুধু সেটাই চলে। কোনো WHEN না মিললে Row টা ছুঁয়েও দেখা হয় না। প্রথম বক্সে শুধু দুটো ঝুড়ি: দাম আলাদা হলে বদলানো, নতুন
              হলে ঢোকানো। Feed টা ups_price_feed নামের একটা ছোট Table।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MERGE: দাম মেলানো আর নতুন ঢোকানো"
              query={MERGE_BASIC_BOX}
              caption="বক্সে MERGE 2: Tour 1 এর দাম 13000.00 হলো, Tour 10 ঢুকল। Tour 2 মিলেছে কিন্তু দাম একই, তাই WHEN MATCHED AND ... শর্ত মিথ্যা, আর অন্য কোনো WHEN নেই, তাই Row টা বাদ। Feed এ নেই এমন সাতটা ট্যুর ছোঁয়াই হয়নি, কারণ তাদের জন্য কোনো WHEN লেখা হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তৃতীয় ঝুড়ি: <code className={CODE}>WHEN NOT MATCHED BY SOURCE</code>, যেটা PostgreSQL 17 এ এসেছে। Feed এ নেই এমন চালু ট্যুর
              বন্ধ করে দেওয়া হবে। সাথে RETURNING (এটাও 17 থেকে) আর তার বিশেষ Function <code className={CODE}>merge_action()</code>, যেটা প্রতিটা
              Row এর জন্য বলে দেয় INSERT, UPDATE না DELETE হলো। MERGE এর RETURNING এর Row এর ক্রম নিশ্চিত না, তাই পুরো MERGE টা একটা WITH এর
              ভেতরে রেখে বাইরে ORDER BY দেওয়া হয়েছে। PostgreSQL 17 থেকে MERGE ... RETURNING এভাবে WITH এর ভেতরে বসানো যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="MERGE এর তিন ঝুড়ি আর merge_action()"
              query={MERGE_FULL_BOX}
              caption="আটটা Row। Tour 1 UPDATE (দাম 12500.00 থেকে 13000.00), Tour 10 INSERT। Tour 3, 4, 5, 6, 7, 9 UPDATE: দাম একই, কিন্তু was_active t থেকে now_active f, কারণ Feed এ তারা নেই। Tour 2 নেই, কারণ মিলেছে কিন্তু দাম একই। Tour 8 ও নেই: সেটা আগেই বন্ধ, আর AND t.is_active তাকে আবার ছুঁতে দেয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ON CONFLICT এর মতো MERGE ও একই Row কে একটা Statement এ দুইবার বদলাতে দেয় না। উৎসে একই Key দুইবার থাকলে আর দুটোই লক্ষ্যের একই Row
              এর সাথে মিললে Error আসে। সমাধানও একই: উৎসটা আগে DISTINCT ON বা GROUP BY দিয়ে পরিষ্কার করে নেওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উৎসে একই Key দুইবার"
              query={MERGE_DUPLICATE_BOX}
              caption="ERROR: MERGE command cannot affect row a second time, SQLSTATE 21000, HINT: Ensure that not more than one source row matches any one target row। ON CONFLICT এর 21000 এর সাথে মিলিয়ে দেখুন: একই সমস্যা, একই Code, শুধু ভাষা একটু আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ex5_tours;
CREATE TABLE ups_ex5_tours AS
SELECT tour_id, title, price_bdt, is_active FROM tours;
ALTER TABLE ups_ex5_tours ADD PRIMARY KEY (tour_id);

DROP TABLE IF EXISTS ups_ex5_catalog;
CREATE TABLE ups_ex5_catalog (
  tour_id   integer PRIMARY KEY,
  title     text NOT NULL,
  price_bdt numeric(10, 2) NOT NULL
);
INSERT INTO ups_ex5_catalog
SELECT tour_id, title, price_bdt FROM tours WHERE tour_id <= 6;
UPDATE ups_ex5_catalog SET price_bdt = 13500.00 WHERE tour_id = 1;
INSERT INTO ups_ex5_catalog VALUES (10, 'Kuakata Sunrise Weekend', 9900.00);

-- এখানে MERGE লিখুন


-- নিচের Query টা বদলাবেন না
SELECT tour_id, title, price_bdt, is_active FROM ups_ex5_tours ORDER BY tour_id;`}
              task={
                <>
                  ups_ex5_catalog হলো নতুন মৌসুমের ট্যুরের তালিকা, আর এখন থেকে এটাই সত্য। একটা MERGE লিখুন, যেটা ups_ex5_tours কে এই তালিকার
                  সাথে মিলিয়ে নেবে: তালিকায় থাকা ট্যুরের দাম তালিকার দামে, তালিকায় নতুন ট্যুর (tour 10) চালু অবস্থায় ঢুকবে, আর ups_ex5_tours এ
                  আছে কিন্তু তালিকায় নেই এমন সব ট্যুর বন্ধ (is_active false)। ঠিক হলে Tour 1 এর দাম 13500.00, Tour 7 আর 9 বন্ধ, মোট দশটা ট্যুর।
                </>
              }
              hint={
                <>
                  তিনটা WHEN লাগবে: <code className={CODE}>WHEN MATCHED THEN UPDATE SET price_bdt = c.price_bdt</code>,{" "}
                  <code className={CODE}>WHEN NOT MATCHED THEN INSERT ...</code> (is_active এ true), আর{" "}
                  <code className={CODE}>WHEN NOT MATCHED BY SOURCE THEN UPDATE SET is_active = false</code>। USING এ ups_ex5_catalog AS c,
                  ON এ tour_id মেলান।
                </>
              }
              solution={`SELECT tour_id, title,
       CASE WHEN tour_id = 1 THEN 13500.00 ELSE price_bdt END,
       tour_id <= 6
FROM tours
UNION ALL
SELECT 10, 'Kuakata Sunrise Weekend', 9900.00, true
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "on-conflict-vs-merge",
      subHeader: { index: "012", title: "ON CONFLICT vs MERGE" },
      title: <SectionTitle>ON CONFLICT নাকি MERGE: একসাথে অনেকে লিখলে কে টেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MERGE দেখে মনে হতে পারে এটা ON CONFLICT এর বড় ভাই, সব কাজ পারে। কিন্তু একটা জায়গায় দুটোর আচরণ মৌলিকভাবে আলাদা, আর সেটা
                অংশ 002 এর সেই দৌড়: দুটো Session একসাথে একই নতুন Row ঢোকাতে চাইলে কী হয়। MERGE এর Documentation নিজেই সতর্ক করে, অন্য
                Command একসাথে লক্ষ্য Table বদলালে স্বাভাবিক Transaction Isolation এর নিয়ম খাটে, আর পরামর্শ দেয় একসাথে INSERT এর পরিস্থিতিতে
                INSERT ... ON CONFLICT বিবেচনা করতে।
              </ContentParagraph>
              <ContentParagraph>
                কথাটা হাতেকলমে দেখতে দুটো psql জানালা খোলা হয়েছিল, PostgreSQL 18.6 এ। জানালা A একটা Transaction এর ভেতরে Jui কে ঢোকায় আর
                তিন সেকেন্ড পরে COMMIT করে। জানালা B এক সেকেন্ড পরে একই Email পাঠায়, চার রকম Statement দিয়ে। নিচের Lab এ প্রতিটা ধাপ সেই আসল
                Output। এই দৌড় Query বক্সে দেখানো যায় না, কারণ বক্সে একটাই Session।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RaceLab />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "two-psql-windows.sql",
          code: `-- PostgreSQL 18.6, দুটো psql জানালা, Table: ups_race_subscribers (email PRIMARY KEY)

-- জানালা A (0 সেকেন্ডে)
BEGIN;
INSERT INTO ups_race_subscribers (email, full_name)
VALUES ('jui.sarker@mail.example', 'Jui Sarker');
-- INSERT 0 1        (এখনো COMMIT হয়নি)

-- জানালা B (1 সেকেন্ডে)
INSERT INTO ups_race_subscribers (email, full_name)
VALUES ('jui.sarker@mail.example', 'Jui S.')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;
-- (অপেক্ষা করছে)

-- জানালা A (3 সেকেন্ডে)
COMMIT;

-- জানালা B তখনই শেষ হয়
-- INSERT 0 1
-- Time: 1982.962 ms (00:01.983)

-- একই দৌড়ে জানালা B তে MERGE ... WHEN MATCHED THEN UPDATE WHEN NOT MATCHED THEN INSERT হলে:
-- ERROR:  duplicate key value violates unique constraint "ups_race_subscribers_pkey"
-- DETAIL:  Key (email)=(jui.sarker@mail.example) already exists.
-- Time: 1913.424 ms (00:01.913)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কেন এমন হয়? MERGE শুরুতেই উৎস আর লক্ষ্য জোড়া লাগিয়ে ঠিক করে ফেলে কোন Row কোন ঝুড়িতে। জানালা B এর MERGE শুরুর মুহূর্তে Jui এর
              Row COMMIT হয়নি, তাই সেটা অদৃশ্য, আর Jui পড়লেন NOT MATCHED ঝুড়িতে। এরপর INSERT করতে গিয়ে Unique Index এ অপেক্ষা, আর A এর COMMIT
              এর পরে সেখানে সংঘর্ষ। MERGE এর আর ঝুড়ি বদলানোর সুযোগ নেই, তাই Error। ON CONFLICT এর পুরো নকশাটাই এই মুহূর্তের জন্য: সংঘর্ষ ধরা
              পড়লে সে UPDATE এর পথে চলে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "INSERT ... ON CONFLICT", "MERGE"],
          rows: [
            ["PostgreSQL এ কবে থেকে", "9.5 (2016)", "15 (2022), RETURNING আর BY SOURCE 17 থেকে"],
            ["Unique Index লাগে?", "হ্যাঁ, Target এর সাথে মেলা", "না, যেকোনো ON শর্ত"],
            ["একসাথে একই নতুন Row", "নিশ্চিতভাবে ঢোকানো অথবা বদলানো", "23505 Error হতে পারে"],
            ["উৎসে নেই এমন Row", "দেখতেই পায় না", "WHEN NOT MATCHED BY SOURCE"],
            ["মুছে ফেলা", "পারে না", "WHEN ... THEN DELETE"],
            ["একই Key দুইবার", "21000 (DO UPDATE এ)", "21000"],
            ["কী ঘটল জানা", "RETURNING old আর new (18)", "merge_action(), old আর new (18)"],
            ["MySQL 8.4 এ", "ON DUPLICATE KEY UPDATE", "নেই"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "কোনটা কখন",
          content: (
            <ContentParagraph>
              App থেকে আসা একটা একটা অনুরোধ, যেখানে একই সময়ে একই Row আসতে পারে (Booking Form, Login এর সময় শেষ দেখা, গণনা): ON CONFLICT। রাতের
              Batch কাজ, যেখানে একটা পুরো তালিকা দিয়ে একটা Table মেলাতে হয়, মুছতে বা বন্ধ করতে হয়, আর সেই সময় অন্য কেউ একই Row ঢোকায় না: MERGE।
              MERGE চালানোর সময় অন্য কেউ ঢোকাতে পারে এমন হলে MERGE কে একটা Retry এর ভেতরে রাখুন, অথবা Module 12 এর Lock এর কৌশল ব্যবহার করুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL: ON DUPLICATE KEY UPDATE, INSERT IGNORE আর REPLACE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে MySQL কোর্সটা দেখছেন, সেখানে Upsert আসবে তিন নামে: INSERT ... ON DUPLICATE KEY UPDATE, INSERT IGNORE আর REPLACE INTO।
                প্রথমটা PostgreSQL এর ON CONFLICT DO UPDATE এর ভাই, বাকি দুটো দেখতে সুবিধাজনক কিন্তু ভেতরে বিপদ লুকিয়ে রাখে। নিচের সব কথা আমাদের
                mysql:8.4 Container এ, MySQL 8.4.11 এ চালিয়ে মেলানো।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ON DUPLICATE KEY UPDATE।</strong> এখানে কোনো Conflict Target লেখা হয় না: Table এর যেকোনো PRIMARY KEY বা UNIQUE Index এ
                নকল ধরা পড়লেই UPDATE অংশ চলে। নতুন Row এর মান পড়ার আধুনিক উপায় হলো VALUES এর পরে একটা Row Alias:{" "}
                <code className={CODE}>VALUES (...) AS new</code>, তারপর <code className={CODE}>new.phone</code>। MySQL এর Documentation বলে
                Alias এর এই রূপ এসেছে 8.0.19 এ, আর পুরনো <code className={CODE}>VALUES(phone)</code> Function টা 8.0.20 থেকে Deprecated।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-on-duplicate-key.sql",
          code: `-- MySQL 8.4.11
CREATE TABLE ups_members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  email     VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone     VARCHAR(20),
  logins    INT NOT NULL DEFAULT 1
);
INSERT INTO ups_members (email, full_name, phone) VALUES
  ('rahim.uddin@mail.example', 'Rahim Uddin', '+8801000000101'),
  ('nusrat.jahan@mail.example', 'Nusrat Jahan', '+8801000000102');
-- Query OK, 2 rows affected

INSERT INTO ups_members (email, full_name, phone)
VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', '+8801000000199') AS new
ON DUPLICATE KEY UPDATE phone = new.phone;
-- Query OK, 2 rows affected      <- 2 মানে পুরনো Row বদলেছে

INSERT INTO ups_members (email, full_name, phone)
VALUES ('rahim.uddin@mail.example', 'Rahim Uddin', '+8801000000199') AS new
ON DUPLICATE KEY UPDATE phone = new.phone;
-- Query OK, 0 rows affected      <- 0 মানে মিলেছে, কিন্তু কিছুই বদলায়নি

INSERT INTO ups_members (email, full_name, phone)
VALUES ('jui.sarker@mail.example', 'Jui Sarker', NULL) AS new
ON DUPLICATE KEY UPDATE phone = new.phone;
-- Query OK, 1 row affected       <- 1 মানে নতুন Row

SELECT member_id, email, phone, logins FROM ups_members ORDER BY member_id;
-- |         1 | rahim.uddin@mail.example  | +8801000000199 |      1 |
-- |         2 | nusrat.jahan@mail.example | +8801000000102 |      1 |
-- |         5 | jui.sarker@mail.example   | NULL           |      1 |
--   Jui পেলেন 5: আগের দুটো চেষ্টা (একটা বদল, একটা কিছু না) 3 আর 4 খরচ করেছে

-- পুরনো রূপ: এখনো চলে, কিন্তু সতর্কবার্তা দেয়
INSERT INTO ups_members (email, full_name, phone)
VALUES ('nusrat.jahan@mail.example', 'Nusrat Jahan', '+8801000000202')
ON DUPLICATE KEY UPDATE phone = VALUES(phone);
-- Query OK, 2 rows affected, 1 warning
SHOW WARNINGS;
-- Warning | 1287 | 'VALUES function' is deprecated and will be removed in a future release.
--   Please use an alias (INSERT INTO ... VALUES (...) AS alias) and replace VALUES(col)
--   in the ON DUPLICATE KEY UPDATE clause with alias.col instead

INSERT INTO ups_members (email, full_name) VALUES ('kona.roy@mail.example', 'Kona Roy')
RETURNING member_id;
-- ERROR 1064 (42000): You have an error in your SQL syntax ... near 'RETURNING member_id'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Session থেকে চারটা পার্থক্য লক্ষ করুন। এক, Affected Rows এর হিসাব আলাদা: Documentation অনুযায়ী প্রতিটা নতুন Row এর জন্য 1,
                বদলানো Row এর জন্য 2, আর মিলেছে কিন্তু কিছু বদলায়নি এমন Row এর জন্য 0। PostgreSQL দুই ক্ষেত্রেই 1 গোনে। দুই, প্রতিটা চেষ্টা
                একটা AUTO_INCREMENT নম্বর খরচ করে, এমনকি যেটা শুধু পুরনো Row বদলাল। তিন, MySQL 8.4 এ RETURNING নেই, তাই নতুন ID জানতে
                LAST_INSERT_ID() লাগে। চার, MERGE ও নেই: লিখলে ERROR 1064।
              </ContentParagraph>
              <ContentParagraph>
                গণনার কাজে MySQL এর একটা নিজস্ব ফাঁদ আছে। Row Alias এ যে Column আছে, সেই নামটা Table এও আছে, তাই শুধু{" "}
                <code className={CODE}>views + new.views</code> লিখলে MySQL বুঝতে পারে না বাঁ দিকের views কোনটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-counter.sql",
          code: `-- MySQL 8.4.11
CREATE TABLE ups_tour_views (
  tour_id INT  NOT NULL,
  view_on DATE NOT NULL,
  views   INT  NOT NULL,
  PRIMARY KEY (tour_id, view_on)
);

INSERT INTO ups_tour_views (tour_id, view_on, views) VALUES (1, '2026-11-01', 1) AS new
ON DUPLICATE KEY UPDATE views = views + new.views;
-- ERROR 1052 (23000): Column 'views' in field list is ambiguous

INSERT INTO ups_tour_views (tour_id, view_on, views) VALUES (1, '2026-11-01', 1) AS new
ON DUPLICATE KEY UPDATE views = ups_tour_views.views + new.views;
-- Query OK, 1 row affected

INSERT INTO ups_tour_views (tour_id, view_on, views) VALUES (1, '2026-11-01', 1) AS new
ON DUPLICATE KEY UPDATE views = ups_tour_views.views + new.views;
-- Query OK, 2 rows affected

SELECT * FROM ups_tour_views;
-- |       1 | 2026-11-01 |     2 |

-- আরেক উপায়: Column গুলোকেও Alias দেওয়া, তখন নাম আর মেলে না
-- VALUES (1, '2026-11-01', 1) AS new(t, d, v) ON DUPLICATE KEY UPDATE views = views + v;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>একাধিক Unique Key এর ফাঁদ।</strong> MySQL এ Target লেখা হয় না বলে একটা Table এ PRIMARY KEY আর একটা UNIQUE দুটোই থাকলে
                নতুন Row দুটো আলাদা পুরনো Row এর সাথে মিলতে পারে। পরীক্ষায় (a PRIMARY KEY, b UNIQUE) Table এ (1, 10) আর (2, 20) ছিল, আর
                পাঠানো হলো (1, 20)। এটা দুটো Row এর সাথেই সংঘর্ষ করে, কিন্তু বদলাল শুধু একটা, a = 1 এর Row। Documentation এর পরামর্শ পরিষ্কার:
                একাধিক Unique Index আছে এমন Table এ ON DUPLICATE KEY UPDATE এড়িয়ে চলুন। PostgreSQL এ Target বাধ্যতামূলক বলে এই অস্পষ্টতা
                থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>INSERT IGNORE আর REPLACE INTO।</strong> দুটোই দেখতে ছোট আর সুবিধাজনক। INSERT IGNORE শুধু নকল Row না, আরও অনেক Error কে
                Warning বানিয়ে দেয়, আর ভুল মান চুপচাপ বদলে ঢুকিয়ে দেয়। REPLACE INTO এর কাজ Documentation নিজেই বলে: নকল ধরা পড়লে নতুন Row
                ঢোকানোর আগে পুরনো Row টা মুছে ফেলা হয়। মুছে ফেলা মানে DELETE এর সব ফলাফল: ON DELETE CASCADE, DELETE Trigger, আর একদম নতুন
                AUTO_INCREMENT নম্বর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-replace-and-ignore.sql",
          code: `-- MySQL 8.4.11
CREATE TABLE ups_members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  email     VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone     VARCHAR(20)
);
CREATE TABLE ups_wishlist (
  member_id INT NOT NULL,
  tour_id   INT NOT NULL,
  PRIMARY KEY (member_id, tour_id),
  FOREIGN KEY (member_id) REFERENCES ups_members (member_id) ON DELETE CASCADE
);
CREATE TABLE ups_delete_log (member_id INT);
CREATE TRIGGER ups_members_after_delete AFTER DELETE ON ups_members
FOR EACH ROW INSERT INTO ups_delete_log VALUES (OLD.member_id);

INSERT INTO ups_members (email, full_name, phone) VALUES
  ('rahim.uddin@mail.example', 'Rahim Uddin', '+8801000000101'),
  ('nusrat.jahan@mail.example', 'Nusrat Jahan', '+8801000000102');
INSERT INTO ups_wishlist VALUES (1, 1), (1, 4), (2, 3);

REPLACE INTO ups_members (email, full_name)
VALUES ('rahim.uddin@mail.example', 'Rahim Uddin');
-- Query OK, 2 rows affected      <- 1 টা মোছা + 1 টা ঢোকানো

SELECT * FROM ups_members ORDER BY member_id;
-- |         2 | nusrat.jahan@mail.example | Nusrat Jahan | +8801000000102 |
-- |         3 | rahim.uddin@mail.example  | Rahim Uddin  | NULL           |
--   Rahim এখন member_id 3, আর ফোন নেই
SELECT * FROM ups_wishlist;
-- |         2 |       3 |          <- Rahim এর দুটো Wishlist Row CASCADE এ মুছে গেছে
SELECT * FROM ups_delete_log;
-- |         1 |                    <- DELETE Trigger চলেছে

INSERT IGNORE INTO ups_members (email, full_name) VALUES
  ('nusrat.jahan@mail.example', 'Nusrat J.'),
  ('kona.roy@mail.example', NULL);
-- Query OK, 1 row affected, 2 warnings
SHOW WARNINGS;
-- | Warning | 1062 | Duplicate entry 'nusrat.jahan@mail.example' for key 'ups_members.email' |
-- | Warning | 1048 | Column 'full_name' cannot be null                                       |
SELECT member_id, email, full_name FROM ups_members ORDER BY member_id;
-- |         4 | kona.roy@mail.example     |              |
--   NOT NULL Column এ NULL পাঠানো হয়েছিল, MySQL Error না দিয়ে খালি লেখা বসিয়ে দিয়েছে`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ReplaceVsUpsertSplit />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["থাকলে বাদ", "ON CONFLICT (col) DO NOTHING", "INSERT IGNORE (অন্য Error ও লুকায়)"],
            ["থাকলে বদলানো", "ON CONFLICT (col) DO UPDATE SET c = EXCLUDED.c", "ON DUPLICATE KEY UPDATE c = new.c"],
            ["নতুন Row এর মান", "EXCLUDED.col", "VALUES (...) AS new, তারপর new.col (8.0.19+)"],
            ["কোন নিয়মে মিল", "Target বাধ্যতামূলক (DO UPDATE এ)", "যেকোনো PRIMARY KEY বা UNIQUE, লেখা যায় না"],
            ["মিলেও শর্তে বদলানো", "DO UPDATE ... WHERE", "SET c = IF(শর্ত, নতুন, পুরনো)"],
            ["Affected Rows", "ঢোকানো + বদলানো, প্রতিটা 1", "নতুন 1, বদল 2, বদল নেই 0"],
            ["কী ঘটল ফেরত", "RETURNING old আর new", "RETURNING নেই, LAST_INSERT_ID()"],
            ["মুছে নতুন করে লেখা", "সরাসরি নেই (DELETE তারপর INSERT)", "REPLACE INTO, CASCADE আর Trigger সহ"],
            ["তালিকা দিয়ে মেলানো", "MERGE (15+)", "নেই"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours: রাতের দামের তালিকা, নিরাপদে আর এক Statement এ</SectionTitle>,
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
                এবার তানিমের দ্বিতীয় সমস্যাটা পুরোপুরি সমাধান করা যাক: Partner এর রাতের দামের তালিকা। আঠারোটা আলাদা Query আর মাঝপথে থেমে যাওয়ার
                ঝুঁকির বদলে একটা Statement, যেটা হয় পুরো সফল নয়তো কিছুই না। তালিকাটা প্রথমে একটা Staging Table এ আসে (বাইরের ফাইল থেকে Table এ
                তোলার পথ পরের লেসনে), আর আমরা সেখান থেকে ট্যুরের Table এ নিয়ে যাব। শুরুতে তালিকাটা দেখে নিন, আর গুনে দেখুন কয়টা ঝামেলা লুকিয়ে
                আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="রাতের তালিকা, যেমন এসেছে"
              query={PROJECT_FEED_BOX}
              caption="ছয়টা Row আর চারটা ঝামেলা। Tour 1 দুইবার এসেছে, 01:40 এর Row টা সংশোধনী। Tour 2 এর দাম আগের মতোই 8500.00। Tour 8, Saint Martin Luxury Stay, আমাদের কাছে বন্ধ, Partner জানে না। Tour 10 একদম নতুন। এই প্রতিটা ঝামেলার জন্য Upsert এ একটা করে অংশ লাগবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চারটা ঝামেলার চারটা সমাধান, সবগুলো এই লেসনেরই: নকল দূর করতে DISTINCT ON (অংশ 008), বন্ধ ট্যুর আর একই দাম আটকাতে DO UPDATE এর WHERE
              (অংশ 007), নতুন ট্যুর ঢোকাতে সাধারণ ON CONFLICT, আর সকালে Faruk কে কী বদলাল তার রিপোর্ট দিতে RETURNING old আর new (অংশ 010)। পুরোটা
              একটা WITH এর ভেতরে, যাতে শেষে রিপোর্টটা সাজিয়ে দেখানো যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Statement এ পুরো রাতের কাজ, সাথে রিপোর্ট"
              query={PROJECT_UPSERT_BOX}
              caption="তিনটা Row এর রিপোর্ট: Tour 1 price changed, 12500.00 থেকে 13000.00 (সংশোধিত দামটাই বসেছে, 12800.00 না)। Tour 4 price changed, 9500.00 থেকে 9800.00। Tour 10 new tour, 9000.00। Tour 2 নেই, দাম একই। Tour 8 নেই, বন্ধ। একটা Statement, তাই মাঝপথে Server বন্ধ হলেও অর্ধেক বদল বলে কিছু থাকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              রিপোর্ট বিশ্বাস করার আগে যাচাই করুন। নিচের বক্স একই কাজ আবার করে (প্রতিটা বক্স নিজের কাজ নিজে করে), তারপর ups_tours এর প্রতিটা
              ট্যুরকে আসল tours Table এর দামের সাথে পাশাপাশি রাখে। পার্থক্য শূন্য না হলে সেটা হয় আমাদের চাওয়া বদল, নয়তো একটা ভুল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগে আর পরে, পাশাপাশি"
              query={PROJECT_CHECK_BOX}
              caption="দশটা ট্যুর। পার্থক্য শুধু তিন জায়গায়: Tour 1 এ 500.00, Tour 4 এ 300.00, আর Tour 10 নতুন, তাই before_bdt খালি আর difference পুরো 9000.00। Tour 8 এর দাম এখনো 32000.00, Partner এর 30000.00 বসেনি। Upsert এর INSERT 3 আর এই তিনটা পার্থক্য মিলে গেছে: রিপোর্ট আর বাস্তব এক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              orderMatters
              starter={`DROP TABLE IF EXISTS ups_ch_customer_stats;
CREATE TABLE ups_ch_customer_stats (
  customer_id        integer PRIMARY KEY,
  confirmed_bookings integer NOT NULL,
  spent_bdt          numeric(12, 2) NOT NULL,
  version            integer NOT NULL DEFAULT 1
);
-- গতরাতের হিসাব: কয়েকটা ঠিক আছে, কয়েকটা পুরনো হয়ে গেছে
INSERT INTO ups_ch_customer_stats (customer_id, confirmed_bookings, spent_bdt) VALUES
  (1, 2, 44000.00),
  (2, 1, 50000.00),
  (3, 1, 12500.00),
  (4, 2, 36000.00),
  (8, 1, 28000.00);

-- এখানে আপনার Upsert লিখুন


-- নিচের Query টা বদলাবেন না
SELECT customer_id, confirmed_bookings, spent_bdt, version
FROM ups_ch_customer_stats
ORDER BY customer_id;`}
              task={
                <>
                  Faruk প্রতিটা Customer এর একটা সারাংশ রাখেন: কয়টা confirmed Booking আর মোট কত টাকা (bookings এর total_bdt এর যোগফল)।
                  গতরাতের সারাংশ Table এ আছে, কিন্তু তার কয়েকটা পুরনো হয়ে গেছে আর কয়েকজন Customer একদম নেই। একটা Upsert লিখুন, যেটা bookings
                  থেকে প্রতিটা Customer এর সঠিক সংখ্যা হিসাব করে সারাংশটা ঠিক করবে। শর্ত: শুধু যে Row এর সংখ্যা বা টাকা সত্যিই বদলেছে, তার
                  version এক বাড়বে। যে Row আগেই ঠিক ছিল সেটা ছোঁয়া যাবে না (version 1 থাকবে), আর নতুন Customer এর Row ঢুকবে version 1 নিয়ে।
                  ঠিক হলে 12টা Row, যার তিনটার version 2।
                </>
              }
              hint={
                <>
                  <code className={CODE}>INSERT INTO ups_ch_customer_stats AS s (...) SELECT customer_id, count(*), sum(total_bdt) FROM bookings WHERE status = &apos;confirmed&apos; GROUP BY customer_id</code>
                  , তারপর ON CONFLICT (customer_id) DO UPDATE, SET এ দুটো সংখ্যা EXCLUDED থেকে আর{" "}
                  <code className={CODE}>version = s.version + 1</code>। শেষে WHERE এ পুরনো আর নতুন জোড়া তুলনা করুন:{" "}
                  <code className={CODE}>(s.confirmed_bookings, s.spent_bdt) IS DISTINCT FROM (EXCLUDED.confirmed_bookings, EXCLUDED.spent_bdt)</code>।
                </>
              }
              solution={`SELECT customer_id, count(*), sum(total_bdt),
       CASE WHEN customer_id IN (2, 3, 8) THEN 2 ELSE 1 END
FROM bookings
WHERE status = 'confirmed'
GROUP BY customer_id
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Upsert লেখার আট ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "একই জিনিস কী দিয়ে চেনা যায়, ঠিক করুন",
              description:
                "Email, (tour_id, starts_on), Partner এর ট্যুর নম্বর। এটাই আপনার Conflict Target। এটা ঠিক না করে Upsert লেখা মানে অনুমানের উপর লেখা।",
            },
            {
              title: "সেই Column গুলোতে Unique নিয়ম আছে কিনা দেখুন",
              description:
                "না থাকলে 42P10। বড় ছোট হাত না মানলে lower() এর Index, শুধু জীবিত Row এ হলে Partial Index, আর Target এ হুবহু সেই রূপ।",
            },
            {
              title: "মিললে কী হবে: বাদ, নাকি বদল",
              description:
                "শুধু নতুন দরকার হলে DO NOTHING। নতুন তথ্য পুরনো Row এ বসাতে হলে DO UPDATE। তালিকায় না থাকা Row ও বদলাতে বা মুছতে হলে MERGE।",
            },
            {
              title: "SET এ প্রতিটা Column আলাদা করে ভাবুন",
              description:
                "কোনটা EXCLUDED থেকে, কোনটা পুরনো মানের উপর হিসাব (গণনা, GREATEST), কোনটা ছোঁয়াই যাবে না। খালি ঘর পুরনো তথ্য মুছে দিতে পারে, দরকার হলে COALESCE।",
            },
            {
              title: "কখন বদলানো চলবে না, WHERE এ লিখুন",
              description:
                "মান একই হলে (IS DISTINCT FROM), পুরনো Row বন্ধ থাকলে, আসা খবর পুরনো হলে। WHERE মিথ্যা মানে Row টা অক্ষত, গোনায় নেই।",
            },
            {
              title: "উৎসে একই Key দুইবার আছে কিনা দেখুন",
              description:
                "থাকলে DO UPDATE আর MERGE দুটোই 21000। সবচেয়ে নতুনটা চাইলে DISTINCT ON, যোগফল চাইলে GROUP BY, পাঠানোর আগেই।",
            },
            {
              title: "RETURNING দিয়ে জানুন কী ঘটল",
              description:
                "old.key IS NULL মানে নতুন। App এর স্বাগত Email, রিপোর্ট, Log, সবকিছু এখান থেকে। পুরনো Row ও দরকার হলে CTE আর UNION ALL।",
            },
            {
              title: "একটা Copy তে চালান, তারপর পাশাপাশি মিলান",
              description:
                "আসল Table এর পাশে রেখে পার্থক্য দেখুন, Command Tag এর সংখ্যার সাথে মেলান। মিললে তবেই আসল Table এ, আর সম্ভব হলে Transaction এর ভেতরে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো Upsert এ বারবার দেখা যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "যা ঘটে", "ঠিক উপায়"],
          rows: [
            ["App এ আগে SELECT, তারপর INSERT", "একসাথে দুটো অনুরোধে 23505, ভাঙা পাতা", "ON CONFLICT, সিদ্ধান্ত Database এর হাতে"],
            ["Unique নিয়ম নেই এমন Column এ Target", "42P10, Upsert চলেই না", "আগে UNIQUE বা Unique Index, তারপর Target"],
            ["lower(email) এর Index, Target এ (email)", "42P10", "Target এ হুবহু (lower(email))"],
            ["SET এ শুধু Column এর নাম, Table ছাড়া", "42702 ambiguous", "EXCLUDED.col অথবা t.col, পরিষ্কার করে"],
            ["SET phone = EXCLUDED.phone, Form এ ফোন ঐচ্ছিক", "পুরনো ফোন মুছে NULL", "COALESCE(EXCLUDED.phone, t.phone)"],
            ["WHERE এ <>", "পুরনো মান NULL হলে কখনো বদলায় না", "IS DISTINCT FROM"],
            ["উৎসে একই Key দুইবার", "21000, পুরো Statement বাতিল", "আগে DISTINCT ON বা GROUP BY"],
            ["DO NOTHING ভেবে নেওয়া সব Error ঢাকবে", "CHECK, NOT NULL এর Error আগের মতোই", "ভুল Data আগেই পরিষ্কার করুন"],
            ["RETURNING এ পুরনো Row আশা করা (DO NOTHING)", "বাদ পড়া Row ফেরত আসে না", "CTE আর UNION ALL, অথবা PostgreSQL 19 এর DO SELECT"],
            ["একসাথে অনেকে ঢোকাতে পারে এমন জায়গায় MERGE", "কখনো কখনো 23505", "ON CONFLICT, অথবা MERGE এর চারপাশে Retry"],
            ["MySQL এ REPLACE INTO কে Upsert ভাবা", "পুরনো Row মুছে নতুন ID, CASCADE এ সম্পর্কিত Data গায়েব", "ON DUPLICATE KEY UPDATE"],
            ["MySQL এ INSERT IGNORE দিয়ে নকল বাদ", "NULL চুপচাপ খালি লেখা হয়ে ঢোকে", "ON DUPLICATE KEY UPDATE, অথবা আগে পরিষ্কার"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={AMBIGUOUS_BOX}
              caption={`ERROR: column reference "price_bdt" is ambiguous, SQLSTATE 42702। SET এর ডান পাশে price_bdt বলতে পুরনো Row নাকি EXCLUDED, PostgreSQL বুঝতে পারছে না। ডান পাশটা EXCLUDED.price_bdt করুন, আর শেষে SELECT tour_id, price_bdt FROM ups_tours WHERE tour_id = 1; যোগ করে চালান: দাম 13000.00। তারপর ডান পাশে ups_tours.price_bdt লিখে আবার চালান: Error নেই, বক্সে INSERT 1, কিন্তু দাম 12500.00 ই থেকে যায়, কারণ পুরনো মান দিয়েই পুরনো মান বদলানো হলো। এই দ্বিতীয় ভুলটা আরও বিপজ্জনক, কারণ কোনো Error দেয় না।`}
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
                  <a href="https://www.postgresql.org/docs/current/sql-insert.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: INSERT
                  </a>
                  : ON CONFLICT এর আনুষ্ঠানিক বিবরণ। Inference, Arbiter Index, EXCLUDED, DO UPDATE এর WHERE, RETURNING এর old আর new, আর সেই
                  লাইনটা যেখানে বলা আছে ঢোকানো অথবা বদলানো নিশ্চিত, অনেক Session একসাথে চললেও।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/current/sql-merge.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL Docs: MERGE
                  </a>
                  : তিন রকম WHEN, merge_action(), আর একসাথে চলা Command নিয়ে সেই সতর্কবাণী, যেখানে INSERT ... ON CONFLICT বিবেচনা করতে বলা
                  হয়েছে।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/release/18.0/" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL 18 Release Notes
                  </a>
                  : INSERT, UPDATE, DELETE আর MERGE এর RETURNING এ OLD আর NEW এর আসার খবর।
                </ListItem>
                <ListItem>
                  <a href="https://www.postgresql.org/docs/19/release-19.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    PostgreSQL 19 Release Notes
                  </a>
                  : আসন্ন Version এর তালিকা, যেখানে INSERT ... ON CONFLICT DO SELECT ... RETURNING আছে। এখনো Release Candidate, তাই খুঁটিনাটি
                  বদলাতে পারে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/insert-on-duplicate.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: INSERT ... ON DUPLICATE KEY UPDATE
                  </a>
                  : Row Alias, Affected Rows এর 1, 2 আর 0 এর হিসাব, VALUES() এর Deprecated হওয়া, আর একাধিক Unique Index নিয়ে সতর্কবাণী।
                </ListItem>
                <ListItem>
                  <a href="https://dev.mysql.com/doc/refman/8.4/en/replace.html" className={LINK} target="_blank" rel="noopener noreferrer">
                    MySQL 8.4 Manual: REPLACE
                  </a>
                  : পুরনো Row মুছে নতুন ঢোকানোর পুরো নিয়ম, আর কেন একটা REPLACE একাধিক পুরনো Row মুছে ফেলতে পারে।
                </ListItem>
                <ListItem>
                  <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে ON DUPLICATE KEY UPDATE বা REPLACE দেখলে এই লেসনের MySQL অংশটা পাশে রাখুন, আর PostgreSQL এর রূপটা
                  Query বক্সে লিখে মিলিয়ে দেখুন।
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
                  Upsert মানে থাকলে বদলানো, না থাকলে ঢোকানো। App এ আগে খুঁজে তারপর সিদ্ধান্ত নিলে দুটো একসাথের অনুরোধে দুজনেই কিছু পায় না আর
                  দুজনেই ঢোকায়। সিদ্ধান্তটা Database কে দিতে হয়, কারণ শুধু Unique Index ই নিশ্চিত জানে।
                </ListItem>
                <ListItem>
                  ON CONFLICT DO NOTHING আগে থেকে থাকা Row চুপচাপ বাদ দেয়। RETURNING আর Command Tag শুধু ঢোকানো Row গোনে। বাদ পড়া Row ও একটা
                  Identity নম্বর খরচ করে, আর CHECK বা NOT NULL এর Error আগের মতোই আসে।
                </ListItem>
                <ListItem>
                  Conflict Target এর সাথে একটা Unique Index বা Constraint হুবহু মিলতে হবে, নইলে 42P10। Column এর ক্রম ব্যাপার না। Expression Index
                  এ Target এ সেই Expression, Partial Index এ সেই WHERE। DO UPDATE এ Target বাধ্যতামূলক।
                </ListItem>
                <ListItem>
                  DO UPDATE SET এ EXCLUDED মানে যে Row ঢুকতে পারেনি। তালিকায় না থাকা Column এর EXCLUDED মান DEFAULT বা NULL, তাই খালি ঘর পুরনো
                  তথ্য মুছতে পারে: COALESCE। ডান পাশে শুধু Column এর নাম লিখলে 42702।
                </ListItem>
                <ListItem>
                  ON CONSTRAINT নাম দিয়ে Constraint বাছে, শুধু Index এর নাম চলে না (42704)। সাধারণত Column এর তালিকা ভালো। Exclusion Constraint
                  এ DO UPDATE চলে না।
                </ListItem>
                <ListItem>
                  DO UPDATE এর WHERE মিথ্যা হলে Row বদলায় না, গোনা হয় না, RETURNING এ আসে না, শুধু Lock হয়। একই মান আটকাতে IS DISTINCT FROM।
                </ListItem>
                <ListItem>
                  একই Statement এ একই Key দুইবার DO UPDATE এ গেলে 21000। পাঠানোর আগে DISTINCT ON বা GROUP BY। গণনায় পুরনো মানের উপর যোগ, শেষ
                  দেখায় GREATEST।
                </ListItem>
                <ListItem>
                  PostgreSQL 18 এর RETURNING old আর new বলে দেয় কোন Row নতুন (old এর Key NULL)। পুরনো Row ও ফেরত চাইলে CTE আর UNION ALL,
                  PostgreSQL 19 এ আসছে DO SELECT।
                </ListItem>
                <ListItem>
                  MERGE (15+) একটা তালিকা দিয়ে Table মেলায়: MATCHED, NOT MATCHED, NOT MATCHED BY SOURCE (17+), সাথে DELETE আর merge_action()।
                  কিন্তু একসাথে একই নতুন Row এলে 23505 দিতে পারে, ON CONFLICT দেয় না।
                </ListItem>
                <ListItem>
                  MySQL এ ON DUPLICATE KEY UPDATE, Row Alias new দিয়ে, Affected Rows 1, 2, 0। INSERT IGNORE অন্য Error ও লুকায়, REPLACE INTO পুরনো
                  Row মুছে নতুন ID দেয় আর CASCADE চালায়। RETURNING আর MERGE নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা উদাহরণে Data এসেছে হাতে লেখা VALUES থেকে, অথবা আরেকটা Table থেকে। বাস্তবে রাতের তালিকা আসে একটা CSV ফাইল হয়ে,
                হাজার হাজার লাইনের। সেই ফাইল একবারে Staging Table এ তোলা, উল্টো দিকে Table থেকে CSV বানানো, আর বড় Load দ্রুত করার কৌশল, সেটাই
                পরের লেসন{" "}
                <Link href="/sql/topic/bulk-loading" className={LINK}>
                  Bulk Loading with COPY and CSV
                </Link>
                । সেখানে তোলা Data কে মূল Table এ নেওয়ার শেষ ধাপটা হবে ঠিক এই লেসনের Upsert।
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
      ["Upsert", "থাকলে বদলানো, না থাকলে ঢোকানো, এক Statement এ", "Booking Form এর Customer"],
      ["আগে খুঁজে ঢোকানো", "দুটো একসাথের অনুরোধে দুজনেই ঢোকায়, 23505", "Jui এর দুই Tab"],
      ["DO NOTHING", "আগে থেকে থাকলে বাদ, Error ছাড়া", "Newsletter এর তালিকা"],
      ["Conflict Target", "যে Unique Index এ মিল খোঁজা হয়, না মিললে 42P10", "(email), (tour_id, starts_on)"],
      ["Expression আর Partial", "Target এ হুবহু lower(email) বা সেই WHERE", "ups_subscribers, ups_members"],
      ["EXCLUDED", "যে Row ঢুকতে পারেনি, তার মান", "Partner এর নতুন দাম"],
      ["খালি ঘরের ফাঁদ", "তালিকায় না থাকা Column এর EXCLUDED মান NULL", "Rahim এর মুছে যাওয়া ফোন"],
      ["ON CONSTRAINT", "Constraint এর নাম দিয়ে Target, Index এর নাম না", "ups_customers_pkey"],
      ["DO UPDATE এর WHERE", "মিথ্যা হলে বদল নেই, গোনা নেই, RETURNING নেই", "একই দাম, বন্ধ ট্যুর"],
      ["একই Key দুইবার", "21000, আগে DISTINCT ON বা GROUP BY", "Tour 1 এর সংশোধিত দাম"],
      ["গণনা", "পুরনো মানের উপর যোগ, শেষ দেখায় GREATEST", "পাতা খোলার হিসাব"],
      ["RETURNING old আর new", "old এর Key NULL মানে নতুন Row (18+)", "সকালের রিপোর্ট"],
      ["MERGE", "তালিকা দিয়ে মেলানো, তিন ঝুড়ি, 15+", "Feed এ না থাকা ট্যুর বন্ধ"],
      ["ON CONFLICT বনাম MERGE", "একসাথের INSERT এ শুধু ON CONFLICT নিশ্চিত", "দুই psql জানালার দৌড়"],
      ["MySQL", "ON DUPLICATE KEY UPDATE, AS new, 1, 2, 0", "REPLACE এ মুছে যাওয়া Wishlist"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "চারজনের একটা তালিকা INSERT ... ON CONFLICT (email) DO NOTHING RETURNING email দিয়ে পাঠানো হলো। দুজন আগে থেকেই Table এ আছেন। RETURNING এ কয়টা Row আসবে?",
        options: [
          {
            key: "A",
            text: "চারটা, কারণ RETURNING সব প্রস্তাবিত Row ফেরত দেয়",
            isCorrect: false,
            explanation: "RETURNING শুধু সেই Row ফেরত দেয়, যারা সত্যিই ঢুকেছে বা বদলেছে। বাদ পড়া Row আসে না।",
          },
          {
            key: "B",
            text: "দুটো, শুধু যারা সত্যিই ঢুকেছে",
            isCorrect: true,
            explanation:
              "ঠিক। Documentation বলে শুধু সফলভাবে ঢোকানো বা বদলানো Row ফেরত আসে। অংশ 003 এর বক্সে চারজনের তালিকা থেকে RETURNING এ এসেছিল দুটো Row।",
          },
          {
            key: "C",
            text: "শূন্য, কারণ সংঘর্ষ হলে RETURNING কাজ করে না",
            isCorrect: false,
            explanation: "সংঘর্ষ হলেও বাকি Row গুলো ঠিকঠাক ঢোকে আর RETURNING এ আসে। সংঘর্ষ শুধু সেই Row কে বাদ দেয়।",
          },
          {
            key: "D",
            text: "Error আসবে, কারণ DO NOTHING এর সাথে RETURNING লেখা যায় না",
            isCorrect: false,
            explanation: "DO NOTHING এর সাথে RETURNING লেখা পুরোপুরি বৈধ, এই লেসনের বক্সেই চলেছে।",
          },
        ],
      },
      {
        id: 2,
        text: "customers এর copy তে শুধু email এ Primary Key। কেউ লিখলেন ON CONFLICT (full_name) DO NOTHING। কী হবে?",
        options: [
          {
            key: "A",
            text: "একই নামের Customer থাকলে Row বাদ পড়বে",
            isCorrect: false,
            explanation: "full_name এর উপর কোনো Unique নিয়ম নেই, তাই PostgreSQL সেখানে মিল খুঁজতেই পারে না।",
          },
          {
            key: "B",
            text: "PostgreSQL নিজে থেকে full_name এর উপর একটা Unique Index বানিয়ে নেবে",
            isCorrect: false,
            explanation: "PostgreSQL কখনো নিজে থেকে Index বানায় না। Index বানানো আপনার সিদ্ধান্ত।",
          },
          {
            key: "C",
            text: "ERROR 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification",
            isCorrect: true,
            explanation:
              "ঠিক। Target এর Column দিয়ে বানানো একটা Unique Index বা Constraint খুঁজে না পেলে Inference ব্যর্থ, আর Statement চলেই না। অংশ 004 এর প্রথম বক্স।",
          },
          {
            key: "D",
            text: "Target অগ্রাহ্য করে email এর Primary Key দিয়ে মিল খোঁজা হবে",
            isCorrect: false,
            explanation: "Target লেখা থাকলে PostgreSQL ঠিক সেটাই মানে। Target ছাড়া DO NOTHING হলে তবেই যেকোনো Unique নিয়ম ধরা হতো।",
          },
        ],
      },
      {
        id: 3,
        text: "দুটো Tab একই নতুন Email পাঠাল, দুটোই App এ আগে SELECT করে 0 পেয়ে INSERT চালাল। প্রথম Transaction তখনো COMMIT হয়নি। দ্বিতীয় INSERT এর কী হয়?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে ঢুকে যায়, Table এ দুটো Row হয়",
            isCorrect: false,
            explanation: "Primary Key দুটো একই Email কখনো থাকতে দেয় না। Data নষ্ট হয় না, কিন্তু একজন Error পায়।",
          },
          {
            key: "B",
            text: "প্রথমটার শেষ হওয়ার অপেক্ষা করে, তারপর 23505 Error পায়",
            isCorrect: true,
            explanation:
              "ঠিক। আসল পরীক্ষায় দ্বিতীয় INSERT প্রায় 1966 ms অপেক্ষা করেছিল, তারপর প্রথমটা COMMIT করতেই duplicate key Error। ON CONFLICT থাকলে সেখানে Error এর বদলে বাদ বা বদল হতো।",
          },
          {
            key: "C",
            text: "প্রথম Transaction কে বাতিল করে নিজে ঢোকে",
            isCorrect: false,
            explanation: "PostgreSQL কখনো একজনকে সরিয়ে আরেকজনকে জায়গা দেয় না। আগে যে Index এ জায়গা নিয়েছে, তার শেষ হওয়া পর্যন্ত অপেক্ষা।",
          },
          {
            key: "D",
            text: "দুটো Row মিলে একটা হয়ে যায়",
            isCorrect: false,
            explanation: "SQL নিজে থেকে কিছু মেলায় না। মেলানোর নির্দেশ আপনাকে ON CONFLICT DO UPDATE দিয়ে দিতে হয়।",
          },
        ],
      },
      {
        id: 4,
        text: "INSERT INTO c (email, full_name, city) VALUES (...) ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone। INSERT এর তালিকায় phone নেই, আর phone এর কোনো DEFAULT নেই। পুরনো Row এর ফোনের কী হবে?",
        options: [
          {
            key: "A",
            text: "অপরিবর্তিত থাকবে, কারণ phone পাঠানোই হয়নি",
            isCorrect: false,
            explanation: "পাঠানো হয়নি ঠিক, কিন্তু SET এ লেখা আছে phone = EXCLUDED.phone, আর EXCLUDED এ phone এর মান NULL।",
          },
          {
            key: "B",
            text: "NULL হয়ে যাবে, কারণ EXCLUDED এ তালিকায় না থাকা Column এর মান DEFAULT, যা এখানে NULL",
            isCorrect: true,
            explanation:
              "ঠিক। EXCLUDED হলো যে Row টা ঢুকতে চেয়েছিল, ঠিক যেমনটা ঢুকত। অংশ 005 এ Rahim এর ফোন এভাবেই মুছে গিয়েছিল। সমাধান COALESCE(EXCLUDED.phone, c.phone)।",
          },
          {
            key: "C",
            text: "Error আসবে, কারণ EXCLUDED এ phone নেই",
            isCorrect: false,
            explanation: "EXCLUDED এ Table এর সব Column থাকে, তালিকায় না থাকলেও। Error আসে না, আর সেটাই বিপদ।",
          },
          {
            key: "D",
            text: "খালি লেখা '' বসবে",
            isCorrect: false,
            explanation: "PostgreSQL NULL কে কখনো খালি লেখায় বদলায় না। এমন বদলে নেওয়া দেখা যায় MySQL এর INSERT IGNORE এ।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা Feed এ tour_id 1 দুইবার আছে, দুটো আলাদা দামে। সেটা সরাসরি INSERT ... ON CONFLICT (tour_id) DO UPDATE এ পাঠানো হলো। কী হবে?",
        options: [
          {
            key: "A",
            text: "শেষ Row এর দাম বসবে",
            isCorrect: false,
            explanation: "SQL এ Row প্রক্রিয়ার ক্রম নিশ্চিত না, তাই শেষ বলে কিছু নেই। PostgreSQL অনুমান করে না।",
          },
          {
            key: "B",
            text: "প্রথম Row এর দাম বসবে, দ্বিতীয়টা বাদ",
            isCorrect: false,
            explanation: "এটা DO NOTHING এর আচরণ। DO UPDATE এ একই Row দুইবার বদলানোর চেষ্টায় Error আসে।",
          },
          {
            key: "C",
            text: "ERROR 21000: ON CONFLICT DO UPDATE command cannot affect row a second time, আর কিছুই বদলায় না",
            isCorrect: true,
            explanation:
              "ঠিক। পুরো Statement বাতিল। সমাধান হলো পাঠানোর আগে DISTINCT ON দিয়ে প্রতিটা tour_id এর সবচেয়ে নতুন Row বাছা, অথবা GROUP BY দিয়ে যোগ করা।",
          },
          {
            key: "D",
            text: "দুই দামের গড় বসবে",
            isCorrect: false,
            explanation: "PostgreSQL নিজে থেকে কোনো হিসাব করে না। গড় চাইলে আপনাকে GROUP BY আর avg() দিয়ে আগেই বানাতে হবে।",
          },
        ],
      },
      {
        id: 6,
        text: "DO UPDATE SET price_bdt = EXCLUDED.price_bdt WHERE t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt। একটা Row মিলল, কিন্তু দাম একই। সেই Row এর কী হয়?",
        options: [
          {
            key: "A",
            text: "বদলায় না, Command Tag এ গোনা হয় না, RETURNING এ আসে না, তবে Lock হয়",
            isCorrect: true,
            explanation:
              "ঠিক। Documentation বলে WHERE মিথ্যা হলে Row টা Lock হয় কিন্তু বদলায় না, আর শুধু সত্যিই বদলানো Row ফেরত আসে। অংশ 007 এ তিন Row এর মধ্যে RETURNING এ এসেছিল দুটো, আর Lab এর Command Tag ছিল INSERT 0 2।",
          },
          {
            key: "B",
            text: "নতুন একটা Row হিসেবে ঢুকে যায়",
            isCorrect: false,
            explanation: "মিল পাওয়া Row কখনো আলাদা করে ঢোকে না, ঢুকলে তো Unique নিয়মই ভাঙত।",
          },
          {
            key: "C",
            text: "Error আসে, কারণ WHERE মিথ্যা হলে Conflict সামলানো যায় না",
            isCorrect: false,
            explanation: "WHERE মিথ্যা হওয়া স্বাভাবিক ঘটনা, Error না। Row টা শুধু ছুঁয়ে দেখা হয় না।",
          },
          {
            key: "D",
            text: "বদলায় না, কিন্তু Command Tag এ গোনা হয়",
            isCorrect: false,
            explanation: "Command Tag শুধু ঢোকানো আর সত্যিই বদলানো Row গোনে। WHERE এর কারণে বাদ পড়া Row গোনায় আসে না।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা App এ একই মুহূর্তে একই নতুন Email দুই দিক থেকে আসতে পারে। Developer MERGE ... WHEN MATCHED THEN UPDATE WHEN NOT MATCHED THEN INSERT লিখলেন। ঝুঁকি কী?",
        options: [
          {
            key: "A",
            text: "কোনো ঝুঁকি নেই, MERGE আর ON CONFLICT একই জিনিস",
            isCorrect: false,
            explanation: "Documentation নিজেই বলে দুটো বদলযোগ্য না, আর একসাথে INSERT এর বেলায় ON CONFLICT বিবেচনা করতে বলে।",
          },
          {
            key: "B",
            text: "দ্বিতীয় MERGE কখনো কখনো 23505 duplicate key Error পেতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। দুই psql জানালার পরীক্ষায় দ্বিতীয় MERGE শুরুতে Row টা দেখতে পায়নি, NOT MATCHED ধরে INSERT করতে গিয়েছিল, আর প্রথমটা COMMIT করতেই Error। ON CONFLICT DO UPDATE সেখানে Row টা বদলেছিল।",
          },
          {
            key: "C",
            text: "MERGE Table এ একই Email দুইবার ঢুকিয়ে দেবে",
            isCorrect: false,
            explanation: "Unique Index থাকলে কোনো Statement ই নকল ঢোকাতে পারে না। ঝুঁকি Error এর, নষ্ট Data এর না।",
          },
          {
            key: "D",
            text: "MERGE চলবেই না, কারণ MERGE এ Unique Index লাগে",
            isCorrect: false,
            explanation: "উল্টো: MERGE এ Unique Index লাগে না, যেকোনো ON শর্ত চলে। Unique Index লাগে ON CONFLICT এ।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL এ ups_members এর Rahim (member_id 1) এর দুটো Wishlist Row আছে, Foreign Key ON DELETE CASCADE সহ। REPLACE INTO ups_members (email, full_name) VALUES (Rahim এর email, 'Rahim Uddin') চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Rahim এর Row জায়গায় দাঁড়িয়ে বদলায়, Wishlist অক্ষত",
            isCorrect: false,
            explanation: "এটা ON DUPLICATE KEY UPDATE এর আচরণ। REPLACE পুরনো Row মুছে নতুন ঢোকায়।",
          },
          {
            key: "B",
            text: "Error, কারণ Wishlist এ Rahim এর Row আছে",
            isCorrect: false,
            explanation: "Foreign Key এ RESTRICT থাকলে Error আসত। এখানে CASCADE, তাই মোছা চলে আর সম্পর্কিত Row ও মুছে যায়।",
          },
          {
            key: "C",
            text: "পুরনো Row মুছে যায়, CASCADE এ দুটো Wishlist Row ও, DELETE Trigger চলে, আর Rahim নতুন member_id আর খালি ফোন নিয়ে ফিরে আসেন",
            isCorrect: true,
            explanation:
              "ঠিক। MySQL 8.4 এর পরীক্ষায় 2 rows affected (1 মোছা, 1 ঢোকানো), Rahim হলেন member_id 3, ফোন NULL, Wishlist এর তাঁর দুটো Row গায়েব, আর Delete Log এ একটা Row।",
          },
          {
            key: "D",
            text: "কিছুই হয় না, কারণ একই Email আগে থেকেই আছে",
            isCorrect: false,
            explanation: "এটা INSERT IGNORE এর আচরণ। REPLACE নকল পেলে চুপ থাকে না, পুরনোটা মুছে ফেলে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর তিনটা Upsert, প্রমাণসহ",
    time: "৭৫ থেকে ১০০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Newsletter:</strong> <code className={CODE}>ups_newsletter</code> Table বানান (email, নাম, যোগ দেওয়ার তারিখ), Email এ বড়
        ছোট হাত না মেনে Unique (lower() এর Index)। দশটা নামের একটা তালিকা DO NOTHING দিয়ে দুইবার পাঠান, যার তিনটা নকল আর একটা বড় হাতে লেখা।
        প্রতিবার RETURNING এর Row আর Table এর মোট সংখ্যা লিখে রাখুন।
      </span>,
      <span key="2">
        <strong>রাতের দামের Job:</strong> অংশ 014 এর মতো নিজের একটা Feed বানান অন্তত আটটা Row এর, যেখানে নকল, একই দাম, বন্ধ ট্যুর আর নতুন ট্যুর
        সবই আছে। এক Statement এ DISTINCT ON, DO UPDATE ... WHERE আর RETURNING old ও new দিয়ে রিপোর্ট বানান। তারপর পাশাপাশি যাচাইয়ের Query তে
        দেখান রিপোর্টের প্রতিটা Row বাস্তবের সাথে মেলে।
      </span>,
      <span key="3">
        <strong>গণনা:</strong> ট্যুর আর দিনের হিসাবে পাতা খোলার একটা Table বানান first_seen_at আর last_seen_at সহ। একটা একটা করে পাঁচটা খবর
        পাঠান, যার একটা দেরিতে আসা। তারপর একটা Log Table থেকে GROUP BY দিয়ে একবারে যোগ করুন। GROUP BY বাদ দিলে কোন Error আসে, সেটাও লিখুন।
      </span>,
      <span key="4">
        <strong>MERGE বনাম ON CONFLICT:</strong> Task 2 এর কাজ MERGE দিয়ে আবার করুন, সাথে Feed এ না থাকা চালু ট্যুর বন্ধ করার WHEN NOT MATCHED BY
        SOURCE। merge_action() দিয়ে রিপোর্ট নিন। তারপর দুটো psql জানালায় অংশ 012 এর দৌড়টা নিজে চালিয়ে ON CONFLICT আর MERGE এর ফল পাশাপাশি
        লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> রেলস্টেশনের দুই জানালার উদাহরণ দিয়ে বোঝান, কেন আগে খুঁজে তারপর ঢোকানো ভাঙে, ON CONFLICT
        কীভাবে সেই ফাঁক বন্ধ করে, আর MySQL এর REPLACE INTO কেন Upsert না।
      </span>,
    ],
    deliverables: [
      <span key="d1">ups_newsletter এর CREATE আর দুই দফার ফলাফলের ছক</span>,
      <span key="d2">রাতের Job এর Statement, রিপোর্ট আর যাচাইয়ের Query</span>,
      <span key="d3">গণনার Table, পাঁচটা খবরের পরের অবস্থা আর GROUP BY ছাড়া Error এর লেখা</span>,
      <span key="d4">MERGE এর Statement, তার রিপোর্ট আর দুই জানালার দৌড়ের ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Upsert",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "DO NOTHING আর RETURNING",
        description:
          "প্রথম ফাইল destinations এর একটা Copy বানায় আর তিনটা গন্তব্য পাঠায়, যার একটা আগে থেকেই আছে। RETURNING এ 2টা নাম, INSERT 0 2, শেষে count 9।",
      },
      {
        title: "দামের রিপোর্ট, WHERE সহ",
        description:
          "দ্বিতীয় ফাইল tours এর Copy তে তিনটা দাম পাঠায়। একই দামের Cox's Bazar বাদ, তাই RETURNING এ 2টা Row আর INSERT 0 2। Tour 10 এর old_price খালি।",
      },
      {
        title: "একই Statement তিনবার",
        description:
          "তৃতীয় ফাইল গণনার Upsert একবার চালায়, তারপর psql এর \\g দিয়ে আরও দুইবার। প্রতিবার INSERT 0 1, শেষে views 3।",
      },
      {
        title: "দুই জানালার দৌড়",
        description:
          "চতুর্থ ফাইলের নির্দেশ মেনে দুটো Terminal এ psql খুলুন। জানালা A COMMIT না করা পর্যন্ত জানালা B আটকে থাকবে। ON CONFLICT হলে INSERT 0 0, সাধারণ INSERT হলে duplicate key Error।",
      },
      {
        title: "MERGE আর merge_action()",
        description:
          "পঞ্চম ফাইল দ্বিতীয় ড্রিলের ups_lab_tours কে একটা Catalog এর সাথে মেলায়। দ্বিতীয় ড্রিল আগে চালানো থাকতে হবে। 4টা Row: Tour 1 আর 10 এর দাম, Tour 7 আর 9 বন্ধ।",
      },
      {
        title: "দুটো Error, তারপর পরিষ্কার",
        description:
          "ষষ্ঠ ফাইল VERBOSITY verbose করে 42P10 আর 21000 দেখায়, LOCATION লাইন সহ। শেষে লেসনের সব ups_lab Table মুছে ফেলে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-do-nothing.sql",
        code: `DROP TABLE IF EXISTS ups_lab_destinations;
CREATE TABLE ups_lab_destinations AS
SELECT name, region, kind FROM destinations;
ALTER TABLE ups_lab_destinations ADD PRIMARY KEY (name);

INSERT INTO ups_lab_destinations (name, region, kind) VALUES
  ('Sajek Valley', 'Chattogram', 'hills'),
  ('Tanguar Haor', 'Sylhet', 'wetland'),
  ('Paharpur', 'Rajshahi', 'heritage')
ON CONFLICT (name) DO NOTHING
RETURNING name;
--      name
-- --------------
--  Tanguar Haor
--  Paharpur
-- (2 rows)
--
-- INSERT 0 2

SELECT count(*) FROM ups_lab_destinations;
-- 9`,
      },
      {
        language: "sql",
        filename: "02-price-report.sql",
        code: `DROP TABLE IF EXISTS ups_lab_tours;
CREATE TABLE ups_lab_tours AS
SELECT tour_id, title, price_bdt, is_active FROM tours;
ALTER TABLE ups_lab_tours ADD PRIMARY KEY (tour_id);

INSERT INTO ups_lab_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1,  'Saint Martin Island Escape', 13000.00, true),
  (2,  'Cox''s Bazar Beach Weekend',  8500.00, true),
  (10, 'Kuakata Sunrise Weekend',     9000.00, true)
ON CONFLICT (tour_id) DO UPDATE
SET price_bdt = EXCLUDED.price_bdt
WHERE t.price_bdt IS DISTINCT FROM EXCLUDED.price_bdt
RETURNING t.tour_id, old.price_bdt AS old_price, new.price_bdt AS new_price;
--  tour_id | old_price | new_price
-- ---------+-----------+-----------
--        1 |  12500.00 |  13000.00
--       10 |           |   9000.00
-- (2 rows)
--
-- INSERT 0 2`,
      },
      {
        language: "sql",
        filename: "03-counter.sql",
        code: `DROP TABLE IF EXISTS ups_lab_views;
CREATE TABLE ups_lab_views (
  tour_id integer NOT NULL,
  view_on date    NOT NULL,
  views   integer NOT NULL DEFAULT 1,
  PRIMARY KEY (tour_id, view_on)
);

INSERT INTO ups_lab_views AS v (tour_id, view_on) VALUES (1, '2026-11-01')
ON CONFLICT (tour_id, view_on) DO UPDATE SET views = v.views + 1;
-- INSERT 0 1
\\g
-- INSERT 0 1     (\\g আগের Statement টা আবার পাঠায়)
\\g
-- INSERT 0 1

SELECT * FROM ups_lab_views;
--  tour_id |  view_on   | views
-- ---------+------------+-------
--        1 | 2026-11-01 |     3
-- (1 row)`,
      },
      {
        language: "sql",
        filename: "04-two-windows.sql",
        code: `-- প্রস্তুতি, যেকোনো একটা জানালায় একবার
DROP TABLE IF EXISTS ups_race_subscribers;
CREATE TABLE ups_race_subscribers (
  email     text PRIMARY KEY,
  full_name text NOT NULL
);

-- জানালা A
BEGIN;
INSERT INTO ups_race_subscribers (email, full_name)
VALUES ('jui.sarker@mail.example', 'Jui Sarker');
-- INSERT 0 1     (এখনো COMMIT করবেন না)

-- জানালা B
INSERT INTO ups_race_subscribers (email, full_name)
VALUES ('jui.sarker@mail.example', 'Jui S.')
ON CONFLICT (email) DO NOTHING;
-- (এখানে আটকে থাকবে, Prompt ফিরবে না)

-- জানালা A
COMMIT;

-- জানালা B তখনই দেখাবে
-- INSERT 0 0

-- এবার Table খালি করে (DELETE FROM ups_race_subscribers;) একই দৌড় আবার চালান,
-- শুধু জানালা B তে ON CONFLICT এর লাইনটা বাদ দিয়ে। COMMIT এর পরে জানালা B তে:
-- ERROR:  duplicate key value violates unique constraint "ups_race_subscribers_pkey"
-- DETAIL:  Key (email)=(jui.sarker@mail.example) already exists.`,
      },
      {
        language: "sql",
        filename: "05-merge.sql",
        code: `-- দ্বিতীয় ড্রিলের ups_lab_tours লাগবে
DROP TABLE IF EXISTS ups_lab_catalog;
CREATE TABLE ups_lab_catalog AS
SELECT tour_id, title, price_bdt FROM tours WHERE tour_id <= 6;
UPDATE ups_lab_catalog SET price_bdt = 13500.00 WHERE tour_id = 1;
INSERT INTO ups_lab_catalog VALUES (10, 'Kuakata Sunrise Weekend', 9900.00);

WITH changes AS (
  MERGE INTO ups_lab_tours AS t
  USING ups_lab_catalog AS c
  ON t.tour_id = c.tour_id
  WHEN MATCHED AND t.price_bdt <> c.price_bdt THEN
    UPDATE SET price_bdt = c.price_bdt
  WHEN NOT MATCHED THEN
    INSERT (tour_id, title, price_bdt, is_active)
    VALUES (c.tour_id, c.title, c.price_bdt, true)
  WHEN NOT MATCHED BY SOURCE AND t.is_active THEN
    UPDATE SET is_active = false
  RETURNING merge_action() AS action, t.tour_id, old.price_bdt AS old_price,
            new.price_bdt AS new_price, new.is_active AS active
)
SELECT * FROM changes ORDER BY tour_id;
--  action | tour_id | old_price | new_price | active
-- --------+---------+-----------+-----------+--------
--  UPDATE |       1 |  13000.00 |  13500.00 | t
--  UPDATE |       7 |   3500.00 |   3500.00 | f
--  UPDATE |       9 |  15500.00 |  15500.00 | f
--  UPDATE |      10 |   9000.00 |   9900.00 | t
-- (4 rows)`,
      },
      {
        language: "sql",
        filename: "06-errors-clean-up.sql",
        code: `\\set VERBOSITY verbose

INSERT INTO ups_lab_tours (tour_id, title, price_bdt, is_active)
VALUES (1, 'Saint Martin Island Escape', 13000.00, true)
ON CONFLICT (title) DO NOTHING;
-- ERROR:  42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification
-- LOCATION:  infer_arbiter_indexes, plancat.c:958

INSERT INTO ups_lab_tours AS t (tour_id, title, price_bdt, is_active) VALUES
  (1, 'Saint Martin Island Escape', 12800.00, true),
  (1, 'Saint Martin Island Escape', 13000.00, true)
ON CONFLICT (tour_id) DO UPDATE SET price_bdt = EXCLUDED.price_bdt;
-- ERROR:  21000: ON CONFLICT DO UPDATE command cannot affect row a second time
-- HINT:  Ensure that no rows proposed for insertion within the same command have duplicate constrained values.
-- LOCATION:  ExecOnConflictUpdate, nodeModifyTable.c:2804

\\set VERBOSITY default

DROP TABLE IF EXISTS ups_lab_destinations, ups_lab_tours, ups_lab_views,
                     ups_lab_catalog, ups_race_subscribers;`,
      },
    ],
    tip: (
      <ContentParagraph>
        psql এ <code className={CODE}>\g</code> আগের Statement টা হুবহু আবার পাঠায়, তাই গণনার মতো Upsert বারবার চালিয়ে দেখার সবচেয়ে সহজ উপায়
        এটাই। আর দুই জানালার দৌড়ে জানালা B আটকে আছে মানে কিছু ভাঙেনি, সে শুধু জানালা A এর সিদ্ধান্তের অপেক্ষায়: COMMIT অথবা ROLLBACK। জানালা
        A তে ROLLBACK দিয়ে দেখুন: তখন জানালা B এর Row টাই ঢুকে যাবে।
      </ContentParagraph>
    ),
  },
};
