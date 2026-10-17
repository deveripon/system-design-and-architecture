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
  DateTruncLab,
  MonthMathLab,
  TimeZoneLab,
} from "../../../components/course/topics/functions/time-animations";
import {
  AtTimeZoneSplit,
  DateMathSplit,
  InstantDisplayDiagram,
  MidnightBoundaryDiagram,
  TimeValuesDiagram,
  TruncateDiagram,
} from "../../../components/course/topics/functions/time-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const dateTimeFunctionsContent: TopicData = {
  id: "date-time-functions",
  introduction: {
    badge: "MODULE 04 · LESSON 03",
    title: <SectionTitle>সময়ের হিসাব: তারিখ, ঘড়ি আর Time Zone</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে আপনি লেখা আর সংখ্যাকে নিজের মতো করে সাজাতে শিখেছেন। এবার
          Database এর সবচেয়ে চালাক আর সবচেয়ে ভুল বোঝা মানগুলোর পালা: সময়। Island Tours
          এর প্রায় প্রতিটা প্রশ্নে সময় আছে। Departure কবে, আজ থেকে আর কত দিন বাকি, এই মাসে
          কতগুলো Booking হলো, Refund এর সময় কবে শেষ, London এর Customer কে তাঁর নিজের ঘড়িতে
          সময়টা কীভাবে দেখাবেন।
        </ContentParagraph>
        <ContentParagraph>
          সময়ের হিসাব দেখতে সহজ, কিন্তু এখানে ভুলগুলো চুপচাপ হয়। একটা Booking এক দিন আগের
          তারিখে গোনা হয়ে যায়, এক মাস যোগ করলে ৩১ তারিখ ২৮ হয়ে যায়, আর একই Query আজ এক
          উত্তর দেয়, কাল আরেক। কোনো Error আসে না, শুধু Report টা ভুল হয়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি শিখবেন সময়ের পাঁচ রকম মান, এখন কয়টা বাজে সেটা Database কে জিজ্ঞেস
          করা, তারিখে দিন যোগ বিয়োগ, interval, date_trunc, extract, age, to_char, আর সবচেয়ে
          জরুরি অংশ: timestamptz আসলে কী রাখে, Time Zone কীভাবে কাজ করে, আর Dhaka আর UTC এর
          হিসাব যেন কখনো গুলিয়ে না যায় তার নিয়ম।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি একটাই মুহূর্ত। Dhaka আমাকে পড়ে সকাল দশটা পনেরো, London পড়ে ভোর চারটা পনেরো। আমি বদলাই না, বদলায় শুধু যে ঘড়িতে আমাকে পড়া হয়।",
      author: "timestamptz",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>London থেকে একটা Email</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক সকালে Island Tours এর Support এ একটা Email এল London থেকে। লিখেছেন Oliver
                Bennett: আমি জানুয়ারির ৩০ তারিখ সকালে নাশতার টেবিলে বসে Booking করেছিলাম। অথচ
                আপনাদের Confirmation Email বলছে Booking এর সময় বিকেল সাড়ে তিনটা। আপনাদের সিস্টেম
                কি ঠিকমতো কাজ করছে?
              </ContentParagraph>
              <ContentParagraph>
                Developer নাদিয়া Database খুলে দেখলেন। Booking এর সময় লেখা আছে ৩০ জানুয়ারি
                বিকেল ৩টা ৩০, শেষে +06। নাদিয়া জানেন +06 মানে Dhaka র ঘড়ি। Oliver সকাল সাড়ে নয়টায়
                London এ বসে যখন বোতাম চেপেছেন, Dhaka তে তখন বিকেল সাড়ে তিনটা। দুজনেই ঠিক।
                সময়টা একটাই, শুধু দুই দেশের ঘড়ি দুই রকম কথা বলছে।
              </ContentParagraph>
              <ContentParagraph>
                একই সপ্তাহে Manager আরও তিনটা প্রশ্ন পাঠালেন। প্রতিটা Departure শুরু হতে আর কত
                দিন বাকি? অক্টোবর মাসে কতগুলো Booking হয়েছে? প্রতিটা Payment এর পর সাত দিনের
                Refund সময় কবে শেষ? তিনটা প্রশ্নেই সময় আছে, আর তিনটাতেই একটা করে ফাঁদ লুকিয়ে
                আছে। নিচের বক্সে Oliver এর Booking টা দুইভাবে দেখুন। SQL এর নতুন অংশটা এখনই না
                বুঝলেও চলবে, এই লেসনের শেষে পুরোটা পরিষ্কার হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Oliver এর Booking, দুই দেশের ঘড়িতে"
              query={`SELECT booking_id,
       booked_at,
       booked_at AT TIME ZONE 'Europe/London' AS london_time
FROM bookings
WHERE customer_id = 11
ORDER BY booked_at;`}
              caption="দুটো Row আসবে। Booking 12 এর booked_at দেখাবে 2026-01-30 15:30:00+06, আর london_time দেখাবে 2026-01-30 09:30:00। মুহূর্ত একটাই, শুধু পড়া হয়েছে দুটো আলাদা ঘড়িতে। Booking 19 এ পার্থক্য ছয় না, পাঁচ ঘণ্টা। কেন, সেটা সেকশন ১১ তে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই লেসনে আজ মানে 1 November 2026",
          content: (
            <ContentParagraph>
              এখন কয়টা বাজে, সেটা প্রতিদিন বদলায়। তাই now() বা current_date দিয়ে লেখা Query আজ
              এক উত্তর দেয়, কাল আরেক। উদাহরণ আর Exercise যাতে সবসময় একই উত্তর দেয়, সেজন্য এই
                লেসনে আমরা ধরে নেব আজ 1 November 2026, আর আজকের তারিখ লিখব এভাবে:{" "}
              <code className={CODE}>{"DATE '2026-11-01'"}</code>। বাস্তবের Query তে এই জায়গায়
              current_date বসবে। সেকশন ৩ এ দেখবেন কেন এই অভ্যাসটা কাজের জায়গাতেও ভালো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "time-values",
      subHeader: { index: "002", title: "Time Values" },
      title: <SectionTitle>সময়ের পাঁচ রকম মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সংখ্যার যেমন আলাদা ধরন আছে, পূর্ণ সংখ্যা আর দশমিক, সময়েরও তেমন আলাদা ধরন আছে।
                প্রতিটা ধরন আলাদা প্রশ্নের উত্তর দেয়। একটা দেয়াল ক্যালেন্ডারের পাতা ভাবুন: সেখানে
                শুধু তারিখ, ঘড়ির সময় নেই। একটা ট্রেনের সময়সূচি ভাবুন: সেখানে শুধু ঘড়ির সময়,
                কোন দিন সেটা লেখা নেই। আর একটা বিমানের টিকিট ভাবুন: সেখানে তারিখ, সময় আর কোন
                দেশের ঘড়ি, তিনটাই আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>date</strong>: শুধু তারিখ, যেমন 2026-11-20। Island Tours এ
                  departures.starts_on, guides.hired_on।
                </ListItem>
                <ListItem>
                  <strong>time</strong>: শুধু ঘড়ির সময়, যেমন 09:30:00। কোন দিনের, সেটা বলে না।
                </ListItem>
                <ListItem>
                  <strong>timestamp</strong>: তারিখ আর সময় একসাথে, কিন্তু কোন দেশের ঘড়ি, সেটা বলা
                  নেই। দেয়ালের ঘড়ির একটা লেখা মাত্র।
                </ListItem>
                <ListItem>
                  <strong>timestamptz</strong>: পৃথিবীর একটা নির্দিষ্ট মুহূর্ত। পুরো নাম timestamp
                  with time zone। Island Tours এর booked_at, paid_at, joined_at, created_at সব এই
                  ধরনের।
                </ListItem>
                <ListItem>
                  <strong>interval</strong>: সময়ের একটা দৈর্ঘ্য, যেমন 3 days বা 2 hours 30
                  minutes। কখন না, কতক্ষণ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeValuesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query এর ভেতরে একটা নির্দিষ্ট সময় লিখতে চাইলে লেখাটার আগে ধরনের নাম বসান। শুধু{" "}
              <code className={CODE}>{"'2026-11-01'"}</code> লিখলে PostgreSQL প্রথমে এটাকে
              একটা লেখা ভাবে। আগে <code className={CODE}>DATE</code> বসালে পরিষ্কার হয়ে যায়
              যে এটা একটা তারিখ। <code className={CODE}>pg_typeof()</code> নামের Function যেকোনো
              মানের ধরন বলে দেয়, তাই নিচের বক্সে প্রতিটা মানের পাশে তার ধরনটাও দেখতে পাবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাঁচ রকম মান আর তাদের ধরন"
              query={`SELECT DATE '2026-11-01'              AS d,
       TIME '09:30'                    AS t,
       TIMESTAMP '2026-11-01 09:30'    AS ts,
       TIMESTAMPTZ '2026-11-01 09:30+06' AS tstz,
       INTERVAL '3 days 4 hours'       AS iv;

SELECT pg_typeof(DATE '2026-11-01')               AS a,
       pg_typeof(TIMESTAMPTZ '2026-11-01 09:30+06') AS b,
       pg_typeof(INTERVAL '3 days')               AS c;`}
              caption="প্রথম Query তে পাঁচটা মান। খেয়াল করুন শুধু tstz এর শেষে +06 আছে, আর interval লেখা হয়েছে 3 days 04:00:00 হিসেবে। দ্বিতীয় Query তে ধরনের পুরো নাম: date, timestamp with time zone, interval।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর Column গুলো কোন ধরনের"
              query={`SELECT booking_id, booked_at, pg_typeof(booked_at)
FROM bookings
WHERE booking_id = 1;

SELECT departure_id, starts_on, pg_typeof(starts_on)
FROM departures
WHERE departure_id = 8;`}
              caption="booked_at একটা timestamp with time zone, আর starts_on একটা date। Booking একটা মুহূর্তে ঘটে, তাই মুহূর্ত রাখা হয়েছে। Departure একটা দিনে শুরু হয়, তাই শুধু তারিখ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Column এর ধরন বাছাই পরে আসবে",
          content: (
            <ContentParagraph>
              এই লেসন সময়ের মান নিয়ে কাজ করা শেখায়। নতুন Table বানানোর সময় কোন Column এ কোন
              ধরন দেবেন, আর কেন প্রায় সবসময় timestamptz, সেই সিদ্ধান্ত Module 09 এর{" "}
              <Link href="/sql/topic/date-time-types" className={LINK}>
                Date and Time Types
              </Link>{" "}
              লেসনে। এখানে শুধু মনে রাখুন: Island Tours এর ঘটনার সময়গুলো timestamptz, আর দিনের
              হিসাবগুলো date।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "right-now",
      subHeader: { index: "003", title: "Right Now" },
      title: <SectionTitle>এখন কয়টা বাজে, আর সেটা কেন বদলায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database কে এখনকার সময় জিজ্ঞেস করার কয়েকটা উপায় আছে। সবচেয়ে বেশি ব্যবহার হয়
                এগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>now()</code> আর{" "}
                  <code className={CODE}>current_timestamp</code>: এখনকার মুহূর্ত, একটা
                  timestamptz। দুটো একই জিনিস, শুধু নাম আলাদা।
                </ListItem>
                <ListItem>
                  <code className={CODE}>current_date</code>: আজকের তারিখ, একটা date। কোন দিন
                  আজ, সেটা ঠিক হয় Session এর Time Zone দেখে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>clock_timestamp()</code>: দেয়ালের আসল ঘড়ি, যেটা Query
                  চলার মাঝখানেও এগোতে থাকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রথম তিনটার একটা অদ্ভুত কিন্তু খুব কাজের স্বভাব আছে। PostgreSQL এর Docs বলে, এরা
                Transaction শুরুর সময়টা ফেরত দেয়। Transaction এর পুরো ব্যাখ্যা Module 12 তে।
                এখন শুধু এটুকু ধরুন: কয়েকটা Statement কে BEGIN আর COMMIT এর মাঝে রাখলে তারা একটা
                দল হয়ে যায়। সেই দলের ভেতরে now() যতবার ডাকুন, একই উত্তর আসবে। যেন দলটা শুরু হওয়ার
                মুহূর্তে কেউ একটা ছবি তুলে রেখেছে, আর পরে সবাই সেই ছবি দেখেই সময় বলছে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Transaction এর ভেতরে দেড় সেকেন্ড অপেক্ষা করানো হয়েছে। চালিয়ে মিলিয়ে
                দেখুন: start_now আর later_now হুবহু এক, কিন্তু later_clock প্রায় দেড় সেকেন্ড
                এগিয়ে গেছে। আসল সময়গুলো আপনি যখন চালাবেন তখনকার, তাই এখানে লিখে দেওয়া গেল না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="now() থেমে থাকে, clock_timestamp() চলে"
              query={`BEGIN;
SELECT now() AS start_now, clock_timestamp() AS start_clock;
SELECT pg_sleep(1.5);
SELECT now() AS later_now,
       clock_timestamp() AS later_clock,
       now() = clock_timestamp() AS same;
COMMIT;`}
              caption="শেষ Query তে same Column এ f আসবে, কারণ now() Transaction শুরুর মুহূর্তে আটকে আছে আর clock_timestamp() দেড় সেকেন্ড এগিয়ে গেছে। চালানোর সময় অনুযায়ী আসল সময়গুলো প্রতিবার আলাদা হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই আটকে থাকা কেন ভালো? ধরুন একটা Booking এর সাথে একই Transaction এ একটা Payment
                Row আর একটা Log Row লেখা হচ্ছে। তিনটাতেই now() বসানো থাকলে তিনটার সময় হুবহু এক
                হবে। পরে কেউ জানতে চাইলে বলা যাবে, এই তিনটা ঘটনা একসাথে ঘটেছে। clock_timestamp()
                দিলে তিনটার সময় কয়েক মাইক্রোসেকেন্ড করে আলাদা হতো।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা কথা, যেটা শুরুতে বলেছিলাম। এই Function গুলোর উত্তর প্রতিদিন বদলায়, তাই
                এরা দিয়ে লেখা Report আজ এক সংখ্যা দেয়, পরের সপ্তাহে আরেক। কাজের জায়গায় তাই একটা
                ভালো অভ্যাস: Report এর তারিখ Query এর ভেতরে now() দিয়ে না বানিয়ে বাইরে থেকে পাঠানো,
                যেমন আমরা এই লেসনে <code className={CODE}>{"DATE '2026-11-01'"}</code> লিখছি।
                তাহলে গত মাসের Report আবার চালালে হুবহু একই উত্তর আসে। কিছু জিনিস অবশ্য সবসময়
                সত্যি, যেগুলো নিচে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যেটা প্রতিদিন একই উত্তর দেয়"
              query={`SELECT now() = current_timestamp      AS same_word,
       current_date = now()::date      AS today_match;`}
              caption="দুটোতেই t আসবে, আজ, কাল, যেকোনো দিন। now() আর current_timestamp একই জিনিস, আর এখনকার মুহূর্তের তারিখ অংশটাই current_date।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "date-arithmetic",
      subHeader: { index: "004", title: "Date Arithmetic" },
      title: <SectionTitle>তারিখে যোগ বিয়োগ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তারিখের সাথে যোগ বিয়োগ করা যায়, ঠিক সংখ্যার মতো। কিন্তু উত্তরের ধরন নির্ভর করে
                আপনি কোন দুটো জিনিস নিয়ে কাজ করছেন তার উপর। চারটা নিয়ম মনে রাখলেই হবে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>date + সংখ্যা</strong> = date। সংখ্যাটা দিনের হিসাব। 1 November এর সাথে
                  7 যোগ করলে 8 November।
                </ListItem>
                <ListItem>
                  <strong>date − date</strong> = সংখ্যা (integer)। দুটো তারিখের মাঝে কত দিন।
                </ListItem>
                <ListItem>
                  <strong>date + interval</strong> = timestamp। তারিখের সাথে ঘড়ির সময় যুক্ত হয়ে
                  যায়, মাঝরাত 00:00:00।
                </ListItem>
                <ListItem>
                  <strong>timestamptz − timestamptz</strong> = interval। দুটো মুহূর্তের মাঝে দিন,
                  ঘণ্টা আর মিনিট মিলিয়ে কতক্ষণ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DateMathSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা নিয়ম, চারটা উত্তর"
              query={`SELECT DATE '2026-11-01' + 7                    AS plus7,
       DATE '2026-11-20' - DATE '2026-11-01'   AS days_between;

SELECT DATE '2026-11-01' + INTERVAL '3 days'   AS d_plus_iv,
       pg_typeof(DATE '2026-11-01' + INTERVAL '3 days') AS t;

SELECT TIMESTAMPTZ '2026-11-20 09:00+06'
     - TIMESTAMPTZ '2026-11-01 18:30+06'       AS gap;`}
              caption="প্রথম Query দেবে 2026-11-08 আর 19। দ্বিতীয়টা দেবে 2026-11-04 00:00:00, ধরন timestamp without time zone, অর্থাৎ তারিখটা ঘড়িসহ একটা মান হয়ে গেছে। তৃতীয়টা দেবে 18 days 14:30:00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Manager এর প্রথম প্রশ্ন: প্রতিটা Departure শুরু হতে আর কত দিন বাকি? আজ 1
                November 2026, তাই উত্তরটা সহজ বিয়োগ:{" "}
                <code className={CODE}>{"starts_on - DATE '2026-11-01'"}</code>। আর শুধু সামনের ৩০
                দিনের Departure চাইলে শর্তে একই যোগ ব্যবহার করুন:{" "}
                <code className={CODE}>{"DATE '2026-11-01' + 30"}</code>। BETWEEN এর দুই প্রান্তই
                ধরা হয়, সেটা আপনি Module 03 এর{" "}
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  IN, BETWEEN, LIKE
                </Link>{" "}
                লেসনে দেখেছেন। এখানে দুটোই date, তাই কোনো ঘড়ির ফাঁদ নেই।
              </ContentParagraph>
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
                  ধরে নিন আজ 1 November 2026। আজ থেকে ৩০ দিনের মধ্যে (আজ আর ৩০ তম দিন দুটোই
                  ধরে) যেসব Departure শুরু হবে, তাদের <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>starts_on</code> আর আজ থেকে কত দিন বাকি সেই সংখ্যা,{" "}
                  <code className={CODE}>days_away</code> নামে। সবচেয়ে কাছেরটা আগে।
                </>
              }
              hint={
                <>
                  দিনের সংখ্যা মানে date থেকে date বিয়োগ। সীমা লিখুন{" "}
                  <code className={CODE}>{"BETWEEN DATE '2026-11-01' AND DATE '2026-11-01' + 30"}</code>{" "}
                  দিয়ে, তারপর starts_on অনুযায়ী সাজান।
                </>
              }
              solution={`SELECT departure_id,
       starts_on,
       starts_on - DATE '2026-11-01' AS days_away
FROM departures
WHERE starts_on BETWEEN DATE '2026-11-01' AND DATE '2026-11-01' + 30
ORDER BY starts_on;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ তারিখ বিয়োগ একটা ফাঁদ",
          content: (
            <ContentParagraph>
              MySQL এ <code className={CODE}>{"DATE '2026-11-20' - DATE '2026-11-01'"}</code>{" "}
              দেয় 19, ঠিক মনে হয়। কিন্তু{" "}
              <code className={CODE}>{"DATE '2026-12-01' - DATE '2026-11-30'"}</code> দেয় 71, এক
              না। MySQL তারিখ দুটোকে 20261201 আর 20261130 এর মতো সংখ্যা বানিয়ে বিয়োগ করে। MySQL 8.4
              এ দুটোই চালিয়ে দেখা হয়েছে। সেখানে দিনের পার্থক্যের জন্য সবসময়{" "}
              <code className={CODE}>DATEDIFF()</code> ব্যবহার করুন। বিস্তারিত সেকশন ১৩ তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "intervals",
      subHeader: { index: "005", title: "Intervals and Series" },
      title: <SectionTitle>interval: সময়ের দৈর্ঘ্য, আর মাসের ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                interval হলো একটা ফিতার মতো। ফিতার দৈর্ঘ্য আছে, কিন্তু সেটা কোন দেয়ালে লাগানো,
                সেটা বলে না। লেখা যায় সহজ ইংরেজিতে:{" "}
                <code className={CODE}>{"INTERVAL '3 days'"}</code>,{" "}
                <code className={CODE}>{"INTERVAL '2 hours 30 minutes'"}</code>,{" "}
                <code className={CODE}>{"INTERVAL '1 month'"}</code>। interval এর সাথে interval
                যোগ করা যায়, সংখ্যা দিয়ে গুণ করা যায়, আর একটা মুহূর্তের সাথে যোগ করলে নতুন
                মুহূর্ত পাওয়া যায়।
              </ContentParagraph>
              <ContentParagraph>
                অংশ অংশ করে interval বানাতে চাইলে <code className={CODE}>make_interval()</code>,
                আর বছর, মাস, দিন আলাদা করে দিয়ে তারিখ বানাতে চাইলে{" "}
                <code className={CODE}>make_date()</code>। দুটোই কাজে আসে যখন সংখ্যাগুলো অন্য
                Column থেকে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="interval এর অঙ্ক"
              query={`SELECT INTERVAL '2 hours 30 minutes' * 3   AS times3,
       INTERVAL '1 day' - INTERVAL '1 hour'   AS d_minus_h,
       INTERVAL '36 hours'                    AS h36,
       justify_hours(INTERVAL '36 hours')     AS justified;

SELECT make_interval(days => 3, hours => 4) AS mi,
       make_interval(mins => 90)             AS m90,
       make_date(2026, 11, 1)                AS md;`}
              caption="times3 আসবে 07:30:00, d_minus_h আসবে 1 day -01:00:00, h36 থাকবে 36:00:00 আর justified সেটাকে সাজিয়ে দেবে 1 day 12:00:00। দ্বিতীয় Query তে 3 days 04:00:00, 01:30:00 আর 2026-11-01।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সবচেয়ে চেনা ফাঁদ। এক মাস মানে কত দিন? জানুয়ারিতে ৩১, ফেব্রুয়ারিতে ২৮, এপ্রিলে
                ৩০। তাই <code className={CODE}>{"INTERVAL '1 month'"}</code> কোনো নির্দিষ্ট দিনের
                সংখ্যা না। PostgreSQL মাসের ঘরটা এক এগিয়ে দেয়, আর সেই মাসে যদি একই তারিখ না থাকে,
                তাহলে মাসের শেষ দিনে থামে। এর ফলে কিছু উত্তর অবাক করে। নিচের Lab এ আগে নিজে আন্দাজ
                করুন, তারপর উত্তর দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MonthMathLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Lab এর উত্তরগুলো নিজে যাচাই করুন"
              query={`SELECT DATE '2026-01-31' + INTERVAL '1 month'                         AS jan31_plus_month,
       DATE '2026-01-31' + INTERVAL '1 month' + INTERVAL '1 month'  AS two_steps,
       DATE '2026-01-31' + INTERVAL '2 months'                        AS one_step,
       DATE '2026-01-31' + 30                                         AS plus_30_days;`}
              caption="উত্তর আসবে 2026-02-28 00:00:00, 2026-03-28 00:00:00, 2026-03-31 00:00:00 আর 2026-03-02। একই দুই মাস দুইভাবে যোগ করে দুই উত্তর, আর এক মাস আর ৩০ দিন এক জিনিস না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                interval এর আরেকটা চমৎকার ব্যবহার আছে: <code className={CODE}>generate_series()</code>।
                এটা একটা শুরু, একটা শেষ আর একটা ধাপ নেয়, আর মাঝের প্রতিটা মানের জন্য একটা করে Row
                বানিয়ে দেয়। ধাপ হিসেবে interval দিলে পাওয়া যায় একটা ক্যালেন্ডার। Island Tours এর
                Dashboard এ সামনের সাত দিনের একটা তালিকা দরকার হলে এভাবেই বানানো যায়, Table এ কোনো
                Row না থাকলেও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সামনের সাত দিনের ক্যালেন্ডার"
              query={`SELECT d::date              AS day,
       to_char(d, 'FMDay')  AS weekday
FROM generate_series(DATE '2026-11-01',
                     DATE '2026-11-07',
                     INTERVAL '1 day') AS d;`}
              caption="সাতটা Row: 2026-11-01 Sunday থেকে 2026-11-07 Saturday পর্যন্ত। ::date দিয়ে প্রতিটা মানকে আবার তারিখে ফেরানো হয়েছে, কারণ interval যোগে ঘড়ির অংশ চলে এসেছিল। to_char এর কথা সেকশন ৯ এ।"
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
                  Island Tours টাকা দেওয়ার পর ঠিক সাত দিন পর্যন্ত Refund দেয়। যেসব Payment এর{" "}
                  <code className={CODE}>status</code> হলো <code className={CODE}>paid</code>,
                  তাদের <code className={CODE}>payment_id</code> আর Refund এর শেষ মুহূর্ত,{" "}
                  <code className={CODE}>refund_until</code> নামে: paid_at এর ঠিক সাত দিন পরের
                  মুহূর্ত। payment_id অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  মুহূর্তের সাথে দৈর্ঘ্য যোগ:{" "}
                  <code className={CODE}>{"paid_at + INTERVAL '7 days'"}</code>। ফলাফলে ১৭টা Row
                  আসার কথা।
                </>
              }
              solution={`SELECT payment_id,
       paid_at + INTERVAL '7 days' AS refund_until
FROM payments
WHERE status = 'paid'
ORDER BY payment_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "date-trunc",
      subHeader: { index: "006", title: "date_trunc" },
      title: <SectionTitle>date_trunc: সময়কে মাসের, দিনের শুরুতে টেনে আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Manager এর দ্বিতীয় প্রশ্ন ছিল অক্টোবর মাসের Booking। এ ধরনের প্রশ্নে বারবার একটা
                কাজ লাগে: একটা সময় কোন মাসের, কোন সপ্তাহের, কোন দিনের, সেটা বের করা। এর জন্য আছে{" "}
                <code className={CODE}>date_trunc(unit, value)</code>। ভাবুন একটা কাঁচি, যেটা
                সময়ের লেখাকে বেছে নেওয়া এককের পর থেকে কেটে ফেলে আর বাকি ঘরগুলোকে শুরুর মানে
                বসিয়ে দেয়। মাস ধরে কাটলে দিন হয়ে যায় ১, ঘণ্টা মিনিট শূন্য।
              </ContentParagraph>
              <ContentParagraph>
                একক হিসেবে দেওয়া যায় year, quarter, month, week, day, hour, minute সহ আরও কিছু। week
                এর বেলায় একটা কথা জানা জরুরি: PostgreSQL ISO নিয়ম মানে, তাই সপ্তাহ শুরু হয় সোমবারে।
                বাংলাদেশে সপ্তাহ গোনা হয় শনিবার থেকে, কিন্তু date_trunc সেটা জানে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TruncateDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking 13 কে চার জায়গায় কাটা"
              query={`SELECT booked_at,
       date_trunc('month', booked_at) AS month_start,
       date_trunc('day',   booked_at) AS day_start,
       date_trunc('hour',  booked_at) AS hour_start
FROM bookings
WHERE booking_id = 13;

SELECT date_trunc('week', DATE '2026-11-01') AS week_of_sunday,
       date_trunc('week', DATE '2026-11-04') AS week_of_wednesday;`}
              caption="Booking 13 এর সময় 2026-09-15 21:10:00+06। মাস ধরে কাটলে 2026-09-01 00:00:00+06, দিন ধরে 2026-09-15 00:00:00+06, ঘণ্টা ধরে 2026-09-15 21:00:00+06। দ্বিতীয় Query তে রবিবার 1 November এর সপ্তাহ শুরু 26 October সোমবার, আর বুধবার 4 November এর সপ্তাহ শুরু 2 November সোমবার।"
            />
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DateTruncLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস খেয়াল করুন। এক, date_trunc একটা date পেলেও উত্তর দেয় timestamptz, তাই
                শুধু তারিখ চাইলে শেষে <code className={CODE}>::date</code> বসান। দুই, timestamptz
                কাটার সময় মাস বা দিনের সীমানা ঠিক হয় Session এর Time Zone দেখে। Dhaka র মাঝরাত আর
                UTC এর মাঝরাত আলাদা মুহূর্ত, আর এই পার্থক্য থেকেই এই লেসনের সবচেয়ে বড় বাগটা আসে,
                সেকশন ১২ তে।
              </ContentParagraph>
              <ContentParagraph>
                এবার অক্টোবরের Booking। সবচেয়ে নিরাপদ লেখা হলো দুই দিকের সীমানা: মাসের শুরু থেকে,
                পরের মাসের শুরুর আগ পর্যন্ত। শুরুতে বড় সমান, শেষে শুধু ছোট। এটাকে বলে Half-open
                Range। Module 03 এ BETWEEN দিয়ে timestamp ছাঁকার যে ফাঁদ দেখেছিলেন, এই লেখায় সেটা
                থাকে না, কারণ শেষ দিনের রাত ১১টা ৫৯ মিনিটের Booking ও ধরা পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অক্টোবর 2026 এর Booking, Half-open Range দিয়ে"
              query={`SELECT booking_id, booked_at
FROM bookings
WHERE booked_at >= date_trunc('month', TIMESTAMPTZ '2026-10-15 00:00+06')
  AND booked_at <  date_trunc('month', TIMESTAMPTZ '2026-10-15 00:00+06')
                   + INTERVAL '1 month'
ORDER BY booked_at;`}
              caption="মাসের যেকোনো একটা দিন দিলেই হয়, date_trunc সেটাকে মাসের শুরুতে টেনে নেয়। নয়টা Row আসবে, Booking 14 থেকে Booking 24 পর্যন্ত। প্রতি মাসে এই Query টা চালাতে শুধু তারিখটা বদলাতে হয়।"
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
                  October 2026 এ (Dhaka র ঘড়িতে) যতগুলো Booking হয়েছে, তাদের{" "}
                  <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>booked_at</code>, booked_at অনুযায়ী সাজিয়ে। এবার মাসের
                  শুরুর মুহূর্ত হিসেবে নিজে <code className={CODE}>{"TIMESTAMPTZ '2026-10-01 00:00+06'"}</code>{" "}
                  ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  শুরু: booked_at {">="} মাসের শুরু। শেষ: booked_at {"<"} মাসের শুরু +{" "}
                  <code className={CODE}>{"INTERVAL '1 month'"}</code>। extract দিয়ে বছর আর মাস
                  মিলিয়ে লিখলেও একই উত্তর আসবে।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
WHERE booked_at >= date_trunc('month', TIMESTAMPTZ '2026-10-01 00:00+06')
  AND booked_at <  date_trunc('month', TIMESTAMPTZ '2026-10-01 00:00+06')
                   + INTERVAL '1 month'
ORDER BY booked_at;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মাসে কতগুলো, এই প্রশ্ন আসছে পরের Module এ",
          content: (
            <ContentParagraph>
              প্রতিটা মাসে কতগুলো Booking হলো, সেই সংখ্যা এক Query তে বের করতে date_trunc এর সাথে
              GROUP BY লাগে। এই জুটি Report এর সবচেয়ে চেনা জুটি, আর সেটা Module 05 এর{" "}
              <Link href="/sql/topic/group-by" className={LINK}>
                GROUP BY
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "extract",
      subHeader: { index: "007", title: "extract" },
      title: <SectionTitle>extract: একটা সময় থেকে একটা অংশ তুলে আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                date_trunc সময়টাকে ছোট করে, কিন্তু সময়ই রাখে। কখনো আপনার শুধু একটা অংশ দরকার:
                কোন মাস, কোন ঘণ্টা, সপ্তাহের কোন দিন। এর জন্য{" "}
                <code className={CODE}>extract(field FROM value)</code>। উত্তর একটা সংখ্যা।
                সবচেয়ে কাজের অংশগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>year, month, day, hour, minute</strong>: যেমন নাম, তেমন কাজ।
                </ListItem>
                <ListItem>
                  <strong>quarter</strong>: বছরের কোন তিন মাসের ভাগ, 1 থেকে 4।
                </ListItem>
                <ListItem>
                  <strong>dow</strong>: সপ্তাহের দিন, রবিবার 0 থেকে শনিবার 6।
                </ListItem>
                <ListItem>
                  <strong>isodow</strong>: সপ্তাহের দিন ISO নিয়মে, সোমবার 1 থেকে রবিবার 7। dow আর
                  isodow এর তফাত শুধু রবিবারে।
                </ListItem>
                <ListItem>
                  <strong>doy</strong>: বছরের কততম দিন, 1 থেকে 366।
                </ListItem>
                <ListItem>
                  <strong>epoch</strong>: 1970 সালের 1 জানুয়ারি UTC থেকে কত সেকেন্ড। অন্য Program
                  এর সাথে সময় আদান প্রদানে কাজে লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো Booking থেকে অংশ তুলে আনা"
              query={`SELECT booking_id, booked_at,
       extract(year   FROM booked_at) AS y,
       extract(month  FROM booked_at) AS m,
       extract(hour   FROM booked_at) AS h,
       extract(dow    FROM booked_at) AS dow,
       extract(isodow FROM booked_at) AS isodow,
       extract(doy    FROM booked_at) AS doy
FROM bookings
WHERE booking_id IN (1, 13)
ORDER BY booking_id;

SELECT extract(dow FROM DATE '2026-11-01')    AS dow_sunday,
       extract(isodow FROM DATE '2026-11-01') AS isodow_sunday;`}
              caption="Booking 1 শনিবার, তাই dow আর isodow দুটোতেই 6। Booking 13 মঙ্গলবার, দুটোতেই 2। দ্বিতীয় Query তে রবিবার 1 November: dow বলে 0, isodow বলে 7। এই একটা দিনেই দুটো আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                extract এর উত্তরের ধরন numeric। পুরনো Code এ আপনি{" "}
                <code className={CODE}>{"date_part('month', ...)"}</code> দেখবেন, সেটা একই কাজ
                করে কিন্তু উত্তর দেয় double precision। নতুন লেখায় extract ব্যবহার করুন।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা বাংলাদেশি প্রশ্ন। এখানে সাপ্তাহিক ছুটি শুক্রবার আর শনিবার, আর Island Tours
                এর বেশিরভাগ Departure ঠিক এই দুই দিনে শুরু হয়, যাতে অফিস কামাই কম হয়। ISO নিয়মে
                শুক্রবার 5, শনিবার 6। নিচের বক্সে সামনের প্রতিটা Departure এর দিনটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Departure গুলো সপ্তাহের কোন দিনে"
              query={`SELECT departure_id,
       starts_on,
       extract(isodow FROM starts_on) AS isodow,
       to_char(starts_on, 'FMDay')    AS day_name
FROM departures
WHERE starts_on >= DATE '2026-11-01'
ORDER BY starts_on;`}
              caption="নয়টা Departure। আটটাই শুক্রবার (5) বা শনিবার (6)। শুধু 2027-02-14 এর Departure টা রবিবার (7), আর সেটা বন্ধ থাকা Saint Martin Luxury Stay এর।"
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
                  ধরে নিন আজ 1 November 2026। আজ বা তার পরে শুরু হওয়া যেসব Departure বাংলাদেশের
                  সাপ্তাহিক ছুটির দিনে, অর্থাৎ শুক্রবার বা শনিবারে শুরু হয়, তাদের{" "}
                  <code className={CODE}>departure_id</code> আর{" "}
                  <code className={CODE}>starts_on</code>, তারিখ অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  isodow ব্যবহার করুন: শুক্রবার 5, শনিবার 6।{" "}
                  <code className={CODE}>extract(isodow FROM starts_on) IN (5, 6)</code>।
                </>
              }
              solution={`SELECT departure_id, starts_on
FROM departures
WHERE starts_on >= DATE '2026-11-01'
  AND extract(isodow FROM starts_on) IN (5, 6)
ORDER BY starts_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "age",
      subHeader: { index: "008", title: "age" },
      title: <SectionTitle>age: বছর, মাস আর দিনে বয়স</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো তারিখ বিয়োগ করলে দিনের সংখ্যা পান, যেমন 2802। কিন্তু মানুষ বয়স বা অভিজ্ঞতা
                বলে বছর আর মাসে: সাত বছর আট মাস। এই কাজের জন্য{" "}
                <code className={CODE}>age(later, earlier)</code>। উত্তর একটা interval, বছর, মাস
                আর দিনে ভাগ করা।
              </ContentParagraph>
              <ContentParagraph>
                age এর একটা এক Argument এর রূপও আছে: <code className={CODE}>age(hired_on)</code>।
                সেটা আজকের তারিখ থেকে হিসাব করে, তাই আজ এক উত্তর, পরের মাসে আরেক। এই লেসনে আমরা সবসময়
                দুই Argument এর রূপ লিখব, আজকের তারিখ নিজে বসিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide দের অভিজ্ঞতা, 1 November 2026 এ"
              query={`SELECT full_name,
       hired_on,
       age(DATE '2026-11-01', hired_on)                     AS tenure,
       extract(year FROM age(DATE '2026-11-01', hired_on))  AS full_years
FROM guides
ORDER BY hired_on;`}
              caption="Jamal Hossain এর tenure 7 years 8 mons, Shirin Akter এর 6 years 3 mons 17 days। full_years এ শুধু পূর্ণ বছর: 7, 6, 4, 4, 2। ছোট mons মানে months, PostgreSQL এভাবেই লেখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              age আর সাধারণ বিয়োগ একই প্রশ্নের দুটো আলাদা উত্তর দেয়। 31 January থেকে 1 March পর্যন্ত
              কতদিন? বিয়োগ বলে ঠিক 29 দিন। age বলে 1 mon 1 day, কারণ সে প্রথমে পুরো মাস গোনে,
              তারপর বাকি দিন। কোনোটাই ভুল না, প্রশ্নটা কী সেটা আগে ঠিক করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="age বনাম সাধারণ বিয়োগ"
              query={`SELECT age(DATE '2026-03-01', DATE '2026-01-31') AS by_age,
       DATE '2026-03-01' - DATE '2026-01-31'      AS by_minus;`}
              caption="by_age আসবে 1 mon 1 day, by_minus আসবে 29।"
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
                  1 November 2026 তারিখে প্রতিটা Guide এর পূর্ণ বছরের অভিজ্ঞতা কত? Guide এর{" "}
                  <code className={CODE}>full_name</code> আর পূর্ণ বছরের সংখ্যা,{" "}
                  <code className={CODE}>full_years</code> নামে। সবচেয়ে পুরনো Guide আগে, মানে
                  hired_on অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  age দিয়ে interval বানিয়ে তার থেকে বছর তুলে আনুন:{" "}
                  <code className={CODE}>{"extract(year FROM age(DATE '2026-11-01', hired_on))"}</code>।
                </>
              }
              solution={`SELECT full_name,
       extract(year FROM age(DATE '2026-11-01', hired_on)) AS full_years
FROM guides
ORDER BY hired_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "to-char",
      subHeader: { index: "009", title: "to_char" },
      title: <SectionTitle>to_char: মানুষের পড়ার মতো তারিখ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database তারিখ লেখে 2026-11-20। Customer এর Email এ লিখতে চান Friday, 20 Nov 2026।
                এর জন্য <code className={CODE}>to_char(value, pattern)</code>। Pattern হলো একটা
                ছাঁচ, যেখানে প্রতিটা চেনা অক্ষরের দল তারিখের একটা অংশে বদলে যায়। উত্তর একটা লেখা,
                text। নিচের টেবিলে সবচেয়ে কাজের অংশগুলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Pattern", "মানে", "2026-11-20 এর জন্য"],
          rows: [
            ["YYYY", "চার অঙ্কের বছর", "2026"],
            ["MM", "মাস, দুই অঙ্কে", "11"],
            ["Mon", "মাসের নাম, তিন অক্ষরে", "Nov"],
            ["Month", "মাসের পুরো নাম, ফাঁকা দিয়ে লম্বা করা", "November"],
            ["DD", "দিন, দুই অঙ্কে", "20"],
            ["Day", "দিনের পুরো নাম, ফাঁকা দিয়ে লম্বা করা", "Friday"],
            ["Dy", "দিনের নাম, তিন অক্ষরে", "Fri"],
            ["HH24, HH12", "ঘণ্টা, ২৪ বা ১২ ঘণ্টার ঘড়িতে", "21, 09"],
            ["MI, SS", "মিনিট, সেকেন্ড", "10, 00"],
            ["AM", "AM বা PM", "PM"],
            ["FM", "পরের অংশের বাড়তি ফাঁকা আর শূন্য বাদ", "FMDay দেয় Friday"],
            ['"T"', "Double Quote এর ভেতরের লেখা হুবহু বসে", "T"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই তারিখ, কয়েক রকম লেখা"
              query={`SELECT starts_on,
       to_char(starts_on, 'DD Mon YYYY')        AS a,
       to_char(starts_on, 'FMDay, DD Mon YYYY') AS b,
       to_char(starts_on, 'YYYY-MM')            AS ym,
       to_char(starts_on, 'DD/MM/YY')           AS short
FROM departures
WHERE departure_id = 8;

SELECT booked_at,
       to_char(booked_at, 'HH24:MI')            AS t24,
       to_char(booked_at, 'HH12:MI AM')         AS t12,
       to_char(booked_at, 'FMMonth DD, YYYY')   AS long_date
FROM bookings
WHERE booking_id = 13;`}
              caption="প্রথম Query: 20 Nov 2026, Friday, 20 Nov 2026, 2026-11 আর 20/11/26। দ্বিতীয়টা: 21:10, 09:10 PM আর September 15, 2026।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Day আর Month এর একটা লুকানো স্বভাব আছে। সবচেয়ে লম্বা নামের সমান করতে এরা শেষে ফাঁকা
                জায়গা বসায়। Wednesday নয় অক্ষরের, তাই Friday লেখা হয় Friday এর পরে তিনটা ফাঁকা
                দিয়ে। Table এ এই ফাঁকা চোখে পড়ে না, কিন্তু Email এ Friday , 20 Nov এর মতো বিশ্রী
                দেখায়। সামনে FM বসালে ফাঁকা চলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চোখে না পড়া ফাঁকা জায়গা"
              query={`SELECT length(to_char(DATE '2026-11-20', 'Day'))   AS padded_len,
       length(to_char(DATE '2026-11-20', 'FMDay')) AS fm_len;`}
              caption="padded_len আসবে 9, fm_len আসবে 6। Friday ছয় অক্ষরের, বাকি তিনটা ফাঁকা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার to_char এর সবচেয়ে বড় ফাঁদ। to_char এর উত্তর লেখা, আর লেখা সাজানো হয় অক্ষর
                ধরে, তারিখ ধরে না। মাসের নাম দিয়ে সাজালে Apr, Aug, Dec, Feb আসে, ক্যালেন্ডারের
                ক্রমে না। DD/MM/YYYY লেখা দিয়ে তুলনা করলে 1 November কে 15 February এর চেয়ে ছোট বলে।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা তাই সহজ: হিসাব, তুলনা আর সাজানো সবসময় আসল date বা timestamptz দিয়ে, to_char
                একদম শেষে, শুধু দেখানোর জন্য। একমাত্র ব্যতিক্রম YYYY-MM বা YYYY-MM-DD এর মতো
                লেখা, যেখানে বড় অংশ আগে আসে, তাই অক্ষরের ক্রম আর তারিখের ক্রম মিলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লেখা দিয়ে সাজালে কী হয়"
              query={`SELECT to_char(d, 'Mon') AS mon
FROM (VALUES (DATE '2026-04-01'), (DATE '2026-08-01'),
             (DATE '2026-12-01'), (DATE '2026-02-01')) AS v(d)
ORDER BY to_char(d, 'Mon');

SELECT to_char(DATE '2026-11-01', 'YYYY-MM')
         > to_char(DATE '2026-02-01', 'YYYY-MM')     AS ym_sort_ok,
       to_char(DATE '2026-11-01', 'DD/MM/YYYY')
         > to_char(DATE '2026-02-15', 'DD/MM/YYYY')  AS dmy_sort_wrong;`}
              caption="প্রথম Query তে মাসগুলো আসবে Apr, Aug, Dec, Feb ক্রমে। VALUES দিয়ে চারটা তারিখ হাতে বানানো হয়েছে, এর বিস্তারিত পরে। দ্বিতীয় Query তে ym_sort_ok আসবে t, কিন্তু dmy_sort_wrong আসবে f: লেখা হিসেবে নভেম্বর ফেব্রুয়ারির আগে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উল্টো দিকের কাজ: লেখা থেকে তারিখ",
          content: (
            <ContentParagraph>
              Customer যদি একটা ফর্মে 20/11/2026 লেখেন, সেটাকে তারিখ বানাতে{" "}
              <code className={CODE}>{"to_date('20/11/2026', 'DD/MM/YYYY')"}</code>, যেটা দেয়
              2026-11-20। লেখা থেকে অন্য ধরনে বদলানোর পুরো গল্প, আর কোথায় সেটা ভেঙে পড়ে, পরের লেসন{" "}
              <Link href="/sql/topic/type-casting" className={LINK}>
                Casting Between Types
              </Link>{" "}
              এ।
            </ContentParagraph>
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
                  Email এ পাঠানোর জন্য 1 November 2026 বা তার পরে শুরু হওয়া প্রথম পাঁচটা
                  Departure এর <code className={CODE}>departure_id</code> আর তারিখটা এভাবে লেখা,{" "}
                  <code className={CODE}>nice_date</code> নামে: Friday, 20 Nov 2026। দিনের নামের পর
                  কোনো বাড়তি ফাঁকা থাকবে না, আর দিনের সংখ্যা সবসময় দুই অঙ্কে, যেমন 04। তারিখ
                  অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  Pattern হবে <code className={CODE}>{"'FMDay, DD Mon YYYY'"}</code>। সাজাবেন
                  starts_on দিয়ে, to_char এর লেখা দিয়ে না। প্রথম পাঁচটা মানে শেষে LIMIT 5।
                </>
              }
              solution={`SELECT departure_id,
       to_char(starts_on, 'FMDay, DD Mon YYYY') AS nice_date
FROM departures
WHERE starts_on >= DATE '2026-11-01'
ORDER BY starts_on
LIMIT 5;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "timestamptz-inside",
      subHeader: { index: "010", title: "timestamptz Inside" },
      title: <SectionTitle>timestamptz আসলে কী রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামটা বিভ্রান্তিকর: timestamp with time zone। শুনে মনে হয় এটা একটা সময়ের সাথে একটা
                Time Zone রেখে দেয়। আসলে রাখে না। PostgreSQL এর Docs যা বলে তা সহজ ভাষায় এই:
                timestamptz ঢোকানোর সময় সাথে দেওয়া Time Zone দেখে PostgreSQL মুহূর্তটাকে UTC তে
                বদলায়, ভেতরে শুধু সেই UTC মুহূর্তটা রাখে, আর মূল Time Zone টা মনে রাখে না। বের করার
                সময় সেই মুহূর্তটাকে Session এর TimeZone এ বদলে দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                একটা মিল দিয়ে ভাবুন। Island Tours এর হিসাবের খাতায় সব টাকা লেখা থাকে টাকায়। একজন
                বিদেশি Customer ডলারে দাম দেখতে চাইলে খাতা বদলায় না, শুধু দেখানোর সময় হিসাব করে
                ডলারে বলা হয়। timestamptz এর জন্য খাতার একক হলো UTC, আর Session এর TimeZone হলো
                দেখানোর মুদ্রা। UTC মানে পৃথিবীর মাপকাঠি ঘড়ি, যার সাথে তুলনা করে সব দেশের ঘড়ি
                বলা হয়: Dhaka UTC থেকে ছয় ঘণ্টা এগিয়ে, তাই +06।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InstantDisplayDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই পাতার বক্সগুলোর Session এর TimeZone হলো Asia/Dhaka। নিচের বক্সে সেটা বদলে একই
              Booking কে তিন ঘড়িতে দেখুন। বক্সের শেষে আবার Dhaka তে ফিরিয়ে আনা হয়েছে, কারণ এই
              পাতার সব বক্স একটাই Session ভাগ করে। কোনো বক্সে TimeZone বদলে ফিরিয়ে না আনলে পরের
              বক্সগুলোর সময় অন্য ঘড়িতে দেখাবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Booking, তিন ঘড়ি"
              query={`SHOW TimeZone;
SELECT booked_at FROM bookings WHERE booking_id = 1;

SET TIME ZONE 'UTC';
SELECT booked_at FROM bookings WHERE booking_id = 1;

SET TIME ZONE 'Asia/Kuala_Lumpur';
SELECT booked_at FROM bookings WHERE booking_id = 1;

SET TIME ZONE 'Asia/Dhaka';  -- এই পাতার বাকি বক্সের জন্য ফিরিয়ে আনা`}
              caption="প্রথমে Asia/Dhaka, তারপর একই Booking তিনবার: 2025-12-20 10:15:00+06, 2025-12-20 04:15:00+00 আর 2025-12-20 12:15:00+08। Database এ রাখা মান একটাই, বদলেছে শুধু দেখানোর ঘড়ি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঢোকানোর সময়ও একই নিয়ম। Time Zone লিখে দিলে PostgreSQL সেটা মানে। না লিখলে Session এর
                TimeZone ধরে নেয়। Offset এর বদলে জায়গার নামও লেখা যায়, যেমন Asia/Dhaka। নিচে দুটো
                আলাদা লেখা যে একই মুহূর্ত, সেটা যাচাই করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই মুহূর্ত, দুই রকম লেখা"
              query={`SELECT TIMESTAMPTZ '2026-11-02 01:15:00+06'
     = TIMESTAMPTZ '2026-11-01 19:15:00+00'         AS same_instant,
       TIMESTAMPTZ '2026-11-02 01:15:00 Asia/Dhaka'  AS named_zone_input;

SELECT TIMESTAMP   '2026-11-20 09:00' AS no_zone,
       TIMESTAMPTZ '2026-11-20 09:00' AS zone_assumed;`}
              caption="same_instant আসবে t: Dhaka র রাত ১টা ১৫ আর UTC এর সন্ধ্যা ৭টা ১৫ একই মুহূর্ত। দ্বিতীয় Query তে no_zone এর শেষে কিছু নেই, আর zone_assumed এর শেষে +06, কারণ Time Zone না দেওয়ায় Session এর Asia/Dhaka ধরে নেওয়া হয়েছে।"
            />
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeZoneLab /> },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "at-time-zone",
      subHeader: { index: "011", title: "AT TIME ZONE" },
      title: <SectionTitle>AT TIME ZONE: এক দেশের ঘড়ি থেকে আরেক দেশের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SET TIME ZONE পুরো Session এর ঘড়ি বদলায়। কিন্তু প্রায়ই আপনি শুধু একটা মানকে অন্য
                দেশের ঘড়িতে পড়তে চান, বাকি সব Dhaka তেই থাকুক। এর জন্য{" "}
                <code className={CODE}>AT TIME ZONE</code>। এটা দুই দিকে কাজ করে, আর কোন দিকে
                কাজ করবে সেটা ঠিক করে বাম পাশের মানটার ধরন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>timestamptz AT TIME ZONE zone</strong>: হাতে একটা মুহূর্ত। প্রশ্ন: ওই দেশের
                  দেয়ালের ঘড়িতে তখন কয়টা? উত্তর একটা timestamp, যাতে কোনো দেশের চিহ্ন নেই।
                </ListItem>
                <ListItem>
                  <strong>timestamp AT TIME ZONE zone</strong>: হাতে একটা দেয়ালের ঘড়ির লেখা। প্রশ্ন:
                  এটা যদি ওই দেশের ঘড়ি হয়, পৃথিবীর কোন মুহূর্ত? উত্তর একটা timestamptz।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <AtTimeZoneSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই দিকেই একবার"
              query={`SELECT booked_at,
       booked_at AT TIME ZONE 'Europe/London' AS london_wall,
       booked_at AT TIME ZONE 'Asia/Dhaka'    AS dhaka_wall
FROM bookings
WHERE booking_id = 1;

SELECT TIMESTAMP '2026-11-20 09:00' AT TIME ZONE 'Asia/Dhaka'    AS from_dhaka_wall,
       TIMESTAMP '2026-11-20 09:00' AT TIME ZONE 'Europe/London' AS from_london_wall;`}
              caption="প্রথম Query: london_wall 2025-12-20 04:15:00, dhaka_wall 2025-12-20 10:15:00, কোনোটার শেষে +06 নেই। দ্বিতীয়টা: Dhaka র সকাল ৯টা মানে 2026-11-20 09:00:00+06, আর London এর সকাল ৯টা মানে Dhaka র বিকেল ৩টা, 2026-11-20 15:00:00+06।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার শুরুর গল্পের শেষ ধাঁধাটা। Oliver এর দুটো Booking এ London আর Dhaka র পার্থক্য
                একবার ছয় ঘণ্টা, আরেকবার পাঁচ ঘণ্টা কেন? কারণ London এ গ্রীষ্মকালে ঘড়ি এক ঘণ্টা
                এগিয়ে দেওয়া হয়, যাকে বলে Daylight Saving Time। জানুয়ারিতে London চলে UTC তে,
                অক্টোবরের শুরুতে UTC থেকে এক ঘণ্টা এগিয়ে। Asia/Dhaka তে এখন এমন কোনো আগে পিছে
                নেই, সারা বছর +06।
              </ContentParagraph>
              <ContentParagraph>
                এই কারণেই জায়গার নাম, Europe/London, লেখা ভালো, শুধু +01 বা +00 না। নামটা জানে কোন
                তারিখে ঘড়ি কতটা এগিয়ে ছিল। এই তথ্য PostgreSQL পায় পৃথিবীর Time Zone ইতিহাসের একটা
                তালিকা থেকে, যার নাম tz database।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              orderMatters
              task={
                <>
                  Oliver Bennett এর <code className={CODE}>customer_id</code> হলো 11, আর তিনি London
                  এ থাকেন। তাঁর প্রতিটা Booking এর <code className={CODE}>booking_id</code> আর London
                  এর দেয়ালের ঘড়িতে Booking এর সময়, <code className={CODE}>london_time</code> নামে,
                  শেষে কোনো +00 বা +01 ছাড়া। booked_at অনুযায়ী সাজিয়ে। Session এর TimeZone বদলাবেন
                  না।
                </>
              }
              hint={
                <>
                  মুহূর্ত থেকে দেয়ালের ঘড়ি:{" "}
                  <code className={CODE}>{"booked_at AT TIME ZONE 'Europe/London'"}</code>।
                </>
              }
              solution={`SELECT booking_id,
       booked_at AT TIME ZONE 'Europe/London' AS london_time
FROM bookings
WHERE customer_id = 11
ORDER BY booked_at;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "off-by-one-day",
      subHeader: { index: "012", title: "Off by One Day" },
      title: <SectionTitle>এক দিন আগের তারিখে গোনা Booking</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই বাগ, যেটা প্রায় প্রতিটা বাংলাদেশি Startup কোনো না কোনো সময় পায়। Server এর
                Time Zone হয় UTC, কারণ Cloud এর Server সাধারণত সেভাবেই আসে। Developer লেখেন{" "}
                <code className={CODE}>booked_at::date</code>, যেটা Session এর ঘড়িতে তারিখ বের
                করে। Session UTC তে, তাই তারিখটাও UTC এর। আর Dhaka র রাত ১২টা থেকে ভোর ৬টার আগ
                পর্যন্ত যত Booking হয়, UTC বলে সেগুলো আগের দিনের।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর আসল Data তে এমন রাতের Booking নেই, তাই নিচে VALUES দিয়ে চারটা
                কাল্পনিক Booking বানানো হয়েছে, মাঝরাতের আশপাশে। VALUES এর পুরো ব্যাখ্যা পরে আসবে,
                এখানে শুধু এটুকু জানুন: এটা Query এর ভেতরে হাতে লেখা একটা ছোট Table।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MidnightBoundaryDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাঝরাতের আশপাশের চারটা Booking"
              query={`SELECT id,
       at,
       at::date                       AS dhaka_date,
       (at AT TIME ZONE 'UTC')::date  AS utc_date
FROM (VALUES (101, TIMESTAMPTZ '2026-11-01 23:50+06'),
             (102, TIMESTAMPTZ '2026-11-02 01:15+06'),
             (103, TIMESTAMPTZ '2026-11-02 05:59+06'),
             (104, TIMESTAMPTZ '2026-11-02 06:00+06')) AS v(id, at);`}
              caption="102 আর 103 এর dhaka_date 2026-11-02, কিন্তু utc_date 2026-11-01। 104 ঠিক সকাল ৬টায়, তাই দুই ঘড়িতেই 2 November।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই প্রশ্ন দুই Session থেকে: 2 November এ কোন কোন Booking হয়েছে? প্রথমে Server
              এর মতো UTC তে, তারপর Dhaka তে। শেষে আবার Dhaka তেই ফিরিয়ে আনা হয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, দুই Session, দুই উত্তর"
              query={`SET TIME ZONE 'UTC';
SELECT id, at
FROM (VALUES (101, TIMESTAMPTZ '2026-11-01 23:50+06'),
             (102, TIMESTAMPTZ '2026-11-02 01:15+06'),
             (103, TIMESTAMPTZ '2026-11-02 05:59+06'),
             (104, TIMESTAMPTZ '2026-11-02 06:00+06')) AS v(id, at)
WHERE at::date = DATE '2026-11-02';

SET TIME ZONE 'Asia/Dhaka';
SELECT id, at
FROM (VALUES (101, TIMESTAMPTZ '2026-11-01 23:50+06'),
             (102, TIMESTAMPTZ '2026-11-02 01:15+06'),
             (103, TIMESTAMPTZ '2026-11-02 05:59+06'),
             (104, TIMESTAMPTZ '2026-11-02 06:00+06')) AS v(id, at)
WHERE at::date = DATE '2026-11-02';`}
              caption="UTC Session বলে 2 November এ শুধু 104। Dhaka Session বলে 102, 103 আর 104। Query হুবহু এক, কোনো Error নেই, শুধু দুটো Booking এক দিন আগের হিসাবে চলে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান তিনটা অভ্যাসে। এক, ঘটনার সময় সবসময় timestamptz এ রাখুন, যেমন Island Tours
                রেখেছে। দুই, কোন দেশের তারিখে Report হবে সেটা Query এর ভেতরে নিজে লিখুন:{" "}
                <code className={CODE}>{"(booked_at AT TIME ZONE 'Asia/Dhaka')::date"}</code>। তাহলে
                Session এর ঘড়ি যাই হোক, উত্তর একই। তিন, Application এর Connection খোলার সময়
                Session এর TimeZone ঠিক করে দিন, যাতে ভুলবশত ::date লিখলেও ক্ষতি কম হয়।
              </ContentParagraph>
              <ContentParagraph>
                Daylight Saving এর দেশে আরেকটা ফাঁদ আছে, যেটা জানা ভালো, কারণ আপনার Customer বা
                Server সেসব দেশেও থাকতে পারে। 25 October 2026 এ London ঘড়ি এক ঘণ্টা পিছিয়ে নেয়,
                তাই সেই দিনটা ২৫ ঘণ্টার। সেখানে এক দিন যোগ আর ২৪ ঘণ্টা যোগ এক জিনিস না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="London এ এক দিন বনাম ২৪ ঘণ্টা"
              query={`SET TIME ZONE 'Europe/London';
SELECT TIMESTAMPTZ '2026-10-24 12:00+00' + INTERVAL '1 day'    AS plus_1_day,
       TIMESTAMPTZ '2026-10-24 12:00+00' + INTERVAL '24 hours' AS plus_24_hours;
SET TIME ZONE 'Asia/Dhaka';  -- ফিরিয়ে আনা`}
              caption="শুরুর মুহূর্তটা London এর দুপুর ১টা (তখন গ্রীষ্মকাল)। plus_1_day আসবে 2026-10-25 13:00:00+00, পরের দিন একই ঘড়ির সময়। plus_24_hours আসবে 2026-10-25 12:00:00+00। Dhaka Session এ দুটোর কোনো তফাত হতো না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "SET TIME ZONE একটা Connection এর জন্য থেকে যায়",
          content: (
            <ContentParagraph>
              SET TIME ZONE শুধু ওই Query তে না, পুরো Connection এর বাকি সময় ধরে থাকে। Application
              অনেক Request একই Connection ঘুরিয়ে ফিরিয়ে ব্যবহার করে, যাকে বলে Connection Pool (Module
              17)। এক Request TimeZone বদলে ফিরিয়ে না দিলে পরের Request অন্য ঘড়িতে সময় পায়। তাই
              Report এর ভেতরে AT TIME ZONE লেখা বেশি নিরাপদ, SET TIME ZONE এর চেয়ে।
            </ContentParagraph>
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
            <ContentParagraph>
              MySQL ভিত্তিক কোর্স ফলো করলে সময়ের Function গুলোর নাম অনেক আলাদা দেখবেন। নিচের টেবিল
              আর Output গুলো MySQL 8.4.11 এ Island Tours এর MySQL ফাইল Load করে চালানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL"],
          rows: [
            ["এখনকার মুহূর্ত, আজকের তারিখ", "now(), current_date", "NOW(), CURDATE()"],
            ["তিন দিন যোগ", "d + 3, d + INTERVAL '3 days'", "DATE_ADD(d, INTERVAL 3 DAY)"],
            ["দুই তারিখের মাঝে দিন", "d2 - d1", "DATEDIFF(d2, d1)"],
            ["পূর্ণ বছর বা মাস", "extract(year FROM age(...))", "TIMESTAMPDIFF(YEAR, d1, d2)"],
            ["মাসের শুরুতে কাটা", "date_trunc('month', t)", "নেই, DATE_FORMAT বা LAST_DAY দিয়ে ঘুরিয়ে"],
            ["অংশ তুলে আনা", "extract(month FROM t)", "EXTRACT(MONTH FROM t), MONTH(t)"],
            ["সপ্তাহের দিন", "dow: রবি 0, isodow: সোম 1", "DAYOFWEEK: রবি 1, WEEKDAY: সোম 0"],
            ["তারিখ সাজিয়ে লেখা", "to_char(d, 'DD Mon YYYY')", "DATE_FORMAT(d, '%d %b %Y')"],
            ["এক দেশ থেকে আরেক দেশের ঘড়ি", "t AT TIME ZONE 'Europe/London'", "CONVERT_TZ(t, from, to)"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-dates.sql",
          code: `SELECT DATE_ADD('2026-11-01', INTERVAL 3 DAY) AS a,
       DATEDIFF('2026-11-20', '2026-11-01')    AS c,
       DATE '2026-11-20' - DATE '2026-11-01'  AS d,
       DATE '2026-12-01' - DATE '2026-11-30'  AS e;
-- a = 2026-11-04, c = 19, d = 19, e = 71   (e ভুল: তারিখ দুটো সংখ্যা হিসেবে বিয়োগ হয়েছে)

SELECT DATE '2026-01-31' + INTERVAL 1 MONTH          AS jan31_plus_month,
       TIMESTAMPDIFF(YEAR, '2019-03-01', '2026-11-01') AS years;
-- 2026-02-28, 7

SELECT DATE_FORMAT('2026-11-20', '%W, %d %b %Y') AS b,
       DAYOFWEEK('2026-11-01') AS dayofweek_sun,
       WEEKDAY('2026-11-01')   AS weekday_sun;
-- Friday, 20 Nov 2026 | 1 | 6

SELECT DATE_TRUNC('month', booked_at) FROM bookings LIMIT 1;
-- ERROR 1305 (42000): FUNCTION island_tours.DATE_TRUNC does not exist`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Time Zone এর ব্যাপারে MySQL এর গল্প আলাদা। আমাদের MySQL ফাইলে সময় রাখা DATETIME এ,
                যেটা কোনো দেশ চেনে না, শুধু দেয়ালের ঘড়ির লেখা রাখে। MySQL এর TIMESTAMP ধরন আবার
                Session এর time_zone দেখে বদলায়। নিচের পরীক্ষায় একই লেখা দুই ধরনে রাখা হয়েছে
                Session +06:00 থাকার সময়, তারপর Session বদলে UTC করা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-time-zones.sql",
          code: `CREATE TEMPORARY TABLE tz_demo (as_datetime DATETIME, as_timestamp TIMESTAMP);
SET time_zone = '+06:00';
INSERT INTO tz_demo VALUES ('2025-12-20 10:15:00', '2025-12-20 10:15:00');
SET time_zone = '+00:00';
SELECT * FROM tz_demo;
-- as_datetime = 2025-12-20 10:15:00, as_timestamp = 2025-12-20 04:15:00

SELECT CONVERT_TZ('2025-12-20 10:15:00', '+06:00', '+00:00') AS by_offset,
       CONVERT_TZ('2025-12-20 10:15:00', 'Asia/Dhaka', 'Europe/London') AS by_name;
-- 2025-12-20 04:15:00 | 2025-12-20 04:15:00

SELECT COUNT(*) FROM mysql.time_zone_name;
-- Docker এর mysql:8.4 Image এ 1795, নতুন ইনস্টলে 0 হতে পারে`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ জায়গার নাম কাজ নাও করতে পারে",
          content: (
            <ContentParagraph>
              MySQL এর Docs বলে, Asia/Dhaka এর মতো নাম ব্যবহার করতে হলে mysql Database এর Time Zone
              Table গুলো আগে ভরতে হয়, আর খালি থাকলে নাম দিলে Error আসে। Docker এর অফিসিয়াল Image
              এ এগুলো ভরা থাকে, তাই আমাদের পরীক্ষায় কাজ করেছে। নিজের ইনস্টলে আগে{" "}
              <code className={CODE}>SELECT COUNT(*) FROM mysql.time_zone_name</code> চালিয়ে দেখুন।
              শূন্য আসলে Docs এর নির্দেশমতো mysql_tzinfo_to_sql দিয়ে Table গুলো ভরতে হবে, নইলে
              শুধু +06:00 এর মতো Offset লিখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Departure Dashboard</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Operations টিমের সকালের Dashboard এ একটা তালিকা থাকে: সামনের Departure গুলো, কবে,
                আর কত দিন বাকি। পাশে থাকে কোন সপ্তাহের, যাতে Guide দের সপ্তাহভিত্তিক রোস্টার
                বানানো যায়। এই লেসনের প্রায় সবকিছু এখানে একসাথে: তারিখ বিয়োগ, date_trunc,
                to_char, আর একটা নির্দিষ্ট আজকের তারিখ।
              </ContentParagraph>
              <ContentParagraph>
                Dashboard এর বাকি অংশগুলো এভাবে আসে। মাসিক Booking এর সংখ্যা আসে date_trunc আর
                GROUP BY দিয়ে, Module 05 এ। London বা Kuala Lumpur এর Customer কে পাঠানো Email এ
                সময় লেখা হয় তাঁর দেশের ঘড়িতে, AT TIME ZONE দিয়ে। আর Refund এর শেষ সময় আসে paid_at
                এর সাথে interval যোগ করে, যেটা আপনি Exercise 2 তে করেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সামনের ৩০ দিনের Departure, Dashboard এর মতো"
              query={`SELECT departure_id,
       to_char(starts_on, 'FMDay, DD Mon') AS starts,
       starts_on - DATE '2026-11-01'       AS days_away,
       seats_left
FROM departures
WHERE starts_on >= DATE '2026-11-01'
  AND starts_on <  DATE '2026-11-01' + 30
ORDER BY starts_on;`}
              caption="চারটা Departure, 14 November থেকে 27 November। সাজানো হয়েছে আসল তারিখ দিয়ে, to_char শুধু দেখানোর জন্য।"
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
                  ধরে নিন আজ 1 November 2026। 1 November 2026 থেকে 31 January 2027 পর্যন্ত (দুই
                  তারিখসহ) শুরু হওয়া প্রতিটা Departure এর জন্য চারটা Column, এই ক্রমে:{" "}
                  <code className={CODE}>departure_id</code>; শুরুর তারিখ লেখা হিসেবে, যেমন 04 Dec
                  2026, <code className={CODE}>starts</code> নামে; আজ থেকে কত দিন বাকি,{" "}
                  <code className={CODE}>days_away</code> নামে; আর সেই সপ্তাহের সোমবারের তারিখ
                  (শুধু তারিখ, ঘড়ি ছাড়া), <code className={CODE}>week_start</code> নামে। তারিখ
                  অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  লেখার Pattern <code className={CODE}>{"'DD Mon YYYY'"}</code>। সপ্তাহের সোমবার
                  মানে <code className={CODE}>{"date_trunc('week', starts_on)"}</code>, শেষে{" "}
                  <code className={CODE}>::date</code>। আটটা Row আসার কথা।
                </>
              }
              solution={`SELECT departure_id,
       to_char(starts_on, 'DD Mon YYYY')    AS starts,
       starts_on - DATE '2026-11-01'        AS days_away,
       date_trunc('week', starts_on)::date  AS week_start
FROM departures
WHERE starts_on BETWEEN DATE '2026-11-01' AND DATE '2027-01-31'
ORDER BY starts_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Booking এর সময়ের যাত্রা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Customer বোতাম চাপা থেকে Dashboard এ একটা তারিখ দেখা পর্যন্ত সময়ের মানটা কোন কোন
              ধাপ পার হয়, সেটা ধাপে ধাপে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "App মুহূর্তটা পাঠায়",
              description:
                "Island Tours এর API Booking এর সময় পাঠায় Offset সহ, যেমন 2026-01-30 15:30:00+06। Offset না দিলে PostgreSQL Session এর TimeZone ধরে নিত।",
            },
            {
              title: "PostgreSQL UTC তে বদলায়",
              description:
                "+06 দেখে PostgreSQL মুহূর্তটাকে UTC তে নেয়: 2026-01-30 09:30:00 UTC। এই একটা মানই booked_at Column এ রাখা হয়। +06 টা আর মনে রাখা হয় না।",
            },
            {
              title: "Query সেই মুহূর্ত নিয়ে কাজ করে",
              description:
                "তুলনা, বিয়োগ আর সাজানো হয় আসল মুহূর্ত দিয়ে। কোন দেশের ঘড়ি, তাতে এখানে কিছু আসে যায় না।",
            },
            {
              title: "তারিখ বা মাস লাগলে ঘড়ি বাছতে হয়",
              description:
                "::date, date_trunc বা extract এর জন্য একটা ঘড়ি দরকার। নিজে না বললে Session এর TimeZone ব্যবহার হয়। নিরাপদ পথ: AT TIME ZONE 'Asia/Dhaka' লিখে দেওয়া।",
            },
            {
              title: "দেখানোর সময় আবার বদলায়",
              description:
                "Result ফেরত দেওয়ার সময় PostgreSQL মুহূর্তটাকে Session এর TimeZone এ বদলে লেখে: Dhaka Session এ 15:30:00+06, UTC Session এ 09:30:00+00।",
            },
            {
              title: "শেষে মানুষের জন্য সাজানো",
              description:
                "to_char বা App এর Code তারিখটাকে Friday, 30 Jan এর মতো সুন্দর করে লেখে। এই ধাপ সবসময় শেষে, হিসাবের পরে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>সময়ের যে ভুলগুলো সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            ["সংরক্ষিত Report এ now() বা current_date", "প্রতিবার চালালে আলাদা উত্তর", "তারিখটা বাইরে থেকে পাঠানো, যেমন DATE '2026-11-01'"],
            ["UTC Session এ booked_at::date", "রাতের Booking আগের দিনে গোনা হয়", "(booked_at AT TIME ZONE 'Asia/Dhaka')::date"],
            ["ঘটনার সময় timestamp এ রাখা", "কোন দেশের সময়, কেউ জানে না", "timestamptz, Module 09 এ বিস্তারিত"],
            ["to_char করে তারপর সাজানো", "Apr, Aug, Dec, Feb ক্রম", "আসল তারিখ দিয়ে সাজানো, to_char শেষে"],
            ["timestamp এ BETWEEN শেষ তারিখ", "শেষ দিনের দিনের ভেতরের Row বাদ", "Half-open: >= শুরু AND < পরের শুরু"],
            ["এক মাস মানে ৩০ দিন ধরা", "৩১ জানুয়ারি + ৩০ দিন = ২ মার্চ", "মাস চাইলে INTERVAL '1 month'"],
            ["এক Argument এর age(x)", "আজকের দিনের উপর নির্ভর করা উত্তর", "age(DATE '2026-11-01', x)"],
            ["FM ছাড়া Day বা Month", "নামের পরে লুকানো ফাঁকা", "FMDay, FMMonth"],
            ["dow আর isodow গুলিয়ে ফেলা", "রবিবারে 0 আর 7 এর গোলমাল", "এক Project এ একটাই, isodow ভালো"],
            ["SET TIME ZONE করে ফিরিয়ে না আনা", "Pool এর পরের Request ভুল ঘড়ি পায়", "Query এর ভেতরে AT TIME ZONE"],
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
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Date/Time Functions and Operators
                </a>
                : সব Function, extract এর সব অংশ, আর Daylight Saving এর উদাহরণ।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Date/Time Types
                </a>
                : timestamptz কীভাবে UTC তে রাখা হয় আর কীভাবে দেখানো হয়, মূল লেখায়।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-formatting.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Data Type Formatting Functions
                </a>
                : to_char আর to_date এর প্রতিটা Pattern।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/date-and-time-functions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4 Manual: Date and Time Functions
                </a>
                : DATE_ADD, DATEDIFF, TIMESTAMPDIFF, DATE_FORMAT।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/time-zone-support.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4 Manual: Time Zone Support
                </a>
                : time_zone, TIMESTAMP বনাম DATETIME আর Time Zone Table ভরা।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Tz_database" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: tz database
                </a>
                : Asia/Dhaka, Europe/London এর মতো নাম কোথা থেকে আসে।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/ISO_8601" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: ISO 8601
                </a>
                : 2026-11-20 লেখার ধরন, আর ISO সপ্তাহ কেন সোমবারে শুরু।
              </ListItem>
            </ContentList>
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
                  সময়ের পাঁচ রকম মান: date, time, timestamp, timestamptz আর interval। প্রথম চারটা
                  বলে কখন, শেষেরটা কতক্ষণ।
                </ListItem>
                <ListItem>
                  now(), current_timestamp আর current_date Transaction এর শুরুর সময় দেয়, প্রতিদিন
                  বদলায়। Report আর Exercise এ তারিখটা নিজে লিখুন।
                </ListItem>
                <ListItem>
                  date − date = দিনের সংখ্যা, timestamptz − timestamptz = interval, date + সংখ্যা =
                  date।
                </ListItem>
                <ListItem>
                  INTERVAL &apos;1 month&apos; কোনো নির্দিষ্ট দিনের সংখ্যা না। মাসের শেষে থামে, আর
                  দুই ধাপে যোগ করলে উত্তর বদলায়।
                </ListItem>
                <ListItem>
                  date_trunc সময়কে বেছে নেওয়া এককের শুরুতে টেনে আনে, week এর শুরু সোমবার। মাসের
                  Booking এর জন্য Half-open Range।
                </ListItem>
                <ListItem>
                  extract একটা অংশ সংখ্যা হিসেবে দেয়। dow তে রবিবার 0, isodow তে 7।
                </ListItem>
                <ListItem>
                  age দুই Argument দিয়ে, বছর মাস দিনে। to_char শুধু দেখানোর জন্য, FM দিয়ে ফাঁকা বাদ।
                </ListItem>
                <ListItem>
                  timestamptz ভেতরে UTC মুহূর্ত রাখে, দেখায় Session এর TimeZone এ। AT TIME ZONE এক
                  ঘড়ি থেকে আরেক ঘড়িতে নেয়, দুই দিকে।
                </ListItem>
                <ListItem>
                  Dhaka র রাত ১২টা থেকে ভোর ৬টার Booking UTC তে আগের দিনের। কোন দেশের তারিখ, সেটা
                  Query তে নিজে লিখুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা কাজ চুপচাপ ঘটেছে: একটা মানকে অন্য ধরনে বদলানো। ::date দিয়ে
                মুহূর্ত থেকে তারিখ, to_char দিয়ে তারিখ থেকে লেখা, to_date দিয়ে লেখা থেকে তারিখ। এই
                বদলানোর নিয়ম, CAST আর ::, আর কোথায় সেটা Error দেয়, সব পরের লেসনে:{" "}
                <Link href="/sql/topic/type-casting" className={LINK}>
                  Casting Between Types
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
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["date, timestamptz, interval", "তারিখ, মুহূর্ত, দৈর্ঘ্য", "starts_on, booked_at, INTERVAL '3 days'"],
      ["now(), current_date", "Transaction শুরুর সময়, প্রতিদিন বদলায়", "BEGIN এর ভেতরে now() থেমে থাকে"],
      ["clock_timestamp()", "আসল ঘড়ি, চলতে থাকে", "pg_sleep এর পরে এগিয়ে যায়"],
      ["তারিখ বিয়োগ", "দিনের সংখ্যা", "starts_on - DATE '2026-11-01'"],
      ["মুহূর্ত বিয়োগ", "interval", "18 days 14:30:00"],
      ["INTERVAL '1 month'", "মাসের ঘর এক এগোয়, শেষে থামে", "31 Jan + 1 month = 28 Feb"],
      ["generate_series", "ধাপে ধাপে Row বানায়", "সাত দিনের ক্যালেন্ডার"],
      ["date_trunc", "এককের শুরুতে টেনে আনা", "date_trunc('month', booked_at)"],
      ["extract", "একটা অংশ, numeric", "extract(isodow FROM starts_on)"],
      ["age(a, b)", "বছর, মাস, দিন", "7 years 8 mons"],
      ["to_char", "দেখানোর জন্য লেখা", "'FMDay, DD Mon YYYY'"],
      ["timestamptz এর ভেতর", "UTC তে রাখা, Session এ দেখানো", "SET TIME ZONE 'UTC' বদলায় শুধু লেখা"],
      ["AT TIME ZONE", "মুহূর্ত থেকে দেয়ালের ঘড়ি, বা উল্টো", "booked_at AT TIME ZONE 'Europe/London'"],
      ["এক দিনের বাগ", "UTC Session এ রাতের Booking আগের দিনে", "(booked_at AT TIME ZONE 'Asia/Dhaka')::date"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT DATE '2026-11-20' - DATE '2026-11-01'; PostgreSQL এ কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "19, একটা integer",
            isCorrect: true,
            explanation: "ঠিক। দুটো date বিয়োগ করলে দিনের সংখ্যা পাওয়া যায়, ধরন integer।",
          },
          {
            key: "B",
            text: "19 days, একটা interval",
            isCorrect: false,
            explanation: "interval আসে দুটো timestamp বা timestamptz বিয়োগ করলে। দুটো date বিয়োগে সাধারণ সংখ্যা আসে।",
          },
          {
            key: "C",
            text: "2026-00-19",
            isCorrect: false,
            explanation: "তারিখ বিয়োগে নতুন তারিখ আসে না, আসে মাঝের দিনের সংখ্যা।",
          },
          {
            key: "D",
            text: "একটা Error, তারিখ বিয়োগ করা যায় না",
            isCorrect: false,
            explanation: "PostgreSQL এ তারিখ বিয়োগ পুরোপুরি বৈধ, আর এটাই দিন গোনার সবচেয়ে সহজ উপায়।",
          },
        ],
      },
      {
        id: 2,
        text: "BEGIN এর পরে now() চালালেন, দুই সেকেন্ড অপেক্ষা করলেন, আবার now() চালালেন। দুই উত্তরের সম্পর্ক কী?",
        options: [
          {
            key: "A",
            text: "দ্বিতীয়টা দুই সেকেন্ড বেশি",
            isCorrect: false,
            explanation: "এটা clock_timestamp() এর আচরণ। now() Transaction শুরুর সময় দেয়।",
          },
          {
            key: "B",
            text: "দুটো হুবহু এক",
            isCorrect: true,
            explanation: "ঠিক। now() পুরো Transaction জুড়ে শুরুর মুহূর্তটাই দেয়, যাতে একসাথে লেখা Row গুলোর সময় এক থাকে।",
          },
          {
            key: "C",
            text: "দ্বিতীয়টা NULL",
            isCorrect: false,
            explanation: "now() কখনো NULL দেয় না।",
          },
          {
            key: "D",
            text: "প্রতিবার আন্দাজে আলাদা",
            isCorrect: false,
            explanation: "আচরণটা নির্দিষ্ট: Transaction এর ভেতরে now() বদলায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT DATE '2026-01-31' + INTERVAL '1 month'; এর উত্তর কী?",
        options: [
          {
            key: "A",
            text: "2026-03-03 00:00:00",
            isCorrect: false,
            explanation: "PostgreSQL বাড়তি দিন পরের মাসে ঠেলে দেয় না। দিন না মিললে মাসের শেষ দিনে থামে।",
          },
          {
            key: "B",
            text: "2026-02-28 00:00:00",
            isCorrect: true,
            explanation: "ঠিক। ফেব্রুয়ারি 2026 এ ৩১ তারিখ নেই, তাই উত্তর মাসের শেষ দিন, আর date + interval বলে ঘড়ির অংশসহ timestamp।",
          },
          {
            key: "C",
            text: "2026-03-02",
            isCorrect: false,
            explanation: "এটা DATE '2026-01-31' + 30 এর উত্তর। এক মাস আর ৩০ দিন এক জিনিস না।",
          },
          {
            key: "D",
            text: "একটা Error, ফেব্রুয়ারিতে ৩১ নেই",
            isCorrect: false,
            explanation: "কোনো Error আসে না, PostgreSQL চুপচাপ মাসের শেষ দিনে থামে। ঠিক এজন্যই এটা ফাঁদ।",
          },
        ],
      },
      {
        id: 4,
        text: "date_trunc('week', DATE '2026-11-01') কোন তারিখের মাঝরাত দেয়? (1 November 2026 রবিবার)",
        options: [
          {
            key: "A",
            text: "2026-11-01, কারণ রবিবারেই সপ্তাহ শুরু",
            isCorrect: false,
            explanation: "PostgreSQL ISO নিয়ম মানে, যেখানে সপ্তাহ শুরু সোমবারে।",
          },
          {
            key: "B",
            text: "2026-10-31, শনিবার",
            isCorrect: false,
            explanation: "বাংলাদেশে সপ্তাহ শনিবারে শুরু ধরা হয়, কিন্তু date_trunc সেটা জানে না।",
          },
          {
            key: "C",
            text: "2026-10-26, সোমবার",
            isCorrect: true,
            explanation: "ঠিক। রবিবার ISO সপ্তাহের শেষ দিন, তাই তার সপ্তাহ শুরু হয়েছিল আগের সোমবার, 26 October।",
          },
          {
            key: "D",
            text: "2026-11-02, পরের সোমবার",
            isCorrect: false,
            explanation: "date_trunc সবসময় পেছনের দিকে কাটে, সামনে কখনো যায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "Session এর TimeZone হলো UTC। একটা Booking হয়েছে Dhaka র সময় 2 November রাত ১টা ১৫ তে। booked_at::date কী দেবে?",
        options: [
          {
            key: "A",
            text: "2026-11-02",
            isCorrect: false,
            explanation: "এটা Dhaka র তারিখ। ::date Session এর ঘড়ি ব্যবহার করে, আর Session UTC তে।",
          },
          {
            key: "B",
            text: "2026-11-01",
            isCorrect: true,
            explanation: "ঠিক। Dhaka র রাত ১টা ১৫ মানে UTC তে আগের দিন সন্ধ্যা ৭টা ১৫, তাই UTC Session এ তারিখ 1 November।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: false,
            explanation: "একটা আসল মুহূর্ত থেকে তারিখ সবসময় পাওয়া যায়, প্রশ্ন শুধু কোন ঘড়িতে।",
          },
          {
            key: "D",
            text: "একটা Error, Time Zone মেলে না",
            isCorrect: false,
            explanation: "কোনো Error আসে না। চুপচাপ অন্য তারিখ, তাই এটা বাগ।",
          },
        ],
      },
      {
        id: 6,
        text: "booked_at একটা timestamptz। booked_at AT TIME ZONE 'Europe/London' এর উত্তরের ধরন কী?",
        options: [
          {
            key: "A",
            text: "timestamptz, London এর Offset সহ",
            isCorrect: false,
            explanation: "মুহূর্তের উপর AT TIME ZONE দিলে উল্টোটা হয়: দেশের চিহ্ন ছাড়া দেয়ালের ঘড়ির লেখা।",
          },
          {
            key: "B",
            text: "timestamp without time zone, London এর দেয়ালের ঘড়ি",
            isCorrect: true,
            explanation: "ঠিক। timestamptz AT TIME ZONE zone দেয় সেই দেশের ঘড়িতে কয়টা বাজে, শেষে কোনো Offset ছাড়া।",
          },
          {
            key: "C",
            text: "date",
            isCorrect: false,
            explanation: "AT TIME ZONE ঘড়ির অংশ ফেলে দেয় না। শুধু তারিখ চাইলে পরে ::date বসাতে হয়।",
          },
          {
            key: "D",
            text: "text",
            isCorrect: false,
            explanation: "লেখায় বদলায় to_char। AT TIME ZONE সময়ের ধরনেই থাকে।",
          },
        ],
      },
      {
        id: 7,
        text: "মাসের নামের পাশে Booking দেখাতে চান, ক্যালেন্ডারের ক্রমে। কোন ORDER BY সঠিক?",
        options: [
          {
            key: "A",
            text: "ORDER BY to_char(booked_at, 'Mon')",
            isCorrect: false,
            explanation: "এটা অক্ষর ধরে সাজায়: Apr, Aug, Dec, Feb। ক্যালেন্ডারের ক্রম ভেঙে যায়।",
          },
          {
            key: "B",
            text: "ORDER BY to_char(booked_at, 'Month')",
            isCorrect: false,
            explanation: "পুরো নামেও অক্ষর ধরে সাজানো হয়: April, August, December আগে।",
          },
          {
            key: "C",
            text: "ORDER BY booked_at, আর to_char শুধু SELECT এ",
            isCorrect: true,
            explanation: "ঠিক। সাজানো আসল সময় দিয়ে, to_char শুধু দেখানোর জন্য, একদম শেষে।",
          },
          {
            key: "D",
            text: "ORDER BY to_char(booked_at, 'DD/MM/YYYY')",
            isCorrect: false,
            explanation: "দিন আগে থাকায় এটাও ভুল সাজায়: 01/11 আসে 15/02 এর আগে।",
          },
        ],
      },
      {
        id: 8,
        text: "London এ 25 October 2026 এ ঘড়ি এক ঘণ্টা পিছিয়ে নেয়। London Session এ TIMESTAMPTZ '2026-10-24 12:00+00' + INTERVAL '1 day' কী দেয়?",
        options: [
          {
            key: "A",
            text: "2026-10-25 12:00:00+00, ঠিক ২৪ ঘণ্টা পরে",
            isCorrect: false,
            explanation: "এটা INTERVAL '24 hours' এর উত্তর। '1 day' রাখে দেয়ালের ঘড়ির সময়।",
          },
          {
            key: "B",
            text: "2026-10-25 13:00:00+00, পরের দিন একই ঘড়ির সময়",
            isCorrect: true,
            explanation: "ঠিক। শুরুর মুহূর্ত London এর দুপুর ১টা। এক দিন পরে আবার দুপুর ১টা, যদিও মাঝে ২৫ ঘণ্টা গেছে।",
          },
          {
            key: "C",
            text: "2026-10-25 11:00:00+00",
            isCorrect: false,
            explanation: "ঘড়ি পেছালে মাঝের সময় বাড়ে, কমে না।",
          },
          {
            key: "D",
            text: "Dhaka আর London এ একই উত্তর",
            isCorrect: false,
            explanation: "Dhaka তে কোনো আগে পিছে নেই, তাই সেখানে এক দিন আর ২৪ ঘণ্টা একই। London এ আলাদা।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর সময়ের Report",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Departure ক্যালেন্ডার:</strong> নিজের island_tours এ, ধরে নিন আজ 1 November 2026,
        সামনের ৯০ দিনের প্রতিটা Departure এর জন্য একটা লাইন বানান: সুন্দর তারিখ (FMDay, DD Mon
        YYYY), কত দিন বাকি, আর সপ্তাহের সোমবার। শুক্র বা শনিবারের Departure গুলো আলাদা চিহ্নে
        দেখান (CASE ব্যবহার করুন)।
      </span>,
      <span key="2">
        <strong>দুই ঘড়ির তুলনা:</strong> SET TIME ZONE &apos;UTC&apos; আর SET TIME ZONE
        &apos;Asia/Dhaka&apos; এ একই Query চালিয়ে October 2026 এর Booking গুলোর booked_at::date
        তুলনা করুন। আমাদের Data তে কোনো পার্থক্য আসে কিনা লিখুন, আর রাত ২টার একটা কাল্পনিক
        Booking যোগ করলে কী হতো সেটা VALUES দিয়ে দেখান।
      </span>,
      <span key="3">
        <strong>Refund এর হিসাব:</strong> প্রতিটা paid Payment এর জন্য Refund এর শেষ মুহূর্ত (৭ দিন)
        আর 1 November 2026 এর সাপেক্ষে Refund এখনো খোলা কিনা, একটা true বা false Column এ দেখান।
      </span>,
      <span key="4">
        <strong>বিদেশি Customer:</strong> Priya Sharma (Kolkata), Aiman Zulkifli (Kuala Lumpur) আর
        Oliver Bennett (London) এর Booking গুলো তাঁদের নিজের দেশের ঘড়িতে দেখান। কোন Time Zone নামে
        কোন শহর, আর Kolkata র Offset কেন আধা ঘণ্টায় শেষ হয়, দুই লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন সহকর্মী বলছেন, timestamptz তো Time Zone
        রেখে দেয়। খাতার একক টাকা আর দেখানোর মুদ্রা ডলারের উদাহরণ দিয়ে তাঁকে আট লাইনে বোঝান আসলে
        কী রাখা হয় আর কী দেখানো হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">Departure ক্যালেন্ডারের Query আর Output</span>,
      <span key="d2">দুই Session এর তুলনা আর কাল্পনিক Booking এর ফলাফল</span>,
      <span key="d3">Refund Report এর Query আর Output</span>,
      <span key="d4">তিন বিদেশি Customer এর Booking, নিজের ঘড়িতে</span>,
      <span key="d5">সহকর্মীর জন্য লেখা আট লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ সময়ের ড্রিল",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Session এর ঘড়ি ঠিক করা",
        description:
          "নিজের মেশিনের PostgreSQL এর TimeZone আপনার Operating System থেকে আসতে পারে। প্রতিটা ফাইলের শুরুতে তাই SET TIME ZONE 'Asia/Dhaka' আছে, যাতে আপনার ফলাফল নিচের মন্তব্যের সাথে মেলে।",
      },
      {
        title: "তারিখের অঙ্ক",
        description:
          "দ্বিতীয় ফাইলে তারিখ বিয়োগ, সংখ্যা যোগ আর interval যোগ। প্রতিটা উত্তরের ধরন pg_typeof দিয়ে মিলিয়ে নিন।",
      },
      {
        title: "মাসের ফাঁদ নিজে হাতে",
        description:
          "তৃতীয় ফাইলে ৩১ জানুয়ারি থেকে চারভাবে এগোনো। চারটা উত্তর পাশাপাশি লিখে রাখুন।",
      },
      {
        title: "কাটা আর তুলে আনা",
        description:
          "চতুর্থ ফাইলে date_trunc আর extract, আর অক্টোবরের Booking এর Half-open Range। Row এর সংখ্যা মেলান।",
      },
      {
        title: "সুন্দর তারিখ",
        description:
          "পঞ্চম ফাইলে to_char। \\x চালু করে বড় Output এক Column এ দেখতে পারেন।",
      },
      {
        title: "Time Zone এর পরীক্ষা",
        description:
          "ষষ্ঠ ফাইলে SET TIME ZONE, AT TIME ZONE আর মাঝরাতের চারটা Booking। শেষে আবার Asia/Dhaka তে ফেরানো আছে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-session.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';
SHOW TimeZone;
-- Asia/Dhaka

SELECT booked_at FROM bookings WHERE booking_id = 1;
-- 2025-12-20 10:15:00+06`,
      },
      {
        language: "sql",
        filename: "02-arithmetic.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';
SELECT DATE '2026-11-01' + 7                    AS plus7,
       DATE '2026-11-20' - DATE '2026-11-01'    AS days_between,
       pg_typeof(DATE '2026-11-20' - DATE '2026-11-01') AS t;
-- 2026-11-08 | 19 | integer

SELECT departure_id, starts_on, starts_on - DATE '2026-11-01' AS days_away
FROM departures
WHERE starts_on BETWEEN DATE '2026-11-01' AND DATE '2026-11-01' + 30
ORDER BY starts_on;
-- (4 rows): 14 | 8 | 15 | 10, days_away 13, 19, 20, 26`,
      },
      {
        language: "sql",
        filename: "03-months.sql",
        code: `SELECT DATE '2026-01-31' + INTERVAL '1 month'                        AS a,
       DATE '2026-01-31' + INTERVAL '1 month' + INTERVAL '1 month' AS b,
       DATE '2026-01-31' + INTERVAL '2 months'                       AS c,
       DATE '2026-01-31' + 30                                        AS d;
-- a = 2026-02-28 00:00:00, b = 2026-03-28 00:00:00,
-- c = 2026-03-31 00:00:00, d = 2026-03-02`,
      },
      {
        language: "sql",
        filename: "04-trunc-extract.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';
SELECT date_trunc('month', booked_at) AS m, extract(isodow FROM booked_at) AS isodow
FROM bookings WHERE booking_id = 13;
-- 2026-09-01 00:00:00+06 | 2

SELECT count(*) FROM bookings
WHERE booked_at >= TIMESTAMPTZ '2026-10-01 00:00+06'
  AND booked_at <  TIMESTAMPTZ '2026-10-01 00:00+06' + INTERVAL '1 month';
-- 9`,
      },
      {
        language: "sql",
        filename: "05-to-char.sql",
        code: `SELECT to_char(starts_on, 'FMDay, DD Mon YYYY') AS nice,
       to_char(starts_on, 'YYYY-MM')            AS ym
FROM departures WHERE departure_id = 8;
-- Friday, 20 Nov 2026 | 2026-11

SELECT length(to_char(DATE '2026-11-20', 'Day'))   AS padded,
       length(to_char(DATE '2026-11-20', 'FMDay')) AS fm;
-- 9 | 6`,
      },
      {
        language: "sql",
        filename: "06-time-zones.sql",
        code: `SET TIME ZONE 'UTC';
SELECT booked_at FROM bookings WHERE booking_id = 1;
-- 2025-12-20 04:15:00+00

SET TIME ZONE 'Asia/Dhaka';
SELECT booking_id, booked_at AT TIME ZONE 'Europe/London' AS london_time
FROM bookings WHERE customer_id = 11 ORDER BY booked_at;
-- (2 rows): 12 | 2026-01-30 09:30:00,  19 | 2026-10-04 08:40:00

SELECT (TIMESTAMPTZ '2026-11-02 01:15+06' AT TIME ZONE 'UTC')::date        AS utc_date,
       (TIMESTAMPTZ '2026-11-02 01:15+06' AT TIME ZONE 'Asia/Dhaka')::date AS dhaka_date;
-- 2026-11-01 | 2026-11-02`,
      },
    ],
    tip: (
      <ContentParagraph>
        নিজের মেশিনে TimeZone কী আছে দেখতে psql এ SHOW TimeZone চালান। প্রতিবার SET না লিখে স্থায়ী
        করতে চাইলে <code className={CODE}>{"ALTER DATABASE island_tours SET TimeZone = 'Asia/Dhaka';"}</code>{" "}
        চালিয়ে নতুন করে Connect করুন। কাজের Database এ এমন বদলের আগে টিমের সাথে কথা বলে নিন।
      </ContentParagraph>
    ),
  },
};
