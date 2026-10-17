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
  CountTrapLab,
  JoinChoiceLab,
  RowMatchLab,
} from "../../../components/course/topics/joins/outer-animations";
import {
  CountStarTrapDiagram,
  FindMissingDiagram,
  IsNullColumnSplit,
  KeepLeftDiagram,
  LeftRightMirrorSplit,
} from "../../../components/course/topics/joins/outer-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const leftRightJoinContent: TopicData = {
  id: "left-right-join",
  introduction: {
    badge: "MODULE 06 · LESSON 03",
    title: <SectionTitle>যার জোড়া নেই, তাকেও রাখা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে INNER JOIN দুটো Table থেকে শুধু সেই Row গুলো জোড়া দিয়েছে, যাদের Key মিলেছে।
          Booking এর পাশে Customer এর নাম, ট্যুরের পাশে Destination এর নাম। কাজটা চমৎকার, কিন্তু একটা
          জিনিস সে চুপচাপ করে: যার কোনো জোড়া নেই, তাকে সে ফলাফল থেকে মুছে দেয়। কোনো Error নেই, কোনো
          সতর্কতা নেই। Imran Kabir এর কোনো Booking নেই, তাই INNER JOIN এর তালিকায় তিনি কখনো আসেন না।
        </ContentParagraph>
        <ContentParagraph>
          অথচ ব্যবসার অনেক প্রশ্নের উত্তর ঠিক ওই হারিয়ে যাওয়া Row গুলোতে। কে এখনো কিছু বুক করেননি? কোন
          Destination এ একটাও ট্যুর নেই? কোন ট্যুরের কোনো তারিখ ঠিক হয়নি? কোন Guide এর হাতে কাজ নেই? এসব
          প্রশ্নের জন্য SQL এ আছে LEFT JOIN: বাঁ দিকের প্রতিটা Row কে সে রাখে, জোড়া পাক বা না পাক।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন LEFT JOIN ঠিক কী করে আর কেন জোড়া না পেলে NULL বসায়, কোনটা বাঁ দিক
          আর কেন সেটা গুরুত্বপূর্ণ, LEFT JOIN আর IS NULL দিয়ে কীভাবে না থাকা জিনিস খুঁজে বের করতে হয়, IS
          NULL কোন Column এ লিখতে হয়, RIGHT JOIN কেন শুধু উল্টো দিক থেকে লেখা LEFT JOIN, আর LEFT JOIN এর
          পরে গুনতে গেলে count(*) কেন মিথ্যা বলে। প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে, যেখানে
          এই কাজের জন্যই কয়েকটা জোড়াহীন Row ইচ্ছা করে রাখা আছে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি কাউকে বাইরে দাঁড় করিয়ে রাখি না। বাঁ দিকের তালিকায় যার নাম আছে, সে ফলাফলে আসবেই। জোড়া পেলে জোড়ার সাথে, না পেলে একা, পাশের ঘরগুলোতে NULL নিয়ে। ওই NULL গুলোই বলে দেয়, কার কিছু নেই।",
      author: "LEFT JOIN",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যাঁর জন্য SMS, তিনিই তালিকায় নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকালের বৈঠকে Island Tours এর Operations Manager ফারুক সাহেব একটা নতুন পরিকল্পনা
                জানালেন। Website এ যাঁরা Account খুলেছেন, তাঁদের সবাইকে একটা SMS যাবে, আর প্রত্যেকের SMS এ
                লেখা থাকবে তিনি এ পর্যন্ত কয়বার Island Tours এর সাথে ঘুরেছেন। যিনি একবারও যাননি, তাঁর SMS এ
                থাকবে প্রথম ট্যুরে বিশেষ ছাড়ের কথা। তালিকাটা বানানোর দায়িত্ব পেলেন নতুন Developer তানিম।
              </ContentParagraph>
              <ContentParagraph>
                তানিম আগের লেসন থেকে INNER JOIN জানেন। customers আর bookings জোড়া দিয়ে, Customer অনুযায়ী
                দল করে, প্রত্যেকের Booking গুনলেন। চোদ্দজনের সুন্দর একটা তালিকা এল। ফারুক সাহেব তালিকা দেখে
                জিজ্ঞেস করলেন, ছাড়ের SMS টা কার কাছে যাবে? তালিকায় একজনও নেই, যাঁর Booking শূন্য।
              </ContentParagraph>
              <ContentParagraph>
                অথচ customers Table এ Customer পনেরোজন। পনেরো নম্বর Customer Imran Kabir, যিনি অক্টোবরের
                পাঁচ তারিখে Account খুলেছেন, এখনো কিছু বুক করেননি। ছাড়ের SMS টা আসলে তাঁর জন্যই বানানো।
                আর তিনিই তালিকা থেকে হারিয়ে গেছেন, কারণ INNER JOIN শুধু জোড়া পাওয়া Row রাখে, আর Imran এর
                জোড়ার মতো কোনো Booking নেই। নিচের বক্সে নিজে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম তালিকা, INNER JOIN দিয়ে"
              query={`SELECT c.full_name, count(b.booking_id) AS bookings
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY c.full_name;`}
              caption="চোদ্দটা Row। তালিকা বর্ণমালা ধরে সাজানো, আর পুরোটা খুঁজলেও Imran Kabir নেই। Error নেই, সংখ্যাগুলোও ঠিক, শুধু একজন মানুষ নেই। এই লেসনের বাকি অংশ এই একটা হারিয়ে যাওয়া Row ফিরিয়ে আনার গল্প।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "হারিয়ে যাওয়াটা নীরব",
          content: (
            <ContentParagraph>
              INNER JOIN কাউকে বাদ দিলে কিছু জানায় না। তালিকা দেখতে সম্পূর্ণ লাগে। তাই প্রশ্নে যদি
              &quot;সবাই&quot; থাকে, যেমন সব Customer, সব ট্যুর, সব Destination, তাহলে INNER JOIN লেখার
              আগে একবার থামুন: যার জোড়া নেই, সে কি এই উত্তরে থাকার কথা?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "who-goes-missing",
      subHeader: { index: "002", title: "Who Goes Missing" },
      title: <SectionTitle>Sample Data তে যাদের জোড়া নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Sample Database এ কয়েকটা Row ইচ্ছা করে এমনভাবে রাখা হয়েছে যে তাদের জোড়া
                নেই। বাস্তব Database এও ঠিক এমনই হয়: নতুন Customer যিনি এখনো কিছু কেনেননি, নতুন যোগ হওয়া
                জায়গা যেখানে এখনো ট্যুর চালু হয়নি, সদ্য নিয়োগ পাওয়া Guide। এই লেসনে এদের প্রত্যেককে খুঁজে বের
                করবেন। আগে একবার দেখে নিন কারা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["জোড়াহীন Row", "কোন দুই Table এর মধ্যে", "INNER JOIN এ কী হয়"],
          rows: [
            ["Imran Kabir, customer 15", "customers আর bookings", "কোনো Booking নেই, তাই তালিকা থেকে উধাও"],
            ["Kuakata, destination 7", "destinations আর tours", "কোনো ট্যুর নেই, তাই Destination তালিকায় নেই"],
            ["Cox's Bazar Family Package, tour 9", "tours আর departures", "কোনো তারিখ নেই, তাই তারিখের তালিকায় নেই"],
            ["Nazmul Karim, guide 5", "guides আর tours", "কোনো ট্যুর নেই, তাই Guide তালিকায় নেই"],
            ["Ratargul Swamp Boat Day, tour 7", "tours আর guides", "guide_id NULL, তাই Guide সহ ট্যুরের তালিকায় নেই"],
            ["Departure 16", "departures আর bookings", "কেউ বুক করেনি, তাই বিক্রির তালিকায় নেই"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো তালিকা আর প্রতিটা Table এর সম্পর্ক{" "}
              <Link href="/sql/database" className={LINK}>
                Island Tours Database
              </Link>{" "}
              পাতায় আছে। এই লেসনের প্রতিটা Query এদের কাউকে না কাউকে নিয়ে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "left-join",
      subHeader: { index: "003", title: "LEFT JOIN" },
      title: <SectionTitle>বাঁ দিকের প্রত্যেকে অন্তত একবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা স্কুলের অভিভাবক সভার কথা ভাবুন। শিক্ষক ক্লাসের হাজিরা খাতা খুলে প্রতিটা ছাত্রের নাম
                ডাকেন, আর পাশে লেখেন কার অভিভাবক এসেছেন। কারো বাবা এসেছেন, কারো মা আর বাবা দুজনেই। যার
                অভিভাবক আসেননি, তার নাম শিক্ষক খাতা থেকে কেটে দেন না। নামের পাশে ঘরটা ফাঁকা রাখেন। ফাঁকা
                ঘরটাই পরে বলে দেয়, কার বাড়িতে ফোন করতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                LEFT JOIN ঠিক এই শিক্ষক। JOIN শব্দের বাঁ দিকে যে Table লেখা, সেটা হাজিরা খাতা: তার প্রতিটা
                Row ফলাফলে আসবেই। ডান দিকের Table থেকে যাদের Key মেলে, তারা পাশে বসে। একাধিক মিল হলে বাঁ দিকের
                Row টা প্রতিটা মিলের জন্য একবার করে আসে, ঠিক INNER JOIN এর মতো। আর কোনো মিল না পেলে বাঁ দিকের
                Row টা একবার আসে, ডান দিকের প্রতিটা Column এ NULL নিয়ে। এই NULL হলো শিক্ষকের ফাঁকা ঘর।
              </ContentParagraph>
              <ContentParagraph>
                লেখার নিয়ম INNER JOIN এর মতোই, শুধু JOIN এর আগে LEFT। চাইলে LEFT OUTER JOIN ও লিখতে পারেন,
                OUTER শব্দটা ঐচ্ছিক, অর্থ একই। ON এর ভেতরে আগের মতোই লেখা থাকে কোন Column মিলতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "left-join-shape.sql",
          code: `SELECT ...
FROM   left_table  l              -- এই Table এর প্রতিটা Row থাকবে
LEFT JOIN right_table r           -- এখান থেকে শুধু যাদের মিল আছে
       ON r.foreign_key = l.primary_key;
-- মিল না পেলে: l এর Column গুলো আসল মান, r এর সব Column NULL`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <KeepLeftDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনজন Customer, LEFT JOIN দিয়ে"
              query={`SELECT c.customer_id, c.full_name, b.booking_id, b.status
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE c.customer_id IN (13, 14, 15)
ORDER BY c.customer_id, b.booking_id;`}
              caption="চারটা Row। Shuvo Das দুইবার, কারণ তাঁর দুটো Booking (15 আর 24)। Lamia Haque একবার। Imran Kabir ও একবার, কিন্তু booking_id আর status এর ঘরে NULL। Query থেকে LEFT শব্দটা মুছে আবার চালান: Imran এর Row টা চলে যাবে, তিনটা Row থাকবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "NULL এখানে মানে: জোড়া পাওয়া যায়নি",
          content: (
            <ContentParagraph>
              Module 03 এ আপনি শিখেছেন NULL মানে অজানা। LEFT JOIN এর NULL একটু অন্য গল্প বলে: Imran এর
              booking_id অজানা না, ওটা আসলে নেই। Database এর কোনো Row এ এই NULL লেখা নেই, LEFT JOIN ফলাফল
              বানানোর সময় নিজে বসিয়েছে। তাই এই NULL দেখলে বুঝবেন, এই Row এর ডান দিকে কেউ ছিল না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে লিখুন। এবারের জোড়াহীন Row টা একটা জায়গা: Kuakata, যেখানে এখনো কোনো ট্যুর নেই।
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
                  প্রতিটা Destination এর নামের পাশে তার ট্যুরের নাম দেখান। যে Destination এ একটাও ট্যুর নেই,
                  সেটাও তালিকায় থাকবে। দুটো Column: <code className={CODE}>destinations.name</code> আর{" "}
                  <code className={CODE}>tours.title</code>, এই ক্রমে। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  সব Destination চাই, তাই <code className={CODE}>destinations</code> থাকবে বাঁ দিকে:{" "}
                  <code className={CODE}>FROM destinations d LEFT JOIN tours t ON t.destination_id = d.destination_id</code>।
                </>
              }
              solution={`SELECT d.name, t.title
FROM destinations d
LEFT JOIN tours t ON t.destination_id = d.destination_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "step-through",
      subHeader: { index: "004", title: "Step Through It" },
      title: <SectionTitle>একটা একটা Row মিলিয়ে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Database ভেতরে ঠিক কোন কৌশলে Join চালায়, সেটা Module 13 এর বিষয়। ফলাফলটা বোঝার জন্য একটা
                সহজ ছবিই যথেষ্ট: বাঁ দিকের Table এর প্রথম Row থেকে শুরু করে প্রতিটা Row ডান দিকে নিজের Key
                খোঁজে। যতগুলো মিল পায়, ততগুলো Row ফলাফলে যায়। একটাও না পেলে INNER JOIN Row টা ফেলে দেয়, আর
                LEFT JOIN একবার রাখে, NULL বসিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ তিন জোড়া আসল Table আছে। প্রথমে INNER JOIN রেখে পরের Row চাপতে থাকুন, দেখুন কোন
                Row এ গিয়ে কেউ হারিয়ে যায়। তারপর LEFT JOIN এ বদলে আবার শুরু করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowMatchLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পুরো Table এ দুই রকম Join এর Row সংখ্যা"
              query={`SELECT count(*) AS inner_rows,
       count(DISTINCT c.customer_id) AS customers_seen
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;

SELECT count(*) AS left_rows,
       count(DISTINCT c.customer_id) AS customers_seen
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id;`}
              caption="INNER JOIN: ২৪টা Row, Customer ১৪ জন। LEFT JOIN: ২৫টা Row, Customer ১৫ জন। বাড়তি একটা Row ঠিক Imran এর। একটা নিয়ম মনে রাখুন: LEFT JOIN এর Row সংখ্যা কখনো INNER JOIN এর চেয়ে কম হয় না, বাড়ে ঠিক জোড়াহীন বাঁ দিকের Row এর সংখ্যা যত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই নিয়মটা বাকি তিন জোড়া Table এও খাটে কিনা, একটা Query তেই দেখে নিন। প্রতিটা LEFT JOIN এর পাশে
              ডান দিকের Key কয়বার মিলেছে, সেটাও গোনা আছে। কেন count(*) আর count(ডান দিকের Key) আলাদা উত্তর দেয়,
              তার পুরো গল্প এই লেসনের নবম অংশে। আপাতত শুধু দুই Column এর পার্থক্যটা লক্ষ করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার জোড়া Table, চারটা জোড়াহীন"
              query={`SELECT count(*) AS rows, count(b.booking_id) AS matched
FROM customers c LEFT JOIN bookings b ON b.customer_id = c.customer_id;

SELECT count(*) AS rows, count(t.tour_id) AS matched
FROM destinations d LEFT JOIN tours t ON t.destination_id = d.destination_id;

SELECT count(*) AS rows, count(dp.departure_id) AS matched
FROM tours t LEFT JOIN departures dp ON dp.tour_id = t.tour_id;

SELECT count(*) AS rows, count(t.tour_id) AS matched
FROM guides g LEFT JOIN tours t ON t.guide_id = g.guide_id;`}
              caption="চারবারই rows আর matched এর পার্থক্য ঠিক এক: ২৫ আর ২৪, ১০ আর ৯, ১৭ আর ১৬, ৯ আর ৮। প্রতিটা পার্থক্য একজন জোড়াহীন: Imran Kabir, Kuakata, Cox's Bazar Family Package আর Nazmul Karim। matched এর সংখ্যাটা প্রতিবার INNER JOIN এর Row সংখ্যার সমান।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "which-side",
      subHeader: { index: "005", title: "Which Side Is Left" },
      title: <SectionTitle>বাঁ দিক মানে লেখার ক্রম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LEFT JOIN এ বাঁ দিক মানে কোনো বিশেষ Table না, শুধু Query তে যে Table টা LEFT JOIN শব্দের আগে
                লেখা। FROM এর পরের Table বাঁ দিকে, LEFT JOIN এর পরের Table ডান দিকে। তাই কোন Table আগে লিখবেন,
                সেটাই ঠিক করে কার সব Row থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                tours আর guides এর মধ্যে এটা পরিষ্কার দেখা যায়। tours বাঁ দিকে রাখলে প্রশ্নটা হয় &quot;প্রতিটা
                ট্যুর আর তার Guide&quot;, আর Guide ছাড়া ট্যুর Ratargul Swamp Boat Day NULL নিয়ে থেকে যায়।
                guides বাঁ দিকে রাখলে প্রশ্নটা হয় &quot;প্রতিটা Guide আর তাঁর ট্যুর&quot;, আর এবার থেকে যান
                ট্যুরহীন Guide Nazmul Karim। দুটো Query তেই নয়টা Row, কিন্তু NULL বসে সম্পূর্ণ আলাদা জায়গায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="tours বাঁ দিকে"
              query={`SELECT t.title, g.full_name AS guide
FROM tours t
LEFT JOIN guides g ON g.guide_id = t.guide_id
ORDER BY t.tour_id;`}
              caption="নয়টা ট্যুর, প্রত্যেকে একবার। Ratargul Swamp Boat Day এর guide এর ঘরে NULL, কারণ তার guide_id নিজেই NULL, মেলানোর মতো কিছু নেই। Nazmul Karim এই তালিকায় নেই, কারণ guides এখানে ডান দিকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="guides বাঁ দিকে"
              query={`SELECT g.full_name, t.title
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
ORDER BY g.guide_id, t.tour_id;`}
              caption="এবারও নয়টা Row, কিন্তু অন্যরকম। চারজন Guide দুইবার করে, কারণ প্রত্যেকে দুটো ট্যুর চালান। শেষ Row এ Nazmul Karim, title এর ঘরে NULL। আর Ratargul এর ট্যুর নেই, কারণ তার কোনো Guide নেই আর tours এখন ডান দিকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সব সময় দিক বদলালে ফলাফল বদলায় না। bookings বাঁ দিকে রেখে customers এর সাথে LEFT JOIN করলে
                চব্বিশটা Row আসে, INNER JOIN এর সমান। কারণ প্রতিটা Booking এর customer_id এ NOT NULL আর Foreign
                Key দুটোই আছে, তাই এমন কোনো Booking হতেই পারে না যার Customer নেই। LEFT JOIN তখন বাড়তি কিছু
                রাখে না। LEFT JOIN কাজে লাগে তখনই, যখন বাঁ দিকে জোড়াহীন Row থাকা সম্ভব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="bookings বাঁ দিকে"
              query={`SELECT count(*) AS rows
FROM bookings b
LEFT JOIN customers c ON c.customer_id = b.customer_id;`}
              caption="২৪, INNER JOIN এর সমান। Foreign Key নিশ্চিত করে প্রতিটা Booking এর একজন Customer আছেন। তাই প্রশ্ন করুন: আমার বাঁ দিকের Table এ কি এমন Row থাকতে পারে, যার জোড়া নেই? উত্তর হ্যাঁ হলেই LEFT JOIN এর মানে আছে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "find-missing",
      subHeader: { index: "006", title: "Finding What Is Missing" },
      title: <SectionTitle>যা নেই, তা খুঁজে বের করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের ছাড়ের SMS যাবে শুধু তাঁদের কাছে, যাঁরা একবারও বুক করেননি। মানে এবার তালিকায় সবাই
                না, শুধু জোড়াহীনরা। LEFT JOIN এর পরে জোড়াহীন Row চেনার উপায় আপনি জানেন: তাদের ডান দিকের
                Column গুলো NULL। তাই LEFT JOIN এর পরে একটা WHERE বসিয়ে Database কে বলুন, শুধু সেই Row রাখতে
                যেখানে ডান দিকের Key NULL।
              </ContentParagraph>
              <ContentParagraph>
                এই দুই ধাপের নকশাকে বলে Anti Join, মানে উল্টো জোড়া: যাদের জোড়া নেই, শুধু তারা। নামটা মনে
                রাখার দরকার নেই, নকশাটা মনে রাখুন: LEFT JOIN দিয়ে সবাইকে রাখা, IS NULL দিয়ে জোড়া পাওয়াদের
                ফেলে দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FindMissingDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যাঁরা কখনো বুক করেননি"
              query={`SELECT c.customer_id, c.full_name, c.email
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booking_id IS NULL;`}
              caption="একটা Row: Imran Kabir। ফারুক সাহেবের ছাড়ের SMS এর পুরো তালিকা। WHERE চলে Join এর পরে, তাই সে LEFT JOIN এর বানানো NULL দেখতে পায়। ভেবে দেখুন: এখানে = NULL লিখলে কী হতো? Module 03 এর সেই নিয়ম, কোনো Row ই আসত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে ট্যুরের কোনো তারিখ নেই"
              query={`SELECT t.tour_id, t.title
FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
WHERE d.departure_id IS NULL;`}
              caption="একটা Row: Cox's Bazar Family Package। Website এ বিক্রির জন্য আছে, অথচ কোনো Departure নেই, মানে কেউ বুক করতে গেলে তারিখ বাছার কিছু পাবেন না। এই Query প্রতি সপ্তাহে চালালে এমন ভুল আগেভাগে ধরা পড়ে।"
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
                  কোন Guide এর হাতে এখন একটাও ট্যুর নেই? Guide এর{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>phone</code> দেখান, এই
                  ক্রমে।
                </>
              }
              hint={
                <>
                  Guide দের সবাইকে রাখতে <code className={CODE}>guides</code> বাঁ দিকে, তারপর{" "}
                  <code className={CODE}>WHERE t.tour_id IS NULL</code>।
                </>
              }
              solution={`SELECT g.full_name, g.phone
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
WHERE t.tour_id IS NULL;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন দেখতে এদের মতো, কিন্তু তার জন্য কোনো Join লাগে না: কোন ট্যুরের Guide নেই? সম্পর্কটা
                কোন দিকে লেখা, সেটা দেখুন। ট্যুর আর Guide এর সংযোগ, guide_id, থাকে tours Table এর ভেতরেই। তাই
                Guide না থাকা মানে tours এর সেই Row এ guide_id নিজেই NULL। এটা দেখতে guides Table খোলার দরকারই
                নেই।
              </ContentParagraph>
              <ContentParagraph>
                উল্টো দিকের প্রশ্নটা আলাদা: কোন Guide এর ট্যুর নেই? Guide দের Row এ ট্যুরের কোনো চিহ্ন থাকে না,
                সংযোগটা আছে অন্য Table এ। সেটা জানতে tours এ খুঁজতেই হয়, মানে LEFT JOIN। নিয়মটা সহজ: যে Table
                এ Foreign Key আছে, তার দিক থেকে জোড়াহীন খুঁজতে IS NULL ই যথেষ্ট। যে Table এর দিকে Foreign Key
                তাক করা, তার দিক থেকে খুঁজতে LEFT JOIN লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide ছাড়া ট্যুর, কোনো Join ছাড়াই"
              query={`SELECT tour_id, title
FROM tours
WHERE guide_id IS NULL;`}
              caption="একটা Row: Ratargul Swamp Boat Day। guide_id tours এর নিজের Column, তাই একটা Table ই যথেষ্ট। Exercise 2 এর প্রশ্নটা ছিল উল্টো দিকের, সেখানে LEFT JOIN ছাড়া উপায় ছিল না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই প্রশ্নের আরও দুটো উপায় আছে",
          content: (
            <ContentParagraph>
              &quot;কার নেই&quot; প্রশ্নের উত্তর NOT EXISTS দিয়েও লেখা যায়, আর NOT IN দিয়েও, যদিও NOT IN এ
              NULL এর একটা ফাঁদ আছে। তিনটা উপায় পাশাপাশি, আর কোনটা কখন ভালো, সেটা এই Module এর{" "}
              <Link href="/sql/topic/semi-anti-join" className={LINK}>
                Semi and Anti Joins
              </Link>{" "}
              লেসনে। এখানে LEFT JOIN আর IS NULL এর নকশাটা হাতে বসিয়ে নিন, কারণ এটাই সবচেয়ে বেশি দেখা যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "which-column",
      subHeader: { index: "007", title: "Which Column to Test" },
      title: <SectionTitle>IS NULL লিখবেন কোন Column এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Anti Join এ একটা সূক্ষ্ম ভুল খুব সহজে ঢুকে পড়ে। ধরুন প্রশ্নটা: কোন Booking এর কোনো Review
                নেই? bookings বাঁ দিকে, reviews ডান দিকে। এখন IS NULL পরীক্ষা করবেন কোন Column এ? মনে হতে
                পারে যেকোনো একটা হলেই চলে, কারণ জোড়াহীন Row এ ডান দিকের সব Column ই তো NULL।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যা উল্টো দিকে। জোড়াহীন Row এ সব NULL ঠিকই, কিন্তু জোড়া পাওয়া Row এও কিছু Column নিজে থেকেই
                NULL হতে পারে। reviews এর comment Column টা ঐচ্ছিক: booking 4 আর 9 এর Review আছে, শুধু কোনো
                মন্তব্য লেখা হয়নি। comment দিয়ে পরীক্ষা করলে এই দুটো Booking ও &quot;Review নেই&quot; এর
                তালিকায় ঢুকে যায়, যদিও Review আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IsNullColumnSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই রকম পরীক্ষা, পাশাপাশি"
              query={`SELECT count(*) AS by_review_id
FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.review_id IS NULL;

SELECT count(*) AS by_comment
FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.comment IS NULL;`}
              caption="প্রথমটা ১৪, দ্বিতীয়টা ১৬। চব্বিশটা Booking এর দশটার Review আছে, তাই সঠিক উত্তর ১৪। বাড়তি দুটো Booking 4 আর 9, যাদের Review এ মন্তব্য নেই। কোনো Error নেই, শুধু ভুল সংখ্যা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নিয়ম: ডান দিকের Primary Key",
          content: (
            <ContentParagraph>
              IS NULL পরীক্ষা করুন ডান দিকের Table এর Primary Key তে, যেমন r.review_id বা b.booking_id।
              Primary Key কখনো NULL হতে পারে না, তাই সেটা NULL দেখলে একটাই মানে: এই Row এর জোড়া পাওয়া যায়নি।
              ON এ যে Column দিয়ে মিলিয়েছেন, সেটাও নিরাপদ, কারণ মিল পাওয়া Row এ তার মান মিলেছে বলেই সে এসেছে।
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
                  মোট কয়টা Booking এর কোনো Review নেই? একটাই সংখ্যা, একটা Column।
                </>
              }
              hint={
                <>
                  <code className={CODE}>count(*)</code>, আর IS NULL দিন{" "}
                  <code className={CODE}>r.review_id</code> এ, comment এ না।
                </>
              }
              solution={`SELECT count(*) AS bookings_without_review
FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.review_id IS NULL;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "right-join",
      subHeader: { index: "008", title: "RIGHT JOIN" },
      title: <SectionTitle>RIGHT JOIN: একই জিনিস, আয়নায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LEFT JOIN বাঁ দিকের সবাইকে রাখে। RIGHT JOIN রাখে ডান দিকের সবাইকে, অর্থাৎ RIGHT JOIN শব্দের পরে
                যে Table লেখা। এর বাইরে আর কোনো তফাত নেই। তাই{" "}
                <code className={CODE}>bookings b RIGHT JOIN customers c</code> আর{" "}
                <code className={CODE}>customers c LEFT JOIN bookings b</code> হুবহু একই Row দেয়: Table দুটোর
                জায়গা বদলালেন, শব্দটাও বদলালেন, ফলাফল যেমন ছিল তেমন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LeftRightMirrorSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RIGHT JOIN দিয়ে একই প্রশ্ন"
              query={`SELECT count(*) AS rows
FROM bookings b
RIGHT JOIN customers c ON c.customer_id = b.customer_id;

SELECT c.full_name, b.booking_id
FROM bookings b
RIGHT JOIN customers c ON c.customer_id = b.customer_id
WHERE b.booking_id IS NULL;`}
              caption="প্রথম Query ২৫টা Row, দ্বিতীয়টা একটা: Imran Kabir। LEFT JOIN দিয়ে যা পেয়েছিলেন, ঠিক তাই। শুধু এবার customers লেখা আছে ডান দিকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে RIGHT JOIN কেন আছে? SQL Standard দুটোই রেখেছে, যাতে লেখক যেকোনো দিক থেকে লিখতে পারেন।
                কিন্তু বাস্তবে বেশিরভাগ দল একটা অভ্যাস মানে: সবসময় LEFT JOIN। যে Table এর সব Row চাই, সেটা
                FROM এ, প্রথমে। Query পড়ার সময় তখন চোখ উপর থেকে নিচে নামলেই বোঝা যায়, মূল তালিকা কোনটা আর পাশে
                কারা জুড়ছে। একটা Query তে LEFT আর RIGHT মেশালে পড়তে গিয়ে বারবার মাথায় দিক ঘোরাতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                কারো লেখা Query তে RIGHT JOIN দেখলে ভয় পাওয়ার কিছু নেই। দুই দিকের Table এর জায়গা বদলে RIGHT
                কে LEFT লিখুন, ফলাফল একই থাকবে, আর পড়তে সহজ হবে।
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
                  এবার ইচ্ছা করে RIGHT JOIN দিয়ে লিখুন: প্রতিটা Destination এর{" "}
                  <code className={CODE}>name</code> আর সেখানে কয়টা ট্যুর আছে, যে Destination এ ট্যুর নেই সেখানে
                  ০। দুটো Column, এই ক্রমে, Row এর ক্রম যেকোনো। Check সব সঠিক উত্তর মানে, তাই LEFT JOIN দিয়ে
                  লিখলেও মিলবে, কিন্তু RIGHT দিয়ে একবার হাত চালিয়ে নিন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours t RIGHT JOIN destinations d ON ...</code>, তারপর{" "}
                  <code className={CODE}>GROUP BY d.destination_id, d.name</code> আর গুনতে{" "}
                  <code className={CODE}>count(t.tour_id)</code>।
                </>
              }
              solution={`SELECT d.name, count(t.tour_id) AS tours
FROM tours t
RIGHT JOIN destinations d ON d.destination_id = t.destination_id
GROUP BY d.destination_id, d.name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "counting",
      subHeader: { index: "009", title: "Counting After LEFT JOIN" },
      title: <SectionTitle>count(*) যখন মিথ্যা বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের মূল কাজে ফেরা যাক: সবার Booking সংখ্যা, Imran সহ। INNER JOIN কে LEFT JOIN এ বদলালে
                Imran তালিকায় ফিরে আসেন। কিন্তু তানিম যদি গোনার জন্য count(*) লেখেন, Imran এর পাশে আসে ১। SMS
                এ লেখা যাবে, আপনি আমাদের সাথে একবার ঘুরেছেন, অথচ তিনি কখনো যাননি।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা{" "}
                <Link href="/sql/topic/aggregate-functions" className={LINK}>
                  Module 05 এর প্রথম লেসনে
                </Link>{" "}
                দেখেছেন: count(*) Row গোনে, মান না। LEFT JOIN Imran এর জন্য একটা Row বানিয়েছে, NULL দিয়ে ভরা,
                কিন্তু Row তো Row। count(*) সেটাকে গুনে ফেলে। count(b.booking_id) গোনে শুধু সেই Row, যেখানে
                booking_id NULL না। Imran এর একমাত্র Row এ booking_id NULL, তাই উত্তর ০, যেটা সত্যি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CountStarTrapDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই রকম গোনা, সবার জন্য"
              query={`SELECT c.customer_id, c.full_name,
       count(*)            AS count_star,
       count(b.booking_id) AS count_bookings
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;`}
              caption="পনেরোটা Row। প্রথম চোদ্দজনের দুটো Column হুবহু এক, কারণ তাঁদের প্রতিটা Row একটা আসল Booking। শুধু শেষ Row এ পার্থক্য: Imran Kabir এর count_star ১, count_bookings ০। ভুলটা একজনের জন্য, আর সেই একজনই এই তালিকার আসল লক্ষ্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CountTrapLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "LEFT JOIN এর পরে ডান দিকের Key গুনুন",
          content: (
            <ContentParagraph>
              LEFT JOIN আর GROUP BY একসাথে থাকলে গোনার জন্য count(*) কখনো না। লিখুন count(ডান দিকের
              Primary Key), যেমন count(b.booking_id) বা count(t.tour_id)। জোড়াহীন দলের জন্য এটাই ০ দেয়।
            </ContentParagraph>
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
                  প্রতিটা Guide এর <code className={CODE}>full_name</code> আর তাঁর ট্যুরের সংখ্যা, যাঁর ট্যুর
                  নেই তাঁর পাশে ০। সবচেয়ে বেশি ট্যুর আগে, সমান হলে নামের বর্ণক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>guides g LEFT JOIN tours t</code>,{" "}
                  <code className={CODE}>count(t.tour_id)</code>, আর{" "}
                  <code className={CODE}>ORDER BY tours DESC, g.full_name</code>।
                </>
              }
              solution={`SELECT g.full_name, count(t.tour_id) AS tours
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
GROUP BY g.guide_id, g.full_name
ORDER BY tours DESC, g.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "sums",
      subHeader: { index: "010", title: "Sums and NULL" },
      title: <SectionTitle>যোগফল ফাঁকা কেন, আর ০ কীভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গোনার মতো যোগেও একই কথা, শুধু উল্টো দিক থেকে। sum(b.seats) NULL মানগুলো বাদ দিয়ে বাকিগুলো যোগ
                করে। Imran এর দলে একটাও NULL নয় এমন মান নেই, তাই sum এর কাছে যোগ করার কিছুই নেই। উত্তর ০ না,
                NULL। Report এ সেটা ফাঁকা ঘর হয়ে দেখা দেয়, আর App এ অনেক সময় সংখ্যা আশা করে Error ঘটায়।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান{" "}
                <Link href="/sql/topic/null-functions" className={LINK}>
                  Module 04 এর COALESCE
                </Link>
                : sum এর ফলাফল NULL হলে তার বদলে ০ বসান। Module 05 এর FILTER ও এখানে একইভাবে কাজ করে, যেমন শুধু
                confirmed Booking এর টাকা যোগ করতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Rahim আর Imran এর সিট"
              query={`SELECT c.full_name,
       sum(b.seats)              AS seats_sum,
       coalesce(sum(b.seats), 0) AS seats_total
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE c.customer_id IN (1, 15)
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;`}
              caption="Rahim Uddin এর দুই Column ই ৬। Imran Kabir এর seats_sum ফাঁকা, মানে NULL, আর seats_total ০। Report এ সবসময় দ্বিতীয়টা দেখান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Departure এ কয়টা Booking"
              query={`SELECT d.departure_id, d.tour_id, d.starts_on,
       count(b.booking_id) AS bookings,
       coalesce(sum(b.seats) FILTER (WHERE b.status <> 'cancelled'), 0) AS seats_held
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY d.departure_id
ORDER BY d.departure_id;`}
              caption="ষোলোটা Departure, প্রত্যেকে একবার। Departure 16 এর bookings ০ আর seats_held ০, কারণ কেউ বুক করেনি। Departure 12 এর একটা Booking আছে, কিন্তু সেটা বাতিল, তাই seats_held ০। LEFT JOIN, count এর Key, COALESCE আর FILTER: চারটা একসাথে একটা আসল Operations Report।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "where-trap",
      subHeader: { index: "011", title: "A WHERE That Undoes It" },
      title: <SectionTitle>যে WHERE চুপচাপ LEFT JOIN মুছে দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ফাঁদটা এত সাধারণ যে এখানেই একবার দেখে রাখা ভালো। ফারুক সাহেব বললেন, SMS এ শুধু confirmed
                Booking গুনতে হবে। তানিম LEFT JOIN এর পরে লিখলেন{" "}
                <code className={CODE}>WHERE b.status = &apos;confirmed&apos;</code>। ফলাফলে Imran আবার নেই, সাথে
                আরও দুজন।
              </ContentParagraph>
              <ContentParagraph>
                কেন? WHERE চলে Join এর পরে। Imran এর Row এ b.status NULL, আর NULL = &apos;confirmed&apos; সত্য
                না, অজানা। WHERE অজানা Row ফেলে দেয়। যে Row টা রাখার জন্যই LEFT JOIN লিখেছিলেন, WHERE ঠিক সেটাই
                মুছে দিল। ফলাফল INNER JOIN এর মতো হয়ে গেল, শুধু Query তে LEFT শব্দটা শোভা বাড়াচ্ছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE এ শর্ত, আর ON এ শর্ত"
              query={`SELECT count(*) AS rows, count(DISTINCT c.customer_id) AS customers
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed';

SELECT count(*) AS rows, count(DISTINCT c.customer_id) AS customers
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
                    AND b.status = 'confirmed';`}
              caption="প্রথমটা ১৭টা Row, Customer ১২ জন: Imran, Kamal Hasan (শুধু pending Booking) আর Sabbir Hossain (শুধু বাতিল) হারিয়ে গেছেন। দ্বিতীয়টা ২০টা Row, Customer ১৫ জন: শর্তটা ON এ গেলে সেটা ঠিক করে কোন Booking জোড়া হবে, কিন্তু কোনো Customer কে ফেলে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ডান দিকের Column এ WHERE দেখলে থামুন",
          content: (
            <ContentParagraph>
              LEFT JOIN এর পরে WHERE এ ডান দিকের Table এর কোনো Column এর শর্ত থাকলে (IS NULL ছাড়া), সেই
              LEFT JOIN প্রায় সবসময় INNER JOIN হয়ে গেছে। ON আর WHERE এর এই পার্থক্য পুরো বিস্তারিত, আরও Table
              সহ,{" "}
              <Link href="/sql/topic/multi-table-joins" className={LINK}>
                Joining Many Tables
              </Link>{" "}
              লেসনে। এখানে শুধু লক্ষণটা চিনে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "practice",
      subHeader: { index: "012", title: "Practice" },
      title: <SectionTitle>কোন প্রশ্নে কোন Join, আর হাতে কলমে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query লেখার আগের সবচেয়ে কাজের প্রশ্ন: উত্তরে কি জোড়াহীনরাও থাকবে, শুধু তারাই থাকবে, নাকি তারা
              থাকবে না? নিচের আটটা অনুরোধ Island Tours এর দলের কাছ থেকে আসা। প্রতিটার জন্য Join বেছে নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinChoiceLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  কোন Booking গুলোর জন্য কখনো কোনো Payment এর চেষ্টাই হয়নি? Payment Table এ যার একটাও Row নেই,
                  ব্যর্থ চেষ্টাও না। <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>status</code>, booking_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>bookings b LEFT JOIN payments p</code>, তারপর{" "}
                  <code className={CODE}>WHERE p.payment_id IS NULL</code> আর{" "}
                  <code className={CODE}>ORDER BY b.booking_id</code>।
                </>
              }
              solution={`SELECT b.booking_id, b.status
FROM bookings b
LEFT JOIN payments p ON p.booking_id = b.booking_id
WHERE p.payment_id IS NULL
ORDER BY b.booking_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              task={
                <>
                  কোন Departure এ কেউ একবারও বুক করেনি? <code className={CODE}>departure_id</code>,{" "}
                  <code className={CODE}>tour_id</code> আর <code className={CODE}>starts_on</code>, এই ক্রমে।
                </>
              }
              hint={
                <>
                  departures বাঁ দিকে, bookings ডান দিকে, আর IS NULL দিন{" "}
                  <code className={CODE}>b.booking_id</code> এ।
                </>
              }
              solution={`SELECT d.departure_id, d.tour_id, d.starts_on
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
WHERE b.booking_id IS NULL;`}
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
                  ফারুক সাহেবের SMS এর পুরো তালিকা: প্রতিটা Customer এর{" "}
                  <code className={CODE}>full_name</code>, তাঁর মোট Booking এর সংখ্যা (বাতিলসহ), আর শুধু
                  confirmed Booking থেকে খরচ করা মোট টাকা। কোনো Booking না থাকলে দুটো সংখ্যাই ০, NULL না।
                  সবচেয়ে বেশি খরচ আগে, সমান হলে নামের বর্ণক্রমে। তিনটা Column, এই ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>count(b.booking_id)</code> গোনার জন্য, টাকার জন্য{" "}
                  <code className={CODE}>coalesce(sum(b.total_bdt) FILTER (WHERE b.status = &apos;confirmed&apos;), 0)</code>
                  । WHERE এ status লিখবেন না, তাহলে Imran হারিয়ে যাবেন।
                </>
              }
              solution={`SELECT c.full_name,
       count(b.booking_id) AS bookings,
       coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS confirmed_spent
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY confirmed_spent DESC, c.full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ LEFT আর RIGHT JOIN</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের প্রায় সবকিছু MySQL এ হুবহু একই। LEFT JOIN, LEFT OUTER JOIN, RIGHT JOIN, IS NULL
                দিয়ে জোড়াহীন খোঁজা, count এর ফাঁদ, সব একই ফলাফল দেয়। MySQL 8.4 এ Sample Database Load করে এই
                লেসনের Query গুলো চালানো হয়েছে, পার্থক্য পাওয়া গেছে মাত্র দুটো জায়গায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["customers LEFT JOIN bookings", "২৫টা Row", "২৫টা Row"],
            ["LEFT OUTER JOIN লেখা", "চলে, একই অর্থ", "চলে, একই অর্থ"],
            ["bookings RIGHT JOIN customers", "২৫টা Row", "২৫টা Row"],
            ["Imran এর count(*) আর count(b.booking_id)", "১ আর ০", "১ আর ০"],
            ["ORDER BY b.booking_id এ NULL", "ছোট থেকে বড় সাজালে NULL শেষে", "ছোট থেকে বড় সাজালে NULL প্রথমে, Imran সবার উপরে"],
            ["FILTER (WHERE ...)", "চলে", "ERROR 1064, এর বদলে SUM(CASE WHEN ... END)"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "challenge-in-mysql.sql",
          code: `-- MySQL এ FILTER নেই, তাই শর্তটা CASE এর ভেতরে
SELECT c.full_name,
       COUNT(b.booking_id) AS bookings,
       COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_bdt END), 0) AS confirmed_spent
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY confirmed_spent DESC, c.full_name;
-- প্রথম চার Row: Nusrat Jahan 75000.00, Sumaiya Islam 70500.00,
-- Rahim Uddin 44000.00, Farhana Akter 36000.00; Imran Kabir এর টাকা 0.00`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "FULL OUTER JOIN এর কথা",
          content: (
            <ContentParagraph>
              দুই দিকের সবাইকে একসাথে রাখার Join, FULL OUTER JOIN, PostgreSQL এ আছে কিন্তু MySQL এ নেই। সেটা
              আর MySQL এ তার বিকল্প পরের লেসন{" "}
              <Link href="/sql/topic/full-outer-join" className={LINK}>
                FULL OUTER JOIN
              </Link>{" "}
              এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Admin Panel এর দুটো তালিকা</SectionTitle>,
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
                Island Tours এর Admin Panel এ দুটো পাতা এই লেসনের উপর দাঁড়িয়ে। প্রথমটা Customers পাতা: প্রতিটা
                Customer এর শহর, কয়টা Booking, শেষ কবে বুক করেছেন, আর confirmed Booking থেকে কত টাকা এসেছে।
                এখানে নতুন Account খোলা মানুষও থাকতেই হবে, কারণ Support এর লোকেরা তাঁদের ফোনও ধরেন। তাই LEFT
                JOIN, আর সব হিসাব জোড়াহীনদের জন্য নিরাপদ করে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Customers পাতা"
              query={`SELECT c.full_name, c.city,
       count(b.booking_id)     AS bookings,
       max(b.booked_at)::date  AS last_booked,
       coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS confirmed_spent
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name, c.city
ORDER BY last_booked DESC NULLS LAST, c.full_name;`}
              caption="পনেরোজন, সবচেয়ে সাম্প্রতিক Booking আগে। সবার উপরে Shuvo Das, শেষ বুক করেছেন 2026-10-14। Imran Kabir সবার নিচে: bookings ০, last_booked ফাঁকা কারণ কোনো তারিখই নেই, আর টাকা ০। NULLS LAST না দিলে PostgreSQL এ DESC সাজানোয় তাঁর ফাঁকা তারিখ সবার উপরে চলে আসত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয়টা Tours পাতা: প্রতিটা ট্যুরের কয়টা Departure, আর ধরে নিন আজ 1 November 2026, তাহলে
              পরের Departure কবে। যে ট্যুরের কোনো তারিখ নেই, সেটা Admin দের চোখে পড়া সবচেয়ে জরুরি, তাই সেটাও
              তালিকায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Tours পাতা"
              query={`SELECT t.title, t.is_active,
       count(d.departure_id) AS departures,
       min(d.starts_on) FILTER (WHERE d.starts_on >= DATE '2026-11-01') AS next_departure
FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
GROUP BY t.tour_id, t.title, t.is_active
ORDER BY t.tour_id;`}
              caption="নয়টা ট্যুর। Cox's Bazar Family Package এর departures ০ আর next_departure ফাঁকা, চালু ট্যুর অথচ বুক করার উপায় নেই। Saint Martin Luxury Stay বন্ধ (is_active f), তবু একটা তারিখ আছে 2027-02-14 এ। দুটোই Admin দের জন্য কাজের খবর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 8"
              orderMatters
              task={
                <>
                  Content Team প্রতিটা Destination এর পাতায় লিখবে কয়টা ট্যুর চালু আছে। প্রতিটা Destination এর{" "}
                  <code className={CODE}>name</code> আর সেখানে চালু (<code className={CODE}>is_active</code>)
                  ট্যুরের সংখ্যা, না থাকলে ০। সংখ্যা বেশি থেকে কম, সমান হলে নামের বর্ণক্রমে।
                </>
              }
              hint={
                <>
                  চালু ট্যুর গুনতে <code className={CODE}>count(t.tour_id) FILTER (WHERE t.is_active)</code>। WHERE
                  এ is_active দিলে Kuakata হারিয়ে যাবে।
                </>
              }
              solution={`SELECT d.name,
       count(t.tour_id) FILTER (WHERE t.is_active) AS active_tours
FROM destinations d
LEFT JOIN tours t ON t.destination_id = d.destination_id
GROUP BY d.destination_id, d.name
ORDER BY active_tours DESC, d.name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা LEFT JOIN Query লেখার পাঁচ ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নের মূল তালিকা চিনুন",
              description:
                "কার সবাইকে চাই? সব Customer, সব ট্যুর, সব Guide। সেই Table FROM এ, বাঁ দিকে। এই তালিকার কেউ হারাতে পারবে না।",
            },
            {
              title: "জোড়াহীন সম্ভব কিনা জিজ্ঞেস করুন",
              description:
                "বাঁ দিকে কি এমন Row থাকতে পারে যার জোড়া নেই? Imran, Kuakata, Nazmul এর মতো। হ্যাঁ হলে LEFT JOIN, না হলে INNER JOIN ই যথেষ্ট।",
            },
            {
              title: "ON এ Key মেলান, তারপর সব Row দেখুন",
              description:
                "GROUP BY আর WHERE ছাড়া চালিয়ে দেখুন NULL ভরা Row গুলো আসছে কিনা, আর কোথায়। Row সংখ্যা INNER JOIN এর চেয়ে কম হওয়ার কথা না।",
            },
            {
              title: "শুধু জোড়াহীন চাইলে IS NULL",
              description:
                "WHERE দিন ডান দিকের Primary Key তে IS NULL। ঐচ্ছিক Column না, যেমন comment। ডান দিকের অন্য কোনো শর্ত WHERE এ দেবেন না।",
            },
            {
              title: "গুনুন আর যোগ করুন নিরাপদে",
              description:
                "count(ডান দিকের Key), count(*) না। যোগফলে coalesce(..., 0)। শর্তযুক্ত হিসাব FILTER দিয়ে, WHERE দিয়ে না। শেষে জোড়াহীন একজনের Row আলাদা করে মিলিয়ে নিন।",
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
            ["\"সবাই\" চাই, অথচ INNER JOIN", "জোড়াহীনরা নিঃশব্দে হারায়, যেমন Imran", "মূল তালিকা বাঁ দিকে, LEFT JOIN"],
            ["ভুল Table বাঁ দিকে", "অন্য প্রশ্নের উত্তর, NULL অন্য জায়গায়", "যার সবাইকে চাই, সেটা FROM এ"],
            ["LEFT JOIN এর পরে count(*)", "Booking ছাড়া Customer এর পাশে ১", "count(b.booking_id)"],
            ["যোগফল যেমন আছে তেমন দেখানো", "জোড়াহীনদের ঘরে NULL, App এ Error", "coalesce(sum(...), 0)"],
            ["IS NULL ঐচ্ছিক Column এ", "জোড়া পাওয়া Row ও ঢুকে পড়ে, ১৪ এর বদলে ১৬", "ডান দিকের Primary Key তে IS NULL"],
            ["WHERE এ ডান দিকের শর্ত", "LEFT JOIN চুপচাপ INNER হয়ে যায়", "শর্ত ON এ, বা FILTER এ"],
            ["= NULL দিয়ে জোড়াহীন খোঁজা", "কোনো Row আসে না", "IS NULL"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="= NULL এর ভুল"
              query={`SELECT c.full_name
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booking_id = NULL;`}
              caption="শূন্য Row, কোনো Error ছাড়া। NULL = NULL ও সত্য না, অজানা। = কে IS এ বদলে আবার চালান, Imran Kabir চলে আসবেন।"
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
                  : Left Outer Join এর ছোট আর পরিষ্কার উদাহরণ, জোড়া না পেলে NULL বসানোর ব্যাখ্যাসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : Joined Tables অংশে LEFT, RIGHT আর FULL OUTER JOIN এর আনুষ্ঠানিক সংজ্ঞা, আর ON এর ভেতরের
                  শর্ত কীভাবে কাজ করে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: JOIN Clause
                  </a>
                  : MySQL এর Join এর পুরো লেখার নিয়ম, LEFT আর RIGHT JOIN এর উদাহরণসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Join_(SQL)"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Join (SQL)
                  </a>
                  : সব রকম Join এক জায়গায়, ছোট দুটো Table এর উদাহরণ দিয়ে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Join এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। LEFT আর RIGHT JOIN সেখানে যেমন দেখবেন, PostgreSQL এ হুবহু তেমনই চলে।
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
                  <strong>INNER JOIN</strong> জোড়াহীন Row নিঃশব্দে বাদ দেয়। প্রশ্নে &quot;সবাই&quot; থাকলে
                  সেটা ভুল উত্তর দিতে পারে।
                </ListItem>
                <ListItem>
                  <strong>LEFT JOIN</strong> বাঁ দিকের প্রতিটা Row অন্তত একবার রাখে। জোড়া না পেলে ডান দিকের সব
                  Column এ NULL বসায়। Row সংখ্যা INNER JOIN এর চেয়ে কখনো কম না।
                </ListItem>
                <ListItem>
                  বাঁ দিক মানে LEFT JOIN শব্দের আগে লেখা Table। যার সবাইকে চাই, সেটা FROM এ।
                </ListItem>
                <ListItem>
                  <strong>যা নেই তা খোঁজা:</strong> LEFT JOIN, তারপর WHERE ডান দিকের Primary Key IS NULL। ঐচ্ছিক
                  Column এ পরীক্ষা করলে ভুল Row ঢোকে।
                </ListItem>
                <ListItem>
                  <strong>RIGHT JOIN</strong> একই জিনিস আয়নায়। Table দুটোর জায়গা বদলে LEFT লিখলে পড়া সহজ হয়।
                </ListItem>
                <ListItem>
                  LEFT JOIN এর পরে count(*) জোড়াহীনকে ১ বলে। গুনুন ডান দিকের Key, যোগফলে coalesce।
                </ListItem>
                <ListItem>
                  WHERE এ ডান দিকের শর্ত LEFT JOIN কে চুপচাপ INNER বানায়। শর্তটা ON বা FILTER এ রাখুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                LEFT JOIN একদিকের সবাইকে রাখে। কিন্তু কখনো দুই দিকেই জোড়াহীন থাকে, আর দুই দিকের সবাইকেই দেখতে
                হয়: যেমন দুটো তালিকা মিলিয়ে দেখা, কোথায় কী বেশি আর কী কম। সেই Join, আর MySQL এ সেটা না থাকলে কী
                করতে হয়, পরের লেসন{" "}
                <Link href="/sql/topic/full-outer-join" className={LINK}>
                  FULL OUTER JOIN
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
      ["INNER JOIN এর ফাঁক", "জোড়াহীন Row নিঃশব্দে বাদ", "Imran Kabir তালিকায় নেই"],
      ["LEFT JOIN", "বাঁ দিকের প্রত্যেকে অন্তত একবার", "customers LEFT JOIN bookings: ২৫ Row"],
      ["NULL ভরা Row", "জোড়া না পেলে ডান দিকের সব Column NULL", "Imran এর booking_id NULL"],
      ["বাঁ দিক", "LEFT JOIN শব্দের আগের Table", "tours বাঁ দিকে Ratargul, guides বাঁ দিকে Nazmul"],
      ["Row সংখ্যার নিয়ম", "LEFT কখনো INNER এর চেয়ে কম না", "২৪ বনাম ২৫, ৯ বনাম ১০, ১৬ বনাম ১৭"],
      ["Anti Join", "LEFT JOIN আর WHERE ডান Key IS NULL", "Imran, Kuakata, Family Package, Nazmul"],
      ["কোন Column এ IS NULL", "ডান দিকের Primary Key", "review_id এ ১৪, comment এ ভুল ১৬"],
      ["RIGHT JOIN", "LEFT JOIN, উল্টো দিক থেকে", "bookings RIGHT JOIN customers: ২৫ Row"],
      ["count এর ফাঁদ", "count(*) NULL ভরা Row ও গোনে", "Imran: count(*) ১, count(b.booking_id) ০"],
      ["sum এর ফাঁদ", "জোড়াহীন দলে sum হয় NULL", "coalesce(sum(b.seats), 0)"],
      ["WHERE এর ফাঁদ", "ডান দিকের শর্ত WHERE এ দিলে LEFT হারায়", "১৭ Row বনাম ON এ শর্ত দিলে ২০"],
      ["MySQL", "একই আচরণ, শুধু NULL আগে সাজায় আর FILTER নেই", "SUM(CASE WHEN ... END)"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "LEFT JOIN কোন কথাটা নিশ্চিত করে?",
        options: [
          {
            key: "A",
            text: "ডান দিকের প্রতিটা Row ফলাফলে থাকবে",
            isCorrect: false,
            explanation: "এটা RIGHT JOIN এর কথা। LEFT JOIN এ ডান দিকের জোড়াহীন Row বাদ পড়ে, যেমন guides বাঁ দিকে থাকলে Ratargul এর ট্যুর আসে না।",
          },
          {
            key: "B",
            text: "বাঁ দিকের প্রতিটা Row অন্তত একবার ফলাফলে থাকবে",
            isCorrect: true,
            explanation: "ঠিক। জোড়া পেলে প্রতিটা জোড়ার জন্য একবার, না পেলে একবার NULL নিয়ে। তাই Imran Kabir তালিকায় থাকেন।",
          },
          {
            key: "C",
            text: "বাঁ দিকের প্রতিটা Row ঠিক একবার থাকবে",
            isCorrect: false,
            explanation: "একাধিক মিল হলে বাঁ দিকের Row একাধিকবার আসে। Shuvo Das এর দুটো Booking, তাই তিনি দুইবার।",
          },
          {
            key: "D",
            text: "ফলাফলে কোনো NULL থাকবে না",
            isCorrect: false,
            explanation: "উল্টো। জোড়া না পেলে LEFT JOIN নিজেই NULL বসায়, সেটাই তার চিহ্ন।",
          },
        ],
      },
      {
        id: 2,
        text: "customers এ ১৫ জন, bookings এ ২৪টা Row, আর একজন Customer এর কোনো Booking নেই। customers LEFT JOIN bookings কয়টা Row দেবে?",
        options: [
          {
            key: "A",
            text: "১৫",
            isCorrect: false,
            explanation: "Customer প্রতি একটা Row না। একাধিক Booking থাকা Customer একাধিকবার আসেন।",
          },
          {
            key: "B",
            text: "২৪",
            isCorrect: false,
            explanation: "এটা INNER JOIN এর উত্তর। LEFT JOIN জোড়াহীন Customer এর জন্য আরেকটা Row যোগ করে।",
          },
          {
            key: "C",
            text: "২৫",
            isCorrect: true,
            explanation: "ঠিক। ২৪টা আসল জোড়া আর Imran এর জন্য একটা NULL ভরা Row।",
          },
          {
            key: "D",
            text: "৩৬০",
            isCorrect: false,
            explanation: "১৫ গুণ ২৪, প্রতিটা Row এর সাথে প্রতিটা Row। এটা CROSS JOIN এর মতো, ON এর শর্ত থাকলে এমন হয় না।",
          },
        ],
      },
      {
        id: 3,
        text: "যাঁরা কখনো বুক করেননি, শুধু তাঁদের পেতে customers c LEFT JOIN bookings b এর পরে কী লিখবেন?",
        options: [
          {
            key: "A",
            text: "WHERE b.booking_id IS NULL",
            isCorrect: true,
            explanation: "ঠিক। ডান দিকের Primary Key শুধু জোড়াহীন Row এ NULL, তাই এটা ঠিক তাঁদেরই রাখে।",
          },
          {
            key: "B",
            text: "WHERE b.booking_id = NULL",
            isCorrect: false,
            explanation: "= NULL কখনো সত্য হয় না, অজানা হয়। কোনো Row আসে না।",
          },
          {
            key: "C",
            text: "WHERE c.customer_id IS NULL",
            isCorrect: false,
            explanation: "বাঁ দিকের Key কখনো NULL হয় না, LEFT JOIN বাঁ দিকের আসল মান রাখে। কোনো Row আসবে না।",
          },
          {
            key: "D",
            text: "WHERE b.status <> 'confirmed'",
            isCorrect: false,
            explanation: "এটা Imran কে ফেলে দেয়, কারণ তাঁর status NULL আর তুলনা অজানা। আসে শুধু pending আর বাতিল Booking।",
          },
        ],
      },
      {
        id: 4,
        text: "bookings LEFT JOIN reviews এর পরে Review ছাড়া Booking খুঁজতে WHERE r.comment IS NULL লিখলে কী হয়?",
        options: [
          {
            key: "A",
            text: "ঠিক ১৪টা Booking আসে",
            isCorrect: false,
            explanation: "১৪ আসে r.review_id দিয়ে। comment দিয়ে আসে ১৬।",
          },
          {
            key: "B",
            text: "যে Booking এর Review আছে কিন্তু মন্তব্য নেই, সেগুলোও ঢুকে পড়ে",
            isCorrect: true,
            explanation: "ঠিক। booking 4 আর 9 এর Review আছে, comment NULL। তাই উত্তর ১৬, যা ভুল।",
          },
          {
            key: "C",
            text: "Error আসে, কারণ comment Text Column",
            isCorrect: false,
            explanation: "Text Column এ IS NULL পুরোপুরি বৈধ। Error না, নিঃশব্দে ভুল সংখ্যা।",
          },
          {
            key: "D",
            text: "কোনো Row আসে না",
            isCorrect: false,
            explanation: "জোড়াহীন Row এ comment ও NULL, তাই তারা আসে। সমস্যা হলো বাড়তি দুটো Row ও আসে।",
          },
        ],
      },
      {
        id: 5,
        text: "customers LEFT JOIN bookings আর GROUP BY Customer এর পরে Imran Kabir এর জন্য count(*) কত?",
        options: [
          {
            key: "A",
            text: "০",
            isCorrect: false,
            explanation: "০ দেয় count(b.booking_id)। count(*) Row গোনে, আর Imran এর একটা Row আছে।",
          },
          {
            key: "B",
            text: "১",
            isCorrect: true,
            explanation: "ঠিক। LEFT JOIN এর বানানো NULL ভরা Row টাও একটা Row। তাই Booking শূন্য হলেও count(*) বলে ১।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: false,
            explanation: "count কখনো NULL দেয় না। কিছু না পেলে ০, আর এখানে একটা Row পেয়েছে।",
          },
          {
            key: "D",
            text: "Error, কারণ booking_id NULL",
            isCorrect: false,
            explanation: "NULL থাকা Row গোনায় কোনো Error হয় না।",
          },
        ],
      },
      {
        id: 6,
        text: "bookings b RIGHT JOIN customers c ON c.customer_id = b.customer_id এর ফলাফল কোনটার সমান?",
        options: [
          {
            key: "A",
            text: "bookings b LEFT JOIN customers c ON ...",
            isCorrect: false,
            explanation: "এটা সব Booking রাখে, Imran আসেন না। ২৪টা Row।",
          },
          {
            key: "B",
            text: "customers c LEFT JOIN bookings b ON ...",
            isCorrect: true,
            explanation: "ঠিক। দুটোই customers এর সবাইকে রাখে। Table এর জায়গা আর শব্দ দুটোই বদলালে ফলাফল একই, ২৫টা Row।",
          },
          {
            key: "C",
            text: "customers c JOIN bookings b ON ...",
            isCorrect: false,
            explanation: "INNER JOIN Imran কে বাদ দেয়, ২৪টা Row।",
          },
          {
            key: "D",
            text: "কোনোটাই না, RIGHT JOIN PostgreSQL এ চলে না",
            isCorrect: false,
            explanation: "RIGHT JOIN PostgreSQL আর MySQL দুটোতেই চলে।",
          },
        ],
      },
      {
        id: 7,
        text: "customers LEFT JOIN bookings এর পরে WHERE b.status = 'confirmed' লিখলে Imran Kabir এর কী হয়?",
        options: [
          {
            key: "A",
            text: "তিনি থাকেন, status এর ঘরে NULL নিয়ে",
            isCorrect: false,
            explanation: "WHERE চলে Join এর পরে, আর NULL = 'confirmed' অজানা। অজানা Row WHERE রাখে না।",
          },
          {
            key: "B",
            text: "তিনি বাদ পড়েন, আর Join কার্যত INNER হয়ে যায়",
            isCorrect: true,
            explanation: "ঠিক। শুধু Imran না, Kamal Hasan আর Sabbir Hossain ও বাদ পড়েন। শর্তটা ON এ নিলে পনেরোজনই থাকেন।",
          },
          {
            key: "C",
            text: "Error আসে",
            isCorrect: false,
            explanation: "কোনো Error নেই, সেটাই বিপদ। ১৭টা Row আসে, দেখতে স্বাভাবিক।",
          },
          {
            key: "D",
            text: "তিনি দুইবার আসেন",
            isCorrect: false,
            explanation: "তাঁর কোনো Booking ই নেই, দুইবার আসার প্রশ্নই নেই।",
          },
        ],
      },
      {
        id: 8,
        text: "LEFT JOIN এর পরে Imran Kabir এর sum(b.seats) কত, আর ০ দেখাতে কী লিখবেন?",
        options: [
          {
            key: "A",
            text: "০, আলাদা কিছু লাগে না",
            isCorrect: false,
            explanation: "sum যোগ করার মতো একটাও মান না পেলে ০ না, NULL দেয়।",
          },
          {
            key: "B",
            text: "NULL, আর coalesce(sum(b.seats), 0)",
            isCorrect: true,
            explanation: "ঠিক। COALESCE NULL এর বদলে ০ বসায়, Report এ ফাঁকা ঘর থাকে না।",
          },
          {
            key: "C",
            text: "NULL, আর sum(coalesce(b.seats, 1))",
            isCorrect: false,
            explanation: "এটা NULL ভরা Row কে ১ সিট হিসেবে ধরে, Imran এর পাশে ১ আসবে। ভুল উত্তর।",
          },
          {
            key: "D",
            text: "১, কারণ একটা Row আছে",
            isCorrect: false,
            explanation: "Row গোনে count(*), sum না। sum মান যোগ করে, আর এখানে কোনো মান নেই।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: যাদের কিছু নেই, তাদের তালিকা",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>স্বাগত SMS:</strong> যাঁরা কখনো বুক করেননি, তাঁদের নাম, ফোন আর Email বের করুন। তারপর একই
        প্রশ্ন INNER JOIN দিয়ে লেখার চেষ্টা করুন আর তিন লাইনে লিখুন কেন সেটা অসম্ভব।
      </span>,
      <span key="2">
        <strong>Destination Coverage:</strong> প্রতিটা Destination এ কয়টা ট্যুর আর কয়টা চালু ট্যুর, দুটোই, না
        থাকলে ০। একবার LEFT JOIN দিয়ে, একবার RIGHT JOIN দিয়ে। দুটো Output মিলিয়ে দেখান।
      </span>,
      <span key="3">
        <strong>Guide এর কাজের হিসাব:</strong> প্রতিটা Guide এর ট্যুরের সংখ্যা (০ সহ), আর আলাদা একটা Query তে
        Guide ছাড়া ট্যুর। দুটো Query তে কোন Table বাঁ দিকে রেখেছেন, আর কেন, লিখুন।
      </span>,
      <span key="4">
        <strong>Payment Follow-up:</strong> যে Booking গুলোর কোনো Payment এর চেষ্টাই হয়নি, তাদের booking_id, status
        আর total_bdt। প্রতিটা Booking এর status দেখে লিখুন, Support এর কাকে আগে ফোন করা উচিত।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> অভিভাবক সভার হাজিরা খাতার উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে
        বোঝান, LEFT JOIN কেন কাউকে হারায় না, আর count(*) কেন তখন মিথ্যা বলে।
      </span>,
    ],
    deliverables: [
      <span key="d1">স্বাগত SMS এর Query আর INNER JOIN কেন পারে না তার ব্যাখ্যা</span>,
      <span key="d2">LEFT আর RIGHT JOIN দিয়ে Destination Coverage এর দুটো মেলানো Output</span>,
      <span key="d3">Guide এর দুটো Query আর বাঁ দিক বাছাইয়ের কারণ</span>,
      <span key="d4">Payment Follow-up তালিকা আর অগ্রাধিকারের নোট</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ LEFT JOIN",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "INNER বনাম LEFT",
        description:
          "প্রথম ফাইলের দুটো Query চালান। ২৪ আর ২৫ মিলিয়ে নিন, তারপর বাড়তি Row টা কার, সেটা নিজে খুঁজে বের করুন।",
      },
      {
        title: "চারটা জোড়াহীন খোঁজা",
        description:
          "দ্বিতীয় ফাইলে চারটা Anti Join, প্রতিটা একটা Row দেয়। প্রতিটা Query তে কোন Table বাঁ দিকে, খাতায় লিখে রাখুন।",
      },
      {
        title: "IS NULL এর Column",
        description:
          "তৃতীয় ফাইলে ১৪ আর ১৬। বাড়তি দুটো Booking এর Review খুলে দেখুন, কেন তারা দ্বিতীয় Query তে ঢুকল।",
      },
      {
        title: "RIGHT JOIN এর আয়না",
        description:
          "চতুর্থ ফাইলে RIGHT JOIN, তারপর একই প্রশ্ন LEFT JOIN দিয়ে নিজে লিখুন। দুটোর Output হুবহু মিলতে হবে।",
      },
      {
        title: "গোনার ফাঁদ",
        description:
          "পঞ্চম ফাইলে count(*) আর count(b.booking_id) পাশাপাশি। শুধু একটা Row এ দুই Column আলাদা, কোনটা, আগে আন্দাজ করুন।",
      },
      {
        title: "Admin Panel এর দুই পাতা",
        description:
          "ষষ্ঠ ফাইলে Customers আর Tours পাতা। প্রথম লাইনে TimeZone Dhaka বসান, নইলে last_booked এর তারিখ আপনার মেশিনের সময় ধরে আসবে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-inner-vs-left.sql",
        code: `SELECT count(*) AS inner_rows
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id;
-- 24

SELECT count(*) AS left_rows
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id;
-- 25`,
      },
      {
        language: "sql",
        filename: "02-missing.sql",
        code: `SELECT c.full_name FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booking_id IS NULL;
-- (1 row) Imran Kabir

SELECT d.name FROM destinations d
LEFT JOIN tours t ON t.destination_id = d.destination_id
WHERE t.tour_id IS NULL;
-- (1 row) Kuakata

SELECT t.title FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
WHERE d.departure_id IS NULL;
-- (1 row) Cox's Bazar Family Package

SELECT g.full_name FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
WHERE t.tour_id IS NULL;
-- (1 row) Nazmul Karim`,
      },
      {
        language: "sql",
        filename: "03-is-null-column.sql",
        code: `SELECT count(*) FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.review_id IS NULL;
-- 14

SELECT count(*) FROM bookings b
LEFT JOIN reviews r ON r.booking_id = b.booking_id
WHERE r.comment IS NULL;
-- 16, booking 4 আর 9 বাড়তি`,
      },
      {
        language: "sql",
        filename: "04-right-join.sql",
        code: `SELECT count(*) FROM bookings b
RIGHT JOIN customers c ON c.customer_id = b.customer_id;
-- 25

SELECT c.full_name FROM bookings b
RIGHT JOIN customers c ON c.customer_id = b.customer_id
WHERE b.booking_id IS NULL;
-- (1 row) Imran Kabir`,
      },
      {
        language: "sql",
        filename: "05-counting.sql",
        code: `SELECT c.customer_id,
       count(*) AS count_star,
       count(b.booking_id) AS count_bookings
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY c.customer_id;
-- (15 rows), শুধু customer 15 এ 1 আর 0

SELECT g.full_name, count(t.tour_id) AS tours
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
GROUP BY g.guide_id, g.full_name
ORDER BY tours DESC, g.full_name;
-- (5 rows), Nazmul Karim 0`,
      },
      {
        language: "sql",
        filename: "06-admin-pages.sql",
        code: `SET TIME ZONE 'Asia/Dhaka';

SELECT c.full_name, count(b.booking_id) AS bookings,
       max(b.booked_at)::date AS last_booked,
       coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS confirmed_spent
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY last_booked DESC NULLS LAST, c.full_name;
-- (15 rows), প্রথমে Shuvo Das 2026-10-14, শেষে Imran Kabir

SELECT t.title, count(d.departure_id) AS departures
FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
GROUP BY t.tour_id, t.title
ORDER BY t.tour_id;
-- (9 rows), Cox's Bazar Family Package 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা LEFT JOIN লেখার পরে একবার GROUP BY আর WHERE ছাড়া চালিয়ে NULL ভরা Row গুলো চোখে দেখুন। যে Row
        টা রাখার জন্য LEFT JOIN লিখেছেন, শেষ ফলাফলেও সেটা আছে কিনা, প্রতিবার মিলিয়ে নিন।
      </ContentParagraph>
    ),
  },
};
