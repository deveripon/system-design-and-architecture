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
  ConnectDefaultsLab,
  ErrorStageLab,
  InstallPathLab,
} from "../../../components/course/topics/sql-setup/install-pg-animations";
import {
  ConnectDefaultsDiagram,
  InstallAnatomyDiagram,
  PortConflictSplit,
  VersionSupportDiagram,
} from "../../../components/course/topics/sql-setup/install-pg-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 border border-border bg-muted/40";

export const installPostgresqlContent: TopicData = {
  id: "install-postgresql",
  introduction: {
    badge: "MODULE 02 · LESSON 01",
    title: <SectionTitle>নিজের কম্পিউটারে একটা সত্যিকারের PostgreSQL</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 01 এ আপনি যতবার Run চেপেছেন, প্রতিবার আসল PostgreSQL চলেছে, কিন্তু
          চলেছে আপনার Browser এর ভেতরে। Page বন্ধ করলেই সব শেষ, আর অন্য কোনো Program
          সেই Database এর সাথে কথা বলতে পারে না। Browser এর সেই বক্সটা একটা অনুশীলনের
          ঘর। চাকরির প্রথম দিন টিম লিড যখন বলবেন, নিজের মেশিনে Local Database টা চালু
          করে নিন, তখন দরকার হবে এমন একটা PostgreSQL, যা আপনার কম্পিউটারে সবসময়
          চালু থাকে, Restart দিলেও Data হারায় না, আর আপনার App, psql, GUI, সবাই যার
          সাথে কথা বলতে পারে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি ঠিক সেটা বানাবেন। প্রথমে দেখবেন ইনস্টল করলে আসলে কী কী জিনিস
          আপনার কম্পিউটারে বসে, কোন Version নেবেন আর কেন। তারপর চারটা পথের যেকোনো
          একটা ধরে শেষ পর্যন্ত যাবেন: Mac এ Postgres.app বা Homebrew, Windows এ EDB
          এর Installer, Ubuntu তে apt, অথবা যেকোনো OS এ Docker। শেষে চারটা Command
          দিয়ে যাচাই করবেন সব ঠিক আছে কিনা, আর শিখবেন প্রথম দিনের সাতটা বিখ্যাত
          Error পড়ে এক নজরে বুঝতে, কোথায় আটকেছেন। এই লেসনের প্রতিটা Error Message
          আর প্রতিটা Output একটা আসল PostgreSQL 18 Server থেকে তোলা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "রান্না শেখার প্রথম দিন কেউ রেসিপি দিয়ে শুরু করে না। আগে নিজের চুলা জ্বালাতে শেখে, গ্যাস কোথা থেকে আসে, আগুন কীভাবে বাড়ে কমে, আর নিভে গেলে কী করতে হয়। তারপর বাকি জীবন সেই চুলায় রান্না।",
      author: "PostgreSQL",
      role: "Lesson 01",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>অনুশীলনের ঘর থেকে নিজের রান্নাঘরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                নাদিয়া Island Tours এর Backend টিমে নতুন যোগ দিয়েছেন। প্রথম দিন সকালে
                টিম লিড একটা ছোট তালিকা দিলেন: Code নামানো, Local Database চালু করা,
                Sample Data Load করা, App চালানো। প্রথম আর শেষ কাজ নাদিয়া পারেন। মাঝের
                দুটো কাজে এসে থমকে গেলেন। Local Database মানে কী? কোথা থেকে নামাবেন?
                কোন Version? আর ইনস্টল হয়ে গেলে কীভাবে বুঝবেন যে সেটা ঠিকমতো চলছে?
              </ContentParagraph>
              <ContentParagraph>
                Local Database মানে আপনার নিজের কম্পিউটারে চলা একটা পুরো Database
                Server। Production এর Server টা দূরের একটা মেশিনে, সেখানে আসল
                Customer দের আসল বুকিং। সেখানে কেউ পরীক্ষা চালায় না। প্রত্যেক Developer
                এর নিজের মেশিনে একটা আলাদা PostgreSQL থাকে, যেখানে ইচ্ছামতো Table
                বানানো যায়, ভাঙা যায়, মোছা যায়, কারো কোনো ক্ষতি না করে। এটাই
                Developer এর রান্নাঘর।
              </ContentParagraph>
              <ContentParagraph>
                Browser এর Query বক্সটাও আসল PostgreSQL, কিন্তু তার তিনটা সীমা আছে।
                Page বন্ধ করলেই সব হারায়। শুধু ওই Page টাই তার সাথে কথা বলতে পারে, আপনার
                নিজের লেখা App বা অন্য কোনো Tool না। আর Server চালানোর বাস্তব কাজগুলো,
                মানে চালু রাখা, বন্ধ করা, Port, Password, Backup, এগুলোর কোনোটাই সেখানে
                নেই। এই ট্র্যাকের বাকি অংশ, আর আপনার চাকরি, এই তিনটার উপরেই দাঁড়িয়ে।
              </ContentParagraph>
              <ContentParagraph>
                ভালো খবর হলো, PostgreSQL ইনস্টল করা কঠিন না। বেশিরভাগ মানুষ আটকে যান
                ইনস্টলের পরের পাঁচ মিনিটে: psql খুঁজে পাওয়া যায় না, Password কোনটা
                মনে নেই, অথবা এমন একটা Error আসে যার একটা শব্দও বোঝা যায় না। এই লেসন
                সেই পাঁচ মিনিটটাকে সবচেয়ে বেশি সময় দেবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই লেসন থেকে যা নিয়ে বের হবেন",
          content: (
            <ContentList>
              <ListItem>আপনার কম্পিউটারে চালু থাকা একটা PostgreSQL 18 Server</ListItem>
              <ListItem>Terminal থেকে কাজ করা psql, যেটা সেই Server এর সাথে কথা বলে</ListItem>
              <ListItem>Server চালু, বন্ধ আর পুরোপুরি মুছে ফেলার Command</ListItem>
              <ListItem>প্রথম দিনের Error গুলো দেখে এক নজরে কারণ ধরার অভ্যাস</ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-gets-installed",
      subHeader: { index: "002", title: "What Gets Installed" },
      title: <SectionTitle>ইনস্টল মানে একসাথে পাঁচটা জিনিস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা চুলা কিনলে আসলে কয়েকটা জিনিস আসে: চুলাটা নিজে, গ্যাসের লাইন,
                নব, আর লাইটার। একটা ছাড়া বাকিগুলো কাজের না। PostgreSQL ইনস্টল করলেও
                তেমনি একসাথে পাঁচটা জিনিস আপনার কম্পিউটারে বসে। এগুলো আলাদা করে চিনলে
                পরে প্রতিটা Error এর মানে বোঝা অনেক সহজ হয়ে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server Program, যার নাম postgres:</strong> আসল কাজের লোক।
                  Lesson 02 তে যাকে DBMS বলেছিলেন, এটাই সেই Program। একবার চালু হলে
                  সে চলতেই থাকে, আর প্রশ্নের জন্য অপেক্ষা করে। চলতে থাকা একটা Program কে
                  বলে Process।
                </ListItem>
                <ListItem>
                  <strong>Data Directory:</strong> Disk এর একটা ফোল্ডার, যেখানে সব
                  Database এর সব Data থাকে। PostgreSQL এর ভাষায় একটা Data Directory আর
                  তার ভেতরের সব Database মিলে একটা <em>Cluster</em>। এই শব্দটা পরে বারবার
                  আসবে, মনে রাখুন: Cluster মানে একটা Server এর পুরো সংসার। ইনস্টলের সময়
                  initdb নামের একটা Program এই ফোল্ডারটা প্রথমবার সাজিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>শুরুর তিনটা Database আর একজন Superuser:</strong> initdb
                  ফোল্ডারটা সাজানোর সময় তিনটা Database বানায়: postgres, template0 আর
                  template1। postgres হলো সবার ব্যবহারের জন্য একটা খালি Database, বাকি
                  দুটো নতুন Database বানানোর ছাঁচ। আর বানায় একজন Superuser, মানে এমন
                  একটা Role যার কাছে সব চাবি। Role মানে Database এর ভেতরের একজন
                  ব্যবহারকারী।
                </ListItem>
                <ListItem>
                  <strong>Client Program:</strong> psql, createdb, pg_dump, pg_isready
                  আর আরও কয়েকটা ছোট Program, যারা Server এর সাথে কথা বলে। এরা নিজেরা
                  কোনো Data রাখে না।
                </ListItem>
                <ListItem>
                  <strong>Service:</strong> কম্পিউটার চালু হলেই Server টাকে চালু করে
                  দেওয়ার ব্যবস্থা। Mac এ এর নাম brew services বা Postgres.app নিজে, Linux এ
                  systemd, Windows এ Services অ্যাপ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর এই সবকিছু একটা দরজা দিয়ে বাইরের সাথে যুক্ত, Port 5432। DevOps
                ট্র্যাকে আপনি{" "}
                <Link href="/devops/topic/port-and-socket" className={LINK}>
                  Port আর Socket
                </Link>{" "}
                নিয়ে পড়েছেন: একটা কম্পিউটারে অনেক Program চলে, আর Port নম্বর ঠিক করে
                কোন বার্তা কোন Program এর কাছে যাবে। PostgreSQL এর বাঁধা নম্বর 5432।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InstallAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Client আর Server আলাদা কেন",
          content: (
            <ContentParagraph>
              psql আর Server দুটো আলাদা Program, আর এটা ইচ্ছা করেই। Server একটা,
              কিন্তু তার সাথে কথা বলতে পারে অনেকে একসাথে: আপনার psql, আপনার App, একটা
              GUI, অন্য কোনো Developer এর Laptop। তাই কখনো কখনো এমন হয় যে psql আছে
              কিন্তু Server নেই, বা Server চলছে কিন্তু psql খুঁজে পাওয়া যাচ্ছে না।
              দুটো আলাদা সমস্যা, দুটোর সমাধানও আলাদা। এই লেসনের Error অংশে এই পার্থক্যটাই
              আপনাকে বাঁচাবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "versions",
      subHeader: { index: "003", title: "Versions" },
      title: <SectionTitle>18.6 মানে কী, আর কোনটা নেবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                PostgreSQL এর Version নম্বরের দুটো অংশ। 18.6 তে 18 হলো Major Version,
                আর 6 হলো Minor Version। দুটোর মানে একদম আলাদা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Major Version</strong> বছরে একবার আসে, সাধারণত সেপ্টেম্বরে বা
                  অক্টোবরে। নতুন Feature আসে, আর Data Directory এর ভেতরের সাজানোর ধরন
                  বদলাতে পারে। তাই 17 থেকে 18 এ যাওয়া একটা আলাদা কাজ, যাকে Upgrade
                  বলে, আর তার নিজস্ব Tool আছে। সেটা Module 18 এ।
                </ListItem>
                <ListItem>
                  <strong>Minor Version</strong> আসে অন্তত প্রতি তিন মাসে একবার। এতে
                  কোনো নতুন Feature থাকে না, থাকে শুধু Bug আর নিরাপত্তার সমস্যার সমাধান।
                  Data এর সাজানো একই থাকে, তাই 18.5 থেকে 18.6 এ যাওয়া মানে শুধু Program
                  বদলে Server আবার চালু করা। PostgreSQL এর নিজের পরামর্শ: সবসময় আপনার
                  Major Version এর সর্বশেষ Minor চালান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রতিটা Major Version প্রথম Release থেকে পাঁচ বছর পাহারা পায়। এই সময়ে
                নিয়মিত Minor আসে। পাঁচ বছর পর শেষ একটা Minor বের হয়, তারপর সেই Version
                এর আর কোনো সমাধান আসে না। এই অবস্থাকে বলে End of Life। এই লেসন লেখার
                দিন, অক্টোবর 2026 এ, সর্বশেষ Major হলো 18, আর তার সর্বশেষ Minor 18.6।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <VersionSupportDiagram />,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Version", "প্রথম Release", "শেষ Release (End of Life)", "নতুন কাজে নেবেন?"],
          rows: [
            ["18", "25 Sep 2025", "14 Nov 2030", "হ্যাঁ, এই ট্র্যাক এটাই ব্যবহার করে"],
            ["17", "26 Sep 2024", "8 Nov 2029", "চলবে, তবে নতুন শুরু হলে 18"],
            ["16", "14 Sep 2023", "9 Nov 2028", "পুরনো Project এ থাকলে ঠিক আছে"],
            ["15", "13 Oct 2022", "11 Nov 2027", "Upgrade এর পরিকল্পনা শুরু করুন"],
            ["14", "30 Sep 2021", "12 Nov 2026", "না, এক মাসের মধ্যে End of Life"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "PostgreSQL 19 আসছে",
          content: (
            <ContentParagraph>
              এই লেসন লেখার দুই দিন আগে, ১৫ অক্টোবর 2026 এ, PostgreSQL 19 এর Release
              Candidate (RC 1) বের হয়েছে। Release Candidate মানে চূড়ান্ত Release এর ঠিক
              আগের পরীক্ষার Version, শেখার জন্য বা Production এর জন্য না। 19 চূড়ান্ত হয়ে
              গেলে সেটাই হবে সর্বশেষ Major। তখনও এই লেসনের ধাপগুলো একই থাকবে, শুধু
              যেখানে 18 লেখা সেখানে 19 লিখবেন, যেমন Homebrew বা Docker এর নামে। এই
              ট্র্যাকে আপনি যা শিখবেন তার প্রায় সবটাই দুই Version এ একইভাবে চলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নতুন শিখছেন, তাই সিদ্ধান্তটা সহজ: PostgreSQL 18। আর একটা নিয়ম মনে রাখুন,
              যেটা কাজের জায়গায় খুব কাজে লাগে: আপনার Local Database এর Major Version
              যেন Production এর সাথে মেলে। Production 17 চালালে আপনার মেশিনেও 17, যাতে
              আপনার মেশিনে যা চলে, Production এও ঠিক তাই চলে। নিচের বক্সে দেখুন, একটা
              চালু Server কে জিজ্ঞেস করলেই সে নিজের Version বলে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Server কে তার Version জিজ্ঞেস করুন"
              query={`SHOW server_version;
SHOW server_version_num;`}
              caption="এই বক্সের PostgreSQL বলবে 18.3, কারণ এটা Browser এর জন্য বানানো একটা বিশেষ Build। আপনার নিজের মেশিনে একই দুটো লাইন চালালে দেখাবে আপনার ইনস্টল করা Version, যেমন 18.6। দ্বিতীয় লাইনের সংখ্যাটা (180003) Program এর জন্য লেখা: প্রথম দুই অঙ্ক Major, শেষের অঙ্কগুলো Minor।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "pick-your-path",
      subHeader: { index: "004", title: "Pick Your Path" },
      title: <SectionTitle>চার রাস্তা, একই গন্তব্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                PostgreSQL ইনস্টল করার অনেক উপায় আছে। আপনার দরকার একটাই। নিচের
                তালিকা থেকে নিজের কম্পিউটার আর পছন্দ মিলিয়ে একটা বেছে নিন, তারপর শুধু
                সেই অংশটা মন দিয়ে পড়ুন। বাকিগুলো একবার চোখ বুলিয়ে নিলেই চলবে, কারণ
                অন্য কারো মেশিনে সাহায্য করতে গেলে কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["পথ", "কার জন্য", "Superuser", "Server কে চালায়"],
          rows: [
            ["Mac: Postgres.app", "সবচেয়ে সহজ Mac Setup চাইলে", "আপনার Mac এর লগইন নাম", "অ্যাপটা নিজে"],
            ["Mac: Homebrew", "Terminal আর Homebrew এ অভ্যস্ত হলে", "আপনার Mac এর লগইন নাম", "brew services"],
            ["Windows: EDB Installer", "Windows এ নিজে ইনস্টল করতে চাইলে", "postgres, Password সহ", "Windows Services"],
            ["Ubuntu বা Debian: apt", "Linux Laptop আর বেশিরভাগ VPS", "postgres, Peer Login", "systemd (systemctl)"],
            ["Docker", "যেকোনো OS, টিম একই Setup চাইলে", "postgres, Password সহ", "Docker"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InstallPathLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা মেশিনে একটাই পথ",
          content: (
            <ContentParagraph>
              সবচেয়ে বেশি গোলমাল হয় যখন একই কম্পিউটারে দুটো পথে দুটো PostgreSQL বসানো
              থাকে, যেমন একটা Postgres.app আর একটা Homebrew। দুজনেই Port 5432 চায়,
              আর psql কোনটার সাথে কথা বলছে সেটা নিয়ে আপনি নিজেই বিভ্রান্ত হবেন। আগে
              কোনো পথে ইনস্টল করা থাকলে সেটাই চালিয়ে যান, অথবা পরিষ্কার করে মুছে তারপর
              নতুন পথ ধরুন। দুটো Version সত্যিই পাশাপাশি দরকার হলে দ্বিতীয়টা Docker এ,
              অন্য Port এ। সেটা এই লেসনের Port অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "postgres-app",
      subHeader: { index: "005", title: "Mac: Postgres.app" },
      title: <SectionTitle>Mac এ সবচেয়ে সহজ পথ: একটা অ্যাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Postgres.app হলো Mac এর জন্য বানানো একটা সাধারণ অ্যাপ। কোনো Installer
                নেই। অ্যাপটা খুললে Server চালু হয়, বন্ধ করলে বন্ধ। অ্যাপটা থাকে Mac এর Menu
                Bar এ, সেখান থেকেই দেখা যায় Server চলছে কিনা। PostgreSQL এর অফিসিয়াল Mac
                Download পাতায় এটা একটা স্বীকৃত পথ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক:</strong> postgresapp.com থেকে অ্যাপটা নামিয়ে Applications
                  ফোল্ডারে সরান, তারপর Double Click করে খুলুন।
                </ListItem>
                <ListItem>
                  <strong>দুই:</strong> অ্যাপের জানালায় Initialize চাপুন। এই এক চাপে
                  initdb চলে, Data Directory তৈরি হয়, আর Server চালু হয়।
                </ListItem>
                <ListItem>
                  <strong>তিন:</strong> Terminal থেকে psql চালাতে চাইলে Mac কে বলে দিতে
                  হবে psql কোথায় আছে। Postgres.app এর নিজের দেওয়া Command টা নিচে।
                  এটা একটা ছোট ফাইল বানায়, যেটা Mac প্রতিটা নতুন Terminal খোলার সময়
                  পড়ে। Password চাইলে আপনার Mac এর Login Password দিন।
                </ListItem>
                <ListItem>
                  <strong>চার:</strong> Terminal টা বন্ধ করে নতুন একটা খুলুন, তারপর শুধু
                  psql লিখুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Mac, Postgres.app)",
          code: `# psql আর বাকি Client Program কে PATH এ আনা, Postgres.app এর নিজের দেওয়া লাইন
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp

# নতুন Terminal খুলে
psql --version
psql`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Postgres.app Superuser বানায় আপনার Mac এর লগইন নামে, আর সেই নামেই একটা
              Database ও বানিয়ে দেয়। তাই এখানে শুধু psql লিখলে psql যে নাম আর যে Database ধরে নেয়,
              দুটোই আগে থেকে আছে, আর Server বসে আছে Port 5432 এ। অন্য টিউটোরিয়ালে psql -U postgres দেখলে মনে
              রাখবেন, আপনার মেশিনে নামটা postgres না, আপনার নিজের নাম। মুছে ফেলতে চাইলে
              অ্যাপটা বন্ধ করে Trash এ ফেলুন, আর তিন নম্বর ধাপে যে ফাইলটা বানিয়েছিলেন
              সেটা মুছে দিন: <code className={CODE}>sudo rm /etc/paths.d/postgresapp</code>।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "homebrew",
      subHeader: { index: "006", title: "Mac: Homebrew" },
      title: <SectionTitle>Homebrew দিয়ে: তিনটা Command আর একটা PATH</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Homebrew হলো Mac এর জন্য একটা Package Manager, মানে Terminal থেকে
                Software ইনস্টল আর আপডেট করার Tool। Homebrew এ PostgreSQL এর প্রতিটা
                Major Version আলাদা নামে থাকে: postgresql@17, postgresql@18। এই লেখার দিন
                postgresql@18 Formula টা 18.6 দিচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা শব্দ আগে বুঝে নিন: <strong>keg-only</strong>। Homebrew কিছু Formula
                ইনস্টল করে, কিন্তু তাদের Program গুলো সাধারণ জায়গায় রাখে না, যাতে একই
                জিনিসের দুটো Version একে অপরকে না ঢেকে দেয়। Version নম্বরসহ Formula গুলো,
                যেমন postgresql@18, keg-only। এর মানে ইনস্টলের পর psql লিখলে Mac তাকে
                খুঁজে পাবে না, যতক্ষণ না আপনি নিজে PATH এ তার ঠিকানা যোগ করছেন। PATH হলো
                সেই তালিকা, যেখানে Shell একটা Command এর নাম শুনে Program টা খোঁজে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Mac, Homebrew)",
          code: `# এক: ইনস্টল
brew install postgresql@18

# দুই: psql কে PATH এ আনা (Apple Silicon Mac এ Homebrew থাকে /opt/homebrew এ)
echo 'export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# তিন: Server চালু, আর প্রতিবার Login এর সময় নিজে চালু হবে
brew services start postgresql@18

# যাচাই
psql --version
pg_isready
psql postgres`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Intel চিপের পুরনো Mac এ Homebrew থাকে /usr/local এ, তাই PATH এর লাইনে
                /opt/homebrew এর জায়গায় /usr/local লিখবেন। নিশ্চিত না হলে{" "}
                <code className={CODE}>brew --prefix postgresql@18</code> চালান, যে
                ফোল্ডার দেখায় তার শেষে /bin যোগ করলেই আপনার লাইন।
              </ContentParagraph>
              <ContentParagraph>
                ইনস্টলের সময় Homebrew নিজেই initdb চালিয়ে একটা Cluster বানিয়ে রাখে,{" "}
                <code className={CODE}>/opt/homebrew/var/postgresql@18</code> ফোল্ডারে।
                initdb কে আলাদা করে কোনো নাম না বললে সে Superuser বানায় যিনি তাকে
                চালাচ্ছেন তাঁর নামে, মানে আপনার Mac এর লগইন নামে। আর Database বানায় শুধু
                শুরুর তিনটা: postgres, template0, template1। এই দুটো তথ্য থেকেই Homebrew
                ব্যবহারকারীদের প্রথম দুটো Error আসে, যেটা একটু পরেই দেখবেন। আপাতত মনে
                রাখুন: Homebrew এ ঢোকার Command <code className={CODE}>psql postgres</code>,
                শুধু psql না।
              </ContentParagraph>
              <ContentParagraph>
                Homebrew এর নিজের সতর্কবার্তায় আরেকটা কাজের কথা আছে। কম্পিউটার হঠাৎ বন্ধ
                হয়ে গেলে কখনো কখনো Server আর চালু হতে চায় না, postmaster.pid নামের একটা
                Lock ফাইলের কারণে। কোনো postgres চলছে না নিশ্চিত হলে সেই ফাইলটা মুছে আবার
                চালু করলেই হয়: <code className={CODE}>rm /opt/homebrew/var/postgresql@18/postmaster.pid</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আগে থেকে postgresql@17 থাকলে",
          content: (
            <ContentParagraph>
              একই Mac এ আগে থেকে অন্য একটা Version ইনস্টল আর Link করা থাকলে Homebrew
              নিজেই সতর্ক করে যে নতুনটার psql, createdb আর অন্য Program গুলো পুরনোটার
              নিচে ঢাকা পড়ে আছে। তখন psql --version চালিয়ে দেখুন কোনটা চলছে। নতুনটা
              চাইলে PATH এর লাইনটা অন্য সব লাইনের পরে রাখুন যাতে সে সবার আগে বসে, অথবা{" "}
              <code className={CODE}>brew link postgresql@18</code>। আর দুটো Server একসাথে
              brew services দিয়ে চালু করবেন না, দুজনেই 5432 চাইবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "windows",
      subHeader: { index: "007", title: "Windows" },
      title: <SectionTitle>Windows এ: Installer আর একটা Path</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Windows এর জন্য PostgreSQL এর অফিসিয়াল Download পাতা EDB নামের একটা
                কোম্পানির বানানো Installer দেখায়। এটা একটা সাধারণ Next, Next, Finish
                ধরনের Installer, যার সাথে চাইলে pgAdmin (একটা GUI, Lesson 04 এ) আর Stack
                Builder (বাড়তি Tool নামানোর আরেকটা Program) আসে। ধাপগুলো EDB এর নিজের
                Docs অনুযায়ী এমন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Installer নামান আর চালান",
              description:
                "postgresql.org/download/windows পাতা থেকে EDB এর Installer নিন, Version 18। কিছু Windows এ ডান Click করে Run as Administrator লাগতে পারে।",
            },
            {
              title: "Installation Directory",
              description:
                "Default টাই রাখুন। Program গুলো যাবে C:\\Program Files\\PostgreSQL\\18 ফোল্ডারে, এই ঠিকানাটা একটু পরে লাগবে।",
            },
            {
              title: "Select Components",
              description:
                "PostgreSQL Server আর Command Line Tools অবশ্যই রাখুন, কারণ psql আসে Command Line Tools এর ভেতরে। pgAdmin 4 রাখতে পারেন। Stack Builder এখন লাগবে না।",
            },
            {
              title: "Data Directory",
              description: "Default টাই ঠিক আছে। এখানেই আপনার সব Database এর Data থাকবে।",
            },
            {
              title: "Password",
              description:
                "postgres নামের Superuser এর জন্য একটা Password দিন। এটাই পরে প্রতিবার psql -U postgres চালালে চাইবে। একটা Password Manager এ রেখে দিন, এখানে ভুলে যাওয়া সবচেয়ে বিরক্তিকর।",
            },
            {
              title: "Port আর Locale",
              description:
                "Port 5432 রাখুন। Locale এ Default locale মানে আপনার Windows এর ভাষা ও অঞ্চল, সেটাই রাখতে পারেন।",
            },
            {
              title: "Install আর শেষে Stack Builder",
              description:
                "Summary দেখে Next। শেষ পাতায় Stack Builder চালু করার একটা টিক থাকে, এখন সেটা তুলে দিয়ে Finish চাপলেই হবে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Installer নিজে Windows এর Path বদলায় না। তাই ইনস্টলের পর Terminal এ psql
                লিখলে Windows বলবে এমন কোনো Command নেই। সমাধান: Start Menu তে
                Environment Variables লিখে সার্চ করুন, Edit the system environment
                variables খুলুন, Environment Variables বাটন, তারপর Path বেছে Edit, আর
                নতুন একটা লাইন যোগ করুন:{" "}
                <code className={CODE}>C:\Program Files\PostgreSQL\18\bin</code>। এবার
                পুরনো Terminal বন্ধ করে নতুন PowerShell খুলুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "PowerShell (Windows)",
          code: `# নতুন PowerShell এ
psql --version
psql -U postgres
# Password for user postgres:  এখানে Installer এ দেওয়া Password`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Windows এ সবসময় -U postgres",
          content: (
            <ContentParagraph>
              Windows এ psql কে কোনো নাম না বললে সে আপনার Windows এর লগইন নামটাকে
              Role ভেবে নেয়। EDB শুধু postgres বানায়, তাই শুধু psql লিখলে Password চেয়ে
              তারপর ব্যর্থ হবে। এই লেসনের Who You Are অংশে এর পুরো কারণ দেখবেন। আপাতত
              অভ্যাস করে নিন: Windows এ psql -U postgres।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "ubuntu",
      subHeader: { index: "008", title: "Ubuntu and Debian" },
      title: <SectionTitle>Linux এ: apt, systemctl আর sudo -u postgres</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Ubuntu তে PostgreSQL দুই জায়গা থেকে নেওয়া যায়। Ubuntu নিজের Repository তে
                একটা Version রাখে, আর পুরো Ubuntu Release এর জীবনভর সেই Version টাই রাখে।
                সহজ, কিন্তু প্রায়ই পুরনো। দ্বিতীয় জায়গা হলো PostgreSQL এর নিজের apt
                Repository, যাকে PGDG বলে (PostgreSQL Global Development Group)। সেখানে সব
                চালু Major Version পাওয়া যায়, আর প্রতিটা Minor আসা মাত্র। এই ট্র্যাক 18
                চায়, তাই PGDG। Debian এও ধাপগুলো একই।
              </ContentParagraph>
              <ContentParagraph>
                নিচের প্রথম দুটো লাইন postgresql.org এর Ubuntu পাতা থেকে হুবহু। দ্বিতীয়
                লাইনটা একটা Script চালায়, যেটা আপনার Ubuntu এর Version দেখে PGDG
                Repository টা যোগ করে দেয়। এই লেখার দিন PGDG Ubuntu 22.04, 24.04 আর 26.04
                এর মতো চালু Version গুলো সমর্থন করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Ubuntu বা Debian)",
          code: `# এক: PGDG Repository যোগ করা, postgresql.org এর দেওয়া Script দিয়ে
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

# দুই: PostgreSQL 18 ইনস্টল
sudo apt update
sudo apt install postgresql-18

# তিন: Server চলছে কিনা
sudo systemctl status postgresql
pg_lsclusters

# চার: Superuser হয়ে ঢোকা
sudo -u postgres psql`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Ubuntu তে ইনস্টলের সাথে সাথেই একটা Cluster তৈরি হয়ে যায়, নাম main, আর
                Server চালু হয়ে যায়। pg_lsclusters সেই Cluster গুলোর তালিকা দেখায়: কোন
                Version, কোন নাম, কোন Port, চালু কিনা। Config ফাইলগুলো থাকে{" "}
                <code className={CODE}>/etc/postgresql/18/main</code> ফোল্ডারে, যেটা Module
                18 এ খুলবেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার সবচেয়ে গুরুত্বপূর্ণ অংশ, ঢোকার নিয়ম। ইনস্টলের সময় Ubuntu একটা নতুন
                OS ব্যবহারকারী বানায়, যার নাম postgres, আর Database এ একটা Superuser
                Role, তারও নাম postgres। Ubuntu তে নিজের কম্পিউটার থেকে Socket দিয়ে ঢোকার
                Default নিয়মের নাম <strong>peer</strong>। Peer মানে: আপনি OS এ যে নামে
                আছেন, Database এও শুধু সেই নামের Role হয়ে ঢুকতে পারবেন। আপনি OS এ rahim,
                তাই postgres Role হয়ে ঢুকতে পারবেন না। sudo -u postgres মানে, এই Command টা
                OS এর postgres ব্যবহারকারী হয়ে চালানো। তখন দুই নাম মেলে, আর আপনি ঢুকে যান।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিবার sudo -u postgres লেখা ঝামেলার। নিজের শেখার মেশিনে বেশিরভাগ মানুষ
                নিজের নামে একটা Role আর একটা Database বানিয়ে নেন। নিচের চারটা লাইন আমি
                একটা আসল PostgreSQL 18 এ ঠিক এই ক্রমে চালিয়েছি, প্রতিটার নিচে তার আসল
                ফল। rahim এর জায়গায় আপনার নিজের লগইন নাম থাকবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Ubuntu, নিজের নামে Role)",
          code: `$ psql
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "rahim" does not exist

$ sudo -u postgres createuser --superuser "$USER"

$ psql
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "rahim" does not exist

$ createdb
$ psql -c "SELECT current_user, current_database();"
 current_user | current_database
--------------+------------------
 rahim        | rahim
(1 row)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "--superuser শুধু নিজের শেখার মেশিনে",
          content: (
            <ContentParagraph>
              নিজের Laptop এ নিজেকে Superuser বানানো স্বাভাবিক, এখানে আপনিই মালিক।
              কিন্তু একটা VPS বা টিমের Server এ এটা কখনো না। সেখানে প্রত্যেকে আর
              প্রতিটা App ঠিক যতটুকু দরকার ততটুকু অনুমতি পায়। Role আর Permission এর পুরো
              গল্প Module 16 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "docker",
      subHeader: { index: "009", title: "Docker" },
      title: <SectionTitle>Docker দিয়ে: সব OS এ হুবহু একই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Docker এ PostgreSQL চলে একটা Container এর ভেতরে। Container কে ভাবুন একটা
                সিল করা টিফিন বাক্সের মতো: ভেতরে PostgreSQL এর জন্য যা যা লাগে সব আছে, আর
                বাক্সটা Mac, Windows বা Linux, যেকোনো জায়গায় একই রকম চলে। এই কারণেই অনেক
                টিম নতুন Developer কে বলে, শুধু Docker টা ইনস্টল করুন, বাকিটা একটা Command।
                আপনার কম্পিউটারে Docker Desktop বা অন্য কোনো Docker চলতে হবে। Docker নিজে
                কী আর কীভাবে কাজ করে, সেটা DevOps ট্র্যাকের Docker মডিউলের বিষয়। এখানে
                শুধু যতটুকু লাগে।
              </ContentParagraph>
              <ContentParagraph>
                তিনটা জিনিস আগে বুঝে নিন। <strong>Image</strong> হলো বাক্সের নকশা,
                এখানে অফিসিয়াল postgres:18। <strong>Container</strong> হলো সেই নকশা থেকে
                বানানো একটা চালু বাক্স, যার নাম আমরা দেব island-pg। আর{" "}
                <strong>Volume</strong> হলো বাক্সের বাইরের একটা আলাদা তাক, যেখানে Data
                রাখা হয়। Container মুছে ফেললেও Volume থেকে যায়, তাই Data হারায় না।
              </ContentParagraph>
              <ContentParagraph>
                আর Password। কোনো Password কখনো সরাসরি Command এর ভেতরে লিখবেন না। Terminal
                সব Command মনে রাখে (History), স্ক্রিনশটে চলে আসে, আর একদিন ভুল করে Git
                এ ঢুকে যায়। তার বদলে প্রথম লাইনটা চুপচাপ আপনার কাছ থেকে Password টা চেয়ে
                নেয় (টাইপ করার সময় কিছু দেখাবে না) আর POSTGRES_PASSWORD নামের একটা
                Environment Variable এ রেখে দেয়। পরের Command গুলো শুধু ওই নামটা ব্যবহার
                করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Mac বা Linux, Docker)",
          code: `# এক: Password টা চুপচাপ নেওয়া, কোথাও লেখা থাকবে না
printf 'Password: '; read -rs POSTGRES_PASSWORD; echo; export POSTGRES_PASSWORD

# দুই: Data রাখার Volume
docker volume create island-pg-data

# তিন: Container চালু
docker run -d --name island-pg \\
  -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \\
  -p 127.0.0.1:5432:5432 \\
  -v island-pg-data:/var/lib/postgresql \\
  postgres:18

# চার: চলছে কিনা
docker ps --filter name=island-pg
docker logs island-pg 2>&1 | grep "ready to accept"

# পাঁচ: ভেতরে ঢোকা
docker exec -it island-pg psql -U postgres`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রতিটা অংশের মানে। <code className={CODE}>-d</code> মানে Container
                পেছনে চলবে, Terminal আটকে রাখবে না। <code className={CODE}>-e</code> দিয়ে
                Container কে Environment Variable দেওয়া হয়, আর অফিসিয়াল Image এর Docs
                বলে POSTGRES_PASSWORD বাধ্যতামূলক, খালি রাখা যাবে না। এটাই postgres নামের
                Superuser এর Password। <code className={CODE}>-p 127.0.0.1:5432:5432</code>{" "}
                মানে আপনার কম্পিউটারের 5432 Port কে Container এর 5432 এর সাথে জোড়া, কিন্তু
                শুধু আপনার নিজের কম্পিউটার থেকে। শুরুর 127.0.0.1 অংশটা বাদ দিলে আপনার
                Wi-Fi এর অন্য যন্ত্রও এই দরজায় টোকা দিতে পারত।
              </ContentParagraph>
              <ContentParagraph>
                আর <code className={CODE}>-v island-pg-data:/var/lib/postgresql</code> এর
                পেছনে একটা নতুন গল্প আছে। PostgreSQL 18 থেকে অফিসিয়াল Image Data রাখে{" "}
                <code className={CODE}>/var/lib/postgresql/18/docker</code> ফোল্ডারে, আর
                Volume লাগাতে বলে তার এক ধাপ উপরে, /var/lib/postgresql এ। পুরনো
                টিউটোরিয়ালগুলো, 17 বা তার আগের জন্য লেখা, Volume লাগায়
                /var/lib/postgresql/data তে। postgres:18 এর সাথে সেই পুরনো লাইন লিখলে
                Container চালুই হয় না। আমি নিজে চালিয়ে দেখেছি, Log এ এই লেখা আসে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "docker logs (পুরনো Volume পথ দিয়ে postgres:18)",
          code: `Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).  This better reflects how
       PostgreSQL itself works, and how upgrades are to be performed.
...
       Counter to that, there appears to be PostgreSQL data in:
         /var/lib/postgresql/data (unused mount/volume)
...
       The suggested container configuration for 18+ is to place a single mount
       at /var/lib/postgresql which will then place PostgreSQL data in a
       subdirectory, allowing usage of "pg_upgrade --link" without mount point
       boundary issues.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ঠিক পথে চালালে docker ps এ Container টা Up দেখাবে, আর Log এর শেষে আসবে{" "}
                <code className={CODE}>database system is ready to accept connections</code>।
                Container এর ভেতরে ঢুকতে Password লাগে না, কারণ Image ভেতরের Socket দিয়ে
                ঢোকার নিয়ম trust রাখে। কিন্তু আপনার কম্পিউটার থেকে TCP দিয়ে এলে, যেমন
                নিজের ইনস্টল করা psql, আপনার App বা একটা GUI, তখন Password চাইবে।
              </ContentParagraph>
              <ContentParagraph>
                Volume সত্যিই Data বাঁচায় কিনা, সেটাও আমি পরীক্ষা করেছি। একটা Table বানিয়ে
                তাতে একটা Row রেখেছি, তারপর Container টা পুরো মুছে একই Volume দিয়ে নতুন
                Container চালিয়েছি। নতুন Container এর Log বলল{" "}
                <code className={CODE}>Database directory appears to contain a database; Skipping initialization</code>,
                আর Row টা যেমন ছিল তেমনই পাওয়া গেল। Container যায় আসে, Volume থেকে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (Docker, রোজকার কাজ)",
          code: `docker stop island-pg            # Server বন্ধ, Data থাকে
docker start island-pg           # আবার চালু
psql -h 127.0.0.1 -U postgres    # নিজের psql দিয়ে, Password চাইবে

# সব মুছে ফেলা, Data সহ, ফেরত আসবে না
docker rm -f island-pg
docker volume rm island-pg-data`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Windows এর PowerShell এ",
          content: (
            <ContentParagraph>
              PowerShell এ Password নেওয়ার লাইনটা এমন:{" "}
              <code className={CODE}>$env:POSTGRES_PASSWORD = Read-Host &quot;Password&quot;</code>।
              আর docker run এ লাইন ভাঙার চিহ্ন \ এর জায়গায় PowerShell এ ` (Backtick), অথবা
              পুরো Command টা এক লাইনে লিখুন, যেখানে Password এর জায়গায়{" "}
              <code className={CODE}>-e POSTGRES_PASSWORD=$env:POSTGRES_PASSWORD</code>।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "verify",
      subHeader: { index: "010", title: "Verify It Works" },
      title: <SectionTitle>চারটা প্রশ্নে নিশ্চিত হওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                যে পথেই আসুন, শেষে একই চারটা প্রশ্ন করুন, এই ক্রমে। প্রতিটার উত্তর আগেরটার
                উপর দাঁড়িয়ে, তাই কোনোটায় আটকে গেলে বুঝবেন ঠিক কোন জায়গায় সমস্যা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>psql আছে তো?</strong>{" "}
                  <code className={CODE}>psql --version</code>। Program টা খুঁজে পেলে
                  তার Version বলবে। এটা শুধু Client এর Version, Server এর না।
                </ListItem>
                <ListItem>
                  <strong>Server দরজা খুলে রেখেছে তো?</strong>{" "}
                  <code className={CODE}>pg_isready</code>। ছোট্ট একটা Program, যে শুধু
                  দরজায় টোকা দিয়ে দেখে কেউ সাড়া দেয় কিনা। সাড়া পেলে বলে accepting
                  connections আর শেষ হয় 0 Exit Code দিয়ে। কেউ না থাকলে বলে no response,
                  Exit Code 2। Docker এর বেলায় <code className={CODE}>pg_isready -h 127.0.0.1</code>।
                </ListItem>
                <ListItem>
                  <strong>ঢুকতে পারছি তো?</strong> আপনার পথের ঢোকার Command, যেমন{" "}
                  <code className={CODE}>psql postgres</code>। Prompt এ পৌঁছানো মানে
                  পরিচয় আর Database দুটোই ঠিক।
                </ListItem>
                <ListItem>
                  <strong>কোন Server, কোন Version?</strong> ভেতরে ঢুকে{" "}
                  <code className={CODE}>SELECT version();</code> আর{" "}
                  <code className={CODE}>SHOW port;</code>। এবার Server নিজে বলছে সে কে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচে একটা আসল PostgreSQL 18.6 Server এ এই চারটা প্রশ্নের হুবহু উত্তর।
                Server টা চলেছিল Docker এ, একটা Mac এর উপর। আপনার মেশিনে Version এর লেখা,
                ঠিকানা আর Port একটু আলাদা হতে পারে, কিন্তু আকারটা এমনই হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "আসল Output, PostgreSQL 18.6 (Docker)",
          code: `$ psql --version
psql (PostgreSQL) 18.6 (Debian 18.6-1.pgdg13+2)

$ pg_isready
/var/run/postgresql:5432 - accepting connections

$ psql -U postgres
psql (18.6 (Debian 18.6-1.pgdg13+2))
Type "help" for help.

postgres=# SELECT version();
                                                         version
--------------------------------------------------------------------------------------------------------------------------
 PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
(1 row)

postgres=# SHOW port;
 port
------
 5432
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              postgres=# এর শেষের # চিহ্নটা বলছে আপনি Superuser হিসেবে ঢুকেছেন। সাধারণ
              Role হলে সেখানে থাকত &gt;। psql এর Prompt এর প্রতিটা চিহ্নের মানে আর ভেতরের
              Command গুলো পরের পরের লেসনে, psql এর লেসনে। এবার Browser এর বক্সে একই
              প্রশ্নগুলো করুন, আর দুটো উত্তর পাশাপাশি রেখে দেখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="নিজের Server এর সাথে মিলিয়ে দেখুন"
              query={`SELECT version();
SHOW port;
SELECT datname FROM pg_database ORDER BY datname;`}
              caption="Browser এর PostgreSQL ও Port বলবে 5432, আর তিনটা Database: postgres, template0, template1, ঠিক যেমন initdb বানায়। পার্থক্য শুধু version() এ: এখানে লেখা থাকবে PGlite আর wasm32, মানে WebAssembly তে বানানো একটা বিশেষ Build। আপনার নিজের মেশিনে একই তিন লাইন চালালে আপনার Version, আপনার OS আর CPU এর নাম দেখবেন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "who-you-are",
      subHeader: { index: "011", title: "Who You Are" },
      title: <SectionTitle>আপনি কে, সেটা psql কীভাবে ঠিক করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রথম দিনের প্রায় সব Error এর মূলে একটাই জিনিস, আর সেটা psql এর অফিসিয়াল
                Docs এ লেখা দুটো নিয়ম। কিছু না বললে, psql Database এর ব্যবহারকারী হিসেবে
                নেয় আপনার কম্পিউটারের লগইন নাম। আর ব্যবহারকারীর নাম ঠিক হয়ে গেলে, সেই
                নামটাকেই Database এর নাম হিসেবেও ধরে নেয়। এর সাথে আরও দুটো: Host না বললে Mac
                আর Linux এ সে নিজের কম্পিউটারের Socket এ যায় (Windows এ localhost এ), আর Port
                না বললে 5432।
              </ContentParagraph>
              <ContentParagraph>
                এখন প্রতিটা পথের Superuser এর নাম মিলিয়ে দেখুন। Postgres.app আর Homebrew
                বানায় আপনার নামে, বাকি সবাই postgres নামে। তাই একই psql Command এক
                কম্পিউটারে চলে, আরেকটায় ভাঙে। টিউটোরিয়ালের লেখক আর আপনি আলাদা পথে
                ইনস্টল করেছেন, এটাই বেশিরভাগ বিভ্রান্তির উৎস।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConnectDefaultsDiagram />,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConnectDefaultsLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের বক্সে Server কে সরাসরি জিজ্ঞেস করুন আপনি কে, আর কোন কোন Role আছে।
              pg_ দিয়ে শুরু হওয়া Role গুলো PostgreSQL এর নিজের, সেগুলো বাদ দেওয়া হয়েছে।
              নিজের মেশিনে একই Query চালালে দেখবেন কোন নামের Role আপনার Superuser, তাহলে আর
              কোনোদিন অনুমান করতে হবে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আমি কে, আর কে কে আছেন"
              query={`SELECT current_user, current_database();

SELECT rolname, rolsuper, rolcanlogin
FROM pg_roles
WHERE rolname !~ '^pg_'
ORDER BY rolname;`}
              caption="এখানে উত্তর postgres, কারণ এই বক্স postgres হয়ে চলে। rolsuper এর t মানে Superuser, rolcanlogin এর t মানে এই Role দিয়ে Login করা যায়। Homebrew বা Postgres.app এ একই Query চালালে postgres এর জায়গায় আপনার Mac এর লগইন নাম দেখবেন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "ports",
      subHeader: { index: "012", title: "Ports and Two Servers" },
      title: <SectionTitle>একটা দরজা, দুজন দারোয়ান হলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা Port এ একসাথে একটাই Program বসতে পারে। আপনার কম্পিউটারে আগে থেকে
                একটা PostgreSQL 5432 এ চললে, নতুনটা সেখানে বসতে পারবে না। Docker এর বেলায়
                Error টা খুব স্পষ্ট, আমি একই Port এ দ্বিতীয় একটা Container চালাতে গিয়ে এটা
                পেয়েছি (লম্বা ID গুলো বাদ দিয়ে):
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "আসল Output",
          code: `docker: Error response from daemon: failed to set up container networking: driver failed
programming external connectivity on endpoint ...: Bind for 127.0.0.1:5432 failed: port is already allocated`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PortConflictSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                কে Port টা ধরে আছে, সেটা জানার Command Mac আর Linux এ{" "}
                <code className={CODE}>lsof</code>, মানে list open files। নিচে একটা আসল
                Mac এর উত্তর, শুধু ব্যবহারকারীর নামটা বদলানো: 5432 ধরে আছে postgres নামের
                একটা Process, যেটা Homebrew এর PostgreSQL 17। এই তথ্য পেলে সিদ্ধান্ত নেওয়া সহজ: পুরনোটা বন্ধ
                করবেন, নাকি নতুনটাকে অন্য Port এ বসাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `# Mac বা Linux: কে 5432 এ বসে আছে
$ lsof -nP -iTCP:5432 -sTCP:LISTEN
COMMAND   PID  USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
postgres 1863 rahim    7u  IPv6  0x...      0t0  TCP [::1]:5432 (LISTEN)
postgres 1863 rahim    8u  IPv4  0x...      0t0  TCP 127.0.0.1:5432 (LISTEN)

# Windows এর PowerShell এ
netstat -ano | findstr :5432

# নতুনটাকে 5433 এ বসানো (Docker), আর Connect করার সময় Port বলা
docker run -d --name island-pg \\
  -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \\
  -p 127.0.0.1:5433:5432 \\
  -v island-pg-data:/var/lib/postgresql \\
  postgres:18
psql -h 127.0.0.1 -p 5433 -U postgres`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "এই ট্র্যাকের নিয়ম: বিকল্প Port সবসময় 5433",
          content: (
            <ContentParagraph>
              আপনার মেশিনে 5432 আগে থেকে দখল হয়ে থাকলে, এই ট্র্যাকের যেখানেই 5432
              দেখবেন, নিজে 5433 বসিয়ে নেবেন। Docker এ -p 127.0.0.1:5433:5432 (বামের
              সংখ্যাটা আপনার কম্পিউটারের, ডানেরটা Container এর ভেতরের, সেটা 5432 ই থাকে),
              আর psql এ -p 5433। একটা নির্দিষ্ট বিকল্প ঠিক করে রাখলে মাসখানেক পরেও মনে
              থাকে কোনটা কোথায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "first-day-errors",
      subHeader: { index: "013", title: "First-day Errors" },
      title: <SectionTitle>Error এর প্রথম শব্দ বলে দেয় কোথায় আটকেছেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                psql থেকে Server পর্যন্ত প্রতিটা চেষ্টা চারটা ধাপ পার হয়, একটার পর একটা।
                কোনো ধাপে আটকালে পরের ধাপে যাওয়াই হয় না। তাই Error পড়ার কৌশল হলো আগে
                বোঝা কোন ধাপে আটকেছে, তারপর সেই ধাপের কারণ খোঁজা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ধাপ এক, Program খোঁজা:</strong> Shell psql কে খুঁজে পেল কিনা।
                  ব্যর্থ হলে Error আসে Shell থেকে, PostgreSQL থেকে না:{" "}
                  <code className={CODE}>zsh: command not found: psql</code>।
                </ListItem>
                <ListItem>
                  <strong>ধাপ দুই, Server এ পৌঁছানো:</strong> ঠিকানায় কেউ সাড়া দিল কিনা।
                  ব্যর্থ হলে শব্দগুলো No such file or directory বা Connection refused।
                  এখানে FATAL শব্দটা থাকে না, কারণ Server এর সাথে কথাই হয়নি।
                </ListItem>
                <ListItem>
                  <strong>ধাপ তিন, পরিচয় দেওয়া:</strong> Server আপনাকে চিনল কিনা। এখান
                  থেকে Error এ FATAL থাকে, কারণ এবার Server নিজে কথা বলছে: Password, Peer, বা
                  role does not exist।
                </ListItem>
                <ListItem>
                  <strong>ধাপ চার, Database বাছা:</strong> পরিচয় পার, শুধু চাওয়া
                  Database টা আছে কিনা: database does not exist।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এর আটটা Error এর প্রতিটা একটা আসল PostgreSQL 18 আর Docker এ
                ঘটিয়ে তুলে আনা। বদলানো শুধু তিনটা জিনিস: ব্যবহারকারীর নাম rahim, Port 5432,
                আর Socket এর ফোল্ডার, যাতে আপনার মেশিনের মতো দেখায়। একটা একটা করে Click করুন, আর প্রতিবার আগে নিজে আন্দাজ করুন কোন ধাপে
                আটকেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ErrorStageLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "password authentication failed কেন তিন কথার এক উত্তর",
          content: (
            <ContentParagraph>
              আমি একটা Server এ এমন একটা নাম দিয়ে ঢোকার চেষ্টা করেছি, যে নামে কোনো Role
              নেই, TCP দিয়ে। উত্তর এল password authentication failed for user, role does
              not exist না। এটা ইচ্ছাকৃত। Password চাওয়ার নিয়ম যেখানে খাটে, সেখানে Server
              বাইরের কাউকে জানাতে চায় না কোন নামগুলো আসলে আছে, নইলে একজন আক্রমণকারী নাম
              আন্দাজ করে করে তালিকা বানাতে পারত। তাই এই Error দেখলে তিনটাই সন্দেহ করুন:
              Password ভুল, Role এর Password নেই, অথবা Role টাই নেই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours টিমের Local Database</SectionTitle>,
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
                Island Tours এর Production Database PostgreSQL এ চলে। টিমের প্রত্যেক
                Developer এর মেশিনে একটা নিজস্ব PostgreSQL থাকে, আর সবাই একই পথ ধরে: Docker,
                একই Container নাম island-pg, একই Volume island-pg-data, একই Port। নতুন
                কেউ এলে তাঁকে আলাদা করে কিছু বোঝাতে হয় না, README তে লেখা Command গুলো
                চালালেই তাঁর মেশিন বাকি সবার মতো।
              </ContentParagraph>
              <ContentParagraph>
                এই সিদ্ধান্তের পেছনে চারটা কারণ, আর প্রতিটা এই লেসনের কোনো না কোনো অংশ
                থেকে এসেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Production এর সাথে একই Major Version:</strong> Production যে
                  Major চালায়, Local Container ও সেই Image Tag নেয়। কেউ মেশিনে এমন
                  কোনো Feature ব্যবহার করে ফেলেন না, যা Production এ নেই।
                </ListItem>
                <ListItem>
                  <strong>Password কখনো Code এ না:</strong> App টা Database এর ঠিকানা আর
                  Password পায় DATABASE_URL নামের একটা Environment Variable থেকে, যেটা
                  প্রত্যেকে নিজের মেশিনে বসান। Module 01 এর Lesson 06 এ এর আকার
                  দেখেছেন। Variable টা না থাকলে App চালু হওয়ার সময়ই জোরে Error দেয়, কোনো
                  লুকানো Default এ চুপচাপ চলে না।
                </ListItem>
                <ListItem>
                  <strong>শুধু 127.0.0.1 এ খোলা Port:</strong> কফিশপের Wi-Fi তে বসেও কারো
                  Laptop এর Database বাইরে থেকে দেখা যায় না।
                </ListItem>
                <ListItem>
                  <strong>নষ্ট করা সহজ, ফেরত আনা সহজ:</strong> কেউ কিছু ভেঙে ফেললে Container
                  আর Volume মুছে আবার শুরু, তারপর Sample Data আবার Load। পুরো কাজটা দুই
                  মিনিটের, আর Sample Data Load করা এই মডিউলের Lesson 06 এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: ".env.example (Island Tours এর মতো একটা Project এ)",
          code: `# এই ফাইলটা Git এ থাকে, আসল মান ছাড়া। প্রত্যেকে কপি করে .env বানান, যেটা Git এ যায় না।
DATABASE_URL=postgres://postgres:<your-password>@127.0.0.1:5432/island_tours`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার my-tours এর জন্য",
          content: (
            <ContentParagraph>
              নিজের Project এর README তে আজই একটা Database অংশ লিখে রাখুন: কোন পথে
              ইনস্টল, কোন Version, Container আর Volume এর নাম, কোন Port, চালু আর বন্ধের
              Command, আর মুছে নতুন করে শুরু করার Command। ছয় মাস পরে নতুন Laptop এ আপনি
              নিজেই এই অংশের জন্য নিজেকে ধন্যবাদ দেবেন। এই লেসনের Assignment ঠিক এটাই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>শূন্য থেকে SELECT version() পর্যন্ত, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Theory তে নাদিয়ার যে তালিকা ছিল, তার মাঝের কাজটা এবার পুরোটা। তিনি Mac
              ব্যবহার করেন, আর টিম Docker চায়। প্রতিটা ধাপে খেয়াল করুন পাঁচটা জিনিসের
              কোনটা জায়গামতো বসছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "আগে থেকে কিছু আছে কিনা দেখেন",
              description:
                "নাদিয়া lsof -nP -iTCP:5432 -sTCP:LISTEN চালান। কিছু আসে না, মানে 5432 খালি। কিছু এলে তিনি 5433 বেছে নিতেন।",
            },
            {
              title: "Password টা চুপচাপ নেন",
              description:
                "read -rs দিয়ে POSTGRES_PASSWORD নেন। টাইপ করার সময় কিছু দেখা যায় না, Terminal এর History তেও থাকে না। Password টা তিনি Password Manager এও রাখেন।",
            },
            {
              title: "Volume আর Container",
              description:
                "docker volume create island-pg-data, তারপর postgres:18 Image দিয়ে docker run। প্রথমবার Docker Image টা নামায়, তাই এক দুই মিনিট লাগতে পারে। এই মুহূর্তে Container এর ভেতরে initdb চলছে: Data Directory, তিনটা Database আর postgres Superuser তৈরি হচ্ছে।",
            },
            {
              title: "Server জেগেছে কিনা দেখেন",
              description:
                "docker logs এ database system is ready to accept connections লেখাটা খোঁজেন, আর pg_isready -h 127.0.0.1 বলে accepting connections। Server এখন Port 5432 এ অপেক্ষা করছে।",
            },
            {
              title: "ভেতরে ঢোকেন",
              description:
                "docker exec -it island-pg psql -U postgres। Prompt আসে postgres=#, শেষের # বলছে তিনি Superuser।",
            },
            {
              title: "Server কে তার পরিচয় জিজ্ঞেস করেন",
              description:
                "SELECT version(); বলে PostgreSQL 18.6, SHOW port; বলে 5432। Production এর Major Version এর সাথে মিলিয়ে নেন।",
            },
            {
              title: "বাইরে থেকেও দেখেন",
              description:
                "নিজের Terminal থেকে psql -h 127.0.0.1 -U postgres। এবার Password চায়, কারণ TCP দিয়ে এসেছেন। এই পথটাই পরে তাঁর App আর GUI ব্যবহার করবে।",
            },
            {
              title: "README তে লিখে রাখেন",
              description:
                "কোন Image, কোন Container আর Volume এর নাম, কোন Port, কীভাবে চালু বন্ধ করতে হয় আর কীভাবে মুছে নতুন শুরু করতে হয়। পরের কাজ, Sample Data Load, এই মডিউলের Lesson 06 এ।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>PATH বদলে পুরনো Terminal এই চেষ্টা করা:</strong> Shell PATH পড়ে
                শুধু চালু হওয়ার সময়। লাইন যোগ করার পর হয় নতুন Terminal খুলুন, নয়তো
                source ~/.zshrc। Windows এ পুরনো সব PowerShell জানালা বন্ধ করে নতুন খুলুন।
              </ListItem>
              <ListItem>
                <strong>অন্য টিউটোরিয়ালের psql -U postgres অন্ধভাবে চালানো:</strong>{" "}
                Homebrew আর Postgres.app এ postgres নামে কোনো Role নেই। আগে নিজের পথের
                Superuser কে, সেটা জেনে নিন।
              </ListItem>
              <ListItem>
                <strong>দুটো পথে দুটো PostgreSQL, দুটোই 5432 চায়:</strong> একটা চলে, আরেকটা
                চুপচাপ ব্যর্থ হয়, আর আপনি ভাবেন ভুলটার সাথে কথা বলছেন। lsof দিয়ে দেখে
                নিন কে দরজায় বসে আছে।
              </ListItem>
              <ListItem>
                <strong>Password সরাসরি Command এ লেখা:</strong> docker run -e
                POSTGRES_PASSWORD=আসলপাসওয়ার্ড লিখলে সেটা Shell History তে থেকে যায়। সবসময়
                Environment Variable থেকে নিন।
              </ListItem>
              <ListItem>
                <strong>Docker এ -p 5432:5432, শুরুর 127.0.0.1 ছাড়া:</strong> তাহলে Port
                টা আপনার কম্পিউটারের সব Network এ খোলে। শেখার মেশিনে অন্তত 127.0.0.1 বেঁধে
                দিন।
              </ListItem>
              <ListItem>
                <strong>postgres:18 এ পুরনো Volume পথ:</strong> /var/lib/postgresql/data
                লিখলে Container চালুই হয় না। 18 আর তার পরে Volume যাবে /var/lib/postgresql
                এ।
              </ListItem>
              <ListItem>
                <strong>Volume ছাড়া Container চালানো:</strong> তখন Data থাকে একটা নামহীন
                Volume এ। Container মুছে নতুন চালালে সেই Data আর খুঁজে পাবেন না। সবসময়
                নাম দেওয়া Volume।
              </ListItem>
              <ListItem>
                <strong>Server এর ফোল্ডারে হাত দেওয়া:</strong> Data Directory এর কোনো ফাইল
                নিজে মুছবেন বা বদলাবেন না। Homebrew এর postmaster.pid একমাত্র ব্যতিক্রম, আর
                সেটাও শুধু যখন নিশ্চিত যে কোনো postgres চলছে না।
              </ListItem>
              <ListItem>
                <strong>Major Version না মেলানো:</strong> Production 16, Local 18। আপনার
                মেশিনে যা চলল, Production এ সেটা নাও চলতে পারে। Local এ Production এর
                Major টাই রাখুন।
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
      title: <SectionTitle>অফিসিয়াল পাতাগুলো, যেখান থেকে এই লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>PostgreSQL Downloads</strong>, প্রতিটা OS এর অফিসিয়াল পথ এক
                জায়গায়। Mac, Windows আর Linux এর পাতা এখান থেকেই।{" "}
                <a href="https://www.postgresql.org/download/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/download
                </a>
              </ListItem>
              <ListItem>
                <strong>Ubuntu তে PostgreSQL</strong>, PGDG Repository যোগ করার Script আর
                হাতে করার ধাপ, আর কোন Ubuntu Version সমর্থিত।{" "}
                <a href="https://www.postgresql.org/download/linux/ubuntu/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/download/linux/ubuntu
                </a>
              </ListItem>
              <ListItem>
                <strong>Versioning Policy</strong>, কোন Version কতদিন পাহারা পায়, এই
                লেসনের Version এর টেবিল এখান থেকে।{" "}
                <a href="https://www.postgresql.org/support/versioning/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/support/versioning
                </a>
              </ListItem>
              <ListItem>
                <strong>Postgres.app</strong>, ইনস্টলের তিন ধাপ আর PATH এর লাইন।{" "}
                <a href="https://postgresapp.com/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresapp.com
                </a>
              </ListItem>
              <ListItem>
                <strong>EDB: Installing PostgreSQL on Windows</strong>, Windows Installer এর
                প্রতিটা পাতা, আর Path এ bin যোগ করার কথা।{" "}
                <a
                  href="https://www.enterprisedb.com/docs/supported-open-source/postgresql/installing/windows/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  enterprisedb.com/docs/.../installing/windows
                </a>
              </ListItem>
              <ListItem>
                <strong>postgres, Docker Official Image</strong>, POSTGRES_PASSWORD এর মতো
                সব Variable, আর 18 থেকে বদলে যাওয়া Data এর পথ।{" "}
                <a href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener noreferrer" className={LINK}>
                  hub.docker.com/_/postgres
                </a>
              </ListItem>
              <ListItem>
                <strong>psql এর Docs</strong>, Connecting to a Database অংশে কিছু না বললে psql
                কোন নাম আর কোন Database ধরে নেয়।{" "}
                <a href="https://www.postgresql.org/docs/current/app-psql.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/app-psql.html
                </a>
              </ListItem>
              <ListItem>
                <strong>initdb এর Docs</strong>, Superuser এর নাম কোথা থেকে আসে আর শুরুর তিনটা
                Database।{" "}
                <a href="https://www.postgresql.org/docs/current/app-initdb.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  postgresql.org/docs/current/app-initdb.html
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
                  Browser এর বক্স অনুশীলনের ঘর। কাজের জন্য দরকার নিজের কম্পিউটারে চালু
                  থাকা একটা PostgreSQL Server।
                </ListItem>
                <ListItem>
                  ইনস্টল মানে পাঁচটা জিনিস: Server Program (postgres), Data Directory বা
                  Cluster, শুরুর তিনটা Database আর একজন Superuser, Client Program (psql
                  সহ), আর একটা Service। সবার দরজা Port 5432।
                </ListItem>
                <ListItem>
                  18.6 তে 18 Major, 6 Minor। Major বছরে একবার, পাঁচ বছর পাহারা পায়। Minor
                  শুধু সমাধান, সবসময় সর্বশেষটা চালান। নতুন শুরু করলে 18, আর Local এ
                  Production এর Major।
                </ListItem>
                <ListItem>
                  পথ চারটা: Mac এ Postgres.app বা Homebrew (postgresql@18, keg-only, PATH
                  লাগে), Windows এ EDB Installer (bin কে Path এ), Ubuntu তে PGDG থেকে apt
                  (sudo -u postgres psql), আর যেকোনো OS এ Docker (postgres:18, Volume
                  /var/lib/postgresql এ, Password Environment Variable থেকে)।
                </ListItem>
                <ListItem>
                  যাচাই চার প্রশ্নে: psql --version, pg_isready, ঢুকতে পারা, আর ভেতরে
                  SELECT version() আর SHOW port।
                </ListItem>
                <ListItem>
                  কিছু না বললে psql ব্যবহারকারী নেয় আপনার OS এর নাম, Database নেয় সেই
                  একই নাম। Postgres.app আর Homebrew এর Superuser আপনার নামে, বাকিদের
                  postgres।
                </ListItem>
                <ListItem>
                  এক Port এ একজনই। 5432 দখল থাকলে lsof দিয়ে দেখুন কে, আর নতুনটাকে 5433 এ
                  বসান।
                </ListItem>
                <ListItem>
                  Error পড়ুন চার ধাপে: Program খোঁজা, Server এ পৌঁছানো, পরিচয়, Database।
                  FATAL শব্দটা মানে Server এর সাথে কথা হয়েছে, সমস্যা পরিচয় বা Database এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার কম্পিউটারে এখন একটা চালু PostgreSQL আছে। পরের লেসনে একই কাজ MySQL
                এর জন্য, যাঁরা কোনো MySQL কোর্স বা ভিডিও ফলো করছেন, বা যাঁদের চাকরিতে
                MySQL লাগে, তাঁদের জন্য। আর দুটোকে একই মেশিনে পাশাপাশি চালানোর উপায়।
                শুধু PostgreSQL দিয়ে এগোতে চাইলে সেটা হালকা করে পড়ে{" "}
                <Link href="/sql/topic/psql-basics" className={LINK}>
                  psql এর লেসনে
                </Link>{" "}
                চলে যেতে পারেন।
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
      ["Local Database", "নিজের কম্পিউটারে চলা পুরো Database Server, শুধু আপনার জন্য", "Theory"],
      ["Server Program", "সবসময় চলতে থাকা postgres Process, Port 5432 এ অপেক্ষায়", "pg_isready"],
      ["Data Directory, Cluster", "সব Database এর Data রাখার ফোল্ডার, initdb যেটা সাজায়", "SHOW data_directory;"],
      ["শুরুর তিনটা Database", "postgres, template0, template1", "SELECT datname FROM pg_database;"],
      ["Superuser", "সব চাবি যার কাছে। পথভেদে postgres বা আপনার OS এর নাম", "SELECT current_user;"],
      ["Major আর Minor", "18 নতুন Feature, .6 শুধু সমাধান। Major পাঁচ বছর পাহারা পায়", "SHOW server_version;"],
      ["keg-only", "Homebrew Program টা PATH এ রাখে না, নিজে যোগ করতে হয়", "postgresql@18"],
      ["Peer", "Linux এ OS এর নাম আর Role এর নাম মিলতে হয়", "sudo -u postgres psql"],
      ["Docker Volume", "Container এর বাইরের তাক, Container মুছলেও Data থাকে", "/var/lib/postgresql"],
      ["psql এর Default", "ব্যবহারকারী আর Database দুটোই আপনার OS এর নাম", "Who You Are Lab"],
      ["Port দখল", "এক Port এ একজনই, বিকল্প 5433", "lsof -nP -iTCP:5432"],
      ["চার ধাপের Error", "Program, পৌঁছানো, পরিচয়, Database", "Error Lab"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "PostgreSQL 18 নতুন ইনস্টল করলেন, এখনো কিছু করেননি। নিচের কোনটা আপনার কম্পিউটারে থাকবে না?",
        options: [
          {
            key: "A",
            text: "postgres নামের Server Program",
            isCorrect: false,
            explanation: "এটাই আসল DBMS, যেকোনো পথে ইনস্টল করলেই আসে।",
          },
          {
            key: "B",
            text: "postgres, template0 আর template1 নামের তিনটা Database",
            isCorrect: false,
            explanation: "initdb Data Directory সাজানোর সময় এই তিনটা বানায়।",
          },
          {
            key: "C",
            text: "psql আর pg_isready এর মতো Client Program",
            isCorrect: false,
            explanation: "Client Program গুলোও আসে। Windows এ Command Line Tools বাছলে।",
          },
          {
            key: "D",
            text: "island_tours নামের Database",
            isCorrect: true,
            explanation:
              "ঠিক। island_tours আপনাকে নিজে বানাতে আর Load করতে হবে, এই মডিউলের Lesson 06 এ। ইনস্টল শুধু শুরুর তিনটা দেয়।",
          },
        ],
      },
      {
        id: 2,
        text: "আপনার Server এর Version 18.5, আর 18.6 বের হয়েছে। কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "এটা Major Upgrade, Data আলাদা Tool দিয়ে সরাতে হবে",
            isCorrect: false,
            explanation: "Major বদলায়নি, দুটোই 18। Data এর সাজানো একই থাকে।",
          },
          {
            key: "B",
            text: "Minor Release, শুধু Bug আর নিরাপত্তার সমাধান। Program বদলে Server আবার চালু করলেই হয়, আর দেরি না করাই ভালো",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL এর নিজের পরামর্শ, সবসময় নিজের Major এর সর্বশেষ Minor চালানো।",
          },
          {
            key: "C",
            text: "নতুন Feature এসেছে, তাই আগে সব Code বদলাতে হবে",
            isCorrect: false,
            explanation: "Minor এ নতুন Feature আসে না, শুধু সমাধান।",
          },
          {
            key: "D",
            text: "18.5 এর পাহারা শেষ, এখনই 19 এ যেতে হবে",
            isCorrect: false,
            explanation: "পাহারা চলে Major ধরে। 18 পাহারা পাবে 2030 এর নভেম্বর পর্যন্ত।",
          },
        ],
      },
      {
        id: 3,
        text: "Mac এ brew install postgresql@18 শেষ হলো, Server ও চালু। কিন্তু psql --version লিখলে আসে zsh: command not found: psql। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "ইনস্টল ব্যর্থ হয়েছে, আবার করতে হবে",
            isCorrect: false,
            explanation: "Server চালু আছে, তাই ইনস্টল ঠিক আছে। সমস্যা Program খোঁজার ধাপে।",
          },
          {
            key: "B",
            text: "Formula টা keg-only, তাই psql PATH এ নেই। PATH এ /opt/homebrew/opt/postgresql@18/bin যোগ করে নতুন Terminal খুলতে হবে",
            isCorrect: true,
            explanation:
              "ঠিক। command not found আসে Shell থেকে, PostgreSQL থেকে না। মানে প্রথম ধাপ, Program খোঁজা।",
          },
          {
            key: "C",
            text: "Password ভুল",
            isCorrect: false,
            explanation: "Password এর প্রশ্ন আসে Server এ পৌঁছানোর পরে। এখানে psql চালুই হয়নি।",
          },
          {
            key: "D",
            text: "Port 5432 দখল",
            isCorrect: false,
            explanation: "Port এর সমস্যায় psql চলে, কিন্তু Connect করতে পারে না। এখানে psql নিজেই নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "Homebrew এ PostgreSQL চলছে। শুধু psql লিখলে আসে FATAL: database \"rahim\" does not exist। আপনার লগইন নাম rahim। কী ঘটছে?",
        options: [
          {
            key: "A",
            text: "rahim নামের Role নেই",
            isCorrect: false,
            explanation: "Role না থাকলে Error হতো role does not exist। এখানে পরিচয়ের ধাপ পার হয়েছে।",
          },
          {
            key: "B",
            text: "Role rahim আছে, কিন্তু psql নিজে থেকে rahim নামের Database খুঁজেছে, যেটা Homebrew বানায় না। psql postgres লিখলেই হবে",
            isCorrect: true,
            explanation:
              "ঠিক। Database এর নাম না দিলে psql ব্যবহারকারীর নামটাকেই Database এর নাম ধরে নেয়। চাইলে createdb দিয়ে rahim নামের Database বানিয়েও নিতে পারেন।",
          },
          {
            key: "C",
            text: "Server বন্ধ",
            isCorrect: false,
            explanation: "FATAL এসেছে মানে Server এর সাথে কথা হয়েছে, Server চালু।",
          },
          {
            key: "D",
            text: "Homebrew Database বানাতে পারে না",
            isCorrect: false,
            explanation: "পারে। শুধু ইনস্টলের সময় আপনার নামের Database টা বানায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "Ubuntu তে psql -U postgres লিখলে আসে FATAL: Peer authentication failed for user \"postgres\"। ঠিক উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "sudo -u postgres psql, মানে OS এর postgres ব্যবহারকারী হয়ে চালানো",
            isCorrect: true,
            explanation:
              "ঠিক। Peer চায় OS এর নাম আর Role এর নাম একই হোক। sudo -u postgres দুটো নামকে মিলিয়ে দেয়।",
          },
          {
            key: "B",
            text: "PostgreSQL আবার ইনস্টল করা",
            isCorrect: false,
            explanation: "ইনস্টলে কোনো ভুল নেই। এটা ঢোকার নিয়মের ব্যাপার।",
          },
          {
            key: "C",
            text: "-p 5433 দিয়ে আবার চেষ্টা করা",
            isCorrect: false,
            explanation: "Port ঠিকই ছিল, FATAL মানে Server সাড়া দিয়েছে।",
          },
          {
            key: "D",
            text: "Password বদলানো",
            isCorrect: false,
            explanation: "Peer এ Password এর কোনো ভূমিকাই নেই, সে শুধু OS এর নাম মেলায়।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা পুরনো টিউটোরিয়াল দেখে লিখলেন docker run ... -v island-pg-data:/var/lib/postgresql/data postgres:18। কী হবে?",
        options: [
          {
            key: "A",
            text: "সব ঠিকঠাক চলবে, শুধু Data অন্য ফোল্ডারে থাকবে",
            isCorrect: false,
            explanation: "postgres:18 এই পথটা দেখে চালুই হয় না।",
          },
          {
            key: "B",
            text: "Container চালু হয়েই বন্ধ হয়ে যাবে, আর Log বলবে 18 থেকে Volume লাগাতে হবে /var/lib/postgresql এ",
            isCorrect: true,
            explanation:
              "ঠিক। 18 থেকে Image Data রাখে /var/lib/postgresql/18/docker এ, আর পুরনো পথে Mount দেখলে সে ভুল বুঝে Data হারানোর আগেই থেমে যায়।",
          },
          {
            key: "C",
            text: "Docker Volume টা মুছে দেবে",
            isCorrect: false,
            explanation: "Image কোনো Volume মোছে না। সে শুধু চালু হতে অস্বীকার করে।",
          },
          {
            key: "D",
            text: "Password ছাড়াই চালু হবে",
            isCorrect: false,
            explanation: "Password এর সাথে Volume এর পথের কোনো সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "docker run দিয়ে island-pg চালু করতে গিয়ে এল Bind for 127.0.0.1:5432 failed: port is already allocated। প্রথম কাজ কী?",
        options: [
          {
            key: "A",
            text: "কম্পিউটার Restart করা",
            isCorrect: false,
            explanation: "পুরনো Server টা সম্ভবত Service, Restart এর পর আবার চালু হবে।",
          },
          {
            key: "B",
            text: "lsof -nP -iTCP:5432 -sTCP:LISTEN দিয়ে দেখা কে 5432 ধরে আছে, তারপর হয় সেটা বন্ধ, নয়তো নতুনটাকে -p 127.0.0.1:5433:5432 দিয়ে চালানো",
            isCorrect: true,
            explanation:
              "ঠিক। আগে জানুন কে, তারপর সিদ্ধান্ত। এই ট্র্যাকের বিকল্প Port 5433।",
          },
          {
            key: "C",
            text: "Container এর ভেতরের Port 5432 বদলে 5433 করা",
            isCorrect: false,
            explanation: "দখল হয়েছে আপনার কম্পিউটারের দিকের Port। Container এর ভেতরেরটা 5432 ই থাকে, বদলাতে হয় -p এর বাম দিকেরটা।",
          },
          {
            key: "D",
            text: "Image টা আবার নামানো",
            isCorrect: false,
            explanation: "Image এ কোনো সমস্যা নেই। সমস্যা Port এ।",
          },
        ],
      },
      {
        id: 8,
        text: "নিচের কোন Error দেখলে নিশ্চিত হতে পারেন যে Server চালু আছে আর আপনার psql তার সাথে কথা বলতে পেরেছে?",
        options: [
          {
            key: "A",
            text: "zsh: command not found: psql",
            isCorrect: false,
            explanation: "এখানে psql চালুই হয়নি, Server এর প্রশ্নই আসেনি।",
          },
          {
            key: "B",
            text: "connection to server at \"127.0.0.1\", port 5432 failed: Connection refused",
            isCorrect: false,
            explanation: "Connection refused মানে ওই Port এ কেউ দরজা খোলেনি।",
          },
          {
            key: "C",
            text: "FATAL:  role \"rahim\" does not exist",
            isCorrect: true,
            explanation:
              "ঠিক। FATAL আসে Server থেকে। Server চালু, কথাও হয়েছে, শুধু rahim নামে কাউকে সে চেনে না।",
          },
          {
            key: "D",
            text: "connection to server on socket \"/tmp/.s.PGSQL.5432\" failed: No such file or directory",
            isCorrect: false,
            explanation: "Socket ফাইলটাই নেই, মানে ওখানে কোনো Server চলছে না।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "নিজের মেশিনে PostgreSQL, আর তার একটা README",
    time: "৬০-৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <>
        চারটা পথের যেকোনো একটায় PostgreSQL 18 ইনস্টল করুন। ঢুকে{" "}
        <code className={CODE}>SELECT version();</code>,{" "}
        <code className={CODE}>SHOW port;</code> আর{" "}
        <code className={CODE}>SHOW data_directory;</code> চালান, আর তিনটার Output
        রেখে দিন।
      </>,
      <>
        নিজের মেশিনের জন্য একটা ছোট টেবিল বানান: আপনার OS এর লগইন নাম, আপনার
        Superuser এর নাম, শুধু psql লিখলে কী হয়, আর কোন Command লিখলে নিশ্চিতভাবে ঢোকা
        যায়। Who You Are অংশের Query দিয়ে Superuser এর নাম যাচাই করুন।
      </>,
      <>
        ইচ্ছা করে একটা Error ঘটান আর সারান: Server বন্ধ করুন (brew services stop,
        systemctl stop বা docker stop), psql দিয়ে ঢোকার চেষ্টা করুন, Error টা লিখে
        রাখুন, চার ধাপের কোনটায় আটকেছে লিখুন, তারপর Server চালু করে pg_isready দিয়ে
        নিশ্চিত হন।
      </>,
      <>
        ভুল নাম দিয়ে ঢোকার চেষ্টা করুন, যেমন <code className={CODE}>psql -U nobody</code>{" "}
        (Docker এ TCP দিয়ে, আর অন্য পথে Socket দিয়ে)। দুটো Error এর পার্থক্য লিখুন, আর
        ব্যাখ্যা করুন কেন TCP তে Server বলে না যে Role টাই নেই।
      </>,
      <>
        নিজের my-tours Project এর README তে একটা Database অংশ লিখুন: কোন পথ, কোন
        Version, চালু আর বন্ধের Command, Password কোথা থেকে আসে (কোনো আসল Password
        লিখবেন না), কোন Port, আর সব মুছে নতুন করে শুরু করার Command।
      </>,
    ],
    deliverables: [
      "তিনটা Query র Output (version, port, data_directory)",
      "নিজের মেশিনের Default এর টেবিল",
      "ইচ্ছাকৃত Error, তার ধাপ আর সমাধানের নোট",
      "TCP আর Socket এর দুটো Error এর তুলনা",
      "README এর Database অংশ, কোনো আসল Password ছাড়া",
    ],
  },
  practicalLab: {
    title: "শূন্য থেকে চালু Server, আর ইচ্ছা করে ভেঙে আবার জোড়া",
    subtitle: "একটা পথ বেছে ইনস্টল, চার প্রশ্নে যাচাই, তারপর তিনটা Error নিজে ঘটিয়ে পড়তে শেখা",
    stepName: "ধাপ",
    steps: [
      {
        title: "Port খালি কিনা দেখুন",
        description:
          "lsof -nP -iTCP:5432 -sTCP:LISTEN (Windows এ netstat -ano | findstr :5432)। কিছু এলে এই Lab এ 5432 এর জায়গায় 5433 ব্যবহার করবেন।",
      },
      {
        title: "একটা পথে ইনস্টল করুন",
        description:
          "নিচের Code এর Docker অংশ যেকোনো OS এ চলে। Mac এ Homebrew আর Ubuntu এর অংশও দেওয়া আছে। একটাই বেছে নিন।",
      },
      {
        title: "চার প্রশ্নে যাচাই",
        description:
          "psql --version, pg_isready, ঢোকা, আর ভেতরে প্রথম SQL ফাইলের Query গুলো। Output গুলো লেসনের Verify অংশের সাথে মিলিয়ে নিন।",
      },
      {
        title: "নিজের পরিচয় দেখুন",
        description:
          "current_user আর pg_roles এর Query দিয়ে দেখুন আপনার Superuser কে। এই নামটা পরের সব লেসনে লাগবে।",
      },
      {
        title: "তিনটা Error ঘটান",
        description:
          "Server বন্ধ করে ঢোকা, ভুল Database এর নাম, আর ভুল Role। প্রতিটার প্রথম কয়েকটা শব্দ দেখে বলুন কোন ধাপে আটকেছে, তারপর সারান।",
      },
      {
        title: "পরিষ্কার করুন অথবা রেখে দিন",
        description:
          "এই Server টাই পরের লেসনগুলোতে লাগবে, তাই রেখে দেওয়াই ভালো। শুধু পরীক্ষার জন্য বানালে শেষের Code দিয়ে মুছে ফেলুন।",
      },
    ],
    codeBlocks: [
      {
        language: "bash",
        filename: "01-docker.sh (যেকোনো OS এ Docker)",
        code: `printf 'Password: '; read -rs POSTGRES_PASSWORD; echo; export POSTGRES_PASSWORD
docker volume create island-pg-data
docker run -d --name island-pg \\
  -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \\
  -p 127.0.0.1:5432:5432 \\
  -v island-pg-data:/var/lib/postgresql \\
  postgres:18
docker logs island-pg 2>&1 | grep "ready to accept"
pg_isready -h 127.0.0.1 -p 5432
docker exec -it island-pg psql -U postgres`,
      },
      {
        language: "bash",
        filename: "02-homebrew.sh (Mac)",
        code: `brew install postgresql@18
echo 'export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
brew services start postgresql@18
psql --version
pg_isready
psql postgres`,
      },
      {
        language: "bash",
        filename: "03-ubuntu.sh (Ubuntu বা Debian)",
        code: `sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt update
sudo apt install postgresql-18
sudo systemctl status postgresql
sudo -u postgres createuser --superuser "$USER"
createdb
psql`,
      },
      {
        language: "sql",
        filename: "04-first-checks.sql (psql এর ভেতরে)",
        code: `SELECT version();
SHOW server_version;
SHOW port;
SHOW data_directory;
SELECT current_user, current_database();
SELECT datname FROM pg_database ORDER BY datname;
SELECT rolname, rolsuper, rolcanlogin
FROM pg_roles
WHERE rolname !~ '^pg_'
ORDER BY rolname;`,
      },
      {
        language: "bash",
        filename: "05-break-and-fix.sh (Docker উদাহরণ)",
        code: `# এক: Server বন্ধ করে ঢোকার চেষ্টা, ধাপ দুই এ আটকাবে
docker stop island-pg
psql -h 127.0.0.1 -U postgres        # Connection refused
docker start island-pg

# দুই: ভুল Database, ধাপ চার এ আটকাবে
docker exec -it island-pg psql -U postgres -d island_tours   # database does not exist

# তিন: ভুল Role, ধাপ তিন এ আটকাবে
docker exec -it island-pg psql -U rahim                      # role does not exist
psql -h 127.0.0.1 -U rahim                                    # password authentication failed`,
      },
      {
        language: "bash",
        filename: "06-cleanup.sh (শুধু মুছে ফেলতে চাইলে, Data ফেরত আসবে না)",
        code: `# Docker
docker rm -f island-pg
docker volume rm island-pg-data

# Mac Homebrew
brew services stop postgresql@18
brew uninstall postgresql@18`,
      },
    ],
    tip: (
      <ContentParagraph>
        Error গুলো ঘটানোর সময় প্রতিটার পুরো লেখা কপি করে একটা নোটে রাখুন, পাশে লিখুন
        কোন ধাপ আর কী সমাধান। এই নোটটাই আপনার প্রথম Troubleshooting গাইড, আর এই
        মডিউলের শেষ লেসনে Error পড়া নিয়ে আরও গভীরে যাবেন।
      </ContentParagraph>
    ),
  },
};
