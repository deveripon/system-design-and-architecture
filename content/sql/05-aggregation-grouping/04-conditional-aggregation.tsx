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
  BreakdownLab,
  OnePassLab,
  WhereFilterLab,
} from "../../../components/course/topics/aggregation/condagg-animations";
import {
  CountTrapSplit,
  OnePassDiagram,
  WhereVsFilterDiagram,
} from "../../../components/course/topics/aggregation/condagg-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const conditionalAggregationContent: TopicData = {
  id: "conditional-aggregation",
  introduction: {
    badge: "MODULE 05 · LESSON 04",
    title: <SectionTitle>এক দফায় অনেকগুলো গোনা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের তিনটা লেসনে আপনি অনেক Row থেকে একটা উত্তর বের করেছেন, সেই উত্তরকে দলে ভাগ করেছেন GROUP
          BY দিয়ে, আর দল ছেঁকেছেন HAVING দিয়ে। প্রতিবার প্রশ্ন ছিল একটা: কয়টা, কত টাকা, কোন দলে বেশি।
          কিন্তু অফিসে কেউ একটা সংখ্যা চান না। Manager চান একটা লাইন: মোট কয়টা Booking, তার মধ্যে কয়টা
          confirmed, কয়টা pending, কয়টা বাতিল, আর confirmed গুলো থেকে কত টাকা এল। সবগুলো পাশাপাশি, একই
          মুহূর্তের হিসাব।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি Aggregate এর ভেতরে শর্ত বসাতে শিখবেন। PostgreSQL এ এর সবচেয়ে পরিষ্কার উপায়
          FILTER, আর যেকোনো Database এ চলে এমন উপায় CASE। দুটো দিয়েই Table একবার পড়ে একসাথে পাঁচ, দশ বা
          বিশটা আলাদা হিসাব বের করা যায়। তারপর একই কৌশলে প্রতিটা Departure এর পাশে status অনুযায়ী আলাদা
          Column, বাতিলের হার শতাংশে, শর্তযুক্ত গড়, আর “সবগুলো কি confirmed” এর মতো হ্যাঁ বা না প্রশ্নের
          উত্তর।
        </ContentParagraph>
        <ContentParagraph>
          সাথে থাকবে দুটো চেনা ফাঁদ, যেগুলো প্রায় প্রত্যেকে একবার করে পড়েন: COUNT এর ভেতরে ELSE 0 লিখে
          সব Row গুনে ফেলা, আর কিছু না মিললে SUM থেকে শূন্যের বদলে NULL পাওয়া। আর যেহেতু MySQL এ FILTER
          নেই, সেখানে ঠিক একই Report কীভাবে লিখবেন, সেটাও আসল MySQL 8.4 চালিয়ে দেখানো।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে সব Row দেখান, আমি শুধু সেগুলোই গুনব যেগুলো আমার শর্তে মেলে। পাশের খাতা গুনুক নিজের শর্তে। আপনি Table টা একবার পড়লেই আমরা সবাই যার যার উত্তর একসাথে দিয়ে দেব।",
      author: "FILTER",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>চারটা প্রশ্ন, চারবার Table পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার সকাল। Island Tours এর Operations দেখেন ফারুক সাহেব।
                শীতের মৌসুম শুরুর আগে তিনি প্রতিদিন সকালে একটা ছোট হিসাব চান: এখন পর্যন্ত মোট কয়টা
                Booking, তার কয়টা confirmed, কয়টা এখনো pending, কয়টা বাতিল। নতুন যোগ দেওয়া একজন Developer
                হিসাবটা বানানোর দায়িত্ব পেলেন। এ পর্যন্ত যা শিখেছেন, তা দিয়েই তিনি লিখলেন চারটা Query।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে ঠিক সেই চারটা Query। Run চাপুন, তারপর লক্ষ্য করুন উত্তর এল কীভাবে: চারটা আলাদা
                ফলাফল, চারটা আলাদা ছোট Table।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা প্রশ্ন, চারটা Query"
              query={`SELECT count(*) FROM bookings;
SELECT count(*) FROM bookings WHERE status = 'confirmed';
SELECT count(*) FROM bookings WHERE status = 'pending';
SELECT count(*) FROM bookings WHERE status = 'cancelled';`}
              caption="উত্তর ঠিক আছে: 24, 17, 4, 3। কিন্তু চারটা আলাদা Table এ। ফারুক সাহেবকে দিতে হলে এই চারটা সংখ্যা হাতে জোড়া দিয়ে একটা লাইন বানাতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উত্তর ভুল না, কিন্তু এই পথে চারটা সমস্যা আছে, আর Data বড় হলে প্রতিটা আরও বড় হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চারবার পড়া।</strong> প্রতিটা Query পুরো bookings Table নতুন করে পড়ে। আজ 24টা
                  Row, তাই টের পাওয়া যায় না। পাঁচ লাখ Row হলে একই Table চারবার পড়তে চারগুণ সময়।
                </ListItem>
                <ListItem>
                  <strong>চারটা টুকরো উত্তর।</strong> ফলাফল চারটা আলাদা জায়গায়। Report, Dashboard বা
                  App এর Screen চায় একটা লাইন, যেখানে সংখ্যাগুলো পাশাপাশি বসে।
                </ListItem>
                <ListItem>
                  <strong>দলে ভাগ করা যায় না।</strong> কাল তিনি চাইবেন প্রতিটা Departure এর জন্য একই
                  হিসাব। ষোলোটা Departure, প্রতিটায় চারটা Query: চৌষট্টিটা Query। স্পষ্টতই এটা পথ না।
                </ListItem>
                <ListItem>
                  <strong>চারটা আলাদা মুহূর্ত।</strong> চারটা Query একের পর এক চলে। মাঝখানে কেউ একটা
                  Booking confirm করলে চারটা সংখ্যা আর একই মুহূর্তের থাকে না, যোগফলও মেলে না। কেন এমন হয়,
                  সেটা Module 12 এর Transaction অংশে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের শেষে একই কাজ হবে একটা Query তে, Table একবার পড়ে, উত্তর একটা লাইনে। আর সেই একই
                লেখায় শুধু GROUP BY যোগ করলে প্রতিটা Departure এর জন্য একটা করে লাইন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের একটা বাক্য",
          content: (
            <ContentParagraph>
              Aggregate এর ভেতরে একটা শর্ত বসালে সেই Aggregate শুধু শর্তে মেলা Row গুলো নিয়ে কাজ করে।
              একই SELECT এ এমন কয়েকটা Aggregate পাশাপাশি রাখলে Table একবার পড়েই কয়েকটা আলাদা প্রশ্নের
              উত্তর এক লাইনে আসে। এই কৌশলের নাম Conditional Aggregation, বাংলায় শর্তযুক্ত গোনা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "one-pass",
      subHeader: { index: "002", title: "One Pass" },
      title: <SectionTitle>এক দফা, অনেকগুলো খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                স্কুলের ক্লাস ক্যাপ্টেন নির্বাচনের ভোট গোনার দৃশ্যটা ভাবুন। একজন শিক্ষক বাক্স থেকে একটা
                একটা করে ব্যালট তোলেন আর জোরে পড়েন। টেবিলে চারটা খাতা: একটায় মোট ব্যালটের হিসাব, বাকি
                তিনটায় তিনজন প্রার্থীর। প্রতিটা ব্যালট একবারই পড়া হয়। মোটের খাতায় প্রতিবার একটা দাগ পড়ে,
                আর প্রার্থীর খাতায় দাগ পড়ে শুধু তখন, যখন ব্যালটটা সেই প্রার্থীর। শেষে চারটা খাতায় চারটা
                উত্তর, অথচ বাক্স খোলা হয়েছে একবারই।
              </ContentParagraph>
              <ContentParagraph>
                Database ঠিক এভাবেই Aggregate হিসাব করে। Lesson 01 এ আপনি দেখেছেন{" "}
                <code className={CODE}>count(*)</code> প্রতিটা Row এর জন্য খাতায় একটা দাগ কাটে, আর{" "}
                <code className={CODE}>sum(seats)</code> প্রতিটা Row এর seats যোগ করে চলে। একই SELECT এ
                কয়েকটা Aggregate লিখলে Database কয়েকটা খাতা খোলে, আর Table একবার পড়ার সময় প্রতিটা Row কে
                সবগুলো খাতার পাশ দিয়ে নিয়ে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এবার প্রতিটা খাতার সামনে একটা ছোট পাহারাদার বসান, যে শুধু নিজের শর্তে মেলা Row কে খাতা
                পর্যন্ত যেতে দেয়। confirmed এর খাতার পাহারাদার জিজ্ঞেস করে, status কি confirmed? হ্যাঁ হলে
                দাগ, না হলে চুপ। এটাই শর্তযুক্ত Aggregate।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OnePassDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো জিনিস এই ছবি থেকে মনে রাখুন। প্রথমত, শর্ত Row বাদ দেয় না, শুধু একটা খাতার জন্য Row
                বাছাই করে। একই Row confirmed এর খাতায় না গিয়েও মোটের খাতায় গোনা হয়। দ্বিতীয়ত, খাতা যত
                বাড়ুক, Table পড়া হয় একবারই। দশটা শর্তযুক্ত গোনা মানে দশটা ছোট পাহারাদার, দশবার Table পড়া
                না।
              </ContentParagraph>
              <ContentParagraph>
                এই পাহারাদার লেখার দুটো উপায় আছে। PostgreSQL এর নিজের পরিষ্কার উপায় FILTER, যেটা পরের
                অংশে। আর পুরনো, সব Database এ চলা উপায় হলো Aggregate এর ভেতরে CASE, যেটা তার পরের অংশে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "filter",
      subHeader: { index: "003", title: "FILTER" },
      title: <SectionTitle>FILTER: খাতার সামনের পাহারাদার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER লেখা হয় Aggregate এর ঠিক পরে, এই আকারে:
              </ContentParagraph>
              <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.8125rem] leading-relaxed">
                {`aggregate(...) FILTER (WHERE শর্ত)`}
              </pre>
              <ContentList>
                <ListItem>
                  FILTER এর পরে বন্ধনী আবশ্যক, আর বন্ধনীর ভেতরে শব্দটা WHERE। পরিচিত WHERE এর মতোই যেকোনো
                  শর্ত লেখা যায়: <code className={CODE}>=</code>, <code className={CODE}>IN</code>,{" "}
                  <code className={CODE}>AND</code>, <code className={CODE}>IS NULL</code>, সব চলে।
                </ListItem>
                <ListItem>
                  FILTER শুধু Aggregate এর সাথে বসে: count, sum, avg, min, max, আর পরের লেসনগুলোর
                  string_agg বা array_agg। সাধারণ Function এর পরে বসালে PostgreSQL Error দেয়, যেটা Common
                  Mistakes অংশে দেখবেন।
                </ListItem>
                <ListItem>
                  PostgreSQL এর Docs এর ভাষায়: FILTER থাকলে শুধু সেই Row গুলো Aggregate এর কাছে যায়, যাদের
                  জন্য শর্তটা true। বাকিগুলো ফেলে দেওয়া হয়, কিন্তু শুধু সেই একটা Aggregate এর জন্য।
                </ListItem>
                <ListItem>
                  FILTER SQL Standard এর অংশ, SQL:2003 এ যোগ হয়েছিল। তবে সব Database এ নেই। MySQL এ নেই,
                  তাই সেখানে CASE দিয়ে লিখতে হয়, যেটা পরের অংশে আর In MySQL অংশে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার ফারুক সাহেবের পুরো হিসাবটা একটা Query তে। সাথে একটা পঞ্চম Column যোগ করা হলো: শুধু
                confirmed Booking গুলোর মোট টাকা। লক্ষ্য করুন, sum এর সাথেও ঠিক একই FILTER বসেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Query, একটা লাইন"
              query={`SELECT count(*) AS total,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS revenue
FROM bookings;`}
              caption="এক লাইনে 24, 17, 4, 3 আর 423600.00। চারটা আলাদা Query র চারটা উত্তর এখন পাশাপাশি, আর bookings পড়া হয়েছে একবার। 17 + 4 + 3 = 24, তাই হিসাবটা নিজেই নিজেকে যাচাই করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ ঠিক এই Query টাই ধীরে চলছে। পরের Row চাপলে একটা Booking পড়া হয়, আর দেখবেন কোন
              কোন খাতা তাকে গুনল আর কোনগুলো চুপ থাকল। শুরুর অবস্থাটাও খেয়াল করুন: কোনো Row পড়ার আগে
              count শূন্য, কিন্তু revenue NULL। এই পার্থক্যটা একটু পরে বড় একটা বিষয় হয়ে ফিরবে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OnePassLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1"
              task={
                <>
                  Finance টিম payments Table এর একটা এক লাইনের হিসাব চায়: মোট কয়টা Payment এর চেষ্টা
                  হয়েছে, তার কয়টা <code className={CODE}>paid</code>, কয়টা{" "}
                  <code className={CODE}>failed</code>, কয়টা <code className={CODE}>refunded</code>।
                  চারটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  প্রথম Column শুধু <code className={CODE}>count(*)</code>। বাকি তিনটায়{" "}
                  <code className={CODE}>count(*) FILTER (WHERE status = &apos;paid&apos;)</code> এর মতো
                  লেখা, শুধু status এর মান বদলে।
                </>
              }
              solution={`SELECT count(*) AS attempts,
       count(*) FILTER (WHERE status = 'paid')     AS paid,
       count(*) FILTER (WHERE status = 'failed')   AS failed,
       count(*) FILTER (WHERE status = 'refunded') AS refunded
FROM payments;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "case-inside",
      subHeader: { index: "004", title: "CASE Inside an Aggregate" },
      title: <SectionTitle>CASE দিয়ে একই পাহারাদার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER আসার অনেক আগে থেকেই মানুষ শর্তযুক্ত গোনা করে আসছেন, Module 03 এর CASE দিয়ে। কৌশলটা
                সহজ: প্রতিটা Row এর জন্য CASE একটা ছোট মান বানায়, আর বাইরের Aggregate সেই মানগুলো নিয়ে
                কাজ করে। তিনটা চেনা রূপ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>sum(CASE WHEN status = &apos;confirmed&apos; THEN 1 ELSE 0 END)</code>
                  : মিললে 1, না মিললে 0, তারপর সব যোগ। যোগফল মানে মেলা Row এর সংখ্যা।
                </ListItem>
                <ListItem>
                  <code className={CODE}>count(CASE WHEN status = &apos;confirmed&apos; THEN 1 END)</code>
                  : মিললে 1, না মিললে ELSE নেই বলে NULL। count NULL বাদ দিয়ে গোনে, তাই শুধু মেলাগুলো
                  গোনা হয়।
                </ListItem>
                <ListItem>
                  <code className={CODE}>sum((status = &apos;confirmed&apos;)::int)</code>: PostgreSQL এ
                  একটা তুলনার ফল boolean, true বা false। Module 04 এর Type Casting লেসনে দেখা Cast দিয়ে
                  boolean কে integer বানালে true হয় 1, false হয় 0, তারপর যোগ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে চারটা উপায় পাশাপাশি। চারটাই একই প্রশ্নের উত্তর দিচ্ছে, তাই চারটা Column এ একই
                সংখ্যা আসা উচিত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারভাবে লেখা, একটাই উত্তর"
              query={`SELECT count(*) FILTER (WHERE status = 'confirmed')            AS with_filter,
       sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS sum_case,
       count(CASE WHEN status = 'confirmed' THEN 1 END)      AS count_case,
       sum((status = 'confirmed')::int)                      AS sum_cast
FROM bookings;`}
              caption="চারটা Column এ 17। Database এর কাছে চারটা লেখা আলাদা, কিন্তু প্রতিটা Row কে একই প্রশ্ন করা হচ্ছে, তাই উত্তরও এক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কোনটা লিখবেন? PostgreSQL এ কাজ করলে FILTER। পড়তে সবচেয়ে পরিষ্কার, শর্তটা আলাদা হয়ে চোখে
                পড়ে, আর যেকোনো Aggregate এর সাথে একইভাবে বসে। CASE এর রূপগুলো জানা থাকা দরকার দুই কারণে:
                MySQL এ এগুলোই একমাত্র উপায়, আর অন্যের লেখা পুরনো Query তে এগুলোই বেশি দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                CASE রূপে শুধু একটা জায়গায় সাবধান থাকতে হয়: ELSE এর ভেতরে কী লিখলেন। sum এর সাথে ELSE 0
                নিরাপদ, count এর সাথে মারাত্মক। কেন, সেটা পরের অংশ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2"
              task={
                <>
                  reviews Table থেকে একটা লাইন: কয়টা Review এ <code className={CODE}>rating</code> 5,
                  কয়টায় 4, আর কয়টায় 3 বা তার কম। তিনটা Column, এই ক্রমে। চেষ্টা করুন CASE দিয়ে লিখতে,
                  যাতে Query টা MySQL এও চলে। FILTER দিয়ে লিখলেও উত্তর একই, তাই সেটাও সঠিক ধরা হবে।
                </>
              }
              hint={
                <>
                  প্রতিটা Column এ{" "}
                  <code className={CODE}>sum(CASE WHEN rating = 5 THEN 1 ELSE 0 END)</code> এর মতো একটা
                  লেখা। শেষটায় শর্ত <code className={CODE}>rating &lt;= 3</code>।
                </>
              }
              solution={`SELECT sum(CASE WHEN rating = 5 THEN 1 ELSE 0 END)  AS five,
       sum(CASE WHEN rating = 4 THEN 1 ELSE 0 END)  AS four,
       sum(CASE WHEN rating <= 3 THEN 1 ELSE 0 END) AS three_or_less
FROM reviews;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "count-trap",
      subHeader: { index: "005", title: "The COUNT Trap" },
      title: <SectionTitle>COUNT আর ELSE 0 এর ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lesson 01 এর একটা নিয়ম আবার মনে করুন: <code className={CODE}>count(column)</code> সেই
                Column এর এমন মান গোনে যেগুলো NULL না। শূন্য NULL না, false ও NULL না। এই সাধারণ নিয়মটাই
                শর্তযুক্ত গোনার সবচেয়ে চেনা ফাঁদ তৈরি করে।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন কেউ sum এর রূপটা দেখে অভ্যাসে count লিখলেন, ELSE 0 রেখেই। এখন না মেলা প্রতিটা Row
                CASE থেকে 0 পায়। 0 একটা আসল মান, তাই count তাকেও গোনে। ফলাফল: সব Row গোনা হয়, শর্তের
                কোনো প্রভাবই থাকে না। আরও বিপজ্জনক ব্যাপার হলো কোনো Error আসে না, শুধু একটা ভুল সংখ্যা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CountTrapSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফাঁদটা নিজের চোখে"
              query={`SELECT count(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS count_else_zero,
       count(CASE WHEN status = 'confirmed' THEN 1 END)        AS count_no_else,
       count(status = 'confirmed')                             AS count_boolean,
       sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)   AS sum_else_zero
FROM bookings;`}
              caption="প্রথম Column 24, মানে সব Booking। দ্বিতীয়টা সঠিক 17। তৃতীয়টাও 24, কারণ তুলনার ফল false হলেও false একটা মান, NULL না। শেষটা sum, যেখানে ELSE 0 যোগ করলে কিছুই বদলায় না, তাই সঠিক 17।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "নিয়মটা এক লাইনে",
          content: (
            <ContentParagraph>
              sum এর ভেতরের CASE এ ELSE 0 লিখুন, count এর ভেতরের CASE এ কোনো ELSE লিখবেন না। আর{" "}
              <code className={CODE}>count(status = &apos;confirmed&apos;)</code> কখনো শর্তযুক্ত গোনা না,
              ওটা শুধু status ফাঁকা না এমন Row এর সংখ্যা। সন্দেহ হলে FILTER লিখুন, সেখানে এই ভুলের জায়গাই
              নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "empty-groups",
      subHeader: { index: "006", title: "Sums and Empty Groups" },
      title: <SectionTitle>কিছু না মিললে: শূন্য না NULL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ শুরুতে যে পার্থক্যটা দেখেছিলেন, এবার সেটা আসল প্রশ্নে। Departure 12 এর মাত্র একটা
                Booking, আর সেটা বাতিল। এই Departure এ কয়টা সিট এখনো ধরা আছে? মানে বাতিল ছাড়া বাকি Booking
                গুলোর মোট সিট। উত্তর তো স্পষ্ট শূন্য। Database কী বলে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Departure 12: একটাই Booking, সেটাও বাতিল"
              query={`SELECT count(*) FILTER (WHERE status <> 'cancelled')    AS live_bookings,
       sum(seats) FILTER (WHERE status <> 'cancelled') AS held,
       COALESCE(sum(seats) FILTER (WHERE status <> 'cancelled'), 0) AS held_or_zero,
       sum(CASE WHEN status <> 'cancelled' THEN seats ELSE 0 END)    AS held_case
FROM bookings
WHERE departure_id = 12;`}
              caption="live_bookings 0, কিন্তু held NULL। FILTER এ কোনো Row না মেলায় sum এর কাছে যোগ করার কিছুই যায়নি, আর কিছু না পেলে sum উত্তর দেয় NULL। COALESCE দিলে 0। CASE এর রূপে 0, কারণ সেখানে বাতিল Row টা নিজেই একটা 0 এনে দিয়েছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা Lesson 01 এর: কোনো Row না পেলে count উত্তর দেয় 0, কিন্তু sum, avg, min আর max উত্তর
                দেয় NULL। FILTER সেই নিয়ম বদলায় না, শুধু প্রতিটা Aggregate এর জন্য আলাদা করে প্রযোজ্য
                করে। তাই একই লাইনে একটা Column এ 0 আর পাশের Column এ NULL আসতেই পারে।
              </ContentParagraph>
              <ContentParagraph>
                CASE এর রূপ কেন 0 দিল? কারণ Departure 12 এর একটা Row তো ছিল, বাতিল হলেও। CASE সেই Row এর
                জন্য ELSE 0 ফেরত দিয়েছে, আর sum এর কাছে যোগ করার মতো একটা 0 গেছে। কিন্তু যেখানে একটাও Row
                নেই, সেখানে CASE ও কিছু করতে পারে না। Departure 16 এর কোনো Booking ই নেই, দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Departure 16: একটাও Booking নেই"
              query={`SELECT count(*)        AS n,
       sum(seats)      AS seats,
       avg(seats)      AS avg_seats,
       max(total_bdt)  AS biggest,
       sum(CASE WHEN status <> 'cancelled' THEN seats ELSE 0 END) AS held_case
FROM bookings
WHERE departure_id = 16;`}
              caption="n হলো 0, আর বাকি সবগুলো NULL, held_case সহ। একটাও Row না থাকলে CASE একবারও চলে না, তাই ELSE 0 ও কোনো 0 আনতে পারে না। শূন্য চাইলে একমাত্র নিশ্চিত উপায় বাইরে থেকে COALESCE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Report এ কখন COALESCE",
          content: (
            <ContentParagraph>
              পাঠকের সামনে যাওয়া প্রতিটা টাকা বা সিটের যোগফলে{" "}
              <code className={CODE}>COALESCE(sum(...) FILTER (...), 0)</code> লেখা একটা ভালো অভ্যাস।
              ফাঁকা ঘর দেখলে মানুষ ভাবেন Data হারিয়ে গেছে, 0 দেখলে বোঝেন আসলেই কিছু নেই। তবে গড়ের বেলায়
              সাবধান: কোনো Row না থাকলে গড় সত্যিই অজানা, সেখানে 0 বসালে মিথ্যা বলা হয়। Module 04 এর NULL
              Function লেসনের সেই সিদ্ধান্তটা এখানেও খাটে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "breakdown",
      subHeader: { index: "007", title: "Breakdown per Group" },
      title: <SectionTitle>প্রতিটা দলের পাশে ভাঙা হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার আসল শক্তিটা। ফারুক সাহেবের দ্বিতীয় প্রশ্ন: প্রতিটা Departure এর জন্য একই হিসাব।
                Lesson 02 এ শেখা GROUP BY আর এই লেসনের FILTER একসাথে বসালেই হয়ে যায়। GROUP BY ঠিক করে কয়টা
                লাইন হবে, একটা দলে একটা। FILTER ঠিক করে প্রতিটা লাইনে কয়টা Column, একটা শর্তে একটা।
              </ContentParagraph>
              <ContentParagraph>
                মনে মনে ছবিটা এরকম: প্রতিটা Departure এর নিজের এক সেট খাতা। Database একবার Table পড়ে, প্রতিটা
                Row কে তার Departure এর খাতার সেটে পাঠায়, আর সেখানে প্রতিটা খাতার পাহারাদার নিজের শর্ত
                দেখে। শেষে প্রতিটা সেট থেকে একটা লাইন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Departure, status অনুযায়ী ভাঙা"
              query={`SELECT departure_id,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(seats) FILTER (WHERE status <> 'cancelled') AS held
FROM bookings
GROUP BY departure_id
ORDER BY departure_id;`}
              caption="15টা লাইন, প্রতিটা Departure এর একটা। Departure 12 এর লাইনে held এর ঘরে NULL, যেটা আগের অংশে দেখেছেন। আর Departure 16 এর কোনো লাইনই নেই, কারণ bookings এ তার কোনো Row নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই আকারটা খুব কাজের: বাঁ দিকে দল, উপরে বিভাগ, ঘরে ঘরে সংখ্যা। Spreadsheet এ একে Pivot Table
                বলে। আপনি এখন হাতে Pivot বানালেন, প্রতিটা বিভাগের জন্য একটা FILTER লিখে। বিভাগগুলো আগে থেকে
                জানা থাকলে এটাই সবচেয়ে সহজ আর দ্রুত উপায়। বিভাগ যখন আগে থেকে জানা নেই, তখনকার কৌশল আসবে
                Module 08 এর Pivoting লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একটা একটা Departure বেছে দেখুন তার Booking গুলো কী আর ফলাফলের লাইনটা কীভাবে
                তৈরি হয়। বিশেষ করে 12 আর 16 চাপুন, আর held এ COALESCE চালু করে পার্থক্যটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BreakdownLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              orderMatters
              task={
                <>
                  payments Table থেকে প্রতিটা Payment method এর একটা লাইন: <code className={CODE}>method</code>
                  , মোট চেষ্টা, কয়টা <code className={CODE}>paid</code>, আর কয়টায় সমস্যা হয়েছে (paid ছাড়া
                  বাকি সব)। চারটা Column, এই ক্রমে, method এর নাম অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  GROUP BY method, আর সমস্যার Column এ শর্ত{" "}
                  <code className={CODE}>status &lt;&gt; &apos;paid&apos;</code>। শেষে{" "}
                  <code className={CODE}>ORDER BY method</code>।
                </>
              }
              solution={`SELECT method,
       count(*) AS attempts,
       count(*) FILTER (WHERE status = 'paid')  AS paid,
       count(*) FILTER (WHERE status <> 'paid') AS problems
FROM payments
GROUP BY method
ORDER BY method;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "filter-vs-where",
      subHeader: { index: "008", title: "FILTER vs WHERE" },
      title: <SectionTitle>WHERE সবার দরজা, FILTER একজনের</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER এর ভেতরে WHERE শব্দটা থাকায় নতুনরা প্রায়ই ভাবেন দুটো একই জিনিস। দুটোই শর্ত, কিন্তু
                বসে আলাদা জায়গায়, তাই কাজও আলাদা। Query র WHERE বসে Table এর দরজায়। Lesson 03 এ দেখেছেন,
                সে সব গোনার আগেই চলে আর যে Row তার শর্তে মেলে না সেটাকে পুরো Query থেকে বের করে দেয়। FILTER
                বসে একটা খাতার সামনে, আর শুধু সেই খাতার জন্য বাছাই করে।
              </ContentParagraph>
              <ContentParagraph>
                ফলাফলে পার্থক্যটা বড়। WHERE বদলালে সবগুলো Column বদলায়, count(*) সহ। FILTER বদলালে শুধু
                সেই একটা Column বদলায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhereVsFilterDiagram /> },
        { type: CONTENT_TYPES.CUSTOM, component: <WhereFilterLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো একসাথে খুব স্বাভাবিক। WHERE দিয়ে ঠিক করুন কোন Row গুলো নিয়ে কথা হচ্ছে: কোন সময়ের, কোন
                Departure এর, কোন দেশের Customer। FILTER দিয়ে ঠিক করুন সেই Row গুলোর ভেতরে প্রতিটা Column কোন
                ভাগটা গুনবে। একটা সহজ পরীক্ষা: শর্তটা কি সবগুলো সংখ্যার উপর খাটা উচিত? তাহলে WHERE। শুধু
                একটা Column এর উপর? তাহলে FILTER।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা কারণে WHERE জানা জরুরি। WHERE এর শর্তে মেলে না এমন Row Database আর পড়েই না বা একদম
                শুরুতে ফেলে দেয়, তাই কাজ কমে। শুধু FILTER দিয়ে একই কাজ করলে প্রতিটা Row কে সব খাতার পাশ দিয়ে
                নিয়ে যেতে হয়। যে শর্ত সবার জন্য, সেটা WHERE এ রাখলে Query দ্রুতও হয়।
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
                  শুধু 1 October 2026 বা তার পরে আসা Booking গুলোর হিসাব, এক লাইনে: মোট, confirmed,
                  pending, cancelled। চারটা Column, এই ক্রমে। সময়ের সীমাটা সবগুলো Column এর জন্য, আর status
                  এর ভাগ প্রতিটা Column এর নিজের।
                </>
              }
              hint={
                <>
                  সময়ের শর্ত সবার জন্য, তাই{" "}
                  <code className={CODE}>WHERE booked_at &gt;= &apos;2026-10-01&apos;</code>। status এর শর্ত
                  প্রতিটা Column এর FILTER এ।
                </>
              }
              solution={`SELECT count(*) AS total,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM bookings
WHERE booked_at >= '2026-10-01';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "percentages",
      subHeader: { index: "009", title: "Percentages" },
      title: <SectionTitle>শতাংশ: ভাগ, আর পুরনো ফাঁদটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের তৃতীয় প্রশ্ন: Booking এর কত শতাংশ বাতিল হয়? শতাংশ মানে একটা ভাগ: শর্তে মেলা
                সংখ্যা ভাগ মোট সংখ্যা, তারপর গুণ 100। একই লাইনে দুটো সংখ্যাই আছে, একটা FILTER এ আর একটা
                count(*) এ, তাই ভাগটাও একই লাইনে করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Module 04 এর একটা ফাঁদ এখানে ওত পেতে আছে। count এর উত্তর bigint, মানে পূর্ণসংখ্যা।
                দুটো পূর্ণসংখ্যার ভাগে PostgreSQL ভগ্নাংশ ফেলে দেয়। নিচে তিনটা লেখা, একটা ভুল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাতিলের হার, তিনভাবে"
              query={`SELECT count(*) FILTER (WHERE status = 'cancelled') * 100 / count(*)       AS integer_pct,
       100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*)       AS exact_pct,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM bookings;`}
              caption="প্রথমটা 12, কারণ 300 কে 24 দিয়ে পূর্ণসংখ্যার ভাগে 12.5 এর .5 হারিয়ে গেছে। দ্বিতীয়টায় 100.0 থাকায় ভাগটা numeric এ হয়েছে: 12.5000000000000000। তৃতীয়টা round দিয়ে এক দশমিকে: 12.5। শুরুতেই 100.0 লিখে গুণ করা সবচেয়ে সহজ অভ্যাস।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দলের ভেতরেও একই কৌশল। প্রতিটা Departure এর কত শতাংশ Booking confirmed? GROUP BY যোগ করলেই
              প্রতিটা লাইনে নিজের দলের ভাগ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Departure এ confirmed এর ভাগ"
              query={`SELECT departure_id,
       count(*) AS bookings,
       round(100.0 * count(*) FILTER (WHERE status = 'confirmed') / count(*), 1) AS confirmed_pct
FROM bookings
GROUP BY departure_id
ORDER BY departure_id;`}
              caption="বেশিরভাগ Departure এ 100.0, কয়েকটায় 50.0, আর 12 ও 14 তে 0.0। 14 এর দুটো Booking ই এখনো pending, তাই সেখানে আজ পর্যন্ত একটাও confirmed নেই, যদিও কিছুই বাতিল হয়নি। শতাংশ একা পুরো গল্প বলে না, পাশে মোট সংখ্যাটাও রাখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা জায়গায় বাড়তি পাহারা লাগে। count(*) কখনো শূন্য হয় না, কারণ দলে অন্তত একটা Row থাকে বলেই
                দলটা আছে। কিন্তু ভাগের নিচে যদি নিজেই একটা FILTER করা সংখ্যা থাকে, সেটা শূন্য হতেই পারে। যেমন
                প্রশ্ন: বাতিল ছাড়া বাকি Booking গুলোর মধ্যে কত শতাংশ pending? Departure 12 এ বাতিল ছাড়া একটাও
                Booking নেই, তাই ভাগের নিচে 0। Module 04 এর NULLIF এখানে কাজে আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভাগের নিচে FILTER, আর NULLIF এর পাহারা"
              query={`SELECT departure_id,
       count(*) FILTER (WHERE status = 'pending')     AS pending,
       count(*) FILTER (WHERE status <> 'cancelled')  AS live,
       round(100.0 * count(*) FILTER (WHERE status = 'pending')
             / NULLIF(count(*) FILTER (WHERE status <> 'cancelled'), 0), 1) AS pending_pct
FROM bookings
WHERE departure_id IN (8, 12, 14)
GROUP BY departure_id
ORDER BY departure_id;`}
              caption="8 এ 50.0, 14 এ 100.0, আর 12 এ NULL। NULLIF শূন্যকে NULL বানিয়েছে, আর NULL দিয়ে ভাগের উত্তরও NULL, তাই Query থামেনি। NULLIF তুলে দিয়ে চালালে পুরো Query division by zero Error দিয়ে থেমে যেত।"
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
                  প্রতিটা Payment method এ কত শতাংশ চেষ্টা <code className={CODE}>paid</code> হয়েছে?
                  দুটো Column: <code className={CODE}>method</code> আর শতাংশ, round করে এক দশমিকে। method
                  এর নাম অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>round(100.0 * count(*) FILTER (...) / count(*), 1)</code>, আর
                  GROUP BY method। 100 না, 100.0।
                </>
              }
              solution={`SELECT method,
       round(100.0 * count(*) FILTER (WHERE status = 'paid') / count(*), 1) AS success_pct
FROM payments
GROUP BY method
ORDER BY method;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "conditional-averages",
      subHeader: { index: "010", title: "Averages with a Condition" },
      title: <SectionTitle>শর্তযুক্ত গড়, আর আরেকটা ELSE এর ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER শুধু গোনার জন্য না। avg এর সাথে বসালে প্রশ্ন হয়: শুধু এই ধরনের Row গুলোর গড় কত?
                যেমন confirmed Booking গুলোতে গড়ে কয়টা সিট, আর pending গুলোতে কয়টা। একই লাইনে পাশাপাশি
                রাখলে তুলনাটা চোখে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন ধরনের Booking এ গড়ে কয়টা সিট"
              query={`SELECT round(avg(seats), 2) AS all_bookings,
       round(avg(seats) FILTER (WHERE status = 'confirmed'), 2) AS confirmed,
       round(avg(seats) FILTER (WHERE status = 'pending'), 2)   AS pending,
       round(100 * avg((status = 'cancelled')::int), 1)         AS cancel_pct
FROM bookings;`}
              caption="সব মিলিয়ে গড়ে 2.21টা সিট, confirmed এ 2.24, pending এ 2.50। শেষ Column টা একটা চালাক কৌশল: বাতিল হলে 1, নইলে 0, এই সংখ্যাগুলোর গড় মানে বাতিলের ভাগ। 0.125 কে 100 দিয়ে গুণ করলে 12.5, আগের শতাংশের সাথে হুবহু মিলে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CASE দিয়ে শর্তযুক্ত গড় লিখতে গেলে সেই চেনা ফাঁদ আবার ফিরে আসে, এবার উল্টো চেহারায়। sum এর
                বেলায় ELSE 0 নিরাপদ ছিল। avg এর বেলায় ELSE 0 বিপদ, কারণ না মেলা প্রতিটা Row একটা শূন্য হয়ে
                গড়ে ঢোকে আর গড়কে নিচে টেনে নামায়। avg এর ভেতরের CASE এ ELSE থাকবে না, যাতে না মেলা Row
                NULL হয় আর avg তাকে বাদ দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="avg এর ভেতরে ELSE 0"
              query={`SELECT round(avg(CASE WHEN status = 'confirmed' THEN seats ELSE 0 END), 2) AS wrong_avg,
       round(avg(CASE WHEN status = 'confirmed' THEN seats END), 2)        AS right_avg,
       round(avg(seats) FILTER (WHERE status = 'confirmed'), 2)            AS filter_avg
FROM bookings;`}
              caption="ভুল উত্তর 1.58: confirmed এর মোট 38টা সিটকে ভাগ করা হয়েছে সব 24টা Booking দিয়ে, কারণ বাকি সাতটা Row শূন্য হয়ে গড়ে ঢুকেছে। ELSE ছাড়া লেখা আর FILTER, দুটোই সঠিক 2.24: 38 ভাগ 17।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Review এ একটা মজার প্রশ্নও এভাবে করা যায়: যাঁরা মন্তব্য লিখেছেন আর যাঁরা শুধু তারা দিয়েছেন,
              তাঁদের Rating এর গড়ে কি পার্থক্য আছে?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মন্তব্য সহ আর মন্তব্য ছাড়া Review"
              query={`SELECT round(avg(rating), 2) AS all_reviews,
       round(avg(rating) FILTER (WHERE comment IS NOT NULL), 2) AS with_comment,
       round(avg(rating) FILTER (WHERE comment IS NULL), 2)     AS without_comment,
       count(*) FILTER (WHERE comment IS NULL)                  AS how_many_without
FROM reviews;`}
              caption="সব মিলিয়ে 4.10, মন্তব্য সহ 4.00, মন্তব্য ছাড়া 4.50। কিন্তু শেষ Column বলছে মন্তব্য ছাড়া Review মাত্র দুটো। দুটো সংখ্যার গড় থেকে কোনো সিদ্ধান্ত টানা ঠিক না। শর্তযুক্ত গড়ের পাশে সবসময় শর্তযুক্ত গোনাটাও রাখুন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "bool-and-or",
      subHeader: { index: "011", title: "bool_and and bool_or" },
      title: <SectionTitle>সবগুলো কি, কোনো একটা কি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিছু প্রশ্নের উত্তর সংখ্যা না, হ্যাঁ বা না। এই Customer এর সব Booking কি confirmed? এই
                Customer কি কখনো কিছু বাতিল করেছেন? দলের প্রতিটা Row কে একটা হ্যাঁ বা না প্রশ্ন করে সব উত্তর
                মিলিয়ে একটা উত্তর দেয় দুটো Aggregate।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>bool_and(শর্ত)</code>: দলের প্রতিটা Row এ শর্ত সত্য হলে true,
                  একটাতেও মিথ্যা হলে false। মানে, সবগুলো কি? SQL Standard এ এর নাম{" "}
                  <code className={CODE}>every</code>, PostgreSQL এ দুটো নামই চলে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>bool_or(শর্ত)</code>: অন্তত একটা Row এ শর্ত সত্য হলেই true।
                  মানে, কোনো একটা কি?
                </ListItem>
                <ListItem>
                  দুটোই NULL মান বাদ দেয়, অন্য Aggregate এর মতো। আর count এর মতো এদের ভেতরেও FILTER বসানো
                  যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর তিনটা হ্যাঁ বা না"
              query={`SELECT customer_id,
       count(*) AS bookings,
       bool_and(status = 'confirmed') AS all_confirmed,
       bool_or(status = 'cancelled')  AS ever_cancelled,
       every(seats <= 2)              AS small_groups
FROM bookings
GROUP BY customer_id
ORDER BY customer_id;`}
              caption="14টা লাইন, t মানে true, f মানে false। Customer 2 এর দুটো Booking ই confirmed, তাই all_confirmed t। Customer 5, 6 আর 11 এর ever_cancelled t। Customer 12 এর একমাত্র Booking pending, তাই all_confirmed f, যদিও কিছু বাতিলও হয়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                bool_and আর bool_or আসলে আগের কৌশলেরই ছোট রূপ। bool_or(শর্ত) এর মানে প্রায় একই
                count(*) FILTER (WHERE শর্ত) &gt; 0 এর মতো, আর bool_and(শর্ত) এর মানে প্রায় একই সব Row শর্তে
                মেলে, অর্থাৎ ব্যতিক্রমের সংখ্যা শূন্য। পার্থক্য হলো পড়ার সময়: bool_and দেখামাত্র বোঝা যায়
                প্রশ্নটা কী।
              </ContentParagraph>
              <ContentParagraph>
                এগুলোর সবচেয়ে কাজের জায়গা HAVING। Lesson 03 এ শিখেছেন HAVING দল ছাঁকে। bool_and নিজেই true বা
                false, তাই সেটাকে সরাসরি HAVING এ বসিয়ে দেওয়া যায়।
              </ContentParagraph>
            </div>
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
                  কোন কোন Departure এর প্রতিটা Booking confirmed? শুধু একটা Column,{" "}
                  <code className={CODE}>departure_id</code>, ছোট থেকে বড় সাজানো।
                </>
              }
              hint={
                <>
                  GROUP BY departure_id, তারপর{" "}
                  <code className={CODE}>HAVING bool_and(status = &apos;confirmed&apos;)</code>।
                </>
              }
              solution={`SELECT departure_id
FROM bookings
GROUP BY departure_id
HAVING bool_and(status = 'confirmed')
ORDER BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "having-conditions",
      subHeader: { index: "012", title: "Conditions in HAVING" },
      title: <SectionTitle>শর্তযুক্ত গোনা দিয়ে দল ছাঁকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                FILTER করা Aggregate আর দশটা Aggregate এর মতোই, তাই HAVING এর ভেতরেও বসে। এতে এমন প্রশ্ন
                করা যায় যেগুলো WHERE দিয়ে কখনো করা যায় না, কারণ উত্তর নির্ভর করে পুরো দলের উপর। যেমন:
                কোন Customer অন্তত একটা Booking বাতিল করেছেন? কোন Departure এ এখনো pending Booking বাকি?
              </ContentParagraph>
              <ContentParagraph>
                প্রথম প্রশ্নটা WHERE status = &apos;cancelled&apos; দিয়েও করা যায় বলে মনে হতে পারে। কিন্তু
                তখন সেই Customer এর বাকি Booking গুলো আর হিসাবে থাকে না, পাশে মোট সংখ্যা বা confirmed সংখ্যা
                দেখানো যায় না। HAVING এ শর্ত রাখলে পুরো দলটা অক্ষত থাকে, শুধু দলটা থাকবে কি থাকবে না, সেই
                সিদ্ধান্ত শর্ত দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাতিল আছে এমন Customer, আর pending আছে এমন Departure"
              query={`SELECT customer_id,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM bookings
GROUP BY customer_id
HAVING count(*) FILTER (WHERE status = 'cancelled') >= 1
ORDER BY customer_id;

SELECT departure_id,
       count(*) FILTER (WHERE status = 'pending') AS pending
FROM bookings
GROUP BY departure_id
HAVING count(*) FILTER (WHERE status = 'pending') > 0
ORDER BY departure_id;`}
              caption="প্রথম ফলাফলে Customer 5, 6 আর 11, প্রত্যেকের একটা করে বাতিল। bookings Column এ তাঁদের মোট Booking ও দেখা যাচ্ছে, যা WHERE দিয়ে ছাঁকলে হারিয়ে যেত। দ্বিতীয় ফলাফলে Departure 8, 11 আর 14, যেখানে Sales টিমকে এখনো ফোন করতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              orderMatters
              task={
                <>
                  Loyalty Program এর জন্য: কোন Customer দের অন্তত দুটো confirmed Booking আছে? দুটো Column:{" "}
                  <code className={CODE}>customer_id</code> আর তাঁর confirmed Booking এর সংখ্যা,{" "}
                  customer_id অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  SELECT এ আর HAVING এ একই লেখা:{" "}
                  <code className={CODE}>count(*) FILTER (WHERE status = &apos;confirmed&apos;)</code>, আর
                  HAVING এ তার পরে <code className={CODE}>&gt;= 2</code>।
                </>
              }
              solution={`SELECT customer_id,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed
FROM bookings
GROUP BY customer_id
HAVING count(*) FILTER (WHERE status = 'confirmed') >= 2
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
      title: <SectionTitle>MySQL এ FILTER নেই, তবু সব হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL দিয়ে শেখানো কোনো ভিডিও দেখলে FILTER কোথাও পাবেন না, কারণ MySQL 8.4 এ FILTER নেই।
                bool_and, bool_or আর every ও নেই। তবু এই লেসনের প্রতিটা Report MySQL এ লেখা যায়, CASE আর
                একটা MySQL এর নিজস্ব সুবিধা দিয়ে: MySQL এ একটা তুলনার ফল সরাসরি একটা সংখ্যা, সত্য হলে 1 আর
                মিথ্যা হলে 0। তাই <code className={CODE}>SUM(status = &apos;confirmed&apos;)</code> সরাসরি
                মেলা Row এর সংখ্যা দেয়, কোনো Cast ছাড়াই।
              </ContentParagraph>
              <ContentParagraph>
                নিচের সব ফলাফল আসল MySQL 8.4.11 এ, এই ট্র্যাকের MySQL Sample Database Load করে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: FILTER নেই",
          code: `mysql> SELECT COUNT(*) FILTER (WHERE status = 'confirmed') FROM bookings;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near
'(WHERE status = 'confirmed') FROM bookings' at line 1

mysql> SELECT BOOL_AND(status = 'confirmed') FROM bookings;
ERROR 1305 (42000): FUNCTION island_tours.BOOL_AND does not exist`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: একই Dashboard, MySQL এর ভাষায়",
          code: `SELECT COUNT(*) AS bookings,
       SUM(status = 'confirmed') AS confirmed,
       SUM(status = 'pending')   AS pending,
       SUM(status = 'cancelled') AS cancelled,
       SUM(CASE WHEN status = 'confirmed' THEN total_bdt END) AS confirmed_revenue,
       SUM(IF(status = 'pending', total_bdt, 0))              AS waiting_bdt
FROM bookings;

-- +----------+-----------+---------+-----------+-------------------+-------------+
-- | bookings | confirmed | pending | cancelled | confirmed_revenue | waiting_bdt |
-- +----------+-----------+---------+-----------+-------------------+-------------+
-- |       24 |        17 |       4 |         3 |         423600.00 |   117200.00 |
-- +----------+-----------+---------+-----------+-------------------+-------------+`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql: শতাংশ, সবগুলো কি, কোনো একটা কি",
          code: `SELECT 100 * SUM(status = 'cancelled') / COUNT(*)  AS pct,
       ROUND(100 * AVG(status = 'cancelled'), 1)   AS pct_avg
FROM bookings;
-- pct = 12.5000, pct_avg = 12.5
-- MySQL এ / সবসময় দশমিকে ভাগ করে, তাই পূর্ণসংখ্যার ফাঁদ নেই

SELECT customer_id,
       MIN(status = 'confirmed') AS all_confirmed,   -- bool_and এর জায়গায়
       MAX(status = 'cancelled') AS ever_cancelled   -- bool_or এর জায়গায়
FROM bookings
GROUP BY customer_id
HAVING customer_id IN (2, 6)
ORDER BY customer_id;
-- customer 2: all_confirmed 1, ever_cancelled 0
-- customer 6: all_confirmed 0, ever_cancelled 1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "COUNT এর ফাঁদ MySQL এও আছে",
          content: (
            <ContentParagraph>
              MySQL এ <code className={CODE}>SUM(status = &apos;confirmed&apos;)</code> দেয় 17, কিন্তু{" "}
              <code className={CODE}>COUNT(status = &apos;confirmed&apos;)</code> দেয় 24, একদম PostgreSQL এর
              মতো। কারণ একই: মিথ্যা মানে 0, আর 0 একটা মান, NULL না। MySQL এ শর্তযুক্ত গোনার নিয়ম তাই
              একটাই: SUM দিয়ে যোগ করুন, COUNT দিয়ে না। একটা শর্তযুক্ত Departure এর হিসাবে কোনো Row না মিললে
              MySQL এর SUM ও NULL দেয়, PostgreSQL এর মতোই, তাই সেখানেও COALESCE বা IFNULL লাগে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["শর্তে গোনা", "count(*) FILTER (WHERE …)", "SUM(শর্ত) বা SUM(CASE WHEN … THEN 1 ELSE 0 END)"],
            ["শর্তে যোগফল", "sum(x) FILTER (WHERE …)", "SUM(CASE WHEN … THEN x END) বা SUM(IF(…, x, 0))"],
            ["শর্তে গড়", "avg(x) FILTER (WHERE …)", "AVG(CASE WHEN … THEN x END), ELSE ছাড়া"],
            ["তুলনা থেকে সংখ্যা", "(শর্ত)::int", "শর্ত নিজেই 1 বা 0"],
            ["সবগুলো কি", "bool_and(শর্ত) বা every(শর্ত)", "MIN(শর্ত) = 1"],
            ["কোনো একটা কি", "bool_or(শর্ত)", "MAX(শর্ত) = 1"],
            ["শতাংশের ভাগ", "100.0 দিয়ে গুণ, নইলে পূর্ণসংখ্যার ভাগ", "/ সবসময় দশমিক"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>ফারুক সাহেবের সকালের Dashboard</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Admin Panel খুললে উপরে একটা সারি ছোট কার্ড থাকে, প্রতিটায় একটা সংখ্যা: মোট
                Booking, confirmed, pending, বাতিল, বাতিলের হার, নিশ্চিত আয়, অপেক্ষায় থাকা টাকা, নিশ্চিত
                সিট, আর গত তিরিশ দিনের নতুন Booking। এমন Dashboard এর পেছনে সাধারণত নয়টা Query থাকে না, থাকে
                একটা, ঠিক এই লেসনের কৌশলে লেখা। App সেই এক লাইনের নয়টা ঘর নয়টা কার্ডে বসিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচে সেই Query। গত তিরিশ দিনের হিসাবে আজকের তারিখ হিসেবে now() লেখা হয়নি, ধরা হয়েছে 1
                November 2026, যাতে আপনার আর এই লেসনের উত্তর সবসময় মেলে। আসল App এ সেখানে বসবে current_date।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Admin Dashboard, এক Query তে"
              query={`SELECT count(*) AS bookings,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct,
       sum(total_bdt) FILTER (WHERE status = 'confirmed') AS confirmed_revenue,
       sum(total_bdt) FILTER (WHERE status = 'pending')   AS waiting_bdt,
       sum(seats) FILTER (WHERE status = 'confirmed')     AS confirmed_seats,
       count(*) FILTER (WHERE booked_at >= DATE '2026-11-01' - 30) AS last_30_days
FROM bookings;`}
              caption="নয়টা সংখ্যা, একটা লাইন: 24, 17, 4, 3, 12.5, 423600.00, 117200.00, 38 আর 8। waiting_bdt হলো সেই টাকা যা pending Booking গুলো confirm হলে আসবে। শেষ Column এ DATE থেকে 30 বিয়োগ করে 2 October 2026 পাওয়া গেছে, Module 04 এর তারিখের অঙ্ক।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই এক Query র আরেকটা সুবিধা আছে, যা চোখে পড়ে না। নয়টা সংখ্যা একই মুহূর্তের, কারণ একটা
              Statement পুরো Table টা একটা নির্দিষ্ট মুহূর্তের অবস্থায় দেখে। নয়টা আলাদা Query চালালে মাঝখানে
              কোনো Booking এর status বদলে গেলে কার্ডগুলোর যোগফল মিলত না। তাই Dashboard এ এক Query শুধু দ্রুত
              না, সৎও।
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
                  Customer Support একটা তালিকা চায়, শুধু তাঁদের যাঁদের অন্তত দুটো Booking আছে। প্রতি
                  Customer এ এক লাইন, এই ছয়টা Column এই ক্রমে: <code className={CODE}>customer_id</code>,
                  মোট Booking, confirmed এর সংখ্যা, cancelled এর সংখ্যা, confirmed Booking গুলোর মোট টাকা
                  (কিছু না থাকলে 0), আর তিনি কখনো কিছু বাতিল করেছেন কিনা (true বা false)। customer_id
                  অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  টাকার Column এ{" "}
                  <code className={CODE}>COALESCE(sum(total_bdt) FILTER (WHERE …), 0)</code>, শেষ Column এ{" "}
                  <code className={CODE}>bool_or(status = &apos;cancelled&apos;)</code>, আর দল ছাঁকতে{" "}
                  <code className={CODE}>HAVING count(*) &gt;= 2</code>।
                </>
              }
              solution={`SELECT customer_id,
       count(*) AS bookings,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       COALESCE(sum(total_bdt) FILTER (WHERE status = 'confirmed'), 0) AS confirmed_spend,
       bool_or(status = 'cancelled') AS ever_cancelled
FROM bookings
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা শর্তযুক্ত Query, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতি Departure এর ভাঙা হিসাবের Query টা Database ভেতরে কোন ক্রমে চালায়, Module 03 এর Query
              Order লেসনের ধাপগুলোর সাথে মিলিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM bookings",
              description:
                "Database bookings Table টা পড়তে শুরু করে, একবার। পুরো Query তে এটাই একমাত্র পড়া।",
            },
            {
              title: "WHERE, যদি থাকে",
              description:
                "Query র নিজের WHERE সবার আগে চলে। যে Row এর শর্তে মেলে না, সেটা আর কোনো খাতার কাছে যায় না, count(*) এর কাছেও না।",
            },
            {
              title: "GROUP BY departure_id",
              description:
                "বাকি প্রতিটা Row কে তার departure_id এর দলে পাঠানো হয়। প্রতিটা দলের নিজের এক সেট খাতা খোলে: count(*), confirmed, pending, cancelled, held।",
            },
            {
              title: "প্রতিটা খাতার পাহারাদার",
              description:
                "দলের ভেতরে প্রতিটা Row প্রতিটা খাতার পাশ দিয়ে যায়। FILTER থাকলে আগে তার শর্ত দেখা হয়: true হলে খাতায় যোগ, false বা NULL হলে বাদ, শুধু ওই খাতার জন্য।",
            },
            {
              title: "খাতা বন্ধ, উত্তর তৈরি",
              description:
                "সব Row শেষ হলে প্রতিটা খাতা নিজের উত্তর দেয়। কোনো Row না পাওয়া count দেয় 0, কোনো Row না পাওয়া sum দেয় NULL।",
            },
            {
              title: "HAVING, যদি থাকে",
              description:
                "এবার প্রতিটা দলের উত্তর তৈরি, তাই HAVING সেগুলো দেখে ঠিক করে কোন দল থাকবে। এখানেও FILTER করা Aggregate বসতে পারে।",
            },
            {
              title: "SELECT, তারপর ORDER BY",
              description:
                "শতাংশের মতো যে হিসাবগুলো খাতার উত্তর দিয়ে করা, সেগুলো এখন হয়। শেষে ORDER BY দলের লাইনগুলো সাজায়।",
            },
          ],
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
          headers: ["ভুল", "কী হয়", "ঠিক লেখা"],
          rows: [
            [
              "count(CASE WHEN … THEN 1 ELSE 0 END)",
              "কোনো Error ছাড়াই সব Row গোনা হয়",
              "count(CASE WHEN … THEN 1 END), অথবা FILTER",
            ],
            [
              "count(status = 'confirmed')",
              "মিথ্যা মানও গোনা হয়, উত্তর মোট সংখ্যা",
              "count(*) FILTER (WHERE status = 'confirmed')",
            ],
            [
              "avg(CASE WHEN … THEN x ELSE 0 END)",
              "শূন্যগুলো গড়কে নিচে টানে",
              "avg(x) FILTER (WHERE …), অথবা ELSE ছাড়া CASE",
            ],
            [
              "একটা Column এর শর্ত WHERE এ লেখা",
              "সবগুলো Column বদলে যায়, count(*) সহ",
              "সেই শর্ত FILTER এ, শুধু ওই Column এ",
            ],
            [
              "শতাংশে count * 100 / count",
              "পূর্ণসংখ্যার ভাগ, দশমিক হারায়",
              "100.0 * count / count, তারপর round",
            ],
            [
              "FILTER করা sum পাঠকের সামনে ফাঁকা",
              "কিছু না মিললে NULL, পাঠক ভাবেন Data নেই",
              "COALESCE(sum(…) FILTER (…), 0)",
            ],
            [
              "ভাগের নিচে FILTER করা count",
              "শূন্য হলে division by zero",
              "NULLIF(count(*) FILTER (…), 0)",
            ],
            [
              "সাধারণ Function এর পরে FILTER",
              "Error: FILTER specified, but … is not an aggregate function",
              "FILTER শুধু Aggregate এর পরে",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ ভুলটা আর FILTER এর বন্ধনী ভুলে যাওয়া, দুটোর Error নিজের চোখে দেখে নিন, যাতে আসল কাজে দেখলে
              চিনতে পারেন। বক্সের প্রথম Statement ঠিক লেখা, দ্বিতীয়টা ইচ্ছা করে ভুল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="FILTER শুধু Aggregate এর সাথে"
              query={`SELECT count(*) FILTER (WHERE seats > 1) AS multi_seat
FROM bookings;

SELECT upper(status) FILTER (WHERE seats > 1)
FROM bookings;`}
              caption="প্রথমটা চলে: 19টা Booking এ একের বেশি সিট। দ্বিতীয়টা থামে: FILTER specified, but upper is not an aggregate function। upper প্রতিটা Row এর জন্য একটা করে মান দেয়, অনেক Row কে এক উত্তরে নামায় না, তাই তার সামনে পাহারাদার বসানোর কোনো মানে নেই। FILTER (seats > 1) লিখে WHERE বাদ দিলেও Error আসে: syntax error at or near seats।"
            />
          ),
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Aggregate Expressions
                  </a>
                  : FILTER এর পুরো Syntax আর তার আসল সংজ্ঞা, যেখান থেকে এই লেসনের “শুধু true হলে Aggregate
                  এর কাছে যায়” কথাটা নেওয়া।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-aggregate.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Aggregate Functions
                  </a>
                  : count, sum, avg থেকে bool_and, bool_or আর every পর্যন্ত সব Aggregate এর তালিকা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://modern-sql.com/feature/filter"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Modern SQL: The FILTER clause
                  </a>
                  : FILTER কেন Standard এ এল, কোন Database এ আছে, আর যেখানে নেই সেখানে CASE দিয়ে কীভাবে
                  একই কাজ করবেন।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Aggregate Function Descriptions
                  </a>
                  : MySQL এর SUM, COUNT, AVG, MIN, MAX আর BIT_AND এর বর্ণনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=5352s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, GROUP BY এর অংশ
                  </a>
                  : এটা MySQL দিয়ে শেখানো, তাই সেখানে FILTER পাবেন না। সেখানকার প্রতিটা GROUP BY Query তে
                  এই লেসনের কৌশলে একটা SUM(শর্ত) Column যোগ করে অনুশীলন করতে পারেন।
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
                  একই SELECT এ কয়েকটা শর্তযুক্ত Aggregate মানে Table একবার পড়ে কয়েকটা প্রশ্নের উত্তর, এক
                  লাইনে, একই মুহূর্তের।
                </ListItem>
                <ListItem>
                  <strong>FILTER (WHERE শর্ত)</strong> যেকোনো Aggregate এর পরে বসে, আর শুধু সেই Aggregate
                  এর জন্য Row বাছাই করে।
                </ListItem>
                <ListItem>
                  CASE এর রূপ সব Database এ চলে: sum এর ভেতরে ELSE 0, count আর avg এর ভেতরে কোনো ELSE না।
                </ListItem>
                <ListItem>
                  কিছু না মিললে count দেয় 0, sum আর avg দেয় NULL। পাঠকের সামনে যাওয়া যোগফলে COALESCE।
                </ListItem>
                <ListItem>
                  GROUP BY দিলে প্রতিটা দলে একটা লাইন, প্রতিটা FILTER এ একটা Column: হাতে বানানো Pivot।
                </ListItem>
                <ListItem>
                  WHERE সবার দরজা, FILTER একজনের। সবার শর্ত WHERE এ, একটা Column এর শর্ত FILTER এ।
                </ListItem>
                <ListItem>
                  শতাংশে 100.0 দিয়ে গুণ, আর ভাগের নিচে FILTER করা count থাকলে NULLIF।
                </ListItem>
                <ListItem>
                  <strong>bool_and</strong> মানে সবগুলো কি, <strong>bool_or</strong> মানে কোনো একটা কি,
                  আর দুটোই সরাসরি HAVING এ বসে।
                </ListItem>
                <ListItem>
                  MySQL এ FILTER নেই: SUM(শর্ত), SUM(CASE …), আর bool এর জায়গায় MIN বা MAX।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন পর্যন্ত প্রতিটা Report এ প্রতিটা দলের একটা করে লাইন পেয়েছেন। কিন্তু Finance এর Report এ
                প্রায়ই আরও চাওয়া থাকে: প্রতিটা মাসের লাইন, তার নিচে মাসের উপমোট, আর একদম শেষে সব মিলিয়ে
                সর্বমোট, সবই একই ফলাফলে। সেই কাজের যন্ত্র পরের লেসনে,{" "}
                <Link href="/sql/topic/rollup-cube" className={LINK}>
                  ROLLUP, CUBE and GROUPING SETS
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
    headers: ["ধারণা", "এক লাইনে", "Island Tours এ কোথায়"],
    rows: [
      ["শর্তযুক্ত গোনা", "একবার পড়ে অনেক প্রশ্নের উত্তর এক লাইনে", "সকালের Dashboard এর নয়টা কার্ড"],
      ["FILTER", "একটা Aggregate এর সামনে শর্ত", "count(*) FILTER (WHERE status = 'confirmed')"],
      ["CASE এর রূপ", "সব Database এ চলা পুরনো উপায়", "sum(CASE WHEN … THEN 1 ELSE 0 END)"],
      ["COUNT এর ফাঁদ", "ELSE 0 বা boolean দিলে সব Row গোনা হয়", "count(status = 'confirmed') দেয় 24"],
      ["খালি দলে sum", "কিছু না মিললে NULL, count দেয় 0", "Departure 12 এর held"],
      ["একটাও Row নেই", "CASE ও কিছু করতে পারে না, COALESCE লাগে", "Departure 16"],
      ["দলের ভাঙা হিসাব", "GROUP BY এ লাইন, FILTER এ Column", "প্রতি Departure এর status"],
      ["WHERE বনাম FILTER", "WHERE সবার, FILTER একজনের", "অক্টোবরের Booking এর ভাগ"],
      ["শতাংশ", "100.0 দিয়ে গুণ, তারপর round", "বাতিলের হার 12.5"],
      ["ভাগের নিচে FILTER", "NULLIF দিয়ে শূন্যের পাহারা", "Departure 12 এর pending_pct"],
      ["শর্তযুক্ত গড়", "avg এর ভেতরে ELSE 0 নয়", "confirmed এ গড়ে 2.24 সিট"],
      ["bool_and, bool_or", "সবগুলো কি, কোনো একটা কি", "ever_cancelled"],
      ["HAVING এ শর্ত", "পুরো দল অক্ষত রেখে দল ছাঁকা", "অন্তত দুটো confirmed এর Customer"],
      ["MySQL এ", "SUM(শর্ত), MIN আর MAX", "একই Dashboard, FILTER ছাড়া"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "count(*) FILTER (WHERE status = 'pending') আর পুরো Query তে WHERE status = 'pending' লেখার মূল পার্থক্য কী?",
        options: [
          {
            key: "A",
            text: "কোনো পার্থক্য নেই, দুটো একই লেখার দুই রূপ",
            isCorrect: false,
            explanation:
              "একটা Column এর জন্য দুটো একই সংখ্যা দিতে পারে, কিন্তু Query র WHERE সবগুলো Column এর Row কমিয়ে দেয়, FILTER দেয় না।",
          },
          {
            key: "B",
            text: "FILTER শুধু সেই একটা Aggregate এর Row বাছাই করে, WHERE পুরো Query র Row বাদ দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। WHERE দরজায় দাঁড়ায়, তাই count(*) সহ সব Column শুধু pending Row দেখে। FILTER একটা খাতার সামনে বসে, বাকি Column সব Row দেখে।",
          },
          {
            key: "C",
            text: "FILTER দ্রুত, তাই সবসময় WHERE এর বদলে FILTER লেখা উচিত",
            isCorrect: false,
            explanation:
              "উল্টো। যে শর্ত সবার জন্য, সেটা WHERE এ থাকলে Database আগেই Row বাদ দিয়ে কম কাজ করে।",
          },
          {
            key: "D",
            text: "WHERE শুধু GROUP BY ছাড়া চলে, FILTER শুধু GROUP BY এর সাথে",
            isCorrect: false,
            explanation: "দুটোই GROUP BY সহ বা ছাড়া চলে। এই লেসনের প্রথম Dashboard এ GROUP BY নেই, FILTER আছে।",
          },
        ],
      },
      {
        id: 2,
        text: "bookings এ 24টা Row, 17টা confirmed। count(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) কত দেয়?",
        options: [
          {
            key: "A",
            text: "17",
            isCorrect: false,
            explanation: "17 আসত ELSE না লিখলে। ELSE 0 থাকায় না মেলা Row গুলোও একটা মান পায়।",
          },
          {
            key: "B",
            text: "7",
            isCorrect: false,
            explanation: "7 হলো না মেলা Row এর সংখ্যা, কিন্তু count মান গোনে, মান কত সেটা দেখে না।",
          },
          {
            key: "C",
            text: "24",
            isCorrect: true,
            explanation:
              "ঠিক। মেলা Row পায় 1, বাকিরা 0। দুটোই NULL না, তাই count সব 24টাকেই গোনে। এই কারণেই count এর ভেতরে ELSE লেখা হয় না।",
          },
          {
            key: "D",
            text: "Error, কারণ count এর ভেতরে CASE লেখা যায় না",
            isCorrect: false,
            explanation: "count এর ভেতরে যেকোনো Expression লেখা যায়। Error আসে না, আসে ভুল সংখ্যা, যা আরও বিপজ্জনক।",
          },
        ],
      },
      {
        id: 3,
        text: "Departure 12 এর একমাত্র Booking বাতিল। sum(seats) FILTER (WHERE status <> 'cancelled') কী দেয়?",
        options: [
          {
            key: "A",
            text: "0",
            isCorrect: false,
            explanation: "0 আসে COALESCE দিলে, বা CASE এর রূপে ELSE 0 দিলে। FILTER করা sum নিজে 0 দেয় না।",
          },
          {
            key: "B",
            text: "NULL",
            isCorrect: true,
            explanation:
              "ঠিক। FILTER এ কোনো Row মেলেনি, তাই sum এর কাছে যোগ করার কিছু যায়নি। কিছু না পেলে sum দেয় NULL, count দিত 0।",
          },
          {
            key: "C",
            text: "1, বাতিল Booking এর সিট",
            isCorrect: false,
            explanation: "বাতিল Row টাই তো FILTER এ বাদ পড়েছে। তার সিট গোনার কোনো সুযোগ নেই।",
          },
          {
            key: "D",
            text: "Departure 12 এর কোনো লাইনই আসে না",
            isCorrect: false,
            explanation:
              "লাইন আসে, কারণ bookings এ Departure 12 এর একটা Row আছে। লাইন আসে না Departure 16 এর, যার কোনো Row ই নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "confirmed Booking গুলোর গড় সিট বের করতে কোন লেখাটা ভুল উত্তর দেয়?",
        options: [
          {
            key: "A",
            text: "avg(seats) FILTER (WHERE status = 'confirmed')",
            isCorrect: false,
            explanation: "এটা সঠিক: শুধু 17টা confirmed Row গড়ে ঢোকে, উত্তর 2.24।",
          },
          {
            key: "B",
            text: "avg(CASE WHEN status = 'confirmed' THEN seats END)",
            isCorrect: false,
            explanation: "এটাও সঠিক: না মেলা Row NULL পায়, avg তাদের বাদ দেয়, উত্তর 2.24।",
          },
          {
            key: "C",
            text: "avg(CASE WHEN status = 'confirmed' THEN seats ELSE 0 END)",
            isCorrect: true,
            explanation:
              "ঠিক ধরেছেন, এটাই ভুল। বাকি সাতটা Row শূন্য হয়ে গড়ে ঢোকে, তাই 38 কে 24 দিয়ে ভাগ হয়ে উত্তর 1.58।",
          },
          {
            key: "D",
            text: "sum(seats) FILTER (WHERE status = 'confirmed') / 17.0",
            isCorrect: false,
            explanation: "38 ভাগ 17.0 সঠিক গড় দেয়, যদিও 17 হাতে লেখা বলে Data বদলালে এটা আর ঠিক থাকবে না।",
          },
        ],
      },
      {
        id: 5,
        text: "24টা Booking এর 3টা বাতিল। count(*) FILTER (WHERE status = 'cancelled') * 100 / count(*) কত দেয়?",
        options: [
          {
            key: "A",
            text: "12.5",
            isCorrect: false,
            explanation: "12.5 পেতে হলে ভাগটা দশমিকে হতে হতো, যেমন 100.0 দিয়ে গুণ করলে।",
          },
          {
            key: "B",
            text: "12",
            isCorrect: true,
            explanation:
              "ঠিক। count এর উত্তর পূর্ণসংখ্যা, 300 কে 24 দিয়ে পূর্ণসংখ্যার ভাগে .5 হারিয়ে যায়। Module 04 এর সেই পুরনো ফাঁদ।",
          },
          {
            key: "C",
            text: "13",
            isCorrect: false,
            explanation: "PostgreSQL এর পূর্ণসংখ্যার ভাগ round করে না, দশমিক অংশ কেটে ফেলে।",
          },
          {
            key: "D",
            text: "0, কারণ 3 কে 24 দিয়ে ভাগ আগে হয়",
            isCorrect: false,
            explanation:
              "এই লেখায় গুণ আগে, কারণ * আর / সমান ক্ষমতার আর বাঁ থেকে চলে: 3 * 100 = 300, তারপর 300 / 24। উল্টো ক্রমে লিখলে 0 আসত।",
          },
        ],
      },
      {
        id: 6,
        text: "কোন Customer দের সব Booking confirmed, এমন দলগুলো রাখতে HAVING এ কী লিখবেন?",
        options: [
          {
            key: "A",
            text: "HAVING status = 'confirmed'",
            isCorrect: false,
            explanation: "HAVING দল দেখে, একটা Row না। দলের ভেতরে অনেক status, তাই status নিজে সেখানে Error দেয়।",
          },
          {
            key: "B",
            text: "HAVING bool_or(status = 'confirmed')",
            isCorrect: false,
            explanation: "bool_or মানে অন্তত একটা confirmed, সবগুলো না। Customer 1 এর মতো যাঁর একটা pending আছে, তিনিও থেকে যাবেন।",
          },
          {
            key: "C",
            text: "HAVING bool_and(status = 'confirmed')",
            isCorrect: true,
            explanation:
              "ঠিক। bool_and তখনই true যখন দলের প্রতিটা Row এ শর্ত সত্য। every(status = 'confirmed') লিখলেও একই।",
          },
          {
            key: "D",
            text: "HAVING count(*) FILTER (WHERE status = 'confirmed') >= 1",
            isCorrect: false,
            explanation: "এটা bool_or এর মতোই, অন্তত একটা। সবগুলো বোঝাতে confirmed এর সংখ্যা মোটের সমান কিনা দেখতে হতো।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL 8.4 এ confirmed Booking এর সংখ্যা গোনার সঠিক লেখা কোনটা?",
        options: [
          {
            key: "A",
            text: "COUNT(*) FILTER (WHERE status = 'confirmed')",
            isCorrect: false,
            explanation: "MySQL এ FILTER নেই, এটা ERROR 1064 দেয়।",
          },
          {
            key: "B",
            text: "COUNT(status = 'confirmed')",
            isCorrect: false,
            explanation: "এটা চলে, কিন্তু 24 দেয়, কারণ মিথ্যার ফল 0 আর 0 NULL না। PostgreSQL এর মতো একই ফাঁদ।",
          },
          {
            key: "C",
            text: "SUM(status = 'confirmed')",
            isCorrect: true,
            explanation:
              "ঠিক। MySQL এ তুলনার ফল সরাসরি 1 বা 0, তাই যোগফলই মেলা Row এর সংখ্যা: 17।",
          },
          {
            key: "D",
            text: "BOOL_AND(status = 'confirmed')",
            isCorrect: false,
            explanation: "MySQL এ BOOL_AND নেই, ERROR 1305 দেয়। আর থাকলেও এটা সংখ্যা না, হ্যাঁ বা না দিত।",
          },
        ],
      },
      {
        id: 8,
        text: "Admin Dashboard এর নয়টা সংখ্যা নয়টা আলাদা Query তে না নিয়ে একটা Query তে নেওয়ার সবচেয়ে বড় লাভ কোনটা নয়?",
        options: [
          {
            key: "A",
            text: "Table একবার পড়া হয়, তাই কম কাজ",
            isCorrect: false,
            explanation: "এটা আসল লাভ: নয়টা খাতা, একবার পড়া।",
          },
          {
            key: "B",
            text: "নয়টা সংখ্যা একই মুহূর্তের, তাই যোগফল মেলে",
            isCorrect: false,
            explanation: "এটাও আসল লাভ: একটা Statement পুরো Table একটা মুহূর্তের অবস্থায় দেখে।",
          },
          {
            key: "C",
            text: "App একবার Database এ যায়, নয়বার না",
            isCorrect: false,
            explanation: "এটাও লাভ: প্রতিটা Query মানে Network এ একবার যাওয়া আসা, Module 01 এর Lesson 06 এর কথা।",
          },
          {
            key: "D",
            text: "FILTER দিলে Database নিজে থেকে ফলাফল Cache করে রাখে",
            isCorrect: true,
            explanation:
              "ঠিক ধরেছেন, এটা লাভ না, কারণ কথাটাই সত্য না। FILTER কোনো Cache বানায় না। সে শুধু ঠিক করে কোন Row কোন Aggregate এ যাবে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: এক Query র Report",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Finance এর এক লাইন:</strong> payments Table থেকে এক লাইনে মোট চেষ্টা, paid, failed, refunded,
        paid টাকার যোগফল আর সফলতার হার শতাংশে। প্রথমে চারটা আলাদা Query তে চারটা সংখ্যা বের করুন, তারপর
        একটা Query তে সবগুলো, আর দেখান দুই পথের সংখ্যা মিলেছে।
      </span>,
      <span key="2">
        <strong>ফাঁদ ধরা:</strong> একই প্রশ্ন (কয়টা confirmed) চারভাবে লিখুন: FILTER, sum(CASE … ELSE 0), count(CASE
        … ELSE 0) আর count(status = &apos;confirmed&apos;)। কোন দুটো ভুল, আর কেন, তিন লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>Departure এর Pivot:</strong> প্রতি Departure এ confirmed, pending আর cancelled সিটের সংখ্যা (Booking
        না, সিট), তিনটা Column এ। কোনো ঘরে যেন NULL না থাকে। কোন Departure এর লাইন আসেনি আর কেন, এক
        লাইনে লিখুন।
      </span>,
      <span key="4">
        <strong>WHERE না FILTER:</strong> নিচের তিনটা প্রশ্নের প্রতিটার জন্য সিদ্ধান্ত নিন শর্তটা WHERE এ যাবে না
        FILTER এ, আর Query লিখুন: (ক) শুধু Bangladesh এর Customer দের মধ্যে কয়জনের ফোন নেই, (খ) সব Customer
        এর মোট সংখ্যা আর তাঁদের মধ্যে বিদেশি কয়জন, এক লাইনে, (গ) 2026 সালে আসা Booking গুলোর মধ্যে কয়টা
        pending।
      </span>,
      <span key="5">
        <strong>MySQL এ অনুবাদ:</strong> এই লেসনের Admin Dashboard Query টা MySQL এর ভাষায় লিখুন, FILTER আর
        bool_or ছাড়া। MySQL ইনস্টল থাকলে চালিয়ে PostgreSQL এর সাথে নয়টা সংখ্যা মিলিয়ে দেখান।
      </span>,
    ],
    deliverables: [
      <span key="d1">চারটা আলাদা Query আর এক Query র ফলাফল, পাশাপাশি</span>,
      <span key="d2">চারটা লেখার ফলাফল আর ভুল দুটোর ব্যাখ্যা</span>,
      <span key="d3">সিটের Pivot Query আর হারিয়ে যাওয়া Departure এর কারণ</span>,
      <span key="d4">তিনটা প্রশ্নের Query, প্রতিটার পাশে WHERE না FILTER এর এক লাইনের যুক্তি</span>,
      <span key="d5">MySQL সংস্করণের Query, আর চালাতে পারলে তার Output</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ শর্তযুক্ত গোনা",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "চার Query থেকে এক Query",
        description:
          "প্রথম ফাইলের চারটা আলাদা Query আর শেষের এক Query চালান। পাঁচটা ফলাফলের সংখ্যা মন্তব্যের সাথে মেলান।",
      },
      {
        title: "COUNT এর ফাঁদ",
        description:
          "দ্বিতীয় ফাইলের চারটা Column এর কোন দুটো 24 আর কোন দুটো 17, আগে অনুমান করুন, তারপর চালিয়ে মেলান।",
      },
      {
        title: "শূন্য না NULL",
        description:
          "তৃতীয় ফাইলে \\pset null দিয়ে NULL কে দৃশ্যমান করে Departure 12 আর 16 এর হিসাব দেখুন।",
      },
      {
        title: "Departure এর ভাঙা হিসাব",
        description:
          "চতুর্থ ফাইল চালিয়ে কয়টা লাইন এল গুনুন। ষোলোটা Departure, তাহলে লাইন কম কেন, মন্তব্য দেখে নিশ্চিত হোন।",
      },
      {
        title: "শতাংশ আর শর্তযুক্ত গড়",
        description:
          "পঞ্চম ফাইলে পূর্ণসংখ্যার ভাগের ভুল উত্তর আর সঠিক উত্তর পাশাপাশি, তারপর avg এর ELSE 0 এর ভুল।",
      },
      {
        title: "সবগুলো কি, কোনো একটা কি",
        description:
          "ষষ্ঠ ফাইলে bool_and আর bool_or দিয়ে HAVING। দুটো Query তে কয়টা করে লাইন এল, মন্তব্যের সাথে মেলান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-one-pass.sql",
        code: `SELECT count(*) FROM bookings;                              -- 24
SELECT count(*) FROM bookings WHERE status = 'confirmed';  -- 17
SELECT count(*) FROM bookings WHERE status = 'pending';    -- 4
SELECT count(*) FROM bookings WHERE status = 'cancelled';  -- 3

SELECT count(*) AS total,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM bookings;
-- 24 | 17 | 4 | 3, এক লাইনে`,
      },
      {
        language: "sql",
        filename: "02-count-trap.sql",
        code: `SELECT count(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS a,
       count(CASE WHEN status = 'confirmed' THEN 1 END)        AS b,
       count(status = 'confirmed')                             AS c,
       sum(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)   AS d
FROM bookings;
-- a = 24, b = 17, c = 24, d = 17`,
      },
      {
        language: "sql",
        filename: "03-zero-or-null.sql",
        code: `\\pset null '(null)'

SELECT count(*) FILTER (WHERE status <> 'cancelled') AS live,
       sum(seats) FILTER (WHERE status <> 'cancelled') AS held
FROM bookings
WHERE departure_id = 12;
-- live = 0, held = (null)

SELECT count(*) AS n, sum(seats) AS seats
FROM bookings
WHERE departure_id = 16;
-- n = 0, seats = (null)`,
      },
      {
        language: "sql",
        filename: "04-breakdown.sql",
        code: `SELECT departure_id,
       count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM bookings
GROUP BY departure_id
ORDER BY departure_id;
-- (15 rows): Departure 16 এর কোনো Booking নেই, তাই তার লাইন নেই`,
      },
      {
        language: "sql",
        filename: "05-percent-and-average.sql",
        code: `SELECT count(*) FILTER (WHERE status = 'cancelled') * 100 / count(*) AS wrong_pct,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS right_pct
FROM bookings;
-- wrong_pct = 12, right_pct = 12.5

SELECT round(avg(CASE WHEN status = 'confirmed' THEN seats ELSE 0 END), 2) AS wrong_avg,
       round(avg(seats) FILTER (WHERE status = 'confirmed'), 2)            AS right_avg
FROM bookings;
-- wrong_avg = 1.58, right_avg = 2.24`,
      },
      {
        language: "sql",
        filename: "06-all-or-any.sql",
        code: `SELECT departure_id
FROM bookings
GROUP BY departure_id
HAVING bool_and(status = 'confirmed')
ORDER BY departure_id;
-- (9 rows): 1, 4, 5, 6, 7, 9, 10, 13, 15

SELECT customer_id
FROM bookings
GROUP BY customer_id
HAVING bool_or(status = 'cancelled')
ORDER BY customer_id;
-- (3 rows): 5, 6, 11`,
      },
    ],
    tip: (
      <>
        প্রতিটা মন্তব্যের সংখ্যা একটা নতুন Load করা island_tours থেকে নেওয়া। না মিললে আগে দেখুন আগের কোনো
        পরীক্ষায় Data বদলেছে কিনা, তারপর Module 02 এর মতো ফাইলটা আবার চালিয়ে সব শুরুর অবস্থায় ফিরিয়ে আনুন।
      </>
    ),
  },
};
