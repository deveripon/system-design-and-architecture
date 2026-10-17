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
  SortLab,
  TieShuffleLab,
} from "../../../components/course/topics/reading-data/orderby-animations";
import {
  NullPlacementSplit,
  OrderByStepDiagram,
  SortKeysDiagram,
} from "../../../components/course/topics/reading-data/orderby-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.9em]";

export const orderByContent: TopicData = {
  id: "order-by",
  introduction: {
    badge: "MODULE 03 · LESSON 06",
    title: <SectionTitle>ORDER BY: সাজানোর দায়িত্ব আপনার</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Website এ ট্যুরের তালিকা খুললে একজন পর্যটক প্রথমে কী খোঁজেন?
          সবচেয়ে সস্তা ট্যুর। Admin Panel এ বসা কর্মী খোঁজেন সবচেয়ে পুরনো pending
          Booking টা, যেটা আগে সামলাতে হবে। হিসাব বিভাগ চান সবচেয়ে বড় অঙ্কের Payment
          উপরে। একই Data, তিনজনের তিন রকম ক্রম দরকার।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি শিখেছেন কোন Table থেকে কোন Column আনবেন, আর WHERE
          দিয়ে কোন Row রাখবেন। কিন্তু Row গুলো কোন ক্রমে আসবে, সেটা এখনো আপনার হাতে
          নেই। এই লেসনে সেই চাবিটা হাতে পাবেন: ORDER BY। দেখবেন ছোট থেকে বড় আর বড় থেকে
          ছোট কীভাবে সাজায়, কয়েকটা Column দিয়ে একসাথে কীভাবে সাজায়, NULL কোথায় বসে
          আর কেন PostgreSQL আর MySQL এখানে উল্টো আচরণ করে, সমান মানের Row গুলোর ক্রম
          কেন কেউ কথা দেয় না, আর লেখার ক্রম যে অক্ষরে অক্ষরে সবখানে এক না, সেটাও।
        </ContentParagraph>
        <ContentParagraph>
          সবচেয়ে বড় শিক্ষাটা দিয়েই শুরু করা যাক, কারণ এটা না জানলে বাকি সব শেখা কাজে
          আসে না: ORDER BY না লিখলে Database কোনো ক্রমের কথাই দেয় না। একদমই না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আলমারি থেকে ফাইল বের করে টেবিলে রাখতে বললে কেরানি যে ক্রমে হাতে পান সে ক্রমেই রাখবেন। নাম ধরে সাজিয়ে চাইলে সেটা মুখে বলতে হয়। না বললে, আজ যে ক্রম পেলেন কাল সেটা না পেলে কেরানির দোষ নেই।",
      author: "ORDER BY",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যে ক্রম কেউ কথা দেয়নি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Developer রাফি একদিন Website এর ট্যুর তালিকার Query লিখলেন:
                SELECT title, price_bdt FROM tours; Local এ চালিয়ে দেখলেন ট্যুরগুলো
                tour_id এর ক্রমে আসছে, প্রথমে Saint Martin, তারপর Cox&apos;s Bazar। তিনি ধরে
                নিলেন এটাই নিয়ম: যে ট্যুর আগে যোগ হয়েছে সে আগে দেখাবে। ORDER BY লেখার
                দরকার মনে হলো না।
              </ContentParagraph>
              <ContentParagraph>
                মাস দুয়েক পরে মার্কেটিং টিম অভিযোগ করল, Saint Martin Island Escape নাকি
                তালিকার একদম নিচে চলে গেছে। কেউ কোডে হাত দেয়নি। শুধু আগের দিন কেউ ওই
                ট্যুরের দাম বদলেছিলেন। রাফি অবাক হলেন: দাম বদলালে ক্রম বদলাবে কেন?
              </ContentParagraph>
              <ContentParagraph>
                উত্তরটা এই লেসনের প্রথম আর সবচেয়ে জরুরি নিয়ম। ORDER BY ছাড়া Database যে
                ক্রমে Row ফেরত দেয়, সেটা তার ভেতরের সুবিধার ক্রম, আপনার জন্য কোনো
                প্রতিশ্রুতি না। Row টা Disk এ কোথায় বসে আছে, কোন পথে খোঁজা হলো, কে কখন
                বদলাল, সবকিছু সেই ক্রমকে নাড়িয়ে দিতে পারে। PostgreSQL এর Docs সোজাসুজি
                বলে, সাজানো না চাইলে Row আসে অনির্দিষ্ট ক্রমে, আর সেই ক্রমের উপর ভরসা
                করা যাবে না।
              </ContentParagraph>
              <ContentParagraph>
                ঠিক কী হয়েছিল, পরের Section এ নিজের চোখে দেখবেন। তার পর পুরো লেসন জুড়ে
                শিখবেন কীভাবে ক্রমটা নিজের হাতে নেবেন, এমনভাবে যে আজ, কাল, এক লাখ Row
                হলেও, আর অন্য Database এ গেলেও ক্রমটা আপনি যা চেয়েছেন তা-ই থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে পুরো লেসন",
          content: (
            <ContentParagraph>
              ক্রম দরকার হলে ORDER BY লিখুন, আর এমনভাবে লিখুন যাতে দুটো Row কখনো
              পুরোপুরি সমান না হয়। বাকি সবকিছু এই এক লাইনের বিস্তার।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "no-guaranteed-order",
      subHeader: { index: "002", title: "No Guaranteed Order" },
      title: <SectionTitle>ORDER BY ছাড়া ক্রম কেন বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের বক্সে রাফির গল্পটা ছোট করে চালানো আছে। প্রথম Query তে ORDER BY নেই,
                ট্যুরগুলো tour_id এর ক্রমে আসে। তারপর একটা Transaction এর ভেতরে ১ নম্বর
                ট্যুরের দাম তার নিজের মানেই বসানো হয়, মানে আসলে কিছুই বদলায় না। তারপর
                আবার একই Query। শেষে ROLLBACK, যাতে সবকিছু আগের মতো ফিরে যায়।
                Transaction নিয়ে বিস্তারিত Module 12 তে, আপাতত শুধু Run চাপুন আর দুটো
                তালিকা মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Query, ভিন্ন ক্রম"
              query={`SELECT tour_id, title FROM tours;

BEGIN;
UPDATE tours SET price_bdt = price_bdt WHERE tour_id = 1;
SELECT tour_id, title FROM tours;
ROLLBACK;`}
              caption="দ্বিতীয় তালিকায় Saint Martin Island Escape একদম নিচে নেমে গেছে, অথচ তার কোনো মান বদলায়নি। PostgreSQL একটা Row বদলালে পুরনোটা রেখে নতুন একটা Copy লেখে, আর এই ছোট Table এ সেই Copy বসেছে বাকি Row গুলোর পরে। ORDER BY না থাকলে PostgreSQL যে ক্রমে Disk পড়ে সেই ক্রমেই দেখায়। ROLLBACK এর পরে সব আগের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই আচরণের পেছনের যন্ত্রটার নাম MVCC, যেটা Module 12 তে ভেতর থেকে দেখবেন।
                এখন শুধু শিক্ষাটা ধরে রাখুন: ORDER BY ছাড়া যে ক্রম দেখছেন সেটা কাকতালীয়।
                ছোট Table এ, একা একা Local এ, সেটা প্রায়ই সুন্দর আর গোছানো দেখায়, আর ঠিক
                সেজন্যই ফাঁদটা বিপজ্জনক। ক্রম বদলানোর আরও কারণ আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Row বদলানো বা মোছা:</strong> উপরের বক্সের মতো, পুরনো Row এর
                  জায়গায় নতুন Row অন্য কোথাও বসে।
                </ListItem>
                <ListItem>
                  <strong>খোঁজার পথ বদলানো:</strong> Data বাড়লে PostgreSQL পুরো Table না
                  পড়ে Index ধরে খুঁজতে পারে, আর তখন Row আসে Index এর ক্রমে। এই সিদ্ধান্ত
                  Planner নেয়, Module 13 এ দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>কয়েকজন কর্মী একসাথে পড়া:</strong> বড় Table এ PostgreSQL কাজটা
                  কয়েকটা Process এ ভাগ করে নিতে পারে, তখন কে আগে শেষ করল তার উপর ক্রম
                  নির্ভর করে।
                </ListItem>
                <ListItem>
                  <strong>অন্য Database:</strong> MySQL বা অন্য কোনো Database একই Table
                  অন্য ক্রমে ফেরত দিতে পারে, কারণ তাদের ভেতরের সাজানো আলাদা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Local এ ঠিক, Production এ ভুল",
          content: (
            <ContentParagraph>
              আপনার মেশিনে নয়টা ট্যুর, কেউ কিছু বদলায় না, তাই ক্রম দেখে মনে হয় নিয়ম
              আছে। Production এ লাখ Row, প্রতি মিনিটে বদল, আর Planner এর আলাদা পথ।
              যে Page বা Report এ ক্রম গুরুত্বপূর্ণ, সেখানে ORDER BY ছাড়া Query কখনো
              Production এ পাঠাবেন না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "asc-desc",
      subHeader: { index: "003", title: "ASC and DESC" },
      title: <SectionTitle>ছোট থেকে বড়, বড় থেকে ছোট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ORDER BY বসে Query এর একদম শেষে, FROM আর WHERE এর পরে। তার পরে লিখবেন
                কোন Column ধরে সাজাতে চান। সংখ্যা হলে ছোট থেকে বড়, তারিখ হলে পুরনো থেকে
                নতুন, লেখা হলে বর্ণমালার ক্রমে। এই স্বাভাবিক ক্রমের নাম ASC, Ascending,
                মানে ওঠার দিকে। কিছু না লিখলে ORDER BY নিজে থেকেই ASC ধরে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো ক্রম চাইলে Column এর পরে লিখুন DESC, Descending, মানে নামার দিকে।
                সবচেয়ে দামি আগে, সবচেয়ে নতুন Booking আগে, সবচেয়ে বেশি রেটিং আগে, এসব
                DESC এর কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দাম ধরে সাজানো"
              query={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt;`}
              caption="সবচেয়ে সস্তা Ratargul Swamp Boat Day (3500) উপরে, সবচেয়ে দামি Saint Martin Luxury Stay (32000) নিচে। এবার শেষ লাইনটা বদলে ORDER BY price_bdt DESC লিখে আবার চালান, তালিকা উল্টে যাবে। ORDER BY price_bdt ASC লিখলেও প্রথম ফলাফলটাই আসবে, কারণ ASC নিজে থেকেই ধরা থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জিনিস খেয়াল করুন: সাজানোর Column টা SELECT এর তালিকায় থাকতেই হবে
                এমন না। নিচের Query তে শুধু title দেখানো হচ্ছে, অথচ সাজানো হচ্ছে দাম ধরে।
                Website এ যখন দাম না দেখিয়ে শুধু নাম দেখাতে চান কিন্তু ক্রমটা দামের,
                তখন এটাই লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "order-by-hidden-column.sql",
          code: `SELECT title
FROM tours
ORDER BY price_bdt DESC;

-- title
-- Saint Martin Luxury Stay
-- Sundarbans Mangrove Cruise
-- Cox's Bazar Family Package
-- ... (9 rows)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              orderMatters
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code> দেখান, সবচেয়ে দামি ট্যুর সবার
                  উপরে।
                </>
              }
              hint={
                <>
                  বড় থেকে ছোট মানে DESC। ORDER BY এর পরে Column এর নাম, তারপর DESC।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt DESC;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              ORDER BY, ASC আর DESC MySQL এ হুবহু একই। আপনার MySQL ভিডিওর ORDER BY অংশের
              প্রতিটা উদাহরণ PostgreSQL এ কোনো বদল ছাড়াই চলবে। আলাদা হয় শুধু NULL আর
              লেখা সাজানোর খুঁটিনাটি, যেটা এই লেসনের পরের অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "several-columns",
      subHeader: { index: "004", title: "Several Columns" },
      title: <SectionTitle>প্রথম চাবি দল বানায়, পরের চাবি দলের ভেতরে সাজায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                স্কুলের হাজিরা খাতার কথা ভাবুন। আগে শ্রেণি অনুযায়ী ভাগ, তারপর একই শ্রেণির
                ভেতরে রোল নম্বর অনুযায়ী। রোল নম্বর শুধু একই শ্রেণির ভেতরে কাজ করে, অন্য
                শ্রেণির ছাত্রের সাথে তুলনা হয় না। ORDER BY তে কমা দিয়ে কয়েকটা Column
                লিখলে ঠিক এটাই হয়। প্রথম Column কে বলা যায় প্রথম চাবি, যেটা দল বানায়।
                প্রথম চাবিতে যাদের মান সমান, শুধু তাদের মধ্যে দ্বিতীয় চাবি ঠিক করে কে আগে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SortKeysDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দেশ, তারপর শহর, তারপর নাম"
              query={`SELECT full_name, city, country
FROM customers
ORDER BY country, city, full_name;`}
              caption="প্রথমে Bangladesh এর বারোজন, তারপর India, Malaysia আর United Kingdom এর একজন করে। Bangladesh এর ভেতরে শহর ধরে Barishal থেকে Sylhet, আর Dhaka এর ছয়জনের ভেতরে নাম ধরে Imran Kabir থেকে Sumaiya Islam। Kolkata, Kuala Lumpur, London যে তালিকার শেষে, সেটা শহরের নামের জন্য না, দেশের জন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা চাবির দিক আলাদা আলাদা ঠিক হয়। এটাই এই Section এর সবচেয়ে বেশি ভুল
                হওয়া জায়গা। ORDER BY duration_days, price_bdt DESC লিখলে DESC শুধু
                price_bdt এর গায়ে লাগে, duration_days থাকে ASC। PostgreSQL আর MySQL
                দুজনের Docs ই এটা আলাদা করে বলে দেয়। নিচে দুটো Query পাশাপাশি চালিয়ে
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DESC কার গায়ে লাগে"
              query={`-- DESC শুধু price_bdt এর
SELECT title, duration_days, price_bdt
FROM tours
ORDER BY duration_days, price_bdt DESC;

-- দুটোরই DESC চাইলে দুবার লিখতে হয়
SELECT title, duration_days, price_bdt
FROM tours
ORDER BY duration_days DESC, price_bdt DESC;`}
              caption="প্রথম ফলাফলে ছোট ট্যুর আগে (১ দিন, তারপর ২ দিন), কিন্তু একই দৈর্ঘ্যের ভেতরে দামি আগে। দ্বিতীয়টায় লম্বা ট্যুর আগে, আর ভেতরে দামি আগে। ৪ দিনের দুটো ট্যুরের মধ্যে Saint Martin Luxury Stay আগে, কারণ তার দাম বেশি।"
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
                  প্রতিটা Customer এর <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>city</code> দেখান, শহরের নাম ধরে A থেকে Z, আর
                  একই শহরের ভেতরে নাম ধরে A থেকে Z।
                </>
              }
              hint={
                <>ORDER BY এর পরে দুটো Column, কমা দিয়ে আলাদা। কোনটা আগে লিখবেন, সেটা ভাবুন।</>
              }
              solution={`SELECT full_name, city
FROM customers
ORDER BY city, full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "expressions",
      subHeader: { index: "005", title: "Expressions and Aliases" },
      title: <SectionTitle>হিসাব করা মান, ডাকনাম আর অবস্থান ধরে সাজানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবসময় যে সাজানোর মানটা Table এ তৈরি অবস্থায় বসে থাকে, তা না। ধরুন একজন
                পর্যটক জানতে চান প্রতি দিনের হিসাবে কোন ট্যুর সবচেয়ে সাশ্রয়ী। Table এ
                দাম আছে, দিন আছে, কিন্তু দিনপ্রতি দাম নেই। সেটা হিসাব করতে হবে:
                price_bdt / duration_days। এই হিসাবকে বলে Expression, আর ORDER BY যেকোনো
                Expression ধরে সাজাতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                হিসাবটাকে SELECT এ একটা ডাকনাম দিলে, মানে Alias, ORDER BY সেই নাম ধরেই
                সাজাতে পারে। round() দিয়ে দশমিকের লম্বা লেজ কেটে পুরো টাকায় আনা হয়েছে,
                Function গুলোর বিস্তারিত পরের মডিউলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দিনপ্রতি দাম, আর Alias এর সীমা"
              query={`SELECT title, duration_days,
       round(price_bdt / duration_days) AS per_day
FROM tours
ORDER BY per_day DESC;

-- Alias কে হিসাবের ভেতরে ঢোকালে?
SELECT title, round(price_bdt / duration_days) AS per_day
FROM tours
ORDER BY per_day * 2;`}
              caption="প্রথম Query চলে: Saint Martin Luxury Stay দিনে 8000 টাকা, সবার উপরে। দ্বিতীয়টায় ERROR: column &quot;per_day&quot; does not exist। ORDER BY তে Alias চলে শুধু একা দাঁড়িয়ে। তাকে কোনো হিসাবের ভেতরে ঢোকালে PostgreSQL তাকে চেনে না, তখন পুরো Expression টা আবার লিখতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় Query এর Error টা অদ্ভুত লাগতে পারে। ORDER BY per_day চলল, অথচ
                ORDER BY per_day * 2 চলল না। PostgreSQL এর Docs এর ভাষায়, ORDER BY তে
                Output Column এর নাম একা দাঁড়াতে হয়, কোনো Expression এর ভেতরে তাকে
                ব্যবহার করা যায় না। কারণটা ইতিহাসের: SQL এর পুরনো নিয়ম আর নতুন নিয়মের
                মধ্যে দ্বন্দ্ব এড়াতে এই সীমা। সমাধান সহজ, Expression টা পুরোটা আবার লিখুন:
                ORDER BY round(price_bdt / duration_days) * 2।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা উপায় আছে, যেটা দেখে রাখা দরকার কিন্তু নিজের কোডে লেখা ঠিক না:
                Column এর অবস্থান নম্বর। ORDER BY 2 মানে SELECT তালিকার দ্বিতীয় Column ধরে
                সাজানো। Terminal এ দ্রুত কিছু দেখতে সুবিধা, কিন্তু কেউ পরে SELECT এর শুরুতে
                একটা Column যোগ করলে দ্বিতীয় Column বদলে যায়, আর সাজানোও নিঃশব্দে বদলে
                যায়, কোনো Error ছাড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY 2 এর ফাঁদ"
              query={`-- দ্বিতীয় Column price_bdt, তাই দাম ধরে সাজানো
SELECT title, price_bdt
FROM tours
ORDER BY 2 DESC;

-- কেউ শুরুতে tour_id যোগ করলেন, এখন দ্বিতীয় Column title
SELECT tour_id, title, price_bdt
FROM tours
ORDER BY 2 DESC;`}
              caption="প্রথমটা দাম ধরে সাজানো, দ্বিতীয়টা নাম ধরে, অথচ ORDER BY 2 DESC লাইনটা কেউ ছোঁয়নি। তাই নিজের লেখা Query তে সবসময় Column এর নাম বা Alias লিখুন।"
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
                  প্রতিটা ট্যুরের <code className={CODE}>title</code>,{" "}
                  <code className={CODE}>duration_days</code> আর দিনপ্রতি দাম দেখান,
                  দিনপ্রতি দাম পুরো টাকায় গোল করা (round), নাম{" "}
                  <code className={CODE}>per_day</code>। সবচেয়ে সাশ্রয়ী আগে। দুটো ট্যুরের
                  দিনপ্রতি দাম সমান হলে ছোট ট্যুরটা আগে।
                </>
              }
              hint={
                <>
                  per_day ধরে ছোট থেকে বড়, তারপর কমা দিয়ে duration_days। Alias একা দাঁড়ালে
                  ORDER BY তাকে চেনে।
                </>
              }
              solution={`SELECT title, duration_days,
       round(price_bdt / duration_days) AS per_day
FROM tours
ORDER BY per_day, duration_days;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "where-it-runs",
      subHeader: { index: "006", title: "Where ORDER BY Runs" },
      title: <SectionTitle>ORDER BY কেন Alias চেনে, আর WHERE কেন চেনে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের Section এ ORDER BY per_day চলেছে। একই Alias WHERE এ লিখলে কিন্তু
                চলে না। এর কারণ এই মডিউলের Lesson 02 এর বড় শিক্ষা: আপনি Query যে ক্রমে
                লেখেন, Database সে ক্রমে চালায় না। WHERE চলে SELECT এর আগে, তখনো per_day
                নামের কিছু জন্মায়নি। ORDER BY চলে SELECT এর পরে, ততক্ষণে Alias তৈরি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OrderByStepDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Alias, দুই জায়গায়"
              query={`-- ORDER BY তে Alias চলে
SELECT title, round(price_bdt / duration_days) AS per_day
FROM tours
ORDER BY per_day DESC
LIMIT 3;

-- WHERE এ চলে না
SELECT title, round(price_bdt / duration_days) AS per_day
FROM tours
WHERE per_day > 5000;`}
              caption="প্রথম Query তিনটা Row দেয়: 8000, 6000, 5167। দ্বিতীয়টা ERROR: column &quot;per_day&quot; does not exist। WHERE এ শর্ত দিতে হলে পুরো Expression টা লিখতে হয়: WHERE round(price_bdt / duration_days) > 5000। LIMIT এখানে শুধু উপরের তিনটা রাখছে, পরের লেসনে তার পুরো গল্প।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ব্যতিক্রমও এখানেই বলে রাখা ভালো, কারণ এটা প্রথম দেখায় খুব বিভ্রান্ত
                করে। SELECT DISTINCT ব্যবহার করলে ORDER BY এর সব Column SELECT এর তালিকায়
                থাকতে হয়। না থাকলে PostgreSQL বলে: for SELECT DISTINCT, ORDER BY
                expressions must appear in select list। DISTINCT একই রকম Row গুলো এক করে
                ফেলে, তারপর যে Column আর দেখা যাচ্ছে না তা ধরে সাজানোর মানে থাকে না।
                DISTINCT এর পুরোটা এই মডিউলের Lesson 08 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "distinct-order-by.sql",
          code: `SELECT DISTINCT country FROM customers ORDER BY city;
-- ERROR:  for SELECT DISTINCT, ORDER BY expressions must appear in select list

SELECT DISTINCT country FROM customers ORDER BY country;
-- Bangladesh, India, Malaysia, United Kingdom (4 rows)`,
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "nulls",
      subHeader: { index: "007", title: "NULLs" },
      title: <SectionTitle>অজানা মান কোথায় বসবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Ratargul Swamp Boat Day ট্যুরের এখনো কোনো Guide ঠিক হয়নি,
                তাই তার guide_id হলো NULL, মানে অজানা। NULL কোনো সংখ্যা না, তাই সেটা ১ এর
                চেয়ে ছোট না বড়, কেউ জানে না। কিন্তু সাজাতে গেলে তাকে কোথাও না কোথাও
                বসাতেই হবে। NULL এর পুরো গল্প এই মডিউলের Lesson 05 এ, এখানে শুধু সাজানোর
                প্রশ্নটা।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর নিয়ম: সাজানোর সময় NULL কে সবচেয়ে বড় মান ধরা হয়। তাই ASC
                তে NULL একদম নিচে, আর DESC তে একদম উপরে। নিয়মটা বদলাতে চাইলে Column এর
                পরে লিখুন NULLS FIRST বা NULLS LAST।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NullPlacementSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide ছাড়া ট্যুর কোথায় বসে"
              query={`SELECT title, guide_id FROM tours ORDER BY guide_id;

SELECT title, guide_id FROM tours ORDER BY guide_id DESC;

SELECT title, guide_id FROM tours ORDER BY guide_id NULLS FIRST;`}
              caption="প্রথমটায় Ratargul Swamp Boat Day একদম নিচে, দ্বিতীয়টায় একদম উপরে, তৃতীয়টায় ASC হয়েও উপরে, কারণ NULLS FIRST বলে দেওয়া হয়েছে। Query Box এ NULL লেখা দেখায়, psql এ ওই ঘরটা ফাঁকা দেখায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখন দরকার পড়ে? ধরুন Admin Panel এ Customer তালিকা ফোন নম্বর ধরে বড় থেকে
                ছোট সাজানো। DESC এর নিয়মে যাঁদের ফোন নম্বর নেই সেই পাঁচজন উঠে আসবেন
                সবার উপরে, অথচ কর্মী আগে চান যাঁদের নম্বর আছে তাঁদের। তখন লিখুন ORDER BY
                phone DESC NULLS LAST। এই নিয়মও প্রতিটা চাবির জন্য আলাদা, একটা চাবির NULLS
                LAST অন্য চাবিতে লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "phones-last.sql",
          code: `SELECT full_name, phone
FROM customers
ORDER BY phone DESC NULLS LAST, full_name;

-- Imran Kabir    | +8801000000115
-- Lamia Haque    | +8801000000114
-- ...            | ...
-- Rahim Uddin    | +8801000000101
-- Aiman Zulkifli |
-- Mitu Rahman    |
-- Oliver Bennett |
-- Priya Sharma   |
-- Tanvir Ahmed   |
-- (15 rows)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>guide_id</code> দেখান, guide_id ছোট থেকে বড়,
                  কিন্তু যে ট্যুরের Guide নেই সেটা সবার আগে। একই Guide এর ট্যুরগুলো নাম ধরে
                  A থেকে Z।
                </>
              }
              hint={
                <>
                  ASC তে PostgreSQL NULL কে নিচে রাখে। উপরে আনতে guide_id এর পরে NULLS
                  FIRST, তারপর কমা দিয়ে title।
                </>
              }
              solution={`SELECT title, guide_id
FROM tours
ORDER BY guide_id NULLS FIRST, title;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "mysql-nulls",
      subHeader: { index: "008", title: "MySQL and NULLs" },
      title: <SectionTitle>MySQL এ NULL উল্টো দিকে বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে PostgreSQL আর MySQL দুই রাস্তায় হাঁটে। MySQL এর Docs বলে, ORDER BY
                ASC তে NULL আসে সবার আগে, আর DESC তে সবার শেষে। মানে MySQL NULL কে
                সবচেয়ে ছোট মান ধরে, PostgreSQL ধরে সবচেয়ে বড়। আপনার MySQL ভিডিওর কোনো
                উদাহরণে NULL উপরে দেখলে আর নিজের PostgreSQL এ নিচে দেখলে, কেউ ভুল করেনি,
                দুজনেই নিজের নিয়ম মানছে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় পার্থক্যটা বেশি বিপজ্জনক: MySQL এ NULLS FIRST বা NULLS LAST লেখাই
                যায় না। লিখলে Syntax Error। নিচের দুটো ফলাফল এই লেসনের জন্য MySQL 8.4 এর
                একটা Container এ Island Tours এর MySQL ফাইল Load করে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql 8.4",
          code: `mysql> SELECT title, guide_id FROM tours ORDER BY guide_id;
+----------------------------+----------+
| title                      | guide_id |
+----------------------------+----------+
| Ratargul Swamp Boat Day    |     NULL |
| Saint Martin Island Escape |        1 |
| Sajek Valley Cloud Trip    |        1 |
| Cox's Bazar Beach Weekend  |        2 |
| ...                        |      ... |
+----------------------------+----------+

mysql> SELECT title, guide_id FROM tours ORDER BY guide_id NULLS LAST;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'NULLS LAST' at line 1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ NULL কে শেষে পাঠানোর প্রচলিত কৌশল হলো আগে একটা ছোট প্রশ্ন দিয়ে
                সাজানো: guide_id IS NULL। এই প্রশ্নের উত্তর মান থাকলে 0, না থাকলে 1, আর
                0 আগে আসে। তারপর কমা দিয়ে আসল চাবি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-nulls-last.sql",
          code: `-- MySQL: NULL শেষে, বাকিরা ছোট থেকে বড়
SELECT title, guide_id
FROM tours
ORDER BY guide_id IS NULL, guide_id;
-- Ratargul Swamp Boat Day এবার শেষে (MySQL 8.4 এ চালিয়ে দেখা)

-- PostgreSQL এ একই কাজ সরাসরি:
SELECT title, guide_id
FROM tours
ORDER BY guide_id NULLS LAST;`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুই Database এ একই ফল চাইলে",
          content: (
            <ContentParagraph>
              যে Query দুই Database এ একই ক্রম দিতে হবে, সেখানে NULL এর জায়গা কখনো
              নিয়মের উপর ছেড়ে দেবেন না। PostgreSQL এ NULLS FIRST বা NULLS LAST লিখুন,
              আর MySQL এ IS NULL কৌশল। মজার ব্যাপার, IS NULL কৌশলটা PostgreSQL এও চলে,
              কারণ সেখানে false আসে true এর আগে। তাই দুই জায়গায় একই লেখা চাইলে ORDER BY
              guide_id IS NULL, guide_id দুই Database এই NULL কে শেষে রাখে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "ties",
      subHeader: { index: "009", title: "Ties" },
      title: <SectionTitle>সমান মানের Row: ক্রম যেখানে কেউ কথা দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Section 002 এর শিক্ষাটা এখানে আরেকবার ফিরে আসে, আরও সূক্ষ্মভাবে। ORDER BY
                guide_id লিখলেন। guide 1 এর দুটো ট্যুর আছে: Saint Martin Island Escape আর
                Sajek Valley Cloud Trip। দুটোর চাবিই 1, তাহলে কে আগে? উত্তর: কেউ জানে না।
                সমান চাবির Row গুলোকে বলে Tie, আর Tie এর ভেতরের ক্রম ORDER BY ছাড়া Query
                এর মতোই অনির্দিষ্ট।
              </ContentParagraph>
              <ContentParagraph>
                এটা তত্ত্বের কথা না। এই লেসন লেখার সময় একই Query Box এ ORDER BY guide_id
                দিলে Saint Martin আগে এসেছে, আর ORDER BY guide_id NULLS FIRST দিলে Sajek
                আগে। দুটো ফলাফলই নিয়ম মেনে সঠিক। নিচের Lab এ তিনটা আসল ফলাফল পাশাপাশি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TieShuffleLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Tie, তারপর Tie ভাঙা"
              query={`SELECT title, guide_id FROM tours ORDER BY guide_id;

SELECT title, guide_id FROM tours ORDER BY guide_id NULLS FIRST;

SELECT title, guide_id FROM tours ORDER BY guide_id, tour_id;`}
              caption="প্রথম দুটোয় guide 1 এর দুটো ট্যুরের জায়গা বদল লক্ষ্য করুন। তৃতীয়টায় tour_id শেষ চাবি হিসেবে বসেছে। tour_id প্রতিটা ট্যুরের জন্য আলাদা, তাই কোনো দুই Row এর চাবি আর এক থাকে না, ক্রমও একটাই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা তাই এই: যেখানে ক্রম সত্যিই গুরুত্বপূর্ণ, সেখানে ORDER BY এর
                শেষে এমন একটা Column রাখুন যেটা প্রতিটা Row এর জন্য আলাদা। সাধারণত
                Primary Key, যেমন tour_id বা booking_id। এটাকে বলে Tie-breaker। এতে
                ক্রম Deterministic হয়, মানে একই Data তে বারবার চালালে হুবহু একই ক্রম।
              </ContentParagraph>
              <ContentParagraph>
                কোথায় এটা সবচেয়ে বেশি কামড়ায়? পাতায় পাতায় দেখানোয়, মানে Pagination এ।
                প্রথম পাতায় দশটা Booking, দ্বিতীয় পাতায় পরের দশটা। চাবি সমান হলে কোনো
                Booking দুই পাতাতেই দেখা দিতে পারে, আর কোনোটা কোনো পাতাতেই না। পরের
                লেসনে LIMIT আর OFFSET শেখার সময় এই সমস্যাটা আবার আসবে, তখন Tie-breaker
                এর মূল্য পুরোপুরি বুঝবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Tie-breaker চেনার সহজ প্রশ্ন",
          content: (
            <ContentParagraph>
              নিজেকে জিজ্ঞেস করুন: আমার ORDER BY এর সব Column মিলিয়ে কি দুটো Row হুবহু এক
              হতে পারে? হতে পারলে শেষে Primary Key যোগ করুন। দাম, তারিখ, শহর, রেটিং, এদের
              কোনোটাই একা অনন্য না। দুটো Booking একই সেকেন্ডেও হতে পারে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "text-collation",
      subHeader: { index: "010", title: "Text and Collation" },
      title: <SectionTitle>লেখা সাজানো: বড় হাত আগে, না ছোট হাত?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সংখ্যা সাজানোয় কোনো বিতর্ক নেই, ২ সবসময় ৯ এর আগে। কিন্তু লেখা? apple
                আগে না Apple আগে? এই প্রশ্নের উত্তর ঠিক করে একটা নিয়মের সেট, যার নাম
                Collation। Database তৈরির সময় একটা Collation বেছে নেওয়া হয়, আর সেই
                Database এর সব লেখা সাজানো সেটা মেনে চলে। Collation এর বিস্তারিত Module 09
                এ, এখানে শুধু যা আপনি চোখে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                এই পাতার Query Box এর PostgreSQL তৈরি হয়েছে C নামের Collation দিয়ে। C
                Collation অক্ষরের Code নম্বর ধরে সাজায়, আর সেই নম্বরে সব বড় হাতের অক্ষর
                ছোট হাতের অক্ষরের আগে। আপনার নিজের মেশিনের বা Docker এর PostgreSQL সাধারণত
                তৈরি হয় en_US.utf8 এর মতো ভাষাভিত্তিক Collation দিয়ে, যেটা মানুষের অভিধানের
                মতো সাজায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পাঁচটা শব্দ, এই বক্সের Collation"
              query={`SELECT datcollate
FROM pg_database
WHERE datname = current_database();

SELECT w
FROM (VALUES ('apple'), ('Banana'), ('cherry'), ('Apple'), ('banana')) AS t(w)
ORDER BY w;`}
              caption="এই বক্স বলবে C, আর ক্রম আসবে Apple, Banana, apple, banana, cherry: সব বড় হাত আগে। VALUES দিয়ে Query এর ভেতরেই একটা ছোট অস্থায়ী Table বানানো হয়েছে, এটা পরে বিস্তারিত শিখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই দুটো Query এই লেসনের জন্য PostgreSQL 18 এর Docker Container এর psql এ
                চালানো হয়েছে, যেটার Collation en_US.utf8। ফলাফল একদম আলাদা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql, postgres:18 container",
          code: `island_tours=# SELECT datcollate FROM pg_database WHERE datname = current_database();
 datcollate
------------
 en_US.utf8
(1 row)

island_tours=# SELECT w FROM (VALUES ('apple'), ('Banana'), ('cherry'), ('Apple'), ('banana')) AS t(w) ORDER BY w;
   w
--------
 apple
 Apple
 banana
 Banana
 cherry
(5 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কোনটা ঠিক? দুটোই, নিজের নিয়মে। শিক্ষা দুটো। প্রথমত, Query Box আর
                আপনার psql এ লেখার ক্রম আলাদা দেখলে ঘাবড়াবেন না, আগে Collation দেখুন।
                দ্বিতীয়ত, ক্রমটা যদি সব জায়গায় একই চাই, তাহলে সেটা Query তেই স্পষ্ট করে
                দিন। যেমন বড় ছোট হাত না মেনে সাজাতে ORDER BY lower(w), w, আর ঠিক C এর
                ক্রম চাইলে ORDER BY w COLLATE &quot;C&quot;।
              </ContentParagraph>
              <ContentParagraph>
                MySQL এর গল্প আরেকটু আলাদা। তার Default Collation বড় ছোট হাতকে সমান ধরে,
                তাই Banana আর banana সাজানোয় Tie। MySQL এর Docs বলে, শুধু বড় ছোট হাতে
                আলাদা মানগুলোর ক্রম অনির্দিষ্ট, আর হাত মেনে সাজাতে চাইলে ORDER BY BINARY
                col_name লিখতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বাংলা নাম সাজালে",
          content: (
            <ContentParagraph>
              ওই Container এ কক্সবাজার, খুলনা, চট্টগ্রাম, ঢাকা আর সিলেট সাজিয়ে দেখা
              হয়েছে, ক্রম এসেছে বাংলা বর্ণমালা মেনে, ঠিক এই ক্রমেই। PostgreSQL 18 এর
              Docker Image এ বাংলার জন্য আলাদা Collation ও আছে, bn-x-icu নামে, যেটা জটিল
              যুক্তাক্ষর আর কার চিহ্নের সাজানো ভাষার নিয়মে করে। বাংলা নামের বড় তালিকা
              সাজাতে হলে সেটা পরীক্ষা করে দেখার মতো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "dates-booleans",
      subHeader: { index: "011", title: "Dates, Booleans, Numbers as Text" },
      title: <SectionTitle>তারিখ, হ্যাঁ না, আর লেখা হয়ে থাকা সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তারিখ আর সময় সাজানো সহজ: পুরনো আগে ASC, নতুন আগে DESC। Admin Panel এ
                সবচেয়ে নতুন Booking উপরে দেখাতে ORDER BY booked_at DESC। হ্যাঁ না এর
                Column, মানে boolean, সাজালে false আগে আসে, তারপর true। তাই ORDER BY
                is_active দিলে বন্ধ ট্যুরটা উপরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন Booking আগে, বন্ধ ট্যুর আগে"
              query={`SELECT booking_id, booked_at, status
FROM bookings
ORDER BY booked_at DESC
LIMIT 5;

SELECT title, is_active
FROM tours
ORDER BY is_active, title;`}
              caption="প্রথমটায় সবচেয়ে নতুন Booking 24 (১৪ অক্টোবর 2026), তারপর 23, 22, 21, 20। দ্বিতীয়টায় Saint Martin Luxury Stay সবার উপরে, কারণ তার is_active হলো f, মানে false।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা ফাঁদ, যেটা প্রায় প্রতিটা Developer একবার না একবার ধরা খান: সংখ্যা
                যদি লেখা হিসেবে রাখা থাকে, সেটা সাজানো হয় লেখার নিয়মে। লেখার নিয়মে তুলনা
                হয় অক্ষরে অক্ষরে, বাম থেকে। &apos;10&apos; আর &apos;9&apos; এর প্রথম অক্ষর
                &apos;1&apos; আর &apos;9&apos;, আর &apos;1&apos; আগে আসে, তাই &apos;10&apos;
                আসে &apos;9&apos; এর আগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লেখা হয়ে থাকা সংখ্যা"
              query={`-- লেখা হিসেবে
SELECT w
FROM (VALUES ('10'), ('9'), ('100'), ('2')) AS t(w)
ORDER BY w;

-- সংখ্যায় বদলে
SELECT w
FROM (VALUES ('10'), ('9'), ('100'), ('2')) AS t(w)
ORDER BY w::int;`}
              caption="প্রথমটা 10, 100, 2, 9। দ্বিতীয়টা 2, 9, 10, 100। ::int মানে লেখাটাকে integer এ বদলে নেওয়া, Type বদলানো আসছে Module 04 এ। আসল সমাধান অবশ্য Table এই সংখ্যাকে সংখ্যা হিসেবে রাখা, সেটা Module 09 এ।"
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
                  অক্টোবর 2026 এ হওয়া Booking গুলো দেখান, মানে যাদের{" "}
                  <code className={CODE}>booked_at</code> 2026-10-01 বা তার পরে।
                  দেখান <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>status</code> আর{" "}
                  <code className={CODE}>booked_at</code>, সবচেয়ে নতুনটা আগে।
                </>
              }
              hint={
                <>
                  WHERE booked_at &gt;= &apos;2026-10-01&apos;, তারপর ORDER BY booked_at DESC।
                  ফলাফলে নয়টা Row আসার কথা।
                </>
              }
              solution={`SELECT booking_id, status, booked_at
FROM bookings
WHERE booked_at >= '2026-10-01'
ORDER BY booked_at DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "sort-lab",
      subHeader: { index: "012", title: "Sort Lab" },
      title: <SectionTitle>চাবি বদলে বদলে নিজে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Lab এ Island Tours এর নয়টা ট্যুর আছে। প্রথম চাবি, তার দিক, NULL এর
                জায়গা আর দ্বিতীয় চাবি বেছে নিন, নিচে সাথে সাথে Query টা তৈরি হবে আর Row গুলো
                নতুন জায়গায় সরে যাবে। লক্ষ্য রাখুন TIE লেখা Row গুলোর দিকে: সেগুলো আপনার
                ORDER BY এর চোখে পুরোপুরি সমান। এমন একটা দ্বিতীয় চাবি খুঁজুন যেটা সব TIE
                মুছে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SortLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কয়েকটা জিনিস চেষ্টা করে দেখুন। duration_days DESC দিলে তিনটা দলে Tie
                আসে, কারণ চারটা দৈর্ঘ্যের মধ্যে তিনটায় একাধিক ট্যুর। দ্বিতীয় চাবিতে
                price_bdt দিলে সব Tie চলে যায়, কারণ এই Data তে কোনো দুটো ট্যুরের দাম এক
                না। কিন্তু নতুন একটা ট্যুর যোগ হলে কাল সেটা আর সত্যি না-ও থাকতে পারে।
                tour_id এর বেলায় সেই ভয় নেই, কারণ সে চিরকাল অনন্য। guide_id বেছে NULL এর
                তিনটা বিকল্প চেপে দেখুন Ratargul কোথায় যায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it-yourself",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>Island Tours এর আসল তালিকাগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Website এর একটা আসল তালিকা বানানো যাক: সামনের মাসগুলোর Departure,
                যেগুলো &quot;শিগগির ভরে যাচ্ছে&quot; লেবেলে দেখানো হবে। যত কম সিট বাকি,
                তত উপরে। সিট সমান হলে যেটা আগে রওনা দেবে সেটা আগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শিগগির ভরে যাচ্ছে"
              query={`SELECT departure_id, starts_on, seats_left
FROM departures
WHERE starts_on >= '2026-11-01'
ORDER BY seats_left, starts_on;`}
              caption="নয়টা Departure আসে। প্রথম দুটোয় 10 টা করে সিট বাকি, তাই তারিখ ঠিক করে দিয়েছে কে আগে: ৮ জানুয়ারি 2027 এর Departure 13, তারপর ১৪ ফেব্রুয়ারির Departure 16। 12 সিটের দুটোর মধ্যেও একই ভাবে ২১ নভেম্বর আগে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আপনার পালা। নিচের Challenge এ দুটো চাবিই লাগবে, আর শর্তটা WHERE এ।
                মিলিয়ে নিতে চাইলে উপরের বক্সটা দেখুন, কিন্তু আগে নিজে লিখে চেষ্টা করুন।
              </ContentParagraph>
            </div>
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
                  2026-11-01 বা তার পরে রওনা দেওয়া সব Departure এর{" "}
                  <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>tour_id</code>,{" "}
                  <code className={CODE}>starts_on</code> আর{" "}
                  <code className={CODE}>seats_left</code> দেখান। সবচেয়ে বেশি সিট খালি
                  যেটায় সেটা আগে, কারণ Marketing সেগুলোতে ছাড় দিতে চায়। খালি সিট সমান
                  হলে যেটা আগে রওনা দেবে সেটা আগে।
                </>
              }
              hint={
                <>
                  বেশি আগে মানে seats_left DESC। তারপর কমা দিয়ে starts_on, সেটা ASC। তারিখের
                  শর্তটা WHERE এ।
                </>
              }
              solution={`SELECT departure_id, tour_id, starts_on, seats_left
FROM departures
WHERE starts_on >= '2026-11-01'
ORDER BY seats_left DESC, starts_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কোন তালিকা কীভাবে সাজানো</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর প্রতিটা তালিকার পেছনে একটা ORDER BY আছে, আর প্রতিটায় একটা
                Tie-breaker। নিচের টেবিলে তিনটা আসল জায়গা, আর তাদের Query তে ক্রমটা কেন
                এভাবে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কোথায়", "কী চাই", "ORDER BY", "Tie-breaker কেন"],
          rows: [
            ["Website এর ট্যুর তালিকা", "সস্তা আগে, শুধু চালু ট্যুর", "price_bdt, tour_id", "দুটো ট্যুরের দাম কোনোদিন এক হলেও তালিকা লাফাবে না"],
            ["Admin এর pending Booking", "সবচেয়ে পুরনোটা আগে সামলানো", "booked_at, booking_id", "একই সেকেন্ডে দুটো Booking হলেও একজনও হারাবে না"],
            ["Review দেখানো", "বেশি রেটিং আগে", "rating DESC, review_id", "রেটিং সমান হওয়াই স্বাভাবিক, দশটা Review এর চারটা 5 আর চারটা 4"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন তালিকার দুটো"
              query={`-- Website: চালু ট্যুর, সস্তা আগে
SELECT title, price_bdt, duration_days
FROM tours
WHERE is_active
ORDER BY price_bdt, tour_id;

-- Admin: pending Booking, পুরনো আগে
SELECT booking_id, customer_id, total_bdt, booked_at
FROM bookings
WHERE status = 'pending'
ORDER BY booked_at, booking_id;`}
              caption="প্রথম তালিকায় আটটা ট্যুর, বন্ধ Saint Martin Luxury Stay বাদ। দ্বিতীয় তালিকায় চারটা pending Booking, সবার আগে Booking 14 (১ অক্টোবর)। Admin কে আগে এটাই দেখতে হবে, কারণ এর Payment একবার ব্যর্থ হয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর API তে একটা নিয়ম লেখা আছে, যেটা আপনার নিজের কাজেও রাখতে
                পারেন: যে Endpoint তালিকা ফেরত দেয়, তার Query তে ORDER BY বাধ্যতামূলক, আর
                শেষ চাবি Primary Key। Code Review তে ORDER BY ছাড়া তালিকার Query দেখলেই
                প্রশ্ন ওঠে। ক্রমের কথা না বললে Website এর তালিকা একদিন নিঃশব্দে বদলে
                যাবে, আর কেন বদলাল তা খুঁজতে একটা পুরো দিন যাবে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা কথা মনে রাখুন, যেটা Module 13 এ খুলে বলা হবে: বড় Table এ ORDER BY
                এর একটা খরচ আছে, কারণ সব Row মেলাতে হয়। সাজানোর চাবিতে Index থাকলে
                PostgreSQL আগে থেকে সাজানো তালিকা ধরে পড়তে পারে, বিশেষ করে উপরের কয়েকটা
                Row দরকার হলে। তাই যে ক্রমে Website সবচেয়ে বেশি দেখায়, সেই চাবিগুলোই
                সাধারণত Index পায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>ORDER BY price_bdt DESC, tour_id এর ভেতরে কী ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Row গুলো খুঁজে বের করা",
              description:
                "FROM আর WHERE আগে চলে। শুধু যে Row গুলো শর্ত পেরিয়েছে, সাজানো হবে শুধু তাদের। বাদ পড়া Row নিয়ে ORDER BY মাথা ঘামায় না।",
            },
            {
              title: "SELECT এর মান তৈরি",
              description:
                "Column বাছাই, Expression এর হিসাব আর Alias এর নাম দেওয়া এখানে হয়। এই কারণেই ORDER BY পরে Alias চেনে।",
            },
            {
              title: "প্রতিটা Row এর চাবি বের করা",
              description:
                "প্রতিটা Row থেকে price_bdt আর tour_id এর মান নেওয়া হয়। চাবি Expression হলে তার হিসাবও এখানে।",
            },
            {
              title: "প্রথম চাবিতে তুলনা",
              description:
                "দুটো Row এর price_bdt তুলনা করা হয়, DESC বলে বড়টা আগে। NULL থাকলে নিয়ম মতো তার জায়গা, অথবা NULLS FIRST বা LAST মেনে। লেখা হলে Collation এর নিয়মে।",
            },
            {
              title: "সমান হলে পরের চাবি",
              description:
                "শুধু যাদের price_bdt সমান, তাদের মধ্যে tour_id তুলনা করা হয়, এটা ASC। শেষ চাবিতেও সমান হলে তাদের ক্রম অনির্দিষ্ট, তাই শেষ চাবি অনন্য হওয়া চাই।",
            },
            {
              title: "সাজানো তালিকা থেকে কাটা",
              description:
                "LIMIT বা OFFSET থাকলে এখন সাজানো তালিকার উপর থেকে কেটে নেওয়া হয়। আগে কেটে পরে সাজালে উত্তর ভুল হতো, তাই সাজানো আগে।",
            },
            {
              title: "ফলাফল ফেরত",
              description:
                "সাজানো Row গুলো এই ক্রমেই আপনার psql, GUI বা App এর কাছে যায়। এই ক্রমটাই একমাত্র ক্রম যার কথা Database দেয়।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            ["ORDER BY ছাড়া ক্রম ধরে নেওয়া", "Local এ গোছানো, Production এ একদিন এলোমেলো", "ক্রম দরকার হলে সবসময় ORDER BY"],
            ["ORDER BY a, b DESC লিখে ভাবা দুটোই DESC", "a থাকে ASC, শুধু b উল্টায়", "প্রতিটা চাবির পাশে তার দিক লিখুন"],
            ["Alias কে হিসাবের ভেতরে ব্যবহার", "column \"per_day\" does not exist", "পুরো Expression আবার লিখুন"],
            ["WHERE এ SELECT এর Alias", "একই Error, কারণ WHERE আগে চলে", "WHERE এ পুরো Expression"],
            ["ORDER BY 2 নিজের কোডে", "SELECT বদলালে সাজানো নিঃশব্দে বদলায়", "Column এর নাম বা Alias"],
            ["Tie-breaker না রাখা", "সমান চাবির Row এর ক্রম লাফায়, পাতায় Row হারায়", "শেষে Primary Key"],
            ["NULL এর জায়গা নিয়মের উপর ছাড়া", "PostgreSQL আর MySQL এ উল্টো ফল", "NULLS FIRST বা LAST, MySQL এ IS NULL কৌশল"],
            ["সংখ্যা লেখা হিসেবে রাখা", "'10' আসে '9' এর আগে", "সংখ্যার Column, নয়তো ::int"],
            ["MySQL এ NULLS LAST লেখা", "ERROR 1064, Syntax Error", "ORDER BY col IS NULL, col"],
            ["Database থেকে সব এনে App এ সাজানো", "লাখ Row Network দিয়ে আসে, Index কাজে লাগে না", "সাজানো Database এর কাজ, ORDER BY তেই"],
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
                <strong>Sorting Rows (ORDER BY)</strong>, PostgreSQL এর Docs এর পুরো
                অধ্যায়: অনির্দিষ্ট ক্রম, NULLS FIRST আর LAST এর নিয়ম, Alias একা দাঁড়ানোর
                শর্ত।{" "}
                <a href="https://www.postgresql.org/docs/current/queries-order.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/queries-order.html
                </a>
              </ListItem>
              <ListItem>
                <strong>SELECT, ORDER BY Clause</strong>, পুরো Syntax আর খুঁটিনাটি নিয়ম।{" "}
                <a href="https://www.postgresql.org/docs/current/sql-select.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/sql-select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Collation Support</strong>, লেখা সাজানোর নিয়ম কোথা থেকে আসে আর কীভাবে
                বদলাবেন।{" "}
                <a href="https://www.postgresql.org/docs/current/collation.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/collation.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4: Sorting Rows</strong>, DESC শুধু পাশের Column এর, বড় ছোট
                হাতে আলাদা মানের ক্রম অনির্দিষ্ট, ORDER BY BINARY।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/sorting-rows.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/sorting-rows.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4: Working with NULL Values</strong>, ASC তে NULL আগে আর DESC
                তে শেষে, MySQL এর নিজের ভাষায়।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/working-with-null.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/working-with-null.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনার MySQL কোর্সের ভিডিও</strong>, SELECT, WHERE, LIMIT আর ORDER BY এর
                অংশ (01:13:04 থেকে 01:29:12)। এটা MySQL এ শেখানো, তাই NULL এর জায়গা আর NULLS
                LAST এর পার্থক্য এই লেসন থেকে মিলিয়ে নিন।{" "}
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM" target="_blank" rel="noopener noreferrer" className={LINK}>
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
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>ORDER BY ছাড়া ক্রম অনির্দিষ্ট। Row বদলালেই সেটা বদলে যেতে পারে, যেমন নিজের চোখে দেখলেন।</ListItem>
                <ListItem>ASC নিজে থেকেই ধরা থাকে, উল্টো চাইলে DESC। সাজানোর Column SELECT এ না থাকলেও চলে।</ListItem>
                <ListItem>কয়েকটা চাবি দিলে প্রথমটা দল বানায়, পরেরগুলো দলের ভেতরে সাজায়। প্রতিটা চাবির দিক আলাদা।</ListItem>
                <ListItem>ORDER BY Expression আর Alias ধরে সাজাতে পারে, কিন্তু Alias একা দাঁড়ালে তবেই। ORDER BY 2 শুধু Terminal এ।</ListItem>
                <ListItem>ORDER BY চলে SELECT এর পরে, তাই Alias চেনে। WHERE চলে আগে, তাই চেনে না।</ListItem>
                <ListItem>PostgreSQL এ NULL সবচেয়ে বড়, ASC তে শেষে। MySQL এ উল্টো, আর সেখানে NULLS LAST লেখা যায় না।</ListItem>
                <ListItem>সমান চাবির Row এর ক্রম অনির্দিষ্ট। শেষে Primary Key রাখলে ক্রম Deterministic।</ListItem>
                <ListItem>লেখা সাজানো Collation মেনে চলে, তাই Query Box আর আপনার psql এ ক্রম আলাদা হতে পারে।</ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে এই সাজানো তালিকা থেকে উপরের কয়েকটা কেটে নেবেন, পাতায় পাতায়
                ভাগ করবেন, আর দেখবেন কেন Tie-breaker ছাড়া Pagination ভেঙে পড়ে:{" "}
                <Link href="/sql/topic/limit-pagination" className={LINK}>
                  LIMIT, OFFSET and Pagination
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
      ["ORDER BY ছাড়া", "ক্রম অনির্দিষ্ট, ভরসা করা যায় না", "UPDATE এর পরে Saint Martin নিচে"],
      ["ASC", "ছোট থেকে বড়, Default", "ORDER BY price_bdt"],
      ["DESC", "বড় থেকে ছোট", "ORDER BY booked_at DESC"],
      ["কয়েকটা চাবি", "প্রথমটা দল, পরেরটা দলের ভেতরে", "ORDER BY country, city, full_name"],
      ["দিক প্রতি চাবিতে", "DESC শুধু পাশের Column এর", "ORDER BY duration_days, price_bdt DESC"],
      ["Expression আর Alias", "Alias একা দাঁড়ালে চলে", "ORDER BY per_day, not per_day * 2"],
      ["অবস্থান নম্বর", "চলে, কিন্তু ভঙ্গুর", "ORDER BY 2"],
      ["NULL, PostgreSQL", "সবচেয়ে বড় ধরা হয়", "ASC তে শেষে, NULLS FIRST দিয়ে বদলানো"],
      ["NULL, MySQL", "সবচেয়ে ছোট ধরা হয়, NULLS LAST নেই", "ORDER BY col IS NULL, col"],
      ["Tie-breaker", "শেষে অনন্য Column, ক্রম স্থির", "ORDER BY guide_id, tour_id"],
      ["Collation", "লেখা সাজানোর নিয়ম, Database ভেদে আলাদা", "C: Apple আগে, en_US: apple আগে"],
      ["লেখা হয়ে থাকা সংখ্যা", "অক্ষর ধরে তুলনা", "'10' আসে '9' এর আগে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "রাফির Query তে ORDER BY নেই, আর এতদিন ট্যুরগুলো tour_id এর ক্রমে আসছিল। একটা ট্যুরের দাম বদলানোর পর ক্রম বদলে গেল। এর সবচেয়ে ভালো ব্যাখ্যা কোনটা?",
        options: [
          { key: "A", text: "PostgreSQL এ একটা Bug আছে", isCorrect: false, explanation: "Bug না। ORDER BY ছাড়া ক্রমের কোনো প্রতিশ্রুতিই ছিল না, তাই বদলানো নিয়মের মধ্যেই পড়ে।" },
          { key: "B", text: "ORDER BY ছাড়া ক্রম অনির্দিষ্ট, আর Row বদলালে তার নতুন Copy অন্য জায়গায় বসতে পারে", isCorrect: true, explanation: "ঠিক। Docs বলে সাজানো না চাইলে ক্রম অনির্দিষ্ট। Section 002 এর বক্সে UPDATE এর পরে Saint Martin নিচে নেমে গিয়েছিল।" },
          { key: "C", text: "দাম বদলালে PostgreSQL নিজে থেকেই দাম ধরে সাজায়", isCorrect: false, explanation: "PostgreSQL নিজে থেকে কোনো Column ধরে সাজায় না। বদলের পর ক্রম দামের ক্রমেও হয়নি, Row টা শুধু শেষে গেছে।" },
          { key: "D", text: "tour_id বদলে গেছে", isCorrect: false, explanation: "UPDATE শুধু price_bdt এ হয়েছিল, tour_id একই আছে। ক্রম বদলেছে Disk এ Row এর জায়গার জন্য।" },
        ],
      },
      {
        id: 2,
        text: "ORDER BY duration_days, price_bdt DESC লিখলে কী হয়?",
        options: [
          { key: "A", text: "দুটো চাবিই বড় থেকে ছোট", isCorrect: false, explanation: "DESC শুধু তার ঠিক আগের Column এর গায়ে লাগে। duration_days থাকে ASC।" },
          { key: "B", text: "duration_days ছোট থেকে বড়, আর একই দৈর্ঘ্যের ভেতরে দামি আগে", isCorrect: true, explanation: "ঠিক। প্রতিটা চাবির দিক আলাদা। PostgreSQL আর MySQL দুজনের Docs ই এটা বলে।" },
          { key: "C", text: "Syntax Error, কারণ DESC শেষে বসে না", isCorrect: false, explanation: "এটা পুরোপুরি বৈধ Query, Section 004 এর বক্সে চলেছে।" },
          { key: "D", text: "duration_days বড় থেকে ছোট, দাম ছোট থেকে বড়", isCorrect: false, explanation: "উল্টো বললেন। DESC কেবল price_bdt এর।" },
        ],
      },
      {
        id: 3,
        text: "PostgreSQL এ ORDER BY guide_id লিখলে Guide ছাড়া Ratargul Swamp Boat Day কোথায় বসে?",
        options: [
          { key: "A", text: "সবার উপরে", isCorrect: false, explanation: "এটা MySQL এর আচরণ। PostgreSQL NULL কে সবচেয়ে বড় ধরে।" },
          { key: "B", text: "সবার নিচে", isCorrect: true, explanation: "ঠিক। NULL সবচেয়ে বড়, তাই ASC তে নিচে। উপরে আনতে NULLS FIRST।" },
          { key: "C", text: "ফলাফলে আসেই না", isCorrect: false, explanation: "ORDER BY কোনো Row বাদ দেয় না, শুধু সাজায়। বাদ দেওয়া WHERE এর কাজ।" },
          { key: "D", text: "guide 1 এর পাশে", isCorrect: false, explanation: "NULL কে কোনো সংখ্যার মতো ধরা হয় না, তার জায়গা একদম শুরুতে বা শেষে।" },
        ],
      },
      {
        id: 4,
        text: "MySQL ভিডিও দেখে আপনি MySQL এ লিখলেন ORDER BY guide_id NULLS LAST। কী হবে, আর কী লেখা উচিত ছিল?",
        options: [
          { key: "A", text: "চলবে, PostgreSQL এর মতোই", isCorrect: false, explanation: "MySQL 8.4 এ এটা ERROR 1064, Syntax Error। লেসনের Container এ চালিয়ে দেখা।" },
          { key: "B", text: "Syntax Error। লেখা উচিত ORDER BY guide_id IS NULL, guide_id", isCorrect: true, explanation: "ঠিক। guide_id IS NULL মান থাকলে 0, না থাকলে 1, তাই NULL শেষে যায়।" },
          { key: "C", text: "চলবে, কিন্তু NULL উপরে থাকবে", isCorrect: false, explanation: "চলবেই না, MySQL এই Syntax চেনে না।" },
          { key: "D", text: "Syntax Error। লেখা উচিত ORDER BY guide_id DESC", isCorrect: false, explanation: "DESC দিলে NULL শেষে যায় ঠিকই, কিন্তু বাকিরাও উল্টে যায়, যেটা চাওয়া হয়নি।" },
        ],
      },
      {
        id: 5,
        text: "SELECT title, round(price_bdt / duration_days) AS per_day FROM tours ORDER BY per_day * 2; চালালে কী হয়?",
        options: [
          { key: "A", text: "per_day এর দ্বিগুণ ধরে সাজানো ফলাফল", isCorrect: false, explanation: "ORDER BY তে Alias শুধু একা দাঁড়ালে চলে, Expression এর ভেতরে না।" },
          { key: "B", text: "ERROR: column \"per_day\" does not exist", isCorrect: true, explanation: "ঠিক। Docs এর ভাষায় Output Column এর নাম একা দাঁড়াতে হয়। পুরো Expression আবার লিখুন।" },
          { key: "C", text: "ফলাফল আসে, কিন্তু সাজানো ছাড়া", isCorrect: false, explanation: "Error হলে কোনো ফলাফলই আসে না।" },
          { key: "D", text: "ERROR: syntax error at or near \"*\"", isCorrect: false, explanation: "Syntax ঠিক আছে। সমস্যা হলো per_day নামটা ওই জায়গায় খোঁজা হয় Table এর Column হিসেবে, আর সেটা নেই।" },
        ],
      },
      {
        id: 6,
        text: "Admin Panel এর Booking তালিকা ORDER BY booked_at দিয়ে পাতায় পাতায় দেখানো হয়। মাঝে মাঝে একটা Booking দুই পাতায় দেখা যায়। সবচেয়ে ভালো সমাধান?",
        options: [
          { key: "A", text: "ORDER BY booked_at, booking_id", isCorrect: true, explanation: "ঠিক। একই সময়ের Booking এ Tie হয়, আর Tie এর ক্রম অনির্দিষ্ট। Primary Key শেষে দিলে ক্রম স্থির।" },
          { key: "B", text: "ORDER BY booked_at DESC", isCorrect: false, explanation: "দিক বদলালে Tie মোছে না, সমান সময়ের Row এখনো সমান।" },
          { key: "C", text: "ORDER BY ছাড়া চালানো", isCorrect: false, explanation: "তাহলে ক্রম পুরোপুরিই অনির্দিষ্ট, সমস্যা আরও বাড়বে।" },
          { key: "D", text: "ORDER BY 1", isCorrect: false, explanation: "অবস্থান নম্বর শুধু Column বদলায়, Tie ভাঙে না।" },
        ],
      },
      {
        id: 7,
        text: "একটা Column এ Version নম্বর লেখা হিসেবে রাখা: '10', '9', '100', '2'। ORDER BY version দিলে ক্রম কী?",
        options: [
          { key: "A", text: "2, 9, 10, 100", isCorrect: false, explanation: "এটা সংখ্যার ক্রম। লেখা হলে তুলনা হয় অক্ষরে অক্ষরে।" },
          { key: "B", text: "10, 100, 2, 9", isCorrect: true, explanation: "ঠিক। প্রথম অক্ষর 1, 1, 2, 9 ধরে সাজানো। সংখ্যার ক্রম চাইলে ::int অথবা সংখ্যার Column।" },
          { key: "C", text: "100, 10, 9, 2", isCorrect: false, explanation: "এটা সংখ্যার উল্টো ক্রম, এখানে DESC নেই।" },
          { key: "D", text: "Error, কারণ লেখা সাজানো যায় না", isCorrect: false, explanation: "লেখা সাজানো যায়, Collation এর নিয়মে।" },
        ],
      },
      {
        id: 8,
        text: "একই Query Query Box এ দিল Apple, Banana, apple, banana, cherry, আর আপনার Docker এর psql এ দিল apple, Apple, banana, Banana, cherry। কেন?",
        options: [
          { key: "A", text: "দুই জায়গার PostgreSQL এর Version আলাদা", isCorrect: false, explanation: "Version না, Database তৈরির সময় বেছে নেওয়া Collation আলাদা: Query Box এ C, Docker এ en_US.utf8।" },
          { key: "B", text: "দুই Database এর Collation আলাদা", isCorrect: true, explanation: "ঠিক। C অক্ষরের Code ধরে সাজায়, তাই বড় হাত আগে। en_US অভিধানের মতো সাজায়।" },
          { key: "C", text: "Query Box এ ORDER BY কাজ করে না", isCorrect: false, explanation: "কাজ করে, শুধু নিয়ম আলাদা। দুটো ফলাফলই নিজের নিয়মে সাজানো।" },
          { key: "D", text: "psql নিজে থেকে বড় ছোট হাত মিলিয়ে দেয়", isCorrect: false, explanation: "psql শুধু দেখায়। সাজানো হয় Server এ, Collation মেনে।" },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর তিনটা তালিকা",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>ট্যুরের তালিকার তিন বিকল্প:</strong> Website এ সাজানোর তিনটা বোতাম আছে:
        দাম কম থেকে বেশি, দাম বেশি থেকে কম, আর ছোট ট্যুর আগে। শুধু চালু ট্যুর নিয়ে
        তিনটার জন্য তিনটা Query লিখুন, প্রতিটায় Tie-breaker সহ।
      </span>,
      <span key="2">
        <strong>Admin এর দুই দৃশ্য:</strong> একটা Query তে শুধু pending Booking, সবচেয়ে
        পুরনো আগে। আরেকটায় সব Booking, আগে status এর বর্ণমালা ক্রমে, আর একই status এর
        ভেতরে সবচেয়ে নতুন আগে।
      </span>,
      <span key="3">
        <strong>NULL দুই ভাষায়:</strong> Customer দের ফোন নম্বর ধরে ছোট থেকে বড় সাজান,
        যাঁদের নম্বর নেই তাঁরা শেষে। PostgreSQL এর জন্য একটা আর MySQL এর জন্য একটা
        Query লিখুন। MySQL চালু থাকলে (Module 02, Lesson 02) সেখানে চালিয়ে দেখুন।
      </span>,
      <span key="4">
        <strong>Tie শিকার:</strong> reviews Table এ ORDER BY rating DESC চালান। কোন কোন Row
        এ Tie, লিখে রাখুন। তারপর এমন একটা Tie-breaker যোগ করুন যাতে ক্রম স্থির হয়, আর
        প্রমাণ দিন যে এখন কোনো দুই Row এর চাবি এক না।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> এক বন্ধু বলছেন, আমার Table তো সবসময়
        id এর ক্রমেই আসে, ORDER BY কেন লিখব? তাঁকে ছয় লাইনে বোঝান, আর Section 002 এর
        UPDATE এর পরীক্ষাটা প্রমাণ হিসেবে দিন।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা ট্যুর তালিকার Query আর তাদের প্রথম তিনটা Row</span>,
      <span key="d2">Admin এর দুটো Query আর তাদের Row এর সংখ্যা</span>,
      <span key="d3">PostgreSQL আর MySQL এর NULL Query, পাশাপাশি</span>,
      <span key="d4">reviews এর Tie এর তালিকা আর Tie-breaker সহ Query</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "ORDER BY Drill",
    subtitle: "নিজের island_tours এ, psql দিয়ে, প্রতিটার Row সংখ্যা মিলিয়ে",
    stepName: "DRILL",
    steps: [
      {
        title: "Database এ ঢুকুন",
        description:
          "Module 02 এ Load করা island_tours এ psql দিয়ে Connect করুন: psql -d island_tours। Docker এ চালালে docker exec -it island-pg psql -U postgres -d island_tours।",
      },
      {
        title: "ASC আর DESC",
        description:
          "প্রথম ফাইলের দুটো Query চালান। দুটোতেই ৯টা Row, একটা আরেকটার উল্টো। শেষের মন্তব্যে লেখা Row সংখ্যার সাথে মিলিয়ে নিন।",
      },
      {
        title: "কয়েকটা চাবি আর দিক",
        description:
          "দ্বিতীয় ফাইল চালিয়ে দেখুন দেশ, শহর, নাম ধরে ১৫ জন কীভাবে সাজায়। তারপর নিজে ORDER BY country DESC, city লিখে দেখুন কোন অংশটা উল্টায়।",
      },
      {
        title: "NULL এর জায়গা",
        description:
          "তৃতীয় ফাইলে Ratargul কে উপরে আনুন, আর ফোনহীন পাঁচজনকে নিচে পাঠান। দ্বিতীয় Query তে NULLS LAST মুছে আবার চালান, তফাতটা লিখে রাখুন।",
      },
      {
        title: "Tie আর Tie-breaker",
        description:
          "চতুর্থ আর পঞ্চম ফাইল চালান। দিনপ্রতি দামে Ratargul আর Bandarban সমান, 3500। duration_days এর Tie-breaker কে আগে রাখছে, সেটা দেখুন।",
      },
      {
        title: "Collation নিজের চোখে",
        description:
          "ষষ্ঠ ফাইল চালিয়ে দেখুন আপনার Database কোন Collation এ তৈরি, আর apple, Apple এর ক্রম Query Box এর সাথে মেলে কিনা। psql এ booked_at এর সময় +00 এ দেখালে আপনার Server UTC তে চলছে, ক্রমে তাতে কোনো তফাত হয় না।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-asc-desc.sql",
        code: `SELECT title, price_bdt FROM tours ORDER BY price_bdt;
-- (9 rows), Ratargul Swamp Boat Day প্রথমে

SELECT title, price_bdt FROM tours ORDER BY price_bdt DESC;
-- (9 rows), Saint Martin Luxury Stay প্রথমে`,
      },
      {
        language: "sql",
        filename: "02-several-keys.sql",
        code: `SELECT full_name, city, country
FROM customers
ORDER BY country, city, full_name;
-- (15 rows), Kamal Hasan প্রথমে, Oliver Bennett শেষে`,
      },
      {
        language: "sql",
        filename: "03-nulls.sql",
        code: `SELECT title, guide_id FROM tours ORDER BY guide_id NULLS FIRST, title;
-- (9 rows), Ratargul Swamp Boat Day প্রথমে

SELECT full_name, phone FROM customers ORDER BY phone DESC NULLS LAST, full_name;
-- (15 rows), শেষের পাঁচজনের phone ফাঁকা`,
      },
      {
        language: "sql",
        filename: "04-ties.sql",
        code: `SELECT tour_id, title, duration_days
FROM tours
ORDER BY duration_days DESC, tour_id;
-- (9 rows), 4 দিনের দুটো আগে: tour_id 5, তারপর 8`,
      },
      {
        language: "sql",
        filename: "05-per-day.sql",
        code: `SELECT title, duration_days,
       round(price_bdt / duration_days) AS per_day
FROM tours
ORDER BY per_day, duration_days;
-- (9 rows), Ratargul (1 দিন, 3500) তারপর Bandarban (4 দিন, 3500)`,
      },
      {
        language: "sql",
        filename: "06-collation.sql",
        code: `SELECT datcollate FROM pg_database WHERE datname = current_database();
-- postgres:18 Docker Image এ: en_US.utf8 (1 row)

SELECT w
FROM (VALUES ('apple'), ('Banana'), ('cherry'), ('Apple'), ('banana')) AS t(w)
ORDER BY w;
-- en_US.utf8 এ: apple, Apple, banana, Banana, cherry (5 rows)

SELECT booking_id, customer_id, total_bdt, booked_at
FROM bookings
WHERE status = 'pending'
ORDER BY booked_at, booking_id;
-- (4 rows), Booking 14 প্রথমে`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Drill এর পরে নিজেকে একটা প্রশ্ন করুন: এই ORDER BY এ কি কোনো Tie থাকতে
        পারে? পারলে শেষে Primary Key যোগ করে আবার চালান। অভ্যাসটা এখন গড়ে নিলে
        Pagination এর লেসনে একটা বড় Bug আপনাকে আর ছুঁতেই পারবে না।
      </ContentParagraph>
    ),
  },
};
