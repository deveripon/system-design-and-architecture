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
  GroupStepLab,
  RuleCheckLab,
} from "../../../components/course/topics/aggregation/group-animations";
import {
  CompositeGroupsDiagram,
  GroupPilesDiagram,
  GroupVsDistinctSplit,
  WhichValueDiagram,
} from "../../../components/course/topics/aggregation/group-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const groupByContent: TopicData = {
  id: "group-by",
  introduction: {
    badge: "MODULE 05 · LESSON 02",
    title: <SectionTitle>একটা উত্তর নয়, প্রতিটা দলের একটা করে উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি শিখেছেন অনেকগুলো Row থেকে একটা উত্তর বের করতে। count(*) বলল মোট ২৪টা
          Booking, sum(total_bdt) বলল মোট কত টাকা। কিন্তু ব্যবসার প্রায় কোনো প্রশ্নই একটা মাত্র
          সংখ্যায় থামে না। Manager জানতে চান কোন অবস্থায় কয়টা Booking, কোন Payment Method এ কত টাকা
          এসেছে, কোন মাসে কয়টা Booking হয়েছে। প্রশ্নের শেষে প্রায় সবসময় একটা অদৃশ্য শব্দ থাকে:
          প্রতিটা।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের বিষয় সেই শব্দটা, SQL এ যার নাম GROUP BY। GROUP BY একটা Table এর Row গুলোকে
          একটা Column এর মান দেখে আলাদা আলাদা দলে ভাগ করে, যেমন ডাকঘরে চিঠি জেলা দেখে আলাদা খোপে
          রাখা হয়। তারপর প্রতিটা দলের জন্য আলাদা করে হিসাব করে, আর প্রতিটা দল থেকে Result এ ঠিক
          একটা Row দেয়।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি এক Column, কয়েকটা Column আর একটা হিসাব করা মান দিয়ে দল বানাতে পারবেন। জানবেন
          কেন কিছু Query PostgreSQL চালাতেই রাজি হয় না, আর সেই নিয়মের একমাত্র ছাড় কোথায়। দেখবেন
          NULL নিজেও একটা দল হয়, একটা ভুল নামের ফাঁদ কীভাবে চুপচাপ ভুল Report বানায়, আর MySQL একই
          Query তে কখন বিপজ্জনকভাবে চুপ থাকে। সব হবে একটা মাত্র Table থেকে, কারণ দুটো Table জোড়া
          দেওয়া আসবে Module 06 এ।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে বলুন কোন Column দেখে ভাগ করব। আমি সব Row কে তাদের মান অনুযায়ী স্তূপে সাজাব, প্রতিটা স্তূপ গুনব, যোগ করব, মাপব, তারপর প্রতিটা স্তূপ থেকে আপনাকে একটা করে Row দেব। শুধু এমন কিছু চাইবেন না যার একটা স্তূপে অনেক রকম মান আছে।",
      author: "GROUP BY",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবার সকালের প্রশ্ন: কোন অবস্থায় কয়টা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026। Island Tours এর Operations Manager ফারুক সাহেব প্রতি রবিবার
                সকালে একটা ছোট বৈঠক করেন। আজ তিনি জানতে চাইলেন: এখন পর্যন্ত যত Booking এসেছে, তার কয়টা
                confirmed, কয়টা এখনো pending, আর কয়টা বাতিল হয়েছে। আগের লেসনের বিদ্যা দিয়ে আপনি একটা
                উপায় জানেন: প্রতিটা অবস্থার জন্য আলাদা একটা Query, আলাদা একটা WHERE।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে সেই তিনটা Query। চালিয়ে দেখুন উত্তর ঠিক আসে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা প্রশ্ন, তিনটা Query"
              query={`SELECT count(*) FROM bookings WHERE status = 'confirmed';
SELECT count(*) FROM bookings WHERE status = 'pending';
SELECT count(*) FROM bookings WHERE status = 'cancelled';`}
              caption="উত্তর আসে ১৭, ৪ আর ৩, মোট ২৪। সংখ্যাগুলো ঠিক, কিন্তু খেয়াল করুন প্রতিটা ফলাফলের মাথায় শুধু count লেখা। কোন সংখ্যাটা কোন অবস্থার, সেটা আপনাকে মনে রাখতে হচ্ছে Query এর ক্রম দেখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা অবস্থার জন্য তিনটা Query এখনো সামলানো যায়। কিন্তু ফারুক সাহেবের পরের প্রশ্নগুলো
                ভাবুন। প্রতিটা Departure এ কয়টা সিট বুক হয়েছে: Departure ১৬টা, মানে ১৬টা Query। প্রতিটা
                মাসে কত টাকার Booking: মাস যত, Query তত। আর এই পদ্ধতির সবচেয়ে বড় বিপদটা চোখে পড়ে না।
                কাল যদি নতুন একটা অবস্থা আসে, ধরুন waitlist, আপনার তিনটা Query সেটার কথা জানেই না। Report
                চুপচাপ একটা অংশ বাদ দিয়ে দেবে, আর কেউ টের পাবে না।
              </ContentParagraph>
              <ContentParagraph>
                দরকার এমন একটা Query, যেটা নিজেই খুঁজে বের করবে status এ কয় রকম মান আছে, প্রতিটা মানের
                জন্য আলাদা হিসাব করবে, আর প্রতিটার পাশে মানটার নাম লিখে দেবে। নতুন অবস্থা এলে সেটা নিজে
                থেকেই নতুন একটা Row হয়ে হাজির হবে। এই কাজটাই করে GROUP BY।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের মূল কথা এক লাইনে",
          content: (
            <ContentParagraph>
              GROUP BY Row গুলোকে একটা বা কয়েকটা Column এর মান অনুযায়ী দলে ভাগ করে, প্রতিটা দলের জন্য
              Aggregate Function গুলো আলাদা করে চালায়, আর প্রতিটা দল থেকে ঠিক একটা Row ফেরত দেয়।
              যতগুলো আলাদা মান, Result এ ততগুলো Row।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "one-row-per-group",
      subHeader: { index: "002", title: "One Row per Group" },
      title: <SectionTitle>ডাকঘরের খোপ: ভাগ করা, গোনা, এক লাইনে লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পুরনো ডাকঘরের কথা ভাবুন। সকালে বস্তা ভরে চিঠি আসে। ডাকপিয়ন সব চিঠি একসাথে গোনেন
                না। তিনি দেয়ালের খোপগুলোর সামনে দাঁড়ান, প্রতিটা খোপের গায়ে একটা জেলার নাম, আর প্রতিটা
                চিঠির ঠিকানা দেখে সেটা ঠিক খোপে রাখেন। সব চিঠি রাখা শেষ হলে তিনি একটা কাগজে লেখেন:
                ঢাকা ৪২টা, সিলেট ১৫টা, খুলনা ৯টা। খোপ যতগুলো, কাগজে লাইনও ততগুলো।
              </ContentParagraph>
              <ContentParagraph>
                GROUP BY ঠিক এই কাজটা করে। চিঠি হলো Row, ঠিকানা হলো যে Column দেখে ভাগ করছেন, আর খোপ
                হলো একটা Group, মানে একই মানের Row গুলোর একটা দল। এই লেসনে Group কে কখনো কখনো স্তূপও
                বলব, একই জিনিস। কাগজের প্রতিটা লাইন হলো Result এর একটা Row। প্রথম GROUP BY Query টা
                দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "first-group-by.sql",
          code: `SELECT status, count(*) AS bookings   -- ৩. প্রতিটা স্তূপের নাম আর গোনা
FROM bookings                          -- ১. সব Booking হাতে নেওয়া
GROUP BY status                        -- ২. status দেখে স্তূপে ভাগ
ORDER BY status;                       -- ৪. স্তূপগুলো নামের ক্রমে সাজানো`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের মন্তব্যগুলো Database এর কাজের ক্রমে নম্বর দেওয়া, যেটা Module 03 এ দেখেছেন: আগে FROM,
                তারপর GROUP BY, তারপর SELECT, শেষে ORDER BY। GROUP BY বসে FROM আর WHERE এর পরে, ORDER BY
                এর আগে। নিচের ছবিতে আসল ২৪টা Booking এর ওপর পুরো ঘটনাটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupPilesDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম GROUP BY"
              query={`SELECT status, count(*) AS bookings
FROM bookings
GROUP BY status
ORDER BY status;`}
              caption="এক Query, তিনটা Row, প্রতিটার পাশে নিজের নাম: cancelled ৩, confirmed ১৭, pending ৪। status এ চতুর্থ কোনো মান থাকলে Result এ চতুর্থ একটা Row আপনাকে না বলেই চলে আসত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                count(*) এখানে আগের লেসনের মতোই কাজ করছে, শুধু পুরো Table এর বদলে প্রতিটা দলের ভেতরে
                আলাদা করে। এটাই GROUP BY এর মূল চাবি: Aggregate Function গুলো বদলায় না, বদলায় তারা কোন
                Row গুলোর ওপর চলে। GROUP BY না থাকলে পুরো Table একটা দল, তাই উত্তর একটা। GROUP BY থাকলে
                দল যতগুলো, উত্তরও ততগুলো।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "one-column",
      subHeader: { index: "003", title: "One Column" },
      title: <SectionTitle>যেকোনো Column দিয়ে ভাগ, যেকোনো Table এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                status তো শুধু একটা উদাহরণ। যেকোনো Column দিয়ে ভাগ করা যায়, যেকোনো Table এ। প্রশ্নটা
                সবসময় একই ছাঁচের: প্রতিটা কী এর জন্য কয়টা বা কত। সেই প্রতিটা এর পরে যে শব্দটা বসে,
                সেটাই আপনার GROUP BY Column। প্রতিটা দেশে কয়জন Customer, তাই GROUP BY country। প্রতিটা
                Payment Method এ কয়টা Payment, তাই GROUP BY method।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে চারটা আলাদা Table এর চারটা ছোট Report একসাথে। প্রতিটা Query এর ছাঁচ হুবহু এক,
                শুধু Table আর Column বদলেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার Table, চারটা প্রতিটা"
              query={`-- প্রতিটা দেশে কয়জন Customer
SELECT country, count(*) AS customers
FROM customers
GROUP BY country
ORDER BY country;

-- প্রতিটা Payment Method এ কয়টা Payment
SELECT method, count(*) AS payments
FROM payments
GROUP BY method
ORDER BY method;

-- প্রতিটা ট্যুরের কয়টা তারিখ আছে
SELECT tour_id, count(*) AS departures
FROM departures
GROUP BY tour_id
ORDER BY tour_id;

-- প্রতিটা রেটিং কয়বার দেওয়া হয়েছে
SELECT rating, count(*) AS reviews
FROM reviews
GROUP BY rating
ORDER BY rating DESC;`}
              caption="Bangladesh এ ১২ জন, বাকি তিন দেশে একজন করে। bkash আর card এ সাতটা করে Payment। ট্যুর ১ এর চারটা তারিখ, ট্যুর ৭ আর ৮ এর একটা করে। আর ট্যুর ৯ পুরো তালিকায় নেই: Cox's Bazar Family Package এর কোনো Departure নেই, তাই departures Table এ তার একটা Row ও নেই, তাই কোনো দলও নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "যার Row নেই, তার দলও নেই",
          content: (
            <ContentParagraph>
              GROUP BY শুধু সেই মানগুলোর দল বানায় যেগুলো Table এর কোনো Row তে সত্যিই আছে। ট্যুর ৯ এর কোনো
              Departure নেই, তাই উপরের তৃতীয় Report এ ট্যুর ৯ এর পাশে শূন্য লেখা আসে না, ট্যুর ৯ ই আসে না।
              শূন্য সহ পুরো তালিকা পেতে হলে tours Table কে departures এর সাথে জুড়তে হয়, যেটা Module 06 এর
              LEFT JOIN এর কাজ। এই লেসনে মনে রাখুন: Result এ একটা মান না থাকা মানে সেটার Row ছিল না,
              সেটার হিসাব শূন্য না।
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
                  Marketing টিম জানতে চায় Customer রা কোন কোন দেশ থেকে আসছেন। প্রতিটা দেশের নাম আর সেই দেশের
                  Customer সংখ্যা দেখান: দুটো Column, <code className={CODE}>country</code> আর সংখ্যা।
                  Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  প্রশ্নে প্রতিটা শব্দের পরে আছে দেশ, তাই <code className={CODE}>GROUP BY country</code>।
                  গোনার জন্য <code className={CODE}>count(*)</code>, Table হলো customers।
                </>
              }
              solution={`SELECT country, count(*) AS customers
FROM customers
GROUP BY country;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-group",
      subHeader: { index: "004", title: "Watch It Group" },
      title: <SectionTitle>তিন ধাপে চোখের সামনে: Row, স্তূপ, এক Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GROUP BY এর ভেতরের কাজটা তিন ধাপে ভাবা যায়। প্রথমে WHERE পার হওয়া সব Row হাতে আসে। তারপর
                প্রতিটা Row তার Group Column এর মান দেখে একটা স্তূপে যায়। শেষে প্রতিটা স্তূপ ভেঙে একটা
                Row হয়, আর সেই Row তে বসে স্তূপের নাম আর তার হিসাবগুলো। Database ভেতরে আসলে কীভাবে কাজটা
                করে, সাজিয়ে নাকি একটা Hash Table বানিয়ে, সেটা Module 13 এর বিষয়। ফলাফল দুই উপায়েই এক।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ আসল ২৪টা Booking নিয়ে নিজে তিনটা ধাপ পার হয়ে দেখুন। তিনটা আলাদা Column দিয়ে
                ভাগ করে দেখুন স্তূপের সংখ্যা কীভাবে বদলায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupStepLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ সব Query তে ORDER BY ছিল। ORDER BY না দিলে কী হয়? Module 03 এ শিখেছেন ORDER BY ছাড়া
                Row এর ক্রমের কোনো কথা দেওয়া নেই। GROUP BY এর বেলায় এটা আরও সত্যি, কারণ ভাগ করার সময়
                Database যে কৌশল বেছে নেয়, ক্রম তার ওপর নির্ভর করে। নিচের বক্সে একই Query দুইভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY ছাড়া আর সহ"
              query={`SELECT status, count(*) AS bookings
FROM bookings
GROUP BY status;

SELECT status, count(*) AS bookings
FROM bookings
GROUP BY status
ORDER BY status;`}
              caption="এই Browser এর PostgreSQL প্রথম Query তে confirmed আগে দেখায়, তারপর cancelled আর pending। আপনার নিজের Server এ, অন্য Version এ বা Data বাড়লে এই ক্রম বদলাতে পারে। দ্বিতীয় Query এর ক্রম সবসময় একই, কারণ সেটা আপনি নিজে বলে দিয়েছেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "পুরনো MySQL এর একটা অভ্যাস",
          content: (
            <ContentParagraph>
              MySQL 5.7 আর তার আগের Version এ GROUP BY অনেক সময় নিজে থেকেই Result সাজিয়ে দিত, আর অনেকে
              তার ওপর ভরসা করে ORDER BY লিখতেন না। MySQL এর Documentation বলছে 8.0 থেকে এই নিজে থেকে সাজানো
              আর হয় না, আর নির্দিষ্ট ক্রম চাইলে ORDER BY দিতে হবে। PostgreSQL কখনোই এই কথা দেয়নি। দুই
              জায়গাতেই একটা অভ্যাস নিরাপদ: ক্রম দরকার হলে ORDER BY লিখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "measures",
      subHeader: { index: "005", title: "Measures per Group" },
      title: <SectionTitle>গোনা ছাড়াও: প্রতিটা দলের যোগ, গড়, সবচেয়ে ছোট, সবচেয়ে বড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনের পাঁচটা Aggregate Function, COUNT, SUM, AVG, MIN আর MAX, সবগুলো GROUP BY এর
                সাথে চলে, আর একই Query তে যতগুলো খুশি। প্রতিটা দলের জন্য প্রতিটা Function আলাদা করে চলে।
                ফারুক সাহেবের প্রশ্ন আসলে শুধু কয়টা ছিল না। তিনি জানতে চান প্রতিটা অবস্থায় কয়টা Booking,
                কয়টা সিট, কত টাকা, গড়ে একটা Booking কত টাকার, আর সবচেয়ে ছোট আর সবচেয়ে বড় Booking কত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা দল, ছয়টা মাপ"
              query={`SELECT status,
       count(*)              AS bookings,
       sum(seats)            AS seats,
       sum(total_bdt)        AS amount,
       round(avg(total_bdt), 2) AS avg_amount,
       min(total_bdt)        AS smallest,
       max(total_bdt)        AS largest
FROM bookings
GROUP BY status
ORDER BY status;`}
              caption="confirmed দলে ১৭টা Booking, ৩৮টা সিট, ৪২৩৬০০ টাকা, গড়ে ২৪৯১৭.৬৫ টাকা। pending এর গড় সবচেয়ে বেশি, ২৯৩০০ টাকা, কারণ চারটার একটাই ৫০০০০ টাকার। প্রতিটা Column এর পাশে একটা AS দিয়ে নাম দেওয়া, যাতে Report পড়তে গিয়ে কাউকে Query খুলে দেখতে না হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Group Column টা সংখ্যাও হতে পারে। tours Table এ duration_days দিয়ে ভাগ করলে একই দৈর্ঘ্যের
                ট্যুরগুলো এক দলে আসে, আর প্রতিটা দলের সবচেয়ে সস্তা, সবচেয়ে দামি আর গড় দাম পাশাপাশি দেখা
                যায়। এভাবে দাম ঠিক করার আগে বাজারের একটা ছবি পাওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দিনের হিসাবে ট্যুরের দাম"
              query={`SELECT duration_days,
       count(*)                 AS tours,
       min(price_bdt)           AS cheapest,
       max(price_bdt)           AS dearest,
       round(avg(price_bdt), 2) AS avg_price
FROM tours
GROUP BY duration_days
ORDER BY duration_days;`}
              caption="একদিনের ট্যুর একটাই, ৩৫০০ টাকা। তিন দিনের তিনটা ট্যুরের গড় ১৫৩৩৩.৩৩, চার দিনের দুটোর মধ্যে দামের ফারাক বিশাল: ১৪০০০ থেকে ৩২০০০। চার দিনের ট্যুরের গড় দাম ২৩০০০ বলাটা তাই একটু বিভ্রান্তিকর, কারণ কোনো ট্যুরই আসলে ২৩০০০ এর কাছাকাছি না। গড়ের পাশে MIN আর MAX রাখলে এই ফারাক চোখে পড়ে।"
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
                  Finance টিম প্রতিটা Payment Method এর হিসাব চায়: <code className={CODE}>method</code>,
                  সেই Method এ আসা সব Payment এর মোট টাকা, আর সেই Method এর সবচেয়ে বড় একক Payment। সব
                  Payment ধরবেন, status যাই হোক। তিনটা Column, এই ক্রমে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  Table payments, টাকার Column <code className={CODE}>amount_bdt</code>। মোটের জন্য{" "}
                  <code className={CODE}>sum</code>, সবচেয়ে বড়র জন্য <code className={CODE}>max</code>, ভাগ
                  method দিয়ে।
                </>
              }
              solution={`SELECT method,
       sum(amount_bdt) AS total,
       max(amount_bdt) AS largest
FROM payments
GROUP BY method;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WHERE আর GROUP BY একসাথে চলে, আর ক্রমটা মনে রাখার মতো: WHERE আগে Row ছাঁকে, তারপর বাকি Row
                গুলো ভাগ হয়। ধরুন প্রতিটা Departure এ কয়টা সিট সত্যিই নিশ্চিত হয়েছে জানতে চান। pending আর
                cancelled এর সিট এই হিসাবে আসা উচিত না, তাই আগে WHERE দিয়ে শুধু confirmed রাখবেন, তারপর
                departure_id দিয়ে ভাগ। দল বানানোর পরে ছাঁকার আলাদা একটা উপায় আছে, HAVING, যেটা পরের লেসনের
                পুরো বিষয়।
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
                  প্রতিটা Departure এ কয়টা confirmed সিট: <code className={CODE}>departure_id</code> আর সেই
                  Departure এর confirmed Booking গুলোর মোট সিট। pending আর cancelled Booking হিসাবে আসবে না।
                  দুটো Column, Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  প্রথমে <code className={CODE}>WHERE status = &apos;confirmed&apos;</code>, তারপর{" "}
                  <code className={CODE}>GROUP BY departure_id</code>, আর সিটের জন্য{" "}
                  <code className={CODE}>sum(seats)</code>। ঠিক হলে ১৩টা Row আসবে: যে ১৫টা Departure এ কোনো Booking
                  আছে, তার দুটোয় একটাও confirmed নেই।
                </>
              }
              solution={`SELECT departure_id, sum(seats) AS seats
FROM bookings
WHERE status = 'confirmed'
GROUP BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "golden-rule",
      subHeader: { index: "006", title: "The Golden Rule" },
      title: <SectionTitle>সোনালি নিয়ম: হয় ভাগের Column, নয়তো Aggregate</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই ভুলটা, যেটা GROUP BY শেখার প্রথম সপ্তাহে প্রায় সবাই করেন। ফারুক সাহেব বললেন,
                status অনুযায়ী গোনাটা দারুণ, এবার তিনি পাশে booking_id গুলোও দেখতে চান। প্রথম চেষ্টায় সবাই SELECT এ
                booking_id যোগ করে দেন। নিচের বক্সে চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Column বেশি"
              query={`SELECT status, booking_id, count(*)
FROM bookings
GROUP BY status;`}
              caption="ERROR: column &quot;bookings.booking_id&quot; must appear in the GROUP BY clause or be used in an aggregate function। Error এর ভেতরে নিয়মটা পুরোটাই লেখা: booking_id হয় GROUP BY এ থাকতে হবে, নয়তো একটা Aggregate Function এর ভেতরে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL কেন রাজি হলো না, নিচের ছবিটা দেখলেই পরিষ্কার। confirmed স্তূপে ১৭টা Row, তাদের
                booking_id ১৭টা আলাদা সংখ্যা। Result এ confirmed এর জন্য Row একটাই, তাই booking_id এর ঘরও
                একটা। কোন সংখ্যাটা সেখানে বসবে, Query তে কোথাও বলা নেই। Database আন্দাজে একটা বসিয়ে দিতে
                পারত, কিন্তু PostgreSQL আন্দাজ করে না, সে আপনাকে থামিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhichValueDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাই নিয়মটা দাঁড়ায় এমন: GROUP BY থাকলে SELECT এর প্রতিটা Column কে দুটোর একটা হতেই হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভাগের Column:</strong> যে Column দিয়ে GROUP BY করেছেন। একটা দলের ভেতরে এর মান
                  সবসময় একটাই, সংজ্ঞা অনুযায়ীই, তাই দেখাতে কোনো সমস্যা নেই।
                </ListItem>
                <ListItem>
                  <strong>Aggregate:</strong> count, sum, avg, min, max এর মতো Function, যেগুলো পুরো দলটা
                  দেখে একটা উত্তর বানায়। দলে যত Row ই থাকুক, উত্তর একটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মজার ব্যাপার হলো, GROUP BY না লিখলেও এই নিয়ম খাটে। কোনো Aggregate থাকলেই Database পুরো
                Table কে একটা দল ধরে নেয়। তখন SELECT এ আলাদা কোনো Column থাকলে সেটা ২৪টা Row এর কোনটার মান,
                সেই একই প্রশ্ন ওঠে। নিচের বক্সের দ্বিতীয় Query সেটাই দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY ছাড়া, তবু একই নিয়ম"
              query={`SELECT count(*) AS bookings
FROM bookings;

SELECT status, count(*)
FROM bookings;`}
              caption="প্রথমটা চলে, উত্তর ২৪, কারণ SELECT এ শুধু একটা Aggregate। দ্বিতীয়টায় একই Error, এবার status এর নামে: পুরো Table একটা দল, তার ভেতরে status তিন রকম, ঘর একটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Error ঠিক করার দুটো সৎ উপায়, আর কোনটা নেবেন সেটা নির্ভর করে আপনি আসলে কী জানতে
                চাইছিলেন তার ওপর। এক, Column টা সরিয়ে দিন, যদি আসলে দরকারই ছিল না। দুই, Column টাকে একটা
                Aggregate এর ভেতরে নিন, যদি দলের সম্পর্কে নির্দিষ্ট কোনো তথ্য চান: প্রথম Booking টা কোনটা,
                তাহলে min(booking_id)। শেষটা কোনটা, তাহলে max(booking_id)।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Error এর দুটো সৎ সমাধান"
              query={`SELECT status,
       count(*)        AS bookings,
       min(booking_id) AS first_booking,
       max(booking_id) AS last_booking
FROM bookings
GROUP BY status
ORDER BY status;`}
              caption="এবার প্রশ্নটা স্পষ্ট, তাই উত্তরও স্পষ্ট: cancelled দলের প্রথম Booking ৫, শেষটা ১৮। confirmed এর ১ থেকে ২৩, pending এর ১৪ থেকে ২৪। প্রতিটা ঘরে একটাই মান, কারণ প্রতিটা Column হয় ভাগের, নয়তো Aggregate।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের Lab এ সাতটা আসল Query। প্রতিটা দেখে আগে আন্দাজ করুন PostgreSQL চালাবে নাকি Error দেবে,
                তারপর আসল উত্তর দেখুন। শেষের দুটো বিশেষভাবে মন দিয়ে দেখবেন: চলে, কিন্তু উত্তরটা কাজের না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RuleCheckLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              starter={`SELECT departure_id, customer_id, count(*) AS bookings
FROM bookings
GROUP BY departure_id;`}
              task={
                <>
                  একজন সহকর্মী প্রতিটা Departure এ কয়টা Booking এসেছে দেখতে চেয়েছিলেন, কিন্তু তাঁর Query
                  Error দিচ্ছে। Query টা ঠিক করুন যাতে শুধু <code className={CODE}>departure_id</code> আর
                  Booking এর সংখ্যা আসে, দুটো Column। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  আগে Check চেপে Error টা পড়ুন। কোন Column টা ভাগের না আর Aggregate ও না? এই প্রশ্নে সেটার
                  কোনো দরকারই নেই।
                </>
              }
              solution={`SELECT departure_id, count(*) AS bookings
FROM bookings
GROUP BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "primary-key-exception",
      subHeader: { index: "007", title: "The Primary Key Exception" },
      title: <SectionTitle>নিয়মের একমাত্র ছাড়: Primary Key দিয়ে ভাগ করলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সোনালি নিয়মের পেছনের আসল প্রশ্নটা ছিল: একটা দলের ভেতরে এই Column এর কি একটাই মান? ভাগের
                Column এর বেলায় উত্তর সবসময় হ্যাঁ। কিন্তু আরেকটা জায়গায় উত্তর হ্যাঁ, আর PostgreSQL সেটা
                বোঝে। যদি Primary Key দিয়ে ভাগ করেন, তাহলে প্রতিটা দলে সেই Table এর ঠিক একটাই Row। আর একটা
                Row এর title, price_bdt, সব কিছুর মান একটাই।
              </ContentParagraph>
              <ContentParagraph>
                এই সম্পর্কটার একটা নাম আছে, Functional Dependency: একটা Column এর মান জানলে আরেকটা Column
                এর মান নিশ্চিতভাবে জানা যায়। tour_id জানলে title জানা যায়, কারণ একটা tour_id মানে একটাই
                ট্যুর। PostgreSQL এর Documentation বলছে, যে Table এর Column দেখাচ্ছেন সেই Table এর Primary Key
                যদি ভাগের Column গুলোর মধ্যে থাকে, তাহলে সেই Table এর বাকি Column গুলো ভাগ না করেও দেখানো
                যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Primary Key দিয়ে ভাগ, বনাম সাধারণ Column দিয়ে"
              query={`SELECT tour_id, title, price_bdt, count(*) AS rows_in_group
FROM tours
GROUP BY tour_id
ORDER BY tour_id
LIMIT 3;

SELECT title, price_bdt
FROM tours
GROUP BY title;`}
              caption="প্রথমটা চলে: tour_id Primary Key, তাই title আর price_bdt নিয়ে কোনো দ্বিধা নেই, আর প্রতিটা দলে Row একটাই। দ্বিতীয়টা Error দেয়, যদিও আজ কোনো দুটো ট্যুরের নাম এক না। title এর ওপর UNIQUE নিয়ম বসানো নেই, তাই Database এর কাছে কোনো নিশ্চয়তা নেই যে কাল দুটো ট্যুরের নাম এক হবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Table এর ভেতরে Primary Key দিয়ে ভাগ করা অর্থহীন মনে হতে পারে, কারণ প্রতিটা দলে একটাই
                Row, count সবসময় ১। ঠিক, এই একা Table এ এর বাস্তব কাজ কম। এই ছাড়ের আসল শক্তি দেখা যায় দুটো
                Table জোড়া দিলে। তখন একটা ট্যুরের পাশে তার অনেকগুলো Booking এর Row আসে, আর tour_id দিয়ে ভাগ
                করে title দেখানো খুব স্বাভাবিক একটা কাজ। Module 06 এ সেখানে আবার এই নিয়মে ফিরব। আজ শুধু মনে
                রাখুন ছাড়টা আছে, আর সেটা কেন যুক্তিসঙ্গত।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "several-columns",
      subHeader: { index: "008", title: "Several Columns" },
      title: <SectionTitle>দুই Column এ ভাগ: প্রতিটা জোড়ার একটা Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Finance টিমের পরের প্রশ্ন: প্রতিটা Payment Method এ কয়টা Payment সফল হয়েছে, কয়টা ব্যর্থ,
                কয়টা ফেরত দেওয়া। এখানে প্রতিটা শব্দটা দুইবার আছে, Method আর status, দুটোই। GROUP BY তে
                দুটো Column কমা দিয়ে লিখলে Database প্রতিটা আলাদা জোড়ার জন্য একটা দল বানায়। (bkash, paid)
                একটা দল, (bkash, failed) আরেকটা, (card, paid) আরেকটা।
              </ContentParagraph>
              <ContentParagraph>
                ভাবতে সুবিধা হয় যদি দুই ধাপে ভাবেন: প্রথমে Method দিয়ে স্তূপ, তারপর প্রতিটা স্তূপ আবার status
                দিয়ে ছোট স্তূপে। Database আসলে একবারেই জোড়া ধরে ভাগ করে, কিন্তু ফলাফল একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CompositeGroupsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Column এ ভাগ"
              query={`SELECT method, status, count(*) AS payments, sum(amount_bdt) AS amount
FROM payments
GROUP BY method, status
ORDER BY method, status;

SELECT country, city, count(*) AS customers
FROM customers
GROUP BY country, city
ORDER BY country, city;`}
              caption="Payment এর ছয়টা জোড়া: bkash এর তিন রকম status, বাকি তিনটা Method এর শুধু paid। Customer এর নয়টা জোড়া: Bangladesh এর ছয়টা শহর আর বিদেশের তিনটা। Result এ Row সংখ্যা আগে থেকে জানা যায় না: যতগুলো জোড়া Data তে সত্যিই আছে, ততগুলো। card আর failed এর জোড়া নেই, তাই সেই Row ও নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Column এর ক্রম কি গুরুত্বপূর্ণ?",
          content: (
            <ContentParagraph>
              GROUP BY method, status আর GROUP BY status, method একই ছয়টা দল বানায়, কারণ জোড়া জোড়াই, যে
              দিক থেকেই লিখুন। ফলাফলের ক্রম নির্ভর করে ORDER BY এর ওপর, GROUP BY এর ক্রমের ওপর না। তবে
              পড়ার সুবিধার জন্য বড় দল আগে লেখা ভালো অভ্যাস: আগে method, তারপর তার ভেতরে status, আর ORDER BY
              তে একই ক্রম।
            </ContentParagraph>
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
                  বুকিংয়ের পূর্ণ ছবি: প্রতিটা Departure এর প্রতিটা status এ কয়টা Booking। তিনটা Column:{" "}
                  <code className={CODE}>departure_id</code>, <code className={CODE}>status</code> আর সংখ্যা।
                  departure_id এর ক্রমে সাজান, একই Departure এর ভেতরে status এর বর্ণানুক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>GROUP BY departure_id, status</code> আর{" "}
                  <code className={CODE}>ORDER BY departure_id, status</code>। ঠিক হলে ১৯টা Row আসবে।
                </>
              }
              solution={`SELECT departure_id, status, count(*) AS bookings
FROM bookings
GROUP BY departure_id, status
ORDER BY departure_id, status;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "expressions",
      subHeader: { index: "009", title: "Grouping by an Expression" },
      title: <SectionTitle>হিসাব করা মান দিয়ে ভাগ: মাস, বছর, দামের স্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের সবচেয়ে প্রিয় Report হলো মাস অনুযায়ী Booking। কিন্তু bookings Table এ মাস
                নামে কোনো Column নেই, আছে booked_at, যেখানে দিন, ঘণ্টা, মিনিট সব আছে। booked_at দিয়ে সরাসরি
                ভাগ করলে প্রায় প্রতিটা Row আলাদা দল হবে, কারণ দুটো Booking একই মিনিটে হয়নি। দরকার আগে
                booked_at কে মাসে নামানো, তারপর সেই মাস দিয়ে ভাগ করা।
              </ContentParagraph>
              <ContentParagraph>
                GROUP BY শুধু Column না, যেকোনো Expression নিতে পারে, মানে Module 04 এর যেকোনো Function বা
                হিসাব। দুটো জনপ্রিয় উপায়: to_char(booked_at, &apos;YYYY-MM&apos;) দিয়ে মাসকে লেখা বানানো,
                অথবা date_trunc(&apos;month&apos;, booked_at) দিয়ে সময়টাকে মাসের প্রথম মুহূর্তে কেটে ফেলা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাস অনুযায়ী Booking, দুইভাবে"
              query={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       count(*)       AS bookings,
       sum(total_bdt) AS amount
FROM bookings
GROUP BY to_char(booked_at, 'YYYY-MM')
ORDER BY month;

SELECT date_trunc('month', booked_at)::date AS month,
       count(*) AS bookings
FROM bookings
GROUP BY date_trunc('month', booked_at)
ORDER BY month;`}
              caption="দুটো উপায়েই ছয়টা মাস, আর October 2026 এ সবচেয়ে বেশি, ৯টা Booking, ২৪৬৭০০ টাকা। প্রথমটা দেখতে সুন্দর লেখা দেয়, দ্বিতীয়টা আসল তারিখ দেয়, যেটা দিয়ে পরে আরও হিসাব করা যায়। দুটোই Dhaka সময় ধরে মাস ঠিক করছে, কারণ এই বক্সের Session এর TimeZone Asia/Dhaka।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা খুব চেনা ভুল হলো মাস বের করতে extract(month FROM ...) ব্যবহার করা। extract শুধু মাসের
                নম্বর দেয়, ১ থেকে ১২, বছরের কথা ভুলে যায়। ফলে January 2026 আর January 2027 এক দলে মিশে যায়।
                bookings এ এই মিশ্রণ চোখে পড়ে না, কারণ এখনো কোনো মাস দুই বছরে পড়েনি। departures Table এ
                পড়ে: January আর February দুটো মাসেই 2026 আর 2027 সালের Departure আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="extract(month) এর ফাঁদ"
              query={`SELECT extract(month FROM starts_on) AS month,
       count(*) AS departures
FROM departures
GROUP BY extract(month FROM starts_on)
ORDER BY month;

SELECT to_char(starts_on, 'YYYY-MM') AS month,
       count(*) AS departures
FROM departures
GROUP BY to_char(starts_on, 'YYYY-MM')
ORDER BY month;`}
              caption="প্রথম Query বলছে মাস ১ এ তিনটা Departure, মাস ২ এ তিনটা। দ্বিতীয়টা আসল ছবি দেখায়: 2026-01 এ দুটো আর 2027-01 এ একটা, 2026-02 এ দুটো আর 2027-02 এ একটা। একাধিক বছরের Data তে মাসের Report বানাতে বছরসহ মাস দিয়ে ভাগ করুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর CASE দিয়েও দল বানানো যায়। ধরুন Website এর জন্য ট্যুরগুলোকে তিনটা দামের স্তরে
                ভাগ করবেন: দশ হাজারের নিচে Saver, বিশ হাজারের নিচে Classic, বাকিটা Premium। CASE প্রতিটা
                ট্যুরকে একটা লেবেল দেয়, আর GROUP BY সেই লেবেল দিয়ে ভাগ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CASE দিয়ে বানানো দল"
              query={`SELECT CASE
         WHEN price_bdt < 10000 THEN 'Saver'
         WHEN price_bdt < 20000 THEN 'Classic'
         ELSE 'Premium'
       END AS band,
       count(*)       AS tours,
       min(price_bdt) AS from_price
FROM tours
GROUP BY band
ORDER BY from_price;`}
              caption="Saver চারটা, Classic চারটা, Premium একটা। লক্ষ করুন GROUP BY তে পুরো CASE আবার লিখতে হয়নি, শুধু band লেখা। PostgreSQL GROUP BY তে SELECT এর দেওয়া নাম চেনে। কিন্তু এই সুবিধার একটা ফাঁদ আছে, নিচে দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফাঁদটা এই: যে নাম দিলেন, সেই নামে Table এ যদি একটা আসল Column আগে থেকেই থাকে, GROUP BY
                আসল Column টাকেই নেয়, আপনার দেওয়া নাম না। PostgreSQL এর Documentation এটা স্পষ্ট লিখেছে:
                দ্বিধা হলে GROUP BY এর নাম Table এর Column হিসেবে পড়া হয়। নিচে একই CASE, শুধু নাম দেওয়া
                হয়েছে seats, যেটা bookings এর একটা আসল Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নামের ফাঁদ: একই লেবেল কয়েকবার"
              query={`SELECT CASE WHEN seats >= 3 THEN 'group' ELSE 'small' END AS seats,
       count(*)
FROM bookings
GROUP BY seats
ORDER BY seats;

SELECT CASE WHEN seats >= 3 THEN 'group' ELSE 'small' END AS size,
       count(*)
FROM bookings
GROUP BY size
ORDER BY size;`}
              caption="প্রথম Query তে পাঁচটা Row, group লেবেল তিনবার, small দুইবার, কারণ ভাগ হয়েছে আসল seats Column দিয়ে: ১, ২, ৩, ৪, ৫ সিট। কোনো Error নেই, শুধু ভুল Report। দ্বিতীয়টায় নাম size, এবার ঠিক দুটো দল: group ৬টা, small ১৮টা। নিয়ম: কোনো হিসাব করা Column কে কখনো Table এর আসল Column এর নাম দেবেন না।"
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
                  মাসিক Report: প্রতিটা মাসে কয়টা Booking হয়েছে আর মোট কত টাকার। মাসটা{" "}
                  <code className={CODE}>to_char(booked_at, &apos;YYYY-MM&apos;)</code> দিয়ে YYYY-MM আকারে
                  লেখা হবে। তিনটা Column: মাস, Booking সংখ্যা, মোট total_bdt। পুরনো মাস আগে।
                </>
              }
              hint={
                <>
                  উপরের প্রথম বক্সের প্রথম Query টাই প্রায় উত্তর। GROUP BY তে পুরো Expression লিখতে পারেন,
                  অথবা SELECT এ দেওয়া নামটা, যদি সেটা কোনো আসল Column এর নাম না হয়।
                </>
              }
              solution={`SELECT to_char(booked_at, 'YYYY-MM') AS month,
       count(*)       AS bookings,
       sum(total_bdt) AS amount
FROM bookings
GROUP BY to_char(booked_at, 'YYYY-MM')
ORDER BY month;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "null-group",
      subHeader: { index: "010", title: "NULL Is a Group Too" },
      title: <SectionTitle>NULL নিজেও একটা দল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ শিখেছেন NULL = NULL কখনো সত্য হয় না, কারণ দুটো অজানা মান সমান কিনা কেউ জানে না।
                তাহলে GROUP BY যখন একই মানের Row এক দলে রাখে, NULL ওয়ালা Row গুলোর কী হয়? প্রতিটা কি আলাদা
                দল হয়, নাকি বাদ পড়ে যায়? কোনোটাই না। ভাগ করার সময় SQL সব NULL কে এক দলে রাখে। DISTINCT
                এর বেলাতেও আপনি এই আচরণ দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                tours Table এ guide_id দিয়ে ভাগ করলে চারজন Guide এর চারটা দল আসে, আর পঞ্চম একটা দল যার
                guide_id খালি: Ratargul Swamp Boat Day, যার Guide এখনো ঠিক হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL এর দল"
              query={`SELECT guide_id,
       count(*)        AS tours,
       count(guide_id) AS tours_with_guide
FROM tours
GROUP BY guide_id
ORDER BY guide_id NULLS FIRST;

SELECT phone IS NULL AS no_phone, count(*) AS customers
FROM customers
GROUP BY phone IS NULL
ORDER BY no_phone;`}
              caption="প্রথম Row এর guide_id খালি, আর সেই দলে একটা ট্যুর। পাশের দুটো সংখ্যা দেখুন: count(*) বলছে ১, count(guide_id) বলছে ০। আগের লেসনের নিয়মই খাটছে: count(column) NULL গোনে না, আর এই দলের একমাত্র মানটাই NULL। দ্বিতীয় Query তে একটা হ্যাঁ বা না প্রশ্ন দিয়ে ভাগ: f মানে ফোন আছে, ১০ জন, t মানে নেই, ৫ জন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Report এ খালি ঘর মানে কী",
          content: (
            <ContentParagraph>
              Result এ একটা Row এর ভাগের Column খালি দেখলে সেটা ভুল না, সেটা NULL এর দল। কিন্তু Report পড়বেন
              যিনি, তিনি খালি ঘর দেখে ভাববেন Data হারিয়েছে। তাই দেখানোর সময় Module 04 এর
              COALESCE(guide_id::text, &apos;No guide yet&apos;) এর মতো একটা লেবেল বসানো ভালো। ভাগ করার
              Column হিসেবে আসল guide_id ই রাখুন, লেবেল শুধু দেখানোর জন্য।
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
                  প্রতিটা Guide এর হাতে কয়টা ট্যুর: <code className={CODE}>guide_id</code> আর ট্যুরের সংখ্যা,
                  দুটো Column। যে ট্যুরের Guide নেই, সেটাও নিজের একটা Row এ আসবে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  NULL কে আলাদা করে ধরার কিছু নেই, GROUP BY নিজেই সেটার দল বানায়। শুধু খেয়াল রাখবেন গোনার
                  জন্য <code className={CODE}>count(*)</code> নিচ্ছেন, <code className={CODE}>count(guide_id)</code>{" "}
                  না।
                </>
              }
              solution={`SELECT guide_id, count(*) AS tours
FROM tours
GROUP BY guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "ordering-groups",
      subHeader: { index: "011", title: "Ordering Groups" },
      title: <SectionTitle>দলগুলো সাজানো: সবচেয়ে বড় দল আগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Report এ সাধারণত মানুষ আগে সবচেয়ে বড় সংখ্যাটা দেখতে চায়। ORDER BY GROUP BY এর পরে চলে, তাই
                সেখানে Aggregate দিয়েই সাজানো যায়: ORDER BY count(*) DESC, অথবা SELECT এ দেওয়া নাম দিয়ে,
                ORDER BY bookings DESC। আর LIMIT যোগ করলে পাওয়া যায় শীর্ষ কয়েকটা দল।
              </ContentParagraph>
              <ContentParagraph>
                সমান হলে কী হবে, সেটা Module 03 এর ORDER BY লেসনের মতোই ঠিক করে দিতে হয়। কয়েকজন Customer এর
                দুটো করে Booking, শীর্ষ তিনে কে থাকবেন সেটা ঠিক না করলে আজ একজন, কাল আরেকজন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় দল আগে"
              query={`SELECT status, count(*) AS bookings
FROM bookings
GROUP BY status
ORDER BY bookings DESC;

SELECT method, sum(amount_bdt) AS amount
FROM payments
GROUP BY method
ORDER BY amount DESC
LIMIT 1;

SELECT customer_id, count(*) AS bookings
FROM bookings
GROUP BY customer_id
ORDER BY bookings DESC, customer_id
LIMIT 5;`}
              caption="confirmed ১৭টা নিয়ে সবার ওপরে। সবচেয়ে বেশি টাকা এসেছে card এ, ২১১৬০০। Customer ১ এর তিনটা Booking, বাকিদের সর্বোচ্চ দুটো। দুটো Booking ওয়ালা কয়েকজন আছেন, তাই customer_id দিয়ে সমতা ভাঙা হয়েছে, নইলে শীর্ষ পাঁচে কারা আসবেন সেটা নিশ্চিত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "GROUP BY 1, ORDER BY 2",
          content: (
            <ContentParagraph>
              অনেক Query তে GROUP BY 1 বা ORDER BY 2 এর মতো সংখ্যা দেখবেন। সংখ্যাটা SELECT এর কততম Column,
              সেটা বোঝায়: GROUP BY 1 মানে প্রথম Column দিয়ে ভাগ। লিখতে ছোট, আর PostgreSQL ও MySQL দুটোই বোঝে।
              কিন্তু পরে কেউ SELECT এ একটা Column যোগ করলে সংখ্যার মানে চুপচাপ বদলে যায়। Module 03 এ ORDER BY
              এর জন্য যে সতর্কতা ছিল, এখানেও তাই: দ্রুত দেখার জন্য ঠিক আছে, রেখে দেওয়া Query তে নাম লিখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8"
              orderMatters
              task={
                <>
                  সবচেয়ে বেশি Booking করা তিনজন Customer: <code className={CODE}>customer_id</code> আর তাঁর
                  Booking সংখ্যা। বেশি Booking আগে, সমান হলে ছোট customer_id আগে। ঠিক তিনটা Row।
                </>
              }
              hint={
                <>
                  <code className={CODE}>GROUP BY customer_id</code>, তারপর{" "}
                  <code className={CODE}>ORDER BY count(*) DESC, customer_id</code>, শেষে{" "}
                  <code className={CODE}>LIMIT 3</code>।
                </>
              }
              solution={`SELECT customer_id, count(*) AS bookings
FROM bookings
GROUP BY customer_id
ORDER BY bookings DESC, customer_id
LIMIT 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "group-by-vs-distinct",
      subHeader: { index: "012", title: "GROUP BY vs DISTINCT" },
      title: <SectionTitle>DISTINCT নাম বলে, GROUP BY মাপেও</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর DISTINCT লেসনে দেখেছেন SELECT DISTINCT status তিনটা আলাদা মান দেয়। SELECT status
                FROM bookings GROUP BY status ও ঠিক সেই তিনটাই দেয়। দুটোই একই স্তূপ বানায়। পার্থক্য হলো
                স্তূপ বানানোর পরে কী করতে পারেন। DISTINCT এ স্তূপের নামটুকুই পাওয়া যায়। GROUP BY তে প্রতিটা
                স্তূপের গায়ে হিসাব বসানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                তাই সিদ্ধান্তটা সহজ: শুধু আলাদা মানগুলোর তালিকা দরকার হলে DISTINCT, কারণ পড়তে পরিষ্কার।
                প্রতিটা মানের জন্য কোনো হিসাব দরকার হলে GROUP BY।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupVsDistinctSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই স্তূপ, আর ফাঁকা দলের রহস্য"
              query={`SELECT DISTINCT status FROM bookings ORDER BY status;
SELECT status FROM bookings GROUP BY status ORDER BY status;

SELECT status, count(*)
FROM bookings
WHERE status = 'refunded'
GROUP BY status;

SELECT count(*) AS bookings, sum(seats) AS seats
FROM bookings
WHERE status = 'refunded';`}
              caption="প্রথম দুটো হুবহু এক। শেষের দুটো একটা গুরুত্বপূর্ণ পার্থক্য দেখায়। refunded নামে কোনো Booking নেই। GROUP BY থাকলে কোনো দলই তৈরি হয় না, তাই Result এ শূন্যটা Row। GROUP BY না থাকলে পুরো খালি Table একটা দল, তাই একটা Row আসে: count ০ আর sum খালি, আগের লেসনের নিয়ম অনুযায়ী।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই শেষ পার্থক্যটা Dashboard বানানোর সময় অনেক ঝামেলা বাঁচায়। ধরুন Website এর একটা কার্ডে
                দেখাবেন আজ কয়টা Booking বাতিল হয়েছে। GROUP BY status দিয়ে লিখলে, আজ কোনো বাতিল না হলে
                Query কিছুই ফেরত দেয় না, আর কার্ডটা হয় খালি থাকে নয়তো App এ Error দেয়। WHERE দিয়ে ছেঁকে
                শুধু count(*) নিলে উত্তর সবসময় একটা Row, দরকার হলে ০।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ: ONLY_FULL_GROUP_BY আর তার না থাকার বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের প্রায় সব Query MySQL এ হুবহু চলে। পার্থক্য একটা জায়গায়, আর সেটা সোনালি নিয়ম নিয়ে।
                MySQL এর একটা Setting আছে, sql_mode, যেটা ঠিক করে Server কতটা কড়া হবে। সেই তালিকার একটা নাম
                ONLY_FULL_GROUP_BY। এটা চালু থাকলে MySQL ঠিক PostgreSQL এর মতো সোনালি নিয়ম মানায়। MySQL 8.4
                এর একটা নতুন Server এ এটা নিজে থেকেই চালু থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-default.sql",
          code: `SELECT @@sql_mode;
-- ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,
-- ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

SELECT status, booking_id, COUNT(*) FROM bookings GROUP BY status;
-- ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP BY clause
-- and contains nonaggregated column 'island_tours.bookings.booking_id' which is
-- not functionally dependent on columns in GROUP BY clause; this is
-- incompatible with sql_mode=only_full_group_by

SELECT status, COUNT(*) FROM bookings;
-- ERROR 1140 (42000): In aggregated query without GROUP BY, expression #1 of
-- SELECT list contains nonaggregated column 'island_tours.bookings.status';
-- this is incompatible with sql_mode=only_full_group_by`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এর Error এর লেখা আলাদা, নিয়ম একই। এমনকি Functional Dependency শব্দটাও Error এর ভেতরে
                আছে, আর Primary Key এর ছাড়টাও MySQL মানে: tours GROUP BY tour_id দিয়ে title দেখানো সেখানেও
                চলে।
              </ContentParagraph>
              <ContentParagraph>
                বিপদটা শুরু হয় যখন কেউ এই Mode বন্ধ করে দেন। পুরনো অনেক MySQL Project, পুরনো Tutorial আর
                কিছু Hosting এ এটা বন্ধ থাকে, কারণ MySQL 5.7.5 এর আগে এটা Default ছিল না। বন্ধ থাকলে MySQL কোনো
                Error দেয় না। প্রতিটা দল থেকে নিজের পছন্দমতো একটা মান তুলে বসিয়ে দেয়। নিচে একই Query, একটা
                Session এ Mode বন্ধ করে, MySQL 8.4 এ আসলে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-mode-off.sql",
          code: `SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '');

SELECT status, booking_id, customer_id, COUNT(*)
FROM bookings GROUP BY status ORDER BY status;
-- +-----------+------------+-------------+----------+
-- | status    | booking_id | customer_id | COUNT(*) |
-- +-----------+------------+-------------+----------+
-- | cancelled |          5 |           5 |        3 |
-- | confirmed |          1 |           1 |       17 |
-- | pending   |         14 |          12 |        4 |
-- +-----------+------------+-------------+----------+

SELECT status, COUNT(*) FROM bookings;
-- +-----------+----------+
-- | status    | COUNT(*) |
-- +-----------+----------+
-- | confirmed |       24 |
-- +-----------+----------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম Result দেখে মনে হয় confirmed এর booking_id ১, কিন্তু আসলে confirmed এ ১৭টা Booking,
                MySQL শুধু একটা তুলে দিয়েছে। দ্বিতীয়টা আরও ভয়ংকর: পড়লে মনে হয় ২৪টা Booking ই confirmed,
                অথচ confirmed মাত্র ১৭টা। status এর ঘরে বসেছে যেকোনো একটা Row এর মান। এমন একটা সংখ্যা একবার
                কোনো Presentation এ উঠে গেলে, কেউ কখনো জানতেও পারে না সেটা ভুল ছিল।
              </ContentParagraph>
              <ContentParagraph>
                MySQL এর Documentation নিজেই বলছে, Mode বন্ধ থাকলে Server প্রতিটা দল থেকে যেকোনো মান বেছে নিতে
                স্বাধীন, সেই মান অনির্দিষ্ট, আর ORDER BY দিয়েও কোন মান আসবে তা ঠিক করা যায় না। তাই নিরাপদ
                অভ্যাস তিনটা:
              </ContentParagraph>
              <ContentList>
                <ListItem>ONLY_FULL_GROUP_BY চালু রাখুন। নতুন MySQL এ এটা এমনিতেই চালু, বন্ধ করবেন না।</ListItem>
                <ListItem>
                  সত্যিই যদি জানেন একটা দলের ভেতরে কোনো Column এর মান সবসময় এক, অথচ MySQL সেটা বোঝে না, তখন
                  ANY_VALUE(column) লিখুন। এতে আপনি জেনেবুঝে বলছেন যেকোনোটা চলবে। PostgreSQL এ এর সমান কাজ
                  সাধারণত min(column) দিয়ে করা হয়।
                </ListItem>
                <ListItem>
                  ক্রম চাইলে ORDER BY লিখুন। Documentation অনুযায়ী MySQL 8.0 থেকে GROUP BY আর নিজে থেকে
                  সাজায় না, যেটা 5.7 পর্যন্ত কিছু ক্ষেত্রে করত।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["ভাগ না করা Column SELECT এ", "সবসময় Error 42803", "Default এ Error 1055; Mode বন্ধ হলে যেকোনো একটা মান"],
            ["Aggregate আর Column, GROUP BY ছাড়া", "Error 42803", "Default এ Error 1140; Mode বন্ধ হলে বিভ্রান্তিকর একটা Row"],
            ["Primary Key দিয়ে ভাগ করে বাকি Column", "চলে", "চলে"],
            ["GROUP BY তে SELECT এর নাম", "চলে, তবে আসল Column এর নাম আগে", "চলে, একই ফাঁদ: আসল Column আগে"],
            ["GROUP BY 1 (অবস্থান দিয়ে)", "চলে", "চলে"],
            ["NULL এর দল", "সব NULL এক দলে", "সব NULL এক দলে, ASC তে সবার আগে"],
            ["ভাগের পরে নিজে থেকে সাজানো", "কোনো কথা দেয় না", "8.0 থেকে আর সাজায় না"],
            ["মাসের লেখা", "to_char(booked_at, 'YYYY-MM')", "DATE_FORMAT(booked_at, '%Y-%m')"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>ফারুক সাহেবের রবিবারের Dashboard</SectionTitle>,
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
                Island Tours এর Admin Panel এ রবিবার সকালের Dashboard এ তিনটা কার্ড আছে, আর প্রতিটার পেছনে
                একটা করে GROUP BY Query। প্রথম কার্ড Booking এর অবস্থা দেখায়, দ্বিতীয়টা কোন Method এ কত টাকা
                এসেছে আর কোনটা আটকে আছে, তৃতীয়টা সামনের মৌসুমে মাস অনুযায়ী কয়টা Departure আর কয়টা সিট এখনো
                খালি। প্রতিটা Query একটা মাত্র Table থেকে, আর প্রতিটায় আজ যা শিখলেন তার কিছু না কিছু আছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা জিনিস আপাতত নেই: ট্যুরের নাম। তৃতীয় কার্ডে tour_id এর বদলে ট্যুরের নাম দেখাতে হলে
                departures কে tours এর সাথে জুড়তে হবে, যেটা Module 06 এর কাজ। আজকের Dashboard তাই সংখ্যা আর
                তারিখ দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Dashboard এর তিনটা কার্ড"
              query={`-- কার্ড ১: Booking এর অবস্থা
SELECT status,
       count(*)       AS bookings,
       sum(seats)     AS seats,
       sum(total_bdt) AS amount
FROM bookings
GROUP BY status
ORDER BY amount DESC;

-- কার্ড ২: কোন Method এ কী অবস্থায় কত টাকা
SELECT method, status,
       count(*)        AS payments,
       sum(amount_bdt) AS amount
FROM payments
GROUP BY method, status
ORDER BY method, status;

-- কার্ড ৩: 1 November 2026 থেকে মাস অনুযায়ী Departure আর খালি সিট
SELECT to_char(starts_on, 'YYYY-MM') AS month,
       count(*)        AS departures,
       sum(seats_left) AS free_seats
FROM departures
WHERE starts_on >= DATE '2026-11-01'
GROUP BY to_char(starts_on, 'YYYY-MM')
ORDER BY month;`}
              caption="প্রথম কার্ডে confirmed এর ৪২৩৬০০ টাকা সবার ওপরে। দ্বিতীয় কার্ডে চোখ রাখার মতো দুটো Row: bkash এর একটা failed, ৫০০০০ টাকার, আর একটা refunded, ১৭০০০ টাকার। তৃতীয় কার্ড বলছে November এ চারটা Departure এ ৬৯টা সিট খালি, সামনের মাসগুলোর মধ্যে সবচেয়ে বেশি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আপনার পালা। ফারুক সাহেব শুধু October 2026 এর একটা হিসাব চান, আর প্রতিটা অবস্থার জন্য পাঁচটা
                মাপ। এই Challenge এ এই লেসনের প্রায় সব কিছু একসাথে লাগবে: WHERE দিয়ে মাস ছাঁকা, GROUP BY,
                কয়েকটা Aggregate আর একটা Aggregate দিয়ে সাজানো।
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
                  Dhaka সময়ে October 2026 এ করা Booking গুলোর হিসাব, প্রতিটা status এর জন্য একটা Row। ছয়টা
                  Column, এই ক্রমে: <code className={CODE}>status</code>, Booking সংখ্যা, মোট সিট, মোট টাকা,
                  সবচেয়ে ছোট Booking এর টাকা, সবচেয়ে বড় Booking এর টাকা। যে অবস্থায় মোট টাকা বেশি, সেটা আগে।
                </>
              }
              hint={
                <>
                  October এর জন্য <code className={CODE}>booked_at &gt;= &apos;2026-10-01&apos; AND booked_at
                  &lt; &apos;2026-11-01&apos;</code>, এই বক্সের Session Dhaka সময়ে চলে। তারপর{" "}
                  <code className={CODE}>GROUP BY status</code>, পাঁচটা Aggregate:{" "}
                  <code className={CODE}>count(*)</code>, <code className={CODE}>sum(seats)</code>,{" "}
                  <code className={CODE}>sum(total_bdt)</code>, <code className={CODE}>min</code>,{" "}
                  <code className={CODE}>max</code>। শেষে মোট টাকা দিয়ে DESC।
                </>
              }
              solution={`SELECT status,
       count(*)       AS bookings,
       sum(seats)     AS seats,
       sum(total_bdt) AS amount,
       min(total_bdt) AS smallest,
       max(total_bdt) AS largest
FROM bookings
WHERE booked_at >= TIMESTAMPTZ '2026-10-01 00:00+06'
  AND booked_at <  TIMESTAMPTZ '2026-11-01 00:00+06'
GROUP BY status
ORDER BY amount DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো প্রতিটা প্রশ্ন থেকে GROUP BY Query, ছয় ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নতুন একটা Report এর প্রশ্ন হাতে পেলে এই ছয়টা ধাপ ধরে এগোলে Query প্রায় নিজে থেকেই লেখা হয়ে যায়।
              উদাহরণ হিসেবে প্রশ্নটা ধরুন: প্রতিটা Payment Method এ সফল Payment থেকে কত টাকা এসেছে, বেশি টাকা আগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রতিটা এর পরের শব্দটা খুঁজুন",
              description:
                "প্রতিটা Payment Method, তাই ভাগের Column method। প্রশ্নে দুটো প্রতিটা থাকলে দুটো Column। এই শব্দটাই GROUP BY তে যাবে, আর SELECT এর শুরুতেও।",
            },
            {
              title: "কী মাপবেন, ঠিক করুন",
              description:
                "কত টাকা, তাই sum(amount_bdt)। কয়টা হলে count(*), গড় হলে avg, সবচেয়ে বড় হলে max। প্রতিটা মাপের একটা নাম দিন AS দিয়ে।",
            },
            {
              title: "কোন Row গুলো হিসাবে আসবে",
              description:
                "শুধু সফল Payment, তাই WHERE status = 'paid'। এই ছাঁকা হয় ভাগের আগে, প্রতিটা Row ধরে। দলের হিসাব দেখে ছাঁকা দরকার হলে সেটা HAVING, পরের লেসনে।",
            },
            {
              title: "সোনালি নিয়ম মিলিয়ে নিন",
              description:
                "SELECT এর প্রতিটা Column দেখুন: হয় GROUP BY তে আছে, নয়তো Aggregate এর ভেতরে। কোনোটাই না হলে সেটা সরান বা Aggregate এ মুড়ে দিন।",
            },
            {
              title: "হিসাব করা মানের নাম যাচাই করুন",
              description:
                "Expression দিয়ে ভাগ করলে তার নাম যেন Table এর কোনো আসল Column এর নাম না হয়, নইলে GROUP BY আসল Column টাকে নেবে।",
            },
            {
              title: "সাজান, দরকার হলে সীমা দিন",
              description:
                "বেশি টাকা আগে, তাই ORDER BY amount DESC। সমান হতে পারলে দ্বিতীয় একটা Column দিয়ে সমতা ভাঙুন। শীর্ষ কয়েকটা চাইলে LIMIT।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "six-steps-result.sql",
          code: `SELECT method,                         -- ধাপ ১
       sum(amount_bdt) AS amount       -- ধাপ ২
FROM payments
WHERE status = 'paid'                  -- ধাপ ৩
GROUP BY method                        -- ধাপ ১ আর ৪
ORDER BY amount DESC, method;          -- ধাপ ৬
-- card 211600.00, bkash 107000.00, bank 54000.00, nagad 51000.00`,
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
          headers: ["ভুল", "কী দেখবেন", "ঠিক করার উপায়"],
          rows: [
            [
              "SELECT এ ভাগ না করা Column",
              "Error 42803: must appear in the GROUP BY clause",
              "Column টা সরান, GROUP BY তে যোগ করুন, অথবা min বা max এর ভেতরে নিন",
            ],
            [
              "ভাগের Column টাই SELECT এ নেই",
              "শুধু কয়েকটা সংখ্যা, কোনটা কার বোঝা যায় না",
              "যে Column দিয়ে ভাগ করছেন, সেটা SELECT এর শুরুতে রাখুন",
            ],
            [
              "হিসাব করা Column এর নাম আসল Column এর নামে",
              "Error নেই, একই লেবেল কয়েকবার",
              "নতুন নাম দিন, যেমন seats এর বদলে size",
            ],
            [
              "extract(month) দিয়ে মাসের Report",
              "দুই বছরের একই মাস এক দলে মিশে যায়",
              "to_char(..., 'YYYY-MM') বা date_trunc('month', ...)",
            ],
            [
              "ORDER BY ছাড়া ক্রম আশা করা",
              "আজ এক ক্রম, কাল আরেক",
              "ORDER BY লিখুন, সমান হলে দ্বিতীয় Column দিন",
            ],
            [
              "শূন্য আশা করা যেখানে Row ই নেই",
              "ট্যুর ৯ বা Departure ১৬ Result থেকে উধাও",
              "GROUP BY শুধু থাকা মানের দল বানায়; শূন্যসহ তালিকা Module 06 এর LEFT JOIN",
            ],
            [
              "NULL এর দলকে ভুল ভাবা",
              "খালি ঘরওয়ালা একটা Row",
              "এটা NULL এর দল; দেখানোর সময় COALESCE দিয়ে লেবেল দিন",
            ],
            [
              "MySQL এ ONLY_FULL_GROUP_BY বন্ধ রাখা",
              "Error নেই, কিন্তু বসানো মান এলোমেলো",
              "Mode চালু রাখুন; জেনেবুঝে হলে ANY_VALUE",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Error না আসা মানেই ঠিক উত্তর না",
          content: (
            <ContentParagraph>
              এই তালিকার সবচেয়ে বিপজ্জনক ভুলগুলো সেগুলো যেখানে কোনো Error আসে না: নামের ফাঁদ, extract(month),
              ORDER BY ছাড়া ক্রম, আর MySQL এর বন্ধ Mode। প্রতিটা নতুন Report এর পরে একটা ছোট পরীক্ষা করুন: দলগুলোর
              count(*) যোগ করে দেখুন সেটা WHERE পার হওয়া মোট Row এর সমান কিনা। bookings এর বেলায় ১৭ যোগ ৪ যোগ ৩
              সমান ২৪, তাই কোনো Row হারায়নি বা দুইবার গোনা হয়নি।
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
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : এর ভেতরের GROUP BY and HAVING Clauses অংশে GROUP BY এর সহজ ব্যাখ্যা, Product আর Sales এর
                  উদাহরণ দিয়ে, আর Primary Key দিয়ে ভাগ করলে বাকি Column দেখানোর কথা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-select.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SELECT
                  </a>
                  : GROUP BY Clause অংশে পুরো নিয়মটা আনুষ্ঠানিক ভাষায়, Functional Dependency এর সংজ্ঞা, আর দ্বিধা
                  হলে নামটা যে Table এর Column হিসেবে পড়া হয়, সেই বাক্যটা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-aggregate.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Aggregate Functions
                  </a>
                  : GROUP BY এর সাথে যে Function গুলো ব্যবহার করবেন, তাদের পুরো তালিকা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/group-by-handling.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: MySQL Handling of GROUP BY
                  </a>
                  : ONLY_FULL_GROUP_BY কী করে, বন্ধ থাকলে মান যে অনির্দিষ্ট, আর ANY_VALUE এর ব্যাখ্যা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/group-by-functional-dependence.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Detection of Functional Dependence
                  </a>
                  : MySQL কোন কোন ক্ষেত্রে বোঝে যে একটা Column আরেকটার ওপর নির্ভরশীল।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন (MySQL)
                  </a>
                  : 01:29:12 থেকে GROUP BY আর Aggregate Function এর অংশ। সেখানে MySQL দেখানো হয়েছে, তাই উপরের
                  In MySQL অংশের পার্থক্যগুলো মাথায় রেখে দেখবেন।
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
                  <strong>GROUP BY</strong> Row গুলোকে একই মান অনুযায়ী দলে ভাগ করে, প্রতিটা দলে Aggregate চালায়,
                  আর প্রতিটা দল থেকে একটা Row দেয়। প্রশ্নে প্রতিটা শব্দের পরে যা আছে, সেটাই ভাগের Column।
                </ListItem>
                <ListItem>
                  কাজের ক্রম: FROM, WHERE, GROUP BY, SELECT, ORDER BY। WHERE ভাগের আগে Row ছাঁকে।
                </ListItem>
                <ListItem>
                  <strong>সোনালি নিয়ম:</strong> SELECT এর প্রতিটা Column হয় ভাগের, নয়তো Aggregate। না হলে Error
                  42803। GROUP BY না থাকলেও, কোনো Aggregate থাকলে পুরো Table একটা দল।
                </ListItem>
                <ListItem>
                  একমাত্র ছাড়: একটা Table এর Primary Key দিয়ে ভাগ করলে সেই Table এর বাকি Column দেখানো যায়। এর
                  আসল কাজ Module 06 এর Join এর সাথে।
                </ListItem>
                <ListItem>
                  কয়েকটা Column দিয়ে ভাগ করলে প্রতিটা আলাদা জোড়া একটা দল। Expression দিয়েও ভাগ করা যায়: মাসের
                  জন্য to_char(..., &apos;YYYY-MM&apos;) বা date_trunc, extract(month) না।
                </ListItem>
                <ListItem>
                  সব NULL এক দলে যায়। যে মানের কোনো Row নেই, তার দল ও নেই, শূন্যও না।
                </ListItem>
                <ListItem>
                  হিসাব করা Column কে আসল Column এর নাম দেবেন না, আর ক্রম চাইলে ORDER BY লিখবেন।
                </ListItem>
                <ListItem>
                  MySQL এ ONLY_FULL_GROUP_BY চালু রাখুন। বন্ধ থাকলে Error এর বদলে আসে এলোমেলো মান আর ভুল Report।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে একটা প্রশ্ন বারবার পাশ কাটিয়ে গেছি: দল বানানোর পরে দলগুলো ছাঁকা যায় কীভাবে? যেমন শুধু
                সেই Customer রা, যাঁদের দুই বা তার বেশি Booking। WHERE সেটা পারে না, কারণ WHERE চলে ভাগ করার
                আগে, যখন দলই নেই। এই কাজের জন্য আছে HAVING, আর দুটোর পার্থক্য পুরোটা{" "}
                <Link href="/sql/topic/having-vs-where" className={LINK}>
                  HAVING vs WHERE
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
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ কোথায়"],
    rows: [
      ["GROUP BY", "একই মানের Row এক দলে, প্রতিটা দল থেকে একটা Row", "GROUP BY status: ৩টা Row"],
      ["প্রতি দলে Aggregate", "count, sum, avg, min, max প্রতিটা দলে আলাদা", "confirmed: ১৭টা, ৩৮ সিট, ৪২৩৬০০ টাকা"],
      ["কাজের ক্রম", "FROM, WHERE, GROUP BY, SELECT, ORDER BY", "WHERE status = 'confirmed' তারপর ভাগ"],
      ["সোনালি নিয়ম", "SELECT এ হয় ভাগের Column, নয়তো Aggregate", "booking_id যোগ করলে Error 42803"],
      ["GROUP BY ছাড়া Aggregate", "পুরো Table একটা দল", "SELECT status, count(*) Error"],
      ["Primary Key এর ছাড়", "PK দিয়ে ভাগ করলে সেই Table এর বাকি Column চলে", "GROUP BY tour_id, তারপর title"],
      ["কয়েকটা Column", "প্রতিটা আলাদা জোড়া একটা দল", "method, status: ৬টা Row"],
      ["Expression দিয়ে ভাগ", "মাস, স্তর, যেকোনো হিসাব", "to_char(booked_at, 'YYYY-MM'): ৬টা মাস"],
      ["নামের ফাঁদ", "আসল Column এর নাম আগে পড়া হয়", "AS seats দিলে ৫টা Row, AS size দিলে ২টা"],
      ["NULL এর দল", "সব NULL এক দলে", "guide_id খালি: Ratargul এর দল"],
      ["ফাঁকা দল নেই", "Row না থাকলে দলও নেই", "ট্যুর ৯ আর Departure ১৬ Result এ নেই"],
      ["DISTINCT বনাম GROUP BY", "একই স্তূপ, GROUP BY তে হিসাব বসে", "DISTINCT status বনাম count সহ"],
      ["MySQL", "ONLY_FULL_GROUP_BY চালু রাখুন", "বন্ধ থাকলে confirmed | 24"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT status, count(*) FROM bookings GROUP BY status; sample data তে কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "২৪টা, প্রতিটা Booking এর জন্য একটা",
            isCorrect: false,
            explanation: "GROUP BY Row গুলোকে দলে মিলিয়ে দেয়। প্রতিটা Booking না, প্রতিটা দল থেকে একটা Row।",
          },
          {
            key: "B",
            text: "৩টা, প্রতিটা আলাদা status এর জন্য একটা",
            isCorrect: true,
            explanation: "status এ তিন রকম মান: cancelled, confirmed, pending। যতগুলো আলাদা মান, ততগুলো Row।",
          },
          {
            key: "C",
            text: "১টা, মোট সংখ্যা ২৪",
            isCorrect: false,
            explanation: "একটা Row আসে GROUP BY না থাকলে। GROUP BY status থাকায় প্রতিটা status আলাদা দল।",
          },
          {
            key: "D",
            text: "Error, কারণ status একটা লেখা",
            isCorrect: false,
            explanation: "লেখা, সংখ্যা, তারিখ, যেকোনো Type এর Column দিয়ে ভাগ করা যায়।",
          },
        ],
      },
      {
        id: 2,
        text: "SELECT status, booking_id, count(*) FROM bookings GROUP BY status; কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "একই Query তে দুটো Column আর count(*) একসাথে দেওয়া যায় না",
            isCorrect: false,
            explanation: "যত খুশি Column আর Aggregate দেওয়া যায়, যদি প্রতিটা Column নিয়ম মানে।",
          },
          {
            key: "B",
            text: "booking_id সংখ্যা, তাই সেটা দিয়ে ভাগ করা যায় না",
            isCorrect: false,
            explanation: "সংখ্যা দিয়ে ভাগ করা যায়। সমস্যা হলো booking_id দিয়ে ভাগই করা হয়নি।",
          },
          {
            key: "C",
            text: "প্রতিটা status এর দলে অনেকগুলো booking_id, একটা Row তে কোনটা বসবে বলা নেই",
            isCorrect: true,
            explanation: "booking_id ভাগের Column না, Aggregate এর ভেতরেও না। confirmed দলে ১৭টা আলাদা মান, ঘর একটা।",
          },
          {
            key: "D",
            text: "count(*) এর আগে GROUP BY লিখতে হয়",
            isCorrect: false,
            explanation: "SELECT এ count(*) এর জায়গা ঠিক আছে। Error এর কারণ booking_id।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT guide_id, count(*) FROM tours GROUP BY guide_id; কয়টা Row দেবে, যেখানে চারজন Guide এর ট্যুর আছে আর একটা ট্যুরের guide_id NULL?",
        options: [
          {
            key: "A",
            text: "৪টা, কারণ NULL কোনো দলে আসে না",
            isCorrect: false,
            explanation: "NULL বাদ পড়ে না। GROUP BY সব NULL কে নিজেদের একটা দলে রাখে।",
          },
          {
            key: "B",
            text: "৫টা, চারজন Guide আর NULL এর একটা দল",
            isCorrect: true,
            explanation: "ভাগ করার সময় সব NULL এক দলে যায়। তাই চারটা Guide এর দল আর একটা খালি guide_id এর দল।",
          },
          {
            key: "C",
            text: "৯টা, প্রতিটা ট্যুর আলাদা, কারণ NULL = NULL সত্য না",
            isCorrect: false,
            explanation: "তুলনায় NULL = NULL সত্য না, কিন্তু ভাগ করার সময় SQL সব NULL কে এক দলে রাখে।",
          },
          {
            key: "D",
            text: "Error, কারণ NULL দিয়ে ভাগ করা যায় না",
            isCorrect: false,
            explanation: "Error হয় না। Result এ guide_id খালি একটা Row আসে।",
          },
        ],
      },
      {
        id: 4,
        text: "guide_id এর NULL দলে count(*) আর count(guide_id) কী দেখায়?",
        options: [
          {
            key: "A",
            text: "দুটোই ১",
            isCorrect: false,
            explanation: "count(guide_id) NULL গোনে না, আর এই দলের একমাত্র মানটাই NULL।",
          },
          {
            key: "B",
            text: "দুটোই ০",
            isCorrect: false,
            explanation: "count(*) Row গোনে, মান না। দলে একটা Row আছে, তাই ১।",
          },
          {
            key: "C",
            text: "count(*) ১, count(guide_id) ০",
            isCorrect: true,
            explanation: "count(*) দলের Row গোনে: ১টা। count(guide_id) শুধু NULL না এমন মান গোনে: ০টা।",
          },
          {
            key: "D",
            text: "count(*) ০, count(guide_id) ১",
            isCorrect: false,
            explanation: "উল্টো হয়ে গেছে। count(*) কখনো Row বাদ দেয় না।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT CASE WHEN seats >= 3 THEN 'group' ELSE 'small' END AS seats, count(*) FROM bookings GROUP BY seats; দুটোর বদলে পাঁচটা Row দেয়। কেন?",
        options: [
          {
            key: "A",
            text: "CASE এর ভেতরে ELSE ভুল জায়গায়",
            isCorrect: false,
            explanation: "CASE ঠিক আছে, লেবেলও ঠিক আসছে। সমস্যা হলো কোন জিনিস দিয়ে ভাগ হচ্ছে।",
          },
          {
            key: "B",
            text: "GROUP BY seats আসল seats Column দিয়ে ভাগ করছে, CASE এর নাম দিয়ে না",
            isCorrect: true,
            explanation: "দ্বিধা হলে GROUP BY এর নাম Table এর Column হিসেবে পড়া হয়। তাই ১ থেকে ৫ সিটের পাঁচটা দল।",
          },
          {
            key: "C",
            text: "count(*) এর পাশে নাম দেওয়া হয়নি",
            isCorrect: false,
            explanation: "count(*) এর নাম না থাকলেও Row সংখ্যা বদলায় না।",
          },
          {
            key: "D",
            text: "PostgreSQL GROUP BY তে কোনো নাম চেনে না",
            isCorrect: false,
            explanation: "চেনে, band এর উদাহরণে দেখেছেন। শুধু আসল Column এর নামের সাথে মিললে আসল Column আগে।",
          },
        ],
      },
      {
        id: 6,
        text: "departures এর মাস অনুযায়ী Report এ January 2026 আর January 2027 আলাদা রাখতে কোন GROUP BY ঠিক?",
        options: [
          {
            key: "A",
            text: "GROUP BY extract(month FROM starts_on)",
            isCorrect: false,
            explanation: "extract(month) শুধু ১ থেকে ১২ দেয়, তাই দুই বছরের January এক দলে মিশে যায়: তিনটা Departure।",
          },
          {
            key: "B",
            text: "GROUP BY to_char(starts_on, 'YYYY-MM')",
            isCorrect: true,
            explanation: "বছরসহ মাস: 2026-01 এ দুটো, 2027-01 এ একটা। date_trunc('month', starts_on) ও কাজ করে।",
          },
          {
            key: "C",
            text: "GROUP BY starts_on",
            isCorrect: false,
            explanation: "এতে প্রতিটা আলাদা তারিখ একটা দল, মাস না।",
          },
          {
            key: "D",
            text: "GROUP BY to_char(starts_on, 'MM')",
            isCorrect: false,
            explanation: "এটাও শুধু মাসের নম্বর, বছর বাদ। extract(month) এর মতোই মিশে যায়।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT status, count(*) FROM bookings WHERE status = 'refunded' GROUP BY status; এর ফলাফল কী?",
        options: [
          {
            key: "A",
            text: "একটা Row: refunded, ০",
            isCorrect: false,
            explanation: "refunded এর কোনো Row নেই, তাই সেই দলই তৈরি হয় না। শূন্য দেখানোর মতো কোনো দল নেই।",
          },
          {
            key: "B",
            text: "শূন্যটা Row",
            isCorrect: true,
            explanation: "GROUP BY শুধু থাকা মানের দল বানায়। GROUP BY না থাকলে উল্টোটা হতো: একটা Row, count ০।",
          },
          {
            key: "C",
            text: "Error, কারণ refunded status এর অনুমোদিত মান না",
            isCorrect: false,
            explanation: "SELECT এ যেকোনো মান দিয়ে খোঁজা যায়। CHECK নিয়ম খাটে শুধু Data ঢোকানো বা বদলানোর সময়।",
          },
          {
            key: "D",
            text: "তিনটা Row, প্রতিটা status এ ০",
            isCorrect: false,
            explanation: "WHERE আগে সব Row বাদ দিয়ে দিয়েছে, ভাগ করার মতো কিছুই বাকি নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা পুরনো MySQL Server এ ONLY_FULL_GROUP_BY বন্ধ। SELECT status, COUNT(*) FROM bookings; কী করে?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতো Error দেয়",
            isCorrect: false,
            explanation: "Mode বন্ধ থাকলে MySQL Error দেয় না। Error আসে শুধু Mode চালু থাকলে, তখন 1140।",
          },
          {
            key: "B",
            text: "তিনটা Row দেয়, প্রতিটা status এর জন্য",
            isCorrect: false,
            explanation: "GROUP BY নেই, তাই পুরো Table একটা দল। তিনটা Row আসার কোনো উপায় নেই।",
          },
          {
            key: "C",
            text: "একটা Row দেয়, যেকোনো একটা status আর ২৪, যেটা পড়লে ভুল মনে হয়",
            isCorrect: true,
            explanation: "পরীক্ষায় এসেছে confirmed | 24, যেন ২৪টাই confirmed। আসলে confirmed ১৭টা। এই নীরব ভুলটাই বিপদ।",
          },
          {
            key: "D",
            text: "Query টা চলে না, Server বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation: "Server ঠিকই চলে। সমস্যা হলো উত্তরটা নীরবে বিভ্রান্তিকর।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ফারুক সাহেবের সাপ্তাহিক Report",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>রেটিংয়ের ছবি:</strong> reviews Table থেকে প্রতিটা rating এ কয়টা Review আর তার মধ্যে কয়টায় মন্তব্য
        লেখা আছে, বড় rating আগে। count(*) আর count(comment) দুটোই নিন, আর এক লাইনে লিখুন দুটো সংখ্যা কেন আলাদা।
      </span>,
      <span key="2">
        <strong>ট্যুরের তারিখের তালিকা:</strong> departures থেকে প্রতিটা tour_id এর কয়টা তারিখ, প্রথম আর শেষ তারিখ,
        আর মোট খালি সিট। Result এ ট্যুর ৯ নেই কেন, দুই লাইনে ব্যাখ্যা করুন, আর বলুন কোন Module এ এর সমাধান শিখবেন।
      </span>,
      <span key="3">
        <strong>ইচ্ছা করে ভাঙা:</strong> নিজের লেখা একটা GROUP BY Query তে একটা ভাগ না করা Column যোগ করে Error টা
        নিজের psql এ আনুন। Error এর পুরো লেখা জমা দিন, তারপর দুইভাবে ঠিক করুন: একবার Column সরিয়ে, একবার min বা max
        দিয়ে।
      </span>,
      <span key="4">
        <strong>নামের ফাঁদ ধরা:</strong> customers Table এ এমন একটা Query লিখুন যেখানে হিসাব করা Column এর নাম
        city রাখলে ভুল ফল আসে, আর নাম বদলালে ঠিক। দুটো Result পাশাপাশি রাখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন বন্ধু MySQL এ কাজ করেন আর বলছেন GROUP BY এর নিয়ম তো কখনো
        ঝামেলা করে না। ONLY_FULL_GROUP_BY আর confirmed | 24 এর উদাহরণ দিয়ে আট লাইনে বোঝান কেন সেটা বিপজ্জনক হতে
        পারে।
      </span>,
    ],
    deliverables: [
      <span key="d1">রেটিংয়ের Query, Result আর দুই সংখ্যার পার্থক্যের ব্যাখ্যা</span>,
      <span key="d2">ট্যুরের তারিখের Query, Result আর ট্যুর ৯ এর ব্যাখ্যা</span>,
      <span key="d3">Error এর পুরো লেখা আর দুটো ঠিক করা Query</span>,
      <span key="d4">নামের ফাঁদের ভুল আর ঠিক দুটো Result</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ GROUP BY",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "এক Column এ ভাগ",
        description:
          "প্রথম ফাইল চালান। status এর তিনটা দল আর দেশের চারটা দল, মন্তব্যের সংখ্যার সাথে মেলান। তারপর দলগুলোর count যোগ করে মোটের সাথে মিলিয়ে দেখুন।",
      },
      {
        title: "প্রতিটা দলে কয়েকটা মাপ",
        description:
          "দ্বিতীয় ফাইলে status এর ছয়টা মাপ আর Payment Method এর হিসাব। avg এর পাশে min আর max দেখে বলুন গড়টা কতটা বিশ্বাসযোগ্য।",
      },
      {
        title: "সোনালি নিয়ম ভাঙা আর জোড়া",
        description:
          "তৃতীয় ফাইলের প্রথম Query Error দেবে। Error এর লেখাটা খাতায় টুকে রাখুন, তারপর দ্বিতীয় Query তে ঠিক করা রূপটা চালান।",
      },
      {
        title: "দুই Column আর মাস",
        description:
          "চতুর্থ ফাইলের শুরুতে TimeZone ঠিক করা আছে, যাতে মাসের সীমা Dhaka সময়ে পড়ে। (method, status) এর ছয়টা দল আর ছয়টা মাস মিলিয়ে দেখুন।",
      },
      {
        title: "NULL এর দল আর সাজানো",
        description:
          "পঞ্চম ফাইলে \\pset null দিয়ে NULL এর দলকে দৃশ্যমান করুন। তারপর শীর্ষ তিন Customer, সমতা ভেঙে।",
      },
      {
        title: "দুটো নীরব ফাঁদ",
        description:
          "ষষ্ঠ ফাইলে নামের ফাঁদ আর extract(month) এর ফাঁদ, প্রতিটার ভুল আর ঠিক রূপ। কোনোটাতেই Error আসবে না, তাই Row সংখ্যা মন দিয়ে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-one-column.sql",
        code: `SELECT status, count(*) AS bookings
FROM bookings GROUP BY status ORDER BY status;
-- cancelled 3, confirmed 17, pending 4   (3 rows)

SELECT country, count(*) AS customers
FROM customers GROUP BY country ORDER BY customers DESC, country;
-- Bangladesh 12, India 1, Malaysia 1, United Kingdom 1   (4 rows)`,
      },
      {
        language: "sql",
        filename: "02-measures.sql",
        code: `SELECT status, count(*) AS bookings, sum(seats) AS seats,
       sum(total_bdt) AS amount, round(avg(total_bdt), 2) AS avg_amount,
       min(total_bdt) AS smallest, max(total_bdt) AS largest
FROM bookings GROUP BY status ORDER BY status;
-- (3 rows), confirmed: 17 | 38 | 423600.00 | 24917.65 | 10500.00 | 50000.00

SELECT method, count(*) AS payments, sum(amount_bdt) AS amount
FROM payments GROUP BY method ORDER BY method;
-- bank 2, bkash 7, card 7, nagad 3   (4 rows)`,
      },
      {
        language: "sql",
        filename: "03-golden-rule.sql",
        code: `SELECT status, booking_id, count(*)
FROM bookings GROUP BY status;
-- ERROR:  column "bookings.booking_id" must appear in the GROUP BY clause
--         or be used in an aggregate function

SELECT status, count(*), min(booking_id) AS first_booking
FROM bookings GROUP BY status ORDER BY status;
-- cancelled 3 | 5, confirmed 17 | 1, pending 4 | 14   (3 rows)`,
      },
      {
        language: "sql",
        filename: "04-pairs-and-months.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT method, status, count(*) AS payments
FROM payments GROUP BY method, status ORDER BY method, status;
-- (6 rows), bkash এর তিন রকম status

SELECT to_char(booked_at, 'YYYY-MM') AS month, count(*) AS bookings
FROM bookings GROUP BY to_char(booked_at, 'YYYY-MM') ORDER BY month;
-- 2025-12 2, 2026-01 6, 2026-02 1, 2026-03 3, 2026-09 3, 2026-10 9   (6 rows)`,
      },
      {
        language: "sql",
        filename: "05-null-and-order.sql",
        code: `\\pset null '(null)'

SELECT guide_id, count(*) AS tours, count(guide_id) AS with_guide
FROM tours GROUP BY guide_id ORDER BY guide_id NULLS FIRST;
-- (null) | 1 | 0, তারপর guide 1 থেকে 4, প্রতিটায় 2   (5 rows)

SELECT customer_id, count(*) AS bookings
FROM bookings GROUP BY customer_id
ORDER BY bookings DESC, customer_id LIMIT 3;
-- 1 | 3, 2 | 2, 3 | 2   (3 rows)`,
      },
      {
        language: "sql",
        filename: "06-silent-traps.sql",
        code: `SELECT CASE WHEN seats >= 3 THEN 'group' ELSE 'small' END AS seats, count(*)
FROM bookings GROUP BY seats ORDER BY seats;
-- (5 rows), group তিনবার, small দুইবার: ভুল

SELECT CASE WHEN seats >= 3 THEN 'group' ELSE 'small' END AS size, count(*)
FROM bookings GROUP BY size ORDER BY size;
-- group 6, small 18   (2 rows): ঠিক

SELECT extract(month FROM starts_on) AS month, count(*)
FROM departures GROUP BY extract(month FROM starts_on) ORDER BY month;
-- (6 rows), মাস 1 এ 3, মাস 2 এ 3: দুই বছর মেশানো

SELECT to_char(starts_on, 'YYYY-MM') AS month, count(*)
FROM departures GROUP BY to_char(starts_on, 'YYYY-MM') ORDER BY month;
-- (8 rows), 2026-01 এ 2, 2027-01 এ 1`,
      },
    ],
    tip: (
      <>
        প্রতিটা মন্তব্যের সংখ্যা একটা নতুন Load করা island_tours থেকে নেওয়া। না মিললে আগে দেখুন আগের কোনো পরীক্ষায় Data
        বদলে গেছে কিনা, আর মাসের হিসাবের আগে SET TIME ZONE চালিয়েছেন কিনা। Sample ফাইলটা আবার চালালে সব শুরুর অবস্থায়
        ফিরে আসে।
      </>
    ),
  },
};
