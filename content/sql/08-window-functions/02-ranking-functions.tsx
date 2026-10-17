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
  TieNumberingLab,
  TopNLab,
} from "../../../components/course/topics/windows/rank-animations";
import {
  PercentLineDiagram,
  ThreeNumbersDiagram,
  TwoOrdersSplit,
  WrapThenFilterDiagram,
} from "../../../components/course/topics/windows/rank-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

const SPEND_CTE = `WITH spend AS (
  SELECT c.customer_id, c.full_name, sum(b.total_bdt) AS spent
  FROM bookings b
  JOIN customers c USING (customer_id)
  WHERE b.status = 'confirmed'
  GROUP BY c.customer_id, c.full_name
)`;

export const rankingFunctionsContent: TopicData = {
  id: "ranking-functions",
  introduction: {
    badge: "MODULE 08 · LESSON 02",
    title: <SectionTitle>সমান হলে কে কত নম্বর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          একটা তালিকাকে বড় থেকে ছোট সাজানো সহজ, Module 03 এ আপনি সেটা শিখেছেন। কিন্তু সাজানো তালিকা আর নম্বর দেওয়া
          তালিকা এক জিনিস না। “আমাদের তৃতীয় সবচেয়ে বড় Customer কে?”, “প্রথম পাঁচজনকে Voucher দিন”, “সবচেয়ে ভালো
          Review টা উপরে দেখান”: এই প্রশ্নগুলোর উত্তরে প্রতিটা Row এর পাশে একটা অবস্থান লাগে, 1, 2, 3। আর ঠিক তখনই একটা
          পুরনো সমস্যা ফিরে আসে: দুজনের মান সমান হলে কে আগে?
        </ContentParagraph>
        <ContentParagraph>
          SQL এই প্রশ্নের তিনটা আলাদা উত্তর দেয়, তিনটা Function দিয়ে: ROW_NUMBER, RANK আর DENSE_RANK। তিনটাই আগের
          লেসনের Window Function, তাই কোনো Row হারায় না, প্রতিটা Row এর পাশে শুধু একটা নম্বর বসে। পার্থক্য শুধু সমান
          মানের বেলায়, আর সেই পার্থক্যই ঠিক করে দেয় Voucher পাবেন পাঁচজন, ছয়জন না সাতজন।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি জানবেন তিনটা Function সমান মানে কী করে আর কেন, OVER এর ভেতরের ORDER BY আর Query এর শেষের ORDER BY
          কেন দুটো আলাদা কাজ করে, ROW_NUMBER এর নম্বর কখন বদলে যেতে পারে আর Tie Breaker দিয়ে কীভাবে সেটা আটকাবেন, NULL
          কোথায় বসে, Rank দিয়ে কেন WHERE এ ছাঁকা যায় না আর CTE দিয়ে কীভাবে যায়, PERCENT_RANK আর CUME_DIST কী বলে, আর
          ROW_NUMBER দিয়ে পাতা বানানো কখন চলে। সব Island Tours এর আসল Data তে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দুজন সমান দৌড়ালে আমি দুজনকেই প্রথম বলি, আর পরের জনকে বলি তৃতীয়, কারণ তাঁর আগে দুজন আছেন। আমার ছোট ভাই DENSE_RANK তাঁকে বলে দ্বিতীয়। আর ROW_NUMBER? সে কাউকে সমান মানতেই রাজি না, কিন্তু কাকে আগে রাখবে সেটা তাকে বলে না দিলে সে নিজেও জানে না।",
      author: "RANK",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>পাঁচজনকে Voucher, কিন্তু পঞ্চম কে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরে নিন আজ 1 November 2026, রবিবার। শীতের মৌসুম শুরু, আর Island Tours এর মালিক রুমানা আপা ঠিক করেছেন যে
                Customer রা confirmed Booking এ সবচেয়ে বেশি টাকা খরচ করেছেন, তাঁদের প্রথম পাঁচজনকে দশ শতাংশ ছাড়ের একটা
                Voucher দেওয়া হবে। Operations Manager ফারুক সাহেব কাজটা দিলেন নতুন Developer তানিমকে।
              </ContentParagraph>
              <ContentParagraph>
                তানিম একটা Query লিখে খরচ অনুযায়ী Customer দের সাজালেন, তারপর তালিকার উপরের পাঁচটা নাম কপি করে পাঠিয়ে
                দিলেন। পরের দিন Lamia Haque ফোন করলেন। তিনি খরচ করেছেন 36000 টাকা, Mitu Rahman ও ঠিক 36000। Mitu Voucher
                পেলেন, তিনি পেলেন না কেন? তানিম তালিকা খুলে দেখলেন, চতুর্থ, পঞ্চম আর ষষ্ঠ জনের খরচ হুবহু এক। Lamia বাদ
                পড়েছেন শুধু এই কারণে যে Query এর ফলাফলে তাঁর নাম তিনজনের মধ্যে শেষে এসেছিল, আর সেই ক্রম কেউ ঠিক করে দেয়নি।
              </ContentParagraph>
              <ContentParagraph>
                সমস্যাটা তানিমের হিসাবে না, প্রশ্নে। “প্রথম পাঁচজন” কথাটার মানে সমান মান থাকলে পরিষ্কার না। তিনজন যদি একসাথে
                চতুর্থ হন, তাহলে কি পাঁচজন পাবেন, ছয়জন, নাকি সাতজন? এর উত্তর ব্যবসার সিদ্ধান্ত, কিন্তু সেই সিদ্ধান্তকে
                Query তে লেখার উপায় SQL দেয়। এই লেসন সেই উপায় নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তানিমের সাজানো তালিকা"
              query={`SELECT c.full_name, sum(b.total_bdt) AS spent
FROM bookings b
JOIN customers c USING (customer_id)
WHERE b.status = 'confirmed'
GROUP BY c.customer_id, c.full_name
ORDER BY spent DESC;`}
              caption="বারোজন Customer। প্রথম তিনজন Nusrat Jahan (75000.00), Sumaiya Islam (70500.00) আর Rahim Uddin (44000.00)। তারপর তিনজনের খরচ হুবহু 36000.00: Farhana Akter, Mitu Rahman আর Lamia Haque। এই তিনজনের মধ্যে কে আগে আসবেন, ORDER BY spent DESC সেটা বলে না, তাই তাঁদের ক্রম Query বদলালে বদলাতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনে Ranking Function",
          content: (
            <ContentParagraph>
              সাজানোর একটা নিয়ম অনুযায়ী প্রতিটা Row কে একটা অবস্থান দেওয়া, Row না হারিয়ে। ROW_NUMBER, RANK আর DENSE_RANK
              তিনজনই এই কাজ করে, তফাত শুধু সমান মানের Row দের বেলায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "numbering-rows",
      subHeader: { index: "002", title: "Numbering Rows" },
      title: <SectionTitle>ROW_NUMBER: প্রতিটা Row এর পাশে একটা ক্রমিক নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ব্যাংকের লাইনে টোকেন মেশিনের কথা ভাবুন। যে আগে আসেন তিনি 1, তারপর 2, তারপর 3। কোনো নম্বর দুইবার দেওয়া
                হয় না, কোনো নম্বর বাদও যায় না। মেশিনকে শুধু জানতে হয় কে আগে এসেছেন। ROW_NUMBER ঠিক এই টোকেন মেশিন।
              </ContentParagraph>
              <ContentParagraph>
                লেখার ধরনটা আগের লেসনের মতোই:{" "}
                <code className={CODE}>row_number() OVER (ORDER BY price_bdt DESC)</code>। প্রথমে Function এর নাম আর খালি
                বন্ধনী, কারণ ROW_NUMBER কোনো Column নেয় না। তারপর OVER, যেটা বলে এটা একটা Window Function। আর OVER এর
                বন্ধনীর ভেতরে ORDER BY, যেটা টোকেন মেশিনকে বলে দেয় কে আগে। এখানে সবচেয়ে দামি ট্যুর আগে।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর নয়টা ট্যুরের দাম সব আলাদা, কোনো দুটো সমান না। তাই এখানে কোনো ঝামেলা নেই: প্রতিটা ট্যুর
                একটা পরিষ্কার নম্বর পায়, আর যতবার চালান ততবার একই নম্বর। Row কমে না, নয়টা ট্যুরই থাকে, শুধু পাশে একটা নতুন
                Column যোগ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দাম অনুযায়ী ট্যুরের ক্রমিক নম্বর"
              query={`SELECT title, price_bdt,
       row_number() OVER (ORDER BY price_bdt DESC) AS position
FROM tours
ORDER BY position;`}
              caption="নয়টা Row, নয়টা আলাদা নম্বর। 1 নম্বরে Saint Martin Luxury Stay (32000.00), 2 নম্বরে Sundarbans Mangrove Cruise (18000.00), আর 9 নম্বরে Ratargul Swamp Boat Day (3500.00)। দামগুলো সব আলাদা, তাই এখানে নম্বর নিয়ে কোনো সন্দেহ নেই। PostgreSQL এ ROW_NUMBER এর ফলাফল bigint।"
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
                  সবচেয়ে সস্তা ট্যুর 1 নম্বর পাবে, এভাবে নয়টা ট্যুরের ক্রমিক নম্বর দিন। Column গুলো{" "}
                  <code className={CODE}>title</code>, <code className={CODE}>price_bdt</code> আর{" "}
                  <code className={CODE}>position</code>, নম্বরের ক্রমে সাজানো।
                </>
              }
              hint={
                <>
                  উপরের Query টাই, শুধু OVER এর ভেতরে DESC বাদ দিন:{" "}
                  <code className={CODE}>row_number() OVER (ORDER BY price_bdt)</code>।
                </>
              }
              solution={`SELECT title, price_bdt,
       row_number() OVER (ORDER BY price_bdt) AS position
FROM tours
ORDER BY position;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "order-inside-over",
      subHeader: { index: "003", title: "Order Inside OVER" },
      title: <SectionTitle>দুটো ORDER BY, দুটো আলাদা কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের Query তে দুটো ORDER BY ছিল, আর দুটো দেখতে একই রকম বলে শুরুতে অনেকে গুলিয়ে ফেলেন। একটা পরীক্ষার
                খাতার কথা ভাবুন। শিক্ষক নম্বর দেখে Merit List বানান: কে প্রথম, কে দ্বিতীয়। এটা OVER এর ভেতরের ORDER BY এর
                কাজ। তারপর অফিস সেই তালিকা নোটিশ বোর্ডে টাঙায় রোল নম্বরের ক্রমে, যাতে প্রত্যেকে নিজের নাম সহজে খুঁজে পান।
                এটা Query এর শেষের ORDER BY এর কাজ। নোটিশ বোর্ডে রোলের ক্রমে টাঙালেও কারো অবস্থান বদলায় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Query তে ট্যুরগুলোর নম্বর ঠিক হয়েছে দাম দিয়ে, কিন্তু দেখানো হয়েছে নামের ক্রমে। তাই নম্বরগুলো উপর
                থেকে নিচে 1, 2, 3 ক্রমে আসে না, এলোমেলো দেখায়। তবু প্রতিটা নম্বর ঠিক আছে: Family Package তিন নম্বরে সবচেয়ে
                দামি, এটা নামের ক্রমে দেখালেও সত্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নম্বর দামে, দেখানো নামে"
              query={`SELECT title, price_bdt,
       rank() OVER (ORDER BY price_bdt DESC) AS price_rank
FROM tours
ORDER BY title;`}
              caption="নামের ক্রমে প্রথম Row Bandarban Hill Trek, তার price_rank 4। তারপর Cox's Bazar Beach Weekend 7, Cox's Bazar Family Package 3, Ratargul 9। নম্বরগুলো দামের হিসাবে ঠিক, শুধু দেখানোর ক্রম নামের। শেষের ORDER BY বদলে price_rank লিখলে একই নম্বর 1 থেকে 9 সাজানো দেখাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoOrdersSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টো প্রশ্ন: OVER এর ভেতরে ORDER BY একদম না দিলে কী হয়? তখন Database এর কাছে কে আগে সেটার কোনো নিয়ম
                নেই। PostgreSQL এর Docs এ লেখা আছে, ORDER BY ছাড়া Row গুলো একটা অনির্দিষ্ট ক্রমে প্রক্রিয়া হয়। RANK এর কাছে
                তখন সব Row সমান, তাই সবাই 1। আর ROW_NUMBER Row গুলো যে ক্রমে হাতে পায় সেই ক্রমে 1, 2, 3 দিয়ে যায়, যে ক্রম কেউ
                ঠিক করে দেয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="OVER এর ভেতরে ORDER BY না দিলে"
              query={`SELECT review_id, rating,
       rank()       OVER () AS rank_no_order,
       row_number() OVER () AS number_no_order
FROM reviews
ORDER BY review_id;`}
              caption="দশটা Review এর প্রত্যেকের rank_no_order 1, কারণ সাজানোর কোনো নিয়ম না থাকায় সব Row একে অপরের সমান। number_no_order এখানে 1 থেকে 10 এসেছে review_id এর ক্রমে, কিন্তু সেটা কাকতালীয়: Table এ Row গুলো যে ক্রমে রাখা আছে, সেই ক্রম। Data বদলালে বা Query এর গঠন বদলালে এই নম্বর অন্যভাবে বসতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ORDER BY ছাড়া Ranking এর কোনো মানে নেই",
          content: (
            <ContentParagraph>
              RANK আর DENSE_RANK ORDER BY ছাড়া সবাইকে 1 দেয়, আর ROW_NUMBER দেয় এমন নম্বর যার পেছনে কোনো নিয়ম নেই। তাই
              Ranking Function লিখলে OVER এর ভেতরে ORDER BY প্রায় সবসময় লাগবে। আর শেষে কোন ক্রমে দেখাবেন, সেটা আলাদা করে
              Query এর ORDER BY তে লিখুন। একটা আরেকটার কাজ করে দেয় না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "ties",
      subHeader: { index: "004", title: "When Values Tie" },
      title: <SectionTitle>সমান মান, আর ROW_NUMBER এর অস্বস্তি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখন আসল প্রশ্নে আসা যাক। দশটা Review এর মধ্যে চারটা পাঁচ তারা, চারটা চার তারা, একটা তিন আর একটা দুই। এভাবে
                সমান মানের Row দের ইংরেজিতে বলে Tie, আর Window Function এর ভাষায় তারা একে অপরের Peer: ORDER BY এর চোখে
                তাদের মধ্যে কোনো তফাত নেই।
              </ContentParagraph>
              <ContentParagraph>
                ROW_NUMBER এর নিয়ম হলো প্রতিটা Row কে আলাদা নম্বর দেওয়া। কিন্তু চারটা পাঁচ তারা Review এর মধ্যে কে 1, কে 2,
                সেটা ORDER BY rating DESC বলে না। তাহলে সে কী করে? সে যে ক্রমে Row গুলো হাতে পায়, সেই ক্রমে নম্বর বসায়। আর
                সেই ক্রম Query এর গঠন, Table এ Data রাখার ধরন বা Database এর ভেতরের সাজানোর পদ্ধতির উপর নির্ভর করে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে দুটো Query একই প্রশ্ন করে: rating অনুযায়ী Review দের ক্রমিক নম্বর, উপরের চারটা। পার্থক্য শুধু
                একটা: ভেতরের Subquery তে Row গুলো একবার review_id এর ছোট থেকে বড় ক্রমে আসে, আরেকবার উল্টো ক্রমে। প্রশ্ন
                একই, Data একই, অথচ নম্বর আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, শুধু Row আসার ক্রম আলাদা"
              query={`SELECT review_id, rating, row_number() OVER (ORDER BY rating DESC) AS rn
FROM (SELECT * FROM reviews ORDER BY review_id OFFSET 0) r
ORDER BY rn
LIMIT 4;

SELECT review_id, rating, row_number() OVER (ORDER BY rating DESC) AS rn
FROM (SELECT * FROM reviews ORDER BY review_id DESC OFFSET 0) r
ORDER BY rn
LIMIT 4;`}
              caption="প্রথম Query তে 1 নম্বর পায় Review 5, তারপর 1, 3, 8। দ্বিতীয়টায় 1 নম্বর পায় Review 1, তারপর 8, 5, 3। চারটাই পাঁচ তারা, তাই দুটো উত্তরই নিয়ম মেনে চলেছে, কিন্তু “সেরা Review কোনটা” প্রশ্নের উত্তর দুইবার দুই রকম। OFFSET 0 শুধু PostgreSQL কে Subquery টা আলাদা রাখতে বলে, যাতে ভেতরের ক্রমটা সত্যিই বাইরে পৌঁছায়। PostgreSQL 18 এর psql এও ঠিক এই দুটো ফলাফল এসেছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "ROW_NUMBER কথা দেয় শুধু দুটো জিনিসের",
          content: (
            <ContentParagraph>
              নম্বরগুলো আলাদা হবে, আর 1 থেকে শুরু করে কোনো ফাঁক ছাড়া বাড়বে। কিন্তু সমান মানের Row দের মধ্যে কে কোন নম্বর
              পাবে, সেই কথা সে দেয় না। আজকের Test এ যে Review এক নম্বরে, কালকের Production এ সেটা দুই নম্বরে চলে যেতে পারে,
              কোনো Error ছাড়াই। তানিমের Voucher এর গোলমাল ঠিক এই জায়গা থেকে এসেছিল।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "rank",
      subHeader: { index: "005", title: "RANK" },
      title: <SectionTitle>RANK: সমান হলে একই নম্বর, তারপর লাফ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খেলার মাঠে দুজন দৌড়বিদ যদি হুবহু একসাথে ফিতা ছোঁন, দুজনই সোনা পান। তখন রুপা কেউ পান না, পরের জন পান ব্রোঞ্জ,
                কারণ তাঁর আগে দুজন আছেন। এটাই RANK এর নিয়ম। সমান মানের সবাই একই নম্বর পান, আর পরের জনের নম্বর হয় তাঁর আগে
                মোট কতজন আছেন তার চেয়ে এক বেশি। ফলে নম্বরে ফাঁক তৈরি হয়।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Docs RANK কে বলে “ফাঁক সহ অবস্থান”, আর হিসাবটা এভাবে দেয়: সমান মানের দলটার প্রথম Row যে
                ROW_NUMBER পেত, দলের সবাই সেই নম্বর পান। Review এর বেলায় চারটা পাঁচ তারা পায় 1, তারপর চারটা চার তারা পায় 5,
                কারণ তাদের আগে চারজন। তিন তারা পায় 9, দুই তারা 10।
              </ContentParagraph>
              <ContentParagraph>
                RANK এর একটা বড় গুণ হলো সে স্থির। সমান মানের Row দের মধ্যে কে আগে বসল সেটা যাই হোক, তাদের সবার নম্বর একই।
                তাই Row আসার ক্রম বদলালেও RANK বদলায় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RANK: চারটা 1, চারটা 5"
              query={`SELECT review_id, rating,
       rank() OVER (ORDER BY rating DESC) AS rnk
FROM reviews
ORDER BY rnk, review_id;`}
              caption="Review 1, 3, 5, 8 সবাই rnk 1। তারপর Review 2, 4, 7, 10 সবাই rnk 5, কারণ তাদের আগে চারটা Review। Review 6 (তিন তারা) পায় 9, Review 9 (দুই তারা) পায় 10। 2, 3, 4, 6, 7, 8 নম্বরগুলো কেউ পায়নি, এই ফাঁকগুলোই RANK এর পরিচয়। শেষ Row এর RANK সবসময় মোট Row সংখ্যার সমান বা কম।"
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
                  দশটা Review এর <code className={CODE}>review_id</code>, <code className={CODE}>rating</code> আর rating
                  অনুযায়ী RANK, নাম <code className={CODE}>rnk</code>, সবচেয়ে বেশি তারা 1 নম্বর। সাজাবেন rating বেশি থেকে
                  কম, rating সমান হলে review_id ছোটটা আগে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>rank() OVER (ORDER BY rating DESC) AS rnk</code>, আর শেষে{" "}
                  <code className={CODE}>ORDER BY rating DESC, review_id</code>।
                </>
              }
              solution={`SELECT review_id, rating,
       rank() OVER (ORDER BY rating DESC) AS rnk
FROM reviews
ORDER BY rating DESC, review_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "dense-rank",
      subHeader: { index: "006", title: "DENSE_RANK" },
      title: <SectionTitle>DENSE_RANK: সমান হলে একই নম্বর, কোনো ফাঁক নেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                স্কুলের ফলাফলে কখনো কখনো দুজন একসাথে প্রথম হয়, আর পরের জনকে বলা হয় দ্বিতীয়। তিনি কতজনের পরে আছেন সেটা না,
                তিনি কততম আলাদা নম্বরের মালিক, সেটা গোনা হয়। DENSE_RANK ঠিক এভাবে গোনে। Docs এর ভাষায়, সে আসলে সমান মানের
                দলগুলো গোনে। প্রথম দল 1, দ্বিতীয় দল 2, যত বড় দলই হোক।
              </ContentParagraph>
              <ContentParagraph>
                তাই Review এর বেলায় চারটা পাঁচ তারা 1, চারটা চার তারা 2, তিন তারা 3, দুই তারা 4। নম্বরে কোনো ফাঁক নেই, আর
                শেষ Row এর DENSE_RANK বলে দেয় মোট কয়টা আলাদা মান আছে: এখানে চারটা আলাদা rating।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RANK আর DENSE_RANK পাশাপাশি"
              query={`SELECT review_id, rating,
       rank()       OVER (ORDER BY rating DESC) AS rnk,
       dense_rank() OVER (ORDER BY rating DESC) AS dense
FROM reviews
ORDER BY rnk, review_id;`}
              caption="প্রথম চারটা Row এ দুটোই 1। তারপর চার তারার Review গুলোতে rnk 5 কিন্তু dense 2। তিন তারায় 9 আর 3, দুই তারায় 10 আর 4। দুটো Function একই দল চেনে, শুধু দলের পরে নম্বর কোথা থেকে শুরু হবে সেখানে আলাদা: RANK মোট Row গোনে, DENSE_RANK দল গোনে।"
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
                  ষোলোটা Departure কে খালি সিট অনুযায়ী DENSE_RANK দিন, সবচেয়ে বেশি খালি সিট 1 নম্বর। Column গুলো{" "}
                  <code className={CODE}>departure_id</code>, <code className={CODE}>seats_left</code> আর{" "}
                  <code className={CODE}>place</code>, সাজানো place অনুযায়ী, place সমান হলে departure_id ছোটটা আগে।
                </>
              }
              hint={
                <>
                  <code className={CODE}>dense_rank() OVER (ORDER BY seats_left DESC) AS place</code>, শেষে{" "}
                  <code className={CODE}>ORDER BY place, departure_id</code>। চারটা জায়গায় দুটো করে Departure একই
                  place পায়।
                </>
              }
              solution={`SELECT departure_id, seats_left,
       dense_rank() OVER (ORDER BY seats_left DESC) AS place
FROM departures
ORDER BY place, departure_id;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "side-by-side",
      subHeader: { index: "007", title: "Three Side by Side" },
      title: <SectionTitle>Voucher এর তালিকায় তিনটা ফাংশন একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার তানিমের আসল তালিকায় ফিরে যাওয়া যাক, আর তিনটা Function একসাথে বসানো যাক। খরচ বের করার অংশটা একটা CTE তে
              রাখা হয়েছে, যেটা আপনি Module 07 এ শিখেছেন, যাতে নম্বর দেওয়ার অংশটা আলাদা করে পড়া যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বারোজন Customer, তিন রকম নম্বর"
              query={`${SPEND_CTE}
SELECT full_name, spent,
       row_number() OVER (ORDER BY spent DESC) AS row_no,
       rank()       OVER (ORDER BY spent DESC) AS rnk,
       dense_rank() OVER (ORDER BY spent DESC) AS dense
FROM spend
ORDER BY spent DESC, full_name;`}
              caption="প্রথম তিনজনে তিনটা Function একমত: 1, 2, 3। তারপর 36000.00 এর তিনজন: rnk আর dense তিনজনেরই 4, কিন্তু row_no তাঁরা পান 4, 5, 6, কোনো এক ক্রমে। আমাদের চালানোয় Farhana 4, Mitu 5, Lamia 6 এসেছে, তবে এই ক্রমের কোনো নিশ্চয়তা নেই, আপনার পর্দায় অন্যরকম আসতেই পারে। Oliver Bennett এ এসে তিনটা Function আলাদা হয়ে যায়: row_no 7, rnk 7, dense 5। শেষ Row Priya Sharma: 12, 12, 10।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ThreeNumbersDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TieNumberingLab />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Function", "সমান মানে", "নম্বরে ফাঁক", "শেষ Row এর নম্বর", "কখন বেছে নেবেন"],
          rows: [
            [
              "ROW_NUMBER",
              "আলাদা নম্বর, কে আগে সেটা অনির্দিষ্ট",
              "না",
              "মোট Row সংখ্যা",
              "প্রতিটা Row এর একটা অনন্য নম্বর দরকার, সাথে Tie Breaker",
            ],
            [
              "RANK",
              "সবাই একই নম্বর",
              "হ্যাঁ, দলের পরে লাফ",
              "মোট Row সংখ্যা বা কম",
              "খেলার মতো অবস্থান: আপনার আগে কতজন",
            ],
            [
              "DENSE_RANK",
              "সবাই একই নম্বর",
              "না",
              "আলাদা মানের সংখ্যা",
              "কততম আলাদা মান: দ্বিতীয় সর্বোচ্চ দাম, তৃতীয় সেরা rating",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "tie-breakers",
      subHeader: { index: "008", title: "Tie Breakers" },
      title: <SectionTitle>ROW_NUMBER কে স্থির করার উপায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক সময় সমান নম্বর চলে না। একটা Invoice এর লাইন নম্বর, একটা পাতার Row, “প্রত্যেক Customer এর ঠিক একটা Booking”:
                এসব জায়গায় প্রতিটা Row এর আলাদা নম্বর লাগে, আর সেই নম্বর প্রতিবার একই হওয়া চাই। সমাধান সহজ। OVER এর ভেতরের
                ORDER BY তে আরেকটা Column যোগ করুন, যেটা কখনো সমান হয় না। একে বলে Tie Breaker।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে নিরাপদ Tie Breaker হলো Primary Key, কারণ সেটা প্রতিটা Row এর জন্য আলাদা। খরচ সমান হলে customer_id
                ছোটটা আগে, এভাবে লিখলে আর কোনো দুই Row এর মধ্যে সিদ্ধান্ত বাকি থাকে না। তখন ROW_NUMBER এর প্রতিটা নম্বর
                Data থেকেই বের হয়, Row আসার ক্রম থেকে না।
              </ContentParagraph>
              <ContentParagraph>
                তবে খেয়াল করুন, Tie Breaker একটা ব্যবসার সিদ্ধান্তও। customer_id ছোট মানে আগে Account খুলেছেন, তাই এই
                নিয়মে পুরনো Customer আগে। আপনি চাইলে নাম, প্রথম Booking এর সময়, বা অন্য কোনো যুক্তি বেছে নিতে পারেন। শুধু
                শেষ Column টা যেন অনন্য হয়, নইলে সমান মান আবার ফিরে আসতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="customer_id দিয়ে Tie ভাঙা"
              query={`${SPEND_CTE}
SELECT full_name, spent, customer_id,
       row_number() OVER (ORDER BY spent DESC, customer_id) AS row_no
FROM spend
ORDER BY row_no;`}
              caption="এখন 36000.00 এর তিনজনের ক্রম Data থেকেই ঠিক: Farhana Akter (customer_id 4) 4 নম্বর, Mitu Rahman (6) 5 নম্বর, Lamia Haque (14) 6 নম্বর। যতবার চালান, যে Database এ চালান, এই নম্বর বদলাবে না। বাকি নয়জনের নম্বর আগের মতোই, কারণ তাঁদের খরচ এমনিতেই আলাদা।"
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
                  confirmed Booking গুলোকে total_bdt বড় থেকে ছোট ক্রমিক নম্বর দিন, total সমান হলে booking_id ছোটটা আগে।
                  Column গুলো <code className={CODE}>booking_id</code>, <code className={CODE}>total_bdt</code> আর{" "}
                  <code className={CODE}>position</code>, নম্বরের ক্রমে। এখানে কয়েকটা total একদম সমান, তাই Tie Breaker
                  ছাড়া উত্তর স্থির হবে না।
                </>
              }
              hint={
                <>
                  WHERE status = &apos;confirmed&apos;, আর{" "}
                  <code className={CODE}>row_number() OVER (ORDER BY total_bdt DESC, booking_id)</code>। সতেরোটা Row আসবে।
                </>
              }
              solution={`SELECT booking_id, total_bdt,
       row_number() OVER (ORDER BY total_bdt DESC, booking_id) AS position
FROM bookings
WHERE status = 'confirmed'
ORDER BY position;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "direction-nulls",
      subHeader: { index: "009", title: "Direction and NULLs" },
      title: <SectionTitle>DESC, ASC, আর NULL কোথায় বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কে 1 নম্বর পাবে, সেটা ঠিক করে ORDER BY এর দিক। DESC মানে বড় মান আগে, তাই সবচেয়ে বড়টা 1। ASC, বা কিছু না
                লিখলে, ছোট মান আগে। “সবচেয়ে ভালো” প্রশ্নে প্রায় সবসময় DESC লাগে, “সবচেয়ে সস্তা” বা “সবচেয়ে আগের” প্রশ্নে ASC।
              </ContentParagraph>
              <ContentParagraph>
                ঝামেলা বাধে যখন সাজানোর Column এ NULL থাকে। Module 03 এ আপনি দেখেছেন PostgreSQL NULL কে সবচেয়ে বড় মান হিসেবে
                ধরে: ASC তে NULL শেষে, DESC তে NULL আগে। Ranking এ এর ফল মজার। ধরুন Marketing জানতে চায়, কোন Review এ সবচেয়ে
                লম্বা মন্তব্য? length(comment) দিয়ে DESC সাজালে যে দুটো Review এ কোনো মন্তব্যই নেই, তারা NULL, আর NULL DESC এ
                আগে বসে। ফলে মন্তব্যহীন দুটো Review হয়ে যায় “সবচেয়ে লম্বা মন্তব্য”, দুজনেই 1 নম্বর।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান হলো NULLS LAST, যেটা OVER এর ভেতরের ORDER BY তেও লেখা যায়। নিচের বক্সে দুটো Query পাশাপাশি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবচেয়ে লম্বা মন্তব্য, NULL এর ফাঁদ সহ"
              query={`SELECT review_id, length(comment) AS len,
       rank() OVER (ORDER BY length(comment) DESC) AS rnk
FROM reviews
ORDER BY rnk, review_id;

SELECT review_id, length(comment) AS len,
       rank() OVER (ORDER BY length(comment) DESC NULLS LAST) AS rnk
FROM reviews
ORDER BY rnk, review_id;`}
              caption="প্রথম Query তে Review 4 আর 8, যাদের len NULL, দুজনেই rnk 1, আর আসল সবচেয়ে লম্বা মন্তব্যের Review 10 (45 অক্ষর) পায় 3। দ্বিতীয় Query তে NULLS LAST দেওয়ায় Review 10 পায় 1, Review 1 (44) পায় 2, আর মন্তব্যহীন দুটো একসাথে 9, একদম শেষে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ উল্টো, আর NULLS LAST নেই",
          content: (
            <ContentParagraph>
              MySQL NULL কে সবচেয়ে ছোট মান ধরে, তাই সেখানে একই Query তে DESC এ NULL শেষে বসে, আর Review 10 নিজে থেকেই 1
              পায়। আমরা MySQL 8.4 এ চালিয়ে দেখেছি: দুটো মন্তব্যহীন Review সেখানে 9। কিন্তু MySQL NULLS LAST চেনে না, লিখলে
              ERROR 1064। সেখানে NULL এর জায়গা নিজে ঠিক করতে লিখুন{" "}
              <code className={CODE}>ORDER BY comment IS NULL, LENGTH(comment) DESC</code>। দুই Database এর মধ্যে Query
              সরালে NULL এর জায়গা চুপচাপ বদলে যায়, তাই যে Column এ NULL থাকতে পারে, সেখানে দিকটা সবসময় নিজে লিখে দিন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "filtering",
      subHeader: { index: "010", title: "Filtering on a Rank" },
      title: <SectionTitle>প্রথম পাঁচজন: আগে নম্বর, তারপর বাছাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নম্বর তো হলো, এবার Voucher এর তালিকা বানানো যাক: যাঁদের নম্বর 5 বা তার কম। স্বাভাবিকভাবে মনে হয় WHERE এ
                লিখে দিলেই হয়। আগের লেসনে আপনি দেখেছেন সেটা চলে না, কিন্তু Ranking এ এই ভুলটাই সবচেয়ে বেশি হয়, তাই
                আরেকবার, এবার নম্বর দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="WHERE এ সরাসরি rank()"
              query={`SELECT review_id, rating
FROM reviews
WHERE rank() OVER (ORDER BY rating DESC) <= 3;`}
              caption={
                'ERROR: window functions are not allowed in WHERE। Alias দিয়েও কাজ হয় না: SELECT এ AS rnk লিখে WHERE rnk <= 3 দিলে Error আসে column "rnk" does not exist, ঠিক যেমন Module 03 এ যেকোনো Alias এর বেলায় দেখেছিলেন।'
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কারণটা Query চলার ক্রমে, যেটা আপনি{" "}
                <Link href="/sql/topic/query-order" className={LINK}>
                  Module 03 এর Logical Order লেসনে
                </Link>{" "}
                দেখেছেন আর আগের লেসনে আবার দেখেছেন। WHERE চলে অনেক আগে, Row গুলো আসার পরপরই। Window Function চলে তার পরে,
                GROUP BY আর HAVING এরও পরে। WHERE যখন চলে, তখন নম্বরগুলো তৈরিই হয়নি, তাই সে সেগুলো দেখতে পায় না।
              </ContentParagraph>
              <ContentParagraph>
                সমাধান দুই ধাপে। প্রথম ধাপে একটা CTE এর ভেতরে নম্বর বসান। দ্বিতীয় ধাপে CTE এর বাইরে, একটা নতুন Query তে,
                সেই নম্বর দিয়ে বাছাই করুন। বাইরের Query এর কাছে নম্বরটা আর Window Function না, শুধু একটা সাধারণ Column।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WrapThenFilterDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="RANK দিয়ে প্রথম পাঁচজন"
              query={`${SPEND_CTE},
ranked AS (
  SELECT full_name, spent, rank() OVER (ORDER BY spent DESC) AS rnk
  FROM spend
)
SELECT full_name, spent, rnk
FROM ranked
WHERE rnk <= 5
ORDER BY rnk, full_name;`}
              caption="ছয়টা Row। প্রথম তিনজন 1, 2, 3, তারপর 36000.00 এর তিনজনই rnk 4, তাই তিনজনেই আসেন। RANK এর নিয়মে 5 নম্বর কেউ পাননি, কারণ চতুর্থ দলের পরে পরের নম্বর 7। “প্রথম পাঁচ অবস্থান” মানে এখানে ছয়জন মানুষ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই বাছাই তিনটা Function দিয়ে, আর শুধু গুনে দেখা যাক প্রতিটা নিয়মে কতজন Voucher পান। এখানে ROW_NUMBER
              কে customer_id দিয়ে স্থির করা হয়েছে, যাতে সংখ্যাটা প্রতিবার একই আসে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই N = 5, তিন নিয়মে কতজন"
              query={`${SPEND_CTE},
ranked AS (
  SELECT full_name, spent,
         row_number() OVER (ORDER BY spent DESC, customer_id) AS row_no,
         rank()       OVER (ORDER BY spent DESC) AS rnk,
         dense_rank() OVER (ORDER BY spent DESC) AS dense
  FROM spend
)
SELECT
  count(*) FILTER (WHERE row_no <= 5) AS by_row_number,
  count(*) FILTER (WHERE rnk    <= 5) AS by_rank,
  count(*) FILTER (WHERE dense  <= 5) AS by_dense_rank
FROM ranked;`}
              caption="5, 6, 7। ROW_NUMBER ঠিক পাঁচজন নেয়, আর 36000.00 এর তিনজনের একজনকে বাদ দেয়। RANK তিনজনকেই নেয়, তাই ছয়জন। DENSE_RANK তিনজনকে চতুর্থ দল ধরে পঞ্চম দল হিসেবে Oliver Bennett কেও নেয়, তাই সাতজন। FILTER দিয়ে এক Query তে তিনটা গোনা, এটা Module 05 এর Conditional Aggregation।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TopNLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কোনটা ঠিক, সেটা SQL বলে দেয় না, ব্যবসা বলে। Voucher এর বাজেট যদি ঠিক পাঁচটা হয়, ROW_NUMBER আর একটা যুক্তিসঙ্গত
              Tie Breaker। কাউকে অন্যায়ভাবে বাদ দেওয়া যাবে না, তাহলে RANK, যে সমান খরচের সবাইকে একসাথে রাখে। “প্রথম পাঁচ
              রকমের খরচ” চাইলে DENSE_RANK। রুমানা আপা শেষে RANK বেছে নিলেন, আর Lamia Haque তাঁর Voucher পেলেন। প্রতিটা দলের
              ভেতরে আলাদা করে প্রথম কয়েকজন, যেমন প্রতিটা ট্যুরের সেরা তিনটা Booking, সেটা আসবে{" "}
              <Link href="/sql/topic/partition-by" className={LINK}>
                পরের লেসনে PARTITION BY দিয়ে
              </Link>
              , আর{" "}
              <Link href="/sql/topic/top-n-gaps-islands" className={LINK}>
                Top-N per Group লেসনে
              </Link>{" "}
              পুরো কৌশলটা।
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
                  রুমানা আপার চূড়ান্ত তালিকা: confirmed খরচ অনুযায়ী যাঁদের RANK 5 বা তার কম, তাঁদের{" "}
                  <code className={CODE}>full_name</code>, <code className={CODE}>spent</code> আর{" "}
                  <code className={CODE}>rnk</code>। সাজানো rnk অনুযায়ী, rnk সমান হলে নামের ক্রমে।
                </>
              }
              hint={
                <>
                  দুটো CTE: প্রথমটায় খরচ, দ্বিতীয়টায় <code className={CODE}>rank() OVER (ORDER BY spent DESC)</code>। বাইরের
                  Query তে <code className={CODE}>WHERE rnk &lt;= 5</code>। ছয়জন আসবেন।
                </>
              }
              solution={`WITH spend AS (
  SELECT c.customer_id, c.full_name, sum(b.total_bdt) AS spent
  FROM bookings b
  JOIN customers c USING (customer_id)
  WHERE b.status = 'confirmed'
  GROUP BY c.customer_id, c.full_name
),
ranked AS (
  SELECT full_name, spent, rank() OVER (ORDER BY spent DESC) AS rnk
  FROM spend
)
SELECT full_name, spent, rnk
FROM ranked
WHERE rnk <= 5
ORDER BY rnk, full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "percent-rank",
      subHeader: { index: "011", title: "PERCENT_RANK and CUME_DIST" },
      title: <SectionTitle>অবস্থান শতাংশে: কত ভাগের আগে, কত ভাগের মধ্যে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কখনো কখনো “আপনি তিন নম্বর” বলার চেয়ে “আপনি উপরের দশ শতাংশে” বলা বেশি কাজের, বিশেষ করে যখন Row এর সংখ্যা
                বদলায়। ভর্তি পরীক্ষার Percentile এর কথা ভাবুন। এর জন্য দুটো Function আছে, দুটোই 0 থেকে 1 এর মধ্যে একটা
                ভগ্নাংশ দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>PERCENT_RANK</strong>: আমার আগে কতজন, শতাংশে। Docs এর সূত্র: (rank - 1) / (মোট Row - 1)। সবচেয়ে
                  প্রথম Row সবসময় 0, সবচেয়ে শেষ Row 1, যদি সে একা থাকে।
                </ListItem>
                <ListItem>
                  <strong>CUME_DIST</strong>: আমি আর আমার সমান সবাই মিলিয়ে, মোটের কত ভাগ। সূত্র: (আমার আগের Row + আমার সমান
                  Row, আমি সহ) / মোট Row। মান 1/N থেকে 1 পর্যন্ত, আর শেষের দল সবসময় 1।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুটোর ফল PostgreSQL এ double precision, তাই দেখানোর আগে ::numeric করে round করা হয়েছে। এখানে ORDER BY
                rating ছোট থেকে বড়, যাতে সবচেয়ে কম rating 0 তে বসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দশটা rating এর শতাংশ অবস্থান"
              query={`SELECT review_id, rating,
       rank()         OVER (ORDER BY rating) AS rnk,
       round(percent_rank() OVER (ORDER BY rating)::numeric, 3) AS pct_rank,
       round(cume_dist()    OVER (ORDER BY rating)::numeric, 3) AS cume
FROM reviews
ORDER BY rating, review_id;`}
              caption="দুই তারার Review 9: rnk 1, pct_rank 0.000, cume 0.100। চার তারার চারটা: rnk 3, pct_rank 0.222, কারণ (3 - 1) / 9, আর cume 0.600, কারণ তাঁরা সহ ছয়জন, দশের ছয়। পাঁচ তারার চারটা: rnk 7, pct_rank 0.667, কারণ (7 - 1) / 9, আর cume 1.000।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PercentLineDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 6"
              orderMatters
              task={
                <>
                  দামের দিক থেকে উপরের এক চতুর্থাংশ ট্যুর: যাদের PERCENT_RANK, দাম ছোট থেকে বড় ধরে, 0.75 বা তার বেশি।
                  Column দুটো <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>, সবচেয়ে দামিটা
                  আগে।
                </>
              }
              hint={
                <>
                  CTE এর ভেতরে <code className={CODE}>percent_rank() OVER (ORDER BY price_bdt) AS pr</code>, বাইরে{" "}
                  <code className={CODE}>WHERE pr &gt;= 0.75</code>। নয়টা ট্যুরে (rank - 1) / 8, তাই rank 7, 8, 9 আসবে।
                </>
              }
              solution={`WITH ranked AS (
  SELECT title, price_bdt,
         percent_rank() OVER (ORDER BY price_bdt) AS pr
  FROM tours
)
SELECT title, price_bdt
FROM ranked
WHERE pr >= 0.75
ORDER BY price_bdt DESC;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "paging",
      subHeader: { index: "012", title: "Numbering for Pages" },
      title: <SectionTitle>ROW_NUMBER দিয়ে পাতা, আর কখন সেটা যথেষ্ট না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Admin Panel এ Booking এর তালিকা পাঁচটা করে পাতায় দেখানো হয়, সবচেয়ে নতুনটা আগে। ROW_NUMBER দিয়ে এটা বানানো
                খুব সহজে বোঝা যায়: সবাইকে নম্বর দিন, তারপর দ্বিতীয় পাতার জন্য 6 থেকে 10 নম্বর নিন। সাধারণ সূত্র: পাতা p,
                আকার s হলে নম্বর (p - 1) × s + 1 থেকে p × s পর্যন্ত। এখানেও Tie Breaker লাগে, কারণ দুটো Booking এর সময় একই
                হলে পাতার সীমায় একই Row দুই পাতায় আসতে পারে, বা কোনো পাতাতেই না।
              </ContentParagraph>
              <ContentParagraph>
                Module 03 এর{" "}
                <Link href="/sql/topic/limit-pagination" className={LINK}>
                  LIMIT আর Pagination লেসনে
                </Link>{" "}
                আপনি আরেকটা পদ্ধতি দেখেছেন, Keyset: আগের পাতার শেষ Row এর মান মনে রেখে, তার পরের Row গুলো চাওয়া। নিচের বক্সে
                দুটো পদ্ধতি একই দ্বিতীয় পাতা দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="দ্বিতীয় পাতা, দুইভাবে"
              query={`WITH numbered AS (
  SELECT booking_id, booked_at, total_bdt,
         row_number() OVER (ORDER BY booked_at DESC, booking_id DESC) AS row_no
  FROM bookings
)
SELECT row_no, booking_id, booked_at, total_bdt
FROM numbered
WHERE row_no BETWEEN 6 AND 10
ORDER BY row_no;

SELECT booking_id, booked_at, total_bdt
FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;`}
              caption="দুটো Query একই পাঁচটা Booking দেয়: 17, 19, 16, 14, 18। প্রথমটা সব চব্বিশটা Booking কে নম্বর দিয়ে তারপর 6 থেকে 10 নেয়। দ্বিতীয়টা প্রথম পাতার শেষ Row, Booking 20 (2026-10-10 17:20:00+06), মনে রেখে শুধু তার পরের পাঁচটা চায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছোট Table এ দুটোই ঠিক আছে, আর ROW_NUMBER এর একটা সুবিধা আছে: সরাসরি দশম পাতায় লাফ দেওয়া যায়, Keyset এ যায়
              না। কিন্তু ROW_NUMBER কে প্রতিবার আগের সব Row গুনতে হয়, OFFSET এর মতোই, তাই লাখ Row এ শেষের পাতা ধীর হয়। আর
              পড়ার মাঝে নতুন Booking এলে সব নম্বর এক ঘর করে সরে যায়, একই Booking দুই পাতায় দেখা যায়। লম্বা, বদলাতে থাকা
              তালিকায়, যেমন Customer এর Booking History বা App এর Feed, Keyset ভালো। Admin এর ছোট Report এ, যেখানে “পাতা ৭ এ
              যান” দরকার, ROW_NUMBER চলে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "in-mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ একই পাঁচ ফাংশন, দুটো তফাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এ Window Function এসেছে 8.0 তে, তার আগের 5.7 এ এগুলো নেই। আপনার MySQL Course যদি পুরনো Version এ হয়,
                সেখানে এই লেসনের কিছুই চলবে না। MySQL 8.4 এ আমরা এই লেসনের Query গুলো চালিয়ে দেখেছি। ROW_NUMBER, RANK,
                DENSE_RANK, PERCENT_RANK আর CUME_DIST একই নামে আছে, আর Customer এর তালিকা আর Review এর rating এ একই নম্বর
                দেয়। তফাত দুটো জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>NULL এর জায়গা উল্টো।</strong> MySQL এ NULL সবচেয়ে ছোট, তাই DESC এ শেষে। আর NULLS FIRST বা NULLS
                  LAST লেখা যায় না, ERROR 1064। NULL এর জায়গা ঠিক করতে <code className={CODE}>column IS NULL</code> কে প্রথম
                  সাজানোর Column হিসেবে দিন।
                </ListItem>
                <ListItem>
                  <strong>Error এর ভাষা আলাদা।</strong> WHERE এ সরাসরি Window Function দিলে ERROR 3593: You cannot use the
                  window function &apos;rank&apos; in this context। Alias দিলে ERROR 1054: Unknown column &apos;rnk&apos; in
                  &apos;where clause&apos;। সমাধান PostgreSQL এর মতোই, CTE বা Derived Table।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql-8.4-ranking.sql",
          code: `-- MySQL 8.4.11 এ চালানো
SELECT review_id, rating,
       ROW_NUMBER() OVER (ORDER BY rating DESC) AS rn,
       RANK()       OVER (ORDER BY rating DESC) AS rk,
       DENSE_RANK() OVER (ORDER BY rating DESC) AS dr
FROM reviews
ORDER BY rating DESC, review_id;
-- 10 rows, rk: 1 1 1 1 5 5 5 5 9 10, dr: 1 1 1 1 2 2 2 2 3 4

-- NULL শেষে রাখতে, NULLS LAST এর বদলে
SELECT review_id, LENGTH(comment) AS len,
       RANK() OVER (ORDER BY comment IS NULL, LENGTH(comment) DESC) AS rnk
FROM reviews;

-- WHERE এ Window Function
SELECT review_id FROM reviews
WHERE RANK() OVER (ORDER BY rating DESC) <= 3;
-- ERROR 3593 (HY000): You cannot use the window function 'rank' in this context.'`,
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ নম্বর কোথায় কোথায় বসে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের তিনটা Function Island Tours এর পর্দায় তিন জায়গায় দেখা যায়, আর প্রতিটা জায়গায় আলাদা Function বেছে
                নেওয়ার পেছনে একটা ব্যবসার কারণ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ট্যুরের পাতায় Bestseller ব্যাজ।</strong> confirmed Booking এ সবচেয়ে বেশি সিট যে ট্যুর বিক্রি করেছে,
                  তার পাশে একটা ব্যাজ বসে। এখানে DENSE_RANK, কারণ দুটো ট্যুর সমান হলে দুটোই ব্যাজ পাবে, আর দ্বিতীয় স্থান
                  থাকবে দ্বিতীয়ই।
                </ListItem>
                <ListItem>
                  <strong>Loyal Traveller তালিকা।</strong> শীতের Voucher, এই লেসনের গল্প। রুমানা আপার সিদ্ধান্তে RANK, যাতে
                  সমান খরচের কেউ বাদ না পড়েন।
                </ListItem>
                <ListItem>
                  <strong>ট্যুরের পাতায় “সেরা Review”।</strong> rating অনুযায়ী একটাই Review দেখানো হয়, তাই ROW_NUMBER, আর
                  Tie Breaker হিসেবে সবচেয়ে নতুন Review আগে, তারপর review_id।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Bestseller ব্যাজ: সিট বিক্রি অনুযায়ী DENSE_RANK"
              query={`WITH sold AS (
  SELECT t.tour_id, t.title, coalesce(sum(b.seats), 0) AS seats_sold
  FROM tours t
  LEFT JOIN departures d ON d.tour_id = t.tour_id
  LEFT JOIN bookings  b ON b.departure_id = d.departure_id AND b.status = 'confirmed'
  WHERE t.is_active
  GROUP BY t.tour_id, t.title
)
SELECT title, seats_sold,
       dense_rank() OVER (ORDER BY seats_sold DESC) AS place,
       CASE WHEN dense_rank() OVER (ORDER BY seats_sold DESC) = 1 THEN 'Bestseller' END AS badge
FROM sold
ORDER BY place, title;`}
              caption="আটটা চালু ট্যুর। Cox's Bazar Beach Weekend সবচেয়ে বেশি, 11টা সিট, তাই Bestseller। Saint Martin Island Escape 10 সিটে 2। Bandarban আর Sundarbans দুটোই 5 সিট, তাই দুটোই 3। confirmed Booking এ একটাও সিট বিক্রি না হওয়া Family Package 0 সিটে শেষে, place 6। Module 06 এর LEFT JOIN সেটাকে তালিকায় রেখেছে, আর coalesce তার NULL কে 0 বানিয়েছে।"
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
                  Admin Panel এর পদক তালিকা: confirmed খরচ অনুযায়ী DENSE_RANK, নাম <code className={CODE}>place</code>, আর
                  শুধু যাঁদের place 4 বা তার কম। পাশে একটা <code className={CODE}>medal</code> Column: place 1 হলে
                  &apos;Gold&apos;, 2 হলে &apos;Silver&apos;, 3 হলে &apos;Bronze&apos;, বাকিদের &apos;Shortlist&apos;।
                  Column গুলো <code className={CODE}>full_name</code>, <code className={CODE}>spent</code>,{" "}
                  <code className={CODE}>place</code>, <code className={CODE}>medal</code>, সাজানো place অনুযায়ী, place সমান
                  হলে নামের ক্রমে।
                </>
              }
              hint={
                <>
                  খরচের CTE, তারপর place এর CTE, তারপর বাইরে{" "}
                  <code className={CODE}>CASE place WHEN 1 THEN &apos;Gold&apos; ... ELSE &apos;Shortlist&apos; END</code>{" "}
                  আর <code className={CODE}>WHERE place &lt;= 4</code>। ছয়জন আসবেন।
                </>
              }
              solution={`WITH spend AS (
  SELECT c.customer_id, c.full_name, sum(b.total_bdt) AS spent
  FROM bookings b
  JOIN customers c USING (customer_id)
  WHERE b.status = 'confirmed'
  GROUP BY c.customer_id, c.full_name
),
placed AS (
  SELECT full_name, spent, dense_rank() OVER (ORDER BY spent DESC) AS place
  FROM spend
)
SELECT full_name, spent, place,
       CASE place WHEN 1 THEN 'Gold'
                  WHEN 2 THEN 'Silver'
                  WHEN 3 THEN 'Bronze'
                  ELSE 'Shortlist' END AS medal
FROM placed
WHERE place <= 4
ORDER BY place, full_name;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>যেকোনো Ranking Query লেখার ছয় ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "কী দিয়ে সাজাবেন আর কোন দিকে",
              description:
                "“সবচেয়ে বেশি” মানে DESC, “সবচেয়ে কম” বা “সবচেয়ে আগে” মানে ASC। এটা OVER এর ভেতরের ORDER BY তে বসবে।",
            },
            {
              title: "সমান মান হতে পারে কিনা ভাবুন",
              description:
                "দাম, rating, খরচ, তারিখ: প্রায় সবকিছুতেই সমান মান আসতে পারে, আজ না হলেও কাল। Primary Key ছাড়া কোনো Column এর উপর ভরসা করবেন না।",
            },
            {
              title: "সমান হলে কী চাই, সেই অনুযায়ী Function",
              description:
                "প্রত্যেকের আলাদা নম্বর: ROW_NUMBER। খেলার মতো অবস্থান, ফাঁক সহ: RANK। কততম আলাদা মান: DENSE_RANK।",
            },
            {
              title: "ROW_NUMBER হলে Tie Breaker দিন",
              description:
                "ORDER BY এর শেষে একটা অনন্য Column, সাধারণত Primary Key। ব্যবসার কোনো যুক্তি থাকলে তার আগে সেটা।",
            },
            {
              title: "NULL থাকলে জায়গা লিখে দিন",
              description:
                "সাজানোর Column এ NULL থাকতে পারলে PostgreSQL এ NULLS LAST বা NULLS FIRST। MySQL এ column IS NULL দিয়ে প্রথমে সাজান।",
            },
            {
              title: "নম্বর দিয়ে বাছাই করলে CTE তে মুড়ুন",
              description:
                "ভেতরে নম্বর, বাইরে WHERE। আর শেষের ORDER BY আলাদা করে লিখুন, কারণ নম্বরের ক্রম দেখানোর ক্রম ঠিক করে না।",
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
              "সমান মান থাকা Column এ Tie Breaker ছাড়া ROW_NUMBER",
              "নম্বর আজ এক রকম, কাল অন্য রকম, কোনো Error ছাড়া",
              "ORDER BY এর শেষে Primary Key",
            ],
            [
              "“প্রথম পাঁচজন” এর জন্য না ভেবে ROW_NUMBER",
              "সমান খরচের একজন চুপচাপ বাদ পড়েন",
              "সমান মানে কী চাই ঠিক করে RANK বা DENSE_RANK",
            ],
            [
              "WHERE এ rank() বা তার Alias",
              "window functions are not allowed in WHERE, বা column does not exist",
              "CTE এর ভেতরে নম্বর, বাইরে WHERE",
            ],
            [
              "OVER এর ভেতরে ORDER BY বাদ দেওয়া",
              "RANK সবাইকে 1 দেয়, ROW_NUMBER এলোমেলো",
              "OVER (ORDER BY ...) সবসময় লিখুন",
            ],
            [
              "OVER এর ORDER BY কে দেখানোর ক্রম ভাবা",
              "ফলাফল অন্য ক্রমে আসতে পারে",
              "Query এর শেষে আলাদা ORDER BY",
            ],
            [
              "NULL থাকা Column এ DESC সাজিয়ে Ranking",
              "PostgreSQL এ NULL গুলো 1 নম্বরে বসে",
              "NULLS LAST, বা Ranking এর আগে NULL বাদ",
            ],
            [
              "RANK এর শেষ নম্বরকে আলাদা মানের সংখ্যা ভাবা",
              "RANK ফাঁক রাখে, তাই শেষ নম্বর মোট Row এর কাছাকাছি",
              "আলাদা মান গুনতে DENSE_RANK বা count(DISTINCT ...)",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও পড়ার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <a
                  href="https://www.postgresql.org/docs/current/functions-window.html"
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer">
                  PostgreSQL: Window Functions
                </a>
                : row_number, rank, dense_rank, percent_rank আর cume_dist এর অফিসিয়াল এক লাইনের সংজ্ঞা, এই লেসনের সূত্রগুলো
                এখান থেকেই।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/tutorial-window.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL Tutorial: Window Functions
                </a>
                : ছোট্ট Tutorial, rank() দিয়েই শুরু। আগের লেসনের সাথে মিলিয়ে পড়ার মতো।
              </ListItem>
              <ListItem>
                <a href="https://www.postgresql.org/docs/current/sql-expressions.html" className={LINK} target="_blank" rel="noopener noreferrer">
                  PostgreSQL: Value Expressions
                </a>
                : Window Function Calls অংশে লেখা আছে ORDER BY ছাড়া Row গুলো অনির্দিষ্ট ক্রমে প্রক্রিয়া হয়।
              </ListItem>
              <ListItem>
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/window-function-descriptions.html"
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer">
                  MySQL 8.4: Window Function Descriptions
                </a>
                : MySQL এর দিক থেকে একই ফাংশনগুলো, উদাহরণ সহ।
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Window_function_%28SQL%29" className={LINK} target="_blank" rel="noopener noreferrer">
                  Wikipedia: Window function (SQL)
                </a>
                : Window Function এর সাধারণ ধারণা, কোন Database কবে থেকে সমর্থন করে।
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
                  ROW_NUMBER, RANK আর DENSE_RANK প্রতিটা Row এর পাশে একটা অবস্থান বসায়, Row না হারিয়ে। তফাত শুধু সমান
                  মানে।
                </ListItem>
                <ListItem>
                  ROW_NUMBER সবাইকে আলাদা নম্বর দেয়। সমান মানের মধ্যে কে আগে, সেটা সে ঠিক করে না, তাই Tie Breaker ছাড়া
                  তার নম্বর বদলাতে পারে।
                </ListItem>
                <ListItem>
                  RANK সমানদের একই নম্বর দিয়ে পরে লাফ দেয়: 1, 1, 3। DENSE_RANK লাফ দেয় না: 1, 1, 2।
                </ListItem>
                <ListItem>
                  OVER এর ভেতরের ORDER BY নম্বর ঠিক করে, Query এর শেষের ORDER BY দেখানোর ক্রম। ভেতরে ORDER BY না দিলে
                  Ranking অর্থহীন।
                </ListItem>
                <ListItem>
                  NULL এর জায়গা Database ভেদে উল্টো। PostgreSQL এ DESC তে NULL আগে, তাই NULLS LAST মনে রাখুন।
                </ListItem>
                <ListItem>
                  নম্বর দিয়ে বাছাই করতে হলে CTE: ভেতরে নম্বর, বাইরে WHERE। একই N এ তিন Function তিন সংখ্যক Row দিতে পারে,
                  এখানে 5, 6, 7।
                </ListItem>
                <ListItem>
                  PERCENT_RANK বলে আমার আগে কত ভাগ, CUME_DIST বলে আমি সহ কত ভাগ। দুটোই 0 থেকে 1।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনের প্রতিটা নম্বর গোনা হয়েছে পুরো তালিকা জুড়ে, একটাই দৌড়। কিন্তু Island Tours এর বেশিরভাগ প্রশ্ন
                দলের ভেতরে: প্রতিটা ট্যুরের সবচেয়ে বড় Booking, প্রতিটা মাসের সেরা দিন, প্রত্যেক Customer এর প্রথম Booking।
                পরের লেসনে{" "}
                <Link href="/sql/topic/partition-by" className={LINK}>
                  PARTITION BY
                </Link>{" "}
                দিয়ে আপনি একই তিন Function কে প্রতিটা দলের ভেতরে আলাদা আলাদা দৌড় করাবেন।
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
      ["Ranking Function", "সাজানোর নিয়মে প্রতিটা Row এর অবস্থান, Row না হারিয়ে", "Voucher এর তালিকা"],
      ["ROW_NUMBER", "1, 2, 3, সবাই আলাদা", "দাম অনুযায়ী নয়টা ট্যুর"],
      ["Tie বা Peer", "ORDER BY এর চোখে সমান Row", "36000.00 এর তিনজন"],
      ["ROW_NUMBER এ Tie", "আলাদা নম্বর, কিন্তু কে আগে অনির্দিষ্ট", "পাঁচ তারার চার Review এর ক্রম বদলায়"],
      ["RANK", "সমান হলে একই, তারপর লাফ: 1, 1, 3", "rating এ 1, 1, 1, 1, 5"],
      ["DENSE_RANK", "সমান হলে একই, লাফ নেই: 1, 1, 2", "rating এ 1, 1, 1, 1, 2"],
      ["Tie Breaker", "OVER এর ORDER BY তে একটা অনন্য Column", "spent DESC, customer_id"],
      ["দুই ORDER BY", "OVER এর ভেতরেরটা নম্বর, শেষেরটা দেখানোর ক্রম", "দামে নম্বর, নামে দেখানো"],
      ["NULL এর জায়গা", "PostgreSQL এ DESC তে NULL আগে", "মন্তব্যহীন Review 1 নম্বরে"],
      ["Rank দিয়ে বাছাই", "WHERE এ চলে না, CTE তে মুড়ে বাইরে", "rnk <= 5 এ ছয়জন"],
      ["PERCENT_RANK", "(rank - 1) / (N - 1)", "চার তারার Review 0.222"],
      ["CUME_DIST", "আমি আর সমানরা সহ, মোটের কত ভাগ", "চার তারার Review 0.600"],
      ["ROW_NUMBER এ পাতা", "(p - 1) × s + 1 থেকে p × s", "দ্বিতীয় পাতা 6 থেকে 10"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "rating 5, 5, 4 এর তিনটা Row কে বড় থেকে ছোট সাজিয়ে কোন Function 1, 1, 3 দেয়?",
        options: [
          {
            key: "A",
            text: "ROW_NUMBER",
            isCorrect: false,
            explanation: "ROW_NUMBER সমান মানেও আলাদা নম্বর দেয়, তাই 1, 2, 3।",
          },
          {
            key: "B",
            text: "RANK",
            isCorrect: true,
            explanation: "ঠিক। দুটো 5 একই নম্বর 1 পায়, আর 4 এর আগে দুটো Row আছে বলে সে পায় 3।",
          },
          {
            key: "C",
            text: "DENSE_RANK",
            isCorrect: false,
            explanation: "DENSE_RANK লাফ দেয় না, তাই 4 পায় 2: 1, 1, 2।",
          },
          {
            key: "D",
            text: "PERCENT_RANK",
            isCorrect: false,
            explanation: "PERCENT_RANK 0 থেকে 1 এর ভগ্নাংশ দেয়: এখানে 0, 0, 1।",
          },
        ],
      },
      {
        id: 2,
        text: "Voucher এর তালিকায় তিনজন একসাথে চতুর্থ। তাঁদের ঠিক পরের Customer, Oliver Bennett, RANK এ কত পান?",
        options: [
          {
            key: "A",
            text: "5",
            isCorrect: false,
            explanation: "5 দেয় DENSE_RANK, যে দল গোনে। RANK গোনে Row।",
          },
          {
            key: "B",
            text: "6",
            isCorrect: false,
            explanation: "তাঁর আগে ছয়জন আছেন, তাই তিনি সপ্তম, ষষ্ঠ না।",
          },
          {
            key: "C",
            text: "7",
            isCorrect: true,
            explanation: "ঠিক। তাঁর আগে ছয়জন: তিনজন 1, 2, 3 আর তিনজন 4। RANK = আগের Row সংখ্যা + 1 = 7।",
          },
          {
            key: "D",
            text: "4",
            isCorrect: false,
            explanation: "তাঁর খরচ 28000.00, 36000.00 এর সমান না, তাই তিনি চতুর্থ দলে নেই।",
          },
        ],
      },
      {
        id: 3,
        text: "SELECT ... FROM reviews WHERE rank() OVER (ORDER BY rating DESC) <= 3 কেন Error দেয়?",
        options: [
          {
            key: "A",
            text: "rank() এর ভেতরে Column লিখতে হয়",
            isCorrect: false,
            explanation: "rank() কোনো Column নেয় না, বন্ধনী খালিই থাকে। সমস্যা অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "WHERE চলে Window Function এর আগে, তখন নম্বরগুলো তৈরিই হয়নি",
            isCorrect: true,
            explanation: "ঠিক। তাই PostgreSQL বলে window functions are not allowed in WHERE। CTE তে নম্বর বসিয়ে বাইরে ছাঁকুন।",
          },
          {
            key: "C",
            text: "<= এর বদলে BETWEEN লিখতে হয়",
            isCorrect: false,
            explanation: "তুলনার চিহ্ন ঠিকই আছে। BETWEEN লিখলেও একই Error আসবে।",
          },
          {
            key: "D",
            text: "reviews Table এ rank নামের Column নেই",
            isCorrect: false,
            explanation: "rank() একটা Function, Column না। Error এর বার্তাও Column নিয়ে না, Window Function নিয়ে।",
          },
        ],
      },
      {
        id: 4,
        text: "Tie Breaker ছাড়া, সমান মান থাকা Column এ ROW_NUMBER কোন কথা দেয়?",
        options: [
          {
            key: "A",
            text: "সমান মানের Row গুলো id এর ক্রমে নম্বর পাবে",
            isCorrect: false,
            explanation: "এমন কোনো কথা নেই। এই লেসনের বক্সে Row আসার ক্রম বদলাতেই নম্বর বদলে গেছে।",
          },
          {
            key: "B",
            text: "নম্বরগুলো আলাদা আর ফাঁকহীন, কিন্তু সমানদের মধ্যে কে কোন নম্বর পাবে তা অনির্দিষ্ট",
            isCorrect: true,
            explanation: "ঠিক। তাই আলাদা নম্বর দরকার হলে ORDER BY এর শেষে একটা অনন্য Column দিন।",
          },
          {
            key: "C",
            text: "সমান মানের Row গুলো একই নম্বর পাবে",
            isCorrect: false,
            explanation: "সেটা RANK আর DENSE_RANK এর আচরণ। ROW_NUMBER কখনো একই নম্বর দুইবার দেয় না।",
          },
          {
            key: "D",
            text: "Database Error দেবে, কারণ সমান মানে ROW_NUMBER চলে না",
            isCorrect: false,
            explanation: "কোনো Error হয় না, আর ঠিক সেটাই বিপদ: ভুলটা চুপচাপ থাকে।",
          },
        ],
      },
      {
        id: 5,
        text: "SELECT rank() OVER () FROM reviews কী ফেরত দেয়?",
        options: [
          {
            key: "A",
            text: "1 থেকে 10",
            isCorrect: false,
            explanation: "ORDER BY ছাড়া সব Row সমান, তাই RANK আলাদা নম্বর দেয় না।",
          },
          {
            key: "B",
            text: "দশটা Row, প্রত্যেকের 1",
            isCorrect: true,
            explanation: "ঠিক। সাজানোর নিয়ম নেই বলে সবাই একে অপরের Peer, আর সবাই প্রথম দলে।",
          },
          {
            key: "C",
            text: "Error, কারণ OVER খালি রাখা যায় না",
            isCorrect: false,
            explanation: "খালি OVER () পুরোপুরি বৈধ, এই লেসনের তৃতীয় অংশের বক্সেই সেটা চালানো হয়েছে।",
          },
          {
            key: "D",
            text: "একটাই Row, মান 10",
            isCorrect: false,
            explanation: "Window Function Row কমায় না। এটা Aggregate এর আচরণ।",
          },
        ],
      },
      {
        id: 6,
        text: "SELECT title, rank() OVER (ORDER BY price_bdt DESC) AS r FROM tours ORDER BY title; এখানে r এর মান কে ঠিক করে?",
        options: [
          {
            key: "A",
            text: "শেষের ORDER BY title",
            isCorrect: false,
            explanation: "শেষের ORDER BY শুধু দেখানোর ক্রম ঠিক করে, কোন Row কত নম্বর সেটা না।",
          },
          {
            key: "B",
            text: "OVER এর ভেতরের ORDER BY price_bdt DESC",
            isCorrect: true,
            explanation: "ঠিক। তাই নামের ক্রমে দেখালেও Family Package এর r থাকে 3।",
          },
          {
            key: "C",
            text: "দুটো মিলিয়ে, প্রথমে নাম তারপর দাম",
            isCorrect: false,
            explanation: "দুটো আলাদা কাজ করে, মেশে না।",
          },
          {
            key: "D",
            text: "Table এ Row রাখার ক্রম",
            isCorrect: false,
            explanation: "OVER এর ভেতরে ORDER BY থাকায় সেটার আর কোনো ভূমিকা নেই, দামগুলোও সব আলাদা।",
          },
        ],
      },
      {
        id: 7,
        text: "PostgreSQL এ rank() OVER (ORDER BY length(comment) DESC) চালালে মন্তব্যহীন দুটো Review কোথায় বসে?",
        options: [
          {
            key: "A",
            text: "দুজনেই 1 নম্বরে",
            isCorrect: true,
            explanation: "ঠিক। PostgreSQL NULL কে সবচেয়ে বড় ধরে, তাই DESC তে NULL আগে। NULLS LAST দিয়ে সারান।",
          },
          {
            key: "B",
            text: "দুজনেই শেষে",
            isCorrect: false,
            explanation: "সেটা MySQL এ হয়, যেখানে NULL সবচেয়ে ছোট। PostgreSQL এ উল্টো।",
          },
          {
            key: "C",
            text: "ফলাফলে আসেই না",
            isCorrect: false,
            explanation: "Window Function কোনো Row বাদ দেয় না, NULL থাকলেও না।",
          },
          {
            key: "D",
            text: "Error আসে, কারণ length(NULL) চলে না",
            isCorrect: false,
            explanation: "length(NULL) Error দেয় না, NULL ফেরত দেয়।",
          },
        ],
      },
      {
        id: 8,
        text: "দশটা Row এর একটায় rank 7। তার PERCENT_RANK কত?",
        options: [
          {
            key: "A",
            text: "0.7",
            isCorrect: false,
            explanation: "7 / 10 সূত্রটা ভুল। PERCENT_RANK হলো (rank - 1) / (N - 1)।",
          },
          {
            key: "B",
            text: "0.6",
            isCorrect: false,
            explanation: "6 / 10 করলে আসে, কিন্তু ভাগ হয় N - 1 = 9 দিয়ে।",
          },
          {
            key: "C",
            text: "প্রায় 0.667",
            isCorrect: true,
            explanation: "ঠিক। (7 - 1) / (10 - 1) = 6 / 9 = 0.667, পাঁচ তারার Review গুলোর মান ঠিক এটাই।",
          },
          {
            key: "D",
            text: "1",
            isCorrect: false,
            explanation: "1 হয় শুধু সবচেয়ে শেষের Row এর, যদি সে একা থাকে। rank 7 শেষ না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: ন্যায্য Leaderboard",
    time: "৪৫ থেকে ৬০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>Voucher নীতি:</strong> প্রথম পাঁচজনের তালিকা তিনটা Function দিয়ে বানান। তিনটা তালিকা পাশাপাশি রাখুন,
        তারপর রুমানা আপার জন্য চার লাইনের একটা নোট লিখুন: কোন নিয়মে কতজন, কে বাদ পড়েন, আর আপনি কোনটা সুপারিশ করেন ও
        কেন।
      </span>,
      <span key="2">
        <strong>অর্থবহ Tie Breaker:</strong> confirmed Booking গুলোকে total_bdt অনুযায়ী ROW_NUMBER দিন দুইভাবে: একবার
        booking_id দিয়ে Tie ভেঙে, আরেকবার booked_at (আগে বুক করা আগে) দিয়ে। কোন Booking গুলোর নম্বর বদলাল লিখুন, আর কোন
        নিয়মটা Customer দের কাছে বেশি ন্যায্য মনে হয়।
      </span>,
      <span key="3">
        <strong>সেরা Review:</strong> প্রতিটা Review কে rating অনুযায়ী সাজিয়ে, rating সমান হলে নতুনটা আগে, তারপর
        review_id, ROW_NUMBER দিন। প্রথম তিনটা দেখান। তারপর একই প্রশ্ন RANK দিয়ে করুন আর দেখান কেন তখন তিনটার বেশি আসে।
      </span>,
      <span key="4">
        <strong>NULL এর ফাঁদ:</strong> guides এর সাথে tours LEFT JOIN করে প্রতিটা ট্যুরকে Guide এর hired_on অনুযায়ী
        RANK দিন, পুরনো Guide আগে। Ratargul এর Guide নেই, সে কোথায় বসে দেখুন। তারপর NULLS FIRST আর NULLS LAST দুটো দিয়ে
        চালান, আর MySQL এ একই ফল কীভাবে পেতেন লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> দৌড়ের মাঠের উদাহরণ দিয়ে একজন বন্ধুকে ছয় লাইনে বোঝান ROW_NUMBER, RANK
        আর DENSE_RANK এর তফাত, আর কেন ROW_NUMBER এ Tie Breaker লাগে।
      </span>,
    ],
    deliverables: [
      <span key="d1">তিনটা তালিকার Query, ফলাফল আর চার লাইনের নোট</span>,
      <span key="d2">দুই রকম Tie Breaker এর ফলাফল আর বদলে যাওয়া Booking এর তালিকা</span>,
      <span key="d3">সেরা তিন Review, আর RANK দিয়ে করা তালিকা পাশাপাশি</span>,
      <span key="d4">NULLS FIRST আর NULLS LAST এর দুই ফলাফল, আর MySQL এর বিকল্প Query</span>,
      <span key="d5">বন্ধুর জন্য লেখা ছয় লাইন</span>,
    ],
  },
  practicalLab: {
    title: "নিজের psql এ Ranking",
    subtitle: "Module 02 এ Load করা island_tours এ ছয়টা ড্রিল, প্রতিটার প্রত্যাশিত ফলাফল সহ",
    stepName: "DRILL",
    steps: [
      {
        title: "প্রথম নম্বর",
        description:
          "প্রথম ফাইলে দাম অনুযায়ী ট্যুরের ROW_NUMBER, দুই দিকেই। দামগুলো আলাদা, তাই এখানে কোনো সন্দেহ নেই।",
      },
      {
        title: "সমান মান",
        description:
          "দ্বিতীয় ফাইলে Review এর rating এ RANK আর DENSE_RANK পাশাপাশি। শেষ Row এর দুই নম্বর মিলিয়ে দেখুন: 10 আর 4।",
      },
      {
        title: "Tie Breaker",
        description:
          "তৃতীয় ফাইলে Customer এর খরচে Tie Breaker সহ ROW_NUMBER। 36000.00 এর তিনজনের নম্বর customer_id এর ক্রমে আসা উচিত।",
      },
      {
        title: "NULL এর জায়গা",
        description:
          "চতুর্থ ফাইলে \\pset null দিয়ে NULL দৃশ্যমান করে মন্তব্যের দৈর্ঘ্যে RANK, NULLS LAST সহ আর ছাড়া।",
      },
      {
        title: "প্রথম পাঁচজন",
        description:
          "পঞ্চম ফাইলে একই N = 5 এ তিন নিয়মে কতজন: 5, 6, 7। তারপর WHERE এ সরাসরি rank() লিখে Error টা নিজে একবার দেখুন।",
      },
      {
        title: "শতাংশ আর পাতা",
        description:
          "ষষ্ঠ ফাইলে PERCENT_RANK আর CUME_DIST, তারপর ROW_NUMBER দিয়ে Booking এর দ্বিতীয় পাতা।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "01-row-number.sql",
        code: `SELECT title, price_bdt,
       row_number() OVER (ORDER BY price_bdt DESC) AS position
FROM tours
ORDER BY position;
-- (9 rows), 1: Saint Martin Luxury Stay | 32000.00, 9: Ratargul Swamp Boat Day | 3500.00

SELECT title, price_bdt,
       row_number() OVER (ORDER BY price_bdt) AS position
FROM tours
ORDER BY position;
-- (9 rows), 1: Ratargul Swamp Boat Day | 3500.00`,
      },
      {
        language: "sql",
        filename: "02-rank-vs-dense.sql",
        code: `SELECT review_id, rating,
       rank()       OVER (ORDER BY rating DESC) AS rnk,
       dense_rank() OVER (ORDER BY rating DESC) AS dense
FROM reviews
ORDER BY rnk, review_id;
-- (10 rows)
-- rnk:   1 1 1 1 5 5 5 5 9 10
-- dense: 1 1 1 1 2 2 2 2 3 4`,
      },
      {
        language: "sql",
        filename: "03-tie-breaker.sql",
        code: `WITH spend AS (
  SELECT c.customer_id, c.full_name, sum(b.total_bdt) AS spent
  FROM bookings b
  JOIN customers c USING (customer_id)
  WHERE b.status = 'confirmed'
  GROUP BY c.customer_id, c.full_name
)
SELECT full_name, spent, customer_id,
       row_number() OVER (ORDER BY spent DESC, customer_id) AS row_no
FROM spend
ORDER BY row_no;
-- (12 rows)
-- 4: Farhana Akter | 36000.00 | 4
-- 5: Mitu Rahman   | 36000.00 | 6
-- 6: Lamia Haque   | 36000.00 | 14`,
      },
      {
        language: "sql",
        filename: "04-nulls.sql",
        code: `\\pset null '(null)'

SELECT review_id, length(comment) AS len,
       rank() OVER (ORDER BY length(comment) DESC) AS rnk
FROM reviews
ORDER BY rnk, review_id
LIMIT 3;
-- 4 | (null) | 1
-- 8 | (null) | 1
-- 10 | 45 | 3

SELECT review_id, length(comment) AS len,
       rank() OVER (ORDER BY length(comment) DESC NULLS LAST) AS rnk
FROM reviews
ORDER BY rnk, review_id
LIMIT 3;
-- 10 | 45 | 1
-- 1 | 44 | 2
-- 2 | 39 | 3`,
      },
      {
        language: "sql",
        filename: "05-top-five.sql",
        code: `WITH spend AS (
  SELECT c.customer_id, c.full_name, sum(b.total_bdt) AS spent
  FROM bookings b
  JOIN customers c USING (customer_id)
  WHERE b.status = 'confirmed'
  GROUP BY c.customer_id, c.full_name
),
ranked AS (
  SELECT full_name, spent,
         row_number() OVER (ORDER BY spent DESC, customer_id) AS row_no,
         rank()       OVER (ORDER BY spent DESC) AS rnk,
         dense_rank() OVER (ORDER BY spent DESC) AS dense
  FROM spend
)
SELECT count(*) FILTER (WHERE row_no <= 5) AS by_row_number,
       count(*) FILTER (WHERE rnk    <= 5) AS by_rank,
       count(*) FILTER (WHERE dense  <= 5) AS by_dense_rank
FROM ranked;
-- 5 | 6 | 7

SELECT review_id, rating
FROM reviews
WHERE rank() OVER (ORDER BY rating DESC) <= 3;
-- ERROR:  window functions are not allowed in WHERE`,
      },
      {
        language: "sql",
        filename: "06-percent-and-pages.sql",
        code: `SELECT review_id, rating,
       round(percent_rank() OVER (ORDER BY rating)::numeric, 3) AS pct_rank,
       round(cume_dist()    OVER (ORDER BY rating)::numeric, 3) AS cume
FROM reviews
ORDER BY rating, review_id;
-- (10 rows), প্রথম: 9 | 2 | 0.000 | 0.100, শেষ: 8 | 5 | 0.667 | 1.000

WITH numbered AS (
  SELECT booking_id, booked_at,
         row_number() OVER (ORDER BY booked_at DESC, booking_id DESC) AS row_no
  FROM bookings
)
SELECT row_no, booking_id
FROM numbered
WHERE row_no BETWEEN 6 AND 10
ORDER BY row_no;
-- (5 rows): booking_id 17, 19, 16, 14, 18`,
      },
    ],
    tip: (
      <ContentParagraph>
        প্রতিটা Ranking লেখার পর নিজেকে একটা প্রশ্ন করুন: সাজানোর Column এ দুটো Row সমান হলে আমি কী চাই? উত্তর যদি
        “প্রত্যেকের আলাদা নম্বর” হয়, তাহলে Tie Breaker না দেওয়া পর্যন্ত Query টা শেষ হয়নি। উত্তর যদি “সমানরা একসাথে” হয়,
        তাহলে RANK না DENSE_RANK, সেটা ঠিক করুন পরের জনের নম্বর দেখে।
      </ContentParagraph>
    ),
  },
};
