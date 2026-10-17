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
  CorrelatedStepLab,
  RewriteLab,
  ScopeTrapLab,
} from "../../../components/course/topics/subqueries/corr-animations";
import {
  ForAllDiagram,
  PerRowDiagram,
  ScopeDiagram,
  TwoKindsSplit,
} from "../../../components/course/topics/subqueries/corr-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

export const correlatedSubqueriesContent: TopicData = {
  id: "correlated-subqueries",
  introduction: {
    badge: "MODULE 07 · LESSON 03",
    title: <SectionTitle>প্রতিটা Row এর জন্য নিজের প্রশ্ন: Correlated Subquery</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনের Subquery গুলো ছিল একা একা কাজ করা মানুষের মতো। ভেতরের Query একবার চলত, একটা উত্তর
          দিত, আর বাইরের Query সেই এক উত্তর দিয়ে নিজের সব Row এর কাজ সারত। সবার গড় একটাই, তাই একবার হিসাব
          করলেই চলে।
        </ContentParagraph>
        <ContentParagraph>
          কিন্তু বাস্তবের অনেক প্রশ্নে তুলনার মাপকাঠি প্রতিটা Row এর জন্য আলাদা। এই Booking টা কি সেই Customer এর
          নিজের স্বাভাবিকের চেয়ে বড়? এই ট্যুরের দাম কি তার নিজের Destination এর অন্য ট্যুরগুলোর চেয়ে বেশি? এই
          Customer এর শেষ Booking কবে? প্রতিটা প্রশ্নের উত্তর নির্ভর করে কোন Row এর কথা হচ্ছে তার উপর। এমন প্রশ্নের
          জন্য ভেতরের Query কে বাইরের Row এর দিকে তাকাতে হয়। যে Subquery বাইরের Row দেখে, তার নাম Correlated
          Subquery।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Correlated Subquery কীভাবে ভাবতে হয়, প্রতিটা Row এর জন্য একবার চলার মডেলটা কী,
          SELECT আর WHERE এ এটা কী কী কাজ করে, প্রতিটা দলের সবশেষ Row কীভাবে বের করতে হয়, &ldquo;সবগুলো&rdquo;
          ধরনের প্রশ্ন কীভাবে লিখতে হয়, কোন নামের ভুলে কোনো Error ছাড়াই ভুল উত্তর আসে, আর কখন এটাকে Join বা Window
          Function দিয়ে আবার লেখা ভালো। প্রতিটা কথা দেখবেন Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমাকে একবার জিজ্ঞেস করলে হবে না। আপনার প্রতিটা Row আমার কাছে আলাদা করে আসবে, আর প্রতিবার আমি শুধু সেই Row এর কথা মাথায় রেখে উত্তর খুঁজব।",
      author: "Correlated Subquery",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>সবার গড়, নাকি নিজের গড়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রবিবার সকালের বৈঠকে Island Tours এর Finance এর দায়িত্বে থাকা শারমিন আপা একটা অনুরোধ নিয়ে এলেন। তিনি
                এমন Booking গুলোর তালিকা চান, যেগুলো সেই Customer এর নিজের স্বাভাবিকের চেয়ে বড়। কারণটা সহজ। যে
                মানুষটা সবসময় দশ বারো হাজারের ট্যুর নেন, তিনি হঠাৎ পঞ্চাশ হাজারের Booking করলে Support টিম একটা ফোন
                করে ধন্যবাদ জানাবে, আর নিশ্চিত হবে সবকিছু ঠিক আছে। আর যিনি সবসময়ই বড় ট্যুর নেন, তাঁর আরেকটা বড় Booking
                আলাদা কিছু না।
              </ContentParagraph>
              <ContentParagraph>
                Developer তানিম Lesson 01 এ Scalar Subquery শিখেছেন। তিনি সাথে সাথে লিখলেন: যেসব Booking এর মোট সব
                Booking এর গড়ের চেয়ে বেশি। ভেতরের Query সব Booking এর গড় বের করে, 24679.17 টাকা, আর বাইরের Query সেই
                একটা সংখ্যার সাথে প্রতিটা Booking কে মেলায়। ফলাফল এল তেরোটা Row।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের প্রথম চেষ্টা: সবার গড়ের সাথে তুলনা"
              query={`SELECT b.booking_id, b.customer_id, b.total_bdt
FROM bookings b
WHERE b.total_bdt > (SELECT avg(total_bdt) FROM bookings)
ORDER BY b.booking_id;`}
              caption="তেরোটা Row। তালিকায় Booking 1 আছে, Rahim Uddin এর 25000 টাকা, অথচ Rahim সাহেবের নিজের তিনটা Booking এর গড় 26666.67, মানে এটা তাঁর জন্য বরং ছোট। আবার Priya Sharma এর Booking 20 (15600) তালিকায় নেই, অথচ সেটা তাঁর নিজের গড় 14800 এর চেয়ে বেশি। প্রশ্নের উত্তর ভুল, কারণ মাপকাঠিটা ভুল।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তানিমের Query তে SQL এর কোনো ভুল নেই। ভুলটা প্রশ্ন বোঝায়। শারমিন আপা সবার গড় চাননি, চেয়েছেন প্রতিটা
                Customer এর নিজের গড়। Rahim এর Booking এর পাশে Rahim এর গড়, Priya এর Booking এর পাশে Priya এর গড়।
                মানে তুলনার সংখ্যাটা প্রতিটা Row এর জন্য বদলায়। একবার চলা Subquery একটাই সংখ্যা দিতে পারে, তাই এই কাজ
                তার দ্বারা হবে না।
              </ContentParagraph>
              <ContentParagraph>
                দরকার এমন একটা ভেতরের Query, যেটা প্রতিবার জানে এখন কোন Booking এর কথা হচ্ছে, আর শুধু সেই Booking এর
                Customer এর গড় বের করে। এটাই এই লেসনের বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিজেকে একটা প্রশ্ন করুন",
          content: (
            <ContentParagraph>
              Subquery লেখার আগে জিজ্ঞেস করুন: তুলনার সংখ্যাটা কি সব Row এর জন্য একই, নাকি প্রতিটা Row এর জন্য আলাদা?
              একই হলে Lesson 01 এর সাধারণ Subquery। আলাদা হলে, যেমন &ldquo;তাঁর নিজের&rdquo;, &ldquo;সেই ট্যুরের&rdquo;,
              &ldquo;একই Destination এর&rdquo;, তখন এই লেসনের Correlated Subquery।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "two-kinds",
      subHeader: { index: "002", title: "Two Kinds of Subquery" },
      title: <SectionTitle>যে Subquery বাইরের দিকে তাকায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পরীক্ষার হলের কথা ভাবুন। প্রধান শিক্ষক পুরো ক্লাসের গড় নম্বর একবার হিসাব করে বোর্ডে লিখে দিলেন।
                এরপর প্রতিটা ছাত্রের খাতা দেখে বলা হলো, সে ক্লাসের গড়ের উপরে না নিচে। গড়টা একবারই হিসাব হয়েছে, সবার
                জন্য একই। এটা Lesson 01 এর Subquery।
              </ContentParagraph>
              <ContentParagraph>
                এবার অন্য একটা নিয়ম। প্রতিটা ছাত্রের এই পরীক্ষার নম্বর তুলনা হবে তার নিজের আগের সব পরীক্ষার গড়ের সাথে।
                এখন আর বোর্ডে একটা সংখ্যা লিখে কাজ হবে না। প্রতিটা খাতা হাতে নিয়ে শিক্ষককে সেই ছাত্রের পুরনো খাতাগুলো
                বের করতে হবে, তার গড় করতে হবে, তারপর তুলনা। প্রতিটা ছাত্রের জন্য আলাদা হিসাব। এটা Correlated Subquery।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Uncorrelated Subquery:</strong> ভেতরের Query বাইরের কোনো Column ব্যবহার করে না। তাকে আলাদা
                  করে কেটে নিয়ে চালালেও চলে, আর একই উত্তর দেয়। Database তাকে একবার চালিয়ে উত্তরটা রেখে দেয়।
                </ListItem>
                <ListItem>
                  <strong>Correlated Subquery:</strong> ভেতরের Query বাইরের Query এর কোনো Column ব্যবহার করে, যেমন{" "}
                  <code className={CODE}>b.customer_id</code>। বাইরের সেই Column কে বলে Outer Reference। তাকে আলাদা করে
                  কেটে নিয়ে চালালে Error আসে, কারণ <code className={CODE}>b</code> কে, সেটা ভেতরের Query একা জানে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoKindsSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শারমিন আপার প্রশ্নের সঠিক Query নিচে। একই Table দুইবার এসেছে, বাইরে <code className={CODE}>b</code> নামে,
              ভেতরে <code className={CODE}>b2</code> নামে। Module 06 এর Self Join এর মতোই, একই Table এর দুই ভূমিকার জন্য
              দুটো আলাদা Alias লাগে। ভেতরের শর্ত <code className={CODE}>b2.customer_id = b.customer_id</code> পড়ুন এভাবে:
              ভেতরের Booking গুলোর মধ্যে শুধু তারা, যারা বাইরের এই Booking এর একই Customer এর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সঠিক উত্তর: প্রতিটা Booking তার নিজের Customer এর গড়ের সাথে"
              query={`SELECT b.booking_id, b.customer_id, b.total_bdt
FROM bookings b
WHERE b.total_bdt > (SELECT avg(b2.total_bdt)
                     FROM bookings b2
                     WHERE b2.customer_id = b.customer_id)
ORDER BY b.booking_id;`}
              caption="আটটা Row। Booking 1 আর নেই, কারণ 25000 Rahim এর নিজের গড় 26666.67 এর নিচে। Booking 17 আছে, কারণ 36000 সেই গড়ের উপরে। Booking 20 এসেছে, কারণ Priya এর গড় 14800। যাঁদের একটাই Booking, তাঁরা কখনো আসেন না: নিজের গড় নিজের সমান, আর সমান মানে বড় না।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "per-row-model",
      subHeader: { index: "003", title: "The Per-row Model" },
      title: <SectionTitle>বোঝার মডেল: প্রতিটা Row এর জন্য একবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Correlated Subquery পড়ার সবচেয়ে সহজ উপায় হলো একটা ছোট মডেল মাথায় রাখা। মডেলটা তিন ধাপের, আর বাইরের
                প্রতিটা Row এর জন্য ধাপগুলো আবার ঘটে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক, বাইরের একটা Row নেওয়া।</strong> ধরুন customers এর প্রথম Row, Rahim Uddin, customer_id 1।
                </ListItem>
                <ListItem>
                  <strong>দুই, ভেতরের Query তে মান বসানো।</strong> ভেতরে যেখানে যেখানে{" "}
                  <code className={CODE}>c.customer_id</code> লেখা, সেখানে 1 বসে। ভেতরের Query এখন একটা সাধারণ Query:
                  bookings থেকে customer_id 1 এর Row গুলো।
                </ListItem>
                <ListItem>
                  <strong>তিন, ভেতরের উত্তর কাজে লাগানো।</strong> SELECT এ থাকলে উত্তরটা নতুন Column এর মান হয়, WHERE এ
                  থাকলে উত্তরটা দিয়ে ঠিক হয় Row টা থাকবে কি না। তারপর পরের Row, আবার প্রথম ধাপ থেকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                PostgreSQL এর Documentation এই কথাটাই নিজের ভাষায় বলে: Subquery বাইরের Query এর মানগুলো দেখতে পারে, আর
                Subquery এর প্রতিবার চলার সময় সেই মানগুলো স্থির সংখ্যার মতো আচরণ করে। মানে ভেতরের Query এর একেকবার চলার
                সময় <code className={CODE}>c.customer_id</code> একটা সাধারণ সংখ্যা, যেমন 1 বা 15।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PerRowDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মডেল আর আসল কাজ এক জিনিস না",
          content: (
            <ContentParagraph>
              প্রতিটা Row এর জন্য একবার চলার কথাটা বোঝার মডেল, প্রতিশ্রুতি না। ফলাফল সবসময় এই মডেলের সাথে হুবহু মিলবে।
              কিন্তু Database চাইলে কাজটা অন্যভাবে সারতে পারে, যেমন একবারে সব Customer এর হিসাব গুছিয়ে নিয়ে Join করা।
              কখন সে এটা করে আর কখন সত্যিই প্রতিটা Row এর জন্য চালায়, সেটা দেখবেন এই লেসনের How Fast Is It অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "watch-it-run",
      subHeader: { index: "004", title: "Watch It Run" },
      title: <SectionTitle>চোখের সামনে, একটা Row করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ তিনটা Correlated Subquery আছে। প্রথম দুটো SELECT এ, তৃতীয়টা WHERE এ, ঠিক উপরের শারমিন আপার
              প্রশ্ন। পরের Row চাপলে বাইরের একটা Row আসে, তার নম্বর ভেতরের Query তে বসে, আর ভেতরের Query যা ফেরত দেয়
              সেটা দেখা যায়। তৃতীয় Mode এ চব্বিশটা Booking এর প্রতিটা ধরে দেখুন কে টেকে আর কে বাদ পড়ে, আর শেষে গুনুন
              ফলাফলে কয়টা Row এল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CorrelatedStepLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab থেকে একটা জিনিস লক্ষ করুন। একই Customer এর জন্য ভেতরের Query বারবার একই উত্তর দেয়। Rahim এর তিনটা
              Booking এর প্রতিটার বেলায় তাঁর গড় 26666.67 আবার হিসাব হলো। মডেল অনুযায়ী এটা অপচয়, আর বড় Table এ এই অপচয়
              টের পাওয়া যায়। এর সমাধান কী, সেটা এই লেসনের শেষের দিকে Rewriting It অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "in-select",
      subHeader: { index: "005", title: "In SELECT" },
      title: <SectionTitle>SELECT এ: প্রতিটা Row এর পাশে একটা হিসাব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT এর তালিকায় বসানো Correlated Subquery প্রতিটা Row এর পাশে একটা নতুন Column বানায়, যার মান সেই Row
                এর জন্য আলাদা করে হিসাব করা। Admin Panel এর Customer তালিকার কথা ভাবুন: প্রতিটা নামের পাশে কয়টা Booking,
                শেষ Booking কবে। Module 06 এ এটা আপনি LEFT JOIN আর GROUP BY দিয়ে করতে শিখেছেন। Correlated Subquery দিয়ে
                একই কাজ হয় কোনো GROUP BY ছাড়া, আর প্রতিটা হিসাব নিজের বন্ধনীতে আলাদা থাকে বলে পড়তেও সহজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর পাশে Booking এর সংখ্যা আর শেষ Booking"
              query={`SELECT c.customer_id,
       c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings,
       (SELECT max(b.booked_at) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS last_booked
FROM customers c
ORDER BY c.customer_id;`}
              caption="পনেরোটা Row, প্রত্যেক Customer একবার। Rahim এর 3টা, শেষটা 2026-10-08। Imran Kabir এর Booking 0, আর last_booked খালি, মানে NULL। লক্ষ করুন, Imran হারাননি: SELECT এর Subquery কখনো বাইরের Row বাদ দেয় না, শুধু তার পাশে একটা মান বসায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুটো Subquery তেই একই Alias <code className={CODE}>b</code> লেখা হয়েছে, আর তাতে কোনো সমস্যা নেই। প্রতিটা
              Subquery এর নিজের ছোট জগৎ আছে, এক বন্ধনীর <code className={CODE}>b</code> আরেক বন্ধনী দেখে না। তবে বাইরের{" "}
              <code className={CODE}>c</code> সব বন্ধনী থেকেই দেখা যায়। এবার নিজে লিখুন।
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
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর তার কয়টা Departure আছে, সেই সংখ্যা,{" "}
                  <code className={CODE}>departures</code> নামে। নয়টা ট্যুরই আসবে, যে ট্যুরের Departure নেই তার পাশে 0।
                  Correlated Subquery দিয়ে লিখুন। Row এর ক্রম যেকোনো হতে পারে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>FROM tours t</code>, আর SELECT এ{" "}
                  <code className={CODE}>(SELECT count(*) FROM departures d WHERE d.tour_id = t.tour_id)</code>।
                </>
              }
              solution={`SELECT t.title,
       (SELECT count(*) FROM departures d
        WHERE d.tour_id = t.tour_id) AS departures
FROM tours t;`}
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
                  ধরে নিন আজ 1 November 2026। প্রতিটা ট্যুরের <code className={CODE}>title</code> আর আজ বা আজকের পরের
                  প্রথম Departure এর তারিখ, <code className={CODE}>next_start</code> নামে। নয়টা ট্যুরই আসবে, যার সামনে
                  কোনো Departure নেই তার পাশে NULL। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  ভেতরে <code className={CODE}>min(d.starts_on)</code>, আর WHERE এ দুটো শর্ত: একই ট্যুর, আর{" "}
                  <code className={CODE}>{"d.starts_on >= DATE '2026-11-01'"}</code>।
                </>
              }
              solution={`SELECT t.title,
       (SELECT min(d.starts_on)
        FROM departures d
        WHERE d.tour_id = t.tour_id
          AND d.starts_on >= DATE '2026-11-01') AS next_start
FROM tours t;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "zero-or-many",
      subHeader: { index: "006", title: "Zero or Many" },
      title: <SectionTitle>ভেতরে কিছু না এলে, আর বেশি এলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SELECT এ বসানো Correlated Subquery কে প্রতিটা Row এর জন্য ঠিক একটা মান দিতে হয়। Lesson 01 এ আপনি এর
                নিয়মগুলো শিখেছেন, কিন্তু Correlated এর বেলায় নিয়মগুলো আরও বেশি চোখে পড়ে, কারণ প্রতিটা Row এর জন্য ভেতরের
                উত্তর আলাদা, আর কোনো এক Row এর জন্য উত্তর না থাকা বা বেশি থাকা খুব সাধারণ ঘটনা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটাও Row না এলে:</strong> উত্তর NULL, কোনো Error না। Imran এর কোনো Booking নেই, তাই তাঁর শেষ
                  Booking, প্রথম Booking, গড় সবই NULL।
                </ListItem>
                <ListItem>
                  <strong>count এর বেলায় ব্যতিক্রম:</strong> count কোনো Row না পেলে 0 দেয়, কারণ Aggregate সবসময় একটা Row
                  ফেরত দেয়। Module 05 এর সেই নিয়ম এখানেও খাটে।
                </ListItem>
                <ListItem>
                  <strong>একটার বেশি Row এলে:</strong> Error। কোনো এক Row এর জন্যও যদি ভেতরের Query দুটো Row দেয়, পুরো
                  Query থেমে যায়। এর SQLSTATE 21000।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কিছুই না এলে NULL, count এর বেলায় 0"
              query={`SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings,
       (SELECT avg(b.total_bdt) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS avg_total,
       (SELECT min(b.booked_at) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS first_booked
FROM customers c
WHERE c.customer_id = 15;`}
              caption="Imran Kabir এর জন্য count 0, কিন্তু avg আর min খালি, মানে NULL। Report এ NULL এর বদলে 0 দেখাতে চাইলে Module 04 এর COALESCE: coalesce((SELECT sum(...) ...), 0)।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ইচ্ছা করে ভুল: ভেতর থেকে একাধিক Row"
              query={`SELECT c.full_name,
       (SELECT b.booking_id FROM bookings b
        WHERE b.customer_id = c.customer_id) AS booking
FROM customers c
ORDER BY c.customer_id;`}
              caption="ERROR: more than one row returned by a subquery used as an expression। প্রথম Customer Rahim এর তিনটা Booking, ভেতরের Query তিনটা Row ফেরত দিল, আর একটা ঘরে তিনটা মান বসানো যায় না। যাঁদের একটা Booking, তাঁদের বেলায় সমস্যা হতো না, তাই ছোট Test Data তে এই ভুল লুকিয়ে থাকতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঠিক করার দুটো পথ, আর দুটোর মানে আলাদা। প্রথম পথ, Aggregate: <code className={CODE}>max(b.booking_id)</code>{" "}
                বা <code className={CODE}>count(*)</code>, যেটা অনেক Row কে একটা মানে নামায়। দ্বিতীয় পথ, কোন Row টা
                চাই সেটা স্পষ্ট বলা: <code className={CODE}>ORDER BY b.booked_at DESC LIMIT 1</code>, মানে সবশেষটা। শুধু{" "}
                <code className={CODE}>LIMIT 1</code> লিখবেন না, তাহলে কোন Row আসবে সেটা Database এর মর্জি, Module 03 এর
                LIMIT লেসনে দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                ভেতরের Query একাধিক Column দিলেও Error, বার্তা <code className={CODE}>subquery must return only one column</code>।
                একটা Row এর পুরো তথ্য আনতে চাইলে প্রতিটা Column এর জন্য আলাদা Subquery লিখতে হয়, যেটা ক্লান্তিকর আর ধীর।
                সেই কাজের ভালো যন্ত্র Module 06 এর LATERAL।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ঠিক করা: সবশেষ Booking টা স্পষ্ট করে চাওয়া"
              query={`SELECT c.full_name,
       (SELECT b.booking_id
        FROM bookings b
        WHERE b.customer_id = c.customer_id
        ORDER BY b.booked_at DESC
        LIMIT 1) AS latest_booking
FROM customers c
ORDER BY c.customer_id;`}
              caption="পনেরোটা Row। Rahim এর সবশেষ Booking 17, Nusrat এর 13, Tanvir এর 22। Imran এর পাশে খালি, কারণ কোনো Row আসেনি আর তাই NULL।"
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
                  প্রতিটা Customer এর <code className={CODE}>full_name</code> আর তাঁর confirmed Booking গুলোর মোট টাকা,{" "}
                  <code className={CODE}>confirmed_spend</code> নামে। পনেরো জনই আসবেন। যাঁর কোনো confirmed Booking নেই,
                  তাঁর পাশে NULL না, 0। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  ভেতরে <code className={CODE}>sum(b.total_bdt)</code>, দুটো শর্তসহ: একই Customer, আর{" "}
                  <code className={CODE}>{"b.status = 'confirmed'"}</code>। পুরো Subquery টাকে{" "}
                  <code className={CODE}>coalesce(..., 0)</code> এর ভেতরে রাখুন।
                </>
              }
              solution={`SELECT c.full_name,
       coalesce((SELECT sum(b.total_bdt)
                 FROM bookings b
                 WHERE b.customer_id = c.customer_id
                   AND b.status = 'confirmed'), 0) AS confirmed_spend
FROM customers c;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "in-where",
      subHeader: { index: "007", title: "In WHERE" },
      title: <SectionTitle>WHERE এ: প্রতিটা Row তার নিজের দলের সাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WHERE এ বসানো Correlated Subquery প্রতিটা Row কে তার নিজের দলের একটা মাপকাঠির সাথে মেলায়, আর শর্ত সত্য
                হলে Row টা রাখে। শারমিন আপার প্রশ্নটা এর সবচেয়ে পরিচিত রূপ: প্রতিটা Booking কে সেই Customer এর নিজের গড়ের
                সাথে। Rahim আর Tanvir এর Booking গুলোর পাশে তাঁদের নিজেদের গড় বসিয়ে দেখলে ব্যাপারটা পরিষ্কার হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের গড়টা পাশে বসিয়ে দেখা"
              query={`SELECT b.booking_id,
       b.customer_id,
       b.total_bdt,
       round((SELECT avg(b2.total_bdt)
              FROM bookings b2
              WHERE b2.customer_id = b.customer_id), 2) AS own_avg
FROM bookings b
WHERE b.customer_id IN (1, 3)
ORDER BY b.booking_id;`}
              caption="Rahim (customer 1) এর তিনটা Booking: 25000, 19000, 36000, আর তিনটার পাশেই একই গড় 26666.67। শুধু 36000 গড়ের উপরে। Tanvir (customer 3) এর দুটো Booking দুটোই 12500, গড়ও 12500। সমান মানে বড় না, তাই WHERE এ > দিলে Tanvir এর কোনো Booking আসে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই ধাঁচ অন্য Table এও খাটে। একটা ট্যুরের দাম কি তার নিজের Destination এর অন্য ট্যুরগুলোর গড়ের চেয়ে বেশি?
              বাইরের <code className={CODE}>t</code> একটা ট্যুর, ভেতরের <code className={CODE}>t2</code> একই Destination
              এর সব ট্যুর, সেই ট্যুরটা নিজেও তার মধ্যে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের Destination এর গড়ের চেয়ে দামি ট্যুর"
              query={`SELECT t.title, t.destination_id, t.price_bdt
FROM tours t
WHERE t.price_bdt > (SELECT avg(t2.price_bdt)
                     FROM tours t2
                     WHERE t2.destination_id = t.destination_id)
ORDER BY t.tour_id;`}
              caption="তিনটা Row: Sylhet Tea Garden Tour (Sylhet এ 7800 আর 3500 এর গড় 5650), Saint Martin Luxury Stay (12500 আর 32000 এর গড় 22250), Cox's Bazar Family Package (8500 আর 15500 এর গড় 12000)। যে Destination এ একটাই ট্যুর, সেখানে কেউ নিজের গড়ের উপরে উঠতে পারে না।"
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
                  কোন Departure গুলোতে খালি সিট তার নিজের ট্যুরের সব Departure এর গড় খালি সিটের চেয়ে কম? দেখান{" "}
                  <code className={CODE}>departure_id</code>, <code className={CODE}>tour_id</code> আর{" "}
                  <code className={CODE}>seats_left</code>, departure_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  বাইরে <code className={CODE}>departures d</code>, ভেতরে <code className={CODE}>departures d2</code>,
                  ভেতরের শর্ত <code className={CODE}>d2.tour_id = d.tour_id</code>, আর তুলনা{" "}
                  <code className={CODE}>{"d.seats_left < (SELECT avg(d2.seats_left) ...)"}</code>।
                </>
              }
              solution={`SELECT d.departure_id, d.tour_id, d.seats_left
FROM departures d
WHERE d.seats_left < (SELECT avg(d2.seats_left)
                      FROM departures d2
                      WHERE d2.tour_id = d.tour_id)
ORDER BY d.departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "latest-per-group",
      subHeader: { index: "008", title: "The Latest per Group" },
      title: <SectionTitle>প্রতিটা দলের সবশেষ, বা সবচেয়ে বড়টা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                &ldquo;প্রতিটা Customer এর সবশেষ Booking&rdquo;, &ldquo;প্রতিটা ট্যুরের সবচেয়ে দামি Departure&rdquo;,
                &ldquo;প্রতিটা Guide এর সবচেয়ে দামি ট্যুর&rdquo;। এই ধরনের প্রশ্ন এত বেশি আসে যে এর একটা নামই আছে: Greatest
                per Group। GROUP BY দিয়ে শুধু সবশেষ তারিখটা পাওয়া যায়, পুরো Row না। Correlated Subquery দিয়ে পুরো Row:
                প্রতিটা Booking রাখুন, যদি তার তারিখ তার নিজের Customer এর সবশেষ তারিখের সমান হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিটা Customer এর সবশেষ Booking, পুরো Row"
              query={`SELECT b.customer_id, b.booking_id, b.status, b.booked_at
FROM bookings b
WHERE b.booked_at = (SELECT max(b2.booked_at)
                     FROM bookings b2
                     WHERE b2.customer_id = b.customer_id)
ORDER BY b.customer_id;`}
              caption="চৌদ্দটা Row, Booking আছে এমন প্রত্যেক Customer এর একটা করে। Imran নেই, কারণ বাইরের Table এখানে bookings, আর তাঁর কোনো Booking এর Row ই নেই। status Column টা এসেছে বিনা খরচে, GROUP BY দিয়ে এটা আনা যেত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সমান হলে দুটোই আসবে",
          content: (
            <ContentParagraph>
              যদি একই Customer এর দুটো Booking এর booked_at হুবহু এক হয়, দুটোই max এর সমান, তাই দুটোই ফলাফলে আসবে। Sample
              Data তে এমন নেই, কিন্তু বাস্তবে একই সেকেন্ডে দুটো Row তৈরি হতেই পারে। ঠিক একটা Row চাইলে একটা অনন্য
              Tie-breaker লাগে, যেমন ORDER BY b.booked_at DESC, b.booking_id DESC LIMIT 1, যেটা আগের অংশের পথ, অথবা Module
              06 এর LATERAL বা Module 03 এর DISTINCT ON।
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
                  Guide আছে এমন ট্যুরগুলোর মধ্যে, প্রতিটা Guide এর সবচেয়ে দামি ট্যুর। দেখান{" "}
                  <code className={CODE}>guide_id</code>, <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code>, guide_id এর ক্রমে।
                </>
              }
              hint={
                <>
                  বাইরে <code className={CODE}>tours t</code>, আর WHERE এ{" "}
                  <code className={CODE}>t.price_bdt = (SELECT max(t2.price_bdt) FROM tours t2 WHERE t2.guide_id = t.guide_id)</code>।
                  Ratargul এর guide_id NULL, আর NULL = NULL কখনো সত্য না, তাই সে নিজে থেকেই বাদ পড়ে।
                </>
              }
              solution={`SELECT t.guide_id, t.title, t.price_bdt
FROM tours t
WHERE t.price_bdt = (SELECT max(t2.price_bdt)
                     FROM tours t2
                     WHERE t2.guide_id = t.guide_id)
ORDER BY t.guide_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "for-all",
      subHeader: { index: "009", title: "For All with NOT EXISTS" },
      title: <SectionTitle>&ldquo;সবগুলোই&rdquo; প্রশ্ন: নিয়ম ভাঙা একটাও নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 06 এর{" "}
                <Link href="/sql/topic/semi-anti-join" className={LINK}>
                  Semi আর Anti Join
                </Link>{" "}
                লেসনে আপনি EXISTS আর NOT EXISTS দেখেছেন, দুটোই Correlated Subquery। এখানে তাদের একটা নতুন কাজ দেখি,
                &ldquo;সবগুলোই&rdquo; ধরনের প্রশ্ন। কোন ট্যুরের প্রতিটা Departure ভালো বিক্রি হচ্ছে? কোন Customer এর
                প্রতিটা Booking confirmed?
              </ContentParagraph>
              <ContentParagraph>
                SQL এ &ldquo;সবগুলো&rdquo; বলার সরাসরি কোনো শব্দ নেই। তাই প্রশ্নটা ঘুরিয়ে বলতে হয়, দুই বার না দিয়ে:
                &ldquo;প্রতিটা Departure এ ১৫ বা তার কম সিট খালি&rdquo; আর &ldquo;১৫ এর বেশি সিট খালি এমন Departure একটাও
                নেই&rdquo; একই কথা। দ্বিতীয় রূপটা সরাসরি NOT EXISTS এ লেখা যায়। পুরো ভর্তি, মানে শূন্য সিটের কোনো
                Departure Sample Data তে নেই, তাই ১৫ সিটকে &ldquo;ভালো বিক্রি&rdquo; ধরে দেখি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ForAllDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="যে ট্যুরের কোনো Departure এ ১৫ এর বেশি সিট খালি নেই"
              query={`SELECT t.tour_id, t.title
FROM tours t
WHERE NOT EXISTS (SELECT 1
                  FROM departures d
                  WHERE d.tour_id = t.tour_id
                    AND d.seats_left > 15)
ORDER BY t.tour_id;`}
              caption="পাঁচটা Row: ট্যুর ৩, ৫, ৭, ৮ আর ৯। শেষেরটা Cox's Bazar Family Package, যার কোনো Departure ই নেই। নিয়ম ভাঙার মতো কেউ না থাকায় NOT EXISTS সত্য। গণিতে একে বলে Vacuous Truth। কখনো এটাই চাই, কখনো চাই না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Family Package কে বাদ দিতে চাইলে আরেকটা শর্ত যোগ করুন: অন্তত একটা Departure আছে। মানে একটা EXISTS আর একটা
              NOT EXISTS, পাশাপাশি। দুটোই Correlated, দুটোই একই <code className={CODE}>t.tour_id</code> দেখে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Departure আছে, আর প্রতিটাই ভালো বিক্রি হচ্ছে"
              query={`SELECT t.tour_id, t.title
FROM tours t
WHERE EXISTS (SELECT 1 FROM departures d
              WHERE d.tour_id = t.tour_id)
  AND NOT EXISTS (SELECT 1 FROM departures d
                  WHERE d.tour_id = t.tour_id
                    AND d.seats_left > 15)
ORDER BY t.tour_id;`}
              caption="চারটা Row: ৩, ৫, ৭ আর ৮। Family Package এবার বাদ, কারণ তার একটাও Departure নেই, তাই প্রথম EXISTS মিথ্যা।"
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
                  কোন Customer দের প্রতিটা Booking confirmed? শুধু তাঁদের নিন যাঁদের অন্তত একটা Booking আছে, যাতে Imran
                  Kabir শূন্য Booking নিয়ে ঢুকে না পড়েন। দেখান শুধু <code className={CODE}>full_name</code>। Row এর ক্রম
                  যেকোনো।
                </>
              }
              hint={
                <>
                  &ldquo;প্রতিটা confirmed&rdquo; মানে &ldquo;confirmed না এমন Booking একটাও নেই&rdquo;:{" "}
                  <code className={CODE}>{"NOT EXISTS (... AND b.status <> 'confirmed')"}</code>, সাথে{" "}
                  <code className={CODE}>EXISTS (...)</code>।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id)
  AND NOT EXISTS (SELECT 1 FROM bookings b
                  WHERE b.customer_id = c.customer_id
                    AND b.status <> 'confirmed');`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "whose-column",
      subHeader: { index: "010", title: "Whose Column Is It" },
      title: <SectionTitle>নামটা কার: Error ছাড়া ভুল উত্তরের ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Correlated Subquery এর সবচেয়ে বিপজ্জনক ভুলগুলো কোনো Error দেয় না। Query চলে, সংখ্যা আসে, আর সংখ্যাটা ভুল।
                সবগুলোর মূলে একটা নিয়ম: ভেতরের Query তে Alias ছাড়া একটা Column এর নাম পেলে PostgreSQL প্রথমে ভেতরের FROM
                এর Table গুলোতে নামটা খোঁজে। সেখানে পেলে সেটাই। না পেলে এক ধাপ বাইরে যায়, বাইরের Query এর Table গুলোতে।
                MySQL ও একই নিয়ম মানে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দুই দিকেই ভেতরের:</strong>{" "}
                  <code className={CODE}>WHERE customer_id = customer_id</code> লিখলে দুটো নামই bookings এ পাওয়া যায়।
                  প্রতিটা Booking নিজের সাথে নিজের তুলনা, সবসময় সত্য। Subquery টা আর Correlated ই থাকে না।
                </ListItem>
                <ListItem>
                  <strong>নামটা ভেতরে নেই:</strong> payments Table এ customer_id নামে কোনো Column নেই, সেখানে আছে
                  booking_id। <code className={CODE}>SELECT customer_id FROM payments</code> লিখলে PostgreSQL বাইরে গিয়ে
                  customers এর customer_id ধরে, আর প্রশ্নটা হয়ে যায় &ldquo;আমার নম্বর কি আমার নম্বরের তালিকায় আছে&rdquo;।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ScopeDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ScopeTrapLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দুটো নীরব ভুল, আর Alias এর চিৎকার"
              query={`SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE customer_id = customer_id) AS bookings
FROM customers c
ORDER BY c.customer_id
LIMIT 3;

SELECT count(*) AS paid_customers
FROM customers c
WHERE c.customer_id IN (SELECT customer_id FROM payments);

SELECT count(*) AS paid_customers
FROM customers c
WHERE c.customer_id IN (SELECT p.customer_id FROM payments p);`}
              caption="প্রথম Query: Rahim, Nusrat, Tanvir তিনজনের পাশেই 24, যেটা পুরো bookings এর Row সংখ্যা। দ্বিতীয়: 15, মানে সব Customer, অথচ paid Payment আছে মাত্র ১২ জনের। দুটোতেই কোনো Error নেই। তৃতীয়টা থামে ERROR: column p.customer_id does not exist দিয়ে, কারণ p. লিখে আপনি বলে দিয়েছেন নামটা payments এর। নীরব ভুল উত্তরের চেয়ে জোরে Error অনেক ভালো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একটা অভ্যাস, দুটো ভুল বন্ধ",
          content: (
            <ContentParagraph>
              Subquery থাকলে ভেতরে বাইরে সব Column এর আগে Alias লিখুন, ব্যতিক্রম ছাড়া। তাতে প্রথম ভুলটা লেখাই যায় না,
              কারণ <code className={CODE}>b.customer_id = c.customer_id</code> লিখতে হয়। আর দ্বিতীয় ভুলটা নীরব থাকে না,
              Error হয়ে চোখে পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7"
              starter={`SELECT c.full_name
FROM customers c
WHERE c.customer_id IN (SELECT customer_id FROM payments);`}
              task={
                <>
                  নিচের Query টা লেখা হয়েছিল &ldquo;যাঁদের অন্তত একটা paid Payment আছে&rdquo; তালিকার জন্য, কিন্তু সে
                  পনেরো জনকেই দেয়। ঠিক করুন: শুধু তাঁদের <code className={CODE}>full_name</code>, যাঁদের কোনো Booking এর
                  Payment এর status <code className={CODE}>paid</code>। Correlated Subquery ব্যবহার করুন, সব Column এ
                  Alias সহ। Row এর ক্রম যেকোনো।
                </>
              }
              hint={
                <>
                  Payment থেকে Customer এ যেতে হয় Booking হয়ে। ভেতরে{" "}
                  <code className={CODE}>bookings b JOIN payments p ON p.booking_id = b.booking_id</code>, আর শর্ত{" "}
                  <code className={CODE}>b.customer_id = c.customer_id</code> আর{" "}
                  <code className={CODE}>{"p.status = 'paid'"}</code>, সবটা একটা EXISTS এর ভেতরে।
                </>
              }
              solution={`SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1
              FROM bookings b
              JOIN payments p ON p.booking_id = b.booking_id
              WHERE b.customer_id = c.customer_id
                AND p.status = 'paid');`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "how-fast",
      subHeader: { index: "011", title: "How Fast Is It" },
      title: <SectionTitle>প্রতিটা Row এর জন্য একবার, সত্যিই কি?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মডেলটা বলে, বাইরের পনেরোটা Row থাকলে ভেতরের Query পনেরোবার চলে। পনেরো লাখ Row থাকলে পনেরো লাখবার। শুনে
                ভয় লাগা স্বাভাবিক। কিন্তু Database এর ভেতরে একটা অংশ আছে, Planner, যে Query চালানোর আগে ভাবে কীভাবে চালালে
                সবচেয়ে কম কাজ হয়। কিছু Correlated Subquery সে এমনভাবে নতুন করে সাজায় যে ভেতরের অংশ আর প্রতিটা Row এর জন্য
                চলেই না। এই সাজানোর নাম Decorrelation। আবার কিছু Subquery সে সত্যিই প্রতিটা Row এর জন্য চালায়। কোনটা কোন
                পথে গেল, দেখার উপায় EXPLAIN, যেটা Module 13 এ বিস্তারিত শিখবেন। এখানে শুধু দুটো লাইন চিনে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="SELECT এর Subquery: SubPlan, loops=15"
              query={`EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c;`}
              caption="Plan এ SubPlan 1 নামে আলাদা একটা অংশ, আর তার পাশে loops=15। মানে ভেতরের অংশ সত্যিই পনেরোবার চলেছে, প্রতিটা Customer এর জন্য একবার, আর প্রতিবার bookings এর চব্বিশটা Row ঘেঁটে নিজের Row গুলো খুঁজেছে (Rows Removed by Filter: 22, মানে গড়ে ২২টা বাদ)। এই কয়েকটা Row তে এটা চোখের পলকে শেষ, কোটি Row তে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="EXISTS: Planner সাজিয়ে Join বানিয়ে ফেলেছে"
              query={`EXPLAIN (COSTS OFF)
SELECT c.full_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM bookings b
              WHERE b.customer_id = c.customer_id);`}
              caption="এখানে কোনো SubPlan নেই। Planner bookings কে customer_id ধরে একবার গুছিয়েছে (HashAggregate), তারপর customers এর সাথে একবারে Hash Join। Correlated Subquery লেখা হয়েছিল, কিন্তু চলেছে Join হিসেবে। EXISTS আর IN এর বেলায় PostgreSQL প্রায়ই এটা করে, SELECT তালিকার Scalar Subquery এর বেলায় সাধারণত করে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Row এর জন্য চলা SubPlan সবসময় খারাপ না। ভেতরের Query যদি একটা Index দিয়ে সরাসরি নিজের Row গুলোতে
                পৌঁছাতে পারে, যেমন bookings এর customer_id এর উপর একটা Index, তাহলে প্রতিবারের কাজ খুব সামান্য। সমস্যা হয়
                যখন প্রতিবার পুরো Table ঘাঁটতে হয়, যেমন উপরের Plan এর Seq Scan।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা জানার মতো পার্থক্য আছে। PostgreSQL Foreign Key দিলে নিজে থেকে তার Column এ Index বানায় না, তার
                Documentation এ সোজাসুজি লেখা আছে। MySQL এর InnoDB বানায়, কারণ তার Foreign Key এর জন্য Index লাগেই। তাই
                একই Correlated Subquery MySQL এ Index দিয়ে চলতে পারে, আর PostgreSQL এ Index না বানানো পর্যন্ত Seq Scan
                করে। Index কখন আর কীভাবে বানাবেন, সেটা Module 13 এর বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দ্রুত কি না, অনুমান না, মেপে দেখুন",
          content: (
            <ContentParagraph>
              Correlated Subquery মানেই ধীর, এই ধারণা পুরোপুরি ঠিক না, আবার পুরোপুরি ভুলও না। কোনটা দ্রুত, সেটা Data এর
              পরিমাণ, Index আর Planner এর সিদ্ধান্তের উপর নির্ভর করে। অভ্যাস একটাই: সন্দেহ হলে EXPLAIN ANALYZE চালান, আর
              SubPlan এর পাশে loops কত বড় সেটা দেখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "rewriting",
      subHeader: { index: "012", title: "Rewriting It" },
      title: <SectionTitle>একই প্রশ্ন, অন্য লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রায় প্রতিটা Correlated Subquery অন্যভাবেও লেখা যায়, আর অনেক সময় অন্য লেখাটা দ্রুত বা পড়তে সহজ। মূল
                কৌশল একটাই: প্রতিটা Row এর জন্য বারবার হিসাব না করে, সব দলের হিসাব একবারে করে নিয়ে Join করা। নিচের Lab এ
                দুটো প্রশ্ন, প্রতিটা কয়েকভাবে লেখা। সবগুলো লেখা Sample Data তে হুবহু একই ফলাফল দেয়, এটা যাচাই করা হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RewriteLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শারমিন আপার প্রশ্নের একটা আগাম রূপ দেখে রাখুন। নিচের Query তে Window Function প্রতিটা Booking এর পাশে তার
              Customer এর গড় বসায়, একবার সব Row দেখে, কোনো Subquery এর পুনরাবৃত্তি ছাড়া। বাইরের অংশটা FROM এর ভেতরের
              একটা Subquery, যার নাম Derived Table, পরের লেসনের বিষয়। আর <code className={CODE}>OVER (PARTITION BY ...)</code>{" "}
              পুরোটা Module 08 এ শিখবেন। এখন শুধু দেখুন, উত্তর একই আটটা Row।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আগাম দেখা: Window Function দিয়ে নিজের গড়"
              query={`SELECT booking_id, customer_id, total_bdt
FROM (SELECT b.booking_id,
             b.customer_id,
             b.total_bdt,
             avg(b.total_bdt) OVER (PARTITION BY b.customer_id) AS own_avg
      FROM bookings b) x
WHERE total_bdt > own_avg
ORDER BY booking_id;`}
              caption="আটটা Row, Correlated Subquery এর উত্তরের সাথে হুবহু এক: 2, 4, 6, 15, 17, 19, 20, 23। পার্থক্য কাজের ধরনে: এখানে প্রতিটা Customer এর গড় একবারই হিসাব হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Correlated Subquery শুধু SELECT এর জন্য না",
          content: (
            <ContentParagraph>
              Data বদলানোর সময়ও Correlated Subquery খুব কাজের, যেমন প্রতিটা Departure এর seats_left আবার হিসাব করা তার
              Booking গুলো থেকে: UPDATE departures d SET seats_left = ... (SELECT ... WHERE b.departure_id = d.departure_id)।
              এর নাম Correlated UPDATE। লেখার নিয়ম আর তার ঝুঁকি শিখবেন Module 10 এ, Data বদলানোর লেসনগুলোতে।
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
                  কোন Customer দের সবশেষ Booking এখনো pending? Support টিম তাঁদের ফোন করে Payment এর কথা মনে করিয়ে দেবে।
                  দেখান <code className={CODE}>customer_id</code>, <code className={CODE}>full_name</code>,{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>total_bdt</code>, customer_id এর
                  ক্রমে।
                </>
              }
              hint={
                <>
                  customers আর bookings কে Join করুন। তারপর দুটো শর্ত: Booking টা তার Customer এর সবশেষ (
                  <code className={CODE}>b.booked_at = (SELECT max(b2.booked_at) ...)</code>), আর{" "}
                  <code className={CODE}>{"b.status = 'pending'"}</code>। ক্রম গুরুত্বপূর্ণ: আগে সবশেষটা বাছাই, তারপর তার
                  status দেখা।
                </>
              }
              solution={`SELECT c.customer_id, c.full_name, b.booking_id, b.total_bdt
FROM customers c
JOIN bookings b ON b.customer_id = c.customer_id
WHERE b.booked_at = (SELECT max(b2.booked_at)
                     FROM bookings b2
                     WHERE b2.customer_id = c.customer_id)
  AND b.status = 'pending'
ORDER BY c.customer_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই ধারণা, কয়েকটা আলাদা কথা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের প্রতিটা Correlated Subquery MySQL 8.4 এ হুবহু চলে, আর একই উত্তর দেয়: নিজের গড়ের উপরে আটটা
                Booking, Imran এর count 0, সবশেষ Booking চৌদ্দটা, NOT EXISTS এর পাঁচটা ট্যুর। নামের ফাঁদও একই রকম:
                payments এর ভুলে MySQL ও 15 দেয়, আর Alias দিলে Error 1054। পার্থক্যগুলো ছোট, কিন্তু MySQL ভিত্তিক কোর্স
                দেখলে কাজে লাগবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Error এর চেহারা:</strong> একাধিক Row এলে MySQL বলে{" "}
                  <code className={CODE}>ERROR 1242 (21000): Subquery returns more than 1 row</code>। SQLSTATE একই 21000।
                </ListItem>
                <ListItem>
                  <strong>IN এর ভেতরে LIMIT চলে না:</strong> Scalar Subquery তে ORDER BY ... LIMIT 1 চলে, কিন্তু{" "}
                  <code className={CODE}>IN (SELECT ... LIMIT 3)</code> লিখলে ERROR 1235। PostgreSQL এ এটা চলে।
                </ListItem>
                <ListItem>
                  <strong>EXPLAIN এ নাম:</strong> MySQL এর EXPLAIN এ Correlated Subquery দেখায়{" "}
                  <code className={CODE}>DEPENDENT SUBQUERY</code> হিসেবে, মানে বাইরের Query এর উপর নির্ভরশীল। PostgreSQL
                  এর SubPlan এর মতো।
                </ListItem>
                <ListItem>
                  <strong>Index নিজে থেকে:</strong> InnoDB Foreign Key এর Column এ Index নিজে বানায়, তাই উপরের count এর
                  Query MySQL এ customer_id এর Index দিয়ে চলে।
                </ListItem>
                <ListItem>
                  <strong>নতুন করে সাজানোর Switch:</strong> MySQL 8.0.24 থেকে Optimizer চাইলে Correlated Scalar Subquery কে
                  Derived Table এর Join এ বদলাতে পারে, যদি <code className={CODE}>subquery_to_derived</code> নামের Switch চালু
                  থাকে। এটা Default এ বন্ধ, আর MySQL এর নিজের Documentation বলে এটা মূলত Test এর জন্য।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-correlated.sql",
          code: `-- MySQL 8.4.11, island-tours.mysql.sql লোড করা

SELECT c.full_name,
       (SELECT b.booking_id FROM bookings b
        WHERE b.customer_id = c.customer_id) AS booking
FROM customers c;
-- ERROR 1242 (21000): Subquery returns more than 1 row

SELECT c.customer_id
FROM customers c
WHERE c.customer_id IN (SELECT b.customer_id FROM bookings b
                        ORDER BY b.booked_at DESC LIMIT 3);
-- ERROR 1235 (42000): This version of MySQL doesn't yet support
--   'LIMIT & IN/ALL/ANY/SOME subquery'

EXPLAIN SELECT c.full_name,
       (SELECT COUNT(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS n
FROM customers c;
-- id 1  PRIMARY             table c  type ALL
-- id 2  DEPENDENT SUBQUERY  table b  type ref  key customer_id

SELECT @@optimizer_switch LIKE '%subquery_to_derived=off%' AS s2d_off;
-- 1, মানে Switch টা বন্ধ`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Customer তালিকা</SectionTitle>,
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
                Island Tours এর Admin Panel এর Customers পাতায় প্রতিটা Customer এর একটা Row, আর প্রতিটা Row এর পাশে কয়েকটা
                ছোট হিসাব: কয়টা Booking, শেষ Booking কবে, confirmed Booking এ মোট কত টাকা, আর পঞ্চাশ হাজার বা তার বেশি
                হলে একটা VIP চিহ্ন। Support টিম এই পাতা দেখে ঠিক করে কাকে আগে ফোন করবে।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা হিসাব একটা আলাদা Correlated Subquery, তাই পাতায় নতুন একটা Column যোগ করতে হলে শুধু একটা নতুন বন্ধনী
                লিখলেই চলে, বাকি Query তে হাত দিতে হয় না। পনেরো জন Customer এর জন্য এটা একদম ঠিক আছে। হাজার হাজার Customer
                হলে Developer রা একই পাতা LEFT JOIN আর GROUP BY দিয়ে, বা পরের লেসনের Derived Table দিয়ে লেখেন, আর EXPLAIN
                দিয়ে মিলিয়ে দেখেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Admin Panel এর Customers পাতা"
              query={`SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings,
       (SELECT max(b.booked_at)::date FROM bookings b
        WHERE b.customer_id = c.customer_id) AS last_booked,
       coalesce((SELECT sum(b.total_bdt) FROM bookings b
                 WHERE b.customer_id = c.customer_id
                   AND b.status = 'confirmed'), 0) AS confirmed_spend,
       CASE WHEN coalesce((SELECT sum(b.total_bdt) FROM bookings b
                           WHERE b.customer_id = c.customer_id
                             AND b.status = 'confirmed'), 0) >= 50000
            THEN 'VIP' ELSE '' END AS badge
FROM customers c
ORDER BY confirmed_spend DESC, c.customer_id;`}
              caption="পনেরোটা Row, সবচেয়ে বেশি খরচ করা মানুষ উপরে। Nusrat Jahan 75000 আর Sumaiya Islam 70500, দুজনেই VIP। Sabbir, Kamal আর Imran এর confirmed খরচ 0: Sabbir এর Booking বাতিল, Kamal এর pending, Imran এর কোনো Booking নেই। confirmed_spend এর হিসাবটা দুইবার লেখা হয়েছে, একবার দেখাতে আর একবার VIP ঠিক করতে। এই পুনরাবৃত্তি দূর করার সুন্দর উপায় Lesson 05 এর CTE।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>শারমিন আপার Query, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজের গড়ের উপরের Booking খোঁজার Query টা বোঝার মডেল দিয়ে, দুটো Booking এর বেলায় ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM bookings b",
              description:
                "বাইরের Query চব্বিশটা Booking নিয়ে শুরু করে। প্রতিটা Booking এর জন্য WHERE এর শর্ত আলাদা করে যাচাই হবে।",
            },
            {
              title: "Booking 1: customer 1, 25000.00",
              description:
                "বাইরের এই Row এর customer_id 1। ভেতরের Query তে b.customer_id এর জায়গায় 1 বসে: SELECT avg(b2.total_bdt) FROM bookings b2 WHERE b2.customer_id = 1।",
            },
            {
              title: "ভেতরের উত্তর: 26666.67",
              description:
                "customer 1 এর তিনটা Booking: 25000, 19000 আর 36000। তাদের গড় 26666.666..., দেখাতে 26666.67।",
            },
            {
              title: "তুলনা: 25000 > 26666.67?",
              description: "মিথ্যা। Booking 1 বাদ।",
            },
            {
              title: "Booking 17: customer 1, 36000.00",
              description:
                "একই Customer, তাই ভেতরের Query আবার একই প্রশ্ন করে আর একই উত্তর পায়, 26666.67। 36000 এর চেয়ে বড়, তাই Booking 17 রাখা হলো।",
            },
            {
              title: "একে একে বাকি Booking",
              description:
                "প্রতিটা Booking এর জন্য তার নিজের Customer এর গড়। যাঁদের একটাই Booking, তাঁদের Booking নিজের গড়ের সমান, তাই কখনো রাখা হয় না।",
            },
            {
              title: "SELECT আর ORDER BY",
              description:
                "টিকে থাকা আটটা Booking থেকে booking_id, customer_id আর total_bdt নেওয়া হয়, booking_id এর ক্রমে: 2, 4, 6, 15, 17, 19, 20, 23।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবচেয়ে বেশি হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখা যায়", "ঠিক উপায়"],
          rows: [
            [
              "ভেতরে Alias ছাড়া নাম: customer_id = customer_id",
              "সবার পাশে একই সংখ্যা, যেমন 24",
              "দুই দিকেই Alias: b.customer_id = c.customer_id",
            ],
            [
              "ভেতরের Table এ নেই এমন নাম",
              "Error নেই, সব Row আসে, যেমন 15 জনই",
              "সব Column এ Alias, তাহলে Error হয়ে ধরা পড়ে",
            ],
            [
              "SELECT এর Subquery থেকে একাধিক Row",
              "ERROR: more than one row returned by a subquery",
              "Aggregate দিন, অথবা ORDER BY ... LIMIT 1",
            ],
            [
              "শুধু LIMIT 1, ORDER BY ছাড়া",
              "কোন Row আসবে তা অনিশ্চিত",
              "স্পষ্ট ক্রম, আর অনন্য Tie-breaker",
            ],
            [
              "সবার গড়ের সাথে তুলনা, যখন প্রশ্ন নিজের গড়ের",
              "Error নেই, উত্তর ভুল (১৩ বনাম ৮)",
              "প্রশ্নে \"তাঁর নিজের\" থাকলে Correlated Subquery",
            ],
            [
              "NULL এর বদলে 0 আশা করা",
              "sum, avg, max খালি দলের জন্য NULL দেয়",
              "coalesce((SELECT ...), 0)",
            ],
            [
              "\"সবগুলো\" প্রশ্নে খালি দল ভুলে যাওয়া",
              "যার কোনো Row নেই সেও ফলাফলে",
              "দরকার হলে সাথে একটা EXISTS",
            ],
            [
              "বড় Table এ চোখ বুজে Correlated Subquery",
              "SubPlan এর loops লাখে লাখে",
              "EXPLAIN দেখুন, দরকারে Join বা Window দিয়ে আবার লিখুন",
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
                    href="https://www.postgresql.org/docs/current/sql-expressions.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Value Expressions, Scalar Subqueries অংশ
                  </a>
                  : Subquery কখন একটা মান দেয়, শূন্য Row এ NULL, একাধিক Row এ Error, আর বাইরের মান কীভাবে স্থির থাকে।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/functions-subquery.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Subquery Expressions
                  </a>
                  : EXISTS, IN, ANY, ALL, প্রতিটার আনুষ্ঠানিক নিয়ম।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/using-explain.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Using EXPLAIN
                  </a>
                  : SubPlan আর loops পড়তে শেখার প্রথম পাতা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.postgresql.org/docs/current/ddl-constraints.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    PostgreSQL Docs: Constraints
                  </a>
                  : Foreign Key এর অংশে সেই বাক্যটা, যে Foreign Key নিজে থেকে Index বানায় না।
                </ListItem>
                <ListItem>
                  <a
                    href="https://dev.mysql.com/doc/refman/8.4/en/correlated-subqueries.html"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    MySQL 8.4 Manual: Correlated Subqueries
                  </a>
                  : MySQL এর দিক থেকে একই ধারণা, আর subquery_to_derived দিয়ে নতুন করে সাজানোর কথা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://en.wikipedia.org/wiki/Correlated_subquery"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    Wikipedia: Correlated subquery
                  </a>
                  : সংক্ষিপ্ত সংজ্ঞা, আর প্রতিটা Row এর জন্য চলার ব্যাপারটা নিয়ে আলোচনা।
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.youtube.com/watch?v=hlGoQC332VM&t=10434s"
                    className={LINK}
                    target="_blank"
                    rel="noopener noreferrer">
                    আপনি যে SQL কোর্সটা দেখছেন, Subquery এর অংশ
                  </a>
                  : কোর্সটা MySQL দিয়ে। সেখানের Subquery গুলো দেখার সময় নিজেকে জিজ্ঞেস করুন, এটা কি বাইরের Row দেখে?
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
                  Correlated Subquery বাইরের Query এর কোনো Column ব্যবহার করে, তাই তার উত্তর প্রতিটা Row এর জন্য আলাদা।
                  সেই বাইরের Column এর নাম Outer Reference।
                </ListItem>
                <ListItem>
                  বোঝার মডেল: বাইরের একটা Row নিন, তার মান ভেতরে বসান, ভেতরের Query চালান, উত্তর কাজে লাগান, পরের Row।
                </ListItem>
                <ListItem>
                  SELECT এ বসালে প্রতিটা Row এর পাশে একটা হিসাব, কোনো Row হারায় না। WHERE এ বসালে প্রতিটা Row তার নিজের দলের
                  মাপকাঠির সাথে তুলনা।
                </ListItem>
                <ListItem>
                  ভেতরে কিছু না এলে NULL, count এর বেলায় 0। একাধিক Row এলে Error 21000, যার সমাধান Aggregate বা ORDER BY
                  ... LIMIT 1।
                </ListItem>
                <ListItem>
                  প্রতিটা দলের সবশেষ Row: ভেতরে max, বাইরে সমান কি না। সমান মান থাকলে দুটোই আসে।
                </ListItem>
                <ListItem>
                  &ldquo;সবগুলো&rdquo; প্রশ্ন লেখা হয় NOT EXISTS দিয়ে, নিয়ম ভাঙা একটাও নেই। খালি দল সবসময় টেকে, বাদ দিতে
                  চাইলে সাথে EXISTS।
                </ListItem>
                <ListItem>
                  Alias ছাড়া নাম আগে ভেতরে খোঁজা হয়, না পেলে বাইরে। তাই সব Column এ Alias, তাতে নীরব ভুল Error হয়ে যায়।
                </ListItem>
                <ListItem>
                  Planner EXISTS কে প্রায়ই Join বানিয়ে চালায়, SELECT এর Scalar Subquery কে সাধারণত SubPlan হিসেবে প্রতিটা
                  Row এর জন্য। সন্দেহ হলে EXPLAIN, দরকারে Join, LATERAL বা Window দিয়ে আবার লেখা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা কথা এসেছে: প্রতিটা Row এর জন্য বারবার হিসাব না করে, সব দলের হিসাব একবারে করে নিয়ে
                Join করা যায়। সেই &ldquo;একবারে করে নেওয়া&rdquo; হিসাবটা লেখা হয় FROM এর ভেতরের একটা Subquery দিয়ে, যেটা
                একটা অস্থায়ী Table এর মতো আচরণ করে। Module 06 এর Fan-out এর দুইবার গোনা টাকার সমস্যাও এই দিয়েই সারে। পরের
                লেসন{" "}
                <Link href="/sql/topic/derived-tables" className={LINK}>
                  Derived Tables
                </Link>{" "}
                ঠিক এটা নিয়ে।
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
      ["Uncorrelated Subquery", "বাইরের কিছু দেখে না, একবার চলে", "সবার গড় 24679.17, ১৩টা Booking"],
      ["Correlated Subquery", "বাইরের Row এর Column দেখে", "b2.customer_id = b.customer_id"],
      ["Outer Reference", "ভেতরে ব্যবহার করা বাইরের Column", "c.customer_id, b.customer_id"],
      ["প্রতিটা Row এর মডেল", "বাইরের মান ভেতরে বসে, ভেতরের Query চলে, উত্তর আসে", "Rahim এর জন্য 1, Imran এর জন্য 15"],
      ["নিজের গড়ের সাথে তুলনা", "WHERE এ Correlated avg", "আটটা Booking: 2, 4, 6, 15, 17, 19, 20, 23"],
      ["SELECT এ হিসাব", "প্রতিটা Row এর পাশে একটা মান", "Booking সংখ্যা, Imran 0"],
      ["শূন্য Row", "NULL, count হলে 0", "Imran এর avg আর min NULL"],
      ["একাধিক Row", "Error 21000", "Rahim এর তিনটা booking_id"],
      ["দলের সবশেষ Row", "booked_at = (SELECT max ...)", "চৌদ্দজনের সবশেষ Booking"],
      ["সবগুলো প্রশ্ন", "NOT EXISTS নিয়ম ভাঙা", "৫টা ট্যুর, Family Package সহ"],
      ["নামের ফাঁদ", "Alias ছাড়া নাম ভেতরে আগে, না পেলে বাইরে", "payments এর ভুলে ১৫, আসলে ১২"],
      ["SubPlan আর loops", "প্রতিটা Row এর জন্য চলেছে কি না", "loops=15"],
      ["আবার লেখা", "Join, LATERAL, DISTINCT ON, Window", "একই ১৪ বা ১৫টা Row"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "কোন Subquery টা Correlated?",
        options: [
          {
            key: "A",
            text: "(SELECT avg(total_bdt) FROM bookings)",
            isCorrect: false,
            explanation: "এটা বাইরের কোনো Column দেখে না। একা চালালেও চলে আর একই উত্তর দেয়, তাই Uncorrelated।",
          },
          {
            key: "B",
            text: "(SELECT count(*) FROM bookings b WHERE b.customer_id = c.customer_id)",
            isCorrect: true,
            explanation: "ঠিক। c.customer_id বাইরের customers এর Column, ভেতরের Query তাকে দেখে, তাই প্রতিটা Customer এর জন্য উত্তর আলাদা।",
          },
          {
            key: "C",
            text: "(SELECT max(starts_on) FROM departures)",
            isCorrect: false,
            explanation: "এটাও বাইরের কিছু দেখে না, সব Departure এর একটাই সর্বোচ্চ তারিখ।",
          },
          {
            key: "D",
            text: "(SELECT customer_id FROM bookings WHERE status = 'pending')",
            isCorrect: false,
            explanation: "শর্তটা একটা স্থির লেখার সাথে, বাইরের কোনো Row এর সাথে না। Uncorrelated, আর এটা একাধিক Row ও দিতে পারে।",
          },
        ],
      },
      {
        id: 2,
        text: "শারমিন আপার প্রশ্নে সবার গড়ের সাথে তুলনা ১৩টা Row দেয়, নিজের গড়ের সাথে ৮টা। কোনটা ঠিক, আর কেন?",
        options: [
          {
            key: "A",
            text: "১৩, কারণ বেশি Row মানে কিছু বাদ পড়েনি",
            isCorrect: false,
            explanation: "Row বেশি হওয়া ঠিক হওয়ার প্রমাণ না। Booking 1 এখানে আছে, অথচ সেটা Rahim এর নিজের গড়ের নিচে।",
          },
          {
            key: "B",
            text: "৮, কারণ প্রশ্নটা ছিল প্রতিটা Customer এর নিজের স্বাভাবিকের সাথে তুলনা",
            isCorrect: true,
            explanation: "ঠিক। মাপকাঠিটা প্রতিটা Row এর Customer অনুযায়ী বদলায়, তাই Correlated Subquery। উত্তর 2, 4, 6, 15, 17, 19, 20, 23।",
          },
          {
            key: "C",
            text: "দুটোই ঠিক, শুধু লেখার ধরন আলাদা",
            isCorrect: false,
            explanation: "দুটো আলাদা প্রশ্নের উত্তর। ফলাফলের Row ও আলাদা, যেমন Booking 1 আর 20।",
          },
          {
            key: "D",
            text: "কোনোটাই না, এর জন্য GROUP BY লাগে",
            isCorrect: false,
            explanation: "GROUP BY দিয়ে প্রতিটা Customer এর গড় পাওয়া যায়, কিন্তু প্রতিটা Booking এর পাশে সেটা বসাতে আরও কাজ লাগে। Correlated Subquery সরাসরি সেটা করে।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT এর একটা Correlated Subquery কোনো এক Customer এর জন্য একটাও Row পায় না। কী হয়?",
        options: [
          {
            key: "A",
            text: "সেই Customer এর পুরো Row ফলাফল থেকে বাদ পড়ে",
            isCorrect: false,
            explanation: "SELECT এর Subquery কখনো বাইরের Row বাদ দেয় না। Imran Kabir ফলাফলে থাকেন।",
          },
          {
            key: "B",
            text: "Query Error দিয়ে থেমে যায়",
            isCorrect: false,
            explanation: "Error হয় একাধিক Row এলে, শূন্য Row এ না।",
          },
          {
            key: "C",
            text: "মানটা NULL হয়, তবে count(*) হলে 0",
            isCorrect: true,
            explanation: "ঠিক। শূন্য Row মানে NULL। কিন্তু count এর মতো Aggregate খালি দলের জন্যও একটা Row দেয়, যার মান 0।",
          },
          {
            key: "D",
            text: "মানটা সবসময় 0 হয়",
            isCorrect: false,
            explanation: "শুধু count এর বেলায় 0। avg, max, min আর সাধারণ Column এর বেলায় NULL।",
          },
        ],
      },
      {
        id: 4,
        text: "(SELECT b.booking_id FROM bookings b WHERE b.customer_id = c.customer_id) SELECT এ বসালে Rahim Uddin এর বেলায় কী হয়?",
        options: [
          {
            key: "A",
            text: "প্রথম booking_id টা আসে",
            isCorrect: false,
            explanation: "Database নিজে থেকে প্রথমটা বেছে নেয় না। তিনটা Row এলে সে Error দেয়।",
          },
          {
            key: "B",
            text: "Error: more than one row returned by a subquery used as an expression",
            isCorrect: true,
            explanation: "ঠিক। Rahim এর তিনটা Booking, একটা ঘরে তিনটা মান বসানো যায় না। SQLSTATE 21000।",
          },
          {
            key: "C",
            text: "তিনটা booking_id কমা দিয়ে জোড়া হয়ে আসে",
            isCorrect: false,
            explanation: "এটা string_agg এর কাজ, Module 05 এ শিখেছেন। সাধারণ Subquery এটা করে না।",
          },
          {
            key: "D",
            text: "Rahim এর Row তিনবার আসে",
            isCorrect: false,
            explanation: "এটা JOIN এর আচরণ। Subquery থেকে একাধিক Row এলে Row বাড়ে না, Error হয়।",
          },
        ],
      },
      {
        id: 5,
        text: "ভেতরের Query তে WHERE customer_id = customer_id লেখা, বাইরে customers c, ভেতরে bookings b। কী হয়?",
        options: [
          {
            key: "A",
            text: "PostgreSQL বুঝে নেয় একটা ভেতরের, একটা বাইরের",
            isCorrect: false,
            explanation: "PostgreSQL অনুমান করে না। Alias ছাড়া নাম আগে ভেতরে খোঁজে, আর bookings এ customer_id আছে।",
          },
          {
            key: "B",
            text: "Error: column reference is ambiguous",
            isCorrect: false,
            explanation: "দুই স্তরের মধ্যে কোনো দ্ব্যর্থতা নেই, ভেতরেরটা আগে জেতে। তাই কোনো Error আসে না, আর সেটাই বিপদ।",
          },
          {
            key: "C",
            text: "দুটোই bookings এর Column, শর্ত সবসময় সত্য, তাই প্রত্যেকের পাশে 24",
            isCorrect: true,
            explanation: "ঠিক। প্রতিটা Booking নিজের সাথে নিজের তুলনা। Subquery আর Correlated থাকে না, প্রত্যেক Customer এর পাশে পুরো Table এর সংখ্যা।",
          },
          {
            key: "D",
            text: "প্রত্যেকের পাশে 0",
            isCorrect: false,
            explanation: "শর্ত মিথ্যা হলে 0 হতো। এখানে শর্ত সবসময় সত্য।",
          },
        ],
      },
      {
        id: 6,
        text: "কোন ট্যুরের প্রতিটা Departure এ ১৫ বা তার কম সিট খালি, এটা NOT EXISTS (... AND d.seats_left > 15) দিয়ে লিখলে Cox's Bazar Family Package আসে কেন?",
        options: [
          {
            key: "A",
            text: "তার প্রতিটা Departure এ ১৫ এর কম সিট খালি",
            isCorrect: false,
            explanation: "তার কোনো Departure ই নেই। সে এসেছে অন্য কারণে।",
          },
          {
            key: "B",
            text: "তার কোনো Departure নেই, তাই নিয়ম ভাঙা Departure ও নেই, আর NOT EXISTS সত্য",
            isCorrect: true,
            explanation: "ঠিক। খালি দলের ব্যাপারে \"সবগুলো\" কথাটা সবসময় সত্য, একে বলে Vacuous Truth। বাদ দিতে চাইলে সাথে একটা EXISTS লাগে।",
          },
          {
            key: "C",
            text: "NULL এর কারণে NOT EXISTS ভুল উত্তর দিয়েছে",
            isCorrect: false,
            explanation: "এখানে কোনো NULL নেই। NOT EXISTS শুধু দেখে কোনো Row এল কি না, আর কোনো Row আসেনি।",
          },
          {
            key: "D",
            text: "Planner Query টা ভুলভাবে সাজিয়েছে",
            isCorrect: false,
            explanation: "Planner ফলাফল বদলায় না, শুধু কাজের পথ বদলায়। উত্তরটা Query এর অর্থ থেকেই আসে।",
          },
        ],
      },
      {
        id: 7,
        text: "EXPLAIN ANALYZE এ SubPlan 1 এর পাশে loops=15 দেখা গেল। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Query টা পনেরোবার ব্যর্থ হয়ে আবার চেষ্টা করেছে",
            isCorrect: false,
            explanation: "loops ব্যর্থতার হিসাব না, কতবার একটা অংশ চলেছে তার হিসাব।",
          },
          {
            key: "B",
            text: "ভেতরের অংশটা পনেরোবার চলেছে, বাইরের প্রতিটা Row এর জন্য একবার",
            isCorrect: true,
            explanation: "ঠিক। customers এর পনেরোটা Row, প্রতিটার জন্য একবার। Row যত বাড়বে, loops তত বাড়বে।",
          },
          {
            key: "C",
            text: "ফলাফলে পনেরোটা Column এসেছে",
            isCorrect: false,
            explanation: "loops এর সাথে Column সংখ্যার কোনো সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "Planner Subquery টাকে Join এ বদলে দিয়েছে",
            isCorrect: false,
            explanation: "উল্টো। Join এ বদলালে SubPlan থাকত না, যেমন EXISTS এর Plan এ Hash Join দেখা যায়।",
          },
        ],
      },
      {
        id: 8,
        text: "c.customer_id IN (SELECT customer_id FROM payments) লেখায় সমস্যা কী, যেখানে payments এ customer_id Column নেই?",
        options: [
          {
            key: "A",
            text: "Error আসে, column does not exist",
            isCorrect: false,
            explanation: "Alias ছাড়া লিখলে Error আসে না। নামটা বাইরের customers এ পাওয়া যায়, আর সেটাই ধরা হয়।",
          },
          {
            key: "B",
            text: "কিছু না, payments নিজে থেকে Booking হয়ে Customer খুঁজে নেয়",
            isCorrect: false,
            explanation: "Database কোনো পথ নিজে থেকে খোঁজে না। Booking এর Join আপনাকেই লিখতে হয়।",
          },
          {
            key: "C",
            text: "customer_id বাইরের c.customer_id হয়ে যায়, প্রশ্নটা সবার জন্য সত্য, তাই ১৫ জনই আসেন",
            isCorrect: true,
            explanation: "ঠিক। আসল উত্তর ১২। p.customer_id লিখলে Error আসত, আর ভুলটা চোখে পড়ত।",
          },
          {
            key: "D",
            text: "শূন্য Row আসে",
            isCorrect: false,
            explanation: "উল্টো, সবাই আসেন। প্রতিটা Customer এর নম্বর তার নিজের নম্বরের তালিকায় তো থাকবেই।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Island Tours এর Customer Insight Report",
    time: "৬০ থেকে ৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>সবার গড় বনাম নিজের গড়:</strong> শারমিন আপার প্রশ্নটা দুইভাবে চালান, Uncorrelated আর Correlated। দুই
        ফলাফলের তফাত বের করুন: কোন Booking শুধু প্রথম তালিকায়, কোনটা শুধু দ্বিতীয়তে। প্রতিটার কারণ এক লাইনে লিখুন।
      </span>,
      <span key="2">
        <strong>Customer তালিকা:</strong> Correlated Subquery দিয়ে প্রতিটা Customer এর Booking সংখ্যা, শেষ Booking এর
        তারিখ, confirmed খরচ (0 সহ) আর cancelled Booking এর সংখ্যা দেখান। তারপর একই চারটা Column LEFT JOIN আর GROUP BY
        দিয়ে লিখুন, আর দুটো ফলাফল মিলিয়ে দেখান।
      </span>,
      <span key="3">
        <strong>সবশেষ আর প্রথম:</strong> প্রতিটা Customer এর প্রথম আর সবশেষ Booking এর booking_id পাশাপাশি দেখান। যাঁদের
        একটাই Booking, তাঁদের দুটো ঘরে একই নম্বর আসবে কি না, আগে অনুমান করে তারপর চালিয়ে দেখুন।
      </span>,
      <span key="4">
        <strong>সবগুলো প্রশ্ন:</strong> কোন Destination এর প্রতিটা ট্যুর চালু (is_active)? NOT EXISTS দিয়ে লিখুন। ফলাফলে
        Kuakata আসে কি না দেখুন, আর কেন আসে বা আসে না, Vacuous Truth দিয়ে ব্যাখ্যা করুন। তারপর এমনভাবে বদলান যাতে শুধু
        ট্যুর আছে এমন Destination আসে।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> পরীক্ষার খাতা আর ক্লাসের গড়ের উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান,
        সাধারণ Subquery আর Correlated Subquery এর তফাত কী, আর Alias ছাড়া নাম লিখলে কী বিপদ।
      </span>,
    ],
    deliverables: [
      <span key="d1">দুটো Query, তফাতের তালিকা আর প্রতিটার কারণ</span>,
      <span key="d2">দুই রকম লেখার Customer তালিকা আর মিলানোর ফলাফল</span>,
      <span key="d3">প্রথম আর সবশেষ Booking এর Query আর অনুমান বনাম ফলাফল</span>,
      <span key="d4">দুটো NOT EXISTS Query আর Kuakata নিয়ে ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Correlated Subquery",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "দুই রকম গড়",
        description:
          "প্রথম ফাইলের দুটো Query চালান। সবার গড়ের ১৩টা আর নিজের গড়ের ৮টা Row পাশাপাশি রাখুন, আর Booking 1 আর 20 খুঁজে দেখুন কে কোথায়।",
      },
      {
        title: "SELECT এ হিসাব",
        description:
          "দ্বিতীয় ফাইলে প্রতিটা Customer এর Booking সংখ্যা আর শেষ Booking। Imran Kabir এর পাশে 0 আর খালি ঘর খুঁজে নিন।",
      },
      {
        title: "Error আর তার সমাধান",
        description:
          "তৃতীয় ফাইলের প্রথম Query ইচ্ছা করে ভুল। Error টা পড়ুন, তারপর দ্বিতীয় Query তে ORDER BY ... LIMIT 1 দিয়ে সমাধান দেখুন।",
      },
      {
        title: "দলের সবশেষ",
        description: "চতুর্থ ফাইলে প্রতিটা Customer এর সবশেষ Booking, আর প্রতিটা Guide এর সবচেয়ে দামি ট্যুর।",
      },
      {
        title: "সবগুলো প্রশ্ন",
        description:
          "পঞ্চম ফাইলে NOT EXISTS এর পাঁচটা ট্যুর, আর EXISTS যোগ করার পর চারটা। Family Package কোথায় গেল, লক্ষ করুন।",
      },
      {
        title: "নামের ফাঁদ আর Plan",
        description:
          "ষষ্ঠ ফাইলে ভুল নামের 15, ঠিক Query এর 12, আর EXPLAIN ANALYZE এ SubPlan এর loops=15। নিজের psql এ Plan এর খুঁটিনাটি একটু আলাদা হতে পারে।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-two-averages.sql",
        code: `SELECT b.booking_id, b.customer_id, b.total_bdt
FROM bookings b
WHERE b.total_bdt > (SELECT avg(total_bdt) FROM bookings)
ORDER BY b.booking_id;
-- (13 rows)

SELECT b.booking_id, b.customer_id, b.total_bdt
FROM bookings b
WHERE b.total_bdt > (SELECT avg(b2.total_bdt)
                     FROM bookings b2
                     WHERE b2.customer_id = b.customer_id)
ORDER BY b.booking_id;
-- (8 rows): 2, 4, 6, 15, 17, 19, 20, 23`,
      },
      {
        language: "sql",
        filename: "02-in-select.sql",
        code: `SELECT c.customer_id,
       c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings,
       (SELECT max(b.booked_at) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS last_booked
FROM customers c
ORDER BY c.customer_id;
-- (15 rows), Imran Kabir: 0 আর খালি last_booked`,
      },
      {
        language: "sql",
        filename: "03-zero-or-many.sql",
        code: `SELECT c.full_name,
       (SELECT b.booking_id FROM bookings b
        WHERE b.customer_id = c.customer_id) AS booking
FROM customers c;
-- ERROR:  more than one row returned by a subquery used as an expression

SELECT c.full_name,
       (SELECT b.booking_id FROM bookings b
        WHERE b.customer_id = c.customer_id
        ORDER BY b.booked_at DESC
        LIMIT 1) AS latest_booking
FROM customers c
ORDER BY c.customer_id;
-- (15 rows), Rahim 17, Imran খালি`,
      },
      {
        language: "sql",
        filename: "04-latest-per-group.sql",
        code: `SELECT b.customer_id, b.booking_id, b.booked_at
FROM bookings b
WHERE b.booked_at = (SELECT max(b2.booked_at)
                     FROM bookings b2
                     WHERE b2.customer_id = b.customer_id)
ORDER BY b.customer_id;
-- (14 rows)

SELECT t.guide_id, t.title, t.price_bdt
FROM tours t
WHERE t.price_bdt = (SELECT max(t2.price_bdt)
                     FROM tours t2
                     WHERE t2.guide_id = t.guide_id)
ORDER BY t.guide_id;
-- (4 rows): guide 1 থেকে 4, Ratargul নেই`,
      },
      {
        language: "sql",
        filename: "05-for-all.sql",
        code: `SELECT t.tour_id, t.title
FROM tours t
WHERE NOT EXISTS (SELECT 1 FROM departures d
                  WHERE d.tour_id = t.tour_id
                    AND d.seats_left > 15)
ORDER BY t.tour_id;
-- (5 rows): 3, 5, 7, 8, 9

SELECT t.tour_id, t.title
FROM tours t
WHERE EXISTS (SELECT 1 FROM departures d
              WHERE d.tour_id = t.tour_id)
  AND NOT EXISTS (SELECT 1 FROM departures d
                  WHERE d.tour_id = t.tour_id
                    AND d.seats_left > 15)
ORDER BY t.tour_id;
-- (4 rows): 3, 5, 7, 8`,
      },
      {
        language: "sql",
        filename: "06-scope-and-plan.sql",
        code: `SELECT count(*) FROM customers c
WHERE c.customer_id IN (SELECT customer_id FROM payments);
-- 15, ভুল: customer_id বাইরের c এর হয়ে গেছে

SELECT count(*) FROM customers c
WHERE EXISTS (SELECT 1
              FROM bookings b
              JOIN payments p ON p.booking_id = b.booking_id
              WHERE b.customer_id = c.customer_id
                AND p.status = 'paid');
-- 12

EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT c.full_name,
       (SELECT count(*) FROM bookings b
        WHERE b.customer_id = c.customer_id) AS bookings
FROM customers c;
-- SubPlan 1 এর নিচে: Aggregate (actual rows=1.00 loops=15)`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Subquery লেখার পর একবার নিজেকে জিজ্ঞেস করুন: এর ভেতরের প্রতিটা Column এর আগে কি Alias আছে, আর ভেতরের
        Query টা আলাদা করে কেটে চালালে কি Error আসবে? Error আসলে সেটা Correlated, না আসলে Uncorrelated। এই দুই প্রশ্নের
        অভ্যাস এই লেসনের প্রায় সব ভুল আগেই ধরে ফেলে।
      </ContentParagraph>
    ),
  },
};
