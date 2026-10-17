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
  MetaCommandLab,
  PromptLab,
  ScriptStopLab,
} from "../../../components/course/topics/sql-setup/psql-animations";
import {
  ConnectPartsDiagram,
  PromptAnatomyDiagram,
  PsqlWhereDiagram,
  TwoKindsSplit,
} from "../../../components/course/topics/sql-setup/psql-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border/60";

export const psqlBasicsContent: TopicData = {
  id: "psql-basics",
  introduction: {
    badge: "MODULE 02 · LESSON 03",
    title: <SectionTitle>psql: Database এর সাথে সরাসরি কথা বলার জানালা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের দুই লেসনে আপনার মেশিনে PostgreSQL বসেছে, চাইলে MySQL ও। এখন
          প্রশ্ন হলো, এই Server এর সাথে কথা বলবেন কীভাবে? Server টা চুপচাপ Port
          5432 এ বসে অপেক্ষা করছে, কিন্তু তার কোনো জানালা নেই, কোনো বোতাম নেই।
          তার সাথে কথা বলতে একটা Client Program লাগে। PostgreSQL এর সাথে যে
          Client টা সবসময় আসে, যেটা প্রতিটা Server এ, প্রতিটা Docker Container
          এ, প্রতিটা Developer এর মেশিনে পাওয়া যায়, তার নাম psql।
        </ContentParagraph>
        <ContentParagraph>
          প্রথম দেখায় psql একটা কালো পর্দা আর একটা অদ্ভুত লেখা, island_tours=#।
          অনেকে এখানেই ভয় পেয়ে কোনো রঙিন GUI Tool এর দিকে চলে যান। অথচ একবার
          psql এর নিয়মগুলো বুঝে গেলে এটা সবচেয়ে দ্রুত, সবচেয়ে নির্ভরযোগ্য Tool,
          আর চাকরিতে এমন দিন আসবেই যেদিন Production Server এ SSH করে শুধু psql
          ছাড়া আর কিছুই হাতে থাকবে না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনের শেষে আপনি যেকোনো PostgreSQL Server এ Connect করতে পারবেন,
          Prompt এর প্রতিটা চিহ্ন পড়তে পারবেন, Semicolon ভুলে যাওয়ার ফাঁদ চিনবেন,
          Backslash দিয়ে শুরু হওয়া Meta-command দিয়ে Database এর ভেতরটা ঘুরে
          দেখবেন, চওড়া Result পড়ার কৌশল জানবেন, আর SQL ফাইল চালানো থেকে
          Automation Script লেখা পর্যন্ত psql কে কাজে লাগাতে পারবেন। এই লেসনের
          প্রতিটা Terminal লেখা PostgreSQL 18 এর psql এ সত্যিই চালিয়ে হুবহু তুলে
          দেওয়া।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি দেখতে সাদামাটা, কোনো রঙ নেই, কোনো বোতাম নেই। কিন্তু যে মেশিনে PostgreSQL আছে, সেখানে আমিও আছি। খারাপ দিনে যখন বাকি সব Tool হারিয়ে যায়, তখন Developer রা আমাকেই খোঁজেন।",
      author: "psql",
      role: "Lesson 03",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>রাত এগারোটা, একটা বুকিং আটকে আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ধরুন আপনি Island Tours এ নতুন যোগ দিয়েছেন। রাত এগারোটায় Support
                থেকে মেসেজ এল: একজন Customer টাকা দিয়েছেন, অথচ তাঁর বুকিং এখনো
                pending দেখাচ্ছে, কাল সকালে তাঁর ট্যুর। Senior Developer ফোনে
                বললেন, &ldquo;Server এ ঢুকে psql দিয়ে বুকিং ১৭ টা একটু দেখুন তো,
                Status আর Payment দুটোই।&rdquo;
              </ContentParagraph>
              <ContentParagraph>
                আপনার হাতে তখন একটা Terminal, আর কিছু না। Server এ কোনো GUI নেই,
                কোনো মাউস নেই। আপনাকে জানতে হবে কোন Command এ Database এ ঢুকবেন,
                Prompt এ কী লেখা থাকলে বুঝবেন ঠিক Database এ আছেন, Query লিখে Enter
                চাপার পরেও কিছু না ঘটলে কী হয়েছে, আর কাজ শেষে কীভাবে বের হবেন। এর
                একটা ভুলও রাত এগারোটায় অনেক দামি।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসন আপনাকে সেই রাতের জন্য তৈরি করবে। কিন্তু শুধু জরুরি
                অবস্থার জন্য না। রোজকার কাজেও psql সবচেয়ে দ্রুত: একটা Table এর
                গঠন দেখতে দুই অক্ষর লাগে, একটা SQL ফাইল চালাতে এক লাইন, আর একই
                Command যেকোনো Server এ, যেকোনো অপারেটিং সিস্টেমে হুবহু একই কাজ
                করে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের মূল কথা",
          content: (
            <ContentParagraph>
              psql একটা Client Program। আপনি যা লেখেন সেটা দুই ধরনের: SQL, যেটা
              psql Server এর কাছে পাঠায় আর শেষ হয় Semicolon দিয়ে, আর
              Meta-command, যেটা Backslash দিয়ে শুরু হয় আর psql নিজেই সামলায়। এই
              একটা পার্থক্য বুঝে গেলে psql এর প্রায় সব রহস্য খুলে যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "what-psql-is",
      subHeader: { index: "002", title: "What psql Is" },
      title: <SectionTitle>psql কে, আর কোথায় থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Module 01 এর{" "}
                <Link href="/sql/topic/app-database-conversation" className={LINK}>
                  Lesson 06
                </Link>{" "}
                এ আপনি দেখেছেন, একটা Database এর সাথে কথা বলতে সবসময় দুই পক্ষ
                লাগে: Server, যে Data রাখে আর Query চালায়, আর Client, যে প্রশ্ন
                পাঠায়। আপনার NestJS বা Node.js App একটা Client। pgAdmin একটা
                Client। আর psql ও একটা Client, শুধু তার মুখ হলো Terminal।
              </ContentParagraph>
              <ContentParagraph>
                একটা রেস্তোরাঁর কথা ভাবুন। রান্নাঘর হলো Server, সেখানে আসল কাজ
                হয়। psql হলো সেই ওয়েটার, যিনি আপনার অর্ডার হুবহু রান্নাঘরে পৌঁছে
                দেন আর খাবার এলে সুন্দর করে সাজিয়ে টেবিলে রাখেন। ওয়েটার নিজে রান্না
                করেন না। তাই psql বন্ধ করলে Server বন্ধ হয় না, আর psql এর Version
                আর Server এর Version আলাদা হতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                PostgreSQL ইনস্টল করলে psql সাথেই আসে, Lesson 01 এর চারটা পথের
                প্রতিটাতেই। আছে কিনা আর কোন Version, দেখতে Terminal এ লিখুন:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql --version
psql (PostgreSQL) 18.6 (Debian 18.6-1.pgdg13+2)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বন্ধনীর ভেতরের লেখাটা বলে psql কোথা থেকে এসেছে। উপরেরটা Docker এর
              অফিসিয়াল postgres:18 Image এর ভেতর থেকে, তাই Debian লেখা। Homebrew
              থেকে ইনস্টল করলে লেখা থাকবে Homebrew। সংখ্যাটা আসল কথা: প্রথম অংশ 18
              হলো Major Version।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PsqlWhereDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql আর Server আলাদা Program বলে দুইজনের Version না মিললে psql
              নিজেই সাবধান করে। নিচের লেখাটা একটা মেশিনে Homebrew এর পুরনো psql 17
              দিয়ে একটা PostgreSQL 18 Server এ Connect করার সময়ের, হুবহু:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql -h 127.0.0.1 -p 15403 -U postgres -d island_tours
Password for user postgres:
psql (17.9 (Homebrew), server 18.6 (Debian 18.6-1.pgdg13+2))
WARNING: psql major version 17, server major version 18.
         Some psql features might not work.
Type "help" for help.

island_tours=#`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Version এর Warning দেখলে",
          content: (
            <ContentParagraph>
              Connect হয়ে গেছে, সাধারণ SQL ঠিকই চলবে। কিন্তু নতুন Server এর কিছু
              তথ্য দেখানোর Meta-command পুরনো psql এ ঠিকমতো কাজ নাও করতে পারে, যেমন
              Warning টাই বলছে। নিয়মটা সহজ: psql এর Version Server এর সমান বা নতুন
              রাখুন। দুটো PostgreSQL পাশাপাশি থাকলে কোন psql চলছে, সেটা{" "}
              <code className={CODE}>which psql</code> আর{" "}
              <code className={CODE}>psql --version</code> দিয়ে দেখে নিন। এই
              ঝামেলার পুরো গল্প Lesson 01 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "connecting",
      subHeader: { index: "003", title: "Connecting" },
      title: <SectionTitle>Connect করতে পাঁচটা তথ্য লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                কাউকে ফোন করতে নম্বর লাগে, একটা বাড়িতে চিঠি পাঠাতে ঠিকানা লাগে।
                psql কে একটা Database এ পাঠাতে লাগে পাঁচটা তথ্য: Server কোন মেশিনে
                (Host), সেই মেশিনের কোন দরজায় (Port), আপনি কে (User), কোন Database
                এ ঢুকবেন (Database), আর আপনার প্রমাণ (Password)। প্রতিটার জন্য psql
                এর একটা Flag আছে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `# পুরোটা লিখে: Host, Port, User, Database
psql -h localhost -p 5432 -U postgres -d island_tours`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ভালো খবর হলো, সবগুলো সবসময় লিখতে হয় না। psql এর অফিসিয়াল Docs
                অনুযায়ী তার নিজের কিছু ডিফল্ট আছে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Host না দিলে:</strong> macOS আর Linux এ psql একই মেশিনের
                  Server এর সাথে Unix Socket দিয়ে কথা বলে। Unix Socket হলো একই
                  মেশিনের দুটো Program এর মধ্যে কথা বলার একটা বিশেষ ফাইলের মতো
                  দরজা, Network এ না গিয়েই। Windows এ ডিফল্ট হলো TCP দিয়ে
                  localhost।
                </ListItem>
                <ListItem>
                  <strong>Port না দিলে:</strong> সাধারণত 5432, যেটা Server এরও
                  ডিফল্ট। তাই বেশিরভাগ সময় Port লিখতেই হয় না।
                </ListItem>
                <ListItem>
                  <strong>User না দিলে:</strong> আপনার অপারেটিং সিস্টেমের User নাম।
                  Mac এ আপনার নাম যদি ripon হয়, psql ধরে নেবে Database এর User ও
                  ripon।
                </ListItem>
                <ListItem>
                  <strong>Database না দিলে:</strong> User এর নামের সাথে একই নামের
                  Database। User ripon হলে Database ও ripon।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ দুটো ডিফল্ট থেকেই নতুনদের সবচেয়ে চেনা Error গুলো আসে। ধরুন
                আপনি শুধু <code className={CODE}>psql</code> লিখলেন। psql আপনার
                অপারেটিং সিস্টেমের নাম নিয়ে Server এ গেল, কিন্তু Server এ ওই নামে
                কোনো Role নেই, অথবা ওই নামে কোনো Database নেই। তখন কী দেখায়, সেটা
                আসছে Connection Errors অংশে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ConnectPartsDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>Password এর বেলায় একটা জিনিস আগে থেকে জেনে রাখুন।</strong>{" "}
                Password লাগলে psql নিজেই জিজ্ঞেস করে:{" "}
                <code className={CODE}>Password for user postgres:</code>। এরপর আপনি
                টাইপ করলে পর্দায় কিছুই দেখা যায় না, কোনো তারা চিহ্নও না। নতুনরা ভাবেন
                কীবোর্ড কাজ করছে না। আসলে করছে, শুধু লুকিয়ে রাখছে, যাতে পাশে কেউ
                দেখতে না পান। পুরোটা টাইপ করে Enter চাপুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Docker এ চলা PostgreSQL এর ভেতরে ঢোকার আরেকটা পথ আছে।</strong>{" "}
                Container এর ভেতরেই psql আছে, তাই বাইরে থেকে Port দিয়ে না গিয়ে
                সরাসরি ভেতরের psql চালানো যায়। Lesson 01 এ বানানো Container এর নাম
                island-pg হলে:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `# Container এর ভেতরের psql, ভেতরের Socket দিয়ে
docker exec -it island-pg psql -U postgres -d island_tours`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "-it কেন লাগে",
          content: (
            <ContentParagraph>
              <code className={CODE}>-i</code> মানে আপনার কীবোর্ডের লেখা Container
              এ যাবে, আর <code className={CODE}>-t</code> মানে একটা আসল Terminal এর
              মতো আচরণ, যাতে Prompt দেখা যায়, তীর চিহ্ন দিয়ে আগের Command ফেরত
              আনা যায়। শুধু একটা Command চালিয়ে ফলাফল নিতে চাইলে{" "}
              <code className={CODE}>-t</code> ছাড়া{" "}
              <code className={CODE}>-c</code> দিয়ে চালানো যায়, সেটা Files and
              Scripts অংশে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "three-ways",
      subHeader: { index: "004", title: "Three Ways to Say It" },
      title: <SectionTitle>Flag, URI আর Environment Variable</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একই পাঁচটা তথ্য তিনভাবে দেওয়া যায়, আর বাস্তবে তিনটাই দেখবেন। একটা
                ঠিকানা যেমন খামের উপর আলাদা লাইনে লেখা যায়, আবার এক লাইনে ঠেসেও
                লেখা যায়, ব্যাপারটা তেমন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম ধরন, Flag:</strong> যেটা উপরে দেখলেন।{" "}
                <code className={CODE}>-h</code>,{" "}
                <code className={CODE}>-p</code>,{" "}
                <code className={CODE}>-U</code>,{" "}
                <code className={CODE}>-d</code>। হাতে লেখার জন্য সবচেয়ে পরিষ্কার।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় ধরন, Connection URI:</strong> সব তথ্য এক লাইনে, ঠিক
                যেভাবে Module 01 এর Lesson 06 এ Connection String দেখেছিলেন। App এর
                Config, Cloud Database এর Dashboard আর Docker Compose ফাইলে এটাই
                বেশি দেখবেন, তাই পড়তে পারা জরুরি। Quote এর ভেতরে লিখুন, যাতে Shell
                কোনো চিহ্ন নিজের মতো করে না বোঝে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql "postgresql://postgres@localhost:5432/island_tours" -c "SELECT current_user, current_database();"
 current_user | current_database
--------------+------------------
 postgres     | island_tours
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>তৃতীয় ধরন, Environment Variable:</strong> প্রতিবার লেখার
                বদলে Shell এ একবার বলে রাখা। psql নিজে থেকে{" "}
                <code className={CODE}>PGHOST</code>,{" "}
                <code className={CODE}>PGPORT</code>,{" "}
                <code className={CODE}>PGUSER</code> আর{" "}
                <code className={CODE}>PGDATABASE</code> পড়ে নেয়। এরপর শুধু{" "}
                <code className={CODE}>psql</code> লিখলেই চলে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ export PGHOST=localhost PGPORT=5432 PGUSER=postgres PGDATABASE=island_tours
$ psql -c "SELECT current_database();"
 current_database
------------------
 island_tours
(1 row)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "PGPASSWORD আছে, কিন্তু রোজকার কাজে না",
          content: (
            <>
              <ContentParagraph>
                একটা <code className={CODE}>PGPASSWORD</code> Variable ও আছে।
                PostgreSQL এর নিজের Docs বলে এটা নিরাপত্তার কারণে সুপারিশ করা হয় না,
                কারণ কিছু অপারেটিং সিস্টেমে অন্য User ও চলমান Program এর Environment
                দেখতে পারেন। একই কারণে URI এর ভেতরে Password লিখবেন না: Shell এর
                History তে থেকে যায়, Screenshot এ চলে যায়, ভুল করে git এ ঢুকে যায়।
              </ContentParagraph>
              <ContentParagraph>
                রোজ হাতে Password টাইপ করতে না চাইলে আসল উপায় হলো{" "}
                <code className={CODE}>~/.pgpass</code> ফাইল, নিচের মতো।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "~/.pgpass",
          code: `# hostname:port:database:username:password
localhost:5432:island_tours:postgres:আপনার-password-এখানে`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                প্রতিটা লাইন একটা Connection এর জন্য, ক্রম হুবহু এমন:{" "}
                <code className={CODE}>hostname:port:database:username:password</code>।
                প্রথম চারটার যেকোনোটার জায়গায় <code className={CODE}>*</code> দিলে
                সবকিছুর সাথে মিলবে।
              </ListItem>
              <ListItem>
                macOS আর Linux এ ফাইলটা শুধু আপনি পড়তে পারবেন এমন হতে হবে:{" "}
                <code className={CODE}>chmod 0600 ~/.pgpass</code>। Docs অনুযায়ী এর
                চেয়ে খোলা Permission থাকলে psql ফাইলটা উপেক্ষা করে।
              </ListItem>
              <ListItem>
                Windows এ ফাইলের নাম আর জায়গা আলাদা:{" "}
                <code className={CODE}>%APPDATA%\postgresql\pgpass.conf</code>।
              </ListItem>
              <ListItem>
                এই ফাইল কখনো কোনো Project এর ফোল্ডারে রাখবেন না, আর কখনো git এ
                তুলবেন না। এটা শুধু আপনার মেশিনের, আপনার Home ফোল্ডারে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "connection-errors",
      subHeader: { index: "005", title: "Connection Errors" },
      title: <SectionTitle>দরজায় আটকে গেলে psql কী বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Connect করতে গিয়ে প্রথম কয়েকদিন Error আসবেই। ভালো খবর হলো, এখানে
              মাত্র চার রকমের Error ঘুরেফিরে আসে, আর প্রতিটা খুব স্পষ্ট করে বলে কোন
              তথ্যটা ভুল। নিচের চারটাই PostgreSQL 18 এ সত্যিই ঘটিয়ে তোলা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "১. এই নামে কোনো User নেই",
          code: `$ psql -U ripon -d island_tours
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "ripon" does not exist`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "২. এই নামে কোনো Database নেই",
          code: `$ psql -U postgres -d nope
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "nope" does not exist`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "৩. Password ভুল",
          code: `$ psql -h 127.0.0.1 -p 15403 -U postgres -d island_tours
psql: error: connection to server at "127.0.0.1", port 15403 failed: FATAL:  password authentication failed for user "postgres"`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "৪. ওই Port এ কেউ শুনছে না",
          code: `$ psql -h localhost -p 5499 -U postgres
psql: error: connection to server at "localhost" (::1), port 5499 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
connection to server at "localhost" (127.0.0.1), port 5499 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Error এর মূল কথা", "মানে", "প্রথমে যা দেখবেন"],
          rows: [
            [
              "role \"…\" does not exist",
              "Server এ এই নামের কোনো User বা Role নেই",
              "-U দিয়ে ঠিক User দিয়েছেন? -U না দিলে psql আপনার কম্পিউটারের নাম নিয়েছে। নতুন ইনস্টলে সাধারণত postgres থাকে।",
            ],
            [
              "database \"…\" does not exist",
              "Server ঠিক, User ঠিক, কিন্তু Database টা নেই",
              "বানান দেখুন। Database বানানো হয়েছে কি? \\l দিয়ে তালিকা দেখুন। -d না দিলে psql User এর নামের Database খোঁজে।",
            ],
            [
              "password authentication failed",
              "Server পৌঁছেছেন, User আছে, Password মেলেনি",
              "Password আবার টাইপ করুন। ~/.pgpass এ পুরনো Password থেকে গেছে কিনা দেখুন।",
            ],
            [
              "Connection refused",
              "ওই Host আর Port এ কোনো Server শুনছে না",
              "Server চালু আছে? Port ঠিক? Docker হলে Container চলছে আর Port বাইরে খোলা? pg_isready দিয়ে দেখুন।",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>Error এর বানানটাই সূত্র।</strong> প্রথম দুটোয় লেখা{" "}
                <code className={CODE}>on socket</code>, মানে psql একই মেশিনের
                Server এ Socket দিয়ে গিয়েছিল আর Server উত্তর দিয়েছে। Socket এর
                পথটা ইনস্টল অনুযায়ী আলাদা: উপরেরটা Docker এর ভেতরের, আর macOS এ
                Homebrew এর PostgreSQL এ পথটা <code className={CODE}>/tmp</code>। তৃতীয়টায়
                লেখা <code className={CODE}>at &quot;127.0.0.1&quot;, port 15403</code>,
                মানে TCP দিয়ে গিয়েছিল। চতুর্থটায় psql দুবার চেষ্টা করেছে, একবার IPv6
                ঠিকানা <code className={CODE}>::1</code> এ, একবার IPv4{" "}
                <code className={CODE}>127.0.0.1</code> এ, কারণ localhost নামের পেছনে
                দুটো ঠিকানাই আছে। দুবারই দরজা বন্ধ।
              </ContentParagraph>
              <ContentParagraph>
                আর <code className={CODE}>FATAL</code> শব্দটা দেখে ঘাবড়াবেন না। এর
                মানে শুধু এই Connection টা আর চলবে না। Server ঠিকই আছে। Error এর
                প্রতিটা শব্দ পড়ার পুরো কৌশল, ERROR আর FATAL এর তফাত সহ, Lesson 07 এ।
                কোন অপারেটিং সিস্টেমে কেন peer authentication failed আসে, সেটা
                ইনস্টলের সাথে জড়িত, তাই Lesson 01 এ।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "the-prompt",
      subHeader: { index: "006", title: "The Prompt" },
      title: <SectionTitle>island_tours=# এর তিনটা কথা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Connect হলে psql একটা স্বাগত লাইন দেখায়, তারপর অপেক্ষা করে:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql -U postgres -d island_tours
psql (18.6 (Debian 18.6-1.pgdg13+2))
Type "help" for help.

island_tours=#`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষের ওই লেখাটার নাম Prompt। দেখতে সাধারণ, কিন্তু প্রতিটা অক্ষর একটা
              তথ্য। গাড়ির ড্যাশবোর্ডের মতো: এক নজরে গতি, তেল আর গিয়ার। এখানে এক
              নজরে আপনি কোন Database এ, psql কী চাইছে, আর আপনার ক্ষমতা কতটুকু।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PromptAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong># আর &gt; এর তফাত নিজের চোখে দেখুন।</strong> নিচের Session টা
                একজন সাধারণ User এর, যার নাম learner, আর যাকে শুধু পড়ার অনুমতি দেওয়া
                হয়েছে। Prompt এর শেষে # এর বদলে &gt;। আর সে যখন একটা Table খালি
                করার চেষ্টা করল, Server সোজা না বলে দিল।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql -U learner -d island_tours
psql (18.6 (Debian 18.6-1.pgdg13+2))
Type "help" for help.

island_tours=> SELECT count(*) FROM tours;
 count
-------
     9
(1 row)

island_tours=> DELETE FROM tours;
ERROR:  permission denied for table tours
island_tours=>`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "# দেখলে এক সেকেন্ড থামুন",
          content: (
            <ContentParagraph>
              Prompt এ # মানে আপনি Superuser, Server আপনাকে কিছুতেই না বলবে না। ভুল
              Database এ একটা DELETE চালালে কেউ আটকাবে না। তাই Production এ কাজের
              আগে দুটো জিনিস দেখার অভ্যাস করুন: Prompt এর শুরুতে Database এর নাম
              ঠিক আছে কিনা, আর শেষে # নাকি &gt;। রোজকার কাজের জন্য কম ক্ষমতার User
              বানানো, Module 16 এর বিষয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "writing-statements",
      subHeader: { index: "007", title: "Writing Statements" },
      title: <SectionTitle>Enter চাপা মানে পাঠানো না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                নতুনদের সবচেয়ে বড় ধাক্কা এখানেই। একটা Query লিখে Enter চাপলেন, কিছুই
                হলো না। কোনো উত্তর নেই, কোনো Error নেই, শুধু Prompt একটু বদলে গেল।
                মনে হয় psql আটকে গেছে। আসলে psql আপনার কথা শেষ হওয়ার অপেক্ষা করছে।
              </ContentParagraph>
              <ContentParagraph>
                নিয়মটা এই: একটা SQL Statement শেষ হয় Semicolon দিয়ে। Semicolon না
                আসা পর্যন্ত psql প্রতিটা লাইন জমিয়ে রাখে, যে জায়গার নাম Query
                Buffer। Semicolon পেলেই জমে থাকা পুরোটা একবারে Server এ যায়। চিঠি
                লেখার মতো: যতক্ষণ খামে না ভরছেন, ততক্ষণ লিখেই যাচ্ছেন, পোস্ট হচ্ছে
                না।
              </ContentParagraph>
              <ContentParagraph>
                এর একটা বড় সুবিধাও আছে। লম্বা Query কে ইচ্ছামতো ভেঙে কয়েক লাইনে
                লেখা যায়, যাতে পড়তে সহজ হয়। নিচের Lab এ চারটা পরিস্থিতি, প্রতিটার
                প্রতিটা লাইন psql 18 থেকে হুবহু তোলা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <PromptLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>তিনটা চাবি মনে রাখুন:</strong>
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Ctrl+C:</strong> অর্ধেক লেখা Query ফেলে দেয়, অথবা চলতে থাকা
                  একটা লম্বা Query থামায়। psql থেকে বের করে না।
                </ListItem>
                <ListItem>
                  <strong>\q:</strong> psql থেকে বের হওয়ার আসল উপায়। Ctrl+D ও কাজ
                  করে, কারণ সেটা Terminal কে বলে ইনপুট শেষ।
                </ListItem>
                <ListItem>
                  <strong>উপরের তীর চিহ্ন:</strong> আগে লেখা Command ফিরিয়ে আনে, ঠিক
                  Shell এর মতো। Tab চাপলে psql Table আর Column এর নাম পূরণ করার
                  চেষ্টা করে, যদি আপনার psql এ Command-line Editing চালু থাকে, যেটা
                  সাধারণ ইনস্টলে থাকে।
                </ListItem>
              </ContentList>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Prompt এ - দেখলে কী করবেন",
          content: (
            <ContentParagraph>
              আগের লাইনের Query টা যদি শেষ হয়ে থাকে, শুধু একটা Semicolon দিয়ে Enter
              চাপুন, Query চলে যাবে। আর যদি বুঝতে না পারেন কী জমে আছে, Ctrl+C চেপে
              সব ফেলে দিয়ে নতুন করে লিখুন। কখনো জমে থাকা অবস্থায় নতুন Query লেখা
              শুরু করবেন না, Lab এর দ্বিতীয় পরিস্থিতির মতো দুটো জোড়া লেগে যাবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "two-kinds",
      subHeader: { index: "008", title: "Two Kinds of Commands" },
      title: <SectionTitle>SQL আর Backslash Command</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                psql এর Prompt এ দুই রকম জিনিস লেখা যায়, আর দুটোর নিয়ম আলাদা।
                প্রথমটা SQL, যেটা শিখতেই এই পুরো ট্র্যাক: SELECT, INSERT, CREATE
                TABLE। psql এগুলো বোঝার চেষ্টাও করে না, শুধু Server এ পৌঁছে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা Meta-command। এগুলো শুরু হয় একটা Backslash দিয়ে, যেমন{" "}
                <code className={CODE}>\dt</code> বা{" "}
                <code className={CODE}>\q</code>। এগুলো SQL না, psql এর নিজের ভাষা।
                psql নিজেই এগুলো সামলায়, Enter চাপলেই চলে, Semicolon লাগে না। আর এই
                কারণেই এগুলো pgAdmin বা আপনার Node.js কোডে চলবে না, শুধু psql এ।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TwoKindsSplit />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>দুটো সাহায্যের Command আগে চিনে রাখুন,</strong> কারণ বাকি
                সবকিছু এরা মনে করিয়ে দেবে।{" "}
                <code className={CODE}>\?</code> দেখায় psql এর সব Meta-command এর
                তালিকা, আর <code className={CODE}>\h</code> দেখায় SQL Command এর
                লেখার নিয়ম। নিচে দুটোরই শুরুর কয়েক লাইন, PostgreSQL 18 থেকে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "island_tours=# \\?",
          code: String.raw`General
  \copyright             show PostgreSQL usage and distribution terms
  \crosstabview [COLUMNS] execute query and display result in crosstab
  \errverbose            show most recent error message at maximum verbosity
  \g [(OPTIONS)] [FILE]  execute query (and send result to file or |pipe);
                         \g with no arguments is equivalent to a semicolon
  \gdesc                 describe result of query, without executing it
  ...`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "island_tours=# \\h SELECT",
          code: `Command:     SELECT
Description: retrieve rows from a table or view
Syntax:
[ WITH [ RECURSIVE ] with_query [, ...] ]
SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ] ]
    [ { * | expression [ [ AS ] output_name ] } [, ...] ]
    [ FROM from_item [, ...] ]
    [ WHERE condition ]
    [ GROUP BY [ ALL | DISTINCT ] grouping_element [, ...] ]
    [ HAVING condition ]
    ...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <code className={CODE}>\h</code> এর ভেতরের বর্গ বন্ধনী আর খাড়া দাগ দেখে
              এখন ঘাবড়ানোর কিছু নেই। ওগুলো একটা নির্দিষ্ট পড়ার নিয়ম, যার নাম
              Synopsis, আর সেটা পড়া শিখবেন Lesson 07 এ। আপাতত শুধু জেনে রাখুন,
              কোনো SQL Command এর বানান ভুলে গেলে Google এর আগে{" "}
              <code className={CODE}>\h</code> আছে, আর সেটা ঠিক আপনার Version এর।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Meta-command এর শেষে Semicolon দিলে",
          content: (
            <ContentParagraph>
              অভ্যাসবশত <code className={CODE}>\dt;</code> লিখে ফেললে psql 18 এ ক্ষতি
              নেই, সাধারণ <code className={CODE}>\dt</code> এর মতোই একই তালিকা আসে,
              পরীক্ষা করে দেখা। কিন্তু দরকারও নেই। নিয়মটা উল্টো দিকে মনে রাখুন:
              SQL এ Semicolon বাধ্যতামূলক, Meta-command এ লাগে না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "looking-around",
      subHeader: { index: "009", title: "Looking Around" },
      title: <SectionTitle>অচেনা Database এ চোখ বুলানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                নতুন একটা বাড়িতে ঢুকলে প্রথমে চোখ বুলিয়ে নেন কোথায় কোন ঘর। নতুন
                একটা Database এও তাই। psql এর Meta-command গুলোর বেশিরভাগ শুরু হয়{" "}
                <code className={CODE}>\d</code> দিয়ে, মানে describe, আর পরের অক্ষর
                বলে কী দেখতে চান: <code className={CODE}>t</code> মানে Table,{" "}
                <code className={CODE}>n</code> মানে Schema (namespace),{" "}
                <code className={CODE}>u</code> মানে User,{" "}
                <code className={CODE}>f</code> মানে Function,{" "}
                <code className={CODE}>v</code> মানে View। এই নকশাটা ধরে ফেললে
                আলাদা আলাদা মুখস্থ করতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ প্রতিটা Command বেছে নিন। Output গুলো Island Tours
                Database Load করা একটা PostgreSQL 18 থেকে হুবহু।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <MetaCommandLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>Database বদলাতে <code className={CODE}>\c</code>।</strong>{" "}
                বের হয়ে নতুন করে Connect না করে, একই Session থেকে অন্য Database এ
                যাওয়া যায়। লক্ষ করুন Prompt এর নাম সাথে সাথে বদলে যায়, এটাই আপনার
                নিরাপত্তার চিহ্ন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: String.raw`island_tours=# \c postgres
You are now connected to database "postgres" as user "postgres".
postgres=# \c island_tours
You are now connected to database "island_tours" as user "postgres".
island_tours=#`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>আরও বিস্তারিত চাইলে <code className={CODE}>+</code>।</strong>{" "}
              প্রায় প্রতিটা <code className={CODE}>\d</code> Command এর শেষে একটা +
              দিলে বাড়তি তথ্য আসে, যেমন <code className={CODE}>\dt+</code> প্রতিটা
              Table এর Size দেখায়, আর <code className={CODE}>\l+</code> প্রতিটা
              Database এর Size। কোন Table জায়গা খাচ্ছে, সেটা খোঁজার প্রথম ধাপ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "psql", "MySQL Client (mysql)"],
          rows: [
            ["সব Database দেখা", "\\l", "SHOW DATABASES;"],
            ["অন্য Database এ যাওয়া", "\\c island_tours", "USE island_tours;"],
            ["সব Table দেখা", "\\dt", "SHOW TABLES;"],
            ["একটা Table এর গঠন", "\\d tours", "DESCRIBE tours;"],
            ["একটা Row খাড়া করে দেখা", "\\x তারপর Query, অথবা Query শেষে \\gx", "Query শেষে ; এর বদলে \\G"],
            ["একটা SQL ফাইল চালানো", "\\i file.sql", "source file.sql"],
            ["বের হওয়া", "\\q", "exit, quit অথবা \\q"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MySQL এ \\c মানে একদম অন্য জিনিস",
          content: (
            <ContentParagraph>
              MySQL এর অফিসিয়াল Docs অনুযায়ী mysql Client এ <code className={CODE}>\c</code>{" "}
              মানে clear, অর্থাৎ অর্ধেক লেখা Statement ফেলে দেওয়া। psql এ{" "}
              <code className={CODE}>\c</code> মানে connect, অন্য Database এ যাওয়া।
              দুই Tool পাশাপাশি ব্যবহার করলে এই একটা অক্ষর গুলিয়ে ফেলা খুব সহজ। MySQL
              এ Database বদলাতে <code className={CODE}>USE</code> লিখুন। Module 01
              এর{" "}
              <Link href="/sql/topic/what-is-sql" className={LINK}>
                Lesson 05
              </Link>{" "}
              এ দুই Dialect এর পুরো তুলনা আছে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "wide-results",
      subHeader: { index: "010", title: "Wide Results" },
      title: <SectionTitle>চওড়া Result পড়ার কৌশল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একটা Customer এর পুরো Row চাইলে কী হয়, দেখুন। সাতটা Column এক লাইনে
              এঁটে গেছে, কিন্তু Terminal একটু ছোট হলেই লাইনগুলো ভেঙে পরের লাইনে
              গড়িয়ে যাবে, আর কোন মান কোন Column এর, বোঝা কঠিন হয়ে পড়বে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: `island_tours=# SELECT * FROM customers WHERE customer_id = 1;
 customer_id |  full_name  |          email           |     phone      | city  |  country   |       joined_at
-------------+-------------+--------------------------+----------------+-------+------------+------------------------
           1 | Rahim Uddin | rahim.uddin@mail.example | +8801000000101 | Dhaka | Bangladesh | 2025-11-02 04:12:00+00
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এর সমাধান <code className={CODE}>\x</code>, Expanded Display। চালু
              করলে প্রতিটা Row আড়াআড়ি না হয়ে খাড়া হয়ে যায়, প্রতিটা Column নিজের
              লাইনে, বামে নাম আর ডানে মান। একটা Row খুঁটিয়ে দেখার জন্য সবচেয়ে
              আরামদায়ক।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: String.raw`island_tours=# \x
Expanded display is on.
island_tours=# SELECT * FROM customers WHERE customer_id = 1;
-[ RECORD 1 ]-------------------------
customer_id | 1
full_name   | Rahim Uddin
email       | rahim.uddin@mail.example
phone       | +8801000000101
city        | Dhaka
country     | Bangladesh
joined_at   | 2025-11-02 04:12:00+00

island_tours=# \x
Expanded display is off.
island_tours=# \x auto
Expanded display is used automatically.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code className={CODE}>\x</code> একবার দিলে চালু, আরেকবার দিলে বন্ধ।
              </ListItem>
              <ListItem>
                <code className={CODE}>\x auto</code> সবচেয়ে কাজের: Result পর্দায়
                আঁটলে সাধারণ Table, না আঁটলে নিজে থেকেই খাড়া। একবার দিয়ে ভুলে যান।
              </ListItem>
              <ListItem>
                শুধু একটা Query খাড়া দেখতে চাইলে শেষে Semicolon এর বদলে{" "}
                <code className={CODE}>\gx</code> দিন। psql এর Docs বলে এটা{" "}
                <code className={CODE}>\g</code> এর মতোই, শুধু ওই একটা Query তে
                Expanded চালু করে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "সময়টা +00 কেন, Dhaka তো +06",
          content: (
            <ContentParagraph>
              উপরের joined_at দেখাচ্ছে 04:12:00+00, অথচ Sample Database এ লেখা আছে
              Dhaka সময় 10:12। দুটো একই মুহূর্ত। এই Output টা Docker এর ভেতরের
              PostgreSQL থেকে নেওয়া, আর Docker Image এর Server সময় দেখায় UTC তে।
              আপনার নিজের মেশিনে সাধারণ ইনস্টলে Server সাধারণত মেশিনের Time Zone
              নেয়, তাই সেখানে +06 দেখা স্বাভাবিক। Data বদলায়নি, শুধু দেখানোর ধরন।
              পুরো ব্যাপারটা Module 04 এর Dates, Times and Time Zones লেসনে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>NULL কে চোখে দেখা।</strong> সাধারণভাবে psql একটা NULL ঘরকে
                ফাঁকা দেখায়, আর ফাঁকা লেখা আর NULL তখন আলাদা করা যায় না।{" "}
                <code className={CODE}>\pset null</code> দিয়ে NULL এর জন্য একটা
                চিহ্ন বেছে নিন:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: String.raw`island_tours=# \pset null '[NULL]'
Null display is "[NULL]".
island_tours=# SELECT full_name, phone FROM customers WHERE phone IS NULL LIMIT 2;
  full_name   | phone
--------------+--------
 Tanvir Ahmed | [NULL]
 Mitu Rahman  | [NULL]
(2 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>লম্বা Result আর Pager।</strong> Result পর্দার চেয়ে লম্বা হলে
              psql সেটা একটা Pager Program এর হাতে দেয়, সাধারণত less বা more। তখন
              মনে হতে পারে psql আটকে গেছে, নিচে একটা : বা END লেখা। আটকায়নি: Space
              চাপলে পরের পাতা, আর <code className={CODE}>q</code> চাপলে Pager থেকে
              বের হয়ে আবার Prompt। Pager একদম না চাইলে{" "}
              <code className={CODE}>\pset pager off</code>।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "files-and-scripts",
      subHeader: { index: "011", title: "Files and Scripts" },
      title: <SectionTitle>ফাইল থেকে চালানো, ফাইলে লেখা, Script এ ব্যবহার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                প্রতিবার Prompt এ হাতে লেখা ঝুঁকির। লম্বা Query, Table বানানোর
                Command, প্রতি মাসে চালানোর Report, এগুলো একটা .sql ফাইলে রাখাই
                ভালো। ফাইলটা git এ থাকে, অন্যরা দেখতে পারেন, আর প্রতিবার হুবহু একই
                জিনিস চলে। psql ফাইলের সাথে কাজ করার চারটা উপায় দেয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Session এর ভেতর থেকে:</strong>{" "}
                <code className={CODE}>\i</code> একটা ফাইল পড়ে চালায়, যেন আপনি নিজে
                টাইপ করেছেন। <code className={CODE}>\o</code> এর পরের Query গুলোর
                Result পর্দার বদলে একটা ফাইলে লেখে, আর শুধু{" "}
                <code className={CODE}>\o</code> দিলে আবার পর্দায় ফেরে।{" "}
                <code className={CODE}>\!</code> psql থেকে বের না হয়েই একটা Shell
                Command চালায়।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: String.raw`island_tours=# \i /tmp/top_tours.sql
           title            | price_bdt
----------------------------+-----------
 Saint Martin Luxury Stay   |  32000.00
 Sundarbans Mangrove Cruise |  18000.00
 Cox's Bazar Family Package |  15500.00
(3 rows)

island_tours=# \o /tmp/report.txt
island_tours=# SELECT count(*) AS bookings FROM bookings;
island_tours=# \o
island_tours=# \! cat /tmp/report.txt
 bookings
----------
       24
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              লক্ষ করুন, <code className={CODE}>\o</code> চালু থাকা অবস্থায় count
              এর Query চালানোর পর পর্দায় কিছুই আসেনি। Result টা চুপচাপ ফাইলে চলে
              গেছে, আর <code className={CODE}>\!</code> দিয়ে ফাইলটা পড়ে দেখা গেল।
              আর <code className={CODE}>\e</code> আপনার Text Editor খুলে দেয়: Docs
              অনুযায়ী এখনকার Query Buffer, অথবা সেটা খালি থাকলে শেষ চালানো Query,
              Editor এ আসে, আর Editor বন্ধ করলে লেখাটা psql এর Buffer এ ফিরে আসে। লম্বা
              Query ঠিক করার জন্য আরামদায়ক।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>Session না খুলেই, বাইরে থেকে:</strong> এখানে psql একটা
                Automation Tool হয়ে যায়।{" "}
                <code className={CODE}>-c</code> একটা Command চালিয়ে বের হয়ে আসে,{" "}
                <code className={CODE}>-f</code> একটা পুরো ফাইল চালিয়ে বের হয়।
                Deploy Script, Cron Job আর CI Pipeline ঠিক এভাবেই Database এ কাজ
                করে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: `$ psql -U postgres -d island_tours -c "SELECT count(*) FROM customers;"
 count
-------
    15
(1 row)

$ psql -U postgres -d island_tours -At -c "SELECT count(*) FROM customers;"
15

$ psql -U postgres -d island_tours --csv -c "SELECT tour_id, title, price_bdt FROM tours WHERE price_bdt < 9000 ORDER BY tour_id;"
tour_id,title,price_bdt
2,Cox's Bazar Beach Weekend,8500.00
6,Sylhet Tea Garden Tour,7800.00
7,Ratargul Swamp Boat Day,3500.00`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <code className={CODE}>-A</code> মানে unaligned, ঘর মেলানোর ফাঁকা
                জায়গা বাদ। <code className={CODE}>-t</code> মানে tuples only, Column
                এর নাম আর শেষের (1 row) বাদ। দুটো একসাথে{" "}
                <code className={CODE}>-At</code> দিলে শুধু খালি মানটা আসে, যেটা
                একটা Shell Script সরাসরি একটা Variable এ রাখতে পারে।
              </ListItem>
              <ListItem>
                <code className={CODE}>--csv</code> দিলে Result আসে CSV তে, Excel বা
                Google Sheets এ সরাসরি খোলা যায়। কেউ একটা Report চাইলে সবচেয়ে
                দ্রুত পথ।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>এবার সবচেয়ে জরুরি অংশ: Script এর মাঝখানে Error।</strong>{" "}
                ধরুন একটা ফাইলে তিনটা UPDATE, আর দ্বিতীয়টায় একটা Column এর বানান
                ভুল। psql কি থামবে? Default উত্তর অনেককে চমকে দেয়: না। Error দেখিয়ে
                পরের লাইন চালিয়ে যায়, আর শেষে বলে সব ঠিক আছে। নিচের Lab এ দুইভাবেই
                চালিয়ে দেখুন, দুটোই সত্যিকারের Run।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ScriptStopLab />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "নিয়ম: ফাইল চালাতে সবসময় ON_ERROR_STOP",
          content: (
            <ContentParagraph>
              কোনো ফাইল <code className={CODE}>-f</code> দিয়ে চালালে সাথে{" "}
              <code className={CODE}>-v ON_ERROR_STOP=1</code> দিন, বিশেষ করে যে ফাইল
              Data বদলায়। প্রথম Error এই থেমে যাবে আর Exit Code 3 দেবে, যাতে
              আপনি এবং আপনার Script দুজনেই জানেন কিছু ভুল হয়েছে। Session এর ভেতর
              থেকে একই কাজ <code className={CODE}>\set ON_ERROR_STOP on</code>।
              সবকিছু হয় পুরো হবে নয়তো কিছুই না, এমন নিশ্চয়তা চাইলে লাগে Transaction,
              সেটা Module 12 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "psqlrc",
      subHeader: { index: "012", title: "Your .psqlrc" },
      title: <SectionTitle>psql কে নিজের মতো করে সাজানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিবার psql খুলে <code className={CODE}>\x auto</code> আর{" "}
              <code className={CODE}>\pset null</code> লেখা ক্লান্তিকর। psql শুরু
              হওয়ার সময় আপনার Home ফোল্ডারের <code className={CODE}>~/.psqlrc</code>{" "}
              ফাইলটা পড়ে নেয়, আর তার ভেতরের Meta-command গুলো নিজে থেকে চালায়।
              নিচে একটা ছোট, নিরাপদ শুরু।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "~/.psqlrc",
          code: String.raw`\set QUIET 1
\pset null '[NULL]'
\x auto
\set PROMPT1 '%n@%/%R%# '
\unset QUIET`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentList>
                <ListItem>
                  <code className={CODE}>\set QUIET 1</code> আর শেষের{" "}
                  <code className={CODE}>\unset QUIET</code> শুধু এটুকু করে যাতে
                  শুরুর সময় প্রতিটা Setting এর জন্য আলাদা বার্তা না আসে।
                </ListItem>
                <ListItem>
                  NULL কে চোখে দেখা, আর চওড়া Result নিজে থেকে খাড়া, আগের অংশের দুটো
                  কৌশল।
                </ListItem>
                <ListItem>
                  <code className={CODE}>PROMPT1</code> Prompt টাই বদলে দেয়।{" "}
                  <code className={CODE}>%n</code> হলো User এর নাম,{" "}
                  <code className={CODE}>%/</code> Database এর নাম, আর{" "}
                  <code className={CODE}>%R</code> আর <code className={CODE}>%#</code>{" "}
                  সেই চেনা = আর #। এখন Prompt বলে দেয় আপনি কে হয়ে কোথায় আছেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফাইলটা রেখে psql খুললে ফল এমন, PostgreSQL 18 এ পরীক্ষা করা:
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "psql",
          code: `postgres@island_tours=# SELECT full_name, phone FROM customers WHERE customer_id = 3;
  full_name   | phone
--------------+--------
 Tanvir Ahmed | [NULL]
(1 row)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কিছু অদ্ভুত লাগলে -X",
          content: (
            <ContentParagraph>
              <code className={CODE}>.psqlrc</code> এর কোনো লাইনের কারণে psql অদ্ভুত
              আচরণ করছে কিনা সন্দেহ হলে <code className={CODE}>psql -X</code> দিয়ে
              চালান। Docs অনুযায়ী <code className={CODE}>-X</code> মানে start-up ফাইল
              একদম পড়বে না। আর Script এ psql চালালে{" "}
              <code className={CODE}>-X</code> দেওয়া ভালো অভ্যাস, যাতে আপনার
              ব্যক্তিগত Setting Script এর Output বদলে না দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it-yourself",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>প্রতিটা Meta-command এর পেছনে একটা SQL</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এই পাতার Query বক্সগুলোতে আসল PostgreSQL চলে, কিন্তু psql চলে না।
                তাই এখানে <code className={CODE}>\dt</code> লিখলে কাজ করবে না,
                কারণ সেটা psql এর ভাষা, Server এর না। তাহলে psql নিজে{" "}
                <code className={CODE}>\dt</code> এর উত্তর জানে কীভাবে?
              </ContentParagraph>
              <ContentParagraph>
                রহস্যটা হলো, psql নিজেও লুকিয়ে Server কে একটা সাধারণ SQL পাঠায়। psql
                কে <code className={CODE}>-E</code> দিয়ে চালালে সেই লুকানো Query টা
                দেখায়। এটা psql এর সাথে PostgreSQL এর ভেতরটা শেখারও একটা দারুণ
                পথ।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal",
          code: String.raw`$ psql -U postgres -d island_tours -E -c '\dt'
/******** QUERY *********/
SELECT n.nspname as "Schema",
  c.relname as "Name",
  CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' ... END as "Type",
  pg_catalog.pg_get_userbyid(c.relowner) as "Owner"
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
     ...
/************************/

              List of tables
 Schema |     Name     | Type  |  Owner
--------+--------------+-------+----------
 public | bookings     | table | postgres
 ...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের প্রথম বক্সে ঠিক সেই লুকানো Query টা হুবহু আছে, কিছুই বাদ দেওয়া
              হয়নি। Run চাপুন, <code className={CODE}>\dt</code> এর একই আটটা Row
              আসবে। SQL এর নিয়ম এখনো জানার দরকার নেই, এটা Module 03 এর পরে নিজেই
              পড়তে পারবেন। আপাতত শুধু দেখুন যে psql এর কোনো জাদু নেই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="\dt এর লুকানো Query, হুবহু"
              query={`SELECT n.nspname as "Schema",
  c.relname as "Name",
  CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 't' THEN 'TOAST table' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END as "Type",
  pg_catalog.pg_get_userbyid(c.relowner) as "Owner"
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
     LEFT JOIN pg_catalog.pg_am am ON am.oid = c.relam
WHERE c.relkind IN ('r','p','')
      AND n.nspname <> 'pg_catalog'
      AND n.nspname !~ '^pg_toast'
      AND n.nspname <> 'information_schema'
  AND pg_catalog.pg_table_is_visible(c.oid)
ORDER BY 1,2;`}
              caption="PostgreSQL তার নিজের সব Table এর তালিকা রাখে কিছু বিশেষ Table এ, যাদের নাম শুরু হয় pg_ দিয়ে, যেমন pg_class। এদের একসাথে বলে System Catalog। psql এর প্রতিটা \d Command এই Catalog কেই প্রশ্ন করে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Catalog এর Query গুলো লম্বা আর PostgreSQL এর নিজস্ব। SQL Standard এ
              একই প্রশ্নের একটা সহজ, সব Database এ প্রায় একই রকম উত্তর আছে:{" "}
              <code className={CODE}>information_schema</code>। নিচের দুই বক্সে{" "}
              <code className={CODE}>\dt</code> আর{" "}
              <code className={CODE}>\d tours</code> এর কাছাকাছি উত্তর, সেই সহজ পথে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="\dt, information_schema দিয়ে"
              query={`SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;`}
              caption="আটটা Table এর নাম, \dt এর মতোই। information_schema SQL Standard এর অংশ, তাই MySQL এও এই একই Query প্রায় হুবহু চলে, শুধু table_schema তে public এর বদলে Database এর নাম দিতে হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="\d tours, information_schema দিয়ে"
              query={`SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tours'
ORDER BY ordinal_position;`}
              caption="নয়টা Column, ক্রম অনুযায়ী। \d tours এ price_bdt দেখায় numeric(10,2), এখানে শুধু numeric, কারণ এই View দশমিকের হিসাবটা আলাদা Column এ রাখে। আর is_nullable এর NO মানে \d এর not null।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="\conninfo এর কাছাকাছি"
              query={`SELECT current_user, current_database();`}
              caption="কে হয়ে কোন Database এ আছেন, দুটো Function দিয়ে। এই বক্সের PostgreSQL এ Sample Database টা postgres নামের Database এ Load করা, তাই উত্তরে postgres আসবে। আপনার মেশিনে Lesson 06 এর পরে একই Query island_tours বলবে।"
            />
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এ psql এর একটা সত্যিকারের রাত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ফিরে যাই শুরুর সেই রাত এগারোটায়। বুকিং ১৭ এর অবস্থা দেখতে হবে।
                এবার আপনি জানেন প্রতিটা ধাপে কী করবেন, আর কেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ঢোকা:</strong> Island Tours এর Database চলে VPS এর ভেতরে
                  Docker এ। SSH করে Server এ ঢোকার পর{" "}
                  <code className={CODE}>docker exec -it island-pg psql -U postgres -d island_tours</code>।
                  Port খুলতে হলো না, Password টাইপ করতে হলো না, কারণ Container এর
                  ভেতরের Socket দিয়ে ঢুকলেন।
                </ListItem>
                <ListItem>
                  <strong>যাচাই:</strong> Prompt এ <code className={CODE}>island_tours=#</code>।
                  Database ঠিক, আর # বলছে আপনি Superuser, তাই এখন থেকে শুধু পড়বেন,
                  কিছু বদলাবেন না।
                </ListItem>
                <ListItem>
                  <strong>খাড়া করে দেখা:</strong> <code className={CODE}>\x auto</code>,
                  তারপর বুকিং ১৭ এর Row। একটা Row এর সব Column এক নজরে।
                </ListItem>
                <ListItem>
                  <strong>সংযোগ খোঁজা:</strong> <code className={CODE}>\d bookings</code>{" "}
                  দেখিয়ে দিল payments Table টা Referenced by অংশে আছে, মানে
                  Payment খুঁজতে হবে booking_id দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>সমাধানের পরে:</strong> Senior Developer যে ঠিক করার Script
                  দিলেন, সেটা হাতে টাইপ না করে একটা ফাইলে রেখে{" "}
                  <code className={CODE}>psql -v ON_ERROR_STOP=1 -f fix.sql</code>{" "}
                  দিয়ে চালালেন, যাতে কোনো লাইন ভুল হলে সেখানেই থামে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একই দিন সকালে Accounts থেকে গত মাসের সব Payment এর একটা তালিকা
                চাইল। Excel এ খোলা যায় এমন। আপনি একটা Command লিখলেন,{" "}
                <code className={CODE}>--csv</code> দিয়ে, Output একটা ফাইলে পাঠালেন,
                আর ফাইলটা পাঠিয়ে দিলেন। কোনো GUI খুলতে হলো না।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "আপনার my-tours এ",
          content: (
            <ContentParagraph>
              নিজের প্রজেক্টের জন্য একটা <code className={CODE}>sql</code> ফোল্ডার
              বানান, আর প্রতিটা দরকারি Query সেখানে একটা করে ফাইলে রাখুন: টুরের
              তালিকা, আজকের বুকিং, মাসের আয়। প্রতিটা ফাইল চালাবেন{" "}
              <code className={CODE}>\i</code> অথবা{" "}
              <code className={CODE}>psql -f</code> দিয়ে। এই ট্র্যাক যত এগোবে,
              ফোল্ডারটা আপনার নিজের SQL এর একটা বই হয়ে উঠবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Terminal খোলা থেকে বের হওয়া পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "psql আছে কিনা দেখুন",
              description:
                "Terminal এ psql --version। Version না এলে psql আপনার PATH এ নেই, Lesson 01 এ ফিরে যান। Server এর Version এর সাথে মিলিয়ে নিন।",
            },
            {
              title: "পাঁচটা তথ্য ঠিক করুন",
              description:
                "Host, Port, User, Database, আর Password কোথা থেকে আসবে। নিজের মেশিনে বেশিরভাগ ডিফল্টেই চলে, Docker বা দূরের Server এ সব লিখতে হয়।",
            },
            {
              title: "Connect করুন",
              description:
                "Flag দিয়ে, URI দিয়ে, অথবা Docker এর ভেতর থেকে docker exec দিয়ে। Password চাইলে টাইপ করুন, পর্দায় কিছু না দেখালেও।",
            },
            {
              title: "Error এলে শব্দটা পড়ুন",
              description:
                "role does not exist, database does not exist, password authentication failed, নাকি Connection refused। প্রতিটা বলে দেয় পাঁচটা তথ্যের কোনটা ভুল।",
            },
            {
              title: "Prompt যাচাই করুন",
              description:
                "শুরুতে Database এর নাম ঠিক কিনা, শেষে # নাকি >। ভুল Database এ থাকলে \\c দিয়ে বদলান।",
            },
            {
              title: "চারপাশ দেখুন",
              description:
                "\\dt দিয়ে Table, \\d table_name দিয়ে একটা Table এর গঠন, \\x auto দিয়ে চওড়া Result সামলানো।",
            },
            {
              title: "SQL লিখুন, শেষে Semicolon",
              description:
                "যত লাইনে খুশি ভেঙে লিখুন। Semicolon না দেওয়া পর্যন্ত কিছু যাবে না। Prompt এ - দেখলে আগের Statement খোলা। ভুল হলে Ctrl+C।",
            },
            {
              title: "বড় কাজ ফাইলে রাখুন",
              description:
                "Session থেকে \\i, বাইরে থেকে psql -v ON_ERROR_STOP=1 -f। একবার চালানো Query বারবার লাগলে সেটা ফাইলের জিনিস।",
            },
            {
              title: "বের হোন",
              description:
                "\\q। Ctrl+C বের করে না, শুধু জমে থাকা লেখা ফেলে দেয়।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "common-mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভুল", "কী দেখা যায়", "ঠিক উপায়"],
          rows: [
            [
              "Semicolon ভুলে যাওয়া",
              "Enter চাপার পরে কিছুই হয় না, Prompt এ - চলে আসে",
              "পরের লাইনে শুধু ; দিন। নতুন Query শুরু করবেন না।",
            ],
            [
              "SQL কে Shell এ টাইপ করা",
              "zsh: command not found: SELECT",
              "আগে psql খুলুন, Prompt এ =# বা => দেখার পরে SQL লিখুন।",
            ],
            [
              "psql Command কে psql এর ভেতরে টাইপ করা",
              "island_tours=# psql -d postgres লিখে Error",
              "ভেতরে থাকলে \\c postgres। psql -d ... শুধু বাইরের Shell এ।",
            ],
            [
              "Ctrl+C দিয়ে বের হওয়ার চেষ্টা",
              "Prompt থেকে যায়, শুধু ^C দেখায়",
              "\\q অথবা Ctrl+D।",
            ],
            [
              "Pager কে আটকে যাওয়া ভাবা",
              "নিচে : বা END, কিছু টাইপ করা যায় না",
              "q চাপুন। বারবার হলে \\pset pager off।",
            ],
            [
              "ভুল Database এ কাজ",
              "Table খুঁজে পাওয়া যায় না, অথবা ভুল জায়গায় পরিবর্তন",
              "প্রতিটা বদলের আগে Prompt এর নাম পড়ুন, দরকারে \\conninfo।",
            ],
            [
              "Password Command এ লেখা",
              "Shell History তে আর Screenshot এ Password",
              "psql কে জিজ্ঞেস করতে দিন, অথবা chmod 0600 করা ~/.pgpass।",
            ],
            [
              "ফাইল চালানো ON_ERROR_STOP ছাড়া",
              "মাঝের Error এর পরেও বাকি লাইন চলে, Exit Code 0",
              "psql -v ON_ERROR_STOP=1 -f file.sql",
            ],
            [
              "Query বক্সে \\dt লেখা",
              "Query বক্স Syntax Error দেখায়",
              "Meta-command শুধু psql এ। বক্সে information_schema এর SQL চালান।",
            ],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "best-resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>psql, অফিসিয়াল Docs।</strong> প্রতিটা Flag, প্রতিটা
                Meta-command, Prompt এর প্রতিটা চিহ্ন আর Exit Code এর মানে, এই
                লেসনের সব দাবি এখান থেকে মিলিয়ে নেওয়া। পুরোটা একবারে পড়ার জিনিস না,
                দরকারের সময় খোঁজার জিনিস।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/app-psql.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/app-psql.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Accessing a Database, PostgreSQL Tutorial।</strong> psql
                দিয়ে প্রথমবার Database এ ঢোকার অফিসিয়াল ছোট পরিচয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/tutorial-accessdb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/tutorial-accessdb.html
                </a>
              </ListItem>
              <ListItem>
                <strong>The Password File।</strong> ~/.pgpass এর পুরো নিয়ম, Windows
                এর জায়গা আর Permission সহ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/libpq-pgpass.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/libpq-pgpass.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Environment Variables।</strong> PGHOST থেকে শুরু করে সব
                Variable, আর PGPASSWORD কেন সুপারিশ করা হয় না।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/libpq-envars.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/libpq-envars.html
                </a>
              </ListItem>
              <ListItem>
                <strong>mysql Client Commands।</strong> MySQL এর Client এর নিজের
                Command এর তালিকা, যেখানে \G, \c আর source এর মানে লেখা।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/mysql-commands.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/mysql-commands.html
                </a>
              </ListItem>
              <ListItem>
                <strong>যে MySQL কোর্সটা পাশাপাশি দেখছেন।</strong> ভিডিওতে
                Command লেখার সময় MySQL এর Client বা তার GUI ব্যবহার হয়। এই লেসনের
                MySQL তুলনার Table পাশে রাখলে ভিডিওর প্রতিটা Command psql এ অনুবাদ
                করতে পারবেন।{" "}
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
            <>
              <ContentList>
                <ListItem>
                  psql হলো PostgreSQL এর সাথে আসা Terminal Client। Server না, Server
                  এর কাছে প্রশ্ন পৌঁছে দেওয়া Program। Version Server এর সমান বা নতুন
                  রাখুন।
                </ListItem>
                <ListItem>
                  Connect করতে পাঁচটা তথ্য: Host, Port, User, Database, Password।
                  Flag, URI আর Environment Variable, তিনভাবে বলা যায়। Password কখনো
                  Command এ না, দরকারে ~/.pgpass।
                </ListItem>
                <ListItem>
                  Connection Error চার রকম: role does not exist, database does not
                  exist, password authentication failed, Connection refused। প্রতিটা
                  বলে কোন তথ্যটা ভুল।
                </ListItem>
                <ListItem>
                  Prompt তিন কথা বলে: কোন Database, psql নতুন Statement চাইছে (=) না
                  বাকি অংশ (-, (, &apos;), আর Superuser (#) নাকি সাধারণ User (&gt;)।
                </ListItem>
                <ListItem>
                  SQL শেষ হয় Semicolon এ, তার আগে কিছুই Server এ যায় না।
                  Meta-command শুরু Backslash এ, psql নিজে সামলায়। Ctrl+C লেখা ফেলে,
                  \q বের করে।
                </ListItem>
                <ListItem>
                  চারপাশ দেখতে \l, \c, \dt, \d, \dn, \du, \df, \dv, \conninfo। চওড়া
                  Result এর জন্য \x auto, NULL দেখতে \pset null।
                </ListItem>
                <ListItem>
                  ফাইলের জন্য \i, \o, \e, বাইরে থেকে -c আর -f, Script এর জন্য -At আর
                  --csv। ফাইল চালালে সবসময় -v ON_ERROR_STOP=1।
                </ListItem>
                <ListItem>
                  প্রতিটা Meta-command আসলে System Catalog এর উপর একটা SQL, -E দিয়ে
                  দেখা যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                পরের লেসনে একই Database কে মাউস দিয়ে দেখবেন, pgAdmin, DBeaver আর
                অন্য GUI Tool দিয়ে। psql এর পাঁচটা তথ্য সেখানে একটা ফর্মের পাঁচটা ঘর
                হয়ে আসবে, তাই এই লেসন বুঝে থাকলে সেটা পাঁচ মিনিটের কাজ।{" "}
                <Link href="/sql/topic/gui-clients" className={LINK}>
                  Lesson 04: GUI Clients
                </Link>
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["ধারণা", "এক লাইনে", "Command"],
    rows: [
      ["psql", "PostgreSQL এর Terminal Client, Server না", "psql --version"],
      ["পাঁচটা তথ্য", "Host, Port, User, Database, Password", "psql -h -p -U -d"],
      ["Connection URI", "সব তথ্য এক লাইনে", "psql \"postgresql://user@host:5432/db\""],
      ["Environment Variable", "একবার বলে রাখা, প্রতিবার না লেখা", "PGHOST, PGPORT, PGUSER, PGDATABASE"],
      ["~/.pgpass", "Password রাখার নিরাপদ ফাইল", "chmod 0600 ~/.pgpass"],
      ["Prompt", "Database, অবস্থা, আর Superuser কিনা", "island_tours=#"],
      ["Query Buffer", "Semicolon না আসা পর্যন্ত লেখা জমে থাকে", "; পাঠায়, Ctrl+C ফেলে"],
      ["Meta-command", "Backslash এ শুরু, psql এর নিজের ভাষা", "\\? , \\h"],
      ["চারপাশ দেখা", "Database, Table, Schema, User, Function, View", "\\l \\dt \\d \\dn \\du \\df \\dv"],
      ["Expanded Display", "চওড়া Row খাড়া করে দেখা", "\\x auto, \\gx"],
      ["ফাইল", "ফাইল থেকে চালানো, ফাইলে লেখা", "\\i, \\o, \\e"],
      ["Script", "Session ছাড়া, Automation এর জন্য", "-c, -f, -At, --csv"],
      ["ON_ERROR_STOP", "প্রথম Error এ থামা, Exit Code 3", "-v ON_ERROR_STOP=1"],
      ["~/.psqlrc", "শুরুতে নিজে থেকে চলা Setting", "psql -X দিয়ে এড়ানো"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "আপনি psql এ লিখলেন SELECT count(*) FROM tours আর Enter চাপলেন। কিছুই এল না, Prompt হয়ে গেল island_tours-#। কী হয়েছে?",
        options: [
          {
            key: "A",
            text: "psql আটকে গেছে, বন্ধ করে আবার খুলতে হবে",
            isCorrect: false,
            explanation: "psql আটকায়নি। Prompt এর - বলছে সে আপনার Statement শেষ হওয়ার অপেক্ষা করছে।",
          },
          {
            key: "B",
            text: "Semicolon নেই, তাই Query এখনো Buffer এ জমে আছে, Server এ যায়নি",
            isCorrect: true,
            explanation:
              "ঠিক। SQL Semicolon এ শেষ হয়। পরের লাইনে শুধু ; দিলেই জমে থাকা Query টা চলে যাবে।",
          },
          {
            key: "C",
            text: "Server Query চালাচ্ছে, একটু অপেক্ষা করলেই উত্তর আসবে",
            isCorrect: false,
            explanation: "Semicolon ছাড়া কিছুই Server এ পাঠানো হয়নি, তাই Server এর কিছু চালানোর নেই।",
          },
          {
            key: "D",
            text: "tours নামের Table নেই",
            isCorrect: false,
            explanation: "Table না থাকলে Error আসত। Error ও আসেনি, কারণ Query টা পাঠানোই হয়নি।",
          },
        ],
      },
      {
        id: 2,
        text: "কোনটা Meta-command, অর্থাৎ psql নিজেই সামলায়, Server এ SQL হিসেবে যায় না?",
        options: [
          {
            key: "A",
            text: "SELECT * FROM tours;",
            isCorrect: false,
            explanation: "এটা SQL। psql এটা হুবহু Server এ পাঠায়।",
          },
          {
            key: "B",
            text: "CREATE TABLE notes (id int);",
            isCorrect: false,
            explanation: "এটাও SQL, Server এ যায় আর Server চালায়।",
          },
          {
            key: "C",
            text: "\\dt",
            isCorrect: true,
            explanation:
              "ঠিক। Backslash দিয়ে শুরু, তাই এটা psql এর নিজের Command। psql ভেতরে ভেতরে নিজেই একটা Catalog Query বানিয়ে পাঠায়, কিন্তু আপনি যা লিখলেন সেটা SQL না।",
          },
          {
            key: "D",
            text: "SHOW TABLES;",
            isCorrect: false,
            explanation: "এটা MySQL এর Command। PostgreSQL এ এটা কাজ করে না, আর এটা psql এর Meta-command ও না।",
          },
        ],
      },
      {
        id: 3,
        text: "শুধু psql লিখে Enter চাপলেন, আর এল: FATAL: role \"ripon\" does not exist। ripon আপনার কম্পিউটারের User নাম। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "PostgreSQL ঠিকমতো ইনস্টল হয়নি",
            isCorrect: false,
            explanation: "Server ঠিকই উত্তর দিয়েছে, না হলে Connection refused আসত। সমস্যা শুধু নামের।",
          },
          {
            key: "B",
            text: "-U না দেওয়ায় psql আপনার অপারেটিং সিস্টেমের নাম User হিসেবে নিয়েছে, আর Server এ ওই নামে Role নেই",
            isCorrect: true,
            explanation:
              "ঠিক। psql এর ডিফল্ট User হলো অপারেটিং সিস্টেমের User নাম। -U postgres দিন, অথবা নিজের নামে একটা Role বানান (Lesson 01)।",
          },
          {
            key: "C",
            text: "Password ভুল",
            isCorrect: false,
            explanation: "Password ভুল হলে লেখা থাকত password authentication failed।",
          },
          {
            key: "D",
            text: "Port 5432 বন্ধ",
            isCorrect: false,
            explanation: "Port বন্ধ থাকলে Server পর্যন্ত পৌঁছানোই যেত না, তখন Connection refused আসে।",
          },
        ],
      },
      {
        id: 4,
        text: "Prompt এ island_tours=> দেখা আর island_tours=# দেখার মধ্যে তফাত কী?",
        options: [
          {
            key: "A",
            text: "> মানে Query চলছে, # মানে Query শেষ",
            isCorrect: false,
            explanation: "শেষের চিহ্ন Query এর অবস্থা বলে না, বলে আপনি কোন ধরনের User।",
          },
          {
            key: "B",
            text: "# মানে Superuser, > মানে সাধারণ User",
            isCorrect: true,
            explanation:
              "ঠিক। # দেখলে সাবধান: Server আপনাকে কিছুতেই না বলবে না। learner User এর Session এ DELETE করতে গিয়ে permission denied এসেছিল, সেখানে Prompt ছিল =>।",
          },
          {
            key: "C",
            text: "দুটো আলাদা Database",
            isCorrect: false,
            explanation: "Database এর নাম দুটোতেই island_tours, শুরুর অংশে।",
          },
          {
            key: "D",
            text: "> মানে Statement অর্ধেক লেখা",
            isCorrect: false,
            explanation: "অর্ধেক লেখা Statement এ = এর জায়গায় - বা ( বা ' আসে, শেষের চিহ্ন বদলায় না।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা ফাইলে তিনটা UPDATE, দ্বিতীয়টায় ভুল Column নাম। psql -d island_tours -f fix.sql চালালে কী হবে?",
        options: [
          {
            key: "A",
            text: "দ্বিতীয় লাইনে Error দেখিয়ে psql থেমে যাবে",
            isCorrect: false,
            explanation: "ON_ERROR_STOP ছাড়া psql থামে না। Lab এর প্রথম Run এ এটাই দেখা গেছে।",
          },
          {
            key: "B",
            text: "Error দেখাবে, তবু তৃতীয় UPDATE ও চলবে, আর Exit Code হবে 0",
            isCorrect: true,
            explanation:
              "ঠিক, এটাই Default আচরণ। দুটো ট্যুরের দাম বাড়ল, একটার বাড়ল না, আর বাইরে থেকে মনে হলো সব ঠিক। তাই ফাইল চালাতে -v ON_ERROR_STOP=1 দিন।",
          },
          {
            key: "C",
            text: "একটা UPDATE ও চলবে না, কারণ ফাইলে Error আছে",
            isCorrect: false,
            explanation: "psql ফাইলটা আগে পুরো যাচাই করে না, লাইন ধরে ধরে চালায়। প্রথম UPDATE চলে যায়।",
          },
          {
            key: "D",
            text: "তিনটাই চলবে, ভুল Column টা psql নিজে ঠিক করে নেবে",
            isCorrect: false,
            explanation: "psql কিছু ঠিক করে না। Server একটা HINT দেয় কোন নামটা হয়তো বোঝাতে চেয়েছিলেন, কিন্তু চালায় না।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা Customer এর Row এত চওড়া যে Terminal এ লাইন ভেঙে যাচ্ছে। সবচেয়ে ভালো উপায় কোনটা?",
        options: [
          {
            key: "A",
            text: "\\x চালু করা, যাতে প্রতিটা Column নিজের লাইনে আসে",
            isCorrect: true,
            explanation:
              "ঠিক। Expanded Display চওড়া Row খাড়া করে দেখায়। \\x auto দিলে psql নিজে ঠিক করে কখন খাড়া দরকার, আর শুধু একটা Query তে চাইলে শেষে \\gx।",
          },
          {
            key: "B",
            text: "SELECT * এর বদলে SELECT ** লেখা",
            isCorrect: false,
            explanation: "এমন কোনো SQL নেই। Syntax Error আসবে।",
          },
          {
            key: "C",
            text: "\\pset null চালু করা",
            isCorrect: false,
            explanation: "\\pset null শুধু NULL ঘরে একটা চিহ্ন দেখায়, Row এর আকার বদলায় না।",
          },
          {
            key: "D",
            text: "psql ছেড়ে দেওয়া, এটা চওড়া Data দেখাতে পারে না",
            isCorrect: false,
            explanation: "পারে, \\x এই কাজের জন্যই আছে।",
          },
        ],
      },
      {
        id: 7,
        text: "একটা Shell Script এ মোট Customer সংখ্যাটা একটা Variable এ রাখতে চান, শুধু সংখ্যাটা, কোনো Column নাম বা (1 row) ছাড়া। কোন Command?",
        options: [
          {
            key: "A",
            text: "psql -c \"SELECT count(*) FROM customers;\"",
            isCorrect: false,
            explanation: "এতে Column এর নাম, দাগ আর (1 row) সহ পুরো Table আসে।",
          },
          {
            key: "B",
            text: "psql -At -c \"SELECT count(*) FROM customers;\"",
            isCorrect: true,
            explanation:
              "ঠিক। -A ঘর মেলানোর ফাঁকা বাদ দেয়, -t নাম আর শেষের লাইন বাদ দেয়। পরীক্ষায় শুধু 15 এসেছিল।",
          },
          {
            key: "C",
            text: "psql -x -c \"SELECT count(*) FROM customers;\"",
            isCorrect: false,
            explanation: "-x Expanded Display, তাতে RECORD 1 আর count | 15 আসবে, খালি সংখ্যা না।",
          },
          {
            key: "D",
            text: "psql -E -c \"SELECT count(*) FROM customers;\"",
            isCorrect: false,
            explanation: "-E শুধু Meta-command এর লুকানো Query দেখায়, Output এর ধরন বদলায় না।",
          },
        ],
      },
      {
        id: 8,
        text: "আপনি MySQL এর একটা ভিডিও দেখে psql এ \\c লিখলেন, অর্ধেক লেখা Query মুছতে। কী হবে?",
        options: [
          {
            key: "A",
            text: "অর্ধেক লেখা Query মুছে যাবে, MySQL এর মতোই",
            isCorrect: false,
            explanation: "MySQL এর mysql Client এ \\c মানে clear, কিন্তু psql এ না।",
          },
          {
            key: "B",
            text: "psql এ \\c মানে connect, তাই এটা আবার Connect করার চেষ্টা করবে",
            isCorrect: true,
            explanation:
              "ঠিক। psql এ \\c একটা Database এ যাওয়ার Command, কোনো নাম না দিলে আগের তথ্য দিয়েই নতুন Connection। অর্ধেক লেখা Query মুছতে psql এ Ctrl+C।",
          },
          {
            key: "C",
            text: "psql বন্ধ হয়ে যাবে",
            isCorrect: false,
            explanation: "বন্ধ হয় \\q দিয়ে।",
          },
          {
            key: "D",
            text: "সব Table এর তালিকা আসবে",
            isCorrect: false,
            explanation: "Table এর তালিকা \\dt।",
          },
        ],
      },
    ],
  },
  assignment: {
    title: "Mini Project: psql এ নিজের হাত পাকানো",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>তিনভাবে Connect:</strong> Lesson 06 এ island_tours Load করার পর
        একই Database এ তিনভাবে Connect করুন: Flag দিয়ে, URI দিয়ে, আর Environment
        Variable দিয়ে। প্রতিবার <code className={CODE}>\conninfo</code> এর Output
        রেখে দিন। Password কোথাও Command এ লিখবেন না।
      </span>,
      <span key="2">
        <strong>চারটা Error ইচ্ছা করে:</strong> ভুল User, ভুল Database, ভুল Password
        আর ভুল Port দিয়ে Connect করার চেষ্টা করুন। প্রতিটা Error হুবহু লিখুন, আর
        পাশে এক লাইনে লিখুন পাঁচটা তথ্যের কোনটা ভুল ছিল।
      </span>,
      <span key="3">
        <strong>Database এর মানচিত্র:</strong> শুধু Meta-command দিয়ে island_tours
        এর একটা মানচিত্র বানান: কয়টা Table, প্রতিটার কয়টা Column, কোন Table কোন
        Table কে দেখায় (<code className={CODE}>\d</code> এর Foreign-key আর Referenced
        by অংশ থেকে)। কাগজে বা যেকোনো Tool এ আঁকুন, তারপর{" "}
        <Link href="/sql/database" className={LINK}>
          Sample Database পাতার
        </Link>{" "}
        ছবির সাথে মেলান।
      </span>,
      <span key="4">
        <strong>নিজের ~/.psqlrc:</strong> লেসনের পাঁচ লাইনের ফাইল দিয়ে শুরু করে
        আরও দুটো Setting খুঁজে যোগ করুন psql এর Docs থেকে। প্রতিটা লাইনের পাশে
        Comment এ লিখুন সেটা কী করে। তারপর <code className={CODE}>psql -X</code>{" "}
        দিয়ে খুলে তফাত দেখুন।
      </span>,
      <span key="5">
        <strong>একটা Report Script:</strong> একটা .sql ফাইলে তিনটা Query রাখুন
        (Table প্রতি Row এর সংখ্যা, সবচেয়ে দামি তিনটা ট্যুর, NULL ফোন নম্বরের
        Customer)। ফাইলটা একবার <code className={CODE}>\i</code> দিয়ে, একবার{" "}
        <code className={CODE}>psql -v ON_ERROR_STOP=1 -f</code> দিয়ে চালান, আর একবার
        ইচ্ছা করে দ্বিতীয় Query তে ভুল ঢুকিয়ে Exit Code দেখুন।
      </span>,
    ],
    deliverables: [
      <span key="1">তিনটা \conninfo Output, কোনোটায় Password ছাড়া</span>,
      <span key="2">চারটা Connection Error হুবহু, প্রতিটার কারণসহ</span>,
      <span key="3">island_tours এর হাতে আঁকা মানচিত্র, Sample Database পাতার সাথে মিলিয়ে</span>,
      <span key="4">Comment সহ আপনার ~/.psqlrc</span>,
      <span key="5">Report এর .sql ফাইল আর দুই Run এর Exit Code</span>,
    ],
  },
  practicalLab: {
    title: "psql এর সাথে প্রথম পুরো Session",
    subtitle: "Connect থেকে Script পর্যন্ত, নিজের মেশিনে",
    stepName: "LAB",
    steps: [
      {
        title: "Connect করুন",
        description:
          "প্রথম কোড থেকে আপনার ইনস্টলের সাথে মেলে এমন লাইনটা চালান। Prompt এ island_tours=# বা island_tours=> দেখা পর্যন্ত থামবেন না। Error এলে Connection Errors অংশের Table দেখুন।",
      },
      {
        title: "চারপাশ ঘুরে দেখুন",
        description:
          "দ্বিতীয় কোডের Meta-command গুলো একটা একটা করে চালান। প্রতিটার পরে নিজেকে জিজ্ঞেস করুন এটা কোন প্রশ্নের উত্তর দিল।",
      },
      {
        title: "Prompt এর ফাঁদ ধরুন",
        description:
          "তৃতীয় কোডটা হুবহু টাইপ করুন, ইচ্ছা করে Semicolon ছাড়া। Prompt কীভাবে বদলায় দেখুন, তারপর Ctrl+C দিয়ে বাতিল করে ঠিকভাবে আবার লিখুন।",
      },
      {
        title: "একটা Script বানান আর চালান",
        description:
          "চতুর্থ কোডটা একটা ফাইলে রাখুন। দুইভাবে চালান, ON_ERROR_STOP সহ আর ছাড়া। প্রতিবার echo $? দিয়ে Exit Code দেখুন আর tours এর দাম মিলিয়ে নিন। শেষে পঞ্চম কোড দিয়ে দাম আগের জায়গায় ফেরান।",
      },
      {
        title: "Report বের করুন",
        description:
          "ষষ্ঠ কোড দিয়ে একটা CSV ফাইল বানিয়ে Excel বা Google Sheets এ খুলুন।",
      },
      {
        title: "Query বক্সেও দেখুন",
        description:
          "এই পাতার See It Yourself অংশের বক্সগুলো চালান আর আপনার psql এর \\dt আর \\d tours এর সাথে মেলান। কোথায় মেলে, কোথায় একটু আলাদা, লিখে রাখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-connect.sh",
        language: "bash",
        code: `# macOS এ নিজের মেশিনের Server, যদি আপনার নিজের নামে Role থাকে (Lesson 01)
psql -d island_tours

# Linux এ, postgres User হিসেবে
sudo -u postgres psql -d island_tours

# Docker এ (Lesson 01 এর island-pg Container)
docker exec -it island-pg psql -U postgres -d island_tours

# যেকোনো জায়গা থেকে, TCP দিয়ে, Password psql নিজে জিজ্ঞেস করবে
psql -h localhost -p 5432 -U postgres -d island_tours`,
      },
      {
        filename: "2-look-around.txt",
        language: "bash",
        code: String.raw`\conninfo
\l
\dt
\d tours
\d bookings
\dn
\du
\x auto
SELECT * FROM customers WHERE customer_id = 1;
\pset null '[NULL]'
SELECT full_name, phone FROM customers WHERE phone IS NULL;`,
      },
      {
        filename: "3-prompt-trap.txt",
        language: "sql",
        code: `SELECT title
FROM tours
WHERE price_bdt < 9000
-- এখানে Semicolon নেই। Prompt এ - দেখুন, তারপর Ctrl+C`,
      },
      {
        filename: "4-fix_prices.sql",
        language: "sql",
        code: `-- দ্বিতীয় লাইনে ইচ্ছা করে ভুল Column নাম
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_id = 1;
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_idd = 2;
UPDATE tours SET price_bdt = price_bdt + 500 WHERE tour_id = 3;

-- চালানো, Terminal এ:
--   psql -d island_tours -f fix_prices.sql ; echo $?
--   psql -d island_tours -v ON_ERROR_STOP=1 -f fix_prices.sql ; echo $?`,
      },
      {
        filename: "5-undo.sql",
        language: "sql",
        code: `-- দুই Run এর পরে দাম আগের জায়গায় ফেরানো:
-- প্রথম Run বাড়িয়েছে ট্যুর 1 আর 3, দ্বিতীয় Run শুধু ট্যুর 1।
-- তাই ট্যুর 1 থেকে 1000, ট্যুর 3 থেকে 500 কমান।
UPDATE tours SET price_bdt = price_bdt - 1000 WHERE tour_id = 1;
UPDATE tours SET price_bdt = price_bdt - 500 WHERE tour_id = 3;
SELECT tour_id, price_bdt FROM tours WHERE tour_id IN (1, 2, 3) ORDER BY tour_id;
-- সব ঠিক থাকলে: 12500.00, 8500.00, 18000.00
-- নিশ্চিত না হলে island-tours.sql আবার Load করুন (Lesson 06), সব আগের মতো হয়ে যাবে।`,
      },
      {
        filename: "6-export.sh",
        language: "bash",
        code: `psql -d island_tours --csv \\
  -c "SELECT tour_id, title, price_bdt FROM tours ORDER BY tour_id;" \\
  > tours.csv`,
      },
    ],
    tip: (
      <ContentParagraph>
        এই Lab এর Command গুলো আপনার মেশিনে চালাতে Lesson 01 এর ইনস্টল আর Lesson 06
        এর Sample Database Load আগে লাগবে। এখনো সেগুলো না হয়ে থাকলে আগে সেখানে
        যান, তারপর ফিরে আসুন। এই পাতার Query বক্সগুলো অবশ্য কিছু ইনস্টল ছাড়াই চলে।
      </ContentParagraph>
    ),
  },
};
