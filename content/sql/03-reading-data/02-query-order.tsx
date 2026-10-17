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
  QueryFlowLab,
  WillItRunLab,
} from "../../../components/course/topics/reading-data/qorder-animations";
import {
  AliasVisibilityDiagram,
  ClausePipelineDiagram,
  WrittenVsLogicalDiagram,
} from "../../../components/course/topics/reading-data/qorder-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.9em] px-1 py-0.5 bg-muted/60 border border-border/60";

export const queryOrderContent: TopicData = {
  id: "query-order",
  introduction: {
    badge: "MODULE 03 · LESSON 02",
    title: <SectionTitle>লেখার ক্রম আর চলার ক্রম এক না</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি SELECT আর FROM দিয়ে প্রথম Query লিখেছেন, Column বেছে
          নিয়েছেন, হিসাব করে নতুন Column বানিয়েছেন, আর তাকে AS দিয়ে একটা সুন্দর নাম
          দিয়েছেন। এবার সেই নামটা পরের লাইনে ব্যবহার করতে গেলেই একটা অদ্ভুত ঘটনা ঘটে।
          নামটা ঠিক উপরের লাইনেই লেখা, অথচ PostgreSQL বলে এমন কোনো Column নেই।
        </ContentParagraph>
        <ContentParagraph>
          ঘটনাটা ভুল না, বরং SQL এর সবচেয়ে গুরুত্বপূর্ণ একটা নিয়মের চিহ্ন: আপনি যে ক্রমে
          Query লেখেন, Database সেই ক্রমে কাজ করে না। লেখা শুরু হয় SELECT দিয়ে, অথচ
          কাজ শুরু হয় FROM দিয়ে, আর SELECT এর পালা আসে পাঁচ নম্বরে। এই লেসনে আপনি সেই
          আসল ক্রমটা শিখবেন, প্রতিটা ধাপ আসল Data তে চোখের সামনে চলতে দেখবেন, আর বুঝবেন
          কেন কিছু Query চলে আর কিছু Error দেয়। এই একটা ক্রম মাথায় বসে গেলে পরের সব
          মডিউল, GROUP BY থেকে Window Function পর্যন্ত, অনেক সহজ লাগবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রেস্তোরাঁয় আপনি খাবারের নাম আগে বলেন, কারণ সেটাই আপনার আসল চাওয়া। কিন্তু রাঁধুনি কাজ শুরু করেন ভাঁড়ার থেকে: আগে উপকরণ, তারপর বাছাই, তারপর রান্না, শেষে প্লেটে সাজানো। SQL ও ঠিক তাই।",
      author: "Logical Query Order",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>নামটা তো উপরেই লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তানিয়া Island Tours এর Operations টিমে কাজ করেন। একদিন Marketing থেকে
                একটা অনুরোধ এল: দুজন একসাথে গেলে মোট খরচ বিশ হাজার টাকার বেশি পড়ে, এমন
                ট্যুরগুলোর তালিকা চাই, কারণ এগুলোর জন্য আলাদা Couple Offer বানানো হবে।
              </ContentParagraph>
              <ContentParagraph>
                তানিয়া আগের লেসন থেকে জানেন, দুজনের খরচ মানে{" "}
                <code className={CODE}>{"price_bdt * 2"}</code>, আর হিসাবটাকে একটা নাম
                দেওয়া যায় AS দিয়ে। তিনি নামটা দিলেন for_two, তারপর পরের লাইনে লিখলেন,
                শুধু যেগুলোর for_two বিশ হাজারের বেশি। লেখাটা পড়তে একদম স্বাভাবিক লাগে।
                নিচের বক্সে ঠিক তানিয়ার Query টাই আছে। Run চাপুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিয়ার প্রথম চেষ্টা"
              query={`SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE for_two > 20000;`}
              caption="PostgreSQL বলবে column &quot;for_two&quot; does not exist, আর Caret চিহ্নটা দেখাবে তৃতীয় লাইনের for_two এর নিচে। অথচ নামটা প্রথম লাইনেই আছে। এই লেসনের বাকিটা এই একটা Error এর রহস্য খুলবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তানিয়া প্রথমে ভাবলেন বানান ভুল হয়েছে। মিলিয়ে দেখলেন, বানান ঠিক। তারপর
                ভাবলেন হয়তো ছোট হাতের আর বড় হাতের অক্ষরের সমস্যা। সেটাও না। আসল উত্তর
                লুকিয়ে আছে একটা প্রশ্নে, যেটা আমরা সাধারণত জিজ্ঞেস করি না: PostgreSQL
                Query টা কোন লাইন থেকে পড়া শুরু করে?
              </ContentParagraph>
              <ContentParagraph>
                আমরা পড়ি উপর থেকে নিচে, তাই ধরে নিই Database ও তাই করে। কিন্তু Database
                আগে দেখে কোন Table থেকে Data আসবে, তারপর কোন Row রাখবে, আর একদম শেষের দিকে
                দেখে কোন Column দেখাতে হবে। for_two নামটার জন্ম হয় সেই দেখানোর ধাপে। WHERE
                যখন কাজ করছে, তখন নামটার জন্মই হয়নি। এই লেসন শেষে আপনি যেকোনো Query দেখে
                বলে দিতে পারবেন কোন নাম কোথায় চলবে, আর কোথায় চলবে না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "two-orders",
      subHeader: { index: "002", title: "Two Orders" },
      title: <SectionTitle>যে ক্রমে লিখি, আর যে ক্রমে চলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা SELECT Query তে সর্বোচ্চ আটটা অংশ থাকতে পারে। প্রতিটা অংশকে বলে
                Clause, মানে Query এর একটা টুকরো, যেটা একটা কাজের দায়িত্ব নেয়। এই আটটা
                Clause আপনাকে লিখতে হয় একটা নির্দিষ্ট ক্রমে, ভুল ক্রমে লিখলে PostgreSQL
                Syntax Error দেয়। এটাকে বলে <strong>লেখার ক্রম</strong>।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Database যখন Query টার মানে বোঝে, তখন সে Clause গুলো আরেকটা ক্রমে
                সাজায়। এই ক্রমকে বলে <strong>Logical Order</strong>, বাংলায় যুক্তির ক্রম
                বা চলার ক্রম। প্রতিটা ধাপ আগের ধাপের ফলাফল হাতে নিয়ে কাজ করে, ঠিক কারখানার
                Conveyor Belt এর মতো, যেখানে প্রতিটা টেবিলের কর্মী আগের টেবিল থেকে আসা জিনিসের
                উপর নিজের কাজটুকু করেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WrittenVsLogicalDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["চলার ধাপ", "Clause", "কী করে", "এই ধাপে হাতে কী থাকে"],
          rows: [
            ["১", "FROM", "কোন Table থেকে Row আসবে ঠিক করে", "পুরো Table, সব Row, সব Column"],
            ["২", "WHERE", "প্রতিটা Row কে শর্ত দিয়ে যাচাই করে, মিথ্যা হলে বাদ", "মূল Table এর Column গুলো"],
            ["৩", "GROUP BY", "একই মানের Row গুলোকে এক দলে বাঁধে", "Row এর বদলে দল"],
            ["৪", "HAVING", "দল ধরে শর্ত যাচাই করে, মিথ্যা হলে পুরো দল বাদ", "দল আর তাদের count(*), sum() এর মতো হিসাব"],
            ["৫", "SELECT", "কোন Column দেখাবে বাছে, হিসাব করে, AS দিয়ে নাম দেয়", "এখানেই Alias এর জন্ম"],
            ["৬", "DISTINCT", "একদম একই রকম Row গুলোর একটা রেখে বাকিগুলো মোছে", "SELECT এর বানানো Column"],
            ["৭", "ORDER BY", "Row গুলো সাজায়", "SELECT এর Column আর Alias"],
            ["৮", "LIMIT / OFFSET", "সাজানো তালিকা থেকে কয়েকটা রাখে বা বাদ দেয়", "চূড়ান্ত তালিকা"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তাহলে SQL কেন SELECT দিয়ে লেখা শুরু হয়, যদি সে কাজই পায় পাঁচ নম্বরে? কারণ
                SQL বানানো হয়েছিল মানুষের ভাষার কাছাকাছি করে। Module 01 এর{" "}
                <Link href="/sql/topic/what-is-sql" className={LINK}>
                  What SQL Is
                </Link>{" "}
                লেসনে আপনি দেখেছেন, SQL একটা Declarative ভাষা: আপনি বলেন কী চাই, কীভাবে
                আনতে হবে সেটা বলেন না। মানুষ যখন কিছু চায়, আগে বলে কী চায়: আমাকে ট্যুরের
                নাম আর দাম দেখান, tours থেকে, শুধু চালু ট্যুরগুলো, দাম অনুযায়ী সাজিয়ে।
                ইংরেজিতে বললে বাক্যটা প্রায় হুবহু একটা SQL Query।
              </ContentParagraph>
              <ContentParagraph>
                রেস্তোরাঁর উদাহরণটা ভাবুন। আপনি অর্ডার দেওয়ার সময় খাবারের নাম আগে বলেন,
                কারণ সেটাই আপনার আসল চাওয়া। কিন্তু রাঁধুনি কাজ শুরু করেন ভাঁড়ার থেকে: আগে
                উপকরণ বের করেন (FROM), পচা সবজি বাদ দেন (WHERE), তারপর রান্না করে প্লেটে
                সাজান (SELECT), আর শেষে কোন প্লেট আগে যাবে ঠিক করেন (ORDER BY)। আপনার বলার
                ক্রম আর রাঁধুনির কাজের ক্রম আলাদা, তবু খাবারটা ঠিকঠাক আসে। SQL এ আপনি
                ক্রেতা, PostgreSQL রাঁধুনি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটাই নিয়ম মনে রাখুন",
          content: (
            <ContentParagraph>
              একটা ধাপ শুধু সেটাই দেখতে পায়, যা তার আগের ধাপগুলো তৈরি করে দিয়েছে। SELECT
              এর বানানো নাম তার পরের ধাপ, মানে DISTINCT, ORDER BY আর LIMIT চিনতে পারে।
              তার আগের ধাপ, মানে WHERE আর HAVING, নামটা চেনে না, কারণ তারা যখন কাজ করে
              তখন নামটার জন্মই হয়নি। এই লেসনের প্রায় প্রতিটা Error এই একটা নিয়ম ভাঙার
              ফল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আরও দুটো ধাপ, যেগুলো পরে আসবে",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                PostgreSQL এর SELECT এর Docs এ পুরো ক্রমটা লেখা আছে, আর সেখানে আরও দুটো ধাপ
                আছে, যেগুলো এই মডিউলে লাগবে না। প্রথমটা WITH: Query এর একদম শুরুতে WITH
                দিয়ে নাম দেওয়া ছোট ছোট Query লেখা যায়, আর সেগুলো চলে FROM এরও আগে, যাতে
                FROM তাদের Table এর মতো ব্যবহার করতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা UNION, INTERSECT আর EXCEPT, যেগুলো দুটো Query এর ফলাফল জোড়া দেয়।
                এরা চলে DISTINCT এর পরে আর ORDER BY এর আগে, তাই ORDER BY পুরো জোড়া লাগানো
                ফলাফলকে একসাথে সাজায়। দুটোই Module 07 এ বিস্তারিত।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "from",
      subHeader: { index: "003", title: "Step 1: FROM" },
      title: <SectionTitle>ধাপ এক: Table টা হাতে নেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রতিটা Query এর প্রথম কাজ একটাই: Data কোথা থেকে আসবে? FROM এই প্রশ্নের
                উত্তর দেয়। FROM tours লেখা মানে tours Table এর প্রতিটা Row আর প্রতিটা
                Column এখন কাজের টেবিলে চলে এল। এই মুহূর্তে কিছুই বাদ পড়েনি, কিছুই হিসাব
                হয়নি, কিছুই সাজানো হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে সেই প্রথম ধাপটা দেখুন। এখানে SELECT * মানে সব Column, তাই
                আপনি FROM এর পরে টেবিলে ঠিক কী থাকে সেটাই দেখছেন: নয়টা ট্যুর, প্রতিটার নয়টা
                Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="FROM এর পরে টেবিলে যা থাকে"
              query={`SELECT *
FROM tours;`}
              caption="নয়টা Row। Saint Martin Luxury Stay এর is_active হলো f, মানে false, এই ট্যুরটা আর বিক্রি হয় না। পরের ধাপে WHERE এই Row টাকে কীভাবে বাদ দেয়, সেটা দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখন একটাই Table, তাই FROM এর কাজটা সহজ মনে হয়। কিন্তু Module 06 এ আপনি
                কয়েকটা Table জোড়া দেবেন, যেমন bookings এর পাশে customers এর নাম। তখনও FROM
                ই প্রথম ধাপ: সে সবগুলো Table জোড়া দিয়ে একটা বড় Table বানায়, তারপর বাকি
                সব ধাপ সেই জোড়া লাগানো Table এর উপর কাজ করে। তাই JOIN দেখতে যত জটিলই হোক,
                মনে রাখবেন, সেটা FROM ধাপের অংশ, সবার আগে ঘটে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "where",
      subHeader: { index: "004", title: "Step 2: WHERE" },
      title: <SectionTitle>ধাপ দুই: Row ছাঁকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                WHERE হাতে পায় FROM এর আনা পুরো Table। সে একটা একটা Row ধরে শর্তটা যাচাই
                করে। শর্ত সত্য হলে Row থাকে, মিথ্যা হলে বাদ। চালনির মতো ভাবুন: চাল ঢেলে দিলে
                ছোট দানা পড়ে যায়, বড় দানা থেকে যায়, আর চালনি প্রতিটা দানাকে আলাদা করে দেখে।
                WHERE কখনো একসাথে কয়েকটা Row মিলিয়ে কিছু বিচার করে না।
              </ContentParagraph>
              <ContentParagraph>
                এই মুহূর্তে WHERE এর হাতে আছে শুধু মূল Table এর Column: tour_id, title,
                price_bdt, is_active আর বাকিগুলো। তাই সে এমন Column দিয়েও ছাঁকতে পারে যেটা
                শেষে দেখানোই হবে না। নিচের Query তে শেষে শুধু title দেখানো হবে, অথচ WHERE
                ছাঁকছে is_active আর price_bdt দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দেখানো হবে না এমন Column দিয়ে ছাঁকা"
              query={`SELECT title
FROM tours
WHERE is_active AND price_bdt > 10000;`}
              caption="চারটা ট্যুর। price_bdt বা is_active ফলাফলে নেই, তবু WHERE এ দিব্যি কাজ করছে, কারণ WHERE চলার সময় মূল Table এর সব Column হাতে থাকে। Saint Martin Luxury Stay এর দাম বেশি হলেও সে বন্ধ, তাই বাদ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার তানিয়ার সমস্যাটা পরিষ্কার। WHERE চলে দুই নম্বর ধাপে। for_two এর জন্ম
                হবে পাঁচ নম্বর ধাপে, SELECT এ। WHERE যখন for_two খুঁজছে, তখন টেবিলে আছে
                শুধু tours এর আসল Column, আর তাদের কারো নাম for_two না। তাই PostgreSQL
                সৎভাবেই বলছে: এই নামে কোনো Column নেই।
              </ContentParagraph>
              <ContentParagraph>
                এর উল্টো দিকটাও মনে রাখুন। FROM যদি কয়েকটা Table জোড়া দিয়ে আনে, WHERE সেই
                সবগুলো Table এর সব Column দেখতে পায়, কারণ জোড়া লাগানোর কাজ তার আগেই শেষ।
                তাই Module 06 এ আপনি bookings আর customers জোড়া দিয়ে WHERE এ customers এর
                country দিয়ে Booking ছাঁকতে পারবেন, যদিও শেষে হয়তো শুধু booking_id দেখাবেন।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানও তাই সহজ। WHERE এ নামের বদলে হিসাবটাই আবার লিখুন:{" "}
                <code className={CODE}>{"WHERE price_bdt * 2 > 20000"}</code>। price_bdt
                তো আসল Column, WHERE তাকে চেনে। এখন নিজে চেষ্টা করে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1: তানিয়ার Query ঠিক করুন"
              task={
                <>
                  তানিয়ার জন্য Query টা ঠিক করে লিখুন: প্রতিটা ট্যুরের{" "}
                  <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>{"price_bdt * 2"}</code> এর মান for_two নামে,
                  শুধু যেগুলোর দুজনের খরচ বিশ হাজার টাকার বেশি। বন্ধ ট্যুরও রাখুন, সাজানোর
                  দরকার নেই।
                </>
              }
              hint={
                <>
                  SELECT এ for_two নামটা থাকুক, কিন্তু WHERE এ নামটা লিখবেন না। সেখানে
                  হিসাবটাই আবার লিখুন: price_bdt * 2 &gt; 20000।
                </>
              }
              solution={`SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE price_bdt * 2 > 20000;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "In MySQL",
          content: (
            <ContentParagraph>
              MySQL এও একই নিয়ম, আর Error টাও প্রায় একই কথা বলে: ERROR 1054 (42S22):
              Unknown column &apos;for_two&apos; in &apos;where clause&apos;। MySQL এর Docs
              নিজেই কারণ লিখে রেখেছে: WHERE যখন চলে, Column এর মান তখনো ঠিক হয়নি। তাই
              MySQL এর ভিডিও দেখে শিখলেও এই নিয়মটা হুবহু একই থাকবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "group-having",
      subHeader: { index: "005", title: "Steps 3 and 4" },
      title: <SectionTitle>ধাপ তিন আর চার: দল বাঁধা আর দল ছাঁকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                GROUP BY আর HAVING এর পুরো লেসন আসবে Module 05 এ। এখানে শুধু জানুন, চলার
                ক্রমে তারা কোথায় বসে, কারণ সেটা না জানলে পরে অনেক Error এর মানে বোঝা যায়
                না।
              </ContentParagraph>
              <ContentParagraph>
                GROUP BY status লেখা মানে: একই status এর সব Row কে একটা দলে বাঁধা। বাঁধার
                পর আর আলাদা Row থাকে না, থাকে দল। confirmed এর দল, pending এর দল, cancelled
                এর দল। প্রতিটা দল নিয়ে আপনি জিজ্ঞেস করতে পারেন, এই দলে কয়টা Row, যার
                লেখা count(*)।
              </ContentParagraph>
              <ContentParagraph>
                HAVING হলো দলের চালনি। WHERE যেমন একটা একটা Row ছাঁকে, HAVING তেমনি একটা
                একটা দল ছাঁকে। দুটোর পার্থক্যটা ক্রমেই লুকানো: WHERE চলে দল বানানোর আগে,
                HAVING চলে পরে। নিচের Query তে দুটোই আছে। আগে WHERE এক সিটের Booking গুলো
                বাদ দেয়, তারপর GROUP BY দল বাঁধে, তারপর HAVING ছোট দলটা বাদ দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE আগে, HAVING পরে"
              query={`SELECT status, count(*) AS bookings
FROM bookings
WHERE seats >= 2
GROUP BY status
HAVING count(*) > 2
ORDER BY bookings DESC;`}
              caption="দুটো Row: confirmed 13, pending 4। WHERE আগে এক সিটের পাঁচটা Booking বাদ দিয়েছে। cancelled দলে থাকল মাত্র দুটো, তাই HAVING তাকে বাদ দিয়েছে। HAVING এ count(*) পুরোটা লেখা, bookings নামটা না, কারণ HAVING ও SELECT এর আগে চলে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুটো Error এখানেই ধরা পড়ে, আর দুটোই ক্রমের কারণে। প্রথমটা: WHERE এ
                count(*) লেখা যায় না। গোনার জন্য দল লাগে, আর WHERE চলে দল বানানোর আগে,
                প্রতিটা Row আলাদা করে দেখতে দেখতে। PostgreSQL পরিষ্কার বলে দেয়: aggregate
                functions are not allowed in WHERE। Aggregate Function মানে যে Function অনেক
                Row মিলিয়ে একটা উত্তর দেয়, যেমন count, sum, avg। এদের জায়গা HAVING এ।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা: PostgreSQL এ HAVING SELECT এর Alias চেনে না।{" "}
                <code className={CODE}>{"HAVING bookings > 2"}</code> লিখলে আসে column
                &quot;bookings&quot; does not exist। এখানে MySQL আর PostgreSQL আলাদা আচরণ
                করে, সেটা Section 011 এ দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো চেনা Error"
              query={`SELECT title
FROM tours
WHERE count(*) > 1;`}
              caption="aggregate functions are not allowed in WHERE। একই কথা MySQL বলে নিজের ভাষায়: ERROR 1111 Invalid use of group function। নিচের লাইনটা এখানে বসিয়ে দেখুন HAVING এর Alias Error: SELECT status, count(*) AS n FROM bookings GROUP BY status HAVING n > 3;"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "select",
      subHeader: { index: "006", title: "Step 5: SELECT" },
      title: <SectionTitle>ধাপ পাঁচ: Column বাছা আর নাম দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                অবশেষে SELECT এর পালা। এই মুহূর্তে তার হাতে আছে শুধু সেই Row গুলো, যারা
                WHERE আর HAVING পার হয়ে এসেছে। SELECT প্রতিটা Row থেকে আপনার চাওয়া Column
                গুলো নেয়, যেখানে হিসাব লেখা আছে সেটা করে, আর AS দিয়ে দেওয়া নামগুলো বসায়।
                Alias এর জন্ম ঠিক এখানে, এই পাঁচ নম্বর ধাপে।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা সুন্দর ফল আছে। যে Row WHERE এ বাদ পড়েছে, তার জন্য SELECT কোনো
                হিসাবই করে না। কোটি Row এর Table থেকে দশটা Row ছেঁকে নিলে, দামি হিসাবটা হবে
                শুধু ওই দশটার উপর। তাই শর্ত যত আগে বসানো যায়, কাজ তত কম হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নতুন Column আর তাদের নাম"
              query={`SELECT title,
       price_bdt,
       price_bdt * 2      AS for_two,
       duration_days * 24 AS hours
FROM tours
WHERE tour_id <= 3;`}
              caption="তিনটা Row, চারটা Column। for_two আর hours Table এ কোথাও জমা নেই, SELECT এই মুহূর্তে হিসাব করে বানাল আর নাম দিল। এই নামগুলো এখন থেকে পরের ধাপগুলো, মানে DISTINCT, ORDER BY আর LIMIT চিনবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ClausePipelineDiagram />,
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "distinct",
      subHeader: { index: "007", title: "Step 6: DISTINCT" },
      title: <SectionTitle>ধাপ ছয়: একই রকম Row মোছা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                DISTINCT এর পুরো লেসন এই মডিউলেই পরে আসছে। ক্রমের দিক থেকে তার জায়গাটা
                জানা দরকার: DISTINCT চলে SELECT এর ঠিক পরে। মানে সে কাজ করে SELECT এর
                বানানো Column এর উপর, মূল Table এর উপর না। SELECT DISTINCT region মানে, আগে
                প্রতিটা destination থেকে region নেওয়া, তারপর একই region বারবার এলে একটা রাখা।
              </ContentParagraph>
              <ContentParagraph>
                এই ক্রমের একটা অদ্ভুত ফল আছে। DISTINCT এর পরে ORDER BY যদি এমন Column দিয়ে
                সাজাতে চায় যেটা SELECT এ নেই, PostgreSQL আপত্তি করে। কারণটা ভাবুন: Chattogram
                region এর চারটা destination আছে, তাদের kind আলাদা আলাদা: island, beach,
                hills। DISTINCT চারটাকে এক করে একটা Chattogram বানিয়ে দিল। এখন সেই একটা Row
                এর kind কোনটা? কেউ বলতে পারে না। তাই kind ধরে সাজানোর মানে থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DISTINCT আর ORDER BY এর ঝগড়া"
              query={`SELECT DISTINCT region
FROM destinations
ORDER BY kind;`}
              caption="for SELECT DISTINCT, ORDER BY expressions must appear in select list। সমাধান দুটো: SELECT এ kind ও রাখুন (SELECT DISTINCT region, kind ...), অথবা যেটা দেখাচ্ছেন সেটা দিয়েই সাজান (ORDER BY region)। MySQL একই কারণে ERROR 3065 দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2: আলাদা আলাদা Region"
              orderMatters
              task={
                <>
                  destinations Table এ কোন কোন region আছে, প্রতিটা একবার করে দেখান,
                  বর্ণমালার ক্রমে সাজিয়ে। ফলাফলে শুধু একটা Column থাকবে:{" "}
                  <code className={CODE}>region</code>।
                </>
              }
              hint={
                <>
                  SELECT DISTINCT region দিয়ে শুরু করুন। সাজানোর সময় এমন Column দিন যেটা
                  SELECT এ আছে।
                </>
              }
              solution={`SELECT DISTINCT region
FROM destinations
ORDER BY region;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "order-by",
      subHeader: { index: "008", title: "Step 7: ORDER BY" },
      title: <SectionTitle>ধাপ সাত: সাজানো, আর প্রথমবার নামটা চেনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ORDER BY চলে SELECT এর পরে। তাই এটাই প্রথম ধাপ, যেখানে আপনার দেওয়া Alias
                সত্যি সত্যি চেনা যায়। তানিয়া যদি WHERE এর বদলে ORDER BY for_two লিখতেন,
                Query টা দিব্যি চলত। একই নাম, একই Query, শুধু Clause আলাদা, আর তাতেই চলা আর
                না চলার পার্থক্য।
              </ContentParagraph>
              <ContentParagraph>
                ORDER BY এর আরেকটা ক্ষমতা আছে। DISTINCT না থাকলে সে এমন Column দিয়েও সাজাতে
                পারে যেটা SELECT এ নেই। কারণ ORDER BY চলার সময় প্রতিটা Row এর মূল Column গুলো
                তখনো তার নাগালে থাকে। নিচের প্রথম Query তে শুধু title দেখানো হচ্ছে, অথচ সাজানো
                হচ্ছে price_bdt দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Alias দিয়ে, আর না দেখানো Column দিয়ে সাজানো"
              query={`SELECT title
FROM tours
WHERE is_active
ORDER BY price_bdt DESC;

SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE is_active
ORDER BY for_two DESC;`}
              caption="দুটো ফলাফলেই আটটা চালু ট্যুর, সবচেয়ে দামি Sundarbans Mangrove Cruise উপরে। প্রথমটায় price_bdt দেখানোই হয়নি, তবু সেটা দিয়ে সাজানো গেছে। দ্বিতীয়টায় ORDER BY নিজের পরিচিত নাম for_two দিয়ে সাজিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা সূক্ষ্ম নিয়ম আছে, যেটা PostgreSQL এর Docs এ স্পষ্ট লেখা: ORDER BY তে
                Alias শুধু একা দাঁড়ালে চেনা যায়। ORDER BY for_two চলে, কিন্তু ORDER BY
                for_two + 1 চলে না। কোনো হিসাবের ভেতরে নামটা থাকলে PostgreSQL সেটা খোঁজে মূল
                Table এর Column এর মধ্যে, আর সেখানে for_two নেই। Docs বলছে, অস্পষ্টতা কমাতেই
                এই নিয়ম। দরকার হলে হিসাবটা পুরো লিখুন: ORDER BY price_bdt * 2 + 1।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3: পুরো ভরলে কত টাকা"
              orderMatters
              task={
                <>
                  প্রতিটা ট্যুরের একটা তারিখ পুরো ভরে গেলে কত টাকা আসে, সেটা{" "}
                  <code className={CODE}>{"max_seats * price_bdt"}</code>। এই হিসাবটা{" "}
                  <code className={CODE}>full_value</code> নামে দেখান, পাশে{" "}
                  <code className={CODE}>title</code> (title আগে)। সবচেয়ে বড় full_value
                  এর তিনটা ট্যুর দেখান, বড়টা আগে। সাজানোর সময় Alias টাই ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  ORDER BY full_value DESC লিখলে চলবে, কারণ ORDER BY চলে SELECT এর পরে।
                  শেষে LIMIT 3।
                </>
              }
              solution={`SELECT title, max_seats * price_bdt AS full_value
FROM tours
ORDER BY full_value DESC
LIMIT 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "limit",
      subHeader: { index: "009", title: "Step 8: LIMIT" },
      title: <SectionTitle>ধাপ আট: শেষে কেটে ছোট করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                LIMIT সবার শেষে চলে। এটা খুব গুরুত্বপূর্ণ, কারণ সবচেয়ে দামি তিনটা ট্যুর
                জানতে হলে আগে সাজাতে হবে, তারপর কাটতে হবে। উল্টো হলে, মানে আগে যেকোনো তিনটা
                নিয়ে তারপর সাজালে, আপনি পেতেন যেকোনো তিনটা ট্যুর, সুন্দর করে সাজানো, কিন্তু
                ভুল তিনটা।
              </ContentParagraph>
              <ContentParagraph>
                আর যদি ORDER BY না থাকে? PostgreSQL এর Docs বলে, ORDER BY না দিলে Row আসে সেই
                ক্রমে যেটা Database এর জন্য সবচেয়ে দ্রুত। আজ যে তিনটা আসছে, কাল Data বদলালে
                বা Database অন্য পথে Query চালালে অন্য তিনটা আসতে পারে। নিচে দুটো Query পাশাপাশি
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY সহ আর ছাড়া LIMIT"
              query={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt
LIMIT 3;

SELECT title, price_bdt
FROM tours
LIMIT 3;`}
              caption="প্রথমটা সত্যিই সবচেয়ে সস্তা তিনটা: Ratargul, Sylhet, Cox's Bazar Beach Weekend। দ্বিতীয়টা এখন টেবিলে যে ক্রমে রাখা আছে সেই ক্রমের প্রথম তিনটা, যেটা কাকতালীয়। এর উপর কোনো Report দাঁড় করাবেন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                LIMIT এর সঙ্গী OFFSET ও এই আট নম্বর ধাপে চলে। OFFSET 3 মানে সাজানো তালিকার
                প্রথম তিনটা Row বাদ দিয়ে তারপর গোনা শুরু। ধরুন একটা Page এ
                তিনটা করে ট্যুর দেখাবেন। প্রথম Page হলো ORDER BY price_bdt LIMIT 3, দ্বিতীয়
                Page হলো ORDER BY price_bdt LIMIT 3 OFFSET 3। দুটোতেই একই ORDER BY লাগবে,
                নইলে দ্বিতীয় Page এ প্রথম Page এর কোনো ট্যুর আবার চলে আসতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                Page বানানোর পুরো কৌশল, আর বড় Table এ OFFSET কেন ধীর হয়ে যায়, সেটা এই
                মডিউলের{" "}
                <Link href="/sql/topic/limit-pagination" className={LINK}>
                  LIMIT, OFFSET and Pagination
                </Link>{" "}
                লেসনে। এখানে শুধু মনে রাখুন: কাটাকাটি সবসময় সাজানোর পরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4: সবচেয়ে সস্তা দুটো চালু ট্যুর"
              orderMatters
              task={
                <>
                  শুধু চালু ট্যুরগুলোর মধ্যে সবচেয়ে সস্তা দুটো দেখান:{" "}
                  <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code>, সস্তাটা আগে।
                </>
              }
              hint={
                <>
                  চারটা Clause লাগবে, চলার ক্রমে ভাবুন: কোথা থেকে, কোনগুলো, কীভাবে সাজানো,
                  কয়টা।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE is_active
ORDER BY price_bdt
LIMIT 2;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "watch-it-flow",
      subHeader: { index: "010", title: "Watch It Flow" },
      title: <SectionTitle>Query কে চোখের সামনে চলতে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                আটটা ধাপ আলাদা আলাদা দেখলেন। এবার পুরো ছবিটা একসাথে দেখুন। নিচের Lab এ দুটো
                আসল Query আছে, Sample Database এর আসল Row সহ। পরের ধাপ চাপলে বাঁ দিকে লেখা
                Query এর যে লাইনটা এখন চলছে সেটা জ্বলে ওঠে। খেয়াল করুন, প্রথম লাইন, মানে
                SELECT, জ্বলে পাঁচ নম্বর ধাপে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <QueryFlowLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখন একটা সৎ কথা বলা দরকার। এই আটটা ধাপ হলো Logical Order, মানে ফলাফলটা কী
                হবে সেটা বোঝার নিয়ম। PostgreSQL আসলে মেশিনের ভেতরে ঠিক এভাবে একটা একটা করে
                কাজ নাও করতে পারে। তার ভেতরে Planner নামে একটা অংশ আছে, যে প্রতিটা Query চালানোর
                আগে সবচেয়ে কম খরচের পথটা খোঁজে। সে হয়তো Table পড়তে পড়তেই WHERE এর শর্ত
                যাচাই করে ফেলে, পুরো Table আগে আলাদা করে আনে না। এটাকে বলে Physical Order।
              </ContentParagraph>
              <ContentParagraph>
                তবে একটা প্রতিশ্রুতি কখনো ভাঙে না: Planner যে পথেই যাক, ফলাফল হবে ঠিক সেটাই,
                যেটা Logical Order মেনে চললে হতো। তাই Query লেখার আর Error বোঝার সময় আপনি
                নিশ্চিন্তে আটটা ধাপ ধরে ভাবতে পারেন। Planner এর পথটা দেখার একটা জানালা আছে,
                তার নাম EXPLAIN। পুরোটা Module 13 এ, তবে এখনই একবার উঁকি দিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Planner এর পরিকল্পনায় একবার উঁকি"
              query={`EXPLAIN
SELECT title
FROM tours
WHERE is_active
ORDER BY price_bdt
LIMIT 3;`}
              caption="Plan টা নিচ থেকে উপরে পড়ুন। সবার নিচে Seq Scan on tours, তার সাথে Filter: is_active, মানে Table পড়তে পড়তেই WHERE এর কাজ। তার উপরে Sort, তারও উপরে Limit। ক্রমটা চেনা লাগছে? cost এর সংখ্যাগুলো আপনার মেশিনে আলাদা হবে, সেগুলোর মানে Module 13 এ।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "alias-rules",
      subHeader: { index: "011", title: "Alias Rules" },
      title: <SectionTitle>Alias কোথায় চলে, কোথায় চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এতক্ষণ যা দেখলেন, সেটা এক জায়গায় গুছিয়ে নিন। নিয়মটা ক্রম থেকেই আসে, তবে
                দুটো ব্যতিক্রম আছে, আর একটা জায়গায় PostgreSQL আর MySQL আলাদা আচরণ করে। MySQL
                এর ভিডিও দেখে শিখছেন বলে এই পার্থক্যটা আপনার জন্য বিশেষ জরুরি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AliasVisibilityDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Clause", "চলার ধাপ", "PostgreSQL 18", "MySQL 8.4", "নিরাপদ লেখা, দুই জায়গাতেই চলে"],
          rows: [
            ["WHERE", "২", "চলে না: column does not exist", "চলে না: ERROR 1054", "হিসাবটা পুরো লিখুন: WHERE price_bdt * 2 > 20000"],
            ["GROUP BY", "৩", "চলে (Docs এর ব্যতিক্রম)", "চলে", "দুটোই চলে, তবু Column বা হিসাব লেখা বেশি পরিষ্কার"],
            ["HAVING", "৪", "চলে না: column does not exist", "চলে", "হিসাবটা পুরো লিখুন: HAVING count(*) > 3"],
            ["ORDER BY, একা নাম", "৭", "চলে", "চলে", "ORDER BY for_two"],
            ["ORDER BY, হিসাবের ভেতরে", "৭", "চলে না: column does not exist", "চলে", "হিসাবটা পুরো লিখুন: ORDER BY price_bdt * 2 + 1"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                GROUP BY এর ব্যতিক্রমটা অদ্ভুত লাগতে পারে, কারণ GROUP BY তো SELECT এর আগে
                চলে। PostgreSQL এর SELECT এর Docs নিজেই এটা স্বীকার করে: Output Column গুলো
                নামে পরের ধাপে হিসাব হয়, কিন্তু GROUP BY তে তাদের নাম বা ক্রমিক নম্বর দিয়ে
                উল্লেখ করা যায়। মানে এটা মানুষের সুবিধার জন্য রাখা একটা ছাড়, ক্রমের নিয়ম
                বদলায়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এর ভিডিও থেকে আসা একটা ফাঁদ",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                MySQL এ HAVING Alias মেনে নেয়, তাই অনেক MySQL টিউটোরিয়ালে{" "}
                <code className={CODE}>{"HAVING n > 3"}</code> এর মতো লেখা দেখবেন। একই
                লাইন PostgreSQL এ Error দেবে। MySQL আরও এক ধাপ নরম: GROUP BY ছাড়াই HAVING
                এ Alias দিয়ে Row ছাঁকতে দেয়, যেমন{" "}
                <code className={CODE}>{"HAVING for_two > 20000"}</code>। এটা MySQL এর
                নিজস্ব সুবিধা, Standard SQL না।
              </ContentParagraph>
              <ContentParagraph>
                অভ্যাসটা তাই সহজ রাখুন: WHERE আর HAVING এ সবসময় হিসাবটা পুরো লিখুন। তাহলে
                আপনার Query PostgreSQL, MySQL আর অন্য যেকোনো Database এ একইভাবে চলবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "will-it-run",
      subHeader: { index: "012", title: "Will It Run?" },
      title: <SectionTitle>চালানোর আগেই বলে দিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিয়মটা সত্যিই মাথায় বসেছে কিনা, যাচাই করার সবচেয়ে ভালো উপায় হলো চালানোর আগে
              আন্দাজ করা। নিচের আটটা Query পড়ুন, প্রতিটার জন্য ঠিক করুন PostgreSQL এ চলবে
              নাকি Error দেবে, তারপর উত্তর খুলুন। প্রতিটা উত্তরের সাথে MySQL কী করে, আর কেন,
              সেটাও আছে। আটটায় আটটা পেলে আপনি ক্রমটা সত্যিই বুঝেছেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WillItRunLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "fixing",
      subHeader: { index: "013", title: "Fixing It" },
      title: <SectionTitle>Alias দরকার আগের ধাপে? তিনটা উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ধরুন হিসাবটা লম্বা, তিন লাইনের। WHERE এ বারবার লিখতে ইচ্ছা করে না, আর বারবার
                লিখলে একটা জায়গায় বদলালে অন্য জায়গায় বদলাতে ভুলে যাওয়ার ভয় থাকে। তিনটা উপায়
                আছে, সহজ থেকে শক্তিশালী।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হিসাবটা আবার লেখা।</strong> ছোট হিসাবের জন্য এটাই সবচেয়ে সহজ আর
                  সবচেয়ে বেশি দেখা যায়। Exercise 1 এ আপনি এটাই করেছেন।
                </ListItem>
                <ListItem>
                  <strong>Query এর ভেতরে Query।</strong> ভেতরের Query তে for_two বানিয়ে
                  নিন, তারপর বাইরের Query সেই ফলাফলকে একটা Table হিসেবে FROM এ নেয়। বাইরের
                  Query এর FROM চলে সবার আগে, আর তখন for_two একটা সাধারণ Column, তাই WHERE তাকে
                  চেনে। এর নাম Derived Table, পুরোটা Module 07 এ।
                </ListItem>
                <ListItem>
                  <strong>WITH দিয়ে নাম দেওয়া ধাপ।</strong> একই ধারণা, আরও পড়ার মতো করে
                  লেখা। এর নাম CTE, সেটাও Module 07 এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Query এর ভেতরে Query: একটা আগাম ঝলক"
              query={`SELECT title, for_two
FROM (
  SELECT title, price_bdt * 2 AS for_two
  FROM tours
) AS t
WHERE for_two > 20000;`}
              caption="পাঁচটা Row, Exercise 1 এর ঠিক সেই পাঁচটা। ভেতরের Query আগে পুরোটা চলে for_two বানায়। বাইরের Query এর কাছে সেটা t নামের একটা Table, যার একটা Column এর নাম for_two। এখন আর এটা Alias না, Column, তাই WHERE তাকে চেনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা Challenge, যেখানে এই লেসনের সব নিয়ম একসাথে লাগবে। ধরে নিন প্রতিটা
              ট্যুরের দামের উপর ১৫% VAT বসে, মানে দামকে 1.15 দিয়ে গুণ করতে হয়। Marketing
              জানতে চায়, VAT সহ দাম দশ হাজার টাকার নিচে থাকে এমন চালু ট্যুর কোনগুলো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge: VAT সহ দাম"
              orderMatters
              task={
                <>
                  চালু ট্যুরগুলোর <code className={CODE}>title</code> আর VAT সহ দাম{" "}
                  <code className={CODE}>{"price_bdt * 1.15"}</code>, এই দামের নাম দিন{" "}
                  <code className={CODE}>price_with_vat</code>। শুধু সেই ট্যুরগুলো, যাদের
                  price_with_vat দশ হাজারের কম। সবচেয়ে বেশি price_with_vat আগে, আর সাজানোর
                  সময় Alias টাই ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  WHERE এ দুটো শর্ত, AND দিয়ে: is_active, আর হিসাবটা পুরো লেখা price_bdt *
                  1.15 &lt; 10000। ORDER BY তে price_with_vat DESC চলবে।
                </>
              }
              solution={`SELECT title, price_bdt * 1.15 AS price_with_vat
FROM tours
WHERE is_active
  AND price_bdt * 1.15 < 10000
ORDER BY price_with_vat DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Dashboard এর একটা Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Island Tours এর Admin Dashboard এ একটা ছোট বক্স আছে: আয়ের হিসাবে সেরা তিন
                ট্যুর, শুধু confirmed Booking ধরে, আর পঞ্চাশ হাজার টাকার কম আয়ের ট্যুর বাদ।
                Query টায় JOIN, GROUP BY, HAVING সবই আছে, যেগুলো পুরোপুরি আসবে পরের
                মডিউলগুলোতে। কিন্তু এখনই আপনি এটা পড়তে পারবেন, যদি চলার ক্রম ধরে পড়েন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সেরা তিন ট্যুর, আয়ের হিসাবে"
              query={`SELECT t.title, sum(b.total_bdt) AS revenue
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.title
HAVING sum(b.total_bdt) > 50000
ORDER BY revenue DESC
LIMIT 3;`}
              caption="Saint Martin Island Escape 125000.00, Cox's Bazar Beach Weekend 93500.00, Sundarbans Mangrove Cruise 90000.00। JOIN এর মানে এখন না বুঝলেও চলবে, Module 06 এ আসছে। শুধু খেয়াল করুন HAVING এ sum() পুরো লেখা, আর ORDER BY তে revenue নামটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "FROM আর JOIN",
              description:
                "bookings, departures আর tours জোড়া দিয়ে একটা বড় Table। প্রতিটা Booking এর পাশে এখন তার ট্যুরের নাম।",
            },
            {
              title: "WHERE",
              description:
                "শুধু confirmed Booking থাকে। pending আর cancelled এর টাকা আয় না, তাই এখানেই বাদ।",
            },
            {
              title: "GROUP BY",
              description: "একই ট্যুরের সব Booking এক দলে। প্রতিটা দলের জন্য sum(b.total_bdt) হিসাব হয়।",
            },
            {
              title: "HAVING",
              description:
                "পঞ্চাশ হাজারের কম আয়ের দল বাদ। এখানে revenue নামটা লিখলে PostgreSQL চিনত না, তাই sum() পুরো লেখা।",
            },
            {
              title: "SELECT",
              description: "ট্যুরের নাম আর দলের মোট টাকা, নাম revenue। Alias এর জন্ম এখানে।",
            },
            {
              title: "ORDER BY আর LIMIT",
              description: "revenue নামটা এখন চেনা, তাই সাজানো গেল। শেষে উপরের তিনটা রাখা হলো।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বাস্তবের Dashboard গুলো এরকম Query তেই চলে, শুধু Table বেশি, শর্ত বেশি। যত বড়ই
              হোক, পড়ার কৌশল একই: FROM থেকে শুরু, LIMIT এ শেষ। Module 11 এ আপনি নিজের my_tours
              এর Dashboard এর Query নিজে লিখবেন, আর তখন এই ক্রমটাই আপনার কাঠামো হবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো Query লেখার একটা পদ্ধতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              অভিজ্ঞ Developer রা জটিল Query লেখার সময় প্রায়ই SELECT দিয়ে শুরু করেন না। তাঁরা
              শুরু করেন FROM দিয়ে, আর চলার ক্রম ধরে এক ধাপ করে বাড়ান, প্রতিবার চালিয়ে দেখেন।
              এতে প্রতিটা ধাপের ফলাফল চোখে দেখা যায়, আর ভুল হলে ঠিক কোন ধাপে হলো সেটা সাথে
              সাথে ধরা পড়ে। পদ্ধতিটা এরকম:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা এক বাক্যে লিখুন",
              description:
                "যেমন: confirmed Booking গুলোর মধ্যে সবচেয়ে নতুন তিনটা, booking_id আর booked_at সহ। কোন Table, কোন শর্ত, কী দেখাবেন, কোন ক্রমে, কয়টা, সব এই বাক্যে আছে।",
            },
            {
              title: "FROM দিয়ে শুরু, SELECT * রেখে",
              description:
                "SELECT * FROM bookings; চালান। কোন Column আছে আর Data দেখতে কেমন, নিজের চোখে দেখুন।",
            },
            {
              title: "WHERE যোগ করুন",
              description:
                "WHERE status = 'confirmed' যোগ করে আবার চালান। Row কয়টা কমল, প্রত্যাশামতো কিনা দেখুন।",
            },
            {
              title: "দল দরকার হলে GROUP BY আর HAVING",
              description: "এই প্রশ্নে দলের দরকার নেই, তাই এই ধাপ বাদ। প্রশ্নে প্রতিটা, মোট, গড় এমন শব্দ থাকলে দল লাগবে।",
            },
            {
              title: "এবার SELECT এর তালিকা",
              description:
                "* সরিয়ে শুধু দরকারি Column লিখুন: booking_id, booked_at। হিসাব বা নাম দরকার হলে এখানেই।",
            },
            {
              title: "ORDER BY, তারপর LIMIT",
              description:
                "ORDER BY booked_at DESC, তারপর LIMIT 3। সাজানোর আগে কাটবেন না, আর LIMIT থাকলে ORDER BY অবশ্যই রাখুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একই পদ্ধতি উল্টো দিকেও কাজে লাগে, যখন আপনাকে অন্য কারো লেখা Query পড়তে হয়।
                চাকরির প্রথম সপ্তাহে প্রায় সবাই এমন একটা Query হাতে পান, যেটা কেউ বছর দুই আগে
                লিখে গেছেন। উপর থেকে নিচে পড়লে মাথা ঘোরে। চলার ক্রমে পড়লে গল্পের মতো লাগে।
                নিচের Query টা দেখুন, আর ডান দিকের Column টা ধরে পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা লাইন", "আট ধাপের কোনটা", "চলার ক্রমে পড়লে যেমন শোনায়"],
          rows: [
            ["SELECT title, price_bdt * 2 AS for_two", "৫", "তারপর প্রতিটা Row থেকে নাম আর দুজনের খরচ নেওয়া, খরচটার নাম for_two"],
            ["FROM tours", "১", "tours Table টা নিয়ে শুরু"],
            ["WHERE is_active", "২", "বন্ধ ট্যুরগুলো বাদ দেওয়া"],
            ["ORDER BY for_two DESC", "৭", "দুজনের খরচ বেশি এমনগুলো উপরে সাজানো"],
            ["LIMIT 3;", "৮", "উপরের তিনটা রেখে বাকিগুলো ফেলে দেওয়া"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              টেবিলের শেষ Column টা ধাপের নম্বর ধরে, মানে ১, ২, ৫, ৭, ৮ এই ক্রমে পড়ে দেখুন,
              একটা ছোট গল্পের মতো শোনায়। এই অভ্যাসটা গড়ে তুলুন: যেকোনো Query হাতে পেলে প্রথমে চোখ যাবে
              FROM এ, তারপর WHERE এ, আর SELECT পড়বেন একদম শেষের দিকে। Module 06 এর JOIN আর
              Module 07 এর Subquery তে এই অভ্যাসই আপনাকে বাঁচাবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5: পদ্ধতিটা নিজে চালিয়ে দেখুন"
              orderMatters
              task={
                <>
                  উপরের ছয়টা ধাপ মেনে লিখুন: confirmed Booking গুলোর মধ্যে সবচেয়ে নতুন
                  তিনটা, দুটো Column: <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>booked_at</code>, নতুনটা আগে। প্রতিটা ধাপের পরে
                  একবার করে Check চেপে দেখতে পারেন, কোথায় মিলছে আর কোথায় না।
                </>
              }
              hint={
                <>
                  WHERE status = &apos;confirmed&apos;, তারপর ORDER BY booked_at DESC, শেষে
                  LIMIT 3।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
WHERE status = 'confirmed'
ORDER BY booked_at DESC
LIMIT 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>WHERE এ Alias।</strong> সবচেয়ে চেনা ভুল। লক্ষণ: column
                &quot;...&quot; does not exist, অথচ নামটা SELECT এ আছে। সমাধান: হিসাবটা পুরো
                লিখুন, অথবা ভেতরের Query তে নামটা বানান।
              </ListItem>
              <ListItem>
                <strong>WHERE এ count() বা sum()।</strong> লক্ষণ: aggregate functions are
                not allowed in WHERE। দলের শর্ত যায় HAVING এ, Module 05 এ বিস্তারিত।
              </ListItem>
              <ListItem>
                <strong>MySQL এর অভ্যাস PostgreSQL এ।</strong> HAVING এ Alias, অথবা ORDER BY
                তে Alias দিয়ে হিসাব MySQL এ চলে, PostgreSQL এ চলে না। দুই জায়গায় চলে এমন
                লেখার অভ্যাস করুন: হিসাবটা পুরো।
              </ListItem>
              <ListItem>
                <strong>ORDER BY ছাড়া LIMIT।</strong> কোনো Error আসে না, তাই আরও বিপজ্জনক।
                আজ ঠিক তিনটা আসছে, কাল অন্য তিনটা আসবে, আর কেউ টের পাবে না। LIMIT থাকলে
                ORDER BY রাখুন।
              </ListItem>
              <ListItem>
                <strong>DISTINCT এর সাথে না দেখানো Column দিয়ে সাজানো।</strong> লক্ষণ: for
                SELECT DISTINCT, ORDER BY expressions must appear in select list। যা দিয়ে
                সাজাবেন, সেটা SELECT এ রাখুন।
              </ListItem>
              <ListItem>
                <strong>লেখার ক্রমকেই চলার ক্রম ভাবা।</strong> এই একটা ভুল ধারণা থেকেই উপরের
                সবগুলো আসে। Query পড়ার সময় FROM থেকে পড়া শুরু করুন, SELECT থেকে না।
              </ListItem>
              <ListItem>
                <strong>Clause এর লেখার ক্রম ভুল করা।</strong> চলার ক্রম আলাদা হলেও লেখার
                ক্রম নির্দিষ্ট। WHERE কে ORDER BY এর পরে লিখলে PostgreSQL syntax error at or
                near &quot;WHERE&quot; দেয়। লেখার সময় SELECT, FROM, WHERE, GROUP BY, HAVING,
                ORDER BY, LIMIT।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>SELECT, PostgreSQL এর Reference</strong>, Description অংশে
                &quot;general processing of SELECT&quot; শিরোনামে ঠিক এই লেসনের ক্রমটা লেখা,
                আর SELECT List অংশে Alias কোথায় চলে তার নিয়ম।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/sql-select.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/sql-select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Queries: Overview</strong>, Query এর অংশগুলো কীভাবে একসাথে কাজ করে,
                Tutorial এর ভাষায়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-overview.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Sorting Rows (ORDER BY)</strong>, এখানেই লেখা, ORDER BY তে Output
                Column এর নাম একা দাঁড়াতে হবে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-order.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-order.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Problems with Column Aliases, MySQL 8.4</strong>, MySQL কোথায় Alias
                মানে আর কেন WHERE এ মানে না।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/problems-with-alias.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/problems-with-alias.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Using EXPLAIN</strong>, Planner এর পথ পড়ার পুরো গাইড। এখন শুধু
                প্রথম কয়েকটা অনুচ্ছেদ, বাকিটা Module 13 এ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/using-explain.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/using-explain.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনি যে MySQL কোর্সটা দেখছেন</strong>, তার SELECT, WHERE, ORDER BY আর
                GROUP BY এর অংশগুলো (প্রায় 01:13:04 থেকে 01:47:18) এই লেসনের ক্রম মাথায় রেখে
                আবার দেখুন। যেখানে HAVING এ Alias দেখবেন, PostgreSQL এ হিসাবটা পুরো লিখবেন।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
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
      title: <SectionTitle>পাঁচ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা SELECT Query লেখা হয় এক ক্রমে, চলে আরেক ক্রমে। চলার ক্রম: FROM, WHERE,
                GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT। প্রতিটা ধাপ আগের ধাপের
                ফলাফল নিয়ে কাজ করে, আর শুধু সেটাই দেখে যা আগের ধাপগুলো বানিয়ে দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                এই একটা নিয়ম থেকে আসে সব: Alias এর জন্ম SELECT এ, তাই WHERE আর HAVING তাকে
                চেনে না, ORDER BY চেনে। WHERE চলে দল বানানোর আগে, তাই WHERE এ count() চলে
                না। DISTINCT চলে ORDER BY এর আগে, তাই DISTINCT এর পরে না দেখানো Column দিয়ে
                সাজানো যায় না। LIMIT চলে সবার শেষে, তাই আগে সাজিয়ে তারপর কাটা হয়, আর ORDER
                BY ছাড়া LIMIT কোনো নির্দিষ্ট Row কথা দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                দুটো ব্যতিক্রম: GROUP BY তে Alias চলে, PostgreSQL আর MySQL দুই জায়গায়। আর
                MySQL HAVING এ, এমনকি ORDER BY এর হিসাবের ভেতরেও Alias মেনে নেয়, PostgreSQL
                নেয় না। নিরাপদ অভ্যাস: WHERE আর HAVING এ হিসাবটা পুরো লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                পরের লেসন{" "}
                <Link href="/sql/topic/where-filters" className={LINK}>
                  WHERE with AND, OR, NOT
                </Link>{" "}
                এ আপনি দুই নম্বর ধাপটার ভেতরে ঢুকবেন: তুলনার সব চিহ্ন, তারিখ আর লেখার তুলনা,
                আর AND আর OR একসাথে লিখলে কোনটা আগে খাটে। ধাপটা কোথায় বসে সেটা এখন আপনি জানেন,
                এবার জানবেন সে ঠিক কী কী পারে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "মনে রাখার চিহ্ন"],
    rows: [
      ["লেখার ক্রম", "SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT", "ভুল ক্রমে লিখলে syntax error"],
      ["চলার ক্রম", "FROM, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT", "রাঁধুনি ভাঁড়ার থেকে শুরু করেন"],
      ["FROM", "প্রথম ধাপ, Table আর JOIN সব এখানে", "SELECT * FROM tours, নয়টা Row"],
      ["WHERE", "একটা একটা Row ছাঁকে, দল বানানোর আগে", "মূল Column চেনে, Alias চেনে না"],
      ["GROUP BY, HAVING", "দল বাঁধা, তারপর দল ছাঁকা", "count(*) এর জায়গা HAVING"],
      ["SELECT", "Column বাছে, হিসাব করে, Alias এর জন্ম দেয়", "পাঁচ নম্বর ধাপ"],
      ["DISTINCT", "SELECT এর পরে একই রকম Row মোছে", "তারপর না দেখানো Column দিয়ে সাজানো যায় না"],
      ["ORDER BY", "Alias চেনা প্রথম ধাপ, না দেখানো Column দিয়েও সাজায়", "PostgreSQL এ Alias একা দাঁড়াতে হবে"],
      ["LIMIT", "সবার শেষে, সাজানোর পরে কাটে", "ORDER BY ছাড়া কোনো কথা দেয় না"],
      ["Alias এর নিয়ম", "WHERE না, GROUP BY হ্যাঁ, HAVING শুধু MySQL এ, ORDER BY হ্যাঁ", "নিরাপদ: হিসাবটা পুরো লিখুন"],
      ["Logical বনাম Physical", "Planner অন্য পথে চালাতে পারে, ফলাফল একই", "EXPLAIN, Module 13"],
      ["লেখার পদ্ধতি", "FROM থেকে শুরু করে এক ধাপ করে বাড়ানো", "প্রতিটা ধাপে চালিয়ে দেখা"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা SELECT Query চলার সময় কোন Clause এর কাজ সবার আগে হয়?",
        options: [
          {
            key: "A",
            text: "SELECT, কারণ সেটা সবার আগে লেখা হয়",
            isCorrect: false,
            explanation: "লেখার ক্রমে SELECT প্রথম, কিন্তু চলার ক্রমে সে পাঁচ নম্বরে। এই লেসনের মূল কথাই এটা।",
          },
          {
            key: "B",
            text: "FROM",
            isCorrect: true,
            explanation: "ঠিক। আগে ঠিক হয় Data কোথা থেকে আসবে। বাকি সব ধাপ FROM এর আনা Table এর উপর কাজ করে।",
          },
          {
            key: "C",
            text: "WHERE",
            isCorrect: false,
            explanation: "WHERE দুই নম্বরে। ছাঁকার আগে ছাঁকার মতো Row হাতে থাকতে হবে, যেটা আনে FROM।",
          },
          {
            key: "D",
            text: "ORDER BY",
            isCorrect: false,
            explanation: "ORDER BY প্রায় শেষে, সাত নম্বরে। সাজানোর আগে ঠিক হতে হয় কোন Row থাকবে আর কোন Column দেখাবে।",
          },
        ],
      },
      {
        id: 2,
        text: "SELECT title, price_bdt * 2 AS for_two FROM tours WHERE for_two > 20000; চালালে column \"for_two\" does not exist আসে। কেন?",
        options: [
          {
            key: "A",
            text: "for_two এর বানান ভুল",
            isCorrect: false,
            explanation: "বানান ঠিক আছে। একই নাম ORDER BY তে দিলে দিব্যি চলে।",
          },
          {
            key: "B",
            text: "AS দিয়ে দেওয়া নাম PostgreSQL কোথাও ব্যবহার করতে দেয় না",
            isCorrect: false,
            explanation: "দেয়, ORDER BY আর GROUP BY তে। সমস্যাটা নামের না, জায়গার।",
          },
          {
            key: "C",
            text: "WHERE চলে SELECT এর আগে, তখনো for_two নামের জন্ম হয়নি",
            isCorrect: true,
            explanation: "ঠিক। WHERE দুই নম্বর ধাপ, Alias এর জন্ম পাঁচ নম্বরে। WHERE এ হিসাবটা পুরো লিখতে হয়: price_bdt * 2 > 20000।",
          },
          {
            key: "D",
            text: "numeric Column কে 2 দিয়ে গুণ করা যায় না",
            isCorrect: false,
            explanation: "যায়। SELECT এ ঠিক এই গুণটাই 25000.00, 36000.00 এর মতো মান দেয়।",
          },
        ],
      },
      {
        id: 3,
        text: "নিচের কোনটা PostgreSQL এ Error ছাড়া চলবে?",
        options: [
          {
            key: "A",
            text: "SELECT price_bdt * 2 AS for_two FROM tours ORDER BY for_two;",
            isCorrect: true,
            explanation: "ঠিক। ORDER BY চলে SELECT এর পরে, আর নামটা একা দাঁড়িয়ে আছে, তাই চেনা যায়।",
          },
          {
            key: "B",
            text: "SELECT price_bdt * 2 AS for_two FROM tours ORDER BY for_two + 1;",
            isCorrect: false,
            explanation: "PostgreSQL ORDER BY তে Alias শুধু একা দাঁড়ালে চেনে। হিসাবের ভেতরে থাকলে সে মূল Column খোঁজে, আর পায় না। MySQL এটা চালিয়ে দেয়।",
          },
          {
            key: "C",
            text: "SELECT status, count(*) AS n FROM bookings GROUP BY status HAVING n > 3;",
            isCorrect: false,
            explanation: "PostgreSQL এ HAVING Alias চেনে না, কারণ HAVING চলে SELECT এর আগে। MySQL এ এটা চলে, এখানেই অনেকে আটকে যান।",
          },
          {
            key: "D",
            text: "SELECT title, price_bdt * 2 AS for_two FROM tours WHERE for_two > 1000;",
            isCorrect: false,
            explanation: "WHERE এ Alias, তাই column \"for_two\" does not exist।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT title FROM tours LIMIT 3; Query টা কী কথা দেয়?",
        options: [
          {
            key: "A",
            text: "সবচেয়ে প্রথমে যোগ হওয়া তিনটা ট্যুর আসবে",
            isCorrect: false,
            explanation: "ORDER BY ছাড়া কোনো ক্রমের কথা নেই। আজ হয়তো তাই আসছে, কিন্তু সেটা কাকতালীয়।",
          },
          {
            key: "B",
            text: "সবচেয়ে সস্তা তিনটা ট্যুর আসবে",
            isCorrect: false,
            explanation: "দামের কথা Query তে কোথাও নেই। সস্তা তিনটা চাইলে ORDER BY price_bdt লাগবে।",
          },
          {
            key: "C",
            text: "যেকোনো তিনটা ট্যুর আসবে, কোনগুলো আসবে তার কোনো নিশ্চয়তা নেই",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এর Docs বলে, ORDER BY না দিলে Row আসে যে ক্রমে Database এর জন্য সবচেয়ে দ্রুত। LIMIT থাকলে ORDER BY রাখুন।",
          },
          {
            key: "D",
            text: "Error আসবে, কারণ LIMIT এর সাথে ORDER BY বাধ্যতামূলক",
            isCorrect: false,
            explanation: "বাধ্যতামূলক না, Query দিব্যি চলে। বিপদটা এখানেই: কোনো Error নেই, তাই ভুলটা চোখে পড়ে না।",
          },
        ],
      },
      {
        id: 5,
        text: "WHERE আর HAVING এর আসল পার্থক্য কোনটা?",
        options: [
          {
            key: "A",
            text: "WHERE লেখা চলে শুধু সংখ্যার Column এ, HAVING লেখার Column এ",
            isCorrect: false,
            explanation: "দুটোই যেকোনো ধরনের Column এ চলে। পার্থক্যটা কোন ধাপে চলে তাতে।",
          },
          {
            key: "B",
            text: "WHERE চলে দল বানানোর আগে, একটা একটা Row ছাঁকে, HAVING চলে দল বানানোর পরে, দল ছাঁকে",
            isCorrect: true,
            explanation: "ঠিক। তাই WHERE এ count() চলে না, HAVING এ চলে।",
          },
          {
            key: "C",
            text: "HAVING হলো WHERE এর নতুন নাম, দুটো একই কাজ করে",
            isCorrect: false,
            explanation: "একই কাজ না। একই Query তে দুটো একসাথে থাকতে পারে, যেমন এই লেসনের seats >= 2 আর count(*) > 2 এর উদাহরণে।",
          },
          {
            key: "D",
            text: "HAVING চলে ORDER BY এর পরে",
            isCorrect: false,
            explanation: "HAVING চার নম্বরে, SELECT এর আগে। এই কারণেই PostgreSQL এ HAVING Alias চেনে না।",
          },
        ],
      },
      {
        id: 6,
        text: "MySQL এর একটা ভিডিওতে HAVING total > 50000 লেখা, যেখানে total একটা Alias। PostgreSQL এ একই কাজের সবচেয়ে ভালো লেখা কোনটা?",
        options: [
          {
            key: "A",
            text: "হুবহু একই লাইন, PostgreSQL ও এটা মানে",
            isCorrect: false,
            explanation: "মানে না। column \"total\" does not exist আসবে।",
          },
          {
            key: "B",
            text: "HAVING এর বদলে WHERE total > 50000",
            isCorrect: false,
            explanation: "WHERE তো আরও আগে চলে, সেখানেও Alias নেই, আর দলের হিসাব WHERE এ চলেই না।",
          },
          {
            key: "C",
            text: "HAVING এ হিসাবটা পুরো লেখা, যেমন HAVING sum(total_bdt) > 50000",
            isCorrect: true,
            explanation: "ঠিক। এটা PostgreSQL, MySQL আর অন্য সব Database এ একইভাবে চলে।",
          },
          {
            key: "D",
            text: "ORDER BY তে total দিয়ে সাজিয়ে প্রথম কয়েকটা নেওয়া",
            isCorrect: false,
            explanation: "সাজানো আর ছাঁকা আলাদা কাজ। এতে পঞ্চাশ হাজারের কম আয়ের দলও থেকে যেতে পারে।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT DISTINCT region FROM destinations ORDER BY kind; কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "destinations Table এ kind নামে কোনো Column নেই",
            isCorrect: false,
            explanation: "আছে। DISTINCT ছাড়া ORDER BY kind দিব্যি চলে।",
          },
          {
            key: "B",
            text: "DISTINCT চলে ORDER BY এর আগে, কয়েকটা Row এক হয়ে যাওয়ার পর kind এর একটা নির্দিষ্ট মান আর থাকে না",
            isCorrect: true,
            explanation: "ঠিক। Chattogram এর কয়েকটা destination এক Row হয়ে গেলে তার kind island না hills, কেউ বলতে পারে না। সমাধান: যা দিয়ে সাজাবেন, সেটা SELECT এ রাখুন।",
          },
          {
            key: "C",
            text: "DISTINCT আর ORDER BY একসাথে কখনো লেখা যায় না",
            isCorrect: false,
            explanation: "যায়। SELECT DISTINCT region FROM destinations ORDER BY region; চার Row দেয়, Error ছাড়া।",
          },
          {
            key: "D",
            text: "region লেখার Column, লেখার Column এ DISTINCT চলে না",
            isCorrect: false,
            explanation: "যেকোনো ধরনের Column এ DISTINCT চলে। সমস্যাটা ক্রমের।",
          },
        ],
      },
      {
        id: 8,
        text: "EXPLAIN এ দেখা গেল PostgreSQL Table পড়তে পড়তেই is_active এর শর্ত যাচাই করছে। তাহলে Logical Order এর ধাপগুলো কি মিথ্যা?",
        options: [
          {
            key: "A",
            text: "হ্যাঁ, Database আসলে কোনো ক্রম মানে না",
            isCorrect: false,
            explanation: "মানে। ফলাফল সবসময় Logical Order মেনে চললে যা হতো, ঠিক তাই হয়।",
          },
          {
            key: "B",
            text: "না, Logical Order বলে ফলাফল কী হবে, Planner সেই ফলাফলে পৌঁছানোর সবচেয়ে কম খরচের পথ বেছে নেয়",
            isCorrect: true,
            explanation: "ঠিক। ভেতরের পথ (Physical Order) আলাদা হতে পারে, কিন্তু উত্তর একই। Query লেখা আর Error বোঝার জন্য Logical Order ই আপনার মানচিত্র।",
          },
          {
            key: "C",
            text: "না, EXPLAIN সবসময় ভুল দেখায়",
            isCorrect: false,
            explanation: "EXPLAIN Planner এর আসল পরিকল্পনাই দেখায়। সেটাই Module 13 এর মূল Tool।",
          },
          {
            key: "D",
            text: "হ্যাঁ, তাই WHERE এ Alias আসলে চলা উচিত",
            isCorrect: false,
            explanation: "নামের নিয়ম আসে Logical Order থেকে, ভেতরের পথ থেকে না। WHERE এ Alias তাই কখনো চলবে না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: চলার ক্রম নিজের হাতে",
    time: "৪৫-৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>মুখস্থ থেকে আঁকুন:</strong> খাতায় আটটা ধাপ চলার ক্রমে লিখুন। প্রতিটার
        পাশে এক লাইনে লিখুন সে কী করে আর তার হাতে কী থাকে। তারপর এই লেসনের টেবিলের সাথে
        মিলিয়ে নিন।
      </span>,
      <span key="2">
        <strong>ধাপ ধরে গুনুন:</strong> SELECT title, price_bdt * 2 AS for_two FROM tours
        WHERE is_active ORDER BY for_two DESC LIMIT 3; এই Query এর প্রতিটা ধাপের পরে কয়টা
        Row থাকবে, আগে আন্দাজ করে লিখুন। তারপর Query টা টুকরো টুকরো করে চালান (শুধু
        FROM, তারপর WHERE যোগ করে, এভাবে) আর আন্দাজ মিলিয়ে দেখুন।
      </span>,
      <span key="3">
        <strong>তিনটা ভাঙা Query সারান:</strong> নিজের island_tours এ এই তিনটা চালান, Error
        টা লিখে রাখুন, তারপর ঠিক করুন: (ক) WHERE এ for_two, (খ) HAVING এ count এর Alias,
        (গ) SELECT DISTINCT region ... ORDER BY kind। প্রতিটার পাশে লিখুন কোন ধাপের কারণে
        Error হলো।
      </span>,
      <span key="4">
        <strong>MySQL থেকে PostgreSQL:</strong> আপনি যে MySQL কোর্সটা দেখছেন, তার GROUP BY
        আর HAVING এর অংশ থেকে দুটো Query নিন। যেখানে HAVING বা ORDER BY এর হিসাবে Alias
        আছে, সেগুলো এমনভাবে লিখুন যাতে PostgreSQL আর MySQL দুই জায়গায় চলে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধুকে ছয় লাইনে বোঝান কেন WHERE
        এ Alias চলে না অথচ ORDER BY তে চলে। রেস্তোরাঁর রাঁধুনির উদাহরণ ব্যবহার করুন, আর
        শেষ লাইনে নিরাপদ অভ্যাসটা লিখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">আটটা ধাপের নিজের হাতে লেখা তালিকা</span>,
      <span key="d2">প্রতিটা ধাপের আন্দাজ করা আর আসল Row সংখ্যার টেবিল</span>,
      <span key="d3">তিনটা Error এর লেখা আর সারানো তিনটা Query</span>,
      <span key="d4">দুই Database এ চলে এমন করে লেখা দুটো Query</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "চলার ক্রমের Drill",
    subtitle: "নিজের মেশিনের island_tours এ, psql দিয়ে",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম দুই ধাপ আলাদা করে দেখুন",
        description:
          "Module 02 এ Load করা island_tours এ psql দিয়ে ঢুকুন (psql -d island_tours, Docker এ docker exec -it island-pg psql -U postgres -d island_tours)। প্রথম Drill চালিয়ে FROM আর WHERE এর পরে Row সংখ্যা মিলিয়ে নিন।",
      },
      {
        title: "Alias এর Error নিজের চোখে",
        description:
          "দ্বিতীয় Drill এ WHERE এ Alias দিয়ে Error দেখুন, তারপর হিসাবটা পুরো লিখে পাঁচটা Row পান।",
      },
      {
        title: "ORDER BY আর LIMIT",
        description:
          "তৃতীয় Drill এ Alias দিয়ে সাজান, আর এমন Column দিয়ে সাজান যেটা দেখানো হচ্ছে না। প্রতিবার Row সংখ্যা মিলিয়ে নিন।",
      },
      {
        title: "দল আর দলের চালনি",
        description:
          "চতুর্থ Drill এ WHERE আর HAVING একসাথে চালান, তারপর HAVING এ Alias দিয়ে PostgreSQL এর Error দেখুন।",
      },
      {
        title: "DISTINCT আর ORDER BY",
        description: "পঞ্চম Drill এ Error টা দেখুন আর দুইভাবে সারান।",
      },
      {
        title: "Planner এর পথ",
        description:
          "ষষ্ঠ Drill এ EXPLAIN চালিয়ে Plan টা নিচ থেকে উপরে পড়ুন। cost আর rows এর সংখ্যা আপনার মেশিনে আলাদা হবে, সেটা স্বাভাবিক।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-from-where.sql",
        code: `-- ধাপ ১: FROM, পুরো Table
SELECT * FROM tours;
-- (9 rows)

-- ধাপ ২: WHERE, বন্ধ ট্যুর বাদ
SELECT title FROM tours WHERE is_active;
-- (8 rows)`,
      },
      {
        language: "sql",
        filename: "02-alias-in-where.sql",
        code: `SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE for_two > 20000;
-- ERROR:  column "for_two" does not exist

SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE price_bdt * 2 > 20000;
-- (5 rows)`,
      },
      {
        language: "sql",
        filename: "03-order-limit.sql",
        code: `SELECT title, price_bdt * 2 AS for_two
FROM tours
WHERE is_active
ORDER BY for_two DESC
LIMIT 3;
-- (3 rows): Sundarbans Mangrove Cruise 36000.00, Cox's Bazar Family Package 31000.00, Bandarban Hill Trek 28000.00

SELECT title
FROM tours
ORDER BY price_bdt DESC
LIMIT 2;
-- (2 rows): Saint Martin Luxury Stay, Sundarbans Mangrove Cruise`,
      },
      {
        language: "sql",
        filename: "04-where-having.sql",
        code: `SELECT status, count(*) AS bookings
FROM bookings
WHERE seats >= 2
GROUP BY status
HAVING count(*) > 2
ORDER BY bookings DESC;
-- (2 rows): confirmed 13, pending 4

SELECT status, count(*) AS n
FROM bookings
GROUP BY status
HAVING n > 3;
-- ERROR:  column "n" does not exist   (MySQL এ এটাই চলে)`,
      },
      {
        language: "sql",
        filename: "05-distinct-order.sql",
        code: `SELECT DISTINCT region FROM destinations ORDER BY kind;
-- ERROR:  for SELECT DISTINCT, ORDER BY expressions must appear in select list

SELECT DISTINCT region FROM destinations ORDER BY region;
-- (4 rows): Barishal, Chattogram, Khulna, Sylhet

SELECT DISTINCT region, kind FROM destinations ORDER BY kind;
-- (6 rows)`,
      },
      {
        language: "sql",
        filename: "06-explain.sql",
        code: `EXPLAIN
SELECT title
FROM tours
WHERE is_active
ORDER BY price_bdt
LIMIT 3;
-- নিচ থেকে উপরে পড়ুন:
--   Seq Scan on tours, Filter: is_active   (FROM আর WHERE)
--   Sort, Sort Key: price_bdt              (ORDER BY)
--   Limit                                  (LIMIT)
-- cost আর rows এর সংখ্যা আপনার মেশিনে আলাদা হবে`,
      },
    ],
    tip: (
      <>
        Drill গুলো চালানোর সময় psql এ \set ON_ERROR_STOP on দেবেন না, কারণ এখানে কিছু
        Error ইচ্ছা করেই রাখা আছে। Error এলে psql পরের Statement এ চলে যায়, আপনি একটা
        ফাইলেই সব ফলাফল দেখতে পাবেন: psql -d island_tours -f 02-alias-in-where.sql
      </>
    ),
  },
};
