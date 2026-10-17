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
  CoalesceChainLab,
  NightPriceLab,
  NullDialectLab,
} from "../../../components/course/topics/functions/nullfn-animations";
import {
  FallbackChainDiagram,
  FourToolsDiagram,
  GreatestNullSplit,
  NullifGuardSplit,
} from "../../../components/course/topics/functions/nullfn-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const nullFunctionsContent: TopicData = {
  id: "null-functions",
  introduction: {
    badge: "MODULE 04 · LESSON 05",
    title: <SectionTitle>ফাঁকা ঘর ভরানো, শূন্য সামলানো, সীমা টানা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 03 এ আপনি NULL কে চিনেছেন: যে মান জানা নেই। আপনি শিখেছেন NULL কে খুঁজতে হয়
          IS NULL দিয়ে, আর = NULL কখনো কাজ করে না। কিন্তু খুঁজে পাওয়া আর সামলানো এক কথা না।
          একটা Report এ ফাঁকা ঘর দেখলে পাঠক ভাবেন Data হারিয়ে গেছে, একটা হিসাবে NULL ঢুকলে
          পুরো যোগফলটাই অজানা হয়ে যায়, আর শূন্য দিয়ে ভাগ পড়লে পুরো Query টাই থেমে যায়।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে চারটা ছোট Function এর সাথে পরিচয় হবে, যেগুলো এই সমস্যাগুলোর রোজকার সমাধান।
          COALESCE ফাঁকা ঘরে একটা বিকল্প বসায়। NULLIF উল্টো কাজটা করে, একটা অর্থহীন মানকে NULL
          বানায়, আর এই কৌশলেই শূন্য দিয়ে ভাগের Error আটকানো যায়। GREATEST আর LEAST কয়েকটা
          মানের মধ্যে সবচেয়ে বড় বা ছোটটা বেছে নেয়, যা দিয়ে একটা হিসাবের নিচে বা উপরে সীমা
          টানা যায়।
        </ContentParagraph>
        <ContentParagraph>
          প্রতিটা Function আপনি Island Tours এর আসল কাজে দেখবেন: Support টিমের ফোনের তালিকা,
          Website এর ট্যুর কার্ড, রাতপ্রতি দামের হিসাব আর সহযোগী এজেন্সির জন্য রাখা সিট। সাথে
          থাকবে একটা জায়গা যেখানে PostgreSQL আর MySQL আলাদা উত্তর দেয়, আর কোন অভ্যাসটা দুই
          জায়গাতেই নিরাপদ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে কয়েকটা মান দিন, বাঁ দিক থেকে। প্রথম যেটা ফাঁকা না, সেটাই আমি ফেরত দিই, আর বাকিগুলোর দিকে তাকাইও না। শেষে একটা নিশ্চিত মান রেখে দিলে আমার উত্তর কখনো ফাঁকা হয় না।",
      author: "COALESCE",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবার সকালের চারটা ছোট বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, শীতের মৌসুমের প্রথম রবিবার। Island Tours এর Support
                টিমের দায়িত্বে আছেন নাবিলা। তিনি সকালে একটা তালিকা ছাপান, যাতে টিমের সবাই
                Customer দের ফোন করে নতুন মৌসুমের ট্যুরের খবর দিতে পারেন। তালিকার পাঁচটা লাইনে
                ফোনের ঘরটা পুরো ফাঁকা। নতুন একজন সহকর্মী জিজ্ঞেস করলেন, এই ঘরগুলো কি ছাপার
                সময় মুছে গেছে, নাকি নম্বর সত্যিই নেই?
              </ContentParagraph>
              <ContentParagraph>
                একই সকালে আরও তিনটা ছোট বিপদ। Website এর ট্যুর কার্ডে Ratargul Swamp Boat Day এর
                নিচে লেখা Guide:, তারপর কিছু নেই। Finance টিমের রাতপ্রতি দামের Report টা চালাতেই
                এসেছে ERROR: division by zero, একটাও লাইন আসেনি। আর একটা সহযোগী ভ্রমণ এজেন্সি
                প্রতিটা Departure এ দশটা সিট নিজেদের জন্য রেখে দেয়, সেই হিসাবে একটা তারিখে
                সাধারণের জন্য খালি সিট দেখাচ্ছে মাইনাস এক।
              </ContentParagraph>
              <ContentParagraph>
                চারটা বিপদের মূল একই রকম: কোনো একটা মান হয় ফাঁকা, নয়তো এমন যে তা দিয়ে হিসাব
                চলে না। আর প্রতিটার জন্য SQL এ একটা ছোট, নির্দিষ্ট Function আছে। নিচের বক্সে
                নাবিলার তালিকার প্রথম ছয়টা লাইন দেখুন। Run চাপলে Tanvir Ahmed আর Mitu Rahman এর
                ফোনের ঘরে লেখা আসবে NULL, যেটা psql বা ছাপা কাগজে আসলে একটা ফাঁকা ঘর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাবিলার তালিকা, যেমন আছে"
              query={`SELECT full_name, phone
FROM customers
ORDER BY customer_id
LIMIT 6;`}
              caption="ছয়টা Row এর মধ্যে দুটোতে phone NULL। এই বক্স NULL কে নাম ধরে দেখায়, কিন্তু psql, Excel বা ছাপা তালিকায় ঘরটা স্রেফ ফাঁকা থাকে। এই লেসনের শেষে আপনি ঠিক করে দিতে পারবেন সেই ফাঁকা ঘরে কী লেখা থাকবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের একটা প্রশ্ন",
          content: (
            <ContentParagraph>
              NULL কে মুছে ফেলা যায় না, বদলানোও উচিত না, কারণ Data তে সে সত্যি কথা বলছে: এই মানটা
              জানা নেই। কিন্তু যখন সেই Data মানুষের চোখে যায় বা হিসাবে ঢোকে, তখন ঠিক করতে হয় NULL
              এর জায়গায় কী দেখাবেন বা কী করবেন। এই লেসনের প্রতিটা Function সেই সিদ্ধান্তটা Query
              এর ভেতরেই নেওয়ার একটা উপায়। Table এর আসল Data একটুও বদলায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "four-tools",
      subHeader: { index: "002", title: "Four Tools" },
      title: <SectionTitle>চারটা ছোট যন্ত্র, চারটা কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের আগের লেসনগুলোতে আপনি Function দেখেছেন: কিছু একটা ভেতরে দেন, Function
                একটা উত্তর ফেরত দেয়, আর সেই উত্তর বসে যায় যেখানে একটা মান বসতে পারে। SELECT এর
                তালিকায়, WHERE এর শর্তে, ORDER BY তে। এই লেসনের চারটা Function ও ঠিক তাই, শুধু
                তাদের কাজ একটা বিশেষ ধরনের: ফাঁকা মান আর সমস্যার মান সামলানো।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Docs এ এরা থাকে Conditional Expressions নামের অংশে, CASE এর ঠিক পাশে।
                কারণ প্রতিটা আসলে একটা ছোট যদি আর তাহলে। COALESCE এর নিয়ম: প্রথমটা ফাঁকা হলে
                পরেরটা নেওয়া হবে। NULLIF এর নিয়ম: দুটো সমান হলে উত্তর NULL। GREATEST আর LEAST এর
                নিয়ম: এদের মধ্যে যেটা সবচেয়ে বড় বা ছোট, উত্তর সেটা। এগুলো CASE দিয়েও লেখা যায়, কিন্তু এক শব্দে লিখলে Query ছোট হয়
                আর পড়তে সহজ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FourToolsDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Function", "কী করে", "কখন হাতে নেবেন"],
          rows: [
            ["COALESCE(a, b, …)", "প্রথম যে মানটা NULL না সেটা দেয়", "ফাঁকা ঘরে বিকল্প লেখা বা মান বসাতে"],
            ["NULLIF(a, b)", "a আর b সমান হলে NULL, নইলে a", "অর্থহীন মান মুছতে, শূন্য দিয়ে ভাগ আটকাতে"],
            ["GREATEST(a, b, …)", "সবচেয়ে বড় মানটা দেয়", "হিসাবের নিচে একটা সীমা টানতে, যেমন শূন্যের নিচে না"],
            ["LEAST(a, b, …)", "সবচেয়ে ছোট মানটা দেয়", "হিসাবের উপরে একটা সীমা টানতে, যেমন ছাড়ের সর্বোচ্চ"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "coalesce",
      subHeader: { index: "003", title: "COALESCE" },
      title: <SectionTitle>ফাঁকা ঘরে একটা বিকল্প</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঘর থেকে বের হওয়ার সময় চাবি খোঁজার কথা ভাবুন। প্রথমে দেখেন পকেটে আছে কিনা। নেই?
                তাহলে টেবিলের উপর। সেখানেও নেই? তাহলে মায়ের কাছে রাখা বাড়তি চাবিটা। যেখানে প্রথম
                চাবিটা পাওয়া গেল, খোঁজা সেখানেই শেষ। COALESCE ঠিক এভাবে কাজ করে। তাকে কয়েকটা মান
                দেন, সে বাঁ দিক থেকে দেখে, আর প্রথম যে মানটা NULL না সেটাই ফেরত দেয়।
              </ContentParagraph>
              <ContentParagraph>
                শব্দটার মানে একত্র হওয়া বা মিশে যাওয়া। লেখা হয় এভাবে:{" "}
                <code className={CODE}>COALESCE(মান১, মান২, …)</code>। সবচেয়ে চেনা ব্যবহার দুটো
                Argument দিয়ে: একটা Column আর একটা বিকল্প।{" "}
                <code className={CODE}>COALESCE(phone, &apos;No phone&apos;)</code> মানে phone
                থাকলে phone, না থাকলে লেখা No phone। নাবিলার তালিকায় ঠিক এটাই দরকার ছিল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁকা ঘরে একটা কথা"
              query={`SELECT full_name,
       COALESCE(phone, 'No phone') AS phone
FROM customers
ORDER BY customer_id
LIMIT 6;`}
              caption="আগের বক্সের একই ছয়টা Row, শুধু phone এর জায়গায় COALESCE। Tanvir Ahmed আর Mitu Rahman এর ঘরে এবার No phone। Table এ কিন্তু তাঁদের phone এখনো NULL ই আছে, বদল ঘটেছে শুধু উত্তরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা জিনিস খেয়াল রাখবেন: Column এর নাম ঠিক রাখতে AS phone লিখেছি। না লিখলে PostgreSQL
              নিজে নাম দেয় coalesce, যেটা Report পড়া মানুষের কাছে অর্থহীন। Function দিয়ে বানানো
              প্রতিটা Column এ একটা বোঝার মতো নাম দেওয়া Module 03 এর সেই পুরনো অভ্যাস, এখানেও
              খাটে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "chain-of-fallbacks",
      subHeader: { index: "004", title: "A Chain of Fallbacks" },
      title: <SectionTitle>একটার পর একটা বিকল্প</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COALESCE দুটোর বেশি মানও নিতে পারে। নাবিলা আসলে চান প্রত্যেকের সাথে যোগাযোগের একটা
                উপায়: ফোন থাকলে ফোন, না থাকলে Email, আর দুটোই না থাকলে লেখা no contact। একটা
                COALESCE এ তিনটা মান দিলেই হয়ে যায়:{" "}
                <code className={CODE}>COALESCE(phone, email, &apos;no contact&apos;)</code>।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে তিনজনের জন্য খোঁজাটা দেখুন। Rahim এর phone আছে, তাই প্রথম ঘরেই উত্তর,
                Email এর দিকে তাকানোই হয় না। Tanvir এর phone NULL, তাই দ্বিতীয় ঘর, তাঁর Email।
                আর কল্পনার একজনের দুটোই ফাঁকা হলে শেষের লেখাটা। শেষে একটা নিশ্চিত মান রাখার
                সুবিধা এটাই: উত্তর কখনো ফাঁকা থাকে না। সব Argument NULL হলে COALESCE নিজেও NULL
                ফেরত দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FallbackChainDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফোন, না থাকলে Email"
              query={`SELECT full_name,
       COALESCE(phone, email, 'no contact') AS contact
FROM customers
ORDER BY customer_id;`}
              caption="১৫ জনের সবার পাশে এবার একটা যোগাযোগের উপায়। দশজনের ফোন, পাঁচজনের Email। Sample Data তে সবার Email আছে, কারণ email Column এ NOT NULL বসানো, তাই no contact আসলে কখনো আসে না। তবু রেখে দেওয়া ভালো, কারণ Query টা কালকের Data তেও চলবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CoalesceChainLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  নাবিলার পুরো তালিকাটা বানিয়ে দিন: সব Customer এর{" "}
                  <code className={CODE}>full_name</code> আর ফোন, যাঁদের ফোন নেই তাঁদের ঘরে লেখা{" "}
                  <code className={CODE}>No phone</code>। দুটো Column, এই ক্রমে। Row এর ক্রম যেকোনো
                  হতে পারে।
                </>
              }
              hint={
                <>
                  প্রথম বক্সের Query থেকে <code className={CODE}>ORDER BY</code> আর{" "}
                  <code className={CODE}>LIMIT</code> বাদ দিন। ফাঁকা ঘর ভরাতে{" "}
                  <code className={CODE}>COALESCE(phone, &apos;No phone&apos;)</code>।
                </>
              }
              solution={`SELECT full_name,
       COALESCE(phone, 'No phone') AS phone
FROM customers;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "one-type",
      subHeader: { index: "005", title: "One Type for All" },
      title: <SectionTitle>সব বিকল্প একই জাতের হতে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Website এর ট্যুর কার্ড। Ratargul এর guide_id ফাঁকা, তাই কার্ডে লিখতে চাই No
                guide yet। প্রথম চেষ্টাটা সবাই একই রকম করে:{" "}
                <code className={CODE}>COALESCE(guide_id, &apos;No guide yet&apos;)</code>। নিচের
                বক্সে চালিয়ে দেখুন কী হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা সংখ্যা আর একটা লেখা"
              query={`SELECT title,
       COALESCE(guide_id, 'No guide yet') AS guide
FROM tours;`}
              caption="ERROR: invalid input syntax for type integer: &quot;No guide yet&quot;। PostgreSQL ধরে নিয়েছে উত্তরটা integer হবে, কারণ guide_id integer, তারপর No guide yet লেখাটাকে সংখ্যায় বদলাতে গিয়ে আটকে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা হলো: একটা Column এর সব Row এর মান একই Type এর হয়। COALESCE এর উত্তর একটা
                Column হয়ে ফিরবে, তাই তার সব Argument কে একটা সাধারণ Type এ নামতে হয়। একটা
                integer আর একটা লেখাকে একই Type এ আনার কোনো স্বাভাবিক উপায় নেই। PostgreSQL এর Docs
                এর ভাষায়, Argument গুলোকে একটা সাধারণ Data Type এ বদলানো যেতে হবে, আর সেটাই হবে
                উত্তরের Type।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান আগের লেসনেই শিখেছেন: Cast। guide_id কে আগে লেখায় বদলে নিন,{" "}
                <code className={CODE}>guide_id::text</code>, তাহলে দুটো Argument ই লেখা, আর
                সমস্যা শেষ। উল্টো দিক থেকেও একই ভুল হয়:{" "}
                <code className={CODE}>COALESCE(phone, 0)</code> লিখলে PostgreSQL সরাসরি বলে
                COALESCE types text and integer cannot be matched।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Cast করে ঠিক করা"
              query={`SELECT title,
       COALESCE(guide_id::text, 'No guide yet') AS guide
FROM tours
WHERE tour_id IN (6, 7, 8)
ORDER BY tour_id;`}
              caption="তিনটা Row: Sylhet এর Guide 2, Ratargul এর No guide yet, Luxury Stay এর 4। এখানে 2 আর 4 আর সংখ্যা না, লেখা। এই Column দিয়ে আর যোগ বিয়োগ করা যাবে না, কিন্তু কার্ডে দেখানোর জন্য ঠিক এটাই দরকার।"
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
                  সব ট্যুরের <code className={CODE}>title</code> আর একটা{" "}
                  <code className={CODE}>guide</code> Column: Guide এর নম্বর লেখা হিসেবে, আর
                  Guide না থাকলে <code className={CODE}>No guide yet</code>। দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  integer আর লেখা একসাথে চলে না। <code className={CODE}>guide_id::text</code> করে
                  তারপর COALESCE।
                </>
              }
              solution={`SELECT title,
       COALESCE(guide_id::text, 'No guide yet') AS guide
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "only-what-it-needs",
      subHeader: { index: "006", title: "Only What It Needs" },
      title: <SectionTitle>যতটুকু দরকার, ততটুকুই দেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চাবির উদাহরণে একটা কথা ছিল: পকেটে চাবি পেলে টেবিলে আর খোঁজেন না। COALESCE ও তাই।
                PostgreSQL এর Docs স্পষ্ট বলে, COALESCE শুধু ততগুলো Argument হিসাব করে যতগুলো উত্তর
                ঠিক করতে লাগে। প্রথম অফাঁকা মানের ডানের Argument গুলো হিসাবই হয় না।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা মজার প্রমাণ আছে। নিচের বক্সে দ্বিতীয় Argument এ ইচ্ছা করে শূন্য দিয়ে ভাগ
                রাখা হয়েছে, যেটা একা চালালে নিশ্চিত Error। কিন্তু প্রথম Argument price_bdt ফাঁকা
                না, তাই দ্বিতীয়টা কখনো চলেই না, আর কোনো Error আসে না। একই বক্সের দ্বিতীয় Query তে
                দেখুন, COALESCE আসলে একটা CASE এর ছোট রূপ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয়টা চলেই না"
              query={`SELECT COALESCE(price_bdt, price_bdt / 0) AS safe
FROM tours
WHERE tour_id = 1;

SELECT title,
       COALESCE(guide_id::text, 'No guide yet') AS with_coalesce,
       CASE
         WHEN guide_id IS NOT NULL THEN guide_id::text
         ELSE 'No guide yet'
       END AS with_case
FROM tours
ORDER BY tour_id;`}
              caption="প্রথম Query দেয় 12500.00, কোনো Error ছাড়া। দ্বিতীয় Query তে নয়টা Row এর দুটো Column হুবহু এক। COALESCE(a, b) মানে CASE WHEN a IS NOT NULL THEN a ELSE b END, শুধু ছোট করে লেখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কখন COALESCE, কখন CASE",
          content: (
            <ContentParagraph>
              প্রশ্নটা যদি শুধু এটা হয় যে মানটা ফাঁকা কিনা, COALESCE ই সবচেয়ে পরিষ্কার। কিন্তু
              প্রশ্ন যদি হয় ফাঁকা হলে একটা কথা আর না হলে অন্য একটা কথা, যেমন phone থাকলে
              Channel এর নাম phone আর না থাকলে email, তখন CASE লাগে, কারণ COALESCE শুধু মানটাই ফেরত
              দিতে পারে, মানটা কোথা থেকে এল সেই খবর দিতে পারে না। এই লেসনের শেষের Challenge এ দুটো
              একসাথে লাগবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "null-in-math",
      subHeader: { index: "007", title: "NULL in Math" },
      title: <SectionTitle>হিসাবে NULL, আর শূন্য বসানোর দাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ দেখেছেন, যোগ বিয়োগ গুণ ভাগের যেকোনো একটা দিকে NULL থাকলে উত্তরও NULL।
                12500 এর সাথে অজানা কিছু যোগ করলে যোগফলও অজানা। COALESCE দিয়ে NULL এর জায়গায় শূন্য
                বসালে হিসাবটা চলে। নিচের বক্সে দুটো পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অজানা যোগ, আর শূন্য বসিয়ে যোগ"
              query={`SELECT 12500 + NULL AS plain,
       12500 + COALESCE(NULL, 0) AS safe;`}
              caption="plain হলো NULL, safe হলো 12500। কিন্তু এই কৌশল সবসময় ঠিক না, নিচের লেখাটা পড়ুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NULL কে শূন্য বানানো মানে অজানাকে শূন্য বলে ঘোষণা দেওয়া। কখনো সেটা সত্যি, কখনো ডাহা
                ভুল। একটা ছাড়ের Column এ NULL মানে যদি হয় কোনো ছাড় নেই, তাহলে শূন্য বসানো ঠিক, কারণ
                অর্থটা আসলেই শূন্য টাকা। কিন্তু Review এর rating এ NULL মানে যদি হয় এখনো রেটিং দেননি,
                তাহলে শূন্য বসালে গড় রেটিং অকারণে নেমে যাবে, যেন কেউ শূন্য তারা দিয়েছেন।
              </ContentParagraph>
              <ContentParagraph>
                তাই প্রতিবার COALESCE লেখার আগে নিজেকে একটা প্রশ্ন করুন: এই Column এ NULL আসলে কী
                বোঝায়, আর আমি যে বিকল্প বসাচ্ছি সেটা কি সেই অর্থটাই বলে? দেখানোর জন্য একটা লেখা
                বসানো সাধারণত নিরাপদ, যেমন No phone। কিন্তু হিসাবের ভেতরে একটা সংখ্যা বসানো একটা
                সিদ্ধান্ত, যেটা Report এর উত্তর বদলে দেয়।
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
                  Website এর Review অংশের জন্য সব Review এর <code className={CODE}>review_id</code>,{" "}
                  <code className={CODE}>rating</code> আর মন্তব্য, যেখানে মন্তব্য নেই সেখানে লেখা{" "}
                  <code className={CODE}>(no comment)</code>। তিনটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  মন্তব্যের Column এর নাম <code className={CODE}>comment</code>, আর দুটো Review এ
                  সেটা NULL। rating এ কিছু করার দরকার নেই, সেখানে কোনো NULL নেই।
                </>
              }
              solution={`SELECT review_id,
       rating,
       COALESCE(comment, '(no comment)') AS comment
FROM reviews;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "nullif",
      subHeader: { index: "008", title: "NULLIF" },
      title: <SectionTitle>উল্টো দিকের যন্ত্র: একটা মানকে NULL বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                COALESCE NULL কে একটা মান বানায়। NULLIF ঠিক উল্টোটা করে: একটা মানকে NULL বানায়।
                লেখা হয় <code className={CODE}>NULLIF(মান১, মান২)</code>। দুটো সমান হলে উত্তর NULL,
                সমান না হলে প্রথম মানটাই ফেরত আসে। একটা রাবারের মতো ভাবুন, যেটা শুধু একটা
                নির্দিষ্ট লেখা দেখলেই মুছে দেয়, আর বাকি সব যেমন আছে রেখে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্ন হলো, কেউ একটা ভালো মানকে NULL বানাতে চাইবে কেন? কারণ সব মান আসলে ভালো না।
                বাইরে থেকে আসা Data তে প্রায়ই অজানা বোঝাতে একটা নকল মান বসানো থাকে: একটা খালি লেখা,
                N/A, বা শূন্য। এদের হিসাবে ঢুকতে দিলে উত্তর ভুল হয়। NULLIF দিয়ে সেই নকল মানগুলোকে
                আসল NULL বানিয়ে নিলে বাকি সব নিয়ম, IS NULL আর COALESCE সহ, আবার ঠিকঠাক কাজ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULLIF এর চারটা ছোট পরীক্ষা"
              query={`SELECT NULLIF('', '') IS NULL AS a,
       NULLIF('Dhaka', '') AS b,
       NULLIF(5, 5) AS c,
       NULLIF(5, 6) AS d;`}
              caption="a হলো t, কারণ খালি লেখা খালি লেখার সমান, তাই উত্তর NULL। b হলো Dhaka, কারণ Dhaka খালি লেখার সমান না, তাই প্রথম মানটাই। c হলো NULL, d হলো 5।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বাস্তব ঘটনা কল্পনা করুন। একটা পুরনো CSV ফাইল থেকে Customer Import করার সময়
                Tanvir Ahmed এর ফোনের ঘরে NULL না এসে এসেছে একটা খালি লেখা। দেখতে দুটো একই রকম
                ফাঁকা, কিন্তু Database এর চোখে খালি লেখা একটা জানা মান। ফলে COALESCE(phone, &apos;No
                phone&apos;) তাঁর জন্য কাজই করে না, কারণ খালি লেখা তো NULL না। নিচের বক্স একটা
                Transaction এর ভেতরে এই ঘটনাটা সাজায়, তারপর ROLLBACK দিয়ে সব আগের মতো করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি লেখার ফাঁদ"
              query={`BEGIN;
UPDATE customers SET phone = '' WHERE customer_id = 3;

SELECT full_name,
       COALESCE(phone, 'No phone') AS shown,
       COALESCE(NULLIF(phone, ''), 'No phone') AS fixed
FROM customers
WHERE customer_id IN (1, 3, 6)
ORDER BY customer_id;

ROLLBACK;
SELECT phone IS NULL AS back_to_null FROM customers WHERE customer_id = 3;`}
              caption="shown Column এ Tanvir এর ঘর ফাঁকাই থেকে গেছে, কারণ খালি লেখা NULL না। fixed Column এ NULLIF আগে খালি লেখাকে NULL বানিয়েছে, তারপর COALESCE লিখেছে No phone। শেষে ROLLBACK এর পর তাঁর phone আবার আসল NULL, তাই এই বক্স পরের বক্সগুলোর Data বদলায় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শুধু ফাঁকা জায়গা থাকলে"
              query={`SELECT NULLIF('   ', '') IS NULL AS spaces_not_empty,
       NULLIF(trim('   '), '') IS NULL AS trimmed_is_null;`}
              caption="তিনটা ফাঁকা জায়গা খালি লেখা না, তাই প্রথমটা f। আগে trim দিয়ে ফাঁকা জায়গা ছেঁটে নিলে তারপর খালি লেখা হয়, আর NULLIF তাকে NULL বানায়। Import করা Data পরিষ্কারের সময় NULLIF(trim(x), &apos;&apos;) একটা খুব চেনা জোড়া।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Argument এর ক্রম গুরুত্বপূর্ণ",
          content: (
            <ContentParagraph>
              NULLIF(phone, &apos;&apos;) আর NULLIF(&apos;&apos;, phone) এক জিনিস না। প্রথমটা phone
              ফেরত দেয়, শুধু খালি হলে NULL। দ্বিতীয়টা হয় NULL, নয়তো একটা খালি লেখা, phone কখনো না।
              মনে রাখুন: প্রথম Argument টা হলো আসল মান, দ্বিতীয়টা হলো যে মানকে আপনি মুছতে চান।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "division-by-zero",
      subHeader: { index: "009", title: "Division by Zero" },
      title: <SectionTitle>একটা একদিনের ট্যুর যেভাবে পুরো Report থামিয়ে দিল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Finance টিমের সেই Report। তাঁরা জানতে চান প্রতিটা ট্যুরে প্রতি রাতের দাম কত
                পড়ে। তিন দিনের ট্যুরে রাত দুটো, তাই হিসাবটা দাম ভাগ duration_days মাইনাস এক। আটটা
                ট্যুরের জন্য এটা একদম ঠিক হিসাব। কিন্তু Ratargul Swamp Boat Day একদিনের ট্যুর, সেখানে
                রাত শূন্য, আর শূন্য দিয়ে ভাগ গণিতে অসংজ্ঞায়িত। PostgreSQL তখন কোনো উত্তর আন্দাজ করে
                না, সোজা Error দিয়ে পুরো Query থামিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Finance এর Report, প্রথম চেষ্টা"
              query={`SELECT title,
       round(price_bdt / (duration_days - 1), 2) AS per_night
FROM tours;`}
              caption="ERROR: division by zero। নয়টা ট্যুরের আটটার হিসাব ঠিক ছিল, তবু একটা Row ও ফেরত আসেনি। একটা Row এর সমস্যা পুরো উত্তরটা কেড়ে নেয়, এটাই এই Error এর সবচেয়ে বিরক্তিকর দিক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধানটা ছোট আর সুন্দর। ভাগের নিচের সংখ্যাটাকে NULLIF দিয়ে মুড়ে দিন:{" "}
                <code className={CODE}>NULLIF(duration_days - 1, 0)</code>। নিচের সংখ্যাটা শূন্য
                হলে সেটা হয়ে যায় NULL, আর কোনো কিছুকে NULL দিয়ে ভাগ করলে উত্তর NULL, কোনো Error না।
                বাকি আটটা ট্যুরের নিচের সংখ্যা শূন্য না, তাই NULLIF তাদের যেমন আছে রেখে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullifGuardSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULLIF দিয়ে পাহারা"
              query={`SELECT title,
       round(price_bdt / NULLIF(duration_days - 1, 0), 2) AS per_night
FROM tours
ORDER BY tour_id;`}
              caption="নয়টা Row ই এল। Ratargul এর per_night NULL, বাকিগুলোর আসল হিসাব, যেমন Saint Martin Island Escape 6250.00 আর Bandarban Hill Trek 4666.67।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন Report টা চলে, কিন্তু Ratargul এর ঘরটা ফাঁকা, আর নাবিলার তালিকার মতোই পাঠক ভাববেন
              কিছু হারিয়েছে কিনা। এখানে দুটো যন্ত্র একসাথে কাজে লাগে: NULLIF দিয়ে Error আটকানো,
              তারপর COALESCE দিয়ে ফাঁকা ঘরে একটা বোঝার মতো কথা বসানো। লেখা বসাতে হবে বলে আগে
              সংখ্যাটাকে ::text দিয়ে লেখা বানাতে হয়, ঠিক Guide এর উদাহরণের মতো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাহারা আর ব্যাখ্যা একসাথে"
              query={`SELECT title,
       COALESCE(
         round(price_bdt / NULLIF(duration_days - 1, 0), 2)::text,
         'day trip'
       ) AS per_night
FROM tours
ORDER BY tour_id;`}
              caption="Ratargul এর ঘরে এবার day trip। এই এক লাইনে তিনটা Function কাজ করছে, ভেতর থেকে বাইরে: NULLIF শূন্য আটকায়, round দুই দশমিকে আনে, COALESCE ফাঁকা ঘর ভরায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NightPriceLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  সব ট্যুরের <code className={CODE}>title</code> আর রাতপ্রতি দাম, দুই দশমিকে{" "}
                  <code className={CODE}>round(…, 2)</code> করা। একদিনের ট্যুরে উত্তরটা NULL ই থাকবে,
                  কোনো লেখা বা শূন্য বসাবেন না, আর Query তে যেন কোনো Error না আসে।
                </>
              }
              hint={
                <>
                  ভাগের নিচের অংশ <code className={CODE}>duration_days - 1</code>। সেটাকে{" "}
                  <code className={CODE}>NULLIF(…, 0)</code> দিয়ে মুড়ে দিন, তারপর পুরো ভাগটাকে
                  round দিয়ে।
                </>
              }
              solution={`SELECT title,
       round(price_bdt / NULLIF(duration_days - 1, 0), 2) AS per_night
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "greatest-least",
      subHeader: { index: "010", title: "GREATEST and LEAST" },
      title: <SectionTitle>হিসাবের নিচে মেঝে, উপরে ছাদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GREATEST কয়েকটা মানের মধ্যে সবচেয়ে বড়টা দেয়, LEAST দেয় সবচেয়ে ছোটটা। শুনতে
                সাধারণ, কিন্তু এদের আসল কাজ সীমা টানা। একটা ঘরের মেঝে আর ছাদের কথা ভাবুন। মেঝের নিচে
                কিছু নামতে পারে না, ছাদের উপরে কিছু উঠতে পারে না।{" "}
                <code className={CODE}>GREATEST(হিসাব, 0)</code> হলো মেঝে: হিসাবটা শূন্যের নিচে
                নামলেও উত্তর শূন্য।{" "}
                <code className={CODE}>LEAST(হিসাব, 15000)</code> হলো ছাদ: হিসাবটা যত বড়ই হোক,
                উত্তর পনেরো হাজারের বেশি না।
              </ContentParagraph>
              <ContentParagraph>
                এবার সকালের চতুর্থ বিপদ। সহযোগী এজেন্সি প্রতিটা Departure এ দশটা সিট নিজেদের জন্য রাখে।
                সাধারণ Customer দের জন্য খালি সিট তাই seats_left মাইনাস দশ। কিন্তু Departure 6 এ খালি
                সিট মাত্র নয়টা, সেখানে হিসাব দেয় মাইনাস এক, আর মাইনাস এক সিট Website এ দেখানোর কোনো
                মানে নেই। GREATEST দিয়ে একটা মেঝে বসালেই সমাধান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এজেন্সির দশটা সিট বাদ দিয়ে"
              query={`SELECT departure_id,
       starts_on,
       seats_left,
       GREATEST(seats_left - 10, 0) AS for_public
FROM departures
ORDER BY departure_id;`}
              caption="১৬টা Departure। তিনটার for_public শূন্য: Departure 6 (৯টা খালি, হিসাব হতো মাইনাস এক), Departure 13 আর 16 (দুটোতেই ঠিক দশটা)। কোনোটা আর মাইনাসে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার ছাদ। Marketing একটা ব্যানারে লিখতে চায় সব ট্যুর পনেরো হাজারের মধ্যে, তাই কার্ডে
              দাম দেখানো হবে সর্বোচ্চ পনেরো হাজার, আর বাকিটা শুরু হবে From দিয়ে। আরেকটা নিয়ম আসছে
              Finance থেকে: সব ট্যুরে দশ শতাংশ ছাড়, তবে ছাড় কখনো এক হাজার টাকার বেশি না। দ্বিতীয়
              নিয়মটা প্রথমবার পড়লে মাথা গুলিয়ে যায়, কিন্তু GREATEST এ এক লাইন: ছাড়ের পরের দাম হলো
              দাম গুণ শূন্য দশমিক নয় আর দাম মাইনাস এক হাজারের মধ্যে যেটা বড়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছাদ আর ছাড়ের নিয়ম"
              query={`SELECT title,
       price_bdt,
       LEAST(price_bdt, 15000.00) AS capped
FROM tours
ORDER BY tour_id;

SELECT title,
       price_bdt,
       round(GREATEST(price_bdt * 0.9, price_bdt - 1000), 2) AS sale_price
FROM tours
ORDER BY tour_id;`}
              caption="প্রথম Query তে তিনটা ট্যুরের দাম ছাদে আটকেছে: Sundarbans, Luxury Stay আর Family Package, সবার capped 15000.00। দ্বিতীয় Query তে কম দামের ট্যুরে পুরো দশ শতাংশ ছাড়, যেমন Sylhet 7800 থেকে 7020। বেশি দামেরগুলোতে ছাড় আটকে গেছে এক হাজারে, যেমন Luxury Stay 32000 থেকে 31000, দশ শতাংশ হলে হতো 28800।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "15000 না লিখে 15000.00 কেন",
          content: (
            <ContentParagraph>
              LEAST এর উত্তরের Type ঠিক হয় সব Argument মিলিয়ে, আর ছোট মানটা যেখান থেকে আসে সেটাই
              ছাপা হয়। শুধু 15000 লিখলে ছাদে আটকানো Row গুলোতে দশমিক ছাড়া 15000 আসে, বাকিগুলোতে
              12500.00 এর মতো দশমিক সহ। একই Column এ দুই রকম চেহারা দেখতে অগোছালো। 15000.00 লিখলে
              সব Row একই রকম দেখায়। হিসাবে কোনো পার্থক্য নেই, শুধু চেহারায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  প্রতিটা Departure এর <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>seats_left</code> আর সাধারণ Customer দের জন্য খালি সিট,
                  এজেন্সির দশটা বাদ দিয়ে, কখনো শূন্যের নিচে না। তিনটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  মেঝে বসায় GREATEST: <code className={CODE}>GREATEST(seats_left - 10, 0)</code>।
                </>
              }
              solution={`SELECT departure_id,
       seats_left,
       GREATEST(seats_left - 10, 0) AS for_public
FROM departures;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "null-inside-greatest",
      subHeader: { index: "011", title: "NULL Inside GREATEST" },
      title: <SectionTitle>তালিকায় একটা NULL থাকলে কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NULL এর সাধারণ নিয়ম আপনি জানেন: অজানা কিছু থাকলে উত্তরও অজানা। তাহলে 5, অজানা আর 9
                এর মধ্যে সবচেয়ে বড় কোনটা? যুক্তি বলে উত্তর অজানা, কারণ অজানা মানটা হয়তো 100। SQL
                Standard ঠিক এটাই বলে। কিন্তু PostgreSQL এখানে ইচ্ছা করে Standard থেকে সরে এসেছে:
                সে তালিকার NULL গুলো বাদ দিয়ে বাকিগুলোর মধ্যে হিসাব করে, আর NULL দেয় শুধু তখন যখন
                সবগুলোই NULL। PostgreSQL এর Docs নিজেই এটাকে Standard থেকে বিচ্যুতি বলে উল্লেখ করে,
                আর জানায় কিছু অন্য Database Standard মেনে চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL বাদ দিয়ে হিসাব"
              query={`SELECT GREATEST(5, NULL, 9) AS g,
       LEAST(5, NULL, 9) AS l,
       GREATEST(NULL::int, NULL) AS all_null;`}
              caption="PostgreSQL এ g হলো 9, l হলো 5, আর all_null হলো NULL, কারণ সেখানে NULL ছাড়া কিছুই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GreatestNullSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এর ব্যবহারিক মানে: PostgreSQL এ GREATEST একটা NULL পেলে চুপচাপ বাকিগুলো থেকে উত্তর দেয়,
              সেটা অনেক সময় সুবিধার। কিন্তু একই Query MySQL এ চালালে উত্তর NULL হয়ে যাবে। দুই জায়গাতেই
              একই উত্তর চাইলে যে Column এ NULL থাকতে পারে সেটাকে আগে COALESCE দিয়ে একটা নিশ্চিত মানে
              আনুন, তারপর GREATEST বা LEAST এ দিন। আর মনে রাখুন, PostgreSQL এ NULL বাদ দেওয়াটা কখনো
              কখনো একটা লুকানো ভুলও ঢেকে দেয়, তাই এমন হিসাবের পরে একবার IS NULL দিয়ে Data টা দেখে
              নেওয়া ভালো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "in-mysql",
      subHeader: { index: "012", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই যন্ত্র, কয়েকটা আলাদা অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ভালো খবর: COALESCE আর NULLIF MySQL এ হুবহু একই নামে, একই কাজে চলে। GREATEST আর
                LEAST ও আছে, শুধু NULL এর আচরণ আলাদা, যেটা আগের Section এ দেখেছেন। এর বাইরে MySQL এর
                নিজের দুটো Function আছে যা MySQL দিয়ে শেখানো কোর্সে খুব দেখা যায়: IFNULL(a, b), যেটা
                দুই Argument এর COALESCE, আর ISNULL(x), যেটা আসলে একটা প্রশ্ন, উত্তর 1 বা 0।
              </ContentParagraph>
              <ContentParagraph>
                আরও দুটো পার্থক্য এই লেসনের বিষয়ের সাথে জড়ানো। MySQL এ SELECT এর ভেতর শূন্য দিয়ে ভাগ
                করলে Error আসে না, উত্তর আসে NULL, সাথে একটা Warning। আর COALESCE এ সংখ্যা আর লেখা
                মেশালে MySQL নিজে থেকে লেখায় বদলে নেয়, PostgreSQL এর মতো Error দেয় না। নিচের Lab এ
                ছয়টা উদাহরণ দুই Database এ আসলে চালিয়ে তোলা উত্তর পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullDialectLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুই জায়গাতেই চলে এমন অভ্যাস",
          content: (
            <ContentParagraph>
              IFNULL এর বদলে COALESCE লিখুন, ISNULL() এর বদলে IS NULL। দুটোই PostgreSQL আর MySQL দুই
              জায়গাতেই চলে, আর SQL Standard এর অংশ। আর শূন্য দিয়ে ভাগের সম্ভাবনা থাকলে NULLIF সবসময়
              লিখুন, MySQL এ SELECT চুপচাপ NULL দিলেও, কারণ Strict Mode এ UPDATE বা INSERT এর ভেতর
              একই ভাগ ERROR 1365 Division by 0 দেয়। PostgreSQL এর Docs আরও জানায়, অন্য কিছু Database এ
              COALESCE এর মতো কাজের নাম NVL বা IFNULL। নাম আলাদা হলেও ধারণা একই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "practice",
      subHeader: { index: "013", title: "Practice" },
      title: <SectionTitle>নিজের হাতে দুটো শেষ কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম কাজে NULLIF কে একটু অন্যভাবে লাগাবেন: অজানা না, বরং অপ্রয়োজনীয় তথ্য মুছতে।
              Island Tours এর ভাউচারে দেশের নাম লেখা হয় শুধু বিদেশি অতিথিদের জন্য। দেশের ভেতরের
              Customer দের ভাউচারে দেশের নাম লেখার দরকার নেই। দ্বিতীয় কাজটা Challenge, যেখানে COALESCE
              আর CASE দুটোই লাগবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  সব Customer এর <code className={CODE}>full_name</code> আর একটা{" "}
                  <code className={CODE}>abroad</code> Column: দেশের নাম, কিন্তু দেশ Bangladesh হলে
                  NULL। দুটো Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  একটা নির্দিষ্ট মানকে NULL বানানোর যন্ত্র NULLIF:{" "}
                  <code className={CODE}>NULLIF(country, &apos;Bangladesh&apos;)</code>।
                </>
              }
              solution={`SELECT full_name,
       NULLIF(country, 'Bangladesh') AS abroad
FROM customers;`}
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
                  Support টিমের নতুন তালিকা: সব Customer এর <code className={CODE}>full_name</code>,
                  একটা <code className={CODE}>contact</code> (ফোন থাকলে ফোন, না থাকলে Email), আর
                  একটা <code className={CODE}>channel</code> Column যেখানে লেখা{" "}
                  <code className={CODE}>phone</code> অথবা <code className={CODE}>email</code>, যেটা
                  দিয়ে যোগাযোগ হবে। নামের বর্ণানুক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  contact এর জন্য <code className={CODE}>COALESCE(phone, email)</code>। কিন্তু
                  COALESCE বলতে পারে না মানটা কোথা থেকে এল, তাই channel এর জন্য একটা CASE:{" "}
                  <code className={CODE}>
                    CASE WHEN phone IS NOT NULL THEN &apos;phone&apos; ELSE &apos;email&apos; END
                  </code>
                  । শেষে <code className={CODE}>ORDER BY full_name</code>।
                </>
              }
              solution={`SELECT full_name,
       COALESCE(phone, email) AS contact,
       CASE WHEN phone IS NOT NULL THEN 'phone' ELSE 'email' END AS channel
FROM customers
ORDER BY full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর ট্যুর কার্ড, এক Query তে</SectionTitle>,
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
                Island Tours এর Website এর প্রথম পাতায় প্রতিটা চালু ট্যুরের একটা কার্ড থাকে। কার্ডে
                থাকে ট্যুরের নাম, Guide এর তথ্য, রাতপ্রতি দাম আর দেখানোর দাম, যেটা ব্যানারের কথা মতো
                পনেরো হাজারে আটকানো। এই লেসনের প্রায় প্রতিটা যন্ত্র এই একটা Query তে কাজ করছে: Guide
                এর জন্য COALESCE, রাতপ্রতি দামের জন্য NULLIF আর COALESCE, দামের ছাদের জন্য LEAST।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম পাতার কার্ডগুলো"
              query={`SELECT title,
       COALESCE(guide_id::text, 'No guide yet') AS guide,
       COALESCE(
         round(price_bdt / NULLIF(duration_days - 1, 0), 2)::text,
         'day trip'
       ) AS per_night,
       LEAST(price_bdt, 15000.00) AS shown_price
FROM tours
WHERE is_active
ORDER BY price_bdt;`}
              caption="আটটা চালু ট্যুর, সস্তাটা আগে। প্রথম Row টাই Ratargul: No guide yet আর day trip। শেষের দুটো, Family Package আর Sundarbans, দুটোরই shown_price 15000.00, কারণ আসল দাম ছাদের উপরে। কোনো ঘর ফাঁকা নেই, কোনো Error নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Support এর ফোনের তালিকা:</strong> প্রতি মৌসুমের শুরুতে{" "}
                  <code className={CODE}>COALESCE(phone, email)</code> দিয়ে প্রত্যেকের একটা যোগাযোগের
                  উপায়, আর CASE দিয়ে কোন পথে যোগাযোগ।
                </ListItem>
                <ListItem>
                  <strong>Partner এর সিট:</strong> Booking পাতায় খালি সিটের সংখ্যা{" "}
                  <code className={CODE}>GREATEST(seats_left - 10, 0)</code>, যাতে কখনো মাইনাস না
                  দেখায়।
                </ListItem>
                <ListItem>
                  <strong>পুরনো Data Import:</strong> CSV থেকে আসা খালি লেখা আর শুধু ফাঁকা জায়গাকে{" "}
                  <code className={CODE}>NULLIF(trim(phone), &apos;&apos;)</code> দিয়ে আসল NULL বানিয়ে
                  তারপর Table এ রাখা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের my-tours Project এ এখন একটা কাজ: যেকোনো একটা পাতার জন্য একটা Query লিখুন
                যেটা কোনো ঘর ফাঁকা রাখে না আর কোনো অবস্থায় Error দেয় না। প্রতিটা COALESCE এর পাশে
                এক লাইনে লিখে রাখুন বিকল্পটা কেন সেই অর্থ বহন করে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলের অন্য লেসনগুলোও এখানে কাজে লাগছে: ::text এর Cast এসেছে{" "}
                <Link href="/sql/topic/type-casting" className={LINK}>
                  Casting Between Types
                </Link>{" "}
                থেকে, আর round এসেছে{" "}
                <Link href="/sql/topic/numeric-functions" className={LINK}>
                  Numbers and the Integer Division Trap
                </Link>{" "}
                থেকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Ratargul এর একটা ঘর, ভেতর থেকে বাইরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query এর একটা লাইন:{" "}
              <code className={CODE}>
                COALESCE(round(price_bdt / NULLIF(duration_days - 1, 0), 2)::text, &apos;day trip&apos;)
              </code>
              । Ratargul Swamp Boat Day এর Row এ (price_bdt 3500.00, duration_days 1) PostgreSQL এটা
              কীভাবে হিসাব করে, ধাপে ধাপে দেখুন। নিয়মটা গণিতের বন্ধনীর মতো: সবচেয়ে ভেতরেরটা আগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "duration_days - 1",
              description: "Row থেকে duration_days পড়া হলো 1, তা থেকে এক বাদ দিয়ে 0।",
            },
            {
              title: "NULLIF(0, 0)",
              description: "দুটো Argument সমান, তাই উত্তর NULL। শূন্যটা আর ভাগের নিচে পৌঁছায় না।",
            },
            {
              title: "3500.00 / NULL",
              description: "NULL দিয়ে ভাগ, উত্তর NULL। কোনো Error নেই, কারণ শূন্য দিয়ে ভাগ আর হচ্ছে না।",
            },
            {
              title: "round(NULL, 2)",
              description: "অজানা মানকে গোল করলেও অজানা, উত্তর NULL।",
            },
            {
              title: "NULL::text",
              description: "NULL কে লেখায় বদলালে NULL ই থাকে, শুধু তার Type এখন text।",
            },
            {
              title: "COALESCE(NULL, 'day trip')",
              description: "প্রথম Argument NULL, তাই দ্বিতীয়টা দেখা হলো। উত্তর day trip। এটাই কার্ডে বসে।",
            },
            {
              title: "বাকি আট Row",
              description:
                "যেমন Saint Martin Island Escape: 3 - 1 = 2, NULLIF(2, 0) = 2, 12500.00 / 2 = 6250, round করে 6250.00, লেখায় 6250.00, COALESCE প্রথম Argument এই উত্তর পেয়ে দ্বিতীয়টা দেখেই না।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "COALESCE(guide_id, 'No guide yet')",
              "ERROR: invalid input syntax for type integer",
              "আগে guide_id::text, তারপর COALESCE",
            ],
            [
              "গড় বা মোটের হিসাবে NULL কে শূন্য বানানো",
              "অজানা মানগুলো শূন্য হিসেবে গোনা হয়, উত্তর ভুল",
              "আগে ভাবুন NULL মানে কী, শূন্য কি সত্যিই সেই অর্থ",
            ],
            [
              "ভাগের নিচে পাহারা না রাখা",
              "একটা Row এর শূন্য পুরো Report থামিয়ে দেয়",
              "ভাগের নিচে NULLIF(…, 0)",
            ],
            [
              "NULLIF এর Argument উল্টো লেখা",
              "NULLIF('', phone) কখনো phone ফেরত দেয় না",
              "প্রথমে আসল মান, পরে যেটা মুছতে চান",
            ],
            [
              "খালি লেখা আর NULL কে এক ভাবা",
              "COALESCE খালি লেখা ধরতে পারে না",
              "COALESCE(NULLIF(trim(x), ''), 'বিকল্প')",
            ],
            [
              "PostgreSQL এ IFNULL বা ISNULL() লেখা",
              "ERROR: function ifnull(text, unknown) does not exist",
              "COALESCE আর IS NULL, দুই Database এই চলে",
            ],
            [
              "MySQL এ NULL থাকতে পারে এমন Column সরাসরি GREATEST এ",
              "একটা NULL পেলেই উত্তর NULL",
              "আগে COALESCE দিয়ে NULL সরান",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ভুল আলাদা করে বলার মতো, কারণ সেটা কাজ করে বলে মনে হয়। Module 03 এ আপনি শিখেছেন
                Jamal (guide_id 1) এর না এমন ট্যুর খুঁজতে IS DISTINCT FROM লিখতে, যাতে Guide ছাড়া
                Ratargul বাদ না পড়ে। COALESCE শেখার পর অনেকে একটা নকল মান বসিয়ে একই কাজ করেন:{" "}
                <code className={CODE}>COALESCE(guide_id, -1) {"<>"} 1</code>। নিচের বক্সে দেখুন,
                সংখ্যাটা মিলেও যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নকল মানের কৌশল, আর তার বিকল্প"
              query={`SELECT count(*) AS sentinel
FROM tours
WHERE COALESCE(guide_id, -1) <> 1;

SELECT count(*) AS distinct_from
FROM tours
WHERE guide_id IS DISTINCT FROM 1;

SELECT count(*) AS plain
FROM tours
WHERE guide_id <> 1;`}
              caption="প্রথম দুটো দেয় ৭, শুধু <> দেয় ৬, কারণ সে Ratargul কে হারায়। তাহলে নকল মানের কৌশলে সমস্যা কোথায়? নিচে পড়ুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমস্যা তিনটা। এক, -1 একটা অনুমান: কাল যদি কেউ সত্যিই -1 কে কোনো অর্থে ব্যবহার শুরু করে,
              Query চুপচাপ ভুল হবে। দুই, পড়া মানুষকে আলাদা করে বুঝতে হয় -1 কেন এল। তিন, Column কে
              একটা Function এর ভেতরে মুড়লে সাধারণত সেই Column এর সাধারণ Index আর কাজে লাগে না, যেটা
              Module 13 এ দেখবেন। IS DISTINCT FROM এই তিনটা সমস্যার কোনোটা ছাড়াই ঠিক এই প্রশ্নের জন্য
              বানানো, তাই তুলনার কাজে সেটাই লিখুন। COALESCE রাখুন দেখানোর আর হিসাবের জন্য।
            </ContentParagraph>
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
                    href="https://www.postgresql.org/docs/current/functions-conditional.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Conditional Expressions
                  </a>
                  : CASE, COALESCE, NULLIF, GREATEST আর LEAST এক পাতায়। COALESCE যে শুধু দরকারি
                  Argument দেখে, আর GREATEST এর NULL নিয়ে Standard থেকে বিচ্যুতি, দুটোই এখানে লেখা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/typeconv-union-case.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UNION, CASE, and Related Constructs
                  </a>
                  : COALESCE আর GREATEST এর Argument গুলোর সাধারণ Type কীভাবে ঠিক হয়, সেই নিয়মের
                  বিস্তারিত।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/flow-control-functions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Flow Control Functions
                  </a>{" "}
                  আর{" "}
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Comparison Functions and Operators
                  </a>
                  : IFNULL, NULLIF, COALESCE, GREATEST, LEAST আর ISNULL() এর MySQL বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Null_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Null (SQL)
                  </a>
                  : COALESCE আর NULLIF এর জায়গা SQL Standard এ, আর বিভিন্ন Database এর তুলনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন
                  </a>
                  : এটা MySQL দিয়ে শেখানো, তাই সেখানে IFNULL দেখলে মনে রাখবেন PostgreSQL এ তার জায়গায়
                  COALESCE লিখতে হয়।
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
                  <strong>COALESCE(a, b, …)</strong> বাঁ থেকে দেখে, প্রথম অফাঁকা মানটা দেয়। সব
                  ফাঁকা হলে NULL, তাই শেষে একটা নিশ্চিত মান রাখুন।
                </ListItem>
                <ListItem>
                  COALESCE এর সব Argument এক Type এ নামতে হয়। integer আর লেখা মেশাতে আগে ::text।
                </ListItem>
                <ListItem>
                  COALESCE শুধু দরকারি Argument গুলোই হিসাব করে। এটা CASE WHEN a IS NOT NULL এর ছোট রূপ।
                </ListItem>
                <ListItem>
                  NULL কে শূন্য বানানো একটা সিদ্ধান্ত। দেখানোর লেখা সাধারণত নিরাপদ, হিসাবের সংখ্যা
                  সাবধানে।
                </ListItem>
                <ListItem>
                  <strong>NULLIF(a, b)</strong> a আর b সমান হলে NULL, নইলে a। নকল মান মুছতে, আর ভাগের
                  নিচে <code className={CODE}>NULLIF(x, 0)</code> দিয়ে শূন্য দিয়ে ভাগ আটকাতে।
                </ListItem>
                <ListItem>
                  <strong>GREATEST</strong> মেঝে, <strong>LEAST</strong> ছাদ। PostgreSQL এ এরা NULL
                  বাদ দেয়, MySQL এ একটা NULL পেলেই উত্তর NULL।
                </ListItem>
                <ListItem>
                  MySQL এ IFNULL আর ISNULL() আছে, কিন্তু দুই জায়গায় চলে COALESCE আর IS NULL।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে এই মডিউলের শেষ যন্ত্র: Pattern দিয়ে লেখা খোঁজা আর বদলানো। LIKE যেখানে
                থেমে যায়, যেমন এলোমেলোভাবে লেখা ফোন নম্বর এক রকম করা বা একটা লেখার ভেতর থেকে শুধু
                সংখ্যাগুলো বের করা, সেখান থেকে শুরু{" "}
                <Link href="/sql/topic/regular-expressions" className={LINK}>
                  Regular Expressions
                </Link>
                । সেই লেসনের শেষেই থাকবে পুরো Module 04 এর একটা সারাংশ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ কোথায়"],
    rows: [
      ["COALESCE", "প্রথম অফাঁকা মান", "COALESCE(phone, 'No phone')"],
      ["বিকল্পের শিকল", "শেষে নিশ্চিত মান রাখলে উত্তর কখনো ফাঁকা না", "COALESCE(phone, email, 'no contact')"],
      ["এক Type এর নিয়ম", "সব Argument একই Type এ নামতে হয়", "COALESCE(guide_id::text, 'No guide yet')"],
      ["দরকার মতো হিসাব", "প্রথম অফাঁকার ডানে কিছু চলে না", "COALESCE(price_bdt, price_bdt / 0) চলে"],
      ["COALESCE বনাম CASE", "উৎস জানাতে হলে CASE", "channel Column এ phone বা email"],
      ["NULL কে শূন্য বানানো", "একটা সিদ্ধান্ত, সবসময় ঠিক না", "rating এ শূন্য বসালে গড় নামে"],
      ["NULLIF", "সমান হলে NULL, নইলে প্রথমটা", "NULLIF(country, 'Bangladesh')"],
      ["খালি লেখার ফাঁদ", "খালি লেখা NULL না", "COALESCE(NULLIF(phone, ''), 'No phone')"],
      ["শূন্য দিয়ে ভাগ", "ভাগের নিচে NULLIF(x, 0)", "price_bdt / NULLIF(duration_days - 1, 0)"],
      ["GREATEST", "মেঝে বসায়", "GREATEST(seats_left - 10, 0)"],
      ["LEAST", "ছাদ বসায়", "LEAST(price_bdt, 15000.00)"],
      ["NULL ভেতরে GREATEST", "PostgreSQL বাদ দেয়, MySQL NULL দেয়", "GREATEST(5, NULL, 9)"],
      ["MySQL এর নিজস্ব", "IFNULL, ISNULL(), ভাগে শূন্য দিলে NULL", "দুই জায়গায় COALESCE, IS NULL"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "COALESCE(phone, email, 'no contact') Tanvir Ahmed এর জন্য কী দেয়, যাঁর phone NULL আর email আছে?",
        options: [
          {
            key: "A",
            text: "NULL, কারণ প্রথম Argument NULL",
            isCorrect: false,
            explanation: "COALESCE প্রথম NULL দেখে থামে না, প্রথম অফাঁকা মান পর্যন্ত খোঁজে।",
          },
          {
            key: "B",
            text: "তাঁর Email",
            isCorrect: true,
            explanation: "ঠিক। phone ফাঁকা, তাই দ্বিতীয় Argument দেখা হলো, আর সেটা ফাঁকা না, তাই খোঁজা সেখানেই শেষ।",
          },
          {
            key: "C",
            text: "no contact",
            isCorrect: false,
            explanation: "শেষের লেখাটা আসে শুধু তখন যখন আগের সব Argument ফাঁকা। Tanvir এর Email আছে।",
          },
          {
            key: "D",
            text: "phone আর Email দুটো জোড়া দিয়ে",
            isCorrect: false,
            explanation: "COALESCE কিছু জোড়া দেয় না, শুধু একটা মান বেছে নেয়।",
          },
        ],
      },
      {
        id: 2,
        text: "PostgreSQL এ SELECT COALESCE(guide_id, 'No guide yet') FROM tours; চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "Ratargul এর ঘরে No guide yet, বাকিদের নম্বর",
            isCorrect: false,
            explanation: "MySQL এ এমন হয়, কিন্তু PostgreSQL এ সব Argument একই Type এ নামতে হয়।",
          },
          {
            key: "B",
            text: "ERROR: invalid input syntax for type integer",
            isCorrect: true,
            explanation: "ঠিক। guide_id integer, তাই PostgreSQL উত্তরটা integer ধরে নেয় আর No guide yet কে সংখ্যায় বদলাতে গিয়ে আটকায়। সমাধান guide_id::text।",
          },
          {
            key: "C",
            text: "সব Row এ NULL",
            isCorrect: false,
            explanation: "Query টা চলেই না, তাই কোনো Row ও আসে না।",
          },
          {
            key: "D",
            text: "শুধু Ratargul এর Row টা বাদ যায়",
            isCorrect: false,
            explanation: "COALESCE কোনো Row বাদ দেয় না, আর এখানে Error এ পুরো Query থামে।",
          },
        ],
      },
      {
        id: 3,
        text: "NULLIF(5, 5) আর NULLIF(5, 6) এর উত্তর কী?",
        options: [
          {
            key: "A",
            text: "5 আর NULL",
            isCorrect: false,
            explanation: "উল্টো হয়ে গেছে। সমান হলে NULL, সমান না হলে প্রথম মান।",
          },
          {
            key: "B",
            text: "NULL আর 5",
            isCorrect: true,
            explanation: "ঠিক। 5 আর 5 সমান, তাই NULL। 5 আর 6 সমান না, তাই প্রথম মান 5।",
          },
          {
            key: "C",
            text: "true আর false",
            isCorrect: false,
            explanation: "NULLIF কোনো প্রশ্নের উত্তর দেয় না, একটা মান ফেরত দেয়।",
          },
          {
            key: "D",
            text: "NULL আর 6",
            isCorrect: false,
            explanation: "NULLIF কখনো দ্বিতীয় Argument ফেরত দেয় না।",
          },
        ],
      },
      {
        id: 4,
        text: "price_bdt / (duration_days - 1) এর Query তে ERROR: division by zero আসছে। সবচেয়ে ছোট আর নিরাপদ সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "WHERE duration_days > 1 দিয়ে একদিনের ট্যুর বাদ দেওয়া",
            isCorrect: false,
            explanation: "Error থামে, কিন্তু Ratargul Report থেকে হারিয়ে যায়। কাজটা ছিল সব ট্যুরের তালিকা।",
          },
          {
            key: "B",
            text: "price_bdt / NULLIF(duration_days - 1, 0)",
            isCorrect: true,
            explanation: "ঠিক। শূন্য হলে নিচের সংখ্যা NULL হয়, উত্তর NULL, কোনো Error নেই, আর সব Row থাকে।",
          },
          {
            key: "C",
            text: "price_bdt / COALESCE(duration_days - 1, 0)",
            isCorrect: false,
            explanation: "COALESCE NULL কে শূন্য বানায়, এখানে উল্টো কাজ দরকার। শূন্য তো আগে থেকেই আছে, Error থাকবেই।",
          },
          {
            key: "D",
            text: "price_bdt / (duration_days - 1) + 0",
            isCorrect: false,
            explanation: "শূন্য যোগ করলে কিছুই বদলায় না, ভাগ আগেই Error দেয়।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা Departure এ seats_left 9। GREATEST(seats_left - 10, 0) কী দেয়?",
        options: [
          {
            key: "A",
            text: "-1",
            isCorrect: false,
            explanation: "-1 আর 0 এর মধ্যে বড় 0, GREATEST সেটাই দেয়।",
          },
          {
            key: "B",
            text: "0",
            isCorrect: true,
            explanation: "ঠিক। হিসাব দেয় -1, কিন্তু GREATEST একটা মেঝে বসায়, শূন্যের নিচে নামতে দেয় না।",
          },
          {
            key: "C",
            text: "9",
            isCorrect: false,
            explanation: "9 তো তালিকায় নেই, তালিকায় আছে -1 আর 0।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "কোনো Argument NULL না, তাই উত্তরও NULL না।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT GREATEST(5, NULL, 9); PostgreSQL আর MySQL এ কী দেয়?",
        options: [
          {
            key: "A",
            text: "দুই জায়গাতেই 9",
            isCorrect: false,
            explanation: "MySQL Standard মেনে একটা NULL পেলেই উত্তর NULL দেয়।",
          },
          {
            key: "B",
            text: "দুই জায়গাতেই NULL",
            isCorrect: false,
            explanation: "PostgreSQL NULL গুলো বাদ দিয়ে হিসাব করে, তাই সেখানে উত্তর 9।",
          },
          {
            key: "C",
            text: "PostgreSQL এ 9, MySQL এ NULL",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এর Docs নিজেই বলে এটা Standard থেকে ইচ্ছাকৃত বিচ্যুতি। দুই জায়গায় একই উত্তর চাইলে আগে COALESCE।",
          },
          {
            key: "D",
            text: "PostgreSQL এ Error, MySQL এ 9",
            isCorrect: false,
            explanation: "কোনো Database এই Error আসে না।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Import এর পর কিছু Customer এর phone এ NULL না এসে খালি লেখা এসেছে। COALESCE(phone, 'No phone') তাঁদের জন্য কী দেখাবে?",
        options: [
          {
            key: "A",
            text: "No phone",
            isCorrect: false,
            explanation: "খালি লেখা NULL না, তাই COALESCE তাকেই প্রথম অফাঁকা মান ধরে।",
          },
          {
            key: "B",
            text: "একটা খালি ঘর",
            isCorrect: true,
            explanation: "ঠিক। খালি লেখা একটা জানা মান। সমাধান COALESCE(NULLIF(phone, ''), 'No phone'), আর ফাঁকা জায়গা থাকলে আগে trim।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: false,
            explanation: "মানটা NULL না, খালি লেখা, আর COALESCE সেটাই ফেরত দেয়।",
          },
          {
            key: "D",
            text: "ERROR",
            isCorrect: false,
            explanation: "এখানে কোনো Error নেই, শুধু চুপচাপ একটা ভুল দেখানো।",
          },
        ],
      },
      {
        id: 8,
        text: "Review এর গড় রেটিং হিসাবের আগে NULL rating কে COALESCE(rating, 0) দিয়ে শূন্য বানানো কেন বিপজ্জনক?",
        options: [
          {
            key: "A",
            text: "COALESCE সংখ্যার সাথে কাজ করে না",
            isCorrect: false,
            explanation: "COALESCE সংখ্যার সাথে ঠিকই কাজ করে।",
          },
          {
            key: "B",
            text: "এখনো রেটিং না দেওয়াকে শূন্য তারা ধরা হয়, গড় অকারণে নামে",
            isCorrect: true,
            explanation: "ঠিক। NULL মানে এখানে জানা নেই, আর শূন্য মানে খুব খারাপ। দুটো এক জিনিস না। বিকল্প বসানোর আগে NULL এর অর্থটা ভাবতে হয়।",
          },
          {
            key: "C",
            text: "এতে Query ধীর হয়",
            isCorrect: false,
            explanation: "গতির কোনো বড় পার্থক্য নেই। সমস্যা উত্তরের অর্থে।",
          },
          {
            key: "D",
            text: "MySQL এ এটা চলে না",
            isCorrect: false,
            explanation: "COALESCE MySQL এ একইভাবে চলে। সমস্যা Database এর না, সিদ্ধান্তের।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ফাঁকা ঘর ছাড়া একটা Report",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>Support এর তালিকা:</strong> সব Customer এর নাম, শহর, যোগাযোগের উপায় (ফোন, না থাকলে
        Email) আর channel। কোনো ঘর যেন ফাঁকা না থাকে। ফলাফলের প্রথম পাঁচ লাইন জমা দিন।
      </span>,
      <span key="2">
        <strong>Finance এর Report:</strong> সব ট্যুরের রাতপ্রতি দাম, দুই দশমিকে, একদিনের ট্যুরে day
        trip লেখা। আগে ইচ্ছা করে NULLIF ছাড়া চালিয়ে Error টা দেখুন, তারপর ঠিক করুন। দুটো Output ই
        রাখুন।
      </span>,
      <span key="3">
        <strong>সিটের মেঝে:</strong> এজেন্সি দশের বদলে বারোটা সিট রাখলে কোন কোন Departure এ সাধারণের জন্য
        সিট শূন্য হয়ে যাবে? GREATEST দিয়ে বের করুন, আর ঠিক কয়টা, সেই সংখ্যাটা লিখুন।
      </span>,
      <span key="4">
        <strong>দুই Database:</strong> MySQL ইনস্টল থাকলে GREATEST(seats_left - 10, NULL) দুই জায়গায়
        চালান, উত্তরের পার্থক্য দেখান। ইনস্টল না থাকলে এই লেসনের Lab থেকে উত্তর নিয়ে দুই লাইনে
        ব্যাখ্যা লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু বলছেন, সব NULL কে COALESCE দিয়ে শূন্য
        বানিয়ে দিলেই তো ঝামেলা শেষ। rating এর উদাহরণ দিয়ে ছয় লাইনে বোঝান কেন সেটা সবসময় ঠিক না, আর কখন
        ঠিক।
      </span>,
    ],
    deliverables: [
      <span key="d1">Support তালিকার Query আর প্রথম পাঁচ লাইন</span>,
      <span key="d2">Finance Report এর ভুল আর ঠিক দুই Output</span>,
      <span key="d3">বারো সিটের হিসাবের Query আর শূন্য হওয়া Departure এর সংখ্যা</span>,
      <span key="d4">PostgreSQL আর MySQL এর পার্থক্যের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ চারটা যন্ত্র",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "COALESCE দিয়ে ফাঁকা ঘর গোনা",
        description:
          "প্রথম ফাইল চালান। No phone লেখা কয়টা Row, আর যোগাযোগের তালিকায় কয়টা Row, মন্তব্যের সংখ্যার সাথে মেলান।",
      },
      {
        title: "Type এর নিয়ম ভেঙে দেখা",
        description:
          "দ্বিতীয় ফাইলের প্রথম Query Error দেবে, দ্বিতীয়টা চলবে। Error এর লেখাটা নিজের খাতায় টুকে রাখুন।",
      },
      {
        title: "NULLIF দিয়ে অপ্রয়োজনীয় মুছে ফেলা",
        description:
          "তৃতীয় ফাইলে দেশের নাম থেকে Bangladesh মুছে গোনা। কয়জন বিদেশি অতিথি, মিলিয়ে দেখুন।",
      },
      {
        title: "শূন্য দিয়ে ভাগ, আর পাহারা",
        description:
          "চতুর্থ ফাইলের প্রথম Query Error দেবে। দ্বিতীয়টা কয়টা ট্যুরের রাতপ্রতি দাম NULL পেল, গুনে দেখুন।",
      },
      {
        title: "মেঝে আর ছাদ",
        description:
          "পঞ্চম ফাইলে GREATEST আর LEAST। কয়টা Departure এ সাধারণের সিট শূন্য, আর কয়টা ট্যুরের দাম ছাদে আটকাল।",
      },
      {
        title: "NULL ভেতরে GREATEST",
        description:
          "ষষ্ঠ ফাইলে PostgreSQL এর আচরণ নিজের চোখে দেখুন, আর \\pset null দিয়ে NULL কে দৃশ্যমান করুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-coalesce.sql",
        code: `SELECT count(*) FROM customers
WHERE COALESCE(phone, 'No phone') = 'No phone';
-- 5

SELECT full_name, COALESCE(phone, email, 'no contact') AS contact
FROM customers;
-- (15 rows)`,
      },
      {
        language: "sql",
        filename: "02-types.sql",
        code: `SELECT title, COALESCE(guide_id, 'No guide yet') AS guide FROM tours;
-- ERROR:  invalid input syntax for type integer: "No guide yet"

SELECT title, COALESCE(guide_id::text, 'No guide yet') AS guide FROM tours;
-- (9 rows), Ratargul Swamp Boat Day এর ঘরে No guide yet`,
      },
      {
        language: "sql",
        filename: "03-nullif.sql",
        code: `SELECT count(NULLIF(country, 'Bangladesh')) AS abroad FROM customers;
-- 3

SELECT full_name, NULLIF(country, 'Bangladesh') AS abroad FROM customers;
-- (15 rows), শুধু Priya, Aiman আর Oliver এর ঘরে দেশের নাম`,
      },
      {
        language: "sql",
        filename: "04-divide.sql",
        code: `SELECT title, round(price_bdt / (duration_days - 1), 2) AS per_night FROM tours;
-- ERROR:  division by zero

SELECT count(*) AS day_trips FROM tours
WHERE price_bdt / NULLIF(duration_days - 1, 0) IS NULL;
-- 1`,
      },
      {
        language: "sql",
        filename: "05-floor-and-ceiling.sql",
        code: `SELECT count(*) AS full_hold FROM departures
WHERE GREATEST(seats_left - 10, 0) = 0;
-- 3

SELECT count(*) AS capped FROM tours
WHERE LEAST(price_bdt, 15000.00) < price_bdt;
-- 3`,
      },
      {
        language: "sql",
        filename: "06-greatest-null.sql",
        code: `\\pset null '(null)'

SELECT GREATEST(5, NULL, 9) AS g,
       LEAST(5, NULL, 9) AS l,
       GREATEST(NULL::int, NULL) AS all_null;
-- g = 9, l = 5, all_null = (null)`,
      },
    ],
    tip: (
      <>
        প্রতিটা মন্তব্যের সংখ্যা একটা নতুন Load করা island_tours থেকে নেওয়া। আপনার সংখ্যা না মিললে আগে
        দেখুন আগের কোনো পরীক্ষায় Data বদলে গেছে কিনা। Module 02 এর Load লেসনের মতো ফাইলটা আবার
        চালালেই সব শুরুর অবস্থায় ফিরে আসে।
      </>
    ),
  },
};
