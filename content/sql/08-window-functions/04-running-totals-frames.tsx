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
  FrameSlideLab,
  FrameUnitsLab,
} from "../../../components/course/topics/windows/frame-animations";
import {
  CalendarGapDiagram,
  DefaultFrameSplit,
  FrameAnatomyDiagram,
  PeersStairsDiagram,
  RowsRangeGroupsDiagram,
} from "../../../components/course/topics/windows/frame-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const CORRELATED_RUNNING = `SELECT b.booking_id,
       b.booked_at::date AS booked_on,
       b.total_bdt,
       (SELECT sum(x.total_bdt)
        FROM bookings x
        WHERE x.status = 'confirmed'
          AND x.booked_at <= b.booked_at) AS running_bdt
FROM bookings b
WHERE b.status = 'confirmed'
ORDER BY b.booked_at;`;

const WINDOW_RUNNING = `SELECT booking_id,
       booked_at::date AS booked_on,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY booked_at) AS running_bdt
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`;

const SEASON_DASHBOARD = `WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month_start,
         sum(total_bdt) AS revenue_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month_start, 'YYYY-MM') AS month,
       revenue_bdt,
       sum(revenue_bdt) OVER (ORDER BY month_start) AS running_bdt,
       round(100 * revenue_bdt / sum(revenue_bdt) OVER (), 1) AS share_pct,
       round(avg(revenue_bdt) OVER (ORDER BY month_start
             RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW), 2) AS avg_3_months
FROM monthly
ORDER BY month_start;`;

export const runningTotalsFramesContent: TopicData = {
  id: "running-totals-frames",
  introduction: {
    badge: "MODULE 08 · LESSON 04",
    title: <SectionTitle>চলমান যোগফল আর Window এর Frame</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের তিনটা লেসনে আপনি Window এর তিনটা চেহারা দেখেছেন। OVER () দিয়ে প্রতিটা Booking এর পাশে পুরো মৌসুমের গড়,
          ORDER BY দিয়ে Rank, আর PARTITION BY দিয়ে প্রতিটা দলের আলাদা হিসাব। তিন জায়গাতেই একটা জিনিস একই ছিল: একটা Row যে
          দলে পড়ে, সেই পুরো দলটাই তার হিসাবে আসত। Window টা ছিল স্থির।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে Window নড়তে শুরু করবে। প্রতিটা Row এর জন্য দলের একটা নির্দিষ্ট টুকরো, যেটা Row এর সাথে সাথে নিচে নামে:
          শুরু থেকে এই Row পর্যন্ত, শেষ তিনটা Row, অথবা ক্যালেন্ডারের গত সাত দিন। এই টুকরোর নাম Frame। চলমান যোগফল
          (Running Total), চলমান গড় (Moving Average), &ldquo;এখন পর্যন্ত মোট&rdquo; ধরনের প্রায় সব Report এর পেছনে এই
          একটাই ধারণা কাজ করে।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি চলমান যোগফল আর চলমান গণনা লিখতে পারবেন। ORDER BY লিখলেই যে Default Frame চুপচাপ বসে যায়, সেটা
          চিনবেন, আর সমান মানের Row এ সেটা কেন সিঁড়ির মতো লাফ দেয় তা ধরতে পারবেন। ROWS, RANGE আর GROUPS এর পার্থক্য বুঝবেন,
          শেষ তিনটা Booking এর গড় আর গত সাত দিনের যোগফল বের করবেন, EXCLUDE দিয়ে Frame থেকে নিজেকে বাদ দেবেন, আর MySQL এ
          কোনটা চলে আর কোনটা চলে না, সেটাও জানবেন। সব উদাহরণ Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি Window এর ভেতরের একটা চলন্ত ফ্রেম। আপনি বলে দেন কোথা থেকে কোথা পর্যন্ত, আর আমি প্রতিটা Row এর সাথে সেই মাপে এক ধাপ নিচে নামি। কিছু না বললেও আমি থাকি, তখন আমি আমার নিজের একটা অভ্যাস মেনে চলি। সেই অভ্যাসটা না জানলেই হিসাব গোলমাল হয়।",
      author: "Window Frame",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ফারুক সাহেবের খাতার শেষ ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। সপ্তাহের মিটিংয়ে Island Tours এর Manager ফারুক সাহেব একটা পুরনো লাল খাতা টেবিলে
                রাখলেন। মৌসুমের শুরু থেকে প্রতিটা confirmed Booking তিনি নিজের হাতে লিখে রাখেন: তারিখ, Booking নম্বর আর টাকা।
                একদম ডানে আরেকটা ঘর, যার মাথায় লেখা &ldquo;এখন পর্যন্ত মোট&rdquo;। প্রতিটা নতুন লাইনে তিনি আগের লাইনের
                মোটের সাথে নতুন টাকাটা যোগ করে লেখেন। শেষ লাইনে চোখ রাখলেই বোঝা যায় মৌসুমে এখন পর্যন্ত কত আয় হলো, আর মাঝের
                যেকোনো লাইনে আঙুল রাখলে বোঝা যায় সেই দিন পর্যন্ত মোট কত ছিল।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেব নতুন Developer তানিমকে বললেন, &ldquo;এই শেষ ঘরটা Database থেকে বানিয়ে দিন, খাতাটা আর হাতে
                লিখতে চাই না।&rdquo; তানিম প্রথমে Module 07 এর Correlated Subquery এর কথা ভাবলেন। প্রতিটা Booking এর জন্য
                একটা ছোট Query: যত confirmed Booking এই Booking এর সময় বা তার আগে হয়েছে, তাদের টাকার যোগফল। কাজ হলো, প্রতিটা
                লাইনের পাশে ঠিক খাতার মতো মোট এল। নিচে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: Correlated Subquery"
              query={CORRELATED_RUNNING}
              caption="১৭টা Row। running_bdt শুরু হয় 25000.00 দিয়ে, 28 December এ 50000 টাকার Booking এর পরে হয় 75000.00, আর শেষ Row এ 423600.00, পুরো মৌসুমের confirmed আয়। উত্তর ঠিক, কিন্তু প্রতিটা Row এর জন্য ভেতরের Query টা bookings Table আবার শুরু থেকে পড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উত্তর ঠিক, তবু তানিমের মন খুঁতখুঁত করছিল। ১৭টা Booking এর জন্য ভেতরের Query চলেছে ১৭ বার, আর প্রতিবার আগের সব
                Booking আবার নতুন করে যোগ করেছে। খাতায় ফারুক সাহেব কখনো এভাবে কাজ করেন না। তিনি আগের লাইনের মোটটা নেন, নতুন
                টাকাটা যোগ করেন, ব্যস। Booking যত বাড়বে, তানিমের Query এর কাজ বাড়বে তার চেয়েও দ্রুত, কারণ প্রতিটা নতুন Row এর
                জন্য আগের সবগুলো আবার পড়তে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার একই উত্তর, Window দিয়ে। পুরো কাজটা এক লাইনে: <code className={CODE}>sum(total_bdt) OVER (ORDER BY
                booked_at)</code>। PostgreSQL Row গুলো একবার booked_at এর ক্রমে সাজায়, তারপর উপর থেকে নিচে নামে, আর আগের Row
                এর যোগফলের সাথে নতুন Row এর টাকা যোগ করে যায়। ঠিক ফারুক সাহেবের কলমের মতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই খাতা, Window দিয়ে"
              query={WINDOW_RUNNING}
              caption="হুবহু একই ১৭টা Row, একই running_bdt। ভেতরে কোনো Subquery নেই। OVER এর ভেতরে শুধু ORDER BY booked_at, তবু প্রতিটা Row শুধু নিজের পর্যন্ত যোগ করল, পরের Row গুলো বাদ গেল। কেন বাদ গেল, সেটাই এই লেসনের প্রথম রহস্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lesson 01 এ আপনি <code className={CODE}>sum(total_bdt) OVER ()</code> লিখেছিলেন, আর প্রতিটা Row পেয়েছিল
              একই সংখ্যা, পুরো মোট। এখানে বন্ধনীর ভেতরে শুধু ORDER BY যোগ হয়েছে, আর হঠাৎ প্রতিটা Row আলাদা সংখ্যা পাচ্ছে।
              কারণ প্রতিটা Row এর জন্য PostgreSQL একটা আলাদা টুকরো ধরে হিসাব করছে: শুরু থেকে এই Row পর্যন্ত। সেই টুকরোর
              নাম Frame, আর এই লেসন পুরোটাই সেই টুকরো নিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Frame নামটার মানে",
          content: (
            <ContentParagraph>
              দেয়ালে একটা বড় ছবি, আর আপনার হাতে একটা খালি ফটো ফ্রেম। ফ্রেমটা ছবির যেখানে ধরবেন, শুধু সেটুকুই চোখে পড়বে, বাকিটা
              থাকবে কিন্তু হিসাবে আসবে না। Window Function এর Frame ঠিক সেই রকম। Partition হলো পুরো ছবি, Frame হলো প্রতিটা Row
              এর জন্য ধরা ফ্রেম, আর sum বা avg শুধু ফ্রেমের ভেতরের Row গুলো নিয়ে কাজ করে। ফ্রেম ধরার জায়গা Row থেকে Row তে
              বদলায়, তাই উত্তরও বদলায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-a-frame-is",
      subHeader: { index: "002", title: "What a Frame Is" },
      title: <SectionTitle>Partition এর ভেতরে প্রতিটা Row এর নিজের টুকরো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের ড্রয়ারে একটা পুরনো কার্ড আছে, যার মাঝখানে খাতার তিন লাইনের সমান একটা লম্বা ফোকর কাটা। কার্ডটা খাতার
                উপর রাখলে শুধু তিনটা লাইন দেখা যায়, বাকি সব ঢাকা পড়ে। কার্ডটা এক লাইন নিচে নামালে উপরের একটা লাইন ঢেকে যায়, আর
                নিচের একটা নতুন লাইন খুলে যায়। শেষ তিন দিনের বিক্রি একসাথে দেখতে তিনি এই কার্ডটা ব্যবহার করেন।
              </ContentParagraph>
              <ContentParagraph>
                Window Function এ এই কার্ডটাই Frame। হিসাবটা তিন স্তরে ভাবুন। প্রথমে WHERE এর পরে টিকে থাকা Row গুলো। তারপর
                PARTITION BY সেগুলোকে দলে ভাগ করে, আর না লিখলে সবাই একটা দলে। শেষে প্রতিটা Row এর জন্য তার দলের ভেতরে একটা
                Frame, মানে কোন Row থেকে কোন Row পর্যন্ত হিসাবে আসবে। sum, avg, count এর মতো Function শুধু সেই Frame এর ভেতরের
                Row গুলো দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FrameAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Frame লেখা হয় OVER এর বন্ধনীর ভেতরে, ORDER BY এর পরে। তার তিনটা অংশ, আর একটা ঐচ্ছিক চতুর্থ অংশ:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একক (Mode):</strong> ROWS, RANGE অথবা GROUPS। দূরত্ব কী দিয়ে মাপা হবে: Row গুনে, ORDER BY এর
                  মানের পার্থক্য দিয়ে, নাকি সমান মানের দল গুনে। Section 7 এ তিনটা পাশাপাশি দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>শুরু (Frame Start):</strong> UNBOUNDED PRECEDING মানে Partition এর একদম শুরু।{" "}
                  <code className={CODE}>2 PRECEDING</code> মানে Current Row থেকে দুই একক আগে। CURRENT ROW মানে এই Row।
                </ListItem>
                <ListItem>
                  <strong>শেষ (Frame End):</strong> CURRENT ROW, <code className={CODE}>1 FOLLOWING</code> মানে এক একক পরে,
                  অথবা UNBOUNDED FOLLOWING মানে Partition এর একদম শেষ।
                </ListItem>
                <ListItem>
                  <strong>বাদ দেওয়া (Frame Exclusion):</strong> EXCLUDE CURRENT ROW এর মতো কিছু, Frame এর ভেতর থেকে নির্দিষ্ট
                  Row সরিয়ে দিতে। এটা ঐচ্ছিক, Section 11 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সব মিলিয়ে গঠনটা এরকম। PRECEDING মানে আগে, FOLLOWING মানে পরে, আর এই আগে পরে মাপা হয় ORDER BY এর ক্রম ধরে,
                Table এ Row যেভাবে রাখা আছে সেভাবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "frame-shape.sql",
          code: `function(...) OVER (
  PARTITION BY ...                          -- ঐচ্ছিক: দলে ভাগ
  ORDER BY ...                              -- আগে পরে বোঝার জন্য ক্রম
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW  -- Frame: একক, শুরু, শেষ
  EXCLUDE CURRENT ROW                       -- ঐচ্ছিক: Frame থেকে বাদ
)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবির Frame টা এবার আসল Query তে। প্রতিটা confirmed Booking এর জন্য এই Booking আর তার ঠিক আগের দুটো Booking এর
              টাকার যোগফল, মানে ফারুক সাহেবের তিন লাইনের কার্ড।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন লাইনের কার্ড"
              query={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (
         ORDER BY booked_at
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS last_3_sum
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। পঞ্চম Row টা Booking 6, তার last_3_sum হলো 74000.00 = 25500 + 12500 + 36000, মানে Booking 4, 3 আর 6, ছবির রঙিন তিনটা Row। প্রথম Row এর আগে কেউ নেই, তাই সেখানে শুধু নিজের 25000.00, দ্বিতীয় Row এ দুজনের 75000.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা কথা আগেই জেনে রাখুন। Frame সব Window Function এর জন্য না। যারা একটা দল থেকে একটা মান বানায়, তারাই Frame
                মানে: sum, avg, count, min, max, string_agg এর মতো Aggregate, আর first_value, last_value, nth_value। কিন্তু
                ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD এর মতো Function Frame কে পাত্তাই দেয় না, তারা পুরো Partition আর তার ক্রম
                দেখে। নিচের Query তে Frame টা ইচ্ছা করে সবচেয়ে ছোট রাখা হয়েছে, শুধু Current Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ROW_NUMBER Frame মানে না"
              query={`SELECT booking_id,
       row_number() OVER (ORDER BY booked_at
                          ROWS BETWEEN CURRENT ROW AND CURRENT ROW) AS rn,
       count(*)     OVER (ORDER BY booked_at
                          ROWS BETWEEN CURRENT ROW AND CURRENT ROW) AS frame_rows
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। frame_rows প্রতিটা Row এ 1, কারণ Frame এ শুধু নিজে। অথচ rn ঠিকঠাক 1 থেকে 17 পর্যন্ত গেছে, কারণ ROW_NUMBER Frame না দেখে পুরো Partition এ নিজের জায়গা গোনে। Frame বদলে ROW_NUMBER এর ফল বদলানো যায় না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "running-sum-and-count",
      subHeader: { index: "003", title: "Running Sum and Running Count" },
      title: <SectionTitle>চলমান যোগফল, চলমান গণনা, চলমান গড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের খাতায় শুধু টাকার মোট থাকে। কিন্তু মিটিংয়ে আরও তিনটা প্রশ্ন প্রায়ই আসে: এখন পর্যন্ত কয়টা Booking
                হলো, এখন পর্যন্ত গড়ে একটা Booking কত টাকার, আর এখন পর্যন্ত সবচেয়ে বড় Booking কত টাকার। চারটা প্রশ্নই একই Frame
                চায়, শুরু থেকে এই Row পর্যন্ত, শুধু Function আলাদা: sum, count, avg, max।
              </ContentParagraph>
              <ContentParagraph>
                একই OVER (ORDER BY booked_at) চারবার না লিখে Lesson 01 এর WINDOW Clause দিয়ে একবার নাম দিন। নিচের Query তে
                নামটা w, আর চারটা Column সেই একই w পড়ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এখন পর্যন্ত: গণনা, যোগফল, গড়, সর্বোচ্চ"
              query={`SELECT booking_id,
       booked_at::date AS booked_on,
       total_bdt,
       count(*)        OVER w AS running_count,
       sum(total_bdt)  OVER w AS running_bdt,
       round(avg(total_bdt) OVER w, 2) AS running_avg,
       max(total_bdt)  OVER w AS biggest_so_far
FROM bookings
WHERE status = 'confirmed'
WINDOW w AS (ORDER BY booked_at)
ORDER BY booked_at;`}
              caption="১৭টা Row। running_count 1 থেকে 17, running_bdt শেষে 423600.00। running_avg শুরু হয় 25000.00 দিয়ে, দ্বিতীয় Row এর 50000 টাকার Booking এর পরে লাফিয়ে 37500.00, তারপর বেশিরভাগ সময় নামতে নামতে শেষে 24917.65। biggest_so_far দ্বিতীয় Row থেকেই 50000.00, কারণ মৌসুমে এর চেয়ে বড় confirmed Booking আর আসেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রতিটা Column একবার করে পড়ে নিন, কারণ প্রত্যেকটা থেকে একটা আলাদা শিক্ষা আছে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>running_count:</strong> এখানে এটা দেখতে ROW_NUMBER এর মতো, 1, 2, 3। কারণ booked_at এ কোনো দুটো
                  Booking এর সময় হুবহু এক না। সমান মান থাকলে count আর ROW_NUMBER আলাদা হয়ে যায়, আর সেটাই Section 6 এর ফাঁদ।
                </ListItem>
                <ListItem>
                  <strong>running_bdt:</strong> ফারুক সাহেবের খাতার শেষ ঘর। যেকোনো Row এর মান মানে সেই Booking পর্যন্ত মৌসুমের
                  মোট আয়।
                </ListItem>
                <ListItem>
                  <strong>running_avg:</strong> running_bdt কে running_count দিয়ে ভাগ করলে যা আসে, ঠিক তাই। চতুর্থ Row এ
                  113000 ভাগ 4 সমান 28250.00। শুরুর দিকে একটা বড় Booking গড়কে অনেক নাড়ায়, পরে নতুন Booking আসলেও গড় তেমন
                  নড়ে না, কারণ তখন অনেক Row মিলে গড়।
                </ListItem>
                <ListItem>
                  <strong>biggest_so_far:</strong> max ও একই Frame মানে। একবার বড় মান এলে সেটা আর নামে না, যতক্ষণ না তার চেয়ে
                  বড় কিছু আসে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "চলমান মানের শেষ Row সবসময় পুরো মোট",
          content: (
            <ContentParagraph>
              চলমান যোগফল লিখে প্রথম যাচাইটা খুব সহজ: শেষ Row এর মান মিলিয়ে দেখুন <code className={CODE}>SELECT
              sum(total_bdt) FROM bookings WHERE status = &apos;confirmed&apos;</code> এর সাথে। দুটোই 423600.00 হওয়ার
              কথা। না মিললে WHERE বা Frame এর কোথাও গোলমাল আছে।
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
                  confirmed Booking গুলোর জন্য তিনটা Column দেখান: <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>seats</code>, আর <code className={CODE}>running_seats</code>, মানে booked_at এর ক্রমে
                  এই Booking পর্যন্ত মোট কয়টা Seat বিক্রি হলো। ফলাফল booked_at এর ক্রমে সাজান।
                </>
              }
              hint={
                <>
                  টাকার জায়গায় Seat যোগ করুন: <code className={CODE}>sum(seats) OVER (ORDER BY booked_at)</code>। শেষ Row এ
                  38 আসার কথা।
                </>
              }
              starter={`SELECT booking_id, seats
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              solution={`SELECT booking_id,
       seats,
       sum(seats) OVER (ORDER BY booked_at) AS running_seats
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-the-frame-move",
      subHeader: { index: "004", title: "Watch the Frame Move" },
      title: <SectionTitle>Frame কে নিজের চোখে নামতে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Frame কথাটা মাথায় বসাতে সবচেয়ে কাজের জিনিস হলো চোখের সামনে সেটাকে নড়তে দেখা। নিচের Lab এ ১৭টা confirmed
                Booking, booked_at এর ক্রমে, ঠিক উপরের Query গুলোর মতো। উপরে চারটা Frame এর বোতাম, তার নিচে কোন Function চালাবেন
                সেটা। যেকোনো Row এ ক্লিক করলে সেটা Current Row হবে, আর রঙিন হয়ে উঠবে শুধু সেই Row গুলো, যেগুলো তার Frame এ পড়ে।
                ডানে সেই Frame এর ফল, PostgreSQL যা দেয় তাই।
              </ContentParagraph>
              <ContentParagraph>চারটা জিনিস চেষ্টা করে দেখুন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চলমান যোগফল:</strong> প্রথম Row এ Frame এ শুধু একটা Row, শেষ Row এ সবগুলো। Frame এর উপরের কিনারা কখনো
                  নড়ে না, শুধু নিচের কিনারা নামে।
                </ListItem>
                <ListItem>
                  <strong>শেষ তিনটা:</strong> প্রথম দুই Row এ Frame এ তিনটা Row নেই, একটা আর দুইটা। তৃতীয় Row থেকে সবসময় তিনটা,
                  আর পুরো Frame টা একসাথে নামে।
                </ListItem>
                <ListItem>
                  <strong>আগে একটা, পরে একটা:</strong> প্রথম আর শেষ Row এ দুইটা করে, মাঝের সব Row এ তিনটা। FOLLOWING মানে
                  Frame নিচের দিকেও ছড়াতে পারে।
                </ListItem>
                <ListItem>
                  <strong>পুরোটা:</strong> যে Row তেই ক্লিক করুন, ফল একই। এটাই Lesson 01 এর OVER ()।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FrameSlideLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "যেকোনো Frame এর জন্য দুটো প্রশ্ন",
          content: (
            <ContentParagraph>
              কোনো Window Query এর ফল বুঝতে না পারলে একটা Row বেছে নিন আর নিজেকে দুটো প্রশ্ন করুন: এই Row এর Frame কোথা থেকে
              শুরু, আর কোথায় শেষ। দুটো উত্তর পেলে বাকিটা সাধারণ যোগ বা গড়। প্রায় সব গোলমাল ধরা পড়ে এই দুই প্রশ্নেই, বিশেষ করে
              দ্বিতীয়টায়, কারণ পরের Section এ দেখবেন Frame এর শেষটা সবসময় Current Row এ থামে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "the-default-frame",
      subHeader: { index: "005", title: "The Default Frame" },
      title: <SectionTitle>কিছু না লিখলেও একটা Frame থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                থিওরির রহস্যটায় ফিরে যাই। Lesson 01 এর <code className={CODE}>OVER ()</code> এ প্রতিটা Row একই মোট পেয়েছিল। এই
                লেসনের <code className={CODE}>OVER (ORDER BY booked_at)</code> এ প্রতিটা Row পেল আলাদা, চলমান মোট। দুটোর কোনোটাতেই
                আমরা ROWS বা RANGE কিছু লিখিনি। তাহলে পার্থক্যটা এল কোথা থেকে?
              </ContentParagraph>
              <ContentParagraph>
                উত্তর: Frame না লিখলে PostgreSQL নিজে একটা Frame বসিয়ে দেয়, আর কোনটা বসাবে সেটা নির্ভর করে OVER এর ভেতরে ORDER
                BY আছে কিনা তার উপর। এই নিয়মটা SQL Standard এর, MySQL ও একই নিয়ম মানে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ORDER BY নেই:</strong> Frame হলো পুরো Partition। কারণ ক্রম না থাকলে &ldquo;আগে&rdquo; আর
                  &ldquo;পরে&rdquo; বলে কিছু নেই, তাই সবাই সবাইকে দেখে। সবাই একই মোট পায়।
                </ListItem>
                <ListItem>
                  <strong>ORDER BY আছে:</strong> Frame হলো <code className={CODE}>RANGE BETWEEN UNBOUNDED PRECEDING AND
                  CURRENT ROW</code>। মানে Partition এর শুরু থেকে এই Row পর্যন্ত, সাথে এই Row এর সমান মানের সব Row। এই শেষ অংশটা
                  ছোট করে লেখা, কিন্তু পরের Section এর পুরো ঝামেলা এখান থেকেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DefaultFrameSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই sum, দুটো Default Frame"
              query={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER ()                  AS whole_total,
       sum(total_bdt) OVER (ORDER BY booked_at) AS running_total
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। whole_total প্রতিটা Row এ 423600.00, কারণ ORDER BY নেই বলে Frame পুরো Partition। running_total এ ORDER BY আছে, তাই Frame শুরু থেকে এই Row পর্যন্ত: 25000.00, 75000.00, 100500.00, শেষে আবার 423600.00। শেষ Row এ দুটো মিলে যায়, কারণ সেখানে শুরু থেকে এই Row পর্যন্ত মানেই পুরোটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা সত্যিকারের ভুল, যেটা তানিম সেই সপ্তাহেই করলেন। ফারুক সাহেব জানতে চাইলেন, প্রতিটা Booking পুরো মৌসুমের
                আয়ের কত শতাংশ। তানিমের সামনে চলমান যোগফলের Query টা খোলা ছিল, তিনি শুধু ভাগটা যোগ করলেন: টাকা ভাগ{" "}
                <code className={CODE}>sum(total_bdt) OVER (ORDER BY booked_at)</code>। Query চলল, কোনো Error নেই।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম Row এ এল 100.0। মানে মৌসুমের প্রথম Booking নাকি পুরো আয়ের একশো ভাগ! আসলে প্রথম Row এর Frame এ শুধু নিজে
                ছিল, তাই নিজেকে নিজে দিয়ে ভাগ। দ্বিতীয় Row এ 66.7, কারণ ভাগ হয়েছে প্রথম দুটোর মোট দিয়ে। প্রতিটা Row আলাদা
                সংখ্যা দিয়ে ভাগ হয়েছে, আর কোনোটাই পুরো মৌসুম না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শতাংশের ফাঁদ"
              query={`SELECT booking_id,
       total_bdt,
       round(100 * total_bdt / sum(total_bdt) OVER (ORDER BY booked_at), 1) AS wrong_pct,
       round(100 * total_bdt / sum(total_bdt) OVER (), 1)                  AS right_pct
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। প্রথম চারটা Row এ wrong_pct হলো 100.0, 66.7, 25.4, 11.1, আর right_pct হলো 5.9, 11.8, 6.0, 3.0। right_pct এর সব মান যোগ করলে প্রায় 100 হয়, wrong_pct এর যোগফলের কোনো মানে নেই। একটা ORDER BY এর জন্যই এত বড় পার্থক্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "মোটের ভাগ মানে ORDER BY ছাড়া",
          content: (
            <ContentParagraph>
              প্রশ্নে যদি &ldquo;মোটের কত ভাগ&rdquo;, &ldquo;পুরো মৌসুমের তুলনায়&rdquo; এমন কথা থাকে, তাহলে হর হবে{" "}
              <code className={CODE}>OVER ()</code>, অথবা দলের মোট চাইলে <code className={CODE}>OVER (PARTITION BY
              ...)</code>, কিন্তু কখনো ORDER BY সহ না। ORDER BY লিখলেই Default Frame টা চলমান হয়ে যায়। নিয়মটা এক লাইনে: ক্রম
              চাইলে ORDER BY, পুরোটা চাইলে ORDER BY ছাড়া।
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
                  confirmed Booking গুলোর জন্য তিনটা Column: <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>total_bdt</code>, আর <code className={CODE}>share_pct</code>, মানে এই Booking পুরো
                  মৌসুমের confirmed আয়ের কত শতাংশ, এক দশমিক পর্যন্ত round করা। ফলাফল booking_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  হরে পুরো মোট লাগবে, তাই OVER এর বন্ধনী খালি। 100 দিয়ে আগে গুণ করুন, তারপর ভাগ, তারপর{" "}
                  <code className={CODE}>round(..., 1)</code>। Booking 2 এর share_pct হওয়ার কথা 11.8।
                </>
              }
              solution={`SELECT booking_id,
       total_bdt,
       round(100 * total_bdt / sum(total_bdt) OVER (), 1) AS share_pct
FROM bookings
WHERE status = 'confirmed'
ORDER BY booking_id;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "the-ties-trap",
      subHeader: { index: "006", title: "The Ties Trap" },
      title: <SectionTitle>সমান মানে এসে Frame লাফ দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শতাংশ ঠিক হওয়ার পরে ফারুক সাহেব নতুন অনুরোধ করলেন: খাতায় তিনি মাস ধরে হিসাব দেখতে চান। তানিম ভাবলেন, মাসের ক্রমে
                সাজালেই তো মাসের চলমান মোট। তিনি ORDER BY booked_at বদলে লিখলেন{" "}
                <code className={CODE}>ORDER BY date_trunc(&apos;month&apos;, booked_at)</code>, মানে প্রতিটা Booking কে তার
                মাসের প্রথম দিনে নামিয়ে সেই ক্রমে সাজানো। নিচে পুরনো আর নতুন দুটো Column পাশাপাশি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসের ক্রমে চলমান যোগফল"
              query={`SELECT booking_id,
       to_char(booked_at, 'YYYY-MM') AS month,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY date_trunc('month', booked_at)) AS by_month,
       sum(total_bdt) OVER (ORDER BY booked_at)                      AS by_time
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। by_month Column টা সিঁড়ির মতো: December এর দুটো Row দুটোই 75000.00, January এর চারটা Row চারটাই 167000.00, February তে 186000.00, March এর তিনটা 243600.00, September এর দুটো 294100.00, October এর পাঁচটা 423600.00। by_time এ প্রতিটা Row আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব January এর প্রথম লাইনে আঙুল রাখলেন। &ldquo;5 January এর পাশে 167000? সেদিন তো পরের তিনটা Booking
                হয়ইনি। খাতায় সেদিনের মোট ছিল 100500।&rdquo; তিনি ঠিক বলছেন, আর ভুলটা SQL এর না, ভুলটা Default Frame না জানার।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা দুই ধাপে বুঝুন। প্রথম ধাপ: ORDER BY date_trunc(&apos;month&apos;, booked_at) এর চোখে January এর চারটা
                Booking একদম সমান, চারটার মানই 2026-01-01। ORDER BY এর চোখে সমান এমন Row দের বলে Peer। দ্বিতীয় ধাপ: Default
                Frame টা RANGE, আর RANGE এ CURRENT ROW মানে শুধু এই Row না, এই Row আর তার সব Peer। তাই January এর প্রথম Booking
                এর Frame এর শেষ গিয়ে থামে January এর শেষ Booking এ। চারজনের Frame একই, তাই চারজনের মোটও একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PeersStairsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের উদাহরণে Peer গুলো চোখে পড়ে, কারণ সবাই জানে একই মাসে অনেক Booking থাকে। আসল বিপদ হলো যখন সমান মান আছে
                কিন্তু আপনি জানেন না। confirmed Booking গুলোকে টাকার ক্রমে সাজান, ছোট থেকে বড়। দেখতে নিরীহ, কিন্তু এই ১৭টা
                Booking এর মধ্যে পাঁচ জোড়া একই টাকার: 12500, 25000, 25500, 28000 আর 36000, প্রত্যেকটা দুবার করে। Section 7
                এ এই জোড়াগুলোই আবার কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লুকানো Peer: একই টাকার Booking"
              query={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY total_bdt)             AS default_frame,
       sum(total_bdt) OVER (ORDER BY total_bdt, booking_id) AS unique_order
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id;`}
              caption="১৭টা Row। Booking 3 আর 22 দুটোই 12500.00, তাই default_frame এ দুটোই 35500.00। unique_order এ booking_id টাই ভাঙে, তাই Booking 3 পায় 23000.00, Booking 22 পায় 35500.00। 25000, 25500, 28000 আর 36000 এর জোড়াতেও একই ঘটনা। শেষ Row এ দুটো Column আবার মিলে যায়: 423600.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Frame এর ভেতরে আসলে কে কে আছে, সেটা দেখার একটা সহজ কৌশল আছে: sum এর জায়গায়{" "}
              <code className={CODE}>string_agg(booking_id::text, &apos;,&apos;)</code>। এটা Frame এর প্রতিটা Booking এর নম্বর
              কমা দিয়ে জুড়ে দেয়, ফলে Frame টা চোখে দেখা যায়। নিচে শুধু 25000 থেকে 28000 টাকার ছয়টা Booking, যাতে লেখাটা ছোট
              থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Frame এর সদস্যদের নাম"
              query={`SELECT booking_id,
       total_bdt,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt)             AS default_members,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt, booking_id) AS unique_members
FROM bookings
WHERE status = 'confirmed'
  AND total_bdt BETWEEN 25000 AND 28000
ORDER BY total_bdt, booking_id;`}
              caption="৬টা Row। Booking 1 এর default_members এ 1 আর 13 দুজনেই আছে, কারণ দুজনেই 25000, একে অপরের Peer। unique_members এ Booking 1 এর ঘরে শুধু 1। Booking 4 এর ঘরে default এ চারজন: 1, 13, 4, 15, আর unique এ তিনজন: 1, 13, 4। সমান মানের Peer গুলো কোন ক্রমে লেখা হবে, PostgreSQL তার কথা দেয় না, তাই কমার ভেতরের ক্রমের উপর ভরসা না করে কে কে আছে সেটা দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>সমাধান তিন রকম, প্রশ্ন অনুযায়ী বাছুন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ORDER BY কে Unique বানান:</strong> শেষে একটা Unique Column যোগ করুন, সাধারণত Primary Key:{" "}
                  <code className={CODE}>ORDER BY total_bdt, booking_id</code>। তখন কোনো দুটো Row আর Peer থাকে না, আর RANGE ও
                  ROWS একই উত্তর দেয়। এটাই সবচেয়ে নিরাপদ অভ্যাস।
                </ListItem>
                <ListItem>
                  <strong>ROWS লিখুন, সাথে Unique ORDER BY:</strong>{" "}
                  <code className={CODE}>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> লিখলে CURRENT ROW মানে শুধু এই
                  Row, Peer না। কিন্তু ORDER BY Unique না হলে সমান মানের Row গুলো কোন ক্রমে গোনা হবে সেটা ঠিক থাকে না, তাই এখানেও
                  booking_id লাগবে।
                </ListItem>
                <ListItem>
                  <strong>মাসের মোটই যদি চান:</strong> তাহলে আগে GROUP BY দিয়ে মাস প্রতি একটা Row বানান, তারপর সেই মাসগুলোর উপরে
                  চলমান যোগফল। তখন প্রতিটা মাস একটাই Row, Peer হওয়ার সুযোগই নেই। Section 14 এর Dashboard ঠিক এভাবে বানানো।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "শুধু ROWS লিখলেই সমস্যা শেষ না",
          content: (
            <ContentParagraph>
              অনেকে শেখেন &ldquo;চলমান যোগফলে সবসময় ROWS লিখুন&rdquo;, আর ORDER BY তে Unique Column দেন না। মাসের উদাহরণে{" "}
              <code className={CODE}>ORDER BY date_trunc(&apos;month&apos;, booked_at) ROWS ...</code> লিখলে সিঁড়ি চলে যায়
              ঠিকই, কিন্তু January এর চারটা Booking কোন ক্রমে যোগ হবে, সেটা PostgreSQL ঠিক করে নিজের সুবিধামতো। এই লেসন লেখার সময়
              এক পরীক্ষায় 10 January এর Booking টা 5 January এর আগে যোগ হয়েছিল, ফলে 5 January এর পাশে এসেছিল ভুল মোট। Query
              চলে, সংখ্যা দেখতে ঠিকঠাক লাগে, শুধু উত্তরটা নিশ্চিত না। তাই ROWS এর সাথেও ORDER BY তে একটা Unique Column দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  confirmed Booking গুলো ছোট থেকে বড় <code className={CODE}>total_bdt</code> এর ক্রমে, তিনটা Column:{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>total_bdt</code>,{" "}
                  <code className={CODE}>running_bdt</code>। সমান টাকার Booking এর মধ্যে ছোট booking_id আগে, আর running_bdt
                  প্রতিটা Row এ শুধু সেই Row পর্যন্ত যোগ করবে, পরের সমান টাকার Row কে না। ফলাফলও একই ক্রমে। Starter এর Query তে
                  ফাঁদটা আছে, ঠিক করুন।
                </>
              }
              hint={
                <>
                  Starter চালিয়ে দেখুন, Booking 3 আর 22 দুটোই 35500.00 পাচ্ছে। OVER এর ORDER BY তে booking_id যোগ করুন। ঠিক
                  হলে Booking 3 পাবে 23000.00।
                </>
              }
              starter={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY total_bdt) AS running_bdt
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id;`}
              solution={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY total_bdt, booking_id) AS running_bdt
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "rows-range-groups",
      subHeader: { index: "007", title: "ROWS, RANGE, GROUPS" },
      title: <SectionTitle>পিছনে গোনার তিনটা একক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>1 PRECEDING</code> মানে &ldquo;এক আগে&rdquo;। কিন্তু এক কী? এক Row, এক টাকা, নাকি এক
                দল? সেটা ঠিক করে Frame এর একক। একটা উদাহরণে ভাবুন। লঞ্চঘাটে টিকিটের লাইনে আপনি দাঁড়িয়ে। &ldquo;আমার আগের
                একজন&rdquo; বললে ঠিক সামনের মানুষটা, যিনি আপনার আগে এসেছেন। &ldquo;আমার দশ মিনিট আগে থেকে যারা এসেছেন&rdquo;
                বললে মানুষ গোনা হয় না, ঘড়ি দেখা হয়, সেটা শূন্য জনও হতে পারে, পাঁচ জনও। আর &ldquo;আমার আগের একটা পরিবার&rdquo;
                বললে সামনের পুরো পরিবারটা, তারা তিনজন হলে তিনজনই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ROWS:</strong> Row গোনে। <code className={CODE}>1 PRECEDING</code> মানে ঠিক আগের একটা Row, মান যাই হোক।
                  CURRENT ROW মানে শুধু এই Row।
                </ListItem>
                <ListItem>
                  <strong>RANGE:</strong> ORDER BY এর মানের দূরত্ব মাপে।{" "}
                  <code className={CODE}>1000 PRECEDING</code> মানে যেসব Row এর মান এই Row এর মানের চেয়ে সর্বোচ্চ 1000 কম। কতগুলো
                  Row আসবে তা আগে থেকে বলা যায় না। CURRENT ROW মানে এই Row আর তার সব Peer।
                </ListItem>
                <ListItem>
                  <strong>GROUPS:</strong> সমান মানের দল গোনে। <code className={CODE}>1 PRECEDING</code> মানে আগের একটা Peer
                  দল পুরোটা, তাতে একটা Row থাকুক বা পাঁচটা। CURRENT ROW মানে এই Row এর পুরো দল।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowsRangeGroupsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবির কথাটা এবার আসল Query তে, টাকার ক্রমে সাজানো সেই ১৭টা Booking এর উপর, যেখানে পাঁচ জোড়া সমান টাকা আছে। তিনটা
              Column এ একই কথা: &ldquo;আগের একটা থেকে এই Row পর্যন্ত&rdquo;, শুধু একক আলাদা। count(*) দিয়ে দেখা হচ্ছে Frame এ
              কয়টা Row পড়ল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই কথা, তিনটা একক"
              query={`SELECT booking_id,
       total_bdt,
       count(*) OVER (ORDER BY total_bdt
                      ROWS   BETWEEN 1    PRECEDING AND CURRENT ROW) AS rows_1,
       count(*) OVER (ORDER BY total_bdt
                      RANGE  BETWEEN 1000 PRECEDING AND CURRENT ROW) AS range_1000,
       count(*) OVER (ORDER BY total_bdt
                      GROUPS BETWEEN 1    PRECEDING AND CURRENT ROW) AS groups_1
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id;`}
              caption="১৭টা Row। rows_1 প্রথম Row এ 1, তারপর সবসময় 2। Booking 10 (14000.00) এ range_1000 হলো 1, কারণ 13000 থেকে 14000 এর মধ্যে আর কেউ নেই, কিন্তু groups_1 হলো 3, কারণ আগের দলটা 12500 এর দুজন। Booking 4 আর 15 (25500.00) এ range_1000 আর groups_1 দুটোই 4: 25000 এর দুজন আর 25500 এর দুজন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টাকার মধ্যে ফাঁক বড়, 10500 এর পরে 12500, তারপর 14000। তাই RANGE আর GROUPS আলাদা উত্তর দিল। কিন্তু যেখানে মানগুলো
                পরপর পূর্ণসংখ্যা, যেমন Seat সংখ্যা 1, 2, 3, 4, 5, সেখানে &ldquo;এক মান আগে&rdquo; আর &ldquo;এক দল আগে&rdquo; একই
                কথা। নিচের Query তে সব ২৪টা Booking, Seat এর ক্রমে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পরপর মানে RANGE আর GROUPS এক"
              query={`SELECT DISTINCT seats,
       count(*) OVER (ORDER BY seats
                      RANGE  BETWEEN 1 PRECEDING AND CURRENT ROW) AS range_1,
       count(*) OVER (ORDER BY seats
                      GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW) AS groups_1
FROM bookings
ORDER BY seats;`}
              caption="৫টা Row, দুটো Column হুবহু এক: 5, 18, 16, 5, 3। ২৪টা Booking এর মধ্যে 1 Seat এর 5টা, 2 Seat এর 13টা, 3 Seat এর 3টা, 4 Seat এর 2টা, 5 Seat এর 1টা। 2 Seat এর ঘরে 18 মানে 1 Seat এর 5টা আর 2 Seat এর 13টা। DISTINCT কাজ করে Window এর পরে, তাই প্রতিটা Seat সংখ্যার জন্য একটা Row থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ টাকার ক্রমে সাজানো ১৭টা Booking। উপরে একক বাছুন, তার পাশে কতটা পিছনে যাবেন, তারপর যেকোনো Row এ ক্লিক
              করুন। একই মানের Row গুলোর পাশে peer লেখা, যাতে Peer চোখে পড়ে। বিশেষ করে 12500, 14000 আর 25500 এর Row গুলোতে ক্লিক
              করে তিনটা একক পাল্টে পাল্টে দেখুন, কোথায় তিনটার উত্তর আলাদা আর কোথায় এক।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FrameUnitsLab />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["একক", "N PRECEDING মাপে", "CURRENT ROW মানে", "কখন বাছবেন"],
          rows: [
            ["ROWS", "N টা Row", "শুধু এই Row", "শেষ N টা Booking, চলমান গড়, Unique ORDER BY সহ চলমান যোগফল"],
            [
              "RANGE",
              "ORDER BY এর মানে N দূরত্ব, সংখ্যা অথবা INTERVAL",
              "এই Row আর তার সব Peer",
              "গত সাত দিন, শেষ তিন ক্যালেন্ডার মাস, 1000 টাকার মধ্যে",
            ],
            ["GROUPS", "N টা Peer দল", "এই Row এর পুরো দল", "আগের দুটো আলাদা দিন বা আলাদা দাম, প্রতিটা দিনে যত Row ই থাকুক"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "UNBOUNDED এ একক বদলালে কিছু বদলায় কি?",
          content: (
            <ContentParagraph>
              UNBOUNDED PRECEDING সব এককে একই জায়গা, Partition এর শুরু। তাই চলমান যোগফলে ROWS আর RANGE এর পার্থক্য শুধু
              Frame এর শেষে, CURRENT ROW এ: ROWS এ শুধু এই Row, RANGE আর GROUPS এ এই Row এর শেষ Peer পর্যন্ত। ORDER BY Unique হলে
              কোনো Peer থাকে না, তখন তিনটা একক একই চলমান যোগফল দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "moving-average",
      subHeader: { index: "008", title: "Moving Average" },
      title: <SectionTitle>শেষ তিনটা Booking এর গড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেব প্রতিটা Booking এর টাকা একটা Chart এ বসাতে চাইলেন। লাইনটা হলো করাতের দাঁতের মতো: 50000 থেকে নেমে
                25500, তারপর 12500, তারপর আবার 36000। এত ওঠানামায় মৌসুমের আসল গতি বোঝা যায় না। তিনি চাইলেন একটা মসৃণ লাইন, যেখানে
                প্রতিটা বিন্দু হবে এই Booking আর তার আগের দুটো Booking এর গড়।
              </ContentParagraph>
              <ContentParagraph>
                এর নাম চলমান গড়, Moving Average। শেয়ারবাজারের Chart, আবহাওয়ার গড় তাপমাত্রা, ওয়েবসাইটের দৈনিক Visitor, সব জায়গায়
                এটা দেখবেন। SQL এ এটা একটা Frame: <code className={CODE}>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>। এখানে
                ROWS কারণ প্রশ্নটা গোনার: শেষ তিনটা Booking, তাদের টাকা যাই হোক বা তারিখের মাঝে যত দিনই যাক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চলমান গড়, আর মাঝখানে বসানো গড়"
              query={`SELECT booking_id,
       booked_at::date AS booked_on,
       total_bdt,
       round(avg(total_bdt) OVER (ORDER BY booked_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_last_3,
       count(*) OVER (ORDER BY booked_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)     AS rows_in_frame,
       round(avg(total_bdt) OVER (ORDER BY booked_at
             ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2) AS centered
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। avg_last_3 শুরু হয় 25000.00, 37500.00, 33500.00 দিয়ে, rows_in_frame প্রথম দুই Row এ 1 আর 2, তারপর সবসময় 3। centered এ Frame এর এক পা পিছনে, এক পা সামনে, তাই প্রথম Row এ 37500.00 (প্রথম দুটোর গড়) আর শেষ Row এ 27500.00 (12500 আর 42500 এর গড়)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                rows_in_frame Column টা একটা সৎ প্রশ্ন তোলে। প্রথম Row এর &ldquo;শেষ তিনটার গড়&rdquo; আসলে একটা Row এর গড়, আর
                দ্বিতীয়টা দুটোর। Chart এ সেগুলো বাকিদের মতোই দেখাবে, অথচ মানে আলাদা। অনেক Report এ নিয়ম থাকে: Frame পুরো না হলে
                গড় দেখানো হবে না। CASE দিয়ে সেটা সহজ, আর একই Frame দুবার লাগছে বলে WINDOW Clause এ একবার নাম দেওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো তিনটা না হলে ফাঁকা"
              query={`SELECT booking_id,
       total_bdt,
       CASE WHEN count(*) OVER w = 3
            THEN round(avg(total_bdt) OVER w, 2)
       END AS avg_last_3
FROM bookings
WHERE status = 'confirmed'
WINDOW w AS (ORDER BY booked_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
ORDER BY booked_at;`}
              caption="১৭টা Row। প্রথম দুটো Row এ avg_last_3 ফাঁকা, মানে NULL, তৃতীয় Row থেকে 33500.00, 29333.33, 24666.67 ইত্যাদি। WINDOW Clause এ শুধু ORDER BY না, পুরো Frame টাও নাম দিয়ে রাখা যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  confirmed Booking গুলোর জন্য তিনটা Column: <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>total_bdt</code>, আর <code className={CODE}>avg_last_3</code>, মানে booked_at এর ক্রমে এই
                  Booking আর তার ঠিক আগের দুটো Booking এর total_bdt এর গড়, দুই দশমিক পর্যন্ত round করা। প্রথম দুটো Row এ যতগুলো
                  পাওয়া যায় ততগুলোরই গড়। ফলাফল booked_at এর ক্রমে।
                </>
              }
              hint={
                <>
                  Frame টা <code className={CODE}>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>, Function টা avg, আর বাইরে{" "}
                  <code className={CODE}>round(..., 2)</code>। চতুর্থ Row এ 29333.33 আসার কথা।
                </>
              }
              solution={`SELECT booking_id,
       total_bdt,
       round(avg(total_bdt) OVER (ORDER BY booked_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_last_3
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "calendar-windows",
      subHeader: { index: "009", title: "Calendar Windows with RANGE" },
      title: <SectionTitle>ক্যালেন্ডার ধরে Frame: RANGE আর INTERVAL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চলমান গড় দেখে ফারুক সাহেব খুশি, তাই এবার মাসের হিসাব চাইলেন: প্রতিটা মাসের পাশে &ldquo;শেষ তিন মাসের গড়
                আয়&rdquo;। তানিম আগে মাস প্রতি একটা Row বানালেন, তারপর তার উপর আগের Section এর Frame বসালেন,{" "}
                <code className={CODE}>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>। মিটিংয়ে September এর ঘরে আঙুল রেখে
                ফারুক সাহেব থমকে গেলেন। &ldquo;September এর শেষ তিন মাস মানে July, August, September। এখানে February আর March এর
                টাকা ঢুকল কীভাবে?&rdquo;
              </ContentParagraph>
              <ContentParagraph>
                কারণ April থেকে August পর্যন্ত Island Tours এ একটাও Booking নেই। মাস প্রতি Row বানালে সেই পাঁচ মাসের কোনো Row ই
                তৈরি হয় না। ROWS শুধু Row গোনে, ক্যালেন্ডার দেখে না, তাই September এর আগের দুটো Row হলো March আর February। শেষ
                তিনটা Row আর শেষ তিন মাস এক কথা না, যখন মাঝে মাস হারিয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CalendarGapDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান RANGE, সাথে একটা INTERVAL।{" "}
              <code className={CODE}>RANGE BETWEEN INTERVAL &apos;2 months&apos; PRECEDING AND CURRENT ROW</code> মানে: এই Row
              এর মাস থেকে দুই মাস পিছন পর্যন্ত যত Row আছে। September 1 এর জন্য সেটা July 1 থেকে September 1, মাঝে Row থাকুক বা না
              থাকুক। PostgreSQL এ RANGE এর সাথে এমন দূরত্ব এসেছে Version 11 এ, তার আগে RANGE এ শুধু UNBOUNDED আর CURRENT ROW লেখা
              যেত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শেষ তিনটা Row বনাম শেষ তিন মাস"
              query={`WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month_start,
         sum(total_bdt) AS revenue_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month_start, 'YYYY-MM') AS month,
       revenue_bdt,
       round(avg(revenue_bdt) OVER (ORDER BY month_start
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_rows,
       round(avg(revenue_bdt) OVER (ORDER BY month_start
             RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW), 2) AS avg_3_months,
       count(*) OVER (ORDER BY month_start
             RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW) AS months_in_window
FROM monthly
ORDER BY month_start;`}
              caption="৬টা Row। প্রথম চার মাসে দুটো গড় এক, কারণ সেখানে কোনো মাস হারায়নি। 2026-09 এ avg_3_rows হলো 42366.67 (February, March আর September এর গড়), কিন্তু avg_3_months হলো 50500.00, শুধু September, months_in_window 1। 2026-10 এ 79200.00 বনাম 90000.00, আর months_in_window 2।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের মতো দিনের হিসাবেও একই কৌশল। Island Tours এর Sales টিম প্রতিদিন সকালে দেখে, গত সাত দিনে কত টাকার Booking
                এসেছে। এখানে cancelled বাদ, pending আর confirmed দুটোই ধরা হয়, কারণ pending ও সম্ভাব্য বিক্রি। Frame টা{" "}
                <code className={CODE}>RANGE BETWEEN INTERVAL &apos;7 days&apos; PRECEDING AND CURRENT ROW</code>, আর ORDER BY
                সরাসরি booked_at।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গত সাত দিনের Booking"
              query={`SELECT booking_id,
       booked_at::date AS booked_on,
       status,
       total_bdt,
       sum(total_bdt) OVER last_week AS last_7_days_bdt,
       count(*)       OVER last_week AS last_7_days_n
FROM bookings
WHERE status <> 'cancelled'
  AND booked_at >= DATE '2026-09-01'
WINDOW last_week AS (
  ORDER BY booked_at
  RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
)
ORDER BY booked_at;`}
              caption="১১টা Row। 2026-10-01 এর Booking 14 এর last_7_days_n হলো 1, কারণ cancelled বাদে আগের Booking টা 20 September এর, এগারো দিন আগে। 2026-10-08 এর Booking 17 এ 4টা Booking, 150000.00 টাকা: 1, 2, 4 আর 8 October এর। শেষ Row, 2026-10-14 এ 6টা Booking, 132700.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>তিনটা খুঁটিনাটি, যেগুলো না জানলে ভুল হয়:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সাত দিন মানে মুহূর্ত থেকে মুহূর্ত:</strong> booked_at একটা timestamptz, তাই{" "}
                  <code className={CODE}>INTERVAL &apos;7 days&apos;</code> মানে এই Booking এর ঠিক সময় থেকে সাত দিন আগের সেই
                  সময় পর্যন্ত, দিনের শুরু থেকে না। পুরো ক্যালেন্ডার দিন চাইলে আগে <code className={CODE}>booked_at::date</code>{" "}
                  এ নামিয়ে সেই Column এ ORDER BY দিন।
                </ListItem>
                <ListItem>
                  <strong>দূরত্বের ধরন Column এর ধরনের সাথে মিলতে হবে:</strong> সংখ্যার Column এ সংখ্যা (
                  <code className={CODE}>1000 PRECEDING</code>), তারিখ বা সময়ের Column এ INTERVAL। timestamptz এ{" "}
                  <code className={CODE}>7 PRECEDING</code> লিখলে Error, পরের Section এ সেই Error এর পুরো লেখা আছে।
                </ListItem>
                <ListItem>
                  <strong>এক ORDER BY Column:</strong> RANGE এ দূরত্ব দিলে ORDER BY তে ঠিক একটা Column থাকতে হবে, কারণ দূরত্ব মাপা
                  হয় একটা মানের সাথে আরেকটা মানের। <code className={CODE}>ORDER BY booked_at, booking_id</code> এর সাথে RANGE
                  এর দূরত্ব চলে না।
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
                  cancelled বাদে সব Booking এর জন্য তিনটা Column: <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>booked_on</code> (<code className={CODE}>booked_at::date</code>), আর{" "}
                  <code className={CODE}>bookings_last_7_days</code>, মানে এই Booking এর মুহূর্ত থেকে সাত দিন আগে পর্যন্ত, এই
                  Booking সহ, কয়টা Booking হয়েছে। কোনো তারিখের সীমা নেই, পুরো মৌসুম। ফলাফল booked_at এর ক্রমে।
                </>
              }
              hint={
                <>
                  উপরের Query এর count(*) অংশটা নিন, WHERE থেকে তারিখের শর্তটা বাদ দিন। Frame:{" "}
                  <code className={CODE}>RANGE BETWEEN INTERVAL &apos;7 days&apos; PRECEDING AND CURRENT ROW</code>। ২১টা Row আসবে।
                </>
              }
              solution={`SELECT booking_id,
       booked_at::date AS booked_on,
       count(*) OVER (ORDER BY booked_at
             RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW) AS bookings_last_7_days
FROM bookings
WHERE status <> 'cancelled'
ORDER BY booked_at;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "frame-syntax-rules",
      subHeader: { index: "010", title: "Frame Syntax Rules" },
      title: <SectionTitle>Frame লেখার নিয়ম আর চেনা Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Frame এর একটা ছোট লেখাও আছে। শুধু শুরুটা লিখলে শেষটা ধরে নেওয়া হয় CURRENT ROW। তাই{" "}
                <code className={CODE}>ROWS 2 PRECEDING</code> আর <code className={CODE}>ROWS BETWEEN 2 PRECEDING AND CURRENT
                ROW</code> একই জিনিস, আর <code className={CODE}>ROWS UNBOUNDED PRECEDING</code> মানে চলমান যোগফল। অনেক পুরনো Query
                তে এই ছোট রূপ দেখবেন, তাই চিনে রাখুন। নিজে লেখার সময় BETWEEN সহ পুরোটা লেখাই ভালো, পড়তে সহজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছোট রূপ আর পুরো রূপ"
              query={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY booked_at ROWS 2 PRECEDING) AS short_form,
       sum(total_bdt) OVER (ORDER BY booked_at
                            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS long_form
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at
LIMIT 5;`}
              caption="৫টা Row, দুটো Column হুবহু এক: 25000.00, 75000.00, 100500.00, 88000.00, 74000.00। চতুর্থ Row এ 88000.00 = 50000 + 25500 + 12500, প্রথম Booking টা তখন Frame থেকে বেরিয়ে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Frame এর নিয়মগুলো সংখ্যায় কম, আর প্রতিটা ভাঙলে PostgreSQL একটা নির্দিষ্ট বার্তা দেয়। নিচের দুটো Box ইচ্ছা করে
                ভুল লেখা, চালিয়ে বার্তাটা নিজের চোখে দেখুন। প্রথমটায় RANGE এর দূরত্বের সাথে ORDER BY তে দুটো Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Error: RANGE এর দূরত্বে দুটো ORDER BY Column"
              query={`SELECT booking_id,
       sum(total_bdt) OVER (ORDER BY customer_id, booked_at
                            RANGE BETWEEN 1000 PRECEDING AND CURRENT ROW)
FROM bookings;`}
              caption="ERROR: RANGE with offset PRECEDING/FOLLOWING requires exactly one ORDER BY column। দূরত্ব মাপতে একটাই মান লাগে। ORDER BY থেকে একটা Column সরান, অথবা Row গুনতে চাইলে ROWS লিখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Error: সময়ের Column এ শুধু সংখ্যা"
              query={`SELECT booking_id,
       sum(total_bdt) OVER (ORDER BY booked_at
                            RANGE BETWEEN 7 PRECEDING AND CURRENT ROW)
FROM bookings;`}
              caption="ERROR: RANGE with offset PRECEDING/FOLLOWING is not supported for column type timestamp with time zone and offset type integer। 7 কী, সাত দিন না সাত ঘণ্টা, PostgreSQL আন্দাজ করে না। 7 এর জায়গায় INTERVAL '7 days' লিখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নিয়ম", "ভাঙলে PostgreSQL যা বলে", "ঠিক করার উপায়"],
          rows: [
            [
              "RANGE এ দূরত্ব দিলে ORDER BY তে ঠিক একটা Column",
              "ERROR: RANGE with offset PRECEDING/FOLLOWING requires exactly one ORDER BY column",
              "একটা Column রাখুন, অথবা ROWS লিখুন",
            ],
            [
              "RANGE এর দূরত্ব শুধু সংখ্যা, তারিখ বা সময়ের Column এ",
              "ERROR: RANGE with offset PRECEDING/FOLLOWING is not supported for column type text",
              "text এর উপর দূরত্ব হয় না, ROWS বা GROUPS ভাবুন",
            ],
            [
              "দূরত্বের ধরন Column এর ধরনের সাথে মিলবে",
              "ERROR: ... not supported for column type timestamp with time zone and offset type integer",
              "সময়ের Column এ INTERVAL '7 days'",
            ],
            [
              "Frame এর শুরু তার শেষের পরে হতে পারে না",
              "ERROR: frame starting from following row cannot have preceding rows",
              "BETWEEN এর পরে আগে যেটা, পরে যেটা, সেই ক্রমে লিখুন",
            ],
            [
              "CURRENT ROW থেকে শুরু হলে শেষ পিছনে যেতে পারে না",
              "ERROR: frame starting from current row cannot have preceding rows",
              "BETWEEN 2 PRECEDING AND CURRENT ROW, উল্টোটা না",
            ],
            [
              "শুরু কখনো UNBOUNDED FOLLOWING না",
              "ERROR: frame start cannot be UNBOUNDED FOLLOWING",
              "UNBOUNDED FOLLOWING শুধু শেষে বসে",
            ],
            [
              "দূরত্ব ঋণাত্মক হয় না",
              "ERROR: frame starting offset must not be negative",
              "-1 PRECEDING এর বদলে 1 FOLLOWING",
            ],
            [
              "দূরত্ব একটা স্থির মান, Column না",
              "ERROR: argument of ROWS must not contain variables",
              "প্রতি Row এ আলাদা দূরত্ব চলে না, CASE বা Subquery ভাবুন",
            ],
            [
              "GROUPS এর জন্য ORDER BY লাগবেই",
              "ERROR: GROUPS mode requires an ORDER BY clause",
              "ORDER BY যোগ করুন, দল চেনা যায় ক্রম থেকেই",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "exclude",
      subHeader: { index: "011", title: "EXCLUDE" },
      title: <SectionTitle>Frame থেকে নিজেকে বাদ দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন ট্যুরের দাম ঠিক করতে বসে ফারুক সাহেব প্রশ্ন করলেন: Saint Martin Luxury Stay এর দাম কি বাকি ট্যুরগুলোর তুলনায়
                অনেক বেশি? &ldquo;বাকি&rdquo; শব্দটাই এখানে আসল। <code className={CODE}>avg(price_bdt) OVER ()</code> সব ৯টা
                ট্যুরের গড় দেয়, আর সেখানে Luxury Stay নিজেও আছে। একটা দামি জিনিস নিজেই গড়কে উপরে টানে, তারপর সেই গড়ের সাথে তুলনা
                করলে নিজেকে কম দামি মনে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য Frame এর চতুর্থ অংশ, EXCLUDE। Frame এর শুরু আর শেষ ঠিক করার পরে EXCLUDE বলে দেয় সেই Frame এর ভেতর থেকে কোন
                Row গুলো সরিয়ে দিতে হবে। চারটা বিকল্প আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>EXCLUDE NO OTHERS:</strong> কিছুই বাদ না। না লিখলে এটাই, তাই কেউ সাধারণত লেখেন না।
                </ListItem>
                <ListItem>
                  <strong>EXCLUDE CURRENT ROW:</strong> শুধু এই Row বাদ। তার সমান মানের Peer রা থেকে যায়।
                </ListItem>
                <ListItem>
                  <strong>EXCLUDE GROUP:</strong> এই Row আর তার সব Peer বাদ, মানে পুরো সমান মানের দলটা।
                </ListItem>
                <ListItem>
                  <strong>EXCLUDE TIES:</strong> এই Row থাকে, শুধু তার Peer রা বাদ। নামটা একটু ধাঁধার মতো, কিন্তু Tie মানে সমান,
                  তাই &ldquo;সমানরা বাদ, আমি না&rdquo;।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাকি ট্যুরগুলোর গড় দাম"
              query={`SELECT tour_id,
       title,
       price_bdt,
       round(avg(price_bdt) OVER (ORDER BY tour_id
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
             EXCLUDE CURRENT ROW), 2) AS others_avg,
       round(avg(price_bdt) OVER (), 2) AS all_avg
FROM tours
ORDER BY tour_id;`}
              caption="৯টা Row। all_avg সবার জন্য 13477.78। Saint Martin Luxury Stay (32000.00) এর others_avg হলো 11162.50, মানে বাকি আটটা ট্যুরের গড়ের প্রায় তিনগুণ দাম। সবচেয়ে সস্তা Ratargul Swamp Boat Day (3500.00) এর others_avg সবচেয়ে বেশি, 14725.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লক্ষ করুন, EXCLUDE একা বসে না, পুরো Frame লেখার পরে বসে। এখানে Frame টা পুরো Partition, শুরু থেকে শেষ, তারপর
                নিজেকে বাদ। শুধু <code className={CODE}>OVER (EXCLUDE CURRENT ROW)</code> লিখলে Syntax Error আসে, কারণ EXCLUDE
                Frame এর অংশ, আর Frame টা তখন লেখাই হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                CURRENT ROW, GROUP আর TIES এর পার্থক্য চোখে পড়ে শুধু যখন Peer থাকে। তাই আবার সেই 25000 থেকে 28000 টাকার ছয়টা
                Booking, যেখানে তিনটা জোড়া। string_agg দিয়ে দেখা যাক প্রতিটা EXCLUDE এর পরে Frame এ কে কে টিকে থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা EXCLUDE, পাশাপাশি"
              query={`SELECT booking_id,
       total_bdt,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt
         RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS whole,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt
         RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         EXCLUDE CURRENT ROW) AS ex_current,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt
         RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         EXCLUDE GROUP) AS ex_group,
       string_agg(booking_id::text, ',') OVER (ORDER BY total_bdt
         RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         EXCLUDE TIES) AS ex_ties
FROM bookings
WHERE status = 'confirmed'
  AND total_bdt BETWEEN 25000 AND 28000
ORDER BY total_bdt, booking_id;`}
              caption="৬টা Row। Booking 1 (25000) এর whole এ ছয়জনই: 1, 13, 4, 15, 9, 19। ex_current এ 1 নেই, বাকি পাঁচজন। ex_group এ 1 আর তার Peer 13 দুজনেই নেই, থাকে চারজন। ex_ties এ 13 নেই কিন্তু 1 নিজে আছে। Peer না থাকলে ex_current আর ex_group একই হতো।"
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
                  প্রতিটা ট্যুরের জন্য তিনটা Column: <code className={CODE}>title</code>,{" "}
                  <code className={CODE}>price_bdt</code>, আর <code className={CODE}>others_avg</code>, মানে একই Destination এর
                  বাকি ট্যুরগুলোর গড় দাম, এই ট্যুর বাদে, দুই দশমিক পর্যন্ত round করা। যে Destination এ একটাই ট্যুর, সেখানে
                  others_avg ফাঁকা (NULL) থাকবে। ফলাফল title এর বর্ণানুক্রমে।
                </>
              }
              hint={
                <>
                  PARTITION BY destination_id, Frame পুরো Partition:{" "}
                  <code className={CODE}>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING EXCLUDE CURRENT ROW</code>।
                  Frame এ কেউ না থাকলে avg নিজেই NULL দেয়। ৯টা Row, Bandarban Hill Trek এর others_avg ফাঁকা।
                </>
              }
              solution={`SELECT title,
       price_bdt,
       round(avg(price_bdt) OVER (PARTITION BY destination_id
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
             EXCLUDE CURRENT ROW), 2) AS others_avg
FROM tours
ORDER BY title;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "running-totals-per-group",
      subHeader: { index: "012", title: "Running Totals per Group" },
      title: <SectionTitle>প্রতিটা দলের ভেতরে আলাদা চলমান যোগফল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 03 এ PARTITION BY দিয়ে প্রতিটা দলকে আলাদা Window দিয়েছিলেন। Frame সেই দলের ভেতরেই থাকে, কখনো দলের সীমা
                পার হয় না। তাই PARTITION BY আর ORDER BY একসাথে লিখলে চলমান যোগফল প্রতিটা দলের শুরুতে আবার শূন্য থেকে শুরু হয়।
                ফারুক সাহেবের খাতায় এর নাম &ldquo;মাসের শুরু থেকে&rdquo;: প্রতি মাসের এক তারিখে তিনি নতুন পাতা খোলেন, আর মোট
                আবার গোড়া থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসের শুরু থেকে, আর মৌসুমের শুরু থেকে"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       booking_id,
       total_bdt,
       sum(total_bdt) OVER (PARTITION BY date_trunc('month', booked_at)
                            ORDER BY booked_at) AS month_to_date,
       sum(total_bdt) OVER (ORDER BY booked_at) AS season_to_date
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="১৭টা Row। January তে month_to_date হলো 25500.00, 38000.00, 74000.00, 92000.00, তারপর February তে আবার শুরু, 19000.00। season_to_date থামে না, চলতেই থাকে। Section 6 এ date_trunc ছিল ORDER BY তে, তাই সিঁড়ি এসেছিল। এখানে সেটা PARTITION BY তে, আর ORDER BY তে Unique booked_at, তাই কোনো সিঁড়ি নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Section 6 আর এই Section এর পার্থক্যটা মনে গেঁথে নিন, কারণ দুটোতে একই date_trunc। ORDER BY তে বসালে মাস হয়ে যায়
                ক্রমের মান, আর একই মাসের সবাই Peer। PARTITION BY তে বসালে মাস হয়ে যায় দলের সীমা, আর ভেতরের ক্রম ঠিক করে আলাদা ORDER
                BY। একই Expression, দুই জায়গায় দুই কাজ।
              </ContentParagraph>
              <ContentParagraph>
                দলে ভাগ না করেও একটা চলমান যোগফলে শুধু কিছু Row গোনা যায়। Module 05 এর FILTER মনে আছে? সেটা Window Aggregate এও
                চলে, OVER এর ঠিক আগে বসে। নিচে September থেকে সব Booking, যেকোনো status, কিন্তু চলমান যোগফলে শুধু confirmed এর
                টাকা, আর পাশে এখন পর্যন্ত কয়টা cancelled।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="FILTER দিয়ে বাছাই করা চলমান যোগফল"
              query={`SELECT booking_id,
       booked_at::date AS booked_on,
       status,
       total_bdt,
       sum(total_bdt) FILTER (WHERE status = 'confirmed')
         OVER (ORDER BY booked_at) AS running_confirmed,
       count(*) FILTER (WHERE status = 'cancelled')
         OVER (ORDER BY booked_at) AS running_cancelled
FROM bookings
WHERE booked_at >= DATE '2026-09-01'
ORDER BY booked_at;`}
              caption="১২টা Row। Booking 18 (cancelled) আর 14 (pending) এর Row এ running_confirmed আটকে থাকে 50500.00 এ, কারণ FILTER তাদের টাকা গোনে না। running_cancelled 28 September থেকে 1 হয় আর শেষ পর্যন্ত 1 ই থাকে। শেষ Row এ running_confirmed 180000.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "WHERE না FILTER?",
          content: (
            <ContentParagraph>
              WHERE এ cancelled বাদ দিলে সেই Row গুলো ফলাফল থেকেই হারিয়ে যায়। FILTER এ Row গুলো ফলাফলে থাকে, শুধু হিসাবে আসে না।
              খাতার মতো সব লাইন দেখাতে চাইলে, কিন্তু মোটে শুধু কিছু লাইন ধরতে চাইলে FILTER। আর যে Row গুলো ফলাফলেই চান না, সেগুলো
              WHERE এ বাদ দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  cancelled বাদে সব Booking এর জন্য চারটা Column: <code className={CODE}>customer_id</code>,{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>total_bdt</code>, আর{" "}
                  <code className={CODE}>running_spend</code>, মানে সেই Customer এর নিজের Booking গুলোর মধ্যে booked_at এর ক্রমে
                  এই Booking পর্যন্ত মোট খরচ। প্রতিটা Customer এর হিসাব আলাদা, শূন্য থেকে। ফলাফল customer_id, তারপর booked_at এর
                  ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>PARTITION BY customer_id ORDER BY booked_at</code>। ২১টা Row, Customer 1 এর তিনটা
                  Booking এ running_spend 25000.00, 44000.00, 80000.00।
                </>
              }
              solution={`SELECT customer_id,
       booking_id,
       total_bdt,
       sum(total_bdt) OVER (PARTITION BY customer_id
                            ORDER BY booked_at) AS running_spend
FROM bookings
WHERE status <> 'cancelled'
ORDER BY customer_id, booked_at;`}
              orderMatters
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Frame: কোনটা চলে, কোনটা চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Window Function এসেছে Version 8.0 তে, আর এই ট্র্যাকের MySQL 8.4 এ এই লেসনের বেশিরভাগ কাজ হুবহু চলে।
                চলমান যোগফল, চলমান গড়, ROWS আর RANGE, WINDOW Clause, সব একই। Default Frame এর নিয়মও একই, তাই সমান মানের ফাঁদটাও
                একই রকম পাতা আছে: টাকার ক্রমে সাজালে Booking 3 আর 22 সেখানেও দুটোই 35500.00 পায়। তবে চারটা জায়গায় পার্থক্য আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>INTERVAL এর লেখা:</strong> MySQL এ সংখ্যাটা উদ্ধৃতিচিহ্ন ছাড়া, আর একক এক বচনে:{" "}
                  <code className={CODE}>INTERVAL 7 DAY</code>, <code className={CODE}>INTERVAL 2 MONTH</code>। উত্তর
                  PostgreSQL এর সাথে হুবহু মেলে।
                </ListItem>
                <ListItem>
                  <strong>GROUPS নেই:</strong> লিখলে ERROR 1235, This version of MySQL doesn&apos;t yet support
                  &apos;GROUPS&apos;। সমান মানের দল গুনতে হলে আগে DENSE_RANK দিয়ে দলের নম্বর বানিয়ে তার উপর RANGE লিখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>EXCLUDE নেই:</strong> একই ERROR 1235, শেষে &apos;EXCLUDE&apos;। &ldquo;বাকিদের গড়&rdquo; এর জন্য
                  হাতে হিসাব: দলের মোট থেকে নিজের দাম বাদ, দলের সংখ্যা থেকে এক বাদ, তারপর ভাগ।
                </ListItem>
                <ListItem>
                  <strong>RANGE এর দূরত্বের নিয়ম একটা বার্তায়:</strong> ORDER BY তে দুটো Column বা text Column হলে ERROR 3587,
                  যেখানে বলা থাকে ORDER BY তে ঠিক একটা সংখ্যা বা সময়ের Expression লাগবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আরেকটা ছোট কথা: এই লেসনে Frame এর সদস্য দেখতে যে string_agg ব্যবহার করেছেন, MySQL এ তার জোড়া GROUP_CONCAT,
                কিন্তু সেটা Window Function হিসেবে চলে না, ERROR 1235 দেয়। MySQL এ Frame যাচাই করতে count(*) এর উপর ভরসা করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-frames.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql Load করা
SELECT booking_id, total_bdt,
       SUM(total_bdt) OVER (ORDER BY booked_at) AS running_bdt
FROM bookings WHERE status = 'confirmed' ORDER BY booked_at LIMIT 4;
-- 1 25000.00 25000.00 | 2 50000.00 75000.00 | 4 25500.00 100500.00 | 3 12500.00 113000.00

SELECT booking_id, total_bdt,
       SUM(total_bdt) OVER (ORDER BY total_bdt) AS default_frame
FROM bookings WHERE status = 'confirmed' ORDER BY total_bdt, booking_id LIMIT 4;
-- 21 10500.00 10500.00 | 3 12500.00 35500.00 | 22 12500.00 35500.00 | 10 14000.00 49500.00

SELECT booking_id, total_bdt,
       SUM(total_bdt) OVER (ORDER BY booked_at
         RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW) AS last_7_days_bdt
FROM bookings
WHERE status <> 'cancelled' AND booked_at >= '2026-09-01'
ORDER BY booked_at LIMIT 4;
-- 13 25000.00 | 15 50500.00 | 14 50000.00 | 16 86000.00   (PostgreSQL এর সাথে হুবহু এক)

SELECT booking_id, COUNT(*) OVER (ORDER BY total_bdt
  GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW) FROM bookings;
-- ERROR 1235 (42000): This version of MySQL doesn't yet support 'GROUPS'

SELECT booking_id, SUM(total_bdt) OVER (ORDER BY total_bdt
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING EXCLUDE CURRENT ROW) FROM bookings;
-- ERROR 1235 (42000): This version of MySQL doesn't yet support 'EXCLUDE'

SELECT booking_id, SUM(total_bdt) OVER (ORDER BY status
  RANGE BETWEEN 1 PRECEDING AND CURRENT ROW) FROM bookings;
-- ERROR 3587 (HY000): Window '<unnamed window>' with RANGE N PRECEDING/FOLLOWING frame
--   requires exactly one ORDER BY expression, of numeric or temporal type

-- EXCLUDE CURRENT ROW এর বদলে হাতে হিসাব
SELECT title, price_bdt,
       ROUND((SUM(price_bdt) OVER (PARTITION BY destination_id) - price_bdt)
             / NULLIF(COUNT(*) OVER (PARTITION BY destination_id) - 1, 0), 2) AS others_avg
FROM tours ORDER BY title;
-- 9 rows: Bandarban Hill Trek NULL | Cox's Bazar Beach Weekend 15500.00 | ... | Sylhet Tea Garden Tour 3500.00`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "NULLIF কেন",
          content: (
            <ContentParagraph>
              যে Destination এ একটাই ট্যুর, সেখানে দলের সংখ্যা থেকে এক বাদ দিলে শূন্য। শূন্য দিয়ে ভাগ করলে MySQL 8.4 এর SELECT
              NULL দেয়, সাথে Warning 1365 Division by 0, আর PostgreSQL সরাসরি ERROR: division by zero দেয়।{" "}
              <code className={CODE}>NULLIF(x, 0)</code> শূন্যকে আগেই NULL বানিয়ে দেয়, তাই দুই Database এই ভাগফল চুপচাপ NULL। এই
              হাতে হিসাবের উত্তর PostgreSQL এর EXCLUDE CURRENT ROW এর সাথে ৯টা Row তেই মেলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>ফারুক সাহেবের মৌসুমের Dashboard</SectionTitle>,
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
                মৌসুম প্রায় শেষ। ফারুক সাহেব মালিকের জন্য এক পাতার একটা Dashboard চান, যেটা দেখে তিনটা প্রশ্নের উত্তর মেলে: মাসে
                মাসে আয় কীভাবে জমেছে, কোন মাস কতটা ভার বহন করেছে, আর হাতে গোনা কয়েকটা বড় Booking ই কি আয়ের বেশিরভাগ এনেছে। তিনটা
                প্রশ্নেরই উত্তর এই লেসনের Frame দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম কাজ ঠিক জায়গায় দলে ভাগ করা। Section 6 এর শিক্ষা মনে রেখে তানিম আগে একটা CTE তে মাস প্রতি একটা Row বানালেন,
                তারপর সেই মাসগুলোর উপরে চলমান যোগফল। প্রতিটা মাস একটাই Row, তাই ORDER BY month_start Unique, কোনো Peer নেই,
                সিঁড়ির প্রশ্নই আসে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসে মাসে জমে ওঠা আয়"
              query={`WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month_start,
         count(*)       AS bookings,
         sum(total_bdt) AS revenue_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month_start, 'YYYY-MM') AS month,
       bookings,
       revenue_bdt,
       sum(bookings)    OVER (ORDER BY month_start) AS running_bookings,
       sum(revenue_bdt) OVER (ORDER BY month_start) AS running_bdt
FROM monthly
ORDER BY month_start;`}
              caption="৬টা Row। running_bdt হলো 75000.00, 167000.00, 186000.00, 243600.00, 294100.00, 423600.00, ঠিক Section 6 এর সিঁড়ির ধাপগুলো, তবে এবার প্রতিটা মাস একটা Row, তাই এটাই সঠিক উত্তর। running_bookings 2 থেকে 17।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় প্রশ্নটা ব্যবসার একটা পুরনো পর্যবেক্ষণ নিয়ে, যাকে Pareto নীতি বলে: অনেক সময় অল্প কয়েকটা বড় কাজ থেকেই আসে
                বেশিরভাগ ফল। Island Tours এ কয়টা বড় Booking মিলে মৌসুমের অর্ধেক আয়? এর জন্য Booking গুলোকে বড় থেকে ছোট সাজিয়ে চলমান
                যোগফল, আর সেটাকে পুরো মোট দিয়ে ভাগ। একই Query তে দুটো Window: চলমান যোগফলের জন্য ORDER BY সহ, পুরো মোটের জন্য ORDER BY
                ছাড়া। আর সমান টাকার Booking আছে বলে ORDER BY তে booking_id।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় Booking গুলো কতটা ভার বহন করে"
              query={`SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY total_bdt DESC, booking_id) AS running_bdt,
       round(100 * sum(total_bdt) OVER (ORDER BY total_bdt DESC, booking_id)
                 / sum(total_bdt) OVER (), 1) AS running_pct
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt DESC, booking_id;`}
              caption="১৭টা Row। running_pct শুরু হয় 11.8, 21.8, 30.3, 38.8, 45.4 দিয়ে, ষষ্ঠ Row এ 52.1। মানে ১৭টার মধ্যে সবচেয়ে বড় ৬টা Booking মিলেই মৌসুমের অর্ধেকের বেশি আয়। শেষ Row এ 100.0।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Dashboard এর মূল টেবিলটা আপনার হাতে। এতে আসবে এই লেসনের প্রায় সবকিছু: CTE তে মাসের দল, ORDER BY সহ চলমান
              যোগফল, ORDER BY ছাড়া পুরো মোটের ভাগ, আর ক্যালেন্ডার ধরে RANGE INTERVAL এর গড়, যাতে September এর গড়ে February ঢুকে না
              পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge: মৌসুমের Dashboard"
              task={
                <>
                  মাস প্রতি confirmed আয়ের একটা টেবিল, পাঁচটা Column: <code className={CODE}>month</code> (YYYY-MM লেখায়),{" "}
                  <code className={CODE}>revenue_bdt</code> (সেই মাসের confirmed আয়), <code className={CODE}>running_bdt</code>{" "}
                  (মৌসুমের শুরু থেকে এই মাস পর্যন্ত), <code className={CODE}>share_pct</code> (পুরো মৌসুমের আয়ের কত শতাংশ এই মাসে,
                  এক দশমিক পর্যন্ত round), আর <code className={CODE}>avg_3_months</code> (ক্যালেন্ডারে এই মাস আর আগের দুই মাসের
                  মধ্যে যে মাসগুলোতে আয় আছে তাদের গড়, দুই দশমিক পর্যন্ত round)। মাস গুনবেন ঢাকার সময়ে, পুরনো মাস আগে।
                </>
              }
              hint={
                <>
                  WITH monthly AS (date_trunc(&apos;month&apos;, booked_at)::date আর sum দিয়ে GROUP BY), তারপর মূল Query তে
                  তিনটা Window: <code className={CODE}>OVER (ORDER BY month_start)</code>, <code className={CODE}>OVER ()</code>,
                  আর <code className={CODE}>RANGE BETWEEN INTERVAL &apos;2 months&apos; PRECEDING AND CURRENT ROW</code>। ৬টা
                  Row, 2026-09 এর avg_3_months হবে 50500.00।
                </>
              }
              starter={`WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month_start,
         sum(total_bdt) AS revenue_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month_start, 'YYYY-MM') AS month,
       revenue_bdt
FROM monthly
ORDER BY month_start;`}
              solution={SEASON_DASHBOARD}
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
      title: <SectionTitle>একটা Frame Query লেখার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নের শব্দে Frame খুঁজুন",
              description:
                "এখন পর্যন্ত, শেষ তিনটা, গত সাত দিন, বাকিদের তুলনায়: এই শব্দগুলো শুনলেই বুঝবেন একটা Frame লাগবে। মোটের কত ভাগ শুনলে উল্টো, Frame হবে পুরো Partition, ORDER BY ছাড়া।",
            },
            {
              title: "দল ঠিক করুন",
              description:
                "প্রতিটা Customer, প্রতিটা মাস, নাকি পুরো মৌসুম একটা দল? দল থাকলে PARTITION BY, আর মনে রাখুন Frame কখনো দলের সীমা পার হয় না।",
            },
            {
              title: "ক্রম ঠিক করুন, আর দেখুন সেটা Unique কিনা",
              description:
                "ORDER BY এর Column এ সমান মান থাকতে পারলে শেষে Primary Key যোগ করুন। এই এক অভ্যাস Default Frame এর সিঁড়ি আর ROWS এর অনিশ্চিত ক্রম, দুটো থেকেই বাঁচায়।",
            },
            {
              title: "একক বাছুন",
              description:
                "Row গুনলে ROWS। মানের দূরত্ব, যেমন সাত দিন বা 1000 টাকা, হলে RANGE, সাথে ঠিক একটা ORDER BY Column। সমান মানের দল গুনলে GROUPS, MySQL এ যেটা নেই।",
            },
            {
              title: "শুরু আর শেষ পুরো করে লিখুন",
              description:
                "Default এর উপর ভরসা না করে ROWS BETWEEN ... AND ... পুরোটা লিখুন। যিনি পরে পড়বেন, তাঁকে Default এর নিয়ম মনে করতে হবে না। বাদ দিতে হলে শেষে EXCLUDE।",
            },
            {
              title: "count(*) দিয়ে Frame যাচাই",
              description:
                "আসল Function এর পাশে একই Frame এ count(*) বসান, PostgreSQL এ দরকার হলে string_agg ও। প্রথম আর শেষ কয়েকটা Row এ Frame এর আকার আন্দাজের সাথে মেলে কিনা দেখুন।",
            },
            {
              title: "বাইরের ORDER BY আলাদা করে দিন",
              description:
                "OVER এর ভেতরের ORDER BY শুধু Frame এর জন্য, ফলাফল কোন ক্রমে দেখাবে সেটা ঠিক করে না। ফলাফলের ক্রম চাইলে Query এর শেষে আলাদা ORDER BY লিখুন।",
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
            [
              "মোটের ভাগে OVER (ORDER BY ...)",
              "প্রথম Row এ 100.0, প্রতিটা Row আলাদা হর দিয়ে ভাগ",
              "হরে OVER (), অথবা দলের জন্য OVER (PARTITION BY ...)",
            ],
            [
              "সমান মান থাকা Column এ ORDER BY, কোনো Frame না লিখে",
              "Peer রা একই চলমান মোট পায়, সিঁড়ি",
              "ORDER BY তে Primary Key যোগ করুন",
            ],
            [
              "ROWS লিখে ভাবা Peer এর সমস্যা শেষ",
              "সমান মানের Row কোন ক্রমে যোগ হবে তা অনিশ্চিত",
              "ROWS এর সাথেও Unique ORDER BY",
            ],
            [
              "মাস হারিয়ে যাওয়া Data তে ROWS 2 PRECEDING কে শেষ তিন মাস ভাবা",
              "ফাঁক ডিঙিয়ে পুরনো মাস Frame এ ঢোকে",
              "RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW",
            ],
            [
              "সময়ের Column এ RANGE 7 PRECEDING",
              "ERROR: ... timestamp with time zone and offset type integer",
              "INTERVAL '7 days' PRECEDING",
            ],
            [
              "RANGE এর দূরত্বের সাথে দুটো ORDER BY Column",
              "ERROR: ... requires exactly one ORDER BY column",
              "একটা Column, অথবা ROWS",
            ],
            [
              "OVER (EXCLUDE CURRENT ROW), Frame ছাড়া",
              "Syntax Error",
              "আগে পুরো Frame, তারপর EXCLUDE",
            ],
            [
              "শেষ তিনটার গড়ে প্রথম দুই Row কে পুরো গড় ভাবা",
              "এক আর দুই Row এর গড় Chart এ বাকিদের মতোই দেখায়",
              "count(*) = 3 না হলে CASE দিয়ে NULL",
            ],
            [
              "ROW_NUMBER বা LAG এর জন্য Frame লেখা",
              "Frame চুপচাপ উপেক্ষা হয়, ফল বদলায় না",
              "Frame শুধু Aggregate আর first_value, last_value, nth_value এর জন্য",
            ],
            [
              "MySQL এ GROUPS বা EXCLUDE",
              "ERROR 1235, doesn't yet support",
              "DENSE_RANK এর উপর RANGE, অথবা মোট থেকে নিজেকে বিয়োগ",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল ধরার অনুশীলন"
              query={`SELECT booking_id,
       total_bdt,
       round(avg(total_bdt) OVER (ORDER BY booked_at
             RANGE BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_last_3
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;`}
              caption="তানিম শেষ তিনটা Booking এর গড় চেয়েছিলেন, কিন্তু Error এল: RANGE with offset PRECEDING/FOLLOWING is not supported for column type timestamp with time zone and offset type integer। শেষ তিনটা মানে Row গোনা, তাই একটা শব্দ বদলান: RANGE এর জায়গায় ROWS। ঠিক হলে ১৭টা Row, চতুর্থ Row এ 29333.33।"
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
                    href="https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Function Calls
                  </a>
                  : Frame এর পুরো Syntax, Default Frame এর নিয়ম, ROWS, RANGE আর GROUPS এ CURRENT ROW আর দূরত্বের মানে, আর চারটা
                  EXCLUDE এর আনুষ্ঠানিক ব্যাখ্যা। এই লেসনের নিয়মগুলো এখান থেকে মেলানো।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/tutorial-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Window Functions
                  </a>
                  : ছোট উদাহরণ দিয়ে Window Frame এর ধারণা, বিশেষ করে ORDER BY যোগ করলে sum কেন চলমান হয়ে যায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Functions
                  </a>
                  : কোন Function Frame মানে আর কোনটা মানে না, তার তালিকা। পরের লেসনের first_value আর last_value ও এখানে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/11.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 11 Release Notes
                  </a>
                  : যেখানে লেখা আছে RANGE এর দূরত্ব, GROUPS আর EXCLUDE কবে এল। পুরনো কোনো Server এ এগুলো না চললে আগে Version
                  দেখুন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-functions-frames.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Function Frame Specification
                  </a>
                  : MySQL এ ROWS আর RANGE এর নিয়ম, INTERVAL এর লেখা, আর Default Frame। GROUPS আর EXCLUDE এর অনুপস্থিতি এই
                  লেসনের Container এ যাচাই করা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে Window Function এর যে উদাহরণগুলো আছে, সেগুলোতে Frame না লেখা থাকলে Default Frame
                  কোনটা, আর সমান মান থাকলে উত্তর বদলাবে কিনা, এই লেসনের চোখ দিয়ে আবার যাচাই করে দেখুন।
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
                  Frame হলো Partition এর ভেতরে প্রতিটা Row এর নিজের টুকরো। sum, avg, count, min, max আর first_value, last_value,
                  nth_value শুধু Frame দেখে। ROW_NUMBER, RANK, LAG, LEAD Frame উপেক্ষা করে।
                </ListItem>
                <ListItem>
                  চলমান যোগফল: <code className={CODE}>sum(x) OVER (ORDER BY t)</code>। একই Frame এ count, avg, max দিয়ে চলমান
                  গণনা, গড় আর সর্বোচ্চ। একাধিক Column এ একই Frame হলে WINDOW Clause।
                </ListItem>
                <ListItem>
                  Default Frame: ORDER BY না থাকলে পুরো Partition, থাকলে RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW। মোটের
                  ভাগ চাইলে হরে OVER ()।
                </ListItem>
                <ListItem>
                  RANGE এ CURRENT ROW মানে এই Row আর তার সব Peer। সমান মান থাকলে চলমান যোগফল সিঁড়ির মতো লাফ দেয়। ওষুধ: ORDER BY
                  তে Unique Column, যেমন booking_id।
                </ListItem>
                <ListItem>
                  ROWS গোনে Row, RANGE মাপে মানের দূরত্ব, GROUPS গোনে Peer দল। পরপর পূর্ণসংখ্যায় RANGE আর GROUPS এক।
                </ListItem>
                <ListItem>
                  চলমান গড়: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW। প্রথম দুই Row এ Frame ছোট, দরকার হলে count(*) দিয়ে CASE।
                </ListItem>
                <ListItem>
                  ক্যালেন্ডারের হিসাবে RANGE আর INTERVAL: শেষ তিন মাস, গত সাত দিন। মাস হারিয়ে গেলে ROWS ভুল মাস টেনে আনে। RANGE এর
                  দূরত্বে ORDER BY তে ঠিক একটা সংখ্যা বা সময়ের Column।
                </ListItem>
                <ListItem>
                  EXCLUDE CURRENT ROW, GROUP, TIES, NO OTHERS: Frame লেখার পরে বসে। বাকিদের গড়ের জন্য সবচেয়ে কাজের CURRENT ROW।
                </ListItem>
                <ListItem>
                  PARTITION BY এর সাথে চলমান যোগফল প্রতিটা দলে নতুন করে শুরু। FILTER দিয়ে Row না সরিয়েও শুধু কিছু Row যোগ।
                </ListItem>
                <ListItem>
                  MySQL 8.4 এ ROWS, RANGE আর INTERVAL চলে, GROUPS আর EXCLUDE এ ERROR 1235।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা Function একটা Frame থেকে একটা মান বানিয়েছে: যোগ, গড়, গণনা। কিন্তু অনেক প্রশ্নে পুরো Frame লাগে
                না, লাগে ঠিক আগের বা পরের একটা Row: আগের Booking থেকে কত দিন পরে এই Booking, গত মাসের চেয়ে এই মাসে আয় কত বাড়ল।
                তার জন্য LAG আর LEAD। আর সেখানে last_value নামের একটা Function আছে, যেটা প্রথমবার দেখলে ভাঙা মনে হয়, অথচ তার পেছনে
                ঠিক এই লেসনের Default Frame। সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/lag-lead" className={LINK}>
                  LAG, LEAD, FIRST_VALUE and NTILE
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
      ["Frame", "Partition এর ভেতরে প্রতিটা Row এর হিসাবের টুকরো", "Booking 6 এর শেষ তিনটা: 74000.00"],
      ["চলমান যোগফল", "sum(x) OVER (ORDER BY t)", "17টা confirmed, শেষে 423600.00"],
      ["চলমান গণনা ও গড়", "একই Frame এ count আর avg", "শেষ Row: 17টা, গড় 24917.65"],
      ["Default Frame, ORDER BY ছাড়া", "পুরো Partition", "সবার whole_total 423600.00"],
      ["Default Frame, ORDER BY সহ", "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", "প্রথম Row এর wrong_pct 100.0"],
      ["Peer আর সিঁড়ি", "RANGE এ CURRENT ROW মানে শেষ Peer পর্যন্ত", "January এর চারটা Row 167000.00"],
      ["Unique ORDER BY", "Primary Key যোগ করে Peer দূর", "Booking 3: 23000.00, Booking 22: 35500.00"],
      ["ROWS, RANGE, GROUPS", "Row, মানের দূরত্ব, Peer দল", "Booking 10 এ 2, 1 আর 3"],
      ["চলমান গড়", "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW", "চতুর্থ Row 29333.33"],
      ["RANGE INTERVAL", "ক্যালেন্ডার ধরে Frame", "September: 42366.67 বনাম 50500.00"],
      ["গত সাত দিন", "RANGE BETWEEN INTERVAL '7 days' PRECEDING", "8 October এ 4টা, 150000.00"],
      ["EXCLUDE", "Frame থেকে নিজে, দল বা Peer বাদ", "Luxury Stay এর others_avg 11162.50"],
      ["দলের ভেতরে চলমান", "PARTITION BY সহ, প্রতি দলে নতুন শুরু", "February তে আবার 19000.00 থেকে"],
      ["MySQL", "ROWS, RANGE, INTERVAL চলে, GROUPS আর EXCLUDE না", "ERROR 1235"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "sum(total_bdt) OVER (ORDER BY booked_at) এ কোনো Frame লেখা নেই। PostgreSQL কোন Frame ধরে নেয়?",
        options: [
          {
            key: "A",
            text: "পুরো Partition, শুরু থেকে শেষ",
            isCorrect: false,
            explanation:
              "এটা হয় যখন OVER এ ORDER BY থাকে না, যেমন OVER ()। ORDER BY লিখলেই Default বদলে যায়।",
          },
          {
            key: "B",
            text: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
            isCorrect: false,
            explanation:
              "কাছাকাছি, কিন্তু একক ভুল। Default টা RANGE, আর সেই পার্থক্যই সমান মান থাকলে সিঁড়ি বানায়।",
          },
          {
            key: "C",
            text: "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
            isCorrect: true,
            explanation:
              "ঠিক। শুরু থেকে এই Row পর্যন্ত, সাথে এই Row এর সব Peer। booked_at এ সমান মান নেই বলে এখানে সেটা চলমান যোগফলের মতোই দেখায়।",
          },
          {
            key: "D",
            text: "শুধু Current Row",
            isCorrect: false,
            explanation:
              "তাহলে প্রতিটা Row এ শুধু নিজের টাকা আসত। লেসনের Box এ দ্বিতীয় Row 75000.00 পায়, মানে আগের Row ও Frame এ আছে।",
          },
        ],
      },
      {
        id: 2,
        text: "round(100 * total_bdt / sum(total_bdt) OVER (ORDER BY booked_at), 1) এ প্রথম Row এর মান 100.0 কেন?",
        options: [
          {
            key: "A",
            text: "প্রথম Booking সত্যিই মৌসুমের সবচেয়ে বড় Booking",
            isCorrect: false,
            explanation: "না, প্রথম Booking 25000 টাকার, সবচেয়ে বড়টা 50000। সমস্যা হরে।",
          },
          {
            key: "B",
            text: "প্রথম Row এর Frame এ শুধু নিজে, তাই নিজেকে নিজে দিয়ে ভাগ",
            isCorrect: true,
            explanation:
              "ঠিক। ORDER BY থাকায় Frame চলমান, প্রথম Row এ হর শুধু নিজের টাকা। মোটের ভাগ চাইলে হরে OVER ()।",
          },
          {
            key: "C",
            text: "round এর কারণে",
            isCorrect: false,
            explanation: "round শুধু দশমিক ছাঁটে, 5.9 কে 100.0 বানাতে পারে না।",
          },
          {
            key: "D",
            text: "WHERE এ শুধু confirmed রাখার কারণে",
            isCorrect: false,
            explanation: "WHERE ঠিকই আছে। OVER () দিলে একই WHERE এ প্রথম Row এর ভাগ 5.9।",
          },
        ],
      },
      {
        id: 3,
        text: "ORDER BY date_trunc('month', booked_at) দিয়ে চলমান যোগফলে January এর চারটা Booking সবাই 167000.00 পায়। কারণ কী?",
        options: [
          {
            key: "A",
            text: "date_trunc টাকার মান বদলে দেয়",
            isCorrect: false,
            explanation: "date_trunc শুধু সময়কে মাসের শুরুতে নামায়, টাকা ছোঁয় না।",
          },
          {
            key: "B",
            text: "চারটা Booking একই মাসের বলে ORDER BY এর চোখে Peer, আর Default RANGE Frame এ CURRENT ROW মানে শেষ Peer পর্যন্ত",
            isCorrect: true,
            explanation:
              "ঠিক। চারজনের Frame এর শেষ January এর শেষ Booking এ, তাই চারজনের মোটও এক। সমাধান: Unique ORDER BY, অথবা আগে মাসে GROUP BY।",
          },
          {
            key: "C",
            text: "PostgreSQL এর একটা Bug",
            isCorrect: false,
            explanation: "এটা SQL Standard এর নিয়ম, MySQL ও একই উত্তর দেয়।",
          },
          {
            key: "D",
            text: "January তে Booking গুলো একই সেকেন্ডে হয়েছিল",
            isCorrect: false,
            explanation: "না, চারটার booked_at আলাদা। একই হয়েছে শুধু date_trunc এর ফল।",
          },
        ],
      },
      {
        id: 4,
        text: "টাকার ক্রমে Booking 10 (14000.00) এর জন্য ROWS, RANGE আর GROUPS এ যথাক্রমে 1 PRECEDING, 1000 PRECEDING আর 1 PRECEDING থেকে CURRENT ROW পর্যন্ত count(*) কত?",
        options: [
          {
            key: "A",
            text: "2, 2, 2",
            isCorrect: false,
            explanation: "RANGE 1000 এ 13000 থেকে 14000 এর মধ্যে আর কেউ নেই, তাই সেখানে 2 হতে পারে না।",
          },
          {
            key: "B",
            text: "2, 1, 2",
            isCorrect: false,
            explanation: "GROUPS আগের পুরো দল নেয়, আর আগের দল 12500 এর দুজন। তাই 2 না।",
          },
          {
            key: "C",
            text: "1, 1, 3",
            isCorrect: false,
            explanation: "ROWS 1 PRECEDING মানে আগের একটা Row আর নিজে, তাই 2।",
          },
          {
            key: "D",
            text: "2, 1, 3",
            isCorrect: true,
            explanation:
              "ঠিক। ROWS: আগের Row আর নিজে। RANGE: 1000 টাকার মধ্যে শুধু নিজে। GROUPS: আগের দল 12500 এর দুজন আর নিজে।",
          },
        ],
      },
      {
        id: 5,
        text: "মাস প্রতি আয়ের Row থেকে শেষ তিন মাসের গড়। April থেকে August এ কোনো Row নেই। কোন Frame এ September এর গড়ে February ঢুকবে না?",
        options: [
          {
            key: "A",
            text: "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW",
            isCorrect: false,
            explanation: "ROWS শুধু Row গোনে, তাই September এর আগের দুটো Row, March আর February, ঢুকে পড়ে: 42366.67।",
          },
          {
            key: "B",
            text: "RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW",
            isCorrect: true,
            explanation:
              "ঠিক। RANGE ক্যালেন্ডার মাপে, July থেকে September। সেখানে শুধু September, গড় 50500.00।",
          },
          {
            key: "C",
            text: "GROUPS BETWEEN 2 PRECEDING AND CURRENT ROW",
            isCorrect: false,
            explanation: "প্রতিটা মাস নিজেই একটা দল, তাই GROUPS এখানে ROWS এর মতোই আগের দুটো মাস টেনে আনে।",
          },
          {
            key: "D",
            text: "Frame না লিখে শুধু ORDER BY month_start",
            isCorrect: false,
            explanation: "তাহলে Default Frame, শুরু থেকে এই মাস পর্যন্ত, শেষ তিন মাস না।",
          },
        ],
      },
      {
        id: 6,
        text: "EXCLUDE TIES কী বাদ দেয়?",
        options: [
          {
            key: "A",
            text: "শুধু Current Row",
            isCorrect: false,
            explanation: "সেটা EXCLUDE CURRENT ROW।",
          },
          {
            key: "B",
            text: "Current Row আর তার সব Peer",
            isCorrect: false,
            explanation: "সেটা EXCLUDE GROUP।",
          },
          {
            key: "C",
            text: "Current Row এর Peer রা, কিন্তু Current Row নিজে থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের Box এ Booking 1 এর ex_ties এ 13 নেই, কারণ সে 25000 এর Peer, কিন্তু 1 নিজে আছে।",
          },
          {
            key: "D",
            text: "কিছুই না",
            isCorrect: false,
            explanation: "সেটা EXCLUDE NO OTHERS, যেটা না লিখলেও Default।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW লিখলে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতোই চলে",
            isCorrect: false,
            explanation: "MySQL এ GROUPS একক নেই, তাই চলার প্রশ্নই আসে না।",
          },
          {
            key: "B",
            text: "চুপচাপ ROWS হিসেবে চলে",
            isCorrect: false,
            explanation: "MySQL উপেক্ষা করে না, স্পষ্ট Error দেয়।",
          },
          {
            key: "C",
            text: "ERROR 3587, ORDER BY এর Column নিয়ে",
            isCorrect: false,
            explanation: "3587 আসে RANGE এর দূরত্বে ভুল ধরনের বা একাধিক ORDER BY Column থাকলে।",
          },
          {
            key: "D",
            text: "ERROR 1235, This version of MySQL doesn't yet support 'GROUPS'",
            isCorrect: true,
            explanation:
              "ঠিক। EXCLUDE এর জন্যও একই 1235। দলের হিসাব চাইলে DENSE_RANK দিয়ে দলের নম্বর বানিয়ে তার উপর RANGE।",
          },
        ],
      },
      {
        id: 8,
        text: "row_number() OVER (ORDER BY booked_at ROWS BETWEEN CURRENT ROW AND CURRENT ROW) কী দেয়?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Row এ 1, কারণ Frame এ শুধু নিজে",
            isCorrect: false,
            explanation: "count(*) এই Frame এ 1 দেয়। কিন্তু ROW_NUMBER Frame দেখে না।",
          },
          {
            key: "B",
            text: "Error, ROW_NUMBER এর সাথে Frame লেখা যায় না",
            isCorrect: false,
            explanation: "PostgreSQL Error দেয় না, Frame টা শুধু উপেক্ষা করে।",
          },
          {
            key: "C",
            text: "1 থেকে 17, যেন Frame লেখাই হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। ROW_NUMBER, RANK, LAG, LEAD পুরো Partition আর তার ক্রম দেখে। Frame শুধু Aggregate আর first_value, last_value, nth_value এর জন্য।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "ROW_NUMBER কখনো NULL দেয় না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: একটা মৌসুম, চারটা চলমান চোখ",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Payment এর খাতা:</strong> payments Table থেকে শুধু paid Payment, paid_at এর ক্রমে। প্রতিটা Row এর পাশে চলমান
        যোগফল আর চলমান গণনা। ORDER BY তে payment_id যোগ করে Unique রাখুন, আর শেষ Row এর মোট একটা সাধারণ sum এর সাথে মিলিয়ে দেখান।
      </span>,
      <span key="2">
        <strong>সিঁড়ি খুঁজে বের করুন:</strong> payments এ method ধরে ORDER BY দিয়ে একটা চলমান যোগফল লিখুন, Frame ছাড়া। কোন Row গুলো
        একই মোট পাচ্ছে আর কেন, দুই লাইনে লিখুন। তারপর ঠিক করা Query দিন।
      </span>,
      <span key="3">
        <strong>তিনটা এককের তুলনা:</strong> tours Table এ price_bdt এর ক্রমে ROWS 1 PRECEDING, RANGE 1000 PRECEDING আর GROUPS 1
        PRECEDING দিয়ে count(*) বের করুন। কোন ট্যুরে তিনটা উত্তর আলাদা, তার একটা উদাহরণ ব্যাখ্যা করুন।
      </span>,
      <span key="4">
        <strong>গত ত্রিশ দিনের Review:</strong> reviews Table এ created_at এর ক্রমে প্রতিটা Review এর পাশে গত ৩০ দিনের গড় rating
        আর সেই সময়ে কয়টা Review, RANGE আর INTERVAL দিয়ে। একই কাজ ROWS BETWEEN 2 PRECEDING দিয়ে করে দেখান কোথায় উত্তর আলাদা।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> ফারুক সাহেবের তিন লাইনের ফোকর কাটা কার্ডের উদাহরণ দিয়ে একজন বন্ধুকে বোঝান Frame কী,
        ORDER BY লিখলেই কেন চলমান যোগফল আসে, আর সমান মান থাকলে কেন সেটা সিঁড়ির মতো লাফ দেয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">Payment এর চলমান খাতার Query, ফলাফল আর মিলিয়ে দেখার প্রমাণ</span>,
      <span key="d2">সিঁড়িওয়ালা আর ঠিক করা দুটো Query, সাথে দুই লাইনের ব্যাখ্যা</span>,
      <span key="d3">তিন এককের Query, ফলাফল আর একটা ট্যুরের ব্যাখ্যা</span>,
      <span key="d4">Review এর RANGE আর ROWS দুই সংস্করণ, পার্থক্যের এক অনুচ্ছেদ</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Frame",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "চলমান যোগফল",
        description:
          "প্রথম ফাইলের শুরুতে SET TIME ZONE লাইনটা রাখুন, যাতে তারিখ আর মাস ঢাকার সময়ে গোনা হয়। ১৭টা Row, শেষ Row এ 17 আর 423600.00, আর নিচের যাচাইয়ের Query তেও 423600.00।",
      },
      {
        title: "Default Frame আর শতাংশ",
        description:
          "দ্বিতীয় ফাইলে whole_total সবার জন্য এক, running_total চলমান। শতাংশের Query তে প্রথম Row এর wrong_pct 100.0, right_pct 5.9।",
      },
      {
        title: "সিঁড়ি দেখা আর সারানো",
        description:
          "তৃতীয় ফাইলের প্রথম Query তে January এর চারটা Row 167000.00। দ্বিতীয়টায় Booking 3 আর 22 এর default_frame দুটোই 35500.00, unique_order আলাদা।",
      },
      {
        title: "তিনটা একক",
        description:
          "চতুর্থ ফাইলের প্রথম Query তে Booking 10 এর Row খুঁজুন: 2, 1, 3। দ্বিতীয় Query তে Seat এর হিসাবে দুটো Column হুবহু এক।",
      },
      {
        title: "চলমান গড় আর ক্যালেন্ডার",
        description:
          "পঞ্চম ফাইলের তিনটা Query। চলমান গড়ের চতুর্থ Row 29333.33, মাসের Query তে 2026-09 এ 42366.67 বনাম 50500.00, সাত দিনের Query তে ১১টা Row।",
      },
      {
        title: "EXCLUDE আর দলের ভেতরে চলমান",
        description:
          "ষষ্ঠ ফাইলের তিনটা Query। বাকিদের গড়ে ৯টা Row, মাসের শুরু থেকে যোগফলে February আবার 19000.00 থেকে, আর Customer প্রতি চলমান খরচে ২১টা Row।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-running-total.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT booking_id,
       booked_at::date AS booked_on,
       total_bdt,
       count(*)       OVER w AS running_count,
       sum(total_bdt) OVER w AS running_bdt
FROM bookings
WHERE status = 'confirmed'
WINDOW w AS (ORDER BY booked_at)
ORDER BY booked_at;
-- (17 rows)
-- প্রথম Row: 1 | 2025-12-20 | 25000.00 | 1 | 25000.00
-- শেষ Row:  23 | 2026-10-13 | 42500.00 | 17 | 423600.00

SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed';
-- 423600.00`,
      },
      {
        language: "sql",
        filename: "02-default-frame.sql",
        code: `SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER ()                   AS whole_total,
       sum(total_bdt) OVER (ORDER BY booked_at) AS running_total
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;
-- (17 rows), whole_total সবার 423600.00
-- running_total: 25000.00, 75000.00, 100500.00, ... 423600.00

SELECT booking_id,
       round(100 * total_bdt / sum(total_bdt) OVER (ORDER BY booked_at), 1) AS wrong_pct,
       round(100 * total_bdt / sum(total_bdt) OVER (), 1)                  AS right_pct
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at
LIMIT 4;
-- 1 | 100.0 | 5.9
-- 2 |  66.7 | 11.8
-- 4 |  25.4 | 6.0
-- 3 |  11.1 | 3.0`,
      },
      {
        language: "sql",
        filename: "03-ties.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT booking_id,
       to_char(booked_at, 'YYYY-MM') AS month,
       sum(total_bdt) OVER (ORDER BY date_trunc('month', booked_at)) AS by_month,
       sum(total_bdt) OVER (ORDER BY booked_at)                      AS by_time
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;
-- (17 rows)
-- by_month: 2025-12 এর দুটো 75000.00, 2026-01 এর চারটা 167000.00,
--           2026-03 এর তিনটা 243600.00, 2026-10 এর পাঁচটা 423600.00

SELECT booking_id,
       total_bdt,
       sum(total_bdt) OVER (ORDER BY total_bdt)             AS default_frame,
       sum(total_bdt) OVER (ORDER BY total_bdt, booking_id) AS unique_order
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id
LIMIT 4;
-- 21 | 10500.00 | 10500.00 | 10500.00
--  3 | 12500.00 | 35500.00 | 23000.00
-- 22 | 12500.00 | 35500.00 | 35500.00
-- 10 | 14000.00 | 49500.00 | 49500.00`,
      },
      {
        language: "sql",
        filename: "04-units.sql",
        code: `SELECT booking_id,
       total_bdt,
       count(*) OVER (ORDER BY total_bdt ROWS   BETWEEN 1    PRECEDING AND CURRENT ROW) AS rows_1,
       count(*) OVER (ORDER BY total_bdt RANGE  BETWEEN 1000 PRECEDING AND CURRENT ROW) AS range_1000,
       count(*) OVER (ORDER BY total_bdt GROUPS BETWEEN 1    PRECEDING AND CURRENT ROW) AS groups_1
FROM bookings
WHERE status = 'confirmed'
ORDER BY total_bdt, booking_id;
-- (17 rows)
-- range_1000: 1, 2, 2, 1, 1, 1, 2, 2, 2, 4, 4, 2, 2, 2, 2, 1, 1
-- groups_1:   1, 3, 3, 3, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 2
-- Booking 10 (14000.00): 2 | 1 | 3

SELECT DISTINCT seats,
       count(*) OVER (ORDER BY seats RANGE  BETWEEN 1 PRECEDING AND CURRENT ROW) AS range_1,
       count(*) OVER (ORDER BY seats GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW) AS groups_1
FROM bookings
ORDER BY seats;
-- (5 rows): 1 5 5 | 2 18 18 | 3 16 16 | 4 5 5 | 5 3 3`,
      },
      {
        language: "sql",
        filename: "05-moving-and-calendar.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT booking_id,
       round(avg(total_bdt) OVER (ORDER BY booked_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_last_3
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;
-- (17 rows): 25000.00, 37500.00, 33500.00, 29333.33, 24666.67, ...

WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS month_start,
         sum(total_bdt) AS revenue_bdt
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
)
SELECT to_char(month_start, 'YYYY-MM') AS month,
       revenue_bdt,
       round(avg(revenue_bdt) OVER (ORDER BY month_start
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_rows,
       round(avg(revenue_bdt) OVER (ORDER BY month_start
             RANGE BETWEEN INTERVAL '2 months' PRECEDING AND CURRENT ROW), 2) AS avg_3_months
FROM monthly
ORDER BY month_start;
-- (6 rows)
-- 2026-09 |  50500.00 | 42366.67 | 50500.00
-- 2026-10 | 129500.00 | 79200.00 | 90000.00

SELECT booking_id,
       sum(total_bdt) OVER last_week AS last_7_days_bdt,
       count(*)       OVER last_week AS last_7_days_n
FROM bookings
WHERE status <> 'cancelled'
  AND booked_at >= DATE '2026-09-01'
WINDOW last_week AS (ORDER BY booked_at
                     RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW)
ORDER BY booked_at;
-- (11 rows)
-- last_7_days_n: 1, 2, 1, 2, 3, 4, 3, 3, 4, 5, 6
-- শেষ Row: 24 | 132700.00 | 6`,
      },
      {
        language: "sql",
        filename: "06-exclude-and-groups.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT title,
       price_bdt,
       round(avg(price_bdt) OVER (PARTITION BY destination_id
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
             EXCLUDE CURRENT ROW), 2) AS others_avg
FROM tours
ORDER BY title;
-- (9 rows)
-- Bandarban Hill Trek, Sajek Valley Cloud Trip, Sundarbans Mangrove Cruise: NULL
-- Saint Martin Luxury Stay 32000.00 | 12500.00

SELECT to_char(booked_at, 'YYYY-MM') AS month,
       booking_id,
       sum(total_bdt) OVER (PARTITION BY date_trunc('month', booked_at)
                            ORDER BY booked_at) AS month_to_date
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at;
-- (17 rows)
-- 2026-01: 25500.00, 38000.00, 74000.00, 92000.00 | 2026-02: 19000.00

SELECT customer_id,
       booking_id,
       sum(total_bdt) OVER (PARTITION BY customer_id ORDER BY booked_at) AS running_spend
FROM bookings
WHERE status <> 'cancelled'
ORDER BY customer_id, booked_at;
-- (21 rows)
-- Customer 1: 25000.00, 44000.00, 80000.00 | Customer 2: 50000.00, 75000.00`,
      },
    ],
    tip: (
      <ContentParagraph>
        কোনো Frame এর উত্তর অবাক করলে psql এ একই Frame এ <code className={CODE}>count(*)</code> আর{" "}
        <code className={CODE}>string_agg(booking_id::text, &apos;,&apos;)</code> যোগ করে আবার চালান। প্রথমটা বলে Frame এ কয়টা
        Row, দ্বিতীয়টা বলে কারা। লম্বা Query গুলো একটা .sql ফাইলে লিখে <code className={CODE}>\i file.sql</code> দিয়ে চালানো সহজ।
      </ContentParagraph>
    ),
  },
};
