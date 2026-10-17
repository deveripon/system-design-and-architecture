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
import { IslandsLab, TopNLab } from "../../../components/course/topics/windows/islands-animations";
import {
  IslandsCalendarDiagram,
  RowNumberTrickDiagram,
  TieCutDiagram,
  TopNPipelineDiagram,
} from "../../../components/course/topics/windows/islands-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const SIGNUPS = `signups(email, signed_up_at, source) AS (
  VALUES ('rahim.uddin@mail.example',  TIMESTAMP '2026-09-01 10:00', 'website'),
         ('Rahim.Uddin@mail.example',  TIMESTAMP '2026-10-05 21:30', 'facebook'),
         ('nusrat.jahan@mail.example', TIMESTAMP '2026-09-12 09:15', 'website'),
         ('lamia.haque@mail.example',  TIMESTAMP '2026-09-30 18:40', 'instagram'),
         ('nusrat.jahan@mail.example', TIMESTAMP '2026-10-02 11:05', 'website'),
         ('lamia.haque@mail.example',  TIMESTAMP '2026-10-11 20:10', 'facebook'),
         ('shuvo.das@mail.example',    TIMESTAMP '2026-10-01 08:30', 'website'),
         ('nusrat.jahan@mail.example', TIMESTAMP '2026-10-09 16:45', 'instagram')
)`;

export const topNGapsIslandsContent: TopicData = {
  id: "top-n-gaps-islands",
  introduction: {
    badge: "MODULE 08 · LESSON 06",
    title: <SectionTitle>প্রতিটা দলের সেরা কয়েকটা, আর টানা দিনের দ্বীপ: Top-N, Gaps and Islands</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের পাঁচটা লেসনে আপনি জানালা খুলতে শিখেছেন। OVER () দিয়ে প্রতিটা Row এর পাশে একটা হিসাব, ROW_NUMBER, RANK
          আর DENSE_RANK দিয়ে স্থান, PARTITION BY দিয়ে দলে দলে আলাদা জানালা, Frame দিয়ে চলমান যোগফল, আর LAG ও LEAD দিয়ে
          আগের পরের Row এর মান। প্রতিটা হাতিয়ার আলাদা করে চেনা হয়ে গেছে। এই লেসনে আপনি সেগুলো একসাথে কাজে লাগাবেন এমন
          তিনটা সমস্যায়, যেগুলো বাস্তব কাজে প্রতি সপ্তাহে আসে, আর SQL এর Interview এ প্রায় প্রতিবার।
        </ContentParagraph>
        <ContentParagraph>
          প্রথম সমস্যা প্রতিটা দলের সেরা N টা, ইংরেজিতে Top-N per Group: প্রতি মাসের সবচেয়ে বড় তিনটা Booking, প্রতিটা
          Customer এর সবশেষ Booking, প্রতিটা Destination এর সবচেয়ে সস্তা ট্যুর। দ্বিতীয় সমস্যা একই জিনিসের কয়েকটা Row
          থেকে একটা রাখা, যার নাম De-duplication। তৃতীয়টা সবচেয়ে বিখ্যাত, Gaps and Islands: টানা কয়েক দিন বা কয়েক মাসের
          দল খোঁজা, সবচেয়ে লম্বা ধারা খোঁজা, আর মাঝখানে কোন দিন, মাস বা নম্বর হারিয়ে গেছে তা বের করা।
        </ContentParagraph>
        <ContentParagraph>
          লেসন শেষে আপনি জানবেন তিনটা সমস্যার পেছনে কেন একটাই চাবি কাজ করে: আগে Window Function দিয়ে প্রতিটা Row কে একটা
          নম্বর দেওয়া, তারপর বাইরের Query তে সেই নম্বর দিয়ে ছাঁকা বা দল বানানো। সমান মান দাগের উপর পড়লে কোন Function কী
          করে, Module 03 এর DISTINCT ON আর Module 06 এর LATERAL এর সাথে এই পথের তুলনা কী, তারিখ থেকে Row Number বিয়োগ করার
          সেই বিখ্যাত কৌশল কেন কাজ করে, আর MySQL এ কোথায় কী আলাদা। প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে দেখতে কঠিন লাগে, কিন্তু আমার পুরো রহস্য একটা বিয়োগ। টানা দিনে তারিখ আর ক্রমিক নম্বর পাশাপাশি এক পা করে হাঁটে, তাই তাদের তফাত বদলায় না। যেদিন একটা দিন বাদ পড়ে, সেদিন তফাত বদলায়, আর নতুন দ্বীপ শুরু হয়।",
      author: "Gaps and Islands",
      role: "Lesson 06",
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
                1 November 2026, রবিবার। Island Tours এর সাপ্তাহিক বৈঠকে তিনজন মানুষ তিনটা অনুরোধ নিয়ে এলেন, আর তিনটাই
                গেল Developer তানিমের কাছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Operations এর ফারুক সাহেব:</strong> প্রতি মাসের সবচেয়ে বড় তিনটা Booking এর তালিকা চান, বাতিল
                  হওয়াগুলো বাদে। Support টিম সেই Customer দের ফোন করে ধন্যবাদ জানাবে। শুধু সবচেয়ে বড় তিনটা না, প্রতি মাসের
                  আলাদা তিনটা।
                </ListItem>
                <ListItem>
                  <strong>Marketing এর তানিয়া:</strong> Website, Facebook আর Instagram থেকে Newsletter এর Sign-up এর একটা
                  তালিকা এনেছেন। একই মানুষ সেখানে দুই তিনবার আছেন, কখনো Email এর বড় হাতের অক্ষরে। তিনি প্রতিটা মানুষের একটা
                  করে Row চান, সবচেয়ে নতুনটা।
                </ListItem>
                <ListItem>
                  <strong>Finance এর শারমিন আপা:</strong> জানতে চান কোন কোন সময়ে টানা কয়েক দিন ধরে Booking এসেছে, সবচেয়ে
                  লম্বা ধারাটা কত দিনের, আর কোন মাসগুলোতে একটাও Booking আসেনি। গত মাসের Report এ September এর পাশে লেখা
                  হয়েছিল &ldquo;আগস্টের চেয়ে কম&rdquo;, অথচ আগস্টে কোনো Booking ছিলই না। তিনি চান এমন ভুল আর না হোক।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তানিম প্রথম অনুরোধটা দিয়ে শুরু করলেন। তিনি Lesson 03 এ PARTITION BY শিখেছেন, তাই প্রতি মাসের ভেতরে টাকার
                অঙ্কে ক্রমিক নম্বর দেওয়া তাঁর জানা। তিনি ভাবলেন, নম্বর দেওয়ার Function টা সরাসরি WHERE এ লিখে দিলেই প্রতি
                মাসের প্রথম তিনটা থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: WHERE এর ভেতরে row_number()"
              query={`SELECT booking_id, to_char(booked_at, 'YYYY-MM') AS month, total_bdt
FROM bookings
WHERE status <> 'cancelled'
  AND row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                         ORDER BY total_bdt DESC, booking_id) <= 3;`}
              caption="Error: window functions are not allowed in WHERE। PostgreSQL পরিষ্কার বলছে WHERE এর ভেতরে Window Function চলে না। Query এর বানানে কোনো ভুল নেই, ভুলটা কোন ধাপে কী চলে সেই ক্রমে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <Link href="/sql/topic/what-are-window-functions" className={LINK}>
                  Lesson 01
                </Link>{" "}
                এ আপনি Query চলার যুক্তির ক্রম দেখেছেন: আগে FROM আর JOIN, তারপর WHERE, তারপর GROUP BY আর HAVING, তারপর
                Window Function গুলো, তারপর SELECT এর বাকি হিসাব, আর শেষে ORDER BY ও LIMIT। WHERE যখন চলে, তখন জানালাগুলো
                খোলেইনি। কোন Booking মাসের ভেতরে কততম, সেই নম্বর তখনো তৈরি হয়নি, তাই WHERE সেটা দিয়ে ছাঁকতে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                তানিম দ্বিতীয়বার চেষ্টা করলেন অন্যভাবে: SELECT এ নম্বরটার নাম দিলেন <code className={CODE}>rn</code>,
                আর WHERE এ লিখলেন <code className={CODE}>{"rn <= 3"}</code>। এবার Error এল{" "}
                <code className={CODE}>column &quot;rn&quot; does not exist</code>। কারণ একই: SELECT এর Alias তৈরি হয়
                WHERE এর পরে, তাই WHERE এর কাছে <code className={CODE}>rn</code> নামে কিছু নেই।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো কাজটা দুই ধাপে ভাগ করা। প্রথম ধাপের Query তে প্রতিটা Row কে নম্বর দিন। সেই Query টা একটা CTE
                এর ভেতরে রাখুন, যেটা আপনি{" "}
                <Link href="/sql/topic/ctes" className={LINK}>
                  Module 07
                </Link>{" "}
                এ শিখেছেন। দ্বিতীয় ধাপের বাইরের Query তে নম্বরটা আর হিসাব না, একটা সাধারণ Column, তাই WHERE সেটা দিয়ে
                স্বাভাবিকভাবে ছাঁকতে পারে। এই লেসনের প্রায় প্রতিটা Query এই দুই ধাপের ছাঁচে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "তিনটা সমস্যা, একটাই চাবি",
          content: (
            <ContentParagraph>
              তিনজনের তিনটা অনুরোধ আলাদা শোনায়, কিন্তু তিনটার ভেতরের গঠন একই। প্রথমে একটা Window Function প্রতিটা Row কে
              একটা নম্বর দেয়। তারপর বাইরের Query সেই নম্বর ব্যবহার করে। ফারুক সাহেবের কাজে নম্বর ৩ বা কম রাখা হয়। তানিয়ার
              কাজে শুধু নম্বর 1 রাখা হয়। আর শারমিন আপার কাজে নম্বরটা তারিখ থেকে বিয়োগ করে দলের নাম বানানো হয়, তারপর GROUP
              BY। এই একটা গঠন মনে রাখলে পুরো লেসন সহজ হয়ে যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "top-n-per-group",
      subHeader: { index: "002", title: "Top N per Group" },
      title: <SectionTitle>দুই ধাপের রেসিপি: আগে নম্বর, পরে ছাঁকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Top-N per Group মানে প্রতিটা দল থেকে একটা নির্দিষ্ট ক্রমে প্রথম N টা Row নেওয়া। এখানে তিনটা জিনিস ঠিক করতে
                হয়, আর প্রতিটা Query লেখার আগে আপনি নিজেকে এই তিনটা প্রশ্ন করবেন। দল কী? ফারুক সাহেবের কাজে মাস। ক্রম কী?
                টাকার অঙ্ক, বড় থেকে ছোট। N কত? তিন। উত্তর তিনটা জানা থাকলে Query টা প্রায় নিজে থেকে লেখা হয়ে যায়: দল যায়
                PARTITION BY তে, ক্রম যায় OVER এর ভেতরের ORDER BY তে, আর N যায় বাইরের WHERE এ।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে January 2026 এর চারটা Booking দিয়ে দুইটা ধাপ দেখুন। বাঁ দিকে প্রথম ধাপ, যেখানে মাসের ভেতরে
                প্রতিটা Booking একটা নম্বর পায়। ডান দিকে দ্বিতীয় ধাপ, যেখানে বাইরের Query শুধু ৩ বা তার কম নম্বরগুলো রাখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TopNPipelineDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফারুক সাহেবের তালিকা: প্রতি মাসের সবচেয়ে বড় তিনটা Booking"
              query={`WITH ranked AS (
  SELECT booking_id,
         to_char(booked_at, 'YYYY-MM') AS month,
         total_bdt,
         row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
  WHERE status <> 'cancelled'
)
SELECT month, rn, booking_id, total_bdt
FROM ranked
WHERE rn <= 3
ORDER BY month, rn;`}
              caption="চৌদ্দটা Row। 2025-12 এ মাত্র দুইটা Booking ছিল, তাই দুইটাই আছে (2 আর 1)। 2026-01 এ চারটার মধ্যে প্রথম তিনটা 6, 4, 7, আর Booking 3 (12500.00) বাদ। 2026-02 এ একটাই, Booking 8। 2026-03 এ 9, 11, 10। 2026-09 এ দুইটা, 15 আর 13। 2026-10 এ নয়টার মধ্যে 14, 23, 16। লক্ষ করুন, October এ Booking 17 এর অঙ্কও 36000.00, Booking 16 এর সমান, তবু সে বাদ। কেন, সেটা Section 004 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>Query টার প্রতিটা অংশ একবার করে দেখে নিন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>PARTITION BY to_char(booked_at, &apos;YYYY-MM&apos;):</strong> প্রতিটা মাস একটা আলাদা জানালা।
                  নতুন মাস শুরু হলেই নম্বর আবার 1 থেকে গোনা শুরু হয়। PARTITION BY না দিলে সব Booking মিলে একটাই তালিকা
                  হতো, আর আপনি পেতেন পুরো বছরের সবচেয়ে বড় তিনটা।
                </ListItem>
                <ListItem>
                  <strong>ORDER BY total_bdt DESC:</strong> জানালার ভেতরে কে আগে। বড় অঙ্ক আগে, তাই নম্বর 1 মানে মাসের
                  সবচেয়ে বড় Booking। ছোট থেকে বড় চাইলে DESC বাদ দিন, তখন নম্বর 1 মানে সবচেয়ে ছোট।
                </ListItem>
                <ListItem>
                  <strong>booking_id, দ্বিতীয় Column হিসেবে:</strong> এটা Tie-breaker, মানে সমান মানের মধ্যে কে আগে তার
                  মীমাংসা। ROW_NUMBER সমান অঙ্কের দুইটা Row কেও আলাদা নম্বর দেয়, আর কাকে আগে দেবে তা নিজে থেকে নিশ্চিত না।{" "}
                  <Link href="/sql/topic/ranking-functions" className={LINK}>
                    Lesson 02
                  </Link>{" "}
                  এ আপনি দেখেছেন এতে আজ এক উত্তর আর কাল আরেক উত্তর আসতে পারে। booking_id অনন্য, তাই তার সাথে ক্রমটা সবসময়
                  একই।
                </ListItem>
                <ListItem>
                  <strong>WHERE status &lt;&gt; &apos;cancelled&apos;, CTE এর ভেতরে:</strong> বাতিল Booking নম্বর পাওয়ার
                  আগেই বাদ। এর জায়গা খুব গুরুত্বপূর্ণ, নিচের Box এ নিজের চোখে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>বাইরের WHERE rn &lt;= 3:</strong> এখানে rn একটা সাধারণ Column, কারণ CTE এর ফলাফল একটা তৈরি
                  Table এর মতো। যে মাসে তিনটার কম Booking, সেখানে যতগুলো আছে ততগুলোই আসে, কোনো Error হয় না।
                </ListItem>
                <ListItem>
                  <strong>শেষের ORDER BY month, rn:</strong> OVER এর ভেতরের ORDER BY শুধু নম্বর দেওয়ার ক্রম ঠিক করে, ফলাফল
                  কোন ক্রমে দেখাবে তা না। দেখানোর ক্রম চাইলে বাইরের Query তে আলাদা ORDER BY লাগে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার একটা চুপচাপ ভুল দেখুন। ধরুন বাতিলের শর্তটা CTE এর বদলে বাইরের Query তে বসানো হলো। Query চলবে, Error
                আসবে না, কিন্তু উত্তর বদলে যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শর্তটা ভুল জায়গায়: নম্বর দেওয়ার পরে বাতিল বাদ"
              query={`WITH ranked AS (
  SELECT booking_id, status,
         to_char(booked_at, 'YYYY-MM') AS month,
         total_bdt,
         row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
)
SELECT month, rn, booking_id, total_bdt
FROM ranked
WHERE rn <= 3
  AND status <> 'cancelled'
ORDER BY month, rn;`}
              caption="তেরোটা Row, চৌদ্দটা না। January এ বাতিল Booking 12 (25000.00) নম্বর 3 দখল করে নিয়েছিল, তারপর বাইরের শর্তে বাদ পড়ল, তাই January তে শুধু দুইটা: 6 আর 4। Booking 7 এর যে জায়গা পাওয়ার কথা ছিল, সেটা চলে গেল। September এ Booking 18 ও বাতিল, কিন্তু সেটা নম্বর 3, আর সেই মাসে এমনিতেও দুইটার বেশি টেকার মতো Booking নেই, তাই সেখানে উত্তর বদলায়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Top-N per Group এর ছাঁচ",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                যেকোনো Top-N per Group প্রশ্নে এই চারটা লাইন মনে রাখুন, শুধু জায়গাগুলো বদলাবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  CTE এর ভেতরে: যে Row গুলো প্রতিযোগিতায় থাকবে, সেগুলোর শর্ত WHERE এ (যেমন বাতিল বাদ)।
                </ListItem>
                <ListItem>
                  একই CTE তে: <code className={CODE}>row_number() OVER (PARTITION BY দল ORDER BY ক্রম, অনন্য Column)</code>
                </ListItem>
                <ListItem>
                  বাইরে: <code className={CODE}>{"WHERE rn <= N"}</code>
                </ListItem>
                <ListItem>
                  বাইরে: দেখানোর জন্য নিজের ORDER BY, সাধারণত <code className={CODE}>দল, rn</code>
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
              orderMatters
              task={
                <>
                  প্রতিটা Customer এর সবচেয়ে বড় দুইটা Booking, সব অবস্থার Booking থেকে। তিনটা Column, এই ক্রমে:{" "}
                  <code className={CODE}>customer_id</code>, <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>total_bdt</code>। সমান অঙ্কে ছোট booking_id আগে। ফলাফল customer_id এর ক্রমে, একই
                  Customer এর ভেতরে বড় অঙ্ক আগে। যাঁর একটাই Booking, তাঁর একটাই Row আসবে।
                </>
              }
              hint={
                <>
                  দল <code className={CODE}>customer_id</code>, ক্রম{" "}
                  <code className={CODE}>total_bdt DESC, booking_id</code>, আর বাইরে{" "}
                  <code className={CODE}>{"rn <= 2"}</code>। শেষে <code className={CODE}>ORDER BY customer_id, rn</code>।
                </>
              }
              solution={`WITH ranked AS (
  SELECT customer_id, booking_id, total_bdt,
         row_number() OVER (PARTITION BY customer_id
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
)
SELECT customer_id, booking_id, total_bdt
FROM ranked
WHERE rn <= 2
ORDER BY customer_id, rn;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "watch-it-rank",
      subHeader: { index: "003", title: "Watch It Rank" },
      title: <SectionTitle>নিজের হাতে বদলে দেখুন কে টেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ তিনটা মাসের আসল Booking আছে: January, March আর October 2026। উপরে মাস বেছে নিন, তারপর Function
              বেছে নিন, আর N এক থেকে চার পর্যন্ত বদলান। সবুজ Row গুলো টিকে থাকে, ধূসরগুলো বাদ পড়ে। লক্ষ করুন, ROW_NUMBER
              এ টিকে থাকা Row এর সংখ্যা কখনো N এর বেশি হয় না। RANK আর DENSE_RANK এ October এর N = 3 বেছে নিলে চারটা Row
              টেকে, কারণ দুইটা Booking এর অঙ্ক সমান। N = 4 এ DENSE_RANK পাঁচটা রাখে, RANK চারটা। এই পার্থক্যই পরের
              Section এর বিষয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TopNLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "ties-at-the-cut",
      subHeader: { index: "004", title: "Ties at the Cut" },
      title: <SectionTitle>সমান অঙ্ক যখন ঠিক দাগের উপর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                October 2026 এ Booking 16 আর Booking 17, দুইটাই 36000.00 টাকার। মাসের তালিকায় তারা তৃতীয় আর চতুর্থ। যেই
                মুহূর্তে আপনি &ldquo;প্রথম তিনটা&rdquo; বলবেন, একটা প্রশ্ন উঠবে যেটা SQL নিজে থেকে মীমাংসা করতে পারে না:
                তৃতীয় জায়গাটা কার? দুজনের, নাকি একজনের? উত্তর নির্ভর করে আপনি কোন Function বেছে নিয়েছেন তার উপর। নিচের Box
                এ October এর নয়টা Booking এর পাশে তিনটা Function একসাথে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="October এর নয়টা Booking, তিনটা Function পাশাপাশি"
              query={`SELECT booking_id, total_bdt,
       row_number() OVER (ORDER BY total_bdt DESC, booking_id) AS rn,
       rank()       OVER w AS rk,
       dense_rank() OVER w AS drk
FROM bookings
WHERE status <> 'cancelled'
  AND booked_at >= '2026-10-01' AND booked_at < '2026-11-01'
WINDOW w AS (ORDER BY total_bdt DESC)
ORDER BY total_bdt DESC, booking_id;`}
              caption="নয়টা Row। Booking 16 আর 17 এ rn 3 আর 4, কিন্তু rk আর drk দুজনেরই 3। পরের Booking 19 (28000.00) এ পার্থক্য: RANK 4 নম্বরটা এড়িয়ে 5 দেয়, কারণ তার আগে চারজন আছেন; DENSE_RANK 4 দেয়, কারণ তার আগে তিনটা আলাদা অঙ্ক আছে। নিচে আবার একটা জোড়া: Booking 20 আর 24, দুইটাই 15600.00, rk 6 আর drk 5। WINDOW w লেখাটা Lesson 01 এর, একই জানালা দুইবার লিখতে হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TieCutDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিতে দাগটা ৩ এর নিচে। ROW_NUMBER এর তালিকায় ঠিক তিনজন টেকে, কারণ নম্বরগুলো কখনো পুনরাবৃত্ত হয় না। Booking
                17 বাদ পড়ে শুধু Tie-breaker এর কারণে: booking_id 16 ছোট, তাই সে আগে। Tie-breaker উল্টো দিলে Booking 17
                থাকত আর 16 বাদ পড়ত। অর্থাৎ ROW_NUMBER এ সমান অঙ্কের মধ্যে কে টিকবে, সেটা আপনার ঠিক করা একটা নিয়ম, Data এর
                কোনো স্বাভাবিক সত্য না।
              </ContentParagraph>
              <ContentParagraph>
                RANK আর DENSE_RANK এ সমান অঙ্ক সমান নম্বর পায়, তাই দাগের উপর দুজন থাকলে দুজনেই টেকে, আর তালিকায় চারটা Row
                আসে। পুরো Data তে, সব মাস মিলিয়ে, এই পার্থক্য কতটা, তা নিচের Box এ গুনে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Function, ৩ এর দাগে কয়টা Row টেকে"
              query={`WITH ranked AS (
  SELECT row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn,
         rank()       OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC) AS rk,
         dense_rank() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC) AS drk
  FROM bookings
  WHERE status <> 'cancelled'
)
SELECT count(*) FILTER (WHERE rn <= 3)  AS by_row_number,
       count(*) FILTER (WHERE rk <= 3)  AS by_rank,
       count(*) FILTER (WHERE drk <= 3) AS by_dense_rank
FROM ranked;`}
              caption="14, 15 আর 15। একমাত্র পার্থক্য October এর সেই জোড়া। দাগটা ৪ এ সরালে সংখ্যাগুলো হয় 16, 16 আর 17। তিনটাতেই January এর চতুর্থ Booking 3 যোগ হয়। October এ ROW_NUMBER এর 4 নম্বর Booking 17 যোগ হয়, RANK 4 নম্বরটা এড়িয়ে যায় বলে সেখানে নতুন কেউ টেকে না, আর DENSE_RANK Booking 19 কে 4 দেয়, তাই সে বাড়তি টেকে। FILTER লেখাটা Module 05 এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কোন প্রশ্নে কোন Function",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                Function বেছে নেওয়া আসলে প্রশ্নটা পরিষ্কার করা। কাজ দেওয়া মানুষটাকে জিজ্ঞেস করুন, সমান হলে কী হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ROW_NUMBER:</strong> ঠিক N টা চাই, একটাও বেশি না। যেমন Website এর পাতায় তিনটা Card এর জায়গা। সাথে
                  সবসময় একটা অনন্য Tie-breaker।
                </ListItem>
                <ListItem>
                  <strong>RANK:</strong> প্রথম N টা স্থান, সমান হলে স্থান ভাগাভাগি। খেলার ফলাফলের মতো: দুজন যুগ্মভাবে
                  তৃতীয় হলে কেউ চতুর্থ হয় না, পরের জন পঞ্চম। ফলে N এর বেশি Row আসতে পারে।
                </ListItem>
                <ListItem>
                  <strong>DENSE_RANK:</strong> প্রথম N টা আলাদা মান। &ldquo;দ্বিতীয় সর্বোচ্চ অঙ্ক কত&rdquo; ধরনের প্রশ্ন
                  এখানে পড়ে। এখানেও N এর বেশি Row আসতে পারে, RANK এর চেয়েও বেশি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফারুক সাহেবের কাজে কোনটা ঠিক? Support টিম যদি প্রতি মাসে ঠিক তিনটা ফোন করতে পারে, ROW_NUMBER। আর যদি সমান
                অঙ্কের কাউকে বাদ দেওয়া অন্যায় মনে হয়, RANK। দুটোই সঠিক SQL, প্রশ্ন দুটো আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  October 2026 এর বাতিল নয় এমন Booking গুলোর মধ্যে যেগুলোর টাকার অঙ্কের স্থান ৩ বা তার চেয়ে ভালো, সমান অঙ্কে
                  স্থান ভাগাভাগি করে। দুইটা Column: <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>total_bdt</code>। Row এর ক্রম যেকোনো। কয়টা Row আসবে, আগে অনুমান করুন।
                </>
              }
              hint={
                <>
                  স্থান ভাগাভাগি মানে <code className={CODE}>rank()</code>। October এর শর্ত{" "}
                  <code className={CODE}>{"booked_at >= '2026-10-01' AND booked_at < '2026-11-01'"}</code>। এখানে
                  PARTITION BY লাগবে না, কারণ মাস একটাই।
                </>
              }
              solution={`WITH ranked AS (
  SELECT booking_id, total_bdt,
         rank() OVER (ORDER BY total_bdt DESC) AS rk
  FROM bookings
  WHERE status <> 'cancelled'
    AND booked_at >= '2026-10-01' AND booked_at < '2026-11-01'
)
SELECT booking_id, total_bdt
FROM ranked
WHERE rk <= 3;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  Interview এর বিখ্যাত &ldquo;দ্বিতীয় সর্বোচ্চ&rdquo; প্রশ্ন, প্রতিটা মাসের জন্য। বাতিল নয় এমন Booking
                  থেকে, প্রতিটা মাসে আলাদা অঙ্কগুলোর মধ্যে দ্বিতীয় সর্বোচ্চ অঙ্কটা। দুইটা Column:{" "}
                  <code className={CODE}>month</code> (YYYY-MM আকারে) আর <code className={CODE}>total_bdt</code>। প্রতিটা
                  মাসের একটা Row, যে মাসে একটাই অঙ্ক সেই মাস আসবে না। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  &ldquo;আলাদা অঙ্কগুলোর মধ্যে দ্বিতীয়&rdquo; মানে <code className={CODE}>dense_rank()</code>, আর বাইরে{" "}
                  <code className={CODE}>WHERE drk = 2</code>। একই দ্বিতীয় অঙ্কের দুইটা Booking থাকলে মাসটা দুইবার না
                  আসার জন্য <code className={CODE}>SELECT DISTINCT</code>।
                </>
              }
              solution={`WITH ranked AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, total_bdt,
         dense_rank() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC) AS drk
  FROM bookings
  WHERE status <> 'cancelled'
)
SELECT DISTINCT month, total_bdt
FROM ranked
WHERE drk = 2;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "three-ways-top-one",
      subHeader: { index: "005", title: "Three Ways for Top 1" },
      title: <SectionTitle>প্রতিটা দলের একটা: তিনটা রাস্তা, একই উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Top-N এর সবচেয়ে বেশি দেখা রূপ হলো N = 1: প্রতিটা Customer এর সবশেষ Booking, প্রতিটা Destination এর
                সবচেয়ে সস্তা ট্যুর, প্রতিটা ট্যুরের পরের Departure। এই কাজটা আপনি আগেও দুইবার করেছেন, অন্য হাতিয়ার দিয়ে।{" "}
                <Link href="/sql/topic/distinct" className={LINK}>
                  Module 03
                </Link>{" "}
                এ PostgreSQL এর DISTINCT ON দিয়ে, আর{" "}
                <Link href="/sql/topic/lateral-join" className={LINK}>
                  Module 06
                </Link>{" "}
                এ LATERAL দিয়ে। এবার তিনটা পথ পাশাপাশি রেখে তুলনা করুন। প্রশ্নটা সব জায়গায় এক: প্রতিটা Customer এর সবশেষ
                Booking কোনটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পথ ১: ROW_NUMBER, তারপর rn = 1"
              query={`WITH ranked AS (
  SELECT customer_id, booking_id, booked_at,
         row_number() OVER (PARTITION BY customer_id
                            ORDER BY booked_at DESC, booking_id DESC) AS rn
  FROM bookings
)
SELECT customer_id, booking_id, booked_at
FROM ranked
WHERE rn = 1
ORDER BY customer_id;`}
              caption="চৌদ্দটা Row, প্রতিটা Booking থাকা Customer এর একটা। Rahim Uddin (customer 1) এর তিনটা Booking এর মধ্যে সবশেষ Booking 17, 8 October। Mitu Rahman (customer 6) এর সবশেষ Booking 18, যেটা বাতিল; প্রশ্নে অবস্থার কোনো শর্ত ছিল না, তাই সেটাই আসে। Imran Kabir (customer 15) নেই, কারণ bookings এ তাঁর কোনো Row নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পথ ২: DISTINCT ON, শুধু PostgreSQL এ"
              query={`SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, booked_at
FROM bookings
ORDER BY customer_id, booked_at DESC, booking_id DESC;`}
              caption="একই চৌদ্দটা Row, একই booking_id। DISTINCT ON (customer_id) মানে প্রতিটা customer_id এর শুধু প্রথম Row টা রাখা হবে, আর কোনটা প্রথম তা ঠিক করে ORDER BY। নিয়ম হলো ORDER BY এর শুরুতে DISTINCT ON এর Column গুলোই থাকতে হবে, তারপর কোনটা প্রথম তা ঠিক করার Column।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পথ ৩: LEFT JOIN LATERAL, Customer থেকে শুরু"
              query={`SELECT c.customer_id, c.full_name, nb.booking_id, nb.booked_at
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC, b.booking_id DESC
  LIMIT 1
) nb ON true
ORDER BY c.customer_id;`}
              caption="পনেরোটা Row। প্রথম চৌদ্দজনের booking_id আগের দুইটা Box এর সাথে হুবহু মেলে। পনেরো নম্বর Row টা Imran Kabir, booking_id আর booked_at খালি। LATERAL এর ভেতরের Query প্রতিটা Customer এর জন্য একবার চলে আর LIMIT 1 দিয়ে একটা Row আনে; Imran এর জন্য কিছু আসে না, আর LEFT JOIN তাঁকে রেখে দেয়। LIMIT 1 কে LIMIT 2 করলেই এটা Top-2 per Group।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পথ", "কখন ভালো", "কোথায় সীমা"],
          rows: [
            [
              "ROW_NUMBER, তারপর rn <= N",
              "যেকোনো N, সমান মানে RANK বা DENSE_RANK এ বদলানো যায়, PostgreSQL আর MySQL দুই জায়গাতেই চলে",
              "একটা CTE এর ধাপ লাগে; যে দলে একটাও Row নেই সে আসে না",
            ],
            [
              "DISTINCT ON",
              "শুধু N = 1 এর জন্য সবচেয়ে ছোট লেখা",
              "শুধু PostgreSQL; N = 2 বা সমান মানের সবাই চাইলে চলে না",
            ],
            [
              "LEFT JOIN LATERAL ... LIMIT N",
              "দলের Table থেকে শুরু, তাই খালি দলও আসে; দল কম আর Row অনেক হলে Index দিয়ে খুব দ্রুত",
              "প্রতিটা দলের জন্য ভেতরের Query একবার চলে; দল অনেক হলে ধীর হতে পারে",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা কথা জেনে রাখা ভালো। আপনি হয়তো ভাববেন, CTE এর ভেতরে Database প্রতিটা Row কে নম্বর দেয়, তারপর বাইরে
                বেশিরভাগ ফেলে দেয়, এটা তো অপচয়। PostgreSQL 15 থেকে Planner এটা বোঝে। row_number(), rank(), dense_rank()
                আর count() এর মতো Function এর মান একটা দলের ভেতরে শুধু বাড়তেই থাকে, কখনো কমে না। তাই{" "}
                <code className={CODE}>{"rn <= 2"}</code> একবার মিথ্যা হয়ে গেলে সেই দলের বাকি Row এর জন্য আর সত্য হবে না।
                Planner শর্তটা বাইরের WHERE থেকে তুলে জানালার হিসাবের ভেতরেই বসিয়ে দেয়। EXPLAIN এ সেটা দেখা যায় Run
                Condition নামে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="EXPLAIN: শর্তটা জানালার ভেতরে চলে গেছে"
              query={`EXPLAIN (COSTS OFF)
WITH ranked AS (
  SELECT booking_id, customer_id, total_bdt,
         row_number() OVER (PARTITION BY customer_id
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
)
SELECT booking_id, customer_id, total_bdt
FROM ranked
WHERE rn <= 2;`}
              caption="সাত লাইনের Plan। WindowAgg এর ঠিক নিচে লাইনটা: Run Condition: (row_number() OVER w1 <= 2)। বাইরের WHERE আলাদা Filter হিসেবে কোথাও নেই। তার নিচে Sort, Sort Key: bookings.customer_id, bookings.total_bdt DESC, bookings.booking_id, মানে জানালার দল আর ক্রম অনুযায়ী আগে সাজানো। চব্বিশটা Row এ সময়ের পার্থক্য চোখে পড়বে না, লাখ Row এ পড়বে।"
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
                  প্রতিটা Destination এর সবচেয়ে সস্তা ট্যুর। তিনটা Column, এই ক্রমে: Destination এর{" "}
                  <code className={CODE}>name</code>, ট্যুরের <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code>। যে Destination এ কোনো ট্যুর নেই, সেটা আসবে না। উপরের তিনটা পথের
                  যেকোনোটা দিয়ে লিখুন। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>destinations</code> আর <code className={CODE}>tours</code> এর JOIN। DISTINCT ON
                  দিয়ে লিখলে <code className={CODE}>ORDER BY d.destination_id, t.price_bdt, t.tour_id</code>।
                </>
              }
              solution={`SELECT DISTINCT ON (d.destination_id)
       d.name, t.title, t.price_bdt
FROM destinations d
JOIN tours t ON t.destination_id = d.destination_id
ORDER BY d.destination_id, t.price_bdt, t.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "keeping-one-row",
      subHeader: { index: "006", title: "Keeping One Row" },
      title: <SectionTitle>একই মানুষ তিনবার: নতুনটা রেখে বাকিগুলো বাদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিয়ার তালিকা। De-duplication মানে একই জিনিসের কয়েকটা Row থেকে একটা রেখে বাকিগুলো বাদ দেওয়া। বাস্তবে
                এটা প্রায় প্রতিটা Data Import এর পরে লাগে: একই Customer দুইবার Form পূরণ করেছেন, একই File দুইবার Upload
                হয়েছে, দুইটা System এর তালিকা মেলানো হয়েছে। লক্ষ করুন, এটা আসলে Top-1 per Group এরই আরেক রূপ। দল হলো
                &ldquo;একই জিনিস&rdquo;, ক্রম হলো &ldquo;কোনটা রাখব&rdquo;, আর N = 1।
              </ContentParagraph>
              <ContentParagraph>
                তানিয়ার তালিকা Database এর কোনো Table এ নেই, তাই নিচের Box গুলোতে সেটা একটা VALUES এর CTE হিসেবে লেখা,
                আটটা Row। Island Tours এর নিয়মে Email এ বড় হাতের আর ছোট হাতের অক্ষরের পার্থক্য ধরা হয় না, তাই{" "}
                <code className={CODE}>Rahim.Uddin@mail.example</code> আর{" "}
                <code className={CODE}>rahim.uddin@mail.example</code> একই মানুষ। দল বানানো হবে{" "}
                <code className={CODE}>lower(email)</code> দিয়ে। আগে প্রতিটা Row এর পাশে নম্বরটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা মানুষের ভেতরে নতুন থেকে পুরনো নম্বর"
              query={`WITH ${SIGNUPS}
SELECT lower(email) AS email, signed_up_at, source,
       row_number() OVER (PARTITION BY lower(email)
                          ORDER BY signed_up_at DESC) AS rn
FROM signups
ORDER BY email, rn;`}
              caption="আটটা Row, চারজন মানুষ। lamia.haque দুইবার, nusrat.jahan তিনবার, rahim.uddin দুইবার (একবার বড় হাতের অক্ষরে), shuvo.das একবার। প্রতিজনের সবচেয়ে নতুন Sign-up এর rn 1। এখানে signed_up_at এ কোনো সমান মান নেই, তাই আলাদা Tie-breaker লাগেনি; আসল Table এ একটা অনন্য id কে দ্বিতীয় Column হিসেবে দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিয়ার পরিষ্কার তালিকা: শুধু rn = 1"
              query={`WITH ${SIGNUPS},
ranked AS (
  SELECT lower(email) AS email, signed_up_at, source,
         row_number() OVER (PARTITION BY lower(email)
                            ORDER BY signed_up_at DESC) AS rn
  FROM signups
)
SELECT email, source, signed_up_at
FROM ranked
WHERE rn = 1
ORDER BY signed_up_at DESC;`}
              caption="চারটা Row: lamia.haque, facebook, 11 October; nusrat.jahan, instagram, 9 October; rahim.uddin, facebook, 5 October; shuvo.das, website, 1 October। প্রতিটা Row একটা আসল Sign-up, পুরোটা একসাথে: যে সময়, সেই সময়ের source।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা প্রশ্ন আসা স্বাভাবিক: Module 05 এর GROUP BY দিয়ে কেন করা যায় না? <code className={CODE}>GROUP BY
                lower(email)</code> আর <code className={CODE}>max(signed_up_at)</code> দিলে প্রত্যেকের সবশেষ সময়টা ঠিকই
                আসে। সমস্যা হয় source নিয়ে। GROUP BY এর পরে প্রতিটা Column কে কোনো Aggregate দিয়ে মোড়াতে হয়, আর{" "}
                <code className={CODE}>max(source)</code> দেয় অক্ষরের ক্রমে সবচেয়ে বড় লেখাটা, সবশেষ Row এর লেখা না। ফলে
                একটা Row এর সময় আর আরেকটা Row এর source মিলে এমন একটা Row তৈরি হয়, যেটা কখনো ঘটেনি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY এর ফাঁদ: দুই Row মিলে একটা কাল্পনিক Row"
              query={`WITH ${SIGNUPS}
SELECT lower(email) AS email,
       max(signed_up_at) AS newest_signup,
       max(source) AS source
FROM signups
GROUP BY lower(email)
ORDER BY email;`}
              caption="চারটা Row, কিন্তু চারটার মধ্যে তিনটার source ভুল। lamia.haque এর সবশেষ Sign-up ছিল facebook এ, এখানে দেখাচ্ছে instagram। nusrat.jahan এর সবশেষ instagram, দেখাচ্ছে website। rahim.uddin এর সবশেষ facebook, দেখাচ্ছে website। শুধু shuvo.das ঠিক, কারণ তাঁর একটাই Row। কোনো Error নেই, Row এর সংখ্যাও ঠিক, তাই এই ভুল সহজে চোখে পড়ে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তবে অনেক সময় শুধু পরিষ্কার তালিকা দেখানো যথেষ্ট না, Table থেকেই বাড়তি Row গুলো মুছে ফেলতে হয়। তখন একই
                নম্বর দেওয়ার CTE কাজে আসে, শুধু বাইরের অংশটা SELECT এর বদলে DELETE: যে Row গুলোর rn 1 এর বেশি, সেগুলো মুছে ফেলা হয়।
                DELETE এর পুরো আলোচনা{" "}
                <Link href="/sql/topic/delete-soft-delete" className={LINK}>
                  Module 10
                </Link>{" "}
                এ। নিচের Box এ একটা অস্থায়ী Table বানিয়ে শুধু তিনটা Row দিয়ে ছাঁচটা দেখুন। TEMP Table টা শুধু এই পাতার
                Session এ থাকে, Sample Database এর কোনো Table বদলায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ছাঁচে DELETE: বাড়তি Row মুছে ফেলা"
              query={`DROP TABLE IF EXISTS signups_raw;
CREATE TEMP TABLE signups_raw (
  signup_id    int PRIMARY KEY,
  email        text,
  signed_up_at timestamp,
  source       text
);
INSERT INTO signups_raw VALUES
  (1, 'rahim.uddin@mail.example',  '2026-09-01 10:00', 'website'),
  (2, 'Rahim.Uddin@mail.example',  '2026-10-05 21:30', 'facebook'),
  (3, 'nusrat.jahan@mail.example', '2026-09-12 09:15', 'website');

WITH ranked AS (
  SELECT signup_id,
         row_number() OVER (PARTITION BY lower(email)
                            ORDER BY signed_up_at DESC, signup_id DESC) AS rn
  FROM signups_raw
)
DELETE FROM signups_raw
WHERE signup_id IN (SELECT signup_id FROM ranked WHERE rn > 1);

SELECT * FROM signups_raw ORDER BY signup_id;`}
              caption="DELETE 1, তারপর দুইটা Row: signup_id 2 (Rahim এর নতুন facebook এর Row) আর 3 (Nusrat এর একমাত্র Row)। Rahim এর পুরনো Row 1 মুছে গেছে। এখানে signup_id কে Tie-breaker রাখা হয়েছে, যাতে একই সময়ের দুইটা Row থাকলেও ঠিক একটা টেকে। আসল Table এ এমন DELETE চালানোর আগে একই CTE দিয়ে SELECT চালিয়ে দেখে নিন কোন Row গুলো যাবে।"
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
                  তানিয়া এবার জানতে চান প্রতিটা মানুষকে প্রথমবার কোন চ্যানেল এনেছিল। প্রতিটা মানুষের সবচেয়ে পুরনো Sign-up
                  টা রাখুন। তিনটা Column, এই ক্রমে: ছোট হাতের অক্ষরে <code className={CODE}>email</code>,{" "}
                  <code className={CODE}>source</code>, <code className={CODE}>signed_up_at</code>। চারটা Row আসবে। Row
                  এর ক্রম যেকোনো। নিচে signups এর CTE দেওয়া আছে।
                </>
              }
              hint={
                <>
                  উপরের Query টাই, শুধু <code className={CODE}>ORDER BY signed_up_at</code> থেকে DESC বাদ। দল এখনো{" "}
                  <code className={CODE}>lower(email)</code>, আর SELECT এও <code className={CODE}>lower(email)</code>।
                </>
              }
              starter={`WITH ${SIGNUPS},
ranked AS (
  -- এখানে নম্বর দিন
)
SELECT ...;`}
              solution={`WITH ${SIGNUPS},
ranked AS (
  SELECT lower(email) AS email, signed_up_at, source,
         row_number() OVER (PARTITION BY lower(email)
                            ORDER BY signed_up_at) AS rn
  FROM signups
)
SELECT email, source, signed_up_at
FROM ranked
WHERE rn = 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "gaps-and-islands",
      subHeader: { index: "007", title: "Gaps and Islands" },
      title: <SectionTitle>দ্বীপ আর ফাঁক: সমস্যাটা আসলে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার শারমিন আপার প্রশ্ন। ধরুন আপনি October এর ক্যালেন্ডারে প্রতিটা দিনের ঘরে দাগ দিলেন, যেদিন অন্তত একটা
                Booking এসেছে। দাগ দেওয়া ঘরগুলো কোথাও পাশাপাশি টানা, কোথাও একা, আর মাঝে মাঝে খালি ঘর। দূর থেকে দেখলে মনে হয়
                সমুদ্রে কয়েকটা দ্বীপ, আর তাদের মাঝে পানি। এই ছবি থেকেই নাম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Island (দ্বীপ):</strong> টানা মানের একটা দল, যেখানে প্রতিটা মান আগেরটার ঠিক এক ধাপ পরে, আর দলটা
                  যতটা সম্ভব বড়, মানে দুই পাশে আর বাড়ানো যায় না। দিনের বেলায় এক ধাপ মানে এক দিন, মাসের বেলায় এক মাস,
                  নম্বরের বেলায় 1।
                </ListItem>
                <ListItem>
                  <strong>Gap (ফাঁক):</strong> দুইটা দ্বীপের মাঝের হারানো মানগুলো। যে দিনে Booking আসেনি, যে মাস খালি, যে
                  নম্বর Table এ নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandsCalendarDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="October এর যে দিনগুলোতে Booking এসেছে"
              query={`SELECT DISTINCT booked_at::date AS day
FROM bookings
WHERE booked_at >= '2026-10-01' AND booked_at < '2026-11-01'
ORDER BY day;`}
              caption="নয়টা দিন: 1, 2, 4, 8, 10, 11, 12, 13, 14 October। ছবির ভরা ঘরগুলো ঠিক এগুলো। ::date লেখাটা booked_at এর সময়ের অংশ ফেলে শুধু তারিখ রাখে, Module 04 এর Cast। পাতার Time Zone Asia/Dhaka, তাই তারিখগুলো বাংলাদেশের দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মানুষের চোখে দ্বীপগুলো এক নজরে ধরা পড়ে: 1 থেকে 2, শুধু 4, শুধু 8, আর 10 থেকে 14। কিন্তু SQL এর কাছে এটা
                কঠিন, আর কেন কঠিন সেটা বোঝা জরুরি। SQL Row গুলোকে একটা সেট হিসেবে দেখে। WHERE একবারে একটা Row দেখে, GROUP BY
                একই মানের Row একসাথে করে। কিন্তু &ldquo;টানা&rdquo; কথাটা কোনো একটা Row এর গুণ না, এটা একটা Row আর তার
                পাশের Row এর সম্পর্ক। 11 October নিজে জানে না যে সে একটা পাঁচ দিনের দ্বীপের অংশ। এমন কোনো Column নেই যার
                মান দিয়ে GROUP BY করলে 10 থেকে 14 একসাথে আসবে।
              </ContentParagraph>
              <ContentParagraph>
                তাই কৌশলটা হলো এমন একটা Column বানানো, যার মান একই দ্বীপের সব Row এ এক, আর আলাদা দ্বীপে আলাদা। একবার সেই
                Column পেলে বাকিটা Module 05 এর সাধারণ GROUP BY। সেই Column বানানোর সবচেয়ে বিখ্যাত উপায় পরের Section এ।
              </ContentParagraph>
              <ContentParagraph>
                এই সমস্যা শুধু Booking এর দিনে না, প্রায় সব জায়গায় আসে। ভাষা শেখার App এ টানা কত দিন Practice হলো, সেই
                Streak। একটা Server কোন সময় থেকে কোন সময় পর্যন্ত বন্ধ ছিল। Bus এ পাশাপাশি খালি সিট কোথায়। Invoice এর নম্বরে
                কোনটা হারিয়ে গেছে, যেটা Audit এ প্রথম প্রশ্ন। একজন কর্মী টানা কত দিন অফিসে এসেছেন। সবগুলোর ভেতরের প্রশ্ন একই:
                টানা দল কোনগুলো, আর মাঝে কী নেই।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "row-number-trick",
      subHeader: { index: "008", title: "The Row Number Trick" },
      title: <SectionTitle>এক বিয়োগে দ্বীপের নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কৌশলটা এই। দিনগুলো তারিখের ক্রমে সাজিয়ে প্রতিটাকে একটা ক্রমিক নম্বর দিন, row_number() দিয়ে। তারপর প্রতিটা
                তারিখ থেকে তার নম্বর, সেই পরিমাণ দিন হিসেবে, বিয়োগ করুন। যা আসে সেটাই দ্বীপের নাম।
              </ContentParagraph>
              <ContentParagraph>
                কেন কাজ করে, একটা ছোট উদাহরণে দেখুন। ধরুন 10, 11, 12 October পরপর তিনটা দিন, আর তাদের নম্বর 20, 21, 22।
                টানা দিনে তারিখ প্রতি Row এ এক দিন বাড়ে, নম্বরও এক বাড়ে। দুইটাই সমান তালে এগোয়, তাই তাদের তফাত বদলায় না:
                10 থেকে 20 দিন বাদ দিলে 20 September, 11 থেকে 21 দিন বাদ দিলেও 20 September, 12 থেকে 22 দিন বাদ দিলেও 20
                September। এখন ধরুন মাঝে একটা দিন হারিয়ে গেল, যেমন 8 October এর পরের Booking 10 October এ। তারিখ লাফ দিল
                দুই দিন, কিন্তু নম্বর বাড়ল মাত্র এক। তফাতটা এক দিন সরে গেল, আর সেখান থেকে নতুন দ্বীপের নতুন নাম।
              </ContentParagraph>
              <ContentParagraph>
                বিয়োগফলের তারিখটা নিজে কোনো অর্থবহ দিন না। 20 September এ কিছু ঘটেনি। এটা শুধু একটা লেবেল, যেটা একই দ্বীপের
                সবার জন্য এক। নিচের ছবিতে আসল Query এর শেষ নয়টা Row দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowNumberTrickDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা দিন, তার নম্বর, আর বিয়োগফল"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
)
SELECT day,
       row_number() OVER (ORDER BY day) AS rn,
       day - (row_number() OVER (ORDER BY day))::int AS grp
FROM days
ORDER BY day;`}
              caption="চব্বিশটা Row, কারণ চব্বিশটা Booking চব্বিশটা আলাদা দিনে। প্রথম Row 2025-12-20, rn 1, grp 2025-12-19। 2026-01-05 আর 2026-01-06 এর grp দুইটাই 2026-01-02, তাই তারা এক দ্বীপ। 2026-03-01 আর 03-02 এর grp 2026-02-19। আর শেষের পাঁচটা দিন, 10 থেকে 14 October, সবার grp 2026-09-20।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>Query টার তিনটা খুঁটিনাটি খেয়াল করুন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আগে DISTINCT:</strong> একই দিনে দুইটা Booking এলে নম্বর দুইবার বাড়ত, কিন্তু তারিখ একই থাকত, আর
                  বিয়োগফল এক দিন সরে যেত। একটা দ্বীপ ভুল করে দুই ভাগ হয়ে যেত। এই Data তে প্রতিটা Booking আলাদা দিনে, তাই আজ
                  DISTINCT বাদ দিলেও একই উত্তর আসত। কিন্তু কাল একই দিনে দুইটা Booking এলেই উত্তর ভুল হতো। তাই প্রথম ধাপ
                  সবসময় প্রতিটা দিন একবার করে।
                </ListItem>
                <ListItem>
                  <strong>OVER (ORDER BY day), PARTITION BY ছাড়া:</strong> পুরো তালিকা একটা জানালা। পরে Customer ধরে আলাদা
                  Streak চাইলে PARTITION BY customer_id যোগ করবেন, তখন প্রতিটা Customer এর নম্বর আলাদা করে 1 থেকে শুরু হবে।
                </ListItem>
                <ListItem>
                  <strong>::int:</strong> PostgreSQL এ date থেকে একটা integer বিয়োগ করলে সেই কয় দিন আগের date আসে। কিন্তু
                  row_number() ফেরত দেয় bigint, আর date থেকে bigint বিয়োগের কোনো নিয়ম PostgreSQL এ নেই। তাই নম্বরটাকে
                  int এ Cast করতে হয়। নিচের Box এ Cast বাদ দিয়ে Error টা নিজে দেখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Cast ছাড়া: date থেকে bigint বিয়োগ"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
)
SELECT day, day - row_number() OVER (ORDER BY day) AS grp
FROM days;`}
              caption="Error: operator does not exist: date - bigint। Database বলছে date আর bigint এর মাঝে বিয়োগ চিহ্নের কোনো মানে সে জানে না। সমাধান উপরের Box এর মতো (row_number() OVER (ORDER BY day))::int।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ কৌশলটা একটা একটা Row করে চলতে দেখুন। Step চাপলে পরের Row এর তারিখ, নম্বর আর বিয়োগফল আসে, আর
              বিয়োগফল বদলালে নতুন দ্বীপের রং। Dataset বদলে Payment এর booking_id আর Booking এর status এও একই খেলা দেখতে
              পাবেন, যেগুলো এই লেসনের পরের দুইটা Section এর বিষয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandsLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              grp পেয়ে গেলে বাকিটা পরিচিত GROUP BY। প্রতিটা দ্বীপের প্রথম দিন min(day), শেষ দিন max(day), আর কত দিন
              count(*)।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব দ্বীপ: প্রথম দিন, শেষ দিন, কত দিন"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
)
SELECT min(day) AS first_day,
       max(day) AS last_day,
       count(*) AS days
FROM grouped
GROUP BY grp
ORDER BY first_day;`}
              caption="সতেরোটা দ্বীপ। বেশিরভাগ এক দিনের। দুই দিনের দ্বীপ তিনটা: 2026-01-05 থেকে 01-06, 2026-03-01 থেকে 03-02, 2026-10-01 থেকে 10-02। আর সবচেয়ে লম্বাটা 2026-10-10 থেকে 2026-10-14, পাঁচ দিন। grp Column টা SELECT এ নেই, কিন্তু GROUP BY তে আছে, এটা বৈধ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "islands-and-gaps-of-days",
      subHeader: { index: "009", title: "Long Islands, Big Gaps" },
      title: <SectionTitle>লম্বা দ্বীপ, বড় ফাঁক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শারমিন আপা সব সতেরোটা দ্বীপ চান না, চান শুধু যেখানে টানা অন্তত দুই দিন Booking এসেছে। দ্বীপগুলো GROUP BY এর
              ফলাফল, তাই তাদের উপর শর্ত বসে HAVING এ, Module 05 এর মতো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="টানা অন্তত দুই দিনের দ্বীপ, লম্বাটা আগে"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
)
SELECT min(day) AS first_day,
       max(day) AS last_day,
       count(*) AS days
FROM grouped
GROUP BY grp
HAVING count(*) >= 2
ORDER BY days DESC, first_day;`}
              caption="চারটা Row। প্রথমে 2026-10-10 থেকে 10-14, পাঁচ দিন। তারপর তিনটা দুই দিনের দ্বীপ, তারিখের ক্রমে: 2026-01-05 থেকে 01-06, 2026-03-01 থেকে 03-02, 2026-10-01 থেকে 10-02। শুধু সবচেয়ে লম্বাটা চাইলে শেষে LIMIT 1, কিন্তু সমান লম্বা দুইটা দ্বীপ থাকলে LIMIT 1 একটা বাদ দেবে, তখন Section 004 এর RANK এর কথা মনে রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফাঁক। দ্বীপগুলো তারিখের ক্রমে সাজানো থাকলে একটা দ্বীপের শেষ দিন আর পরের দ্বীপের প্রথম দিনের মাঝের
                দিনগুলোই ফাঁক। পরের দ্বীপের প্রথম দিনটা পাশে আনতে লাগে LEAD, যেটা{" "}
                <Link href="/sql/topic/lag-lead" className={LINK}>
                  Lesson 05
                </Link>{" "}
                এর বিষয়: <code className={CODE}>lead(first_day) OVER (ORDER BY first_day)</code> মানে পরের Row এর
                first_day। ফাঁক শুরু হয় শেষ দিনের পরের দিন, শেষ হয় পরের দ্বীপের আগের দিন, আর তার দৈর্ঘ্য হলো দুই তারিখের
                বিয়োগফল থেকে এক কম। PostgreSQL এ দুইটা date বিয়োগ করলে দিনের সংখ্যা আসে, integer হিসেবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবচেয়ে বড় তিনটা ফাঁক"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
),
islands AS (
  SELECT min(day) AS first_day, max(day) AS last_day
  FROM grouped
  GROUP BY grp
)
SELECT last_day + 1 AS gap_from,
       lead(first_day) OVER (ORDER BY first_day) - 1 AS gap_to,
       lead(first_day) OVER (ORDER BY first_day) - last_day - 1 AS gap_days
FROM islands
ORDER BY gap_days DESC NULLS LAST
LIMIT 3;`}
              caption="তিনটা Row। সবচেয়ে বড় ফাঁক 2026-03-26 থেকে 2026-09-14, 173 দিন: মার্চের শেষ থেকে September এর মাঝামাঝি পর্যন্ত একটাও Booking আসেনি, Island Tours এর দুই মৌসুমের মাঝের বিরতি। তারপর 2026-03-03 থেকে 03-24, 22 দিন, আর 2026-01-31 থেকে 02-19, 20 দিন। শেষ দ্বীপের পরে কোনো দ্বীপ নেই, তাই তার lead NULL, আর NULLS LAST সেটাকে নিচে পাঠায়, LIMIT এ বাদ পড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বীপ খোঁজার আরেকটা পথও জেনে রাখুন, কারণ Interview এ এটাও আসে আর কিছু প্রশ্নে এটাই সহজ। প্রথমে LAG দিয়ে
                প্রতিটা দিনের পাশে আগের দিন আনুন। আগের দিনের সাথে তফাত ঠিক এক দিন হলে এই দিন পুরনো দ্বীপের অংশ, না হলে এখান
                থেকে নতুন দ্বীপ শুরু, তাই তার পাশে 1 লিখুন। তারপর সেই 1 গুলোর চলমান যোগফল নিন, Lesson 04 এর মতো। প্রতিটা
                নতুন দ্বীপে যোগফল এক বাড়ে, আর দ্বীপের ভেতরে একই থাকে। সেই যোগফলই দ্বীপের নম্বর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় পথ: LAG দিয়ে শুরু চিহ্নিত, তারপর চলমান যোগফল"
              query={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
marked AS (
  SELECT day,
         CASE WHEN day - lag(day) OVER (ORDER BY day) = 1
              THEN 0 ELSE 1 END AS starts_island
  FROM days
),
numbered AS (
  SELECT day,
         sum(starts_island) OVER (ORDER BY day) AS island_no
  FROM marked
)
SELECT island_no, min(day) AS first_day, max(day) AS last_day, count(*) AS days
FROM numbered
GROUP BY island_no
ORDER BY island_no;`}
              caption="সতেরোটা Row, island_no 1 থেকে 17, আর প্রতিটা দ্বীপের প্রথম আর শেষ দিন আগের Box এর সাথে হুবহু এক। প্রথম দিনের কোনো আগের দিন নেই, তাই lag NULL, তুলনার ফলও NULL, আর CASE এর ELSE তাকে 1 দেয়: প্রথম দিন সবসময় নতুন দ্বীপ। এই পথের সুবিধা হলো টানা কথাটার সংজ্ঞা বদলানো সহজ: মাঝে এক দিন বাদ পড়লেও টানা ধরতে চাইলে = 1 এর জায়গায় <= 2।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  শুধু <code className={CODE}>confirmed</code> Booking এর দিনগুলো নিয়ে দ্বীপ খুঁজুন, আর রাখুন শুধু যেগুলো
                  টানা অন্তত দুই দিনের। তিনটা Column, এই ক্রমে: <code className={CODE}>first_day</code>,{" "}
                  <code className={CODE}>last_day</code>, <code className={CODE}>days</code>। ফলাফল first_day এর ক্রমে।
                  উপরের চারটা দ্বীপের কয়টা টিকবে, আগে অনুমান করুন।
                </>
              }
              hint={
                <>
                  প্রথম CTE তে <code className={CODE}>WHERE status = &apos;confirmed&apos;</code>, বাকিটা উপরের Query এর
                  মতো, শেষে <code className={CODE}>{"HAVING count(*) >= 2"}</code> আর{" "}
                  <code className={CODE}>ORDER BY first_day</code>।
                </>
              }
              solution={`WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
  WHERE status = 'confirmed'
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
)
SELECT min(day) AS first_day,
       max(day) AS last_day,
       count(*) AS days
FROM grouped
GROUP BY grp
HAVING count(*) >= 2
ORDER BY first_day;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "missing-months-and-ids",
      subHeader: { index: "010", title: "Missing Months and Ids" },
      title: <SectionTitle>যা নেই তা খোঁজা: হারানো মাস আর হারানো নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শারমিন আপার শেষ প্রশ্ন: কোন মাসগুলোতে একটাও Booking আসেনি? Section 009 এ আপনি ফাঁকের দৈর্ঘ্য পেয়েছেন, কিন্তু
                প্রতিটা হারানো মাস আলাদা Row হিসেবে চাইলে আরেকটা কথা মাথায় রাখতে হয়। যা নেই, Database তা নিজে থেকে দেখাতে
                পারে না, কারণ খালি মাসের কোনো Row কোনো Table এ নেই। কোনো WHERE বা GROUP BY এমন একটা Row আনতে পারে না, যেটা
                শুরুতেই ছিল না।
              </ContentParagraph>
              <ContentParagraph>
                তাই উল্টো দিক থেকে ভাবুন। প্রথমে যা যা থাকার কথা, তার পুরো তালিকা বানান। তারপর সেই তালিকা থেকে যা আছে তা
                বাদ দিন। যা বাকি থাকে, সেটাই হারানো। পুরো তালিকা বানায় generate_series, যেটা আপনি{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Module 04
                </Link>{" "}
                এ ক্যালেন্ডার বানাতে দেখেছেন, আর বাদ দেওয়ার কাজ করে Module 07 এর NOT EXISTS। এখানে শুরু আর শেষের মাস হাতে
                লেখা হয়নি, Data থেকেই নেওয়া হয়েছে, যাতে নতুন Booking এলে Query বদলাতে না হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম আর শেষ Booking এর মাঝে যে মাসগুলো খালি"
              query={`SELECT g.m::date AS missing_month
FROM generate_series(
       (SELECT date_trunc('month', min(booked_at)) FROM bookings),
       (SELECT date_trunc('month', max(booked_at)) FROM bookings),
       interval '1 month') AS g(m)
WHERE NOT EXISTS (
  SELECT 1
  FROM bookings b
  WHERE date_trunc('month', b.booked_at) = g.m
)
ORDER BY missing_month;`}
              caption="পাঁচটা Row: 2026-04-01, 05-01, 06-01, 07-01 আর 08-01। April থেকে August পুরোটা খালি। এটাই গত মাসের Report এর ভুলের উৎস: আগের Row এর সাথে তুলনা করলে September এর আগের Row আসলে March, August না। generate_series এখানে timestamp with time zone এর তালিকা দেয়, তাই দেখানোর সময় ::date।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের দ্বীপও একই কৌশলে খোঁজা যায়, শুধু একটা বাধা আছে। date থেকে integer বিয়োগ করলে দিন বাদ যায়, মাস না।
                আর মাসের দৈর্ঘ্য সমান না, কোনোটা ২৮ দিনের, কোনোটা ৩১ দিনের। তাই প্রতিটা মাসকে আগে একটা চলমান মাস নম্বরে
                বদলে নিন: বছর গুণ 12, যোগ মাস। 2025 এর December হয় 24312, 2026 এর January হয় 24313। পরপর দুইটা মাস এখন
                পরপর দুইটা integer, আর বাকিটা আগের মতোই বিয়োগ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাসের দ্বীপ: Booking থাকা টানা মাসগুলো"
              query={`WITH months AS (
  SELECT DISTINCT date_trunc('month', booked_at)::date AS m
  FROM bookings
),
grouped AS (
  SELECT m,
         (extract(year FROM m) * 12 + extract(month FROM m))::int
           - (row_number() OVER (ORDER BY m))::int AS grp
  FROM months
)
SELECT min(m) AS first_month,
       max(m) AS last_month,
       count(*) AS months
FROM grouped
GROUP BY grp
ORDER BY first_month;`}
              caption="দুইটা Row: 2025-12-01 থেকে 2026-03-01, চার মাস; আর 2026-09-01 থেকে 2026-10-01, দুই মাস। Module overview এ যে দুই মৌসুমের কথা বলা হয়েছিল, এই সেই দুইটা দ্বীপ। মাঝের পাঁচ মাস আগের Box এর ফাঁক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নম্বরের বেলায় কাজ আরও সহজ, কারণ integer থেকে integer বিয়োগ সরাসরি চলে, কোনো Cast লাগে না। payments
                Table এর booking_id গুলো দেখুন: কোন কোন Booking এর টাকার Row আছে, টানা কোন পরিসরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Payment থাকা booking_id এর দ্বীপ"
              query={`WITH paid AS (
  SELECT DISTINCT booking_id
  FROM payments
),
grouped AS (
  SELECT booking_id,
         booking_id - row_number() OVER (ORDER BY booking_id) AS grp
  FROM paid
)
SELECT min(booking_id) AS first_id,
       max(booking_id) AS last_id,
       count(*) AS ids
FROM grouped
GROUP BY grp
ORDER BY first_id;`}
              caption="চারটা Row: 1 থেকে 11 (এগারোটা), 13 থেকে 16 (চারটা), শুধু 19, আর 21 থেকে 23 (তিনটা)। মাঝের ফাঁকগুলো 12, 17, 18 আর 20, আর শেষের পরে 24। এগুলো ভুল না: 12 আর 18 বাতিল, 17, 20 আর 24 এখনো pending। Audit এ ঠিক এই কাজটাই হয়: প্রতিটা ফাঁকের একটা কারণ থাকতে হবে।"
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
                  Section 007 এর ক্যালেন্ডারের খালি ঘরগুলো Query দিয়ে বের করুন: 1 থেকে 14 October 2026 এর মধ্যে যে দিনগুলোতে
                  একটাও Booking আসেনি। একটা Column, <code className={CODE}>day</code>, date হিসেবে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"generate_series(DATE '2026-10-01', DATE '2026-10-14', interval '1 day')"}</code>{" "}
                  দিয়ে চৌদ্দটা দিন, তারপর NOT EXISTS এ{" "}
                  <code className={CODE}>b.booked_at::date = g.d::date</code>। SELECT এ{" "}
                  <code className={CODE}>g.d::date</code>।
                </>
              }
              solution={`SELECT g.d::date AS day
FROM generate_series(DATE '2026-10-01', DATE '2026-10-14',
                     interval '1 day') AS g(d)
WHERE NOT EXISTS (
  SELECT 1
  FROM bookings b
  WHERE b.booked_at::date = g.d::date
);`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8"
              task={
                <>
                  1 থেকে bookings এর সবচেয়ে বড় booking_id পর্যন্ত প্রতিটা নম্বরের মধ্যে কোনগুলোর জন্য payments এ একটাও
                  Row নেই? একটা Column, <code className={CODE}>booking_id</code>। সবচেয়ে বড় নম্বরটা হাতে লিখবেন না, Query
                  দিয়ে নিন। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"generate_series(1, (SELECT max(booking_id) FROM bookings)) AS g(n)"}</code>,
                  তারপর <code className={CODE}>NOT EXISTS (SELECT 1 FROM payments p WHERE p.booking_id = g.n)</code>।
                </>
              }
              solution={`SELECT g.n AS booking_id
FROM generate_series(1, (SELECT max(booking_id) FROM bookings)) AS g(n)
WHERE NOT EXISTS (
  SELECT 1
  FROM payments p
  WHERE p.booking_id = g.n
);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "streaks",
      subHeader: { index: "011", title: "Streaks of a Value" },
      title: <SectionTitle>একই মানের টানা দৌড়: দুইটা Row Number এর বিয়োগ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটু অন্য রকম দ্বীপ। Booking গুলো booked_at এর ক্রমে সাজালে তাদের status এর একটা ধারা পাওয়া যায়:
                confirmed, confirmed, confirmed, cancelled, confirmed, ... এখানে প্রশ্নটা টানা তারিখের না, টানা একই মানের।
                পরপর কয়টা Booking confirmed হয়েছিল, কোথায় সেই ধারা ভাঙল, আর সবচেয়ে লম্বা ধারা কোনটা। এমন টানা একই মানের দলকে
                বলে Streak বা Run। খেলার জয়ের ধারা, পরপর কয়টা Order সময়মতো পৌঁছেছে, একটা Sensor কতক্ষণ টানা একই অবস্থায়
                ছিল, সব এই ধরনের।
              </ContentParagraph>
              <ContentParagraph>
                এখানে তারিখ থেকে বিয়োগ করার কিছু নেই, তাই কৌশলটা একটু বদলায়। দুইটা ক্রমিক নম্বর নিন। প্রথমটা সব Booking এর
                উপর, booked_at এর ক্রমে: rn_all। দ্বিতীয়টা প্রতিটা status এর ভেতরে আলাদা করে, একই ক্রমে: rn_status। একটা
                ধারার ভেতরে দুইটা নম্বরই প্রতি Row এ এক করে বাড়ে, তাই বিয়োগফল একই থাকে। অন্য status এর একটা Booking মাঝে
                এলে rn_all বাড়ে, কিন্তু এই status এর rn_status বাড়ে না। ফলে ধারা আবার শুরু হলে বিয়োগফল বদলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুইটা নম্বর আর তাদের বিয়োগফল"
              query={`SELECT booking_id, status,
       row_number() OVER (ORDER BY booked_at) AS rn_all,
       row_number() OVER (PARTITION BY status ORDER BY booked_at) AS rn_status,
       row_number() OVER (ORDER BY booked_at)
     - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
FROM bookings
ORDER BY booked_at;`}
              caption="চব্বিশটা Row। প্রথম তিনটা confirmed (Booking 1, 2, 4) এর rn_all আর rn_status দুইটাই 1, 2, 3, তাই grp 0। তারপর বাতিল Booking 5: rn_all 4, rn_status 1, grp 3। তারপর confirmed 3, 6, 7: rn_all 5 থেকে 7, rn_status 4 থেকে 6, grp 1। একটা জিনিস খেয়াল করুন: বাতিল Booking 12 এর grp 6, আর অনেক পরে confirmed 21, 22, 23 এর grp ও 6।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "GROUP BY শুধু grp দিয়ে না, status আর grp দুইটা দিয়ে",
          content: (
            <ContentParagraph>
              বিয়োগফলটা শুধু একই status এর ভেতরে অনন্য। দুইটা আলাদা status এর দুইটা আলাদা ধারার বিয়োগফল কাকতালীয়ভাবে এক হতে
              পারে, উপরের Box এ যেমন বাতিল 12 আর confirmed 21 থেকে 23, দুইটারই 6। শুধু grp দিয়ে GROUP BY করলে এরা এক দলে
              মিশে যায়, আর আপনি পান চারটা Booking এর এমন একটা &ldquo;ধারা&rdquo;, যেটা আসলে কখনো ছিল না। নিচের Box এ ভুলটা
              নিজে দেখুন, তারপর ঠিক Query।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল: শুধু grp দিয়ে দল"
              query={`WITH ordered AS (
  SELECT booking_id, booked_at, status,
         row_number() OVER (ORDER BY booked_at)
       - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
  FROM bookings
)
SELECT grp,
       string_agg(DISTINCT status, ', ') AS statuses,
       count(*) AS bookings
FROM ordered
GROUP BY grp
ORDER BY grp;`}
              caption="দশটা Row, এগারোটা হওয়ার কথা ছিল। grp 6 এর Row এ statuses লেখা cancelled, confirmed, আর bookings 4। একটা ধারায় দুইটা status থাকতে পারে না, তাই এই Row টা নিজেই বলে দিচ্ছে দল বানানো ভুল হয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঠিক: প্রতিটা ধারা, কোথা থেকে কোথায়, কয়টা Booking"
              query={`WITH ordered AS (
  SELECT booking_id, booked_at, status,
         row_number() OVER (ORDER BY booked_at)
       - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
  FROM bookings
)
SELECT status,
       min(booked_at)::date AS run_from,
       max(booked_at)::date AS run_to,
       count(*) AS bookings
FROM ordered
GROUP BY status, grp
ORDER BY run_from;`}
              caption="এগারোটা ধারা। সবচেয়ে লম্বাটা confirmed এর ছয়টা Booking, 2026-02-20 থেকে 2026-09-20 (Booking 8, 9, 10, 11, 13, 15)। লক্ষ করুন, এই ধারার মাঝে পাঁচ মাসের ফাঁক আছে, তবু এটা এক ধারা, কারণ এখানে টানা মানে পরপর Row, পরপর দিন না। কোন অর্থে টানা, সেটা প্রশ্ন থেকে ঠিক করতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা status এর সবচেয়ে লম্বা ধারা"
              query={`WITH ordered AS (
  SELECT booked_at, status,
         row_number() OVER (ORDER BY booked_at)
       - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
  FROM bookings
),
runs AS (
  SELECT status, count(*) AS bookings
  FROM ordered
  GROUP BY status, grp
)
SELECT status, max(bookings) AS longest_run
FROM runs
GROUP BY status
ORDER BY status;`}
              caption="তিনটা Row: cancelled 1, confirmed 6, pending 2। পরপর দুইটা Booking কখনো বাতিল হয়নি। pending এর দুইটার ধারা হলো Booking 17 আর 20, 8 আর 10 October। দুই ধাপের GROUP BY: প্রথমে প্রতিটা ধারার দৈর্ঘ্য, তারপর প্রতিটা status এর সর্বোচ্চ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "interview-patterns",
      subHeader: { index: "012", title: "Interview Patterns" },
      title: <SectionTitle>Interview এ এই প্রশ্নগুলো কোন চেহারায় আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Interview এর প্রশ্নে সাধারণত Island Tours থাকে না, থাকে Employee, User, Login, Order। কিন্তু ভেতরের গঠন এই লেসনের
              পাঁচটা ছাঁচের কোনো একটা। প্রশ্ন শোনার পর প্রথম কাজ হলো চিনে ফেলা কোন ছাঁচ। নিচের ছকে পরিচিত প্রশ্নগুলো আর তাদের
              ছাঁচ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন যেভাবে আসে", "আসলে কোন সমস্যা", "ছাঁচ"],
          rows: [
            [
              "প্রতিটা Department এ সবচেয়ে বেশি বেতনের তিনজন",
              "Top-N per Group",
              "CTE তে ROW_NUMBER বা RANK, বাইরে rn <= 3",
            ],
            ["দ্বিতীয় সর্বোচ্চ বেতন", "আলাদা মানের মধ্যে N তম", "DENSE_RANK, বাইরে = 2"],
            ["প্রতিটা User এর সবশেষ Login", "Top-1 per Group", "rn = 1, DISTINCT ON, বা LATERAL ... LIMIT 1"],
            [
              "Duplicate Email মুছুন, সবচেয়ে নতুনটা রেখে",
              "De-duplication",
              "PARTITION BY lower(email), তারপর DELETE ... rn > 1",
            ],
            [
              "টানা তিন দিন বা তার বেশি Login করেছেন এমন User",
              "Islands, প্রতিটা User আলাদা",
              "DISTINCT দিন, PARTITION BY user, day - row_number, HAVING count(*) >= 3",
            ],
            ["হারানো Invoice নম্বর", "Gaps", "generate_series আর NOT EXISTS, অথবা LEAD দিয়ে পরের নম্বর"],
            ["প্রতিটা খেলোয়াড়ের সবচেয়ে লম্বা জয়ের ধারা", "Streak", "দুইটা row_number এর বিয়োগ, GROUP BY মান আর grp"],
            [
              "Server কখন থেকে কখন বন্ধ ছিল",
              "অবস্থার Island",
              "দুইটা row_number, অথবা LAG দিয়ে অবস্থা বদলের জায়গা চিহ্নিত করে চলমান যোগফল",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছাঁচ চেনার পর Query লেখার আগে Interviewer কে কয়েকটা প্রশ্ন করুন। এগুলো দুর্বলতা না, বরং দেখায় যে আপনি
                কিনারার Case গুলো চেনেন। ভালো Interviewer ঠিক এটাই শুনতে চান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সমান হলে কী?</strong> দুজনের বেতন সমান হলে দুজনেই আসবেন, নাকি একজন? উত্তর থেকে ROW_NUMBER, RANK বা
                  DENSE_RANK।
                </ListItem>
                <ListItem>
                  <strong>টানা মানে কী?</strong> পরপর ক্যালেন্ডারের দিন, নাকি পরপর Row? Section 011 এর ছয়টা Booking এর ধারায়
                  পাঁচ মাসের ফাঁক ছিল, তবু পরপর Row হিসেবে সেটা টানা।
                </ListItem>
                <ListItem>
                  <strong>একই দিনে দুইবার হলে?</strong> হ্যাঁ হলে আগে DISTINCT, নইলে দ্বীপ ভেঙে যাবে। আর দিন কোন Time Zone এ
                  গোনা হবে, সেটাও জিজ্ঞেস করার মতো।
                </ListItem>
                <ListItem>
                  <strong>খালি দল লাগবে?</strong> যে Department এ কেউ নেই, সেটাও দেখাতে হবে? হ্যাঁ হলে LEFT JOIN LATERAL।
                </ListItem>
                <ListItem>
                  <strong>উচ্চস্বরে ছাঁচটা বলুন, তারপর কিনারা পরীক্ষা করুন:</strong> N এর কম Row এর দল, দাগের উপর সমান মান,
                  একদম প্রথম আর শেষ Row, আর একটাই Row এর দ্বীপ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge: সবচেয়ে লম্বা confirmed ধারা"
              task={
                <>
                  booked_at এর ক্রমে পরপর confirmed Booking এর সবচেয়ে লম্বা ধারাটা খুঁজুন। একটা Row, তিনটা Column, এই
                  ক্রমে: ধারার প্রথম Booking এর <code className={CODE}>booking_id</code>, শেষ Booking এর{" "}
                  <code className={CODE}>booking_id</code>, আর ধারায় কয়টা Booking। উপরের Box গুলো না দেখে নিজে লেখার
                  চেষ্টা করুন।
                </>
              }
              hint={
                <>
                  তিনটা ধাপ। এক, সব Booking এর উপর দুইটা row_number এর বিয়োগ, grp। দুই, শুধু confirmed রেখে GROUP BY grp,
                  আর প্রথম ও শেষ booking_id এর জন্য{" "}
                  <code className={CODE}>(array_agg(booking_id ORDER BY booked_at))[1]</code> আর একই জিনিস{" "}
                  <code className={CODE}>ORDER BY booked_at DESC</code> দিয়ে। তিন, দৈর্ঘ্যে বড় থেকে ছোট সাজিয়ে LIMIT 1।
                  খেয়াল রাখুন, confirmed এর শর্ত নম্বর দেওয়ার পরে বসবে, আগে না।
                </>
              }
              solution={`WITH ordered AS (
  SELECT booking_id, booked_at, status,
         row_number() OVER (ORDER BY booked_at)
       - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
  FROM bookings
),
runs AS (
  SELECT (array_agg(booking_id ORDER BY booked_at))[1] AS first_booking,
         (array_agg(booking_id ORDER BY booked_at DESC))[1] AS last_booking,
         count(*) AS bookings
  FROM ordered
  WHERE status = 'confirmed'
  GROUP BY grp
)
SELECT first_booking, last_booking, bookings
FROM runs
ORDER BY bookings DESC
LIMIT 1;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই ছাঁচ, কয়েকটা আলাদা বাধা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL 8.0 থেকে Window Function আছে, আর এই লেসনের মূল ছাঁচ, CTE তে ROW_NUMBER তারপর বাইরে ছাঁকা, MySQL 8.4 এ
                হুবহু চলে। প্রতিটা Customer এর বড় দুইটা Booking সেখানেও তেইশটা Row দেয়। Status এর ধারা, LATERAL দিয়ে সবশেষ
                Booking, VALUES দিয়ে বানানো তালিকার De-duplication, সব একই উত্তর দেয়। পার্থক্যগুলো কয়েকটা নির্দিষ্ট জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>WHERE এ Window Function:</strong> PostgreSQL এর মতো MySQL ও এটা মানে না, Error 3593। সমাধানও একই,
                  CTE।
                </ListItem>
                <ListItem>
                  <strong>DISTINCT ON নেই:</strong> এটা PostgreSQL এর নিজস্ব, MySQL এ Syntax Error 1064। সেখানে Top-1 per
                  Group লিখুন ROW_NUMBER বা LATERAL দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>QUALIFY কার্যত নেই:</strong> কিছু Database এ QUALIFY নামে একটা Clause আছে, যেটা Window Function এর
                  ফলাফলকে সরাসরি ছাঁকতে দেয়, CTE ছাড়াই। MySQL 8.4 শব্দটা চেনে, কিন্তু শুধু Hypergraph Optimizer চালু থাকলে
                  চালায়, নইলে Error 6037। আর সাধারণ Release Build এ সেই Optimizer চালু করতে গেলে Error 3999। PostgreSQL এ
                  QUALIFY একেবারেই নেই, নিচের Box এ দেখুন।
                </ListItem>
                <ListItem>
                  <strong>date থেকে নম্বর বিয়োগ:</strong> MySQL এ <code className={CODE}>day - n</code> তারিখ দেয় না। সেখানে
                  লিখুন <code className={CODE}>DATE_SUB(day, INTERVAL n DAY)</code>। Window Function টা সরাসরি INTERVAL এর
                  ভেতরে বসানো যায়, আর দ্বীপগুলো PostgreSQL এর সাথে হুবহু মেলে।
                </ListItem>
                <ListItem>
                  <strong>ROW_NUMBER এর ধরন BIGINT UNSIGNED:</strong> মানে ঋণাত্মক হতে পারে না। বিয়োগের ফল শূন্যের নিচে গেলে
                  MySQL চুপ থাকে না, Error 1690 দেয়। তাই বড় থেকে ছোট বিয়োগ করুন (id থেকে নম্বর, উল্টো না), অথবা{" "}
                  <code className={CODE}>CAST(ROW_NUMBER() OVER (...) AS SIGNED)</code>।
                </ListItem>
                <ListItem>
                  <strong>generate_series নেই:</strong> পুরো তালিকা বানাতে{" "}
                  <Link href="/sql/topic/recursive-ctes" className={LINK}>
                    Module 07 এর WITH RECURSIVE
                  </Link>
                  । খালি মাসের উত্তর একই পাঁচটা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-top-n-islands.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql লোড করা

SELECT booking_id, total_bdt
FROM bookings
WHERE ROW_NUMBER() OVER (ORDER BY total_bdt DESC) <= 3;
-- ERROR 3593 (HY000): You cannot use the window function 'row_number'
--   in this context.'

SELECT DISTINCT ON (customer_id) customer_id, booking_id
FROM bookings
ORDER BY customer_id, booked_at DESC;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ...
--   near 'ON (customer_id) customer_id, booking_id ...'

SELECT booking_id, ROW_NUMBER() OVER (ORDER BY total_bdt DESC, booking_id) AS rn
FROM bookings
QUALIFY rn <= 3;
-- ERROR 6037 (HY000): 'QUALIFY clause' can be used only if the
--   hypergraph optimizer is enabled.

SET optimizer_switch = 'hypergraph_optimizer=on';
-- ERROR 3999 (42000): The hypergraph optimizer does not yet support
--   'use in non-debug builds'

WITH ranked AS (
  SELECT customer_id, booking_id,
         ROW_NUMBER() OVER (PARTITION BY customer_id
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings)
SELECT COUNT(*) AS kept FROM ranked WHERE rn <= 2;
-- kept: 23

WITH days AS (SELECT DISTINCT DATE(booked_at) AS day FROM bookings),
grouped AS (
  SELECT day,
         DATE_SUB(day, INTERVAL ROW_NUMBER() OVER (ORDER BY day) DAY) AS grp
  FROM days)
SELECT MIN(day) AS first_day, MAX(day) AS last_day, COUNT(*) AS days
FROM grouped
GROUP BY grp
HAVING COUNT(*) >= 2
ORDER BY first_day;
-- 2026-01-05 | 2026-01-06 | 2
-- 2026-03-01 | 2026-03-02 | 2
-- 2026-10-01 | 2026-10-02 | 2
-- 2026-10-10 | 2026-10-14 | 5

WITH paid AS (SELECT DISTINCT booking_id FROM payments)
SELECT booking_id,
       ROW_NUMBER() OVER (ORDER BY booking_id) - booking_id AS grp
FROM paid;
-- ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in
--   '(\`row_number() OVER (ORDER BY paid.booking_id ) \` - \`paid\`.\`booking_id\`)'

WITH paid AS (SELECT DISTINCT booking_id FROM payments)
SELECT booking_id,
       CAST(ROW_NUMBER() OVER (ORDER BY booking_id) AS SIGNED) - booking_id AS grp
FROM paid
LIMIT 3;
-- 1 | 0
-- 2 | 0
-- 3 | 0

WITH RECURSIVE months AS (
  SELECT DATE '2025-12-01' AS m
  UNION ALL
  SELECT m + INTERVAL 1 MONTH FROM months WHERE m < DATE '2026-10-01')
SELECT m AS missing_month
FROM months
WHERE NOT EXISTS (SELECT 1 FROM bookings b
                  WHERE DATE_FORMAT(b.booked_at, '%Y-%m-01') = m);
-- 2026-04-01, 2026-05-01, 2026-06-01, 2026-07-01, 2026-08-01`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL এ QUALIFY: শব্দটাই অচেনা"
              query={`SELECT booking_id, total_bdt,
       row_number() OVER (ORDER BY total_bdt DESC, booking_id) AS rn
FROM bookings
QUALIFY rn <= 3;`}
              caption="Error: syntax error at or near &quot;rn&quot;। PostgreSQL QUALIFY কে কোনো Clause হিসেবে চেনে না, ভাবে এটা bookings Table এর একটা Alias, যেমন FROM bookings b। তাই পরের শব্দ rn এ গিয়ে আটকে যায়। Error এর জায়গাটা দেখে বিভ্রান্ত হবেন না: সমস্যা rn না, QUALIFY। PostgreSQL এ পথ একটাই, CTE বা Subquery।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর রবিবারের Dashboard</SectionTitle>,
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
                বৈঠকের পরে তানিম তিনজনের অনুরোধ মিলিয়ে Admin Panel এ একটা Dashboard পাতা বানালেন। পাতার প্রথম Card এ প্রতি
                মাসের একটা লাইন: কয়টা Booking, মোট কত টাকা, আর সেই মাসের সবচেয়ে বড় Booking কার। ফারুক সাহেব এখান থেকেই ঠিক
                করেন কাকে আগে ফোন করা হবে। সমান অঙ্কে দুজন হলে দুজনকেই দেখানো হবে, তাই এখানে RANK।
              </ContentParagraph>
              <ContentParagraph>
                এই Query তে একটা নতুন জিনিস লক্ষ করুন। একই CTE তে তিনটা জানালা, তিনটারই দল মাস, কিন্তু কাজ আলাদা: count আর
                sum প্রতিটা Row এর পাশে মাসের মোট বসায়, Lesson 03 এর মতো, আর rank মাসের ভেতরে স্থান দেয়। বাইরে rk = 1 রাখলে
                প্রতিটা মাসের এক লাইনেই তিনটা তথ্য চলে আসে, আলাদা GROUP BY ছাড়াই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Card ১: প্রতি মাসের সারাংশ আর সেরা Booking"
              query={`WITH monthly AS (
  SELECT to_char(b.booked_at, 'YYYY-MM') AS month,
         b.booking_id, b.customer_id, b.total_bdt,
         count(*)         OVER (PARTITION BY to_char(b.booked_at, 'YYYY-MM')) AS bookings,
         sum(b.total_bdt) OVER (PARTITION BY to_char(b.booked_at, 'YYYY-MM')) AS month_total,
         rank() OVER (PARTITION BY to_char(b.booked_at, 'YYYY-MM')
                      ORDER BY b.total_bdt DESC) AS rk
  FROM bookings b
  WHERE b.status <> 'cancelled'
)
SELECT m.month, m.bookings, m.month_total,
       c.full_name AS top_customer, m.booking_id, m.total_bdt
FROM monthly m
JOIN customers c ON c.customer_id = m.customer_id
WHERE m.rk = 1
ORDER BY m.month;`}
              caption="ছয়টা Row, প্রতি মাসের একটা। 2025-12: দুইটা Booking, 75000.00, সেরা Nusrat Jahan এর Booking 2 (50000.00)। 2026-01: চারটা, 92000.00, Mitu Rahman এর Booking 6। 2026-02: একটা, 19000.00, Rahim Uddin। 2026-03: তিনটা, 57600.00, Sumaiya Islam। 2026-09: দুইটা, 50500.00, Shuvo Das। 2026-10: নয়টা, 246700.00, Kamal Hasan এর Booking 14 (50000.00, এখনো pending)। কোনো মাসে সেরা অঙ্কে সমান দুজন নেই, তাই প্রতিটা মাস একবারই এসেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় Card শারমিন আপার জন্য: Island Tours এর মৌসুমগুলো। মাসিক আয় থেকে মাসের দ্বীপ বানালে প্রতিটা দ্বীপ একটা
              মৌসুম, আর প্রতিটা মৌসুমের মোট Booking আর আয় এক লাইনে। এখানে Section 010 এর মাস নম্বরের কৌশল, শুধু শুরুতে একটা
              মাসিক GROUP BY।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Card ২: মৌসুম, মানে টানা Booking থাকা মাসের দ্বীপ"
              query={`WITH monthly AS (
  SELECT date_trunc('month', booked_at)::date AS m,
         count(*) AS bookings,
         sum(total_bdt) AS revenue
  FROM bookings
  WHERE status <> 'cancelled'
  GROUP BY 1
),
grouped AS (
  SELECT m, bookings, revenue,
         (extract(year FROM m) * 12 + extract(month FROM m))::int
           - (row_number() OVER (ORDER BY m))::int AS grp
  FROM monthly
)
SELECT min(m) AS season_from,
       max(m) AS season_to,
       count(*) AS months,
       sum(bookings) AS bookings,
       sum(revenue) AS revenue
FROM grouped
GROUP BY grp
ORDER BY season_from;`}
              caption="দুইটা মৌসুম। প্রথমটা 2025-12-01 থেকে 2026-03-01, চার মাস, দশটা Booking, 243600.00 টাকা। দ্বিতীয়টা 2026-09-01 থেকে 2026-10-01, দুই মাস, এগারোটা Booking, 297200.00 টাকা। দ্বিতীয় মৌসুম অর্ধেক সময়ে বেশি আয় করেছে। মনে রাখবেন, এখানে pending Booking ও আছে, শুধু বাতিল বাদ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>দ্বীপের Query, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Section 009 এর &ldquo;টানা অন্তত দুই দিনের দ্বীপ&rdquo; Query টা Database ভেতরে কোন ক্রমে চালায়, শেষ পাঁচটা
              দিনের উদাহরণ দিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "days: FROM bookings, তারপর DISTINCT booked_at::date",
              description:
                "চব্বিশটা Booking থেকে প্রতিটার তারিখ, প্রতিটা দিন একবার। এই Data তে চব্বিশটা আলাদা দিন। একই দিনে দুইটা Booking থাকলে এখানেই একটা হয়ে যেত।",
            },
            {
              title: "grouped: row_number() OVER (ORDER BY day)",
              description:
                "দিনগুলো তারিখের ক্রমে সাজিয়ে 1 থেকে 24 নম্বর। 10 October পায় 20, 11 পায় 21, আর 14 পায় 24।",
            },
            {
              title: "grouped: day - নম্বর::int",
              description:
                "10 October থেকে 20 দিন বাদ 20 September, 11 থেকে 21 দিন বাদ 20 September, 14 থেকে 24 দিন বাদ 20 September। পাঁচটা দিনের grp একই।",
            },
            {
              title: "GROUP BY grp",
              description:
                "একই grp এর Row গুলো এক দলে। চব্বিশটা দিন থেকে সতেরোটা দল, প্রতিটা একটা দ্বীপ। 20 September দলে পাঁচটা দিন।",
            },
            {
              title: "min, max, count",
              description:
                "প্রতিটা দলের প্রথম দিন, শেষ দিন আর দিনের সংখ্যা। 20 September দল হয়ে যায় 2026-10-10, 2026-10-14, 5।",
            },
            {
              title: "HAVING count(*) >= 2",
              description:
                "এক দিনের তেরোটা দ্বীপ বাদ, থাকে চারটা: পাঁচ দিনের একটা আর দুই দিনের তিনটা।",
            },
            {
              title: "ORDER BY days DESC, first_day",
              description:
                "লম্বাটা আগে, সমান লম্বায় আগের তারিখ আগে: 10 থেকে 14 October, তারপর 5 থেকে 6 January, 1 থেকে 2 March, আর 1 থেকে 2 October।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবচেয়ে বেশি হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখা যায়", "ঠিক উপায়"],
          rows: [
            [
              "WHERE এ সরাসরি row_number() OVER (...)",
              "ERROR: window functions are not allowed in WHERE",
              "নম্বরটা CTE তে, ছাঁকা বাইরের WHERE এ",
            ],
            [
              "WHERE এ SELECT এর Alias rn",
              "ERROR: column \"rn\" does not exist",
              "একই সমাধান, CTE বা Subquery",
            ],
            [
              "ROW_NUMBER এ Tie-breaker নেই",
              "সমান অঙ্কে কে টেকে তা প্রতিবার নিশ্চিত না",
              "ORDER BY এর শেষে একটা অনন্য Column, যেমন booking_id",
            ],
            [
              "বাতিলের শর্ত নম্বর দেওয়ার পরে",
              "Error নেই, কিন্তু 14 এর বদলে 13 Row, January এ একটা জায়গা হারানো",
              "যে Row প্রতিযোগিতায় নেই, তাকে CTE এর ভেতরে WHERE এ বাদ দিন",
            ],
            [
              "সমান মানের প্রশ্নে ভুল Function",
              "সমান অঙ্কের একজন অন্যায়ভাবে বাদ, বা N এর বেশি Row",
              "আগে জিজ্ঞেস করুন সমান হলে কী: ROW_NUMBER, RANK না DENSE_RANK",
            ],
            [
              "De-duplication এ GROUP BY আর max()",
              "এক Row এর সময় আর আরেক Row এর source মিলে কাল্পনিক Row",
              "ROW_NUMBER দিয়ে পুরো Row টা রাখুন, rn = 1",
            ],
            [
              "দ্বীপ খোঁজার আগে DISTINCT ভুলে যাওয়া",
              "একই দিনে দুইটা Booking এ একটা দ্বীপ দুই ভাগ",
              "প্রথম ধাপে প্রতিটা দিন একবার",
            ],
            [
              "date থেকে row_number() সরাসরি বিয়োগ",
              "ERROR: operator does not exist: date - bigint",
              "(row_number() OVER (...))::int",
            ],
            [
              "Streak এ শুধু grp দিয়ে GROUP BY",
              "দুই status এর দুইটা ধারা এক দলে, দশটা Row",
              "GROUP BY status, grp",
            ],
            [
              "হারানো মান GROUP BY দিয়ে খোঁজা",
              "খালি মাস ফলাফলে আসেই না",
              "generate_series দিয়ে পুরো তালিকা, তারপর NOT EXISTS",
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
                    href="https://www.postgresql.org/docs/current/tutorial-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Functions Tutorial
                  </a>
                  : জানালা কী, PARTITION BY আর ORDER BY, আর Window Function কে ছাঁকতে হলে কেন Subquery লাগে, সেই কথা
                  সরাসরি।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Functions
                  </a>
                  : row_number, rank, dense_rank সহ সব Window Function এর তালিকা আর প্রতিটার সংজ্ঞা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-select.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SELECT
                  </a>
                  : DISTINCT ON এর নিয়ম, আর LATERAL এর আনুষ্ঠানিক বর্ণনা, এক পাতায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-srf.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Set Returning Functions
                  </a>
                  : generate_series এর সব রূপ, সংখ্যা আর সময় দুইটারই।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/release/15.0/"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL 15 Release Notes
                  </a>
                  : row_number, rank, dense_rank আর count ব্যবহার করা Window Function এর গতি বাড়ানোর সেই পরিবর্তন, যেটা
                  EXPLAIN এ Run Condition হিসেবে দেখা যায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-functions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Functions
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা, আর কোথায় Window Function বসানো যায় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-function-descriptions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Function Descriptions
                  </a>
                  : ROW_NUMBER, RANK, DENSE_RANK এর MySQL সংজ্ঞা, সমান মানের উদাহরণ সহ।
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
                  Window Function WHERE এর পরে চলে, তাই WHERE তার মান দেখে না। নম্বর দিন CTE তে, ছাঁকুন বাইরে। এই দুই ধাপ
                  লেসনের সব ছাঁচের ভিত্তি।
                </ListItem>
                <ListItem>
                  Top-N per Group: দল PARTITION BY তে, ক্রম OVER এর ORDER BY তে, N বাইরের WHERE এ। প্রতিযোগিতার বাইরের Row
                  বাদ দিন CTE এর ভেতরেই, নইলে তারা জায়গা দখল করে।
                </ListItem>
                <ListItem>
                  দাগের উপর সমান মান: ROW_NUMBER ঠিক N টা দেয়, অনন্য Tie-breaker সহ। RANK স্থান ভাগাভাগি করে আর পরের নম্বর এড়ায়।
                  DENSE_RANK আলাদা মান গোনে। Island Tours এ ৩ এর দাগে 14, 15 আর 15।
                </ListItem>
                <ListItem>
                  Top-1 এর তিন পথ: rn = 1, DISTINCT ON (শুধু PostgreSQL), আর LEFT JOIN LATERAL ... LIMIT 1, যেটা খালি দলও রাখে।
                  PostgreSQL 15 থেকে rn এর শর্ত জানালার ভেতরে Run Condition হয়ে যায়।
                </ListItem>
                <ListItem>
                  De-duplication আসলে Top-1 per Group। GROUP BY আর max() দিয়ে করলে আলাদা Row এর টুকরো মিলে কাল্পনিক Row হয়।
                  DELETE এর বেলায় একই CTE, rn &gt; 1।
                </ListItem>
                <ListItem>
                  Gaps and Islands: আগে DISTINCT, তারপর মান থেকে row_number বিয়োগ। টানা মানে বিয়োগফল একই, ফাঁক এলে বদলায়। মাসের
                  বেলায় আগে বছর গুণ 12 যোগ মাস। দ্বিতীয় পথ LAG দিয়ে শুরু চিহ্নিত করে চলমান যোগফল।
                </ListItem>
                <ListItem>
                  হারানো মান খুঁজতে generate_series দিয়ে পুরো তালিকা, তারপর NOT EXISTS। Island Tours এ April থেকে August খালি।
                </ListItem>
                <ListItem>
                  একই মানের ধারায় দুইটা row_number এর বিয়োগ, আর GROUP BY মান ও grp দুইটা দিয়ে। সবচেয়ে লম্বা confirmed ধারা
                  ছয়টা Booking, 8 থেকে 15।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউলে এখন পর্যন্ত প্রতিটা Report এর ফলাফল লম্বা, প্রতিটা তথ্য তার নিজের Row এ। কিন্তু মালিকের চোখে সবচেয়ে
                পরিচিত চেহারা একটা ছক: প্রতিটা মাস এক লাইনে, আর confirmed, pending, cancelled পাশাপাশি আলাদা Column এ। Row কে
                Column এ ঘোরানোর এই কাজের নাম Pivot, আর পরের লেসন{" "}
                <Link href="/sql/topic/pivoting" className={LINK}>
                  Pivoting Rows into Columns
                </Link>{" "}
                ঠিক এটা নিয়ে। সেখানেই পুরো Module 08 এর Recap।
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
      ["WHERE এ Window", "চলে না, Window খোলে WHERE এর পরে", "window functions are not allowed in WHERE"],
      ["দুই ধাপের ছাঁচ", "CTE তে নম্বর, বাইরে ছাঁকা বা দল", "লেসনের প্রায় সব Query"],
      ["Top-N per Group", "PARTITION BY দল, ORDER BY ক্রম, rn <= N", "প্রতি মাসের বড় তিনটা, ১৪টা Row"],
      ["শর্তের জায়গা", "প্রতিযোগিতার বাইরের Row CTE এর ভেতরে বাদ", "বাইরে বসালে ১৩টা Row"],
      ["Tie-breaker", "ROW_NUMBER এর ক্রম নিশ্চিত করে", "booking_id, তাই 16 থাকে, 17 বাদ"],
      ["RANK বনাম DENSE_RANK", "স্থান ভাগাভাগি, পরের নম্বর এড়ানো বনাম না এড়ানো", "৩ এর দাগে 14, 15, 15"],
      ["দ্বিতীয় সর্বোচ্চ", "DENSE_RANK = 2", "৫টা মাস, February বাদ"],
      ["Top-1 এর তিন পথ", "rn = 1, DISTINCT ON, LATERAL", "১৪, ১৪ আর ১৫টা Row (Imran সহ)"],
      ["Run Condition", "PostgreSQL 15 থেকে শর্ত জানালার ভেতরে", "row_number() OVER w1 <= 2"],
      ["De-duplication", "PARTITION BY lower(email), rn = 1", "৮টা Sign-up থেকে ৪ জন"],
      ["দ্বীপের কৌশল", "DISTINCT, তারপর মান থেকে row_number বিয়োগ", "১৭টা দ্বীপ, সবচেয়ে লম্বা ৫ দিন"],
      ["ফাঁক", "LEAD দিয়ে পরের দ্বীপের শুরু", "সবচেয়ে বড় ফাঁক ১৭৩ দিন"],
      ["হারানো মান", "generate_series আর NOT EXISTS", "April থেকে August, ৫টা মাস"],
      ["মাসের দ্বীপ", "বছর × 12 + মাস, তারপর একই বিয়োগ", "দুইটা মৌসুম, ৪ আর ২ মাস"],
      ["Streak", "দুইটা row_number এর বিয়োগ, GROUP BY মান ও grp", "১১টা ধারা, confirmed এর সবচেয়ে লম্বা ৬"],
      ["MySQL", "DISTINCT ON নেই, DATE_SUB, UNSIGNED বিয়োগে Error 1690", "একই ২৩টা Row, একই ৪টা দ্বীপ"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "WHERE row_number() OVER (PARTITION BY month ORDER BY total_bdt DESC) <= 3 লিখলে Error আসে কেন?",
        options: [
          {
            key: "A",
            text: "row_number() এর বন্ধনী খালি রাখা যায় না",
            isCorrect: false,
            explanation: "row_number() এর বন্ধনী সবসময় খালি থাকে, সেটা ঠিক আছে। সমস্যা Function এর জায়গায়।",
          },
          {
            key: "B",
            text: "WHERE চলে Window Function এর আগে, তখন নম্বরটা তৈরিই হয়নি",
            isCorrect: true,
            explanation: "ঠিক। যুক্তির ক্রমে FROM, WHERE, GROUP BY, HAVING এর পরে জানালা খোলে। তাই নম্বর দিন CTE তে, ছাঁকুন বাইরে।",
          },
          {
            key: "C",
            text: "PARTITION BY আর ORDER BY একসাথে লেখা যায় না",
            isCorrect: false,
            explanation: "একসাথেই লেখা হয়, এই লেসনের প্রায় প্রতিটা Query তে আছে।",
          },
          {
            key: "D",
            text: "শুধু MySQL এ Error আসে, PostgreSQL এ চলে",
            isCorrect: false,
            explanation: "দুই জায়গাতেই Error। PostgreSQL বলে window functions are not allowed in WHERE, MySQL দেয় Error 3593।",
          },
        ],
      },
      {
        id: 2,
        text: "October এর বাতিল নয় এমন Booking এ 16 আর 17 দুইটাই 36000.00, স্থান তৃতীয় ও চতুর্থ। RANK() <= 3 রাখলে কয়টা Row আসে?",
        options: [
          {
            key: "A",
            text: "৩টা, কারণ দাগটা ৩",
            isCorrect: false,
            explanation: "এটা ROW_NUMBER এর আচরণ। RANK সমান অঙ্কে একই স্থান দেয়।",
          },
          {
            key: "B",
            text: "৪টা: 14, 23, 16 আর 17",
            isCorrect: true,
            explanation: "ঠিক। 16 আর 17 দুইটাই স্থান 3 পায়, তাই দুজনেই টেকে। পরের Booking 19 পায় 5, বাদ।",
          },
          {
            key: "C",
            text: "৫টা, কারণ Booking 19 পায় 4",
            isCorrect: false,
            explanation: "Booking 19 কে 4 দেয় DENSE_RANK। RANK 4 নম্বরটা এড়িয়ে তাকে 5 দেয়।",
          },
          {
            key: "D",
            text: "২টা, সমান দুইটাই বাদ পড়ে",
            isCorrect: false,
            explanation: "কোনো Function সমান মানের জন্য Row বাদ দেয় না। হয় দুজনেই টেকে, নয় Tie-breaker দিয়ে একজন।",
          },
        ],
      },
      {
        id: 3,
        text: "প্রতিটা মাসের দ্বিতীয় সর্বোচ্চ আলাদা অঙ্ক চাই। কোন Function আর কোন শর্ত?",
        options: [
          {
            key: "A",
            text: "ROW_NUMBER, rn = 2",
            isCorrect: false,
            explanation: "সর্বোচ্চ অঙ্কে দুইটা Booking থাকলে rn 2 হবে সর্বোচ্চ অঙ্কেরই দ্বিতীয় Booking, দ্বিতীয় অঙ্ক না।",
          },
          {
            key: "B",
            text: "RANK, rk = 2",
            isCorrect: false,
            explanation: "সর্বোচ্চে দুজন সমান হলে RANK 2 নম্বরটা এড়িয়ে যায়, তখন rk = 2 এর কোনো Row থাকে না।",
          },
          {
            key: "C",
            text: "DENSE_RANK, drk = 2",
            isCorrect: true,
            explanation: "ঠিক। DENSE_RANK আলাদা অঙ্ক গোনে, ফাঁক রাখে না, তাই 2 মানেই দ্বিতীয় আলাদা অঙ্ক। Island Tours এ পাঁচটা মাস আসে।",
          },
          {
            key: "D",
            text: "max(total_bdt) - 1",
            isCorrect: false,
            explanation: "এটা সর্বোচ্চ থেকে এক টাকা কম একটা সংখ্যা, কোনো Booking এর অঙ্ক না।",
          },
        ],
      },
      {
        id: 4,
        text: "Top-3 per Month এ status <> 'cancelled' শর্তটা CTE এর ভেতর থেকে বাইরের WHERE এ সরালে কী হয়?",
        options: [
          {
            key: "A",
            text: "কিছু বদলায় না, শর্ত যেখানেই থাকুক",
            isCorrect: false,
            explanation: "বদলায়। নম্বর দেওয়ার সময় বাতিল Booking ও প্রতিযোগিতায় থাকে।",
          },
          {
            key: "B",
            text: "Error আসে",
            isCorrect: false,
            explanation: "কোনো Error নেই, আর এটাই বিপদ। ভুলটা চুপচাপ।",
          },
          {
            key: "C",
            text: "বাতিল Booking নম্বর দখল করে তারপর বাদ পড়ে, তাই কিছু মাসে তিনটার কম আসে: 14 এর বদলে 13",
            isCorrect: true,
            explanation: "ঠিক। January এ বাতিল Booking 12 নম্বর 3 নিয়েছিল, বাইরে বাদ পড়ল, আর Booking 7 জায়গা পেল না।",
          },
          {
            key: "D",
            text: "বাতিল Booking গুলোও ফলাফলে আসে",
            isCorrect: false,
            explanation: "বাইরের শর্ত তাদের বাদ দেয়। সমস্যা হলো তারা আগে অন্যের জায়গা নিয়ে নিয়েছিল।",
          },
        ],
      },
      {
        id: 5,
        text: "প্রতিটা Customer এর সবশেষ Booking চাই, আর যাঁর কোনো Booking নেই তিনিও তালিকায় থাকবেন। কোন পথ সরাসরি এটা দেয়?",
        options: [
          {
            key: "A",
            text: "bookings থেকে DISTINCT ON (customer_id)",
            isCorrect: false,
            explanation: "bookings এ Imran Kabir এর কোনো Row নেই, তাই তিনি আসেন না। চৌদ্দটা Row।",
          },
          {
            key: "B",
            text: "bookings থেকে ROW_NUMBER, তারপর rn = 1",
            isCorrect: false,
            explanation: "একই কারণে চৌদ্দটা Row। নম্বর শুধু বিদ্যমান Row পায়।",
          },
          {
            key: "C",
            text: "customers থেকে LEFT JOIN LATERAL (... ORDER BY booked_at DESC LIMIT 1) ON true",
            isCorrect: true,
            explanation: "ঠিক। শুরু customers থেকে, আর LEFT JOIN খালি ফলাফলেও Customer কে রাখে। পনেরোটা Row, Imran এর পাশে খালি।",
          },
          {
            key: "D",
            text: "bookings থেকে GROUP BY customer_id আর max(booking_id)",
            isCorrect: false,
            explanation: "Imran আসেন না। তাছাড়া সবচেয়ে বড় id মানেই সবশেষ Booking, এমন কোনো নিশ্চয়তা নেই: এই Data তেই Booking 3 Book হয়েছে Booking 4 আর 5 এর পরে।",
          },
        ],
      },
      {
        id: 6,
        text: "টানা দিনে day - row_number() এর মান কেন একই থাকে?",
        options: [
          {
            key: "A",
            text: "কারণ row_number() প্রতিটা দলে 1 থেকে শুরু হয়",
            isCorrect: false,
            explanation: "এই Query তে PARTITION BY নেই, নম্বর পুরো তালিকায় একবারই 1 থেকে শুরু হয়।",
          },
          {
            key: "B",
            text: "কারণ প্রতি Row এ তারিখ এক দিন বাড়ে, নম্বরও এক বাড়ে, তাই তফাত বদলায় না",
            isCorrect: true,
            explanation: "ঠিক। একটা দিন বাদ পড়লে তারিখ দুই দিন লাফায় কিন্তু নম্বর এক বাড়ে, তখন তফাত বদলায় আর নতুন দ্বীপ শুরু হয়।",
          },
          {
            key: "C",
            text: "কারণ বিয়োগফলটা দ্বীপের প্রথম দিন",
            isCorrect: false,
            explanation: "বিয়োগফল কোনো অর্থবহ দিন না। 10 থেকে 14 October এর দলের নাম 20 September, শুধু একটা লেবেল।",
          },
          {
            key: "D",
            text: "কারণ PostgreSQL টানা দিন নিজে চিনে নেয়",
            isCorrect: false,
            explanation: "Database টানা কথাটার কিছুই জানে না। পুরো কাজটা করে বিয়োগের গণিত।",
          },
        ],
      },
      {
        id: 7,
        text: "দ্বীপের Query তে প্রথম ধাপে DISTINCT booked_at::date কেন দরকার?",
        options: [
          {
            key: "A",
            text: "DISTINCT ছাড়া Window Function চলে না",
            isCorrect: false,
            explanation: "Window Function যেকোনো Row এ চলে। DISTINCT এর কাজ অন্য।",
          },
          {
            key: "B",
            text: "একই দিনে দুইটা Booking থাকলে নম্বর দুইবার বাড়ে কিন্তু তারিখ বাড়ে না, ফলে একটা দ্বীপ ভুল করে দুই ভাগ হয়",
            isCorrect: true,
            explanation: "ঠিক। এই Data তে প্রতিটা Booking আলাদা দিনে, তাই আজ উত্তর একই আসত, কিন্তু Query টা পরের দিনই ভাঙত।",
          },
          {
            key: "C",
            text: "সময়ের অংশ থাকলে GROUP BY চলে না",
            isCorrect: false,
            explanation: "সময় সহ GROUP BY চলে। ::date সময় ফেলে দেয়, আর DISTINCT একই দিনকে একবার রাখে, দুইটা আলাদা কাজ।",
          },
          {
            key: "D",
            text: "Row সংখ্যা কমিয়ে Query দ্রুত করতে",
            isCorrect: false,
            explanation: "দ্রুত হতে পারে, কিন্তু আসল কারণ সঠিকতা।",
          },
        ],
      },
      {
        id: 8,
        text: "Status এর ধারা খুঁজতে দুইটা row_number বিয়োগ করে grp পেলেন। GROUP BY grp না লিখে GROUP BY status, grp কেন?",
        options: [
          {
            key: "A",
            text: "status SELECT এ আছে বলে GROUP BY তেও লাগে, এর বেশি কিছু না",
            isCorrect: false,
            explanation: "SELECT এ না রাখলেও সমস্যাটা থাকে। আসল কারণ grp এর অনন্যতা।",
          },
          {
            key: "B",
            text: "grp শুধু একই status এর ভেতরে অনন্য, আলাদা status এর দুইটা ধারার grp এক হতে পারে",
            isCorrect: true,
            explanation: "ঠিক। Island Tours এ বাতিল Booking 12 আর confirmed 21 থেকে 23, দুইটারই grp 6। শুধু grp দিলে এগারোর বদলে দশটা দল।",
          },
          {
            key: "C",
            text: "PostgreSQL এর নিয়মে Window Function এর ফলাফলে একাধিক Column এ GROUP BY বাধ্যতামূলক",
            isCorrect: false,
            explanation: "এমন কোনো নিয়ম নেই। এটা সঠিক উত্তরের জন্য, Syntax এর জন্য না।",
          },
          {
            key: "D",
            text: "না দিলে Error আসে",
            isCorrect: false,
            explanation: "Error আসে না, আর এজন্যই ভুলটা বিপজ্জনক। ফলাফলে একটা মিশ্র দল চুপচাপ তৈরি হয়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর Analytics প্রশ্নের সমাধান",
    time: "৭৫ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>প্রতিটা Destination এর দামি দুইটা ট্যুর:</strong> একবার ROW_NUMBER দিয়ে, একবার RANK দিয়ে লিখুন। দুইটা
        ফলাফল পাশাপাশি রেখে দেখান কোথাও পার্থক্য আছে কি না, আর থাকলে কেন। না থাকলে লিখুন, Data তে কী থাকলে পার্থক্য
        দেখা দিত।
      </span>,
      <span key="2">
        <strong>সবশেষ Booking, তিন পথে:</strong> প্রতিটা Customer এর সবশেষ confirmed Booking তিনটা পথে বের করুন: rn = 1,
        DISTINCT ON আর LEFT JOIN LATERAL। তিনটা ফলাফলের Row সংখ্যা লিখুন, আর কোন Customer কোথায় আসেন বা আসেন না, প্রতিটার
        কারণ এক লাইনে।
      </span>,
      <span key="3">
        <strong>ফোন নম্বরের De-duplication:</strong> VALUES দিয়ে দশটা Row এর একটা তালিকা বানান, যেখানে একই ফোন নম্বর কয়েক
        রকমে লেখা, যেমন ফাঁকা জায়গা সহ আর ছাড়া। replace দিয়ে নম্বরগুলো এক রকম করে প্রতিটা নম্বরের সবচেয়ে নতুন Row রাখুন।
        তারপর একই কাজ GROUP BY আর max দিয়ে করে দেখান কোথায় কাল্পনিক Row তৈরি হয়।
      </span>,
      <span key="4">
        <strong>Departure এর দ্বীপ আর ফাঁক:</strong> departures এর starts_on তারিখগুলোতে টানা দিনের দ্বীপ খুঁজুন, আর তারপর
        প্রথম আর শেষ Departure এর মাঝের যে মাসগুলোতে একটাও Departure নেই, সেগুলোর তালিকা দিন। শুরু আর শেষের মাস হাতে লিখবেন
        না।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একটা ক্লাসের টানা উপস্থিতির উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান, তারিখ
        থেকে Row Number বিয়োগ করলে কেন টানা দিনগুলোর একই উত্তর আসে, আর আগে DISTINCT না দিলে কী ভাঙে।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুইটা Query, পাশাপাশি ফলাফল আর পার্থক্যের ব্যাখ্যা</span>,
      <span key="d2">তিন পথের তিনটা Query, Row সংখ্যা আর প্রতিটা পার্থক্যের কারণ</span>,
      <span key="d3">VALUES এর তালিকা, ঠিক Query, আর GROUP BY এর ভুল ফলাফলের উদাহরণ</span>,
      <span key="d4">দ্বীপের Query, খালি মাসের Query আর দুইটার ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Top-N, Gaps and Islands",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Top-N আর শর্তের জায়গা",
        description:
          "প্রথম ফাইলের প্রথম লাইনে Time Zone ঠিক করুন, তারপর দুইটা Query চালান। শর্ত CTE এর ভেতরে থাকলে ১৪টা Row, বাইরে থাকলে ১৩টা। January তে কোন Booking হারাল, খুঁজে বের করুন।",
      },
      {
        title: "দাগের উপর সমান মান",
        description:
          "দ্বিতীয় ফাইলে তিনটা Function এর গোনা, 14, 15 আর 15, তারপর October এর নয়টা Row। Booking 16, 17, 19 এর তিনটা নম্বর মিলিয়ে নিন।",
      },
      {
        title: "Top-1 এর পথ",
        description:
          "তৃতীয় ফাইলে DISTINCT ON এর ১৪টা Row আর LEFT JOIN LATERAL এর ১৫টা। Imran Kabir এর Row টা খুঁজে নিন, আর দুইটা ফলাফলের booking_id মিলিয়ে দেখুন।",
      },
      {
        title: "De-duplication",
        description:
          "চতুর্থ ফাইলে আটটা Sign-up থেকে চারজন। তারপর ORDER BY থেকে DESC বাদ দিয়ে আবার চালান, প্রতিজনের প্রথম চ্যানেল দেখুন।",
      },
      {
        title: "দ্বীপ আর লম্বা দ্বীপ",
        description:
          "পঞ্চম ফাইলে সতেরোটা দ্বীপ, তারপর HAVING দিয়ে চারটা। নিজের একটা পরীক্ষা যোগ করুন: DISTINCT সরিয়ে দিন, উত্তর বদলায় কি না দেখুন, আর কেন বদলায় না তা লিখুন।",
      },
      {
        title: "হারানো মাস আর Status এর ধারা",
        description:
          "ষষ্ঠ ফাইলে খালি পাঁচটা মাস আর এগারোটা ধারা। তারপর GROUP BY থেকে status সরিয়ে আবার চালান, দশটা Row আর grp 6 এর মিশ্র দলটা খুঁজে নিন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-top-n.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

WITH ranked AS (
  SELECT booking_id, to_char(booked_at, 'YYYY-MM') AS month, total_bdt,
         row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
  WHERE status <> 'cancelled'
)
SELECT month, rn, booking_id, total_bdt
FROM ranked
WHERE rn <= 3
ORDER BY month, rn;
-- (14 rows)

WITH ranked AS (
  SELECT booking_id, status, to_char(booked_at, 'YYYY-MM') AS month, total_bdt,
         row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn
  FROM bookings
)
SELECT month, rn, booking_id, total_bdt
FROM ranked
WHERE rn <= 3 AND status <> 'cancelled'
ORDER BY month, rn;
-- (13 rows): January এ শুধু 6 আর 4`,
      },
      {
        language: "sql",
        filename: "02-ties.sql",
        code: `WITH ranked AS (
  SELECT row_number() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC, booking_id) AS rn,
         rank()       OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC) AS rk,
         dense_rank() OVER (PARTITION BY to_char(booked_at, 'YYYY-MM')
                            ORDER BY total_bdt DESC) AS drk
  FROM bookings
  WHERE status <> 'cancelled'
)
SELECT count(*) FILTER (WHERE rn <= 3)  AS by_row_number,
       count(*) FILTER (WHERE rk <= 3)  AS by_rank,
       count(*) FILTER (WHERE drk <= 3) AS by_dense_rank
FROM ranked;
-- 14 | 15 | 15

SELECT booking_id, total_bdt,
       row_number() OVER (ORDER BY total_bdt DESC, booking_id) AS rn,
       rank()       OVER w AS rk,
       dense_rank() OVER w AS drk
FROM bookings
WHERE status <> 'cancelled'
  AND booked_at >= '2026-10-01' AND booked_at < '2026-11-01'
WINDOW w AS (ORDER BY total_bdt DESC)
ORDER BY total_bdt DESC, booking_id;
-- (9 rows): 16 এ 3/3/3, 17 এ 4/3/3, 19 এ 5/5/4`,
      },
      {
        language: "sql",
        filename: "03-top-one.sql",
        code: `SELECT DISTINCT ON (customer_id)
       customer_id, booking_id, booked_at
FROM bookings
ORDER BY customer_id, booked_at DESC, booking_id DESC;
-- (14 rows), customer 1 এর Booking 17

SELECT c.customer_id, c.full_name, nb.booking_id, nb.booked_at
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC, b.booking_id DESC
  LIMIT 1
) nb ON true
ORDER BY c.customer_id;
-- (15 rows), Imran Kabir এর পাশে খালি`,
      },
      {
        language: "sql",
        filename: "04-dedup.sql",
        code: `WITH ${SIGNUPS},
ranked AS (
  SELECT lower(email) AS email, signed_up_at, source,
         row_number() OVER (PARTITION BY lower(email)
                            ORDER BY signed_up_at DESC) AS rn
  FROM signups
)
SELECT email, source, signed_up_at
FROM ranked
WHERE rn = 1
ORDER BY signed_up_at DESC;
-- (4 rows): lamia facebook, nusrat instagram, rahim facebook, shuvo website`,
      },
      {
        language: "sql",
        filename: "05-islands.sql",
        code: `WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
)
SELECT min(day) AS first_day, max(day) AS last_day, count(*) AS days
FROM grouped
GROUP BY grp
ORDER BY first_day;
-- (17 rows)

WITH days AS (
  SELECT DISTINCT booked_at::date AS day
  FROM bookings
),
grouped AS (
  SELECT day,
         day - (row_number() OVER (ORDER BY day))::int AS grp
  FROM days
)
SELECT min(day) AS first_day, max(day) AS last_day, count(*) AS days
FROM grouped
GROUP BY grp
HAVING count(*) >= 2
ORDER BY days DESC, first_day;
-- (4 rows): 2026-10-10 থেকে 10-14 (5), তারপর তিনটা দুই দিনের`,
      },
      {
        language: "sql",
        filename: "06-gaps-streaks.sql",
        code: `SELECT g.m::date AS missing_month
FROM generate_series(
       (SELECT date_trunc('month', min(booked_at)) FROM bookings),
       (SELECT date_trunc('month', max(booked_at)) FROM bookings),
       interval '1 month') AS g(m)
WHERE NOT EXISTS (
  SELECT 1 FROM bookings b
  WHERE date_trunc('month', b.booked_at) = g.m
)
ORDER BY missing_month;
-- (5 rows): 2026-04-01 থেকে 2026-08-01

WITH ordered AS (
  SELECT booking_id, booked_at, status,
         row_number() OVER (ORDER BY booked_at)
       - row_number() OVER (PARTITION BY status ORDER BY booked_at) AS grp
  FROM bookings
)
SELECT status, min(booked_at)::date AS run_from,
       max(booked_at)::date AS run_to, count(*) AS bookings
FROM ordered
GROUP BY status, grp
ORDER BY run_from;
-- (11 rows), সবচেয়ে লম্বা confirmed 6`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রথম লাইনের SET TimeZone টা বাদ দেবেন না। booked_at::date আর to_char এর মাস নির্ভর করে Session এর Time Zone এর উপর।
        Island Tours এর সব Booking সকাল ছয়টার পরে, তাই UTC তেও তারিখগুলো একই আসবে, কিন্তু অন্য কোনো Time Zone এ দিন সরে যেতে
        পারে, আর তার সাথে দ্বীপগুলোও। দ্বীপের প্রশ্নে সবসময় আগে ঠিক করুন, কার দিন গোনা হচ্ছে।
      </ContentParagraph>
    ),
  },
};
