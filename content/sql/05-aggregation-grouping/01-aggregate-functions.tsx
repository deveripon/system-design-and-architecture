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
  AggregateMachineLab,
  FilterThenAggregateLab,
  WhichCountLab,
} from "../../../components/course/topics/aggregation/agg-animations";
import {
  CountKindsSplit,
  EmptyInputDiagram,
  ManyToOneDiagram,
  RunningStateDiagram,
} from "../../../components/course/topics/aggregation/agg-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const aggregateFunctionsContent: TopicData = {
  id: "aggregate-functions",
  introduction: {
    badge: "MODULE 05 · LESSON 01",
    title: <SectionTitle>অনেক Row থেকে একটা উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন আপনার প্রতিটা Query একটা তালিকা ফেরত দিয়েছে। কোন কোন ট্যুর দশ হাজারের কম, কোন
          Customer এর ফোন নেই, কোন Booking গুলো October এ। কিন্তু ব্যবসার মালিক বেশিরভাগ সময় তালিকা চান
          না, চান একটা সংখ্যা। এখন পর্যন্ত কয়টা Booking? মোট কত টাকার? গড়ে একেকটা Booking এ কয়টা সিট?
          সবচেয়ে বড় Booking টা কত টাকার?
        </ContentParagraph>
        <ContentParagraph>
          এই প্রশ্নগুলোর উত্তর দেয় Aggregate Function। এরা একটা Column এর অনেকগুলো Row একসাথে পড়ে, আর
          ফেরত দেয় একটাই মান। এই লেসনে আপনি পাঁচটা মূল Aggregate চিনবেন: COUNT, SUM, AVG, MIN আর
          MAX। দেখবেন COUNT তিন রকমে লেখা যায় আর তিনটা আলাদা প্রশ্নের উত্তর দেয়, NULL পেলে Aggregate কী
          করে, কোনো Row না মিললে উত্তর কেন শূন্য না হয়ে NULL হয়, আর Database ভেতরে আসলে কীভাবে হিসাবটা
          করে।
        </ContentParagraph>
        <ContentParagraph>
          লেসনের শেষে একটা দেয়ালের সামনে দাঁড়াবেন: একটা Aggregate এর পাশে সাধারণ একটা Column লিখলেই
          PostgreSQL Error দেয়। সেই দেয়াল পার হওয়ার উপায় GROUP BY, পরের লেসনের বিষয়। তাই এই লেসনের সব
          প্রশ্ন আপাতত পুরো Table বা WHERE দিয়ে ছাঁকা অংশ নিয়ে, একবারে একটা উত্তর।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে চব্বিশটা Row দিন, আমি একটা সংখ্যা দেব। প্রতিটা Row আমি একবার করে দেখি, মাথায় রাখি শুধু একটা ছোট খাতা, আর শেষ Row টা পড়ার পরেই বলি উত্তর।",
      author: "SUM",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ফারুকের পাঁচটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026। Island Tours এর মালিক ফারুক সাহেব শীতের মৌসুম শুরুর আগে একটা
                মিটিং ডেকেছেন। তাঁর হাতে কোনো লম্বা তালিকা নেই, আছে পাঁচটা প্রশ্ন। এখন পর্যন্ত মোট কয়টা
                Booking এসেছে? সব মিলিয়ে কয়টা সিট বুক হয়েছে? সব Booking এর মোট মূল্য কত টাকা? গড়ে একটা
                Booking এ কয়টা সিট? আর সবচেয়ে বড় একক Booking টা কত টাকার?
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এর জ্ঞান দিয়ে আপনি bookings Table এর সব 24 টা Row বের করতে পারেন। তারপর একটা
                ক্যালকুলেটর নিয়ে বসে সিট গুনতে হবে, টাকা যোগ করতে হবে, ভাগ করতে হবে। চব্বিশটা Row এ সেটা
                চলে, কিন্তু চব্বিশ হাজার Row এ চলে না, আর প্রতি সকালে নতুন Booking এলে আবার শুরু থেকে গুনতে
                হয়।
              </ContentParagraph>
              <ContentParagraph>
                SQL এই কাজটা নিজেই করে দেয়। নিচের বক্সে একটা Query, যেটা পাঁচটা প্রশ্নের উত্তর একসাথে দেয়,
                একটাই Row তে। এখনো এর লেখার নিয়ম জানার দরকার নেই, শুধু Run চাপুন আর উত্তরের আকৃতিটা দেখুন:
                চব্বিশটা Row থেকে এসেছে একটা মাত্র Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফারুকের পাঁচটা প্রশ্ন, এক Query তে"
              query={`SELECT count(*)              AS bookings,
       sum(seats)            AS seats,
       sum(total_bdt)        AS total_value,
       round(avg(seats), 2)  AS avg_seats,
       max(total_bdt)        AS biggest
FROM bookings;`}
              caption="উত্তর একটা Row: 24 টা Booking, 53 টা সিট, মোট 592300.00 টাকা, গড়ে 2.21 সিট, আর সবচেয়ে বড় Booking 50000.00 টাকার। এই পাঁচটা সংখ্যার পেছনে আছে পাঁচটা Aggregate Function, আর এই লেসনে একে একে প্রতিটাকে চিনবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের একটা কথা",
          content: (
            <ContentParagraph>
              Module 04 এর Function গুলো কাজ করত প্রতিটা Row এ আলাদা করে: upper(city) পনেরোটা Row এ
              পনেরোটা উত্তর দেয়। Aggregate Function কাজ করে অনেকগুলো Row একসাথে নিয়ে: count(city)
              পনেরোটা Row পড়ে একটাই উত্তর দেয়। একটা Row ধরে কাজ, নাকি অনেক Row মিলিয়ে কাজ, এই পার্থক্যটা
              মাথায় রাখলে এই পুরো মডিউল সহজ হয়ে যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "many-to-one",
      subHeader: { index: "002", title: "Many Rows, One Value" },
      title: <SectionTitle>অনেক ঢোকে, একটা বের হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা মুদি দোকানের কথা ভাবুন। সারাদিনে পঞ্চাশজন খদ্দের এসেছেন, প্রত্যেকের একটা করে রসিদ।
                রাতে দোকানদার রসিদগুলো একটা একটা করে উল্টান আর খাতায় শুধু দুটো জিনিস লেখেন: আজ কয়টা রসিদ,
                আর সব মিলিয়ে কত টাকা। পঞ্চাশটা রসিদ ঢুকল, বের হলো দুটো সংখ্যা। এই কাজটার নামই Aggregate:
                অনেকগুলো জিনিস মিলিয়ে একটা সারাংশ।
              </ContentParagraph>
              <ContentParagraph>
                SQL এ Aggregate Function ঠিক তাই করে। আপনি একটা Column এর নাম দেন, Function সেই Column এর
                প্রতিটা Row এর মান পড়ে, আর পুরো স্তূপটার জন্য একটা মান ফেরত দেয়। ফলাফলে যতগুলো Row ঢুকেছিল,
                তার জায়গায় থাকে একটাই Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ManyToOneDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Function", "প্রশ্নটা", "Island Tours এ উদাহরণ", "উত্তর"],
          rows: [
            ["count(*)", "কয়টা Row?", "কয়টা Booking এসেছে", "24"],
            ["sum(column)", "সব মিলিয়ে কত?", "মোট কয়টা সিট বুক হয়েছে", "53"],
            ["avg(column)", "গড়ে কত?", "গড়ে একটা Booking এ কয়টা সিট", "2.2083…"],
            ["min(column)", "সবচেয়ে ছোট কোনটা?", "সবচেয়ে সস্তা ট্যুরের দাম", "3500.00"],
            ["max(column)", "সবচেয়ে বড় কোনটা?", "সবচেয়ে বড় Booking এর মূল্য", "50000.00"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের বক্সে পার্থক্যটা নিজের চোখে দেখুন। প্রথম Query তে upper(city) একটা সাধারণ Function,
              প্রতিটা Row এর জন্য আলাদা উত্তর দেয়, তাই পনেরোটা Row আসে। দ্বিতীয় Query তে count(city) একটা
              Aggregate, পনেরোটা Row মিলিয়ে দেয় একটা উত্তর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Row ধরে Function, নাকি সব মিলিয়ে Aggregate"
              query={`SELECT upper(city) FROM customers;

SELECT count(city) FROM customers;`}
              caption="প্রথম Query পনেরোটা Row দেয়: DHAKA, DHAKA, CHATTOGRAM আর বাকিগুলো। দ্বিতীয়টা একটাই Row দেয়, যেখানে লেখা 15। একই Table, একই Column, কিন্তু Function এর ধরন বদলাতেই উত্তরের আকৃতি বদলে গেল।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "count-star",
      subHeader: { index: "003", title: "COUNT(*)" },
      title: <SectionTitle>কয়টা Row, শুধু এটুকু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে বেশি ব্যবহৃত Aggregate হলো <code className={CODE}>count(*)</code>। এখানে তারকা চিহ্নটা
                মানে কোনো নির্দিষ্ট Column না, পুরো Row। count(*) কোনো ঘরের ভেতরে কী লেখা আছে তা দেখেই না,
                শুধু গোনে কয়টা Row এসেছে। একটা ঘর ফাঁকা থাকুক বা ভরা, Row টা থাকলেই গোনা হয়।
              </ContentParagraph>
              <ContentParagraph>
                count(*) এর আসল শক্তি আসে WHERE এর সাথে। Module 03 এ আপনি WHERE দিয়ে Row ছাঁকতে শিখেছেন।
                এখন সেই ছাঁকা Row গুলোকে গুনতে পারবেন। প্রশ্নটা হয়ে যায়: এই শর্ত মানে কয়টা Row? Database
                আগে WHERE দিয়ে ছাঁকে, তারপর যা টিকে থাকে শুধু সেটাই গোনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Table, আর ছাঁকা অংশ"
              query={`SELECT count(*) AS all_bookings FROM bookings;

SELECT count(*) AS confirmed FROM bookings
WHERE status = 'confirmed';

SELECT count(*) AS big_ones FROM bookings
WHERE total_bdt >= 30000;`}
              caption="প্রথমটা 24, পুরো Table। দ্বিতীয়টা 17, শুধু confirmed। তৃতীয়টা 6, ত্রিশ হাজার বা তার বেশি টাকার Booking। প্রতিবার Query এর আকৃতি একই, শুধু WHERE বদলেছে, আর উত্তর সবসময় একটাই সংখ্যা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "count(1) আর count(*) এর তর্ক",
          content: (
            <ContentParagraph>
              অনেক পুরনো Code এ count(1) লেখা দেখবেন, আর কেউ কেউ বলবেন এটা count(*) এর চেয়ে দ্রুত। PostgreSQL
              এ দুটো একই উত্তর দেয়, customers এ দুটোই 15, আর গতির কোনো অর্থপূর্ণ পার্থক্য নেই। count(*)
              লিখুন, কারণ এটাই SQL এর স্বাভাবিক রূপ আর পড়লেই বোঝা যায় যে Row গোনা হচ্ছে।
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
                  ফারুক সাহেব জানতে চান ঢাকায় Island Tours এর কয়জন Customer আছেন। customers Table থেকে
                  শুধু সেই সংখ্যাটা বের করুন, যাঁদের <code className={CODE}>city</code> হলো{" "}
                  <code className={CODE}>Dhaka</code>। একটা Column, একটা Row।
                </>
              }
              hint={
                <>
                  আগে WHERE দিয়ে ঢাকার Customer ছাঁকুন, তারপর <code className={CODE}>count(*)</code> দিয়ে গুনুন।
                  লেখাটা Single Quote এ, আর বড় হাতের D।
                </>
              }
              solution={`SELECT count(*)
FROM customers
WHERE city = 'Dhaka';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "count-column",
      subHeader: { index: "004", title: "COUNT(column)" },
      title: <SectionTitle>ভরা ঘর গোনা, ফাঁকা ঘর বাদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তারকার জায়গায় একটা Column এর নাম লিখুন: <code className={CODE}>count(phone)</code>। এখন
                প্রশ্নটা বদলে গেছে। count(*) জিজ্ঞেস করে কয়টা Row, আর count(phone) জিজ্ঞেস করে কয়টা Row এ
                phone এর ঘরটা ভরা। NULL মানে মান জানা নেই, আর অজানা কিছু গোনা যায় না, তাই count(column) NULL
                বাদ দিয়ে গোনে।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এর NULL লেসনে আপনি দেখেছেন পাঁচজন Customer এর ফোন নম্বর নেই। তাই customers Table এ
                count(*) বলবে 15, কিন্তু count(phone) বলবে 10। দুটো সংখ্যার ফারাকটাই ফাঁকা ঘরের সংখ্যা।
                অর্থাৎ count(*) বিয়োগ count(phone) দিয়ে এক লাইনে বের হয়ে যায় কয়জনের ফোন নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CountKindsSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Table, দুই রকম গোনা"
              query={`SELECT count(*)               AS customers,
       count(phone)           AS with_phone,
       count(*) - count(phone) AS no_phone
FROM customers;

SELECT count(*) AS tours, count(guide_id) AS with_guide
FROM tours;

SELECT count(*) AS reviews, count(comment) AS with_comment
FROM reviews;`}
              caption="customers এ 15, 10, আর ফারাক 5। tours এ 9 আর 8, কারণ Ratargul Swamp Boat Day এর এখনো Guide নেই। reviews এ 10 আর 8, কারণ দুজন শুধু তারা দিয়েছেন, মন্তব্য লেখেননি। প্রতিটা ফারাক আসলে একটা গল্প বলে: কোথায় Data অসম্পূর্ণ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ভুল Column গুনলে ভুল উত্তর, কোনো Error ছাড়াই",
          content: (
            <ContentParagraph>
              কেউ জিজ্ঞেস করলেন কয়জন Customer আছেন, আর আপনি লিখলেন count(phone)। Query টা চলবে, একটা
              সুন্দর সংখ্যা দেবে, 10, আর সেটা ভুল। কোনো Error আসবে না, কারণ SQL এর চোখে আপনি একটা বৈধ প্রশ্নই
              করেছেন, শুধু অন্য প্রশ্ন। তাই নিয়মটা সোজা: Row গুনতে চাইলে count(*), কোনো মান থাকা Row গুনতে
              চাইলে count(সেই Column)।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  Operations টিম জানতে চায় কয়টা ট্যুরে এখন একজন Guide ঠিক করা আছে। tours Table থেকে একটা
                  সংখ্যা বের করুন: যতগুলো ট্যুরের <code className={CODE}>guide_id</code> ফাঁকা না।
                </>
              }
              hint={
                <>
                  WHERE ছাড়াই হয়। <code className={CODE}>count(guide_id)</code> নিজেই NULL বাদ দেয়। চাইলে
                  WHERE guide_id IS NOT NULL দিয়ে count(*) লিখলেও একই উত্তর আসবে।
                </>
              }
              solution={`SELECT count(guide_id)
FROM tours;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "count-distinct",
      subHeader: { index: "005", title: "COUNT(DISTINCT)" },
      title: <SectionTitle>একই মান একবারই গোনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 03 এ DISTINCT দিয়ে আপনি একই মান বারবার না দেখিয়ে আলাদা মানগুলো দেখেছেন। সেই DISTINCT
                শব্দটাই count এর ভেতরে বসানো যায়: <code className={CODE}>count(DISTINCT city)</code>। প্রশ্নটা
                তখন হয়: কয়টা আলাদা শহর? Dhaka ছয়বার এলেও সেটা একবারই গোনা হয়। NULL এখানেও গোনা হয় না।
              </ContentParagraph>
              <ContentParagraph>
                এই রূপটা ব্যবসার খুব চেনা একটা প্রশ্নের উত্তর দেয়: কয়টা ঘটনা, আর কয়জন মানুষ। bookings
                Table এ 24 টা Row, কিন্তু কয়জন Customer আসলে বুক করেছেন? count(DISTINCT customer_id) বলবে 14,
                কারণ কয়েকজন একাধিকবার বুক করেছেন। 24 আর 14, দুটো সংখ্যাই সত্যি, শুধু দুটো আলাদা প্রশ্নের উত্তর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhichCountLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঘটনা বনাম মানুষ, আর জোড়া হিসেবে গোনা"
              query={`SELECT count(*)                    AS bookings,
       count(DISTINCT customer_id) AS customers
FROM bookings;

SELECT count(DISTINCT method) AS ways_to_pay
FROM payments;

SELECT count(DISTINCT (city, country)) AS places
FROM customers;`}
              caption="24 টা Booking, করেছেন 14 জন। উনিশটা Payment এ উপায় মাত্র 4 টা। শেষ Query দুটো Column একসাথে জোড়া হিসেবে গোনে: শহর আর দেশের আলাদা জোড়া 9 টা। জোড়াটা বন্ধনীর ভেতরে লিখতে হয়, এর কারণ নিচের সতর্কতায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দুটো Column এর DISTINCT: বন্ধনী লাগবেই",
          content: (
            <ContentParagraph>
              PostgreSQL এ <code className={CODE}>count(DISTINCT city, country)</code> লিখলে Error আসে: function
              count(text, text) does not exist। PostgreSQL এর count একটাই জিনিস নেয়। দুটো Column কে একটা জোড়া
              বানাতে বন্ধনী দিন: <code className={CODE}>count(DISTINCT (city, country))</code>। MySQL এ উল্টো,
              বন্ধনী ছাড়া COUNT(DISTINCT city, country) সরাসরি চলে, আর উত্তর একই, 9।
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
                  Marketing টিম জানতে চায় Island Tours এর Customer রা কয়টা আলাদা দেশ থেকে এসেছেন। customers
                  Table থেকে শুধু সেই সংখ্যাটা বের করুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>count(country)</code> দিলে 15 আসবে, কারণ সেটা প্রতিটা Row গোনে। একই দেশ
                  একবার গুনতে ভেতরে DISTINCT লাগবে।
                </>
              }
              solution={`SELECT count(DISTINCT country)
FROM customers;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "sum",
      subHeader: { index: "006", title: "SUM" },
      title: <SectionTitle>সব মিলিয়ে কত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>sum(column)</code> একটা সংখ্যার Column এর সব মান যোগ করে। bookings এর
                seats যোগ করলে আসে মোট বুক হওয়া সিট, total_bdt যোগ করলে আসে সব Booking এর মোট মূল্য। sum শুধু
                সংখ্যার উপর চলে। একটা লেখার Column, যেমন city, যোগ করতে বললে PostgreSQL Error দেয়, কারণ
                Dhaka আর Sylhet যোগ করার কোনো মানে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                sum এর ভেতরে শুধু একটা Column না, একটা পুরো Expression ও বসানো যায়। প্রতিটা Row এ আগে
                Expression টা হিসাব হয়, তারপর সেই ফলগুলো যোগ হয়। আর WHERE এর সাথে মিললে প্রশ্নটা হয়: এই শর্ত
                মানা Row গুলোর যোগফল কত। ফারুক সাহেবের কাছে আসল প্রশ্ন সাধারণত এটাই, কারণ cancelled
                Booking এর টাকা আয়ের হিসাবে ধরা যায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মোট সিট, মোট টাকা, আর শুধু confirmed"
              query={`SELECT sum(seats)     AS seats,
       sum(total_bdt) AS total_value
FROM bookings;

SELECT sum(seats)     AS seats,
       sum(total_bdt) AS confirmed_value
FROM bookings
WHERE status = 'confirmed';

SELECT sum(max_seats) AS capacity_per_round
FROM tours;`}
              caption="সব Booking মিলিয়ে 53 টা সিট আর 592300.00 টাকা। শুধু confirmed ধরলে 38 টা সিট আর 423600.00 টাকা, এটাই আসল বিক্রি। শেষ Query যোগ করে প্রতিটা ট্যুরের সর্বোচ্চ সিট: সব ট্যুর একবার করে চালালে মোট 170 জন যেতে পারেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "যোগফলের Type বড় হয়",
          content: (
            <ContentParagraph>
              seats Column এর Type smallint, যেটা সর্বোচ্চ 32767 পর্যন্ত রাখতে পারে। কিন্তু অনেক Row এর
              যোগফল সহজেই তার বেশি হতে পারে। তাই PostgreSQL sum(seats) এর উত্তর দেয় bigint এ, অনেক বড় একটা
              Type এ, আর numeric এর যোগফল দেয় numeric এ। আপনাকে কিছু করতে হয় না, Database নিজেই জায়গা বড়
              করে নেয়, যাতে যোগ করতে গিয়ে সংখ্যা উপচে না পড়ে।
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
                  বাস কোম্পানির সাথে কথা বলার আগে ফারুক সাহেব জানতে চান confirmed Booking গুলোতে মোট কয়টা সিট
                  আছে। bookings থেকে একটাই সংখ্যা বের করুন: যেসব Booking এর{" "}
                  <code className={CODE}>status</code> হলো <code className={CODE}>confirmed</code>, তাদের seats এর
                  যোগফল।
                </>
              }
              hint={
                <>
                  আগে WHERE দিয়ে confirmed ছাঁকুন, তারপর <code className={CODE}>sum(seats)</code>। count(*) দিলে
                  Booking এর সংখ্যা আসবে, সিটের না।
                </>
              }
              solution={`SELECT sum(seats)
FROM bookings
WHERE status = 'confirmed';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "avg",
      subHeader: { index: "007", title: "AVG" },
      title: <SectionTitle>গড়ে কত, আর ভাগের ফাঁদটা আবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>avg(column)</code> গড় বের করে: সব মান যোগ, তারপর কয়টা মান তা দিয়ে ভাগ।
                bookings এ seats এর গড় 53 ভাগ 24, অর্থাৎ 2.2083333333333333। এত লম্বা দশমিক Report এ কেউ পড়তে
                চায় না, তাই Module 04 থেকে চেনা round দিয়ে মুড়ে দেওয়া হয়: round(avg(seats), 2) দেয় 2.21।
              </ContentParagraph>
              <ContentParagraph>
                এখানে Module 04 এর একটা পুরনো শত্রু ফিরে আসে। seats একটা integer জাতীয় Column, আর
                count(*) ও একটা পূর্ণসংখ্যা। কেউ যদি গড়টা হাতে বানাতে গিয়ে লেখেন sum(seats) / count(*), তাহলে
                পূর্ণসংখ্যা দিয়ে পূর্ণসংখ্যা ভাগ হয়, দশমিক কেটে যায়, আর উত্তর আসে 2। avg এই ফাঁদে পড়ে না:
                integer Column এর গড়ও সে দেয় numeric এ, পুরো দশমিকসহ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="avg, round, আর হাতে বানানো ভুল গড়"
              query={`SELECT avg(seats)                    AS avg_seats,
       round(avg(seats), 2)          AS rounded,
       sum(seats) / count(*)         AS by_hand_wrong,
       sum(seats)::numeric / count(*) AS by_hand_right
FROM bookings;

SELECT round(avg(rating), 2) AS avg_rating
FROM reviews;`}
              caption="avg দেয় 2.2083333333333333, round করলে 2.21। হাতে বানানো ভাগে আসে 2, কারণ দুটোই পূর্ণসংখ্যা। একটাকে ::numeric বানালেই ঠিক উত্তর ফেরত আসে। নিচের Query তে দশটা Review এর গড় তারা 4.10।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "গড় মানে দুটো Aggregate এর ভাগ",
          content: (
            <ContentParagraph>
              avg আসলে sum ভাগ count, তবে সেই count টা count(column), count(*) না। অর্থাৎ ফাঁকা ঘর যোগেও
              ঢোকে না, ভাগের নিচেও ঢোকে না। এই কথাটা ছোট শোনালেও এর ফল বড়, আর সেটা একটু পরে NULL এর অংশে
              নিজের চোখে দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  Website এর হোম পেজে একটা লাইন বসবে: আমাদের অতিথিদের গড় রেটিং। reviews Table থেকে{" "}
                  <code className={CODE}>rating</code> এর গড় বের করুন, দুই দশমিক ঘর পর্যন্ত গোল করে। একটা
                  Column, একটা Row।
                </>
              }
              hint={
                <>
                  <code className={CODE}>avg(rating)</code> কে <code className={CODE}>round(…, 2)</code> এর
                  ভেতরে বসান।
                </>
              }
              solution={`SELECT round(avg(rating), 2)
FROM reviews;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "min-max",
      subHeader: { index: "008", title: "MIN and MAX" },
      title: <SectionTitle>সবচেয়ে ছোট, সবচেয়ে বড়, সবচেয়ে আগের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>min</code> আর <code className={CODE}>max</code> একটা Column এর সবচেয়ে
                ছোট আর সবচেয়ে বড় মানটা দেয়। sum আর avg শুধু সংখ্যায় চলে, কিন্তু min আর max সাজানো যায় এমন
                যেকোনো কিছুতে চলে। সংখ্যায় মানে সবচেয়ে কম আর বেশি, তারিখে মানে সবচেয়ে আগের আর পরের দিন, আর
                লেখায় মানে বর্ণমালায় সবার আগে আর সবার পরে।
              </ContentParagraph>
              <ContentParagraph>
                তারিখের ক্ষেত্রে min আর max এর প্রশ্নগুলো খুব কাজের। প্রথম Booking কবে এসেছিল? সবচেয়ে দূরের
                Departure কবে? সবচেয়ে নতুন Customer কবে যোগ দিয়েছেন? প্রতিটা একটা min বা max। আর দুটো
                Aggregate কে একটা Expression এও জোড়া যায়: max(price_bdt) বিয়োগ min(price_bdt) দেয় দামের
                পুরো পরিসর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সংখ্যা, তারিখ আর লেখায় min ও max"
              query={`SELECT min(price_bdt) AS cheapest,
       max(price_bdt) AS dearest,
       max(price_bdt) - min(price_bdt) AS price_range
FROM tours;

SELECT min(booked_at) AS first_booking,
       max(booked_at) AS latest_booking
FROM bookings;

SELECT min(full_name) AS first_name,
       max(full_name) AS last_name
FROM customers;`}
              caption="সবচেয়ে সস্তা ট্যুর 3500.00, সবচেয়ে দামি 32000.00, পরিসর 28500.00। প্রথম Booking এসেছিল 2025-12-20 এ, শেষটা 2026-10-14 এ। নামের মধ্যে বর্ণমালায় সবার আগে Aiman Zulkifli, সবার পরে Tanvir Ahmed।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "লেখার min আর max নির্ভর করে সাজানোর নিয়মের উপর",
          content: (
            <ContentParagraph>
              বর্ণমালায় কোনটা আগে, সেটা ঠিক করে Database এর Collation, Module 03 এর ORDER BY লেসনে যেটা
              দেখেছেন। এই পাতার বক্সটা C Collation ব্যবহার করে, আর আপনার নিজের PostgreSQL সম্ভবত en_US.utf8।
              এই Data তে দুটোই একই নাম দেয়, কিন্তু ছোট আর বড় হাতের অক্ষর মেশানো লেখায় দুই জায়গায় আলাদা উত্তর
              আসতে পারে। লেখার min আর max এর উপর কোনো জরুরি সিদ্ধান্ত নেওয়ার আগে এটা মাথায় রাখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  বার্ষিক পরিকল্পনার জন্য জানতে হবে Departure এর তালিকা কবে থেকে কবে পর্যন্ত ছড়ানো। departures
                  Table থেকে একটা Row এ দুটো Column দিন: সবচেয়ে আগের <code className={CODE}>starts_on</code>, তারপর
                  সবচেয়ে পরেরটা।
                </>
              }
              hint={
                <>
                  একই SELECT এ দুটো Aggregate বসানো যায়, কমা দিয়ে আলাদা করে:{" "}
                  <code className={CODE}>min(starts_on), max(starts_on)</code>।
                </>
              }
              solution={`SELECT min(starts_on), max(starts_on)
FROM departures;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "null-skipped",
      subHeader: { index: "009", title: "NULL Is Skipped" },
      title: <SectionTitle>ফাঁকা ঘর হিসাবের বাইরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                count(*) ছাড়া বাকি সব Aggregate একটা নিয়ম মানে: NULL কে হিসাবের বাইরে রাখে। sum ফাঁকা ঘর যোগ
                করে না, avg ফাঁকা ঘর যোগেও নেয় না, ভাগেও না, min আর max ফাঁকা ঘর তুলনাতেই আনে না। নিয়মটা যুক্তির
                দিক থেকে ঠিক: যে মান জানা নেই, সেটা যোগ করার বা তুলনা করার উপায় নেই।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা গুরুত্বপূর্ণ ফল আছে গড়ের উপর। ধরুন তিনজন অতিথির কাছে রেটিং চাওয়া হলো। দুজন দিলেন 4
                আর 5, তৃতীয়জন কিছুই দিলেন না। avg বলবে 4.5, কারণ সে শুধু দুটো জানা মান দেখে। কিন্তু কেউ যদি
                Module 04 এর COALESCE দিয়ে ফাঁকা ঘরে শূন্য বসিয়ে দেন, avg বলবে 3, কারণ এখন তিনটা মান, তার একটা
                শূন্য। দুটো উত্তরের কোনোটাই যন্ত্রের ভুল না। প্রথমটা বলে যাঁরা রেটিং দিয়েছেন তাঁরা কত খুশি,
                দ্বিতীয়টা ধরে নেয় যিনি দেননি তিনি একেবারেই খুশি না। কোনটা চাই, সেটা ব্যবসার সিদ্ধান্ত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা রেটিং, একটা ফাঁকা"
              query={`SELECT avg(r)              AS avg_skips_null,
       avg(coalesce(r, 0)) AS avg_null_as_zero,
       sum(r)              AS total,
       count(r)            AS counted,
       count(*)            AS all_rows
FROM (VALUES (4), (5), (NULL::int)) AS t(r);`}
              caption="এখানে Table এর বদলে VALUES দিয়ে তিনটা বানানো রেটিং, কারণ Island Tours এর সব Review এ রেটিং আছে। avg ফাঁকাটা বাদ দিয়ে দেয় 4.5, শূন্য বসালে 3। sum 9, count(r) 2, কিন্তু count(*) 3। একই তিনটা Row, প্রশ্ন অনুযায়ী আলাদা উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "গড় দেখালে সাথে গোনাটাও দেখান",
          content: (
            <ContentParagraph>
              একটা গড় একা কিছু বলে না, যতক্ষণ না জানা যায় কয়টা মান থেকে সেটা এসেছে। দুটো রেটিং থেকে আসা 4.5
              আর দুশো রেটিং থেকে আসা 4.5 এক জিনিস না। তাই Report এ avg এর পাশে প্রায় সবসময় count(column) ও
              রাখা হয়, যেমন Website এ লেখা থাকে 4.1, দশটা Review থেকে। এতে পাঠক নিজেই বুঝতে পারেন সংখ্যাটা
              কতটা ভরসার।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "inside-the-engine",
      subHeader: { index: "010", title: "Inside the Engine" },
      title: <SectionTitle>Database মাথায় কী রাখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                avg(seats) চালালে Database কি আগে সব 24 টা মান Memory তে তুলে রাখে, তারপর যোগ আর ভাগ করে? না।
                সে রাখে একটা ছোট খাতা, যাকে বলে State। avg এর খাতায় দুটো সংখ্যা: এখন পর্যন্ত কয়টা মান দেখা
                হলো, আর তাদের যোগফল কত। প্রতিটা নতুন Row এ খাতাটা একটু বদলায়। সব Row শেষ হলে একবারই ভাগ
                হয়, আর সেটাই উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা Aggregate এর খাতা আলাদা। count(*) এর খাতায় শুধু একটা গোনা। count(DISTINCT city) এর
                খাতায় দেখা শহরগুলোর একটা তালিকা, কারণ নতুন শহর চিনতে হলে পুরনোগুলো মনে রাখতে হয়। min আর max
                এর খাতায় শুধু এখন পর্যন্ত সবচেয়ে ভালো মানটা। নিচের ছবি আর Lab এ এই খাতাগুলো Row এর পর Row
                বদলাতে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RunningStateDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AggregateMachineLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "count(*) কেন বড় Table এ সময় নেয়",
          content: (
            <ContentParagraph>
              অনেকে ধরে নেন Database এর কাছে প্রতিটা Table এর Row সংখ্যা আগে থেকে লেখা থাকে, তাই count(*)
              সাথে সাথে উত্তর দেবে। PostgreSQL এ এমন কোনো তৈরি গোনা জমা থাকে না। একসাথে অনেকে Data বদলাতে
              থাকলে কোন Row কার চোখে দৃশ্যমান, সেটা আলাদা হতে পারে, তাই প্রতিবার গুনে দেখতে হয়। কোটি Row এর
              Table এ count(*) এর সময় নেওয়াটা স্বাভাবিক। এর ভেতরের কারণ Module 12 এর MVCC লেসনে, আর গতি
              বাড়ানোর উপায় Module 13 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "when-nothing-matches",
      subHeader: { index: "011", title: "When Nothing Matches" },
      title: <SectionTitle>ফাঁকা স্তূপের যোগফল কত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আজ 1 November 2026, আর এই মাসে এখনো কোনো Booking আসেনি। ফারুক সাহেব জানতে চাইলেন, November এ
                এখন পর্যন্ত কয়টা Booking আর কয়টা সিট। WHERE booked_at &gt;= &apos;2026-11-01&apos; লিখলে একটাও Row
                টেকে না। তাহলে উত্তর কী আসে? কোনো Row না, নাকি শূন্য?
              </ContentParagraph>
              <ContentParagraph>
                Aggregate এর উত্তর সবসময় একটা Row, স্তূপ ফাঁকা হলেও। কিন্তু সেই Row এর ঘরগুলোতে কী বসে, সেটা
                Function ভেদে আলাদা। count জানে কয়টা আছে: শূন্যটা, তাই বলে 0। কিন্তু sum, avg, min আর max এর
                কাছে কোনো মানই নেই, তাই তাদের উত্তর NULL। শুনতে অদ্ভুত লাগলেও যুক্তিটা পরিষ্কার: একটা ফাঁকা
                থলেতে সবচেয়ে বড় আমটা কত বড়, সেই প্রশ্নের কোনো উত্তর নেই।
              </ContentParagraph>
              <ContentParagraph>
                Report এ NULL দেখালে পাঠক ঘাবড়ে যান, কেউ ভাবেন Query ভেঙেছে। তাই ব্যবসার হিসাবে খালি যোগফলকে
                শূন্য দেখাতে Module 04 এর COALESCE বসানো হয়: coalesce(sum(seats), 0)। এখানে NULL কে শূন্য বানানো
                ঠিক সিদ্ধান্ত, কারণ কোনো Booking না থাকলে বুক হওয়া সিট সত্যিই শূন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <EmptyInputDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="November 2026, এখনো ফাঁকা"
              query={`SELECT count(*)       AS bookings,
       sum(seats)     AS seats,
       avg(seats)     AS avg_seats,
       max(total_bdt) AS biggest
FROM bookings
WHERE booked_at >= '2026-11-01';

SELECT coalesce(sum(seats), 0) AS seats
FROM bookings
WHERE booked_at >= '2026-11-01';`}
              caption="প্রথম Query একটা Row দেয়: bookings 0, আর বাকি তিনটা ঘর NULL। দ্বিতীয়টা একই ছাঁকনিতে COALESCE জুড়ে দেয়, তাই উত্তর 0। দুটো Query তেই Row এর সংখ্যা একটা, কোনো Row না আসার ঘটনা Aggregate এ ঘটে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FilterThenAggregateLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  সকালের Dashboard এ একটা ঘর আছে: এই মাসে এখন পর্যন্ত বুক হওয়া সিট। ধরে নিন আজ 1 November 2026।
                  bookings থেকে সেই সংখ্যাটা বের করুন, যেসব Booking এর <code className={CODE}>booked_at</code>{" "}
                  2026-11-01 বা তার পরে। কোনো Booking না থাকলে উত্তরে NULL না, 0 দেখাতে হবে।
                </>
              }
              hint={
                <>
                  sum(seats) একা NULL দেবে। সেটাকে <code className={CODE}>coalesce(…, 0)</code> এর ভেতরে বসান।
                </>
              }
              solution={`SELECT coalesce(sum(seats), 0)
FROM bookings
WHERE booked_at >= '2026-11-01';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "one-row-rule",
      subHeader: { index: "012", title: "The One Row Rule" },
      title: <SectionTitle>Aggregate এর পাশে সাধারণ Column কেন চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার এই লেসনের দেয়াল। ফারুক সাহেব বললেন, প্রতিটা status এ কয়টা Booking, সেটা দেখান। প্রথম
                স্বাভাবিক চেষ্টা: SELECT status, count(*) FROM bookings। PostgreSQL সাথে সাথে থামিয়ে দেয়:
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>
                  ERROR: column &quot;bookings.status&quot; must appear in the GROUP BY clause or be used in an
                  aggregate function
                </code>
              </ContentParagraph>
              <ContentParagraph>
                কারণটা বুঝতে উত্তরের আকৃতিটা ভাবুন। count(*) চব্বিশটা Row থেকে একটা Row বানায়। সেই একটা Row এর
                status ঘরে কী লেখা হবে? confirmed, pending না cancelled? চব্বিশটা Row এ তিন রকম status, আর
                ঘর একটা। Database আন্দাজে একটা বসিয়ে দিতে পারত, কিন্তু সেটা হতো মিথ্যা উত্তর। তাই PostgreSQL
                অস্বীকার করে, আর Error এর ভাষাতেই সমাধান বলে দেয়: Column টা হয় GROUP BY তে রাখুন, নয়তো একটা
                Aggregate এর ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                একই রকম আরেকটা দেয়াল আছে WHERE এ। শুধু বড় Booking গুনতে কেউ লিখলেন WHERE sum(seats) &gt; 2।
                উত্তর আসে: aggregate functions are not allowed in WHERE। Module 03 এর Query Order লেসন মনে
                করুন: WHERE চলে প্রতিটা Row এ, Aggregate হিসাব হওয়ার অনেক আগে। যে যোগফল এখনো হয়নি, তাকে দিয়ে
                Row ছাঁকা যায় না। Row এর শর্ত হলে লিখুন seats &gt; 2, যোগফলের শর্ত লাগলে তার জায়গা HAVING,
                এই মডিউলের তিন নম্বর লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দেয়ালটা ছুঁয়ে দেখুন, তারপর আজকের সমাধান"
              query={`SELECT count(*) AS confirmed FROM bookings WHERE status = 'confirmed';

SELECT status, count(*) FROM bookings;`}
              caption="প্রথম Query চলে: একটা status নিজে বেছে নিয়ে WHERE এ বসালে উত্তর 17। দ্বিতীয়টা Error দেয়, কারণ status কে কোনো Aggregate এ মোড়ানো হয়নি। প্রতিটা status এর জন্য আলাদা গোনা এক Query তে করতে লাগবে GROUP BY, ঠিক পরের লেসন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এর পুরনো অভ্যাস যে মিথ্যা বলত",
          content: (
            <ContentParagraph>
              MySQL 8.4 এ ONLY_FULL_GROUP_BY নামের নিয়মটা আগে থেকেই চালু থাকে, তাই একই Query তে সেখানেও Error
              আসে: ERROR 1140, nonaggregated column। কিন্তু অনেক পুরনো Server এ বা কেউ এই নিয়ম বন্ধ করে দিলে
              MySQL Error দেয় না। পরীক্ষায় দেখা গেছে তখন উত্তর আসে confirmed, 24। অর্থাৎ status এর ঘরে বসে কোনো
              এক Row এর মান, আর পাশে পুরো Table এর গোনা, যেন সব 24 টা Booking ই confirmed। এমন উত্তর দেখতে
              ঠিকঠাক, আসলে মিথ্যা। কোনো MySQL Server এ এই নিয়ম বন্ধ দেখলে সাবধান থাকুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>একই Function, কয়েকটা ছোট পার্থক্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাঁচটা Aggregate MySQL এ একই নামে, একই কাজে চলে। নিচের তালিকার প্রতিটা লাইন MySQL 8.4 এ
              Island Tours এর MySQL ফাইল Load করে চালিয়ে দেখা। আপনি যে ভিডিওটা দেখছেন সেটা MySQL এর, তাই
              সেখানে এই পার্থক্যগুলো চোখে পড়লে অবাক হবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["AVG(seats)", "2.2083333333333333", "2.2083, চার দশমিক ঘর"],
            ["AVG(total_bdt)", "24679.166666666667", "24679.166667"],
            ["দুটো Column এর DISTINCT গোনা", "count(DISTINCT (city, country))", "COUNT(DISTINCT city, country)"],
            ["status, count(*) GROUP BY ছাড়া", "ERROR, must appear in the GROUP BY clause", "ERROR 1140, যদি ONLY_FULL_GROUP_BY চালু থাকে"],
            ["WHERE এ Aggregate", "ERROR: aggregate functions are not allowed in WHERE", "ERROR 1111: Invalid use of group function"],
            ["কোনো Row না মিললে", "count 0, বাকিরা NULL", "একই: COUNT 0, বাকিরা NULL"],
            ["count(*) FILTER (WHERE …)", "চলে, Lesson 04 এ শিখবেন", "নেই, ERROR 1064"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দুই জায়গায় নিরাপদ অভ্যাস",
          content: (
            <ContentParagraph>
              গড় Report এ দেখানোর আগে সবসময় round দিয়ে দশমিক ঠিক করে দিন। তাহলে PostgreSQL এর ষোলো ঘর আর
              MySQL এর চার ঘরের পার্থক্য চোখেই পড়বে না, দুই জায়গাতেই আসবে 2.21। আর দুটো Column এর আলাদা জোড়া
              গুনতে হলে বন্ধনীওয়ালা রূপটা PostgreSQL এর, তাই কোন Database এ লিখছেন সেটা দেখে লিখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>মালিকের সকালের Dashboard</SectionTitle>,
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
                Island Tours এর Admin প্যানেলের প্রথম পাতায় কয়েকটা বড় বড় সংখ্যা থাকে: মোট Booking, নিশ্চিত
                বিক্রি, গড় Booking এর মূল্য, আর হাতে আসা টাকা। এগুলো কোনো তালিকা না, প্রতিটা একটা Aggregate।
                পাতাটা খুললেই Backend কয়েকটা Query চালায়, প্রতিটা একটা ছোট Row ফেরত দেয়, আর সেই সংখ্যাগুলোই
                বড় করে লেখা হয়।
              </ContentParagraph>
              <ContentParagraph>
                এই Dashboard এর একটা লুকানো কাজও আছে: হিসাব মেলানো। confirmed Booking গুলোর মোট মূল্য আর paid
                Payment গুলোর মোট টাকা সমান হওয়ার কথা। Sample Data তে দুটোই 423600.00, তাই হিসাব মিলছে। সত্যিকারের
                ব্যবসায় এই দুটো সংখ্যা যেদিন না মেলে, সেদিন কোথাও একটা Payment আটকে আছে বা একটা Booking ভুল
                status এ বসে আছে। দুটো sum পাশাপাশি রাখা মানে প্রতি সকালে একটা ছোট হিসাব পরীক্ষা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Dashboard এর সংখ্যা আর হিসাব মেলানো"
              query={`SELECT count(*)                      AS bookings,
       count(DISTINCT customer_id)   AS customers,
       round(avg(total_bdt), 2)      AS avg_booking,
       round(sum(total_bdt) / sum(seats), 2) AS avg_per_seat
FROM bookings;

SELECT sum(total_bdt) AS confirmed_value
FROM bookings
WHERE status = 'confirmed';

SELECT sum(amount_bdt) AS paid_in
FROM payments
WHERE status = 'paid';`}
              caption="24 টা Booking, 14 জন Customer, গড় Booking 24679.17 টাকার, আর সিটপ্রতি গড়ে 11175.47 টাকা। নিচের দুটো Query হিসাব মেলায়: confirmed এর মূল্য 423600.00, paid Payment ও 423600.00। শেষ Column এ দুটো Aggregate এর ভাগ, প্রতিটা আগে নিজের হিসাব শেষ করে, তারপর ভাগ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  ফারুক সাহেব October 2026 এর একটা এক লাইনের সারাংশ চান। bookings থেকে শুধু সেই Booking গুলো নিন
                  যাদের <code className={CODE}>booked_at</code> 2026-10-01 বা তার পরে, আর 2026-11-01 এর আগে। তারপর
                  এই ক্রমে পাঁচটা Column দিন: Booking এর সংখ্যা, মোট সিট, মোট মূল্য, গড় মূল্য দুই দশমিকে গোল করা,
                  আর সবচেয়ে বড় একক Booking এর মূল্য।
                </>
              }
              hint={
                <>
                  তারিখের দুই সীমা WHERE এ AND দিয়ে, Module 03 এর অর্ধেক খোলা সীমার মতো:{" "}
                  <code className={CODE}>&gt;= &apos;2026-10-01&apos;</code> আর{" "}
                  <code className={CODE}>&lt; &apos;2026-11-01&apos;</code>। তারপর count(*), sum(seats),
                  sum(total_bdt), round(avg(total_bdt), 2), max(total_bdt)।
                </>
              }
              solution={`SELECT count(*),
       sum(seats),
       sum(total_bdt),
       round(avg(total_bdt), 2),
       max(total_bdt)
FROM bookings
WHERE booked_at >= '2026-10-01'
  AND booked_at <  '2026-11-01';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Aggregate Query এর যাত্রা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Query টা ধরে ধাপগুলো দেখুন: SELECT count(*), round(avg(seats), 2) FROM bookings WHERE status =
              &apos;confirmed&apos;। Module 03 এর Logical Order এখানেও একই, শুধু SELECT এর ধাপে একটা নতুন কাজ যোগ
              হয়েছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM: Table খোলা",
              description:
                "Database bookings Table এর সব 24 টা Row পড়ার জন্য প্রস্তুত হয়। এখনো কিছু গোনা হয়নি।",
            },
            {
              title: "WHERE: প্রতিটা Row ছাঁকা",
              description:
                "প্রতিটা Row এ status = 'confirmed' পরীক্ষা হয়। 17 টা Row টেকে, 7 টা বাদ। Aggregate এখনো শুরুই হয়নি, তাই এখানে sum বা count ব্যবহার করা যায় না।",
            },
            {
              title: "Aggregate: খাতা খোলা",
              description:
                "count(*) এর জন্য একটা গোনা, avg(seats) এর জন্য একটা গোনা আর একটা যোগফল, সব শূন্য থেকে শুরু।",
            },
            {
              title: "প্রতিটা টিকে থাকা Row খাতায়",
              description:
                "17 টা Row একে একে আসে। প্রতিটায় count এক বাড়ে, seats এর মান যোগফলে যোগ হয়। seats কোথাও NULL হলে avg এর খাতায় সেই Row যোগ হতো না।",
            },
            {
              title: "শেষ হিসাব",
              description:
                "সব Row শেষ। count এর উত্তর 17। avg এর খাতা থেকে একবার ভাগ: 38 ভাগ 17, তারপর round দুই দশমিকে, 2.24।",
            },
            {
              title: "একটা Row ফেরত",
              description:
                "ফলাফল একটাই Row: 17 আর 2.24। কোনো Row না টিকলেও একটা Row আসত, count এ 0 আর avg এ NULL নিয়ে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উপরের যাত্রাটা নিজে চালান"
              query={`SELECT count(*), round(avg(seats), 2)
FROM bookings
WHERE status = 'confirmed';`}
              caption="উত্তর 17 আর 2.24, ধাপে ধাপে যেমন হিসাব হয়েছে। WHERE বদলে pending লিখুন: 4 আর 2.50। cancelled লিখলে 3 আর 1.67।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী ঘটে", "ঠিক উপায়"],
          rows: [
            [
              "Customer গুনতে count(phone)",
              "ফোন না থাকা পাঁচজন বাদ, উত্তর 10, কোনো Error ছাড়া",
              "Row গুনতে count(*), মান থাকা Row গুনতে count(column)",
            ],
            [
              "মানুষ গুনতে count(*) on bookings",
              "24 আসে, যদিও Customer 14 জন",
              "মানুষ গুনতে count(DISTINCT customer_id)",
            ],
            [
              "গড় হাতে বানানো sum(seats) / count(*)",
              "পূর্ণসংখ্যার ভাগে উত্তর 2",
              "avg(seats), অথবা একটাকে ::numeric",
            ],
            [
              "ফাঁকা স্তূপের sum কে শূন্য ধরে নেওয়া",
              "Report এ NULL দেখায়, পরের হিসাবও NULL হয়ে যায়",
              "coalesce(sum(…), 0)",
            ],
            [
              "সব NULL কে শূন্য বানিয়ে গড়",
              "যাঁরা উত্তর দেননি তাঁরা গড় টেনে নামান",
              "সিদ্ধান্ত নিয়ে বাছুন, আর গড়ের পাশে count(column) দেখান",
            ],
            [
              "SELECT status, count(*) FROM bookings",
              "ERROR: must appear in the GROUP BY clause",
              "একটা status হলে WHERE, সবগুলো হলে GROUP BY (পরের লেসন)",
            ],
            [
              "WHERE sum(seats) > 2",
              "ERROR: aggregate functions are not allowed in WHERE",
              "Row এর শর্ত WHERE seats > 2, যোগফলের শর্ত HAVING",
            ],
            [
              "count(DISTINCT city, country) PostgreSQL এ",
              "ERROR: function count(text, text) does not exist",
              "count(DISTINCT (city, country))",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-aggregate.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Aggregate Functions
                  </a>
                  : সব Aggregate এর তালিকা, কোনটা কোন Type দেয়, আর কোনো Row না মিললে sum কেন NULL দেয় তার
                  ব্যাখ্যা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/tutorial-agg.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Aggregate Functions
                  </a>
                  : অফিসিয়াল Tutorial এর ছোট অধ্যায়, যেখানে WHERE এ Aggregate কেন চলে না সেটাও বলা আছে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Aggregate Function Descriptions
                  </a>
                  : MySQL এর COUNT, SUM, AVG, MIN, MAX আর COUNT(DISTINCT) এর বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Aggregate_function"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Aggregate function
                  </a>
                  : Aggregate এর সাধারণ ধারণা, Database এর বাইরেও।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, 01:29:12 থেকে
                  </a>
                  : MySQL দিয়ে COUNT, MAX, SUM আর GROUP BY এর অংশ। ভিডিওতে COUNT দেখলে এই লেসনের তিন রকম COUNT এর
                  কথা মনে রাখবেন।
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
                  Aggregate Function অনেক Row পড়ে একটা মান দেয়। ফলাফল একটাই Row, যত Row ই ঢুকুক।
                </ListItem>
                <ListItem>
                  <strong>count(*)</strong> Row গোনে, <strong>count(column)</strong> শুধু ভরা ঘর,{" "}
                  <strong>count(DISTINCT column)</strong> আলাদা মান।
                </ListItem>
                <ListItem>
                  <strong>sum</strong> যোগ করে, <strong>avg</strong> গড় দেয় পুরো দশমিকসহ, round দিয়ে মুড়ে নিন।
                  হাতে বানানো sum / count পূর্ণসংখ্যার ভাগে পড়তে পারে।
                </ListItem>
                <ListItem>
                  <strong>min</strong> আর <strong>max</strong> সংখ্যা, তারিখ আর লেখায় চলে। লেখায় উত্তর নির্ভর করে
                  Collation এর উপর।
                </ListItem>
                <ListItem>
                  count(*) ছাড়া সবাই NULL বাদ দেয়। NULL কে শূন্য বানালে গড় বদলায়, সেটা একটা সিদ্ধান্ত।
                </ListItem>
                <ListItem>
                  কোনো Row না মিললে count 0, বাকিরা NULL। Report এ coalesce(sum(…), 0)।
                </ListItem>
                <ListItem>
                  Aggregate এর পাশে সাধারণ Column লিখলে Error, আর WHERE এ Aggregate চলে না। দুটো দেয়ালের ওপারে
                  GROUP BY আর HAVING।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফারুক সাহেবের পরের প্রশ্নটা আর একটা সংখ্যা না: প্রতিটা status এ কয়টা Booking, প্রতিটা দেশ থেকে
                কয়জন Customer, প্রতিটা Payment উপায়ে কত টাকা। প্রতিটা দলের জন্য আলাদা একটা Aggregate। এই
                লেসনের দেয়ালটা পার করে সেই প্রশ্নের উত্তর দেয়{" "}
                <Link href="/sql/topic/group-by" className={LINK}>
                  GROUP BY
                </Link>
                , এই মডিউলের পরের লেসন।
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
      ["Aggregate", "অনেক Row থেকে একটা মান", "count(*) FROM bookings দেয় 24"],
      ["count(*)", "কয়টা Row, ঘরের মান না দেখে", "confirmed Booking 17"],
      ["count(column)", "ভরা ঘর গোনে, NULL বাদ", "count(phone) 10, count(*) 15"],
      ["count(DISTINCT)", "আলাদা মান একবারই", "14 জন Customer, 24 টা Booking"],
      ["sum", "সংখ্যা যোগ, Type বড় হয়", "confirmed এর মূল্য 423600.00"],
      ["avg", "sum ভাগ count(column), numeric এ", "গড় সিট 2.21, গড় রেটিং 4.10"],
      ["ভাগের ফাঁদ", "sum(int) / count(*) পূর্ণসংখ্যা দেয়", "sum(seats) / count(*) = 2"],
      ["min আর max", "সংখ্যা, তারিখ, লেখা", "দামের পরিসর 28500.00"],
      ["NULL বাদ", "count(*) ছাড়া সবাই NULL এড়ায়", "avg 4.5 বনাম শূন্য বসালে 3"],
      ["State", "Database একটা ছোট খাতা রাখে", "avg এর খাতায় count আর sum"],
      ["ফাঁকা ইনপুট", "count 0, বাকিরা NULL", "November এর sum(seats) NULL, coalesce এ 0"],
      ["এক Row এর নিয়ম", "Aggregate এর পাশে সাধারণ Column চলে না", "status, count(*) দেয় Error"],
      ["MySQL", "AVG চার দশমিক, COUNT(DISTINCT a, b) চলে", "ONLY_FULL_GROUP_BY চালু রাখুন"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "customers Table এ 15 জন Customer, তাঁদের পাঁচজনের phone NULL। SELECT count(*), count(phone) FROM customers কী দেয়?",
        options: [
          {
            key: "A",
            text: "15 আর 15",
            isCorrect: false,
            explanation: "count(phone) ফাঁকা ঘর গোনে না। দুটো সমান হতো শুধু যদি কারও phone NULL না থাকত।",
          },
          {
            key: "B",
            text: "15 আর 10",
            isCorrect: true,
            explanation: "ঠিক। count(*) প্রতিটা Row গোনে, count(phone) শুধু যেসব Row এ phone ভরা। ফারাক 5, যতজনের ফোন নেই।",
          },
          {
            key: "C",
            text: "10 আর 10",
            isCorrect: false,
            explanation: "count(*) কোনো ঘরের মান দেখে না, Row থাকলেই গোনে। তাই সেটা 15।",
          },
          {
            key: "D",
            text: "Error, কারণ phone এ NULL আছে",
            isCorrect: false,
            explanation: "NULL থাকা কোনো Error না। Aggregate নীরবে NULL বাদ দিয়ে কাজ চালিয়ে যায়।",
          },
        ],
      },
      {
        id: 2,
        text: "তিনটা রেটিং: 4, 5 আর NULL। avg(rating) কত?",
        options: [
          {
            key: "A",
            text: "3",
            isCorrect: false,
            explanation: "3 আসে শুধু যদি NULL কে শূন্য ধরা হয়, যেমন avg(coalesce(rating, 0))। avg নিজে এটা করে না।",
          },
          {
            key: "B",
            text: "NULL, কারণ একটা মান অজানা",
            isCorrect: false,
            explanation: "যোগ বা গুণের মতো Expression এ একটা NULL পুরো উত্তর NULL করে দেয়, কিন্তু Aggregate NULL কে বাদ দিয়ে বাকিগুলো নিয়ে হিসাব করে।",
          },
          {
            key: "C",
            text: "4.5",
            isCorrect: true,
            explanation: "ঠিক। avg শুধু জানা মানগুলো নেয়: 4 আর 5, যোগ 9, ভাগ 2। NULL যোগেও আসে না, ভাগেও না।",
          },
          {
            key: "D",
            text: "9",
            isCorrect: false,
            explanation: "9 হলো sum। গড় পেতে সেটাকে মান থাকা ঘরের সংখ্যা দিয়ে ভাগ করতে হয়।",
          },
        ],
      },
      {
        id: 3,
        text: "WHERE booked_at >= '2026-11-01' কোনো Booking মেলায় না। SELECT count(*), sum(seats) FROM bookings WHERE … কী দেয়?",
        options: [
          {
            key: "A",
            text: "কোনো Row ই আসে না",
            isCorrect: false,
            explanation: "GROUP BY ছাড়া Aggregate Query সবসময় ঠিক একটা Row দেয়, স্তূপ ফাঁকা হলেও।",
          },
          {
            key: "B",
            text: "একটা Row: 0 আর 0",
            isCorrect: false,
            explanation: "count শূন্য দেয়, কিন্তু sum এর কাছে কোনো মানই নেই, তাই সে NULL দেয়, শূন্য না।",
          },
          {
            key: "C",
            text: "একটা Row: 0 আর NULL",
            isCorrect: true,
            explanation: "ঠিক। count জানে কয়টা: শূন্যটা। sum এর যোগ করার কিছু নেই, তাই উত্তর অজানা, NULL। শূন্য চাইলে coalesce(sum(seats), 0)।",
          },
          {
            key: "D",
            text: "একটা Error",
            isCorrect: false,
            explanation: "কোনো Row না মেলা কোনো Error না। Query চলে, শুধু উত্তরের ঘরে NULL বসে।",
          },
        ],
      },
      {
        id: 4,
        text: "SELECT status, count(*) FROM bookings কেন PostgreSQL এ Error দেয়?",
        options: [
          {
            key: "A",
            text: "status একটা Reserved Word",
            isCorrect: false,
            explanation: "status নামের Column নিয়ে কোনো সমস্যা নেই। SELECT status FROM bookings দিব্যি চলে।",
          },
          {
            key: "B",
            text: "count(*) এর একটা Row এর জন্য status এর কোন মান বসবে, সেটা ঠিক করা যায় না",
            isCorrect: true,
            explanation: "ঠিক। চব্বিশটা Row এ তিন রকম status, কিন্তু উত্তর একটা Row। Database আন্দাজ না করে Error দেয়, আর বলে দেয় GROUP BY বা Aggregate লাগবে।",
          },
          {
            key: "C",
            text: "count(*) এর সাথে আর কোনো Column লেখাই যায় না",
            isCorrect: false,
            explanation: "count(*) এর পাশে আরেকটা Aggregate, যেমন sum(seats), দিব্যি চলে। সমস্যা শুধু Aggregate ছাড়া সাধারণ Column এ।",
          },
          {
            key: "D",
            text: "bookings Table এ status Column নেই",
            isCorrect: false,
            explanation: "status Column আছে, যার মান pending, confirmed বা cancelled।",
          },
        ],
      },
      {
        id: 5,
        text: "bookings এ count(*) দেয় 24 আর count(DISTINCT customer_id) দেয় 14। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "দশটা Booking এর customer_id NULL",
            isCorrect: false,
            explanation: "count(customer_id) ও 24, কারণ কোনো Booking এর customer_id ফাঁকা না। ফারাকটা NULL এর না, পুনরাবৃত্তির।",
          },
          {
            key: "B",
            text: "চোদ্দজন Customer মিলে 24 টা Booking করেছেন, কয়েকজন একাধিকবার",
            isCorrect: true,
            explanation: "ঠিক। DISTINCT একই customer_id একবারই গোনে। 24 হলো ঘটনা, 14 হলো মানুষ।",
          },
          {
            key: "C",
            text: "দশটা Booking বাতিল হয়েছে",
            isCorrect: false,
            explanation: "বাতিল Booking মাত্র 3 টা, আর DISTINCT এর সাথে status এর কোনো সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "Query টা ভুল, দুটো সংখ্যা সমান হওয়ার কথা",
            isCorrect: false,
            explanation: "দুটো আলাদা প্রশ্নের দুটো সঠিক উত্তর। একই মানুষ একাধিকবার বুক করলে এমনই হয়।",
          },
        ],
      },
      {
        id: 6,
        text: "sum(seats) = 53 আর count(*) = 24। sum(seats) / count(*) কেন 2 দেয়, 2.2083 না?",
        options: [
          {
            key: "A",
            text: "PostgreSQL ভাগফল সবসময় গোল করে",
            isCorrect: false,
            explanation: "সাধারণ নিয়ম না। দুটোই পূর্ণসংখ্যা হলে দশমিক কেটে যায়, গোল হয় না। numeric এ পুরো দশমিক আসে।",
          },
          {
            key: "B",
            text: "দুটোই পূর্ণসংখ্যার Type, তাই পূর্ণসংখ্যার ভাগ হয় আর দশমিক কেটে যায়",
            isCorrect: true,
            explanation: "ঠিক। Module 04 এর সেই ফাঁদ। avg(seats) ব্যবহার করুন, অথবা একটাকে ::numeric বানান।",
          },
          {
            key: "C",
            text: "count(*) NULL Row বাদ দেয়",
            isCorrect: false,
            explanation: "count(*) কিছুই বাদ দেয় না, আর এখানে NULL নেই। সমস্যা Type এর।",
          },
          {
            key: "D",
            text: "কারণ avg আর sum / count আলাদা জিনিস",
            isCorrect: false,
            explanation: "গণিতে একই জিনিস। পার্থক্য শুধু ভাগের Type এ: avg নিজে numeric এ ভাগ করে।",
          },
        ],
      },
      {
        id: 7,
        text: "শুধু তিন বা তার বেশি সিটের Booking গুনতে কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "SELECT count(*) FROM bookings WHERE sum(seats) >= 3",
            isCorrect: false,
            explanation: "WHERE এ Aggregate চলে না: aggregate functions are not allowed in WHERE। তাছাড়া প্রশ্নটা প্রতিটা Booking এর সিট নিয়ে, যোগফল নিয়ে না।",
          },
          {
            key: "B",
            text: "SELECT count(*) FROM bookings WHERE seats >= 3",
            isCorrect: true,
            explanation: "ঠিক। শর্তটা প্রতিটা Row এর seats নিয়ে, তাই WHERE এ সাধারণ Column। ছাঁকার পরে count(*)।",
          },
          {
            key: "C",
            text: "SELECT count(seats >= 3) FROM bookings",
            isCorrect: false,
            explanation: "count(expression) গোনে কয়টা মান NULL না। seats >= 3 সবসময় true বা false, কখনো NULL না, তাই উত্তর 24।",
          },
          {
            key: "D",
            text: "SELECT sum(seats) FROM bookings WHERE seats >= 3",
            isCorrect: false,
            explanation: "এটা সেই Booking গুলোর সিট যোগ করে, Booking গোনে না।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা পুরনো MySQL Server এ ONLY_FULL_GROUP_BY বন্ধ। SELECT status, COUNT(*) FROM bookings কী করে?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতো Error দেয়",
            isCorrect: false,
            explanation: "Error দেয় শুধু ONLY_FULL_GROUP_BY চালু থাকলে, যেটা MySQL 8.4 এ শুরু থেকে চালু থাকে।",
          },
          {
            key: "B",
            text: "প্রতিটা status এর জন্য আলাদা গোনা দেয়",
            isCorrect: false,
            explanation: "আলাদা গোনার জন্য GROUP BY লাগবেই, সেটা ছাড়া কোনো Database দল বানায় না।",
          },
          {
            key: "C",
            text: "একটা Row দেয়, যেখানে status কোনো এক Row এর আর গোনা পুরো Table এর, যেমন confirmed, 24",
            isCorrect: true,
            explanation: "ঠিক, পরীক্ষায় ঠিক এটাই এসেছে। দেখতে বৈধ উত্তর, আসলে বিভ্রান্তিকর। এই কারণেই নিয়মটা চালু রাখা দরকার।",
          },
          {
            key: "D",
            text: "Query টা চলতেই থাকে, শেষ হয় না",
            isCorrect: false,
            explanation: "Query সাথে সাথে শেষ হয়, সমস্যা উত্তরের অর্থে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ফারুক সাহেবের এক পাতার সারাংশ",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>এক Row এর Dashboard:</strong> bookings থেকে একটা Query লিখুন যেটা এক Row এ দেয়: মোট Booking,
        Customer কয়জন, মোট সিট, মোট মূল্য, গড় মূল্য (দুই দশমিকে), সবচেয়ে বড় আর সবচেয়ে ছোট Booking। প্রতিটা Column
        এর নাম AS দিয়ে বাংলায় না, পরিষ্কার ইংরেজিতে দিন।
      </span>,
      <span key="2">
        <strong>অসম্পূর্ণ Data এর তালিকা:</strong> customers, tours আর reviews এর জন্য তিনটা আলাদা Query, প্রতিটা
        count(*) আর count(সংশ্লিষ্ট Column) দিয়ে বলবে কয়টা ঘর ফাঁকা। ফলাফল একটা ছোট টেবিলে লিখুন।
      </span>,
      <span key="3">
        <strong>দুই রকম গড়:</strong> reviews এর rating নিয়ে avg(rating) বের করুন। তারপর একটা কাল্পনিক অবস্থা ভাবুন:
        আরও দুজন অতিথি রেটিং দেননি। VALUES দিয়ে বারোটা মান বানিয়ে avg আর avg(coalesce(…, 0)) দুটো বের করুন, আর তিন
        লাইনে লিখুন কোনটা Website এ দেখানো উচিত, কেন।
      </span>,
      <span key="4">
        <strong>হিসাব মেলানো:</strong> confirmed Booking এর মোট মূল্য, paid Payment এর মোট টাকা, refunded আর failed
        Payment এর মোট টাকা আলাদা চারটা Query তে বের করুন। চারটা সংখ্যা কীভাবে একে অপরের সাথে মেলে, সেটা লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু SELECT status, count(*) FROM bookings লিখে Error পেয়েছেন।
        তাঁকে ছয় লাইনে বোঝান Error টা কেন যুক্তিসঙ্গত, আর পরের লেসনের নাম না জানলেও আজকের জ্ঞানে কীভাবে একটা
        status এর উত্তর বের করা যায়।
      </span>,
    ],
    deliverables: [
      <span key="d1">Dashboard Query আর তার এক Row এর ফলাফল</span>,
      <span key="d2">ফাঁকা ঘরের তিনটা Query আর সংখ্যার টেবিল</span>,
      <span key="d3">দুই রকম গড়ের Query, ফলাফল আর তিন লাইনের সিদ্ধান্ত</span>,
      <span key="d4">হিসাব মেলানোর চারটা সংখ্যা আর ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ পাঁচটা Aggregate",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "তিন রকম COUNT",
        description:
          "প্রথম ফাইল চালান। তিনটা সংখ্যা মন্তব্যের সাথে মেলান, আর নিজে বলুন প্রতিটা ফারাক কী বোঝায়।",
      },
      {
        title: "SUM, AVG আর ভাগের ফাঁদ",
        description:
          "দ্বিতীয় ফাইলের শেষ Query 2 দেবে, আগেরটা 2.2083333333333333। কেন, সেটা নিজের খাতায় এক লাইনে লিখুন।",
      },
      {
        title: "MIN আর MAX তিন জায়গায়",
        description:
          "তৃতীয় ফাইলে সংখ্যা, তারিখ আর নামের min ও max। আপনার psql এর Collation আলাদা হলেও এই Data তে নাম একই আসার কথা।",
      },
      {
        title: "NULL বাদ পড়া",
        description:
          "চতুর্থ ফাইলে reviews এর comment আর VALUES এর তিনটা রেটিং। avg এর দুই উত্তর পাশাপাশি দেখুন।",
      },
      {
        title: "ফাঁকা স্তূপ",
        description:
          "পঞ্চম ফাইলের আগে \\pset null '(null)' চালান, যাতে NULL চোখে পড়ে। তারপর November এর গোনা আর coalesce।",
      },
      {
        title: "দুটো দেয়াল",
        description:
          "ষষ্ঠ ফাইলের দুটো Query ই Error দেবে। দুটো Error এর লেখা খাতায় টুকে রাখুন, পরের দুই লেসনে এদের সমাধান আসবে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-three-counts.sql",
        code: `SELECT count(*) FROM customers;
-- 15

SELECT count(phone) FROM customers;
-- 10

SELECT count(DISTINCT city) FROM customers;
-- 9`,
      },
      {
        language: "sql",
        filename: "02-sum-avg.sql",
        code: `SELECT sum(seats), sum(total_bdt) FROM bookings;
-- 53 | 592300.00

SELECT avg(seats), round(avg(seats), 2) FROM bookings;
-- 2.2083333333333333 | 2.21

SELECT sum(seats) / count(*) FROM bookings;
-- 2   (পূর্ণসংখ্যার ভাগ)`,
      },
      {
        language: "sql",
        filename: "03-min-max.sql",
        code: `SELECT min(price_bdt), max(price_bdt) FROM tours;
-- 3500.00 | 32000.00

SELECT min(starts_on), max(starts_on) FROM departures;
-- 2026-01-15 | 2027-02-14

SELECT min(full_name), max(full_name) FROM customers;
-- Aiman Zulkifli | Tanvir Ahmed`,
      },
      {
        language: "sql",
        filename: "04-null-skipped.sql",
        code: `SELECT count(*), count(comment) FROM reviews;
-- 10 | 8

SELECT avg(r), avg(coalesce(r, 0))
FROM (VALUES (4), (5), (NULL::int)) AS t(r);
-- 4.5000000000000000 | 3.0000000000000000`,
      },
      {
        language: "sql",
        filename: "05-empty.sql",
        code: `\\pset null '(null)'

SELECT count(*), sum(seats)
FROM bookings
WHERE booked_at >= '2026-11-01';
-- 0 | (null)

SELECT coalesce(sum(seats), 0)
FROM bookings
WHERE booked_at >= '2026-11-01';
-- 0`,
      },
      {
        language: "sql",
        filename: "06-two-walls.sql",
        code: `SELECT status, count(*) FROM bookings;
-- ERROR:  column "bookings.status" must appear in the GROUP BY clause
--         or be used in an aggregate function

SELECT count(*) FROM bookings WHERE sum(seats) > 2;
-- ERROR:  aggregate functions are not allowed in WHERE`,
      },
    ],
    tip: (
      <>
        প্রতিটা মন্তব্যের সংখ্যা একটা নতুন Load করা island_tours থেকে নেওয়া। না মিললে আগে দেখুন আগের কোনো পরীক্ষায়
        Data বদলে গেছে কিনা। Module 02 এর Load লেসনের মতো ফাইলটা আবার চালালেই সব শুরুর অবস্থায় ফিরে আসে।
      </>
    ),
  },
};
