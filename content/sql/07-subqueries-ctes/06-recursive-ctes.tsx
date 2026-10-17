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
  CycleGuardLab,
  RecursionStepLab,
} from "../../../components/course/topics/subqueries/recursive-animations";
import {
  IterationRoundsDiagram,
  PlacesTreeDiagram,
  RecursiveAnatomyDiagram,
  RouteGraphDiagram,
  UnionVsUnionAllSplit,
} from "../../../components/course/topics/subqueries/recursive-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/**
 * The places tree the lesson builds inline, because the sample database has
 * no hierarchy. Every query that needs it starts with this CTE.
 */
const PLACES = `places(place_id, name, kind, parent_id) AS (
  VALUES
    (1, 'Bangladesh', 'country', NULL::int),
    (2, 'Chattogram Division', 'division', 1),
    (3, 'Khulna Division', 'division', 1),
    (4, 'Sylhet Division', 'division', 1),
    (5, 'Barishal Division', 'division', 1),
    (6, 'Cox''s Bazar District', 'district', 2),
    (7, 'Rangamati District', 'district', 2),
    (8, 'Bandarban District', 'district', 2),
    (9, 'Sylhet District', 'district', 4),
    (10, 'Patuakhali District', 'district', 5),
    (11, 'Saint Martin''s Island', 'place', 6),
    (12, 'Cox''s Bazar', 'place', 6),
    (13, 'Sajek Valley', 'place', 7),
    (14, 'Bandarban', 'place', 8),
    (15, 'Sundarbans', 'place', 3),
    (16, 'Sylhet', 'place', 9),
    (17, 'Kuakata', 'place', 10)
)`;

/** The made-up transfer map: one row per one-way leg. */
const ROUTES = `routes(from_place, to_place) AS (
  VALUES
    ('Dhaka', 'Chattogram'), ('Chattogram', 'Dhaka'),
    ('Chattogram', 'Cox''s Bazar'), ('Cox''s Bazar', 'Chattogram'),
    ('Cox''s Bazar', 'Teknaf'),
    ('Teknaf', 'Saint Martin''s Island'), ('Saint Martin''s Island', 'Teknaf'),
    ('Chattogram', 'Bandarban'), ('Chattogram', 'Rangamati'),
    ('Rangamati', 'Sajek Valley'),
    ('Dhaka', 'Sylhet'), ('Dhaka', 'Khulna'), ('Khulna', 'Sundarbans'),
    ('Dhaka', 'Kuakata')
)`;

export const recursiveCtesContent: TopicData = {
  id: "recursive-ctes",
  introduction: {
    badge: "MODULE 07 · LESSON 06",
    title: <SectionTitle>যে Query নিজেকেই আবার ডাকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি WITH দিয়ে একটা বড় Query কে নাম দেওয়া ছোট ছোট ধাপে ভেঙেছেন। প্রতিটা ধাপ একবার চলে, তার
          ফল পরের ধাপ পড়ে। কিন্তু কিছু প্রশ্ন আছে যেখানে আগে থেকে জানা নেই কয়টা ধাপ লাগবে। একটা জায়গার পুরো ঠিকানা,
          দেশ থেকে বিভাগ, বিভাগ থেকে জেলা, জেলা থেকে জায়গা, কোথাও তিন ধাপ, কোথাও দুই। Dhaka থেকে কোথায় কোথায় পৌঁছানো
          যায়, এক বাসে, দুই বাসে, নাকি চার বার বদলে। পুরো মাসের প্রতিটা দিন, যেদিন কিছুই হয়নি সেদিনও।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি এমন একটা CTE লিখতে শিখবেন যেটা নিজের নামটাকেই আবার পড়ে, আর যতক্ষণ নতুন কিছু পাওয়া যায়
          ততক্ষণ একই ধাপ বার বার চালায়। এর নাম Recursive CTE। শুরু হবে 1 থেকে 5 গোনা দিয়ে, তারপর একটা পুরো মাসের
          ক্যালেন্ডার, তারপর একটা জায়গার Tree যেটা নিচে নামা আর উপরে ওঠা দুই দিকেই হাঁটা যায়, আর শেষে এমন একটা পথের
          নকশা যেখানে গাড়ি চক্রে ঘুরতে পারে, আর সেই চক্র থেকে Query কে বাঁচানোর তিন উপায়।
        </ContentParagraph>
        <ContentParagraph>
          শুরুর আগে একটা সতর্কতা, যেটা এই লেসনের প্রতিটা বক্সের জন্য সত্য: যে Recursive Query কখনো থামে না, সেটা
          Browser এর এই Database কে চিরকাল ব্যস্ত রাখতে চায়। Page যাতে আটকে না যায়, তাই এই পাতার বক্স দশ সেকেন্ড পর এমন
          Query থামিয়ে দেয় আর Database নতুন করে শুরু করে, ফলে আগের বক্সে করা বদলগুলো মুছে যায়। কীভাবে থামার শর্ত লিখতে
          হয়, সেটাই এই লেসনের সবচেয়ে জরুরি অংশ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে শুধু প্রথম ধাপটা দিন, আর বলুন একটা ধাপ থেকে পরেরটা কীভাবে আসে। বাকিটা আমি নিজেই বার বার করব, যতক্ষণ না নতুন কিছু পাই। শুধু থামার শর্তটা দিতে ভুলবেন না।",
      author: "WITH RECURSIVE",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যেদিন কিছু হয়নি, সেদিনটাও চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর Operations Manager ফারুক সাহেব রবিবার সকালের বৈঠকে
                বসেছেন। তাঁর হাতে একটা খালি ক্যালেন্ডারের পাতা, November এর তিরিশটা ঘর। তিনি চান প্রতিটা ঘরে লেখা থাকুক
                সেদিন কয়টা Departure রওনা হচ্ছে, যেদিন একটাও নেই সেদিন 0। তাহলে তিনি এক নজরে দেখবেন কোন সপ্তাহে Guide
                দের ছুটি দেওয়া যায়, আর কোন দিনগুলো একদম খালি পড়ে আছে যেখানে নতুন ট্যুর বসানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                Module 05 এর বিদ্যা দিয়ে প্রথম চেষ্টা সহজ মনে হয়: departures থেকে November এর Row গুলো নিয়ে starts_on
                দিয়ে GROUP BY। নিচের বক্সে সেই Query টা আছে। Run চাপুন আর গুনে দেখুন কয়টা ঘর ভরল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ক্যালেন্ডারের প্রথম চেষ্টা"
              query={`SELECT starts_on, count(*) AS departures
FROM departures
WHERE starts_on BETWEEN DATE '2026-11-01' AND DATE '2026-11-30'
GROUP BY starts_on
ORDER BY starts_on;`}
              caption="মাত্র চারটা Row: 14, 20, 21 আর 27 November, প্রতিটায় 1। বাকি ছাব্বিশটা দিন উধাও। GROUP BY শুধু সেই দিনগুলোর দল বানাতে পারে যেগুলো Table এ আছে। যে দিনে কোনো Departure নেই, সেই দিনটা departures Table এর কোথাও লেখা নেই, তাই তার দলও হয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমস্যাটা গোনায় না, তালিকায়। ফারুক সাহেবের দরকার তিরিশটা দিনের একটা তালিকা, যেটা কোনো Table এ নেই।
                Module 06 এর CROSS JOIN লেসনে PostgreSQL এর generate_series দিয়ে এমন তালিকা বানানো দেখেছেন। কিন্তু এর
                পেছনে একটা আরও সাধারণ ধারণা আছে, যেটা দিয়ে শুধু তারিখ না, অনেক কিছু বানানো যায়: শুরু 1 November, আর
                প্রতিটা দিন থেকে পরের দিন আসে আগের দিনের সাথে একটা দিন যোগ করে, যতক্ষণ না 30 November পার হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই একই ধাঁচের প্রশ্ন আরও দুটো জায়গায় আসে। মার্কেটিং এর তানিয়া চান প্রতিটা ট্যুরের পাতায় একটা ঠিকানার
                সারি: Bangladesh {">"} Chattogram Division {">"} Cox&apos;s Bazar District {">"} Saint Martin&apos;s Island।
                প্রতিটা জায়গার উপরে কে আছে, তার উপরে কে, এভাবে যতক্ষণ না দেশে পৌঁছানো যায়। আর Customer Care জানতে চায়
                Dhaka থেকে কোন কোন জায়গায় কয়বার গাড়ি বদলে পৌঁছানো যায়। তিনটা প্রশ্নেরই গড়ন এক: একটা শুরু, আর একটা
                নিয়ম যেটা একটা ধাপ থেকে পরের ধাপ বানায়, অজানা সংখ্যক বার। SQL এ এর উত্তর Recursive CTE।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "repeat-until-done",
      subHeader: { index: "002", title: "Repeat Until Done" },
      title: <SectionTitle>একটা শুরু, একটা নিয়ম, আর থামা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পারিবারিক বংশতালিকার কথা ভাবুন। আপনার দাদি জানতে চাইলেন তাঁর সব নাতি নাতনি, তাদের সন্তান, তাদের
                সন্তান, সবার নাম। আপনি কী করবেন? প্রথমে দাদির নিজের সন্তানদের নাম লিখবেন। তারপর শুধু সেই নামগুলো
                দেখে প্রত্যেকের সন্তানদের খুঁজবেন। তারপর শুধু নতুন পাওয়া নামগুলোর সন্তান। প্রতিবার আপনি শুধু ঠিক আগের
                বারে পাওয়া নতুন নামগুলো দেখেন, পুরো তালিকা না। আর যেদিন একটা ধাপে কারো কোনো সন্তান পাওয়া যায় না, সেদিন
                কাজ শেষ।
              </ContentParagraph>
              <ContentParagraph>
                Recursive CTE ঠিক এভাবে কাজ করে। এর দুটো অংশ। প্রথম অংশ শুরুর Row গুলো দেয়, এর নাম Anchor, নোঙরের মতো
                শুরুর জায়গা। দ্বিতীয় অংশ একটা নিয়ম, যেটা আগের বারের নতুন Row গুলো পড়ে পরের Row বানায়, এর নাম Recursive
                Member। PostgreSQL প্রথমে Anchor চালায়। তারপর Recursive Member কে বার বার চালায়, প্রতিবার শুধু আগের বারের
                নতুন Row দিয়ে। যে বারে Recursive Member একটাও নতুন Row দেয় না, সেই বারে সব থামে, আর সব বারের Row
                একসাথে হয় পুরো ফল।
              </ContentParagraph>
              <ContentParagraph>
                নামটা Recursive, মানে নিজেকে ডাকা, কারণ লেখার সময় দ্বিতীয় অংশটা CTE এর নিজের নামটাই FROM এ পড়ে।
                PostgreSQL এর Docs নিজেই বলে, ভেতরে আসলে যা ঘটে সেটা Iteration, মানে বার বার একই ধাপ চালানো, কিন্তু
                SQL Standard এর দেওয়া নামটাই সবাই ব্যবহার করে। নিচের বক্সে সবচেয়ে ছোট উদাহরণ: 1 থেকে 5 গোনা। Syntax
                এর প্রতিটা অংশ পরের Section এ, এখন শুধু Run চাপুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="1 থেকে 5, কোনো Table ছাড়া"
              query={`WITH RECURSIVE n(x) AS (
  SELECT 1                 -- Anchor: শুরু
  UNION ALL
  SELECT x + 1 FROM n      -- Recursive Member: আগের সংখ্যা থেকে পরেরটা
  WHERE x < 5              -- থামার শর্ত
)
SELECT x FROM n;`}
              caption="পাঁচটা Row: 1, 2, 3, 4, 5। কোনো Table থেকে কিছু পড়া হয়নি। Anchor দিল 1। তারপর Recursive Member 1 থেকে 2 বানাল, 2 থেকে 3, 3 থেকে 4, 4 থেকে 5। 5 এর বেলায় WHERE x < 5 মিথ্যা, তাই নতুন Row নেই, আর সেখানেই থামা। 5 বদলে 10 লিখে আবার চালিয়ে দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা বাক্যে Recursive CTE",
          content: (
            <ContentParagraph>
              শুরুর Row দিন, একটা Row থেকে পরের Row কীভাবে আসে সেই নিয়ম দিন, আর এমন একটা শর্ত দিন যাতে কোনো এক সময়
              নতুন Row আসা বন্ধ হয়। PostgreSQL শুরুটা একবার চালায়, নিয়মটা বার বার চালায় শুধু আগের বারের নতুন Row
              দিয়ে, আর নতুন কিছু না এলে থামে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>তিনটা অংশ আর দুটো জরুরি নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RecursiveAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির প্রতিটা অংশ একে একে পড়া যাক। প্রথমে <code className={CODE}>WITH RECURSIVE</code>, সাধারণ WITH এর
                সাথে একটা শব্দ বেশি। এই শব্দটা PostgreSQL কে বলে, এই WITH এর ভেতরের কোনো CTE নিজের নাম পড়তে পারে।
                তারপর CTE এর নাম, আর Bracket এ তার Column এর নাম: <code className={CODE}>n(x)</code> মানে CTE টার নাম n,
                আর তার একটাই Column, x। Column এর নাম এখানে দিয়ে দেওয়া ভালো অভ্যাস, কারণ দুই অংশের SELECT এ নাম আলাদা
                হলেও ফলের Column এর নাম এখান থেকেই আসে।
              </ContentParagraph>
              <ContentParagraph>
                Bracket এর ভেতরে প্রথম SELECT হলো Anchor। এটা কখনো নিজের নাম পড়ে না, তাই একবারই চলে। তারপর{" "}
                <code className={CODE}>UNION ALL</code>, যেটা দুই অংশের Row একসাথে জোড়ে। UNION আর UNION ALL এর পার্থক্য
                এখানে খুব বড়, সেটা Section 006 এ। শেষে দ্বিতীয় SELECT, Recursive Member, যার FROM এ CTE এর নিজের নাম n।
                শেষে Bracket বন্ধ, আর তার পরের SELECT যে পুরো ফলটা পড়ে, ঠিক একটা সাধারণ Table এর মতো।
              </ContentParagraph>
              <ContentParagraph>
                দুটো নিয়ম না জানলে প্রথম দিনেই Error আসে। এক, Anchor সবসময় আগে, Recursive Member পরে। উল্টো লিখলে
                PostgreSQL বলে নিজেকে পড়া অংশটা শুরুর অংশে থাকতে পারে না। দুই, RECURSIVE শব্দটা ভুলে গেলে PostgreSQL
                CTE এর ভেতর থেকে তার নিজের নাম চেনে না, আর বলে এমন কোনো Table নেই। মজার ব্যাপার, Error এর HINT নিজেই বলে
                দেয় কী লিখতে হবে। নিচের বক্সে প্রথম Query ঠিক, দ্বিতীয়টায় RECURSIVE নেই। Run চেপে DETAIL আর HINT পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RECURSIVE শব্দটা ছাড়া কী হয়"
              query={`WITH RECURSIVE t(n) AS (
  SELECT 1 UNION ALL SELECT n + 1 FROM t WHERE n < 3
)
SELECT n FROM t;

WITH t(n) AS (
  SELECT 1 UNION ALL SELECT n + 1 FROM t WHERE n < 3
)
SELECT n FROM t;`}
              caption={`প্রথম Query দেয় 1, 2, 3। দ্বিতীয়টা থামে Error এ: relation "t" does not exist। DETAIL বলে t নামে একটা WITH আছে ঠিকই, কিন্তু Query এর এই অংশ থেকে তাকে ছোঁয়া যায় না, আর HINT বলে WITH RECURSIVE লিখতে। এরপর দুই অংশের জায়গা অদলবদল করে দেখুন, অর্থাৎ SELECT n + 1 ... আগে আর SELECT 1 পরে: তখন আসবে recursive reference to query "t" must not appear within its non-recursive term।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "RECURSIVE পুরো WITH এর জন্য একবার",
          content: (
            <ContentParagraph>
              একটা WITH এ কয়েকটা CTE থাকলে RECURSIVE শব্দটা শুরুতে একবারই লেখা হয়, প্রতিটা CTE এর আগে না। তখন যেকোনো
              CTE নিজেকে পড়তে পারে, আর যেগুলো পড়ে না সেগুলো সাধারণ CTE এর মতোই চলে। এই লেসনের জায়গার Query গুলোতে ঠিক
              এটাই হয়েছে: <code className={CODE}>WITH RECURSIVE places AS (...), tree AS (...)</code>, যেখানে places একটা
              সাধারণ VALUES এর তালিকা আর tree টা Recursive।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-run",
      subHeader: { index: "004", title: "Watch It Run" },
      title: <SectionTitle>Working Table: প্রতিবার শুধু নতুন Row গুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভেতরে কী ঘটে সেটা ঠিকঠাক বোঝা দরকার, কারণ থামা না থামা, আর চক্রে আটকানো, সবই এর উপর নির্ভর করে।
                PostgreSQL দুটো জায়গা রাখে। একটা হলো জমানো ফল, যেখানে এখন পর্যন্ত পাওয়া সব Row জমা হয়। আরেকটা হলো
                Working Table, যেখানে থাকে শুধু ঠিক আগের বারে পাওয়া নতুন Row। Recursive Member যখন FROM n লেখে, তখন
                সে পুরো জমানো ফল না, শুধু Working Table টা পড়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বার ০:</strong> Anchor চলে। তার Row গুলো জমানো ফলে যায়, আর একই Row গুলো দিয়ে প্রথম Working
                  Table তৈরি হয়।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা পরের বার:</strong> Recursive Member চলে, FROM n এর জায়গায় Working Table নিয়ে। যে Row
                  গুলো আসে, সেগুলো জমানো ফলে যোগ হয়, আর সেগুলো দিয়েই পরের Working Table, আগেরটা ফেলে দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>থামা:</strong> যে বারে Recursive Member একটাও Row দেয় না, Working Table খালি হয়ে যায়।
                  খালি Table থেকে আর কিছু বানানো সম্ভব না, তাই সেখানেই শেষ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ তিনটা Query এক বার এক বার করে চালানো যায়। “Bangladesh থেকে নিচে” বেছে নিয়ে পরের বার চাপতে
                থাকুন। দেখবেন বার ১ এ শুধু চারটা বিভাগ আসে, বার ২ তে শুধু সেই চারটার সন্তান। Bangladesh দ্বিতীয়বার
                কখনো খোঁজা হয় না, কারণ সে আর Working Table এ নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RecursionStepLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IterationRoundsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই ছবি থেকে একটা জরুরি কথা বের হয়: Recursive Member এর ভেতরে Working Table ছাড়া অন্য কিছু দিয়ে থামার
              সিদ্ধান্ত নেওয়া যায় না। সে জানে না আগে কয়টা বার হয়েছে, জানে না জমানো ফলে কী আছে, যদি না আপনি নিজে একটা
              Column এ সেটা বয়ে নিয়ে যান। পরের Section গুলোতে ঠিক এটাই করা হবে: depth নামে একটা গোনা Column, আর path
              নামে একটা তালিকা, যেটা প্রতিটা Row তার নিজের ইতিহাস হিসেবে সাথে রাখে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "when-it-stops",
      subHeader: { index: "005", title: "When It Stops" },
      title: <SectionTitle>থামার শর্ত, আর যে Query থামে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Recursive CTE থামে শুধু একটা কারণে: কোনো এক বারে Recursive Member নতুন Row দেয় না। গোনার উদাহরণে এটা
                ঘটায় WHERE x {"<"} 5। Tree এর বেলায় এটা নিজে থেকেই ঘটে, কারণ নিচের সারির জায়গাগুলোর কোনো সন্তান নেই।
                কিন্তু শর্তটা কোথায় বসে, সেটা নিয়ে একটা ছোট ফাঁদ আছে। নিচের বক্সে প্রতিবার সংখ্যা দ্বিগুণ হয়, আর শর্ত
                n {"<"} 100। শেষ সংখ্যাটা কত হবে, Run চাপার আগে আন্দাজ করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শর্ত কোন Row কে পরীক্ষা করে"
              query={`WITH RECURSIVE t(n) AS (
  SELECT 1
  UNION ALL
  SELECT n * 2 FROM t WHERE n < 100
)
SELECT n FROM t;`}
              caption="আটটা Row: 1, 2, 4, 8, 16, 32, 64, 128। শেষেরটা 100 এর বড়, অথচ শর্ত বলে n < 100। কারণ WHERE পরীক্ষা করে পুরনো Row কে, Working Table এর 64 কে, নতুন 128 কে না। 64 < 100 সত্য, তাই 128 তৈরি হলো। পরের বারে 128 < 100 মিথ্যা, তাই থামা। নতুন মানের উপর সীমা চাইলে লিখুন WHERE n * 2 < 100, তখন শেষ সংখ্যা 64।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টোটা ভাবুন। WHERE টা বাদ দিলে Recursive Member প্রতিবার একটা নতুন Row দেয়: 2, 3, 4, এভাবে চিরকাল।
                Working Table কখনো খালি হয় না, তাই Query কখনো থামে না। নিজের মেশিনের PostgreSQL এ এমন হলে আপনি Ctrl+C
                চেপে থামাতে পারেন, আর Production Server এ statement_timeout নামের Setting একটা সময়সীমা পার হলে Query টা
                বাতিল করে দেয়। কিন্তু এই পাতার Browser এর Database এ statement_timeout কাজ করে না, আমরা পরীক্ষা করে
                দেখেছি। তাই বক্সগুলো নিজেরাই একটা পাহারা বসিয়েছে: কোনো Statement দশ সেকেন্ডের বেশি চললে বক্স সেটা থামিয়ে
                দেয় আর Database নতুন করে শুরু করে। নিচের প্রথম Query টা কোনো বক্সে চালালে ঠিক সেটাই দেখবেন: দশ সেকেন্ড
                অপেক্ষা, তারপর একটা Error, আর ওই Page এ আগে বানানো Table গুলো উধাও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "endless-vs-limit.sql",
          code: `-- থামার শর্ত নেই: Working Table কখনো খালি হয় না
WITH RECURSIVE t(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM t
)
SELECT n FROM t;

-- PostgreSQL এর Docs এর একটা কৌশল: বাইরে LIMIT দিলে PostgreSQL
-- শুধু যতগুলো Row লাগে ততগুলোই বানায়, তাই এটা 1 থেকে 5 দিয়ে থামে।
-- Docs নিজেই বলে Production এ এর উপর ভরসা না করতে: বাইরে ORDER BY
-- বা Join দিলে সাধারণত কাজ করে না, আর অন্য Database এ (যেমন MySQL) একদম না।
WITH RECURSIVE t(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM t
)
SELECT n FROM t LIMIT 5;`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিরাপদ অভ্যাস: একটা গোনার Column",
          content: (
            <ContentParagraph>
              যেখানে থামার শর্ত নিয়ে আপনি নিশ্চিত না, সেখানে Anchor এ <code className={CODE}>0 AS depth</code> দিন, Recursive
              Member এ <code className={CODE}>depth + 1</code>, আর WHERE এ{" "}
              <code className={CODE}>depth {"<"} 20</code> এর মতো একটা সীমা। Data তে ভুল থাকলেও Query টা বিশ বারের বেশি
              চলবে না। এই বক্সগুলোতে নিজে Query বদলানোর সময়ও এই অভ্যাসটা রাখুন: না হলে দশ সেকেন্ড অপেক্ষার পর বক্স
              Query থামাবে আর Database নতুন করে শুরু হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1: জোড় সংখ্যা"
              orderMatters
              task={
                <>
                  একটা Recursive CTE দিয়ে 2 থেকে 20 পর্যন্ত সব জোড় সংখ্যা বের করুন, একটাই Column, ছোট থেকে বড়। কোনো Table
                  লাগবে না। ফল দশটা Row।
                </>
              }
              hint={
                <>
                  Anchor হবে <code className={CODE}>SELECT 2</code>, প্রতিবার 2 যোগ। শর্তটা পুরনো Row এর উপর বসে, তাই 18
                  থেকে 20 বানাতে হলে শর্ত হবে <code className={CODE}>n {"<"} 20</code>। শেষে ORDER BY n।
                </>
              }
              solution={`WITH RECURSIVE evens(n) AS (
  SELECT 2
  UNION ALL
  SELECT n + 2 FROM evens WHERE n < 20
)
SELECT n FROM evens ORDER BY n;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "union-or-union-all",
      subHeader: { index: "006", title: "UNION or UNION ALL" },
      title: <SectionTitle>পুরনো Row আবার এলে কী হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন পর্যন্ত সব উদাহরণে দুই অংশের মাঝে UNION ALL ছিল। এর জায়গায় UNION লেখা যায়, আর তখন একটা বাড়তি কাজ
                হয়। PostgreSQL এর Docs এ নিয়মটা এরকম: UNION হলে প্রতিটা বারের নতুন Row থেকে হুবহু একই Row গুলো ফেলে দেওয়া
                হয়, আর সেই Row গুলোও ফেলে দেওয়া হয় যেগুলো আগের কোনো বারে জমানো ফলে চলে এসেছে। যা বাকি থাকে, শুধু সেটাই
                Working Table এ যায়।
              </ContentParagraph>
              <ContentParagraph>
                এর ফল একটা চমৎকার সুবিধা। ধরুন নিয়মটা এমন যে 1 থেকে 2, 2 থেকে 3, আর 3 থেকে আবার 1 আসে। UNION ALL এ এটা
                চিরকাল ঘোরে। UNION এ চতুর্থ বারের 1 টা আগেই জমানো ফলে আছে, তাই ফেলে দেওয়া হয়, Working Table খালি হয়, আর
                Query থামে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UnionVsUnionAllSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কিন্তু UNION তুলনা করে পুরো Row, প্রতিটা Column। Row এর সাথে একটা গোনার Column থাকলেই আর কোনো দুটো Row হুবহু
              এক থাকে না, তাই UNION আর কিছুই ফেলতে পারে না। নিচের বক্সে দুটো Query, দুটোতেই step নামে একটা গোনার Column।
              প্রথমটা UNION ALL, দ্বিতীয়টা UNION, আর দুটোকেই থামায় step {"<"} 7।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UNION পুরো Row মেলায়"
              query={`WITH RECURSIVE t(step, n) AS (
  SELECT 1, 1
  UNION ALL
  SELECT step + 1, n % 3 + 1 FROM t WHERE step < 7
)
SELECT step, n FROM t;

WITH RECURSIVE t(step, n) AS (
  SELECT 1, 1
  UNION
  SELECT step + 1, n % 3 + 1 FROM t WHERE step < 7
)
SELECT count(*) AS rows_with_union FROM t;`}
              caption="প্রথম Query দেয় সাতটা Row, n এর মান 1, 2, 3, 1, 2, 3, 1। দ্বিতীয়টাও সাতটা Row গোনে। n বার বার একই হলেও step প্রতিবার আলাদা, তাই কোনো দুটো Row হুবহু মেলে না আর UNION কিছুই ফেলে না। step Column টা বাদ দিয়ে শুধু n রাখলে আর WHERE সরালে UNION তিনটা Row দিয়ে নিজেই থামে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "কখন কোনটা",
          content: (
            <ContentParagraph>
              বেশিরভাগ সময় UNION ALL। এটা দ্রুত, কারণ প্রতিটা নতুন Row কে আগের সব Row এর সাথে মেলাতে হয় না, আর Tree এর
              মতো Data তে দুইবার একই Row আসেই না। UNION নিন তখন, যখন একই Row আবার আসা সম্ভব আর সেটা ফেলে দেওয়াই চান,
              যেমন একটা Graph এ কোন কোন জায়গায় পৌঁছানো যায় শুধু সেই তালিকা, পথ ছাড়া। কিন্তু Row এ depth বা path থাকলে
              UNION আপনাকে চক্র থেকে বাঁচাবে না, তার জন্য Section 011 আর 012।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "calendar",
      subHeader: { index: "007", title: "A Calendar" },
      title: <SectionTitle>ফারুক সাহেবের তিরিশটা ঘর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার প্রথম সমস্যায় ফেরা যাক। গোনার বদলে তারিখ: Anchor হলো 1 November, আর নিয়ম হলো প্রতিটা দিনের সাথে
                একটা দিন যোগ। PostgreSQL এ একটা date এর সাথে একটা পূর্ণ সংখ্যা যোগ করলে ততদিন পরের date আসে, Module 04 এ
                দেখেছেন। থামার শর্ত: আগের দিনটা 30 November এর আগে হলে তবেই পরের দিন।
              </ContentParagraph>
              <ContentParagraph>
                তিরিশটা দিনের তালিকা হাতে এলে বাকিটা Module 06 এর বিদ্যা: দিনগুলোকে বাঁ দিকে রেখে departures এর সাথে LEFT
                JOIN, যাতে যে দিনে কোনো Departure নেই সেই দিনটাও থাকে, তারপর দিন ধরে GROUP BY। count(*) না,
                count(dep.departure_id), কারণ খালি দিনেও LEFT JOIN একটা Row রাখে, আর সেটা count(*) এ 1 হিসেবে গোনা হতো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="November এর পুরো ক্যালেন্ডার"
              query={`WITH RECURSIVE days(d) AS (
  SELECT DATE '2026-11-01'
  UNION ALL
  SELECT d + 1 FROM days WHERE d < DATE '2026-11-30'
)
SELECT d, to_char(d, 'Dy') AS day, count(dep.departure_id) AS departures
FROM days
LEFT JOIN departures dep ON dep.starts_on = days.d
GROUP BY d
ORDER BY d;`}
              caption="তিরিশটা Row, 1 November রবিবার থেকে 30 November সোমবার পর্যন্ত। 14, 20, 21 আর 27 তারিখে 1 করে, বাকি ছাব্বিশ দিনে 0। প্রথম চেষ্টার চারটা Row এখন তিরিশটা ঘরের ভেতরে বসেছে। ফারুক সাহেব এখন সহজেই দেখবেন 1 থেকে 13 November পুরো খালি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL এ এই নির্দিষ্ট কাজের জন্য একটা তৈরি Function আছে, generate_series, যেটা Module 06 এর CROSS JOIN
              লেসনে দেখেছেন। একই তিরিশটা দিন এক লাইনে আসে, আর পড়তেও সহজ। তাহলে Recursive কেন শিখছেন? কারণ সব Database এ
              generate_series নেই, যেমন MySQL এ নেই, আর সেখানে ঠিক এই Recursive CTE টাই তারিখের তালিকা বানানোর আসল উপায়।
              আর তার চেয়েও বড় কারণ, পরের নিয়মটা যখন শুধু একটা দিন যোগ না, যেমন উপরের জায়গাটা খোঁজা, তখন কোনো তৈরি
              Function নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই তিরিশ দিন, generate_series দিয়ে"
              query={`SELECT count(*) AS days,
       min(d)::date AS first_day,
       max(d)::date AS last_day
FROM generate_series(DATE '2026-11-01', DATE '2026-11-30', interval '1 day') AS g(d);`}
              caption="একটা Row: 30, 2026-11-01, 2026-11-30। ফল একই, লেখা ছোট। PostgreSQL এ শুধু সংখ্যা বা তারিখের সারি দরকার হলে generate_series নিন। নিয়মটা জটিল হলে, বা MySQL এ কাজ করলে, Recursive CTE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2: এক সপ্তাহের ঘর"
              orderMatters
              task={
                <>
                  14 November 2026 থেকে 21 November 2026 পর্যন্ত প্রতিটা তারিখ, আর সেদিন কয়টা Departure রওনা হচ্ছে, না
                  থাকলে 0। দুটো Column, তারিখ আর গোনা, তারিখের ক্রমে। তারিখের তালিকাটা Recursive CTE দিয়ে বানান। ফল আটটা
                  Row।
                </>
              }
              hint={
                <>
                  উপরের ক্যালেন্ডারের Query টাই, শুধু শুরু আর শেষের তারিখ বদলে। LEFT JOIN আর count(dep.departure_id) রাখতে
                  ভুলবেন না, নইলে খালি দিনে 1 আসবে।
                </>
              }
              solution={`WITH RECURSIVE days(d) AS (
  SELECT DATE '2026-11-14'
  UNION ALL
  SELECT d + 1 FROM days WHERE d < DATE '2026-11-21'
)
SELECT days.d, count(dep.departure_id) AS departures
FROM days
LEFT JOIN departures dep ON dep.starts_on = days.d
GROUP BY days.d
ORDER BY days.d;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "tree-from-values",
      subHeader: { index: "008", title: "A Tree from VALUES" },
      title: <SectionTitle>দেশ থেকে জায়গা পর্যন্ত, এক Table এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Recursive CTE এর আসল জায়গা Hierarchy, মানে Tree এর মতো সাজানো Data। একটা কোম্পানির কর্মীরা, যেখানে প্রত্যেকের
                একজন Manager। একটা দোকানের Category, যেখানে প্রতিটা Category একটা বড় Category এর ভেতরে। একটা Comment এর
                উত্তর, তার উত্তর। Module 06 এর Self Join লেসনে দেখেছেন এমন Data সাধারণত একটা Table এ রাখা হয়, যেখানে প্রতিটা
                Row এর একটা Column তার উপরের Row এর id রাখে। এই Column টার সাধারণ নাম parent_id।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Sample Database এ এমন কোনো Table নেই। destinations Table এ শুধু region নামে একটা Column
                আছে, যেটা বিভাগের নাম, কিন্তু বিভাগ থেকে দেশ বা জেলা পর্যন্ত কোনো সারি নেই। তাই এই লেসনে Tree টা Query এর
                ভেতরেই বানানো হবে, VALUES দিয়ে, একটা সাধারণ CTE হিসেবে, যার নাম places। সতেরোটা ঘর: একটা দেশ, চারটা বিভাগ,
                পাঁচটা জেলা, আর সাতটা জায়গা। সাতটা জায়গার নাম হুবহু destinations Table এর সাতটা নাম, তাই পরে এই Tree থেকে
                সরাসরি Booking পর্যন্ত Join করা যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PlacesTreeDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপর থেকে নিচে হাঁটার Query এর দুই অংশ পরিষ্কার। Anchor: যে ঘরের parent_id NULL, মানে যার উপরে কেউ নেই,
                Bangladesh। Recursive Member: places থেকে সেই ঘরগুলো, যাদের parent_id Working Table এর কোনো ঘরের place_id
                এর সমান। অর্থাৎ Working Table এ যারা আছে, তাদের সন্তান। সাথে depth নামের একটা Column, Anchor এ 0, প্রতি ধাপে
                1 বেশি, যাতে প্রতিটা ঘর জানে সে দেশ থেকে কত ধাপ নিচে।
              </ContentParagraph>
              <ContentParagraph>
                একটা ছোট কথা: VALUES এর প্রথম Row এ <code className={CODE}>NULL::int</code> লেখা আছে, শুধু NULL না। কারণ
                শুধু NULL দেখে PostgreSQL বুঝতে পারে না Column টা কোন Type এর, আর বাকি Row এর সংখ্যাগুলো দেখে মেলানোর আগেই
                প্রথম Row থেকে একটা সিদ্ধান্ত নেয়। Type বলে দিলে কোনো দ্বিধা থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Tree, ধাপ অনুযায়ী"
              query={`WITH RECURSIVE ${PLACES},
tree AS (
  SELECT place_id, name, kind, 0 AS depth
  FROM places
  WHERE parent_id IS NULL
  UNION ALL
  SELECT p.place_id, p.name, p.kind, t.depth + 1
  FROM places p
  JOIN tree t ON p.parent_id = t.place_id
)
SELECT depth, kind, name
FROM tree
ORDER BY depth, name;`}
              caption="সতেরোটা Row। depth 0 তে Bangladesh, 1 এ চারটা বিভাগ, 2 তে পাঁচটা জেলা আর Sundarbans, 3 এ বাকি ছয়টা জায়গা। Sundarbans এর depth 2, বাকি জায়গাগুলোর 3, কারণ Tree তে সে সরাসরি Khulna Division এর নিচে। depth টা আপনি বানাননি, প্রতিটা ধাপে 1 যোগ করে Query নিজেই গুনেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Join এর দিকটাই ঠিক করে আপনি নিচে নামছেন না উপরে উঠছেন",
          content: (
            <ContentParagraph>
              <code className={CODE}>p.parent_id = t.place_id</code> মানে নতুন ঘরের মা হলো Working Table এর ঘর, অর্থাৎ
              আপনি নিচে নামছেন, সন্তান খুঁজছেন। উল্টো লিখলে, <code className={CODE}>p.place_id = t.parent_id</code>, নতুন
              ঘরটা Working Table এর ঘরের মা, অর্থাৎ আপনি উপরে উঠছেন। দুটো লাইনের পার্থক্য খুব ছোট, ফলের পার্থক্য পুরোপুরি।
              Section 010 এ উপরে ওঠা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3: একটা বিভাগের নিচে যা আছে"
              orderMatters
              task={
                <>
                  Chattogram Division এর নিচে যত ঘর আছে, বিভাগটা নিজে বাদে, প্রতিটার name আর বিভাগ থেকে কত ধাপ নিচে
                  (জেলা 1, জায়গা 2)। আগে depth তারপর name দিয়ে সাজান। places এর CTE টা নিচে দেওয়া আছে। ফল সাতটা Row।
                </>
              }
              hint={
                <>
                  Anchor এ Bangladesh না, <code className={CODE}>WHERE name = &apos;Chattogram Division&apos;</code>, depth
                  0। শেষের SELECT এ <code className={CODE}>WHERE depth {">"} 0</code> দিয়ে বিভাগটাকে বাদ দিন।
                </>
              }
              starter={`WITH RECURSIVE ${PLACES},
below AS (
  -- এখানে Anchor আর Recursive Member লিখুন
)
SELECT name, depth FROM below;`}
              solution={`WITH RECURSIVE ${PLACES},
below AS (
  SELECT place_id, name, 0 AS depth
  FROM places
  WHERE name = 'Chattogram Division'
  UNION ALL
  SELECT p.place_id, p.name, b.depth + 1
  FROM places p
  JOIN below b ON p.parent_id = b.place_id
)
SELECT name, depth
FROM below
WHERE depth > 0
ORDER BY depth, name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "paths-and-depth",
      subHeader: { index: "009", title: "Paths and Depth" },
      title: <SectionTitle>প্রতিটা Row তার নিজের ইতিহাস বয়ে নেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                depth যেমন প্রতিটা Row এর সাথে একটা গোনা বয়ে নেয়, তেমনি পুরো পথটাও বয়ে নেওয়া যায়। PostgreSQL এ সবচেয়ে
                সহজ উপায় একটা Array, মানে এক Column এ কয়েকটা মানের একটা সারি। Anchor এ <code className={CODE}>ARRAY[name]</code>,
                একটা নামের সারি। Recursive Member এ <code className={CODE}>t.path || p.name</code>, আগের সারির শেষে নতুন নাম।
                এভাবে Saint Martin&apos;s Island এর Row এ পৌঁছানোর সময় তার path হয় চারটা নামের সারি, দেশ থেকে তার নিজের নাম
                পর্যন্ত।
              </ContentParagraph>
              <ContentParagraph>
                এই path দিয়ে দুটো কাজ হয়। এক, <code className={CODE}>array_to_string(path, &apos; {">"} &apos;)</code>{" "}
                দিয়ে মাঝে চিহ্ন বসিয়ে মানুষের পড়ার মতো একটা ঠিকানার সারি, যাকে Website এ Breadcrumb বলে। দুই,{" "}
                <code className={CODE}>ORDER BY path</code>। দুটো Array তুলনা হয় প্রথম মান থেকে, তারপর দ্বিতীয়, এভাবে, তাই
                path দিয়ে সাজালে প্রতিটা ঘরের ঠিক নিচে তার সন্তানরা আসে, একটা বইয়ের সূচিপত্রের মতো। সাথে depth অনুযায়ী
                সামনে ফাঁকা জায়গা দিলে চোখে Tree টাই দেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সূচিপত্রের মতো Tree আর Breadcrumb"
              query={`WITH RECURSIVE ${PLACES},
tree AS (
  SELECT place_id, name, kind, 0 AS depth, ARRAY[name] AS path
  FROM places
  WHERE parent_id IS NULL
  UNION ALL
  SELECT p.place_id, p.name, p.kind, t.depth + 1, t.path || p.name
  FROM places p
  JOIN tree t ON p.parent_id = t.place_id
)
SELECT repeat('    ', depth) || name AS place,
       kind,
       array_to_string(path, ' > ') AS breadcrumb
FROM tree
ORDER BY path;`}
              caption="সতেরোটা Row, এবার সূচিপত্রের ক্রমে: Bangladesh, তার নিচে Barishal Division, তার নিচে Patuakhali District, তার নিচে Kuakata, তারপর Chattogram Division আর তার পুরো শাখা। Saint Martin's Island এর Breadcrumb: Bangladesh > Chattogram Division > Cox's Bazar District > Saint Martin's Island। repeat('    ', depth) প্রতিটা ধাপের জন্য চারটা ফাঁকা জায়গা বসায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL 14 থেকে এই সাজানোর জন্য একটা তৈরি Syntax আছে, SQL Standard এর SEARCH Clause। CTE এর Bracket
              বন্ধ হওয়ার পরে <code className={CODE}>SEARCH DEPTH FIRST BY name SET ord</code> লিখলে PostgreSQL নিজেই ord
              নামে একটা সাজানোর Column বানায়, ঠিক path এর মতো। DEPTH FIRST মানে একটা শাখার একদম নিচ পর্যন্ত, তারপর পরের
              শাখা, সূচিপত্রের মতো। BREADTH FIRST মানে আগে সব depth 0, তারপর সব depth 1, Lab এর বার অনুযায়ী।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SEARCH DEPTH FIRST: নিজের path না লিখে"
              query={`WITH RECURSIVE ${PLACES},
tree AS (
  SELECT place_id, name, 0 AS depth
  FROM places
  WHERE parent_id IS NULL
  UNION ALL
  SELECT p.place_id, p.name, t.depth + 1
  FROM places p
  JOIN tree t ON p.parent_id = t.place_id
) SEARCH DEPTH FIRST BY name SET ord
SELECT repeat('  ', depth) || name AS place
FROM tree
ORDER BY ord;`}
              caption="সতেরোটা Row, আগের বক্সের মতোই সূচিপত্রের ক্রম: Bangladesh, Barishal Division, Patuakhali District, Kuakata, তারপর Chattogram Division ... । DEPTH বদলে BREADTH লিখে আবার চালান: তখন আগে Bangladesh, তারপর চারটা বিভাগ, তারপর depth 2 এর ছয়টা ঘর, শেষে বাকি ছয়টা জায়গা। MySQL এ SEARCH Clause নেই, সেখানে নিজের path লিখতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4: ট্যুরের পাতার ঠিকানা"
              orderMatters
              task={
                <>
                  kind = &apos;place&apos; এমন প্রতিটা ঘরের name, আর তার Breadcrumb: দেশ থেকে নিজের নাম পর্যন্ত, মাঝে{" "}
                  <code className={CODE}>{" > "}</code> (দুই পাশে একটা করে ফাঁকা জায়গা)। name দিয়ে সাজান। ফল সাতটা Row।
                </>
              }
              hint={
                <>
                  Array ছাড়াও করা যায়: Anchor এ <code className={CODE}>name AS breadcrumb</code>, Recursive Member এ{" "}
                  <code className={CODE}>t.breadcrumb || &apos; {">"} &apos; || p.name</code>। শেষের SELECT এ WHERE kind =
                  &apos;place&apos;।
                </>
              }
              starter={`WITH RECURSIVE ${PLACES},
tree AS (
  -- এখানে লিখুন
)
SELECT name, breadcrumb FROM tree;`}
              solution={`WITH RECURSIVE ${PLACES},
tree AS (
  SELECT place_id, name, kind, name::text AS breadcrumb
  FROM places
  WHERE parent_id IS NULL
  UNION ALL
  SELECT p.place_id, p.name, p.kind, t.breadcrumb || ' > ' || p.name
  FROM places p
  JOIN tree t ON p.parent_id = t.place_id
)
SELECT name, breadcrumb
FROM tree
WHERE kind = 'place'
ORDER BY name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "walking-up",
      subHeader: { index: "010", title: "Walking Up" },
      title: <SectionTitle>একটা জায়গা থেকে দেশ পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন পর্যন্ত Anchor ছিল Tree এর মাথা, আর হাঁটা নিচের দিকে। প্রায়ই দরকার উল্টোটা: একটা নির্দিষ্ট ঘর থেকে
                শুরু করে তার উপরের সব ঘর, যাদের বলে Ancestor, মানে পূর্বপুরুষ। Website এ একটা ট্যুরের পাতা খুললে শুধু সেই
                জায়গার Breadcrumb দরকার, পুরো Tree না। একটা কর্মীর বেলায় তাঁর Manager, Manager এর Manager, CEO পর্যন্ত।
              </ContentParagraph>
              <ContentParagraph>
                দুটো জিনিস বদলায়। Anchor হয় সেই নির্দিষ্ট ঘর, যেমন{" "}
                <code className={CODE}>WHERE name = &apos;Sajek Valley&apos;</code>। আর Join এর দিক উল্টে যায়: নতুন ঘর
                সেটা, যার place_id Working Table এর ঘরের parent_id এর সমান, অর্থাৎ মা। এজন্য Working Table এ parent_id
                Column টা রাখতে হয়, নইলে পরের বারে মাকে খোঁজার কিছু থাকে না। থামা নিজে থেকেই হয়: Bangladesh এর parent_id
                NULL, আর NULL এর সাথে কোনো place_id মেলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sajek Valley থেকে উপরে"
              query={`WITH RECURSIVE ${PLACES},
up AS (
  SELECT place_id, name, parent_id, 0 AS level
  FROM places
  WHERE name = 'Sajek Valley'
  UNION ALL
  SELECT p.place_id, p.name, p.parent_id, u.level + 1
  FROM places p
  JOIN up u ON p.place_id = u.parent_id
)
SELECT level, name
FROM up
ORDER BY level;`}
              caption="চারটা Row: 0 Sajek Valley, 1 Rangamati District, 2 Chattogram Division, 3 Bangladesh। প্রতি বারে Working Table এ ঠিক একটা Row, কারণ প্রতিটা ঘরের মা একজনই। নিচে নামার সময় একটা ঘরের কয়েকজন সন্তান থাকতে পারে, উপরে ওঠার সময় সবসময় একজন। Sajek Valley বদলে Sundarbans লিখে চালান: তিনটা Row, কারণ তার উপরে কোনো জেলা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5: Saint Martin এর পূর্বপুরুষ"
              orderMatters
              task={
                <>
                  Saint Martin&apos;s Island এর উপরের সব ঘর, সবচেয়ে কাছেরটা আগে, নিজেকে বাদ দিয়ে। দুটো Column: name আর
                  level (মা 1, নানি 2, এভাবে)। ফল তিনটা Row।
                </>
              }
              hint={
                <>
                  Anchor এ নাম লিখতে হবে <code className={CODE}>&apos;Saint Martin&apos;&apos;s Island&apos;</code>,
                  ভেতরের Apostrophe দুইবার। Join: <code className={CODE}>p.place_id = u.parent_id</code>। শেষে WHERE level{" "}
                  {">"} 0 আর ORDER BY level।
                </>
              }
              starter={`WITH RECURSIVE ${PLACES},
up AS (
  -- এখানে লিখুন
)
SELECT name, level FROM up;`}
              solution={`WITH RECURSIVE ${PLACES},
up AS (
  SELECT place_id, name, parent_id, 0 AS level
  FROM places
  WHERE name = 'Saint Martin''s Island'
  UNION ALL
  SELECT p.place_id, p.name, p.parent_id, u.level + 1
  FROM places p
  JOIN up u ON p.place_id = u.parent_id
)
SELECT name, level
FROM up
WHERE level > 0
ORDER BY level;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "cycles",
      subHeader: { index: "011", title: "Cycles" },
      title: <SectionTitle>যে পথ ঘুরে আবার শুরুতে ফেরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Tree এর একটা সুবিধা: প্রতিটা ঘরের মা একজন, আর নিচে নামতে নামতে কখনো আগের কোনো ঘরে ফেরা যায় না। কিন্তু
                বাস্তবের অনেক Data এমন না। রাস্তার নকশায় Dhaka থেকে Chattogram যাওয়া যায়, Chattogram থেকে Dhaka ও। Social
                Network এ আমি আপনার বন্ধু, আপনিও আমার। এমন Data কে বলে Graph, আর Graph এ পথ ঘুরে আগের জায়গায় ফিরতে পারে।
                এই ফেরাকে বলে Cycle, মানে চক্র।
              </ContentParagraph>
              <ContentParagraph>
                Customer Care এর প্রশ্নটা ঠিক এমন Data নিয়ে: Dhaka থেকে কোন কোন জায়গায় পৌঁছানো যায়, কত বার গাড়ি বদলে।
                এই লেসনের জন্য একটা ছোট যাতায়াতের নকশা বানানো হয়েছে, routes নামে, VALUES দিয়ে: প্রতিটা Row একটা এক
                দিকের পথ, কোথা থেকে কোথায়। এটা শেখার জন্য সহজ করা নকশা, আসল সময়সূচি না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RouteGraphDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Tree এর Query টা হুবহু এখানে বসালে কী হয়? Anchor Dhaka, Recursive Member প্রতিটা জায়গা থেকে যেখানে যাওয়া
                যায়। বার ১ এ Chattogram, বার ২ তে Chattogram থেকে Dhaka আবার, বার ৩ এ সেই Dhaka থেকে আবার Chattogram।
                Working Table কখনো খালি হয় না, আর প্রতিবার Row বাড়তেই থাকে। Query টা থামে না। নিচের Lab এ “কোনো পাহারা
                নেই” বেছে নিয়ে শেষ পর্যন্ত চাপুন: আট বারে Row এর সংখ্যা 1, 4, 5, 7, 10, 15 করে বাড়তেই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম সমাধান হাতে লেখা পাহারা। প্রতিটা Row তার path বয়ে নেয়, ঠিক Section 009 এর মতো। Recursive Member এ
                একটা বাড়তি শর্ত: পরের জায়গাটা যেন এই Row এর path এ আগে থেকে না থাকে,{" "}
                <code className={CODE}>WHERE NOT r.to_place = ANY(t.path)</code>। ANY মানে Array এর যেকোনো একটা মান,
                Lesson 02 এ দেখেছেন। এভাবে কোনো পথ একই জায়গায় দুইবার যেতে পারে না, আর প্রতিটা পথ একসময় শেষ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CycleGuardLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Dhaka থেকে কোথায় কোথায়, Path পাহারা দিয়ে"
              query={`WITH RECURSIVE ${ROUTES},
trip AS (
  SELECT to_place AS place, 1 AS hops, ARRAY['Dhaka', to_place] AS path
  FROM routes
  WHERE from_place = 'Dhaka'
  UNION ALL
  SELECT r.to_place, t.hops + 1, t.path || r.to_place
  FROM trip t
  JOIN routes r ON r.from_place = t.place
  WHERE NOT r.to_place = ANY(t.path)
)
SELECT place, hops, array_to_string(path, ' > ') AS route
FROM trip
ORDER BY hops, place;`}
              caption="এগারোটা Row, প্রতিটা জায়গা একবার। এক বারে চারটা জায়গা: Chattogram, Khulna, Kuakata, Sylhet। Saint Martin's Island সবচেয়ে দূরে, চার বার: Dhaka > Chattogram > Cox's Bazar > Teknaf > Saint Martin's Island। Chattogram থেকে Dhaka ফেরার পথটা প্রতিবার আটকে গেছে, কারণ Dhaka আগেই path এ আছে। WHERE লাইনটা কখনো মুছে চালাবেন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6: সবচেয়ে কম বদল"
              orderMatters
              task={
                <>
                  Dhaka থেকে যেখানে যেখানে যাওয়া যায়, প্রতিটা জায়গা একবার, আর সেখানে পৌঁছাতে সবচেয়ে কম কয়বার গাড়ি লাগে।
                  দুটো Column: place আর hops। আগে hops, তারপর place দিয়ে সাজান। routes এর CTE নিচে দেওয়া আছে। ফল এগারোটা
                  Row।
                </>
              }
              hint={
                <>
                  উপরের বক্সের trip টাই। শেষের SELECT এ place দিয়ে GROUP BY আর <code className={CODE}>min(hops)</code>,
                  কারণ বড় নকশায় একই জায়গায় কয়েকটা পথে পৌঁছানো যায়। Path এর পাহারা রাখতে ভুলবেন না।
                </>
              }
              starter={`WITH RECURSIVE ${ROUTES},
trip AS (
  -- এখানে লিখুন, Path এর পাহারা সহ
)
SELECT place, hops FROM trip;`}
              solution={`WITH RECURSIVE ${ROUTES},
trip AS (
  SELECT to_place AS place, 1 AS hops, ARRAY['Dhaka', to_place] AS path
  FROM routes
  WHERE from_place = 'Dhaka'
  UNION ALL
  SELECT r.to_place, t.hops + 1, t.path || r.to_place
  FROM trip t
  JOIN routes r ON r.from_place = t.place
  WHERE NOT r.to_place = ANY(t.path)
)
SELECT place, min(hops) AS hops
FROM trip
GROUP BY place
ORDER BY hops, place;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "cycle-clause",
      subHeader: { index: "012", title: "The CYCLE Clause" },
      title: <SectionTitle>চক্র ধরার তৈরি Syntax</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজের path লেখা কাজ করে, কিন্তু প্রতিবার একই কয়েকটা লাইন লিখতে হয়। SQL Standard এ এর জন্য একটা তৈরি
                Syntax আছে, CYCLE Clause, আর PostgreSQL এটা এনেছে Version 14 এ, 2021 সালে, SEARCH Clause এর সাথে একই
                Release এ। CTE এর Bracket বন্ধ হওয়ার পরে লিখতে হয়:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>CYCLE place SET is_cycle USING path</code>। এর তিনটা অংশ। CYCLE এর পরে কোন Column
                দিয়ে চক্র চেনা হবে, এখানে place: একই place দ্বিতীয়বার এলে চক্র। SET এর পরে একটা নতুন Column এর নাম,
                যেটা PostgreSQL বানাবে আর চক্র হলে true রাখবে। USING এর পরে আরেকটা নতুন Column এর নাম, যেখানে PostgreSQL
                নিজেই path জমাবে। আপনাকে path বা ANY কিছুই লিখতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                একটা পার্থক্য আছে হাতে লেখা পাহারার সাথে। হাতে লেখা পাহারা চক্রের Row টাকে আসতেই দেয় না। CYCLE Clause
                Row টাকে একবার আসতে দেয়, is_cycle = true করে, তারপর আর সেখান থেকে এগোয় না। তাই ফলে কয়েকটা বাড়তি Row
                থাকে, যেগুলো দেখায় ঠিক কোথায় পথ ঘুরে আগের জায়গায় ফিরল। শুধু আসল জায়গাগুলো চাইলে বাইরে{" "}
                <code className={CODE}>WHERE NOT is_cycle</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CYCLE Clause: কোথায় পথ ফিরে এল"
              query={`WITH RECURSIVE ${ROUTES},
trip(place, hops) AS (
  SELECT 'Dhaka', 0
  UNION ALL
  SELECT r.to_place, t.hops + 1
  FROM trip t
  JOIN routes r ON r.from_place = t.place
) CYCLE place SET is_cycle USING path
SELECT place, hops, is_cycle
FROM trip
ORDER BY hops, place;`}
              caption="পনেরোটা Row, তার তিনটায় is_cycle = t: hops 2 তে Dhaka (Chattogram থেকে ফেরা), hops 3 এ Chattogram (Cox's Bazar থেকে ফেরা), hops 5 এ Teknaf (Saint Martin থেকে ফেরা)। বাকি বারোটা Row হলো Dhaka নিজে আর এগারোটা জায়গা, হাতে লেখা পাহারার মতোই। শেষে WHERE NOT is_cycle যোগ করে চালান: বারোটা Row।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "path Column টাও দেখা যায়",
          content: (
            <ContentParagraph>
              SELECT এ path লিখলে PostgreSQL এর বানানো পথটা দেখা যায়, যেমন{" "}
              <code className={CODE}>{"{(Dhaka),(Chattogram),(Dhaka)}"}</code>। প্রতিটা মান Bracket এর ভেতরে, কারণ CYCLE
              কয়েকটা Column দিয়েও চক্র চিনতে পারে, তাই প্রতিটা ধাপ একটা ছোট Row হিসেবে জমা হয়। নামের মধ্যে Apostrophe
              থাকলে, যেমন Cox&apos;s Bazar, সেই অংশটা উদ্ধৃতি চিহ্ন আর Backslash সহ দেখায়। পড়ার জন্য অস্বস্তিকর, তাই মানুষকে
              দেখানোর পথ চাইলে Section 011 এর মতো নিজের path রাখাই সুবিধার।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "types-and-mysql",
      subHeader: { index: "013", title: "Types and MySQL" },
      title: <SectionTitle>Anchor ঠিক করে Column এর Type, আর MySQL এর নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা নিয়ম দুই Database এই আছে, আর প্রথমবার দেখলে অদ্ভুত লাগে: Recursive CTE এর প্রতিটা Column এর Type
                ঠিক হয় Anchor থেকে। Recursive Member এর বানানো মান যদি সেই Type এ না ধরে, ঝামেলা। PostgreSQL এ এটা
                সাধারণত শুধু তখন দেখা যায়, যখন Anchor এ একটা মাপের সীমাসহ Type থাকে, যেমন varchar(3)। তখন PostgreSQL
                আগেই Error দেয়, আর HINT বলে Anchor এর ফলকে ঠিক Type এ Cast করতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Anchor এর Type পুরো Column এর Type"
              query={`WITH RECURSIVE t(n, label) AS (
  SELECT 1, 'x'
  UNION ALL
  SELECT n + 1, label || 'x' FROM t WHERE n < 4
)
SELECT n, label, pg_typeof(label) FROM t;

WITH RECURSIVE t(n, label) AS (
  SELECT 1, 'x'::varchar(3)
  UNION ALL
  SELECT n + 1, label || 'x' FROM t WHERE n < 4
)
SELECT n, label FROM t;`}
              caption={`প্রথম Query চারটা Row দেয়, label x, xx, xxx, xxxx, আর Type text, যার কোনো মাপের সীমা নেই। দ্বিতীয়টা Error এ থামে: recursive query "t" column 2 has type character varying(3) in non-recursive term but type character varying overall, আর HINT: Cast the output of the non-recursive term to the correct type। সমাধান: Anchor এ ::text, অথবা যথেষ্ট বড় একটা মাপ।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Recursive CTE আছে Version 8.0 থেকে, আর গড়ন হুবহু এক: WITH RECURSIVE, Anchor, UNION ALL বা UNION,
                Recursive Member। কিন্তু চারটা পার্থক্য সরাসরি কাজে লাগে, আর প্রতিটা একটা আসল MySQL 8.4 Server এ চালিয়ে
                দেখা হয়েছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>থামানোর একটা নিজস্ব সীমা আছে।</strong> cte_max_recursion_depth নামের Setting এর Default মান
                  1000। থামার শর্ত ভুলে গেলে MySQL চিরকাল চলে না, 1001 বার পরে বাতিল করে দেয়: ERROR 3636: Recursive query
                  aborted after 1001 iterations। বাইরে LIMIT দিলেও এই Error আসে, PostgreSQL এর কৌশলটা এখানে কাজ করে না।
                  সত্যিই হাজারের বেশি বার লাগলে <code className={CODE}>SET SESSION cte_max_recursion_depth = 2000</code>।
                </ListItem>
                <ListItem>
                  <strong>Type এর ফাঁদটা আরও সাধারণ।</strong> MySQL এর Docs বলে Column এর Type ঠিক হয় শুধু Anchor থেকে,
                  আর একটা লেখার মাপও। Anchor এ &apos;x&apos; লিখলে Column এর মাপ এক অক্ষর, আর Recursive Member এ লম্বা
                  লেখা এলে Strict Mode এ ERROR 1406: Data too long for column। তাই MySQL এ path বা Breadcrumb রাখলে Anchor এ{" "}
                  <code className={CODE}>CAST(name AS CHAR(500))</code> অবশ্যই।
                </ListItem>
                <ListItem>
                  <strong>Array নেই।</strong> path রাখতে হয় একটা লম্বা লেখায়, কমা দিয়ে জুড়ে, CONCAT দিয়ে। আর পরের জায়গা
                  আগে এসেছে কিনা দেখতে <code className={CODE}>FIND_IN_SET(r.to_place, t.path) = 0</code>। একই এগারোটা
                  জায়গা আসে।
                </ListItem>
                <ListItem>
                  <strong>CYCLE আর SEARCH Clause নেই।</strong> লিখলে ERROR 1064। হাতে লেখা পাহারাই একমাত্র উপায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                RECURSIVE ভুলে গেলে MySQL এর Error PostgreSQL এর চেয়ে কম সাহায্য করে: ERROR 1146: Table
                &apos;island_tours.t&apos; doesn&apos;t exist, কোনো HINT ছাড়া। আর VALUES দিয়ে Tree বানাতে MySQL এ প্রতিটা
                Row এর আগে ROW লিখতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "recursive-in-mysql.sql",
          code: `-- MySQL 8.4, island_tours (MySQL এর ফাইল Load করা)

-- ১. থামার শর্ত নেই: 1001 বার পরে MySQL নিজেই বাতিল করে
WITH RECURSIVE t(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM t)
SELECT n FROM t;
-- ERROR 3636 (HY000): Recursive query aborted after 1001 iterations.
-- Try increasing @@cte_max_recursion_depth to a larger value.

-- ২. Type আসে শুধু Anchor থেকে
WITH RECURSIVE t(n, label) AS (
  SELECT 1, 'x'
  UNION ALL
  SELECT n + 1, CONCAT(label, 'x') FROM t WHERE n < 4
)
SELECT * FROM t;
-- ERROR 1406 (22001): Data too long for column 'label' at row 1

WITH RECURSIVE t(n, label) AS (
  SELECT 1, CAST('x' AS CHAR(50))
  UNION ALL
  SELECT n + 1, CONCAT(label, 'x') FROM t WHERE n < 4
)
SELECT * FROM t;
-- 4 rows: x, xx, xxx, xxxx

-- ৩. Array ছাড়া চক্রের পাহারা: কমা দিয়ে জোড়া path আর FIND_IN_SET
WITH RECURSIVE routes(from_place, to_place) AS (
  VALUES ROW('Dhaka', 'Chattogram'), ROW('Chattogram', 'Dhaka'),
    ROW('Chattogram', 'Cox''s Bazar'), ROW('Cox''s Bazar', 'Chattogram'),
    ROW('Cox''s Bazar', 'Teknaf'),
    ROW('Teknaf', 'Saint Martin''s Island'), ROW('Saint Martin''s Island', 'Teknaf'),
    ROW('Chattogram', 'Bandarban'), ROW('Chattogram', 'Rangamati'),
    ROW('Rangamati', 'Sajek Valley'),
    ROW('Dhaka', 'Sylhet'), ROW('Dhaka', 'Khulna'), ROW('Khulna', 'Sundarbans'),
    ROW('Dhaka', 'Kuakata')
),
trip AS (
  SELECT to_place AS place, 1 AS hops,
         CAST(CONCAT('Dhaka,', to_place) AS CHAR(500)) AS path
  FROM routes WHERE from_place = 'Dhaka'
  UNION ALL
  SELECT r.to_place, t.hops + 1, CONCAT(t.path, ',', r.to_place)
  FROM trip t JOIN routes r ON r.from_place = t.place
  WHERE FIND_IN_SET(r.to_place, t.path) = 0
)
SELECT place, hops, path FROM trip ORDER BY hops, place;
-- 11 rows, the same places and hops as PostgreSQL

-- ৪. CYCLE Clause নেই
-- ... ) CYCLE n SET is_cycle USING path SELECT ...
-- ERROR 1064 (42000): You have an error in your SQL syntax ...`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>বিভাগ অনুযায়ী আয়, Tree বেয়ে উপরে তোলা</SectionTitle>,
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
                Island Tours এর মালিক জানতে চাইলেন কোন বিভাগ থেকে কত আয় আসছে। destinations এর region Column দিয়ে
                মোটামুটি একটা উত্তর হয়, কিন্তু মালিকের প্রশ্নটা আসলে Tree এর: একটা বিভাগের নিচে যত জেলা, তাদের নিচে যত
                জায়গা, সবার confirmed Booking যোগ করে বিভাগের ঘরে তোলা। এই কাজটাকে বলে Roll Up, নিচের সংখ্যা উপরের ঘরে
                জমা করা। আর পরে Tree তে নতুন জেলা বা জায়গা যোগ হলেও Query বদলাতে হবে না।
              </ContentParagraph>
              <ContentParagraph>
                কৌশলটা এরকম। Anchor হিসেবে প্রতিটা বিভাগ নিন, আর একটা Column এ বিভাগের নামটা রাখুন। Recursive Member নিচে
                নামবে, কিন্তু division Column টা প্রতিবার আগের Row থেকে হুবহু বয়ে নেবে। তাহলে Tree এর প্রতিটা ঘরের পাশে
                লেখা থাকে সে কোন বিভাগের। তারপর শুধু kind = place ঘরগুলো নাম দিয়ে destinations এর সাথে, সেখান থেকে tours,
                departures আর confirmed bookings, সব LEFT JOIN, যাতে যে বিভাগে কিছু বিক্রি হয়নি সেও থাকে। শেষে বিভাগ দিয়ে
                GROUP BY।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা বিভাগের confirmed আয়"
              query={`WITH RECURSIVE ${PLACES},
under AS (
  SELECT place_id, name AS division
  FROM places
  WHERE kind = 'division'
  UNION ALL
  SELECT p.place_id, u.division
  FROM places p
  JOIN under u ON p.parent_id = u.place_id
)
SELECT u.division,
       count(b.booking_id) AS confirmed_bookings,
       coalesce(sum(b.total_bdt), 0) AS revenue_bdt
FROM under u
JOIN places p ON p.place_id = u.place_id AND p.kind = 'place'
LEFT JOIN destinations ds ON ds.name = p.name
LEFT JOIN tours t ON t.destination_id = ds.destination_id
LEFT JOIN departures dep ON dep.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = dep.departure_id AND b.status = 'confirmed'
GROUP BY u.division
ORDER BY revenue_bdt DESC, u.division;`}
              caption="চারটা Row: Chattogram Division 12টা Booking, 307500.00; Khulna Division 3টা, 90000.00; Sylhet Division 2টা, 26100.00; Barishal Division 0, 0। যোগ করলে 17টা Booking আর 423600.00, Module 05 থেকে চেনা পুরো confirmed আয়। Barishal আছে LEFT JOIN এর কারণে: Kuakata তে কোনো ট্যুর নেই। confirmed এর শর্তটা ON এ বসেছে, WHERE এ না, Module 06 এর সেই শিক্ষা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Website এ এই একই কৌশল আরও দুই জায়গায় কাজে আসে। প্রতিটা ট্যুরের পাতার উপরে Breadcrumb, Section
              009 এর Query দিয়ে, শুধু সেই জায়গার জন্য Section 010 এর উপরে ওঠা। আর Operations এর জন্য ফারুক সাহেবের প্রতি
              মাসের ক্যালেন্ডার, Section 007 এর Query, শুধু মাসটা বদলে। আসল Production এ জায়গার Tree টা একটা সত্যিকারের Table
              এ থাকত, places নামে, parent_id সহ। Query একই থাকত, শুধু VALUES এর CTE টা থাকত না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge: বিভাগের আয়ের Report"
              orderMatters
              task={
                <>
                  প্রতিটা বিভাগের নাম, তার নিচের সব জায়গার confirmed Booking এর সংখ্যা, আর সেই Booking গুলোর total_bdt এর
                  যোগফল, কিছু না থাকলে 0। চারটা বিভাগই থাকবে। আয় বেশি থেকে কম, সমান হলে নাম দিয়ে সাজান। places এর CTE
                  নিচে দেওয়া আছে। উপরের বক্স না দেখে নিজে লেখার চেষ্টা করুন।
                </>
              }
              hint={
                <>
                  তিনটা ধাপ। এক, Anchor এ kind = &apos;division&apos;, আর division Column টা Recursive Member এ হুবহু বয়ে
                  নেওয়া। দুই, শুধু kind = &apos;place&apos; ঘর নিয়ে নাম দিয়ে destinations, তারপর tours, departures,
                  bookings, সব LEFT JOIN। তিন, status এর শর্ত শেষ LEFT JOIN এর ON এ, আর sum এর চারপাশে coalesce।
                </>
              }
              starter={`WITH RECURSIVE ${PLACES},
under AS (
  -- এখানে লিখুন
)
SELECT ...;`}
              solution={`WITH RECURSIVE ${PLACES},
under AS (
  SELECT place_id, name AS division
  FROM places
  WHERE kind = 'division'
  UNION ALL
  SELECT p.place_id, u.division
  FROM places p
  JOIN under u ON p.parent_id = u.place_id
)
SELECT u.division,
       count(b.booking_id) AS confirmed_bookings,
       coalesce(sum(b.total_bdt), 0) AS revenue_bdt
FROM under u
JOIN places p ON p.place_id = u.place_id AND p.kind = 'place'
LEFT JOIN destinations ds ON ds.name = p.name
LEFT JOIN tours t ON t.destination_id = ds.destination_id
LEFT JOIN departures dep ON dep.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = dep.departure_id AND b.status = 'confirmed'
GROUP BY u.division
ORDER BY revenue_bdt DESC, u.division;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Recursive CTE লেখার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা কি অজানা সংখ্যক ধাপের?",
              description:
                "জেলা কয় ধাপ নিচে, Manager এর Manager কতজন, কয়বার গাড়ি বদল। সংখ্যাটা আগে জানা থাকলে কয়েকটা Join ই যথেষ্ট। শুধু সংখ্যা বা তারিখের সারি হলে PostgreSQL এ generate_series।",
            },
            {
              title: "Anchor আলাদা করে লিখে চালান",
              description:
                "শুরুর Row গুলো কোনগুলো: Tree এর মাথা, একটা নির্দিষ্ট ঘর, Dhaka, 1 November। শুধু এই SELECT টা চালিয়ে দেখুন ঠিক সেই Row গুলো আসছে কিনা।",
            },
            {
              title: "একটা ধাপ থেকে পরের ধাপের নিয়ম লিখুন",
              description:
                "Recursive Member এ CTE এর নিজের নাম FROM বা JOIN এ। নিচে নামলে p.parent_id = t.place_id, উপরে উঠলে p.place_id = t.parent_id। দিকটা একবার জোরে পড়ে নিন।",
            },
            {
              title: "থামার শর্তটা কোথায়, নিশ্চিত হন",
              description:
                "Tree নিজে থেকেই থামে। সংখ্যা আর তারিখে WHERE লাগে, আর মনে রাখবেন সেটা পুরনো Row পরীক্ষা করে। Graph হলে path এর পাহারা বা CYCLE Clause ছাড়া কখনো না।",
            },
            {
              title: "সাথে যা বয়ে নিতে হবে, Column বানান",
              description:
                "depth এর জন্য 0 আর depth + 1, Breadcrumb এর জন্য path, Roll Up এর জন্য division এর মতো একটা Column যেটা হুবহু বয়ে চলে। MySQL এ লেখার Column এ Anchor এ CAST।",
            },
            {
              title: "UNION ALL দিয়ে শুরু করুন",
              description:
                "UNION নিন শুধু তখন, যখন একই Row দুইবার আসা সম্ভব আর সেটা ফেলাই চান। Row এ depth বা path থাকলে UNION কিছু ফেলবে না।",
            },
            {
              title: "চেনা একটা Row হাতে মিলিয়ে নিন",
              description:
                "Saint Martin এর depth 3 আর Sundarbans এর 2, Dhaka থেকে Saint Martin চার বারে, November এ তিরিশটা দিন। একটা কিনারার Row ও দেখুন: যার নিচে কেউ নেই, বা যেখানে কিছু বিক্রি হয়নি।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "WITH লেখা, RECURSIVE ভুলে যাওয়া",
              'PostgreSQL: relation "t" does not exist, HINT: Use WITH RECURSIVE। MySQL: ERROR 1146',
              "শুরুতে WITH RECURSIVE, পুরো WITH এর জন্য একবার",
            ],
            [
              "Recursive Member আগে, Anchor পরে",
              "recursive reference to query must not appear within its non-recursive term",
              "Anchor সবসময় প্রথম SELECT",
            ],
            [
              "সংখ্যা বা তারিখে থামার শর্ত নেই",
              "PostgreSQL এ Query থামে না; এই পাতার বক্স দশ সেকেন্ড পর থামিয়ে Database নতুন করে শুরু করে; MySQL এ ERROR 3636",
              "WHERE এ একটা সীমা, আর সন্দেহ থাকলে depth < 20 এর মতো পাহারা",
            ],
            [
              "শর্তটা নতুন মানের উপর ভাবা",
              "n < 100 দিয়েও 128 আসে, কারণ শর্ত পুরনো Row দেখে",
              "নতুন মানের উপর সীমা চাইলে WHERE n * 2 < 100",
            ],
            [
              "Graph এ পাহারা ছাড়া হাঁটা",
              "দুই দিকের পথে চিরকাল ঘোরা, Row বাড়তেই থাকে",
              "NOT r.to_place = ANY(t.path), অথবা CYCLE place SET is_cycle USING path",
            ],
            [
              "depth বা path রেখে ভাবা UNION চক্র থামাবে",
              "প্রতিটা Row আলাদা, তাই UNION কিছুই ফেলে না",
              "চক্রের জন্য path এর পাহারা, UNION না",
            ],
            [
              "Join এর দিক উল্টো",
              "উপরে উঠতে গিয়ে সন্তান খোঁজা হয়, Sajek Valley থেকে শুধু একটা Row আসে",
              "উপরে: p.place_id = u.parent_id; নিচে: p.parent_id = t.place_id",
            ],
            [
              "Anchor এ ছোট মাপের Type",
              "PostgreSQL এ varchar(3) এর Error; MySQL এ ERROR 1406 Data too long",
              "Anchor এ ::text, বা MySQL এ CAST(... AS CHAR(500))",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উল্টো দিকের Join"
              query={`WITH RECURSIVE ${PLACES},
up AS (
  SELECT place_id, name, parent_id, 0 AS level
  FROM places
  WHERE name = 'Sajek Valley'
  UNION ALL
  SELECT p.place_id, p.name, p.parent_id, u.level + 1
  FROM places p
  JOIN up u ON p.parent_id = u.place_id
)
SELECT level, name FROM up;`}
              caption="একটাই Row: 0 Sajek Valley। Join টা লেখা হয়েছে নিচে নামার মতো, p.parent_id = u.place_id, তাই Query খুঁজেছে Sajek Valley এর সন্তান, আর তার কোনো সন্তান নেই। কোনো Error নেই, শুধু ভুল উত্তর। Join টা p.place_id = u.parent_id করে আবার চালান: চারটা Row, Bangladesh পর্যন্ত।"
            />
          ),
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
                <strong>WITH Queries (Common Table Expressions)</strong>, PostgreSQL এর অফিসিয়াল Docs। Recursive Query
                কীভাবে চলে তার ধাপগুলো, Working Table এর ধারণা, UNION আর UNION ALL এর পার্থক্য, SEARCH আর CYCLE, আর
                LIMIT এর কৌশল নিয়ে Docs এর নিজের সতর্কতা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-with.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-with.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL 14 Release Notes</strong>, যেখানে SQL Standard এর SEARCH আর CYCLE Option আসার কথা
                লেখা আছে। কোন Version এ কোন Syntax চলে, Production এর আগে এভাবেই মিলিয়ে নিন।{" "}
                <a
                  href="https://www.postgresql.org/docs/release/14.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/release/14.0
                </a>
              </ListItem>
              <ListItem>
                <strong>Set Returning Functions</strong>, generate_series এর পুরো বিবরণ, তারিখ আর সংখ্যার সারি বানানোর
                সহজ পথ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-srf.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-srf.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4 WITH (Common Table Expressions)</strong>, MySQL এর Recursive CTE, cte_max_recursion_depth,
                max_execution_time, আর Anchor থেকে Column এর মাপ ঠিক হওয়ার উদাহরণ।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/with.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/with.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনি যে MySQL কোর্সটা দেখছেন</strong>, তার Subquery আর View এর অংশ, প্রায় 2:53:54 থেকে। এই মডিউলের
                প্রথম দিকের লেসনগুলোর সাথে মিলিয়ে দেখুন, তারপর এই লেসনটাকে তার পরের ধাপ ভাবুন।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  youtube.com/watch?v=hlGoQC332VM
                </a>
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
      title: <SectionTitle>এক নজরে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Recursive CTE হলো এমন একটা CTE যেটা নিজের নামটাই আবার পড়ে। তার Anchor একবার চলে আর শুরুর Row দেয়। তার
                Recursive Member বার বার চলে, প্রতিবার শুধু আগের বারের নতুন Row, মানে Working Table, পড়ে পরের Row বানায়।
                যে বারে নতুন কিছু আসে না, সেখানেই থামা। এই একটা ধারণা দিয়ে আপনি আজ চারটা আলাদা কাজ করেছেন: সংখ্যার সারি,
                একটা মাসের প্রতিটা দিন, একটা Tree তে নিচে নামা আর উপরে ওঠা, আর একটা Graph এ চক্র এড়িয়ে হাঁটা।
              </ContentParagraph>
              <ContentParagraph>
                মনে রাখার মতো ঝুঁকি একটাই: যে Query থামে না। থামার শর্ত পুরনো Row পরীক্ষা করে, Graph এ path এর পাহারা বা
                CYCLE Clause লাগে, আর UNION শুধু তখনই চক্র থামায় যখন Row গুলো হুবহু এক। MySQL এ একই গড়ন, কিন্তু 1000
                বারের সীমা, Anchor এ CAST, Array এর বদলে লেখা আর FIND_IN_SET, আর CYCLE Clause নেই।
              </ContentParagraph>
              <ContentParagraph>
                পরের লেসনে ফিরবেন সেই অংশে, যেটা আজ প্রতিটা Recursive CTE এর মাঝখানে বসে ছিল: UNION। শুধু Recursive এর
                ভেতরে না, যেকোনো দুটো Query এর ফল যোগ, মিল আর বিয়োগ করতে UNION, INTERSECT আর EXCEPT, আর তার সাথে Module 07
                এর পুরো সারাংশ।{" "}
                <Link href="/sql/topic/set-operations" className={LINK}>
                  পরের লেসন: UNION, INTERSECT and EXCEPT
                </Link>
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
      ["Recursive CTE", "নিজের নাম পড়া CTE, অজানা সংখ্যক ধাপের জন্য", "WITH RECURSIVE n(x) AS (...)"],
      ["Anchor", "প্রথম SELECT, শুরুর Row, একবার চলে", "SELECT 1, বা WHERE parent_id IS NULL"],
      ["Recursive Member", "দ্বিতীয় SELECT, আগের বারের Row থেকে পরের Row", "SELECT x + 1 FROM n"],
      ["Working Table", "শুধু ঠিক আগের বারের নতুন Row, খালি হলে থামা", "বার ১ এ শুধু চারটা বিভাগ"],
      ["থামার শর্ত", "WHERE পুরনো Row পরীক্ষা করে", "n < 100 দিয়েও 128 আসে"],
      ["UNION বনাম UNION ALL", "UNION হুবহু একই Row ফেলে, পুরো Row মিলিয়ে", "n % 3 + 1: UNION এ 3টা Row"],
      ["ক্যালেন্ডার", "তারিখের সাথে 1 যোগ, তারপর LEFT JOIN", "November: 30টা Row"],
      ["নিচে নামা", "p.parent_id = t.place_id", "Bangladesh থেকে 17টা ঘর"],
      ["উপরে ওঠা", "p.place_id = u.parent_id, parent_id বয়ে নেওয়া", "Sajek Valley থেকে 4টা Row"],
      ["path আর depth", "প্রতিটা Row নিজের ইতিহাস বয়ে নেয়", "ARRAY[name], t.path || p.name"],
      ["Cycle", "Graph এ আগের জায়গায় ফেরা, পাহারা ছাড়া অনন্ত", "NOT r.to_place = ANY(t.path)"],
      ["CYCLE, SEARCH", "PostgreSQL 14 থেকে, চক্র চেনা আর সাজানো", "CYCLE place SET is_cycle USING path"],
      ["MySQL", "8.0 থেকে, 1000 বারের সীমা, Anchor এ CAST, CYCLE নেই", "ERROR 3636, ERROR 1406"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা Recursive CTE এর Recursive Member প্রতিবার FROM এ নিজের নামটা পড়ে। ঠিক কী পড়ে?",
        options: [
          {
            key: "A",
            text: "এখন পর্যন্ত জমানো পুরো ফল",
            isCorrect: false,
            explanation: "তাহলে Bangladesh প্রতিবার আবার খোঁজা হতো আর একই Row বার বার আসত। পুরো ফল পড়ে শুধু শেষের SELECT।",
          },
          {
            key: "B",
            text: "শুধু ঠিক আগের বারে পাওয়া নতুন Row, যাকে Working Table বলে",
            isCorrect: true,
            explanation: "ঠিক। প্রতিবার Working Table বদলে যায়, আর সেটা খালি হলে Query থামে।",
          },
          {
            key: "C",
            text: "শুধু Anchor এর Row গুলো, প্রতিবার",
            isCorrect: false,
            explanation: "তাহলে Tree এক ধাপের বেশি নামতে পারত না। Anchor এর Row শুধু প্রথম Working Table।",
          },
          {
            key: "D",
            text: "Database এর আসল Table, যার নাম CTE এর নামের মতো",
            isCorrect: false,
            explanation: "CTE এর নামটা Query এর ভেতরের একটা অস্থায়ী নাম। একই নামের Table থাকলেও WITH এর ভেতরে CTE টাই আগে পাওয়া যায়।",
          },
        ],
      },
      {
        id: 2,
        text: "WITH RECURSIVE t(n) AS (SELECT 1 UNION ALL SELECT n * 2 FROM t WHERE n < 100) SELECT n FROM t; এর শেষ সংখ্যাটা কত?",
        options: [
          {
            key: "A",
            text: "64",
            isCorrect: false,
            explanation: "64 এর বেলায় শর্ত n < 100 সত্য, তাই সেখান থেকে আরেকটা Row তৈরি হয়।",
          },
          {
            key: "B",
            text: "99",
            isCorrect: false,
            explanation: "দ্বিগুণ করতে করতে 99 কখনো আসে না। সংখ্যাগুলো 1, 2, 4, 8 ...।",
          },
          {
            key: "C",
            text: "128",
            isCorrect: true,
            explanation: "ঠিক। WHERE পরীক্ষা করে পুরনো Row 64 কে, সত্য, তাই 128 তৈরি হয়। তারপর 128 < 100 মিথ্যা, থামা।",
          },
          {
            key: "D",
            text: "Query থামে না",
            isCorrect: false,
            explanation: "থামার শর্ত আছে, শুধু সেটা পুরনো Row এর উপর। 128 থেকে আর কিছু আসে না।",
          },
        ],
      },
      {
        id: 3,
        text: "WITH RECURSIVE ছাড়া শুধু WITH লিখে একটা CTE এর ভেতরে তার নিজের নাম পড়লে PostgreSQL কী বলে?",
        options: [
          {
            key: "A",
            text: "কোনো Error না, একবার চালিয়ে থেমে যায়",
            isCorrect: false,
            explanation: "সাধারণ CTE এর ভেতর থেকে তার নিজের নাম দেখা যায় না, তাই চালানোর আগেই আটকায়।",
          },
          {
            key: "B",
            text: 'relation "t" does not exist, সাথে HINT: Use WITH RECURSIVE',
            isCorrect: true,
            explanation: "ঠিক। DETAIL বলে t নামে WITH আছে কিন্তু এখান থেকে ছোঁয়া যায় না, আর HINT সমাধানটা বলে দেয়।",
          },
          {
            key: "C",
            text: "চিরকাল চলতে থাকে",
            isCorrect: false,
            explanation: "চলা শুরুই হয় না। নাম চেনার ধাপে আটকে যায়।",
          },
          {
            key: "D",
            text: "MySQL এর মতো ERROR 1146",
            isCorrect: false,
            explanation: "ERROR 1146 MySQL এর উত্তর। PostgreSQL এর Error আর HINT আরও বেশি সাহায্য করে।",
          },
        ],
      },
      {
        id: 4,
        text: "Recursive Member এ step + 1 আর n % 3 + 1 দুটো Column আছে, আর দুই অংশের মাঝে UNION। n এর মান বার বার 1, 2, 3 ঘুরলে UNION কি Query থামাবে?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, n আবার 1 হলেই Row টা ফেলে দেবে",
            isCorrect: false,
            explanation: "UNION পুরো Row মেলায়। step প্রতিবার আলাদা, তাই Row কখনো হুবহু এক হয় না।",
          },
          {
            key: "B",
            text: "না, কারণ step এর জন্য প্রতিটা Row আলাদা, তাই UNION কিছুই ফেলে না",
            isCorrect: true,
            explanation: "ঠিক। থামাতে হলে step এর উপর WHERE লাগে, বা step Column টা বাদ দিতে হয়।",
          },
          {
            key: "C",
            text: "হ্যাঁ, UNION সবসময় Recursive Query কে তিন বারে থামায়",
            isCorrect: false,
            explanation: "UNION এর এমন কোনো সীমা নেই। সে শুধু হুবহু একই Row ফেলে।",
          },
          {
            key: "D",
            text: "PostgreSQL Recursive CTE তে UNION চালাতে দেয় না",
            isCorrect: false,
            explanation: "দেয়, Docs এ UNION আর UNION ALL দুটোর নিয়মই আলাদা করে লেখা।",
          },
        ],
      },
      {
        id: 5,
        text: "places এর Tree তে একটা নির্দিষ্ট জায়গা থেকে দেশ পর্যন্ত উপরে উঠতে Recursive Member এর Join কোনটা?",
        options: [
          {
            key: "A",
            text: "JOIN up u ON p.parent_id = u.place_id",
            isCorrect: false,
            explanation: "এটা নিচে নামার Join, সন্তান খোঁজে। Sajek Valley থেকে শুরু করলে শুধু একটা Row আসে।",
          },
          {
            key: "B",
            text: "JOIN up u ON p.place_id = u.parent_id",
            isCorrect: true,
            explanation: "ঠিক। নতুন ঘরটা Working Table এর ঘরের মা। তাই Working Table এ parent_id Column টা রাখতে হয়।",
          },
          {
            key: "C",
            text: "JOIN up u ON p.place_id = u.place_id",
            isCorrect: false,
            explanation: "এতে প্রতিবার একই ঘর আবার আসে, এক ধাপও এগোনো হয় না, আর UNION ALL এ Query থামে না।",
          },
          {
            key: "D",
            text: "উপরে ওঠা Recursive CTE দিয়ে যায় না, Self Join লাগে",
            isCorrect: false,
            explanation: "Self Join এ প্রতিটা ধাপের জন্য একটা Join, ধাপ জানা থাকতে হয়। Recursive CTE যতগুলো ধাপ লাগে ততগুলোই হাঁটে।",
          },
        ],
      },
      {
        id: 6,
        text: "দুই দিকের পথ আছে এমন একটা Graph এ Dhaka থেকে হাঁটার Query তে কোনটা চক্র থেকে বাঁচায় না?",
        options: [
          {
            key: "A",
            text: "WHERE NOT r.to_place = ANY(t.path)",
            isCorrect: false,
            explanation: "এটা বাঁচায়: একই জায়গা কোনো পথে দুইবার আসতে পারে না।",
          },
          {
            key: "B",
            text: "CYCLE place SET is_cycle USING path",
            isCorrect: false,
            explanation: "এটাও বাঁচায়: চক্রের Row একবার আসে, is_cycle = true হয়, আর সেখান থেকে আর এগোয় না।",
          },
          {
            key: "C",
            text: "path Column রেখে UNION ALL এর বদলে UNION",
            isCorrect: true,
            explanation: "ঠিক, এটা বাঁচায় না। path প্রতিবার লম্বা হয়, তাই কোনো দুটো Row হুবহু এক না, আর UNION কিছুই ফেলে না।",
          },
          {
            key: "D",
            text: "depth < 20 এর মতো একটা সীমা",
            isCorrect: false,
            explanation: "এটা থামায়, যদিও চক্রের ভেতর বার বার ঘুরে অনেক বাড়তি Row বানানোর পরে। পাহারা হিসেবে চলে, উত্তর হিসেবে না।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ থামার শর্ত ছাড়া একটা Recursive CTE চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "চিরকাল চলে, PostgreSQL এর মতো",
            isCorrect: false,
            explanation: "MySQL এর নিজস্ব সীমা আছে, cte_max_recursion_depth, Default 1000।",
          },
          {
            key: "B",
            text: "1001 বার পরে ERROR 3636 দিয়ে বাতিল",
            isCorrect: true,
            explanation: "ঠিক: Recursive query aborted after 1001 iterations। বাইরে LIMIT দিলেও একই Error।",
          },
          {
            key: "C",
            text: "বাইরে LIMIT 5 দিলে পাঁচটা Row দিয়ে থামে",
            isCorrect: false,
            explanation: "এটা PostgreSQL এর কৌশল, MySQL 8.4 এ একই ERROR 3636 আসে।",
          },
          {
            key: "D",
            text: "MySQL এ Recursive CTE নেই",
            isCorrect: false,
            explanation: "MySQL 8.0 থেকে আছে, গড়ন PostgreSQL এর মতোই।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours এর মালিক প্রতিটা বিভাগের মোট confirmed আয় চান, Tree এর প্রতিটা স্তর বেয়ে। কোন কৌশল ঠিক?",
        options: [
          {
            key: "A",
            text: "Anchor এ প্রতিটা বিভাগ আর তার নাম, নিচে নামার সময় নামটা হুবহু বয়ে নেওয়া, তারপর জায়গা থেকে Booking পর্যন্ত LEFT JOIN আর GROUP BY",
            isCorrect: true,
            explanation: "ঠিক। চারটা Row আসে, Barishal 0 সহ, আর যোগফল 423600.00, পুরো confirmed আয়।",
          },
          {
            key: "B",
            text: "Anchor এ Bangladesh, তারপর depth = 1 দিয়ে GROUP BY",
            isCorrect: false,
            explanation: "depth = 1 এর Row শুধু বিভাগগুলো, তাদের নিচের জায়গার Booking তাদের সাথে জোড়া হয় না।",
          },
          {
            key: "C",
            text: "সব JOIN সাধারণ INNER JOIN, যাতে Query ছোট হয়",
            isCorrect: false,
            explanation: "তাহলে Barishal Division হারিয়ে যায়, কারণ Kuakata তে কোনো ট্যুর নেই।",
          },
          {
            key: "D",
            text: "UNION ALL এর বদলে UNION, যাতে একই Booking দুইবার না গোনা হয়",
            isCorrect: false,
            explanation: "Tree তে একই Row দুইবার আসেই না। দুইবার গোনার ঝুঁকি থাকে Join এ, আর এখানে প্রতিটা Booking ঠিক একটা জায়গার।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর তিনটা Recursive Sheet",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>December এর ক্যালেন্ডার:</strong> 1 থেকে 31 December 2026 এর প্রতিটা দিন, সপ্তাহের দিনের নাম, আর সেদিন
        কয়টা Departure রওনা হচ্ছে। psql এ চালিয়ে ফল কপি করুন, গুনে লিখুন মোট কয়টা Departure, আর কোন সপ্তাহটা পুরো খালি।
        তারপর একই Query generate_series দিয়ে লিখে দুটোর ফল মেলান।
      </span>,
      <span key="2">
        <strong>Tree বড় করুন:</strong> places এর CTE তে নিজে তিনটা নতুন ঘর যোগ করুন, যেমন Sylhet District এর নিচে Ratargul,
        Cox&apos;s Bazar District এর নিচে Teknaf, আর Teknaf এর নিচে একটা ঘাট। প্রতিটার place_id আর parent_id ঠিক করে দিন।
        তারপর Section 009 এর Query আবার চালান আর দেখান নতুন ঘরগুলো সূচিপত্রের ঠিক জায়গায় এসেছে, আর Query এর একটা লাইনও
        বদলাতে হয়নি।
      </span>,
      <span key="3">
        <strong>কাছের পথ:</strong> routes এর নকশায় দুটো নতুন পথ যোগ করুন: Sylhet থেকে Chattogram, আর Chattogram থেকে Sylhet।
        এবার Dhaka থেকে প্রতিটা জায়গায় সবচেয়ে কম বদলের সংখ্যা আবার বের করুন। কোনো জায়গার সংখ্যা কি বদলাল? কয়টা পথ এখন
        Sylhet হয়ে যায়, গুনে লিখুন, আর CYCLE Clause দিয়ে একবার চালিয়ে is_cycle এর Row কয়টা হলো লিখুন।
      </span>,
      <span key="4">
        <strong>দুই Database এ একই Report:</strong> Project Example এর বিভাগ অনুযায়ী আয়ের Query টা MySQL 8.4 এ চালান, MySQL এর
        Sample ফাইল Load করে। কোন কোন জায়গা বদলাতে হলো (VALUES এ ROW, Type, আর কিছু?) তালিকা করুন, আর দুই Database এর ফল
        মিলিয়ে দেখান।
      </span>,
      <span key="5">
        <strong>কাউকে শেখান:</strong> একজন বন্ধুকে কাগজে একটা ছোট বংশতালিকা এঁকে Recursive CTE বোঝান: Anchor, Recursive
        Member, Working Table আর থামা। তারপর তাঁকে Section 005 এর দ্বিগুণ করার Query টা দেখিয়ে জিজ্ঞেস করুন শেষ সংখ্যা কত হবে।
        তাঁর উত্তর, আর আপনি কীভাবে বুঝিয়েছেন শর্ত পুরনো Row দেখে, লিখে রাখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুটো ক্যালেন্ডার Query আর তাদের ফলের তুলনা</span>,
      <span key="d2">বড় করা places এর CTE আর নতুন সূচিপত্রের ফল</span>,
      <span key="d3">নতুন পথসহ সবচেয়ে কম বদলের তালিকা, আর is_cycle এর গোনা</span>,
      <span key="d4">MySQL এর Query, বদলের তালিকা আর দুই Database এর ফল</span>,
      <span key="d5">বন্ধুকে বোঝানোর পাতার ছবি আর তাঁর উত্তর</span>,
    ],
  },
  practicalLab: {
    title: "Recursive CTE এর Drill",
    subtitle: "নিজের island_tours এ psql দিয়ে, প্রতিটার প্রত্যাশিত ফলসহ",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, অথবা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। Module 02 এ Load করা Database টাই লাগবে। তারিখ একই রকম দেখতে প্রথমে SET TimeZone = 'Asia/Dhaka' চালান। কোনো Query থামছে না মনে হলে Ctrl+C।",
      },
      {
        title: "গোনা আর দ্বিগুণ",
        description:
          "প্রথম ফাইল চালান। দ্বিতীয় Query টা চালানোর আগে লিখে রাখুন শেষ সংখ্যা কত হবে, তারপর মিলিয়ে নিন। শেষে WHERE টা n * 2 < 100 করে আবার চালান।",
      },
      {
        title: "ক্যালেন্ডার",
        description:
          "দ্বিতীয় ফাইল চালান। তিরিশটা Row, তার চারটায় 1। তারপর count(dep.departure_id) এর জায়গায় count(*) লিখে চালান, আর দেখুন খালি দিনগুলো কেন 1 দেখায়।",
      },
      {
        title: "Tree এর নিচে আর উপরে",
        description:
          "তৃতীয় আর চতুর্থ ফাইল চালান। সূচিপত্রে Sundarbans এর জায়গা আর depth দেখুন। উপরে ওঠার Query তে Join এর দিক উল্টে একবার চালান, আর একটা Row কেন আসে লিখুন।",
      },
      {
        title: "Graph আর চক্র",
        description:
          "পঞ্চম ফাইল চালান। path এর পাহারা দিয়ে এগারোটা Row, CYCLE দিয়ে পনেরোটা, তার তিনটা is_cycle। পাহারা ছাড়া Query টা চালাতে চাইলে শুধু psql এ, আর Ctrl+C এর জন্য তৈরি থাকুন।",
      },
      {
        title: "বিভাগের Roll Up",
        description:
          "ষষ্ঠ ফাইল চালান। চারটা Row এর যোগফল 423600.00 কিনা মেলান। তারপর শেষ LEFT JOIN কে JOIN বানিয়ে চালান আর দেখুন কোন বিভাগ হারায়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-count-and-double.sql",
        code: `WITH RECURSIVE n(x) AS (
  SELECT 1
  UNION ALL
  SELECT x + 1 FROM n WHERE x < 5
)
SELECT x FROM n;                         -- 5 rows: 1, 2, 3, 4, 5

WITH RECURSIVE t(n) AS (
  SELECT 1
  UNION ALL
  SELECT n * 2 FROM t WHERE n < 100
)
SELECT n FROM t;                         -- 8 rows: 1 ... 128 (the last one is above 100)`,
      },
      {
        language: "sql",
        filename: "02-november-calendar.sql",
        code: `WITH RECURSIVE days(d) AS (
  SELECT DATE '2026-11-01'
  UNION ALL
  SELECT d + 1 FROM days WHERE d < DATE '2026-11-30'
)
SELECT d, to_char(d, 'Dy') AS day, count(dep.departure_id) AS departures
FROM days
LEFT JOIN departures dep ON dep.starts_on = days.d
GROUP BY d
ORDER BY d;                              -- 30 rows; 1 on 14, 20, 21 and 27 November, 0 on the rest`,
      },
      {
        language: "sql",
        filename: "03-tree-outline.sql",
        code: `WITH RECURSIVE ${PLACES},
tree AS (
  SELECT place_id, name, 0 AS depth, ARRAY[name] AS path
  FROM places WHERE parent_id IS NULL
  UNION ALL
  SELECT p.place_id, p.name, t.depth + 1, t.path || p.name
  FROM places p JOIN tree t ON p.parent_id = t.place_id
)
SELECT repeat('    ', depth) || name AS place, depth
FROM tree
ORDER BY path;                           -- 17 rows; Sundarbans at depth 2, the other places at 3`,
      },
      {
        language: "sql",
        filename: "04-walk-up.sql",
        code: `WITH RECURSIVE ${PLACES},
up AS (
  SELECT place_id, name, parent_id, 0 AS level
  FROM places WHERE name = 'Sajek Valley'
  UNION ALL
  SELECT p.place_id, p.name, p.parent_id, u.level + 1
  FROM places p JOIN up u ON p.place_id = u.parent_id
)
SELECT level, name FROM up ORDER BY level;  -- 4 rows: Sajek Valley, Rangamati District,
                                            --         Chattogram Division, Bangladesh`,
      },
      {
        language: "sql",
        filename: "05-routes-and-cycles.sql",
        code: `WITH RECURSIVE ${ROUTES},
trip AS (
  SELECT to_place AS place, 1 AS hops, ARRAY['Dhaka', to_place] AS path
  FROM routes WHERE from_place = 'Dhaka'
  UNION ALL
  SELECT r.to_place, t.hops + 1, t.path || r.to_place
  FROM trip t JOIN routes r ON r.from_place = t.place
  WHERE NOT r.to_place = ANY(t.path)
)
SELECT place, hops FROM trip ORDER BY hops, place;  -- 11 rows; Saint Martin's Island at 4 hops

WITH RECURSIVE ${ROUTES},
trip(place, hops) AS (
  SELECT 'Dhaka', 0
  UNION ALL
  SELECT r.to_place, t.hops + 1
  FROM trip t JOIN routes r ON r.from_place = t.place
) CYCLE place SET is_cycle USING path
SELECT place, hops, is_cycle FROM trip ORDER BY hops, place;
                                         -- 15 rows, 3 of them is_cycle = t`,
      },
      {
        language: "sql",
        filename: "06-division-rollup.sql",
        code: `WITH RECURSIVE ${PLACES},
under AS (
  SELECT place_id, name AS division FROM places WHERE kind = 'division'
  UNION ALL
  SELECT p.place_id, u.division FROM places p JOIN under u ON p.parent_id = u.place_id
)
SELECT u.division,
       count(b.booking_id) AS confirmed_bookings,
       coalesce(sum(b.total_bdt), 0) AS revenue_bdt
FROM under u
JOIN places p ON p.place_id = u.place_id AND p.kind = 'place'
LEFT JOIN destinations ds ON ds.name = p.name
LEFT JOIN tours t ON t.destination_id = ds.destination_id
LEFT JOIN departures dep ON dep.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = dep.departure_id AND b.status = 'confirmed'
GROUP BY u.division
ORDER BY revenue_bdt DESC, u.division;   -- 4 rows: Chattogram 12 | 307500.00, Khulna 3 | 90000.00,
                                         --         Sylhet 2 | 26100.00, Barishal 0 | 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ফাইলে places বা routes এর VALUES পুরোটা লেখা, যাতে প্রতিটা আলাদাভাবে চলে। নিজের কাজে এমন Tree বার বার লাগলে
        সেটাকে একটা সত্যিকারের Table বানানোই ঠিক: CREATE TABLE আর INSERT, যেটা Module 09 আর 10 এ শিখবেন। তখন WITH RECURSIVE
        এর পরে শুধু tree অংশটা থাকবে।
      </ContentParagraph>
    ),
  },
};
