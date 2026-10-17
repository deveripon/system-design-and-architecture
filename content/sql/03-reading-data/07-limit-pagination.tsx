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
  OffsetCostLab,
  PageMathLab,
  ShiftingPagesLab,
} from "../../../components/course/topics/reading-data/page-animations";
import {
  LimitWindowDiagram,
  OffsetVsKeysetSplit,
  RowCompareDiagram,
} from "../../../components/course/topics/reading-data/page-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.9em]";

export const limitPaginationContent: TopicData = {
  id: "limit-pagination",
  introduction: {
    badge: "MODULE 03 · LESSON 07",
    title: <SectionTitle>সব না, শুধু যতটুকু দরকার: LIMIT, OFFSET আর পাতা ভাগ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর Admin Panel এ একটা পাতা আছে, নাম সব Booking। আজ সেখানে
          ২৪টা Booking, তাই পুরো তালিকা এক পাতায় দেখালে কোনো সমস্যা নেই। কিন্তু ব্যবসা
          বাড়ছে। দুই বছর পর একই পাতা খুললে Database কে দুই লাখ Row পাঠাতে হবে, Server
          সেগুলো JSON বানাবে, Browser সেগুলো আঁকতে গিয়ে আটকে যাবে, আর যিনি পাতা খুলেছেন
          তিনি দেখতে চেয়েছিলেন শুধু আজকের বিশটা।
        </ContentParagraph>
        <ContentParagraph>
          মানুষ কখনো একসাথে দুই লাখ Row পড়েন না। পড়েন প্রথম বিশটা, তারপর দরকার হলে
          পরের বিশটা। এই লেসন ঠিক সেই কাজটা শেখায়: Database কে জানানো যে সব না, শুধু
          এতগুলো চাই, আর এই জায়গা থেকে শুরু। এর জন্য আছে LIMIT আর OFFSET। শিখবেন কেন LIMIT এর
          আগে ORDER BY ছাড়া চলে না, পাতার নম্বর থেকে OFFSET কীভাবে হিসাব হয়, সমান মানের
          Row থাকলে উত্তর কেন বদলে যায়, পাতা গভীর হলে OFFSET কেন ধীর হয়, দুই পাতার মাঝখানে
          নতুন Booking এলে কী গোলমাল হয়, আর বড় অ্যাপ গুলো আসলে কোন পদ্ধতিতে পাতা ভাগ
          করে। সবকিছু চলবে আসল Island Tours Data তে, পাতার ভেতরের Query বক্সে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "লাইব্রেরিয়ান কখনো বলেন না, ষষ্ঠ তাক থেকে গুনে গুনে চল্লিশতম বইটা নিন। তিনি বলেন, যেখানে বুকমার্ক রেখেছিলেন, সেখান থেকে পড়ুন।",
      author: "Keyset Pagination",
      role: "Lesson 07",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>দুই লাখ Row, আর একটা ছোট স্ক্রিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা ই কমার্স অ্যাপের কথা ভাবুন। পণ্যের তালিকায় হাজার হাজার জিনিস, কিন্তু
                আপনার ফোনের স্ক্রিনে একবারে ধরে মাত্র দশ বারোটা। নিচে নামলে আরও আসে।
                Facebook এর Feed, Gmail এর Inbox, YouTube এর Comment, সবখানে একই ছবি:
                Data অনেক, দেখানো হয় অল্প অল্প করে। এই অল্প অল্প করে দেখানোর নাম
                Pagination, বাংলায় পাতা ভাগ করা।
              </ContentParagraph>
              <ContentParagraph>
                Pagination কেন দরকার, সেটা তিনটা জায়গায় টাকা আর সময়ের হিসাবে বোঝা যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Database এর কাজ:</strong> যত Row পাঠাতে হবে, Database কে তত Row
                  খুঁজে বের করতে, সাজাতে আর Network এ পাঠাতে হবে। বিশটা পাঠানো আর দুই লাখ
                  পাঠানো এক কাজ না।
                </ListItem>
                <ListItem>
                  <strong>Network আর Server এর কাজ:</strong> প্রতিটা Row JSON হয়ে Internet
                  পার হয়ে ফোনে যায়। দুই লাখ Row মানে কয়েক মেগাবাইট, যেটা মোবাইল Data তে
                  ধীর আর খরচের।
                </ListItem>
                <ListItem>
                  <strong>মানুষের কাজ:</strong> দুই লাখ Row এর তালিকা কেউ পড়েন না। দরকারি
                  জিনিস খুঁজে পেতে মানুষ চান সাজানো, ছোট, পরিষ্কার একটা পাতা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই প্রায় প্রতিটা আসল Query এর শেষে একটা প্রশ্ন বসে থাকে: কতগুলো চাই, আর
                কোথা থেকে শুরু। SQL এ এর উত্তর লেখা হয় দুটো শব্দে, LIMIT আর OFFSET। আর
                বড় অ্যাপে এর চেয়েও ভালো একটা উপায় আছে, যার নাম Keyset Pagination। এই
                লেসনের শেষে তিনটাই আপনার হাতে থাকবে, আর জানবেন কোনটা কখন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের তিনটা শব্দ",
          content: (
            <ContentList>
              <ListItem>
                <strong>LIMIT:</strong> সর্বোচ্চ কতগুলো Row ফেরত দেবে। দোকানদারকে বলা,
                প্রথম পাঁচটা দেখান।
              </ListItem>
              <ListItem>
                <strong>OFFSET:</strong> শুরুর আগে কতগুলো Row বাদ দেবে। বইয়ের প্রথম
                চল্লিশ পাতা উল্টে যাওয়া।
              </ListItem>
              <ListItem>
                <strong>Keyset (Cursor) Pagination:</strong> আগের পাতার শেষ Row টা মনে রেখে
                তার পর থেকে শুরু করা। বইয়ে বুকমার্ক রাখা।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "limit",
      subHeader: { index: "002", title: "LIMIT" },
      title: <SectionTitle>LIMIT: প্রথম কয়েকটা, বাকিগুলো না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                LIMIT বসে Query এর একদম শেষে, ORDER BY এর পরে। এর পরে একটা সংখ্যা, যেটা
                বলে সর্বোচ্চ কতগুলো Row চাই। সর্বোচ্চ শব্দটা গুরুত্বপূর্ণ: Query যদি এর
                চেয়ে কম Row বানায়, LIMIT কোনো Row বানিয়ে দেয় না, যা আছে তাই দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে Island Tours এর সবচেয়ে সস্তা তিনটা ট্যুর। ORDER BY price_bdt
                দামের ক্রমে সাজায়, ছোট থেকে বড়, আর LIMIT 3 প্রথম তিনটা নিয়ে থামে। Run
                চাপুন, তারপর 3 বদলে 5 বা 20 লিখে দেখুন। 20 লিখলেও আসবে মাত্র ৯টা, কারণ
                tours Table এ ট্যুর আছেই ৯টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="সবচেয়ে সস্তা তিনটা ট্যুর"
              query={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt
LIMIT 3;`}
              caption="ফলাফল: Ratargul Swamp Boat Day 3500.00, Sylhet Tea Garden Tour 7800.00, Cox's Bazar Beach Weekend 8500.00। LIMIT এর সংখ্যা বদলে চালিয়ে দেখুন, কতটা Row আসে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                LIMIT এর তিনটা বিশেষ রূপ জেনে রাখা ভালো, কারণ অন্যের লেখা Query তে দেখবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong className={CODE}>LIMIT 0</strong> কোনো Row দেয় না, কিন্তু Column
                  এর নাম ঠিকই দেয়। কেউ কেউ এটা দিয়ে শুধু দেখে নেন একটা Query কোন কোন
                  Column ফেরত দেবে, Data না এনে।
                </ListItem>
                <ListItem>
                  <strong className={CODE}>LIMIT ALL</strong> মানে কোনো সীমা নেই, LIMIT না
                  লেখার মতোই। PostgreSQL এর Docs এ এটা স্পষ্ট লেখা।
                </ListItem>
                <ListItem>
                  <strong className={CODE}>LIMIT NULL</strong> ও কোনো সীমা না, LIMIT ALL এর
                  মতো। কোড থেকে সংখ্যা না পাঠালে এরকম হতে পারে, তাই অবাক হবেন না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "LIMIT শেষে কেন",
          content: (
            <ContentParagraph>
              Lesson 02 তে{" "}
              <Link href="/sql/topic/query-order" className={LINK}>
                The Logical Order of a Query
              </Link>{" "}
              এ দেখেছেন, Database একটা Query লেখার ক্রমে চালায় না। FROM, WHERE, SELECT,
              ORDER BY, তারপর সবশেষে LIMIT আর OFFSET। অর্থাৎ LIMIT সবসময় কাজ করে
              ছাঁকা আর সাজানো শেষ হওয়ার পরে। তাই LIMIT 3 মানে সাজানো ফলাফলের প্রথম তিনটা,
              Table এর এলোমেলো তিনটা না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "order-first",
      subHeader: { index: "003", title: "Order First" },
      title: <SectionTitle>ORDER BY ছাড়া LIMIT মানে লটারি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার একটা পরীক্ষা যেটা প্রথমবার দেখলে একটু অস্বস্তি লাগে। নিচের বক্সে
                ORDER BY ছাড়া প্রথম পাঁচটা Booking চাওয়া হয়েছে, দুইবার। মাঝখানে একটা
                UPDATE চলে যেটা আসলে কিছুই বদলায় না: booking 2 এর status কে তার নিজের
                মানেই আবার বসায়। শেষে ROLLBACK, তাই Database আগের মতোই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                Run চাপুন আর দুই ফলাফল মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, আলাদা উত্তর"
              query={`SELECT booking_id FROM bookings LIMIT 5;

BEGIN;
UPDATE bookings SET status = status WHERE booking_id = 2;
SELECT booking_id FROM bookings LIMIT 5;
ROLLBACK;`}
              caption="প্রথমবার আসে 1, 2, 3, 4, 5। Data তে কিছুই না বদলানো একটা UPDATE এর পর একই Query দেয় 1, 3, 4, 5, 6: booking 2 উধাও। ROLLBACK এর পর Database আগের মতো, কিন্তু শিক্ষাটা থেকে যায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                কী হলো? ORDER BY না দিলে Database Row গুলো দেয় যে ক্রমে তার হাতে পড়ে,
                সাধারণত Disk এ যেভাবে রাখা আছে সেভাবে। PostgreSQL এ একটা UPDATE পুরনো Row
                বদলায় না, Row এর একটা নতুন Version লেখে, প্রায়ই অন্য জায়গায়। তাই booking 2
                এর নতুন Version চলে গেল তালিকার শেষে, আর প্রথম পাঁচের জায়গা নিল booking 6।
                Data তে কোনো তফাত নেই, শুধু ক্রমটা বদলে গেছে। Disk এ Row কীভাবে বসে, সেটা
                Module 13 এর{" "}
                <Link href="/sql/topic/how-rows-are-stored" className={LINK}>
                  How Rows Sit on Disk
                </Link>{" "}
                লেসনে বিস্তারিত দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর Docs এ এই নিয়মটা খুব সোজা ভাষায় লেখা: LIMIT ব্যবহার করলে
                এমন একটা ORDER BY দিন যেটা Row গুলোকে একটা অনন্য ক্রমে সাজায়, নইলে Query
                এর Row গুলোর একটা অনুমান করা যায় না এমন অংশ পাবেন। Docs আরও বলে, এটা কোনো
                Bug না। SQL কখনো কথা দেয় না যে ORDER BY ছাড়া Row কোনো নির্দিষ্ট ক্রমে আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আপনার মেশিনে আজ ঠিক দেখাচ্ছে, তাই ঠিক আছে: এই ভাবনাটাই বিপদ",
          content: (
            <ContentParagraph>
              ছোট Table এ, নতুন Load করা Database এ, ORDER BY ছাড়াও Row প্রায়ই ঢোকানোর
              ক্রমেই আসে। তাই Development এ সব ঠিক দেখায়। Production এ মাসের পর মাস UPDATE,
              DELETE আর Vacuum চলার পর একই Query হঠাৎ অন্য Row দিতে শুরু করে, কেউ কোড
              বদলায়নি তবু। নিয়মটা তাই নিঃশর্ত: LIMIT লিখলে আগে ORDER BY।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "top-n",
      subHeader: { index: "004", title: "Top-N" },
      title: <SectionTitle>সেরা কয়েকটা: Top-N Query</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ORDER BY আর LIMIT একসাথে মিলে যে Query হয়, তার একটা নাম আছে: Top-N Query।
                সবচেয়ে দামি তিনটা, সবচেয়ে নতুন দশটা, সবচেয়ে বেশি সিটের পাঁচটা। প্রায় প্রতিটা
                Dashboard এর অর্ধেক কার্ড আসলে একটা Top-N Query। রেসিপিটা সবসময় এক:
              </ContentParagraph>
              <ContentList>
                <ListItem>যেটা দিয়ে সেরা মাপবেন, সেটা দিয়ে ORDER BY।</ListItem>
                <ListItem>
                  বড় আগে চাইলে DESC (Descending, বড় থেকে ছোট), ছোট আগে চাইলে কিছু না লেখা বা
                  ASC। সাজানোর পুরো খুঁটিনাটি আগের লেসন{" "}
                  <Link href="/sql/topic/order-by" className={LINK}>
                    ORDER BY
                  </Link>{" "}
                  তে।
                </ListItem>
                <ListItem>শেষে LIMIT N।</ListItem>
              </ContentList>
              <ContentParagraph>
                এবার নিজে লিখুন। নিচের বক্সে Query নেই, শুধু কাজটা দেওয়া। লিখে Check চাপুন:
                পাতাটা আপনার Query আর লুকানো সমাধান দুটোই চালিয়ে ফলাফল মেলাবে। আটকে গেলে
                Hint দেখুন।
              </ContentParagraph>
            </div>
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
                  সবচেয়ে দামি তিনটা ট্যুরের <code className={CODE}>title</code> আর{" "}
                  <code className={CODE}>price_bdt</code> দেখান, সবচেয়ে দামিটা আগে।
                </>
              }
              hint={
                <>
                  দামি আগে মানে <code className={CODE}>ORDER BY price_bdt DESC</code>, তারপর{" "}
                  <code className={CODE}>LIMIT 3</code>।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt DESC
LIMIT 3;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              উত্তরে প্রথমেই আসবে Saint Martin Luxury Stay, 32000.00 টাকা। কিন্তু এই ট্যুরটা
              বন্ধ, তার is_active হলো false। Admin এর Report এ এটা থাকা ঠিক আছে, কিন্তু
              Website এর হোম পেজে সবচেয়ে দামি ট্যুর হিসেবে বন্ধ একটা ট্যুর দেখালে Customer
              ক্লিক করে হতাশ হবেন। Top-N Query এর আগে তাই সবসময় জিজ্ঞেস করুন, কোন Row গুলো
              প্রতিযোগিতায় আছে? Website এর জন্য সঠিক Query তে{" "}
              <code className={CODE}>WHERE is_active</code> লাগবে। এই ফাঁদটা Sample Data তে
              ইচ্ছা করে রাখা।
            </ContentParagraph>
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
                  Admin Panel এর জন্য সবচেয়ে নতুন তিনটা Booking এর{" "}
                  <code className={CODE}>booking_id</code> আর{" "}
                  <code className={CODE}>booked_at</code> দেখান, নতুনটা আগে।
                </>
              }
              hint={
                <>
                  কোনটা নতুন, সেটা বলে <code className={CODE}>booked_at</code>, booking_id না।
                  নতুন আগে মানে DESC।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC
LIMIT 3;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নতুন মানে বড় ID? সবসময় না",
          content: (
            <ContentParagraph>
              অনেকে নতুন Booking পেতে ORDER BY booking_id DESC লেখেন, কারণ ID সাধারণত
              বাড়তেই থাকে। এই Data তে সেটা ভুল উত্তর দেয় না, প্রথম তিনটা 24, 23, 22 দুইভাবেই।
              কিন্তু একটু নিচে নামলেই তফাত: সময় অনুযায়ী 17 আসে 19 এর আগে, আর 12 বসে 7 এর
              আগে। ID হলো ঢোকানোর ক্রম, সময় না। পুরনো Data Import করলে, অথবা একটা Booking
              আগের তারিখে বসালে, দুটো আলাদা হয়ে যায়। যা জানতে চান, সেই Column দিয়েই সাজান।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "offset",
      subHeader: { index: "005", title: "OFFSET" },
      title: <SectionTitle>OFFSET: প্রথম কয়েকটা বাদ দিয়ে শুরু</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                LIMIT বলে কতগুলো নেবেন। OFFSET বলে নেওয়ার আগে কতগুলো বাদ দেবেন। একটা
                বইয়ের কথা ভাবুন: OFFSET 40 মানে প্রথম চল্লিশ পাতা উল্টে যাওয়া, LIMIT 10
                মানে তারপর দশ পাতা পড়া। দুটো একসাথে থাকলে আগে OFFSET এর Row গুলো বাদ যায়,
                তারপর LIMIT গোনা শুরু হয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে Sample Database এর আসল Booking গুলো নতুন থেকে পুরনো ক্রমে।
                OFFSET 5 প্রথম পাঁচটা ফেলে দেয়, LIMIT 5 পরের পাঁচটা দেয়। এটাই পাতা ২, যদি
                প্রতি পাতায় ৫টা থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LimitWindowDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="তিন পাতায় সব ট্যুর"
              query={`-- পাতা ১
SELECT title, price_bdt FROM tours ORDER BY price_bdt LIMIT 3 OFFSET 0;
-- পাতা ২
SELECT title, price_bdt FROM tours ORDER BY price_bdt LIMIT 3 OFFSET 3;
-- পাতা ৩
SELECT title, price_bdt FROM tours ORDER BY price_bdt LIMIT 3 OFFSET 6;`}
              caption="তিনটা ফলাফল মিলিয়ে ৯টা ট্যুরই এসেছে, প্রতিটা একবার করে, দামের ক্রমে। OFFSET 0 লেখা আর OFFSET না লেখা একই কথা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>OFFSET এর কিনারাগুলো:</ContentParagraph>
              <ContentList>
                <ListItem>
                  Row এর চেয়ে বড় OFFSET দিলে Error আসে না, আসে শূন্য Row।{" "}
                  <code className={CODE}>LIMIT 5 OFFSET 20</code> tours এ চালালে (0 rows),
                  কারণ ৯টার পর আর কিছু নেই। অ্যাপে এটাই খালি পাতা।
                </ListItem>
                <ListItem>
                  PostgreSQL এ LIMIT ছাড়া শুধু OFFSET ও চলে: বাকি সবগুলো দেয়।{" "}
                  <code className={CODE}>ORDER BY price_bdt OFFSET 6</code> দেয় সবচেয়ে দামি
                  তিনটা। MySQL এ এটা চলে না, সেটা সামনে MySQL অংশে।
                </ListItem>
                <ListItem>
                  ঋণাত্মক OFFSET চলে না। PostgreSQL বলে{" "}
                  <code className={CODE}>ERROR: OFFSET must not be negative</code>। কোডে পাতার
                  নম্বর 0 বা তার কম এলে এই Error টা দেখবেন, তাই পাতার নম্বর আগেই যাচাই করুন।
                </ListItem>
              </ContentList>
            </div>
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
                  দামের ক্রমে সাজালে চতুর্থ আর পঞ্চম সস্তা ট্যুর কোনগুলো?{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code>,
                  সস্তাটা আগে।
                </>
              }
              hint={
                <>
                  প্রথম তিনটা বাদ, তারপর দুটো: <code className={CODE}>LIMIT 2 OFFSET 3</code>।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt
LIMIT 2 OFFSET 3;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "page-math",
      subHeader: { index: "006", title: "Page Math" },
      title: <SectionTitle>পাতার নম্বর থেকে OFFSET: একটা ছোট অঙ্ক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                মানুষ পাতা গোনেন ১ থেকে: পাতা ১, পাতা ২, পাতা ৩। Database এর OFFSET গোনে ০
                থেকে: কতগুলো বাদ দেবে। দুটোর মাঝখানের সেতু একটা ছোট সূত্র। পাতার আকার
                (প্রতি পাতায় কতগুলো Row) যদি s হয় আর পাতার নম্বর p হয়, তাহলে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>LIMIT</strong> = s
                </ListItem>
                <ListItem>
                  <strong>OFFSET</strong> = (p থেকে ১ বাদ) গুণ s। পাতা ১ এ ০, পাতা ২ এ s,
                  পাতা ৩ এ ২s।
                </ListItem>
                <ListItem>
                  <strong>মোট পাতা</strong> = মোট Row কে s দিয়ে ভাগ করে উপরের দিকে গোল করা।
                  ২৪টা Booking, প্রতি পাতায় ৫টা হলে ২৪ ভাগ ৫ = ৪.৮, গোল করে ৫ পাতা। শেষ পাতায়
                  থাকবে ৪টা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ পাতার আকার আর পাতা বদলে দেখুন OFFSET কীভাবে বদলায়, আর ২৪টা
                Booking এর কোনগুলো সেই পাতায় পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PageMathLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="মোট পাতা, আর শেষ পাতা"
              query={`SELECT count(*) AS total_bookings,
       ceil(count(*) / 5.0) AS total_pages
FROM bookings;

-- পাতা ৫, প্রতি পাতায় ৫টা: OFFSET = (5 থেকে 1 বাদ) গুণ 5 = 20
SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5 OFFSET 20;`}
              caption="প্রথম ফলাফল: 24টা Booking, 5টা পাতা। ceil মানে উপরের দিকে গোল করা, আর 5.0 লিখেছি যাতে ভাগটা দশমিকে হয় (পূর্ণসংখ্যার ভাগের ফাঁদ Module 04 এ)। দ্বিতীয় ফলাফল শেষ পাতা: 5, 4, 2, 1, মাত্র চারটা Row।"
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
                  Customer তালিকা <code className={CODE}>customer_id</code> এর ক্রমে, প্রতি
                  পাতায় ৪ জন। পাতা ৩ এর <code className={CODE}>customer_id</code> আর{" "}
                  <code className={CODE}>full_name</code> দেখান।
                </>
              }
              hint={
                <>
                  OFFSET = (৩ থেকে ১ বাদ) গুণ ৪ = ৮। তাই <code className={CODE}>LIMIT 4 OFFSET 8</code>।
                </>
              }
              solution={`SELECT customer_id, full_name
FROM customers
ORDER BY customer_id
LIMIT 4 OFFSET 8;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবচেয়ে চেনা Bug: এক পাতা বাদ পড়ে যাওয়া",
          content: (
            <ContentParagraph>
              OFFSET = p গুণ s লিখে ফেলা খুব সাধারণ ভুল। তখন পাতা ১ চাইলে আসে আসলে পাতা ২,
              আর প্রথম পাতাটা কেউ কখনো দেখে না। Test করার সহজ উপায়: পাতা ১ এর প্রথম Row টা
              কি পুরো তালিকারও প্রথম Row? না হলে সূত্রে গোলমাল।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "fetch-first",
      subHeader: { index: "007", title: "FETCH FIRST" },
      title: <SectionTitle>Standard এর ভাষায়: OFFSET ... FETCH FIRST</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা মজার তথ্য: LIMIT আসলে SQL Standard এর অংশ না। PostgreSQL, MySQL আর
                SQLite এটা বোঝে বলে এটা সবচেয়ে চালু, কিন্তু Standard এ একই কাজের জন্য আলাদা
                লেখা আছে। PostgreSQL এর Docs বলে, SQL:2008 এই রূপটা এনেছে, আর PostgreSQL
                এটাও বোঝে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={CODE}>FETCH FIRST 3 ROWS ONLY</code> মানে LIMIT 3।
                </ListItem>
                <ListItem>
                  <code className={CODE}>OFFSET 3 ROWS FETCH NEXT 2 ROWS ONLY</code> মানে LIMIT 2
                  OFFSET 3।
                </ListItem>
                <ListItem>
                  FIRST আর NEXT, ROW আর ROWS একই মানে বহন করে। Docs এর ভাষায় এগুলো শুধু পড়তে
                  সুবিধার শব্দ। সংখ্যা না দিলে ধরা হয় ১: FETCH FIRST ROW ONLY মানে একটা Row।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কেন এটা জানবেন? কারণ SQL Server আর Oracle এর মতো Database এ LIMIT এর বদলে এই
                রূপটাই চলে (Module 21 এ বিস্তারিত), আর পুরনো কোডে বা অন্যের লেখা Query তে এটা
                দেখবেন। আর এর একটা ক্ষমতা আছে যেটা LIMIT এর নেই: WITH TIES।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই কাজ, Standard এর লেখায়"
              query={`SELECT title, price_bdt
FROM tours
ORDER BY price_bdt DESC
OFFSET 3 ROWS FETCH NEXT 2 ROWS ONLY;

SELECT booking_id, seats
FROM bookings
ORDER BY seats DESC
FETCH FIRST 2 ROWS WITH TIES;`}
              caption="প্রথমটা দেয় Bandarban Hill Trek 14000.00 আর Saint Martin Island Escape 12500.00, যেটা LIMIT 2 OFFSET 3 দিত। দ্বিতীয়টা চেয়েছে ২টা, পেয়েছে ৩টা: 23 (5 সিট), তারপর 2 আর 14 (দুটোই 4 সিট)। শেষ জায়গার জন্য টাই হলে WITH TIES সবাইকে রাখে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              WITH TIES এর একটা শর্ত: ORDER BY লাগবেই, কারণ টাই বোঝা যায় শুধু সাজানো থেকে।
              ORDER BY ছাড়া লিখলে PostgreSQL থামিয়ে দেয়:{" "}
              <code className={CODE}>ERROR: WITH TIES cannot be specified without ORDER BY clause</code>।
              পুরস্কারের তালিকা বানাতে এটা খুব কাজের: যদি দুইজন সমান নম্বরে তৃতীয় হন, দুজনকেই
              তৃতীয় দেখানো ন্যায্য, একজনকে এলোমেলো বাদ দেওয়া না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "ties",
      subHeader: { index: "008", title: "Ties" },
      title: <SectionTitle>সমান মানের Row: কে আগে, কে পরে?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ORDER BY দিলেই কি সব সমস্যা শেষ? প্রায়। বাকি থাকে একটা সূক্ষ্ম ফাঁদ: যে
                Column দিয়ে সাজাচ্ছেন, তাতে যদি একই মান কয়েকটা Row এ থাকে, তাদের নিজেদের
                মধ্যে ক্রম কী হবে? উত্তর: কোনো নির্দিষ্ট ক্রম নেই। Database যেভাবে সুবিধা
                মনে করে সেভাবে দেয়, আর সেই সুবিধা LIMIT এর সংখ্যার উপরও নির্ভর করে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে এটা নিজের চোখে দেখুন। bookings এ 4 সিটের Booking দুটো, booking 2
                আর booking 14। সিট অনুযায়ী সাজিয়ে একবার প্রথম ২টা চাওয়া হয়েছে, একবার প্রথম
                ৪টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="LIMIT বদলালে টাই এর ক্রম বদলায়"
              query={`SELECT booking_id, seats FROM bookings ORDER BY seats DESC LIMIT 2;

SELECT booking_id, seats FROM bookings ORDER BY seats DESC LIMIT 4;

-- টাই ভাঙার জন্য একটা অনন্য Column
SELECT booking_id, seats FROM bookings ORDER BY seats DESC, booking_id LIMIT 4;`}
              caption="LIMIT 2 বলে দ্বিতীয় জন booking 2। LIMIT 4 এ booking 14 আসে booking 2 এর আগে। একই ORDER BY, একই Data, তবু ক্রম আলাদা। শেষ Query তে booking_id দিয়ে টাই ভাঙা হয়েছে, তাই এখন 2 সবসময় 14 এর আগে, যত Row ই চান।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এটা PostgreSQL এর খামখেয়ালি না। PostgreSQL এর Docs বলে, Query Planner LIMIT কে
                হিসাবে ধরে Plan বানায়, তাই আলাদা LIMIT এ আলাদা Plan আর আলাদা ক্রম আসতে পারে।
                MySQL এর Docs ও প্রায় একই কথা বলে: ORDER BY এর Column এ একই মানের কয়েকটা
                Row থাকলে Server সেগুলো যেকোনো ক্রমে দিতে পারে, আর Plan অনুযায়ী আলাদাভাবেও
                দিতে পারে। মজার ব্যাপার, একই Data তে MySQL 8.4 এ চালিয়ে দেখা গেছে LIMIT 2
                দেয় booking 14, অর্থাৎ PostgreSQL এর উল্টো।
              </ContentParagraph>
              <ContentParagraph>
                পাতা ভাগের সময় এটা আসল Bug হয়ে দাঁড়ায়। পাতা ১ আর পাতা ২ আলাদা Query, আলাদা
                OFFSET। টাই থাকলে একই Row দুই পাতাতেই আসতে পারে, অথবা কোনো পাতাতেই না।
                সমাধান একটাই: ORDER BY এর শেষে এমন একটা Column যোগ করুন যার মান প্রতিটা Row এ
                আলাদা, সাধারণত Primary Key। একে বলে Tie-breaker।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlExercise
              title="Exercise 5"
              task={
                <>
                  সিটের হিসাবে সেরা দুই স্থানের সব Booking দেখান, টাই হলে সবাইকে রেখে।{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>seats</code>।
                  এখানে ক্রম বিচার হবে না।
                </>
              }
              hint={
                <>
                  ঠিক এই কাজের জন্যই <code className={CODE}>FETCH FIRST 2 ROWS WITH TIES</code>।
                  ORDER BY seats DESC ভুলবেন না।
                </>
              }
              solution={`SELECT booking_id, seats
FROM bookings
ORDER BY seats DESC
FETCH FIRST 2 ROWS WITH TIES;`}
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "offset-cost",
      subHeader: { index: "009", title: "Why OFFSET Slows" },
      title: <SectionTitle>পাতা ১০,০০০: OFFSET কেন হাঁপিয়ে ওঠে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                OFFSET এর একটা লুকানো খরচ আছে, আর PostgreSQL এর Docs সেটা এক লাইনে বলে
                দেয়: OFFSET যে Row গুলো বাদ দেয়, সেগুলোও Server এর ভেতরে হিসাব করতে হয়, তাই
                বড় OFFSET অদক্ষ হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                ব্যাপারটা একটা লাইনে দাঁড়ানোর মতো। আপনাকে বলা হলো লাইনের ৪৫,০০১তম মানুষকে
                ডেকে আনতে। আপনি তাঁর কাছে সরাসরি যেতে পারবেন না, কারণ আপনি জানেন না তিনি
                কোথায়। আপনাকে প্রথম থেকে গুনে গুনে ৪৫,০০০ জন পার হতে হবে। OFFSET 45000 ঠিক
                এই কাজটা করে: সাজানো ক্রমে প্রথম থেকে ৪৫,০০০ Row পড়ে, ফেলে দেয়, তারপর ১০টা
                দেয়। পাতা যত গভীর, গোনা তত লম্বা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OffsetVsKeysetSplit />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OffsetCostLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার আন্দাজ না, আসল প্রমাণ। নিচের বক্স একটা অস্থায়ী Table বানায় ৫০,০০০টা
                বানানো Booking দিয়ে, তার উপর Index বানায়, তারপর একই পাতা দুইভাবে চায়: একবার
                OFFSET 45000 দিয়ে, একবার বুকমার্ক দিয়ে। Query এর আগে EXPLAIN ANALYZE লিখলে
                Database Query টা সত্যিই চালায়, আর ফলাফলের বদলে জানায় ভেতরে সে কী কী করল। এর পুরো পাঠ Module 13
                এর{" "}
                <Link href="/sql/topic/explain-analyze" className={LINK}>
                  EXPLAIN and EXPLAIN ANALYZE
                </Link>{" "}
                লেসনে। আজ শুধু একটা জিনিস দেখুন: Index Only Scan লাইনের actual rows।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="৫০,০০০ Row, একই পাতা, দুই পথ"
              query={`BEGIN;
CREATE TEMP TABLE big_bookings AS
  SELECT g AS booking_id,
         timestamptz '2026-01-01 00:00+06' + g * interval '1 minute' AS booked_at
  FROM generate_series(1, 50000) AS g;
CREATE INDEX ON big_bookings (booked_at DESC, booking_id DESC);
ANALYZE big_bookings;

-- পথ ১: OFFSET
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT booking_id FROM big_bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 10 OFFSET 45000;

-- পথ ২: বুকমার্ক (আগের পাতার শেষ Row ছিল booking 5001)
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT booking_id FROM big_bookings
WHERE (booked_at, booking_id) <
      (timestamptz '2026-01-01 00:00+06' + 5001 * interval '1 minute', 5001)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 10;
ROLLBACK;`}
              caption="প্রথম Plan এ Index Only Scan এর actual rows=45010.00: দশটা দিতে পঁয়তাল্লিশ হাজার দশটা Row ছুঁতে হয়েছে। দ্বিতীয় Plan এ actual rows=10.00। দুই পথই একই দশটা Row দেয়, booking 5000 থেকে 4991। শেষে ROLLBACK, তাই অস্থায়ী Table টাও চলে যায়। প্রথমবার চালাতে কয়েক সেকেন্ড লাগতে পারে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "তাহলে কি OFFSET খারাপ?",
          content: (
            <ContentParagraph>
              না। ছোট তালিকায়, যেখানে মানুষ খুব বেশি হলে দশ বিশ পাতা যান, OFFSET সহজ আর
              যথেষ্ট দ্রুত। Island Tours এর ৯টা ট্যুরের তালিকায় OFFSET নিয়ে চিন্তার কিছুই নেই।
              সমস্যা শুরু হয় তখন, যখন তালিকা লাখ ছাড়ায় আর কেউ (প্রায়ই একটা Bot বা Export
              Script) গভীর পাতায় যায়। তখন দরকার পরের অংশের পদ্ধতি।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "shifting-rows",
      subHeader: { index: "010", title: "Shifting Rows" },
      title: <SectionTitle>দুই পাতার মাঝখানে নতুন Booking এলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                OFFSET এর দ্বিতীয় সমস্যাটা গতির না, সঠিকতার। পাতা ১ আর পাতা ২ দুটো আলাদা
                সময়ে চলা দুটো আলাদা Query। মাঝখানে Database বদলাতে পারে, আর ব্যস্ত অ্যাপে
                বদলায়ও। ধরুন Admin পাতা ১ দেখলেন, পড়তে এক মিনিট লাগল, এর মধ্যে একজন নতুন
                Customer বুক করলেন। নতুন Booking টা সবচেয়ে নতুন, তাই সে তালিকার মাথায় বসল আর
                বাকি সবাইকে এক ঘর নিচে ঠেলে দিল। এবার পাতা ২ মানে OFFSET 5, আর পাঁচ নম্বর
                জায়গায় এখন বসে আছে পাতা ১ এর শেষ Row টা। Admin একই Booking দুইবার দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                উল্টোটাও ঘটে। মাঝখানে একটা Booking মুছে গেলে সবাই এক ঘর উপরে ওঠে, আর একটা Row
                পাতা ২ থেকে পাতা ১ এ চলে যায়, যেটা Admin আগেই দেখে ফেলেছেন। সেই Row টা তিনি
                কখনো দেখবেন না। Lab এ দুটোই চালিয়ে দেখুন, তারপর Keyset এ বদলে আবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ShiftingPagesLab />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আসল Data তে একই ঘটনা"
              query={`-- পাতা ১, Admin দেখছেন
SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;

BEGIN;
-- এর মধ্যে Imran Kabir প্রথমবার বুক করলেন
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
VALUES (15, 10, 1, 'pending', 8500.00, '2026-10-15 09:00+06');

-- পাতা ২, OFFSET দিয়ে
SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5 OFFSET 5;

-- পাতা ২, বুকমার্ক দিয়ে (পাতা ১ এর শেষ Row: booking 20)
SELECT booking_id, booked_at
FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;
ROLLBACK;`}
              caption="পাতা ১: 24, 23, 22, 21, 20। নতুন Booking এর পর OFFSET এর পাতা ২ শুরু হয় 20 দিয়ে, যেটা পাতা ১ এ ছিল। বুকমার্কের পাতা ২ দেয় 17, 19, 16, 14, 18, কোনো পুনরাবৃত্তি নেই। শেষে ROLLBACK, তাই Data আগের মতো। তবে নতুন Booking এর নম্বর 25 খরচ হয়ে গেছে, এই পাতায় পরে কোনো INSERT চালালে সে পাবে 26।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "keyset",
      subHeader: { index: "011", title: "Keyset Pagination" },
      title: <SectionTitle>বুকমার্ক রেখে পড়া: Keyset Pagination</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুটো সমস্যারই সমাধান একটা পুরনো অভ্যাসে লুকিয়ে আছে। বই পড়া থামালে আপনি মনে
                রাখেন না যে ১৪৭ পাতা পড়েছেন, আপনি একটা বুকমার্ক রাখেন। পরের দিন বুকমার্কের
                জায়গা থেকে শুরু করেন। মাঝখানে কেউ বইয়ের শুরুতে দুটো পাতা যোগ করে দিলেও আপনার
                বুকমার্ক ঠিক জায়গাতেই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                Keyset Pagination ঠিক এটা করে। পাতা ২ চাওয়ার সময় কতগুলো বাদ দেবেন না বলে,
                বলে দেয় পাতা ১ এর শেষ Row টা কোনটা ছিল, আর তার পরের Row গুলো চায়। এর আরেক নাম
                Cursor Pagination, আর বুকমার্কটাকে বলে Cursor। Slack এর Web API আর Facebook এর
                Graph API এর মতো বড় API গুলো তাদের Docs এ এই পদ্ধতিকেই Cursor-based Pagination
                বলে, আর Slack এর উত্তরে next_cursor নামে একটা ঘরই থাকে।
              </ContentParagraph>
              <ContentParagraph>
                আমাদের তালিকা সাজানো booked_at DESC, booking_id DESC দিয়ে। পাতা ১ এর শেষ Row
                booking 20, সময় 2026-10-10 17:20:00+06। তাহলে পাতা ২ মানে: এই দুই মানের জোড়ার
                চেয়ে ছোট সব Row, একই ক্রমে, প্রথম ৫টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "keyset-page-2.sql",
          code: `SELECT booking_id, booked_at
FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নতুন জিনিস একটাই: বন্ধনীর ভেতরে দুটো মান একসাথে, যাকে বলে Row Value বা Row
                Constructor। দুটো জোড়ার তুলনা হয় অভিধানে শব্দ সাজানোর মতো। আগে প্রথম অংশ
                মেলানো হয়। সেটা আলাদা হলে রায় সেখানেই। সমান হলে তবেই দ্বিতীয় অংশ দেখা হয়।
                PostgreSQL এর Docs এর ভাষায়, উপাদানগুলো বাম থেকে ডানে তুলনা হয়, প্রথম অসমান
                জোড়ায় গিয়ে থামে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <RowCompareDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>Keyset এর চারটা নিয়ম, যেগুলো ভাঙলে সে ভুল উত্তর দেয়:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ক্রম অনন্য হতে হবে।</strong> শেষে একটা অনন্য Column (এখানে booking_id)
                  না থাকলে একই সময়ের দুটো Row এর একটা বুকমার্কের ফাঁক গলে হারিয়ে যেতে পারে।
                </ListItem>
                <ListItem>
                  <strong>তুলনার দিক আর সাজানোর দিক মিলতে হবে।</strong> DESC দিয়ে সাজালে পরের
                  পাতা মানে ছোট মান, তাই <code className={CODE}>&lt;</code>। ASC দিয়ে সাজালে{" "}
                  <code className={CODE}>&gt;</code>।
                </ListItem>
                <ListItem>
                  <strong>WHERE আর ORDER BY এ একই Column, একই ক্রমে।</strong> একটায় booked_at,
                  booking_id আর অন্যটায় উল্টো লিখলে বুকমার্ক ভুল জায়গায় পড়ে।
                </ListItem>
                <ListItem>
                  <strong>সব Column এক দিকে সাজাতে হবে।</strong> একটা DESC আর অন্যটা ASC হলে Row
                  Value এর তুলনা খাটে না। তখন লম্বা রূপটা লিখতে হয়:{" "}
                  <code className={CODE}>
                    booked_at &lt; x OR (booked_at = x AND booking_id &gt; y)
                  </code>
                  । এই লেসনের তালিকায় দুটোই DESC, তাই ছোট রূপটাই চলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="বুকমার্ক ধরে পাতা ২ আর পাতা ৩"
              query={`-- পাতা ২: পাতা ১ এর শেষ ছিল booking 20
SELECT booking_id, booked_at
FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;

-- পাতা ৩: পাতা ২ এর শেষ ছিল booking 18
SELECT booking_id, booked_at
FROM bookings
WHERE (booked_at, booking_id) < ('2026-09-28 23:30:00+06', 18)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;`}
              caption="পাতা ২: 17, 19, 16, 14, 18। পাতা ৩: 15, 13, 11, 10, 9। প্রতিটা পাতার শেষ Row টাই পরের পাতার বুকমার্ক। OFFSET 5 আর OFFSET 10 ঠিক এই Row গুলোই দিত, যতক্ষণ না মাঝখানে কিছু বদলায়।"
            />
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
                  Booking তালিকা নতুন থেকে পুরনো (<code className={CODE}>booked_at DESC, booking_id DESC</code>),
                  প্রতি পাতায় ৫টা। পাতা ৩ এর শেষ Row ছিল booking 9, সময়{" "}
                  <code className={CODE}>2026-03-01 16:35:00+06</code>। বুকমার্ক দিয়ে পাতা ৪ এর{" "}
                  <code className={CODE}>booking_id</code> আর <code className={CODE}>booked_at</code>{" "}
                  আনুন।
                </>
              }
              hint={
                <>
                  উপরের বক্সের Query টাই, শুধু বুকমার্কের মান বদলে{" "}
                  <code className={CODE}>(&apos;2026-03-01 16:35:00+06&apos;, 9)</code>। OFFSET দিয়েও একই
                  উত্তর আসবে, কিন্তু অনুশীলনটা বুকমার্কের।
                </>
              }
              solution={`SELECT booking_id, booked_at
FROM bookings
WHERE (booked_at, booking_id) < ('2026-03-01 16:35:00+06', 9)
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Keyset এর দাম: পাতা ৭ এ লাফ দেওয়া যায় না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                বুকমার্ক থাকে শুধু সেই পাতার, যেটা আপনি দেখেছেন। তাই Keyset এ পরের আর আগের
                পাতায় যাওয়া সহজ, কিন্তু সরাসরি পাতা ৭ এ লাফ দেওয়া যায় না, কারণ পাতা ৬ এর শেষ
                Row কোনটা, সেটা কেউ জানে না। এই কারণেই Feed আর Infinite Scroll এ Keyset চলে,
                আর যেখানে পাতার নম্বরের সারি দেখাতে হয় (১ ২ ৩ ... ১০), সেখানে প্রায়ই OFFSET।
              </ContentParagraph>
              <ContentParagraph>
                দ্রুত চলার জন্য Keyset এর আরেকটা শর্ত আছে: সাজানোর Column গুলোতে একটা Index,
                এখানে (booked_at, booking_id) এর উপর। Index ছাড়াও উত্তর সঠিক আসে, শুধু গতির
                সুবিধাটা হারায়। Index এর পুরো গল্প Module 13 এর{" "}
                <Link href="/sql/topic/composite-indexes" className={LINK}>
                  Composite Indexes and Column Order
                </Link>{" "}
                লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "api-cursor",
      subHeader: { index: "012", title: "API Cursor" },
      title: <SectionTitle>অ্যাপের ভেতরে: next_cursor আর has_more</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Database এ Keyset শিখলেন। কিন্তু Browser তো সরাসরি SQL চালায় না, চালায় API
                (Module 01 এর{" "}
                <Link href="/sql/topic/app-database-conversation" className={LINK}>
                  How an App Talks to a Database
                </Link>{" "}
                মনে করুন)। তাহলে বুকমার্কটা Browser আর API এর মধ্যে কীভাবে ঘোরে? একটা সাধারণ
                নকশা, যেটা অনেক API তে দেখবেন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Browser প্রথমবার চায় <code className={CODE}>GET /api/bookings?limit=5</code>,
                  কোনো Cursor ছাড়া।
                </ListItem>
                <ListItem>
                  API Database কে চায় ৫টা না, <strong>৬টা</strong> Row। ষষ্ঠ Row টা এলে বোঝা
                  যায় আরও পাতা আছে, তখন has_more হয় true। ষষ্ঠটা Browser এ পাঠানো হয় না।
                </ListItem>
                <ListItem>
                  পঞ্চম Row এর (booked_at, booking_id) দিয়ে API বানায় next_cursor, সাধারণত একটা
                  Encode করা লেখা, যাতে Browser এর কাছে সেটা শুধু একটা চাবি, ভেতরের মান না।
                </ListItem>
                <ListItem>
                  পরের পাতার জন্য Browser পাঠায়{" "}
                  <code className={CODE}>GET /api/bookings?limit=5&amp;cursor=...</code>, API Cursor
                  খুলে মান দুটো বের করে আর Keyset Query চালায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "api-bookings-page.sql",
          code: `-- API এর ভেতরের Query। $1, $2, $3 হলো Parameter:
-- মানগুলো Query এর লেখার সাথে জোড়া হয় না, আলাদা পাঠানো হয়।
-- $1 = cursor এর booked_at, $2 = cursor এর booking_id, $3 = limit + 1
SELECT booking_id, customer_id, seats, status, booked_at
FROM bookings
WHERE ($1::timestamptz IS NULL OR (booked_at, booking_id) < ($1, $2))
ORDER BY booked_at DESC, booking_id DESC
LIMIT $3;`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "json",
          filename: "GET /api/bookings?limit=5",
          code: `{
  "items": [
    { "booking_id": 24, "booked_at": "2026-10-14T11:05:00+06:00" },
    { "booking_id": 23, "booked_at": "2026-10-13T20:55:00+06:00" },
    { "booking_id": 22, "booked_at": "2026-10-12T08:30:00+06:00" },
    { "booking_id": 21, "booked_at": "2026-10-11T18:00:00+06:00" },
    { "booking_id": 20, "booked_at": "2026-10-10T17:20:00+06:00" }
  ],
  "has_more": true,
  "next_cursor": "<পঞ্চম Row এর booked_at আর booking_id, Encode করা>"
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম পাতায় কোনো Cursor নেই, তাই $1 হয় NULL আর WHERE এর শর্ত পুরোটা সত্য হয়ে
              যায়। পরের পাতাগুলোতে $1 আর $2 এ বুকমার্কের মান বসে। একই Query সব পাতা সামলায়।
              Node.js থেকে এই Query আসলে কীভাবে পাঠানো হয়, সেটা Module 17 এর{" "}
              <Link href="/sql/topic/node-pg" className={LINK}>
                Node.js with pg
              </Link>{" "}
              লেসনে।
            </ContentParagraph>
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
                  API প্রথম পাতা চাইছে, পাতার আকার ৫, আর has_more জানার জন্য একটা Row বেশি।
                  নতুন থেকে পুরনো ক্রমে (<code className={CODE}>booked_at DESC, booking_id DESC</code>)
                  শুধু <code className={CODE}>booking_id</code> আনুন।
                </>
              }
              hint={<>পাতার আকার ৫, তাই LIMIT ৫ যোগ ১ = ৬।</>}
              solution={`SELECT booking_id
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 6;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Cursor হলো বাইরের লেখা, বিশ্বাস করবেন না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                Cursor আসে Browser থেকে, অর্থাৎ যে কেউ সেটা বদলে পাঠাতে পারেন। তাই দুটো নিয়ম
                কখনো ভাঙবেন না। এক, Cursor এর মান Query এর লেখার সাথে জোড়া দেবেন না, সবসময়
                Parameter হিসেবে পাঠাবেন। জোড়া দিলে সেটা SQL Injection এর দরজা, যার পুরো গল্প
                Module 16 এর{" "}
                <Link href="/sql/topic/sql-injection" className={LINK}>
                  SQL Injection and Parameterized Queries
                </Link>{" "}
                লেসনে। দুই, খোলার পর মান দুটোর আকার যাচাই করুন: সময়টা সত্যিই একটা সময় তো,
                ID টা সত্যিই একটা সংখ্যা তো।
              </ContentParagraph>
              <ContentParagraph>
                আর limit এর মানও বাইরে থেকে আসে। কেউ limit=1000000 পাঠালে পুরো Table এক
                Request এ চলে যাবে। তাই API একটা সর্বোচ্চ সীমা রাখে, Config এ লেখা একটা মান,
                আর তার বেশি চাইলে সেই সীমাই ব্যবহার করে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "mysql",
      subHeader: { index: "013", title: "In MySQL" },
      title: <SectionTitle>MySQL এ পাতা ভাগ: প্রায় এক, কয়েকটা ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                MySQL দিয়ে কোনো কোর্স ফলো করলে LIMIT এর একটা দ্বিতীয় রূপ দেখবেন, যেটা
                PostgreSQL এ নেই: কমা দিয়ে দুটো সংখ্যা। এখানে সবচেয়ে বড় ফাঁদ হলো সংখ্যা দুটোর
                ক্রম। MySQL এর Docs অনুযায়ী প্রথম সংখ্যাটা OFFSET, দ্বিতীয়টা কতগুলো। অর্থাৎ{" "}
                <code className={CODE}>LIMIT 3, 2</code> মানে প্রথম ৩টা বাদ দিয়ে ২টা, PostgreSQL এর
                LIMIT 2 OFFSET 3। উল্টো পড়লে ভুল পাতা আসে, আর Error আসে না বলে ধরাও পড়ে না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের সবকিছু MySQL 8.4.11 এ Island Tours এর MySQL ফাইল Load করে চালিয়ে দেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "PostgreSQL", "MySQL 8.4"],
          rows: [
            ["প্রথম ৫টা", "LIMIT 5", "LIMIT 5"],
            ["৩টা বাদ, তারপর ২টা", "LIMIT 2 OFFSET 3", "LIMIT 3, 2 অথবা LIMIT 2 OFFSET 3"],
            ["Standard এর FETCH FIRST", "চলে", "চলে না, ERROR 1064"],
            ["WITH TIES", "চলে", "নেই"],
            ["LIMIT ছাড়া শুধু OFFSET", "চলে, বাকি সব দেয়", "চলে না, ERROR 1064"],
            ["Row Value তুলনা (Keyset)", "(a, b) < (x, y) চলে", "(a, b) < (x, y) চলে"],
            ["টাই এর ক্রম", "অনিশ্চিত", "অনিশ্চিত, আর আলাদাও হতে পারে"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "mysql 8.4: island_tours",
          code: `mysql> SELECT title, price_bdt FROM tours ORDER BY price_bdt DESC LIMIT 3, 2;
+----------------------------+-----------+
| title                      | price_bdt |
+----------------------------+-----------+
| Bandarban Hill Trek        |  14000.00 |
| Saint Martin Island Escape |  12500.00 |
+----------------------------+-----------+

mysql> SELECT title FROM tours ORDER BY price_bdt DESC FETCH FIRST 2 ROWS ONLY;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near
'FETCH FIRST 2 ROWS ONLY' at line 1

mysql> SELECT title FROM tours ORDER BY price_bdt OFFSET 3;
ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'OFFSET 3' at line 1

mysql> SELECT title FROM tours ORDER BY price_bdt LIMIT 6, 18446744073709551615;
+----------------------------+
| title                      |
+----------------------------+
| Cox's Bazar Family Package |
| Sundarbans Mangrove Cruise |
| Saint Martin Luxury Stay   |
+----------------------------+

mysql> SELECT booking_id, seats FROM bookings ORDER BY seats DESC LIMIT 2;
+------------+-------+
| booking_id | seats |
+------------+-------+
|         23 |     5 |
|         14 |     4 |
+------------+-------+`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ OFFSET থেকে শেষ পর্যন্ত",
          content: (
            <ContentParagraph>
              MySQL এ LIMIT ছাড়া OFFSET লেখা যায় না, অথচ মাঝে মাঝে দরকার হয় একটা জায়গা থেকে
              বাকি সব। MySQL এর Docs এর নিজের পরামর্শ: দ্বিতীয় সংখ্যা হিসেবে একটা বিশাল সংখ্যা
              দিন, যেমন 18446744073709551615। উপরের উদাহরণে LIMIT 6, ... দিয়েছে শেষ তিনটা
              ট্যুর। দেখতে অদ্ভুত, কিন্তু এটাই অফিসিয়াল উপায়। আর খেয়াল করুন শেষ উদাহরণটা:
              একই Data তে MySQL LIMIT 2 এ দিয়েছে booking 14, যেখানে PostgreSQL দিয়েছিল 2।
              টাই থাকলে দুই Database দুই উত্তর দিতেই পারে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর চারটা পাতা, চারটা সিদ্ধান্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসনের কৌশলগুলো Island Tours এর কোথায় কোথায় বসে, সেটা দেখলে বোঝা যায় কেন
              একটা পদ্ধতি সব জায়গায় চলে না। প্রতিটা পাতার প্রশ্ন একটাই: তালিকা কত বড়, কত দ্রুত
              বদলায়, আর মানুষ কীভাবে চলাফেরা করেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পাতা", "কী দেখায়", "পদ্ধতি", "কেন"],
          rows: [
            [
              "হোম পেজ: জনপ্রিয় ট্যুর",
              "সবচেয়ে দামি তিনটা চালু ট্যুর",
              "WHERE is_active ... ORDER BY price_bdt DESC LIMIT 3",
              "একটাই পাতা, শুধু Top-N, পাতা ভাগের দরকার নেই",
            ],
            [
              "ট্যুরের তালিকা",
              "সব চালু ট্যুর, পাতার নম্বরসহ",
              "LIMIT আর OFFSET, title দিয়ে টাই ভাঙা",
              "তালিকা ছোট আর কম বদলায়, মানুষ পাতা ৩ এ লাফ দিতে চান",
            ],
            [
              "Admin: সব Booking",
              "নতুন থেকে পুরনো, নিচে নামলে আরও",
              "Keyset, (booked_at, booking_id)",
              "তালিকা দিনে দিনে বাড়ে, নতুন Booking প্রতি মিনিটে আসে",
            ],
            [
              "Customer: আমার Booking",
              "একজন Customer এর সব Booking",
              "সাধারণত পাতা ভাগ ছাড়াই, ORDER BY booked_at DESC",
              "একজনের Booking হাতে গোনা, সব একসাথে দেখানো যায়",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হোম পেজের কার্ড"
              query={`SELECT title, price_bdt, duration_days
FROM tours
WHERE is_active
ORDER BY price_bdt DESC, title
LIMIT 3;`}
              caption="বন্ধ ট্যুরটা বাদ, তাই আসে Sundarbans Mangrove Cruise 18000.00, Cox's Bazar Family Package 15500.00 আর Bandarban Hill Trek 14000.00। title দিয়ে টাই ভাঙা হয়েছে, যাতে কোনোদিন দুটো ট্যুরের দাম এক হলেও কার্ডের ক্রম না নড়ে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার নিজের my-tours এ এখন একটা কাজ করুন: যে তালিকা গুলো আপনার অ্যাপে আছে বা
              থাকবে, প্রতিটার পাশে লিখে রাখুন কোন পদ্ধতি নেবেন আর কেন। Module 17 এ যখন API লিখবেন,
              এই সিদ্ধান্তগুলো সরাসরি কোডে বসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Admin নিচে নামলেন: পরের পাতা আসার পুরো পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "পাতা ১ দেখানো হয়েছে",
              description:
                "API ৬টা Row চেয়ে ৫টা পাঠিয়েছে, সাথে has_more: true আর next_cursor, যার ভেতরে booking 20 এর সময় আর ID।",
            },
            {
              title: "Admin নিচে নামলেন",
              description:
                "Browser দেখে তালিকার শেষ চলে এসেছে। সে next_cursor টা হুবহু ফেরত পাঠায়: GET /api/bookings?limit=5&cursor=...",
            },
            {
              title: "API Cursor খোলে আর যাচাই করে",
              description:
                "ভেতর থেকে বের হয় 2026-10-10 17:20:00+06 আর 20। সময়টা সত্যিই সময়, ID টা সত্যিই সংখ্যা, limit সীমার মধ্যে, তবেই সামনে যায়।",
            },
            {
              title: "Parameter সহ Query",
              description:
                "WHERE (booked_at, booking_id) < ($1, $2) ORDER BY booked_at DESC, booking_id DESC LIMIT 6। মানগুলো আলাদা পাঠানো হয়, Query এর লেখায় জোড়া হয় না।",
            },
            {
              title: "Database বুকমার্কে লাফ দেয়",
              description:
                "(booked_at, booking_id) এর Index থাকলে Database সোজা booking 20 এর ঠিক পরের জায়গায় যায়, আগের কোনো Row ছোঁয় না, আর ৬টা পড়ে থামে।",
            },
            {
              title: "API উত্তর গোছায়",
              description:
                "৬টা এসেছে, তাই has_more: true। প্রথম ৫টা পাঠায় (17, 19, 16, 14, 18), আর পঞ্চমটা, booking 18, থেকে নতুন next_cursor বানায়।",
            },
            {
              title: "Browser তালিকায় জোড়ে",
              description:
                "পুরনো ৫টার নিচে নতুন ৫টা বসে। মাঝখানে কেউ নতুন বুক করলেও কোনো Row দুইবার আসে না, কারণ বুকমার্ক Row এর গায়ে লাগানো, ক্রমিক নম্বরে না।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>পাতা ভাগের চেনা ভুল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখবেন", "সমাধান"],
          rows: [
            [
              "LIMIT আছে, ORDER BY নেই",
              "কোনো কারণ ছাড়াই আজ এক Row, কাল আরেক Row",
              "LIMIT এর আগে সবসময় ORDER BY",
            ],
            [
              "ORDER BY এ শুধু টাই হতে পারে এমন Column",
              "একই Row দুই পাতায়, অথবা কোনো পাতাতেই না",
              "শেষে একটা অনন্য Column, যেমন Primary Key",
            ],
            [
              "OFFSET = পাতা গুণ আকার",
              "পাতা ১ এ আসলে পাতা ২ এর Row, প্রথম পাতা কেউ দেখে না",
              "OFFSET = (পাতা থেকে ১ বাদ) গুণ আকার",
            ],
            [
              "MySQL এর LIMIT 10, 5 কে দশটা ধরা",
              "ভুল পাতা, কোনো Error ছাড়া",
              "কমার রূপে প্রথম সংখ্যা OFFSET, দ্বিতীয়টা কতগুলো",
            ],
            [
              "Infinite Scroll এ OFFSET",
              "নতুন Data এলে Row পুনরাবৃত্তি, গভীরে গেলে ধীর",
              "Keyset Pagination",
            ],
            [
              "DESC সাজিয়ে Keyset এ >",
              "পরের পাতার জায়গায় আগের দিকের Row, বা খালি পাতা",
              "DESC হলে <, ASC হলে >",
            ],
            [
              "Cursor এর মান Query তে জোড়া দেওয়া",
              "SQL Injection এর ঝুঁকি",
              "সবসময় Parameter, আর খোলার পর আকার যাচাই",
            ],
            [
              "Top-N এ বন্ধ বা বাতিল Row ভুলে যাওয়া",
              "হোম পেজে বন্ধ ট্যুর",
              "আগে WHERE দিয়ে প্রতিযোগীদের ঠিক করুন",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>LIMIT and OFFSET</strong>, PostgreSQL এর Docs এর ছোট্ট অধ্যায়। ORDER BY
                ছাড়া LIMIT কেন অনিশ্চিত আর বড় OFFSET কেন অদক্ষ, দুটোই এখানে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/queries-limit.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/queries-limit.html
                </a>
              </ListItem>
              <ListItem>
                <strong>SELECT</strong>, PostgreSQL এর পুরো Reference। LIMIT Clause অংশে FETCH
                FIRST, WITH TIES আর NULL এর আচরণ।{" "}
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
                <strong>Row Constructor Comparison</strong>, Keyset এর পেছনের নিয়ম: বাম থেকে ডানে
                তুলনা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/functions-comparisons.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/functions-comparisons.html
                </a>
              </ListItem>
              <ListItem>
                <strong>We need tool support for keyset pagination</strong>, Markus Winand এর লেখা,
                Use The Index, Luke সাইটে। OFFSET কেন ধীর আর Keyset কেন ভালো, ছবিসহ।{" "}
                <a
                  href="https://use-the-index-luke.com/no-offset"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  use-the-index-luke.com/no-offset
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL SELECT</strong>, MySQL 8.4 এর Docs। কমার রূপের LIMIT, Parameter সহ
                LIMIT আর শেষ পর্যন্ত পড়ার বিশাল সংখ্যার কৌশল।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/select.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/select.html
                </a>
              </ListItem>
              <ListItem>
                <strong>LIMIT Query Optimization</strong>, MySQL 8.4। টাই থাকলে ক্রম কেন অনিশ্চিত,
                MySQL এর নিজের ব্যাখ্যা।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/limit-optimization.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/limit-optimization.html
                </a>
              </ListItem>
              <ListItem>
                <strong>একটা পূর্ণ SQL ভিডিও কোর্স</strong>, MySQL দিয়ে বানানো। LIMIT এর অংশ দেখার
                সময় মনে রাখুন, কমার রূপে প্রথম সংখ্যাটা OFFSET।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
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
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                LIMIT n বলে সর্বোচ্চ কতগুলো Row, OFFSET k বলে শুরুর আগে কতগুলো বাদ। দুটোই চলে
                সবকিছুর শেষে, ORDER BY এর পরে।
              </ListItem>
              <ListItem>
                ORDER BY ছাড়া LIMIT মানে অনিশ্চিত Row। একটা নিরীহ UPDATE ও ক্রম বদলে দিতে পারে।
              </ListItem>
              <ListItem>
                টাই থাকলে ORDER BY থাকলেও ক্রম অনিশ্চিত, আর LIMIT বদলালে সেটা বদলায়। শেষে একটা
                অনন্য Column দিন। সবাইকে রাখতে চাইলে FETCH FIRST ... WITH TIES।
              </ListItem>
              <ListItem>
                পাতা p, আকার s হলে LIMIT s আর OFFSET (p থেকে ১ বাদ) গুণ s। মোট পাতা হলো মোট Row
                ভাগ s, উপরের দিকে গোল।
              </ListItem>
              <ListItem>
                OFFSET বাদ দেওয়া Row গুলোও পড়ে, তাই গভীর পাতায় ধীর। আর দুই পাতার মাঝে Data
                বদলালে Row পুনরাবৃত্তি হয় বা হারায়।
              </ListItem>
              <ListItem>
                Keyset বা Cursor Pagination আগের পাতার শেষ Row কে বুকমার্ক করে:{" "}
                WHERE (booked_at, booking_id) &lt; (…, …)। দ্রুত আর স্থির, কিন্তু সরাসরি পাতা ৭ এ
                লাফ দেওয়া যায় না।
              </ListItem>
              <ListItem>
                API তে একটা বেশি Row চেয়ে has_more জানা হয়, শেষ Row থেকে next_cursor বানানো হয়,
                আর Cursor সবসময় Parameter হিসেবে যায়।
              </ListItem>
              <ListItem>
                MySQL এ LIMIT 3, 2 মানে ৩টা বাদ দিয়ে ২টা। FETCH FIRST, WITH TIES আর LIMIT ছাড়া
                OFFSET সেখানে চলে না।
              </ListItem>
            </ContentList>
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
                  ট্যুরের তালিকা পাতা: শুধু চালু ট্যুর, দামের ক্রমে বড় থেকে ছোট, দাম সমান হলে{" "}
                  <code className={CODE}>title</code> দিয়ে টাই ভাঙা, প্রতি পাতায় ৪টা। পাতা ২ এর{" "}
                  <code className={CODE}>title</code> আর <code className={CODE}>price_bdt</code> দেখান।
                </>
              }
              hint={
                <>
                  তিনটা অংশ জোড়া লাগান: <code className={CODE}>WHERE is_active</code>,{" "}
                  <code className={CODE}>ORDER BY price_bdt DESC, title</code>, আর পাতা ২ এর জন্য{" "}
                  <code className={CODE}>LIMIT 4 OFFSET 4</code>।
                </>
              }
              solution={`SELECT title, price_bdt
FROM tours
WHERE is_active
ORDER BY price_bdt DESC, title
LIMIT 4 OFFSET 4;`}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার আপনি যেকোনো তালিকা থেকে ঠিক যতটুকু দরকার ততটুকু নিতে পারেন, আর জানেন কোন
              পাতা ভাগ কোথায় খাটে। পরের লেসন{" "}
              <Link href="/sql/topic/distinct" className={LINK}>
                DISTINCT
              </Link>{" "}
              এ উল্টো দিকের একটা সমস্যা: ফলাফলে একই মান বারবার এলে সেগুলোকে একবার করে দেখানো।
            </ContentParagraph>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "উদাহরণ"],
    rows: [
      ["LIMIT", "সর্বোচ্চ কতগুলো Row", "ORDER BY price_bdt LIMIT 3"],
      ["OFFSET", "শুরুর আগে কতগুলো বাদ", "LIMIT 5 OFFSET 20"],
      ["চলার ক্রম", "LIMIT আর OFFSET সবার শেষে, ORDER BY এর পরে", "সাজানো ফলাফলের প্রথম ৩টা"],
      ["ORDER BY বাধ্যতামূলক", "না দিলে Row অনিশ্চিত", "UPDATE এর পর booking 2 উধাও"],
      ["Top-N", "ORDER BY আর LIMIT একসাথে", "সবচেয়ে দামি তিনটা ট্যুর"],
      ["পাতার অঙ্ক", "OFFSET = (p থেকে ১ বাদ) গুণ s", "পাতা ৩, আকার ৪: OFFSET 8"],
      ["FETCH FIRST", "LIMIT এর Standard রূপ", "OFFSET 3 ROWS FETCH NEXT 2 ROWS ONLY"],
      ["WITH TIES", "শেষ জায়গার টাই সবাইকে রাখে", "২টা চেয়ে ৩টা: 23, 2, 14"],
      ["Tie-breaker", "শেষে একটা অনন্য Column", "ORDER BY seats DESC, booking_id"],
      ["OFFSET এর খরচ", "বাদ দেওয়া Row ও পড়তে হয়", "actual rows=45010 বনাম 10"],
      ["Row সরে যাওয়া", "মাঝে নতুন Row এলে পুনরাবৃত্তি", "পাতা ২ শুরু booking 20 দিয়ে"],
      ["Keyset", "আগের পাতার শেষ Row থেকে শুরু", "(booked_at, booking_id) < (…, 20)"],
      ["API Cursor", "LIMIT n যোগ ১, next_cursor, Parameter", "has_more: true"],
      ["MySQL", "LIMIT offset, count; FETCH নেই", "LIMIT 3, 2"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "SELECT title FROM tours LIMIT 3; Query টা নিয়ে কোনটা সত্য?",
        options: [
          {
            key: "A",
            text: "এটা সবসময় সবচেয়ে পুরনো তিনটা ট্যুর দেয়",
            isCorrect: false,
            explanation: "ORDER BY নেই, তাই কোনো ক্রমের কথা দেওয়া নেই। আজ পুরনো তিনটা আসতে পারে, কাল নাও আসতে পারে।",
          },
          {
            key: "B",
            text: "এটা যেকোনো তিনটা ট্যুর দেয়, আর কোন তিনটা সেটা সময়ের সাথে বদলাতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। ORDER BY ছাড়া Database Row দেয় যেভাবে হাতে পড়ে। লেসনের বক্সে একটা নিরীহ UPDATE এর পরই booking 2 প্রথম পাঁচ থেকে উধাও হয়েছিল।",
          },
          {
            key: "C",
            text: "এটা Error দেয়, কারণ LIMIT এর জন্য ORDER BY বাধ্যতামূলক",
            isCorrect: false,
            explanation: "PostgreSQL Error দেয় না, চুপচাপ চালিয়ে দেয়। বিপদটা ঠিক সেখানেই।",
          },
          {
            key: "D",
            text: "এটা Primary Key এর ক্রমে প্রথম তিনটা দেয়",
            isCorrect: false,
            explanation: "Primary Key থাকা মানে সেই ক্রমে আসা না। ক্রম চাইলে ORDER BY tour_id লিখতে হবে।",
          },
        ],
      },
      {
        id: 2,
        text: "প্রতি পাতায় ২০টা Row। পাতা ৪ এর জন্য কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "LIMIT 20 OFFSET 80",
            isCorrect: false,
            explanation: "এটা পাতা ৫। OFFSET 80 মানে প্রথম চার পাতা বাদ।",
          },
          {
            key: "B",
            text: "LIMIT 20 OFFSET 60",
            isCorrect: true,
            explanation: "ঠিক। OFFSET = (৪ থেকে ১ বাদ) গুণ ২০ = ৬০। প্রথম তিন পাতা বাদ, তারপর ২০টা।",
          },
          {
            key: "C",
            text: "LIMIT 80 OFFSET 20",
            isCorrect: false,
            explanation: "সংখ্যা দুটো উল্টে গেছে। এটা ২০টা বাদ দিয়ে ৮০টা দেবে।",
          },
          {
            key: "D",
            text: "LIMIT 4 OFFSET 20",
            isCorrect: false,
            explanation: "LIMIT হলো পাতার আকার, পাতার নম্বর না।",
          },
        ],
      },
      {
        id: 3,
        text: "MySQL এর একটা ভিডিওতে লেখা SELECT * FROM tours LIMIT 10, 5; PostgreSQL এ একই কাজ কোনটা?",
        options: [
          {
            key: "A",
            text: "LIMIT 10 OFFSET 5",
            isCorrect: false,
            explanation: "এটাই সবচেয়ে চেনা ফাঁদ। MySQL এর কমার রূপে প্রথম সংখ্যাটা OFFSET।",
          },
          {
            key: "B",
            text: "LIMIT 5 OFFSET 10",
            isCorrect: true,
            explanation: "ঠিক। MySQL এর LIMIT 10, 5 মানে ১০টা বাদ দিয়ে ৫টা।",
          },
          {
            key: "C",
            text: "LIMIT 10, 5 হুবহু, PostgreSQL ও এটা বোঝে",
            isCorrect: false,
            explanation: "PostgreSQL কমার রূপ বোঝে না, Syntax Error দেয়।",
          },
          {
            key: "D",
            text: "FETCH FIRST 10 ROWS OFFSET 5",
            isCorrect: false,
            explanation: "সংখ্যার মানে ভুল, আর OFFSET বসে FETCH এর আগে।",
          },
        ],
      },
      {
        id: 4,
        text: "ORDER BY seats DESC LIMIT 2 একবার দিল booking 23 আর 2, আবার LIMIT 4 এ booking 14 এল 2 এর আগে। কেন?",
        options: [
          {
            key: "A",
            text: "Database এ Data নষ্ট হয়ে গেছে",
            isCorrect: false,
            explanation: "Data একই আছে। বদলেছে শুধু সমান মানের Row গুলোর নিজেদের ক্রম।",
          },
          {
            key: "B",
            text: "booking 2 আর 14 দুটোরই 4 সিট, আর টাই এর ভেতরের ক্রম অনিশ্চিত, Plan বদলালে বদলায়",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL আর MySQL দুইয়ের Docs ই বলে, ORDER BY এর মান সমান হলে সেই Row গুলোর ক্রম নিশ্চিত না। booking_id দিয়ে টাই ভাঙলে সমাধান।",
          },
          {
            key: "C",
            text: "DESC শুধু প্রথম Row এর জন্য খাটে",
            isCorrect: false,
            explanation: "DESC পুরো ফলাফলের জন্য খাটে। সমস্যা টাই এর।",
          },
          {
            key: "D",
            text: "LIMIT 4 এ OFFSET নিজে থেকে বসে যায়",
            isCorrect: false,
            explanation: "OFFSET না লিখলে সেটা ০, কোনো লুকানো OFFSET নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "FETCH FIRST 2 ROWS WITH TIES কী করে?",
        options: [
          {
            key: "A",
            text: "ঠিক ২টা দেয়, টাই হলে এলোমেলো একটা বাছে",
            isCorrect: false,
            explanation: "সেটা LIMIT 2 এর আচরণ। WITH TIES ঠিক উল্টোটা করে।",
          },
          {
            key: "B",
            text: "অন্তত ২টা দেয়, আর শেষ জায়গার সাথে টাই করা সব Row ও রাখে",
            isCorrect: true,
            explanation:
              "ঠিক। bookings এ সিট অনুযায়ী এটা দিয়েছিল ৩টা: 23, আর 4 সিটের দুটোই। ORDER BY ছাড়া এটা চলেই না।",
          },
          {
            key: "C",
            text: "টাই করা Row গুলো বাদ দেয়",
            isCorrect: false,
            explanation: "বাদ দেয় না, বরং বাড়তি হিসেবে যোগ করে।",
          },
          {
            key: "D",
            text: "MySQL আর PostgreSQL দুটোতেই চলে",
            isCorrect: false,
            explanation: "MySQL 8.4 এ FETCH FIRST ই নেই, তাই WITH TIES ও নেই।",
          },
        ],
      },
      {
        id: 6,
        text: "OFFSET 45000 LIMIT 10 ধীর কেন, যদিও ফেরত আসে মাত্র ১০টা Row?",
        options: [
          {
            key: "A",
            text: "কারণ ১০টা Row পাঠাতে Network এ অনেক সময় লাগে",
            isCorrect: false,
            explanation: "১০টা Row পাঠানো খুবই সস্তা। খরচটা Database এর ভেতরে।",
          },
          {
            key: "B",
            text: "কারণ বাদ দেওয়া ৪৫,০০০ Row ও Database কে ক্রমে পড়তে আর ফেলে দিতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। লেসনের EXPLAIN এ actual rows=45010 দেখা গেছে, যেখানে বুকমার্কের পথে মাত্র 10।",
          },
          {
            key: "C",
            text: "কারণ OFFSET এ Index কখনো ব্যবহার হয় না",
            isCorrect: false,
            explanation: "Index ব্যবহার হয়েছিল (Index Only Scan), তবু ৪৫,০১০টা Row হাঁটতে হয়েছে।",
          },
          {
            key: "D",
            text: "কারণ OFFSET প্রতিবার পুরো Table Copy করে",
            isCorrect: false,
            explanation: "Copy হয় না। সাজানো ক্রমে প্রথম থেকে গুনে এগোতে হয়, সমস্যাটা সেখানে।",
          },
        ],
      },
      {
        id: 7,
        text: "তালিকা সাজানো booked_at DESC, booking_id DESC। পাতা ১ এর শেষ Row booking 20। Keyset এ পাতা ২ এর শর্ত কোনটা?",
        options: [
          {
            key: "A",
            text: "WHERE (booked_at, booking_id) > ('2026-10-10 17:20:00+06', 20)",
            isCorrect: false,
            explanation: "DESC তে পরের পাতা মানে ছোট মান। > দিলে আসবে পাতা ১ এর দিকের Row গুলো।",
          },
          {
            key: "B",
            text: "WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)",
            isCorrect: true,
            explanation: "ঠিক। DESC হলে <। এটা দেয় 17, 19, 16, 14, 18।",
          },
          {
            key: "C",
            text: "WHERE booking_id < 20",
            isCorrect: false,
            explanation:
              "তালিকা সাজানো সময় দিয়ে, ID দিয়ে না। পাতা ২ এ এটা কাকতালীয়ভাবে মিলে যায়, কিন্তু পাতা ৩ এ booking_id < 18 দিলে আসে 17, 16, 14, 15, 13: তিনটা Row আবার, পাতা ২ থেকে।",
          },
          {
            key: "D",
            text: "OFFSET 20",
            isCorrect: false,
            explanation: "20 হলো booking_id, কতগুলো Row বাদ যাবে সেটা না। আর OFFSET তো Keyset ই না।",
          },
        ],
      },
      {
        id: 8,
        text: "একটা API প্রতি পাতায় ২০টা দেখায় আর has_more জানাতে চায়। Database কে কতগুলো Row চাইবে?",
        options: [
          {
            key: "A",
            text: "২০টা, তারপর আলাদা count(*) চালাবে",
            isCorrect: false,
            explanation: "চলে, কিন্তু প্রতি পাতায় পুরো Table গোনা বড় Table এ দামি। একটা বাড়তি Row যথেষ্ট।",
          },
          {
            key: "B",
            text: "২১টা, ২১তম এলে has_more true, আর সেটা পাঠানো হয় না",
            isCorrect: true,
            explanation: "ঠিক। LIMIT n যোগ ১ একটা সস্তা আর পরিচিত কৌশল।",
          },
          {
            key: "C",
            text: "৪০টা, পরের পাতাটাও আগে থেকে রাখতে",
            isCorrect: false,
            explanation: "পরের পাতার Data আগেই আনা মানে অপ্রয়োজনীয় কাজ, আর ততক্ষণে সেটা পুরনোও হয়ে যেতে পারে।",
          },
          {
            key: "D",
            text: "সবগুলো, তারপর API নিজে কেটে নেবে",
            isCorrect: false,
            explanation: "এটাই সেই সমস্যা যেটা পাতা ভাগ দূর করতে এসেছে।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Island Tours এর জন্য পাতা ভাগের নকশা",
    time: "৪৫-৬০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <>
        Booking তালিকার পাঁচটা পাতাই (প্রতি পাতায় ৫টা, booked_at DESC, booking_id DESC) OFFSET
        দিয়ে আনুন। তারপর একই পাঁচ পাতা Keyset দিয়ে আনুন, প্রতিবার আগের পাতার শেষ Row কে বুকমার্ক
        বানিয়ে। দুই পদ্ধতির ফলাফল পাশাপাশি রাখুন।
      </>,
      <>
        BEGIN দিয়ে একটা Transaction খুলে নতুন একটা Booking ঢোকান (booked_at হিসেবে সবচেয়ে নতুন
        একটা সময়), তারপর দুই পদ্ধতিতে পাতা ২ চালান, আর শেষে ROLLBACK। কোন পদ্ধতিতে কোন Row
        পুনরাবৃত্তি হলো, নিজের ভাষায় লিখুন।
      </>,
      <>
        সিট অনুযায়ী সাজানো (seats DESC) এমন একটা Query লিখুন যেটা LIMIT 3 এ একবার আর LIMIT 6 এ
        আরেকবার চালালে প্রথম তিনটার ক্রম মেলে কিনা দেখায়। তারপর টাই ভাঙার Column যোগ করে প্রমাণ
        করুন এখন সবসময় মেলে।
      </>,
      <>
        চালু ট্যুরের তালিকার জন্য একটা Query লিখুন যেটা পাতার নম্বর আর পাতার আকার বদলালেই কাজ
        করে। পাতা ১, ২, ৩ এর আকার ৩ ধরে চালিয়ে দেখান কোনো ট্যুর বাদ বা পুনরাবৃত্তি হয়নি।
      </>,
      <>
        নিজের my-tours এর জন্য একটা ছোট নকশা লিখুন: কোন কোন তালিকা থাকবে, প্রতিটায় OFFSET না
        Keyset, পাতার সর্বোচ্চ আকার কত আর সেটা কোথায় লেখা থাকবে, আর API কী JSON ফেরত দেবে।
      </>,
    ],
    deliverables: [
      <>দুই পদ্ধতির পাঁচ পাতার ফলাফলের তুলনা, স্ক্রিনশট বা Copy করা Output।</>,
      <>Transaction পরীক্ষার Query আর পুনরাবৃত্তির ব্যাখ্যা।</>,
      <>টাই পরীক্ষার দুই সংস্করণের Query আর ফলাফল।</>,
      <>পাতার নম্বর থেকে OFFSET হিসাব করা Query আর তিন পাতার Output।</>,
      <>my-tours এর পাতা ভাগের নকশা, এক পাতায়।</>,
    ],
  },
  practicalLab: {
    title: "নিজের island_tours এ পাতা ভাগের ড্রিল",
    subtitle:
      "Module 02 এ নিজের মেশিনে Load করা island_tours Database এ psql খুলে নিচের ফাইলগুলো চালান। প্রতিটা Query এর পাশে কতগুলো Row আসা উচিত, সেটা Comment এ লেখা, একই Data তে চালিয়ে পাওয়া।",
    stepName: "ধাপ",
    steps: [
      {
        title: "psql খুলুন",
        description: "psql -d island_tours দিয়ে Connect করুন। প্রম্পটে island_tours=# দেখলে ঠিক জায়গায় আছেন।",
      },
      {
        title: "Top-N দিয়ে শুরু",
        description: "ড্রিল ১ চালান। ORDER BY বাদ দিয়ে আবার চালিয়ে দেখুন উত্তর বদলায় কিনা, আর কেন সেটার উপর ভরসা করা যায় না।",
      },
      {
        title: "পাতা হাঁটুন",
        description: "ড্রিল ২ এর পাঁচটা Query চালান, প্রতিটার Row গুনে মিলিয়ে নিন: ৫, ৫, ৫, ৫, ৪।",
      },
      {
        title: "টাই ধরুন",
        description: "ড্রিল ৩ চালান। LIMIT 2 আর LIMIT 4 এর তফাত খেয়াল করুন, তারপর Tie-breaker এর সংস্করণ।",
      },
      {
        title: "বুকমার্ক বসান",
        description: "ড্রিল ৪ এ Keyset এর পাতা ২ থেকে ৫। প্রতিটার শেষ Row পরের Query তে বুকমার্ক হিসেবে বসেছে কিনা দেখুন।",
      },
      {
        title: "Transaction এ পরীক্ষা",
        description: "ড্রিল ৫ পুরোটা চালান। শেষে ROLLBACK হয়েছে কিনা নিশ্চিত হতে ড্রিল ৬ এর count চালান: 24 আসা উচিত।",
      },
    ],
    codeBlocks: [
      {
        language: "sql",
        filename: "drill-1-top-n.sql",
        code: `-- সবচেয়ে দামি তিনটা চালু ট্যুর (3 rows)
SELECT title, price_bdt
FROM tours
WHERE is_active
ORDER BY price_bdt DESC, title
LIMIT 3;

-- সবচেয়ে নতুন পাঁচটা Booking (5 rows)
SELECT booking_id, booked_at
FROM bookings
ORDER BY booked_at DESC, booking_id DESC
LIMIT 5;`,
      },
      {
        language: "sql",
        filename: "drill-2-offset-pages.sql",
        code: `-- প্রতি পাতায় ৫টা, পাতা ১ থেকে ৫ (5, 5, 5, 5, 4 rows)
SELECT booking_id FROM bookings ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 0;
SELECT booking_id FROM bookings ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 5;
SELECT booking_id FROM bookings ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 10;
SELECT booking_id FROM bookings ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 15;
SELECT booking_id FROM bookings ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 20;`,
      },
      {
        language: "sql",
        filename: "drill-3-ties.sql",
        code: `-- টাই: দুটো 4 সিটের Booking (2 rows, তারপর 4 rows)
SELECT booking_id, seats FROM bookings ORDER BY seats DESC LIMIT 2;
SELECT booking_id, seats FROM bookings ORDER BY seats DESC LIMIT 4;

-- টাই ভাঙা (4 rows: 23, 2, 14, 4)
SELECT booking_id, seats FROM bookings ORDER BY seats DESC, booking_id LIMIT 4;

-- টাই সবাইকে রেখে (3 rows: 23, 2, 14)
SELECT booking_id, seats FROM bookings ORDER BY seats DESC FETCH FIRST 2 ROWS WITH TIES;`,
      },
      {
        language: "sql",
        filename: "drill-4-keyset.sql",
        code: `-- পাতা ২ (5 rows: 17, 19, 16, 14, 18)
SELECT booking_id, booked_at FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC LIMIT 5;

-- পাতা ৩ (5 rows: 15, 13, 11, 10, 9)
SELECT booking_id, booked_at FROM bookings
WHERE (booked_at, booking_id) < ('2026-09-28 23:30:00+06', 18)
ORDER BY booked_at DESC, booking_id DESC LIMIT 5;

-- পাতা ৪ (5 rows: 8, 12, 7, 6, 3)
SELECT booking_id, booked_at FROM bookings
WHERE (booked_at, booking_id) < ('2026-03-01 16:35:00+06', 9)
ORDER BY booked_at DESC, booking_id DESC LIMIT 5;

-- পাতা ৫ (4 rows: 5, 4, 2, 1)
SELECT booking_id, booked_at FROM bookings
WHERE (booked_at, booking_id) < ('2026-01-10 09:30:00+06', 3)
ORDER BY booked_at DESC, booking_id DESC LIMIT 5;`,
      },
      {
        language: "sql",
        filename: "drill-5-shifting.sql",
        code: `BEGIN;
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt, booked_at)
VALUES (15, 10, 1, 'pending', 8500.00, '2026-10-15 09:00+06');

-- OFFSET এর পাতা ২ (5 rows: 20, 17, 19, 16, 14) -- 20 আগেও পাতা ১ এ ছিল
SELECT booking_id FROM bookings
ORDER BY booked_at DESC, booking_id DESC LIMIT 5 OFFSET 5;

-- Keyset এর পাতা ২ (5 rows: 17, 19, 16, 14, 18) -- কোনো পুনরাবৃত্তি নেই
SELECT booking_id FROM bookings
WHERE (booked_at, booking_id) < ('2026-10-10 17:20:00+06', 20)
ORDER BY booked_at DESC, booking_id DESC LIMIT 5;
ROLLBACK;`,
      },
      {
        language: "sql",
        filename: "drill-6-check.sql",
        code: `-- ROLLBACK এর পর সব আগের মতো (1 row: 24)
SELECT count(*) FROM bookings;

-- মোট পাতা, প্রতি পাতায় ৫টা (1 row: 24, 5)
SELECT count(*) AS total_bookings, ceil(count(*) / 5.0) AS total_pages
FROM bookings;`,
      },
    ],
    tip: (
      <>
        psql এ <code className={CODE}>\timing</code> চালু করে ড্রিল ২ আর ড্রিল ৪ এর সময় দেখুন। ২৪টা
        Row এ কোনো তফাত পাবেন না, আর সেটাই শিক্ষা: OFFSET এর খরচ ধরা পড়ে শুধু বড় Table এ, যেমনটা
        লেসনের ৫০,০০০ Row এর বক্সে দেখেছেন।
      </>
    ),
  },
};
