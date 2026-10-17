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
  PrecedenceLab,
  WhereBuilderLab,
} from "../../../components/course/topics/reading-data/where-animations";
import {
  PrecedenceDiagram,
  TruthTableSplit,
  WhereSieveDiagram,
} from "../../../components/course/topics/reading-data/where-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em]";

export const whereFiltersContent: TopicData = {
  id: "where-filters",
  introduction: {
    badge: "MODULE 03 · LESSON 03",
    title: <SectionTitle>WHERE: শুধু যে Row গুলো দরকার</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          সকাল নয়টা। Island Tours এর অপারেশন ম্যানেজার শিরিন আপা চা হাতে Slack এ
          লিখলেন: &ldquo;দশ হাজার টাকার কম দামের ট্যুরগুলোর একটা তালিকা দিন তো, ছাত্রদের
          একটা দলকে পাঠাব।&rdquo; আগের দুই লেসনে আপনি শিখেছেন SELECT দিয়ে কোন Column
          চাই সেটা বলতে, আর Database একটা Query কোন ক্রমে চালায়। কিন্তু SELECT title,
          price_bdt FROM tours চালালে আসে সবগুলো ট্যুর, দামি সস্তা মিলিয়ে। শিরিন আপার
          দরকার শুধু কয়েকটা।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের পুরোটা একটা শব্দ নিয়ে: WHERE। WHERE হলো একটা শর্ত, যেটা Database
          প্রতিটা Row এর উপর খাটায়, আর যে Row শর্ত মানে শুধু সেটাই ফলাফলে রাখে। আজ
          আপনি শিখবেন সমান আর অসমান তুলনা, বড় ছোট দিয়ে সীমা টানা, লেখা, তারিখ আর
          true false এর সাথে তুলনা, AND, OR আর NOT দিয়ে কয়েকটা শর্ত জোড়া, আর সেই
          একটা ভুল যেটা অভিজ্ঞ Developer রাও করেন: AND আর OR একসাথে লিখে
          Parentheses ভুলে যাওয়া।
        </ContentParagraph>
        <ContentParagraph>
          পুরো লেসন জুড়ে Query বক্স আর অনুশীলনের বক্স আছে। প্রতিটা নতুন জিনিস দেখার পর
          সাথে সাথে নিজে একটা Query লিখবেন, আর Check চাপলে আসল PostgreSQL বলে দেবে
          উত্তর মিলল কিনা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "চালনি প্রতিটা দানাকে একই প্রশ্ন করে: দানাটা ছিদ্রের চেয়ে ছোট কিনা। ছোট হলে নিচে নামে, বড় হলে উপরে থেকে যায়। WHERE ও প্রতিটা Row কে একটাই প্রশ্ন করে, আর উত্তর true হলে তবেই Row টা ফলাফলে নামে।",
      author: "WHERE",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>পুরো Table চাই না, কয়েকটা Row চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা Table কে একটা খাতার পাতার মতো ভাবুন। উপরে ঘরের নাম, মানে Column,
                আর নিচে লাইনের পর লাইন তথ্য, মানে Row। Lesson 01 এ আপনি শিখেছেন SELECT
                দিয়ে কোন Column গুলো চান সেটা বলতে। সেটা পাতাকে খাড়াখাড়ি কাটা: title আর
                price_bdt রাখুন, বাকি ঘরগুলো বাদ দিন।
              </ContentParagraph>
              <ContentParagraph>
                WHERE কাটে আড়াআড়ি। সে ঠিক করে কোন লাইনগুলো থাকবে। SELECT বলে
                &ldquo;কোন তথ্য&rdquo;, WHERE বলে &ldquo;কাদের তথ্য&rdquo;। দুটো একসাথে
                দিলে পাতা থেকে আপনি ঠিক সেই ছোট্ট টুকরোটা কেটে নেন যেটা দরকার।
              </ContentParagraph>
              <ContentParagraph>
                এখন Island Tours এর tours Table এ মাত্র নয়টা Row, তাই চোখ বুলিয়েই খুঁজে
                নেওয়া যায়। কিন্তু bookings Table এ একদিন লাখো Row থাকবে। সব Row
                Database থেকে App এ এনে তারপর App এর ভেতরে ছাঁকলে প্রতিবার লাখো Row
                Network দিয়ে আসবে, Memory তে বসবে, আর ফেলে দেওয়া হবে। তাই ছাঁকার কাজটা
                Database কেই করতে দেওয়া হয়। সে ছাঁকার জন্যই বানানো, আর Module 13 এ দেখবেন
                Index এর সাহায্যে সে পুরো Table না ঘেঁটেই দরকারি Row গুলো খুঁজে নিতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "SELECT বাছে Column, WHERE বাছে Row",
          content: (
            <ContentParagraph>
              একটা Query তে দুটো আলাদা সিদ্ধান্ত থাকে। কোন Column দেখাবেন, সেটা SELECT
              এর তালিকায়। কোন Row রাখবেন, সেটা WHERE এর শর্তে। WHERE না লিখলে সব Row
              আসে। WHERE লিখলে শুধু সেই Row গুলো, যেগুলোর জন্য শর্তটা true।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE ছাড়া আর WHERE সহ"
              query={`SELECT title, price_bdt
FROM tours;

SELECT title, price_bdt
FROM tours
WHERE price_bdt < 10000;`}
              caption="Run চাপুন। প্রথম Query ফেরত দেয় নয়টা ট্যুর, দ্বিতীয়টা চারটা: Cox's Bazar Beach Weekend, Sajek Valley Cloud Trip, Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day। শিরিন আপার তালিকা তৈরি।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "the-sieve",
      subHeader: { index: "002", title: "The Sieve" },
      title: <SectionTitle>WHERE কীভাবে কাজ করে: প্রতিটা Row কে একটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                WHERE এর পরে যা লেখেন, সেটাকে বলে শর্ত, ইংরেজিতে Condition বা Predicate।
                শর্তটা আসলে একটা ছোট প্রশ্ন, যার উত্তর হয় হ্যাঁ নয়তো না: এই Row এর
                price_bdt কি দশ হাজারের কম? Database নয়টা Row এর প্রত্যেকটার জন্য প্রশ্নটা
                আলাদা করে করে। যার উত্তর true, সে থাকে। যার উত্তর false, সে বাদ পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                বাদ পড়া মানে মুছে যাওয়া না। Table এ নয়টা ট্যুরই যেমন ছিল তেমন থাকে। WHERE
                শুধু ঠিক করে এই একটা Query র ফলাফলে কোন Row গুলো আসবে। পরের Query তে অন্য
                শর্ত দিলে অন্য Row আসবে। Data বদলানোর কাজ UPDATE আর DELETE এর, সেটা
                Module 10 এ।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম কথা মনে রাখুন। উত্তর আসলে তিন রকম হতে পারে: true, false, আর
                অজানা। অজানা আসে যখন Row এ কোনো মান নেই, মানে NULL। WHERE শুধু true রাখে,
                তাই false আর অজানা দুটোই বাদ পড়ে। এই তৃতীয় উত্তরটা নিয়ে পুরো একটা লেসন আছে,
                Lesson 05। আজ শুধু মাথায় রাখুন যে এরকম কিছু আছে, আর লেসনের শেষ দিকে একবার
                সেটা নিজের চোখে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereSieveDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                WHERE বসে FROM এর ঠিক পরে। লেখার ক্রম তাই এরকম: SELECT, তারপর FROM,
                তারপর WHERE, আর পরে আসবে ORDER BY আর LIMIT। কিন্তু Lesson 02 তে দেখেছেন,
                Database এগুলো লেখার ক্রমে চালায় না। সে আগে FROM দিয়ে Table টা ধরে,
                তারপর WHERE দিয়ে Row ছাঁকে, আর একদম শেষে SELECT এর তালিকা দেখে কোন Column
                দেখাবে।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা দারুণ সুবিধা আছে। WHERE যখন চলে, তখন Table এর সব Column তার হাতে।
                তাই যে Column ফলাফলে দেখাচ্ছেন না, তার উপরও শর্ত দেওয়া যায়। নিচের Query
                শুধু title দেখায়, কিন্তু ছাঁকে max_seats দিয়ে, যেটা ফলাফলে নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে Column দেখাচ্ছেন না, তার উপর শর্ত"
              query={`SELECT title
FROM tours
WHERE max_seats >= 20;`}
              caption="চারটা ট্যুর আসে, যেগুলোতে অন্তত বিশজন একসাথে যেতে পারেন। max_seats ফলাফলে নেই, তবু শর্ত ঠিকই কাজ করেছে। সংখ্যাগুলো দেখতে চাইলে SELECT এর তালিকায় max_seats যোগ করে আবার চালান।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "equal",
      subHeader: { index: "003", title: "Equal and Not Equal" },
      title: <SectionTitle>= আর &lt;&gt;: মেলে, নাকি মেলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                সবচেয়ে সরল শর্ত হলো সমান। SQL এ সমান চিহ্ন একটাই: <code className={CODE}>=</code>।
                JavaScript বা Python থেকে এলে হাত নিজে থেকেই দুটো লিখতে চায়, ==। SQL এ
                == বলে কিছু নেই, PostgreSQL সাথে সাথে Error দেয়। SQL এ মান বসানোর জন্য
                আলাদা কোনো চিহ্ন নেই বলে একটা = দিয়েই তুলনা হয়।
              </ContentParagraph>
              <ContentParagraph>
                লেখা, মানে Text এর মান বসে এক Quote এর ভেতরে: <code className={CODE}>city = &apos;Dhaka&apos;</code>।
                সংখ্যা বসে Quote ছাড়া: <code className={CODE}>tour_id = 3</code>। এই দুই
                নিয়ম গুলিয়ে ফেলা প্রথম সপ্তাহের সবচেয়ে চেনা ভুল, তাই একবার জোরে পড়ে নিন:
                লেখা Quote এ, সংখ্যা খালি।
              </ContentParagraph>
              <ContentParagraph>
                মেলে না বোঝাতে আছে দুটো চিহ্ন: <code className={CODE}>&lt;&gt;</code> আর{" "}
                <code className={CODE}>!=</code>। দুটোর কাজ একদম এক। &lt;&gt; হলো SQL
                Standard এর চিহ্ন, আর PostgreSQL এর Docs বলে != আসলে &lt;&gt; এর আরেক নাম,
                যেটা Query পড়ার একদম শুরুতেই &lt;&gt; এ বদলে যায়। তাই যেটা খুশি লিখুন,
                তবে একটা Project এ একটাই রাখুন। এই ট্র্যাক &lt;&gt; লিখবে, কারণ সব
                Database সেটা চেনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সমান আর অসমান"
              query={`SELECT full_name, city
FROM customers
WHERE city = 'Dhaka';

SELECT booking_id, status
FROM bookings
WHERE status <> 'confirmed';`}
              caption="প্রথমটায় ছয়জন Customer, সবাই Dhaka র। দ্বিতীয়টায় সাতটা Booking, যেগুলো confirmed না: তিনটা cancelled আর চারটা pending। <> এর জায়গায় != লিখে চালান, ফলাফল হুবহু এক থাকবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1 · Easy"
              task={
                <>
                  Dhaka শহরে থাকেন এমন সব Customer এর <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>phone</code> বের করুন। এই দুটো Column ই চাই, এই ক্রমে।
                </>
              }
              hint={
                <>
                  Table হলো customers, শর্তের Column হলো city। শহরের নাম লেখা, তাই এক Quote এর ভেতরে,
                  আর বানান হুবহু: বড় হাতের D।
                </>
              }
              solution={`SELECT full_name, phone
FROM customers
WHERE city = 'Dhaka';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "compare",
      subHeader: { index: "004", title: "Bigger and Smaller" },
      title: <SectionTitle>&lt;, &gt;, &lt;=, &gt;=: সীমা টানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                বাজারে গিয়ে আপনি বলেন &ldquo;পাঁচশো টাকার মধ্যে কিছু দেখান&rdquo;। এটা
                সীমা টানা। SQL এ সীমা টানার চারটা চিহ্ন: ছোট (&lt;), বড় (&gt;), ছোট
                অথবা সমান (&lt;=), আর বড় অথবা সমান (&gt;=)। সমান চিহ্নটা সবসময় পরে বসে:
                &lt;= লিখতে হয়, =&lt; না।
              </ContentParagraph>
              <ContentParagraph>
                এখানে সবচেয়ে বেশি ভুল হয় সীমানার ঠিক উপরের Row টা নিয়ে। Sajek Valley
                Cloud Trip এর দাম ঠিক 9500.00। আপনার প্রশ্ন যদি হয় &ldquo;৯৫০০ টাকার
                কম&rdquo;, তাহলে Sajek আসবে না। &ldquo;৯৫০০ টাকা পর্যন্ত&rdquo; হলে আসবে।
                মুখের কথায় এই দুটো প্রায় এক শোনায়, কিন্তু Query তে একটা চিহ্নের তফাত, আর
                ফলাফলে একটা Row এর। কেউ সীমা বললে আগে জিজ্ঞেস করে নিন, সীমানার মানটা
                ভেতরে না বাইরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সীমানার ঠিক উপরের Row"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt < 9500;

SELECT title, price_bdt
FROM tours
WHERE price_bdt <= 9500;`}
              caption="প্রথমটায় তিনটা ট্যুর, দ্বিতীয়টায় চারটা। বাড়তি Row টা Sajek Valley Cloud Trip, যার দাম ঠিক সীমানায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["চিহ্ন", "মানে", "Island Tours এ উদাহরণ", "কয়টা Row"],
          rows: [
            ["=", "সমান", "city = 'Dhaka'", "৬ (customers)"],
            ["<> বা !=", "সমান না", "status <> 'confirmed'", "৭ (bookings)"],
            ["<", "ছোট", "price_bdt < 10000", "৪ (tours)"],
            [">", "বড়", "price_bdt > 15000", "৩ (tours)"],
            ["<=", "ছোট অথবা সমান", "seats_left <= 12", "৫ (departures)"],
            [">=", "বড় অথবা সমান", "max_seats >= 20", "৪ (tours)"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                সংখ্যার তুলনা ঠিকঠাক চলে যতক্ষণ Column এর Type সত্যিই সংখ্যা। price_bdt এর
                Type numeric, তাই 12500 আর 12500.00 তার কাছে একই মান, আর দশমিকের পরের শূন্য
                লিখলেন কি না তাতে কিছু আসে যায় না। কেউ যদি ভুল করে price_bdt &gt; &apos;9000&apos;
                লিখে ফেলেন, PostgreSQL তখনও বুঝে নেয়, কারণ Column টা সংখ্যার বলে সে Quote এর
                লেখাটাকে সংখ্যায় বদলে নেয়। তবু অভ্যাস হিসেবে সংখ্যা Quote ছাড়াই লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                বিপদ হয় যখন সংখ্যাগুলোকেই লেখা হিসেবে রাখা হয়, যেমন কোনো Table এ দাম বা
                ফোন নম্বর text Column এ। লেখার তুলনা চলে অভিধানের ক্রমে, অক্ষর ধরে ধরে। তখন
                &apos;100&apos; কে &apos;9&apos; এর চেয়ে ছোট ধরা হয়, কারণ প্রথম অক্ষর 1, যেটা 9 এর আগে
                আসে। নিচের বক্সে নিজের চোখে দেখুন। সংখ্যা সবসময় সংখ্যার Type এ রাখা কেন জরুরি,
                তার পুরো গল্প Module 09 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লেখা হিসেবে সংখ্যা"
              query={`SELECT '100' < '9' AS as_text,
       100 < 9     AS as_number;`}
              caption="as_text হলো t, as_number হলো f। লেখা হিসেবে '100' আগে আসে কারণ 1 অক্ষরটা 9 এর আগে। সংখ্যা হিসেবে 100 অবশ্যই বড়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2 · Easy"
              task={
                <>
                  অপারেশন টিম জানতে চায় কোন Departure গুলোতে ১২টা বা তার কম সিট খালি আছে। বের করুন{" "}
                  <code className={CODE}>departure_id</code>, <code className={CODE}>starts_on</code> আর{" "}
                  <code className={CODE}>seats_left</code>।
                </>
              }
              hint={
                <>
                  Table হলো departures। &ldquo;১২ বা তার কম&rdquo; মানে ১২ নিজেও আছে, তাই কোন চিহ্নটা লাগবে
                  ভাবুন।
                </>
              }
              solution={`SELECT departure_id, starts_on, seats_left
FROM departures
WHERE seats_left <= 12;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "text",
      subHeader: { index: "005", title: "Text Compares" },
      title: <SectionTitle>লেখার সাথে তুলনা: Quote, বড় হাত আর ছোট হাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                PostgreSQL লেখা মেলায় অক্ষরে অক্ষরে। &apos;Dhaka&apos; আর &apos;dhaka&apos;
                তার কাছে দুটো আলাদা লেখা, কারণ প্রথম অক্ষর আলাদা। শেষে একটা ফাঁকা জায়গা
                থাকলেও আলাদা: &apos;Dhaka &apos; আর &apos;Dhaka&apos; মেলে না। তাই Data তে
                শহরের নাম কীভাবে লেখা আছে, আগে সেটা দেখে নিয়ে তারপর শর্ত লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                লেখার ভেতরেই যদি একটা Quote থাকে, যেমন Cox&apos;s Bazar, তাহলে সেই Quote
                দুইবার লিখতে হয়: <code className={CODE}>&apos;Cox&apos;&apos;s Bazar&apos;</code>। দুটো Quote
                পাশাপাশি দেখলে PostgreSQL বোঝে এটা লেখার অংশ, লেখার শেষ না। Module 01 এর
                Lesson 05 এ এই নিয়মটা একবার দেখেছেন, এবার WHERE এর ভেতরে কাজে লাগছে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস: Double Quote লেখার জন্য না। PostgreSQL এ &quot;Dhaka&quot;
                মানে Dhaka নামের একটা Column, তাই সে সেই নামের Column খোঁজে আর না পেয়ে
                Error দেয়। এক Quote মানে লেখা, Double Quote মানে নাম। এই নিয়ম ভাঙলে যা
                হয়, সেটা লেসনের Common Mistakes অংশে নিজে চালিয়ে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="অক্ষরে অক্ষরে মেলানো"
              query={`SELECT full_name
FROM customers
WHERE city = 'dhaka';

SELECT name
FROM destinations
WHERE name = 'Cox''s Bazar';

SELECT 'Dhaka ' = 'Dhaka' AS with_space,
       'Dhaka'  = 'Dhaka' AS exact;`}
              caption="ছোট হাতের dhaka দিয়ে শূন্য Row, কারণ Data তে আছে Dhaka। দুই Quote দিয়ে Cox's Bazar ঠিকঠাক মেলে। শেষ Query দেখায় শেষের একটা ফাঁকা জায়গাই মিল ভেঙে দেয়: with_space হলো f, মানে false।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                বড় ছোটর চিহ্নগুলো লেখার সাথেও চলে। লেখায় ছোট মানে অভিধানের ক্রমে আগে।{" "}
                <code className={CODE}>full_name &lt; &apos;C&apos;</code> লিখলে আসে সেই নামগুলো, যেগুলো
                অভিধানে C এর আগে বসে। Island Tours এ দুজন: Arif Chowdhury আর Aiman
                Zulkifli। কোন অক্ষর কোনটার আগে, সেটা ঠিক করে Collation নামের একটা নিয়ম, যেটা
                Module 09 এ দেখবেন। আপাতত ইংরেজি অক্ষরে এটা অভিধানের মতোই আচরণ করে।
              </ContentParagraph>
              <ContentParagraph>
                ছোট হাত বড় হাত না মেনে খুঁজতে চাইলে PostgreSQL এর আলাদা একটা হাতিয়ার আছে,
                ILIKE। সেটা পরের লেসনের বিষয়, যেখানে নামের অংশ মিলিয়ে খোঁজাও শিখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                MySQL 8.4 এ city = &apos;dhaka&apos; চালালে ছয়টা Row আসে, শূন্য না। MySQL এর
                Default Collation (utf8mb4_0900_ai_ci) বড় হাত ছোট হাত আলাদা করে না।
                তাই MySQL এর কোনো ভিডিওতে ছোট হাতের নাম দিয়ে খুঁজে Row পেতে দেখলে
                PostgreSQL এ একই Query চালিয়ে অবাক হবেন না।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা পার্থক্য আরও বিপজ্জনক: MySQL এ &quot;Dhaka&quot; Double Quote এ
                লিখলেও সেটা লেখা হিসেবে ধরে, আর ছয়টা Row দেয়। PostgreSQL এ সেটা Error।
                দুটো Database এ হাত চালাতে চাইলে সবসময় এক Quote লিখুন, তাহলে দুই জায়গাতেই
                ঠিক থাকবে। (দুটোই এই লেসনের জন্য MySQL 8.4.11 এ চালিয়ে দেখা।)
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "dates",
      subHeader: { index: "006", title: "Dates and Times" },
      title: <SectionTitle>তারিখ আর সময়ের সাথে তুলনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তারিখও এক Quote এ লিখতে হয়, আর ক্রম হলো বছর, মাস, দিন:{" "}
                <code className={CODE}>&apos;2026-11-01&apos;</code>। এই ধরন সারা পৃথিবীতে একই, তাই কোনো
                Database কখনো গুলিয়ে ফেলে না যে 01 মাস না দিন। starts_on Column এর Type
                হলো date, তাই PostgreSQL Quote এর লেখাটাকে নিজে থেকেই তারিখে বদলে নিয়ে
                তুলনা করে।
              </ContentParagraph>
              <ContentParagraph>
                একটা মাসের সব Departure চাইলে সবচেয়ে নিরাপদ অভ্যাস হলো দুই দিকে সীমা
                দেওয়া: মাসের প্রথম দিন থেকে শুরু, আর পরের মাসের প্রথম দিনের আগে শেষ।
                নভেম্বরের জন্য <code className={CODE}>starts_on &gt;= &apos;2026-11-01&apos; AND starts_on &lt; &apos;2026-12-01&apos;</code>।
                শুরুতে &gt;=, শেষে শুধু &lt;। এই অভ্যাস কেন এত জরুরি, সেটা বোঝা যায় সময়
                সহ Column এ।
              </ContentParagraph>
              <ContentParagraph>
                bookings Table এর booked_at শুধু তারিখ না, সাথে ঘণ্টা মিনিটও আছে, আর
                আছে Time Zone, যেটা Module 02 তে দেখেছেন। এমন Column এর সাথে
                &apos;2026-10-01&apos; তুলনা করলে PostgreSQL সেটাকে ধরে ১ অক্টোবরের একদম শুরু,
                রাত বারোটা, এই বক্সে Dhaka র সময়ে। তাই booked_at &lt;= &apos;2026-10-01&apos;
                লিখলে ১ অক্টোবর দুপুর ১২টা ২৫ এর Booking টা বাদ পড়ে যায়, যদিও মুখে বলবেন
                &ldquo;১ অক্টোবর পর্যন্ত&rdquo;। পরের দিনের শুরুর আগে পর্যন্ত, মানে
                &lt; &apos;2026-10-02&apos; লিখলে সেটা ঠিকঠাক আসে। এই ফাঁদটা পরের লেসনে BETWEEN
                এর সাথে আরও বিস্তারিত দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক মাসের Departure, আর দিনের শেষের ফাঁদ"
              query={`SELECT departure_id, tour_id, starts_on
FROM departures
WHERE starts_on >= '2026-11-01'
  AND starts_on <  '2026-12-01';

SELECT count(*) AS upto_oct_1
FROM bookings
WHERE booked_at <= '2026-10-01';

SELECT count(*) AS before_oct_2
FROM bookings
WHERE booked_at < '2026-10-02';`}
              caption="নভেম্বরে চারটা Departure। তারপর দুটো গোনা: প্রথমটা ১৫, দ্বিতীয়টা ১৬। বাড়তি একটা হলো Booking 14, যেটা ১ অক্টোবর দুপুর ১২টা ২৫ এ হয়েছিল। <= '2026-10-01' তাকে ধরতে পারেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আজকের তারিখ দিয়ে লেখা Query",
          content: (
            <ContentParagraph>
              PostgreSQL এ আজকের তারিখ পাওয়া যায় CURRENT_DATE দিয়ে, আর বাস্তবের App এ
              &ldquo;সামনের Departure&rdquo; বোঝাতে starts_on &gt;= CURRENT_DATE লেখা হয়।
              কিন্তু এমন Query র ফলাফল প্রতিদিন বদলায়, কারণ আজকের তারিখ বদলায়। এই
              ট্র্যাকের Sample Data নির্দিষ্ট তারিখের, তাই অনুশীলনে সবসময় নির্দিষ্ট তারিখ
              লেখা হবে, যাতে আজ আর ছয় মাস পরে একই উত্তর আসে। তারিখ নিয়ে আরও কাজ Module 04
              এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3 · Medium"
              task={
                <>
                  ডিসেম্বর 2026 এ রওনা দেবে এমন সব Departure এর <code className={CODE}>departure_id</code> আর{" "}
                  <code className={CODE}>starts_on</code> বের করুন।
                </>
              }
              hint={
                <>
                  দুই দিকে সীমা: ১ ডিসেম্বর থেকে শুরু (&gt;=), আর ১ জানুয়ারি 2027 এর আগে শেষ (&lt;)। দুটো শর্ত
                  জোড়া লাগবে AND দিয়ে।
                </>
              }
              solution={`SELECT departure_id, starts_on
FROM departures
WHERE starts_on >= '2026-12-01'
  AND starts_on <  '2027-01-01';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "booleans",
      subHeader: { index: "007", title: "Booleans" },
      title: <SectionTitle>true আর false এর Column: is_active</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                tours Table এ is_active নামে একটা Column আছে, যার Type boolean। এর মান
                হয় true, নয়তো false। psql আর এই Query বক্স সেটা দেখায় সংক্ষেপে, t আর f।
                এই Column এর মান নিজেই একটা হ্যাঁ বা না, তাই শর্ত হিসেবে সরাসরি লেখা যায়:{" "}
                <code className={CODE}>WHERE is_active</code>। এর মানে &ldquo;যেখানে is_active true&rdquo;।
              </ContentParagraph>
              <ContentParagraph>
                একই কথা আরও কয়েকভাবে লেখা যায়, আর সবগুলো একই আটটা ট্যুর দেয়:{" "}
                <code className={CODE}>is_active = true</code>, <code className={CODE}>is_active IS TRUE</code>।
                উল্টোটা চাইলে <code className={CODE}>NOT is_active</code>,{" "}
                <code className={CODE}>is_active = false</code> অথবা <code className={CODE}>is_active IS FALSE</code>।
                = true আর IS TRUE এর মধ্যে একটা পার্থক্য আছে, কিন্তু সেটা শুধু NULL এর বেলায়
                দেখা দেয়, তাই Lesson 05 এর জন্য তোলা রইল।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL Quote এর ভেতরে কয়েক রকম লেখাকেও boolean হিসেবে চেনে। Docs
                অনুযায়ী true বোঝাতে &apos;true&apos;, &apos;yes&apos;, &apos;on&apos;, &apos;1&apos;, আর
                false বোঝাতে &apos;false&apos;, &apos;no&apos;, &apos;off&apos;, &apos;0&apos;, সাথে এদের
                শুরুর অক্ষর যেমন &apos;t&apos; বা &apos;n&apos;। তাই is_active = &apos;no&apos; চালালে
                বন্ধ ট্যুরটা আসে। কিন্তু &apos;maybe&apos; লিখলে PostgreSQL বলে invalid input
                syntax for type boolean। Code পড়তে সুবিধার জন্য এই ট্র্যাক সবসময় true আর false
                লিখবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চালু আর বন্ধ ট্যুর"
              query={`SELECT count(*) AS active_tours
FROM tours
WHERE is_active;

SELECT title, is_active
FROM tours
WHERE NOT is_active;`}
              caption="আটটা ট্যুর চালু, একটা বন্ধ: Saint Martin Luxury Stay, যার is_active দেখাচ্ছে f। WHERE NOT is_active এর জায়গায় WHERE is_active = false লিখে দেখুন, একই উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই বন্ধ ট্যুরটা Sample Data তে ইচ্ছা করে রাখা একটা ফাঁদ। তার একটা Departure এখনো
              আছে, ১৪ ফেব্রুয়ারি 2027 এ। Website এর &ldquo;বুক করুন&rdquo; তালিকা বানানোর
              সময় কেউ যদি শুধু তারিখ দিয়ে ছাঁকে আর is_active ভুলে যায়, তাহলে একটা বন্ধ
              পণ্য বিক্রি শুরু হয়ে যাবে, আর কোনো Error ও আসবে না। Customer এর সামনে কিছু
              দেখানোর প্রতিটা Query তে নিজেকে একবার জিজ্ঞেস করুন, বন্ধ জিনিস বাদ দিয়েছি তো?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4 · Easy"
              task={
                <>
                  যে ট্যুরগুলো এখন বন্ধ, মানে is_active false, সেগুলোর <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code> বের করুন।
                </>
              }
              hint={<>NOT is_active, is_active = false বা is_active IS FALSE, তিনটার যেকোনোটা চলবে।</>}
              solution={`SELECT title, price_bdt
FROM tours
WHERE NOT is_active;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL এ BOOLEAN আসলে একটা ছোট সংখ্যার Column, TINYINT(1)। তাই MySQL বন্ধ
              ট্যুরটার is_active দেখায় 0, f না, আর চালু গুলোর 1। শর্ত লেখার ধরন অবশ্য একই
              থাকে: WHERE is_active, WHERE NOT is_active, = TRUE আর IS FALSE, সবগুলো MySQL
              8.4 এ চালিয়ে একই উত্তর পাওয়া গেছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "and",
      subHeader: { index: "008", title: "AND" },
      title: <SectionTitle>AND: দুটো শর্তই মানতে হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                বাস্তবের প্রশ্নে প্রায় কখনো একটা শর্ত থাকে না। &ldquo;পনেরো হাজারের কম
                দামের এমন ট্যুর, যেটা অন্তত তিন দিনের&rdquo;: এখানে দুটো শর্ত, আর দুটোই
                মানতে হবে। SQL এ এই &ldquo;দুটোই&rdquo; এর নাম AND।
              </ContentParagraph>
              <ContentParagraph>
                AND এর নিয়ম সহজ: দুই পাশ true হলে তবেই ফল true। এক পাশ false হলেই পুরোটা
                false। তাই AND দিয়ে একটা শর্ত যোগ করলে ফলাফল কখনো বাড়ে না, হয় ছোট হয় নয়তো
                একই থাকে। চাকরির বিজ্ঞাপনের মতো ভাবুন: &ldquo;Graduate এবং দুই বছরের
                অভিজ্ঞতা&rdquo;, প্রতিটা নতুন &ldquo;এবং&rdquo; প্রার্থীর সংখ্যা কমায়।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা শর্ত পুরো বাক্য হতে হবে। মুখে বলি &ldquo;পাঁচ হাজারের বেশি আর দশ
                হাজারের কম&rdquo;, কিন্তু SQL এ <code className={CODE}>price_bdt &gt; 5000 AND &lt; 10000</code>{" "}
                লিখলে PostgreSQL বলে syntax error at or near &quot;&lt;&quot;। দ্বিতীয় শর্তেও
                Column এর নাম লাগবে: <code className={CODE}>price_bdt &gt; 5000 AND price_bdt &lt; 10000</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TruthTableSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো শর্ত একসাথে"
              query={`SELECT title, price_bdt, duration_days
FROM tours
WHERE price_bdt < 15000
  AND duration_days >= 3;`}
              caption="দুটো ট্যুর দুই শর্তই মানে: Saint Martin Island Escape (12500, ৩ দিন) আর Bandarban Hill Trek (14000, ৪ দিন)। শুধু প্রথম শর্ত দিলে ছয়টা আসত, দ্বিতীয়টা যোগ করায় নেমে দুটো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5 · Easy"
              task={
                <>
                  চালু আছে এমন ট্যুর, যেগুলো অন্তত ৩ দিনের। বের করুন <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>duration_days</code>।
                </>
              }
              hint={<>দুটো শর্ত: is_active, আর duration_days &gt;= 3। মাঝে AND।</>}
              solution={`SELECT title, duration_days
FROM tours
WHERE is_active
  AND duration_days >= 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "or",
      subHeader: { index: "009", title: "OR" },
      title: <SectionTitle>OR: যেকোনো একটা মানলেই চলবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                OR হলো উদার বন্ধু। দুই শর্তের যেকোনো একটা true হলেই ফল true। দুটোই true
                হলেও true। শুধু দুটোই false হলে false। তাই OR দিয়ে শর্ত যোগ করলে ফলাফল
                কখনো কমে না, বাড়ে বা একই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                মার্কেটিং টিম দুই ধরনের মানুষের জন্য একটা Email পাঠাতে চায়: যাঁরা কম
                বাজেটে ঘুরতে চান, আর যাঁরা লম্বা ছুটি কাটাতে চান। তাই তাদের দরকার এমন ট্যুর
                যার দাম আট হাজারের কম, অথবা যেটা চার দিন বা তার বেশি। একটা ট্যুর দুই দলেই
                পড়লে সে একবারই আসে, দুইবার না। OR Row গুনে দ্বিগুণ করে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যেকোনো একটা"
              query={`SELECT title, price_bdt, duration_days
FROM tours
WHERE price_bdt < 8000
   OR duration_days >= 4;`}
              caption="চারটা ট্যুর: Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day কম দামের জন্য, Bandarban Hill Trek আর Saint Martin Luxury Stay লম্বা হওয়ার জন্য। খেয়াল করুন, বন্ধ ট্যুরটাও ঢুকে পড়েছে, কারণ শর্তে is_active নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ তিনটা শর্ত নিয়ে খেলুন। যেকোনো শর্ত চালু বা বন্ধ করুন, AND আর OR
              বদলান, পুরোটাকে NOT দিয়ে উল্টে দিন, আর দেখুন নয়টা ট্যুরের কোনটা থাকে আর
              কোনটা বাদ পড়ে। &ldquo;শুরু থেকে এক এক Row&rdquo; চাপলে Database এর মতো করে একটা
              একটা Row পরীক্ষা হতে দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhereBuilderLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6 · Easy"
              task={
                <>
                  ফাইন্যান্স টিম সেই Payment গুলো দেখতে চায় যেগুলো ব্যর্থ হয়েছে অথবা টাকা ফেরত দেওয়া হয়েছে, মানে
                  status failed অথবা refunded। বের করুন <code className={CODE}>payment_id</code>,{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>status</code>।
                </>
              }
              hint={<>Table হলো payments। status এর দুটো মানের যেকোনোটা চলবে, তাই OR।</>}
              solution={`SELECT payment_id, booking_id, status
FROM payments
WHERE status = 'failed'
   OR status = 'refunded';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "not",
      subHeader: { index: "010", title: "NOT" },
      title: <SectionTitle>NOT: শর্তটা উল্টে দেওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                NOT একটা শর্তের উত্তর উল্টে দেয়: true কে false, false কে true। সরল শর্তে
                NOT প্রায়ই অন্যভাবেও লেখা যায়। <code className={CODE}>NOT country = &apos;Bangladesh&apos;</code>{" "}
                আর <code className={CODE}>country &lt;&gt; &apos;Bangladesh&apos;</code> একই তিনজন বিদেশি
                Customer দেয়: India, Malaysia আর United Kingdom থেকে।
              </ContentParagraph>
              <ContentParagraph>
                NOT এর আসল কাজ দেখা যায় যখন সে একটা পুরো দলকে উল্টায়। ধরুন প্রশ্ন হলো:
                এমন Booking যেটা &ldquo;confirmed আর দুই বা বেশি সিটের&rdquo; দলের বাইরে।
                <code className={CODE}> NOT (status = &apos;confirmed&apos; AND seats &gt;= 2)</code>। এখানে
                একটা পুরনো নিয়ম কাজে লাগে, যাকে বলে De Morgan এর নিয়ম: &ldquo;দুটোই না&rdquo;
                মানে &ldquo;অন্তত একটা না&rdquo;। তাই একই প্রশ্ন লেখা যায়{" "}
                <code className={CODE}>status &lt;&gt; &apos;confirmed&apos; OR seats &lt; 2</code> দিয়ে। দুটোই
                ১১টা Booking দেয়।
              </ContentParagraph>
              <ContentParagraph>
                একটা সতর্কতা। NOT শুধু তার ঠিক পরের শর্তটাকে উল্টায়, AND এর চেয়ে সে বেশি
                শক্ত করে লেগে থাকে। NOT a AND b মানে (NOT a) AND b, NOT (a AND b) না। পুরো দল
                উল্টাতে চাইলে Parentheses দিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT আর তার সমান কথাগুলো"
              query={`SELECT full_name, country
FROM customers
WHERE NOT country = 'Bangladesh';

SELECT count(*) AS with_not
FROM bookings
WHERE NOT (status = 'confirmed' AND seats >= 2);

SELECT count(*) AS de_morgan
FROM bookings
WHERE status <> 'confirmed' OR seats < 2;`}
              caption="তিনজন বিদেশি Customer, তারপর দুটো গোনা, দুটোই ১১। একই প্রশ্ন, দুইভাবে লেখা। যেটা পড়তে সহজ, সেটাই লিখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise · NOT"
              task={
                <>
                  Island Tours দেশের বাইরের Customer দের জন্য ইংরেজিতে আলাদা একটা Newsletter পাঠাবে। যাঁদের{" "}
                  <code className={CODE}>country</code> Bangladesh না, তাঁদের <code className={CODE}>full_name</code>,{" "}
                  <code className={CODE}>city</code> আর <code className={CODE}>country</code> বের করুন।
                </>
              }
              hint={<>NOT country = &apos;Bangladesh&apos; অথবা country &lt;&gt; &apos;Bangladesh&apos;, দুটোই চলবে।</>}
              solution={`SELECT full_name, city, country
FROM customers
WHERE country <> 'Bangladesh';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "precedence",
      subHeader: { index: "011", title: "Precedence" },
      title: <SectionTitle>AND আগে, OR পরে: Parentheses কেন জরুরি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার সেই ভুলটা, যেটার জন্য পুরো একটা অংশ। Island Tours বড় দলের জন্য একটা
                ছাড় দিতে চায়। মার্কেটিং টিম চাইল সেই সব Booking, যেগুলো confirmed অথবা
                pending, আর যেখানে সিট তিনটা বা তার বেশি। একজন Developer লিখলেন:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>WHERE status = &apos;confirmed&apos; OR status = &apos;pending&apos; AND seats &gt;= 3</code>
              </ContentParagraph>
              <ContentParagraph>
                দেখতে ঠিক লাগছে, মুখে বলা কথার মতোই সাজানো। কিন্তু ফলাফল এল ১৮টা Booking,
                যেখানে আসল উত্তর ৬টা। ছাড়ের Email চলে গেল বারোজন এমন মানুষের কাছে, যাঁরা
                একা বা দুজনে বুক করেছেন। কোনো Error আসেনি, শুধু ভুল উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                কারণ হলো অঙ্কের মতো SQL এর শর্তেও কে আগে জোড়া লাগবে তার নিয়ম আছে।
                অঙ্কে 2 + 3 × 4 মানে 2 + (3 × 4), কারণ গুণ আগে হয়। SQL এ AND আগে জোড়া
                লাগে, OR পরে। PostgreSQL এর Docs এর ক্রম অনুযায়ী আগে হয় তুলনা (=, &lt;
                ইত্যাদি), তারপর NOT, তারপর AND, আর সবশেষে OR। তাই উপরের লেখাটা PostgreSQL
                পড়ে এভাবে: confirmed, অথবা (pending আর তিন সিটের বেশি)। প্রতিটা confirmed
                Booking ঢুকে যায়, সিট যতই কম হোক।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PrecedenceDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক জোড়া Parentheses, বারো Row এর তফাত"
              query={`SELECT count(*) AS without_parentheses
FROM bookings
WHERE status = 'confirmed' OR status = 'pending' AND seats >= 3;

SELECT count(*) AS with_parentheses
FROM bookings
WHERE (status = 'confirmed' OR status = 'pending') AND seats >= 3;`}
              caption="১৮ আর ৬। দুটো Query তে অক্ষর একই, শুধু এক জোড়া Parentheses বেশি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PrecedenceLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              এই নিয়মে MySQL আর PostgreSQL এক। MySQL 8.4 এ Parentheses ছাড়া একই Query ১৮টা
              Booking দেয়, Parentheses সহ ৬টা, এই লেসনের জন্য দুটোই চালিয়ে দেখা হয়েছে। AND আগে,
              OR পরে, এটা SQL এর প্রায় সব Database এর সাধারণ নিয়ম, তাই একবার শিখলে সবখানে কাজে
              লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "একটা নিয়ম, কোনো ব্যতিক্রম নেই",
          content: (
            <ContentParagraph>
              একই শর্তে AND আর OR দুটোই থাকলে সবসময় Parentheses দিন, এমনকি যখন জানেন
              Parentheses ছাড়াও ঠিক হতো। Parentheses Database এর জন্য যতটা, তার চেয়ে বেশি
              পরের মানুষটার জন্য, যিনি ছয় মাস পরে Query টা পড়বেন। সেই মানুষটা প্রায়ই আপনি
              নিজে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7 · Medium"
              task={
                <>
                  মার্কেটিং টিমের আসল প্রশ্নটার সঠিক উত্তর লিখুন: যেসব Booking confirmed অথবা pending, আর যেখানে{" "}
                  <code className={CODE}>seats</code> ৩ বা তার বেশি। বের করুন <code className={CODE}>booking_id</code>,{" "}
                  <code className={CODE}>status</code> আর <code className={CODE}>seats</code>।
                </>
              }
              hint={<>status এর দুটো মান OR দিয়ে জোড়া, আর সেই পুরো অংশটা Parentheses এর ভেতরে। তারপর AND seats &gt;= 3।</>}
              solution={`SELECT booking_id, status, seats
FROM bookings
WHERE (status = 'confirmed' OR status = 'pending')
  AND seats >= 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "null-preview",
      subHeader: { index: "012", title: "A Row in Neither" },
      title: <SectionTitle>যে Row কোনো দিকেই পড়ে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা ছোট্ট পরীক্ষা, যেটা প্রথমবার দেখলে একটু ধাক্কা লাগে। tours এ নয়টা
                ট্যুর। guide_id = 1 দিয়ে গুনলে আসে দুটো। guide_id &lt;&gt; 1 দিয়ে গুনলে আসে
                ছয়টা। দুই আর ছয় মিলে আট। কিন্তু যুক্তি বলে, প্রতিটা ট্যুরের Guide হয় ১ নম্বর,
                নয়তো ১ নম্বর না। তাহলে নয় নম্বরটা গেল কোথায়?
              </ContentParagraph>
              <ContentParagraph>
                হারানো ট্যুরটা Ratargul Swamp Boat Day। তার এখনো কোনো Guide ঠিক হয়নি, তাই
                তার guide_id এ কোনো মান নেই, আছে NULL। NULL মানে &ldquo;জানি না&rdquo;।
                জানি না এর সাথে ১ তুলনা করলে উত্তরও হয় &ldquo;জানি না&rdquo;, না true না
                false। আর WHERE শুধু true রাখে। তাই এই Row দুই প্রশ্নেই বাদ পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এটাই সেই তৃতীয় উত্তর, যার কথা লেসনের শুরুতে বলেছিলাম। কীভাবে NULL খুঁজবেন
                (= NULL কেন কাজ করে না), কীভাবে তাকে হিসাবে রাখবেন, সব Lesson 05 এ। আজ শুধু
                নিজের চোখে দেখে নিন যে সে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই আর ছয়, তবু নয় না"
              query={`SELECT count(*) AS all_tours
FROM tours;

SELECT count(*) AS guide_is_1
FROM tours
WHERE guide_id = 1;

SELECT count(*) AS guide_not_1
FROM tours
WHERE guide_id <> 1;`}
              caption="৯, ২ আর ৬। যে ট্যুরের guide_id খালি, সে = 1 এও পড়ে না, <> 1 এও না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "practice",
      subHeader: { index: "013", title: "Practice Set" },
      title: <SectionTitle>হাত পাকানোর পালা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তিনটা প্রশ্ন, যেগুলোতে লেসনের কয়েকটা জিনিস একসাথে লাগবে। আগে নিজে
              লিখুন, Check চাপুন। না মিললে বার্তাটা পড়ুন: Column কম, Row বেশি, নাকি মান
              আলাদা, সেটা দেখে কোথায় ভুল খুঁজবেন বোঝা যায়। শেষ দুটো Challenge, Hint না
              দেখে চেষ্টা করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8 · Medium"
              task={
                <>
                  bKash অথবা Nagad দিয়ে যেসব Payment সফলভাবে হয়েছে (status paid), সেগুলোর{" "}
                  <code className={CODE}>payment_id</code>, <code className={CODE}>method</code> আর{" "}
                  <code className={CODE}>amount_bdt</code> বের করুন। Data তে method লেখা আছে ছোট হাতে: bkash, nagad।
                </>
              }
              hint={<>method এর দুই মান OR দিয়ে, Parentheses এর ভেতরে। তারপর AND status = &apos;paid&apos;।</>}
              solution={`SELECT payment_id, method, amount_bdt
FROM payments
WHERE (method = 'bkash' OR method = 'nagad')
  AND status = 'paid';`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge 1"
              orderMatters
              task={
                <>
                  বড় দলের জন্য একটা সস্তা অফার বানানো হবে। দরকার এমন ট্যুর, যার দাম ১৫,০০০ টাকার কম, আর যেটা
                  হয় ৪ দিন বা তার বেশি লম্বা, নয়তো একসাথে অন্তত ২৪ জন নিতে পারে (<code className={CODE}>max_seats</code>{" "}
                  ২৪ বা বেশি)। বের করুন <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>,
                  সবচেয়ে সস্তাটা আগে: শেষে <code className={CODE}>ORDER BY price_bdt</code> লিখুন।
                </>
              }
              hint={
                <>
                  তিনটা শর্ত, আর তার দুটো &ldquo;হয় এটা, নয়তো ওটা&rdquo;। কোনগুলো Parentheses এ যাবে? Parentheses
                  ছাড়া লিখলে একটা ১৫,৫০০ টাকার ট্যুর ঢুকে পড়বে।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt < 15000
  AND (duration_days >= 4 OR max_seats >= 24)
ORDER BY price_bdt;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge 2"
              task={
                <>
                  অক্টোবর 2026 এ (১ থেকে ৩১ অক্টোবর, পুরো মাস) করা যেসব Booking এখনো pending, সেগুলোর{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>booked_at</code> বের করুন।
                </>
              }
              hint={
                <>
                  booked_at এ সময়ও আছে। মাসের দুই দিকে সীমা দিন: &gt;= &apos;2026-10-01&apos; আর &lt;
                  &apos;2026-11-01&apos;। সাথে status এর শর্ত।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
WHERE booked_at >= '2026-10-01'
  AND booked_at <  '2026-11-01'
  AND status = 'pending';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর প্রতিটা Screen এর পেছনে একটা WHERE</SectionTitle>,
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
                Island Tours এর App খুলে যেকোনো একটা পাতার দিকে তাকান, পেছনে একটা WHERE
                পাবেন। নিচের ছকে চারটা Screen, তাদের প্রশ্ন, আর সেই প্রশ্নের WHERE। এগুলো এই
                লেসনের শেখা জিনিস দিয়েই লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Screen", "প্রশ্ন", "WHERE"],
          rows: [
            ["Search পাতা", "চালু ট্যুর, বাজেটের মধ্যে", "is_active AND price_bdt <= 10000"],
            ["অপারেশন Dashboard", "ডিসেম্বরের Departure, যেগুলো প্রায় ভরা", "starts_on >= '2026-12-01' AND starts_on < '2027-01-01' AND seats_left <= 12"],
            ["ফাইন্যান্স রিপোর্ট", "যে টাকা ঢোকেনি", "status = 'failed' OR status = 'refunded'"],
            ["Support Desk", "Email দিয়ে Customer খোঁজা", "email = 'farhana.akter@mail.example'"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Support Desk: Email দিয়ে Customer খোঁজা"
              query={`SELECT customer_id, full_name, city
FROM customers
WHERE email = 'farhana.akter@mail.example';`}
              caption="একটা Row: Farhana Akter, Sylhet থেকে। email Column এ UNIQUE নিয়ম আছে, তাই এই প্রশ্নের উত্তর সর্বোচ্চ একটা Row।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "App এর ভেতরে মান কখনো জোড়া লাগিয়ে বসাবেন না",
          content: (
            <ContentParagraph>
              বাস্তবের App এ Support কর্মী Email টা একটা Form এ লেখেন, আর App সেটা WHERE এ
              বসায়। সেই বসানো কখনো লেখা জোড়া লাগিয়ে হয় না, হয় Parameter দিয়ে:{" "}
              <code className={CODE}>WHERE email = $1</code>, আর মানটা আলাদা করে পাঠানো হয়।
              Module 01 এর{" "}
              <Link href="/sql/topic/app-database-conversation" className={LINK}>
                Lesson 06
              </Link>{" "}
              এ দেখেছেন কেন, আর SQL Injection এর পুরো গল্প আছে Module 16 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা WHERE এর পুরো যাত্রা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ধরা যাক আপনি চালালেন <code className={CODE}>SELECT title FROM tours WHERE is_active AND price_bdt &lt; 10000;</code>।
              PostgreSQL ধাপে ধাপে যা করে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "লেখাটা পড়ে বোঝা",
              description:
                "PostgreSQL Query টা পড়ে, বানান আর ব্যাকরণ মেলায়। == বা ভুল Quote থাকলে এখানেই Error দিয়ে থেমে যায়, কোনো Row ছোঁয়ার আগেই।",
            },
            {
              title: "শর্তের গঠন ঠিক করা",
              description:
                "শর্তের কোন অংশ কোনটার সাথে জোড়া, সেটা ঠিক হয় নিয়ম মেনে: তুলনা আগে, তারপর NOT, তারপর AND, শেষে OR। Parentheses থাকলে সেটা সবার আগে মানা হয়। এখানে is_active AND (price_bdt < 10000)।",
            },
            {
              title: "FROM: Table ধরা",
              description: "tours Table এর Row গুলো একটা একটা করে হাতে আসে, সব Column সহ।",
            },
            {
              title: "WHERE: প্রতিটা Row কে প্রশ্ন",
              description:
                "প্রতিটা Row এর জন্য শর্তের উত্তর বের হয়: true, false নয়তো জানা নেই। কোন অংশ আগে পরীক্ষা হবে, সেটা PostgreSQL নিজে ঠিক করে। একটা অংশ false হলে AND এর পুরো উত্তর আগেই জানা হয়ে যায়।",
            },
            {
              title: "শুধু true রাখা",
              description:
                "যে Row এর উত্তর true, সে থাকে। false আর জানা নেই, দুটোই বাদ। এই Query তে নয়টার মধ্যে চারটা টিকে যায়।",
            },
            {
              title: "SELECT: Column বাছা",
              description: "টিকে যাওয়া Row গুলো থেকে শুধু title নেওয়া হয়।",
            },
            {
              title: "ফলাফল পাঠানো",
              description:
                "চারটা Row আপনার psql, GUI বা App এর কাছে যায়, শেষে লেখা থাকে (4 rows)। Table এর নয়টা Row যেমন ছিল তেমনই থাকে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "WHERE লেখার আগে নিজেকে পাঁচটা প্রশ্ন",
          content: (
            <ContentList>
              <ListItem>সীমানার মানটা ভেতরে না বাইরে? &lt; না &lt;=?</ListItem>
              <ListItem>লেখার মানটা Data তে ঠিক কোন বানানে, কোন হাতে আছে?</ListItem>
              <ListItem>Column এ কি সময়ও আছে? থাকলে পরের দিনের শুরুর আগে পর্যন্ত সীমা দিয়েছি তো?</ListItem>
              <ListItem>AND আর OR দুটোই আছে? থাকলে Parentheses দিয়েছি তো?</ListItem>
              <ListItem>যে Column এ ফাঁকা থাকতে পারে (NULL), সেই Row গুলো কোথায় যাবে ভেবেছি কি?</ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>== লেখা।</strong> PostgreSQL বলে operator does not exist: numeric == integer।
                SQL এ সমান একটাই চিহ্ন, =।
              </ListItem>
              <ListItem>
                <strong>লেখার মান Double Quote এ।</strong> city = &quot;Dhaka&quot; লিখলে PostgreSQL
                Dhaka নামের Column খোঁজে: column &quot;Dhaka&quot; does not exist। লেখা এক Quote এ।
              </ListItem>
              <ListItem>
                <strong>তারিখে Quote ভুলে যাওয়া।</strong> starts_on &gt;= 2026-11-01 লিখলে 2026 থেকে 11 আর
                1 বিয়োগ হয়ে একটা সংখ্যা হয়ে যায়, 2014। PostgreSQL বলে operator does not exist: date &gt;=
                integer। ভাগ্য ভালো যে সে থামে।
              </ListItem>
              <ListItem>
                <strong>দ্বিতীয় শর্তে Column বাদ দেওয়া।</strong> price_bdt &gt; 5000 AND &lt; 10000 একটা
                syntax error। AND এর দুই পাশেই পুরো শর্ত লাগে।
              </ListItem>
              <ListItem>
                <strong>AND আর OR মেশানো, Parentheses ছাড়া।</strong> কোনো Error আসে না, শুধু ভুল উত্তর আসে।
                এটাই সবচেয়ে দামি ভুল, কারণ চুপচাপ ঘটে।
              </ListItem>
              <ListItem>
                <strong>SELECT এর Alias WHERE এ ব্যবহার।</strong> SELECT price_bdt * 2 AS double_price …
                WHERE double_price &gt; 20000 লিখলে আসে column &quot;double_price&quot; does not exist, কারণ
                WHERE চলে SELECT এর আগে। কেন, সেটা Lesson 02 তে বিস্তারিত আছে।
              </ListItem>
              <ListItem>
                <strong>বন্ধ জিনিস ছাঁকতে ভুলে যাওয়া।</strong> Customer এর সামনে কিছু দেখানোর Query তে is_active
                না দিলে বন্ধ ট্যুরও দেখা যায়। Error আসে না, ব্যবসার ক্ষতি হয়।
              </ListItem>
              <ListItem>
                <strong>NULL খুঁজতে = NULL।</strong> এটা কখনো কোনো Row দেয় না। কেন, আর কী লিখতে হয়, Lesson 05
                এ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল নিজের চোখে: Double Quote"
              query={`SELECT full_name
FROM customers
WHERE city = "Dhaka";`}
              caption={'ERROR: column "Dhaka" does not exist, সাথে নিচে একটা ^ চিহ্ন, ঠিক যেখানে PostgreSQL ভুলটা পেয়েছে। "Dhaka" কে \'Dhaka\' করে আবার চালান, ছয়জন Customer আসবে।'}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল নিজের চোখে: Quote ছাড়া তারিখ"
              query={`SELECT departure_id, starts_on
FROM departures
WHERE starts_on >= 2026-11-01;`}
              caption="ERROR: operator does not exist: date >= integer, সাথে একটা HINT। 2026-11-01 কে Quote এ মুড়ে '2026-11-01' করুন, নয়টা Departure আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ এই দুটো ভুল আরও বিপজ্জনক",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                এই লেসনের জন্য MySQL 8.4.11 এ একই দুটো Query চালানো হয়েছিল। city = &quot;Dhaka&quot;
                MySQL এ কোনো Error দেয় না, ছয়টা Row দেয়, কারণ সেখানে Double Quote ও লেখা।
                আর starts_on &gt;= 2026-11-01 চালালে MySQL থামে না: সে ষোলোটা Departure এর সবগুলো
                ফেরত দেয়, সাথে শুধু একটা Warning রাখে, Incorrect date value: &apos;2014&apos;। Warning টা
                দেখতে আলাদা করে SHOW WARNINGS চালাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                মানে MySQL এ ভুল Query টা চুপচাপ ভুল উত্তর দিল। PostgreSQL এর কড়া Error গুলো
                প্রথমে বিরক্তিকর লাগে, কিন্তু এই ধরনের নিঃশব্দ ভুল থেকে সেগুলোই বাঁচায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে আর দেখতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/tutorial-select.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Tutorial: Querying a Table
                </a>
                : অফিসিয়াল Tutorial এর ছোট্ট অংশ, WHERE সহ প্রথম Query গুলো।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-comparison.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Comparison Functions and Operators
                </a>
                : সব তুলনার চিহ্ন এক জায়গায়, আর != যে &lt;&gt; এর আরেক নাম তার লিখিত প্রমাণ।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-logical.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Logical Operators
                </a>
                : AND, OR, NOT এর পুরো সত্যতার ছক, NULL সহ। Lesson 05 এর আগে একবার চোখ বুলিয়ে রাখুন।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Lexical Structure, Operator Precedence
                </a>
                : কোন চিহ্ন আগে জোড়া লাগে তার পুরো তালিকা। পাতার নিচের দিকে Operator Precedence ছকটা দেখুন।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-boolean.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Boolean Type
                </a>
                : boolean কোন কোন লেখা চেনে, আর psql কেন t আর f দেখায়।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Comparison Functions and Operators
                </a>
                : MySQL এ একই চিহ্নগুলো, পাশাপাশি মিলিয়ে দেখার জন্য।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার MySQL কোর্সের ভিডিও
                </a>
                : 01:13:04 থেকে 01:29:12 অংশে WHERE, LIMIT আর ORDER BY। ভিডিওটা MySQL এ, তাই এই লেসনের MySQL
                বক্সগুলো পাশে রেখে দেখুন।
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
      title: <SectionTitle>এক নজরে, আর এরপর কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                WHERE প্রতিটা Row কে একটা প্রশ্ন করে, আর শুধু true উত্তরের Row রাখে। তুলনার
                ছয়টা চিহ্ন দিয়ে সমান, অসমান আর সীমা বলা যায়। লেখা যায় এক Quote এ, অক্ষরে
                অক্ষরে মেলে। তারিখও Quote এ, আর সময় সহ Column এ পরের দিনের শুরুর আগে পর্যন্ত
                সীমা দেওয়াই নিরাপদ। boolean Column নিজেই একটা শর্ত। AND ফলাফল ছোট করে, OR
                বড় করে, NOT উল্টায়। আর AND আগে জোড়া লাগে বলে AND আর OR একসাথে থাকলে
                Parentheses দিতেই হবে।
              </ContentParagraph>
              <ContentParagraph>
                নিজেকে তিনটা প্রশ্ন করুন। এক, &ldquo;৯৫০০ এর কম&rdquo; আর &ldquo;৯৫০০
                পর্যন্ত&rdquo; এর তফাত কোন Row তে? দুই, Parentheses ছাড়া মার্কেটিং এর
                Query টা কেন ১৮টা Row দিল? তিন, guide_id = 1 আর guide_id &lt;&gt; 1 মিলে নয়
                হলো না কেন? তিনটার উত্তর একজন বন্ধুকে মুখে বোঝাতে পারলে লেসনটা আপনার।
              </ContentParagraph>
              <ContentParagraph>
                এক একটা মান ধরে তুলনা অনেক সময় লম্বা হয়ে যায়: confirmed OR pending OR …। পরের
                লেসনে শিখবেন তালিকা দিয়ে মেলানো (IN), সীমার মধ্যে মেলানো (BETWEEN) আর নামের
                অংশ মিলিয়ে খোঁজা (LIKE আর ILIKE):{" "}
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  IN, BETWEEN, LIKE and ILIKE
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
      ["WHERE", "প্রতিটা Row কে একটা প্রশ্ন, শুধু true রাখা", "WHERE price_bdt < 10000"],
      ["SELECT বনাম WHERE", "SELECT বাছে Column, WHERE বাছে Row", "SELECT title … WHERE max_seats >= 20"],
      ["= আর <>", "সমান আর সমান না, != হলো <> এর আরেক নাম", "status <> 'confirmed'"],
      ["<, >, <=, >=", "সীমা টানা, সীমানার Row টা খেয়াল করে", "price_bdt <= 9500"],
      ["লেখা", "এক Quote এ, অক্ষরে অক্ষরে মেলে", "city = 'Dhaka', 'Cox''s Bazar'"],
      ["Double Quote", "নামের জন্য, লেখার জন্য না", "\"Dhaka\" মানে Column"],
      ["তারিখ", "Quote এ, বছর মাস দিন, দুই দিকে সীমা", "starts_on >= '2026-11-01' AND starts_on < '2026-12-01'"],
      ["সময় সহ Column", "পরের দিনের শুরুর আগে পর্যন্ত", "booked_at < '2026-10-02'"],
      ["boolean", "Column নিজেই শর্ত", "WHERE is_active, WHERE NOT is_active"],
      ["AND", "দুটোই true হলে true, ফলাফল ছোট হয়", "price_bdt < 15000 AND duration_days >= 3"],
      ["OR", "একটা true হলেই true, ফলাফল বড় হয়", "status = 'failed' OR status = 'refunded'"],
      ["NOT", "উত্তর উল্টে দেয়, ঠিক পরের শর্তটাকে", "NOT (status = 'confirmed' AND seats >= 2)"],
      ["Precedence", "তুলনা, NOT, AND, তারপর OR", "(a OR b) AND c, Parentheses সবসময়"],
      ["NULL", "জানা নেই, WHERE এ বাদ পড়ে", "guide_id = 1 আর <> 1 মিলে ৮, ৯ না"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT title FROM tours WHERE max_seats >= 20; চালালে ফলাফলে কোন Column থাকবে?",
        options: [
          {
            key: "A",
            text: "title আর max_seats দুটোই",
            isCorrect: false,
            explanation: "WHERE এ ব্যবহার করলেই Column ফলাফলে আসে না। ফলাফলের Column ঠিক করে শুধু SELECT এর তালিকা।",
          },
          {
            key: "B",
            text: "শুধু title",
            isCorrect: true,
            explanation: "ঠিক। WHERE সব Column দেখতে পায়, কারণ সে SELECT এর আগে চলে। কিন্তু দেখায় শুধু SELECT এ লেখা Column।",
          },
          {
            key: "C",
            text: "Error, কারণ max_seats SELECT এ নেই",
            isCorrect: false,
            explanation: "যে Column দেখাচ্ছেন না তার উপরও শর্ত দেওয়া যায়। এই লেসনের দ্বিতীয় Query বক্সে ঠিক এটাই চলেছে।",
          },
          {
            key: "D",
            text: "tours এর সব Column",
            isCorrect: false,
            explanation: "সব Column আসত SELECT * লিখলে। এখানে শুধু title চাওয়া হয়েছে।",
          },
        ],
      },
      {
        id: 2,
        text: "PostgreSQL এ WHERE city = 'dhaka' চালালে Island Tours এর Data তে কয়টা Row আসে, আর কেন?",
        options: [
          {
            key: "A",
            text: "৬টা, কারণ শহরের নাম মেলে",
            isCorrect: false,
            explanation: "MySQL এর Default এ ৬টা আসত। PostgreSQL লেখা মেলায় অক্ষরে অক্ষরে, ছোট d আর বড় D আলাদা।",
          },
          {
            key: "B",
            text: "০টা, কারণ Data তে আছে Dhaka, বড় হাতের D দিয়ে",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এ = বড় হাত ছোট হাত আলাদা ধরে। না মেনে খুঁজতে পরের লেসনের ILIKE লাগবে।",
          },
          {
            key: "C",
            text: "Error, কারণ শহরের নাম ছোট হাতে লেখা যায় না",
            isCorrect: false,
            explanation: "লেখার ভেতরে যেকোনো অক্ষর চলে। Error আসে না, শুধু মিল পাওয়া যায় না।",
          },
          {
            key: "D",
            text: "১৫টা, কারণ = লেখার সাথে কাজ করে না",
            isCorrect: false,
            explanation: "= লেখার সাথে খুব ভালো কাজ করে, এই লেসনের প্রথম Exercise ই তার প্রমাণ।",
          },
        ],
      },
      {
        id: 3,
        text: "Sajek Valley Cloud Trip এর দাম ঠিক 9500.00। কোন শর্তে সেটা ফলাফলে আসবে?",
        options: [
          {
            key: "A",
            text: "price_bdt < 9500",
            isCorrect: false,
            explanation: "< মানে কঠিনভাবে ছোট। 9500 নিজে 9500 এর চেয়ে ছোট না, তাই বাদ।",
          },
          {
            key: "B",
            text: "price_bdt > 9500",
            isCorrect: false,
            explanation: "9500 নিজে 9500 এর চেয়ে বড়ও না।",
          },
          {
            key: "C",
            text: "price_bdt <= 9500",
            isCorrect: true,
            explanation: "ঠিক। <= মানে ছোট অথবা সমান, তাই সীমানার Row টা ভেতরে পড়ে। ফলাফল তিন থেকে চার হয়।",
          },
          {
            key: "D",
            text: "price_bdt <> 9500",
            isCorrect: false,
            explanation: "<> মানে সমান না, তাই ঠিক এই ট্যুরটাই বাদ পড়ে।",
          },
        ],
      },
      {
        id: 4,
        text: "booked_at একটা timestamptz Column। ১ অক্টোবর 2026 এর পুরো দিনের Booking সহ তার আগের সব Booking চাই। কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "booked_at <= '2026-10-01'",
            isCorrect: false,
            explanation: "'2026-10-01' মানে দিনের একদম শুরু, রাত বারোটা। ১ অক্টোবর দুপুরের Booking 14 বাদ পড়ে, ১৬ এর জায়গায় ১৫ আসে।",
          },
          {
            key: "B",
            text: "booked_at < '2026-10-02'",
            isCorrect: true,
            explanation: "ঠিক। পরের দিনের শুরুর আগে পর্যন্ত মানে ১ অক্টোবরের পুরো দিন ভেতরে। এখানে ১৬টা Booking আসে।",
          },
          {
            key: "C",
            text: "booked_at = '2026-10-01'",
            isCorrect: false,
            explanation: "এটা শুধু ঠিক রাত বারোটার Booking খোঁজে। Data তে এমন কোনোটা নেই।",
          },
          {
            key: "D",
            text: "booked_at <= 2026-10-01",
            isCorrect: false,
            explanation: "Quote ছাড়া এটা একটা বিয়োগের অঙ্ক হয়ে যায়, PostgreSQL বলে operator does not exist।",
          },
        ],
      },
      {
        id: 5,
        text: "WHERE status = 'confirmed' OR status = 'pending' AND seats >= 3 কে PostgreSQL কীভাবে পড়ে?",
        options: [
          {
            key: "A",
            text: "(status = 'confirmed' OR status = 'pending') AND seats >= 3",
            isCorrect: false,
            explanation: "এটা সেই অর্থ যেটা মানুষ চায়, কিন্তু PostgreSQL এভাবে পড়ে না। এভাবে চাইলে Parentheses দিতে হয়।",
          },
          {
            key: "B",
            text: "status = 'confirmed' OR (status = 'pending' AND seats >= 3)",
            isCorrect: true,
            explanation: "ঠিক। AND আগে জোড়া লাগে, তাই সব confirmed Booking ঢুকে যায়। ফলাফল ৬ এর জায়গায় ১৮।",
          },
          {
            key: "C",
            text: "বাম থেকে ডানে, যেমন লেখা আছে",
            isCorrect: false,
            explanation: "SQL শর্ত লেখার ক্রমে জোড়া লাগায় না, নিয়ম মেনে লাগায়: তুলনা, NOT, AND, তারপর OR।",
          },
          {
            key: "D",
            text: "এটা Error, AND আর OR একসাথে লেখা যায় না",
            isCorrect: false,
            explanation: "লেখা যায়, আর সেটাই বিপদ: কোনো Error আসে না, শুধু ভুল উত্তর আসে।",
          },
        ],
      },
      {
        id: 6,
        text: "NOT (status = 'confirmed' AND seats >= 2) এর সমান কোনটা?",
        options: [
          {
            key: "A",
            text: "status <> 'confirmed' AND seats < 2",
            isCorrect: false,
            explanation: "দলটা উল্টালে ভেতরের AND বদলে OR হয়। এটা অনেক কম Row দেবে।",
          },
          {
            key: "B",
            text: "status <> 'confirmed' OR seats < 2",
            isCorrect: true,
            explanation: "ঠিক। দুটোই না মানে অন্তত একটা না। দুই Query ই ১১টা Booking দেয়।",
          },
          {
            key: "C",
            text: "NOT status = 'confirmed' AND seats >= 2",
            isCorrect: false,
            explanation: "Parentheses ছাড়া NOT শুধু প্রথম শর্তটা উল্টায়। অর্থ পুরো বদলে যায়।",
          },
          {
            key: "D",
            text: "status = 'confirmed' OR seats >= 2",
            isCorrect: false,
            explanation: "এটা উল্টোই হয়নি, আরও বেশি Row আনছে।",
          },
        ],
      },
      {
        id: 7,
        text: "tours এ নয়টা ট্যুর। guide_id = 1 দেয় ২টা, guide_id <> 1 দেয় ৬টা। বাকি একটা কোথায়?",
        options: [
          {
            key: "A",
            text: "Query তে ভুল আছে, দুটো মিলে নয় হওয়া উচিত",
            isCorrect: false,
            explanation: "Query দুটো ঠিক আছে। এটা SQL এর স্বাভাবিক আচরণ।",
          },
          {
            key: "B",
            text: "যে ট্যুরের guide_id NULL, সে কোনো শর্তেই true হয় না",
            isCorrect: true,
            explanation: "ঠিক। Ratargul Swamp Boat Day এর Guide নেই। NULL এর সাথে তুলনার উত্তর জানা নেই, আর WHERE শুধু true রাখে। বিস্তারিত Lesson 05 এ।",
          },
          {
            key: "C",
            text: "বন্ধ ট্যুরটা WHERE নিজে থেকেই বাদ দেয়",
            isCorrect: false,
            explanation: "WHERE নিজে থেকে কিছু বাদ দেয় না। বন্ধ ট্যুর বাদ দিতে is_active এর শর্ত লিখতে হয়।",
          },
          {
            key: "D",
            text: "<> শুধু লেখার সাথে কাজ করে",
            isCorrect: false,
            explanation: "<> সংখ্যার সাথেও কাজ করে, ছয়টা Row তো এসেছেই।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ starts_on >= 2026-11-01 (Quote ছাড়া) চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতো Error দিয়ে থামে",
            isCorrect: false,
            explanation: "PostgreSQL থামে, MySQL থামে না। এই পার্থক্যটা এই লেসনে আসলেই চালিয়ে দেখা।",
          },
          {
            key: "B",
            text: "নভেম্বরের পরের সব Departure ঠিকঠাক দেয়",
            isCorrect: false,
            explanation: "Quote ছাড়া এটা তারিখই না, 2026 বিয়োগ 11 বিয়োগ 1, মানে 2014।",
          },
          {
            key: "C",
            text: "ষোলোটা Departure এর সবগুলো দেয়, সাথে একটা Warning",
            isCorrect: true,
            explanation: "ঠিক। MySQL চুপচাপ ভুল উত্তর দেয়, আর Warning দেখতে SHOW WARNINGS লাগে: Incorrect date value: '2014'।",
          },
          {
            key: "D",
            text: "কোনো Row দেয় না",
            isCorrect: false,
            explanation: "উল্টো, সবগুলো দেয়। তাই ভুলটা আরও চোখ এড়ায়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: my_tours এর জন্য দশটা প্রশ্ন",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>প্রশ্ন লিখুন:</strong> Island Tours এর চারটা দলের কথা ভাবুন: Marketing, অপারেশন, ফাইন্যান্স আর
        Support। চার দল মিলিয়ে মোট দশটা প্রশ্ন বাংলায় লিখুন, প্রতিটা দলের অন্তত দুটো, যেগুলোর উত্তর একটা WHERE দিয়ে বের হয়।
        যেমন &ldquo;কোন Customer রা দেশের বাইরের?&rdquo;
      </span>,
      <span key="2">
        <strong>Query লিখুন:</strong> নিজের মেশিনের island_tours এ psql দিয়ে প্রতিটা প্রশ্নের Query লিখে চালান।
        প্রতিটার পাশে কয়টা Row এল লিখে রাখুন। অন্তত তিনটা Query তে AND, তিনটায় OR, একটায় NOT আর একটায় তারিখ থাকতে হবে।
      </span>,
      <span key="3">
        <strong>সীমানা পরীক্ষা:</strong> দুটো Query বেছে নিন যেখানে সীমা আছে (&lt; বা &lt;=)। চিহ্ন বদলে আবার চালান
        আর লিখুন কোন Row টা ঢুকল বা বের হলো, আর কেন।
      </span>,
      <span key="4">
        <strong>Parentheses এর পরীক্ষা:</strong> AND আর OR দুটোই আছে এমন একটা Query নিন। একবার Parentheses সহ,
        একবার ছাড়া চালান। Row সংখ্যা আলাদা হলে কোন Row গুলো বাড়তি এল সেটা বের করুন। আলাদা না হলে এমনভাবে শর্ত বদলান
        যাতে আলাদা হয়।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন বন্ধু Excel এর Filter চেনেন কিন্তু SQL না। তাঁকে আট লাইনে বোঝান
        WHERE কী করে, AND আর OR এর তফাত, আর কেন মার্কেটিং এর Query টা ১৮টা Row দিয়েছিল।
      </span>,
    ],
    deliverables: [
      <span key="d1">দশটা প্রশ্ন, প্রতিটার Query আর Row সংখ্যা সহ একটা .sql ফাইল</span>,
      <span key="d2">সীমানা পরীক্ষার দুটো জোড়া Query আর ব্যাখ্যা</span>,
      <span key="d3">Parentheses সহ আর ছাড়া দুটো Query, Row সংখ্যা আর বাড়তি Row গুলোর তালিকা</span>,
      <span key="d4">বন্ধুর জন্য লেখা আট লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "WHERE Drill: নিজের psql এ",
    subtitle: "Module 02 এ Load করা island_tours এ, প্রতিটা ফাইলের পাশে প্রত্যাশিত Row সংখ্যা",
    stepName: "LAB",
    steps: [
      {
        title: "island_tours এ ঢুকুন",
        description:
          "psql -d island_tours দিয়ে Connect করুন (Docker এ হলে docker exec -it island-pg psql -U postgres -d island_tours)। প্রম্পটে island_tours=# দেখে নিশ্চিত হন।",
      },
      {
        title: "তুলনার ছয় চিহ্ন",
        description:
          "প্রথম ফাইলের Query গুলো একটা একটা চালান। প্রতিটার শেষে psql যে (N rows) দেখায়, সেটা মন্তব্যে লেখা সংখ্যার সাথে মিলিয়ে নিন।",
      },
      {
        title: "লেখা আর তারিখ",
        description:
          "দ্বিতীয় ফাইল চালান। 'dhaka' কেন শূন্য দেয় আর '2026-10-01' কেন Booking 14 কে ছাড়ে, দুটোর কারণ নিজের ভাষায় লিখে রাখুন।",
      },
      {
        title: "AND, OR, NOT",
        description: "তৃতীয় ফাইল চালান। প্রতিটা Query চালানোর আগে আন্দাজ করুন কয়টা Row আসবে, তারপর মিলিয়ে দেখুন।",
      },
      {
        title: "Parentheses এর পরীক্ষা",
        description: "চতুর্থ ফাইলের দুটো Query পাশাপাশি চালিয়ে ১৮ আর ৬ নিজের চোখে দেখুন।",
      },
      {
        title: "ভুলগুলো ইচ্ছা করে করুন",
        description:
          "পঞ্চম ফাইলের প্রতিটা ভুল Query চালিয়ে Error গুলো পড়ুন, তারপর ষষ্ঠ ফাইলের Challenge গুলো নিজে লিখে মন্তব্যের সংখ্যার সাথে মেলান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-six-comparisons.sql",
        code: `SELECT full_name, city FROM customers WHERE city = 'Dhaka';               -- 6 rows
SELECT booking_id, status FROM bookings WHERE status <> 'confirmed';     -- 7 rows
SELECT title, price_bdt FROM tours WHERE price_bdt < 10000;              -- 4 rows
SELECT title, price_bdt FROM tours WHERE price_bdt > 15000;              -- 3 rows
SELECT departure_id, seats_left FROM departures WHERE seats_left <= 12;  -- 5 rows
SELECT title, max_seats FROM tours WHERE max_seats >= 20;                -- 4 rows`,
      },
      {
        language: "sql",
        filename: "02-text-and-dates.sql",
        code: `SELECT full_name FROM customers WHERE city = 'dhaka';                    -- 0 rows
SELECT name FROM destinations WHERE name = 'Cox''s Bazar';               -- 1 row
SELECT departure_id, starts_on FROM departures
WHERE starts_on >= '2026-11-01' AND starts_on < '2026-12-01';            -- 4 rows
SELECT count(*) FROM bookings WHERE booked_at <= '2026-10-01';           -- 15
SELECT count(*) FROM bookings WHERE booked_at <  '2026-10-02';           -- 16
-- local install হলে Time Zone আপনার মেশিনের, Docker এ সাধারণত UTC।
-- Dhaka র সময়ে মেলাতে আগে চালান: SET TimeZone = 'Asia/Dhaka';`,
      },
      {
        language: "sql",
        filename: "03-and-or-not.sql",
        code: `SELECT title FROM tours WHERE price_bdt < 15000 AND duration_days >= 3;  -- 2 rows
SELECT title FROM tours WHERE price_bdt < 8000 OR duration_days >= 4;    -- 4 rows
SELECT title FROM tours WHERE NOT is_active;                             -- 1 row
SELECT full_name FROM customers WHERE NOT country = 'Bangladesh';        -- 3 rows
SELECT count(*) FROM bookings
WHERE NOT (status = 'confirmed' AND seats >= 2);                         -- 11`,
      },
      {
        language: "sql",
        filename: "04-parentheses.sql",
        code: `SELECT count(*) FROM bookings
WHERE status = 'confirmed' OR status = 'pending' AND seats >= 3;         -- 18

SELECT count(*) FROM bookings
WHERE (status = 'confirmed' OR status = 'pending') AND seats >= 3;       -- 6`,
      },
      {
        language: "sql",
        filename: "05-break-it.sql",
        code: `SELECT title FROM tours WHERE price_bdt == 9500;
-- ERROR:  operator does not exist: numeric == integer

SELECT full_name FROM customers WHERE city = "Dhaka";
-- ERROR:  column "Dhaka" does not exist

SELECT departure_id FROM departures WHERE starts_on >= 2026-11-01;
-- ERROR:  operator does not exist: date >= integer

SELECT title FROM tours WHERE price_bdt > 5000 AND < 10000;
-- ERROR:  syntax error at or near "<"`,
      },
      {
        language: "sql",
        filename: "06-challenges.sql",
        code: `-- ১. ১৫,০০০ এর কম, আর হয় ৪ দিন বা বেশি নয়তো max_seats ২৪ বা বেশি, সস্তা আগে
--    প্রত্যাশিত: 3 rows (Sylhet Tea Garden Tour, Cox's Bazar Beach Weekend, Bandarban Hill Trek)

-- ২. অক্টোবর 2026 এ করা pending Booking
--    প্রত্যাশিত: 4 rows (booking_id 14, 17, 20, 24)

-- ৩. bKash বা Nagad এ সফল Payment
--    প্রত্যাশিত: 8 rows`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Query চালানোর আগে মনে মনে Row সংখ্যা আন্দাজ করার অভ্যাস করুন। আন্দাজ আর আসল সংখ্যা না মিললে
        সেখানেই শেখার সবচেয়ে ভালো সুযোগ, কারণ তখন আপনাকে খুঁজে বের করতে হয় কোন Row টা নিয়ে আপনার ধারণা ভুল ছিল।
      </ContentParagraph>
    ),
  },
};
