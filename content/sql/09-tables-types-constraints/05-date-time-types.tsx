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
  ColumnTypeLab,
  TimestampCliffLab,
} from "../../../components/course/topics/ddl/timetype-animations";
import {
  PlainVsAwareSplit,
  RepeatedHourDiagram,
  TimeColumnPickerDiagram,
  TimeRangeRulerDiagram,
  ZoneNameVsOffsetDiagram,
} from "../../../components/course/topics/ddl/timetype-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const dateTimeTypesContent: TopicData = {
  id: "date-time-types",
  introduction: {
    badge: "MODULE 09 · LESSON 05",
    title: <SectionTitle>Date and Time Types: সময় রাখার সঠিক Column</SectionTitle>,
    description:
      "date, time, timestamp, timestamptz আর interval কে এবার Column এর ধরন হিসেবে চিনবেন: কোন প্রশ্নের জন্য কোনটা, কেন ঘটনার সময় সবসময় timestamptz, DEFAULT now() কীভাবে কাজ করে, Precision আর গোল করা, infinity, প্রতিটা ধরনের সীমা, আর কেন Database এ Time Zone রাখা হয় না, রাখা হয় মুহূর্ত। শেষে MySQL এর DATETIME, TIMESTAMP আর 2038 সালের দেয়াল।",
    quote: {
      text: "আমাকে যে Column এ রাখবেন, সেটাই ঠিক করবে আমি পৃথিবীর একটা নির্দিষ্ট মুহূর্ত, নাকি দেয়ালে লেখা কয়েকটা সংখ্যা মাত্র।",
      author: "একটা বিমান নামার সময়",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ড্রাইভার কেন ছয় ঘণ্টা আগে বিমানবন্দরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026, সপ্তাহের প্রথম কাজের দিন। Island Tours এর Manager ফারুক সাহেব
                সাপ্তাহিক বৈঠকে একটা নতুন সেবার কথা বললেন। বিদেশ থেকে যে অতিথিরা আসেন, তাঁদের এখন থেকে
                বিমানবন্দর থেকে তুলে হোটেলে পৌঁছে দেওয়া হবে। নভেম্বরের প্রথম তিনজন অতিথি ঠিক হয়ে আছেন:
                London থেকে Oliver Bennett, Kolkata থেকে Priya Sharma, আর Kuala Lumpur থেকে Aiman
                Zulkifli। এই সেবার হিসাব রাখতে একটা নতুন Table লাগবে, আর সেটা বানানোর দায়িত্ব পেলেন
                Developer নাদিয়া।
              </ContentParagraph>
              <ContentParagraph>
                নাদিয়া দেখলেন, গত সপ্তাহে এক শিক্ষানবিশ একটা খসড়া Table বানিয়ে রেখে গেছেন। বিমান কখন
                নামবে, সেটা আসে Airline এর System থেকে, আর সেই System সব সময় পাঠায় UTC তে, শেষে +00 লাগিয়ে।
                পরীক্ষা হিসেবে Oliver এর Flight ঢোকানো হলো: নামবে 2026-11-20 08:30:00+00। UTC এর সকাল
                সাড়ে আটটা মানে ঢাকার দুপুর আড়াইটা। কিন্তু খসড়া Table থেকে পড়ে দেখা গেল লেখা আছে শুধু
                08:30:00। ড্রাইভার এই তালিকা দেখে সকাল সাড়ে আটটায় বিমানবন্দরে পৌঁছাতেন, আর Oliver নামতেন
                ছয় ঘণ্টা পরে।
              </ContentParagraph>
              <ContentParagraph>
                ভুলটা কোনো Function এর না, কোনো Query এর না। ভুলটা Column এর ধরনে। শিক্ষানবিশ লিখেছিলেন{" "}
                <code className={CODE}>timestamp</code>, আর এই ধরন লেখার শেষের +00 টা কোনো সতর্কবার্তা ছাড়াই
                ফেলে দেয়। নিচের বক্সে খসড়া আর ঠিক করা, দুটো Table পাশাপাশি দেখুন। দুটোতে একই লেখা ঢুকছে,
                পার্থক্য শুধু একটা শব্দে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খসড়া Table আর ঠিক করা Table"
              query={`DROP TABLE IF EXISTS tt_draft_pickups;
CREATE TABLE tt_draft_pickups (
  guest    text,
  lands_at timestamp
);
INSERT INTO tt_draft_pickups VALUES
  ('Oliver Bennett', '2026-11-20 08:30:00+00');
SELECT guest, lands_at FROM tt_draft_pickups;

DROP TABLE IF EXISTS tt_fixed_pickups;
CREATE TABLE tt_fixed_pickups (
  guest    text,
  lands_at timestamptz
);
INSERT INTO tt_fixed_pickups VALUES
  ('Oliver Bennett', '2026-11-20 08:30:00+00');
SELECT guest, lands_at FROM tt_fixed_pickups;`}
              caption="প্রথম ফলাফলে 2026-11-20 08:30:00, শেষে কিছু নেই: +00 হারিয়ে গেছে, আর এখন এটাকে ঢাকার সকাল সাড়ে আটটা ভেবে পড়া খুব সহজ। দ্বিতীয় ফলাফলে 2026-11-20 14:30:00+06: একই মুহূর্ত, ঢাকার ঘড়িতে দুপুর আড়াইটা। দুই Table এর তফাত শুধু timestamp আর timestamptz।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এরপর নাদিয়া বসলেন ফারুক সাহেবের চাওয়ার তালিকা নিয়ে। নতুন Table এ প্রতিটা অতিথির জন্য
                রাখতে হবে: বিমান ঠিক কোন মুহূর্তে নামবে, কোন দিনের Pickup, ড্রাইভারকে ঘড়ির কয়টায় তৈরি থাকতে
                হবে, বিমানবন্দর থেকে হোটেলে যেতে কতক্ষণ লাগে, বিনা খরচের Pickup এর Offer কবে পর্যন্ত চলবে
                (হয়তো কোনো শেষই নেই), আর Row টা কখন তৈরি হলো। ছয়টা তথ্যই সময় নিয়ে, অথচ ছয়টা আলাদা প্রশ্ন।
                একটা মুহূর্ত, একটা দিন, একটা ঘড়ির সময়, একটা দৈর্ঘ্য, একটা শেষহীন সীমা, আর একটা নিজে থেকে
                বসে যাওয়া মান।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে আপনি প্রতিটা প্রশ্নের জন্য ঠিক Column বেছে নিতে শিখবেন। Module 03 থেকে 08 পর্যন্ত
                আপনি তৈরি করা Table থেকে শুধু পড়েছেন। এই Module এ আপনি নিজে Table বানাচ্ছেন, আর সময়ের Column
                হলো সেই জায়গা যেখানে একটা ভুল ধরন বছরের পর বছর চুপচাপ ভুল তথ্য জমা করে যায়, কেউ টেরও পায়
                না। লেসনের শেষে আপনি নাদিয়ার পুরো Pickup Table নিজে বানাবেন, প্রতিটা Column এর ধরনের পেছনের
                কারণ সহ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই লেসনের বক্সগুলো নিয়ে তিনটা কথা",
          content: (
            <ContentList>
              <ListItem>
                এই লেসনে আজ মানে 1 November 2026, রবিবার। now() আর current_date প্রতিদিন বদলায়, তাই কোনো
                উদাহরণে তাদের আসল মান দেখানো হয়নি। যেখানে আজকের তারিখ দরকার, সেখানে লেখা আছে{" "}
                <code className={CODE}>{"DATE '2026-11-01'"}</code>।
              </ListItem>
              <ListItem>
                প্রতিটা বক্সের নিজের Table এর নাম শুরু হয় tt_ দিয়ে, যাতে Island Tours এর আসল Table এর সাথে
                কখনো না মেশে। প্রতিটা বক্স শুরু হয় DROP TABLE IF EXISTS দিয়ে, তাই যতবার খুশি Run চাপতে
                পারেন। পাতা Reload করলে সব আবার নতুন করে শুরু হয়।
              </ListItem>
              <ListItem>
                এই পাতার সব বক্স একটাই Session ভাগ করে, আর সেই Session এর TimeZone হলো Asia/Dhaka। কোনো বক্স
                TimeZone বদলালে শেষে আবার Asia/Dhaka তে ফিরিয়ে আনে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আগের লেসনের সাথে এই লেসনের সম্পর্ক",
          content: (
            <ContentParagraph>
              Module 04 এর{" "}
              <Link href="/sql/topic/date-time-functions" className={LINK}>
                Date and Time Functions
              </Link>{" "}
              লেসন শিখিয়েছিল সময়ের মান নিয়ে কাজ করা: যোগ বিয়োগ, date_trunc, extract, AT TIME ZONE। সেখানে
              বলা হয়েছিল, Column এর ধরন বাছাইয়ের সিদ্ধান্ত আসবে পরে। এই লেসনটাই সেই সিদ্ধান্তের জায়গা।
              Function গুলো এখানে আবার শেখানো হবে না, দরকার হলে আগের লেসনের অংশে Link দেওয়া থাকবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "five-types",
      subHeader: { index: "002", title: "Five Column Types" },
      title: <SectionTitle>সময়ের পাঁচটা Column, পাঁচটা আলাদা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Column বানানোর আগে নিজেকে একটা প্রশ্ন করুন: এই Column এর প্রতিটা মান কোন প্রশ্নের উত্তর?
                প্রশ্ন ঠিক হলে ধরন নিজেই বেরিয়ে আসে। সংখ্যার বেলায় যেমন আপনি জানেন, আসনের সংখ্যায় দশমিক
                লাগে না কিন্তু দামে লাগে, সময়ের বেলাতেও ঠিক তেমন। একটা Departure কোন দিনে শুরু, আর একটা
                Booking কোন মুহূর্তে হলো, দুটো আলাদা প্রশ্ন, তাই দুটো আলাদা ধরন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeColumnPickerDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>timestamptz</strong> (পুরো নাম timestamp with time zone): পৃথিবীর একটা নির্দিষ্ট
                  মুহূর্ত। কেউ ঢাকা থেকে দেখুক বা London থেকে, মুহূর্তটা একই। যা কিছু ঘটে, Booking, Payment,
                  Login, বিমান নামা, সব এখানে। জায়গা নেয় 8 bytes।
                </ListItem>
                <ListItem>
                  <strong>date</strong>: শুধু একটা দিন, ঘড়ির সময় নেই। জন্মদিন, ট্যুর শুরুর দিন, চাকরিতে
                  যোগদানের দিন। জায়গা নেয় 4 bytes।
                </ListItem>
                <ListItem>
                  <strong>time</strong> (পুরো নাম time without time zone): শুধু ঘড়ির একটা সময়, কোন দিনের
                  সেটা নেই। অফিস রোজ সকাল নয়টায় খোলে, ড্রাইভার রোজ সাড়ে ছয়টায় তৈরি থাকে। জায়গা নেয় 8 bytes।
                </ListItem>
                <ListItem>
                  <strong>interval</strong>: সময়ের একটা দৈর্ঘ্য। কখন না, কতক্ষণ। যাত্রায় সাড়ে তিন ঘণ্টা,
                  বাতিল করার সুযোগ ৪৮ ঘণ্টা। জায়গা নেয় 16 bytes।
                </ListItem>
                <ListItem>
                  <strong>timestamp</strong> (পুরো নাম timestamp without time zone): একটা তারিখ আর ঘড়ির
                  সময়, কিন্তু কোন দেশের ঘড়ি সেটা নেই। দেয়ালের ঘড়ির দিকে তাকিয়ে কাগজে লিখে রাখা একটা লেখা।
                  একা এটা কোনো প্রশ্নের পুরো উত্তর দেয় না, তাই ঘটনার সময়ের জন্য এটা প্রায় কখনো ঠিক না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে পাঁচটা ধরন এক Table এ রাখা হয়েছে। দ্বিতীয় Query টা পড়ে information_schema থেকে,
                যেখানে PostgreSQL প্রতিটা Table এর প্রতিটা Column এর বিবরণ রাখে। খেয়াল করুন, timestamptz
                লিখলেও সেখানে ধরনের নাম আসে পুরোটা: timestamp with time zone। timestamptz হলো PostgreSQL এর
                দেওয়া ছোট নাম, দুটো একই জিনিস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাঁচটা ধরন এক Table এ"
              query={`DROP TABLE IF EXISTS tt_type_tour;
CREATE TABLE tt_type_tour (
  starts_on  date,
  ready_by   time,
  wall_clock timestamp,
  booked_at  timestamptz,
  drive_time interval
);
INSERT INTO tt_type_tour VALUES
  ('2026-11-20', '06:30', '2026-11-20 06:30', '2026-11-01 10:15+06', '3 hours 30 minutes');
SELECT * FROM tt_type_tour;

SELECT column_name, data_type, datetime_precision
FROM information_schema.columns
WHERE table_name = 'tt_type_tour'
ORDER BY ordinal_position;`}
              caption="প্রথম ফলাফলে একটা Row: 2026-11-20, 06:30:00, 2026-11-20 06:30:00, 2026-11-01 10:15:00+06, 03:30:00। শুধু booked_at এর শেষে +06, কারণ শুধু সেটাই একটা মুহূর্ত। দ্বিতীয় ফলাফলে ৫টা Row, ধরনের পুরো নাম সহ। datetime_precision এর মানে সেকেন্ডের পরে কয়টা দশমিক ঘর রাখা হয়: date এর 0, বাকিদের 6। অংশ ৬ এ এটা নিয়ে বিস্তারিত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা ধরন Disk এ কত জায়গা নেয়, সেটা pg_column_size() দিয়ে নিজেই মেপে দেখতে পারেন। একটা জিনিস
              আলাদা করে দেখুন: timestamp আর timestamptz দুটোই ঠিক 8 bytes। অর্থাৎ মুহূর্ত ঠিকভাবে রাখার জন্য
              কোনো বাড়তি দাম দিতে হয় না। timetz নামের আরেকটা ধরন আছে, Time Zone সহ ঘড়ির সময়, যেটা নেয় 12
              bytes। PostgreSQL নিজেই সেটা ব্যবহার না করতে বলে, কেন তা অংশ ১১ তে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন মান কত bytes"
              query={`SELECT pg_column_size(DATE '2026-11-01')                 AS date_bytes,
       pg_column_size(TIME '06:30')                      AS time_bytes,
       pg_column_size(TIMETZ '06:30+06')                 AS timetz_bytes,
       pg_column_size(TIMESTAMP '2026-11-01 06:30')      AS timestamp_bytes,
       pg_column_size(TIMESTAMPTZ '2026-11-01 06:30+06') AS timestamptz_bytes,
       pg_column_size(INTERVAL '3 hours')                AS interval_bytes;`}
              caption="ফলাফল: 4, 8, 12, 8, 8, 16। timestamp আর timestamptz সমান জায়গা নেয়। তাই জায়গা বাঁচানোর যুক্তিতে timestamp বেছে নেওয়ার কোনো মানে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Database যিনি বানিয়েছেন, তিনি এই সিদ্ধান্তগুলো আগেই নিয়ে রেখেছেন। নিচের
              Query টা আট Table এর সব সময়ের Column খুঁজে বের করে, সাথে তাদের DEFAULT। প্রতিটা Row পড়ার সময়
              নিজেকে জিজ্ঞেস করুন, এই Column কোন প্রশ্নের উত্তর রাখে, আর ধরনটা কি সেই প্রশ্নের সাথে মেলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Island Tours এর সময়ের Column গুলো"
              query={`SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name NOT LIKE 'tt\\_%'
  AND data_type IN ('date', 'time without time zone', 'timestamp without time zone',
                    'timestamp with time zone', 'interval')
ORDER BY table_name, column_name;`}
              caption="৭টা Row। booked_at, joined_at, paid_at আর দুটো created_at হলো timestamptz, কারণ এরা সবাই ঘটনা। starts_on আর hired_on হলো date, কারণ এরা দিন। একটাও timestamp নেই। booked_at, joined_at আর tours.created_at এর DEFAULT হলো now(), অংশ ৫ এ সেটা খুলে দেখব। tt\_% শর্তটা এই পাতায় আপনার বানানো tt_ Table গুলো বাদ রাখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "শুধু timestamp লিখলে মানে without time zone",
          content: (
            <ContentParagraph>
              SQL Standard অনুযায়ী শুধু <code className={CODE}>timestamp</code> লিখলে সেটা হয় timestamp
              without time zone। অনেকে ধরে নেন সাধারণ নামটাই নিরাপদ, আর ভুলটা এখান থেকেই শুরু। একই নিয়ম time
              এর বেলাতেও: শুধু time মানে time without time zone। তাই মুহূর্ত রাখতে চাইলে সবসময় স্পষ্ট করে{" "}
              <code className={CODE}>timestamptz</code> লিখুন।
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
                  tt_ex1_departures নামে একটা Table বানান, ঠিক এই ক্রমে পাঁচটা Column সহ: tour_name (লেখা,
                  খালি রাখা যাবে না), starts_on (যে দিনে ট্যুর শুরু, খালি রাখা যাবে না), meet_at (রোজ কয়টায়
                  সবাই জড়ো হবেন, খালি থাকতে পারে), booked_at (যে মুহূর্তে Booking হলো, খালি রাখা যাবে না),
                  trip_length (যাত্রা কতক্ষণের, খালি থাকতে পারে)। শুরুর কোডের শেষের যাচাই করার Query টা
                  সবার শেষে রেখে দিন।
                </>
              }
              starter={`DROP TABLE IF EXISTS tt_ex1_departures;

-- এখানে CREATE TABLE tt_ex1_departures লিখুন

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tt_ex1_departures'
ORDER BY ordinal_position;`}
              hint={
                <>
                  প্রতিটা Column এর জন্য উপরের ছবির প্রশ্নটা করুন: দিন হলে date, রোজকার ঘড়ি হলে time, মুহূর্ত
                  হলে timestamptz, দৈর্ঘ্য হলে interval। খালি রাখা যাবে না মানে Column এর পরে NOT NULL।
                </>
              }
              orderMatters
              solution={`SELECT * FROM (VALUES
  ('tour_name',   'text',                     'NO'),
  ('starts_on',   'date',                     'NO'),
  ('meet_at',     'time without time zone',   'YES'),
  ('booked_at',   'timestamp with time zone', 'NO'),
  ('trip_length', 'interval',                 'YES')
) AS v(column_name, data_type, is_nullable);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "timestamp-vs-timestamptz",
      subHeader: { index: "003", title: "timestamp vs timestamptz" },
      title: <SectionTitle>timestamp আর timestamptz: নামে দুই অক্ষরের ফারাক, কাজে আকাশ পাতাল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো ধরনই তারিখ আর ঘড়ির সময় একসাথে রাখে, দুটোই 8 bytes, দুটোই মাইক্রোসেকেন্ড পর্যন্ত নিখুঁত।
                তাহলে তফাত কোথায়? তফাত হলো ঢোকানোর সময় লেখার শেষের Offset টা (+06, +00, +05:30) নিয়ে কে কী
                করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>timestamp</strong> লেখা থেকে শুধু তারিখ আর ঘড়ির অংশটা নেয়। Offset থাকলে PostgreSQL এর
                Docs এর ভাষায় সেটা নীরবে উপেক্ষা করা হয়, অর্থাৎ কোনো হিসাব না করেই ফেলে দেওয়া হয়। কোনো
                Error নেই, কোনো সতর্কবার্তা নেই। যা থাকে, তা হলো দেয়ালঘড়ির একটা লেখা, যেটা জানে না সে কোন দেশের
                দেয়ালে ঝুলছিল।
              </ContentParagraph>
              <ContentParagraph>
                <strong>timestamptz</strong> Offset টা পড়ে, সেটা দিয়ে মুহূর্তটাকে UTC তে বদলায়, আর ভেতরে শুধু
                সেই UTC মুহূর্তটা রাখে। মূল Offset টা আলাদা করে মনে রাখে না। বের করার সময় মুহূর্তটাকে Session
                এর TimeZone এ বদলে দেখায়। ঠিক এই প্রক্রিয়াটা Module 04 এর{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  timestamptz Inside
                </Link>{" "}
                অংশে টাকা আর ডলারের খাতার উদাহরণ দিয়ে বোঝানো হয়েছিল। এখানে আমরা দেখব Column হিসেবে এর ফল কী।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PlainVsAwareSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবির কথাগুলো নিজে চালিয়ে দেখুন। একটা Table এ দুটো Column, plain আর aware। দুটোতে একই দুটো লেখা
              ঢোকানো হয়েছে: ঢাকার সকাল দশটা আর London এর সকাল দশটা। তারপর Session এর TimeZone বদলে আবার পড়া
              হয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই দুটো লেখা, দুই রকম Column"
              query={`DROP TABLE IF EXISTS tt_clock;
CREATE TABLE tt_clock (
  label text,
  plain timestamp,
  aware timestamptz
);
INSERT INTO tt_clock VALUES
  ('Dhaka',  '2026-11-01 10:00+06', '2026-11-01 10:00+06'),
  ('London', '2026-11-01 10:00+00', '2026-11-01 10:00+00');
SELECT * FROM tt_clock;

SET TIME ZONE 'UTC';
SELECT * FROM tt_clock;

SET TIME ZONE 'Asia/Dhaka';
SELECT max(plain) - min(plain) AS plain_gap,
       max(aware) - min(aware) AS aware_gap
FROM tt_clock;`}
              caption="প্রথম ফলাফলে plain দুই Row তেই 2026-11-01 10:00:00, আর aware এ 10:00:00+06 আর 16:00:00+06। UTC তে পড়লে plain একটুও বদলায় না, aware হয় 04:00:00+00 আর 10:00:00+00। শেষ ফলাফলে plain_gap 00:00:00, aware_gap 06:00:00। দুটো আলাদা মুহূর্তের মাঝের ছয় ঘণ্টা timestamp এ হারিয়ে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারাক শূন্য হয়ে যাওয়াটা শুধু শুরু। এর চেয়েও বিপজ্জনক হলো ক্রম উল্টে যাওয়া। ধরুন একই সকালে
                দুজন অতিথি শেষ আসনটার জন্য Booking করলেন। Oliver London থেকে, সেখানকার সকাল আটটায়। Rahim ঢাকা
                থেকে, এখানকার সকাল নয়টায়। আসল মুহূর্তের হিসাবে কে আগে? London এর সকাল আটটা মানে UTC সকাল আটটা,
                ঢাকায় তখন দুপুর দুইটা। ঢাকার সকাল নয়টা মানে UTC রাত তিনটা। তাই Rahim পাঁচ ঘণ্টা আগে। শেষ আসনটা
                Rahim এর।
              </ContentParagraph>
              <ContentParagraph>
                timestamp Column কিন্তু শুধু 08:00 আর 09:00 দেখে, আর রায় দেয় Oliver আগে। তৃতীয় Query টা আরও
                একটা ফাঁদ দেখায়: timestamp কে timestamptz এ বদলাতে চাইলে PostgreSQL ধরে নেয় লেখাটা Session এর
                TimeZone এর। এই পাতায় সেটা Asia/Dhaka, তাই Oliver এর সকাল আটটাকে ঢাকার সকাল আটটা ধরে নেওয়া
                হয়, যা ছয় ঘণ্টা ভুল। একই Column যদি UTC তে চলা কোনো Server পড়ে, সে অন্য রকম ভুল করবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শেষ আসনটা কে আগে চেয়েছিলেন"
              query={`DROP TABLE IF EXISTS tt_race;
CREATE TABLE tt_race (
  guest text,
  plain timestamp,
  aware timestamptz
);
INSERT INTO tt_race VALUES
  ('Oliver Bennett', '2026-11-01 08:00+00', '2026-11-01 08:00+00'),
  ('Rahim Uddin',    '2026-11-01 09:00+06', '2026-11-01 09:00+06');
SELECT guest, plain FROM tt_race ORDER BY plain;
SELECT guest, aware FROM tt_race ORDER BY aware;
SELECT guest, plain, plain::timestamptz AS guessed
FROM tt_race
ORDER BY guest;`}
              caption="plain অনুযায়ী সাজালে আগে Oliver, তারপর Rahim: ভুল। aware অনুযায়ী আগে Rahim (09:00:00+06), তারপর Oliver (14:00:00+06): ঠিক। শেষ ফলাফলে guessed এ Oliver এর সময় 2026-11-01 08:00:00+06, অথচ আসল মুহূর্ত ছিল 14:00:00+06। timestamp থেকে মুহূর্ত বানাতে গেলে PostgreSQL কে অনুমান করতে হয়, আর অনুমানটা আসে Session থেকে, Data থেকে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা মিল দিয়ে মনে রাখুন",
          content: (
            <ContentParagraph>
              timestamp হলো একটা চিরকুটে লেখা সকাল ৮টা। চিরকুটটা যে হাতে যায়, সে নিজের দেশের সকাল ৮টা ভেবে
              নেয়। timestamptz হলো একটা আন্তর্জাতিক বিমানের টিকিট, যেখানে মুহূর্তটা এমনভাবে লেখা যে পৃথিবীর
              যেকোনো বিমানবন্দরে সবাই একই মুহূর্ত বোঝে, শুধু নিজের ঘড়িতে পড়ে নেয়। Database এ চিরকুট জমালে
              প্রতিটা পাঠককে অনুমান করতে হয়। টিকিট জমালে কাউকে অনুমান করতে হয় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "why-timestamptz",
      subHeader: { index: "004", title: "Why timestamptz for Events" },
      title: <SectionTitle>ঘটনার সময় কেন সবসময় timestamptz</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেকে ভাবেন, আমাদের ব্যবসা তো শুধু বাংলাদেশে, সবাই ঢাকার ঘড়িতে চলে, তাহলে timestamp দিয়েই তো
                কাজ চলে যায়। চলুন দেখি এই যুক্তি কোথায় কোথায় ভেঙে পড়ে, আর কেন PostgreSQL এর নিজের Wiki পরিষ্কার
                করে বলে, মুহূর্ত রাখতে timestamp ব্যবহার করবেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>অতিথিরা সব এক দেশের না।</strong> Island Tours এর Customer তালিকাতেই আছেন Kolkata,
                  Kuala Lumpur আর London এর মানুষ। তাঁদের Booking, Payment আর বিমানের সময় আসে নিজের নিজের
                  ঘড়িতে, বা Airline এর মতো UTC তে।
                </ListItem>
                <ListItem>
                  <strong>Server রা সব এক ঘড়িতে চলে না।</strong> Cloud এর বেশিরভাগ Server এর ঘড়ি UTC তে চলে।
                  আপনার Laptop চলে ঢাকার ঘড়িতে। একটা timestamp Column দুই জায়গা থেকে পড়লে দুই রকম মুহূর্ত
                  বোঝায়, আগের অংশে যেমন দেখলেন। timestamptz এ সেই প্রশ্নই ওঠে না।
                </ListItem>
                <ListItem>
                  <strong>কিছু দেশে বছরে দুইবার ঘড়ি বদলায়।</strong> Daylight Saving Time বা DST চলা দেশে একটা
                  রাতে এক ঘণ্টা হারিয়ে যায়, আরেক রাতে এক ঘণ্টা দুইবার আসে। দেয়ালঘড়ির লেখা দিয়ে সেই রাতগুলোর
                  হিসাব রাখা অসম্ভব।
                </ListItem>
                <ListItem>
                  <strong>তুলনা, ক্রম আর ফারাক সবসময় ঠিক।</strong> কোনটা আগে, মাঝে কত সময়, শেষ ২৪ ঘণ্টায় কী কী
                  হলো, এই প্রশ্নগুলোর উত্তর timestamptz এ কখনো ভুল হয় না, কারণ সব মান একই মাপকাঠিতে, UTC তে
                  রাখা।
                </ListItem>
                <ListItem>
                  <strong>খরচ একই।</strong> দুটোই 8 bytes, দুটোই সমান দ্রুত। ঠিক জিনিসটা বেছে নিতে কোনো দাম
                  দিতে হয় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তৃতীয় কারণটা চোখে না দেখলে বিশ্বাস করা কঠিন। আজ, 1 November 2026, রবিবার, ঠিক সেই রকম একটা দিন
                New York এ। সেখানে রাত দুইটা বাজার মুহূর্তে ঘড়ি পিছিয়ে আবার একটা করা হয়, Daylight Saving শেষ।
                ফলে রাত দেড়টা আসে দুইবার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RepeatedHourDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের বক্সে Session এর ঘড়ি সাময়িকভাবে New York এ নেওয়া হয়েছে। প্রথম Query তে দুটো রাত দেড়টা,
              একটা EDT তে আর একটা EST তে। দ্বিতীয় Query মাপে 1 November এর শুরু থেকে 2 November এর শুরু পর্যন্ত
              আসলে কত সময়। শেষ লাইনে ঘড়ি আবার ঢাকায় ফেরানো হয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে রাতে দেড়টা দুইবার বাজে"
              query={`SET TIME ZONE 'America/New_York';
SELECT TIMESTAMPTZ '2026-11-01 01:30 EDT' AS first_0130,
       TIMESTAMPTZ '2026-11-01 01:30 EST' AS second_0130;

SELECT TIMESTAMPTZ '2026-11-02 00:00' - TIMESTAMPTZ '2026-11-01 00:00' AS real_length,
       TIMESTAMP   '2026-11-02 00:00' - TIMESTAMP   '2026-11-01 00:00' AS wall_length;

SET TIME ZONE 'Asia/Dhaka';  -- এই পাতার বাকি বক্সের জন্য ফিরিয়ে আনা`}
              caption="প্রথম ফলাফলে দুটো আলাদা মুহূর্ত: 2026-11-01 01:30:00-04 আর 2026-11-01 01:30:00-05, মাঝে পুরো এক ঘণ্টা। দ্বিতীয় ফলাফলে real_length 1 day 01:00:00, কারণ New York এর সেই দিনটা আসলে ২৫ ঘণ্টার। wall_length বলছে 1 day, কারণ timestamp ঘড়ি পেছানোর কথা জানেই না। সেদিন রাতের শিফটে কেউ কাজ করলে timestamp দিয়ে তাঁর মজুরি এক ঘণ্টা কম হিসাব হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বাংলাদেশে DST নেই, তাহলে এটা আমার কী কাজে লাগবে",
          content: (
            <ContentParagraph>
              এখন নেই, কিন্তু ছিল। 2009 সালে বাংলাদেশ ছয় মাসের জন্য ঘড়ি এক ঘণ্টা এগিয়ে রেখেছিল, অংশ ১০ এ সেটা
              Database থেকেই দেখবেন। আর আপনার অতিথি, Server বা Payment Gateway যে দেশে, সেখানে আজও DST চলতে
              পারে। timestamptz বেছে নিলে এসব নিয়ে আপনাকে ভাবতেই হয় না, PostgreSQL ভেবে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে সিদ্ধান্ত নিন। Priya Kolkata থেকে ঢাকায় আসছেন। বিমান ছাড়বে Kolkata র সকাল আটটায়
              (+05:30), নামবে ঢাকার সকাল দশটায় (+06)। ঘড়ির লেখা দেখে মনে হয় যাত্রা দুই ঘণ্টার। আসলে কতক্ষণ?
              উত্তরটা নির্ভর করবে আপনি Column এর কোন ধরন বেছে নেন তার উপর।
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
                  tt_ex2_flights Table টা বানান: guest (লেখা), departs_at আর arrives_at (দুটোই বিমানের একটা
                  মুহূর্ত, খালি রাখা যাবে না)। শুরুর কোডে INSERT আর যাচাইয়ের Query আগে থেকেই দেওয়া আছে, সেগুলো
                  যেমন আছে রেখে দিন। ঠিক ধরন বাছলে flight_time এ আসবে বিমানের আসল যাত্রার সময়।
                </>
              }
              starter={`DROP TABLE IF EXISTS tt_ex2_flights;

-- এখানে CREATE TABLE tt_ex2_flights লিখুন

INSERT INTO tt_ex2_flights VALUES
  ('Priya Sharma', '2026-11-20 08:00:00+05:30', '2026-11-20 10:00:00+06');
SELECT guest, (arrives_at - departs_at)::text AS flight_time
FROM tt_ex2_flights;`}
              hint={
                <>
                  timestamp দিয়ে চালিয়ে দেখুন flight_time কত আসে, তারপর ভাবুন +05:30 আর +06 কোথায় গেল।
                  Kolkata র সকাল আটটা মানে UTC রাত আড়াইটা, ঢাকার সকাল দশটা মানে UTC রাত চারটা।
                </>
              }
              solution={`SELECT * FROM (VALUES ('Priya Sharma', '01:30:00')) AS v(guest, flight_time);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "default-now",
      subHeader: { index: "005", title: "DEFAULT now()" },
      title: <SectionTitle>DEFAULT now(): Row নিজেই নিজের জন্মের সময় লিখে রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রায় প্রতিটা Table এ একটা created_at Column থাকে: Row টা কখন তৈরি হলো। এই মান App কে পাঠাতে
                বললে কোনো দিন কেউ ভুলে যাবে, কোনো দিন কোনো Server এর ঘড়ি পিছিয়ে থাকবে। তার চেয়ে ভালো হলো
                নিয়মটা Database এর ভেতরেই লিখে রাখা: কেউ কিছু না দিলে Database নিজেই এখনকার মুহূর্তটা বসিয়ে দেবে। এটাই DEFAULT।
                Island Tours এর bookings.booked_at ঠিক এভাবে বানানো:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>booked_at timestamptz NOT NULL DEFAULT now()</code>
              </ContentParagraph>
              <ContentParagraph>
                এখানে তিনটা টুকরো তিনটা কাজ করে। timestamptz বলে মানটা একটা মুহূর্ত। NOT NULL বলে এই ঘর কখনো
                খালি থাকবে না। DEFAULT now() বলে INSERT এ এই Column এর নাম না থাকলে, বা মানের জায়গায় DEFAULT
                শব্দটা লেখা থাকলে, now() এর মান বসবে। খেয়াল রাখুন, কেউ যদি ইচ্ছে করে NULL পাঠায়, DEFAULT কাজ করে
                না, NOT NULL তাকে Error দিয়ে থামিয়ে দেয়। NOT NULL আর DEFAULT এর পুরো গল্প আসবে{" "}
                <Link href="/sql/topic/basic-constraints" className={LINK}>
                  Basic Constraints
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                now() এর একটা স্বভাব জানা জরুরি, যেটা Module 04 এর{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Right Now
                </Link>{" "}
                অংশে প্রথম দেখেছিলেন: now() ফেরত দেয় Transaction শুরুর মুহূর্ত, প্রতিটা লাইনের আলাদা মুহূর্ত না।
                তাই একটা Transaction এর ভেতরে যত Row ঢোকানো হোক, সবার created_at হুবহু এক। প্রতিটা Row এর
                নিজের আসল মুহূর্ত চাইলে DEFAULT এ বসাতে হয় clock_timestamp()। নিচের বক্সে দুটোই একসাথে, আর
                তিনটা INSERT এর মাঝে pg_sleep দিয়ে ইচ্ছে করে একটু দেরি করানো হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Transaction, তিনটা Row"
              query={`DROP TABLE IF EXISTS tt_audit;
CREATE TABLE tt_audit (
  note       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  real_at    timestamptz NOT NULL DEFAULT clock_timestamp()
);
BEGIN;
INSERT INTO tt_audit (note) VALUES ('first');
SELECT pg_sleep(0.2);
INSERT INTO tt_audit (note) VALUES ('second');
SELECT pg_sleep(0.2);
INSERT INTO tt_audit (note) VALUES ('third');
COMMIT;

SELECT count(*)                   AS rows,
       count(DISTINCT created_at) AS created_values,
       count(DISTINCT real_at)    AS real_values
FROM tt_audit;`}
              caption="শেষ ফলাফল: rows 3, created_values 1, real_values 3। তিনটা Row এর created_at একই মুহূর্ত, Transaction শুরুর সময়। real_at তিনটাই আলাদা। আসল মুহূর্তগুলো প্রতিবার Run এ বদলায়, তাই এখানে শুধু গুনে দেখানো হয়েছে। চাইলে SELECT * FROM tt_audit; চালিয়ে নিজের চোখে দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনটা বেছে নেবেন? বেশিরভাগ সময় now() ই ঠিক। একটা Booking এর সাথে একই Transaction এ যদি একটা
                Payment আর একটা Audit Row ঢোকে, তিনটার সময় এক হলে বোঝা যায় এরা একই ঘটনার অংশ। clock_timestamp()
                দরকার হয় যখন একটা লম্বা Transaction এর ভেতরে প্রতিটা ধাপের আসল সময় মাপতে চান। CURRENT_TIMESTAMP
                লিখলে now() এর মতোই কাজ হয়, এটা SQL Standard এর নাম। date Column এর জন্য একই কাজ করে{" "}
                <code className={CODE}>DEFAULT current_date</code>।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা ফাঁদ, যেটায় বহু অভিজ্ঞ মানুষও পড়েছেন। now() এর বদলে কেউ যদি উদ্ধৃতিচিহ্নের ভেতরে{" "}
                <code className={CODE}>{"DEFAULT 'now'"}</code> লেখেন? PostgreSQL এ now একটা বিশেষ লেখা, যেটা
                timestamptz এ বদলালে এখনকার সময় দেয়। সমস্যা হলো, DEFAULT হিসেবে লিখলে বদলটা হয় একবারই, CREATE
                TABLE চালানোর মুহূর্তে। তারপর থেকে প্রতিটা নতুন Row পায় সেই একই পুরনো মুহূর্ত, মাসের পর মাস।
                PostgreSQL এর Docs এই কারণেই সংরক্ষিত কোডে now, today, tomorrow এর মতো লেখার বদলে Function
                ব্যবহার করতে বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="'now' বনাম now()"
              query={`DROP TABLE IF EXISTS tt_now_trap;
CREATE TABLE tt_now_trap (
  note   text,
  frozen timestamptz DEFAULT 'now',
  live   timestamptz DEFAULT now()
);
SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'tt_now_trap'
ORDER BY ordinal_position;

SELECT pg_sleep(1.5);
INSERT INTO tt_now_trap (note) VALUES ('দেড় সেকেন্ড পরে');
SELECT note, live - frozen >= INTERVAL '1 second' AS frozen_is_old
FROM tt_now_trap;`}
              caption="প্রথম ফলাফলে frozen এর DEFAULT একটা স্থির মুহূর্ত, ঠিক যখন আপনি Run চেপেছিলেন, শেষে ::timestamp with time zone। live এর DEFAULT লেখা now(), যেটা প্রতিবার নতুন করে হিসাব হয়। দেড় সেকেন্ড অপেক্ষার পরে ঢোকানো Row এ frozen_is_old আসে t: frozen Column আগেই পুরনো হয়ে গেছে, আর এক বছর পরেও ঠিক সেই মুহূর্তটাই বসাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "updated_at এর জন্য PostgreSQL এ DEFAULT যথেষ্ট না",
          content: (
            <ContentParagraph>
              DEFAULT কাজ করে শুধু INSERT এর সময়। Row টা পরে বদলালে কখন বদলাল, সেটা রাখতে updated_at Column
              চাই, আর প্রতিটা UPDATE এ সেটা নতুন করে বসাতে হয়। MySQL এ এর জন্য ON UPDATE CURRENT_TIMESTAMP আছে,
              অংশ ১৩ তে দেখবেন। PostgreSQL এ তেমন কিছু নেই। হয় App প্রতিটা UPDATE এ নিজে updated_at = now()
              লেখে, নয়তো একটা Trigger কাজটা করে, যেটা শিখবেন{" "}
              <Link href="/sql/topic/triggers" className={LINK}>
                Triggers
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "precision",
      subHeader: { index: "006", title: "Precision" },
      title: <SectionTitle>Precision: সেকেন্ডের পরে কয়টা ঘর রাখবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                timestamptz, timestamp, time আর interval সেকেন্ডের পরে ছয়টা দশমিক ঘর পর্যন্ত রাখে, অর্থাৎ এক
                সেকেন্ডের দশ লাখ ভাগের এক ভাগ, এক মাইক্রোসেকেন্ড। বেশিরভাগ সময় এতটা দরকার নেই, আর কখনো কখনো
                এটা ঝামেলাও করে। তাই ধরনের নামের পরে বন্ধনীতে একটা সংখ্যা দিয়ে বলে দেওয়া যায় কয়টা ঘর রাখতে
                হবে: <code className={CODE}>timestamptz(0)</code> মানে শুধু পুরো সেকেন্ড,{" "}
                <code className={CODE}>time(3)</code> মানে মিলিসেকেন্ড পর্যন্ত। সংখ্যাটা হতে পারে 0 থেকে 6। কিছু
                না লিখলে 6।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে গুরুত্বপূর্ণ কথাটা হলো: বাড়তি ঘরগুলো কেটে ফেলা হয় না, গোল করা হয়। .5 বা তার বেশি হলে
                উপরের দিকে, কম হলে নিচের দিকে। আর গোল করতে গিয়ে মান পরের সেকেন্ডে, পরের মিনিটে, এমনকি পরের দিনে
                চলে যেতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গোল করা, কাটা না"
              query={`SELECT TIMESTAMPTZ(0) '2026-11-01 10:00:00.5+06' AS half_up,
       TIMESTAMPTZ(0) '2026-11-01 10:00:00.4+06' AS below_half,
       TIME(3)        '09:30:15.123456'          AS three_digits,
       TIMESTAMP(2)   '2026-11-01 23:59:59.999'  AS next_day;

SELECT TIMESTAMPTZ '2026-11-01 10:00:00.123456789+06' AS nine_digits_in;`}
              caption="half_up আসে 10:00:01+06, below_half আসে 10:00:00+06, three_digits আসে 09:30:15.123। next_day দেখুন: দুই ঘর রাখতে গিয়ে .999 গোল হয়ে পুরো এক সেকেন্ড, আর 1 November এর শেষ মুহূর্ত হয়ে গেছে 2026-11-02 00:00:00। শেষ Query তে নয়টা ঘর দিলেও রাখা হয় ছয়টা, গোল করে: .123457।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Column এ Precision দিলে সেই নিয়ম প্রতিটা INSERT এ খাটে। নিচের tt_checkins এ check-in এর মুহূর্ত
              রাখা হয় পুরো সেকেন্ডে। দুজন অতিথি মাঝরাতের ঠিক আগে check-in করলেন, একজন .6 সেকেন্ডে, আরেকজন .4
              সেকেন্ডে। দিন ধরে গুনলে কে কোন দিনে পড়েন?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাঝরাতের আগের দুটো check-in"
              query={`DROP TABLE IF EXISTS tt_checkins;
CREATE TABLE tt_checkins (
  guest         text NOT NULL,
  checked_in_at timestamptz(0) NOT NULL
);
INSERT INTO tt_checkins VALUES
  ('Mitu Rahman', '2026-11-01 23:59:59.6+06'),
  ('Shuvo Das',   '2026-11-01 23:59:59.4+06');
SELECT guest, checked_in_at, checked_in_at::date AS counted_on
FROM tt_checkins
ORDER BY guest;

SELECT column_name, data_type, datetime_precision
FROM information_schema.columns
WHERE table_name = 'tt_checkins'
ORDER BY ordinal_position;`}
              caption="Mitu এর মুহূর্ত গোল হয়ে 2026-11-02 00:00:00+06, তাই তাঁকে গোনা হবে 2 November এ। Shuvo রয়ে গেলেন 2026-11-01 23:59:59+06 এ, 1 November এ। দ্বিতীয় ফলাফলে checked_in_at এর datetime_precision 0, আর guest এর ঘর ফাঁকা, কারণ লেখার কোনো Precision হয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                6 এর বেশি দিলে কী হয়? Error না, একটা WARNING, আর PostgreSQL নিজেই সেটা কমিয়ে 6 করে নেয়। ব্রাউজারের
                বক্স WARNING দেখায় না, তাই নিচে psql এর আসল ফলাফল দেওয়া হলো, PostgreSQL 18 থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: precision 7",
          code: `island_tours=# CREATE TABLE tt_too_precise (happened_at timestamptz(7));
WARNING:  TIMESTAMP(7) WITH TIME ZONE precision reduced to maximum allowed, 6
LINE 1: CREATE TABLE tt_too_precise (happened_at timestamptz(7));
                                                 ^
WARNING:  TIMESTAMP(7) WITH TIME ZONE precision reduced to maximum allowed, 6
CREATE TABLE
island_tours=# \\d tt_too_precise
                     Table "public.tt_too_precise"
   Column    |            Type             | Collation | Nullable | Default
-------------+-----------------------------+-----------+----------+---------
 happened_at | timestamp(6) with time zone |           |          |`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>তাহলে কখন কোন Precision?</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কিছু না লেখা (6):</strong> ঘটনার মুহূর্তের জন্য প্রায় সবসময় এটাই। একই সেকেন্ডে দুটো
                  Payment এলে মাইক্রোসেকেন্ড বলে দেয় কে আগে। Island Tours এর সব timestamptz এমনই।
                </ListItem>
                <ListItem>
                  <strong>timestamptz(0) দেওয়ার আগে দুবার ভাবুন:</strong> গোল করার কারণে DEFAULT now() এর মান আধা
                  সেকেন্ড পর্যন্ত ভবিষ্যতে চলে যেতে পারে, অর্থাৎ Row টা যেন এমন মুহূর্তে তৈরি হয়েছে যেটা এখনো আসেনি।
                  আর মাঝরাতের কাছের মান পরের দিনে চলে যায়, উপরে যেমন দেখলেন। PostgreSQL এর Wiki ঠিক এই কারণে
                  ঘটনার Column এ timestamp(0) বা timestamptz(0) ব্যবহার না করতে বলে।
                </ListItem>
                <ListItem>
                  <strong>JavaScript এর সাথে মেলাতে:</strong> JavaScript এর Date মিলিসেকেন্ড পর্যন্ত রাখে, তিন ঘর।
                  ছয় ঘরের মান App ঘুরে তিন ঘর হয়ে ফেরত এলে আর আসল মানের সমান থাকে না, তাই{" "}
                  <code className={CODE}>WHERE created_at = ...</code> দিয়ে খুঁজলে Row পাওয়া যায় না। সমাধান হলো
                  সময় দিয়ে না খুঁজে id দিয়ে খোঁজা, বা দুই দিকেই{" "}
                  <code className={CODE}>{"date_trunc('milliseconds', ...)"}</code>।
                </ListItem>
                <ListItem>
                  <strong>time(0):</strong> রোজকার সময়সূচি, যেখানে সেকেন্ডের ভগ্নাংশের কোনো মানে নেই। ড্রাইভারকে
                  কেউ 06:29:59.6 এ তৈরি থাকতে বলে না, আর এখানে now() এর মতো কিছু গোল হয়ে ভবিষ্যতে যাওয়ার ভয় নেই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুধু দেখানোর সময় সেকেন্ডের ভগ্নাংশ বাদ দিতে চাইলে Column এর Precision কমানোর দরকার নেই।
                Query তে <code className={CODE}>{"date_trunc('second', checked_in_at)"}</code> লিখলে মান কাটা হয়,
                গোল না, তাই 23:59:59.6 থাকে 23:59:59 এ। Column এর Precision হলো স্থায়ী সিদ্ধান্ত, date_trunc শুধু
                সেই Query র জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  tt_ex3_ferry Table টা বানান: guest (লেখা, খালি রাখা যাবে না), ferry_leaves (রোজ Ferry ঘড়ির
                  কয়টায় ছাড়ে, সেকেন্ডের ভগ্নাংশ ছাড়া, খালি থাকতে পারে), checked_in_at (অতিথি যে মুহূর্তে
                  ঘাটে check-in করলেন, শুধু পুরো সেকেন্ড, খালি রাখা যাবে না)। শুরুর কোডের INSERT আর যাচাইয়ের
                  Query যেমন আছে রেখে দিন।
                </>
              }
              starter={`DROP TABLE IF EXISTS tt_ex3_ferry;

-- এখানে CREATE TABLE tt_ex3_ferry লিখুন

INSERT INTO tt_ex3_ferry VALUES
  ('Kamal Hasan', '06:29:59.6', '2026-11-01 23:59:59.6+06');
SELECT guest,
       ferry_leaves::text        AS leaves,
       checked_in_at::text       AS checked_in,
       checked_in_at::date::text AS check_in_day
FROM tt_ex3_ferry;`}
              hint={
                <>
                  সেকেন্ডের ভগ্নাংশ ছাড়া মানে Precision 0। রোজকার ঘড়ির জন্য time(0), মুহূর্তের জন্য
                  timestamptz(0)। ঠিক হলে check_in_day আর 1 November থাকবে না, আর এই ফলাফলটাই দেখায় কেন ঘটনার
                  Column এ (0) দেওয়ার আগে ভাবতে হয়।
                </>
              }
              solution={`SELECT * FROM (VALUES
  ('Kamal Hasan', '06:30:00', '2026-11-02 00:00:00+06', '2026-11-02')
) AS v(guest, leaves, checked_in, check_in_day);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "infinity",
      subHeader: { index: "007", title: "infinity and Special Values" },
      title: <SectionTitle>infinity: যে Offer এর কোনো শেষ নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের তালিকার একটা তথ্য ছিল: বিনা খরচের Pickup এর Offer কবে পর্যন্ত চলবে। কিছু Offer এর
                শেষ তারিখ আছে, যেমন ঈদের Offer চলবে নভেম্বরের শেষ পর্যন্ত। কিন্তু নিয়মিত অতিথিদের Offer এর কোনো
                শেষ নেই, যতদিন না কেউ সেটা বন্ধ করেন। শেষ নেই, এটা Column এ কীভাবে লিখবেন?
              </ContentParagraph>
              <ContentParagraph>
                প্রথম যে উত্তর মাথায় আসে, তা হলো NULL। কিন্তু NULL এর মানে অজানা, শেষহীন না। আর NULL নিয়ে প্রতিটা
                তুলনা অজানা ফেরত দেয়, তাই এই মুহূর্তে কোন Offer চলছে, সেই প্রশ্নের প্রতিটা Query তে মনে করে লিখতে
                হয় <code className={CODE}>OR valid_until IS NULL</code>। একবার ভুলে গেলেই শেষহীন Offer গুলো
                তালিকা থেকে চুপচাপ বাদ পড়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর date, timestamp আর timestamptz এর জন্য দুটো বিশেষ মান আছে:{" "}
                <code className={CODE}>{"'infinity'"}</code>, যেটা সব মুহূর্তের পরে, আর{" "}
                <code className={CODE}>{"'-infinity'"}</code>, যেটা সব মুহূর্তের আগে। শেষহীন Offer এর শেষ সময়
                infinity হলে Column টা NOT NULL রাখা যায়, আর সাধারণ BETWEEN বা {"<"} তুলনাই ঠিক উত্তর দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শেষহীন Offer, NULL ছাড়া"
              query={`DROP TABLE IF EXISTS tt_offers;
CREATE TABLE tt_offers (
  code        text        NOT NULL,
  valid_from  timestamptz NOT NULL,
  valid_until timestamptz NOT NULL DEFAULT 'infinity'
);
INSERT INTO tt_offers (code, valid_from, valid_until)
VALUES ('EID26', '2026-11-01 00:00+06', '2026-11-30 23:59:59+06');
INSERT INTO tt_offers (code, valid_from)
VALUES ('LOYAL', '2026-01-01 00:00+06');
SELECT code, valid_from, valid_until, isfinite(valid_until) AS has_end
FROM tt_offers
ORDER BY code;

SELECT code
FROM tt_offers
WHERE TIMESTAMPTZ '2027-06-01 12:00+06' BETWEEN valid_from AND valid_until;`}
              caption="প্রথম ফলাফলে EID26 এর শেষ 2026-11-30 23:59:59+06, has_end t। LOYAL এর valid_until লেখা নেই, তাই DEFAULT থেকে infinity, has_end f। দ্বিতীয় Query জিজ্ঞেস করে 2027 সালের 1 জুন দুপুরে কোন Offer চলবে: শুধু LOYAL। কোনো OR IS NULL লাগেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>isfinite()</code> বলে দেয় মানটা সাধারণ নাকি infinity। আরও কয়েকটা বিশেষ
                লেখা আছে, যেগুলো ঢোকানোর সময় PostgreSQL চেনে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>epoch</strong>: 1970-01-01 00:00:00 UTC, Unix এর সময় গোনার শূন্য বিন্দু। অংশ ১৩ তে
                  MySQL এর TIMESTAMP এর গল্পে এটা আবার আসবে।
                </ListItem>
                <ListItem>
                  <strong>infinity আর -infinity</strong>: date, timestamp আর timestamptz এ কাজ করে। PostgreSQL
                  18 এ interval এও।
                </ListItem>
                <ListItem>
                  <strong>now, today, tomorrow, yesterday</strong>: হাতে লেখা Query তে সুবিধার, কিন্তু DEFAULT,
                  View বা Function এর মতো সংরক্ষিত জায়গায় বিপজ্জনক, অংশ ৫ এর ফাঁদের কারণে। সেখানে সবসময় now()
                  বা current_date এর মতো Function।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                infinity এর সাথে হিসাব করতে গেলে কী হয়? তুলনা সবসময় কাজ করে। timestamptz থেকে বিয়োগ করলে
                PostgreSQL 18 উত্তর দেয় infinity। কিন্তু দুটো date বিয়োগ করলে ফলাফল হওয়ার কথা একটা পূর্ণ সংখ্যা,
                দিনের সংখ্যা, আর অসীম কোনো পূর্ণ সংখ্যা নেই, তাই Error। বক্সের শেষ লাইনটা ইচ্ছে করে সেই Error
                দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="infinity এর সাথে হিসাব"
              query={`SELECT 'epoch'::timestamptz                     AS epoch_in_dhaka,
       'infinity'::date > DATE '5874897-12-31'  AS beyond_last_day,
       '-infinity'::date < DATE '4713-01-01 BC' AS before_first_day;

SELECT 'infinity'::timestamptz - TIMESTAMPTZ '2026-11-01 10:00+06' AS left_forever;

SELECT 'infinity'::date - DATE '2026-11-01' AS days_left;`}
              caption="epoch ঢাকার ঘড়িতে 1970-01-01 06:00:00+06, আর দুটো তুলনাই t: infinity সবচেয়ে বড় সাধারণ তারিখের চেয়েও বড়, -infinity সবচেয়ে ছোটটার চেয়েও ছোট। left_forever আসে infinity। শেষ Query তে ERROR: cannot subtract infinite dates। তাই infinity রাখা Column নিয়ে দিন গোনার আগে isfinite() দিয়ে ছেঁকে নিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "infinity নাকি NULL, কীভাবে ঠিক করবেন",
          content: (
            <ContentParagraph>
              নিজেকে জিজ্ঞেস করুন: মানটা কি জানা নেই, নাকি জানা আছে যে কোনো শেষ নেই? চাকরি ছাড়ার তারিখ এখনো
              জানা নেই, সেখানে NULL ঠিক। Offer এর কোনো শেষ নেই, এটা একটা জানা সিদ্ধান্ত, সেখানে infinity। প্রথমটা
              প্রশ্নবোধক চিহ্ন, দ্বিতীয়টা একটা উত্তর। App এর Code এ infinity কে আলাদা করে দেখাতে হবে, যেমন চিরকাল
              লিখে, কারণ সব Programming Language এর তারিখের ধরন এটা চেনে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  tt_ex4_offers Table টা বানান: code (লেখা, খালি রাখা যাবে না), starts_at (Offer শুরুর মুহূর্ত,
                  খালি রাখা যাবে না, কেউ না দিলে Row তৈরির মুহূর্ত), ends_at (Offer শেষের মুহূর্ত, খালি রাখা যাবে
                  না, কেউ না দিলে কোনো শেষ নেই)। শুরুর কোডের দুটো INSERT আর যাচাইয়ের Query যেমন আছে রেখে দিন।
                  যাচাইয়ের Query টা starts_at এর DEFAULT সত্যিই প্রতিবার নতুন মুহূর্ত দেয় কিনা, সেটাও দেখে।
                </>
              }
              starter={`DROP TABLE IF EXISTS tt_ex4_offers;

-- এখানে CREATE TABLE tt_ex4_offers লিখুন

INSERT INTO tt_ex4_offers (code) VALUES ('WINTER26');
INSERT INTO tt_ex4_offers (code, ends_at) VALUES ('EID26', '2026-12-31 23:59:59+06');
SELECT code,
       ends_at::text     AS ends,
       isfinite(ends_at) AS has_end,
       (SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'tt_ex4_offers' AND column_name = 'starts_at')
         IN ('now()', 'CURRENT_TIMESTAMP', 'transaction_timestamp()') AS live_default
FROM tt_ex4_offers
ORDER BY code;`}
              hint={
                <>
                  দুটো DEFAULT লাগবে। একটায় Function, যেটা প্রতিবার এখনকার মুহূর্ত দেয়, উদ্ধৃতিচিহ্নের ভেতরের
                  লেখা না। আরেকটায় সেই বিশেষ মান, যেটা সব মুহূর্তের পরে। live_default এ f এলে অংশ ৫ এর ফাঁদটা
                  আবার পড়ুন।
                </>
              }
              orderMatters
              solution={`SELECT * FROM (VALUES
  ('EID26',    '2026-12-31 23:59:59+06', true,  true),
  ('WINTER26', 'infinity',               false, true)
) AS v(code, ends, has_end, live_default);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "ranges",
      subHeader: { index: "008", title: "Ranges and Limits" },
      title: <SectionTitle>কত পেছনে, কত সামনে: প্রতিটা ধরনের সীমা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা ধরনের একটা সবচেয়ে ছোট আর একটা সবচেয়ে বড় মান আছে। সংখ্যার ধরনে যেমন smallint 32767 এর
                বেশি নিতে পারে না, সময়ের ধরনেও তেমন সীমা আছে। PostgreSQL এর সীমাগুলো এত দূরে যে বাস্তবে প্রায়
                কখনো ছোঁয়া লাগে না। তবু জানা দরকার, কারণ অন্য Database এ, বিশেষ করে MySQL এ, একটা সীমা আমাদের খুব
                কাছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ধরন", "জায়গা", "সবচেয়ে ছোট", "সবচেয়ে বড়", "সূক্ষ্মতা"],
          rows: [
            ["date", "4 bytes", "4713 BC", "5874897 AD", "1 দিন"],
            ["timestamp", "8 bytes", "4713 BC", "294276 AD", "1 মাইক্রোসেকেন্ড"],
            ["timestamptz", "8 bytes", "4713 BC", "294276 AD", "1 মাইক্রোসেকেন্ড"],
            ["time", "8 bytes", "00:00:00", "24:00:00", "1 মাইক্রোসেকেন্ড"],
            ["timetz", "12 bytes", "00:00:00+1559", "24:00:00-1559", "1 মাইক্রোসেকেন্ড"],
            ["interval", "16 bytes", "-178000000 years", "178000000 years", "1 মাইক্রোসেকেন্ড"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সংখ্যাগুলো PostgreSQL এর Docs এর টেবিল থেকে। দুটো জিনিস খেয়াল করুন। date এর চেয়ে timestamp
              অনেক কম দূর যায়, কারণ timestamp কে মাইক্রোসেকেন্ড গুনতে হয়, আর 8 bytes এ যত মাইক্রোসেকেন্ড আঁটে,
              তাতে দুই লাখ বছরের একটু বেশি হয়। আর time এর শেষে 24:00:00, যেটা 00:00:00 থেকে আলাদা: দিনের শেষ
              মুহূর্ত, যেমন দোকান খোলা 18:00 থেকে 24:00 পর্যন্ত।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimeRangeRulerDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সীমার একদম কিনারায়"
              query={`SELECT DATE '4713-01-01 BC'                     AS first_date,
       DATE '5874897-12-31'                     AS last_date,
       TIMESTAMP '294276-12-31 23:59:59.999999' AS last_timestamp,
       TIME '24:00:00'                          AS end_of_day;`}
              caption="চারটা মানই চলে: 4713-01-01 BC, 5874897-12-31, 294276-12-31 23:59:59.999999 আর 24:00:00। BC মানে খ্রিস্টপূর্ব। এর এক দিন বা এক মাইক্রোসেকেন্ড বাইরে গেলেই Error, নিচের বক্সে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সীমার বাইরে এক দিন"
              query={`SELECT DATE '5874898-01-01';`}
              caption={'ERROR: date out of range: "5874898-01-01"। SQLSTATE 22008, নাম datetime_field_overflow। App এর Code এ এই সংখ্যা দেখে বোঝা যায় সমস্যাটা সময়ের মানে।'}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সীমার ভেতরে থেকেও একটা মান অবৈধ হতে পারে, যদি সেই তারিখ ক্যালেন্ডারে না থাকে। PostgreSQL প্রতিটা
                তারিখ যাচাই করে: মাসে কয়দিন, কোন বছর অধিবর্ষ। 2028 অধিবর্ষ, তাই 29 ফেব্রুয়ারি আছে। 2026 না।
                ভুল তারিখ ঢুকিয়ে পরে খুঁজে বের করার চেয়ে ঢোকার দরজাতেই থামিয়ে দেওয়া অনেক ভালো, আর ঠিক এটাই
                হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্যালেন্ডারে নেই এমন দিন"
              query={`DROP TABLE IF EXISTS tt_days;
CREATE TABLE tt_days (d date);
INSERT INTO tt_days VALUES ('2028-02-29');
SELECT d FROM tt_days;

INSERT INTO tt_days VALUES ('2026-02-29');`}
              caption={'2028-02-29 ঢোকে, SELECT দেখায় একটা Row। 2026-02-29 এ ERROR: date/time field value out of range: "2026-02-29", একই SQLSTATE 22008। আগের MySQL এর কিছু Mode এ এমন মান 0000-00-00 হয়ে চুপচাপ ঢুকে যেত, অংশ ১৩ তে দেখবেন আজকের MySQL কী করে।'}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "interval-columns",
      subHeader: { index: "009", title: "interval Columns" },
      title: <SectionTitle>interval Column: কতক্ষণ, সেটাও একটা মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                interval কে আপনি Module 04 এ চিনেছেন হিসাবের অংশ হিসেবে, যেমন{" "}
                <code className={CODE}>{"paid_at + INTERVAL '7 days'"}</code>। কিন্তু interval একটা পুরোদস্তুর
                Column এর ধরনও। প্রতিটা ট্যুরের বাতিল করার সুযোগ কত আগে পর্যন্ত, বিমানবন্দর থেকে হোটেলে যেতে কত
                সময়, একটা Booking কতক্ষণ Pending থাকতে পারে, এগুলো সব দৈর্ঘ্য। দৈর্ঘ্য রাখার জন্য interval।
              </ContentParagraph>
              <ContentParagraph>
                ভেতরে interval তিনটা আলাদা ঘরে মান রাখে: মাস, দিন, আর মাইক্রোসেকেন্ড। কারণ এই তিনটা একে অন্যে
                নিখুঁতভাবে বদলানো যায় না। এক মাস কখনো ২৮ দিন, কখনো ৩১। এক দিন সাধারণত ২৪ ঘণ্টা, কিন্তু New York
                এর আজকের দিনটা ২৫ ঘণ্টার। তাই আপনি যেভাবে লেখেন, interval সেভাবেই মনে রাখে: 2 days লিখলে 2 days,
                48 hours লিখলে 48:00:00।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ট্যুরের নিয়মে interval"
              query={`DROP TABLE IF EXISTS tt_tour_rules;
CREATE TABLE tt_tour_rules (
  tour_id       integer PRIMARY KEY,
  cancel_window interval NOT NULL DEFAULT '48 hours',
  drive_time    interval NOT NULL
);
INSERT INTO tt_tour_rules VALUES
  (1, '2 days',  '10 hours'),
  (2, DEFAULT,   '90 minutes'),
  (3, '1 week',  '3 hours 30 minutes');
SELECT * FROM tt_tour_rules ORDER BY tour_id;

SELECT tour_id,
       cancel_window,
       cancel_window = INTERVAL '48 hours' AS same_as_48_hours
FROM tt_tour_rules
ORDER BY tour_id;`}
              caption="প্রথম ফলাফলে cancel_window তিন রকম: 2 days, 48:00:00 আর 7 days। 90 minutes হয়ে গেছে 01:30:00, কারণ মিনিট আর ঘণ্টা একই ঘরে যায়। 1 week হয়েছে 7 days। দ্বিতীয় ফলাফলে Tour 1 আর 2 দুটোই t: তুলনার সময় PostgreSQL এক দিনকে ২৪ ঘণ্টা ধরে। লেখা আলাদা, তুলনায় সমান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তুলনায় সমান হলেও হিসাবে সবসময় সমান না। 1 day যোগ করলে PostgreSQL ঘড়ির পরের দিনের একই সময়ে যায়,
                আর 24 hours যোগ করলে ঠিক চব্বিশ ঘণ্টা পরের মুহূর্তে যায়। DST এর দিনে দুটো আলাদা উত্তর দেয়। এই
                পার্থক্যের পুরো হিসাব Module 04 এর{" "}
                <Link href="/sql/topic/date-time-functions" className={LINK}>
                  Intervals and Series
                </Link>{" "}
                অংশে আছে। Column বানানোর সময় এর মানে একটাই: যেভাবে নিয়মটা মানুষ বলেন, সেভাবেই লিখুন। বাতিলের
                নিয়ম যদি হয় দুই দিন আগে, লিখুন 2 days। যদি হয় ৪৮ ঘণ্টা আগে, লিখুন 48 hours।
              </ContentParagraph>
              <ContentParagraph>
                একটা ধরনের ফাঁদও আছে। date থেকে interval বিয়োগ করলে ফল আসে timestamp, timestamptz না। নিচের বক্সে
                প্রতিটা Departure এর শেষ বিনা খরচে বাতিলের সময় বের করা হয়েছে, আর pg_typeof দেখাচ্ছে ধরনটা কী।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Departure থেকে বাতিলের শেষ সময়"
              query={`SELECT d.departure_id,
       d.starts_on,
       r.cancel_window,
       d.starts_on - r.cancel_window            AS last_free_cancel,
       pg_typeof(d.starts_on - r.cancel_window) AS result_type
FROM departures d
JOIN tt_tour_rules r ON r.tour_id = d.tour_id
WHERE d.departure_id IN (8, 10, 11)
ORDER BY d.departure_id;`}
              caption="তিনটা Row: 8 নম্বর 2026-11-18 00:00:00, 10 নম্বর 2026-11-25 00:00:00, 11 নম্বর 2026-11-27 00:00:00। result_type তিনটাতেই timestamp without time zone। আগের বক্সটা না চালিয়ে থাকলে আগে সেটা চালান, কারণ এই Query tt_tour_rules পড়ে। এই ফলাফল কোনো Column এ রাখার আগে মুহূর্তে বদলাতে হবে, অংশ ১১ তে দেখবেন কীভাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দৈর্ঘ্য রাখতে অনেক Team interval এর বদলে একটা পূর্ণ সংখ্যার Column রাখে, যেমন drive_minutes
                integer। দুটোরই যুক্তি আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>interval:</strong> একক মানের সাথেই থাকে, তাই 90 মানে মিনিট নাকি সেকেন্ড, এই
                  বিভ্রান্তি নেই। সরাসরি timestamptz এ যোগ করা যায়। মাস আর দিনের মতো মানুষের এককও রাখা যায়।
                </ListItem>
                <ListItem>
                  <strong>integer:</strong> যেকোনো Programming Language সহজে পড়ে, যোগফল আর গড় সরল। একক কী, সেটা
                  Column এর নামে লিখে দিতে হয়, যেমন drive_minutes।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এর tours Table এ ট্যুরের দৈর্ঘ্য আছে duration_days integer হিসেবে। সেটা ঠিক সিদ্ধান্ত,
                কারণ ট্যুর সবসময় পুরো দিনে মাপা হয়, ঘণ্টা মিনিটের প্রশ্ন নেই। আর একটা কথা: ঘড়ির সময় রাখার time
                ধরনটা দিয়ে কখনো দৈর্ঘ্য রাখবেন না। time 24:00 পেরোতে পারে না, ঘুরে আবার শূন্য থেকে শুরু করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="time ঘুরে যায়, interval বাড়ে"
              query={`SELECT TIME '06:30' + INTERVAL '20 hours'     AS time_wraps,
       INTERVAL '06:30' + INTERVAL '20 hours' AS interval_grows;`}
              caption="time_wraps আসে 02:30:00, যেন সাড়ে ছয় ঘণ্টা আর বিশ ঘণ্টা মিলে আড়াই ঘণ্টা। interval_grows আসে 26:30:00, যা ঠিক। দৈর্ঘ্যের জন্য time ব্যবহার করলে প্রথম লম্বা যাত্রাতেই হিসাব ভুল হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "interval এর ঘর বেঁধে দেওয়া",
          content: (
            <ContentParagraph>
              interval এর পরে কোন ঘরগুলো রাখা হবে, সেটাও বলে দেওয়া যায়, যেমন{" "}
              <code className={CODE}>interval HOUR TO MINUTE</code>। তখন সেকেন্ডের অংশ বাদ যায়। এটা খুব বেশি
              দেখা যায় না, আর এটা মান যাচাই করে না, শুধু নিচের ঘরগুলো ফেলে দেয়। নিয়ম বেঁধে দিতে চাইলে CHECK
              Constraint ভালো উপায়, যেমন drive_time এর মান শূন্যের বেশি আর বারো ঘণ্টার কম, যেটা আসবে Basic
              Constraints লেসনে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "store-the-instant",
      subHeader: { index: "010", title: "Store the Instant, Not the Zone" },
      title: <SectionTitle>Time Zone রাখবেন না, মুহূর্ত রাখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাম শুনে মনে হয় timestamp with time zone একটা মুহূর্তের সাথে একটা Time Zone ও রাখে। রাখে না।
                PostgreSQL এর Docs পরিষ্কার বলে, মান ভেতরে রাখা হয় UTC তে, আর যে Time Zone দিয়ে লেখা হয়েছিল,
                সেটা রাখা হয় না। প্রথমে এটা অদ্ভুত লাগে, কিন্তু এটাই ঠিক নকশা। একটা Booking কখন হলো, সেই প্রশ্নের
                উত্তর একটা মুহূর্ত। কোন ঘড়িতে সেটা দেখাবেন, সেটা পাঠকের প্রশ্ন, Booking এর না।
              </ContentParagraph>
              <ContentParagraph>
                তবু কখনো কখনো একজন মানুষের নিজের ঘড়িটা জানা দরকার হয়। Oliver কে Email এ তাঁর নিজের সময়ে
                Booking এর সময় লিখতে চান, বা Priya কে সকাল নয়টায় মনে করিয়ে দিতে চান, Kolkata র সকাল নয়টায়।
                তখন নিয়ম হলো: মুহূর্তটা থাকবে timestamptz এ, আর মানুষের Time Zone থাকবে আলাদা একটা text Column
                এ, জায়গার নাম হিসেবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা অতিথির নিজের ঘড়ি"
              query={`DROP TABLE IF EXISTS tt_guest_zones;
CREATE TABLE tt_guest_zones (
  customer_id integer PRIMARY KEY,
  home_zone   text    NOT NULL
);
INSERT INTO tt_guest_zones VALUES
  (9,  'Asia/Kolkata'),
  (10, 'Asia/Kuala_Lumpur'),
  (11, 'Europe/London');
SELECT c.full_name,
       b.booking_id,
       b.booked_at,
       b.booked_at AT TIME ZONE z.home_zone AS their_wall_clock,
       z.home_zone
FROM bookings b
JOIN customers c      ON c.customer_id = b.customer_id
JOIN tt_guest_zones z ON z.customer_id = b.customer_id
ORDER BY b.booked_at;`}
              caption="৫টা Row। Oliver এর Booking 12: ঢাকায় 15:30, London এ 09:30, ছয় ঘণ্টার ফারাক। তাঁর Booking 19: ঢাকায় 13:40, London এ 08:40, ফারাক পাঁচ ঘণ্টা, কারণ অক্টোবরের শুরুতে London গ্রীষ্মের ঘড়িতে ছিল। Priya র ফারাক সবসময় আধা ঘণ্টা, Aiman এর দুই ঘণ্টা। একই home_zone, অথচ Oliver এর দুই Row তে দুই রকম Offset।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের বক্সের শেষ কথাটাই এই অংশের মূল শিক্ষা। home_zone এ যদি Europe/London না লিখে +00 লিখতেন,
                অক্টোবরের Booking এর সময় এক ঘণ্টা ভুল দেখাত। Offset হলো একটা মুহূর্তের সত্য, আর জায়গার নাম হলো
                সব মুহূর্তের নিয়মের খাতা। এই নামগুলো আসে IANA Time Zone Database থেকে, যেটা পৃথিবীর প্রতিটা জায়গার
                ঘড়ির ইতিহাস আর নিয়ম রাখে, আর সরকারগুলো নিয়ম বদলালে বছরে কয়েকবার হালনাগাদ হয়।
              </ContentParagraph>
              <ContentParagraph>
                আর এই ইতিহাসে আমাদের নিজের দেশও আছে। 2009 সালের 19 জুন রাত এগারোটায় বাংলাদেশ ঘড়ি এক ঘণ্টা এগিয়ে
                দিয়েছিল, বছরের শেষে আবার পিছিয়ে এনেছিল। Asia/Dhaka নামটা সেটা মনে রাখে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ZoneNameVsOffsetDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="2009 সালের ঢাকার ঘড়ি"
              query={`SELECT TIMESTAMPTZ '2009-07-01 12:00 Asia/Dhaka' AS mid_2009,
       TIMESTAMPTZ '2010-07-01 12:00 Asia/Dhaka' AS mid_2010;

SELECT TIMESTAMPTZ '2009-07-01 12:00+06' AS saved_with_offset;`}
              caption="mid_2009 আসে 2009-07-01 12:00:00+07, mid_2010 আসে 2010-07-01 12:00:00+06। একই জায়গা, একই দুপুর বারোটা, দুই বছরে দুই রকম Offset। দ্বিতীয় Query দেখায় +06 ধরে নিয়ে রাখলে কী হতো: ঢাকার ঘড়িতে সেটা আসলে দুপুর একটা, 13:00:00+07। Offset ধরে নিলে এক ঘণ্টা ভুল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Offset কে লেখা হিসেবে রাখার আরেকটা লুকানো বিপদ আছে। home_zone এ কেউ +06 রাখলেন, আরেকজন রাখলেন
              +06:00, তৃতীয়জন UTC+6। তিনটাই দেখতে একই কথা। কিন্তু AT TIME ZONE এ দিলে PostgreSQL এর কিছু লেখাকে
              POSIX নামের পুরনো নিয়মে পড়ে, যেখানে + মানে Greenwich এর পশ্চিমে, আমাদের চেনা নিয়মের ঠিক উল্টো। PostgreSQL
              এর Wiki এই কারণেই Time Zone এর নাম হিসেবে +HH:mm লিখতে বারণ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই +06, তিন রকম লেখা"
              query={`SELECT TIMESTAMPTZ '2026-11-01 10:00+06' AT TIME ZONE 'Asia/Dhaka' AS by_name,
       TIMESTAMPTZ '2026-11-01 10:00+06' AT TIME ZONE '+06'        AS text_plus06,
       TIMESTAMPTZ '2026-11-01 10:00+06' AT TIME ZONE '+06:00'     AS text_plus0600,
       TIMESTAMPTZ '2026-11-01 10:00+06' AT TIME ZONE 'UTC+6'      AS text_utc_plus6;`}
              caption="by_name আর text_plus06 দুটোই 2026-11-01 10:00:00, ঠিক। কিন্তু text_plus0600 আর text_utc_plus6 দুটোই 2026-10-31 22:00:00: আগের দিনের রাত দশটা, বারো ঘণ্টা ভুল, কোনো Error ছাড়া। জায়গার নাম রাখলে এই ঝুঁকি থাকেই না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              home_zone এ ভুল নাম ঢুকলে কী হবে? যেদিন সেটা দিয়ে AT TIME ZONE চালাবেন, সেদিন Error। তাই নাম
              ঢোকানোর আগেই যাচাই করা ভালো। PostgreSQL এর চেনা সব নামের তালিকা আছে pg_timezone_names View এ। App
              নাম ঢোকানোর আগে এখানে মিলিয়ে নিতে পারে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নামটা কি PostgreSQL চেনে"
              query={`SELECT EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = 'Asia/Dhaka')  AS real_name,
       EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = 'Asia/Dhakka') AS typo;

SELECT TIMESTAMPTZ '2026-11-01 10:00+06' AT TIME ZONE 'Asia/Dhakka';`}
              caption={'প্রথম ফলাফলে real_name t, typo f। দ্বিতীয় Query তে ERROR: time zone "Asia/Dhakka" not recognized, SQLSTATE 22023। এক অক্ষরের বানান ভুল একটা পুরো Report থামিয়ে দিতে পারে, তাই ঢোকার সময়েই ধরুন।'}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এক লাইনে নিয়ম",
          content: (
            <ContentList>
              <ListItem>যা ঘটেছে বা ঘটবে, তার মুহূর্ত: timestamptz।</ListItem>
              <ListItem>
                কারও নিজের ঘড়ি মনে রাখতে হলে: আলাদা text Column এ Asia/Dhaka, Europe/London এর মতো জায়গার নাম,
                কখনো +06 এর মতো Offset না।
              </ListItem>
              <ListItem>দেখানোর সময়: AT TIME ZONE সেই নাম দিয়ে, বা App এর ভেতরে একই কাজ।</ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "date-and-time",
      subHeader: { index: "011", title: "Days and Clock Times" },
      title: <SectionTitle>শুধু দিন হলে date, রোজকার ঘড়ি হলে time</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                timestamptz এর প্রশংসা শুনে কেউ ভাবতে পারেন, সব সময়ের Column তাহলে timestamptz করে দিই। না। কিছু
                তথ্য মুহূর্ত না, একটা পুরো দিন। জন্মদিন, ট্যুর শুরুর দিন, চাকরিতে যোগদানের দিন। জন্মদিন মানে
                পৃথিবীর কোনো নির্দিষ্ট মুহূর্ত না, একটা ক্যালেন্ডারের পাতা। Priya র জন্মদিন 10 মার্চ, তিনি Kolkata
                তেই থাকুন আর London এই থাকুন।
              </ContentParagraph>
              <ContentParagraph>
                দিনকে মুহূর্ত হিসেবে রাখলে, অর্থাৎ timestamptz এ সেদিনের মাঝরাত রাখলে, কী হয়? সেই মাঝরাত অন্য
                Time Zone থেকে দেখলে আগের দিনের সন্ধ্যা। জন্মদিন এক দিন পিছিয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জন্মদিন যখন এক দিন পিছিয়ে যায়"
              query={`DROP TABLE IF EXISTS tt_birthdays;
CREATE TABLE tt_birthdays (
  guest      text,
  as_date    date,
  as_instant timestamptz
);
INSERT INTO tt_birthdays VALUES
  ('Priya Sharma', '1995-03-10', '1995-03-10 00:00+05:30');

SET TIME ZONE 'UTC';
SELECT guest, as_date, as_instant, as_instant::date AS instant_day
FROM tt_birthdays;

SET TIME ZONE 'Asia/Dhaka';
SELECT guest, as_date, as_instant, as_instant::date AS instant_day
FROM tt_birthdays;`}
              caption="UTC তে as_date ঠিক 1995-03-10, কিন্তু as_instant হয়ে গেছে 1995-03-09 18:30:00+00, আর instant_day 1995-03-09। UTC তে চলা কোনো Server এই Column থেকে শুভেচ্ছা Email পাঠালে পাঠাত এক দিন আগে। ঢাকায় ফিরে instant_day আবার 1995-03-10। date Column এর এই সমস্যা কখনো হয় না, কারণ তাতে কোনো ঘড়িই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                time এর জায়গা হলো রোজকার সময়সূচি: অফিস খোলে 09:00, শেষ Ferry ছাড়ে 15:30, ড্রাইভার তৈরি থাকেন
                06:30। এখানে কোন দিন, সেটা প্রশ্ন না, কারণ নিয়মটা প্রতিদিনের।
              </ContentParagraph>
              <ContentParagraph>
                আর timetz, অর্থাৎ Offset সহ ঘড়ির সময়? PostgreSQL এর Docs নিজেই বলে এই ধরনের উপযোগিতা প্রশ্নসাপেক্ষ,
                আর এটা ব্যবহার করতে বারণ করে। কারণটা আপনি এখন নিজেই বুঝবেন: দিন ছাড়া একটা Offset এর মানে হয় না।
                London এর সকাল নয়টা শীতে +00, গ্রীষ্মে +01। কোন দিনের, সেটা না জানলে কোনটা বসাবেন? শুধু SQL
                Standard মানার জন্য PostgreSQL এটা রেখেছে।
              </ContentParagraph>
              <ContentParagraph>
                এখন সেই একটা জায়গা, যেখানে timestamp এর মতো Time Zone ছাড়া মান সত্যিই কাজে লাগে: ভবিষ্যতের এমন
                একটা ঘটনা, যার সময় ঠিক হয় স্থানীয় ঘড়িতে। Cox{"'"}s Bazar এর ট্যুর 20 নভেম্বর সকাল সাতটায় হোটেলের
                সামনে থেকে ছাড়বে। এটা মানুষ বলেন ঢাকার দেয়ালঘড়ি দিয়ে। এমন ক্ষেত্রে দিন রাখা হয় date এ, ঘড়ির সময়
                time এ, দরকার হলে জায়গার নাম text এ, আর মুহূর্তটা বানানো হয় যখন দরকার। date আর time যোগ করলে আসে
                timestamp, আর সেটাকে AT TIME ZONE দিয়ে একটা জায়গার নামের সাথে মেলালে আসে timestamptz।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দিন আর ঘড়ি থেকে মুহূর্ত"
              query={`SELECT d.departure_id,
       d.starts_on,
       d.starts_on + TIME '07:00'                             AS wall_clock,
       (d.starts_on + TIME '07:00') AT TIME ZONE 'Asia/Dhaka' AS meet_instant
FROM departures d
WHERE d.departure_id IN (8, 14, 15)
ORDER BY d.starts_on;

SELECT pg_typeof(DATE '2026-11-20' + TIME '07:00')                             AS plus_type,
       pg_typeof((DATE '2026-11-20' + TIME '07:00') AT TIME ZONE 'Asia/Dhaka') AS at_zone_type;`}
              caption="তিনটা Departure: 14, 8, 15, শুরুর দিনের ক্রমে। wall_clock এ শেষে কিছু নেই, যেমন 2026-11-20 07:00:00। meet_instant এ +06 সহ একটা আসল মুহূর্ত। দ্বিতীয় ফলাফল ধরন দুটো নিশ্চিত করে: যোগফল timestamp without time zone, আর AT TIME ZONE এর পরে timestamp with time zone। অংশ ৯ এর বাতিলের শেষ সময়ও এভাবেই মুহূর্তে বদলানো যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কেন ভবিষ্যতের স্থানীয় সময় আগে থেকে মুহূর্তে বদলে রাখা হয় না",
          content: (
            <ContentParagraph>
              ধরুন দুই বছর পরের একটা ট্যুর সকাল সাতটায় ছাড়বে, আর আজই সেটাকে timestamptz এ বদলে রাখলেন। এর মধ্যে
              সরকার যদি 2009 এর মতো ঘড়ির নিয়ম বদলায়, রাখা মুহূর্তটা আর সকাল সাতটা থাকবে না। দিন, ঘড়ি আর জায়গার নাম
              আলাদা রাখলে মুহূর্তটা হিসাব হয় সর্বশেষ নিয়মে। যা ঘটে গেছে তার জন্য এই প্রশ্ন নেই: অতীতের মুহূর্ত বদলায়
              না, তাই সেখানে সবসময় সরাসরি timestamptz।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "see-it-yourself",
      subHeader: { index: "012", title: "See It Yourself" },
      title: <SectionTitle>নিজে চালিয়ে দেখুন: এক লেখা, পাঁচ রকম Column</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা শিখলেন, সব এক জায়গায়। নিচের Lab এ তিনটা লেখা আছে: ঢাকার রবিবার সকাল আধা সেকেন্ড সহ,
                London এর শনিবার রাত, আর ঢাকার মাঝরাতের ঠিক আগের মুহূর্ত। প্রতিটা লেখা পাঁচ রকম Column এ ঢোকান,
                আর তিনটা আলাদা TimeZone থেকে পড়ুন। প্রতিবার দুটো জিনিস দেখুন: Database এ আসলে কী রইল, আর পর্দায়
                কী দেখাল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  timestamp বেছে দেখার Zone বদলান। কিছুই বদলায় না। কেন, সেটা নিজের ভাষায় বলুন।
                </ListItem>
                <ListItem>B লেখাটা date Column এ দিন, তারপর timestamptz এ, ঢাকার Zone এ। দুটো কি একই দিন বলে?</ListItem>
                <ListItem>C লেখাটা timestamptz(0) এ দিন। মুহূর্তটা কোন দিনে গেল?</ListItem>
                <ListItem>
                  timestamptz বেছে America/New_York এ A আর C তুলনা করুন। একই দিনে দুই রকম Offset কেন?
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ColumnTypeLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এর প্রতিটা মান আসল PostgreSQL থেকে নেওয়া। নিচের বক্সে একই পরীক্ষা নিজের হাতে চালান। চাইলে
              America/New_York এর জায়গায় Asia/Kolkata বা Europe/London বসিয়ে দেখুন, শুধু শেষ লাইনটা রেখে দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Lab এর পরীক্ষা, নিজের হাতে"
              query={`DROP TABLE IF EXISTS tt_lab;
CREATE TABLE tt_lab (
  k        text,
  as_date  date,
  as_time  time,
  as_ts    timestamp,
  as_tstz  timestamptz,
  as_tstz0 timestamptz(0)
);
INSERT INTO tt_lab VALUES
  ('A', '2026-11-01 10:00:00.5+06',  '2026-11-01 10:00:00.5+06',  '2026-11-01 10:00:00.5+06',  '2026-11-01 10:00:00.5+06',  '2026-11-01 10:00:00.5+06'),
  ('B', '2026-10-31 22:30:00.25+00', '2026-10-31 22:30:00.25+00', '2026-10-31 22:30:00.25+00', '2026-10-31 22:30:00.25+00', '2026-10-31 22:30:00.25+00'),
  ('C', '2026-11-01 23:59:59.75+06', '2026-11-01 23:59:59.75+06', '2026-11-01 23:59:59.75+06', '2026-11-01 23:59:59.75+06', '2026-11-01 23:59:59.75+06');
SELECT * FROM tt_lab ORDER BY k;

SET TIME ZONE 'America/New_York';
SELECT k, as_ts, as_tstz, as_tstz0 FROM tt_lab ORDER BY k;

SET TIME ZONE 'Asia/Dhaka';  -- এই পাতার বাকি বক্সের জন্য ফিরিয়ে আনা`}
              caption="ঢাকায় B এর as_date 2026-10-31, অথচ as_tstz 2026-11-01 04:30:00.25+06: date লেখার তারিখ তুলে নেয়, timestamptz মুহূর্তের হিসাব করে। C এর as_tstz0 গোল হয়ে 2026-11-02 00:00:00+06। New York এ as_ts একটুও বদলায় না, as_tstz এ A আসে 00:00:00.5-04 আর C আসে 12:59:59.75-05।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ: DATETIME, TIMESTAMP আর 2038 সালের দেয়াল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে Video Course দেখছেন, সেটা MySQL এ। MySQL এ সময়ের Column এর নাম আর আচরণ দুটোই আলাদা, আর
                সেখানে একটা সীমা আছে যেটা আমাদের প্রজন্মেই এসে পড়বে। এই অংশের সব ফলাফল MySQL 8.4 থেকে নেওয়া।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DATE</strong>: PostgreSQL এর date এর মতো। 3 bytes।
                </ListItem>
                <ListItem>
                  <strong>TIME</strong>: ঘড়ির সময়, কিন্তু MySQL এ এটা দৈর্ঘ্য হিসেবেও চলে, তাই সীমা 838:59:59
                  পর্যন্ত। MySQL এ interval নামের কোনো Column এর ধরন নেই।
                </ListItem>
                <ListItem>
                  <strong>DATETIME</strong>: তারিখ আর সময়, কোনো Time Zone এর হিসাব ছাড়া, PostgreSQL এর timestamp
                  এর মতো। Docs অনুযায়ী 1000 থেকে 9999 সাল। 5 bytes, আর সেকেন্ডের ভগ্নাংশ রাখলে আরও কয়েক byte।
                </ListItem>
                <ListItem>
                  <strong>TIMESTAMP</strong>: ঢোকানোর সময় Session এর time_zone থেকে UTC তে বদলায়, বের করার সময় আবার
                  Session এর time_zone এ, অনেকটা timestamptz এর ধারণার মতো। কিন্তু ভেতরে এটা 1970 থেকে সেকেন্ড গোনে
                  4 bytes এর একটা ঘরে, তাই পরিসর মাত্র 1970-01-01 00:00:01 UTC থেকে 2038-01-19 03:14:07 UTC।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নাম নিয়ে সাবধান: MySQL এর TIMESTAMP আচরণে PostgreSQL এর timestamptz এর কাছাকাছি, আর PostgreSQL
                এর timestamp আচরণে MySQL এর DATETIME এর কাছাকাছি। একই শব্দ, দুই Database এ উল্টো দিকের মানে।
                নিচে দুটো Column এ একই লেখা ঢুকিয়ে Session এর time_zone বদলে পড়া হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4: DATETIME vs TIMESTAMP",
          code: `CREATE TABLE tt_mysql_clock (
  label VARCHAR(20),
  dt    DATETIME,
  ts    TIMESTAMP NULL
);
SET time_zone = 'Asia/Dhaka';
INSERT INTO tt_mysql_clock VALUES ('dhaka',  '2026-11-01 10:00:00', '2026-11-01 10:00:00');
INSERT INTO tt_mysql_clock VALUES ('london', '2026-11-01 10:00:00+00:00', '2026-11-01 10:00:00+00:00');
SELECT * FROM tt_mysql_clock;
-- +--------+---------------------+---------------------+
-- | label  | dt                  | ts                  |
-- +--------+---------------------+---------------------+
-- | dhaka  | 2026-11-01 10:00:00 | 2026-11-01 10:00:00 |
-- | london | 2026-11-01 16:00:00 | 2026-11-01 16:00:00 |
-- +--------+---------------------+---------------------+

SET time_zone = '+00:00';
SELECT * FROM tt_mysql_clock;
-- +--------+---------------------+---------------------+
-- | label  | dt                  | ts                  |
-- +--------+---------------------+---------------------+
-- | dhaka  | 2026-11-01 10:00:00 | 2026-11-01 04:00:00 |
-- | london | 2026-11-01 16:00:00 | 2026-11-01 10:00:00 |
-- +--------+---------------------+---------------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস দেখুন। লেখার শেষে +00:00 দিলে MySQL সেটা মানে, আর DATETIME এর জন্যও Session এর ঘড়িতে
                বদলে নেয়: London এর সকাল দশটা হয়ে যায় ঢাকার বিকেল চারটা। কিন্তু তারপর DATETIME শুধু 16:00 লেখাটা
                রাখে, Offset ভুলে যায়। তাই Session এর ঘড়ি UTC তে নিলে DATETIME একটুও বদলায় না, আর TIMESTAMP সঠিক
                UTC মুহূর্ত দেখায়। MySQL 8.4 এর Docs আরও বলে, লেখার ভেতরে শুধু +06:00 এর মতো Offset চলে,
                Asia/Dhaka এর মতো নাম না। চেষ্টা করে দেখা গেছে, নাম দিলে ERROR 1292 আসে।
              </ContentParagraph>
              <ContentParagraph>
                time_zone এ Asia/Dhaka এর মতো নাম ব্যবহার করতে MySQL এর ভেতরে Time Zone এর Table গুলো ভরা থাকতে
                হয়। MySQL এর সরকারি Docker Image এ সেগুলো আগে থেকেই ভরা থাকে। অন্য Server এ খালি থাকলে
                mysql_tzinfo_to_sql দিয়ে ভরতে হয়, নইলে শুধু +06:00 এর মতো Offset কাজ করে।
              </ContentParagraph>
              <ContentParagraph>
                এবার সেই দেয়াল। MySQL এর TIMESTAMP ভেতরে রাখে 1970 এর শুরু থেকে কত সেকেন্ড পার হলো, একটা 32 bit
                এর signed পূর্ণসংখ্যায়। সেই ঘরের সবচেয়ে বড় সংখ্যা 2147483647, যেটা পড়ে 2038 সালের 19 জানুয়ারি,
                UTC তে রাত ৩টা ১৪ মিনিট ৭ সেকেন্ডে। তার এক সেকেন্ড পরের মুহূর্ত TIMESTAMP Column আর রাখতে পারে না।
                নিচের Lab এ মুহূর্তগুলো একটা একটা করে বেছে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimestampCliffLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4: the limits, strict sql_mode",
          code: `SET time_zone = '+00:00';
INSERT INTO tt_mysql_clock VALUES ('max', '2038-01-19 03:14:07', '2038-01-19 03:14:07');
-- Query OK, 1 row affected

INSERT INTO tt_mysql_clock VALUES ('over', '2038-01-19 03:14:08', '2038-01-19 03:14:08');
-- ERROR 1292 (22007): Incorrect datetime value: '2038-01-19 03:14:08' for column 'ts' at row 1

INSERT INTO tt_mysql_clock VALUES ('under', '1970-01-01 00:00:00', '1970-01-01 00:00:00');
-- ERROR 1292 (22007): Incorrect datetime value: '1970-01-01 00:00:00' for column 'ts' at row 1

INSERT INTO tt_mysql_clock VALUES ('zero', '0000-00-00 00:00:00', NULL);
-- ERROR 1292 (22007): Incorrect datetime value: '0000-00-00 00:00:00' for column 'dt' at row 1

INSERT INTO tt_mysql_clock VALUES ('feb30', '2026-02-30 10:00:00', NULL);
-- ERROR 1292 (22007): Incorrect datetime value: '2026-02-30 10:00:00' for column 'dt' at row 1

SELECT FROM_UNIXTIME(2147483648);
-- 2038-01-19 03:14:08   (Function টা পারে, Column পারে না)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনটা খেয়াল করুন: MySQL এর FROM_UNIXTIME এর মতো Function এখন 2038 এর পরের সেকেন্ডও পারে,
                কিন্তু TIMESTAMP Column এর পরিসর বদলায়নি। আর 2038 দূরের ব্যাপার না। আজ যে সদস্যপদ পনেরো বছরের
                জন্য বিক্রি হয়, বা যে কিস্তির শেষ তারিখ বারো বছর পরে, সেটা আজই এই দেয়ালে ধাক্কা খায়।
              </ContentParagraph>
              <ContentParagraph>
                এখনকার MySQL এর strict sql_mode ভুল তারিখ আর 0000-00-00 এর মতো শূন্য তারিখ দুটোই ফিরিয়ে দেয়, যেমন
                উপরে দেখলেন। পুরনো Server এ এই Mode বন্ধ থাকলে এগুলো চুপচাপ শূন্য তারিখ হয়ে ঢুকে যেত। তাই কোনো
                পুরনো MySQL Database হাতে পেলে আগে <code className={CODE}>SELECT @@sql_mode;</code> দেখে নিন।
              </ContentParagraph>
              <ContentParagraph>
                Precision এর বেলায় MySQL এর Default আলাদা: কিছু না লিখলে DATETIME, TIMESTAMP আর TIME এ সেকেন্ডের
                কোনো ভগ্নাংশ থাকে না, PostgreSQL এর মতো ছয় ঘর না। আর বাড়তি ভগ্নাংশ এখানেও গোল হয়, কোনো
                সতর্কবার্তা ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4: fractional seconds",
          code: `CREATE TABLE tt_mysql_fsp (
  a DATETIME,
  b DATETIME(3),
  c DATETIME(6),
  d TIME,
  e TIMESTAMP(2) NULL
);
INSERT INTO tt_mysql_fsp VALUES (
  '2026-11-01 10:00:00.5', '2026-11-01 10:00:00.1236', '2026-11-01 10:00:00.1234567',
  '09:30:15.6', '2026-11-01 23:59:59.999'
);
SELECT * FROM tt_mysql_fsp;
-- a: 2026-11-01 10:00:01          (Default 0 ঘর, .5 গোল হয়ে উপরে)
-- b: 2026-11-01 10:00:00.124
-- c: 2026-11-01 10:00:00.123457
-- d: 09:30:16
-- e: 2026-11-02 00:00:00.00       (PostgreSQL এর মতোই, পরের দিনে)

CREATE TABLE tt_mysql_fsp7 (a DATETIME(7));
-- ERROR 1426 (42000): Too-big precision 7 specified for 'a'. Maximum is 6.

CREATE TABLE tt_mysql_iv (drive_time INTERVAL);
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'INTERVAL)'`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এ 7 দিলে শুধু WARNING আসে আর 6 হয়ে যায়, MySQL এ সরাসরি Error। আর updated_at এর জন্য
              MySQL এর নিজের একটা সুবিধা আছে, যেটা PostgreSQL এ নেই: Column এর সাথেই লিখে দেওয়া যায় যে প্রতিটা
              UPDATE এ মানটা নিজে থেকে বদলাবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4: DEFAULT and ON UPDATE CURRENT_TIMESTAMP",
          code: `CREATE TABLE tt_mysql_audit (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  note       VARCHAR(40),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO tt_mysql_audit (note) VALUES ('first');
SELECT id, note, created_at = updated_at AS same FROM tt_mysql_audit;
-- | 1 | first | 1 |

DO SLEEP(1.2);
UPDATE tt_mysql_audit SET note = 'edited' WHERE id = 1;
SELECT id, note, updated_at > created_at AS moved FROM tt_mysql_audit;
-- | 1 | edited | 1 |`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["মুহূর্ত রাখার ধরন", "timestamptz, 4713 BC থেকে 294276 AD", "TIMESTAMP, 1970 থেকে 2038-01-19 03:14:07 UTC"],
            ["Time Zone ছাড়া তারিখ আর সময়", "timestamp", "DATETIME, 1000 থেকে 9999"],
            ["দৈর্ঘ্য", "interval Column", "কোনো ধরন নেই, সংখ্যা বা TIME"],
            ["সেকেন্ডের ভগ্নাংশ, কিছু না লিখলে", "6 ঘর", "0 ঘর"],
            ["Precision 7", "WARNING, কমে 6", "ERROR 1426"],
            ["ভুল তারিখ", "ERROR, SQLSTATE 22008", "strict Mode এ ERROR 1292, পুরনো Mode এ শূন্য তারিখ"],
            ["updated_at নিজে থেকে", "নেই, Trigger বা App", "ON UPDATE CURRENT_TIMESTAMP"],
            ["শেষহীন মান", "'infinity'", "নেই, সাধারণত 9999-12-31 বা NULL"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ তাহলে কোনটা বেছে নেবেন",
          content: (
            <ContentParagraph>
              যে সময় 2038 এর পরে যেতে পারে, সেখানে TIMESTAMP চলবে না। তখন বহুল প্রচলিত পথ হলো DATETIME, আর পুরো
              Team এর একটা চুক্তি: প্রতিটা Connection এ time_zone থাকবে +00:00, আর সব মান লেখা হবে UTC তে।
              DATETIME নিজে UTC বোঝে না, তাই চুক্তিটা ভাঙলে কেউ ধরবে না, ঠিক PostgreSQL এর timestamp এর মতো।
              PostgreSQL এ এই চুক্তির দরকার নেই, timestamptz নিজেই সেই দায়িত্ব নেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Pickup Table, পুরোটা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নাদিয়ার আসল কাজ। লেসনের শুরুতে ফারুক সাহেবের ছয়টা চাওয়া ছিল। প্রতিটার জন্য একটা প্রশ্ন, আর
                প্রতিটা প্রশ্নের জন্য একটা ধরন। সাথে একটা বাড়তি Column, home_zone, যাতে প্রতিটা অতিথিকে তাঁর নিজের
                ঘড়িতে সময় জানানো যায়। নিচের টেবিলটা নাদিয়ার সিদ্ধান্তের খাতা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Column", "কোন প্রশ্নের উত্তর", "ধরন", "কেন"],
          rows: [
            ["lands_at", "বিমান ঠিক কোন মুহূর্তে নামবে", "timestamptz NOT NULL", "একটা ঘটনা, Airline পাঠায় UTC তে, ড্রাইভার পড়েন ঢাকার ঘড়িতে"],
            ["pickup_on", "কোন দিনের Pickup, ঢাকার ক্যালেন্ডারে", "date NOT NULL", "দিনের তালিকা বানাতে, ঘড়ির দরকার নেই"],
            ["ready_by", "ড্রাইভার গেটে কয়টায় তৈরি থাকবেন", "time(0)", "ঘড়ির একটা সময়, সেকেন্ডের ভগ্নাংশ অর্থহীন"],
            ["drive_time", "হোটেলে যেতে কতক্ষণ", "interval NOT NULL DEFAULT '3 hours'", "একটা দৈর্ঘ্য, বেশিরভাগ হোটেল তিন ঘণ্টার পথ"],
            ["offer_ends", "বিনা খরচের Offer কবে শেষ", "timestamptz NOT NULL DEFAULT 'infinity'", "শেষ না থাকাটাও একটা জানা উত্তর"],
            ["created_at", "Row কখন তৈরি হলো", "timestamptz NOT NULL DEFAULT now()", "নিজে থেকে বসে। (0) দিলে now() গোল হয়ে আধা সেকেন্ড ভবিষ্যতে যেতে পারত"],
            ["home_zone", "অতিথির নিজের ঘড়ি", "text NOT NULL", "জায়গার নাম, Offset না, অংশ ১০ এর নিয়ম"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Pickup Table আর ২০ নভেম্বরের তালিকা"
              query={`DROP TABLE IF EXISTS tt_pickups;
CREATE TABLE tt_pickups (
  pickup_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guest      text           NOT NULL,
  home_zone  text           NOT NULL,
  lands_at   timestamptz    NOT NULL,
  pickup_on  date           NOT NULL,
  ready_by   time(0),
  drive_time interval       NOT NULL DEFAULT '3 hours',
  offer_ends timestamptz    NOT NULL DEFAULT 'infinity',
  created_at timestamptz    NOT NULL DEFAULT now()
);
INSERT INTO tt_pickups (guest, home_zone, lands_at, pickup_on, ready_by, drive_time) VALUES
  ('Oliver Bennett', 'Europe/London',     '2026-11-20 08:30:00+00',    '2026-11-20', '14:00', '45 minutes'),
  ('Priya Sharma',   'Asia/Kolkata',      '2026-11-20 09:15:00+05:30', '2026-11-20', '09:30', DEFAULT),
  ('Aiman Zulkifli', 'Asia/Kuala_Lumpur', '2026-11-21 01:10:00+08',    '2026-11-20', '22:45', '1 hour 15 minutes');

SELECT guest,
       lands_at                        AS lands_dhaka,
       lands_at AT TIME ZONE home_zone AS lands_their_clock,
       lands_at + drive_time           AS at_hotel,
       isfinite(offer_ends)            AS offer_has_end
FROM tt_pickups
WHERE lands_at >= TIMESTAMPTZ '2026-11-20 00:00+06'
  AND lands_at <  TIMESTAMPTZ '2026-11-21 00:00+06'
ORDER BY lands_at;`}
              caption="তিনজনই আসেন। Priya নামেন ঢাকার 09:45 এ (Kolkata র 09:15), DEFAULT এর তিন ঘণ্টা পরে হোটেলে 12:45। Oliver নামেন 14:30 এ, London এর 08:30। Aiman নামেন ঢাকার 23:10 এ, অথচ তাঁর নিজের ঘড়িতে তখন 21 নভেম্বর রাত 01:10, তাই তাঁর Airline এর টিকিটে লেখা তারিখ আর আমাদের pickup_on আলাদা, আর সেটাই ঠিক। তিনজনেরই offer_has_end f, কারণ কেউ শেষের সময় দেননি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WHERE এর শর্তটা খেয়াল করুন। ২০ নভেম্বরের Pickup খুঁজতে নাদিয়া লিখেছেন ঢাকার মাঝরাত থেকে পরের
                মাঝরাতের আগ পর্যন্ত, দুটোই +06 সহ। Aiman এর ঘড়িতে তখন 21 তারিখ, তবু তিনি তালিকায় আছেন, কারণ
                ঢাকার ড্রাইভারের কাছে দিনটা 20 তারিখ। মুহূর্ত রাখা থাকলে যেকোনো দেশের দিন ধরে খোঁজা যায়, শুধু
                সীমাটা সেই দেশের ঘড়িতে লিখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এখন information_schema থেকে Table টা আবার পড়ে দেখুন, প্রতিটা সিদ্ধান্ত ঠিকমতো বসেছে কিনা। psql এ
                একই জিনিস <code className={CODE}>\d tt_pickups</code> দেখায়, Practical Lab এ সেটার আসল ফলাফল আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Table টা নিজের মুখে কী বলে"
              query={`SELECT column_name, data_type, datetime_precision, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tt_pickups'
ORDER BY ordinal_position;`}
              caption="৯টা Row। শুধু ready_by এর datetime_precision 0, বাকি সময়ের Column এ 6। drive_time এর DEFAULT লেখা '03:00:00'::interval, অর্থাৎ 3 hours কে PostgreSQL নিজের ভাষায় সাজিয়ে রেখেছে। offer_ends এর 'infinity'::timestamp with time zone, created_at এর now()। pickup_id এর column_default ফাঁকা, কারণ Identity Column এর হিসাব আলাদা জায়গায় থাকে, Primary Keys লেসনে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার শেষ পরীক্ষা। নিচের Challenge এ কোনো ধরনের নাম বলা নেই, শুধু প্রতিটা Column কোন প্রশ্নের উত্তর রাখে।
              ধরন, Precision, NOT NULL আর DEFAULT, সব আপনার সিদ্ধান্ত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  tt_challenge_pickups Table টা বানান, ঠিক এই ক্রমে সাতটা Column সহ। guest: অতিথির নাম, খালি রাখা
                  যাবে না। lands_at: বিমান যে মুহূর্তে নামে, খালি রাখা যাবে না। pickup_on: Pickup এর দিন, খালি রাখা
                  যাবে না। ready_by: ড্রাইভার রোজ ঘড়ির কয়টায় তৈরি থাকবেন, সেকেন্ডের ভগ্নাংশ ছাড়া, খালি থাকতে পারে।
                  drive_time: হোটেলে যেতে কতক্ষণ, খালি রাখা যাবে না, কেউ না দিলে তিন ঘণ্টা। offer_ends: Offer শেষের
                  মুহূর্ত, খালি রাখা যাবে না, কেউ না দিলে কোনো শেষ নেই। created_at: Row তৈরির মুহূর্ত, পুরো
                  Precision, খালি রাখা যাবে না, কেউ না দিলে Transaction শুরুর মুহূর্ত, যেটা প্রতিটা নতুন
                  Transaction এ নতুন করে হিসাব হয়। যাচাইয়ের Query সবার শেষে রেখে দিন।
                </>
              }
              starter={`DROP TABLE IF EXISTS tt_challenge_pickups;

-- এখানে CREATE TABLE tt_challenge_pickups লিখুন

SELECT column_name,
       data_type,
       datetime_precision,
       is_nullable,
       CASE
         WHEN column_default IS NULL THEN 'none'
         WHEN column_default IN ('now()', 'CURRENT_TIMESTAMP', 'transaction_timestamp()') THEN 'now'
         ELSE column_default
       END AS default_kind
FROM information_schema.columns
WHERE table_name = 'tt_challenge_pickups'
ORDER BY ordinal_position;`}
              hint={
                <>
                  সাতটার মধ্যে তিনটা Column এ DEFAULT লাগবে, আর মাত্র একটায় Precision 0, যেটা রোজকার ঘড়ি। দৈর্ঘ্যের DEFAULT যেভাবেই লিখুন,
                  3 hours বা 180 minutes, PostgreSQL সেটা একই ভাবে রাখে। এখনকার মুহূর্তের DEFAULT হবে একটা Function,
                  উদ্ধৃতিচিহ্নের ভেতরের লেখা না। ক্রম বদলালে মিলবে না।
                </>
              }
              orderMatters
              solution={`SELECT * FROM (VALUES
  ('guest',      'text',                     NULL::int, 'NO',  'none'),
  ('lands_at',   'timestamp with time zone', 6,         'NO',  'none'),
  ('pickup_on',  'date',                     0,         'NO',  'none'),
  ('ready_by',   'time without time zone',   0,         'YES', 'none'),
  ('drive_time', 'interval',                 6,         'NO',  '''03:00:00''::interval'),
  ('offer_ends', 'timestamp with time zone', 6,         'NO',  '''infinity''::timestamp with time zone'),
  ('created_at', 'timestamp with time zone', 6,         'NO',  'now')
) AS v(column_name, data_type, datetime_precision, is_nullable, default_kind);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>নতুন সময়ের Column বানানোর আগে ছয়টা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Column টা কোন প্রশ্নের উত্তর, এক বাক্যে বলুন",
              description:
                "কখন ঘটল, কোন দিন, রোজ কয়টায়, নাকি কতক্ষণ। বাক্যে মুহূর্ত থাকলে timestamptz, দিন থাকলে date, রোজকার ঘড়ি থাকলে time, দৈর্ঘ্য থাকলে interval। timestamp একা কখনো উত্তর না।",
            },
            {
              title: "দিনটা কার ক্যালেন্ডারে, সেটা ঠিক করুন",
              description:
                "জন্মদিন বা ট্যুরের দিন হলে date, আর কোনো Time Zone এর প্রশ্নই নেই। দিনটা আসলে একটা মুহূর্ত থেকে আসে, যেমন কোন দিনের Booking, তাহলে মুহূর্তটা timestamptz এ রাখুন, দিন বের করুন Query তে, যে দেশের দিন চাই সেই ঘড়িতে।",
            },
            {
              title: "কারও নিজের ঘড়ি লাগবে কিনা ভাবুন",
              description:
                "লাগলে আলাদা text Column এ জায়গার নাম, Asia/Dhaka এর মতো, কখনো +06 এর মতো Offset না। ভবিষ্যতের স্থানীয় সময়ের ঘটনা হলে দিন, ঘড়ি আর জায়গার নাম আলাদা রাখুন।",
            },
            {
              title: "Precision ঠিক করুন",
              description:
                "কিছু না লিখলে ছয় ঘর, ঘটনার জন্য প্রায় সবসময় এটাই। বাড়তি ঘর গোল হয়, কাটা না: (0) দিলে now() আধা সেকেন্ড পর্যন্ত ভবিষ্যতে যেতে পারে, আর মাঝরাতের কাছের মান পরের দিনে। পুরো সেকেন্ডে দেখাতে চাইলে Query তে date_trunc। রোজকার ঘড়ির time(0) এ সমস্যা নেই।",
            },
            {
              title: "খালি থাকতে পারে কিনা, আর না থাকলে কী বসবে",
              description:
                "তৈরির সময় হলে NOT NULL DEFAULT now(), কখনো 'now' লেখা না। শেষ না থাকাটা জানা উত্তর হলে NOT NULL DEFAULT 'infinity'। সত্যিই অজানা হলে NULL থাকতে দিন।",
            },
            {
              title: "চালিয়ে যাচাই করুন",
              description:
                "information_schema.columns বা psql এর \\d দিয়ে ধরন, Precision আর DEFAULT পড়ে নিন। তারপর অন্য Offset এর একটা লেখা ঢুকিয়ে, SET TIME ZONE বদলে পড়ে দেখুন মুহূর্তটা অক্ষত আছে কিনা।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>সময়ের Column এর যে ভুলগুলো বছরের পর বছর লুকিয়ে থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "ঘটনার সময় timestamp Column এ",
              "+06, +00 নীরবে বাদ, আলাদা দেশের মুহূর্তের ফারাক আর ক্রম ভুল, কোনো Error নেই",
              "timestamptz",
            ],
            [
              "ভাবা যে শুধু timestamp লিখলেই Time Zone সহ",
              "SQL Standard অনুযায়ী শুধু timestamp মানে without time zone",
              "সবসময় স্পষ্ট করে timestamptz লিখুন",
            ],
            [
              "DEFAULT 'now'",
              "CREATE TABLE এর মুহূর্তে একবার হিসাব হয়, তারপর প্রতিটা Row এ সেই একই পুরনো সময়",
              "DEFAULT now() বা CURRENT_TIMESTAMP",
            ],
            [
              "জন্মদিন বা ট্যুরের দিন timestamptz এ মাঝরাত হিসেবে",
              "অন্য Time Zone থেকে পড়লে আগের দিন, শুভেচ্ছা যায় এক দিন আগে",
              "date",
            ],
            [
              "মানুষের ঘড়ি Offset হিসেবে, যেমন +00",
              "গ্রীষ্মে London এর ঘড়ি এক ঘণ্টা ভুল, 2009 এর ঢাকাও ভুল",
              "Europe/London, Asia/Dhaka এর মতো জায়গার নাম, text Column এ",
            ],
            [
              "শেষ নেই বোঝাতে NULL",
              "প্রতিটা Query তে OR ... IS NULL লিখতে হয়, ভুললে শেষহীন Row বাদ পড়ে",
              "NOT NULL DEFAULT 'infinity'",
            ],
            [
              "ঘটনার Column এ timestamptz(0)",
              "23:59:59.6 হয়ে যায় পরের দিনের 00:00:00, আর DEFAULT now() আধা সেকেন্ড ভবিষ্যতে যেতে পারে",
              "Precision না দিয়ে ছয় ঘর রাখুন, দেখানোর সময় date_trunc('second', ...)",
            ],
            [
              "দৈর্ঘ্য রাখতে time",
              "24:00 পেরোলে ঘুরে শূন্য থেকে, 06:30 যোগ 20 ঘণ্টা হয় 02:30",
              "interval, বা এককসহ নামের integer যেমন drive_minutes",
            ],
            [
              "date থেকে interval বিয়োগ করে ফল timestamptz Column এ",
              "ফল আসে timestamp, ঢোকানোর সময় Session এর ঘড়ি ধরে নেওয়া হয়",
              "AT TIME ZONE দিয়ে জায়গা বলে মুহূর্ত বানান",
            ],
            [
              "MySQL এ দূর ভবিষ্যতের তারিখ TIMESTAMP এ",
              "2038-01-19 03:14:07 UTC এর পরে ERROR 1292",
              "DATETIME, আর সব Connection এ time_zone +00:00 এর চুক্তি",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Date/Time Types
                </a>
                : এই লেসনের মূল উৎস। প্রতিটা ধরনের সীমা, Precision, বিশেষ মান, আর timestamptz কীভাবে রাখা হয়।
              </ListItem>
              <ListItem>
                <a href="https://wiki.postgresql.org/wiki/Don%27t_Do_This" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Wiki: Don{"'"}t Do This
                </a>
                : PostgreSQL এর অভিজ্ঞদের তালিকা কী করবেন না। timestamp, timetz আর timestamp(0) নিয়ে আলাদা অংশ আছে।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datetime-invalid-input.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Handling of Invalid or Ambiguous Timestamps
                </a>
                : DST এর দুইবার আসা আর হারিয়ে যাওয়া ঘণ্টাকে PostgreSQL কীভাবে পড়ে।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Docs: Date/Time Functions and Operators
                </a>
                : now(), clock_timestamp() আর AT TIME ZONE এর পুরো বিবরণ।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: The DATE, DATETIME, and TIMESTAMP Types
                </a>
                {" "}আর{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/fractional-seconds.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Fractional Seconds in Time Values
                </a>
                : পরিসর, time_zone এর রূপান্তর আর সেকেন্ডের ভগ্নাংশ।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/timestamp-initialization.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Automatic Initialization and Updating for TIMESTAMP and DATETIME
                </a>
                {" "}আর{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/time-zone-support.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Time Zone Support
                </a>
                : ON UPDATE CURRENT_TIMESTAMP আর Time Zone এর Table ভরার নিয়ম।
              </ListItem>
              <ListItem>
                <a href="https://www.iana.org/time-zones" className={LINK} target="_blank" rel="noopener noreferrer">
                  IANA Time Zone Database
                </a>
                : Asia/Dhaka, Europe/London এর মতো নামগুলোর উৎস, যেখানে প্রতিটা জায়গার ঘড়ির ইতিহাস রাখা।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার MySQL Video Course
                </a>
                : Table বানানোর অংশে DATE আর DATETIME দেখবেন। এই লেসনের অংশ ১৩ পাশে রেখে দেখুন কোথায় MySQL আর
                PostgreSQL আলাদা।
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
                  সময়ের Column বানানোর আগে প্রশ্নটা ঠিক করুন: কোন মুহূর্তে হলে timestamptz, কোন দিন হলে date, রোজ
                  কয়টায় হলে time, কতক্ষণ হলে interval।
                </ListItem>
                <ListItem>
                  timestamp লেখার Offset নীরবে ফেলে দেয়। timestamptz মুহূর্তটা UTC তে রাখে আর Session এর ঘড়িতে
                  দেখায়। দুটোই 8 bytes, তাই ভুলটা বেছে নেওয়ার কোনো লাভ নেই।
                </ListItem>
                <ListItem>
                  ঘটনার সময় সবসময় timestamptz: বিদেশি অতিথি, UTC তে চলা Server আর DST, তিনটাতেই সে ঠিক থাকে।
                </ListItem>
                <ListItem>
                  created_at timestamptz NOT NULL DEFAULT now()। now() হলো Transaction শুরুর মুহূর্ত, আর {"'now'"}
                  লেখা DEFAULT চিরকালের জন্য জমে যায়। updated_at এর জন্য PostgreSQL এ Trigger বা App।
                </ListItem>
                <ListItem>
                  Precision 0 থেকে 6, Default 6। বাড়তি ঘর গোল হয়, কাটা না, আর গোল করে মান পরের দিনে যেতে পারে।
                </ListItem>
                <ListItem>
                  শেষ নেই একটা জানা উত্তর হলে NOT NULL DEFAULT {"'infinity'"}, অজানা হলে NULL।
                </ListItem>
                <ListItem>
                  Time Zone রাখা হয় না, মুহূর্ত রাখা হয়। কারও ঘড়ি লাগলে আলাদা text Column এ জায়গার নাম, Offset
                  কখনো না। Asia/Dhaka নিজেই একবার +07 ছিল।
                </ListItem>
                <ListItem>
                  MySQL এ DATETIME হলো Time Zone ছাড়া লেখা, TIMESTAMP হলো UTC তে রূপান্তর, কিন্তু 2038-01-19
                  03:14:07 UTC তে তার শেষ। MySQL এ Precision এর Default শূন্য।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে আরও তিনটা ধরন, যেগুলো প্রায় প্রতিটা Table এ লাগে: হ্যাঁ বা না রাখার boolean, সারা পৃথিবীতে
                অনন্য পরিচয় দেওয়ার uuid, আর নির্দিষ্ট কয়েকটা মানের মধ্যে বেছে নেওয়ার enum। চলুন{" "}
                <Link href="/sql/topic/boolean-uuid-enum" className={LINK}>
                  Boolean, UUID and Enum
                </Link>{" "}
                লেসনে।
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
      ["timestamptz", "পৃথিবীর একটা মুহূর্ত, ভেতরে UTC, দেখায় Session এর ঘড়িতে", "booked_at, paid_at, lands_at"],
      ["date", "শুধু একটা দিন, কোনো ঘড়ি নেই", "starts_on, hired_on"],
      ["time", "রোজকার ঘড়ির সময়, কোনো দিন নেই, 24:00 পেরোয় না", "ready_by 14:00:00"],
      ["interval", "একটা দৈর্ঘ্য, মাস দিন আর মাইক্রোসেকেন্ড আলাদা ঘরে", "drive_time 03:00:00, cancel_window 2 days"],
      ["timestamp", "দেয়ালঘড়ির লেখা, Offset নীরবে বাদ", "খসড়া Table এ 08:30:00, ছয় ঘণ্টা ভুল"],
      ["DEFAULT now()", "Transaction শুরুর মুহূর্ত, 'now' লিখলে জমে যায়", "এক Transaction এর তিন Row, একটাই created_at"],
      ["Precision", "0 থেকে 6 ঘর, বাড়তি অংশ গোল হয়", "Mitu এর check-in গেল 2 November এ"],
      ["infinity", "সব মুহূর্তের পরে, শেষহীনের জন্য NOT NULL রাখা যায়", "LOYAL Offer, 2027 এও চলছে"],
      ["সীমা", "date 5874897 AD, timestamptz 294276 AD পর্যন্ত", "2026-02-29 এ ERROR 22008"],
      ["মুহূর্ত, Zone না", "Zone রাখা হয় না, দরকারে আলাদা text এ জায়গার নাম", "Oliver এর Offset শীতে ছয়, গ্রীষ্মে পাঁচ ঘণ্টা"],
      ["MySQL", "DATETIME লেখা মাত্র, TIMESTAMP এর শেষ 2038", "2038-01-19 03:14:08 এ ERROR 1292"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা timestamp Column এ '2026-11-20 08:30:00+00' ঢোকানো হলো। Session এর TimeZone Asia/Dhaka। SELECT করলে কী আসবে?",
        options: [
          {
            key: "A",
            text: "2026-11-20 14:30:00+06",
            isCorrect: false,
            explanation:
              "এটা আসত timestamptz Column এ। timestamp কোনো রূপান্তর করে না, আর শেষে কোনো Offset ও দেখায় না।",
          },
          {
            key: "B",
            text: "2026-11-20 08:30:00",
            isCorrect: true,
            explanation:
              "ঠিক। timestamp লেখার তারিখ আর ঘড়ির অংশটা নেয়, +00 নীরবে ফেলে দেয়। এখন এটাকে ঢাকার সকাল সাড়ে আটটা ভেবে পড়া খুব সহজ, যা ছয় ঘণ্টা ভুল।",
          },
          {
            key: "C",
            text: "2026-11-20 08:30:00+00",
            isCorrect: false,
            explanation: "timestamp কোনো Offset মনে রাখে না, তাই +00 দেখানোর উপায় তার নেই।",
          },
          {
            key: "D",
            text: "Error, কারণ timestamp এ Offset দেওয়া যায় না",
            isCorrect: false,
            explanation:
              "Error হলে বরং ভালো হতো, ভুলটা ধরা পড়ত। কিন্তু PostgreSQL Offset টা উপেক্ষা করে মানটা ঢুকিয়ে দেয়, কোনো সতর্কবার্তা ছাড়া।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা Table এ created_at timestamptz DEFAULT now()। BEGIN এর পরে তিনটা INSERT, মাঝে কয়েক সেকেন্ড অপেক্ষা, তারপর COMMIT। তিনটা Row এর created_at কেমন হবে?",
        options: [
          {
            key: "A",
            text: "তিনটা আলাদা মুহূর্ত, কয়েক সেকেন্ড ফারাকে",
            isCorrect: false,
            explanation:
              "এটা হতো DEFAULT clock_timestamp() হলে। now() প্রতিটা লাইনের নিজের মুহূর্ত দেয় না।",
          },
          {
            key: "B",
            text: "তিনটাই NULL, কারণ Transaction এর ভেতরে DEFAULT কাজ করে না",
            isCorrect: false,
            explanation: "DEFAULT Transaction এর ভেতরে আর বাইরে একইভাবে কাজ করে।",
          },
          {
            key: "C",
            text: "তিনটাই হুবহু একই মুহূর্ত, Transaction শুরুর সময়",
            isCorrect: true,
            explanation:
              "ঠিক। now() ফেরত দেয় Transaction শুরুর মুহূর্ত। এক Transaction এর সব Row একই সময় পায়, যা একসাথে ঘটা কাজগুলোকে চেনার জন্য সুবিধার।",
          },
          {
            key: "D",
            text: "তিনটাই COMMIT এর মুহূর্ত",
            isCorrect: false,
            explanation: "now() শুরুর মুহূর্ত দেয়, শেষের না। COMMIT এর মুহূর্ত কোনো DEFAULT এ পাওয়া যায় না।",
          },
        ],
      },
      {
        id: 3,
        text: "কেউ লিখলেন created_at timestamptz DEFAULT 'now'। এক মাস পরে নতুন Row এর created_at কী হবে?",
        options: [
          {
            key: "A",
            text: "সেই Row ঢোকানোর মুহূর্ত, now() এর মতোই",
            isCorrect: false,
            explanation:
              "উদ্ধৃতিচিহ্নের ভেতরের 'now' একটা লেখা, Function না। DEFAULT হিসেবে লিখলে সেটা একবারই মুহূর্তে বদলায়।",
          },
          {
            key: "B",
            text: "CREATE TABLE চালানোর মুহূর্ত, যতদিনই পার হোক",
            isCorrect: true,
            explanation:
              "ঠিক। লেখাটা CREATE TABLE এর সময় একবার মুহূর্তে বদলে DEFAULT এ জমে যায়। information_schema তে column_default এ সেই স্থির মুহূর্তটাই দেখা যায়।",
          },
          {
            key: "C",
            text: "Error, কারণ 'now' কোনো বৈধ মান না",
            isCorrect: false,
            explanation: "'now' বৈধ বিশেষ লেখা, তাই কোনো Error আসে না, আর ঠিক এই কারণেই ভুলটা লুকিয়ে থাকে।",
          },
          {
            key: "D",
            text: "আজকের মাঝরাত",
            isCorrect: false,
            explanation: "মাঝরাত দেয় 'today', আর সেটাও DEFAULT এ একইভাবে জমে যায়।",
          },
        ],
      },
      {
        id: 4,
        text: "checked_in_at timestamptz(0) Column এ '2026-11-01 23:59:59.6+06' ঢোকানো হলো। Asia/Dhaka তে checked_in_at::date কী দেবে?",
        options: [
          {
            key: "A",
            text: "2026-11-01, কারণ বাড়তি অংশ কেটে ফেলা হয়",
            isCorrect: false,
            explanation:
              "Precision এ বাড়তি অংশ কাটা হয় না, গোল করা হয়। কাটতে চাইলে Query তে date_trunc লাগে।",
          },
          {
            key: "B",
            text: "Error, কারণ Precision 0 এ ভগ্নাংশ দেওয়া যায় না",
            isCorrect: false,
            explanation: "ভগ্নাংশ দেওয়া যায়, PostgreSQL নিজেই সেটা গোল করে নেয়, কোনো Error ছাড়া।",
          },
          {
            key: "C",
            text: "2026-11-02, কারণ .6 গোল হয়ে পুরো এক সেকেন্ড, মুহূর্তটা পরের দিনের 00:00:00",
            isCorrect: true,
            explanation:
              "ঠিক। .5 বা বেশি উপরের দিকে গোল হয়। 23:59:59.6 হয়ে যায় 2026-11-02 00:00:00+06, তাই দিনের হিসাবে check-in টা 2 November এ পড়ে।",
          },
          {
            key: "D",
            text: "2026-10-31, কারণ date বের হয় UTC তে",
            isCorrect: false,
            explanation: "timestamptz থেকে date বের হয় Session এর TimeZone এ, এখানে Asia/Dhaka, UTC তে না।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা Offer এর শেষ নেই। valid_until Column এর জন্য কোনটা সবচেয়ে ভালো নকশা?",
        options: [
          {
            key: "A",
            text: "valid_until timestamptz, শেষ না থাকলে NULL",
            isCorrect: false,
            explanation:
              "NULL মানে অজানা। প্রতিটা চলমান Offer খোঁজার Query তে OR valid_until IS NULL লিখতে হবে, একবার ভুললেই শেষহীন Offer বাদ।",
          },
          {
            key: "B",
            text: "valid_until timestamptz NOT NULL DEFAULT 'infinity'",
            isCorrect: true,
            explanation:
              "ঠিক। infinity সব মুহূর্তের পরে, তাই সাধারণ BETWEEN বা তুলনাই ঠিক উত্তর দেয়, আর Column NOT NULL রাখা যায়। isfinite() দিয়ে আলাদা করা যায়।",
          },
          {
            key: "C",
            text: "valid_until text, শেষ না থাকলে 'never'",
            isCorrect: false,
            explanation: "text এ সময়ের তুলনা, ক্রম আর হিসাব কোনোটাই ঠিকমতো চলে না, আর যেকোনো আজেবাজে লেখা ঢুকে যেতে পারে।",
          },
          {
            key: "D",
            text: "valid_until date DEFAULT '9999-12-31'",
            isCorrect: false,
            explanation:
              "কাজ চলে, কিন্তু এটা একটা ভান করা তারিখ, আর মুহূর্তের বদলে দিন রাখায় দিনের ভেতরের শেষ সময় হারায়। PostgreSQL এ এর জন্য আসল infinity আছে।",
          },
        ],
      },
      {
        id: 6,
        text: "অতিথির নিজের Time Zone মনে রাখতে home_zone Column এ কী রাখা উচিত?",
        options: [
          {
            key: "A",
            text: "Offset, যেমন +00 বা +05:30",
            isCorrect: false,
            explanation:
              "Offset একটা মুহূর্তের সত্য। London গ্রীষ্মে +01, শীতে +00। +00 রাখলে অর্ধেক বছর এক ঘণ্টা ভুল দেখাবে।",
          },
          {
            key: "B",
            text: "কিছুই না, timestamptz নিজেই Time Zone রাখে",
            isCorrect: false,
            explanation: "timestamptz মুহূর্তটা UTC তে রাখে, লেখার Time Zone টা রাখে না। তাই আলাদা Column লাগে।",
          },
          {
            key: "C",
            text: "দেশের নাম, যেমন United Kingdom",
            isCorrect: false,
            explanation:
              "AT TIME ZONE দেশের নাম চেনে না, আর অনেক দেশে একাধিক Time Zone আছে। লাগবে IANA এর জায়গার নাম।",
          },
          {
            key: "D",
            text: "IANA এর জায়গার নাম, যেমন Europe/London বা Asia/Dhaka",
            isCorrect: true,
            explanation:
              "ঠিক। নামটা ওই জায়গার সব সময়ের নিয়ম জানে, DST আর 2009 এর ঢাকার মতো পুরনো বদল সহ। AT TIME ZONE home_zone সবসময় সেই মুহূর্তের ঠিক Offset বসায়।",
          },
        ],
      },
      {
        id: 7,
        text: "Priya র জন্মদিন timestamptz Column এ '1995-03-10 00:00+05:30' হিসেবে রাখা। UTC তে চলা একটা Server as_instant::date দিয়ে শুভেচ্ছার দিন বের করলে কী পাবে?",
        options: [
          {
            key: "A",
            text: "1995-03-09, এক দিন আগে",
            isCorrect: true,
            explanation:
              "ঠিক। Kolkata র মাঝরাত UTC তে আগের দিনের সন্ধ্যা 18:30। UTC তে date বের করলে 9 মার্চ। জন্মদিন একটা দিন, তাই রাখতে হতো date এ।",
          },
          {
            key: "B",
            text: "1995-03-10, কারণ timestamptz সবসময় ঠিক",
            isCorrect: false,
            explanation:
              "মুহূর্তটা ঠিকই আছে, কিন্তু প্রশ্নটা মুহূর্তের ছিল না, দিনের ছিল। মুহূর্ত থেকে দিন বের করলে কার ঘড়িতে, সেটা গুরুত্বপূর্ণ।",
          },
          {
            key: "C",
            text: "1995-03-11, এক দিন পরে",
            isCorrect: false,
            explanation: "UTC Kolkata র পেছনে, সামনে না, তাই দিন পেছায়, এগোয় না।",
          },
          {
            key: "D",
            text: "Error, কারণ timestamptz থেকে date বের করা যায় না",
            isCorrect: false,
            explanation: "যায়, Session এর TimeZone এ। সমস্যাটা Error না, নীরবে ভুল উত্তর।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ একটা সদস্যপদের শেষ তারিখ 2040 সাল। কোন Column এ রাখা যাবে না, আর কেন?",
        options: [
          {
            key: "A",
            text: "DATETIME, কারণ সেটা 2038 এ শেষ",
            isCorrect: false,
            explanation: "DATETIME এর Docs এর পরিসর 9999 সাল পর্যন্ত। 2038 এর সীমা TIMESTAMP এর।",
          },
          {
            key: "B",
            text: "TIMESTAMP, কারণ সেটা 1970 থেকে সেকেন্ড গোনে 32 bit এর ঘরে, শেষ 2038-01-19 03:14:07 UTC",
            isCorrect: true,
            explanation:
              "ঠিক। 2147483647 সেকেন্ডের পরে ঘরে আর জায়গা নেই। 2040 সালের মান দিলে ERROR 1292: Incorrect datetime value।",
          },
          {
            key: "C",
            text: "DATE, কারণ সেটা 3 bytes",
            isCorrect: false,
            explanation: "DATE এর পরিসরও 9999 পর্যন্ত। 3 bytes এ দিন গুনতে অনেক জায়গা।",
          },
          {
            key: "D",
            text: "কোনোটাতেই সমস্যা নেই",
            isCorrect: false,
            explanation: "TIMESTAMP এ আছে, আর সেটা কোনো সতর্কবার্তা না, সরাসরি Error।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: একটা Event Table, প্রতিটা সময়ের সিদ্ধান্ত সহ",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নকশার খাতা:</strong> Island Tours এর জন্য tt_events নামে একটা Table এর নকশা করুন: Cox{"'"}s Bazar এ
        একটা বার্ষিক Beach Festival, যার দিন, রোজ শুরুর ঘড়ির সময়, প্রতিটা Ticket বিক্রির মুহূর্ত, অনুষ্ঠান কতক্ষণ চলে,
        আর Early Bird ছাড়ের শেষ মুহূর্ত (কখনো কখনো কোনো শেষ নেই)। প্রতিটা Column এর জন্য লিখুন সেটা কোন প্রশ্নের
        উত্তর, আর ধরন কেন।
      </span>,
      <span key="2">
        <strong>Table আর DEFAULT:</strong> নকশা অনুযায়ী CREATE TABLE লিখুন, created_at সহ। তিনটা Row ঢোকান, যার
        অন্তত একটায় Offset +00 আর একটায় +05:30। information_schema.columns থেকে ধরন, datetime_precision আর DEFAULT
        পড়ে দেখান সব ঠিকমতো বসেছে।
      </span>,
      <span key="3">
        <strong>তিন ঘড়ির পরীক্ষা:</strong> SET TIME ZONE দিয়ে Asia/Dhaka, UTC আর Europe/London এ Ticket বিক্রির
        মুহূর্তগুলো পড়ুন। কোন Column বদলায় আর কোনটা বদলায় না, ফলাফল সহ তিন লাইনে ব্যাখ্যা করুন। শেষে TimeZone আবার
        Asia/Dhaka তে আনুন।
      </span>,
      <span key="4">
        <strong>ভুলটা ইচ্ছে করে করুন:</strong> একই Table এর একটা কপি বানান যেখানে বিক্রির মুহূর্ত timestamp, আর
        DEFAULT লেখা {"'now'"}। একই Row ঢুকিয়ে দেখান দুই জায়গায় কী কী ভুল হলো: ফারাক, ক্রম আর জমে যাওয়া DEFAULT।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> চিরকুট আর আন্তর্জাতিক বিমানের টিকিটের উদাহরণ দিয়ে একজন বন্ধুকে বোঝান
        timestamp আর timestamptz এর তফাত, আর কেন Database এ Time Zone রাখা হয় না, মুহূর্ত রাখা হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">প্রতিটা Column এর প্রশ্ন আর ধরনের কারণ লেখা নকশার খাতা</span>,
      <span key="d2">CREATE TABLE, তিনটা INSERT আর information_schema এর ফলাফল</span>,
      <span key="d3">তিন TimeZone এর ফলাফল আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d4">ভুল কপির ফলাফল আর প্রতিটা ভুলের এক লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ সময়ের Column",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "Island Tours এর সময়ের Column",
        description:
          "প্রথম ফাইলের Query তে ৭টা Row, পাঁচটা timestamptz আর দুটো date। তারপর \\d departures দেখায় starts_on এর ধরন date আর not null।",
      },
      {
        title: "timestamp বনাম timestamptz",
        description:
          "দ্বিতীয় ফাইলের তিনটা ফলাফল ফাইলের মন্তব্যের সাথে মেলান। শুরুর SET TIME ZONE লাইনটা রাখুন, নইলে আপনার Server এর নিজের ঘড়িতে দেখাবে।",
      },
      {
        title: "DEFAULT now() আর 'now' এর ফাঁদ",
        description:
          "তৃতীয় ফাইলে created_values 1 আর real_values 3। \\d tt_now_trap এ frozen এর Default একটা স্থির মুহূর্ত, আপনার চালানোর সময়, আর live এর now()।",
      },
      {
        title: "Precision আর গোল করা",
        description:
          "চতুর্থ ফাইলে Mitu যান 2 November এ, Shuvo থাকেন 1 November এ। timestamptz(7) এ দুটো WARNING আসে, আর \\d দেখায় timestamp(6) with time zone।",
      },
      {
        title: "infinity আর সীমা",
        description:
          "পঞ্চম ফাইলের প্রথম Query তে শুধু LOYAL। শেষের তিনটা Query একটা একটা চালান, তিনটাই Error, প্রথম লাইন ফাইলের মন্তব্যের সাথে মিলিয়ে নিন।",
      },
      {
        title: "পুরো Pickup Table",
        description:
          "ষষ্ঠ ফাইলের \\d tt_pickups এ নয়টা Column, ready_by time(0), আর created_at পুরো Precision এ now()। শেষ Query তে Priya, Oliver, Aiman, এই ক্রমে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-sample-types.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name NOT LIKE 'tt\\_%'
  AND data_type IN ('date', 'time without time zone', 'timestamp without time zone',
                    'timestamp with time zone', 'interval')
ORDER BY table_name, column_name;
-- (7 rows)
-- bookings.booked_at   timestamp with time zone  now()
-- customers.joined_at  timestamp with time zone  now()
-- departures.starts_on date
-- guides.hired_on      date
-- payments.paid_at     timestamp with time zone
-- reviews.created_at   timestamp with time zone
-- tours.created_at     timestamp with time zone  now()

\\d departures
-- starts_on | date | | not null |`,
      },
      {
        language: "sql",
        filename: "02-plain-vs-aware.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

DROP TABLE IF EXISTS tt_clock;
CREATE TABLE tt_clock (label text, plain timestamp, aware timestamptz);
INSERT INTO tt_clock VALUES
  ('Dhaka',  '2026-11-01 10:00+06', '2026-11-01 10:00+06'),
  ('London', '2026-11-01 10:00+00', '2026-11-01 10:00+00');
SELECT * FROM tt_clock;
-- Dhaka  | 2026-11-01 10:00:00 | 2026-11-01 10:00:00+06
-- London | 2026-11-01 10:00:00 | 2026-11-01 16:00:00+06

SET TIME ZONE 'UTC';
SELECT * FROM tt_clock;
-- Dhaka  | 2026-11-01 10:00:00 | 2026-11-01 04:00:00+00
-- London | 2026-11-01 10:00:00 | 2026-11-01 10:00:00+00

SET TIME ZONE 'Asia/Dhaka';
SELECT max(plain) - min(plain) AS plain_gap,
       max(aware) - min(aware) AS aware_gap
FROM tt_clock;
-- 00:00:00 | 06:00:00`,
      },
      {
        language: "sql",
        filename: "03-defaults.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

DROP TABLE IF EXISTS tt_audit;
CREATE TABLE tt_audit (
  note       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  real_at    timestamptz NOT NULL DEFAULT clock_timestamp()
);
BEGIN;
INSERT INTO tt_audit (note) VALUES ('first');
SELECT pg_sleep(0.2);
INSERT INTO tt_audit (note) VALUES ('second');
SELECT pg_sleep(0.2);
INSERT INTO tt_audit (note) VALUES ('third');
COMMIT;
SELECT count(DISTINCT created_at) AS created_values,
       count(DISTINCT real_at)    AS real_values
FROM tt_audit;
-- 1 | 3

DROP TABLE IF EXISTS tt_now_trap;
CREATE TABLE tt_now_trap (
  frozen timestamptz DEFAULT 'now',
  live   timestamptz DEFAULT now()
);
\\d tt_now_trap
-- frozen | timestamp with time zone | | | '<চালানোর মুহূর্ত>+06'::timestamp with time zone
-- live   | timestamp with time zone | | | now()`,
      },
      {
        language: "sql",
        filename: "04-precision.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

DROP TABLE IF EXISTS tt_checkins;
CREATE TABLE tt_checkins (
  guest         text NOT NULL,
  checked_in_at timestamptz(0) NOT NULL
);
INSERT INTO tt_checkins VALUES
  ('Mitu Rahman', '2026-11-01 23:59:59.6+06'),
  ('Shuvo Das',   '2026-11-01 23:59:59.4+06');
SELECT guest, checked_in_at, checked_in_at::date AS counted_on
FROM tt_checkins
ORDER BY guest;
-- Mitu Rahman | 2026-11-02 00:00:00+06 | 2026-11-02
-- Shuvo Das   | 2026-11-01 23:59:59+06 | 2026-11-01

DROP TABLE IF EXISTS tt_too_precise;
CREATE TABLE tt_too_precise (happened_at timestamptz(7));
-- WARNING:  TIMESTAMP(7) WITH TIME ZONE precision reduced to maximum allowed, 6
-- (একই WARNING দুইবার)
\\d tt_too_precise
-- happened_at | timestamp(6) with time zone |`,
      },
      {
        language: "sql",
        filename: "05-infinity-and-limits.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

DROP TABLE IF EXISTS tt_offers;
CREATE TABLE tt_offers (
  code        text        NOT NULL,
  valid_from  timestamptz NOT NULL,
  valid_until timestamptz NOT NULL DEFAULT 'infinity'
);
INSERT INTO tt_offers (code, valid_from, valid_until)
VALUES ('EID26', '2026-11-01 00:00+06', '2026-11-30 23:59:59+06');
INSERT INTO tt_offers (code, valid_from)
VALUES ('LOYAL', '2026-01-01 00:00+06');
SELECT code
FROM tt_offers
WHERE TIMESTAMPTZ '2027-06-01 12:00+06' BETWEEN valid_from AND valid_until;
-- LOYAL

SELECT DATE '2026-02-29';
-- ERROR:  date/time field value out of range: "2026-02-29"
SELECT DATE '5874898-01-01';
-- ERROR:  date out of range: "5874898-01-01"
SELECT 'infinity'::date - DATE '2026-11-01';
-- ERROR:  cannot subtract infinite dates`,
      },
      {
        language: "sql",
        filename: "06-pickups.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

DROP TABLE IF EXISTS tt_pickups;
CREATE TABLE tt_pickups (
  pickup_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guest      text           NOT NULL,
  home_zone  text           NOT NULL,
  lands_at   timestamptz    NOT NULL,
  pickup_on  date           NOT NULL,
  ready_by   time(0),
  drive_time interval       NOT NULL DEFAULT '3 hours',
  offer_ends timestamptz    NOT NULL DEFAULT 'infinity',
  created_at timestamptz    NOT NULL DEFAULT now()
);
INSERT INTO tt_pickups (guest, home_zone, lands_at, pickup_on, ready_by, drive_time) VALUES
  ('Oliver Bennett', 'Europe/London',     '2026-11-20 08:30:00+00',    '2026-11-20', '14:00', '45 minutes'),
  ('Priya Sharma',   'Asia/Kolkata',      '2026-11-20 09:15:00+05:30', '2026-11-20', '09:30', DEFAULT),
  ('Aiman Zulkifli', 'Asia/Kuala_Lumpur', '2026-11-21 01:10:00+08',    '2026-11-20', '22:45', '1 hour 15 minutes');

\\d tt_pickups
--  ready_by   | time(0) without time zone   |  |          |
--  drive_time | interval                    |  | not null | '03:00:00'::interval
--  offer_ends | timestamp with time zone    |  | not null | 'infinity'::timestamp with time zone
--  created_at | timestamp with time zone    |  | not null | now()

SELECT guest,
       lands_at                        AS lands_dhaka,
       lands_at AT TIME ZONE home_zone AS lands_their_clock,
       lands_at + drive_time           AS at_hotel
FROM tt_pickups
ORDER BY lands_at;
-- Priya Sharma   | 2026-11-20 09:45:00+06 | 2026-11-20 09:15:00 | 2026-11-20 12:45:00+06
-- Oliver Bennett | 2026-11-20 14:30:00+06 | 2026-11-20 08:30:00 | 2026-11-20 15:15:00+06
-- Aiman Zulkifli | 2026-11-20 23:10:00+06 | 2026-11-21 01:10:00 | 2026-11-21 00:25:00+06`,
      },
    ],
    tip: "প্রতিটা ফাইল শুরু হয় SET TIME ZONE 'Asia/Dhaka' দিয়ে, কারণ psql এর ঘড়ি আসে Server এর Setting থেকে, আর সেটা আপনার Laptop এ এক রকম, Cloud এ আরেক রকম। কাজ শেষে চাইলে DROP TABLE দিয়ে tt_ Table গুলো মুছে ফেলুন। island_tours এর আসল আট Table এ এই লেসনের কোনো ড্রিল হাত দেয় না।",
  },
};
