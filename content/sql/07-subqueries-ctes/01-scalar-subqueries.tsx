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
  ShapeLab,
  SubqueryStepLab,
} from "../../../components/course/topics/subqueries/scalar-animations";
import {
  MaxVsLimitSplit,
  ResultShapesDiagram,
  TwoStepsDiagram,
  ValueSlotDiagram,
} from "../../../components/course/topics/subqueries/scalar-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const scalarSubqueriesContent: TopicData = {
  id: "scalar-subqueries",
  introduction: {
    badge: "MODULE 07 · LESSON 01",
    title: <SectionTitle>Query এর ভেতরে Query: একটা মান</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন আপনি প্রতিটা প্রশ্নের জন্য একটা Query লিখেছেন। কিন্তু অনেক প্রশ্নের ভেতরে আরেকটা প্রশ্ন লুকিয়ে
          থাকে। “গড়ের চেয়ে দামি ট্যুর কোনগুলো?” এর উত্তর দিতে আগে জানতে হয় গড়টা কত। “সবচেয়ে নতুন Booking টা কে
          করেছেন?” জানতে আগে জানতে হয় সবচেয়ে নতুন সময়টা কোনটা। প্রথম প্রশ্নের উত্তর একটা সংখ্যা, আর সেই সংখ্যাটাই
          দ্বিতীয় প্রশ্নের শর্তে বসে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি শিখবেন কীভাবে প্রথম প্রশ্নটাকে বন্ধনীর ভেতরে লিখে দ্বিতীয় প্রশ্নের ঠিক সেই জায়গায়
          বসিয়ে দেওয়া যায়, যেখানে আগে আপনি হাতে একটা সংখ্যা লিখতেন। এর নাম Scalar Subquery: এমন একটা ভেতরের
          Query, যে ঠিক একটা মান ফেরত দেয়। Scalar শব্দের মানে একক মান, একটা Table না, একটা তালিকাও না, একটা ঘর।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি জানবেন একটা মান যেখানে বসতে পারে, সেখানে Scalar Subquery কীভাবে বসে: SELECT, WHERE, HAVING,
          CASE, ORDER BY আর হিসাবের ভেতর। জানবেন ভেতরের Query কেন আগে চলে আর একবারই চলে, কোনো Row না পেলে কী হয়,
          একাধিক Row পেলে কোন Error আসে আর কেন, আর max(), min() বা LIMIT 1 দিয়ে সেটা ঠিক করলে প্রশ্নটার মানে কীভাবে
          বদলায়। প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে যেখানে খুশি বসান, যেখানে একটা সংখ্যা বা একটা লেখা বসতে পারে। শুধু একটা কথা দিন: আমি যেন ঠিক একটা উত্তর পাই। কিছুই না পেলে আমি চুপচাপ NULL হয়ে যাই, আর দুটো পেলে আমি থেমে গিয়ে জানিয়ে দিই।",
      author: "Scalar Subquery",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>হাতে লেখা একটা সংখ্যা, যেটা পুরনো হয়ে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর সাপ্তাহিক বৈঠকে Operations Manager ফারুক সাহেব
                নতুন Developer তানিমকে জিজ্ঞেস করলেন, আমাদের গড় ট্যুরের চেয়ে কোন ট্যুরগুলোর দাম বেশি? Marketing ঐ
                ট্যুরগুলোর জন্য আলাদা একটা “প্রিমিয়াম” পাতা বানাতে চায়।
              </ContentParagraph>
              <ContentParagraph>
                তানিম দুই ধাপে কাজটা করলেন। প্রথমে একটা Query চালিয়ে গড় দাম বের করলেন, এল 13477.78। তারপর সেই
                সংখ্যাটা হাতে লিখে দ্বিতীয় Query তে বসালেন: যাদের দাম 13477.78 এর বেশি। চারটা ট্যুর এল। কাজ শেষ, উত্তরও
                ঠিক।
              </ContentParagraph>
              <ContentParagraph>
                তিন সপ্তাহ পরে Sylhet ট্যুরের দাম বাড়ল, একটা নতুন ট্যুর যোগ হলো। প্রিমিয়াম পাতা কিন্তু তখনো পুরনো
                13477.78 এর সাথে তুলনা করছে, কারণ সংখ্যাটা Query এর ভেতরে হাতে লেখা। কেউ খেয়াল করল না, কোনো Error ও
                এল না। পাতাটা শুধু চুপচাপ ভুল হয়ে গেল।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যাটা তানিমের দুই ধাপে না, মাঝখানে হাতের কাজে। প্রথম Query এর উত্তরটা যদি নিজে থেকেই দ্বিতীয়
                Query তে বসে যেত, প্রতিবার চালানোর সময় নতুন করে হিসাব হয়ে, তাহলে আর পুরনো হওয়ার সুযোগ থাকত না। SQL
                ঠিক এটাই করতে দেয়। প্রথম Query টাকে বন্ধনীর ভেতরে লিখে সংখ্যাটার জায়গায় বসিয়ে দিলেই হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের দুই ধাপ, হাতে লেখা সংখ্যা সহ"
              query={`SELECT round(avg(price_bdt), 2) AS avg_price FROM tours;

SELECT title, price_bdt
FROM tours
WHERE price_bdt > 13477.78
ORDER BY price_bdt DESC;`}
              caption="প্রথম Statement দেয় 13477.78। দ্বিতীয়টায় সেই সংখ্যা হাতে লেখা, আর চারটা ট্যুর আসে: Luxury Stay, Sundarbans, Family Package আর Bandarban। উত্তর আজ ঠিক, কিন্তু দাম বদলালে দ্বিতীয় Query সেটা জানতেও পারবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে Scalar Subquery",
          content: (
            <ContentParagraph>
              বন্ধনীর ভেতরে লেখা একটা SELECT, যে ঠিক একটা Row আর একটা Column ফেরত দেয়। যেখানে একটা মান বসতে পারে,
              সেখানে সে বসতে পারে, আর বাইরের Query চলার সময় তার উত্তরটা সেই মানের জায়গা নেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "query-inside-query",
      subHeader: { index: "002", title: "A Query Inside a Query" },
      title: <SectionTitle>সংখ্যার জায়গায় প্রশ্নটাই লিখে দিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রান্নার রেসিপির কথা ভাবুন। লেখা আছে, “যতজন অতিথি আসবেন, তার দ্বিগুণ কাপ চাল নিন।” রেসিপি কোনো
                নির্দিষ্ট সংখ্যা লেখেনি, লিখেছে কীভাবে সংখ্যাটা পাবেন। যেদিন চারজন আসবেন সেদিন আট কাপ, যেদিন ছয়জন সেদিন
                বারো কাপ। রেসিপি কখনো পুরনো হয় না, কারণ সংখ্যাটা প্রতিবার নতুন করে বের হয়।
              </ContentParagraph>
              <ContentParagraph>
                Scalar Subquery ঠিক এই কাজ করে। 13477.78 লেখার বদলে আপনি লেখেন কীভাবে সেটা পাওয়া যায়:{" "}
                <code className={CODE}>(SELECT avg(price_bdt) FROM tours)</code>। বন্ধনীটা জরুরি, এটাই Database কে
                বলে যে এখানে একটা আলাদা Query আছে। ভেতরেরটাকে বলে Subquery বা Inner Query, আর যার ভেতরে সে বসে, তাকে
                বলে Outer Query।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ValueSlotDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, এক Query তে"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT avg(price_bdt) FROM tours)
ORDER BY price_bdt DESC;`}
              caption="একই চারটা ট্যুর। পার্থক্য হলো কোথাও 13477.78 লেখা নেই। কাল কোনো ট্যুরের দাম বদলালে এই Query চালানোর মুহূর্তে নতুন গড় হিসাব হবে, আর তালিকাও সেই অনুযায়ী বদলাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা অভ্যাস এখন থেকেই গড়ে তুলুন: কোনো Subquery লেখার আগে বা পরে তাকে একা চালিয়ে দেখুন। বন্ধনীর ভেতরের
              অংশটা কপি করে আলাদা চালালে দেখবেন সে আসলে কী ফেরত দিচ্ছে। Subquery নিয়ে যত গোলমাল, তার বেশিরভাগ ধরা পড়ে
              এই এক মিনিটের কাজে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভেতরের অংশটা একা চালিয়ে দেখুন"
              query={`SELECT avg(price_bdt) FROM tours;`}
              caption="একটা Row, একটা Column: 13477.777777777778। এই একটা মানই বাইরের Query এর WHERE এ বসেছিল। এক Row আর এক Column, এই আকারটাই Scalar Subquery এর শর্ত।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "one-value-one-slot",
      subHeader: { index: "003", title: "One Value, One Slot" },
      title: <SectionTitle>একটা মান যেখানে বসে, সেখানেই সে বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Scalar Subquery এর নিয়ম একটাই: যেখানে আপনি একটা সংখ্যা, একটা লেখা বা একটা তারিখ লিখতে পারতেন, সেখানে
                তাকে লিখতে পারেন। কারণ Database এর চোখে সে শেষ পর্যন্ত একটা মানই। তাই তাকে পাবেন অনেক জায়গায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>WHERE এ</strong>, তুলনার ডান দিকে: গড়ের চেয়ে দামি ট্যুর।
                </ListItem>
                <ListItem>
                  <strong>SELECT এর তালিকায়</strong>, একটা Column হয়ে: প্রতিটা Booking এর পাশে সব Booking এর গড়।
                </ListItem>
                <ListItem>
                  <strong>HAVING এ</strong>, দলের হিসাবের সাথে তুলনায়: মোট আয়ের পনেরো শতাংশের বেশি আনা ট্যুর।
                </ListItem>
                <ListItem>
                  <strong>CASE আর ORDER BY তে</strong>: গড়ের উপরে না নিচে, সেই লেবেল; গড়ের সবচেয়ে কাছের ট্যুর আগে।
                </ListItem>
                <ListItem>
                  <strong>হিসাবের ভেতরে</strong>: দুটো Subquery এর বিয়োগ, ভাগ, বা COALESCE এর ভেতর।
                </ListItem>
                <ListItem>
                  <strong>FROM ছাড়া একটা SELECT এ</strong>: আলাদা আলাদা Table থেকে কয়েকটা সংখ্যা এক Row তে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষেরটা দেখতে সবচেয়ে সহজ, আর কাজেও লাগে প্রচুর। Module 05 এ আপনি এক Table এর হিসাব এক Row তে
                দেখেছেন। এখানে প্রতিটা সংখ্যা আলাদা Table থেকে আসছে, অথচ একটাও JOIN নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="FROM ছাড়া SELECT, প্রতিটা Column একটা Subquery"
              query={`SELECT (SELECT count(*) FROM tours)     AS tours,
       (SELECT count(*) FROM customers) AS customers;

SELECT (SELECT max(price_bdt) FROM tours)
     - (SELECT min(price_bdt) FROM tours) AS price_range;`}
              caption="প্রথম Statement এ দুটো আলাদা Table থেকে 9 আর 15, এক Row তে। দ্বিতীয়টায় দুটো Subquery এর বিয়োগ: সবচেয়ে দামি 32000.00 থেকে সবচেয়ে সস্তা 3500.00 বাদ দিলে 28500.00। দুটো Subquery ই একটা করে মান, তাই তাদের যোগ বিয়োগ চলে সাধারণ সংখ্যার মতো।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "inner-runs-first",
      subHeader: { index: "004", title: "Inner Runs First" },
      title: <SectionTitle>ভেতরেরটা আগে, আর একবারই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের সব Subquery একটা বিশেষ ধরনের: ভেতরের Query বাইরের Query এর কোনো Column এর দিকে তাকায় না।{" "}
                <code className={CODE}>(SELECT avg(price_bdt) FROM tours)</code> জানে না বাইরের Query এখন কোন ট্যুর দেখছে,
                জানার দরকারও নেই। সব ট্যুরের গড় সবসময় একই। এই ধরনকে বলে Uncorrelated Subquery, মানে বাইরের সাথে জড়িত না।
              </ContentParagraph>
              <ContentParagraph>
                যেহেতু তার উত্তর বাইরের কোনো Row এর ওপর নির্ভর করে না, Database তাকে একবারই চালায়, বাইরের Query শুরু
                হওয়ার আগে। তারপর সেই একটা মান নিয়ে বাইরের Query নয়টা ট্যুরের প্রতিটা দেখে। গড়টা নয়বার হিসাব হয় না,
                একবার হয়। নিচের ছবিতে বাম দিকে প্রথম ধাপ, ডান দিকে দ্বিতীয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoStepsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Database নিজেও এটা বলে দেয়, যদি জিজ্ঞেস করেন। Module 13 এ আপনি EXPLAIN ভালো করে পড়তে শিখবেন, আপাতত শুধু
              একটা শব্দ খুঁজুন: InitPlan। এর মানে “শুরুতেই একবার চালানো পরিকল্পনা”।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Database এর পরিকল্পনা: InitPlan"
              query={`EXPLAIN (COSTS OFF)
SELECT title FROM tours
WHERE price_bdt > (SELECT avg(price_bdt) FROM tours);`}
              caption="পাঁচ লাইনের পরিকল্পনা। নিচে InitPlan 1: tours এর ওপর একটা Aggregate, মানে গড় বানানো, একবার। উপরে বাইরের Seq Scan, যার Filter এ লেখা price_bdt > (InitPlan 1).col1, মানে প্রতিটা Row কে সেই একটা উত্তরের সাথে তুলনা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SubqueryStepLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উপরের Lab এর আসল শিক্ষা",
          content: (
            <ContentParagraph>
              “শুধু চালু ট্যুর” বাছলে ভেতরের আর বাইরের, দুই Query তেই <code className={CODE}>is_active</code> এর শর্ত
              বসে। ভেতরেরটায় না বসালে বন্ধ Luxury Stay এর 32000 গড়টাকে টেনে উপরে তোলে, আর একটা চালু ট্যুর অকারণে
              “গড়ের নিচে” পড়ে যায়। Subquery লেখার সময় প্রতিবার নিজেকে জিজ্ঞেস করুন: গড়টা কাদের গড় হওয়া উচিত?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "in-where",
      subHeader: { index: "005", title: "In WHERE" },
      title: <SectionTitle>শর্তের ডান দিকে একটা জীবন্ত সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Scalar Subquery এর সবচেয়ে চেনা জায়গা WHERE। একটা Column কে এমন একটা মানের সাথে তুলনা করা, যেটা নিজেই
                Data থেকে বের হয়: গড়, সবচেয়ে বড়, সবচেয়ে ছোট, সবচেয়ে নতুন। Marketing এর প্রিমিয়াম পাতার সঠিক রূপটা
                দেখুন, যেখানে গড় আর তালিকা দুটোই শুধু চালু ট্যুর থেকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রিমিয়াম পাতা: চালু ট্যুরের গড়ের চেয়ে দামি চালু ট্যুর"
              query={`SELECT round(avg(price_bdt), 2) AS active_avg
FROM tours WHERE is_active;

SELECT title, price_bdt
FROM tours
WHERE is_active
  AND price_bdt > (SELECT avg(price_bdt) FROM tours WHERE is_active)
ORDER BY price_bdt DESC;`}
              caption="চালু আটটা ট্যুরের গড় 11162.50। এবারও চারটা ট্যুর, কিন্তু অন্য চারটা: Sundarbans, Family Package, Bandarban আর Saint Martin Island Escape। বন্ধ Luxury Stay বাদ পড়ায় Island Escape এর 12500 এবার গড়ের উপরে।"
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
                  বাজেট পাতার জন্য উল্টো তালিকা: যেসব ট্যুরের দাম সব ট্যুরের গড় দামের চেয়ে কম, তাদের{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>, সবচেয়ে সস্তাটা আগে।
                  গড়টা হাতে লিখবেন না।
                </>
              }
              hint={
                <>
                  তুলনার ডান দিকে <code className={CODE}>(SELECT avg(price_bdt) FROM tours)</code>, চিহ্নটা{" "}
                  <code className={CODE}>&lt;</code>, আর শেষে <code className={CODE}>ORDER BY price_bdt</code>।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt < (SELECT avg(price_bdt) FROM tours)
ORDER BY price_bdt;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তুলনার মানটা গড়ই হতে হবে এমন না। max() দিয়ে “সবচেয়ে নতুন” খুঁজে সেই Row টা আনা যায়, তারপর তার সাথে
              JOIN করে বাকি তথ্য। Admin Panel এর “সর্বশেষ Booking” কার্ডটা ঠিক এভাবেই বানানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সর্বশেষ Booking, নাম আর ট্যুর সহ"
              query={`SELECT b.booking_id, c.full_name, t.title, b.booked_at
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
WHERE b.booked_at = (SELECT max(booked_at) FROM bookings);`}
              caption="একটা Row: Booking 24, Shuvo Das, Sylhet Tea Garden Tour, 2026-10-14 11:05:00+06। ভেতরের Query শুধু সময়টা খুঁজেছে, বাইরের Query সেই সময়ের Booking টা চার Table জুড়ে সাজিয়েছে। Subquery আর JOIN একসাথে চলে, কোনো বাধা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পরের রওনা: আজকের পরের প্রথম তারিখ"
              query={`SELECT d.departure_id, t.title, d.starts_on, d.seats_left
FROM departures d
JOIN tours t ON t.tour_id = d.tour_id
WHERE d.starts_on = (SELECT min(starts_on)
                     FROM departures
                     WHERE starts_on >= DATE '2026-11-01');`}
              caption="আজ 1 November ধরে নিলে পরের রওনা 14 November, Departure 14, Sylhet Tea Garden Tour, 21টা সিট খালি। ভেতরের Query এর নিজের একটা WHERE আছে, আর সেটা শুধু ভেতরেই খাটে। বাইরের Query দেখে শুধু তার ফেরত দেওয়া তারিখটা।"
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
                  যেসব Booking এ সিটের সংখ্যা সব Booking এর গড় সিটের চেয়ে বেশি, তাদের{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>seats</code>। গড়টা ভগ্নাংশ হলেও
                  কোনো সমস্যা নেই, তুলনাটা ঠিকঠাক হবে।
                </>
              }
              hint={
                <>
                  bookings থেকে, <code className={CODE}>WHERE seats &gt; (SELECT avg(seats) FROM bookings)</code>।
                  গড়টা একা চালিয়ে দেখুন, প্রায় 2.21।
                </>
              }
              solution={`SELECT booking_id, seats
FROM bookings
WHERE seats > (SELECT avg(seats) FROM bookings)
ORDER BY booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "in-select",
      subHeader: { index: "006", title: "In SELECT" },
      title: <SectionTitle>প্রতিটা Row এর পাশে পুরো ছবির একটা সংখ্যা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এ একটা দেয়ালে আপনি ধাক্কা খেয়েছেন। <code className={CODE}>SELECT booking_id, avg(total_bdt)
                FROM bookings</code> লিখলে Error আসে, কারণ avg() সব Row কে এক Row তে নামিয়ে আনে, আর তখন booking_id
                কোনটা দেখাবে তার উত্তর নেই। অথচ প্রশ্নটা খুব স্বাভাবিক: প্রতিটা Booking গড়ের চেয়ে কত বেশি বা কম?
              </ContentParagraph>
              <ContentParagraph>
                Scalar Subquery এই দেয়ালটা পার হয়ে যায়। গড়টা হিসাব হয় একটা আলাদা ছোট Query তে, আর তার একটা উত্তর
                প্রতিটা Row এর পাশে একই মান হয়ে বসে। বাইরের Query তে কোনো Aggregate নেই, তাই কোনো Row হারায়ও না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Booking গড়ের চেয়ে কত দূরে"
              query={`SELECT booking_id,
       total_bdt,
       (SELECT round(avg(total_bdt), 2) FROM bookings) AS avg_total,
       total_bdt - (SELECT round(avg(total_bdt), 2) FROM bookings) AS diff
FROM bookings
ORDER BY booking_id
LIMIT 6;`}
              caption="প্রথম ছয়টা Booking। avg_total Column এ সবার পাশে একই 24679.17, আর diff এ প্রতিটার দূরত্ব: Booking 2 গড়ের চেয়ে 25320.83 বেশি, Booking 3 গড়ের চেয়ে 12179.17 কম। একই Subquery দুবার লেখা, তবু দুটোই একবার করে হিসাব হয়, প্রতিটা Row তে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সবচেয়ে কাজের ব্যবহার হলো ভাগের হিসাব: পুরো অংশের কত শতাংশ। মোট আয়টা একটা Subquery, আর প্রতিটা ট্যুরের
              আয়কে তা দিয়ে ভাগ করলেই শতাংশ। Module 06 এর JOIN আর Module 05 এর GROUP BY এর সাথে সে অনায়াসে মিশে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুর মোট আয়ের কত শতাংশ এনেছে"
              query={`SELECT t.title,
       sum(b.total_bdt) AS revenue,
       round(100.0 * sum(b.total_bdt)
             / (SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed'), 1) AS pct
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
ORDER BY revenue DESC;`}
              caption="সাতটা ট্যুর, মোট confirmed আয় 423600.00 এর ভাগে। Saint Martin Island Escape একাই 29.5 শতাংশ, Ratargul মাত্র 2.5। সব শতাংশ যোগ করলে 100.0। লক্ষ করুন, ভেতরের Query এর WHERE status = 'confirmed' আলাদা লিখতে হয়েছে, বাইরের WHERE ভেতরে খাটে না।"
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
                  Finance জানতে চায় প্রতিটা সফল Payment সবচেয়ে বড় Payment এর কত শতাংশ। যেসব Payment এর{" "}
                  <code className={CODE}>status = &apos;paid&apos;</code>, তাদের <code className={CODE}>payment_id</code>,{" "}
                  <code className={CODE}>amount_bdt</code>, আর <code className={CODE}>100 * amount_bdt</code> কে সব
                  Payment এর সবচেয়ে বড় amount দিয়ে ভাগ করে এক দশমিক ঘরে round করা একটা Column।
                </>
              }
              hint={
                <>
                  তৃতীয় Column:{" "}
                  <code className={CODE}>round(100 * amount_bdt / (SELECT max(amount_bdt) FROM payments), 1)</code>।
                  বাইরে <code className={CODE}>WHERE status = &apos;paid&apos;</code>।
                </>
              }
              solution={`SELECT payment_id,
       amount_bdt,
       round(100 * amount_bdt / (SELECT max(amount_bdt) FROM payments), 1) AS pct_of_largest
FROM payments
WHERE status = 'paid'
ORDER BY payment_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "in-having",
      subHeader: { index: "007", title: "In HAVING" },
      title: <SectionTitle>দলের হিসাবকে পুরোটার সাথে মেলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HAVING দলগুলোকে ছাঁকে, দল বানানোর পরে। সেখানেও তুলনার ডান দিকে একটা Scalar Subquery বসতে পারে। তখন
                প্রতিটা দলের হিসাবকে পুরো Data র একটা হিসাবের সাথে মেলানো যায়: “যেসব ট্যুর মোট আয়ের পনেরো শতাংশের বেশি
                এনেছে”, “যেসব Customer গড় Booking এর চেয়ে বেশি খরচ করেছেন”।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মোট আয়ের ১৫ শতাংশের বেশি আনা ট্যুর"
              query={`SELECT t.title, sum(b.total_bdt) AS revenue
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
HAVING sum(b.total_bdt) > (SELECT sum(total_bdt)
                           FROM bookings
                           WHERE status = 'confirmed') * 0.15
ORDER BY revenue DESC;`}
              caption="মোট আয়ের 15 শতাংশ মানে 63540.00। চারটা ট্যুর তার উপরে: Island Escape 125000.00, Cox's Bazar Beach Weekend 93500.00, Sundarbans 90000.00 আর Bandarban 70000.00। Sajek এর 19000.00 আর বাকিরা নিচে। Subquery টা এখানে একটা সংখ্যার সাথে গুণ হয়েছে, কারণ সে নিজেও একটা সংখ্যা।"
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
                  যেসব Customer এর confirmed Booking গুলোর মোট টাকা একটা গড় confirmed Booking এর চেয়ে বেশি, তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর মোট খরচ (<code className={CODE}>spend</code>)। বেশি খরচ
                  আগে; সমান হলে নাম অনুযায়ী।
                </>
              }
              hint={
                <>
                  customers আর bookings JOIN, <code className={CODE}>WHERE b.status = &apos;confirmed&apos;</code>,{" "}
                  <code className={CODE}>GROUP BY c.customer_id, c.full_name</code>, তারপর{" "}
                  <code className={CODE}>HAVING sum(b.total_bdt) &gt; (SELECT avg(total_bdt) FROM bookings WHERE status =
                  &apos;confirmed&apos;)</code>।
                </>
              }
              solution={`SELECT c.full_name, sum(b.total_bdt) AS spend
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
HAVING sum(b.total_bdt) > (SELECT avg(total_bdt) FROM bookings WHERE status = 'confirmed')
ORDER BY spend DESC, c.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "case-and-order",
      subHeader: { index: "008", title: "CASE and ORDER BY" },
      title: <SectionTitle>লেবেল আর সাজানোয় একটা মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Module 03 এর CASE এ আপনি দামের স্তর বানিয়েছিলেন হাতে লেখা সীমা দিয়ে, যেমন 10000। সীমাটা যদি Data থেকে
              আসে, তাহলে লেবেলটাও Data র সাথে বদলায়। ORDER BY তেও একই কথা: গড় থেকে দূরত্ব একটা হিসাব, আর হিসাব দিয়ে
              সাজানো যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড়ের উপরে না নিচে, CASE এ"
              query={`SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt > (SELECT avg(price_bdt) FROM tours WHERE is_active)
           THEN 'above average'
         ELSE 'at or below'
       END AS band
FROM tours
WHERE is_active
ORDER BY price_bdt;`}
              caption="আটটা চালু ট্যুর। প্রথম চারটা at or below, Sajek এর 9500.00 পর্যন্ত। Island Escape এর 12500.00 থেকে শুরু করে বাকি চারটা above average। সীমাটা 11162.50, কিন্তু Query তে কোথাও লেখা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গড় দামের সবচেয়ে কাছের তিনটা ট্যুর"
              query={`SELECT title,
       price_bdt,
       abs(price_bdt - (SELECT avg(price_bdt) FROM tours)) AS distance
FROM tours
ORDER BY distance
LIMIT 3;`}
              caption="Bandarban 14000.00, গড় থেকে প্রায় 522 টাকা দূরে; তারপর Island Escape প্রায় 978, Family Package প্রায় 2022। abs() মানে দূরত্বের চিহ্ন বাদ, উপরে বা নিচে যেদিকেই হোক। Marketing এর “আমাদের সাধারণ দামের ট্যুর” বাক্সের জন্য এটাই।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "zero-rows-null",
      subHeader: { index: "009", title: "Zero Rows Means NULL" },
      title: <SectionTitle>কিছু না পেলে Error না, NULL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা প্রশ্ন, যেটা প্রথমবার শুনলে অবাক লাগে: ভেতরের Query যদি একটাও Row না পায়, তাহলে কী হয়? ধরুন
                আপনি tour_id 99 এর দাম চাইলেন, যে ট্যুর নেই। অনেকে ভাবেন Error আসবে। আসে না। PostgreSQL এর Documentation
                এ পরিষ্কার লেখা: কোনো Row না এলে Error নেই, ফলাফলটা NULL ধরা হয়।
              </ContentParagraph>
              <ContentParagraph>
                আর Module 03 এ আপনি দেখেছেন NULL এর সাথে তুলনা কেমন আচরণ করে। <code className={CODE}>price_bdt &gt;
                NULL</code> সত্যিও না, মিথ্যাও না, অজানা। WHERE শুধু সত্যিকে রাখে, তাই ফলাফল খালি। কোনো সতর্কবার্তা ছাড়াই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নেই এমন ট্যুরের দাম"
              query={`SELECT (SELECT price_bdt FROM tours WHERE tour_id = 99) AS missing;

SELECT count(*)
FROM tours
WHERE price_bdt > (SELECT price_bdt FROM tours WHERE tour_id = 99);`}
              caption="প্রথম Statement এ একটা Row, ঘরটা NULL। দ্বিতীয়টায় count 0: নয়টা ট্যুরের একটাও NULL এর চেয়ে দামি হতে পারেনি। Error থাকলে অন্তত টের পেতেন; এখানে শুধু একটা ফাঁকা উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা কারণেও Subquery NULL দিতে পারে: Row আছে, কিন্তু তার মানটাই NULL। Ratargul Swamp Boat Day এর এখনো
              Guide ঠিক হয়নি, তাই তার guide_id NULL। “Ratargul এর Guide যে, সে আর কোন ট্যুরে যায়” প্রশ্নের উত্তরও তাই
              খালি। বাইরে থেকে দুটো ঘটনা একই রকম দেখায়, একটা NULL।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Row আছে, মান NULL"
              query={`SELECT (SELECT guide_id FROM tours WHERE tour_id = 7) IS NULL AS guide_is_null;

SELECT title, guide_id
FROM tours
WHERE guide_id = (SELECT guide_id FROM tours WHERE tour_id = 7);`}
              caption="প্রথমটায় t: Ratargul এর guide_id সত্যিই NULL। দ্বিতীয়টায় 0 Row, কারণ guide_id = NULL কোনো Row এর জন্যই সত্যি না, এমনকি Ratargul এর নিজের জন্যও না। Module 03 এর NULL লেসনের নিয়মই এখানে খাটছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              NULL যদি দেখাতে না চান, Module 04 এর COALESCE আছে। পুরো Subquery টাকে COALESCE এর প্রথম মান হিসেবে দিন,
              দ্বিতীয় মান হিসেবে যা দেখাতে চান। তবে মনে রাখবেন, NULL কে 0 বানালে প্রশ্নের মানেও বদলায়: “জানি না” আর
              “শূন্য” এক কথা না।
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
                  একটা Column এর নাম <code className={CODE}>price</code>: tour_id 99 এর দাম, আর সেই ট্যুর না থাকলে 0।
                  FROM ছাড়া একটা SELECT এ লিখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>COALESCE((SELECT price_bdt FROM tours WHERE tour_id = 99), 0)</code>। ভেতরের
                  Subquery র নিজের বন্ধনী আর COALESCE এর বন্ধনী, দুটোই লাগবে।
                </>
              }
              solution={`SELECT COALESCE((SELECT price_bdt FROM tours WHERE tour_id = 99), 0) AS price;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "more-than-one-row",
      subHeader: { index: "010", title: "More Than One Row" },
      title: <SectionTitle>দুটো উত্তর এলে Database থেমে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টো সমস্যা। ভেতরের Query দুটো বা তার বেশি Row ফেরত দিলে কী হবে? ধরুন আপনি লিখলেন, “Saint
                Martin এর ট্যুরের দামের সমান দামের ট্যুর”। কিন্তু Saint Martin এ ট্যুর দুটো, 12500.00 আর 32000.00।
                একটা ঘরে কোন দামটা বসবে? Database এর কাছে এর কোনো উত্তর নেই, আর সে অনুমানও করে না। সে থেমে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Sundarbans এ চলে, Saint Martin এ ভাঙে"
              query={`SELECT title FROM tours
WHERE price_bdt = (SELECT price_bdt FROM tours WHERE destination_id = 3);

SELECT title FROM tours
WHERE price_bdt = (SELECT price_bdt FROM tours WHERE destination_id = 1);`}
              caption="প্রথম Statement চলে, এক Row: Sundarbans Mangrove Cruise, কারণ Sundarbans এ ট্যুর একটাই। দ্বিতীয়টা হুবহু একই গড়ন, শুধু Destination বদল, আর আসে ERROR: more than one row returned by a subquery used as an expression। এই Error কোনো লাইনে Caret দেখায় না, কারণ লেখায় কোনো ভুল নেই, ভুলটা Data তে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই Error এর SQLSTATE 21000, যার শ্রেণির নাম Cardinality Violation, মানে সংখ্যার নিয়ম ভাঙা। এর সবচেয়ে
                বিপজ্জনক দিকটা উপরের দুটো Statement এ লুকিয়ে আছে। লেখাটা ভুল না, তাই Query টা আজ চলতে পারে। যেদিন
                Sundarbans এ দ্বিতীয় একটা ট্যুর যোগ হবে, সেদিন একই Query হঠাৎ Error দিতে শুরু করবে। কোড কেউ ছোঁয়নি, শুধু
                Data বদলেছে। Production এ এই ধরনের Error সাধারণত রাতে আসে, নতুন Data ঢোকার পরে।
              </ContentParagraph>
              <ContentParagraph>
                তাই Scalar Subquery লেখার সময় নিজেকে একটা প্রশ্ন করুন: কী নিশ্চিত করছে যে এখানে সবসময় ঠিক একটা Row
                আসবে? ভালো উত্তর তিনটা: একটা Aggregate (max, min, avg, count, sum), যারা সবসময় একটা Row দেয়; একটা Primary
                Key বা UNIQUE Column এর ওপর সমান শর্ত, যেমন tour_id = 3; অথবা ORDER BY সহ LIMIT 1। “এখন পর্যন্ত একটাই
                আছে” কোনো উত্তর না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ResultShapesDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আকারের আরেকটা নিয়ম আছে: Column ও একটাই হতে হবে। ভেতরের Query দুটো Column ফেরত দিলে Row একটা হলেও চলবে
              না, কারণ একটা ঘরে দুটো জিনিস বসে না। এই Error টা আলাদা, আর এটা Data চালানোর আগেই ধরা পড়ে, লেখার সময়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Row, কিন্তু দুটো Column"
              query={`SELECT title,
       (SELECT price_bdt, title FROM tours WHERE tour_id = 1) AS top
FROM tours;`}
              caption="ERROR: subquery must return only one column, আর Caret বসে ভেতরের SELECT এর শুরুতে। এর SQLSTATE 42601, Syntax Error এর শ্রেণি, কারণ Query টা চালানোর আগেই ভুলটা ধরা যায়। আগেরটা ছিল চালানোর সময়ের Error, এটা লেখার Error।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ShapeLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "fixes",
      subHeader: { index: "011", title: "MAX, MIN or LIMIT 1" },
      title: <SectionTitle>একটা উত্তরে নামানো, আর তাতে প্রশ্ন কীভাবে বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুটো Row এর Error সারানোর তিনটা চেনা উপায় আছে। তিনটাই কাজ করে, কিন্তু তিনটার মানে আলাদা। তাই সারানোর
                আগে ঠিক করুন আপনি আসলে কী জানতে চেয়েছিলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>max()</strong>: দুটো দামের বড়টা। প্রশ্ন হয়ে যায় “সবচেয়ে দামি Saint Martin ট্যুরের চেয়ে দামি
                  কারা”।
                </ListItem>
                <ListItem>
                  <strong>min()</strong>: ছোটটা। প্রশ্ন হয় “সবচেয়ে সস্তা Saint Martin ট্যুরের চেয়ে দামি কারা”, যার উত্তর
                  একেবারে আলাদা।
                </ListItem>
                <ListItem>
                  <strong>ORDER BY ... LIMIT 1</strong>: সাজিয়ে প্রথমটা। max() এর মতোই কাজ করে, তবে এটা পুরো একটা Row
                  বাছতে পারে, শুধু একটা মান না। ORDER BY ছাড়া LIMIT 1 দিলে কোনটা আসবে তার কোনো কথা নেই, Module 03 মনে
                  করুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর যদি আপনি আসলে বোঝাতে চান “দুটোর যেকোনো একটার সমান”, তাহলে উত্তর এর কোনোটাই না। সেটা{" "}
                <code className={CODE}>IN (SELECT ...)</code>, যেটা পরের লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="max() আর min(): একই দুটো দাম, দুটো আলাদা প্রশ্ন"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT max(price_bdt) FROM tours WHERE destination_id = 1);

SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT min(price_bdt) FROM tours WHERE destination_id = 1)
ORDER BY price_bdt DESC;`}
              caption="max() দিয়ে 0 Row: 32000.00 এর চেয়ে দামি কোনো ট্যুর নেই, Luxury Stay নিজেই সবচেয়ে দামি। min() দিয়ে চারটা: Luxury Stay, Sundarbans, Family Package আর Bandarban, যারা 12500.00 এর চেয়ে দামি। Error দুই ক্ষেত্রেই নেই, কিন্তু উত্তর সম্পূর্ণ আলাদা। কোনটা ঠিক, সেটা SQL বলতে পারে না, প্রশ্নটা পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              max() আর LIMIT 1 এর একটা সূক্ষ্ম পার্থক্য ধরা পড়ে সমান মানের বেলায়। reviews এ সর্বোচ্চ rating 5, আর
              চারটা Review এর rating 5। “rating যার max এর সমান” চারটাই আনে। “rating অনুযায়ী সাজিয়ে প্রথমটা” ঠিক একটা
              আনে। কোনটা চাইছেন, সেটা আগে জানুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MaxVsLimitSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সমান হলে: max() সবাইকে, LIMIT 1 একজনকে"
              query={`SELECT review_id, booking_id, rating
FROM reviews
WHERE rating = (SELECT max(rating) FROM reviews)
ORDER BY review_id;

SELECT review_id, booking_id, rating
FROM reviews
ORDER BY rating DESC, review_id
LIMIT 1;`}
              caption="প্রথমটায় চারটা Review: 1, 3, 5 আর 8, সবার rating 5। দ্বিতীয়টায় একটাই, Review 1। ORDER BY তে review_id যোগ করা হয়েছে টাই ভাঙার জন্য; এটা না দিলে চারটার যেকোনোটা আসতে পারত, আর আজ যেটা আসে কাল সেটাই আসবে এমন কোনো কথা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              starter={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT price_bdt FROM tours WHERE destination_id = 2)
ORDER BY price_bdt DESC;`}
              task={
                <>
                  নিচের Query টা Error দেয়, কারণ Cox&apos;s Bazar (destination_id 2) এ ট্যুর দুটো। Marketing আসলে
                  জানতে চায়: Cox&apos;s Bazar এর সবচেয়ে দামি ট্যুরের চেয়েও দামি ট্যুর কোনগুলো। Query টা সারিয়ে{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code> দিন, দামি আগে।
                </>
              }
              hint={
                <>
                  “সবচেয়ে দামি” মানে <code className={CODE}>max(price_bdt)</code>। ভেতরের SELECT এ শুধু Column টার
                  জায়গায় max() বসান।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT max(price_bdt) FROM tours WHERE destination_id = 2)
ORDER BY price_bdt DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "correlated-glimpse",
      subHeader: { index: "012", title: "A Glimpse of Correlated" },
      title: <SectionTitle>যে Subquery বাইরের দিকে তাকায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ সব Subquery ছিল স্বাধীন: বাইরের Query কোন Row দেখছে, তাতে তাদের কিছু যায় আসে না। কিন্তু Scalar
                Subquery চাইলে বাইরের Row এর একটা Column পড়তে পারে। তখন তার উত্তর প্রতিটা Row তে আলাদা হয়, আর তাকে
                প্রতিটা Row এর জন্য নতুন করে চালাতে হয়। এই ধরনের নাম Correlated Subquery।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query তে ভেতরের WHERE এ <code className={CODE}>c.customer_id</code> আছে, যেটা বাইরের customers এর
                Column। তাই প্রতিটা Customer এর জন্য ভেতরের Query তাঁর নিজের Booking গোনে। এর পুরো গল্প, কখন সে ধীর হয়
                আর কীভাবে তাকে JOIN বা Window Function এ বদলাতে হয়, আছে এই মডিউলের{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  Lesson 03
                </Link>{" "}
                এ। আজ শুধু চিনে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর নিজের Booking সংখ্যা"
              query={`SELECT c.full_name,
       (SELECT count(*)
        FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c
ORDER BY bookings DESC, c.full_name
LIMIT 5;`}
              caption="Rahim Uddin 3টা, তারপর Farhana, Mitu, Nusrat আর Oliver দুটো করে। এখানে ভেতরের Query একবার চলে না, প্রতিটা Customer এর জন্য একবার, কারণ c.customer_id প্রতিবার বদলায়। এটাই Uncorrelated আর Correlated এর মূল তফাত।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই নিয়ম, অন্য নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি যে MySQL ভিডিও দেখছেন, সেখানে Subquery র অংশটা এই লেসনের সাথে প্রায় হুবহু মিলবে। Scalar Subquery র
              লেখা, আচরণ আর ফলাফল দুই Database এ একই। আলাদা শুধু Error এর নম্বর আর লেখা। নিচের প্রতিটা সারি MySQL 8.4
              তে চালিয়ে দেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অবস্থা", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["গড়ের চেয়ে দামি ট্যুর", "4 Row", "একই 4 Row"],
            ["কোনো Row নেই", "NULL, Error নেই", "NULL, Error নেই"],
            [
              "একাধিক Row",
              "ERROR: more than one row returned by a subquery used as an expression (21000)",
              "ERROR 1242 (21000): Subquery returns more than 1 row",
            ],
            [
              "একাধিক Column",
              "ERROR: subquery must return only one column (42601)",
              "ERROR 1241 (21000): Operand should contain 1 column(s)",
            ],
            ["FROM ছাড়া SELECT এ কয়েকটা Subquery", "চলে", "চলে"],
            ["Subquery র ভেতরে ORDER BY ... LIMIT 1", "চলে", "চলে"],
            ["HAVING এ Subquery", "চলে", "চলে, একই 4 ট্যুর"],
            ["LIMIT এর সংখ্যা হিসেবে Subquery", "চলে", "চলে না, LIMIT শুধু লেখা সংখ্যা নেয়"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "শেষ সারিটা কোথা থেকে",
          content: (
            <ContentParagraph>
              MySQL 8.4 এর Documentation এ “The Subquery as Scalar Operand” পাতায় লেখা আছে যে যেখানে শুধু একটা লেখা
              মান চলে, যেমন LIMIT, সেখানে Subquery দেওয়া যায় না। PostgreSQL এ <code className={CODE}>LIMIT (SELECT
              count(*) ...)</code> চলে, এই লেসন লেখার সময় চালিয়ে দেখা। দুই Database এ একই কোড চালাতে চাইলে LIMIT এ
              Subquery এড়িয়ে চলুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Admin Panel এর উপরের সারির কার্ডগুলো</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Admin Panel খুললে উপরে একসারি ছোট কার্ড: মোট Customer, কতজন এখনো কিছু বুক করেননি,
                কতগুলো Booking pending, মোট confirmed আয়, আর পরের রওনা কবে। প্রতিটা কার্ড আলাদা Table এর আলাদা একটা
                প্রশ্ন, আর প্রতিটার উত্তর ঠিক একটা মান।
              </ContentParagraph>
              <ContentParagraph>
                এই রকম Page এর জন্য Scalar Subquery প্রায় আদর্শ। পাঁচটা আলাদা Query পাঠালে App কে Database এর সাথে
                পাঁচবার কথা বলতে হয়, Module 01 এর Lesson 06 এ দেখেছেন প্রতিটা কথার একটা খরচ আছে। একটা FROM ছাড়া SELECT
                এ পাঁচটা Subquery মানে একবার কথা, এক Row উত্তর, আর App এর কাজ শুধু পাঁচটা ঘর পড়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Query তে Admin Panel এর পাঁচ কার্ড"
              query={`SELECT (SELECT count(*) FROM customers)                        AS customers,
       (SELECT count(*) FROM tours WHERE is_active)               AS active_tours,
       (SELECT count(*) FROM bookings WHERE status = 'pending')   AS pending,
       (SELECT sum(amount_bdt) FROM payments WHERE status = 'paid') AS paid_bdt,
       (SELECT round(avg(rating), 2) FROM reviews)                AS avg_rating;`}
              caption="এক Row: 15 জন Customer, 8টা চালু ট্যুর, 4টা pending Booking, 423600.00 টাকা Payment এসেছে, আর গড় rating 4.10। পাঁচটা আলাদা Table, একটাও JOIN নেই, কারণ কাউকে কারো সাথে জোড়া লাগানোর দরকারই নেই।"
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
                  ফারুক সাহেব তাঁর নিজের কার্ডের সারি চান, এক Row তে পাঁচটা Column, এই ক্রমে:{" "}
                  <code className={CODE}>customers</code> (মোট Customer),{" "}
                  <code className={CODE}>never_booked</code> (যাঁদের একটাও Booking নেই, মোট Customer থেকে Booking থাকা
                  আলাদা Customer এর সংখ্যা বাদ দিয়ে), <code className={CODE}>pending</code> (pending Booking),{" "}
                  <code className={CODE}>confirmed_revenue</code> (confirmed Booking এর মোট total_bdt), আর{" "}
                  <code className={CODE}>next_departure</code> (1 November 2026 বা তার পরের প্রথম রওনার তারিখ)।
                </>
              }
              hint={
                <>
                  FROM ছাড়া একটা SELECT। never_booked হলো দুটো Subquery র বিয়োগ:{" "}
                  <code className={CODE}>(SELECT count(*) FROM customers) - (SELECT count(DISTINCT customer_id) FROM
                  bookings)</code>। next_departure এ{" "}
                  <code className={CODE}>min(starts_on)</code> আর <code className={CODE}>starts_on &gt;= DATE
                  &apos;2026-11-01&apos;</code>।
                </>
              }
              solution={`SELECT (SELECT count(*) FROM customers) AS customers,
       (SELECT count(*) FROM customers)
         - (SELECT count(DISTINCT customer_id) FROM bookings) AS never_booked,
       (SELECT count(*) FROM bookings WHERE status = 'pending') AS pending,
       (SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed') AS confirmed_revenue,
       (SELECT min(starts_on) FROM departures WHERE starts_on >= DATE '2026-11-01') AS next_departure;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো Scalar Subquery লেখার ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নের ভেতরের প্রশ্নটা খুঁজুন",
              description:
                "“গড়ের চেয়ে দামি”, “সর্বশেষ”, “মোটের কত শতাংশ”: এমন শব্দ শুনলেই বুঝবেন একটা আলাদা হিসাব লাগবে, যার উত্তর একটা মান।",
            },
            {
              title: "ভেতরের Query টা একা লিখে চালান",
              description:
                "আগে শুধু সেটা লিখুন, যেমন SELECT avg(price_bdt) FROM tours WHERE is_active। চালিয়ে দেখুন ঠিক একটা Row আর একটা Column আসছে কিনা।",
            },
            {
              title: "কাদের হিসাব, সেটা মিলিয়ে নিন",
              description:
                "ভেতরের WHERE বাইরের WHERE থেকে আলাদা। বাইরে is_active থাকলে ভেতরেও লাগবে কিনা ভাবুন, নইলে গড় অন্য দলের গড় হয়ে যায়।",
            },
            {
              title: "সবসময় একটা Row, সেটা নিশ্চিত করুন",
              description:
                "Aggregate, Primary Key এর ওপর সমান শর্ত, বা ORDER BY সহ LIMIT 1। “এখন একটাই আছে” যথেষ্ট না, কাল দুটো হতে পারে।",
            },
            {
              title: "বন্ধনীতে মুড়ে মানের জায়গায় বসান",
              description:
                "WHERE এর ডান দিকে, SELECT এর একটা Column হয়ে, HAVING এ, CASE বা ORDER BY তে। বন্ধনী বাদ দেওয়া যায় না।",
            },
            {
              title: "শূন্য Row হলে কী হবে, ভেবে রাখুন",
              description:
                "Row না এলে মান NULL, আর NULL এর সাথে তুলনা কিছুই ফেরত দেয় না। দরকার হলে COALESCE, কিন্তু NULL আর 0 এর মানে আলাদা।",
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
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "গড় বা সীমা হাতে লিখে রাখা",
              "Data বদলালে Query পুরনো হয়ে যায়, কোনো Error ছাড়াই",
              "সংখ্যার জায়গায় Scalar Subquery",
            ],
            [
              "যে Subquery একাধিক Row দিতে পারে, তাকে = বা > এর পাশে বসানো",
              "আজ চলে, যেদিন দুটো Row আসে সেদিন ERROR 21000",
              "Aggregate, Primary Key এর শর্ত, বা ORDER BY সহ LIMIT 1",
            ],
            [
              "ভেতরের WHERE ভুলে যাওয়া",
              "বন্ধ ট্যুর বা বাতিল Booking গড়ে ঢুকে উত্তর বদলে দেয়",
              "ভেতরের আর বাইরের শর্ত আলাদা করে মিলিয়ে নিন",
            ],
            [
              "শূন্য Row কে Error ভাবা",
              "NULL আসে, তুলনা কিছু ফেরত দেয় না, কেউ টের পায় না",
              "ভেতরের Query একা চালিয়ে দেখুন; দরকার হলে COALESCE",
            ],
            [
              "ভেতরের SELECT এ দুটো Column লেখা",
              "ERROR: subquery must return only one column",
              "একটা মান বাছুন, পুরো Row লাগলে JOIN বা Derived Table",
            ],
            [
              "ORDER BY ছাড়া LIMIT 1",
              "যেকোনো একটা Row, প্রতিবার আলাদা হতে পারে",
              "ORDER BY আর একটা টাই ভাঙার Column, যেমন id",
            ],
            [
              "max() আর min() গুলিয়ে ফেলা",
              "Error নেই, কিন্তু সম্পূর্ণ অন্য প্রশ্নের উত্তর",
              "Subquery টা বাংলায় পড়ে নিন: সবচেয়ে দামি না সবচেয়ে সস্তা?",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়ার আর দেখার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES"
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer">
                  PostgreSQL: Scalar Subqueries
                </a>
                : অফিসিয়াল সংজ্ঞা, ছোট্ট এক অনুচ্ছেদে। এক Row আর এক Column এর নিয়ম, আর শূন্য Row হলে NULL, দুটোই এখানে
                লেখা।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-subquery.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Subquery Expressions
                </a>
                : EXISTS, IN, ANY আর ALL, যেগুলো পরের লেসনের বিষয়। এখনই একবার চোখ বুলিয়ে রাখলে পরেরটা সহজ হবে।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/scalar-subqueries.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: The Subquery as Scalar Operand
                </a>
                : MySQL এর দিক থেকে একই ধারণা, আর কোথায় Subquery বসানো যায় না তার কথা।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/subquery-errors.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Subquery Errors
                </a>
                : ERROR 1241 আর 1242 সহ MySQL এর Subquery সম্পর্কিত সব Error, উদাহরণ সহ।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Correlated_subquery" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: Correlated subquery
                </a>
                : Lesson 03 এর আগে একটু পড়ে রাখার মতো, Uncorrelated এর সাথে তুলনা সহ।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার দেখা SQL Course, Subqueries অংশ (02:53:54 থেকে)
                </a>
                : MySQL দিয়ে Subquery। এই লেসনের Query গুলো সেখানে প্রায় হুবহু চলবে, শুধু Error এর নম্বর আলাদা।
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  Scalar Subquery বন্ধনীর ভেতরের একটা SELECT, যে ঠিক একটা Row আর একটা Column ফেরত দেয়। হাতে লেখা
                  সংখ্যার বদলে প্রশ্নটাই লিখে দেয়, তাই উত্তর কখনো পুরনো হয় না।
                </ListItem>
                <ListItem>
                  যেখানে একটা মান বসে, সেখানে সে বসে: WHERE, SELECT, HAVING, CASE, ORDER BY, হিসাবের ভেতর, আর FROM ছাড়া
                  SELECT এ।
                </ListItem>
                <ListItem>
                  বাইরের কোনো Column না পড়লে সে Uncorrelated: আগে চলে, একবারই চলে। EXPLAIN এ তার নাম InitPlan।
                </ListItem>
                <ListItem>
                  ভেতরের WHERE শুধু ভেতরে খাটে। গড়টা কাদের গড়, সেটা প্রতিবার আলাদা করে ঠিক করুন।
                </ListItem>
                <ListItem>
                  শূন্য Row মানে NULL, Error না। আর NULL এর সাথে তুলনা কিছুই ফেরত দেয় না।
                </ListItem>
                <ListItem>
                  একাধিক Row মানে ERROR 21000, MySQL এ 1242। আজ না হলেও কাল, যেদিন Data বদলায়। একাধিক Column মানে লেখার
                  সময়েই Error।
                </ListItem>
                <ListItem>
                  max(), min() আর ORDER BY ... LIMIT 1 তিনটাই একটা উত্তরে নামায়, কিন্তু প্রতিটা আলাদা প্রশ্ন। সমান মানে
                  max() সবাইকে রাখে, LIMIT 1 একজনকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা Subquery একটা মান দিয়েছে। কিন্তু অনেক প্রশ্নের ভেতরের উত্তর একটা তালিকা: “যেসব
                Customer confirmed Booking করেছেন”, “যেসব ট্যুরের Guide আছে”। পরের লেসনে{" "}
                <Link href="/sql/topic/in-exists-any-all" className={LINK}>
                  IN, EXISTS, ANY and ALL
                </Link>{" "}
                এ আপনি দেখবেন একটা পুরো তালিকার সাথে কীভাবে তুলনা করা যায়, আর সেই তালিকায় একটা NULL থাকলে NOT IN কেন
                সবকিছু হারিয়ে ফেলে।
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
      ["Scalar Subquery", "এক Row, এক Column ফেরত দেওয়া ভেতরের SELECT", "(SELECT avg(price_bdt) FROM tours)"],
      ["Inner আর Outer Query", "বন্ধনীর ভেতরেরটা আর যার ভেতরে সে বসে", "গড় বের করা আর ট্যুর বাছা"],
      ["কোথায় বসে", "যেখানে একটা মান বসতে পারে", "WHERE, SELECT, HAVING, CASE, ORDER BY"],
      ["FROM ছাড়া SELECT", "কয়েকটা Table এর একক হিসাব এক Row তে", "Admin Panel এর পাঁচ কার্ড"],
      ["Uncorrelated", "বাইরের দিকে তাকায় না, একবার চলে", "EXPLAIN এ InitPlan 1"],
      ["ভেতরের WHERE", "শুধু ভেতরে খাটে", "চালু ট্যুরের গড় 11162.50"],
      ["শূন্য Row", "Error না, মান NULL", "tour_id 99, count 0"],
      ["NULL মান", "Row আছে, মান NULL, বাইরে একই রকম দেখায়", "Ratargul এর guide_id"],
      ["একাধিক Row", "ERROR 21000, Data বদলালে হঠাৎ আসে", "destination_id 1 এর দুই ট্যুর"],
      ["একাধিক Column", "ERROR 42601, লেখার সময়েই", "price_bdt, title"],
      ["max() বনাম min()", "একই Data, ভিন্ন প্রশ্ন", "0 Row বনাম 4 Row"],
      ["LIMIT 1", "সাজিয়ে প্রথমটা, টাই ভাঙার Column লাগে", "Review 1, rating 5"],
      ["Correlated", "বাইরের Column পড়ে, প্রতিটা Row তে চলে", "প্রতিটা Customer এর Booking সংখ্যা"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Scalar Subquery কে Scalar বলা হয় কেন?",
        options: [
          {
            key: "A",
            text: "কারণ সে সবসময় একটা সংখ্যা ফেরত দেয়",
            isCorrect: false,
            explanation: "সংখ্যা হতেই হবে এমন না। সর্বশেষ booked_at একটা সময়, Guide এর নাম একটা লেখা। মূল কথা একক মান।",
          },
          {
            key: "B",
            text: "কারণ সে ঠিক একটা Row এর একটা Column, মানে একটা মান ফেরত দেয়",
            isCorrect: true,
            explanation: "ঠিক। Scalar মানে একক মান। সেই কারণেই যেখানে একটা মান বসে, সেখানে সে বসতে পারে।",
          },
          {
            key: "C",
            text: "কারণ সে বাইরের Query এর আগে চলে",
            isCorrect: false,
            explanation: "আগে চলা Uncorrelated হওয়ার বৈশিষ্ট্য। Correlated Scalar Subquery প্রতিটা Row তে চলে, তবু সে Scalar।",
          },
          {
            key: "D",
            text: "কারণ তার ভেতরে একটা Aggregate থাকে",
            isCorrect: false,
            explanation: "SELECT price_bdt FROM tours WHERE tour_id = 3 এ কোনো Aggregate নেই, তবু এটা ঠিকঠাক Scalar Subquery।",
          },
        ],
      },
      {
        id: 2,
        text: "WHERE price_bdt > (SELECT avg(price_bdt) FROM tours) Query তে গড়টা কয়বার হিসাব হয়?",
        options: [
          {
            key: "A",
            text: "নয়বার, প্রতিটা ট্যুরের জন্য একবার",
            isCorrect: false,
            explanation: "ভেতরের Query বাইরের কোনো Column পড়ে না, তাই প্রতিটা Row তে তার উত্তর একই। আবার চালানোর কারণ নেই।",
          },
          {
            key: "B",
            text: "একবার, বাইরের Query শুরুর আগে",
            isCorrect: true,
            explanation: "ঠিক। এটা Uncorrelated Subquery, আর EXPLAIN এ সে InitPlan হিসেবে দেখায়, একবার চালানো পরিকল্পনা।",
          },
          {
            key: "C",
            text: "একবারও না, Database আগে থেকে গড় জমিয়ে রাখে",
            isCorrect: false,
            explanation: "Database গড় জমিয়ে রাখে না। প্রতিবার Query চালালে নতুন করে হিসাব হয়, সেজন্যই উত্তর পুরনো হয় না।",
          },
          {
            key: "D",
            text: "Row এর সংখ্যার ওপর নির্ভর করে, অনিশ্চিত",
            isCorrect: false,
            explanation: "Uncorrelated Subquery র ক্ষেত্রে এটা নিশ্চিত: একবার।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT title FROM tours WHERE price_bdt > (SELECT price_bdt FROM tours WHERE tour_id = 99); tour_id 99 নেই। কী হবে?",
        options: [
          {
            key: "A",
            text: "ERROR: no rows returned",
            isCorrect: false,
            explanation: "শূন্য Row এর জন্য কোনো Error নেই। PostgreSQL আর MySQL দুটোই মানটাকে NULL ধরে।",
          },
          {
            key: "B",
            text: "সব নয়টা ট্যুর আসবে",
            isCorrect: false,
            explanation: "তুলনাটা NULL এর সাথে, যেটা কখনো সত্যি হয় না। কোনো Row ই রাখা হয় না।",
          },
          {
            key: "C",
            text: "0 Row, কোনো Error ছাড়া",
            isCorrect: true,
            explanation: "ঠিক। Subquery NULL দেয়, price_bdt > NULL অজানা, আর WHERE শুধু সত্যিকে রাখে। ফলাফল নিঃশব্দে খালি।",
          },
          {
            key: "D",
            text: "ERROR 21000",
            isCorrect: false,
            explanation: "21000 আসে একাধিক Row এলে। এখানে Row একটাও নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Query আজ ঠিকঠাক চলছে। কাল সকালে একই Query দিল “more than one row returned by a subquery used as an expression”, কোড কেউ বদলায়নি। সবচেয়ে সম্ভাব্য কারণ কী?",
        options: [
          {
            key: "A",
            text: "Database এর Version বদলেছে",
            isCorrect: false,
            explanation: "সম্ভব, কিন্তু এই Error এর স্বাভাবিক কারণ Data, Version না।",
          },
          {
            key: "B",
            text: "রাতে নতুন Data ঢুকেছে, আর এখন Subquery টা দুটো বা তার বেশি Row পাচ্ছে",
            isCorrect: true,
            explanation: "ঠিক। লেখায় কোনো ভুল নেই, তাই Query আগে চলত। যেদিন শর্তে দ্বিতীয় একটা Row মিলেছে, সেদিন থেকে Error।",
          },
          {
            key: "C",
            text: "কেউ একটা Column মুছে ফেলেছে",
            isCorrect: false,
            explanation: "তাহলে Error হতো column does not exist, অন্য বার্তা।",
          },
          {
            key: "D",
            text: "Subquery তে দুটো Column লেখা হয়েছে",
            isCorrect: false,
            explanation: "সেটা লেখার সময়েই ধরা পড়ত, আর বার্তা হতো subquery must return only one column।",
          },
        ],
      },
      {
        id: 5,
        text: "Saint Martin (destination_id 1) এ দুটো ট্যুর: 12500 আর 32000। WHERE price_bdt > (SELECT min(price_bdt) FROM tours WHERE destination_id = 1) কী খুঁজছে?",
        options: [
          {
            key: "A",
            text: "সব Saint Martin ট্যুরের চেয়ে দামি ট্যুর",
            isCorrect: false,
            explanation: "সেটা max() দিয়ে লিখতে হতো। min() মানে সবচেয়ে সস্তাটার চেয়ে দামি হলেই চলবে।",
          },
          {
            key: "B",
            text: "সবচেয়ে সস্তা Saint Martin ট্যুরের চেয়ে দামি ট্যুর, মানে 12500 এর বেশি",
            isCorrect: true,
            explanation: "ঠিক। চারটা ট্যুর আসে। max() দিলে প্রশ্ন বদলে যেত, আর উত্তর হতো 0 Row।",
          },
          {
            key: "C",
            text: "Saint Martin এর বাইরের সব ট্যুর",
            isCorrect: false,
            explanation: "Destination এর কোনো শর্ত বাইরের Query তে নেই। Luxury Stay নিজেই Saint Martin এর, আর সেটাও আসে।",
          },
          {
            key: "D",
            text: "Error, কারণ destination_id 1 এ দুটো ট্যুর",
            isCorrect: false,
            explanation: "min() দুটো দামকে একটা মানে নামিয়েছে, তাই Subquery এখন এক Row দেয়। Error আর নেই।",
          },
        ],
      },
      {
        id: 6,
        text: "চারটা Review এর rating 5, যা সর্বোচ্চ। WHERE rating = (SELECT max(rating) FROM reviews) কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "1, কারণ max() একটাই মান দেয়",
            isCorrect: false,
            explanation: "max() একটা মান দেয়, 5। কিন্তু বাইরের WHERE সেই মানের সমান সব Row রাখে, আর এমন Row চারটা।",
          },
          {
            key: "B",
            text: "4",
            isCorrect: true,
            explanation: "ঠিক। সমান মানের সবাই আসে। শুধু একটা চাইলে ORDER BY rating DESC, review_id LIMIT 1।",
          },
          {
            key: "C",
            text: "ERROR 21000, কারণ চারটা Row মেলে",
            isCorrect: false,
            explanation: "Error এর নিয়ম Subquery র ফলাফলের জন্য, বাইরের ফলাফলের জন্য না। Subquery এখানে এক Row দেয়।",
          },
          {
            key: "D",
            text: "10, সব Review",
            isCorrect: false,
            explanation: "rating 4, 3 আর 2 এর Review গুলো 5 এর সমান না, তাই বাদ।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT b.booking_id, (SELECT avg(total_bdt) FROM bookings) FROM bookings b WHERE b.status = 'confirmed'; গড়টা কাদের গড়?",
        options: [
          {
            key: "A",
            text: "শুধু confirmed Booking এর",
            isCorrect: false,
            explanation: "বাইরের WHERE ভেতরের Query তে খাটে না। ভেতরের Query র নিজের কোনো WHERE নেই, তাই সে সব Booking দেখে।",
          },
          {
            key: "B",
            text: "সব 24টা Booking এর, বাতিল আর pending সহ",
            isCorrect: true,
            explanation: "ঠিক। confirmed এর গড় চাইলে ভেতরেও WHERE status = 'confirmed' লিখতে হবে।",
          },
          {
            key: "C",
            text: "প্রতিটা Row এর নিজের total_bdt",
            isCorrect: false,
            explanation: "সেটা হতো যদি ভেতরের Query বাইরের Row এর কোনো Column পড়ত। এখানে পড়ে না।",
          },
          {
            key: "D",
            text: "Error, কারণ SELECT এ Aggregate আর সাধারণ Column একসাথে",
            isCorrect: false,
            explanation: "Aggregate টা আলাদা Subquery র ভেতরে, বাইরের Query তে কোনো Aggregate নেই। তাই কোনো Error নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "কোনটা Correlated Subquery?",
        options: [
          {
            key: "A",
            text: "(SELECT max(booked_at) FROM bookings)",
            isCorrect: false,
            explanation: "বাইরের কোনো Column নেই। এটা যেকোনো Query র ভেতরে একই উত্তর দেয়।",
          },
          {
            key: "B",
            text: "(SELECT count(*) FROM bookings b WHERE b.customer_id = c.customer_id)",
            isCorrect: true,
            explanation: "ঠিক। c.customer_id বাইরের customers এর Column। প্রতিটা Customer এর জন্য উত্তর আলাদা, তাই প্রতিটা Row তে আবার চলে।",
          },
          {
            key: "C",
            text: "(SELECT avg(price_bdt) FROM tours WHERE is_active)",
            isCorrect: false,
            explanation: "is_active ভেতরের tours এর নিজের Column, বাইরের না। এটা Uncorrelated।",
          },
          {
            key: "D",
            text: "(SELECT min(starts_on) FROM departures WHERE starts_on >= DATE '2026-11-01')",
            isCorrect: false,
            explanation: "একটা লেখা তারিখের সাথে তুলনা, বাইরের কোনো Row এর সাথে না। Uncorrelated।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: হাতে লেখা সংখ্যা মুক্ত Report",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>পুরনো Query খুঁজুন:</strong> Module 03 থেকে 06 এর আপনার নিজের লেখা Query গুলো থেকে অন্তত তিনটা খুঁজে বের
        করুন যেখানে একটা সংখ্যা বা তারিখ হাতে লেখা, অথচ সেটা Data থেকেই বের করা যেত। প্রতিটাকে Scalar Subquery দিয়ে আবার
        লিখুন।
      </span>,
      <span key="2">
        <strong>গড়টা কাদের:</strong> প্রিমিয়াম পাতার Query দুইভাবে চালান: ভেতরে is_active সহ আর ছাড়া। কোন ট্যুর
        তালিকায় ঢোকে বা বের হয়, আর কেন, তিন লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>Error ঘটান, তারপর সারান:</strong> destination_id 2 দিয়ে ইচ্ছা করে ERROR 21000 ঘটান। তারপর max(), min() আর
        ORDER BY ... LIMIT 1, তিনভাবে সারান, আর প্রতিটা সমাধান কোন প্রশ্নের উত্তর দিচ্ছে বাংলায় লিখুন।
      </span>,
      <span key="4">
        <strong>নিজের Dashboard:</strong> FROM ছাড়া একটা SELECT এ অন্তত ছয়টা কার্ড বানান, এই লেসনের পাঁচটার বাইরে অন্তত
        তিনটা নতুন, যেমন বাতিল Booking এর হার, সবচেয়ে বেশি সিটের Booking, বা failed Payment এর সংখ্যা।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> রান্নার রেসিপির উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান Scalar Subquery
        কী, শূন্য Row আর দুই Row এ কী হয়।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা পুরনো আর নতুন Query, পাশাপাশি</span>,
      <span key="d2">is_active সহ আর ছাড়া দুটো ফলাফল, আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="d3">Error এর বার্তা আর তিনটা সমাধান, প্রতিটার প্রশ্ন বাংলায়</span>,
      <span key="d4">ছয় কার্ডের Dashboard Query আর তার এক Row ফলাফল</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Scalar Subquery",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "ভেতরেরটা আগে",
        description:
          "প্রথম ফাইলে আগে শুধু ভেতরের Query, তারপর পুরো Query। দুটোর মাঝে কোনো সংখ্যা হাতে কপি করবেন না।",
      },
      {
        title: "কাদের গড়",
        description:
          "দ্বিতীয় ফাইলে একই প্রশ্ন দুইভাবে, ভেতরে is_active সহ আর ছাড়া। কোন ট্যুর অদলবদল হলো, মিলিয়ে দেখুন।",
      },
      {
        title: "SELECT আর HAVING এ",
        description:
          "তৃতীয় ফাইলে প্রতিটা ট্যুরের আয়ের শতাংশ আর পনেরো শতাংশের সীমা। শতাংশগুলো যোগ করে 100 আসে কিনা দেখুন।",
      },
      {
        title: "শূন্য Row",
        description:
          "চতুর্থ ফাইলে \\pset null দিয়ে NULL কে দৃশ্যমান করুন, তারপর নেই এমন ট্যুরের দাম আর তার সাথে তুলনা।",
      },
      {
        title: "দুই Row এর Error",
        description:
          "পঞ্চম ফাইলে ERROR 21000 নিজে একবার দেখুন, তারপর max() আর min() দিয়ে সারান।",
      },
      {
        title: "পাঁচ কার্ড",
        description:
          "ষষ্ঠ ফাইলে Admin Panel এর এক Row Dashboard। আপনার নিজের Database এ সংখ্যাগুলো এই লেসনের সাথে মেলা উচিত।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-inner-first.sql",
        code: `SELECT avg(price_bdt) FROM tours;
-- 13477.777777777778 (1 row)

SELECT title, price_bdt
FROM tours
WHERE price_bdt > (SELECT avg(price_bdt) FROM tours)
ORDER BY price_bdt DESC;
-- (4 rows), প্রথম Row: Saint Martin Luxury Stay | 32000.00`,
      },
      {
        language: "sql",
        filename: "02-whose-average.sql",
        code: `SELECT title FROM tours
WHERE price_bdt > (SELECT avg(price_bdt) FROM tours)
ORDER BY price_bdt DESC;
-- (4 rows): Luxury Stay, Sundarbans, Family Package, Bandarban

SELECT title FROM tours
WHERE is_active
  AND price_bdt > (SELECT avg(price_bdt) FROM tours WHERE is_active)
ORDER BY price_bdt DESC;
-- (4 rows): Sundarbans, Family Package, Bandarban, Saint Martin Island Escape`,
      },
      {
        language: "sql",
        filename: "03-select-having.sql",
        code: `SELECT t.title,
       round(100.0 * sum(b.total_bdt)
             / (SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed'), 1) AS pct
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
ORDER BY pct DESC;
-- (7 rows), প্রথম Row: Saint Martin Island Escape | 29.5

SELECT t.title
FROM bookings b
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t      ON t.tour_id = d.tour_id
WHERE b.status = 'confirmed'
GROUP BY t.tour_id, t.title
HAVING sum(b.total_bdt) > (SELECT sum(total_bdt) FROM bookings WHERE status = 'confirmed') * 0.15;
-- (4 rows)`,
      },
      {
        language: "sql",
        filename: "04-zero-rows.sql",
        code: `\\pset null '(null)'

SELECT (SELECT price_bdt FROM tours WHERE tour_id = 99) AS missing;
-- (null)

SELECT count(*) FROM tours
WHERE price_bdt > (SELECT price_bdt FROM tours WHERE tour_id = 99);
-- 0

SELECT COALESCE((SELECT price_bdt FROM tours WHERE tour_id = 99), 0) AS price;
-- 0`,
      },
      {
        language: "sql",
        filename: "05-two-rows.sql",
        code: `SELECT title FROM tours
WHERE price_bdt = (SELECT price_bdt FROM tours WHERE destination_id = 1);
-- ERROR:  more than one row returned by a subquery used as an expression

SELECT title FROM tours
WHERE price_bdt > (SELECT max(price_bdt) FROM tours WHERE destination_id = 1);
-- (0 rows)

SELECT title FROM tours
WHERE price_bdt > (SELECT min(price_bdt) FROM tours WHERE destination_id = 1);
-- (4 rows)`,
      },
      {
        language: "sql",
        filename: "06-dashboard.sql",
        code: `SELECT (SELECT count(*) FROM customers)                          AS customers,
       (SELECT count(*) FROM tours WHERE is_active)                 AS active_tours,
       (SELECT count(*) FROM bookings WHERE status = 'pending')     AS pending,
       (SELECT sum(amount_bdt) FROM payments WHERE status = 'paid') AS paid_bdt,
       (SELECT round(avg(rating), 2) FROM reviews)                  AS avg_rating;
-- 15 | 8 | 4 | 423600.00 | 4.10`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Scalar Subquery লেখার পর বন্ধনীর ভেতরটা একবার একা চালান, আর নিজেকে জিজ্ঞেস করুন: কাল Data বদলালেও কি এটা
        ঠিক একটা Row দেবে? উত্তর “হ্যাঁ, কারণ ...” দিয়ে শুরু না হলে Query টা এখনো শেষ হয়নি।
      </ContentParagraph>
    ),
  },
};
