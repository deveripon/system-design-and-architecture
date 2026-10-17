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
  FrameValueLab,
  LagLeadLab,
  NtileLab,
} from "../../../components/course/topics/windows/laglead-animations";
import {
  GapMonthsSplit,
  LastValueTrapDiagram,
  LookBackAheadDiagram,
  PartitionWallsDiagram,
} from "../../../components/course/topics/windows/laglead-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const MONTHLY_CHANGE = `WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month,
         sum(total_bdt) AS revenue
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       lag(revenue) OVER w AS prev_revenue,
       revenue - lag(revenue) OVER w AS change,
       round(100.0 * (revenue - lag(revenue) OVER w)
             / NULLIF(lag(revenue) OVER w, 0), 1) AS change_pct
FROM monthly
WINDOW w AS (ORDER BY month)
ORDER BY month;`;

const FILLED_MONTHS = `WITH months AS (
  SELECT generate_series(DATE '2025-12-01', DATE '2026-10-01',
                         INTERVAL '1 month')::date AS month
),
monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month,
         sum(total_bdt) AS revenue
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
),
filled AS (
  SELECT m.month, coalesce(r.revenue, 0) AS revenue
  FROM months m
  LEFT JOIN monthly r ON r.month = m.month
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       lag(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - lag(revenue) OVER (ORDER BY month) AS change
FROM filled
ORDER BY month;`;

const RATES = `WITH rates (rate_date, usd_bdt) AS (
  VALUES (DATE '2026-10-25', 122.10), (DATE '2026-10-26', 122.25),
         (DATE '2026-10-27', NULL),   (DATE '2026-10-28', 122.40),
         (DATE '2026-10-29', 122.35), (DATE '2026-10-30', NULL),
         (DATE '2026-10-31', NULL),   (DATE '2026-11-01', 122.50)
)`;

const REBOOKING_REPORT = `WITH visits AS (
  SELECT c.customer_id, c.full_name, b.booked_at::date AS booked_on,
         b.booked_at::date - lag(b.booked_at::date)
           OVER (PARTITION BY c.customer_id ORDER BY b.booked_at) AS gap_days
  FROM customers c
  JOIN bookings b ON b.customer_id = c.customer_id
)
SELECT full_name,
       count(*) AS bookings,
       min(booked_on) AS first_on,
       max(booked_on) AS last_on,
       round(avg(gap_days)) AS avg_gap_days,
       DATE '2026-11-01' - max(booked_on) AS days_since_last
FROM visits
GROUP BY customer_id, full_name
HAVING count(*) >= 2
ORDER BY days_since_last DESC, full_name;`;

export const lagLeadContent: TopicData = {
  id: "lag-lead",
  introduction: {
    badge: "MODULE 08 · LESSON 05",
    title: <SectionTitle>পাশের Row এর দিকে তাকানো: LAG, LEAD আর তাদের সঙ্গীরা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি Window Function দিয়ে প্রতিটা Row এর পাশে একটা হিসাব বসিয়েছেন: সবার গড়, একটা Rank,
          একটা চলমান যোগফল। প্রতিটা ক্ষেত্রে প্রশ্নটা ছিল একদল Row কে নিয়ে। কিন্তু ব্যবসার অনেক প্রশ্ন আসলে দুটো
          পাশাপাশি Row এর তুলনা। গত মাসের চেয়ে এই মাসে আয় কত বাড়ল? একজন Customer আগের বুকিংয়ের কত দিন পর আবার
          এলেন? একটা ট্যুরের পরের Departure কবে?
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই প্রশ্নগুলোর জন্য। LAG আগের Row এর মান এনে বর্তমান Row এর পাশে বসায়, LEAD আনে পরের Row এর মান।
          FIRST_VALUE, LAST_VALUE আর NTH_VALUE আনে একটা দলের প্রথম, শেষ বা যেকোনো ক্রমের Row এর মান। NTILE Row গুলোকে
          প্রায় সমান কয়েকটা ভাগে ভাগ করে দেয়। পথে আপনি দেখবেন কেন LAST_VALUE প্রথমবার চালালে ভাঙা মনে হয়, আর IGNORE
          NULLS নিয়ে PostgreSQL 18 আর MySQL 8.4 আসলে কী করে, দুটোতেই চালিয়ে দেখা।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি প্রতিটা Customer এর দুই বুকিংয়ের মাঝের দিন গুনতে পারবেন, মাসের পর মাস আয়ের পরিবর্তন বের করতে
          পারবেন, ফাঁকা মাস থাকলেও সেই তুলনা ঠিক রাখতে পারবেন, আর ট্যুরগুলোকে দামের চার ভাগে সাজাতে পারবেন। সব উদাহরণ
          Island Tours এর আসল Data তে, আর প্রতিটা ফলাফল এই পাতার Query Box এ নিজে চালিয়ে মেলানো যায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি আপনার প্রতিটা Row এর হাতে একটা আয়না ধরিয়ে দিই, যাতে সে ঠিক পেছনের Row টা দেখতে পায়। কে পেছনে, সেটা আপনি ORDER BY দিয়ে বলে দেন। আর কোন ঘরের দেয়াল আমি কখনো পার হব না, সেটা বলে দেয় PARTITION BY।",
      author: "LAG",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ফারুক সাহেবের রবিবারের দুটো প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আজ রবিবার, ১ নভেম্বর 2026। Island Tours এর সাপ্তাহিক মিটিং। ফারুক সাহেব এবার দুটো প্রশ্ন নিয়ে এসেছেন।
                প্রথম প্রশ্ন: যাঁরা আমাদের সাথে আবার ঘুরতে যান, তাঁরা আগের বুকিংয়ের কত দিন পর আবার বুক করেন? দ্বিতীয়
                প্রশ্ন: প্রতি মাসে আয় আগের মাসের চেয়ে কত বাড়ল বা কমল?
              </ContentParagraph>
              <ContentParagraph>
                তানিম প্রথম প্রশ্নটা নিয়ে বসলেন। প্রতিটা Booking এর পাশে সেই একই Customer এর আগের Booking টা দরকার।
                তাঁর মনে পড়ল Module 06 এর{" "}
                <Link href="/sql/topic/self-join" className={LINK}>
                  Self Join
                </Link>
                : bookings Table কে নিজের সাথেই জোড়া, শর্ত হলো একই Customer আর আগের সময়। তিনি লিখলেন নিচের Query টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: Self Join"
              query={`SELECT b1.customer_id, b1.booking_id, b2.booking_id AS earlier_booking
FROM bookings b1
JOIN bookings b2
  ON b2.customer_id = b1.customer_id
 AND b2.booked_at < b1.booked_at
ORDER BY b1.customer_id, b1.booked_at, b2.booked_at;`}
              caption="১১টা Row আসে। Customer 1 এর Booking 17 দুইবার: একবার Booking 1 এর পাশে, একবার Booking 8 এর পাশে। কারণ শর্তটা বলছে আগের যেকোনো Booking, ঠিক আগেরটা না। আর যাঁদের প্রথম Booking, তাঁরা পুরো বাদ পড়েছেন, কারণ তাঁদের আগে জোড়ার মতো কিছু নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঠিক আগের Booking টা পেতে তানিমকে আরেকটা শর্ত যোগ করতে হবে: এই দুটোর মাঝখানে ওই Customer এর আর কোনো
                Booking নেই। সেটা মানে একটা NOT EXISTS বা MAX দিয়ে{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  Correlated Subquery
                </Link>
                , যেটা প্রতিটা Row এর জন্য আবার Table এ খোঁজে। Query লম্বা হচ্ছে, পড়তে কঠিন হচ্ছে, আর প্রথম Booking গুলো
                ফেরত আনতে আবার LEFT JOIN লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                নাদিয়া পাশের ডেস্ক থেকে বললেন, এই কাজের জন্য একটা Window Function আছে, নাম LAG। Table কে নিজের সাথে
                জোড়ার দরকার নেই। প্রতিটা Customer এর Booking গুলো সময়ের ক্রমে সাজান, তারপর প্রতিটা Row কে বলুন ঠিক
                পেছনের Row এর booking_id টা এনে পাশে বসাতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, LAG দিয়ে"
              query={`SELECT customer_id, booking_id,
       lag(booking_id) OVER (PARTITION BY customer_id ORDER BY booked_at) AS previous_booking
FROM bookings
ORDER BY customer_id, booked_at;`}
              caption="২৪টা Row, প্রতিটা Booking ঠিক একবার। Booking 17 এর পাশে এখন শুধু 8, যেটা সত্যিই তার ঠিক আগের Booking। ১০টা Row এ আগের Booking আছে। বাকি ১৪টা প্রতিটা Customer এর প্রথম Booking, তাদের পাশে NULL, অর্থাৎ পেছনে কেউ নেই। কোনো Row বাদ পড়েনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Value Function: যে Window Function হিসাব করে না, মান তুলে আনে",
          content: (
            <div className="space-y-3">
              <p>
                sum বা avg একদল Row থেকে নতুন সংখ্যা বানায়। LAG, LEAD, FIRST_VALUE, LAST_VALUE আর NTH_VALUE কিছু বানায় না,
                একই দলের অন্য একটা নির্দিষ্ট Row থেকে মান হুবহু তুলে আনে। অনেকে এদের একসাথে Value Function বলেন।
              </p>
              <p>
                তিনটা শব্দ বারবার আসবে। <strong>Current Row</strong> মানে যে Row এর জন্য এই মুহূর্তে হিসাব হচ্ছে।{" "}
                <strong>Partition</strong> মানে PARTITION BY দিয়ে বানানো দল, যেমন একজন Customer এর সব Booking।{" "}
                <strong>ক্রম</strong> আসে OVER এর ভেতরের ORDER BY থেকে, আর সেটাই ঠিক করে আগের Row আর পরের Row কোনটা।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "lag",
      subHeader: { index: "002", title: "LAG Looks Back" },
      title: <SectionTitle>LAG: ঠিক পেছনের Row এর মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LAG এর পুরো গঠন এরকম। বন্ধনীর ভেতরে প্রথমে সেই Column বা Expression যার মান আপনি আনতে চান। তারপর
                ঐচ্ছিকভাবে Offset, অর্থাৎ কত Row পেছনে। তারপর ঐচ্ছিকভাবে Default, অর্থাৎ সেখানে কোনো Row না থাকলে কী দেবে।
                এই দুটো নিয়ে পুরো একটা অংশ আছে একটু পরে। আপাতত Offset 1 আর Default NULL ধরে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "lag-shape.sql",
          code: `lag(value [, offset [, default]]) OVER (
  [PARTITION BY column, ...]
  ORDER BY column, ...
)
-- offset না দিলে 1, default না দিলে NULL`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OVER এর ভেতরের ORDER BY ই ঠিক করে আগের মানে কী। মাসের তালিকায় আগের মানে আগের মাস, Booking এর তালিকায়
                আগের মানে আগে করা Booking। ORDER BY না দিলে PostgreSQL কোনো Error দেয় না, কিন্তু Row গুলো কোন ক্রমে পড়বে
                তার কোনো নিশ্চয়তা নেই। তখন আজ যে উত্তর আসে, Data একটু বদলালে কাল অন্য উত্তর আসতে পারে। তাই LAG আর LEAD এ
                ORDER BY কে বাধ্যতামূলক ধরে নিন।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে মাসিক confirmed আয়ের ছয়টা আসল Row, বর্তমান Row 2026-02। LAG উপরের Row থেকে 92000.00 আনছে,
                LEAD নিচের Row থেকে 57600.00। প্রথম Row এর LAG আর শেষ Row এর LEAD NULL, কারণ সেখানে কেউ নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LookBackAheadDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো কোম্পানিতে আগের Booking কোনটা"
              query={`SELECT booking_id, booked_at,
       lag(booking_id) OVER (ORDER BY booked_at) AS previous_booking
FROM bookings
ORDER BY booked_at;`}
              caption="২৪টা Row। এখানে PARTITION BY নেই, তাই পুরো Table একটাই দল। প্রথম Row Booking 1, তার পেছনে কেউ নেই, তাই NULL। তৃতীয় Row Booking 4, তার আগেরটা Booking 2। Booking 3 আসে পঞ্চম Row এ, কারণ সেটা তৈরি হয়েছে 10 জানুয়ারি, Booking 4 আর 5 এর পরে। booking_id এর ক্রম আর সময়ের ক্রম এক না, তাই আগের ঠিক করতে booked_at, id না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ক্রমে সমান মান থাকলে Tie Breaker যোগ করুন",
          content: (
            <p>
              bookings এ ২৪টা Row, আর booked_at এ ২৪টাই আলাদা সময়। তাই কোন Booking কার আগে, সেটা নিশ্চিত। কিন্তু দুটো
              Row এর ক্রমের মান সমান হলে কোনটা আগে পড়বে সেটা PostgreSQL নিজের সুবিধামতো বাছে, আর তখন LAG একবার একটা,
              আরেকবার অন্যটা আনতে পারে। এমন হলে ORDER BY এর শেষে একটা Unique Column যোগ করুন, যেমন{" "}
              <code className={CODE}>ORDER BY booked_at, booking_id</code>। এই বাড়তি Column টাকে বলে Tie Breaker।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  প্রতিটা Booking এর booking_id, booked_at, আর পুরো কোম্পানিতে ঠিক আগের Booking এর booked_at দেখান, নাম
                  দিন previous_booked_at। ফলাফল booked_at অনুযায়ী পুরনো থেকে নতুন সাজান।
                </>
              }
              hint={
                <>
                  উপরের Query তে lag(booking_id) এর জায়গায় lag(booked_at) দিন। দল একটাই, তাই PARTITION BY লাগবে না।
                  ২৪টা Row আসার কথা, প্রথমটায় NULL।
                </>
              }
              solution={`SELECT booking_id, booked_at,
       lag(booked_at) OVER (ORDER BY booked_at) AS previous_booked_at
FROM bookings
ORDER BY booked_at;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "lead",
      subHeader: { index: "003", title: "LEAD Looks Ahead" },
      title: <SectionTitle>LEAD: ঠিক সামনের Row এর মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LEAD হুবহু LAG এর আয়না। গঠন একই, শুধু দিক উল্টো: Offset সংখ্যক Row সামনে গিয়ে মান আনে। অপারেশন টিম জানতে
                চায়, আজকের পর থেকে যে Departure গুলো আছে, প্রতিটার পরে কোম্পানির পরের Departure কবে, যাতে গাইড আর গাড়ি
                আগে থেকে ঠিক করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আজকের পরের Departure গুলো, প্রতিটার পরে কোনটা"
              query={`SELECT departure_id, tour_id, starts_on,
       lead(starts_on) OVER (ORDER BY starts_on, departure_id) AS next_departure_on
FROM departures
WHERE starts_on >= DATE '2026-11-01'
ORDER BY starts_on, departure_id;`}
              caption="৯টা Row। 14 নভেম্বরের Departure 14 এর পরে 20 নভেম্বর, তার পরে 21 নভেম্বর। শেষ Row 2027-02-14, তার সামনে কেউ নেই, তাই NULL। লক্ষ করুন, WHERE আগে চলে আর Window পরে, তাই LEAD শুধু ফিল্টার পার হওয়া ৯টা Row দেখে। পুরনো Departure গুলো তার কাছে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই ট্যুরের পরের Departure। প্রতিটা ট্যুর একটা আলাদা দল, যেটা আপনি{" "}
                <Link href="/sql/topic/partition-by" className={LINK}>
                  PARTITION BY
                </Link>{" "}
                লেসনে শিখেছেন। সাথে মাঝের দিন: PostgreSQL এ date থেকে date বিয়োগ করলে সরাসরি দিনের সংখ্যা আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ট্যুরের পরের Departure আর মাঝের দিন"
              query={`SELECT tour_id, departure_id, starts_on,
       lead(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) AS next_starts_on,
       lead(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) - starts_on AS days_to_next
FROM departures
ORDER BY tour_id, starts_on;`}
              caption="১৬টা Row। Tour 1 এর চারটা Departure, মাঝের ফাঁক 28, 281 আর 28 দিন, শেষটায় NULL। Tour 2 থেকে 6 এর দুটো করে Departure, ফাঁক যথাক্রমে 308, 302, 280, 295 আর 218 দিন। Tour 7 আর 8 এর একটাই Departure, তাই তাদের পরের কেউ নেই, দুটোই NULL। NULL থেকে কিছু বিয়োগ করলেও NULL।"
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
                  প্রতিটা Departure এর departure_id, tour_id, starts_on, আর একই ট্যুরের পরের Departure এর starts_on দেখান,
                  নাম দিন next_starts_on। যে Departure এর পরে সেই ট্যুরের আর কোনো Departure নেই, সেখানে NULL থাকবে।
                </>
              }
              hint={
                <>
                  LEAD লাগবে, আর দল হবে tour_id ধরে। দলের ভেতরের ক্রম starts_on। মোট ১৬টা Row, এদের ৮টায় NULL।
                </>
              }
              solution={`SELECT departure_id, tour_id, starts_on,
       lead(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) AS next_starts_on
FROM departures;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "partition-walls",
      subHeader: { index: "004", title: "One Customer at a Time" },
      title: <SectionTitle>PARTITION BY এর দেয়াল: LAG অন্যের ঘরে ঢোকে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের প্রথম প্রশ্নে ফিরি: একজন Customer আগের বুকিংয়ের কত দিন পর আবার বুক করেন। তানিম প্রথমে
                PARTITION BY লিখতে ভুলে গেলেন। Query চলল, কোনো Error নেই, সংখ্যাও এলো। শুধু সংখ্যাগুলো ভুল। কেন ভুল, সেটা
                তিনজন Customer এর উপর দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PARTITION BY ছাড়া: চুপচাপ ভুল উত্তর"
              query={`SELECT customer_id, booking_id, booked_at::date AS booked_on,
       booked_at::date - lag(booked_at::date) OVER (ORDER BY booked_at) AS days_since_prev
FROM bookings
WHERE customer_id IN (1, 2, 13)
ORDER BY customer_id, booked_at;`}
              caption="৭টা Row। Customer 2 এর প্রথম Booking এর পাশে 8 দিন, অথচ তার আগে তাঁর কোনো Booking নেই। LAG আসলে Customer 1 এর 20 ডিসেম্বরের Booking পড়েছে। Customer 13 এর প্রথম Booking এ 5 দিন, সেটা Customer 2 এর Booking থেকে। Customer 1 এর Booking 17 এ 18 দিন, সেটা Customer 13 এর Booking থেকে, অথচ আসল উত্তর 230।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY customer_id দিলে প্রতিটা Customer এর Booking গুলো একটা আলাদা ঘরে চলে যায়। LAG শুধু নিজের ঘরের
                ভেতরে পেছনে তাকায়। ঘরের প্রথম Row এর পেছনে দেয়াল, তাই সেখানে NULL, পাশের ঘরে আগের Row থাকলেও। নিচের ছবিতে
                সেই তিনজন Customer, প্রতিটা ঘরের প্রথম Row এ NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PartitionWallsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব Customer, প্রতিটা Booking এর আগের Booking থেকে কত দিন"
              query={`SELECT customer_id, booking_id, booked_at::date AS booked_on,
       lag(booked_at::date) OVER (PARTITION BY customer_id ORDER BY booked_at) AS prev_on,
       booked_at::date - lag(booked_at::date)
         OVER (PARTITION BY customer_id ORDER BY booked_at) AS days_since_prev
FROM bookings
ORDER BY customer_id, booked_at;`}
              caption="২৪টা Row, ১০টায় দিনের সংখ্যা: Customer 1 এ 62 আর 230, Customer 2 এ 261, 3 এ 275, 4 এ 279, 6 এ 246, 8 এ 226, 9 এ 222, 11 এ 247, আর 13 এ মাত্র 24। বাকি ১৪টা Row প্রতিটা Customer এর প্রথম Booking, তাই NULL। booked_at::date আগে ঢাকার সময়ে তারিখ বানায়, তারপর বিয়োগ, তাই উত্তর পুরো দিনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের Lab এ তিনজন Customer এর Data বেছে PARTITION BY চালু আর বন্ধ করুন, আর যেকোনো Row এ ক্লিক করে দেখুন
                LAG বা LEAD কোন Row থেকে মান আনছে। Offset আর Default পরের অংশের বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LagLeadLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "LAG এর ফলাফল দিয়ে WHERE এ Filter করা যায় না",
          content: (
            <p>
              শুধু দ্বিতীয় বা পরের Booking গুলো চাইলে মনে হতে পারে WHERE এ{" "}
              <code className={CODE}>lag(...) IS NOT NULL</code> লিখলেই হবে। হবে না, কারণ Window Function চলে WHERE এর
              পরে, আর PostgreSQL বলে ERROR: window functions are not allowed in WHERE।{" "}
              <Link href="/sql/topic/what-are-window-functions" className={LINK}>
                এই Module এর প্রথম লেসনে
              </Link>{" "}
              যেমন দেখেছেন, সমাধান হলো Window টা একটা CTE তে রাখা, তারপর বাইরের Query তে সেই নামের Column ধরে Filter।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  শুধু যে Booking গুলোর আগে সেই Customer এর অন্তত একটা Booking আছে, সেগুলো দেখান: customer_id, booking_id,
                  আর আগের Booking থেকে কত দিন (days_since_prev)। দিন হিসাব করবেন তারিখ ধরে, booked_at::date দিয়ে। ফলাফল
                  সবচেয়ে কম দিন থেকে বেশি দিনে সাজান।
                </>
              }
              hint={
                <>
                  প্রথমে একটা CTE তে প্রতিটা Booking এর days_since_prev বের করুন, PARTITION BY customer_id দিয়ে। তারপর
                  বাইরের Query তে WHERE days_since_prev IS NOT NULL। ১০টা Row আসবে, প্রথমটা 24 দিন, শেষটা 279।
                </>
              }
              solution={`WITH gaps AS (
  SELECT customer_id, booking_id,
         booked_at::date - lag(booked_at::date)
           OVER (PARTITION BY customer_id ORDER BY booked_at) AS days_since_prev
  FROM bookings
)
SELECT customer_id, booking_id, days_since_prev
FROM gaps
WHERE days_since_prev IS NOT NULL
ORDER BY days_since_prev;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "offset-default",
      subHeader: { index: "005", title: "Offset and Default" },
      title: <SectionTitle>Offset আর Default: কত Row দূরে, আর না পেলে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LAG আর LEAD এর দ্বিতীয় আর তৃতীয় জিনিসটা এবার কাজে লাগাই। <strong>Offset</strong> হলো কত Row দূরে তাকাবে।
                না দিলে 1। <code className={CODE}>lag(revenue, 2)</code> মানে দুই Row পেছনে, মাসের তালিকায় দুই মাস আগে।{" "}
                <strong>Default</strong> হলো সেই দূরত্বে কোনো Row না থাকলে NULL এর বদলে কী দেবে।{" "}
                <code className={CODE}>lag(revenue, 1, 0)</code> মানে এক Row পেছনে, আর পেছনে কেউ না থাকলে 0। Default দিতে
                চাইলে Offset লিখতেই হবে, কারণ এরা জায়গা দেখে চেনা যায়, নাম দিয়ে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক মাস আগে, দুই মাস আগে, আর না পেলে 0"
              query={`WITH monthly AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, sum(total_bdt) AS revenue
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT month, revenue,
       lag(revenue) OVER w       AS one_back,
       lag(revenue, 2) OVER w    AS two_back,
       lag(revenue, 1, 0) OVER w AS one_back_or_zero
FROM monthly
WINDOW w AS (ORDER BY month)
ORDER BY month;`}
              caption="৬টা Row। one_back এর প্রথম ঘরে NULL। two_back এর প্রথম দুই ঘরে NULL, তারপর 75000.00, 92000.00, 19000.00, 57600.00, অর্থাৎ দুই Row উপরের মান। one_back_or_zero এর প্রথম ঘরে 0, বাকিটা one_back এর মতোই। WINDOW w একই OVER কে একবার নাম দিয়ে তিন জায়গায় ব্যবহার করছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা সূক্ষ্ম কথা আছে, যেটা অনেকে প্রথমবার ভুল বোঝেন। Default কাজ করে শুধু তখন, যখন ওই দূরত্বে কোনো
                Row ই নেই। Row আছে, কিন্তু তার মান NULL, তাহলে LAG সেই NULL টাই আনে, Default না। নিচের চার দিনের ডলারের রেট
                বানানো, আসল না: 27 অক্টোবর রেট পাওয়া যায়নি, তাই NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Default বনাম COALESCE"
              query={`WITH rates (rate_date, usd_bdt) AS (
  VALUES (DATE '2026-10-25', 122.10), (DATE '2026-10-26', 122.25),
         (DATE '2026-10-27', NULL),   (DATE '2026-10-28', 122.40)
)
SELECT rate_date, usd_bdt,
       lag(usd_bdt, 1, 0) OVER (ORDER BY rate_date)     AS with_default,
       coalesce(lag(usd_bdt) OVER (ORDER BY rate_date), 0) AS with_coalesce
FROM rates
ORDER BY rate_date;`}
              caption="৪টা Row। প্রথম দিনে দুটো Column এই 0, কারণ পেছনে কোনো Row নেই। 28 অক্টোবরে with_default ফাঁকা, অর্থাৎ NULL, কারণ পেছনের Row আছে আর তার মান NULL। with_coalesce সেখানে 0, কারণ COALESCE যেকোনো NULL কেই বদলায়। কোনটা চান, সেটা প্রশ্নের উপর নির্ভর করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Default এর Type মূল মানের Type এর সাথে মিলতে হবে। তারিখের Column এ{" "}
                <code className={CODE}>{`'2026-01-01'`}</code> চলে, কারণ সেটা তারিখে বদলানো যায়। দামের Column এ লেখা দিলে চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Default এর Type না মিললে"
              query={`SELECT title, price_bdt,
       lag(price_bdt, 1, 'none') OVER (ORDER BY price_bdt) AS prev_price
FROM tours;`}
              caption="ERROR: invalid input syntax for type numeric: none। price_bdt একটা numeric, তাই Default ও numeric হতে হবে। লেখা দেখাতে চাইলে দুটোকেই লেখা বানান: lag(price_bdt::text, 1, 'none')। তাহলে ৯টা Row আসবে, প্রথমটায় none।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ঋণাত্মক Offset লিখবেন না",
          content: (
            <p>
              PostgreSQL এ <code className={CODE}>lag(x, -1)</code> দিক উল্টে দিয়ে <code className={CODE}>lead(x)</code>{" "}
              এর মতো কাজ করে, কারণ এখানে Offset প্রতিটা Row এর জন্য হিসাব হওয়া একটা Expression। পড়তে বিভ্রান্তিকর, আর
              MySQL এ একই জিনিস Syntax Error। সামনে তাকাতে চাইলে সরাসরি LEAD লিখুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "month-over-month",
      subHeader: { index: "006", title: "Month over Month" },
      title: <SectionTitle>মাসের পর মাস: আয় কত বাড়ল, কত কমল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের দ্বিতীয় প্রশ্ন, যাকে বলে Month over Month তুলনা: প্রতিটা মাসকে ঠিক আগের মাসের সাথে
                মেলানো। তানিম কাজটা তিন ধাপে ভাবলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক:</strong> একটা{" "}
                  <Link href="/sql/topic/ctes" className={LINK}>
                    CTE
                  </Link>{" "}
                  তে প্রতি মাসের confirmed আয়, date_trunc আর GROUP BY দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>দুই:</strong> মাসের ক্রমে LAG দিয়ে আগের মাসের আয়, তারপর বিয়োগ করে পরিবর্তন।
                </ListItem>
                <ListItem>
                  <strong>তিন:</strong> পরিবর্তনকে আগের মাসের আয় দিয়ে ভাগ করে শতাংশ। আগের মাস 0 হলে division by zero, তাই
                  নিচের সংখ্যাটা{" "}
                  <Link href="/sql/topic/null-functions" className={LINK}>
                    NULLIF
                  </Link>{" "}
                  দিয়ে লেখা: 0 হলে NULL, আর NULL দিয়ে ভাগে উত্তর NULL।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসিক আয়, আগের মাস, পরিবর্তন আর শতাংশ"
              query={MONTHLY_CHANGE}
              caption="৬টা Row। জানুয়ারিতে 17000.00 বেশি, 22.7%। ফেব্রুয়ারিতে 73000.00 কম, মাইনাস 79.3%। মার্চে 38600.00 বেশি, 203.2%। সেপ্টেম্বরে 7100.00 কম, মাইনাস 12.3%। অক্টোবরে 79000.00 বেশি, 156.4%। প্রথম মাস ডিসেম্বরের আগের মাস নেই, তাই তিনটা হিসাবই NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ছোট ভিতের উপর শতাংশ বড় দেখায়",
          content: (
            <p>
              মার্চের 203.2% দেখে মনে হয় মার্চ দারুণ মাস। আসলে মার্চের আয় 57600.00, জানুয়ারির 92000.00 এর চেয়ে অনেক কম।
              শতাংশটা বড় কারণ তুলনা হচ্ছে ফেব্রুয়ারির মাত্র 19000.00 এর সাথে। তাই Report এ শতাংশের পাশে সবসময় আসল
              পরিবর্তন আর আগের মাসের সংখ্যাটাও রাখুন, যেমন এখানে রাখা হয়েছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  confirmed Booking ধরে প্রতি মাসের আয় দেখান: month (YYYY-MM আকারের লেখা), revenue, আগের মাসের আয়
                  prev_revenue, আর পরিবর্তন change (এই মাস বিয়োগ আগের মাস)। মাসের ক্রমে সাজান।
                </>
              }
              hint={
                <>
                  একটা CTE তে to_char(booked_at, &apos;YYYY-MM&apos;) দিয়ে মাস আর sum(total_bdt) দিয়ে আয়। YYYY-MM লেখার
                  ক্রম আর মাসের ক্রম একই, তাই বাইরে ORDER BY month চলবে। ৬টা Row।
                </>
              }
              solution={`WITH monthly AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, sum(total_bdt) AS revenue
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT month, revenue,
       lag(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - lag(revenue) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "filling-gaps",
      subHeader: { index: "007", title: "Filling the Gaps" },
      title: <SectionTitle>আগের Row মানেই আগের মাস না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব Report টা দেখে একটা Row এ আঙুল রাখলেন। সেপ্টেম্বরে 7100.00 কম? সেপ্টেম্বরের আগের মাস তো আগস্ট,
                আর আগস্টে কোনো confirmed আয়ই ছিল না। তিনি ঠিক বলছেন। এপ্রিল থেকে আগস্ট পর্যন্ত কোনো confirmed Booking নেই,
                তাই monthly CTE তে ওই পাঁচ মাসের কোনো Row ই তৈরি হয়নি। LAG আগের Row পড়ে, আগের মাস না। তাই সেপ্টেম্বরের
                আগের Row হয়ে গেছে মার্চ।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো আগে প্রতিটা মাসের একটা করে Row এর ক্যালেন্ডার, তারপর তার সাথে আয় LEFT JOIN, আর আয় না থাকলে
                COALESCE দিয়ে 0। এভাবে ফাঁকা ঘর ভরানোকে বলে Gap Filling। ক্যালেন্ডার আসে generate_series থেকে, যেটা আপনি{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Date আর Time এর লেসনে
                </Link>{" "}
                দেখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GapMonthsSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্যালেন্ডার দিয়ে ফাঁকা মাস ভরানো, তারপর LAG"
              query={FILLED_MONTHS}
              caption="১১টা Row, ডিসেম্বর 2025 থেকে অক্টোবর 2026। এপ্রিলে আয় 0, পরিবর্তন মাইনাস 57600.00। মে থেকে আগস্ট আয় 0, পরিবর্তন 0। সেপ্টেম্বরের আগের মাস এখন আগস্ট, আগের আয় 0, পরিবর্তন 50500.00 বেশি, কম না। ভরা মাসে 0 দেখায়, 0.00 না, কারণ COALESCE এর 0 টা হাতে লেখা সংখ্যা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "সময়ের তুলনার আগে একটা প্রশ্ন",
          content: (
            <div className="space-y-3">
              <p>
                LAG দিয়ে দিন, সপ্তাহ বা মাসের তুলনা করার আগে নিজেকে জিজ্ঞেস করুন: প্রতিটা সময়ের ঘরের জন্য কি একটা Row আছে?
                Data আসে ঘটনা থেকে, আর যে মাসে কোনো ঘটনা নেই সেই মাসের কোনো Row থাকে না। নিশ্চিত না হলে আগে ক্যালেন্ডার,
                তারপর LAG।
              </p>
              <p>
                কোন তারিখ বা মাস একদম বাদ পড়েছে, সেটা খুঁজে বের করার আরও কৌশল আছে{" "}
                <Link href="/sql/topic/top-n-gaps-islands" className={LINK}>
                  পরের লেসনে
                </Link>
                , Gaps and Islands নামে।
              </p>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "first-value",
      subHeader: { index: "008", title: "FIRST_VALUE" },
      title: <SectionTitle>FIRST_VALUE: দলের প্রথম Row এর মান সবার পাশে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LAG আর LEAD তাকায় বর্তমান Row থেকে একটা নির্দিষ্ট দূরত্বে। কখনো দরকার হয় দলের একদম প্রথম Row টা, বর্তমান
                Row যেখানেই থাকুক। <code className={CODE}>first_value(value)</code> ঠিক সেটা করে: দলের ক্রম অনুযায়ী প্রথম
                Row এর মান প্রতিটা Row এর পাশে বসায়। ট্যুর অপারেশনের প্রশ্ন: প্রতিটা ট্যুর প্রথম কবে চলেছিল, আর প্রতিটা
                Departure সেই প্রথম যাত্রার কত দিন পরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের প্রথম Departure, আর তার থেকে কত দিন"
              query={`SELECT tour_id, departure_id, starts_on,
       first_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) AS first_on,
       starts_on - first_value(starts_on)
         OVER (PARTITION BY tour_id ORDER BY starts_on) AS days_since_first
FROM departures
WHERE tour_id IN (1, 2, 3)
ORDER BY tour_id, starts_on;`}
              caption="৮টা Row। Tour 1 এর চারটা Departure এর পাশেই first_on 2026-01-15, আর দিন 0, 28, 309, 337। Tour 2 এর প্রথম 2026-01-23, দ্বিতীয়টা তার 308 দিন পরে। Tour 3 এর প্রথম 2026-02-05, দ্বিতীয়টা 302 দিন পরে। প্রতিটা দলের প্রথম Row এ দিন 0, কারণ সে নিজেই প্রথম।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY না দিলে পুরো Table একটা দল, তখন FIRST_VALUE পুরো তালিকার প্রথম Row আনে। দামের ক্রমে সাজালে
                প্রথম Row মানে সবচেয়ে সস্তা ট্যুর। Marketing এর জন্য প্রতিটা ট্যুরের পাশে সবচেয়ে সস্তা ট্যুরের নাম আর তার
                চেয়ে কত বেশি, এক Query তে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবচেয়ে সস্তা ট্যুর সবার পাশে"
              query={`SELECT title, price_bdt,
       first_value(title) OVER (ORDER BY price_bdt, tour_id) AS cheapest,
       price_bdt - first_value(price_bdt) OVER (ORDER BY price_bdt, tour_id) AS above_cheapest
FROM tours
ORDER BY price_bdt, tour_id;`}
              caption="৯টা Row, প্রতিটার পাশে cheapest একই: Ratargul Swamp Boat Day। above_cheapest শুরু 0.00 দিয়ে, তারপর Sylhet Tea Garden Tour এ 4300.00, আর সবচেয়ে দামি Saint Martin Luxury Stay তে 28500.00। ORDER BY তে tour_id রাখা হয়েছে Tie Breaker হিসেবে, যাতে কোনোদিন দুটো ট্যুরের দাম সমান হলেও প্রথম Row নিশ্চিত থাকে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "last-value-trap",
      subHeader: { index: "009", title: "The LAST_VALUE Trap" },
      title: <SectionTitle>LAST_VALUE কেন ভাঙা মনে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FIRST_VALUE এত সহজে কাজ করল দেখে তানিম ভাবলেন, প্রতিটা ট্যুরের শেষ Departure পেতে LAST_VALUE লিখলেই হবে।
                লিখলেন, চালালেন, আর অবাক হলেন: প্রতিটা Row এর পাশে শেষ Departure না, সেই Row এর নিজের তারিখ। নিচের Box এ
                দুটো Column পাশাপাশি: last_default তানিমের লেখা, last_full ঠিক করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই LAST_VALUE, দুই রকম উত্তর"
              query={`SELECT tour_id, departure_id, starts_on,
       last_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) AS last_default,
       last_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on
                                   ROWS BETWEEN UNBOUNDED PRECEDING
                                            AND UNBOUNDED FOLLOWING) AS last_full
FROM departures
WHERE tour_id IN (1, 2)
ORDER BY tour_id, starts_on;`}
              caption="৬টা Row। last_default প্রতিটা Row এ starts_on এর হুবহু কপি: 2026-01-15, 2026-02-12, 2026-11-20, 2026-12-18। last_full Tour 1 এর চারটা Row এই 2026-12-18, আর Tour 2 এর দুটো Row এই 2026-11-27। দ্বিতীয়টাই তানিম চেয়েছিলেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কারণটা লুকিয়ে আছে একটা শব্দে: <strong>Frame</strong>। Frame মানে Partition এর ভেতরে বর্তমান Row এর জন্য যে
                Row গুলো হিসাবে ধরা হয়। OVER এর ভেতরে ORDER BY থাকলে আর Frame নিজে না লিখলে PostgreSQL ধরে নেয় Frame হলো{" "}
                <code className={CODE}>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, অর্থাৎ দলের প্রথম Row থেকে
                বর্তমান Row পর্যন্ত। এই Default Frame এর জন্যই{" "}
                <Link href="/sql/topic/running-totals-frames" className={LINK}>
                  আগের লেসনে
                </Link>{" "}
                শুধু ORDER BY লিখেই চলমান যোগফল পেয়েছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                LAST_VALUE আনে Frame এর শেষ Row, Partition এর না। Default Frame শেষ হয় বর্তমান Row এ, তাই প্রতিটা Row এর
                LAST_VALUE সে নিজে। FIRST_VALUE এই ফাঁদে পড়ে না, কারণ Frame সবসময় দলের প্রথম Row থেকে শুরু।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LastValueTrapDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FrameValueLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>সমাধান দুটো, দুটোই চলে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Frame কে পুরো দল পর্যন্ত বাড়ানো:</strong>{" "}
                  <code className={CODE}>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>। এখন প্রতিটা Row
                  এর Frame পুরো দল, তাই শেষ Row সবার জন্য একই। উপরের last_full এটাই।
                </ListItem>
                <ListItem>
                  <strong>ক্রম উল্টে FIRST_VALUE:</strong>{" "}
                  <code className={CODE}>first_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on DESC)</code>।
                  উল্টো ক্রমে প্রথম মানেই আসল ক্রমে শেষ, আর FIRST_VALUE এর Frame সমস্যা নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় সমাধান: উল্টো ক্রমে FIRST_VALUE"
              query={`SELECT tour_id, starts_on,
       first_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on DESC) AS last_on
FROM departures
WHERE tour_id IN (1, 2)
ORDER BY tour_id, starts_on;`}
              caption="৬টা Row, last_on উপরের last_full এর সাথে হুবহু মেলে: Tour 1 এ চারবার 2026-12-18, Tour 2 এ দুইবার 2026-11-27। Window এর ভেতরের DESC শুধু হিসাবের ক্রম বদলায়, শেষের ORDER BY দেখানোর ক্রম ঠিক রাখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সমান মান থাকলে Default Frame আরও অদ্ভুত",
          content: (
            <p>
              Default Frame টা RANGE, ROWS না। RANGE ক্রমের মান সমান এমন সব Row কে, যাদের বলে Peer, একসাথে Frame এ ঢোকায়।
              তাই দুটো Departure একই দিনে হলে দুটোরই LAST_VALUE হবে দ্বিতীয়টা। এই ফাঁদ আসল Row এ দেখানো আছে{" "}
              <Link href="/sql/topic/running-totals-frames" className={LINK}>
                Running Totals আর Frames
              </Link>{" "}
              লেসনে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  প্রতিটা Departure এর departure_id, tour_id, starts_on দেখান, আর পাশে সেই ট্যুরের প্রথম Departure এর
                  তারিখ first_on আর শেষ Departure এর তারিখ last_on। last_on প্রতিটা Row এ সত্যিই শেষ তারিখ হতে হবে।
                </>
              }
              hint={
                <>
                  দুটো হিসাবেই একই Window, তাই WINDOW w AS (...) দিয়ে একবার লিখুন: PARTITION BY tour_id, ORDER BY starts_on,
                  আর পুরো দলের Frame। ১৬টা Row, Tour 1 এর চারটাতেই last_on 2026-12-18।
                </>
              }
              solution={`SELECT departure_id, tour_id, starts_on,
       first_value(starts_on) OVER w AS first_on,
       last_value(starts_on) OVER w AS last_on
FROM departures
WINDOW w AS (PARTITION BY tour_id ORDER BY starts_on
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "nth-value",
      subHeader: { index: "010", title: "NTH_VALUE" },
      title: <SectionTitle>NTH_VALUE: দ্বিতীয়, তৃতীয়, যেকোনো ক্রমের Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FIRST_VALUE প্রথমটা আনে। দ্বিতীয় বা তৃতীয়টা চাইলে <code className={CODE}>nth_value(value, n)</code>, যেখানে n
                হলো Frame এর ভেতরে কত নম্বর Row, 1 থেকে শুরু। nth_value(x, 1) আর first_value(x) একই জিনিস। আর এখানেও সেই
                Frame এর নিয়ম খাটে: Default Frame এ বর্তমান Row পর্যন্ত যতগুলো Row, তার মধ্যে n নম্বর Row না থাকলে উত্তর NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় সস্তা ট্যুর, দুই রকম Frame এ"
              query={`SELECT title, price_bdt,
       nth_value(title, 2) OVER (ORDER BY price_bdt, tour_id) AS second_default,
       nth_value(title, 2) OVER (ORDER BY price_bdt, tour_id
                                 ROWS BETWEEN UNBOUNDED PRECEDING
                                          AND UNBOUNDED FOLLOWING) AS second_full
FROM tours
ORDER BY price_bdt, tour_id;`}
              caption="৯টা Row। second_full প্রতিটা Row এ Sylhet Tea Garden Tour। second_default প্রথম Row এ NULL, কারণ সবচেয়ে সস্তা Ratargul এর Frame এ তখন শুধু একটা Row, দ্বিতীয়টা এখনো আসেনি। দ্বিতীয় Row থেকে বাকি সব Row এ Sylhet।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা ট্যুরের দ্বিতীয় Departure চাইলে PARTITION BY tour_id দিন। প্রতিটা Departure এর পাশে একই উত্তর আসবে,
                তাই এক ট্যুরে এক Row রাখতে নিচে DISTINCT ব্যবহার করা হয়েছে। যে ট্যুরের একটাই Departure, তার দ্বিতীয়টা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের দ্বিতীয় Departure"
              query={`SELECT DISTINCT tour_id,
       nth_value(starts_on, 2) OVER (PARTITION BY tour_id ORDER BY starts_on
                                     ROWS BETWEEN UNBOUNDED PRECEDING
                                              AND UNBOUNDED FOLLOWING) AS second_departure
FROM departures
ORDER BY tour_id;`}
              caption="৮টা Row, প্রতি ট্যুরে একটা। Tour 1 এর দ্বিতীয় Departure 2026-02-12, Tour 2 এর 2026-11-27, Tour 6 এর 2026-11-14। Tour 7 আর 8 এ NULL, তাদের একটাই Departure।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SQL এর Standard এ শেষ দিক থেকে গোনার জন্য <code className={CODE}>nth_value(x, 2) FROM LAST</code> লেখার নিয়ম
                আছে। PostgreSQL 18 এ এটা নেই। লিখলে PostgreSQL FROM LAST কে Query এর FROM অংশ ভেবে পড়তে শুরু করে, তাই Error
                আসে একটু পরে, বিভ্রান্তিকর জায়গায়: OVER এর ভেতরে PARTITION BY tour_id থাকলে syntax error at or near BY।
                PostgreSQL এর Docs নিজেই সমাধান বলে দেয়: ক্রম উল্টে দিন। উপরের Query তে{" "}
                <code className={CODE}>ORDER BY starts_on DESC</code> লিখলে প্রতিটা ট্যুরের শেষ থেকে দ্বিতীয় Departure আসে:
                Tour 1 এ 2026-11-20, আর দুই Departure এর ট্যুরগুলোতে প্রথমটা, যেমন Tour 2 এ 2026-01-23।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "ntile",
      subHeader: { index: "011", title: "NTILE" },
      title: <SectionTitle>NTILE: ট্যুরগুলোকে দামের চার ভাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Marketing টিম ট্যুরগুলোকে চারটা দামের স্তরে দেখাতে চায়: সবচেয়ে সস্তা এক চতুর্থাংশ, তার পরের, তার পরের, আর
                সবচেয়ে দামি এক চতুর্থাংশ। এই চার ভাগের প্রতিটাকে বলে Quartile। <code className={CODE}>ntile(n)</code> ঠিক
                এই কাজ করে: ক্রম অনুযায়ী Row গুলোকে n টা প্রায় সমান ভাগে ভাগ করে, আর প্রতিটা Row এর পাশে তার ভাগের নম্বর
                বসায়, 1 থেকে n। প্রতিটা ভাগকে বলে Bucket।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা সহজ। ভাগগুলোর Row সংখ্যা যতটা সম্ভব সমান, পার্থক্য সর্বোচ্চ একটা Row। সমান ভাগ না হলে যা বাকি থাকে,
                সেগুলো একটা একটা করে প্রথম দিকের ভাগে যায়। ৯টা ট্যুরকে ৪ ভাগে ভাগ করলে প্রতি ভাগে ২টা, বাকি থাকে ১টা, সেটা
                যায় প্রথম ভাগে। তাই ভাগের মাপ 3, 2, 2, 2।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দামের Quartile"
              query={`SELECT title, price_bdt,
       ntile(4) OVER (ORDER BY price_bdt, tour_id) AS price_quartile
FROM tours
ORDER BY price_bdt, tour_id;`}
              caption="৯টা Row। Quartile 1 এ তিনটা ট্যুর: Ratargul, Sylhet আর Cox's Bazar Beach Weekend। Quartile 2 এ Sajek আর Saint Martin Island Escape। Quartile 3 এ Bandarban আর Cox's Bazar Family Package। Quartile 4 এ Sundarbans আর Saint Martin Luxury Stay।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NtileLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "NTILE গোনে Row, দাম না",
          content: (
            <div className="space-y-3">
              <p>
                NTILE ভাগ করে Row এর সংখ্যা ধরে, দামের দূরত্ব ধরে না। Cox&apos;s Bazar Beach Weekend 8500.00 আর Sajek 9500.00,
                মাত্র 1000 টাকার পার্থক্য, তবু দুটো আলাদা Quartile এ। Sundarbans 18000.00 আর Saint Martin Luxury Stay 32000.00,
                14000 টাকার পার্থক্য, তবু একই Quartile এ। দামের নির্দিষ্ট সীমা দিয়ে স্তর চাইলে CASE লিখুন।
              </p>
              <p>
                দুটো Row এর দাম সমান হলে কোনটা কোন ভাগে যাবে সেটা নিশ্চিত না, তাই ORDER BY তে tour_id এর মতো একটা Tie Breaker
                রাখুন। আর WHERE আগে চলে বলে Filter বদলালে ভাগও বদলায়: শুধু চালু থাকা ৮টা ট্যুর নিলে ৪ ভাগের প্রতিটায় ঠিক
                ২টা।
              </p>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভাগের সংখ্যা শূন্য হলে"
              query={`SELECT title, ntile(0) OVER (ORDER BY price_bdt, tour_id) AS bucket
FROM tours;`}
              caption="ERROR: argument of ntile must be greater than zero। ভাগের সংখ্যা অন্তত 1 হতে হবে। ntile(1) দিলে সব Row একটাই ভাগে, সবার পাশে 1।"
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
                  ট্যুরগুলোকে দাম অনুযায়ী তিনটা স্তরে ভাগ করুন: সস্তা, মাঝারি আর দামি। প্রতিটা ট্যুরের tour_id, title,
                  price_bdt আর স্তরের নম্বর band দেখান। দাম সমান হলে tour_id ছোট যেটার, সেটা আগে। ফলাফল দাম অনুযায়ী
                  কম থেকে বেশি সাজান।
                </>
              }
              hint={
                <>
                  ntile(3), ক্রম price_bdt তারপর tour_id। ৯টা ট্যুর তিন ভাগে সমানভাবে ভাগ হয়, তাই প্রতিটা band এ ৩টা করে।
                </>
              }
              solution={`SELECT tour_id, title, price_bdt,
       ntile(3) OVER (ORDER BY price_bdt, tour_id) AS band
FROM tours
ORDER BY price_bdt, tour_id;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "ignore-nulls",
      subHeader: { index: "012", title: "IGNORE NULLS" },
      title: <SectionTitle>IGNORE NULLS: কোথায় আছে, কোথায় নেই, না থাকলে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Oliver Bennett এর মতো বিদেশি Customer দের জন্য ফারুক সাহেব প্রতিদিনের ডলারের রেট রাখতে চান। ছুটির দিনে রেট
                আসে না, আর নিয়ম হলো সেদিন শেষ জানা রেটটাই চলবে। একে বলে Fill Forward: ফাঁকা ঘরে উপরের শেষ মানটা টেনে নামানো।
                নিচের রেট আর 27 অক্টোবরের ছুটি দুটোই বানানো, আসল না।
              </ContentParagraph>
              <ContentParagraph>
                সাধারণ LAG এখানে কাজ করে না। 28 অক্টোবরের আগের দিন 27 অক্টোবর, আর সেদিনের মান NULL, তাই LAG NULL ই আনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সাধারণ LAG ফাঁকা দিনেও আটকে যায়"
              query={`${RATES}
SELECT rate_date, usd_bdt,
       lag(usd_bdt) OVER (ORDER BY rate_date) AS previous_day_rate
FROM rates
ORDER BY rate_date;`}
              caption="৮টা Row। previous_day_rate: NULL, 122.10, 122.25, NULL, 122.40, 122.35, NULL, NULL। 28 অক্টোবর আর 1 নভেম্বর দুই দিনেই আগের দিনের রেট NULL, অথচ তার আগে জানা রেট ছিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SQL এর Standard এ এর জন্য একটা শব্দ আছে: <code className={CODE}>lag(x) IGNORE NULLS</code>, অর্থাৎ পেছনে
                তাকানোর সময় NULL মানের Row গুলো বাদ দিয়ে গোনা। উল্টোটা RESPECT NULLS, যেটা Default, অর্থাৎ NULL ও একটা Row
                হিসেবে গোনা। LEAD, FIRST_VALUE, LAST_VALUE আর NTH_VALUE এর জন্যও একই শব্দ। প্রশ্ন হলো আমাদের দুই Database
                এটা মানে কিনা। দুটোতেই চালিয়ে যা পাওয়া গেছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Database", "IGNORE NULLS লিখলে", "সূত্র"],
          rows: [
            [
              "PostgreSQL 18 (এই পাতার Box, PGlite 18.3)",
              "ERROR: syntax error at or near NULLS। RESPECT NULLS লিখলেও একই Error।",
              "PostgreSQL 18 এর Docs: Standard এর এই Option বাস্তবায়ন করা হয়নি, আচরণ সবসময় RESPECT NULLS এর মতো।",
            ],
            [
              "PostgreSQL 19",
              "এই লেখার সময় চালিয়ে দেখা যায়নি, কারণ 19 তখনো প্রকাশিত হয়নি।",
              "19 এর Release Notes, তারিখ লেখা AS OF 2026-10-09: lead, lag, first_value, last_value আর nth_value এ IGNORE NULLS আর RESPECT NULLS আসছে। FROM LAST তখনো নেই।",
            ],
            [
              "MySQL 8.4.11",
              "ERROR 1235 (42000): This version of MySQL doesn't yet support 'IGNORE NULLS'। RESPECT NULLS চলে।",
              "MySQL 8.4 এর Manual: IGNORE NULLS Parse হয়, কিন্তু Error দেয়।",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL 18 এ IGNORE NULLS"
              query={`SELECT review_id, comment,
       lag(comment) IGNORE NULLS OVER (ORDER BY created_at) AS last_comment
FROM reviews;`}
              caption="ERROR: syntax error at or near NULLS। reviews এ দুটো Review এর comment সত্যিই NULL, কিন্তু এই Box এর PostgreSQL 18 শব্দটাই চেনে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IGNORE NULLS না থাকলেও Fill Forward করা যায়, দুই ধাপে। কৌশলটা দাঁড়িয়ে আছে একটা চেনা নিয়মের উপর: count(x)
                NULL গোনে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক:</strong> তারিখের ক্রমে চলমান <code className={CODE}>count(usd_bdt)</code>। রেট থাকা প্রতিটা দিনে
                  সংখ্যাটা এক বাড়ে, ফাঁকা দিনে বাড়ে না। তাই একটা রেট আর তার পরের ফাঁকা দিনগুলো একই সংখ্যা পায়। এই সংখ্যাটাই
                  দলের পরিচয়, নাম grp।
                </ListItem>
                <ListItem>
                  <strong>দুই:</strong> grp ধরে PARTITION BY, আর প্রতিটা দলের প্রথম মান <code className={CODE}>first_value</code>
                  দিয়ে। প্রতিটা দলের প্রথম Row এ রেট আছে, কারণ দল শুরুই হয় রেট থাকা দিনে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="IGNORE NULLS ছাড়া Fill Forward"
              query={`${RATES},
grouped AS (
  SELECT rate_date, usd_bdt,
         count(usd_bdt) OVER (ORDER BY rate_date) AS grp
  FROM rates
)
SELECT rate_date, usd_bdt, grp,
       first_value(usd_bdt) OVER (PARTITION BY grp ORDER BY rate_date) AS last_known_rate
FROM grouped
ORDER BY rate_date;`}
              caption="৮টা Row। grp: 1, 2, 2, 3, 4, 4, 4, 5। last_known_rate: 122.10, 122.25, 122.25, 122.40, 122.35, 122.35, 122.35, 122.50। 27 অক্টোবর পেল 26 তারিখের রেট, 30 আর 31 অক্টোবর পেল 29 তারিখের। কোনো দিন ফাঁকা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "PostgreSQL 19 এ গেলে এই দুই ধাপ এক লাইন হবে",
          content: (
            <p>
              19 এর Docs অনুযায়ী তখন{" "}
              <code className={CODE}>last_value(usd_bdt) IGNORE NULLS OVER (ORDER BY rate_date)</code> লিখলেই শেষ জানা রেট
              আসার কথা। তার আগে count আর first_value এর কৌশলটাই ভরসা, আর সেটা MySQL 8.4 এও চলে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL 8.0 থেকে এই লেসনের সবগুলো Function আছে, নামও একই। নিচের সব আচরণ MySQL 8.4.11 এ Island Tours এর
                MySQL সংস্করণে চালিয়ে দেখা। পার্থক্যগুলো ছোট, কিন্তু একটা চুপচাপ ভুল উত্তর দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["দুই তারিখের মাঝে দিন", "date বিয়োগ date, উত্তর integer", "DATEDIFF(পরের, আগের)"],
            ["মাসের লেখা", "to_char(booked_at, 'YYYY-MM')", "DATE_FORMAT(booked_at, '%Y-%m')"],
            ["Offset", "যেকোনো Expression, ঋণাত্মক দিলে দিক উল্টায়", "শুধু লেখা অঋণাত্মক সংখ্যা, -1 দিলে ERROR 1064"],
            ["Default এর Type না মিললে", "ERROR: invalid input syntax for type numeric", "কোনো Error নেই, Column এ সংখ্যা আর লেখা মিশে যায়"],
            ["IGNORE NULLS", "Syntax Error", "ERROR 1235, doesn't yet support 'IGNORE NULLS'"],
            ["NTH_VALUE ... FROM LAST", "Syntax Error", "ERROR 1235, doesn't yet support 'FROM LAST'। FROM FIRST চলে"],
            ["LAST_VALUE এর Default Frame", "একই ফাঁদ", "একই ফাঁদ, একই সমাধান"],
            ["NTILE", "ভাগের নিয়ম একই", "একই ভাগ, ntile(4) এ 3, 2, 2, 2"],
            ["ক্যালেন্ডার বানানো", "generate_series", "generate_series নেই, WITH RECURSIVE"],
            ["change নামের Alias", "সাধারণ নাম", "CHANGE সংরক্ষিত শব্দ, তাই `change` লিখতে হয়"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-days-between-bookings.sql",
          code: `SELECT customer_id, booking_id, DATE(booked_at) AS booked_on,
       DATEDIFF(booked_at,
                LAG(booked_at) OVER (PARTITION BY customer_id ORDER BY booked_at)) AS days_since_prev
FROM bookings
WHERE customer_id IN (1, 2, 13)
ORDER BY customer_id, booked_at;
-- 1  | 1  | 2025-12-20 | NULL
-- 1  | 8  | 2026-02-20 | 62
-- 1  | 17 | 2026-10-08 | 230
-- 2  | 2  | 2025-12-28 | NULL
-- 2  | 13 | 2026-09-15 | 261
-- 13 | 15 | 2026-09-20 | NULL
-- 13 | 24 | 2026-10-14 | 24`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-filled-month-over-month.sql",
          code: `WITH RECURSIVE months AS (
  SELECT DATE '2025-12-01' AS month
  UNION ALL
  SELECT month + INTERVAL 1 MONTH FROM months WHERE month < DATE '2026-10-01'
),
monthly AS (
  SELECT m.month, COALESCE(SUM(b.total_bdt), 0) AS revenue
  FROM months m
  LEFT JOIN bookings b
         ON b.status = 'confirmed'
        AND b.booked_at >= m.month
        AND b.booked_at <  m.month + INTERVAL 1 MONTH
  GROUP BY m.month
)
SELECT DATE_FORMAT(month, '%Y-%m') AS month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS \`change\`
FROM monthly
ORDER BY month;
-- (11 rows) PostgreSQL এর সাথে একই সংখ্যা, শুধু ভরা মাসে 0.00:
-- 2026-03 | 57600.00 | 19000.00 |  38600.00
-- 2026-04 |     0.00 | 57600.00 | -57600.00
-- 2026-05 |     0.00 |     0.00 |      0.00   (জুন, জুলাই, আগস্টও একই)
-- 2026-09 | 50500.00 |     0.00 |  50500.00
-- 2026-10 |129500.00 | 50500.00 |  79000.00`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-default-type.sql",
          code: `SELECT title, price_bdt, LAG(price_bdt, 1, 'none') OVER (ORDER BY price_bdt) AS prev_price
FROM tours ORDER BY price_bdt LIMIT 3;
-- Ratargul Swamp Boat Day   | 3500.00 | none
-- Sylhet Tea Garden Tour    | 7800.00 | 3500.00
-- Cox's Bazar Beach Weekend | 8500.00 | 7800.00`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এর চুপচাপ মিশ্রণ",
          content: (
            <p>
              শেষ উদাহরণে MySQL কোনো অভিযোগ ছাড়াই একই Column এ সংখ্যা আর none মিশিয়ে দিয়েছে। Report দেখতে ঠিক লাগে, কিন্তু
              পরে কেউ সেই Column এ যোগ বা গড় করলে অবাক হবেন। PostgreSQL একই জায়গায় থেমে গিয়ে সমস্যাটা দেখিয়ে দেয়। MySQL
              এ Default সবসময় মূল Column এর Type এ দিন, যেমন দামের জন্য 0।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>ফারুক সাহেবের জন্য ফেরত আসা Customer দের Report</SectionTitle>,
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
                মিটিংয়ের শেষে ফারুক সাহেব প্রথম প্রশ্নটাকে একটা Report বানাতে বললেন। যাঁরা অন্তত দুইবার বুক করেছেন, প্রত্যেকের
                এক লাইন: কতবার, প্রথম আর শেষ বুকিং কবে, মাঝে গড়ে কত দিন, আর আজ, ১ নভেম্বর 2026 পর্যন্ত শেষ বুকিংয়ের পর কত
                দিন। যাঁর সবচেয়ে বেশি দিন গেছে তিনি উপরে, কারণ Marketing টিম তাঁকেই আগে ফোন করবে।
              </ContentParagraph>
              <ContentParagraph>তানিম কাজটা দুই ধাপে ভাগ করলেন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>visits:</strong> প্রতিটা Booking এর একটা Row, Customer এর নাম সহ, আর LAG দিয়ে আগের Booking থেকে কত
                  দিন। প্রথম Booking এ gap_days NULL।
                </ListItem>
                <ListItem>
                  <strong>মূল Query:</strong> Customer ধরে GROUP BY। count, min আর max সরাসরি। avg(gap_days) NULL গুলো বাদ দিয়ে
                  গড় করে, তাই গড়টা শুধু আসল ফাঁকগুলোর। শেষ বুকিং থেকে আজ পর্যন্ত দিন বের করতে নির্দিষ্ট তারিখ DATE
                  &apos;2026-11-01&apos;, যাতে Report যেদিনই চালান একই উত্তর আসে। HAVING দিয়ে শুধু দুই বা তার বেশি বুকিং।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফেরত আসা Customer দের Report"
              query={REBOOKING_REPORT}
              caption="৯টা Row। সবার উপরে Nusrat Jahan: দুইবার বুক করেছেন, মাঝে 261 দিন, শেষ বুকিংয়ের পর 47 দিন। Rahim Uddin একমাত্র যিনি তিনবার বুক করেছেন, গড় ফাঁক 146 দিন। সবার নিচে Shuvo Das: দুই বুকিংয়ের মাঝে মাত্র 24 দিন, আর শেষ বুকিংয়ের পর 18 দিন গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব একটা জিনিস লক্ষ করলেন। দুই বুকিংয়ের মাঝের ১০টা ফাঁকের ৮টাই সাত মাসের বেশি, কিন্তু Shuvo Das 24
                দিনের মাথায় ফিরেছেন, আর তাঁর শেষ বুকিংয়ের পর 18 দিন হয়ে গেছে। অভ্যাস মেনে চললে তাঁর পরের বুকিং যেকোনো দিন
                আসতে পারে। এবার আপনার পালা: দ্বিতীয় প্রশ্নটা আয়ের বদলে Booking এর সংখ্যা দিয়ে করুন, ফাঁকা মাস সহ।
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
                  ডিসেম্বর 2025 থেকে অক্টোবর 2026 পর্যন্ত প্রতিটা মাসের জন্য একটা Row: month (YYYY-MM আকারের লেখা), সেই মাসে
                  মোট কতগুলো Booking হয়েছে (যেকোনো status) bookings, আগের মাসের সংখ্যা prev_bookings, আর পরিবর্তন change।
                  যে মাসে কোনো Booking নেই, সেখানে bookings 0। মাসের ক্রমে সাজান।
                </>
              }
              hint={
                <>
                  generate_series দিয়ে ১১টা মাসের ক্যালেন্ডার, তারপর bookings কে LEFT JOIN, শর্ত date_trunc(&apos;month&apos;,
                  b.booked_at)::date = m.month। গোনার সময় count(*) না, count(b.booking_id) লিখুন: count(*) ফাঁকা মাসে
                  ক্যালেন্ডারের নিজের Row টা গুনে 1 দেবে। এপ্রিলে পরিবর্তন মাইনাস 3, সেপ্টেম্বরে 3 বেশি।
                </>
              }
              solution={`WITH months AS (
  SELECT generate_series(DATE '2025-12-01', DATE '2026-10-01',
                         INTERVAL '1 month')::date AS month
),
monthly AS (
  SELECT m.month, count(b.booking_id) AS bookings
  FROM months m
  LEFT JOIN bookings b ON date_trunc('month', b.booked_at)::date = m.month
  GROUP BY m.month
)
SELECT to_char(month, 'YYYY-MM') AS month, bookings,
       lag(bookings) OVER (ORDER BY month) AS prev_bookings,
       bookings - lag(bookings) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>পাশের Row এর প্রশ্ন লেখার ক্রম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা পাশের Row এর ভাষায় বলুন",
              description:
                "আগের, পরের, প্রথম, শেষ, n নম্বর, নাকি সমান কয়েক ভাগ? এই একটা শব্দ থেকেই Function আসে: LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE বা NTILE।",
            },
            {
              title: "দল ঠিক করুন",
              description:
                "প্রতিটা Customer আলাদা, প্রতিটা ট্যুর আলাদা, নাকি পুরো Table একসাথে? আলাদা হলে PARTITION BY। ভুলে গেলে কোনো Error আসবে না, উত্তর চুপচাপ ভুল হবে।",
            },
            {
              title: "ক্রম ঠিক করুন, সাথে Tie Breaker",
              description:
                "OVER এর ভেতরে ORDER BY ঠিক করে আগের আর পরের কোনটা। সমান মান থাকতে পারলে শেষে একটা Unique Column, যেমন booking_id বা tour_id।",
            },
            {
              title: "সময়ের তুলনা হলে ফাঁকা ঘর খুঁজুন",
              description:
                "প্রতিটা দিন বা মাসের Row আছে কিনা দেখুন। না থাকলে আগে generate_series দিয়ে ক্যালেন্ডার, LEFT JOIN আর COALESCE, তারপর LAG।",
            },
            {
              title: "LAST_VALUE বা NTH_VALUE হলে Frame লিখুন",
              description:
                "ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING, নইলে Frame বর্তমান Row এ থেমে যায়। শেষেরটা চাইলে উল্টো ক্রমে FIRST_VALUE ও চলে।",
            },
            {
              title: "Offset আর Default ভাবুন",
              description:
                "কত Row দূরে? না পেলে NULL চলবে, নাকি একটা মান? Default শুধু Row না থাকলে কাজ করে, আর তার Type মূল Column এর মতো হতে হবে।",
            },
            {
              title: "Filter এর জন্য CTE, তারপর হাতে মিলিয়ে দেখা",
              description:
                "Window এর Column দিয়ে WHERE লেখা যায় না, তাই Window টা CTE তে রাখুন। শেষে দেখুন প্রতিটা দলের প্রথম Row এ LAG NULL কিনা, আর একটা মাঝের Row এর মান আসলেই পাশের Row থেকে আসছে কিনা।",
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
            ["প্রতি Customer এর হিসাবে PARTITION BY ভুলে যাওয়া", "অন্য Customer এর Row পড়ে, কোনো Error নেই", "PARTITION BY customer_id"],
            ["OVER এর ভেতরে ORDER BY না দেওয়া", "আগের Row কোনটা তার নিশ্চয়তা নেই", "ORDER BY আর একটা Tie Breaker"],
            ["ফাঁকা মাস রেখে LAG", "আগের Row কে আগের মাস ভাবা, সেপ্টেম্বরকে মার্চের সাথে তুলনা", "ক্যালেন্ডার, LEFT JOIN, COALESCE"],
            ["শুধু ORDER BY দিয়ে LAST_VALUE", "প্রতিটা Row এ নিজের মান", "পুরো দলের Frame, অথবা DESC দিয়ে FIRST_VALUE"],
            ["Default দিয়ে NULL মান ঢাকার আশা", "পেছনের Row আছে কিন্তু মান NULL হলে NULL ই আসে", "COALESCE(lag(x), 0)"],
            ["Default এর Type আলাদা", "PostgreSQL এ Error, MySQL এ চুপচাপ মিশ্রণ", "মূল Column এর Type এ Default"],
            ["WHERE এ LAG", "window functions are not allowed in WHERE", "CTE, তারপর বাইরে WHERE"],
            ["শতাংশে সরাসরি আগের মাস দিয়ে ভাগ", "আগের মাস 0 হলে division by zero", "NULLIF(lag(x), 0)"],
            ["NTILE কে দামের সীমা ভাবা", "কাছাকাছি দাম আলাদা ভাগে, দূরের দাম এক ভাগে", "নির্দিষ্ট সীমা চাইলে CASE"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`SELECT customer_id, booking_id
FROM bookings
WHERE lag(booking_id) OVER (PARTITION BY customer_id ORDER BY booked_at) IS NOT NULL;`}
              caption="ERROR: window functions are not allowed in WHERE। LAG টা একটা CTE তে নিন: WITH x AS (SELECT customer_id, booking_id, lag(booking_id) OVER (PARTITION BY customer_id ORDER BY booked_at) AS prev FROM bookings) SELECT customer_id, booking_id FROM x WHERE prev IS NOT NULL;। ঠিক হলে ১০টা Row আসবে, প্রতিটা কারো দ্বিতীয় বা তৃতীয় Booking।"
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
                    href="https://www.postgresql.org/docs/18/functions-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Docs: Window Functions
                  </a>
                  : lag, lead, first_value, last_value, nth_value আর ntile এর আনুষ্ঠানিক তালিকা, আর নিচের Note এ লেখা কেন
                  IGNORE NULLS আর FROM LAST নেই।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 18 Docs: Window Function Calls
                  </a>
                  : OVER এর পুরো গঠন আর Default Frame এর নিয়ম, যেখান থেকে LAST_VALUE এর ফাঁদটা আসে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/19/release-19.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 19 Release Notes
                  </a>
                  : IGNORE NULLS আর RESPECT NULLS কোন পাঁচটা Function এ আসছে। প্রকাশের তারিখ চূড়ান্ত হলে এখানেই দেখা যাবে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-function-descriptions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Function Descriptions
                  </a>
                  : MySQL এ LAG, LEAD, NTH_VALUE আর NTILE এর নিয়ম, Offset কেন শুধু লেখা সংখ্যা, আর IGNORE NULLS ও FROM LAST এর
                  বর্তমান অবস্থা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে, আর Window Function পর্যন্ত যায় না। সেখানের GROUP BY এর মাসিক উদাহরণগুলো নিয়ে এই
                  লেসনের মতো করে LAG যোগ করুন, তাহলে একই Data তে Month over Month তুলনা পেয়ে যাবেন।
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
                  LAG আগের Row এর মান, LEAD পরের Row এর মান বর্তমান Row এর পাশে বসায়। Self Join এর মতো Row বাড়ে না, কমে না।
                </ListItem>
                <ListItem>
                  আগের আর পরের মানে কী, সেটা ঠিক করে OVER এর ভেতরের ORDER BY। সমান মান থাকতে পারলে একটা Tie Breaker।
                </ListItem>
                <ListItem>
                  PARTITION BY দেয়াল তোলে। দলের প্রথম Row এ LAG NULL, শেষ Row এ LEAD NULL। দেয়াল ভুলে গেলে উত্তর চুপচাপ ভুল।
                </ListItem>
                <ListItem>
                  Offset বলে কত Row দূরে, Default বলে Row না থাকলে কী। Row আছে কিন্তু মান NULL হলে Default কাজ করে না, তখন
                  COALESCE।
                </ListItem>
                <ListItem>
                  Month over Month: CTE তে মাসিক যোগফল, LAG দিয়ে আগের মাস, NULLIF দিয়ে নিরাপদ শতাংশ। ফাঁকা মাস থাকলে আগে
                  ক্যালেন্ডার, কারণ আগের Row মানেই আগের মাস না।
                </ListItem>
                <ListItem>
                  FIRST_VALUE নিরাপদ। LAST_VALUE আর NTH_VALUE Frame এর ভেতরে খোঁজে, আর Default Frame বর্তমান Row এ থামে। পুরো
                  দলের Frame লিখুন, অথবা উল্টো ক্রমে FIRST_VALUE।
                </ListItem>
                <ListItem>
                  NTILE(n) Row গুলোকে প্রায় সমান n ভাগে ভাগ করে, বাড়তি Row প্রথম দিকের ভাগে। ভাগ হয় সংখ্যা ধরে, মান ধরে না।
                </ListItem>
                <ListItem>
                  IGNORE NULLS PostgreSQL 18 আর MySQL 8.4 এ নেই, PostgreSQL 19 এ আসছে। এখন Fill Forward চাইলে count দিয়ে দল,
                  তারপর first_value।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি প্রতিটা Row কে তার প্রতিবেশীর সাথে মিলিয়েছেন। পরের লেসনে একই অস্ত্র দিয়ে ইন্টারভিউয়ের সবচেয়ে
                প্রিয় প্রশ্নগুলোর সমাধান: প্রতিটা দলের সেরা তিনটা, একই জিনিসের পুনরাবৃত্তি থেকে শুধু নতুনটা রাখা, আর টানা কয়েক
                দিন বা কয়েক মাস ধরে চলা ধারা খুঁজে বের করা। পরের লেসন{" "}
                <Link href="/sql/topic/top-n-gaps-islands" className={LINK}>
                  Top N, Gaps and Islands
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
      ["LAG", "আগের Row এর মান বর্তমান Row এর পাশে", "Booking 17 এর আগের Booking 8, Self Join এর মতো দুইবার না"],
      ["LEAD", "পরের Row এর মান", "Tour 1 এর পরের Departure 28, 281 আর 28 দিন পরে"],
      ["PARTITION BY", "দেয়াল, LAG দলের বাইরে যায় না", "ছাড়া লিখলে Customer 2 এর প্রথম Booking এ ভুল 8 দিন"],
      ["Offset", "কত Row দূরে, না দিলে 1", "lag(revenue, 2): মার্চের পাশে জানুয়ারির 92000.00"],
      ["Default", "Row না থাকলে কী, NULL মান বদলায় না", "lag(usd_bdt, 1, 0): 28 অক্টোবরে তবু NULL"],
      ["Month over Month", "CTE, LAG আর NULLIF", "অক্টোবরে 79000.00 বেশি, 156.4%"],
      ["Gap Filling", "ক্যালেন্ডার, LEFT JOIN, COALESCE", "সেপ্টেম্বর: 7100.00 কম না, 50500.00 বেশি"],
      ["FIRST_VALUE", "দলের প্রথম Row, Frame এর ফাঁদ নেই", "৯টা ট্যুরের পাশেই Ratargul Swamp Boat Day"],
      ["LAST_VALUE", "Frame এর শেষ Row, Default Frame এ নিজেই", "পুরো দলের Frame এ Tour 1 এর 2026-12-18"],
      ["NTH_VALUE", "Frame এর n নম্বর Row", "দ্বিতীয় সস্তা Sylhet, Default Frame এ প্রথম Row NULL"],
      ["NTILE", "প্রায় সমান n ভাগ, বাড়তি প্রথম দিকে", "ntile(4) এ ভাগের মাপ 3, 2, 2, 2"],
      ["IGNORE NULLS", "PostgreSQL 18 আর MySQL 8.4 এ নেই, 19 এ আসছে", "count আর first_value দিয়ে 27 অক্টোবরে 122.25"],
      ["MySQL", "DATEDIFF, লেখা Offset, চুপচাপ Type মিশ্রণ", "একই 62, 230, 261, 24 দিন"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "lag(booking_id) OVER (PARTITION BY customer_id ORDER BY booked_at) চালালে একজন Customer এর প্রথম Booking এর পাশে কী আসে?",
        options: [
          {
            key: "A",
            text: "NULL",
            isCorrect: true,
            explanation:
              "ঠিক। প্রথম Booking এর পেছনে ওই Customer এর কোনো Row নেই, আর Default না দেওয়ায় LAG দেয় NULL।",
          },
          {
            key: "B",
            text: "আগের Customer এর শেষ Booking এর id",
            isCorrect: false,
            explanation:
              "PARTITION BY দেয়াল তোলে, LAG কখনো দলের বাইরে তাকায় না।",
          },
          {
            key: "C",
            text: "0",
            isCorrect: false,
            explanation: "0 আসত শুধু যদি তৃতীয় Argument হিসেবে Default 0 দেওয়া হতো, যেমন lag(booking_id, 1, 0)।",
          },
          {
            key: "D",
            text: "Error, কারণ পেছনে কোনো Row নেই",
            isCorrect: false,
            explanation: "পেছনে Row না থাকা স্বাভাবিক, Error না। LAG তখন Default দেয়, না থাকলে NULL।",
          },
        ],
      },
      {
        id: 2,
        text: "প্রতি Customer এর দুই বুকিংয়ের মাঝের দিন বের করতে কেউ PARTITION BY customer_id লিখতে ভুলে গেলেন। কী হবে?",
        options: [
          {
            key: "A",
            text: "PostgreSQL Error দেবে, কারণ customer_id কোথাও ব্যবহার হয়নি",
            isCorrect: false,
            explanation: "PARTITION BY ঐচ্ছিক। ছাড়া লিখলে পুরো Table একটা দল, Query দিব্যি চলে।",
          },
          {
            key: "B",
            text: "Query চলবে, কিন্তু অনেক Row অন্য Customer এর Booking থেকে দিন গুনবে",
            isCorrect: true,
            explanation:
              "ঠিক, আর কোনো সতর্কবার্তা নেই। উদাহরণে Customer 2 এর প্রথম Booking এ 8 দিন এসেছিল, Customer 1 এর Booking থেকে।",
          },
          {
            key: "C",
            text: "সব Row এ NULL আসবে",
            isCorrect: false,
            explanation: "শুধু পুরো তালিকার প্রথম Row এ NULL। বাকিরা ঠিক উপরের Row পড়বে, সে যে Customer ই হোক।",
          },
          {
            key: "D",
            text: "উত্তর একই থাকবে, কারণ শেষের ORDER BY customer_id দিয়ে সাজানো",
            isCorrect: false,
            explanation:
              "শেষের ORDER BY শুধু দেখানোর ক্রম। LAG এর আগের Row আসে OVER এর ভেতরের ক্রম থেকে।",
          },
        ],
      },
      {
        id: 3,
        text: "মাসিক confirmed আয়ের ছয়টা Row এ (2025-12 থেকে 2026-10) lag(revenue, 2) OVER (ORDER BY month) চালালে 2026-03 এর Row এর পাশে কী আসে?",
        options: [
          {
            key: "A",
            text: "19000.00",
            isCorrect: false,
            explanation: "এটা ফেব্রুয়ারির আয়, মার্চ থেকে এক Row পেছনে। Offset 2 মানে দুই Row পেছনে।",
          },
          {
            key: "B",
            text: "92000.00",
            isCorrect: true,
            explanation: "ঠিক। মার্চ থেকে দুই Row পেছনে জানুয়ারি, যার আয় 92000.00।",
          },
          {
            key: "C",
            text: "75000.00",
            isCorrect: false,
            explanation: "এটা ডিসেম্বরের আয়, মার্চ থেকে তিন Row পেছনে।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "NULL শুধু প্রথম দুই Row এ। মার্চের দুই Row পেছনে জানুয়ারি আছে।",
          },
        ],
      },
      {
        id: 4,
        text: "lag(usd_bdt, 1, 0) OVER (ORDER BY rate_date) চালানো হলো। কোনো একটা দিনের আগের দিনের Row আছে, কিন্তু সেদিনের usd_bdt NULL। এই দিনের পাশে কী আসবে?",
        options: [
          {
            key: "A",
            text: "0",
            isCorrect: false,
            explanation:
              "Default কাজ করে শুধু যখন ওই দূরত্বে কোনো Row ই নেই। এখানে Row আছে।",
          },
          {
            key: "B",
            text: "NULL",
            isCorrect: true,
            explanation:
              "ঠিক। LAG পেছনের Row এর মান হুবহু আনে, আর সেই মান NULL। NULL কেও 0 বানাতে চাইলে coalesce(lag(usd_bdt), 0)।",
          },
          {
            key: "C",
            text: "তার আগের যে দিনে রেট আছে, সেই রেট",
            isCorrect: false,
            explanation:
              "এটা IGNORE NULLS এর আচরণ, যেটা PostgreSQL 18 এ নেই।",
          },
          {
            key: "D",
            text: "Error, কারণ NULL আর 0 এর Type আলাদা",
            isCorrect: false,
            explanation: "0 numeric এর সাথে মেলে, তাই Query চলে।",
          },
        ],
      },
      {
        id: 5,
        text: "মাসিক আয়ের Report এ সেপ্টেম্বর 2026 এর পরিবর্তন এসেছে মাইনাস 7100.00, অথচ আগস্টে কোনো আয়ই ছিল না। কেন?",
        options: [
          {
            key: "A",
            text: "LAG এ ভুল Offset দেওয়া হয়েছে",
            isCorrect: false,
            explanation: "Offset 1 ই ছিল। সমস্যা Offset এ না, Row এর তালিকায়।",
          },
          {
            key: "B",
            text: "এপ্রিল থেকে আগস্টের কোনো Row নেই, তাই সেপ্টেম্বরের আগের Row মার্চ",
            isCorrect: true,
            explanation:
              "ঠিক। GROUP BY শুধু যে মাসে Booking আছে তার Row বানায়, আর LAG আগের Row পড়ে, আগের মাস না। মাস ভরালে পরিবর্তন 50500.00 বেশি।",
          },
          {
            key: "C",
            text: "সেপ্টেম্বরে আসলেই মার্চের চেয়ে কম আয়, তাই উত্তর ঠিক আছে",
            isCorrect: false,
            explanation:
              "বিয়োগটা ঠিক, কিন্তু প্রশ্ন ছিল আগের মাসের সাথে তুলনা, তাই Report ভুল।",
          },
          {
            key: "D",
            text: "date_trunc ঢাকার সময় ধরেনি",
            isCorrect: false,
            explanation: "Time Zone ভুল হলে কয়েকটা Booking পাশের মাসে সরত। এখানে পাঁচ মাস পুরো ফাঁকা।",
          },
        ],
      },
      {
        id: 6,
        text: "last_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) প্রতিটা Row এ নিজের তারিখই দিচ্ছে। কারণ কী?",
        options: [
          {
            key: "A",
            text: "LAST_VALUE এর একটা পরিচিত Bug",
            isCorrect: false,
            explanation: "Bug না, নিয়ম মেনেই হচ্ছে। MySQL এও হুবহু একই আচরণ।",
          },
          {
            key: "B",
            text: "ORDER BY থাকলে Default Frame বর্তমান Row এ শেষ হয়, আর LAST_VALUE Frame এর শেষ Row আনে",
            isCorrect: true,
            explanation:
              "ঠিক। Default Frame হলো RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW। পুরো দলের Frame লিখলে Tour 1 এর সব Row এ 2026-12-18 আসে।",
          },
          {
            key: "C",
            text: "PARTITION BY এর কারণে, ওটা সরালে ঠিক হবে",
            isCorrect: false,
            explanation:
              "PARTITION BY সরালে দল বড় হবে, কিন্তু Frame তবু বর্তমান Row এ থামবে।",
          },
          {
            key: "D",
            text: "starts_on এ সমান তারিখ আছে",
            isCorrect: false,
            explanation:
              "এখানে প্রতিটা ট্যুরের তারিখ আলাদা। সমান তারিখ থাকলে ফলাফল আরও অদ্ভুত হতো।",
          },
        ],
      },
      {
        id: 7,
        text: "৯টা ট্যুরে ntile(4) OVER (ORDER BY price_bdt, tour_id) চালালে চারটা ভাগে কয়টা করে ট্যুর পড়ে?",
        options: [
          {
            key: "A",
            text: "2, 2, 2, 3",
            isCorrect: false,
            explanation: "বাড়তি Row যায় প্রথম দিকের ভাগে, শেষের ভাগে না।",
          },
          {
            key: "B",
            text: "3, 2, 2, 2",
            isCorrect: true,
            explanation: "ঠিক। ৯ কে ৪ দিয়ে ভাগ করলে ২, বাকি ১। সেই একটা বাড়তি Row প্রথম ভাগে যায়।",
          },
          {
            key: "C",
            text: "3, 3, 3, 0",
            isCorrect: false,
            explanation: "ভাগগুলোর পার্থক্য সর্বোচ্চ একটা Row, তাই ৯টা Row এ কোনো ভাগ ফাঁকা থাকে না।",
          },
          {
            key: "D",
            text: "2, 2, 2, 2, আর একটা ট্যুর বাদ",
            isCorrect: false,
            explanation: "NTILE কোনো Row বাদ দেয় না। প্রতিটা Row কোনো না কোনো ভাগে পড়ে।",
          },
        ],
      },
      {
        id: 8,
        text: "lag(comment) IGNORE NULLS OVER (ORDER BY created_at) লিখে PostgreSQL 18 আর MySQL 8.4 এ চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "দুটোতেই চলে, NULL comment বাদ দিয়ে আগেরটা আনে",
            isCorrect: false,
            explanation: "SQL এর Standard এ আছে, কিন্তু এই দুই Version এর কোনোটাতেই বাস্তবায়িত না।",
          },
          {
            key: "B",
            text: "PostgreSQL 18 এ Syntax Error, MySQL 8.4 এ ERROR 1235 doesn't yet support 'IGNORE NULLS'",
            isCorrect: true,
            explanation:
              "ঠিক, দুটোতেই চালিয়ে দেখা। MySQL শব্দটা চেনে কিন্তু চালায় না, PostgreSQL 18 শব্দটাই চেনে না।",
          },
          {
            key: "C",
            text: "PostgreSQL 18 এ চলে, MySQL এ Error",
            isCorrect: false,
            explanation: "PostgreSQL 18 এর Docs বলে এই Option বাস্তবায়ন করা হয়নি।",
          },
          {
            key: "D",
            text: "MySQL শব্দটা চুপচাপ উপেক্ষা করে সাধারণ LAG চালায়",
            isCorrect: false,
            explanation: "MySQL স্পষ্ট ERROR 1235 দেয়। চুপচাপ মেনে নেয় শুধু RESPECT NULLS, যেটা Default আচরণ।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর সময়রেখা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>উল্টো দিক থেকে:</strong> প্রতিটা ট্যুরের Departure গুলোর মাঝের দিন এবার LAG দিয়ে বের করুন। LEAD এর 28, 281,
        28 এর সাথে মিলিয়ে লিখুন সংখ্যাগুলো কোন Row তে সরে গেল আর কেন।
      </span>,
      <span key="2">
        <strong>ফাঁকা মাস সহ শতাংশ:</strong> ক্যালেন্ডার দিয়ে ভরা ১১ মাসের confirmed আয়ে Month over Month শতাংশ যোগ করুন,
        NULLIF সহ। NULLIF সরিয়ে আবার চালান, Error এর প্রথম লাইনটা লিখে রাখুন, আর কোন মাসের জন্য Error এলো সেটা ব্যাখ্যা
        করুন।
      </span>,
      <span key="3">
        <strong>প্রথম আর শেষ ট্যুর:</strong> যাঁরা অন্তত দুইবার বুক করেছেন, প্রত্যেকের প্রথম বুকিংয়ের ট্যুরের নাম আর শেষ
        বুকিংয়ের ট্যুরের নাম পাশাপাশি দেখান, FIRST_VALUE আর LAST_VALUE দিয়ে, সঠিক Frame সহ। কে কে একই ট্যুর দুইবার নিয়েছেন?
      </span>,
      <span key="4">
        <strong>Filter বদলালে ভাগ বদলায়:</strong> শুধু চালু থাকা ট্যুর নিয়ে ntile(4) চালান, তারপর সব ৯টা নিয়ে। কোন কোন ট্যুরের
        Quartile বদলাল, আর কেন একটা ট্যুর বাদ দিলে অন্যদের ভাগ বদলায়, তিন লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> ব্যাংকের লাইনে দাঁড়ানো মানুষের উদাহরণ দিয়ে একজন বন্ধুকে বোঝান LAG কী,
        PARTITION BY কেন আলাদা আলাদা লাইনের মতো, আর LAST_VALUE কেন শুধু নিজের পর্যন্ত দেখে যদি না বলে দেওয়া হয় পুরো লাইন
        দেখতে।
      </span>,
    ],
    deliverables: [
      <span key="d1">LAG দিয়ে লেখা Departure এর Query, ফলাফল আর LEAD এর সাথে তুলনা</span>,
      <span key="d2">শতাংশ সহ ১১ মাসের Report, আর NULLIF ছাড়া Error এর লাইন ও ব্যাখ্যা</span>,
      <span key="d3">প্রথম আর শেষ ট্যুরের Query, ফলাফল আর একই ট্যুর আবার নেওয়া Customer দের নাম</span>,
      <span key="d4">দুটো ntile(4) এর ফলাফল আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ পাশের Row",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রতি Customer এর আগের Booking",
        description: "২৪টা Row, ১০টায় দিনের সংখ্যা। SET TIME ZONE লাইনটা রাখুন, যাতে তারিখ ঢাকার সময়ে হয়।",
      },
      {
        title: "একই ট্যুরের পরের Departure",
        description: "দ্বিতীয় ফাইলে ১৬টা Row। Tour 1 এ 28, 281, 28 আর শেষে NULL।",
      },
      {
        title: "Month over Month, তারপর ফাঁকা মাস ভরানো",
        description: "প্রথম Query তে ৬টা মাস, দ্বিতীয়টায় ১১টা। সেপ্টেম্বরের পরিবর্তন দুটোতে কীভাবে বদলায়, মিলিয়ে নিন।",
      },
      {
        title: "LAST_VALUE এর ফাঁদ",
        description:
          "চতুর্থ ফাইলে Default আর পুরো Frame পাশাপাশি। তারপর nth_value এর প্রথম Row এ NULL টা খুঁজে বের করুন।",
      },
      {
        title: "NTILE",
        description: "পঞ্চম ফাইলে ntile(4), ভাগের মাপ 3, 2, 2, 2। তারপর WHERE is_active যোগ করে দেখুন প্রতি ভাগে ২টা।",
      },
      {
        title: "IGNORE NULLS আর তার বিকল্প",
        description:
          "প্রথম Query টা PostgreSQL 18 বা তার আগের যেকোনো Version এ Error দেবে। দ্বিতীয়টা একই কাজ count আর first_value দিয়ে করে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-previous-booking.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT customer_id, booking_id, booked_at::date AS booked_on,
       booked_at::date - lag(booked_at::date)
         OVER (PARTITION BY customer_id ORDER BY booked_at) AS days_since_prev
FROM bookings
ORDER BY customer_id, booked_at;
-- (24 rows)
-- 1 | 1  | 2025-12-20 | NULL
-- 1 | 8  | 2026-02-20 | 62
-- 1 | 17 | 2026-10-08 | 230
-- 2 | 2  | 2025-12-28 | NULL
-- 2 | 13 | 2026-09-15 | 261
-- ...
-- 13 | 24 | 2026-10-14 | 24
-- 14 | 16 | 2026-10-02 | NULL`,
      },
      {
        language: "sql",
        filename: "02-next-departure.sql",
        code: `SELECT tour_id, departure_id, starts_on,
       lead(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) - starts_on AS days_to_next
FROM departures
ORDER BY tour_id, starts_on;
-- (16 rows)
-- 1 | 1 | 2026-01-15 | 28
-- 1 | 2 | 2026-02-12 | 281
-- 1 | 8 | 2026-11-20 | 28
-- 1 | 9 | 2026-12-18 | NULL
-- 2 | 3 | 2026-01-23 | 308
-- ...
-- 7 | 15 | 2026-11-21 | NULL
-- 8 | 16 | 2027-02-14 | NULL`,
      },
      {
        language: "sql",
        filename: "03-month-over-month.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

${MONTHLY_CHANGE}
-- (6 rows)
-- 2025-12 |  75000.00 | NULL     | NULL      | NULL
-- 2026-01 |  92000.00 | 75000.00 |  17000.00 |  22.7
-- 2026-02 |  19000.00 | 92000.00 | -73000.00 | -79.3
-- 2026-03 |  57600.00 | 19000.00 |  38600.00 | 203.2
-- 2026-09 |  50500.00 | 57600.00 |  -7100.00 | -12.3
-- 2026-10 | 129500.00 | 50500.00 |  79000.00 | 156.4

${FILLED_MONTHS}
-- (11 rows)
-- 2026-03 |  57600.00 | 19000.00 |  38600.00
-- 2026-04 |         0 | 57600.00 | -57600.00
-- 2026-05 |         0 |        0 |         0   (জুন, জুলাই, আগস্টও একই)
-- 2026-09 |  50500.00 |        0 |  50500.00
-- 2026-10 | 129500.00 | 50500.00 |  79000.00`,
      },
      {
        language: "sql",
        filename: "04-last-value-trap.sql",
        code: `SELECT tour_id, starts_on,
       last_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on) AS last_default,
       last_value(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on
                                   ROWS BETWEEN UNBOUNDED PRECEDING
                                            AND UNBOUNDED FOLLOWING) AS last_full
FROM departures
WHERE tour_id IN (1, 2)
ORDER BY tour_id, starts_on;
-- (6 rows)
-- 1 | 2026-01-15 | 2026-01-15 | 2026-12-18
-- 1 | 2026-02-12 | 2026-02-12 | 2026-12-18
-- 1 | 2026-11-20 | 2026-11-20 | 2026-12-18
-- 1 | 2026-12-18 | 2026-12-18 | 2026-12-18
-- 2 | 2026-01-23 | 2026-01-23 | 2026-11-27
-- 2 | 2026-11-27 | 2026-11-27 | 2026-11-27

SELECT title, nth_value(title, 2) OVER (ORDER BY price_bdt, tour_id) AS second_default
FROM tours
ORDER BY price_bdt, tour_id;
-- (9 rows)
-- Ratargul Swamp Boat Day | NULL
-- Sylhet Tea Garden Tour  | Sylhet Tea Garden Tour
-- ... বাকি সাতটাতেও Sylhet Tea Garden Tour`,
      },
      {
        language: "sql",
        filename: "05-ntile.sql",
        code: `SELECT title, price_bdt,
       ntile(4) OVER (ORDER BY price_bdt, tour_id) AS price_quartile
FROM tours
ORDER BY price_bdt, tour_id;
-- (9 rows), quartile: 1, 1, 1, 2, 2, 3, 3, 4, 4

SELECT title, price_bdt,
       ntile(4) OVER (ORDER BY price_bdt, tour_id) AS price_quartile
FROM tours
WHERE is_active
ORDER BY price_bdt, tour_id;
-- (8 rows), quartile: 1, 1, 2, 2, 3, 3, 4, 4
-- একটা ট্যুর বাদ পড়ায় তিনটা ট্যুর এক ধাপ উপরের Quartile এ গেছে`,
      },
      {
        language: "sql",
        filename: "06-fill-forward.sql",
        code: `SELECT review_id, lag(comment) IGNORE NULLS OVER (ORDER BY created_at) AS last_comment
FROM reviews;
-- ERROR:  syntax error at or near "NULLS"

${RATES},
grouped AS (
  SELECT rate_date, usd_bdt,
         count(usd_bdt) OVER (ORDER BY rate_date) AS grp
  FROM rates
)
SELECT rate_date, usd_bdt, grp,
       first_value(usd_bdt) OVER (PARTITION BY grp ORDER BY rate_date) AS last_known_rate
FROM grouped
ORDER BY rate_date;
-- (8 rows)
-- 2026-10-25 | 122.10 | 1 | 122.10
-- 2026-10-26 | 122.25 | 2 | 122.25
-- 2026-10-27 | NULL   | 2 | 122.25
-- 2026-10-28 | 122.40 | 3 | 122.40
-- 2026-10-29 | 122.35 | 4 | 122.35
-- 2026-10-30 | NULL   | 4 | 122.35
-- 2026-10-31 | NULL   | 4 | 122.35
-- 2026-11-01 | 122.50 | 5 | 122.50`,
      },
    ],
    tip: (
      <ContentParagraph>
        psql ডিফল্টভাবে NULL কে একদম ফাঁকা দেখায়, তাই LAG এর প্রথম Row আর একটা খালি লেখার পার্থক্য বোঝা যায় না। ড্রিল শুরুর
        আগে একবার <code className={CODE}>\pset null NULL</code> চালান। এরপর প্রতিটা NULL ঘরে লেখা থাকবে NULL, ঠিক উপরের
        প্রত্যাশিত ফলাফলের মতো।
      </ContentParagraph>
    ),
  },
};
