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
  CteChainLab,
  MaterializeLab,
} from "../../../components/course/topics/subqueries/cte-animations";
import {
  CteAnatomyDiagram,
  CteChainDiagram,
  InsideOutVsTopDownSplit,
  LifetimeDiagram,
} from "../../../components/course/topics/subqueries/cte-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const NESTED_REPORT = `SELECT r.name, r.revenue, round(a.avg_revenue, 2) AS average,
       r.revenue > a.avg_revenue AS above
FROM (
  SELECT ds.name, sum(c.total_bdt) AS revenue
  FROM (
    SELECT b.total_bdt, d.tour_id
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    WHERE b.status = 'confirmed'
  ) c
  JOIN tours t         ON t.tour_id = c.tour_id
  JOIN destinations ds ON ds.destination_id = t.destination_id
  GROUP BY ds.name
) r
CROSS JOIN (
  SELECT avg(x.revenue) AS avg_revenue
  FROM (
    SELECT ds.name, sum(c.total_bdt) AS revenue
    FROM (
      SELECT b.total_bdt, d.tour_id
      FROM bookings b
      JOIN departures d ON d.departure_id = b.departure_id
      WHERE b.status = 'confirmed'
    ) c
    JOIN tours t         ON t.tour_id = c.tour_id
    JOIN destinations ds ON ds.destination_id = t.destination_id
    GROUP BY ds.name
  ) x
) a
ORDER BY r.revenue DESC;`;

const CTE_REPORT = `WITH confirmed AS (
  SELECT b.booking_id, b.total_bdt, d.tour_id
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status = 'confirmed'
),
revenue_by_destination AS (
  SELECT ds.name, sum(c.total_bdt) AS revenue
  FROM confirmed c
  JOIN tours t         ON t.tour_id = c.tour_id
  JOIN destinations ds ON ds.destination_id = t.destination_id
  GROUP BY ds.name
),
average AS (
  SELECT avg(revenue) AS avg_revenue
  FROM revenue_by_destination
)
SELECT r.name, r.revenue, round(a.avg_revenue, 2) AS average,
       r.revenue > a.avg_revenue AS above
FROM revenue_by_destination r
CROSS JOIN average a
ORDER BY r.revenue DESC;`;

export const ctesContent: TopicData = {
  id: "ctes",
  introduction: {
    badge: "MODULE 07 · LESSON 05",
    title: <SectionTitle>বড় Query কে নাম দেওয়া ছোট ধাপে ভাঙা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি একটা Query এর ভেতরে আরেকটা Query কে Table এর মতো বসিয়েছেন, FROM এর ভেতরে, বন্ধনীর
          মধ্যে। কাজ চলে, কিন্তু ধাপ বাড়লে বন্ধনীর ভেতরে বন্ধনী, তার ভেতরে আবার বন্ধনী। পড়তে হয় মাঝখান থেকে
          শুরু করে বাইরের দিকে, আর একই অংশ দুই জায়গায় লাগলে সেটা দুইবার লিখতে হয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই সমস্যার সমাধান নিয়ে: WITH। WITH দিয়ে প্রতিটা ধাপকে একটা নাম দিয়ে আগে লিখে রাখা যায়, তারপর
          পরের ধাপ সেই নাম ধরে আগের ফলাফল পড়ে, ঠিক একটা Table এর মতো। লম্বা Report উপর থেকে নিচে পড়া যায়, যে
          ক্রমে কাজ হয় সেই ক্রমে। এই নাম দেওয়া ধাপগুলোর নাম CTE, Common Table Expression।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি একটা লম্বা Report কে কয়েকটা নাম দেওয়া ধাপে ভেঙে লিখতে পারবেন, প্রতিটা ধাপ আলাদা করে
          যাচাই করতে পারবেন, একই ধাপ দুই জায়গায় ব্যবহার করতে পারবেন, CTE, Derived Table আর View এর মধ্যে কোনটা
          কখন সেটা বুঝবেন, আর PostgreSQL ভেতরে CTE কে কীভাবে চালায় সেটাও দেখবেন। সব উদাহরণ Island Tours এর আসল
          Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে দিয়ে আপনি একটা লম্বা চিন্তাকে ছোট ছোট নাম দেওয়া বাটিতে সাজিয়ে রাখেন। প্রথম বাটিতে কাঁচামাল, দ্বিতীয়টায় তা থেকে বানানো জিনিস, শেষে থালায় সাজানো উত্তর। পড়ার মানুষ উপর থেকে নিচে একবার চোখ বুলালেই বোঝেন কী রান্না হলো।",
      author: "WITH",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>তানিমের চল্লিশ লাইনের Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর Manager ফারুক সাহেব মালিকের জন্য একটা ছোট Report চাইলেন:
                প্রতিটা Destination থেকে confirmed Booking এ কত আয় হয়েছে, সব Destination এর গড় আয় কত, আর কোন
                জায়গাগুলো গড়ের উপরে। নতুন Developer তানিম আগের লেসনের Derived Table দিয়ে কাজটা করলেন। প্রথমে
                confirmed Booking গুলো, তার উপরে জায়গা প্রতি যোগফল, তার উপরে গড়। গড় বের করতে আবার জায়গা প্রতি যোগফল
                লাগে, তাই সেই পুরো অংশটা তিনি দ্বিতীয়বার লিখলেন। Query দাঁড়াল প্রায় চল্লিশ লাইন। চলল, ফলাফলও ঠিক।
              </ContentParagraph>
              <ContentParagraph>
                এক সপ্তাহ পরে ফারুক সাহেব বললেন, এবার pending Booking গুলোও আয়ে ধরতে। তানিম Query খুলে উপরের দিকের
                শর্তটা বদলালেন, confirmed থেকে confirmed আর pending। দ্বিতীয় কপিটা চোখ এড়িয়ে গেল, সেটা নিচে বন্ধনীর
                তিন স্তর ভেতরে লুকিয়ে ছিল। Report চলল, কোনো Error নেই। জায়গা প্রতি আয় বদলাল, Saint Martin এর ঘরে এখন
                175000, কিন্তু গড়ের ঘরে আগের মতোই 70600, যেটা শুধু confirmed এর গড়। আসল গড় হওয়ার কথা 90133.33। মালিক
                এক সপ্তাহ ভুল গড় দেখে সিদ্ধান্ত নিলেন।
              </ContentParagraph>
              <ContentParagraph>
                ভুলটা SQL এর না, লেখার ধরনের। একই যুক্তি দুই জায়গায় লেখা থাকলে একদিন একটা কপি বদলাবে আর অন্যটা
                বদলাবে না। আর ভেতর থেকে বাইরে পড়তে হয় এমন Query তে কোন অংশ কী করছে, সেটা খুঁজে বের করাই কঠিন। নিচে
                তানিমের প্রথম Query টা চালিয়ে দেখুন, তারপর লম্বা হলেও পড়ার চেষ্টা করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের Derived Table সংস্করণ"
              query={NESTED_REPORT}
              caption="৬টা Row, গড় 70600.00, প্রথম তিনটা জায়গা গড়ের উপরে। লক্ষ করুন, confirmed Booking বের করার অংশ আর জায়গা প্রতি যোগফলের অংশ দুইবার লেখা আছে: একবার r এর ভেতরে, একবার x এর ভেতরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই Report, WITH দিয়ে লেখা। কাজ একই, ফলাফলও হুবহু একই। শুধু প্রতিটা ধাপের একটা নাম আছে, আর ধাপগুলো
              সাজানো সেই ক্রমে, যে ক্রমে কাজ হয়। গড় বের করার ধাপ জায়গা প্রতি যোগফল আবার লেখেনি, শুধু নাম ধরে আগের
              ধাপটা পড়েছে। তাই pending যোগ করতে হলে বদলাতে হয় একটাই লাইন, একটাই জায়গায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Report, WITH দিয়ে"
              query={CTE_REPORT}
              caption="হুবহু একই ৬টা Row। এবার confirmed ধাপের WHERE এ status = 'confirmed' এর জায়গায় status IN ('confirmed', 'pending') লিখে আবার চালান। গড় নিজে থেকেই 90133.33 হয়ে যাবে, কারণ গড়ের ধাপ সেই একই ধাপ পড়ছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "CTE নামটার মানে",
          content: (
            <ContentParagraph>
              CTE মানে Common Table Expression। Expression কারণ এটা একটা Query, যার ফলাফল একটা Table এর মতো। Common
              কারণ একবার নাম দিয়ে লিখলে সেই Statement এর ভেতরে যত জায়গায় দরকার, সবাই সেটা ভাগ করে পড়তে পারে।
              অনেকে একে WITH Query ও বলেন, PostgreSQL এর Documentation এ দুটো নামই আছে। এই লেসনে দুটোর মানে একই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-cte-is",
      subHeader: { index: "002", title: "What a CTE Is" },
      title: <SectionTitle>নাম দেওয়া একটা সাময়িক ফলাফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বড় কোনো রান্নার আগে রাঁধুনি মশলা বেটে, পেঁয়াজ কেটে, আলাদা আলাদা বাটিতে রেখে দেন। প্রতিটা বাটির একটা
                পরিচয় থাকে: এটায় আদা বাটা, ওটায় ভাজা পেঁয়াজ। আসল রান্নার সময় তিনি আর আদা খোঁজেন না, শুধু বাটিটা তুলে
                নেন। রান্না শেষ হলে বাটিগুলো ধুয়ে ফেলা হয়, পরের দিন আবার নতুন করে।
              </ContentParagraph>
              <ContentParagraph>
                CTE ঠিক সেই বাটি। WITH লিখে আপনি একটা Query কে একটা নাম দেন। সেই নামের নিচে Query এর ফলাফল একটা
                সাময়িক Table এর মতো থাকে। তারপর মূল Query সেই নাম ধরে FROM এ লেখে, যেন সত্যিকারের একটা Table। আর
                Statement শেষ হওয়ার সাথে সাথে বাটিটা উধাও, Database এ তার কোনো চিহ্ন থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে ছোট CTE টা দেখুন। এখানে একটাই ধাপ: confirmed Booking গুলো। মূল Query সেগুলো গোনে আর টাকার যোগফল
                বের করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম CTE"
              query={`WITH confirmed AS (
  SELECT *
  FROM bookings
  WHERE status = 'confirmed'
)
SELECT count(*) AS bookings, sum(total_bdt) AS revenue_bdt
FROM confirmed;`}
              caption="একটা Row: 17টা Booking, 423600.00 টাকা। confirmed নামে কোনো Table Database এ নেই। নামটা WITH এর ভেতরে জন্মেছে, শুধু এই Statement এর জন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ছোট উদাহরণে CTE না লিখে সরাসরি WHERE দিলেও চলত। এক ধাপের কাজে CTE এর লাভ সামান্য। লাভটা বোঝা যায়
                যখন ধাপ তিন চারটা হয়, অথবা একই ধাপ দুই জায়গায় লাগে। তবু শুরুতে এক ধাপ দিয়ে অভ্যাস করা ভালো, কারণ গঠনটা
                সব সময় একই: WITH, নাম, AS, বন্ধনীতে Query, তারপর মূল Query।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CTE এর ভেতরের Query</strong> যেকোনো সাধারণ SELECT হতে পারে: JOIN, WHERE, GROUP BY, সব চলে।
                </ListItem>
                <ListItem>
                  <strong>মূল Query</strong> CTE এর নাম FROM বা JOIN এ লেখে, Table এর মতো Alias ও দিতে পারে।
                </ListItem>
                <ListItem>
                  <strong>আয়ু</strong> শুধু এই একটা Statement। সেমিকোলনের পরে নামটা আর কেউ চেনে না।
                </ListItem>
              </ContentList>
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
                  <code className={CODE}>pending</code> নামে একটা CTE বানান, যেখানে শুধু pending Booking গুলো। মূল
                  Query তে দুটো Column: কয়টা Booking, আর তাদের <code className={CODE}>total_bdt</code> এর যোগফল।
                </>
              }
              hint={
                <>
                  উপরের Query টা নিন, CTE এর নাম আর WHERE এর মানটা বদলান। ফলাফল একটাই Row।
                </>
              }
              solution={`WITH pending AS (
  SELECT *
  FROM bookings
  WHERE status = 'pending'
)
SELECT count(*) AS pending_bookings, sum(total_bdt) AS pending_bdt
FROM pending;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>WITH Statement এর প্রতিটা অংশ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CteAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির প্রতিটা অংশের নিয়ম একবার নিজের ভাষায় পড়ে নিন, কারণ CTE এর প্রায় সব Syntax Error এই কয়েকটা জায়গা
                থেকেই আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>WITH একবারই।</strong> যত ধাপই থাকুক, WITH শব্দটা লেখা হয় শুধু শুরুতে। দ্বিতীয় ধাপের আগে আবার
                  WITH লিখতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>নাম AS ( Query ).</strong> নাম Table এর নামের মতোই: ছোট হাতের অক্ষর, শব্দের মাঝে আন্ডারস্কোর।
                  Query টা সব সময় বন্ধনীর ভেতরে।
                </ListItem>
                <ListItem>
                  <strong>ধাপের মাঝে কমা।</strong> একটা ধাপ শেষ হলে বন্ধনী বন্ধ, তারপর কমা, তারপর পরের ধাপের নাম। শেষ
                  ধাপের বন্ধনীর পরে কমা নেই, সরাসরি মূল Query।
                </ListItem>
                <ListItem>
                  <strong>সেমিকোলন একদম শেষে।</strong> WITH থেকে মূল Query এর শেষ পর্যন্ত পুরোটা একটাই Statement। মাঝে
                  সেমিকোলন দিলে Database ধরে নেয় Statement শেষ, অথচ WITH এর পরে কোনো মূল Query নেই, তাই Error।
                </ListItem>
                <ListItem>
                  <strong>Column এর নাম, ইচ্ছা হলে।</strong> নামের পরে বন্ধনীতে Column এর নাম দেওয়া যায়, যেমন{" "}
                  <code className={CODE}>monthly (month, bookings) AS (...)</code>। তখন ভেতরের SELECT এর Alias না দিলেও
                  চলে, বাইরের নামগুলোই খাটে। সংখ্যায় না মিললে Error।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column এর নাম বাইরে দেওয়া"
              query={`WITH monthly (month, bookings) AS (
  SELECT to_char(booked_at, 'YYYY-MM'), count(*)
  FROM bookings
  GROUP BY 1
)
SELECT month, bookings
FROM monthly
ORDER BY month;`}
              caption="৬টা Row, 2025-12 এ 2টা থেকে 2026-10 এ 9টা Booking। ভেতরের SELECT এ কোনো Alias নেই, তবু Column দুটোর নাম month আর bookings, কারণ নামগুলো CTE এর নামের পাশে বন্ধনীতে দেওয়া।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার দুটো ভুল নিজের চোখে দেখুন। প্রথম Statement এ WITH এর বন্ধনীর পরেই সেমিকোলন, মূল Query নেই। দ্বিতীয়টায়
              বাইরে তিনটা Column এর নাম, অথচ ভেতরের SELECT দেয় দুটো। বক্সটা প্রথম Error এ থেমে যায়, তাই প্রথম লাইনটা মুছে
              দ্বিতীয়টা আবার চালিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো চেনা ভুল"
              query={`WITH confirmed AS (SELECT * FROM bookings WHERE status = 'confirmed');
WITH m (a, b, c) AS (SELECT 1, 2) SELECT * FROM m;`}
              caption="প্রথমটায় ERROR: syntax error at end of input। বক্সটা সেমিকোলন কেটে Statement পাঠায়, তাই এখানে বার্তা এমন। psql এ একই ভুলে লেখা আসে syntax error at or near ;। দ্বিতীয়টায় ERROR: WITH query m has 2 columns available but 3 columns specified।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "from-derived-table",
      subHeader: { index: "004", title: "From Derived Table to CTE" },
      title: <SectionTitle>একই কাজ, পড়ার ক্রম উল্টো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসন{" "}
                <Link href="/sql/topic/derived-tables" className={LINK}>
                  Derived Tables
                </Link>{" "}
                এ আপনি FROM এর ভেতরে বন্ধনীতে Query বসিয়েছেন। CTE আর Derived Table এর ক্ষমতা প্রায় একই: দুটোই একটা
                Query এর ফলাফলকে সাময়িক Table বানায়। পার্থক্য তিন জায়গায়, আর তিনটাই মানুষের সুবিধার জন্য।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পড়ার ক্রম।</strong> Derived Table এ প্রথম কাজটা সবচেয়ে ভেতরের বন্ধনীতে, তাই চোখ শুরু করে
                  মাঝখান থেকে। CTE তে প্রথম কাজটা সবার উপরে লেখা।
                </ListItem>
                <ListItem>
                  <strong>নাম।</strong> Derived Table এর Alias থাকে বন্ধনীর শেষে, Query টা পড়ে শেষ করার পরে জানা যায় এর
                  নাম কী। CTE এর নাম থাকে শুরুতেই, পড়ার আগেই জানা যায় এই অংশ কী দেবে।
                </ListItem>
                <ListItem>
                  <strong>আবার ব্যবহার।</strong> একটা Derived Table শুধু যেখানে লেখা সেখানেই। একই জিনিস অন্য জায়গায় লাগলে
                  পুরোটা আবার লিখতে হয়। CTE এর নাম একই Statement এর যেকোনো জায়গা থেকে পড়া যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InsideOutVsTopDownSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Derived Table থেকে CTE তে নেওয়ার কাজটা যান্ত্রিক। বন্ধনীর ভেতরের Query টা কেটে উপরে WITH এর নিচে বসান,
              তার Alias টাকে CTE এর নাম বানান, আর যেখান থেকে কেটেছিলেন সেখানে শুধু নামটা লিখুন। নিচের বক্সে একই প্রশ্ন
              দুইভাবে: প্রতিটা Customer এর বাতিল নয় এমন Booking এর মোট টাকা, যাঁদের 30000 বা তার বেশি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Derived Table থেকে CTE"
              query={`-- আগে: Derived Table
SELECT c.full_name, s.spend_bdt
FROM (
  SELECT customer_id, sum(total_bdt) AS spend_bdt
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
) s
JOIN customers c ON c.customer_id = s.customer_id
WHERE s.spend_bdt >= 30000
ORDER BY s.spend_bdt DESC, c.full_name;

-- পরে: একই কাজ, CTE
WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS spend_bdt
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
)
SELECT c.full_name, s.spend_bdt
FROM spend s
JOIN customers c ON c.customer_id = s.customer_id
WHERE s.spend_bdt >= 30000
ORDER BY s.spend_bdt DESC, c.full_name;`}
              caption="দুটো ফলাফল হুবহু একই, ৮টা Row: Rahim Uddin 80000.00 থেকে শুরু, শেষে Farhana Akter, Lamia Haque আর Mitu Rahman তিনজনই 36000.00। শুধু কাটা আর বসানো হয়েছে, যুক্তি একটুও বদলায়নি।"
            />
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
                  নিচের Derived Table টা CTE দিয়ে আবার লিখুন: প্রতিটা Tour এর বাতিল নয় এমন Booking এর মোট সিট, পাশে
                  Tour এর <code className={CODE}>title</code>। Column দুটো: title আর seats। সিট বেশি থেকে কম, সমান হলে
                  title অনুযায়ী।
                  <pre className="mt-3 overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-[0.75rem]">{`SELECT t.title, s.seats
FROM (
  SELECT d.tour_id, sum(b.seats) AS seats
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status <> 'cancelled'
  GROUP BY d.tour_id
) s
JOIN tours t ON t.tour_id = s.tour_id
ORDER BY s.seats DESC, t.title;`}</pre>
                </>
              }
              hint={
                <>
                  বন্ধনীর ভেতরের অংশটা নিয়ে <code className={CODE}>WITH seats_per_tour AS ( ... )</code> লিখুন, তারপর
                  মূল Query তে <code className={CODE}>FROM seats_per_tour s</code>।
                </>
              }
              solution={`WITH seats_per_tour AS (
  SELECT d.tour_id, sum(b.seats) AS seats
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status <> 'cancelled'
  GROUP BY d.tour_id
)
SELECT t.title, s.seats
FROM seats_per_tour s
JOIN tours t ON t.tour_id = s.tour_id
ORDER BY s.seats DESC, t.title;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "chain",
      subHeader: { index: "005", title: "A Chain of CTEs" },
      title: <SectionTitle>একটার পর একটা ধাপ, প্রতিটা আগেরটা পড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CTE এর আসল শক্তি দেখা যায় যখন ধাপ একাধিক। দ্বিতীয় ধাপ প্রথম ধাপের নাম ধরে পড়তে পারে, তৃতীয় ধাপ প্রথম
                আর দ্বিতীয় দুটোকেই পড়তে পারে। নিয়ম একটাই: প্রতিটা ধাপ শুধু তার আগে লেখা ধাপগুলো দেখতে পায়, পরে লেখা
                ধাপ না। কারখানার সারির মতো ভাবুন: প্রথম টেবিলে কাঠ কাটা হয়, দ্বিতীয় টেবিলে সেই কাঠ জোড়া দেওয়া হয়,
                তৃতীয় টেবিলে রং। দ্বিতীয় টেবিলের মিস্ত্রি তৃতীয় টেবিলের রং হাতে পান না, কারণ সেটা তখনো হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                থিওরির Report টা আবার দেখুন, এবার একটা মানচিত্র হিসেবে। কোন ধাপ কোন ধাপের ফলাফল পড়ে, আর প্রতিটা ধাপে কয়টা
                Row থাকে, সব আসল সংখ্যা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CteChainDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              মানচিত্র থেকে একটা জিনিস চোখে পড়ে: প্রতিটা ধাপ নিজে খুব ছোট, একটা করে কাজ। confirmed শুধু ছাঁকে,
              revenue_by_destination শুধু যোগ করে, average শুধু গড় করে। নিচের Lab এ ধাপগুলো একটা একটা চালিয়ে দেখুন,
              প্রতিটা ধাপ আসলে কী Table তৈরি করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CteChainLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ধাপ কয়টা হবে, কীভাবে ঠিক করবেন",
          content: (
            <ContentParagraph>
              প্রশ্নটা মুখে বলুন, আর যতবার “তারপর” শব্দটা আসে, ততটা ধাপ। “confirmed Booking গুলো নিন, তারপর জায়গা
              প্রতি যোগ করুন, তারপর সেই যোগফলগুলোর গড় নিন, তারপর প্রতিটা জায়গাকে গড়ের সাথে মেলান।” চারটা অংশ, তিনটা CTE
              আর একটা মূল Query। প্রতিটা ধাপের নাম হোক সেই ধাপের Row কী, সেটা দিয়ে: confirmed, revenue_by_destination।
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
                  দুই ধাপের শিকল লিখুন। প্রথম CTE <code className={CODE}>seats_per_tour</code>: প্রতিটা Tour এর বাতিল নয়
                  এমন Booking এর মোট সিট। দ্বিতীয় CTE <code className={CODE}>top_three</code>: প্রথম ধাপ থেকে সিট বেশি
                  এমন তিনটা Tour। মূল Query: <code className={CODE}>title</code> আর seats, সিট বেশি থেকে কম।
                </>
              }
              hint={
                <>
                  top_three এর ভেতরে <code className={CODE}>FROM seats_per_tour ORDER BY seats DESC LIMIT 3</code>। মূল
                  Query তে top_three কে tours এর সাথে জোড়া দিন, আর আবার ORDER BY দিন, কারণ CTE এর ভেতরের ক্রম বাইরে
                  আসার কথা দেয় না।
                </>
              }
              solution={`WITH seats_per_tour AS (
  SELECT d.tour_id, sum(b.seats) AS seats
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status <> 'cancelled'
  GROUP BY d.tour_id
),
top_three AS (
  SELECT tour_id, seats
  FROM seats_per_tour
  ORDER BY seats DESC
  LIMIT 3
)
SELECT t.title, x.seats
FROM top_three x
JOIN tours t ON t.tour_id = x.tour_id
ORDER BY x.seats DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "reading-a-long-report",
      subHeader: { index: "006", title: "Reading a Long Report" },
      title: <SectionTitle>লম্বা Report উপর থেকে নিচে পড়া আর যাচাই করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাজের জায়গায় আপনি নিজের লেখা Query এর চেয়ে অন্যের লেখা Query অনেক বেশি পড়বেন। একটা ভালো CTE Report
                পড়ার নিয়ম সহজ: প্রতিটা ধাপের নাম পড়ুন, তার নিচের Query টা এক লাইনে নিজের ভাষায় বলুন, তারপর পরের ধাপে
                যান। মূল Query তে পৌঁছানোর আগেই আপনি জানবেন কোন উপকরণ হাতে আছে। থিওরির Report টা এভাবে পড়লে দাঁড়ায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>confirmed:</strong> confirmed Booking গুলো, প্রতিটার টাকা আর কোন ট্যুরের।
                </ListItem>
                <ListItem>
                  <strong>revenue_by_destination:</strong> confirmed থেকে, জায়গা প্রতি মোট টাকা।
                </ListItem>
                <ListItem>
                  <strong>average:</strong> জায়গা প্রতি টাকাগুলোর গড়, একটাই সংখ্যা।
                </ListItem>
                <ListItem>
                  <strong>মূল Query:</strong> প্রতিটা জায়গা, তার টাকা, গড়, আর গড়ের উপরে কিনা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                লেখার সময় তিনটা অভ্যাস এই পড়াকে সহজ করে। প্রথম, ধাপের নাম হবে বিশেষ্য, যেটা বলে ধাপের প্রতিটা Row কী:
                step1, temp, x এর মতো নাম কিছুই বলে না। দ্বিতীয়, প্রতিটা ধাপের উপরে একটা ছোট মন্তব্য, দুই হাইফেন দিয়ে
                শুরু হওয়া SQL Comment। তৃতীয়, একটা ধাপ একটাই কাজ করবে। একই ধাপে ছাঁকা, জোড়া, যোগ আর তুলনা সব থাকলে
                সেটা আবার আগের সেই বন্ধনীর জঙ্গল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যেকোনো ধাপ আলাদা করে দেখার কৌশল",
          content: (
            <ContentParagraph>
              Report এর সংখ্যা সন্দেহজনক লাগলে পুরো Query নিয়ে মাথা ঘামানোর দরকার নেই। মূল Query টা সাময়িকভাবে বদলে লিখুন{" "}
              <code className={CODE}>SELECT * FROM ধাপের_নাম;</code>। তাহলে ঠিক সেই ধাপের ফলাফলটা দেখবেন। একটা একটা ধাপ
              দেখে যেখানে প্রথম ভুল সংখ্যা আসে, ভুলটা সেই ধাপে। Derived Table এ এই কাজ করতে হলে বন্ধনী খুলে খুলে আলাদা
              করতে হয়, CTE তে একটা লাইন বদলালেই হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাঝের একটা ধাপ উঁকি দিয়ে দেখা"
              query={`-- ধাপ ১: confirmed Booking, টাকা আর ট্যুর
WITH confirmed AS (
  SELECT b.booking_id, b.total_bdt, d.tour_id
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status = 'confirmed'
),
-- ধাপ ২: জায়গা প্রতি মোট টাকা
revenue_by_destination AS (
  SELECT ds.name, sum(c.total_bdt) AS revenue
  FROM confirmed c
  JOIN tours t         ON t.tour_id = c.tour_id
  JOIN destinations ds ON ds.destination_id = t.destination_id
  GROUP BY ds.name
)
-- মূল Query সাময়িকভাবে শুধু ধাপ ২ দেখাচ্ছে
SELECT * FROM revenue_by_destination
ORDER BY revenue DESC;`}
              caption="৬টা Row, Saint Martin's Island 125000.00 থেকে Sajek Valley 19000.00। শেষ লাইনের নামটা confirmed করে দিলে দেখবেন ধাপ ১ এর ১৭টা Row। তারপর আসল মূল Query টা ফিরিয়ে আনুন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "using-a-cte-twice",
      subHeader: { index: "007", title: "Using a CTE Twice" },
      title: <SectionTitle>একবার লেখা, দুই জায়গায় পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                থিওরির গল্পে তানিমের সমস্যা ছিল একই যুক্তি দুইবার লেখা। CTE তে সেটা আর লাগে না। একই নাম একই Statement এর
                যত জায়গায় দরকার, লেখা যায়: মূল Query এর FROM এ, একটা Scalar Subquery এর ভেতরে, অন্য CTE এর ভেতরে, এমনকি
                একই CTE কে নিজের সাথে জোড়া দিতেও।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে চেনা ব্যবহার: একটা দলের প্রত্যেককে সেই দলেরই গড়ের সাথে তুলনা। নিচে spend নামের ধাপটা প্রতিটা
                Customer এর বাতিল নয় এমন Booking এর মোট টাকা দেয়। মূল Query সেই spend কে দুইবার পড়ে: একবার প্রতিটা
                Customer এর Row এর জন্য, একবার সবার গড় বের করতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড়ের চেয়ে বেশি খরচ করা Customer"
              query={`WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS spend_bdt
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
)
SELECT s.customer_id, s.spend_bdt,
       round(s.spend_bdt - (SELECT avg(spend_bdt) FROM spend), 2) AS vs_average
FROM spend s
WHERE s.spend_bdt > (SELECT avg(spend_bdt) FROM spend)
ORDER BY s.spend_bdt DESC;`}
              caption="৪টা Row: Customer 1, 2, 8 আর 12। spend এ ১৩ জন Customer, গড় 41600.00, তাই Customer 1 গড়ের চেয়ে 38400.00 বেশি। spend নামটা এখানে তিন জায়গায় পড়া হয়েছে, লেখা একবারও বেশি না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা ধরন: প্রত্যেককে দলের সেরার সাথে মেলানো। seats_per_tour একবার লেখা, তারপর মূল Query সেটা দুইভাবে
              পড়ে: সব Row, আর একটা Derived Table এর ভেতর থেকে সর্বোচ্চ সংখ্যা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সেরা ট্যুরের চেয়ে কতটা পিছিয়ে"
              query={`WITH seats_per_tour AS (
  SELECT d.tour_id, sum(b.seats) AS seats
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status <> 'cancelled'
  GROUP BY d.tour_id
)
SELECT a.tour_id, a.seats,
       top.seats            AS best,
       top.seats - a.seats  AS behind_best
FROM seats_per_tour a
CROSS JOIN (SELECT max(seats) AS seats FROM seats_per_tour) top
ORDER BY a.seats DESC;`}
              caption="৭টা Row। Tour 1 এ 14টা সিট, সেটাই সেরা, তাই তার behind_best 0। Tour 4 এ মাত্র 2টা, সেরার চেয়ে 12 পিছিয়ে। এই ধরনের তুলনা Module 08 এর Window Function দিয়ে আরও ছোট করে লেখা যায়, তবে CTE দিয়ে যুক্তিটা চোখে দেখা সহজ।"
            />
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
                  <code className={CODE}>upcoming</code> নামে একটা CTE বানান: 1 November 2026 বা তার পরে শুরু হওয়া
                  Departure গুলো। মূল Query তে সেই Departure গুলো, যাদের <code className={CODE}>seats_left</code>{" "}
                  upcoming এর গড় seats_left এর চেয়ে কম। Column: departure_id, starts_on, seats_left। seats_left কম থেকে
                  বেশি, সমান হলে departure_id অনুযায়ী।
                </>
              }
              hint={
                <>
                  upcoming দুইবার লাগবে: একবার FROM এ, একবার WHERE এর ভেতরে{" "}
                  <code className={CODE}>(SELECT avg(seats_left) FROM upcoming)</code>। তারিখের শর্ত{" "}
                  <code className={CODE}>starts_on &gt;= DATE &apos;2026-11-01&apos;</code>।
                </>
              }
              solution={`WITH upcoming AS (
  SELECT departure_id, starts_on, seats_left
  FROM departures
  WHERE starts_on >= DATE '2026-11-01'
)
SELECT departure_id, starts_on, seats_left
FROM upcoming
WHERE seats_left < (SELECT avg(seats_left) FROM upcoming)
ORDER BY seats_left, departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "rules-and-errors",
      subHeader: { index: "008", title: "Rules and Errors" },
      title: <SectionTitle>পাঁচটা নিয়ম, পাঁচটা চেনা Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CTE এর নিয়ম কম, কিন্তু প্রতিটা ভাঙলে একটা নির্দিষ্ট বার্তা আসে। বার্তাগুলো চিনে রাখলে Error দেখামাত্র বুঝবেন
              কোন নিয়ম ভাঙল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "ভাঙলে কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "একই WITH এ দুটো ধাপের নাম আলাদা",
              "ERROR: WITH query name \"a\" specified more than once",
              "দ্বিতীয় ধাপের নাম বদলান",
            ],
            [
              "একটা ধাপ শুধু আগে লেখা ধাপকে পড়তে পারে",
              "ERROR: relation \"step_one\" does not exist, সাথে HINT: Use WITH RECURSIVE, or re-order the WITH items to remove forward references.",
              "ধাপগুলোর ক্রম বদলান, যাকে পড়া হয় সে আগে",
            ],
            [
              "CTE বাঁচে শুধু নিজের Statement এ",
              "পরের Statement এ নামটা লিখলে ERROR: relation \"confirmed\" does not exist",
              "যেখানে দরকার সেখানে আবার WITH, অথবা স্থায়ী কিছু (VIEW)",
            ],
            [
              "CTE এর নাম একই নামের Table কে ঢেকে দেয়",
              "কোনো Error নেই, কিন্তু Query আসল Table না পড়ে CTE পড়ে",
              "আসল Table এর নামে কখনো CTE এর নাম রাখবেন না",
            ],
            [
              "CTE এর ভেতরের ORDER BY বাইরের ক্রমের কথা দেয় না",
              "কোনো Error নেই, ক্রম কখনো ঠিক আসে, কখনো না",
              "যে ক্রম চান, মূল Query তে ORDER BY দিন",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চতুর্থ নিয়মটা সবচেয়ে বিপজ্জনক, কারণ সেটা চুপচাপ ভুল উত্তর দেয়। নিচে tours নামে একটা CTE, যার ভেতরে একটাই
              বানানো Row। মূল Query এর FROM tours এখন আর আসল ৯টা ট্যুরের Table পড়ে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম যখন আসল Table কে ঢেকে দেয়"
              query={`WITH tours AS (
  SELECT 1 AS tour_id, 'fake' AS title
)
SELECT count(*) FROM tours;

SELECT count(*) FROM tours;`}
              caption="প্রথম Statement বলে 1, দ্বিতীয়টা বলে 9। প্রথমটার ভেতরে tours নামটা CTE কে বোঝায়। Statement শেষ হতেই CTE উধাও, তাই দ্বিতীয়টা আবার আসল Table পড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CTE পরের Statement এ নেই"
              query={`WITH confirmed AS (
  SELECT * FROM bookings WHERE status = 'confirmed'
)
SELECT count(*) FROM confirmed;

SELECT count(*) FROM confirmed;`}
              caption="প্রথম Statement বলে 17। দ্বিতীয়টায় ERROR: relation confirmed does not exist। মাঝে একটা সেমিকোলন, আর সেখানেই CTE এর জীবন শেষ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`WITH monthly AS (
  SELECT month, sum(total_bdt) AS revenue_bdt
  FROM confirmed_rows
  GROUP BY month
),
confirmed_rows AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, total_bdt
  FROM bookings
  WHERE status = 'confirmed'
)
SELECT month, revenue_bdt
FROM monthly
ORDER BY month;`}
              task={
                <>
                  বক্সের Query টা চালালে ERROR: relation confirmed_rows does not exist। যুক্তি ঠিক আছে, শুধু একটা নিয়ম
                  ভাঙা। Query টা ঠিক করুন, যাতে মাস প্রতি confirmed আয় আসে, মাসের ক্রমে।
                </>
              }
              hint={
                <>
                  monthly পড়ছে confirmed_rows কে, অথচ confirmed_rows লেখা পরে। ধাপ দুটোর জায়গা বদলান, আর কমা কোথায় বসছে
                  খেয়াল রাখুন।
                </>
              }
              solution={`WITH confirmed_rows AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, total_bdt
  FROM bookings
  WHERE status = 'confirmed'
),
monthly AS (
  SELECT month, sum(total_bdt) AS revenue_bdt
  FROM confirmed_rows
  GROUP BY month
)
SELECT month, revenue_bdt
FROM monthly
ORDER BY month;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "cte-derived-view",
      subHeader: { index: "009", title: "CTE, Derived Table or View" },
      title: <SectionTitle>কোনটা কতক্ষণ বাঁচে, কোনটা কখন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা Query এর ফলাফলকে নাম দিয়ে Table এর মতো ব্যবহার করার উপায় একটা না, চারটা। চারটার পার্থক্য মূলত একটা
              প্রশ্নে: নামটা কতক্ষণ বাঁচে। বাকি সব পার্থক্য সেই উত্তর থেকেই আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LifetimeDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "Derived Table", "CTE", "TEMP Table", "VIEW"],
          rows: [
            ["কোথায় লেখা", "FROM এর ভেতরে বন্ধনীতে", "Statement এর শুরুতে WITH এ", "আলাদা CREATE TEMP TABLE Statement এ", "আলাদা CREATE VIEW Statement এ"],
            ["কতক্ষণ বাঁচে", "শুধু সেই FROM", "শুধু সেই Statement", "Connection বন্ধ হওয়া পর্যন্ত", "DROP না করা পর্যন্ত"],
            ["এক Statement এ বারবার পড়া", "না, আবার লিখতে হয়", "হ্যাঁ, নাম ধরে", "হ্যাঁ", "হ্যাঁ"],
            ["কয়েকটা Statement জুড়ে", "না", "না", "হ্যাঁ, একই Connection এ", "হ্যাঁ, সবার জন্য"],
            ["Data রাখে কি", "না, প্রতিবার হিসাব", "দুইবার পড়া হলে সাময়িকভাবে (অংশ 010)", "হ্যাঁ, কপি করে রাখে", "না, প্রতিবার হিসাব"],
            ["কোথায় শিখবেন", "Lesson 04", "এই লেসন", "Table বানানো, Module 09", "Module 14"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রোজকার কাজে সিদ্ধান্তটা সহজ। একটা Report এর ভেতরে ধাপ ভাঙতে চাইলে CTE। একটা ছোট অংশ শুধু একবার এক জায়গায়
                লাগলে Derived Table ও ঠিক আছে। একই যুক্তি অনেক Report, অনেক মানুষ, অনেক দিন ধরে ব্যবহার করবেন, যেমন
                “confirmed Booking এর আয়” এর সংজ্ঞা, তখন VIEW, যাতে সংজ্ঞাটা Database এ এক জায়গায় থাকে। VIEW এর পুরো গল্প{" "}
                <Link href="/sql/topic/views" className={LINK}>
                  Module 14
                </Link>{" "}
                এ।
              </ContentParagraph>
              <ContentParagraph>
                একটা ভুল ধারণা ভেঙে রাখা দরকার: CTE লিখলেই Query দ্রুত হয় না, Derived Table লিখলেই ধীর হয় না। আজকের
                PostgreSQL এ দুটো প্রায়ই হুবহু একই Plan এ চলে। CTE বেছে নেওয়ার কারণ পড়ার সুবিধা, গতি না। গতির প্রশ্ন
                আসে শুধু একটা বিশেষ ক্ষেত্রে, সেটাই পরের দুই অংশের বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "how-postgres-runs-a-cte",
      subHeader: { index: "010", title: "How PostgreSQL Runs a CTE" },
      title: <SectionTitle>মিশিয়ে দেওয়া, নাকি আগে চালিয়ে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL একটা CTE দুইভাবে চালাতে পারে। প্রথম উপায়: CTE এর Query টা মূল Query এর ভেতরে মিশিয়ে দেওয়া,
                যেন আপনি পুরোটা একটা Query হিসেবেই লিখেছিলেন। এর ইংরেজি নাম Inline। দ্বিতীয় উপায়: CTE টা আগে আলাদা
                করে চালিয়ে ফলাফলটা একটা সাময়িক জায়গায় রেখে দেওয়া, তারপর মূল Query সেই রাখা ফলাফল পড়ে। এর নাম
                Materialize।
              </ContentParagraph>
              <ContentParagraph>
                রান্নার উদাহরণে ফিরে যান। Inline মানে রাঁধুনি আলাদা বাটি না রেখে সরাসরি কড়াইয়ে আদা বেটে দেন, যতটুকু লাগে
                ততটুকু। Materialize মানে আগে পুরো বাটি ভরে আদা বেটে রাখা, তারপর যতবার দরকার সেখান থেকে তোলা। আদা একবার
                লাগলে বাটির ঝামেলা বাড়তি। তিনবার লাগলে বাটিই লাভজনক।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর নিয়মও ঠিক এমন। PostgreSQL 12 থেকে, একটা CTE যদি নিজেকে না ডাকে (Recursive না), কোনো
                পার্শ্বপ্রতিক্রিয়া না থাকে (একটা সাধারণ SELECT, যার ভেতরে random() এর মতো প্রতিবার আলাদা ফল দেওয়া
                Function নেই), আর মূল Query তাকে মাত্র একবার পড়ে, তাহলে সেটা মিশিয়ে
                দেওয়া হয়। দুই বা তার বেশি জায়গা থেকে পড়লে আগে একবার চালিয়ে রাখা হয়, আর প্রতিটা জায়গা সেই একই ফলাফল
                পড়ে। PostgreSQL 12 এর আগে সব CTE সবসময় আগে চালিয়ে রাখা হতো, মিশত না। পুরনো Blog আর বইয়ে যে লেখা
                পাবেন “CTE হলো Optimization Fence”, সেটা সেই পুরনো সময়ের কথা।
              </ContentParagraph>
              <ContentParagraph>
                কোন পথ নেওয়া হলো, সেটা দেখার উপায় EXPLAIN। Query এর আগে EXPLAIN লিখলে Database ফলাফলের বদলে তার
                পরিকল্পনা দেখায়। এখানে <code className={CODE}>(COSTS OFF)</code> দিয়ে খরচের সংখ্যাগুলো বাদ দেওয়া হয়েছে,
                কারণ সেগুলো মেশিন ভেদে বদলায়। Plan পড়া পুরোপুরি শিখবেন Module 13 এ। আজ শুধু একটা শব্দ খুঁজুন:{" "}
                <code className={CODE}>CTE Scan</code>। শব্দটা থাকলে CTE আগে চালিয়ে রাখা হয়েছে, না থাকলে মিশে গেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একবার পড়া CTE: মিশে যায়"
              query={`EXPLAIN (COSTS OFF)
WITH confirmed AS (
  SELECT * FROM bookings WHERE status = 'confirmed'
)
SELECT booking_id FROM confirmed WHERE customer_id = 1;`}
              caption="Plan এ মাত্র দুই লাইন: Seq Scan on bookings, আর Filter এ দুটো শর্ত একসাথে, status = 'confirmed' AND customer_id = 1। CTE এর শর্ত আর মূল Query এর শর্ত মিশে গিয়ে bookings পড়ার সময়েই একবারে বসেছে। কোথাও CTE Scan নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুইবার পড়া CTE: আগে চালিয়ে রাখা"
              query={`EXPLAIN (COSTS OFF)
WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS total
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
)
SELECT s.customer_id, s.total
FROM spend s
WHERE s.total > (SELECT avg(total) FROM spend);`}
              caption="এবার Plan এ CTE spend নামে একটা আলাদা অংশ, যেখানে bookings একবার পড়ে যোগ করা হয়েছে। তারপর দুই জায়গায় CTE Scan on spend: একবার প্রতিটা Customer এর Row এর জন্য, একবার গড়ের জন্য। bookings Table টা পুরো Query তে মাত্র একবার পড়া হয়েছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "materialized",
      subHeader: { index: "011", title: "MATERIALIZED and NOT MATERIALIZED" },
      title: <SectionTitle>PostgreSQL এর সিদ্ধান্ত নিজের হাতে নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL 12 থেকে আপনি নিজে বলে দিতে পারেন কোন পথ নিতে হবে। নামের পরে, AS এর পরে, বন্ধনীর আগে একটা শব্দ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>WITH x AS MATERIALIZED ( ... )</code>: একবার পড়া হলেও ধাপটা আগে আলাদা করে চালিয়ে
                  রাখার নির্দেশ।
                </ListItem>
                <ListItem>
                  <code className={CODE}>WITH x AS NOT MATERIALIZED ( ... )</code>: দুইবার পড়া হলেও প্রতিটা জায়গায় ধাপটা
                  মিশিয়ে দেওয়ার নির্দেশ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ দুটো আসল Query, প্রতিটা তিনভাবে লেখা। কোন পথে কী হয়, PostgreSQL 18 এর আসল Plan দেখে মিলিয়ে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MaterializeLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখন এই শব্দগুলো লাগে? MATERIALIZED লাগে যখন একটা ধাপ ঠিক একবারই চলা জরুরি। যেমন ধাপের ভেতরে random() এর
                মতো Function আছে, যেটা প্রতিবার আলাদা ফল দেয়। মিশে গেলে সেটা হয়তো একাধিকবার চলবে, আগে চালিয়ে রাখলে সবাই
                একই ফল দেখবে। PostgreSQL এর Documentation ও এই কারণটা উল্লেখ করে।
              </ContentParagraph>
              <ContentParagraph>
                NOT MATERIALIZED লাগে উল্টো অবস্থায়: একটা বড় ধাপ দুই জায়গায় পড়া হচ্ছে, কিন্তু প্রতিটা জায়গা তার ছোট্ট
                একটা অংশই চায়। আগে পুরোটা চালিয়ে রাখলে পুরো বড় ফলাফল তৈরি হয়, মিশিয়ে দিলে প্রতিটা জায়গার শর্ত ভেতরে
                ঢুকে শুধু দরকারি অংশটা পড়ে। Documentation বলে, এতে একই কাজ দুইবার হওয়ার ঝুঁকি আছে, তবু সব মিলিয়ে লাভও হতে
                পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "অভ্যাসটা হোক: কিছুই না লেখা",
          content: (
            <ContentParagraph>
              নতুন অবস্থায় MATERIALIZED বা NOT MATERIALIZED লিখবেন না। PostgreSQL এর নিজের সিদ্ধান্ত বেশিরভাগ সময় ঠিক।
              শব্দগুলো তখনই, যখন কোনো Query সত্যিই ধীর, আর EXPLAIN দেখে আপনি বুঝেছেন যে সমস্যাটা ঠিক এই সিদ্ধান্তে। ধীর
              Query খোঁজা আর সারানো পুরো Module 13 এর বিষয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একবার পড়া, তবু আগে চালিয়ে রাখা"
              query={`EXPLAIN (COSTS OFF)
WITH confirmed AS MATERIALIZED (
  SELECT * FROM bookings WHERE status = 'confirmed'
)
SELECT booking_id FROM confirmed WHERE customer_id = 1;`}
              caption="সেই একই Query, শুধু MATERIALIZED যোগ হয়েছে। এবার CTE Scan on confirmed, আর customer_id = 1 এর Filter বসেছে CTE এর ফলাফলের উপরে, bookings পড়ার সময়ে না। মানে আগে ১৭টা confirmed Booking তৈরি, তারপর তার ভেতর থেকে Customer 1 খোঁজা।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "data-modifying-ctes",
      subHeader: { index: "012", title: "Data-modifying CTEs" },
      title: <SectionTitle>যে CTE Data বদলায়, শুধু পরিচয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ প্রতিটা CTE এর ভেতরে ছিল SELECT। PostgreSQL এ CTE এর ভেতরে INSERT, UPDATE বা DELETE ও বসানো যায়।
                RETURNING দিয়ে সেই বদলে যাওয়া Row গুলো ফেরত আনা যায়, আর মূল Query সেগুলো পড়তে পারে, যেমন বাতিল করা
                Booking গুলোর তালিকা একই Statement এ দেখানো। Documentation এর নিয়ম: এমন ধাপ সবসময় ঠিক একবার আর
                পুরোপুরি চলে, মূল Query তার ফলাফল পড়ুক বা না পড়ুক।
              </ContentParagraph>
              <ContentParagraph>
                Data বদলানো এই ট্র্যাকে আসবে{" "}
                <Link href="/sql/topic/changing-data-overview" className={LINK}>
                  Module 10
                </Link>{" "}
                এ। তাই এখানে শুধু চেহারাটা দেখে রাখুন। নিচের Query টা BEGIN আর ROLLBACK এর মাঝে, তাই Data আসলে বদলায় না,
                শেষের SELECT সেটা প্রমাণ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "data-modifying-cte.sql",
          code: `BEGIN;

WITH cancelled AS (
  UPDATE bookings
  SET status = 'cancelled'
  WHERE booking_id = 20
  RETURNING booking_id, status
)
SELECT * FROM cancelled;
-- booking_id 20 | status cancelled

ROLLBACK;

SELECT booking_id, status FROM bookings WHERE booking_id = 20;
-- booking_id 20 | status pending, কিছুই বদলায়নি`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ এই রূপটা নেই",
          content: (
            <ContentParagraph>
              MySQL এ CTE এর ভেতরে শুধু SELECT চলে। WITH x AS (DELETE ...) লিখলে ERROR 1064, Syntax Error। তবে MySQL এ
              WITH দিয়ে শুরু করে তারপর UPDATE বা DELETE লেখা যায়, যেখানে CTE শুধু পড়ার কাজে লাগে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ CTE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ CTE এসেছে Version 8.0 তে। তার আগের MySQL 5.7 এ WITH নেই, তাই পুরনো কোনো Hosting এ 5.7 চললে
                সেখানে এই লেসনের Query গুলো চলবে না, Derived Table দিয়ে লিখতে হবে। এই ট্র্যাকের MySQL 8.4 এ থিওরির পুরো
                Report টা হুবহু একই লেখায় চলে, শুধু মাসের লেখার জন্য to_char এর জায়গায় DATE_FORMAT।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সাধারণ CTE আর শিকল:</strong> একই Syntax, একই নিয়ম। আগে লেখা ধাপকে পড়া যায়, পরে লেখা ধাপকে না।
                </ListItem>
                <ListItem>
                  <strong>কোথায় WITH বসে:</strong> MySQL এর Documentation অনুযায়ী SELECT, UPDATE আর DELETE এর শুরুতে, আর
                  Subquery এর ভেতরেও।
                </ListItem>
                <ListItem>
                  <strong>MATERIALIZED শব্দ নেই:</strong> লিখলে ERROR 1064। MySQL এর Optimizer নিজে ঠিক করে CTE মিশিয়ে দেবে
                  (Merge) নাকি আগে চালিয়ে রাখবে (Materialize), আর বদলাতে চাইলে MERGE ও NO_MERGE নামের Optimizer Hint
                  আছে।
                </ListItem>
                <ListItem>
                  <strong>Error এর ভাষা আলাদা:</strong> একই নাম দুইবার দিলে ERROR 1066 Not unique table/alias, পরে লেখা ধাপ
                  পড়লে ERROR 1146 Table doesn&apos;t exist।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-session.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
WITH confirmed AS (SELECT * FROM bookings WHERE status = 'confirmed')
SELECT COUNT(*), SUM(total_bdt) FROM confirmed;
-- 17 | 423600.00

WITH m (month, bookings) AS (
  SELECT DATE_FORMAT(booked_at, '%Y-%m'), COUNT(*) FROM bookings GROUP BY 1
)
SELECT * FROM m ORDER BY month;
-- 6 rows, 2025-12 এ 2 থেকে 2026-10 এ 9

WITH confirmed AS MATERIALIZED (SELECT * FROM bookings) SELECT COUNT(*) FROM confirmed;
-- ERROR 1064 (42000): You have an error in your SQL syntax ... near 'MATERIALIZED

WITH a AS (SELECT 1 AS x), a AS (SELECT 2 AS x) SELECT * FROM a;
-- ERROR 1066 (42000): Not unique table/alias: 'a'

WITH totals AS (SELECT * FROM step_one), step_one AS (SELECT 1 AS x) SELECT * FROM totals;
-- ERROR 1146 (42S02): Table 'island_tours.step_one' doesn't exist

WITH gone AS (DELETE FROM reviews WHERE rating < 3) SELECT * FROM gone;
-- ERROR 1064 (42000): You have an error in your SQL syntax ... near 'DELETE`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ থিওরির Report",
          content: (
            <ContentParagraph>
              থিওরির WITH Report টা MySQL 8.4 এ কোনো বদল ছাড়াই চলে আর একই ৬টা Row দেয়। একটাই পার্থক্য চোখে পড়বে: above
              Column এ t আর f এর জায়গায় 1 আর 0, কারণ MySQL এ তুলনার ফল একটা সংখ্যা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>মালিকের রবিবারের Report, শিকল হিসেবে</SectionTitle>,
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
                ফারুক সাহেব এবার Report টা আরেকটু বড় চান। প্রতিটা Destination এর confirmed আয়, আর মোট আয়ের কত শতাংশ সেই
                জায়গা থেকে এসেছে। যে জায়গায় কোনো আয় নেই, সেটাও থাকবে, শূন্য দিয়ে, কারণ মালিক জানতে চান Kuakata এখনো
                কিছুই আনেনি। তানিম এবার প্রথমেই ধাপগুলো মুখে বলে নিলেন: জায়গা প্রতি আয় বের করুন, তারপর সব আয়ের মোট বের
                করুন, তারপর প্রতিটা জায়গার আয়কে মোট দিয়ে ভাগ করুন।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা কথা, তাই দুটো CTE আর একটা মূল Query। প্রথম ধাপে LEFT JOIN, যাতে Kuakata না হারায় (Module 06 এর
                শিক্ষা)। দ্বিতীয় ধাপ প্রথম ধাপকে পড়ে একটাই সংখ্যা দেয়। মূল Query প্রথম ধাপকে আবার পড়ে, প্রতিটা Row এর
                পাশে সেই একটা সংখ্যা বসায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জায়গা প্রতি আয় আর তার ভাগ"
              query={`-- ধাপ ১: প্রতিটা Destination এর confirmed আয়, আয় না থাকলে 0
WITH revenue_by_destination AS (
  SELECT ds.name, coalesce(sum(b.total_bdt), 0) AS revenue_bdt
  FROM destinations ds
  LEFT JOIN tours t      ON t.destination_id = ds.destination_id
  LEFT JOIN departures d ON d.tour_id = t.tour_id
  LEFT JOIN bookings b   ON b.departure_id = d.departure_id
                        AND b.status = 'confirmed'
  GROUP BY ds.destination_id, ds.name
),
-- ধাপ ২: সব জায়গার আয়ের মোট, একটাই Row
grand AS (
  SELECT sum(revenue_bdt) AS total_bdt
  FROM revenue_by_destination
)
-- মূল Query: প্রতিটা জায়গা, তার আয়, আর মোটের কত শতাংশ
SELECT r.name, r.revenue_bdt,
       round(100 * r.revenue_bdt / g.total_bdt, 1) AS share_pct
FROM revenue_by_destination r
CROSS JOIN grand g
ORDER BY r.revenue_bdt DESC, r.name;`}
              caption="৭টা Row। Saint Martin's Island একাই 29.5 শতাংশ, Cox's Bazar 22.1, Sundarbans 21.2, শেষে Kuakata 0 আর 0.0। মোট 423600, ঠিক confirmed আয়ের সমান, যেটা দিয়ে নিজেই মিলিয়ে নিতে পারেন ধাপ ২ ঠিক আছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পরের সপ্তাহে pending ও ধরতে হলে কী বদলাবে? শুধু ধাপ ১ এর একটা লাইন: <code className={CODE}>b.status = &apos;confirmed&apos;</code>{" "}
              এর জায়গায় <code className={CODE}>b.status IN (&apos;confirmed&apos;, &apos;pending&apos;)</code>। মোট আর শতাংশ
              নিজে থেকেই ঠিক হয়ে যাবে, কারণ সেগুলো একই ধাপ পড়ে। তানিমের প্রথম সপ্তাহের ভুল এই লেখায় আর হতে পারে না।
            </ContentParagraph>
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
                  মালিক এবার প্রতিটা Customer এর হিসাব চান। CTE দিয়ে লিখুন: প্রতিটা Customer এর বাতিল নয় এমন Booking এর
                  মোট টাকা, আর সবার মোটের কত শতাংশ সেই Customer এর, এক দশমিক পর্যন্ত। যাঁদের কোনো বাতিল নয় এমন Booking
                  নেই, তাঁরা থাকবেন না। Column: <code className={CODE}>full_name</code>, spend_bdt, share_pct। শতাংশ বেশি
                  থেকে কম, সমান হলে full_name অনুযায়ী।
                </>
              }
              hint={
                <>
                  ধাপ ১: <code className={CODE}>spend</code>, bookings থেকে customer_id প্রতি sum, status &lt;&gt;
                  &apos;cancelled&apos;। ধাপ ২: <code className={CODE}>grand</code>, spend থেকে sum। মূল Query তে spend কে
                  customers এর সাথে জোড়া দিন, grand কে CROSS JOIN, আর{" "}
                  <code className={CODE}>round(100 * spend_bdt / total_bdt, 1)</code>।
                </>
              }
              solution={`WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS spend_bdt
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
),
grand AS (
  SELECT sum(spend_bdt) AS total_bdt
  FROM spend
)
SELECT c.full_name, s.spend_bdt,
       round(100 * s.spend_bdt / g.total_bdt, 1) AS share_pct
FROM spend s
JOIN customers c ON c.customer_id = s.customer_id
CROSS JOIN grand g
ORDER BY share_pct DESC, c.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা CTE Report লেখার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা মুখে বলুন, আর তারপর শব্দটা গুনুন",
              description:
                "পুরো প্রশ্নটা এক নিঃশ্বাসে বাংলায় বলুন। প্রতিটা 'তারপর' একটা নতুন ধাপ। শেষ অংশটা মূল Query, বাকিগুলো CTE।",
            },
            {
              title: "প্রতিটা ধাপের নাম আগে লিখে ফেলুন",
              description:
                "WITH এর নিচে শুধু নামগুলো আর ফাঁকা বন্ধনী: confirmed AS (), revenue_by_destination AS ()। নাম হবে বিশেষ্য, প্রতিটা Row কী তা বলে।",
            },
            {
              title: "প্রথম ধাপ লিখে একা চালান",
              description:
                "প্রথম বন্ধনী ভরুন, মূল Query তে সাময়িকভাবে SELECT * FROM সেই ধাপ। Row সংখ্যা আন্দাজের সাথে মেলে কিনা দেখুন।",
            },
            {
              title: "পরের ধাপ, আগের ধাপের নাম ধরে",
              description:
                "দ্বিতীয় ধাপ শুধু আগের ধাপের নাম পড়বে, মূল Table আবার না, যদি না সত্যিই নতুন কিছু লাগে। একা চালিয়ে মিলিয়ে নিন।",
            },
            {
              title: "একই জিনিস দুইবার লিখবেন না",
              description:
                "কোনো যুক্তি দুই জায়গায় লাগলে সেটা একটা ধাপ, আর দুই জায়গা সেই নাম পড়বে। কপি করা লেখাই পরের সপ্তাহের ভুল।",
            },
            {
              title: "মূল Query আর ORDER BY",
              description:
                "শেষে আসল মূল Query। ক্রম চাইলে ORDER BY এখানে, CTE এর ভেতরের ক্রমের উপর ভরসা না।",
            },
            {
              title: "প্রতিটা ধাপের উপরে এক লাইনের মন্তব্য",
              description:
                "-- দিয়ে শুরু করে লিখুন ধাপটা কী দেয়। তিন মাস পরে আপনি নিজেই সেই পাঠক, যিনি এই Report খুলে কিছুই মনে করতে পারছেন না।",
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
            ["WITH এর বন্ধনীর পরে সেমিকোলন", "syntax error, কারণ WITH এর পরে মূল Query নেই", "সেমিকোলন শুধু মূল Query এর শেষে"],
            ["প্রতিটা ধাপের আগে আবার WITH", "দ্বিতীয় WITH এ syntax error", "WITH একবার, ধাপগুলোর মাঝে কমা"],
            ["শেষ ধাপের পরে কমা", "মূল Query এর SELECT এ syntax error", "শেষ ধাপের বন্ধনীর পরে কমা নেই"],
            ["পরে লেখা ধাপকে পড়া", "relation does not exist, সাথে re-order এর HINT", "যাকে পড়া হয় সেই ধাপ আগে"],
            ["পরের Statement এ CTE এর নাম", "relation does not exist", "আবার WITH, অথবা VIEW বা TEMP Table"],
            ["আসল Table এর নামে CTE", "চুপচাপ ভুল Table পড়া হয়", "CTE এর নাম আলাদা রাখুন"],
            ["CTE এর ভেতরের ORDER BY এর উপর ভরসা", "বাইরের ক্রম নিশ্চিত না", "মূল Query তে ORDER BY"],
            ["step1, temp, x এর মতো নাম", "Report পড়া যায় না", "ধাপের Row কী, সেই বিশেষ্য দিয়ে নাম"],
            ["এক ধাপে সব কাজ", "আবার সেই বন্ধনীর জঙ্গল", "এক ধাপে একটা কাজ"],
            ["গতির জন্য না বুঝে MATERIALIZED", "অনেক সময় ধীর হয়, Filter ভেতরে ঢুকতে পারে না", "কিছু না লেখা, EXPLAIN দেখে তবেই"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`WITH confirmed AS (
  SELECT * FROM bookings WHERE status = 'confirmed'
),
WITH by_customer AS (
  SELECT customer_id, count(*) AS n FROM confirmed GROUP BY customer_id
)
SELECT * FROM by_customer ORDER BY n DESC, customer_id;`}
              caption="এখানে একটা ভুল আছে, তাই ERROR: syntax error at or near WITH। দ্বিতীয় ধাপের আগের WITH শব্দটা মুছে দিন। ঠিক হলে ১২টা Row আসবে: Customer 1, 2, 3, 4 আর 8 এর 2টা করে confirmed Booking, বাকি সাতজনের 1টা করে।"
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
                    href="https://www.postgresql.org/docs/current/queries-with.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: WITH Queries (Common Table Expressions)
                  </a>
                  : SELECT in WITH, Materialization আর Data-modifying CTE এর আনুষ্ঠানিক ব্যাখ্যা, এই লেসনের Inline আর
                  Materialize এর নিয়মগুলো এখান থেকে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/12.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 12 Release Notes
                  </a>
                  : যেখানে লেখা আছে CTE কবে থেকে মূল Query তে মিশতে শুরু করল, আর আগে কেন সবসময় আলাদা চলত।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/with.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: WITH (Common Table Expressions)
                  </a>
                  : MySQL এ WITH কোথায় কোথায় বসে, নামের নিয়ম, আর CTE কীভাবে একই নামের Table কে ঢেকে দেয়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/derived-table-optimization.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Merging or Materialization
                  </a>
                  : MySQL এর Optimizer কীভাবে Derived Table, View আর CTE মিশিয়ে দেয় বা আগে চালিয়ে রাখে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Subquery এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে, সেখানে Query এর ভেতরে Query দেখানো হয়েছে। সেই উদাহরণগুলো এই লেসনের মতো করে WITH
                  দিয়ে আবার লিখে দেখুন, কোনটা পড়তে সহজ।
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
                  CTE মানে WITH দিয়ে একটা Query কে নাম দেওয়া। মূল Query সেই নাম Table এর মতো পড়ে। নামটা বাঁচে শুধু সেই
                  Statement এ।
                </ListItem>
                <ListItem>
                  গঠন: WITH একবার, নাম AS ( Query ), ধাপের মাঝে কমা, শেষ ধাপের পরে কমা নেই, সেমিকোলন একদম শেষে।
                </ListItem>
                <ListItem>
                  ধাপগুলো শিকল বানায়: পরের ধাপ আগের ধাপকে পড়ে, পরে লেখা ধাপকে না। ভুল ক্রমে relation does not exist।
                </ListItem>
                <ListItem>
                  CTE আর Derived Table এর ক্ষমতা প্রায় একই। CTE বাছাইয়ের কারণ পড়ার সুবিধা: উপর থেকে নিচে, নাম আগে, একবার
                  লিখে বহুবার পড়া।
                </ListItem>
                <ListItem>
                  একই যুক্তি দুইবার লিখবেন না। একটা ধাপ, দুই জায়গা থেকে পড়া। গড়ের সাথে তুলনা, সেরার সাথে তুলনা।
                </ListItem>
                <ListItem>
                  সন্দেহ হলে মূল Query বদলে SELECT * FROM ধাপের নাম, এক ধাপ এক ধাপ করে যাচাই।
                </ListItem>
                <ListItem>
                  PostgreSQL 12 থেকে একবার পড়া সাধারণ CTE মূল Query তে মিশে যায়, দুইবার পড়লে আগে একবার চালিয়ে রাখা হয়।
                  EXPLAIN এ CTE Scan দেখে চেনা যায়। MATERIALIZED আর NOT MATERIALIZED দিয়ে এই সিদ্ধান্ত বদলানো যায়, তবে
                  সাধারণত দরকার হয় না।
                </ListItem>
                <ListItem>
                  MySQL এ CTE 8.0 থেকে, MATERIALIZED শব্দ নেই, আর CTE এর ভেতরে Data বদলানো যায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা CTE একটা নিয়ম মেনেছে: কোনো ধাপ নিজেকে পড়েনি। কিন্তু কিছু প্রশ্ন আছে যেখানে উত্তরটাই
                নিজের উপর দাঁড়িয়ে: একটা তারিখের পরের দিন, তার পরের দিন, এভাবে একটা পুরো ক্যালেন্ডার। অথবা একটা পদের
                উপরের পদ, তার উপরের পদ, একদম শীর্ষ পর্যন্ত। এর জন্য CTE কে নিজেকেই ডাকতে হয়, আর সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/recursive-ctes" className={LINK}>
                  Recursive CTEs
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
      ["CTE", "WITH দিয়ে একটা Query কে নাম দেওয়া, শুধু এক Statement এর জন্য", "confirmed: ১৭টা Booking, 423600.00"],
      ["গঠন", "WITH একবার, নাম AS ( ), ধাপের মাঝে কমা", "monthly (month, bookings) AS (...)"],
      ["Column এর নাম বাইরে", "নামের পাশে বন্ধনীতে, সংখ্যা মিলতে হবে", "৩টা নাম, ২টা Column হলে Error"],
      ["Derived Table থেকে CTE", "বন্ধনীর Query কেটে উপরে, Alias হয় নাম", "spend: ৮ জন 30000 বা বেশি"],
      ["শিকল", "পরের ধাপ আগের ধাপের নাম পড়ে", "confirmed, revenue_by_destination, average"],
      ["আগে লেখা নিয়ম", "পরে লেখা ধাপকে পড়া যায় না", "re-order এর HINT সহ Error"],
      ["একবার লেখা, বহুবার পড়া", "একই ধাপ গড় আর Row দুটোর জন্য", "গড় 41600.00, তার উপরে ৪ জন"],
      ["ধাপ যাচাই", "মূল Query বদলে SELECT * FROM ধাপ", "revenue_by_destination এর ৬টা Row"],
      ["নাম ঢেকে দেওয়া", "CTE এর নাম আসল Table কে লুকায়", "tours CTE তে 1, আসল Table এ 9"],
      ["আয়ু", "Derived Table আর CTE এক Statement, VIEW স্থায়ী", "পরের Statement এ relation does not exist"],
      ["Inline বনাম Materialize", "একবার পড়লে মিশে যায়, দুইবার পড়লে আগে চলে", "EXPLAIN এ CTE Scan on spend"],
      ["MATERIALIZED", "সিদ্ধান্ত নিজের হাতে, সাধারণত দরকার নেই", "একবার পড়া confirmed তবু CTE Scan"],
      ["MySQL", "8.0 থেকে CTE, MATERIALIZED নেই", "একই Report, above এ 1 আর 0"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "WITH confirmed AS (SELECT * FROM bookings WHERE status = 'confirmed'); SELECT count(*) FROM confirmed; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "17 আসে",
            isCorrect: false,
            explanation:
              "প্রথম সেমিকোলনেই Statement শেষ। WITH এর পরে মূল Query না থাকায় প্রথম অংশটাই Syntax Error দেয়, দ্বিতীয় অংশ পর্যন্ত যাওয়াই হয় না।",
          },
          {
            key: "B",
            text: "প্রথম অংশে Syntax Error, কারণ WITH এর পরে মূল Query নেই",
            isCorrect: true,
            explanation:
              "ঠিক। WITH থেকে মূল Query এর শেষ পর্যন্ত একটাই Statement। মাঝের সেমিকোলন সেটাকে দুই ভাগ করে দেয়, আর প্রথম ভাগে শুধু WITH, কোনো মূল Query নেই।",
          },
          {
            key: "C",
            text: "confirmed নামে একটা স্থায়ী Table তৈরি হয়, তারপর 17 আসে",
            isCorrect: false,
            explanation: "CTE কখনো স্থায়ী Table তৈরি করে না। স্থায়ী কিছু চাইলে VIEW বা CREATE TABLE লাগে।",
          },
          {
            key: "D",
            text: "24 আসে, কারণ CTE বাদ পড়ে সব Booking গোনা হয়",
            isCorrect: false,
            explanation: "confirmed নামে কোনো Table নেই, তাই কিছু গোনার প্রশ্নই আসে না। প্রথম অংশেই Error।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা WITH এ তিনটা ধাপ: a, b আর c। কোন ক্ষেত্রে relation does not exist Error আসবে?",
        options: [
          {
            key: "A",
            text: "c যখন a আর b দুটোকেই পড়ে",
            isCorrect: false,
            explanation: "c সবার শেষে লেখা, তাই a আর b দুটোই তার আগে। এটা বৈধ।",
          },
          {
            key: "B",
            text: "a যখন b কে পড়ে",
            isCorrect: true,
            explanation:
              "ঠিক। a লেখা b এর আগে, তাই a তখনো b কে চেনে না। PostgreSQL HINT দেয়: re-order the WITH items to remove forward references।",
          },
          {
            key: "C",
            text: "মূল Query যখন শুধু c কে পড়ে",
            isCorrect: false,
            explanation: "মূল Query সব ধাপের পরে, যেকোনো ধাপ পড়তে পারে। কোনো ধাপ না পড়লেও Error হয় না।",
          },
          {
            key: "D",
            text: "b যখন a কে দুইবার পড়ে",
            isCorrect: false,
            explanation: "আগে লেখা ধাপ যতবার খুশি পড়া যায়।",
          },
        ],
      },
      {
        id: 3,
        text: "তানিমের Derived Table Report এ pending যোগ করার পরে গড় ভুল এল। CTE দিয়ে লিখলে এই ভুল কেন হতো না?",
        options: [
          {
            key: "A",
            text: "CTE তে status এর শর্ত লেখা যায় না",
            isCorrect: false,
            explanation: "যায়, confirmed ধাপের WHERE এ ঠিক সেটাই আছে।",
          },
          {
            key: "B",
            text: "CTE সবসময় দ্রুত চলে, তাই হিসাব ঠিক হয়",
            isCorrect: false,
            explanation: "গতির সাথে ঠিক বা ভুলের সম্পর্ক নেই, আর CTE সবসময় দ্রুতও না।",
          },
          {
            key: "C",
            text: "জায়গা প্রতি আয়ের যুক্তি একবারই লেখা, Row আর গড় দুটোই সেই এক ধাপ পড়ে, তাই একটা বদল দুই জায়গাতেই পৌঁছায়",
            isCorrect: true,
            explanation:
              "ঠিক। ভুলটা হয়েছিল কারণ একই যুক্তির দুটো কপি ছিল আর বদল লেগেছিল একটায়। CTE তে কপিই নেই।",
          },
          {
            key: "D",
            text: "CTE নিজে থেকে pending কে confirmed ধরে",
            isCorrect: false,
            explanation: "CTE নিজে কোনো শর্ত বদলায় না, যা লেখা তাই করে।",
          },
        ],
      },
      {
        id: 4,
        text: "WITH tours AS (SELECT 1 AS tour_id, 'fake' AS title) SELECT count(*) FROM tours; এর ফল কী?",
        options: [
          {
            key: "A",
            text: "9, আসল tours Table এর Row",
            isCorrect: false,
            explanation: "এই Statement এর ভেতরে tours নামটা CTE কে বোঝায়, আসল Table কে না।",
          },
          {
            key: "B",
            text: "Error, কারণ tours নামে আগেই Table আছে",
            isCorrect: false,
            explanation: "PostgreSQL কোনো Error দেয় না, CTE চুপচাপ Table টাকে ঢেকে দেয়। এটাই বিপদ।",
          },
          {
            key: "C",
            text: "10, CTE আর Table মিলিয়ে",
            isCorrect: false,
            explanation: "দুটো মেলানো হয় না, একই নামে একটাই জিনিস পড়া হয়।",
          },
          {
            key: "D",
            text: "1, কারণ CTE এর নাম একই নামের Table কে ঢেকে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের বক্সে প্রথম Statement 1 দেয়, পরের Statement এ CTE উধাও বলে আবার 9। আসল Table এর নামে কখনো CTE এর নাম রাখবেন না।",
          },
        ],
      },
      {
        id: 5,
        text: "PostgreSQL 18 এ একটা সাধারণ CTE, যেটা Recursive না, Data বদলায় না, আর মূল Query তাকে একবারই পড়ে। কোনো শব্দ লেখা নেই। কী হয়?",
        options: [
          {
            key: "A",
            text: "মূল Query তে মিশিয়ে দেওয়া হয়, EXPLAIN এ CTE Scan থাকে না",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL 12 থেকে এই অবস্থায় CTE Inline হয়। লেসনের প্রথম EXPLAIN এ শুধু Seq Scan on bookings, দুই শর্ত একসাথে।",
          },
          {
            key: "B",
            text: "সবসময় আগে আলাদা চালিয়ে রাখা হয়",
            isCorrect: false,
            explanation: "এটা PostgreSQL 12 এর আগের আচরণ। এখন একবার পড়া সাধারণ CTE মিশে যায়।",
          },
          {
            key: "C",
            text: "CTE টা দুইবার চলে",
            isCorrect: false,
            explanation: "একবার পড়া হলে দুইবার চলার কারণ নেই।",
          },
          {
            key: "D",
            text: "Error, কারণ MATERIALIZED লেখা বাধ্যতামূলক",
            isCorrect: false,
            explanation: "MATERIALIZED ঐচ্ছিক, না লিখলে PostgreSQL নিজে সিদ্ধান্ত নেয়।",
          },
        ],
      },
      {
        id: 6,
        text: "spend নামের CTE মূল Query তে দুইবার পড়া হচ্ছে, কিছু লেখা নেই। EXPLAIN এ কী দেখবেন?",
        options: [
          {
            key: "A",
            text: "bookings দুইবার Seq Scan, কোনো CTE Scan নেই",
            isCorrect: false,
            explanation: "এটা NOT MATERIALIZED লিখলে হয়। কিছু না লিখলে দুইবার পড়া CTE আগে চালিয়ে রাখা হয়।",
          },
          {
            key: "B",
            text: "CTE spend নামে আলাদা অংশ, আর দুই জায়গায় CTE Scan on spend",
            isCorrect: true,
            explanation:
              "ঠিক। দুইবার পড়া হলে PostgreSQL ধাপটা একবার চালিয়ে রাখে, দুই জায়গা সেই একই ফলাফল পড়ে, bookings একবারই পড়া হয়।",
          },
          {
            key: "C",
            text: "Error, একই CTE দুইবার পড়া যায় না",
            isCorrect: false,
            explanation: "যায়, আর এটাই CTE এর বড় সুবিধা।",
          },
          {
            key: "D",
            text: "শুধু একটা Aggregate, কারণ গড় একটাই সংখ্যা",
            isCorrect: false,
            explanation: "গড়ের অংশ আছে, কিন্তু প্রতিটা Customer এর Row এর অংশও লাগে।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা যুক্তি অনেক Report, অনেক মানুষ, অনেক মাস ধরে ব্যবহার করবেন। কোনটা সবচেয়ে উপযুক্ত?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Report এ একই CTE কপি করে বসানো",
            isCorrect: false,
            explanation: "কপি মানেই একদিন একটা কপি বদলাবে আর বাকিগুলো না, তানিমের ভুলের বড় সংস্করণ।",
          },
          {
            key: "B",
            text: "Derived Table",
            isCorrect: false,
            explanation: "Derived Table শুধু যেখানে লেখা সেখানেই বাঁচে, CTE এর চেয়েও কম জায়গা জুড়ে।",
          },
          {
            key: "C",
            text: "TEMP Table",
            isCorrect: false,
            explanation: "TEMP Table শুধু একটা Connection যতক্ষণ খোলা, অন্য মানুষ বা পরের দিন সেটা পাবেন না।",
          },
          {
            key: "D",
            text: "VIEW, যাতে সংজ্ঞাটা Database এ এক জায়গায় থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। VIEW স্থায়ী, সবার জন্য, আর সংজ্ঞা বদলালে সব Report একসাথে নতুন সংজ্ঞা পায়। VIEW শিখবেন Module 14 এ।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ WITH x AS MATERIALIZED (SELECT ...) SELECT * FROM x; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতোই আগে চালিয়ে রাখা হয়",
            isCorrect: false,
            explanation: "MySQL এ MATERIALIZED শব্দটা নেই, তাই চালানোর প্রশ্নই আসে না।",
          },
          {
            key: "B",
            text: "শব্দটা চুপচাপ উপেক্ষা করে Query চলে",
            isCorrect: false,
            explanation: "MySQL উপেক্ষা করে না, Syntax Error দেয়।",
          },
          {
            key: "C",
            text: "ERROR 1064, Syntax Error",
            isCorrect: true,
            explanation:
              "ঠিক। MySQL এ সিদ্ধান্তটা Optimizer এর, বদলাতে চাইলে MERGE বা NO_MERGE Optimizer Hint লাগে।",
          },
          {
            key: "D",
            text: "ERROR 1146, Table does not exist",
            isCorrect: false,
            explanation: "1146 আসে পরে লেখা ধাপ পড়লে। এখানে সমস্যা লেখার নিয়মে, তাই 1064।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: একটা Report, তিনটা সংস্করণ",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>পুরনো Query কে CTE তে:</strong> আগের Module গুলোর যেকোনো একটা Query নিন যেখানে Derived Table আছে। সেটা CTE
        দিয়ে আবার লিখুন, দুটো চালিয়ে দেখান Row সংখ্যা আর মান হুবহু একই।
      </span>,
      <span key="2">
        <strong>মাসিক Report এর শিকল:</strong> তিন ধাপের CTE লিখুন: মাস প্রতি confirmed আয়, সব মাসের গড়, আর প্রতিটা মাস গড়ের
        উপরে কিনা। প্রতিটা ধাপ আলাদা করে SELECT * FROM দিয়ে চালিয়ে Row সংখ্যা লিখে রাখুন।
      </span>,
      <span key="3">
        <strong>একবার লিখে দুইবার পড়া:</strong> প্রতিটা Guide এর ট্যুর সংখ্যা একটা CTE তে রাখুন, তারপর মূল Query তে প্রতিটা Guide
        কে সবচেয়ে বেশি ট্যুর থাকা Guide এর সাথে তুলনা করুন। যে Guide এর কোনো ট্যুর নেই, তিনিও যেন থাকেন।
      </span>,
      <span key="4">
        <strong>EXPLAIN এর তুলনা:</strong> Task 3 এর Query টা তিনভাবে EXPLAIN (COSTS OFF) দিয়ে চালান: কিছু না লিখে, MATERIALIZED
        লিখে, NOT MATERIALIZED লিখে। কোনটায় CTE Scan আছে আর কোনটায় নেই, আর কেন, তিন লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> রান্নার আগে বাটিতে মশলা সাজিয়ে রাখার উদাহরণ দিয়ে একজন বন্ধুকে বোঝান CTE কী, কেন
        লম্বা Query তে এটা Derived Table এর চেয়ে পড়তে সহজ, আর কেন একই যুক্তি দুই জায়গায় লেখা বিপদ।
      </span>,
    ],
    deliverables: [
      <span key="d1">পুরনো আর নতুন Query, দুটোর ফলাফল মেলানোর প্রমাণ</span>,
      <span key="d2">মাসিক Report এর পুরো CTE আর প্রতিটা ধাপের Row সংখ্যা</span>,
      <span key="d3">Guide তুলনার Query আর তার ফলাফল</span>,
      <span key="d4">তিনটা EXPLAIN এর ফলাফল আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ CTE",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম CTE",
        description:
          "প্রথম ফাইলের দুটো Query চালান। confirmed এ 17 আর 423600.00, pending এ 4 আর 117200.00।",
      },
      {
        title: "Column এর নাম বাইরে",
        description:
          "দ্বিতীয় ফাইলে monthly, ৬টা Row। শুরুতে SET TIME ZONE লাইনটা রাখুন, যাতে মাস ঢাকার সময়ে গোনা হয়।",
      },
      {
        title: "মালিকের Report",
        description:
          "তৃতীয় ফাইলের তিন ধাপের শিকল, ৬টা Row, প্রথম তিনটা জায়গা গড়ের উপরে। তারপর মূল Query বদলে প্রতিটা ধাপ আলাদা দেখুন।",
      },
      {
        title: "একবার লিখে দুইবার পড়া",
        description:
          "চতুর্থ ফাইলে spend দুই জায়গায়, গড়ের উপরে ৪ জন Customer।",
      },
      {
        title: "চেনা Error",
        description:
          "পঞ্চম ফাইলের তিনটা Query একটা একটা চালান। প্রতিটার Error এর প্রথম লাইন ফাইলের মন্তব্যের সাথে মিলিয়ে নিন।",
      },
      {
        title: "EXPLAIN দিয়ে Inline আর Materialize",
        description:
          "ষষ্ঠ ফাইলের তিনটা EXPLAIN। প্রথমটায় CTE Scan নেই, দ্বিতীয় আর তৃতীয়টায় আছে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-cte.sql",
        code: `WITH confirmed AS (
  SELECT * FROM bookings WHERE status = 'confirmed'
)
SELECT count(*) AS bookings, sum(total_bdt) AS revenue_bdt
FROM confirmed;
-- 17 | 423600.00

WITH pending AS (
  SELECT * FROM bookings WHERE status = 'pending'
)
SELECT count(*) AS pending_bookings, sum(total_bdt) AS pending_bdt
FROM pending;
-- 4 | 117200.00`,
      },
      {
        language: "sql",
        filename: "02-column-list.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

WITH monthly (month, bookings) AS (
  SELECT to_char(booked_at, 'YYYY-MM'), count(*)
  FROM bookings
  GROUP BY 1
)
SELECT month, bookings FROM monthly ORDER BY month;
-- (6 rows)
-- 2025-12 2 | 2026-01 6 | 2026-02 1 | 2026-03 3 | 2026-09 3 | 2026-10 9`,
      },
      {
        language: "sql",
        filename: "03-owner-report.sql",
        code: `WITH confirmed AS (
  SELECT b.booking_id, b.total_bdt, d.tour_id
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  WHERE b.status = 'confirmed'
),
revenue_by_destination AS (
  SELECT ds.name, sum(c.total_bdt) AS revenue
  FROM confirmed c
  JOIN tours t         ON t.tour_id = c.tour_id
  JOIN destinations ds ON ds.destination_id = t.destination_id
  GROUP BY ds.name
),
average AS (
  SELECT avg(revenue) AS avg_revenue FROM revenue_by_destination
)
SELECT r.name, r.revenue, round(a.avg_revenue, 2) AS average,
       r.revenue > a.avg_revenue AS above
FROM revenue_by_destination r
CROSS JOIN average a
ORDER BY r.revenue DESC;
-- (6 rows), গড় 70600.00
-- Saint Martin's Island, Cox's Bazar, Sundarbans: t
-- Bandarban, Sylhet, Sajek Valley: f
-- শেষের চার লাইনের বদলে SELECT * FROM confirmed; দিলে 17 rows`,
      },
      {
        language: "sql",
        filename: "04-used-twice.sql",
        code: `WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS spend_bdt
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY customer_id
)
SELECT s.customer_id, s.spend_bdt
FROM spend s
WHERE s.spend_bdt > (SELECT avg(spend_bdt) FROM spend)
ORDER BY s.spend_bdt DESC;
-- (4 rows): 1 80000.00 | 2 75000.00 | 8 70500.00 | 12 50000.00`,
      },
      {
        language: "sql",
        filename: "05-known-errors.sql",
        code: `WITH confirmed AS (SELECT * FROM bookings WHERE status = 'confirmed');
-- ERROR:  syntax error at or near ";"

WITH a AS (SELECT 1 AS x), a AS (SELECT 2 AS x) SELECT * FROM a;
-- ERROR:  WITH query name "a" specified more than once

WITH totals AS (SELECT * FROM step_one), step_one AS (SELECT 1 AS x)
SELECT * FROM totals;
-- ERROR:  relation "step_one" does not exist
-- HINT:  Use WITH RECURSIVE, or re-order the WITH items to remove forward references.`,
      },
      {
        language: "sql",
        filename: "06-explain.sql",
        code: `EXPLAIN (COSTS OFF)
WITH confirmed AS (SELECT * FROM bookings WHERE status = 'confirmed')
SELECT booking_id FROM confirmed WHERE customer_id = 1;
-- Seq Scan on bookings
--   Filter: ((status = 'confirmed'::text) AND (customer_id = 1))

EXPLAIN (COSTS OFF)
WITH confirmed AS MATERIALIZED (SELECT * FROM bookings WHERE status = 'confirmed')
SELECT booking_id FROM confirmed WHERE customer_id = 1;
-- CTE Scan on confirmed ...

EXPLAIN (COSTS OFF)
WITH spend AS (
  SELECT customer_id, sum(total_bdt) AS total
  FROM bookings WHERE status <> 'cancelled'
  GROUP BY customer_id
)
SELECT s.customer_id, s.total FROM spend s
WHERE s.total > (SELECT avg(total) FROM spend);
-- CTE Scan on spend s ... CTE spend ... CTE Scan on spend`,
      },
    ],
    tip: (
      <ContentParagraph>
        লম্বা CTE psql এ টাইপ করার চেয়ে একটা .sql ফাইলে লিখে <code className={CODE}>\i file.sql</code> দিয়ে চালানো সহজ।
        কোনো ধাপ সন্দেহ হলে ফাইলের শেষের মূল Query টা কমেন্ট করে SELECT * FROM সেই ধাপ লিখুন, আবার \i চালান।
      </ContentParagraph>
    ),
  },
};
