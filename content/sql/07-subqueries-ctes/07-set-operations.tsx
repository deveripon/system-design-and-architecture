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
  RowCountLab,
  SetOpsLab,
} from "../../../components/course/topics/subqueries/setops-animations";
import {
  ColumnRulesDiagram,
  ModuleSevenStoryDiagram,
  PrecedenceSplit,
  StackVsPairSplit,
  VennQuartetDiagram,
} from "../../../components/course/topics/subqueries/setops-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

/** The join chain from a customer to the kind of place they travelled to. */
const TRIP_CHAIN = `FROM customers c
JOIN bookings b      ON b.customer_id = c.customer_id
JOIN departures d    ON d.departure_id = b.departure_id
JOIN tours t         ON t.tour_id = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id`;

export const setOperationsContent: TopicData = {
  id: "set-operations",
  introduction: {
    badge: "MODULE 07 · LESSON 07",
    title: <SectionTitle>দুটো ফলাফল, একটা উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের আগের ছয়টা লেসনে আপনি একটা Query কে আরেকটা Query র ভেতরে বসাতে শিখেছেন: কখনো একটা মান হিসেবে,
          কখনো একটা তালিকা হিসেবে, কখনো FROM এর ভেতরে একটা Table হিসেবে, আর WITH দিয়ে নাম দেওয়া ধাপ হিসেবে। প্রতিবার
          শেষ পর্যন্ত একটাই প্রশ্নের উত্তর এসেছে, একটা SELECT থেকে।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু কিছু প্রশ্নের উত্তর দুটো আলাদা ফলাফল জুড়ে বানাতে হয়। Customer আর Guide দুজনকেই এক তালিকায় চাই, অথচ
          দুই Table এর মধ্যে কোনো Key নেই। কারা সমুদ্রে গেছেন কিন্তু কখনো পাহাড়ে যাননি, এখানে দুটো তালিকা থেকে একটা বাদ
          দিতে হয়। কোন Departure এর একটাও Booking নেই, এখানে একটা তালিকা থেকে আরেকটা বিয়োগ করতে হয়। Join এই কাজ পারে
          না, কারণ Join দুটো Table এর Row পাশাপাশি জোড়া দেয়। এই প্রশ্নগুলোর জন্য দরকার পুরো ফলাফল উপরে নিচে বসানো,
          দুটোতে কী মিলে গেছে তা খোঁজা, অথবা একটা থেকে আরেকটা কেটে ফেলা।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজগুলোর নাম Set Operation: UNION, INTERSECT আর EXCEPT। এই লেসন শেষে আপনি জানবেন UNION ALL আর UNION এর
          পার্থক্য আর কোনটার খরচ বেশি, দুই দিকের Column মেলানোর তিনটা নিয়ম, INTERSECT আর EXCEPT কীভাবে মিল আর বাদ খোঁজে,
          ALL লাগালে ডুপ্লিকেট কীভাবে গোনা হয়, NULL এখানে কেন হঠাৎ সমান, ORDER BY আর LIMIT কোথায় বসে, বন্ধনী ছাড়া কোনটা
          আগে চলে, আর কখন Set Operation না লিখে Join বা NOT EXISTS লেখা ভালো। শেষে পুরো Module 07 এর সব হাতিয়ার একটা
          Report এ জুড়ে মডিউলটা গুছিয়ে নেবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কাউকে কারো পাশে বসাই না। একটা তালিকা শেষ হলে তার নিচে আরেকটা শুরু করি। শুধু একটা শর্ত মানতে হয়: দুই তালিকায় ঘরের সংখ্যা সমান, আর একই অবস্থানের ঘরে একই ধরনের জিনিস।",
      author: "UNION",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুই খাতা, একটা ধন্যবাদের তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকালের বৈঠকে ফারুক সাহেব জানালেন, শীতের মৌসুম শুরু হচ্ছে, আর এবার Island Tours সবাইকে একটা ধন্যবাদের
                SMS পাঠাবে। সবাই মানে যাঁরা Website এ Account খুলেছেন তাঁরা, আর যে Guide রা ট্যুরে সাথে যান তাঁরাও। SMS
                পাঠানোর Tool টা একটাই তালিকা চায়: নাম, ফোন নম্বর, আর মানুষটা Customer না Guide।
              </ContentParagraph>
              <ContentParagraph>
                কাজটা পেলেন তানিম। তিনি জানেন Customer থাকেন <code className={CODE}>customers</code> Table এ, আর Guide
                থাকেন <code className={CODE}>guides</code> Table এ। গত মডিউলে তিনি Join শিখেছেন, তাই প্রথম চিন্তা এল দুই
                Table জোড়া দেওয়ার। কিন্তু কোন Column দিয়ে? একজন Customer আর একজন Guide এর মধ্যে কোনো Key নেই। Customer এর
                Booking থাকে, Booking এর Departure, Departure এর Tour, আর সেই Tour এর একজন Guide। কিন্তু ফারুক সাহেব কে কার
                সাথে গেছেন জানতে চাননি। তিনি চান সবার নাম, একটা তালিকায়।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আপাতত দুটো আলাদা Query লিখলেন। নিচের বক্সে দুটোই আছে। চালিয়ে দেখুন দুটো তালিকা কেমন দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো আলাদা তালিকা"
              query={`SELECT full_name, phone FROM customers ORDER BY full_name;

SELECT full_name, phone FROM guides ORDER BY full_name;`}
              caption="প্রথম Query ১৫টা Row দেয়, দ্বিতীয়টা ৫টা। দুটো তালিকার চেহারা হুবহু এক: দুটো Column, প্রথমটা নাম, দ্বিতীয়টা ফোন। পাঁচজন Customer এর ফোনের ঘর খালি, কারণ তাঁরা নম্বর দেননি। SMS Tool এর দরকার এই দুটো তালিকা একটার নিচে আরেকটা, এক Result এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তানিমের সমস্যাটা আসলে খুব পরিচিত। স্কুলে দুটো সেকশনের হাজিরা খাতা থাকলে, পুরো ক্লাসের তালিকা বানাতে কেউ দুই
              খাতার নাম পাশাপাশি লেখে না। প্রথম খাতার নামগুলো লেখে, তার নিচে দ্বিতীয় খাতার নামগুলো। দুই খাতার ঘর একই রকম,
              রোল আর নাম, তাই জুড়ে দেওয়া সহজ। SQL এ এই জুড়ে দেওয়ার নাম UNION, আর তার আত্মীয় আরও তিনটা: INTERSECT, EXCEPT,
              আর তাদের ALL রূপ। এই লেসন এদের নিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Set Operation কাজ করে পুরো ফলাফল নিয়ে",
          content: (
            <ContentParagraph>
              Join কাজ করে Row ধরে ধরে: এই Row এর সাথে ওই Row এর Key মেলে কিনা। Set Operation কাজ করে দুটো সম্পূর্ণ ফলাফল
              নিয়ে: আগে দুটো Query নিজের মতো চলে, তারপর তাদের ফলাফল দুটো যোগ হয় (UNION), মিল খোঁজা হয় (INTERSECT), অথবা
              একটা থেকে আরেকটা বাদ যায় (EXCEPT)। তাই দুই দিকের Query তে যেকোনো Table, যেকোনো Join, যেকোনো WHERE থাকতে পারে,
              শুধু তাদের ফলাফলের আকার মিলতে হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "stack-not-pair",
      subHeader: { index: "002", title: "Stack, Not Pair" },
      title: <SectionTitle>পাশাপাশি না, উপরে নিচে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 06 এর পুরোটা ছিল Join নিয়ে, তাই একটা ছবিতে পার্থক্যটা পরিষ্কার করে নেওয়া দরকার। Join এর পরে ফলাফল চওড়া
                হয়: বাঁ Table এর Column, তার ডানে ডান Table এর Column, এক Row এ। Set Operation এর পরে ফলাফল লম্বা হয়: Column
                একই থাকে, প্রথম Query র Row গুলোর নিচে দ্বিতীয় Query র Row গুলো বসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StackVsPairSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তানিম যদি তবু Join দিয়ে চেষ্টা করেন, যেমন Key ছাড়া CROSS JOIN, তাহলে কী হয় দেখুন। নিচের প্রথম Query সেটাই গোনে,
              দ্বিতীয়টা দুটো তালিকা উপরে নিচে বসিয়ে গোনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়া দিলে কত, উপরে নিচে বসালে কত"
              query={`SELECT count(*) AS paired
FROM customers CROSS JOIN guides;

SELECT count(*) AS stacked
FROM (
  SELECT full_name FROM customers
  UNION ALL
  SELECT full_name FROM guides
) AS everyone;`}
              caption="paired 75: প্রত্যেক Customer এর সাথে প্রত্যেক Guide এর জোড়া, ১৫ গুণ ৫। stacked 20: ১৫ জন Customer, তার নিচে ৫ জন Guide, ১৫ যোগ ৫। দ্বিতীয় Query তে UNION ALL কে FROM এর ভেতরে রাখা হয়েছে, Lesson 04 এর Derived Table এর মতো, যাতে পুরো জোড়া তালিকা গোনা যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "Join", "Set Operation"],
          rows: [
            ["কী মেলায়", "দুই Table এর Row, Key ধরে", "দুই Query র পুরো ফলাফল"],
            ["ফলাফল বাড়ে", "পাশে, নতুন Column আসে", "নিচে, নতুন Row আসে"],
            ["কী লাগে", "একটা মেলানোর শর্ত, ON", "দুই দিকে একই সংখ্যার, একই Type এর Column"],
            ["Row সংখ্যা", "মিলের উপর নির্ভর, গুণ হতে পারে", "যোগ, মিল বা বিয়োগ, কখনো গুণ না"],
            ["উদাহরণ", "Booking এর পাশে Customer এর নাম", "Customer আর Guide এর নাম এক তালিকায়"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "union-all",
      subHeader: { index: "003", title: "UNION ALL" },
      title: <SectionTitle>যেমন আছে তেমন, একটার নিচে আরেকটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে সরল Set Operation হলো UNION ALL। দুটো SELECT লিখুন, মাঝখানে লিখুন <code className={CODE}>UNION ALL</code>।
                Database প্রথম Query চালায়, তারপর দ্বিতীয়টা, আর দুটোর সব Row একটা ফলাফলে জুড়ে দেয়। কিছু বাদ দেয় না, কিছু
                মেলায় না, ডুপ্লিকেট থাকলে সেগুলোও রেখে দেয়। Lesson 06 এ Recursive CTE র শুরুর অংশ আর পুনরাবৃত্তির অংশ জুড়তে আপনি
                এই UNION ALL ই লিখেছিলেন। এখানে তার পুরো পরিচয়।
              </ContentParagraph>
              <ContentParagraph>
                ফারুক সাহেবের তালিকায় একটা জিনিস বাকি: মানুষটা Customer না Guide। কোনো Table এ এই নামের Column নেই, কিন্তু
                দরকারও নেই। SELECT এ একটা লেখা সরাসরি বসানো যায়, যেমন <code className={CODE}>&apos;customer&apos; AS kind</code>।
                প্রথম Query র প্রতিটা Row এ বসবে customer, দ্বিতীয়টার প্রতিটা Row এ guide। এভাবে জোড়া লাগানো তালিকাতেও বোঝা যায়
                কোন Row কোথা থেকে এসেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফারুক সাহেবের ধন্যবাদের তালিকা"
              query={`SELECT full_name, phone, 'customer' AS kind
FROM customers
UNION ALL
SELECT full_name, phone, 'guide'
FROM guides
ORDER BY kind, full_name;`}
              caption="২০টা Row: প্রথমে ১৫ জন Customer নামের ক্রমে, তারপর ৫ জন Guide। kind Column এর নাম শুধু প্রথম Query তে দেওয়া, দ্বিতীয়টায় শুধু লেখা 'guide', তবু পুরো Column এর নাম kind। ORDER BY একদম শেষে, একবারই, আর সেটা পুরো জোড়া তালিকা সাজায়। এই দুটো নিয়ম পরের দুই সেকশনে বিস্তারিত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                দুই দিকের Query সম্পূর্ণ স্বাধীন। একটায় WHERE থাকতে পারে, আরেকটায় Join, তৃতীয় একটা যোগ করতে চাইলে আরেকবার
                UNION ALL লিখে আরেকটা SELECT।
              </ListItem>
              <ListItem>
                Row এর ক্রম নিয়ে কোনো কথা দেওয়া নেই। PostgreSQL এর Docs নিজেই বলে, প্রথম Query র Row আগে আসবে এমন কোনো
                নিশ্চয়তা নেই। ক্রম দরকার হলে শেষে ORDER BY।
              </ListItem>
              <ListItem>
                UNION ALL সবচেয়ে সস্তা Set Operation, কারণ Database কে কিছু তুলনা করতে হয় না। দুই তালিকা শুধু পরপর পড়ে
                পাঠিয়ে দেয়।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  সব Customer আর সব Guide এর নাম এক তালিকায় দেখান, সাথে কে কী তা লিখে। দুটো Column, এই ক্রমে: নাম, আর একটা
                  লেখা যেটা Customer এর বেলায় <code className={CODE}>customer</code> আর Guide এর বেলায়{" "}
                  <code className={CODE}>guide</code>। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  দুটো SELECT, প্রতিটায় <code className={CODE}>full_name</code> আর একটা লেখা, মাঝে{" "}
                  <code className={CODE}>UNION ALL</code>। ফোন এবার লাগবে না।
                </>
              }
              solution={`SELECT full_name AS name, 'customer' AS kind FROM customers
UNION ALL
SELECT full_name, 'guide' FROM guides;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "union",
      subHeader: { index: "004", title: "UNION" },
      title: <SectionTitle>ALL ছাড়া UNION: ডুপ্লিকেট মুছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের অন্য একটা প্রশ্ন। Island Tours এর ব্যবসা কোন কোন জায়গার নামের সাথে জড়িত? Customer রা কোন শহরে
                থাকেন, সেটা <code className={CODE}>customers.city</code> তে। ট্যুরের জায়গাগুলো কোন অঞ্চলে, সেটা{" "}
                <code className={CODE}>destinations.region</code> এ। দুটো তালিকা জুড়লেই উত্তর, কিন্তু প্রতিটা নাম একবার করে চাই।
              </ContentParagraph>
              <ContentParagraph>
                UNION ALL এ একই নাম যতবার আছে ততবার আসে। শুধু <code className={CODE}>UNION</code> লিখলে, ALL ছাড়া, Database জুড়ে
                দেওয়ার পর ডুপ্লিকেট মুছে দেয়, ঠিক Module 03 এর DISTINCT এর মতো। দুটো পাশাপাশি চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="UNION ALL বনাম UNION"
              query={`SELECT city AS place FROM customers
UNION ALL
SELECT region FROM destinations;

SELECT city AS place FROM customers
UNION
SELECT region FROM destinations
ORDER BY place;`}
              caption="প্রথমটা ২২টা Row: ১৫টা শহর আর ৭টা অঞ্চল, Dhaka ছয়বার, Chattogram ছয়বার (দুইবার শহর হিসেবে, চারবার অঞ্চল হিসেবে)। দ্বিতীয়টা মাত্র ৯টা Row, প্রতিটা নাম একবার: Barishal থেকে Sylhet পর্যন্ত। Chattogram, Khulna, Sylhet আর Barishal দুই তালিকাতেই ছিল, কিন্তু ফলাফলে একবারই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জিনিস প্রথমবার অনেককে অবাক করে: UNION শুধু দুই তালিকার মাঝের ডুপ্লিকেট মোছে না, একই তালিকার ভেতরের
                ডুপ্লিকেটও মোছে। Dhaka কোনো অঞ্চল না, শুধু শহরের তালিকায় ছয়বার আছে, তবু ফলাফলে একবার। একটা Query কে নিজের
                সাথেই UNION করলে সেটা আরও পরিষ্কার দেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                এই মোছার একটা দাম আছে। ডুপ্লিকেট খুঁজতে Database কে সব Row মনে রেখে মিলিয়ে দেখতে হয়, Hash Table বানিয়ে বা সাজিয়ে।
                UNION ALL এর এসব কিছু লাগে না। নিচের বক্সে EXPLAIN দিয়ে দুটোর Plan দেখুন। EXPLAIN Module 13 এ বিস্তারিত আসবে,
                এখন শুধু ধাপের সংখ্যাটা খেয়াল করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের সাথে UNION, আর দুটো Plan"
              query={`SELECT city FROM customers
UNION
SELECT city FROM customers
ORDER BY city;

EXPLAIN (COSTS OFF)
SELECT city FROM customers UNION SELECT region FROM destinations;

EXPLAIN (COSTS OFF)
SELECT city FROM customers UNION ALL SELECT region FROM destinations;`}
              caption="প্রথম ফলাফল ৯টা শহর, পনেরোটা না: নিজের সাথে UNION মানে DISTINCT। UNION এর Plan এ আছে HashAggregate, তার নিচে Append আর দুটো Table পড়া: আগে জোড়া, তারপর ডুপ্লিকেট মোছার আলাদা ধাপ। UNION ALL এর Plan এ শুধু Append: শুধু পড়া আর পাঠানো, মোছার ধাপ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কখন কোনটা",
          content: (
            <ContentParagraph>
              প্রশ্নটা যদি সত্যিই বলে &quot;প্রতিটা একবার&quot;, তাহলে UNION। আর যদি জানেন দুই দিকে ডুপ্লিকেট আসতেই পারে না,
              যেমন Customer আর Guide এর তালিকা যেখানে kind Column দুটোকে আলাদা রাখে, অথবা ডুপ্লিকেটই চান, যেমন গোনার জন্য,
              তাহলে UNION ALL। PostgreSQL এর Docs এর পরামর্শও এটাই: UNION ALL সাধারণত অনেক দ্রুত, তাই সম্ভব হলে ALL লিখুন।
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
                  Customer দের শহর আর Destination এর অঞ্চল মিলিয়ে সব জায়গার নাম দেখান, প্রতিটা নাম একবার, বর্ণমালার ক্রমে।
                  একটা Column।
                </>
              }
              hint={
                <>
                  ডুপ্লিকেট চাই না, তাই ALL ছাড়া <code className={CODE}>UNION</code>। সাজানো শেষে, একবার:{" "}
                  <code className={CODE}>ORDER BY</code> এ প্রথম Query র Column এর নাম।
                </>
              }
              solution={`SELECT city AS place FROM customers
UNION
SELECT region FROM destinations
ORDER BY place;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "rules",
      subHeader: { index: "005", title: "The Rules" },
      title: <SectionTitle>জোড়া লাগার তিন নিয়ম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                হাজিরা খাতার উদাহরণে দুই খাতার ঘর একই রকম ছিল বলেই জোড়া দেওয়া সহজ ছিল। SQL এ এই কথাটা তিনটা নিয়মে বাঁধা।
                PostgreSQL এর Docs দুই দিকের এই মিলকে বলে &quot;union compatible&quot;।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সংখ্যা:</strong> দুই দিকের SELECT এ Column এর সংখ্যা সমান হতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Type:</strong> একই অবস্থানের দুটো Column এর Type মিলতে হবে, অথবা এমন হতে হবে যে একটাকে আরেকটায়
                  বদলানো যায়, যেমন integer আর numeric।
                </ListItem>
                <ListItem>
                  <strong>নাম:</strong> Column মেলানো হয় অবস্থান দেখে, নাম দেখে না। ফলাফলের Column এর নাম আসে প্রথম Query
                  থেকে, দ্বিতীয়টার নাম বা Alias কোনো কাজে লাগে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ColumnRulesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম নিয়ম ভাঙলে কী হয়, দেখুন। তানিম ভুল করে Customer এর দিকে ফোন রাখলেন, Guide এর দিকে রাখলেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column এর সংখ্যা মেলেনি"
              query={`SELECT full_name, phone FROM customers
UNION
SELECT full_name FROM guides;`}
              caption="ERROR: each UNION query must have the same number of columns। বাঁ দিকে দুটো Column, ডান দিকে একটা, Database জানে না দ্বিতীয় ঘরে কী বসাবে। সমাধান দুটো: দুই দিকেই phone রাখুন, অথবা যেদিকে Column নেই সেদিকে একটা NULL বসান, পরের বক্সের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Guide দের কোনো শহর রাখা হয় না, অথচ তালিকায় শহরের Column চাই। তখন Guide এর দিকে সেই অবস্থানে একটা{" "}
              <code className={CODE}>NULL</code> বসিয়ে দিন। সংখ্যা মেলে, আর NULL যেকোনো Type এর সাথে মানিয়ে নেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যেদিকে Column নেই, সেদিকে NULL"
              query={`SELECT full_name, city
FROM customers
UNION ALL
SELECT full_name, NULL
FROM guides
ORDER BY city NULLS FIRST, full_name
LIMIT 7;`}
              caption="প্রথম ৫টা Row Guide দের, শহরের ঘর খালি, কারণ NULLS FIRST খালিগুলো আগে সাজায়। তারপর Kamal Hasan (Barishal) আর Lamia Haque (Chattogram)। NULL কে PostgreSQL প্রথম Query র city Column এর Type, মানে text হিসেবে ধরে নিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় নিয়ম। নিচের বক্সে দুটো Query। প্রথমটায় Customer এর নম্বর <code className={CODE}>::text</code> দিয়ে লেখায়
              বদলে নেওয়া হয়েছে, তাই চলে। দ্বিতীয়টায় বদলানো হয়নি, একদিকে integer আরেকদিকে text, আর PostgreSQL থেমে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Type মেলানো আর না মেলানো"
              query={`SELECT customer_id::text AS who FROM customers WHERE customer_id <= 2
UNION ALL
SELECT full_name FROM guides WHERE guide_id <= 2;

SELECT customer_id FROM customers
UNION
SELECT full_name FROM guides;`}
              caption="প্রথম Query ৪টা Row দেয়: 1, 2, Jamal Hossain, Shirin Akter, সবই লেখা। দ্বিতীয়টা থামে: UNION types integer and text cannot be matched। PostgreSQL নিজে থেকে নম্বরকে লেখা বা লেখাকে নম্বর বানায় না, Module 04 এর Casting লেসনের মতোই। MySQL এখানে আলাদা আচরণ করে, MySQL সেকশনে দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় নিয়ম, নাম। নিচের Query তে প্রথম দিকে Alias <code className={CODE}>name</code>, দ্বিতীয় দিকে{" "}
              <code className={CODE}>guide_name</code>। ফলাফলে কোনটা টিকে থাকে?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম আসে প্রথম Query থেকে"
              query={`SELECT title AS name FROM tours WHERE tour_id = 1
UNION ALL
SELECT full_name AS guide_name FROM guides WHERE guide_id = 1;`}
              caption="Column এর নাম name। দ্বিতীয় দিকের guide_name চুপচাপ হারিয়ে গেছে, কোনো Error ছাড়া। তাই একটা অভ্যাস কাজে দেয়: সব Alias প্রথম Query তে লিখুন, পরেরগুলোতে লিখলেও কোনো লাভ নেই।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "watch-it-combine",
      subHeader: { index: "006", title: "Watch It Combine" },
      title: <SectionTitle>দুটো আসল তালিকা, ছয়ভাবে মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UNION ALL আর UNION এর পর আরও দুটো Operation বাকি: INTERSECT, যেটা দুই তালিকার মিল রাখে, আর EXCEPT, যেটা প্রথম
                তালিকা থেকে দ্বিতীয়টা বাদ দেয়। পরের দুই সেকশনে প্রতিটা আলাদা করে দেখবেন। তার আগে নিচের Lab এ ছয়টাকেই একসাথে
                নেড়েচেড়ে দেখুন।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা জোড়া তালিকা আছে, তিনটাই Sample Database এর আসল Row। শহর বনাম অঞ্চল আগের সেকশন থেকে চেনা। সমুদ্র বনাম পাহাড়
                মানে যাঁরা island বা beach এর ট্যুরে বুক করেছেন, আর যাঁরা hills এর ট্যুরে, একজনের একাধিক Booking থাকলে নামও
                একাধিকবার। Departure বনাম Booking মানে সব Departure এর নম্বর, আর Booking গুলোতে যে Departure এর নম্বর আছে। একটা
                তালিকা আর একটা Operation বাছুন, দেখুন কোন মান ফলাফলে পৌঁছায় আর কোনটা কাটা পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SetOpsLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমুদ্র আর পাহাড়ের দুটো দলকে মানুষ হিসেবে গুনলে, প্রতিটা নাম একবার, ছবিটা দাঁড়ায় দুটো আংশিক মেলানো বৃত্তের মতো।
              চারটা Operation সেই ছবির চারটা আলাদা অংশে রঙ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <VennQuartetDiagram />,
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "intersect",
      subHeader: { index: "007", title: "INTERSECT" },
      title: <SectionTitle>দুই তালিকাতেই যা আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>INTERSECT</code> শুধু সেই Row রাখে যেটা প্রথম Query র ফলাফলেও আছে, দ্বিতীয়টার ফলাফলেও।
                বাকি সব বাদ। UNION এর মতোই ALL ছাড়া লিখলে প্রতিটা মিল একবার আসে। লেখার নিয়ম একই: দুটো SELECT, মাঝে
                INTERSECT, Column এর সংখ্যা আর Type মিলতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                মিল খোঁজা হয় পুরো Row ধরে। এক Column হলে সেই একটা মান মিলতে হয়, দুই Column হলে দুটোই একসাথে মিলতে হয়। নিচের
                বক্সে প্রথমে শহর আর অঞ্চলের মিল, তারপর একটা ব্যবসার প্রশ্ন: কোন Customer এর একটা confirmed Booking আছে, আবার
                একটা pending Booking ও আছে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মিল খোঁজা"
              query={`SELECT city FROM customers
INTERSECT
SELECT region FROM destinations
ORDER BY city;

SELECT customer_id FROM bookings WHERE status = 'confirmed'
INTERSECT
SELECT customer_id FROM bookings WHERE status = 'pending'
ORDER BY customer_id;`}
              caption="প্রথম ফলাফল ৪টা: Barishal, Chattogram, Khulna, Sylhet, যে চারটা নাম শহরও আবার অঞ্চলও। দ্বিতীয়টা ৩টা: Customer 1, 9 আর 13, মানে Rahim Uddin, Priya Sharma আর Shuvo Das। তাঁদের একটা ট্যুর নিশ্চিত, আরেকটা এখনো টাকার অপেক্ষায়। দুটো Query একই Table থেকে, শুধু WHERE আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "INTERSECT দুই দিক থেকে একই",
          content: (
            <ContentParagraph>
              A INTERSECT B আর B INTERSECT A একই ফলাফল দেয়, শুধু Column এর নাম আসে যেটা প্রথমে লেখা তার থেকে। UNION ও তাই।
              EXCEPT এর বেলায় এটা আর সত্য না, পরের সেকশনে দেখবেন।
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
                  কোন Customer রা সমুদ্রের ট্যুরেও গেছেন আবার পাহাড়ের ট্যুরেও? সমুদ্র মানে Destination এর{" "}
                  <code className={CODE}>kind</code> island বা beach, পাহাড় মানে hills। Booking এর status যা খুশি হতে পারে। দুটো
                  Column: <code className={CODE}>customer_id</code> আর <code className={CODE}>full_name</code>। ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  দুটো SELECT, প্রতিটায় customers থেকে destinations পর্যন্ত চারটা Join, শুধু WHERE আলাদা:{" "}
                  <code className={CODE}>ds.kind IN (&apos;island&apos;, &apos;beach&apos;)</code> আর{" "}
                  <code className={CODE}>ds.kind = &apos;hills&apos;</code>। মাঝে <code className={CODE}>INTERSECT</code>। একই মানুষ
                  একাধিকবার এলেও INTERSECT তাঁকে একবারই রাখবে।
                </>
              }
              solution={`SELECT c.customer_id, c.full_name
${TRIP_CHAIN}
WHERE ds.kind IN ('island', 'beach')
INTERSECT
SELECT c.customer_id, c.full_name
${TRIP_CHAIN}
WHERE ds.kind = 'hills';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "except",
      subHeader: { index: "008", title: "EXCEPT" },
      title: <SectionTitle>প্রথমটায় আছে, দ্বিতীয়টায় নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>EXCEPT</code> প্রথম Query র ফলাফল থেকে সেই Row গুলো কেটে দেয় যেগুলো দ্বিতীয়টার ফলাফলে
                আছে। যা বাকি থাকে, সেটাই উত্তর, প্রতিটা একবার। হিসাবের ভাষায় এটা বিয়োগ, আর বিয়োগে দিক গুরুত্বপূর্ণ: ১০ থেকে ৩ বাদ
                আর ৩ থেকে ১০ বাদ এক জিনিস না। A EXCEPT B আর B EXCEPT A সাধারণত আলাদা উত্তর দেয়।
              </ContentParagraph>
              <ContentParagraph>
                Oracle Database এ একই কাজের নাম MINUS। MySQL আর PostgreSQL দুটোই EXCEPT লেখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই দিকের বিয়োগ, আর খালি Departure"
              query={`SELECT city FROM customers
EXCEPT
SELECT region FROM destinations
ORDER BY city;

SELECT region FROM destinations
EXCEPT
SELECT city FROM customers;

SELECT departure_id FROM departures
EXCEPT
SELECT departure_id FROM bookings;`}
              caption="প্রথমটা ৫টা শহর: Dhaka, Kolkata, Kuala Lumpur, London, Rajshahi, যেখানে Customer থাকেন কিন্তু কোনো ট্যুর হয় না। দ্বিতীয়টা ফাঁকা: প্রতিটা অঞ্চলে অন্তত একজন Customer থাকেন। একই দুটো তালিকা, দিক উল্টালে উত্তর ৫ থেকে ০। তৃতীয়টা Departure 16, যার একটাও Booking নেই। সেটা বন্ধ Saint Martin Luxury Stay এর ফেব্রুয়ারির তারিখ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Marketing টিম একটা প্রচার চালাতে চায়: যাঁরা সৈকতে ঘুরে এসেছেন কিন্তু কখনো পাহাড়ে যাননি, তাঁদের বান্দরবানের
              অফার। এটা ঠিক EXCEPT এর প্রশ্ন: সৈকতের যাত্রীদের তালিকা থেকে পাহাড়ের যাত্রীদের বাদ। নিচে নিজে লিখে দেখুন।
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
                  যাঁরা কোনো beach এর ট্যুরে বুক করেছেন (Destination এর <code className={CODE}>kind</code> ঠিক beach, island না)
                  কিন্তু কখনো hills এর ট্যুরে বুক করেননি, তাঁদের নাম দেখান। একটা Column,{" "}
                  <code className={CODE}>full_name</code>। Booking এর status যা খুশি। ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  Exercise 3 এর মতোই দুটো SELECT, শুধু প্রথমটায় <code className={CODE}>ds.kind = &apos;beach&apos;</code> আর মাঝে{" "}
                  <code className={CODE}>EXCEPT</code>। কোনটা আগে লিখবেন, ভেবে নিন: বাদ যাবে পাহাড়ের যাত্রীরা।
                </>
              }
              solution={`SELECT c.full_name
${TRIP_CHAIN}
WHERE ds.kind = 'beach'
EXCEPT
SELECT c.full_name
${TRIP_CHAIN}
WHERE ds.kind = 'hills';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "all-and-null",
      subHeader: { index: "009", title: "Duplicates and NULLs" },
      title: <SectionTitle>ALL দিয়ে গোনা, আর NULL এর সমতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UNION এর মতো INTERSECT আর EXCEPT এরও ALL রূপ আছে, আর তারা ডুপ্লিকেট মোছে না, গোনে। নিয়মটা PostgreSQL এর Docs এ
                এভাবে লেখা: কোনো Row বাঁ দিকে m বার আর ডান দিকে n বার থাকলে, INTERSECT ALL এ সেটা আসে m আর n এর মধ্যে যেটা
                ছোট ততবার, আর EXCEPT ALL এ আসে m থেকে n বাদ দিলে যা থাকে ততবার, শূন্যের নিচে না।
              </ContentParagraph>
              <ContentParagraph>
                শহর আর অঞ্চলের তালিকায় হিসাবটা হাতে করে দেখুন। Chattogram শহর হিসেবে আছে ২ বার, অঞ্চল হিসেবে ৪ বার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নাম", "শহরে (m)", "অঞ্চলে (n)", "INTERSECT ALL", "শহর EXCEPT ALL অঞ্চল", "অঞ্চল EXCEPT ALL শহর"],
          rows: [
            ["Chattogram", "২", "৪", "২", "০", "২"],
            ["Barishal", "১", "১", "১", "০", "০"],
            ["Khulna", "১", "১", "১", "০", "০"],
            ["Sylhet", "১", "১", "১", "০", "০"],
            ["Dhaka", "৬", "০", "০", "৬", "০"],
            ["বাকি চারটা শহর", "১ করে", "০", "০", "১ করে", "০"],
            ["মোট Row", "১৫", "৭", "৫", "১০", "২"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ALL রূপ: মিল আর বিয়োগ, গুনে গুনে"
              query={`SELECT city FROM customers
INTERSECT ALL
SELECT region FROM destinations
ORDER BY city;

SELECT city FROM customers
EXCEPT ALL
SELECT region FROM destinations
ORDER BY city;

SELECT region FROM destinations
EXCEPT ALL
SELECT city FROM customers;`}
              caption="৫টা, ১০টা আর ২টা Row, ঠিক উপরের Table এর মতো। প্রথমটায় Chattogram দুইবার। দ্বিতীয়টায় Dhaka ছয়বার আর Chattogram একবারও না, কারণ শহরের দুটো Chattogram অঞ্চলের চারটার সাথে কাটা পড়েছে। তৃতীয়টায় Chattogram দুইবার: অঞ্চলের চারটা থেকে শহরের দুটো বাদ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার NULL। Module 03 থেকে আপনি জানেন <code className={CODE}>NULL = NULL</code> সত্য না, অজানা। তাই WHERE এ NULL
                কখনো কারো সাথে মেলে না, আর Lesson 02 এ দেখেছেন NOT IN এর তালিকায় একটা NULL থাকলে পুরো উত্তর ফাঁকা হয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                Set Operation এখানে আলাদা নিয়ম মানে। DISTINCT এর মতোই, ডুপ্লিকেট খোঁজার সময় দুটো NULL কে একই মান ধরা হয়। তাই
                INTERSECT এ দুই দিকের NULL মেলে, আর EXCEPT এ ডান দিকের NULL বাঁ দিকের কোনো সাধারণ মানকে বিভ্রান্ত করে না।
                নিচের বক্সে পরপর চারটা Query: প্রথমটা দেখায় সমান চিহ্ন কী বলে, দ্বিতীয়টা দেখায় INTERSECT কী বলে, শেষ দুটো একই
                প্রশ্ন দুইভাবে: কোন Guide এর কোনো ট্যুর নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL: সমান চিহ্নে অজানা, Set Operation এ সমান"
              query={`SELECT NULL = NULL AS equal;

SELECT NULL::text AS value
INTERSECT
SELECT NULL::text;

SELECT guide_id FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours);

SELECT guide_id FROM guides
EXCEPT
SELECT guide_id FROM tours;`}
              caption="প্রথমটা খালি ঘর, মানে NULL, অজানা। দ্বিতীয়টা একটা Row, যার মান NULL: দুটো NULL মিলেছে। তৃতীয়টা ফাঁকা, ০টা Row, কারণ tours এর guide_id তে Ratargul এর NULL আছে, আর NOT IN তখন কাউকে নিশ্চিত করতে পারে না। চতুর্থটা একটা Row: 5, মানে Nazmul Karim। একই প্রশ্ন, EXCEPT ঠিক উত্তর দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "EXCEPT, NOT IN এর ফাঁদে পড়ে না",
          content: (
            <ContentParagraph>
              &quot;প্রথম তালিকায় আছে কিন্তু দ্বিতীয়টায় নেই&quot; ধরনের প্রশ্নে NOT IN সবচেয়ে বিপজ্জনক, কারণ দ্বিতীয় তালিকায় একটা NULL
              ঢুকলেই নিঃশব্দে সব উত্তর হারিয়ে যায়। EXCEPT আর NOT EXISTS দুটোই এই ফাঁদ থেকে নিরাপদ। কোনটা কখন ভালো, সেটা
              Section 012 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "order-limit",
      subHeader: { index: "010", title: "ORDER BY and LIMIT" },
      title: <SectionTitle>সাজানো আর কাটা, পুরো ফলাফলের উপর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Set Operation এর শেষে ORDER BY বা LIMIT লিখলে সেটা শেষ SELECT এর না, পুরো জোড়া ফলাফলের। Database আগে
                দুই দিক মিলিয়ে শেষ করে, তারপর পুরোটা সাজায়, তারপর কাটে। তাই নিচের Query তে LIMIT 5 মানে পুরো তালিকার প্রথম ৫টা নাম,
                Guide দের থেকে ৫টা না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY আর LIMIT পুরো তালিকার উপর"
              query={`SELECT full_name AS name, 'customer' AS kind FROM customers
UNION ALL
SELECT full_name, 'guide' FROM guides
ORDER BY name
LIMIT 5;`}
              caption="৫টা Row: Aiman Zulkifli, Arif Chowdhury, Ayesha Siddiqua, Farhana Akter, Imran Kabir। তৃতীয়জন Guide, বাকিরা Customer। বিশজনকে একসাথে বর্ণমালায় সাজিয়ে তারপর প্রথম পাঁচজন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ORDER BY এর দুটো সীমা আছে, দুটোই এই কারণে যে সাজানোর সময় আর কোনো Table নেই, আছে শুধু জোড়া ফলাফল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ফলাফলে যে Column নেই, তা দিয়ে সাজানো যায় না, Table এ সেটা থাকলেও। একটা সাধারণ SELECT এ আপনি এমন Column দিয়েও
                  সাজাতে পারেন যা দেখাচ্ছেন না। UNION এর পরে সেটা আর হয় না।
                </ListItem>
                <ListItem>
                  PostgreSQL এ শুধু Column এর নাম বা অবস্থানের নম্বর দিয়ে সাজানো যায়, কোনো হিসাব বা Function দিয়ে না। Docs এর ভাষায়
                  এটা এই Feature এর একটা সীমাবদ্ধতা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফলাফলে নেই এমন Column দিয়ে সাজানো"
              query={`SELECT full_name FROM customers
UNION ALL
SELECT full_name FROM guides
ORDER BY city;`}
              caption="ERROR: column &quot;city&quot; does not exist। customers Table এ city আছে, কিন্তু জোড়া ফলাফলে Column শুধু একটা, full_name। Guide দের তো শহরই নেই, Database কীভাবে তাঁদের সাজাবে? সমাধান: city দুই দিকেই SELECT এ আনুন, Guide এর দিকে NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              হিসাব করে সাজাতে চাইলে, যেমন নামের দৈর্ঘ্য ধরে, পুরো UNION কে FROM এর ভেতরে Derived Table বানিয়ে নিন। বাইরের
              SELECT তখন একটা সাধারণ Table দেখে, আর সেখানে যেকোনো ORDER BY চলে। নিচের বক্সে আগে এই সমাধান, তারপর সরাসরি
              লেখার চেষ্টা আর তার Error।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হিসাব দিয়ে সাজানো: ভেতরে UNION, বাইরে ORDER BY"
              query={`SELECT name, length(name) AS letters
FROM (
  SELECT full_name AS name FROM customers
  UNION ALL
  SELECT full_name FROM guides
) AS everyone
ORDER BY length(name) DESC, name
LIMIT 3;

SELECT full_name FROM customers
UNION ALL
SELECT full_name FROM guides
ORDER BY length(full_name) DESC;`}
              caption="প্রথমটা চলে: Ayesha Siddiqua (15 অক্ষর), Aiman Zulkifli আর Arif Chowdhury (14 করে)। দ্বিতীয়টা থামে: invalid UNION/INTERSECT/EXCEPT ORDER BY clause। DETAIL বলে শুধু ফলাফলের Column এর নাম চলবে, HINT বলে UNION কে FROM এর ভেতরে নিন, ঠিক প্রথম Query যা করেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ প্রশ্ন: যদি LIMIT একটা দিকের উপর চাই? যেমন সবচেয়ে দামি দুটো ট্যুর আর সবচেয়ে সস্তা দুটো ট্যুর, এক তালিকায়।
                তখন প্রতিটা দিককে নিজের বন্ধনীতে রাখুন। বন্ধনীর ভেতরের ORDER BY আর LIMIT শুধু সেই দিকের, বন্ধনীর বাইরের ORDER BY
                পুরো ফলাফলের। বন্ধনী ছাড়া প্রথম দিকে ORDER BY লিখলে PostgreSQL সেটা মানেই না: syntax error at or near
                &quot;UNION&quot;।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা দিকে আলাদা LIMIT, বন্ধনী দিয়ে"
              query={`(SELECT title, price_bdt FROM tours ORDER BY price_bdt DESC LIMIT 2)
UNION ALL
(SELECT title, price_bdt FROM tours ORDER BY price_bdt LIMIT 2)
ORDER BY price_bdt DESC;`}
              caption="৪টা Row: Saint Martin Luxury Stay 32000.00, Sundarbans Mangrove Cruise 18000.00, Sylhet Tea Garden Tour 7800.00, Ratargul Swamp Boat Day 3500.00। প্রথম বন্ধনী দুটো সবচেয়ে দামি আনে, দ্বিতীয়টা দুটো সবচেয়ে সস্তা, আর শেষের ORDER BY চারটাকে দাম ধরে সাজায়।"
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
                  সবচেয়ে নতুন দুজন Customer আর সবচেয়ে পুরনো দুজন Customer, এক তালিকায়। নতুন পুরনো মাপা হবে{" "}
                  <code className={CODE}>joined_at</code> দিয়ে। দুটো Column: <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>joined_at</code>। পুরো তালিকা সাজানো থাকবে সবচেয়ে নতুন থেকে সবচেয়ে পুরনো।
                </>
              }
              hint={
                <>
                  দুটো দিক, প্রতিটা বন্ধনীতে, প্রতিটায় নিজের ORDER BY আর <code className={CODE}>LIMIT 2</code>: একটায় DESC, আরেকটায়
                  ছাড়া। মাঝে <code className={CODE}>UNION ALL</code>, আর শেষে বন্ধনীর বাইরে{" "}
                  <code className={CODE}>ORDER BY joined_at DESC</code>।
                </>
              }
              solution={`(SELECT full_name, joined_at FROM customers ORDER BY joined_at DESC LIMIT 2)
UNION ALL
(SELECT full_name, joined_at FROM customers ORDER BY joined_at LIMIT 2)
ORDER BY joined_at DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "precedence",
      subHeader: { index: "011", title: "Precedence" },
      title: <SectionTitle>তিনটা জুড়লে কোনটা আগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Query তে দুইয়ের বেশি SELECT জোড়া যায়: A UNION B UNION C, বা A UNION B EXCEPT C। প্রশ্ন হলো কোনটা আগে চলে।
                অঙ্কের ক্লাসে গুণ যেমন যোগের আগে, SQL এও তেমন একটা নিয়ম আছে। PostgreSQL এর Docs এ নিয়মটা এভাবে লেখা, আর MySQL এর Docs ও বলে INTERSECT আগে চলে:
              </ContentParagraph>
              <ContentList>
                <ListItem>INTERSECT আগে চলে, UNION আর EXCEPT এর চেয়ে শক্ত করে বাঁধে।</ListItem>
                <ListItem>UNION আর EXCEPT সমান ক্ষমতার, তারা বাঁ থেকে ডানে চলে।</ListItem>
                <ListItem>বন্ধনী থাকলে বন্ধনীর ভেতরেরটা আগে, সবসময়।</ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PrecedenceSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছোট সংখ্যার তালিকায় নিয়মটা নিজে চালিয়ে দেখুন। <code className={CODE}>VALUES (1), (2)</code> মানে দুই Row এর একটা
              ছোট Table, Module 06 এর CROSS JOIN লেসনে যেমন দেখেছেন। নিচে চারটা Query, প্রতিটা জোড়ায় শুধু বন্ধনীর পার্থক্য।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বন্ধনী ছাড়া আর বন্ধনী দিয়ে"
              query={`VALUES (1), (2) UNION VALUES (2), (3) INTERSECT VALUES (3);

(VALUES (1), (2) UNION VALUES (2), (3)) INTERSECT VALUES (3);

VALUES (1), (2), (3) EXCEPT VALUES (2) UNION VALUES (2);

VALUES (1), (2), (3) EXCEPT (VALUES (2) UNION VALUES (2));`}
              caption="প্রথমটা 1, 2, 3: INTERSECT আগে চলে {3} দিয়েছে, তারপর UNION। দ্বিতীয়টা শুধু 3: বন্ধনী UNION কে আগে চালিয়েছে। তৃতীয়টা 1, 2, 3: বাঁ থেকে ডানে, আগে 2 বাদ, তারপর আবার 2 যোগ। চতুর্থটা 1 আর 3: বন্ধনী আগে {2} বানিয়েছে, তারপর সেটা বাদ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মেশালে বন্ধনী দিন",
          content: (
            <ContentParagraph>
              নিয়মগুলো মুখস্থ রাখার চেয়ে সহজ একটা অভ্যাস: একই Query তে দুই রকম Set Operation মেশালেই বন্ধনী দিন। যিনি পরে
              Query টা পড়বেন, তাঁকে আর ভাবতে হবে না কোনটা আগে চলে। ফলাফল বদলায় না, শুধু পড়া সহজ হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowCountLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "set-or-join",
      subHeader: { index: "012", title: "Set Operation or Join?" },
      title: <SectionTitle>EXCEPT, NOT EXISTS, না OR?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউল আর আগের মডিউলে একই প্রশ্নের কয়েকটা করে উত্তর দেখেছেন। কোন Customer কখনো বুক করেননি: Module 06 এর
                LEFT JOIN লেসনে IS NULL দিয়ে, Module 06 এর Semi আর Anti Join লেসনে আর এই মডিউলের Lesson 02 এ NOT EXISTS দিয়ে,
                আর এখন EXCEPT দিয়ে। তিনটাই ঠিক। তাহলে কোনটা কখন?
              </ContentParagraph>
              <ContentParagraph>
                পার্থক্যটা বোঝা যায় যখন উত্তরে আরও তথ্য লাগে। EXCEPT পুরো Row মেলায়, তাই দুই দিকে একই Column লাগে। Customer এর
                নাম চাইলে দুই দিকেই নাম আনতে হয়, Join সহ। Customer এর যোগদানের তারিখ আর শহরও চাইলে সেগুলোও দুই দিকে। NOT EXISTS
                এ এই ঝামেলা নেই: বাইরের SELECT এ যা খুশি দেখানো যায়, ভেতরের Subquery শুধু হ্যাঁ বা না বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, EXCEPT আর NOT EXISTS"
              query={`SELECT customer_id, full_name FROM customers
EXCEPT
SELECT c.customer_id, c.full_name
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;

SELECT c.customer_id, c.full_name, c.city, c.joined_at
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id
);`}
              caption="দুটোই একজনকে দেয়: Customer 15, Imran Kabir। EXCEPT এ নাম আনতে দ্বিতীয় দিকেও customers জোড়া দিতে হয়েছে, কারণ বিয়োগ হয় পুরো Row ধরে। NOT EXISTS সহজেই শহর আর যোগদানের সময়ও দেখায়: Dhaka, 2026-10-05 22:05:00+06।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা প্রলোভন: একই Table থেকে দুটো শর্তের তালিকা UNION করা, যেমন Dhaka র Customer আর বিদেশি Customer। এটা চলে,
              কিন্তু একই Table হলে WHERE এ OR লিখলেই একই উত্তর আসে, আর Table পড়তে হয় একবার।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Table এ UNION আর OR"
              query={`SELECT full_name FROM customers WHERE city = 'Dhaka'
UNION
SELECT full_name FROM customers WHERE country <> 'Bangladesh'
ORDER BY full_name;

SELECT full_name FROM customers
WHERE city = 'Dhaka' OR country <> 'Bangladesh'
ORDER BY full_name;`}
              caption="দুটোই ৯ জন, একই নাম, একই ক্রমে: Dhaka র ৬ জন আর দেশের বাইরের ৩ জন। দ্বিতীয়টা ছোট, পরিষ্কার, আর Table একবার পড়ে। UNION এর জায়গা তখন, যখন দুই দিকের উৎস সত্যিই আলাদা: আলাদা Table, বা আলাদা Join।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্নের ধরন", "ভালো পছন্দ", "কেন"],
          rows: [
            ["দুই আলাদা উৎসের তালিকা এক জায়গায়", "UNION ALL (বা UNION)", "Customer আর Guide এর মধ্যে কোনো Key নেই, Join অসম্ভব"],
            ["একই Table, দুই শর্ত", "WHERE ... OR ...", "একবার পড়া, ছোট লেখা"],
            ["আছে কিন্তু নেই, শুধু Key বা ছোট Row", "EXCEPT", "NULL নিরাপদ, পরিষ্কার, প্রতিটা একবার"],
            ["আছে কিন্তু নেই, সাথে আরও অনেক Column", "NOT EXISTS", "বাইরের SELECT এ যা খুশি দেখানো যায়"],
            ["দুই তালিকাতেই আছে", "INTERSECT বা EXISTS", "Key এর তালিকা হলে INTERSECT, বেশি তথ্য লাগলে EXISTS"],
            ["ডুপ্লিকেট গুনে মেলানো", "INTERSECT ALL, EXCEPT ALL", "Join দিয়ে এই হিসাব লেখা কঠিন"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  কোন Booking এর জন্য Payment এর একটাও চেষ্টা হয়নি? EXCEPT দিয়ে লিখুন। একটা Column,{" "}
                  <code className={CODE}>booking_id</code>, ছোট থেকে বড় সাজানো।
                </>
              }
              hint={
                <>
                  বাঁ দিকে সব Booking এর নম্বর, ডান দিকে Payment Table এ যে Booking এর নম্বর আছে:{" "}
                  <code className={CODE}>SELECT booking_id FROM bookings EXCEPT SELECT booking_id FROM payments</code>, শেষে ORDER
                  BY।
                </>
              }
              solution={`SELECT booking_id FROM bookings
EXCEPT
SELECT booking_id FROM payments
ORDER BY booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Set Operation</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                UNION আর UNION ALL MySQL এ বহু বছর ধরে আছে। INTERSECT আর EXCEPT এসেছে অনেক পরে: MySQL এর 8.0 Manual এ লেখা আছে
                দুটোই যোগ হয়েছে MySQL 8.0.31 এ। তাই পুরনো MySQL এ, বা পুরনো ভিডিও আর Blog এ, এই কাজ NOT IN, NOT EXISTS আর LEFT
                JOIN দিয়ে করা দেখবেন। এই ট্র্যাকের MySQL 8.4 এ সবগুলো আছে, ALL রূপ সহ। নিচের সবকিছু MySQL 8.4.11 এ Island
                Tours এর MySQL ফাইলে চালিয়ে দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["UNION, UNION ALL", "আছে", "আছে, একই ফলাফল (২২ আর ৯)"],
            ["INTERSECT, EXCEPT", "আছে", "আছে, 8.0.31 থেকে"],
            ["INTERSECT ALL, EXCEPT ALL", "আছে", "আছে, একই ফলাফল (৫ আর ১০)"],
            ["কোনটা আগে চলে", "INTERSECT আগে", "INTERSECT আগে, একই নিয়ম"],
            ["Column এর সংখ্যা না মিললে", "ERROR: each UNION query must have the same number of columns", "ERROR 1222: The used SELECT statements have a different number of columns"],
            ["integer আর text এক Column এ", "ERROR, Type মেলেনি", "চুপচাপ চলে, Column হয়ে যায় লেখা"],
            ["ORDER BY lower(full_name)", "ERROR, শুধু Column এর নাম", "চলে"],
            ["ফলাফলে নেই এমন Column দিয়ে ORDER BY", "column does not exist", "ERROR 1054: Unknown column in 'order clause'"],
            ["দুটো NULL এর INTERSECT", "একটা NULL Row", "একটা NULL Row"],
            ["guides EXCEPT tours এর guide_id", "5", "5"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL চুপচাপ Type মিশিয়ে ফেলে",
          content: (
            <ContentParagraph>
              <code className={CODE}>SELECT customer_id ... UNION SELECT full_name ...</code> PostgreSQL এ থামে, কিন্তু MySQL এ
              চলে, আর ফলাফলে 1 এর পাশে বসে Jamal Hossain। ভুলটা ধরা পড়ে না, Report এ শুধু অদ্ভুত একটা Column আসে। MySQL এ
              কাজ করলে দুই দিকের Column এর অর্থ নিজে মিলিয়ে নিন, Database আপনাকে থামাবে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-set-operations.sql",
          code: `-- MySQL 8.4, island_tours (island-tours.mysql.sql)
SELECT full_name, phone, 'customer' AS kind FROM customers
UNION ALL
SELECT full_name, phone, 'guide' FROM guides
ORDER BY kind, full_name;
-- 20 rows, same as PostgreSQL

SELECT city FROM customers
INTERSECT
SELECT region FROM destinations
ORDER BY city;
-- Barishal, Chattogram, Khulna, Sylhet

VALUES ROW(1), ROW(2) UNION VALUES ROW(2), ROW(3) INTERSECT VALUES ROW(3);
-- 1, 2, 3 (column name column_0 in MySQL, column1 in PostgreSQL)

SELECT full_name FROM customers UNION ALL SELECT full_name FROM guides
ORDER BY LOWER(full_name) LIMIT 2;
-- Aiman Zulkifli, Arif Chowdhury (PostgreSQL refuses this ORDER BY)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL এ VALUES দিয়ে ছোট Table লিখতে প্রতিটা Row এর আগে <code className={CODE}>ROW</code> লাগে, যা Module 06 এ দেখেছেন।
              আর MySQL এর EXPLAIN FORMAT=TREE এ UNION দেখায় &quot;Union materialize with deduplication&quot;, মানে একটা অস্থায়ী
              Table এ জুড়ে ডুপ্লিকেট মোছা, আর UNION ALL দেখায় শুধু &quot;Append&quot;: একই গল্প, অন্য নামে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ Set Operation কোথায় খাটে</SectionTitle>,
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
                Island Tours এর মতো একটা ব্যবসায় Set Operation তিন জায়গায় বারবার আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যোগাযোগের তালিকা:</strong> SMS, Email বা ফোনের তালিকায় আলাদা Table এর মানুষকে এক জায়গায় আনা। এই
                  লেসনের শুরুর ধন্যবাদের তালিকা ঠিক এটা।
                </ListItem>
                <ListItem>
                  <strong>Marketing এর দল:</strong> সমুদ্রে গেছেন কিন্তু পাহাড়ে যাননি, দুটোতেই গেছেন, আগে গেছেন কিন্তু এবার যাচ্ছেন না।
                  প্রতিটা দল দুটো তালিকার মিল বা বিয়োগ।
                </ListItem>
                <ListItem>
                  <strong>Data Health:</strong> যা থাকার কথা কিন্তু নেই তা খোঁজা: Payment ছাড়া Booking, Booking ছাড়া Departure, ট্যুর ছাড়া
                  Guide। প্রতিটা একটা EXCEPT, আর সবগুলো UNION ALL দিয়ে এক Report এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Query টা তৃতীয় ধরনের। প্রতিটা EXCEPT একটা Derived Table এর ভেতরে, আর প্রতিটার পাশে একটা লেখা যে সমস্যাটা
                কী। Support টিম প্রতি সকালে এমন একটা তালিকা দেখলে জানে কোথা থেকে কাজ শুরু করবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতি সকালের Data Health তালিকা"
              query={`SELECT 'Booking with no payment' AS problem, booking_id AS id
FROM (SELECT booking_id FROM bookings
      EXCEPT
      SELECT booking_id FROM payments) AS unpaid
UNION ALL
SELECT 'Customer with no booking', customer_id
FROM (SELECT customer_id FROM customers
      EXCEPT
      SELECT customer_id FROM bookings) AS idle
UNION ALL
SELECT 'Departure with no booking', departure_id
FROM (SELECT departure_id FROM departures
      EXCEPT
      SELECT departure_id FROM bookings) AS empty_dates
UNION ALL
SELECT 'Guide with no tour', guide_id
FROM (SELECT guide_id FROM guides
      EXCEPT
      SELECT guide_id FROM tours) AS free_guides
ORDER BY problem, id;`}
              caption="৮টা Row। Payment ছাড়া ৫টা Booking: 12, 17, 18, 20, 24। Booking ছাড়া Customer 15 (Imran Kabir), Booking ছাড়া Departure 16, আর ট্যুর ছাড়া Guide 5 (Nazmul Karim)। চারটা EXCEPT, তিনটা UNION ALL, আর শেষে একবার ORDER BY। এখানে UNION ALL, কারণ problem এর লেখা প্রতিটা দলকে আলাদা রাখে, মোছার কিছু নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Marketing এর আরেকটা দল, আপনার হাতে। এই দলের নাম Win-back: যাঁরা আগে Island Tours এর সাথে ঘুরেছেন, কিন্তু
              নতুন মৌসুমে এখনো কিছু বুক করেননি। তাঁদের জন্য একটা বিশেষ অফার যাবে।
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
                  যাঁদের অন্তত একটা <code className={CODE}>confirmed</code> Booking আছে এমন Departure এ যেটা আজকের আগে শুরু
                  হয়েছিল, কিন্তু আজ বা তার পরে শুরু হওয়া কোনো Departure এ একটাও বাতিল না হওয়া Booking নেই, তাঁদের তালিকা। আজ
                  মানে <code className={CODE}>DATE &apos;2026-11-01&apos;</code>। দুটো Column:{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>city</code>, নামের বর্ণমালার ক্রমে।
                </>
              }
              hint={
                <>
                  দুটো SELECT, দুটোতেই customers, bookings আর departures জোড়া। প্রথমটায়{" "}
                  <code className={CODE}>b.status = &apos;confirmed&apos; AND d.starts_on &lt; DATE &apos;2026-11-01&apos;</code>,
                  দ্বিতীয়টায় <code className={CODE}>b.status &lt;&gt; &apos;cancelled&apos; AND d.starts_on &gt;= DATE
                  &apos;2026-11-01&apos;</code>। মাঝে EXCEPT, শেষে <code className={CODE}>ORDER BY full_name</code>।
                </>
              }
              solution={`SELECT c.full_name, c.city
FROM customers c
JOIN bookings b   ON b.customer_id = c.customer_id
JOIN departures d ON d.departure_id = b.departure_id
WHERE b.status = 'confirmed'
  AND d.starts_on < DATE '2026-11-01'
EXCEPT
SELECT c.full_name, c.city
FROM customers c
JOIN bookings b   ON b.customer_id = c.customer_id
JOIN departures d ON d.departure_id = b.departure_id
WHERE b.status <> 'cancelled'
  AND d.starts_on >= DATE '2026-11-01'
ORDER BY full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Set Operation লেখার ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটাকে দুটো তালিকায় ভাঙুন",
              description:
                "যোগ, মিল, না বিয়োগ? সবাই একসাথে মানে UNION, দুই দলেই আছেন মানে INTERSECT, একটায় আছেন অন্যটায় নেই মানে EXCEPT। বিয়োগ হলে কোন তালিকা থেকে কোনটা বাদ, সেটাও ঠিক করুন।",
            },
            {
              title: "প্রতিটা দিক আলাদা করে লিখে চালান",
              description:
                "জোড়া দেওয়ার আগে দুটো SELECT একা একা চালিয়ে Row গুনে নিন, যেমন ১৫ আর ৫, বা ৯ আর ৫। পরে ফলাফল মিলিয়ে দেখার জন্য এই সংখ্যাগুলোই লাগবে।",
            },
            {
              title: "Column গুলো লাইনে দাঁড় করান",
              description:
                "দুই দিকে একই সংখ্যার Column, একই ক্রমে, একই Type। যেদিকে কিছু নেই সেখানে NULL, যেখানে Type আলাদা সেখানে ::text বা অন্য Cast। সব Alias প্রথম SELECT এ।",
            },
            {
              title: "ALL লাগবে কিনা ভাবুন",
              description:
                "ডুপ্লিকেট আসতে পারে না, বা দরকার, তাহলে UNION ALL, এটা দ্রুতও। প্রতিটা একবার চাই, তাহলে ALL ছাড়া। গুনে মেলাতে চাইলে INTERSECT ALL বা EXCEPT ALL।",
            },
            {
              title: "সাজানো আর কাটা একদম শেষে",
              description:
                "ORDER BY আর LIMIT শেষে একবার, ফলাফলের Column এর নাম দিয়ে। হিসাব দিয়ে সাজাতে হলে পুরো জিনিসটা FROM এর ভেতরে নিন। একটা দিককে আলাদা কাটতে হলে সেই দিক বন্ধনীতে।",
            },
            {
              title: "বন্ধনী দিন, তারপর সংখ্যা মেলান",
              description:
                "দুই রকম Operation মেশালে বন্ধনী দিয়ে ক্রম পরিষ্কার করুন। শেষে ফলাফলের Row সংখ্যা যাচাই করুন: UNION ALL হলে দুই দিকের যোগফল, INTERSECT কখনো ছোট দিকের চেয়ে বেশি না, EXCEPT কখনো প্রথম দিকের চেয়ে বেশি না।",
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
              "অভ্যাসে সবসময় UNION",
              "অকারণে ডুপ্লিকেট মোছার খরচ, আর কখনো দরকারি Row ও মুছে যায়, যেমন একই নামের দুজন মানুষ",
              "ডুপ্লিকেট আসতে না পারলে বা দরকার হলে UNION ALL",
            ],
            [
              "দুই দিকে Column এর ক্রম আলাদা",
              "Error হয় না যদি Type মেলে, কিন্তু নামের Column এ ফোন নম্বর ঢুকে যায়",
              "দুই SELECT পাশাপাশি রেখে Column এক এক করে মিলিয়ে নিন",
            ],
            [
              "দ্বিতীয় SELECT এ Alias দেওয়া",
              "নামটা চুপচাপ হারিয়ে যায়",
              "সব Alias প্রথম SELECT এ",
            ],
            [
              "প্রথম দিকে ORDER BY লেখা",
              "syntax error at or near \"UNION\"",
              "ORDER BY শেষে, অথবা সেই দিক বন্ধনীতে",
            ],
            [
              "EXCEPT এর দিক উল্টে ফেলা",
              "শহর থেকে অঞ্চল বাদ ৫টা, অঞ্চল থেকে শহর বাদ ০টা, ভুল প্রশ্নের ঠিক উত্তর",
              "জোরে পড়ুন: প্রথমটায় আছে, দ্বিতীয়টায় নেই",
            ],
            [
              "একই Table এর দুই শর্ত UNION করা",
              "Table দুইবার পড়া, লম্বা Query",
              "WHERE এ OR",
            ],
            [
              "বেশি Column দরকার এমন বিয়োগে EXCEPT",
              "দুই দিকেই একগাদা Join আর Column, আর একটা Column এর পার্থক্যে Row আর বাদ যায় না",
              "NOT EXISTS, বাইরে যা খুশি দেখান",
            ],
            [
              "MySQL এ Type না মিলিয়ে UNION",
              "Error ছাড়াই নম্বর আর নাম এক Column এ",
              "দুই দিকের Column এর অর্থ নিজে যাচাই করুন",
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
                    href="https://www.postgresql.org/docs/current/queries-union.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Combining Queries
                  </a>
                  : UNION, INTERSECT আর EXCEPT এর ছোট আর পরিষ্কার পরিচয়, কোনটা আগে চলে আর বন্ধনী কেন লাগে, এক পাতায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-select.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: SELECT
                  </a>
                  : UNION Clause, INTERSECT Clause আর EXCEPT Clause অংশে ALL রূপের হিসাব, আর ORDER BY অংশে Set Operation এর
                  সীমাবদ্ধতা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/typeconv-union-case.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: UNION, CASE, and Related Constructs
                  </a>
                  : দুই দিকের আলাদা Type কীভাবে একটা Type এ মেলানো হয়, আর কখন মেলানো যায় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/set-operations.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Set Operations
                  </a>
                  : MySQL এ UNION, INTERSECT আর EXCEPT, ফলাফলের Column এর নাম আর Type, আর ORDER BY ও LIMIT এর নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Set_operations_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Set operations (SQL)
                  </a>
                  : চারটা Operation এক জায়গায়, ছোট উদাহরণ আর কোন Database কোন নামে লেখে (যেমন Oracle এর MINUS)।
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
      subHeader: { index: "018", title: "Module 07 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের ধন্যবাদের তালিকা তৈরি, Marketing এর দলগুলোও। এই লেসনের মূল কথাগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>Join পাশাপাশি জোড়ে, Set Operation পুরো ফলাফল উপরে নিচে বসায়, মেলায় বা বিয়োগ করে।</ListItem>
                <ListItem>UNION ALL সব রাখে আর সস্তা, UNION ডুপ্লিকেট মোছে আর তার দাম আছে।</ListItem>
                <ListItem>দুই দিকে Column এর সংখ্যা সমান, একই অবস্থানে একই Type, আর নাম আসে প্রথম SELECT থেকে।</ListItem>
                <ListItem>INTERSECT দুই দিকে যা আছে, EXCEPT প্রথমটায় আছে কিন্তু দ্বিতীয়টায় নেই, আর EXCEPT এ দিক গুরুত্বপূর্ণ।</ListItem>
                <ListItem>ALL রূপ গোনে: INTERSECT ALL এ ছোট সংখ্যাটা, EXCEPT ALL এ বিয়োগফল।</ListItem>
                <ListItem>Set Operation এ দুটো NULL সমান, তাই EXCEPT, NOT IN এর ফাঁদে পড়ে না।</ListItem>
                <ListItem>ORDER BY আর LIMIT পুরো ফলাফলের, একটা দিকের জন্য বন্ধনী। INTERSECT আগে চলে, মেশালে বন্ধনী।</ListItem>
              </ContentList>
              <ContentParagraph>
                এর সাথেই Module 07 শেষ। সাতটা লেসনে আপনি শিখলেন একটা Query কীভাবে আরেকটার ভেতরে বসে, কীভাবে বড় Query কে নাম
                দেওয়া ধাপে ভাঙা যায়, আর কীভাবে পুরো ফলাফলগুলো জোড়া যায়। নিচের ছবি আর Table এ পুরো মডিউল এক নজরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleSevenStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "মূল প্রশ্ন", "হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/scalar-subqueries" className={LINK}>
                01 Scalar Subqueries
              </Link>,
              "একটা মান যা আরেকটা Query থেকে আসে",
              "SELECT বা WHERE এ ( SELECT avg(...) )",
            ],
            [
              <Link key="l2" href="/sql/topic/in-exists-any-all" className={LINK}>
                02 IN, EXISTS, ANY and ALL
              </Link>,
              "একটা তালিকার সাথে তুলনা",
              "IN, NOT IN এর NULL ফাঁদ, ANY, ALL",
            ],
            [
              <Link key="l3" href="/sql/topic/correlated-subqueries" className={LINK}>
                03 Correlated Subqueries
              </Link>,
              "প্রতিটা Row এর জন্য আলাদা প্রশ্ন",
              "ভেতরের Query বাইরের Row পড়ে",
            ],
            [
              <Link key="l4" href="/sql/topic/derived-tables" className={LINK}>
                04 Derived Tables
              </Link>,
              "মাঝপথের ফলাফলকে Table বানানো",
              "FROM ( SELECT ... ) AS নাম",
            ],
            [
              <Link key="l5" href="/sql/topic/ctes" className={LINK}>
                05 CTEs with WITH
              </Link>,
              "বড় Query কে পড়ার মতো ধাপে ভাঙা",
              "WITH নাম AS ( ... )",
            ],
            [
              <Link key="l6" href="/sql/topic/recursive-ctes" className={LINK}>
                06 Recursive CTEs
              </Link>,
              "নিজেকে ডেকে Tree আর ধারা হাঁটা",
              "WITH RECURSIVE, শুরু আর পুনরাবৃত্তি",
            ],
            [
              <Link key="l7" href="/sql/topic/set-operations" className={LINK}>
                07 UNION, INTERSECT and EXCEPT
              </Link>,
              "পুরো ফলাফলের যোগ, মিল, বিয়োগ",
              "UNION ALL, UNION, INTERSECT, EXCEPT",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে। ফারুক সাহেব জানতে চান আজ কাকে কাকে ফোন করা দরকার, আর কেন। তিনটা কারণ: যাঁরা গড়ের চেয়ে বেশি
              খরচ করেছেন (বড় Customer), যাঁদের সামনে একটা ট্যুর আছে (মনে করিয়ে দেওয়া), আর যাঁরা Account খুলে কখনো বুক করেননি
              (স্বাগত জানানো)। নিচের Report টা লেখা একটা WITH এর শিকল হিসেবে। প্রথম ধাপ <code className={CODE}>spend</code>,
              যার ভেতরে একটা Derived Table প্রতিটা Customer এর নিশ্চিত খরচ যোগ করে। দ্বিতীয় ধাপ{" "}
              <code className={CODE}>reasons</code>, যেখানে তিনটা SELECT UNION দিয়ে জোড়া: প্রথমটায় গড় আসে একটা Scalar Subquery
              থেকে, দ্বিতীয়টায় EXISTS, তৃতীয়টায় NOT EXISTS। শেষে প্রতিটা মানুষের সব কারণ এক লাইনে, string_agg দিয়ে। চালান,
              তারপর প্রতিটা অংশ কোন লেসনের, নিজে মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 07 এর সব হাতিয়ার, একটা Report এ"
              query={`WITH spend AS (
  SELECT c.customer_id, c.full_name,
         coalesce(t.confirmed_bdt, 0.00) AS confirmed_bdt
  FROM customers c
  LEFT JOIN (
    SELECT customer_id, sum(total_bdt) AS confirmed_bdt
    FROM bookings
    WHERE status = 'confirmed'
    GROUP BY customer_id
  ) AS t ON t.customer_id = c.customer_id
),
reasons AS (
  SELECT customer_id, 'Big spender' AS reason
  FROM spend
  WHERE confirmed_bdt > (SELECT avg(confirmed_bdt) FROM spend)
  UNION
  SELECT c.customer_id, 'Upcoming trip'
  FROM customers c
  WHERE EXISTS (
    SELECT 1
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    WHERE b.customer_id = c.customer_id
      AND b.status <> 'cancelled'
      AND d.starts_on >= DATE '2026-11-01'
  )
  UNION
  SELECT c.customer_id, 'Never booked'
  FROM customers c
  WHERE NOT EXISTS (
    SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id
  )
)
SELECT s.full_name, s.confirmed_bdt,
       string_agg(r.reason, ', ' ORDER BY r.reason) AS reasons
FROM reasons r
JOIN spend s ON s.customer_id = r.customer_id
GROUP BY s.customer_id, s.full_name, s.confirmed_bdt
ORDER BY s.confirmed_bdt DESC, s.full_name;`}
              caption="১২ জন, ১৫ জনের মধ্যে। গড় খরচ ধরা হয়েছে সব ১৫ জনের উপর, শূন্যসহ: 28240.00। তার বেশি ৬ জন, Nusrat Jahan (75000.00) থেকে Mitu Rahman (36000.00)। Mitu এর পাশে শুধু Big spender, কারণ তাঁর ডিসেম্বরের Booking বাতিল। Kamal Hasan এর নিশ্চিত খরচ 0.00, তবু তালিকায়, কারণ নভেম্বরের Booking টা pending, বাতিল না। Imran Kabir এর কারণ Never booked। বাকি তিনজন, Arif, Aiman আর Sabbir, কোনো কারণে পড়েননি, তাই তাঁদের আজ ফোন লাগবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এই Report এ UNION লেখা হয়েছে ALL ছাড়া, তবু কেউ বাদ পড়েনি: Nusrat এর দুটো আলাদা কারণ, দুটো আলাদা Row, কারণ reason
                Column আলাদা। একই মানুষ একই কারণে দুইবার এলে তবেই মোছা হতো। MySQL 8.4 এ string_agg এর জায়গায়{" "}
                <code className={CODE}>GROUP_CONCAT(r.reason ORDER BY r.reason SEPARATOR &apos;, &apos;)</code> লিখলে হুবহু একই ১২টা
                Row আসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>নিজেকে যাচাই করুন।</strong> এই সাতটা প্রশ্নের উত্তর কাউকে মুখে বোঝাতে পারলে Module 07 আপনার হয়ে গেছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>একটা Scalar Subquery একের বেশি Row ফেরত দিলে কী হয়, আর কীভাবে ঠিক করবেন?</ListItem>
                <ListItem>NOT IN এর তালিকায় একটা NULL থাকলে উত্তর কেন ফাঁকা হয়ে যায়, আর কোন দুটো উপায় নিরাপদ?</ListItem>
                <ListItem>Correlated Subquery কেন প্রতিটা বাইরের Row এর জন্য আলাদা করে ভাবতে হয়?</ListItem>
                <ListItem>Module 06 এর টাকা দুইবার গোনার সমস্যা Derived Table কীভাবে মেটায়?</ListItem>
                <ListItem>একটা লম্বা Report কে WITH দিয়ে ভাঙলে কী লাভ, আর একটা CTE দুইবার ব্যবহার করা যায় কিনা?</ListItem>
                <ListItem>Recursive CTE কখন থামে, আর না থামলে কী করবেন?</ListItem>
                <ListItem>UNION আর UNION ALL এর পার্থক্য, আর EXCEPT এর দিক উল্টালে কী হয়, একটা উদাহরণে বলুন।</ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউলে প্রায় সব উত্তর এসেছে দলের হিসাব দিয়ে: GROUP BY দিয়ে একটা দলকে একটা Row বানানো, বা একটা Subquery দিয়ে প্রতিটা
                Row এর জন্য আলাদা হিসাব। কিন্তু অনেক প্রশ্ন চায় দুটোই একসাথে: প্রতিটা Booking এর Row থাকুক, আর তার পাশে লেখা থাকুক
                এই Customer এর এটা কত নম্বর Booking, বা আগের Booking থেকে কত দিন পরে, বা মাসের চলমান মোট আয় কত। এই কাজের জন্য
                আছে Window Function, পরের মডিউলের পুরো বিষয়। চলুন{" "}
                <Link href="/sql/topic/window-functions-overview" className={LINK}>
                  Module 08, Window Functions আর Analytics
                </Link>
                {" "}এ।
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
      ["Set Operation", "দুই Query র পুরো ফলাফল জোড়া", "Customer আর Guide এক তালিকায়"],
      ["Join বনাম Set Operation", "Join পাশে জোড়ে, Set Operation নিচে বসায়", "CROSS JOIN 75, UNION ALL 20"],
      ["UNION ALL", "সব Row রাখে, সবচেয়ে সস্তা", "শহর আর অঞ্চল: ২২টা Row"],
      ["UNION", "ডুপ্লিকেট মোছে, দুই দিকেরই", "শহর আর অঞ্চল: ৯টা নাম"],
      ["Column এর নিয়ম", "সংখ্যা সমান, Type মেলে, নাম প্রথম SELECT এর", "Guide এর দিকে city এর জায়গায় NULL"],
      ["INTERSECT", "দুই দিকেই আছে", "শহরও অঞ্চলও: ৪টা, সমুদ্র ও পাহাড়: ৩ জন"],
      ["EXCEPT", "প্রথমটায় আছে, দ্বিতীয়টায় নেই, দিক গুরুত্বপূর্ণ", "শহর থেকে অঞ্চল বাদ ৫, উল্টো দিকে ০"],
      ["ALL রূপ", "INTERSECT ALL ছোট সংখ্যা, EXCEPT ALL বিয়োগফল", "৫, ১০ আর ২টা Row"],
      ["NULL", "Set Operation এ দুটো NULL সমান", "guides EXCEPT tours দেয় 5, NOT IN দেয় কিছু না"],
      ["ORDER BY আর LIMIT", "শেষে, পুরো ফলাফলের, শুধু Column এর নাম দিয়ে", "দামি দুটো আর সস্তা দুটো: বন্ধনী দিয়ে"],
      ["কোনটা আগে", "INTERSECT আগে, UNION আর EXCEPT বাঁ থেকে ডানে", "1, 2, 3 বনাম শুধু 3"],
      ["কখন অন্য কিছু", "একই Table এ OR, বেশি Column এ NOT EXISTS", "Imran: EXCEPT আর NOT EXISTS দুটোতেই"],
      ["MySQL", "INTERSECT আর EXCEPT 8.0.31 থেকে, Type চুপচাপ মেশায়", "একই ফলাফল, ভিন্ন Error নম্বর"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "UNION আর UNION ALL এর মূল পার্থক্য কী?",
        options: [
          {
            key: "A",
            text: "UNION ALL দুই দিকের ডুপ্লিকেট মোছে, UNION রাখে",
            isCorrect: false,
            explanation: "উল্টো। ALL মানে সব রাখা। শহর আর অঞ্চলের UNION ALL ২২টা Row দেয়, Dhaka ছয়বার সহ।",
          },
          {
            key: "B",
            text: "UNION ডুপ্লিকেট মুছে প্রতিটা Row একবার রাখে, UNION ALL সব রাখে",
            isCorrect: true,
            explanation: "ঠিক। UNION শহর আর অঞ্চল থেকে ৯টা নাম দেয়, UNION ALL দেয় ২২টা Row। মোছার কাজের জন্য UNION এ বাড়তি একটা ধাপ লাগে।",
          },
          {
            key: "C",
            text: "UNION শুধু দুই দিকের মাঝের ডুপ্লিকেট মোছে, এক দিকের ভেতরের না",
            isCorrect: false,
            explanation: "UNION এক দিকের ভেতরের ডুপ্লিকেটও মোছে। শহরের তালিকাকে নিজের সাথে UNION করলে ১৫টা থেকে ৯টা থাকে।",
          },
          {
            key: "D",
            text: "UNION ALL দুই দিকের Column এর নাম মেলায়, UNION অবস্থান মেলায়",
            isCorrect: false,
            explanation: "দুটোই অবস্থান ধরে মেলায়, নাম কখনো না। নাম আসে প্রথম SELECT থেকে।",
          },
        ],
      },
      {
        id: 2,
        text: "customers এ ১৫ জন আর guides এ ৫ জন। SELECT full_name FROM customers UNION ALL SELECT full_name FROM guides কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "৫",
            isCorrect: false,
            explanation: "UNION ALL কিছু বাদ দেয় না, ছোট দিকের সংখ্যা এখানে কোনো সীমা না।",
          },
          {
            key: "B",
            text: "১৫",
            isCorrect: false,
            explanation: "Guide দের Row ও যোগ হয়, Customer দের নিচে।",
          },
          {
            key: "C",
            text: "২০",
            isCorrect: true,
            explanation: "ঠিক। ১৫ যোগ ৫, একটার নিচে আরেকটা। Set Operation এ Row যোগ হয়, গুণ হয় না।",
          },
          {
            key: "D",
            text: "৭৫",
            isCorrect: false,
            explanation: "৭৫ আসে CROSS JOIN এ, যেখানে প্রত্যেক Customer এর সাথে প্রত্যেক Guide জোড়া হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "নিচের কোন Query টা PostgreSQL এ Error দেবে?",
        options: [
          {
            key: "A",
            text: "SELECT full_name, city FROM customers UNION ALL SELECT full_name, NULL FROM guides",
            isCorrect: false,
            explanation: "চলে। দুই দিকে দুটো করে Column, আর NULL প্রথম দিকের city এর Type মেনে নেয়।",
          },
          {
            key: "B",
            text: "SELECT full_name, phone FROM customers UNION SELECT full_name FROM guides",
            isCorrect: true,
            explanation: "ঠিক। বাঁ দিকে দুটো Column, ডান দিকে একটা: each UNION query must have the same number of columns।",
          },
          {
            key: "C",
            text: "SELECT customer_id::text FROM customers UNION SELECT full_name FROM guides",
            isCorrect: false,
            explanation: "চলে, কারণ ::text নম্বরকে লেখায় বদলে দিয়েছে, দুই দিক এখন text।",
          },
          {
            key: "D",
            text: "SELECT city FROM customers UNION SELECT city FROM customers",
            isCorrect: false,
            explanation: "চলে, আর ৯টা শহর দেয়। একই Query নিজের সাথে UNION মানে DISTINCT।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT title AS name FROM tours UNION ALL SELECT full_name AS guide_name FROM guides এর ফলাফলের Column এর নাম কী?",
        options: [
          {
            key: "A",
            text: "name",
            isCorrect: true,
            explanation: "ঠিক। নাম সবসময় প্রথম SELECT থেকে আসে। guide_name চুপচাপ হারিয়ে যায়, কোনো Error ছাড়া।",
          },
          {
            key: "B",
            text: "guide_name",
            isCorrect: false,
            explanation: "শেষ SELECT এর নাম গোনা হয় না। Alias দিতে হলে প্রথম SELECT এ দিন।",
          },
          {
            key: "C",
            text: "name_guide_name",
            isCorrect: false,
            explanation: "Database নাম জোড়া দেয় না, প্রথম SELECT এর নামটাই নেয়।",
          },
          {
            key: "D",
            text: "Error, কারণ দুই দিকের নাম আলাদা",
            isCorrect: false,
            explanation: "নাম আলাদা হলে কোনো সমস্যা নেই। Column মেলানো হয় অবস্থান ধরে।",
          },
        ],
      },
      {
        id: 5,
        text: "শহর EXCEPT অঞ্চল ৫টা শহর দেয়। অঞ্চল EXCEPT শহর কয়টা দেবে, আর কেন?",
        options: [
          {
            key: "A",
            text: "৫টা, কারণ EXCEPT দুই দিক থেকে একই",
            isCorrect: false,
            explanation: "INTERSECT আর UNION দুই দিক থেকে একই, EXCEPT না। বিয়োগে দিক গুরুত্বপূর্ণ।",
          },
          {
            key: "B",
            text: "০টা, কারণ প্রতিটা অঞ্চলে অন্তত একজন Customer থাকেন",
            isCorrect: true,
            explanation: "ঠিক। Chattogram, Khulna, Sylhet, Barishal চারটাই শহরের তালিকায় আছে, তাই অঞ্চল থেকে বাদ দেওয়ার পর কিছু থাকে না।",
          },
          {
            key: "C",
            text: "৪টা, যে চারটা নাম দুই তালিকাতেই আছে",
            isCorrect: false,
            explanation: "দুই তালিকাতেই যা আছে, সেটা INTERSECT এর উত্তর। EXCEPT ঠিক সেগুলোই বাদ দেয়।",
          },
          {
            key: "D",
            text: "Error, কারণ দুই Column এর নাম আলাদা",
            isCorrect: false,
            explanation: "city আর region দুটোই text, এক Column করে। নাম আলাদা হলেও চলে।",
          },
        ],
      },
      {
        id: 6,
        text: "tours এর guide_id তে একটা NULL আছে। কোন Guide এর ট্যুর নেই জানতে NOT IN কিছু দেয় না, কিন্তু EXCEPT Nazmul কে দেয়। কেন?",
        options: [
          {
            key: "A",
            text: "EXCEPT NULL ওয়ালা Row গুলো আগে মুছে ফেলে",
            isCorrect: false,
            explanation: "EXCEPT কিছু আগে মোছে না। পার্থক্যটা তুলনার নিয়মে।",
          },
          {
            key: "B",
            text: "Set Operation এ দুটো NULL সমান ধরা হয়, তাই NULL অন্য কোনো মানের সাথে মেলা নিয়ে অনিশ্চয়তা তৈরি করে না",
            isCorrect: true,
            explanation: "ঠিক। NOT IN এ 5 <> NULL অজানা, তাই কারো জন্যই সত্য প্রমাণ হয় না। EXCEPT DISTINCT এর মতো মেলায়: 5 এর জোড়া ডান দিকে নেই, তাই 5 থাকে।",
          },
          {
            key: "C",
            text: "NOT IN একটা ধীর Operation, তাই অর্ধেক কাজ করে থেমে যায়",
            isCorrect: false,
            explanation: "গতির সাথে এর কোনো সম্পর্ক নেই। NOT IN পুরো কাজই করে, শুধু NULL এর জন্য উত্তর অজানা হয়।",
          },
          {
            key: "D",
            text: "EXCEPT শুধু প্রথম Row দেখে",
            isCorrect: false,
            explanation: "EXCEPT দুই দিকের সব Row দেখে মেলায়।",
          },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL এ একটা UNION এর শেষে ORDER BY lower(full_name) লিখলে কী হয়, আর কীভাবে ঠিক করবেন?",
        options: [
          {
            key: "A",
            text: "চলে, Function দিয়ে সাজাতে কোনো বাধা নেই",
            isCorrect: false,
            explanation: "MySQL এ চলে, PostgreSQL এ না। PostgreSQL এখানে শুধু ফলাফলের Column এর নাম বা নম্বর মানে।",
          },
          {
            key: "B",
            text: "Error, কারণ lower() শুধু WHERE এ চলে",
            isCorrect: false,
            explanation: "lower() যেকোনো জায়গায় চলে। সমস্যাটা UNION এর পরের ORDER BY এর সীমাবদ্ধতায়।",
          },
          {
            key: "C",
            text: "Error: invalid UNION/INTERSECT/EXCEPT ORDER BY clause। UNION কে FROM এর ভেতরে Derived Table বানিয়ে বাইরে সাজালে চলে",
            isCorrect: true,
            explanation: "ঠিক। HINT নিজেই এটা বলে: move the UNION into a FROM clause। বাইরের SELECT তখন একটা সাধারণ Table দেখে।",
          },
          {
            key: "D",
            text: "চলে, কিন্তু শুধু প্রথম SELECT এর Row সাজায়",
            isCorrect: false,
            explanation: "শেষের ORDER BY কখনো শুধু একটা দিকের হয় না, সবসময় পুরো ফলাফলের।",
          },
        ],
      },
      {
        id: 8,
        text: "VALUES (1), (2) UNION VALUES (2), (3) INTERSECT VALUES (3) এর ফলাফল কী?",
        options: [
          {
            key: "A",
            text: "শুধু 3",
            isCorrect: false,
            explanation: "এটা হতো যদি UNION আগে চলত, যেমন (A UNION B) INTERSECT C। বন্ধনী ছাড়া INTERSECT আগে চলে।",
          },
          {
            key: "B",
            text: "1, 2, 3",
            isCorrect: true,
            explanation: "ঠিক। INTERSECT আগে চলে: {2, 3} আর {3} এর মিল {3}। তারপর {1, 2} এর সাথে UNION: 1, 2, 3।",
          },
          {
            key: "C",
            text: "2, 3",
            isCorrect: false,
            explanation: "INTERSECT এর ফলাফল {3}, {2, 3} না, কারণ C তে শুধু 3।",
          },
          {
            key: "D",
            text: "Error, তিনটা SELECT জোড়া যায় না",
            isCorrect: false,
            explanation: "যত খুশি জোড়া যায়। শুধু কোনটা আগে চলে সেটা জানতে হয়, বা বন্ধনী দিতে হয়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর চারটা তালিকা",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>মৌসুমের শুভেচ্ছা:</strong> Customer আর Guide দের মধ্যে যাঁদের ফোন নম্বর আছে, শুধু তাঁদের নিয়ে একটা তালিকা:
        নাম, ফোন আর kind, kind তারপর নাম ধরে সাজানো। কয়জন এলেন লিখুন, আর UNION না UNION ALL কেন বেছেছেন, দুই লাইনে।
      </span>,
      <span key="2">
        <strong>Marketing এর তিন দল:</strong> সমুদ্র (island বা beach) আর পাহাড় (hills) এর যাত্রীদের নিয়ে তিনটা Query: দুটোতেই,
        শুধু সমুদ্রে, শুধু পাহাড়ে। তিনটা সংখ্যা যোগ করে দেখান যে সেটা দুই দলের UNION এর সংখ্যার সমান, আর কেন।
      </span>,
      <span key="3">
        <strong>Data Health:</strong> নিজের মতো চারটা &quot;থাকার কথা কিন্তু নেই&quot; পরীক্ষা লিখুন EXCEPT দিয়ে, UNION ALL দিয়ে এক
        Report এ, প্রতিটার পাশে সমস্যার নাম। তারপর একটা পরীক্ষা NOT EXISTS দিয়ে আবার লিখে দেখান দুটো একই উত্তর দেয়।
      </span>,
      <span key="4">
        <strong>হাতে হিসাব, তারপর Query:</strong> শহর আর অঞ্চলের তালিকায় INTERSECT ALL আর EXCEPT ALL এর ফলাফল আগে কাগজে হিসাব
        করুন, প্রতিটা নাম কতবার আসবে সহ। তারপর চালিয়ে মিলিয়ে দেখুন, আর কোথাও না মিললে কারণ লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> দুই সেকশনের হাজিরা খাতার উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান Join আর UNION
        এর পার্থক্য, আর দুই খাতার ঘর কেন একই রকম হতে হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">শুভেচ্ছার তালিকার Query, Row সংখ্যা আর UNION ALL বাছাইয়ের কারণ</span>,
      <span key="d2">তিন দলের তিনটা Query আর সংখ্যার যোগফলের ব্যাখ্যা</span>,
      <span key="d3">Data Health Report আর একটা পরীক্ষার NOT EXISTS রূপ</span>,
      <span key="d4">INTERSECT ALL আর EXCEPT ALL এর হাতের হিসাব আর মিলিয়ে দেখার নোট</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Set Operation",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "UNION ALL বনাম UNION",
        description:
          "প্রথম ফাইলের তিনটা Query চালান। ২০, ২২ আর ৯ মিলিয়ে নিন। তারপর দ্বিতীয় Query থেকে ALL মুছে আবার চালান, তৃতীয়টার সাথে মিলে কিনা দেখুন।",
      },
      {
        title: "মিল আর দুই দিকের বিয়োগ",
        description:
          "দ্বিতীয় ফাইলে INTERSECT আর দুই দিকের EXCEPT। ৪, ৫ আর ০ মিলিয়ে নিন, তারপর শেষ Query র Departure 16 কোন ট্যুরের, খুঁজে বের করুন।",
      },
      {
        title: "সমুদ্র আর পাহাড়",
        description:
          "তৃতীয় ফাইলে দুটো দল WITH দিয়ে একবার লেখা, তারপর তিনটা Set Operation। ৩, ৬ আর ২। তিনটা মিলে কেন ১১, যা দুই দলের UNION, খাতায় লিখুন।",
      },
      {
        title: "ALL আর NULL",
        description:
          "চতুর্থ ফাইলে ALL রূপের ৫ আর ১০, তারপর একই প্রশ্ন NOT IN আর EXCEPT দিয়ে। প্রথমটা কিছু দেয় না, দ্বিতীয়টা 5। কারণটা এক লাইনে লিখুন।",
      },
      {
        title: "ORDER BY আর LIMIT",
        description:
          "পঞ্চম ফাইলের প্রথম দুটো Query চলে, ৫টা আর ৪টা Row। তৃতীয়টা ইচ্ছা করে ভুল, Error টা পড়ুন আর নিজে ঠিক করুন, ফলাফলে নেই এমন Column দিয়ে সাজানো ছাড়াই।",
      },
      {
        title: "Data Health",
        description:
          "ষষ্ঠ ফাইলের Report এ ৮টা Row। তারপর নিজে একটা পঞ্চম পরীক্ষা যোগ করুন, যেমন Review ছাড়া confirmed Booking, আর UNION ALL দিয়ে জুড়ে দিন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-union-all-vs-union.sql",
        code: `SELECT count(*) AS contacts
FROM (SELECT full_name FROM customers
      UNION ALL
      SELECT full_name FROM guides) AS everyone;
-- 20

SELECT count(*) AS places_all
FROM (SELECT city FROM customers
      UNION ALL
      SELECT region FROM destinations) AS p;
-- 22

SELECT count(*) AS places
FROM (SELECT city FROM customers
      UNION
      SELECT region FROM destinations) AS p;
-- 9`,
      },
      {
        language: "sql",
        filename: "02-intersect-except.sql",
        code: `SELECT city FROM customers
INTERSECT
SELECT region FROM destinations;
-- (4 rows) Barishal, Chattogram, Khulna, Sylhet

SELECT city FROM customers
EXCEPT
SELECT region FROM destinations;
-- (5 rows) Dhaka, Kolkata, Kuala Lumpur, London, Rajshahi

SELECT region FROM destinations
EXCEPT
SELECT city FROM customers;
-- (0 rows)

SELECT departure_id FROM departures
EXCEPT
SELECT departure_id FROM bookings;
-- (1 row) 16`,
      },
      {
        language: "sql",
        filename: "03-sea-and-hills.sql",
        code: `WITH trips AS (
  SELECT c.customer_id, c.full_name, ds.kind
  FROM customers c
  JOIN bookings b      ON b.customer_id = c.customer_id
  JOIN departures d    ON d.departure_id = b.departure_id
  JOIN tours t         ON t.tour_id = d.tour_id
  JOIN destinations ds ON ds.destination_id = t.destination_id
)
SELECT customer_id, full_name FROM trips WHERE kind IN ('island', 'beach')
INTERSECT
SELECT customer_id, full_name FROM trips WHERE kind = 'hills';
-- (3 rows) Rahim Uddin, Sumaiya Islam, Oliver Bennett

-- Same WITH, then:
--   ... WHERE kind IN ('island', 'beach') EXCEPT ... WHERE kind = 'hills'
-- (6 rows)
--   ... WHERE kind = 'hills' EXCEPT ... WHERE kind IN ('island', 'beach')
-- (2 rows) Mitu Rahman, Priya Sharma`,
      },
      {
        language: "sql",
        filename: "04-all-and-null.sql",
        code: `SELECT city FROM customers
INTERSECT ALL
SELECT region FROM destinations;
-- (5 rows) Chattogram twice

SELECT city FROM customers
EXCEPT ALL
SELECT region FROM destinations;
-- (10 rows) Dhaka six times

SELECT guide_id FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours);
-- (0 rows)

SELECT guide_id FROM guides
EXCEPT
SELECT guide_id FROM tours;
-- (1 row) 5`,
      },
      {
        language: "sql",
        filename: "05-order-and-limit.sql",
        code: `SELECT full_name AS name, 'customer' AS kind FROM customers
UNION ALL
SELECT full_name, 'guide' FROM guides
ORDER BY name
LIMIT 5;
-- (5 rows) Aiman Zulkifli ... Imran Kabir

(SELECT title, price_bdt FROM tours ORDER BY price_bdt DESC LIMIT 2)
UNION ALL
(SELECT title, price_bdt FROM tours ORDER BY price_bdt LIMIT 2)
ORDER BY price_bdt DESC;
-- (4 rows) 32000.00, 18000.00, 7800.00, 3500.00

SELECT full_name FROM customers
UNION ALL
SELECT full_name FROM guides
ORDER BY city;
-- ERROR:  column "city" does not exist`,
      },
      {
        language: "sql",
        filename: "06-data-health.sql",
        code: `SELECT 'Booking with no payment' AS problem, booking_id AS id
FROM (SELECT booking_id FROM bookings
      EXCEPT SELECT booking_id FROM payments) AS unpaid
UNION ALL
SELECT 'Customer with no booking', customer_id
FROM (SELECT customer_id FROM customers
      EXCEPT SELECT customer_id FROM bookings) AS idle
UNION ALL
SELECT 'Departure with no booking', departure_id
FROM (SELECT departure_id FROM departures
      EXCEPT SELECT departure_id FROM bookings) AS empty_dates
UNION ALL
SELECT 'Guide with no tour', guide_id
FROM (SELECT guide_id FROM guides
      EXCEPT SELECT guide_id FROM tours) AS free_guides
ORDER BY problem, id;
-- (8 rows) five unpaid bookings, customer 15, departure 16, guide 5`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Set Operation চালানোর আগে দুই দিক আলাদা চালিয়ে Row গুনে নিন। UNION ALL হলে ফলাফল ঠিক যোগফল, INTERSECT কখনো ছোট
        দিকের চেয়ে বড় না, EXCEPT কখনো প্রথম দিকের চেয়ে বড় না। সংখ্যা এই সীমার বাইরে গেলে Query তে কোথাও ভুল আছে।
      </ContentParagraph>
    ),
  },
};
