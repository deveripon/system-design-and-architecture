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
  PivotStepLab,
  PivotToolLab,
} from "../../../components/course/topics/windows/pivot-animations";
import {
  CrosstabFormsSplit,
  FilterGatesDiagram,
  LongVsWideSplit,
  ModuleEightStoryDiagram,
  UnpivotDiagram,
} from "../../../components/course/topics/windows/pivot-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/** The month by status grid every section of this lesson starts from. */
const STATUS_GRID = `SELECT to_char(booked_at, 'YYYY-MM')                  AS month,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       count(*)                                     AS total
FROM bookings
GROUP BY 1
ORDER BY 1;`;

export const pivotingContent: TopicData = {
  id: "pivoting",
  introduction: {
    badge: "MODULE 08 · LESSON 07",
    title: <SectionTitle>Row থেকে Column: Pivot</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের ছয়টা লেসনে আপনি Row না হারিয়ে হিসাব করতে শিখেছেন। প্রতিটা Booking এর পাশে পুরো Table এর গড়, দলের
          ভেতরে তার র‍্যাংক, মাসের চলমান যোগফল, আগের Booking এর সাথে পার্থক্য, প্রতিটা দলের সেরা কয়েকটা। প্রতিবার ফলাফলটা
          ছিল লম্বা: অনেক Row, প্রতিটা Row এ একটা জিনিসের কথা।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু মানুষ যখন একটা Report পড়েন, প্রায়ই তিনি লম্বা তালিকা চান না, চান একটা ছক। বাঁ দিকে নিচে নিচে মাস, উপরে
          পাশাপাশি confirmed, pending আর cancelled, আর প্রতিটা ঘরে একটা সংখ্যা। খাতায় হিসাব রাখা যে কেউ এভাবেই ভাবেন। এই
          আকার বদলের নাম Pivot: একটা Column এর মানগুলো তুলে নিয়ে Column এর নাম বানানো।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Long আর Wide আকারের পার্থক্য, FILTER আর CASE দিয়ে Pivot কীভাবে লেখে, টাকার ঘরে NULL
          কেন আসে আর মোটের Row কীভাবে যোগ করে, খালি মাস কীভাবে ছকে রাখে, Pivot করা ফলাফলের উপর Window Function কীভাবে
          চলে, PostgreSQL এর crosstab আর তার এক বিপজ্জনক ফাঁদ, psql এর \crosstabview, Column আগে থেকে না জানলে কী করবেন, আর
          উল্টো পথে Wide থেকে Long কীভাবে ফেরত যায়। শেষে পুরো Module 08 এর সব হাতিয়ার একটা Report এ জুড়ে মডিউলটা গুছিয়ে
          নেবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কোনো সংখ্যা বদলাই না, নতুন কিছু গুনিও না। আমি শুধু একটা Column এর মানগুলো তুলে উপরে নাম হিসেবে বসাই, আর প্রতিটা সংখ্যাকে তার ঠিক ঘরে।",
      author: "PIVOT",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>মালিকের খাতার মতো একটা ছক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, ১ নভেম্বর 2026। শীতের মৌসুম শুরু, আর Island Tours এর মালিক রুমানা আপা গত এক বছরের একটা ছবি চান। ফারুক
                সাহেব বৈঠকে তাঁর কথাটা জানালেন: প্রতি মাসে কয়টা Booking confirmed হয়েছে, কয়টা এখনো pending, আর কয়টা বাতিল।
                রুমানা আপা বহু বছর খাতায় হিসাব রেখেছেন, তাই তিনি যোগ করলেন, এমনভাবে দিন যাতে এক নজরে জানুয়ারি আর অক্টোবর পাশাপাশি
                মেলানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                কাজটা পেলেন তানিম। Module 05 থেকে তিনি GROUP BY জানেন, তাই দুটো Column ধরে দল বানালেন: মাস আর অবস্থা। নিচের
                বক্সে তাঁর Query। চালিয়ে দেখুন ফলাফলটা কেমন দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: লম্বা ফলাফল"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       status,
       count(*) AS bookings
FROM bookings
GROUP BY 1, 2
ORDER BY 1, 2;`}
              caption="৯টা Row। প্রতিটা Row এ একটা মাস, একটা অবস্থা আর একটা সংখ্যা। উত্তরটা পুরোপুরি ঠিক, ২৪টা Booking সবই আছে। কিন্তু জানুয়ারির ছবি পেতে চোখকে দুটো Row এ যেতে হয় (cancelled 2, confirmed 4), আর ডিসেম্বরে pending এর কোনো Row নেই বলে বোঝাই যায় না সেটা শূন্য, নাকি কেউ ভুলে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিম ফলাফলটা Excel এ নিয়ে হাতে সাজানোর কথা ভাবলেন। কিন্তু ফারুক সাহেব বললেন, এই Report প্রতি মাসে লাগবে, আর
                Admin Panel এ সরাসরি দেখাতে হবে। হাতে সাজানোর জায়গা নেই। Database কেই ছকটা বানাতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                তানিমের সমস্যাটা আসলে একটা আকারের সমস্যা, হিসাবের না। সংখ্যাগুলো ঠিক আছে, শুধু সেগুলো ভুল আকারে সাজানো। স্কুলের
                হাজিরা খাতার কথা ভাবুন। একজন শিক্ষক প্রতিদিন একটা কাগজে লেখেন: তারিখ, রোল, উপস্থিত না অনুপস্থিত। মাস শেষে প্রধান
                শিক্ষক সেই কাগজগুলো চান না। তিনি চান একটা ছক, বাঁ দিকে রোল, উপরে মাসের তারিখগুলো, আর প্রতিটা ঘরে একটা দাগ। কাগজ
                থেকে ছকে যাওয়ার এই কাজটাই Pivot।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Pivot মানে আকার বদল, হিসাব বদল না",
          content: (
            <ContentParagraph>
              Pivot করলে কোনো নতুন সংখ্যা আসে না, কোনো সংখ্যা হারায়ও না। একটা Column এর ভেতরের মানগুলো (এখানে confirmed,
              pending, cancelled) উঠে গিয়ে Column এর নাম হয়, আর বাকি সংখ্যাগুলো সেই নামের নিচে নিজের ঘরে বসে। লম্বা তালিকা
              চওড়া ছক হয়ে যায়, এই পর্যন্তই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "long-and-wide",
      subHeader: { index: "002", title: "Long and Wide" },
      title: <SectionTitle>লম্বা আকার, চওড়া আকার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই তথ্য দুই আকারে রাখা যায়। এদের দুটো নাম আছে, যেগুলো Data নিয়ে কাজ করা সবাই ব্যবহার করেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Long আকার</strong>: প্রতিটা মাপের জন্য একটা Row। কোন জিনিস মাপা হচ্ছে, সেটা একটা Column এর মান। তানিমের
                  ফলাফলে <code className={CODE}>status</code> Column বলে দেয় সংখ্যাটা কীসের। নতুন একটা অবস্থা এলে শুধু নতুন Row
                  আসে।
                </ListItem>
                <ListItem>
                  <strong>Wide আকার</strong>: প্রতিটা জিনিসের জন্য একটা Row, আর প্রতিটা মাপের জন্য একটা Column। কোন জিনিস মাপা
                  হচ্ছে, সেটা Column এর নাম। নতুন একটা অবস্থা এলে নতুন Column লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LongVsWideSplit />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "Long আকার", "Wide আকার"],
          rows: [
            ["একটা Row মানে", "একটা মাস আর একটা অবস্থার জোড়া", "একটা মাস, সব অবস্থা সহ"],
            ["কোনটা মাপা হচ্ছে", "একটা Column এর মান (status)", "Column এর নাম (confirmed, pending …)"],
            ["নতুন অবস্থা এলে", "শুধু নতুন Row, Query একই থাকে", "নতুন Column, Query বদলাতে হয়"],
            ["খালি ঘর", "Row টাই থাকে না", "ঘর থাকে, ভেতরে 0 বা NULL"],
            ["কে পছন্দ করে", "Database, GROUP BY, Chart Tool", "মানুষ, মালিকের Report, Spreadsheet"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database নিজে প্রায় সবসময় Long আকারে রাখে, আর কারণটা Module 11 এর Database Design এ বিস্তারিত আসবে। সংক্ষেপে,{" "}
                <code className={CODE}>bookings</code> Table এ <code className={CODE}>confirmed_count</code> বা{" "}
                <code className={CODE}>pending_count</code> নামে Column নেই, আছে একটা <code className={CODE}>status</code> Column।
                কাল Island Tours যদি waitlisted নামে নতুন অবস্থা চালু করে, Table বদলাতে হবে না, শুধু নতুন মান আসবে।
              </ContentParagraph>
              <ContentParagraph>
                তাই Pivot সাধারণত একটা Query তে, শেষ ধাপে হয়: Data Long আকারে থাকে, আর পড়ার ঠিক আগে চওড়া করা হয়। এই লেসনের
                বেশিরভাগ অংশ এই শেষ ধাপটা নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "pivot-with-filter",
      subHeader: { index: "003", title: "Pivot with FILTER" },
      title: <SectionTitle>প্রতিটা Column এর জন্য একটা ছাঁকনি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Pivot লেখার জন্য নতুন কিছু শিখতে হবে না। Module 05 এর{" "}
                <Link href="/sql/topic/conditional-aggregation" className={LINK}>
                  Conditional Aggregation
                </Link>{" "}
                লেসনে আপনি এক পাসে কয়েকটা জিনিস গোনা শিখেছেন, <code className={CODE}>FILTER (WHERE …)</code> দিয়ে। Pivot আসলে
                সেই একই কৌশল, শুধু ভাবনাটা একটু ঘোরানো: প্রতিটা Wide Column একটা করে Aggregate, আর প্রতিটা Aggregate এর নিজস্ব
                ছাঁকনি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Row কী হবে</strong>, সেটা ঠিক করে GROUP BY। এখানে মাস, তাই প্রতিটা মাস একটা Row।
                </ListItem>
                <ListItem>
                  <strong>Column কী হবে</strong>, সেটা ঠিক করেন আপনি, প্রতিটা অবস্থার জন্য একটা করে Aggregate লিখে।
                </ListItem>
                <ListItem>
                  <strong>ঘরে কী বসবে</strong>, সেটা ঠিক করে Aggregate টা: গুনলে <code className={CODE}>count(*)</code>, টাকা হলে{" "}
                  <code className={CODE}>sum(total_bdt)</code>।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FilterGatesDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাস বনাম অবস্থা, FILTER দিয়ে"
              query={STATUS_GRID}
              caption="৬টা Row, প্রতিটা মাস একবার। জানুয়ারি এখন এক Row এ: confirmed 4, pending 0, cancelled 2, মোট 6। ডিসেম্বরের pending ঘরে 0, কারণ count(*) কিছু না পেলে শূন্য দেয়। শেষের total Column টা ছাঁকনি ছাড়া count(*), যেটা প্রতিটা Row এ পাশের তিনটার যোগফলের সমান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Query টা ধাপে ধাপে পড়ুন, Module 03 এর চলার ক্রম মেনে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>FROM bookings</strong>: ২৪টা Booking।
                </ListItem>
                <ListItem>
                  <strong>GROUP BY 1</strong>: মাস ধরে ৬টা দল। জানুয়ারির দলে ছয়টা Row।
                </ListItem>
                <ListItem>
                  <strong>SELECT</strong>: প্রতিটা দলের জন্য চারটা Aggregate চলে। confirmed এর ছাঁকনি দলের ছয়টা Row থেকে শুধু চারটা
                  confirmed নেয়, cancelled এর ছাঁকনি দুটো, আর pending এর ছাঁকনি কাউকেই না।
                </ListItem>
                <ListItem>
                  <strong>ORDER BY 1</strong>: মাস ধরে সাজানো, যাতে ছকটা ক্যালেন্ডারের মতো পড়া যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                খেয়াল করুন, একটা দল একবারই পড়া হয়। তিনটা আলাদা Query চালিয়ে তিনটা ফলাফল জোড়া দিতে হয়নি। এই কারণেই এক পাসের
                Pivot বড় Table এও দ্রুত।
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
                  <code className={CODE}>payments</code> Table থেকে প্রতিটা Payment পদ্ধতির (method) একটা Row বানান, চারটা Column
                  এই ক্রমে: <code className={CODE}>method</code>, তারপর paid, refunded আর failed অবস্থার Payment কয়টা। method এর
                  নাম ধরে সাজান।
                </>
              }
              hint={
                <>
                  Row ঠিক করে <code className={CODE}>GROUP BY method</code>। প্রতিটা অবস্থার জন্য একটা{" "}
                  <code className={CODE}>count(*) FILTER (WHERE status = …)</code>।
                </>
              }
              solution={`SELECT method,
       count(*) FILTER (WHERE status = 'paid')     AS paid,
       count(*) FILTER (WHERE status = 'refunded') AS refunded,
       count(*) FILTER (WHERE status = 'failed')   AS failed
FROM payments
GROUP BY method
ORDER BY method;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "pivot-with-case",
      subHeader: { index: "004", title: "Pivot with CASE" },
      title: <SectionTitle>যে Pivot সব Database এ চলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER লেখা সহজ, কিন্তু সব Database এ নেই। MySQL এ নেই (এই লেসনের MySQL Section এ আসল Error টা দেখবেন), আরও কিছু Database এও নেই। তাই একই Pivot এর
                আরেকটা রূপ জানা দরকার, যেটা প্রায় যেকোনো SQL Database এ চলে: Aggregate এর ভেতরে একটা CASE।
              </ContentParagraph>
              <ContentParagraph>
                ভাবনাটা এমন। প্রতিটা Row এর জন্য CASE একটা ছোট প্রশ্ন করে: এই Row কি confirmed? হ্যাঁ হলে 1, না হলে 0। তারপর{" "}
                <code className={CODE}>sum</code> সেই 1 আর 0 গুলো যোগ করে। যোগফলটাই confirmed Row এর সংখ্যা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই ছক, CASE দিয়ে"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
       sum(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,
       sum(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM bookings
GROUP BY 1
ORDER BY 1;

-- আরেকটা রূপ: ELSE না দিলে CASE NULL দেয়, আর count NULL গোনে না
SELECT to_char(booked_at, 'YYYY-MM') AS month,
       count(CASE WHEN status = 'confirmed' THEN 1 END) AS confirmed,
       count(CASE WHEN status = 'pending'   THEN 1 END) AS pending,
       count(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled
FROM bookings
GROUP BY 1
ORDER BY 1;`}
              caption="দুটো ফলাফলই আগের FILTER এর ছকের সাথে হুবহু মেলে: ৬টা Row, জানুয়ারি 4, 0, 2, অক্টোবর 5, 4, 0। প্রথমটায় sum যোগ করে 1 আর 0, দ্বিতীয়টায় count গোনে শুধু যেসব Row এ CASE একটা মান দিয়েছে, কারণ ELSE না থাকায় বাকিগুলোয় NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখার ধরন", "কোথায় চলে", "পড়তে কেমন"],
          rows: [
            ["count(*) FILTER (WHERE …)", "PostgreSQL, SQLite এর নতুন Version, আরও কিছু", "সবচেয়ে পরিষ্কার"],
            ["sum(CASE WHEN … THEN 1 ELSE 0 END)", "প্রায় সব SQL Database", "একটু লম্বা, কিন্তু সবাই চেনে"],
            ["count(CASE WHEN … THEN 1 END)", "প্রায় সব SQL Database", "ELSE এর অভাবটা বুঝতে হয়"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোনটা বেছে নেবেন",
          content: (
            <ContentParagraph>
              শুধু PostgreSQL এর জন্য লিখলে FILTER, কারণ উদ্দেশ্যটা পড়লেই বোঝা যায়। একই Query অন্য Database এও চালাতে হলে, বা এমন
              Tool দিয়ে পাঠাতে হলে যেটা FILTER চেনে না, sum(CASE …)। দুটো একই উত্তর দেয়, আর দুটোই এক পাসে চলে।
            </ContentParagraph>
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
                  <code className={CODE}>departures</code> Table থেকে প্রতিটা <code className={CODE}>tour_id</code> এর একটা Row
                  বানান, আর তিনটা Column এ গুনুন নভেম্বর 2026, ডিসেম্বর 2026 আর জানুয়ারি 2027 এ সেই ট্যুরের কয়টা Departure শুরু
                  হয়। Column গুলো এই ক্রমে: <code className={CODE}>tour_id</code>, nov, dec, jan। এবার FILTER না,{" "}
                  <code className={CODE}>sum(CASE …)</code> দিয়ে লিখুন। tour_id ধরে সাজান।
                </>
              }
              hint={
                <>
                  মাস ধরার জন্য অর্ধেক খোলা সীমা নিরাপদ:{" "}
                  <code className={CODE}>starts_on &gt;= DATE &apos;2026-11-01&apos; AND starts_on &lt; DATE &apos;2026-12-01&apos;</code>
                  । CASE সত্য হলে 1, নইলে 0।
                </>
              }
              solution={`SELECT tour_id,
       sum(CASE WHEN starts_on >= DATE '2026-11-01' AND starts_on < DATE '2026-12-01' THEN 1 ELSE 0 END) AS nov,
       sum(CASE WHEN starts_on >= DATE '2026-12-01' AND starts_on < DATE '2027-01-01' THEN 1 ELSE 0 END) AS dec,
       sum(CASE WHEN starts_on >= DATE '2027-01-01' AND starts_on < DATE '2027-02-01' THEN 1 ELSE 0 END) AS jan
FROM departures
GROUP BY tour_id
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "watch-it-pivot",
      subHeader: { index: "005", title: "Watch It Pivot" },
      title: <SectionTitle>একটা একটা করে Booking, ছক ভরে ওঠে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ ২৪টা আসল Booking একটা একটা করে আসে, যে ক্রমে সেগুলো বুক হয়েছিল। প্রতিটা Booking তার মাসের Row আর তার
              অবস্থার Column এ গিয়ে বসে। খেয়াল করুন একটা নতুন মাসের Row কখন আসে: সেই মাসের প্রথম Booking এর সাথে, তার আগে না।
              GROUP BY ঠিক এভাবেই দল বানায়, যেসব দলের অন্তত একটা Row আছে শুধু সেগুলোই। গোনা থেকে টাকায় বদলে দেখুন, আর খালি মাসসহ
              চালু করে দেখুন পরের একটা Section এর কৌশল ছকটাকে কীভাবে বদলায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PivotStepLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "money-and-totals",
      subHeader: { index: "006", title: "Money and Totals" },
      title: <SectionTitle>টাকার ঘর, ফাঁকা ঘর, আর মোটের Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              রুমানা আপা গোনার ছক দেখে খুশি, তারপর জানতে চাইলেন টাকার হিসাবটাও একই রকম দেওয়া যায় কিনা। তানিম{" "}
              <code className={CODE}>count(*)</code> এর জায়গায় <code className={CODE}>sum(total_bdt)</code> বসালেন। ফলাফলটা
              দেখুন, বিশেষ করে ফাঁকা ঘরগুলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="টাকার ছক, প্রথম চেষ্টা"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_bdt,
       sum(total_bdt) FILTER (WHERE status = 'pending')   AS pending_bdt,
       sum(total_bdt) FILTER (WHERE status = 'cancelled') AS cancelled_bdt
FROM bookings
GROUP BY 1
ORDER BY 1;`}
              caption="ডিসেম্বরের pending আর cancelled এর ঘরে NULL, শূন্য না। কারণ sum কিছু না পেলে NULL দেয়, count এর মতো 0 দেয় না। Module 05 এ এই পার্থক্যটা দেখেছিলেন। মালিকের Report এ ফাঁকা ঘর দেখলে কেউ ভাববেন হিসাবটা বাকি রয়ে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান Module 04 এর <code className={CODE}>coalesce</code>, যেটা NULL এর জায়গায় আপনার দেওয়া একটা মান বসায়, এখানে
                0.00। শুধু 0 না লিখে 0.00 লেখার কারণ একটাই, যাতে শূন্যটাও বাকি টাকার মতো দুই দশমিক নিয়ে ছাপা হয়।
              </ContentParagraph>
              <ContentParagraph>
                আর মালিকের খাতায় নিচে সবসময় একটা মোটের Row থাকে। Module 05 এর{" "}
                <Link href="/sql/topic/rollup-cube" className={LINK}>
                  ROLLUP
                </Link>{" "}
                ঠিক এই কাজটাই করে: সব দলের পরে একটা বাড়তি Row, যেখানে মাসের ঘরে NULL আর প্রতিটা Column এর মোট। সেই NULL কে{" "}
                <code className={CODE}>coalesce</code> দিয়ে Total লেখা যায়, আর <code className={CODE}>grouping()</code> দিয়ে
                মোটের Row টাকে শেষে পাঠানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="টাকার ছক, শূন্য আর মোটসহ"
              query={`SELECT coalesce(to_char(booked_at, 'YYYY-MM'), 'Total')                    AS month,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'confirmed'), 0.00) AS confirmed_bdt,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'pending'), 0.00)   AS pending_bdt,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'cancelled'), 0.00) AS cancelled_bdt,
       sum(total_bdt)                                                     AS all_bdt
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'))
ORDER BY grouping(to_char(booked_at, 'YYYY-MM')), 1;`}
              caption="৭টা Row: ছয়টা মাস আর শেষে Total। ফাঁকা ঘরে এখন 0.00। Total Row এ confirmed 423600.00, pending 117200.00, cancelled 51500.00, আর সব মিলিয়ে 592300.00। ডান দিক থেকে যোগ করুন, আর নিচ থেকে যোগ করুন: দুই দিকেই মেলে, যেমন একটা ভালো খাতায় মেলা উচিত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "count এর শূন্য, sum এর NULL",
          content: (
            <ContentParagraph>
              কিছু না পেলে <code className={CODE}>count</code> দেয় 0, আর <code className={CODE}>sum</code>,{" "}
              <code className={CODE}>avg</code>, <code className={CODE}>max</code> দেয় NULL। Pivot করা ছকে এটা সবচেয়ে বেশি চোখে
              পড়ে, কারণ সেখানে প্রায় সবসময় কিছু খালি ঘর থাকে। টাকার Pivot লিখলেই সাথে সাথে coalesce এর কথা ভাবুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "pivot-after-join",
      subHeader: { index: "007", title: "Pivot After a Join" },
      title: <SectionTitle>যেকোনো দুটো জিনিস, যেকোনো Join এর পরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাস আর অবস্থা শুধু একটা উদাহরণ। Row হিসেবে যেকোনো জিনিস নেওয়া যায়, আর Column হিসেবে আরেকটা জিনিসের কয়েকটা মান।
                দুটো যদি আলাদা Table এ থাকে, আগে Module 06 এর Join, তারপর একই Pivot। Join এর পরে Pivot সাধারণ GROUP BY এর মতোই,
                কারণ Join এর ফলাফলও শেষ পর্যন্ত একটা Table।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেবের পরের প্রশ্ন: কোন অঞ্চলের ট্যুরে কোন অবস্থার Booking কতগুলো? অঞ্চল থাকে{" "}
                <code className={CODE}>destinations</code> এ, অবস্থা <code className={CODE}>bookings</code> এ, আর মাঝে{" "}
                <code className={CODE}>departures</code> আর <code className={CODE}>tours</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অঞ্চল বনাম অবস্থা"
              query={`SELECT ds.region,
       count(*) FILTER (WHERE b.status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE b.status = 'pending')   AS pending,
       count(*) FILTER (WHERE b.status = 'cancelled') AS cancelled,
       count(*)                                       AS total
FROM bookings b
JOIN departures d    ON d.departure_id = b.departure_id
JOIN tours t         ON t.tour_id = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
GROUP BY ds.region
ORDER BY ds.region;`}
              caption="৩টা Row। Chattogram: 12 confirmed, 1 pending, 3 cancelled, মোট 16। Khulna: 3, 1, 0। Sylhet: 2, 2, 0। মোট মিলিয়ে 24, সব Booking। Barishal নেই, কারণ Kuakata তে কোনো ট্যুর নেই, তাই Join এ তার কোনো Row আসেনি। Barishal কে শূন্যসহ রাখতে চাইলে destinations থেকে শুরু করে LEFT JOIN লাগত, ঠিক Module 06 এর মতো।"
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
                  প্রতিটা ট্যুরের নামের (<code className={CODE}>title</code>) একটা Row বানান, যেসব ট্যুরে অন্তত একটা Review আছে।
                  চারটা সংখ্যার Column, এই ক্রমে: rating 5 কয়টা (five), 4 কয়টা (four), 3 কয়টা (three), আর 2 বা তার কম কয়টা
                  (low)। title ধরে সাজান।
                </>
              }
              hint={
                <>
                  Review থেকে ট্যুরে যেতে তিনটা Join: reviews থেকে bookings, তারপর departures, তারপর tours। শেষেরটার জন্য{" "}
                  <code className={CODE}>rating &lt;= 2</code>।
                </>
              }
              solution={`SELECT t.title,
       count(*) FILTER (WHERE r.rating = 5)  AS five,
       count(*) FILTER (WHERE r.rating = 4)  AS four,
       count(*) FILTER (WHERE r.rating = 3)  AS three,
       count(*) FILTER (WHERE r.rating <= 2) AS low
FROM reviews r
JOIN bookings b   ON b.booking_id = r.booking_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
GROUP BY t.title
ORDER BY t.title;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "empty-months",
      subHeader: { index: "008", title: "Empty Months" },
      title: <SectionTitle>যে মাসে কিছুই হয়নি, সেটাও ছকে থাকুক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাসের ছকটা আবার দেখুন: ডিসেম্বর, জানুয়ারি, ফেব্রুয়ারি, মার্চ, তারপর সোজা সেপ্টেম্বর। এপ্রিল থেকে আগস্ট উধাও।
                ভুল কিছু হয়নি, ওই পাঁচ মাসে কেউ বুক করেননি, তাই GROUP BY ওই মাসগুলোর কোনো দলই বানায়নি। কিন্তু রুমানা আপা ছক দেখে
                জিজ্ঞেস করলেন, মে মাসের হিসাব কোথায়? খালি মাসটাও খাতায় একটা লাইন পায়, শূন্য লেখা।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটা Module 06 এর{" "}
                <Link href="/sql/topic/cross-join" className={LINK}>
                  CROSS JOIN
                </Link>{" "}
                লেসনের Report Grid এর মতো। আগে <code className={CODE}>generate_series</code> দিয়ে সব মাসের একটা তালিকা বানাই,
                তারপর তার সাথে Booking গুলো LEFT JOIN করি। যে মাসে কোনো Booking নেই, সেই মাসও থাকে, শুধু Booking এর দিকে NULL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সব মাস, খালিগুলো সহ"
              query={`SELECT to_char(m, 'YYYY-MM') AS month,
       count(b.booking_id) FILTER (WHERE b.status = 'confirmed') AS confirmed,
       count(b.booking_id) FILTER (WHERE b.status = 'pending')   AS pending,
       count(b.booking_id) FILTER (WHERE b.status = 'cancelled') AS cancelled
FROM generate_series(DATE '2025-12-01', DATE '2026-10-01', INTERVAL '1 month') AS m
LEFT JOIN bookings b ON date_trunc('month', b.booked_at) = m
GROUP BY m
ORDER BY m;`}
              caption="১১টা Row, ডিসেম্বর 2025 থেকে অক্টোবর 2026 পর্যন্ত প্রতিটা মাস। এপ্রিল থেকে আগস্টের পাঁচটা Row এ তিনটা ঘরই 0। এখানে count(*) না, count(b.booking_id): খালি মাসেও LEFT JOIN একটা Row রাখে, যার booking_id NULL, আর count(*) সেই Row কেও গুনত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "LEFT JOIN এর পরে count(*) না",
          content: (
            <ContentParagraph>
              Module 06 এর সেই ফাঁদ এখানে আবার আসে। খালি মাসের জন্য LEFT JOIN একটা Row রাখে, Booking এর সব Column NULL সহ।{" "}
              <code className={CODE}>count(*)</code> সেই Row টাকেও গোনে, তাই খালি মাসে মোট 1 দেখাত। গুনতে হবে Booking এর দিকের
              এমন একটা Column, যেটা আসল Booking এ কখনো NULL না, যেমন <code className={CODE}>b.booking_id</code>।
            </ContentParagraph>
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
                  ডিসেম্বর 2025 থেকে অক্টোবর 2026 পর্যন্ত প্রতিটা মাসের একটা Row, দুটো Column: মাস{" "}
                  <code className={CODE}>YYYY-MM</code> আকারে, আর সেই মাসের confirmed Booking এর মোট টাকা। কোনো confirmed Booking না
                  থাকলে টাকার ঘরে শূন্য। মাস ধরে সাজান।
                </>
              }
              hint={
                <>
                  উপরের বক্সের কাঠামো, শুধু count এর বদলে{" "}
                  <code className={CODE}>coalesce(sum(b.total_bdt) FILTER (WHERE …), 0.00)</code>।
                </>
              }
              solution={`SELECT to_char(m, 'YYYY-MM') AS month,
       coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0.00) AS confirmed_bdt
FROM generate_series(DATE '2025-12-01', DATE '2026-10-01', INTERVAL '1 month') AS m
LEFT JOIN bookings b ON date_trunc('month', b.booked_at) = m
GROUP BY m
ORDER BY m;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "windows-over-a-pivot",
      subHeader: { index: "009", title: "Windows Over a Pivot" },
      title: <SectionTitle>ছকের উপর Window Function</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Pivot করা ফলাফল একটা সাধারণ ফলাফল, তাই এই মডিউলের সব হাতিয়ার তার উপর চলে। Lesson 01 এ দেখেছেন, Window Function
                চলে GROUP BY এর পরে। মানে মাসের Row গুলো তৈরি হয়ে যাওয়ার পরে, প্রতিটা মাসের Row এর পাশে পুরো ছকের হিসাব বসানো যায়:
                মোটের কত ভাগ এই মাসের, এই মাস পর্যন্ত চলমান যোগফল, আর আয়ের দিক থেকে মাসটার র‍্যাংক।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query তে ছকটা আগে একটা CTE তে বানানো, তারপর তার উপর তিনটা Window। আলাদা করে লেখায় পড়তে সুবিধা হয়, যদিও একই
                SELECT এ সরাসরিও লেখা যেত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ছক, ভাগ, চলমান যোগফল আর র‍্যাংক"
              query={`WITH grid AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month,
         coalesce(sum(total_bdt) FILTER (WHERE status = 'confirmed'), 0.00) AS confirmed_bdt
  FROM bookings
  GROUP BY 1
)
SELECT month,
       confirmed_bdt,
       round(100.0 * confirmed_bdt / sum(confirmed_bdt) OVER (), 1) AS share_pct,
       sum(confirmed_bdt) OVER (ORDER BY month)                    AS running_bdt,
       rank() OVER (ORDER BY confirmed_bdt DESC)                   AS revenue_rank
FROM grid
ORDER BY month;`}
              caption="৬টা Row। অক্টোবর একাই মোটের 30.6 ভাগ আর র‍্যাংক 1, জানুয়ারি 21.7 ভাগ আর র‍্যাংক 2, ফেব্রুয়ারি মাত্র 4.5 ভাগ আর র‍্যাংক 6। চলমান যোগফল 75000.00 থেকে শুরু হয়ে অক্টোবরে 423600.00 এ পৌঁছায়, যা confirmed এর মোট। share_pct এর ছয়টা সংখ্যা যোগ করলে 100।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখানে একটা সূক্ষ্ম জিনিস খেয়াল করুন। চলমান যোগফল মার্চ থেকে সরাসরি সেপ্টেম্বরে যায়, কারণ এই ছকে মাঝের মাসগুলো নেই। Lesson
              05 এর LAG দিয়ে আগের মাসের সাথে তুলনা করলেও সেপ্টেম্বরের আগের মাস হত মার্চ, আগস্ট না। মাসভিত্তিক তুলনায় তাই আগে
              আগের Section এর মতো সব মাসের ছক বানিয়ে নেওয়া নিরাপদ, তারপর Window।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "crosstab",
      subHeader: { index: "010", title: "crosstab()" },
      title: <SectionTitle>PostgreSQL এর নিজস্ব Pivot, আর তার ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER আর CASE দিয়ে প্রতিটা Column হাতে লিখতে হয়। PostgreSQL এর সাথে একটা ঐচ্ছিক Extension আসে,{" "}
                <code className={CODE}>tablefunc</code>, যার <code className={CODE}>crosstab()</code> Function টা Long আকারের
                ফলাফল নিয়ে নিজেই ছক বানায়। Extension মানে PostgreSQL এর সাথে আসা একটা বাড়তি অংশ, যেটা একটা Database এ একবার{" "}
                <code className={CODE}>CREATE EXTENSION</code> দিয়ে চালু করতে হয়। PostgreSQL এর Docs অনুযায়ী tablefunc একটা trusted
                Extension, তাই Database এ CREATE অনুমতি থাকলে Superuser না হয়েও চালু করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমে এই পাতার বক্সে চেষ্টা করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="crosstab, এই পাতাতেই"
              query={`CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT *
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, count(*)::int
    FROM bookings
    GROUP BY 1, 2
    ORDER BY 1, 2$$,
  $$VALUES ('confirmed'), ('pending'), ('cancelled')$$
) AS ct(month text, confirmed int, pending int, cancelled int);`}
              caption="এই পাতার Browser এর PostgreSQL এ tablefunc Extension রাখা আছে, তবে আসল Server এর মতোই আগে CREATE EXTENSION চালাতে হয়। প্রথম Statement সেটাই করে, দ্বিতীয়টা দুই Argument এর crosstab। ফলাফল ছয়টা মাস, জানুয়ারিতে 4টা confirmed আর 2টা cancelled, অক্টোবরে 5টা confirmed আর 4টা pending, খালি ঘর NULL। নিচের psql এর লেখা ঠিক এই ফলাফলটাই দেখায়, যাতে নিজের PostgreSQL এ চালিয়ে মিলিয়ে নিতে পারেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                crosstab এর দুই Argument এর রূপটা নিরাপদ, তাই সেটা আগে। তিনটা অংশ মনে রাখুন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Source Query</strong>: ঠিক তিনটা Column, এই ক্রমে: Row এর নাম (মাস), Category (অবস্থা), আর মান (সংখ্যা)।
                  শেষে <code className={CODE}>ORDER BY 1, 2</code>, যাতে একই মাসের Row গুলো পাশাপাশি আসে।
                </ListItem>
                <ListItem>
                  <strong>Category Query</strong>: যে Category গুলো Column হবে, যে ক্রমে। এখানে তিনটা অবস্থার নাম।
                </ListItem>
                <ListItem>
                  <strong>Column এর তালিকা</strong>: <code className={CODE}>AS ct(month text, confirmed int, …)</code>। crosstab
                  আগে থেকে জানে না কয়টা Column আসবে, তাই নাম আর Type আপনাকে লিখে দিতে হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Query গুলো Dollar Quote (<code className={CODE}>$$ … $$</code>) এর ভেতরে, কারণ crosstab Query টাকে একটা লেখা হিসেবে
                নেয়। Dollar Quote এর ভেতরে Single Quote দুইবার লিখতে হয় না, তাই পড়া সহজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: crosstab, দুই Argument",
          code: `CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT *
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, count(*)::int
    FROM bookings
    GROUP BY 1, 2
    ORDER BY 1, 2$$,
  $$VALUES ('confirmed'), ('pending'), ('cancelled')$$
) AS ct(month text, confirmed int, pending int, cancelled int);

--   month  | confirmed | pending | cancelled
-- ---------+-----------+---------+-----------
--  2025-12 |         2 |         |
--  2026-01 |         4 |         |         2
--  2026-02 |         1 |         |
--  2026-03 |         3 |         |
--  2026-09 |         2 |         |         1
--  2026-10 |         5 |       4 |
-- (6 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সংখ্যাগুলো FILTER এর ছকের সাথে মেলে, একটা পার্থক্য ছাড়া: খালি ঘরে 0 না, ফাঁকা, মানে NULL। crosstab কোনো Row না পেলে
                ঘরটা NULL রেখে দেয়। শূন্য চাইলে বাইরের SELECT এ <code className={CODE}>coalesce(pending, 0)</code> লিখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার এক Argument এর রূপ, যেটা অনেক পুরনো উদাহরণে দেখবেন। Category Query নেই, শুধু Source।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: crosstab, এক Argument (ফাঁদ)",
          code: `SELECT *
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, count(*)::int
    FROM bookings
    GROUP BY 1, 2
    ORDER BY 1, 2$$
) AS ct(month text, c1 int, c2 int, c3 int);

--   month  | c1 | c2 | c3
-- ---------+----+----+----
--  2025-12 |  2 |    |
--  2026-01 |  2 |  4 |
--  2026-02 |  1 |    |
--  2026-03 |  3 |    |
--  2026-09 |  1 |  2 |
--  2026-10 |  5 |  4 |
-- (6 rows)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CrosstabFormsSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                জানুয়ারির Row টা দেখুন: c1 এ 2, c2 এ 4। কেউ c1 কে confirmed ভেবে পড়লে বলবেন জানুয়ারিতে 2টা confirmed, অথচ আসলে
                4টা। কারণটা PostgreSQL এর Docs এ সরাসরি লেখা আছে: এক Argument এর crosstab প্রতিটা Row এর নামের দল থেকে মানগুলো
                বাঁ দিক থেকে ডানে পরপর ঢেলে দেয়, Category এর নাম একদম দেখে না। জানুয়ারিতে অক্ষর ক্রমে cancelled আগে আসে, তাই তার
                2 বসে প্রথম ঘরে। অক্টোবরে cancelled নেই, তাই সেখানে প্রথম ঘরে confirmed এর 5।
              </ContentParagraph>
              <ContentParagraph>
                একই Column, আলাদা Row এ আলাদা মানে। কোনো Error নেই, কোনো সতর্কবার্তা নেই, ছকটা দেখতে নিখুঁত। এই ধরনের নিঃশব্দ ভুলই
                সবচেয়ে বিপজ্জনক। Docs নিজেও বলে, কিছু দলে কিছু Category না থাকতে পারলে দুই Argument এর রূপ ব্যবহার করতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: আরও দুটো জিনিস যা ঘটে",
          code: `-- Column এর তালিকা না দিলে
SELECT * FROM crosstab($$SELECT 'a', 'b', 1$$);
-- ERROR:  a column definition list is required for functions returning "record"
-- LINE 1: SELECT * FROM crosstab($$SELECT 'a', 'b', 1$$);
--                       ^

-- টাকার ছক, খালি ঘরে 0 বাইরের coalesce দিয়ে
SELECT month,
       coalesce(confirmed, 0) AS confirmed,
       coalesce(pending, 0)   AS pending,
       coalesce(cancelled, 0) AS cancelled
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, sum(total_bdt)
    FROM bookings GROUP BY 1, 2 ORDER BY 1, 2$$,
  $$VALUES ('confirmed'), ('pending'), ('cancelled')$$
) AS ct(month text, confirmed numeric, pending numeric, cancelled numeric);

--   month  | confirmed |  pending  | cancelled
-- ---------+-----------+-----------+-----------
--  2025-12 |  75000.00 |         0 |         0
--  2026-01 |  92000.00 |         0 |  42000.00
--  2026-02 |  19000.00 |         0 |         0
--  2026-03 |  57600.00 |         0 |         0
--  2026-09 |  50500.00 |         0 |   9500.00
--  2026-10 | 129500.00 | 117200.00 |         0
-- (6 rows)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "crosstab লিখলে দুই Argument, সবসময়",
          content: (
            <ContentParagraph>
              এক Argument এর crosstab তখনই ঠিক উত্তর দেয়, যখন প্রতিটা দলে প্রতিটা Category ঠিক একবার থাকে। বাস্তব Data তে এমন
              প্রায় কখনো হয় না: কোনো মাসে বাতিল নেই, কোনো ট্যুরে Review নেই। দুই Argument এর রূপে Category গুলো নাম ধরে বসে, তাই সেটাই
              লিখুন। আর সত্যি বলতে, বেশিরভাগ কাজে FILTER এর Pivot crosstab এর চেয়ে সহজ: কোনো Extension লাগে না, Column এর তালিকা
              আলাদা করে লিখতে হয় না, আর অন্য Database এ নিতে হলে CASE এ বদলানো সহজ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "dynamic-pivots",
      subHeader: { index: "011", title: "Dynamic Pivots" },
      title: <SectionTitle>Column যদি আগে থেকে জানা না থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এ পর্যন্ত প্রতিটা Pivot এ Column গুলোর নাম Query তে লেখা ছিল: confirmed, pending, cancelled। ধরুন আগামী মাসে
                Island Tours একটা নতুন অবস্থা চালু করল, waitlisted। Long আকারের Query কিছু না বদলেই নতুন Row দেখাবে। কিন্তু Pivot এর
                Query তে waitlisted এর কোনো Column নেই, তাই সেই Booking গুলো ছকে কোথাও দেখা যাবে না। শুধু total Column এ সংখ্যাটা
                বাকিগুলোর যোগফলের চেয়ে বড় হয়ে যাবে।
              </ContentParagraph>
              <ContentParagraph>
                কেন SQL নিজে থেকে নতুন Column বানিয়ে নেয় না? কারণ PostgreSQL একটা Query চালানোর আগেই তার ফলাফলের আকার জেনে নেয়:
                কয়টা Column, কী নাম, কী Type। এই আকার Data এর উপর নির্ভর করতে পারে না, কারণ Data দেখার আগেই Plan তৈরি হয়। তাই
                SQL এ &ldquo;যত অবস্থা আছে তত Column&rdquo; লেখার কোনো উপায় নেই। এটাকে বলে Dynamic Pivot, আর এর তিনটা বাস্তব সমাধান আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>App এর Code এ Query বানানো</strong>: আগে <code className={CODE}>SELECT DISTINCT status</code> চালিয়ে
                  অবস্থাগুলোর তালিকা আনা, তারপর সেই তালিকা থেকে Pivot এর Query টা লেখা। তালিকার মান Query তে বসানোর সময় সাবধান
                  থাকতে হয়, কারণ ভুলভাবে বসালে সেটা SQL Injection এর দরজা খোলে। এই বিপদটা Module 16 এ বিস্তারিত।
                </ListItem>
                <ListItem>
                  <strong>psql এর \crosstabview</strong>: শুধু চোখে দেখার জন্য, নিচে দেখানো আছে।
                </ListItem>
                <ListItem>
                  <strong>একটা JSON Column</strong>: সব Column এর বদলে প্রতিটা Row এ একটা JSON, যার ভেতরে যত খুশি চাবি। Chart বা
                  App এর Code সেটা খুলে নিজের মতো Column বানায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা JSON Column এ সব অবস্থা"
              query={`WITH long AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month, status, count(*) AS n
  FROM bookings
  GROUP BY 1, 2
)
SELECT month, jsonb_object_agg(status, n) AS counts
FROM long
GROUP BY month
ORDER BY month;`}
              caption="৬টা Row, প্রতিটায় একটা JSON। জানুয়ারিতে দুটো চাবি, cancelled 2 আর confirmed 4, অক্টোবরে pending 4 আর confirmed 5। যে অবস্থা সেই মাসে নেই, তার চাবিই নেই। waitlisted চালু হলে Query না বদলেই নতুন চাবিটা চলে আসবে। চাবির ক্রম নিয়ে মাথা ঘামাবেন না, jsonb নিজের নিয়মে চাবি সাজায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার psql এর কৌশল। Module 02 এর{" "}
                <Link href="/sql/topic/psql-basics" className={LINK}>
                  psql Basics
                </Link>{" "}
                লেসনে Meta-command দেখেছেন, Backslash দিয়ে শুরু হওয়া psql এর নিজের Command। <code className={CODE}>{"\\crosstabview"}</code>{" "}
                তাদের একটা। সাধারণ Long Query টা লিখে শেষে Semicolon এর বদলে এটা দিলে psql ফলাফলটা নিজেই ছক বানিয়ে দেখায়: প্রথম
                Column নিচে নিচে, দ্বিতীয় Column উপরে, তৃতীয়টা ঘরে। কোন কোন Column হবে, সেটা Data দেখেই ঠিক করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: \\crosstabview",
          code: `SELECT to_char(booked_at, 'YYYY-MM') AS month, status, count(*)
FROM bookings
GROUP BY 1, 2
ORDER BY 1, 2
\\crosstabview month status count

--   month  | confirmed | cancelled | pending
-- ---------+-----------+-----------+---------
--  2025-12 |         2 |           |
--  2026-01 |         4 |         2 |
--  2026-02 |         1 |           |
--  2026-03 |         3 |           |
--  2026-09 |         2 |         1 |
--  2026-10 |         5 |           |       4
-- (6 rows)

-- Column এর ক্রম নিজে ঠিক করতে চাইলে চতুর্থ একটা সংখ্যার Column
SELECT to_char(booked_at, 'YYYY-MM') AS month, status, count(*) AS n,
       CASE status WHEN 'confirmed' THEN 1 WHEN 'pending' THEN 2 ELSE 3 END AS col_order
FROM bookings
GROUP BY 1, 2
ORDER BY 1
\\crosstabview month status n col_order
-- উপরে confirmed | pending | cancelled ক্রমে আসে

-- একই ঘরে দুটো মান পড়লে
SELECT to_char(booked_at, 'YYYY-MM') AS month, status, total_bdt FROM bookings ORDER BY 1
\\crosstabview month status total_bdt
-- \\crosstabview: query result contains multiple data values for row "2025-12", column "confirmed"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম ফলাফলে Column এর ক্রম confirmed, cancelled, pending, অক্ষর ক্রম বা আপনার পছন্দের ক্রম না। psql এর Docs অনুযায়ী
                উপরের নামগুলো ফলাফলে যে ক্রমে প্রথম দেখা দেয় সেই ক্রমে বসে: ডিসেম্বরে প্রথম confirmed, জানুয়ারিতে প্রথম cancelled,
                অক্টোবরে প্রথম pending। ক্রম নিজে ঠিক করতে চাইলে চতুর্থ একটা পূর্ণসংখ্যার Column দেওয়া যায়, দ্বিতীয় Query র মতো। আর
                একটা ঘরে দুটো মান পড়লে psql ছক বানাতে অস্বীকার করে, তাই আগে GROUP BY দিয়ে প্রতিটা জোড়ার একটাই মান বানাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                মনে রাখার কথা: <code className={CODE}>{"\\crosstabview"}</code> SQL না, psql এর পর্দায় দেখানোর একটা কৌশল। Server
                তখনও লম্বা ফলাফলটাই পাঠায়, psql সেটা সাজিয়ে দেখায়। আপনার App, BI Tool বা অন্য কোনো Client এই ছক পায় না। নিজে চোখ
                বুলিয়ে দেখার জন্য দারুণ, Report বানানোর জন্য না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PivotToolLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "unpivot",
      subHeader: { index: "012", title: "Unpivot" },
      title: <SectionTitle>উল্টো পথ: চওড়া থেকে লম্বা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখনো উল্টো কাজটা লাগে। কেউ একটা Spreadsheet পাঠিয়েছেন যেখানে প্রতিটা মাস একটা Row আর প্রতিটা অবস্থা একটা Column, আর
                আপনার Chart Tool চায় Long আকার: একটা Column এ অবস্থার নাম, আরেকটায় সংখ্যা। চওড়া থেকে লম্বায় ফেরার নাম Unpivot।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এ এর সবচেয়ে পরিষ্কার উপায় Module 06 এর{" "}
                <Link href="/sql/topic/lateral-join" className={LINK}>
                  LATERAL
                </Link>{" "}
                দিয়ে। প্রতিটা চওড়া Row এর জন্য LATERAL এর ভেতরে একটা ছোট VALUES তালিকা লিখি, যার প্রতিটা Row একটা Column থেকে আসে:
                অবস্থার নাম আর সেই Column এর মান। এক Row থেকে তিনটা Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <UnpivotDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Unpivot, LATERAL আর VALUES দিয়ে"
              query={`WITH wide AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month,
         count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
         count(*) FILTER (WHERE status = 'pending')   AS pending,
         count(*) FILTER (WHERE status = 'cancelled') AS cancelled
  FROM bookings
  GROUP BY 1
)
SELECT w.month, v.status, v.n
FROM wide w
CROSS JOIN LATERAL (VALUES ('confirmed', w.confirmed),
                           ('pending',   w.pending),
                           ('cancelled', w.cancelled)) AS v(status, n)
ORDER BY w.month, v.status;`}
              caption="১৮টা Row: ছয়টা মাস গুণ তিনটা অবস্থা। শূন্যের Row গুলোও আছে, যেমন ডিসেম্বরের pending 0। শেষে WHERE v.n > 0 যোগ করে আবার চালান: ৯টা Row থাকে, ঠিক সেই ৯টা যা এই লেসনের প্রথম বক্সে GROUP BY দিয়েছিল। Pivot আর Unpivot একে অপরকে উল্টে দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই কাজ <code className={CODE}>unnest</code> দিয়েও হয়, যেটা Module 15 এর Array লেসনে বিস্তারিত আসবে। দুটো Array
              পাশাপাশি দিলে unnest সেগুলোকে জোড়ায় জোড়ায় Row বানায়: প্রথম Array থেকে নাম, দ্বিতীয়টা থেকে মান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Unpivot, unnest দিয়ে"
              query={`WITH wide AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month,
         count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
         count(*) FILTER (WHERE status = 'pending')   AS pending,
         count(*) FILTER (WHERE status = 'cancelled') AS cancelled
  FROM bookings
  GROUP BY 1
)
SELECT w.month, u.status, u.n
FROM wide w
CROSS JOIN LATERAL unnest(ARRAY['confirmed', 'pending', 'cancelled'],
                          ARRAY[w.confirmed, w.pending, w.cancelled]) AS u(status, n)
WHERE u.n > 0
ORDER BY w.month, u.status;`}
              caption="৯টা Row, শূন্যগুলো WHERE দিয়ে বাদ। নামের Array আর মানের Array এর ক্রম মিলতে হবে: প্রথম নামের সাথে প্রথম মান। একটা ক্রম ভুল হলে Error আসে না, শুধু নামগুলো ভুল সংখ্যার পাশে বসে। VALUES এর রূপে প্রতিটা নাম আর মান এক লাইনে থাকে বলে এই ভুলটা চোখে পড়া সহজ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`WITH wide AS (
  SELECT method,
         count(*) FILTER (WHERE status = 'paid')     AS paid,
         count(*) FILTER (WHERE status = 'refunded') AS refunded,
         count(*) FILTER (WHERE status = 'failed')   AS failed
  FROM payments
  GROUP BY method
)
SELECT *
FROM wide;`}
              task={
                <>
                  বক্সে দেওয়া <code className={CODE}>wide</code> CTE টা Payment এর চওড়া ছক, প্রতিটা method এর একটা Row। শেষের SELECT
                  বদলে এটাকে Long আকারে ফেরত নিন: তিনটা Column, <code className={CODE}>method</code>, <code className={CODE}>status</code>{" "}
                  আর <code className={CODE}>n</code>, শুধু যেসব জোড়ায় n শূন্যের বেশি। method তারপর status ধরে সাজান।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CROSS JOIN LATERAL (VALUES (&apos;paid&apos;, w.paid), …) AS v(status, n)</code>, তারপর{" "}
                  <code className={CODE}>WHERE v.n &gt; 0</code>।
                </>
              }
              solution={`WITH wide AS (
  SELECT method,
         count(*) FILTER (WHERE status = 'paid')     AS paid,
         count(*) FILTER (WHERE status = 'refunded') AS refunded,
         count(*) FILTER (WHERE status = 'failed')   AS failed
  FROM payments
  GROUP BY method
)
SELECT w.method, v.status, v.n
FROM wide w
CROSS JOIN LATERAL (VALUES ('paid', w.paid),
                           ('refunded', w.refunded),
                           ('failed', w.failed)) AS v(status, n)
WHERE v.n > 0
ORDER BY w.method, v.status;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Pivot</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এ PIVOT নামের কোনো Keyword নেই, crosstab নেই, আর FILTER ও নেই। তবু Pivot লেখা যায়, আর সেটা বেশ ছোট, কারণ MySQL এ
              একটা তুলনা নিজেই 1 বা 0 দেয়। নিচের সবকিছু MySQL 8.4.11 এ Island Tours এর MySQL সংস্করণে চালানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["এক পাসে Pivot", "count(*) FILTER (WHERE …)", "SUM(status = 'confirmed') বা SUM(CASE …)"],
            ["FILTER", "আছে", "নেই, ERROR 1064"],
            ["তুলনার যোগফল", "sum(boolean) নেই, Error", "SUM(status = 'confirmed') চলে, তুলনা 1 বা 0"],
            ["crosstab", "tablefunc Extension দিয়ে", "নেই, ERROR 1064"],
            ["PIVOT Keyword", "নেই", "নেই, ERROR 1064"],
            ["মোটের Row", "ROLLUP, coalesce দিয়ে Total", "WITH ROLLUP, মোটের Row এ NULL"],
            ["Dynamic Pivot এর JSON", "jsonb_object_agg", "JSON_OBJECTAGG"],
            ["Unpivot", "LATERAL VALUES বা unnest", "LATERAL এর ভেতরে UNION ALL বা VALUES ROW(…)"],
            ["মাসের লেখা", "to_char(booked_at, 'YYYY-MM')", "DATE_FORMAT(booked_at, '%Y-%m')"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4: একই ছক",
          code: `SELECT DATE_FORMAT(booked_at, '%Y-%m') AS month,
       SUM(status = 'confirmed') AS confirmed,
       SUM(status = 'pending')   AS pending,
       SUM(status = 'cancelled') AS cancelled,
       COUNT(*) AS total
FROM bookings
GROUP BY month
ORDER BY month;
-- +---------+-----------+---------+-----------+-------+
-- | month   | confirmed | pending | cancelled | total |
-- +---------+-----------+---------+-----------+-------+
-- | 2025-12 |         2 |       0 |         0 |     2 |
-- | 2026-01 |         4 |       0 |         2 |     6 |
-- | 2026-02 |         1 |       0 |         0 |     1 |
-- | 2026-03 |         3 |       0 |         0 |     3 |
-- | 2026-09 |         2 |       0 |         1 |     3 |
-- | 2026-10 |         5 |       4 |         0 |     9 |
-- +---------+-----------+---------+-----------+-------+

-- টাকা আর মোটের Row
SELECT DATE_FORMAT(booked_at, '%Y-%m') AS month,
       SUM(CASE WHEN status = 'confirmed' THEN total_bdt ELSE 0 END) AS confirmed_bdt,
       SUM(total_bdt) AS all_bdt
FROM bookings
GROUP BY month WITH ROLLUP;
-- শেষ Row: | NULL | 423600.00 | 592300.00 |

-- এগুলো চলে না
SELECT COUNT(*) FILTER (WHERE status = 'confirmed') FROM bookings;
-- ERROR 1064 (42000): You have an error in your SQL syntax; ... near '(WHERE status = 'confirmed') ...'
SELECT * FROM crosstab('SELECT 1');
-- ERROR 1064 (42000): ... near '('SELECT 1')'
SELECT * FROM (SELECT status, total_bdt FROM bookings) s
PIVOT (SUM(total_bdt) FOR status IN ('confirmed', 'pending')) p;
-- ERROR 1064 (42000): ... near 'PIVOT (SUM(total_bdt) FOR status IN ...'

-- Unpivot: LATERAL এর ভেতরে UNION ALL
WITH wide AS (
  SELECT DATE_FORMAT(booked_at, '%Y-%m') AS month,
         SUM(status = 'confirmed') AS confirmed,
         SUM(status = 'pending')   AS pending,
         SUM(status = 'cancelled') AS cancelled
  FROM bookings GROUP BY month
)
SELECT w.month, v.status, v.n
FROM wide w
CROSS JOIN LATERAL (
  SELECT 'confirmed' AS status, w.confirmed AS n
  UNION ALL SELECT 'pending', w.pending
  UNION ALL SELECT 'cancelled', w.cancelled
) AS v
WHERE v.n > 0
ORDER BY w.month, v.status;
-- 9 rows, PostgreSQL এর মতোই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "অন্য Database এ PIVOT Keyword",
          content: (
            <ContentParagraph>
              Microsoft SQL Server এর মতো কিছু Database এ PIVOT আর UNPIVOT নামে আলাদা Operator আছে। কাজের মূল ভাবনা একই, শুধু লেখার
              ধরন আলাদা, আর সেখানেও Column এর নাম Query তে আগে থেকে লিখে দিতে হয়। এই লেসনের sum(CASE …) এর রূপটা সব জায়গায় চলে,
              তাই সেটাই বহনযোগ্য অভ্যাস।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>রুমানা আপার মাসিক Dashboard</SectionTitle>,
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
                এবার পুরো লেসনটা একটা কাজে। Island Tours এর Admin Panel এ মালিকের জন্য একটা পাতা বানানো হচ্ছে, যেখানে গত এগারো মাসের
                একটা ছক থাকবে। ফারুক সাহেব তাঁর চাহিদা লিখে দিলেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>প্রতিটা মাস একটা Row, যে মাসে কিছু হয়নি সেটাও, শূন্যসহ।</ListItem>
                <ListItem>মাসের নাম মানুষের পড়ার মতো, যেমন Dec 2025।</ListItem>
                <ListItem>মোট Booking, আর confirmed, pending, cancelled আলাদা Column এ।</ListItem>
                <ListItem>confirmed Booking এর আয়, শূন্য হলে 0.00।</ListItem>
                <ListItem>সেই মাস পর্যন্ত আয়ের চলমান যোগফল, আর মোট আয়ের কত ভাগ এই মাসের।</ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের চারটা কৌশল একসাথে: generate_series এর ক্যালেন্ডার, LEFT JOIN, FILTER এর Pivot, আর তার উপরে দুটো Window।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মালিকের Dashboard"
              query={`WITH grid AS (
  SELECT m,
         count(b.booking_id)                                       AS bookings,
         count(b.booking_id) FILTER (WHERE b.status = 'confirmed') AS confirmed,
         count(b.booking_id) FILTER (WHERE b.status = 'pending')   AS pending,
         count(b.booking_id) FILTER (WHERE b.status = 'cancelled') AS cancelled,
         coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0.00) AS revenue
  FROM generate_series(DATE '2025-12-01', DATE '2026-10-01', INTERVAL '1 month') AS m
  LEFT JOIN bookings b ON date_trunc('month', b.booked_at) = m
  GROUP BY m
)
SELECT to_char(m, 'Mon YYYY')                           AS month,
       bookings, confirmed, pending, cancelled, revenue,
       sum(revenue) OVER (ORDER BY m)                   AS running_revenue,
       round(100.0 * revenue / sum(revenue) OVER (), 1) AS share_pct
FROM grid
ORDER BY m;`}
              caption="১১টা Row। এপ্রিল থেকে আগস্ট সব শূন্য, আর চলমান আয় সেই পাঁচ মাস 243600.00 এ থেমে থাকে, যা খাতায় দেখতেও তেমনই। অক্টোবরে 9টা Booking, তার 5টা confirmed আর 4টা pending, আয় 129500.00, মোটের 30.6 ভাগ, আর চলমান আয় শেষে 423600.00। সাজানো হয়েছে m দিয়ে, লেখা মাস দিয়ে না, কারণ লেখা ধরে সাজালে Apr আগে আসত Dec এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষের লাইনটা একটা ছোট কিন্তু জরুরি অভ্যাস। ছকে মাস দেখানো হচ্ছে লেখা হিসেবে (Dec 2025), কিন্তু সাজানো হচ্ছে আসল তারিখ
              m ধরে। লেখা ধরে সাজালে অক্ষর ক্রমে Apr, Aug, Dec আগে চলে আসত। দেখানোর জন্য একটা, সাজানোর জন্য আরেকটা, এটা যেকোনো
              Report এর জন্য ভালো নিয়ম।
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
                  যেসব মাসে অন্তত একটা Booking আছে, তার প্রতিটার একটা Row: মাস <code className={CODE}>YYYY-MM</code> আকারে, তারপর
                  confirmed, pending আর cancelled Booking এর টাকা তিনটা Column এ (না থাকলে শূন্য), তারপর confirmed টাকার চলমান যোগফল,
                  আর মোট confirmed টাকার কত ভাগ সেই মাসের, এক দশমিক পর্যন্ত। মোট ছয়টা Column, মাস ধরে সাজানো।
                </>
              }
              hint={
                <>
                  আগে একটা CTE তে টাকার Pivot, coalesce সহ। তারপর বাইরে{" "}
                  <code className={CODE}>sum(…) OVER (ORDER BY month)</code> আর{" "}
                  <code className={CODE}>round(100.0 * … / sum(…) OVER (), 1)</code>।
                </>
              }
              solution={`WITH grid AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month,
         coalesce(sum(total_bdt) FILTER (WHERE status = 'confirmed'), 0.00) AS confirmed_bdt,
         coalesce(sum(total_bdt) FILTER (WHERE status = 'pending'), 0.00)   AS pending_bdt,
         coalesce(sum(total_bdt) FILTER (WHERE status = 'cancelled'), 0.00) AS cancelled_bdt
  FROM bookings
  GROUP BY 1
)
SELECT month, confirmed_bdt, pending_bdt, cancelled_bdt,
       sum(confirmed_bdt) OVER (ORDER BY month)                    AS running_confirmed,
       round(100.0 * confirmed_bdt / sum(confirmed_bdt) OVER (), 1) AS share_pct
FROM grid
ORDER BY month;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো Pivot, ছয় ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Row আর Column আলাদা করে বলুন",
              description:
                "প্রশ্নটা থেকে খুঁজে বের করুন কোন জিনিস নিচে নিচে যাবে (মাস, অঞ্চল, ট্যুর) আর কোন জিনিসের মানগুলো পাশে পাশে যাবে (অবস্থা, Payment পদ্ধতি, rating)। প্রথমটা GROUP BY, দ্বিতীয়টার প্রতিটা মান একটা Column।",
            },
            {
              title: "Long আকারটা আগে চালান",
              description:
                "GROUP BY row, column দিয়ে লম্বা ফলাফলটা দেখুন। কয়টা Column লাগবে আর কোন জোড়ায় কোনো Row নেই, এখান থেকেই বোঝা যায়।",
            },
            {
              title: "প্রতিটা Column এর জন্য একটা Aggregate",
              description:
                "PostgreSQL এ count(*) FILTER (WHERE …), অন্য জায়গায় sum(CASE …)। গোনা না টাকা, সেটা ঠিক করে Aggregate এর ধরন।",
            },
            {
              title: "ফাঁকা ঘর আর ফাঁকা Row",
              description:
                "sum দিলে coalesce। কোনো মাস বা দল একদম বাদ পড়লে চলবে না, তাহলে generate_series বা মূল Table থেকে LEFT JOIN, আর count(*) এর বদলে count(ডান দিকের Column)।",
            },
            {
              title: "মোট আর Window",
              description:
                "মোটের Row লাগলে ROLLUP, মোটের Column লাগলে ছাঁকনি ছাড়া একটা Aggregate। ভাগ, চলমান যোগফল বা র‍্যাংক লাগলে ছকটা CTE তে রেখে তার উপর Window।",
            },
            {
              title: "যোগ করে মিলিয়ে দেখুন",
              description:
                "প্রতিটা Row এর ঘরগুলো যোগ করলে মোটের Column, আর প্রতিটা Column নিচ থেকে যোগ করলে মোটের Row। Long আকারের Row সংখ্যা আর Pivot এর শূন্য নয় এমন ঘরের সংখ্যাও মেলান। না মিললে কোথাও একটা অবস্থা বা মাস বাদ পড়েছে।",
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
          headers: ["ভুল", "কী হয়", "ঠিক করার উপায়"],
          rows: [
            [
              "টাকার Pivot এ coalesce নেই",
              "খালি ঘরে NULL, Report এ ফাঁকা দেখায়",
              "coalesce(sum(…) FILTER (…), 0.00)",
            ],
            [
              "এক Argument এর crosstab",
              "কোনো দলে Category না থাকলে মান বাঁ দিকে সরে যায়, নিঃশব্দে ভুল",
              "দুই Argument এর crosstab, বা FILTER",
            ],
            [
              "crosstab এর Source এ ORDER BY নেই",
              "একই Row এর মানগুলো পাশাপাশি না এলে ভাগ হয়ে আলাদা Row হয়",
              "Source Query র শেষে ORDER BY 1, 2",
            ],
            [
              "খালি মাস ধরে নেওয়া",
              "GROUP BY শুধু Data থাকা মাস দেখায়, এপ্রিল থেকে আগস্ট উধাও",
              "generate_series থেকে LEFT JOIN",
            ],
            [
              "LEFT JOIN এর পরে count(*)",
              "খালি মাসে 1 দেখায়",
              "count(b.booking_id), ডান দিকের একটা কখনো NULL না হওয়া Column",
            ],
            [
              "নতুন অবস্থার জন্য Query না বদলানো",
              "নতুন মানের Row গুলো কোনো Column এ যায় না, ছক থেকে হারিয়ে যায়",
              "মোটের একটা Column রাখুন আর মিলিয়ে দেখুন, বা JSON এর Dynamic Pivot",
            ],
            [
              "লেখা মাস ধরে সাজানো",
              "Apr, Aug, Dec আগে চলে আসে",
              "আসল তারিখ ধরে সাজানো, লেখাটা শুধু দেখানোর জন্য",
            ],
            [
              "\\crosstabview কে App এ আশা করা",
              "App শুধু লম্বা ফলাফল পায়",
              "App এর জন্য SQL এর Pivot, \\crosstabview শুধু psql এ চোখে দেখার জন্য",
            ],
            [
              "unnest এ নাম আর মানের ক্রম না মেলা",
              "নাম ভুল সংখ্যার পাশে বসে, কোনো Error ছাড়া",
              "LATERAL VALUES, যেখানে নাম আর মান এক লাইনে",
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
                    href="https://www.postgresql.org/docs/current/tablefunc.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: tablefunc
                  </a>
                  : crosstab এর দুই রূপ, এক Argument এর রূপ কেন মান বাঁ দিকে ঢালে, আর Source Query তে ORDER BY 1, 2 কেন দরকার।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/app-psql.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: psql
                  </a>
                  : Meta-command এর তালিকায় \crosstabview, তার চারটা Argument আর উপরের নামগুলোর ক্রমের নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Value Expressions
                  </a>
                  : Aggregate Expressions অংশে FILTER এর নিয়ম, যার উপর এই লেসনের প্রতিটা Pivot দাঁড়িয়ে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-json.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: JSON Functions
                  </a>
                  : jsonb_object_agg আর অন্য JSON Aggregate, Dynamic Pivot এর JSON Column বানানোর হাতিয়ার।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/lateral-derived-tables.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Lateral Derived Tables
                  </a>
                  : MySQL এ LATERAL, যেটা দিয়ে এই লেসনের Unpivot MySQL এও চলে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://learn.microsoft.com/en-us/sql/t-sql/queries/from-using-pivot-and-unpivot"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Microsoft Learn: PIVOT and UNPIVOT
                  </a>
                  : SQL Server এর PIVOT Operator, অন্য Database এ একই কাজ কেমন দেখায় তা দেখার জন্য।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Pivot_table"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Pivot table
                  </a>
                  : Spreadsheet এর Pivot Table এর ধারণা আর ইতিহাস, যেখান থেকে নামটা এসেছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 18 */
    {
      id: "module-recap",
      subHeader: { index: "018", title: "Module 08 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রুমানা আপার Dashboard তৈরি, ফারুক সাহেবের প্রশ্নের ছকগুলোও। এই লেসনের মূল কথাগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>Pivot আকার বদলায়, হিসাব না: একটা Column এর মান Column এর নাম হয়।</ListItem>
                <ListItem>Database Long আকারে রাখে, মানুষ Wide আকারে পড়ে, তাই Pivot সাধারণত Query র শেষ ধাপ।</ListItem>
                <ListItem>GROUP BY ঠিক করে Row, প্রতিটা FILTER বা CASE এর Aggregate ঠিক করে একটা Column।</ListItem>
                <ListItem>count খালি ঘরে 0 দেয়, sum দেয় NULL, তাই টাকার Pivot এ coalesce।</ListItem>
                <ListItem>খালি মাস রাখতে generate_series থেকে LEFT JOIN, আর count(*) এর বদলে ডান দিকের Column।</ListItem>
                <ListItem>crosstab লিখলে দুই Argument, কারণ এক Argument এর রূপ মান বাঁ দিকে ঢালে।</ListItem>
                <ListItem>Column আগে থেকে না জানলে App এ Query বানানো, JSON Column, বা শুধু দেখার জন্য \crosstabview।</ListItem>
                <ListItem>Unpivot এর জন্য LATERAL VALUES বা unnest, আর MySQL এ SUM(শর্ত) আর LATERAL।</ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleEightStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো মডিউলটা এক নজরে। প্রতিটা লেসন একটা প্রশ্নের উত্তর দিয়েছে, আর প্রতিটা আগেরটার উপর দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "যে প্রশ্নের উত্তর", "মূল হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/what-are-window-functions" className={LINK}>
                What a Window Function Is
              </Link>,
              "Row না হারিয়ে পুরো Table এর হিসাব কীভাবে পাশে বসাই?",
              "OVER (), WINDOW Clause",
            ],
            [
              <Link key="l2" href="/sql/topic/ranking-functions" className={LINK}>
                ROW_NUMBER, RANK and DENSE_RANK
              </Link>,
              "সমান মান থাকলে কে কত নম্বর পায়?",
              "ROW_NUMBER, RANK, DENSE_RANK",
            ],
            [
              <Link key="l3" href="/sql/topic/partition-by" className={LINK}>
                PARTITION BY
              </Link>,
              "প্রতিটা দলের ভেতরে আলাদা করে হিসাব কীভাবে?",
              "PARTITION BY",
            ],
            [
              <Link key="l4" href="/sql/topic/running-totals-frames" className={LINK}>
                Running Totals and Window Frames
              </Link>,
              "চলমান যোগফল আর শেষ কয়েকটা Row এর গড় কীভাবে?",
              "ROWS, RANGE, GROUPS Frame",
            ],
            [
              <Link key="l5" href="/sql/topic/lag-lead" className={LINK}>
                LAG, LEAD, FIRST_VALUE and NTILE
              </Link>,
              "আগের বা পরের Row এর সাথে তুলনা কীভাবে?",
              "LAG, LEAD, FIRST_VALUE, NTILE",
            ],
            [
              <Link key="l6" href="/sql/topic/top-n-gaps-islands" className={LINK}>
                Top-N per Group, Gaps and Islands
              </Link>,
              "প্রতিটা দলের সেরা কয়েকটা, আর ধারাবাহিক দিনের দল কীভাবে?",
              "ROW_NUMBER এর CTE, তারিখ থেকে Row নম্বর বিয়োগ",
            ],
            [
              <Link key="l7" href="/sql/topic/pivoting" className={LINK}>
                Pivoting Rows into Columns
              </Link>,
              "লম্বা ফলাফল মানুষের পড়ার ছকে কীভাবে?",
              "FILTER, CASE, crosstab, LATERAL VALUES",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার শেষ পরীক্ষা: মডিউলের চারটা বড় হাতিয়ার একটা Query তে। প্রতিটা মাসের confirmed আয়, তার চলমান যোগফল, আগের মাসের
              চেয়ে কত বেশি বা কম, আয়ের দিক থেকে মাসটার র‍্যাংক, আর সেই মাসের সেরা ট্যুর। শেষেরটা দলের সেরা একটা, Lesson 06 এর
              কৌশলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 08 এর Capstone Report"
              query={`WITH monthly AS (
  SELECT date_trunc('month', booked_at) AS m, sum(total_bdt) AS revenue
  FROM bookings
  WHERE status = 'confirmed'
  GROUP BY 1
),
tour_month AS (
  SELECT date_trunc('month', b.booked_at) AS m,
         t.title,
         sum(b.total_bdt) AS revenue,
         row_number() OVER (PARTITION BY date_trunc('month', b.booked_at)
                            ORDER BY sum(b.total_bdt) DESC, t.title) AS rn
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  JOIN tours t      ON t.tour_id = d.tour_id
  WHERE b.status = 'confirmed'
  GROUP BY 1, 2
)
SELECT to_char(mo.m, 'YYYY-MM')                         AS month,
       mo.revenue,
       sum(mo.revenue) OVER (ORDER BY mo.m)              AS running_total,
       mo.revenue - lag(mo.revenue) OVER (ORDER BY mo.m) AS change_vs_prev,
       rank() OVER (ORDER BY mo.revenue DESC)            AS revenue_rank,
       tm.title                                          AS top_tour,
       tm.revenue                                        AS top_tour_revenue
FROM monthly mo
JOIN tour_month tm ON tm.m = mo.m AND tm.rn = 1
ORDER BY mo.m;`}
              caption="৬টা Row। ডিসেম্বরে আগের মাস নেই, তাই change_vs_prev ফাঁকা। ফেব্রুয়ারিতে আয় 73000.00 কমে, অক্টোবরে 79000.00 বাড়ে আর র‍্যাংক 1। প্রতিটা মাসের সেরা ট্যুর আলাদা CTE তে ROW_NUMBER দিয়ে, নামকে শেষ টাই ব্রেকার রেখে। খেয়াল করুন সেপ্টেম্বরের আগের মাস এখানে মার্চ, কারণ মাঝের মাসগুলোয় confirmed আয় নেই, আর এই লেসনের Empty Months Section এর ক্যালেন্ডার দিয়ে সেটা বদলানো যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজেকে যাচাই করুন। প্রতিটা প্রশ্নের উত্তর কাউকে মুখে বুঝিয়ে বলতে পারলে মডিউলটা আপনার হয়ে গেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>GROUP BY Row হারায়, Window Function হারায় না, একটা উদাহরণে বলুন কেন।</ListItem>
                <ListItem>দুটো Review এর rating সমান হলে ROW_NUMBER, RANK আর DENSE_RANK কে কী দেয়?</ListItem>
                <ListItem>PARTITION BY আর GROUP BY এর পার্থক্য এক লাইনে বলুন।</ListItem>
                <ListItem>OVER এর ভেতরে ORDER BY থাকলে Default Frame কী, আর সমান মানে চলমান যোগফল কেন একসাথে লাফ দেয়?</ListItem>
                <ListItem>LAST_VALUE কেন প্রায়ই বর্তমান Row টাই ফেরত দেয়, আর কীভাবে ঠিক করবেন?</ListItem>
                <ListItem>প্রতিটা ট্যুরের সবচেয়ে বড় দুটো Booking কীভাবে আনবেন, আর ধারাবাহিক দিনের দল কোন কৌশলে খোঁজে?</ListItem>
                <ListItem>Long আর Wide আকার কী, আর এক Argument এর crosstab কেন বিপজ্জনক?</ListItem>
              </ContentList>
              <ContentParagraph>
                Module 03 থেকে এখানে পর্যন্ত আপনি প্রায় সব কাজ করেছেন আগে থেকে বানানো Table নিয়ে: পড়া, ছাঁকা, জোড়া, দলবাঁধা,
                আর হিসাব। কিন্তু এই Table গুলো কেউ একজন বানিয়েছিলেন, আর প্রতিটা Column এর Type, প্রতিটা নিয়ম ভেবেচিন্তে বসিয়েছিলেন:
                দাম কেন numeric, সময় কেন timestamptz, একই Email দুইবার কেন ঢোকে না, আর Booking কেন এমন Customer কে দেখাতে পারে না
                যিনি নেই। পরের মডিউলে আপনি সেই চেয়ারে বসবেন। চলুন{" "}
                <Link href="/sql/topic/tables-types-constraints-overview" className={LINK}>
                  Module 09, Tables, Data Types আর Constraints
                </Link>{" "}
                এ।
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
      ["Pivot", "একটা Column এর মান Column এর নাম হয়, হিসাব বদলায় না", "৯টা লম্বা Row থেকে ৬টা চওড়া Row"],
      ["Long বনাম Wide", "Long এ জোড়া প্রতি Row, Wide এ জিনিস প্রতি Row", "status Column বনাম confirmed, pending, cancelled Column"],
      ["FILTER এর Pivot", "GROUP BY Row, প্রতিটা FILTER একটা Column", "জানুয়ারি 4, 0, 2"],
      ["CASE এর Pivot", "sum(CASE … THEN 1 ELSE 0 END), সব Database এ", "একই ছয়টা Row"],
      ["খালি ঘর", "count দেয় 0, sum দেয় NULL", "ডিসেম্বরের pending টাকা: NULL, coalesce দিয়ে 0.00"],
      ["মোটের Row", "ROLLUP আর coalesce দিয়ে Total", "Total 592300.00"],
      ["Join এর পরে Pivot", "আগে Join, তারপর একই Pivot", "Chattogram 12, 1, 3"],
      ["খালি মাস", "generate_series থেকে LEFT JOIN, count(ডান দিকের Column)", "১১টা মাস, এপ্রিল থেকে আগস্ট শূন্য"],
      ["ছকের উপর Window", "GROUP BY এর পরে ভাগ, চলমান যোগফল, র‍্যাংক", "অক্টোবর 30.6 ভাগ, র‍্যাংক 1"],
      ["crosstab", "tablefunc এর Function, দুই Argument এর রূপ নিরাপদ", "এক Argument এ জানুয়ারির c1 = cancelled এর 2"],
      ["Dynamic Pivot", "SQL এর Column আগে থেকে জানা চাই, তাই JSON বা App", "jsonb_object_agg: {\"cancelled\": 2, \"confirmed\": 4}"],
      ["Unpivot", "LATERAL VALUES বা unnest দিয়ে চওড়া থেকে লম্বা", "১৮টা Row, শূন্য বাদে ৯টা"],
      ["MySQL", "FILTER, crosstab, PIVOT কিছুই নেই, SUM(শর্ত) চলে", "একই ছক, WITH ROLLUP এ NULL"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "মাস আর অবস্থার লম্বা ফলাফলকে Pivot করে চওড়া ছক বানালে কী বদলায়?",
        options: [
          {
            key: "A",
            text: "সংখ্যাগুলো নতুন করে গোনা হয়, তাই কিছু সংখ্যা বদলাতে পারে",
            isCorrect: false,
            explanation: "Pivot নতুন কিছু গোনে না। ৯টা লম্বা Row এর প্রতিটা সংখ্যা চওড়া ছকে হুবহু একটা ঘরে বসে।",
          },
          {
            key: "B",
            text: "শুধু আকার: status এর মানগুলো Column এর নাম হয়, সংখ্যাগুলো নিজের ঘরে বসে",
            isCorrect: true,
            explanation: "ঠিক। ৯টা Row থেকে ৬টা Row, কিন্তু জানুয়ারির confirmed 4 আর cancelled 2 দুই আকারেই একই। শুধু যেসব জোড়ার Row ছিল না, সেগুলো ছকে খালি বা শূন্য ঘর হয়।",
          },
          {
            key: "C",
            text: "Table টার গঠন বদলে যায়, নতুন Column যোগ হয়",
            isCorrect: false,
            explanation: "Pivot একটা Query র ফলাফলের আকার বদলায়, bookings Table কোনোভাবেই বদলায় না।",
          },
          {
            key: "D",
            text: "Row এর সংখ্যা সবসময় একই থাকে",
            isCorrect: false,
            explanation: "সাধারণত কমে, কারণ একই মাসের কয়েকটা Row এক Row এ আসে। এখানে ৯ থেকে ৬।",
          },
        ],
      },
      {
        id: 2,
        text: "ডিসেম্বর 2025 এ কোনো pending Booking নেই। count(*) FILTER (WHERE status = 'pending') আর sum(total_bdt) FILTER (WHERE status = 'pending') ডিসেম্বরের ঘরে কী দেয়?",
        options: [
          {
            key: "A",
            text: "দুটোই 0",
            isCorrect: false,
            explanation: "count কিছু না পেলে 0 দেয়, কিন্তু sum দেয় NULL।",
          },
          {
            key: "B",
            text: "দুটোই NULL",
            isCorrect: false,
            explanation: "count কখনো NULL দেয় না, কিছু না পেলে 0।",
          },
          {
            key: "C",
            text: "count দেয় 0, sum দেয় NULL",
            isCorrect: true,
            explanation: "ঠিক। তাই টাকার Pivot এ coalesce(sum(…) FILTER (…), 0.00) লিখতে হয়, নইলে Report এ ফাঁকা ঘর দেখায়।",
          },
          {
            key: "D",
            text: "Query টা Error দেয়, কারণ ডিসেম্বরে pending নেই",
            isCorrect: false,
            explanation: "কোনো Error নেই। ছাঁকনি দিয়ে কিছু না গেলে Aggregate তার খালি মানটা দেয়।",
          },
        ],
      },
      {
        id: 3,
        text: "Booking আছে ছয়টা মাসে, আর ডিসেম্বর 2025 থেকে অক্টোবর 2026 মোট এগারো মাস। GROUP BY মাস দিয়ে Pivot করলে কয়টা Row আসে, আর generate_series থেকে LEFT JOIN দিয়ে করলে কয়টা?",
        options: [
          {
            key: "A",
            text: "৬ আর ১১",
            isCorrect: true,
            explanation: "ঠিক। GROUP BY শুধু যে দলে অন্তত একটা Row আছে সেগুলো বানায়, তাই ৬। ক্যালেন্ডার থেকে LEFT JOIN করলে এপ্রিল থেকে আগস্টও থাকে, শূন্যসহ, তাই ১১।",
          },
          {
            key: "B",
            text: "১১ আর ১১",
            isCorrect: false,
            explanation: "GROUP BY খালি মাসের দল বানায় না, কারণ সেই মাসে কোনো Row ই নেই।",
          },
          {
            key: "C",
            text: "৯ আর ১১",
            isCorrect: false,
            explanation: "৯ হল লম্বা আকারের Row, মাস আর অবস্থার জোড়া। মাস ধরে Pivot করলে ৬।",
          },
          {
            key: "D",
            text: "৬ আর ৬",
            isCorrect: false,
            explanation: "generate_series এর এগারোটা মাস LEFT JOIN এর বাঁ দিকে, তাই সবগুলো থাকে।",
          },
        ],
      },
      {
        id: 4,
        text: "এক Argument এর crosstab এ Source Query মাস আর অবস্থা ধরে ORDER BY 1, 2 করা, আর Column গুলো c1, c2, c3। জানুয়ারিতে cancelled 2 আর confirmed 4। জানুয়ারির c1 এ কী আসে?",
        options: [
          {
            key: "A",
            text: "4, কারণ confirmed প্রথম Column",
            isCorrect: false,
            explanation: "এক Argument এর crosstab Category এর নাম দেখে না। সে মানগুলো যে ক্রমে আসে সেই ক্রমে বাঁ থেকে বসায়।",
          },
          {
            key: "B",
            text: "2, কারণ অক্ষর ক্রমে cancelled আগে আসে আর মানগুলো বাঁ দিক থেকে ঢালা হয়",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL 18 এ চালানো ফলাফলে জানুয়ারির c1 = 2, c2 = 4, অথচ অক্টোবরের c1 = 5 (confirmed)। একই Column, দুই Row এ দুই মানে, আর কোনো Error নেই।",
          },
          {
            key: "C",
            text: "NULL, কারণ Category Query দেওয়া হয়নি",
            isCorrect: false,
            explanation: "Category Query ছাড়াও চলে, শুধু নাম ধরে বসায় না।",
          },
          {
            key: "D",
            text: "Query টা Error দেয়",
            isCorrect: false,
            explanation: "কোনো Error নেই, আর সেটাই বিপদ: ছকটা দেখতে নিখুঁত, কিন্তু ভুল।",
          },
        ],
      },
      {
        id: 5,
        text: "কাল থেকে waitlisted নামে নতুন একটা অবস্থা আসবে। কোন উপায়ে Query না বদলেই প্রতিটা মাসে সব অবস্থার সংখ্যা পাওয়া যায়?",
        options: [
          {
            key: "A",
            text: "FILTER এর Pivot, কারণ সে নতুন Column নিজেই বানায়",
            isCorrect: false,
            explanation: "FILTER এর প্রতিটা Column হাতে লেখা। waitlisted এর Column না লিখলে সেই Booking গুলো কোনো Column এ যায় না।",
          },
          {
            key: "B",
            text: "দুই Argument এর crosstab",
            isCorrect: false,
            explanation: "Category Query আর Column এর তালিকা দুটোতেই নতুন অবস্থা লিখতে হয়।",
          },
          {
            key: "C",
            text: "jsonb_object_agg দিয়ে প্রতিটা মাসে একটা JSON Column",
            isCorrect: true,
            explanation: "ঠিক। JSON এর ভেতরে যত খুশি চাবি থাকতে পারে, তাই নতুন অবস্থা এলে Query না বদলেই নতুন চাবি চলে আসে। App বা Chart সেটা খুলে Column বানায়।",
          },
          {
            key: "D",
            text: "\\crosstabview, কারণ সেটা App এর জন্য ছক পাঠায়",
            isCorrect: false,
            explanation: "\\crosstabview Data দেখে ছক বানায় ঠিকই, কিন্তু শুধু psql এর পর্দায়। App কেবল লম্বা ফলাফলটা পায়।",
          },
        ],
      },
      {
        id: 6,
        text: "psql এ একটা Query র শেষে \\crosstabview লিখলে কী ঘটে?",
        options: [
          {
            key: "A",
            text: "Server একটা চওড়া Table পাঠায়, যেটা যেকোনো Client পায়",
            isCorrect: false,
            explanation: "Server সাধারণ লম্বা ফলাফলই পাঠায়। ছকটা psql নিজে বানিয়ে দেখায়।",
          },
          {
            key: "B",
            text: "psql লম্বা ফলাফলটা নিজের পর্দায় ছক হিসেবে সাজিয়ে দেখায়",
            isCorrect: true,
            explanation: "ঠিক। এটা psql এর একটা Meta-command, SQL না। নিজে চোখ বুলিয়ে দেখার জন্য দারুণ, App এর জন্য না।",
          },
          {
            key: "C",
            text: "একটা View তৈরি হয়, যেটা পরে ব্যবহার করা যায়",
            isCorrect: false,
            explanation: "কিছুই তৈরি হয় না, Database এ কিছু বদলায় না।",
          },
          {
            key: "D",
            text: "একই ঘরে দুটো মান পড়লে সেগুলো যোগ করে দেখায়",
            isCorrect: false,
            explanation: "যোগ করে না, Error দেয়: query result contains multiple data values for row … column …।",
          },
        ],
      },
      {
        id: 7,
        text: "৬টা মাসের চওড়া ছক, প্রতিটায় confirmed, pending আর cancelled। LATERAL VALUES দিয়ে Unpivot করলে কয়টা Row, আর শেষে WHERE n > 0 দিলে কয়টা?",
        options: [
          {
            key: "A",
            text: "৬ আর ৬",
            isCorrect: false,
            explanation: "LATERAL এর VALUES প্রতিটা চওড়া Row থেকে তিনটা Row বানায়।",
          },
          {
            key: "B",
            text: "১৮ আর ৯",
            isCorrect: true,
            explanation: "ঠিক। ছয় গুণ তিন, ১৮। শূন্যের Row বাদ দিলে থাকে সেই ৯টা, যা শুরুতে GROUP BY মাস আর অবস্থা দিয়েছিল।",
          },
          {
            key: "C",
            text: "১৮ আর ১৮",
            isCorrect: false,
            explanation: "ডিসেম্বরের pending এর মতো শূন্যের Row আছে নয়টা, WHERE সেগুলো বাদ দেয়।",
          },
          {
            key: "D",
            text: "৯ আর ৯",
            isCorrect: false,
            explanation: "WHERE ছাড়া শূন্যের Row গুলোও থাকে, তাই প্রথমে ১৮।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ নিচের কোনটা প্রতিটা মাসের confirmed Booking গোনে?",
        options: [
          {
            key: "A",
            text: "COUNT(*) FILTER (WHERE status = 'confirmed')",
            isCorrect: false,
            explanation: "MySQL এ FILTER নেই। MySQL 8.4 এ ERROR 1064 আসে।",
          },
          {
            key: "B",
            text: "SUM(status = 'confirmed')",
            isCorrect: true,
            explanation: "ঠিক। MySQL এ তুলনা 1 বা 0 দেয়, তাই যোগফলই সংখ্যা: জানুয়ারি 4, অক্টোবর 5। PostgreSQL এ একই লেখা চলে না, sum(boolean) নেই।",
          },
          {
            key: "C",
            text: "crosstab দিয়ে",
            isCorrect: false,
            explanation: "crosstab PostgreSQL এর tablefunc এর Function, MySQL এ নেই।",
          },
          {
            key: "D",
            text: "PIVOT (COUNT(*) FOR status IN ('confirmed'))",
            isCorrect: false,
            explanation: "MySQL এ PIVOT Keyword নেই, ERROR 1064।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: মালিকের তিনটা ছক",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Payment এর ছক:</strong> প্রতিটা মাসের (paid_at ধরে) একটা Row, প্রতিটা Payment পদ্ধতির paid টাকা একটা Column এ
        (bkash, nagad, card, bank), খালি ঘরে 0.00, শেষে মোটের Column আর ROLLUP দিয়ে Total Row। ডান থেকে আর নিচ থেকে যোগ করে
        দেখান দুই দিকে মেলে।
      </span>,
      <span key="2">
        <strong>অঞ্চল আর rating:</strong> প্রতিটা অঞ্চলের (region) একটা Row, rating 5, 4, 3 আর 2 বা কম একটা করে Column এ। যে
        অঞ্চলের কোনো Review নেই সেটাও শূন্যসহ রাখুন। কোন অঞ্চল বাদ পড়ছিল আর কেন, দুই লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>ক্যালেন্ডার আর Window:</strong> ডিসেম্বর 2025 থেকে অক্টোবর 2026 এর প্রতিটা মাসে বাতিলের হার (cancelled ভাগ মোট
        Booking, শতাংশে), খালি মাসে NULL, আর আগের মাসের হারের সাথে পার্থক্য LAG দিয়ে। শূন্য দিয়ে ভাগ কীভাবে এড়ালেন, লিখুন।
      </span>,
      <span key="4">
        <strong>crosstab অনুশীলন:</strong> নিজের psql এ tablefunc চালু করে অঞ্চল বনাম অবস্থার ছকটা দুই Argument এর crosstab দিয়ে
        লিখুন, তারপর এক Argument দিয়ে। কোন Row এ কোন Column ভুল মান পেল, তার তালিকা দিন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> হাজিরা খাতার উদাহরণ দিয়ে Long আর Wide আকার, আর Database কেন Long আকারে রাখে
        অথচ Report কেন Wide চায়, ছয় লাইনে।
      </span>,
    ],
    deliverables: [
      <span key="d1">Payment এর ছকের Query, ফলাফল আর দুই দিকের যোগফল মেলানোর নোট</span>,
      <span key="d2">অঞ্চল বনাম rating এর Query আর বাদ পড়া অঞ্চলের ব্যাখ্যা</span>,
      <span key="d3">বাতিলের হারের ক্যালেন্ডার Query আর শূন্য দিয়ে ভাগ এড়ানোর কৌশল</span>,
      <span key="d4">crosstab এর দুই রূপের ফলাফল আর ভুল ঘরের তালিকা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Pivot",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "FILTER আর CASE",
        description:
          "প্রথম ফাইলের দুটো Query চালান। দুটোই ৬টা Row দেবে আর হুবহু মিলবে। তারপর প্রথম Query র প্রতিটা Row এ confirmed, pending আর cancelled যোগ করে total এর সাথে মিলিয়ে দেখুন।",
      },
      {
        title: "টাকা আর মোট",
        description:
          "দ্বিতীয় ফাইলে টাকার ছক ROLLUP সহ। ৭টা Row, Total এ 592300.00। একবার coalesce মুছে চালান আর দেখুন কোন ঘরগুলো ফাঁকা হয়ে যায়।",
      },
      {
        title: "সব মাস",
        description:
          "তৃতীয় ফাইলে generate_series এর ক্যালেন্ডার। ১১টা Row। তারপর count(b.booking_id) কে count(*) বানিয়ে চালান, খালি মাসগুলোতে কী বদলায় লিখুন।",
      },
      {
        title: "crosstab এর দুই রূপ",
        description:
          "চতুর্থ ফাইলে tablefunc চালু করে দুটো crosstab। দুই Argument এর রূপ FILTER এর ছকের সাথে মেলে, এক Argument এর রূপে জানুয়ারি আর সেপ্টেম্বরের c1 ভুল। কেন, এক লাইনে লিখুন।",
      },
      {
        title: "\\crosstabview",
        description:
          "পঞ্চম ফাইলের দুটো Query। প্রথমটায় Column এর ক্রম confirmed, cancelled, pending, দ্বিতীয়টায় আপনার দেওয়া ক্রমে। তৃতীয় একটা Query নিজে লিখুন যাতে একই ঘরে দুটো মান পড়ে, আর Error টা পড়ুন।",
      },
      {
        title: "Unpivot",
        description:
          "ষষ্ঠ ফাইলে LATERAL VALUES। প্রথমে ১৮টা Row, তারপর WHERE দিয়ে ৯টা। শেষে Unpivot Section এর unnest এর রূপটা লিখে নামের Array এর ক্রম ইচ্ছা করে বদলে চালান, আর দেখুন Error ছাড়াই কী ভুল হয়।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-filter-and-case.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT to_char(booked_at, 'YYYY-MM')                  AS month,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       count(*)                                     AS total
FROM bookings
GROUP BY 1
ORDER BY 1;
-- (6 rows) 2026-01: 4 | 0 | 2 | 6, 2026-10: 5 | 4 | 0 | 9

SELECT to_char(booked_at, 'YYYY-MM') AS month,
       sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
       sum(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,
       sum(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM bookings
GROUP BY 1
ORDER BY 1;
-- (6 rows) উপরের প্রথম তিনটা সংখ্যার Column এর সাথে হুবহু এক`,
      },
      {
        language: "sql",
        filename: "02-money-and-totals.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT coalesce(to_char(booked_at, 'YYYY-MM'), 'Total')                    AS month,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'confirmed'), 0.00) AS confirmed_bdt,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'pending'), 0.00)   AS pending_bdt,
       coalesce(sum(total_bdt) FILTER (WHERE status = 'cancelled'), 0.00) AS cancelled_bdt,
       sum(total_bdt)                                                     AS all_bdt
FROM bookings
GROUP BY ROLLUP (to_char(booked_at, 'YYYY-MM'))
ORDER BY grouping(to_char(booked_at, 'YYYY-MM')), 1;
-- (7 rows) শেষ Row: Total | 423600.00 | 117200.00 | 51500.00 | 592300.00`,
      },
      {
        language: "sql",
        filename: "03-calendar.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT to_char(m, 'YYYY-MM') AS month,
       count(b.booking_id) FILTER (WHERE b.status = 'confirmed') AS confirmed,
       count(b.booking_id) FILTER (WHERE b.status = 'pending')   AS pending,
       count(b.booking_id) FILTER (WHERE b.status = 'cancelled') AS cancelled
FROM generate_series(DATE '2025-12-01', DATE '2026-10-01', INTERVAL '1 month') AS m
LEFT JOIN bookings b ON date_trunc('month', b.booked_at) = m
GROUP BY m
ORDER BY m;
-- (11 rows) 2026-04 থেকে 2026-08: 0 | 0 | 0`,
      },
      {
        language: "sql",
        filename: "04-crosstab.sql",
        code: `SET TimeZone = 'Asia/Dhaka';
CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT *
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, count(*)::int
    FROM bookings GROUP BY 1, 2 ORDER BY 1, 2$$,
  $$VALUES ('confirmed'), ('pending'), ('cancelled')$$
) AS ct(month text, confirmed int, pending int, cancelled int);
-- (6 rows) 2026-01: 4 | (খালি) | 2

SELECT *
FROM crosstab(
  $$SELECT to_char(booked_at, 'YYYY-MM'), status, count(*)::int
    FROM bookings GROUP BY 1, 2 ORDER BY 1, 2$$
) AS ct(month text, c1 int, c2 int, c3 int);
-- (6 rows) 2026-01: 2 | 4 | (খালি), 2026-09: 1 | 2 | (খালি)`,
      },
      {
        language: "sql",
        filename: "05-crosstabview.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT to_char(booked_at, 'YYYY-MM') AS month, status, count(*)
FROM bookings
GROUP BY 1, 2
ORDER BY 1, 2
\\crosstabview month status count
-- (6 rows) উপরে: confirmed | cancelled | pending

SELECT to_char(booked_at, 'YYYY-MM') AS month, status, count(*) AS n,
       CASE status WHEN 'confirmed' THEN 1 WHEN 'pending' THEN 2 ELSE 3 END AS col_order
FROM bookings
GROUP BY 1, 2
ORDER BY 1
\\crosstabview month status n col_order
-- (6 rows) উপরে: confirmed | pending | cancelled`,
      },
      {
        language: "sql",
        filename: "06-unpivot.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

WITH wide AS (
  SELECT to_char(booked_at, 'YYYY-MM') AS month,
         count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
         count(*) FILTER (WHERE status = 'pending')   AS pending,
         count(*) FILTER (WHERE status = 'cancelled') AS cancelled
  FROM bookings
  GROUP BY 1
)
SELECT w.month, v.status, v.n
FROM wide w
CROSS JOIN LATERAL (VALUES ('confirmed', w.confirmed),
                           ('pending',   w.pending),
                           ('cancelled', w.cancelled)) AS v(status, n)
ORDER BY w.month, v.status;
-- (18 rows)
-- শেষ লাইনের আগে WHERE v.n > 0 যোগ করলে (9 rows)`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Pivot এর পরে দুটো যোগফল মেলান। প্রতিটা Row এর ঘরগুলো যোগ করলে total Column এর সমান হওয়া চাই, আর পুরো ছকের সব ঘর
        যোগ করলে মোট Booking এর সংখ্যা, ২৪। কোথাও না মিললে হয় একটা অবস্থার Column বাদ পড়েছে, নয়তো LEFT JOIN এর পরে count(*)
        কাউকে বেশি গুনেছে।
      </ContentParagraph>
    ),
  },
};
