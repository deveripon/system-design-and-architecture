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
import { CastLab, TypeResolverLab } from "../../../components/course/topics/functions/cast-animations";
import {
  CastInWhereDiagram,
  CastMapDiagram,
  ImplicitExplicitSplit,
  SameCharactersDiagram,
} from "../../../components/course/topics/functions/cast-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em]";

export const typeCastingContent: TopicData = {
  id: "type-casting",
  introduction: {
    badge: "MODULE 04 · LESSON 04",
    title: <SectionTitle>Type বদলানো: CAST আর ::</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Website এ কেউ একটা ট্যুরের পাতা খুললেন। Browser এর ঠিকানায় লেখা
          আছে <code className={CODE}>?tour=3</code>। আপনার API সেই 3 টা পেল, কিন্তু সংখ্যা
          হিসেবে না, লেখা হিসেবে। Web এ যা কিছু আসে, Form এর ঘর, ঠিকানার অংশ, CSV ফাইলের
          ঘর, সবই আসে লেখা হয়ে। অথচ Database এ tour_id একটা সংখ্যা, price_bdt একটা দশমিক
          সংখ্যা, starts_on একটা তারিখ।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই দুই জগতের মাঝখানের সেতু নিয়ে। প্রতিটা মানের একটা Type থাকে, আর Type
          ঠিক করে মানটা দিয়ে কী করা যায়: যোগ, তুলনা, সাজানো, জোড়া লাগানো। একটা Type থেকে
          আরেক Type এ বদলানোর নাম Cast। আজ আপনি শিখবেন কখন PostgreSQL নিজে থেকে বদলে নেয়,
          কখন সে থেমে গিয়ে Error দেয়, আর কখন সবচেয়ে বিপজ্জনক ঘটনাটা ঘটে: কোনো Error নেই,
          কিন্তু উত্তরটা চুপচাপ ভুল।
        </ContentParagraph>
        <ContentParagraph>
          পুরো লেসন জুড়ে Query বক্স আর অনুশীলনের বক্স আছে। প্রতিটা নতুন জিনিস দেখার পরেই
          নিজে লিখে Check চাপুন। আর মনে রাখুন, এই মডিউলের গল্পে আজ 1 November 2026।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দোকানদার আপনার হাতে দশ টাকার একটা নোট দেখলেন, আর খাতায় লিখলেন দশ। নোটটা কাগজ, খাতার দশ একটা সংখ্যা। কাগজের নোট যোগ করা যায় না, খাতার সংখ্যা যায়। Cast হলো সেই মুহূর্ত, যখন কাগজ থেকে সংখ্যা পড়ে নেওয়া হয়।",
      author: "CAST",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একই অক্ষর, আলাদা অর্থ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা কাগজে লেখা আছে 42। এটা কি একটা সংখ্যা, নাকি দুটো অক্ষর, একটা চার আর একটা
                দুই? মানুষ প্রসঙ্গ দেখে বুঝে নেয়। বাসের নম্বর 42 হলে সেটা একটা নাম, তার সাথে কেউ
                এক যোগ করে না। দোকানের হিসাবে 42 হলে সেটা টাকা, তার সাথে যোগ বিয়োগ চলে।
              </ContentParagraph>
              <ContentParagraph>
                Database প্রসঙ্গ আন্দাজ করে না। সে প্রতিটা মানের সাথে একটা ছাপ রাখে, যাকে বলে
                Data Type, ছোট করে Type। Type বলে দেয় মানটা কী জিনিস: লেখা (text), পূর্ণ সংখ্যা
                (integer), দশমিক সংখ্যা (numeric), তারিখ (date), হ্যাঁ না (boolean)। আর Type ই
                ঠিক করে মানটার সাথে কোন কাজ চলবে, আর সেই কাজের ফল কী হবে।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এ আপনি এর একটা নমুনা দেখেছেন: লেখা হিসেবে &apos;100&apos; ছোট
                &apos;9&apos; এর চেয়ে, কারণ লেখা তুলনা হয় অক্ষর ধরে, আর প্রথম অক্ষর 1 আগে আসে 9
                এর। আরেকটা নমুনা আপনি দেখেছেন এই মডিউলের সংখ্যার লেসনে: 7 কে 2 দিয়ে ভাগ করলে
                আসে 3, কারণ দুটোই integer, আর integer ভাগ করলে দশমিক ফেলে দেয়। নিচের বক্সে
                দুটোই আরেকবার দেখে নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Type বদলালে উত্তর বদলায়"
              query={`SELECT '10' < '9' AS as_text,
       10 < 9 AS as_numbers;

SELECT 7 / 2 AS integer_division,
       7.0 / 2 AS numeric_division;`}
              caption="Run চাপুন। লেখা হিসেবে '10' < '9' সত্য (t), সংখ্যা হিসেবে মিথ্যা (f)। আর 7 / 2 দেয় 3, কিন্তু 7.0 / 2 দেয় 3.5000000000000000। অক্ষরগুলো প্রায় এক, শুধু Type আলাদা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cast মানে Type বদলানো",
          content: (
            <ContentParagraph>
              একটা মানকে এক Type থেকে আরেক Type এ নেওয়ার নাম Type Cast, সংক্ষেপে Cast। লেখা
              &apos;12500&apos; থেকে সংখ্যা 12500, দশমিক 12500.00 থেকে লেখা &apos;12500.00&apos;,
              সময়সহ মুহূর্ত থেকে শুধু তারিখ। কিছু Cast PostgreSQL নিজে থেকে করে, বাকিগুলো আপনাকে
              চাইতে হয়। এই লেসনের পুরোটা এই পার্থক্য নিয়ে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "every-value-has-a-type",
      subHeader: { index: "002", title: "Every Value Has a Type" },
      title: <SectionTitle>প্রতিটা মানের একটা Type আছে, আর সেটা দেখা যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Table বানানোর সময় প্রতিটা Column এর Type লিখে দেওয়া হয়েছিল। Island Tours এর
                tours Table এ title হলো text, price_bdt হলো numeric, max_seats হলো smallint (ছোট
                পূর্ণ সংখ্যা), is_active হলো boolean। Column এর Type কীভাবে বেছে নিতে হয়, সেটা
                Module 09 এর বিষয়। আজ শুধু জানা দরকার যে Type আছে, আর সেটা জিজ্ঞেস করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                জিজ্ঞেস করার জন্য PostgreSQL এর একটা ছোট Function আছে, নাম{" "}
                <code className={CODE}>pg_typeof()</code>। যেকোনো মান বা Expression তার ভেতরে
                দিলে সে Type এর নাম বলে দেয়। Expression মানে এমন যেকোনো লেখা যার একটা মান হয়:
                একটা Column, একটা সংখ্যা, একটা হিসাব, একটা Function এর ফলাফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column আর মানের Type জিজ্ঞেস করুন"
              query={`SELECT title, pg_typeof(title) AS title_type,
       price_bdt, pg_typeof(price_bdt) AS price_type,
       max_seats, pg_typeof(max_seats) AS seats_type,
       is_active, pg_typeof(is_active) AS active_type
FROM tours
WHERE tour_id = 1;

SELECT pg_typeof(42) AS a, pg_typeof(3000000000) AS b,
       pg_typeof(1.5) AS c, pg_typeof('hello') AS d,
       pg_typeof(DATE '2026-11-01') AS e;`}
              caption="প্রথম Query তে চারটা Column এর Type: text, numeric, smallint, boolean। দ্বিতীয়টায় মজার জিনিস: 42 হলো integer, তিনশো কোটি এত বড় যে integer এ ধরে না, তাই bigint। 1.5 হলো numeric। আর 'hello' এর Type unknown! কেন, সেটা চতুর্থ অংশে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SameCharactersDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবিটা ভালো করে দেখুন, কারণ এই লেসনের প্রতিটা Error আর প্রতিটা ভুল উত্তর এই ছবির
              কোনো একটা সারি থেকে আসে। একই দুই অক্ষর text হলে তুলনা হয় অক্ষর ধরে, যোগ চলে
              না, আর সাজানো হয় প্রথম অক্ষর ধরে। integer হলে তুলনা হয় মান ধরে, যোগ চলে, আর
              সাজানো হয় ছোট থেকে বড়। শুধু জোড়া লাগানো (<code className={CODE}>||</code>) দুটোতেই
              এক উত্তর দেয়, কারণ জোড়া লাগানোর আগে PostgreSQL সংখ্যাকেও লেখায় বদলে নেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "cast-and-colons",
      subHeader: { index: "003", title: "CAST and ::" },
      title: <SectionTitle>দুইভাবে লেখা, একই কাজ: CAST আর ::</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নিজে Type বদলাতে চাইলে PostgreSQL দুটো লেখা চেনে। প্রথমটা SQL Standard এর:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>CAST(মান AS type)</code>, যেমন{" "}
                  <code className={CODE}>{"CAST('12500' AS integer)"}</code>। পড়তে হয় এভাবে:
                  এই মানটা integer হিসেবে নিন।
                </ListItem>
                <ListItem>
                  <code className={CODE}>মান::type</code>, যেমন{" "}
                  <code className={CODE}>{"'12500'::integer"}</code>। দুটো কোলন, তারপর Type এর
                  নাম। ছোট, তাই PostgreSQL এর কাজে এটাই বেশি দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                PostgreSQL এর অফিসিয়াল Docs বলে, দুটো লেখা একদম সমান। CAST লেখাটা SQL Standard
                মানে, আর :: হলো PostgreSQL এর পুরনো নিজস্ব লেখা। তাই একটা নিয়ম মনে রাখুন: যে
                Query অন্য Database এও চালাতে হতে পারে, সেখানে CAST লিখুন। MySQL এ :: নেই, সেটা
                এই লেসনের MySQL অংশে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="CAST আর :: পাশাপাশি"
              query={`SELECT CAST('12500' AS integer) AS with_cast,
       '12500'::integer AS with_colons,
       CAST(price_bdt AS integer) AS price_cast,
       price_bdt::integer AS price_colons
FROM tours
WHERE tour_id = 1;`}
              caption="চারটা Column এই 12500। প্রথম দুটো লেখা থেকে সংখ্যা, শেষ দুটো numeric 12500.00 থেকে integer 12500। লক্ষ করুন, price_bdt এর .00 চলে গেছে: integer এ দশমিকের জায়গা নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Type এর নাম আগে, লেখা পরে: DATE '2026-11-01'",
          content: (
            <ContentParagraph>
              Module 03 থেকে আপনি <code className={CODE}>{"DATE '2026-11-01'"}</code> লেখাটা
              দেখে আসছেন। এটাও একটা Cast, তৃতীয় একটা চেহারায়: Type এর নাম আগে, তারপর Quote
              এর ভেতরে লেখা। এই চেহারা শুধু Quote এর ভেতরের লেখার সাথে চলে, Column এর সাথে
              না। তারিখ লেখার জন্য এটা খুব পরিষ্কার, তাই এই ট্র্যাকে তারিখের জন্য এটাই বেশি
              ব্যবহার হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার নিজে একটা Cast লিখুন। একটা ট্যুরে প্রতি সিটে দাম কত পড়ে, সেটা বের করতে
              price_bdt কে max_seats দিয়ে ভাগ করতে হয়। ভাগফলে লম্বা দশমিক আসে, যেমন
              283.3333333333333333। পূর্ণ সংখ্যায় দেখাতে ভাগফলটাকে integer এ Cast করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 1 · Easy"
              orderMatters
              task={
                <>
                  প্রতিটা ট্যুরের <code className={CODE}>title</code> আর প্রতি সিটের দাম{" "}
                  <code className={CODE}>price_bdt / max_seats</code> কে integer এ Cast করে, নাম দিন{" "}
                  <code className={CODE}>per_seat</code>। tour_id এর ক্রমে সাজান।
                </>
              }
              hint={
                <>
                  পুরো ভাগটা Parentheses এ রেখে তারপর ::integer, যেমন{" "}
                  <code className={CODE}>(a / b)::integer</code>। Parentheses না দিলে :: শুধু max_seats এর সাথে
                  জোড়া লাগে, কারণ :: সবচেয়ে কাছের জিনিসটাকে ধরে।
                </>
              }
              solution={`SELECT title, (price_bdt / max_seats)::integer AS per_seat
FROM tours
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "quoted-literals",
      subHeader: { index: "004", title: "Quoted Literals" },
      title: <SectionTitle>Quote এর ভেতরের লেখার Type এখনো ঠিক হয়নি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দ্বিতীয় অংশে pg_typeof(&apos;hello&apos;) বলেছিল unknown। এটা কোনো ভুল না, এটা
                PostgreSQL এর একটা বুদ্ধিমান সিদ্ধান্ত। Query তে সরাসরি লেখা মানকে বলে Literal।
                Quote এর ভেতরের একটা Literal দেখে PostgreSQL তখনই ঠিক করে না সেটা লেখা নাকি
                সংখ্যা নাকি তারিখ। সে অপেক্ষা করে, আর আশেপাশের জিনিস দেখে ঠিক করে।
              </ContentParagraph>
              <ContentParagraph>
                <code className={CODE}>{"WHERE tour_id = '3'"}</code> লিখলে অন্য পাশে আছে tour_id,
                যার Type integer। তাই PostgreSQL &apos;3&apos; কে integer হিসেবে পড়ে, পায় 3, আর
                তুলনা ঠিকঠাক চলে। একই কারণে <code className={CODE}>{"'3' + 1"}</code> দেয় 4। এটা
                আসলে খুব কাজের: আপনার API ঠিকানা থেকে যে &apos;3&apos; পায়, সেটা সরাসরি tour_id এর
                সাথে মেলানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু এই সুবিধার একটা ধারালো কিনারা আছে। <code className={CODE}>{"'3.5' + 1"}</code>{" "}
                লিখলে PostgreSQL একই যুক্তিতে &apos;3.5&apos; কে integer হিসেবে পড়তে চায়, কারণ 1
                একটা integer। আর 3.5 কোনো integer না। ফলে Error।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Quote এর লেখা পাশের জিনিস দেখে Type পায়"
              query={`SELECT '3' + 1 AS a;

SELECT title FROM tours WHERE tour_id = '3';

SELECT '3.5' + 1 AS b;`}
              caption="প্রথম দুটো চলে: 4, আর Sundarbans Mangrove Cruise। তৃতীয়টা থামে: ERROR: invalid input syntax for type integer: &quot;3.5&quot;। ঠিক করতে নিজে Type বলে দিন: '3.5'::numeric + 1 লিখে আবার চালান, উত্তর 4.5।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিয়মটা এক লাইনে",
          content: (
            <ContentParagraph>
              Quote এর ভেতরের লেখা তার Type নেয় পাশের জিনিস থেকে। পাশের জিনিস যদি integer হয়,
              লেখাটাকেও integer এর বৈধ লেখা হতে হবে, নইলে Error। কোন Type চান সেটা নিজে জানলে
              নিজেই বলে দিন, PostgreSQL কে আন্দাজ করতে দেবেন না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "implicit-casts",
      subHeader: { index: "005", title: "Implicit Casts" },
      title: <SectionTitle>যেখানে PostgreSQL নিজেই বদলে নেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Quote এর লেখা ছাড়াও কিছু জায়গায় PostgreSQL নিজে থেকে Type বদলে নেয়। এই
                নিঃশব্দ বদলানোর নাম Implicit Cast। আর আপনি যখন CAST বা :: লিখে চান, সেটা Explicit
                Cast। কোনগুলো Implicit হবে, সেটা PostgreSQL নিজের একটা তালিকায় লিখে রেখেছে, নাম
                pg_cast। নিয়মটা সহজ: যে বদলে কিছু হারায় না, সেটা Implicit।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ছোট সংখ্যা থেকে বড় সংখ্যায়: smallint থেকে integer, integer থেকে bigint আর
                  numeric। তাই <code className={CODE}>1 + 1.5</code> চলে: 1 হয়ে যায় numeric, উত্তর
                  2.5।
                </ListItem>
                <ListItem>
                  তারিখ থেকে সময়সহ তারিখে: date থেকে timestamp আর timestamptz। মধ্যরাত যোগ হয়,
                  কিছু হারায় না।
                </ListItem>
                <ListItem>
                  জোড়া লাগানোর সময় অন্য Type থেকে লেখায়: <code className={CODE}>{"'Seats: ' || 2"}</code>{" "}
                  দেয় &apos;Seats: 2&apos;।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                উল্টো দিকে, যে বদলে কিছু হারাতে পারে, সেটা PostgreSQL নিজে করে না। numeric থেকে
                integer এ দশমিক হারায়। timestamptz থেকে date এ ঘণ্টা মিনিট হারায়, আর কোন দিন
                ধরা হবে সেটা Time Zone এর উপর নির্ভর করে। লেখা থেকে সংখ্যায় গেলে লেখাটা ভুলও
                হতে পারে। এগুলো আপনাকে চাইতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিঃশব্দে যে বদলগুলো হয়"
              query={`SELECT 1 + 1.5 AS a, pg_typeof(1 + 1.5) AS a_type,
       DATE '2026-11-01' + 3 AS b, pg_typeof(DATE '2026-11-01' + 3) AS b_type,
       'Seats: ' || 2 AS c, pg_typeof('Seats: ' || 2) AS c_type;`}
              caption="2.5 আর numeric, 2026-11-04 আর date, 'Seats: 2' আর text। তিনটাতেই আপনি কোনো Cast লেখেননি, PostgreSQL নিজে মিলিয়ে নিয়েছে, কারণ কোনোটাতেই কিছু হারায়নি।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CastMapDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ImplicitExplicitSplit />,
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "when-postgres-refuses",
      subHeader: { index: "006", title: "When PostgreSQL Refuses" },
      title: <SectionTitle>যখন PostgreSQL থেমে যায়: operator does not exist</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Support টিমের তানিয়া একজন Customer এর ফোন নম্বর পেয়েছেন: 8801000000101।
                তিনি লিখলেন <code className={CODE}>WHERE phone = 8801000000101</code>, Quote ছাড়া,
                কারণ নম্বর তো সংখ্যা। PostgreSQL উত্তর দিল একটা Error দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                কারণটা Type এ। phone Column এর Type text, কারণ ফোন নম্বরে + থাকে, শুরুতে শূন্য
                থাকতে পারে, আর ফোন নম্বর দিয়ে কেউ যোগ বিয়োগ করে না। ওদিকে Quote ছাড়া
                8801000000101 একটা সংখ্যা, এত বড় যে integer এ ধরে না, তাই bigint। text আর bigint
                তুলনা করার কোনো Operator নেই, আর এই দুইয়ের মধ্যে PostgreSQL নিজে থেকে বদলায়
                না। Operator মানে তুলনা বা হিসাবের চিহ্ন: =, &lt;, +, LIKE।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ফোন নম্বর, লেখা আর সংখ্যা"
              query={`SELECT full_name FROM customers
WHERE phone = '+8801000000101';

SELECT full_name FROM customers
WHERE phone = 8801000000101;`}
              caption="প্রথমটা দেয় Rahim Uddin। দ্বিতীয়টা থামে: ERROR: operator does not exist: text = bigint, সাথে একটা HINT: You might need to add explicit type casts। HINT বলছে Cast লাগবে, কিন্তু কোন পাশে লাগবে সেটা আপনাকেই ভাবতে হবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TypeResolverLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এর শেষ তিনটা Case খেয়াল করুন। Error থেকে বেরোনোর সবচেয়ে সহজ রাস্তা হলো যেকোনো
              এক পাশে একটা Cast বসিয়ে দেওয়া। কিন্তু ভুল পাশে বসালে Error চলে যায়, আর উত্তর হয়
              ভুল। ফোনের ক্ষেত্রে 8801000000101::text লিখলে Error যায়, কিন্তু Data তে নম্বরের
              শুরুতে + আছে, তাই একটা Row ও মেলে না। সঠিক সমাধান হলো Data যে চেহারায় আছে, সেই
              চেহারায় মান লেখা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 2 · Easy"
              task={
                <>
                  তানিয়ার Query টা ঠিক করুন: যে Customer এর ফোন নম্বর +8801000000101, তাঁর{" "}
                  <code className={CODE}>full_name</code> আর <code className={CODE}>city</code> বের করুন।
                </>
              }
              hint={
                <>
                  phone একটা text Column, আর Data তে নম্বরের শুরুতে + আছে। তাই মানটাও লেখা হিসেবে
                  লিখুন, এক Quote এর ভেতরে, + সহ।
                </>
              }
              solution={`SELECT full_name, city
FROM customers
WHERE phone = '+8801000000101';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "text-to-number",
      subHeader: { index: "007", title: "Text to Number" },
      title: <SectionTitle>লেখা থেকে সংখ্যা: 22P02 আর তার সমাধান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ফাইন্যান্সের ফারুক ভাই একটা Excel থেকে দাম কপি করে দিলেন: 12,500। মানুষের চোখে
                বারো হাজার পাঁচশো, কিন্তু PostgreSQL এর কাছে কমা কোনো সংখ্যার অংশ না।{" "}
                <code className={CODE}>{"'12,500'::integer"}</code> চালালে আসে ERROR: invalid input
                syntax for type integer: &quot;12,500&quot;। এই Error এর SQLSTATE কোড 22P02, Module
                02 এর Errors লেসনে যাকে দেখেছেন: ভুল চেহারার লেখা।
              </ContentParagraph>
              <ContentParagraph>
                লেখা থেকে সংখ্যায় যাওয়ার নিয়মগুলো ছোট:
              </ContentParagraph>
              <ContentList>
                <ListItem>দুই পাশের ফাঁকা জায়গা চলে: &apos; 42 &apos; থেকে 42।</ListItem>
                <ListItem>
                  integer এ দশমিক চলে না: &apos;42.7&apos;::integer হলো Error। numeric এ চলে।
                </ListItem>
                <ListItem>
                  কমা, টাকার চিহ্ন, অক্ষর কিছুই চলে না। আগে পরিষ্কার করতে হয়, যেমন{" "}
                  <code className={CODE}>{"replace('12,500', ',', '')"}</code>, অথবা পরের অংশের
                  to_number।
                </ListItem>
                <ListItem>
                  খালি লেখা &apos;&apos; কোনো সংখ্যা না, শূন্যও না। এটাকে NULL বানানোর কৌশল আসছে
                  পরের লেসনে, NULLIF দিয়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="কোন লেখা সংখ্যা হয়, কোনটা হয় না"
              query={`SELECT ' 42 '::integer AS spaced,
       '12500.50'::numeric AS decimal_text,
       replace('12,500', ',', '')::integer AS without_comma;

SELECT '12,500'::integer AS with_comma;`}
              caption="প্রথম Query তিনটা মান দেয়: 42, 12500.50 আর 12500। দ্বিতীয়টা থামে 22P02 দিয়ে। সমাধান প্রথম Query তেই: কমা সরিয়ে তারপর Cast।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CastLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Lab এর MySQL বোতামটা চাপুন",
          content: (
            <ContentParagraph>
              একই ছত্রিশটা চেষ্টা MySQL 8.4 এ চালালে একটাও Error আসে না। &apos;12,500&apos; হয়ে যায়
              12, &apos;abc&apos; হয়ে যায় 0, আর পাশে শুধু একটা Warning থাকে। PostgreSQL এর কড়া
              Error প্রথমে বিরক্তিকর লাগে, কিন্তু সে আপনাকে বারো হাজার পাঁচশোর জায়গায় বারো টাকা
              লিখে ফেলা থেকে বাঁচায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "rounding-casts",
      subHeader: { index: "008", title: "Rounding Casts" },
      title: <SectionTitle>দশমিক থেকে পূর্ণ সংখ্যা: কাটে না, Round করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                numeric থেকে integer এ Cast করলে দশমিকের অংশটা কেটে ফেলা হয় না, Round করা হয়।
                Round মানে সবচেয়ে কাছের পূর্ণ সংখ্যায় যাওয়া: 2.4 থেকে 2, 2.6 থেকে 3। আর ঠিক
                মাঝখানে, 2.5 এ? numeric এর নিয়মে মাঝখানের সংখ্যা শূন্য থেকে দূরে যায়: 2.5 হয় 3,
                3.5 হয় 4।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু double precision (দশমিকের দ্রুত, আনুমানিক Type, যাকে float বলে) থেকে Cast
                করলে মাঝখানের নিয়ম আলাদা: 2.5 হয় 2, আর 3.5 হয় 4। এখানে মাঝখানের সংখ্যা যায় কাছের
                জোড় সংখ্যায়। একই 2.5, Type আলাদা, উত্তর আলাদা। টাকার হিসাব কেন কখনো float এ রাখা
                হয় না, তার এক ঝলক দেখেছেন এই মডিউলের সংখ্যার লেসনে, পুরোটা Module 09 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Round হয়, কাটা হয় না"
              query={`SELECT 2.4::integer AS a, 2.5::integer AS b,
       2.6::integer AS c, 3.5::integer AS d;

SELECT 2.5::float8::integer AS float_a,
       3.5::float8::integer AS float_b;

SELECT 12.345::numeric(10,2) AS two_places,
       trunc(12.345, 2) AS cut;`}
              caption="numeric থেকে: 2, 3, 3, 4। float থেকে: 2 আর 4। শেষ Query তে numeric(10,2) মানে দশমিকের পরে দুই ঘর রাখা, তাই 12.345 হয় 12.35 (Round)। আর trunc সত্যিই কাটে: 12.34।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Island Tours এর আসল Data তে দেখুন। প্রতি সিটের দাম Cast করলে আর trunc করলে
              কোথায় আলাদা হয়, নিচের বক্স চালিয়ে মিলিয়ে নিন। Exercise 1 এর উত্তরের সাথে
              per_seat_cast Column টা হুবহু মিলবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রতি সিটের দাম: Cast বনাম trunc"
              query={`SELECT title, price_bdt, max_seats,
       price_bdt / max_seats AS per_seat,
       (price_bdt / max_seats)::integer AS per_seat_cast,
       trunc(price_bdt / max_seats) AS per_seat_trunc
FROM tours
ORDER BY tour_id;`}
              caption="Sajek Valley Cloud Trip এ ভাগফল 527.7777777777777778: Cast দেয় 528, trunc দেয় 527। Bandarban এ 1166.67: 1167 আর 1166। Cox's Bazar Family Package এ 645.83: 646 আর 645। হিসাবের নিয়ম আগে ঠিক করুন, তারপর সেই অনুযায়ী Cast বা trunc বেছে নিন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "numbers-as-text",
      subHeader: { index: "009", title: "Numbers as Text" },
      title: <SectionTitle>সংখ্যাকে সুন্দর লেখায়, আর লেখা থেকে আবার সংখ্যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ::text দিয়ে সংখ্যা লেখা হয় ঠিক যেমন দেখায়: 12500.00 থেকে &apos;12500.00&apos;।
                Invoice বা Email এ কিন্তু মানুষ দেখতে চায় 12,500। সেজন্য আছে{" "}
                <code className={CODE}>to_char(মান, ছাঁচ)</code>। ছাঁচ, ইংরেজিতে Format বা
                Pattern, বলে দেয় লেখাটা দেখতে কেমন হবে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>9</code> মানে একটা অঙ্কের জায়গা, আর{" "}
                  <code className={CODE}>,</code> মানে সেখানে কমা বসবে।
                </ListItem>
                <ListItem>
                  <code className={CODE}>.00</code> মানে দশমিকের পরে দুই ঘর।
                </ListItem>
                <ListItem>
                  শুরুর <code className={CODE}>FM</code> মানে বাড়তি ফাঁকা জায়গা বাদ দেওয়া। FM ছাড়া
                  to_char সংখ্যার সামনে চিহ্নের জন্য একটা ফাঁকা জায়গা রাখে, যেটা Report এ বেমানান
                  দেখায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                উল্টো পথে আছে <code className={CODE}>to_number(লেখা, ছাঁচ)</code>: কমাওয়ালা লেখা থেকে
                আবার numeric। ছাঁচে G মানে হাজারের কমা আর D মানে দশমিক বিন্দু। তারিখের জন্য to_char
                এর ছাঁচ আপনি দেখেছেন এই মডিউলের তারিখের লেসনে, এখানে শুধু সংখ্যা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="to_char আর to_number"
              query={`SELECT title, price_bdt,
       to_char(price_bdt, 'FM99,999') AS with_comma,
       to_char(price_bdt, 'FM99,999.00') AS with_paisa
FROM tours
WHERE tour_id IN (1, 7, 8)
ORDER BY tour_id;

SELECT to_number('12,500.00', '99G999D99') AS back_to_number,
       pg_typeof(to_number('12,500.00', '99G999D99')) AS its_type;`}
              caption="12,500 আর 12,500.00, 3,500 আর 3,500.00, 32,000 আর 32,000.00। শেষ Query লেখা থেকে আবার সংখ্যা ফেরত আনে: 12500.00, Type numeric।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "to_char এর ফলাফল লেখা, আর সাজানো হবে লেখা হিসেবে",
          content: (
            <ContentParagraph>
              to_char এর ফলাফলের Type text। তাই ORDER BY with_comma লিখলে সাজানো হবে অক্ষর ধরে:
              &apos;12,500&apos; আগে আসবে &apos;3,500&apos; এর, কারণ 1 আগে আসে 3 এর। সুন্দর লেখা
              দেখান, কিন্তু সাজান আসল সংখ্যা ধরে: ORDER BY price_bdt। আর Format করার কাজটা রাখুন
              একদম শেষে, দেখানোর মুহূর্তে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 3 · Medium"
              orderMatters
              task={
                <>
                  Brochure এর জন্য প্রতিটা ট্যুরের <code className={CODE}>title</code> আর দাম কমা সহ, দশমিক
                  ছাড়া (যেমন 12,500), নাম দিন <code className={CODE}>price_text</code>। সবচেয়ে দামি ট্যুর আগে।
                </>
              }
              hint={
                <>
                  ছাঁচটা <code className={CODE}>{"'FM99,999'"}</code>। আর সাজানোর সময় লেখা ধরে না, আসল দাম
                  ধরে সাজান: <code className={CODE}>ORDER BY price_bdt DESC</code>।
                </>
              }
              solution={`SELECT title, to_char(price_bdt, 'FM99,999') AS price_text
FROM tours
ORDER BY price_bdt DESC;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Cast এর আরেকটা কাজ হলো লেখার Function ব্যবহারের পথ খুলে দেওয়া। LIKE লেখার জন্য
              বানানো, numeric এ সে চলে না: <code className={CODE}>{"price_bdt LIKE '1%'"}</code>{" "}
              দেয় ERROR: operator does not exist: numeric ~~ unknown (~~ হলো LIKE এর ভেতরের নাম)।
              কিন্তু price_bdt কে আগে লেখায় বদলালে LIKE চলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 4 · Medium"
              task={
                <>
                  যে ট্যুরগুলোর দামের প্রথম অঙ্ক 1, সেগুলোর <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code> বের করুন। দামকে লেখায় Cast করে LIKE ব্যবহার করুন।
                </>
              }
              hint={
                <>
                  <code className={CODE}>price_bdt::text</code> এর উপর LIKE, আর Pattern{" "}
                  <code className={CODE}>{"'1%'"}</code>: শুরুতে 1, তারপর যা খুশি।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE price_bdt::text LIKE '1%';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "dates-and-times",
      subHeader: { index: "010", title: "Dates and Times" },
      title: <SectionTitle>লেখা থেকে তারিখ, আর সময় থেকে শুধু তারিখ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                তারিখের লেখা সবচেয়ে বিপজ্জনক, কারণ সেখানে Error না হয়ে ভুল উত্তর আসতে পারে।
                বাংলাদেশে আমরা 01/11/2026 লিখলে বুঝি এক নভেম্বর। আমেরিকায় একই লেখা মানে এগারো
                জানুয়ারি। PostgreSQL কোনটা ধরবে, সেটা ঠিক করে একটা Setting, নাম DateStyle। এর
                Default সাধারণত ISO, MDY, মানে স্ল্যাশ দেওয়া লেখায় আগে মাস (Month), তারপর দিন
                (Day), তারপর বছর (Year)। Server বসানোর সময়ের ভাষা আর অঞ্চলের Setting দেখে কোনো
                মেশিনে এটা DMY ও হতে পারে, তাই আন্দাজের উপর ভরসা না করে SHOW DateStyle দিয়ে দেখে
                নেওয়াই নিরাপদ।
              </ContentParagraph>
              <ContentParagraph>
                তাই <code className={CODE}>{"'01/11/2026'::date"}</code> কোনো Error দেয় না, চুপচাপ দেয়
                2026-01-11। আর <code className={CODE}>{"'31/12/2026'::date"}</code> থামে, কারণ ৩১ নম্বর
                মাস নেই। দুটো নিরাপদ রাস্তা আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  সবসময় বছর-মাস-দিন লিখুন: &apos;2026-11-01&apos;। এটাকে বলে ISO 8601 চেহারা, আর এটা
                  কোনো Setting এ গুলিয়ে যায় না।
                </ListItem>
                <ListItem>
                  অন্য চেহারার লেখা এলে <code className={CODE}>to_date(লেখা, ছাঁচ)</code> দিয়ে নিজে
                  বলে দিন কোনটা দিন আর কোনটা মাস: <code className={CODE}>{"to_date('01/11/2026', 'DD/MM/YYYY')"}</code>।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই লেখা, দুই রকম তারিখ"
              query={`SHOW DateStyle;

SELECT '2026-11-01'::date AS iso,
       '01/11/2026'::date AS slash,
       to_date('01/11/2026', 'DD/MM/YYYY') AS with_to_date;

SELECT '31/12/2026'::date;`}
              caption="DateStyle হলো ISO, MDY। তারপর 2026-11-01, 2026-01-11 (চুপচাপ ভুল!) আর 2026-11-01। শেষটা থামে: date/time field value out of range, সাথে HINT: Perhaps you need a different &quot;DateStyle&quot; setting।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5 · Medium"
              orderMatters
              task={
                <>
                  একজন এজেন্ট মেসেজ পাঠালেন: &ldquo;12/11/2026 বা তার পরে শুরু হওয়া সব Departure
                  দিন।&rdquo; বাংলাদেশি লেখা, মানে দিন/মাস/বছর। <code className={CODE}>departure_id</code> আর{" "}
                  <code className={CODE}>starts_on</code> বের করুন, তারিখের ক্রমে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>{"'12/11/2026'::date"}</code> লিখলে DateStyle মাস আগে ধরবে, মানে ১১
                  ডিসেম্বর, আর উত্তরে আসবে মাত্র চারটা। to_date এ ছাঁচ দিন{" "}
                  <code className={CODE}>{"'DD/MM/YYYY'"}</code>।
                </>
              }
              solution={`SELECT departure_id, starts_on
FROM departures
WHERE starts_on >= to_date('12/11/2026', 'DD/MM/YYYY')
ORDER BY starts_on;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার উল্টো দিক। booked_at একটা timestamptz: একটা নির্দিষ্ট মুহূর্ত, তারিখ, ঘণ্টা,
                মিনিট আর Time Zone সহ। Report এ প্রায়ই দরকার শুধু দিনটা: &ldquo;কোন দিন বুক
                হয়েছিল?&rdquo; <code className={CODE}>booked_at::date</code> ঠিক সেটা দেয়, আর{" "}
                <code className={CODE}>booked_at::time</code> দেয় শুধু ঘড়ির সময়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু একটা সূক্ষ্ম কথা আছে। একই মুহূর্ত ঢাকায় এক তারিখ, টোকিওতে আরেক তারিখ হতে
                পারে। timestamptz থেকে date বানানোর সময় PostgreSQL দেখে আপনার Session এর Time
                Zone কী। এই বক্সগুলো চলে Asia/Dhaka তে। Booking 18 হয়েছিল ঢাকায় রাত সাড়ে
                এগারোটায়। টোকিওতে তখন পরের দিন রাত আড়াইটা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মুহূর্ত থেকে দিন: Time Zone ঠিক করে কোন দিন"
              query={`SELECT booking_id, booked_at,
       booked_at::date AS booked_on,
       booked_at::time AS booked_time
FROM bookings
WHERE booking_id IN (1, 18)
ORDER BY booking_id;

SET TimeZone = 'Asia/Tokyo';
SELECT booking_id, booked_at, booked_at::date AS booked_on
FROM bookings WHERE booking_id = 18;

SET TimeZone = 'Asia/Dhaka';`}
              caption="ঢাকায় Booking 18 এর দিন 2026-09-28। Time Zone টোকিও করলে একই মুহূর্ত দেখায় 2026-09-29 02:30:00+09, আর দিনও হয়ে যায় 29। শেষ লাইন বক্সটাকে আবার ঢাকায় ফেরায়। Time Zone এর পুরো গল্প আপনি পড়েছেন এই মডিউলের তারিখের লেসনে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6 · Medium"
              task={
                <>
                  1 থেকে 10 অক্টোবর 2026 এর মধ্যে (দুই দিনই সহ, ঢাকার দিন হিসেবে) করা Booking গুলোর{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>seats</code> বের করুন।{" "}
                  <code className={CODE}>booked_at</code> কে date এ Cast করে তুলনা করুন।
                </>
              }
              hint={
                <>
                  date এ Cast করার পর সময়ের ঝামেলা থাকে না, তাই BETWEEN নিরাপদ:{" "}
                  <code className={CODE}>{"booked_at::date BETWEEN '2026-10-01' AND '2026-10-10'"}</code>।
                </>
              }
              solution={`SELECT booking_id, seats
FROM bookings
WHERE booked_at::date BETWEEN '2026-10-01' AND '2026-10-10';`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "booleans",
      subHeader: { index: "011", title: "Booleans" },
      title: <SectionTitle>হ্যাঁ, না: boolean এ Cast</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                CSV ফাইলে চালু ট্যুরের ঘরে কেউ লেখেন yes, কেউ Y, কেউ 1, কেউ on। PostgreSQL এর
                boolean এর লেখা পড়ার নিয়ম উদার: true, yes, on, y, t, 1 সবই সত্য, আর false, no, off,
                n, f, 0 সবই মিথ্যা। বড় হাত ছোট হাতে কিছু যায় আসে না। কিন্তু maybe বা হ্যাঁ বা
                খালি লেখা চলে না, সেখানে আসে 22P02।
              </ContentParagraph>
              <ContentParagraph>
                boolean আর সংখ্যার সম্পর্ক কড়া। <code className={CODE}>is_active = 1</code> লিখলে
                Error: operator does not exist: boolean = integer। PostgreSQL boolean কে নিজে থেকে
                সংখ্যা বানায় না। কিন্তু চাইলে দেয়: <code className={CODE}>is_active::integer</code>{" "}
                দেয় 1 আর 0। Report বা Spreadsheet এ পাঠানোর সময় এটা কাজে লাগে, আর পরের মডিউলে
                গোনার কাজেও।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="boolean এর লেখা, আর boolean থেকে সংখ্যা"
              query={`SELECT 'yes'::boolean AS a, 'on'::boolean AS b,
       '1'::boolean AS c, 'N'::boolean AS d;

SELECT title, is_active,
       is_active::integer AS active_flag
FROM tours
WHERE tour_id IN (1, 8)
ORDER BY tour_id;

SELECT title FROM tours WHERE is_active = 1;`}
              caption="প্রথমটা: t, t, t, f। দ্বিতীয়টা: Saint Martin Island Escape এর পাশে t আর 1, Saint Martin Luxury Stay এর পাশে f আর 0। তৃতীয়টা থামে: operator does not exist: boolean = integer। boolean Column নিজেই একটা শর্ত, তাই লিখুন WHERE is_active।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 7 · Easy"
              orderMatters
              task={
                <>
                  একটা Spreadsheet এর জন্য প্রতিটা ট্যুরের <code className={CODE}>title</code> আর চালু কিনা
                  সেটা 1 বা 0 হিসেবে, নাম দিন <code className={CODE}>active_flag</code>। tour_id এর ক্রমে।
                </>
              }
              hint={<>boolean থেকে integer এ Explicit Cast: is_active::integer।</>}
              solution={`SELECT title, is_active::integer AS active_flag
FROM tours
ORDER BY tour_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "casts-in-where",
      subHeader: { index: "012", title: "Casts in WHERE" },
      title: <SectionTitle>WHERE এ Cast কোন পাশে বসবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                WHERE এ Cast বসানোর দুটো জায়গা আছে: Column এর উপর, অথবা মানের উপর। দেখতে ছোট
                পার্থক্য, কিন্তু ফল দুই রকম হতে পারে: উত্তর বদলে যেতে পারে, আর গতি বদলে যেতে
                পারে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমে উত্তর। <code className={CODE}>{"price_bdt::text = '12500'"}</code> একটা Row ও দেয়
                না। কারণ Cast এর পর বাঁদিকে আছে লেখা &apos;12500.00&apos;, ডানদিকে &apos;12500&apos;, আর
                লেখা মেলে অক্ষরে অক্ষরে। কোনো Error নেই, শুধু শূন্য Row। সংখ্যাকে সংখ্যার সাথে
                মেলালে সমস্যাটা থাকেই না: <code className={CODE}>price_bdt = 12500</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Column কে লেখায় বদলালে তুলনাও বদলায়"
              query={`SELECT title FROM tours WHERE price_bdt = 12500;

SELECT title FROM tours WHERE price_bdt::text = '12500';

SELECT title FROM tours WHERE price_bdt::text = '12500.00';`}
              caption="প্রথমটা: Saint Martin Island Escape। দ্বিতীয়টা: (0 rows), কোনো Error ছাড়াই। তৃতীয়টা আবার Saint Martin, কারণ এবার লেখা হুবহু মেলে। নিয়ম: তুলনা করুন মানের আসল Type এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার গতি। <code className={CODE}>{"booked_at::date = '2026-10-14'"}</code> আর{" "}
                <code className={CODE}>{"booked_at >= '2026-10-14' AND booked_at < '2026-10-15'"}</code>{" "}
                একই Booking দেয়, Booking 24। কিন্তু Database বড় হলে দ্বিতীয়টা অনেক দ্রুত হতে
                পারে। কারণ একটা Index, যেটা বইয়ের সূচির মতো, সাজানো থাকে booked_at ধরে। প্রথম
                লেখায় প্রতিটা Row এর booked_at আগে date এ বদলাতে হয়, তাই সূচি কাজে আসে না।
                দ্বিতীয় লেখায় Column যেমন আছে তেমন থাকে, আর সূচি সরাসরি সেই জায়গায় পৌঁছায়।
              </ContentParagraph>
              <ContentParagraph>
                Index আর Query Plan Module 13 এর বিষয়। নিচের বক্সে শুধু এক ঝলক দেখুন। বক্সটা একটা
                Transaction এর ভেতরে Index বানায়, PostgreSQL কে বলে পুরো Table পড়া এড়িয়ে চলতে,
                দুটো Query এর Plan দেখায় (EXPLAIN), তারপর ROLLBACK করে সব আগের মতো করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Index কোন লেখা চিনতে পারে"
              query={`SELECT booking_id FROM bookings
WHERE booked_at::date = '2026-10-14';

BEGIN;
CREATE INDEX bookings_booked_at_idx ON bookings (booked_at);
SET LOCAL enable_seqscan = off;

EXPLAIN SELECT booking_id FROM bookings
WHERE booked_at::date = '2026-10-14';

EXPLAIN SELECT booking_id FROM bookings
WHERE booked_at >= '2026-10-14' AND booked_at < '2026-10-15';

ROLLBACK;`}
              caption="প্রথম Query দেয় Booking 24। প্রথম EXPLAIN এ Seq Scan on bookings, সাথে Disabled: true: Index থাকা সত্ত্বেও PostgreSQL কে পুরো Table পড়তে হচ্ছে। দ্বিতীয় EXPLAIN এ Index Scan using bookings_booked_at_idx। ROLLBACK এর পর Index টা আর নেই।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <CastInWhereDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Cast বসান মানের দিকে, Column এর দিকে না",
          content: (
            <ContentParagraph>
              একটা অভ্যাস করে নিন: WHERE এ Column কে যেমন আছে তেমন রাখুন, দরকারি বদল করুন অন্য
              পাশের মানে। দিনের হিসাবের জন্য Column এ ::date না দিয়ে দিনের শুরু আর পরের দিনের শুরু
              দিয়ে সীমা টানুন। এতে উত্তর ঠিক থাকে, আর ভবিষ্যতে Index বসলে সেটাও কাজে আসে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ Cast: নরম, আর সেটাই বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                আপনার MySQL কোর্স ফলো করার সময় তিনটা পার্থক্য সবচেয়ে বেশি চোখে পড়বে। এক, MySQL এ
                :: নেই, শুধু CAST আর CONVERT। দুই, CAST এর Type এর নাম আলাদা: integer এর জায়গায়
                SIGNED (চিহ্নসহ পূর্ণ সংখ্যা) বা UNSIGNED, লেখার জন্য CHAR, দশমিকের জন্য DECIMAL।
                তিন, আর সবচেয়ে বড়টা: ভুল লেখা পেলে MySQL থামে না। সে যতটুকু পড়তে পারে ততটুকু
                নেয়, আর একটা Warning রেখে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের প্রতিটা লাইন এই লেসনের জন্য MySQL 8.4.11 এ চালানো, island_tours এর MySQL
                সংস্করণে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL 18", "MySQL 8.4"],
          rows: [
            ["Type বদলানো", "CAST(x AS integer), x::integer", "CAST(x AS SIGNED), CONVERT(x, SIGNED); :: দিলে ERROR 1064"],
            ["integer নামে Cast", "CAST(x AS integer) চলে", "CAST(x AS INTEGER) দেয় ERROR 1064, লিখুন SIGNED বা SIGNED INTEGER"],
            ["'12,500' সংখ্যায়", "ERROR 22P02", "12, সাথে Warning 1292: Truncated incorrect INTEGER value"],
            ["'abc' সংখ্যায়", "ERROR 22P02", "0, সাথে Warning 1292"],
            ["WHERE customer_id = '7abc'", "ERROR 22P02", "Arif Chowdhury কে ফেরত দেয়, সাথে শুধু Warning"],
            ["'1abc' = 1", "ERROR 22P02", "1 (সত্য), সাথে Warning"],
            ["'2026-02-30' তারিখে", "ERROR 22008: out of range", "NULL, সাথে Warning: Incorrect datetime value"],
            ["2.5 পূর্ণ সংখ্যায়", "2.5::integer দেয় 3", "CAST(2.5 AS SIGNED) দেয় 3, কিন্তু CAST('2.5' AS SIGNED) দেয় 2"],
            ["দিন/মাস/বছর পড়া", "to_date('01/11/2026', 'DD/MM/YYYY')", "STR_TO_DATE('01/11/2026', '%d/%m/%Y')"],
            ["কমাসহ সংখ্যা দেখানো", "to_char(12500, 'FM99,999.00')", "FORMAT(12500, 2) দেয় 12,500.00"],
            ["Table এ ভুল লেখা ঢোকানো", "ERROR 22P02", "Strict Mode এ (Default) ERROR 1366: Incorrect integer value"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এর Warning দেখতে হয় চেয়ে নিয়ে",
          content: (
            <ContentParagraph>
              MySQL এর Warning Query এর ফলাফলের সাথে আসে না। mysql Client শুধু একটা ছোট লাইনে
              বলে কয়টা Warning আছে, আর দেখতে আলাদা করে SHOW WARNINGS চালাতে হয়। App থেকে চালালে
              প্রায় কেউই দেখে না। তাই MySQL এ লেখা থেকে সংখ্যা বা তারিখ বানানোর আগে নিজেই যাচাই
              করুন লেখাটা ঠিক কিনা। একটা ভালো খবর: Table এ ঢোকানোর সময় MySQL এর Default Strict
              Mode ভুল লেখা আটকায়, যেমন seats এর ঘরে &apos;two&apos; দিলে ERROR 1366।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ Cast কোথায় কোথায় লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা Booking এর Confirmation Email ভাবুন। Email এ যা দেখায়, তার প্রায় প্রতিটা
                অংশ একটা Cast বা Format: Booking এর নম্বর লেখার সাথে জোড়া, বুকের তারিখ দিন/মাস/বছর
                চেহারায়, সিটের সংখ্যা লেখার সাথে, আর টাকা কমা সহ। ওদিকে ট্যুরের পাতা খোলার সময়
                ঠিকানার ?tour=3 আসে লেখা হয়ে, আর WHERE tour_id = &apos;3&apos; সেটা নিজেই মিলিয়ে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে প্রথম Query হলো Booking 13 এর Email লাইন, দ্বিতীয়টা ট্যুরের পাতা।
                দুটোতেই খেয়াল করুন, হিসাব হয়েছে আসল Type এ, আর লেখায় বদলানো হয়েছে একদম শেষে,
                দেখানোর জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Confirmation Email আর ট্যুরের পাতা"
              query={`SELECT booking_id,
       'Booking #' || booking_id AS reference,
       to_char(booked_at::date, 'DD/MM/YYYY') AS booked_on,
       seats::text || ' seat(s)' AS seats_text,
       to_char(total_bdt, 'FM99,999') || ' BDT' AS amount
FROM bookings
WHERE booking_id = 13;

SELECT tour_id, title,
       to_char(price_bdt, 'FM99,999') AS price_text
FROM tours
WHERE tour_id = '3';`}
              caption="Booking #13, 15/09/2026, 2 seat(s), 25,000 BDT। তারপর ট্যুরের পাতা: 3, Sundarbans Mangrove Cruise, 18,000। দ্বিতীয় Query তে '3' এসেছে লেখা হয়ে, কিন্তু tour_id এর পাশে বসে সে নিজেই integer হয়ে গেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "App এ সত্যিকারের নিয়ম: Parameter দিয়ে পাঠান",
          content: (
            <ContentParagraph>
              বাস্তবে API কখনো ব্যবহারকারীর লেখা Query এর ভেতরে জোড়া লাগায় না। সে লেখাটাকে
              Parameter হিসেবে আলাদা পাঠায়, আর Driver বলে দেয় সেটার Type কী। এতে Type এর গোলমালও
              কমে, আর SQL Injection এর রাস্তাও বন্ধ হয়। Module 01 এর Lesson 06 এ এর এক ঝলক
              দেখেছেন, পুরোটা আসবে Module 16 আর 17 এ।
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
                  অক্টোবর 2026 এর রিপোর্ট: সেই মাসে (ঢাকার দিন ধরে) করা যে Booking গুলোর{" "}
                  <code className={CODE}>total_bdt</code> ২০,০০০ বা বেশি, সেগুলোর তিনটা Column দিন:{" "}
                  <code className={CODE}>booking_id</code>, বুকের দিন DD/MM/YYYY চেহারায়{" "}
                  <code className={CODE}>booked_on</code> নামে (যেমন 01/10/2026), আর টাকা কমা সহ দশমিক ছাড়া{" "}
                  <code className={CODE}>total_text</code> নামে (যেমন 50,000)। বুকের সময়ের ক্রমে সাজান।
                </>
              }
              hint={
                <>
                  দিনের শর্তে booked_at::date ব্যবহার করুন (1 থেকে 31 অক্টোবর), টাকার শর্ত দিন আসল সংখ্যায়
                  (total_bdt &gt;= 20000), আর দেখানোর জন্য দুটো to_char: একটায় ছাঁচ{" "}
                  <code className={CODE}>{"'DD/MM/YYYY'"}</code>, আরেকটায় <code className={CODE}>{"'FM99,999'"}</code>।
                  সাজান booked_at ধরে, লেখা ধরে না।
                </>
              }
              solution={`SELECT booking_id,
       to_char(booked_at::date, 'DD/MM/YYYY') AS booked_on,
       to_char(total_bdt, 'FM99,999') AS total_text
FROM bookings
WHERE booked_at::date >= '2026-10-01'
  AND booked_at::date <= '2026-10-31'
  AND total_bdt >= 20000
ORDER BY booked_at;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Type এর গোলমাল এলে, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "দুই পাশের Type জানুন",
              description:
                "Error বা অদ্ভুত উত্তর এলে আগে pg_typeof() দিয়ে দুই পাশের Type দেখুন। Error এর লেখাতেই প্রায়ই Type দুটো লেখা থাকে: text = bigint, boolean = integer।",
            },
            {
              title: "Quote এর লেখাকে কাজ করতে দিন",
              description:
                "Column এর সাথে তুলনায় Quote এর লেখা নিজেই Column এর Type নেয়: tour_id = '3' চলে। তাই সংখ্যা Column এর সাথে লেখা তুলনায় সাধারণত আলাদা Cast লাগে না, শুধু লেখাটা বৈধ হতে হবে।",
            },
            {
              title: "Cast বসান মানের দিকে",
              description:
                "দরকার হলে Cast বসান তুলনার অন্য পাশে, Column এ না। এতে তুলনা চলে Column এর আসল Type এ, উত্তর থাকে ঠিক, আর Index কাজে আসে।",
            },
            {
              title: "চেহারা আলাদা হলে Function",
              description:
                "কমাওয়ালা সংখ্যা বা দিন/মাস/বছর তারিখ হলে সরাসরি Cast না করে to_number বা to_date দিয়ে ছাঁচ বলে দিন। তারিখের জন্য সবচেয়ে ভালো বছর-মাস-দিন লেখা।",
            },
            {
              title: "ভুল লেখার জন্য তৈরি থাকুন",
              description:
                "বাইরে থেকে আসা লেখা ভুল হতে পারে, আর PostgreSQL তখন 22P02 দিয়ে থামবে। আগে পরিষ্কার করুন (replace, trim), খালি লেখাকে NULL বানান (পরের লেসনের NULLIF)।",
            },
            {
              title: "Format একদম শেষে",
              description:
                "হিসাব, তুলনা আর সাজানো আসল Type এ। to_char দিয়ে সুন্দর লেখা বানান শুধু দেখানোর জন্য, SELECT এর তালিকায়, শেষ ধাপে।",
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
          headers: ["ভুল", "কী ঘটে", "ঠিক লেখা"],
          rows: [
            ["phone = 8801000000101", "ERROR: text = bigint", "phone = '+8801000000101'"],
            ["phone = 8801000000101::text", "Error নেই, কিন্তু + না থাকায় ০টা Row", "Data যে চেহারায় আছে সেই চেহারায় লেখা"],
            ["'12,500'::integer", "ERROR 22P02", "replace('12,500', ',', '')::integer বা to_number"],
            ["'3.5' + 1", "ERROR 22P02, কারণ '3.5' কে integer ধরা হলো", "'3.5'::numeric + 1"],
            ["'01/11/2026'::date", "Error নেই, কিন্তু ১১ জানুয়ারি", "'2026-11-01' বা to_date(..., 'DD/MM/YYYY')"],
            ["price_bdt::text = '12500'", "০টা Row, কারণ লেখা '12500.00'", "price_bdt = 12500"],
            ["price_bdt LIKE '1%'", "ERROR: numeric ~~ unknown", "price_bdt::text LIKE '1%'"],
            ["is_active = 1", "ERROR: boolean = integer", "WHERE is_active, অথবা is_active::integer = 1"],
            ["(a / b)::integer এ Parentheses ভুলে যাওয়া", ":: শুধু b তে বসে, ভাগ হয় আগের মতোই", "(price_bdt / max_seats)::integer"],
            ["ORDER BY to_char(...)", "লেখা ধরে সাজানো: 12,500 আগে 3,500", "ORDER BY আসল Column"],
            ["MySQL এ :: লেখা", "ERROR 1064", "CAST(x AS SIGNED)"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়তে আর দেখতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-expressions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Value Expressions, Type Casts অংশ
                </a>
                : CAST আর :: যে সমান, আর Quote এর লেখায় Cast যে আসলে প্রথমবার Type দেওয়া, তার অফিসিয়াল লেখা।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/typeconv.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Type Conversion
                </a>
                : PostgreSQL কীভাবে Operator আর Function এর জন্য Type বেছে নেয়, পুরো নিয়ম। একটু ভারী, কিন্তু প্রথম পাতাটা পড়ার মতো।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/functions-formatting.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Data Type Formatting Functions
                </a>
                : to_char, to_number, to_date এর সব ছাঁচ এক জায়গায়।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-boolean.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Boolean Type
                </a>
                : boolean কোন কোন লেখা চেনে, তার তালিকা।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/datatype-datetime.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  Date/Time Types
                </a>
                : DateStyle আর তারিখের লেখা পড়ার নিয়ম।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/cast-functions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Cast Functions and Operators
                </a>
                : MySQL এর CAST আর CONVERT, কোন কোন Type এ Cast চলে।
              </ListItem>
              <ListItem>
                <a href="https://dev.mysql.com/doc/refman/8.4/en/type-conversion.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  MySQL 8.4: Type Conversion in Expression Evaluation
                </a>
                : &apos;1abc&apos; = 1 কেন সত্য হয়, তার নিয়ম।
              </ListItem>
              <ListItem>
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM" className={LINK} target="_blank" rel="noopener noreferrer">
                  আপনার MySQL কোর্সের ভিডিও
                </a>
                : ভিডিওটা MySQL এ। সেখানে কোনো CAST দেখলে এই লেসনের MySQL ছকটা পাশে রাখুন, PostgreSQL এ কী বদলাতে হবে সেটা ছকেই আছে।
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
      title: <SectionTitle>এক নজরে, আর এরপর কী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রতিটা মানের একটা Type আছে, আর Type ঠিক করে তুলনা, যোগ আর সাজানো কীভাবে হবে।
                Type বদলানোর নাম Cast: CAST(x AS type) Standard, x::type PostgreSQL এর ছোট লেখা।
                Quote এর লেখা পাশের জিনিস থেকে Type নেয়। যে বদলে কিছু হারায় না, সেটা PostgreSQL
                নিজে করে। যে বদলে কিছু হারাতে পারে বা ভুল হতে পারে, সেটা আপনাকে চাইতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                ভুল লেখা পেলে PostgreSQL থামে (22P02), MySQL চুপচাপ যা পারে নেয়। numeric থেকে
                integer এ Round হয়। to_char আর to_number সংখ্যা আর সুন্দর লেখার মধ্যে যাতায়াত করে,
                to_date অন্য চেহারার তারিখ পড়ে। timestamptz থেকে date হয় Session এর Time Zone
                ধরে। আর WHERE এ Cast বসান মানের দিকে, Column এর দিকে না।
              </ContentParagraph>
              <ContentParagraph>
                নিজেকে তিনটা প্রশ্ন করুন। এক, &apos;3&apos; + 1 চলে কিন্তু &apos;3.5&apos; + 1 কেন
                চলে না? দুই, &apos;01/11/2026&apos;::date কেন সবচেয়ে বিপজ্জনক Cast? তিন,
                price_bdt::text = &apos;12500&apos; কেন কিছুই ফেরত দেয় না? তিনটার উত্তর একজন
                বন্ধুকে মুখে বোঝাতে পারলে লেসনটা আপনার।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে খালি লেখা আর NULL নিয়ে দুইবার বলা হয়েছে &ldquo;পরের লেসনে&rdquo;। পাঁচজন
                Customer এর ফোন নম্বর নেই, Ratargul ট্যুরের Guide নেই, আর শূন্য দিয়ে ভাগ করলে
                Error হয়। এই সবকিছুর হাতিয়ার আসছে পরের লেসনে:{" "}
                <Link href="/sql/topic/null-functions" className={LINK}>
                  COALESCE, NULLIF, GREATEST, LEAST
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
      ["Type", "মান কী জিনিস, আর তার সাথে কী কাজ চলে", "text, integer, numeric, date, boolean"],
      ["pg_typeof", "যেকোনো মানের Type জিজ্ঞেস করা", "pg_typeof(price_bdt) দেয় numeric"],
      ["CAST আর ::", "Type বদলানো, দুই লেখা একই কাজ", "CAST('12500' AS integer), '12500'::integer"],
      ["Quote এর লেখা", "Type পায় পাশের জিনিস থেকে", "tour_id = '3' চলে, '3.5' + 1 চলে না"],
      ["Implicit Cast", "কিছু না হারালে PostgreSQL নিজে বদলায়", "1 + 1.5 দেয় 2.5"],
      ["Explicit Cast", "হারাতে পারে বা ভুল হতে পারে, তাই চাইতে হয়", "price_bdt::integer, booked_at::date"],
      ["22P02", "লেখাটা ওই Type এর বৈধ লেখা না", "'12,500'::integer"],
      ["Round", "numeric থেকে integer এ কাটা না, Round", "2.5::integer দেয় 3"],
      ["to_char / to_number", "সংখ্যা থেকে সুন্দর লেখা, আর ফেরত", "to_char(price_bdt, 'FM99,999')"],
      ["to_date আর DateStyle", "দিন/মাস/বছর পড়তে ছাঁচ দিন", "to_date('01/11/2026', 'DD/MM/YYYY')"],
      ["timestamptz থেকে date", "Session এর Time Zone ধরে দিন", "booked_at::date"],
      ["boolean", "yes, on, 1 সত্য; integer এ শুধু Explicit", "is_active::integer"],
      ["WHERE এ Cast", "মানের দিকে, Column এর দিকে না", "booked_at >= '2026-10-14' AND < '2026-10-15'"],
      ["MySQL", "SIGNED, CHAR, DECIMAL; ভুল লেখায় Warning, Error না", "CAST('12,500' AS SIGNED) দেয় 12"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT '10' < '9'; এর উত্তর কী, আর কেন?",
        options: [
          {
            key: "A",
            text: "f, কারণ দশ নয়ের চেয়ে বড়",
            isCorrect: false,
            explanation: "সংখ্যা হলে তাই হতো। কিন্তু দুটোই Quote এর ভেতরে, আর অন্য পাশেও লেখা, তাই তুলনা হয় লেখা হিসেবে।",
          },
          {
            key: "B",
            text: "t, কারণ লেখা তুলনা হয় অক্ষর ধরে, আর 1 আগে আসে 9 এর",
            isCorrect: true,
            explanation: "ঠিক। প্রথম অক্ষর 1 আর 9 তুলনা হয়, সেখানেই সিদ্ধান্ত। সংখ্যা হিসেবে চাইলে Cast করতে হবে, যেমন '10'::integer < '9'::integer।",
          },
          {
            key: "C",
            text: "Error, কারণ লেখার তুলনা চলে না",
            isCorrect: false,
            explanation: "লেখার তুলনা চলে, অক্ষর ধরে। এই লেসনের প্রথম বক্সেই এটা চলেছে।",
          },
          {
            key: "D",
            text: "NULL, কারণ Type জানা নেই",
            isCorrect: false,
            explanation: "দুই পাশেই Quote এর লেখা, PostgreSQL দুটোকেই text ধরে তুলনা করে, উত্তর জানা।",
          },
        ],
      },
      {
        id: 2,
        text: "CAST(price_bdt AS integer) আর price_bdt::integer এর মধ্যে পার্থক্য কী?",
        options: [
          {
            key: "A",
            text: "প্রথমটা Round করে, দ্বিতীয়টা কেটে ফেলে",
            isCorrect: false,
            explanation: "দুটো একই Cast, একই ফল। কেটে ফেলতে চাইলে trunc লাগে।",
          },
          {
            key: "B",
            text: "PostgreSQL এ কোনো পার্থক্য নেই, শুধু CAST লেখাটা MySQL এও চলে",
            isCorrect: true,
            explanation: "ঠিক। CAST হলো SQL Standard, :: হলো PostgreSQL এর নিজস্ব পুরনো লেখা। MySQL এ :: দিলে ERROR 1064।",
          },
          {
            key: "C",
            text: ":: দ্রুত চলে",
            isCorrect: false,
            explanation: "দুটো লেখা একই কাজে পরিণত হয়, গতির কোনো পার্থক্য নেই।",
          },
          {
            key: "D",
            text: "CAST শুধু Column এর সাথে চলে",
            isCorrect: false,
            explanation: "CAST যেকোনো মানের সাথে চলে: CAST('12500' AS integer) এই লেসনেই চলেছে।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT '3.5' + 1; কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "কারণ লেখার সাথে সংখ্যা যোগ করা যায় না",
            isCorrect: false,
            explanation: "তাহলে '3' + 1 ও Error দিত, কিন্তু সেটা 4 দেয়।",
          },
          {
            key: "B",
            text: "কারণ Quote এর লেখা পাশের 1 দেখে integer হতে চায়, আর 3.5 কোনো integer না",
            isCorrect: true,
            explanation: "ঠিক। Quote এর লেখার Type আগে unknown, পাশের integer দেখে PostgreSQL তাকে integer হিসেবে পড়তে চায়। '3.5'::numeric + 1 লিখলে 4.5।",
          },
          {
            key: "C",
            text: "কারণ দশমিক সংখ্যায় যোগ চলে না",
            isCorrect: false,
            explanation: "1 + 1.5 চলে, উত্তর 2.5। সমস্যা দশমিকে না, লেখাটা কোন Type হিসেবে পড়া হচ্ছে তাতে।",
          },
          {
            key: "D",
            text: "কারণ MySQL ছাড়া এটা চলে না",
            isCorrect: false,
            explanation: "MySQL এ এটা 4.5 দেয় ঠিকই, কিন্তু PostgreSQL এর Error এর কারণ তার নিজের Type এর নিয়ম।",
          },
        ],
      },
      {
        id: 4,
        text: "2.5::integer আর 2.5::float8::integer কী দেয়?",
        options: [
          {
            key: "A",
            text: "2 আর 2",
            isCorrect: false,
            explanation: "numeric থেকে integer এ মাঝখানের সংখ্যা শূন্য থেকে দূরে যায়, তাই প্রথমটা 3।",
          },
          {
            key: "B",
            text: "3 আর 3",
            isCorrect: false,
            explanation: "float থেকে Cast এ মাঝখানের সংখ্যা যায় কাছের জোড় সংখ্যায়, তাই দ্বিতীয়টা 2।",
          },
          {
            key: "C",
            text: "3 আর 2",
            isCorrect: true,
            explanation: "ঠিক। একই 2.5, Type আলাদা বলে Round এর নিয়ম আলাদা। টাকার হিসাবে তাই numeric।",
          },
          {
            key: "D",
            text: "Error, কারণ দশমিক থেকে integer এ যাওয়া যায় না",
            isCorrect: false,
            explanation: "যাওয়া যায়, শুধু নিজে চাইতে হয় (Explicit)। Round হয়, Error না।",
          },
        ],
      },
      {
        id: 5,
        text: "DateStyle ISO, MDY থাকলে '01/11/2026'::date কী দেয়?",
        options: [
          {
            key: "A",
            text: "2026-11-01",
            isCorrect: false,
            explanation: "এটা দিন/মাস ধরে পড়লে হতো। MDY মানে আগে মাস।",
          },
          {
            key: "B",
            text: "2026-01-11, কোনো Error ছাড়াই",
            isCorrect: true,
            explanation: "ঠিক, আর সেটাই বিপদ: উত্তর ভুল, কিন্তু কোনো সতর্কবার্তা নেই। '2026-11-01' লিখুন, অথবা to_date এ ছাঁচ দিন।",
          },
          {
            key: "C",
            text: "ERROR: date/time field value out of range",
            isCorrect: false,
            explanation: "এই Error আসে '31/12/2026' এর মতো লেখায়, যেখানে মাস হিসেবে পড়লে ৩১ নম্বর মাস হয়। 01 আর 11 দুটোই বৈধ মাস।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "NULL দেয় MySQL, ভুল তারিখে। PostgreSQL হয় তারিখ দেয়, নয়তো Error।",
          },
        ],
      },
      {
        id: 6,
        text: "WHERE price_bdt::text = '12500' কয়টা Row দেয়, যেখানে Saint Martin Island Escape এর দাম 12500.00?",
        options: [
          {
            key: "A",
            text: "1টা, Saint Martin Island Escape",
            isCorrect: false,
            explanation: "সংখ্যা হিসেবে মেলাতে price_bdt = 12500 লিখলে তাই হতো।",
          },
          {
            key: "B",
            text: "০টা, কারণ Cast এর পর লেখাটা '12500.00', আর লেখা মেলে অক্ষরে অক্ষরে",
            isCorrect: true,
            explanation: "ঠিক। কোনো Error নেই, শুধু শূন্য Row। Column কে লেখায় না বদলে সংখ্যার সাথে সংখ্যা মেলান।",
          },
          {
            key: "C",
            text: "Error, কারণ numeric থেকে text এ যাওয়া যায় না",
            isCorrect: false,
            explanation: "যাওয়া যায়, আর এই লেসনের Exercise 4 এ ঠিক এটাই LIKE এর জন্য করা হয়েছে।",
          },
          {
            key: "D",
            text: "সবগুলো ট্যুর",
            isCorrect: false,
            explanation: "শর্তটা একটা নির্দিষ্ট লেখার সাথে মেলায়, সব Row মেলার কোনো কারণ নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "booked_at এর উপর একটা Index আছে। কোন WHERE সেটা ব্যবহার করতে পারে?",
        options: [
          {
            key: "A",
            text: "WHERE booked_at::date = '2026-10-14'",
            isCorrect: false,
            explanation: "এখানে প্রতিটা Row এর booked_at আগে বদলাতে হয়, আর Index সাজানো booked_at ধরে, booked_at::date ধরে না। EXPLAIN এ দেখেছেন Seq Scan।",
          },
          {
            key: "B",
            text: "WHERE booked_at >= '2026-10-14' AND booked_at < '2026-10-15'",
            isCorrect: true,
            explanation: "ঠিক। Column যেমন আছে তেমন, সীমার মান একবার হিসাব হয়, আর Index সরাসরি সেখানে পৌঁছায়: Index Scan।",
          },
          {
            key: "C",
            text: "দুটোই সমানভাবে",
            isCorrect: false,
            explanation: "উত্তর একই, Booking 24, কিন্তু Plan আলাদা। লেসনের EXPLAIN বক্সে দুটো আলাদা Plan এসেছে।",
          },
          {
            key: "D",
            text: "কোনোটাই না, timestamptz এ Index হয় না",
            isCorrect: false,
            explanation: "হয়। বক্সে bookings_booked_at_idx ঠিক এই Column এর উপর বানানো হয়েছিল।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL 8.4 এ SELECT CAST('12,500' AS SIGNED); কী দেয়?",
        options: [
          {
            key: "A",
            text: "12500",
            isCorrect: false,
            explanation: "MySQL কমা পর্যন্ত পড়ে থেমে যায়, কমা বাদ দিয়ে বাকিটা পড়ে না।",
          },
          {
            key: "B",
            text: "ERROR 22P02, PostgreSQL এর মতো",
            isCorrect: false,
            explanation: "এটাই সবচেয়ে বড় পার্থক্য: MySQL থামে না।",
          },
          {
            key: "C",
            text: "12, সাথে একটা Warning: Truncated incorrect INTEGER value",
            isCorrect: true,
            explanation: "ঠিক। বারো হাজার পাঁচশো হয়ে গেল বারো, আর Warning দেখতে আলাদা করে SHOW WARNINGS চালাতে হয়।",
          },
          {
            key: "D",
            text: "NULL",
            isCorrect: false,
            explanation: "NULL আসে ভুল তারিখে, যেমন CAST('2026-02-30' AS DATE)। সংখ্যায় MySQL যতটুকু পারে পড়ে নেয়।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: একটা অগোছালো CSV কে পরিষ্কার Data বানানো",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>আন্দাজ, তারপর যাচাই:</strong> একটা Form থেকে আসতে পারে এমন আটটা লেখা নিজে বানান: সংখ্যা,
        কমাওয়ালা দাম, দশমিক, তারিখ দুই চেহারায়, হ্যাঁ না, খালি লেখা। প্রতিটা integer, numeric, date আর boolean
        এ Cast করলে কী হবে, আগে লিখে রাখুন। তারপর psql এ চালিয়ে মিলিয়ে দেখুন কোনটা আন্দাজ ভুল হলো।
      </span>,
      <span key="2">
        <strong>দাম পরিষ্কার করা:</strong> &apos;12,500&apos;, &apos; 9500 &apos;, &apos;7,800.00&apos; আর
        &apos;3500&apos; এই চারটা লেখাকে numeric বানান, দুইভাবে: একবার replace আর trim দিয়ে Cast, একবার to_number
        দিয়ে। দুই পথের উত্তর মেলে কিনা দেখান।
      </span>,
      <span key="3">
        <strong>Invoice লাইন:</strong> নিজের island_tours এ তিনটা Booking বেছে প্রতিটার জন্য একটা Email লাইন
        বানান: Booking নম্বর, দিন/মাস/বছর তারিখ, সিটের লেখা, আর কমাসহ টাকা। হিসাব আর সাজানো আসল Type এ রাখুন।
      </span>,
      <span key="4">
        <strong>Index এর পরীক্ষা:</strong> একটা Transaction এর ভেতরে booked_at এর উপর Index বানিয়ে, একই দিনের
        Booking খোঁজার দুই রকম WHERE এর EXPLAIN চালান: Column এ ::date আর সীমা দিয়ে। দুটো Plan এর প্রথম লাইন লিখে
        রাখুন, তারপর ROLLBACK।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু Excel থেকে তারিখ কপি করে Database এ বসান। তাঁকে ছয়
        লাইনে বোঝান &apos;01/11/2026&apos; কেন বিপজ্জনক, আর কোন দুই উপায়ে নিরাপদে তারিখ লেখা যায়।
      </span>,
    ],
    deliverables: [
      <span key="d1">আটটা লেখার আন্দাজ আর আসল ফলাফলের একটা ছক, ভুল আন্দাজগুলো দাগানো</span>,
      <span key="d2">দাম পরিষ্কারের দুই পথের Query আর তাদের ফলাফল</span>,
      <span key="d3">তিনটা Invoice লাইনের Query আর ফলাফল</span>,
      <span key="d4">দুটো EXPLAIN এর প্রথম লাইন আর এক লাইনের ব্যাখ্যা</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "Cast Drill: নিজের psql এ",
    subtitle: "Module 02 এ Load করা island_tours এ, প্রতিটা লাইনের পাশে প্রত্যাশিত ফলাফল",
    stepName: "LAB",
    steps: [
      {
        title: "island_tours এ ঢুকুন আর Time Zone ঠিক করুন",
        description:
          "psql -d island_tours দিয়ে Connect করুন (Docker এ হলে docker exec -it island-pg psql -U postgres -d island_tours)। তারিখের Drill গুলোর জন্য প্রথমেই চালান SET TimeZone = 'Asia/Dhaka';",
      },
      {
        title: "Type দেখা আর Cast এর দুই লেখা",
        description: "প্রথম দুই ফাইল চালান। প্রতিটা উত্তর মন্তব্যে লেখা উত্তরের সাথে মিলিয়ে নিন।",
      },
      {
        title: "লেখা থেকে সংখ্যা",
        description: "তৃতীয় ফাইলে কোন লাইন Error দেবে, চালানোর আগে আন্দাজ করুন। তারপর চালিয়ে মিলিয়ে দেখুন।",
      },
      {
        title: "Round আর প্রতি সিটের দাম",
        description: "চতুর্থ ফাইল চালান, আর Cast আর trunc কোন তিনটা ট্যুরে আলাদা হয় সেটা লিখে রাখুন।",
      },
      {
        title: "তারিখ",
        description:
          "পঞ্চম ফাইল চালান। SHOW DateStyle আপনার মেশিনে কী দেখায় লিখে রাখুন: সাধারণত ISO, MDY, কিন্তু Server এর Setting এ আলাদা হতে পারে।",
      },
      {
        title: "WHERE আর Index",
        description:
          "ষষ্ঠ ফাইল পুরোটা একবারে চালান। Index বানানো আর ROLLBACK একসাথে আছে, তাই আপনার Database এ কিছুই থেকে যাবে না।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-see-types.sql",
        code: `SELECT pg_typeof(title), pg_typeof(price_bdt), pg_typeof(max_seats)
FROM tours WHERE tour_id = 1;              -- text | numeric | smallint
SELECT pg_typeof(42), pg_typeof(3000000000), pg_typeof(1.5);
                                           -- integer | bigint | numeric
SELECT '10' < '9' AS as_text, 10 < 9 AS as_numbers;   -- t | f`,
      },
      {
        language: "sql",
        filename: "02-cast-forms.sql",
        code: `SELECT CAST('12500' AS integer), '12500'::integer;     -- 12500 | 12500
SELECT '3' + 1;                                        -- 4
SELECT title FROM tours WHERE tour_id = '3';           -- 1 row: Sundarbans Mangrove Cruise
SELECT '3.5' + 1;
-- ERROR:  invalid input syntax for type integer: "3.5"
SELECT '3.5'::numeric + 1;                             -- 4.5`,
      },
      {
        language: "sql",
        filename: "03-text-to-number.sql",
        code: `SELECT ' 42 '::integer;                         -- 42
SELECT '12,500'::integer;
-- ERROR:  invalid input syntax for type integer: "12,500"
SELECT replace('12,500', ',', '')::integer;     -- 12500
SELECT to_number('12,500.00', '99G999D99');     -- 12500.00
SELECT full_name FROM customers WHERE phone = 8801000000101;
-- ERROR:  operator does not exist: text = bigint
SELECT full_name FROM customers WHERE phone = '+8801000000101';  -- 1 row: Rahim Uddin`,
      },
      {
        language: "sql",
        filename: "04-rounding.sql",
        code: `SELECT 2.4::integer, 2.5::integer, 2.6::integer;    -- 2 | 3 | 3
SELECT 2.5::float8::integer, 3.5::float8::integer;  -- 2 | 4
SELECT title,
       (price_bdt / max_seats)::integer AS per_seat_cast,
       trunc(price_bdt / max_seats) AS per_seat_trunc
FROM tours ORDER BY tour_id;                        -- 9 rows
-- আলাদা হয় তিনটায়: Sajek 528/527, Bandarban 1167/1166, Family Package 646/645`,
      },
      {
        language: "sql",
        filename: "05-dates.sql",
        code: `SET TimeZone = 'Asia/Dhaka';
SHOW DateStyle;                                     -- সাধারণত ISO, MDY
SELECT '01/11/2026'::date;                          -- 2026-01-11 (MDY হলে)
SELECT to_date('01/11/2026', 'DD/MM/YYYY');         -- 2026-11-01
SELECT departure_id, starts_on FROM departures
WHERE starts_on >= to_date('12/11/2026', 'DD/MM/YYYY')
ORDER BY starts_on;                                 -- 9 rows
SELECT booking_id, seats FROM bookings
WHERE booked_at::date BETWEEN '2026-10-01' AND '2026-10-10';   -- 5 rows`,
      },
      {
        language: "sql",
        filename: "06-where-and-index.sql",
        code: `SELECT title FROM tours WHERE price_bdt = 12500;            -- 1 row
SELECT title FROM tours WHERE price_bdt::text = '12500';    -- 0 rows

BEGIN;
CREATE INDEX bookings_booked_at_idx ON bookings (booked_at);
SET LOCAL enable_seqscan = off;
EXPLAIN SELECT booking_id FROM bookings
WHERE booked_at::date = '2026-10-14';
-- PostgreSQL 18: Seq Scan on bookings ... Disabled: true
EXPLAIN SELECT booking_id FROM bookings
WHERE booked_at >= '2026-10-14' AND booked_at < '2026-10-15';
-- Index Scan using bookings_booked_at_idx on bookings
ROLLBACK;`,
      },
    ],
    tip: (
      <ContentParagraph>
        কোনো লাইনের উত্তর না মিললে আগে দেখুন সঠিক Database এ আছেন কিনা (প্রম্পটে island_tours=#), আর তারিখের
        লাইনগুলোর আগে SET TimeZone চালিয়েছেন কিনা। PostgreSQL 17 এ EXPLAIN এর লেখা একটু আলাদা দেখাতে পারে,
        কিন্তু Seq Scan আর Index Scan এর পার্থক্যটা একই থাকবে।
      </ContentParagraph>
    ),
  },
};
