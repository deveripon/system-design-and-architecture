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
  ChainBuildLab,
  JoinTrapLab,
  OnVsWhereLab,
} from "../../../components/course/topics/joins/multi-animations";
import {
  FanOutDiagram,
  JoinChainMapDiagram,
  LeftChainTrapDiagram,
  OnVsWhereSplit,
} from "../../../components/course/topics/joins/multi-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const multiTableJoinsContent: TopicData = {
  id: "multi-table-joins",
  introduction: {
    badge: "MODULE 06 · LESSON 07",
    title: <SectionTitle>ছয়টা Table, একটা উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতক্ষণ আপনি দুটো Table জোড়া দিয়েছেন: Booking এর পাশে Customer এর নাম, Tour এর পাশে
          Destination। কিন্তু বাস্তবের প্রশ্ন প্রায় কখনো দুটো Table এ শেষ হয় না। Guide দের সাপ্তাহিক
          তালিকা চায় Booking, Customer, Departure, Tour, Destination আর Guide, ছয়টা Table একসাথে। মালিকের
          Report চায় Destination থেকে Booking পর্যন্ত চারটা ধাপ। এই লেসন সেই লম্বা শিকল নিয়ে।
        </ContentParagraph>
        <ContentParagraph>
          শিকলের প্রতিটা আংটা আপনি আগের লেসনগুলোতে চিনেছেন। নতুন যা, তা হলো আংটাগুলো একসাথে জুড়লে কী
          ঘটে। একটা INNER JOIN আগের তিনটা LEFT JOIN এর কাজ চুপচাপ নষ্ট করে দিতে পারে। একটা শর্ত ON
          থেকে WHERE এ সরালে তিনজন Customer Report থেকে উধাও হয়ে যান। আর ভুল জায়গায় যোগ করলে একই টাকা
          দুইবার গোনা হয়। এর কোনোটাই Error দেয় না। Query চলে, সংখ্যা আসে, শুধু সংখ্যাটা ভুল।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি ছয়টা Table এর Query নিজে পরিকল্পনা করে লিখতে পারবেন, প্রতিটা Join এর পরে
          কয়টা Row থাকার কথা আগেই আন্দাজ করতে পারবেন, আর এই তিনটা নিঃশব্দ ফাঁদ দেখামাত্র চিনতে পারবেন।
          প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি প্রতিবার আগের ফলাফলটা হাতে নিই আর পরের Table এর সাথে জোড়া খুঁজি। যার জোড়া মেলে না, INNER হলে তাকে ফেলে দিই, LEFT হলে NULL বসিয়ে রাখি। শিকল যত লম্বা হোক, আমি এক ধাপে একটাই কাজ করি।",
      author: "JOIN",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>যে নৌকাটা কেউ ঠিক করেনি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার, 1 November 2026। Island Tours এর Manager ফারুক সাহেবের সাপ্তাহিক বৈঠক। Guide রা
                জানতে চাইলেন, এই মৌসুমে কোন Booking এ কে যাচ্ছেন, কোন ট্যুর, কোন জায়গা, আর কোন Guide এর
                দায়িত্ব। ফারুক সাহেব নতুন Developer তানিমকে বললেন, প্রতিটা Booking এর পাশে Customer এর
                নাম, ট্যুরের নাম, Destination আর Guide এর নাম দিয়ে একটা তালিকা বানিয়ে দিতে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম জানেন দুটো Table কীভাবে জোড়া দিতে হয়। তিনি একটার পর একটা JOIN লিখে গেলেন: bookings
                থেকে customers, departures, tours, destinations, শেষে guides। Query চলল, কোনো Error নেই,
                তালিকাটা দেখতেও সুন্দর। তালিকা গেল Guide দের কাছে।
              </ContentParagraph>
              <ContentParagraph>
                ২১ November সকালে Sylhet এর Ratargul এ Farhana Akter তিনজনকে নিয়ে ঘাটে দাঁড়িয়ে আছেন। নৌকা
                নেই, Guide নেই। কেউ জানতই না যে এই Booking আছে। খোঁজ নিয়ে দেখা গেল তানিমের তালিকায় Row
                ছিল ২৩টা, অথচ Booking আছে ২৪টা। Ratargul ট্যুরের এখনো কোনো Guide ঠিক হয়নি, তার guide_id
                খালি, মানে NULL। শেষের JOIN guides সেই Booking এর জোড়া খুঁজে পায়নি, আর INNER JOIN জোড়া না
                পেলে Row টা নিঃশব্দে ফেলে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের পুরোটা এমন নিঃশব্দ ভুল নিয়ে। একটা ছোট শিকলে যা নিরীহ, লম্বা শিকলে সেটাই বিপদ,
                কারণ একটা ভুল ধাপ পরের সব ধাপের ফলাফল বদলে দেয়, আর শেষ ফলাফল দেখে বোঝার উপায় থাকে না
                কোন ধাপে কী হারাল। তাই আমরা শিকলটা ধাপে ধাপে গড়ব, আর প্রতিটা ধাপের পরে Row গুনব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "লম্বা শিকলের তিনটা নিঃশব্দ ফাঁদ",
          content: (
            <ContentList>
              <ListItem>
                <strong>হারিয়ে যাওয়া Row:</strong> কোনো এক ধাপে জোড়া না মিললে INNER JOIN Row ফেলে দেয়,
                আর পরের LEFT JOIN সেটা ফেরত আনতে পারে না।
              </ListItem>
              <ListItem>
                <strong>ভুল জায়গার শর্ত:</strong> LEFT JOIN এর ডান দিকের Table এর শর্ত WHERE এ দিলে LEFT JOIN
                এর রাখা Row গুলো আবার বাদ পড়ে।
              </ListItem>
              <ListItem>
                <strong>Fan-out:</strong> এক দিকের একটা Row অন্য দিকের অনেক Row এর সাথে জোড়া হলে সেই Row এর
                সংখ্যা বারবার আসে, আর যোগফল ফুলে ওঠে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "reading-the-map",
      subHeader: { index: "002", title: "Reading the Map" },
      title: <SectionTitle>Query লেখার আগে মানচিত্র দেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঢাকা থেকে বান্দরবান যেতে হলে আগে মানচিত্রে রাস্তাটা দেখে নেন: ঢাকা থেকে চট্টগ্রাম, চট্টগ্রাম
                থেকে বান্দরবান। সরাসরি রাস্তা না থাকলে মাঝের শহর দিয়ে যেতে হয়। Database এও ঠিক তাই। দুটো
                Table এর মধ্যে সরাসরি চাবি না থাকলে মাঝের Table দিয়ে যেতে হয়। Booking থেকে Guide এর সরাসরি
                কোনো চাবি নেই। Booking জানে তার Departure, Departure জানে তার Tour, আর Tour জানে তার Guide।
              </ContentParagraph>
              <ContentParagraph>
                তাই লম্বা Query লেখার প্রথম কাজ কীবোর্ডে না, মানচিত্রে। তিনটা প্রশ্নের উত্তর আগে ঠিক করুন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ফলাফলের এক Row মানে কী?</strong> এক Booking, এক Customer, নাকি এক Destination? এটাই
                  ঠিক করে শিকল কোন Table থেকে শুরু হবে।
                </ListItem>
                <ListItem>
                  <strong>কোন কোন Column লাগবে, আর সেগুলো কোন Table এ?</strong> Customer এর নাম customers এ,
                  ট্যুরের নাম tours এ, Guide এর নাম guides এ।
                </ListItem>
                <ListItem>
                  <strong>শুরুর Table থেকে প্রতিটা দরকারি Table পর্যন্ত চাবির রাস্তা কী?</strong> মাঝের যে
                  Table এর কোনো Column আপনি দেখাবেন না, তাকেও শিকলে রাখতে হয়, কারণ রাস্তা তার উপর দিয়ে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinChainMapDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ফারুক সাহেবের তালিকায় এক Row মানে এক Booking, তাই শুরু bookings থেকে। Customer এর নাম পেতে
              এক লাফ, ট্যুরের নাম পেতে দুই লাফ: departures হয়ে tours। departures এর কোনো Column তালিকায় নেই,
              তবু তাকে বাদ দেওয়া যায় না। নিচের বক্সে প্রথম চার Table এর শিকল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার Table: Booking, Customer, Departure, Tour"
              query={`SELECT b.booking_id,
       c.full_name,
       t.title,
       d.starts_on
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
ORDER BY b.booking_id;`}
              caption="২৪টা Row, প্রতিটা Booking ঠিক একবার। departures থেকে শুধু starts_on দেখানো হয়েছে, কিন্তু তাকে বাদ দিলেও শিকলে রাখতেই হতো, কারণ bookings থেকে tours এ যাওয়ার একমাত্র রাস্তা departures।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "one-join-at-a-time",
      subHeader: { index: "003", title: "One Join at a Time" },
      title: <SectionTitle>Database শিকল গড়ে এক আংটা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পাঁচটা JOIN দেখে মনে হতে পারে Database ছয়টা Table একসাথে মেলায়। আসলে ধারণাটা এর চেয়ে
                সহজ। প্রথম JOIN দুটো Table জোড়া দিয়ে একটা মধ্যবর্তী ফলাফল বানায়। দ্বিতীয় JOIN সেই
                ফলাফলটাকে একটা Table হিসেবে নেয়, আর তার সাথে তৃতীয় Table জোড়া দেয়। এভাবে প্রতিটা JOIN
                আগের ফলাফল আর নতুন একটা Table নিয়ে কাজ করে। একটা দড়িতে একটা একটা করে গিঁট দেওয়ার মতো।
              </ContentParagraph>
              <ContentParagraph>
                এই ছবিটা মাথায় থাকলে একটা দারুণ অভ্যাস তৈরি হয়: প্রতিটা ধাপের পরে Row সংখ্যা আন্দাজ করা।
                bookings এ ২৪টা Row। প্রতিটা Booking এর ঠিক একজন Customer, তাই customers জোড়ার পরেও ২৪।
                প্রতিটা Booking এর ঠিক একটা Departure, প্রতিটা Departure এর ঠিক একটা Tour, প্রতিটা Tour এর
                ঠিক একটা Destination। তাই পাঁচ Table পর্যন্ত সংখ্যাটা ২৪ এই থাকার কথা। এক দিকের প্রতিটা Row
                অন্য দিকের ঠিক একটা Row পেলে Join Row বাড়ায়ও না, কমায়ও না।
              </ContentParagraph>
              <ContentParagraph>
                ছয় নম্বর ধাপে প্রথমবার আন্দাজটা ভাঙে। প্রতিটা Tour এর ঠিক একজন Guide নেই, Ratargul এর কেউ
                নেই। নিচের Lab এ শিকলটা নিজে এক ধাপ এক ধাপ করে গড়ুন। শেষ ধাপে guides এর Join INNER আর LEFT
                করে বদলে দেখুন, আর একটা Booking বেছে নিয়ে তার চাবি ধরে Table থেকে Table এ হাঁটুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ChainBuildLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Row সংখ্যা কখন বদলায়",
          content: (
            <ContentList>
              <ListItem>
                প্রতিটা Row অন্য দিকে <strong>ঠিক একটা</strong> জোড়া পেলে সংখ্যা একই থাকে।
              </ListItem>
              <ListItem>
                কোনো Row <strong>একটাও</strong> জোড়া না পেলে INNER JOIN এ সংখ্যা কমে, LEFT JOIN এ একই থাকে।
              </ListItem>
              <ListItem>
                কোনো Row <strong>একাধিক</strong> জোড়া পেলে সংখ্যা বাড়ে। এটাই পরে Fan-out এর উৎস।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "six-tables",
      subHeader: { index: "004", title: "Six Tables" },
      title: <SectionTitle>পুরো শিকল, আর ২৩ বনাম ২৪</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তানিমের পুরো Query, প্রথমে তিনি যেভাবে লিখেছিলেন। পাঁচটা JOIN ই INNER। প্রথম Statement
              পুরো তালিকা দেখায়, দ্বিতীয়টা শুধু গোনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের তালিকা, সব INNER JOIN"
              query={`SELECT b.booking_id,
       c.full_name  AS customer,
       t.title      AS tour,
       ds.name      AS destination,
       g.full_name  AS guide
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
JOIN guides       g  ON g.guide_id        = t.guide_id
ORDER BY b.booking_id;

SELECT count(*) AS rows_in_list
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
JOIN guides       g  ON g.guide_id        = t.guide_id;`}
              caption="২৩টা Row। তালিকায় 20 এর পরে সোজা 22, Booking 21 নেই। সেটা Farhana Akter এর Ratargul Swamp Boat Day, যার ট্যুরের guide_id NULL। guides এর কোনো Row এর guide_id NULL এর সমান হতে পারে না, তাই জোড়া মেলেনি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ঠিক করতে একটা শব্দই যথেষ্ট: শেষ Join টা LEFT। এখন Ratargul এর Booking থাকবে, আর Guide এর ঘরে
              বসবে NULL। তালিকাটা যে মানুষ পড়বেন, তাঁর জন্য NULL এর বদলে স্পষ্ট লেখা দেওয়া ভালো, তাই
              Module 04 এর COALESCE দিয়ে লিখে দিন &ldquo;No guide yet&rdquo;।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শেষ Join LEFT: সব ২৪টা Booking"
              query={`SELECT b.booking_id,
       c.full_name                            AS customer,
       t.title                                AS tour,
       ds.name                                AS destination,
       coalesce(g.full_name, 'No guide yet')  AS guide
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
LEFT JOIN guides  g  ON g.guide_id        = t.guide_id
ORDER BY b.booking_id;`}
              caption="২৪টা Row। Booking 21 ফিরে এসেছে, তার Guide এর ঘরে No guide yet। এই তালিকা গেলে Ratargul এর ঘাটে কেউ একা দাঁড়িয়ে থাকতেন না, কারণ ফাঁকা ঘরটা সবার চোখে পড়ত।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন Join LEFT হবে, সেটা ঠিক করে Data এর নিয়ম",
          content: (
            <ContentParagraph>
              প্রতিটা Join এর জন্য একটা প্রশ্ন করুন: এই চাবি কি কখনো খালি থাকতে পারে, বা এর জোড়া কি কখনো
              না থাকতে পারে? bookings.customer_id এ NOT NULL আর Foreign Key আছে, তাই জোড়া সবসময় মিলবে,
              INNER নিরাপদ। tours.guide_id এ NOT NULL নেই, তাই সেখানে LEFT লাগে। Table এর গঠন দেখতে Module 02
              এর <code className={CODE}>\d tours</code> কাজে আসে।
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
                  প্রতিটা Booking এর <code className={CODE}>booking_id</code>, Customer এর{" "}
                  <code className={CODE}>full_name</code>, ট্যুরের <code className={CODE}>title</code> আর
                  Departure এর <code className={CODE}>starts_on</code> দেখান। চারটা Column, এই ক্রমে,
                  booking_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  শুরু <code className={CODE}>bookings b</code> থেকে। customers আর departures দুটোই bookings
                  এর সাথে জোড়া লাগে, tours জোড়া লাগে departures এর সাথে।
                </>
              }
              orderMatters
              solution={`SELECT b.booking_id, c.full_name, t.title, d.starts_on
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "order-does-not-matter",
      subHeader: { index: "005", title: "Order and INNER JOIN" },
      title: <SectionTitle>INNER JOIN এর ক্রম বদলালে উত্তর বদলায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা প্রশ্ন স্বাভাবিকভাবেই আসে: শিকল bookings থেকে শুরু না করে tours থেকে শুরু করলে কি
                অন্য উত্তর আসবে? সব Join INNER হলে উত্তর একই। INNER JOIN এর অর্থ শুধু এটুকু: যে Row গুলোর
                সব চাবি মেলে, শুধু সেগুলো থাকে। কোন জোড়াটা আগে দেখা হলো, তাতে কোন Row গুলো শেষে টিকবে সেটা
                বদলায় না। দুইয়ে তিন যোগ করে চার যোগ করুন, বা চারে তিন যোগ করে দুই, যোগফল একই।
              </ContentParagraph>
              <ContentParagraph>
                এই কারণেই PostgreSQL এর Planner নিজের পছন্দমতো ক্রমে INNER JOIN চালায়। আপনি যে ক্রমে
                লিখেছেন, সে সেই ক্রমে চালাতে বাধ্য নয়। যে ক্রমে কম কাজ, সে সেটা বেছে নেয়। Planner কীভাবে
                বাছে, সেটা Module 13 এর বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই পাঁচ Table, দুই ক্রমে"
              query={`-- ক্রম ১: bookings থেকে শুরু
SELECT b.booking_id, c.full_name, t.title, ds.name
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
ORDER BY b.booking_id
LIMIT 5;

-- ক্রম ২: destinations থেকে উল্টো দিকে
SELECT b.booking_id, c.full_name, t.title, ds.name
FROM destinations ds
JOIN tours      t ON t.destination_id = ds.destination_id
JOIN departures d ON d.tour_id        = t.tour_id
JOIN bookings   b ON b.departure_id   = d.departure_id
JOIN customers  c ON c.customer_id    = b.customer_id
ORDER BY b.booking_id
LIMIT 5;`}
              caption="দুটো ফলাফল হুবহু এক: Booking 1 থেকে 5, একই নাম, একই ট্যুর। LIMIT সরিয়ে দুটোই চালালে দুটোতেই ২৪টা Row। ক্রম ২ এ Kuakata বা Family Package এর মতো জোড়াহীন Row গুলো মাঝপথে বাদ পড়ে, ক্রম ১ এ সেগুলো কখনো ঢোকেই না, শেষ ফল একই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এই স্বাধীনতা শুধু INNER JOIN এর",
          content: (
            <ContentParagraph>
              শিকলে একটাও LEFT JOIN থাকলে ক্রম গুরুত্বপূর্ণ হয়ে যায়। LEFT JOIN এর বাঁ দিক আর ডান দিক
              আলাদা ভূমিকা পালন করে: বাঁ দিকের সব Row থাকে, ডান দিকেরটা ঐচ্ছিক। কোন Table কোন দিকে পড়ল,
              সেটা ক্রমই ঠিক করে। পরের তিনটা Section সেই গল্প।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "aliases-and-ambiguity",
      subHeader: { index: "006", title: "Aliases and Ambiguity" },
      title: <SectionTitle>একই নামের দুটো Column</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছয়টা Table মানে অনেক Column, আর তার কিছু একই নামের। customers এ full_name আছে, guides এও
                full_name আছে। দুটো Table জোড়া দেওয়ার পরে শুধু <code className={CODE}>full_name</code>{" "}
                লিখলে Database বুঝতে পারে না কোনটা চাইছেন। সে আন্দাজ করে না, থেমে যায়।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো প্রতিটা Column এর আগে Table এর Alias লেখা: <code className={CODE}>c.full_name</code>{" "}
                আর <code className={CODE}>g.full_name</code>। লম্বা শিকলে নিয়মটা আরও কড়া করুন: যে Column
                এখন অনন্য, সেটার আগেও Alias লিখুন। আজ title শুধু tours এ আছে, কাল কেউ destinations এ title
                নামে Column যোগ করলে আপনার পুরনো Query হঠাৎ ভাঙবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="full_name কার? Database জানে না"
              query={`SELECT b.booking_id, full_name
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
JOIN guides     g ON g.guide_id     = t.guide_id;`}
              caption="ERROR: column reference &quot;full_name&quot; is ambiguous। দুটো Table এই নামের Column দিচ্ছে। c.full_name লিখে চালান, তারপর g.full_name। দুটো আলাদা উত্তর, কারণ একটা Customer এর নাম, অন্যটা Guide এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Alias দিয়ে ঠিক করার পরে আরেকটা কাজ বাকি থাকে: ফলাফলের Column এর নাম। দুটোকেই{" "}
              <code className={CODE}>full_name</code> নামে দেখালে যিনি তালিকা পড়বেন, তিনিও বুঝবেন না কোনটা
              কার। তাই <code className={CODE}>AS customer</code> আর{" "}
              <code className={CODE}>AS guide</code> দিয়ে নাম দিয়ে দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Alias দিয়ে দুই নামই, আলাদা শিরোনামে"
              query={`SELECT b.booking_id,
       c.full_name AS customer,
       g.full_name AS guide
FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id
LEFT JOIN guides g ON g.guide_id    = t.guide_id
WHERE b.booking_id IN (1, 9, 21)
ORDER BY b.booking_id;`}
              caption="তিনটা Row: Booking 1 এর Customer Rahim Uddin আর Guide Jamal Hossain, Booking 9 এর Sumaiya Islam আর Ayesha Siddiqua, Booking 21 এর Farhana Akter আর Guide এর ঘরে NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এক Query তে একটা Alias একবারই",
          content: (
            <ContentParagraph>
              একই Alias দুই Table কে দিলে PostgreSQL থামিয়ে দেয়: table name &quot;d&quot; specified more than
              once। একই Table দুইবার দরকার হলে দুটো আলাদা Alias দিন, যেমন Self Join এ দেখেছেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "filtering-the-chain",
      subHeader: { index: "007", title: "Filtering Across the Chain" },
      title: <SectionTitle>যে Table শুধু শর্তের জন্য আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শিকল একবার গড়া হয়ে গেলে WHERE শিকলের যেকোনো Table এর Column দেখতে পারে। চট্টগ্রাম বিভাগে
                শীতের ভিড়ের জন্য অতিরিক্ত গাড়ি লাগবে কিনা, সেটা বুঝতে Operations জানতে চায় কোন কোন Booking
                চট্টগ্রাম বিভাগের কোনো জায়গায়। বিভাগের নাম আছে destinations এর region Column এ, চার লাফ
                দূরে।
              </ContentParagraph>
              <ContentParagraph>
                লক্ষ করুন, তালিকায় destinations থেকে হয়তো কিছুই দেখানোর নেই, তবু শর্তের জন্যই তাকে শিকলে
                আনতে হয়। আর তাকে আনতে হলে মাঝের departures আর tours ও আনতে হয়। শিকলের দৈর্ঘ্য ঠিক করে
                দেখানো Column আর শর্তের Column, দুটো মিলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চট্টগ্রাম বিভাগের Booking"
              query={`SELECT b.booking_id, c.full_name, t.title
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
WHERE ds.region = 'Chattogram'
  AND b.status <> 'cancelled'
ORDER BY b.booking_id;`}
              caption="তেরোটা Row। চট্টগ্রাম বিভাগে চারটা জায়গা: Saint Martin's Island, Cox's Bazar, Sajek Valley আর Bandarban, সেখানে Booking মোট ষোলোটা। শর্ত দুই Table এর Column এ: region destinations এর, status bookings এর। তিনটা বাতিল Booking, 5, 12 আর 18, status এর শর্তে বাদ পড়েছে।"
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
                  চট্টগ্রাম বিভাগের (region <code className={CODE}>&apos;Chattogram&apos;</code>) সব Booking,
                  বাতিলগুলো সহ। দেখান <code className={CODE}>booking_id</code>, Customer এর{" "}
                  <code className={CODE}>full_name</code> আর Destination এর{" "}
                  <code className={CODE}>name</code>, booking_id অনুযায়ী ছোট থেকে বড়।
                </>
              }
              hint={
                <>
                  Destination এর নাম আর region দুটোই destinations এ। সেখানে পৌঁছাতে bookings, departures,
                  tours হয়ে যেতে হয়। এবার status এর কোনো শর্ত নেই।
                </>
              }
              orderMatters
              solution={`SELECT b.booking_id, c.full_name, ds.name
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
WHERE ds.region = 'Chattogram'
ORDER BY b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "left-chains",
      subHeader: { index: "008", title: "LEFT Chains" },
      title: <SectionTitle>সবাইকে রাখা, শেষ আংটা পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার প্রশ্নটা উল্টো দিক থেকে। Marketing প্রতিটা Customer এর পাশে তাঁর ট্যুরগুলো দেখতে চায়,
                আর এমন Customer ও তালিকায় চায় যাঁরা এখনো কিছু বুক করেননি, কারণ তাঁদের কাছেই প্রথম অফার
                যাবে। ফলাফলের এক Row এখন এক Customer আর তাঁর এক Booking, আর শিকল শুরু customers থেকে।
              </ContentParagraph>
              <ContentParagraph>
                Imran Kabir এর কোনো Booking নেই। bookings এর সাথে LEFT JOIN করলে তাঁর Row থাকে, Booking এর
                সব ঘরে NULL। কিন্তু শিকল এখানে শেষ না। ট্যুরের নাম পেতে আরও দুই লাফ: departures আর tours।
                আর এই পরের লাফগুলোতেও Imran এর Row কে বাঁচিয়ে রাখতে হবে। তাঁর booking এর departure_id
                NULL, তাই departures এর সাথে তাঁর জোড়া মিলবে না। এখানেও LEFT না হলে তিনি হারাবেন।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা এক লাইনে: <strong>শিকলে একবার LEFT JOIN শুরু হলে, সেই শাখার পরের প্রতিটা Join ও
                LEFT হতে হবে।</strong> কারণ পরের প্রতিটা Join এর চাবি আসে সেই ঐচ্ছিক Table থেকে, যেটা NULL
                হতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer, তাঁর ট্যুর সহ"
              query={`SELECT c.customer_id,
       c.full_name,
       b.booking_id,
       t.title
FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
LEFT JOIN tours      t ON t.tour_id      = d.tour_id
ORDER BY c.customer_id, b.booking_id;`}
              caption="২৫টা Row: ২৪টা Booking, আর শেষে Imran Kabir এর একটা Row যার booking_id আর title দুটোই NULL। Customer যাঁর দুই বা তিনটা Booking, তাঁর নাম দুই বা তিনবার আসে, কারণ এক Row মানে এক Customer আর তাঁর এক Booking।"
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
                  প্রতিটা Customer এর <code className={CODE}>full_name</code>, তাঁর প্রতিটা Booking এর{" "}
                  <code className={CODE}>booking_id</code> আর সেই Booking এর Departure এর{" "}
                  <code className={CODE}>starts_on</code>। যাঁর কোনো Booking নেই, তিনিও একটা Row এ থাকবেন।
                  তিনটা Column, customer_id অনুযায়ী, তারপর booking_id অনুযায়ী সাজানো।
                </>
              }
              hint={
                <>
                  শুরু customers থেকে, তারপর bookings আর departures দুটোই LEFT JOIN। ORDER BY তে{" "}
                  <code className={CODE}>c.customer_id, b.booking_id</code>, যদিও customer_id দেখানো হচ্ছে না।
                </>
              }
              orderMatters
              solution={`SELECT c.full_name, b.booking_id, d.starts_on
FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
ORDER BY c.customer_id, b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "late-inner-join",
      subHeader: { index: "009", title: "The Late INNER JOIN" },
      title: <SectionTitle>একটা শব্দ বাদ পড়লে পুরো শিকল ভাঙে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের Query তে শেষ Join এ LEFT লিখতে ভুলে গেলে কী হয়? দুটো LEFT JOIN Imran কে যত্ন করে
                বাঁচিয়ে রেখেছিল। তৃতীয় Join INNER, তার শর্ত{" "}
                <code className={CODE}>t.tour_id = d.tour_id</code>। Imran এর Row এ d.tour_id NULL। NULL এর সাথে
                যেকোনো তুলনার উত্তর অজানা, আর Module 03 এ দেখেছেন, অজানা মানে সত্য না। INNER JOIN সত্য ছাড়া
                কিছু রাখে না। Imran হারিয়ে যান, আর আগের দুটো LEFT JOIN এর পুরো পরিশ্রম বৃথা।
              </ContentParagraph>
              <ContentParagraph>
                ভয়ের ব্যাপার হলো, শিকল যত লম্বা, এই ভুল তত সহজে চোখ এড়ায়। কেউ পরে Query তে একটা নতুন
                Table যোগ করলেন, অভ্যাসবশত লিখলেন JOIN, আর Report থেকে নিঃশব্দে কিছু Row উধাও হলো। কোনো Error
                নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LeftChainTrapDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শেষ Join টা INNER হলে"
              query={`SELECT count(*) AS all_left
FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
LEFT JOIN tours      t ON t.tour_id      = d.tour_id;

SELECT count(*) AS last_one_inner
FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
JOIN tours           t ON t.tour_id      = d.tour_id;`}
              caption="প্রথমটা ২৫, দ্বিতীয়টা ২৪। একটা শব্দের পার্থক্য, আর একজন Customer পুরো তালিকা থেকে নেই। যে Marketing Campaign শুধু নতুন Customer দের জন্য, সেটা এই Query তে কোনো নতুন Customer ই পাবে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই ফাঁদ Tour এর দিক থেকেও। মালিক চান প্রতিটা ট্যুরের পাশে তার Departure আর Booking, আর
                Customer এর নাম। বিক্রি না হওয়া ট্যুর তালিকায় থাকা জরুরি, কারণ সেগুলো নিয়েই আলোচনা: বন্ধ
                থাকা Saint Martin Luxury Stay এর একটা Departure আছে কিন্তু Booking নেই, আর Cox&apos;s Bazar
                Family Package এর Departure ই নেই। নিচের Lab এ শেষ Join টা তিনভাবে লিখে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <JoinTrapLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সমাধান দুটো। প্রথমটা সোজা: শিকলের বাকি Join গুলোও LEFT। দ্বিতীয়টা একটু সূক্ষ্ম, কিন্তু
                কখনো কখনো ঠিক এটাই দরকার: bookings আর customers এর জোড়া যদি সবসময় INNER হওয়ার কথা হয়,
                মানে Customer ছাড়া Booking রাখার কোনো মানে নেই, তাহলে সেই INNER জোড়াটা বন্ধনীর ভেতরে লিখুন।
                তখন বাইরের LEFT JOIN পুরো বন্ধনীটাকে একটা ঐচ্ছিক অংশ হিসেবে দেখে। ট্যুর আর Departure থাকে,
                আর Booking থাকলে সেটা সবসময় তার Customer সহ আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই সমাধান, একই ২৬টা Row"
              query={`-- সমাধান ১: বাকিগুলোও LEFT
SELECT count(*) AS all_left
FROM tours t
LEFT JOIN departures d ON d.tour_id      = t.tour_id
LEFT JOIN bookings   b ON b.departure_id = d.departure_id
LEFT JOIN customers  c ON c.customer_id  = b.customer_id;

-- সমাধান ২: INNER জোড়াটা বন্ধনীর ভেতরে
SELECT t.title, d.departure_id, b.booking_id, c.full_name
FROM tours t
LEFT JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN (bookings b
           JOIN customers c ON c.customer_id = b.customer_id)
       ON b.departure_id = d.departure_id
WHERE b.booking_id IS NULL
ORDER BY t.tour_id;`}
              caption="প্রথমটা ২৬। দ্বিতীয়টা দেখায় শুধু সেই Row গুলো যেখানে কোনো Booking নেই: Saint Martin Luxury Stay এর Departure 16, আর Cox's Bazar Family Package যার departure_id ও NULL। দুটো ট্যুরই টিকে আছে।"
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
                  প্রতিটা ট্যুরের <code className={CODE}>title</code>, তার প্রতিটা Departure এর{" "}
                  <code className={CODE}>departure_id</code>, প্রতিটা Booking এর{" "}
                  <code className={CODE}>booking_id</code> আর সেই Booking এর Customer এর{" "}
                  <code className={CODE}>full_name</code>। Departure বা Booking নেই এমন ট্যুরও তালিকায়
                  থাকবে। tour_id, তারপর departure_id, তারপর booking_id অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  tours থেকে শুরু, তারপর তিনটা LEFT JOIN। চতুর্থ Table customers, তার Join ও LEFT, নইলে
                  ২৪টা Row আসবে, ২৬টা না।
                </>
              }
              orderMatters
              solution={`SELECT t.title, d.departure_id, b.booking_id, c.full_name
FROM tours t
LEFT JOIN departures d ON d.tour_id      = t.tour_id
LEFT JOIN bookings   b ON b.departure_id = d.departure_id
LEFT JOIN customers  c ON c.customer_id  = b.customer_id
ORDER BY t.tour_id, d.departure_id, b.booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "on-vs-where",
      subHeader: { index: "010", title: "ON vs WHERE" },
      title: <SectionTitle>একই শর্ত, দুই জায়গায়, দুই উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                INNER JOIN এ একটা শর্ত ON এ লিখুন বা WHERE এ, উত্তর একই। দুই জায়গাতেই অর্থ একটা: এই শর্ত
                না মিললে Row থাকবে না। কিন্তু LEFT JOIN এ দুই জায়গার কাজ সম্পূর্ণ আলাদা, আর এটা লম্বা Report এ সবচেয়ে
                বেশি ধরা খাওয়া ভুলগুলোর একটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ON এর ভেতরের শর্ত</strong> ঠিক করে ডান দিকের কোন Row জোড়া লাগবে। শর্ত না মিললে
                  জোড়া লাগে না, কিন্তু বাঁ দিকের Row LEFT JOIN এর নিয়মে থেকেই যায়, NULL সহ।
                </ListItem>
                <ListItem>
                  <strong>WHERE এর শর্ত</strong> চলে পুরো Join শেষ হওয়ার পরে, আর যে Row এ শর্ত সত্য না, সেই
                  পুরো Row ফেলে দেয়। LEFT JOIN যে Row কে NULL দিয়ে বাঁচিয়েছিল, তার ডান দিকের Column তো NULL,
                  তাই সেখানে শর্ত অজানা, আর Row বাদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রশ্ন: প্রতিটা Customer এর কয়টা confirmed Booking, যাঁর নেই তাঁর পাশে শূন্য। শর্ত{" "}
                <code className={CODE}>b.status = &apos;confirmed&apos;</code> কোথায় বসবে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OnVsWhereSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="শর্ত ON এ বনাম WHERE এ"
              query={`-- শর্ত ON এর ভেতরে: ১৫ জনই থাকেন
SELECT c.customer_id, c.full_name, count(b.booking_id) AS confirmed
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
                    AND b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;

-- শর্ত WHERE এ: শূন্যের মানুষগুলো উধাও
SELECT c.customer_id, c.full_name, count(b.booking_id) AS confirmed
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;`}
              caption="প্রথম ফলাফলে ১৫টা Row, তিনজনের পাশে ০: Sabbir Hossain (তাঁর একমাত্র Booking বাতিল), Kamal Hasan (একমাত্র Booking pending) আর Imran Kabir (কোনো Booking নেই)। দ্বিতীয় ফলাফলে ১২টা Row, ওই তিনজন নেই। Query দুটো দেখতে প্রায় একই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OnVsWhereLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কোন Table এর শর্ত কোথায়",
          content: (
            <ContentList>
              <ListItem>
                LEFT JOIN এর <strong>ডান দিকের</strong> (ঐচ্ছিক) Table এর শর্ত, আর আপনি বাঁ দিকের সব Row
                রাখতে চান: শর্ত ON এ।
              </ListItem>
              <ListItem>
                <strong>বাঁ দিকের</strong> Table এর শর্ত, যেমন{" "}
                <code className={CODE}>c.country = &apos;Bangladesh&apos;</code>: WHERE এ, কারণ ওটা দিয়ে আপনি
                সত্যিই কোন Customer তালিকায় থাকবেন সেটা ঠিক করছেন।
              </ListItem>
              <ListItem>
                ডান দিকের Table এর শর্ত WHERE এ দিলে সেটা কার্যত INNER JOIN হয়ে যায়। ইচ্ছা করে তা চাইলে
                সরাসরি INNER JOIN লিখুন, পাঠকের কাছে উদ্দেশ্য পরিষ্কার থাকবে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  প্রতিটা Customer এর <code className={CODE}>full_name</code> আর তাঁর pending Booking এর
                  সংখ্যা। যাঁর pending Booking নেই, তাঁর পাশে 0। সব ১৫ জন Customer, customer_id অনুযায়ী
                  সাজানো।
                </>
              }
              hint={
                <>
                  <code className={CODE}>b.status = &apos;pending&apos;</code> শর্তটা ON এর ভেতরে, AND দিয়ে।
                  গুনতে <code className={CODE}>count(b.booking_id)</code>, count(*) না, নইলে শূন্যের জায়গায় 1
                  আসবে।
                </>
              }
              orderMatters
              solution={`SELECT c.full_name, count(b.booking_id) AS pending
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
                    AND b.status = 'pending'
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "fan-out",
      subHeader: { index: "011", title: "Fan-out" },
      title: <SectionTitle>যখন একটা সংখ্যা বারবার যোগ হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তৃতীয় ফাঁদ, আর এটা সবচেয়ে বিপজ্জনক, কারণ এখানে কোনো Row হারায় না, বরং সংখ্যা বাড়ে।
                Operations জানতে চায় প্রতিটা ট্যুরের কয়টা Departure, সব মিলিয়ে কয়টা সিট এখনো খালি, আর কয়টা
                সিট বিক্রি হয়েছে। প্রথম দুটো তথ্য departures এ, তৃতীয়টা bookings এ। তানিম তিনটা Table জোড়া
                দিয়ে tour_id ধরে Group করলেন।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যাটা বুঝতে Section 3 এর নিয়মটা মনে করুন: কোনো Row একাধিক জোড়া পেলে Row সংখ্যা বাড়ে।
                Departure 1 এ দুটো Booking। bookings জোড়া দেওয়ার পরে Departure 1 এর Row দুইবার আসে, আর
                দুটোতেই seats_left 14। এখন sum(seats_left) চালালে ১৪ দুইবার যোগ হয়। একে বলে Fan-out:
                একটা Row পাখার মতো ছড়িয়ে অনেক Row হয়ে যায়, আর তার সাথে তার সংখ্যাগুলোও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FanOutDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঠিক সংখ্যা, তারপর ফুলে ওঠা সংখ্যা"
              query={`-- শুধু departures: ঠিক উত্তর
SELECT t.tour_id,
       count(*)          AS departures,
       sum(d.seats_left) AS free_seats
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
GROUP BY t.tour_id
ORDER BY t.tour_id;

-- bookings যোগ করার পরে: departures আর free_seats ফুলে গেছে
SELECT t.tour_id,
       count(*)          AS departures,
       sum(d.seats_left) AS free_seats,
       sum(b.seats)      AS booked
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY t.tour_id
ORDER BY t.tour_id;`}
              caption="Tour 1 এর Departure ৪টা আর খালি সিট ৬৬টা, প্রথম ফলাফলে ঠিক তাই। দ্বিতীয় ফলাফলে একই ট্যুরের departures ৭ আর free_seats ১১৩। booked এর ১৬ কিন্তু ঠিক, কারণ seats নিজেই bookings এর Column, প্রতিটা Booking একবারই আসে। ভুল হয়েছে শুধু সেই সংখ্যাগুলো, যেগুলো এক ধাপ উপরের Table এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গোনার বেলায় সমাধান সহজ: <code className={CODE}>count(DISTINCT d.departure_id)</code>। প্রতিটা
                Departure এর id যতবারই আসুক, DISTINCT তাকে একবার গোনে। কিন্তু যোগফলের বেলায় DISTINCT এর
                একটা ফাঁদ আছে। <code className={CODE}>sum(DISTINCT ...)</code> এক Row কে একবার যোগ করে না,
                একটা মানকে একবার যোগ করে। দুটো আলাদা Booking এর টাকার অঙ্ক যদি একই হয়, তাহলে একটা বাদ
                পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="sum(DISTINCT): যে সমাধান আরেকটা ভুল"
              query={`SELECT t.tour_id,
       sum(b.total_bdt)          AS real_sum,
       sum(DISTINCT b.total_bdt) AS distinct_sum
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
JOIN bookings   b ON b.departure_id = d.departure_id
WHERE t.tour_id = 1
GROUP BY t.tour_id;`}
              caption="real_sum 200000.00, distinct_sum মাত্র 87500.00। Tour 1 এর সাতটা Booking এর অঙ্ক 25000, 50000, 12500, 25000, 25000, 50000, 12500। আলাদা মান মাত্র তিনটা: 25000, 50000 আর 12500, তাই sum(DISTINCT) সেই তিনটাই যোগ করেছে। টাকার হিসাবে DISTINCT কখনো সমাধান না।"
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
                  যে ট্যুরগুলোর অন্তত একটা Departure আছে, তাদের প্রতিটার{" "}
                  <code className={CODE}>tour_id</code>, Departure এর সঠিক সংখ্যা আর Booking এর সংখ্যা। যে
                  Departure এ কোনো Booking নেই, তার ট্যুরও থাকবে। tour_id অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  tours JOIN departures, তারপর <code className={CODE}>LEFT JOIN bookings</code>। Departure গুনতে{" "}
                  <code className={CODE}>count(DISTINCT d.departure_id)</code>, Booking গুনতে{" "}
                  <code className={CODE}>count(b.booking_id)</code>।
                </>
              }
              orderMatters
              solution={`SELECT t.tour_id,
       count(DISTINCT d.departure_id) AS departures,
       count(b.booking_id)            AS bookings
FROM tours t
JOIN departures d ON d.tour_id = t.tour_id
LEFT JOIN bookings b ON b.departure_id = d.departure_id
GROUP BY t.tour_id
ORDER BY t.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "money-doubled",
      subHeader: { index: "012", title: "Money Counted Twice" },
      title: <SectionTitle>দ্বিতীয় Payment, দ্বিগুণ টাকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Sample Data তে প্রতিটা Booking এর সর্বোচ্চ একটা Payment, তাই bookings আর payments জোড়া দিলে
                আজ কোনো Fan-out হয় না। কিন্তু বাস্তবে একটা Booking এর একাধিক Payment খুবই স্বাভাবিক। Kamal
                Hasan এর Booking 14 এর bKash চেষ্টা ব্যর্থ হয়েছিল। ধরুন তিনি এবার Card দিয়ে আবার চেষ্টা করলেন
                আর সফল হলেন। payments এ সেই Booking এর এখন দুটো Row: একটা failed, একটা paid।
              </ContentParagraph>
              <ContentParagraph>
                এখন Finance এর একটা পুরনো Query, যেটা প্রতিটা Customer এর মোট Booking এর অঙ্ক আর মোট পরিশোধ
                পাশাপাশি দেখায়, চুপচাপ ভুল হয়ে যায়। Booking 14 এর 50000 টাকা দুইবার আসে, কারণ তার Row
                দুটো Payment এর সাথে দুইবার জোড়া লেগেছে। নিচের বক্সটা দ্বিতীয় Payment টা একটা Transaction
                এর ভেতরে যোগ করে, হিসাব দেখায়, তারপর ROLLBACK দিয়ে সব আগের মতো ফিরিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় চেষ্টার পরে Kamal এর হিসাব"
              query={`BEGIN;

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
VALUES (14, 50000.00, 'card', 'paid', '2026-10-01 12:40:00+06');

SELECT c.full_name,
       sum(b.total_bdt) AS booked,
       sum(CASE WHEN p.status = 'paid' THEN p.amount_bdt END) AS paid,
       count(*) AS rows_seen
FROM customers c
JOIN bookings b      ON b.customer_id = c.customer_id
LEFT JOIN payments p ON p.booking_id  = b.booking_id
WHERE c.customer_id = 12
GROUP BY c.full_name;

ROLLBACK;`}
              caption="Kamal Hasan এর একটাই Booking, 50000 টাকার। কিন্তু booked দেখাচ্ছে 100000.00, কারণ rows_seen ২: Booking এর Row টা দুটো Payment এর সাথে জোড়া লেগে দুইবার এসেছে। paid ঠিক আছে 50000.00, কারণ ওটা payments এর নিজের Column। ROLLBACK এর পরে নতুন Payment টা আর নেই, Data আগের মতো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা মনে রাখার মতো: <strong>কোনো Table এর সংখ্যা যোগ করুন শুধু সেই স্তরে, যেখানে সেই Table
                এর প্রতিটা Row ঠিক একবার আছে।</strong> bookings এর total_bdt যোগ করা নিরাপদ, যতক্ষণ শিকলে
                bookings এর নিচের কোনো Table (payments, reviews) জোড়া লাগেনি। দুটো নিচের Table একসাথে জোড়া
                দিলে বিপদ গুণ হয়ে যায়: কোনো Booking এর দুটো Payment আর দুটো Review থাকলে তার Row আসে চারবার।
              </ContentParagraph>
              <ContentParagraph>
                আসল সমাধান হলো আগে প্রতিটা Table কে নিজের স্তরে যোগ করে নেওয়া, তারপর ছোট ফলাফলগুলো জোড়া
                দেওয়া। যেমন আগে payments কে Booking প্রতি একটা Row এ নামিয়ে আনা, তারপর bookings এর সাথে জোড়া।
                এর জন্য দরকার Query এর ভেতরে Query, যা Module 07 এর বিষয়। নিচের বক্সটা শুধু এক ঝলক দেখার জন্য,
                Syntax এখনই বোঝার দরকার নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক ঝলক: আগে যোগ, পরে জোড়া (Module 07 এ শিখবেন)"
              query={`BEGIN;

INSERT INTO payments (booking_id, amount_bdt, method, status, paid_at)
VALUES (14, 50000.00, 'card', 'paid', '2026-10-01 12:40:00+06');

SELECT c.full_name,
       sum(b.total_bdt)           AS booked,
       sum(coalesce(p.paid, 0))   AS paid
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
LEFT JOIN (
    SELECT booking_id,
           sum(CASE WHEN status = 'paid' THEN amount_bdt ELSE 0 END) AS paid
    FROM payments
    GROUP BY booking_id
) p ON p.booking_id = b.booking_id
WHERE c.customer_id = 12
GROUP BY c.full_name;

ROLLBACK;`}
              caption="booked এখন 50000.00, paid ও 50000.00। বন্ধনীর ভেতরের Query টা payments কে Booking প্রতি একটা Row এ নামিয়েছে, তাই Booking 14 এখন একবারই জোড়া লাগে। কীভাবে আর কেন, সেটা Module 07 এর Derived Tables আর CTE লেসনে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই শিকল, দুটো আলাদা অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের সব Query MySQL 8.4 এ চালিয়ে দেখা হয়েছে, এই লেসনের জন্য MySQL এর Sample File
                Load করে। ছয় Table এর শিকল সেখানেও ২৩ আর ২৪, LEFT শিকল ২৫, শেষে INNER দিলে ২৪, বন্ধনীর রূপ
                ২৬, ON এ শর্ত ২০টা Row আর WHERE এ ১৭টা, Tour 1 এর ফুলে ওঠা সংখ্যা ৭ আর ১১৩। মানে Join এর
                অর্থ দুই Database এ এক। পার্থক্য দুটো জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ON ছাড়া JOIN:</strong> PostgreSQL এ <code className={CODE}>JOIN tours t</code> এর পরে
                  ON না দিলে Syntax Error। MySQL এ ON ছাড়া JOIN চলে, আর সেটা CROSS JOIN হয়ে যায়:
                  bookings আর customers এর ২৪টা Row এর প্রতিটা tours এর ৯টা Row এর সাথে, মোট ২১৬টা Row,
                  কোনো সতর্কবার্তা ছাড়া। LEFT JOIN এ ON না দিলে অবশ্য MySQL ও ERROR 1064 দেয়।
                </ListItem>
                <ListItem>
                  <strong>Error এর লেখা:</strong> দ্ব্যর্থ Column এ MySQL বলে ERROR 1052 (23000): Column
                  &apos;full_name&apos; in field list is ambiguous। একই Alias দুইবার দিলে ERROR 1066 (42000):
                  Not unique table/alias: &apos;d&apos;।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের Query গুলোতে FILTER নেই, CASE দিয়ে লেখা, তাই সেগুলো হুবহু MySQL এও চলে। বন্ধনীর
                ভেতরে INNER JOIN এর রূপটাও MySQL এ একই ২৬টা Row দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-no-on.sql",
          code: `-- MySQL 8.4: ON ভুলে গেলে Error নয়, CROSS JOIN
SELECT COUNT(*) AS no_on
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN tours t;
-- +-------+
-- | no_on |
-- +-------+
-- |   216 |
-- +-------+

-- PostgreSQL এ একই Query:
-- ERROR:  syntax error at or near ";"`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ Row সংখ্যা দেখার অভ্যাস আরও জরুরি",
          content: (
            <ContentParagraph>
              যে ভুল PostgreSQL থামিয়ে দেয়, MySQL সেটা চালিয়ে দিয়ে দশগুণ বড় ফলাফল দিতে পারে। MySQL এ কাজ
              করলে প্রতিটা নতুন Join এর পরে একবার count(*) চালিয়ে দেখুন, সংখ্যাটা আপনার আন্দাজের সাথে মেলে
              কিনা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর দুটো আসল Report</SectionTitle>,
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
                ঘটনার পরে ফারুক সাহেব দুটো Report স্থায়ীভাবে Admin Panel এ চান। প্রথমটা Guide দের সাপ্তাহিক
                পাতা: আজ, 1 November 2026, বা তার পরের প্রতিটা Departure, কোন ট্যুর, কোন Guide, কয়টা চালু
                Booking আর কয়টা সিট। Guide না থাকলে সেটা চিৎকার করে বলতে হবে, আর কোনো Booking না থাকলেও
                Departure টা তালিকায় থাকতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                এই একটা Query তে লেসনের প্রায় সব শিক্ষা আছে: guides এর Join LEFT, কারণ Ratargul এর Guide নেই;
                bookings এর Join LEFT, কারণ কিছু Departure এ এখনো Booking নেই; বাতিল বাদ দেওয়ার শর্ত ON এ,
                কারণ WHERE এ দিলে Booking ছাড়া Departure গুলো হারাত; আর একটাই নিচের Table (bookings) জোড়া
                লেগেছে, তাই seats এর যোগফলে Fan-out নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide দের সাপ্তাহিক পাতা"
              query={`SELECT d.starts_on,
       t.title,
       coalesce(g.full_name, 'No guide yet') AS guide,
       count(b.booking_id)                   AS live_bookings,
       coalesce(sum(b.seats), 0)             AS seats
FROM departures d
JOIN tours t       ON t.tour_id      = d.tour_id
LEFT JOIN guides g ON g.guide_id     = t.guide_id
LEFT JOIN bookings b ON b.departure_id = d.departure_id
                    AND b.status <> 'cancelled'
WHERE d.starts_on >= DATE '2026-11-01'
GROUP BY d.departure_id, d.starts_on, t.title, g.full_name
ORDER BY d.starts_on;`}
              caption="নয়টা Departure। 21 November এর Ratargul Swamp Boat Day এ No guide yet, একটা Booking আর তিনটা সিট: এটাই সেই নৌকা। 11 December এর Sajek আর 14 February এর Luxury Stay এ কোনো চালু Booking নেই, তবু দুটোই আছে, শূন্য সহ। Sajek এর বাতিল Booking 18 ON এর শর্তে বাদ পড়েছে, Departure টা না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় Report মালিকের জন্য: প্রতিটা Destination এ কয়টা confirmed Booking আর কত টাকার আয়। সাতটা
              Destination ই থাকবে, এমনকি Kuakata, যেখানে এখনো কোনো ট্যুরই নেই। এটা আপনার Challenge।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Challenge"
              task={
                <>
                  প্রতিটা Destination এর <code className={CODE}>name</code>, confirmed Booking এর সংখ্যা আর সেই
                  Booking গুলোর <code className={CODE}>total_bdt</code> এর যোগফল, যেখানে কিছু নেই সেখানে 0।
                  সাতটা Destination ই থাকবে। আয় সবচেয়ে বেশি থেকে কম, আয় সমান হলে name অনুযায়ী।
                </>
              }
              hint={
                <>
                  destinations থেকে শুরু, তারপর tours, departures, bookings, তিনটাই LEFT JOIN। status এর শর্ত
                  bookings এর ON এ। যোগফলে <code className={CODE}>coalesce(sum(b.total_bdt), 0)</code>, গুনতে{" "}
                  <code className={CODE}>count(b.booking_id)</code>। GROUP BY তে destination_id আর name।
                </>
              }
              orderMatters
              solution={`SELECT ds.name,
       count(b.booking_id)            AS confirmed_bookings,
       coalesce(sum(b.total_bdt), 0)  AS revenue_bdt
FROM destinations ds
LEFT JOIN tours t      ON t.destination_id = ds.destination_id
LEFT JOIN departures d ON d.tour_id        = t.tour_id
LEFT JOIN bookings b   ON b.departure_id   = d.departure_id
                      AND b.status = 'confirmed'
GROUP BY ds.destination_id, ds.name
ORDER BY revenue_bdt DESC, ds.name;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই Report এ Fan-out নেই কেন",
          content: (
            <ContentParagraph>
              destinations থেকে bookings পর্যন্ত শিকলটা একটা সোজা লাইন: প্রতিটা ধাপে এক থেকে অনেক। যোগ করা
              হচ্ছে শুধু সবচেয়ে নিচের Table এর Column, total_bdt, আর প্রতিটা Booking ফলাফলে ঠিক একবার আসে।
              Fan-out হয় তখন, যখন উপরের Table এর সংখ্যা যোগ করেন, অথবা একই Row এর নিচে দুটো আলাদা শাখা
              জোড়া দেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>লম্বা Join লেখার আট ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "এক Row মানে কী, আগে লিখুন",
              description:
                "এক Booking, এক Customer, এক Departure, নাকি এক Destination। এক লাইনে লিখে রাখুন। এটাই শিকলের শুরুর Table আর ফলাফলের প্রত্যাশিত Row সংখ্যা ঠিক করে।",
            },
            {
              title: "দরকারি Table এর তালিকা",
              description:
                "দেখানোর Column আর শর্তের Column কোন কোন Table এ, লিখে ফেলুন। মানচিত্রে শুরুর Table থেকে প্রতিটা পর্যন্ত রাস্তা আঁকুন, মাঝের Table সহ।",
            },
            {
              title: "প্রতিটা চাবি জোড়া",
              description:
                "প্রতিটা JOIN এর ON এ Foreign Key আর Primary Key, যেমন d.departure_id = b.departure_id। ভুল Column জুড়লে Query চলে, কিন্তু ভুল Row জোড়া লাগে।",
            },
            {
              title: "প্রতিটা Join INNER নাকি LEFT",
              description:
                "চাবি খালি থাকতে পারে বা জোড়া না থাকতে পারে আর আপনি Row টা রাখতে চান: LEFT। একবার LEFT হলে সেই শাখার পরের সব Join LEFT।",
            },
            {
              title: "শর্তের জায়গা",
              description:
                "ঐচ্ছিক (ডান দিকের) Table এর শর্ত, যখন বাঁ দিকের Row রাখতে চান: ON এ। কোন Row গুলো Report এ থাকবে সেটা ঠিক করার শর্ত: WHERE এ।",
            },
            {
              title: "প্রতিটা ধাপে count(*)",
              description:
                "একটা একটা Join যোগ করে count(*) চালান। সংখ্যা আন্দাজের সাথে না মিললে ঠিক সেই Join টাই সন্দেহের তালিকায়।",
            },
            {
              title: "যোগফলের স্তর মিলিয়ে নিন",
              description:
                "কোনো Column যোগ করার আগে জিজ্ঞেস করুন, এই Table এর প্রতিটা Row কি ফলাফলে একবারই আছে? না থাকলে Fan-out, আগে নিজের স্তরে যোগ করুন।",
            },
            {
              title: "জোড়াহীন Row খুঁজে দেখুন",
              description:
                "Imran, Kuakata, Ratargul, Family Package: আপনার Data তে যারা জোড়াহীন, ফলাফলে তাদের খুঁজুন। থাকার কথা থাকলে আছে কিনা, না থাকার কথা হলে নেই কিনা।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>লম্বা শিকলের সাধারণ ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী ঘটে", "ঠিক উপায়"],
          rows: [
            [
              "ভুল Column জোড়া, যেমন t.tour_id = b.departure_id",
              "Error নেই, কিন্তু ভুল ট্যুরের নাম, আর কিছু Row উধাও",
              "চাবির রাস্তা মানচিত্রে দেখে নিন: Booking থেকে Tour এ যেতে departures লাগে",
            ],
            [
              "ON লিখতে ভুলে যাওয়া",
              "PostgreSQL এ Syntax Error, MySQL এ নিঃশব্দ CROSS JOIN",
              "প্রতিটা JOIN এর সাথে সাথেই তার ON লিখুন",
            ],
            [
              "দুই Table এর একই নামের Column Alias ছাড়া",
              "column reference is ambiguous",
              "সব Column এর আগে Alias, ফলাফলে AS দিয়ে আলাদা নাম",
            ],
            [
              "LEFT শিকলের শেষে INNER JOIN",
              "LEFT এর রাখা Row নিঃশব্দে বাদ",
              "বাকি Join ও LEFT, অথবা INNER জোড়াটা বন্ধনীর ভেতরে",
            ],
            [
              "ঐচ্ছিক Table এর শর্ত WHERE এ",
              "LEFT JOIN কার্যত INNER JOIN হয়ে যায়",
              "শর্ত ON এর ভেতরে, AND দিয়ে",
            ],
            [
              "উপরের Table এর সংখ্যা নিচের Table জোড়ার পরে যোগ",
              "Fan-out, সংখ্যা ফুলে ওঠে",
              "count(DISTINCT id) দিয়ে গোনা, যোগফল আগে নিজের স্তরে",
            ],
            [
              "Fan-out ঢাকতে sum(DISTINCT)",
              "সমান অঙ্কের আলাদা Row বাদ পড়ে, যোগফল কমে যায়",
              "যোগফল আগে নিজের স্তরে (Module 07)",
            ],
            [
              "ফলাফলের ডুপ্লিকেট দেখে SELECT DISTINCT",
              "আসল কারণ, ভুল Join বা Fan-out, চাপা পড়ে",
              "আগে খুঁজুন কোন Join Row বাড়াল",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল চাবি: Error নেই, উত্তর ভুল"
              query={`SELECT b.booking_id, t.title
FROM bookings b
JOIN tours t ON t.tour_id = b.departure_id
ORDER BY b.booking_id;`}
              caption="১৫টা Row আসে, Error ছাড়াই। কিন্তু Booking 3 এর পাশে Cox's Bazar Beach Weekend, অথচ Booking 3 আসলে Saint Martin এর। departure_id আর tour_id দুটোই সংখ্যা, তাই Database খুশি মনে মিলিয়ে দিয়েছে। আর 9 এর বেশি departure_id এর Booking গুলো কোনো Tour পায়নি, তাই হারিয়ে গেছে।"
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
                    href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Table Expressions
                  </a>
                  : Joined Tables অংশে INNER আর OUTER JOIN এর আনুষ্ঠানিক সংজ্ঞা, বন্ধনী দিয়ে Join এর ক্রম
                  ঠিক করা, আর ON বনাম WHERE এর পার্থক্যের উদাহরণ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/tutorial-join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Tutorial: Joins Between Tables
                  </a>
                  : Join এর সবচেয়ে সহজ ভূমিকা, Alias আর দ্ব্যর্থ Column এর ব্যাখ্যা সহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/explicit-joins.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Controlling the Planner with Explicit JOIN Clauses
                  </a>
                  : কেন INNER JOIN এর ক্রম Planner বদলাতে পারে আর OUTER JOIN এর বেলায় কেন পারে না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/join.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: JOIN Clause
                  </a>
                  : MySQL এ ON ছাড়া JOIN কেন CROSS JOIN এর মতো আচরণ করে, আর বন্ধনীতে Join লেখার নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Joins এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে দুই Table এর Join দেখার পরে এই লেসনের ছয় Table এর শিকল দিয়ে
                  অনুশীলন করুন।
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
                  লম্বা Query শুরু হয় মানচিত্রে: এক Row মানে কী, কোন Table লাগবে, আর চাবির রাস্তা। মাঝের
                  Table দেখানোর কিছু না থাকলেও শিকলে থাকে।
                </ListItem>
                <ListItem>
                  প্রতিটা JOIN আগের ফলাফল আর নতুন একটা Table জোড়া দেয়। প্রতিটা ধাপে Row সংখ্যা আন্দাজ করুন
                  আর count(*) দিয়ে মিলিয়ে নিন।
                </ListItem>
                <ListItem>
                  সব INNER হলে ক্রম বদলালেও উত্তর একই। NULL হতে পারে এমন চাবিতে INNER JOIN Row ফেলে দেয়,
                  যেমন Ratargul এর Booking 21।
                </ListItem>
                <ListItem>
                  LEFT শিকলের পরের সব Join LEFT। শেষে একটা INNER দিলে LEFT এর রাখা Row উধাও: ২৫ থেকে ২৪, ২৬
                  থেকে ২৪।
                </ListItem>
                <ListItem>
                  ঐচ্ছিক Table এর শর্ত ON এ রাখলে বাঁ দিকের সবাই থাকেন, WHERE এ দিলে বাদ পড়েন: ১৫ বনাম ১২।
                </ListItem>
                <ListItem>
                  এক Row অনেক জোড়া পেলে Fan-out: Tour 1 এর খালি সিট ৬৬ থেকে ১১৩। গোনায় count(DISTINCT),
                  যোগফলে আগে নিজের স্তরে যোগ, sum(DISTINCT) কখনো না।
                </ListItem>
                <ListItem>
                  MySQL এ ON ছাড়া JOIN নিঃশব্দ CROSS JOIN, তাই সেখানে Row গোনার অভ্যাস আরও জরুরি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা প্রশ্ন এসেছে: কার কিছু আছে, আর কার কিছুই নেই। যাঁরা কখনো বুক করেননি,
                যে ট্যুরের কোনো Departure নেই। LEFT JOIN দিয়ে খালি ঘর খুঁজে সেই প্রশ্নের উত্তর দেওয়া যায়, কিন্তু
                SQL এর এর জন্য আরও পরিষ্কার আর নিরাপদ একটা উপায় আছে, যেখানে Fan-out এর প্রশ্নই ওঠে না। সেটা
                পরের লেসন{" "}
                <Link href="/sql/topic/semi-anti-join" className={LINK}>
                  Semi and Anti Joins with EXISTS
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
      ["মানচিত্র আগে", "এক Row মানে কী, কোন Table, চাবির রাস্তা", "Booking থেকে Guide: চার লাফ"],
      ["মাঝের Table", "দেখানোর কিছু না থাকলেও রাস্তার জন্য লাগে", "bookings থেকে tours এ departures"],
      ["এক আংটা করে", "প্রতিটা JOIN আগের ফলাফলের সাথে নতুন Table", "২৪, ২৪, ২৪, ২৪, ২৪, তারপর ২৩"],
      ["NULL চাবি", "INNER JOIN এ জোড়া মেলে না, Row বাদ", "Ratargul এর Booking 21"],
      ["INNER এর ক্রম", "উত্তর বদলায় না, Planner নিজে বাছে", "bookings থেকে বা destinations থেকে, একই ২৪"],
      ["দ্ব্যর্থ Column", "একই নাম দুই Table এ, Alias দিন", "c.full_name বনাম g.full_name"],
      ["LEFT শিকল", "একবার LEFT হলে সেই শাখার বাকি Join ও LEFT", "Imran সহ ২৫টা Row"],
      ["শেষে INNER এর ফাঁদ", "LEFT এর রাখা Row নিঃশব্দে উধাও", "২৫ থেকে ২৪, ট্যুরের Report ২৬ থেকে ২৪"],
      ["বন্ধনীর Join", "INNER জোড়াটা একসাথে ঐচ্ছিক অংশ", "(bookings JOIN customers) LEFT JOIN"],
      ["ON বনাম WHERE", "ON জোড়া ঠিক করে, WHERE Row ফেলে", "confirmed: ১৫ বনাম ১২ জন"],
      ["Fan-out", "এক Row অনেক জোড়া পেলে তার সংখ্যা বারবার যোগ", "Tour 1 এর খালি সিট ৬৬ থেকে ১১৩"],
      ["sum(DISTINCT) এর ফাঁদ", "সমান অঙ্কের আলাদা Row বাদ পড়ে", "200000 এর জায়গায় 87500"],
      ["MySQL এ ON ছাড়া JOIN", "নিঃশব্দ CROSS JOIN", "২১৬টা Row"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "bookings থেকে customers, departures, tours, destinations আর guides পর্যন্ত পাঁচটা INNER JOIN দিলে ২৪টা Booking এর জায়গায় ২৩টা Row আসে। কেন?",
        options: [
          {
            key: "A",
            text: "একটা Booking এর Customer মুছে গেছে",
            isCorrect: false,
            explanation:
              "bookings.customer_id এ Foreign Key আছে, তাই কোনো Booking এর Customer হারাতে পারে না। পাঁচ Table পর্যন্ত সংখ্যা ২৪ ই থাকে।",
          },
          {
            key: "B",
            text: "Ratargul ট্যুরের guide_id NULL, তাই guides এর সাথে জোড়া মেলেনি আর INNER JOIN Row টা ফেলে দিয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। NULL এর সাথে তুলনা অজানা, INNER JOIN অজানাকে মিল ধরে না। শেষ Join LEFT করলে Booking 21 ফিরে আসে।",
          },
          {
            key: "C",
            text: "পাঁচটার বেশি JOIN দিলে PostgreSQL একটা Row বাদ দেয়",
            isCorrect: false,
            explanation: "এমন কোনো নিয়ম নেই। Row বাদ পড়ে শুধু জোড়া না মিললে।",
          },
          {
            key: "D",
            text: "JOIN গুলোর ক্রম ভুল",
            isCorrect: false,
            explanation: "সব INNER JOIN হলে ক্রম বদলালেও উত্তর একই থাকে।",
          },
        ],
      },
      {
        id: 2,
        text: "সব JOIN INNER এমন একটা Query তে Table গুলোর ক্রম বদলে লিখলে কী হয়?",
        options: [
          {
            key: "A",
            text: "ফলাফল একই থাকে, কারণ INNER JOIN শুধু সেই Row রাখে যেখানে সব চাবি মেলে",
            isCorrect: true,
            explanation:
              "ঠিক। কোন জোড়া আগে দেখা হলো তাতে কিছু বদলায় না। এই কারণে Planner নিজের পছন্দমতো ক্রমে চালাতে পারে।",
          },
          {
            key: "B",
            text: "প্রথম Table এর সব Row থাকে, বাকিগুলো ঐচ্ছিক",
            isCorrect: false,
            explanation: "এটা LEFT JOIN এর আচরণ। INNER JOIN এ কোনো দিকই বিশেষ না।",
          },
          {
            key: "C",
            text: "Row সংখ্যা বদলায়, তবে Column একই থাকে",
            isCorrect: false,
            explanation: "INNER JOIN এ Row সংখ্যাও একই থাকে, লেসনের দুই ক্রমের Query দুটোই ২৪।",
          },
          {
            key: "D",
            text: "Query টা Error দেয়, প্রথম Table সবসময় bookings হতে হয়",
            isCorrect: false,
            explanation: "যেকোনো Table থেকে শুরু করা যায়, শুধু প্রতিটা Join এর ON ঠিক হতে হবে।",
          },
        ],
      },
      {
        id: 3,
        text: "customers LEFT JOIN bookings LEFT JOIN departures, তারপর JOIN tours (INNER)। কোনো Booking নেই এমন Imran Kabir এর কী হয়?",
        options: [
          {
            key: "A",
            text: "তিনি থাকেন, কারণ প্রথম Join LEFT",
            isCorrect: false,
            explanation:
              "প্রথম দুটো LEFT তাঁকে রেখেছিল, কিন্তু শেষের INNER JOIN এর ON এ d.tour_id NULL, তাই তাঁর Row বাদ পড়ে।",
          },
          {
            key: "B",
            text: "তিনি বাদ পড়েন, আর ফলাফল ২৫ থেকে ২৪ হয়",
            isCorrect: true,
            explanation:
              "ঠিক। শেষে INNER JOIN আগের LEFT JOIN এর রাখা Row ফেলে দেয়। সমাধান: শেষটাও LEFT।",
          },
          {
            key: "C",
            text: "Query Error দেয়, LEFT আর INNER একসাথে চলে না",
            isCorrect: false,
            explanation: "একসাথে চলে, আর ঠিক এই কারণেই ফাঁদটা নিঃশব্দ।",
          },
          {
            key: "D",
            text: "তাঁর Row দুইবার আসে",
            isCorrect: false,
            explanation: "Row বাড়ে না, বাদ পড়ে।",
          },
        ],
      },
      {
        id: 4,
        text: "প্রতিটা Customer এর confirmed Booking গুনতে চান, শূন্য সহ, সব ১৫ জন। customers LEFT JOIN bookings এর সাথে b.status = 'confirmed' কোথায় বসবে?",
        options: [
          {
            key: "A",
            text: "WHERE এ",
            isCorrect: false,
            explanation:
              "WHERE Join এর পরে চলে আর শূন্যের মানুষদের Row ফেলে দেয়। ফলাফল ১২ জন।",
          },
          {
            key: "B",
            text: "ON এর ভেতরে, AND দিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। ON এর শর্ত শুধু ঠিক করে কোন Booking জোড়া লাগবে, Customer কে ফেলে না। ১৫ জনই থাকেন, তিনজনের গুনতি ০।",
          },
          {
            key: "C",
            text: "HAVING এ",
            isCorrect: false,
            explanation:
              "HAVING দলের শর্ত। status একটা Row এর Column, HAVING এ দিলে Error আসে, কারণ সেটা GROUP BY তে নেই।",
          },
          {
            key: "D",
            text: "যেকোনো জায়গায়, ফল একই",
            isCorrect: false,
            explanation: "INNER JOIN এ একই হতো, LEFT JOIN এ না।",
          },
        ],
      },
      {
        id: 5,
        text: "tours JOIN departures LEFT JOIN bookings করে tour_id ধরে sum(d.seats_left) নিলে Tour 1 এর খালি সিট ৬৬ এর জায়গায় ১১৩ আসে। কেন?",
        options: [
          {
            key: "A",
            text: "seats_left এ ভুল Data আছে",
            isCorrect: false,
            explanation: "শুধু departures থেকে যোগ করলে ঠিক ৬৬ আসে, Data ঠিক আছে।",
          },
          {
            key: "B",
            text: "প্রতিটা Departure এর Row তার Booking এর সংখ্যা যতবার, ততবার এসেছে, তাই একই seats_left বারবার যোগ হয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক, এটাই Fan-out। Departure 1, 2 আর 8 এ দুটো করে Booking, তাই তাদের seats_left দুইবার করে।",
          },
          {
            key: "C",
            text: "LEFT JOIN এর NULL গুলো সংখ্যা হিসেবে যোগ হয়েছে",
            isCorrect: false,
            explanation: "sum NULL কে বাদ দেয়, কোনো সংখ্যা যোগ করে না।",
          },
          {
            key: "D",
            text: "GROUP BY ভুল Column এ",
            isCorrect: false,
            explanation: "tour_id ঠিক Column। সমস্যা Group এর ভেতরে Departure এর Row এর পুনরাবৃত্তি।",
          },
        ],
      },
      {
        id: 6,
        text: "Fan-out ঠিক করতে কেউ sum(DISTINCT b.total_bdt) লিখলেন। Tour 1 এর জন্য কী হবে?",
        options: [
          {
            key: "A",
            text: "ঠিক উত্তর আসবে, 200000",
            isCorrect: false,
            explanation: "DISTINCT মান ধরে কাজ করে, Row ধরে না। সমান অঙ্কের আলাদা Booking বাদ পড়ে।",
          },
          {
            key: "B",
            text: "অনেক কম আসবে, 87500, কারণ সমান অঙ্কের Booking গুলো একবারই যোগ হয়েছে",
            isCorrect: true,
            explanation:
              "ঠিক। সাতটা Booking এ আলাদা অঙ্ক মাত্র তিনটা: 25000, 50000, 12500। টাকার হিসাবে DISTINCT কখনো সমাধান না।",
          },
          {
            key: "C",
            text: "Error আসবে, sum এর ভেতরে DISTINCT চলে না",
            isCorrect: false,
            explanation: "চলে, আর সেটাই বিপদ: Error ছাড়াই ভুল উত্তর।",
          },
          {
            key: "D",
            text: "দ্বিগুণ আসবে",
            isCorrect: false,
            explanation: "DISTINCT সংখ্যা কমায়, বাড়ায় না।",
          },
        ],
      },
      {
        id: 7,
        text: "customers আর guides দুটো Table জোড়া দেওয়ার পরে SELECT full_name লিখলে PostgreSQL কী বলে?",
        options: [
          {
            key: "A",
            text: "প্রথম Table এর full_name দেখায়",
            isCorrect: false,
            explanation: "PostgreSQL আন্দাজ করে না।",
          },
          {
            key: "B",
            text: "দুটোই পাশাপাশি দেখায়",
            isCorrect: false,
            explanation: "একটা নাম দিয়ে দুটো Column আসে না।",
          },
          {
            key: "C",
            text: "column reference \"full_name\" is ambiguous, তাই c.full_name বা g.full_name লিখতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। দুই Table এ একই নাম থাকলে Alias দিয়ে বলে দিতে হয় কোনটা। MySQL এ একই ভুলে ERROR 1052।",
          },
          {
            key: "D",
            text: "শেষ Table এর full_name দেখায়",
            isCorrect: false,
            explanation: "কোনো Table কে অগ্রাধিকার দেওয়া হয় না, Error আসে।",
          },
        ],
      },
      {
        id: 8,
        text: "JOIN tours t লিখে ON দিতে ভুলে গেলেন। PostgreSQL আর MySQL এ কী হয়?",
        options: [
          {
            key: "A",
            text: "দুটোতেই Syntax Error",
            isCorrect: false,
            explanation: "MySQL এ INNER JOIN এর ON ঐচ্ছিক, সেখানে Error আসে না।",
          },
          {
            key: "B",
            text: "PostgreSQL এ Syntax Error, MySQL এ CROSS JOIN, সব জোড়া, যেমন ২৪ গুণ ৯ = ২১৬ Row",
            isCorrect: true,
            explanation:
              "ঠিক। MySQL এর এই নিঃশব্দ আচরণের জন্যই সেখানে প্রতিটা Join এর পরে Row গোনা জরুরি।",
          },
          {
            key: "C",
            text: "দুটোতেই চাবি আন্দাজ করে নেয়",
            isCorrect: false,
            explanation: "কোনো Database চাবি আন্দাজ করে না। NATURAL JOIN নামের Syntax আছে, কিন্তু সেটা আলাদা জিনিস।",
          },
          {
            key: "D",
            text: "দুটোতেই শূন্য Row",
            isCorrect: false,
            explanation: "MySQL এ উল্টো, সব সম্ভাব্য জোড়া আসে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর শিকল পরীক্ষা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>ধাপে ধাপে গোনা:</strong> bookings থেকে শুরু করে একটা একটা Table যোগ করুন, guides পর্যন্ত। প্রতিটা
        ধাপের পরে count(*) চালিয়ে একটা ছোট Table বানান: ধাপ, যোগ করা Table, Row সংখ্যা। কোন ধাপে সংখ্যা বদলাল আর
        কেন, দুই লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>হারানো Row খোঁজা:</strong> এমন একটা Query লিখুন যেটা প্রতিটা Tour এর পাশে তার Guide এর নাম দেখায়, Guide
        না থাকলে No guide yet। তারপর একই Query তে INNER দিয়ে দেখান কোন ট্যুর হারায়।
      </span>,
      <span key="3">
        <strong>ON আর WHERE এর তুলনা:</strong> প্রতিটা Customer এর cancelled Booking এর সংখ্যা, একবার শর্ত ON এ, একবার
        WHERE এ। দুই ফলাফলের Row সংখ্যা আর কোন Customer রা পার্থক্য তৈরি করলেন, লিখুন।
      </span>,
      <span key="4">
        <strong>Fan-out শিকার:</strong> প্রতিটা Destination এর ট্যুর সংখ্যা আর Booking সংখ্যা, প্রথমে count(*) দিয়ে
        (ভুল), তারপর count(DISTINCT) দিয়ে (ঠিক)। কোন Destination এ পার্থক্য সবচেয়ে বেশি, আর কেন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> দড়িতে একটা একটা গিঁট দেওয়ার উদাহরণ দিয়ে একজন বন্ধুকে বোঝান, শেষের
        একটা INNER JOIN কীভাবে আগের LEFT JOIN এর কাজ নষ্ট করে।
      </span>,
    ],
    deliverables: [
      <span key="d1">ধাপে ধাপে Row সংখ্যার Table আর ব্যাখ্যা</span>,
      <span key="d2">Guide এর তালিকার দুই সংস্করণ</span>,
      <span key="d3">cancelled গোনার দুই Query, Row সংখ্যা আর ব্যাখ্যা</span>,
      <span key="d4">Destination প্রতি ভুল আর ঠিক গোনা, পার্থক্যের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা আট লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ লম্বা শিকল",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "ধাপে ধাপে গোনা",
        description:
          "প্রথম ফাইলের ছয়টা count(*) একটা একটা চালান। শেষেরটা ছাড়া সবগুলো ২৪, শেষেরটা ২৩। কেন, Booking 21 দেখে নিজে বলুন।",
      },
      {
        title: "পুরো তালিকা",
        description:
          "দ্বিতীয় ফাইলে Guide এর Join LEFT, আর NULL এর বদলে No guide yet। ২৪টা Row মিলিয়ে নিন।",
      },
      {
        title: "LEFT শিকল আর তার ফাঁদ",
        description:
          "তৃতীয় ফাইলে ২৫ আর ২৪। psql এ \\x auto চালু রেখে Imran এর Row টা দেখুন।",
      },
      {
        title: "ON বনাম WHERE",
        description:
          "চতুর্থ ফাইলে একই Query দুইভাবে, ১৫ আর ১২টা Row। কোন তিনজন বাদ পড়লেন, লিখে রাখুন।",
      },
      {
        title: "Fan-out ধরা",
        description:
          "পঞ্চম ফাইলে Tour 1 এর ৬৬ আর ১১৩, তারপর count(DISTINCT) দিয়ে ঠিক করা।",
      },
      {
        title: "মালিকের Report",
        description:
          "ষষ্ঠ ফাইলে Destination প্রতি আয়, সাতটা Row, শেষে Kuakata শূন্য সহ।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-count-each-step.sql",
        code: `SELECT count(*) FROM bookings b;
-- 24
SELECT count(*) FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id;
-- 24
SELECT count(*) FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id;
-- 24
SELECT count(*) FROM bookings b
JOIN customers  c ON c.customer_id  = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours      t ON t.tour_id      = d.tour_id;
-- 24
SELECT count(*) FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id;
-- 24
SELECT count(*) FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
JOIN guides       g  ON g.guide_id        = t.guide_id;
-- 23`,
      },
      {
        language: "sql",
        filename: "02-full-list.sql",
        code: `SELECT b.booking_id,
       c.full_name                           AS customer,
       t.title                               AS tour,
       ds.name                               AS destination,
       coalesce(g.full_name, 'No guide yet') AS guide
FROM bookings b
JOIN customers    c  ON c.customer_id     = b.customer_id
JOIN departures   d  ON d.departure_id    = b.departure_id
JOIN tours        t  ON t.tour_id         = d.tour_id
JOIN destinations ds ON ds.destination_id = t.destination_id
LEFT JOIN guides  g  ON g.guide_id        = t.guide_id
ORDER BY b.booking_id;
-- (24 rows), booking 21: Ratargul Swamp Boat Day, No guide yet`,
      },
      {
        language: "sql",
        filename: "03-left-chain.sql",
        code: `SELECT count(*) FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
LEFT JOIN tours      t ON t.tour_id      = d.tour_id;
-- 25

SELECT count(*) FROM customers c
LEFT JOIN bookings   b ON b.customer_id  = c.customer_id
LEFT JOIN departures d ON d.departure_id = b.departure_id
JOIN tours           t ON t.tour_id      = d.tour_id;
-- 24, Imran Kabir নেই`,
      },
      {
        language: "sql",
        filename: "04-on-vs-where.sql",
        code: `SELECT c.customer_id, c.full_name, count(b.booking_id) AS confirmed
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
                    AND b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;
-- (15 rows), 5, 12 আর 15 এর পাশে 0

SELECT c.customer_id, c.full_name, count(b.booking_id) AS confirmed
FROM customers c
LEFT JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;
-- (12 rows)`,
      },
      {
        language: "sql",
        filename: "05-fan-out.sql",
        code: `SELECT count(*) AS departures, sum(d.seats_left) AS free_seats
FROM departures d
WHERE d.tour_id = 1;
-- 4 | 66

SELECT count(*) AS departures, sum(d.seats_left) AS free_seats
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
WHERE d.tour_id = 1;
-- 7 | 113  (fan-out)

SELECT count(DISTINCT d.departure_id) AS departures,
       count(b.booking_id)            AS bookings
FROM departures d
LEFT JOIN bookings b ON b.departure_id = d.departure_id
WHERE d.tour_id = 1;
-- 4 | 7`,
      },
      {
        language: "sql",
        filename: "06-owner-report.sql",
        code: `SELECT ds.name,
       count(b.booking_id)           AS confirmed_bookings,
       coalesce(sum(b.total_bdt), 0) AS revenue_bdt
FROM destinations ds
LEFT JOIN tours t      ON t.destination_id = ds.destination_id
LEFT JOIN departures d ON d.tour_id        = t.tour_id
LEFT JOIN bookings b   ON b.departure_id   = d.departure_id
                      AND b.status = 'confirmed'
GROUP BY ds.destination_id, ds.name
ORDER BY revenue_bdt DESC, ds.name;
-- (7 rows): Saint Martin's Island 5 | 125000.00 ... Kuakata 0 | 0`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা নতুন Join লেখার সাথে সাথে count(*) চালানোর অভ্যাসটা এই ড্রিলগুলো থেকেই শুরু করুন। লম্বা Query তে
        ভুল ধরার সবচেয়ে দ্রুত উপায় এটাই: যে ধাপে সংখ্যা আন্দাজের সাথে মেলে না, ভুল সেখানেই।
      </ContentParagraph>
    ),
  },
};
