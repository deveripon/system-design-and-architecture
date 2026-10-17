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
  ClientCommandLab,
  ConnectTroubleLab,
  InstallPathLab,
} from "../../../components/course/topics/sql-setup/install-mysql-animations";
import {
  InlineReferenceTrapDiagram,
  MysqlPartsDiagram,
  SocketVsTcpSplit,
  TwoServersDiagram,
} from "../../../components/course/topics/sql-setup/install-mysql-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] text-foreground";

export const installMysqlContent: TopicData = {
  id: "install-mysql",
  introduction: {
    badge: "MODULE 02 · LESSON 02",
    title: (
      <SectionTitle>MySQL ইনস্টল: দ্বিতীয় একটা ভাষার জন্য দ্বিতীয় একটা Server</SectionTitle>
    ),
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনার মেশিনে PostgreSQL চালু হয়েছে। এই ট্র্যাকের সব কাজ তার
          উপরেই চলবে। তবু অনেকেই PostgreSQL এর পাশাপাশি একটা MySQL ও চালাতে চান।
          কেউ MySQL দিয়ে বানানো কোনো ভিডিও কোর্স দেখছেন আর শিক্ষক যা টাইপ করেন
          হুবহু তা-ই টাইপ করে দেখতে চান। কারো অফিসের প্রজেক্ট MySQL এ চলে। কারো
          প্রথম চাকরির Interview তে MySQL এর প্রশ্ন আসবে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই দ্বিতীয় Server টার জন্য। শেষে আপনি জানবেন MySQL ইনস্টল করলে
          মেশিনে আসলে কী কী আসে, কোন Version নেবেন, macOS, Windows, Ubuntu আর
          Docker, চারভাবে কীভাবে ইনস্টল করবেন, প্রথমবার কীভাবে ঢুকবেন, localhost আর
          127.0.0.1 কেন MySQL এর কাছে দুটো আলাদা রাস্তা, Island Tours এর Database
          টা MySQL এ কীভাবে Load করবেন, আর PostgreSQL আর MySQL কে একই মেশিনে
          পাশাপাশি চালিয়ে কীভাবে একটার উত্তর আরেকটার সাথে মেলাবেন। লেসনের প্রতিটা
          MySQL Output একটা আসল MySQL 8.4 Server থেকে তোলা।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা ভাষা ভালো করে শিখে নিলে দ্বিতীয় ভাষাটা আর নতুন করে শিখতে হয় না, শুধু উচ্চারণ আর কয়েকটা শব্দ আলাদা করে চিনে নিতে হয়।",
      author: "MySQL",
      role: "Lesson 02",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>ভিডিওর শিক্ষক লিখলেন mysql, আপনার Terminal বলল চিনি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রাত দশটা। আপনি একটা SQL ভিডিও কোর্স চালিয়ে বসেছেন। শুরুর দিকেই শিক্ষক
                তাঁর Terminal খুলে লিখলেন <code className={CODE}>mysql -u root -p</code>,
                একটা Password দিলেন, আর পর্দায় এল একটা স্বাগত বার্তা আর একটা{" "}
                <code className={CODE}>mysql&gt;</code> Prompt। আপনিও আপনার Terminal
                এ হুবহু একই লাইন লিখলেন। উত্তর এল এক লাইনে:{" "}
                <code className={CODE}>zsh: command not found: mysql</code>।
              </ContentParagraph>
              <ContentParagraph>
                অথচ আপনার মেশিনে তো Database আছে, আগের লেসনেই PostgreSQL ইনস্টল
                করেছেন। সমস্যাটা কোথায়? সমস্যা হলো, PostgreSQL আর MySQL দুটো
                আলাদা Program। Lesson 05 এর সেই উদাহরণটা মনে করুন: SQL একটা ভাষা,
                আর PostgreSQL আর MySQL সেই ভাষায় কথা বলা দুটো আলাদা মানুষ। একজনকে
                বাসায় এনে রাখলে আরেকজন নিজে থেকে চলে আসেন না।{" "}
                <code className={CODE}>mysql</code> হলো MySQL এর Client Program, আর
                আপনার মেশিনে সেটা নেই, কারণ আপনি কখনো MySQL ইনস্টল করেননি।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে প্রথম প্রশ্ন: আপনার কি আসলেই MySQL দরকার? উত্তরটা নির্ভর করে
                আপনি কী করতে চান তার উপর। নিচের টেবিলে তিনটা সাধারণ অবস্থা আর প্রতিটায়
                এই ট্র্যাকের পরামর্শ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["আপনার অবস্থা", "MySQL ইনস্টল করবেন?", "কেন"],
          rows: [
            [
              "শুধু এই ট্র্যাক ধরে শিখছেন",
              "দরকার নেই",
              "সব লেসন, সব Query বক্স আর সব Assignment PostgreSQL এ। এই লেসনটা পড়ে রাখুন, ইনস্টল পরে করলেও চলবে।",
            ],
            [
              "MySQL দিয়ে বানানো একটা ভিডিও বা বই ফলো করছেন",
              "চাইলে করুন",
              "হুবহু একই Command চালিয়ে একই Output দেখা আত্মবিশ্বাস বাড়ায়। তবে অনুবাদ করে PostgreSQL এ চালানোর অভ্যাসও সমান কাজের, এই লেসনের শেষে দুটোই দেখবেন।",
            ],
            [
              "অফিস, ক্লায়েন্ট বা Interview তে MySQL লাগবে",
              "অবশ্যই করুন",
              "যে Database এ কাজ করবেন, সেটা নিজের মেশিনে চালিয়ে হাত পাকানোর বিকল্প নেই।",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মূল ভাষা একটাই থাকবে",
          content: (
            <ContentParagraph>
              MySQL ইনস্টল করলেও এই ট্র্যাকের মূল Database PostgreSQL ই থাকবে। MySQL
              আপনার দ্বিতীয় ভাষা, যাতে কোনো MySQL কোর্স, প্রজেক্ট বা প্রশ্ন সামনে এলে
              আপনি থমকে না যান। দুটো একসাথে চালালে একটা বাড়তি লাভও আছে: একই প্রশ্ন দুই
              জায়গায় চালিয়ে দেখবেন কোথায় দুটো এক আর কোথায় আলাদা, আর সেই তুলনা থেকেই
              SQL এর Standard অংশটা সবচেয়ে ভালো চেনা যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-gets-installed",
      subHeader: { index: "002", title: "What Gets Installed" },
      title: <SectionTitle>ইনস্টল মানে একটা না, পাঁচটা জিনিস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ইনস্টলের বোতাম চাপার আগে জেনে নিন কী আসছে, কারণ পরে প্রায় সব সমস্যাই এই
                টুকরোগুলোর কোনো একটাকে চিনতে না পারা থেকে আসে। একটা রেস্টুরেন্টের কথা
                ভাবুন। রান্নাঘরে একজন রাঁধুনি সারাক্ষণ কাজ করেন, ভাঁড়ারে মাল থাকে,
                সামনে ওয়েটার অর্ডার নিয়ে যান, আর একজন ম্যানেজার সকালে দোকান খোলেন।
                MySQL এর পাঁচটা টুকরোও ঠিক এমন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>mysqld, রান্নাঘরের রাঁধুনি।</strong> আসল Server Process। নামের
                  শেষের d মানে Daemon, অর্থাৎ পেছনে সারাক্ষণ চালু থাকা Program। সে
                  একটা Port এ অপেক্ষা করে, MySQL এর জন্য সাধারণত 3306, আর প্রতিটা প্রশ্নের
                  উত্তর তৈরি করে। Port কী, সেটা মনে না থাকলে DevOps ট্র্যাকের{" "}
                  <Link href="/devops/topic/port-and-socket" className={LINK}>
                    Port আর Socket লেসনটা
                  </Link>{" "}
                  একবার দেখে নিন।
                </ListItem>
                <ListItem>
                  <strong>Data Directory, ভাঁড়ার।</strong> Disk এর একটা Folder, যেখানে
                  mysqld আপনার Table আর Row এর ফাইল রাখে। Homebrew এ সেটা{" "}
                  <code className={CODE}>/opt/homebrew/var/mysql</code>, Docker এর ভেতরে{" "}
                  <code className={CODE}>/var/lib/mysql</code>। এই ফাইল কখনো নিজে হাতে
                  খুলে বদলাবেন না, Module 01 এর Lesson 02 তে দেখেছেন কেন।
                </ListItem>
                <ListItem>
                  <strong>Client Program, ওয়েটার।</strong> সবচেয়ে বেশি লাগবে{" "}
                  <code className={CODE}>mysql</code>, যেটা দিয়ে আপনি প্রশ্ন পাঠান আর উত্তর
                  দেখেন। সাথে আসে <code className={CODE}>mysqladmin</code>, Server চালু
                  আছে কিনা দেখা বা বন্ধ করার জন্য, আর{" "}
                  <code className={CODE}>mysqldump</code>, Backup নেওয়ার জন্য, যেটা Module
                  18 এ বিস্তারিত।
                </ListItem>
                <ListItem>
                  <strong>root Account, দোকানের মালিক।</strong> প্রথম User, যার সব
                  ক্ষমতা আছে। এর Password কীভাবে বসবে, সেটা ইনস্টলের পথ অনুযায়ী আলাদা, আর
                  এই লেসনের বড় একটা অংশ সেটা নিয়েই।
                </ListItem>
                <ListItem>
                  <strong>Service, সকালে দোকান খোলার ম্যানেজার।</strong> যে ব্যবস্থাটা
                  মেশিন চালু হলে mysqld কে চালু করে। macOS এ{" "}
                  <code className={CODE}>brew services</code>, Windows এ MySQL84 নামের
                  একটা Windows Service, Ubuntu তে mysql.service। Docker এ এই কাজটা করে
                  Docker নিজেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MysqlPartsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগের লেসনে PostgreSQL ইনস্টলের সময় আপনি ঠিক এই পাঁচটা টুকরোই দেখেছেন, শুধু
              নাম আলাদা ছিল। পাশাপাশি রাখলে চেনা সহজ হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["টুকরো", "PostgreSQL", "MySQL"],
          rows: [
            ["Server Process", "postgres", "mysqld"],
            ["Default Port", "5432", "3306 (আর X Protocol এর জন্য 33060)"],
            ["প্রধান Client", "psql", "mysql"],
            ["প্রথম Superuser", "postgres", "root"],
            ["Backup Program", "pg_dump", "mysqldump"],
            ["চালু আছে কিনা দেখা", "pg_isready", "mysqladmin ping"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "33060 টা কী",
          content: (
            <ContentParagraph>
              MySQL 8.4 চালু হলে দুটো Port খোলে: 3306 সাধারণ SQL Connection এর জন্য, আর
              33060 X Protocol নামের একটা আলাদা ব্যবস্থার জন্য, যেটা MySQL Shell এর মতো
              কিছু নতুন Tool ব্যবহার করে। এই ট্র্যাকে আপনার শুধু 3306 লাগবে। Container
              এর Log এ দুটো Port এর কথাই দেখবেন, তাই নামটা চিনে রাখুন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "which-version",
      subHeader: { index: "003", title: "Which Version" },
      title: <SectionTitle>8.4 LTS, 9 এর Innovation, Ubuntu এর 8.0 আর MariaDB</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                MySQL এর Download পাতায় গেলে একসাথে কয়েকটা Version দেখবেন, আর অনেকে এখানেই
                দ্বিধায় পড়েন। ব্যাপারটা আসলে সহজ। ২০২৩ সাল থেকে MySQL দুটো আলাদা ধারায়
                Release হয়, অনেকটা মোবাইল ফোনের মতো: একটা মডেল বছরের পর বছর Update পায়, আর
                আরেকটা প্রতি কয়েক মাসে নতুন Feature নিয়ে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>LTS (Long-Term Support):</strong> স্থির, দীর্ঘমেয়াদি। একটা LTS
                  Series এর ভেতরে শুধু দরকারি Fix আসে, কোনো Feature সরানো হয় না। MySQL এর
                  Docs অনুযায়ী LTS পায় পাঁচ বছরের Premier Support আর তিন বছরের Extended
                  Support। এখনকার LTS হলো 8.4, যার প্রথম Release 8.4.0 এসেছিল ৩০ এপ্রিল
                  ২০২৪ এ। এই লেখার সময় সর্বশেষ 8.4.11।
                </ListItem>
                <ListItem>
                  <strong>Innovation:</strong> নতুন Feature আগে আসে, কিন্তু আচরণও বদলাতে
                  পারে, আর প্রতিটা Release এর Support চলে পরের Innovation Release আসা পর্যন্ত।
                  MySQL 9 এর Innovation Series শুরু হয়েছিল ১ জুলাই ২০২৪ এ 9.0.0 দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>8.0:</strong> আগের দীর্ঘদিনের Version, এখনো চালু আছে অনেক জায়গায়।
                  Ubuntu 24.04 এর নিজের Package Repository তে mysql-server আসলে 8.0, এই লেখার
                  সময় 8.0.46।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ট্র্যাকের পরামর্শ: <strong>MySQL 8.4 LTS</strong>। শেখার জন্য স্থির
                Version ই ভালো, যাতে আজকের Command আর কাল বদলে না যায়। Ubuntu তে থাকলে
                8.0 পেলেও এই ট্র্যাকের সব উদাহরণ চলবে, কারণ আমাদের ফাইলে 8.0 আর 8.4 এর
                মধ্যে কোনো পার্থক্য ছোঁয়া হয়নি। তবে একই Version পেতে চাইলে Ubuntu তেও
                MySQL এর নিজের Repository থেকে 8.4 নেওয়ার পথটা নিচে আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MariaDB দেখতে MySQL এর মতো, কিন্তু MySQL না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                ২০০৯ সালে, Oracle যখন Sun Microsystems কে কিনে নিচ্ছিল (আর সেই সূত্রে
                MySQL ও), তখন MySQL এর মূল নির্মাতাদের কয়েকজন MySQL এর Code থেকে একটা
                আলাদা শাখা বের করেন, যার নাম MariaDB। শুরুতে এটা MySQL এর জায়গায় হুবহু
                বসিয়ে দেওয়ার মতো ছিল, কিন্তু বছরের পর বছর আলাদা উন্নয়নে দুটো এখন বেশ
                কিছু Feature, লেখার নিয়ম আর আচরণে আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                ফাঁদটা হলো নাম। Debian এ{" "}
                <code className={CODE}>default-mysql-server</code> নামের Package আসলে
                MariaDB ইনস্টল করে। তাই কোনো Linux এ mysql লিখে ঢোকার পর স্বাগত বার্তায়
                MariaDB লেখা দেখলে বুঝবেন আপনি MySQL না, তার আত্মীয়ের সাথে কথা বলছেন। এই
                লেসনের প্রায় সব কিছু সেখানেও চলবে, কিন্তু সব না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "passwords-first",
      subHeader: { index: "004", title: "Passwords First" },
      title: <SectionTitle>ইনস্টলের আগে একটা অভ্যাস: Password কখনো Command এ না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেক টিউটোরিয়ালে দেখবেন এমন লাইন:{" "}
                <code className={CODE}>mysql -u root -pmypassword</code>, অর্থাৎ -p এর
                ঠিক পরে Password লিখে দেওয়া। চলে ঠিকই, কিন্তু অভ্যাসটা বিপজ্জনক। তিনটা
                কারণে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Shell History:</strong> আপনার Terminal প্রতিটা Command একটা ফাইলে
                  লিখে রাখে, যাতে উপরের তীর চাপলে আগের Command ফিরে আসে। Password সহ Command
                  মানে Password টাও সেই ফাইলে, সাদা লেখায়।
                </ListItem>
                <ListItem>
                  <strong>Screenshot আর Screen Share:</strong> Terminal এর ছবি কাউকে
                  পাঠালেন বা মিটিংয়ে Screen দেখালেন, Password ও সাথে চলে গেল।
                </ListItem>
                <ListItem>
                  <strong>Git:</strong> Command টা কোনো Script বা README তে কপি করলেন, আর
                  সেটা Push হয়ে গেল একটা Public Repository তে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                MySQL নিজেও এটা নিয়ে সতর্ক করে। Command Line এ Password দিলে প্রতিবার এই
                লাইনটা দেখাবে, এই লেসনের Container এ হুবহু যেমন এসেছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql এর নিজের সতর্কবার্তা",
          code: `mysql: [Warning] Using a password on the command line interface can be insecure.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে উপায় কী? দুটো সহজ নিয়ম, যেগুলো এই পুরো Module এ মেনে চলা হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Client এ শুধু -p, পাশে কিছু না।</strong>{" "}
                  <code className={CODE}>mysql -u root -p</code> লিখলে MySQL নিজে জিজ্ঞেস
                  করে <code className={CODE}>Enter password:</code>, আর আপনি যা টাইপ করেন
                  তা স্ক্রিনেও দেখায় না, History তেও যায় না।
                </ListItem>
                <ListItem>
                  <strong>যেখানে কোনো Program কে Password আগে থেকে দিতে হয়</strong> (যেমন
                  Docker এ Server বানানোর সময়), সেখানে Password থাকে একটা Environment
                  Variable এ, আর Variable টা ভরা হয় চুপচাপ টাইপ করে। Environment Variable
                  মানে Shell এর ভেতরে রাখা একটা নাম দেওয়া মান, যেটা ওই Shell থেকে চালানো
                  Program গুলো পড়তে পারে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "macOS আর Linux (zsh বা bash)",
          code: `# read -s মানে চুপচাপ পড়া: যা টাইপ করবেন, স্ক্রিনে কিছুই দেখাবে না।
# টাইপ শেষে Enter চাপুন।
read -s MYSQL_ROOT_PASSWORD

# এই Shell থেকে চালানো Program গুলো যাতে মানটা পায়
export MYSQL_ROOT_PASSWORD

# ঠিকমতো বসেছে কিনা দেখুন, মান না দেখিয়ে শুধু দৈর্ঘ্য
echo \${#MYSQL_ROOT_PASSWORD}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "Windows PowerShell",
          code: `# Read-Host টাইপ করা মানটা Variable এ রাখে। History তে থাকে শুধু এই লাইনটা,
# আপনার টাইপ করা Password না।
$env:MYSQL_ROOT_PASSWORD = Read-Host "MySQL root password"`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Variable টা শুধু এই Terminal এর",
          content: (
            <ContentParagraph>
              এভাবে বসানো Variable সেই Terminal জানালা বন্ধ করলেই হারিয়ে যায়। এটা ইচ্ছাকৃত:
              Password কোথাও ফাইলে লেখা থাকল না। নতুন Terminal এ আবার লাগলে আবার{" "}
              <code className={CODE}>read -s</code> চালাবেন। Password টা নিজে কোনো Password
              Manager এ রেখে দিন, যাতে ভুলে না যান।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "macos",
      subHeader: { index: "005", title: "macOS" },
      title: <SectionTitle>macOS: Homebrew দিয়ে mysql@8.4</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগের লেসনে PostgreSQL এর জন্য যদি Homebrew ব্যবহার করে থাকেন, তাহলে MySQL
                এর পথটাও প্রায় একই। Homebrew হলো macOS এর জন্য একটা Package Manager,
                মানে এমন একটা Program যে অন্য Program নামিয়ে ঠিক জায়গায় বসিয়ে দেয়।
                MySQL 8.4 এর জন্য তার Formula এর নাম <code className={CODE}>mysql@8.4</code>,
                এই লেখার সময় Version 8.4.11।
              </ContentParagraph>
              <ContentParagraph>
                একটা শব্দ আগে পরিষ্কার করে নিই: <strong>Keg-only</strong>। Homebrew একই
                Program এর একাধিক Version রাখতে দেয়, তাই @8.4 এর মতো Version লাগানো Formula
                গুলো সে নিজে থেকে আপনার PATH এ বসায় না, যাতে অন্য Version এর সাথে ঝগড়া না
                বাধে। PATH হলো Folder এর একটা তালিকা, যেখানে Shell কোনো Command এর
                Program খোঁজে। তাই ইনস্টলের পর একটা লাইন যোগ করতে হবে, নইলে ঠিক সেই
                command not found আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ইনস্টল",
              description:
                "Terminal এ brew install mysql@8.4 চালান। Homebrew দরকারি সব জিনিস সহ MySQL নামাবে। শেষে কিছু সতর্কবার্তা আর পরামর্শ দেখাবে, সেগুলো পড়ুন।",
            },
            {
              title: "PATH এ যোগ",
              description:
                "নিচের কোডের দ্বিতীয় লাইনটা আপনার ~/.zshrc ফাইলে MySQL এর bin Folder এর ঠিকানা যোগ করে। brew --prefix নিজেই সঠিক ঠিকানা বলে দেয়, Apple Silicon আর পুরনো Intel Mac দুটোতেই। তারপর source ~/.zshrc চালিয়ে বর্তমান Terminal কে নতুন PATH চেনান।",
            },
            {
              title: "Server চালু",
              description:
                "brew services start mysql@8.4 চালান। এতে mysqld এখন চালু হয়, আর প্রতিবার Login করলে নিজে থেকে চালু হবে। শুধু আজকের জন্য চাইলে Homebrew এর দেখানো mysqld_safe এর পথটা আছে, কিন্তু শেখার জন্য Service ই সুবিধার।",
            },
            {
              title: "প্রথমবার ঢোকা",
              description:
                "Homebrew এর নিজের কথায়, root এর কোনো Password ছাড়াই MySQL ইনস্টল হয়েছে। তাই প্রথমবার mysql -u root দিয়েই ঢোকা যায়। ঢুকে SELECT VERSION(); চালিয়ে দেখুন 8.4 লেখা আসে কিনা, তারপর exit।",
            },
            {
              title: "নিরাপদ করা",
              description:
                "mysql_secure_installation চালান। এটা কয়েকটা প্রশ্ন করে: root এর Password বসানো, বাইরের মেশিন থেকে root এর ঢোকা বন্ধ করা, নাম ছাড়া Anonymous User মুছে ফেলা, আর test নামের Database সরানো। শেখার মেশিনেও সবগুলোয় হ্যাঁ বলুন, অভ্যাসটা পরে Production এ কাজে লাগবে।",
            },
            {
              title: "এবার Password দিয়ে",
              description:
                "এখন থেকে mysql -u root -p দিয়ে ঢুকবেন, Password চাইলে টাইপ করবেন। Password ছাড়া mysql -u root দিলে এবার ERROR 1045 আসবে, আর সেটাই ঠিক।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "macOS · Homebrew",
          code: `# ১. ইনস্টল
brew install mysql@8.4

# ২. PATH এ MySQL এর bin Folder (একবারই করতে হয়)
echo "export PATH=\\"$(brew --prefix mysql@8.4)/bin:\\$PATH\\"" >> ~/.zshrc
source ~/.zshrc

# ৩. Server চালু, আর প্রতিবার Login এ নিজে থেকে চালু
brew services start mysql@8.4

# ৪. চালু হলো কিনা
mysql --version
mysqladmin -u root ping        # উত্তর আসবে: mysqld is alive

# ৫. root এর Password বসানো আর বাকি নিরাপত্তা
mysql_secure_installation

# ৬. এখন থেকে এভাবে ঢুকবেন
mysql -u root -p`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Homebrew নিজে যে দুটো কথা বলে রাখে",
          content: (
            <ContentList>
              <ListItem>
                আগের কোনো MySQL ইনস্টল থেকে <code className={CODE}>/etc/my.cnf</code> বা{" "}
                <code className={CODE}>/etc/mysql/my.cnf</code> নামের Config ফাইল থেকে গেলে
                নতুন Server চালু হতে বাধা পেতে পারে। Server চালু না হলে প্রথমে এই দুটো ফাইল
                আছে কিনা দেখুন।
              </ListItem>
              <ListItem>
                Homebrew এর MySQL শুরুতে শুধু নিজের মেশিন থেকে Connection নেয়। শেখার জন্য
                ঠিক এটাই চাই।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>বন্ধ করা আর সরানো।</strong> কিছুদিন MySQL না লাগলে{" "}
                <code className={CODE}>brew services stop mysql@8.4</code> চালান, এতে মেশিন
                চালু হলে আর নিজে থেকে চালু হবে না। পুরোপুরি সরাতে চাইলে তারপর{" "}
                <code className={CODE}>brew uninstall mysql@8.4</code>। মনে রাখবেন,
                Uninstall Program সরায়, Data Directory না। আপনার Data থাকে{" "}
                <code className={CODE}>/opt/homebrew/var/mysql</code> এ, সেটা আলাদা ফাইল।
                সেটা মুছবেন কিনা ভেবেচিন্তে ঠিক করুন, কারণ মুছলে আর ফেরত আসে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Homebrew পছন্দ না হলে।</strong> MySQL এর নিজের একটা macOS Installer
                আছে, DMG ফাইল, যেটা অন্য যেকোনো Mac App এর মতো Next চেপে চেপে ইনস্টল হয়।
                ইনস্টলের শেষে সেটা root এর Password জিজ্ঞেস করে আর System Settings এ একটা
                MySQL এর পাতা যোগ করে, যেখান থেকে Server চালু বন্ধ করা যায়। এই পথে Program
                গুলো বসে <code className={CODE}>/usr/local/mysql/bin</code> এ, তাই PATH এ
                সেই Folder টা যোগ করতে হবে। দুই পথ একসাথে নেবেন না, তাহলে দুটো Server একই
                Port এর জন্য লড়বে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "windows",
      subHeader: { index: "006", title: "Windows" },
      title: <SectionTitle>Windows: MSI আর MySQL Configurator</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Windows এ MySQL 8.4 এর অফিসিয়াল পথ দুই ধাপের। প্রথমে একটা MSI ফাইল চালান,
                যেটা Program গুলো বসায়। MSI হলো Windows এর নিজস্ব ইনস্টল ফাইলের ধরন, যেটা
                Next চাপতে চাপতে শেষ হয়। তারপর সেই MSI নিজেই MySQL Configurator নামের একটা
                ছোট Program চালু করতে বলে, যেটা Server কে প্রথমবারের মতো সাজিয়ে দেয়: Port,
                root এর Password, Windows Service। MySQL এর Docs নিজেই বলে, Configurator না
                চালানো পর্যন্ত Server চালু হবে না, তাই MSI শেষ হলেই চালিয়ে দিন।
              </ContentParagraph>
              <ContentParagraph>
                পুরনো টিউটোরিয়ালে MySQL Installer নামের একটা আলাদা বড় Program দেখতে পারেন,
                যেখান থেকে অনেকগুলো জিনিস একসাথে বেছে নেওয়া যেত। 8.4 এর জন্য MySQL এর
                Manual যে পথটা সুপারিশ করে, সেটা এই MSI আর Configurator। স্ক্রিনে কোনো
                বোতামের নাম একটু আলাদা দেখালে স্ক্রিনটাই মানুন, কারণ এই ধাপগুলো Docs থেকে
                নেওয়া, এই লেসনের জন্য কোনো Windows মেশিনে চালানো হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "MSI নামানো",
              description:
                "dev.mysql.com/downloads/mysql এ যান। Version হিসেবে 8.4 LTS আর Operating System হিসেবে Microsoft Windows বেছে নিন, তারপর MSI Installer টা নামান। ফাইলের নাম হবে mysql-8.4 দিয়ে শুরু আর .msi দিয়ে শেষ।",
            },
            {
              title: "MSI চালানো",
              description:
                "নামানো ফাইলটা চালান আর প্রস্তাবিত বিকল্পগুলো রেখে এগিয়ে যান। Custom বেছে নিলে ইনস্টলের জায়গা বদলানো যায়, না বদলালে Program বসবে C:\\Program Files\\MySQL\\MySQL Server 8.4 এ। শেষে MySQL Configurator চালাতে বলবে, হ্যাঁ বলুন।",
            },
            {
              title: "Type and Networking",
              description:
                "Server Configuration Type হিসেবে Development বেছে নিন, MySQL এর Docs এর ভাষায় যেটা আপনার নিজের কাজের কম্পিউটারের জন্য আর সবচেয়ে কম Memory নেয়। TCP/IP চালু থাকুক আর Port থাকুক 3306। এই মেশিনে আগে থেকে কোনো MySQL বা MariaDB চললে এখানে অন্য Port দিন, যেমন 3307, আর সেটা লিখে রাখুন।",
            },
            {
              title: "Accounts and Roles",
              description:
                "এখানে root এর Password ঠিক করবেন, এটা বাধ্যতামূলক। Password টা দুইবার লেখার সময় Configurator জানাবে সেটা কতটা শক্ত। শক্ত একটা দিন আর Password Manager এ রেখে দিন। এই পাতা থেকে বাড়তি User ও বানানো যায়, এখন দরকার নেই।",
            },
            {
              title: "Windows Service",
              description:
                "MySQL কে একটা Windows Service হিসেবে চালানোর ঘর বাছাই করা থাকে, থাকুক। Service এর নাম MySQL84, আর Windows চালু হলে নিজে থেকে চালু হওয়ার ঘরটাও থাকুক।",
            },
            {
              title: "বাকি পাতা",
              description:
                "Server File Permissions, Logging Options আর Advanced Options যেমন আছে রেখে এগিয়ে যান। Sample Databases পাতায় MySQL এর নিজের দুটো নমুনা Database এর প্রস্তাব থাকবে, sakila আর world। চাইলে নিতে পারেন, তবে এই ট্র্যাকের জন্য আমাদের Island Tours ই যথেষ্ট।",
            },
            {
              title: "Apply Configuration",
              description:
                "Apply Configuration পাতায় Execute চাপুন। Configurator একটা একটা করে কাজগুলো সারবে, আর প্রতিটা সফল হলে তার পাশের চিহ্ন সবুজ টিক হয়ে যাবে। কোনোটা আটকালে Log ট্যাবে কারণ লেখা থাকে। সব সবুজ হলে শেষ করুন।",
            },
            {
              title: "PATH আর যাচাই",
              description:
                "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin Folder টা PATH এ যোগ করুন (Start Menu এ Environment Variables লিখে খুঁজুন, তারপর Path এ নতুন লাইন)। একটা নতুন PowerShell খুলে mysql --version চালান, তারপর mysql -u root -p।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "Windows · PowerShell, ইনস্টলের পর",
          code: `# নতুন PowerShell জানালায়, PATH ঠিক হওয়ার পর
mysql --version
mysql -u root -p

# Service চালু আছে কিনা দেখা, বন্ধ করা, আবার চালু করা
Get-Service MySQL84
Stop-Service MySQL84
Start-Service MySQL84`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই মেশিনে একাধিক MySQL থাকলে PATH এ কোনোটাই না",
          content: (
            <ContentParagraph>
              MySQL এর Manual একটা সতর্কতা দেয়: একই Windows মেশিনে একাধিক MySQL Server চালালে
              bin Folder PATH এ যোগ করবেন না, কারণ তখন mysql লিখলে কোনটা চলবে বোঝা যায় না।
              সেক্ষেত্রে প্রতিবার পুরো ঠিকানা লিখে চালান, যেমন{" "}
              <code className={CODE}>
                &quot;C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql&quot; -u root -p
              </code>
              । PATH বদলানোর সময়ও সাবধান: আগের কোনো লাইন মুছে ফেললে অন্য Program কাজ করা বন্ধ
              করতে পারে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "linux",
      subHeader: { index: "007", title: "Ubuntu and Debian" },
      title: <SectionTitle>Ubuntu আর Debian: দুটো পথ, দুটো আলাদা root</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Linux এ সবচেয়ে সহজ পথ হলো Distribution এর নিজের Package। Ubuntu এর অফিসিয়াল
                Server Docs ঠিক এই পথটাই দেখায়। কিন্তু দুটো জিনিস জেনে নিন। প্রথমত, Ubuntu
                24.04 এ এই পথে আসে MySQL 8.0, 8.4 না। দ্বিতীয়ত, এখানে root Password দিয়ে
                ঢোকেই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "পথ ১ · Ubuntu এর নিজের Package (MySQL 8.0)",
          code: `sudo apt update
sudo apt install mysql-server

# ইনস্টল শেষে Server নিজে থেকেই চালু হয়। দেখে নিন:
sudo service mysql status
# ● mysql.service - MySQL Community Server ... active (running)

# root ঢোকে sudo দিয়ে, Password ছাড়া
sudo mysql -u root`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনটা অদ্ভুত লাগতে পারে: Password ছাড়াই root? Ubuntu এর Docs এর ব্যাখ্যা
                হলো, এখানে MySQL এর root কে চেনা হয় <strong>auth_socket</strong> দিয়ে। মানে
                MySQL Password জিজ্ঞেস করে না, বরং দেখে আপনি Linux এর root User হিসেবে চালাচ্ছেন
                কিনা। sudo ঠিক সেটাই করে। ফলে এই মেশিনে{" "}
                <code className={CODE}>mysql -u root -p</code> দিয়ে যতই সঠিক Password দিন না
                কেন, ERROR 1045 আসবে, কারণ এখানে Password দিয়ে চেনার ব্যবস্থাই নেই। ভিডিওতে
                শিক্ষক -p দিয়ে ঢুকলেও আপনি এখানে sudo দিয়ে ঢুকবেন, আর বাকি সব একই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>পথ ২, MySQL এর নিজের APT Repository।</strong> 8.4 চাইলে এই পথ। APT হলো
                Ubuntu আর Debian এর Package Manager, আর Repository মানে Package এর একটা উৎস। MySQL
                নিজে একটা উৎস রাখে, যেটা যোগ করতে একটা ছোট .deb ফাইল ইনস্টল করতে হয়, যার নাম
                mysql-apt-config। সেটা ইনস্টলের সময় একটা মেনু আসে, যেখানে আপনি বেছে নেন কোন
                Series চান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "পথ ২ · MySQL APT Repository (MySQL 8.4 LTS)",
          code: `# ১. dev.mysql.com/downloads/repo/apt থেকে mysql-apt-config এর .deb নামান।
#    ফাইলের নামে Version থাকে, নিচের নামটা আপনার ফাইলের নাম দিয়ে বদলে নিন।
sudo dpkg -i mysql-apt-config_w.x.y-z_all.deb
#    যে মেনু আসবে, সেখানে MySQL Server হিসেবে mysql-8.4-lts বেছে নিয়ে Ok।

# ২. নতুন উৎসের তালিকা পড়া, এটা বাদ দেওয়া যাবে না
sudo apt-get update

# ৩. MySQL Server ইনস্টল। এবার root এর Password চাইবে।
sudo apt-get install mysql-server

# ৪. যাচাই
mysql --version
mysql -u root -p`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Password এর ঘর খালি রাখলে কী হয়",
          content: (
            <ContentParagraph>
              MySQL এর Docs অনুযায়ী এই পথে ইনস্টলের সময় root এর Password এর ঘর খালি রাখলে
              পথ ১ এর মতোই Socket দিয়ে চেনা চালু হয়, আর পরে{" "}
              <code className={CODE}>mysql_secure_installation</code> দিয়ে Password বসানো
              যায়। পরে কখনো অন্য Series এ যেতে চাইলে{" "}
              <code className={CODE}>sudo dpkg-reconfigure mysql-apt-config</code> চালিয়ে
              মেনুটা আবার পাবেন, তারপর <code className={CODE}>sudo apt-get update</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Debian এ নামের ফাঁদ",
          content: (
            <ContentParagraph>
              Debian এ <code className={CODE}>apt install default-mysql-server</code> চালালে
              MySQL না, MariaDB ইনস্টল হয়, কারণ সেই Package টা MariaDB এর উপর নির্ভর করে।
              Debian এ আসল MySQL চাইলে পথ ২ ব্যবহার করুন। Ubuntu 24.04 এ এই একই নামের
              Package MySQL 8.0 ই আনে, তাই দুই Distribution এ একই নাম দুই রকম কাজ করে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "docker",
      subHeader: { index: "008", title: "Docker" },
      title: <SectionTitle>Docker: এক Command এ MySQL, Island Tours সহ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার মেশিনে Docker থাকলে MySQL চালানোর সবচেয়ে পরিষ্কার পথ এটাই। Docker
                একটা Program কে তার দরকারি সবকিছু সহ একটা আলাদা বাক্সে চালায়, যার নাম
                Container। MySQL এর কোনো ফাইল আপনার মেশিনের সাধারণ জায়গায় ছড়িয়ে পড়ে না,
                আর কাজ শেষে এক Command এ সব মুছে ফেলা যায়। এই লেসনের প্রতিটা MySQL Output
                ঠিক এই পথে, অফিসিয়াল <code className={CODE}>mysql:8.4</code> Image থেকে
                চালানো একটা Container এ তোলা।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমে উপরের Passwords First অংশের মতো{" "}
                <code className={CODE}>MYSQL_ROOT_PASSWORD</code> বসিয়ে নিন। তারপর নিচের
                একটা Command। এটা শুধু MySQL চালু করে না, প্রথমবার চালু হওয়ার সময়{" "}
                <code className={CODE}>island_tours</code> Database বানিয়ে তার ভেতরে আমাদের
                MySQL ফাইলটাও Load করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Docker · macOS বা Linux",
          code: `# আগে Password টা চুপচাপ বসান (একবারই, এই Terminal এ)
read -s MYSQL_ROOT_PASSWORD
export MYSQL_ROOT_PASSWORD

# যে Folder এ island-tours.mysql.sql নামিয়েছেন, সেখান থেকে চালান
docker run -d --name island-mysql \\
  -e MYSQL_ROOT_PASSWORD \\
  -e MYSQL_DATABASE=island_tours \\
  -v island-mysql-data:/var/lib/mysql \\
  -v "$PWD/island-tours.mysql.sql":/docker-entrypoint-initdb.d/island-tours.sql:ro \\
  -p 127.0.0.1:3306:3306 \\
  mysql:8.4

# চালু হতে কয়েক সেকেন্ড লাগে। তৈরি হলো কিনা দেখুন:
docker logs island-mysql 2>&1 | grep "ready for connections"`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["অংশ", "কী করে", "কেন এভাবে"],
          rows: [
            ["-d", "Container পেছনে চালু থাকে", "Terminal আটকে থাকে না, বন্ধ করলেও Server চলে"],
            ["--name island-mysql", "Container এর একটা মনে রাখার মতো নাম", "পরে docker stop, docker logs, docker exec এ এই নাম লাগবে"],
            ["-e MYSQL_ROOT_PASSWORD", "root এর Password, আপনার Shell এর Variable থেকে", "= এর পরে কিছু না লিখলে Docker মানটা আপনার Shell থেকে নেয়, তাই Command এ Password নেই"],
            ["-e MYSQL_DATABASE=island_tours", "প্রথমবার এই নামে একটা Database বানায়", "নিচের ফাইলটা এই Database এর ভেতরেই Load হয়"],
            ["-v island-mysql-data:/var/lib/mysql", "Data রাখে Docker এর একটা Volume এ", "Container মুছে ফেললেও Data থেকে যায়, যতক্ষণ না Volume মোছেন"],
            ["-v ...:/docker-entrypoint-initdb.d/...", "ফাইলটা একটা বিশেষ Folder এ বসায়", "Image টা প্রথমবার চালু হওয়ার সময় এই Folder এর .sql ফাইল নিজে থেকে চালায়"],
            ["-p 127.0.0.1:3306:3306", "শুধু আপনার মেশিন থেকে 3306 এ ঢোকা যায়", "নিচের সতর্কতাটা দেখুন"],
            ["mysql:8.4", "অফিসিয়াল Image, 8.4 Series", "এখন ভেতরে 8.4.11, পরে নতুন Fix এলে সেটা"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "127.0.0.1 কেন, শুধু 3306:3306 কেন না",
          content: (
            <div className="space-y-3">
              <ContentParagraph>
                অনেক টিউটোরিয়ালে শুধু <code className={CODE}>-p 3306:3306</code> লেখা থাকে।
                তাতে Docker Port টা আপনার মেশিনের সব Network এর দিকে খুলে দেয়, মানে একই Wi-Fi
                এর অন্য কেউও 3306 এ পৌঁছাতে পারেন। এই Image এ root শুধু নিজের মেশিন থেকে না,
                যেকোনো জায়গা থেকে ঢুকতে পারে। এই লেসনের Container এ সেটা দেখা গেছে:
              </ContentParagraph>
              <pre className="overflow-x-auto border border-border bg-background px-4 py-3 font-mono text-[0.75rem] leading-relaxed">{`mysql> SELECT user, host, plugin FROM mysql.user WHERE user = 'root';
+------+-----------+-----------------------+
| user | host      | plugin                |
+------+-----------+-----------------------+
| root | %         | caching_sha2_password |
| root | localhost | caching_sha2_password |
+------+-----------+-----------------------+`}</pre>
              <ContentParagraph>
                host এর ঘরে % মানে যেকোনো ঠিকানা। তাই 127.0.0.1 দিয়ে Port টা শুধু নিজের মেশিনে
                বেঁধে রাখুন। plugin এর ঘরে caching_sha2_password হলো MySQL 8.4 এর Default
                Password যাচাইয়ের পদ্ধতি। পুরনো mysql_native_password 8.4 এ Default ভাবে বন্ধ
                থাকে, তাই খুব পুরনো কোনো Tool Connect করতে না পারলে কারণ প্রায়ই এটাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Docker · রোজকার কাজ",
          code: `# ভেতরে ঢোকা (Container এর ভেতরের mysql Client দিয়ে)
docker exec -it island-mysql mysql -u root -p

# আজকের মতো বন্ধ, কাল আবার চালু। Data থেকে যায়।
docker stop island-mysql
docker start island-mysql

# Container মুছে ফেলা। Data এখনো Volume এ থেকে যায়।
docker rm -f island-mysql

# Data সহ সব মুছে ফেলা। এরপর আর ফেরত আসে না।
docker volume rm island-mysql-data`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "দুটো জিনিস যা এই পথে আলাদা",
          content: (
            <ContentList>
              <ListItem>
                Image এ <code className={CODE}>mysql_secure_installation</code> নেই, আর দরকারও
                নেই, কারণ Password শুরুতেই Variable থেকে বসে যায়, আর এই লেসনের Container এ test
                Database বা নাম ছাড়া কোনো Anonymous User পাওয়া যায়নি। Password এর ব্যাপারে কিছু না
                বললে Image চালুই হয় না। খালি Password এর জন্য একটা আলাদা Option আছে, শেখার মেশিনেও
                সেটা এড়িয়ে চলুন।
              </ListItem>
              <ListItem>
                initdb Folder এর ফাইল চলে শুধু প্রথমবার, যখন Data Directory খালি থাকে। এই লেসনের
                Container বন্ধ করে আবার চালু করার পর Log এ ফাইল চালানোর লাইন আর আসেনি, অথচ ২৪টা
                Booking ঠিকঠাক ছিল। তাই ফাইলটা বদলে আবার Load করতে চাইলে নিচের Load Island Tours
                অংশের পথ ব্যবহার করুন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Windows এ Docker Desktop থাকলে একই Command চলে, শুধু PowerShell এ লাইন ভাঙার চিহ্ন
              \ এর বদলে ` (Backtick), আর Variable বসানোর লাইনটা উপরের PowerShell এর মতো।
              সবচেয়ে সহজ হলো পুরো docker run এক লাইনে লেখা। চারটা পথ এক জায়গায় পাশাপাশি দেখতে নিচের
              Lab টা ব্যবহার করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InstallPathLab />,
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "first-connection",
      subHeader: { index: "009", title: "First Connection" },
      title: <SectionTitle>প্রথমবার ঢোকা: স্বাগত বার্তা, Prompt আর প্রথম চারটা Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যে পথেই ইনস্টল করুন, প্রথম ঢোকাটা দেখতে একই রকম। নিচের পুরোটা এই লেসনের MySQL 8.4
              Container এ একটা আসল Session থেকে হুবহু তোলা, শুধু Password এর জায়গাটা খালি, কারণ
              টাইপ করা Password স্ক্রিনে আসেই না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql -u root -p",
          code: `Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \\g.
Your MySQL connection id is 8
Server version: 8.4.11 MySQL Community Server - GPL

Copyright (c) 2000, 2026, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\\h' for help. Type '\\c' to clear the current input statement.

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql> SELECT VERSION()
    -> ;
+-----------+
| VERSION() |
+-----------+
| 8.4.11    |
+-----------+
1 row in set (0.00 sec)

mysql> exit
Bye`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>লাইনগুলো একটা একটা করে পড়ি।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Commands end with ; or \g:</strong> প্রতিটা Statement শেষ হয় সেমিকোলন
                  দিয়ে। এটা না দিলে MySQL ধরে নেয় আপনার কথা এখনো শেষ হয়নি।
                </ListItem>
                <ListItem>
                  <strong>connection id is 8:</strong> এই Connection এর নম্বর। Server একসাথে অনেক
                  Connection সামলায়, প্রত্যেকের আলাদা নম্বর। Module 18 এ দেখবেন কোন Connection কী
                  করছে সেটা কীভাবে দেখা যায়।
                </ListItem>
                <ListItem>
                  <strong>Server version: 8.4.11:</strong> আপনি আসলে কার সাথে কথা বলছেন। এখানে
                  MariaDB লেখা থাকলে আপনি MySQL এর সাথে না, তার আত্মীয়ের সাথে কথা বলছেন।
                </ListItem>
                <ListItem>
                  <strong>mysql&gt; আর -&gt;:</strong> প্রথমটা নতুন Statement এর অপেক্ষা। দ্বিতীয়টা
                  মানে আগের লাইনের Statement এখনো চলছে, কারণ সেমিকোলন আসেনি। উপরের Session এ{" "}
                  <code className={CODE}>SELECT VERSION()</code> এর পর Enter চাপায় তাই হয়েছে, আর
                  পরের লাইনে শুধু ; দিতেই উত্তর এসেছে।
                </ListItem>
                <ListItem>
                  <strong>চারটা Database:</strong> information_schema, mysql, performance_schema আর
                  sys, এগুলো MySQL এর নিজের কাজের, শুরু থেকেই থাকে। এগুলোর ভেতরে Server নিজের Account,
                  Table এর তালিকা আর কাজের হিসাব রাখে। আপনার নিজের Data এগুলোতে রাখবেন না।
                </ListItem>
                <ListItem>
                  <strong>exit:</strong> বের হওয়া, MySQL বিদায় জানায় Bye দিয়ে।{" "}
                  <code className={CODE}>quit</code> আর <code className={CODE}>\q</code> ও একই কাজ
                  করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আধা লেখা Statement থেকে বের হওয়ার উপায়",
          content: (
            <ContentParagraph>
              অনেক লাইন লেখার পর বুঝলেন ভুল হয়েছে, আর চালাতে চান না? সেমিকোলন না দিয়ে লিখুন{" "}
              <code className={CODE}>\c</code> আর Enter। MySQL যা লেখা হয়েছিল ফেলে দিয়ে আবার{" "}
              <code className={CODE}>mysql&gt;</code> এ ফেরত যায়। একটা সাবধানতা: psql এ{" "}
              <code className={CODE}>\c</code> মানে অন্য Database এ চলে যাওয়া। একই দুই অক্ষর, দুই
              Program এ একদম আলাদা কাজ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "localhost-vs-ip",
      subHeader: { index: "010", title: "localhost vs 127.0.0.1" },
      title: <SectionTitle>localhost আর 127.0.0.1: একই জায়গা, দুটো আলাদা রাস্তা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                DevOps ট্র্যাকে আপনি শিখেছেন localhost আর 127.0.0.1 একই মেশিনকে বোঝায়। Network এর
                দিক থেকে কথাটা সত্য। কিন্তু MySQL এর Client এর কাছে নাম দুটো দুটো আলাদা রাস্তা, আর
                এই একটা জিনিস না জানায় মানুষ ঘণ্টার পর ঘণ্টা নষ্ট করেন।
              </ContentParagraph>
              <ContentParagraph>
                MySQL এর Manual এর কথায়, Unix ধরনের সিস্টেমে (macOS আর Linux) MySQL এর Program গুলো
                localhost নামটাকে আলাদাভাবে দেখে। localhost লিখলে Client Network এ যায়ই না, মেশিনের
                ভেতরের একটা বিশেষ ফাইল দিয়ে সরাসরি Server এর সাথে কথা বলে। এই ফাইলের নাম Unix Socket।
                আর তখন <code className={CODE}>-P</code> দিয়ে দেওয়া Port টা চুপচাপ উপেক্ষিত হয়, কারণ
                ফাইলের কোনো Port নেই। 127.0.0.1 লিখলে Client আসল TCP Connection খোলে আর Port মেনে চলে।
              </ContentParagraph>
              <ContentParagraph>
                কথাটা এই লেসনের Container এ পরীক্ষা করা হয়েছে। Server চলছে 3306 এ, আর আমরা ইচ্ছা করে
                একটা ভুল Port দিলাম, 9999।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "একই ভুল Port, দুই রাস্তায়",
          code: `$ mysql -h localhost -P 9999 -u root -p -N -e "SELECT @@port"
3306
# ঢুকে গেল! কারণ localhost মানে Socket ফাইল, 9999 কেউ দেখলই না।
# আর Server জানাল সে আসলে চলছে 3306 এ।

$ mysql -h 127.0.0.1 -P 9999 -u root -p -e "SELECT 1"
ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:9999' (111)
# এবার TCP দিয়ে গেল, 9999 এ কেউ নেই, তাই সাথে সাথে Error।`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <SocketVsTcpSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এর থেকে তিনটা কাজের নিয়ম বেরিয়ে আসে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Port বদলালে 127.0.0.1 লিখুন।</strong> একই মেশিনে দুটো MySQL চালাচ্ছেন, একটা
                  3307 এ? <code className={CODE}>-h localhost -P 3307</code> আপনাকে নিয়ে যাবে Socket এর
                  Server এ, যেটা হয়তো ভুল Server। লিখুন{" "}
                  <code className={CODE}>-h 127.0.0.1 -P 3307</code>।
                </ListItem>
                <ListItem>
                  <strong>Docker এর MySQL এ বাইরে থেকে যেতে TCP লাগে।</strong> Container এর Socket ফাইল
                  থাকে Container এর ভেতরে, আপনার মেশিনে না। তাই আপনার মেশিনে mysql Client থাকলে Docker এর
                  Server এ যাবেন <code className={CODE}>mysql -h 127.0.0.1 -P 3306 -u root -p</code> দিয়ে।
                  Client না থাকলে <code className={CODE}>docker exec -it island-mysql mysql -u root -p</code>{" "}
                  দিয়ে Container এর ভেতরের Client ব্যবহার করুন, সেখানে localhost ঠিকঠাক চলে।
                </ListItem>
                <ListItem>
                  <strong>দুটো Error, দুটো আলাদা অর্থ।</strong> ERROR 2002 মানে Socket ফাইল পাওয়া যায়নি,
                  তাই localhost এর রাস্তা বন্ধ: Server হয় চালু নেই, নয়তো অন্য কোথাও। ERROR 2003 মানে
                  TCP দিয়ে যে Port এ গেলেন সেখানে কেউ নেই। Error এর নম্বর দেখেই বুঝবেন কোন রাস্তায়
                  আটকেছেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দুটো Error, এই লেসনের Container থেকে হুবহু",
          code: `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/nope.sock' (2)
ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:3307' (111)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বন্ধনীর ভেতরের সংখ্যাটা Operating System এর",
          content: (
            <ContentParagraph>
              Error এর শেষে (2) বা (111) এর মতো সংখ্যাটা MySQL এর না, Operating System এর নিজের
              Error কোড। Linux এ (111) মানে Connection প্রত্যাখ্যাত, আর (2) মানে ফাইল নেই। macOS এ
              Connection প্রত্যাখ্যানের কোড আলাদা হতে পারে, তাই নম্বর না মিললে ঘাবড়াবেন না, শুরুর
              2002 বা 2003 টাই আসল সূত্র।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "load-island-tours",
      subHeader: { index: "011", title: "Load Island Tours" },
      title: <SectionTitle>Island Tours কে MySQL এ আনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ট্র্যাকের Sample Database এর দুটো ফাইল আছে, দুটোই{" "}
                <Link href="/sql/database" className={LINK}>
                  Island Tours Database এর পাতা
                </Link>{" "}
                থেকে নামানো যায়: <code className={CODE}>island-tours.sql</code> PostgreSQL এর জন্য, আর{" "}
                <code className={CODE}>island-tours.mysql.sql</code> MySQL এর জন্য। দুটোয় একই আটটা
                Table, একই Row, শুধু লেখা যার যার ভাষায়। PostgreSQL এর ফাইলটা MySQL এ চালালে প্রথম
                CREATE TABLE এই আটকে যাবে, তাই MySQL ফাইলটাই নিন।
              </ContentParagraph>
              <ContentParagraph>
                Load করা মানে দুটো কাজ: প্রথমে একটা খালি Database বানানো, তারপর ফাইলটা তার ভেতরে
                চালানো। ফাইলটা নিজেই শুরুতে পুরনো Table গুলো মুছে নতুন করে বানায়, তাই যতবার খুশি
                চালাতে পারবেন, প্রতিবার একদম শুরুর অবস্থায় ফিরবেন। ইনস্টলের পথ অনুযায়ী Command একটু
                আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Homebrew, APT Repository, বা Password দিয়ে চলা যেকোনো MySQL",
          code: `# ফাইলটা যে Folder এ নামিয়েছেন, সেখান থেকে চালান
mysql -u root -p -e "CREATE DATABASE island_tours"
mysql -u root -p island_tours < island-tours.mysql.sql
# দুবারই Password চাইবে। দ্বিতীয়টা চুপচাপ শেষ হলে বুঝবেন সফল।`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Ubuntu এর নিজের Package (auth_socket)",
          code: `sudo mysql -e "CREATE DATABASE island_tours"
sudo mysql island_tours < island-tours.mysql.sql`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "Docker, Container আগে থেকে চালু থাকলে",
          code: `# Password আপনার Terminal এ না, Container এর নিজের Variable থেকে পড়া হচ্ছে।
# sh -c এর ভেতরের লেখাটা একক Quote এ, তাই $MYSQL_ROOT_PASSWORD খোলে Container এর ভেতরে।
docker exec island-mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS island_tours"'
docker exec -i island-mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" island_tours' < island-tours.mysql.sql`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Docker এর পথে প্রতিটা Command এর সাথে MySQL এর সেই সতর্কবার্তা আসবে, Using a password
                on the command line interface can be insecure। এখানে চিন্তার কিছু নেই: Password টা আপনার
                Terminal এর History তে যায়নি, Container এর ভেতরের Variable থেকে Container এর ভেতরেই
                বসেছে। এই লেসনে ঠিক এই দুটো Command চালিয়ে ফাইলটা Load করা হয়েছে, কোনো Error ছাড়া।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Windows এর PowerShell এ এখানে আটকাবেন।</strong> PowerShell{" "}
                <code className={CODE}>&lt;</code> দিয়ে ফাইল থেকে Input ঢোকানো চেনে না, বলবে The
                &apos;&lt;&apos; operator is reserved for future use। তখন mysql এর নিজের{" "}
                <code className={CODE}>SOURCE</code> Command ব্যবহার করুন, যেটা এই লেসনের Container এও
                পরীক্ষা করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "Windows · PowerShell",
          code: `mysql -u root -p -e "CREATE DATABASE island_tours"
mysql -u root -p island_tours

# mysql> Prompt আসার পর, ফাইলের পুরো ঠিকানা দিয়ে (Path এ / ব্যবহার করুন):
mysql> SOURCE C:/Users/আপনার-নাম/Downloads/island-tours.mysql.sql
mysql> SELECT COUNT(*) FROM bookings;`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Load হলো কিনা যাচাই করার সবচেয়ে সহজ উপায়, কয়েকটা Table এর Row গুনে Sample Database এর
              পাতার সংখ্যার সাথে মেলানো। MySQL এ এই প্রশ্নটার উত্তর এই লেসনের Container থেকে এসেছে
              এমন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "MySQL 8.4 · mysql -u root -p island_tours -t",
          code: `+------------+-----------+
| table_name | row_count |
+------------+-----------+
| bookings   |        24 |
| customers  |        15 |
| tours      |         9 |
| payments   |        19 |
+------------+-----------+`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই প্রশ্ন, PostgreSQL এ"
              query={`SELECT 'bookings' AS table_name, count(*) AS row_count FROM bookings
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'tours', count(*) FROM tours
UNION ALL SELECT 'payments', count(*) FROM payments;`}
              caption="Run চাপুন আর উপরের MySQL এর Output এর সাথে মেলান: 24, 15, 9, 19। একই প্রশ্ন, একই উত্তর, শুধু ছাপার ধরন আলাদা। ঠিক এই Query টা MySQL এও হুবহু চলে, সেখানে count এর বদলে COUNT লিখলেও কিছু বদলায় না। UNION ALL কী, Module 07 এ শিখবেন।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "mysql-file",
      subHeader: { index: "012", title: "The MySQL File" },
      title: <SectionTitle>একই Data, দুই ভাষায়: MySQL ফাইলে কী কী বদলাতে হয়েছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL ফাইলটা PostgreSQL এর ফাইল থেকেই তৈরি, আর পাশাপাশি রাখলে Module 01 এর Lesson 05 এর
              পার্থক্যগুলো চোখের সামনে দেখা যায়। প্রতিটা বদল কেন করতে হয়েছে, নিচের টেবিলে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["PostgreSQL এর ফাইলে", "MySQL এর ফাইলে", "কেন"],
          rows: [
            ["integer GENERATED ALWAYS AS IDENTITY", "INT AUTO_INCREMENT", "নিজে থেকে বাড়া নম্বরের জন্য দুজনের দুই রকম লেখা"],
            ["text", "VARCHAR(255)", "MySQL এ TEXT Column এ সরাসরি UNIQUE দেওয়া যায় না, দেয় ERROR 1170 (key length চাই), তাই সবখানে দৈর্ঘ্যের সীমা দেওয়া একই Type"],
            ["numeric(10, 2)", "DECIMAL(10, 2)", "একই জিনিস, দুই নাম। টাকার হিসাব কেন এই Type এ, Module 09 এ"],
            ["timestamptz", "DATETIME", "MySQL এর DATETIME Time Zone রাখে না, তাই Dhaka এর ঘড়ির সময়টাই লেখা, +06 ছাড়া"],
            ["boolean", "BOOLEAN, যা আসলে tinyint(1)", "MySQL এ true মানে 1, false মানে 0"],
            ["Column এর পাশে REFERENCES", "Table এর শেষে FOREIGN KEY (...) REFERENCES", "MySQL পাশে লেখা REFERENCES পড়ে কিন্তু মানে না, নিচে প্রমাণ"],
            ["DROP TABLE ... CASCADE", "SET FOREIGN_KEY_CHECKS = 0, তারপর DROP", "Foreign Key থাকা অবস্থায় পুরনো Table মুছতে MySQL এর নিজের পথ"],
          ],
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="PostgreSQL এর চোখে tours"
              query={`SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tours'
ORDER BY ordinal_position;`}
              caption="information_schema হলো Database এর নিজের সম্পর্কে তথ্যের একটা Standard জায়গা, আর মজার কথা, MySQL এও এটা আছে। Run চাপলে PostgreSQL দেখাবে integer, text, numeric, boolean, timestamp with time zone। একই প্রশ্ন MySQL এ (TABLE_SCHEMA = 'island_tours' যোগ করে) এই লেসনের Container এ দিয়েছে int, varchar, decimal, tinyint, datetime। একই Column, দুই ভাষার Type।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলের সবচেয়ে বিপজ্জনক লাইনটা REFERENCES এর। PostgreSQL এ Column এর পাশে{" "}
                <code className={CODE}>REFERENCES parent (id)</code> লিখলেই একটা পুরোদস্তুর Foreign Key তৈরি
                হয়। MySQL একই লেখা কোনো Error ছাড়াই গ্রহণ করে, কিন্তু নিয়মটা মনে রাখে না। ফলে ভুল Data
                চুপচাপ ঢুকে যায়। কথাটা এই লেসনের Container এ পরীক্ষা করা হয়েছে, একটা আলাদা ছোট Database
                বানিয়ে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "MySQL 8.4 · inline REFERENCES বনাম FOREIGN KEY",
          code: `CREATE TABLE parent (id INT PRIMARY KEY);
CREATE TABLE child_inline (id INT PRIMARY KEY, parent_id INT REFERENCES parent (id));
CREATE TABLE child_table  (id INT PRIMARY KEY, parent_id INT,
                           FOREIGN KEY (parent_id) REFERENCES parent (id));

INSERT INTO child_inline VALUES (1, 999);
-- কোনো Error নেই। parent এ 999 নেই, তবু Row ঢুকে গেল।

INSERT INTO child_table VALUES (1, 999);
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
-- (\`fkcheck\`.\`child_table\`, CONSTRAINT \`child_table_ibfk_1\` FOREIGN KEY (\`parent_id\`)
-- REFERENCES \`parent\` (\`id\`))`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <InlineReferenceTrapDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "আমাদের MySQL ফাইল এই ফাঁদ এড়িয়েছে",
          content: (
            <ContentParagraph>
              island-tours.mysql.sql এ সাতটা Foreign Key ই Table এর শেষে আলাদা লাইনে লেখা। Load করার
              পর MySQL এর নিজের information_schema জিজ্ঞেস করে সাতটাই পাওয়া গেছে, আর নয়টা CHECK নিয়মও।
              customer_id 99 দিয়ে একটা Booking ঢোকাতে গেলে MySQL ঠিকই ERROR 1452 দেয়। নিজের Table বানানোর
              সময় MySQL এ সবসময় এই লম্বা লেখাটাই ব্যবহার করবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "side-by-side",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>দুই Server পাশাপাশি, আর ভিডিও ফলো করার অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              PostgreSQL আর MySQL একই মেশিনে একসাথে চালু থাকতে পারে, কোনো ঝামেলা ছাড়াই, কারণ দুজন দুটো
              আলাদা Port এ অপেক্ষা করে। দুটোর ভেতরেই এখন island_tours আছে, একই Row সহ। এটাই আপনার
              তুলনার পরীক্ষাগার।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoServersDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম অভ্যাস, Client এর Command গুলো চেনা। psql এ আপনি যা করবেন (Lesson 03 এ বিস্তারিত),
              mysql এ তার জোড়া কী, নিচের Lab এ প্রতিটা কাজের আসল MySQL Output সহ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ClientCommandLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় অভ্যাস, একই প্রশ্ন দুই জায়গায় চালানো। সবচেয়ে শিক্ষণীয় একটা উদাহরণ: নামের শুরুতে
                saint আছে এমন ট্যুর খোঁজা, ছোট হাতের অক্ষরে। MySQL এ এই লেসনের Container বলেছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "MySQL 8.4",
          code: `mysql> SELECT title FROM tours WHERE title LIKE 'saint%';
+----------------------------+
| title                      |
+----------------------------+
| Saint Martin Island Escape |
| Saint Martin Luxury Stay   |
+----------------------------+
2 rows in set (0.00 sec)

mysql> SELECT booking_id, booked_at, total_bdt FROM bookings WHERE booking_id = 1\\G
*************************** 1. row ***************************
booking_id: 1
 booked_at: 2025-12-20 10:15:00
 total_bdt: 25000.00
1 row in set (0.00 sec)`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="এবার PostgreSQL এ"
              query={`SELECT title FROM tours WHERE title LIKE 'saint%';

SELECT title FROM tours WHERE title ILIKE 'saint%';

SELECT booking_id, booked_at, total_bdt FROM bookings WHERE booking_id = 1;`}
              caption="প্রথম প্রশ্নে PostgreSQL দেবে শূন্য Row, কারণ এখানে LIKE বড় ছোট অক্ষর আলাদা ধরে, আর MySQL এর Default এ ধরে না। দ্বিতীয় প্রশ্নে ILIKE দিয়ে PostgreSQL ও দুটো ট্যুর দেবে। তৃতীয়টায় একই Booking এর সময় এখানে আসবে 2025-12-20 10:15:00+06, শেষে Time Zone সহ, আর MySQL এ এসেছিল +06 ছাড়া। একই Data, একই প্রশ্ন, দুই রকম উত্তর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>MySQL এর ভিডিও দেখতে দেখতে PostgreSQL এ শেখার অভ্যাস।</strong> এখন আপনার হাতে দুটো
                পথই আছে। পরামর্শটা এমন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ভিডিওর প্রতিটা উদাহরণ আগে MySQL এ হুবহু চালান, যাতে শিক্ষকের Output আর আপনার Output মেলে।
                </ListItem>
                <ListItem>
                  তারপর একই উদাহরণ PostgreSQL এ চালান। না চললে Error টা পড়ুন আর{" "}
                  <Link href="/sql/topic/what-is-sql" className={LINK}>
                    Module 01 এর Lesson 05
                  </Link>{" "}
                  এর পার্থক্যের টেবিল আর অনুবাদের Lab মিলিয়ে নিন। প্রায় সবসময় কারণটা সেখানেই।
                </ListItem>
                <ListItem>
                  যেখানে দুটোর উত্তর আলাদা আসে, সেটা একটা খাতায় লিখে রাখুন। এই খাতাটাই পরে Module 21 এ আপনার
                  নিজের তুলনার তালিকা হবে।
                </ListItem>
                <ListItem>
                  এই ট্র্যাকের Assignment সবসময় PostgreSQL এ জমা দিন। MySQL হলো যাচাইয়ের আয়না, মূল খাতা না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর এক Partner এর MySQL</SectionTitle>,
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
                Island Tours নিজে চলে PostgreSQL এ। কিন্তু ধরুন, একটা কাল্পনিক দিনে, Cox&apos;s Bazar এর একটা
                হোটেল Island Tours এর Partner হলো। তাদের Booking System পুরনো, চলে MySQL এ। ঠিক হলো, প্রতি রাতে
                তাদের Database থেকে আগের দিনের রুম বুকিং পড়ে Island Tours এর Report এ যোগ হবে। কাজটা পড়ল আপনার
                উপর।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের প্রতিটা অংশ এখানে কাজে লাগে। নিজের মেশিনে একটা MySQL 8.4 চালিয়ে আগে হাত পাকাবেন,
                Docker এ, যাতে আপনার মেশিন পরিষ্কার থাকে। Partner এর কাছ থেকে একটা Read-only Account চাইবেন, root
                কখনো না। তাদের Server এ Connect করবেন একটা আসল Host আর Port দিয়ে, তাই localhost এর Socket এর
                রাস্তা এখানে প্রযোজ্যই না। Password থাকবে Environment Variable এ, কোনো Script এ লেখা না। আর তাদের
                Table এর DESCRIBE দেখে বুঝবেন কোন Column DATETIME, যার মানে সেখানে Time Zone নেই, তাই Report এ
                আনার সময় নিশ্চিত হয়ে নেবেন সময়গুলো কোন ঘড়ির।
              </ContentParagraph>
              <ContentParagraph>
                শেষের কথাটা ছোট শোনালেও আসল। দুই Database এর মধ্যে Data সরানোর বেশিরভাগ ভুল আসে এমন ছোট
                পার্থক্য থেকে: সময়ের Zone, বড় ছোট অক্ষরের তুলনা, true আর 1। আজকের তুলনাগুলো সেই চোখটা তৈরি করে।
                দুই ধরনের Database এর মধ্যে নিয়মিত Data সরানোর পুরো গল্প, ETL, Module 20 এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>শূন্য থেকে ২৪টা Booking পর্যন্ত, Docker এর পথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা একটা সরল রেখায়। এই প্রতিটা ধাপ এই লেসনের জন্য একটা আসল Container এ চালানো, শুধু
              Container এর নাম আর Port আলাদা ছিল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ফাইল নামানো",
              description:
                "Island Tours Database এর পাতা থেকে island-tours.mysql.sql নামান, আর Terminal এ সেই Folder এ যান।",
            },
            {
              title: "Password চুপচাপ বসানো",
              description:
                "read -s MYSQL_ROOT_PASSWORD চালিয়ে Password টাইপ করুন, তারপর export MYSQL_ROOT_PASSWORD। স্ক্রিনে কিছু দেখাবে না, History তেও যাবে না।",
            },
            {
              title: "Container চালু",
              description:
                "Docker অংশের docker run Command টা চালান। Docker Image টা আগে না থাকলে প্রথমবার নামাবে, তাতে একটু সময় লাগে।",
            },
            {
              title: "প্রথম চালু হওয়া",
              description:
                "Image টা Data Directory খালি দেখে নতুন করে সব সাজায়, island_tours বানায়, আর initdb Folder এর ফাইলটা চালায়। Log এ running /docker-entrypoint-initdb.d/island-tours.sql লাইনটা আসে।",
            },
            {
              title: "তৈরি হওয়ার সংকেত",
              description:
                "docker logs island-mysql এ ready for connections আর port: 3306 লেখা লাইনটা এলে Server প্রস্তুত। তার আগে Connect করতে গেলে Error আসতে পারে, একটু অপেক্ষা করুন।",
            },
            {
              title: "ভেতরে ঢোকা",
              description:
                "docker exec -it island-mysql mysql -u root -p island_tours চালান, Password দিন। স্বাগত বার্তায় Server version: 8.4 দেখুন।",
            },
            {
              title: "যাচাই",
              description:
                "SHOW TABLES; চালালে আটটা Table, আর SELECT COUNT(*) FROM bookings; চালালে 24। PostgreSQL এর Query বক্সেও একই 24।",
            },
            {
              title: "কাজ শেষে",
              description:
                "docker stop island-mysql। কাল docker start island-mysql দিলে সব আগের মতো পাবেন, কারণ Data আছে island-mysql-data Volume এ।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে Error গুলো প্রায় সবার একবার আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ প্রতিটা বোতাম একটা আসল Error। Error এর লেখাটা পড়ুন, আগে নিজে কারণটা আন্দাজ করুন,
              তারপর মিলিয়ে নিন। Error পড়ে কারণ ধরার পুরো কৌশল এই Module এর শেষ লেসনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConnectTroubleLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>দুটো MySQL একসাথে ইনস্টল করা।</strong> Homebrew আর DMG, বা Ubuntu এর Package আর APT
                Repository, দুটো একসাথে। দুটো Server একই 3306 আর একই Socket নিয়ে টানাটানি করে। একটা পথ বেছে
                নিন।
              </ListItem>
              <ListItem>
                <strong>Port বদলে localhost লেখা।</strong> 3307 এ চালানো Server এ{" "}
                <code className={CODE}>-h localhost -P 3307</code> দিয়ে গেলে Port উপেক্ষিত হয়, আর আপনি
                অন্য Server এ পৌঁছে যান। Port বদলালে সবসময় 127.0.0.1।
              </ListItem>
              <ListItem>
                <strong>PostgreSQL এর ফাইল MySQL এ চালানো।</strong> প্রথম CREATE TABLE এই Syntax Error আসবে।
                MySQL এর জন্য island-tours.mysql.sql।
              </ListItem>
              <ListItem>
                <strong>MySQL এ Column এর পাশে REFERENCES লেখা।</strong> কোনো Error আসে না, তাই ভুলটা বোঝাও
                যায় না, যতদিন না ভুল Data জমে। Foreign Key সবসময় আলাদা লাইনে FOREIGN KEY দিয়ে।
              </ListItem>
              <ListItem>
                <strong>Password Command এ লিখে ফেলা।</strong> একবার লিখে ফেললে History থেকে মুছুন আর Password
                টা বদলে ফেলুন। অভ্যাস: শুধু -p, অথবা read -s।
              </ListItem>
              <ListItem>
                <strong>Uninstall করলে Data চলে যায় ভাবা।</strong> Program সরে, Data Directory থেকে যায়। আবার
                ইনস্টল করলে পুরনো Data আর পুরনো root Password ফিরে আসতে পারে, যেটা অবাক করে।
              </ListItem>
              <ListItem>
                <strong>MariaDB কে MySQL ভাবা।</strong> স্বাগত বার্তার Server version লাইনটা একবার পড়ে নিলেই এই
                ভুল আর হয় না।
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
                <strong>Installing MySQL</strong>, MySQL 8.4 Manual এর ইনস্টলের পুরো অধ্যায়, প্রতিটা Operating
                System এর জন্য আলাদা অংশ।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/installing.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/installing.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Installing MySQL on Microsoft Windows</strong>, MSI আর MySQL Configurator এর অফিসিয়াল পথ।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/windows-installation.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/windows-installation.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Using the MySQL APT Repository</strong>, Ubuntu আর Debian এ 8.4 পাওয়ার পথ।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/linux-installation-apt-repo.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/linux-installation-apt-repo.html
                </a>
              </ListItem>
              <ListItem>
                <strong>mysql_secure_installation</strong>, প্রতিটা প্রশ্ন কী করে তার অফিসিয়াল ব্যাখ্যা।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/mysql-secure-installation.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/mysql-secure-installation.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Connecting to the MySQL Server</strong>, localhost আর Socket, 127.0.0.1 আর TCP এর পুরো নিয়ম।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/connecting.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/connecting.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL Releases: Innovation and LTS</strong>, কোন Version কতদিন Support পায়।{" "}
                <a href="https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html" target="_blank" rel="noopener noreferrer" className={LINK}>
                  dev.mysql.com/doc/refman/8.4/en/mysql-releases.html
                </a>
              </ListItem>
              <ListItem>
                <strong>mysql, Docker Official Image</strong>, Environment Variable, initdb Folder আর Data রাখার নিয়ম।{" "}
                <a href="https://hub.docker.com/_/mysql" target="_blank" rel="noopener noreferrer" className={LINK}>
                  hub.docker.com/_/mysql
                </a>
              </ListItem>
              <ListItem>
                <strong>mysql@8.4, Homebrew</strong>, Formula এর পাতা, এখনকার Version সহ।{" "}
                <a href="https://formulae.brew.sh/formula/mysql@8.4" target="_blank" rel="noopener noreferrer" className={LINK}>
                  formulae.brew.sh/formula/mysql@8.4
                </a>
              </ListItem>
              <ListItem>
                <strong>Install and configure a MySQL server</strong>, Ubuntu এর অফিসিয়াল Server Docs, auth_socket এর কথাসহ।{" "}
                <a href="https://ubuntu.com/server/docs/how-to/databases/install-mysql/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  ubuntu.com/server/docs/how-to/databases/install-mysql
                </a>
              </ListItem>
              <ListItem>
                <strong>MariaDB, Wikipedia</strong>, MySQL থেকে আলাদা হওয়ার ইতিহাস আর এখনকার পার্থক্য।{" "}
                <a href="https://en.wikipedia.org/wiki/MariaDB" target="_blank" rel="noopener noreferrer" className={LINK}>
                  en.wikipedia.org/wiki/MariaDB
                </a>
              </ListItem>
              <ListItem>
                <strong>একটা পূর্ণ SQL ভিডিও কোর্স</strong>, MySQL দিয়ে বানানো। এই লেসনের পর ভিডিওর শুরুর দিকের
                Database আর Table বানানোর অংশগুলো নিজের MySQL এ হুবহু চালিয়ে দেখতে পারবেন, তারপর PostgreSQL এ
                অনুবাদ করে।{" "}
                <a href="https://www.youtube.com/watch?v=hlGoQC332VM" target="_blank" rel="noopener noreferrer" className={LINK}>
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
                  MySQL ইনস্টল ঐচ্ছিক। এই ট্র্যাকের মূল Database PostgreSQL, MySQL দ্বিতীয় ভাষা আর তুলনার আয়না।
                </ListItem>
                <ListItem>
                  ইনস্টল মানে পাঁচটা জিনিস: mysqld Server (Port 3306), Data Directory, mysql সহ Client Program,
                  root Account, আর Service যে Server চালু রাখে।
                </ListItem>
                <ListItem>
                  Version হিসেবে 8.4 LTS। Ubuntu 24.04 এর নিজের Package দেয় 8.0। Debian এর default-mysql-server
                  আসলে MariaDB, যেটা MySQL এর আলাদা হয়ে যাওয়া আত্মীয়।
                </ListItem>
                <ListItem>
                  Password কখনো Command এ না। Client এ শুধু -p, আর আগে থেকে দিতে হলে read -s দিয়ে চুপচাপ একটা
                  Environment Variable এ।
                </ListItem>
                <ListItem>
                  চার পথে root আলাদাভাবে ঢোকে: Homebrew এ শুরুতে Password ছাড়া, তারপর mysql_secure_installation;
                  Windows এ Configurator এ বসানো Password; Ubuntu এর Package এ sudo mysql (auth_socket); Docker এ
                  MYSQL_ROOT_PASSWORD।
                </ListItem>
                <ListItem>
                  localhost মানে Socket ফাইল, সেখানে Port উপেক্ষিত। 127.0.0.1 মানে TCP, Port মানা হয়। ERROR 2002
                  Socket এর, ERROR 2003 TCP এর।
                </ListItem>
                <ListItem>
                  Island Tours MySQL এ আনতে island-tours.mysql.sql: CREATE DATABASE, তারপর ফাইল চালানো। PowerShell
                  এ &lt; চলে না, SOURCE ব্যবহার করুন। যাচাই: bookings এ 24।
                </ListItem>
                <ListItem>
                  MySQL এ Column এর পাশে লেখা REFERENCES চুপচাপ উপেক্ষিত। Foreign Key সবসময় আলাদা লাইনে।
                </ListItem>
                <ListItem>
                  একই প্রশ্ন দুই Server এ: LIKE এ বড় ছোট অক্ষর, সময়ের Zone আর true বনাম 1, এই পার্থক্যগুলোই
                  সবচেয়ে বেশি ধরা পড়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুটো Server এখন আপনার হাতে, কিন্তু এই ট্র্যাকের প্রতিদিনের কাজের Tool একটাই: psql। পরের লেসনে
                সেটাকে ভালো করে চিনবেন। কীভাবে যেকোনো Server এ Connect করতে হয়, Prompt এর চিহ্নগুলো কী বলে,
                ব্যাকস্ল্যাশ দিয়ে শুরু হওয়া Meta-command গুলো কী কী, আর আজকের ClientCommandLab এর বাঁ দিকের
                প্রতিটা Command এর পুরো গল্প।
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
      ["ইনস্টল করবেন কিনা", "ঐচ্ছিক, MySQL কোর্স বা কাজের জন্য, মূল ভাষা PostgreSQL ই", "Theory এর টেবিল"],
      ["mysqld", "MySQL এর Server Process, Port 3306 এ অপেক্ষায়", "mysqladmin ping"],
      ["mysql", "প্রশ্ন পাঠানোর Client, Prompt mysql>", "mysql -u root -p"],
      ["8.4 LTS", "স্থির Version, পাঁচ বছর Premier Support", "SELECT VERSION();"],
      ["MariaDB", "MySQL থেকে ২০০৯ এ আলাদা হওয়া আত্মীয়, এক না", "Debian এর default-mysql-server"],
      ["Password এর নিয়ম", "শুধু -p, বা read -s দিয়ে Environment Variable", "MYSQL_ROOT_PASSWORD"],
      ["auth_socket", "Ubuntu তে root Password ছাড়া, Linux এর root কিনা দেখে", "sudo mysql -u root"],
      ["localhost বনাম 127.0.0.1", "Socket ফাইল বনাম TCP, প্রথমটায় Port উপেক্ষিত", "ERROR 2002 আর 2003"],
      ["initdb Folder", "Docker Image প্রথমবার চালু হলে .sql ফাইল চালায়", "/docker-entrypoint-initdb.d"],
      ["SOURCE", "mysql এর ভেতর থেকে একটা ফাইল চালানো", "PowerShell এ < এর বদলে"],
      ["Inline REFERENCES", "MySQL পড়ে কিন্তু মানে না, নিয়ম তৈরি হয় না", "FOREIGN KEY আলাদা লাইনে"],
      ["তুলনার পরীক্ষাগার", "একই Data দুই Server এ, একই প্রশ্নের উত্তর মেলানো", "LIKE 'saint%': 2 বনাম 0"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনার Mac এ PostgreSQL ইনস্টল আছে। MySQL এর ভিডিও দেখে mysql -u root -p লিখলেন, এল command not found। সবচেয়ে সম্ভাব্য কারণ কোনটা?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর Server বন্ধ আছে",
            isCorrect: false,
            explanation: "PostgreSQL চালু বা বন্ধ, তাতে mysql নামের Program থাকা না থাকার কিছু যায় আসে না। দুটো আলাদা Program।",
          },
          {
            key: "B",
            text: "mysql হলো MySQL এর Client, আর MySQL এই মেশিনে ইনস্টলই হয়নি, বা হলেও তার bin Folder PATH এ নেই",
            isCorrect: true,
            explanation:
              "ঠিক। command not found মানে Shell এই নামের কোনো Program খুঁজেই পায়নি। Homebrew এর mysql@8.4 keg-only, তাই ইনস্টলের পরেও PATH এ যোগ না করলে একই Error আসে।",
          },
          {
            key: "C",
            text: "root এর Password ভুল",
            isCorrect: false,
            explanation: "Password ভুল হলে Program চলত, তারপর ERROR 1045 দিত। এখানে Program টাই পাওয়া যায়নি।",
          },
          {
            key: "D",
            text: "Port 3306 বন্ধ",
            isCorrect: false,
            explanation: "Port এর সমস্যা হলে Program চলত আর ERROR 2003 দিত।",
          },
        ],
      },
      {
        id: 2,
        text: "MySQL এর Download পাতায় 8.4 LTS আর 9 এর Innovation Release দুটোই আছে। শেখার জন্য এই ট্র্যাক 8.4 LTS কেন বলে?",
        options: [
          {
            key: "A",
            text: "Innovation Release Production এর জন্য না, শুধু পরীক্ষার জন্য",
            isCorrect: false,
            explanation: "MySQL এর Docs অনুযায়ী দুটোই Production মানের। পার্থক্য স্থিরতা আর Support এর মেয়াদে।",
          },
          {
            key: "B",
            text: "LTS এর ভেতরে আচরণ বদলায় না, শুধু দরকারি Fix আসে, আর Support দীর্ঘ, তাই আজকের Command কালও একই কাজ করবে",
            isCorrect: true,
            explanation:
              "ঠিক। শেখার সময় মেঝে নড়তে থাকলে বিপদ। Innovation Release এ নতুন Feature আগে আসে, কিন্তু আচরণও বদলাতে পারে।",
          },
          {
            key: "C",
            text: "9 এ SQL লেখার নিয়ম পুরো আলাদা",
            isCorrect: false,
            explanation: "SQL এর মূল অংশ একই। পার্থক্য Release এর ধরনে, ভাষায় না।",
          },
          {
            key: "D",
            text: "8.4 শুধু Windows এ চলে",
            isCorrect: false,
            explanation: "8.4 macOS, Windows, Linux আর Docker সবখানে চলে, এই লেসনের চার পথেই।",
          },
        ],
      },
      {
        id: 3,
        text: "Ubuntu তে sudo apt install mysql-server করার পর mysql -u root -p দিয়ে সঠিক Password দিলেন, তবু এল ERROR 1045। কেন?",
        options: [
          {
            key: "A",
            text: "Ubuntu এর Package এ root কে Password দিয়ে চেনা হয় না, auth_socket দিয়ে চেনা হয়, তাই ঢুকতে হয় sudo mysql -u root দিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। auth_socket দেখে আপনি Linux এর root হিসেবে চালাচ্ছেন কিনা। Password এর ব্যবস্থাই নেই, তাই সঠিক Password ও কাজ করে না।",
          },
          {
            key: "B",
            text: "Server চালু হয়নি",
            isCorrect: false,
            explanation: "Server বন্ধ থাকলে 1045 না, 2002 আসত। 1045 মানে Connection হয়েছে, পরিচয় মেলেনি।",
          },
          {
            key: "C",
            text: "Ubuntu তে MySQL এর Port 3307",
            isCorrect: false,
            explanation: "Port এর সমস্যা হলে 2003 আসত।",
          },
          {
            key: "D",
            text: "Ubuntu MariaDB ইনস্টল করেছে",
            isCorrect: false,
            explanation: "Ubuntu 24.04 এ mysql-server আসলে MySQL 8.0। MariaDB এর ফাঁদটা Debian এর default-mysql-server এ।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার মেশিনে দুটো MySQL চলছে, একটা 3306 এ আর একটা 3307 এ। 3307 এর Server এ যেতে mysql -h localhost -P 3307 -u root -p চালালেন। কী ঘটবে?",
        options: [
          {
            key: "A",
            text: "ঠিকঠাক 3307 এর Server এ পৌঁছাবেন",
            isCorrect: false,
            explanation: "localhost দেখে Client Socket ফাইল ব্যবহার করে, আর তখন -P উপেক্ষিত হয়।",
          },
          {
            key: "B",
            text: "Client Socket ফাইল দিয়ে যাবে, Port উপেক্ষা করবে, আর আপনি সম্ভবত 3306 এর Server এ পৌঁছে যাবেন",
            isCorrect: true,
            explanation:
              "ঠিক। এই লেসনের পরীক্ষায় -h localhost -P 9999 দিয়েও Connect হয়ে গিয়েছিল, আর Server জানিয়েছিল সে চলছে 3306 এ। Port বদলালে লিখুন -h 127.0.0.1।",
          },
          {
            key: "C",
            text: "ERROR 2003 আসবে",
            isCorrect: false,
            explanation: "2003 TCP এর Error। localhost এর রাস্তায় TCP ব্যবহারই হয় না।",
          },
          {
            key: "D",
            text: "MySQL দুটো Server এ একসাথে Connect করবে",
            isCorrect: false,
            explanation: "একটা Connection সবসময় একটাই Server এর সাথে।",
          },
        ],
      },
      {
        id: 5,
        text: "Docker এ docker run ... -e MYSQL_ROOT_PASSWORD ... mysql:8.4 চালালেন, কিন্তু Container কয়েক সেকেন্ডেই থেমে গেল। Log এ লেখা Database is uninitialized and password option is not specified। কী ভুল হয়েছে?",
        options: [
          {
            key: "A",
            text: "mysql:8.4 Image নষ্ট",
            isCorrect: false,
            explanation: "Image ঠিক আছে। Log নিজেই কারণ বলছে।",
          },
          {
            key: "B",
            text: "-e MYSQL_ROOT_PASSWORD এ = এর পরে কিছু না থাকায় Docker মানটা Shell থেকে নিতে চেয়েছে, কিন্তু Shell এ Variable টা export করা ছিল না, তাই খালি গেছে",
            isCorrect: true,
            explanation:
              "ঠিক। আগে read -s MYSQL_ROOT_PASSWORD আর export MYSQL_ROOT_PASSWORD, তারপর পুরনো Container docker rm দিয়ে সরিয়ে আবার docker run।",
          },
          {
            key: "C",
            text: "Port 3306 আগে থেকে দখলে",
            isCorrect: false,
            explanation: "সেক্ষেত্রে Container চালুই হতো না, আর Error হতো port is already allocated।",
          },
          {
            key: "D",
            text: "MYSQL_DATABASE দেওয়া হয়নি",
            isCorrect: false,
            explanation: "MYSQL_DATABASE ঐচ্ছিক। আবশ্যিক হলো root এর Password এর ব্যবস্থা।",
          },
        ],
      },
      {
        id: 6,
        text: "Windows এর PowerShell এ mysql -u root -p island_tours < island-tours.mysql.sql চালালেন, এল The '<' operator is reserved for future use। সবচেয়ে সহজ সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর ফাইলটা দিয়ে চেষ্টা করা",
            isCorrect: false,
            explanation: "সমস্যা ফাইলে না, PowerShell এর < এ। আর PostgreSQL এর ফাইল MySQL এ চলবেও না।",
          },
          {
            key: "B",
            text: "mysql -u root -p island_tours দিয়ে ঢুকে SOURCE C:/.../island-tours.mysql.sql চালানো",
            isCorrect: true,
            explanation:
              "ঠিক। SOURCE হলো mysql Client এর নিজের Command, ফাইলটা পড়ে ভেতরের সব Statement চালায়। Path এ / ব্যবহার করুন।",
          },
          {
            key: "C",
            text: "MySQL আবার ইনস্টল করা",
            isCorrect: false,
            explanation: "ইনস্টলে কোনো সমস্যা নেই। শুধু Input ঢোকানোর পথ বদলাতে হবে।",
          },
          {
            key: "D",
            text: "Port 3307 দিয়ে চেষ্টা করা",
            isCorrect: false,
            explanation: "Error টা Connection এর আগেই, PowerShell এর নিজের।",
          },
        ],
      },
      {
        id: 7,
        text: "MySQL এ লিখলেন CREATE TABLE child (id INT PRIMARY KEY, parent_id INT REFERENCES parent (id)); কোনো Error এল না। তারপর parent এ নেই এমন parent_id দিয়ে Row ঢোকালেন। কী হবে?",
        options: [
          {
            key: "A",
            text: "ERROR 1452, কারণ Foreign Key ভাঙল",
            isCorrect: false,
            explanation: "PostgreSQL এ তাই হতো। MySQL পাশে লেখা REFERENCES থেকে কোনো নিয়ম তৈরিই করেনি।",
          },
          {
            key: "B",
            text: "Row টা চুপচাপ ঢুকে যাবে, কারণ MySQL Column এর পাশে লেখা REFERENCES পড়ে কিন্তু মানে না",
            isCorrect: true,
            explanation:
              "ঠিক। এই লেসনের Container এ ঠিক এটাই দেখা গেছে। FOREIGN KEY (parent_id) REFERENCES parent (id) আলাদা লাইনে লিখলে তবেই ERROR 1452।",
          },
          {
            key: "C",
            text: "CREATE TABLE ই আসলে ব্যর্থ হয়েছিল",
            isCorrect: false,
            explanation: "Table তৈরি হয়েছে, শুধু Foreign Key ছাড়া।",
          },
          {
            key: "D",
            text: "MySQL নিজে থেকে parent এ নতুন Row বানিয়ে দেবে",
            isCorrect: false,
            explanation: "কোনো Database নিজে থেকে এমন করে না।",
          },
        ],
      },
      {
        id: 8,
        text: "একই island_tours, একই প্রশ্ন: SELECT title FROM tours WHERE title LIKE 'saint%'; MySQL দিল ২টা Row, PostgreSQL দিল ০টা। কোন ব্যাখ্যা ঠিক?",
        options: [
          {
            key: "A",
            text: "MySQL এর Data বেশি",
            isCorrect: false,
            explanation: "দুটো ফাইলে হুবহু একই Row, যাচাইয়ের Query তে দুই জায়গাতেই 24টা Booking।",
          },
          {
            key: "B",
            text: "MySQL এর Default তুলনায় বড় ছোট অক্ষর আলাদা ধরা হয় না, PostgreSQL এর LIKE ধরে; PostgreSQL এ একই কাজ ILIKE দিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। দুটোর কোনোটা ভুল না, নিয়ম আলাদা। এই ধরনের পার্থক্য খাতায় লিখে রাখাই দুই Server পাশাপাশি চালানোর আসল লাভ।",
          },
          {
            key: "C",
            text: "PostgreSQL এ Saint Martin এর ট্যুর নেই",
            isCorrect: false,
            explanation: "আছে, ILIKE দিয়ে চালালেই দুটো আসে।",
          },
          {
            key: "D",
            text: "PostgreSQL এ % কাজ করে না",
            isCorrect: false,
            explanation: "% দুই জায়গাতেই যেকোনো অক্ষরের সারি বোঝায়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের মেশিনে MySQL, আর তুলনার পরীক্ষাগার",
    subtitle: "Docker এ MySQL 8.4 চালু, Island Tours Load, তারপর একই প্রশ্ন দুই Server এ",
    stepName: "LAB",
    steps: [
      {
        title: "MySQL চালু করুন",
        description:
          "প্রথম কোডটা চালান। Docker না থাকলে Homebrew, Windows বা Ubuntu এর পথ নিন, শেষে mysql -u root -p দিয়ে ঢুকতে পারলেই এই ধাপ শেষ। Docker এর পথে Island Tours নিজে থেকেই Load হয়ে যায়।",
      },
      {
        title: "প্রথম Session পড়ুন",
        description:
          "দ্বিতীয় কোডের Command গুলো mysql> এ একটা একটা করে চালান। স্বাগত বার্তার Server version লাইনটা লিখে রাখুন, আর \\c দিয়ে একটা আধা লেখা Statement বাতিল করে দেখুন।",
      },
      {
        title: "Load না হয়ে থাকলে Load করুন",
        description:
          "Docker ছাড়া অন্য পথে থাকলে তৃতীয় কোড দিয়ে island_tours বানিয়ে ফাইলটা চালান। Windows হলে SOURCE এর পথ। শেষে SELECT COUNT(*) FROM bookings; এ 24 আসা চাই।",
      },
      {
        title: "localhost এর ফাঁদটা নিজে ধরুন",
        description:
          "চতুর্থ কোডের দুটো Command চালান, একটা localhost আর ভুল Port দিয়ে, একটা 127.0.0.1 আর একই ভুল Port দিয়ে। কোনটা ঢুকল আর কোনটা ERROR 2003 দিল, লিখে রাখুন। Docker এ থাকলে Command দুটো docker exec দিয়ে Container এর ভেতরে চালান।",
      },
      {
        title: "একই প্রশ্ন, দুই Server",
        description:
          "পঞ্চম কোডের প্রতিটা প্রশ্ন MySQL এ চালান, তারপর এই লেসনের PostgreSQL Query বক্সে। যেখানে উত্তর আলাদা, তিনটা কলামের একটা ছোট তালিকা বানান: প্রশ্ন, MySQL এর উত্তর, PostgreSQL এর উত্তর।",
      },
      {
        title: "পরিষ্কার করে রাখুন",
        description:
          "ষষ্ঠ কোড দিয়ে আজকের মতো বন্ধ করুন। Data রেখে দিতে চাইলে শুধু docker stop। সব মুছে ফেলতে চাইলে শেষ দুটো লাইন, ভেবেচিন্তে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-start-mysql.sh",
        language: "bash",
        code: `# island-tours.mysql.sql যে Folder এ, সেখানে Terminal খুলুন
read -s MYSQL_ROOT_PASSWORD      # Password টাইপ করে Enter
export MYSQL_ROOT_PASSWORD

docker run -d --name island-mysql \\
  -e MYSQL_ROOT_PASSWORD \\
  -e MYSQL_DATABASE=island_tours \\
  -v island-mysql-data:/var/lib/mysql \\
  -v "$PWD/island-tours.mysql.sql":/docker-entrypoint-initdb.d/island-tours.sql:ro \\
  -p 127.0.0.1:3306:3306 \\
  mysql:8.4

# ready for connections আসা পর্যন্ত মাঝে মাঝে দেখুন
docker logs island-mysql 2>&1 | grep "ready for connections"

# ভেতরে ঢোকা
docker exec -it island-mysql mysql -u root -p island_tours`,
      },
      {
        filename: "2-first-session.sql",
        language: "sql",
        code: `-- mysql> Prompt এ একটা একটা করে
SHOW DATABASES;
USE island_tours;
SHOW TABLES;
DESCRIBE tours;
SELECT VERSION(), DATABASE(), CURRENT_USER();

-- একটা Row খাড়া করে দেখা, শেষে ; এর বদলে \\G
SELECT booking_id, booked_at, total_bdt FROM bookings WHERE booking_id = 1\\G

-- আধা লেখা Statement বাতিল: SELECT title FROM tours লিখে Enter, তারপর \\c
-- বের হওয়া
exit`,
      },
      {
        filename: "3-load-without-docker.sh",
        language: "bash",
        code: `# Homebrew, Windows (cmd), বা APT Repository এর পথে
mysql -u root -p -e "CREATE DATABASE island_tours"
mysql -u root -p island_tours < island-tours.mysql.sql

# Ubuntu এর নিজের Package (auth_socket)
sudo mysql -e "CREATE DATABASE island_tours"
sudo mysql island_tours < island-tours.mysql.sql

# Windows PowerShell: < চলে না, তাই ভেতরে ঢুকে
#   mysql -u root -p island_tours
#   mysql> SOURCE C:/Users/আপনার-নাম/Downloads/island-tours.mysql.sql

# যাচাই, তিন পথেই
mysql -u root -p island_tours -e "SELECT COUNT(*) FROM bookings"   # 24`,
      },
      {
        filename: "4-localhost-trap.sh",
        language: "bash",
        code: `# Docker এর পথে Container এর ভেতরে (সেখানে localhost এর Socket আছে):
docker exec -it island-mysql mysql -h localhost -P 9999 -u root -p -N -e "SELECT @@port"
#   3306      <- ঢুকে গেল, 9999 উপেক্ষিত

docker exec -it island-mysql mysql -h 127.0.0.1 -P 9999 -u root -p -e "SELECT 1"
#   ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:9999' (111)

# Homebrew, Windows বা Ubuntu হলে docker exec -it island-mysql অংশটা বাদ দিয়ে
# বাকিটা সরাসরি চালান।`,
      },
      {
        filename: "5-same-question-two-servers.sql",
        language: "sql",
        code: `-- প্রতিটা প্রশ্ন আগে MySQL এ, তারপর লেসনের PostgreSQL Query বক্সে

-- ১. বড় ছোট অক্ষর
SELECT title FROM tours WHERE title LIKE 'saint%';
--    MySQL 2 Row, PostgreSQL 0 Row (PostgreSQL এ ILIKE দিলে 2)

-- ২. সময়
SELECT booking_id, booked_at FROM bookings WHERE booking_id = 1;
--    MySQL 2025-12-20 10:15:00, PostgreSQL 2025-12-20 10:15:00+06

-- ৩. সত্য মিথ্যা
SELECT title, is_active FROM tours WHERE tour_id = 8;
--    MySQL is_active দেখাবে 0, PostgreSQL দেখাবে f

-- ৪. যেখানে দুজনই একমত
SELECT COUNT(*) FROM bookings WHERE status = 'confirmed';
--    দুই জায়গাতেই 17`,
      },
      {
        filename: "6-clean-up.sh",
        language: "bash",
        code: `# আজকের মতো বন্ধ, Data থেকে যায়
docker stop island-mysql

# Container মুছে ফেলা, Data এখনো Volume এ
docker rm -f island-mysql

# Data সহ সব মুছে ফেলা, এরপর আর ফেরত আসে না
docker volume rm island-mysql-data`,
      },
    ],
    tip: (
      <ContentParagraph>
        পঞ্চম কোডের তৃতীয় প্রশ্নে tour_id 8 হলো Saint Martin Luxury Stay, এই Data তে একমাত্র বন্ধ ট্যুর। Sample
        Database এর পাতার ইচ্ছা করে রাখা অদ্ভুত Data এর তালিকায় এর কথা আছে।
      </ContentParagraph>
    ),
  },
  assignment: {
    title: "Mini Project: দুই Server, একটা তুলনার খাতা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>MySQL চালু করুন আর প্রমাণ রাখুন:</strong> চার পথের যেকোনো একটায় MySQL 8.4 (Ubuntu এর নিজের Package
        হলে 8.0) চালু করুন। mysql -u root -p দিয়ে ঢোকার পর স্বাগত বার্তার Server version লাইন আর SELECT VERSION();
        এর উত্তর লিখে রাখুন। কোন পথ নিলেন আর কেন, এক লাইনে।
      </span>,
      <span key="2">
        <strong>Island Tours Load করুন:</strong> island-tours.mysql.sql দিয়ে island_tours বানান। SHOW TABLES; আর
        আটটা Table এর COUNT(*) Sample Database এর পাতার সংখ্যার সাথে মেলান।
      </span>,
      <span key="3">
        <strong>Password এর অভ্যাস:</strong> আপনার Shell History তে (macOS এ ~/.zsh_history) খুঁজে দেখুন আজকের
        কোনো Command এ Password লেখা আছে কিনা। থাকলে মুছে ফেলুন আর Password বদলান। না থাকলে কোন অভ্যাসের কারণে
        নেই, দুই লাইনে লিখুন।
      </span>,
      <span key="4">
        <strong>তুলনার খাতা শুরু করুন:</strong> Lab এর পঞ্চম কোডের চারটা প্রশ্ন আর নিজের অন্তত দুটো প্রশ্ন দুই Server
        এ চালান। প্রশ্ন, MySQL এর উত্তর, PostgreSQL এর উত্তর আর কেন আলাদা, এই চার কলামের একটা তালিকা বানান।
      </span>,
      <span key="5">
        <strong>বন্ধুকে বোঝান (৬ লাইন):</strong> একজন বন্ধুর Docker এ চলা MySQL এ mysql -h localhost -P 3306 দিয়ে
        ঢোকা যাচ্ছে না, আসছে ERROR 2002। ছয় লাইনে বোঝান কেন, আর কোন একটা শব্দ বদলালেই কাজ হবে।
      </span>,
    ],
    deliverables: [
      <span key="1">Server version এর লাইন, VERSION() এর উত্তর আর বেছে নেওয়া পথের কারণ</span>,
      <span key="2">আটটা Table এর Row এর সংখ্যা, Sample Database এর পাতার সাথে মেলানো</span>,
      <span key="3">History পরীক্ষার ফল আর দুই লাইনের ব্যাখ্যা</span>,
      <span key="4">অন্তত ছয়টা প্রশ্নের তুলনার তালিকা</span>,
      <span key="5">ERROR 2002 এর ছয় লাইনের ব্যাখ্যা</span>,
    ],
  },
};
