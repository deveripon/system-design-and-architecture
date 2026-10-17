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
  PatternPickLab,
  SelfPairLab,
  TreeWalkLab,
} from "../../../components/course/topics/joins/self-animations";
import {
  HierarchyDiagram,
  PairMatrixDiagram,
  RolesDiagram,
  SelfJoinVsWindowSplit,
  TwoCopiesDiagram,
} from "../../../components/course/topics/joins/self-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const selfJoinContent: TopicData = {
  id: "self-join",
  introduction: {
    badge: "MODULE 06 · LESSON 06",
    title: <SectionTitle>একটা Table, নিজের সাথে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই Module এ এতক্ষণ আপনি সবসময় দুটো আলাদা Table জোড়া লাগিয়েছেন: Booking এর সাথে Customer,
          Tour এর সাথে Destination। কিন্তু কিছু প্রশ্নের দুটো উত্তরই একই Table এ থাকে। একই শহরের দুজন
          Customer কে পাশাপাশি দেখাতে চাইলে দুজনেই customers Table এর Row। একজন কর্মীর পাশে তাঁর Manager এর
          নাম লিখতে চাইলে Manager নিজেও একই staff Table এর আরেকটা Row। একই Departure এ কারা একসাথে যাচ্ছেন
          জানতে চাইলে দুটো Booking ই bookings Table এর।
        </ContentParagraph>
        <ContentParagraph>
          এই কাজের নাম Self Join: একটা Table কে নিজের সাথে জোড়া লাগানো। শুনতে নতুন কিছু মনে হলেও আসলে এটা
          সেই একই INNER JOIN বা LEFT JOIN, যা আপনি আগের লেসনগুলোতে লিখেছেন। পার্থক্য শুধু একটা: দুই পাশেই
          একই Table, তাই দুই পাশকে দুটো আলাদা নাম দিতে হয়। এই একটা জিনিস না বুঝলে Database হয় Error দেয়,
          নয়তো এমন ফলাফল দেয় যেখানে প্রত্যেকে নিজের সাথে জোড়া পান আর প্রতিটা জোড়া দুইবার আসে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন একই Table কে কীভাবে দুটো নাম দিতে হয়, নিজের সাথে জোড়া আর দুইবারের জোড়া
          কীভাবে বাদ দিতে হয়, একই Table কে আলাদা দুই ভূমিকায় কীভাবে ব্যবহার করতে হয়, এক Table এর ভেতরে থাকা
          গাছ (কর্মী আর তাঁর Manager) কীভাবে পড়তে হয়, আর কখন Self Join এর বদলে Window Function ভালো।
          প্রতিটা উদাহরণ Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমার জন্য নতুন কোনো Table লাগে না। একই Table কে আমি দুটো নাম দিই, তারপর তার একটা Row কে আরেকটা Row এর পাশে বসাই। কে কার পাশে বসবে, সেটা ঠিক করে আমার ON শর্ত। শর্তে ভুল হলে প্রত্যেকে আয়নায় নিজের মুখই দেখেন।",
      author: "Self Join",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একসাথে ঘুরতে যাওয়ার বন্ধু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শীতের মৌসুম শুরু হচ্ছে। Island Tours এর Operations Manager ফারুক সাহেব একটা নতুন Campaign এর
                কথা ভাবছেন, নাম দিয়েছেন Travel Buddy। একই শহরে থাকেন এমন দুজন Customer কে একসাথে একটা
                প্রস্তাব যাবে: দুজন মিলে একই ট্যুরে গেলে দুজনেরই ছাড়। এর জন্য তাঁর দরকার একটা তালিকা, যেখানে
                প্রতিটা লাইনে একই শহরের দুজন Customer এর নাম পাশাপাশি।
              </ContentParagraph>
              <ContentParagraph>
                কাজটা পেলেন Developer তানিম। তিনি ভাবলেন, দুটো জিনিস পাশাপাশি আনা মানেই Join, আর দুজন Customer
                মানে customers আর customers। প্রথম চেষ্টায় তিনি লিখলেন{" "}
                <code className={CODE}>FROM customers JOIN customers ON city = city</code>। Database সাথে সাথে
                থামিয়ে দিল: table name &quot;customers&quot; specified more than once। একই নাম দুইবার, Database
                বুঝতেই পারছে না কোন city কোন পাশের।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় চেষ্টায় তানিম দুই পাশকে দুটো ছোট নাম দিলেন, a আর b, আর শর্ত লিখলেন{" "}
                <code className={CODE}>a.city = b.city</code>। এবার Query চলল, এল ৪৭টা Row। কিন্তু তালিকা দেখে
                ফারুক সাহেব হেসে ফেললেন। প্রথম লাইনেই Rahim Uddin এর পাশে Rahim Uddin, মানে তিনি নিজেই নিজের ভ্রমণ
                সঙ্গী। আর একটু নিচে Tanvir Ahmed আর Lamia Haque এর জোড়া, তারপর আবার Lamia Haque আর Tanvir Ahmed,
                একই দুজন উল্টো ক্রমে। এই তালিকা ধরে প্রস্তাব পাঠালে Lamia Haque একই প্রস্তাব দুইবার পেতেন।
              </ContentParagraph>
              <ContentParagraph>
                তৃতীয় চেষ্টায় তানিম শর্তে আরেকটা লাইন যোগ করলেন:{" "}
                <code className={CODE}>a.customer_id &lt; b.customer_id</code>। এবার এল ১৬টা জোড়া, প্রত্যেকটা
                একবার, কেউ নিজের সাথে না। এই লেসন সেই তিনটা চেষ্টার গল্প: কেন প্রথমটা Error দিল, কেন দ্বিতীয়টায়
                মানুষ নিজের সাথে আর জোড়া দুইবার এল, আর তৃতীয়টার একটা ছোট্ট চিহ্ন কীভাবে সব ঠিক করে দিল। তারপর
                দেখবেন একই কৌশল আর কোথায় কোথায় লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Self Join নতুন কোনো Join না",
          content: (
            <ContentParagraph>
              SQL এ SELF JOIN নামে কোনো আলাদা শব্দ নেই। Self Join মানে একটা সাধারণ JOIN বা LEFT JOIN, যার দুই পাশে
              একই Table। Lesson 02 আর Lesson 03 এ যা শিখেছেন তার সবই এখানে খাটে। নতুন শুধু দুটো অভ্যাস: দুই পাশকে
              আলাদা নাম দেওয়া, আর নিজের সাথে জোড়া ও দুইবারের জোড়া সামলানো।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "two-names",
      subHeader: { index: "002", title: "One Table, Two Names" },
      title: <SectionTitle>একই রোল খাতার দুটো ফটোকপি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের কথা ভাবুন। শিক্ষক চান একই পাড়ার দুজন ছাত্রকে জোড়ায় জোড়ায় বাড়ির কাজ দিতে। তাঁর
                হাতে একটাই রোল খাতা, যেখানে প্রতিটা ছাত্রের নাম আর পাড়া লেখা। কাজটা সহজ করতে তিনি খাতার দুটো
                ফটোকপি করলেন, একটা বাঁ হাতে, একটা ডান হাতে। বাঁ কপির প্রতিটা নামের জন্য তিনি ডান কপিতে একই পাড়ার
                নামগুলো খোঁজেন আর দাগ টানেন।
              </ContentParagraph>
              <ContentParagraph>
                Self Join ঠিক এটাই, শুধু একটা পার্থক্যসহ: Database কোনো ফটোকপি বানায় না। Table টা Disk এ একবারই
                থাকে। আপনি Query তে সেটাকে দুটো আলাদা নাম দেন, যাকে বলে <strong>Table Alias</strong>, আর Database সেই
                একই Table কে দুইবার পড়ে, যেন দুটো আলাদা Table। বাঁ কপির নাম a, ডান কপির নাম b। এরপর যা কিছু
                লিখবেন, সব হয় a এর নামে নয়তো b এর নামে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoCopiesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাম ছাড়া চেষ্টা করলে কী হয়, নিজে দেখুন। নিচের বক্সে তানিমের প্রথম চেষ্টা। Run চাপলে Database বলবে
                একই Table এর নাম দুইবার এসেছে। ON এর ভেতরের <code className={CODE}>city = city</code> ও আসলে অর্থহীন,
                কারণ Database জানে না কোন city কোন পাশের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম ছাড়া Self Join"
              query={`SELECT customer_id
FROM customers
JOIN customers ON city = city;`}
              caption='Error: table name "customers" specified more than once। একটা FROM এ একই Table দুইবার আনতে হলে অন্তত একটাকে আলাদা নাম দিতেই হবে। PostgreSQL এর Docs এটাই বলে: Table Alias বেশিরভাগ সময় সুবিধার জন্য, কিন্তু Table কে নিজের সাথে জোড়া লাগাতে হলে এটা আবশ্যক।'
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাম দেওয়ার নিয়ম Module 03 থেকেই চেনা: Table এর নামের পরে <code className={CODE}>AS a</code>, অথবা AS
                ছাড়াই শুধু <code className={CODE}>a</code>। একবার নাম দিলে সেই Query তে Table টার আসল নাম আর চলে
                না, সব জায়গায় নতুন নামটাই লিখতে হয়। নাম ছোট হলে Query পড়তে সহজ, কিন্তু Self Join এ নামটা অর্থবহ
                হলে আরও ভালো: কর্মী আর Manager এর জন্য e আর m, আগের আর পরের Departure এর জন্য prev আর cur।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম দেওয়ার পরে আসল নাম আর চলে না"
              query={`-- নাম দেওয়ার পরে আসল নাম: Error
SELECT customers.full_name
FROM customers a
JOIN customers b ON a.city = b.city;`}
              caption='Error: invalid reference to FROM-clause entry for table "customers"। Table টা এখন a আর b নামে পরিচিত, customers নামটা এই Query তে আর কারো না। ঠিক করতে প্রথম লাইনে a.full_name বা b.full_name লিখুন।'
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "first-self-join",
      subHeader: { index: "003", title: "The First Self Join" },
      title: <SectionTitle>৪৭টা Row, যার অনেকগুলো অদ্ভুত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের দ্বিতীয় চেষ্টা, দুই পাশে দুটো নাম দিয়ে। পড়ার নিয়ম আগের মতোই: customers কে a নামে
                নিন, আবার customers কে b নামে নিন, আর সেই জোড়াগুলো রাখুন যেখানে a এর শহর আর b এর শহর একই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই শহরের সব জোড়া, কোনো বাছাই ছাড়া"
              query={`SELECT a.full_name, a.city, b.full_name
FROM customers a
JOIN customers b ON a.city = b.city
ORDER BY a.customer_id, b.customer_id;`}
              caption="৪৭টা Row। প্রথম ছয়টা লাইনেই Rahim Uddin এর পাশে Dhaka র ছয়জন, যার প্রথমজন Rahim Uddin নিজেই। একটু নিচে Nusrat Jahan এর পাশে আবার Rahim Uddin, মানে আগের একটা জোড়া উল্টো ক্রমে। Barishal এর Kamal Hasan এর পাশে শুধু Kamal Hasan, কারণ ওই শহরে তিনি একাই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সংখ্যাটা ৪৭ কেন, বুঝলে বাকি লেসন সহজ হয়ে যাবে। Database a এর প্রতিটা Row এর জন্য b এর প্রতিটা Row
                পরীক্ষা করে। ১৫টা Row এর জন্য ১৫টা করে, মানে মোট ২২৫টা পরীক্ষা। তার মধ্যে পাশ করে শুধু সেগুলো,
                যেখানে শহর এক। Dhaka তে ছয়জন, তাই Dhaka র জোড়া ৬ × ৬ = ৩৬টা। Chattogram এ দুজন, ২ × ২ = ৪টা। বাকি
                সাতটা শহরে একজন করে, প্রত্যেকে শুধু নিজের সাথে, ৭টা। ৩৬ + ৪ + ৭ = ৪৭।
              </ContentParagraph>
              <ContentParagraph>
                এই হিসাবেই দুটো অদ্ভুত জিনিস লুকিয়ে আছে। প্রথমত, ৬ × ৬ এর মধ্যে ছয়টা জোড়া হলো প্রত্যেকে নিজের
                সাথে, কারণ Rahim Uddin এর শহর আর Rahim Uddin এর শহর তো একই, শর্ত পাশ। দ্বিতীয়ত, বাকি ৩০টার প্রতিটা
                জোড়া দুইবার আছে: Rahim আর Nusrat, আবার Nusrat আর Rahim। Database এর চোখে এ দুটো আলাদা Row, কারণ
                প্রথমটায় Rahim a পাশে, দ্বিতীয়টায় b পাশে। মানুষের চোখে দুটো একই জোড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা শহর কয়টা জোড়া দিল"
              query={`SELECT a.city, count(*) AS pairs
FROM customers a
JOIN customers b ON a.city = b.city
GROUP BY a.city
ORDER BY pairs DESC, a.city;`}
              caption="Dhaka 36, Chattogram 4, আর বাকি সাতটা শহর 1 করে। প্রতিটা শহরের সংখ্যা সেই শহরের মানুষের সংখ্যার বর্গ। একটা Self Join কতগুলো Row দেবে, সেটা আগে থেকে আন্দাজ করার এটাই সবচেয়ে সহজ উপায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আগে আন্দাজ, তারপর Run",
          content: (
            <ContentParagraph>
              Self Join লেখার আগে মনে মনে হিসাব করুন কয়টা Row আসা উচিত। Dhaka তে ছয়জন থাকলে আলাদা আলাদা জোড়া হয়
              ৬ × ৫ ÷ ২ = ১৫টা। ফলাফলে ৩৬ বা ৩০ এলে বুঝবেন নিজের সাথে জোড়া বা দুইবারের জোড়া এখনো বাদ পড়েনি।
              আন্দাজ আর ফলাফল না মিললে Query তে ভুল আছে, এই অভ্যাসটা Self Join এ সবচেয়ে বেশি কাজে লাগে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "each-pair-once",
      subHeader: { index: "004", title: "Each Pair Once" },
      title: <SectionTitle>আয়না সরানো, তারপর উল্টো জোড়া সরানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো সমস্যার সমাধান দুই ধাপে। প্রথম ধাপে নিজের সাথে জোড়া বাদ: শর্তে যোগ করুন{" "}
                <code className={CODE}>a.customer_id &lt;&gt; b.customer_id</code>, মানে দুই পাশের মানুষ আলাদা হতে
                হবে। এতে ৪৭ থেকে সাতটা শহরের একা মানুষ আর Dhaka ও Chattogram এর আটটা আয়না জোড়া পড়ে যায়, থাকে ৩২।
                কিন্তু উল্টো জোড়া এখনো আছে: Rahim আর Nusrat, Nusrat আর Rahim, দুটোই <code className={CODE}>&lt;&gt;</code>{" "}
                পাশ করে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় ধাপে <code className={CODE}>&lt;&gt;</code> এর জায়গায় লিখুন{" "}
                <code className={CODE}>a.customer_id &lt; b.customer_id</code>। এখন একটা জোড়া তখনই আসে যখন বাঁ
                পাশের মানুষের নম্বর ডান পাশের চেয়ে ছোট। Rahim (1) আর Nusrat (2) এর জোড়ায় 1 &lt; 2, তাই আসে।
                Nusrat (2) আর Rahim (1) এর জোড়ায় 2 &lt; 1 মিথ্যা, তাই বাদ। নিজের সাথে জোড়ায় 1 &lt; 1 ও মিথ্যা, তাই
                সেটাও আপনাআপনি বাদ। একটা চিহ্নে দুটো সমস্যারই সমাধান, থাকে ১৬টা জোড়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PairMatrixDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা শর্ত, তিনটা সংখ্যা"
              query={`SELECT count(*) AS same_city
FROM customers a JOIN customers b
  ON a.city = b.city;

SELECT count(*) AS not_myself
FROM customers a JOIN customers b
  ON a.city = b.city AND a.customer_id <> b.customer_id;

SELECT count(*) AS each_pair_once
FROM customers a JOIN customers b
  ON a.city = b.city AND a.customer_id < b.customer_id;`}
              caption="৪৭, ৩২, ১৬। খেয়াল করুন ৩২ ঠিক ১৬ এর দ্বিগুণ, কারণ উল্টো জোড়া সরালে প্রতিটা জোড়ার একটা কপিই থাকে। আর ৪৭ থেকে ৩২ বাদ দিলে ১৫, ঠিক Customer এর সংখ্যা, কারণ প্রত্যেকে একবার নিজের সাথে জোড়া পেয়েছিলেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের Lab এ Database এর কাজটা নিজের হাতে করে দেখুন। বাঁ দিকে a এর পনেরোটা Row, ডান দিকে b। পরের Row
                চাপলে a এর একটা Row ধরে b এর সব Row পরীক্ষা হবে, আর প্রতিটার পাশে লেখা থাকবে কেন জোড়া হলো বা কেন
                বাদ পড়ল। উপরে শর্ত বদলে একই হাঁটা আবার দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SelfPairLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন আসতে পারে: নামের তুলনা কেন না, <code className={CODE}>a.full_name &lt; b.full_name</code>?
                কারণ দুজন মানুষের নাম এক হতেই পারে, তখন তাঁরা একে অপরের জোড়া হারাবেন। customer_id হলো Primary Key,
                কখনো দুজনের এক হয় না, তাই তুলনার জন্য নিরাপদ। নিয়মটা মনে রাখুন: জোড়া একবার রাখতে Primary Key এর
                উপর <code className={CODE}>&lt;</code>।
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
                  Island Tours একই ভাষার দুজন Guide কে জোড়ায় জোড়ায় প্রশিক্ষণে পাঠাতে চায়। guides Table থেকে
                  একই <code className={CODE}>language</code> এর Guide দের প্রতিটা জোড়া একবার দেখান: ভাষা, প্রথম
                  Guide এর নাম, দ্বিতীয় Guide এর নাম, এই তিনটা Column। কেউ নিজের সাথে জোড়া পাবেন না।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM guides a JOIN guides b</code>, শর্ত দুটো: একই ভাষা, আর{" "}
                  <code className={CODE}>a.guide_id &lt; b.guide_id</code>। উত্তরে চারটা জোড়া আসা উচিত: Bangla তে
                  তিনজন থেকে তিনটা, English এ দুজন থেকে একটা।
                </>
              }
              solution={`SELECT a.language, a.full_name AS guide_1, b.full_name AS guide_2
FROM guides a
JOIN guides b
  ON a.language = b.language
 AND a.guide_id < b.guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "naming-columns",
      subHeader: { index: "005", title: "Naming the Columns" },
      title: <SectionTitle>দুটো full_name, কোনটা কার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাধারণ Join এ অনেক Column এর নাম শুধু একটা Table এ থাকে, তাই Table এর নাম না লিখলেও চলে। Self Join এ
                তা হয় না: customers এর প্রতিটা Column এখন দুইবার আছে, একবার a তে, একবার b তে। তাই শুধু{" "}
                <code className={CODE}>full_name</code> লিখলে Database জানতে চায়, কোনটা?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাম ছাড়া Column"
              query={`SELECT full_name
FROM customers a
JOIN customers b ON a.city = b.city;`}
              caption='Error: column reference "full_name" is ambiguous। Self Join এ প্রতিটা Column এর আগে a. বা b. লেখা বাধ্যতামূলক অভ্যাস, এমনকি যেখানে Database না চাইলেও চলত।'
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Column ঠিকমতো বেছে নিলেও আরেকটা ছোট সমস্যা থাকে: ফলাফলের দুটো Column এর শিরোনামই full_name।
                যিনি Report পড়বেন, তিনি বুঝবেন না কোনটা প্রথম মানুষ আর কোনটা দ্বিতীয়। তাই Self Join এ প্রতিটা
                Column কে একটা অর্থবহ নাম দিন, Module 03 এর AS দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Travel Buddy তালিকা, পড়ার মতো করে"
              query={`SELECT a.city,
       a.full_name AS first_person,
       b.full_name AS second_person
FROM customers a
JOIN customers b
  ON a.city = b.city
 AND a.customer_id < b.customer_id
ORDER BY a.city, a.customer_id, b.customer_id;`}
              caption="১৬টা Row, ফারুক সাহেবের চাওয়া তালিকা। প্রথম লাইনে Chattogram এর Tanvir Ahmed আর Lamia Haque, তারপর Dhaka র ১৫টা জোড়া। Imran Kabir এখনো কোনো ট্যুরে যাননি, তবু তালিকায় আছেন, কারণ এই Query শুধু শহর দেখে, Booking দেখে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "অর্থবহ Alias, অর্থবহ Column",
          content: (
            <ContentParagraph>
              a আর b ছোট উদাহরণে চলে, কিন্তু আসল কাজে দুই পাশের ভূমিকা নাম দেখেই বোঝা গেলে ভুল কমে। কর্মী আর Manager
              হলে e আর m, সস্তা আর দামি ট্যুর হলে cheap আর dear, আগের আর পরের হলে prev আর cur। Column এর নামেও একই
              নিয়ম: first_person আর second_person, employee আর manager।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "shared-destination",
      subHeader: { index: "006", title: "Shared Destination" },
      title: <SectionTitle>একই জায়গায় দুটো ট্যুর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Self Join শুধু মানুষের জোড়ার জন্য না। Island Tours এর Marketing টিম জানতে চায় কোন ট্যুরগুলো একই
                জায়গায় যায়, যাতে Website এ একটার পাতায় অন্যটার কথা বলা যায়: আপনি যদি Saint Martin Island Escape
                দেখেন, তাহলে Saint Martin Luxury Stay ও দেখতে পারেন। প্রথমে দেখুন কোন Destination এ কয়টা ট্যুর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Destination প্রতি ট্যুর"
              query={`SELECT destination_id, count(*) AS tours
FROM tours
GROUP BY destination_id
ORDER BY destination_id;`}
              caption="ছয়টা Destination এ ট্যুর আছে, তার তিনটায় দুটো করে: 1 (Saint Martin's Island), 2 (Cox's Bazar) আর 6 (Sylhet)। তাই একই জায়গার ট্যুরের জোড়া হবে ঠিক তিনটা। Kuakata (7) তে কোনো ট্যুরই নেই, তাই এই তালিকায় সে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই জায়গার ট্যুরের জোড়া, জায়গার নামসহ"
              query={`SELECT d.name  AS destination,
       a.title AS first_tour,
       b.title AS second_tour
FROM tours a
JOIN tours b
  ON a.destination_id = b.destination_id
 AND a.tour_id < b.tour_id
JOIN destinations d
  ON d.destination_id = a.destination_id
ORDER BY a.tour_id;`}
              caption="তিনটা Row। Saint Martin's Island এর দুটো ট্যুর, Cox's Bazar এর দুটো, আর Sylhet এর Tea Garden Tour আর Ratargul Swamp Boat Day। এখানে tours দুইবার এসেছে জোড়া বানাতে, আর destinations একবার, শুধু নামের জন্য। এক Query তে Self Join আর সাধারণ Join একসাথে চলে।"
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
                  একই Destination এ যায় এমন ট্যুরের প্রতিটা জোড়া একবার দেখান, শুধু দুটো Column: প্রথম ট্যুরের{" "}
                  <code className={CODE}>title</code> আর দ্বিতীয় ট্যুরের <code className={CODE}>title</code>। প্রথম
                  ট্যুরের tour_id যেন দ্বিতীয়টার চেয়ে ছোট হয়।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours a JOIN tours b</code>, শর্তে একই destination_id আর{" "}
                  <code className={CODE}>a.tour_id &lt; b.tour_id</code>। destinations Table লাগবে না।
                </>
              }
              solution={`SELECT a.title AS first_tour, b.title AS second_tour
FROM tours a
JOIN tours b
  ON a.destination_id = b.destination_id
 AND a.tour_id < b.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "travelling-together",
      subHeader: { index: "007", title: "Travelling Together" },
      title: <SectionTitle>একই নৌকায় কারা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Guide দের একটা অনুরোধ আছে: প্রতিটা Departure এর আগে তাঁরা জানতে চান কোন কোন যাত্রী একসাথে যাচ্ছেন,
                যাতে নৌকায় বা বাসে কাছাকাছি বসানো যায়। একসাথে যাওয়া মানে একই Departure এ দুটো আলাদা Booking। তাই
                এবার Table টা bookings, আর জোড়ার শর্ত একই departure_id। প্রথমে শুধু Booking এর নম্বর দিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Departure এর Booking জোড়া"
              query={`SELECT a.departure_id,
       a.booking_id AS booking_1, a.status AS status_1,
       b.booking_id AS booking_2, b.status AS status_2
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id
 AND a.booking_id < b.booking_id
ORDER BY a.departure_id;`}
              caption="নয়টা জোড়া। কিন্তু দুটো জোড়ায় একটা Booking বাতিল: Departure 2 তে Booking 12, আর Departure 3 তে Booking 5। বাতিল যাত্রী তো যাচ্ছেনই না, তাই তাঁদের জোড়া Guide এর তালিকায় থাকা উচিত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাতিল বাদ দেওয়ার শর্তটা দুই পাশেই লাগবে: <code className={CODE}>a.status &lt;&gt; &apos;cancelled&apos;</code>{" "}
                আর <code className={CODE}>b.status &lt;&gt; &apos;cancelled&apos;</code>। শুধু একপাশে দিলে চলবে না,
                কারণ বাতিল Booking টা কখনো a পাশে থাকে, কখনো b পাশে। এই ভুলটা Common Mistakes এ আবার দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                এরপর নাম। জোড়ার দুটো Booking এর দুজন আলাদা Customer, তাই customers Table ও দুইবার লাগবে: একবার a এর
                মানুষের নাম আনতে, একবার b এর মানুষের নাম আনতে। এবার customers এর দুই কপি নিজেদের মধ্যে কোনো শর্তে
                জোড়া হয় না, প্রত্যেকে শুধু নিজের Booking এর সাথে। একই Table কে দুটো আলাদা ভূমিকায় ব্যবহার করাকে
                অনেকে Role-playing Join বলেন, আর এটাও Self Join এর পরিবারের।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RolesDiagram /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একসাথে যাচ্ছেন যাঁরা, নামসহ"
              query={`SELECT a.departure_id,
       ca.full_name AS traveller_1,
       cb.full_name AS traveller_2
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id
 AND a.booking_id < b.booking_id
JOIN customers ca ON ca.customer_id = a.customer_id
JOIN customers cb ON cb.customer_id = b.customer_id
WHERE a.status <> 'cancelled'
  AND b.status <> 'cancelled'
ORDER BY a.departure_id;`}
              caption="সাতটা জোড়া। Departure 1 এ Rahim Uddin আর Nusrat Jahan, Departure 10 এ Shuvo Das আর Sumaiya Islam, Departure 14 এ Priya Sharma আর Shuvo Das। চারটা Table এর নাম, কিন্তু আসল Table মাত্র দুটো, প্রতিটা দুইবার।"
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
                  Guide এর জন্য তালিকা, শুধু নম্বর দিয়ে: একই Departure এ যাওয়া দুটো আলাদা Booking এর প্রতিটা জোড়া
                  একবার, যেখানে দুটোর কোনোটাই <code className={CODE}>cancelled</code> না। দেখান{" "}
                  <code className={CODE}>departure_id</code>, প্রথম booking_id, দ্বিতীয় booking_id, এই তিনটা Column।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM bookings a JOIN bookings b</code>, একই departure_id আর{" "}
                  <code className={CODE}>a.booking_id &lt; b.booking_id</code>। বাতিলের শর্ত দুই পাশেই। সাতটা Row আসা
                  উচিত।
                </>
              }
              solution={`SELECT a.departure_id,
       a.booking_id AS booking_1,
       b.booking_id AS booking_2
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id
 AND a.booking_id < b.booking_id
WHERE a.status <> 'cancelled'
  AND b.status <> 'cancelled';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "same-customer-again",
      subHeader: { index: "008", title: "Same Customer, Again" },
      title: <SectionTitle>যাঁরা আবার ফিরে এলেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Self Join এর জোড়ার শর্ত শুধু সমান হতে হবে, এমন কোনো নিয়ম নেই। এবার প্রশ্নটা মালিক রুমানা আপার: যে
                Customer রা একবারের বেশি বুক করেছেন, তাঁদের প্রতিটা আগের Booking এর পাশে পরের Booking টা, আর দুটোর
                মাঝে কত দিন গেল। এতে বোঝা যাবে মানুষ কত দিন পরে ফিরে আসেন।
              </ContentParagraph>
              <ContentParagraph>
                জোড়ার শর্ত দুটো অংশে: একই Customer (<code className={CODE}>a.customer_id = b.customer_id</code>), আর
                a এর Booking টা b এর আগে করা (<code className={CODE}>a.booked_at &lt; b.booked_at</code>)। দ্বিতীয়
                শর্তটাই নিজের সাথে জোড়া আর উল্টো জোড়া দুটোই সরিয়ে দেয়, ঠিক আগের <code className={CODE}>&lt;</code>{" "}
                এর মতো। শুধু এবার তুলনা হচ্ছে সময়ের, কারণ প্রশ্নটাই আগে আর পরের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা আগের Booking আর তার পরের Booking"
              query={`SELECT a.customer_id,
       a.booking_id AS earlier,
       b.booking_id AS later,
       b.booked_at::date - a.booked_at::date AS days_between
FROM bookings a
JOIN bookings b
  ON a.customer_id = b.customer_id
 AND a.booked_at < b.booked_at
ORDER BY a.customer_id, a.booked_at, b.booked_at;`}
              caption="এগারোটা জোড়া, নয়জন Customer থেকে। Customer 1 (Rahim Uddin) এর তিনটা Booking, তাই তাঁর জোড়া তিনটা: 1 আর 8, 1 আর 17, 8 আর 17। বাকি আটজনের দুটো করে Booking, একটা করে জোড়া। সবচেয়ে বড় ফাঁক Rahim Uddin এর প্রথম আর শেষ Booking এর মাঝে, ২৯২ দিন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জিনিস খেয়াল করুন। Rahim Uddin এর তিনটা Booking থেকে তিনটা জোড়া এসেছে, তার একটা প্রথম আর তৃতীয়
                Booking এর জোড়া, মাঝখানেরটা ডিঙিয়ে। প্রশ্ন যদি হতো শুধু ঠিক পরের Booking, তাহলে এই জোড়াটা বাদ দিতে
                হতো, আর সেটা Self Join দিয়ে বেশ ঝামেলার। এই ঝামেলার ভালো সমাধান আছে, Section 011 এ দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  ফিরে আসা Customer দের তালিকা: একই Customer এর প্রতিটা Booking জোড়া, যেখানে প্রথমটা দ্বিতীয়টার আগে
                  করা (<code className={CODE}>booked_at</code> ধরে)। দেখান <code className={CODE}>customer_id</code>,
                  আগের booking_id, পরের booking_id, এই তিনটা Column।
                </>
              }
              hint={
                <>
                  একই <code className={CODE}>customer_id</code>, আর <code className={CODE}>a.booked_at &lt; b.booked_at</code>।
                  দিনের হিসাবের Column এখানে চাওয়া হয়নি। এগারোটা Row আসা উচিত।
                </>
              }
              solution={`SELECT a.customer_id,
       a.booking_id AS earlier,
       b.booking_id AS later
FROM bookings a
JOIN bookings b
  ON a.customer_id = b.customer_id
 AND a.booked_at < b.booked_at;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "earlier-and-later",
      subHeader: { index: "009", title: "Earlier and Later" },
      title: <SectionTitle>কে কার আগে যোগ দিলেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার guides Table। Island Tours নিয়ম করেছে, নতুন Guide কে প্রথম কয়েকটা ট্যুরে একজন পুরনো Guide এর
                সাথে পাঠানো হবে। তাই প্রতিটা Guide এর পাশে দেখা দরকার, তাঁর আগে কারা যোগ দিয়েছিলেন। জোড়ার শর্ত এবার
                শুধু একটা অসমতা: <code className={CODE}>senior.hired_on &lt; junior.hired_on</code>। কোনো সমান হওয়ার শর্ত
                নেই, কারণ যেকোনো আগের Guide ই চলবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Guide আর তাঁর আগে যোগ দেওয়া সবাই"
              query={`SELECT junior.full_name AS guide,
       senior.full_name AS joined_earlier
FROM guides junior
JOIN guides senior
  ON senior.hired_on < junior.hired_on
ORDER BY junior.hired_on, senior.hired_on;`}
              caption="দশটা Row। Shirin Akter এর আগে শুধু Jamal Hossain, Nazmul Karim এর আগে চারজনই। পাঁচজন Guide থেকে ১০টা জোড়া, কারণ পাঁচজনের প্রতিটা জোড়ায় একজন আগে আর একজন পরে, আর ৫ × ৪ ÷ ২ = ১০। Jamal Hossain কোনো Row এর guide কলামে নেই, কারণ তাঁর আগে কেউ ছিলেন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                জোড়ার বদলে যদি গুনতে চান, প্রতিটা Guide এর আগে কতজন, তাহলে Module 05 এর GROUP BY আর count যোগ করুন।
                এখানে একটা চেনা ফাঁদ আছে। Jamal Hossain এর আগে কেউ নেই, তাই INNER JOIN এ তাঁর কোনো জোড়াই হয় না, আর
                গুনতি থেকে তিনি পুরো হারিয়ে যান। তাঁকে শূন্য সহ রাখতে LEFT JOIN লাগবে, আর গুনতে হবে{" "}
                <code className={CODE}>count(senior.guide_id)</code> দিয়ে, <code className={CODE}>count(*)</code> দিয়ে না।
                কারণটা Lesson 03 এ দেখেছেন: LEFT JOIN এর খালি Row টাও একটা Row, তাই count(*) সেটাকে ১ ধরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনভাবে গোনা, তিনরকম ফলাফল"
              query={`-- INNER JOIN: Jamal Hossain হারিয়ে যান
SELECT g.full_name, count(*) AS hired_before
FROM guides g
JOIN guides e ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name
ORDER BY hired_before;

-- LEFT JOIN কিন্তু count(*): Jamal এর গুনতি ভুল করে 1
SELECT g.full_name, count(*) AS hired_before
FROM guides g
LEFT JOIN guides e ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name
ORDER BY hired_before;

-- LEFT JOIN আর count(e.guide_id): ঠিক উত্তর
SELECT g.full_name, count(e.guide_id) AS hired_before
FROM guides g
LEFT JOIN guides e ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name
ORDER BY hired_before;`}
              caption="প্রথমটায় চারটা Row, Jamal Hossain নেই। দ্বিতীয়টায় পাঁচটা, কিন্তু Jamal Hossain এর পাশে 1, অথচ তাঁর আগে কেউ ছিলেন না। তৃতীয়টায় পাঁচটা, Jamal Hossain 0, তারপর 1, 2, 3, 4। এই 0 থেকে 4 আসলে প্রতিটা Guide এর সিনিয়রিটির ক্রম।"
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
                  প্রতিটা Guide এর নাম আর তাঁর আগে কতজন Guide যোগ দিয়েছিলেন, দুটো Column। সবচেয়ে পুরনো Guide ও যেন
                  তালিকায় থাকেন, তাঁর পাশে 0।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM guides g LEFT JOIN guides e ON e.hired_on &lt; g.hired_on</code>, তারপর
                  GROUP BY আর <code className={CODE}>count(e.guide_id)</code>। count(*) দিলে প্রথমজনের পাশে 1 আসবে।
                </>
              }
              solution={`SELECT g.full_name, count(e.guide_id) AS hired_before
FROM guides g
LEFT JOIN guides e
  ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "tree-in-one-table",
      subHeader: { index: "010", title: "A Tree in One Table" },
      title: <SectionTitle>কর্মী, তাঁর Manager, আর তাঁর Manager</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Self Join এর সবচেয়ে পরিচিত ব্যবহার, আর Interview এর প্রিয় প্রশ্ন: কর্মী আর তাঁর Manager। ধরুন Island
                Tours এর অফিসের কর্মীদের একটা staff Table আছে। মালিক রুমানা আপা সবার উপরে। Operations Manager ফারুক
                সাহেব আর Developer তানিম সরাসরি তাঁর অধীনে। Support এর নাবিলা, Sales এর সাদিয়া আর Guide Jamal
                Hossain ফারুক সাহেবের অধীনে।
              </ContentParagraph>
              <ContentParagraph>
                এই গাছটা রাখতে আলাদা কোনো managers Table লাগে না, কারণ প্রত্যেক Manager নিজেও একজন কর্মী। প্রতিটা Row
                এ শুধু একটা বাড়তি Column থাকে, <code className={CODE}>manager_id</code>, যেটা একই Table এর আরেকটা Row
                এর staff_id। এটা একটা Foreign Key, যেটা নিজের Table কেই দেখায়। Module 01 এর Lesson 04 এ যে Foreign Key
                দেখেছেন, এটা সেটাই, শুধু তীরটা ঘুরে নিজের ঘরে ফেরে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HierarchyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Sample Database এ staff Table নেই, তাই নিচের বক্স নিজেই একটা অস্থায়ী Table বানায়, তিনটা Query চালায়,
                তারপর ROLLBACK দিয়ে সব মুছে ফেলে। প্রথম Query টা INNER JOIN, যেটা মালিককে হারিয়ে ফেলে। দ্বিতীয়টা LEFT
                JOIN, মালিক থাকেন, পাশে NULL। তৃতীয়টা Table টাকে তৃতীয়বার এনে দুই ধাপ উপরে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="staff Table এ কর্মী আর Manager"
              query={`BEGIN;

CREATE TEMP TABLE staff (
  staff_id   integer PRIMARY KEY,
  full_name  text NOT NULL,
  role       text NOT NULL,
  manager_id integer REFERENCES staff (staff_id)
);

INSERT INTO staff VALUES
  (1, 'Rumana', 'Owner', NULL),
  (2, 'Faruk', 'Operations Manager', 1),
  (3, 'Tanim', 'Developer', 1),
  (4, 'Nabila', 'Support', 2),
  (5, 'Sadia', 'Sales', 2),
  (6, 'Jamal Hossain', 'Guide', 2);

-- INNER JOIN: যাঁর Manager নেই, তিনি নেই
SELECT e.full_name AS employee, e.role, m.full_name AS manager
FROM staff e
JOIN staff m ON m.staff_id = e.manager_id
ORDER BY e.staff_id;

-- LEFT JOIN: সবাই আছেন
SELECT e.full_name AS employee, e.role, m.full_name AS manager
FROM staff e
LEFT JOIN staff m ON m.staff_id = e.manager_id
ORDER BY e.staff_id;

-- দুই ধাপ উপরে: Table টা তৃতীয়বার
SELECT e.full_name AS employee,
       m.full_name AS manager,
       top.full_name AS managers_manager
FROM staff e
LEFT JOIN staff m   ON m.staff_id = e.manager_id
LEFT JOIN staff top ON top.staff_id = m.manager_id
ORDER BY e.staff_id;

ROLLBACK;`}
              caption="প্রথম Query তে পাঁচটা Row, Rumana নেই। দ্বিতীয়টায় ছয়টা, Rumana এর পাশে NULL। তৃতীয়টায় নাবিলা, সাদিয়া আর Jamal Hossain এর দুই ধাপ উপরে Rumana। শেষের ROLLBACK এ staff Table টা মুছে যায়। মাঝপথে কোনো Error হলে বক্সটা খোলা Transaction এ আটকে থাকে, তখন একটা নতুন বক্সে ROLLBACK চালান, অথবা Reset চাপুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের Lab এ একই তিনটা Query নিজের মতো নেড়ে দেখুন। INNER আর LEFT এর মধ্যে বদলালে মালিক আসা যাওয়া
                করবেন। কোনো কর্মীর Row তে চাপ দিলে তাঁর উপরের পুরো শিকল দেখা যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TreeWalkLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুই ধাপের জন্য Table টা তিনবার এসেছে। তিন ধাপের জন্য চারবার লাগবে। কিন্তু একটা প্রতিষ্ঠানে কত ধাপ
                আছে, আগে থেকে সবসময় জানা থাকে না। Comment এর উত্তর, উত্তরের উত্তর, Category এর ভেতরে Category,
                এগুলোও একই রকম গাছ, যার গভীরতা অজানা। এমন গাছের জন্য SQL এ একটা বিশেষ উপায় আছে, Recursive CTE, যেটা
                নিজেই নিজেকে ডেকে যত ধাপ দরকার তত ধাপ যায়।{" "}
                <Link href="/sql/topic/recursive-ctes" className={LINK}>
                  Module 07 এর Recursive CTEs
                </Link>{" "}
                লেসনে সেটা শিখবেন। Self Join সেই লেসনের ভিত্তি।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "self-join-or-window",
      subHeader: { index: "011", title: "Self Join or Window Function" },
      title: <SectionTitle>ঠিক আগের Row টা চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Operations টিমের একটা প্রশ্ন: প্রতিটা Departure এর পাশে একই ট্যুরের ঠিক আগের Departure এর তারিখ,
                যাতে দুটো Departure এর মাঝে কত দিনের বিরতি সেটা দেখা যায়। Self Join দিয়ে এটা করা যায়, কিন্তু একটু
                ঘুরিয়ে: প্রতিটা Departure কে তার আগের সব Departure এর সাথে জোড়া লাগাতে হয়, তারপর সেগুলোর মধ্যে
                সবচেয়ে শেষেরটা max() দিয়ে বেছে নিতে হয়। প্রথম Departure এর আগে কেউ নেই, তাই তাকে রাখতে LEFT JOIN।
              </ContentParagraph>
              <ContentParagraph>
                একই উত্তর আরেকভাবেও আসে, একটা Window Function দিয়ে, নাম <code className={CODE}>lag()</code>। এটা প্রতিটা
                Row থেকে ঠিক আগের Row এর একটা মান তুলে আনে, কোনো জোড়া না বানিয়েই। Window Function এর পুরো গল্প Module
                08 এ। আপাতত শুধু দেখুন দুটো একই উত্তর দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SelfJoinVsWindowSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, দুই উপায়"
              query={`-- Self Join: আগের সব Departure, তারপর সবচেয়ে শেষেরটা
SELECT cur.tour_id, cur.starts_on,
       max(prev.starts_on) AS previous_departure
FROM departures cur
LEFT JOIN departures prev
  ON prev.tour_id = cur.tour_id
 AND prev.starts_on < cur.starts_on
GROUP BY cur.departure_id, cur.tour_id, cur.starts_on
ORDER BY cur.tour_id, cur.starts_on;

-- Window Function: ঠিক উপরের Row (Module 08)
SELECT tour_id, starts_on,
       lag(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on)
         AS previous_departure
FROM departures
ORDER BY tour_id, starts_on;`}
              caption="দুটো Query তেই ষোলোটা Row আর হুবহু একই previous_departure। Tour 1 এর চারটা Departure এর জন্য: প্রথমটায় NULL, তারপর 2026-01-15, 2026-02-12, 2026-11-20। Tour 7 আর 8 এর একটাই করে Departure, দুটোতেই NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলাফল এক, কিন্তু পথ আলাদা। Self Join এর পথে Database আগে প্রতিটা Departure কে আগের সব Departure এর
                সাথে জোড়া লাগায়: এই Data তে ১১টা জোড়া, তারপর দলে ভাগ করে max। একটা ট্যুরের ১০০টা Departure থাকলে
                শেষেরটা একাই ৯৯টা জোড়া পেত, সব মিলিয়ে ৪৯৫০টা। lag() এর পথে Database শুধু একবার সাজায়, তারপর
                প্রতিটা Row ঠিক উপরের Row টা দেখে, ৯৯টা ধাপ।
              </ContentParagraph>
              <ContentParagraph>
                এই একই হিসাব প্রতিটা Self Join এর জন্য সত্য। a এর প্রতিটা Row এর জন্য b এর প্রতিটা Row পরীক্ষা মানে
                Row সংখ্যার বর্গ: customers এ ১৫ × ১৫ = ২২৫, bookings এ ২৪ × ২৪ = ৫৭৬। এই ছোট Data তে কিছুই না, কিন্তু
                দশ লাখ Row এর Table এ সংখ্যাটা ভয়ের। সমানের শর্ত থাকলে (একই শহর, একই Departure) Database Index বা
                Hash দিয়ে শুধু মেলার সম্ভাবনা আছে এমন Row গুলোই দেখে, তাই সাধারণত ঝামেলা হয় না। কিন্তু শুধু অসমতার
                শর্ত হলে (কে আগে যোগ দিলেন) জোড়ার সংখ্যাই বর্গের কাছাকাছি হতে পারে। Index কীভাবে সাহায্য করে, Module
                13 এ বিস্তারিত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কতগুলো পরীক্ষা, কতগুলো জোড়া"
              query={`SELECT (SELECT count(*) FROM customers) ^ 2 AS customer_checks,
       (SELECT count(*) FROM bookings) ^ 2  AS booking_checks;

SELECT count(*) AS previous_pairs
FROM departures cur
JOIN departures prev
  ON prev.tour_id = cur.tour_id
 AND prev.starts_on < cur.starts_on;`}
              caption="225 আর 576 পরীক্ষা, আর আগের Departure এর জোড়া 11টা। প্রথম Query তে Subquery দেখছেন, সেটা Module 07 এর বিষয়; এখানে শুধু সংখ্যা দুটো একসাথে দেখানোর জন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "কখন কোনটা",
          content: (
            <ContentParagraph>
              দুটো Row এর জোড়াটাই যদি প্রশ্ন হয় (একই শহরের দুজন, কর্মী আর Manager, একসাথে যাওয়া দুজন), Self Join
              স্বাভাবিক পছন্দ। প্রশ্ন যদি হয় ঠিক আগের বা ঠিক পরের Row, প্রথম বা শেষ Row, অথবা চলমান যোগফল, তাহলে
              Window Function সাধারণত সহজ আর দ্রুত। Module 08 এ এই দ্বিতীয় দলের সব প্রশ্ন আবার আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "which-pattern",
      subHeader: { index: "012", title: "Which Pattern Fits" },
      title: <SectionTitle>প্রশ্ন দেখে পথ চেনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আসল কাজে কেউ বলে দেবে না যে এটা Self Join এর প্রশ্ন। প্রশ্ন আসে সাধারণ ভাষায়, আর পথটা আপনাকেই চিনতে
                হয়। নিচের ছয়টা প্রশ্ন Island Tours এর অফিস থেকে আসা। প্রতিটার জন্য বেছে নিন: Self Join, দুটো আলাদা Table
                এর সাধারণ Join, নাকি Window Function।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PatternPickLab /> },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ প্রায় হুবহু, একটা ব্যতিক্রম ছাড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Self Join এর লেখা MySQL এ একদম একই। এই লেসনের প্রধান Query গুলো MySQL 8.4 এ চালিয়ে দেখা হয়েছে: একই
                শহরের জোড়া ৪৭, ৩২ আর ১৬, একই জায়গার তিনটা ট্যুরের জোড়া, Guide দের সিনিয়রিটি 0 থেকে 4, আর lag() দিয়ে আগের
                Departure, সব PostgreSQL এর সাথে মেলে। পার্থক্য শুধু Error এর ভাষায়, আর একটা সীমাবদ্ধতায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পরিস্থিতি", "PostgreSQL", "MySQL 8.4"],
          rows: [
            [
              "নাম ছাড়া একই Table দুইবার",
              'table name "customers" specified more than once',
              "ERROR 1066 (42000): Not unique table/alias: 'customers'",
            ],
            [
              "a. বা b. ছাড়া Column",
              'column reference "full_name" is ambiguous',
              "ERROR 1052 (23000): Column 'full_name' in field list is ambiguous",
            ],
            ["সাধারণ Table এর Self Join", "চলে", "চলে"],
            ["Temporary Table এর Self Join", "চলে", "ERROR 1137 (HY000): Can't reopen table"],
            ["lag() দিয়ে আগের Row", "চলে", "চলে (MySQL 8.0 থেকে)"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ Temporary Table নিজের সাথে জোড়া লাগে না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                Section 010 এর staff উদাহরণটা MySQL এ CREATE TEMPORARY TABLE দিয়ে করলে Self Join টা থেমে যায়: ERROR
                1137 (HY000): Can&apos;t reopen table: &apos;e&apos;। MySQL এর Manual এটা পরিষ্কার লিখেছে: একই Query তে
                একটা TEMPORARY Table কে একবারের বেশি উল্লেখ করা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                উপায় দুটো। এক, সাধারণ Table বানিয়ে কাজ শেষে DROP TABLE করা, এভাবে একই Query MySQL এ ঠিক চলেছে।
                দুই, Common Table Expression ব্যবহার করা, যেটা Module 07 এ শিখবেন। PostgreSQL এ এই সীমাবদ্ধতা নেই।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Travel Buddy আর Upgrade এর প্রস্তাব</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের Travel Buddy Campaign এর তালিকাটা আপনি Section 005 এ বানিয়ে ফেলেছেন। এবার একই অফিস থেকে
                দ্বিতীয় অনুরোধ, এবার Sales এর সাদিয়ার কাছ থেকে। একই জায়গায় যাওয়া দুটো ট্যুরের মধ্যে একটা সস্তা, একটা
                দামি। যিনি সস্তাটা দেখছেন, তাঁকে দামিটার কথা বলা যায়: আর মাত্র এত টাকা দিলে আরও আরামের ট্যুর।
                সাদিয়ার দরকার প্রতিটা জায়গার জন্য সস্তা ট্যুর, দামি ট্যুর আর দুটোর দামের পার্থক্য, সবচেয়ে বড়
                পার্থক্য আগে।
              </ContentParagraph>
              <ContentParagraph>
                এটা Self Join এর আরেকটা চেহারা। জোড়ার শর্তে একই Destination, আর দামের একটা অসমতা{" "}
                <code className={CODE}>dear.price_bdt &gt; cheap.price_bdt</code>, যেটা একই সাথে নিজের সাথে জোড়া আর
                উল্টো জোড়া দুটোই সরায়। Destination এর নাম আনতে destinations এর একটা সাধারণ Join।
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
                  প্রতিটা Destination এর জন্য সস্তা আর দামি ট্যুরের জোড়া: Destination এর{" "}
                  <code className={CODE}>name</code>, সস্তা ট্যুরের title, দামি ট্যুরের title, আর দুটোর{" "}
                  <code className={CODE}>price_bdt</code> এর পার্থক্য, এই চারটা Column। দামি ট্যুর মানে যার দাম বেশি।
                  সবচেয়ে বড় পার্থক্য আগে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours cheap JOIN tours dear</code>, শর্তে একই destination_id আর{" "}
                  <code className={CODE}>dear.price_bdt &gt; cheap.price_bdt</code>, তারপর{" "}
                  <code className={CODE}>JOIN destinations d</code>। শেষে{" "}
                  <code className={CODE}>ORDER BY difference DESC</code>। তিনটা Row আসবে, প্রথমটায় 19500.00।
                </>
              }
              solution={`SELECT d.name AS destination,
       cheap.title AS cheaper_tour,
       dear.title  AS pricier_tour,
       dear.price_bdt - cheap.price_bdt AS difference
FROM tours cheap
JOIN tours dear
  ON dear.destination_id = cheap.destination_id
 AND dear.price_bdt > cheap.price_bdt
JOIN destinations d
  ON d.destination_id = cheap.destination_id
ORDER BY difference DESC;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উত্তরে তিনটা Row: Saint Martin&apos;s Island এ Island Escape থেকে Luxury Stay তে যেতে 19500.00 টাকা বেশি,
                Cox&apos;s Bazar এ Beach Weekend থেকে Family Package এ 7000.00, আর Sylhet এ Ratargul Swamp Boat Day থেকে Tea
                Garden Tour এ 4300.00। একটা সতর্কতা: Saint Martin Luxury Stay এখন বন্ধ (is_active false), তাই আসল
                প্রস্তাবে <code className={CODE}>dear.is_active</code> শর্তও লাগবে। Module 03 এর সেই পোঁতা Row আবার
                কাজে এল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Guide এর বসার তালিকা:</strong> প্রতিটা Departure এর আগে একসাথে যাওয়া যাত্রীদের জোড়া, Section
                  007 এর Query, বাতিল বাদ দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>নতুন Guide এর সঙ্গী:</strong> নতুন Guide এর পাশে তাঁর আগে যোগ দেওয়া একই ভাষার Guide, Section
                  009 এর অসমতা আর Exercise 1 এর ভাষার শর্ত একসাথে।
                </ListItem>
                <ListItem>
                  <strong>অফিসের গাছ:</strong> HR এর জন্য প্রতিটা কর্মীর পাশে Manager, Section 010 এর LEFT JOIN, যাতে
                  মালিক বাদ না পড়েন।
                </ListItem>
                <ListItem>
                  <strong>ফিরে আসার হিসাব:</strong> Customer প্রতি আগের আর পরের Booking এর মাঝের দিন, Section 008 এর
                  Query, Loyalty Program এর জন্য।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Self Join লেখার পাঁচ ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "দুই ভূমিকার নাম ঠিক করুন",
              description:
                "জোড়ার দুই পাশে কে কে, সেটা আগে বলুন: প্রথম আর দ্বিতীয় মানুষ, কর্মী আর Manager, সস্তা আর দামি ট্যুর। তারপর দুটো Alias বেছে নিন, যেমন a ও b, e ও m, cheap ও dear।",
            },
            {
              title: "জোড়ার শর্ত লিখুন",
              description:
                "দুই পাশ কীসে মিলবে: একই শহর, একই Departure, একই Customer, অথবা e.manager_id = m.staff_id। এটাই ON এর প্রথম অংশ।",
            },
            {
              title: "নিজেকে আর উল্টো জোড়া সামলান",
              description:
                "জোড়া একবার চাইলে Primary Key এ <, আগে আর পরের প্রশ্নে সময়ের <, দুই দিকই চাইলে <>। কর্মী আর Manager এর মতো দিক দেওয়া সম্পর্কে এই ধাপ লাগে না।",
            },
            {
              title: "প্রতিটা Column এর আগে Alias, প্রতিটা ফলাফলের নাম",
              description:
                "SELECT এ a.full_name, b.full_name, কখনো শুধু full_name না। ফলাফলের Column কে AS দিয়ে অর্থবহ নাম দিন: first_person, manager।",
            },
            {
              title: "আগে আন্দাজ, তারপর মিলিয়ে দেখুন",
              description:
                "কয়টা Row আসা উচিত হিসাব করুন (৬ জনে ১৫ জোড়া), তারপর চালিয়ে মেলান। কাউকে রাখতে হলে (মালিক, সবচেয়ে পুরনো Guide) LEFT JOIN, আর গুনতে count(column)।",
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
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            ["Alias ছাড়া একই Table দুইবার", "Error: specified more than once", "দুই পাশে দুটো নাম, a আর b"],
            ["Column এর আগে Alias নেই", "Error: column reference is ambiguous", "a.full_name, b.full_name"],
            ["শুধু সমান হওয়ার শর্ত", "প্রত্যেকে নিজের সাথে, প্রতিটা জোড়া দুইবার (৪৭)", "a.customer_id < b.customer_id (১৬)"],
            ["<> দিয়ে জোড়া একবার আশা করা", "উল্টো জোড়া থেকে যায় (৩২)", "< দিয়ে একটা দিক বেছে নেওয়া"],
            ["নামের উপর < বা <>", "একই নামের দুজন একে অপরকে হারান", "Primary Key এর উপর তুলনা"],
            ["গাছে INNER JOIN", "মালিক বা মূল Row হারিয়ে যায়", "LEFT JOIN, মূল Row এর পাশে NULL"],
            ["LEFT JOIN এর পরে count(*)", "জোড়া না পাওয়া Row এর গুনতি 1", "count(ডান পাশের Column)"],
            ["শর্ত শুধু একপাশে", "বাতিল Booking অন্য পাশ দিয়ে ঢুকে পড়ে (৯ বনাম ৭)", "একই শর্ত a আর b দুই পাশেই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ ভুলটা সবচেয়ে চুপচাপ, তাই নিজের চোখে দেখুন। নিচের বক্সে একসাথে যাওয়া যাত্রীদের জোড়া, কিন্তু
                বাতিলের শর্ত শুধু a পাশে। Booking 12 আর 5 বাতিল, কিন্তু দুটোই জোড়ার b পাশে বসে, তাই শর্তটা তাদের
                কখনো দেখেই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শর্ত শুধু একপাশে: চুপচাপ ভুল"
              query={`-- শুধু a পাশে শর্ত
SELECT count(*) AS one_side_only
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id
 AND a.booking_id < b.booking_id
WHERE a.status <> 'cancelled';

-- দুই পাশেই শর্ত
SELECT count(*) AS both_sides
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id
 AND a.booking_id < b.booking_id
WHERE a.status <> 'cancelled'
  AND b.status <> 'cancelled';`}
              caption="প্রথমটায় 9, দ্বিতীয়টায় 7। দুটো বাড়তি জোড়ায় একজন যাত্রী আসলে যাচ্ছেনই না। কোনো Error নেই, শুধু Guide এর তালিকায় দুটো ভুল নাম।"
            />
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
                    href="https://www.postgresql.org/docs/current/tutorial-join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Joins Between Tables
                  </a>
                  : শেষের দিকে self join এর অংশ, একটা আবহাওয়ার Table কে নিজের সাথে জোড়া লাগিয়ে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : Table and Column Aliases অংশ, যেখানে লেখা Table কে নিজের সাথে জোড়া লাগাতে Alias আবশ্যক, mother
                  আর child এর উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: JOIN Clause
                  </a>
                  : MySQL এর Join এর পুরো নিয়ম, Table Alias সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/temporary-table-problems.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: TEMPORARY Table Problems
                  </a>
                  : কেন একটা TEMPORARY Table একই Query তে দুইবার আনা যায় না, আর ERROR 1137।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Join_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Join (SQL)
                  </a>
                  : Self-join অংশে কর্মীদের একই দেশের জোড়ার উদাহরণ, এই লেসনের শহরের জোড়ার মতোই।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Join এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। Self Join এর লেখা দুই Database এ একই, শুধু Temporary Table এর সীমাবদ্ধতা মনে
                  রাখবেন।
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
                  <strong>Self Join</strong> মানে একটা সাধারণ JOIN বা LEFT JOIN, যার দুই পাশে একই Table। SQL এ এর আলাদা
                  কোনো শব্দ নেই।
                </ListItem>
                <ListItem>
                  একই Table দুইবার আনতে দুটো <strong>Alias</strong> আবশ্যক, আর প্রতিটা Column এর আগে সেই Alias। নইলে
                  Error।
                </ListItem>
                <ListItem>
                  শুধু সমান হওয়ার শর্তে প্রত্যেকে নিজের সাথে জোড়া পান, আর প্রতিটা জোড়া দুইবার আসে: ৪৭টা Row।{" "}
                  <code className={CODE}>&lt;&gt;</code> নিজেকে সরায় (৩২), <code className={CODE}>&lt;</code> দুটোই
                  সরায় (১৬)।
                </ListItem>
                <ListItem>
                  একই Table কে আলাদা ভূমিকায়ও আনা যায়: জোড়ার দুই পাশের মানুষের নাম আনতে customers দুইবার।
                </ListItem>
                <ListItem>
                  জোড়ার শর্ত অসমতাও হতে পারে: আগে আর পরের Booking, আগে যোগ দেওয়া Guide।
                </ListItem>
                <ListItem>
                  এক Table এর ভেতরের গাছ (কর্মী আর Manager) পড়তে manager_id ধরে Self Join, মূল Row রাখতে LEFT JOIN। যত
                  ধাপ, তত Join; অজানা গভীরতার জন্য Recursive CTE।
                </ListItem>
                <ListItem>
                  ঠিক আগের বা পরের Row এর প্রশ্নে Window Function প্রায়ই ভালো। Self Join এর পরীক্ষা Row সংখ্যার বর্গে
                  বাড়ে।
                </ListItem>
                <ListItem>
                  MySQL এ লেখা একই, কিন্তু TEMPORARY Table এর Self Join চলে না (ERROR 1137)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন পর্যন্ত আপনার Query তে একসাথে দুই বা তিনটা Table থেকেছে। কিন্তু Island Tours এর একটা পূর্ণ
                Booking এর ছবি পেতে লাগে পাঁচ ছয়টা: Booking, Customer, Departure, Tour, Destination, Guide। এতগুলো
                Table এক Query তে জুড়লে নতুন কিছু ফাঁদ দেখা দেয়: LEFT JOIN এর শিকল হঠাৎ INNER হয়ে যাওয়া, ON আর
                WHERE এর পার্থক্য, আর টাকা দুইবার গোনা। পরের লেসন{" "}
                <Link href="/sql/topic/multi-table-joins" className={LINK}>
                  Joining Many Tables, and ON vs WHERE
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
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ"],
    rows: [
      ["Self Join", "একই Table এর দুই পাশের সাধারণ Join", "customers a JOIN customers b"],
      ["Table Alias", "একই Table এর দুটো নাম, আবশ্যক", "a আর b, e আর m"],
      ["Alias এর পরে আসল নাম", "আর চলে না", "customers.full_name দিলে Error"],
      ["শুধু সমানের শর্ত", "নিজের সাথে জোড়া, জোড়া দুইবার", "একই শহর: ৪৭টা Row"],
      ["<> এর শর্ত", "নিজেকে বাদ, জোড়া এখনো দুইবার", "৩২টা Row"],
      ["< এর শর্ত", "প্রতিটা জোড়া একবার", "১৬টা Travel Buddy জোড়া"],
      ["Primary Key এ তুলনা", "নাম এক হলেও জোড়া হারায় না", "a.customer_id < b.customer_id"],
      ["Role-playing Join", "একই Table আলাদা ভূমিকায়", "customers ca আর cb, যাত্রীদের নাম"],
      ["অসমতার জোড়া", "আগে আর পরে", "ফিরে আসা Customer এর ১১টা জোড়া"],
      ["গাছ এক Table এ", "manager_id একই Table কে দেখায়", "staff e LEFT JOIN staff m"],
      ["LEFT JOIN আর count", "count(ডান পাশের Column)", "Jamal Hossain এর আগে 0 জন"],
      ["Window Function বিকল্প", "ঠিক আগের Row, জোড়া ছাড়া", "lag(starts_on), আগের Departure"],
      ["MySQL", "লেখা একই, TEMPORARY Table এ না", "ERROR 1137 Can't reopen table"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Self Join এ দুই পাশে আলাদা Alias দিতেই হয় কেন?",
        options: [
          {
            key: "A",
            text: "Alias দিলে Query দ্রুত চলে",
            isCorrect: false,
            explanation: "Alias শুধু একটা নাম, গতির সাথে এর সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "একই Table এর নাম দুইবার এলে Database বুঝতে পারে না কোন Column কোন পাশের",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL বলে table name specified more than once, আর Docs ও লেখে যে নিজের সাথে জোড়ায় Alias আবশ্যক।",
          },
          {
            key: "C",
            text: "Alias ছাড়া Database Table টার একটা কপি বানায়",
            isCorrect: false,
            explanation: "Database কখনো কপি বানায় না। Alias থাকুক বা না থাকুক, Table একটাই, দুইবার পড়া হয়।",
          },
          {
            key: "D",
            text: "শুধু MySQL এ লাগে",
            isCorrect: false,
            explanation: "দুই Database এই লাগে। MySQL এর Error হলো ERROR 1066, Not unique table/alias।",
          },
        ],
      },
      {
        id: 2,
        text: "customers a JOIN customers b ON a.city = b.city দিলে ৪৭টা Row আসে, অথচ আলাদা জোড়া মাত্র ১৬টা। বাড়তি ৩১টা কী?",
        options: [
          {
            key: "A",
            text: "অন্য শহরের জোড়া",
            isCorrect: false,
            explanation: "শর্তে একই শহর, তাই অন্য শহরের কোনো জোড়া পাশ করে না।",
          },
          {
            key: "B",
            text: "NULL শহরের Customer",
            isCorrect: false,
            explanation: "city Column NOT NULL, Sample Data তে কোনো খালি শহর নেই।",
          },
          {
            key: "C",
            text: "প্রত্যেকে নিজের সাথে ১৫টা জোড়া, আর প্রতিটা আসল জোড়ার উল্টো কপি ১৬টা",
            isCorrect: true,
            explanation: "ঠিক। ১৬ + ১৬ + ১৫ = ৪৭। নিজের সাথে জোড়া ১৫টা, কারণ পনেরোজন Customer।",
          },
          {
            key: "D",
            text: "Database এর একটা Bug",
            isCorrect: false,
            explanation: "Database ঠিক তাই দিয়েছে যা শর্তে বলা হয়েছে। নিজের শহর নিজের শহরের সমান, তাই নিজের সাথে জোড়াও বৈধ।",
          },
        ],
      },
      {
        id: 3,
        text: "প্রতিটা জোড়া ঠিক একবার রাখতে কোন শর্ত যোগ করবেন?",
        options: [
          {
            key: "A",
            text: "a.customer_id <> b.customer_id",
            isCorrect: false,
            explanation: "এটা নিজের সাথে জোড়া সরায়, কিন্তু উল্টো জোড়া রেখে দেয়, ৩২টা Row।",
          },
          {
            key: "B",
            text: "a.customer_id < b.customer_id",
            isCorrect: true,
            explanation: "ঠিক। একটা জোড়ার দুই কপির মধ্যে শুধু সেটা থাকে যেখানে বাঁয়ের নম্বর ছোট, আর নিজের সাথে জোড়ায় 1 < 1 মিথ্যা।",
          },
          {
            key: "C",
            text: "a.full_name < b.full_name",
            isCorrect: false,
            explanation: "এই Data তে কাজ করবে, কিন্তু দুজনের নাম এক হলে তাঁরা একে অপরের জোড়া হারাবেন। Primary Key নিরাপদ।",
          },
          {
            key: "D",
            text: "DISTINCT",
            isCorrect: false,
            explanation: "Rahim আর Nusrat, Nusrat আর Rahim দুটো আলাদা Row, DISTINCT এদের এক ধরে না।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা শহরে আটজন Customer। a.customer_id < b.customer_id দিয়ে Self Join করলে ওই শহরের কয়টা জোড়া আসবে?",
        options: [
          { key: "A", text: "৬৪", isCorrect: false, explanation: "৮ × ৮ হলো শুধু সমানের শর্তে, নিজের সাথে আর উল্টো জোড়াসহ।" },
          { key: "B", text: "৫৬", isCorrect: false, explanation: "৮ × ৭ হলো <> এর শর্তে, উল্টো জোড়া তখনো আছে।" },
          {
            key: "C",
            text: "২৮",
            isCorrect: true,
            explanation: "ঠিক। ৮ × ৭ ÷ ২ = ২৮। Dhaka র ছয়জনে একই হিসাবে ১৫।",
          },
          { key: "D", text: "৮", isCorrect: false, explanation: "আটটা হলো প্রত্যেকের নিজের সাথে জোড়া, যেগুলো < সরিয়ে দেয়।" },
        ],
      },
      {
        id: 5,
        text: "staff e JOIN staff m ON m.staff_id = e.manager_id চালালে মালিক রুমানা আপা ফলাফলে নেই। কেন, আর কী করবেন?",
        options: [
          {
            key: "A",
            text: "তাঁর manager_id NULL, NULL এর সাথে কিছু মেলে না; LEFT JOIN দিলে তিনি থাকবেন, পাশে NULL",
            isCorrect: true,
            explanation: "ঠিক। INNER JOIN জোড়া না পাওয়া Row ফেলে দেয়, LEFT JOIN বাঁ পাশের সব Row রাখে।",
          },
          {
            key: "B",
            text: "তাঁর staff_id 1, আর 1 কোনো manager_id তে নেই",
            isCorrect: false,
            explanation: "1 আছে, ফারুক আর তানিমের manager_id 1। সমস্যা রুমানা আপার নিজের manager_id তে।",
          },
          {
            key: "C",
            text: "ORDER BY না দেওয়ায় তিনি হারিয়েছেন",
            isCorrect: false,
            explanation: "ORDER BY শুধু ক্রম ঠিক করে, কোনো Row বাদ দেয় না।",
          },
          {
            key: "D",
            text: "WHERE e.manager_id IS NULL যোগ করলেই হবে",
            isCorrect: false,
            explanation: "INNER JOIN এর পরে তিনি তো নেইই, WHERE দিয়ে তাঁকে ফেরানো যায় না।",
          },
        ],
      },
      {
        id: 6,
        text: "guides g LEFT JOIN guides e ON e.hired_on < g.hired_on, তারপর GROUP BY আর count(*)। সবচেয়ে পুরনো Guide Jamal Hossain এর পাশে কী আসবে?",
        options: [
          { key: "A", text: "0", isCorrect: false, explanation: "0 আসে count(e.guide_id) দিলে।" },
          {
            key: "B",
            text: "1",
            isCorrect: true,
            explanation: "ঠিক, আর এটা ভুল উত্তর। LEFT JOIN তাঁর জন্য একটা খালি Row রাখে, count(*) সেটাকেও গোনে।",
          },
          { key: "C", text: "NULL", isCorrect: false, explanation: "count কখনো NULL দেয় না, কমপক্ষে 0।" },
          { key: "D", text: "তিনি ফলাফলে থাকবেন না", isCorrect: false, explanation: "LEFT JOIN এর জন্যই তিনি থাকবেন।" },
        ],
      },
      {
        id: 7,
        text: "MySQL এ CREATE TEMPORARY TABLE staff বানিয়ে staff e JOIN staff m চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতোই চলে",
            isCorrect: false,
            explanation: "সাধারণ Table এ চলে, TEMPORARY Table এ না।",
          },
          {
            key: "B",
            text: "ERROR 1137: Can't reopen table, কারণ একই Query তে TEMPORARY Table একবারের বেশি আনা যায় না",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর Manual এ এই সীমাবদ্ধতা লেখা। উপায়: সাধারণ Table, অথবা Module 07 এর CTE।",
          },
          {
            key: "C",
            text: "ERROR 1066: Not unique table/alias",
            isCorrect: false,
            explanation: "সেটা আসে Alias না দিলে। এখানে Alias আছে, সমস্যা TEMPORARY Table এ।",
          },
          {
            key: "D",
            text: "খালি ফলাফল আসে",
            isCorrect: false,
            explanation: "Query টা চলেই না, Error দিয়ে থামে।",
          },
        ],
      },
      {
        id: 8,
        text: "প্রতিটা Departure এর পাশে একই ট্যুরের ঠিক আগের Departure দরকার। কোনটা সবচেয়ে ভালো কথা?",
        options: [
          {
            key: "A",
            text: "এটা Self Join দিয়ে করাই যায় না",
            isCorrect: false,
            explanation: "যায়: আগের সব Departure এর সাথে LEFT JOIN, তারপর max। শুধু পথটা ঘোরানো।",
          },
          {
            key: "B",
            text: "Self Join আর lag() দুটোই একই উত্তর দেয়, তবে lag() জোড়ার পাহাড় না বানিয়ে ঠিক আগের Row দেখে, তাই সাধারণত সহজ আর দ্রুত",
            isCorrect: true,
            explanation: "ঠিক। দুই Query তেই ষোলোটা Row আর একই তারিখ, কিন্তু Self Join এর জোড়া Departure এর সংখ্যার বর্গে বাড়ে।",
          },
          {
            key: "C",
            text: "INNER JOIN দিলে প্রথম Departure এর পাশে NULL আসে",
            isCorrect: false,
            explanation: "INNER JOIN এ প্রথম Departure এর কোনো জোড়া নেই, তাই সে পুরো হারায়। NULL পেতে LEFT JOIN।",
          },
          {
            key: "D",
            text: "DISTINCT ON দিয়েই একমাত্র উপায়",
            isCorrect: false,
            explanation: "DISTINCT ON অন্য প্রশ্নের সরঞ্জাম। এখানে Self Join বা Window Function।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর জোড়ার Report",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিনটা সংখ্যা ব্যাখ্যা করুন:</strong> একই শহরের Customer দের জন্য শুধু সমানের শর্তে, &lt;&gt; সহ আর &lt;
        সহ, তিনটা count বের করুন (৪৭, ৩২, ১৬)। তারপর তিন লাইনে লিখুন প্রতিটা ধাপে কোন Row গুলো পড়ে গেল আর কেন।
      </span>,
      <span key="2">
        <strong>একসাথে যাওয়া যাত্রী:</strong> শুধু confirmed Booking ধরে একই Departure এর যাত্রীদের নামের জোড়া বের করুন।
        Section 007 এর সাত জোড়ার সাথে মিলিয়ে দেখুন কোনগুলো বাদ পড়ল, আর কেন।
      </span>,
      <span key="3">
        <strong>নতুন Guide এর সঙ্গী:</strong> প্রতিটা Guide এর পাশে তাঁর আগে যোগ দেওয়া একই ভাষার Guide দের নাম। কার
        কোনো সঙ্গী নেই, সেটাও যেন দেখা যায় (LEFT JOIN)।
      </span>,
      <span key="4">
        <strong>নিজের গাছ বানান:</strong> নিজের পরিবার বা অফিসের অন্তত সাতজন আর তিন ধাপের একটা staff Table বানান
        (BEGIN দিয়ে শুরু, ROLLBACK দিয়ে শেষ)। প্রত্যেকের পাশে Manager আর Manager এর Manager দেখান।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> রোল খাতার দুটো ফটোকপির উদাহরণ দিয়ে একজন বন্ধুকে বোঝান Self Join কী,
        আর &lt; চিহ্নটা কোন দুটো সমস্যা একসাথে সারায়।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা count এর Query আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d2">confirmed যাত্রীদের জোড়ার Query, ফলাফল আর বাদ পড়াদের ব্যাখ্যা</span>,
      <span key="d3">Guide সঙ্গীর Query আর ফলাফল</span>,
      <span key="d4">নিজের staff Table এর Script আর তিন Column এর ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Self Join",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "নাম আর Error",
        description:
          "প্রথম ফাইলের দুটো Query চালান। প্রথমটা Error দেবে, দ্বিতীয়টা ৪৭টা Row। Error এর লেখাটা খাতায় টুকে রাখুন।",
      },
      {
        title: "তিন শর্ত",
        description: "দ্বিতীয় ফাইলে ৪৭, ৩২, ১৬। প্রতিটা সংখ্যা চালানোর আগে আন্দাজ করুন, তারপর মেলান।",
      },
      {
        title: "একসাথে যাওয়া",
        description: "তৃতীয় ফাইলে আগে নয়টা জোড়া, তারপর বাতিল বাদে সাতটা, শেষে নামসহ সাতটা।",
      },
      {
        title: "আগে আর পরে",
        description: "চতুর্থ ফাইলে ফিরে আসা Customer এর এগারোটা জোড়া আর Guide দের সিনিয়রিটি। INNER আর LEFT এর তফাত মিলিয়ে নিন।",
      },
      {
        title: "গাছ",
        description:
          "পঞ্চম ফাইলটা পুরোটা একবারে চালান: psql -d island_tours -f 05-tree.sql। শেষের ROLLBACK এর পরে staff Table আর থাকে না।",
      },
      {
        title: "Self Join বনাম lag()",
        description: "ষষ্ঠ ফাইলে একই ষোলোটা Row দুইভাবে। দুটো ফলাফল পাশাপাশি রেখে মিলিয়ে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-two-names.sql",
        code: `SELECT customer_id
FROM customers
JOIN customers ON city = city;
-- ERROR:  table name "customers" specified more than once

SELECT a.full_name, b.full_name
FROM customers a
JOIN customers b ON a.city = b.city;
-- (47 rows)`,
      },
      {
        language: "sql",
        filename: "02-pairs.sql",
        code: `SELECT count(*) FROM customers a JOIN customers b
  ON a.city = b.city;
-- 47

SELECT count(*) FROM customers a JOIN customers b
  ON a.city = b.city AND a.customer_id <> b.customer_id;
-- 32

SELECT count(*) FROM customers a JOIN customers b
  ON a.city = b.city AND a.customer_id < b.customer_id;
-- 16`,
      },
      {
        language: "sql",
        filename: "03-together.sql",
        code: `SELECT a.departure_id, a.booking_id, b.booking_id
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id AND a.booking_id < b.booking_id;
-- (9 rows)

SELECT a.departure_id, a.booking_id, b.booking_id
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id AND a.booking_id < b.booking_id
WHERE a.status <> 'cancelled' AND b.status <> 'cancelled';
-- (7 rows)

SELECT a.departure_id, ca.full_name, cb.full_name
FROM bookings a
JOIN bookings b
  ON a.departure_id = b.departure_id AND a.booking_id < b.booking_id
JOIN customers ca ON ca.customer_id = a.customer_id
JOIN customers cb ON cb.customer_id = b.customer_id
WHERE a.status <> 'cancelled' AND b.status <> 'cancelled'
ORDER BY a.departure_id;
-- (7 rows), প্রথম লাইনে Rahim Uddin আর Nusrat Jahan`,
      },
      {
        language: "sql",
        filename: "04-earlier-later.sql",
        code: `SELECT a.customer_id, a.booking_id AS earlier, b.booking_id AS later
FROM bookings a
JOIN bookings b
  ON a.customer_id = b.customer_id AND a.booked_at < b.booked_at;
-- (11 rows)

SELECT g.full_name, count(e.guide_id) AS hired_before
FROM guides g
JOIN guides e ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name;
-- (4 rows), Jamal Hossain নেই

SELECT g.full_name, count(e.guide_id) AS hired_before
FROM guides g
LEFT JOIN guides e ON e.hired_on < g.hired_on
GROUP BY g.guide_id, g.full_name
ORDER BY hired_before;
-- (5 rows): 0, 1, 2, 3, 4`,
      },
      {
        language: "sql",
        filename: "05-tree.sql",
        code: `BEGIN;

CREATE TEMP TABLE staff (
  staff_id   integer PRIMARY KEY,
  full_name  text NOT NULL,
  role       text NOT NULL,
  manager_id integer REFERENCES staff (staff_id)
);

INSERT INTO staff VALUES
  (1, 'Rumana', 'Owner', NULL),
  (2, 'Faruk', 'Operations Manager', 1),
  (3, 'Tanim', 'Developer', 1),
  (4, 'Nabila', 'Support', 2),
  (5, 'Sadia', 'Sales', 2),
  (6, 'Jamal Hossain', 'Guide', 2);

SELECT e.full_name AS employee, m.full_name AS manager
FROM staff e
JOIN staff m ON m.staff_id = e.manager_id;
-- (5 rows), Rumana নেই

SELECT e.full_name AS employee, m.full_name AS manager,
       top.full_name AS managers_manager
FROM staff e
LEFT JOIN staff m   ON m.staff_id = e.manager_id
LEFT JOIN staff top ON top.staff_id = m.manager_id
ORDER BY e.staff_id;
-- (6 rows)

ROLLBACK;`,
      },
      {
        language: "sql",
        filename: "06-previous.sql",
        code: `SELECT cur.tour_id, cur.starts_on,
       max(prev.starts_on) AS previous_departure
FROM departures cur
LEFT JOIN departures prev
  ON prev.tour_id = cur.tour_id AND prev.starts_on < cur.starts_on
GROUP BY cur.departure_id, cur.tour_id, cur.starts_on
ORDER BY cur.tour_id, cur.starts_on;
-- (16 rows)

SELECT tour_id, starts_on,
       lag(starts_on) OVER (PARTITION BY tour_id ORDER BY starts_on)
         AS previous_departure
FROM departures
ORDER BY tour_id, starts_on;
-- (16 rows), উপরের ফলাফলের সাথে হুবহু এক`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ড্রিলের আগে কাগজে লিখে নিন কয়টা Row আসবে বলে আপনার ধারণা। Self Join এ আন্দাজ আর ফলাফলের তফাতই
        সবচেয়ে দ্রুত ভুল ধরিয়ে দেয়: নিজের সাথে জোড়া, উল্টো জোড়া, নয়তো হারিয়ে যাওয়া মূল Row।
      </ContentParagraph>
    ),
  },
};
