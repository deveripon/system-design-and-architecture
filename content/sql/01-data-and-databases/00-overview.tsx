import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import {
  BeforeAfterSplit,
  ModuleBridgeDiagram,
  ModuleRoadmap,
} from "../../../components/course/topics/overview/module-overview";
import { RealLifeLab } from "../../../components/course/topics/overview/overview-animations";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dataAndDatabasesOverviewContent: TopicData = {
  id: "data-and-databases-overview",
  introduction: {
    badge: "MODULE 01 · OVERVIEW",
    title: <SectionTitle>Data এর জন্য একটা আসল ঘর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি যে App ই খোলেন, bKash, Daraz, Facebook বা একটা ট্যুর বুকিংয়ের
          সাইট, পর্দায় যা দেখেন তার প্রায় সবটাই কোথাও না কোথাও জমা রাখা তথ্য।
          আপনার নাম, আপনার আগের অর্ডার, আপনার Balance, কাল রাতে পাঠানো মেসেজ।
          App টা বন্ধ করে দিলেও এগুলো হারায় না, ফোন বদলালেও হারায় না। কারণ এই
          তথ্য আপনার ফোনে থাকে না, থাকে এমন এক জায়গায় যার একমাত্র কাজ তথ্য
          যত্ন করে রাখা আর চাইলেই খুঁজে দেওয়া। সেই জায়গার নাম Database।
        </ContentParagraph>
        <ContentParagraph>
          এই ট্র্যাক SQL আর Database শেখার, একদম শূন্য থেকে। আর এটা তার প্রথম
          মডিউল। এখানে এখনো কোনো Query লেখা শেখানো হবে না। তার আগে একটা জিনিস
          পরিষ্কার হওয়া দরকার, Data কে কেন একটা আলাদা, বিশেষ ঘরে রাখতে হয়, সেই
          ঘর দেখতে কেমন, তার সাথে কোন ভাষায় কথা বলতে হয়, আর একটা চালু App সেই
          ঘরের দরজায় কীভাবে টোকা দেয়। এই ভিতটা পাকা হলে পরের প্রতিটা মডিউল সহজ
          লাগবে।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা কোনো লেসন নয়, এটা মডিউলের মানচিত্র। এখানে আপনি জানবেন এই
          মডিউল কেন আছে, সাতটা লেসনে কী কী শিখবেন, কেন শেখাটা জরুরি, কাজের
          জায়গায় কোথায় কোথায় লাগবে, আর বাস্তবে কীভাবে ব্যবহার করবেন। নতুন কোনো
          শব্দ দেখলে ঘাবড়াবেন না। এখানে শুধু নামটা শুনিয়ে রাখা হচ্ছে, বোঝানোর
          কাজটা করবে নির্দিষ্ট লেসন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "খাতায় লিখে রাখা আর গুছিয়ে রাখা এক জিনিস নয়। খাতা শুধু মনে রাখে। গুছিয়ে রাখা জায়গা মনে রাখে, নিয়ম মানায়, একসাথে দশজনকে সামলায়, আর এক মুহূর্তে বলে দেয় কোন জিনিসটা কোথায়।",
      author: "Data & Databases",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>সিট একটা, বিক্রি হলো দুইবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। Island Tours তখন সবে শুরু হয়েছে। অফিসে তিনজন
                মানুষ, আর সব বুকিং লেখা থাকে একটা Spreadsheet এ, যেটা সবাই মিলে
                একসাথে খোলেন। প্রতিটা লাইনে একজন পর্যটকের নাম, ফোন নম্বর, কোন
                ট্যুর, কোন তারিখ, কয়টা সিট আর কত টাকা। কয়েক মাস ভালোই চলছিল।
              </ContentParagraph>
              <ContentParagraph>
                তারপর এলো ঈদের ছুটি। Saint Martin এর জাহাজে শেষ দুইটা সিট বাকি।
                সকাল দশটায় অফিসের রিনা আপা ফোনে একটা পরিবারকে সিট দুইটা দিয়ে
                দিলেন, Spreadsheet এ লিখলেন। ঠিক একই মিনিটে অন্য Computer এ বসা
                সজীব আরেকটা পরিবারকে একই দুইটা সিট দিলেন, কারণ তাঁর পর্দায় তখনো
                সিট দুইটা খালি দেখাচ্ছিল। দুইজনই Save করলেন। একজনের লেখা আরেকজনের
                লেখার উপর বসে গেল, আর দুইটা পরিবার টাকা দিয়ে ঘাটে এসে দেখলেন সিট
                একটাই সেট।
              </ContentParagraph>
              <ContentParagraph>
                সেই মাসেই আরও কয়েকটা ঝামেলা হলো, যেগুলো আলাদা আলাদা দেখলে ছোট মনে
                হয়, কিন্তু একসাথে দেখলে একটা ব্যবসা ডুবিয়ে দিতে পারে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  একই মানুষ খাতায় তিনবার, তিন বানানে: Rahim Uddin, rahim uddin
                  আর Rahim Udin। কেউ জানে না এরা একজন নাকি তিনজন।
                </ListItem>
                <ListItem>
                  Sundarbans ট্যুরের দাম বাড়ানো হলো। দামটা লেখা ছিল প্রতিটা বুকিংয়ের
                  লাইনে আলাদা করে, তাই অর্ধেক লাইনে নতুন দাম বসল, অর্ধেকে পুরনোটাই
                  থেকে গেল।
                </ListItem>
                <ListItem>
                  কেউ সিটের ঘরে লিখে ফেললেন পাঁচটা, কেউ লিখলেন মাইনাস এক। খাতা
                  কোনো আপত্তি করল না।
                </ListItem>
                <ListItem>
                  নতুন যোগ দেওয়া একজন Intern পুরো ফাইলটা দেখতে পেলেন, প্রত্যেক
                  পর্যটকের ফোন নম্বরসহ। কাকে কতটুকু দেখানো উচিত, সেই ব্যবস্থাই
                  ছিল না।
                </ListItem>
                <ListItem>
                  মালিক জিজ্ঞেস করলেন, গত মাসে কোন ট্যুর থেকে কত আয় হলো। উত্তর বের
                  করতে একজনের পুরো সন্ধ্যা লেগে গেল, আর শেষে সংখ্যাটা কেউ বিশ্বাস
                  করলেন না।
                </ListItem>
                <ListItem>
                  একদিন একজন ভুল করে একটা পুরো Column মুছে ফেললেন। কবে, কে, আর
                  আগে কী লেখা ছিল, কিছুই জানার উপায় রইল না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার দৃশ্যটা বদলান। আপনি একজন Developer, একটা দলে নতুন যোগ
                দিয়েছেন। প্রথম সপ্তাহেই সিনিয়ররা এরকম কথা বলেন: bookings Table টা
                একটু দেখবেন, এর Primary Key কোনটা, Data টা Postgres এ আছে, Report টা
                Production এ না চালিয়ে Replica তে চালাবেন, Connection String টা env
                থেকে নেবেন। প্রতিটা বাক্য আপনি শুনছেন, মাথা নাড়ছেন, কিন্তু ভেতরে
                ভেতরে বুঝছেন না কোন শব্দটা কোন জিনিসের নাম, আর কোনটা কেন জরুরি।
              </ContentParagraph>
              <ContentParagraph>
                উপরের দুইটা দৃশ্য আসলে একই সমস্যার দুই দিক। প্রথমটায় তথ্য এমন
                জায়গায় রাখা, যেটা তথ্য রাখার জন্য বানানোই হয়নি। দ্বিতীয়টায় তথ্য
                ঠিক জায়গাতেই আছে, কিন্তু সেই জায়গাটার ভাষা আর নিয়ম আপনার অচেনা।
                এই মডিউল দুই দিকেরই উত্তর দেয়। শেষ করার পর আপনি জানবেন খাতার কোন
                সীমাবদ্ধতা থেকে Database এর জন্ম, Database আসলে কী আর কী করে, কত
                রকমের Database আছে, Table আর Key কীভাবে তথ্যকে জুড়ে রাখে, SQL কোন
                ভাষা, একটা App কীভাবে Database এর সাথে কথা বলে, আর কেন একই Database
                এ বুকিং নেওয়া আর মাসের হিসাব করা দুইটা আলাদা ধরনের কাজ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "উপরের শব্দগুলো এখন না বুঝলে কোনো সমস্যা নেই",
          content: (
            <p>
              Table, Primary Key, Postgres, Replica, Connection String, এই শব্দগুলো
              এখানে ইচ্ছা করেই ব্যাখ্যা ছাড়া রাখা হয়েছে। এগুলো হলো সেই দরজা, যেগুলোর
              সামনে আপনি একদিন দাঁড়াবেনই। এই মডিউলের প্রতিটা লেসন এরকম কয়েকটা দরজা
              খুলে দেয়। মডিউল শেষে এই পাতায় ফিরে এসে দ্বিতীয় দৃশ্যটা আবার পড়বেন,
              দেখবেন প্রতিটা বাক্য তখন সাধারণ কথা মনে হচ্ছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>পুরো মডিউল, এক কথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বড়, গোছানো গুদামের কথা ভাবুন। ভেতরে হাজার হাজার জিনিস, তাক
                ধরে ধরে সাজানো, প্রতিটা তাকে নম্বর। আপনি নিজে তাকের ভেতর ঢোকেন না।
                দরজায় একজন গুদামরক্ষক বসে থাকেন। আপনি তাঁকে একটা চিরকুট দেন, তাতে
                একটা নির্দিষ্ট ভাষায় লেখা থাকে আপনি কী চান। গুদামরক্ষক চিরকুট পড়ে
                ঠিক জিনিসটা এনে দেন, নতুন জিনিস জমা নেন, আর কেউ ভুল জিনিস রাখতে
                চাইলে ফিরিয়ে দেন। একসাথে দশজন এলেও তিনি গুলিয়ে ফেলেন না, আর রাতে
                তালা দিয়ে খাতায় লিখে রাখেন আজ কী কী ঢুকল আর বেরোল।
              </ContentParagraph>
              <ContentParagraph>
                Database এর জগৎ ঠিক এভাবে সাজানো। গোছানো তাকগুলো হলো Database,
                মানে সাজিয়ে রাখা Data। গুদামরক্ষক হলেন একটা Program, যার নাম DBMS,
                Database Management System। PostgreSQL আর MySQL এরকম দুইটা Program
                এর নাম। আর চিরকুটের ভাষাটার নাম SQL। আপনি কখনো সরাসরি ডিস্কের ফাইল
                ঘাঁটবেন না, সবসময় SQL এ লিখে DBMS কে বলবেন, আর DBMS কাজটা করে দেবে।
                এই তিনটা জিনিস আলাদা করে চিনতে পারাই এই মডিউলের প্রথম বড় অর্জন, কারণ
                নতুন শিক্ষার্থীদের সবচেয়ে বেশি গুলিয়ে যায় এখানেই।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে পুরো মডিউল এক কথায় এই। Data কেন একটা আলাদা ঘর চায়, সেই ঘর
                আর তার রক্ষক কী কী করে, ঘরটা কত রকম আকারের হয়, সবচেয়ে প্রচলিত
                আকার Table কীভাবে কাজ করে, রক্ষকের সাথে কোন ভাষায় কথা বলতে হয়, একটা
                চালু App কীভাবে সেই কথা বলে, আর ঘরটাকে দিয়ে কোন দুই রকম কাজ করানো
                হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: এই মডিউল কোথা থেকে শুরু করে আর পরের মডিউলকে কী দিয়ে যায়"
              caption="এটা পুরো ট্র্যাকের প্রথম মডিউল, তাই বাঁ দিকে আগের কোনো মডিউল নেই, শুরু এখান থেকেই। এই মডিউল আপনাকে কোনো কিছু ইনস্টল করতে বলে না, শুধু ধারণাগুলো পরিষ্কার করে: Data কেন আলাদা ঘর চায়, Table আর Key দিয়ে সেই ঘর কীভাবে সাজানো, SQL কোন ভাষা, আর App কীভাবে কথা বলে। পরের মডিউল Setup & Tools ধরে নেয় এই ধারণাগুলো আপনার কাছে আছে, তারপর আপনার নিজের Computer এ PostgreSQL বসায়, psql আর একটা GUI Tool চালু করে, আর এই ট্র্যাকের Sample Database টা Load করে। তাই এই মডিউল না পড়ে সেখানে গেলে আপনি Command চালাতে পারবেন ঠিকই, কিন্তু জানবেন না কী চালু করলেন।"
              current={{
                tag: "Module 01",
                title: "Data & Databases",
                lines: ["Data কেন আলাদা ঘর চায়", "Table, Key আর SQL চেনা", "App কীভাবে কথা বলে"],
              }}
              after={{
                tag: "Module 02",
                title: "Setup & Tools",
                lines: ["নিজের মেশিনে PostgreSQL", "psql আর GUI Client", "Sample Database Load"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সাইটের অন্য দুইটা ট্র্যাকের সাথে এই মডিউলের সম্পর্কটাও বলে রাখা
                ভালো। DevOps ট্র্যাকে যদি আগে Port, Socket আর Three-way Handshake
                পড়ে থাকেন, তাহলে লেসন ৬ এ সেগুলো আবার দেখা দেবে, কারণ App আর
                Database এর মধ্যে কথাও ঠিক সেই রাস্তা দিয়েই যায়। না পড়ে থাকলেও কোনো
                সমস্যা নেই, লেসনে যতটুকু দরকার ততটুকু বলে দেওয়া আছে, আর আগ্রহ হলে
                লিংক ধরে চলে যেতে পারবেন। System Design ট্র্যাকের Database এর অংশ আর
                DevOps ট্র্যাকের PostgreSQL এর গভীর মডিউল, দুইটাই ধরে নেয় আপনি SQL
                জানেন। এই ট্র্যাক সেই জানাটার জায়গা, আর এই মডিউল তার প্রথম ইট।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>সাতটা লেসন, সাতটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে সাতটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেই লেসনে চলে যাবেন, তবে প্রথমবার ক্রম ধরে
              পড়াই ভালো, কারণ প্রতিটা লেসন আগেরটার উপর দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="data-and-databases"
              questions={{
                "why-not-spreadsheets":
                  "Spreadsheet দিয়েই তো কাজ চলছিল, তাহলে ঠিক কোন মুহূর্তে সেটা ভেঙে পড়ে?",
                "what-is-a-database":
                  "Database, DBMS আর Database Server, তিনটা আলাদা জিনিস কেন, আর DBMS আসলে কী কী করে দেয়?",
                "kinds-of-databases":
                  "Table ছাড়াও Data রাখার আর কী কী আকার আছে, আর কোন কাজে কোনটা বেছে নেবেন?",
                "relational-model":
                  "Table, Row, Column আর Key দিয়ে একটা বুকিং কীভাবে তার Customer আর ট্যুরকে খুঁজে পায়?",
                "what-is-sql":
                  "SQL, MySQL আর PostgreSQL এর মধ্যে আসল তফাত কী, আর SQL এর Command গুলো কয় ভাগে ভাগ করা?",
                "app-database-conversation":
                  "একটা App Database এর দরজায় কীভাবে টোকা দেয়, প্রশ্ন পাঠায় আর উত্তর ফেরত পায়?",
                "oltp-vs-olap":
                  "একটা বুকিং নেওয়া আর মাস শেষের আয়ের হিসাব, একই Database এর দুইটা কাজ কেন এত আলাদা?",
              }}
              footer="সাতটা লেসন তিন ভাগে পড়লে মনে রাখা সহজ। প্রথম তিনটা কেন আর কী: খাতা কোথায় হারে, Database কী, আর তার কত রকম আকার। মাঝের দুইটা হলো আকার আর ভাষা: Table আর Key, তারপর SQL। শেষ দুইটা হলো চালু সিস্টেমে Database: App কীভাবে কথা বলে, আর Database কে দিয়ে কোন দুই রকম কাজ করানো হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই সাতটা লেসন একটা গল্প হিসেবে শুনুন, যাতে বোঝা যায় কোনটা
                কোনটার জন্য পথ তৈরি করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, Why Spreadsheets and Files Break:</strong> শুরু
                  হবে উপরের ওই অফিস থেকেই। Island Tours এর Spreadsheet এ ঠিক কোন
                  কোন জায়গায় ফাটল ধরে, তা এক এক করে দেখবেন: একই মানুষ তিন বানানে,
                  দুইজনের লেখা একে অপরের উপর বসে যাওয়া, এক জায়গায় দাম বদলালে আরেক
                  জায়গায় পুরনো থেকে যাওয়া, যেকোনো আজেবাজে মান বসে যাওয়া, সবাই সব কিছু
                  দেখতে পাওয়া। লেসনটা সৎও থাকবে, কোন কাজে Spreadsheet এখনো ঠিক
                  পছন্দ সেটাও বলবে। শেষে আপনার হাতে থাকবে একটা চাওয়ার তালিকা, যে
                  তালিকা পূরণ করতেই Database এর জন্ম।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, What a Database and a DBMS Are:</strong> সেই
                  চাওয়ার তালিকার উত্তর এখানে। Database মানে সাজানো Data, DBMS মানে
                  সেই Program যে Data রাখে, খোঁজে আর পাহারা দেয়, আর Database
                  Server মানে যে যন্ত্রে বা Process এ সেই Program চলছে। DBMS কী কী
                  কাজ করে দেয়, যেমন Data হারাতে না দেওয়া, দ্রুত খুঁজে দেওয়া, নিয়ম
                  মানানো, একসাথে অনেকজনকে সামলানো, কে কী দেখবে ঠিক করা আর Backup
                  রাখা, প্রতিটার নাম শুনবেন আর জানবেন ট্র্যাকের কোন মডিউলে সেটা
                  গভীরে শেখানো হবে। ভিডিওতে বা বইয়ে RDBMS শব্দটা প্রথম যেখানে
                  শোনেন, তার সহজ মানেও এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, Kinds of Databases:</strong> সব Database দেখতে
                  এক রকম নয়। কেউ Data রাখে Table এ, কেউ রাখে একেকটা আস্ত Document
                  হিসেবে, কেউ শুধু একটা চাবি আর তার মান, কেউ মানুষ আর তাদের সম্পর্কের
                  জাল, কেউ সময় ধরে ধরে মাপা সংখ্যা, কেউ AI এর বানানো অর্থের ছাপ। প্রতিটা
                  আকারের জন্য Island Tours থেকেই একটা উদাহরণ, বাস্তবের Product এর নাম,
                  আর কখন বেছে নেবেন তা থাকবে। এই লেসন শেষে আপনি বুঝবেন এই ট্র্যাক কেন
                  Table ওয়ালা Relational Database দিয়ে শুরু করছে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, The Relational Model:</strong> এবার সবচেয়ে
                  প্রচলিত আকারটার ভেতরে ঢুকবেন। Table মানে ঘর কাটা একটা ছক, Row মানে
                  একটা লাইন, Column মানে একটা ঘরের নাম। প্রতিটা লাইনকে আলাদা করে চেনার
                  জন্য একটা পরিচয় নম্বর লাগে, যার নাম Primary Key, আর এক Table থেকে
                  আরেক Table এর লাইনকে দেখানোর জন্য লাগে Foreign Key। Island Tours এর
                  আসল Table গুলো ধরে আপনি নিজের হাতে একটা বুকিং থেকে তার Customer, তার
                  তারিখ আর তার ট্যুর পর্যন্ত হেঁটে যাবেন। লেসন ১ এর দাম বদলানোর
                  সমস্যাটা কীভাবে এখানে নিজে থেকেই মিটে যায়, সেটাও দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, What SQL Is:</strong> আকার চেনা হলো, এবার ভাষা।
                  লেসনটা শুরু হবে সেই প্রশ্ন দিয়ে যা প্রায় প্রত্যেক নতুন শিক্ষার্থীর
                  মনে আসে: SQL আর MySQL কি একই জিনিস? উত্তর হলো না, SQL ভাষা, আর
                  MySQL আর PostgreSQL সেই ভাষায় কথা বলা দুইটা Program, প্রত্যেকের
                  নিজের আঞ্চলিক টান সহ। এরপর দেখবেন SQL এর Command গুলো পাঁচটা দলে ভাগ
                  করা, যাদের ছোট নাম DDL, DML, DQL, DCL আর TCL, আর একটা SQL বাক্য
                  কোন কোন অংশ দিয়ে তৈরি। MySQL এর ভিডিও দেখে PostgreSQL এ অনুশীলন
                  করতে চাইলে কোথায় সাবধান থাকতে হবে, তার একটা পাশাপাশি তালিকাও পাবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, How an App Talks to a Database:</strong> এতক্ষণ
                  আপনি নিজে Database এর সাথে কথা বলার কথা ভেবেছেন। কিন্তু বাস্তবে
                  প্রতিদিন হাজারবার কথা বলে আপনার App। পর্যটক বুক বোতাম চাপলে
                  Browser কথা বলে App এর সাথে, আর App কথা বলে Database এর সাথে।
                  Browser কেন কখনো সরাসরি Database এর দরজায় যায় না, Connection String
                  এর প্রতিটা অংশ কী বোঝায়, Port 5432 এ লাইন কীভাবে খোলে, প্রশ্নটা
                  Database এর ভেতরে কোন ধাপে চলে, আর উত্তর কীভাবে ফেরে, সবটা এক
                  যাত্রায় দেখবেন। Connection খোলা কেন দামি, আর Query তে বাইরের লেখা
                  বসানোর নিরাপদ উপায় কী, সেগুলোর প্রথম পরিচয়ও এখানে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, OLTP vs OLAP:</strong> শেষ লেসন দুই রকম কাজের
                  গল্প। একটা হলো প্রতি মুহূর্তের ছোট ছোট কাজ, যেমন একটা সিট বুক করা,
                  যেখানে দরকার গতি আর নির্ভুলতা। আরেকটা হলো মাস শেষের বড় হিসাব, যেমন
                  কোন ট্যুর থেকে কত আয় হলো, যেখানে লাখো Row একসাথে পড়তে হয়। এই দুইটা
                  একই Database এ একসাথে চালালে কেন বুকিংয়ের পাতা ধীর হয়ে যায়, আর বড়
                  কোম্পানিগুলো এর সমাধান কীভাবে করে, তার প্রথম ছবি পাবেন। লেসনের শেষে
                  পুরো মডিউলটা আবার এক গল্পে জোড়া লাগানো হবে, আর আপনাকে পরের
                  মডিউলের দিকে এগিয়ে দেওয়া হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                সাতটা লেসনেই একটা জিনিস একই থাকবে, Island Tours এর Database। আটটা
                Table: destinations, guides, tours, customers, departures, bookings,
                payments আর reviews। একটা ছোট কিন্তু সম্পূর্ণ ট্যুর ব্যবসার Data, যা
                পুরো ট্র্যাক জুড়ে চলবে। প্রতিটা লেসনে কয়েকটা Query বক্স আছে, যেখানে
                আপনার Browser এর ভেতরেই আসল PostgreSQL চলে। এই মডিউলে আপনি এখনো
                Query লিখতে শেখেননি, তাই সেখানে শুধু Run চাপবেন আর ফলাফলটা দেখবেন।
                লেখার নিয়ম আসবে Module 03 এ। কিন্তু প্রথম দিন থেকেই আসল Data নিজের
                চোখে দেখা, আর আসল Database কে উত্তর দিতে দেখা, শেখাটাকে অনেক বেশি
                বাস্তব করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-learn-it",
      subHeader: { index: "004", title: "Why Learn It" },
      title: <SectionTitle>ORM তো Query লিখে দেয়, তবু কেন শিখব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা ন্যায্য। আজকাল অনেক Framework এমন Tool দেয়, যাকে বলে ORM,
                যেটা আপনার Code দেখে নিজেই SQL বানিয়ে নেয়। অনেকে শুধু কয়েকটা
                SELECT মুখস্থ করে কাজ চালিয়ে নেন। তাহলে Table, Key, DBMS, OLTP এর মতো
                ধারণা নিয়ে আলাদা একটা পুরো মডিউল কেন?
              </ContentParagraph>
              <ContentParagraph>
                সৎ উত্তর হলো, যতদিন Data অল্প আর সব কিছু ঠিকঠাক চলে, ততদিন হয়তো
                দরকার নেই। দরকার পড়ে যেদিন একটা বুকিং দুইবার বিক্রি হয়, যেদিন একটা
                পাতা দশ সেকেন্ড লাগায়, যেদিন একটা Report এর সংখ্যা কেউ বিশ্বাস করে না,
                অথবা যেদিন Interview তে জিজ্ঞেস করা হয় আপনি এই কাজে কোন Database
                বেছে নেবেন আর কেন। তখন মুখস্থ করা কয়েকটা লাইন কোনো কাজে আসে না, কাজে
                আসে ভেতরের ছবিটা। আর ORM যত ভালোই হোক, সে যে SQL বানায় তা চলে একটা
                Database এর ভেতরে। সেই Database কে না চিনলে ORM এর ভুলও আপনি চিনতে
                পারবেন না।
              </ContentParagraph>
              <ContentParagraph>
                না শিখলে পরে যা যা দাম দিতে হয়, সেগুলো এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পরের প্রতিটা মডিউল ভিত ছাড়া দাঁড়াবে:</strong> Module 03
                  এর SELECT লিখতে গেলেই Table, Row আর Column এর ধারণা লাগবে। Module
                  06 এর Join পুরোটা দাঁড়িয়ে Primary Key আর Foreign Key এর উপর।
                  Module 09 আর 11 এ নিজের Table নিজে ডিজাইন করবেন, যেখানে লেসন ১ এর
                  প্রতিটা সমস্যা আবার ফিরে আসবে। Module 12 এর Transaction আসলে লেসন
                  ১ এর ওই দুইবার বিক্রি হওয়া সিটের পূর্ণ সমাধান। Module 17 এ Code থেকে
                  Database ব্যবহার করবেন, যার শুরু লেসন ৬ এ। আর Module 19 আর 20 এর
                  Replica আর Warehouse এর বীজ পোঁতা হবে লেসন ৭ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল Database বেছে নেবেন:</strong> নতুন Project শুরুর দিন
                  দলে প্রায়ই তর্ক হয়, PostgreSQL নাকি MongoDB, নাকি Redis। কোন আকারের
                  Data কোন কাজে মানায়, তা না জানলে সিদ্ধান্ত হয় হুজুগে, আর ভুলের দাম
                  দিতে হয় বছরের পর বছর।
                </ListItem>
                <ListItem>
                  <strong>Error পড়ে সমস্যা চেনা যাবে না:</strong> App চালু হতে গিয়ে
                  Database এর সাথে লাইন খুলতে পারল না, নাকি লাইন খুলেছে কিন্তু
                  Password ভুল, নাকি Database ঠিক আছে কিন্তু Table টাই নেই, এই তিনটা
                  তিন জায়গার সমস্যা। App আর Database এর কথোপকথনের ধাপগুলো জানা না
                  থাকলে তিনটাই শুধু Database কাজ করছে না।
                </ListItem>
                <ListItem>
                  <strong>দলের কথা আর Documentation বুঝবেন না:</strong> Primary Key,
                  Foreign Key, Schema, RDBMS, OLTP, Replica, এই শব্দগুলো কোনো একটা
                  কোম্পানির ভাষা নয়, পুরো শিল্পের সাধারণ ভাষা। প্রতিটা Documentation,
                  প্রতিটা Code Review আর প্রতিটা Architecture মিটিং এই ভাষায় হয়।
                </ListItem>
                <ListItem>
                  <strong>অন্যকে বোঝাতে পারবেন না:</strong> কেউ জিজ্ঞেস করলেন, Excel
                  থাকতে Database লাগে কেন, অথবা SQL আর MySQL এর তফাত কী। এই মডিউল
                  ছাড়া উত্তরটা হয় আমতা আমতা, আর এই মডিউলের পরে উত্তরটা হয় দুই মিনিটের
                  একটা পরিষ্কার গল্প।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউল কয়েকটা প্রচলিত ভুল ধারণাও সরিয়ে দেয়, যেগুলো অনেকে
                বহুদিন বয়ে বেড়ান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল ধারণা, SQL আর MySQL একই জিনিস:</strong> একটা ভাষা,
                  আরেকটা সেই ভাষায় কথা বলা একটা Program। এই তফাত না বুঝলে চাকরির
                  বিজ্ঞাপন পড়তেও ভুল হয়। পুরো ছবিটা লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Database মানে বড় একটা Excel ফাইল:</strong>{" "}
                  দেখতে Table এর মতো হলেও Database এর আসল শক্তি তার রক্ষকের মধ্যে,
                  যে নিয়ম মানায়, একসাথে অনেকজনকে সামলায় আর Data হারাতে দেয় না। লেসন
                  ১ আর ২ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, NoSQL নতুন, তাই ভালো:</strong> নতুন বা পুরনো
                  প্রশ্ন নয়, প্রশ্ন হলো Data এর আকার আর কাজের ধরন। অনেক বড় কোম্পানি
                  আজও মূল Data রাখে Relational Database এ। কেন, তা লেসন ৩ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Browser সরাসরি Database এ যেতে পারে:</strong>{" "}
                  পারলে যেকোনো দর্শক আপনার পুরো Database এর চাবি পেয়ে যেতেন। মাঝখানে
                  App কেন থাকতেই হয়, তা লেসন ৬ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, একটা Database এ সব কাজ একসাথে চালালেই হয়:</strong>{" "}
                  দিনের বেলা বুকিংয়ের Database এ মাসের বিশাল হিসাব চালালে সাইট ধীর হয়ে
                  যেতে পারে। কাজের ধরন অনুযায়ী আলাদা করার চিন্তাটা লেসন ৭ এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো মডিউলে একটাই ধারণা ধরে রাখুন",
          content: (
            <p>
              Data নিজে কিছু করে না। তাকে রাখতে হয় এমন একটা ঘরে, যার একজন রক্ষক
              আছেন, কিছু নিয়ম আছে, আর কথা বলার একটা নির্দিষ্ট ভাষা আছে। ঘরটা হলো
              Database, রক্ষক হলো DBMS, ভাষাটা SQL। এই মডিউলের প্রতিটা লেসন এই তিনটার
              কোনো একটার দিকে আলো ফেলে: খাতা কেন রক্ষকহীন ঘর, রক্ষক কী কী করেন, ঘর
              কত রকম আকারের হয়, Table আকারের ঘর কীভাবে সাজানো, ভাষাটা কেমন, App কীভাবে
              সেই ভাষায় কথা বলে, আর রক্ষককে দিয়ে কোন দুই রকম কাজ করানো হয়। কোনো
              কিছু গুলিয়ে গেলে নিজেকে জিজ্ঞেস করুন, এটা ঘরের কথা, রক্ষকের কথা, নাকি
              ভাষার কথা।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে লাগবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে ছয়টা আসল মুহূর্ত, যেগুলো একজন Developer, Data Analyst বা Backend
              Engineer এর কাজে নিয়মিত আসে। একটা বেছে নিন, দেখুন এই মডিউল না জানলে
              ঘটনাটা কেমন যায় আর জানলে কেমন যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা
              আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "spreadsheet-to-app",
                  label: "তিন বছরের Excel থেকে App",
                  situation:
                    "একটা ট্রাভেল এজেন্সির মালিক আপনাকে তিন বছরের বুকিংয়ের একটা Excel ফাইল দিলেন। বললেন, এটাকে একটা App বানিয়ে দিন, যাতে স্টাফরা একসাথে কাজ করতে পারেন। ফাইলে প্রতিটা লাইনে নাম, ফোন, ট্যুর, দাম, তারিখ, সব একসাথে।",
                  without:
                    "আপনি Excel এর লাইনটাকেই হুবহু একটা বড় Table বানিয়ে ফেলেন। কয়েক মাস পরে সেই পুরনো সমস্যাগুলো App এর ভেতরেই ফিরে আসে: একই মানুষ কয়েকবার, দাম বদলালে আধাআধি বদলায়, আর Report এর সংখ্যা মেলে না।",
                  withIt:
                    "আপনি ফাইলটা দেখেই চিনতে পারেন কোন তথ্য বারবার লেখা হয়েছে। Customer, ট্যুর, তারিখ আর বুকিং আলাদা Table এ ভাগ করেন, প্রতিটার Primary Key দেন, আর Foreign Key দিয়ে জোড়া লাগান। পুরনো সমস্যাগুলো আর ফেরার পথই পায় না।",
                  lessons: [
                    "Why Spreadsheets and Files Break",
                    "The Relational Model: Tables, Rows, Columns, Keys",
                  ],
                },
                {
                  id: "which-database",
                  label: "PostgreSQL নাকি MongoDB?",
                  situation:
                    "নতুন Feature এর মিটিং। একজন বলছেন সব কিছু MongoDB তে রাখা হোক, কারণ সেটা আধুনিক। আরেকজন বলছেন PostgreSQL ই যথেষ্ট। Tech Lead আপনার মত জানতে চাইলেন।",
                  without:
                    "আপনি যে নাম বেশি শুনেছেন সেটার পক্ষে বলেন, অথবা চুপ থাকেন। সিদ্ধান্ত হয় হুজুগে, আর ছয় মাস পরে টাকার হিসাব মেলাতে গিয়ে দল বুঝতে পারে Data এর আকারের সাথে Database মেলেনি।",
                  withIt:
                    "আপনি আগে জিজ্ঞেস করেন Data দেখতে কেমন আর প্রশ্নগুলো কী রকম। টাকা আর সিটের মতো একে অপরের সাথে জড়ানো Data, যেখানে হিসাব নির্ভুল হতেই হবে, সেখানে Relational এর পক্ষে যুক্তি দেন, আর কোন ছোট অংশে অন্য আকার মানাতে পারে তাও বলেন।",
                  lessons: ["Kinds of Databases", "OLTP vs OLAP"],
                },
                {
                  id: "sql-vs-mysql",
                  label: "চাকরির বিজ্ঞাপনে SQL",
                  situation:
                    "একটা চাকরির বিজ্ঞাপনে লেখা Strong SQL, PostgreSQL preferred। আপনি SQL শিখেছেন একটা MySQL এর ভিডিও থেকে। Interview তে জিজ্ঞেস করা হলো, MySQL আর PostgreSQL এ কাজ করার তফাত কী।",
                  without:
                    "আপনি ভাবেন SQL মানেই MySQL, তাই ভয় পেয়ে আবেদনই করেন না, অথবা Interview তে বলেন দুইটা একই জিনিস। প্রশ্নকর্তা বুঝে যান ভিতটা কাঁচা।",
                  withIt:
                    "আপনি বলেন SQL হলো ভাষা, আর দুইটা Program সেই ভাষার দুই রকম উপভাষায় কথা বলে। মূল অংশ একই, আর কোন কোন জায়গায় লেখা আলাদা তার কয়েকটা উদাহরণ দেন। প্রশ্নকর্তা বুঝে যান আপনি দুইটাতেই কাজ চালিয়ে নিতে পারবেন।",
                  lessons: ["What SQL Is: Standard, Dialects, Command Families"],
                },
                {
                  id: "cannot-connect",
                  label: "Deploy এর পর Database এ ঢুকছে না",
                  situation:
                    "আপনার App নিজের Computer এ চমৎকার চলছিল। Server এ তোলার পর Log এ লেখা আসছে, Database এর সাথে Connect করা যাচ্ছে না, সাথে একটা Port নম্বর 5432।",
                  without:
                    "আপনি Database মুছে নতুন করে বানান, তারপর App বারবার Restart করেন। কোনটা ঠিক কোন ধাপে আটকেছে তা জানা নেই, তাই চেষ্টা চলে এলোমেলো।",
                  withIt:
                    "আপনি জানেন একটা App কয়েকটা ধাপে Database এর কাছে পৌঁছায়: ঠিকানা, Port, লাইন খোলা, তারপর নাম আর Password দিয়ে পরিচয় দেওয়া। Error এর শব্দ পড়ে বুঝে যান আটকেছে লাইন খোলার ধাপে, তাই আগে দেখেন Database Server চালু কিনা আর Connection String এ ঠিকানা আর Port ঠিক আছে কিনা।",
                  lessons: [
                    "How an App Talks to a Database",
                    "What a Database and a DBMS Are",
                  ],
                },
                {
                  id: "report-slows-site",
                  label: "Report চালাতেই সাইট ধীর",
                  situation:
                    "মাসের প্রথম দিন সকাল দশটা। হিসাব বিভাগ গত এক বছরের সব বুকিং থেকে আয়ের একটা বড় Report চালালেন। ঠিক তখন পর্যটকরা অভিযোগ করতে লাগলেন, বুকিংয়ের পাতা খুলতে অনেক সময় লাগছে।",
                  without:
                    "আপনি ভাবেন Server দুর্বল, তাই বড় Server কিনে ফেলেন। পরের মাসের প্রথম দিনে আবার একই ঘটনা, কারণ আসল কারণটা ধরাই পড়েনি।",
                  withIt:
                    "আপনি চিনে ফেলেন দুইটা আলাদা ধরনের কাজ একই Database এ ধাক্কাধাক্কি করছে: অনেক ছোট ছোট বুকিং আর একটা বিশাল হিসাব। প্রথমে Report টা ভিড় কম এমন সময়ে সরান, আর দীর্ঘমেয়াদে Report এর জন্য আলাদা একটা Copy বা আলাদা জায়গার প্রস্তাব দেন।",
                  lessons: ["OLTP vs OLAP"],
                },
                {
                  id: "interview-keys",
                  label: "Interview: Primary Key আর Foreign Key",
                  situation:
                    "Junior Backend পদের Interview। প্রথম প্রশ্ন: Primary Key আর Foreign Key এর তফাত কী, আর একটা অর্ডার আর তার Customer কে কীভাবে জোড়া লাগাবেন?",
                  without:
                    "আপনি বলেন Primary Key হলো id নামের Column, আর Foreign Key সম্পর্কে মনে পড়ে না। উদাহরণ চাইলে আটকে যান।",
                  withIt:
                    "আপনি বলেন Primary Key একটা লাইনের অনন্য পরিচয়, আর Foreign Key হলো আরেক Table এর সেই পরিচয়ের দিকে আঙুল তোলা। তারপর একটা বুকিং থেকে তার Customer পর্যন্ত হাতে এঁকে দেখান, কেন Customer এর নাম বুকিংয়ের লাইনে আবার লেখার দরকার নেই।",
                  lessons: [
                    "The Relational Model: Tables, Rows, Columns, Keys",
                    "What SQL Is: Standard, Dialects, Command Families",
                  ],
                },
              ]}
              footer="ছয়টা মুহূর্তের প্রতিটায় খেয়াল করুন, তফাতটা বুদ্ধির নয়, জানার। যিনি জানেন তিনি বেশি পরিশ্রম করছেন না, বরং কম করছেন, কারণ তিনি জানেন কোথায় তাকাতে হবে আর কোন প্রশ্নটা আগে করতে হবে। নিচে লেখা লেসনের নামগুলো মনে রাখুন, মডিউল পড়ার সময় এই মুহূর্তগুলো আবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের ছয়টা মুহূর্ত ছাড়াও এই মডিউলের ধারণাগুলো প্রতিদিন চোখে পড়বে
                এরকম জায়গায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Tool এর পর্দায়:</strong> pgAdmin, DBeaver বা TablePlus
                  খুললে বাঁ দিকে একটা গাছের মতো তালিকা দেখবেন, Server, তার ভেতর
                  Database, তার ভেতর Schema আর Table। Supabase বা Neon এর মতো Cloud
                  Database এর Dashboard এও Table গুলো একইভাবে সাজানো থাকে। এই মডিউলের পরে সেই গাছটা পরিচিত
                  লাগবে। Tool গুলো নিজে হাতে চালাবেন Module 02 এ।
                </ListItem>
                <ListItem>
                  <strong>Code এর ভেতরে:</strong> Prisma বা Drizzle এর Schema ফাইল,
                  NestJS এর Entity, বা একটা <code>.env</code> ফাইলে DATABASE_URL
                  নামের একটা লাইন। প্রতিটা আসলে Table, Column, Key বা Connection
                  String এর কথাই বলছে, শুধু অন্য পোশাকে।
                </ListItem>
                <ListItem>
                  <strong>Error Message এ:</strong> Table খুঁজে না পাওয়ার Error,
                  একই পরিচয় নম্বর দুইবার ঢোকানোর Error, Database এর সাথে লাইন না
                  খোলার Error। এগুলোর নাম আর মানে পরের মডিউলগুলোতে আসবে, কিন্তু এই
                  মডিউলের পরে আপনি অন্তত বুঝবেন কোন Error ঘর নিয়ে, কোনটা নিয়ম নিয়ে,
                  আর কোনটা দরজায় পৌঁছানো নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>চাকরির কাজে:</strong> পুরনো Excel বা CSV থেকে Data নতুন
                  সিস্টেমে আনা, নতুন Feature এর জন্য Table এর পরিকল্পনা, কোন Database
                  নেওয়া হবে সেই আলোচনা, আর Report বানানোর অনুরোধ। Backend, Data
                  Analyst আর DevOps, তিন রকম কাজেই এগুলো আসে।
                </ListItem>
                <ListItem>
                  <strong>Interview তে:</strong> SQL আর NoSQL এর তফাত, Primary Key আর
                  Foreign Key, DBMS আর RDBMS এর মানে, OLTP আর OLAP, আর SQL এর Command
                  এর দলগুলো। এই প্রশ্নগুলো প্রায় প্রতিটা Backend আর Data পদের
                  Interview এর প্রথম দশ মিনিটে আসে, আর এই মডিউল ঠিক এগুলোর জন্যই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "in-real-life",
      subHeader: { index: "006", title: "In Real Life" },
      title: <SectionTitle>Island Tours এর প্রতিটা ক্লিক একটা Row</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Website এ একজন পর্যটক যা যা করেন, তার প্রায় প্রতিটা
                কাজ Database এ একটা নতুন লাইন লেখে বা পুরনো একটা লাইন বদলায়। একটা
                দিনের কাজগুলো পাশাপাশি রাখলে ছবিটা এরকম দাঁড়ায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  একজন নতুন পর্যটক Account খুললেন। customers Table এ তাঁর জন্য
                  একটা নতুন লাইন হলো, সাথে একটা পরিচয় নম্বর। তাঁর Email আগে থেকে
                  কারো থাকলে Database নিজেই লাইনটা নিতে অস্বীকার করবে, খাতার মতো
                  চুপচাপ দুইবার লিখে রাখবে না।
                </ListItem>
                <ListItem>
                  তিনি Saint Martin এর একটা তারিখে দুইটা সিট বুক করলেন। bookings
                  Table এ একটা লাইন হলো, যেটা নিজের ভেতরে তাঁর নাম আবার লেখে না,
                  শুধু তাঁর পরিচয় নম্বর আর তারিখের পরিচয় নম্বর রাখে। একই সাথে
                  departures Table এ ওই তারিখের খালি সিট দুইটা কমে গেল।
                </ListItem>
                <ListItem>
                  bKash এ টাকা দিলেন। payments Table এ লাইন হলো, কোন বুকিংয়ের টাকা,
                  কত, কোন পথে, কখন। টাকা ফেরত হলে লাইনটা মুছে ফেলা হয় না, তার
                  অবস্থা বদলে যায়, কারণ টাকার ইতিহাস কখনো হারানো চলে না।
                </ListItem>
                <ListItem>
                  ঘুরে এসে পাঁচ তারা দিয়ে একটা Review লিখলেন। reviews Table এ
                  লাইন হলো, আর নিয়ম আছে একটা বুকিংয়ে একটার বেশি Review হবে না।
                </ListItem>
                <ListItem>
                  রাতে মালিক তাঁর Dashboard খুললেন, দেখলেন আজ কতগুলো বুকিং হলো আর
                  কোন ট্যুর থেকে এই মাসে কত আয়। এই কাজটা উপরের চারটার মতো একটা দুইটা
                  লাইন ছোঁয় না, একসাথে অনেক লাইন পড়ে যোগ বিয়োগ করে। লেসন ৭ এর পুরো
                  গল্পটা এই তফাত নিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                খেয়াল করুন, উপরের প্রতিটা লাইনে এই মডিউলের কোনো না কোনো লেসন লুকিয়ে
                আছে। নাম দুইবার না লেখা লেসন ১ আর ৪ এর কথা। Email এর নিয়ম মানানো লেসন
                ২ এর DBMS এর কাজ। টাকার Data কেন Table এ রাখা লেসন ৩ এর প্রশ্ন।
                Website থেকে Database পর্যন্ত বুকিংটা পৌঁছানো লেসন ৬ এর যাত্রা। আর
                মালিকের Dashboard লেসন ৭ এর দ্বিতীয় ধরনের কাজ।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল চলাকালীন আপনি নিজে যা যা করবেন, তা খুব নির্দিষ্ট।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  উপরের বাক্সের লিংক ধরে Island Tours Database এর পাতাটা খুলবেন।
                  আটটা Table এর ছবি দেখবেন, প্রতিটা Column এর মানে পড়বেন, আর দেখবেন
                  কোন Table কোন Table কে দেখায়। লেসন ৪ পড়ার সময় এই পাতাটা পাশের
                  Tab এ খোলা রাখলে সুবিধা হবে।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Query বক্সে Run চাপবেন, ফলাফল দেখবেন, তারপর একটা
                  শব্দ বদলে আবার চালাবেন, যেমন tours এর জায়গায় customers। ভুল হলে
                  Database যে Error দেয়, সেটাও মন দিয়ে পড়বেন। Reset চাপলে সব আবার
                  শুরুর অবস্থায় ফিরে যায়, তাই ভাঙার ভয় নেই।
                </ListItem>
                <ListItem>
                  ওই পাতার ইচ্ছা করে রাখা অদ্ভুত Data গুলোর তালিকায় চোখ বুলাবেন, যেমন
                  যে Customer এখনো কিছু বুক করেননি, বা যে ট্যুরের Guide নেই। এগুলো
                  এখন শুধু চিনে রাখুন, পরের মডিউলগুলোতে প্রতিটা একটা করে শিক্ষা হয়ে
                  ফিরবে।
                </ListItem>
                <ListItem>
                  প্রতিটা লেসনের Assignment এ এই Database কে ঘিরেই কাজ, যেমন একটা
                  Spreadsheet এর ফাটল খুঁজে বের করা, বা একটা বুকিং থেকে তার ট্যুর
                  পর্যন্ত হাতে Key ধরে হাঁটা। নিজের একটা খাতায় বা ফাইলে উত্তরগুলো
                  রেখে দেবেন, কারণ Module 11 এ আপনি এই Database এর পুরো Design নিজে
                  বানাবেন, আর Module 22 এ শূন্য থেকে পুরোটা নিজের হাতে তৈরি করবেন।
                  তখন এই প্রথম মডিউলের নোটগুলোই আপনার শুরুর পুঁজি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "before-and-after",
      subHeader: { index: "007", title: "Before and After" },
      title: <SectionTitle>এই মডিউল আপনাকে কোথা থেকে কোথায় নিয়ে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <BeforeAfterSplit
              before={[
                "Excel আর Database এর তফাত বলতে শুধু জানেন একটা বড়, একটা ছোট",
                "Database, DBMS আর SQL তিনটা শব্দ প্রায় একই অর্থে বলেন",
                "SQL আর MySQL কে একই জিনিস ভাবেন",
                "Table, Row আর Column দেখতে চেনেন, কিন্তু Key কেন লাগে জানেন না",
                "PostgreSQL নাকি MongoDB, এই প্রশ্নে যুক্তি দিতে পারেন না",
                "App কীভাবে Database এর কাছে পৌঁছায়, তা একটা কালো বাক্স",
                "বুকিং নেওয়া আর মাসের Report কে একই রকম কাজ ভাবেন",
              ]}
              after={[
                "একটা Spreadsheet দেখে বলে দিতে পারেন কোথায় কোথায় সেটা ভাঙবে",
                "ঘর, রক্ষক আর ভাষা, মানে Database, DBMS আর SQL আলাদা করে বোঝাতে পারেন",
                "SQL ভাষা আর MySQL ও PostgreSQL তার দুই উপভাষা, উদাহরণসহ বলতে পারেন",
                "একটা বুকিং থেকে Key ধরে ধরে তার Customer আর ট্যুর পর্যন্ত হাঁটতে পারেন",
                "কোন কাজে কোন আকারের Database মানায়, কারণসহ বলতে পারেন",
                "App থেকে Database পর্যন্ত একটা Query র যাত্রা ধাপে ধাপে এঁকে দিতে পারেন",
                "OLTP আর OLAP এর তফাত বুঝে বলতে পারেন বড় Report কোথায় চালানো উচিত",
              ]}
              footer="বাঁ দিকের তালিকায় নিজেকে পেলে লজ্জার কিছু নেই, বহু বছর SQL লেখা মানুষও এর কয়েকটা জায়গায় দাঁড়িয়ে থাকেন, কারণ তাঁরা Query শিখেছেন কিন্তু ভিতটা কখনো আলাদা করে দেখেননি। ডান দিকের তালিকাটা মডিউল শেষে নিজেকে যাচাই করার জন্য রেখে দিন। যে লাইনটা তখনও পারছেন না মনে হবে, সেটার লেসনটা আরেকবার পড়ুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলে আপনার লক্ষ্য শব্দ চেনা নয়, অন্যকে বোঝাতে পারা। মান
                যাচাইয়ের একটা সহজ উপায় আছে। মডিউল শেষে এমন কাউকে বসান যিনি এসব
                জানেন না, হতে পারে ছোট ভাইবোন বা অন্য বিভাগের কোনো বন্ধু। একটা সাদা
                কাগজে তাঁকে বোঝান, Island Tours কেন Excel ছেড়ে Database এ গেল,
                Database এর ভেতরে Table গুলো কীভাবে একে অপরকে চেনে, SQL কার ভাষা, আর
                পর্যটক বুক বোতাম চাপার পর বুকিংটা কীভাবে Database পর্যন্ত পৌঁছায়।
              </ContentParagraph>
              <ContentParagraph>
                তিনি যদি মাঝপথে একটা কেন জিজ্ঞেস করেন আর আপনি উত্তর দিতে পারেন,
                তাহলে আপনি সত্যিই শিখেছেন। যেখানে আটকে যাবেন, সেটাই ফাঁক, আর সেই ফাঁক
                কোন লেসনে ভরবে তা উপরের Roadmap দেখে বের করে নিতে পারবেন। প্রতিটা
                লেসনের Assignment এর শেষ কাজটা এই কারণেই নিজের ভাষায় লিখে বোঝানোর।
                এই ট্র্যাকের লক্ষ্যও তাই, আপনি শুধু নিজে শিখবেন না, অন্যকে শেখাতে
                পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "how-to-study",
      subHeader: { index: "008", title: "How to Study" },
      title: <SectionTitle>এই মডিউল কীভাবে পড়লে সবচেয়ে বেশি পাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আগে যা জানা থাকা দরকার।</strong> প্রায় কিছুই না। একটা
                Computer বা ফোনে Browser চালাতে পারলেই হবে। কখনো Excel বা Google
                Sheets খুলে থাকলে লেসন ১ আরও আপন লাগবে, কিন্তু সেটাও শর্ত নয়। কোনো
                Programming জানার দরকার নেই, আর এই মডিউলে কিছু ইনস্টল করারও দরকার
                নেই, কারণ Query বক্সগুলো আপনার Browser এর ভেতরেই চলে। লেসন ৬ এ
                Node.js এর ছোট একটা Code দেখানো হবে, সেটা শুধু পড়ে বোঝার জন্য, চালানো
                হবে Module 02 এর পরে। DevOps ট্র্যাকের Port আর Handshake এর লেসন পড়া
                থাকলে লেসন ৬ আরও গভীরে বসবে, না থাকলেও চলবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কত সময় লাগবে।</strong> পুরো মডিউলের জন্য চার থেকে পাঁচ দিন
                ধরুন। সাতটা লেসনের গায়ে লেখা পড়ার সময় ২০ থেকে ৪০ মিনিটের মধ্যে,
                সব মিলিয়ে প্রায় তিন থেকে চার ঘণ্টা, কিন্তু সেটা শুধু পড়ার। Query বক্স,
                Interactive অংশ, Quiz আর Assignment সহ প্রতিটা লেসনে এক ঘণ্টার মতো ধরলে
                বাস্তবসম্মত হবে। দিনে দুইটা লেসন, আর শেষ দিন পুরোটা ঝালিয়ে নেওয়া,
                এই গতি ভালো কাজ করে। The Relational Model আর What SQL Is সবচেয়ে ভারী,
                এই দুইটার জন্য একটু বাড়তি সময় রাখুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম ভাঙবেন না।</strong> লেসন ১ এর সমস্যাগুলোর উত্তর আসে
                লেসন ২ আর ৪ এ, তাই প্রথমটা না পড়লে পরেরগুলো উত্তর দেবে এমন প্রশ্নের,
                যা আপনি কখনো করেননি। লেসন ৪ এর Table আর Key না জেনে লেসন ৫ এর SQL
                উদাহরণগুলো ঝাপসা লাগবে। আর লেসন ৭ এর শেষের পুরো মডিউলের গল্পটা তখনই
                কাজে লাগে, যখন আগের ছয়টা পড়া আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Query বক্সে হাত লাগান:</strong> প্রতিটা লেসনে কয়েকটা
                  বাক্স আছে যেখানে আসল PostgreSQL চলে। প্রথমবার Run চাপলে কয়েক
                  সেকেন্ড লাগতে পারে, কারণ PostgreSQL তখন আপনার Browser এ চালু হয়।
                  এরপর থেকে উত্তর আসে চোখের পলকে। এখনো Query লেখার নিয়ম জানেন না, তাতে
                  সমস্যা নেই। শুধু Run চাপুন, Table এর নাম বা একটা সংখ্যা বদলে দেখুন
                  কী হয়, আর Error এলে তার লেখাটা পড়ুন। Reset চাপলে সব আগের মতো হয়ে
                  যাবে।
                </ListItem>
                <ListItem>
                  <strong>Interactive অংশগুলো এড়িয়ে যাবেন না:</strong> প্রতিটা
                  লেসনে এমন জায়গা আছে যেখানে আপনি নিজে বোতাম চেপে ধাপে ধাপে এগোতে
                  পারেন, যেমন একটা বুকিংয়ে চাপ দিয়ে দেখা তার Key গুলো কোন কোন লাইনকে
                  দেখায়। চাপার আগে নিজে অনুমান করুন কী হবে, তারপর চাপুন। অনুমান ভুল
                  হলে সেটাই সবচেয়ে ভালো শেখা।
                </ListItem>
                <ListItem>
                  <strong>Quiz এ ভুল উত্তরের ব্যাখ্যাও পড়ুন:</strong> প্রতিটা
                  প্রশ্নের প্রতিটা Option এর নিচে লেখা আছে কেন ঠিক বা কেন ভুল। ভুল
                  Option গুলো ইচ্ছা করে সেই ভুল ধারণা থেকে বানানো, যা মানুষ সত্যিই করে,
                  যেমন SQL আর MySQL কে এক ভাবা।
                </ListItem>
                <ListItem>
                  <strong>MySQL এর ভিডিও দেখলে:</strong> এই মডিউলের ধারণাগুলো
                  MySQL এও হুবহু খাটে, কারণ Database, DBMS, RDBMS, Table আর Primary
                  Key কোনো একটা Program এর নিজস্ব শব্দ নয়। পাশাপাশি কোনো MySQL এর
                  কোর্স দেখলে তার শুরুর অংশ, যেখানে এই শব্দগুলো বোঝানো হয়, এই মডিউলের
                  লেসন ২ আর ৪ এর সাথে মিলিয়ে নিন। ভিডিওতে যে Command
                  দেখবেন, তার অনেকটাই PostgreSQL এ হুবহু চলে, আর কোথায় চলে না তার
                  তালিকা লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>আটকে গেলে:</strong> আগে সেই লেসনের শেষের Recap আর Summary
                  ছকটা পড়ুন, প্রায়ই সেখানেই জট খোলে। তাতেও না হলে নিজেকে সেই প্রশ্নটা
                  করুন, এটা ঘরের কথা, রক্ষকের কথা, নাকি ভাষার কথা। এই মডিউলে প্রায় সব
                  বিভ্রান্তির মূল একটাই, Database, DBMS আর SQL কে গুলিয়ে ফেলা।
                </ListItem>
                <ListItem>
                  <strong>একটা খাতা রাখুন:</strong> প্রতিটা নতুন শব্দ আর তার এক
                  লাইনের মানে লিখে রাখুন, পাশে Island Tours থেকে একটা উদাহরণ। যেমন
                  Foreign Key, পাশে লিখুন bookings এর customer_id, যেটা customers কে
                  দেখায়। মডিউল শেষে এই এক পাতাই হবে আপনার সবচেয়ে কাজের নোট, আর পরের
                  মডিউলগুলোতে বারবার এটাতেই ফিরে আসবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মানচিত্র দেখা শেষ। এবার প্রথম লেসন খুলুন,{" "}
                <strong>Why Spreadsheets and Files Break</strong>। সেখানে শুরু হবে এই
                পাতার সেই অফিস থেকেই, যেখানে একটা Spreadsheet এ সব কিছু ঠিকঠাক
                চলছিল, যতক্ষণ না একই মিনিটে দুইজন মানুষ একই সিট বিক্রি করলেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["লেসন", "এক লাইনে যা নিয়ে ফিরবেন"],
    rows: [
      [
        "Why Spreadsheets and Files Break",
        "অনেক মানুষ, অনেক Data আর নির্ভুল হিসাব একসাথে এলে খাতা ভাঙে, আর সেই ফাটলগুলো থেকেই Database এর চাওয়ার তালিকা",
      ],
      [
        "What a Database and a DBMS Are",
        "Database হলো সাজানো Data, DBMS তার রক্ষক Program, যে Data রাখে, খোঁজে, নিয়ম মানায় আর পাহারা দেয়",
      ],
      [
        "Kinds of Databases",
        "Data এর আকার আর প্রশ্নের ধরন দেখে Database বাছতে হয়, আর টাকা আর সিটের মতো জড়ানো Data এর জন্য Relational এখনো প্রথম পছন্দ",
      ],
      [
        "The Relational Model: Tables, Rows, Columns, Keys",
        "Data থাকে Table এ, প্রতিটা Row চেনা যায় Primary Key দিয়ে, আর Foreign Key এক Table থেকে আরেক Table কে দেখায়",
      ],
      [
        "What SQL Is: Standard, Dialects, Command Families",
        "SQL হলো ভাষা, MySQL আর PostgreSQL তার দুই উপভাষায় কথা বলা Program, আর Command গুলো পাঁচটা দলে ভাগ করা",
      ],
      [
        "How an App Talks to a Database",
        "Browser কথা বলে App এর সাথে, App একটা Connection খুলে Database কে প্রশ্ন পাঠায়, আর Database ধাপে ধাপে উত্তর বানিয়ে ফেরত দেয়",
      ],
      [
        "OLTP vs OLAP",
        "প্রতি মুহূর্তের ছোট কাজ আর মাস শেষের বড় হিসাব দুই আলাদা ধরনের কাজ, তাই বড় হিসাব চালু Database থেকে সরিয়ে রাখতে হয়",
      ],
    ],
  },
};
