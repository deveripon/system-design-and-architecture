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
  CaseFlowLab,
  StatusOrderLab,
} from "../../../components/course/topics/reading-data/case-animations";
import {
  CaseAnatomyDiagram,
  FirstTrueWinsSplit,
  ModuleThreeStoryDiagram,
  SimpleVsSearchedSplit,
} from "../../../components/course/topics/reading-data/case-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[0.9em] text-foreground">{children}</code>;
}

/** The nine Module 03 lessons, for the module recap. */
const MODULE_LESSONS = [
  { id: "select-from", title: "SELECT and FROM", takeaway: "কোন Table থেকে কোন Column, Expression আর Alias সহ।" },
  { id: "query-order", title: "The Logical Order of a Query", takeaway: "লেখার ক্রম আর চলার ক্রম আলাদা, তাই WHERE এ Alias চলে না।" },
  { id: "where-filters", title: "WHERE with AND, OR, NOT", takeaway: "শর্ত দিয়ে Row ছাঁকা, আর AND আগে খাটে বলে Bracket জরুরি।" },
  { id: "in-between-like", title: "IN, BETWEEN, LIKE and ILIKE", takeaway: "তালিকা, সীমা আর নামের অংশ মিলিয়ে খোঁজা।" },
  { id: "null-logic", title: "NULL and Three-valued Logic", takeaway: "NULL মানে অজানা, তাই = NULL কখনো মেলে না, IS NULL লাগে।" },
  { id: "order-by", title: "ORDER BY", takeaway: "ORDER BY ছাড়া কোনো ক্রমের নিশ্চয়তা নেই, আর সমান হলে একটা Tie-breaker।" },
  { id: "limit-pagination", title: "LIMIT, OFFSET and Pagination", takeaway: "প্রথম কয়েকটা Row, পাতায় পাতায় দেখানো, আর বড় Table এ Keyset।" },
  { id: "distinct", title: "DISTINCT", takeaway: "একই Row একবার, আর DISTINCT ON দিয়ে প্রতিটা দলের একটা।" },
  { id: "case-expression", title: "CASE Expressions", takeaway: "Query এর ভেতরে যদি আর তাহলে, লেবেল আর নিজের পছন্দের ক্রম।" },
];

export const caseExpressionContent: TopicData = {
  id: "case-expression",
  introduction: {
    badge: "MODULE 03 · LESSON 09",
    title: <SectionTitle>CASE: Query এর ভেতরে যদি আর তাহলে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Marketing দল একটা অনুরোধ পাঠিয়েছে। Website এর ট্যুর
          তালিকায় প্রতিটা ট্যুরের পাশে একটা ছোট লেবেল চাই: Budget, Standard অথবা
          Premium। Support দলের অনুরোধ আরেকটা। Booking তালিকায় pending, confirmed
          আর cancelled এর মতো কাঁচা শব্দ না দেখিয়ে মানুষের বোঝার মতো লেখা দেখাতে
          হবে, আর যেগুলো এখনো টাকার অপেক্ষায় আছে সেগুলো থাকবে সবার উপরে।
        </ContentParagraph>
        <ContentParagraph>
          মুশকিল হলো Table এ এমন কোনো Column নেই। price_band নামে কিছু রাখা হয়নি,
          আর status এর মান বদলানোও চলবে না, কারণ App এর বাকি সব জায়গা ঠিক ওই
          শব্দগুলোর উপর নির্ভর করে। দরকার একটা উপায়, যেটা Query চলার সময় প্রতিটা
          Row দেখে একটা সিদ্ধান্ত নেবে: দাম এত হলে এই লেবেল, ওত হলে ওই লেবেল।
          SQL এ সেই উপায়ের নাম CASE।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি CASE লিখতে শিখবেন একদম গোড়া থেকে: কীভাবে লিখতে হয়, কোন
          ক্রমে শর্ত পরীক্ষা হয়, কোনো শর্ত না মিললে কী হয়, আর একই CASE কীভাবে
          SELECT, ORDER BY আর WHERE তিন জায়গাতেই কাজ করে। এটা Module 03 এর শেষ
          লেসন, তাই শেষে পুরো মডিউলটা একটা Query তে জোড়া দেবেন, তারপর রওনা দেবেন
          Module 04 এর দিকে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "পোস্ট অফিসের বাছাই টেবিলে একজন কর্মী প্রতিটা চিঠি হাতে নিয়ে একটা তালিকা ধরে মেলান: ঢাকার হলে প্রথম বাক্সে, চট্টগ্রামের হলে দ্বিতীয়টায়, বাকি সব শেষ বাক্সে। প্রথম যে নিয়মটা মিলে যায়, চিঠিটা সেখানেই যায়। CASE ঠিক এই কর্মী।",
      author: "CASE",
      role: "Lesson 09",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Data একই, দেখানোর ধরন আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখন পর্যন্ত এই মডিউলে আপনার লেখা প্রতিটা Query Table এ যা আছে তাই
                দেখিয়েছে, হয়তো ছেঁটে, হয়তো সাজিয়ে, হয়তো দুটো Column গুণ করে। কিন্তু
                প্রতিবার নিয়মটা ছিল সব Row এর জন্য একই। price_bdt * 2 লিখলে সব Row এর
                দাম দ্বিগুণ হয়। কোনো Row এর জন্য আলাদা আচরণ করার উপায় ছিল না।
              </ContentParagraph>
              <ContentParagraph>
                বাস্তবের প্রশ্নগুলো প্রায়ই এমন না। একজন মানুষ যখন হাতে একটা তালিকা নিয়ে
                লেবেল বসান, তিনি প্রতিটা লাইন দেখে ভাবেন: এটার দাম আট হাজারের কম,
                তাহলে Budget। এটা পনেরো হাজারের কম, তাহলে Standard। বাকি সব Premium।
                প্রতিটা Row এর জন্য আলাদা সিদ্ধান্ত, কিন্তু একই নিয়মের তালিকা ধরে।
              </ContentParagraph>
              <ContentParagraph>
                প্রোগ্রামিংয়ে এই কাজটা করে if, else if আর else। SQL এ আলাদা কোনো if
                নেই, আছে CASE Expression। Expression শব্দটা গুরুত্বপূর্ণ: CASE কোনো
                Command না, এটা একটা মান বানায়, ঠিক যেমন price_bdt * 2 একটা মান বানায়।
                তাই যেখানে একটা মান লেখা যায়, সেখানেই CASE লেখা যায়: SELECT এর Column
                এ, ORDER BY তে, WHERE এর শর্তে, এমনকি অঙ্কের ভেতরে।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা কথা শুরুতেই পরিষ্কার থাকা ভালো। CASE Table এর Data বদলায় না।
                Query শেষ হলে tours Table ঠিক আগের মতোই থাকে। CASE শুধু ফলাফলের নতুন,
                অস্থায়ী Table এ একটা বাড়তি Column বানায়, যেটা Lesson 01 এ দেখা SELECT
                এর ফলাফলেরই অংশ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে CASE",
          content: (
            <ContentParagraph>
              CASE প্রতিটা Row এর জন্য উপর থেকে নিচে কয়েকটা শর্ত পরীক্ষা করে, প্রথম যে
              শর্তটা সত্য হয় তার উত্তর ফেরত দেয়, আর কোনোটা সত্য না হলে দেয় ELSE এর
              উত্তর, ELSE না থাকলে NULL।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-case-is",
      subHeader: { index: "002", title: "What CASE Is" },
      title: <SectionTitle>প্রথম CASE: তিনটা দামের দল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Marketing এর অনুরোধটা দিয়েই শুরু করা যাক। নিয়ম তিনটা: আট হাজার টাকার
              কম দাম হলে Budget, পনেরো হাজারের কম হলে Standard, বাকি সব Premium।
              নিচের ছবিতে একটা CASE এর প্রতিটা অংশ আলাদা করে দেখানো আছে। প্রথমবার
              পড়ার সময় শুধু এটুকু খেয়াল করুন: পুরো CASE থেকে END পর্যন্ত অংশটা মিলে
              SELECT এর একটা Column।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CaseAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>CASE</strong> শুরু জানায়: এখান থেকে নিয়মের তালিকা।
              </ListItem>
              <ListItem>
                <strong>WHEN শর্ত THEN উত্তর</strong> একটা নিয়ম। শর্তটা WHERE এর
                শর্তের মতোই লেখা হয়, যেমন price_bdt &lt; 8000। যত নিয়ম দরকার, তত জোড়া
                WHEN আর THEN লিখবেন।
              </ListItem>
              <ListItem>
                <strong>ELSE উত্তর</strong> সেই Row গুলোর জন্য যাদের কোনো শর্তই মেলেনি।
                এটা ঐচ্ছিক, কিন্তু না দিলে কী হয় তা Section 004 এ দেখবেন।
              </ListItem>
              <ListItem>
                <strong>END</strong> তালিকা শেষ। এটা ভুলে গেলে PostgreSQL Syntax Error
                দেয়, আর নতুনদের সবচেয়ে বেশি হওয়া CASE এর ভুল এটাই।
              </ListItem>
              <ListItem>
                <strong>AS price_band</strong> নতুন Column এর নাম, Lesson 01 এর Alias।
                না দিলে PostgreSQL Column এর নাম দেয় case, যেটা কারো কাজে আসে না।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নয়টা ট্যুর, তিনটা দল"
              query={`SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
ORDER BY price_bdt;`}
              caption="দুটো Budget (Ratargul আর Sylhet), চারটা Standard, আর তিনটা Premium। খেয়াল করুন 12500 টাকার Saint Martin Island Escape কেন Standard: সেটা দ্বিতীয় শর্তে প্রথম সত্য হয়েছে। সীমা বদলে নিজে চালিয়ে দেখুন, যেমন 8000 এর জায়গায় 9000।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Query টা ভালো করে পড়ুন। শর্তগুলো লেখা হয়েছে একটার নিচে আরেকটা, প্রতিটা
              WHEN নিজের লাইনে। PostgreSQL এর কাছে লাইন ভাঙা বা ফাঁকা জায়গার কোনো মানে
              নেই, পুরোটা এক লাইনে লিখলেও চলত। কিন্তু মানুষের চোখের জন্য এভাবে সাজানো
              CASE পড়া অনেক সহজ, আর ভুল ধরাও সহজ। এখন আপনার পালা।
            </ContentParagraph>
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
                  Marketing এর মন বদলেছে। এখন দুটো দলই যথেষ্ট: দাম দশ হাজারের কম হলে{" "}
                  <Code>Saver</Code>, বাকি সব <Code>Classic</Code>। প্রতিটা ট্যুরের{" "}
                  <Code>title</Code> আর লেবেলটা দেখান, লেবেলের Column এর নাম{" "}
                  <Code>tour_class</Code>, সবচেয়ে সস্তা ট্যুর আগে।
                </>
              }
              hint={
                <>
                  একটাই WHEN লাগবে: <Code>WHEN price_bdt &lt; 10000 THEN {"'Saver'"}</Code>, তারপর
                  ELSE। সাজানো দামের উপর, যদিও দাম Column হিসেবে দেখানোর দরকার নেই।
                </>
              }
              solution={`SELECT title,
       CASE
         WHEN price_bdt < 10000 THEN 'Saver'
         ELSE 'Classic'
       END AS tour_class
FROM tours
ORDER BY price_bdt;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "first-true-wins",
      subHeader: { index: "003", title: "First True Wins" },
      title: <SectionTitle>উপর থেকে নিচে, প্রথম সত্যতেই থামা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                আগের Query তে Sylhet Tea Garden Tour এর দাম 7800। এই দাম প্রথম শর্ত
                price_bdt &lt; 8000 এও সত্য, দ্বিতীয় শর্ত price_bdt &lt; 15000 এও সত্য।
                তাহলে সে Budget পেল কেন, Standard কেন না? কারণ CASE এর সবচেয়ে
                গুরুত্বপূর্ণ নিয়ম: শর্তগুলো উপর থেকে নিচে পরীক্ষা হয়, আর প্রথম যে শর্ত
                সত্য হয় সেখানেই উত্তর ঠিক হয়ে যায়। বাকি শর্তগুলো সেই Row এর জন্য আর
                দেখাই হয় না।
              </ContentParagraph>
              <ContentParagraph>
                এই নিয়মটা জানা না থাকলে খুব সহজে এমন CASE লেখা হয়ে যায় যেটা দেখতে
                ঠিক, চলেও কোনো Error ছাড়া, অথচ উত্তর ভুল। নিচের ছবিতে একই তিনটা শর্ত
                দুই ক্রমে সাজানো।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FirstTrueWinsSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="উল্টো ক্রমের ফাঁদ"
              query={`SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt >= 5000  THEN 'Standard'
         WHEN price_bdt >= 15000 THEN 'Premium'
         ELSE 'Budget'
       END AS price_band
FROM tours
ORDER BY price_bdt;`}
              caption="ফলাফলে একটাও Premium নেই, এমনকি 32000 টাকার Luxury Stay ও Standard। দ্বিতীয় WHEN কখনো কোনো Row পর্যন্ত পৌঁছায় না, কারণ পনেরো হাজারের বেশি যেকোনো দাম পাঁচ হাজারেরও বেশি। ঠিক করতে দুই WHEN এর জায়গা অদলবদল করুন, তারপর আবার চালান।"
            />
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CaseFlowLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "শর্ত সাজানোর দুটো নিরাপদ অভ্যাস",
          content: (
            <ContentList>
              <ListItem>
                সীমা দিয়ে দল বানালে একদিকে চলুন। হয় ছোট থেকে বড় (&lt; 8000, তারপর &lt;
                15000), নয়তো বড় থেকে ছোট (&gt;= 15000, তারপর &gt;= 8000)। দুইদিক মেশালেই
                ফাঁদ।
              </ListItem>
              <ListItem>
                সবচেয়ে নির্দিষ্ট শর্ত সবার আগে। যেমন guide_id IS NULL এর মতো বিশেষ
                অবস্থা আগে ধরুন, সাধারণ নিয়ম পরে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "else-and-null",
      subHeader: { index: "004", title: "ELSE and NULL" },
      title: <SectionTitle>কোনো শর্ত না মিললে কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ELSE ঐচ্ছিক। কিন্তু ঐচ্ছিক মানে এই না যে তার কাজ নেই। কোনো Row এর জন্য
                একটাও WHEN সত্য না হলে, আর ELSE ও না থাকলে, CASE এর উত্তর হয় NULL।
                PostgreSQL কোনো Error দেয় না, কোনো সতর্কবার্তাও না। Lesson 05 এ দেখেছেন
                NULL মানে অজানা। এখানে NULL এর মানে আরও সহজ: আপনার নিয়মের তালিকায় এই
                Row এর জন্য কিছু লেখা ছিল না।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর অফিসিয়াল Docs ঠিক এটাই বলে: ELSE বাদ দিলে আর কোনো শর্ত
                সত্য না হলে ফলাফল NULL। নিচের Query তে Premium এর ELSE টা ইচ্ছা করে বাদ
                দেওয়া হয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ELSE ভুলে গেলে"
              query={`SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
       END AS price_band
FROM tours
ORDER BY price_bdt;`}
              caption="শেষ তিনটা ট্যুরের price_band ঘরে NULL। Website এ এই তিনটা ট্যুর কোনো লেবেল ছাড়া দেখাত, আর কেউ টেরও পেত না কেন। ভালো অভ্যাস: প্রায় সব CASE এ একটা ELSE রাখুন, এমনকি ELSE 'Other' হলেও, যাতে ফাঁক চোখে পড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার উল্টো দিক। Input এর মধ্যেই যদি NULL থাকে? Sample Database এ
                Ratargul Swamp Boat Day এর guide_id NULL, কারণ এখনো কোনো Guide ঠিক হয়নি।
                Operations দল চায় প্রতিটা ট্যুরের পাশে লেখা থাকুক Guide ঠিক আছে কিনা।
                Lesson 05 এর নিয়মটা এখানেও খাটে: NULL কে = দিয়ে ধরা যায় না, লাগে IS
                NULL। তাই WHEN এর ভেতরে IS NULL লিখতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Guide আছে কিনা"
              query={`SELECT title,
       guide_id,
       CASE
         WHEN guide_id IS NULL THEN 'Guide not assigned'
         ELSE 'Guide ready'
       END AS guide_status
FROM tours
ORDER BY tour_id;`}
              caption="নয়টার মধ্যে শুধু Ratargul এর পাশে Guide not assigned। guide_id এর ঘর খালি দেখাচ্ছে মানে NULL, আর CASE সেটাকে একটা পরিষ্কার বাক্যে বদলে দিয়েছে, যেটা Operations এর একজন মানুষ এক নজরে বোঝেন।"
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
                  Support দল Customer দের ফোন করবে। প্রত্যেক Customer এর{" "}
                  <Code>customer_id</Code>, <Code>full_name</Code> আর <Code>contact</Code>{" "}
                  নামে একটা Column দেখান: ফোন নম্বর থাকলে নম্বরটাই, না থাকলে লেখা{" "}
                  <Code>No phone</Code>। <Code>customer_id</Code> অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  ফোন না থাকা মানে <Code>phone IS NULL</Code>। ELSE এ সরাসরি Column এর নাম{" "}
                  <Code>phone</Code> লিখলেই নম্বরটা আসবে, কারণ THEN আর ELSE এ শুধু লেখা
                  না, যেকোনো মান বসানো যায়।
                </>
              }
              solution={`SELECT customer_id,
       full_name,
       CASE
         WHEN phone IS NULL THEN 'No phone'
         ELSE phone
       END AS contact
FROM customers
ORDER BY customer_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এর একটা ছোট রাস্তাও আছে",
          content: (
            <ContentParagraph>
              NULL হলে একটা বিকল্প মান বসানো এত সাধারণ কাজ যে SQL এ এর জন্য আলাদা
              Function আছে: COALESCE(phone, &apos;No phone&apos;)। এটা ঠিক উপরের CASE এর
              কাজটাই করে, অনেক ছোট করে। COALESCE বিস্তারিত শিখবেন Module 04 এ। CASE জানা
              থাকলে COALESCE আসলে কী করে তা আর মুখস্থ করতে হয় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "simple-case",
      subHeader: { index: "005", title: "Simple CASE" },
      title: <SectionTitle>Simple CASE: একটা Column, অনেকগুলো মান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এতক্ষণ যে CASE লিখেছেন, তার নাম Searched CASE: প্রতিটা WHEN এর পরে একটা
                পূর্ণ শর্ত। CASE এর আরেকটা ছোট রূপ আছে, যার নাম Simple CASE। যখন আপনি
                একটাই Column এর মান কয়েকটা নির্দিষ্ট মানের সাথে মেলাতে চান, তখন Column
                টা একবার CASE এর ঠিক পরে লিখে দিলেই হয়, প্রতিটা WHEN এ শুধু মানটা।
              </ContentParagraph>
              <ContentParagraph>
                Support দলের দ্বিতীয় অনুরোধ, status এর জায়গায় মানুষের বোঝার মতো লেখা,
                ঠিক এরকম একটা কাজ। status এর মান তিনটার একটা, আর প্রতিটার জন্য একটা
                বাক্য।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SimpleVsSearchedSplit /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Simple CASE দিয়ে Status এর লেখা"
              query={`SELECT booking_id,
       status,
       CASE status
         WHEN 'confirmed' THEN 'Confirmed, seat held'
         WHEN 'pending'   THEN 'Waiting for payment'
         WHEN 'cancelled' THEN 'Cancelled'
       END AS status_label
FROM bookings
ORDER BY booking_id
LIMIT 6;`}
              caption="CASE status লেখার মানে: প্রতিটা WHEN এর মানের সাথে status সমান কিনা, সেটা মেলানো হবে। প্রথম ছয়টা Booking এর মধ্যে পাঁচটা confirmed, একটা (5) cancelled। LIMIT সরিয়ে দিলে ২৪টাই দেখবেন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Simple CASE পড়তে সুন্দর, কিন্তু তার একটা সীমা আছে, আর সেই সীমা থেকেই
                একটা বিখ্যাত ভুল। Simple CASE ভেতরে ভেতরে প্রতিটা WHEN কে = দিয়ে মেলায়।
                অর্থাৎ CASE guide_id WHEN NULL আসলে জিজ্ঞেস করে guide_id = NULL, আর
                Lesson 05 থেকে জানেন এই প্রশ্নের উত্তর কখনো সত্য হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHEN NULL এর ফাঁদ"
              query={`SELECT title,
       guide_id,
       CASE guide_id
         WHEN NULL THEN 'Guide not assigned'
         ELSE 'Guide ready'
       END AS guide_status
FROM tours
WHERE tour_id IN (6, 7)
ORDER BY tour_id;`}
              caption="Ratargul এর guide_id সত্যিই NULL, তবু উত্তর এসেছে Guide ready। WHEN NULL কখনো মেলে না, তাই প্রতিটা Row ELSE এ গিয়ে পড়ে। সমাধান Section 004 এর Searched CASE: WHEN guide_id IS NULL।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "কখন কোন CASE",
          content: (
            <ContentList>
              <ListItem>
                একটা Column, কয়েকটা নির্দিষ্ট মান, কোনো NULL পরীক্ষা নেই: Simple CASE।
              </ListItem>
              <ListItem>
                &lt;, &gt;, BETWEEN, LIKE, IS NULL, অথবা একাধিক Column: Searched CASE।
              </ListItem>
              <ListItem>
                সন্দেহ থাকলে Searched লিখুন। Simple দিয়ে যা লেখা যায়, Searched দিয়েও
                সবটা লেখা যায়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "one-result-type",
      subHeader: { index: "006", title: "One Result Type" },
      title: <SectionTitle>সব উত্তর একই ধরনের হতে হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CASE একটা Column বানায়, আর একটা Column এর সব ঘরের Data Type একই হতে
                হয়। Lesson 04 এর ভাষায়, একটা Column হয় সব সংখ্যা, নয়তো সব লেখা,
                দুটো মেশানো চলে না। তাই সব THEN আর ELSE এর উত্তর মিলে একটা ধরনে আসতে
                হবে। PostgreSQL এর Docs এর ভাষায়: সব ফলাফলকে একটা একক Output Type এ
                রূপান্তর করা যেতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                ধরুন আপনি চাইলেন সস্তা ট্যুরের পাশে লেখা থাকুক cheap, বাকিদের পাশে দাম।
                একদিকে লেখা, অন্যদিকে numeric। দেখুন PostgreSQL কী বলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="লেখা আর সংখ্যা মেশালে"
              query={`SELECT title,
       CASE
         WHEN price_bdt < 8000 THEN 'cheap'
         ELSE price_bdt
       END AS price_note
FROM tours;`}
              caption="Error এর লেখাটা প্রথমবার একটু অদ্ভুত লাগে: invalid input syntax for type numeric: &quot;cheap&quot;। PostgreSQL দেখেছে ELSE এর উত্তর numeric, তাই ধরে নিয়েছে পুরো Column numeric, আর তারপর cheap শব্দটাকে সংখ্যা হিসেবে পড়ার চেষ্টা করে ব্যর্থ হয়েছে। এবার ELSE এর লাইনটা বদলে লিখুন ELSE price_bdt::text আর আবার চালান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                price_bdt::text মানে দামটাকে লেখায় রূপান্তর করা। :: কে বলে Cast, আর এর
                বিস্তারিত আছে Module 04 এ। এখন এটুকু জানলেই চলে: দুই দিকের উত্তর একই
                ধরনে আনলে Error চলে যায়, আর সস্তা দুটো ট্যুরের পাশে cheap, বাকিদের পাশে
                দাম দেখা যায়, তবে এবার দাম আর সংখ্যা না, লেখা।
              </ContentParagraph>
              <ContentParagraph>
                একই Error এর আরেকটা চেহারাও আছে। cheap লেখাটা যদি আগে থেকেই text বলে
                চিহ্নিত থাকে, যেমন &apos;cheap&apos;::text, তখন PostgreSQL আর অনুমান করে
                না, সরাসরি বলে দেয়: CASE types numeric and text cannot be matched। দুটো
                বার্তার মানে একই: দুই ধরনের উত্তর এক Column এ বসছে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দুই চেহারার একই Error",
          code: `-- ELSE price_bdt, THEN 'cheap'
ERROR:  invalid input syntax for type numeric: "cheap"

-- ELSE price_bdt, THEN 'cheap'::text
ERROR:  CASE types numeric and text cannot be matched`,
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "case-in-select",
      subHeader: { index: "007", title: "CASE in SELECT" },
      title: <SectionTitle>SELECT এ CASE: কাঁচা মানকে মানুষের ভাষায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CASE সবচেয়ে বেশি দেখা যায় SELECT এর ভেতরে, Column হিসেবে। Database এ
                মান রাখা হয় ছোট, স্থির আর Program এর জন্য সুবিধাজনক রূপে: bkash, nagad,
                card, bank। Report এ বা Admin Panel এ দেখানোর সময় দরকার হয় সুন্দর লেখা:
                bKash, Nagad, Card, Bank transfer। এক Query তে একাধিক CASE ও রাখা যায়,
                প্রতিটা আলাদা Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Payment এর পদ্ধতি সুন্দর করে"
              query={`SELECT payment_id,
       method,
       CASE method
         WHEN 'bkash' THEN 'bKash'
         WHEN 'nagad' THEN 'Nagad'
         WHEN 'card'  THEN 'Card'
         WHEN 'bank'  THEN 'Bank transfer'
       END AS method_label,
       status
FROM payments
ORDER BY payment_id
LIMIT 6;`}
              caption="method Column টা অপরিবর্তিত, পাশে নতুন method_label। Payment 5 এর status refunded, পরের Exercise এ সেটাই কাজে লাগবে।"
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
                  Accounts দল জানতে চায় প্রতিটা Payment এ টাকা আসলে হাতে এসেছে কিনা।
                  প্রতিটা Payment এর <Code>payment_id</Code> আর <Code>money</Code> নামে
                  একটা Column দেখান: <Code>paid</Code> হলে <Code>Money received</Code>,{" "}
                  <Code>refunded</Code> হলে <Code>Money returned</Code>, <Code>failed</Code>{" "}
                  হলে <Code>Not received</Code>। <Code>payment_id</Code> অনুযায়ী সাজান।
                </>
              }
              hint={
                <>
                  একটাই Column এর তিনটা নির্দিষ্ট মান, কোনো NULL নেই: Simple CASE এর
                  আদর্শ জায়গা। <Code>CASE status WHEN {"'paid'"} THEN ...</Code>
                </>
              }
              solution={`SELECT payment_id,
       CASE status
         WHEN 'paid'     THEN 'Money received'
         WHEN 'refunded' THEN 'Money returned'
         WHEN 'failed'   THEN 'Not received'
       END AS money
FROM payments
ORDER BY payment_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "লেবেল কোথায় থাকা উচিত",
          content: (
            <ContentParagraph>
              Report বা একবারের বিশ্লেষণের জন্য CASE দিয়ে লেবেল বানানো দারুণ। কিন্তু একই
              লেবেল যদি Website, Mobile App আর Email সব জায়গায় লাগে, আর বাংলা ও ইংরেজি
              দুই ভাষায়, তখন সেটা প্রতিটা Query তে CASE হিসেবে কপি করা বিপদ। একদিন একটা
              জায়গায় বদলাবেন, বাকিগুলোয় ভুলে যাবেন। তখন লেবেল রাখার জায়গা হয় App এর
              Code, অথবা Database এর একটা আলাদা ছোট Table। দ্বিতীয় পথটা Module 11 এর
              Database Design এ দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "case-in-order-by",
      subHeader: { index: "008", title: "CASE in ORDER BY" },
      title: <SectionTitle>ORDER BY এ CASE: নিজের পছন্দের ক্রম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Support এর অনুরোধের শেষ অংশ: টাকার অপেক্ষায় থাকা Booking গুলো সবার
                উপরে। Lesson 06 এর ORDER BY status দিয়ে এটা হয় না, কারণ লেখা সাজানো হয়
                বর্ণমালা অনুযায়ী: cancelled, confirmed, pending। c আগে, p শেষে। ঠিক
                উল্টো যা দরকার।
              </ContentParagraph>
              <ContentParagraph>
                কৌশলটা সহজ। প্রতিটা status কে একটা সংখ্যা দিন, CASE দিয়ে, তারপর সেই
                সংখ্যা অনুযায়ী সাজান। সংখ্যাটা ফলাফলে দেখানোর দরকার নেই, CASE টা সরাসরি
                ORDER BY এর ভেতরে লেখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="pending সবার আগে"
              query={`SELECT booking_id, status, booked_at
FROM bookings
ORDER BY CASE status
           WHEN 'pending'   THEN 1
           WHEN 'confirmed' THEN 2
           WHEN 'cancelled' THEN 3
         END,
         booked_at DESC;`}
              caption="প্রথম চারটা Row pending (24, 20, 17, 14), প্রতিটা দলের ভেতরে নতুন Booking আগে। CASE শুধু সাজানোর চাবি বানিয়েছে, ফলাফলে কোনো 1, 2, 3 দেখা যাচ্ছে না। দ্বিতীয় চাবি booked_at DESC না থাকলে একই দলের ভেতরে ক্রমের কোনো নিশ্চয়তা থাকত না, Lesson 06 এর Tie-breaker এর নিয়ম।"
            />
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatusOrderLab /> },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4"
              orderMatters
              task={
                <>
                  Refund দেখেন এমন একজন সহকর্মীর জন্য Booking এর তালিকা:{" "}
                  <Code>booking_id</Code> আর <Code>status</Code>, যেখানে আগে সব{" "}
                  <Code>cancelled</Code>, তারপর <Code>pending</Code>, শেষে{" "}
                  <Code>confirmed</Code>। প্রতিটা দলের ভেতরে <Code>booking_id</Code> ছোট
                  থেকে বড়।
                </>
              }
              hint={
                <>
                  ORDER BY তে দুটো চাবি: প্রথমে একটা CASE যেটা cancelled কে 1, pending কে
                  2 দেয়, তারপর কমা দিয়ে <Code>booking_id</Code>।
                </>
              }
              solution={`SELECT booking_id, status
FROM bookings
ORDER BY CASE status
           WHEN 'cancelled' THEN 1
           WHEN 'pending'   THEN 2
           ELSE 3
         END,
         booking_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "case-in-where",
      subHeader: { index: "009", title: "CASE in WHERE" },
      title: <SectionTitle>WHERE এ CASE: চলে, তবে প্রায়ই দরকার নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CASE একটা মান বানায়, আর সেই মান true বা false হলে সেটা WHERE এর শর্ত
                হিসেবেও কাজ করে। নিচের প্রথম Query বলে: ট্যুর চালু থাকলে দেখা হবে দাম দশ
                হাজারের কম কিনা, চালু না থাকলে সোজা false। দ্বিতীয় Query একই কথা বলে AND
                দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, দুইভাবে"
              query={`SELECT title, price_bdt
FROM tours
WHERE CASE
        WHEN is_active THEN price_bdt < 10000
        ELSE false
      END
ORDER BY price_bdt;

SELECT title, price_bdt
FROM tours
WHERE is_active AND price_bdt < 10000
ORDER BY price_bdt;`}
              caption="দুটোই একই চারটা ট্যুর দেয়। দ্বিতীয়টা ছোট, পড়তে সহজ, আর Database এর পক্ষে দ্রুত চালানোও সহজ। তাই সাধারণ নিয়ম: WHERE এ CASE লেখার আগে দেখুন AND, OR দিয়ে কথাটা বলা যায় কিনা। প্রায় সবসময় যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তবু WHERE এ CASE এর একটা সত্যিকারের কাজ আছে, আর PostgreSQL এর Docs
                নিজেই সেটার উদাহরণ দেয়: শূন্য দিয়ে ভাগ আটকানো। CASE শুধু সেই অংশগুলোই
                হিসাব করে যেগুলো উত্তর বের করতে লাগে। তাই WHEN x &lt;&gt; 0 THEN y / x
                লিখলে x শূন্য হলে ভাগটা কখনো চালানোই হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতিদিনের দাম চার হাজারের বেশি, নিরাপদে"
              query={`SELECT title, price_bdt, duration_days
FROM tours
WHERE CASE
        WHEN duration_days <> 0 THEN price_bdt / duration_days > 4000
        ELSE false
      END
ORDER BY price_bdt;`}
              caption="ছয়টা ট্যুরের দিনপ্রতি খরচ চার হাজারের বেশি। এই Table এ duration_days কখনো শূন্য হতে পারে না, একটা CHECK নিয়ম সেটা আটকে রেখেছে (Module 09)। কিন্তু যে Data তে এমন নিয়ম নেই, সেখানে এই পাহারাটাই division by zero Error থেকে বাঁচায়। পরীক্ষা করতে আলাদা করে SELECT 10 / 0; চালিয়ে দেখুন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "case-inside-math",
      subHeader: { index: "010", title: "CASE Inside Math" },
      title: <SectionTitle>অঙ্কের ভেতরে CASE</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CASE এর উত্তর সংখ্যা হলে সেটা অঙ্কের ভেতরেও বসে। Island Tours ঠিক করল চার
                বা তার বেশি সিট নিলে দশ শতাংশ ছাড়। প্রতিটা Booking এর জন্য নতুন দাম
                দরকার, কিন্তু ছাড় শুধু বড় দলের জন্য। CASE এখানে দুটো অঙ্কের একটা বেছে
                দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বড় দলের জন্য দশ শতাংশ ছাড়"
              query={`SELECT booking_id,
       seats,
       total_bdt,
       CASE
         WHEN seats >= 4 THEN total_bdt * 0.90
         ELSE total_bdt
       END AS after_discount
FROM bookings
WHERE status <> 'cancelled'
ORDER BY seats DESC, booking_id
LIMIT 6;`}
              caption="তিনটা বড় Booking (23, 2, 14) এর দাম কমেছে, বাকিদের অপরিবর্তিত। একটা জিনিস চোখে পড়বে: ছাড়ের দামগুলো দেখাচ্ছে 38250.0000, চার ঘর দশমিক, বাকিগুলো 25500.00। গুণ করলে দশমিকের ঘর যোগ হয়। দুই ঘরে গোল করার Function ROUND শিখবেন Module 04 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Operations এর একটা কাজ। প্রতিটা Departure এর পাশে একটা ছোট সংকেত
              চাই, যাতে বোঝা যায় কোন তারিখে সিট দ্রুত ফুরাচ্ছে। এটা সীমা দিয়ে দল বানানো,
              ঠিক দামের দলের মতো, তাই Section 003 এর ক্রমের নিয়মটা মাথায় রাখুন।
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
                  প্রতিটা Departure এর <Code>departure_id</Code>, <Code>seats_left</Code>{" "}
                  আর <Code>availability</Code> দেখান: খালি সিট ১০ বা তার কম হলে{" "}
                  <Code>Filling fast</Code>, ১৫ বা তার কম হলে <Code>Half full</Code>,
                  বাকি সব <Code>Plenty of seats</Code>। <Code>departure_id</Code> অনুযায়ী
                  সাজান।
                </>
              }
              hint={
                <>
                  ছোট সীমা আগে: <Code>WHEN seats_left &lt;= 10</Code>, তারপর{" "}
                  <Code>WHEN seats_left &lt;= 15</Code>, তারপর ELSE। উল্টো লিখলে Exercise
                  টা ঠিক Section 003 এর ফাঁদে পড়বে।
                </>
              }
              solution={`SELECT departure_id,
       seats_left,
       CASE
         WHEN seats_left <= 10 THEN 'Filling fast'
         WHEN seats_left <= 15 THEN 'Half full'
         ELSE 'Plenty of seats'
       END AS availability
FROM departures
ORDER BY departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "peek-at-counting",
      subHeader: { index: "011", title: "A Peek at Counting" },
      title: <SectionTitle>এক ঝলক সামনে: CASE দিয়ে গোনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CASE এর সবচেয়ে শক্তিশালী ব্যবহারগুলোর একটা আপনি পুরোপুরি শিখবেন Module
                05 এ, যখন অনেকগুলো Row থেকে একটা উত্তর বের করা শিখবেন। তবু একবার দেখে
                রাখা ভালো, কারণ ধারণাটা এই লেসনেরই। প্রতিটা Booking এর জন্য CASE একটা
                সংখ্যা দেয়, confirmed হলে 1, নাহলে 0। তারপর SUM সব 1 যোগ করে, অর্থাৎ
                confirmed Booking গুনে ফেলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Row তে তিন রকম গোনা"
              query={`SELECT SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
       SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM bookings;`}
              caption="উত্তর 17, 4 আর 3, একটা Row তে। SUM কীভাবে কাজ করে, আর PostgreSQL এর FILTER দিয়ে এই কাজটা আরও পরিষ্কার করে কীভাবে লেখা যায়, সেটা Module 05 এর Conditional Aggregation লেসনে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "in-mysql",
      subHeader: { index: "012", title: "In MySQL" },
      title: <SectionTitle>MySQL এ CASE, IF আর FIELD</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ভালো খবর: CASE হলো SQL Standard এর অংশ, তাই এই লেসনের প্রতিটা CASE
                MySQL 8.4 এ হুবহু চলে। এই লেসনের মূল Query গুলো MySQL 8.4 এর একটা
                Container এ চালিয়ে দেখা হয়েছে। পার্থক্যগুলো ছোট, কিন্তু MySQL এর ভিডিও
                দেখার সময় চোখে পড়বে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>IF():</strong> মাত্র দুটো পথের জন্য MySQL এর নিজস্ব Function।
                  IF(price_bdt &lt; 8000, &apos;Budget&apos;, &apos;Not budget&apos;) আর
                  CASE WHEN price_bdt &lt; 8000 THEN &apos;Budget&apos; ELSE &apos;Not
                  budget&apos; END একই কাজ করে। PostgreSQL এ IF() নেই, সেখানে CASE ই
                  লিখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>FIELD():</strong> MySQL এ নিজের পছন্দের ক্রমের একটা ছোট রাস্তা:
                  ORDER BY FIELD(status, &apos;pending&apos;, &apos;confirmed&apos;,
                  &apos;cancelled&apos;)। এটাও PostgreSQL এ নেই, সেখানে Section 008 এর
                  ORDER BY CASE।
                </ListItem>
                <ListItem>
                  <strong>লেখা আর সংখ্যা মেশানো:</strong> Section 006 এর Query টা MySQL এ
                  Error দেয় না। MySQL পুরো Column কে চুপচাপ লেখা বানিয়ে ফেলে, তাই cheap
                  আর 8500.00 পাশাপাশি বসে যায়। সুবিধাজনক মনে হলেও এর মানে MySQL আপনার
                  ভুলটা ধরিয়ে দেয় না।
                </ListItem>
                <ListItem>
                  <strong>WHEN NULL:</strong> MySQL এও CASE guide_id WHEN NULL কখনো মেলে
                  না, Ratargul সেখানেও Guide ready পায়। এই ফাঁদ দুই Database এই এক।
                </ListItem>
                <ListItem>
                  <strong>END বনাম END CASE:</strong> MySQL এর Stored Procedure এর ভেতরে
                  একটা আলাদা CASE Statement আছে, যেটা শেষ হয় END CASE দিয়ে। Query এর ভেতরের
                  CASE Expression শেষ হয় শুধু END দিয়ে, MySQL এর Docs নিজেই এই পার্থক্যটা
                  আলাদা করে লিখে রেখেছে। ভিডিওতে END CASE দেখলে বুঝবেন সেটা Procedure এর
                  ভেতরের কথা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4 (চালিয়ে দেখা Output)",
          code: `mysql> SELECT title, IF(price_bdt < 8000, 'Budget', 'Not budget') AS band
    -> FROM tours ORDER BY price_bdt LIMIT 3;
+---------------------------+------------+
| title                     | band       |
+---------------------------+------------+
| Ratargul Swamp Boat Day   | Budget     |
| Sylhet Tea Garden Tour    | Budget     |
| Cox's Bazar Beach Weekend | Not budget |
+---------------------------+------------+

mysql> SELECT booking_id, status FROM bookings
    -> ORDER BY FIELD(status, 'pending', 'confirmed', 'cancelled'), booking_id
    -> LIMIT 6;
+------------+-----------+
| booking_id | status    |
+------------+-----------+
|         14 | pending   |
|         17 | pending   |
|         20 | pending   |
|         24 | pending   |
|          1 | confirmed |
|          2 | confirmed |
+------------+-----------+`,
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "common-mistakes",
      subHeader: { index: "013", title: "Common Mistakes" },
      title: <SectionTitle>CASE এর সাতটা চেনা ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী হয়", "সমাধান"],
          rows: [
            ["END লিখতে ভুলে যাওয়া", "syntax error, প্রায়ই পরের শব্দে (FROM)", "প্রতিটা CASE এর শেষে END, তারপর AS নাম"],
            ["চওড়া শর্ত আগে", "Error ছাড়া ভুল দল, Premium কেউ পায় না", "সীমা একদিকে সাজান, নির্দিষ্ট শর্ত আগে"],
            ["ELSE না রাখা", "কিছু Row এ চুপচাপ NULL", "ELSE 'Other' রাখুন, ফাঁক চোখে পড়বে"],
            ["Simple CASE এ WHEN NULL", "কখনো মেলে না, সব ELSE এ যায়", "Searched CASE: WHEN col IS NULL"],
            ["লেখা আর সংখ্যা মেশানো", "invalid input syntax বা CASE types cannot be matched", "সব উত্তর এক ধরনে, যেমন price_bdt::text"],
            ["AS না দেওয়া", "Column এর নাম হয় case", "সবসময় একটা অর্থপূর্ণ Alias"],
            ["একই লেবেলের CASE দশ জায়গায়", "একটা বদলালে বাকিগুলো পুরনো", "App এর Code বা একটা লেবেল Table (Module 11)"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="END ভুলে গেলে, নিজে দেখুন"
              query={`SELECT title,
       CASE
         WHEN price_bdt < 8000 THEN 'Budget'
         ELSE 'Other'
       AS price_band
FROM tours;`}
              caption="Error আসবে syntax error at or near &quot;AS&quot;। PostgreSQL তখনো END এর অপেক্ষায় ছিল, তাই AS শব্দটা তার কাছে অপ্রত্যাশিত। ELSE এর লাইনের পরে END বসিয়ে আবার চালান। Error এর জায়গা আর আসল ভুলের জায়গা প্রায়ই এক লাইন আলাদা হয়, Module 02 এর Lesson 07 এর কথা।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Admin Panel এ CASE</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Island Tours এর Admin Panel খুললে Booking এর তালিকায় প্রতিটা লাইনের
                পাশে একটা রঙিন ছোট ব্যাজ থাকে: হলুদে টাকার অপেক্ষা, সবুজে নিশ্চিত,
                ধূসরে বাতিল। Backend সেই তালিকা আনে এমন একটা Query দিয়ে, যার ভেতরে দুটো
                CASE: একটা ব্যাজের লেখা বানায়, আরেকটা ORDER BY তে টাকার অপেক্ষায় থাকা
                Booking গুলো উপরে তোলে। রঙটা বসায় Frontend, কারণ রঙ দেখানোর কাজ, Data
                এর না।
              </ContentParagraph>
              <ContentParagraph>
                Website এর ট্যুর তালিকার পাশে Budget, Standard, Premium এর Filter ও একই
                ভাবনা থেকে এসেছে। এখানে টিম একটা সচেতন সিদ্ধান্ত নিয়েছে: দামের সীমা
                বদলাতে পারে, Marketing প্রায়ই বদলায়। তাই সীমাগুলো কোনো Query তে লেখা
                নেই, আছে Backend এর একটা Config এ। Query টা সীমাগুলো Parameter হিসেবে
                নেয়, যেমনটা Module 01 এর Lesson 06 এ দেখেছেন। CASE এর গঠন একই থাকে,
                শুধু সংখ্যাগুলো বাইরে থেকে আসে।
              </ContentParagraph>
              <ContentParagraph>
                আপনার নিজের my_tours এর জন্য এই লেসনের তিনটা অভ্যাস নিয়ে যান: লেবেল
                বানাতে Searched CASE, ক্রম ঠিক করতে ORDER BY CASE, আর যে লেবেল অনেক
                জায়গায় লাগে সেটা Query তে না রেখে এক জায়গায় রাখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "admin-bookings.sql (Admin Panel এর মতো একটা Query)",
          code: `SELECT booking_id,
       status,
       CASE status
         WHEN 'pending'   THEN 'Waiting for payment'
         WHEN 'confirmed' THEN 'Confirmed'
         ELSE 'Cancelled'
       END AS badge
FROM bookings
ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'confirmed' THEN 2 ELSE 3 END,
         booked_at DESC
LIMIT 10;`,
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Row এর জন্য CASE যা যা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "FROM আর WHERE আগে",
              description:
                "Lesson 02 এর ক্রম অনুযায়ী Database আগে Table থেকে Row নেয় আর WHERE দিয়ে ছাঁকে। SELECT এর CASE শুধু টিকে থাকা Row গুলোর জন্য চলে।",
            },
            {
              title: "প্রথম WHEN পরীক্ষা",
              description:
                "একটা Row হাতে নিয়ে Database প্রথম WHEN এর শর্ত দেখে। সত্য হলে THEN এর উত্তরই এই Row এর মান, বাকি শর্ত আর দেখা হয় না।",
            },
            {
              title: "পরের WHEN, একে একে",
              description:
                "শর্তটা মিথ্যা বা অজানা (NULL) হলে পরের WHEN। অজানাকে সত্য ধরা হয় না, ঠিক WHERE এর মতো।",
            },
            {
              title: "ELSE অথবা NULL",
              description:
                "কোনো WHEN সত্য না হলে ELSE এর উত্তর। ELSE না থাকলে উত্তর NULL, কোনো Error ছাড়া।",
            },
            {
              title: "এক ধরনের Column",
              description:
                "সব Row এর উত্তর মিলে একটা Column, তাই সব THEN আর ELSE এর উত্তর এক Data Type এ মিলতে হয়, নাহলে Query চলার আগেই Error।",
            },
            {
              title: "তারপর ORDER BY আর LIMIT",
              description:
                "CASE এর Column তৈরি হয়ে গেলে ORDER BY সাজায়, যেখানে আরেকটা CASE নিজের পছন্দের ক্রম দিতে পারে, আর LIMIT কয়টা দেখাবে ঠিক করে।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "module-recap",
      subHeader: { index: "016", title: "Module 03 Recap" },
      title: <SectionTitle>Module 03 এক Query তে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নয়টা লেসনে আপনি Data পড়ার পুরো ভাষাটা শিখেছেন। প্রথম দিন আপনি জানতেন
                না SELECT কী। আজ আপনি একটা Query লিখতে পারেন যেটা Table বেছে নেয়, Row
                ছাঁকে, অজানা মান সামলায়, লেবেল বসায়, নিজের পছন্দে সাজায় আর ঠিক যতটা দরকার
                ততটুকু দেখায়। নিচের ছবিটা পুরো মডিউলের মানচিত্র: Database একটা Query কোন
                ক্রমে চালায়, আর প্রতিটা ধাপ কোন লেসনে শিখেছেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ModuleThreeStoryDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লেসন", "এক লাইনে যা নিয়ে যাচ্ছেন"],
          rows: MODULE_LESSONS.map((lesson, i) => [
            <Link key={lesson.id} href={`/sql/topic/${lesson.id}`} className={LINK}>
              {String(i + 1).padStart(2, "0")} {lesson.title}
            </Link>,
            lesson.takeaway,
          ]),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব একসাথে। নিচের Query টা Website এর হোমপেজের একটা অংশ: চালু ট্যুর,
              যাদের Guide ঠিক আছে, নাম Saint দিয়ে শুরু অথবা কয়েকটা নির্দিষ্ট Destination
              এর, দামের দল সহ, সবচেয়ে দামি আগে, সর্বোচ্চ পাঁচটা। প্রতিটা লাইনের পাশে
              মনে মনে বলুন সেটা কোন লেসনের।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Module 03 এর Capstone Query"
              query={`SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
WHERE is_active
  AND guide_id IS NOT NULL
  AND (title ILIKE '%saint%' OR destination_id IN (2, 4, 5))
ORDER BY price_bdt DESC, tour_id
LIMIT 5;`}
              caption="পাঁচটা ট্যুর, শুরুতে 15500 টাকার Cox's Bazar Family Package। Saint Martin Luxury Stay নামে Saint থাকা সত্ত্বেও বাদ পড়েছে is_active এর জন্য (Lesson 03), Ratargul বাদ পড়েছে guide_id IS NOT NULL এর জন্য (Lesson 05), আর Sundarbans আর Sylhet বাদ পড়েছে শেষ শর্তে। এবার is_active AND অংশটা মুছে চালান: 32000 টাকার Luxury Stay সবার উপরে চলে আসবে আর Sajek শেষে নেমে যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DISTINCT আর CASE একসাথে একটা মজার প্রশ্নের উত্তর দেয়: চালু ট্যুরের মধ্যে
              কোন কোন দামের দল আছে? এখানে Lesson 08 এর একটা নিয়মও ধরা পড়ে, নিচের বক্সে
              প্রথম Query চলে, দ্বিতীয়টা Error দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DISTINCT, CASE আর ORDER BY এর নিয়ম"
              query={`SELECT DISTINCT
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
WHERE is_active
ORDER BY price_band;

SELECT DISTINCT
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
WHERE is_active
ORDER BY CASE WHEN price_bdt < 8000 THEN 1 ELSE 2 END;`}
              caption="প্রথম Query তিনটা দল দেয়, বর্ণমালার ক্রমে। দ্বিতীয়টা Error দেয়: for SELECT DISTINCT, ORDER BY expressions must appear in select list। DISTINCT এর পরে প্রতিটা দলের একটাই Row থাকে, সেখানে price_bdt আর নেই, তাই তা দিয়ে সাজানো যায় না। দলের নাম দিয়ে সাজান, অথবা নিজের ক্রমের সংখ্যাটাও SELECT এ রাখুন। MySQL এ একই ভুলে আসে ERROR 3065।"
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
                  Sales দল বড় Booking গুলোর একটা তালিকা চায়। যেসব Booking{" "}
                  <Code>confirmed</Code> অথবা <Code>pending</Code>, আর যাদের সিট ৩ বা
                  তার বেশি, তাদের <Code>booking_id</Code>, <Code>seats</Code>, একটা{" "}
                  <Code>state</Code> Column (confirmed হলে <Code>Confirmed</Code>, pending
                  হলে <Code>Waiting</Code>) আর একটা <Code>pricing</Code> Column (৪ বা তার
                  বেশি সিট হলে <Code>Group discount</Code>, নাহলে <Code>Regular price</Code>)
                  দেখান, <Code>booking_id</Code> অনুযায়ী সাজিয়ে।
                </>
              }
              hint={
                <>
                  WHERE এ দুটো শর্ত AND দিয়ে: একটায় IN (Lesson 04), আরেকটায় seats &gt;= 3।
                  SELECT এ দুটো আলাদা CASE: প্রথমটা Simple CASE status, দ্বিতীয়টা
                  Searched CASE seats দিয়ে। ছয়টা Row আসার কথা।
                </>
              }
              solution={`SELECT booking_id,
       seats,
       CASE status
         WHEN 'confirmed' THEN 'Confirmed'
         WHEN 'pending'   THEN 'Waiting'
       END AS state,
       CASE
         WHEN seats >= 4 THEN 'Group discount'
         ELSE 'Regular price'
       END AS pricing
FROM bookings
WHERE status IN ('confirmed', 'pending')
  AND seats >= 3
ORDER BY booking_id;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নিজেকে সাতটা প্রশ্ন",
          content: (
            <ContentList>
              <ListItem>SELECT এ লেখা Alias WHERE এ কেন চলে না, অথচ ORDER BY তে চলে?</ListItem>
              <ListItem>AND আর OR একসাথে লিখলে কোনটা আগে খাটে, আর Bracket কেন লাগে?</ListItem>
              <ListItem>BETWEEN দিয়ে একটা দিনের সব Booking ধরতে গেলে কোন ফাঁদে পড়েন?</ListItem>
              <ListItem>phone = NULL কেন কোনো Row দেয় না?</ListItem>
              <ListItem>ORDER BY না দিলে ফলাফলের ক্রম কে ঠিক করে?</ListItem>
              <ListItem>OFFSET দিয়ে একশতম পাতা আনা কেন ধীর, আর Keyset কীভাবে বাঁচায়?</ListItem>
              <ListItem>CASE এর শর্তের ক্রম বদলালে উত্তর কেন বদলে যেতে পারে?</ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়ার জন্য বাছাই করা উৎস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/functions-conditional.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  PostgreSQL Docs: Conditional Expressions
                </a>
                : CASE এর দুই রূপ, ELSE না থাকলে NULL, আর শূন্য দিয়ে ভাগ আটকানোর
                উদাহরণ, সবচেয়ে নির্ভরযোগ্য জায়গায়।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/typeconv-union-case.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  PostgreSQL Docs: UNION, CASE and Related Constructs
                </a>
                : সব উত্তর এক Type এ মেলানোর নিয়ম, Section 006 এর Error এর পেছনের পুরো
                ব্যাখ্যা। একটু ভারী, তাই পরে ফিরে আসার জন্য রেখে দিন।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/queries-order.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  PostgreSQL Docs: Sorting Rows
                </a>
                : ORDER BY এর পুরো নিয়ম, Expression দিয়ে সাজানো সহ।
              </ListItem>
              <ListItem>
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/flow-control-functions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  MySQL 8.4 Manual: Flow Control Functions
                </a>
                : MySQL এর CASE, IF() আর CASE Statement বনাম CASE Expression এর পার্থক্য।
              </ListItem>
              <ListItem>
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}>
                  আপনার দেখা SQL কোর্সের ভিডিও
                </a>
                : এটা MySQL দিয়ে শেখানো কোর্স। SELECT, WHERE আর ORDER BY এর অংশগুলো
                এখন আবার দেখলে প্রতিটা লাইন চেনা লাগবে, আর MySQL এর লেখা দেখে PostgreSQL
                এর লেখাটা নিজেই মনে মনে বলতে পারবেন।
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
      title: <SectionTitle>সংক্ষেপে, আর সামনে কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentList>
                <ListItem>CASE একটা Expression, প্রতিটা Row এর জন্য একটা মান বানায়, Table বদলায় না।</ListItem>
                <ListItem>শর্ত উপর থেকে নিচে, প্রথম সত্যতেই থামা। ক্রম ভুল হলে Error ছাড়া ভুল উত্তর।</ListItem>
                <ListItem>কোনো শর্ত না মিললে ELSE, ELSE না থাকলে NULL।</ListItem>
                <ListItem>Simple CASE শুধু সমান কিনা মেলায়, তাই WHEN NULL কখনো মেলে না। NULL ধরতে Searched CASE আর IS NULL।</ListItem>
                <ListItem>সব THEN আর ELSE এর উত্তর এক Data Type এ মিলতে হয়।</ListItem>
                <ListItem>SELECT এ লেবেল, ORDER BY তে নিজের ক্রম, WHERE এ কদাচিৎ, অঙ্কের ভেতরে দুই হিসাবের একটা বেছে নেওয়া।</ListItem>
                <ListItem>MySQL এ CASE হুবহু চলে, সাথে বাড়তি IF() আর FIELD()।</ListItem>
              </ContentList>
              <ContentParagraph>
                Module 03 শেষ। আপনি এখন Table থেকে যেকোনো Row আর Column বের করতে
                পারেন, যেকোনো ক্রমে, যেকোনো লেবেল সহ। কিন্তু একটা জিনিস এখনো আপনার হাতে
                কাঁচা অবস্থায় আছে: মানগুলো নিজেই। ছাড়ের দাম দেখাচ্ছিল চার ঘর দশমিকে,
                সময় দেখাচ্ছে পুরো Timestamp হিসেবে, নামগুলো কেউ বড় হাতে চাইলে কিছু করার
                নেই। Module 04 এ শিখবেন Function: লেখা কাটা আর জোড়া, সংখ্যা গোল করা, তারিখ
                থেকে মাস বের করা, আর COALESCE এর মতো ছোট রাস্তা যেগুলোর ভেতরে আসলে একটা
                CASE লুকিয়ে আছে।
              </ContentParagraph>
              <ContentParagraph>
                পরের ধাপ:{" "}
                <Link href="/sql/topic/functions-expressions-overview" className={LINK}>
                  Module 04: Functions &amp; Expressions, Overview
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
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["CASE Expression", "প্রতিটা Row এর জন্য শর্ত দেখে একটা মান বানায়", "CASE WHEN ... THEN ... END"],
      ["Searched CASE", "প্রতিটা WHEN একটা পূর্ণ শর্ত", "WHEN price_bdt < 8000 THEN 'Budget'"],
      ["Simple CASE", "একটা মান, প্রতিটা WHEN এর সাথে সমান কিনা", "CASE status WHEN 'pending' THEN ..."],
      ["প্রথম সত্যতেই থামা", "পরের শর্ত সেই Row এর জন্য দেখাই হয় না", "উল্টো ক্রমে Premium কেউ পায় না"],
      ["ELSE", "কোনো শর্ত না মিললে এই উত্তর", "ELSE 'Premium'"],
      ["ELSE না থাকলে", "উত্তর NULL, Error না", "শেষ তিনটা ট্যুরের price_band খালি"],
      ["WHEN NULL", "Simple CASE এ কখনো মেলে না", "WHEN guide_id IS NULL লিখুন"],
      ["এক Type", "সব উত্তর এক Data Type এ", "ELSE price_bdt::text"],
      ["ORDER BY CASE", "নিজের পছন্দের ক্রম", "pending 1, confirmed 2, cancelled 3"],
      ["WHERE এ CASE", "চলে, তবে AND/OR প্রায়ই ভালো", "শূন্য দিয়ে ভাগ আটকানো"],
      ["অঙ্কে CASE", "দুই হিসাবের একটা বেছে নেওয়া", "seats >= 4 হলে 0.90 গুণ"],
      ["MySQL", "CASE একই, বাড়তি IF() আর FIELD()", "IF(price_bdt < 8000, 'Budget', 'Other')"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা CASE এ কোনো WHEN সত্য হলো না, আর ELSE লেখা হয়নি। সেই Row এর জন্য CASE কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "একটা Error, Query থেমে যায়",
            isCorrect: false,
            explanation: "PostgreSQL কোনো Error দেয় না। এই কারণেই ELSE ভুলে যাওয়া ভুলটা এত সহজে চোখ এড়ায়।",
          },
          {
            key: "B",
            text: "NULL",
            isCorrect: true,
            explanation: "ঠিক। Docs অনুযায়ী ELSE না থাকলে আর কোনো শর্ত সত্য না হলে ফলাফল NULL, যেমন ELSE ছাড়া Query তে শেষ তিনটা ট্যুরের ঘর খালি ছিল।",
          },
          {
            key: "C",
            text: "শেষ WHEN এর উত্তর",
            isCorrect: false,
            explanation: "শেষ WHEN এর উত্তর আসে শুধু যখন সেই WHEN এর শর্ত সত্য। শর্ত মিথ্যা হলে তার উত্তর ব্যবহার হয় না।",
          },
          {
            key: "D",
            text: "খালি লেখা, মানে ''",
            isCorrect: false,
            explanation: "খালি লেখা আর NULL আলাদা জিনিস, Lesson 05 এর কথা। CASE খালি লেখা বানায় না।",
          },
        ],
      },
      {
        id: 2,
        text: "CASE WHEN price_bdt >= 5000 THEN 'Standard' WHEN price_bdt >= 15000 THEN 'Premium' ELSE 'Budget' END। 18000 টাকার Sundarbans Mangrove Cruise কোন লেবেল পাবে?",
        options: [
          {
            key: "A",
            text: "Premium, কারণ 18000 পনেরো হাজারের বেশি",
            isCorrect: false,
            explanation: "পনেরো হাজারের শর্তটা সত্য ঠিকই, কিন্তু সেটা পর্যন্ত পৌঁছানোর আগেই প্রথম শর্ত সত্য হয়ে গেছে।",
          },
          {
            key: "B",
            text: "Standard",
            isCorrect: true,
            explanation: "ঠিক। প্রথম শর্ত price_bdt >= 5000 সত্য, তাই সেখানেই থামা। এই ক্রমে Premium কেউ পায় না।",
          },
          {
            key: "C",
            text: "Budget",
            isCorrect: false,
            explanation: "Budget আসে ELSE থেকে, যখন কোনো শর্ত সত্য না। 18000 এর জন্য প্রথম শর্তটাই সত্য।",
          },
          {
            key: "D",
            text: "Error, কারণ দুটো শর্তই সত্য",
            isCorrect: false,
            explanation: "একাধিক শর্ত সত্য হওয়া স্বাভাবিক, PostgreSQL প্রথমটা নেয়, কোনো Error দেয় না।",
          },
        ],
      },
      {
        id: 3,
        text: "CASE guide_id WHEN NULL THEN 'Guide not assigned' ELSE 'Guide ready' END। Ratargul Swamp Boat Day এর guide_id NULL। উত্তর কী আসবে, আর কেন?",
        options: [
          {
            key: "A",
            text: "Guide not assigned, কারণ guide_id সত্যিই NULL",
            isCorrect: false,
            explanation: "Simple CASE ভেতরে guide_id = NULL জিজ্ঞেস করে, যেটা কখনো সত্য হয় না।",
          },
          {
            key: "B",
            text: "Guide ready, কারণ WHEN NULL কখনো মেলে না আর Row টা ELSE এ যায়",
            isCorrect: true,
            explanation: "ঠিক। লেসনের বক্সে ঠিক এটাই দেখা গেছে। সমাধান Searched CASE: WHEN guide_id IS NULL।",
          },
          {
            key: "C",
            text: "NULL",
            isCorrect: false,
            explanation: "ELSE আছে, তাই NULL আসার সুযোগ নেই। প্রশ্নটা হলো কোন পথে যায়, আর WHEN NULL কখনো মেলে না।",
          },
          {
            key: "D",
            text: "Syntax Error",
            isCorrect: false,
            explanation: "লেখাটা বৈধ SQL, চলে। সমস্যা হলো এটা চুপচাপ ভুল উত্তর দেয়।",
          },
        ],
      },
      {
        id: 4,
        text: "CASE WHEN price_bdt < 8000 THEN 'cheap' ELSE price_bdt END চালালে Error আসে। সবচেয়ে সরাসরি সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "ELSE বাদ দেওয়া",
            isCorrect: false,
            explanation: "Error চলে যাবে, কিন্তু বাকিদের পাশে দামও চলে যাবে, NULL বসবে। যা চাওয়া হয়েছিল তা আর পাবেন না।",
          },
          {
            key: "B",
            text: "ELSE price_bdt::text লেখা, যাতে সব উত্তর লেখা হয়",
            isCorrect: true,
            explanation: "ঠিক। সব উত্তর এক Data Type এ আনতে হয়। দামটাকে লেখায় রূপান্তর করলে দুই দিক মিলে যায়।",
          },
          {
            key: "C",
            text: "'cheap' এর জায়গায় \"cheap\" লেখা",
            isCorrect: false,
            explanation: "PostgreSQL এ Double Quote মানে একটা নামের Column, লেখা না। তখন Error আসবে column \"cheap\" does not exist।",
          },
          {
            key: "D",
            text: "AS দিয়ে Column এর নাম দেওয়া",
            isCorrect: false,
            explanation: "নাম দিলে Column এর Type বদলায় না। সমস্যাটা ধরনের, নামের না।",
          },
        ],
      },
      {
        id: 5,
        text: "বাতিল Booking গুলো সবার শেষে, টাকার অপেক্ষায় থাকাগুলো সবার আগে চাই। কোন ORDER BY এটা নিশ্চিত করে?",
        options: [
          {
            key: "A",
            text: "ORDER BY status",
            isCorrect: false,
            explanation: "বর্ণমালার ক্রমে cancelled আগে আসে, pending শেষে। ঠিক উল্টো।",
          },
          {
            key: "B",
            text: "ORDER BY status DESC",
            isCorrect: false,
            explanation: "এতে pending আগে আসে, কিন্তু তারপর confirmed আর শেষে cancelled, শুধু এই তিনটা শব্দের ক্ষেত্রে কাকতালীয়ভাবে মিলে যায়। নতুন একটা status যোগ হলেই ক্রম ভাঙবে, আর এটা আপনার নিয়মটা বলে না।",
          },
          {
            key: "C",
            text: "ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'confirmed' THEN 2 ELSE 3 END",
            isCorrect: true,
            explanation: "ঠিক। ক্রমটা আপনি নিজে লিখে দিয়েছেন, তাই সেটা শব্দের বানানের উপর নির্ভর করে না।",
          },
          {
            key: "D",
            text: "ORDER BY booking_id",
            isCorrect: false,
            explanation: "booking_id status এর কথা কিছুই জানে না।",
          },
        ],
      },
      {
        id: 6,
        text: "কোন কাজটা Simple CASE দিয়ে করা যায় না, Searched CASE লাগে?",
        options: [
          {
            key: "A",
            text: "method এর bkash কে bKash লেখা",
            isCorrect: false,
            explanation: "এটা একটা Column এর নির্দিষ্ট মানের সাথে সমান কিনা মেলানো, Simple CASE এর আদর্শ কাজ।",
          },
          {
            key: "B",
            text: "status এর তিনটা মানকে তিনটা বাক্যে বদলানো",
            isCorrect: false,
            explanation: "এটাও সমান কিনা মেলানো, Simple CASE এ চলে।",
          },
          {
            key: "C",
            text: "দাম আট হাজারের কম হলে Budget বলা",
            isCorrect: true,
            explanation: "ঠিক। Simple CASE শুধু সমান কিনা দেখে। কম, বেশি, BETWEEN, IS NULL এর জন্য Searched CASE লাগে।",
          },
          {
            key: "D",
            text: "is_active true হলে On sale বলা",
            isCorrect: false,
            explanation: "CASE is_active WHEN true THEN 'On sale' ... চলে, কারণ এটাও সমান কিনা মেলানো।",
          },
        ],
      },
      {
        id: 7,
        text: "SELECT DISTINCT CASE ... END AS price_band FROM tours ORDER BY CASE WHEN price_bdt < 8000 THEN 1 ELSE 2 END চালালে Error আসে। কারণ কী?",
        options: [
          {
            key: "A",
            text: "DISTINCT আর CASE একসাথে লেখা যায় না",
            isCorrect: false,
            explanation: "যায়। একই Query ORDER BY price_band দিয়ে ঠিকঠাক চলে।",
          },
          {
            key: "B",
            text: "DISTINCT এর পরে price_bdt আর ফলাফলে নেই, তাই তা দিয়ে সাজানো যায় না",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL বলে ORDER BY expressions must appear in select list। প্রতিটা দলের একটাই Row, সেখানে কোন ট্যুরের দাম ধরে সাজাবে তা ঠিক করা যায় না।",
          },
          {
            key: "C",
            text: "ORDER BY তে CASE লেখা নিষেধ",
            isCorrect: false,
            explanation: "ORDER BY CASE এই লেসনেরই একটা মূল কৌশল। সমস্যা DISTINCT এর সাথে মেশানোয়।",
          },
          {
            key: "D",
            text: "price_band Alias টা ORDER BY তে চেনা যায় না",
            isCorrect: false,
            explanation: "ORDER BY তে Alias চেনা যায়, Lesson 02 এর কথা। Error টা price_bdt নিয়ে।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL এর একটা ভিডিওতে লেখা IF(price_bdt < 8000, 'Budget', 'Other')। PostgreSQL এ একই কাজ কীভাবে লিখবেন?",
        options: [
          {
            key: "A",
            text: "একই IF() লিখলেই চলবে",
            isCorrect: false,
            explanation: "PostgreSQL এ IF() Function নেই, তাই Error আসবে।",
          },
          {
            key: "B",
            text: "CASE WHEN price_bdt < 8000 THEN 'Budget' ELSE 'Other' END",
            isCorrect: true,
            explanation: "ঠিক। IF() আসলে দুই পথের একটা ছোট CASE। CASE Standard SQL, তাই এটা MySQL আর PostgreSQL দুই জায়গাতেই চলে।",
          },
          {
            key: "C",
            text: "WHERE price_bdt < 8000",
            isCorrect: false,
            explanation: "WHERE Row ছাঁকে, লেবেল বানায় না। Other দলের ট্যুরগুলো তখন ফলাফল থেকেই হারিয়ে যাবে।",
          },
          {
            key: "D",
            text: "COALESCE(price_bdt < 8000, 'Budget')",
            isCorrect: false,
            explanation: "COALESCE NULL এর বিকল্প বসায়, শর্ত দেখে লেবেল বানায় না। আর এখানে দুই দিকের Type ও মেলে না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: my_tours এর লেবেল আর ক্রম",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের দামের দল:</strong> নিজের মেশিনের island_tours এ চারটা দামের দল
        বানান, সীমা আপনি ঠিক করবেন (যেমন Economy, Budget, Standard, Premium)। Query টা
        চালিয়ে প্রতিটা দলে কয়টা ট্যুর পড়ল লিখে রাখুন, আর এক লাইনে লিখুন কেন আপনার
        WHEN এর ক্রমটা নিরাপদ।
      </span>,
      <span key="2">
        <strong>বাংলা ব্যাজ:</strong> Booking এর status কে বাংলা শব্দে দেখানোর একটা
        CASE লিখুন, যেমন অপেক্ষায়, নিশ্চিত, বাতিল। তারপর দুই লাইনে লিখুন, এই লেবেল
        Query তে রাখা ভালো নাকি App এ, আর কেন।
      </span>,
      <span key="3">
        <strong>সামনের যাত্রা আগে:</strong> departures এর তালিকা এমনভাবে সাজান যাতে
        ২০২৬ সালের ১৭ অক্টোবর বা তার পরের তারিখগুলো আগে আসে, তারিখ অনুযায়ী, আর পুরনো
        তারিখগুলো পরে। ORDER BY তে একটা CASE লাগবে।
      </span>,
      <span key="4">
        <strong>Bug ধরুন:</strong> নিচের CASE টা সব দামি ট্যুরকে Standard বলে:
        WHEN price_bdt &gt;= 5000 THEN &apos;Standard&apos; WHEN price_bdt &gt;= 15000
        THEN &apos;Premium&apos; ELSE &apos;Budget&apos;। ঠিক করুন, ঠিক করা Query
        চালিয়ে প্রমাণ দিন, আর দুই লাইনে ব্যাখ্যা করুন আগে কী ভুল ছিল।
      </span>,
      <span key="5">
        <strong>শেখান (Module 03 এর শেষ কাজ):</strong> এক বন্ধুকে ছয় লাইনে CASE বোঝান,
        একটা Island Tours এর উদাহরণসহ। তারপর নিজের জন্য একটা এক পাতার Cheat Sheet
        বানান: Module 03 এর প্রতিটা লেসনের একটা করে উদাহরণ Query, আর একটা Query যেটা
        SELECT, WHERE, IN বা LIKE, IS NULL, CASE, ORDER BY আর LIMIT সব একসাথে ব্যবহার করে।
      </span>,
    ],
    deliverables: [
      <span key="d1">চার দলের Query, তার Output, আর প্রতিটা দলের ট্যুরের সংখ্যা</span>,
      <span key="d2">বাংলা ব্যাজের Query আর Query না App, এই সিদ্ধান্তের দুই লাইন</span>,
      <span key="d3">departures এর নতুন ক্রমের Query আর তার প্রথম পাঁচটা Row</span>,
      <span key="d4">Bug এর আগের আর পরের Output, আর দুই লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য ব্যাখ্যা আর Module 03 এর এক পাতার Cheat Sheet</span>,
    ],
  },
  practicalLab: {
    title: "CASE Drill",
    subtitle: "নিজের মেশিনের psql এ, Module 02 এ Load করা island_tours এর উপর",
    stepName: "DRILL",
    steps: [
      {
        title: "island_tours এ ঢুকুন",
        description:
          "psql -d island_tours দিয়ে Connect করুন। Docker এ চালালে docker exec -it island-pg psql -U postgres -d island_tours। প্রম্পটে island_tours=# দেখলে শুরু করুন।",
      },
      {
        title: "দামের দল আর Guide এর অবস্থা",
        description:
          "প্রথম দুটো Drill চালান। প্রতিটার শেষে লেখা Row এর সংখ্যার সাথে নিজের ফলাফল মেলান। দ্বিতীয়টায় একটাই ট্যুর Guide not assigned পাওয়ার কথা।",
      },
      {
        title: "ফাঁদটা নিজের চোখে",
        description:
          "তৃতীয় Drill এ উল্টো ক্রমের CASE। একটাও Premium না আসাটাই প্রত্যাশিত। তারপর দুই WHEN অদলবদল করে আবার চালান।",
      },
      {
        title: "নিজের ক্রম",
        description:
          "চতুর্থ Drill এ ORDER BY CASE। প্রথম চারটা Row pending হওয়ার কথা।",
      },
      {
        title: "Error পড়া আর সারানো",
        description:
          "পঞ্চম Drill এর প্রথম দুটো Query ইচ্ছা করে Error দেয়। Error এর লেখা পড়ুন, তৃতীয় Query টা সমাধান।",
      },
      {
        title: "পুরো মডিউল এক Query তে",
        description:
          "ষষ্ঠ Drill টা Module 03 এর Capstone। পাঁচটা Row আসার কথা। প্রতিটা লাইনের পাশে মন্তব্য করে লিখুন সেটা কোন লেসনের।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-price-bands.sql",
        code: `SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
ORDER BY price_bdt;
-- (9 rows): Budget 2, Standard 4, Premium 3`,
      },
      {
        language: "sql",
        filename: "02-guide-status.sql",
        code: `SELECT title,
       CASE
         WHEN guide_id IS NULL THEN 'Guide not assigned'
         ELSE 'Guide ready'
       END AS guide_status
FROM tours
ORDER BY tour_id;
-- (9 rows): শুধু Ratargul Swamp Boat Day পায় Guide not assigned`,
      },
      {
        language: "sql",
        filename: "03-wrong-order.sql",
        code: `SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt >= 5000  THEN 'Standard'
         WHEN price_bdt >= 15000 THEN 'Premium'
         ELSE 'Budget'
       END AS price_band
FROM tours
ORDER BY price_bdt;
-- (9 rows): একটা Budget (Ratargul), বাকি আটটাই Standard, Premium শূন্য`,
      },
      {
        language: "sql",
        filename: "04-custom-order.sql",
        code: `SELECT booking_id, status
FROM bookings
ORDER BY CASE status
           WHEN 'pending'   THEN 1
           WHEN 'confirmed' THEN 2
           ELSE 3
         END,
         booking_id;
-- (24 rows): 14, 17, 20, 24 pending আগে, শেষে 5, 12, 18 cancelled`,
      },
      {
        language: "sql",
        filename: "05-type-clash.sql",
        code: `SELECT title, CASE WHEN price_bdt < 8000 THEN 'cheap' ELSE price_bdt END
FROM tours;
-- ERROR:  invalid input syntax for type numeric: "cheap"

SELECT title, CASE WHEN price_bdt < 8000 THEN 'cheap'::text ELSE price_bdt END
FROM tours;
-- ERROR:  CASE types numeric and text cannot be matched

SELECT title,
       CASE WHEN price_bdt < 8000 THEN 'cheap' ELSE price_bdt::text END AS price_note
FROM tours
ORDER BY price_bdt;
-- (9 rows): প্রথম দুটোয় cheap, বাকিদের পাশে দাম`,
      },
      {
        language: "sql",
        filename: "06-module-capstone.sql",
        code: `SELECT title,
       price_bdt,
       CASE
         WHEN price_bdt < 8000  THEN 'Budget'
         WHEN price_bdt < 15000 THEN 'Standard'
         ELSE 'Premium'
       END AS price_band
FROM tours
WHERE is_active
  AND guide_id IS NOT NULL
  AND (title ILIKE '%saint%' OR destination_id IN (2, 4, 5))
ORDER BY price_bdt DESC, tour_id
LIMIT 5;
-- (5 rows): প্রথমটা Cox's Bazar Family Package, 15500.00, Premium`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Drill চালানোর আগে মনে মনে অনুমান করুন কয়টা Row আসবে আর প্রথম Row টা কী
        হবে। অনুমান ভুল হলে সেটাই সবচেয়ে বড় শেখা, কারণ তখন বুঝবেন কোন নিয়মটা এখনো
        পুরোপুরি মাথায় বসেনি।
      </ContentParagraph>
    ),
  },
};
