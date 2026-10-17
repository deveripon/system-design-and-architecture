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

export const sqlSetupOverviewContent: TopicData = {
  id: "sql-setup-overview",
  introduction: {
    badge: "MODULE 02 · OVERVIEW",
    title: <SectionTitle>নিজের মেশিনে নিজের Database</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 01 এ আপনি জেনেছেন Database কী, DBMS কে, Table আর Key কীভাবে
          তথ্য জুড়ে রাখে, আর SQL কোন ভাষা। সেই মডিউলের প্রতিটা Query চলেছে এই
          সাইটের ভেতরের একটা বক্সে, আপনার Browser এর ভেতরে। বক্সটা চমৎকার
          অনুশীলনের জায়গা, কিন্তু সেটা একটা অনুশীলনের ঘর মাত্র। Page টা বন্ধ
          করলেই সব মুছে যায়, তার কোনো Port নেই, কোনো User নেই, কোনো Password
          নেই, আর কোনো App তার সাথে কথা বলতে পারে না।
        </ContentParagraph>
        <ContentParagraph>
          চাকরিতে, নিজের Project এ আর এই ট্র্যাকের বাকি একুশটা মডিউলে যে
          Database এর সাথে কাজ করবেন, সেটা একটা সত্যিকারের Server, যেটা আপনার
          Computer এ সারাক্ষণ চলে, একটা Port এ অপেক্ষা করে, আর আপনি তার সাথে কথা
          বলেন একটা Client Program দিয়ে। এই মডিউলে সেই Server আপনি নিজের হাতে
          বসাবেন, তার সাথে কথা বলার দুইটা উপায় শিখবেন, Island Tours এর Database
          টা তাতে তুলবেন, আর কিছু ভুল হলে Error পড়ে নিজেই সারাতে শিখবেন।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা লেসন নয়, মডিউলের মানচিত্র। এখানে জানবেন মডিউলটা কেন দরকার,
          সাতটা লেসনে কী কী করবেন, কেন সেটা পরের সব কিছুর ভিত, কাজের জায়গায়
          কোথায় লাগে, আর বাস্তবে আপনি ধাপে ধাপে কী কী চালাবেন। কোনো Command এখানে
          চালাতে হবে না। Command গুলো আসবে লেসনে, প্রতিটা যাচাই করা অবস্থায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রান্নার বই পড়ে রান্না শেখা যায় না, নিজের চুলা জ্বালাতে হয়। প্রথমবার আগুন ধরাতে একটু ঝামেলা হয়, গ্যাসের চাবি কোনটা, দেশলাই কোথায়। কিন্তু একবার নিজের রান্নাঘর গুছিয়ে নিলে বাকি জীবন শুধু রান্নাই করবেন।",
      author: "Setup & Tools",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>প্রথম Command, প্রথম দেয়াল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা সন্ধ্যার কথা ভাবুন। Module 01 শেষ করে আপনি উৎসাহে ভরপুর।
                YouTube এ একটা SQL কোর্স চলছে, শিক্ষক তাঁর Terminal এ একটা
                Command লিখলেন আর তাঁর Database খুলে গেল। আপনি নিজের Terminal
                খুলে হুবহু সেটাই লিখলেন। উত্তর এল একটা লাইন:{" "}
                <code>zsh: command not found: psql</code>। আপনি অবাক, কারণ আপনি তো
                ঠিক তাঁর মতোই লিখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                ইন্টারনেট ঘেঁটে কিছু একটা ইনস্টল করলেন। এবার Command চলল, কিন্তু
                একটা Password চাইল। কোন Password? আপনি তো কখনো কোনো Password ঠিক
                করেননি। তিনবার ভুল দেওয়ার পর লেখা এল{" "}
                <code>password authentication failed for user &quot;postgres&quot;</code>।
                আরেকটা Guide দেখে Docker দিয়ে চালাতে গেলেন, এবার বলছে Port টা আগে
                থেকেই কেউ ব্যবহার করছে। রাত বারোটা বাজল। একটাও SELECT লেখা হলো না,
                আর মনে হতে লাগল Database বুঝি আপনার জন্য নয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার আরেকটা দৃশ্য। আপনি একটা দলে নতুন যোগ দিয়েছেন। প্রথম দিনের
                কাজ, নিজের মেশিনে Project টা চালু করা। README ফাইলে লেখা কয়েকটা
                লাইন: Docker দিয়ে Database চালু করুন, তারপর Sample Data Load করুন,
                তারপর DBeaver দিয়ে Connect করে দেখুন সব ঠিক আছে কিনা। সিনিয়র
                একজন পাশ দিয়ে যেতে যেতে বলে গেলেন, Connect না হলে Error টা পড়ে
                দেখবেন, Role নাকি Database নাকি Port, কোনটা নিয়ে অভিযোগ করছে।
                আপনি মাথা নাড়লেন, কিন্তু Role, Port আর Database কে একটা অন্যটা
                থেকে আলাদা করার উপায় আপনার জানা নেই।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা দৃশ্যের সমস্যা একই। SQL জানা আর SQL চালানোর জায়গা বানানো,
                দুইটা আলাদা দক্ষতা। দ্বিতীয়টা কোনো কোর্স সাধারণত যত্ন করে শেখায় না,
                ধরে নেয় আপনি কোনোভাবে পেরে যাবেন। আর ঠিক এখানেই অনেক নতুন
                শিক্ষার্থী হাল ছেড়ে দেন, SQL কঠিন বলে নয়, প্রথম দেয়ালটা কেউ
                ব্যাখ্যা করেনি বলে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল সেই দেয়ালটা ভেঙে দেওয়ার জন্য। শেষ করার পর আপনার
                Computer এ PostgreSQL চলবে, আপনি জানবেন সেটা কোথায় চলছে আর কীভাবে
                চালু বা বন্ধ করতে হয়, psql আর একটা GUI Tool দুইভাবেই তার সাথে কথা
                বলতে পারবেন, Island Tours এর আটটা Table নিজের Database এ থাকবে, আর
                উপরের প্রতিটা Error দেখে এক নজরে বলতে পারবেন সমস্যাটা কোথায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "অচেনা শব্দগুলো নিয়ে এখনই চিন্তা নেই",
          content: (
            <p>
              psql, Port, Role, Docker, README, DBeaver, এই শব্দগুলো এখানে ইচ্ছা
              করেই ব্যাখ্যা ছাড়া রাখা হয়েছে। প্রতিটার মানে সেই লেসনে আসবে, যেখানে
              আপনি জিনিসটা নিজের হাতে চালাবেন। মডিউল শেষে এই অংশটা আবার পড়লে
              দেখবেন রাত বারোটার সেই সন্ধ্যাটা আপনি দশ মিনিটে সামলে নিতে পারতেন।
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
                Module 01 যদি রান্নাঘর কী সেটা চেনা হয়, তাহলে Module 02 হলো নিজের
                রান্নাঘর গুছিয়ে নেওয়া। একটা রান্নাঘরে পাঁচটা জিনিস লাগে। একটা
                চুলা, যেটা জ্বালিয়ে রাখলে সারাক্ষণ রান্নার জন্য তৈরি। চুলার সামনে
                দাঁড়িয়ে কাজ করার একটা জায়গা। চাইলে বসে বসে সব দেখার মতো একটা
                জানালা। ভাঁড়ারে কিছু বাজার, যাতে প্রথম দিনই রান্না শুরু করা যায়। আর
                চুলার গায়ে লেখা সতর্কবার্তাগুলো পড়তে পারা, যাতে আগুন নিভে গেলে বা
                গ্যাস না এলে বুঝতে পারেন কী হয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলে ঠিক এই পাঁচটাই বসানো হবে। চুলা হলো PostgreSQL Server,
                একটা Program যেটা আপনার Computer এ পেছনে চলতে থাকে আর একটা নির্দিষ্ট
                দরজায়, যাকে বলে Port, অপেক্ষা করে। দাঁড়িয়ে কাজ করার জায়গা হলো psql,
                Terminal এ লিখে Server এর সাথে কথা বলার Program। জানালা হলো একটা GUI
                Client, যেখানে মাউস দিয়ে Table দেখা যায়। বাজার হলো Island Tours এর
                Sample Database। আর সতর্কবার্তা পড়া মানে PostgreSQL এর Error Message
                এর প্রতিটা অংশ বুঝে নেওয়া। সাথে থাকছে MySQL, যাঁরা MySQL এর কোনো
                কোর্স পাশাপাশি দেখছেন তাঁদের জন্য দ্বিতীয় একটা চুলা।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলের সবচেয়ে বড় শিক্ষাটা একটা বাক্যে বলা যায়: PostgreSQL আর
                psql এক জিনিস নয়। একটা হলো Server, যেটা Data রাখে আর পাহারা দেয়।
                অন্যটা হলো Client, যেটা শুধু Server এর কাছে কথা নিয়ে যায়। এই দুইটা
                আলাদা করে দেখতে পারলে Setup এর প্রায় প্রতিটা Error এর মানে নিজে থেকেই
                পরিষ্কার হয়ে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিয়েছে, এই মডিউল কী যোগ করে, পরের মডিউল কী চায়"
              caption="Module 01 দিয়েছে ধারণা: Database, DBMS আর SQL কী, Table আর Key কীভাবে কাজ করে, আর একটা App কীভাবে Database এর দরজায় টোকা দেয়। Module 02 সেই ধারণাগুলোকে আপনার নিজের মেশিনে বাস্তব বানায়: একটা চালু PostgreSQL Server, তার সাথে কথা বলার psql আর GUI, আর তাতে Load করা Island Tours এর Data। Module 03 Reading Data ধরে নেয় এগুলো তৈরি আছে। সেখান থেকে প্রতিটা লেসনে SELECT লিখবেন, আর Lab গুলো চালাবেন নিজের psql এ, ঠিক যেভাবে চাকরিতে কাজ হয়।"
              before={{
                tag: "Module 01",
                title: "Data & Databases",
                lines: ["Database, DBMS আর SQL চেনা", "Table আর Key এর ধারণা", "App কীভাবে কথা বলে"],
              }}
              current={{
                tag: "Module 02",
                title: "Setup & Tools",
                lines: ["নিজের মেশিনে PostgreSQL", "psql আর GUI Client", "Sample Database Load"],
              }}
              after={{
                tag: "Module 03",
                title: "Reading Data",
                lines: ["প্রথম SELECT লেখা", "WHERE দিয়ে Row ছাঁকা", "NULL আর ORDER BY"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এর সাথে যোগসূত্রটাও মনে রাখুন। সেখানে লেসন ২ এ শুনেছিলেন
                একটা Database Server একটা Process হিসেবে চলে আর Port 5432 এ অপেক্ষা
                করে, আর লেসন ৬ এ দেখেছিলেন একটা App কীভাবে Connection String দিয়ে
                সেই দরজায় পৌঁছায়। এই মডিউলে সেই Process টা আপনি নিজে চালু করবেন,
                সেই Port টা নিজের চোখে দেখবেন, আর সেই Connection String এর প্রতিটা
                অংশ একটা GUI এর ঘরে নিজের হাতে বসাবেন। কথাগুলো তখন আর বইয়ের কথা
                থাকবে না।
              </ContentParagraph>
              <ContentParagraph>
                DevOps ট্র্যাকের সাথেও এর মিল আছে। সেখানে Linux আর VPS এর মডিউলে
                একটা ভাড়া করা Server এ Software বসানোর কথা আসবে, আর Docker এর
                মডিউলে Container এর কথা। এখানে Ubuntu তে PostgreSQL বসানোর যে ধাপ
                দেখবেন, একটা VPS এ বসানোর ধাপও প্রায় একই। আর এখানে Docker দিয়ে
                Database চালানোর যে একটা Command শিখবেন, সেটা পরে Docker এর মডিউলে
                পুরো অর্থসহ ফিরে আসবে। দুইটা ট্র্যাক একে অপরকে শক্ত করে।
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
      title: <SectionTitle>সাতটা লেসন, সাতটা কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়, আর প্রতিটা শেষ হয়
              একটা কাজ সেরে, যেটা আপনার মেশিনে চোখে দেখা যায়। নিচে সাতটা লেসন আর
              তাদের প্রশ্ন। যেকোনোটায় চাপ দিলে সরাসরি সেখানে যাবেন, তবে এই মডিউলে
              ক্রম ধরে যাওয়া আরও জরুরি, কারণ প্রতিটা লেসন আগেরটার বসানো জিনিসের উপর
              দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              track="sql"
              moduleId="sql-setup"
              questions={{
                "install-postgresql":
                  "PostgreSQL ইনস্টল করলে আসলে কী কী বসে, আর macOS, Windows, Linux বা Docker এ ঠিক কোন ধাপে সেটা চালু আছে বলে নিশ্চিত হবেন?",
                "install-mysql":
                  "MySQL এর কোর্স ফলো করতে হলে MySQL কীভাবে বসাবেন, আর PostgreSQL এর পাশাপাশি দুইটা কীভাবে একসাথে চলে?",
                "psql-basics":
                  "psql দিয়ে কীভাবে Connect করবেন, তার Prompt আর ব্যাকস্ল্যাশ দেওয়া Command গুলো কী বলে, আর একটা ফাইল কীভাবে চালাবেন?",
                "gui-clients":
                  "মাউস দিয়ে Database দেখার Tool গুলোর কোনটা কখন সুবিধার, আর Connect এর ঘরগুলো কোন তথ্য চায়?",
                "databases-schemas":
                  "একটা Server এর ভেতরে Database, Database এর ভেতরে Schema, আর PostgreSQL একটা Table এর নাম কোথায় খোঁজে?",
                "load-sample-database":
                  "Island Tours এর Database ফাইল কীভাবে নিজের PostgreSQL বা MySQL এ তুলবেন, আর ঠিকঠাক উঠেছে কিনা কীভাবে যাচাই করবেন?",
                "errors-and-help":
                  "একটা Error Message এর প্রতিটা অংশ কী বলে, আর আটকে গেলে অফিসিয়াল Docs থেকে নিজে উত্তর খুঁজবেন কীভাবে?",
              }}
              footer="সাতটা লেসন চার ভাগে মনে রাখা সহজ। প্রথম দুইটা বসানো: PostgreSQL, আর দরকার হলে MySQL। পরের দুইটা কথা বলা: psql আর GUI। তার পরের দুইটা গোছানো আর ভরানো: Server এর ভেতরের সাজানো, তারপর Island Tours এর Data। আর শেষটা আটকে গেলে বের হওয়ার উপায়, যেটা আসলে পুরো ট্র্যাক জুড়ে কাজে লাগবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই সাতটা লেসন একটা গল্প হিসেবে শুনুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, Installing PostgreSQL:</strong> শুরুতেই জানবেন
                  ইনস্টল করলে আসলে কী কী বসে: পেছনে চলা Server Program, Data রাখার
                  একটা Folder, psql আর তার সঙ্গী কয়েকটা ছোট Program, postgres নামের
                  একজন সর্বময় User, আর একটা ব্যবস্থা যা Computer চালু হলে Server টাকে
                  চালু করে। তারপর চারটা পথ, পুরো ধাপে ধাপে: macOS এ Postgres.app বা
                  Homebrew, Windows এ অফিসিয়াল Installer, Ubuntu তে Package, আর যেকোনো
                  মেশিনে Docker। প্রতিটা পথের শেষে একই যাচাই, আর একই পাঁচটা চেনা Error
                  এর মানে আর সমাধান। আপনি শুধু একটা পথ বেছে নেবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, Installing MySQL to Follow Along:</strong> যাঁরা
                  MySQL এর কোনো ভিডিও বা কোর্স দেখছেন, অথবা যাঁদের চাকরিতে MySQL
                  লাগবে, তাঁদের জন্য। MySQL 8.4 বসানো, Root User এর Password ঠিক করা,
                  MySQL এর নিজের Client চালানো, আর দুইটা Server কীভাবে আলাদা দুই
                  Port এ পাশাপাশি শান্তিতে চলে। Island Tours এর Database এর একটা MySQL
                  সংস্করণও আছে, সেটা তোলার পথও এখানে। এই লেসনটা ঐচ্ছিক, তবে MySQL এর
                  কোর্স দেখলে এটাই আপনার সবচেয়ে কাজের লেসন হবে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, psql: The Command-line Client:</strong> Server চালু
                  হলো, এবার তার সাথে কথা বলা। কোন Server, কোন Port, কোন User আর কোন
                  Database, এই চারটা তথ্য দিয়ে Connect করা। psql এর Prompt এর চিহ্নগুলো
                  কী বলে, Semicolon ভুলে গেলে কী হয়, আর ব্যাকস্ল্যাশ দিয়ে শুরু হওয়া
                  ছোট Command গুলো, যেগুলো দিয়ে Database আর Table এর তালিকা দেখা যায়।
                  একটা পুরো SQL ফাইল এক Command এ চালানোর উপায়ও এখানে, যেটা লেসন ৬ এ
                  লাগবে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, GUI Clients:</strong> সবাই Terminal এ স্বচ্ছন্দ নন,
                  আর অনেক কাজে চোখে দেখা সুবিধার। pgAdmin, DBeaver, TablePlus এর মতো
                  Tool গুলো কী দেয় আর কী আড়াল করে, Connect এর ঘরে যে পাঁচটা তথ্য চায়
                  সেগুলো আসলে Module 01 এর সেই Connection String এর পাঁচটা অংশ, আর
                  Production Database এ ভুল করে হাত না দেওয়ার কিছু অভ্যাস।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, Databases, Schemas and search_path:</strong> একটা
                  PostgreSQL Server এর ভেতরে কয়েকটা Database থাকতে পারে, প্রতিটা
                  Database এর ভেতরে কয়েকটা Schema, আর প্রতিটা Schema তে Table। আপনি
                  শুধু bookings লিখলে PostgreSQL কোন Schema তে সেটা খোঁজে, আর কেন একটা
                  দল কয়েকটা Schema রাখে। MySQL এ এই সাজানোটা যে আলাদা, সেটাও এখানে।
                  Data তোলার আগে ঘরটা চিনে নেওয়া, যাতে পরে Table খুঁজে না পাওয়ার
                  বিভ্রান্তিতে না পড়েন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, Loading the Island Tours Database:</strong> এবার
                  ভাঁড়ার ভরানো। ফাইলটা নামানো, island_tours নামের Database বানানো,
                  ফাইলটা চালানো, আর আটটা Table এর Row গোনা মিলিয়ে নিশ্চিত হওয়া যে
                  সব ঠিকঠাক উঠেছে। ফাইলের ভেতরে কী লেখা আছে লাইন ধরে ধরে বোঝা, একই ফাইল
                  আবার চালিয়ে সব শুরুর অবস্থায় ফেরানো, আর Docker বা MySQL এ তোলার
                  পথ। শেষে নিজের Database কে প্রথম পাঁচটা প্রশ্ন করবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, Reading Errors and Finding Help:</strong> একটা
                  PostgreSQL Error এর ভেতরে আসলে অনেক তথ্য থাকে: কতটা গুরুতর, কী
                  হয়েছে, আরও বিস্তারিত, একটা পরামর্শ, কোন লাইনের কোন জায়গায়, আর একটা
                  পাঁচ অক্ষরের Code। নতুনরা সবচেয়ে বেশি যে দশটা Error দেখেন, তাদের
                  কারণ আর সমাধান। তারপর অফিসিয়াল Docs পড়ার কৌশল, ভালোভাবে Search করা,
                  আর কাউকে সাহায্যের জন্য প্রশ্ন করার নিয়ম। মডিউলের শেষ লেসন, তাই
                  এখানে পুরো মডিউলের একটা Recap আর Module 03 এ যাওয়ার পথ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                খেয়াল করুন, এই মডিউলে নতুন কোনো SQL শেখানো হচ্ছে না। SELECT এর
                নিয়ম শুরু হবে Module 03 থেকে। এই মডিউলের SQL বলতে শুধু যাচাইয়ের ছোট
                কয়েকটা লাইন, যেমন Server এর Version দেখা বা Row গোনা, যেগুলো আপনি
                বুঝে না বুঝেও Copy করে চালাতে পারবেন।
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
      title: <SectionTitle>Browser এর বক্সই তো চলছে, তাহলে কেন?</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা খুব স্বাভাবিক। সাইটের Query বক্সে আসল PostgreSQL চলে, তাহলে
                নিজের মেশিনে আলাদা করে বসানোর ঝামেলা কেন? অনলাইনে আরও অনেক SQL খেলার
                জায়গা আছে, তাতেই তো শেখা যায়। আর অনেকে বলেন, Docker এ এক লাইনেই সব হয়ে
                যায়, ভেতরের ব্যাপার জানার দরকার কী। কিংবা GUI থাকতে Terminal এর পুরনো
                psql শিখব কেন। সৎ উত্তরটা এরকম।
              </ContentParagraph>
              <ContentParagraph>
                Query বক্স একটা অনুশীলনের ঘর, আর সেভাবেই এটা পুরো ট্র্যাকে থাকবে। ছোট
                একটা জিনিস চট করে পরখ করতে এর চেয়ে সুবিধার কিছু নেই। কিন্তু বক্সটা
                একটা Server নয়। তার কোনো Port নেই, তাই কোনো App তার সাথে Connect করতে
                পারে না। তার কোনো User বা Password নেই, তাই নিরাপত্তার কোনো কিছুই সেখানে
                শেখা যায় না। Page বন্ধ করলেই সব মুছে যায়, তাই কয়েক দিন ধরে একটা
                Project গড়ে তোলা যায় না। আর পরের মডিউলগুলোর অনেক কাজ, যেমন Backup
                নেওয়া, একটা App থেকে Connect করা, দুইটা আলাদা Session থেকে একই Row
                বদলানোর চেষ্টা, সেগুলো একটা চালু Server ছাড়া সম্ভবই নয়।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউল এড়িয়ে গেলে যে দাম দিতে হয়, তার কয়েকটা খুব চেনা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Module 03 থেকে প্রতিটা লেসনের Lab অংশ ধরে নেয় আপনার psql চালু আছে।
                  Setup না থাকলে প্রতিটা Lab অর্ধেক পড়া থেকে যাবে।
                </ListItem>
                <ListItem>
                  চাকরির প্রথম সপ্তাহে Project চালু করতে গিয়ে আটকে থাকবেন, আর সবার
                  সামনে বারবার একই প্রশ্ন করতে হবে, যেটা কারো জন্যই আনন্দের নয়।
                </ListItem>
                <ListItem>
                  একটা ছোট Setup এর Error এ ঘণ্টার পর ঘণ্টা যাবে, কারণ Error এর কোন
                  অংশটা আসল খবর বলছে তা জানা নেই। অনেকে তখন সব মুছে নতুন করে বসান,
                  আর তাতে প্রায়ই নতুন একটা সমস্যা তৈরি হয়।
                </ListItem>
                <ListItem>
                  Password কে Command এর ভেতরে লিখে দেওয়ার মতো অভ্যাস তৈরি হয়ে যাবে,
                  যেটা পরে Shell এর History, Screenshot আর Git এর মাধ্যমে ফাঁস হয়।
                  ভালো অভ্যাস প্রথম দিন থেকে গড়া সবচেয়ে সহজ।
                </ListItem>
                <ListItem>
                  MySQL এর কোর্স আর PostgreSQL এর অনুশীলন একসাথে চালাতে গিয়ে দুইটা
                  Server এর Command গুলিয়ে যাবে, আর কোনটা কার Error তা বোঝা যাবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর কয়েকটা ভুল ধারণা, যেগুলো এই মডিউল শেষে আর থাকবে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>PostgreSQL মানেই psql।</strong> না। একটা Server, অন্যটা
                  তার সাথে কথা বলার Client। Server বন্ধ থাকলে psql চলবে, কিন্তু কারো
                  সাথে কথা বলতে পারবে না। লেসন ১ আর ৩।
                </ListItem>
                <ListItem>
                  <strong>ইনস্টল মানে একটা Program বসানো।</strong> আসলে বসে একটা
                  Server, কয়েকটা Client Program, Data রাখার একটা Folder আর একটা
                  ব্যবস্থা যেটা Server কে চালু রাখে। লেসন ১।
                </ListItem>
                <ListItem>
                  <strong>MySQL আর PostgreSQL একসাথে রাখা যায় না।</strong> যায়, তারা
                  আলাদা দুই Port এ অপেক্ষা করে আর একে অপরকে চেনেই না। লেসন ২।
                </ListItem>
                <ListItem>
                  <strong>Database একটা ফাইল, Excel এর মতো খুলে দেখা যায়।</strong>{" "}
                  Data ফাইলেই থাকে, কিন্তু সেই ফাইলে হাত দেয় শুধু Server। আপনি
                  সবসময় Server এর কাছে চান, ফাইল খোলেন না। লেসন ১ আর ৫।
                </ListItem>
                <ListItem>
                  <strong>Error মানে আমি কিছু একটা ভেঙে ফেলেছি।</strong> Error আসলে
                  Server এর খুব যত্ন করে লেখা একটা চিঠি, যেটা বলে দেয় ঠিক কী চেয়েছিলেন
                  আর কেন দেওয়া গেল না। লেসন ৭।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটাই ধারণা মনে রাখুন: Server আর Client আলাদা",
          content: (
            <p>
              Server হলো সেই Program যেটা সারাক্ষণ চলে, Data রাখে আর একটা Port এ
              অপেক্ষা করে। psql, pgAdmin, DBeaver বা আপনার App, এরা সবাই Client, তারা
              শুধু সেই Port এ গিয়ে কথা বলে। Setup এর প্রায় প্রতিটা সমস্যা তাই তিনটা
              প্রশ্নের একটায় গিয়ে দাঁড়ায়: Server চলছে তো? Client ঠিক ঠিকানা আর Port
              এ যাচ্ছে তো? আর Server Client কে চিনতে পারছে তো, মানে User আর Password
              ঠিক আছে তো? এই তিনটা প্রশ্ন মনে থাকলে পুরো মডিউলটা সহজ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>Setup এর যে মুহূর্তগুলো সবাই একদিন দেখেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে ছয়টা মুহূর্ত, যেগুলো প্রায় প্রত্যেক নতুন Developer এর জীবনে আসে।
              একটা বেছে নিন, দেখুন এই মডিউল না জানলে ঘটনাটা কেমন যায় আর জানলে কেমন
              যায়, আর নিচে দেখুন কোন লেসনে উত্তরটা আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "command-not-found",
                  label: "psql: command not found",
                  situation:
                    "আপনি Homebrew দিয়ে PostgreSQL ইনস্টল করলেন, সব কিছু সফল বলে লেখা এল। তারপর Terminal এ psql লিখতেই উত্তর এল: command not found। আপনি নিশ্চিত, ইনস্টল তো হয়েছে।",
                  without:
                    "আপনি ভাবেন ইনস্টল ভুল হয়েছে, তাই মুছে আবার বসান, তারপর অন্য একটা পথে আবার। শেষে মেশিনে দুই তিনটা PostgreSQL বসে যায়, আর কোনটা চলছে তা কেউ জানে না।",
                  withIt:
                    "আপনি জানেন Program বসে গেছে, শুধু Terminal সেটা খুঁজে পাচ্ছে না, কারণ Program এর Folder টা Terminal এর খোঁজার তালিকা, মানে PATH এ নেই। ইনস্টলের সময় যে একটা লাইন যোগ করতে বলা হয়েছিল, সেটা যোগ করেন, নতুন Terminal খোলেন, আর কাজ হয়ে যায়।",
                  lessons: ["Installing PostgreSQL", "psql: The Command-line Client"],
                },
                {
                  id: "which-password",
                  label: "কোন Password?",
                  situation:
                    "psql চালাতেই Password চাইল। আপনি কখনো কোনো Password ঠিক করেছেন বলে মনে পড়ে না। কয়েকবার চেষ্টার পর লেখা এল password authentication failed for user postgres।",
                  without:
                    "আপনি নিজের Computer এর Login Password দেন, তারপর আরও কয়েকটা অনুমান। কিছুই কাজ করে না, আর মনে হয় সব আবার শুরু থেকে বসাতে হবে।",
                  withIt:
                    "আপনি জানেন Database এর User আর Computer এর User আলাদা, আর postgres হলো Database এর সর্বময় User। ইনস্টলের কোন ধাপে তার Password ঠিক হয়েছিল, অথবা আপনার পথে Password ছাড়াই নিজের নামে ঢোকা যায় কিনা, সেটা মনে করেন। Error টা যে লাইন খোলার পরে পরিচয়ের ধাপে আটকেছে, তাও বুঝে যান।",
                  lessons: ["Installing PostgreSQL", "Reading Errors and Finding Help"],
                },
                {
                  id: "port-taken",
                  label: "Port আগে থেকেই দখল",
                  situation:
                    "আপনি Docker দিয়ে PostgreSQL 18 চালু করতে চাইলেন। Container উঠল না, বলছে Port 5432 আগে থেকেই কেউ ব্যবহার করছে। অথচ আপনি তো কিছু চালু করেননি, অন্তত আপনার তাই মনে হয়।",
                  without:
                    "আপনি Docker কে দোষ দেন, Computer Restart করেন, তারপরও একই কথা। শেষে একটা Guide দেখে এমন কিছু বন্ধ করে দেন যেটা আরেকটা Project এর দরকার ছিল।",
                  withIt:
                    "আপনি বোঝেন একটা দরজায় একই সময়ে একজনই দাঁড়াতে পারে। হয়তো আগের কোনো ইনস্টলের Server এখনো 5432 এ চলছে। সেটা খুঁজে বের করেন, তারপর হয় সেটাকে বন্ধ করেন, নয়তো নতুনটাকে 5433 এ বসিয়ে দেন, আর মনে রাখেন কোনটা কোন Port এ।",
                  lessons: ["Installing PostgreSQL", "Reading Errors and Finding Help"],
                },
                {
                  id: "team-docker",
                  label: "নতুন দলের README",
                  situation:
                    "নতুন চাকরির প্রথম দিন। README তে লেখা: Docker দিয়ে Database চালু করুন, Seed ফাইল Load করুন, তারপর DBeaver দিয়ে Connect করে Table গুলো দেখুন। Host, Port, User, Password আর Database এর ঘর ফাঁকা পড়ে আছে।",
                  without:
                    "আপনি ঘরগুলোতে আন্দাজে কিছু বসান। একবার Host ভুল, একবার Database এর নাম ভুল। প্রতিবার Error আসে, আর আপনি বুঝতে পারেন না কোন ঘরটা দোষী।",
                  withIt:
                    "আপনি জানেন পাঁচটা ঘর আসলে একটা Connection String এর পাঁচটা অংশ। Docker এর Command থেকে Port আর Password এর উৎস খুঁজে নেন, Database এর নাম Seed ফাইল থেকে, আর একবারেই Connect করে Table গুলো দেখে ফেলেন।",
                  lessons: [
                    "GUI Clients: pgAdmin, DBeaver, TablePlus",
                    "Loading the Island Tours Database",
                  ],
                },
                {
                  id: "mysql-video",
                  label: "MySQL এর ভিডিও, PostgreSQL এর মেশিন",
                  situation:
                    "আপনি একটা MySQL এর কোর্স দেখছেন। শিক্ষক লিখলেন SHOW DATABASES, তারপর USE, তারপর SHOW TABLES। আপনি psql এ হুবহু লিখলেন, আর প্রতিটায় Error।",
                  without:
                    "আপনি ভাবেন আপনার ইনস্টলেই গোলমাল, অথবা ভিডিওটা ভুল। হয় ভিডিও বন্ধ করে দেন, নয়তো অনুশীলন।",
                  withIt:
                    "আপনি জানেন এগুলো MySQL এর Client এর নিজস্ব Command, psql এ একই কাজের নিজের ছোট Command আছে। হয় MySQL টাও পাশে বসিয়ে ভিডিওর সাথে হুবহু চলেন, নয়তো psql এর সমতুল্য Command টা লিখে এগিয়ে যান।",
                  lessons: [
                    "Installing MySQL to Follow Along",
                    "psql: The Command-line Client",
                  ],
                },
                {
                  id: "relation-missing",
                  label: "Data Load করলাম, তবু Table নেই",
                  situation:
                    "আপনি Island Tours এর ফাইল চালালেন, কোনো Error আসেনি। তারপর SELECT চালাতেই লেখা এল relation bookings does not exist। আপনি নিশ্চিত, Table টা তো বানানো হয়েছিল।",
                  without:
                    "আপনি ফাইলটা আবার চালান, আবার, তারপর আবার। প্রতিবার সফল, আর প্রতিবার SELECT এ একই Error। সন্দেহ হয় ফাইলটাই খারাপ।",
                  withIt:
                    "আপনি জানেন Table টা কোনো একটা নির্দিষ্ট Database এর ভেতরে বসেছে। হয়তো ফাইল চালানোর সময় এক Database এ ছিলেন আর এখন আছেন আরেকটায়। কোন Database এ আছেন দেখেন, সেখানে কোন কোন Table আছে দেখেন, আর এক মিনিটে রহস্যের সমাধান।",
                  lessons: [
                    "Databases, Schemas and search_path",
                    "Loading the Island Tours Database",
                    "Reading Errors and Finding Help",
                  ],
                },
              ]}
              footer="ছয়টা মুহূর্তের কোনোটাতেই SQL এর জ্ঞান কাজে আসছে না, কাজে আসছে Setup এর জ্ঞান। আর প্রতিটায় যিনি জানেন তিনি কম চেষ্টা করছেন, বেশি নয়, কারণ তিনি জানেন কোন প্রশ্নটা আগে করতে হয়: Server চলছে তো, ঠিক দরজায় যাচ্ছি তো, আর সে আমাকে চিনছে তো।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের মুহূর্তগুলো ছাড়াও এই মডিউলের জিনিসগুলো রোজকার কাজে এই
                জায়গাগুলোতে দেখা দেবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Terminal এ:</strong> psql, createdb, pg_isready, brew
                  services, systemctl, docker run আর docker exec। প্রতিটা Command এর
                  কাজ এই মডিউলে একবার নিজের হাতে করবেন, তারপর বাকি জীবন মুখস্থ থাকবে।
                </ListItem>
                <ListItem>
                  <strong>ছোট ছোট ফাইলে:</strong> একটা Project এর <code>.env</code>{" "}
                  ফাইলে DATABASE_URL, নিজের মেশিনে psql এর জন্য Password মনে রাখার
                  ফাইল, আর psql কে নিজের পছন্দমতো সাজানোর ফাইল। কোনটাতে কী রাখা
                  নিরাপদ আর কোনটা কখনো Git এ যাবে না, সেটাও।
                </ListItem>
                <ListItem>
                  <strong>GUI এর পর্দায়:</strong> Connect এর জানালার Host, Port,
                  Database, User আর Password এর ঘর, আর বাঁ দিকের গাছের মতো তালিকা,
                  যেখানে Server এর ভেতরে Database, তার ভেতরে Schema আর Table।
                </ListItem>
                <ListItem>
                  <strong>Error Message এ:</strong> command not found, connection
                  refused, role does not exist, password authentication failed,
                  relation does not exist। এই মডিউলের পরে প্রতিটা পড়েই বলতে পারবেন
                  সমস্যা কোন স্তরে: Terminal, Server, পরিচয়, নাকি ঠিকানা।
                </ListItem>
                <ListItem>
                  <strong>চাকরির কাজে:</strong> নতুন Laptop এ কাজের পরিবেশ সাজানো,
                  দলের Onboarding এর README লেখা বা ঠিক করা, একটা Bug ধরতে কারো দেওয়া
                  Data নিজের মেশিনে তুলে দেখা, আর ভুল Database এ ভুল Command চালানো
                  থেকে নিজেকে বাঁচানো।
                </ListItem>
                <ListItem>
                  <strong>Interview তে:</strong> PostgreSQL Server আর psql এর তফাত কী,
                  একটা Database এ Connect করতে কোন কোন তথ্য লাগে, Schema কী, আর
                  Connection Refused দেখলে প্রথমে কী দেখবেন। ছোট প্রশ্ন, কিন্তু উত্তর
                  শুনেই প্রশ্নকর্তা বুঝে যান আপনি নিজের হাতে কখনো Database চালিয়েছেন
                  কিনা।
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
      title: <SectionTitle>Island Tours এর Data, আপনার নিজের মেশিনে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর মতো একটা দলে প্রত্যেক Developer এর মেশিনে একটা করে
                নিজস্ব PostgreSQL চলে, সাধারণত Production এর মতোই একই বড় Version
                এ, যাতে নিজের মেশিনে যা চলে সেটা Server এও চলে। সেই নিজস্ব Database এ
                থাকে বানানো বা গোপন তথ্য সরিয়ে নেওয়া Data, আসল পর্যটকের ফোন নম্বর
                কখনো নয়। কেউ একটা নতুন Feature বানালে আগে নিজের মেশিনে Table বদলে
                দেখেন, psql এ ছোট Query চালিয়ে যাচাই করেন, আর বড় কিছু দেখতে GUI খোলেন।
                আর Production Database এর Password কারো Laptop এ লেখা থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                এই মডিউলে আপনি ঠিক সেই পরিবেশটাই নিজের জন্য বানাবেন। মডিউল জুড়ে
                আপনার হাতে যে কাজগুলো হবে, সেগুলো এরকম:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  চারটা পথের একটা বেছে নিয়ে PostgreSQL 18 বসানো, তারপর{" "}
                  <code>psql --version</code> আর <code>pg_isready</code> চালিয়ে
                  নিশ্চিত হওয়া যে Client আর Server দুইটাই সাড়া দিচ্ছে।
                </ListItem>
                <ListItem>
                  island_tours নামের একটা Database বানানো, Island Tours এর ফাইলটা
                  তাতে চালানো, আর আটটা Table এর Row গুনে মিলিয়ে দেখা: ৭টা
                  Destination, ৫ জন Guide, ৯টা ট্যুর, ১৫ জন Customer, ১৬টা তারিখ, ২৪টা
                  Booking, ১৯টা Payment আর ১০টা Review।
                </ListItem>
                <ListItem>
                  psql এ সেই Database এ ঢুকে Table এর তালিকা দেখা, একটা Table এর
                  ভেতরের গঠন দেখা, আর প্রথম কয়েকটা Query চালানো।
                </ListItem>
                <ListItem>
                  একটা GUI Tool এ সেই একই পাঁচটা তথ্য বসিয়ে একই Database খোলা, আর
                  দুইদিক থেকে একই Data দেখে নিশ্চিত হওয়া যে দুইটা আসলে একই Server এর
                  সাথে কথা বলছে।
                </ListItem>
                <ListItem>
                  অনুশীলনের জন্য একটা নিজের Schema বানানো, যাতে Island Tours এর আসল
                  Table গুলোতে হাত না দিয়েই যত খুশি পরীক্ষা চালাতে পারেন।
                </ListItem>
                <ListItem>
                  ইচ্ছা করে কয়েকটা Error ঘটানো, যেমন ভুল Table এর নাম বা একই Email
                  দুইবার, তারপর Error এর প্রতিটা অংশ পড়ে নিজেই কারণটা বের করা।
                </ListItem>
                <ListItem>
                  MySQL এর কোর্স দেখলে MySQL 8.4 পাশে বসিয়ে Island Tours এর MySQL
                  সংস্করণটাও তুলে নেওয়া, যাতে ভিডিওর প্রতিটা Command একই Data তে
                  চালাতে পারেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পুরো মডিউলে কয়েকটা জিনিস সবসময় একই থাকবে, যাতে কোনো লেসনে গিয়ে
                নতুন করে মিলাতে না হয়। Database এর নাম island_tours। PostgreSQL এর
                Port 5432, আর আগে থেকে কিছু সেখানে বসে থাকলে বিকল্প 5433। MySQL এর
                Port 3306। Docker এর Container এর নাম island-pg আর island-mysql। আর
                Password কখনো কোনো Command বা ফাইলে সরাসরি লেখা হবে না। আপনি একবার
                নিজের Terminal এ POSTGRES_PASSWORD নামে একটা Environment Variable এ
                Password রাখবেন, আর Command গুলো সেখান থেকে পড়বে। কারণটা সহজ:
                Terminal আপনার লেখা প্রতিটা Command মনে রাখে, Screenshot এ সব দেখা
                যায়, আর ভুল করে ফাইল Git এ উঠে গেলে Password সবার হাতে চলে যায়। কেন
                আর কীভাবে, সেটা লেসন ১ এ ধাপে ধাপে।
              </ContentParagraph>
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
                "PostgreSQL আর psql কে একই জিনিস ভাবেন",
                "ইনস্টল মানে একটা Program বসানো, এর বেশি কিছু জানেন না",
                "command not found দেখলে আবার ইনস্টল করেন",
                "Connect করতে কোন কোন তথ্য লাগে, আন্দাজে বসান",
                "Table খুঁজে না পেলে ভাবেন Data হারিয়ে গেছে",
                "MySQL এর ভিডিওর Command psql এ চালিয়ে বিভ্রান্ত হন",
                "Error এলে শুধু প্রথম লাইনটা পড়ে ঘাবড়ে যান",
              ]}
              after={[
                "Server আর Client এর তফাত এক বাক্যে বোঝাতে পারেন",
                "নিজের মেশিনে PostgreSQL কোথায় চলছে, কীভাবে চালু বা বন্ধ করবেন জানেন",
                "PATH, Port, User, Password, প্রতিটা Setup Error কোন স্তরের তা চেনেন",
                "Host, Port, Database, User আর Password দিয়ে যেকোনো Tool এ Connect করতে পারেন",
                "Server, Database, Schema আর Table এর সাজানোটা এঁকে দেখাতে পারেন",
                "Island Tours এর Data নিজে তুলে, Row গুনে যাচাই করতে পারেন",
                "একটা Error এর প্রতিটা অংশ পড়ে Docs থেকে নিজে উত্তর খুঁজে নিতে পারেন",
              ]}
              footer="বাঁ দিকের প্রায় প্রতিটা লাইন অভিজ্ঞ মানুষেরও একসময় ছিল। তফাত শুধু এই যে কেউ সেগুলো ঠেকে ঠেকে শিখেছেন, আর আপনি শিখবেন গুছিয়ে, এক সপ্তাহের মধ্যে। মডিউল শেষে ডান দিকের তালিকাটা দিয়ে নিজেকে যাচাই করুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলের মানদণ্ড একটু আলাদা। এখানে শুধু নিজে পারা যথেষ্ট নয়,
                অন্যকে পারিয়ে দিতে পারা লক্ষ্য। মডিউল শেষে একজন বন্ধুর Computer এর
                পাশে বসুন, যাঁর মেশিনে কোনো Database নেই। তাঁকে দিয়ে, তাঁর হাতেই,
                PostgreSQL বসান, Island Tours এর Data তুলুন, আর একটা GUI তে Connect
                করান। মাঝপথে কোনো Error এলে আপনি সেটা পড়ে তাঁকে বুঝিয়ে বলবেন সমস্যাটা
                কোন স্তরে আর কেন।
              </ContentParagraph>
              <ContentParagraph>
                এটা পারলে আপনি সত্যিই শিখেছেন, কারণ অন্যের মেশিন সবসময় আপনার মেশিনের
                চেয়ে আলাদা আচরণ করে, আর সেখানে মুখস্থ ধাপ কাজ করে না, কাজ করে বোঝা।
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
                <strong>আগে যা লাগবে।</strong> Module 01 পড়া থাকলে ভালো, বিশেষ করে
                লেসন ২ আর ৬, যেখানে Server, Port আর Connection String এর কথা আছে।
                তার সাথে একটা Laptop বা Desktop, যেখানে আপনি Software ইনস্টল করতে
                পারেন। অফিসের মেশিনে অনেক সময় সেই অনুমতি থাকে না, তাই নিজের মেশিন
                হলে সবচেয়ে ভালো। ফোন দিয়ে এই মডিউলের কাজ হবে না। Terminal আগে কখনো
                না খুলে থাকলেও চলবে, প্রতিটা Command ধাপে ধাপে দেখানো আছে। Docker
                লাগবে শুধু যদি আপনি Docker এর পথটা বেছে নেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কত সময় লাগবে।</strong> পুরো মডিউলের জন্য দুই থেকে তিন দিন
                ধরুন। সাতটা লেসনের গায়ে লেখা পড়ার সময় যোগ করলে মোট তিন থেকে চার
                ঘণ্টার মতো, কিন্তু Setup এর মডিউলে আসল সময় যায় হাতে করায়। Download
                হতে সময় লাগে, প্রথমবার একটা দুইটা Error আসেই, আর সেগুলো সারাতেও সময়
                লাগে। তাই প্রথম দিনটা শুধু লেসন ১ এর জন্য রাখুন, তাড়াহুড়া করবেন না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম ধরে যান, তবে একটা ব্যতিক্রম আছে।</strong> লেসন ১ এর
                কাজ হয়ে গেলে তবেই লেসন ৩ এ যাবেন, কারণ Server ছাড়া psql কারো সাথে
                কথা বলতে পারবে না। লেসন ৫ এর সাজানো না বুঝে লেসন ৬ এর Data তুললে
                Table খুঁজে না পাওয়ার ধাঁধায় পড়তে পারেন। ব্যতিক্রম হলো লেসন ২। আপনি
                MySQL এর কোনো কোর্স না দেখলে আর চাকরিতে MySQL না লাগলে এটা পরে
                পড়লেও চলবে। আর লেসন ৭ পড়ার আগেই কোনো Error এ আটকে গেলে সরাসরি লেসন
                ৭ খুলে নিন, সেটা যেকোনো সময় কাজে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটাই পথ বেছে নিন:</strong> লেসন ১ এ চারটা পথ আছে, কিন্তু
                  আপনার দরকার একটা। দুই তিনটা পথ একসাথে চেষ্টা করলে মেশিনে কয়েকটা
                  PostgreSQL বসে যায়, আর তখন কোনটা কোন Port এ চলছে সেটাই হয়ে ওঠে নতুন
                  সমস্যা। একটা পথ শেষ পর্যন্ত যান।
                </ListItem>
                <ListItem>
                  <strong>একটা Setup খাতা রাখুন:</strong> কোন পথে কোন Version বসালেন,
                  Port কত, User কে, Data কোন Folder এ, আর কীভাবে চালু ও বন্ধ করেন, এক
                  পাতায় লিখে রাখুন। Password টা সেই খাতায় নয়, সেটা আপনার Password
                  Manager এ। তিন মাস পরে এই পাতাটাই আপনাকে বাঁচাবে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা ধাপের পরে যাচাই করুন:</strong> প্রতিটা লেসনে প্রতিটা
                  বড় ধাপের পরে একটা যাচাইয়ের Command আছে। সেটা চালিয়ে ফল মিলিয়ে নিন,
                  তারপর পরের ধাপে যান। ভুল কোথায় হয়েছে তা খুঁজে পাওয়া সবচেয়ে সহজ যখন
                  সেটা ঠিক আগের ধাপেই হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Query বক্স বাদ যাচ্ছে না:</strong> এই মডিউলের লেসনেও কিছু
                  Query বক্স আছে, আর পুরো ট্র্যাকেই থাকবে। নিজের psql চালু হওয়ার
                  আগে বা বাইরে থাকলে বক্সে চট করে কিছু পরখ করে নেওয়া যায়। দুইটা
                  জায়গাতেই Island Tours এর একই Data, তাই উত্তরও একই।
                </ListItem>
                <ListItem>
                  <strong>MySQL এর ভিডিও দেখলে:</strong> ভিডিওর শুরুর দিকে MySQL
                  ইনস্টল আর তার Client চালানোর যে অংশ, সেটা এই মডিউলের লেসন ২ এর সাথে
                  মিলিয়ে নিন। ভিডিওর পরের দিকের SQL এর বেশিরভাগ PostgreSQL এও চলে, আর
                  কোথায় চলে না তার তালিকা Module 01 এর লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>আটকে গেলে:</strong> প্রথমে Error এর পুরো লেখাটা পড়ুন,
                  শুধু প্রথম লাইন নয়। তারপর নিজেকে তিনটা প্রশ্ন করুন: Server চলছে তো,
                  ঠিক দরজায় যাচ্ছি তো, Server আমাকে চিনছে তো। তাতেও না হলে লেসন ৭ খুলুন,
                  আর Search করার সময় Error এর হুবহু লেখাটা Quote এর ভেতরে দিন। আতঙ্কে
                  সব মুছে নতুন করে বসাবেন না, সেটা প্রায় কখনোই সমাধান নয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মানচিত্র দেখা শেষ। এবার প্রথম লেসন খুলুন,{" "}
                <strong>Installing PostgreSQL</strong>। সেখানে শুরুতেই দেখবেন ইনস্টল
                করলে আপনার মেশিনে ঠিক কী কী বসে, তারপর নিজের মেশিনের জন্য একটা পথ
                বেছে নিয়ে শেষ পর্যন্ত যাবেন, যতক্ষণ না আপনার নিজের PostgreSQL প্রথমবার
                সাড়া দেয়।
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
        "Installing PostgreSQL",
        "ইনস্টল মানে একটা Server, কয়েকটা Client Program আর Data এর Folder বসানো, আর চারটা পথের যেকোনো একটায় শেষে psql আর pg_isready দিয়ে যাচাই",
      ],
      [
        "Installing MySQL to Follow Along",
        "MySQL আরেকটা আলাদা Server, যেটা নিজের Port এ PostgreSQL এর পাশাপাশি চলে, আর Island Tours এর MySQL সংস্করণ দিয়ে ভিডিওর সাথে হুবহু চলা যায়",
      ],
      [
        "psql: The Command-line Client",
        "psql কে কোন Server, কোন Port, কোন User আর কোন Database বলে দিলে সে কথা নিয়ে যায়, আর ব্যাকস্ল্যাশের Command গুলো Server এর ভেতরটা দেখায়",
      ],
      [
        "GUI Clients: pgAdmin, DBeaver, TablePlus",
        "GUI এর Connect এর পাঁচটা ঘর একটা Connection String এরই পাঁচ অংশ, আর Production এ হাত দেওয়ার আগে নিরাপত্তার অভ্যাস জরুরি",
      ],
      [
        "Databases, Schemas and search_path",
        "Server এর ভেতরে Database, তার ভেতরে Schema, তার ভেতরে Table, আর search_path ঠিক করে একটা নাম কোথায় খোঁজা হবে",
      ],
      [
        "Loading the Island Tours Database",
        "একটা Database বানিয়ে ফাইলটা চালালেই আটটা Table তৈরি, আর Row গুনে মিলিয়ে নিলে নিশ্চিত হওয়া যায় সব ঠিকঠাক উঠেছে",
      ],
      [
        "Reading Errors and Finding Help",
        "প্রতিটা Error একটা যত্ন করে লেখা চিঠি, তার প্রতিটা অংশ আর Code পড়ে, আর Docs থেকে নিজে উত্তর খুঁজে বেশিরভাগ সমস্যা নিজেই সারানো যায়",
      ],
    ],
  },
};
