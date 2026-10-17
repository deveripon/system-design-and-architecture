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
  AccidentLab,
  CrossPairLab,
  GridBuilderLab,
} from "../../../components/course/topics/joins/cross-animations";
import {
  CommaVsExplicitSplit,
  GridStepsDiagram,
  MenuComboDiagram,
  SizeMultiplyDiagram,
} from "../../../components/course/topics/joins/cross-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const crossJoinContent: TopicData = {
  id: "cross-join",
  introduction: {
    badge: "MODULE 06 · LESSON 05",
    title: <SectionTitle>সবার সাথে সবাই: CROSS JOIN</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন যত Join দেখেছেন, সবগুলো একটা প্রশ্ন দিয়ে শুরু হয়: কোন Row কোন Row এর সাথে মেলে? Booking
          এর customer_id আর Customer এর customer_id মিললে জোড়া, না মিললে নয়। CROSS JOIN এই প্রশ্নটাই
          করে না। সে বাঁয়ের Table এর প্রতিটা Row কে ডানের Table এর প্রতিটা Row এর সাথে একবার করে জোড়া
          দেয়, কোনো শর্ত ছাড়া। নয়টা ট্যুর আর সাতটা Destination হলে তেষট্টিটা জোড়া।
        </ContentParagraph>
        <ContentParagraph>
          শুনে মনে হতে পারে, এমন জিনিস কার কাজে লাগে। আসলে দুই রকম মানুষের কাছে এটা খুব চেনা। একদল
          ইচ্ছা করে ব্যবহার করেন: দামের তালিকা, ক্যালেন্ডারের Grid, প্রতিটা Guide আর প্রতিটা ট্যুরের
          ছক। আরেক দল ভুল করে ব্যবহার করেন, নিজেও না জেনে: একটা Join এর শর্ত লিখতে ভুলে গেলেন, আর
          Dashboard এর আয় হঠাৎ পনেরো গুণ হয়ে গেল, কোনো Error ছাড়া।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন CROSS JOIN আসলে কী করে, Row সংখ্যা কীভাবে গুণ হয়, শর্ত বসালে সেটা
          কীভাবে INNER JOIN হয়ে যায়, কোথায় এটা ইচ্ছা করে কাজে লাগে, আর দুর্ঘটনার Cartesian Product
          কীভাবে চিনবেন ও আটকাবেন। প্রতিটা সংখ্যা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কারো সাথে কারো মিল খুঁজি না। আমার কাছে সবাই সবার জোড়া। আমাকে ডেকে আনলে আমি দারুণ ছক বানিয়ে দিই, আর ভুল করে ডেকে আনলে আপনার হিসাব চুপচাপ ফুলিয়ে দিই।",
      author: "CROSS JOIN",
      role: "Lesson 05",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একই সপ্তাহে দুটো Report, একটায় শূন্য নেই, আরেকটায় সব পনেরো গুণ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর Operations Manager ফারুক সাহেবের
                সাপ্তাহিক বৈঠক। শীতের মৌসুম শুরু, তিনি একটা পরিকল্পনার ছক চাইলেন: প্রতিটা চালু ট্যুরের জন্য
                নভেম্বর থেকে ফেব্রুয়ারি, প্রতি মাসে কয়টা Departure আছে। তাঁর আসল আগ্রহ শূন্যগুলোতে। কোন
                ট্যুরের কোন মাসে কোনো তারিখই নেই, সেটা দেখেই তিনি ঠিক করবেন নতুন Departure কোথায় খুলবেন।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer তানিম এতদিনে INNER JOIN আর GROUP BY ভালোই জানেন। তিনি tours আর departures
                জুড়ে মাস অনুযায়ী গুনে দিলেন। ফলাফলে এল আটটা Row, প্রতিটায় সংখ্যা ১। ফারুক সাহেব তাকিয়ে
                বললেন, শূন্যগুলো কই? Bandarban এর নভেম্বর, Cox&apos;s Bazar Family Package এর পুরো
                শীত, কিছুই তো তালিকায় নেই। তানিমের Query ভুল ছিল না। যে মাসে Departure নেই, সেই মাসের কোনো
                Row ই departures Table এ নেই। যা নেই, তাকে Join দিয়ে খুঁজে আনা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                একই সপ্তাহে Support থেকে নাবিলা আরেকটা সমস্যা আনলেন। Admin Panel এর একটা নতুন Card বলছে
                এ পর্যন্ত মোট Booking এর মূল্য প্রায় ৮৮ লাখ ৮৪ হাজার টাকা। অথচ হিসাবের খাতা বলছে ৫ লাখ ৯২
                হাজার তিনশো। Card এর Query তে একটা লাইন হারিয়ে গিয়েছিল: যে লাইনটা বলে কোন Booking কোন
                Customer এর। ফলে প্রতিটা Booking পনেরো জন Customer এর প্রত্যেকের সাথে জোড়া লেগেছিল, আর
                প্রতিটা টাকা গোনা হয়েছিল পনেরো বার।
              </ContentParagraph>
              <ContentParagraph>
                দুটো সমস্যার পেছনে একটাই জিনিস, CROSS JOIN। প্রথম সমস্যার সমাধান হলো ইচ্ছা করে CROSS JOIN
                ব্যবহার করে সব ট্যুর আর সব মাসের ঘর আগে বানিয়ে নেওয়া, তারপর সংখ্যা বসানো। দ্বিতীয়
                সমস্যাটা হলো অনিচ্ছায় হয়ে যাওয়া CROSS JOIN, যাকে বলে দুর্ঘটনার Cartesian Product। এই লেসন
                এই দুই দিকের গল্প।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: শূন্য কোথায় গেল"
              query={`SELECT t.title,
       to_char(date_trunc('month', d.starts_on), 'YYYY-MM') AS month,
       count(*) AS departures
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
WHERE t.is_active
  AND d.starts_on >= DATE '2026-11-01'
  AND d.starts_on <  DATE '2027-03-01'
GROUP BY t.title, date_trunc('month', d.starts_on)
ORDER BY t.title, month;`}
              caption="আটটা Row, প্রতিটায় ১। চার মাস আর আটটা চালু ট্যুরে মোট ৩২টা ঘর হওয়ার কথা, বাকি ২৪টা ঘর এখানে নেই, কারণ সেগুলোর জন্য departures এ কোনো Row নেই। Cox's Bazar Family Package নামটাই একবারও আসেনি। এই লেসনের মাঝামাঝি এসে আপনি এই একই Report এর ৩২ Row এর সংস্করণ বানাবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "দুই রকম CROSS JOIN, দুই রকম মন",
          content: (
            <ContentParagraph>
              ইচ্ছা করে লেখা CROSS JOIN একটা হাতিয়ার: যেখানে সব সম্ভাব্য জোড়া দরকার, সেখানে এটাই সবচেয়ে
              সোজা উপায়। ভুল করে হয়ে যাওয়া CROSS JOIN একটা নিঃশব্দ বিপদ: Query চলে, সংখ্যা আসে, আর
              সংখ্যাটা ঠিক কয়েক গুণ বড়। এই লেসনের প্রথম অর্ধেক হাতিয়ারটা চেনায়, দ্বিতীয় অর্ধেক বিপদটা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "every-row",
      subHeader: { index: "002", title: "Every Row With Every Row" },
      title: <SectionTitle>রেস্তোরাঁর Combo মেনু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রেস্তোরাঁর কথা ভাবুন, যেখানে তিন রকম ভাত আর চার রকম তরকারি আছে। মালিক একটা Combo মেনু
                ছাপাতে চান, যেখানে প্রতিটা ভাত প্রতিটা তরকারির সাথে একটা করে লাইনে থাকবে। কোনো ভাত কোনো
                তরকারির সাথে বেমানান বলে বাদ যাবে না। তালিকায় লাইন হবে তিন গুণ চার, বারোটা। গণিতে এই
                জোড়াগুলোর পুরো তালিকাকে বলে Cartesian Product, আর SQL এ সেটা বানানোর কাজ করে CROSS JOIN।
              </ContentParagraph>
              <ContentParagraph>
                লেখার নিয়মটা খুব ছোট: <code className={CODE}>FROM A CROSS JOIN B</code>। কোনো ON নেই, কোনো
                শর্ত নেই। ফলাফলের প্রতিটা Row এ বাঁয়ের Table এর একটা Row এর সব Column, তার পাশে ডানের Table
                এর একটা Row এর সব Column। বাঁয়ে যত Row, তার প্রত্যেকটা ডানের সব Row এর সাথে একবার করে আসে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম উদাহরণে ডানের Table হিসেবে নেওয়া যাক একটা ছোট সংখ্যার তালিকা। Module 04 এর তারিখের
                লেসনে আপনি <code className={CODE}>generate_series</code> দেখেছেন, যেটা একটা সংখ্যা বা
                তারিখের সারি বানায়। <code className={CODE}>generate_series(1, 3)</code> হলো তিন Row এর একটা
                ছোট Table: ১, ২ আর ৩। FROM এর ভেতরে এর একটা নামও দিতে হয়, যেমন{" "}
                <code className={CODE}>AS n(people)</code>, মানে Table টার নাম n আর তার একমাত্র Column এর
                নাম people।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MenuComboDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা ট্যুর × তিনটা দলের মাপ"
              query={`SELECT t.title, n.people
FROM tours t
CROSS JOIN generate_series(1, 3) AS n(people)
WHERE t.tour_id IN (1, 6, 7)
ORDER BY t.title, n.people;`}
              caption="নয়টা Row। প্রতিটা ট্যুর তিনবার এসেছে, প্রতিবার আলাদা একটা people এর সাথে। WHERE এখানে শুধু তিনটা ট্যুর বেছে নিয়েছে, যাতে ফলাফল ছোট থাকে। WHERE মুছে চালিয়ে দেখুন: নয়টা ট্যুর × তিন = ২৭টা Row।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলাফলটা একটু খেয়াল করে দেখুন। tours এর কোনো Column এর সাথে n এর কোনো Column মেলানো হয়নি।
                মেলানোর মতো কিছু নেইও, কারণ people নামের সংখ্যাটা কোনো ট্যুরের অংশ না। দুটো সম্পূর্ণ আলাদা
                তালিকা, আর CROSS JOIN শুধু তাদের প্রতিটা সম্ভাব্য জোড়া সাজিয়ে দিয়েছে। এটাই CROSS JOIN এর
                স্বভাব: সে প্রশ্ন করে না, শুধু গুণ করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cartesian Product নামটা কোথা থেকে",
          content: (
            <ContentParagraph>
              ফরাসি গণিতবিদ René Descartes এর নাম থেকে, যাঁর নামে গ্রাফের x আর y অক্ষের ব্যবস্থাকেও Cartesian
              বলা হয়। দুটো সেট A আর B এর Cartesian Product মানে সব জোড়া (a, b), যেখানে a আসে A থেকে আর b
              আসে B থেকে। SQL এর CROSS JOIN ঠিক এই জিনিসটাই, শুধু সেটের বদলে Table আর উপাদানের বদলে Row।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "sizes-multiply",
      subHeader: { index: "003", title: "Sizes Multiply" },
      title: <SectionTitle>যোগ না, গুণ: Row সংখ্যা কীভাবে লাফ দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CROSS JOIN এর ফলাফলে কয়টা Row আসবে, সেটা চালানোর আগেই বলে দেওয়া যায়। বাঁয়ে m টা Row, ডানে n
                টা Row হলে ফলাফলে ঠিক m × n টা Row। tours এ ৯টা, destinations এ ৭টা, তাই{" "}
                <code className={CODE}>tours CROSS JOIN destinations</code> এ ৬৩টা Row। তার সাথে আরেকটা Table
                জুড়লে আবার গুণ: guides এর ৫টা Row মিলিয়ে ৩১৫।
              </ContentParagraph>
              <ContentParagraph>
                এই গুণটাই CROSS JOIN কে একদিকে শক্তিশালী আর অন্যদিকে বিপজ্জনক করে। ছোট ছোট Table, যাদের
                কোনোটাতেই বিশটার বেশি Row নেই, কয়েকটা একসাথে গুণ হলে হাজার পেরিয়ে যায়। আসল Production
                Database এ যেখানে এক Table এ লাখ Row, সেখানে দুটোর Cartesian Product হাজার কোটির ঘরে চলে যেতে
                পারে। নিচের Query গুলোতে আমরা শুধু গুনব, Row গুলো দেখাব না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Table এর মাপ আর জোড়ার সংখ্যা"
              query={`SELECT count(*) AS tours FROM tours;
SELECT count(*) AS destinations FROM destinations;
SELECT count(*) AS pairs FROM tours CROSS JOIN destinations;
SELECT count(*) AS with_guides
FROM tours CROSS JOIN destinations CROSS JOIN guides;`}
              caption="৯, ৭, ৬৩ আর ৩১৫। প্রতিটা নতুন CROSS JOIN আগের ফলাফলকে নতুন Table এর Row সংখ্যা দিয়ে গুণ করে। নিজে একটা অনুমান করে তারপর চালান: এর সাথে customers জুড়লে কত হবে?"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SizeMultiplyDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা ছোট Table, আটষট্টি হাজার Row"
              query={`SELECT count(*) AS row_count
FROM bookings
CROSS JOIN payments
CROSS JOIN reviews
CROSS JOIN customers;`}
              caption="২৪ × ১৯ × ১০ × ১৫ = ৬৮,৪০০। চারটা Table এর মোট Row মাত্র ৬৮টা, কিন্তু তাদের সব জোড়া ৬৮,৪০০টা। এখানে শুধু count দেখাচ্ছি বলে চোখের পলকে চলে যায়। SELECT * দিলে Browser কে এত Row আঁকতে হতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  destinations, guides আর reviews, এই তিনটা Table এর CROSS JOIN এ কয়টা Row হবে? চালানোর
                  আগে খাতায় গুণ করে নিন, তারপর একটা Query লিখুন যেটা শুধু সেই সংখ্যাটা ফেরত দেয়: একটা Row,
                  একটা Column।
                </>
              }
              hint={
                <>
                  <code className={CODE}>SELECT count(*) FROM destinations CROSS JOIN guides CROSS JOIN reviews</code>।
                  উত্তর হওয়ার কথা ৭ × ৫ × ১০।
                </>
              }
              solution={`SELECT count(*) AS row_count
FROM destinations
CROSS JOIN guides
CROSS JOIN reviews;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-pair",
      subHeader: { index: "004", title: "Watch It Pair" },
      title: <SectionTitle>চোখের সামনে জোড়া লাগা দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিচের ছকে সারিগুলো tours Table এর নয়টা আসল ট্যুর, আর Column গুলো destinations এর সাতটা
                আসল জায়গা। প্রতিটা ঘর মানে একটা সম্ভাব্য জোড়া, ফলাফলের একটা Row। একটা একটা করে ট্যুর জোড়া
                লাগান আর গুনতিটা খেয়াল করুন: প্রতিবার ঠিক সাতটা করে বাড়ে, কারণ প্রতিটা ট্যুর সাতটা
                Destination এর প্রত্যেকটার সাথেই জোড়া পায়।
              </ContentParagraph>
              <ContentParagraph>
                তারপর শর্তের বোতামটা চাপুন। শর্তটা হলো ট্যুরের destination_id আর Destination এর id মিলতে
                হবে। তখন প্রতিটা সারিতে শুধু একটা ঘর টিকে থাকে, সেই ট্যুরের নিজের জায়গা। আর Kuakata এর পুরো
                Column খালি হয়ে যায়, কারণ কোনো ট্যুরই সেখানে যায় না। এই ছবিটা মাথায় রাখুন, পরের Section
                এর পুরো কথাটা এর ভেতরেই আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CrossPairLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা সারি কাছ থেকে: Ratargul এর সাতটা জোড়া"
              query={`SELECT t.title, d.name
FROM tours t
CROSS JOIN destinations d
WHERE t.tour_id = 7
ORDER BY d.destination_id;`}
              caption="সাতটা Row। Ratargul Swamp Boat Day আসলে যায় শুধু Sylhet এ, অথচ এখানে সে Saint Martin, Sundarbans, এমনকি Kuakata র সাথেও জোড়া পেয়েছে। CROSS JOIN জানে না, জানতে চায়ও না, কোন জোড়াটা সত্যি। এই সাতটার মধ্যে আসল জোড়া একটাই।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "cross-plus-condition",
      subHeader: { index: "005", title: "CROSS JOIN Plus a Condition" },
      title: <SectionTitle>সব জোড়া থেকে আসলগুলো বাছাই করলেই INNER JOIN</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছকে শর্তের বোতাম চাপার পর যা দেখলেন, সেটা একটা গুরুত্বপূর্ণ সত্য। সব সম্ভাব্য জোড়া থেকে
                শুধু সেই জোড়াগুলো রাখলে, যেখানে Key মেলে, ফলাফলটা হুবহু INNER JOIN এর ফলাফল। SQL এর ভাষায়{" "}
                <code className={CODE}>A CROSS JOIN B WHERE শর্ত</code> আর{" "}
                <code className={CODE}>A JOIN B ON শর্ত</code> একই Row দেয়। PostgreSQL এর Documentation
                নিজেই লিখে রেখেছে, <code className={CODE}>T1 CROSS JOIN T2</code> মানে ঠিক{" "}
                <code className={CODE}>T1 INNER JOIN T2 ON TRUE</code>, মানে এমন একটা INNER JOIN যার শর্ত
                সবসময় সত্য।
              </ContentParagraph>
              <ContentParagraph>
                তাই INNER JOIN কে মনে মনে এভাবে ভাবা যায়: আগে সব জোড়া বানানো হলো, তারপর ON এর শর্ত দিয়ে
                ছাঁকা হলো। এটা বোঝার একটা ছবি, Database এর আসল কাজের পদ্ধতি না। আসলে Database সাধারণত ৬৩টা
                জোড়া বানিয়ে তারপর ৫৪টা ফেলে দেয় না। শর্ত দেখেই সে বুদ্ধিমানের মতো শুধু মেলা জোড়াগুলো খুঁজে
                নেয়। নিচের দ্বিতীয় Query বক্সে সেটা নিজের চোখে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুইভাবে লেখা, একই উত্তর"
              query={`SELECT t.title, d.name
FROM tours t
CROSS JOIN destinations d
WHERE t.destination_id = d.destination_id
ORDER BY t.tour_id;

SELECT t.title, d.name
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id
ORDER BY t.tour_id;`}
              caption="দুটো Query ই নয়টা করে Row দেয়, একই ক্রমে, একই মান। Kuakata কোনোটাতেই নেই, কারণ কোনো ট্যুরের destination_id ৭ না। শর্ত কোথায় বসল, WHERE এ নাকি ON এ, INNER JOIN এর ফলাফলে সেটা কিছু বদলায় না। Outer Join এর বেলায় এই কথা আর খাটে না, সেটা আসবে Lesson 07 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Database আসলে কী করে: তিনটা Plan"
              query={`EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT * FROM tours CROSS JOIN destinations;

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT * FROM tours t CROSS JOIN destinations d
WHERE t.destination_id = d.destination_id;

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT * FROM tours t JOIN destinations d
  ON d.destination_id = t.destination_id;`}
              caption="প্রথমটায় Nested Loop আর actual rows=63.00: শর্ত নেই, তাই সত্যিই সব জোড়া বানানো হয়েছে। দ্বিতীয় আর তৃতীয়টায় হুবহু একই Plan, Hash Join আর actual rows=9.00। মানে CROSS JOIN এর সাথে WHERE এ শর্ত দেখে PostgreSQL নিজেই বুঝে নিয়েছে এটা আসলে একটা INNER JOIN, আর ৬৩টা জোড়া বানায়ইনি। EXPLAIN পড়া শিখবেন Module 13 এ, আপাতত শুধু actual rows সংখ্যাটা দেখুন।"
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
                  CROSS JOIN আর WHERE ব্যবহার করে প্রতিটা ট্যুরের <code className={CODE}>title</code> আর তার
                  Destination এর <code className={CODE}>name</code> দেখান, শুধু আসল জোড়াগুলো। দুটো Column, এই
                  ক্রমে। এবার JOIN ... ON লিখবেন না, শর্তটা WHERE এ বসান। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours t CROSS JOIN destinations d</code>, তারপর{" "}
                  <code className={CODE}>WHERE t.destination_id = d.destination_id</code>। নয়টা Row আসার কথা।
                </>
              }
              solution={`SELECT t.title, d.name
FROM tours t
CROSS JOIN destinations d
WHERE t.destination_id = d.destination_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "তাহলে CROSS JOIN WHERE দিয়ে Join লেখা যায়, লেখা উচিত কি?",
          content: (
            <ContentParagraph>
              চলবে, কিন্তু উচিত না। যে জোড়ার শর্ত আছে, সেটা INNER JOIN আর ON দিয়েই লিখুন। তাতে যিনি পড়বেন
              তিনি সাথে সাথে বোঝেন কোন Table কোন Key দিয়ে জুড়েছে, আর শর্তটা ভুলে যাওয়ার সুযোগও কমে।
              CROSS JOIN শব্দটা রাখুন সেই জায়গার জন্য, যেখানে আপনি সত্যিই সব জোড়া চান। তাহলে Code পড়েই বোঝা
              যায়, এই গুণটা ইচ্ছাকৃত।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "price-chart",
      subHeader: { index: "006", title: "A Price Chart" },
      title: <SectionTitle>ইচ্ছাকৃত ব্যবহার ১: দলের মাপ অনুযায়ী দামের তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Website এ প্রতিটা ট্যুরের পাতায় একটা ছোট ছক আছে: একা গেলে কত, দুজনে কত,
                তিনজনে কত, চারজনে কত। Customer দের সবচেয়ে বেশি জিজ্ঞাসা এই প্রশ্নটাই। এই ছক বানাতে দরকার
                প্রতিটা ট্যুর আর প্রতিটা সম্ভাব্য দলের মাপের প্রতিটা জোড়া। ঠিক এই কাজটাই CROSS JOIN এর।
              </ContentParagraph>
              <ContentParagraph>
                দলের মাপগুলো কোনো Table এ রাখা নেই, রাখার দরকারও নেই। <code className={CODE}>generate_series(1, 4)</code>{" "}
                দিয়ে চারটা Row বানিয়ে নিলেই হয়। তারপর প্রতিটা জোড়ায় দাম গুণ মানুষ, আর চাইলে একটা CASE দিয়ে
                বড় দলের ছাড়। Module 03 আর 04 এ শেখা সব জিনিস এখানে একসাথে কাজে লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো ট্যুরের দামের ছক"
              query={`SELECT t.title,
       n.people,
       t.price_bdt * n.people AS total_bdt
FROM tours t
CROSS JOIN generate_series(1, 4) AS n(people)
WHERE t.tour_id IN (1, 7)
ORDER BY t.title, n.people;`}
              caption="আটটা Row: Ratargul এর ৩৫০০ থেকে ১৪০০০, Saint Martin এর ১২৫০০ থেকে ৫০০০০। IN এর তালিকা মুছে দিলে সব নয়টা ট্যুরের ছক আসবে, ৩৬টা Row।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার বা তার বেশি জনে দশ শতাংশ ছাড়"
              query={`SELECT t.title,
       n.people,
       t.price_bdt * n.people AS full_price,
       CASE WHEN n.people >= 4
            THEN round(t.price_bdt * n.people * 0.9, 2)
            ELSE t.price_bdt * n.people
       END AS offer_price
FROM tours t
CROSS JOIN generate_series(1, 5) AS n(people)
WHERE t.tour_id = 1
ORDER BY n.people;`}
              caption="পাঁচটা Row। চারজনে পুরো দাম ৫০০০০, ছাড়ের পর ৪৫০০০.০০; পাঁচজনে ৬২৫০০ থেকে ৫৬২৫০.০০। ছাড়ের নিয়মটা এখানে কল্পিত, Island Tours এর আসল নিয়ম না, কিন্তু ছক বানানোর পদ্ধতিটা আসল।"
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
                  সব <strong>চালু</strong> ট্যুরের জন্য ১, ২ আর ৩ জনের দামের ছক বানান। Column তিনটা, এই ক্রমে:{" "}
                  <code className={CODE}>title</code>, <code className={CODE}>people</code>,{" "}
                  <code className={CODE}>total_bdt</code> (দাম গুণ মানুষ)। সাজান title অনুযায়ী, তারপর people
                  অনুযায়ী।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CROSS JOIN generate_series(1, 3) AS n(people)</code>, আর চালু ট্যুরের
                  জন্য <code className={CODE}>WHERE t.is_active</code>। আটটা চালু ট্যুর × তিন = ২৪টা Row।
                </>
              }
              solution={`SELECT t.title,
       n.people,
       t.price_bdt * n.people AS total_bdt
FROM tours t
CROSS JOIN generate_series(1, 3) AS n(people)
WHERE t.is_active
ORDER BY t.title, n.people;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "one-row-tables",
      subHeader: { index: "007", title: "One-Row Tables" },
      title: <SectionTitle>ইচ্ছাকৃত ব্যবহার ২: এক Row এর Table দিয়ে মান পাশে বসানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গুণের নিয়মের একটা মজার দিক আছে। একদিকে যদি ঠিক একটা Row থাকে, তাহলে ফলাফলে Row সংখ্যা বাড়ে
                না: ১৬ × ১ = ১৬। প্রতিটা Row এর পাশে শুধু সেই একটা Row এর মানগুলো এসে বসে। এটা দিয়ে একটা খুব
                কাজের কৌশল চলে: কয়েকটা মান একবার লিখে রাখা, আর পুরো Query তে নাম ধরে ব্যবহার করা।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন আমরা চাই প্রতিটা আসন্ন Departure কত দিন পরে। এই ট্র্যাকের গল্পে আজ 1 November 2026।
                তারিখটা প্রতিটা জায়গায় আলাদা করে না লিখে একটা এক Row এর ছোট Table বানাই:{" "}
                <code className={CODE}>(VALUES (DATE &apos;2026-11-01&apos;)) AS p(today)</code>। VALUES হলো
                হাতে লেখা একটা ছোট Table, এখানে একটা Row আর একটা Column, যার নাম today। এবার একে CROSS JOIN
                করলে প্রতিটা Departure এর পাশে today এসে বসে, আর আমরা লিখতে পারি{" "}
                <code className={CODE}>d.starts_on - p.today</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আজ থেকে তিন সপ্তাহের ভেতরের Departure"
              query={`SELECT d.departure_id,
       d.starts_on,
       d.starts_on - p.today AS days_away
FROM departures d
CROSS JOIN (VALUES (DATE '2026-11-01', 21)) AS p(today, horizon)
WHERE d.starts_on >= p.today
  AND d.starts_on - p.today <= p.horizon
ORDER BY d.starts_on;`}
              caption="তিনটা Row: Departure 14 আর ১৩ দিন পরে, 8 আর ১৯ দিন পরে, 15 আর ২০ দিন পরে। এখানে এক Row এর Table এ দুটো মান রাখা: today আর horizon। পরের সপ্তাহে Report টা আবার চালাতে হলে শুধু এক জায়গায় তারিখ বদলালেই চলে। horizon ২১ থেকে ৪০ করে চালিয়ে দেখুন।"
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
                  এক Row এর একটা VALUES Table দিয়ে আজকের তারিখ 2026-11-01 রাখুন, আর আজ বা তার পরের প্রতিটা
                  Departure এর <code className={CODE}>departure_id</code>, <code className={CODE}>starts_on</code>{" "}
                  আর <code className={CODE}>days_away</code> (কত দিন পরে) দেখান। সাজান starts_on অনুযায়ী।
                </>
              }
              hint={
                <>
                  <code className={CODE}>CROSS JOIN (VALUES (DATE &apos;2026-11-01&apos;)) AS p(today)</code>,
                  তারপর <code className={CODE}>WHERE d.starts_on &gt;= p.today</code>। তারিখ থেকে তারিখ বাদ দিলে
                  দিনের সংখ্যা আসে, Module 04 এ দেখেছেন। নয়টা Row।
                </>
              }
              solution={`SELECT d.departure_id,
       d.starts_on,
       d.starts_on - p.today AS days_away
FROM departures d
CROSS JOIN (VALUES (DATE '2026-11-01')) AS p(today)
WHERE d.starts_on >= p.today
ORDER BY d.starts_on;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আসল App এ today কোথা থেকে আসে",
          content: (
            <ContentParagraph>
              এই লেসনে আজকের তারিখ হাতে লেখা, যাতে প্রতিটা উত্তর সব দিন একই থাকে আর Exercise যাচাই করা যায়।
              আসল App এ আজকের তারিখ আসে <code className={CODE}>current_date</code> থেকে, অথবা App নিজে
              Parameter হিসেবে পাঠায়। তবু এক Row এর Table এর কৌশলটা একই থাকে: মানগুলো এক জায়গায়, Query
              জুড়ে নাম ধরে ব্যবহার। Parameter পাঠানোর নিরাপদ উপায় শিখবেন Module 17 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "empty-side",
      subHeader: { index: "008", title: "The Empty Side" },
      title: <SectionTitle>শূন্য দিয়ে গুণ করলে শূন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গুণের নিয়মের উল্টো দিকটাও মনে রাখা জরুরি। কোনো একদিকে যদি একটাও Row না থাকে, তাহলে ফলাফলে
                কিছুই থাকে না, অন্যদিকে যত Row ই থাকুক। নয়টা ট্যুর গুণ শূন্য সমান শূন্য। রেস্তোরাঁর উদাহরণে
                ফিরে যাই: আজ যদি কোনো তরকারিই রান্না না হয়, তাহলে Combo মেনুতে একটা লাইনও ছাপা হবে না, ভাত
                যত রকমই থাকুক।
              </ContentParagraph>
              <ContentParagraph>
                বাস্তবে এটা একটা লুকোনো ফাঁদ। ধরুন দামের ছক বানাতে আপনি ট্যুরগুলোকে একটা ছাড়ের তালিকার সাথে
                CROSS JOIN করেছেন, আর কোনো এক সপ্তাহে ছাড়ের তালিকা খালি। Error আসবে না, শুধু পুরো ছকটা খালি
                হয়ে যাবে। Website এর ট্যুরের পাতায় দাম দেখাবে না, আর প্রথমে কেউ বুঝবে না কেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একদিক খালি হলে পুরো ফলাফল খালি"
              query={`SELECT count(*) AS pairs
FROM tours
CROSS JOIN generate_series(1, 0) AS g(n);

SELECT count(*) AS pairs
FROM tours t
CROSS JOIN guides g
WHERE g.language = 'French';`}
              caption="দুটোতেই ০। প্রথমটায় generate_series(1, 0) কোনো Row ই বানায় না, কারণ ১ থেকে ০ পর্যন্ত গোনার কিছু নেই। দ্বিতীয়টায় সম্ভাব্য জোড়া ছিল ৯ × ৫ = ৪৫টা, কিন্তু কোনো Guide French বলেন না, তাই WHERE এর পরে একটাও টেকেনি। ফলাফল একই: একটা ট্যুরও তালিকায় নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "খালি হয়ে গেলে যদি একদিকের সব Row রাখতে চান",
          content: (
            <ContentParagraph>
              যদি এমন হয় যে ছাড়ের তালিকা খালি থাকলেও ট্যুরগুলো দেখাতেই হবে, তাহলে CROSS JOIN ভুল হাতিয়ার।
              তখন দরকার <Link href="/sql/topic/left-right-join" className={LINK}>LEFT JOIN</Link>, যেটা
              বাঁয়ের প্রতিটা Row রাখে আর ডানে কিছু না পেলে NULL বসায়। CROSS JOIN এ কোনো Row এর নিজস্ব
              গ্যারান্টি নেই: একদিক খালি মানে সব খালি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "report-grid",
      subHeader: { index: "009", title: "The Report Grid" },
      title: <SectionTitle>ইচ্ছাকৃত ব্যবহার ৩: শূন্যসহ পুরো ছক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার ফারুক সাহেবের ছকে ফিরে যাই। লেসনের শুরুতে তানিমের Query তে শূন্যগুলো আসেনি, কারণ যে
                মাসে Departure নেই, সেই মাসের জন্য departures এ কোনো Row নেই। সমাধানের চাবিকাঠি হলো উল্টো দিক
                থেকে ভাবা: আগে সব ঘর বানিয়ে নেওয়া, তারপর সংখ্যা বসানো। ঘর বানানো হবে CROSS JOIN দিয়ে, আর
                সংখ্যা বসানো হবে LEFT JOIN দিয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথম ধাপ, ক্যালেন্ডার:</strong>{" "}
                  <code className={CODE}>generate_series(DATE &apos;2026-11-01&apos;, DATE &apos;2027-02-01&apos;, interval &apos;1 month&apos;)</code>{" "}
                  চারটা মাসের শুরুর মুহূর্ত দেয়: নভেম্বর, ডিসেম্বর, জানুয়ারি, ফেব্রুয়ারি।
                </ListItem>
                <ListItem>
                  <strong>দ্বিতীয় ধাপ, সব ঘর:</strong> আটটা চালু ট্যুরকে এই চার মাসের সাথে CROSS JOIN করলে ৩২টা
                  Row, প্রতিটা ট্যুর আর মাসের জোড়ার জন্য একটা। এখনো কোনো সংখ্যা নেই, শুধু খালি ঘর।
                </ListItem>
                <ListItem>
                  <strong>তৃতীয় ধাপ, সংখ্যা বসানো:</strong> প্রতিটা ঘরকে departures এর সাথে LEFT JOIN, যেখানে
                  ট্যুর মেলে আর তারিখ সেই মাসের ভেতরে। মিললে Departure এর Row আসে, না মিললে NULL। তারপর GROUP BY
                  আর <code className={CODE}>count(d.departure_id)</code>: NULL গোনা হয় না, তাই খালি ঘরে ০।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                LEFT JOIN এর খুঁটিনাটি আপনি{" "}
                <Link href="/sql/topic/left-right-join" className={LINK}>Lesson 03</Link> এ দেখেছেন, আর
                count(*) বনাম count(column) এর পার্থক্য Module 05 এ। এখানে দুটো একসাথে কাজ করছে, আর তার আগে
                CROSS JOIN প্রতিটা ঘরকে অস্তিত্ব দিচ্ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GridStepsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় ধাপ: ৩২টা খালি ঘর"
              query={`SELECT t.title, m.month::date AS month
FROM tours t
CROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',
                           interval '1 month') AS m(month)
WHERE t.is_active
ORDER BY t.title, month;`}
              caption="৩২টা Row: আটটা চালু ট্যুরের প্রত্যেকটা চারবার, প্রতিবার আলাদা মাসের সাথে। Cox's Bazar Family Package ও আছে, যার কোনো Departure ই নেই। generate_series এখানে সময়সহ মান দেয়, তাই ::date দিয়ে শুধু তারিখটা দেখাচ্ছি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তৃতীয় ধাপ: ফারুক সাহেবের পুরো ছক"
              query={`SELECT t.title,
       to_char(m.month, 'YYYY-MM') AS month,
       count(d.departure_id) AS departures
FROM tours t
CROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',
                           interval '1 month') AS m(month)
LEFT JOIN departures d
       ON d.tour_id = t.tour_id
      AND d.starts_on >= m.month
      AND d.starts_on <  m.month + interval '1 month'
WHERE t.is_active
GROUP BY t.title, m.month
ORDER BY t.title, m.month;`}
              caption="৩২টা Row, আটটায় ১, চব্বিশটায় ০। এবার শূন্যগুলো দেখা যাচ্ছে: Bandarban এর নভেম্বর আর ডিসেম্বর, Family Package এর পুরো শীত, আর ফেব্রুয়ারিতে কোনো চালু ট্যুরেরই তারিখ নেই। count(*) লিখে চালিয়ে দেখুন: সব ঘরে অন্তত ১ আসবে, কারণ LEFT JOIN এর পরে প্রতিটা ঘরে একটা Row থাকে, NULL হলেও।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <GridBuilderLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ধাঁচটা মুখস্থ রাখার মতো, কারণ Report এর জগতে এটা সবচেয়ে বেশি দরকার হয়: দিন বা মাসের
                তালিকা CROSS JOIN জিনিসের তালিকা, তারপর LEFT JOIN আসল ঘটনা। দৈনিক বিক্রির Chart এ যে দিন কিছু
                বিক্রি হয়নি, সেখানে রেখাটা শূন্যে নামা উচিত, লাফ দিয়ে পরের দিনে চলে যাওয়া না। প্রতিটা Store ×
                প্রতিটা দিন, প্রতিটা Guide × প্রতিটা সপ্তাহ, প্রতিটা Product × প্রতিটা অঞ্চল: সবখানে একই তিন ধাপ।
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
                  ফারুক সাহেবের ছকটা নিজে লিখুন। প্রতিটা <strong>চালু</strong> ট্যুর আর নভেম্বর 2026 থেকে
                  ফেব্রুয়ারি 2027 পর্যন্ত প্রতিটা মাসের জন্য একটা Row, Departure না থাকলেও। Column তিনটা, এই
                  ক্রমে: <code className={CODE}>title</code>, <code className={CODE}>month</code> (
                  <code className={CODE}>to_char</code> দিয়ে YYYY-MM আকারে) আর{" "}
                  <code className={CODE}>departures</code> (সেই মাসে কয়টা)। সাজান title, তারপর মাস অনুযায়ী।
                </>
              }
              hint={
                <>
                  তিন ধাপ: <code className={CODE}>generate_series</code> দিয়ে মাস, চালু ট্যুরের সাথে CROSS
                  JOIN, তারপর departures এর সাথে LEFT JOIN যেখানে ট্যুর মেলে আর তারিখ মাসের ভেতরে। গুনুন{" "}
                  <code className={CODE}>count(d.departure_id)</code> দিয়ে, count(*) দিয়ে না। ৩২টা Row।
                </>
              }
              solution={`SELECT t.title,
       to_char(m.month, 'YYYY-MM') AS month,
       count(d.departure_id) AS departures
FROM tours t
CROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',
                           interval '1 month') AS m(month)
LEFT JOIN departures d
       ON d.tour_id = t.tour_id
      AND d.starts_on >= m.month
      AND d.starts_on <  m.month + interval '1 month'
WHERE t.is_active
GROUP BY t.title, m.month
ORDER BY t.title, m.month;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "accidental-product",
      subHeader: { index: "010", title: "The Accidental Product" },
      title: <SectionTitle>যে Join এর শর্ত হারিয়ে গেছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার লেসনের দ্বিতীয় অর্ধেক, নাবিলার আনা সমস্যা। একটা Join এ দুটো জিনিস লাগে: কোন দুটো Table,
                আর কোন শর্তে তাদের Row জোড়া লাগবে। শর্তটা যদি কোনোভাবে হারিয়ে যায়, ভুলে বাদ পড়ে, বা
                সবসময় সত্য এমন কিছু হয়ে যায়, তাহলে Join টা চুপচাপ CROSS JOIN হয়ে যায়। এটাকেই বলে দুর্ঘটনার
                Cartesian Product, আর SQL এর সবচেয়ে চেনা নিঃশব্দ ভুলগুলোর একটা।
              </ContentParagraph>
              <ContentParagraph>
                নিঃশব্দ, কারণ Database এর চোখে এখানে কোনো ভুল নেই। আপনি দুটো Table চেয়েছেন, শর্ত দেননি, সে
                সব জোড়া দিয়েছে। Row সংখ্যা বড় হয়, আর তার চেয়েও খারাপ, প্রতিটা যোগফল ঠিক একটা পূর্ণ সংখ্যা
                দিয়ে গুণ হয়ে যায়। ২৪টা Booking আর ১৫ জন Customer এর বেলায় সেই সংখ্যা ১৫।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নাবিলার Card: ভুল আর ঠিক পাশাপাশি"
              query={`SELECT count(*) AS row_count, sum(b.total_bdt) AS total
FROM bookings b, customers c;

SELECT count(*) AS row_count, sum(b.total_bdt) AS total
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;`}
              caption="প্রথমটায় ৩৬০টা Row আর 8884500.00, দ্বিতীয়টায় ২৪টা Row আর 592300.00। ভাগ করে দেখুন: 8884500 ÷ 592300 = ১৫, ঠিক Customer এর সংখ্যা। ফোলানো সংখ্যার এই নিখুঁত পূর্ণ গুণফলই দুর্ঘটনার Cartesian Product এর সবচেয়ে বড় চিহ্ন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AccidentLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ল্যাবের শেষ বোতামটা আলাদা করে বোঝা দরকার, কারণ বাস্তবে এটাই সবচেয়ে বেশি ঘটে। Query তে
                Duplicate Row দেখে অনেকে সমস্যার উৎস না খুঁজে DISTINCT বসিয়ে দেন। Row গুলো আর একই রকম দেখায়
                না, সংখ্যাটাও স্বাভাবিক লাগে, তাই সবাই খুশি। কিন্তু ভেতরে Join টা তখনো ভাঙা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DISTINCT ভুল ঢাকে, সারায় না"
              query={`SELECT DISTINCT c.full_name
FROM bookings b, customers c
WHERE b.status = 'pending'
ORDER BY c.full_name;

SELECT c.full_name, b.booking_id
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
ORDER BY b.booking_id;`}
              caption="প্রথমটায় পনেরোটা নাম, মানে সব Customer, এমনকি Imran Kabir ও, যাঁর কোনো Booking ই নেই। দ্বিতীয়টায় আসল উত্তর, চারজন: Kamal Hasan, Rahim Uddin, Priya Sharma আর Shuvo Das। DISTINCT ৬০টা Row থেকে ৪৫টা কপি মুছেছে ঠিকই, কিন্তু ভুল মানুষগুলো থেকে গেছে। Module 03 এর DISTINCT লেসনে এই গন্ধের কথাই বলা হয়েছিল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              orderMatters
              starter={`SELECT c.full_name, b.booking_id
FROM bookings b, customers c
WHERE b.status = 'pending';`}
              task={
                <>
                  নিচের Query টা pending Booking গুলোর Customer এর নাম দেখানোর কথা, কিন্তু দেয় ৬০টা Row। এটা
                  ঠিক করুন। Column দুটো, এই ক্রমে: <code className={CODE}>full_name</code> আর{" "}
                  <code className={CODE}>booking_id</code>। সাজান booking_id অনুযায়ী। পারলে JOIN ... ON দিয়ে
                  লিখুন।
                </>
              }
              hint={
                <>
                  হারানো শর্তটা হলো <code className={CODE}>c.customer_id = b.customer_id</code>। সেটা ON এ বসান,
                  আর শেষে <code className={CODE}>ORDER BY b.booking_id</code>। চারটা Row।
                </>
              }
              solution={`SELECT c.full_name, b.booking_id
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.status = 'pending'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "old-comma-joins",
      subHeader: { index: "011", title: "Old Comma Joins" },
      title: <SectionTitle>FROM a, b: পুরনো ধরন কেন এখনো চোখে পড়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণে কয়েকবার একটা অদ্ভুত লেখা দেখেছেন: FROM এ কমা দিয়ে দুটো Table,{" "}
                <code className={CODE}>FROM bookings b, customers c</code>। এটা Join লেখার পুরনো ধরন, যাকে বলে
                implicit join notation। কমা মানে CROSS JOIN, আর জোড়ার শর্ত বসে WHERE এ, অন্য সব ছাঁকনির সাথে।
                PostgreSQL এর Documentation বলে <code className={CODE}>FROM T1, T2</code> আর{" "}
                <code className={CODE}>FROM T1 CROSS JOIN T2</code> একই জিনিস।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Code এ এই ধরন লেখার কোনো কারণ নেই, তবু এটা চেনা জরুরি। পুরনো Project এর Code, পুরনো বই,
                আর অনেক Interview এর প্রশ্নে এই ধাঁচ খুব দেখা যায়, আর Database গুলো এখনো এটা পুরোপুরি চালায়।
                কোনো দিন হাজার লাইনের একটা পুরনো Report Query সারাতে বসলে আপনি সম্ভবত এই কমাগুলোর ভেতরেই ভুলটা
                খুঁজবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CommaVsExplicitSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরনো ধরন, শর্ত ঠিকঠাক থাকলে"
              query={`SELECT c.full_name, b.booking_id
FROM bookings b, customers c
WHERE b.customer_id = c.customer_id
  AND b.status = 'pending'
ORDER BY b.booking_id;`}
              caption="চারটা Row, Exercise 5 এর উত্তরের সাথে হুবহু মেলে। শর্ত থাকলে কমার ধরনও ঠিক উত্তর দেয়। সমস্যা হলো জোড়ার শর্ত আর সাধারণ ছাঁকনি একই WHERE এ মিশে থাকে, তাই কোনটা কোন কাজের, এক নজরে বোঝা যায় না, আর একটা হারালেও কেউ টের পায় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো Table এ ভুলটা সহজে চোখে পড়ে। তিন চারটা Table হলে আর পড়ে না। ধরুন bookings, departures আর
                tours, তিনটাই কমা দিয়ে লেখা, আর WHERE এ দুটো শর্ত লাগার কথা, আপনি লিখেছেন একটা। bookings আর
                departures ঠিকমতো জোড়া লাগল, ২৪টা Row। কিন্তু tours এর সাথে কোনো শর্ত নেই, তাই প্রতিটা Row নয়টা
                ট্যুরের সাথেই জোড়া লাগল: ২১৬টা Row, আর প্রতিটা টাকা নয় বার গোনা। ল্যাবের চতুর্থ বোতামে এটাই
                দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                কমার আরেকটা ফাঁদ আছে, যখন কমা আর JOIN একই FROM এ মেশানো হয়। JOIN কমার চেয়ে শক্ত করে বাঁধে।
                মানে <code className={CODE}>FROM departures d, bookings b JOIN customers c ON ...</code> এ Database
                আগে bookings আর customers জোড়ে, departures কে তখনো দেখে না। তাই ON এর ভেতর d এর নাম লিখলেই
                Error।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কমা আর JOIN মেশালে"
              query={`SELECT b.booking_id, c.full_name, d.starts_on
FROM departures d, bookings b
JOIN customers c ON c.customer_id = b.customer_id
                AND d.departure_id = b.departure_id;`}
              caption={`Error: invalid reference to FROM-clause entry for table "d", সাথে DETAIL: There is an entry for table "d", but it cannot be referenced from this part of the query। মানে d নামের Table আছে, কিন্তু এই ON এর জায়গা থেকে তাকে দেখা যায় না। সমাধান: কমা বাদ দিয়ে সব জোড়া JOIN ... ON দিয়ে লিখুন, departures এর শর্ত তার নিজের ON এ।`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা অভ্যাসই যথেষ্ট",
          content: (
            <ContentParagraph>
              নিজে লেখার সময় কখনো কমা দিয়ে Join করবেন না। যেখানে শর্ত আছে, সেখানে JOIN ... ON; যেখানে সত্যিই
              সব জোড়া চান, সেখানে স্পষ্ট করে CROSS JOIN। তাহলে আপনার Code এ কমা মানে সবসময় SELECT এর
              Column এর তালিকা, আর কোনো Join এর শর্ত কখনো WHERE এর ভিড়ে হারায় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "spotting-it",
      subHeader: { index: "012", title: "Spotting It" },
      title: <SectionTitle>দুর্ঘটনার গুণ কীভাবে চিনবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুর্ঘটনার Cartesian Product Error দেয় না, তাই চিনতে হয় লক্ষণ দেখে। নিচের পাঁচটা লক্ষণের যেকোনো
                একটা দেখলে আগে Join এর শর্তগুলো গুনে দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Row এর সংখ্যা কোনো Table এর চেয়ে বেশি:</strong> bookings আর customers জুড়লে Row
                  কখনো ২৪ এর বেশি হওয়ার কথা না, কারণ প্রতিটা Booking এর Customer একজনই। ৩৬০ দেখলেই বুঝবেন।
                </ListItem>
                <ListItem>
                  <strong>যোগফল ঠিক পূর্ণ সংখ্যায় গুণ:</strong> আয় যদি আসল আয়ের ঠিক ৯ গুণ বা ১৫ গুণ হয়, সেটা
                  কাকতালীয় না। সেই সংখ্যাটা প্রায় সবসময় কোনো একটা Table এর Row সংখ্যা।
                </ListItem>
                <ListItem>
                  <strong>DISTINCT ছাড়া Duplicate থামছে না:</strong> একই নাম বারবার আসছে আর কেউ DISTINCT বসিয়ে
                  দিয়েছে, এমন Query দেখলে আগে Join গুলো যাচাই করুন।
                </ListItem>
                <ListItem>
                  <strong>JOIN এর সংখ্যা আর শর্তের সংখ্যা মেলে না:</strong> n টা Table জুড়তে সাধারণত অন্তত
                  n − ১ টা জোড়ার শর্ত লাগে। চারটা Table, দুটো শর্ত মানে কোথাও একটা কম।
                </ListItem>
                <ListItem>
                  <strong>হঠাৎ ধীর Query:</strong> ছোট Table এ ভুলটা চোখে পড়ে না, কিন্তু বড় Table এ Query টা
                  মিনিটের পর মিনিট চলে, কারণ Database সত্যিই কোটি কোটি জোড়া বানাচ্ছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ভালো খবর হলো, আধুনিক ধরনে লিখলে PostgreSQL নিজেই অনেকটা পাহারা দেয়। JOIN লিখে ON ভুলে গেলে সে
                Query টা চালাতেই রাজি হয় না, Syntax Error দেয়। উল্টো দিকে CROSS JOIN এর সাথে ON লিখলেও Error,
                কারণ CROSS JOIN এর কোনো শর্ত থাকে না। দুটো Error ই আসলে উপকার: ভুলটা চালানোর আগেই ধরা পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ON ভুলে গেলে PostgreSQL থামায়"
              query={`SELECT count(*) FROM tours JOIN destinations;`}
              caption="এই বক্সে Error আসে: syntax error at end of input, কারণ Database ON এর অপেক্ষায় ছিল আর Query শেষ হয়ে গেছে। নিজের psql এ একই লাইন সেমিকোলনসহ চালালে লেখা থাকবে syntax error at or near &quot;;&quot;। এবার JOIN এর জায়গায় CROSS JOIN লিখে চালান: ৬৩। আর CROSS JOIN এর শেষে ON true বসিয়ে দেখুন: syntax error at or near &quot;ON&quot;।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নতুন Join লিখে প্রথমেই একটা count(*)",
          content: (
            <ContentParagraph>
              কোনো Report এর জন্য নতুন Join লিখলে, Column বসানোর আগে একবার শুধু{" "}
              <code className={CODE}>SELECT count(*)</code> চালান, আর মনে মনে আগে থেকে ঠিক করে রাখুন কত হওয়ার
              কথা। Booking ভিত্তিক Report এ উত্তর ২৪ এর বেশি হলে থামুন। দশ সেকেন্ডের এই অভ্যাস মাসের শেষে ভুল
              আয়ের Report পাঠানো থেকে বাঁচায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ CROSS JOIN আর তার এক বিপজ্জনক ছাড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL 8.4 এ CROSS JOIN আর কমার Join একইভাবে কাজ করে, Row সংখ্যাও একই: tours আর destinations
                এ ৬৩, bookings আর customers এ ৩৬০, যোগফল 8884500.00। কিন্তু একটা জায়গায় MySQL অনেক বেশি
                উদার, আর সেই উদারতাই বিপদ। MySQL এর Documentation নিজেই বলে, MySQL এ JOIN, CROSS JOIN আর
                INNER JOIN একে অপরের প্রতিশব্দ, যদিও Standard SQL এ তারা আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ON ছাড়া JOIN চলে:</strong> <code className={CODE}>SELECT COUNT(*) FROM tours JOIN destinations</code>{" "}
                  PostgreSQL এ Syntax Error, MySQL এ ৬৩। INNER JOIN লিখলেও একই, কোনো সতর্কবার্তা ছাড়া। মানে
                  MySQL এ ON ভুলে গেলে কেউ আপনাকে থামাবে না।
                </ListItem>
                <ListItem>
                  <strong>CROSS JOIN এর সাথে ON চলে:</strong>{" "}
                  <code className={CODE}>tours t CROSS JOIN destinations d ON t.destination_id = d.destination_id</code>{" "}
                  MySQL এ ৯টা Row দেয়, যেন INNER JOIN। PostgreSQL এ এটা Error।
                </ListItem>
                <ListItem>
                  <strong>কমা আর JOIN মেশানোর ফাঁদ এখানেও আছে:</strong> MySQL এর Documentation বলে কমার
                  অগ্রাধিকার JOIN এর চেয়ে কম। একই মেশানো Query তে MySQL এর Error: ERROR 1054 (42S22): Unknown
                  column &apos;d.departure_id&apos; in &apos;on clause&apos;।
                </ListItem>
                <ListItem>
                  <strong>generate_series নেই:</strong> MySQL এ এই Function নেই, লিখলে ERROR 1064। সংখ্যা বা
                  মাসের ছোট তালিকা বানাতে MySQL 8 এ আছে VALUES ROW:{" "}
                  <code className={CODE}>(VALUES ROW(1), ROW(2), ROW(3)) AS n (people)</code>। বড় তালিকার জন্য
                  Recursive CTE, যেটা শিখবেন Module 07 এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-cross-join.sql",
          code: `-- MySQL 8.4 এ চালিয়ে পাওয়া ফলাফল
SELECT COUNT(*) FROM tours JOIN destinations;         -- 63, কোনো Error নেই
SELECT COUNT(*) FROM tours INNER JOIN destinations;   -- 63
SELECT COUNT(*) FROM tours t CROSS JOIN destinations d
  ON t.destination_id = d.destination_id;             -- 9

-- দামের ছক: generate_series এর বদলে VALUES ROW
SELECT t.title, n.people, t.price_bdt * n.people AS total_bdt
FROM tours t
CROSS JOIN (VALUES ROW(1), ROW(2), ROW(3), ROW(4)) AS n (people)
WHERE t.tour_id IN (1, 7)
ORDER BY t.title, n.people;                           -- 8 rows

-- এক Row এর Table আর দিনের হিসাব
SELECT d.departure_id, DATEDIFF(d.starts_on, p.today) AS days_away
FROM departures d
CROSS JOIN (SELECT DATE '2026-11-01' AS today) AS p
WHERE d.starts_on >= p.today
ORDER BY d.starts_on;                                 -- 9 rows, প্রথমটা 14, 13 দিন

-- মাসের Grid: চার মাসের তালিকা হাতে লেখা
SELECT t.title, DATE_FORMAT(m.month, '%Y-%m') AS month,
       COUNT(d.departure_id) AS departures
FROM tours t
CROSS JOIN (VALUES ROW(DATE '2026-11-01'), ROW(DATE '2026-12-01'),
                   ROW(DATE '2027-01-01'), ROW(DATE '2027-02-01')) AS m (month)
LEFT JOIN departures d
       ON d.tour_id = t.tour_id
      AND d.starts_on >= m.month
      AND d.starts_on <  m.month + INTERVAL 1 MONTH
WHERE t.is_active
GROUP BY t.title, m.month
ORDER BY t.title, m.month;                            -- 32 rows, 8 টায় 1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ নিজের পাহারাদার নিজেই",
          content: (
            <ContentParagraph>
              যেহেতু MySQL ON ছাড়া JOIN চালিয়ে দেয়, তাই MySQL এ কাজ করলে আগের Section এর count(*) অভ্যাসটা
              আরও জরুরি। আর Code Review তে প্রতিটা JOIN এর পাশে একটা ON আছে কিনা, সেটা আলাদা করে দেখে নিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ CROSS JOIN কোথায় কাজ করে</SectionTitle>,
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
                Island Tours এর Admin Panel আর Website এ CROSS JOIN চারটা জায়গায় ইচ্ছা করে ব্যবহার হতে পারে,
                আর একটা জায়গায় দুর্ঘটনা হিসেবে ঢুকে পড়তে পারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ট্যুরের পাতায় দামের ছক:</strong> প্রতিটা ট্যুর × ১ থেকে ৬ জন, সাথে বড় দলের ছাড়।
                  Section 006 এর Query টাই।
                </ListItem>
                <ListItem>
                  <strong>Operations এর মৌসুমি Grid:</strong> প্রতিটা চালু ট্যুর × প্রতিটা মাস, শূন্যসহ।
                  ফারুক সাহেবের ছক, Section 009।
                </ListItem>
                <ListItem>
                  <strong>Guide বণ্টনের ছক:</strong> প্রতিটা Guide × প্রতিটা চালু ট্যুর, কে কোনটা এখন চালান আর
                  কে কোনটায় ফাঁকা। নতুন Departure খোলার আগে Operations এটা দেখে ঠিক করে কাকে পাঠানো যায়।
                </ListItem>
                <ListItem>
                  <strong>Test এর জন্য Data বানানো:</strong> Developer রা কয়েকটা ছোট তালিকা CROSS JOIN করে
                  একসাথে শত শত পরীক্ষামূলক Row বানান। এটা শিখবেন Module 17 এর Seed Data লেসনে।
                </ListItem>
                <ListItem>
                  <strong>যেখানে কখনো থাকা উচিত না:</strong> আয়, সিট বা Payment এর যেকোনো হিসাব। নাবিলার Card
                  এর ঘটনা মনে রাখুন: সেখানে CROSS JOIN মানেই ভুল সংখ্যা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide বণ্টনের ছকের সারাংশ"
              query={`SELECT g.full_name,
       count(*) FILTER (WHERE t.guide_id = g.guide_id) AS leads,
       count(*) AS active_tours
FROM guides g
CROSS JOIN tours t
WHERE t.is_active
GROUP BY g.guide_id, g.full_name
ORDER BY g.guide_id;`}
              caption="পাঁচটা Row, প্রতিটা Guide এর জন্য একটা। প্রত্যেকের সামনে আটটা চালু ট্যুর, কারণ CROSS JOIN প্রত্যেককে প্রত্যেকটার সাথে বসিয়েছে। leads বলছে কে কয়টা চালান: Jamal, Shirin আর Rubel দুটো করে, Ayesha একটা, আর Nazmul Karim একটাও না। Ratargul এর Guide নেই, তাই আটটা ট্যুরের নেতৃত্ব যোগ করলে সাত। FILTER এসেছে Module 05 থেকে।"
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
                  Guide বণ্টনের পুরো ছকটা বানান: প্রতিটা Guide আর প্রতিটা <strong>চালু</strong> ট্যুরের জোড়ার
                  জন্য একটা Row। Column তিনটা, এই ক্রমে: Guide এর <code className={CODE}>full_name</code>, ট্যুরের{" "}
                  <code className={CODE}>title</code>, আর <code className={CODE}>role</code>: সেই Guide ট্যুরটা
                  চালালে <code className={CODE}>&apos;leads&apos;</code>, নইলে{" "}
                  <code className={CODE}>&apos;free&apos;</code>। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM guides g CROSS JOIN tours t WHERE t.is_active</code>, আর role এর জন্য{" "}
                  <code className={CODE}>CASE WHEN t.guide_id = g.guide_id THEN &apos;leads&apos; ELSE &apos;free&apos; END</code>।
                  পাঁচ × আট = ৪০টা Row।
                </>
              }
              solution={`SELECT g.full_name,
       t.title,
       CASE WHEN t.guide_id = g.guide_id THEN 'leads' ELSE 'free' END AS role
FROM guides g
CROSS JOIN tours t
WHERE t.is_active;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Grid Report বানানোর ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "দুটো তালিকা চিনুন",
              description:
                "Report এর সারি কী আর Column কী, আগে ঠিক করুন। ফারুক সাহেবের ছকে সারি চালু ট্যুর, Column মাস। দুটো তালিকাই সম্পূর্ণ হওয়া চাই, ঘটনা থাকুক বা না থাকুক।",
            },
            {
              title: "যে তালিকা Table এ নেই, সেটা বানান",
              description:
                "মাস, দিন, দলের মাপের মতো তালিকা কোনো Table এ থাকে না। generate_series বা VALUES দিয়ে বানান, আর FROM এ একটা নাম দিন, যেমন AS m(month)।",
            },
            {
              title: "CROSS JOIN দিয়ে সব ঘর",
              description:
                "দুটো তালিকা CROSS JOIN করুন। এখনই একবার count(*) চালান: সারির সংখ্যা গুণ Column এর সংখ্যা আসার কথা, ৮ × ৪ = ৩২।",
            },
            {
              title: "LEFT JOIN দিয়ে আসল ঘটনা",
              description:
                "ঘটনার Table কে LEFT JOIN করুন, ON এ দুটো শর্তই: কোন সারির, আর কোন Column এর ভেতরে। মাসের বেলায় তারিখের সীমা অর্ধখোলা রাখুন, শুরু থেকে পরের মাসের শুরুর আগ পর্যন্ত।",
            },
            {
              title: "count(column) দিয়ে গুনুন",
              description:
                "GROUP BY সারি আর Column এ, আর গুনুন ডানের Table এর একটা Column দিয়ে, count(*) দিয়ে না। নইলে খালি ঘরেও ১ আসবে।",
            },
            {
              title: "যোগফল মিলিয়ে নিন",
              description:
                "শেষে সব ঘরের যোগফল আলাদাভাবে গোনা আসল সংখ্যার সাথে মেলান। এই ছকে আটটা Departure, তাই সব ঘর মিলিয়ে যোগফল আট হওয়ার কথা। না মিললে কোথাও Join ভুল।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>CROSS JOIN এর চেনা ভুলগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "কমা দিয়ে Join, WHERE এ শর্ত ভুলে যাওয়া",
              "Row আর যোগফল চুপচাপ পূর্ণ গুণ, যেমন ৩৬০ Row আর পনেরো গুণ আয়",
              "সবসময় JOIN ... ON; কমা দিয়ে কখনো Join না",
            ],
            [
              "তিন চার Table এ একটা শর্ত কম",
              "আংশিক গুণ, যেমন ২১৬ Row আর নয় গুণ আয়",
              "n টা Table মানে সাধারণত n − ১ টা জোড়ার শর্ত, গুনে দেখুন",
            ],
            [
              "Duplicate দেখে DISTINCT বসানো",
              "কপি মুছে যায়, ভুল Row থেকে যায়: ৪ জনের জায়গায় ১৫",
              "আগে Join এর শর্ত সারান, DISTINCT না",
            ],
            [
              "কমা আর JOIN একই FROM এ মেশানো",
              "invalid reference to FROM-clause entry, MySQL এ ERROR 1054",
              "সব জোড়া JOIN দিয়ে লিখুন, প্রতিটার শর্ত তার নিজের ON এ",
            ],
            [
              "শর্ত আছে এমন জোড়া CROSS JOIN আর WHERE দিয়ে লেখা",
              "উত্তর ঠিক, কিন্তু পড়তে কঠিন আর শর্ত হারানোর ঝুঁকি",
              "শর্ত থাকলে INNER JOIN ... ON, CROSS JOIN শুধু সব জোড়ার জন্য",
            ],
            [
              "Grid Report এ count(*)",
              "খালি ঘরেও ১, কারণ LEFT JOIN প্রতিটা ঘরে একটা Row রাখে",
              "count(d.departure_id), ডানের Table এর Column",
            ],
            [
              "একদিক খালি হতে পারে এমন তালিকার সাথে CROSS JOIN",
              "পুরো ফলাফল খালি, কোনো Error ছাড়া",
              "বাঁয়ের Row রাখতেই হলে LEFT JOIN",
            ],
            [
              "বড় Table এর CROSS JOIN এ SELECT *",
              "লাখ লাখ Row, Query ধীর, Browser বা App আটকে যায়",
              "আগে count(*) দিয়ে মাপ দেখুন, তারপর Column",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে আর দেখতে</SectionTitle>,
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
                  : Joined Tables অংশে CROSS JOIN এর সংজ্ঞা, N × M Row এর কথা, CROSS JOIN আর ON TRUE এর সমতা, আর
                  কমার চেয়ে JOIN শক্ত করে বাঁধে, এই সতর্কবার্তা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-srf.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Set Returning Functions
                  </a>
                  : generate_series এর সব রূপ, সংখ্যা আর তারিখ দুটোরই, উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Reference: JOIN Clause
                  </a>
                  : MySQL এ JOIN, CROSS JOIN আর INNER JOIN প্রতিশব্দ, আর কমার নিচু অগ্রাধিকারের ব্যাখ্যা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Join_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Join (SQL)
                  </a>
                  : Cross join, explicit আর implicit join notation, আর কেন বাস্তবের Database পুরো Cartesian Product
                  বানায় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Cartesian_product"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Cartesian product
                  </a>
                  : গণিতের মূল ধারণা, নামের উৎস আর ছোট উদাহরণ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে MySQL কোর্সটা দেখছেন, Joins অংশ (02:24:00 থেকে)
                  </a>
                  : ভিডিওটা MySQL এ। সেখানে ON ছাড়া কোনো JOIN দেখলে এই লেসনের MySQL Section টা মনে রাখবেন:
                  PostgreSQL এ সেটা চলবে না।
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
      title: <SectionTitle>এক নজরে CROSS JOIN</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  CROSS JOIN বাঁয়ের প্রতিটা Row কে ডানের প্রতিটা Row এর সাথে একবার জোড়া দেয়, কোনো শর্ত ছাড়া।
                  ফলাফলে m × n টা Row: নয়টা ট্যুর × সাতটা Destination = ৬৩।
                </ListItem>
                <ListItem>
                  সব জোড়া থেকে Key মেলা জোড়াগুলো রাখলে সেটাই INNER JOIN। CROSS JOIN আর WHERE এর শর্ত, আর JOIN
                  আর ON এর শর্ত, একই উত্তর আর একই Plan দেয়।
                </ListItem>
                <ListItem>
                  ইচ্ছাকৃত ব্যবহার: দামের ছক, এক Row এর Table দিয়ে মান বসানো, আর ক্যালেন্ডার × জিনিস দিয়ে Grid
                  বানিয়ে LEFT JOIN দিয়ে শূন্যসহ Report।
                </ListItem>
                <ListItem>
                  একদিকে এক Row থাকলে Row সংখ্যা বদলায় না; একদিক খালি থাকলে ফলাফল খালি।
                </ListItem>
                <ListItem>
                  দুর্ঘটনার Cartesian Product আসে হারানো শর্ত থেকে, বিশেষ করে কমার Join এ। লক্ষণ: Row বেশি,
                  যোগফল ঠিক পূর্ণ গুণ, আর DISTINCT দিয়ে ঢাকার চেষ্টা।
                </ListItem>
                <ListItem>
                  PostgreSQL ON ছাড়া JOIN চালায় না; MySQL চালায়। তাই যেকোনো Database এ নতুন Join এর পর আগে
                  count(*)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এতক্ষণ সব Join হয়েছে দুটো আলাদা Table এর মধ্যে। পরের লেসনে দেখবেন একটা Table নিজের সাথেই
                জোড়া লাগতে পারে: একই শহরের Customer দের জোড়া, একই Destination এর দুটো ট্যুর, একজন Guide যিনি
                আরেকজনের আগে যোগ দিয়েছেন। এই লেসনের CROSS JOIN সেখানে আবার দেখা দেবে, এবার একটু সাবধানী শর্ত
                নিয়ে।{" "}
                <Link href="/sql/topic/self-join" className={LINK}>
                  পরের লেসন: Self Joins
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
      ["CROSS JOIN", "প্রতিটা Row × প্রতিটা Row, শর্ত ছাড়া", "tours × destinations = ৬৩"],
      ["Row এর সংখ্যা", "m × n, যোগ না গুণ", "আরেকটা guides জুড়লে ৩১৫"],
      ["CROSS JOIN + WHERE", "Key মেলালে INNER JOIN এর সমান", "দুইভাবেই ৯টা Row, একই Plan"],
      ["ON TRUE", "সবসময় সত্য শর্ত মানে CROSS JOIN", "JOIN customers ON true = ৩৬০"],
      ["দামের ছক", "জিনিস × সংখ্যার তালিকা", "চালু ট্যুর × ১ থেকে ৩ জন = ২৪"],
      ["এক Row এর Table", "Row সংখ্যা বদলায় না, মান পাশে বসে", "VALUES দিয়ে today = 2026-11-01"],
      ["খালি একদিক", "ফলাফল পুরো খালি", "tours × generate_series(1, 0) = ০"],
      ["Grid Report", "ক্যালেন্ডার × জিনিস, তারপর LEFT JOIN", "৩২ ঘর, ৮টায় ১, ২৪টায় ০"],
      ["দুর্ঘটনার গুণ", "হারানো শর্ত, পূর্ণ গুণের যোগফল", "৫৯২৩০০ থেকে ৮৮৮৪৫০০"],
      ["DISTINCT দিয়ে ঢাকা", "কপি যায়, ভুল থাকে", "৪ জনের জায়গায় ১৫ জন"],
      ["কমা আর JOIN মেশানো", "JOIN কমার চেয়ে শক্ত করে বাঁধে", "invalid reference to FROM-clause entry"],
      ["MySQL", "ON ছাড়া JOIN চলে, generate_series নেই", "tours JOIN destinations = ৬৩"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "tours এ ৯টা আর destinations এ ৭টা Row। SELECT * FROM tours CROSS JOIN destinations কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "১৬",
            isCorrect: false,
            explanation: "১৬ হলো দুটো Table এর Row যোগ করলে। CROSS JOIN যোগ করে না, গুণ করে।",
          },
          {
            key: "B",
            text: "৯",
            isCorrect: false,
            explanation: "৯ আসে যখন destination_id মিলিয়ে INNER JOIN করা হয়। CROSS JOIN এ কোনো শর্ত নেই।",
          },
          {
            key: "C",
            text: "৬৩",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা ট্যুর সাতটা Destination এর প্রত্যেকটার সাথে জোড়া পায়: ৯ × ৭ = ৬৩।",
          },
          {
            key: "D",
            text: "৭",
            isCorrect: false,
            explanation: "৭ হলো শুধু ডানের Table এর Row সংখ্যা। বাঁয়ের প্রতিটা Row এর জন্য এই সাতটা আবার আসে।",
          },
        ],
      },
      {
        id: 2,
        text: "নিচের কোনটা FROM tours t JOIN destinations d ON d.destination_id = t.destination_id এর সাথে হুবহু একই Row দেয়?",
        options: [
          {
            key: "A",
            text: "FROM tours t CROSS JOIN destinations d",
            isCorrect: false,
            explanation: "শর্ত ছাড়া এটা ৬৩টা Row দেয়, আসল জোড়ার চেয়ে অনেক বেশি।",
          },
          {
            key: "B",
            text: "FROM tours t CROSS JOIN destinations d WHERE t.destination_id = d.destination_id",
            isCorrect: true,
            explanation: "ঠিক। সব জোড়া থেকে Key মেলাগুলো রাখলে INNER JOIN এর উত্তর আসে। PostgreSQL দুটোর জন্য একই Plan বানায়।",
          },
          {
            key: "C",
            text: "FROM tours t CROSS JOIN destinations d ON t.destination_id = d.destination_id",
            isCorrect: false,
            explanation: "PostgreSQL এ CROSS JOIN এর সাথে ON লেখা যায় না, Syntax Error। MySQL এটা মেনে নেয়, কিন্তু সেটা MySQL এর ছাড়।",
          },
          {
            key: "D",
            text: "FROM tours t JOIN destinations d ON true",
            isCorrect: false,
            explanation: "সবসময় সত্য শর্ত মানে কোনো শর্তই না। এটা CROSS JOIN, ৬৩টা Row।",
          },
        ],
      },
      {
        id: 3,
        text: "bookings এ ২৪টা Row, মোট মূল্য 592300.00। customers এ ১৫ জন। SELECT sum(b.total_bdt) FROM bookings b, customers c চালালে কী আসবে?",
        options: [
          {
            key: "A",
            text: "592300.00, কারণ total_bdt শুধু bookings এর Column",
            isCorrect: false,
            explanation: "Column bookings এর ঠিকই, কিন্তু প্রতিটা Booking Row এখন পনেরো বার আছে, প্রতিবার আলাদা Customer এর সাথে।",
          },
          {
            key: "B",
            text: "8884500.00, আসল যোগফলের ঠিক পনেরো গুণ",
            isCorrect: true,
            explanation: "ঠিক। শর্ত নেই, তাই ৩৬০টা জোড়া, আর প্রতিটা টাকা পনেরো বার গোনা হয়েছে। পূর্ণ গুণফল দুর্ঘটনার Cartesian Product এর চিহ্ন।",
          },
          {
            key: "C",
            text: "Error, কারণ কমা দিয়ে Join করা যায় না",
            isCorrect: false,
            explanation: "কমার Join পুরনো ধরন, কিন্তু পুরোপুরি বৈধ। Database কোনো Error দেয় না, আর সেখানেই বিপদ।",
          },
          {
            key: "D",
            text: "NULL, কারণ কোনো Join শর্ত নেই",
            isCorrect: false,
            explanation: "শর্ত না থাকলে Row বাদ যায় না, বরং সব জোড়া থাকে। sum এর ইনপুটে ৩৬০টা মান।",
          },
        ],
      },
      {
        id: 4,
        text: "tours CROSS JOIN generate_series(1, 0) এ কয়টা Row আসবে?",
        options: [
          {
            key: "A",
            text: "৯, কারণ ট্যুরগুলো সব থাকে",
            isCorrect: false,
            explanation: "CROSS JOIN এ বাঁয়ের Row এর কোনো গ্যারান্টি নেই। ডানে জোড়া না থাকলে কোনো Row তৈরিই হয় না।",
          },
          {
            key: "B",
            text: "০",
            isCorrect: true,
            explanation: "ঠিক। generate_series(1, 0) কোনো Row দেয় না, আর যেকোনো সংখ্যা গুণ শূন্য সমান শূন্য।",
          },
          {
            key: "C",
            text: "১০",
            isCorrect: false,
            explanation: "Row যোগ হয় না। আর ডানে একটাও Row নেই।",
          },
          {
            key: "D",
            text: "Error, কারণ খালি Table এর সাথে Join হয় না",
            isCorrect: false,
            explanation: "খালি Table এর সাথে Join সম্পূর্ণ বৈধ, শুধু ফলাফল খালি।",
          },
        ],
      },
      {
        id: 5,
        text: "ফারুক সাহেবের Grid Report এ CROSS JOIN কেন দরকার হলো, শুধু tours আর departures এর JOIN আর GROUP BY তে কেন হলো না?",
        options: [
          {
            key: "A",
            text: "কারণ JOIN আর GROUP BY একসাথে চলে না",
            isCorrect: false,
            explanation: "চলে, তানিমের প্রথম Query টাই তার প্রমাণ। সমস্যা ছিল অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "কারণ যে মাসে Departure নেই, তার জন্য কোনো Row নেই; CROSS JOIN আগে প্রতিটা ট্যুর আর মাসের ঘর বানায়",
            isCorrect: true,
            explanation: "ঠিক। যা নেই তাকে Join খুঁজে আনতে পারে না। ক্যালেন্ডার × ট্যুর দিয়ে ৩২টা ঘর বানানোর পর LEFT JOIN প্রতিটায় সংখ্যা বসায়, শূন্যসহ।",
          },
          {
            key: "C",
            text: "কারণ CROSS JOIN, JOIN এর চেয়ে দ্রুত",
            isCorrect: false,
            explanation: "গতির জন্য না। CROSS JOIN এখানে ফলাফলের আকার ঠিক করে দেয়, প্রতিটা ঘরের জন্য একটা Row।",
          },
          {
            key: "D",
            text: "কারণ departures Table এ month নামের Column নেই",
            isCorrect: false,
            explanation: "Column না থাকলেও date_trunc দিয়ে মাস বের করা যায়, তানিম সেটাই করেছিলেন। শূন্যের ঘরগুলো তবুও আসেনি।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT count(*) FROM tours JOIN destinations; (কোনো ON নেই) চালালে PostgreSQL আর MySQL কী করে?",
        options: [
          {
            key: "A",
            text: "দুটোই ৬৩ দেয়",
            isCorrect: false,
            explanation: "MySQL দেয়, কারণ সেখানে JOIN, INNER JOIN আর CROSS JOIN প্রতিশব্দ। PostgreSQL ON ছাড়া JOIN মানে না।",
          },
          {
            key: "B",
            text: "দুটোই Syntax Error দেয়",
            isCorrect: false,
            explanation: "PostgreSQL দেয়, কিন্তু MySQL 8.4 কোনো সতর্কবার্তা ছাড়াই ৬৩ দেয়।",
          },
          {
            key: "C",
            text: "PostgreSQL এ Syntax Error, MySQL এ ৬৩",
            isCorrect: true,
            explanation: "ঠিক। তাই MySQL এ হারানো ON কেউ ধরিয়ে দেয় না, নিজেকেই count(*) দিয়ে যাচাই করতে হয়।",
          },
          {
            key: "D",
            text: "PostgreSQL এ ৬৩, MySQL এ ৯",
            isCorrect: false,
            explanation: "শর্ত ছাড়া কোনো Database এর পক্ষে কোন জোড়াগুলো আসল সেটা জানার উপায় নেই, তাই ৯ আসতে পারে না।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Query তে একই Customer এর নাম বারবার আসছিল, তাই কেউ SELECT DISTINCT বসিয়ে দিয়েছেন। এখন নাম আর বারবার আসে না। এটা কেন যথেষ্ট না?",
        options: [
          {
            key: "A",
            text: "কারণ DISTINCT খুব ধীর",
            isCorrect: false,
            explanation: "গতি এখানে মূল সমস্যা না। আসল সমস্যা হলো উত্তরটাই ভুল থাকতে পারে।",
          },
          {
            key: "B",
            text: "কারণ ভাঙা Join এর কারণে যাঁদের থাকার কথা না, তাঁরাও তালিকায় থেকে যান",
            isCorrect: true,
            explanation: "ঠিক। pending Booking এর উদাহরণে DISTINCT এর পর ১৫ জন এলেন, অথচ আসল উত্তর ৪ জন। কপি গেছে, ভুল লোক রয়ে গেছেন।",
          },
          {
            key: "C",
            text: "কারণ DISTINCT NULL মুছে দেয়",
            isCorrect: false,
            explanation: "DISTINCT সব NULL কে একটা মান হিসেবে রাখে, মুছে দেয় না। আর এটা এখানের সমস্যা না।",
          },
          {
            key: "D",
            text: "কারণ DISTINCT শুধু একটা Column এ কাজ করে",
            isCorrect: false,
            explanation: "DISTINCT পুরো Row এর উপর কাজ করে, যত Column ই থাকুক।",
          },
        ],
      },
      {
        id: 8,
        text: "FROM departures d, bookings b JOIN customers c ON c.customer_id = b.customer_id AND d.departure_id = b.departure_id কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "কারণ একটা ON এ দুটো শর্ত লেখা যায় না",
            isCorrect: false,
            explanation: "AND দিয়ে যত শর্ত খুশি লেখা যায়। সমস্যাটা শর্তের সংখ্যায় না।",
          },
          {
            key: "B",
            text: "কারণ JOIN কমার চেয়ে শক্ত করে বাঁধে, তাই ON এর সময় d তখনো দেখা যায় না",
            isCorrect: true,
            explanation: "ঠিক। Database আগে bookings আর customers জোড়ে, departures আসে পরে। PostgreSQL বলে d আছে, কিন্তু এই জায়গা থেকে তাকে দেখা যায় না; MySQL বলে Unknown column।",
          },
          {
            key: "C",
            text: "কারণ departures আর bookings এর কোনো সম্পর্ক নেই",
            isCorrect: false,
            explanation: "সম্পর্ক আছে, bookings.departure_id। শুধু লেখার ধরন সেই সম্পর্কটা ON থেকে দেখতে দেয় না।",
          },
          {
            key: "D",
            text: "কারণ তিনটা Table একসাথে Join করা যায় না",
            isCorrect: false,
            explanation: "যায়, আর Lesson 07 এ ছয়টা পর্যন্ত জুড়বেন। শুধু সবগুলো JOIN ... ON দিয়ে লিখতে হবে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর ছক আর একটা ভুল শিকার",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>পুরো দামের ছক:</strong> সব চালু ট্যুরের জন্য ১ থেকে ৬ জনের দাম বের করুন, সাথে একটা Column
        যেখানে পাঁচ বা তার বেশি জনে দশ শতাংশ ছাড়, round(…, 2) দিয়ে। চালানোর আগে Row সংখ্যা অনুমান করে লিখে
        রাখুন, তারপর মিলান।
      </span>,
      <span key="2">
        <strong>গত বছরের Grid:</strong> জানুয়ারি থেকে জুন 2026 পর্যন্ত প্রতিটা ট্যুর (চালু আর বন্ধ সব) আর প্রতিটা
        মাসের জন্য Departure এর সংখ্যা, শূন্যসহ। কয়টা ঘর, কয়টায় শূন্য না, আর কোন মাসে সবচেয়ে বেশি Departure
        ছিল, তিন লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>ভুল শিকার:</strong> তিনটা Query লিখুন যেগুলোতে ইচ্ছা করে একটা করে Join শর্ত বাদ রাখবেন:
        bookings আর payments, bookings আর departures আর tours, আর reviews আর bookings আর customers। প্রতিটার
        জন্য আগে খাতায় Row সংখ্যা হিসাব করুন, তারপর চালান, তারপর সারান। তিনটার আগে আর পরের count(*) রাখুন।
      </span>,
      <span key="4">
        <strong>Guide এর ফাঁকা ট্যুরের তালিকা:</strong> প্রতিটা Guide এর জন্য একটা Row, যেখানে আছে তিনি কয়টা চালু
        ট্যুর চালান, আর যেগুলো চালান না সেগুলোর নাম কমা দিয়ে এক লাইনে। Module 05 এর string_agg আর FILTER এখানে
        কাজে লাগবে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> রেস্তোরাঁর Combo মেনু আর নাবিলার পনেরো গুণ আয়ের ঘটনা দিয়ে একজন
        বন্ধুকে ছয় লাইনে বোঝান CROSS JOIN কখনো দরকারি আর কখনো বিপজ্জনক কেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">দামের ছকের Query, অনুমান করা আর আসল Row সংখ্যা</span>,
      <span key="d2">জানুয়ারি থেকে জুনের Grid এর Query, ফলাফল আর তিন লাইনের পর্যবেক্ষণ</span>,
      <span key="d3">তিনটা ভাঙা আর তিনটা সারানো Query, প্রতিটার count(*) সহ</span>,
      <span key="d4">Guide এর সারাংশের Query আর ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ CROSS JOIN",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "মাপ আর গুণ",
        description:
          "প্রথম ফাইলের চারটা count চালান। প্রতিটা চালানোর আগে খাতায় উত্তরটা লিখে নিন, তারপর মন্তব্যের সংখ্যার সাথে মিলান।",
      },
      {
        title: "WHERE বনাম ON",
        description:
          "দ্বিতীয় ফাইলে একই জোড়া দুইভাবে, তারপর দুটোর EXPLAIN। দুটো Plan এ একই Hash Join আছে কিনা দেখুন।",
      },
      {
        title: "দামের ছক",
        description:
          "তৃতীয় ফাইলে সব চালু ট্যুর × চার রকম দল, তারপর একটা ট্যুরের ছাড়সহ ছক। Row সংখ্যা মিলিয়ে নিন।",
      },
      {
        title: "এক Row আর শূন্য Row",
        description:
          "চতুর্থ ফাইলে এক Row এর Table দিয়ে days_away, তারপর একদিক খালি রেখে CROSS JOIN। দ্বিতীয়টায় psql কী লেখে, লক্ষ করুন।",
      },
      {
        title: "শীতের Grid",
        description:
          "পঞ্চম ফাইলে চালু ট্যুরের ৩২ ঘরের Grid, তারপর বন্ধ ট্যুরসহ। দুটোর মোট ঘর আর ভরা ঘর মন্তব্যের সাথে মিলান। প্রথম লাইনে TimeZone Dhaka বসানো আছে, কারণ মাসের সীমা TimeZone ধরে হিসাব হয়।",
      },
      {
        title: "দুর্ঘটনা আর সারানো",
        description:
          "ষষ্ঠ ফাইলে ভাঙা Join, তার ফোলানো যোগফল, তিন Table এর আংশিক গুণ, আর ঠিক করা সংস্করণ। প্রতিটা সংখ্যা নিজে ভাগ করে দেখুন কত গুণ ফুলেছে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-sizes.sql",
        code: `SELECT count(*) AS tours FROM tours;
-- 9

SELECT count(*) AS destinations FROM destinations;
-- 7

SELECT count(*) AS pairs FROM tours CROSS JOIN destinations;
-- 63

SELECT count(*) AS with_guides
FROM tours CROSS JOIN destinations CROSS JOIN guides;
-- 315`,
      },
      {
        language: "sql",
        filename: "02-on-vs-where.sql",
        code: `SELECT t.title, d.name
FROM tours t
CROSS JOIN destinations d
WHERE t.destination_id = d.destination_id
ORDER BY t.tour_id;
-- (9 rows), Kuakata নেই

SELECT t.title, d.name
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id
ORDER BY t.tour_id;
-- (9 rows), হুবহু একই

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT * FROM tours t CROSS JOIN destinations d
WHERE t.destination_id = d.destination_id;
-- Hash Join (actual rows=9.00 loops=1)`,
      },
      {
        language: "sql",
        filename: "03-price-chart.sql",
        code: `SELECT t.title, n.people, t.price_bdt * n.people AS total_bdt
FROM tours t
CROSS JOIN generate_series(1, 4) AS n(people)
WHERE t.is_active
ORDER BY t.title, n.people;
-- (32 rows): 8 চালু ট্যুর × 4

SELECT n.people,
       t.price_bdt * n.people AS full_price,
       CASE WHEN n.people >= 4
            THEN round(t.price_bdt * n.people * 0.9, 2)
            ELSE t.price_bdt * n.people
       END AS offer_price
FROM tours t
CROSS JOIN generate_series(1, 5) AS n(people)
WHERE t.tour_id = 1
ORDER BY n.people;
-- (5 rows), শেষ দুটো 45000.00 আর 56250.00`,
      },
      {
        language: "sql",
        filename: "04-one-row-and-empty.sql",
        code: `SELECT d.departure_id, d.starts_on, d.starts_on - p.today AS days_away
FROM departures d
CROSS JOIN (VALUES (DATE '2026-11-01')) AS p(today)
WHERE d.starts_on >= p.today
ORDER BY d.starts_on;
-- (9 rows): প্রথমটা departure 14, 13 দিন; শেষটা 16, 105 দিন

SELECT count(*) AS pairs
FROM tours
CROSS JOIN generate_series(1, 0) AS g(n);
-- 0`,
      },
      {
        language: "sql",
        filename: "05-winter-grid.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT t.title,
       to_char(m.month, 'YYYY-MM') AS month,
       count(d.departure_id) AS departures
FROM tours t
CROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',
                           interval '1 month') AS m(month)
LEFT JOIN departures d
       ON d.tour_id = t.tour_id
      AND d.starts_on >= m.month
      AND d.starts_on <  m.month + interval '1 month'
WHERE t.is_active
GROUP BY t.title, m.month
ORDER BY t.title, m.month;
-- (32 rows), 8 টায় 1, বাকি 24 টায় 0

SELECT count(*) AS cells, count(d.departure_id) AS filled
FROM tours t
CROSS JOIN generate_series(DATE '2026-11-01', DATE '2027-02-01',
                           interval '1 month') AS m(month)
LEFT JOIN departures d
       ON d.tour_id = t.tour_id
      AND d.starts_on >= m.month
      AND d.starts_on <  m.month + interval '1 month';
-- cells 36, filled 9: বন্ধ ট্যুরসহ, ফেব্রুয়ারির Departure টা এল`,
      },
      {
        language: "sql",
        filename: "06-accident.sql",
        code: `SELECT count(*) AS row_count, sum(b.total_bdt) AS total
FROM bookings b, customers c;
-- 360 | 8884500.00   (পনেরো গুণ)

SELECT count(*) AS row_count, sum(b.total_bdt) AS total
FROM bookings b, departures d, tours t
WHERE b.departure_id = d.departure_id;
-- 216 | 5330700.00   (tours এর শর্ত নেই, নয় গুণ)

SELECT count(*) AS row_count, sum(b.total_bdt) AS total
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id;
-- 24 | 592300.00    (ঠিক)`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ড্রিলে Query চালানোর আগে Row সংখ্যাটা খাতায় লিখে নিন। CROSS JOIN এর পুরো দক্ষতা আসলে এই একটা
        অভ্যাস: গুণটা মাথায় আগে থেকে করে রাখা, যাতে স্ক্রিনের সংখ্যা অবাক না করে।
      </ContentParagraph>
    ),
  },
};
