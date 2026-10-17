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
  PartitionWindowLab,
  SeatShareLab,
  ThreeWaysLab,
} from "../../../components/course/topics/windows/partition-animations";
import {
  GroupVsPartitionSplit,
  PartitionSlicesDiagram,
  SeveralWindowsDiagram,
  WhereThenWindowDiagram,
} from "../../../components/course/topics/windows/partition-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const partitionByContent: TopicData = {
  id: "partition-by",
  introduction: {
    badge: "MODULE 08 · LESSON 03",
    title: <SectionTitle>প্রতিটা দলের জন্য আলাদা Window: PARTITION BY</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে Window Function এর Window ছিল একটাই: পুরো ফলাফল। OVER () লিখলে প্রতিটা Row তার পাশে সব Row এর
          গড় দেখে, আর OVER (ORDER BY ...) লিখলে সব Row মিলে একটা র‍্যাংকের লাইন হয়। কিন্তু বাস্তবের প্রায় কোনো প্রশ্নই
          &ldquo;সবার সাথে তুলনা&rdquo; চায় না। প্রশ্নগুলো আসে এভাবে: এই ট্যুরটা নিজের Destination এর অন্য ট্যুরের
          তুলনায় দামি না সস্তা? এই Booking টা Customer এর কততম? এই Departure এর সিটের কত ভাগ এই একটা Booking নিয়েছে?
        </ContentParagraph>
        <ContentParagraph>
          প্রতিটা প্রশ্নে তুলনাটা হয় একটা দলের ভেতরে: নিজের Destination, নিজের Customer, নিজের Departure। Window কে
          দলে দলে ভাগ করার কাজটা করে OVER এর ভেতরের একটা ছোট অংশ, PARTITION BY। এটা দিয়ে একটা Query তেই প্রতিটা দলের
          জন্য আলাদা Window তৈরি হয়, আর কোনো Row হারায় না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন PARTITION BY ঠিক কী করে, GROUP BY এর সাথে তার আসল তফাত কোথায়, প্রতিটা দলের ভেতরে
          র‍্যাংক আর ক্রমিক নম্বর কীভাবে দিতে হয়, দলের মোটের কত ভাগ একটা Row, একটা Query তে কয়েকটা আলাদা দল কীভাবে
          পাশাপাশি চলে, WHERE কেন Window এর দেখা Row বদলে দেয়, কোনো Expression দিয়ে দল বানানো, আর একই উত্তর Join বা
          Correlated Subquery দিয়েও কীভাবে লেখা যায়। প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে বলে দিন কারা কারা একই দলের, বাকিটা আমি সামলাব। প্রতিটা দলের হিসাব আলাদা করে করব, আর হিসাব শেষে প্রতিটা Row কে তার নিজের দলের উত্তরটা দিয়ে দেব। কাউকে বাদ দেব না।",
      author: "PARTITION BY",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>সব ট্যুরের গড়, নাকি নিজের Destination এর গড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকালের বৈঠকে Island Tours এর Operations Manager ফারুক সাহেব শীতের মৌসুমের দাম ঠিক করার কথা তুললেন।
                তিনি প্রতিটা ট্যুরের পাশে একটা সংখ্যা চান: এই ট্যুর যে জায়গায় যায়, সেই জায়গার সব ট্যুরের গড় দাম। কারণটা
                সহজ। Saint Martin এর ট্যুরের দাম তুলনা করতে হবে Saint Martin এর অন্য ট্যুরের সাথে, Sylhet এর ট্যুরের সাথে
                না। দ্বীপে যাওয়ার জাহাজ, থাকা, খাওয়া, সবকিছুর খরচ আলাদা, তাই দুই জায়গার দাম পাশাপাশি রেখে লাভ নেই।
              </ContentParagraph>
              <ContentParagraph>
                Developer তানিম Lesson 01 এ OVER () শিখেছেন। তিনি সাথে সাথে লিখলেন: প্রতিটা ট্যুরের পাশে সব ট্যুরের গড়
                দাম। Query চলল, নয়টা Row এল, প্রতিটার পাশে একই সংখ্যা: 13477.78।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: সব ট্যুরের গড়"
              query={`SELECT title, destination_id, price_bdt,
       round(avg(price_bdt) OVER (), 2) AS overall_avg
FROM tours
ORDER BY destination_id, tour_id;`}
              caption="নয়টা Row, প্রতিটার পাশে 13477.78। এই সংখ্যার সাথে তুলনা করলে Saint Martin Island Escape (12500) গড়ের নিচে, সস্তা ট্যুর মনে হয়। অথচ Saint Martin এর আরেকটা ট্যুর, Luxury Stay, 32000 টাকার। নিজের জায়গার হিসাবে Island Escape আসলে বাজেট ট্যুর, আর এই তুলনা সেটা বলতে পারছে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের Query তে কোনো ভুল নেই, ভুলটা মাপকাঠিতে। OVER () এর Window সবসময় পুরো ফলাফল, তাই সবার পাশে একটাই
                সংখ্যা বসে। ফারুক সাহেব চেয়েছেন এমন একটা Window, যেটা প্রতিটা Destination এর জন্য আলাদা: Saint Martin এর
                ট্যুরগুলোর জন্য Saint Martin এর দুটো ট্যুর, Sylhet এর জন্য Sylhet এর দুটো, আর এভাবে।
              </ContentParagraph>
              <ContentParagraph>
                Module 05 এর একজন ছাত্র হলে তানিম হয়তো GROUP BY destination_id লিখতেন। তাতে প্রতিটা Destination এর গড়
                ঠিকই আসত, কিন্তু ট্যুরগুলো আর থাকত না: নয়টা ট্যুর গুটিয়ে ছয়টা Row হয়ে যেত, আর কোন ট্যুরের দাম কত, সেটা
                আর দেখা যেত না। ফারুক সাহেবের দরকার দুটোই একসাথে: প্রতিটা ট্যুর, আর তার পাশে তার নিজের দলের গড়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY দিয়ে চেষ্টা: গড় ঠিক, ট্যুর হারিয়ে গেল"
              query={`SELECT destination_id,
       round(avg(price_bdt), 2) AS dest_avg,
       count(*) AS tours
FROM tours
GROUP BY destination_id
ORDER BY destination_id;`}
              caption="ছয়টা Row, প্রতিটা Destination এর একটা। Saint Martin (1) এর গড় 22250.00, Sylhet (6) এর 5650.00। সংখ্যাগুলো ঠিক, কিন্তু প্রশ্নের অর্ধেক উত্তর: কোন ট্যুরের দাম কত, তার আর কোনো খোঁজ নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিজেকে একটা প্রশ্ন করুন",
          content: (
            <ContentParagraph>
              Window Function লেখার আগে জিজ্ঞেস করুন: এই Row এর পাশের সংখ্যাটা কাদের নিয়ে হিসাব হবে? সবাইকে নিয়ে হলে OVER
              ()। কোনো একটা দলকে নিয়ে হলে, যেমন &ldquo;একই Destination এর&rdquo;, &ldquo;একই Customer এর&rdquo;,
              &ldquo;একই মাসের&rdquo;, তখন এই লেসনের PARTITION BY।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "one-window-per-group",
      subHeader: { index: "002", title: "One Window per Group" },
      title: <SectionTitle>দলে দলে ভাগ, তারপর প্রতিটা দলের হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের বার্ষিক পরীক্ষার কথা ভাবুন। ক্লাস সিক্সের সব ছাত্রছাত্রী তিনটা শাখায়: ক, খ আর গ। প্রতিটা শাখার
                শিক্ষক নিজের শাখার খাতাগুলো আলাদা করে নিয়ে নিজের শাখার গড় নম্বর বের করেন। তারপর প্রতিটা ছাত্রের রিপোর্ট
                কার্ডে তার নিজের নম্বরের পাশে লেখা হয় তার নিজের শাখার গড়। ক শাখার ছাত্রের কার্ডে ক শাখার গড়, খ শাখার
                ছাত্রের কার্ডে খ শাখার গড়। কোনো ছাত্র বাদ পড়ে না, আর কারো কার্ডে অন্য শাখার গড় যায় না।
              </ContentParagraph>
              <ContentParagraph>
                PARTITION BY ঠিক এই কাজটা করে। OVER এর ভেতরে{" "}
                <code className={CODE}>PARTITION BY destination_id</code> লিখলে Database ট্যুরগুলোকে destination_id এর মান
                অনুযায়ী আলাদা আলাদা দলে ভাগ করে। প্রতিটা দলের নাম Partition। তারপর Window Function প্রতিটা Partition এর
                ভেতরে আলাদা করে হিসাব করে, আর প্রতিটা Row এর পাশে তার নিজের Partition এর উত্তর বসায়।
              </ContentParagraph>
              <ContentParagraph>
                শব্দগুলো একবার মিলিয়ে নিন। Partition মানে Window এর একটা দল: যেসব Row এর PARTITION BY Column এর মান এক,
                তারা একই Partition এ। Window মানে কোনো একটা Row এর হিসাবে যেসব Row অংশ নেয়। PARTITION BY থাকলে একটা Row এর
                Window তার নিজের Partition, তার বাইরে কিছু না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PartitionSlicesDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফারুক সাহেবের প্রশ্নের উত্তর: নিজের Destination এর গড়"
              query={`SELECT title, destination_id, price_bdt,
       round(avg(price_bdt) OVER (), 2) AS overall_avg,
       round(avg(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg
FROM tours
ORDER BY destination_id, tour_id;`}
              caption="নয়টা Row ই আছে, আর পাশে দুটো গড়। overall_avg সবার জন্য 13477.78, কিন্তু dest_avg প্রতিটা দলের নিজের: Saint Martin এর দুটো ট্যুরের পাশে 22250.00, Cox's Bazar এর দুটোর পাশে 12000.00, Sylhet এর দুটোর পাশে 5650.00। যেসব Destination এ একটাই ট্যুর (Sundarbans, Sajek, Bandarban), সেখানে গড় আর নিজের দাম একই, কারণ দলে সে একা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো OVER পাশাপাশি রেখে তফাতটা চোখে পড়ে। একই avg(price_bdt), শুধু OVER এর ভেতরটা আলাদা। ফাঁকা বন্ধনী মানে
                পুরো ফলাফল এক দল, আর PARTITION BY destination_id মানে Destination অনুযায়ী ছয়টা দল। এখন ফারুক সাহেব এক নজরে
                দেখতে পান: Saint Martin Island Escape নিজের জায়গার গড়ের চেয়ে অনেক সস্তা, আর Luxury Stay অনেক দামি।
              </ContentParagraph>
              <ContentParagraph>
                Kuakata এর কথা খেয়াল করুন। destinations Table এ Kuakata আছে (destination 7), কিন্তু তার কোনো ট্যুর নেই।
                PARTITION BY শুধু সেই Row গুলো থেকেই দল বানায় যেগুলো Query তে আছে, এখানে tours এর নয়টা Row। Kuakata এর কোনো
                Row নেই, তাই তার কোনো দলও নেই। খালি দল দেখাতে চাইলে আগে Module 06 এর LEFT JOIN দিয়ে Row আনতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code>, <code className={CODE}>destination_id</code>,{" "}
                  <code className={CODE}>price_bdt</code>, আর তার নিজের Destination এর সব ট্যুরের গড় দাম, দুই দশমিকে
                  round করে, <code className={CODE}>dest_avg</code> নামে। নয়টা ট্যুরই আসবে। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>round(avg(price_bdt) OVER (PARTITION BY destination_id), 2)</code>, আর কোনো
                  GROUP BY না।
                </>
              }
              solution={`SELECT title, destination_id, price_bdt,
       round(avg(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "watch-the-windows",
      subHeader: { index: "003", title: "Watch the Windows" },
      title: <SectionTitle>একটা Row বেছে নিন, তার Window দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY বোঝার সবচেয়ে ভালো উপায় হলো একটা Row এর জায়গায় বসে দেখা: এই Row এর হিসাবে কোন কোন Row অংশ নেয়?
                নিচের Lab এ নয়টা আসল ট্যুর আছে। উপরে বেছে নিন কী দিয়ে দল বানাবেন (destination_id, guide_id, নাকি দামের
                ধরন), আর প্রতিটা দলে কী হিসাব হবে (কয়টা ট্যুর, গড় দাম, নাকি দাম অনুযায়ী র‍্যাংক)। তারপর যেকোনো ট্যুরের নামে
                ক্লিক করুন। সেই ট্যুরের Window এর Row গুলো রঙিন হবে, আর নিচে লেখা থাকবে উত্তরটা কোথা থেকে এল।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা জিনিস পরীক্ষা করে দেখুন। প্রথমত, PARTITION নেই বেছে নিলে প্রতিটা Row এর Window নয়টা Row, এটাই OVER
                ()। দ্বিতীয়ত, guide_id দিয়ে দল বানালে Ratargul Swamp Boat Day একা একটা দলে, কারণ তার guide_id NULL, আর
                সব NULL এক দলে যায়। তৃতীয়ত, যে দল আর যে হিসাবই বেছে নিন, নিচের তালিকায় সবসময় নয়টা Row থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PartitionWindowLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা বাক্যে PARTITION BY",
          content: (
            <ContentParagraph>
              PARTITION BY একটা Row এর Window কে ছোট করে তার নিজের দলে নামিয়ে আনে। Row গুলো ফলাফলে যেমন ছিল তেমনই থাকে,
              শুধু প্রতিটা Row এর পাশের হিসাবটা হয় তার নিজের দলের Row দিয়ে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "partition-vs-group",
      subHeader: { index: "004", title: "PARTITION BY vs GROUP BY" },
      title: <SectionTitle>দল একই, ফলাফল আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY আর GROUP BY দুটোই Row গুলোকে একই মানের দলে ভাগ করে, তাই প্রথমে দুটোকে এক মনে হয়। আসল তফাত
                দলের পরে কী হয় তাতে। GROUP BY প্রতিটা দলকে একটা Row এ গুটিয়ে ফেলে: দলের ভেতরের Row গুলো আর আলাদা করে থাকে
                না, শুধু দলের সারাংশ থাকে। PARTITION BY দলটা ব্যবহার করে শুধু হিসাবের জন্য: হিসাব শেষে প্রতিটা Row আবার
                নিজের জায়গায় ফিরে আসে, পাশে দলের উত্তর নিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা সরাসরি ফল আছে। GROUP BY এর পরে SELECT এ শুধু দলের Column আর Aggregate রাখা যায়, Module 05 এর সেই
                নিয়ম। PARTITION BY এর ক্ষেত্রে এমন কোনো নিয়ম নেই, কারণ Row গুলো তো আছেই: title, price_bdt, যেকোনো Column
                পাশে রাখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GroupVsPartitionSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো Query, Row গুনে দেখুন"
              query={`SELECT count(*) AS group_by_rows
FROM (SELECT destination_id, avg(price_bdt)
      FROM tours
      GROUP BY destination_id) g;

SELECT count(*) AS partition_by_rows
FROM (SELECT title, avg(price_bdt) OVER (PARTITION BY destination_id)
      FROM tours) p;`}
              caption="প্রথমটা 6, দ্বিতীয়টা 9। একই দল (destination_id), একই হিসাব (avg)। GROUP BY ছয়টা দলকে ছয়টা Row বানায়, PARTITION BY নয়টা Row ই রেখে দেয়। কোনটা লিখবেন, সেটা ঠিক করে প্রশ্নটা: দলের সারাংশ চাই, নাকি প্রতিটা Row আর তার পাশে দলের সারাংশ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY তে title রাখলে Error, PARTITION BY তে কোনো সমস্যা নেই"
              query={`SELECT title, destination_id,
       round(avg(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg
FROM tours
WHERE destination_id = 6;

SELECT title, destination_id, round(avg(price_bdt), 2) AS dest_avg
FROM tours
WHERE destination_id = 6
GROUP BY destination_id;`}
              caption="প্রথম Query দুটো Row দেয়: Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day, দুজনের পাশেই 5650.00। দ্বিতীয় Query Error দেয়: column &quot;tours.title&quot; must appear in the GROUP BY clause or be used in an aggregate function। কারণ GROUP BY এর পরে দুটো ট্যুর মিলে একটা Row, তাহলে title কোনটা বসবে? PARTITION BY এই প্রশ্নই তোলে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "GROUP BY", "PARTITION BY (OVER এর ভেতরে)"],
          rows: [
            ["কোথায় লেখা হয়", "FROM আর WHERE এর পরে, আলাদা Clause", "Window Function এর OVER (...) এর ভেতরে"],
            ["ফলাফলে কয়টা Row", "প্রতিটা দলের একটা", "যতগুলো Row ঢুকেছিল, ততগুলোই"],
            ["SELECT এ কী রাখা যায়", "শুধু দলের Column আর Aggregate", "যেকোনো Column, পাশে Window এর উত্তর"],
            ["কতগুলো দল একসাথে", "একটা Query তে একটাই দলের নিয়ম", "প্রতিটা OVER এর নিজের দল, একসাথে কয়েকটা"],
            ["সাধারণ প্রশ্ন", "প্রতিটা Destination এ কয়টা ট্যুর", "প্রতিটা ট্যুর, আর তার Destination এ কয়টা ট্যুর"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "rank-inside-groups",
      subHeader: { index: "005", title: "Rank Inside Each Group" },
      title: <SectionTitle>প্রতিটা দলে নতুন করে গোনা শুরু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 02 এ আপনি ROW_NUMBER, RANK আর DENSE_RANK শিখেছেন, পুরো ফলাফলের উপর। সেখানে সবচেয়ে দামি ট্যুর পুরো
                তালিকায় এক নম্বর হতো। কিন্তু ফারুক সাহেব জানতে চান প্রতিটা Destination এর ভেতরে কোনটা সবচেয়ে দামি। মানে
                র‍্যাংকটা প্রতিটা Destination এ আলাদা করে 1 থেকে শুরু হবে।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য OVER এর ভেতরে দুটো অংশ পাশাপাশি বসে। আগে PARTITION BY, যেটা বলে কোন দলের ভেতরে গুনতে হবে। তারপর
                ORDER BY, যেটা বলে দলের ভেতরে কার পরে কে। প্রতিটা নতুন দলে গোনা আবার 1 থেকে শুরু হয়, ঠিক যেমন প্রতিটা শাখার
                মেধাতালিকা আলাদা, আর প্রতিটা শাখায় একজন করে প্রথম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Destination এর ভেতরে দামের র‍্যাংক"
              query={`SELECT title, destination_id, price_bdt,
       rank() OVER (PARTITION BY destination_id
                    ORDER BY price_bdt DESC) AS rank_in_dest,
       count(*) OVER (PARTITION BY destination_id) AS tours_in_dest
FROM tours
ORDER BY destination_id, rank_in_dest;`}
              caption="নয়টা Row। Saint Martin এ Luxury Stay 1, Island Escape 2। Cox's Bazar এ Family Package 1, Beach Weekend 2। Sylhet এ Tea Garden Tour 1, Ratargul 2। একা থাকা তিনটা ট্যুর নিজের দলে 1। পুরো তালিকায় Island Escape পঞ্চম, কিন্তু নিজের Destination এ দ্বিতীয়, আর ফারুক সাহেবের প্রশ্নে এটাই দরকারি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                OVER এর ভেতরের ORDER BY আর Query এর শেষের ORDER BY দুটো আলাদা কাজ করে, Lesson 02 এর সেই কথা এখানেও খাটে।
                ভেতরেরটা ঠিক করে প্রতিটা দলের ভেতরে র‍্যাংক কীভাবে দেওয়া হবে। শেষেরটা ঠিক করে ফলাফল আপনাকে কোন ক্রমে
                দেখানো হবে। শেষের ORDER BY বাদ দিলেও র‍্যাংকগুলো একই থাকে, শুধু Row গুলো হয়তো অন্য ক্রমে আসে।
              </ContentParagraph>
              <ContentParagraph>
                একই কৌশল দিয়ে প্রতিটা Customer এর Booking গুলোকে নম্বর দেওয়া যায়: তাঁর প্রথম Booking, দ্বিতীয় Booking,
                এভাবে। এখানে ROW_NUMBER ভালো, কারণ প্রতিটা Booking এর একটা আলাদা নম্বর চাই। আর ROW_NUMBER যেন প্রতিবার একই
                উত্তর দেয়, তাই ORDER BY তে booked_at এর পরে booking_id: দুটো Booking এর সময় হুবহু এক হলেও ক্রম নিয়ে কোনো
                সন্দেহ থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর কততম Booking"
              query={`SELECT customer_id, booking_id, booked_at,
       row_number() OVER (PARTITION BY customer_id
                          ORDER BY booked_at, booking_id) AS nth,
       count(*) OVER (PARTITION BY customer_id) AS of_total
FROM bookings
ORDER BY customer_id, nth;`}
              caption="চব্বিশটা Row। Rahim Uddin (customer 1) এর তিনটা Booking: 1, 8 আর 17, নম্বর 1, 2, 3, আর পাশে of_total 3। প্রতিটা নতুন Customer এ গোনা আবার 1 থেকে শুরু। একটাই Booking যাঁদের (Sabbir, Arif, Aiman, Kamal, Lamia), তাঁদের nth আর of_total দুটোই 1। Imran Kabir এর কোনো Booking নেই, তাই তিনি এখানে নেই।"
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
                  প্রতিটা ট্যুরের <code className={CODE}>title</code>, <code className={CODE}>destination_id</code>,{" "}
                  <code className={CODE}>price_bdt</code>, আর নিজের Destination এর ভেতরে দামের ক্রম{" "}
                  <code className={CODE}>price_rank</code> নামে: সবচেয়ে দামি 1, rank() দিয়ে। নয়টা ট্যুরই আসবে। Row এর
                  ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>rank() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC)</code>।
                </>
              }
              solution={`SELECT title, destination_id, price_bdt,
       rank() OVER (PARTITION BY destination_id
                    ORDER BY price_bdt DESC) AS price_rank
FROM tours;`}
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
                  প্রতিটা Booking এর <code className={CODE}>customer_id</code>, <code className={CODE}>booking_id</code>,
                  আর <code className={CODE}>nth</code>: এটা সেই Customer এর কততম Booking, booked_at এর ক্রমে, সময় সমান
                  হলে ছোট booking_id আগে। row_number() দিয়ে। চব্বিশটা Row। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>row_number() OVER (PARTITION BY customer_id ORDER BY booked_at, booking_id)</code>।
                </>
              }
              solution={`SELECT customer_id, booking_id,
       row_number() OVER (PARTITION BY customer_id
                          ORDER BY booked_at, booking_id) AS nth
FROM bookings;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "share-of-group",
      subHeader: { index: "006", title: "Share of the Group" },
      title: <SectionTitle>দলের মোটের কত ভাগ এই একটা Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY এর সবচেয়ে কাজের ব্যবহারগুলোর একটা হলো ভাগ বের করা। Island Tours এর Operations টিম জানতে চায়
                প্রতিটা Departure এ কোন Booking কত বড়: নৌকার মোট সিটের কত ভাগ একটা পরিবার নিয়েছে। বড় দল হলে আগে থেকে
                তাঁদের আলাদা কেবিন বা বেশি খাবারের ব্যবস্থা করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                হিসাবটা দুই ধাপের। প্রথমে প্রতিটা Booking এর পাশে তার Departure এর মোট সিট:{" "}
                <code className={CODE}>sum(seats) OVER (PARTITION BY departure_id)</code>। তারপর নিজের সিটকে সেই মোট দিয়ে
                ভাগ করে 100 দিয়ে গুণ। ভাগের নিচের সংখ্যাটা, যাকে হর বলে, প্রতিটা Departure এর জন্য আলাদা, আর সেটাই PARTITION
                BY এর কাজ। cancelled Booking গুলো WHERE দিয়ে আগেই বাদ, কারণ বাতিল Booking কোনো সিট ধরে রাখে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SeatShareLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Booking, তার Departure এর সিটের কত ভাগ"
              query={`SELECT booking_id, departure_id, seats,
       sum(seats) OVER (PARTITION BY departure_id) AS dep_seats,
       round(100.0 * seats
             / sum(seats) OVER (PARTITION BY departure_id), 1) AS pct
FROM bookings
WHERE status <> 'cancelled'
ORDER BY departure_id, booking_id;`}
              caption="একুশটা Row (চব্বিশটার তিনটা বাতিল)। Departure 1 এ Booking 1 আর 2: দুই আর চার সিট, মোট ছয়, ভাগ 33.3 আর 66.7। Departure 10 এ Booking 15 আর 23: তিন আর পাঁচ সিট, ভাগ 37.5 আর 62.5। যে Departure এ একটাই Booking, সেখানে ভাগ 100.0। একটা Departure এর সব ভাগ যোগ করলে 100 হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query তে 100 না লিখে 100.0 লেখা হয়েছে, আর সেটা ইচ্ছা করেই। Module 04 এর পূর্ণসংখ্যার ভাগের ফাঁদ এখানে আবার
              ফিরে আসে: seats একটা smallint, আর sum(seats) একটা bigint। দুটো পূর্ণসংখ্যা ভাগ করলে PostgreSQL দশমিক ফেলে দেয়।
              নিচের বক্সে দুটো পাশাপাশি দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="100 বনাম 100.0"
              query={`SELECT booking_id, departure_id, seats,
       100 * seats / sum(seats) OVER (PARTITION BY departure_id) AS pct_int,
       round(100.0 * seats
             / sum(seats) OVER (PARTITION BY departure_id), 1) AS pct
FROM bookings
WHERE status <> 'cancelled'
  AND departure_id IN (1, 10)
ORDER BY departure_id, booking_id;`}
              caption="pct_int এ 33, 66, 37, 62: যোগ করলে Departure 1 এ 99, Departure 10 এ 99, এক শতাংশ উধাও। pct এ 33.3, 66.7, 37.5, 62.5: যোগফল ঠিক 100। ভাগের কোনো একটা দিক দশমিক হলেই পুরো হিসাব দশমিকে হয়, তাই 100.0 লেখাই যথেষ্ট।"
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
                  বাতিল নয় এমন প্রতিটা Booking এর <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>departure_id</code>, <code className={CODE}>seats</code>, আর তার Departure এর
                  বাতিল নয় এমন সব সিটের কত শতাংশ এই Booking এর, এক দশমিকে round করে,{" "}
                  <code className={CODE}>pct</code> নামে। একুশটা Row। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  WHERE এ <code className={CODE}>{"status <> 'cancelled'"}</code>, আর{" "}
                  <code className={CODE}>round(100.0 * seats / sum(seats) OVER (PARTITION BY departure_id), 1)</code>।
                </>
              }
              solution={`SELECT booking_id, departure_id, seats,
       round(100.0 * seats
             / sum(seats) OVER (PARTITION BY departure_id), 1) AS pct
FROM bookings
WHERE status <> 'cancelled';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "several-windows",
      subHeader: { index: "007", title: "Several Windows at Once" },
      title: <SectionTitle>একই Query তে কয়েক রকম দল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GROUP BY এর একটা সীমা ছিল: একটা Query তে দল বানানোর নিয়ম একটাই। Customer অনুযায়ী আর Status অনুযায়ী দুটো
                আলাদা হিসাব চাইলে দুটো Query লিখে জোড়া দিতে হতো। Window এ এই সীমা নেই। প্রতিটা OVER এর নিজের দল, আর একই
                SELECT এ যত খুশি OVER রাখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন Support টিমের একটা পাতায় প্রতিটা Booking এর পাশে তিনটা সংখ্যা চাই: মোট কতগুলো Booking, এই Customer
                এর কতগুলো, আর এই Status এর কতগুলো। তিনটা OVER, তিনটা আলাদা দল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SeveralWindowsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা OVER, তিনটা দল"
              query={`SELECT booking_id, customer_id, status,
       count(*) OVER () AS all_bookings,
       count(*) OVER (PARTITION BY customer_id) AS cust_bookings,
       count(*) OVER (PARTITION BY status) AS status_bookings
FROM bookings
ORDER BY booking_id
LIMIT 6;`}
              caption="ছয়টা Row দেখানো হয়েছে, কিন্তু all_bookings প্রতিটায় 24। Booking 1 এর পাশে 24, 3 আর 17: সব Booking চব্বিশটা, Customer 1 এর তিনটা, confirmed সতেরোটা। Booking 5 এর পাশে 3 status_bookings, কারণ cancelled মোট তিনটা। LIMIT কাজ করে Window এর পরে, তাই LIMIT ছয়টা Row রাখলেও Window চব্বিশটাই দেখেছে। পরের Section এ দেখবেন WHERE এর বেলায় এটা খাটে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই দল কয়েকবার ব্যবহার করলে প্রতিবার OVER (PARTITION BY customer_id) লেখা ক্লান্তিকর, আর একটা জায়গায়
                বদলালে বাকিগুলো ভুলে যাওয়ার ভয় থাকে। Lesson 01 এর WINDOW Clause এখানে কাজে আসে: দলটাকে একবার নাম দিন,
                তারপর OVER এর পরে শুধু নামটা লিখুন। WINDOW বসে WHERE, GROUP BY আর HAVING এর পরে, ORDER BY এর আগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একবার নাম দিন, তিনবার ব্যবহার করুন"
              query={`SELECT booking_id, customer_id, total_bdt,
       count(*) OVER c AS cust_bookings,
       sum(total_bdt) OVER c AS cust_total,
       round(avg(total_bdt) OVER c, 2) AS cust_avg
FROM bookings
WHERE customer_id IN (1, 2)
WINDOW c AS (PARTITION BY customer_id)
ORDER BY customer_id, booking_id;`}
              caption="পাঁচটা Row। Rahim (customer 1) এর তিনটা Booking এর পাশে 3, 80000.00 আর 26666.67, Nusrat (customer 2) এর দুটোর পাশে 2, 75000.00 আর 37500.00। তিনটা হিসাবই একই দল c ব্যবহার করে। পরে দলটা বদলাতে চাইলে শুধু WINDOW এর লাইনটা বদলালেই হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Database এ দুই রকম দল মানে দুইবার সাজানো"
              query={`EXPLAIN (COSTS OFF)
SELECT booking_id,
       count(*) OVER (PARTITION BY customer_id),
       count(*) OVER (PARTITION BY status)
FROM bookings;`}
              caption="Plan টা নিচ থেকে উপরে পড়ুন। প্রথমে Seq Scan, তারপর status দিয়ে Sort আর একটা WindowAgg, তারপর customer_id দিয়ে আবার Sort আর আরেকটা WindowAgg। প্রতিটা আলাদা PARTITION BY এর জন্য Database Row গুলো সেই Column দিয়ে সাজায়, যাতে একই দলের Row পাশাপাশি আসে। দুটো OVER এর ভেতরটা হুবহু এক হলে PostgreSQL নিজেই একবার সাজিয়ে একটা WindowAgg এ দুটো হিসাব করে, নাম দিন বা না দিন। তাই WINDOW Clause এর আসল লাভ গতিতে না, পড়ার সুবিধা আর ভুল কমানোয়।"
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
                  প্রতিটা Booking এর <code className={CODE}>booking_id</code>, সেই Customer এর মোট Booking সংখ্যা{" "}
                  <code className={CODE}>customer_bookings</code> নামে, আর booked_at এর মাসে (date_trunc দিয়ে) মোট কয়টা
                  Booking হয়েছে, <code className={CODE}>month_bookings</code> নামে। চব্বিশটা Row। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  দুটো OVER: একটা <code className={CODE}>PARTITION BY customer_id</code>, আরেকটা{" "}
                  <code className={CODE}>{"PARTITION BY date_trunc('month', booked_at)"}</code>।
                </>
              }
              solution={`SELECT booking_id,
       count(*) OVER (PARTITION BY customer_id) AS customer_bookings,
       count(*) OVER (PARTITION BY date_trunc('month', booked_at)) AS month_bookings
FROM bookings;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "where-first",
      subHeader: { index: "008", title: "Rows Left After WHERE" },
      title: <SectionTitle>Window শুধু সেই Row দেখে, যা WHERE রেখে গেছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এর Logical Order আবার মনে করুন: FROM, WHERE, GROUP BY, HAVING, তারপর SELECT, তারপর ORDER BY আর
                LIMIT। Window Function চলে SELECT এর ধাপে, মানে WHERE এর অনেক পরে আর LIMIT এর আগে। এর মানে দাঁড়ায় একটা
                জরুরি নিয়ম: Window কখনো সেই Row দেখে না, যেটা WHERE বাদ দিয়ে দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                আগের Section এর তিন OVER এর Query টাই নিন, শুধু LIMIT এর বদলে WHERE দিয়ে তিনজন Customer রাখুন। এবার
                all_bookings আর 24 থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereThenWindowDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই তিন OVER, এবার WHERE সহ"
              query={`SELECT booking_id, customer_id, status,
       count(*) OVER () AS all_bookings,
       count(*) OVER (PARTITION BY customer_id) AS cust_bookings,
       count(*) OVER (PARTITION BY status) AS status_bookings
FROM bookings
WHERE customer_id IN (1, 2, 5)
ORDER BY booking_id;`}
              caption="ছয়টা Row, আর all_bookings এখন 6, 24 না। status_bookings এ confirmed 4 (Rahim এর দুটো, Nusrat এর দুটো), pending 1, cancelled 1, পুরো Table এর 17, 4 আর 3 না। cust_bookings বদলায়নি (3, 2, 1), কারণ এই তিনজনের সব Booking ই WHERE পার হয়েছে। Window এর কাছে পুরো দুনিয়া মানে WHERE এর পরের ছয়টা Row।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ভাগের হর নিয়ে সাবধান",
          content: (
            <ContentParagraph>
              শতাংশ হিসাবের সময় এটা সবচেয়ে বড় ফাঁদ। &ldquo;Rahim এর Booking গুলো মোট টাকার কত ভাগ&rdquo; লিখতে গিয়ে
              WHERE customer_id = 1 দিয়ে sum(total_bdt) OVER () নিলে হরটা শুধু Rahim এর টাকা, তাই উত্তর আসে 100 শতাংশ। পুরো
              Table এর হর চাইলে Window টা আগে একটা CTE তে পুরো Table এর উপর চালান, তারপর বাইরের Query তে WHERE দিয়ে
              Rahim কে রাখুন। Lesson 01 এ এই CTE এর কৌশলটা দেখেছেন। কোন Row দেখানো হবে আর কোন Row হিসাবে অংশ নেবে, এই দুটো
              আলাদা প্রশ্ন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "partition-by-expression",
      subHeader: { index: "009", title: "Partition by an Expression" },
      title: <SectionTitle>Column না, যেকোনো হিসাব দিয়ে দল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PARTITION BY এর পরে শুধু Column এর নাম না, যেকোনো Expression বসানো যায়: Module 04 এর Function, CASE, যা
                খুশি। Database প্রতিটা Row এর জন্য Expression টা হিসাব করে, আর যাদের উত্তর এক, তারা এক দলে। সবচেয়ে কাজের
                উদাহরণ হলো মাস: booked_at একটা সময়, প্রতিটা Booking এর আলাদা, কিন্তু date_trunc(&apos;month&apos;, booked_at)
                একই মাসের সব Booking কে একই সংখ্যায় নিয়ে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মাস অনুযায়ী দল: প্রতিটা Booking, আর তার মাসের মোট"
              query={`SELECT booking_id, to_char(booked_at, 'YYYY-MM') AS month, total_bdt,
       count(*) OVER (PARTITION BY date_trunc('month', booked_at)) AS bookings_in_month,
       sum(total_bdt) OVER (PARTITION BY date_trunc('month', booked_at)) AS month_total
FROM bookings
ORDER BY booked_at;`}
              caption="চব্বিশটা Row। January 2026 এর ছয়টা Booking এর পাশে 6 আর 134000.00, October 2026 এর নয়টার পাশে 9 আর 246700.00, February এর একটার পাশে 1 আর 19000.00। এখানে বাতিল Booking ও আছে, কারণ কোনো WHERE নেই। মাস ঠিক হয় এই বক্সের TimeZone (Asia/Dhaka) অনুযায়ী, Module 04 এর সেই কথা: নিজের psql এ TimeZone আলাদা হলে মাঝরাতের কাছের Booking অন্য মাসে চলে যেতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              CASE দিয়েও দল বানানো যায়। Marketing টিম ট্যুরগুলোকে তিন ভাগে ভাবে: দশ হাজারের নিচে budget, বিশ হাজারের নিচে
              standard, বাকিটা premium। প্রতিটা ট্যুরের পাশে তার ভাগে কয়টা ট্যুর আর ভাগের গড় দাম চাই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CASE দিয়ে দামের ভাগ, তারপর প্রতিটা ভাগের হিসাব"
              query={`SELECT title, price_bdt,
       CASE WHEN price_bdt < 10000 THEN 'budget'
            WHEN price_bdt < 20000 THEN 'standard'
            ELSE 'premium' END AS band,
       count(*) OVER w AS tours_in_band,
       round(avg(price_bdt) OVER w, 2) AS band_avg
FROM tours
WINDOW w AS (PARTITION BY CASE WHEN price_bdt < 10000 THEN 'budget'
                               WHEN price_bdt < 20000 THEN 'standard'
                               ELSE 'premium' END)
ORDER BY price_bdt;`}
              caption="নয়টা Row। budget এ চারটা ট্যুর (Ratargul, Sylhet Tea Garden, Cox's Bazar Beach Weekend, Sajek), গড় 7325.00। standard এ চারটা, গড় 15000.00। premium এ শুধু Luxury Stay, গড় 32000.00। CASE টা দুই জায়গায় লেখা হয়েছে, একবার দেখানোর জন্য, একবার দলের জন্য। PARTITION BY এ SELECT এর Alias (band) ব্যবহার করা যায় না, কারণ OVER হিসাব হয় একই ধাপে। Lesson 01 এর CTE দিয়ে CASE টা একবার লিখে পরে band দিয়ে দল বানানো আরও পরিষ্কার।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো ছোট কিন্তু জরুরি কথা। প্রথমত, PARTITION BY এ কয়েকটা Expression কমা দিয়ে দেওয়া যায়, যেমন{" "}
                <code className={CODE}>PARTITION BY customer_id, status</code>। তখন দুটোই মিললে তবেই এক দল: Rahim এর
                confirmed দুটো এক দলে, আর তাঁর pending টা আরেক দলে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়ত, NULL নিয়ে। Module 03 থেকে জানেন NULL = NULL সত্য হয় না। কিন্তু PARTITION BY, GROUP BY আর
                DISTINCT এর মতো, সব NULL কে এক দলে রাখে। Ratargul Swamp Boat Day এর guide_id NULL, তাই guide_id দিয়ে দল
                বানালে সে একটা আলাদা দলে, যেখানে সে একা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো Column দিয়ে দল, আর NULL এর নিজের দল"
              query={`SELECT customer_id, status, booking_id,
       count(*) OVER (PARTITION BY customer_id, status) AS same_cust_status
FROM bookings
WHERE customer_id IN (1, 6, 9)
ORDER BY customer_id, status, booking_id;

SELECT title, guide_id,
       count(*) OVER (PARTITION BY guide_id) AS tours_of_guide
FROM tours
ORDER BY guide_id NULLS LAST, tour_id;`}
              caption="প্রথম ফলাফলে সাতটা Row: Rahim এর confirmed দুটো Booking এর পাশে 2, তাঁর pending টার পাশে 1, আর Mitu (6) আর Priya (9) এর প্রতিটা Booking আলাদা Status এ, তাই সবার পাশে 1। দ্বিতীয় ফলাফলে নয়টা Row: চারজন Guide এর প্রত্যেকের দুটো করে ট্যুর, আর একদম শেষে Ratargul, guide_id ফাঁকা (NULL), পাশে 1। NULL এর দল এক জনের, কিন্তু সে হারায়নি।"
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
                  প্রতিটা Payment এর <code className={CODE}>payment_id</code>, <code className={CODE}>method</code>,{" "}
                  <code className={CODE}>amount_bdt</code>, সেই method এ মোট কতবার Payment এর চেষ্টা হয়েছে{" "}
                  <code className={CODE}>method_attempts</code> নামে, আর সেই method এর মোট টাকা{" "}
                  <code className={CODE}>method_total</code> নামে। Status যাই হোক, সব Payment গুনবেন। উনিশটা Row। Row এর
                  ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  একই দল দুইবার: <code className={CODE}>count(*) OVER (PARTITION BY method)</code> আর{" "}
                  <code className={CODE}>sum(amount_bdt) OVER (PARTITION BY method)</code>, বা একটা WINDOW Clause।
                </>
              }
              solution={`SELECT payment_id, method, amount_bdt,
       count(*) OVER (PARTITION BY method) AS method_attempts,
       sum(amount_bdt) OVER (PARTITION BY method) AS method_total
FROM payments;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "order-by-inside",
      subHeader: { index: "010", title: "ORDER BY Inside OVER" },
      title: <SectionTitle>ORDER BY যোগ করলেই উত্তর বদলে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Section 005 এ rank() এর OVER এ ORDER BY ছিল, আর সেটা দরকারি ছিল: ক্রম ছাড়া র‍্যাংক হয় না। কিন্তু sum, avg,
                count এর মতো Aggregate এর OVER এ ORDER BY দিলে একটা অবাক করা জিনিস ঘটে। নিচের বক্সে একই sum দুইবার: একবার
                শুধু PARTITION BY, আরেকবার সাথে ORDER BY booked_at।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই sum, একটা ORDER BY এর তফাত"
              query={`SELECT booking_id, customer_id, total_bdt,
       sum(total_bdt) OVER (PARTITION BY customer_id) AS whole_partition,
       sum(total_bdt) OVER (PARTITION BY customer_id
                            ORDER BY booked_at) AS with_order_by
FROM bookings
WHERE customer_id IN (1, 2)
ORDER BY customer_id, booked_at;`}
              caption="whole_partition এ Rahim এর তিনটা Row ই 80000.00, পুরো দলের যোগফল। with_order_by এ 25000.00, 44000.00, 80000.00: প্রথম Row এ শুধু প্রথম Booking, দ্বিতীয় Row এ প্রথম দুটোর যোগ, তৃতীয়তে তিনটার। মানে চলমান যোগফল, Running Total। Nusrat এর বেলায় 50000.00 থেকে 75000.00।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কারণটা Window এর একটা অংশ, যার নাম Frame। OVER এ ORDER BY না থাকলে প্রতিটা Row এর Frame তার পুরো Partition।
              ORDER BY থাকলে Frame হয়ে যায় Partition এর শুরু থেকে এই Row পর্যন্ত। এটা খুব কাজের জিনিস, আর পরের লেসন{" "}
              <Link href="/sql/topic/running-totals-frames" className={LINK}>
                Running Totals and Window Frames
              </Link>{" "}
              পুরোটাই এ নিয়ে, সমান মানের সময়ের একটা ফাঁদ সহ। এই লেসনের জন্য নিয়মটা ছোট: দলের মোট বা গড় চাইলে OVER এ শুধু
              PARTITION BY রাখুন, ORDER BY দেবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কখন ORDER BY লাগে, কখন লাগে না",
          content: (
            <ContentParagraph>
              row_number, rank, dense_rank এর মতো ক্রমের Function এ ORDER BY লাগে, না দিলে ক্রম অনিশ্চিত। count, sum,
              avg, min, max এ দলের পুরো হিসাব চাইলে ORDER BY দেবেন না। চলমান হিসাব চাইলে দেবেন, আর তখন জেনেশুনে দেবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "three-ways",
      subHeader: { index: "011", title: "Same Answer Three Ways" },
      title: <SectionTitle>Window, Join আর Correlated Subquery: একই উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                &ldquo;প্রতিটা Booking, আর তার পাশে সেই Customer এর মোট টাকা&rdquo;, এই প্রশ্নটা Module 07 এ আপনি অন্তত
                দুইভাবে লিখতে পারতেন। একটা হলো GROUP BY দিয়ে প্রতিটা Customer এর যোগফলের একটা Derived Table বানিয়ে Join।
                আরেকটা হলো SELECT এর ভেতরে একটা Correlated Subquery, যেটা প্রতিটা Booking এর জন্য তার Customer এর যোগফল খোঁজে।
                PARTITION BY তৃতীয় উপায়, আর তিনটাই হুবহু একই চব্বিশটা Row দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ তিনটা লেখা পাশাপাশি, প্রতিটার সাথে PostgreSQL এর আসল Plan। Plan গুলো পড়লে বোঝা যায় Database
                একই উত্তর তিন রকম পথে বের করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ThreeWaysLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজে মিলিয়ে দেখুন: পার্থক্য কয়টা"
              query={`SELECT count(*) AS differences
FROM (
  SELECT booking_id, sum(total_bdt) OVER (PARTITION BY customer_id)
  FROM bookings
  EXCEPT
  SELECT b.booking_id,
         (SELECT sum(b2.total_bdt) FROM bookings b2
          WHERE b2.customer_id = b.customer_id)
  FROM bookings b
) x;`}
              caption="উত্তর 0। Module 07 এর EXCEPT দিয়ে Window এর ফলাফল থেকে Correlated Subquery এর ফলাফল বিয়োগ করা হয়েছে, আর কিছুই বাকি থাকেনি। মানে চব্বিশটা Booking এর প্রত্যেকের যোগফল দুই পদ্ধতিতে একই। নিজে Join এর রূপটা দিয়েও EXCEPT লিখে দেখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা", "কখন ভালো", "কোথায় অসুবিধা"],
          rows: [
            [
              "PARTITION BY",
              "প্রতিটা Row এর পাশে দলের হিসাব, কয়েক রকম দল একসাথে, ছোট আর পরিষ্কার লেখা",
              "Window এর উপর WHERE দেওয়া যায় না, তার জন্য CTE লাগে",
            ],
            [
              "GROUP BY তারপর Join",
              "দলের হিসাবটা আলাদা করে আরও কাজে লাগবে, বা পুরনো Code এর সাথে মেলাতে হবে",
              "Table দুইবার পড়া, Join এর শর্ত ভুল হলে Row বাড়ে বা কমে",
            ],
            [
              "Correlated Subquery",
              "ছোট Table, বা একটা Row এর জন্য একটা জটিল প্রশ্ন",
              "বড় Table এ প্রতিটা Row এর জন্য বারবার চলতে পারে, EXPLAIN দেখে নিন",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "filtering-window",
      subHeader: { index: "012", title: "Filtering a Window Result" },
      title: <SectionTitle>প্রতিটা দলের এক নম্বরটা চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                র‍্যাংক পাওয়ার পর স্বাভাবিক পরের প্রশ্ন: শুধু প্রতিটা Destination এর সবচেয়ে দামি ট্যুরটা দেখান। মানে
                rank_in_dest = 1 যাদের। প্রথম চেষ্টায় প্রায় সবাই WHERE এ সরাসরি Window টা লিখে ফেলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE এ Window: Error"
              query={`SELECT title, destination_id, price_bdt
FROM tours
WHERE rank() OVER (PARTITION BY destination_id
                   ORDER BY price_bdt DESC) = 1;`}
              caption="ERROR: window functions are not allowed in WHERE। Logical Order মনে করুন: WHERE চলে আগে, Window চলে পরে, SELECT এর ধাপে। WHERE এর সময় র‍্যাংক এখনো হিসাবই হয়নি, তাই তার সাথে তুলনা করার কিছু নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধান Lesson 01 এ দেখা সেই কৌশল: Window টা একটা CTE এর ভেতরে হিসাব করুন, তারপর বাইরের Query তে WHERE। বাইরের
              Query এর কাছে র‍্যাংক তখন একটা সাধারণ Column, যেটা আগেই তৈরি হয়ে গেছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CTE তে র‍্যাংক, বাইরে WHERE"
              query={`WITH ranked AS (
  SELECT title, destination_id, price_bdt,
         rank() OVER (PARTITION BY destination_id
                      ORDER BY price_bdt DESC) AS r
  FROM tours
)
SELECT title, destination_id, price_bdt
FROM ranked
WHERE r = 1
ORDER BY destination_id;`}
              caption="ছয়টা Row, প্রতিটা Destination এর সবচেয়ে দামি ট্যুর: Luxury Stay, Family Package, Sundarbans, Sajek, Bandarban, Sylhet Tea Garden। এখানে কোনো Destination এ দুটো ট্যুরের দাম সমান নেই। থাকলে rank() দুজনকেই 1 দিত আর দুটোই আসত; একটাই চাইলে row_number() আর একটা Tie-breaker। এই &ldquo;প্রতিটা দলের সেরা N টা&rdquo; প্রশ্নের পুরো আলোচনা Lesson 06 এ।"
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
                  প্রতিটা Customer এর সবচেয়ে বড় Booking: <code className={CODE}>customer_id</code>,{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>total_bdt</code>। প্রতিটা Customer এর
                  ঠিক একটা Row; দুটো Booking এর টাকা সমান হলে ছোট booking_id টা নেবেন। customer_id অনুযায়ী সাজিয়ে
                  দেখান। চৌদ্দটা Row আসবে।
                </>
              }
              hint={
                <>
                  CTE তে{" "}
                  <code className={CODE}>
                    row_number() OVER (PARTITION BY customer_id ORDER BY total_bdt DESC, booking_id)
                  </code>
                  , বাইরে <code className={CODE}>WHERE rn = 1</code>। Tanvir (customer 3) এর দুটো Booking ই 12500, এখানে
                  booking_id ঠিক করে দেয় কোনটা।
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
WHERE rn = 1
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ PARTITION BY</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL Window Function পেয়েছে 8.0 থেকে, আর PARTITION BY এর লেখা হুবহু একই। এই লেসনের মূল Window গুলো,
                মানে দলের গড়, দলের ভেতরে র‍্যাংক, দলের মোটের ভাগ আর WINDOW Clause, MySQL 8.4 এ কোনো বদল ছাড়াই একই উত্তর
                দেয়, আমরা চালিয়ে দেখেছি। বদলাতে হয় শুধু PostgreSQL এর নিজস্ব কিছু Function আর Syntax:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  MySQL এ date_trunc নেই। মাস দিয়ে দল বানাতে <code className={CODE}>DATE_FORMAT(booked_at, &apos;%Y-%m&apos;)</code>{" "}
                  দিয়ে PARTITION BY লিখুন। ফলাফল একই, দলের নামটা শুধু লেখা হিসেবে আসে।
                </ListItem>
                <ListItem>
                  WHERE এ Window লিখলে MySQL এর Error আলাদা শোনায়: ERROR 3593 (HY000): You cannot use the window function
                  &apos;rank&apos; in this context। সমাধান একই, CTE বা Derived Table।
                </ListItem>
                <ListItem>
                  WINDOW Clause দিয়ে নাম দেওয়া দল MySQL এও চলে।
                </ListItem>
                <ListItem>
                  MySQL ORDER BY তে NULL কে আগে রাখে, তাই guide_id দিয়ে সাজালে Ratargul তালিকার শুরুতে আসে, শেষে না। দলের
                  হিসাব (tours_of_guide = 1) একই। MySQL এ NULLS LAST লেখাও যায় না, ERROR 1064 আসে; NULL শেষে পাঠাতে{" "}
                  <code className={CODE}>ORDER BY guide_id IS NULL, guide_id</code> লিখুন।
                </ListItem>
                <ListItem>
                  Project Example এর FILTER (WHERE ...) MySQL এ নেই, সেটাও ERROR 1064। তার বদলে{" "}
                  <code className={CODE}>{"SUM(CASE WHEN status = 'confirmed' THEN total_bdt ELSE 0 END)"}</code>, Module 05
                  এর সেই পুরনো কৌশল।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-partition.sql",
          code: `-- MySQL 8.4.11 এ চালানো, island-tours.mysql.sql Load করার পরে
SELECT title, destination_id, price_bdt,
       ROUND(AVG(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg,
       RANK() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC) AS r
FROM tours
ORDER BY destination_id, r;
-- 9 rows, PostgreSQL এর মতোই: 22250.00, 12000.00, ... 5650.00

-- date_trunc এর বদলে DATE_FORMAT
SELECT booking_id, DATE_FORMAT(booked_at, '%Y-%m') AS month,
       COUNT(*) OVER (PARTITION BY DATE_FORMAT(booked_at, '%Y-%m')) AS in_month
FROM bookings
WHERE booking_id IN (1, 2, 8, 14);
-- in_month: 2, 2, 1, 1  (WHERE এর পরে October এ শুধু booking 14)

-- WINDOW Clause
SELECT booking_id, customer_id,
       SUM(total_bdt) OVER w AS cust_total,
       COUNT(*) OVER w AS cust_n
FROM bookings
WHERE customer_id IN (1, 2)
WINDOW w AS (PARTITION BY customer_id)
ORDER BY booking_id;

-- WHERE এ Window
SELECT title FROM tours
WHERE RANK() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC) = 1;
-- ERROR 3593 (HY000): You cannot use the window function 'rank' in this context.'`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একই নাম, আলাদা জিনিস",
          content: (
            <ContentParagraph>
              MySQL আর PostgreSQL দুটোতেই CREATE TABLE এর ভেতরে আরেকটা PARTITION BY আছে, যেটা একটা বিশাল Table কে Disk এ
              টুকরো টুকরো করে রাখে (যেমন মাস অনুযায়ী)। ওটা Table Partitioning, Module 19 এর{" "}
              <Link href="/sql/topic/partitioning" className={LINK}>
                Partitioning
              </Link>{" "}
              লেসনের বিষয়। এই লেসনের PARTITION BY শুধু OVER এর ভেতরে থাকে, Query চলার সময় হিসাবের জন্য দল বানায়, আর Data
              কোথায় রাখা আছে তাতে কোনো হাত দেয় না। Docs বা Stack Overflow এ খোঁজার সময় এই দুটো গুলিয়ে যায়, তাই খোঁজার
              শব্দে &ldquo;window function&rdquo; যোগ করুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>শীতের দাম ঠিক করার রিপোর্ট</SectionTitle>,
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
                ফারুক সাহেবের আসল রিপোর্টটা এখন লেখা যায়। প্রতিটা ট্যুরের জন্য তিনি চান: দাম, নিজের Destination এর গড়
                দাম, confirmed Booking থেকে আসা আয়, সেই আয় নিজের Destination এর মোট আয়ের কত ভাগ, আর Destination এর ভেতরে
                আয়ের দিক থেকে কততম। এই রিপোর্ট দেখে দলটা ঠিক করে কোন ট্যুরের দাম বাড়ানো যায়, আর কোনটার প্রচার দরকার।
              </ContentParagraph>
              <ContentParagraph>
                Query টা দুই ধাপে লেখা। প্রথম ধাপ, Module 07 এর একটা CTE: প্রতিটা ট্যুরের আয় বের করা, LEFT JOIN দিয়ে যাতে
                Booking নেই এমন ট্যুরও থাকে। দ্বিতীয় ধাপে সেই নয়টা Row এর উপর তিনটা Window, তিনটাই Destination অনুযায়ী দল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Pricing Review: প্রতিটা ট্যুর তার নিজের Destination এর পাশে"
              query={`WITH per_tour AS (
  SELECT t.tour_id, t.title, t.destination_id, t.price_bdt,
         coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS revenue
  FROM tours t
  LEFT JOIN departures d ON d.tour_id = t.tour_id
  LEFT JOIN bookings b ON b.departure_id = d.departure_id
  GROUP BY t.tour_id
)
SELECT title, destination_id, price_bdt,
       round(avg(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg_price,
       revenue,
       round(100.0 * revenue
             / nullif(sum(revenue) OVER (PARTITION BY destination_id), 0), 1) AS share_of_dest,
       rank() OVER (PARTITION BY destination_id ORDER BY revenue DESC) AS revenue_rank
FROM per_tour
ORDER BY destination_id, revenue_rank, tour_id;`}
              caption="নয়টা Row। Saint Martin এ সব আয় (125000.00) Island Escape এর, Luxury Stay এর আয় 0, কারণ তার একমাত্র Departure (2027-02-14) এ এখনো কোনো Booking নেই। Cox's Bazar এ একই ছবি: Beach Weekend 93500.00, Family Package 0, তার তো কোনো Departure ই নেই। LEFT JOIN না থাকলে এই দুটো ট্যুর রিপোর্ট থেকে চুপচাপ হারিয়ে যেত। Sylhet এ দুটো ট্যুরই আয় এনেছে, Tea Garden 59.8 আর Ratargul 40.2 শতাংশ। nullif টা Module 04 এর সেই পাহারা: কোনো Destination এর মোট আয় 0 হলে শূন্য দিয়ে ভাগের Error এর বদলে NULL আসে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              রিপোর্টটা ফারুক সাহেবকে দুটো জিনিস স্পষ্ট দেখায়। দুটো দামি ট্যুর, Luxury Stay আর Family Package, নিজের
              Destination এর আয়ে কোনো অবদান রাখেনি। কারণ দুটো আলাদা: Luxury Stay এখন বন্ধ (is_active false), আর Family
              Package এর কোনো Departure ই ঠিক করা হয়নি। তাই এখানে দাম কমানোর আগে Departure বসানোর কথা ভাবতে হবে। আর Sylhet এ সস্তা Ratargul
              ট্যুরও আয়ের চল্লিশ শতাংশ আনছে, তাই সেটা বন্ধ করার কথা ভাবার আগে দুবার ভাবতে হবে। একটা Query, প্রতিটা ট্যুর তার
              নিজের দলের পাশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Database একটা PARTITION BY কীভাবে হিসাব করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Section 002 এর Query, avg(price_bdt) OVER (PARTITION BY destination_id), চলার সময় ভেতরে ভেতরে যা ঘটে, ধাপে
              ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM আর WHERE",
              description:
                "tours থেকে Row গুলো পড়া হয়, আর WHERE থাকলে শর্ত না মেলা Row বাদ যায়। এখানে WHERE নেই, তাই নয়টা Row। এর পরে আর কোনো Row যোগ বা বাদ হবে না।",
            },
            {
              title: "GROUP BY আর HAVING (থাকলে)",
              description:
                "Query তে GROUP BY থাকলে আগে দলগুলো গুটিয়ে যায়, আর Window চলে সেই গুটানো Row গুলোর উপর। Project Example এ ঠিক এটাই হয়েছে, CTE এর ভেতরে।",
            },
            {
              title: "Partition অনুযায়ী সাজানো",
              description:
                "Database Row গুলো destination_id দিয়ে সাজায়, যাতে একই Destination এর Row পাশাপাশি আসে। Plan এ এটা Sort, Sort Key: destination_id।",
            },
            {
              title: "প্রতিটা Partition এর হিসাব",
              description:
                "এক এক করে প্রতিটা Partition এর Row গুলোর avg বের হয়: Saint Martin এর 22250.00, Cox's Bazar এর 12000.00, এভাবে ছয়টা। Plan এ এটা WindowAgg।",
            },
            {
              title: "প্রতিটা Row এ উত্তর বসানো",
              description:
                "Partition এর প্রতিটা Row এর পাশে সেই Partition এর উত্তর বসে। নয়টা Row ঢুকেছিল, নয়টাই থাকে, শুধু একটা নতুন Column নিয়ে।",
            },
            {
              title: "ORDER BY আর LIMIT",
              description:
                "শেষে Query এর নিজের ORDER BY ফলাফল সাজায়, আর LIMIT থাকলে কয়টা Row দেখানো হবে ঠিক করে। Window এর হিসাব এর আগেই শেষ, তাই LIMIT তাতে কোনো প্রভাব ফেলে না।",
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
          headers: ["ভুল", "কী দেখবেন", "সমাধান"],
          rows: [
            [
              "দলের হিসাবের জন্য GROUP BY লিখে Row হারানো",
              "নয়টা ট্যুরের বদলে ছয়টা Row, বা title এর জন্য GROUP BY Error",
              "Row রাখতে চাইলে OVER (PARTITION BY ...)",
            ],
            [
              "দলের মোটের OVER এ ORDER BY দেওয়া",
              "দলের মোটের বদলে চলমান যোগফল, প্রথম Row এ ছোট সংখ্যা",
              "পুরো দলের হিসাবে শুধু PARTITION BY",
            ],
            [
              "WHERE দিয়ে Row কমিয়ে পুরো Table এর ভাগ আশা করা",
              "শতাংশ 100 বা অস্বাভাবিক বড়",
              "Window আগে CTE তে পুরো Table এর উপর, WHERE বাইরে",
            ],
            [
              "WHERE এ Window Function",
              "window functions are not allowed in WHERE",
              "CTE বা Derived Table, তারপর বাইরের WHERE",
            ],
            [
              "ভাগে 100 লেখা, 100.0 না",
              "33, 66: যোগ করলে 99",
              "100.0 * seats / sum(...) OVER (...)",
            ],
            [
              "ROW_NUMBER এ Tie-breaker না দেওয়া",
              "প্রতিবার চালালে সমান মানের Row এর নম্বর অদলবদল",
              "ORDER BY এর শেষে একটা অনন্য Column, যেমন booking_id",
            ],
            [
              "PARTITION BY তে SELECT এর Alias লেখা",
              "column \"band\" does not exist",
              "Expression টা আবার লিখুন, বা CTE তে আগে Column বানান",
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
                    PostgreSQL Docs: Tutorial, Window Functions
                  </a>
                  : PARTITION BY এর সবচেয়ে সহজ ভূমিকা, বিভাগ অনুযায়ী বেতনের গড়ের সেই বিখ্যাত উদাহরণ সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Function Calls
                  </a>
                  : OVER এর পুরো Syntax, PARTITION BY, ORDER BY আর Frame কোথায় কোথায় বসে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-window.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Window Functions
                  </a>
                  : row_number, rank থেকে শুরু করে সব Window Function এর তালিকা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Window Function Concepts and Syntax
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা, OVER আর PARTITION BY এর ব্যাখ্যা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Window_function_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Window function (SQL)
                  </a>
                  : সংক্ষিপ্ত সংজ্ঞা আর ইতিহাস, কোন SQL Standard এ Window এল।
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
                  PARTITION BY OVER এর ভেতরে বসে, আর Window কে দলে দলে ভাগ করে। প্রতিটা দলের নাম Partition, আর প্রতিটা Row
                  এর হিসাব হয় তার নিজের Partition এর Row দিয়ে।
                </ListItem>
                <ListItem>
                  GROUP BY দলকে একটা Row এ গুটিয়ে ফেলে, PARTITION BY সব Row রেখে দেয়। Row এর পাশে দলের হিসাব চাইলে PARTITION
                  BY।
                </ListItem>
                <ListItem>
                  rank, row_number এর OVER এ PARTITION BY দিলে প্রতিটা দলে গোনা নতুন করে 1 থেকে শুরু হয়। ROW_NUMBER এ সবসময়
                  একটা অনন্য Tie-breaker।
                </ListItem>
                <ListItem>
                  দলের মোটের কত ভাগ: 100.0 * নিজের মান / sum(...) OVER (PARTITION BY ...)। 100 না, 100.0।
                </ListItem>
                <ListItem>
                  একই Query তে যত খুশি OVER, প্রতিটার নিজের দল। একই দল কয়েকবার লাগলে WINDOW Clause দিয়ে নাম দিন।
                </ListItem>
                <ListItem>
                  Window শুধু WHERE এর পরে টিকে থাকা Row দেখে, কিন্তু LIMIT এর আগে চলে। পুরো Table এর হিসাব চাইলে Window
                  আগে CTE তে।
                </ListItem>
                <ListItem>
                  PARTITION BY এ যেকোনো Expression: date_trunc এর মাস, CASE এর ভাগ, কয়েকটা Column একসাথে। সব NULL এক দলে।
                </ListItem>
                <ListItem>
                  sum বা avg এর OVER এ ORDER BY দিলে উত্তর হয় চলমান যোগফল। দলের পুরো হিসাবে ORDER BY দেবেন না।
                </ListItem>
                <ListItem>
                  WHERE এ Window চলে না। Window টা CTE তে, বাইরে WHERE। একই উত্তর Join বা Correlated Subquery দিয়েও লেখা যায়,
                  Window সাধারণত সবচেয়ে ছোট আর পরিষ্কার।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Section 010 এ একটা জিনিস অসম্পূর্ণ রয়ে গেছে: sum এর OVER এ ORDER BY দিতেই উত্তর চলমান যোগফল হয়ে গেল।
                কেন হলো, কতটুকু পেছনে বা সামনে দেখা হবে সেটা কীভাবে ঠিক করা যায়, আর সমান মানের দুটো Row থাকলে কোন অবাক
                করা ফল আসে, সেটাই পরের লেসন{" "}
                <Link href="/sql/topic/running-totals-frames" className={LINK}>
                  Running Totals and Window Frames
                </Link>{" "}
                এর বিষয়।
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
      ["PARTITION BY", "OVER এর ভেতরে, Window কে দলে ভাগ করে", "PARTITION BY destination_id"],
      ["Partition", "একই মানের Row গুলোর দল", "Saint Martin এর দুটো ট্যুর"],
      ["দলের গড় পাশে", "avg(...) OVER (PARTITION BY ...)", "dest_avg: 22250.00, 12000.00, 5650.00"],
      ["GROUP BY বনাম PARTITION BY", "সারাংশ বনাম সব Row আর পাশে সারাংশ", "৬টা Row বনাম ৯টা Row"],
      ["দলের ভেতরে র‍্যাংক", "PARTITION BY তারপর ORDER BY", "Island Escape নিজের Destination এ ২ নম্বর"],
      ["Customer এর কততম Booking", "row_number() সাথে Tie-breaker", "Rahim এর 1, 8, 17 মানে 1, 2, 3"],
      ["দলের মোটের ভাগ", "100.0 * seats / sum(seats) OVER (...)", "Departure 10: 37.5 আর 62.5"],
      ["কয়েকটা Window", "প্রতিটা OVER এর নিজের দল", "Booking 1: 24, 3, 17"],
      ["আগে WHERE", "Window শুধু WHERE এর পরের Row দেখে", "WHERE এর পরে all_bookings 6"],
      ["Expression দিয়ে দল", "date_trunc, CASE, কয়েকটা Column", "October এ 9টা Booking, 246700.00"],
      ["NULL এর দল", "সব NULL এক Partition এ", "Ratargul একা, tours_of_guide 1"],
      ["ORDER BY ভেতরে", "Aggregate হয়ে যায় চলমান হিসাব", "Rahim: 25000, 44000, 80000"],
      ["Window এর উপর শর্ত", "CTE তে Window, বাইরে WHERE", "প্রতিটা Destination এর সবচেয়ে দামি, ৬টা"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT title, avg(price_bdt) OVER (PARTITION BY destination_id) FROM tours; এই Query কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "৬টা, প্রতিটা Destination এর একটা",
            isCorrect: false,
            explanation: "এটা GROUP BY এর আচরণ। PARTITION BY কোনো Row গুটায় না।",
          },
          {
            key: "B",
            text: "৯টা, প্রতিটা ট্যুরের একটা",
            isCorrect: true,
            explanation: "ঠিক। tours এ নয়টা Row, আর Window Function Row এর সংখ্যা বদলায় না। প্রতিটা Row এর পাশে তার Destination এর গড় বসে।",
          },
          {
            key: "C",
            text: "৭টা, কারণ destinations Table এ সাতটা জায়গা",
            isCorrect: false,
            explanation: "Query তে destinations Table নেই। দল বানানো হয় শুধু tours এর Row থেকে, আর Kuakata এর কোনো ট্যুর নেই।",
          },
          {
            key: "D",
            text: "Error, কারণ title GROUP BY তে নেই",
            isCorrect: false,
            explanation: "GROUP BY নেই বলেই কোনো Error নেই। PARTITION BY এর বেলায় SELECT এ যেকোনো Column রাখা যায়।",
          },
        ],
      },
      {
        id: 2,
        text: "rank() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC) এ Saint Martin Island Escape (12500) এর র‍্যাংক কত?",
        options: [
          {
            key: "A",
            text: "1",
            isCorrect: false,
            explanation: "Saint Martin এ আরেকটা ট্যুর আছে, Luxury Stay, 32000 টাকা, সেটা বেশি দামি।",
          },
          {
            key: "B",
            text: "2",
            isCorrect: true,
            explanation: "ঠিক। নিজের Destination এ দুটো ট্যুর, Luxury Stay 1, Island Escape 2।",
          },
          {
            key: "C",
            text: "5",
            isCorrect: false,
            explanation: "পুরো তালিকায় সে পঞ্চম, কিন্তু PARTITION BY থাকায় গোনা হয় শুধু Saint Martin এর ভেতরে।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "rank() কখনো NULL দেয় না। প্রতিটা Row তার দলে একটা র‍্যাংক পায়।",
          },
        ],
      },
      {
        id: 3,
        text: "WHERE customer_id IN (1, 2, 5) দেওয়ার পরে count(*) OVER () কত দেবে?",
        options: [
          {
            key: "A",
            text: "24, সব Booking",
            isCorrect: false,
            explanation: "Window চলে WHERE এর পরে। WHERE যে Row বাদ দিয়েছে, Window সেগুলো দেখে না।",
          },
          {
            key: "B",
            text: "3, কারণ তিনজন Customer",
            isCorrect: false,
            explanation: "count(*) Row গোনে, Customer না। তিনজনের Booking মোট ছয়টা।",
          },
          {
            key: "C",
            text: "6, WHERE এর পরে টিকে থাকা Row",
            isCorrect: true,
            explanation: "ঠিক। Rahim এর তিনটা, Nusrat এর দুটো, Sabbir এর একটা। Window এর কাছে এটাই পুরো ফলাফল।",
          },
          {
            key: "D",
            text: "প্রতিটা Customer এর জন্য আলাদা সংখ্যা",
            isCorrect: false,
            explanation: "OVER () তে কোনো PARTITION BY নেই, তাই সবার জন্য একই সংখ্যা। Customer অনুযায়ী চাইলে PARTITION BY customer_id।",
          },
        ],
      },
      {
        id: 4,
        text: "ORDER BY booking_id LIMIT 6 দিলে count(*) OVER () কত দেখাবে?",
        options: [
          {
            key: "A",
            text: "6",
            isCorrect: false,
            explanation: "LIMIT চলে Window এর পরে। Window ততক্ষণে সব চব্বিশটা Row দেখে ফেলেছে।",
          },
          {
            key: "B",
            text: "24",
            isCorrect: true,
            explanation: "ঠিক। WHERE আর LIMIT এর এই উল্টো আচরণটাই এই লেসনের একটা মূল কথা: WHERE আগে, Window মাঝে, LIMIT পরে।",
          },
          {
            key: "C",
            text: "1",
            isCorrect: false,
            explanation: "count(*) OVER () কখনো একা একটা Row গোনে না, পুরো Window গোনে।",
          },
          {
            key: "D",
            text: "Error, কারণ LIMIT আর Window একসাথে চলে না",
            isCorrect: false,
            explanation: "একসাথে একদম স্বাভাবিকভাবে চলে, Section 007 এর বক্সে চালিয়ে দেখেছেন।",
          },
        ],
      },
      {
        id: 5,
        text: "100 * seats / sum(seats) OVER (PARTITION BY departure_id) কেন Departure 1 এর জন্য 33 আর 66 দেয়, যোগে 99?",
        options: [
          {
            key: "A",
            text: "PARTITION BY ভুল দল বানিয়েছে",
            isCorrect: false,
            explanation: "দল ঠিক আছে, Departure 1 এর ছয় সিট। সমস্যা ভাগের ধরনে।",
          },
          {
            key: "B",
            text: "দুটো পূর্ণসংখ্যার ভাগে PostgreSQL দশমিক ফেলে দেয়",
            isCorrect: true,
            explanation: "ঠিক। seats আর sum(seats) দুটোই পূর্ণসংখ্যা। 100.0 লিখলে হিসাব দশমিকে হয়, আসে 33.3 আর 66.7।",
          },
          {
            key: "C",
            text: "বাতিল Booking গোনা হয়েছে",
            isCorrect: false,
            explanation: "Departure 1 এ কোনো বাতিল Booking নেই, আর WHERE এ সেগুলো এমনিতেই বাদ।",
          },
          {
            key: "D",
            text: "round() না দেওয়ায়",
            isCorrect: false,
            explanation: "round() দশমিক কাটে, কিন্তু এখানে দশমিক আগেই হারিয়ে গেছে পূর্ণসংখ্যার ভাগে। round দিয়েও 33 ই থাকত।",
          },
        ],
      },
      {
        id: 6,
        text: "sum(total_bdt) OVER (PARTITION BY customer_id ORDER BY booked_at) Rahim এর প্রথম Booking এর পাশে কী দেবে?",
        options: [
          {
            key: "A",
            text: "80000.00, তাঁর তিনটা Booking এর মোট",
            isCorrect: false,
            explanation: "ORDER BY না থাকলে এটাই আসত। ORDER BY থাকায় Frame হয় শুরু থেকে এই Row পর্যন্ত।",
          },
          {
            key: "B",
            text: "25000.00, শুধু প্রথম Booking পর্যন্ত",
            isCorrect: true,
            explanation: "ঠিক। চলমান যোগফল: 25000, তারপর 44000, তারপর 80000। এই Frame এর পুরো গল্প পরের লেসনে।",
          },
          {
            key: "C",
            text: "26666.67, তাঁর গড়",
            isCorrect: false,
            explanation: "এটা sum, avg না।",
          },
          {
            key: "D",
            text: "Error, sum এর OVER এ ORDER BY চলে না",
            isCorrect: false,
            explanation: "চলে, আর সেটাই চলমান হিসাবের সাধারণ উপায়।",
          },
        ],
      },
      {
        id: 7,
        text: "guide_id দিয়ে PARTITION BY করলে Ratargul Swamp Boat Day (guide_id NULL) এর কী হয়?",
        options: [
          {
            key: "A",
            text: "বাদ পড়ে যায়, কারণ NULL = NULL সত্য না",
            isCorrect: false,
            explanation: "PARTITION BY কোনো Row বাদ দেয় না। আর দল বানানোর সময় সব NULL কে এক ধরা হয়।",
          },
          {
            key: "B",
            text: "নিজের একটা দলে থাকে, সব NULL এক দলে",
            isCorrect: true,
            explanation: "ঠিক। GROUP BY আর DISTINCT এর মতোই। Ratargul একা NULL দলে, tours_of_guide 1।",
          },
          {
            key: "C",
            text: "সব দলে একসাথে গোনা হয়",
            isCorrect: false,
            explanation: "একটা Row সবসময় ঠিক একটা Partition এ থাকে।",
          },
          {
            key: "D",
            text: "Error আসে",
            isCorrect: false,
            explanation: "NULL দিয়ে দল বানাতে কোনো Error নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "প্রতিটা Destination এর সবচেয়ে দামি ট্যুর চাই। কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "WHERE rank() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC) = 1",
            isCorrect: false,
            explanation: "window functions are not allowed in WHERE। WHERE চলার সময় র‍্যাংক তৈরিই হয়নি।",
          },
          {
            key: "B",
            text: "GROUP BY destination_id, তারপর max(price_bdt)",
            isCorrect: false,
            explanation: "সবচেয়ে বেশি দামটা পাবেন, কিন্তু কোন ট্যুরের সেটা (title) পাবেন না।",
          },
          {
            key: "C",
            text: "CTE তে rank() OVER (PARTITION BY ...) AS r, বাইরে WHERE r = 1",
            isCorrect: true,
            explanation: "ঠিক। বাইরের Query এর কাছে r একটা সাধারণ Column। ছয়টা Row আসে, প্রতিটা Destination এর একটা।",
          },
          {
            key: "D",
            text: "HAVING rank() OVER (...) = 1",
            isCorrect: false,
            explanation: "HAVING ও Window এর আগে চলে, তাই সেখানেও Window লেখা যায় না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর দলভিত্তিক রিপোর্ট",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>সবার গড় বনাম নিজের দলের গড়:</strong> প্রতিটা ট্যুরের দামের পাশে overall_avg আর dest_avg দেখান, আর আরেকটা
        Column এ লিখুন ট্যুরটা নিজের Destination এর গড়ের উপরে না নিচে (CASE দিয়ে)। কোন ট্যুর সবার গড়ের হিসাবে একরকম আর
        নিজের দলের হিসাবে আরেকরকম, সেগুলো আলাদা করে লিখুন।
      </span>,
      <span key="2">
        <strong>Customer টাইমলাইন:</strong> প্রতিটা Booking এর পাশে সেটা Customer এর কততম Booking, তাঁর মোট Booking কয়টা,
        আর তাঁর মোট টাকার কত শতাংশ এই একটা Booking। তারপর CTE দিয়ে শুধু প্রতিটা Customer এর প্রথম Booking দেখান।
      </span>,
      <span key="3">
        <strong>WHERE এর ফাঁদ:</strong> Rahim Uddin এর Booking গুলো পুরো Island Tours এর মোট টাকার কত শতাংশ, এটা প্রথমে
        ভুলভাবে (WHERE customer_id = 1 আর OVER ()) লিখে দেখান যে 100 আসে, তারপর CTE দিয়ে ঠিক করুন। দুটো সংখ্যা আর তফাতের
        কারণ লিখুন।
      </span>,
      <span key="4">
        <strong>তিনভাবে একই উত্তর:</strong> প্রতিটা Departure এর পাশে তার ট্যুরের সবচেয়ে কম seats_left, তিনভাবে লিখুন:
        PARTITION BY, GROUP BY আর Join, আর Correlated Subquery। EXCEPT দিয়ে দেখান তিনটার ফলাফল এক, আর তিনটার EXPLAIN এর
        একটা করে লাইন লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> স্কুলের শাখা আর রিপোর্ট কার্ডের উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান
        PARTITION BY আর GROUP BY এর তফাত, আর কেন WHERE দিলে Window এর উত্তর বদলায় কিন্তু LIMIT দিলে বদলায় না।
      </span>,
    ],
    deliverables: [
      <span key="d1">Query, ফলাফল আর দুই রকম গড়ে আলাদা আচরণ করা ট্যুরের তালিকা</span>,
      <span key="d2">টাইমলাইন Query আর প্রথম Booking এর CTE</span>,
      <span key="d3">ভুল আর ঠিক Query, দুটো শতাংশ আর এক প্যারায় কারণ</span>,
      <span key="d4">তিনটা Query, EXCEPT এর ফলাফল 0, আর Plan এর তিনটা লাইন</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ PARTITION BY",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "দলের গড়",
        description:
          "প্রথম ফাইলে PARTITION BY এর নয়টা Row আর GROUP BY এর ছয়টা Row পাশাপাশি চালান। দুটোতে Saint Martin এর গড় 22250.00 খুঁজে দেখুন।",
      },
      {
        title: "র‍্যাংক আর ক্রমিক নম্বর",
        description:
          "দ্বিতীয় ফাইলে প্রতিটা Destination এর ভেতরে দামের র‍্যাংক, প্রতিটা Customer এর কততম Booking, আর CTE দিয়ে প্রতিটা Customer এর প্রথম Booking।",
      },
      {
        title: "ভাগ আর পূর্ণসংখ্যার ফাঁদ",
        description:
          "তৃতীয় ফাইলে pct_int আর pct পাশাপাশি। Departure 1 আর 10 এ pct_int এর যোগফল 99 হয় কি না দেখুন।",
      },
      {
        title: "LIMIT বনাম WHERE",
        description:
          "চতুর্থ ফাইলের দুটো Query এর all_bookings মিলিয়ে দেখুন: LIMIT এর পরে 24, WHERE এর পরে 6।",
      },
      {
        title: "Expression দিয়ে দল",
        description:
          "পঞ্চম ফাইলে মাস, দামের ভাগ আর guide_id এর NULL দল। নিজের psql এর TimeZone Asia/Dhaka না হলে মাসের সংখ্যা আলাদা হতে পারে; SET TimeZone = 'Asia/Dhaka'; দিয়ে মিলিয়ে নিন।",
      },
      {
        title: "তিনভাবে মেলানো আর CTE",
        description:
          "ষষ্ঠ ফাইলে EXCEPT এর ফলাফল 0, আর CTE দিয়ে প্রতিটা Destination এর সবচেয়ে দামি ট্যুর, ছয়টা Row।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-group-average.sql",
        code: `SELECT title, destination_id, price_bdt,
       round(avg(price_bdt) OVER (PARTITION BY destination_id), 2) AS dest_avg
FROM tours
ORDER BY destination_id, tour_id;
-- (9 rows)

SELECT destination_id, round(avg(price_bdt), 2) AS dest_avg
FROM tours
GROUP BY destination_id
ORDER BY destination_id;
-- (6 rows)`,
      },
      {
        language: "sql",
        filename: "02-rank-and-number.sql",
        code: `SELECT title, destination_id, price_bdt,
       rank() OVER (PARTITION BY destination_id
                    ORDER BY price_bdt DESC) AS price_rank
FROM tours
ORDER BY destination_id, price_rank;
-- (9 rows)

SELECT customer_id, booking_id, booked_at,
       row_number() OVER (PARTITION BY customer_id
                          ORDER BY booked_at, booking_id) AS nth
FROM bookings
ORDER BY customer_id, nth;
-- (24 rows)

WITH numbered AS (
  SELECT customer_id, booking_id, booked_at,
         row_number() OVER (PARTITION BY customer_id
                            ORDER BY booked_at, booking_id) AS nth
  FROM bookings
)
SELECT customer_id, booking_id, booked_at
FROM numbered
WHERE nth = 1
ORDER BY customer_id;
-- (14 rows)`,
      },
      {
        language: "sql",
        filename: "03-share.sql",
        code: `SELECT booking_id, departure_id, seats,
       100 * seats / sum(seats) OVER (PARTITION BY departure_id) AS pct_int,
       round(100.0 * seats / sum(seats) OVER (PARTITION BY departure_id), 1) AS pct
FROM bookings
WHERE status <> 'cancelled'
ORDER BY departure_id, booking_id;
-- (21 rows), departure 1: pct_int 33 আর 66, pct 33.3 আর 66.7`,
      },
      {
        language: "sql",
        filename: "04-limit-vs-where.sql",
        code: `SELECT booking_id, customer_id,
       count(*) OVER () AS all_bookings,
       count(*) OVER (PARTITION BY customer_id) AS cust_bookings
FROM bookings
ORDER BY booking_id
LIMIT 6;
-- (6 rows), all_bookings প্রতিটায় 24

SELECT booking_id, customer_id,
       count(*) OVER () AS all_bookings,
       count(*) OVER (PARTITION BY customer_id) AS cust_bookings
FROM bookings
WHERE customer_id IN (1, 2, 5)
ORDER BY booking_id;
-- (6 rows), all_bookings প্রতিটায় 6`,
      },
      {
        language: "sql",
        filename: "05-expressions.sql",
        code: `SET TimeZone = 'Asia/Dhaka';

SELECT booking_id, to_char(booked_at, 'YYYY-MM') AS month,
       count(*) OVER (PARTITION BY date_trunc('month', booked_at)) AS month_bookings
FROM bookings
ORDER BY booked_at;
-- (24 rows), 2026-10 এর প্রতিটায় 9

SELECT title, price_bdt,
       count(*) OVER (PARTITION BY CASE WHEN price_bdt < 10000 THEN 'budget'
                                        WHEN price_bdt < 20000 THEN 'standard'
                                        ELSE 'premium' END) AS tours_in_band
FROM tours
ORDER BY price_bdt;
-- (9 rows), budget 4, standard 4, premium 1

SELECT title, guide_id,
       count(*) OVER (PARTITION BY guide_id) AS tours_of_guide
FROM tours
ORDER BY guide_id NULLS LAST, tour_id;
-- (9 rows), শেষে Ratargul, guide_id ফাঁকা, 1`,
      },
      {
        language: "sql",
        filename: "06-three-ways-and-cte.sql",
        code: `SELECT count(*) AS differences
FROM (
  SELECT booking_id, sum(total_bdt) OVER (PARTITION BY customer_id)
  FROM bookings
  EXCEPT
  SELECT b.booking_id,
         (SELECT sum(b2.total_bdt) FROM bookings b2
          WHERE b2.customer_id = b.customer_id)
  FROM bookings b
) x;
-- differences: 0

WITH ranked AS (
  SELECT title, destination_id, price_bdt,
         rank() OVER (PARTITION BY destination_id ORDER BY price_bdt DESC) AS r
  FROM tours
)
SELECT title, destination_id, price_bdt
FROM ranked
WHERE r = 1
ORDER BY destination_id;
-- (6 rows): Luxury Stay, Family Package, Sundarbans, Sajek, Bandarban, Sylhet Tea Garden`,
      },
    ],
    tip: (
      <ContentParagraph>
        নিজের psql এ প্রতিটা Query চালানোর আগে মনে মনে বলুন কয়টা Row আসবে আর পাশের সংখ্যাটা কোন দলের। Window এর সবচেয়ে
        বড় শক্তি হলো Row না হারানো, তাই প্রায় সবসময় উত্তর হবে: যতগুলো Row ঢুকেছে, ততগুলোই।
      </ContentParagraph>
    ),
  },
};
