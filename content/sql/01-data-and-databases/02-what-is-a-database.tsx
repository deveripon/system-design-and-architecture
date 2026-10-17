import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import {
  DbmsJobsLab,
  LastSeatLab,
} from "../../../components/course/topics/sql-basics/dbms-animations";
import {
  DbmsLayersDiagram,
  ServerDatabasesDiagram,
  ShoeboxVsLedgerSplit,
} from "../../../components/course/topics/sql-basics/dbms-diagrams";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";

export const whatIsADatabaseContent: TopicData = {
  id: "what-is-a-database",
  introduction: {
    badge: "MODULE 01 · LESSON 02",
    title: <SectionTitle>Database আর DBMS: তথ্যের তাক আর তার লাইব্রেরিয়ান</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি দেখেছেন, Island Tours একটা শেয়ার করা Spreadsheet দিয়ে
          শুরু করেছিল, আর ব্যবসা একটু বড় হতেই সেটা কীভাবে একের পর এক জায়গায় ভেঙে
          পড়ল। একই Customer এর নাম তিন বানানে, দুজন কর্মীর একে অপরের কাজ মুছে
          ফেলা, সিটের ঘরে কারো লেখা পাঁচ আর কারো লেখা মাইনাস দুই। লেসনের শেষে
          একটা ইচ্ছার তালিকা ছিল: এমন একটা জায়গা চাই, যেখানে Data হারায় না, দ্রুত
          খোঁজা যায়, ভুল Data ঢুকতে পারে না, একসাথে অনেকে কাজ করলেও গোলমাল হয় না,
          আর সবাই সবকিছু দেখতে পায় না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই ইচ্ছার তালিকার উত্তর। শেষে আপনি তিনটা শব্দ আলাদা করে চিনবেন,
          যেগুলো মানুষ প্রায়ই গুলিয়ে ফেলে: Database, DBMS আর Database Server।
          জানবেন একটা DBMS আসলে কী কী কাজ করে, প্রতিটা কাজ এই ট্র্যাকের কোথায়
          গভীরভাবে শিখবেন, RDBMS কথাটার মানে কী, বাজারে কোন কোন DBMS আছে, আর
          একটা Database Server একটা মেশিনের ভেতরে ঠিক কোথায় আর কীভাবে চলে। আর
          হ্যাঁ, এই লেসনেই প্রথমবার নিজের হাতে একটা আসল PostgreSQL কে প্রশ্ন
          করবেন, কিছু ইনস্টল না করেই।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "লাইব্রেরির বই সবার জন্য, কিন্তু তাক থেকে বই নামানো, জায়গামতো ফেরত রাখা আর কে কোন বই নিল তার হিসাব রাখা, এই কাজগুলো করেন একজনই। বইয়ের তাক হলো Database, আর সেই লাইব্রেরিয়ান হলো DBMS।",
      author: "DBMS",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা সাধারণ প্রশ্ন, আর তার পেছনের যন্ত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সকাল দশটা। Island Tours এর অফিসে ফোন বাজল। একজন Customer জানতে
                চাইছেন, ২০ নভেম্বর Saint Martin যাওয়ার ট্যুরে আর কয়টা সিট খালি
                আছে। কর্মী রিয়া Admin Panel এ ট্যুরটা খুললেন, এক সেকেন্ডের মধ্যে
                উত্তর এল: ১৪টা। রিয়া Customer কে বললেন, দুটো সিট রাখি? Customer
                রাজি হলেন। রিয়া বুক করলেন, আর সংখ্যাটা সাথে সাথে ১২ হয়ে গেল।
              </ContentParagraph>
              <ContentParagraph>
                ঘটনাটা এতই সাধারণ যে কেউ দুইবার ভাবে না। কিন্তু একটু থেমে নিজেকে
                কয়েকটা প্রশ্ন করুন। ১৪ সংখ্যাটা কোথায় লেখা ছিল? ঠিক সেই সময়ে যদি
                অফিসের আরেকজন কর্মী একই তারিখের সিট বুক করতেন, তাহলে সংখ্যাটা কে
                ঠিক রাখত? রিয়া বুক করার ঠিক পরেই যদি বিদ্যুৎ চলে যেত, বুকিংটা কি
                থেকে যেত? আর রিয়া কি চাইলে এই Panel থেকে সব Customer এর Payment এর
                হিসাব দেখে ফেলতে পারতেন?
              </ContentParagraph>
              <ContentParagraph>
                এই প্রতিটা প্রশ্নের উত্তর দেয় একটা Program, যাকে রিয়া কখনো চোখে
                দেখেননি। তার নাম DBMS, আর সে যে জিনিসটা পাহারা দেয় তার নাম
                Database। এই লেসনে আমরা সেই অদৃশ্য Program টার সাথে পরিচিত হব।
                তার আগে একটা ছোট শব্দকে পরিষ্কার করে নেওয়া দরকার, যেটা এই পুরো
                ট্র্যাকে হাজারবার আসবে: Data।
              </ContentParagraph>
              <ContentParagraph>
                Data মানে লিখে রাখা কোনো তথ্য। একজন মানুষের নাম, একটা ফোন নম্বর,
                একটা তারিখ, একটা দাম, সিটের একটা সংখ্যা। একটা একটা Data আলাদাভাবে
                তেমন কিছু বলে না। ১৪ সংখ্যাটা একা দাঁড়িয়ে থাকলে অর্থহীন। কিন্তু
                যখন সেটা লেখা থাকে Saint Martin, ২০ নভেম্বর আর খালি সিট, এই তিনটার
                পাশে, তখনই সেটা একটা কাজের তথ্য হয়ে ওঠে। Data কে এভাবে পাশাপাশি,
                নিয়ম মেনে রাখার জায়গাই Database।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক লাইনের সংজ্ঞা, যা পুরো লেসন জুড়ে খুলে দেখা হবে",
          content: (
            <ContentParagraph>
              Database হলো সাজানো Data এর একটা সংগ্রহ, যা এমনভাবে রাখা হয় যাতে
              পরে খুঁজে পাওয়া যায়, বদলানো যায় আর ভরসা করা যায়। আর DBMS (Database
              Management System) হলো সেই Program, যে এই সংগ্রহটা রাখে, খোঁজে,
              বদলায় আর পাহারা দেয়। আপনি কখনো Database কে সরাসরি ছোঁন না, সবসময়
              DBMS কে বলেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "organized",
      subHeader: { index: "002", title: "Organized Data" },
      title: <SectionTitle>সাজানো মানে কী: জুতার বাক্স আর হিসাবের খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সংজ্ঞার সবচেয়ে গুরুত্বপূর্ণ শব্দটা সাজানো। কারণ তথ্য রাখার জায়গা
                থাকলেই সেটা Database হয় না। ধরুন Island Tours একদম শুরুর দিকে
                প্রতিটা বুকিংয়ের একটা রসিদ কাগজে লিখে একটা জুতার বাক্সে ফেলে রাখত।
                বাক্সে সব তথ্যই আছে। কিন্তু মাস শেষে কেউ যদি জিজ্ঞেস করে, জানুয়ারিতে
                Saint Martin এ মোট কতজন গেছেন, তাহলে পুরো বাক্স উপুড় করে প্রতিটা
                কাগজ পড়তে হবে। কোনো কাগজে তারিখ নেই, কোনোটায় নামের বানান ভুল,
                কোনোটা হয়তো পড়েই গেছে।
              </ContentParagraph>
              <ContentParagraph>
                এবার একই তথ্য একটা হিসাবের খাতায় ভাবুন, যেখানে পাতার উপরে ঘর কাটা:
                নাম, ট্যুর, তারিখ, সিট। প্রতিটা বুকিং একটা লাইন, আর প্রতিটা লাইনে
                একই ঘর একই ক্রমে। এখন জানুয়ারির Saint Martin খুঁজতে তারিখের ঘরে
                চোখ বুলিয়ে গেলেই হয়। কোনো লাইনে তারিখ না থাকলে খালি ঘরটা চোখে
                পড়ে। নিচের ছবিতে দুটো পাশাপাশি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ShoeboxVsLedgerSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                খাতাটাকে Database হওয়ার পথে নিয়ে গেছে তিনটা জিনিস। আপনি এগুলো
                মনে রাখলে যেকোনো কিছু দেখে বলতে পারবেন সেটা Database এর মতো আচরণ
                করছে কিনা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা নির্দিষ্ট গঠন:</strong> প্রতিটা তথ্য কোন ঘরে বসবে
                  তা আগে থেকে ঠিক করা। এই আগে থেকে ঠিক করা নকশাটার নাম Schema।
                  Lesson 04 এ এটাকে খুব কাছ থেকে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা জিনিসের একই আকার:</strong> একটা বুকিংয়ের লাইনে
                  যা যা আছে, সব বুকিংয়ের লাইনে তাই আছে। এক লাইনে চারটা ঘর আর আরেক
                  লাইনে সাতটা, এমন হয় না।
                </ListItem>
                <ListItem>
                  <strong>খুঁজে পাওয়ার উপায়:</strong> কোনো একটা ঘর ধরে খোঁজা যায়,
                  সাজানো যায়, গোনা যায়। প্রশ্নের উত্তর বের করতে পুরো সংগ্রহ উল্টে
                  দেখতে হয় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মজার ব্যাপার হলো, এই সংজ্ঞায় আপনার ফোনের Contact List ও একটা ছোট
                Database। প্রতিটা Contact এর একই ঘর, নাম, নম্বর, Email, আর নাম ধরে
                খোঁজা যায়। আসলে বেশিরভাগ ফোনের ভেতরে Contact গুলো সত্যিই একটা ছোট
                Database এ থাকে, যার DBMS এর নাম SQLite। এই লেসনের শেষ দিকে তার
                সাথেও দেখা হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "খাতাটা কেন যথেষ্ট না",
          content: (
            <ContentParagraph>
              সাজানো খাতা জুতার বাক্সের চেয়ে অনেক ভালো, কিন্তু তবু খাতা নিজে কিছু
              করে না। কেউ সিটের ঘরে মাইনাস দুই লিখলে খাতা আপত্তি করে না, দুজন একই
              পাতায় একসাথে লিখতে গেলে খাতা কাউকে থামায় না, আর খাতা পুড়ে গেলে আর
              কিছু থাকে না। আগের লেসনের Spreadsheet ঠিক এই খাতারই Digital রূপ।
              সাজানো Data এর পাশে একজন পাহারাদার লাগে। সেই পাহারাদারই DBMS।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "dbms",
      subHeader: { index: "003", title: "The DBMS" },
      title: <SectionTitle>DBMS: যে Program কখনো আপনাকে তাকে হাত দিতে দেয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পুরনো ধাঁচের লাইব্রেরির কথা ভাবুন। হাজার হাজার বই তাকে সাজানো।
                আপনি তাকের কাছে যান না। কাউন্টারে লাইব্রেরিয়ানকে বলেন, অমুক লেখকের
                অমুক বইটা চাই। লাইব্রেরিয়ান আগে দেখেন আপনার কার্ড আছে কিনা, তারপর
                সূচির কার্ড দেখে বইটা কোন তাকে আছে বের করেন, বইটা এনে দেন, আর
                খাতায় লিখে রাখেন কে কখন নিল। বই ফেরত দিলে তিনিই সেটা ঠিক জায়গায়
                রাখেন, যাতে পরের জন খুঁজে পান।
              </ContentParagraph>
              <ContentParagraph>
                একটা Database এর সাথেও আপনার সম্পর্ক ঠিক এরকম। Database হলো বইয়ের
                তাক, মানে Disk এ রাখা Data। আর DBMS হলো লাইব্রেরিয়ান, একটা Program,
                যার পুরো নাম Database Management System। আপনি, আপনার App, বা কোনো
                Tool, কেউই Disk এর ফাইল খুলে Data পড়ে না বা লেখে না। সবাই DBMS কে
                প্রশ্ন পাঠায়, আর DBMS নিজে গিয়ে কাজটা করে উত্তর ফেরত দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের ছবিতে বাম দিকে তিনটা আলাদা Program, যারা প্রশ্ন পাঠায়। এদের
                বলা হয় Client। Island Tours এর API, Terminal এর psql, আর মাউস দিয়ে
                চালানো pgAdmin। মাঝখানে DBMS, এখানে PostgreSQL। আর ডান দিকে Disk,
                যেখানে Data আসলে বসে থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DbmsLayersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মাঝখানের বাক্সের ছয়টা ছোট ঘর DBMS এর ভেতরের ছয়টা কাজের নাম।
                Connect করার মুহূর্তেই DBMS জেনে নেয় কে প্রশ্ন করছেন। তারপর প্রতিটা
                প্রশ্ন এলে সে লেখাটা বোঝে (Parse), খোঁজার সবচেয়ে ভালো পথ ঠিক করে
                (Plan), আসল কাজ শুরুর আগে দেখে নেয় প্রশ্নকারীর ওই Table ছোঁয়ার
                অনুমতি আছে কিনা (Permission), আর তারপর খুঁজে বা বদলে আনে
                (Execute)। বদলানোর সময় নিয়ম মানা হচ্ছে কিনা দেখে (Constraint), আর
                একসাথে অনেকে একই জিনিস ছুঁতে চাইলে তাদের সারিতে দাঁড় করায় (Lock)।
                এই নামগুলো এখন মুখস্থ করার দরকার নেই। পরের মডিউলগুলোতে প্রতিটার
                সাথে আলাদা করে দেখা হবে।
              </ContentParagraph>
              <ContentParagraph>
                এই নিয়মের একটা সোজা ফল আছে: Disk এর ফাইলগুলো কখনো নিজে হাতে খুলে
                বদলাবেন না। PostgreSQL তার Data রাখে একটা ফোল্ডারে, যার নাম Data
                Directory। সেখানে অনেকগুলো ফাইল আছে, কিন্তু সেগুলোর ভেতরের সাজানোর
                নিয়ম শুধু PostgreSQL জানে। হাতে একটা Byte বদলালে পুরো Database নষ্ট
                হয়ে যেতে পারে, আর DBMS এর কোনো নিয়ম, কোনো Permission, কোনো Lock তখন
                কাজ করে না, কারণ আপনি লাইব্রেরিয়ানকে পাশ কাটিয়ে সরাসরি তাকে হাত
                দিয়েছেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "মুখের কথায় Database মানে প্রায়ই পুরো জিনিসটা",
          content: (
            <ContentParagraph>
              কাজের জায়গায় কেউ যখন বলেন Database ধীর চলছে, বা Database Down, তখন
              তিনি আসলে DBMS আর তার Data দুটো মিলিয়েই বলছেন। এতে দোষ নেই, সবাই
              এভাবেই বলে। কিন্তু নিজের মাথায় আলাদাটা পরিষ্কার রাখা দরকার, কারণ
              সমস্যা খোঁজার সময় প্রশ্নটা বদলে যায়: Program টা কি বন্ধ, নাকি
              Program চলছে কিন্তু Data তে গোলমাল?
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "three-words",
      subHeader: { index: "004", title: "Database, DBMS, Server" },
      title: <SectionTitle>তিনটা শব্দ, তিনটা আলাদা জিনিস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তৃতীয় শব্দটা যোগ করি: Database Server। এই তিনটা শব্দ এতবার
                একটার জায়গায় আরেকটা ব্যবহার হয় যে নতুনরা প্রায়ই ধরে নেন তিনটা একই
                জিনিস। আসলে তিনটা তিন স্তরের জিনিস, আর একবার পরিষ্কার হয়ে গেলে
                অনেক Error Message হঠাৎ বোঝা যেতে শুরু করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DBMS:</strong> Software, মানে Program টা। PostgreSQL,
                  MySQL, SQLite, এগুলো DBMS এর নাম। আপনি এটা Download করে ইনস্টল
                  করেন, যেমন Browser ইনস্টল করেন।
                </ListItem>
                <ListItem>
                  <strong>Database Server:</strong> সেই Program যখন একটা মেশিনে
                  চালু থাকে আর প্রশ্নের অপেক্ষায় কান পেতে থাকে। চালু Program কে
                  Operating System এর ভাষায় বলে Process। PostgreSQL এর Process
                  সাধারণত Port 5432 এ কান পেতে থাকে। Port কী, DevOps ট্র্যাকের{" "}
                  <Link href="/devops/topic/port-and-socket" className={LINK}>
                    Port & Socket
                  </Link>{" "}
                  লেসনে বিস্তারিত আছে। এখানে শুধু এটুকু মনে রাখুন: একটা মেশিনে
                  অনেক Program চলে, আর Port নম্বর দিয়ে বোঝা যায় কোন Program এর
                  দরজায় টোকা দিচ্ছেন।
                </ListItem>
                <ListItem>
                  <strong>Database:</strong> Server এর ভেতরে একটা নাম দেওয়া Data
                  এর সংগ্রহ। যেমন island_tours। একটা Server এর ভেতরে একসাথে অনেকগুলো
                  Database থাকতে পারে, প্রতিটা নিজের নাম আর নিজের Table নিয়ে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ServerDatabasesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটা একটা বড় দালানের মতো পড়ুন। মেশিন হলো দালান। PostgreSQL এর
                চলন্ত Process হলো দালানের ভেতরে একটা অফিস, যার দরজার নম্বর 5432।
                আর অফিসের ভেতরে আলাদা আলাদা আলমারি, প্রতিটার গায়ে একটা নাম লেখা:
                island_tours, my_tours, postgres। প্রতিটা আলমারি একটা Database।
                আপনি যখন Connect করেন, তখন বলে দেন কোন দালানের কোন দরজায় যাবেন
                আর কোন আলমারিটা খুলবেন।
              </ContentParagraph>
              <ContentParagraph>
                ছবির postgres নামের Database টা কেউ বানায়নি, PostgreSQL ইনস্টল
                করলেই সেটা থাকে। আর একটা Server এ কতগুলো Database থাকবে, কীভাবে
                নতুন Database বানাবেন, Database এর ভেতরে আরেক স্তরের ভাগ Schema
                কী, এসব Module 02 এর Databases, Schemas লেসনে হাতে কলমে দেখবেন।
                এখন শুধু ছবিটা মাথায় রাখুন: একটা Server, অনেকগুলো Database।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["শব্দ", "আসলে কী", "উদাহরণ", "লাইব্রেরির ভাষায়"],
          rows: [
            ["DBMS", "Program, Software", "PostgreSQL 17", "লাইব্রেরিয়ানের পেশা আর দক্ষতা"],
            [
              "Database Server",
              "চালু থাকা DBMS এর Process, একটা Port এ অপেক্ষায়",
              "VPS এ চলা PostgreSQL, Port 5432",
              "কাউন্টারে বসে থাকা লাইব্রেরিয়ান",
            ],
            ["Database", "Server এর ভেতরে নাম দেওয়া Data এর সংগ্রহ", "island_tours", "একটা নির্দিষ্ট তাকের সারি"],
            ["Table", "Database এর ভেতরে একই ধরনের Data এর তালিকা", "bookings, customers", "এক বিষয়ের বইয়ের একটা তাক"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Error Message এ কোন শব্দটা লেখা, দেখে নিন",
          content: (
            <ContentParagraph>
              PostgreSQL এ Connect করতে গিয়ে যদি দেখেন Connection refused, তার মানে
              দালানে পৌঁছেছেন কিন্তু 5432 নম্বর দরজায় কেউ নেই, মানে Server চালু
              নেই। আর যদি দেখেন database &quot;island_tours&quot; does not exist,
              তার মানে Server চালু, দরজাও খুলেছে, কিন্তু ওই নামের আলমারি নেই। দুটো
              একদম আলাদা সমস্যা, আর তিনটা শব্দ আলাদা করে চিনলে আপনি সাথে সাথে বুঝে
              যাবেন কোথায় হাত দিতে হবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "seven-jobs",
      subHeader: { index: "005", title: "Seven Jobs" },
      title: <SectionTitle>একটা DBMS এর সাতটা কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনের ইচ্ছার তালিকা মনে আছে? এবার সেই তালিকার প্রতিটা ইচ্ছা
                পাশে বসিয়ে দেখি DBMS কোন কাজটা করে। মোট সাতটা কাজ। এগুলোর প্রতিটা
                নিয়ে এই ট্র্যাকে আলাদা মডিউল আছে, তাই এখন শুধু চিনে রাখার পালা।
                একটা ভালো DBMS আর একটা সাধারণ ফাইলের মধ্যে আসল তফাত এই সাতটা কাজেই।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ প্রতিটা কাজের নাম চাপুন। প্রতিবার তিনটা জিনিস দেখবেন:
                Spreadsheet এর দিনে ঠিক কী সমস্যা হতো, DBMS সেটা কীভাবে সামলায়,
                আর Island Tours এ সেটা কোথায় চোখে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DbmsJobsLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "ইংরেজি নাম", "কোন প্রশ্নের উত্তর", "গভীরে কোথায়"],
          rows: [
            ["টেকসই রাখা", "Durability", "বিদ্যুৎ গেলেও কি বুকিং থেকে যাবে?", "Module 12, 18"],
            ["দ্রুত খোঁজা", "Indexing, Planning", "লাখ Row এর মধ্যে এক Millisecond এ?", "Module 13"],
            ["নিয়ম পাহারা", "Constraints", "সিট মাইনাস দুই লেখা কি আটকানো যায়?", "Module 09"],
            ["একসাথে অনেকে", "Concurrency", "শেষ সিট দুজন চাইলে কে পাবেন?", "Module 12"],
            ["কে কী দেখবে", "Permissions", "Guide কি Payment দেখতে পাবেন?", "Module 16"],
            ["বিপদের দিনের Copy", "Backup, Recovery", "ভুল করে মুছে ফেললে ফেরত আসবে?", "Module 18"],
            ["প্রশ্ন করার ভাষা", "Query Language", "কীভাবে জিজ্ঞেস করব?", "Lesson 05, Module 03"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "durability",
      subHeader: { index: "006", title: "Job 1: Durability" },
      title: <SectionTitle>সফল বলা মানে থেকে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম কাজটা সবচেয়ে মৌলিক, আর সবচেয়ে কম চোখে পড়ে। কম্পিউটারের
                দুই ধরনের জায়গায় Data থাকতে পারে। RAM খুব দ্রুত, কিন্তু বিদ্যুৎ
                গেলে সব মুছে যায়। Disk ধীর, কিন্তু বিদ্যুৎ গেলেও Data থেকে যায়।
                এই পার্থক্যটা DevOps ট্র্যাকের{" "}
                <Link href="/devops/topic/memory-and-ram" className={LINK}>
                  RAM
                </Link>{" "}
                আর{" "}
                <Link href="/devops/topic/storage-basics" className={LINK}>
                  Storage
                </Link>{" "}
                লেসনে বিস্তারিত আছে। Spreadsheet এ আপনি Save না চাপা পর্যন্ত সব
                পরিবর্তন RAM এ থাকে, তাই হঠাৎ বিদ্যুৎ গেলে শেষ কয়েক মিনিটের কাজ
                হারায়।
              </ContentParagraph>
              <ContentParagraph>
                DBMS এখানে একটা কঠিন প্রতিশ্রুতি দেয়, যার নাম Durability। যখনই সে
                বলে আপনার পরিবর্তনটা সফল হয়েছে, তখন সেটা Disk এ পাকা হয়ে গেছে।
                এরপর বিদ্যুৎ গেলেও, Server হঠাৎ বন্ধ হয়ে গেলেও, ফিরে এসে সেই
                পরিবর্তন পাওয়া যাবে। সফল হয়েছে বলার এই মুহূর্তটার একটা নাম আছে:
                Commit।
              </ContentParagraph>
              <ContentParagraph>
                এটা সে করে একটা চালাক কৌশলে। আসল Data ফাইলে ধীরে ধীরে লেখার আগে
                PostgreSQL প্রতিটা পরিবর্তন খুব দ্রুত একটা আলাদা খাতায় লিখে রাখে,
                যেখানে শুধু শেষে নতুন লাইন যোগ হয়। এই খাতার নাম WAL, Write-Ahead
                Log। আগে খাতায় লেখা, তারপর সফল বলা। বিদ্যুৎ চলে গেলে Server ফিরে
                এসে খাতাটা পড়ে মিলিয়ে নেয় কোন কোন পরিবর্তন আসল ফাইলে পৌঁছানোর আগেই
                থেমে গিয়েছিল, আর সেগুলো আবার করে নেয়। WAL এর ভেতরের কাজ Module 18
                এ দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ এর মানে খুব সোজা। Customer এর ফোনে বুকিং নিশ্চিত
                লেখা আসে তখনই, যখন PostgreSQL Commit শেষ করেছে। এর আগে যদি Server
                বন্ধ হয়ে যায়, Customer নিশ্চিত হওয়ার বার্তাই পাবেন না, তাই কাউকে
                মিথ্যা প্রতিশ্রুতি দেওয়া হয় না। আর এর পরে বন্ধ হলে বুকিংটা থেকেই
                যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Durability মানে Backup না",
          content: (
            <ContentParagraph>
              Durability আপনাকে বিদ্যুৎ চলে যাওয়া বা হঠাৎ Crash থেকে বাঁচায়। কিন্তু
              পুরো Disk নষ্ট হয়ে গেলে, বা কেউ ভুল করে সব Booking মুছে Commit করে
              দিলে, Durability উল্টো সেই ভুলটাকেও যত্ন করে টিকিয়ে রাখবে। সেই বিপদ
              থেকে বাঁচায় ষষ্ঠ কাজ, Backup। দুটো আলাদা জিনিস, দুটোই লাগে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "finding",
      subHeader: { index: "007", title: "Job 2: Finding Fast" },
      title: <SectionTitle>লাখ Row এর মধ্যে এক পলকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আজ Island Tours এর Database এ মাত্র ২৪টা বুকিং। পাঁচ বছর পর হয়তো
                পাঁচ লাখ। তখনো Customer যখন Email দিয়ে Login করবেন, তাঁর Row টা এক
                পলকে বের হতে হবে। পাঁচ লাখ লাইন একটা একটা পড়ে মেলানো সম্ভব, কিন্তু
                প্রতিটা Login এ সেটা করলে Website বসে যাবে।
              </ContentParagraph>
              <ContentParagraph>
                মোটা একটা বইয়ে কোনো বিষয় খুঁজতে আপনি প্রথম পাতা থেকে পড়া শুরু
                করেন না। বইয়ের শেষে সূচি দেখেন, যেখানে শব্দগুলো বর্ণানুক্রমে সাজানো
                আর পাশে পাতার নম্বর। কয়েক সেকেন্ডে ঠিক পাতায় পৌঁছে যান। DBMS ও
                ঠিক এরকম আলাদা একটা সূচি রাখতে পারে, যার নাম Index। Email এর উপর
                Index থাকলে পাঁচ লাখ Customer এর মধ্যেও একজনকে খুঁজতে মাত্র কয়েক ধাপ
                লাগে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় কৌশলটা আরও মজার। আপনি DBMS কে বলেন কী চাই, কীভাবে খুঁজবে
                তা বলেন না। DBMS এর ভেতরের একটা অংশ, যার নাম Planner, প্রতিটা প্রশ্ন
                দেখে নিজে হিসাব করে কোন পথে খুঁজলে সবচেয়ে কম কাজ হবে: Index ধরে
                যাবে, নাকি পুরো Table পড়ে ফেলাই সস্তা। ছোট Table এ প্রায়ই পুরোটা
                পড়াই দ্রুত, বড় Table এ Index। এই সিদ্ধান্ত Data বাড়ার সাথে সাথে
                নিজে থেকেই বদলায়, আপনার Code বদলাতে হয় না। Index আর Planner পুরো
                Module 13 জুড়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "rules",
      subHeader: { index: "008", title: "Job 3: Rules" },
      title: <SectionTitle>ভুল Data দরজাতেই আটকে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Spreadsheet এর সবচেয়ে বড় দুর্বলতা ছিল, সে কাউকে থামায় না। DBMS এর
                তৃতীয় কাজ ঠিক উল্টো: ভুল Data কে ঢোকার আগেই ফিরিয়ে দেওয়া। এর দুটো
                স্তর আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Data Type:</strong> প্রতিটা Column এর একটা ধরন থাকে।
                  seats Column এর ধরন সংখ্যা, তাই সেখানে পাঁচ শব্দটা লেখাই যায়
                  না। starts_on এর ধরন তারিখ, তাই ৩১ ফেব্রুয়ারি লেখা যায় না।
                </ListItem>
                <ListItem>
                  <strong>Constraint:</strong> ধরনের উপরে বাড়তি নিয়ম। Island
                  Tours এর bookings Table এ কয়েকটা নিয়ম বসানো আছে। seats অবশ্যই
                  শূন্যের বেশি। status হবে pending, confirmed বা cancelled, এই
                  তিনটার একটা। customers Table এ একই Email দুইবার চলবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিয়ম ভাঙা হলে কী হয়, নিজে দেখুন। নিচের বক্সে একটা বুকিং ঢোকানোর
                চেষ্টা লেখা আছে, যেখানে seats শূন্য। এই লেখাটা INSERT, যা আপনি
                Module 10 এ শিখবেন। এখন শুধু Run চাপুন আর উত্তরটা পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিয়ম ভাঙার চেষ্টা"
              query={`INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 0, 'confirmed', 0);`}
              caption={
                <>
                  উত্তরে আসবে ERROR: new row for relation &quot;bookings&quot;
                  violates check constraint &quot;bookings_seats_check&quot;।
                  মানে নতুন Row টা bookings Table এর seats এর নিয়ম ভেঙেছে, তাই
                  PostgreSQL কিছুই লেখেনি। seats এর জায়গায় 0 বদলে 2 করে আবার Run
                  চাপুন, এবার বুকিংটা ঢুকবে। তারপর Reset চাপলে সব আগের মতো হয়ে
                  যাবে।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখানে একটা গুরুত্বপূর্ণ জিনিস লক্ষ করুন। নিয়মটা লেখা আছে Database এর
              ভেতরে, App এর Code এ না। তাই Island Tours এর Website, Admin Panel,
              কোনো কর্মীর হাতে চালানো psql, বা ভবিষ্যতে বানানো কোনো Mobile App, যে
              পথ দিয়েই বুকিং আসুক, নিয়মটা সবার জন্য একই। একটা App এ ভুল থাকলেও
              ভুল Data ঢুকতে পারে না। Type আর Constraint এর পুরো জগৎ Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "many-users",
      subHeader: { index: "009", title: "Job 4: Many Users" },
      title: <SectionTitle>শেষ সিট, দুজন কর্মী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর অফিসে পাঁচজন কর্মী, Website এ একই সময়ে হয়তো একশো
                Customer। সবাই একই Database এর সাথে কথা বলছেন। একসাথে অনেকের কাজ
                সামলানোকে বলে Concurrency, আর এটাই সেই কাজ যেটা কোনো ফাইল কখনো ঠিকমতো
                করতে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে বিখ্যাত বিপদটা নিচের Lab এ। একটা সিট বাকি, দুজন কর্মী, দুজন
                Customer। প্রথমে শেয়ার করা ফাইল বেছে নিয়ে পরের ধাপ চাপতে থাকুন,
                তারপর PostgreSQL বেছে নিয়ে আবার। দুই ক্ষেত্রে শেষে কতগুলো বুকিং
                নিশ্চিত হলো, মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LastSeatLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফাইলের ক্ষেত্রে দুজনেই পুরনো একটা ছবির উপর সিদ্ধান্ত নিয়েছেন। দুজনেই
                দেখেছেন ১ সিট বাকি, কারণ দুজন যখন দেখছিলেন তখন সত্যিই ১ ছিল। ভুলটা
                কারো একার না, ভুলটা হলো দেখা আর লেখার মাঝখানে কেউ পাহারা দেয়নি।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL এর ক্ষেত্রে দুটো হাতিয়ার কাজ করেছে। প্রথমটা Transaction,
                মানে কয়েকটা কাজকে একসাথে বেঁধে রাখা, যাতে হয় সবগুলো হয়, নয়তো একটাও
                না। দ্বিতীয়টা Lock, মানে একটা Row যতক্ষণ একজন বদলাচ্ছে ততক্ষণ আরেকজন
                সেটা বদলাতে পারবেন না, অপেক্ষা করবেন। অপেক্ষা শেষে দ্বিতীয়জন সত্যিকারের
                নতুন অবস্থা দেখেন, পুরনো ছবি না। দুটো হাতিয়ারের পুরো গল্প Module 12
                এ, আর ঠিক এই শেষ সিটের সমস্যার চারটা সমাধান সেই মডিউলের শেষ লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "permissions-backup",
      subHeader: { index: "010", title: "Jobs 5 & 6" },
      title: <SectionTitle>কে কী দেখবে, আর বিপদের দিনের Copy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পঞ্চম কাজ পাহারা। Spreadsheet এর Link যাঁর কাছে ছিল, তিনিই সব দেখতে
                পেতেন। DBMS এ প্রতিটা ব্যবহারকারীর একটা আলাদা পরিচয় থাকে, যাকে বলে
                User বা Role, আর প্রতিটা Role এর জন্য আলাদা করে লেখা থাকে সে কোন
                Table পড়তে পারবে, কোনটায় লিখতে পারবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>হিসাবরক্ষক:</strong> payments আর bookings পড়তে পারেন,
                  কিছু বদলাতে পারেন না।
                </ListItem>
                <ListItem>
                  <strong>Guide দের Tool:</strong> শুধু departures আর নিজের ট্যুরের
                  Customer দের নাম দেখে। কারো Payment দেখে না।
                </ListItem>
                <ListItem>
                  <strong>Website এর API:</strong> বুকিং লিখতে পারে, কিন্তু কোনো
                  Table মুছে ফেলতে পারে না। কেউ API তে ঢুকে পড়লেও তাই পুরো Database
                  মুছে দেওয়ার ক্ষমতা পাবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রত্যেককে শুধু যতটুকু দরকার ততটুকু ক্ষমতা দেওয়ার এই নীতির নাম
                Least Privilege। Role বানানো, অনুমতি দেওয়া আর কেড়ে নেওয়া, আর SQL
                Injection এর মতো আক্রমণ থেকে বাঁচা, সব Module 16 এ।
              </ContentParagraph>
              <ContentParagraph>
                ষষ্ঠ কাজ বিপদের দিনের জন্য। কেউ ভুল করে একটা পুরো Table মুছে দিলেন,
                বা Server এর Disk নষ্ট হয়ে গেল। DBMS এর সাথে Backup নেওয়ার Tool থাকে,
                PostgreSQL এর ক্ষেত্রে যেমন pg_dump। আর WAL এর খাতা জমিয়ে রাখলে
                অতীতের যেকোনো নির্দিষ্ট মুহূর্তে, যেমন গতকাল বিকেল ৪টা ১২ মিনিটে,
                Database কে ফিরিয়ে নেওয়া যায়। এর নাম Point-in-time Recovery। Backup
                নেওয়া, ফিরিয়ে আনা আর নিয়মিত মহড়া দেওয়া Module 18 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "যে Backup কখনো ফিরিয়ে এনে দেখা হয়নি",
          content: (
            <ContentParagraph>
              অনেক কোম্পানি প্রতি রাতে Backup নেয়, কিন্তু কখনো সেটা থেকে Database
              ফিরিয়ে এনে দেখে না। তারপর বিপদের দিন আবিষ্কার করে Backup ফাইলটা অর্ধেক
              লেখা, বা ভুল জায়গায় যাচ্ছিল। Backup এর আসল পরীক্ষা Restore। এই কথাটা
              এখনই মনে গেঁথে রাখুন, Module 18 এ আবার আসবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "language",
      subHeader: { index: "011", title: "Job 7: A Language" },
      title: <SectionTitle>কী চাই বললেই হয়, কীভাবে আনবে সেটা DBMS এর মাথাব্যথা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ কাজটা বাকি সব কাজের দরজা। DBMS এর সাথে কথা বলতে একটা ভাষা লাগে।
                লাইব্রেরিয়ানকে আপনি বলেন, ২০২০ সালের পরে ছাপা সব বাংলা উপন্যাস চাই,
                লেখকের নাম অনুযায়ী সাজিয়ে। কোন তাকে যাবেন, কোন সূচি দেখবেন, সেটা
                আপনি বলেন না। লাইব্রেরিয়ান নিজে ঠিক করেন।
              </ContentParagraph>
              <ContentParagraph>
                Relational DBMS এর ভাষার নাম SQL, Structured Query Language। SQL এ
                আপনি লেখেন কী চান, কীভাবে খুঁজতে হবে তা লেখেন না। যেমন Saint Martin
                Island Escape ট্যুরের প্রতিটা তারিখে কত সিট খালি, তারিখ অনুযায়ী
                সাজিয়ে। এই ধরনের ভাষাকে বলে Declarative, মানে যা চাই তা ঘোষণা করা।
                SQL কে কাছ থেকে দেখবেন এই মডিউলের Lesson 05 এ, আর লেখা শুরু করবেন
                Module 03 থেকে।
              </ContentParagraph>
              <ContentParagraph>
                তবু একটা ঝলক এখনই দেখে নিন। নিচের প্রশ্নটা ঠিক উপরের বাংলা বাক্যটাই,
                SQL এ লেখা। Syntax বোঝার চেষ্টা করবেন না, শুধু Run চাপুন আর দেখুন
                লেখাটা কতটা মানুষের ভাষার কাছাকাছি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রথম প্রশ্ন"
              query={`SELECT starts_on, seats_left
FROM departures
WHERE tour_id = 1
ORDER BY starts_on;`}
              caption={
                <>
                  tour_id 1 মানে Saint Martin Island Escape। চারটা তারিখ আসবে,
                  প্রতিটার পাশে খালি সিটের সংখ্যা। ২০২৬ এর ২০ নভেম্বরের পাশে লেখা
                  থাকবে 14, ঠিক যে সংখ্যাটা Theory তে রিয়া দেখেছিলেন। খেয়াল করুন,
                  কোথাও লেখা নেই কীভাবে খুঁজতে হবে, কোন ফাইল খুলতে হবে।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "সব DBMS এর ভাষা SQL না",
          content: (
            <ContentParagraph>
              Relational DBMS গুলো, যেমন PostgreSQL আর MySQL, SQL বলে। কিন্তু
              MongoDB এর মতো কিছু DBMS এর নিজস্ব ভাষা আছে, যেখানে প্রশ্ন লেখা হয়
              JSON এর মতো করে। কোন DBMS কোন ধরনের, সেটা পরের লেসনের বিষয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "rdbms",
      subHeader: { index: "012", title: "RDBMS & Products" },
      title: <SectionTitle>RDBMS কী, আর বাজারে কারা আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SQL শেখার প্রায় যেকোনো ভিডিও বা বইয়ে প্রথম দশ মিনিটেই একটা শব্দ
                আসে: RDBMS। নিচের Resources এ দেওয়া MySQL ভিডিও কোর্সটাতেও শুরুতেই
                এসেছে। RDBMS মানে
                Relational Database Management System। শব্দটা ভাঙলে মানেটা সহজ।
                DBMS আপনি এখন চেনেন। Relational মানে সেই DBMS Data রাখে Table এ,
                মানে Row আর Column এর ঘরে, আর এক Table এর Row আরেক Table এর Row কে
                একটা নম্বর দিয়ে চিনে রাখে।
              </ContentParagraph>
              <ContentParagraph>
                যেমন Island Tours এর bookings Table এর প্রতিটা Row এ customer_id
                নামে একটা ঘর আছে। সেখানে লেখা থাকে customers Table এর কোন Row টা
                এই বুকিংয়ের মালিক। Table গুলোর মধ্যে এই সম্পর্ক বা Relation থেকেই
                নাম Relational। Table, Row, Column আর এই সম্পর্ক রাখার নম্বর, মানে
                Key, এগুলো Lesson 04 এর পুরো বিষয়। এখানে শুধু নামটা পরিষ্কার হলো।
              </ContentParagraph>
              <ContentParagraph>
                এবার বাজারের দিকে তাকাই। নিচের তালিকার নামগুলো চাকরির বিজ্ঞাপনে,
                Cloud এর Dashboard এ আর Architecture এর ছবিতে বারবার দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["DBMS", "ধরন", "কে বানায়, কীভাবে পাওয়া যায়", "কোথায় দেখা হবে"],
          rows: [
            [
              "PostgreSQL",
              "Relational",
              "একটা স্বাধীন Open Source সম্প্রদায়, বিনামূল্যে",
              "এই ট্র্যাকের মূল DBMS, Island Tours এর Database",
            ],
            [
              "MySQL",
              "Relational",
              "Oracle কোম্পানির মালিকানায়, Open Source সংস্করণ বিনামূল্যে",
              "অসংখ্য Website, আপনার দেখা MySQL কোর্স",
            ],
            ["MariaDB", "Relational", "MySQL থেকে আলাদা হয়ে আসা Open Source শাখা", "অনেক Linux Server আর Hosting"],
            [
              "SQLite",
              "Relational",
              "আলাদা Server ছাড়া, একটা ফাইলেই পুরো Database, বিনামূল্যে",
              "আপনার ফোনের Contact, Browser এর ভেতরে",
            ],
            ["SQL Server", "Relational", "Microsoft এর বাণিজ্যিক DBMS", "ব্যাংক আর বড় অফিসের Windows ভিত্তিক সিস্টেম"],
            ["Oracle Database", "Relational", "Oracle এর বাণিজ্যিক DBMS", "ব্যাংক, টেলিকম, সরকারি বড় সিস্টেম"],
            ["MongoDB", "Document, Relational না", "MongoDB কোম্পানি", "JSON এর মতো Document রাখার কাজে"],
            ["Redis", "Key-Value, Relational না", "Memory তে চলা দ্রুত Data Store", "Cache আর Session রাখার কাজে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম ছয়টা Relational, তাই সবার ভাষা SQL। এদের একটায় SQL শিখলে বাকি
                সবগুলোতে কাজ চালিয়ে নিতে পারবেন, শুধু কিছু লেখার নিয়ম আলাদা। এই
                ছোট আলাদা নিয়মগুলোকে বলে Dialect, আর PostgreSQL আর MySQL এর তফাত
                Lesson 05 এ পাশাপাশি দেখবেন। শেষ দুটো Relational না। এদের ধরন আর
                কখন এগুলো বেছে নিতে হয়, পরের লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                এই ট্র্যাক PostgreSQL দিয়ে কেন? কারণ PostgreSQL বিনামূল্যে, কোনো
                একটা কোম্পানির হাতে বাঁধা না, SQL এর মানদণ্ড ঘনিষ্ঠভাবে মেনে চলে, আর
                Table এর বাইরেও অনেক কিছু পারে, যেমন JSON রাখা বা AI এর কাজে লাগা
                Data। Island Tours ও PostgreSQL ই চালায়। আর PostgreSQL ভালো করে জানলে
                MySQL এ যাওয়া খুব ছোট একটা লাফ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>একটা আসল PostgreSQL এর সাথে প্রথম কথা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার কথা না, হাতে কলমে। এই পাতার Query বক্সগুলোর ভেতরে একটা আসল
                PostgreSQL চলছে, আপনার Browser এর ভেতরে। প্রথমবার Run চাপলে কয়েক
                সেকেন্ড লাগবে, কারণ Browser তখন PostgreSQL টা নামিয়ে চালু করছে।
                তারপর থেকে প্রতিটা প্রশ্নের উত্তর আসবে চোখের পলকে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম প্রশ্নটা DBMS কে তার নিজের পরিচয় জিজ্ঞেস করা। Run চাপুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="DBMS, আপনি কে?"
              query={`SELECT version();`}
              caption={
                <>
                  উত্তরের শুরুতে লেখা থাকবে PostgreSQL 18.3, তারপর PGlite। PGlite
                  হলো সেই একই PostgreSQL, যাকে Browser এর ভেতরে চলার মতো করে
                  বানানো হয়েছে। আপনার নিজের মেশিনে বা Island Tours এর Server এ
                  PostgreSQL চলে আলাদা একটা Process হিসেবে, কিন্তু SQL এর দিক থেকে
                  দুটো হুবহু এক।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Server এর দুটো জিনিস দেখি, যা আগের অংশে ছবিতে দেখেছিলেন: সে কোন
              Port নম্বর নিয়ে চলছে, আর তার ভেতরে কতগুলো Database আছে। বক্সে দুটো
              আলাদা প্রশ্ন আছে, সেমিকোলন দিয়ে আলাদা করা। একবার Run চাপলেই দুটোর উত্তর
              আসবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এক Server, অনেক Database"
              query={`SHOW port;
SELECT datname FROM pg_database ORDER BY datname;`}
              caption={
                <>
                  প্রথম উত্তর 5432, PostgreSQL এর পরিচিত Port। তবে Browser এর
                  ভেতরে আসলে কোনো Network Port খোলা হয় না, Setting এ শুধু নম্বরটা
                  লেখা থাকে। দ্বিতীয় উত্তরে তিনটা Database: postgres, template0 আর
                  template1। একদম নতুন একটা Server এও এই তিনটা থাকে। এখানে Island
                  Tours এর Table গুলো রাখা আছে postgres Database এর ভেতরে। নিজের
                  মেশিনে আপনি এর জন্য island_tours নামে আলাদা একটা Database
                  বানাবেন। template0 আর template1 কেন আছে, Module 02 তে দেখবেন।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ভাঙতে ভয় পাবেন না",
          content: (
            <ContentParagraph>
              বক্সের লেখা ইচ্ছামতো বদলান, ভুল লিখে Error দেখুন, কিছু মুছে ফেলুন।
              এই Database টা শুধু আপনার Browser এ, আর কারো না। Reset চাপলে সব আবার
              শুরুর অবস্থায় ফিরে যায়, আর Page নতুন করে খুললেও তাই। শেখার সবচেয়ে
              ভালো উপায় ভেঙে দেখা।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর একটা দিনে DBMS এর সাতটা কাজ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর একটা VPS এ PostgreSQL এর একটা Server চলে, Port
                5432 এ। তার ভেতরে island_tours নামের Database, যার আটটা Table আপনি
                উপরের বাক্স খুলে দেখতে পারেন। এবার এই Server এর একটা সাধারণ দিন
                কল্পনা করুন, আর দেখুন সাতটা কাজের প্রতিটা কখন ঘটে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সকাল ৯টা, দ্রুত খোঁজা:</strong> Website এ প্রথম
                  Customer ট্যুরের তালিকা খুললেন। API PostgreSQL কে জিজ্ঞেস করল,
                  কোন কোন ট্যুর চালু আছে আর তাদের সামনের তারিখ কবে। Planner পথ বেছে
                  নিল, উত্তর গেল কয়েক Millisecond এ।
                </ListItem>
                <ListItem>
                  <strong>সকাল ১০টা, নিয়ম পাহারা:</strong> Admin Panel এ এক কর্মী
                  ভুল করে সিটের ঘরে 0 লিখে বুকিং সেভ করতে চাইলেন। PostgreSQL
                  bookings_seats_check এর নিয়ম দেখিয়ে ফিরিয়ে দিল। Panel টা Error টা
                  বাংলায় দেখাল, সিট অন্তত একটা হতে হবে।
                </ListItem>
                <ListItem>
                  <strong>দুপুর ১টা, একসাথে অনেকে:</strong> ঈদের ছুটির আগে Sajek
                  এর একটা তারিখে শেষ তিনটা সিটের জন্য একই মিনিটে পাঁচটা Request এল।
                  PostgreSQL তাদের একটা একটা করে সাজাল। তিনজন পেলেন, দুজন জানলেন
                  সিট নেই।
                </ListItem>
                <ListItem>
                  <strong>দুপুর ১টা ১ মিনিট, টেকসই রাখা:</strong> ঠিক তখনই VPS এর
                  Provider এর দিক থেকে কয়েক সেকেন্ডের জন্য Server বন্ধ হয়ে গেল।
                  চালু হয়ে PostgreSQL তার WAL পড়ে নিল। যে তিনটা বুকিং Commit হয়েছিল,
                  সব আছে। যেটা Commit এর আগে আটকে গিয়েছিল, সেই Customer নিশ্চিত হওয়ার
                  বার্তা পাননি, আবার চেষ্টা করলেন।
                </ListItem>
                <ListItem>
                  <strong>বিকেল ৪টা, কে কী দেখবে:</strong> হিসাবরক্ষক মাসের Payment
                  এর Report দেখলেন। একই সময়ে একজন Guide তাঁর Tool এ পরের সপ্তাহের
                  যাত্রীদের নাম দেখলেন, কিন্তু কারো Payment দেখতে পেলেন না।
                </ListItem>
                <ListItem>
                  <strong>রাত ২টা, বিপদের দিনের Copy:</strong> একটা নির্ধারিত কাজ
                  pg_dump চালিয়ে পুরো Database এর Backup নিয়ে অন্য একটা জায়গায়
                  পাঠিয়ে দিল।
                </ListItem>
                <ListItem>
                  <strong>সারাদিন, প্রশ্ন করার ভাষা:</strong> উপরের প্রতিটা ঘটনার
                  পেছনে API, Admin Panel বা Report, সবাই PostgreSQL কে SQL এ প্রশ্ন
                  পাঠিয়েছে। কেউ কখনো Disk এর একটা ফাইলও খোলেনি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আপনার my-tours এর জন্য প্রথম সিদ্ধান্ত",
          content: (
            <ContentParagraph>
              আপনি যখন নিজের my-tours বানাবেন, প্রথম সিদ্ধান্তই হবে Data কোথায়
              থাকবে। উত্তর আগেই ঠিক: একটা PostgreSQL Server, তার ভেতরে my_tours
              নামের একটা Database, আর App সবসময় SQL এ প্রশ্ন করবে, কখনো ফাইল ছোঁবে
              না। Server টা ইনস্টল করা Module 02 এর প্রথম লেসন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "request-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>রিয়ার প্রশ্নটা, শুরু থেকে শেষ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Theory এর সেই ছোট ঘটনাটায় ফিরে যাই। রিয়া Admin Panel এ Saint Martin
              এর ট্যুরটা খুললেন আর এক সেকেন্ডে উত্তর পেলেন, ১৪টা সিট খালি। এই এক
              সেকেন্ডে ঠিক কী কী ঘটল, ধাপে ধাপে। প্রতিটা ধাপে খেয়াল করুন সাতটা কাজের
              কোনটা কাজ করছে। App কীভাবে Connection খোলে আর প্রশ্নটা তারে চড়ে কীভাবে
              যায়, তার বিস্তারিত Lesson 06 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "রিয়া ক্লিক করেন",
              description:
                "রিয়া Admin Panel এ Saint Martin Island Escape খোলেন। Panel টা Island Tours এর API কে বলে, এই ট্যুরের তারিখগুলো আর খালি সিট দরকার।",
            },
            {
              title: "API প্রশ্নটা SQL এ লেখে",
              description:
                "API নিজে কোনো Data রাখে না। সে প্রশ্নটা SQL এ লিখে PostgreSQL এর Server এর কাছে পাঠায়, Port 5432 এ, island_tours Database এর নাম উল্লেখ করে। এখানে কাজ করছে সপ্তম কাজ, প্রশ্ন করার ভাষা।",
            },
            {
              title: "প্রশ্নটা বোঝে আর পথ ঠিক করে",
              description:
                "API যখন Connect করেছিল, তখনই PostgreSQL জেনে নিয়েছিল সে কোন Role। এবার PostgreSQL লেখাটা Parse করে, মানে বানান আর ব্যাকরণ ঠিক আছে কিনা আর Table গুলো আছে কিনা দেখে। তারপর Planner ঠিক করে কোন পথে খুঁজবে। দ্বিতীয় কাজ, দ্রুত খোঁজা।",
            },
            {
              title: "অনুমতি মিলিয়ে নেয়",
              description:
                "আসলে খোঁজা শুরুর আগে PostgreSQL দেখে নেয়, এই Role এর departures Table পড়ার অনুমতি আছে কিনা। অনুমতি না থাকলে এখানেই permission denied বলে থেমে যেত। পঞ্চম কাজ, কে কী দেখবে।",
            },
            {
              title: "Data আনে",
              description:
                "PostgreSQL দরকারি Row গুলো আনে। সম্প্রতি ব্যবহার হওয়া Data সে Memory তে রেখে দেয়, তাই অনেক সময় Disk পর্যন্ত যেতেই হয় না। এই মুহূর্তে আরেকজন কর্মী একই Row বদলাচ্ছেন কিনা, সেটাও সে হিসাবে রাখে, যাতে রিয়া আধখানা বদলানো কোনো অবস্থা না দেখেন। চতুর্থ কাজ, একসাথে অনেকে।",
            },
            {
              title: "উত্তর ফেরত যায়",
              description:
                "চারটা Row, প্রতিটায় একটা তারিখ আর খালি সিটের সংখ্যা, API র কাছে ফেরত যায়। API সেগুলো সাজিয়ে Panel এ পাঠায়, আর রিয়া দেখেন ২০ নভেম্বর: ১৪।",
            },
            {
              title: "রিয়া বুক করেন",
              description:
                "Customer রাজি হলে রিয়া দুটো সিট বুক করেন। এবার API একটা নতুন বুকিং লেখার আর সিট দুটো কমানোর প্রশ্ন পাঠায়। PostgreSQL আগে নিয়মগুলো মিলিয়ে দেখে, seats শূন্যের বেশি, status বৈধ। তৃতীয় কাজ, নিয়ম পাহারা।",
            },
            {
              title: "Commit, তারপর নিশ্চিত",
              description:
                "PostgreSQL পরিবর্তনগুলো আগে WAL এ পাকা করে, তারপর বলে সফল। কেবল তখনই API Panel এ নিশ্চিত দেখায়, আর সংখ্যাটা ১২ হয়ে যায়। প্রথম কাজ, টেকসই রাখা। রাতে এই বুকিংটাও Backup এ চলে যাবে, ষষ্ঠ কাজ।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুল ধারণাগুলো সবার একবার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Database মানে একটা বড় Excel ফাইল:</strong> দেখতে কাছাকাছি,
                কারণ দুটোতেই Row আর Column। কিন্তু Excel ফাইল শুধু Data রাখে। Database
                এর পাশে একটা DBMS দাঁড়িয়ে থাকে, যে নিয়ম মানায়, একসাথে অনেককে
                সামলায় আর Crash এর পরেও Data টিকিয়ে রাখে।
              </ListItem>
              <ListItem>
                <strong>MySQL একটা Database:</strong> অর্ধেক সত্য। MySQL একটা DBMS,
                মানে Program। আপনার Website এর Data যেখানে থাকে, সেটা MySQL এর
                ভেতরে বানানো একটা Database। কাজের জায়গায় দুটোকে একই নামে ডাকা হয়,
                কিন্তু আপনি পার্থক্যটা জানবেন।
              </ListItem>
              <ListItem>
                <strong>এক Server মানে এক Database:</strong> না। একটা PostgreSQL
                Server এর ভেতরে অনেকগুলো Database থাকতে পারে, যেমন Playground এ দেখলেন।
                তাই Connect করার সময় Server এর ঠিকানার পাশাপাশি Database এর নামও বলে
                দিতে হয়।
              </ListItem>
              <ListItem>
                <strong>Data ফাইল খুলে সরাসরি ঠিক করে নেব:</strong> কখনো না। Data
                Directory এর ফাইলের ভেতরের সাজানো শুধু PostgreSQL বোঝে। হাতে বদলালে
                Database নষ্ট হতে পারে, আর কোনো নিয়ম, Lock বা Permission তখন কাজ করে
                না।
              </ListItem>
              <ListItem>
                <strong>নিয়ম তো App এর Code এ আছে, Database এ লাগবে না:</strong>
                App এর নিয়ম শুধু সেই App এর জন্য। কাল একটা নতুন Tool এলে, বা কেউ
                psql থেকে সরাসরি কিছু লিখলে, সেই নিয়ম কাজ করবে না। Database এর
                Constraint সবার জন্য একসাথে কাজ করে। দুই জায়গাতেই রাখাই নিরাপদ।
              </ListItem>
              <ListItem>
                <strong>Durability আছে, তাই Backup লাগবে না:</strong> Durability
                Crash থেকে বাঁচায়। ভুল করে মুছে Commit করলে, বা Disk নষ্ট হলে, শুধু
                Backup বাঁচায়।
              </ListItem>
              <ListItem>
                <strong>DBMS আছে, তাই একসাথে অনেকে কাজ করলে আর কিছু ভাবতে হবে না:</strong>{" "}
                DBMS হাতিয়ার দেয়, কিন্তু App কে ঠিকভাবে প্রশ্ন করতে হয়। আগে পড়ে
                পরে আলাদা করে লিখলে Database থাকা সত্ত্বেও শেষ সিট দুইবার বিক্রি হতে
                পারে। Module 12 এ এর ঠিক উপায় দেখবেন।
              </ListItem>
            </ContentList>
          ),
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
                <strong>What Is PostgreSQL?</strong>, PostgreSQL এর অফিসিয়াল
                Docs এর প্রথম পাতা। ছোট, আর এই লেসনের অনেক কথা মূল উৎসে দেখে
                নিতে পারবেন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/intro-whatis.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/intro-whatis.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Architectural Fundamentals</strong>, PostgreSQL এর
                Tutorial এর অংশ। Client আর Server আলাদা Process, আর Server কীভাবে
                অনেক Client কে একসাথে সামলায়, এই লেসনের ছবিটাই অফিসিয়াল ভাষায়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/tutorial-arch.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/tutorial-arch.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Write-Ahead Logging</strong>, PostgreSQL এর Docs এ WAL এর
                পরিচয়। এখন পুরোটা না বুঝলেও চলবে, শুধু দেখে রাখুন Durability এর
                প্রতিশ্রুতি কীভাবে রাখা হয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/wal-intro.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/wal-intro.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Appropriate Uses For SQLite</strong>, SQLite এর নিজের লেখা।
                কোন কাজে আলাদা Server ছাড়া এক ফাইলের Database সেরা, আর কখন না। DBMS
                এর ধরন বোঝার জন্য চমৎকার পাঠ।{" "}
                <a
                  href="https://www.sqlite.org/whentouse.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  sqlite.org/whentouse.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Database, Wikipedia</strong>, Database আর DBMS এর ইতিহাস
                আর ধরনগুলোর একটা বড় মানচিত্র।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Database"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  en.wikipedia.org/wiki/Database
                </a>
              </ListItem>
              <ListItem>
                <strong>একটা পূর্ণ SQL ভিডিও কোর্স</strong>, MySQL দিয়ে বানানো। এর শুরুর দিকের অংশে, মোটামুটি ১ মিনিট ৪৮ সেকেন্ড
                থেকে ৩ মিনিট ৪৫ সেকেন্ড পর্যন্ত, Database, DBMS আর RDBMS এর পরিচয়
                আছে। এই লেসন পড়ার পর অংশটা দেখলে শব্দগুলো একদম পরিচিত লাগবে।{" "}
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
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  Data মানে লিখে রাখা তথ্য। Database মানে সাজানো Data এর সংগ্রহ,
                  যা খুঁজে পাওয়া, বদলানো আর ভরসা করার মতো করে রাখা।
                </ListItem>
                <ListItem>
                  সাজানো মানে তিনটা জিনিস: আগে থেকে ঠিক করা গঠন (Schema), প্রতিটা
                  জিনিসের একই আকার, আর কোনো ঘর ধরে খোঁজার উপায়।
                </ListItem>
                <ListItem>
                  DBMS হলো Program, লাইব্রেরিয়ান। কেউ Database এর ফাইল সরাসরি ছোঁয়
                  না, সবাই DBMS কে প্রশ্ন পাঠায়।
                </ListItem>
                <ListItem>
                  DBMS হলো Software, Database Server হলো চালু থাকা সেই Software এর
                  Process যা একটা Port এ অপেক্ষা করে (PostgreSQL এর 5432), আর
                  Database হলো Server এর ভেতরে একটা নাম দেওয়া সংগ্রহ। এক Server,
                  অনেক Database।
                </ListItem>
                <ListItem>
                  DBMS এর সাতটা কাজ: টেকসই রাখা, দ্রুত খোঁজা, নিয়ম পাহারা, একসাথে
                  অনেককে সামলানো, কে কী দেখবে, বিপদের দিনের Copy, আর প্রশ্ন করার
                  ভাষা।
                </ListItem>
                <ListItem>
                  Commit মানে পরিবর্তনটা পাকা। PostgreSQL আগে WAL এ লেখে, তারপর সফল
                  বলে। Durability Crash থেকে বাঁচায়, Backup বাঁচায় ভুল আর Disk নষ্ট
                  হওয়া থেকে।
                </ListItem>
                <ListItem>
                  নিয়ম Database এর ভেতরে থাকলে যে পথ দিয়েই Data আসুক, নিয়ম সবার
                  জন্য একই।
                </ListItem>
                <ListItem>
                  RDBMS মানে Relational DBMS: Data থাকে Table এ, আর Table গুলো
                  একে অপরকে নম্বর দিয়ে চেনে। PostgreSQL, MySQL, SQLite, SQL Server,
                  Oracle সবাই RDBMS, সবার ভাষা SQL। MongoDB আর Redis না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা কথা এসেছে: Relational না এমন DBMS ও আছে, যেমন
                MongoDB আর Redis। তারা Data রাখে একদম অন্য আকারে, আর কিছু কাজে তারাই
                সেরা। পরের লেসনে Database এর পুরো পরিবারটা দেখবেন: Document,
                Key-Value, Graph, Time-series, Vector আর আরও কয়েকটা, প্রতিটার একটা
                Island Tours উদাহরণসহ। আর বুঝবেন কেন এই ট্র্যাক শুরু হচ্ছে Relational
                দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "কোথায় দেখবেন"],
    rows: [
      ["Data", "লিখে রাখা তথ্য: নাম, সংখ্যা, তারিখ, দাম", "যেকোনো Table এর একটা ঘর"],
      ["Database", "সাজানো Data এর সংগ্রহ, খোঁজা আর ভরসার মতো করে রাখা", "island_tours"],
      ["DBMS", "Database রাখা, খোঁজা আর পাহারা দেওয়ার Program", "PostgreSQL, MySQL, SQLite"],
      ["Database Server", "চালু থাকা DBMS এর Process, একটা Port এ অপেক্ষায়", "SHOW port; এর উত্তর 5432"],
      ["এক Server, অনেক Database", "একটা Server এর ভেতরে নাম দেওয়া অনেক সংগ্রহ", "SELECT datname FROM pg_database;"],
      ["Durability আর Commit", "সফল বলা মানে Disk এ পাকা, আগে WAL এ লেখা", "বুকিং নিশ্চিত হওয়ার মুহূর্ত"],
      ["Index আর Planner", "সূচি দিয়ে দ্রুত খোঁজা, পথ বাছাই DBMS এর নিজের", "Module 13"],
      ["Constraint", "ভুল Data কে ঢোকার আগেই ফিরিয়ে দেওয়া নিয়ম", "bookings_seats_check"],
      ["Concurrency", "একসাথে অনেককে এমনভাবে সামলানো যেন একটার পর একটা ঘটেছে", "শেষ সিটের Lab"],
      ["Role আর Permission", "কে কোন Table পড়বে বা লিখবে", "Module 16"],
      ["Backup", "ভুল আর Disk নষ্ট হওয়া থেকে বাঁচার Copy, আসল পরীক্ষা Restore", "pg_dump, Module 18"],
      ["SQL", "Relational DBMS এর ভাষা, কী চাই বলা, কীভাবে না", "SELECT starts_on, seats_left ..."],
      ["RDBMS", "Data কে Table এ রাখা DBMS, Table গুলো নম্বর দিয়ে জোড়া", "Lesson 04"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর ক্ষেত্রে নিচের কোনটা DBMS?",
        options: [
          {
            key: "A",
            text: "island_tours",
            isCorrect: false,
            explanation: "এটা একটা Database এর নাম, মানে Server এর ভেতরে নাম দেওয়া Data এর সংগ্রহ।",
          },
          {
            key: "B",
            text: "PostgreSQL",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL হলো Program, যে Database রাখে, খোঁজে আর পাহারা দেয়। এটাই DBMS।",
          },
          {
            key: "C",
            text: "bookings",
            isCorrect: false,
            explanation: "এটা island_tours Database এর ভেতরের একটা Table।",
          },
          {
            key: "D",
            text: "যে VPS এ সবকিছু চলে",
            isCorrect: false,
            explanation: "VPS হলো মেশিন। DBMS সেই মেশিনে চলা একটা Program।",
          },
        ],
      },
      {
        id: 2,
        text: "জুতার বাক্সে রাখা রসিদ আর ঘর কাটা হিসাবের খাতা, দুটোতেই বুকিংয়ের তথ্য আছে। খাতাটা Database এর কাছাকাছি কেন?",
        options: [
          {
            key: "A",
            text: "খাতায় বেশি তথ্য ধরে",
            isCorrect: false,
            explanation: "পরিমাণ এখানে আসল কথা না। বাক্সেও একই তথ্য আছে।",
          },
          {
            key: "B",
            text: "খাতায় প্রতিটা বুকিং একই গঠনে, একই ঘরে লেখা, তাই কোনো ঘর ধরে খোঁজা আর গোনা যায়",
            isCorrect: true,
            explanation:
              "ঠিক। আগে থেকে ঠিক করা গঠন, প্রতিটা জিনিসের একই আকার আর খোঁজার উপায়, এই তিনটাই সাজানো Data এর চিহ্ন।",
          },
          {
            key: "C",
            text: "খাতা কাগজে, বাক্স কার্ডবোর্ডে",
            isCorrect: false,
            explanation: "উপাদানে কিছু যায় আসে না। সাজানোর ধরনটাই আসল।",
          },
          {
            key: "D",
            text: "খাতা ভুল Data ঢুকতে দেয় না",
            isCorrect: false,
            explanation: "খাতা কাউকে থামায় না। ভুল Data আটকানো DBMS এর কাজ, খাতার না।",
          },
        ],
      },
      {
        id: 3,
        text: "একজন সহকর্মী বললেন, একটা বুকিংয়ের তারিখ ভুল, PostgreSQL এর Data Directory তে ফাইল খুলে ঠিক করে দিই। কেন এটা বিপজ্জনক?",
        options: [
          {
            key: "A",
            text: "ফাইলগুলো Password দিয়ে বন্ধ, খোলা যায় না",
            isCorrect: false,
            explanation: "যথেষ্ট অনুমতি থাকলে ফাইল খোলা যায়। সমস্যা অন্য জায়গায়।",
          },
          {
            key: "B",
            text: "ফাইলের ভেতরের সাজানো শুধু PostgreSQL বোঝে। হাতে বদলালে Database নষ্ট হতে পারে, আর নিয়ম, Lock বা Permission কিছুই তখন কাজ করে না",
            isCorrect: true,
            explanation:
              "ঠিক। DBMS কে পাশ কাটিয়ে গেলে তার সাতটা কাজের কোনোটাই আপনাকে রক্ষা করে না। ঠিক করার উপায় DBMS কে SQL এ বলা।",
          },
          {
            key: "C",
            text: "এতে কোনো বিপদ নেই, শুধু একটু ধীর",
            isCorrect: false,
            explanation: "বিপদ আছে, আর বড়। একটা ভুল Byte পুরো Table অপাঠ্য করে দিতে পারে।",
          },
          {
            key: "D",
            text: "Data Directory বলে কিছু নেই, Data থাকে শুধু RAM এ",
            isCorrect: false,
            explanation: "Data থাকে Disk এ, Data Directory তে। তাই তো বিদ্যুৎ গেলেও থেকে যায়।",
          },
        ],
      },
      {
        id: 4,
        text: "রিয়া বুক করলেন, PostgreSQL বলল সফল, আর ঠিক তার পরের সেকেন্ডে Server এর বিদ্যুৎ চলে গেল। Server আবার চালু হলে কী দেখা যাবে?",
        options: [
          {
            key: "A",
            text: "বুকিংটা থাকবে, কারণ সফল বলার আগেই PostgreSQL পরিবর্তনটা WAL এ Disk এ লিখে রেখেছিল",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই Durability। Commit শেষ মানে পাকা, চালু হয়ে PostgreSQL WAL মিলিয়ে নেয়।",
          },
          {
            key: "B",
            text: "বুকিংটা হারিয়ে যাবে, কারণ সেটা RAM এ ছিল",
            isCorrect: false,
            explanation: "Spreadsheet এ এমন হতো। DBMS সফল বলার আগেই Disk এ পাকা করে।",
          },
          {
            key: "C",
            text: "অর্ধেক বুকিং থাকবে, সিট কমবে কিন্তু বুকিং লেখা থাকবে না",
            isCorrect: false,
            explanation: "Transaction এর কারণে হয় পুরোটা থাকে, নয়তো কিছুই না। অর্ধেক অবস্থা থাকে না।",
          },
          {
            key: "D",
            text: "Backup থেকে Restore না করলে কিছুই থাকবে না",
            isCorrect: false,
            explanation: "Crash এর পর ফেরার জন্য Backup লাগে না, WAL ই যথেষ্ট। Backup লাগে Disk নষ্ট হলে বা ভুল মুছে ফেললে।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা VPS এ PostgreSQL চলছে, Port 5432 এ। তার ভেতরে island_tours আর my_tours নামে দুটো Database আপনি বানিয়েছেন। এখানে কয়টা DBMS আর কয়টা Database Server?",
        options: [
          {
            key: "A",
            text: "দুটো DBMS, দুটো Server",
            isCorrect: false,
            explanation: "প্রতিটা Database এর জন্য আলাদা Server লাগে না।",
          },
          {
            key: "B",
            text: "একটা DBMS, একটা Server, আর তার ভেতরে আপনার বানানো দুটো Database",
            isCorrect: true,
            explanation:
              "ঠিক। এক Server, অনেক Database। এর সাথে postgres এর মতো শুরু থেকে থাকা কয়েকটা Database ও থাকবে।",
          },
          {
            key: "C",
            text: "একটা DBMS, দুটো Server",
            isCorrect: false,
            explanation: "Server একটাই Process, Port 5432 এ। দুটো Database তার ভেতরে।",
          },
          {
            key: "D",
            text: "কোনো Server নেই, Database গুলো নিজেরাই চলে",
            isCorrect: false,
            explanation: "Database নিজে চলে না। চালু থাকে DBMS এর Process, মানে Server।",
          },
        ],
      },
      {
        id: 6,
        text: "Query বক্সে seats 0 দিয়ে একটা বুকিং ঢোকানোর চেষ্টায় ERROR এল: violates check constraint \"bookings_seats_check\"। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "বুকিংটা ঢুকেছে, শুধু একটা সতর্কবার্তা এসেছে",
            isCorrect: false,
            explanation: "ERROR মানে কিছুই লেখা হয়নি। সতর্কবার্তা হলে Warning লেখা থাকত।",
          },
          {
            key: "B",
            text: "Database এর ভেতরে লেখা একটা নিয়ম, seats শূন্যের বেশি হতে হবে, ভাঙা হয়েছে, তাই PostgreSQL কিছুই লেখেনি",
            isCorrect: true,
            explanation:
              "ঠিক। এটাই নিয়ম পাহারার কাজ। নিয়মটা Database এ থাকায় যে পথ দিয়েই বুকিং আসুক, সবার জন্য খাটে।",
          },
          {
            key: "C",
            text: "PostgreSQL এ সমস্যা হয়েছে, আবার চেষ্টা করলে ঢুকে যাবে",
            isCorrect: false,
            explanation: "যতবারই চেষ্টা করুন, একই Data একই নিয়ম ভাঙবে।",
          },
          {
            key: "D",
            text: "bookings Table টা নেই",
            isCorrect: false,
            explanation: "Table না থাকলে Error হতো relation does not exist।",
          },
        ],
      },
      {
        id: 7,
        text: "শেষ সিটের Lab এ PostgreSQL এর বেলায় দ্বিতীয় কর্মী সিট পেলেন না। কোনটা এর সবচেয়ে সঠিক ব্যাখ্যা?",
        options: [
          {
            key: "A",
            text: "PostgreSQL দ্বিতীয় Request টা র‍্যান্ডমভাবে বাতিল করে দেয়",
            isCorrect: false,
            explanation: "কিছুই র‍্যান্ডম না। দ্বিতীয় Request অপেক্ষা করেছে আর তারপর সত্যি অবস্থা দেখেছে।",
          },
          {
            key: "B",
            text: "প্রথম জনের কাজের সময় Row টা Lock ছিল। দ্বিতীয় Request অপেক্ষা করল, তারপর নতুন মান 0 দেখে শর্ত মেলাতে পারল না",
            isCorrect: true,
            explanation:
              "ঠিক। Transaction আর Lock। আর মনে রাখবেন, এটা কাজ করেছে কারণ App শর্ত আর বদল একসাথে পাঠিয়েছিল। ভুলভাবে প্রশ্ন করলে Database থাকলেও একই ভুল হতে পারে।",
          },
          {
            key: "C",
            text: "দ্বিতীয় কর্মীর Permission ছিল না",
            isCorrect: false,
            explanation: "দুজনেরই অনুমতি ছিল। সমস্যাটা একসাথে কাজ করার, অনুমতির না।",
          },
          {
            key: "D",
            text: "ফাইলের মতো এখানেও যে পরে Save করে সে জেতে",
            isCorrect: false,
            explanation: "ফাইলে তাই হয়, আর সেটাই ভুল। DBMS এ পরের জন পুরনো ছবির উপর লিখতে পারেন না।",
          },
        ],
      },
      {
        id: 8,
        text: "নিচের কোন DBMS টা Relational না, মানে RDBMS না?",
        options: [
          {
            key: "A",
            text: "PostgreSQL",
            isCorrect: false,
            explanation: "PostgreSQL Relational, এই ট্র্যাকের মূল DBMS।",
          },
          {
            key: "B",
            text: "SQLite",
            isCorrect: false,
            explanation: "SQLite ও Relational, শুধু আলাদা Server ছাড়া এক ফাইলে চলে।",
          },
          {
            key: "C",
            text: "MongoDB",
            isCorrect: true,
            explanation:
              "ঠিক। MongoDB Data রাখে Document আকারে, Table এ না, আর তার প্রশ্ন করার ভাষাও SQL না। পরের লেসনে এর ধরন দেখবেন।",
          },
          {
            key: "D",
            text: "MySQL",
            isCorrect: false,
            explanation: "MySQL Relational, আপনার দেখা ভিডিও কোর্সটা এটা দিয়েই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "একটা আসল DBMS এর সাথে প্রথম পরিচয়",
    subtitle: "Query বক্সে পাঁচটা পরীক্ষা, আর Module 02 এর পর নিজের মেশিনে একটা",
    stepName: "LAB",
    steps: [
      {
        title: "Server কে তার পরিচয় জিজ্ঞেস করুন",
        description:
          "এই লেসনের যেকোনো Query বক্সে প্রথম কোডটা বসিয়ে Run চাপুন। Version, Port আর আপনি কোন User হিসেবে কথা বলছেন, তিনটা উত্তর পড়ুন।",
      },
      {
        title: "এক Server এ কতগুলো Database",
        description:
          "দ্বিতীয় কোড চালিয়ে Server এর সব Database এর নাম দেখুন, আর আপনি এখন কোনটার ভেতরে আছেন সেটা বের করুন।",
      },
      {
        title: "Database এর ভেতরে কী আছে",
        description:
          "তৃতীয় কোড দিয়ে Island Tours এর সব Table এর নাম বের করুন। সংখ্যাটা Sample Database পাতার আটটা Table এর সাথে মেলান।",
      },
      {
        title: "কোন Table এ কতগুলো Row",
        description:
          "চতুর্থ কোড চালিয়ে আটটা Table এর Row গুনুন। কোন Table সবচেয়ে বড় আর কেন, এক লাইনে লিখে রাখুন।",
      },
      {
        title: "তিনটা নিয়ম ভাঙার চেষ্টা",
        description:
          "পঞ্চম কোডের তিনটা INSERT একটা একটা করে বক্সে বসিয়ে চালান। প্রতিবার Error এর ভেতরে Constraint এর নামটা খুঁজুন আর লিখুন কোন নিয়ম ভাঙল।",
      },
      {
        title: "নিজের মেশিনে, Module 02 এর পরে",
        description:
          "PostgreSQL ইনস্টল আর island_tours Load করার পর ষষ্ঠ কোডটা Terminal এ চালাবেন। তখন এই একই প্রশ্নগুলো একটা সত্যিকারের আলাদা Server Process এর কাছে যাবে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-who-are-you.sql",
        language: "sql",
        code: `-- Query বক্সে বসিয়ে Run চাপুন। একসাথে তিনটা প্রশ্ন, তিনটা উত্তর।
SELECT version();
SHOW port;
SELECT current_user;

-- যা আসবে:
--   version: PostgreSQL 18.3 (PGlite 0.5.8) on wasm32-unknown-emscripten, ...
--   port:    5432
--   current_user: postgres`,
      },
      {
        filename: "2-databases-on-this-server.sql",
        language: "sql",
        code: `-- এই Server এ কোন কোন Database আছে
SELECT datname FROM pg_database ORDER BY datname;
--   postgres
--   template0
--   template1

-- আপনি এখন কোন Database এর ভেতরে
SELECT current_database();
--   postgres
-- Query বক্সে Island Tours এর Table গুলো এই postgres Database এই রাখা।`,
      },
      {
        filename: "3-tables-in-this-database.sql",
        language: "sql",
        code: `-- এই Database এর সব Table এর নাম
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

--   bookings, customers, departures, destinations,
--   guides, payments, reviews, tours   (মোট ৮টা Row)`,
      },
      {
        filename: "4-rows-per-table.sql",
        language: "sql",
        code: `-- কোন Table এ কতগুলো Row। UNION ALL কী, Module 07 এ শিখবেন।
SELECT 'destinations' AS table_name, count(*) AS row_count FROM destinations
UNION ALL SELECT 'guides', count(*) FROM guides
UNION ALL SELECT 'tours', count(*) FROM tours
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'departures', count(*) FROM departures
UNION ALL SELECT 'bookings', count(*) FROM bookings
UNION ALL SELECT 'payments', count(*) FROM payments
UNION ALL SELECT 'reviews', count(*) FROM reviews;

--   destinations 7, guides 5, tours 9, customers 15,
--   departures 16, bookings 24, payments 19, reviews 10`,
      },
      {
        filename: "5-break-the-rules.sql",
        language: "sql",
        code: `-- তিনটা আলাদা চেষ্টা। একটা একটা করে বক্সে বসিয়ে চালান,
-- কারণ একসাথে চালালে প্রথম Error এই বাকিগুলো আর চলবে না।

-- ১. seats শূন্য
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 0, 'confirmed', 0);
-- ERROR: new row for relation "bookings" violates check constraint "bookings_seats_check"

-- ২. status এর এমন মান যা তিনটার কোনোটা না
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (1, 8, 2, 'paid', 25000);
-- ERROR: new row for relation "bookings" violates check constraint "bookings_status_check"

-- ৩. আগে থেকে থাকা একটা Email দিয়ে নতুন Customer
INSERT INTO customers (full_name, email, city)
VALUES ('Test User', 'rahim.uddin@mail.example', 'Dhaka');
-- ERROR: duplicate key value violates unique constraint "customers_email_key"`,
      },
      {
        filename: "6-on-your-machine.sh",
        language: "bash",
        code: `# Module 02 তে PostgreSQL ইনস্টল আর island_tours Load করার পর চালাবেন।
# Output আপনার মেশিনের Version অনুযায়ী আলাদা হবে, যা দেখাবে সেটাই ঠিক।

# Server টা চালু আছে কিনা, আর কোন Port এ
pg_isready

# একই প্রশ্নগুলো, এবার একটা আলাদা Server Process এর কাছে
psql -d island_tours -c "SELECT version();"
psql -d island_tours -c "SHOW port;"

# Server এর সব Database এর তালিকা
psql -l`,
      },
    ],
  },
  assignment: {
    title: "Mini Project: চারপাশের Database গুলো চিনুন",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>পাঁচটা Database খুঁজুন:</strong> আপনার প্রতিদিনের জীবনের পাঁচটা
        জায়গা লিখুন যার পেছনে নিশ্চয়ই একটা Database আছে, যেমন মোবাইল ব্যাংকিং,
        ট্রেনের টিকিট, ডাক্তারের Appointment। প্রতিটার জন্য লিখুন সাতটা কাজের মধ্যে
        কোনটা সেখানে সবচেয়ে জরুরি, আর কেন।
      </span>,
      <span key="2">
        <strong>তিন শব্দের ছবি নিজে আঁকুন:</strong> কাগজে বা যেকোনো Tool এ একটা
        মেশিন, তার ভেতরে Port 5432 এ চলা PostgreSQL Server, আর তার ভেতরে
        island_tours আর my_tours দুটো Database আঁকুন। প্রতিটা স্তরের পাশে লিখুন
        সেটা DBMS, Server, না Database।
      </span>,
      <span key="3">
        <strong>তিনটা নিয়ম ভাঙুন:</strong> Lab এর পঞ্চম কোডের তিনটা INSERT Query
        বক্সে একটা একটা করে চালান। প্রতিটা Error হুবহু কপি করুন, আর তার পাশে এক
        লাইনে নিজের ভাষায় লিখুন কোন নিয়ম ভাঙল আর নিয়মটা না থাকলে Island Tours এর কী
        ক্ষতি হতো।
      </span>,
      <span key="4">
        <strong>শেষ সিটের গল্প, অন্য ব্যবসায়:</strong> একটা সিনেমা হলের শেষ টিকিট
        বা একজন ডাক্তারের শেষ Appointment এর জন্য শেষ সিটের গল্পটা নতুন করে লিখুন,
        দুইভাবে: একবার শেয়ার করা ফাইল দিয়ে, একবার DBMS দিয়ে। প্রতিটা ধাপে কে কী
        দেখছেন, স্পষ্ট করে লিখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধু বললেন, MySQL তো একটা
        Database। তাঁকে ছয় লাইনে বোঝান কথাটা কেন অর্ধেক সত্য, আর Database, DBMS আর
        Database Server এর তফাত কী। লাইব্রেরির উদাহরণ ব্যবহার করতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">পাঁচটা জায়গা, প্রতিটার সবচেয়ে জরুরি কাজ আর কারণসহ</span>,
      <span key="2">তিন স্তরের ছবি, প্রতিটা স্তরের নামসহ</span>,
      <span key="3">তিনটা Error হুবহু, প্রতিটার পাশে এক লাইনের ব্যাখ্যা</span>,
      <span key="4">অন্য ব্যবসায় শেষ সিটের গল্প, দুই সংস্করণে</span>,
      <span key="5">বন্ধুর জন্য ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
};
