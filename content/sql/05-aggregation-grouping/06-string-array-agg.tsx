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
  ListAggLab,
  PredictListLab,
} from "../../../components/course/topics/aggregation/listagg-animations";
import {
  AggOrderDiagram,
  ManyRowsOneLineDiagram,
  ModuleFiveStoryDiagram,
  StringVsArraySplit,
} from "../../../components/course/topics/aggregation/listagg-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const stringArrayAggContent: TopicData = {
  id: "string-array-agg",
  introduction: {
    badge: "MODULE 05 · LESSON 06",
    title: <SectionTitle>একটা দলের সবগুলো মান, এক লাইনে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের আগের লেসনগুলোতে আপনি অনেক Row থেকে একটা সংখ্যা বের করেছেন: কতগুলো Booking, মোট কত
          টাকা, গড়ে কয়টা সিট। প্রতিটা দলের জন্য একটা করে সংখ্যা। কিন্তু অনেক সময় সংখ্যাটা যথেষ্ট না। Customer
          Care এর কেউ যখন জানতে চান একজন Customer এর তিনটা Booking কোনগুলো, তখন উত্তর 3 না, উত্তর হলো 1, 8 আর
          17।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি এমন দুটো Aggregate Function শিখবেন যেগুলো একটা দলের সবগুলো মান একসাথে ফেরত দেয়।
          string_agg মানগুলো জুড়ে একটা লেখা বানায়, যেমন &apos;1, 8, 17&apos;, যেটা মানুষ পড়বে। array_agg
          বানায় একটা তালিকা, যেমন {"{1,8,17}"}, যার প্রতিটা ঘর আলাদা থাকে, তাই পরে Code বা SQL আবার কাজে
          লাগাতে পারে।
        </ContentParagraph>
        <ContentParagraph>
          সাথে থাকবে তালিকার ভেতরের ক্রম ঠিক করা, একই মান বারবার না দেখানো, NULL এর সাথে দুই Function এর
          আলাদা আচরণ, FILTER দিয়ে একই Query তে কয়েকটা তালিকা, JSON এর একটা ছোট ঝলক, আর MySQL এর
          GROUP_CONCAT, যেটা একটা নীরব ফাঁদ নিয়ে আসে। লেসনের শেষে পুরো Module 05 এর সারাংশ, আর একটা Report
          যেটা এই মডিউলের সবকিছু এক Query তে মেলায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে একটা দলের সবগুলো মান দিন, আর বলে দিন মাঝে কী বসাব। আমি সেগুলো এক লাইনে সাজিয়ে দেব, যে ক্রমে চান সেই ক্রমে। শুধু ক্রমটা নিজে বলে দেবেন, নইলে আমি কথা দিতে পারি না।",
      author: "string_agg",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একজন Customer, তিনটা Booking, একটা লাইন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026। Island Tours এর Customer Care এর দায়িত্বে আছেন নাসরিন। শীতের
                মৌসুম শুরু, তাই তিনি প্রতিদিন সকালে একটা তালিকা ধরে Customer দের ফোন করেন, তাঁদের সামনের ট্যুরের
                খবর দেন। আজ সকালে Manager ফারুক তাঁকে একটা নতুন Sheet চেয়েছেন: প্রতিটা Customer এর জন্য ঠিক
                একটা লাইন, আর সেই লাইনে তাঁর সবগুলো Booking এর নম্বর।
              </ContentParagraph>
              <ContentParagraph>
                নাসরিন প্রথমে bookings Table থেকে সোজা একটা SELECT চালালেন। ফল এল একটা Booking এর জন্য একটা
                Row। Rahim Uddin এর তিনটা Booking, তাই তাঁর নাম তিনটা লাইনে। চোদ্দজন Customer এর চব্বিশটা
                Booking, চব্বিশটা লাইন। ফোনের তালিকা হিসেবে এটা অস্বস্তিকর, কারণ একই মানুষকে তিনবার খুঁজতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                তিনি এই মডিউলে যা শিখেছেন সেটা কাজে লাগালেন: GROUP BY customer_id, সাথে COUNT(*)। এবার ঠিক
                একটা লাইন প্রতি Customer। কিন্তু লাইনে লেখা শুধু 3। কোন তিনটা Booking, সেটা হারিয়ে গেছে। আর
                SELECT এ booking_id লিখতে গেলেই PostgreSQL সেই চেনা Error টা দেয়: booking_id কে হয় GROUP BY তে
                থাকতে হবে, নয়তো একটা Aggregate Function এর ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                ঠিক এই জায়গাটার জন্যই string_agg। এটা একটা Aggregate Function, COUNT এর মতোই একটা দলের সবগুলো
                Row দেখে, কিন্তু গুনে একটা সংখ্যা ফেরত না দিয়ে মানগুলো জুড়ে একটা লেখা ফেরত দেয়। নিচের বক্সে তিনটা
                Query পরপর আছে: প্রথমটা Row ধরে ধরে, দ্বিতীয়টা শুধু গোনা, তৃতীয়টা তালিকা। Run চাপুন আর তিনটা
                ফলাফল পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Row ধরে, গুনে, আর তালিকা করে"
              query={`SELECT customer_id, booking_id, status
FROM bookings
WHERE customer_id = 1
ORDER BY booking_id;

SELECT customer_id, count(*) AS bookings
FROM bookings
WHERE customer_id = 1
GROUP BY customer_id;

SELECT customer_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id) AS booking_ids
FROM bookings
WHERE customer_id = 1
GROUP BY customer_id;`}
              caption="প্রথম Query তে তিনটা Row: 1, 8 আর 17। দ্বিতীয়টায় একটা Row, শুধু 3। তৃতীয়টায় একটা Row, আর তাতে '1, 8, 17'। এক দল, এক লাইন, কিন্তু কিছুই হারায়নি। WHERE customer_id = 1 মুছে Run চাপুন: চোদ্দজন Customer, চোদ্দটা লাইন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসন শেষে আপনি নাসরিনের পুরো Sheet টা নিজে বানাতে পারবেন, তালিকার ভেতরের ক্রম যেমন চান তেমন
              করে, একই মান বারবার না দেখিয়ে, ফাঁকা ঘরগুলো সামলে, আর দরকার হলে লেখার বদলে একটা আসল তালিকা হিসেবে,
              যেটা একজন Developer তাঁর Code এ সরাসরি ব্যবহার করতে পারেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "many-rows-one-line",
      subHeader: { index: "002", title: "Many Rows, One Line" },
      title: <SectionTitle>তালিকাও একটা Aggregate</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 থেকে আপনি জানেন Aggregate Function কী করে: একটা দলের সবগুলো Row নেয়, আর একটা মান
                ফেরত দেয়। COUNT ফেরত দেয় কয়টা Row, SUM যোগফল, MAX সবচেয়ে বড়টা। প্রতিটা ক্ষেত্রে অনেক মান ঢোকে,
                একটা মান বের হয়।
              </ContentParagraph>
              <ContentParagraph>
                string_agg আর array_agg ঠিক এই নিয়মেই চলে। পার্থক্য শুধু বের হওয়া মানটার চেহারায়। একটা দোকানের
                হিসাবের খাতা ভাবুন। দিনের শেষে দোকানদার তিনভাবে হিসাব মেলাতে পারেন। কতগুলো রশিদ কাটা হলো, সেটা
                COUNT। মোট কত টাকা এল, সেটা SUM। আর সব রশিদের নম্বর এক লাইনে লিখে রাখা, যাতে পরে কেউ চাইলে একটা
                একটা করে খুঁজে বের করা যায়, সেটা string_agg। তিনটাই সেই একই দিনের রশিদ থেকে, শুধু প্রশ্ন আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ManyRowsOneLineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ছবির ডান দিকের তিনটা বাক্স খেয়াল করুন। তিনটা উত্তরই একটা করে মান, তাই তিনটাই GROUP BY এর নিয়ম
                মেনে চলে: SELECT এর প্রতিটা Column হয় দল বাঁধার Column, নয়তো একটা Aggregate। booking_id কে সরাসরি
                লিখলে Error, কারণ এক দলে তিনটা booking_id, PostgreSQL কোনটা দেখাবে জানে না। কিন্তু string_agg এর
                ভেতরে লিখলে কোনো সমস্যা নেই, কারণ তখন তিনটাই একসাথে একটা মানে পরিণত হচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের দুটো নতুন নাম তাই এক বাক্যে মনে রাখার মতো: string_agg একটা দলের মান জুড়ে একটা লেখা
                বানায়, array_agg একটা দলের মান দিয়ে একটা Array বানায়। Array মানে একটা মানের ভেতরে কয়েকটা মান,
                সারি করে রাখা, প্রতিটার নিজের নম্বর। Array নিয়ে বিস্তারিত Section 008 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক দল ঢোকে, এক মান বের হয়",
          content: (
            <ContentParagraph>
              Aggregate মানেই অনেক Row থেকে একটা মান। সেই মান একটা সংখ্যা হতে পারে, একটা তারিখ হতে পারে, একটা
              লেখা হতে পারে, এমনকি একটা পুরো তালিকাও হতে পারে। string_agg আর array_agg কোনো আলাদা জাতের জিনিস না,
              COUNT আর SUM এর মতোই Aggregate, শুধু তাদের ফেরত দেওয়া মানটা একটু বড়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "string-agg",
      subHeader: { index: "003", title: "string_agg" },
      title: <SectionTitle>string_agg: মান, মাঝের চিহ্ন, আর ক্রম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                string_agg এর পুরো চেহারাটা এরকম:{" "}
                <code className={CODE}>string_agg(মান, মাঝের_চিহ্ন ORDER BY কিছু)</code>। তিনটা অংশ। প্রথমটা কী
                জুড়বেন, যেমন full_name বা booking_id। দ্বিতীয়টা দুটো মানের মাঝে কী বসবে, এই চিহ্নটাকে বলে
                Separator বা Delimiter, যেমন <code className={CODE}>&apos;, &apos;</code>। তৃতীয়টা ঐচ্ছিক, কিন্তু
                প্রায় সবসময় দরকার: তালিকার ভেতরে মানগুলো কোন ক্রমে বসবে। ক্রমের পুরো গল্পটা পরের Section এ, আপাতত
                শুধু মনে রাখুন, ORDER BY বসে Separator এর পরে, Parenthesis বন্ধ হওয়ার আগে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম উদাহরণ customers Table থেকে। প্রতিটা শহরের জন্য একটা লাইন, আর সেই লাইনে সেই শহরের সব
                Customer এর নাম, বর্ণমালার ক্রমে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা শহরে কারা থাকেন"
              query={`SELECT city,
       count(*) AS customers,
       string_agg(full_name, ', ' ORDER BY full_name) AS names
FROM customers
GROUP BY city
ORDER BY city;`}
              caption="৯টা শহর, ৯টা লাইন। Dhaka র লাইনে ছয়জনের নাম: Imran Kabir, Mitu Rahman, Nusrat Jahan, Rahim Uddin, Shuvo Das, Sumaiya Islam। count(*) আর string_agg একই দলের দুটো আলাদা উত্তর, পাশাপাশি থাকতে কোনো বাধা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার booking_id দিয়ে চেষ্টা করুন। string_agg এর নামেই আছে string, মানে লেখা। এটা শুধু লেখা জোড়ে।
                booking_id একটা integer। PostgreSQL নিজে থেকে integer কে লেখায় বদলে নেয় না, তাই এমন কোনো
                string_agg খুঁজে পায় না যেটা integer নেয়, আর Error দেয়।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান Module 04 এর Casting: <code className={CODE}>booking_id::text</code>। আরেকটা উপায় হলো
                সংখ্যাটাকে অন্য লেখার সাথে || দিয়ে জোড়া, যেমন{" "}
                <code className={CODE}>booking_id || &apos;:&apos; || status</code>। || এর একপাশে লেখা থাকলে
                PostgreSQL অন্য পাশের সংখ্যাটাকে নিজেই লেখা বানিয়ে নেয়, তাই ফলটা একটা text, আর string_agg সেটা নিতে
                পারে। নিচের বক্সে আগে দুটো ঠিক Query, শেষে ভুলটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সংখ্যা জুড়তে হলে আগে লেখা"
              query={`SELECT customer_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id) AS ids
FROM bookings
GROUP BY customer_id
ORDER BY customer_id
LIMIT 3;

SELECT customer_id,
       string_agg(booking_id || ':' || status, ', ' ORDER BY booking_id) AS history
FROM bookings
GROUP BY customer_id
ORDER BY customer_id
LIMIT 3;

SELECT customer_id, string_agg(booking_id, ', ')
FROM bookings
GROUP BY customer_id;`}
              caption="প্রথম দুটো চলে: '1, 8, 17' আর '1:confirmed, 8:confirmed, 17:pending'। তৃতীয়টা থামে: function string_agg(integer, unknown) does not exist, সাথে HINT যে হয়তো Type Cast লাগবে। unknown লেখা কারণ ', ' এর Type তখনো ঠিক হয়নি। Error টা পড়ে চেনা জরুরি, কারণ প্রথমবার প্রায় সবাই এটা পান।"
            />
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
                  Guide দের ভাষা অনুযায়ী দল বাঁধুন: guides Table থেকে প্রতিটা{" "}
                  <code className={CODE}>language</code> আর সেই ভাষার সব Guide এর{" "}
                  <code className={CODE}>full_name</code>, কমা আর একটা Space দিয়ে জোড়া, নামের বর্ণমালার ক্রমে।
                  দুটো Column, ভাষার বর্ণমালার ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  উপরের শহরের Query টাই, শুধু Table guides আর দল language। তালিকার ভেতরের ক্রমের জন্য{" "}
                  <code className={CODE}>ORDER BY full_name</code> বসবে Separator এর পরে, Parenthesis এর ভেতরে।
                </>
              }
              solution={`SELECT language,
       string_agg(full_name, ', ' ORDER BY full_name) AS guides
FROM guides
GROUP BY language
ORDER BY language;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "order-inside",
      subHeader: { index: "004", title: "Order Inside" },
      title: <SectionTitle>তালিকার ভেতরের ক্রম কেউ কথা দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ আপনি শিখেছিলেন, ORDER BY না লিখলে Row গুলো কোন ক্রমে আসবে তার কোনো নিশ্চয়তা নেই।
                তালিকার ভেতরেও ঠিক একই নিয়ম। string_agg এর ভেতরে ORDER BY না লিখলে PostgreSQL মানগুলো যে ক্রমে
                হাতে পায় সেই ক্রমে জোড়ে, আর সেই ক্রম Data কীভাবে রাখা আছে, Planner কোন পথে চলল, এমন অনেক কিছুর
                উপর নির্ভর করে। PostgreSQL এর Docs সোজাসুজি বলে, এই ক্রম unspecified, মানে নির্দিষ্ট না।
              </ContentParagraph>
              <ContentParagraph>
                ছোট Data তে প্রায়ই মনে হয় ক্রম ঠিকই আছে, booking_id এর ক্রমেই আসছে। এটাই ফাঁদ। একদিন Table বড়
                হবে, একটা Index যোগ হবে, বা PostgreSQL এর Version বদলাবে, আর নাসরিনের Sheet এ 17 চলে আসবে 1 এর
                আগে, কোনো Error ছাড়া। তাই নিয়ম একটাই: ক্রম যদি গুরুত্বপূর্ণ হয়, ভেতরে ORDER BY লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                ভেতরের ORDER BY যেকোনো Column দিয়ে হতে পারে, তালিকায় যেটা দেখাচ্ছেন সেটা হওয়ার দরকার নেই।
                booking_id দেখিয়ে booked_at দিয়ে সাজানো যায়, যেমন নতুন Booking আগে। DESC, ASC, একাধিক Column,
                NULLS LAST, Module 03 এ ORDER BY এর যা যা শিখেছেন সবই এখানে চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই দল, তিন রকম ক্রম"
              query={`SELECT customer_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)     AS by_id,
       string_agg(booking_id::text, ', ' ORDER BY booked_at DESC) AS newest_first,
       string_agg(status, ', ' ORDER BY booked_at)                AS status_story
FROM bookings
WHERE customer_id IN (1, 4, 11)
GROUP BY customer_id
ORDER BY customer_id;`}
              caption="তিনজন Customer, একই Booking গুলো তিনভাবে। customer 1: by_id '1, 8, 17', newest_first '17, 8, 1'। customer 11 এর status_story 'cancelled, confirmed': প্রথম Booking টা বাতিল করেছিলেন, পরেরটা নিশ্চিত। শেষ Column টা দেখায় ভেতরের ORDER BY দিয়ে একটা গল্পও বলা যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AggOrderDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির মূল কথা: একটা Query তে দুটো ORDER BY থাকতে পারে, আর তারা দুটো আলাদা জিনিস সাজায়। ভেতরেরটা,
                Parenthesis এর মধ্যে, সাজায় প্রতিটা দলের তালিকার ভেতরের মান। বাইরেরটা, Query এর একদম শেষে, সাজায়
                ফলাফলের Row গুলো। একটা লিখলে আরেকটা নিজে থেকে হয়ে যায় না।
              </ContentParagraph>
              <ContentParagraph>
                ভেতরের ORDER BY এর জায়গাও নির্দিষ্ট। সেটা বসে সব সাধারণ Argument এর পরে, মানে Separator এর পরে।
                অনেকে প্রথমবার লেখেন <code className={CODE}>string_agg(booking_id::text ORDER BY booking_id, &apos;, &apos;)</code>,
                মানে মানের ঠিক পরে। PostgreSQL তখন ভাবে আপনি এক Argument এর একটা string_agg চাইছেন, যেটা নেই, আর
                Error এর সাথে একটা সাহায্যকারী HINT দেয়। নিচে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY ভুল জায়গায়"
              query={`SELECT string_agg(booking_id::text ORDER BY booking_id, ', ')
FROM bookings;`}
              caption="ERROR: function string_agg(text) does not exist, আর HINT: Perhaps you misplaced ORDER BY; ORDER BY must appear after all regular arguments of the aggregate। ঠিক করতে ORDER BY booking_id কে ', ' এর পরে সরিয়ে দিন, তারপর আবার Run চাপুন: ১ থেকে ২৪ পর্যন্ত সবগুলো নম্বর এক লাইনে।"
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
                  নাসরিন চান প্রতিটা Customer এর সবচেয়ে নতুন Booking আগে দেখতে। bookings থেকে প্রতিটা{" "}
                  <code className={CODE}>customer_id</code> আর তাঁর সব booking_id, কমা আর Space দিয়ে জোড়া,
                  booked_at অনুযায়ী নতুন থেকে পুরনো। দুটো Column, customer_id এর ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  তালিকায় booking_id, কিন্তু ভেতরের ক্রম booked_at দিয়ে:{" "}
                  <code className={CODE}>ORDER BY booked_at DESC</code>। booking_id কে লেখায় বদলাতে ভুলবেন না।
                </>
              }
              solution={`SELECT customer_id,
       string_agg(booking_id::text, ', ' ORDER BY booked_at DESC) AS newest_first
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "separators",
      subHeader: { index: "005", title: "Separators" },
      title: <SectionTitle>মাঝে কী বসবে, সেটাও একটা সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Separator যেকোনো লেখা হতে পারে। কমা আর Space সবচেয়ে চেনা, কিন্তু তারিখের তালিকায় একটা খাড়া দাগ
                অনেক পরিষ্কার দেখায়। Admin Screen এ প্রতিটা মান আলাদা লাইনে দেখাতে চাইলে Separator হতে পারে নতুন
                লাইনের চিহ্ন, যেটা PostgreSQL এ লেখা হয় <code className={CODE}>E&apos;\n&apos;</code>। E দিয়ে শুরু
                লেখার ভেতরে \n মানে নতুন লাইন। আর খালি লেখা <code className={CODE}>&apos;&apos;</code> দিলে মাঝে কিছুই
                বসে না, মানগুলো গায়ে গায়ে লেগে যায়।
              </ContentParagraph>
              <ContentParagraph>
                একটা জিনিস মাথায় রাখুন: Separator এমন হওয়া উচিত যেটা Data এর ভেতরে থাকে না। নামের তালিকায় কমা
                দিয়ে জুড়লে আর কারো নামের ভেতরেই কমা থাকলে, পরে কেউ তালিকাটা পড়ে বুঝতে পারবে না কোথায় একটা নাম
                শেষ আর পরেরটা শুরু। মানুষের চোখের জন্য এটা ছোট সমস্যা, কিন্তু কেউ যদি পরে লেখাটা কমা ধরে আবার
                ভাঙতে চান, তখন বড় সমস্যা। সেই কাজের জন্য আসলে array_agg ভালো, সেটা Section 008 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার রকম Separator"
              query={`SELECT tour_id,
       string_agg(starts_on::text, ' | ' ORDER BY starts_on) AS dates
FROM departures
GROUP BY tour_id
ORDER BY tour_id;

SELECT guide_id,
       string_agg(title, E'\\n' ORDER BY title) AS tours
FROM tours
WHERE guide_id IS NOT NULL
GROUP BY guide_id
ORDER BY guide_id;

SELECT string_agg(left(kind, 1), '' ORDER BY destination_id) AS initials
FROM destinations;`}
              caption="প্রথম Query তে ৮টা ট্যুরের তারিখ, খাড়া দাগে আলাদা: Tour 1 এর চারটা তারিখ এক লাইনে। দ্বিতীয়টায় প্রতিটা Guide এর ট্যুর আলাদা লাইনে, তাই একটা ঘরের ভেতরেই দুই লাইন। তৃতীয়টায় সাতটা Destination এর ধরনের প্রথম অক্ষর, মাঝে কিছু ছাড়া: ibfhhtb।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "starts_on::text কেন এমন দেখায়",
          content: (
            <ContentParagraph>
              date কে text এ বদলালে PostgreSQL ISO চেহারা দেয়, 2026-11-20। মানুষের পড়ার মতো চেহারা চাইলে
              Module 04 এর to_char কাজে লাগান:{" "}
              <code className={CODE}>string_agg(to_char(starts_on, &apos;DD Mon YYYY&apos;), &apos;, &apos; ORDER BY starts_on)</code>।
              খেয়াল করুন, ক্রমটা তখনো starts_on দিয়ে, লেখা দিয়ে না। লেখা দিয়ে সাজালে 04 Dec আগে চলে আসত 20 Nov এর,
              কারণ লেখার ক্রমে 0 আগে 2 এর।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "distinct-inside",
      subHeader: { index: "006", title: "DISTINCT Inside" },
      title: <SectionTitle>একই মান বারবার না দেখানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক এবার জানতে চান Island Tours কোন কোন বিভাগে ট্যুর চালায়। destinations Table এ সাতটা জায়গা,
                তার চারটাই Chattogram বিভাগে। সাধারণ string_agg দিলে Chattogram চারবার আসবে। Module 03 এ DISTINCT
                শিখেছিলেন পুরো Row এর জন্য। Aggregate এর ভেতরেও একই শব্দ চলে: মানের ঠিক আগে DISTINCT লিখলে
                জোড়ার আগে একই মানগুলো একবার করে রাখা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবগুলো, আর আলাদা আলাদাগুলো"
              query={`SELECT string_agg(region, ', ' ORDER BY region)          AS all_regions,
       string_agg(DISTINCT region, ', ' ORDER BY region) AS distinct_regions
FROM destinations;

SELECT string_agg(DISTINCT country, ', ' ORDER BY country) AS countries
FROM customers;`}
              caption="প্রথম ঘরে Chattogram চারবার: Barishal, Chattogram, Chattogram, Chattogram, Chattogram, Khulna, Sylhet। দ্বিতীয় ঘরে একবার করে: Barishal, Chattogram, Khulna, Sylhet। Customer রা এসেছেন চারটা দেশ থেকে: Bangladesh, India, Malaysia, United Kingdom। এখানে GROUP BY নেই, তাই পুরো Table একটা দল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DISTINCT এর সাথে একটা কড়া নিয়ম আছে। DISTINCT থাকলে ভেতরের ORDER BY তে শুধু সেই মানটাই লেখা যায়
                যেটা জোড়া হচ্ছে। কারণটা যুক্তির। ধরুন payments থেকে প্রতিটা status এর জন্য আলাদা আলাদা method এর
                তালিকা চান, কিন্তু সাজাতে চান payment_id দিয়ে। paid দলে bkash এসেছে পাঁচটা আলাদা payment_id নিয়ে।
                DISTINCT সেগুলোকে একটা bkash বানাবে। তাহলে সেই একটা bkash কে কোন payment_id এর জায়গায় বসাবে?
                প্রশ্নটার কোনো একটা উত্তর নেই, তাই PostgreSQL অনুমান না করে Error দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DISTINCT থাকলে, সাজানো যায় শুধু তালিকার মান দিয়ে"
              query={`SELECT status,
       count(*) AS payments,
       string_agg(DISTINCT method, ', ' ORDER BY method) AS methods
FROM payments
GROUP BY status
ORDER BY status;

SELECT status,
       string_agg(DISTINCT method, ', ' ORDER BY payment_id)
FROM payments
GROUP BY status;`}
              caption="প্রথম Query চলে: failed এ শুধু bkash, paid এ চারটা method, bank, bkash, card, nagad, refunded এ bkash। দ্বিতীয়টা থামে: in an aggregate with DISTINCT, ORDER BY expressions must appear in argument list। MySQL এ ঠিক এই Query টা Error ছাড়াই চলে, সেটা Section 013 এ।"
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
                  destinations থেকে প্রতিটা <code className={CODE}>region</code> আর সেই বিভাগে কী কী ধরনের জায়গা
                  আছে, মানে <code className={CODE}>kind</code> এর তালিকা। একই kind একবারই আসবে, বর্ণমালার ক্রমে,
                  কমা আর Space দিয়ে জোড়া। দুটো Column, region এর ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>string_agg(DISTINCT kind, &apos;, &apos; ORDER BY kind)</code>। DISTINCT থাকায়
                  ভেতরের ORDER BY তে kind ছাড়া কিছু চলবে না।
                </>
              }
              solution={`SELECT region,
       string_agg(DISTINCT kind, ', ' ORDER BY kind) AS kinds
FROM destinations
GROUP BY region
ORDER BY region;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "nulls",
      subHeader: { index: "007", title: "NULLs" },
      title: <SectionTitle>ফাঁকা ঘর: একজন বাদ দেয়, আরেকজন রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 থেকে আপনি জানেন বেশিরভাগ Aggregate NULL কে বাদ দিয়ে হিসাব করে। count(phone)
                শুধু যাঁদের phone আছে তাঁদের গোনে। string_agg ও তাই করে: NULL মানটা জোড়ার সময় একদম বাদ পড়ে, তার জন্য
                কোনো ফাঁকা ঘর বা বাড়তি কমাও বসে না।
              </ContentParagraph>
              <ContentParagraph>
                array_agg এখানে আলাদা। সে কিছুই বাদ দেয় না। NULL পেলে তালিকায় একটা ঘর রাখে, যার ভেতরে NULL। কারণটা
                বোঝা সহজ। string_agg এর কাজ মানুষের পড়ার মতো একটা লেখা বানানো, যেখানে ফাঁকা কিছু দেখানোর মানে নেই।
                array_agg এর কাজ পুরো দলটাকে হুবহু একটা তালিকায় তুলে রাখা, যাতে পরে কেউ বলতে পারে তৃতীয় Customer
                এর phone নেই। বাদ দিলে সেই তথ্যটা হারিয়ে যেত।
              </ContentParagraph>
              <ContentParagraph>
                আরও দুটো কিনারার ঘটনা আছে, আর দুটোতেই উত্তর NULL। একটা দলের সবগুলো মানই যদি NULL হয়, string_agg এর
                জোড়ার মতো কিছু থাকে না, তাই উত্তর NULL, খালি লেখা না। আর কোনো Row ই না থাকলে, যেমন Paris এর
                Customer খুঁজলে, string_agg আর array_agg দুটোই NULL দেয়, অথচ count(*) দেয় 0। নিচে তিনটাই দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা মান, মাঝেরটা NULL"
              query={`SELECT string_agg(x, ',') AS joined
FROM (VALUES ('a'), (NULL), ('b')) AS t(x);

SELECT array_agg(x) AS listed
FROM (VALUES ('a'), (NULL), ('b')) AS t(x);

SELECT string_agg(full_name, ', ') AS names,
       array_agg(full_name)        AS listed,
       count(*)                    AS how_many
FROM customers
WHERE city = 'Paris';`}
              caption="প্রথমটা 'a,b', মাঝের NULL বাদ। দ্বিতীয়টা {a,NULL,b}, NULL একটা ঘর হিসেবে রয়ে গেছে। তৃতীয়টায় কোনো Row নেই, তবু একটা Row আসে: NULL, NULL আর 0। VALUES দিয়ে নিজের বানানো ছোট Table, এটা Module 07 এ বিস্তারিত, এখানে শুধু তিনটা মান হাতে বানানোর জন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঢাকা আর কলকাতার phone"
              query={`SELECT city,
       count(*)      AS customers,
       count(phone)  AS with_phone,
       string_agg(phone, ', ' ORDER BY customer_id) AS phones,
       array_agg(phone ORDER BY customer_id)        AS phone_list
FROM customers
WHERE city IN ('Dhaka', 'Kolkata')
GROUP BY city
ORDER BY city;`}
              caption="Dhaka: ছয়জন Customer, পাঁচজনের phone। phones এ পাঁচটা নম্বর, phone_list এ ছয়টা ঘর, তৃতীয়টা NULL, কারণ customer_id 6, Mitu Rahman এর phone নেই। Kolkata: একজনই, Priya Sharma, phone নেই। তাই phones পুরোটাই NULL, আর phone_list হলো {NULL}।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <StringVsArraySplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Report এ NULL এর বদলে কিছু দেখাতে চাইলে Module 04 এর COALESCE। কিন্তু দুটো জায়গায় বসানো যায়, আর
                দুটোর মানে আলাদা। ভেতরে, মানে <code className={CODE}>string_agg(COALESCE(phone, &apos;no phone&apos;), ...)</code>,
                প্রতিটা ফাঁকা phone কে একটা লেখা বানিয়ে তালিকায় ঢুকিয়ে দেয়, তাই তালিকায় দেখা যায় কোন জায়গায়
                নম্বর নেই। বাইরে, মানে <code className={CODE}>COALESCE(string_agg(phone, ...), &apos;no phone&apos;)</code>,
                তালিকাটা যেমন ছিল তেমনই রাখে, শুধু পুরো তালিকাটাই NULL হলে সেই জায়গায় একটা লেখা বসায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="COALESCE ভেতরে, না বাইরে"
              query={`SELECT city,
       string_agg(COALESCE(phone, 'no phone'), ', ' ORDER BY customer_id) AS inside,
       COALESCE(string_agg(phone, ', ' ORDER BY customer_id), 'no phone') AS outside
FROM customers
WHERE city IN ('Chattogram', 'Kolkata')
GROUP BY city
ORDER BY city;`}
              caption="Chattogram এ দুজন: Tanvir Ahmed এর phone নেই, Lamia Haque এর আছে। inside দেখায় 'no phone, +8801000000114', মানে দুজনেরই একটা জায়গা। outside দেখায় শুধু '+8801000000114', কারণ তালিকা NULL না। Kolkata তে দুটোই 'no phone', কিন্তু আলাদা কারণে।"
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
                  যেসব শহরে একজনের বেশি Customer আছেন, শুধু সেগুলোর জন্য: <code className={CODE}>city</code> আর সেই
                  শহরের সবার phone, customer_id এর ক্রমে, কমা আর Space দিয়ে জোড়া। যাঁর phone নেই তাঁর জায়গায় লেখা
                  থাকবে <code className={CODE}>no phone</code>। দুটো Column, শহরের বর্ণমালার ক্রমে।
                </>
              }
              hint={
                <>
                  COALESCE বসবে string_agg এর ভেতরে, যাতে প্রত্যেকের জায়গা থাকে। একজনের বেশি মানে দল ছাঁকা, তাই
                  Lesson 03 এর <code className={CODE}>HAVING count(*) &gt; 1</code>।
                </>
              }
              solution={`SELECT city,
       string_agg(COALESCE(phone, 'no phone'), ', ' ORDER BY customer_id) AS phones
FROM customers
GROUP BY city
HAVING count(*) > 1
ORDER BY city;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "array-agg",
      subHeader: { index: "008", title: "array_agg" },
      title: <SectionTitle>array_agg: লেখা না, আসল একটা তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ট্রেনের কথা ভাবুন। ট্রেন একটা জিনিস, একটা নামে চলে, একটা লাইনে দাঁড়ায়। কিন্তু তার ভেতরে
                সারি সারি বগি, প্রতিটার নিজের নম্বর, প্রথম বগি, দ্বিতীয় বগি। Array ঠিক এমন একটা মান: একটা ঘরে বসে,
                কিন্তু ভেতরে কয়েকটা মান সারি করে রাখা, প্রতিটার নিজের জায়গা। PostgreSQL Array কে দেখায় দ্বিতীয়
                বন্ধনীর ভেতরে, কমা দিয়ে: {"{1,8,17}"}।
              </ContentParagraph>
              <ContentParagraph>
                string_agg এর ফল একটা text, কমাগুলো সেই লেখারই অংশ। array_agg এর ফল একটা Array, আর তার Type মানের
                Type এর সাথে মিলে যায়। booking_id integer, তাই array_agg(booking_id) হয় integer[], মানে integer
                এর তালিকা। status text, তাই array_agg(status) হয় text[]। এর মানে তালিকার প্রতিটা মান তখনো তার আসল
                Type এ আছে, 8 তখনো একটা সংখ্যা, লেখা না। string_agg এর মতো আগে ::text করার দরকারও নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা ফলের Type"
              query={`SELECT pg_typeof(string_agg(status, ', ')) AS string_agg_type,
       pg_typeof(array_agg(booking_id))    AS array_agg_type,
       pg_typeof(array_agg(status))        AS text_array_type
FROM bookings;`}
              caption="text, integer[] আর text[]। [] চিহ্নটা মানে এটা একটা তালিকা। Module 04 এ pg_typeof দিয়ে একটা মানের Type দেখেছিলেন, এখানেও সেই একই কাজ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালিকা হাতে থাকলে তিনটা কাজ সহজ হয়ে যায়। এক, একটা নির্দিষ্ট জায়গার মান বের করা, বর্গবন্ধনীতে
                নম্বর দিয়ে। খেয়াল করুন, PostgreSQL এ গোনা শুরু 1 থেকে, 0 থেকে না, যেটা অনেক Programming Language
                থেকে আসা মানুষকে ভুল করায়। [0] চাইলে Error না, শুধু NULL আসে, তাই ভুলটা চোখে পড়ে না। দুই, তালিকায়
                কয়টা মান আছে, cardinality দিয়ে। তিন, তালিকায় একটা মান আছে কিনা, <code className={CODE}>= ANY(...)</code>
                দিয়ে, যেটা Module 07 আর Module 15 এ আরও আসবে।
              </ContentParagraph>
              <ContentParagraph>
                একটা কাজের কৌশল এখান থেকেই আসে। array_agg এর ভেতরে booked_at দিয়ে সাজালে [1] হলো প্রতিটা Customer
                এর প্রথম Booking, আর শেষ ঘর হলো সবচেয়ে নতুনটা। Module 03 এর DISTINCT ON দিয়েও এই কাজ হয়, কিন্তু এই
                পথে একই Query তে প্রথম, দ্বিতীয়, আর মোট সংখ্যা, সব একসাথে পাওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকার ভেতরে হাত দেওয়া"
              query={`SELECT customer_id,
       array_agg(booking_id ORDER BY booking_id)       AS ids,
       cardinality(array_agg(booking_id))              AS how_many,
       (array_agg(booking_id ORDER BY booking_id))[1]  AS first_id,
       (array_agg(booking_id ORDER BY booking_id))[2]  AS second_id
FROM bookings
GROUP BY customer_id
HAVING count(*) > 1
ORDER BY customer_id;

SELECT (array_agg(booking_id ORDER BY booked_at))[0] AS zero,
       (array_agg(booking_id ORDER BY booked_at))[1] AS one,
       (array_agg(booking_id ORDER BY booked_at))[9] AS nine
FROM bookings
WHERE customer_id = 1;

SELECT 1 = ANY(array_agg(customer_id))  AS has_customer_1,
       15 = ANY(array_agg(customer_id)) AS has_customer_15
FROM bookings;`}
              caption="প্রথম Query তে নয়জন Customer যাঁদের একাধিক Booking: customer 1 এর ids {1,8,17}, how_many 3, first_id 1, second_id 8। দ্বিতীয়টায় zero আর nine দুটোই NULL, শুধু one তে 1: সীমার বাইরে চাইলে Error না, নীরব NULL। তৃতীয়টায় has_customer_1 t, has_customer_15 f, কারণ Imran Kabir এখনো কিছু বুক করেননি। array_agg(...) কে বর্গবন্ধনীর আগে নিজের বন্ধনীতে মুড়তে হয়, নইলে PostgreSQL বুঝতে পারে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখনো উল্টো কাজটাও লাগে: একটা Array কে মানুষের পড়ার মতো লেখা বানানো। তার জন্য array_to_string। এর
                একটা সুবিধা আছে যেটা string_agg এ নেই: তৃতীয় একটা Argument দিলে NULL এর জায়গায় সেই লেখা বসায়, NULL
                কে বাদ দেয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকা থেকে আবার লেখা"
              query={`SELECT array_to_string(array_agg(phone ORDER BY customer_id), ', ', '(none)') AS with_gap,
       array_to_string(array_agg(phone ORDER BY customer_id), ', ')           AS skipped
FROM customers
WHERE city = 'Dhaka';`}
              caption="with_gap এ ছয়টা জায়গা, তৃতীয়টায় (none)। skipped এ পাঁচটা নম্বর, ঠিক string_agg এর মতো। Section 007 এর COALESCE ভেতরে দেওয়ার যে কাজ, এটা তারই আরেকটা পথ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রশ্ন", "string_agg", "array_agg"],
          rows: [
            ["ফলের Type", "text, একটা লেখা", "মানের Type এর তালিকা, যেমন integer[]"],
            ["সংখ্যা জুড়তে", "আগে ::text লাগে", "সরাসরি চলে"],
            ["NULL", "বাদ দেয়", "একটা ঘর হিসেবে রাখে"],
            ["একটা নির্দিষ্ট মান বের করা", "লেখা কেটে বের করতে হয়, ঝুঁকিপূর্ণ", "[1], [2], সোজা"],
            ["কে পড়বে", "মানুষ: Report, Email, Screen", "Code, পরের SQL, JSON এ রূপান্তর"],
            ["Separator", "আপনি ঠিক করেন", "দরকার নেই, ঘরগুলো আলাদাই থাকে"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              task={
                <>
                  যেসব Customer এর দুই বা তার বেশি Booking আছে, তাঁদের জন্য তিনটা Column:{" "}
                  <code className={CODE}>customer_id</code>, booked_at অনুযায়ী তাঁর প্রথম Booking এর booking_id,
                  আর booked_at এর ক্রমে তাঁর সব booking_id এর একটা Array। customer_id এর ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  প্রথমটার জন্য <code className={CODE}>(array_agg(booking_id ORDER BY booked_at))[1]</code>, বন্ধনী
                  খেয়াল করে। Array এর জন্য একই জিনিস, শুধু [1] ছাড়া। দল ছাঁকতে{" "}
                  <code className={CODE}>HAVING count(*) &gt;= 2</code>।
                </>
              }
              solution={`SELECT customer_id,
       (array_agg(booking_id ORDER BY booked_at))[1] AS first_booking,
       array_agg(booking_id ORDER BY booked_at)      AS in_order
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "try-every-combination",
      subHeader: { index: "009", title: "Try Every Combination" },
      title: <SectionTitle>বোতাম টিপে নিজে তালিকা বানান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এ পর্যন্ত যা শিখলেন, সব এক জায়গায়। নিচের Lab এ পাঁচটা সিদ্ধান্ত আপনার হাতে: কী দিয়ে দল বাঁধবেন,
                তালিকায় কী থাকবে, ভেতরের ক্রম কী, DISTINCT চালু কিনা, আর string_agg না array_agg। প্রতিবার Lab টা
                পুরো Query টা লিখে দেয় আর আসল ২৪টা Booking এর উপর ফলাফল দেখায়। প্রতিটা জোড়ার ফল PostgreSQL এ
                চালিয়ে মিলিয়ে নেওয়া, তাই এখানে যা দেখবেন, Query বক্সে কপি করলেও তাই পাবেন।
              </ContentParagraph>
              <ContentParagraph>
                চারটা জিনিস খুঁজে দেখার মতো। status দিয়ে দল বেঁধে booking_id তালিকা করলে কোন দলে সবচেয়ে বেশি
                Booking। তালিকায় status রেখে DISTINCT চালু করলে customer_id 1 এর তালিকা কীভাবে ছোট হয়। তালিকার মান
                দিয়ে সাজালে booking_id এর ক্রম string_agg আর array_agg এ কেন আলাদা। আর DISTINCT চালু করলে ক্রমের
                বোতামগুলো কেন বন্ধ হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ListAggLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "লেখা হিসেবে সাজালে 17 আগে আসে 8 এর",
          content: (
            <ContentParagraph>
              Lab এ string_agg, booking_id আর তালিকার মান দিয়ে সাজানো, এই তিনটা একসাথে বেছে নিলে customer 1 এর
              তালিকা হয় &apos;1, 17, 8&apos;। কারণ ভেতরের ORDER BY তখন booking_id::text দিয়ে, মানে লেখা দিয়ে
              সাজাচ্ছে, আর লেখার নিয়মে প্রথম অক্ষর 1 এর পরে আসে 7, তারপর 8। সংখ্যার ক্রম চাইলে ভেতরে ORDER BY
              booking_id লিখুন, Cast ছাড়া। ভেতরের ORDER BY তালিকার মানের সাথে মিলতে হয় শুধু DISTINCT থাকলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "with-group-by",
      subHeader: { index: "010", title: "With GROUP BY and HAVING" },
      title: <SectionTitle>তালিকা, গোনা আর দল ছাঁকা একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                string_agg আর array_agg এই মডিউলের বাকি সবকিছুর সাথে মিশে যায়, কারণ তারাও সাধারণ Aggregate। এক
                Query তে count, sum আর একটা তালিকা পাশাপাশি থাকতে পারে। HAVING দিয়ে দল ছাঁকা যায়, এমনকি HAVING এর
                শর্তেও Aggregate চলে, যেমন <code className={CODE}>count(DISTINCT status) &gt; 1</code>, মানে যাঁদের
                Booking একাধিক অবস্থায় আছে।
              </ContentParagraph>
              <ContentParagraph>
                Lesson 02 থেকে মনে রাখুন, GROUP BY এর Column এ NULL থাকলে সেই NULL গুলো নিজেরাই একটা দল হয়। tours এ
                Ratargul Swamp Boat Day এর এখনো Guide নেই, তাই guide_id দিয়ে দল বাঁধলে NULL এর একটা আলাদা দল আসে,
                তাতে একটাই ট্যুর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একাধিক অবস্থা, আর Guide ছাড়া দল"
              query={`SELECT customer_id,
       count(*) AS bookings,
       array_agg(DISTINCT status ORDER BY status) AS statuses
FROM bookings
GROUP BY customer_id
HAVING count(DISTINCT status) > 1
ORDER BY customer_id;

SELECT guide_id,
       count(*) AS tours,
       string_agg(title, ' / ' ORDER BY title) AS titles
FROM tours
GROUP BY guide_id
ORDER BY guide_id NULLS LAST;`}
              caption="প্রথম Query তে পাঁচজন Customer যাঁদের Booking দুই রকম অবস্থায়: 1, 9 আর 13 এর confirmed আর pending, 6 আর 11 এর cancelled আর confirmed। দ্বিতীয়টায় চারজন Guide, প্রত্যেকের দুটো ট্যুর, আর শেষে NULL এর দল: শুধু Ratargul Swamp Boat Day। Guide দের নাম guides Table এ, সেগুলো আনতে JOIN লাগে, যেটা Module 06 এর কাজ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GROUP BY না দিলে পুরো Table একটা দল। তখন string_agg পুরো একটা Column কে এক লাইনে নিয়ে আসে। এটা
                প্রতিদিনের কাজে অবাক রকম কাজে লাগে। কাউকে Chat এ সব Destination এর নাম পাঠাতে চান, বা একটা Script
                এর জন্য সব id এক লাইনে দরকার, একটা Query তেই হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Table, একটা লাইন"
              query={`SELECT count(*) AS destinations,
       string_agg(name, ', ' ORDER BY name) AS all_destinations
FROM destinations;`}
              caption="৭টা Destination, এক লাইনে: Bandarban, Cox's Bazar, Kuakata, Saint Martin's Island, Sajek Valley, Sundarbans, Sylhet। Kuakata তে এখনো কোনো ট্যুর নেই, কিন্তু destinations Table এ সে আছে, তাই তালিকাতেও আছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "with-filter",
      subHeader: { index: "011", title: "With FILTER" },
      title: <SectionTitle>এক Query, কয়েকটা আলাদা তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 04 এ FILTER দেখেছেন: একটা Aggregate এর পরে{" "}
                <code className={CODE}>FILTER (WHERE শর্ত)</code> লিখলে সেই Aggregate শুধু শর্ত মেলা Row গুলো দেখে।
                count আর sum এর সাথে যেমন, string_agg আর array_agg এর সাথেও ঠিক তেমন। তাই এক দলের জন্য পাশাপাশি
                কয়েকটা তালিকা বানানো যায়, প্রতিটা আলাদা শর্তে।
              </ContentParagraph>
              <ContentParagraph>
                Operations টিমের একটা রোজকার প্রশ্ন: প্রতিটা Departure এ কোন Booking গুলো নিশ্চিত, আর কোনগুলো
                এখনো ঝুলে আছে বা বাতিল। একটা Departure এ শর্ত মেলার মতো কোনো Booking না থাকলে সেই তালিকা NULL,
                ঠিক Section 007 এর নিয়মে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিশ্চিত, আর বাকিগুলো"
              query={`SELECT departure_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status = 'confirmed')  AS confirmed,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status <> 'confirmed') AS other
FROM bookings
GROUP BY departure_id
ORDER BY departure_id;`}
              caption="১৫টা Departure এ Booking আছে। Departure 1 এ confirmed '1, 2', other NULL। Departure 14 এ confirmed NULL, other '20, 24', দুটোই pending। Departure 12 তে একটাই Booking, 18, যেটা বাতিল। FILTER বসে পুরো string_agg(...) এর পরে, Parenthesis এর বাইরে।"
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
                  শুধু সেই Departure গুলো যেখানে অন্তত একটা Booking confirmed না। প্রতিটার জন্য তিনটা Column:{" "}
                  <code className={CODE}>departure_id</code>, pending Booking গুলোর id আর cancelled Booking গুলোর
                  id, দুটোই booking_id এর ক্রমে, কমা আর Space দিয়ে জোড়া। কোনো তালিকায় কিছু না থাকলে NULL থাকবে।
                  departure_id এর ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  দুটো string_agg, দুটো FILTER: <code className={CODE}>status = &apos;pending&apos;</code> আর{" "}
                  <code className={CODE}>status = &apos;cancelled&apos;</code>। দল ছাঁকতেও FILTER চলে:{" "}
                  <code className={CODE}>HAVING count(*) FILTER (WHERE status &lt;&gt; &apos;confirmed&apos;) &gt; 0</code>।
                </>
              }
              solution={`SELECT departure_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status = 'pending')   AS pending,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status = 'cancelled') AS cancelled
FROM bookings
GROUP BY departure_id
HAVING count(*) FILTER (WHERE status <> 'confirmed') > 0
ORDER BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "json-preview",
      subHeader: { index: "012", title: "JSON Preview" },
      title: <SectionTitle>App এর জন্য তালিকা: json_agg এর ঝলক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Website বা Mobile App যখন Server এর কাছে একজন Customer এর Booking গুলো চায়, Server
                সাধারণত উত্তর পাঠায় JSON এ। JSON হলো লেখার একটা নিয়ম, যেটা প্রায় সব Programming Language বোঝে:
                তালিকা থাকে [ ] এর ভেতরে, আর নাম আর মানের জোড়া {"{ }"} এর ভেতরে। Module 01 এর Lesson 03 এ Document
                Database এর কথায় এই চেহারাটা দেখেছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL নিজেই একটা দলকে JSON এর তালিকা বানাতে পারে, json_agg আর jsonb_agg দিয়ে। এরা array_agg এর
                জাতভাই, NULL ও রাখে, ভেতরে ORDER BY ও চলে, শুধু ফলটা JSON। json_build_object এর সাথে মেলালে প্রতিটা
                Row একটা ছোট বস্তু হয়ে যায়, ঠিক যেমন একটা App চায়। json আর jsonb এর পার্থক্য, JSON এর ভেতরে খোঁজা
                আর Index করা, এসবই Module 15 এ। আজ শুধু ঝলকটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একজন Customer এর Booking, JSON হিসেবে"
              query={`SELECT customer_id,
       json_agg(booking_id ORDER BY booking_id) AS ids_json,
       jsonb_agg(status ORDER BY booking_id)    AS statuses_json
FROM bookings
WHERE customer_id IN (1, 2)
GROUP BY customer_id
ORDER BY customer_id;

SELECT json_agg(json_build_object('id', booking_id, 'status', status)
                ORDER BY booking_id) AS customer_1
FROM bookings
WHERE customer_id = 1;`}
              caption="প্রথম Query তে customer 1 এর ids_json [1, 8, 17], statuses_json [&quot;confirmed&quot;, &quot;confirmed&quot;, &quot;pending&quot;]। দ্বিতীয়টায় তিনটা ছোট বস্তুর একটা তালিকা, প্রতিটায় id আর status। একটা API ঠিক এই লেখাটাই App কে পাঠাতে পারে, App কে আর কিছু জোড়া লাগাতে হয় না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এর GROUP_CONCAT, আর তার নীরব কাঁচি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ string_agg নেই, array_agg ও নেই। চালাতে গেলে ERROR 1305 আসে, FUNCTION does not exist।
                string_agg এর কাজটা করে GROUP_CONCAT, আর লেখার চেহারা একটু আলাদা। Separator বসে শেষে, SEPARATOR
                শব্দটার পরে, ORDER BY এর পরে। Separator না দিলে MySQL নিজে বসায় শুধু একটা কমা, Space ছাড়া। আর
                সংখ্যাকে আগে লেখা বানানোর দরকার নেই, MySQL নিজেই বদলে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query গুলো MySQL 8.4.11 এ Island Tours এর MySQL সংস্করণের উপর চালানো, পাশে আসল ফল। এই বক্সটা
                PostgreSQL চালায়, তাই এগুলো এখানে চলবে না। নিজের MySQL এ চালাতে Module 02 এর MySQL লেসন দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4.sql",
          code: `-- Separator না দিলে শুধু কমা
SELECT customer_id, GROUP_CONCAT(booking_id) AS ids
FROM bookings GROUP BY customer_id ORDER BY customer_id LIMIT 3;
-- 1 | 1,8,17
-- 2 | 2,13
-- 3 | 3,22

-- ORDER BY আর SEPARATOR, এই ক্রমে
SELECT customer_id,
       GROUP_CONCAT(booking_id ORDER BY booked_at DESC SEPARATOR ' | ') AS newest_first
FROM bookings WHERE customer_id = 1 GROUP BY customer_id;
-- 1 | 17 | 8 | 1

-- DISTINCT চলে, আর ভেতরে অন্য Column দিয়ে সাজালেও Error দেয় না
SELECT status, GROUP_CONCAT(DISTINCT method ORDER BY payment_id SEPARATOR ', ') AS m
FROM payments GROUP BY status ORDER BY status;
-- failed   | bkash
-- paid     | card, bank, nagad, bkash
-- refunded | bkash

-- FILTER নেই, তার বদলে CASE: শর্ত না মিললে NULL, আর GROUP_CONCAT NULL বাদ দেয়
SELECT departure_id,
       GROUP_CONCAT(CASE WHEN status = 'confirmed' THEN booking_id END
                    ORDER BY booking_id SEPARATOR ', ') AS confirmed
FROM bookings GROUP BY departure_id ORDER BY departure_id LIMIT 3;
-- 1 | 1, 2
-- 2 | 3
-- 3 | 4

-- array_agg এর কাছাকাছি: JSON_ARRAYAGG, NULL রাখে, কিন্তু ভেতরে ORDER BY নেয় না
SELECT JSON_ARRAYAGG(phone) FROM customers WHERE city = 'Kolkata';
-- [null]`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "১০২৪ অক্ষরের পরে MySQL চুপচাপ কেটে দেয়",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                GROUP_CONCAT এর ফলের একটা সর্বোচ্চ দৈর্ঘ্য আছে, group_concat_max_len নামের একটা Setting এ, যার Default
                মান 1024। তালিকা এর চেয়ে লম্বা হলে MySQL বাকিটা কেটে ফেলে, Error দেয় না, শুধু একটা Warning, 1260: Row
                ... was cut by GROUP_CONCAT()। App এর Code প্রায় কখনো Warning পড়ে না, তাই কাটা তালিকাটাই পুরো তালিকা
                হিসেবে Screen এ চলে যায়।
              </ContentParagraph>
              <ContentParagraph>
                নিজের চোখে দেখতে Setting টা ছোট করে চালানো হয়েছিল: SET SESSION group_concat_max_len = 20, তারপর
                পনেরোজন Customer এর নাম জোড়া, যেটা পুরোটা ২১০ অক্ষর। ফল এল শুধু &apos;Rahim Uddin, Nusrat &apos;, ঠিক ২০
                অক্ষর, শেষের Space সহ, সাথে Warning 1260। সমাধান: লম্বা তালিকার আগে SET SESSION group_concat_max_len
                বড় করে দিন, আর যা দেখাবেন তার একটা যুক্তিসঙ্গত সীমা নিজেই ঠিক করুন। PostgreSQL এর string_agg এ এমন
                কোনো নীরব সীমা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["মান জুড়ে লেখা", "string_agg(x, ', ' ORDER BY y)", "GROUP_CONCAT(x ORDER BY y SEPARATOR ', ')"],
            ["Separator না দিলে", "দিতেই হয়, Argument বাধ্যতামূলক", "শুধু কমা, Space ছাড়া"],
            ["সংখ্যা জুড়তে", "আগে ::text", "সরাসরি"],
            ["DISTINCT আর অন্য Column এ ক্রম", "Error", "চলে"],
            ["NULL", "বাদ দেয়", "বাদ দেয়"],
            ["সব NULL বা কোনো Row নেই", "NULL", "NULL"],
            ["দৈর্ঘ্যের সীমা", "নীরব কোনো সীমা নেই", "Default 1024, তারপর নীরবে কাটে"],
            ["তালিকা হিসেবে", "array_agg, NULL রাখে", "নেই, JSON_ARRAYAGG আছে"],
            ["JSON তালিকা", "json_agg(x ORDER BY y)", "JSON_ARRAYAGG(x), ভেতরে ORDER BY নেই"],
            ["শর্তসহ তালিকা", "FILTER (WHERE ...)", "GROUP_CONCAT(CASE WHEN ... END)"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজেকে একটু পরীক্ষা করুন। নিচের সাতটা প্রশ্নে এমন সব ঘটনা যেখানে উত্তর প্রথমবার প্রায় সবাইকে
              অবাক করে। আগে আন্দাজ করুন, তারপর আসল ফল আর কারণ দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PredictListLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Admin Screen এর Customer Card</SectionTitle>,
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
                Island Tours এর Admin Screen এ প্রতিটা Customer এর জন্য একটা ছোট Card দেখানো হয়। নাসরিন ফোন ধরার
                আগে এক নজরে দেখে নেন: মানুষটা কতবার বুক করেছেন, কোন Booking কোন অবস্থায়, প্রথম কবে এসেছিলেন,
                শেষ কবে, আর এখনো কতগুলো সিট ধরে রেখেছেন। পুরো Card এর Data আসে একটা Query থেকে, একটা Table থেকে।
              </ContentParagraph>
              <ContentParagraph>
                Query টায় এই মডিউলের প্রায় সবকিছু একসাথে: count, min আর max, একটা FILTER দেওয়া sum, আর booked_at এর
                ক্রমে একটা ইতিহাস, যেখানে প্রতিটা Booking এর নম্বরের পাশে বন্ধনীতে তার অবস্থা। booked_at একটা
                timestamptz, তাই ::date দিয়ে শুধু তারিখটা, ঢাকার সময় ধরে, কারণ এই বক্সের সময় অঞ্চল Asia/Dhaka।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর Card"
              query={`SELECT customer_id,
       count(*) AS bookings,
       string_agg(booking_id || ' (' || status || ')', ', ' ORDER BY booked_at) AS history,
       min(booked_at)::date AS first_booked,
       max(booked_at)::date AS last_booked,
       sum(seats) FILTER (WHERE status <> 'cancelled') AS seats_held
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;`}
              caption="চোদ্দজন Customer, চোদ্দটা Card। customer 1: তিনটা Booking, '1 (confirmed), 8 (confirmed), 17 (pending)', প্রথম 2025-12-20, শেষ 2026-10-08, ছয়টা সিট। customer 5 এর একমাত্র Booking বাতিল, তাই seats_held NULL, কারণ FILTER এর পরে sum এর হাতে কিছুই থাকে না। Card এ সেখানে 0 দেখাতে চাইলে বাইরে COALESCE দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা জিনিস এখানে নেই: Customer এর নাম। নাম থাকে customers Table এ, Booking থাকে bookings এ। দুটো Table
              মিলিয়ে একটা Card বানানো ঠিক পরের মডিউলের প্রথম কাজ, JOIN। আজকের Query টা তখন মাত্র দুই লাইন বাড়বে।
              তার আগে নিচের Challenge টা, যেটা একটা আলাদা Table থেকে একই ধরনের Card বানায়।
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
                  Marketing টিম প্রতিটা ট্যুরের তারিখগুলো এক লাইনে চান, শুধু যেসব ট্যুরের দুই বা তার বেশি
                  Departure আছে। departures থেকে চারটা Column: <code className={CODE}>tour_id</code>, Departure এর
                  সংখ্যা, প্রথম Departure এর তারিখ (একটা date হিসেবে), আর সব তারিখ{" "}
                  <code className={CODE}>to_char(starts_on, &apos;DD Mon YYYY&apos;)</code> চেহারায়, কমা আর Space দিয়ে
                  জোড়া, তারিখের ক্রমে। tour_id এর ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  count(*), min(starts_on), আর string_agg এর ভেতরে to_char। ভেতরের ক্রম লেখা দিয়ে না, তারিখ দিয়ে:{" "}
                  <code className={CODE}>ORDER BY starts_on</code>। শেষে <code className={CODE}>HAVING count(*) &gt;= 2</code>।
                </>
              }
              solution={`SELECT tour_id,
       count(*) AS departures,
       min(starts_on) AS first_departure,
       string_agg(to_char(starts_on, 'DD Mon YYYY'), ', ' ORDER BY starts_on) AS dates
FROM departures
GROUP BY tour_id
HAVING count(*) >= 2
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা তালিকার Column বানানোর সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রতিটা লাইন কী নিয়ে, আগে সেটা ঠিক করুন",
              description:
                "প্রতি Customer একটা লাইন, প্রতি Departure একটা লাইন, নাকি পুরো Table এক লাইন। এটাই GROUP BY এর Column। পুরো Table হলে GROUP BY লাগবেই না।",
            },
            {
              title: "কে পড়বে, তা দেখে Function বাছুন",
              description:
                "মানুষ পড়বে, Report, Email বা Screen এ: string_agg। Code বা পরের SQL আবার কাজে লাগাবে: array_agg। App এর API: json_agg।",
            },
            {
              title: "মানের Type মিলিয়ে নিন",
              description:
                "string_agg শুধু লেখা নেয়। integer, date বা numeric হলে ::text, অথবা || দিয়ে অন্য লেখার সাথে জুড়ে নিন। তারিখ মানুষের মতো দেখাতে to_char।",
            },
            {
              title: "Separator ঠিক করুন",
              description:
                "এমন একটা চিহ্ন যেটা Data এর ভেতরে নেই। কমা আর Space চেনা, খাড়া দাগ পরিষ্কার, E'\\n' প্রতিটা মান আলাদা লাইনে।",
            },
            {
              title: "ভেতরের ORDER BY লিখুন, সবসময়",
              description:
                "Separator এর পরে, Parenthesis বন্ধের আগে। সংখ্যার ক্রম চাইলে Cast ছাড়া Column দিয়ে সাজান। না লিখলে ক্রম কেউ কথা দেয় না।",
            },
            {
              title: "একই মান আর ফাঁকা ঘর সামলান",
              description:
                "একই মান একবার চাইলে DISTINCT, তখন ভেতরের ORDER BY তে শুধু সেই মান। NULL এর জায়গায় কিছু দেখাতে COALESCE, প্রত্যেকের জায়গা রাখতে ভেতরে, শুধু খালি তালিকার জন্য বাইরে।",
            },
            {
              title: "অল্প Data তে চালিয়ে যাচাই করুন",
              description:
                "WHERE দিয়ে একজন Customer বা একটা Departure নিয়ে চালান, হাতে গুনে মিলিয়ে নিন, তারপর WHERE সরিয়ে পুরোটা। দরকার হলে FILTER দিয়ে কয়েকটা তালিকা, HAVING দিয়ে দল ছাঁকা।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যেসব ভুল সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক লেখা"],
          rows: [
            ["integer সরাসরি string_agg এ", "function string_agg(integer, unknown) does not exist", "booking_id::text"],
            ["ভেতরে ORDER BY না লেখা", "আজ ঠিক দেখায়, একদিন চুপচাপ এলোমেলো", "string_agg(x, ', ' ORDER BY y)"],
            ["ORDER BY মানের ঠিক পরে", "string_agg(text) does not exist, misplaced ORDER BY", "Separator এর পরে ORDER BY"],
            ["বাইরের ORDER BY কে যথেষ্ট ভাবা", "দলগুলো সাজে, তালিকার ভেতরটা না", "দুটো ORDER BY, দুটো কাজ"],
            ["DISTINCT এর সাথে অন্য Column এ ক্রম", "in an aggregate with DISTINCT ... Error", "ORDER BY সেই মানটাই"],
            ["::text দিয়ে সাজানো", "লেখার ক্রম: 1, 17, 8", "ORDER BY booking_id, Cast ছাড়া"],
            ["array_agg ও NULL বাদ দেবে ভাবা", "{a,NULL,b}, NULL একটা ঘর", "দরকার হলে FILTER (WHERE x IS NOT NULL)"],
            ["Array এর প্রথম ঘর [0]", "Error না, নীরব NULL", "[1], গোনা শুরু 1 থেকে"],
            ["কমার লেখা পরে আবার ভাঙা", "নামের ভেতরের কমায় তালিকা ভুল ভাঙে", "পরে কাজে লাগলে array_agg বা json_agg"],
            ["MySQL এ বড় তালিকা", "১০২৪ অক্ষরের পরে নীরবে কাটা", "SET SESSION group_concat_max_len"],
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
                <strong>Aggregate Functions</strong>, PostgreSQL এর অফিসিয়াল Docs। string_agg, array_agg আর json_agg এর
                পুরো বিবরণ, কোনটা NULL বাদ দেয় আর কোনটা রাখে, সব এক Table এ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-aggregate.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-aggregate.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Aggregate Expressions</strong>, Aggregate এর ভেতরে ORDER BY, DISTINCT আর FILTER লেখার নিয়ম, আর
                DISTINCT থাকলে ORDER BY এর সীমা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/sql-expressions.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Array Functions and Operators</strong>, cardinality, array_to_string, ANY আর Array এর সব
                Function, Module 15 এর আগে একবার চোখ বুলিয়ে নেওয়ার মতো।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-array.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-array.html
                </a>
              </ListItem>
              <ListItem>
                <strong>JSON Functions</strong>, json_agg, jsonb_agg আর json_build_object।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-json.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-json.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4 Aggregate Functions</strong>, GROUP_CONCAT এর SEPARATOR, Default কমা, আর
                group_concat_max_len এর 1024 এর সীমা।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনি যে MySQL কোর্সটা দেখছেন</strong>, তার GROUP BY আর Aggregate এর অংশ, প্রায় 1:29:12 থেকে।
                সেখানে MySQL এ GROUP BY কীভাবে লেখা হয় দেখে এই লেসনের GROUP_CONCAT এর সাথে মিলিয়ে নিন।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
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
      id: "module-recap",
      subHeader: { index: "018", title: "Module 05 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাসরিনের Sheet এখন তৈরি: প্রতিটা Customer এর একটা লাইন, তাতে সবগুলো Booking, যে ক্রমে চান সেই
                ক্রমে। এই লেসনের মূল কথাগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>string_agg একটা দলের মান জুড়ে একটা লেখা বানায়, array_agg বানায় একটা তালিকা।</ListItem>
                <ListItem>string_agg শুধু লেখা নেয়, সংখ্যা হলে ::text।</ListItem>
                <ListItem>
                  ভেতরের ORDER BY বসে Separator এর পরে, আর না লিখলে তালিকার ভেতরের ক্রমের কোনো কথা নেই।
                </ListItem>
                <ListItem>DISTINCT থাকলে ভেতরের ORDER BY তে শুধু সেই মানটাই।</ListItem>
                <ListItem>string_agg NULL বাদ দেয়, array_agg রাখে। সব NULL বা কোনো Row না থাকলে উত্তর NULL।</ListItem>
                <ListItem>Array তে গোনা শুরু 1 থেকে, সীমার বাইরে চাইলে নীরব NULL।</ListItem>
                <ListItem>MySQL এ GROUP_CONCAT, Default শুধু কমা, আর ১০২৪ অক্ষরের পরে নীরবে কাটা।</ListItem>
              </ContentList>
              <ContentParagraph>
                এর সাথেই Module 05 শেষ। ছয় লেসনে আপনি শিখলেন অনেক Row থেকে কীভাবে উত্তর বানাতে হয়, আর সেই উত্তর
                প্রতিটা দলের জন্য। নিচের ছবি আর Table এ পুরো মডিউল এক নজরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleFiveStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "মূল প্রশ্ন", "হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/aggregate-functions" className={LINK}>
                01 Aggregate Functions
              </Link>,
              "অনেক Row থেকে একটা উত্তর",
              "COUNT(*), COUNT(col), SUM, AVG, MIN, MAX",
            ],
            [
              <Link key="l2" href="/sql/topic/group-by" className={LINK}>
                02 GROUP BY
              </Link>,
              "প্রতিটা দলের আলাদা উত্তর",
              "GROUP BY, date_trunc দিয়ে দল",
            ],
            [
              <Link key="l3" href="/sql/topic/having-vs-where" className={LINK}>
                03 HAVING vs WHERE
              </Link>,
              "দলের আগে ছাঁকা, না পরে",
              "WHERE, HAVING",
            ],
            [
              <Link key="l4" href="/sql/topic/conditional-aggregation" className={LINK}>
                04 Conditional Aggregation
              </Link>,
              "এক বারে কয়েকটা হিসাব",
              "FILTER, SUM(CASE ...)",
            ],
            [
              <Link key="l5" href="/sql/topic/rollup-cube" className={LINK}>
                05 ROLLUP and CUBE
              </Link>,
              "উপমোট আর সর্বমোট",
              "GROUPING SETS, ROLLUP, CUBE, GROUPING()",
            ],
            [
              <Link key="l6" href="/sql/topic/string-array-agg" className={LINK}>
                06 string_agg and array_agg
              </Link>,
              "দলের ভেতরের মানগুলোও দেখানো",
              "string_agg, array_agg, json_agg",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে। নিচের Report টা Operations টিমের জন্য, শুধু bookings Table থেকে। প্রতিটা Departure যেখানে
              অন্তত দুটো Booking: কতগুলো Booking (COUNT), বাতিল ছাড়া কত সিট ধরা আছে (FILTER দেওয়া SUM), নিশ্চিত Booking
              থেকে কত টাকা (আরেকটা FILTER), কত শতাংশ বাতিল (count কে 100.0 দিয়ে গুণ, Module 04 এর ভাগের ফাঁদ এড়াতে),
              আর পুরো Booking এর তালিকা (string_agg)। দল ছাঁকা HAVING দিয়ে, সাজানো নিশ্চিত আয় অনুযায়ী, যেখানে আয় নেই
              সেটা শেষে। চালান, তারপর প্রতিটা Column কোন লেসনের, নিজে মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 05 এর সব হাতিয়ার, একটা Report এ"
              query={`SELECT departure_id,
       count(*)                                                    AS bookings,
       sum(seats) FILTER (WHERE status <> 'cancelled')             AS seats_held,
       sum(total_bdt) FILTER (WHERE status = 'confirmed')          AS confirmed_bdt,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled')
             / count(*), 1)                                        AS cancel_pct,
       string_agg(booking_id || ':' || status, ', ' ORDER BY booking_id) AS booking_list
FROM bookings
GROUP BY departure_id
HAVING count(*) >= 2
ORDER BY confirmed_bdt DESC NULLS LAST, departure_id;`}
              caption="নয়টা Departure এ দুটো করে Booking। সবার উপরে Departure 1: ৬টা সিট, 75000.00 টাকা, বাতিল 0.0 শতাংশ, '1:confirmed, 2:confirmed'। Departure 3 আর 2 এ অর্ধেক বাতিল, 50.0। সবার নিচে Departure 14: দুটোই pending, তাই confirmed_bdt NULL, আর NULLS LAST তাকে শেষে রেখেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <strong>নিজেকে যাচাই করুন।</strong> এই ছয়টা প্রশ্নের উত্তর কাউকে মুখে বোঝাতে পারলে Module 05 আপনার
                হয়ে গেছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>COUNT(*), COUNT(phone) আর COUNT(DISTINCT city) customers Table এ কেন তিনটা আলাদা সংখ্যা দেয়?</ListItem>
                <ListItem>GROUP BY customer_id দিয়ে SELECT এ booking_id সরাসরি লিখলে কেন Error, আর কোন দুটো পথে ঠিক হয়?</ListItem>
                <ListItem>একই শর্ত WHERE এ বসালে আর HAVING এ বসালে কখন ফল আলাদা হয়?</ListItem>
                <ListItem>FILTER দিয়ে এক Query তে confirmed আর cancelled আলাদা গোনা যায় কীভাবে, আর MySQL এ কীভাবে?</ListItem>
                <ListItem>ROLLUP এর উপমোটের Row চিনবেন কীভাবে, যেখানে দলের Column এ NULL দেখায়?</ListItem>
                <ListItem>Admin Screen এর জন্য string_agg, আর একটা API এর জন্য json_agg, কেন?</ListItem>
              </ContentList>
              <ContentParagraph>
                এই পুরো মডিউলে আপনি একটা নিয়ম মেনেছেন: প্রতিটা Query একটা Table থেকে। তাই Report এ customer_id
                আছে, Customer এর নাম নেই। departure_id আছে, ট্যুরের নাম নেই। Island Tours এর Data ইচ্ছা করে কয়েকটা
                Table এ ভাগ করা, আর আসল Report বানাতে সেগুলো আবার জুড়তে হয়। পরের মডিউল ঠিক এটা নিয়ে:{" "}
                <Link href="/sql/topic/joins-overview" className={LINK}>
                  Module 06, Joins
                </Link>
                । সেখানে প্রথম Query তেই এই লেসনের Customer Card এ নামটা বসে যাবে।
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
      ["string_agg", "একটা দলের মান জুড়ে একটা লেখা", "string_agg(full_name, ', ' ORDER BY full_name)"],
      ["Separator", "দুটো মানের মাঝে যা বসে, আপনি ঠিক করেন", "', ', ' | ', E'\\n', ''"],
      ["::text", "string_agg শুধু লেখা নেয়", "string_agg(booking_id::text, ', ')"],
      ["ভেতরের ORDER BY", "তালিকার ভেতরের ক্রম, Separator এর পরে", "ORDER BY booked_at DESC"],
      ["বাইরের ORDER BY", "ফলাফলের Row, মানে দলগুলোর ক্রম", "ORDER BY customer_id"],
      ["DISTINCT ভেতরে", "একই মান একবার, ক্রম শুধু সেই মান দিয়ে", "string_agg(DISTINCT region, ', ' ORDER BY region)"],
      ["NULL", "string_agg বাদ দেয়, array_agg রাখে", "'a,b' বনাম {a,NULL,b}"],
      ["খালি দল", "জোড়ার কিছু না থাকলে NULL, count হলে 0", "Paris: NULL, NULL, 0"],
      ["array_agg", "আসল Type এর তালিকা", "{1,8,17}, integer[]"],
      ["[n] আর cardinality", "একটা ঘর আর ঘরের সংখ্যা, গোনা শুরু 1 থেকে", "(array_agg(booking_id ORDER BY booked_at))[1]"],
      ["FILTER", "একই দলের কয়েকটা তালিকা, আলাদা শর্তে", "string_agg(...) FILTER (WHERE status = 'confirmed')"],
      ["json_agg", "App এর জন্য JSON তালিকা", "[1, 8, 17]"],
      ["MySQL", "GROUP_CONCAT, Default কমা, ১০২৪ এর নীরব সীমা", "GROUP_CONCAT(x ORDER BY y SEPARATOR ', ')"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "booking_id একটা integer। SELECT customer_id, string_agg(booking_id, ', ') FROM bookings GROUP BY customer_id; চালালে PostgreSQL এ কী হবে?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Customer এর জন্য '1, 8, 17' এর মতো একটা তালিকা",
            isCorrect: false,
            explanation: "string_agg শুধু লেখা জোড়ে, আর PostgreSQL integer কে নিজে থেকে লেখায় বদলায় না, তাই এই চেহারার কোনো Function খুঁজে পায় না।",
          },
          {
            key: "B",
            text: "Error: function string_agg(integer, unknown) does not exist",
            isCorrect: true,
            explanation: "ঠিক। সমাধান booking_id::text, অথবা booking_id কে || দিয়ে অন্য একটা লেখার সাথে জোড়া।",
          },
          {
            key: "C",
            text: "প্রতিটা Customer এর booking_id গুলোর যোগফল",
            isCorrect: false,
            explanation: "যোগফলের কাজ sum এর। string_agg কখনো যোগ করে না, শুধু পাশাপাশি জোড়ে।",
          },
          {
            key: "D",
            text: "প্রতিটা Customer এর জন্য NULL",
            isCorrect: false,
            explanation: "NULL আসে জোড়ার মতো কিছু না থাকলে। এখানে Query চলারই আগে Function না পাওয়ার Error আসে।",
          },
        ],
      },
      {
        id: 2,
        text: "string_agg(booking_id::text, ', ') লিখলেন, ভেতরে কোনো ORDER BY নেই। তালিকার ভেতরে মানগুলোর ক্রম কেমন হবে?",
        options: [
          {
            key: "A",
            text: "সবসময় booking_id এর ছোট থেকে বড় ক্রমে",
            isCorrect: false,
            explanation: "ছোট Data তে প্রায়ই এমন দেখায়, কিন্তু এটা কোনো নিশ্চয়তা না। Table বড় হলে বা Plan বদলালে বদলে যেতে পারে।",
          },
          {
            key: "B",
            text: "যে ক্রমে Row গুলো Table এ ঢোকানো হয়েছিল, নিশ্চিতভাবে",
            isCorrect: false,
            explanation: "ঢোকানোর ক্রমও PostgreSQL কথা দেয় না। Update বা Vacuum এর পরে Row গুলোর জায়গা বদলাতে পারে।",
          },
          {
            key: "C",
            text: "নির্দিষ্ট কোনো ক্রমের নিশ্চয়তা নেই",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এর Docs একে unspecified বলে। ক্রম দরকার হলে ভেতরে ORDER BY লিখুন।",
          },
          {
            key: "D",
            text: "বর্ণমালার ক্রমে, কারণ ফলটা লেখা",
            isCorrect: false,
            explanation: "ফলটা লেখা হলেও মানগুলো নিজে থেকে সাজানো হয় না। সাজাতে ভেতরে ORDER BY লাগে।",
          },
        ],
      },
      {
        id: 3,
        text: "Kolkata তে একজনই Customer, আর তাঁর phone NULL। string_agg(phone, ', ') আর array_agg(phone) কী দেবে?",
        options: [
          {
            key: "A",
            text: "দুটোই NULL",
            isCorrect: false,
            explanation: "string_agg ঠিক NULL দেয়, কিন্তু array_agg NULL বাদ দেয় না, একটা ঘরে রেখে দেয়।",
          },
          {
            key: "B",
            text: "NULL আর {NULL}",
            isCorrect: true,
            explanation: "ঠিক। string_agg এর জোড়ার মতো কিছু নেই, তাই NULL। array_agg একটা ঘরের Array বানায়, যার ভেতরে NULL।",
          },
          {
            key: "C",
            text: "খালি লেখা '' আর খালি Array {}",
            isCorrect: false,
            explanation: "কোনোটাই খালি জিনিস ফেরত দেয় না। খালি লেখা চাইলে বাইরে COALESCE(..., '') লিখতে হয়।",
          },
          {
            key: "D",
            text: "দুটোই Error",
            isCorrect: false,
            explanation: "NULL Aggregate এর জন্য একদম স্বাভাবিক Input, কোনো Error হয় না।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Query তে string_agg(..., ', ' ORDER BY booked_at DESC) আছে, আর একদম শেষে ORDER BY customer_id। কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "শেষের ORDER BY থাকলে ভেতরেরটা অপ্রয়োজনীয়",
            isCorrect: false,
            explanation: "শেষেরটা শুধু Row গুলো সাজায়। প্রতিটা Row এর তালিকার ভেতরটা সে ছুঁয়েও দেখে না।",
          },
          {
            key: "B",
            text: "ভেতরেরটা প্রতিটা তালিকার ভেতরের মান সাজায়, শেষেরটা Row গুলো, মানে দলগুলো",
            isCorrect: true,
            explanation: "ঠিক। দুটো আলাদা কাজ, তাই দুটোই লাগতে পারে।",
          },
          {
            key: "C",
            text: "একটা Query তে দুটো ORDER BY থাকা চলে না, Error হবে",
            isCorrect: false,
            explanation: "চলে। একটা Aggregate এর ভেতরে, আরেকটা Query এর শেষে, এরা আলাদা জায়গার আলাদা নিয়ম।",
          },
          {
            key: "D",
            text: "ভেতরেরটা দলগুলো সাজায়, শেষেরটা তালিকার ভেতরটা",
            isCorrect: false,
            explanation: "উল্টো বলা হয়েছে। Parenthesis এর ভেতরেরটাই তালিকার ভেতরের কাজ করে।",
          },
        ],
      },
      {
        id: 5,
        text: "string_agg(DISTINCT method, ', ' ORDER BY payment_id) PostgreSQL আর MySQL এর GROUP_CONCAT(DISTINCT method ORDER BY payment_id) এ কী হয়?",
        options: [
          {
            key: "A",
            text: "দুটোতেই Error",
            isCorrect: false,
            explanation: "MySQL এটা চালিয়ে দেয়, PostgreSQL দেয় না।",
          },
          {
            key: "B",
            text: "দুটোতেই চলে, একই ফল",
            isCorrect: false,
            explanation: "PostgreSQL এখানে কড়া: DISTINCT থাকলে ভেতরের ORDER BY তে শুধু তালিকার মান।",
          },
          {
            key: "C",
            text: "PostgreSQL এ Error, MySQL এ চলে",
            isCorrect: true,
            explanation: "ঠিক। একটা method এর অনেক payment_id থাকতে পারে, তাই কোনটা ধরে সাজাবে তা অস্পষ্ট। PostgreSQL অনুমান করে না, MySQL করে।",
          },
          {
            key: "D",
            text: "PostgreSQL এ চলে, MySQL এ Error",
            isCorrect: false,
            explanation: "উল্টো। PostgreSQL এর Error টা হলো in an aggregate with DISTINCT, ORDER BY expressions must appear in argument list।",
          },
        ],
      },
      {
        id: 6,
        text: "customer 1 এর Booking গুলো booked_at এর ক্রমে 1, 8, 17। (array_agg(booking_id ORDER BY booked_at))[0] কী দেয়?",
        options: [
          {
            key: "A",
            text: "1, কারণ প্রথম ঘরের নম্বর 0",
            isCorrect: false,
            explanation: "PostgreSQL এর Array এ গোনা শুরু 1 থেকে। প্রথম ঘর [1]।",
          },
          {
            key: "B",
            text: "NULL, কোনো Error ছাড়া",
            isCorrect: true,
            explanation: "ঠিক। সীমার বাইরের ঘর চাইলে PostgreSQL নীরবে NULL দেয়, তাই এই ভুল সহজে চোখে পড়ে না।",
          },
          {
            key: "C",
            text: "Error: index out of range",
            isCorrect: false,
            explanation: "অনেক Language এ এমন Error হয়, কিন্তু PostgreSQL এর Array সীমার বাইরে NULL দেয়।",
          },
          {
            key: "D",
            text: "17, কারণ 0 মানে শেষ থেকে",
            isCorrect: false,
            explanation: "শেষ থেকে গোনার এমন কোনো নিয়ম PostgreSQL এর Array তে নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL এ একটা GROUP_CONCAT এর ফল ২০০০ অক্ষর হওয়ার কথা, আর group_concat_max_len তার Default এ আছে। কী হবে?",
        options: [
          {
            key: "A",
            text: "Query Error দিয়ে থেমে যাবে",
            isCorrect: false,
            explanation: "থামে না। এটাই বিপদ, কারণ Error হলে অন্তত কেউ টের পেত।",
          },
          {
            key: "B",
            text: "পুরো ২০০০ অক্ষরই আসবে",
            isCorrect: false,
            explanation: "Default সীমা 1024, তার বেশি আসে না।",
          },
          {
            key: "C",
            text: "প্রথম ১০২৪ অক্ষর আসবে, সাথে শুধু একটা Warning",
            isCorrect: true,
            explanation: "ঠিক। Warning 1260 আসে, যেটা App প্রায় কখনো পড়ে না। SET SESSION group_concat_max_len বড় করে দিন।",
          },
          {
            key: "D",
            text: "NULL আসবে",
            isCorrect: false,
            explanation: "NULL আসে শুধু যখন জোড়ার মতো কোনো মান নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "একজন Developer প্রতিটা Customer এর booking_id গুলো নিয়ে তাঁর Code এ একটা একটা করে কাজ করবেন। Database থেকে কোন চেহারায় পাঠানো সবচেয়ে ভালো?",
        options: [
          {
            key: "A",
            text: "string_agg দিয়ে কমার লেখা, Code এ কমা ধরে ভাঙবেন",
            isCorrect: false,
            explanation: "সংখ্যার জন্য চলে যায়, কিন্তু মানের ভেতরে কমা থাকলে ভুল ভাঙে, আর Type হারিয়ে সব লেখা হয়ে যায়।",
          },
          {
            key: "B",
            text: "array_agg বা json_agg, যাতে প্রতিটা মান আলাদা আর আসল Type এ থাকে",
            isCorrect: true,
            explanation: "ঠিক। Code কে কিছু ভাঙতে হয় না, আর Driver গুলো Array আর JSON সরাসরি নিজের তালিকায় বদলাতে পারে।",
          },
          {
            key: "C",
            text: "শুধু COUNT, বাকিটা Code নিজে খুঁজে নেবে",
            isCorrect: false,
            explanation: "সংখ্যা থেকে কোন Booking গুলো তা জানা যায় না। আবার Database এ যেতে হবে।",
          },
          {
            key: "D",
            text: "string_agg দিয়ে নতুন লাইন Separator, E'\\n'",
            isCorrect: false,
            explanation: "মানুষের চোখে সুন্দর, কিন্তু Code এর জন্য সেই একই সমস্যা: লেখা ভাঙতে হয়, Type হারায়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Operations টিমের তিনটা Sheet",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Departure Manifest:</strong> bookings থেকে প্রতিটা Departure এর জন্য একটা লাইন, শুধু যেখানে অন্তত দুটো
        Booking। লাইনে থাকবে departure_id, মোট সিট, আর প্রতিটা Booking এর{" "}
        <code className={CODE}>booking_id (seats)</code> চেহারার একটা তালিকা, booking_id এর ক্রমে। psql এ চালিয়ে ফল
        কপি করুন।
      </span>,
      <span key="2">
        <strong>দেশ অনুযায়ী যোগাযোগের তালিকা:</strong> customers থেকে প্রতিটা দেশের জন্য দুটো তালিকা: নামের তালিকা আর
        phone এর তালিকা, যেখানে phone নেই সেখানে no phone, দুটোই customer_id এর ক্রমে। তারপর এক লাইনে লিখুন, COALESCE
        কে বাইরে সরালে India র লাইনে কী বদলায়, আর কেন।
      </span>,
      <span key="3">
        <strong>প্রথম আর শেষ:</strong> array_agg দিয়ে প্রতিটা Customer এর প্রথম আর শেষ Booking বের করুন, booked_at এর
        ক্রমে। শেষেরটার জন্য cardinality দিয়ে শেষ ঘরের নম্বর বের করুন। [0] লিখলে কী আসে, সেটাও চালিয়ে দেখান আর এক
        লাইনে ব্যাখ্যা করুন।
      </span>,
      <span key="4">
        <strong>MySQL বন্ধুর জন্য:</strong> Section 011 এর FILTER দেওয়া Query টা MySQL 8.4 এর জন্য লিখুন, GROUP_CONCAT
        আর CASE দিয়ে। কোন কোন জায়গা বদলাতে হলো, পাঁচ লাইনে লিখুন। MySQL হাতে থাকলে চালিয়ে দেখান, আর
        group_concat_max_len এর মান কত আছে সেটাও দেখে নিন।
      </span>,
      <span key="5">
        <strong>কাউকে শেখান:</strong> একজন বন্ধুকে এক পাতায় বোঝান string_agg আর array_agg এর পার্থক্য, ঢাকার ছয়জন
        Customer এর phone দিয়ে। কাগজে ছয়টা ঘর এঁকে দেখান কোনটা কোথায় বাদ পড়ে আর কোনটা থাকে। বন্ধুকে তিনটা প্রশ্ন
        করুন, আর তাঁর উত্তর লিখে রাখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা Sheet এর Query আর psql থেকে কপি করা ফল</span>,
      <span key="d2">COALESCE ভেতরে বনাম বাইরে নিয়ে এক লাইনের ব্যাখ্যা</span>,
      <span key="d3">MySQL সংস্করণের Query আর পাঁচ লাইনের পার্থক্য</span>,
      <span key="d4">বন্ধুকে বোঝানোর পাতাটার একটা ছবি আর তাঁর তিনটা উত্তর</span>,
    ],
  },
  practicalLab: {
    title: "string_agg আর array_agg এর Drill",
    subtitle: "নিজের island_tours এ psql দিয়ে, প্রতিটার প্রত্যাশিত ফলসহ",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, অথবা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। Module 02 এ Load করা Database টাই লাগবে। শেষ ফাইলে তারিখ নেই, তবু অভ্যাস রাখুন: SET TimeZone = 'Asia/Dhaka'।",
      },
      {
        title: "প্রথম তালিকা",
        description:
          "প্রথম ফাইল চালান। customer 1 এর লাইনে 1, 8, 17 আসছে কিনা দেখুন, তারপর ভেতরের ORDER BY মুছে আবার চালান। ছোট Data তে হয়তো কিছুই বদলাবে না, আর ঠিক এই কারণেই ORDER BY বাদ দেওয়া বিপজ্জনক।",
      },
      {
        title: "ক্রম আর Separator",
        description:
          "দ্বিতীয় ফাইল চালান। শেষ Query টা ইচ্ছা করে ভুল, ORDER BY মানের ঠিক পরে। Error আর HINT পড়ে নিজে ঠিক করুন।",
      },
      {
        title: "DISTINCT আর NULL",
        description:
          "তৃতীয় ফাইল চালান। Kolkata র phones কেন NULL, আর missing এর সংখ্যা কেন 1, পাশের মন্তব্যের সাথে মেলান।",
      },
      {
        title: "Array",
        description:
          "চতুর্থ ফাইল চালান। psql এ Array দেখায় {1,8,17} চেহারায়। first_id এর জায়গায় [0] লিখে আবার চালান, কিছু আসে কিনা দেখুন।",
      },
      {
        title: "FILTER, HAVING আর মডিউলের Report",
        description:
          "পঞ্চম আর ষষ্ঠ ফাইল চালান। Report এর প্রতিটা Column কোন লেসনের, পাশে লিখে রাখুন। Departure 14 কেন সবার শেষে, এক লাইনে ব্যাখ্যা করুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-first-lists.sql",
        code: `SELECT customer_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id) AS ids
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;                       -- 14 rows, first: 1 | 1, 8, 17

SELECT city,
       string_agg(full_name, ', ' ORDER BY full_name) AS names
FROM customers
GROUP BY city
ORDER BY city;                              -- 9 rows, Dhaka has 6 names`,
      },
      {
        language: "sql",
        filename: "02-order-separator.sql",
        code: `SELECT customer_id,
       string_agg(booking_id::text, ' > ' ORDER BY booked_at) AS story
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;                       -- 14 rows, first: 1 | 1 > 8 > 17

SELECT tour_id,
       string_agg(starts_on::text, ' | ' ORDER BY starts_on) AS dates
FROM departures
GROUP BY tour_id
ORDER BY tour_id;                           -- 8 rows, tour 1 has 4 dates

SELECT string_agg(booking_id::text ORDER BY booking_id, ', ')
FROM bookings;                              -- ERROR on purpose: misplaced ORDER BY`,
      },
      {
        language: "sql",
        filename: "03-distinct-nulls.sql",
        code: `SELECT region,
       string_agg(DISTINCT kind, ', ' ORDER BY kind) AS kinds
FROM destinations
GROUP BY region
ORDER BY region;                            -- 4 rows, Chattogram: beach, hills, island

SELECT city,
       string_agg(phone, ', ' ORDER BY customer_id) AS phones,
       count(*) - count(phone) AS missing
FROM customers
WHERE city IN ('Dhaka', 'Kolkata')
GROUP BY city
ORDER BY city;                              -- 2 rows: Dhaka 5 numbers, missing 1; Kolkata NULL, missing 1`,
      },
      {
        language: "sql",
        filename: "04-arrays.sql",
        code: `SELECT customer_id,
       array_agg(booking_id ORDER BY booked_at)      AS ids,
       (array_agg(booking_id ORDER BY booked_at))[1] AS first_id,
       cardinality(array_agg(booking_id))            AS how_many
FROM bookings
GROUP BY customer_id
HAVING count(*) > 1
ORDER BY customer_id;                       -- 9 rows, first: 1 | {1,8,17} | 1 | 3

SELECT city,
       array_agg(phone ORDER BY customer_id) AS phones
FROM customers
WHERE city = 'Dhaka'
GROUP BY city;                              -- 1 row, 6 items, the third is NULL`,
      },
      {
        language: "sql",
        filename: "05-filter-having.sql",
        code: `SELECT departure_id,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status = 'confirmed')  AS confirmed,
       string_agg(booking_id::text, ', ' ORDER BY booking_id)
         FILTER (WHERE status <> 'confirmed') AS other
FROM bookings
GROUP BY departure_id
ORDER BY departure_id;                      -- 15 rows, departure 14: NULL | 20, 24

SELECT customer_id,
       array_agg(DISTINCT status ORDER BY status) AS statuses
FROM bookings
GROUP BY customer_id
HAVING count(DISTINCT status) > 1
ORDER BY customer_id;                       -- 5 rows: 1, 6, 9, 11, 13`,
      },
      {
        language: "sql",
        filename: "06-module-report.sql",
        code: `SELECT departure_id,
       count(*)                                              AS bookings,
       sum(seats) FILTER (WHERE status <> 'cancelled')       AS seats_held,
       sum(total_bdt) FILTER (WHERE status = 'confirmed')    AS confirmed_bdt,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled')
             / count(*), 1)                                  AS cancel_pct,
       string_agg(booking_id || ':' || status, ', ' ORDER BY booking_id) AS booking_list
FROM bookings
GROUP BY departure_id
HAVING count(*) >= 2
ORDER BY confirmed_bdt DESC NULLS LAST, departure_id;   -- 9 rows, departure 1 first, 14 last`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ফাইল চালানোর আগে আন্দাজ করুন কয়টা Row আসবে আর প্রথম Row এ কী থাকবে। তারপর মিলিয়ে দেখুন। আন্দাজ আর
        ফল মিলে গেলে বুঝবেন দল, তালিকা আর ক্রম, তিনটাই আপনি মাথায় চালাতে পারছেন।
      </ContentParagraph>
    ),
  },
};
