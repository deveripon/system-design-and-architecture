import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  DatabasePickerLab,
  QuestionFitLab,
} from "../../../components/course/topics/sql-basics/dbkinds-animations";
import {
  DataShapesDiagram,
  DbKindFacts,
  InvertedIndexDiagram,
  KeyValueDiagram,
  MeaningMapDiagram,
  PolyglotDiagram,
  TourAsTablesOrDocumentSplit,
  TourGraphDiagram,
} from "../../../components/course/topics/sql-basics/dbkinds-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const kindsOfDatabasesContent: TopicData = {
  id: "kinds-of-databases",
  introduction: {
    badge: "MODULE 01 · LESSON 03",
    title: <SectionTitle>এক Database সব কাজের নয়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি জেনেছেন Database কী, আর DBMS নামের Program টা Data
          রাখে, খোঁজে আর পাহারা দেয়। এবার একটা প্রশ্ন স্বাভাবিকভাবেই আসে। দুনিয়ায়
          যদি Database থাকেই, তাহলে এত নাম কেন? PostgreSQL, MySQL, MongoDB, Redis,
          Cassandra, Neo4j, Elasticsearch, ClickHouse। চাকরির বিজ্ঞাপনে, YouTube
          এ, সহকর্মীর মুখে, নতুন নতুন নাম আসতেই থাকে, আর মনে হয় সবগুলো না শিখলে
          পিছিয়ে পড়বেন।
        </ContentParagraph>
        <ContentParagraph>
          আসল কথাটা অনেক সহজ। এই নামগুলো মোটামুটি নয়টা পরিবারে পড়ে। প্রতিটা পরিবার
          Data কে আলাদা একটা আকারে রাখে, আর সেই আকারের কারণেই নির্দিষ্ট কিছু প্রশ্নের
          উত্তর সে অসম্ভব দ্রুত দেয়, আর অন্য কিছু প্রশ্নে হোঁচট খায়। পরিবারগুলো
          একবার চিনে ফেললে নতুন যেকোনো নাম শুনে আপনি জিজ্ঞেস করবেন, এটা কোন
          পরিবারের, আর অর্ধেক বোঝা সেখানেই হয়ে যাবে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি প্রতিটা পরিবারের Data এর চেহারা চিনবেন, Island Tours এ
          কোন Data কোন পরিবারে মানায় বলতে পারবেন, একটা নতুন Feature এর জন্য
          Database বাছাইয়ের প্রশ্নগুলো জানবেন, আর বুঝবেন কেন এই ট্র্যাক, এবং
          বাস্তবের বেশিরভাগ App, শুরু করে একটা Relational Database দিয়ে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রান্নাঘরে একটা ছুরি দিয়েই সব কাটা যায়। কিন্তু একদিন রুটির ছুরি দিয়ে মাছ কাটতে বসলে বোঝা যায়, রাঁধুনির তাকে কেন এতগুলো ছুরি ঝোলে, আর কেন তবু সবচেয়ে বেশি হাতে ওঠে একটাই।",
      author: "Kinds of Databases",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা দিন, আট রকম Data</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Island Tours এর একটা সাধারণ দিনের কথা ভাবুন। সকাল দশটায় Rahim
                Uddin bKash এ টাকা দিয়ে Saint Martin এর দুটো সিট বুক করলেন। ঠিক
                সেই সময় আরও তিনশ মানুষ Website ঘুরছেন, প্রত্যেকের প্রতিটা Click এ
                Server কে জানতে হচ্ছে তিনি কে, Login করা আছেন কিনা। একজন Search
                Box এ ভুল বানানে লিখলেন sant martin। আরেকজন লিখলেন, শান্ত, সবুজ,
                পানির ধারে কোথাও। Saint Martin এর জাহাজে বসানো GPS যন্ত্র প্রতি দশ
                সেকেন্ডে অবস্থান পাঠাচ্ছে। আর রাতে Owner জানতে চাইবেন এই মাসে কত
                টাকা আয় হলো, কোন Destination থেকে কত।
              </ContentParagraph>
              <ContentParagraph>
                এই সবগুলোই Data। কিন্তু খেয়াল করলে দেখবেন, এদের চেহারা এক নয়, আর
                এদের কাছে যে প্রশ্ন করা হয় সেগুলোও এক নয়। Booking এ আছে নিয়ম আর
                সম্পর্ক: কোন Customer, কোন তারিখ, কত টাকা, আর টাকা কাটলে Booking
                হতেই হবে। Session এ আছে একটা চাবি আর তার পাশে একটুখানি তথ্য। GPS এ
                আছে সময় আর মাপ, শুধু আসতেই থাকে। Search এ আছে শব্দ, আর শব্দের ভুল।
                Report এ আছে লাখ লাখ Row থেকে কয়েকটা যোগফল।
              </ContentParagraph>
              <ContentParagraph>
                Database এর পরিবারগুলো ঠিক এই পার্থক্য থেকে জন্মেছে। প্রতিটা
                পরিবার কোনো একটা চেহারার Data আর কোনো একটা ধরনের প্রশ্নের জন্য
                বিশেষভাবে বানানো। তাই কোনো Database নিয়ে ভাবার সময় সবসময় দুটো প্রশ্ন
                দিয়ে শুরু করবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Data টার আকার কেমন?</strong> সারি আর কলামে সাজানো, নাকি
                  একটা জিনিসের ভেতরে আরেকটা তালিকা, নাকি শুধু চাবি আর মান, নাকি
                  বিন্দু আর তাদের সম্পর্ক, নাকি সময় ধরে আসা মাপ।
                </ListItem>
                <ListItem>
                  <strong>সবচেয়ে বেশি কোন প্রশ্নটা করা হবে?</strong> এই একটা
                  জিনিসটা চাই ধরনের প্রশ্ন, নাকি সব Row মিলিয়ে যোগফল, নাকি
                  সম্পর্ক ধরে কয়েক ধাপ হাঁটা, নাকি অর্থের দিক থেকে কাছাকাছি কিছু।
                  এই প্রশ্নের ধরনকে বলে Access Pattern।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছবিতে নয়টা পরিবারের নয়টা চেহারা একসাথে দেখুন। এখনই সব বুঝতে
                হবে না। শুধু খেয়াল করুন, প্রতিটার আঁকার ধরন আলাদা। এই লেসনের বাকি
                অংশে আমরা একটা একটা করে প্রতিটার ভেতরে ঢুকব।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DataShapesDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "SQL Database আর NoSQL, দুটো শব্দের মানে",
          content: (
            <p>
              কথাবার্তায় প্রায়ই শুনবেন SQL Database আর NoSQL Database। SQL
              Database বলতে মানুষ বোঝায় Relational Database, যেগুলো Table এ Data
              রাখে আর SQL ভাষায় কথা বলে, যেমন PostgreSQL আর MySQL। NoSQL হলো বাকি
              সব পরিবারের একটা ছাতার নাম: Document, Key-Value, Wide-column, Graph
              আর আরও কিছু। নামটা শুনে মনে হয় এগুলোতে SQL একেবারেই নেই, কিন্তু
              অনেকে এটাকে পড়েন Not only SQL হিসেবে, কারণ এদের অনেকেরই SQL এর মতো
              ভাষা আছে, আর এরা প্রায়ই SQL Database এর পাশাপাশি কাজ করে। মনে রাখার
              মতো কথা একটাই: NoSQL কোনো একটা Database না, আর নামের ভেতরে দ্রুত বা
              আধুনিক হওয়ার কোনো প্রতিশ্রুতি নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "relational",
      subHeader: { index: "002", title: "Relational" },
      title: <SectionTitle>Relational: নিয়মের খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রথম পরিবারটা আপনার সবচেয়ে চেনা হওয়া উচিত, কারণ পুরো ট্র্যাকটাই
                এটা নিয়ে। একটা দোকানের হিসাবের খাতা ভাবুন, যেখানে প্রতিটা পাতায়
                ছাপানো ঘর আছে: তারিখ, নাম, জিনিস, দাম। প্রতিটা লাইনে একটা বিক্রি,
                প্রতিটা ঘরে একটাই জিনিস। Relational Database এই খাতাটাই, শুধু
                অনেকগুলো পাতা একসাথে, আর পাতাগুলোর মধ্যে সম্পর্ক টানা।
              </ContentParagraph>
              <ContentParagraph>
                এখানে Data থাকে Table এ। প্রতিটা Table এর Column আগে থেকে ঠিক করা,
                প্রতিটা Row একটা জিনিস। এক Table আরেক Table কে চেনে একটা নম্বর দিয়ে,
                যেমন Island Tours এর bookings Table এর প্রতিটা Row এ লেখা থাকে
                customer_id, আর সেই নম্বর দিয়ে customers Table এ গিয়ে মানুষটাকে
                পাওয়া যায়। এই নম্বরগুলোকে বলে Key। Table, Row, Column আর Key এর পুরো
                গল্প পরের লেসনে, Lesson 04 এ।
              </ContentParagraph>
              <ContentParagraph>
                এই পরিবারের আসল শক্তি দুটো। প্রথমটা নিয়ম। আপনি Database কে বলে
                রাখতে পারেন, সিটের সংখ্যা শূন্যের নিচে যাবে না, একই Email দুজনের
                হবে না, যে Customer নেই তার নামে Booking হবে না। ভুল Data ঢুকতে
                চাইলে Database নিজেই না বলে দেয়। দ্বিতীয়টা Transaction: কয়েকটা কাজ
                একসাথে, হয় সবগুলো হবে, নয়তো একটাও হবে না। টাকা কাটা আর সিট কমানো
                যেন কখনো অর্ধেক হয়ে না থাকে। এই দুটো শক্তির কারণেই যেখানে টাকা,
                সিট, স্টক বা হিসাব আছে, সেখানে প্রায় সবসময় Relational Database থাকে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Relational"
              products={["PostgreSQL", "MySQL", "MariaDB", "SQLite", "SQL Server", "Oracle"]}
              shape="Table, যার Column আগে থেকে ঠিক করা। প্রতিটা Row একটা জিনিস। Table গুলো Key দিয়ে একে অপরের সাথে জোড়া।"
              example="customers, tours, departures, bookings, payments, reviews, এই ট্র্যাকের পুরো Sample Database।"
              pick="টাকা, সিট, স্টক, অর্ডার, Account, যেখানে নিয়ম ভাঙা চলবে না আর Data গুলো একে অপরের সাথে সম্পর্কিত। কোন প্রশ্ন আসবে সব আগে থেকে জানা না থাকলেও SQL দিয়ে নতুন প্রশ্ন করা যায়।"
              avoid="সেকেন্ডে লাখ লাখ Write অনেক দেশে ছড়িয়ে, বা যে Data এর আকার জিনিস থেকে জিনিসে পুরোপুরি বদলায়। তবে এই সীমা বেশিরভাগ App কখনো ছোঁয় না।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "document",
      subHeader: { index: "003", title: "Document" },
      title: <SectionTitle>Document: পুরো ফাইলটা এক খামে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার অফিসের একটা ফাইল কেবিনেট ভাবুন। প্রতিটা ক্লায়েন্টের জন্য একটা
                খাম। খামের ভেতরে তাঁর সবকিছু: আবেদন, চিঠি, ছবি, রসিদ। একজনের খামে
                তিনটা কাগজ, আরেকজনের খামে বিশটা, কাগজের ধরনও আলাদা। কারো ফাইল দরকার
                হলে একটা খাম বের করলেই পুরোটা হাতে চলে আসে।
              </ContentParagraph>
              <ContentParagraph>
                Document Database এই কেবিনেট। প্রতিটা জিনিস একটা Document, দেখতে
                JSON এর মতো: নাম আর মানের জোড়া, যার ভেতরে আবার তালিকা বা আরেকটা
                ছোট Document থাকতে পারে। একই রকম Document গুলো থাকে একটা Collection
                এ, যেটা মোটামুটি Table এর জায়গায়। পার্থক্য হলো, Collection এর সব
                Document এর আকার এক হতে হবে, এমন কোনো বাধ্যবাধকতা সাধারণত নেই।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ এর সবচেয়ে ভালো উদাহরণ ট্যুরের দিনভিত্তিক Plan। Saint
                Martin এর ট্যুর তিন দিনের, প্রতিদিনের আলাদা কাজ, সাথে কয়েকটা ছবি।
                Ratargul এর ট্যুর একদিনের, তাতে নৌকার সময়সূচি। নিচের ছবিতে একই ট্যুর
                দুইভাবে রাখা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TourAsTablesOrDocumentSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ছবিটা থেকে এই পরিবারের লাভ আর দাম দুটোই দেখা যায়। লাভ: ট্যুরের Page
                খোলার সময় একটা Document পড়লেই সব চলে আসে, তিনটা Table জোড়া লাগাতে
                হয় না, আর নতুন কোনো ঘর, ধরুন packing_list, যোগ করতে আগে থেকে কিছু
                বদলাতে হয় না। দাম: Data যখন এক Document থেকে আরেক Document এ
                সম্পর্ক খোঁজে, তখন কষ্ট শুরু হয়। Customer এর Document এর ভেতরে তাঁর
                Booking গুলো রাখলে, ট্যুরের নাম প্রতিটা Booking এ কপি করতে হয়। ট্যুরের
                নাম বদলালে সব কপি খুঁজে খুঁজে বদলাতে হয়। আর কোন কোন Customer
                Sundarbans বুক করেছেন, এই প্রশ্নে প্রতিটা Customer এর Document খুলে
                দেখতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Document"
              products={["MongoDB", "Couchbase", "Firestore", "Amazon DocumentDB"]}
              shape="JSON এর মতো Document, ভেতরে তালিকা আর ছোট Document। একই Collection এর Document গুলোর আকার আলাদা হতে পারে।"
              example="প্রতিটা ট্যুরের দিনভিত্তিক Plan, ছবি আর FAQ, যেটা Page খুললে একসাথে পুরোটা দেখাতে হয়।"
              pick="একটা জিনিসের সব তথ্য প্রায় সবসময় একসাথে পড়া হয়, আর জিনিস থেকে জিনিসে আকার বদলায়।"
              avoid="Data গুলো একে অপরের সাথে অনেক সম্পর্কিত, আর প্রশ্ন আসে সম্পর্ক ধরে, যেমন টাকার হিসাব আর Booking।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "key-value",
      subHeader: { index: "004", title: "Key-Value" },
      title: <SectionTitle>Key-Value: লকার রুমের চাবি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                শপিং মলের প্রবেশপথে ব্যাগ রাখার লকার দেখেছেন। আপনি ব্যাগ দিলেন,
                বদলে পেলেন একটা নম্বর লেখা টোকেন। ফেরার সময় টোকেন দিলেন, ব্যাগ
                হাতে পেলেন। কাউন্টারের মানুষটা ব্যাগ খুলে দেখেন না ভেতরে কী আছে।
                আপনি যদি জিজ্ঞেস করেন, লাল ব্যাগগুলো কোথায়, তিনি বলতে পারবেন না।
                তিনি শুধু টোকেন চেনেন।
              </ContentParagraph>
              <ContentParagraph>
                Key-Value Store ঠিক এই লকার। প্রতিটা Data এর একটা নাম, যাকে বলে Key,
                আর তার পাশে একটা মান, Value। প্রশ্ন একটাই, এই Key এর মান কী, আর
                উত্তর আসে চোখের পলকে। সবচেয়ে পরিচিত Key-Value Store গুলো Data রাখে
                Memory তে, মানে RAM এ, তাই এক মিলিসেকেন্ডেরও কম সময়ে উত্তর দেয়। RAM
                কেন Disk এর চেয়ে এত দ্রুত, তার পুরো গল্প আছে DevOps ট্র্যাকের{" "}
                <Link href="/devops/topic/memory-and-ram" className={linkClass}>
                  RAM, Stack and Heap
                </Link>{" "}
                লেসনে। এখানে সেই গতিরই সুফল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyValueDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই দ্রুততার দাম হলো প্রশ্নের স্বাধীনতা। আপনি শুধু Key ধরে চাইতে
                পারবেন। ঢাকার সব Session, বা যেসব ঝুড়িতে দুইটার বেশি সিট, এমন প্রশ্ন
                করতে হলে App কে নিজে সব Key ঘুরে দেখতে হবে। আর Memory তে রাখা Data
                Server বন্ধ হলে হারাতে পারে, যদি না আলাদা করে Disk এ লেখার ব্যবস্থা
                চালু থাকে। তাই Key-Value Store সাধারণত আসল হিসাব রাখে না। সে রাখে
                এমন জিনিস, যা হারালেও আবার বানানো যায়: Cache, Session, গোনার কাউন্টার।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Key-Value"
              products={["Redis", "Valkey", "Memcached", "Amazon DynamoDB", "etcd"]}
              shape="Key আর তার Value এর জোড়া। Value এর ভেতরে কী আছে Store সাধারণত দেখে না।"
              example="Login Session, ঝুড়িতে রাখা সিট, বারবার লাগে এমন ট্যুরের তালিকার Cache, আর এক IP থেকে মিনিটে কতগুলো Request এল তার হিসাব।"
              pick="প্রশ্ন সবসময় একটা নির্দিষ্ট Key ধরে, আর উত্তর চাই অসম্ভব দ্রুত, অনেকবার।"
              avoid="Data এর ভেতরের মান দিয়ে খুঁজতে হয়, বা Data হারালে আর ফেরত আনা যাবে না।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "wide-column",
      subHeader: { index: "005", title: "Wide-column" },
      title: <SectionTitle>Wide-column: বিশাল স্রোতের জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার এমন একটা পরিস্থিতি ভাবুন যেটা Island Tours এর এখনকার আকারে নেই,
                কিন্তু বড় কোম্পানিতে রোজ ঘটে। ধরুন Island Tours তিন দেশে চলে, আর
                প্রতিটা Visitor এর প্রতিটা Click জমা রাখতে হবে। সেকেন্ডে বিশ হাজার
                Write, দিনে কোটি কোটি Row। আর প্রশ্ন প্রায় একটাই, এই Visitor শেষ
                একশটা কী কী করেছেন।
              </ContentParagraph>
              <ContentParagraph>
                Wide-column Database এই সমস্যার জন্য বানানো। বাইরে থেকে দেখতে Table
                এর মতোই, Row আর Column আছে। কিন্তু দুটো বড় পার্থক্য। প্রথমত, একই
                Table এর এক Row এ পাঁচটা Column, আরেক Row এ পাঁচশটা থাকতে পারে, তাই
                নাম Wide-column। দ্বিতীয়ত, প্রতিটা Row এর একটা Partition Key থাকে,
                যেমন Visitor এর ID, আর সেই Key দেখে Database ঠিক করে Row টা কোন
                মেশিনে যাবে। একই Visitor এর সব Data এক জায়গায়, আর আলাদা আলাদা
                Visitor এর Data শত শত মেশিনে ছড়ানো। তাই Write কখনো এক জায়গায় জট
                পাকায় না।
              </ContentParagraph>
              <ContentParagraph>
                এর দাম হলো, Table বানানোর আগেই আপনাকে জানতে হয় কোন প্রশ্নগুলো করা
                হবে। Relational Database এ আগে Data সাজিয়ে পরে যেকোনো প্রশ্ন করা
                যায়। Wide-column এ উল্টো: আগে প্রশ্ন, তারপর সেই প্রশ্নের মাপে Table।
                নতুন ধরনের প্রশ্ন এলে প্রায়ই নতুন একটা Table বানিয়ে Data আবার লিখতে
                হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Wide-column"
              products={["Apache Cassandra", "ScyllaDB", "Apache HBase", "Google Bigtable"]}
              shape="Partition Key ধরে ভাগ করা Row, প্রতিটা Row এ যত খুশি Column। Data অনেক মেশিনে ছড়ানো।"
              example="ভবিষ্যতের কথা: তিন দেশের সব Visitor এর প্রতিটা Click আর Page View।"
              pick="বিশাল পরিমাণ Write, অনেক Data Center, আর আগে থেকে জানা কয়েকটা প্রশ্ন।"
              avoid="প্রশ্ন আগে থেকে জানা নেই, Join লাগে, বা Data এখনো একটা Server এ ধরে যায়। বেশিরভাগ App এর জন্য এটা বাড়তি জটিলতা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Wide-column আর Columnar এক জিনিস নয়",
          content: (
            <p>
              নাম দুটো এত কাছাকাছি যে অভিজ্ঞ Developer রাও গুলিয়ে ফেলেন। Wide-column
              Database, যেমন Cassandra, Data রাখে Row এর দল ধরে, আর বানানো হয়েছে
              অসংখ্য ছোট ছোট Write এর জন্য। Columnar Database, যেমন ClickHouse বা
              BigQuery, Data রাখে Column ধরে, প্রতিটা Column আলাদা করে পাশাপাশি, আর
              বানানো হয়েছে বিশাল Report এর জন্য। প্রথমটা অনলাইন দোকানের কাউন্টার,
              দ্বিতীয়টা মাস শেষের হিসাবরক্ষক। Columnar এর কথা এই লেসনের ১০ নম্বর অংশে,
              আর তার ভেতরের কৌশল Lesson 07 এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "graph",
      subHeader: { index: "006", title: "Graph" },
      title: <SectionTitle>Graph: সম্পর্কই যেখানে আসল Data</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                পরিবারের বংশতালিকা কখনো আঁকা দেখেছেন? প্রতিটা মানুষ একটা বৃত্ত, আর
                বৃত্তগুলোর মধ্যে দাগ: কে কার সন্তান, কে কার ভাই। এই ছবিতে আসল তথ্য
                মানুষের নামে নয়, দাগগুলোতে। আপনার দাদার ভাইয়ের নাতি কে, এই প্রশ্নের
                উত্তর পেতে আপনি আঙুল দিয়ে দাগ ধরে হাঁটেন।
              </ContentParagraph>
              <ContentParagraph>
                Graph Database এই বংশতালিকা। Data থাকে দুই রকম জিনিসে: Node, মানে
                বিন্দু, যেমন একজন Customer বা একটা ট্যুর, আর Edge, মানে দুই বিন্দুর
                মধ্যের সম্পর্ক, যেমন BOOKED বা REFERRED। Edge এরও নিজের তথ্য থাকতে
                পারে, যেমন কবে বুক করেছিলেন। প্রশ্ন হয় হাঁটার ভাষায়: এই Node থেকে এই
                সম্পর্ক ধরে দুই ধাপ গেলে কারা আসে। নিচের ছবিটা Island Tours এর
                আসল Booking থেকে আঁকা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TourGraphDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই প্রশ্ন Relational Database এও করা যায়, আর এই লেসনের See It
              Yourself অংশে আপনি নিজে চালিয়ে দেখবেন। কিন্তু সেখানে ছয়টা Table জোড়া
              লাগাতে হয়, আর ধাপ তিন চার পাঁচে গেলে Query লম্বা আর ধীর হতে থাকে। Graph
              Database এ ধাপ বাড়লেও প্রশ্নটা একই রকম ছোট থাকে, কারণ প্রতিটা Node
              নিজের পাশের Node গুলোকে সরাসরি চেনে। সবচেয়ে পরিচিত Graph Database
              Neo4j, আর তার Query এর ভাষার নাম Cypher, যেখানে সম্পর্ক লেখা হয় তীর
              আঁকার মতো করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Graph"
              products={["Neo4j", "Amazon Neptune", "Memgraph", "ArangoDB"]}
              shape="Node আর Edge। দুজনেরই নিজের তথ্য থাকতে পারে। প্রশ্ন হয় সম্পর্ক ধরে হাঁটার ভাষায়।"
              example="যাঁরা Saint Martin এ গেছেন তাঁরা আর কোথায় যান, কে কাকে রেফার করেছেন, কোন Guide কোন Destination এ বেশি অভিজ্ঞ।"
              pick="Recommendation, সামাজিক সম্পর্ক, প্রতারণা ধরা, যেখানে প্রশ্ন সম্পর্কের অনেক ধাপ ধরে।"
              avoid="প্রশ্ন বেশিরভাগই একটা জিনিস বা একটা Table নিয়ে, বা দরকার বড় যোগফল আর Report।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "time-series",
      subHeader: { index: "007", title: "Time-series" },
      title: <SectionTitle>Time-series: ঘড়ির কাঁটার সাথে আসা Data</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                হাসপাতালের বেডের পাশে রোগীর তাপমাত্রার চার্ট দেখেছেন। প্রতি চার
                ঘণ্টায় নার্স একটা মাপ লেখেন, সাথে সময়। আগের মাপ কখনো বদলানো হয় না,
                নতুন মাপ শুধু নিচে যোগ হয়। ডাক্তার জানতে চান গত দুই দিনে জ্বর বাড়ছে
                না কমছে, প্রতিটা একক মাপে তাঁর আগ্রহ কম।
              </ContentParagraph>
              <ContentParagraph>
                Time-series Data ঠিক এমন: প্রতিটা মাপের সাথে একটা সময়, Data আসে
                নিয়মিত, আসে প্রচুর, আর প্রায় কখনো বদলায় না। প্রশ্নগুলোও সময়ের ভাষায়:
                গত এক ঘণ্টায় গড় কত, প্রতি দিনের সর্বোচ্চ কত, কখন হঠাৎ লাফ দিল।
                Time-series Database তিনটা কাজ খুব ভালো করে। সময়ের সীমা ধরে দ্রুত
                পড়া, পুরনো Data কে ছোট করে রাখা, যেমন প্রতি দশ সেকেন্ডের মাপ এক
                মাস পর ঘণ্টার গড়ে বদলে ফেলা, আর মেয়াদ পেরোলে নিজে থেকেই মুছে ফেলা।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এ এর দুটো জায়গা। জাহাজের GPS প্রতি দশ সেকেন্ডে অবস্থান
                পাঠালে তিন বছরে কয়েক মিলিয়ন মাপ জমবে। আর Server এর CPU, Memory আর
                Request এর সংখ্যা, যেগুলো DevOps ট্র্যাকের Observability মডিউলে দেখবেন,
                সেগুলোও Time-series, সাধারণত Prometheus এ জমা হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Time-series"
              products={["TimescaleDB", "InfluxDB", "Prometheus", "QuestDB"]}
              shape="সময় আর মাপের জোড়া, শুধু শেষে যোগ হয়। প্রশ্ন হয় সময়ের সীমা ধরে, যোগফল আর গড়ে।"
              example="জাহাজের GPS অবস্থান, Server এর CPU আর Request এর সংখ্যা, প্রতি মিনিটের Booking এর হার।"
              pick="মাপ আসে নিয়মিত আর প্রচুর, পুরনো মাপ বদলায় না, আর পুরনো Data ছোট করা বা মুছে ফেলার নিয়ম দরকার।"
              avoid="Data নিয়মিত বদলায়, বা প্রতিটা Row একটা আলাদা ব্যবসার জিনিস, যেমন Booking।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "search",
      subHeader: { index: "008", title: "Search Engines" },
      title: <SectionTitle>Search Engine: বইয়ের পেছনের নির্ঘণ্ট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                মোটা একটা বইয়ে কোনো শব্দ খুঁজতে আপনি প্রথম পাতা থেকে পড়া শুরু করেন
                না। বইয়ের শেষে নির্ঘণ্টে যান, যেখানে শব্দগুলো বর্ণানুক্রমে সাজানো,
                পাশে লেখা কোন কোন পাতায় আছে। Search Engine ঠিক এই নির্ঘণ্টটা বানায়,
                আর তার নাম Inverted Index। সাধারণ খোঁজে আপনি লেখা ধরে শব্দ খোঁজেন।
                Inverted Index এ উল্টোটা, শব্দ ধরে লেখা।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Search Engine শুধু নির্ঘণ্ট না। সে লেখাকে শব্দে ভাঙে, ছোট হাতের
                অক্ষরে আনে, beaches আর beach কে একই শব্দ ধরে, ভুল বানান sant এর জন্য
                কাছাকাছি শব্দ saint খুঁজে দেখে, আর ফলাফল সাজায় কোনটা সবচেয়ে
                মানানসই সেই ক্রমে, যাকে বলে Ranking। Google এ কিছু লিখলে যে অভিজ্ঞতা
                পান, নিজের App এ সেটা দিতে এই পরিবার লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InvertedIndexDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Search Engine প্রায় কখনো আসল হিসাবের মালিক হয় না। আসল Data থাকে
              Relational Database এ, আর তার একটা কপি Search Engine এ পাঠানো হয় শুধু
              খোঁজার জন্য। খুঁজে পাওয়া ট্যুরের ID নিয়ে App আবার মূল Database থেকে
              দাম আর খালি সিট পড়ে, কারণ সেগুলো সবসময় সর্বশেষ হতে হবে। এই কপি রাখার
              ধারণাটা এই লেসনের ১১ নম্বর অংশে আরও পরিষ্কার হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Search Engine"
              products={["Elasticsearch", "OpenSearch", "Meilisearch", "Typesense", "Apache Solr"]}
              shape="শব্দ থেকে লেখার তালিকা, মানে Inverted Index। সাথে Ranking আর ভুল বানান সামলানোর কৌশল।"
              example="ট্যুর খোঁজার Search Box, যেখানে sant martin লিখলেও Saint Martin আসে, আর বেশি মানানসই ট্যুর আগে।"
              pick="মানুষের লেখা ভাষায় খোঁজা, ভুল বানান, ফিল্টার আর Ranking লাগে।"
              avoid="আসল হিসাব রাখার জায়গা হিসেবে। Search Engine এর Data সবসময় মূল Database থেকে আসা একটা কপি।"
            />
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "vector",
      subHeader: { index: "009", title: "Vector" },
      title: <SectionTitle>Vector: শব্দ না মিললেও অর্থ মেলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা লাইব্রেরির কথা ভাবুন যেখানে বই সাজানো নাম দিয়ে নয়, বিষয় দিয়ে।
                ভ্রমণের বইয়ের পাশে প্রকৃতির বই, প্রকৃতির বইয়ের পাশে পাখির বই। একজন
                পাঠক এসে বললেন, এমন কিছু চাই যেটা পড়লে মন শান্ত হয়। লাইব্রেরিয়ান
                নামের তালিকা খোঁজেন না। তিনি জানেন কোন তাকটা ওই অনুভূতির কাছাকাছি,
                সেখান থেকে কয়েকটা বই এনে দেন।
              </ContentParagraph>
              <ContentParagraph>
                Vector Database এই লাইব্রেরিয়ান। প্রথমে একটা AI Model প্রতিটা ট্যুরের
                বর্ণনা পড়ে সেটাকে কয়েকশো বা কয়েক হাজার সংখ্যার একটা তালিকায় বদলায়।
                এই তালিকার নাম Vector, আর অর্থ থেকে বানানো Vector কে বলে Embedding।
                মজার ব্যাপার হলো, অর্থে কাছাকাছি দুটো লেখার Vector ও সংখ্যার হিসাবে
                কাছাকাছি হয়। তারপর কেউ কিছু লিখলে তাঁর লেখারও Vector বানানো হয়, আর
                Database খুঁজে দেয় সবচেয়ে কাছের Vector গুলো, যাকে বলে Nearest
                Neighbor খোঁজা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MeaningMapDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Search Engine আর Vector Database এর পার্থক্যটা এই ছবিতেই। Search
              Engine শব্দ মেলায়, তাই sant martin এর মতো ভুলও সামলাতে পারে, কিন্তু
              শান্ত শব্দটা কোথাও লেখা না থাকলে কিছু পায় না। Vector Database অর্থ
              মেলায়, তাই শব্দ না মিললেও কাছের জিনিস দেয়। আজকাল AI Chatbot যে
              নিজের কোম্পানির Document থেকে উত্তর দেয়, যাকে RAG বলে, তার পেছনেও এই
              খোঁজা। বাস্তবে দুটো একসাথেও ব্যবহার হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Vector"
              products={["pgvector", "Pinecone", "Qdrant", "Weaviate", "Milvus"]}
              shape="প্রতিটা জিনিসের সাথে একটা লম্বা সংখ্যার তালিকা, Embedding। প্রশ্ন হয়, এই Vector এর সবচেয়ে কাছের কোনগুলো।"
              example="পর্যটক লিখলেন শান্ত, সবুজ, পানির ধারে, আর পেলেন Ratargul আর Sundarbans, যদিও নামে ওই শব্দগুলো নেই।"
              pick="অর্থ দিয়ে খোঁজা, একই রকম জিনিস সাজেস্ট করা, AI Chatbot কে নিজের Data থেকে উত্তর দেওয়ানো।"
              avoid="ঠিক এই নামটা বা এই ID টা চাই, এমন হুবহু খোঁজে। সেখানে সাধারণ Index অনেক সস্তা আর নির্ভুল।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "columnar",
      subHeader: { index: "010", title: "Columnar" },
      title: <SectionTitle>Columnar: মাস শেষের হিসাবরক্ষক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                শেষ পরিবারটা Report এর জন্য। কয়েক বছর পরের Island Tours ভাবুন, কোটি
                Booking জমেছে। Owner জানতে চান, গত পাঁচ বছরে প্রতি মাসে প্রতিটা
                Destination থেকে কত আয়। এই প্রশ্নে প্রতিটা Booking এর মাত্র তিনটা
                জিনিস লাগে: তারিখ, Destination আর টাকা। Customer এর নাম, Email, ফোন,
                সিটের সংখ্যা, কিছুই লাগে না।
              </ContentParagraph>
              <ContentParagraph>
                Columnar Database Data কে Column ধরে রাখে, প্রতিটা Column আলাদা করে।
                তাই এই প্রশ্নে সে শুধু ওই তিনটা Column পড়ে, বাকি সব ছুঁয়েও দেখে না।
                একই Column এ একই ধরনের মান পাশাপাশি থাকে বলে সেগুলো খুব ছোট করে
                Compress করাও যায়। ফলে কোটি Row এর যোগফলও কয়েক সেকেন্ডে আসে। কেন
                Row ধরে রাখা Database একই প্রশ্নে ধীর, আর কেন Booking নেওয়ার কাজ আর
                Report বানানোর কাজ আলাদা Database এ রাখা হয়, সেটা এই মডিউলের শেষ লেসন,
                Lesson 07 এর পুরো গল্প।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <DbKindFacts
              kind="Columnar"
              products={["ClickHouse", "DuckDB", "BigQuery", "Snowflake", "Amazon Redshift"]}
              shape="Column ধরে রাখা Table, ভারী Compress করা। প্রশ্ন হয় অনেক Row জুড়ে যোগফল আর গড়।"
              example="পাঁচ বছরের মাসভিত্তিক আয়, Destination অনুযায়ী গড় রেটিং, কোন মাসে কতজন নতুন Customer।"
              pick="অনেক Row, অল্প কয়েকটা Column, আর বড় Report। একে Warehouse ও বলে, Module 20 এ বিস্তারিত।"
              avoid="একটা একটা করে Booking নেওয়া বা বদলানো। ছোট ছোট অনেক Write এ এই পরিবার দুর্বল।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "postgres-first",
      subHeader: { index: "011", title: "PostgreSQL First" },
      title: <SectionTitle>একটা মূল Database, পাশে কয়েকটা সাহায্যকারী</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নয়টা পরিবার দেখার পর মনে হতে পারে, একটা App এ বুঝি নয়টা Database
                লাগবে। বাস্তবে উল্টোটা ঘটে। বেশিরভাগ App শুরু হয় একটা Relational
                Database দিয়ে, আর অনেক বছর সেটা দিয়েই চলে। এর একটা বড় কারণ
                PostgreSQL নিজে। সে একটা Relational Database, কিন্তু সময়ের সাথে অন্য
                পরিবারের অনেক কাজও শিখে নিয়েছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Document:</strong> JSONB নামের Column Type এ JSON
                  Document রাখা যায়, ভেতরের ঘর ধরে খোঁজা যায়, Index ও করা যায়।
                  Module 15 এ পুরো লেসন আছে।
                </ListItem>
                <ListItem>
                  <strong>Search:</strong> Full-text Search নিজের ভেতরেই আছে,
                  শব্দে ভাঙা, Ranking সহ। এটাও Module 15 এ।
                </ListItem>
                <ListItem>
                  <strong>Time-series:</strong> TimescaleDB নামের Extension
                  PostgreSQL কে Time-series Database বানিয়ে দেয়। Extension মানে
                  PostgreSQL এ পরে যোগ করা যায় এমন বাড়তি ক্ষমতা।
                </ListItem>
                <ListItem>
                  <strong>Vector:</strong> pgvector Extension দিয়ে Embedding রাখা
                  আর কাছের প্রতিবেশী খোঁজা যায়।
                </ListItem>
                <ListItem>
                  <strong>মানচিত্র আর Graph:</strong> PostGIS Extension দিয়ে দূরত্ব
                  আর এলাকার হিসাব, আর Apache AGE Extension দিয়ে Graph এর মতো Query।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা Database একাধিক পরিবারের কাজ করলে তাকে বলে Multi-model
                Database। তবে মনে রাখবেন, বিশেষজ্ঞ Database গুলো তাদের নিজের কাজে
                সাধারণত আরও দক্ষ। PostgreSQL এর JSONB দিয়ে MongoDB এর বেশিরভাগ কাজ
                হয়, কিন্তু সবকিছু হয় না। পার্থক্যটা টের পাওয়া যায় Data আর ভিড় অনেক বড়
                হলে।
              </ContentParagraph>
              <ContentParagraph>
                তাই বাস্তবের চেহারাটা সাধারণত এমন: একটা মূল Database থাকে আসল হিসাবের
                মালিক, যাকে বলে Source of Truth। কোনো দুটো জায়গায় একই তথ্য দুই রকম
                হলে, Source of Truth যা বলে সেটাই সত্য। তার পাশে থাকে কয়েকটা
                সাহায্যকারী, যারা মূল Data এর কপি রাখে নিজের বিশেষ কাজের জন্য।
                একাধিক ধরনের Database একসাথে ব্যবহার করাকে বলে Polyglot Persistence।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PolyglotDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নতুন Database যোগ করার আগে তিনটা প্রশ্ন",
          content: (
            <p>
              প্রতিটা নতুন Database মানে নতুন একটা Server চালু রাখা, Backup নেওয়া,
              Update করা, Monitor করা, আর মূল Data এর সাথে কপিটা মিলিয়ে রাখা। তাই
              যোগ করার আগে নিজেকে জিজ্ঞেস করুন। এক, এই কাজটা কি PostgreSQL দিয়ে
              এখনই করা যায়? দুই, না গেলে, সেটা কি মেপে দেখা হয়েছে, নাকি শুধু
              আন্দাজ? তিন, কপিটা হারালে বা পিছিয়ে পড়লে কী হবে, সেটা কি ঠিক করা আছে?
              তিনটার উত্তর পরিষ্কার হলে তবেই নতুন সাহায্যকারী।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "choosing",
      subHeader: { index: "012", title: "Choosing" },
      title: <SectionTitle>প্রশ্ন বদলালে বিজয়ীও বদলায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                কোন Database সবচেয়ে ভালো, এই প্রশ্নের কোনো উত্তর নেই। উত্তর আছে শুধু
                এই প্রশ্নের, এই কাজের জন্য কোনটা সবচেয়ে ভালো। নিচের Lab এ একই চারটা
                প্রশ্ন চার রকম Database কে করা হয়েছে। প্রতিটা প্রশ্নে ক্লিক করে
                দেখুন কোন কার্ডে Natural fit লেখা ওঠে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <QuestionFitLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নতুন কোনো Feature এর জন্য Database বাছাই করতে হলে এই পাঁচটা প্রশ্ন
                ক্রম ধরে জিজ্ঞেস করুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Data এর আকার কেমন?</strong> Table, Document, চাবি আর মান,
                  সম্পর্কের জাল, নাকি সময় ধরে মাপ।
                </ListItem>
                <ListItem>
                  <strong>সবচেয়ে বেশি কোন প্রশ্নটা হবে?</strong> একটা জিনিস তোলা,
                  সম্পর্ক ধরে হাঁটা, শব্দ বা অর্থ দিয়ে খোঁজা, নাকি বড় যোগফল।
                </ListItem>
                <ListItem>
                  <strong>ভুল হলে কতটা ক্ষতি?</strong> টাকা, সিট বা স্টক হলে কড়া
                  নিয়ম আর Transaction লাগবেই, তাই Relational।
                </ListItem>
                <ListItem>
                  <strong>কতটা বড়, কতটা দ্রুত?</strong> সেকেন্ডে কতগুলো Write, মোট
                  কত Data, কতগুলো দেশে। বেশিরভাগ App এর উত্তর একটা Server এর সীমার
                  অনেক ভেতরে।
                </ListItem>
                <ListItem>
                  <strong>PostgreSQL দিয়ে কি হয়ে যায়?</strong> হয়ে গেলে সেখানেই
                  থাকুন। না হলে বিশেষজ্ঞ যোগ করুন, আর ঠিক করে নিন Source of Truth কে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার নিজে বাছাই করে দেখুন। নিচে Island Tours এর নয়টা পরিস্থিতি।
                প্রতিটা পড়ে একটা পরিবার বেছে নিন, তারপর কারণ আর PostgreSQL এর লাইনটা
                পড়ুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DatabasePickerLab /> },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>একটা PostgreSQL এ চার রকম চেহারা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার নিজের চোখে দেখার পালা। নিচের প্রতিটা বক্সে আপনার Browser এর
                ভেতরেই একটা আসল PostgreSQL চলছে, তাতে Island Tours এর Database ভরা।
                আপনি এখনো SQL শেখেননি, তাতে কোনো সমস্যা নেই। শুধু Run চাপুন আর
                ফলাফলটা দেখুন। লেখার নিয়ম ধাপে ধাপে শিখবেন Module 03 থেকে। চাইলে
                কোনো শব্দ বদলে আবার চালান, Reset চাপলে সব আগের মতো হয়ে যাবে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম বক্সে Relational চেহারা। bookings Table এর প্রথম পাঁচটা Row
                দেখুন। খেয়াল করুন, কোথাও Customer এর নাম বা ট্যুরের নাম নেই, আছে শুধু
                নম্বর: customer_id আর departure_id। এই নম্বরগুলোই অন্য Table এর
                দিকে আঙুল তোলা Key।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Relational চেহারা"
              query={`SELECT booking_id, customer_id, departure_id, seats, status
FROM bookings
ORDER BY booking_id
LIMIT 5;`}
              caption="পাঁচটা Row আসবে। প্রথম দুটো Booking এর departure_id একই, 1। মানে দুজন আলাদা Customer একই তারিখের একই ট্যুরে যাচ্ছেন। পাঁচ নম্বরটা cancelled।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দ্বিতীয় বক্সে একই PostgreSQL এ একটা Document। এখানে কোনো Table থেকে
              পড়া হচ্ছে না। একটা JSON Document সরাসরি লেখা আছে, আর PostgreSQL কে
              বলা হচ্ছে তার days তালিকার দ্বিতীয় দিনের plan টা বের করে দিতে। তালিকা
              গোনা শুরু হয় শূন্য থেকে, তাই 1 মানে দ্বিতীয় দিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL এর ভেতরে Document"
              query={`SELECT '{
  "tour": "Saint Martin Island Escape",
  "days": [
    {"day": 1, "plan": "Ship from Teknaf"},
    {"day": 2, "plan": "Snorkelling at Chera Dwip"}
  ]
}'::jsonb -> 'days' -> 1 ->> 'plan' AS second_day;`}
              caption="উত্তর আসবে Snorkelling at Chera Dwip। JSONB হলো PostgreSQL এর Document রাখার Type। পুরো একটা Document Database না বসিয়েও Document এর কাজ এভাবে চলে, Module 15 এ পুরোটা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় বক্সে দুটো খোঁজ একসাথে। প্রথমটা নামের ভেতরে martin খোঁজে, আর দুটো
              ট্যুর পায়। দ্বিতীয়টা খোঁজে ভুল বানানে, sant martin। এই খোঁজ শুধু হুবহু
              লেখা মেলায়, তাই কিছুই পায় না। ঠিক এই জায়গাতেই Search Engine এর দরকার
              পড়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="হুবহু খোঁজ আর ভুল বানান"
              query={`SELECT title FROM tours WHERE title ILIKE '%martin%';
SELECT title FROM tours WHERE title ILIKE '%sant martin%';`}
              caption="প্রথম ফলাফলে Saint Martin Island Escape আর Saint Martin Luxury Stay, দ্বিতীয়টায় শূন্য Row। মানুষ ভুল বানানে লিখবেই, তাই বড় Search Box এর পেছনে সাধারণত একটা Search Engine থাকে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ বক্সে সেই Graph এর প্রশ্নটা, এবার SQL দিয়ে। Saint Martin Island
              Escape এ যাঁরা বুক করেছেন, তাঁরা আর কোন কোন ট্যুরে গেছেন। লেখাটা দেখতে
              ভয়ের লাগলে ভয় পাওয়ার কিছু নেই, Module 06 শেষে আপনি নিজে এটা লিখতে
              পারবেন। আপাতত শুধু গুনে দেখুন কয়টা JOIN লাগল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Graph এর প্রশ্ন, SQL দিয়ে"
              query={`SELECT DISTINCT c.full_name, other.title
FROM bookings b1
JOIN departures d1 ON d1.departure_id = b1.departure_id
JOIN customers c ON c.customer_id = b1.customer_id
JOIN bookings b2 ON b2.customer_id = b1.customer_id
JOIN departures d2 ON d2.departure_id = b2.departure_id
JOIN tours other ON other.tour_id = d2.tour_id
WHERE d1.tour_id = 1
  AND other.tour_id <> 1
ORDER BY c.full_name, other.title;`}
              caption="তিনটা Row আসবে: Oliver Bennett এর Bandarban Hill Trek, আর Rahim Uddin এর Sajek Valley Cloud Trip আর Sundarbans Mangrove Cruise। উপরের Graph এর ছবির সাথে মিলিয়ে দেখুন। পাঁচটা JOIN লাগল, আর আরেক ধাপ বাড়াতে চাইলে আরও দুটো।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ কোন Data কোথায় থাকে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার পুরো লেসনটা Island Tours এর উপর বসিয়ে দেখি। আজকের Island Tours এ
                দুটো Database চলে। PostgreSQL হলো Source of Truth: সব Customer,
                ট্যুর, তারিখ, Booking, Payment আর Review এখানে, ঠিক যেই আটটা Table
                আপনি এই ট্র্যাকে ব্যবহার করবেন। পাশে Redis, যেখানে থাকে Login Session
                আর বারবার লাগে এমন ট্যুরের তালিকার Cache। Redis এর সব Data হারালে
                মানুষকে আবার Login করতে হবে আর প্রথম কয়েকটা Page একটু ধীর খুলবে,
                কিন্তু একটা টাকার হিসাবও হারাবে না।
              </ContentParagraph>
              <ContentParagraph>
                বাকি পরিবারগুলো এখনো নেই, কারণ দরকার পড়েনি। নিচের Table এ প্রতিটা
                ধরনের Data এর জন্য আজকের সিদ্ধান্ত আর কবে সেটা বদলাতে পারে, তা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Data", "পরিবার", "আজ কোথায়", "কবে বদলাতে পারে"],
          rows: [
            ["Booking, Payment, Customer", "Relational", "PostgreSQL", "বদলাবে না, এটাই Source of Truth"],
            ["Login Session, ট্যুরের তালিকার Cache", "Key-Value", "Redis", "বদলাবে না, হারালে আবার বানানো যায়"],
            ["ট্যুরের দিনভিত্তিক Plan", "Document", "PostgreSQL এর JSONB", "ট্যুরের সংখ্যা আর ধরন অনেক বাড়লে"],
            ["ট্যুর খোঁজা", "Search", "PostgreSQL এর ILIKE আর Full-text Search", "ভুল বানান আর Ranking এর অভিযোগ বাড়লে"],
            ["যাঁরা গেছেন তাঁরা আর কোথায়", "Graph", "PostgreSQL এর JOIN", "Recommendation বড় Feature হলে"],
            ["জাহাজের GPS", "Time-series", "এখনো নেই", "GPS বসালে, প্রথমে TimescaleDB দিয়ে"],
            ["অর্থ দিয়ে খোঁজা", "Vector", "এখনো নেই", "AI Feature এলে, প্রথমে pgvector দিয়ে"],
            ["বছরের পর বছরের Report", "Columnar", "PostgreSQL", "Report মূল Database কে ধীর করতে শুরু করলে"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনার নিজের my-tours প্রজেক্টেও একই পথ নিন। শুরু করুন শুধু PostgreSQL
              দিয়ে। পুরো ট্র্যাক জুড়ে আপনি এটাকেই ধাপে ধাপে বানাবেন। Redis আসবে
              তখনই, যখন Session বা Cache এর দরকার নিজে টের পাবেন। এমন কোনো দিন
              আসবে না যখন একটা নতুন ধরনের Database যোগ না করার জন্য আপনার App
              ভেঙে পড়বে, কিন্তু অকারণে যোগ করা Database অনেক App এর গতি কমিয়েছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "request-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা Search থেকে একটা Booking, কোন ধাপে কোন Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন পর্যটক Search Box এ লিখলেন saint martin, তারপর একটা ট্যুর বুক
              করলেন। ভবিষ্যতের Island Tours ধরে নিন, যেখানে একটা Search Engine ও
              বসানো হয়েছে। এক এক ধাপে কোন Database কাজ করছে, দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "পরিচয় যাচাই, Key-Value থেকে",
              description:
                "Browser এর Request এর সাথে একটা Session ID আসে। API সেটা Key হিসেবে Redis কে দেয়, আর এক মিলিসেকেন্ডের কম সময়ে জানে মানুষটা কে। এখানে মূল Database কে ছোঁয়াই হয় না।",
            },
            {
              title: "শব্দ দিয়ে খোঁজা, Search Engine থেকে",
              description:
                "saint martin লেখাটা যায় Search Engine এ। সে তার নির্ঘণ্ট খুলে মানানসই ট্যুরের ID গুলো দেয়, এখানে 1 আর 8, বেশি মানানসইটা আগে। দাম বা খালি সিট সে দেয় না।",
            },
            {
              title: "সর্বশেষ দাম আর সিট, Relational থেকে",
              description:
                "ওই ID গুলো নিয়ে API যায় PostgreSQL এ, আর পড়ে প্রতিটা ট্যুরের এখনকার দাম আর সামনের তারিখগুলোতে কতগুলো সিট খালি। এই তথ্য Search Engine এর কপি থেকে নেওয়া যায় না, কারণ কপিটা কয়েক সেকেন্ড পিছিয়ে থাকতে পারে।",
            },
            {
              title: "ট্যুরের Page, Document থেকে",
              description:
                "পর্যটক Saint Martin Island Escape খুললেন। দিনভিত্তিক Plan আর ছবি আসে একটা Document থেকে, আজকের Island Tours এ যেটা PostgreSQL এর JSONB Column।",
            },
            {
              title: "Booking আর Payment, Relational এ, এক Transaction এ",
              description:
                "পর্যটক দুটো সিট বুক করে bKash এ টাকা দিলেন। Booking এর Row লেখা, সিট কমানো আর Payment এর Row লেখা, তিনটাই PostgreSQL এ এক Transaction এর ভেতরে, যাতে অর্ধেক হয়ে থেমে না থাকে।",
            },
            {
              title: "কপিগুলো হালনাগাদ",
              description:
                "Booking হয়ে যাওয়ার পর Redis এর ট্যুরের তালিকার Cache মুছে দেওয়া হয়, যাতে পরের জন সঠিক খালি সিট দেখেন। রাতে দিনের সব Booking এর একটা কপি যায় Report এর Database এ।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো বারবার হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নাম শুনে বাছাই করা।</strong> অমুক বড় কোম্পানি Cassandra
                ব্যবহার করে, তাই আমরাও করব। সেই কোম্পানির সমস্যা ছিল সেকেন্ডে লাখ
                Write, আপনার সমস্যা হয়তো দিনে দুইশ Booking। আগে নিজের প্রশ্ন আর
                আকার, তারপর নাম।
              </ListItem>
              <ListItem>
                <strong>Schema নেই মানে সহজ, এই ভাবনা।</strong> Document Database এ
                Table এর আকার আগে থেকে ঠিক করতে হয় না, তাই প্রথম সপ্তাহে কাজ দ্রুত
                এগোয়। কিন্তু আকারের নিয়মটা তখন App এর Code এ চলে যায়। ছয় মাস পর
                একই Collection এ পাঁচ রকম আকারের Document জমে, আর প্রতিটা পড়ার সময়
                সবগুলো রকম সামলাতে হয়।
              </ListItem>
              <ListItem>
                <strong>Cache কে Source of Truth বানানো।</strong> Redis এ Booking এর
                সিট গোনা রাখলেন, Server Restart হলো, গোনা হারাল। যে Data হারালে
                আবার বানানো যায় না, সেটা কখনো শুধু Cache এ রাখবেন না।
              </ListItem>
              <ListItem>
                <strong>Wide-column আর Columnar গুলিয়ে ফেলা।</strong> Report এর জন্য
                Cassandra নেওয়া, বা অনেক ছোট Write এর জন্য ClickHouse নেওয়া। নাম
                কাছাকাছি, কাজ প্রায় উল্টো।
              </ListItem>
              <ListItem>
                <strong>প্রথম দিনেই চার রকম Database।</strong> প্রতিটা Database এর
                Backup, Update, Monitoring আর কপি মেলানোর খরচ আছে। ছোট দল এই খরচে
                ডুবে যায়, আর আসল Feature এর সময় পায় না।
              </ListItem>
              <ListItem>
                <strong>NoSQL মানে দ্রুত, এই ধারণা।</strong> কোনো পরিবার সব কাজে দ্রুত
                নয়। Key-Value একটা Key তুলতে অসম্ভব দ্রুত, কিন্তু যোগফল বের করতে
                অক্ষম। দ্রুততা সবসময় একটা নির্দিষ্ট প্রশ্নের সাপেক্ষে।
              </ListItem>
              <ListItem>
                <strong>বড় Report মূল Database এ চালানো।</strong> মাস শেষের ভারী
                Report চলার সময় Booking ধীর হয়ে যায়। কেন হয় আর কী করতে হয়, Lesson 07
                এ।
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
      title: <SectionTitle>আরও পড়তে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Wikipedia, NoSQL</strong>, পরিবারগুলোর একটা পরিষ্কার তালিকা,
                প্রতিটার উদাহরণ সহ। Not only SQL নামের ব্যাখ্যাও এখানে।{" "}
                <a href="https://en.wikipedia.org/wiki/NoSQL" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  en.wikipedia.org/wiki/NoSQL
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Wide-column store</strong>, Wide-column আর
                Columnar এর নামের গোলমাল কোথা থেকে এল, তার ইতিহাস সহ।{" "}
                <a href="https://en.wikipedia.org/wiki/Wide-column_store" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  en.wikipedia.org/wiki/Wide-column_store
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Inverted index</strong>, Search Engine এর ভেতরের
                নির্ঘণ্টের ছোট আর পরিষ্কার ব্যাখ্যা।{" "}
                <a href="https://en.wikipedia.org/wiki/Inverted_index" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  en.wikipedia.org/wiki/Inverted_index
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Vector database</strong>, Embedding আর Nearest
                Neighbor খোঁজার ধারণা, পরিচিত Product এর তালিকা সহ।{" "}
                <a href="https://en.wikipedia.org/wiki/Vector_database" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  en.wikipedia.org/wiki/Vector_database
                </a>
              </ListItem>
              <ListItem>
                <strong>Wikipedia, Polyglot persistence</strong>, এক App এ একাধিক
                ধরনের Database রাখার ধারণা।{" "}
                <a href="https://en.wikipedia.org/wiki/Polyglot_persistence" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  en.wikipedia.org/wiki/Polyglot_persistence
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Docs, JSON Types</strong>, PostgreSQL এর ভেতরে
                Document রাখার অফিসিয়াল বর্ণনা। এখনই পুরোটা বোঝার দরকার নেই, Module 15
                এ ফিরে আসবেন।{" "}
                <a href="https://www.postgresql.org/docs/current/datatype-json.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  postgresql.org/docs/current/datatype-json.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Docs, Full Text Search</strong>, PostgreSQL এর
                নিজের Search এর ভূমিকা অংশ।{" "}
                <a href="https://www.postgresql.org/docs/current/textsearch-intro.html" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  postgresql.org/docs/current/textsearch-intro.html
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
                  Database এর পরিবার আলাদা হয় দুটো জিনিসে: Data এর আকার, আর সবচেয়ে
                  বেশি করা প্রশ্ন, মানে Access Pattern।
                </ListItem>
                <ListItem>
                  Relational: Table, Key আর নিয়ম। টাকা, সিট আর যেকোনো সম্পর্কিত
                  হিসাবের জন্য। এই ট্র্যাকের বিষয়।
                </ListItem>
                <ListItem>
                  Document: একটা জিনিসের সব তথ্য এক Document এ। আকার বদলায় আর পুরোটা
                  একসাথে পড়া হয় এমন Data এর জন্য।
                </ListItem>
                <ListItem>
                  Key-Value: চাবি দিলে মান, Memory থেকে, অসম্ভব দ্রুত। Session আর
                  Cache এর জন্য, আসল হিসাবের জন্য নয়।
                </ListItem>
                <ListItem>
                  Wide-column: বিশাল Write, অনেক মেশিন, আগে থেকে জানা প্রশ্ন।
                  Columnar এর সাথে গুলিয়ে ফেলবেন না।
                </ListItem>
                <ListItem>
                  Graph: Node আর Edge, সম্পর্ক ধরে অনেক ধাপ হাঁটার জন্য।
                </ListItem>
                <ListItem>
                  Time-series: সময় আর মাপ, শুধু যোগ হয়, পুরনোটা ছোট বা মুছে ফেলা হয়।
                </ListItem>
                <ListItem>
                  Search Engine: শব্দের নির্ঘণ্ট, ভুল বানান আর Ranking। Data সবসময়
                  মূল Database এর কপি।
                </ListItem>
                <ListItem>
                  Vector: অর্থকে সংখ্যার তালিকায় বদলে কাছাকাছি জিনিস খোঁজা, AI
                  Feature এর জন্য।
                </ListItem>
                <ListItem>
                  Columnar: Column ধরে রাখা, অনেক Row এর বড় Report এর জন্য।
                </ListItem>
                <ListItem>
                  বাস্তবে একটা মূল Database থাকে Source of Truth, পাশে দরকার মতো
                  সাহায্যকারী। PostgreSQL নিজেই অনেক পরিবারের কাজ পারে, তাই শুরুটা
                  প্রায় সবসময় সেখান থেকে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ট্র্যাক কেন Relational দিয়ে শুরু, সেটা এখন পরিষ্কার। ব্যবসার
                সবচেয়ে দামি Data, টাকা আর মানুষের হিসাব, এখানেই থাকে, আর বাকি পরিবারগুলো
                বোঝাও সহজ হয় একবার Table, Key আর Query হাতে এলে। পরের লেসনে আমরা ঠিক
                সেই ভিতটা গড়ব: Table আসলে কী, Row আর Column এর আসল নাম কী, আর Key দিয়ে
                কীভাবে Island Tours এর আটটা Table একটা ব্যবসার গল্প হয়ে ওঠে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["পরিবার", "Data এর আকার", "Island Tours এ", "পরিচিত নাম"],
    rows: [
      ["Relational", "Table, Row, Column, Key দিয়ে জোড়া", "Booking, Payment, Customer", "PostgreSQL, MySQL, SQLite"],
      ["Document", "JSON এর মতো Document, ভেতরে তালিকা", "ট্যুরের দিনভিত্তিক Plan", "MongoDB, Firestore"],
      ["Key-Value", "Key আর তার Value", "Session, Cache, Rate Limit", "Redis, Valkey, Memcached"],
      ["Wide-column", "Partition Key ধরে ভাগ, অনেক মেশিনে", "ভবিষ্যতের Click এর স্রোত", "Cassandra, ScyllaDB"],
      ["Graph", "Node আর Edge", "যাঁরা গেছেন তাঁরা আর কোথায়", "Neo4j, Amazon Neptune"],
      ["Time-series", "সময় আর মাপ, শুধু যোগ হয়", "জাহাজের GPS, Server এর মাপ", "TimescaleDB, InfluxDB, Prometheus"],
      ["Search Engine", "শব্দের নির্ঘণ্ট, Inverted Index", "ভুল বানানেও ট্যুর খোঁজা", "Elasticsearch, OpenSearch, Meilisearch"],
      ["Vector", "Embedding, সংখ্যার লম্বা তালিকা", "অর্থ দিয়ে ট্যুর খোঁজা", "pgvector, Pinecone, Qdrant"],
      ["Columnar", "Column ধরে রাখা, Compress করা", "বছরের পর বছরের আয়ের Report", "ClickHouse, DuckDB, BigQuery"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর প্রতিটা ট্যুরের দিনভিত্তিক Plan আলাদা আকারের, আর ট্যুরের Page খুললে পুরো Plan একসাথে দেখাতে হয়। কোন পরিবার এই চেহারার সাথে সবচেয়ে মানায়?",
        options: [
          {
            key: "A",
            text: "Document, কারণ আকার বদলায় আর পুরো জিনিসটা একসাথে পড়া হয়",
            isCorrect: true,
            explanation:
              "ঠিক। একটা Document এ পুরো Plan রাখলে এক Read এ Page এর সব Data আসে, আর ট্যুর থেকে ট্যুরে আকার বদলালেও সমস্যা নেই। PostgreSQL এর JSONB দিয়েও এভাবে রাখা যায়।",
          },
          {
            key: "B",
            text: "Key-Value, কারণ প্রতিটা ট্যুরের একটা ID আছে",
            isCorrect: false,
            explanation:
              "ID দিয়ে তোলা গেলেও Key-Value Store Value এর ভেতরে দেখে না। Plan এর ভেতরের কোনো ঘর ধরে খুঁজতে চাইলে আর পারবেন না।",
          },
          {
            key: "C",
            text: "Time-series, কারণ Plan এ দিন লেখা আছে",
            isCorrect: false,
            explanation:
              "দিন লেখা থাকলেই Time-series হয় না। Time-series মানে নিয়মিত আসা মাপ, যা শুধু শেষে যোগ হয়।",
          },
          {
            key: "D",
            text: "Columnar, কারণ Plan এ অনেকগুলো ঘর আছে",
            isCorrect: false,
            explanation:
              "Columnar বানানো অনেক Row এর বড় Report এর জন্য, একটা জিনিস পুরোটা তুলে আনার জন্য নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "Redis এ Session রাখা আছে, Key হলো Session ID। নিচের কোন প্রশ্নের উত্তর Redis নিজে থেকে দিতে পারবে না?",
        options: [
          {
            key: "A",
            text: "session:7f3a9c এর Value কী",
            isCorrect: false,
            explanation: "এটাই তো Key-Value Store এর একমাত্র আর সবচেয়ে দ্রুত প্রশ্ন।",
          },
          {
            key: "B",
            text: "এই মুহূর্তে ঢাকা থেকে Login করা সব Session কোনগুলো",
            isCorrect: true,
            explanation:
              "ঠিক। এখানে Value এর ভেতরের তথ্য দিয়ে খুঁজতে হবে, কিন্তু Key-Value Store Value খুলে দেখে না। App কে নিজে সব Key ঘুরে দেখতে হবে।",
          },
          {
            key: "C",
            text: "session:7f3a9c নামে কোনো Key আছে কিনা",
            isCorrect: false,
            explanation: "Key আছে কিনা জানাও Key ধরেই প্রশ্ন, এটা সে সহজেই পারে।",
          },
          {
            key: "D",
            text: "session:7f3a9c এর Value বদলে নতুন একটা রাখা",
            isCorrect: false,
            explanation: "Key ধরে নতুন মান লেখাও এর সাধারণ কাজ।",
          },
        ],
      },
      {
        id: 3,
        text: "Wide-column আর Columnar Database এর আসল পার্থক্য কোনটা?",
        options: [
          {
            key: "A",
            text: "দুটো একই জিনিসের দুই নাম",
            isCorrect: false,
            explanation: "নাম কাছাকাছি হলেও কাজ প্রায় উল্টো। এটাই সবচেয়ে সাধারণ ভুল।",
          },
          {
            key: "B",
            text: "Wide-column রাখে Row এর দল ধরে, অনেক ছোট Write এর জন্য। Columnar রাখে Column ধরে, বড় Report এর জন্য",
            isCorrect: true,
            explanation:
              "ঠিক। Cassandra এর মতো Wide-column অনলাইন কাউন্টারের মতো অসংখ্য Write নেয়। ClickHouse এর মতো Columnar অল্প কয়েকটা Column এর উপর কোটি Row এর যোগফল বের করে।",
          },
          {
            key: "C",
            text: "Wide-column এ SQL চলে, Columnar এ চলে না",
            isCorrect: false,
            explanation: "উল্টো দিকে বললেও ভুল হতো। ClickHouse, BigQuery এর মতো Columnar Database SQL এ কথা বলে।",
          },
          {
            key: "D",
            text: "Columnar এ Table নেই",
            isCorrect: false,
            explanation: "দুই পরিবারেই Table আছে, পার্থক্য Data ডিস্কে কীভাবে সাজানো আর কোন কাজের জন্য বানানো।",
          },
        ],
      },
      {
        id: 4,
        text: "Island Tours এর Redis এর সব Data হঠাৎ হারিয়ে গেল। কী ঘটবে?",
        options: [
          {
            key: "A",
            text: "সব Booking আর Payment হারিয়ে যাবে",
            isCorrect: false,
            explanation: "Booking আর Payment থাকে PostgreSQL এ, যেটা Source of Truth। Redis এ সেগুলোর কিছুই রাখা হয় না।",
          },
          {
            key: "B",
            text: "মানুষকে আবার Login করতে হবে, আর Cache আবার ভরা পর্যন্ত কয়েকটা Page একটু ধীর হবে, কিন্তু কোনো হিসাব হারাবে না",
            isCorrect: true,
            explanation:
              "ঠিক। Redis শুধু এমন Data রাখে যা হারালে আবার বানানো যায়। এটাই Source of Truth আর সাহায্যকারীর পার্থক্য।",
          },
          {
            key: "C",
            text: "PostgreSQL ও বন্ধ হয়ে যাবে",
            isCorrect: false,
            explanation: "দুটো আলাদা Server, আলাদা Program। একটার Data হারালে আরেকটার কিছু হয় না।",
          },
          {
            key: "D",
            text: "কিছুই টের পাওয়া যাবে না",
            isCorrect: false,
            explanation: "টের পাওয়া যাবে, Session হারানোয় সবাই Logout হয়ে যাবেন। তবে ক্ষতিটা সাময়িক।",
          },
        ],
      },
      {
        id: 5,
        text: "See It Yourself অংশে ILIKE '%sant martin%' কোনো Row পায়নি। কেন?",
        options: [
          {
            key: "A",
            text: "PostgreSQL ইংরেজি বোঝে না",
            isCorrect: false,
            explanation: "একই Box এর প্রথম খোঁজটা martin দিয়ে ঠিকই দুটো ট্যুর পেয়েছে।",
          },
          {
            key: "B",
            text: "এই খোঁজ শুধু হুবহু লেখা মেলায়, আর কোনো ট্যুরের নামে sant martin লেখা নেই। ভুল বানান সামলানো Search Engine এর কাজ",
            isCorrect: true,
            explanation:
              "ঠিক। ILIKE বড় ছোট হাতের অক্ষরের পার্থক্য উপেক্ষা করে, কিন্তু বানান মেলায় হুবহু। কাছাকাছি শব্দ খোঁজা আর Ranking এর জন্য Search Engine, বা PostgreSQL এর আরও উন্নত Search কৌশল লাগে।",
          },
          {
            key: "C",
            text: "tours Table খালি",
            isCorrect: false,
            explanation: "tours Table এ নয়টা ট্যুর আছে, আগের খোঁজেই দেখেছেন।",
          },
          {
            key: "D",
            text: "Query তে Syntax Error ছিল",
            isCorrect: false,
            explanation: "Error হলে লাল রঙে ERROR লেখা আসত। এখানে Query ঠিকঠাক চলেছে, শুধু কিছু মেলেনি।",
          },
        ],
      },
      {
        id: 6,
        text: "Vector Database কীসের ভিত্তিতে ফলাফল খুঁজে দেয়?",
        options: [
          {
            key: "A",
            text: "শব্দের হুবহু মিল",
            isCorrect: false,
            explanation: "সেটা সাধারণ খোঁজ বা Search Engine এর কাজ।",
          },
          {
            key: "B",
            text: "বর্ণানুক্রম",
            isCorrect: false,
            explanation: "বর্ণানুক্রমে সাজানো কোনো অর্থ বোঝে না।",
          },
          {
            key: "C",
            text: "অর্থ থেকে বানানো সংখ্যার তালিকা, মানে Embedding, এর কাছাকাছি হওয়া",
            isCorrect: true,
            explanation:
              "ঠিক। অর্থে কাছাকাছি লেখার Embedding ও কাছাকাছি হয়, তাই শব্দ না মিললেও শান্ত, সবুজ, পানির ধারে লিখলে Ratargul আসে।",
          },
          {
            key: "D",
            text: "কোন ট্যুর সবচেয়ে বেশি বিক্রি হয়েছে",
            isCorrect: false,
            explanation: "বিক্রির হিসাব একটা যোগফলের প্রশ্ন, Vector খোঁজার সাথে এর সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা ছোট দল তাদের নতুন App এর জন্য প্রথম দিনেই PostgreSQL, MongoDB, Redis আর Elasticsearch বসাতে চায়। সবচেয়ে ভালো পরামর্শ কোনটা?",
        options: [
          {
            key: "A",
            text: "চারটাই বসান, পরে লাগবেই",
            isCorrect: false,
            explanation: "প্রতিটা Database এর Backup, Update, Monitoring আর কপি মেলানোর খরচ আছে, যা প্রথম দিন থেকেই দিতে হবে।",
          },
          {
            key: "B",
            text: "PostgreSQL দিয়ে শুরু করুন, আর বাকিগুলো আনুন তখনই যখন একটা নির্দিষ্ট, মাপা প্রয়োজন PostgreSQL মেটাতে পারছে না",
            isCorrect: true,
            explanation:
              "ঠিক। JSONB, Full-text Search আর এমনকি Session ও শুরুতে PostgreSQL দিয়ে চলে। দরকার নিজে টের পেলে তখন সাহায্যকারী যোগ করুন, আর Source of Truth ঠিক করে রাখুন।",
          },
          {
            key: "C",
            text: "শুধু MongoDB নিন, কারণ NoSQL বেশি দ্রুত",
            isCorrect: false,
            explanation: "NoSQL নামে দ্রুততার কোনো প্রতিশ্রুতি নেই। আর টাকার হিসাবে Transaction আর নিয়ম দরকার।",
          },
          {
            key: "D",
            text: "শুধু Redis নিন, কারণ Memory সবচেয়ে দ্রুত",
            isCorrect: false,
            explanation: "শুধু Key ধরে প্রশ্ন করা যায়, আর Data হারানোর ঝুঁকি। আসল হিসাবের জায়গা এটা নয়।",
          },
        ],
      },
      {
        id: 8,
        text: "NoSQL শব্দটা সম্পর্কে কোন কথাটা সঠিক?",
        options: [
          {
            key: "A",
            text: "NoSQL একটা নির্দিষ্ট Database এর নাম",
            isCorrect: false,
            explanation: "NoSQL একটা ছাতার নাম, যার নিচে Document, Key-Value, Wide-column, Graph সহ অনেক পরিবার।",
          },
          {
            key: "B",
            text: "NoSQL Database এ কখনো SQL এর মতো ভাষা থাকে না",
            isCorrect: false,
            explanation: "অনেকেরই SQL এর মতো ভাষা আছে, যেমন Cassandra এর CQL। এজন্যই অনেকে নামটা পড়েন Not only SQL।",
          },
          {
            key: "C",
            text: "এটা Relational ছাড়া অন্য পরিবারগুলোর একটা ছাতার নাম, যাকে অনেকে Not only SQL হিসেবেও পড়েন",
            isCorrect: true,
            explanation:
              "ঠিক। আর নামের ভেতরে দ্রুত বা আধুনিক হওয়ার কোনো প্রতিশ্রুতি নেই, প্রতিটা পরিবার শুধু নিজের ধরনের প্রশ্নে ভালো।",
          },
          {
            key: "D",
            text: "NoSQL মানে সবসময় Relational এর চেয়ে দ্রুত",
            isCorrect: false,
            explanation: "দ্রুততা সবসময় একটা নির্দিষ্ট প্রশ্নের সাপেক্ষে। যোগফলের প্রশ্নে একটা Key-Value Store পুরোপুরি অক্ষম।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: Data এর মানচিত্র",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>একটা চেনা App এর Data সাজান:</strong> আপনার রোজ ব্যবহার করা একটা
        App বেছে নিন, যেমন খাবার অর্ডারের App বা রাইড শেয়ারিং App। তার আটটা আলাদা
        ধরনের Data খুঁজে বের করুন, যেমন অর্ডার, চালকের Live অবস্থান, Search,
        রেটিং। প্রতিটার পাশে লিখুন কোন পরিবারে মানায়, আর এক লাইনে কেন। আকার আর
        Access Pattern, দুটোই উল্লেখ করুন।
      </span>,
      <span key="2">
        <strong>Island Tours এর জাহাজ ট্র্যাকিং:</strong> ধরুন Island Tours
        জাহাজের Live অবস্থান দেখানোর Feature আনছে, প্রতি দশ সেকেন্ডে একটা মাপ।
        এক বছরে কয়টা মাপ জমবে হিসাব করুন। তারপর লিখুন Data কোথায় রাখবেন, পুরনো
        Data কতদিন পর কীভাবে ছোট করবেন, আর কতদিন পর মুছবেন।
      </span>,
      <span key="3">
        <strong>দুইভাবে একই ট্যুর:</strong> Sundarbans Mangrove Cruise এর তিন
        দিনের একটা Plan বানান। প্রথমে একটা JSON Document হিসেবে লিখুন, তারপর একই
        জিনিস দুটো Table হিসেবে, tours আর tour_days। প্রতিটার একটা সুবিধা আর একটা
        অসুবিধা লিখুন।
      </span>,
      <span key="4">
        <strong>Query Box এ নিজে খুঁজুন:</strong> See It Yourself এর তৃতীয় বক্সে
        martin বদলে cruise, tea আর hill দিয়ে খুঁজুন। তারপর তিনটা ভুল বানান দিয়ে
        চেষ্টা করুন। প্রতিটা খোঁজের লেখা আর ফলাফলের Row এর সংখ্যা টুকে রাখুন।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৮ লাইন):</strong> একজন বন্ধু বললেন, MongoDB তো
        PostgreSQL এর চেয়ে দ্রুত, তাই নতুন Booking App এ সবকিছু MongoDB তে রাখব।
        তাঁকে আট লাইনে বোঝান দ্রুততা কেন প্রশ্নের উপর নির্ভর করে, Booking আর
        Payment এর জন্য কী দরকার, আর Source of Truth কাকে বলে।
      </span>,
    ],
    deliverables: [
      <span key="1">আটটা Data, প্রতিটার পরিবার আর কারণ সহ একটা তালিকা</span>,
      <span key="2">এক বছরের মাপের হিসাব, আর রাখা, ছোট করা আর মোছার নিয়ম</span>,
      <span key="3">একই Plan এর JSON আর দুই Table রূপ, সুবিধা আর অসুবিধা সহ</span>,
      <span key="4">প্রতিটা খোঁজের লেখা আর Row এর সংখ্যা</span>,
      <span key="5">বন্ধুর জন্য আট লাইনের ব্যাখ্যা</span>,
    ],
  },
  practicalLab: {
    title: "এক PostgreSQL, ছয় রকম প্রশ্ন",
    subtitle: "লেসনের Query Box এ, অথবা Module 02 এর পর নিজের psql এ",
    stepName: "LAB",
    steps: [
      {
        title: "Relational চেহারা দেখা",
        description:
          "bookings Table এর প্রথম পাঁচটা Row দেখুন। কোথায় নাম নেই আর কোথায় শুধু নম্বর, খেয়াল করুন।",
      },
      {
        title: "Key দিয়ে একটা জিনিস তোলা",
        description:
          "একটা নির্দিষ্ট customer_id দিয়ে একজন Customer কে তুলুন। Key-Value Store এর প্রশ্ন, Relational এ।",
      },
      {
        title: "PostgreSQL এর ভেতরে Document",
        description:
          "একটা JSON Document এর ভেতর থেকে নির্দিষ্ট ঘরের মান বের করুন। Document Database এর প্রশ্ন, JSONB দিয়ে।",
      },
      {
        title: "হুবহু খোঁজ আর শব্দের খোঁজ",
        description:
          "ILIKE আর Full-text Search পাশাপাশি চালিয়ে দেখুন দুটো কীভাবে আলাদা।",
      },
      {
        title: "সময় ধরে গোনা",
        description:
          "প্রতি মাসে কতগুলো Booking হয়েছে বের করুন। Time-series ধাঁচের প্রশ্ন, Relational এ।",
      },
      {
        title: "সম্পর্ক ধরে দুই ধাপ",
        description:
          "Saint Martin এ যাঁরা গেছেন তাঁরা আর কোথায় গেছেন, Graph এর প্রশ্নটা SQL দিয়ে চালান আর JOIN গুনুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-relational-shape.sql",
        language: "sql",
        code: `SELECT booking_id, customer_id, departure_id, seats, status
FROM bookings
ORDER BY booking_id
LIMIT 5;

--  booking_id | customer_id | departure_id | seats | status
-- ------------+-------------+--------------+-------+-----------
--  1          | 1           | 1            | 2     | confirmed
--  2          | 2           | 1            | 4     | confirmed
--  3          | 3           | 2            | 1     | confirmed
--  4          | 4           | 3            | 3     | confirmed
--  5          | 5           | 3            | 2     | cancelled
-- (5 rows)`,
      },
      {
        filename: "2-one-thing-by-key.sql",
        language: "sql",
        code: `-- একটা Key দিয়ে একটা জিনিস, Key-Value Store এর একমাত্র প্রশ্ন
SELECT full_name, email, city
FROM customers
WHERE customer_id = 7;

--  full_name      | email                       | city
-- ----------------+-----------------------------+--------
--  Arif Chowdhury | arif.chowdhury@mail.example | Khulna
-- (1 row)`,
      },
      {
        filename: "3-document-in-postgres.sql",
        language: "sql",
        code: `SELECT '{
  "tour": "Saint Martin Island Escape",
  "days": [
    {"day": 1, "plan": "Ship from Teknaf"},
    {"day": 2, "plan": "Snorkelling at Chera Dwip"}
  ]
}'::jsonb -> 'days' -> 1 ->> 'plan' AS second_day;

--  second_day
-- ---------------------------
--  Snorkelling at Chera Dwip
-- (1 row)`,
      },
      {
        filename: "4-exact-vs-word-search.sql",
        language: "sql",
        code: `-- হুবহু লেখা মেলানো
SELECT title FROM tours WHERE title ILIKE '%martin%';
--  Saint Martin Island Escape
--  Saint Martin Luxury Stay
-- (2 rows)

SELECT title FROM tours WHERE title ILIKE '%sant martin%';
-- (0 rows)

-- শব্দ ধরে খোঁজা, PostgreSQL এর নিজের Full-text Search
SELECT title
FROM tours
WHERE to_tsvector('english', title) @@ to_tsquery('english', 'cruise');
--  Sundarbans Mangrove Cruise
-- (1 row)`,
      },
      {
        filename: "5-count-by-month.sql",
        language: "sql",
        code: `-- সময়ের বালতিতে ভাগ করে গোনা, Time-series এর রোজকার প্রশ্ন
SELECT date_trunc('month', booked_at)::date AS month,
       count(*) AS bookings
FROM bookings
GROUP BY 1
ORDER BY 1;

--  month      | bookings
-- ------------+----------
--  2025-12-01 | 2
--  2026-01-01 | 6
--  2026-02-01 | 1
--  2026-03-01 | 3
--  2026-09-01 | 3
--  2026-10-01 | 9
-- (6 rows)`,
      },
      {
        filename: "6-two-hops-with-joins.sql",
        language: "sql",
        code: `-- Saint Martin Island Escape (tour_id 1) এ যাঁরা বুক করেছেন,
-- তাঁরা আর কোন কোন ট্যুরে গেছেন
SELECT DISTINCT c.full_name, other.title
FROM bookings b1
JOIN departures d1 ON d1.departure_id = b1.departure_id
JOIN customers c ON c.customer_id = b1.customer_id
JOIN bookings b2 ON b2.customer_id = b1.customer_id
JOIN departures d2 ON d2.departure_id = b2.departure_id
JOIN tours other ON other.tour_id = d2.tour_id
WHERE d1.tour_id = 1
  AND other.tour_id <> 1
ORDER BY c.full_name, other.title;

--  full_name      | title
-- ----------------+----------------------------
--  Oliver Bennett | Bandarban Hill Trek
--  Rahim Uddin    | Sajek Valley Cloud Trip
--  Rahim Uddin    | Sundarbans Mangrove Cruise
-- (3 rows)`,
      },
    ],
    tip: "ছয়টা পরীক্ষা শেষে একটা জিনিস খেয়াল করুন: সবগুলোই একটা PostgreSQL এ চলল। Key ধরে তোলা, Document, শব্দের খোঁজ, সময়ের বালতি, এমনকি সম্পর্ক ধরে হাঁটা। ছোট আর মাঝারি App এ প্রায় সব প্রশ্নের উত্তর একটা ভালো Relational Database দিতে পারে, আর বিশেষজ্ঞ Database আসে তখন, যখন কোনো একটা প্রশ্ন এত বড় বা এত ঘন ঘন হয়ে যায় যে PostgreSQL আর তাল রাখতে পারে না। ছয় নম্বরের Query টা ভালো করে দেখে রাখুন। Module 06 শেষে এটা আপনার কাছে একদম সহজ মনে হবে।",
  },
};
