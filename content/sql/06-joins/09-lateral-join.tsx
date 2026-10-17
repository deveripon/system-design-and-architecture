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
  LateralStepLab,
  WhichToolLab,
} from "../../../components/course/topics/joins/lateral-animations";
import {
  CrossVsLeftLateralSplit,
  DerivedTableDiagram,
  ForEachRowDiagram,
  ModuleSixStoryDiagram,
  SeatExpandDiagram,
} from "../../../components/course/topics/joins/lateral-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const lateralJoinContent: TopicData = {
  id: "lateral-join",
  introduction: {
    badge: "MODULE 06 · LESSON 09",
    title: <SectionTitle>প্রতিটা Row এর জন্য একটা ছোট Query</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলের আগের আট লেসনে আপনি দুটো Table কে একবারে মিলিয়েছেন: প্রতিটা Booking এর পাশে তার Customer,
          প্রতিটা Tour এর পাশে তার Destination। মেলানোর নিয়ম একটাই, ON এর শর্ত, আর সেটা সব Row এর জন্য একই।
          কিন্তু কিছু প্রশ্ন এভাবে মেলে না। প্রতিটা Customer এর সবচেয়ে নতুন দুটো Booking চাই। প্রতিটা Tour এর পরের
          Departure টা চাই, শুধু একটা। প্রতিটা Destination এর সবচেয়ে সস্তা ট্যুর চাই। এখানে প্রতিটা Row এর জন্য
          আলাদা করে একটা ছোট খোঁজ চালাতে হয়, নিজের ORDER BY আর নিজের LIMIT সহ।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি সেই খোঁজটা লিখতে শিখবেন। প্রথমে দেখবেন FROM এর ভেতরে একটা Query বসানো যায়, যাকে বলে
          Subquery। তারপর দেখবেন সেই Subquery সাধারণত বাইরের Table দেখতে পায় না, আর LATERAL শব্দটা কীভাবে সেই
          দেয়াল সরিয়ে দেয়। তারপর CROSS JOIN LATERAL আর LEFT JOIN LATERAL এর পার্থক্য, প্রতিটা দলের প্রথম কয়েকটা,
          ভেতরে Join আর যোগফল, একটা Row থেকে অনেকগুলো Row বানানো, আর কখন LATERAL না নিয়ে অন্য হাতিয়ার নেওয়া ভালো।
        </ContentParagraph>
        <ContentParagraph>
          এটা Module 06 এর শেষ লেসন। শেষ Section এ পুরো মডিউলের সারাংশ, আর একটা Report যেটা ছয়টা Table জুড়ে এই
          মডিউলের প্রায় সব হাতিয়ার এক Query তে মেলায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে একটা Row দিন, আমি শুধু তার জন্য একটা ছোট খোঁজ চালাব: তার Booking গুলো, নতুন থেকে পুরনো, প্রথম দুটো। তারপর পরের Row। আমি বাঁ দিকটা দেখতে পাই, এটাই আমার বিশেষত্ব।",
      author: "LATERAL",
      role: "Lesson 09",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>প্রত্যেকের শেষ দুটো, সবার শেষ দুটো না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। Island Tours এর Customer Care এর দায়িত্বে নাসরিন। শীতের মৌসুম
                শুরু, তাই তিনি আজ প্রতিটা Customer কে ফোন করবেন। কথা শুরু করার আগে তিনি দেখে নিতে চান Customer এর
                সবচেয়ে নতুন দুটো Booking: শেষবার কোথায় গিয়েছিলেন, এখন কোনটা অপেক্ষায় আছে। তাই তাঁর দরকার একটা
                তালিকা, যেখানে প্রতিটা Customer এর নাম, আর তাঁর পাশে তাঁর শেষ দুটো Booking, booked_at এর নতুন থেকে
                পুরনো ক্রমে।
              </ContentParagraph>
              <ContentParagraph>
                Lesson 02 এর বিদ্যা দিয়ে প্রথম চেষ্টা সহজ: customers আর bookings জুড়ে, Customer আর booked_at দিয়ে
                সাজানো। ফল আসে চব্বিশটা Row, প্রতিটা Booking এর জন্য একটা। Rahim Uddin এর তিনটা Booking, তিনটাই আছে।
                নাসরিনের দরকার দুটো। দ্বিতীয় চেষ্টা: শেষে LIMIT 2। ফল আসে মোট দুটো Row, দুটোই Rahim এর। LIMIT পুরো
                ফলাফলের উপর বসে, প্রতিটা Customer এর উপর না।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এর DISTINCT ON মনে পড়তে পারে, কিন্তু সে প্রতিটা দলের ঠিক একটা Row রাখে, দুটো না। Module 05
                এর GROUP BY প্রতিটা দলকে একটা Row এ ভেঙে আনে। নাসরিনের প্রশ্নটা আসলে অন্য রকম: প্রতিটা Customer এর
                জন্য আলাদা করে একটা ছোট Query চালানো দরকার, যার নিজের ORDER BY booked_at DESC আর নিজের LIMIT 2, তারপর
                সেই ফল সেই Customer এর পাশে বসানো। নিচের বক্সে প্রথম দুটো চেষ্টা আছে। Run চাপুন আর দেখুন কোথায় আটকায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো চেষ্টা, দুটোই ভুল জায়গায় থামে"
              query={`SELECT c.full_name, b.booking_id, b.booked_at
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
ORDER BY c.customer_id, b.booked_at DESC;

SELECT c.full_name, b.booking_id, b.booked_at
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
ORDER BY c.customer_id, b.booked_at DESC
LIMIT 2;`}
              caption="প্রথম Query তে 24টা Row: প্রত্যেকের সব Booking, Rahim এর তিনটাই। দ্বিতীয়টায় শুধু 2টা Row, Rahim এর 17 আর 8, বাকি তেরোজন Customer উধাও। LIMIT গোটা ফলাফলের মাথা কাটে, প্রতিটা দলের না। এই লেসনের শেষে একই প্রশ্নের ঠিক উত্তর আসবে 23টা Row তে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই প্রশ্নের নাম Top N per Group: প্রতিটা দলের প্রথম কয়েকটা। Report আর App এ এটা খুব চেনা প্রশ্ন, প্রতিটা
              Customer এর শেষ তিনটা Order, প্রতিটা Product এর সেরা পাঁচটা Review, প্রতিটা Tour এর পরের দুটো তারিখ।
              PostgreSQL এ এর সবচেয়ে সরাসরি উত্তর LATERAL। কিন্তু LATERAL বুঝতে আগে একটা ছোট জিনিস জানা দরকার:
              FROM এর ভেতরে একটা পুরো Query বসানো যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "subquery-in-from",
      subHeader: { index: "002", title: "A Query Inside FROM" },
      title: <SectionTitle>FROM এর ভেতরে একটা Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন পর্যন্ত FROM এর পরে আপনি সবসময় একটা Table এর নাম লিখেছেন: tours, bookings, customers। কিন্তু
                PostgreSQL এর কাছে FROM এর আসল দাবি একটাই, তাকে কিছু Row আর Column দিতে হবে। একটা Table সেটা দেয়।
                আরেকটা SELECT ও সেটা দেয়, কারণ Module 03 থেকে আপনি জানেন, প্রতিটা SELECT এর ফলও একটা Table। তাই FROM
                এর পরে Parenthesis এর ভেতরে একটা পুরো SELECT লেখা যায়।
              </ContentParagraph>
              <ContentParagraph>
                অন্য Query এর ভেতরে বসানো এমন একটা SELECT কে বলে <strong>Subquery</strong>। FROM এ বসলে তাকে
                Derived Table ও বলে, মানে অন্য Query থেকে বানানো Table। এটা একটা রান্নাঘরের মতো ভাবুন: বড় রান্নার আগে
                আলাদা বাটিতে মশলা মেখে রাখা হয়। বাটির মশলাটা আগে তৈরি হয়, তারপর বড় হাঁড়িতে ঢোকে। ভেতরের SELECT টা
                আগে একবার চলে, তার ফল একটা অস্থায়ী Table হয়, আর বাইরের Query সেই Table টাকে পড়ে।
              </ContentParagraph>
              <ContentParagraph>
                এই অস্থায়ী Table এর একটা নাম লাগে, যাতে বাইরের Query তাকে ডাকতে পারে। নামটা দেওয়া হয় Parenthesis
                বন্ধের পরে AS দিয়ে, যেমন <code className={CODE}>AS cheap</code>। SQL Standard বলে নামটা বাধ্যতামূলক।
                PostgreSQL 16 থেকে নাম ছাড়াও চলে, কিন্তু নাম দিলে Query পড়া সহজ হয়, আর MySQL এ নাম ছাড়া Error, তাই
                এই ট্র্যাকে সবসময় নাম দেওয়া হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <DerivedTableDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Query, তার ফল আরেকটা Query র Table"
              query={`SELECT *
FROM (
  SELECT title, price_bdt
  FROM tours
  WHERE price_bdt < 10000
) AS cheap
ORDER BY price_bdt;

SELECT count(*) AS cheap_tours, min(price_bdt) AS cheapest
FROM (
  SELECT title, price_bdt
  FROM tours
  WHERE price_bdt < 10000
) AS cheap;`}
              caption="প্রথম Query তে cheap নামের অস্থায়ী Table এর চারটা Row: Ratargul 3500.00, Sylhet 7800.00, Cox's Bazar Beach Weekend 8500.00, Sajek 9500.00। দ্বিতীয়টা সেই একই Table এর উপর Module 05 এর Aggregate চালায়: 4 আর 3500.00। ভেতরেরটা আগে চলে, বাইরেরটা তার ফল পড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Subquery র পুরো গল্প Module 07 এ",
          content: (
            <ContentParagraph>
              Subquery শুধু FROM এ না, SELECT এর ভেতরে, WHERE এর ভেতরে, আরও অনেক জায়গায় বসে, আর সেগুলো Module 07
              এর বিষয়। এই লেসনে শুধু একটা জিনিস লাগবে: FROM এর ভেতরের Subquery একটা অস্থায়ী Table, যার একটা নাম আছে।
              বাকিটা Module 07 এ ধাপে ধাপে আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "the-wall",
      subHeader: { index: "003", title: "The Wall" },
      title: <SectionTitle>ভেতরের Query বাইরেটা দেখে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নাসরিনের প্রশ্নে ফেরা যাক। একটা Customer এর শেষ দুটো Booking বের করা সহজ:{" "}
                <code className={CODE}>WHERE customer_id = 1 ORDER BY booked_at DESC LIMIT 2</code>। তাহলে মনে হয়
                এই ছোট Query টাকে FROM এর ভেতরে বসিয়ে, 1 এর জায়গায় বাইরের Customer এর নম্বর লিখে দিলেই হবে:{" "}
                <code className={CODE}>WHERE b.customer_id = c.customer_id</code>। যুক্তি ঠিক, কিন্তু PostgreSQL রাজি
                না।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা আগের Section এর ছবিতেই আছে: FROM এর ভেতরের Subquery আগে একবার চলে, একা, বাইরের কিছু না দেখে।
                FROM এ customers c আগে লেখা থাকলেও লাভ নেই। FROM এর প্রতিটা অংশ নিজের মতো তৈরি হয়, তারপর সেগুলো জোড়া
                লাগে। তাই ভেতরের Query তৈরি হওয়ার সময় c বলে কিছু তার জানা নেই। এটাকে একটা দেয়াল ভাবুন: দেয়ালের ওপারে
                customers আছে, কিন্তু ভেতরের Query সেটা দেখতে পায় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে ঠিক এই Query টা। Run চাপুন, তারপর Error এর তিনটা লাইন মন দিয়ে পড়ুন। Module 02 এর Lesson 07
                এ যেমন শিখেছেন, ERROR বলে কী হয়েছে, DETAIL বলে কেন, আর HINT বলে কী করবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দেয়ালে ধাক্কা"
              query={`SELECT c.full_name, x.booking_id
FROM customers c
CROSS JOIN (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x;`}
              caption="Error: invalid reference to FROM-clause entry for table c। DETAIL বলে c নামে একটা Table আছে ঠিকই, কিন্তু Query র এই অংশ থেকে তাকে ছোঁয়া যায় না। আর HINT সরাসরি সমাধান বলে দেয়: To reference that table, you must mark this subquery with LATERAL। মানে Subquery টার আগে LATERAL শব্দটা লিখুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "HINT টা পড়ার অভ্যাস",
          content: (
            <ContentParagraph>
              এই Error এর বিশেষত্ব হলো HINT নিজেই উত্তর দেয়। বেশিরভাগ মানুষ প্রথম লাইন পড়েই থেমে যান, আর ভাবেন
              Table এর নাম ভুল হয়েছে। নাম ঠিকই আছে, সমস্যা দেখার অধিকারের। Error এর শেষ লাইন পর্যন্ত পড়া একটা অভ্যাস,
              আর এই লেসনে সেটা সরাসরি কাজে লাগল।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "lateral",
      subHeader: { index: "004", title: "LATERAL" },
      title: <SectionTitle>দেয়ালে একটা জানালা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LATERAL একটা ইংরেজি শব্দ, মানে পাশের দিকে। SQL এ এর মানে: এই Subquery তার পাশে, মানে FROM এ তার আগে লেখা
                Table গুলোর Column দেখতে পারবে। Subquery র আগে এই একটা শব্দ লিখলেই দেয়ালে একটা জানালা খুলে যায়। এখন
                ভেতরের Query তে <code className={CODE}>c.customer_id</code> লেখা চলে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু একটা প্রশ্ন থেকে যায়: c তো পনেরোজন Customer, ভেতরের Query কোন c এর নম্বর দেখবে? উত্তরটাই
                LATERAL এর আসল চেহারা। PostgreSQL ভেতরের Query টা একবার চালায় না, প্রতিটা বাইরের Row এর জন্য একবার করে
                চালায়। Rahim এর Row এ এসে c.customer_id মানে 1, তাই ভেতরের Query খোঁজে customer_id = 1 এর Booking।
                Nusrat এর Row এ 2। এভাবে পনেরোবার। প্রতিবারের ফল সেই Customer এর পাশে জোড়া লাগে।
              </ContentParagraph>
              <ContentParagraph>
                একটা দর্জির দোকান ভাবুন। দর্জির কাছে পনেরোজন খদ্দেরের তালিকা। তিনি একবারে সবার জন্য একটা মাপ নেন না,
                প্রত্যেকের কাছে গিয়ে আলাদা করে মাপ নেন, আর মাপের কাগজটা সেই খদ্দেরের নামের পাশে আটকে দেন। সাধারণ JOIN
                হলো একবারে দুটো তালিকা মেলানো। LATERAL হলো প্রত্যেকের জন্য আলাদা করে একটা কাজ করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ForEachRowDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা শব্দ যোগ করুন"
              query={`SELECT c.customer_id, c.full_name, x.booking_id, x.booked_at
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x
ORDER BY c.customer_id, x.booked_at DESC;`}
              caption="23টা Row। Rahim এর 17 আর 8, পুরনো Booking 1 নেই, কারণ তাঁর জন্য LIMIT 2। Nusrat এর 13 আর 2। যাঁদের একটাই Booking, যেমন Sabbir এর 5, তাঁদের একটা Row। আর পনেরোজনের একজন, Imran Kabir, এখানে নেই। কেন নেই, সেটা Section 006 এর বিষয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>Query টা জোরে পড়লে এমন শোনায়, আর এভাবে পড়ার অভ্যাস রাখুন:</ContentParagraph>
              <ContentList>
                <ListItem>PostgreSQL customers থেকে একটা একটা করে Customer নেয়, আর তাঁর নাম দেয় c।</ListItem>
                <ListItem>
                  প্রতিটা c এর জন্য PostgreSQL ভেতরের Query চালায়: bookings থেকে শুধু এই c এর Booking, নতুন থেকে পুরনো,
                  প্রথম দুটো। এই ফলের নাম x।
                </ListItem>
                <ListItem>PostgreSQL c এর Row টার পাশে x এর প্রতিটা Row জোড়া লাগায়।</ListItem>
                <ListItem>শেষে PostgreSQL পুরোটা Customer আর booked_at দিয়ে সাজায়।</ListItem>
              </ContentList>
              <ContentParagraph>
                মনে রাখার কথা একটাই:
                সাধারণ Subquery একবার চলে, LATERAL Subquery প্রতিটা বাইরের Row এর জন্য একবার। PostgreSQL এর Docs ও ঠিক
                এভাবে বলে: যে Row থেকে Column আসছে, তার প্রতিটার মান দিয়ে LATERAL অংশটা চালানো হয়, আর ফলের Row গুলো সেই
                Row এর সাথে জোড়া লাগে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "watch-it-run",
      subHeader: { index: "005", title: "Watch It Run" },
      title: <SectionTitle>এক এক করে, পনেরোবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab টা ঠিক সেই পনেরোবারের চলা আপনার চোখের সামনে করে। Next চাপলে পরের Customer আসে, ভেতরের Query তে
              তাঁর নম্বর বসে, আর ভেতরের Query যা ফেরত দেয় সেটা ডান দিকের ফলাফলে যোগ হয়। Rahim এ এসে LIMIT 1, 2 আর 3
              বদলে দেখুন কতগুলো Row আসে। তারপর শেষ পর্যন্ত, পনেরো নম্বর Customer, Imran Kabir পর্যন্ত যান, আর JOIN
              এর ধরন বদলে দেখুন তাঁর সাথে কী হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LateralStepLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab থেকে তিনটা জিনিস চোখে পড়ার কথা। এক, ভেতরের Query প্রতিবার আলাদা ফল দেয়, কারণ প্রতিবার আলাদা
              customer_id দেখে। দুই, LIMIT প্রতিটা Customer এর ভেতরে খাটে, তাই LIMIT 2 এ মোট 23, শুধু 2 না। তিন, যাঁর
              কোনো Booking নেই তাঁর জন্য ভেতরের Query খালি ফেরে, আর তখন JOIN এর ধরনই ঠিক করে তিনি থাকবেন কিনা। শেষ
              কথাটাই পরের দুই Section এর বিষয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "cross-join-lateral",
      subHeader: { index: "006", title: "CROSS JOIN LATERAL" },
      title: <SectionTitle>খালি ফল মানে বাদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণের Query তে LATERAL এর আগে CROSS JOIN লেখা ছিল। Lesson 05 এ CROSS JOIN মানে ছিল প্রতিটা Row এর
                সাথে প্রতিটা Row। এখানে বাঁ দিকের প্রতিটা Row এর সাথে জোড়া লাগে শুধু তার নিজের জন্য চালানো ভেতরের
                Query র Row গুলো, কারণ মেলানোর শর্তটা ভেতরের WHERE এ আগেই বসানো। ফলে CROSS JOIN LATERAL আচরণে ঠিক INNER
                JOIN এর মতো: জোড়ার মতো কিছু না পেলে বাঁ দিকের Row টা ফলাফলে আসে না।
              </ContentParagraph>
              <ContentParagraph>
                Imran Kabir এর ঠিক এটাই হলো। তাঁর কোনো Booking নেই, তাই তাঁর জন্য ভেতরের Query শূন্য Row ফেরায়। জোড়া
                লাগানোর কিছু নেই, তাই তিনি বাদ। Lesson 02 এ INNER JOIN এ ঠিক একইভাবে তিনি হারিয়ে গিয়েছিলেন। নাসরিনের
                ফোনের তালিকায় তিনি না থাকলে তিনি ফোনও পাবেন না, অথচ Account খোলা নতুন Customer এর সাথেই কথা বলা সবচেয়ে
                জরুরি।
              </ContentParagraph>
              <ContentParagraph>
                CROSS JOIN LATERAL লেখার আরেকটা চেহারা প্রায়ই দেখবেন, পুরনো কমার Join এর মতো:{" "}
                <code className={CODE}>FROM customers c, LATERAL (...) AS x</code>। দুটো একই কাজ করে। নিচের বক্সে কতজন
                Customer ফলাফলে এলেন সেটা গুনে দেখা হয়েছে, দুইভাবে লিখে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="পনেরোজনের কতজন এলেন"
              query={`SELECT count(DISTINCT c.customer_id) AS customers_in_result,
       count(*)                      AS rows
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x;

SELECT count(DISTINCT c.customer_id) AS customers_in_result,
       count(*)                      AS rows
FROM customers c,
     LATERAL (
       SELECT b.booking_id
       FROM bookings b
       WHERE b.customer_id = c.customer_id
       ORDER BY b.booked_at DESC
       LIMIT 2
     ) AS x;`}
              caption="দুটো Query ই বলে 14 জন Customer আর 23টা Row। পনেরোজনের একজন কম, আর সেই একজন Imran। দ্বিতীয় Query তে CROSS JOIN এর জায়গায় শুধু একটা কমা, কিন্তু ফল একই। কমার পরে LATERAL শব্দটা কিন্তু তবু লাগে।"
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
                  প্রতিটা Customer এর সবচেয়ে নতুন <strong>একটা</strong> Booking: Customer এর{" "}
                  <code className={CODE}>full_name</code>, সেই Booking এর <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>status</code>, এই তিনটা Column। যাঁদের কোনো Booking নেই তাঁরা বাদ যাবেন।
                  ফলাফল customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  উপরের Query টাই, শুধু ভেতরে LIMIT 1, আর ভেতরের SELECT এ status ও নিন। কেউ বাদ গেলে সমস্যা নেই, তাই
                  CROSS JOIN LATERAL। বাইরের ORDER BY তে <code className={CODE}>c.customer_id</code>।
                </>
              }
              solution={`SELECT c.full_name, x.booking_id, x.status
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id, b.status
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 1
) AS x
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "left-join-lateral",
      subHeader: { index: "007", title: "LEFT JOIN LATERAL" },
      title: <SectionTitle>খালি হলেও থাকবে: ON true</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Imran কে তালিকায় রাখার উপায় Lesson 03 এ আপনি শিখেছেন: LEFT JOIN। বাঁ দিকের প্রতিটা Row থাকবেই, আর
                ডান দিকে মিল না পেলে ডান দিকের Column গুলো NULL। LATERAL এর সাথেও ঠিক তাই, শুধু লিখতে হয়{" "}
                <code className={CODE}>LEFT JOIN LATERAL (...) AS x ON true</code>।
              </ContentParagraph>
              <ContentParagraph>
                শেষের <code className={CODE}>ON true</code> প্রথমবার অদ্ভুত লাগে। LEFT JOIN এর ব্যাকরণে একটা ON থাকতেই
                হবে, ওটা ছাড়া PostgreSQL syntax error দেয়। কিন্তু মেলানোর আসল শর্ত, মানে এই Booking গুলো এই Customer
                এর কিনা, সেটা ভেতরের WHERE এ আগেই লেখা। তাই বাইরে বলার আর কিছু বাকি নেই। ON true দিয়ে শুধু জানানো হয়
                যে ভেতর থেকে যা আসে তার সবটাই জোড়া লাগবে। true মানে এমন একটা শর্ত যেটা সবসময় সত্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CrossVsLeftLateralSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কেউ বাদ যাবেন না"
              query={`SELECT c.customer_id, c.full_name, x.booking_id
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x ON true
WHERE x.booking_id IS NULL;

SELECT count(DISTINCT c.customer_id) AS customers_in_result,
       count(*)                      AS rows
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x ON true;`}
              caption="প্রথম Query তে একটা Row: 15, Imran Kabir, booking_id NULL। WHERE x.booking_id IS NULL ঠিক Lesson 03 এর মতো খালি Row গুলো খুঁজে দেয়। দ্বিতীয়টায় এবার 15 জন Customer আর 24টা Row, আগের চেয়ে ঠিক একটা বেশি, আর সেই একটা Imran এর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর একটা আসল প্রশ্নে এর জোর বোঝা যায়। প্রতিটা ট্যুরের পাতায় দেখাতে হবে তার পরের Departure,
              মানে 1 November 2026 বা তার পরের সবচেয়ে কাছের তারিখ, শুধু একটা। যে ট্যুরের কোনো তারিখ নেই, তার পাতাও তো
              খুলবে, সেখানে শুধু তারিখের ঘর ফাঁকা। Cox&apos;s Bazar Family Package ঠিক এমন: বিক্রির জন্য আছে, কিন্তু
              একটাও Departure নেই। CROSS দিলে সে হারিয়ে যেত, LEFT দিলে থাকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের পরের তারিখ"
              query={`SELECT t.tour_id, t.title, nxt.departure_id, nxt.starts_on, nxt.seats_left
FROM tours t
LEFT JOIN LATERAL (
  SELECT d.departure_id, d.starts_on, d.seats_left
  FROM departures d
  WHERE d.tour_id = t.tour_id
    AND d.starts_on >= DATE '2026-11-01'
  ORDER BY d.starts_on
  LIMIT 1
) AS nxt ON true
ORDER BY t.tour_id;`}
              caption="নয়টা ট্যুর, নয়টা Row। Saint Martin Island Escape এর পরের তারিখ 2026-11-20, 14টা সিট খালি। Sylhet Tea Garden Tour এর 2026-11-14। বন্ধ Saint Martin Luxury Stay এরও একটা তারিখ আছে, 2027-02-14, কারণ Query টা is_active দেখে না। আর শেষ Row, Cox's Bazar Family Package, তিনটা ঘরই NULL। LEFT এর জায়গায় CROSS লিখে চালান: আটটা Row।"
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
                  প্রতিটা Destination এর সবচেয়ে সস্তা ট্যুর: Destination এর <code className={CODE}>name</code>, সেই
                  ট্যুরের <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>। যে Destination এ
                  কোনো ট্যুর নেই সেটাও আসবে, তখন ট্যুরের দুটো ঘর ফাঁকা। ফলাফল destination_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  বাঁ দিকে destinations d। ভেতরে tours, শর্ত <code className={CODE}>t.destination_id = d.destination_id</code>,
                  দামের ছোট থেকে বড়, LIMIT 1। Kuakata কে রাখতে LEFT JOIN LATERAL আর ON true।
                </>
              }
              solution={`SELECT d.name, ch.title, ch.price_bdt
FROM destinations d
LEFT JOIN LATERAL (
  SELECT t.title, t.price_bdt
  FROM tours t
  WHERE t.destination_id = d.destination_id
  ORDER BY t.price_bdt
  LIMIT 1
) AS ch ON true
ORDER BY d.destination_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "top-n-per-group",
      subHeader: { index: "008", title: "Top N per Group" },
      title: <SectionTitle>প্রতিটা দলের প্রথম কয়েকটা, আর সমান হলে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা করলেন তার একটা সাধারণ নকশা আছে, আর এটা মুখস্থ রাখার মতো। প্রতিটা দলের প্রথম N টা চাইলে: দলটা
                বাঁ দিকে, ভেতরের Query তে সেই দলের শর্ত, তারপর ORDER BY যেটা ঠিক করে প্রথম মানে কী, আর LIMIT N। নতুন
                থেকে পুরনো চাইলে DESC, সস্তা থেকে দামি চাইলে ASC। শুধু N বদলালেই প্রথম একটা থেকে প্রথম দশটা।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু একটা ফাঁদ আছে, Module 03 এর ORDER BY লেসনে যেটা দেখেছেন: সমান মান। Saint Martin Island Escape এর
                তিনটা Review এর দুটো পাঁচ তারকা। সেরা Review চাইলে <code className={CODE}>ORDER BY rating DESC LIMIT 1</code>{" "}
                লিখলে দুটো পাঁচের যেকোনোটা আসতে পারে। আজ হয়তো Review 1 আসে, কাল Data বা Plan বদলালে Review 3। দুটো
                সমাধান আছে। এক, একটা দ্বিতীয় সাজানোর Column যোগ করুন যেটা সমান হয় না, যেমন সবচেয়ে আগে লেখাটা আগে:{" "}
                <code className={CODE}>ORDER BY rating DESC, created_at</code>। দুই, যদি সমানগুলো সবই চান, তাহলে Module
                03 এর <code className={CODE}>FETCH FIRST 1 ROWS WITH TIES</code>, যেটা LATERAL এর ভেতরেও চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সমান রেটিং, তিনভাবে"
              query={`SELECT r.review_id, r.rating, r.created_at
FROM departures d
JOIN bookings b ON b.departure_id = d.departure_id
JOIN reviews r  ON r.booking_id = b.booking_id
WHERE d.tour_id = 1
ORDER BY r.rating DESC;

SELECT t.title, top.review_id, top.rating
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC, r.created_at
  LIMIT 1
) AS top
WHERE t.tour_id = 1;

SELECT t.title, top.review_id, top.rating
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC
  FETCH FIRST 1 ROWS WITH TIES
) AS top
WHERE t.tour_id = 1;`}
              caption="প্রথম Query দেখায় Saint Martin এর তিনটা Review: 1 আর 3 দুটোই 5, 2 হলো 4। দ্বিতীয়টায় created_at দিয়ে সমতা ভাঙা, তাই সবসময় Review 1, যেটা 2026-01-20 এ লেখা, আগে। তৃতীয়টা WITH TIES দিয়ে দুটো পাঁচই দেয়, 1 আর 3। কোনটা চাই সেটা প্রশ্ন ঠিক করে, কিন্তু সিদ্ধান্তটা আপনাকেই নিতে হবে।"
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
                  প্রতিটা ট্যুরের সবচেয়ে প্রথম দুটো Departure, অতীতেরগুলোসহ: ট্যুরের{" "}
                  <code className={CODE}>title</code> আর Departure এর <code className={CODE}>starts_on</code>, দুটো
                  Column। যে ট্যুরের কোনো Departure নেই সে বাদ যাবে। ফলাফল tour_id আর তারপর starts_on এর ক্রমে।
                </>
              }
              hint={
                <>
                  বাঁ দিকে tours t, ভেতরে departures, শর্ত <code className={CODE}>d.tour_id = t.tour_id</code>, সবচেয়ে
                  প্রথম মানে starts_on এর ছোট থেকে বড়, LIMIT 2। বাদ গেলে সমস্যা নেই, তাই CROSS। এখানে কোনো তারিখের সীমা
                  নেই।
                </>
              }
              solution={`SELECT t.title, f.starts_on
FROM tours t
CROSS JOIN LATERAL (
  SELECT d.starts_on
  FROM departures d
  WHERE d.tour_id = t.tour_id
  ORDER BY d.starts_on
  LIMIT 2
) AS f
ORDER BY t.tour_id, f.starts_on;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "joins-inside",
      subHeader: { index: "009", title: "Joins Inside" },
      title: <SectionTitle>ভেতরের Query নিজেও Join করতে পারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের Section এর Review এর Query তে একটা জিনিস খেয়াল করেছেন হয়তো: ভেতরের Query তে তিনটা Table, departures,
                bookings আর reviews, Join দিয়ে জোড়া। LATERAL এর ভেতরে পুরো একটা স্বাভাবিক Query লেখা যায়, Join,
                WHERE, ORDER BY, LIMIT সব নিয়ে। শুধু একটা জায়গায় বাইরের Row এর ছোঁয়া থাকে, এখানে{" "}
                <code className={CODE}>d.tour_id = t.tour_id</code>।
              </ContentParagraph>
              <ContentParagraph>
                এই ক্ষমতাটাই LATERAL কে কাজের করে তোলে। একটা Tour এর Review সরাসরি tours Table এর পাশে নেই। Review ঝুলে
                আছে Booking এর সাথে, Booking ঝুলে আছে Departure এর সাথে, আর Departure ঝুলে আছে Tour এর সাথে। Lesson 07 এ
                এমন শিকল আপনি বাইরে বানিয়েছিলেন। এখানে শিকলটা ভেতরে, আর বাইরে থাকে শুধু Tour, যাতে প্রতিটা Tour এর জন্য
                আলাদা করে সেরা Review টা বাছাই করা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের সেরা Review"
              query={`SELECT t.tour_id, t.title, top.review_id, top.rating
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC, r.created_at
  LIMIT 1
) AS top
ORDER BY t.tour_id;

SELECT t.tour_id, t.title, top.review_id, top.rating
FROM tours t
LEFT JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC, r.created_at
  LIMIT 1
) AS top ON true
ORDER BY t.tour_id;`}
              caption="প্রথম Query তে ছয়টা ট্যুর, কারণ শুধু ছয়টার Review আছে: Saint Martin এর সেরা Review 1, পাঁচ তারকা; Sundarbans এর Review 5, তাতেও পাঁচ। দ্বিতীয়টায় নয়টাই, আর Ratargul, Luxury Stay আর Family Package এর ঘরে NULL। তিনটারই কোনো Review নেই, কেউ এখনো সেই ট্যুরে ঘুরে এসে লেখেননি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভেতরে কোন Alias, বাইরে কোন Alias",
          content: (
            <ContentParagraph>
              ভেতরের Query র Table গুলোর Alias বাইরের Query দেখে না, শুধু ভেতরের SELECT এ যে Column গুলো বের হয়, সেগুলো
              বাইরে আসে, LATERAL অংশের নাম দিয়ে, যেমন <code className={CODE}>top.rating</code>। তাই বাইরে{" "}
              <code className={CODE}>r.comment</code> লিখলে Error, কারণ r ভেতরের নাম। বাইরে কিছু লাগলে সেটা ভেতরের
              SELECT এ নিয়ে আসুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "aggregates-inside",
      subHeader: { index: "010", title: "Aggregates Inside" },
      title: <SectionTitle>ভেতরে যোগফল: সবসময় ঠিক একটা Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                LATERAL এর ভেতরে Module 05 এর Aggregate ও লেখা যায়: count, sum, avg। তখন একটা চমৎকার জিনিস ঘটে। GROUP
                BY ছাড়া একটা Aggregate Query সবসময় ঠিক একটা Row ফেরায়, কোনো Row না মিললেও। Module 05 এর প্রথম লেসনে
                দেখেছেন, কিছু না মিললে count হয় 0 আর sum হয় NULL। তাই এমন LATERAL কখনো খালি ফেরে না, আর CROSS JOIN
                LATERAL দিলেও কেউ বাদ যায় না।
              </ContentParagraph>
              <ContentParagraph>
                এর ব্যবহার সবচেয়ে বেশি Report এ। প্রতিটা ট্যুরের পাশে কতগুলো Departure, কতগুলো নিশ্চিত Booking আর কত
                টাকা আয়। Lesson 07 এ দেখেছেন, অনেক Table একসাথে জুড়ে তারপর যোগ করলে কখনো কখনো একই টাকা দুইবার গোনা হয়।
                LATERAL এর ভেতরে যোগ করলে প্রতিটা হিসাব নিজের ছোট Query তে আলাদা হয়, আর বাইরে প্রতিটা ট্যুরের জন্য ঠিক
                একটা করে Row আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা ট্যুরের হিসাব, ভেতরে যোগ করে"
              query={`SELECT t.tour_id, t.title, s.departures, s.confirmed, s.revenue
FROM tours t
CROSS JOIN LATERAL (
  SELECT count(DISTINCT d.departure_id)                              AS departures,
         count(b.booking_id) FILTER (WHERE b.status = 'confirmed')   AS confirmed,
         sum(b.total_bdt)    FILTER (WHERE b.status = 'confirmed')   AS revenue
  FROM departures d
  LEFT JOIN bookings b ON b.departure_id = d.departure_id
  WHERE d.tour_id = t.tour_id
) AS s
ORDER BY t.tour_id;`}
              caption="CROSS JOIN LATERAL, তবু নয়টা ট্যুরই আছে। Saint Martin Island Escape: 4টা Departure, 5টা নিশ্চিত Booking, 125000.00 টাকা। Luxury Stay: 1টা Departure, 0, আর revenue NULL। Family Package: 0, 0, NULL, কারণ ভেতরের Aggregate কিছু না পেয়েও একটা Row ফেরায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা সতর্কতা: এই নিশ্চয়তা শুধু GROUP BY ছাড়া। ভেতরে GROUP BY লিখলে কিছু না মিললে কোনো দলই তৈরি হয় না,
                ফলে শূন্য Row, আর CROSS JOIN LATERAL তখন সেই বাইরের Row কে বাদ দেয়। নিচের বক্সে Lamia Haque আর Imran
                Kabir কে দুইভাবে গোনা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="GROUP BY ভেতরে গেলে কী হারায়"
              query={`SELECT c.customer_id, s.bookings
FROM customers c
CROSS JOIN LATERAL (
  SELECT count(*) AS bookings
  FROM bookings b
  WHERE b.customer_id = c.customer_id
) AS s
WHERE c.customer_id IN (14, 15)
ORDER BY c.customer_id;

SELECT c.customer_id, s.bookings
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.customer_id, count(*) AS bookings
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  GROUP BY b.customer_id
) AS s
WHERE c.customer_id IN (14, 15)
ORDER BY c.customer_id;`}
              caption="প্রথম Query তে দুজনই: Lamia 1, Imran 0। দ্বিতীয়টায় শুধু Lamia। Imran এর কোনো Booking নেই, তাই GROUP BY কোনো দল বানায় না, ভেতরের Query খালি, আর CROSS JOIN LATERAL তাঁকে বাদ দেয়। ভেতরে একটা দলই হবে যখন, তখন GROUP BY লেখার দরকারও নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই বাইরের Row এর পাশে কয়েকটা LATERAL পরপর বসানো যায়, প্রতিটা আলাদা হিসাবের জন্য। নিচের Query তে প্রতিটা
              Customer এর জন্য দুটো ছোট Query: একটা গোনে Booking আর নিশ্চিত টাকা, আরেকটা গোনে Review। দুটো হিসাব কখনো
              একে অপরের Row বাড়ায় না, কারণ প্রতিটা নিজের LATERAL এ বন্ধ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো হিসাব, দুটো LATERAL"
              query={`SELECT c.full_name, bk.bookings, bk.confirmed_bdt, rv.reviews
FROM customers c
CROSS JOIN LATERAL (
  SELECT count(*) AS bookings,
         sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed') AS confirmed_bdt
  FROM bookings b
  WHERE b.customer_id = c.customer_id
) AS bk
CROSS JOIN LATERAL (
  SELECT count(*) AS reviews
  FROM bookings b
  JOIN reviews r ON r.booking_id = b.booking_id
  WHERE b.customer_id = c.customer_id
) AS rv
WHERE c.customer_id IN (1, 5, 15)
ORDER BY c.customer_id;`}
              caption="Rahim Uddin: 3টা Booking, নিশ্চিত 44000.00 টাকা, 2টা Review। Sabbir Hossain: 1টা Booking, সেটা বাতিল, তাই টাকার ঘর NULL, Review 0। Imran Kabir: 0, NULL, 0। WHERE মুছে চালান: পনেরোজনই আসেন, কেউ বাদ যান না।"
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
                  প্রতিটা Customer এর জন্য এক লাইন: <code className={CODE}>full_name</code>, তাঁর মোট Booking এর সংখ্যা,
                  আর নিশ্চিত Booking গুলোর মোট <code className={CODE}>total_bdt</code>, যেখানে কিছু না থাকলে 0 দেখাবে,
                  NULL না। পনেরোজনই আসবেন। ফলাফল customer_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  একটা CROSS JOIN LATERAL, ভেতরে GROUP BY ছাড়া count আর sum, sum এ{" "}
                  <code className={CODE}>FILTER (WHERE b.status = &apos;confirmed&apos;)</code>। 0 দেখাতে sum এর চারপাশে
                  Module 04 এর COALESCE।
                </>
              }
              solution={`SELECT c.full_name, st.bookings, st.confirmed_bdt
FROM customers c
CROSS JOIN LATERAL (
  SELECT count(*) AS bookings,
         coalesce(sum(b.total_bdt) FILTER (WHERE b.status = 'confirmed'), 0) AS confirmed_bdt
  FROM bookings b
  WHERE b.customer_id = c.customer_id
) AS st
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "set-returning-functions",
      subHeader: { index: "011", title: "Set-Returning Functions" },
      title: <SectionTitle>একটা Row থেকে অনেকগুলো Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ LATERAL এর ভেতরে ছিল একটা Subquery। তার জায়গায় একটা Function ও বসতে পারে, তবে বিশেষ এক রকমের
                Function, যেটা একটা মান না দিয়ে কয়েকটা Row ফেরায়। এদের বলে Set-Returning Function। সবচেয়ে চেনাটা
                Module 04 এর তারিখের লেসনে দেখেছেন: <code className={CODE}>generate_series(1, 4)</code> ফেরায় চারটা Row,
                1, 2, 3 আর 4।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর একটা আসল কাজ ভাবুন: যাত্রার দিন ঘাটে প্রতিটা যাত্রীর হাতে একটা আলাদা টিকিট দিতে হবে।
                Booking 2 তে চারটা সিট, মানে চারটা টিকিট। প্রতিটা Booking এর সিটের সংখ্যা আলাদা, তাই Function টাকে প্রতিটা
                Booking এর seats দেখতে হবে: <code className={CODE}>generate_series(1, b.seats)</code>। এটাই LATERAL, শুধু
                Function দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                একটা মজার ব্যাপার: Function এর বেলায় PostgreSQL এই দেখার অধিকার নিজে থেকেই দেয়। Docs এর ভাষায় Function
                এর আগে LATERAL লেখা একটা শুধু শোভার শব্দ, লিখলেও চলে, না লিখলেও চলে। Subquery র বেলায় কিন্তু শব্দটা
                বাধ্যতামূলক, Section 003 এর Error টা মনে রাখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SeatExpandDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা সিটের জন্য একটা টিকিট"
              query={`SELECT b.booking_id, b.seats, s.seat_no,
       'B' || b.booking_id || '-S' || s.seat_no AS ticket
FROM bookings b
CROSS JOIN LATERAL generate_series(1, b.seats) AS s(seat_no)
WHERE b.departure_id = 1
  AND b.status = 'confirmed'
ORDER BY b.booking_id, s.seat_no;

SELECT count(*) AS tickets
FROM bookings b,
     generate_series(1, b.seats) AS s(seat_no)
WHERE b.status <> 'cancelled';

SELECT sum(seats) AS seats_held
FROM bookings
WHERE status <> 'cancelled';`}
              caption="প্রথম Query তে Departure 1 এর দুটো নিশ্চিত Booking থেকে ছয়টা টিকিট: B1-S1, B1-S2, তারপর B2-S1 থেকে B2-S4। দ্বিতীয়টায় LATERAL শব্দ নেই, শুধু কমা, তবু চলে, আর বাতিল ছাড়া সব Booking এ মোট 48টা টিকিট। তৃতীয়টা মিলিয়ে দেখায়: ধরা সিটও ঠিক 48।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code className={CODE}>AS s(seat_no)</code> অংশটা খেয়াল করুন। এটা Function এর ফলকে একটা Table এর নাম s
              দেয়, আর তার একমাত্র Column এর নাম seat_no। নাম না দিলে Column এর নাম হতো generate_series, যেটা পড়তে
              অস্বস্তিকর। একই কাজের আরেকটা চেনা Function হলো <code className={CODE}>unnest</code>, যেটা Module 05 এর
              array_agg এর উল্টো: একটা Array কে আবার Row এ ভেঙে দেয়। Array নিয়ে পুরো কাজ Module 15 এ।
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
                  Departure 8 এর ঘাটের টিকিট: বাতিল ছাড়া প্রতিটা Booking এর প্রতিটা সিটের জন্য একটা Row, তিনটা Column:{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>seat_no</code> আর{" "}
                  <code className={CODE}>B13-S1</code> চেহারার টিকিট নম্বর। ফলাফল booking_id আর তারপর seat_no এর ক্রমে।
                </>
              }
              hint={
                <>
                  উপরের প্রথম Query টাই, শুধু <code className={CODE}>departure_id = 8</code> আর status এর শর্ত{" "}
                  <code className={CODE}>&lt;&gt; &apos;cancelled&apos;</code>, যাতে অপেক্ষার Booking ও আসে।
                </>
              }
              solution={`SELECT b.booking_id, s.seat_no, 'B' || b.booking_id || '-S' || s.seat_no AS ticket
FROM bookings b
CROSS JOIN LATERAL generate_series(1, b.seats) AS s(seat_no)
WHERE b.departure_id = 8
  AND b.status <> 'cancelled'
ORDER BY b.booking_id, s.seat_no;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "choosing-the-tool",
      subHeader: { index: "012", title: "Choosing the Tool" },
      title: <SectionTitle>LATERAL কখন, আর কখন না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Customer এর সবচেয়ে নতুন একটা Booking, এই প্রশ্নের অন্তত তিনটা পথ আছে। Module 03 এর DISTINCT ON,
                এই লেসনের LATERAL, আর Module 08 এর Window Function, যার একটা ছোট ঝলক নিচে। তিনটাই একই চোদ্দটা Row দেয়।
                তাহলে কোনটা নেবেন?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, তিন পথ"
              query={`SELECT DISTINCT ON (b.customer_id) b.customer_id, b.booking_id
FROM bookings b
ORDER BY b.customer_id, b.booked_at DESC;

SELECT c.customer_id, x.booking_id
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 1
) AS x
ORDER BY c.customer_id;

SELECT customer_id, booking_id
FROM (
  SELECT b.customer_id, b.booking_id,
         row_number() OVER (PARTITION BY b.customer_id ORDER BY b.booked_at DESC) AS rn
  FROM bookings b
) AS ranked
WHERE rn = 1
ORDER BY customer_id;`}
              caption="তিনটা Query, তিনবার একই চোদ্দটা Row: 1 এর 17, 2 এর 13, শেষে 14 এর 16। তৃতীয়টার row_number আর OVER এখন শুধু দেখে রাখুন, Module 08 এ এদের পুরো গল্প। আপাতত জানুন, এটা প্রতিটা Customer এর Booking গুলোকে 1, 2, 3 নম্বর দেয়, আর বাইরে rn = 1 রাখা হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পথ", "কখন ভালো", "সীমা"],
          rows: [
            [
              "DISTINCT ON",
              "প্রতিটা দলের ঠিক একটা Row, PostgreSQL এ, ছোট আর পরিষ্কার",
              "একের বেশি Row দেয় না, MySQL এ নেই",
            ],
            [
              "LATERAL",
              "প্রতিটা দলের প্রথম N টা, ভেতরে Join বা যোগফল, বাঁ দিকের প্রতিটা Row রাখা, Row বানানো Function",
              "প্রতিটা বাইরের Row এর জন্য একবার চলে, তাই বড় Table এ ভেতরের খোঁজটা দ্রুত হওয়া চাই",
            ],
            [
              "Window Function",
              "প্রতিটা Row এর পাশে তার ক্রম বা আগের পরের মান, Report এ অনেক হিসাব একসাথে",
              "Module 08 এর বিষয়, প্রথম N টা পেতে বাইরে আরেকটা ছাঁকনি লাগে",
            ],
            [
              "সাধারণ JOIN, GROUP BY",
              "প্রতিটা দলের একটা যোগফল, বা সোজা মিলানো",
              "দলের ভেতরের একটা নির্দিষ্ট Row, যেমন সবচেয়ে সস্তা ট্যুরের নাম, সরাসরি দেয় না",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা কথা মনে রাখার মতো: LATERAL এর ভেতরের Query প্রতিটা বাইরের Row এর জন্য চলে। পনেরোজন Customer হলে
                পনেরোবার, পনেরো লাখ হলে পনেরো লাখবার। প্রতিবারের খোঁজটা যদি পুরো bookings Table ঘাঁটে, তাহলে বড় Data তে
                এটা ধীর। সমাধান সাধারণত একটা Index, এখানে customer_id আর booked_at মিলিয়ে, যাতে প্রতিটা খোঁজ সরাসরি সেই
                Customer এর নতুন Booking গুলোতে পৌঁছায়। Index আর তার মাপজোক Module 13 এর বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                আর উল্টো দিকটা: যেখানে সাধারণ JOIN যথেষ্ট, সেখানে LATERAL লিখবেন না। PostgreSQL এর Docs নিজেই একটা উদাহরণ
                দেয় যেখানে LATERAL দিয়ে লেখা Query আর সাধারণ Join একই ফল দেয়, আর বলে সেই LATERAL কোনো কাজের না। LATERAL
                এর দরকার তখনই, যখন ভেতরের খোঁজটার নিজের ORDER BY, LIMIT, যোগফল বা Function লাগে। নিচের Lab এ সাতটা প্রশ্ন
                আছে, প্রতিটার জন্য হাতিয়ার বাছাই করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WhichToolLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এও আছে, 8.0.14 থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ LATERAL এসেছে 8.0.14 সংস্করণে, MySQL এর ভাষায় Lateral Derived Table নামে। তাই আপনার MySQL
                কোর্সে যদি পুরনো সংস্করণ ব্যবহার হয়, সেখানে এই লেসন চলবে না। MySQL 8.4 এ এই লেসনের মূল Query গুলো হুবহু
                চালিয়ে দেখা হয়েছে: CROSS JOIN LATERAL, LEFT JOIN LATERAL ... ON TRUE, আর কমার পরে LATERAL, তিনটাই চলে,
                ভেতরে ORDER BY আর LIMIT সহ, আর Section 010 এর যোগফলের LATERAL ও একই সংখ্যা দেয়।
              </ContentParagraph>
              <ContentParagraph>পার্থক্যগুলো ছোট, কিন্তু জানা দরকার:</ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["LATERAL ছাড়া বাইরের Column ছোঁয়া", "ERROR, সাথে HINT: mark this subquery with LATERAL", "ERROR 1054: Unknown column 'c.customer_id' in 'where clause'"],
            ["LEFT JOIN LATERAL এ ON true বাদ দিলে", "syntax error at end of input", "ERROR 1064, syntax error"],
            ["Subquery র নাম (AS x) বাদ দিলে", "চলে, PostgreSQL 16 থেকে", "ERROR 1248: Every derived table must have its own alias"],
            ["generate_series", "আছে, Function এর আগে LATERAL ঐচ্ছিক", "নেই, ERROR 1064; সংখ্যার সারি বানাতে Recursive CTE, Module 07"],
            ["FETCH FIRST 1 ROWS WITH TIES", "চলে, ভেতরেও", "নেই, ERROR 1064"],
            ["ভেতরে Join, ORDER BY, LIMIT, Aggregate", "চলে", "চলে, একই ফল"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "lateral-mysql.sql (MySQL 8.4)",
          code: `-- MySQL 8.4 এ চালিয়ে দেখা, island_tours (MySQL সংস্করণ)
SELECT c.customer_id, c.full_name, x.booking_id
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x
ORDER BY c.customer_id, x.booked_at DESC;   -- 23 rows, PostgreSQL এর মতোই

SELECT t.tour_id, nxt.starts_on
FROM tours t
LEFT JOIN LATERAL (
  SELECT d.starts_on
  FROM departures d
  WHERE d.tour_id = t.tour_id
    AND d.starts_on >= '2026-11-01'
  ORDER BY d.starts_on
  LIMIT 1
) AS nxt ON TRUE
ORDER BY t.tour_id;                         -- 9 rows, tour 9 এর পাশে NULL`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Function এর বেলায় MySQL একটু আলাদা",
          content: (
            <ContentParagraph>
              MySQL এর Docs বলে, JSON_TABLE এর মতো Table Function এর সাথে Join সবসময় LATERAL এর মতো আচরণ করে, আর সেখানে
              LATERAL শব্দটা লেখাই যায় না। PostgreSQL এ Function এর আগে লিখলেও চলে। তাই দুই Database এর মধ্যে Query
              নেওয়ার সময় Function এর আগের LATERAL টা একবার দেখে নিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ LATERAL কোথায় কাজ করে</SectionTitle>,
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
                Island Tours এর Website আর Admin Panel এ এই লেসনের প্রশ্নগুলো প্রতিদিন আসে। ট্যুরের পাতায় নিচের দিকে একটা
                ছোট অংশ থাকে: সামনের তারিখগুলো, যেখানে এখনো সিট খালি, সর্বোচ্চ তিনটা। এটা একটা Tour এর জন্য Top N, শর্তসহ।
                Customer এর Profile এ থাকে তাঁর সাম্প্রতিক দুটো Booking, ট্যুরের নামসহ, আর নতুন Customer এর Profile ও খুলতে
                হবে, যদিও সেখানে দেখানোর কিছু নেই। এটা LEFT JOIN LATERAL, ভেতরে তিনটা Table এর Join।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ট্যুরের পাতা: সামনের তারিখ, সিট খালি আছে এমন"
              query={`SELECT t.title, nxt.starts_on, nxt.seats_left
FROM tours t
CROSS JOIN LATERAL (
  SELECT d.starts_on, d.seats_left
  FROM departures d
  WHERE d.tour_id = t.tour_id
    AND d.starts_on >= DATE '2026-11-01'
    AND d.seats_left > 0
  ORDER BY d.starts_on
  LIMIT 3
) AS nxt
WHERE t.tour_id = 1;`}
              caption="Saint Martin Island Escape এর সামনে দুটো তারিখ: 2026-11-20, 14টা সিট খালি, আর 2026-12-18, 19টা। LIMIT 3 মানে সর্বোচ্চ তিনটা, তিনটার কম থাকলে যতগুলো আছে ততগুলো। tour_id = 1 মুছে চালান: প্রতিটা ট্যুরের নিজের তারিখগুলো, যার তারিখ নেই সে নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Customer এর Profile: সাম্প্রতিক দুটো Booking"
              query={`SELECT c.full_name, rec.booking_id, rec.title, rec.starts_on, rec.status
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id, t.title, d.starts_on, b.status
  FROM bookings b
  JOIN departures d ON d.departure_id = b.departure_id
  JOIN tours t      ON t.tour_id = d.tour_id
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS rec ON true
WHERE c.customer_id IN (1, 15)
ORDER BY c.customer_id, rec.booking_id DESC;`}
              caption="Rahim Uddin এর দুটো: Booking 17, Sundarbans Mangrove Cruise, 2026-12-04, pending; Booking 8, Sajek Valley Cloud Trip, 2026-03-06, confirmed। Imran Kabir এর Profile এর একটা Row, বাকি সব ঘর NULL। App এ এই NULL দেখে লেখা হয়: এখনো কোনো Booking নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Challenge। ট্যুরের পাতার সবচেয়ে ভরসার অংশ হলো একটা সেরা Review, যিনি লিখেছেন তাঁর নামসহ। এর জন্য
              ভেতরের Query তে চারটা Table লাগবে, সমান রেটিংয়ের সমাধান লাগবে, আর মন্তব্য না থাকলে একটা বিকল্প লেখা। এই
              লেসনের প্রায় সবকিছু এক জায়গায়।
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
                  যে ট্যুরগুলোর অন্তত একটা Review আছে, প্রতিটার জন্য সেরা Review এর একটা কার্ড, চারটা Column: ট্যুরের{" "}
                  <code className={CODE}>title</code>, সেই Review এর <code className={CODE}>rating</code>, তার{" "}
                  <code className={CODE}>comment</code> (না থাকলে লেখা থাকবে <code className={CODE}>(no comment)</code>),
                  আর যিনি লিখেছেন তাঁর <code className={CODE}>full_name</code>। সেরা মানে সর্বোচ্চ rating, সমান হলে যেটা
                  আগে লেখা (created_at ছোট)। ফলাফল tour_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  বাঁ দিকে tours t, CROSS JOIN LATERAL। ভেতরে departures, bookings, reviews আর customers, চারটা জোড়া।
                  ভেতরে <code className={CODE}>ORDER BY r.rating DESC, r.created_at LIMIT 1</code>। বিকল্প লেখার জন্য বাইরে{" "}
                  <code className={CODE}>coalesce(top.comment, &apos;(no comment)&apos;)</code>।
                </>
              }
              solution={`SELECT t.title, top.rating, coalesce(top.comment, '(no comment)') AS comment, top.full_name
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.rating, r.comment, c.full_name
  FROM departures d
  JOIN bookings b  ON b.departure_id = d.departure_id
  JOIN reviews r   ON r.booking_id = b.booking_id
  JOIN customers c ON c.customer_id = b.customer_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC, r.created_at
  LIMIT 1
) AS top
ORDER BY t.tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা LATERAL Query লেখার সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "প্রশ্নটা প্রতিটা দিয়ে শুরু হয় কিনা দেখুন",
              description:
                "প্রতিটা Customer এর শেষ দুটো, প্রতিটা Tour এর পরের তারিখ, প্রতিটা Booking এর প্রতিটা সিট। প্রতিটা এর পরে যেটা আসে, সেটাই বাঁ দিকের Table।",
            },
            {
              title: "একটা Row এর জন্য ভেতরের Query আগে আলাদা লিখুন",
              description:
                "একটা নির্দিষ্ট মান দিয়ে, যেমন customer_id = 1। চালিয়ে দেখুন ঠিক যা চান তাই আসছে কিনা। এখানেই ORDER BY আর LIMIT ঠিক করুন।",
            },
            {
              title: "নির্দিষ্ট মানটা বাইরের Column দিয়ে বদলান",
              description:
                "1 এর জায়গায় c.customer_id। তারপর পুরো Query টা Parenthesis এ ঢুকিয়ে আগে LATERAL আর পরে AS দিয়ে একটা নাম।",
            },
            {
              title: "কেউ বাদ গেলে চলবে কিনা ঠিক করুন",
              description:
                "চললে CROSS JOIN LATERAL। না চললে LEFT JOIN LATERAL ... ON true, আর বাইরে NULL এর জন্য COALESCE ভাবুন।",
            },
            {
              title: "সমান মানের নিয়ম লিখুন",
              description:
                "ভেতরের ORDER BY তে এমন একটা শেষ Column যেটা সমান হয় না, যেমন id বা created_at। আর সমানগুলো সবই চাইলে FETCH FIRST n ROWS WITH TIES।",
            },
            {
              title: "বাইরের SELECT আর ORDER BY লিখুন",
              description:
                "ভেতরের Column গুলো বাইরে আসে LATERAL এর নাম দিয়ে, যেমন x.booking_id। ভেতরের Alias, যেমন b বা r, বাইরে চলে না।",
            },
            {
              title: "দুটো দিক থেকে যাচাই করুন",
              description:
                "একটা চেনা Row, যেমন Rahim, হাতে মিলিয়ে নিন। তারপর এমন একটা Row যার ভেতরের ফল খালি, যেমন Imran বা Family Package, দেখে নিন সে আছে না নেই, আর সেটাই চেয়েছিলেন কিনা।",
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
          headers: ["ভুল", "কী হয়", "ঠিক উপায়"],
          rows: [
            [
              "Subquery তে বাইরের Column, কিন্তু LATERAL নেই",
              "ERROR: invalid reference to FROM-clause entry, সাথে HINT",
              "Subquery র আগে LATERAL লিখুন, HINT ঠিক এটাই বলে",
            ],
            [
              "LEFT JOIN LATERAL লিখে ON true ভুলে যাওয়া",
              "syntax error at end of input",
              "শেষে ON true, মেলানোর আসল শর্ত তো ভেতরের WHERE এ",
            ],
            [
              "ভেতরে LIMIT আছে, ORDER BY নেই",
              "যেকোনো দুটো আসে; এই Data তে Rahim এর জন্য 1 আর 8, নতুন 17 না",
              "LIMIT এর আগে সবসময় ORDER BY, আর একটা সমতা ভাঙার Column",
            ],
            [
              "সবাইকে দরকার, কিন্তু CROSS JOIN LATERAL",
              "Imran বা Family Package চুপচাপ বাদ, কোনো Error ছাড়া",
              "LEFT JOIN LATERAL ... ON true",
            ],
            [
              "যোগফলের LATERAL এর ভেতরে GROUP BY",
              "কিছু না মিললে শূন্য Row, তাই CROSS এ সেই Row বাদ",
              "একটা দলের জন্য GROUP BY লাগে না, Aggregate একাই একটা Row দেয়",
            ],
            [
              "বাইরে ভেতরের Alias লেখা, যেমন r.comment",
              "ERROR: missing FROM-clause entry for table r",
              "ভেতরের SELECT এ Column টা আনুন, বাইরে top.comment",
            ],
            [
              "যেখানে সাধারণ JOIN যথেষ্ট, সেখানে LATERAL",
              "ফল একই, কিন্তু Query পড়া কঠিন",
              "ভেতরে ORDER BY, LIMIT, যোগফল বা Function না লাগলে সাধারণ JOIN",
            ],
            [
              "MySQL এ Subquery র নাম না দেওয়া",
              "ERROR 1248: Every derived table must have its own alias",
              "সবসময় AS x দিয়ে নাম, PostgreSQL এও অভ্যাসটা রাখুন",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ORDER BY ছাড়া LIMIT, ভেতরে"
              query={`SELECT c.customer_id, x.booking_id
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  LIMIT 2
) AS x
WHERE c.customer_id = 1;`}
              caption="এই বক্সে Rahim এর জন্য আসে 1 আর 8, তাঁর সবচেয়ে পুরনো দুটো, অথচ নাসরিন চেয়েছিলেন নতুন দুটো, 17 আর 8। PostgreSQL কোনো Error দেয়নি, কারণ ভুলটা ব্যাকরণের না, প্রশ্নের। ORDER BY ছাড়া LIMIT মানে যেকোনো দুটো।"
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
            <ContentList>
              <ListItem>
                <strong>LATERAL Subqueries</strong>, PostgreSQL এর অফিসিয়াল Docs, Table Expressions অধ্যায়ের একটা ছোট
                অংশ। প্রতিটা Row এর জন্য চলার নিয়ম, Function এর আগে LATERAL ঐচ্ছিক কেন, আর LEFT JOIN LATERAL ... ON
                true এর উদাহরণ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-table-expressions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-table-expressions.html
                </a>
              </ListItem>
              <ListItem>
                <strong>SELECT</strong>, PostgreSQL এর পুরো SELECT এর বিবরণ। LATERAL অংশ, আর Compatibility অংশে কেন
                PostgreSQL এ Subquery র নাম বাদ দেওয়া যায়।{" "}
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
                <strong>Set Returning Functions</strong>, generate_series আর তার আত্মীয়দের পুরো তালিকা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-srf.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-srf.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL 8.4 Lateral Derived Tables</strong>, MySQL এ LATERAL এর নিয়ম আর সীমা, কোন Join এর সাথে
                চলে আর কোনটার সাথে না।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/lateral-derived-tables.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/lateral-derived-tables.html
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনি যে MySQL কোর্সটা দেখছেন</strong>, তার Join এর অংশ, প্রায় 2:24:00 থেকে। সেখানে LATERAL
                নেই, কারণ সেটা মূল Join নিয়ে। ওখানকার INNER, LEFT আর RIGHT JOIN এর উদাহরণগুলো এই মডিউলের সাথে মিলিয়ে
                দেখুন, তারপর এই লেসনটাকে তার পরের ধাপ ভাবুন।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM&t=8640s"
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
      subHeader: { index: "018", title: "Module 06 Recap" },
      title: <SectionTitle>লেসনের শেষ, মডিউলের শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাসরিনের ফোনের তালিকা এখন তৈরি, প্রতিটা Customer এর শেষ দুটো Booking, আর Imran ও বাদ যাননি। এই লেসনের মূল
                কথাগুলো:
              </ContentParagraph>
              <ContentList>
                <ListItem>FROM এর ভেতরের Subquery একটা অস্থায়ী Table, যা আগে একবার চলে আর বাইরের কিছু দেখে না।</ListItem>
                <ListItem>LATERAL সেই Subquery কে বাঁ দিকের Table এর Column দেখতে দেয়, আর প্রতিটা বাইরের Row এর জন্য একবার চালায়।</ListItem>
                <ListItem>CROSS JOIN LATERAL এ খালি ফল মানে বাদ, LEFT JOIN LATERAL ... ON true এ খালি হলেও থাকে।</ListItem>
                <ListItem>প্রতিটা দলের প্রথম N টা: ভেতরে ORDER BY আর LIMIT N, সাথে একটা সমতা ভাঙার Column।</ListItem>
                <ListItem>ভেতরে Join, যোগফল, সবই চলে। GROUP BY ছাড়া যোগফল সবসময় একটা Row দেয়।</ListItem>
                <ListItem>generate_series এর মতো Function একটা Row থেকে অনেক Row বানায়, আর তার আগে LATERAL ঐচ্ছিক।</ListItem>
                <ListItem>MySQL এ LATERAL আছে 8.0.14 থেকে, generate_series নেই, Subquery র নাম বাধ্যতামূলক।</ListItem>
              </ContentList>
              <ContentParagraph>
                এর সাথেই Module 06 শেষ। নয়টা লেসনে আপনি শিখলেন কেন Island Tours এর Data আটটা Table এ ভাগ করা, আর কীভাবে
                প্রশ্ন অনুযায়ী সেগুলো আবার জোড়া লাগাতে হয়। নিচের ছবি আর Table এ পুরো মডিউল এক নজরে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ModuleSixStoryDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "মূল প্রশ্ন", "হাতিয়ার"],
          rows: [
            [
              <Link key="l1" href="/sql/topic/why-split-tables" className={LINK}>
                01 Why Data Is Split
              </Link>,
              "এক Table এ সব রাখলে কী ভাঙে",
              "Key, Alias, ON আর USING",
            ],
            [
              <Link key="l2" href="/sql/topic/inner-join" className={LINK}>
                02 INNER JOIN
              </Link>,
              "শুধু যেগুলো মেলে",
              "INNER JOIN ... ON, তারপর GROUP BY",
            ],
            [
              <Link key="l3" href="/sql/topic/left-right-join" className={LINK}>
                03 LEFT and RIGHT JOIN
              </Link>,
              "একদিকের কেউ বাদ যাবে না",
              "LEFT JOIN, IS NULL দিয়ে যা নেই তা খোঁজা",
            ],
            [
              <Link key="l4" href="/sql/topic/full-outer-join" className={LINK}>
                04 FULL OUTER JOIN
              </Link>,
              "দুই দিকের সবাই",
              "FULL OUTER JOIN, COALESCE",
            ],
            [
              <Link key="l5" href="/sql/topic/cross-join" className={LINK}>
                05 CROSS JOIN
              </Link>,
              "প্রতিটার সাথে প্রতিটা",
              "CROSS JOIN, generate_series দিয়ে Report এর ছক",
            ],
            [
              <Link key="l6" href="/sql/topic/self-join" className={LINK}>
                06 Self Joins
              </Link>,
              "একই Table এর দুটো Row মেলানো",
              "দুটো Alias, a.id < b.id",
            ],
            [
              <Link key="l7" href="/sql/topic/multi-table-joins" className={LINK}>
                07 Many Tables
              </Link>,
              "চার পাঁচটা Table একসাথে",
              "Join এর শিকল, ON বনাম WHERE",
            ],
            [
              <Link key="l8" href="/sql/topic/semi-anti-join" className={LINK}>
                08 Semi and Anti Joins
              </Link>,
              "আছে কি, নেই কি",
              "EXISTS, NOT EXISTS",
            ],
            [
              <Link key="l9" href="/sql/topic/lateral-join" className={LINK}>
                09 LATERAL Joins
              </Link>,
              "প্রতিটা Row এর জন্য আলাদা খোঁজ",
              "CROSS আর LEFT JOIN LATERAL",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে। নিচের Report টা মালিকের জন্য, প্রতিটা চালু ট্যুরের পুরো ছবি। ট্যুরের পাশে তার Destination
              (INNER JOIN, প্রতিটা ট্যুরের একটা Destination থাকেই), তার Guide (LEFT JOIN, কারণ Ratargul এর Guide নেই),
              তার পরের তারিখ (LEFT JOIN LATERAL, কারণ Family Package এর তারিখ নেই), আর একটা যোগফলের LATERAL যেটা গোনে
              নিশ্চিত Booking, তার টাকা, আর তার মধ্যে কতগুলোর এখনো Review নেই (NOT EXISTS, Lesson 08 এর Anti Join)। মোট
              ছয়টা Table: tours, destinations, guides, departures, bookings আর reviews। চালান, তারপর প্রতিটা Column কোন
              লেসনের, নিজে মিলিয়ে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 06 এর সব হাতিয়ার, একটা Report এ"
              query={`SELECT t.title,
       d.name                                AS destination,
       coalesce(g.full_name, 'No guide yet') AS guide,
       nxt.starts_on                         AS next_departure,
       sales.confirmed,
       coalesce(sales.revenue_bdt, 0)        AS revenue_bdt,
       sales.no_review
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id
LEFT JOIN guides g  ON g.guide_id = t.guide_id
LEFT JOIN LATERAL (
  SELECT dep.starts_on
  FROM departures dep
  WHERE dep.tour_id = t.tour_id
    AND dep.starts_on >= DATE '2026-11-01'
  ORDER BY dep.starts_on
  LIMIT 1
) AS nxt ON true
CROSS JOIN LATERAL (
  SELECT count(*)         AS confirmed,
         sum(b.total_bdt) AS revenue_bdt,
         count(*) FILTER (
           WHERE NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.booking_id)
         )                AS no_review
  FROM departures dep
  JOIN bookings b ON b.departure_id = dep.departure_id
  WHERE dep.tour_id = t.tour_id
    AND b.status = 'confirmed'
) AS sales
WHERE t.is_active
ORDER BY revenue_bdt DESC, t.title;`}
              caption="আটটা চালু ট্যুর, বন্ধ Luxury Stay বাদ। সবার উপরে Saint Martin Island Escape: Guide Jamal Hossain, পরের তারিখ 2026-11-20, 5টা নিশ্চিত Booking, 125000.00 টাকা, আর তার 2টার এখনো Review নেই। Ratargul Swamp Boat Day এর Guide এর ঘরে No guide yet। আর সবার নিচে Cox's Bazar Family Package: তারিখ NULL, 0, 0, 0, তবু আছে, কারণ যোগফলের LATERAL কখনো খালি ফেরে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                <strong>নিজেকে যাচাই করুন।</strong> এই সাতটা প্রশ্নের উত্তর কাউকে মুখে বোঝাতে পারলে Module 06 আপনার হয়ে
                গেছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>Island Tours এর Booking, Customer আর Tour কে এক Table এ না রেখে আলাদা রাখা হয় কেন?</ListItem>
                <ListItem>INNER JOIN এ Imran Kabir আর Kuakata কেন হারিয়ে যায়, আর LEFT JOIN কীভাবে তাঁদের ফেরায়?</ListItem>
                <ListItem>LEFT JOIN এর পরে COUNT(*) আর COUNT(b.booking_id) Imran এর জন্য কেন আলাদা সংখ্যা দেয়?</ListItem>
                <ListItem>ON এর শর্ত আর WHERE এর শর্ত একটা LEFT JOIN এ কখন আলাদা ফল দেয়?</ListItem>
                <ListItem>কোন Customer কখনো বুক করেননি, তিনভাবে লিখুন, আর NOT IN কেন বিপজ্জনক তা বলুন।</ListItem>
                <ListItem>প্রতিটা Customer এর শেষ দুটো Booking এর জন্য DISTINCT ON কেন যথেষ্ট না?</ListItem>
                <ListItem>CROSS JOIN LATERAL আর LEFT JOIN LATERAL ... ON true এর পার্থক্য একটা উদাহরণ দিয়ে বলুন।</ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি প্রথমবার FROM এর ভেতরে একটা Query বসিয়েছেন, আর Lesson 08 এ EXISTS এর ভেতরে। Query এর
                ভেতরে Query, এটাই পরের মডিউলের পুরো বিষয়: SELECT এর ভেতরে একটা মান ফেরানো Subquery, IN আর ANY দিয়ে তুলনা,
                বড় Query কে WITH দিয়ে নাম দেওয়া ছোট ধাপে ভাঙা, নিজেকে ডাকা Recursive Query যেটা MySQL এ generate_series
                এর অভাবও মেটায়, আর UNION দিয়ে দুটো ফল যোগ করা। চলুন{" "}
                <Link href="/sql/topic/subqueries-ctes-overview" className={LINK}>
                  Module 07, Subqueries, CTEs আর Set Operations
                </Link>
                {" "}এ।
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
      ["Subquery in FROM", "Parenthesis এর ভেতরের SELECT, একটা অস্থায়ী Table", "FROM (SELECT ...) AS cheap"],
      ["দেয়াল", "সাধারণ Subquery বাইরের Table দেখে না", "invalid reference to FROM-clause entry"],
      ["LATERAL", "বাঁ দিকের Column দেখা, প্রতিটা বাইরের Row এর জন্য একবার চলা", "CROSS JOIN LATERAL (...) AS x"],
      ["CROSS JOIN LATERAL", "খালি ফল মানে সেই Row বাদ, INNER JOIN এর মতো", "Imran বাদ, 14 জন"],
      ["LEFT JOIN LATERAL", "খালি হলেও থাকে, ভেতরের ঘর NULL", "... AS x ON true"],
      ["ON true", "ব্যাকরণের দাবি, আসল শর্ত ভেতরের WHERE এ", "LEFT JOIN LATERAL (...) AS x ON true"],
      ["Top N per Group", "ভেতরে ORDER BY আর LIMIT N", "ORDER BY booked_at DESC LIMIT 2"],
      ["সমতা ভাঙা", "ORDER BY এর শেষে এমন Column যা সমান হয় না", "ORDER BY rating DESC, created_at"],
      ["WITH TIES", "সমানগুলো সবই রাখা", "FETCH FIRST 1 ROWS WITH TIES"],
      ["ভেতরে যোগফল", "GROUP BY ছাড়া সবসময় একটা Row", "count(*) = 0, sum = NULL"],
      ["generate_series", "একটা Row থেকে অনেক Row, LATERAL ঐচ্ছিক", "generate_series(1, b.seats) AS s(seat_no)"],
      ["বিকল্প", "এক Row হলে DISTINCT ON, ক্রম হলে Window Function", "Module 03, Module 08"],
      ["MySQL", "8.0.14 থেকে LATERAL, নাম বাধ্যতামূলক, generate_series নেই", "ERROR 1248, ERROR 1064"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "FROM customers c CROSS JOIN (SELECT ... WHERE b.customer_id = c.customer_id ...) AS x লিখলেন, LATERAL ছাড়া। PostgreSQL কী করবে?",
        options: [
          {
            key: "A",
            text: "প্রতিটা Customer এর জন্য ভেতরের Query চালাবে",
            isCorrect: false,
            explanation: "এই প্রতিটার জন্য চালানোটাই LATERAL এর কাজ। শব্দটা ছাড়া Subquery একবার, একা চলে, তাই c চেনে না।",
          },
          {
            key: "B",
            text: "Error: invalid reference to FROM-clause entry for table c, আর HINT বলবে LATERAL লিখতে",
            isCorrect: true,
            explanation: "ঠিক। DETAIL বলে c আছে কিন্তু এই অংশ থেকে ছোঁয়া যায় না, আর HINT সরাসরি LATERAL এর কথা বলে।",
          },
          {
            key: "C",
            text: "c.customer_id কে NULL ধরে চালাবে, তাই শূন্য Row",
            isCorrect: false,
            explanation: "PostgreSQL অজানা নামকে চুপচাপ NULL ধরে না। Query চলার আগেই নাম যাচাই হয়, আর এখানে সেখানেই থামে।",
          },
          {
            key: "D",
            text: "সব Customer এর সব Booking জোড়া দেবে, মানে CROSS JOIN",
            isCorrect: false,
            explanation: "শর্তে c.customer_id থাকায় Query টা বোঝাই যায় না, তাই কোনো জোড়াই হয় না। Error আগে আসে।",
          },
        ],
      },
      {
        id: 2,
        text: "CROSS JOIN LATERAL দিয়ে প্রতিটা Customer এর শেষ দুটো Booking বের করলেন। Imran Kabir, যাঁর কোনো Booking নেই, ফলাফলে কেমন দেখাবেন?",
        options: [
          {
            key: "A",
            text: "একটা Row, booking_id এর ঘরে NULL",
            isCorrect: false,
            explanation: "এটা LEFT JOIN LATERAL এর আচরণ। CROSS এ জোড়ার কিছু না থাকলে Row টাই আসে না।",
          },
          {
            key: "B",
            text: "দুটো Row, দুটোতেই NULL",
            isCorrect: false,
            explanation: "LIMIT 2 সর্বোচ্চ সীমা, কখনো Row বানায় না। ভেতরের Query শূন্য Row দিলে শূন্যই।",
          },
          {
            key: "C",
            text: "তিনি ফলাফলে থাকবেন না",
            isCorrect: true,
            explanation: "ঠিক। ভেতরের Query খালি, আর CROSS JOIN LATERAL INNER JOIN এর মতো, তাই তিনি বাদ। 15 জনের জায়গায় 14 জন।",
          },
          {
            key: "D",
            text: "Error, কারণ একজন Customer এর জন্য ভেতরের Query কিছু পায়নি",
            isCorrect: false,
            explanation: "খালি ফল কোনো ভুল না, স্বাভাবিক ঘটনা। কোনো Error আসে না, আর সেজন্যই বাদ পড়াটা চোখে পড়ে না।",
          },
        ],
      },
      {
        id: 3,
        text: "LEFT JOIN LATERAL (...) AS x ON true তে ON true কেন লেখা হয়?",
        options: [
          {
            key: "A",
            text: "LEFT JOIN এর ব্যাকরণে ON লাগে, আর মেলানোর আসল শর্ত ভেতরের WHERE এ আগেই আছে",
            isCorrect: true,
            explanation: "ঠিক। ON বাদ দিলে syntax error at end of input। true মানে বাইরে বাড়তি কোনো শর্ত নেই।",
          },
          {
            key: "B",
            text: "true দিলে ভেতরের Query একবারই চলে, তাই দ্রুত হয়",
            isCorrect: false,
            explanation: "ON true চলার সংখ্যা বদলায় না। LATERAL প্রতিটা বাইরের Row এর জন্য চলেই।",
          },
          {
            key: "C",
            text: "true দিলে শুধু যেগুলো মেলে সেগুলো আসে",
            isCorrect: false,
            explanation: "উল্টো। ON true কিছুই ছাঁকে না। LEFT JOIN বাঁ দিকের সবাইকে রাখে, মিলুক বা না মিলুক।",
          },
          {
            key: "D",
            text: "এটা MySQL এর জন্য, PostgreSQL এ লাগে না",
            isCorrect: false,
            explanation: "দুটোতেই লাগে। PostgreSQL এ বাদ দিলে syntax error, MySQL এ ERROR 1064।",
          },
        ],
      },
      {
        id: 4,
        text: "LATERAL এর ভেতরে LIMIT 2 লিখলেন কিন্তু ORDER BY লিখলেন না। Rahim Uddin এর জন্য কী আসবে?",
        options: [
          {
            key: "A",
            text: "সবসময় তাঁর সবচেয়ে নতুন দুটো, 17 আর 8",
            isCorrect: false,
            explanation: "ORDER BY ছাড়া নতুন বা পুরনোর কোনো কথা নেই। এই লেসনের বক্সে আসলে আসে 1 আর 8।",
          },
          {
            key: "B",
            text: "যেকোনো দুটো, কোনটা আসবে তার কোনো নিশ্চয়তা নেই",
            isCorrect: true,
            explanation: "ঠিক। এই Data তে বক্সটা দেয় 1 আর 8, পুরনো দুটো। ভিন্ন Data বা Plan এ অন্য দুটো আসতে পারে।",
          },
          {
            key: "C",
            text: "Error, কারণ LIMIT এর আগে ORDER BY বাধ্যতামূলক",
            isCorrect: false,
            explanation: "PostgreSQL কোনো Error দেয় না। ভুলটা ব্যাকরণের না, প্রশ্নের, আর সেজন্যই বিপজ্জনক।",
          },
          {
            key: "D",
            text: "তাঁর তিনটা Booking ই, কারণ LIMIT ভেতরে কাজ করে না",
            isCorrect: false,
            explanation: "LIMIT ভেতরেই কাজ করে, প্রতিটা Customer এর জন্য আলাদা। তাই দুটোই আসে, শুধু কোন দুটো তা ঠিক নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "CROSS JOIN LATERAL (SELECT b.customer_id, count(*) FROM bookings b WHERE b.customer_id = c.customer_id GROUP BY b.customer_id) লিখলেন। Imran এর কী হবে?",
        options: [
          {
            key: "A",
            text: "একটা Row, count 0",
            isCorrect: false,
            explanation: "GROUP BY না থাকলে এটাই হতো। GROUP BY থাকলে কিছু না মিললে কোনো দলই তৈরি হয় না।",
          },
          {
            key: "B",
            text: "তিনি ফলাফল থেকে বাদ যাবেন",
            isCorrect: true,
            explanation: "ঠিক। ভেতরে শূন্য দল মানে শূন্য Row, আর CROSS সেই Row বাদ দেয়। GROUP BY মুছলে count 0 সহ তিনি ফেরেন।",
          },
          {
            key: "C",
            text: "একটা Row, count NULL",
            isCorrect: false,
            explanation: "count কখনো NULL দেয় না, কিছু না পেলে 0। আর এখানে তো কোনো Row ই আসে না।",
          },
          {
            key: "D",
            text: "Error, কারণ LATERAL এর ভেতরে GROUP BY নিষেধ",
            isCorrect: false,
            explanation: "ভেতরে GROUP BY পুরোপুরি বৈধ। সমস্যাটা শুধু খালি দলের, Error এর না।",
          },
        ],
      },
      {
        id: 6,
        text: "FROM bookings b, generate_series(1, b.seats) AS s(seat_no) লিখলেন, LATERAL শব্দ ছাড়া। PostgreSQL এ কী হবে?",
        options: [
          {
            key: "A",
            text: "চলবে, কারণ Function এর বেলায় LATERAL ঐচ্ছিক",
            isCorrect: true,
            explanation: "ঠিক। Docs বলে Function এর আগে LATERAL একটা শোভার শব্দ, Function এর Argument সবসময় আগের Table দেখতে পারে।",
          },
          {
            key: "B",
            text: "Section 003 এর মতো একই Error দেবে",
            isCorrect: false,
            explanation: "সেই Error Subquery র জন্য। Function এর বেলায় PostgreSQL নিজেই বাঁ দিকটা দেখতে দেয়।",
          },
          {
            key: "C",
            text: "প্রতিটা Booking এর জন্য শুধু একটা Row দেবে",
            isCorrect: false,
            explanation: "generate_series(1, 4) চারটা Row দেয়। এই Data তে বাতিল ছাড়া মোট টিকিট 48, ঠিক ধরা সিটের সমান।",
          },
          {
            key: "D",
            text: "MySQL এর মতো ERROR 1064",
            isCorrect: false,
            explanation: "ERROR 1064 MySQL এর, যেখানে generate_series নেই। PostgreSQL এ Function টা আছে আর চলে।",
          },
        ],
      },
      {
        id: 7,
        text: "Saint Martin Island Escape এর দুটো Review পাঁচ তারকা। প্রতিটা ট্যুরের ঠিক একটা সেরা Review, প্রতিবার একই উত্তর চাই। কোনটা লিখবেন?",
        options: [
          {
            key: "A",
            text: "ORDER BY r.rating DESC LIMIT 1",
            isCorrect: false,
            explanation: "দুটো পাঁচের যেকোনোটা আসতে পারে। আজ একটা, কাল অন্যটা, Report এ সংখ্যা বদলে যাবে।",
          },
          {
            key: "B",
            text: "ORDER BY r.rating DESC, r.created_at LIMIT 1",
            isCorrect: true,
            explanation: "ঠিক। সমান রেটিংয়ে আগে লেখাটা আগে, তাই সবসময় Review 1। দুটোই চাইলে WITH TIES।",
          },
          {
            key: "C",
            text: "ORDER BY r.rating DESC FETCH FIRST 1 ROWS WITH TIES",
            isCorrect: false,
            explanation: "এটা স্থির উত্তর দেয় ঠিকই, কিন্তু দুটো Review দেয়, একটা না। প্রশ্ন চেয়েছিল ঠিক একটা।",
          },
          {
            key: "D",
            text: "ORDER BY r.created_at LIMIT 1",
            isCorrect: false,
            explanation: "এটা সবচেয়ে পুরনো Review দেয়, সেরাটা না। রেটিংটাই হারিয়ে গেল।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ নিচের কোনটা চলে?",
        options: [
          {
            key: "A",
            text: "CROSS JOIN LATERAL (...) AS x, ভেতরে ORDER BY আর LIMIT সহ",
            isCorrect: true,
            explanation: "ঠিক। MySQL এ LATERAL আছে 8.0.14 থেকে, আর এই লেসনের মূল Query গুলো 8.4 এ একই ফল দিয়েছে।",
          },
          {
            key: "B",
            text: "CROSS JOIN LATERAL generate_series(1, b.seats)",
            isCorrect: false,
            explanation: "MySQL এ generate_series নেই, ERROR 1064। সংখ্যার সারি বানাতে Recursive CTE, Module 07 এ।",
          },
          {
            key: "C",
            text: "CROSS JOIN LATERAL (...) নাম ছাড়া",
            isCorrect: false,
            explanation: "MySQL এ Derived Table এর নাম বাধ্যতামূলক: ERROR 1248, Every derived table must have its own alias।",
          },
          {
            key: "D",
            text: "LEFT JOIN LATERAL (...) AS x, ON ছাড়া",
            isCorrect: false,
            explanation: "LEFT JOIN এ ON লাগবেই, MySQL এ ERROR 1064। লিখতে হয় ON TRUE।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Customer Care আর ট্যুরের পাতার তিনটা Sheet",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নাসরিনের ফোনের তালিকা:</strong> পনেরোজন Customer এর প্রত্যেকের জন্য তাঁর সবচেয়ে নতুন দুটো Booking, প্রতিটার
        পাশে ট্যুরের নাম, Departure এর তারিখ আর status। যাঁর Booking নেই তিনিও থাকবেন। psql এ চালিয়ে ফল কপি করুন, আর
        গুনে লিখুন কতটা Row এল, আর কেন সংখ্যাটা ঠিক সেটাই।
      </span>,
      <span key="2">
        <strong>ট্যুরের পাতার তারিখ:</strong> প্রতিটা চালু ট্যুরের জন্য 1 November 2026 বা তার পরের সর্বোচ্চ দুটো Departure,
        যেখানে seats_left শূন্যের বেশি। যে ট্যুরের এমন তারিখ নেই সেটাও একটা Row এ আসবে। তারপর দুই লাইনে লিখুন Cox&apos;s
        Bazar Family Package কেন আসে কিন্তু তারিখ নেই।
      </span>,
      <span key="3">
        <strong>Guide দের সামনের কাজ:</strong> পাঁচজন Guide এর প্রত্যেকের জন্য 1 November 2026 বা তার পরে কতগুলো Departure
        আর তার মধ্যে সবচেয়ে কাছেরটা কবে। একটা যোগফলের LATERAL আর একটা পরের তারিখের LATERAL দিয়ে লিখুন। যে Guide এর কোনো
        ট্যুরই নেই, তিনি 0 সহ থাকবেন। কোন Guide সেটা, নাম লিখুন।
      </span>,
      <span key="4">
        <strong>তিন পথে একই উত্তর:</strong> Exercise 1 এর প্রশ্ন, প্রতিটা Customer এর সবচেয়ে নতুন একটা Booking, DISTINCT ON,
        LATERAL আর row_number দিয়ে তিনভাবে লিখুন। তিনটার ফল মিলিয়ে দেখান। তারপর প্রশ্নটা একটা থেকে দুটো Booking করলে কোন
        পথে কতটুকু বদলাতে হয়, পাঁচ লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>কাউকে শেখান:</strong> একজন বন্ধুকে এক পাতায় বোঝান LATERAL কী, Rahim, Nusrat, Sabbir আর Imran এই চারজন
        দিয়ে। কাগজে চারটা লাইন আঁকুন, প্রতিটার পাশে ভেতরের Query র ফল, আর দেখান CROSS আর LEFT এ Imran এর কী হয়। বন্ধুকে
        তিনটা প্রশ্ন করুন, আর তাঁর উত্তর লিখে রাখুন।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা Sheet এর Query আর psql থেকে কপি করা ফল, প্রতিটার Row সংখ্যাসহ</span>,
      <span key="d2">Family Package আর ট্যুরহীন Guide নিয়ে ছোট ব্যাখ্যা</span>,
      <span key="d3">তিন পথের Query, ফলের তুলনা আর পাঁচ লাইনের বিশ্লেষণ</span>,
      <span key="d4">বন্ধুকে বোঝানোর পাতাটার একটা ছবি আর তাঁর তিনটা উত্তর</span>,
    ],
  },
  practicalLab: {
    title: "LATERAL এর Drill",
    subtitle: "নিজের island_tours এ psql দিয়ে, প্রতিটার প্রত্যাশিত ফলসহ",
    stepName: "DRILL",
    steps: [
      {
        title: "psql খুলে island_tours এ ঢুকুন",
        description:
          "psql -d island_tours, অথবা Docker এ docker exec -it island-pg psql -U postgres -d island_tours। Module 02 এ Load করা Database টাই লাগবে। তারিখ আর সময় একই রকম দেখতে প্রথমে SET TimeZone = 'Asia/Dhaka' চালান।",
      },
      {
        title: "দেয়াল আর জানালা",
        description:
          "প্রথম ফাইল চালান। প্রথম Query টা ইচ্ছা করে ভুল: Error এর DETAIL আর HINT পড়ুন, তারপর দ্বিতীয় Query তে LATERAL সহ ঠিকটা দেখুন, 23টা Row।",
      },
      {
        title: "CROSS বনাম LEFT",
        description:
          "দ্বিতীয় ফাইল চালান। দুটো গোনা পাশাপাশি রাখুন: 14 আর 23, তারপর 15 আর 24। পার্থক্যের মানুষটা কে, তৃতীয় Query বলে দেবে।",
      },
      {
        title: "পরের তারিখ আর সস্তা ট্যুর",
        description:
          "তৃতীয় ফাইল চালান। দুটো Query তেই একটা করে NULL এর Row আছে, Family Package আর Kuakata। LEFT কে CROSS বানিয়ে আবার চালান আর Row গুনুন।",
      },
      {
        title: "সমতা আর টিকিট",
        description:
          "চতুর্থ আর পঞ্চম ফাইল চালান। Saint Martin এর দুটো পাঁচ তারকা Review কোন Query তে একটা আর কোনটায় দুটো আসে, মিলিয়ে নিন। টিকিট আর সিট দুটোই 48 কিনা দেখুন।",
      },
      {
        title: "মডিউলের Report",
        description:
          "ষষ্ঠ ফাইল চালান। প্রতিটা Column কোন লেসনের, পাশে লিখে রাখুন। Family Package কেন শেষে আর তবু কেন আছে, এক লাইনে ব্যাখ্যা করুন।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-wall-and-window.sql",
        code: `SELECT c.full_name, x.booking_id
FROM customers c
CROSS JOIN (
  SELECT b.booking_id
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x;                                     -- ERROR on purpose: invalid reference to FROM-clause entry for table "c"

SELECT c.customer_id, c.full_name, x.booking_id
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id, b.booked_at
  FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC
  LIMIT 2
) AS x
ORDER BY c.customer_id, x.booked_at DESC;   -- 23 rows, first two: 1 | 17, then 1 | 8`,
      },
      {
        language: "sql",
        filename: "02-cross-vs-left.sql",
        code: `SELECT count(DISTINCT c.customer_id) AS customers, count(*) AS rows
FROM customers c
CROSS JOIN LATERAL (
  SELECT b.booking_id FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC LIMIT 2
) AS x;                                     -- 1 row: 14 | 23

SELECT count(DISTINCT c.customer_id) AS customers, count(*) AS rows
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC LIMIT 2
) AS x ON true;                             -- 1 row: 15 | 24

SELECT c.customer_id, c.full_name
FROM customers c
LEFT JOIN LATERAL (
  SELECT b.booking_id FROM bookings b
  WHERE b.customer_id = c.customer_id
  ORDER BY b.booked_at DESC LIMIT 2
) AS x ON true
WHERE x.booking_id IS NULL;                 -- 1 row: 15 | Imran Kabir`,
      },
      {
        language: "sql",
        filename: "03-next-and-cheapest.sql",
        code: `SELECT t.tour_id, t.title, nxt.starts_on
FROM tours t
LEFT JOIN LATERAL (
  SELECT d.starts_on FROM departures d
  WHERE d.tour_id = t.tour_id
    AND d.starts_on >= DATE '2026-11-01'
  ORDER BY d.starts_on LIMIT 1
) AS nxt ON true
ORDER BY t.tour_id;                         -- 9 rows, tour 9 (Family Package) has NULL

SELECT d.name, ch.title, ch.price_bdt
FROM destinations d
LEFT JOIN LATERAL (
  SELECT t.title, t.price_bdt FROM tours t
  WHERE t.destination_id = d.destination_id
  ORDER BY t.price_bdt LIMIT 1
) AS ch ON true
ORDER BY d.destination_id;                  -- 7 rows, Sylhet: Ratargul 3500.00, Kuakata: NULL`,
      },
      {
        language: "sql",
        filename: "04-ties.sql",
        code: `SELECT top.review_id, top.rating
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC, r.created_at
  LIMIT 1
) AS top
WHERE t.tour_id = 1;                        -- 1 row: 1 | 5

SELECT top.review_id, top.rating
FROM tours t
CROSS JOIN LATERAL (
  SELECT r.review_id, r.rating
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  JOIN reviews r  ON r.booking_id = b.booking_id
  WHERE d.tour_id = t.tour_id
  ORDER BY r.rating DESC
  FETCH FIRST 1 ROWS WITH TIES
) AS top
WHERE t.tour_id = 1;                        -- 2 rows: reviews 1 and 3, both 5`,
      },
      {
        language: "sql",
        filename: "05-aggregates-and-tickets.sql",
        code: `SELECT t.tour_id, s.confirmed, s.revenue
FROM tours t
CROSS JOIN LATERAL (
  SELECT count(*) AS confirmed, sum(b.total_bdt) AS revenue
  FROM departures d
  JOIN bookings b ON b.departure_id = d.departure_id
  WHERE d.tour_id = t.tour_id AND b.status = 'confirmed'
) AS s
ORDER BY t.tour_id;                         -- 9 rows, tour 1: 5 | 125000.00, tours 8 and 9: 0 | NULL

SELECT count(*) AS tickets
FROM bookings b
CROSS JOIN LATERAL generate_series(1, b.seats) AS s(seat_no)
WHERE b.status <> 'cancelled';              -- 1 row: 48

SELECT sum(seats) AS seats_held
FROM bookings
WHERE status <> 'cancelled';                -- 1 row: 48`,
      },
      {
        language: "sql",
        filename: "06-module-report.sql",
        code: `SELECT t.title,
       d.name                                AS destination,
       coalesce(g.full_name, 'No guide yet') AS guide,
       nxt.starts_on                         AS next_departure,
       sales.confirmed,
       coalesce(sales.revenue_bdt, 0)        AS revenue_bdt,
       sales.no_review
FROM tours t
JOIN destinations d ON d.destination_id = t.destination_id
LEFT JOIN guides g  ON g.guide_id = t.guide_id
LEFT JOIN LATERAL (
  SELECT dep.starts_on FROM departures dep
  WHERE dep.tour_id = t.tour_id
    AND dep.starts_on >= DATE '2026-11-01'
  ORDER BY dep.starts_on LIMIT 1
) AS nxt ON true
CROSS JOIN LATERAL (
  SELECT count(*)         AS confirmed,
         sum(b.total_bdt) AS revenue_bdt,
         count(*) FILTER (
           WHERE NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.booking_id)
         )                AS no_review
  FROM departures dep
  JOIN bookings b ON b.departure_id = dep.departure_id
  WHERE dep.tour_id = t.tour_id
    AND b.status = 'confirmed'
) AS sales
WHERE t.is_active
ORDER BY revenue_bdt DESC, t.title;          -- 8 rows, Saint Martin Island Escape first, Family Package last`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা ফাইল চালানোর আগে আন্দাজ করুন কয়টা Row আসবে, আর কে বাদ যাবে। তারপর মিলিয়ে দেখুন। LATERAL এ আন্দাজ আর ফল
        মিলে গেলে বুঝবেন প্রতিটা Row এর জন্য ভেতরের Query টা আপনি মাথায় চালাতে পারছেন, আর খালি ফলের Row এর ভাগ্য আগেই
        জানেন।
      </ContentParagraph>
    ),
  },
};
