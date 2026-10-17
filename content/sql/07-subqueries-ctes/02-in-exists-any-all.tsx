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
  NullHalvesLab,
  QuantifierLab,
} from "../../../components/course/topics/subqueries/anyall-animations";
import {
  AnyAllNumberLine,
  EmptyListSplit,
  ListMachineDiagram,
  NotInUnrollDiagram,
} from "../../../components/course/topics/subqueries/anyall-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const inExistsAnyAllContent: TopicData = {
  id: "in-exists-any-all",
  introduction: {
    badge: "MODULE 07 · LESSON 02",
    title: <SectionTitle>তালিকা ধরে প্রশ্ন: IN, NOT IN, ANY আর ALL</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি এমন Subquery লিখেছেন, যেটা ঠিক একটা মান ফেরত দেয়: সব ট্যুরের গড় দাম, সবচেয়ে দামি
          ট্যুরের দাম। কিন্তু বাস্তবের বেশির ভাগ প্রশ্নে ভেতরের Query একটা মান দেয় না, দেয় একটা তালিকা:
          যাঁরা confirmed করেছেন তাঁদের সবার customer_id, Sylhet এর সব ট্যুরের দাম, ট্যুর আছে এমন সব Guide এর
          নম্বর। এই লেসন সেই তালিকা নিয়ে কাজ করার চারটা শব্দ নিয়ে: IN, NOT IN, ANY আর ALL।
        </ContentParagraph>
        <ContentParagraph>
          চারটা শব্দই দেখতে সহজ, আর ঠিক এই সহজ চেহারার কারণেই এখানে SQL এর সবচেয়ে বিখ্যাত চুপচাপ ভুলটা
          লুকিয়ে থাকে। তালিকায় একটা NULL ঢুকে পড়লে NOT IN কোনো Error ছাড়াই খালি উত্তর দেয়, আর যে মানুষটার
          সত্যিই কোনো ট্যুর নেই, তিনিও তালিকা থেকে হারিয়ে যান। আবার তালিকা পুরো খালি হলে ALL বলে দেয় সব ট্যুরই
          &ldquo;সবার চেয়ে দামি&rdquo;। এই লেসনে আপনি দুটো ফাঁদই নিজের চোখে দেখবেন, Island Tours এর আসল Data তে।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি জানবেন IN এর ভেতরে Subquery কীভাবে একটা তালিকা বানায় আর JOIN এর সাথে তার পার্থক্য কোথায়, NOT IN
          কেন একটা NULL পেলেই কখনো TRUE দিতে পারে না, ফাঁদটা কোন তিন উপায়ে এড়ানো যায়, EXISTS আর IN এর মধ্যে
          কোনটা কখন লিখবেন, ANY আর ALL দিয়ে &ldquo;অন্তত একটার চেয়ে&rdquo; আর &ldquo;সবগুলোর চেয়ে&rdquo; প্রশ্ন কীভাবে
          লেখা হয়, খালি তালিকায় কী ঘটে, আর PostgreSQL এর Array দিয়ে App থেকে একটা Parameter এ পুরো তালিকা কীভাবে
          পাঠানো যায়। আর প্রতিটা জায়গায় MySQL কী করে, সেটাও।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "তালিকায় একটা NULL দিয়ে দিন, তারপর আমি আর কাউকে নিশ্চিত করে বলতে পারব না যে সে তালিকায় নেই। কারণ ওই NULL টা হয়তো সে-ই।",
      author: "NOT IN",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রবিবারের তিনটা তালিকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। শীতের মৌসুমের প্রথম সপ্তাহ। সকালের বৈঠকে Island Tours এর
                Manager ফারুক সাহেব Developer তানিমকে তিনটা তালিকা চাইলেন। প্রথমটা সহজ: যাঁরা অন্তত একটা Booking
                confirmed করেছেন, তাঁদের নাম আর শহর, ধন্যবাদের SMS যাবে। দ্বিতীয়টা পরিকল্পনার: এই মৌসুমে কোন
                Guide খালি, মানে কার হাতে একটাও ট্যুর নেই, তাঁকে নতুন ট্যুর দেওয়া হবে। তৃতীয়টা Marketing এর জন্য:
                একটা Premium Brochure ছাপা হবে, তাতে থাকবে শুধু সেই ট্যুরগুলো যেগুলো Sylhet এর সব ট্যুরের চেয়ে দামি।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা প্রশ্নেরই গড়ন একই। প্রথমে একটা তালিকা বানাতে হয়: confirmed Booking এর customer_id গুলো,
                ট্যুরে থাকা guide_id গুলো, Sylhet এর ট্যুরের দামগুলো। তারপর অন্য একটা Table এর প্রতিটা Row কে সেই
                তালিকার সাথে মেলাতে হয়: এই Customer কি তালিকায় আছেন, এই Guide কি তালিকায় নেই, এই ট্যুরের দাম কি
                তালিকার প্রতিটার চেয়ে বেশি।
              </ContentParagraph>
              <ContentParagraph>
                তানিম দ্বিতীয় প্রশ্নটা লিখলেন একটা পরিচিত চেহারায়, যেটা তিনি একটা ভিডিওতে দেখেছিলেন: guides থেকে
                সেই Guide গুলো, যাঁদের guide_id ট্যুরের তালিকায় নেই। Query চলল, কোনো Error এল না, আর উত্তর এল
                শূন্য Row। তানিম রিপোর্ট দিলেন, &ldquo;সব Guide এর হাতেই ট্যুর আছে।&rdquo; ফারুক সাহেব ভুরু কোঁচকালেন।
                &ldquo;Nazmul সাহেব তো সেপ্টেম্বর 2024 এ যোগ দিয়েছেন, এখনো একটাও ট্যুরে যাননি।&rdquo; নিচের বক্সে ঠিক
                সেই Query টা চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের খালি তালিকা"
              query={`SELECT full_name
FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours);

SELECT count(*) AS nazmul_tours
FROM tours
WHERE guide_id = 5;`}
              caption="প্রথম Query শূন্য Row দেয়, কোনো Error ছাড়া। দ্বিতীয় Query বলে Nazmul Karim (guide 5) এর ট্যুর আসলেই ০টা। অর্থাৎ উত্তরটা ভুল, আর ডাটাবেস সেটা জানায়ওনি। কেন এমন হলো, সেটা এই লেসনের মাঝখানের অংশ। আপাতত শুধু মনে রাখুন: Query চলেছে মানেই উত্তর ঠিক, এমন না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "চুপচাপ ভুল সবচেয়ে দামি ভুল",
          content: (
            <ContentParagraph>
              Error দেখলে মানুষ থামে, খোঁজে, ঠিক করে। কিন্তু Query চলে গেলে আর উত্তর দেখতে বিশ্বাসযোগ্য হলে কেউ থামে না।
              তানিমের শূন্য Row দেখে কেউ সন্দেহ করেনি, কারণ &ldquo;সবার হাতে ট্যুর আছে&rdquo; কথাটা শুনতে খারাপ না। এই
              লেসনের অনেকটা জুড়ে আছে এমন উত্তর চিনতে শেখা, যেগুলো চলে, দেখতে ঠিক, কিন্তু ভুল।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "in-subquery",
      subHeader: { index: "002", title: "IN With a Subquery" },
      title: <SectionTitle>ভেতরের Query তালিকা বানায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN আপনি আগেই চেনেন।{" "}
                <Link href="/sql/topic/in-between-like" className={LINK}>
                  Module 03 এর IN, BETWEEN, LIKE লেসনে
                </Link>{" "}
                লিখেছিলেন <code className={CODE}>{"customer_id IN (1, 5, 15)"}</code>, যেটা আসলে{" "}
                <code className={CODE}>{"customer_id = 1 OR customer_id = 5 OR customer_id = 15"}</code> এর ছোট রূপ।
                তালিকাটা তখন আপনি নিজের হাতে লিখেছিলেন।
              </ContentParagraph>
              <ContentParagraph>
                হাতে লেখা তালিকার একটা বড় দুর্বলতা আছে: সেটা আজকের সত্য, কালকের না। আজ যাঁরা confirmed করেছেন, তাঁদের
                নম্বর আপনি দেখে দেখে লিখলেন। কাল নতুন একজন confirm করলেন, আপনার তালিকা জানল না। সমাধান হলো তালিকাটা
                হাতে না লিখে আরেকটা Query দিয়ে বানানো। বন্ধনীর ভেতরে সংখ্যার বদলে একটা পুরো SELECT বসে, আর সেই SELECT
                যতগুলো Row দেয়, সবগুলো মিলে তালিকা। বন্ধনীর ভেতরের এই SELECT কে বলে <strong>Subquery</strong>।
              </ContentParagraph>
              <ContentParagraph>
                একটা মুদি দোকানের কথা ভাবুন। মালিক কর্মচারীকে বললেন, যাঁদের বাকি আছে তাঁদের চিঠি পাঠাতে হবে।
                কর্মচারী প্রথমে বাকির খাতা খুলে নামগুলো একটা কাগজে টুকে নেন। তারপর ক্রেতার খাতা ধরে এক এক করে দেখেন, এই
                নাম কি কাগজে আছে। কাগজে টোকা অংশটা ভেতরের Query, আর এক এক করে মেলানোটা বাইরের Query। নিচের বক্সে তিন
                ধাপে দেখুন: আগে শুধু ভেতরের Query, তারপর তার ফলাফল হাতে লিখে, তারপর হাতে না লিখে সরাসরি Subquery
                দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন ধাপে IN আর Subquery"
              query={`-- ১. শুধু ভেতরের Query
SELECT customer_id
FROM bookings
WHERE status = 'confirmed'
ORDER BY customer_id;

-- ২. সেই নম্বরগুলো হাতে লিখে
SELECT full_name
FROM customers
WHERE customer_id IN (1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14)
ORDER BY customer_id;

-- ৩. হাতে না লিখে, Subquery দিয়ে
SELECT full_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed')
ORDER BY customer_id;`}
              caption="প্রথম Query ১৭টা Row দেয়, কারণ confirmed Booking ১৭টা, আর কয়েকজনের দুটো করে (1, 2, 3, 4, 8 দুইবার করে আসে)। দ্বিতীয় আর তৃতীয় Query দুটোই ১২ জন Customer দেয়, একই ক্রমে। তৃতীয়টা কাল নতুন Booking এলে নিজে থেকেই বদলাবে, দ্বিতীয়টা বদলাবে না। Sabbir Hossain, Kamal Hasan আর Imran Kabir নেই: প্রথম দুজনের confirmed Booking নেই, শেষজনের কোনো Booking ই নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ListMachineDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটার তিনটা কথা মনে রাখুন। এক, ভেতরের Query একবারই চলে, বাইরের প্রতিটা Row এর জন্য আলাদা করে না, কারণ এর
                ভেতরে বাইরের Table এর কোনো উল্লেখ নেই। এমন Subquery কে বলে <strong>Uncorrelated</strong>, মানে বাইরের সাথে
                সম্পর্কহীন। যে Subquery বাইরের Row এর দিকে তাকায়, তাকে বলে Correlated, সেটা{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  পরের লেসনের
                </Link>{" "}
                বিষয়। দুই, IN এর চোখে তালিকা একটা সেট: কোন নম্বর আছে সেটাই জরুরি, কতবার আছে সেটা না। তিন, তাই বাইরের প্রতিটা
                Row বড়জোর একবার আসে। Rahim Uddin এর তিনটা Booking এর দুটো confirmed, তবু তিনি একবারই আছেন।
              </ContentParagraph>
              <ContentParagraph>
                Subquery এর ভেতরে আপনি যা শিখেছেন সবই চলে: WHERE, JOIN, GROUP BY, এমনকি ORDER BY আর LIMIT। শুধু একটা
                নিয়ম: IN এর সাথে বসা Subquery ঠিক একটা Column ফেরত দেবে, কারণ তুলনা হচ্ছে একটা Column এর সাথে। দুটো Column
                দিলে PostgreSQL থেমে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Column এর নিয়ম, আর ভেতরে LIMIT"
              query={`-- সবশেষ তিনটা Booking যাঁরা করেছেন
SELECT full_name
FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM bookings
  ORDER BY booked_at DESC
  LIMIT 3
)
ORDER BY customer_id;

-- ভুল: Subquery দুটো Column দিচ্ছে
SELECT full_name
FROM customers
WHERE customer_id IN (SELECT customer_id, status FROM bookings);`}
              caption="প্রথম Query তিনজন দেয়: Tanvir Ahmed, Sumaiya Islam আর Shuvo Das, যাঁদের Booking 22, 23 আর 24 সবচেয়ে নতুন। দ্বিতীয়টা থামে ERROR: subquery has too many columns দিয়ে, SQLSTATE 42601। MySQL এখানে দুই জায়গাতেই আলাদা আচরণ করে, সেটা MySQL অংশে দেখবেন।"
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
                  যাঁদের অন্তত একটা <code className={CODE}>pending</code> Booking আছে, তাঁদের <code className={CODE}>full_name</code>{" "}
                  দেখান। IN আর একটা Subquery দিয়ে লিখুন, কোনো JOIN ছাড়া। ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  ভেতরের Query: bookings থেকে <code className={CODE}>customer_id</code>, যেখানে status pending। বাইরের Query:
                  customers থেকে নাম, যাঁর customer_id সেই তালিকায় আছে।
                </>
              }
              solution={`SELECT full_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'pending');`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "in-vs-join",
      subHeader: { index: "003", title: "IN vs JOIN" },
      title: <SectionTitle>একই প্রশ্ন, JOIN এ ১৭, IN এ ১২</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফারুক সাহেবের প্রথম তালিকা আপনি{" "}
                <Link href="/sql/topic/inner-join" className={LINK}>
                  Module 06 এর INNER JOIN
                </Link>{" "}
                দিয়েও লিখতে পারতেন: customers আর bookings জোড়া দিয়ে, status confirmed ছেঁকে। কিন্তু JOIN প্রতিটা মিলের জন্য
                একটা Row দেয়, আর confirmed Booking ১৭টা। IN প্রতিটা Customer এর জন্য একটা প্রশ্ন করে: আছেন কি? তাই ১২। নিচের
                বক্সে দুটো সংখ্যা পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="JOIN প্রতিটা মিল গোনে, IN প্রতিটা মানুষ"
              query={`SELECT count(*) AS join_rows
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed';

SELECT count(*) AS in_rows
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed');`}
              caption="join_rows ১৭, in_rows ১২। SMS এর তালিকায় JOIN এর উত্তর বসালে Rahim Uddin, Nusrat Jahan, Tanvir Ahmed, Farhana Akter আর Sumaiya Islam একই ধন্যবাদ দুইবার করে পেতেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কখন কোনটা? সিদ্ধান্তটা একটা প্রশ্নে নেমে আসে: উত্তরে কি অন্য Table এর কোনো Column দেখাতে হবে? প্রতিটা
                Booking এর তারিখ আর টাকা দেখাতে হলে JOIN, কারণ সেগুলো bookings Table এ। শুধু Customer এর তালিকা চাইলে, আর
                bookings Table কেবল ছাঁকনি হিসেবে লাগলে, IN বা EXISTS। JOIN করে শেষে DISTINCT বসিয়ে পুনরাবৃত্তি মুছে
                ফেলাটা কাজ চালিয়ে দেয়, কিন্তু{" "}
                <Link href="/sql/topic/distinct" className={LINK}>
                  DISTINCT লেসনে
                </Link>{" "}
                দেখেছেন, এটা প্রায়ই একটা গন্ধ: ভুল প্রশ্নের উত্তর ঢেকে রাখা।
              </ContentParagraph>
              <ContentParagraph>
                IN এর ভেতরে আরেকটা IN বসানো যায়, তার ভেতরে আরেকটা। Chattogram অঞ্চলের কোনো ট্যুরে যাঁরা অন্তত একবার বুক
                করেছেন, তাঁদের খুঁজতে হলে চারটা Table পেরোতে হয়: destinations থেকে tours, tours থেকে departures, departures
                থেকে bookings। নিচের বক্সে সেই শিকলটা IN দিয়ে লেখা। প্রতিটা স্তর ভেতর থেকে বাইরে পড়ুন: Chattogram এর
                destination_id, সেগুলোর tour_id, সেগুলোর departure_id, সেগুলোর customer_id।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="IN এর ভেতরে IN: Chattogram এর ক্রেতারা"
              query={`SELECT full_name
FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM bookings
  WHERE departure_id IN (
    SELECT departure_id FROM departures
    WHERE tour_id IN (
      SELECT tour_id FROM tours
      WHERE destination_id IN (
        SELECT destination_id FROM destinations WHERE region = 'Chattogram'
      )
    )
  )
)
ORDER BY customer_id;`}
              caption="১১ জন। বাদ পড়েছেন Arif Chowdhury আর Lamia Haque (দুজনেই শুধু Sundarbans, Khulna), Aiman Zulkifli (শুধু Sylhet), আর Imran Kabir (কোনো Booking নেই)। চারটা স্তর পড়া যায়, কিন্তু আরেকটা বাড়লে চোখ হাঁপিয়ে যায়। এমন লম্বা শিকল নাম দেওয়া ধাপে ভেঙে লেখার উপায় Lesson 05 এর CTE।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখনো একটা Column এ মেলালে হয় না, দুটো একসাথে মেলাতে হয়। PostgreSQL আর MySQL দুটোই বন্ধনীতে কয়েকটা
                Column একসাথে লেখা মেনে নেয়, যাকে বলে Row Constructor: <code className={CODE}>{"(destination_id, guide_id) IN (SELECT destination_id, guide_id ...)"}</code>।
                তখন Subquery কেও ঠিক ততগুলো Column দিতে হয়, আর জোড়াটা পুরো মিললে তবেই সত্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই Column একসাথে: Row Constructor"
              query={`SELECT title
FROM tours
WHERE (destination_id, guide_id) IN (
  SELECT destination_id, guide_id FROM tours WHERE tour_id IN (1, 6)
)
ORDER BY tour_id;`}
              caption="ট্যুর 1 এর জোড়া (1, 1) আর ট্যুর 6 এর জোড়া (6, 2)। ফলাফলে ঠিক এই দুটো ট্যুর: Saint Martin Island Escape আর Sylhet Tea Garden Tour। Saint Martin Luxury Stay একই destination 1 এ, কিন্তু তার guide 4, তাই জোড়া মেলেনি।"
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
                  ডিসেম্বর 2026 এ অন্তত একটা Departure আছে, এমন ট্যুরগুলোর <code className={CODE}>title</code> দেখান,{" "}
                  <code className={CODE}>tour_id</code> অনুযায়ী সাজিয়ে। IN আর Subquery দিয়ে লিখুন।
                </>
              }
              hint={
                <>
                  ভেতরে departures থেকে <code className={CODE}>tour_id</code>, যেখানে{" "}
                  <code className={CODE}>{"starts_on >= DATE '2026-12-01' AND starts_on < DATE '2027-01-01'"}</code>।
                </>
              }
              solution={`SELECT title
FROM tours
WHERE tour_id IN (
  SELECT tour_id FROM departures
  WHERE starts_on >= DATE '2026-12-01'
    AND starts_on <  DATE '2027-01-01'
)
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "not-in",
      subHeader: { index: "004", title: "NOT IN" },
      title: <SectionTitle>তালিকায় নেই, এমন Row</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN এর উল্টো NOT IN: সেই Row গুলো, যাদের মান তালিকায় নেই। হাতে লেখা তালিকায় এর মানে সোজা।{" "}
                <code className={CODE}>{"x NOT IN (1, 2)"}</code> আসলে <code className={CODE}>{"x <> 1 AND x <> 2"}</code>, মানে
                তালিকার প্রতিটা মানের সাথে &ldquo;সমান না&rdquo;, আর সবগুলো একসাথে সত্য হতে হবে। এই AND এর শিকলটা মনে রাখুন,
                পরের অংশে এটাই সব রহস্যের চাবি।
              </ContentParagraph>
              <ContentParagraph>
                Subquery দিয়েও একই কথা। যে Customer কখনো বুক করেননি, তাঁকে খুঁজতে bookings এর সব customer_id এর একটা
                তালিকা বানান, তারপর সেই তালিকায় নেই এমন Customer। যে ট্যুরের কোনো Departure নেই, তাকে খুঁজতে departures এর
                সব tour_id এর তালিকা, তারপর তাতে নেই এমন ট্যুর। নিচের দুটো Query ঠিক উত্তর দেয়, যেটা Sample Database এর
                পাতায় ইচ্ছা করে রাখা Row এর সাথে মিলে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NOT IN যেখানে ঠিক কাজ করে"
              query={`SELECT full_name
FROM customers
WHERE customer_id NOT IN (SELECT customer_id FROM bookings);

SELECT title
FROM tours
WHERE tour_id NOT IN (SELECT tour_id FROM departures);`}
              caption="প্রথমটায় Imran Kabir, দ্বিতীয়টায় Cox's Bazar Family Package। দুটোই সঠিক। কেন এখানে কোনো ফাঁদ নেই? কারণ bookings.customer_id আর departures.tour_id দুটো Column ই NOT NULL দিয়ে বানানো, তাই এই দুই তালিকায় কখনো NULL আসতে পারে না। পরের অংশে দেখবেন, এই একটা শর্তই সব পার্থক্য গড়ে দেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "NOT IN একটা AND এর শিকল",
          content: (
            <ContentParagraph>
              <code className={CODE}>{"x NOT IN (a, b, c)"}</code> মানে <code className={CODE}>{"x <> a AND x <> b AND x <> c"}</code>। শিকলের একটা
              কড়া FALSE হলে পুরোটা FALSE। সবগুলো TRUE হলে পুরোটা TRUE। আর একটা কড়াও যদি অজানা হয়, বাকিগুলো TRUE হলেও
              পুরোটা অজানা। PostgreSQL এর Docs নিজেই বলে, NOT IN আর <code className={CODE}>{"<> ALL"}</code> একই জিনিস।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "null-trap",
      subHeader: { index: "005", title: "The NULL Trap" },
      title: <SectionTitle>একটা NULL, আর পুরো উত্তর গায়েব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তানিমের শূন্য Row এর রহস্য। প্রশ্নটা ছিল guides থেকে সেই Guide, যাঁর guide_id ট্যুরের তালিকায় নেই। তালিকা
                বানায় <code className={CODE}>{"SELECT guide_id FROM tours"}</code>। tours এ নয়টা ট্যুর, তাই তালিকায় নয়টা মান।
                তার আটটা আসল নম্বর, আর একটা NULL: Ratargul Swamp Boat Day এর এখনো কোনো Guide ঠিক হয়নি, তার guide_id ফাঁকা।
                tours.guide_id হলো Sample Database এর একমাত্র Foreign Key Column, যেটা ফাঁকা থাকতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এখন Nazmul Karim, guide 5, এর জন্য NOT IN খুলে লিখুন। তাঁকে তালিকার নয়টা মানের প্রতিটার সাথে &ldquo;সমান
                না&rdquo; হতে হবে। 5 আর 1 সমান না, TRUE। 5 আর 2 সমান না, TRUE। এভাবে আটটা আসল নম্বরের সাথে আটবার TRUE। নবম
                মান NULL। 5 আর NULL সমান কি না? NULL মানে অজানা, হয়তো সেটা 5, হয়তো না। তাই উত্তরও অজানা।{" "}
                <Link href="/sql/topic/null-logic" className={LINK}>
                  Module 03 এর NULL লেসনে
                </Link>{" "}
                দেখেছেন, TRUE AND অজানা মানে অজানা। আর WHERE শুধু সেই Row রাখে যার উত্তর পরিষ্কার TRUE।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NotInUnrollDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো ছবিটা একসাথে ভাবুন। একটা Guide এর জন্য NOT IN এর উত্তর তিনটার একটা হতে পারে। তাঁর guide_id
                তালিকার কোনো আসল নম্বরের সমান হলে FALSE, যেমন Jamal। তালিকার কোনো আসল নম্বরের সমান না হলে, আর তালিকায় কোনো
                NULL না থাকলে, TRUE। আর তালিকার কোনো আসল নম্বরের সমান না হলে কিন্তু তালিকায় একটা NULL থাকলে, অজানা। খেয়াল
                করুন, তালিকায় NULL থাকলে দ্বিতীয় পথটা বন্ধ। তখন উত্তর হয় FALSE, নয়তো অজানা, কখনো TRUE না।
              </ContentParagraph>
              <ContentParagraph>
                তাই নিয়মটা ভয়ংকর রকমের সহজ: <strong>NOT IN এর তালিকায় একটা NULL থাকলে Query কোনো Row ই ফেরত দিতে পারে
                না</strong>। দশটা Guide হোক বা দশ হাজার, উত্তর খালি। নিচের বক্সে সংখ্যা দিয়ে হাতে লেখা তালিকায় একই ঘটনা
                দেখুন, তারপর tours এর তালিকায় NULL টা কোথায় লুকিয়ে আছে বের করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="NULL ছাড়া আর NULL সহ"
              query={`SELECT 5 NOT IN (1, 2, 3, 4)       AS without_null,
       5 NOT IN (1, 2, 3, 4, NULL) AS with_null,
       1 NOT IN (1, 2, 3, 4, NULL) AS one_with_null;

SELECT count(*)                   AS listed,
       count(guide_id)            AS real_ids,
       count(*) - count(guide_id) AS nulls
FROM tours;

SELECT tour_id, title
FROM tours
WHERE guide_id IS NULL;`}
              caption="প্রথম Row: without_null t, with_null ফাঁকা (মানে NULL), one_with_null f। 5 তালিকায় নেই, কিন্তু NULL থাকায় সেটা প্রমাণ করা গেল না। 1 তালিকায় আছে, তাই FALSE, NULL থাকুক বা না থাকুক। দ্বিতীয় Query: তালিকায় ৯টা মান, ৮টা আসল, ১টা NULL। তৃতীয় Query সেই একটাকে দেখায়: ট্যুর 7, Ratargul Swamp Boat Day।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আজ ঠিক, কাল ভুল",
          content: (
            <ContentParagraph>
              এই ফাঁদের সবচেয়ে খারাপ দিক হলো সময়। আজ কোনো ট্যুরের guide_id ফাঁকা না থাকলে তানিমের Query ঠিক উত্তর দিত, সব
              Test পাস করত, Production এ চলে যেত। তারপর একদিন কেউ Guide ছাড়া একটা নতুন ট্যুর যোগ করলেন, আর সেই মুহূর্ত থেকে
              Report টা চুপচাপ খালি হয়ে গেল। Code এর একটা অক্ষরও বদলায়নি, বদলেছে শুধু Data। তাই প্রশ্নটা কখনো &ldquo;আজ
              কি NULL আছে&rdquo; না, প্রশ্ন হলো &ldquo;এই Column এ NULL আসতে পারে কি না&rdquo;।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সান্ত্বনা আছে: IN এর বেলায় তালিকার NULL সাধারণত ক্ষতি করে না। <code className={CODE}>{"1 IN (1, 2, NULL)"}</code> TRUE,
                কারণ একটা মিল পাওয়া গেছে। <code className={CODE}>{"5 IN (1, 2, NULL)"}</code> অজানা, আর WHERE সেটা বাদ দেয়, যেটা এমনিতেও
                বাদ যাওয়ার কথা ছিল। তাই &ldquo;তালিকায় আছে&rdquo; প্রশ্নে NULL চুপচাপ থাকে, ঝামেলা বাধায় শুধু &ldquo;তালিকায়
                নেই&rdquo; প্রশ্নে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "null-outside",
      subHeader: { index: "006", title: "NULL on the Outside" },
      title: <SectionTitle>বাঁ দিকে NULL: Ratargul কোনো দলেই নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফাঁদের আরেকটা মুখ আছে, যেখানে NULL তালিকার ভেতরে না, তুলনার বাঁ দিকে। ফারুক সাহেব ট্যুরগুলো দুই ভাগে চাইলেন:
                যেগুলো ইংরেজিভাষী Guide চালান, বিদেশি পর্যটকদের জন্য, আর বাকিগুলো। ইংরেজিভাষী Guide দুজন, Shirin Akter (2) আর
                Ayesha Siddiqua (4)। প্রথম ভাগ IN দিয়ে, দ্বিতীয় ভাগ NOT IN দিয়ে, আর দুই ভাগ মিলে সব ট্যুর হওয়ার কথা।
              </ContentParagraph>
              <ContentParagraph>
                এবার তালিকায় কোনো NULL নেই, কারণ guides.guide_id কখনো ফাঁকা না। কিন্তু বাঁ দিকে, মানে tours.guide_id তে,
                Ratargul এর NULL বসে আছে। <code className={CODE}>{"NULL IN (2, 4)"}</code> কী? অজানা, কারণ হয়তো NULL টা আসলে 2।{" "}
                <code className={CODE}>{"NULL NOT IN (2, 4)"}</code> কী? সেটাও অজানা, একই কারণে। দুটোই অজানা, তাই Ratargul কোনো ভাগেই
                জায়গা পায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুই অর্ধেক, মোট মেলে না"
              query={`SELECT count(*) AS english_guided
FROM tours
WHERE guide_id IN (SELECT guide_id FROM guides WHERE language = 'English');

SELECT count(*) AS the_rest
FROM tours
WHERE guide_id NOT IN (SELECT guide_id FROM guides WHERE language = 'English');

SELECT count(*) AS all_tours FROM tours;

SELECT NULL IN (2, 4) AS null_in, NULL NOT IN (2, 4) AS null_not_in;`}
              caption="english_guided ৪, the_rest ৪, all_tours ৯। চার আর চার আট, একটা ট্যুর কোথাও নেই। শেষ Row এর দুটো মানই ফাঁকা, মানে NULL: বাঁ দিক NULL হলে IN আর NOT IN দুটোই অজানা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <NullHalvesLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর সমাধান হলো NULL এর জন্য একটা আলাদা দরজা খুলে দেওয়া। &ldquo;বাকিগুলো&rdquo; যদি সত্যিই সব বাকি বোঝায়, তাহলে
                Guide ঠিক না হওয়া ট্যুরও সেখানে পড়ে। তাই লিখুন <code className={CODE}>{"guide_id NOT IN (...) OR guide_id IS NULL"}</code>।
                COALESCE দিয়ে NULL কে একটা বানানো নম্বরে বদলে দেওয়ার পথও আছে, কিন্তু সেই নম্বর একদিন সত্যিকারের কোনো Guide এর
                নম্বর হয়ে যেতে পারে, তাই IS NULL এর সোজা পথটাই ভালো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বাকিগুলোয় NULL এর দরজা"
              query={`SELECT title, guide_id
FROM tours
WHERE guide_id NOT IN (SELECT guide_id FROM guides WHERE language = 'English')
   OR guide_id IS NULL
ORDER BY tour_id;`}
              caption="এবার ৫টা ট্যুর: Saint Martin Island Escape, Sundarbans Mangrove Cruise, Sajek Valley Cloud Trip, Ratargul Swamp Boat Day (guide_id ফাঁকা) আর Cox's Bazar Family Package। চার আর পাঁচ মিলে নয়, সব ট্যুর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "IN আর NOT IN পরস্পরের পরিপূরক না",
          content: (
            <ContentParagraph>
              অঙ্কের ক্লাসে শেখা অভ্যাস বলে, একটা জিনিস হয় দলে আছে নয়তো নেই, তৃতীয় কিছু নেই। SQL এ তৃতীয় একটা ঘর আছে:
              অজানা। যে Column এ NULL আসতে পারে, তাতে IN আর NOT IN মিলে কখনো নিশ্চিতভাবে সব Row দেয় না। দুই ভাগে Report
              বানালে শেষে যোগফল মিলিয়ে নেওয়ার অভ্যাসটা তাই খুব কাজের: চার আর চার আট, অথচ ট্যুর নয়টা, মানে কোথাও একটা
              NULL লুকিয়ে আছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "fixing-not-in",
      subHeader: { index: "007", title: "Fixing NOT IN" },
      title: <SectionTitle>তিন উপায়ে নিরাপদ &ldquo;নেই কি&rdquo;</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের প্রশ্নে ফিরে যাই: কোন Guide এর হাতে একটাও ট্যুর নেই। এই ধরনের &ldquo;নেই কি&rdquo; প্রশ্নকে বলে Anti
                Join, যেটা{" "}
                <Link href="/sql/topic/semi-anti-join" className={LINK}>
                  Module 06 এর Semi আর Anti Join লেসনে
                </Link>{" "}
                বিস্তারিত দেখেছেন। নিরাপদে লেখার তিনটা পথ আছে, আর তিনটাই Nazmul Karim কে ফিরিয়ে আনে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>তালিকা থেকে NULL ছেঁকে ফেলা।</strong> Subquery তে <code className={CODE}>{"WHERE guide_id IS NOT NULL"}</code>{" "}
                  লিখলে তালিকায় আর NULL থাকে না, NOT IN আবার স্বাভাবিক। NOT IN এর পড়ার সুবিধা থাকে, কিন্তু প্রতিবার মনে রাখতে
                  হয়।
                </ListItem>
                <ListItem>
                  <strong>NOT EXISTS।</strong> EXISTS প্রতিটা Row কে জিজ্ঞেস করে &ldquo;মিলে এমন কেউ আছে কি&rdquo;। NULL এর সাথে
                  তুলনা কখনো মিল দেয় না, তাই Ratargul চুপচাপ পাশে সরে থাকে, কোনো অজানা তৈরি হয় না। এটাই সবচেয়ে নিরাপদ
                  অভ্যাস।
                </ListItem>
                <ListItem>
                  <strong>LEFT JOIN আর IS NULL।</strong> সব Guide রেখে ট্যুর জোড়া দিন, যাঁর পাশে ট্যুরের Primary Key ফাঁকা, তাঁর
                  কোনো ট্যুর নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, তিনটা নিরাপদ লেখা"
              query={`-- ১. তালিকা থেকে NULL ছেঁকে
SELECT full_name
FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);

-- ২. NOT EXISTS
SELECT g.full_name
FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);

-- ৩. LEFT JOIN আর IS NULL
SELECT g.full_name
FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
WHERE t.tour_id IS NULL;`}
              caption="তিনটা Query ই একটা করে Row দেয়: Nazmul Karim। তানিমের মূল Query এর সাথে প্রথমটার পার্থক্য শুধু একটা লাইন, WHERE guide_id IS NOT NULL, অথচ উত্তর শূন্য থেকে সঠিক হয়ে গেল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফাঁদ এড়ানোর আসল অভ্যাসটা Query লেখার আগে: যে Column দিয়ে NOT IN এর তালিকা বানাচ্ছেন, সেটা NULL নিতে পারে কি না
                দেখে নেওয়া। Data দেখে না, Table এর নিয়ম দেখে, কারণ আজকের Data কালকের নিশ্চয়তা না। প্রতিটা Table এর প্রতিটা
                Column এর এই তথ্য PostgreSQL রাখে information_schema নামের একটা জায়গায়, যেটা আপনি{" "}
                <Link href="/sql/topic/psql-basics" className={LINK}>
                  Module 02 এ
                </Link>{" "}
                ছুঁয়ে গেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন Column NULL নিতে পারে"
              query={`SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('customer_id', 'guide_id', 'tour_id',
                      'booking_id', 'departure_id', 'destination_id')
ORDER BY table_name, column_name;`}
              caption="১৩টা Row। একমাত্র YES হলো tours.guide_id, বাকি বারোটা NO। তাই bookings.customer_id বা departures.tour_id দিয়ে বানানো NOT IN নিরাপদ, আর tours.guide_id দিয়ে বানানোটা বিপজ্জনক। psql এ \d tours লিখলেও একই কথা দেখা যায়: guide_id এর পাশে not null লেখা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা", "তালিকায় NULL থাকলে", "কখন বেছে নেবেন"],
          rows: [
            ["NOT IN (Subquery)", "শূন্য Row, Error ছাড়া", "শুধু যখন Column টা NOT NULL, আর সেটা আপনি যাচাই করেছেন"],
            ["NOT IN (... WHERE col IS NOT NULL)", "ঠিক উত্তর", "NOT IN এর পড়ার ধরন পছন্দ হলে, প্রতিবার ফিল্টার মনে রেখে"],
            ["NOT EXISTS", "ঠিক উত্তর", "সবচেয়ে নিরাপদ, তাই সাধারণ অভ্যাস হিসেবে"],
            ["LEFT JOIN ... IS NULL", "ঠিক উত্তর, Primary Key দেখলে", "যখন অন্য Table এর কিছু পাশে দেখানোও লাগতে পারে"],
            ["NOT IN (1, 2, 3)", "নিজে NULL না লিখলে নিরাপদ", "হাতে লেখা ছোট তালিকা"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3"
              task={
                <>
                  যে Guide এর হাতে একটাও ট্যুর নেই, তাঁর <code className={CODE}>full_name</code> দেখান। NOT IN দিয়ে লিখুন,
                  কিন্তু NULL ফাঁদ এড়িয়ে, যাতে উত্তর খালি না আসে।
                </>
              }
              hint={
                <>
                  তানিমের Query টাই লিখুন, শুধু ভেতরের Subquery তে একটা শর্ত যোগ করুন, যেটা tours এর ফাঁকা guide_id
                  তালিকা থেকে বাদ দেয়।
                </>
              }
              solution={`SELECT full_name
FROM guides
WHERE guide_id NOT IN (
  SELECT guide_id FROM tours WHERE guide_id IS NOT NULL
);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "exists-or-in",
      subHeader: { index: "008", title: "EXISTS or IN" },
      title: <SectionTitle>EXISTS আর IN: কখন কোনটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                &ldquo;আছে কি&rdquo; প্রশ্ন দুইভাবে লেখা যায়, আর দুইভাবেই আপনি এখন লিখতে পারেন। IN এর ভাবনা: আগে পুরো তালিকা বানানো, তারপর
                দেখা এই মান তাতে আছে কি না। EXISTS এর ভাবনা: এই Row এর জন্য মিলে এমন কেউ আছে কি না, আর প্রথমটা পেলেই থেমে যাওয়া। EXISTS এর
                পুরো গল্প Module 06 এর Semi Join লেসনে আছে, এখানে শুধু দুটোকে পাশাপাশি রাখা।
              </ContentParagraph>
              <ContentParagraph>
                ইতিবাচক প্রশ্নে দুটো একই উত্তর দেয়। আর আধুনিক Database দুটোকে একইভাবে চালায়ও। নিচের বক্সে দুটো Query এর
                Row গোনা দেখুন, তারপর EXPLAIN দিয়ে দেখুন PostgreSQL ভেতরে কী পরিকল্পনা করে। EXPLAIN এর খুঁটিনাটি Module 13 এর
                বিষয়, এখানে শুধু প্রথম লাইনটা পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই উত্তর, একই পরিকল্পনা"
              query={`SELECT count(*) AS with_in
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed');

SELECT count(*) AS with_exists
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');

EXPLAIN
SELECT full_name FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed');

EXPLAIN
SELECT c.full_name FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id AND b.status = 'confirmed');`}
              caption="with_in ১২, with_exists ১২। দুটো EXPLAIN এর প্রথম লাইনই Hash Semi Join: PostgreSQL দুটো লেখাকে একই Semi Join বানিয়ে ফেলেছে। cost এর সংখ্যাগুলো মেশিন আর Data ভেদে বদলায়, ওগুলো মুখস্থ করার কিছু না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "IN (Subquery)", "EXISTS"],
          rows: [
            ["ভেতরের Query", "সাধারণত বাইরের Row দেখে না, একবার চলে", "বাইরের Row দেখে, প্রতিটা Row এর জন্য একটা প্রশ্ন"],
            ["ইতিবাচক প্রশ্ন, আছে কি", "ঠিক উত্তর", "ঠিক উত্তর"],
            ["নেতিবাচক প্রশ্ন, নেই কি", "NOT IN: তালিকায় NULL থাকলে শূন্য Row", "NOT EXISTS: NULL এ কিছু যায় আসে না"],
            ["কয়েকটা শর্ত একসাথে", "Row Constructor লাগে, (a, b) IN (...)", "ভেতরের WHERE এ যত শর্ত খুশি"],
            ["পড়তে", "ছোট তালিকায় খুব পরিষ্কার", "একটু লম্বা, কিন্তু শর্ত বেশি হলে পরিষ্কার"],
            ["গতি", "PostgreSQL আর MySQL সাধারণত Semi Join বানায়", "একই"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এক লাইনের নিয়ম",
          content: (
            <ContentParagraph>
              &ldquo;আছে কি&rdquo; প্রশ্নে যেটা পড়তে সহজ লাগে সেটা লিখুন, IN হোক বা EXISTS। &ldquo;নেই কি&rdquo; প্রশ্নে অভ্যাস করে
              NOT EXISTS লিখুন। NOT IN তখনই, যখন তালিকার Column টা NOT NULL, আর সেটা আপনি নিজে যাচাই করে নিয়েছেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "any-some",
      subHeader: { index: "009", title: "ANY and SOME" },
      title: <SectionTitle>ANY: অন্তত একটার সাথে মিললেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN শুধু সমান কি না দেখে। কিন্তু অনেক প্রশ্নে সমান না, তুলনা লাগে: অন্তত একটার চেয়ে দামি, সবগুলোর চেয়ে সস্তা।
                ধরুন আপনি সেই ট্যুরগুলো চান, যাদের দাম Sylhet এর কোনো একটা ট্যুরের দামের সমান।{" "}
                <Link href="/sql/topic/scalar-subqueries" className={LINK}>
                  আগের লেসনের
                </Link>{" "}
                অভ্যাসে লিখলেন <code className={CODE}>{"price_bdt = (SELECT price_bdt FROM tours WHERE destination_id = 6)"}</code>।
                কিন্তু Sylhet এ ট্যুর দুটো, Subquery দুটো দাম দেয়, আর <code className={CODE}>=</code> একটার বেশি মান নিয়ে কী করবে
                জানে না।
              </ContentParagraph>
              <ContentParagraph>
                এই জায়গার জন্যই ANY। <code className={CODE}>{"price_bdt = ANY (Subquery)"}</code> মানে তালিকার অন্তত একটা মানের সাথে
                সমান হলেই সত্য। = এর জায়গায় যেকোনো তুলনা বসানো যায়: <code className={CODE}>{"> ANY"}</code> মানে অন্তত একটার চেয়ে
                বেশি, <code className={CODE}>{"< ANY"}</code> মানে অন্তত একটার চেয়ে কম। আর ANY এর একটা যমজ শব্দ আছে, SOME, হুবহু একই
                অর্থ। Standard SQL দুটোই রেখেছে, কারণ ইংরেজিতে কোনো কোনো বাক্যে any এর চেয়ে some পড়তে স্বাভাবিক লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="= ANY কাজ করে, = থেমে যায়"
              query={`SELECT title
FROM tours
WHERE price_bdt = ANY (SELECT price_bdt FROM tours WHERE destination_id = 6);

SELECT title
FROM tours
WHERE price_bdt = (SELECT price_bdt FROM tours WHERE destination_id = 6);`}
              caption="প্রথম Query দুটো ট্যুর দেয়, Sylhet Tea Garden Tour আর Ratargul Swamp Boat Day, কারণ তাদের দামই তালিকায়। দ্বিতীয়টা থামে ERROR: more than one row returned by a subquery used as an expression দিয়ে, SQLSTATE 21000। = একটা মান চায়, ANY একটা তালিকা মেনে নেয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code className={CODE}>= ANY</code> আর IN একই জিনিস, PostgreSQL এর Docs সেটা সরাসরি বলে। তাহলে ANY এর আসল কাজ
                অন্য তুলনায়। এবার ফারুক সাহেবের তৃতীয় প্রশ্নের কাছাকাছি যাই। Sylhet এর দুটো দাম 7800 আর 3500।{" "}
                <code className={CODE}>{"> ANY"}</code> মানে এই দুটোর অন্তত একটার চেয়ে বেশি। একটু ভাবলেই বোঝা যায়, সবচেয়ে ছোটটার
                চেয়ে বেশি হলেই কাজ হয়ে যায়, কারণ 3500 এর চেয়ে বেশি হলে অন্তত সেই একটার চেয়ে বেশি তো হলোই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="> ANY আর > SOME"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > ANY (SELECT price_bdt FROM tours WHERE destination_id = 6)
ORDER BY price_bdt;

SELECT count(*) AS with_some
FROM tours
WHERE price_bdt > SOME (SELECT price_bdt FROM tours WHERE destination_id = 6);`}
              caption="প্রথম Query ৮টা ট্যুর, সবচেয়ে সস্তা Sylhet Tea Garden Tour (7800) থেকে Saint Martin Luxury Stay (32000) পর্যন্ত। বাদ শুধু Ratargul (3500), কারণ সে নিজেই সবচেয়ে ছোট, কারো চেয়ে বেশি না। with_some ও ৮, একই প্রশ্ন অন্য শব্দে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <AnyAllNumberLine />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              task={
                <>
                  Cox&apos;s Bazar (destination_id 2) এর অন্তত একটা ট্যুরের চেয়ে সস্তা ট্যুরগুলোর{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code> দেখান। ANY দিয়ে লিখুন। ক্রম
                  যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  Cox&apos;s Bazar এর দাম দুটো, 8500 আর 15500। &ldquo;অন্তত একটার চেয়ে কম&rdquo; মানে{" "}
                  <code className={CODE}>{"< ANY"}</code>, আর ফলাফল আসলে 15500 এর চেয়ে কম সবগুলো।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt < ANY (SELECT price_bdt FROM tours WHERE destination_id = 2);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "all",
      subHeader: { index: "010", title: "ALL" },
      title: <SectionTitle>ALL: প্রত্যেকটার সাথে মিলতে হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ANY এর ভাই ALL: তালিকার প্রত্যেকটা মানের সাথে তুলনা সত্য হতে হবে। ফারুক সাহেবের Premium Brochure এর প্রশ্ন ঠিক
                এটাই: Sylhet এর সব ট্যুরের চেয়ে দামি। <code className={CODE}>{"> ALL"}</code> মানে 7800 এর চেয়েও বেশি, 3500 এর চেয়েও
                বেশি, অর্থাৎ সবচেয়ে বড়টার চেয়ে বেশি। একটা পরীক্ষার কথা ভাবুন, যেখানে পাস করতে প্রতিটা বিষয়ে পাস লাগে: একটায়
                ফেল করলেই পুরোটা ফেল। ALL ঠিক সেভাবে ভাবে।
              </ContentParagraph>
              <ContentParagraph>
                ALL দিয়ে আরও দুটো পরিচিত প্রশ্নও লেখা যায়। <code className={CODE}>{">= ALL"}</code> সব ট্যুরের তালিকার বিরুদ্ধে মানে
                প্রত্যেকটার সমান বা বেশি, অর্থাৎ সবচেয়ে দামি ট্যুর। <code className={CODE}>{"<= ALL"}</code> মানে সবচেয়ে সস্তা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="> ALL, >= ALL আর <= ALL"
              query={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 6)
ORDER BY price_bdt;

SELECT title, price_bdt
FROM tours
WHERE price_bdt >= ALL (SELECT price_bdt FROM tours);

SELECT title, price_bdt
FROM tours
WHERE price_bdt <= ALL (SELECT price_bdt FROM tours);`}
              caption="প্রথম Query ৭টা ট্যুর, Cox's Bazar Beach Weekend (8500) থেকে শুরু। > ANY এর ৮টার সাথে তুলনা করুন: Sylhet Tea Garden Tour (7800) এবার নেই, কারণ সে নিজের চেয়ে বেশি না। দ্বিতীয় Query একটা Row, Saint Martin Luxury Stay (32000)। তৃতীয়টা একটা, Ratargul Swamp Boat Day (3500)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <QuantifierLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ল্যাবে <code className={CODE}>{"<>"}</code> আর ALL বেছে একটা NULL সহ তালিকা দেখেছেন? <code className={CODE}>{"<> ALL"}</code> মানে
                প্রত্যেকটার থেকে আলাদা, আর এটাই হুবহু NOT IN। নাম বদলালে ফাঁদ বদলায় না: তালিকায় NULL থাকলে{" "}
                <code className={CODE}>{"<> ALL"}</code> ও কখনো TRUE দিতে পারে না। তানিম যদি NOT IN এর বদলে{" "}
                <code className={CODE}>{"<> ALL"}</code> লিখতেন, একই শূন্য Row পেতেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="<> ALL হলো NOT IN, ফাঁদসহ"
              query={`SELECT full_name
FROM guides
WHERE guide_id <> ALL (SELECT guide_id FROM tours);

SELECT full_name
FROM guides
WHERE guide_id <> ALL (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);`}
              caption="প্রথমটা শূন্য Row, দ্বিতীয়টা Nazmul Karim। NOT IN এর মতোই, আর একই সমাধানে ঠিক হয়।"
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
                  Cox&apos;s Bazar (destination_id 2) এর সব ট্যুরের চেয়ে দামি ট্যুরগুলোর <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code> দেখান, দাম কম থেকে বেশি সাজিয়ে। ALL দিয়ে লিখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 2)"}</code>, তারপর{" "}
                  <code className={CODE}>ORDER BY price_bdt</code>।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 2)
ORDER BY price_bdt;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "empty-lists",
      subHeader: { index: "011", title: "Empty Lists" },
      title: <SectionTitle>খালি তালিকা: ALL বলে হ্যাঁ, MAX বলে জানি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Marketing দল এবার আরেকটা Brochure চাইল: Kuakata এর সব ট্যুরের চেয়ে দামি ট্যুর। Kuakata Sample Database এর
                সেই Destination, যেখানে এখনো একটাও ট্যুর নেই। তাই Subquery একটাও দাম দেয় না, তালিকা পুরো খালি। এখন{" "}
                <code className={CODE}>{"price_bdt > ALL (খালি তালিকা)"}</code> এর উত্তর কী?
              </ContentParagraph>
              <ContentParagraph>
                একটা ক্লাসের কথা ভাবুন, যেখানে একজনও ছাত্র ভর্তি হয়নি। Principal জানতে চাইলেন, &ldquo;এই ক্লাসের সবাই কি পাস
                করেছে?&rdquo; উত্তর হ্যাঁ, কারণ ফেল করা একজনকেও দেখানো যায় না। যুক্তিবিদ্যায় একে বলে Vacuous Truth, ফাঁকা
                সত্য। ALL ঠিক এভাবে ভাবে: আপত্তি করার মতো একটা FALSE খুঁজে না পেলে TRUE। তাই খালি তালিকার বিরুদ্ধে{" "}
                <code className={CODE}>{"> ALL"}</code> সব ট্যুরের জন্য TRUE, আর Brochure এ নয়টা ট্যুরই ঢুকে পড়ে। উল্টো দিকে ANY
                খোঁজে অন্তত একটা TRUE, খালি তালিকায় পায় না, তাই FALSE।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা লেখা আছে, যেটা দেখতে একই প্রশ্ন: <code className={CODE}>{"price_bdt > (SELECT max(price_bdt) ...)"}</code>।
                তালিকা খালি থাকলে max এর উত্তর NULL, আর NULL এর সাথে তুলনা অজানা। তাই এই লেখা একটা ট্যুরও দেয় না। একই প্রশ্ন,
                দুই লেখা, নয় আর শূন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Kuakata: খালি তালিকার বিরুদ্ধে"
              query={`SELECT price_bdt FROM tours WHERE destination_id = 7;

SELECT count(*) AS above_all
FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7);

SELECT count(*) AS above_any
FROM tours
WHERE price_bdt > ANY (SELECT price_bdt FROM tours WHERE destination_id = 7);

SELECT count(*) AS above_max
FROM tours
WHERE price_bdt > (SELECT max(price_bdt) FROM tours WHERE destination_id = 7);

SELECT (SELECT max(price_bdt) FROM tours WHERE destination_id = 7) AS kuakata_max;`}
              caption="প্রথম Query শূন্য Row, Kuakata তে ট্যুর নেই। above_all ৯, above_any ০, above_max ০, আর kuakata_max ফাঁকা, মানে NULL। খালি তালিকায় ALL হ্যাঁ বলে, ANY না বলে, আর max বলে জানি না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <EmptyListSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                IN আর NOT IN এর বেলায়ও খালি তালিকার নিয়ম একই যুক্তিতে চলে। খালি তালিকায় কিছুই নেই, তাই কোনো মান তাতে
                &ldquo;আছে&rdquo; না: IN সবসময় FALSE, শূন্য Row। আর সব মানই তাতে &ldquo;নেই&rdquo;: NOT IN সবসময় TRUE, সব Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="খালি তালিকায় IN আর NOT IN, আর একটা পাহারাদার"
              query={`SELECT count(*) AS in_empty
FROM tours
WHERE tour_id IN (SELECT tour_id FROM tours WHERE destination_id = 7);

SELECT count(*) AS not_in_empty
FROM tours
WHERE tour_id NOT IN (SELECT tour_id FROM tours WHERE destination_id = 7);

-- পাহারাদার: তালিকা খালি হলে কিছুই দেখাবেন না
SELECT title, price_bdt
FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7)
  AND EXISTS (SELECT 1 FROM tours WHERE destination_id = 7);`}
              caption="in_empty ০, not_in_empty ৯। শেষ Query শূন্য Row: EXISTS অংশটা আগে নিশ্চিত করে যে তুলনা করার মতো অন্তত একটা Kuakata ট্যুর আছে। ব্যবসার প্রশ্নে &ldquo;তুলনা করার কিছু নেই&rdquo; মানে সাধারণত &ldquo;কিছু দেখানোর নেই&rdquo;, &ldquo;সব দেখাও&rdquo; না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ALL কে max বা min দিয়ে বদলে লেখার অভ্যাস অনেকের আছে, আর তালিকা ভরা ও পরিষ্কার থাকলে দুটো একই উত্তর দেয়। পার্থক্য
                শুধু দুই কোণায়, কিন্তু ঠিক সেই দুই কোণাতেই Report ভুল হয়। খালি তালিকার কথা দেখলেন। দ্বিতীয় কোণা হলো তালিকায়
                NULL: max NULL গুলো এড়িয়ে যায়, ALL এড়ায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তালিকায় NULL: max এড়ায়, ALL এড়ায় না"
              query={`-- তালিকা: 9500 আর একটা NULL
SELECT count(*) AS max_view
FROM tours
WHERE price_bdt > (SELECT max(v) FROM (VALUES (9500::numeric), (NULL)) AS x(v));

SELECT count(*) AS all_view
FROM tours
WHERE price_bdt > ALL (SELECT v FROM (VALUES (9500::numeric), (NULL)) AS x(v));`}
              caption="max_view ৫: max NULL টা উপেক্ষা করে 9500 নেয়, তারপর 9500 এর চেয়ে দামি পাঁচটা ট্যুর। all_view ০: প্রতিটা ট্যুরের NULL এর সাথে তুলনা অজানা, তাই কোনোটাই পরিষ্কার TRUE না। VALUES দিয়ে বানানো ছোট তালিকাটা শুধু এই পরীক্ষার জন্য।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["তালিকার অবস্থা", "x > ALL (তালিকা)", "x > (SELECT max(...))"],
          rows: [
            ["ভরা, NULL নেই", "সবচেয়ে বড়টার চেয়ে বেশি হলে TRUE", "একই উত্তর"],
            ["খালি", "TRUE, সব Row আসে", "NULL, একটাও Row আসে না"],
            ["একটা NULL সহ", "কখনো TRUE না, একটাও Row আসে না", "NULL বাদ দিয়ে বাকিগুলোর max ধরে তুলনা"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              task={
                <>
                  Kuakata (destination_id 7) এর সব ট্যুরের চেয়ে দামি ট্যুর কয়টা? ALL দিয়ে একটা Query লিখুন, যেটা একটা Column আর
                  একটা Row দেয়: সংখ্যাটা। উত্তরটা দেখে ভাবুন, কেন এমন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>count(*)</code>, আর WHERE এ{" "}
                  <code className={CODE}>{"price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7)"}</code>।
                </>
              }
              solution={`SELECT count(*)
FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7);`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "any-array",
      subHeader: { index: "012", title: "ANY With an Array" },
      title: <SectionTitle>PostgreSQL এর Array আর = ANY</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PostgreSQL এ ANY আর ALL এর ডান দিকে শুধু Subquery না, একটা Array ও বসতে পারে। Array মানে একটা মানের ভেতরে অনেকগুলো
                মান, একটা বাক্সে কয়েকটা জিনিস একসাথে। লেখার দুটো চেহারা: <code className={CODE}>{"ARRAY[1, 5, 15]"}</code>, আর লেখা
                হিসেবে <code className={CODE}>{"'{1,5,15}'::int[]"}</code>। Array এর পুরো জগৎ{" "}
                <Link href="/sql/topic/arrays" className={LINK}>
                  Module 15 এ
                </Link>
                , এখানে শুধু তুলনার কাজটুকু।
              </ContentParagraph>
              <ContentParagraph>
                এটা কেন জরুরি? Support Screen এ একজন কর্মী তিনটা Booking এর নম্বর দিলেন, App কে সেগুলোর তথ্য আনতে হবে। IN দিয়ে
                করলে App কে প্রতিবার নম্বরের সংখ্যা গুনে <code className={CODE}>{"IN ($1, $2, $3)"}</code> এর মতো আলাদা আলাদা
                Parameter বানাতে হয়, পাঁচটা নম্বরে পাঁচটা। Array দিয়ে পুরো তালিকা একটাই Parameter:{" "}
                <code className={CODE}>{"booking_id = ANY ($1)"}</code>। Query এর লেখা কখনো বদলায় না, আর নম্বরগুলো কখনো SQL এর
                লেখার ভেতরে জোড়া লাগে না, যেটা{" "}
                <Link href="/sql/topic/app-database-conversation" className={LINK}>
                  Module 01 এ দেখা SQL Injection
                </Link>{" "}
                থেকেও বাঁচায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="= ANY আর <> ALL একটা Array এর বিরুদ্ধে"
              query={`SELECT full_name
FROM customers
WHERE customer_id = ANY (ARRAY[1, 5, 15])
ORDER BY customer_id;

SELECT full_name
FROM customers
WHERE customer_id = ANY ('{1,5,15}'::int[])
ORDER BY customer_id;

SELECT count(*) AS not_these
FROM customers
WHERE customer_id <> ALL (ARRAY[1, 5, 15]);

SELECT count(*) AS not_these_with_null
FROM customers
WHERE customer_id <> ALL (ARRAY[1, 5, NULL]);`}
              caption="প্রথম দুটো Query একই তিনজন: Rahim Uddin, Sabbir Hossain আর Imran Kabir। not_these ১২, বাকিরা। not_these_with_null ০: Array এর ভেতরের NULL ও একই ফাঁদ পাতে, কারণ <> ALL তো NOT IN ই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "support-lookup.mjs",
          code: `// Module 02 এর পর নিজের মেশিনে চালানোর জন্য। Connection String আসে Environment থেকে।
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new pg.Pool({ connectionString });

// কর্মী যতগুলো নম্বর দিন, Query একটাই, Parameter একটাই
const bookingIds = [13, 14, 15];

const { rows } = await pool.query(
  'SELECT payment_id, booking_id, method, status FROM payments WHERE booking_id = ANY($1) ORDER BY payment_id',
  [bookingIds],
);

console.log(rows);
await pool.end();`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                node-postgres একটা JavaScript Array কে নিজে থেকেই PostgreSQL এর Array বানিয়ে পাঠায়, সেটা তাদের Docs এর
                Parameter নিয়মে লেখা আছে। এই লেসন লেখার সময় একই Query একই Array Parameter দিয়ে Sample Database এ চালিয়ে দেখা
                হয়েছে: Payment 12, 13 আর 14 আসে।
              </ContentParagraph>
              <ContentParagraph>
                একটা চেনা ভুল আছে, যেটা এখানে ধরিয়ে দেওয়া দরকার। Array টা যদি একটা Subquery থেকে বানাতে চান, যেমন{" "}
                <code className={CODE}>{"= ANY (SELECT array_agg(guide_id) FROM guides ...)"}</code>, PostgreSQL বন্ধনীর ভেতরের
                SELECT দেখে ধরে নেয় এটা Subquery এর রূপ, Array এর না। তখন সে প্রতিটা Row কে তালিকার একটা মান ভাবে, আর সেই একমাত্র
                মানটা নিজেই একটা Array। একটা সংখ্যার সাথে একটা Array এর তুলনা হয় না, তাই Error।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Subquery থেকে Array: ঠিক আর ভুল"
              query={`-- ঠিক: Subquery কে Array তে Cast করে Array এর রূপে
SELECT title
FROM tours
WHERE guide_id = ANY ((SELECT array_agg(guide_id) FROM guides WHERE language = 'English')::int[])
ORDER BY tour_id;

-- ভুল: PostgreSQL এটাকে Subquery এর রূপ ধরে নেয়
SELECT title
FROM tours
WHERE guide_id = ANY (SELECT array_agg(guide_id) FROM guides WHERE language = 'English');`}
              caption="প্রথম Query চারটা ট্যুর দেয়, Shirin আর Ayesha এর। দ্বিতীয়টা থামে ERROR: operator does not exist: integer = integer[] দিয়ে, সাথে HINT: No operator matches the given name and argument types। সবচেয়ে সহজ পথ অবশ্য Array বানানোই না, সরাসরি IN (SELECT guide_id ...) লেখা।"
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
                  Support কর্মী Booking 13, 14 আর 15 এর Payment দেখতে চান: <code className={CODE}>payment_id</code>,{" "}
                  <code className={CODE}>booking_id</code>, <code className={CODE}>method</code> আর <code className={CODE}>status</code>,{" "}
                  <code className={CODE}>payment_id</code> অনুযায়ী। = ANY আর একটা Array দিয়ে লিখুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"WHERE booking_id = ANY (ARRAY[13, 14, 15])"}</code>, তারপর{" "}
                  <code className={CODE}>ORDER BY payment_id</code>।
                </>
              }
              solution={`SELECT payment_id, booking_id, method, status
FROM payments
WHERE booking_id = ANY (ARRAY[13, 14, 15])
ORDER BY payment_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ কোনটা চলে, কোনটা চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি যে ভিডিও কোর্সটা দেখছেন সেটা MySQL দিয়ে, তাই এই লেসনের প্রতিটা দাবি MySQL 8.4 এ আলাদা করে চালিয়ে দেখা হয়েছে,
                MySQL এর Sample File লোড করা একটা Container এ। মূল কথা দুটো। এক, IN, NOT IN, ANY, SOME আর ALL সবই Subquery এর
                সাথে চলে, আর ফলাফল PostgreSQL এর সাথে হুবহু এক, NULL ফাঁদসহ। দুই, MySQL এ Array নেই, আর ভেতরে LIMIT চলে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেখা", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["IN / NOT IN (Subquery)", "চলে", "চলে, একই ফলাফল (১২ জন, Imran)"],
            ["guides NOT IN tours এর NULL ফাঁদ", "শূন্য Row", "শূন্য Row, হুবহু একই"],
            ["ANY, SOME, ALL (Subquery)", "চলে", "চলে: > ANY ৮, > ALL ৭"],
            ["খালি তালিকায় > ALL", "TRUE, ৯টা ট্যুর", "TRUE, ৯টা ট্যুর"],
            ["Subquery তে দুটো Column", "subquery has too many columns", "ERROR 1241: Operand should contain 1 column(s)"],
            ["IN (SELECT ... LIMIT 3)", "চলে", "ERROR 1235: LIMIT & IN/ALL/ANY/SOME subquery চলে না"],
            ["= ANY (ARRAY[1, 5, 15])", "চলে", "ERROR 1064, MySQL এ Array নেই"],
            ["= ANY (1, 5, 15)", "Syntax Error", "Syntax Error; হাতে লেখা তালিকায় IN লিখুন"],
            ["(a, b) IN (Subquery)", "চলে", "চলে"],
            ["(a, b) > ANY (Subquery)", "চলে", "ERROR 1241: MySQL কয়েক Column এর তুলনা শুধু IN এ মানে"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql লোড করা

SELECT COUNT(*) AS not_in_trap
FROM guides WHERE guide_id NOT IN (SELECT guide_id FROM tours);
-- 0

SELECT COUNT(*) AS ne_all_safe
FROM guides WHERE guide_id <> ALL (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);
-- 1

SELECT full_name FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings ORDER BY booked_at DESC LIMIT 3);
-- ERROR 1235 (42000): This version of MySQL doesn't yet support
--   'LIMIT & IN/ALL/ANY/SOME subquery'

-- সমাধান: LIMIT কে একটা Derived Table এর ভেতরে ঢুকিয়ে দিন
SELECT full_name FROM customers
WHERE customer_id IN (
  SELECT customer_id
  FROM (SELECT customer_id FROM bookings ORDER BY booked_at DESC LIMIT 3) AS latest
)
ORDER BY customer_id;
-- Tanvir Ahmed, Sumaiya Islam, Shuvo Das

SELECT full_name FROM customers WHERE customer_id = ANY (ARRAY[1, 5, 15]);
-- ERROR 1064 (42000): ... near 'ARRAY[1, 5, 15])'

SELECT full_name FROM customers WHERE customer_id IN (1, 5, 15);
-- Rahim Uddin, Sabbir Hossain, Imran Kabir`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভিডিও দেখতে দেখতে",
          content: (
            <ContentParagraph>
              ভিডিওতে NOT IN দেখলে থেমে একবার জিজ্ঞেস করুন, তালিকার Column টা NULL নিতে পারে কি না। MySQL এ উত্তর দেখতে{" "}
              <code className={CODE}>DESCRIBE tours;</code> লিখুন, Null Column এ YES থাকলে সাবধান। আর Derived Table দিয়ে LIMIT এর
              সমাধানটা মনে রাখুন, Derived Table এর পুরো গল্প এই মডিউলের Lesson 04 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ তিনটা Screen, তিনটা তালিকা</SectionTitle>,
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
                ফারুক সাহেবের তিনটা চাওয়া শেষ পর্যন্ত Island Tours এর Admin Panel এ তিনটা Screen হলো। প্রতিটার পেছনে এই লেসনের
                একটা করে শিক্ষা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Guide Planning:</strong> খালি Guide এর তালিকা। তানিমের প্রথম লেখায় এখানে শূন্য দেখাত। এখন Query টা NOT
                  EXISTS দিয়ে লেখা, যাতে কাল কেউ Guide ছাড়া নতুন ট্যুর যোগ করলেও তালিকা খালি না হয়।
                </ListItem>
                <ListItem>
                  <strong>Premium Brochure:</strong> Sylhet এর সব ট্যুরের চেয়ে দামি, চালু ট্যুর। ALL এর সাথে একটা EXISTS পাহারাদার,
                  যাতে কোনোদিন Sylhet এর সব ট্যুর বন্ধ হয়ে গেলে Brochure এ পুরো Catalogue ঢুকে না পড়ে।
                </ListItem>
                <ListItem>
                  <strong>Support Lookup:</strong> কর্মী কয়েকটা Booking নম্বর দেন, Screen সবগুলোর অবস্থা দেখায়। App পুরো তালিকা
                  একটা Array Parameter এ পাঠায়: <code className={CODE}>{"booking_id = ANY ($1)"}</code>। নিচের বক্সে একই কাজ Array
                  সরাসরি লিখে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিনটা Screen এর Query"
              query={`-- Guide Planning: এই মৌসুমে খালি Guide
SELECT g.full_name, g.language
FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);

-- Premium Brochure: Sylhet এর সব ট্যুরের চেয়ে দামি, চালু ট্যুর
SELECT title, price_bdt
FROM tours
WHERE is_active
  AND price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 6)
  AND EXISTS (SELECT 1 FROM tours WHERE destination_id = 6)
ORDER BY price_bdt DESC;

-- Support Lookup: কয়েকটা Booking একসাথে
SELECT b.booking_id, c.full_name, b.status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
WHERE b.booking_id = ANY (ARRAY[13, 14, 15])
ORDER BY b.booking_id;`}
              caption="Guide Planning: Nazmul Karim, Bangla। Premium Brochure: ৬টা ট্যুর, Sundarbans Mangrove Cruise (18000) থেকে Cox's Bazar Beach Weekend (8500)। Saint Martin Luxury Stay দামে সবার উপরে, কিন্তু বন্ধ, তাই নেই। Support Lookup: Booking 13 Nusrat Jahan confirmed, 14 Kamal Hasan pending, 15 Shuvo Das confirmed।"
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
                  ইংরেজিভাষী Guide দের জন্য একটা প্রশিক্ষণ হবে, আর ফারুক সাহেব জানতে চান কোন পুরনো ক্রেতারা এখনো কখনো তাঁদের সাথে
                  ঘোরেননি। যাঁরা অন্তত একবার বুক করেছেন, কিন্তু কখনো ইংরেজিভাষী Guide এর কোনো ট্যুর বুক করেননি, তাঁদের{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>city</code> দেখান, নাম অনুযায়ী সাজিয়ে। IN আর NOT
                  IN দিয়ে লিখুন, আর ভাবুন আপনার NOT IN এর তালিকায় NULL আসতে পারে কি না।
                </>
              }
              hint={
                <>
                  দুটো শর্ত: <code className={CODE}>{"customer_id IN (SELECT customer_id FROM bookings)"}</code>, আর{" "}
                  <code className={CODE}>customer_id NOT IN</code> একটা তালিকা, যেটা bookings, departures আর tours জোড়া দিয়ে
                  বানায় সেই customer_id গুলো, যাঁদের ট্যুরের guide_id ইংরেজিভাষী Guide দের তালিকায় আছে। তালিকাটা bookings.customer_id
                  থেকে আসে, যেটা NOT NULL।
                </>
              }
              solution={`SELECT full_name, city
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings)
  AND customer_id NOT IN (
    SELECT b.customer_id
    FROM bookings b
    JOIN departures d ON d.departure_id = b.departure_id
    JOIN tours t ON t.tour_id = d.tour_id
    WHERE t.guide_id IN (SELECT guide_id FROM guides WHERE language = 'English')
  )
ORDER BY full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>NOT IN চলার সময় ভেতরে যা ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তানিমের Query, <code className={CODE}>{"SELECT full_name FROM guides WHERE guide_id NOT IN (SELECT guide_id FROM tours)"}</code>,
              ধাপে ধাপে। এই পথটা মুখে বলতে পারলে NULL ফাঁদ আর কখনো রহস্য থাকবে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "ভেতরের Query একবার চলে",
              description:
                "SELECT guide_id FROM tours নয়টা মান দেয়: 1, 2, 3, 1, 4, 2, NULL, 4, 3। এতে বাইরের Table এর কোনো উল্লেখ নেই, তাই এটা একবারই চলে।",
            },
            {
              title: "তালিকাটা গুছিয়ে রাখা হয়",
              description:
                "PostgreSQL তালিকাটা দ্রুত খোঁজার মতো করে সাজায়। EXPLAIN এ এটা দেখা যায় hashed SubPlan হিসেবে। সাথে মনে রাখে, তালিকায় একটা NULL আছে।",
            },
            {
              title: "বাইরের প্রতিটা Row এর জন্য খোঁজ",
              description:
                "guides এর পাঁচটা Row এক এক করে আসে। প্রতিটার guide_id তালিকায় খোঁজা হয়।",
            },
            {
              title: "মিল পেলে FALSE",
              description:
                "Jamal (1), Shirin (2), Rubel (3), Ayesha (4) তালিকায় আছেন। তাঁদের জন্য NOT IN এর উত্তর FALSE, বাদ। এটা ঠিকই আছে।",
            },
            {
              title: "মিল না পেলে, NULL দেখে সিদ্ধান্ত",
              description:
                "Nazmul (5) তালিকার কোনো আসল নম্বরের সমান না। তালিকায় NULL না থাকলে উত্তর হতো TRUE। কিন্তু NULL আছে, তাই উত্তর অজানা।",
            },
            {
              title: "WHERE শুধু TRUE রাখে",
              description:
                "চারটা FALSE আর একটা অজানা, একটাও TRUE না। ফলাফল শূন্য Row, কোনো Error ছাড়া। সমাধান: তালিকা থেকে NULL ছাঁকা, নয়তো NOT EXISTS।",
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
          headers: ["ভুল", "যা ঘটে", "ঠিক করার উপায়"],
          rows: [
            [
              "NULL নিতে পারে এমন Column দিয়ে NOT IN",
              "তালিকায় একটা NULL এলেই শূন্য Row, Error ছাড়া",
              "NOT EXISTS, নয়তো Subquery তে WHERE col IS NOT NULL",
            ],
            [
              "IN আর NOT IN দিয়ে দুই ভাগ করে ধরে নেওয়া সব Row এসেছে",
              "বাঁ দিকে NULL থাকা Row কোনো ভাগেই পড়ে না, যোগফল মেলে না",
              "একটা ভাগে OR col IS NULL, আর যোগফল মিলিয়ে দেখা",
            ],
            [
              "একাধিক মান দেওয়া Subquery এর সাথে =",
              "ERROR 21000: more than one row returned by a subquery",
              "= ANY বা IN",
            ],
            [
              "IN এর Subquery তে দুটো Column",
              "subquery has too many columns (MySQL এ ERROR 1241)",
              "একটা Column, নয়তো দুই দিকেই Row Constructor (a, b)",
            ],
            [
              "খালি হতে পারে এমন তালিকার বিরুদ্ধে > ALL",
              "তালিকা খালি হলে সব Row আসে",
              "AND EXISTS (...) পাহারাদার",
            ],
            [
              "ALL কে max দিয়ে বদলে ধরে নেওয়া উত্তর একই",
              "খালি তালিকা আর NULL এ উত্তর আলাদা",
              "দুই কোণা জেনে বুঝে যেটা চান সেটা লিখুন",
            ],
            [
              "<> ALL কে NOT IN থেকে নিরাপদ ভাবা",
              "একই ফাঁদ, কারণ দুটো একই জিনিস",
              "NOT IN এর মতোই NULL ছাঁকা বা NOT EXISTS",
            ],
            [
              "= ANY (SELECT array_agg(...))",
              "operator does not exist: integer = integer[]",
              "IN (SELECT ...), নয়তো Subquery টা ::int[] এ Cast",
            ],
            [
              "MySQL এ IN (SELECT ... LIMIT n)",
              "ERROR 1235",
              "LIMIT কে Derived Table এর ভেতরে",
            ],
            [
              "শুধু ছাঁকনির কাজে JOIN, তারপর DISTINCT",
              "কাজ চলে, কিন্তু প্রশ্নটা লুকিয়ে যায় আর পুনরাবৃত্তি ঢাকা পড়ে",
              "অন্য Table এর Column না লাগলে IN বা EXISTS",
            ],
          ],
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
                    href="https://www.postgresql.org/docs/current/functions-subquery.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Subquery Expressions
                  </a>
                  : IN, NOT IN, ANY, SOME আর ALL এর আনুষ্ঠানিক নিয়ম। NOT IN যে {"<>"} ALL এর সমান, আর ALL খালি তালিকায় TRUE, দুটোই
                  এখানে লেখা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-comparisons.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Row and Array Comparisons
                  </a>
                  : হাতে লেখা তালিকার IN, Array এর বিরুদ্ধে ANY আর ALL, আর Row Constructor এর তুলনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/arrays.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Arrays
                  </a>
                  : Array লেখার দুই চেহারা, আর Array এর ভেতরে খোঁজা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/any-in-some-subqueries.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Subqueries with ANY, IN, or SOME
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/all-subqueries.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Subqueries with ALL
                  </a>
                  : ALL এর নিয়ম, খালি তালিকাসহ।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/subquery-restrictions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Restrictions on Subqueries
                  </a>
                  : ভেতরে LIMIT এর ERROR 1235, আর Row তুলনা কেন শুধু IN এ চলে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Vacuous_truth"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Vacuous truth
                  </a>
                  : খালি তালিকায় &ldquo;সবাই&rdquo; কেন সত্য, যুক্তিবিদ্যার ভাষায়।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Subquery এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানে IN আর NOT IN দেখলে এই লেসনের NULL ফাঁদটা মিলিয়ে নেবেন।
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
                  <strong>IN (Subquery)</strong>: ভেতরের Query একবার চলে, একটা Column এর তালিকা বানায়, আর তালিকাটা একটা সেট। বাইরের
                  প্রতিটা Row বড়জোর একবার আসে: JOIN এ ১৭, IN এ ১২।
                </ListItem>
                <ListItem>
                  অন্য Table এর Column দেখাতে হলে JOIN, শুধু ছাঁকতে হলে IN বা EXISTS।
                </ListItem>
                <ListItem>
                  <strong>NOT IN</strong> একটা AND এর শিকল। তালিকায় একটা NULL থাকলে উত্তর হয় FALSE নয়তো অজানা, কখনো TRUE না,
                  তাই শূন্য Row, Error ছাড়া। Ratargul এর NULL guide_id Nazmul Karim কে গায়েব করে দিয়েছিল।
                </ListItem>
                <ListItem>
                  বাঁ দিকে NULL থাকলে IN আর NOT IN দুটোই অজানা, তাই দুই ভাগ মিলে সব Row হয় না: চার আর চার আট, ট্যুর নয়।
                </ListItem>
                <ListItem>
                  নিরাপদ &ldquo;নেই কি&rdquo;: NOT EXISTS, Subquery তে IS NOT NULL, অথবা LEFT JOIN আর Primary Key IS NULL। আগে দেখুন
                  Column NULL নিতে পারে কি না।
                </ListItem>
                <ListItem>
                  <strong>ANY</strong> অন্তত একটার সাথে মিললেই সত্য, SOME একই। <code className={CODE}>= ANY</code> হলো IN।{" "}
                  <strong>ALL</strong> প্রত্যেকটার সাথে মিলতে হবে, আর <code className={CODE}>{"<> ALL"}</code> হলো NOT IN।
                </ListItem>
                <ListItem>
                  খালি তালিকায় ALL TRUE, ANY FALSE, max NULL। Kuakata এর বিরুদ্ধে {">"} ALL নয়টা ট্যুরই দেয়, তাই দরকারে EXISTS পাহারাদার।
                </ListItem>
                <ListItem>
                  PostgreSQL এ <code className={CODE}>{"= ANY ($1)"}</code> দিয়ে পুরো তালিকা একটা Array Parameter এ। MySQL এ Array নেই,
                  আর IN এর ভেতরে LIMIT চলে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রায় সব Subquery ছিল নিজের মধ্যে সম্পূর্ণ: বাইরের Row এর দিকে না তাকিয়েই একটা তালিকা বানিয়ে দিত।
                কিন্তু অনেক প্রশ্নে ভেতরের Query কে প্রতিটা বাইরের Row এর জন্য আলাদা করে ভাবতে হয়: এই Customer এর নিজের গড়ের
                চেয়ে বড় Booking কোনগুলো, এই ট্যুরের প্রতিটা Departure কি ভরা। এমন Subquery বাইরের Row কে দেখে, আর তার নাম
                Correlated Subquery, পরের লেসন{" "}
                <Link href="/sql/topic/correlated-subqueries" className={LINK}>
                  Correlated Subqueries
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
      ["IN (Subquery)", "ভেতরের Query একটা তালিকা বানায়, বাইরের Row তাতে আছে কি", "confirmed করেছেন ১২ জন"],
      ["Uncorrelated Subquery", "বাইরের Row দেখে না, একবার চলে", "SELECT customer_id FROM bookings WHERE ..."],
      ["IN বনাম JOIN", "IN প্রতিটা Row একবার, JOIN প্রতিটা মিলে একবার", "১২ বনাম ১৭"],
      ["এক Column এর নিয়ম", "IN এর Subquery একটা Column দেয়", "দুটো দিলে subquery has too many columns"],
      ["NOT IN", "x <> প্রতিটা মান, AND দিয়ে জোড়া", "Booking ছাড়া Customer: Imran Kabir"],
      ["NULL ফাঁদ, ভেতরে", "তালিকায় NULL থাকলে কখনো TRUE না", "guides NOT IN tours: ০ Row"],
      ["NULL ফাঁদ, বাইরে", "বাঁ দিক NULL হলে IN আর NOT IN দুটোই অজানা", "চার আর চার, ট্যুর নয়"],
      ["নিরাপদ Anti Join", "NOT EXISTS, IS NOT NULL ছাঁকা, LEFT JOIN", "তিনটাই Nazmul Karim"],
      ["ANY / SOME", "অন্তত একটার সাথে তুলনা সত্য", "> ANY Sylhet: ৮টা ট্যুর"],
      ["ALL", "প্রত্যেকটার সাথে তুলনা সত্য", "> ALL Sylhet: ৭টা ট্যুর"],
      ["<> ALL", "NOT IN এর অন্য নাম, একই ফাঁদ", "০ বনাম ১"],
      ["খালি তালিকা", "ALL TRUE, ANY FALSE, max NULL", "Kuakata: ৯, ০, ০"],
      ["= ANY (Array)", "PostgreSQL এ পুরো তালিকা একটা মানে", "Booking 13, 14, 15 এর Payment"],
      ["MySQL", "Subquery এর রূপ সব চলে, Array আর ভেতরে LIMIT না", "ERROR 1235, ERROR 1064"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "customers WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed') ১২টা Row দেয়, অথচ confirmed Booking ১৭টা। কেন?",
        options: [
          {
            key: "A",
            text: "IN কিছু confirmed Booking ভুল করে বাদ দেয়",
            isCorrect: false,
            explanation: "কিছু বাদ পড়েনি। ১৭টা Booking ১২ জন Customer এর, কারণ কয়েকজনের দুটো করে confirmed Booking।",
          },
          {
            key: "B",
            text: "IN এর কাছে তালিকা একটা সেট, তাই প্রতিটা Customer বড়জোর একবার আসেন",
            isCorrect: true,
            explanation: "ঠিক। তালিকায় একটা নম্বর কতবার আছে সেটা IN এর কাছে অর্থহীন। প্রতিটা Customer এর জন্য প্রশ্ন একটাই: আছেন কি না।",
          },
          {
            key: "C",
            text: "Subquery শুধু প্রথম ১২টা Row দেয়",
            isCorrect: false,
            explanation: "Subquery সব ১৭টা Row দেয়, প্রথম বক্সেই সেটা দেখেছেন। সংখ্যা কমে IN এর সেটের মতো আচরণের কারণে।",
          },
          {
            key: "D",
            text: "PostgreSQL নিজে থেকে DISTINCT বসিয়ে দেয় বলে",
            isCorrect: false,
            explanation: "ফলাফলের উপর কোনো DISTINCT বসে না। বাইরের Query এর প্রতিটা Row একবারই দেখা হয়, পুনরাবৃত্তি তৈরিই হয় না।",
          },
        ],
      },
      {
        id: 2,
        text: "SELECT 5 NOT IN (1, 2, 3, 4, NULL) এর উত্তর কী?",
        options: [
          {
            key: "A",
            text: "TRUE, কারণ 5 তালিকার কোনো সংখ্যা না",
            isCorrect: false,
            explanation: "আসল চারটা সংখ্যার সাথে তুলনা TRUE ঠিকই, কিন্তু NULL এর সাথে তুলনা অজানা, আর TRUE AND অজানা মানে অজানা।",
          },
          {
            key: "B",
            text: "FALSE",
            isCorrect: false,
            explanation: "FALSE হতো যদি 5 তালিকার কোনো আসল মানের সমান হতো। 1 NOT IN (...) হলে FALSE আসত।",
          },
          {
            key: "C",
            text: "NULL, মানে অজানা",
            isCorrect: true,
            explanation: "ঠিক। NULL হয়তো 5, হয়তো না, তাই 5 যে তালিকায় নেই সেটা প্রমাণ করা যায় না। বক্সে with_null এর ঘরটা ফাঁকা দেখেছেন।",
          },
          {
            key: "D",
            text: "Error, কারণ তালিকায় NULL লেখা যায় না",
            isCorrect: false,
            explanation: "NULL লেখা যায়, কোনো Error আসে না। ঠিক এই কারণেই ফাঁদটা চুপচাপ।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT full_name FROM guides WHERE guide_id NOT IN (SELECT guide_id FROM tours) শূন্য Row দেয়, যদিও Nazmul Karim এর কোনো ট্যুর নেই। আসল কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "Nazmul Karim এর guide_id NULL",
            isCorrect: false,
            explanation: "guides.guide_id কখনো NULL হয় না, এটা Primary Key। NULL টা তালিকার ভেতরে।",
          },
          {
            key: "B",
            text: "tours এর তালিকায় Ratargul Swamp Boat Day এর guide_id NULL",
            isCorrect: true,
            explanation: "ঠিক। তালিকার একটা NULL এর কারণে কোনো Guide এর জন্যই NOT IN কখনো TRUE হতে পারে না।",
          },
          {
            key: "C",
            text: "tours এ একই guide_id কয়েকবার আছে",
            isCorrect: false,
            explanation: "পুনরাবৃত্তিতে কিছু যায় আসে না, IN আর NOT IN তালিকাকে সেট হিসেবে দেখে।",
          },
          {
            key: "D",
            text: "Subquery এ ORDER BY নেই",
            isCorrect: false,
            explanation: "IN আর NOT IN এর জন্য তালিকার ক্রম অর্থহীন।",
          },
        ],
      },
      {
        id: 4,
        text: "আগের প্রশ্নের Query ঠিক করার জন্য কোনটা কাজ করবে না?",
        options: [
          {
            key: "A",
            text: "Subquery তে WHERE guide_id IS NOT NULL যোগ করা",
            isCorrect: false,
            explanation: "এটা কাজ করে। তালিকা থেকে NULL চলে গেলে NOT IN আবার স্বাভাবিক, Nazmul Karim ফিরে আসেন।",
          },
          {
            key: "B",
            text: "NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id) লেখা",
            isCorrect: false,
            explanation: "এটা কাজ করে, আর এটাই সবচেয়ে নিরাপদ অভ্যাস।",
          },
          {
            key: "C",
            text: "বাইরের WHERE এ OR guide_id IS NULL যোগ করা",
            isCorrect: true,
            explanation: "ঠিক, এটা কাজ করে না। এটা বাঁ দিকের NULL এর সমাধান, কিন্তু guides.guide_id কখনো NULL না। সমস্যা তালিকার ভেতরের NULL এ, সেটা থেকেই যায়, উত্তর এখনো শূন্য।",
          },
          {
            key: "D",
            text: "LEFT JOIN tours করে WHERE t.tour_id IS NULL লেখা",
            isCorrect: false,
            explanation: "এটা কাজ করে। ট্যুরের Primary Key ফাঁকা মানে সেই Guide এর কোনো ট্যুর নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "Kuakata তে একটাও ট্যুর নেই। WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7) কয়টা ট্যুর দেয়?",
        options: [
          {
            key: "A",
            text: "০টা, তুলনা করার কিছু নেই বলে",
            isCorrect: false,
            explanation: "এটা max দিয়ে লেখা রূপের উত্তর। ALL এর নিয়ম আলাদা।",
          },
          {
            key: "B",
            text: "৯টা, সব ট্যুর",
            isCorrect: true,
            explanation: "ঠিক। খালি তালিকার বিরুদ্ধে ALL TRUE, কারণ আপত্তি করার মতো একটা FALSE ও নেই। তাই দরকারে EXISTS পাহারাদার লাগে।",
          },
          {
            key: "C",
            text: "১টা, সবচেয়ে দামিটা",
            isCorrect: false,
            explanation: "সবচেয়ে দামিটা পাওয়া যায় >= ALL (SELECT price_bdt FROM tours) দিয়ে, খালি তালিকা দিয়ে না।",
          },
          {
            key: "D",
            text: "Error আসে",
            isCorrect: false,
            explanation: "খালি তালিকা বৈধ, কোনো Error হয় না। উত্তরটা চুপচাপ আসে, আর সেটাই বিপদ।",
          },
        ],
      },
      {
        id: 6,
        text: "তালিকা খালি না আর তাতে NULL নেই, এমন অবস্থায় x > ANY (তালিকা) কোনটার সমান?",
        options: [
          {
            key: "A",
            text: "x > তালিকার সবচেয়ে বড় মান",
            isCorrect: false,
            explanation: "এটা > ALL এর অর্থ: প্রত্যেকটার চেয়ে বেশি মানে সবচেয়ে বড়টার চেয়েও বেশি।",
          },
          {
            key: "B",
            text: "x > তালিকার সবচেয়ে ছোট মান",
            isCorrect: true,
            explanation: "ঠিক। অন্তত একটার চেয়ে বেশি হতে সবচেয়ে ছোটটার চেয়ে বেশি হলেই যথেষ্ট। Sylhet এর বেলায় 3500 এর চেয়ে বেশি, ৮টা ট্যুর।",
          },
          {
            key: "C",
            text: "x IN (তালিকা)",
            isCorrect: false,
            explanation: "IN হলো = ANY, > ANY না।",
          },
          {
            key: "D",
            text: "x <> ALL (তালিকা)",
            isCorrect: false,
            explanation: "<> ALL হলো NOT IN, সম্পূর্ণ আলাদা প্রশ্ন।",
          },
        ],
      },
      {
        id: 7,
        text: "guide_id <> ALL (SELECT guide_id FROM tours) সম্পর্কে কোনটা সত্য?",
        options: [
          {
            key: "A",
            text: "এটা NOT IN এর নিরাপদ বিকল্প, NULL এ ঝামেলা হয় না",
            isCorrect: false,
            explanation: "নাম আলাদা, কিন্তু জিনিস একই। বক্সে দেখেছেন এটাও শূন্য Row দেয়।",
          },
          {
            key: "B",
            text: "এটা NOT IN এর হুবহু সমান, তাই একই NULL ফাঁদ",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL এর Docs সরাসরি বলে NOT IN আর <> ALL এক। সমাধানও একই: NULL ছাঁকা বা NOT EXISTS।",
          },
          {
            key: "C",
            text: "এটা IN এর সমান",
            isCorrect: false,
            explanation: "IN হলো = ANY। <> ALL উল্টো প্রশ্ন।",
          },
          {
            key: "D",
            text: "এটা শুধু MySQL এ চলে",
            isCorrect: false,
            explanation: "PostgreSQL আর MySQL দুই জায়গাতেই চলে, আর দুই জায়গাতেই একই ফাঁদ।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ WHERE customer_id IN (SELECT customer_id FROM bookings ORDER BY booked_at DESC LIMIT 3) চালালে কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর মতোই তিনজন আসে",
            isCorrect: false,
            explanation: "PostgreSQL এ আসে, MySQL এ না। MySQL এই রূপের ভেতরে LIMIT মানে না।",
          },
          {
            key: "B",
            text: "LIMIT চুপচাপ উপেক্ষা হয়, সবাই আসে",
            isCorrect: false,
            explanation: "MySQL চুপচাপ না, স্পষ্ট Error দেয়।",
          },
          {
            key: "C",
            text: "ERROR 1235, আর সমাধান হলো LIMIT সহ অংশটাকে একটা Derived Table এর ভেতরে রাখা",
            isCorrect: true,
            explanation: "ঠিক। This version of MySQL doesn't yet support 'LIMIT & IN/ALL/ANY/SOME subquery'। ভেতরে একটা Derived Table বানালে চলে, তিনজন আসেন।",
          },
          {
            key: "D",
            text: "ERROR 1241, কারণ Subquery তে Column বেশি",
            isCorrect: false,
            explanation: "1241 আসে দুটো Column দিলে। এখানে Column একটাই, সমস্যা LIMIT এ।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর তালিকা যাচাইয়ের ফাইল",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুই লেখা, এক উত্তর:</strong> confirmed করেছেন এমন Customer এর তালিকা IN দিয়ে আর EXISTS দিয়ে লিখুন। দুটোর Row
        সংখ্যা মেলান, তারপর একই প্রশ্ন JOIN দিয়ে লিখে দেখান কেন সেখানে সংখ্যা বেশি। তিন লাইনে লিখুন, কোনটা কখন লিখবেন।
      </span>,
      <span key="2">
        <strong>ফাঁদটা নিজে বানান:</strong> guides আর tours এ NOT IN এর শূন্য Row বের করুন। তারপর information_schema থেকে দেখান
        কোন Column টা দায়ী। শেষে তিনভাবে ঠিক করুন, তিনটার উত্তর পাশাপাশি রাখুন।
      </span>,
      <span key="3">
        <strong>দুই ভাগের হিসাব:</strong> ট্যুরগুলোকে ইংরেজিভাষী Guide আর বাকি, এই দুই ভাগে গুনুন। যোগফল কেন নয় হয় না সেটা দেখান,
        তারপর এমনভাবে লিখুন যাতে যোগফল মেলে। এক অনুচ্ছেদে লিখুন, Report এ যোগফল মিলিয়ে দেখার অভ্যাস কেন জরুরি।
      </span>,
      <span key="4">
        <strong>ANY, ALL আর খালি তালিকা:</strong> Sylhet, Cox&apos;s Bazar আর Kuakata, এই তিন Destination এর বিরুদ্ধে {"> ANY"} আর{" "}
        {"> ALL"} দিয়ে Row গুনুন, ছয়টা সংখ্যার একটা ছোট টেবিল বানান। Kuakata এর ঘরগুলোর পাশে লিখুন কেন এমন, আর পাহারাদার EXISTS
        বসিয়ে আবার গুনুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু MySQL এর ভিডিও দেখে NOT IN শিখেছেন। Ratargul আর Nazmul Karim এর উদাহরণ
        দিয়ে তাঁকে ছয় লাইনে বোঝান, NOT IN কখন চুপচাপ খালি উত্তর দেয় আর তিনি কী লিখবেন।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা Query, তিনটা Row সংখ্যা আর তিন লাইনের সিদ্ধান্ত</span>,
      <span key="d2">ফাঁদের Query, information_schema এর ফলাফল আর তিনটা সমাধান</span>,
      <span key="d3">দুই ভাগের দুটো লেখা, মেলা আর না মেলা যোগফল, আর এক অনুচ্ছেদ</span>,
      <span key="d4">ছয় সংখ্যার টেবিল, ব্যাখ্যা আর পাহারাদারসহ নতুন সংখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ তালিকা ধরে প্রশ্ন",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "IN আর তার তালিকা",
        description:
          "প্রথম ফাইলের তিনটা Query চালান: ভেতরের Query এর ১৭টা Row, হাতে লেখা তালিকার ১২ জন, আর Subquery এর ১২ জন। শেষ দুটোর নাম একই কিনা মিলিয়ে নিন।",
      },
      {
        title: "IN, JOIN আর শিকল",
        description:
          "দ্বিতীয় ফাইলে JOIN এর ১৭ আর IN এর ১২ পাশাপাশি, তারপর চার স্তরের IN শিকলে Chattogram এর ১১ জন। কারা বাদ পড়লেন, নিজে খুঁজে বের করুন।",
      },
      {
        title: "ফাঁদ ধরা",
        description:
          "তৃতীয় ফাইলে NOT IN এর শূন্য Row, তালিকার ৯, ৮ আর ১, আর হাতে লেখা তালিকায় t, ফাঁকা আর f। psql এ ফাঁকা ঘরটাই NULL।",
      },
      {
        title: "তিন সমাধান",
        description:
          "চতুর্থ ফাইলের তিনটা Query, প্রতিটা Nazmul Karim। তারপর \\d tours চালিয়ে দেখুন guide_id এর পাশে not null নেই।",
      },
      {
        title: "ANY আর ALL",
        description:
          "পঞ্চম ফাইলে > ANY এর ৮, > ALL এর ৭, সবচেয়ে দামি আর সবচেয়ে সস্তা ট্যুর, আর <> ALL এর ০ আর ১।",
      },
      {
        title: "খালি তালিকা আর Array",
        description:
          "ষষ্ঠ ফাইলে Kuakata এর ৯, ০, ০, পাহারাদারের ০ Row, আর Array দিয়ে তিনটা Payment। সংখ্যাগুলো মন্তব্যের সাথে মেলান।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-in-and-its-list.sql",
        code: `SELECT customer_id FROM bookings WHERE status = 'confirmed' ORDER BY customer_id;
-- (17 rows)

SELECT full_name FROM customers
WHERE customer_id IN (1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14)
ORDER BY customer_id;
-- (12 rows)

SELECT full_name FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed')
ORDER BY customer_id;
-- (12 rows): Rahim Uddin ... Lamia Haque`,
      },
      {
        language: "sql",
        filename: "02-in-vs-join.sql",
        code: `SELECT count(*) AS join_rows
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.status = 'confirmed';
-- 17

SELECT count(*) AS in_rows
FROM customers
WHERE customer_id IN (SELECT customer_id FROM bookings WHERE status = 'confirmed');
-- 12

SELECT full_name FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM bookings WHERE departure_id IN (
    SELECT departure_id FROM departures WHERE tour_id IN (
      SELECT tour_id FROM tours WHERE destination_id IN (
        SELECT destination_id FROM destinations WHERE region = 'Chattogram'))))
ORDER BY customer_id;
-- (11 rows)`,
      },
      {
        language: "sql",
        filename: "03-the-trap.sql",
        code: `SELECT full_name FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours);
-- (0 rows)

SELECT count(*) AS listed, count(guide_id) AS real_ids,
       count(*) - count(guide_id) AS nulls
FROM tours;
-- 9 | 8 | 1

SELECT 5 NOT IN (1, 2, 3, 4)       AS without_null,
       5 NOT IN (1, 2, 3, 4, NULL) AS with_null,
       1 NOT IN (1, 2, 3, 4, NULL) AS one_with_null;
-- t |  | f`,
      },
      {
        language: "sql",
        filename: "04-three-fixes.sql",
        code: `SELECT full_name FROM guides
WHERE guide_id NOT IN (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);
-- Nazmul Karim

SELECT g.full_name FROM guides g
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.guide_id = g.guide_id);
-- Nazmul Karim

SELECT g.full_name FROM guides g
LEFT JOIN tours t ON t.guide_id = g.guide_id
WHERE t.tour_id IS NULL;
-- Nazmul Karim

\\d tours`,
      },
      {
        language: "sql",
        filename: "05-any-and-all.sql",
        code: `SELECT count(*) AS gt_any FROM tours
WHERE price_bdt > ANY (SELECT price_bdt FROM tours WHERE destination_id = 6);
-- 8

SELECT count(*) AS gt_all FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 6);
-- 7

SELECT title, price_bdt FROM tours WHERE price_bdt >= ALL (SELECT price_bdt FROM tours);
-- Saint Martin Luxury Stay | 32000.00

SELECT title, price_bdt FROM tours WHERE price_bdt <= ALL (SELECT price_bdt FROM tours);
-- Ratargul Swamp Boat Day | 3500.00

SELECT count(*) FROM guides WHERE guide_id <> ALL (SELECT guide_id FROM tours);
-- 0
SELECT count(*) FROM guides
WHERE guide_id <> ALL (SELECT guide_id FROM tours WHERE guide_id IS NOT NULL);
-- 1`,
      },
      {
        language: "sql",
        filename: "06-empty-and-arrays.sql",
        code: `SELECT count(*) AS above_all FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7);
-- 9
SELECT count(*) AS above_any FROM tours
WHERE price_bdt > ANY (SELECT price_bdt FROM tours WHERE destination_id = 7);
-- 0
SELECT count(*) AS above_max FROM tours
WHERE price_bdt > (SELECT max(price_bdt) FROM tours WHERE destination_id = 7);
-- 0

SELECT title FROM tours
WHERE price_bdt > ALL (SELECT price_bdt FROM tours WHERE destination_id = 7)
  AND EXISTS (SELECT 1 FROM tours WHERE destination_id = 7);
-- (0 rows)

SELECT payment_id, booking_id, method, status
FROM payments
WHERE booking_id = ANY (ARRAY[13, 14, 15])
ORDER BY payment_id;
-- 12 | 13 | bkash | paid
-- 13 | 14 | bkash | failed
-- 14 | 15 | card  | paid`,
      },
    ],
    tip: (
      <>
        যেকোনো NOT IN লেখার আগে একটা অভ্যাস করুন: <code className={CODE}>\d table_name</code> দিয়ে দেখে নিন তালিকার Column এর
        পাশে not null আছে কি না। না থাকলে NOT EXISTS লিখুন। পাঁচ সেকেন্ডের এই দেখা অনেক মাসের চুপচাপ ভুল বাঁচায়।
      </>
    ),
  },
};
