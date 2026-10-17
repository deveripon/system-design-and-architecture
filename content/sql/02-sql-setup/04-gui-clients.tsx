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
  ConnectionFormLab,
  TaskToolLab,
} from "../../../components/course/topics/sql-setup/gui-animations";
import {
  ConnectCheckpointsDiagram,
  DialogToUriDiagram,
  GuiAnatomyDiagram,
  GuiIsAClientDiagram,
} from "../../../components/course/topics/sql-setup/gui-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const CODE = "font-mono text-[0.875em] px-1 py-0.5 bg-muted/60 border border-border";

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

export const guiClientsContent: TopicData = {
  id: "gui-clients",
  introduction: {
    badge: "MODULE 02 · LESSON 04",
    title: <SectionTitle>একই Database, একটা জানালা দিয়ে: GUI Client</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের লেসনে আপনি psql এর সাথে বন্ধুত্ব করেছেন। কালো Terminal, একটা
          Prompt, আর কয়েকটা ছোট Command: <code className={CODE}>\dt</code> লিখলে
          Table এর তালিকা, <code className={CODE}>\d bookings</code> লিখলে একটা
          Table এর ভেতরের গঠন। কাজ চলে, আর খুব দ্রুত চলে। কিন্তু অনেক Developer
          রোজকার কাজে একটা জানালাওয়ালা App খোলেন: বাঁয়ে Table এর একটা গাছ, ডানে
          Query লেখার জায়গা, নিচে Excel এর মতো একটা ছক। এই App গুলোকে বলে GUI
          Client।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি জানবেন GUI আসলে কী আর কী না, এটা কী সুবিধা দেয় আর কী
          লুকিয়ে রাখে, বাজারের পাঁচটা জনপ্রিয় GUI এর কোনটা কার জন্য, Connect করার
          ফর্মের প্রতিটা ঘর Module 01 এর চেনা Connection String এর কোন টুকরো, আর
          pgAdmin ও DBeaver দিয়ে ধাপে ধাপে island_tours এ ঢোকা, Table ঘুরে দেখা,
          Query চালানো, ER ছবি দেখা আর ফলাফল CSV তে বের করা। শেষে শিখবেন
          Production Database এ GUI খোলার নিরাপদ অভ্যাস, আর Connect না হলে Error
          এর বাক্যটা পড়েই কীভাবে বুঝবেন ঠিক কোথায় আটকেছেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Terminal হোক বা জানালা, দুজনেই একই দরজায় টোকা দেয়। Server কখনো জিজ্ঞেস করে না আপনি কোন পথে এলেন, শুধু জিজ্ঞেস করে আপনি কে আর কী চান।",
      author: "GUI Client",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>কালো Screen এর পাশে একটা জানালা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাদিয়া আজ Island Tours এর টিমে প্রথম দিন কাজ করছেন। তাঁর প্রথম
                কাজ ছোট: খুঁজে বের করতে হবে এখনো কতগুলো Booking pending অবস্থায়
                পড়ে আছে। টিমের পুরনো Developer কামরুল তাঁকে Terminal খুলে psql
                দেখালেন। কামরুল <code className={CODE}>\dt</code> লিখলেন, আটটা
                Table এর নাম ভেসে উঠল। তারপর <code className={CODE}>\d bookings</code>,
                আর সাতটা Column এর একটা তালিকা।
              </ContentParagraph>
              <ContentParagraph>
                সাদিয়া একটু অস্বস্তি নিয়ে বললেন, এত লেখা মনে রাখব কীভাবে? আর এই
                আটটা Table এর মধ্যে কোনটা কোনটার সাথে জোড়া, সেটা তো এখানে দেখা
                যাচ্ছে না। কামরুল হেসে আরেকটা App খুললেন। বাঁয়ে একটা গাছের মতো
                তালিকা: Server এর নাম, তার নিচে Databases, তার নিচে island_tours,
                তার নিচে Tables। bookings এ ক্লিক করতেই ডানে তার সব Column। একটা
                ঘরে Query লিখে চালাতেই নিচে Spreadsheet এর মতো একটা ছক, চারটা Row।
              </ContentParagraph>
              <ContentParagraph>
                সাদিয়া জিজ্ঞেস করলেন, এটা কি অন্য একটা Database? psql এ যেটা
                দেখলাম, এটা কি তার Copy? কামরুলের উত্তর এই লেসনের প্রথম আর সবচেয়ে
                জরুরি কথা: না। এটা একই Server, একই Database, একই আটটা Table। শুধু
                তাকানোর জানালাটা আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                এই জানালার নাম GUI, পুরো নাম Graphical User Interface। মানে এমন
                একটা Program, যেটা চালানো হয় জানালা, বোতাম, তালিকা আর মাউস দিয়ে।
                তার উল্টোটা CLI, Command Line Interface, যেখানে সব কাজ হয় লিখে।
                psql একটা CLI। আর Database এর জন্য বানানো GUI App গুলোকে বলা হয়
                Database GUI Client, বা ছোট করে শুধু GUI।
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
              Database GUI Client হলো একটা Desktop বা Web App, যে আপনার হয়ে
              Database Server এর সাথে Connect করে, তার ভেতরের জিনিসগুলো গাছ আর
              ছকের আকারে দেখায়, আর আপনার লেখা বা মাউসে করা কাজগুলোকে SQL বানিয়ে
              Server এ পাঠায়। Data কখনো GUI এর ভেতরে থাকে না, থাকে Server এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "just-another-client",
      subHeader: { index: "002", title: "Just Another Client" },
      title: <SectionTitle>GUI আরেকটা Client মাত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 01 এর{" "}
                <Link href="/sql/topic/app-database-conversation" className={LINK}>
                  App আর Database এর কথোপকথনের লেসনে
                </Link>{" "}
                তিনটা চরিত্রের কথা পড়েছিলেন: Client, Server, আর তাদের মাঝের
                Connection। Client হলো যে প্রশ্ন পাঠায়, Server হলো যে Data রাখে আর
                উত্তর দেয়। psql একটা Client। Island Tours এর API ও একটা Client। আর
                pgAdmin, DBeaver, TablePlus, এরা সবাই ঠিক একই জায়গায় দাঁড়ানো আরও
                কয়েকটা Client।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GuiIsAClientDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটা থেকে চারটা কথা সরাসরি বেরিয়ে আসে, আর এই চারটা মাথায় থাকলে
                GUI নিয়ে বেশিরভাগ ভয় আর ভুল ধারণা দূর হয়ে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>GUI যা দেখায়, সেটা Server কে জিজ্ঞেস করে পাওয়া।</strong>{" "}
                  বাঁয়ের গাছে আটটা Table এর নাম আসে, কারণ GUI চুপচাপ Server কে
                  একটা SQL প্রশ্ন করেছে: এই Database এ কী কী Table আছে? নিচের ছকে
                  যে Row গুলো দেখেন, সেগুলো আপনার লেখা Query এর উত্তর। GUI নিজে
                  কিছু জানে না, সব জেনে নেয়।
                </ListItem>
                <ListItem>
                  <strong>GUI আপনাকে বাড়তি ক্ষমতা দেয় না।</strong> আপনি যে
                  Username দিয়ে Connect করেছেন, Server তাকে যতটুকু অনুমতি দিয়েছে,
                  GUI ঠিক ততটুকুই পারবে। psql এ যে Table পড়তে পারেন না, GUI তেও
                  পারবেন না। নিয়মগুলো Server এর, জানালার না।
                </ListItem>
                <ListItem>
                  <strong>GUI মুছে ফেললে কোনো Data হারায় না।</strong> pgAdmin
                  Uninstall করলে island_tours এর একটা Row ও যায় না, কারণ কোনো Row
                  কখনো pgAdmin এর ভেতরে ছিলই না। হারায় শুধু GUI তে Save করা
                  Connection এর তালিকা।
                </ListItem>
                <ListItem>
                  <strong>GUI এর বেশিরভাগ Error আসলে Server এর বাক্য।</strong>{" "}
                  ভুল Password দিলে GUI একটা Popup দেখায়, কিন্তু ভেতরের লেখাটা
                  সাধারণত psql এ যা দেখতেন সেটাই, কারণ বাক্যটা পাঠিয়েছে Server।
                  তাই psql এ শেখা প্রতিটা Error এর মানে GUI তেও কাজে লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "প্রতিটা Client নিজের নাম বলে দিতে পারে",
          content: (
            <ContentParagraph>
              Connect করার সময় একটা Client চাইলে নিজের একটা নাম জানাতে পারে, যার
              নাম application_name। Server এর ভেতরের pg_stat_activity নামের
              তালিকায় এই মুহূর্তে কারা Connected আর কে কোন নামে এসেছে, সব দেখা
              যায়। এই লেসনের Lab এ আপনি psql কে my-gui নাম দিয়ে Connect করবেন আর
              সেই তালিকায় নিজেকে খুঁজে পাবেন। অফিসে কেউ জিজ্ঞেস করলে, Database এ
              এত Connection কারা খুলে রেখেছে, উত্তর খোঁজার জায়গা এটাই।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "gui-adds",
      subHeader: { index: "003", title: "What a GUI Adds" },
      title: <SectionTitle>জানালাটা কী দেয়, আর কী আড়াল করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমবার কয়েকটা GUI খুললে মনে হবে সবাই একেবারে আলাদা। রং আলাদা,
                মেনু আলাদা, বোতামের জায়গা আলাদা। কিন্তু একটু তাকালেই দেখবেন প্রায়
                প্রতিটা GUI একই চারটা ভাগে সাজানো। একবার এই চার ভাগ চিনে নিলে
                যেকোনো নতুন GUI দশ মিনিটে চালাতে পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GuiAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম ভাগটা বাঁয়ের গাছ, যাকে pgAdmin বলে Object Explorer আর DBeaver
                বলে Connections। এই গাছ ধরে আপনি Server থেকে Database, Database
                থেকে Schema, Schema থেকে Table পর্যন্ত নামতে পারেন, ঠিক কম্পিউটারের
                ফোল্ডারের মতো। Schema শব্দটা নতুন মনে হলে চিন্তা নেই, পরের লেসনটা
                পুরোটাই এটা নিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় ভাগ SQL Editor, যেখানে আপনি Query লেখেন। ভালো Editor নিজে
                থেকে Table আর Column এর নাম মনে করিয়ে দেয়, যাকে বলে Autocomplete।
                তৃতীয় ভাগ Result Grid, ফলাফলের ছক, যেখানে Column ধরে সাজানো,
                ছাঁকা, Copy করা আর Export করা যায়। চতুর্থ ভাগ নিচের একটা ছোট লাইন,
                যেটা বলে আপনি কোন Server এর কোন Database এ, কোন User হিসেবে
                Connected, আর এই মুহূর্তে Transaction এর অবস্থা কী।
              </ContentParagraph>
              <ContentParagraph>
                এই চার ভাগ মিলে GUI আপনাকে যা দেয়, তার তালিকা লম্বা। কিন্তু একই
                সাথে কিছু জিনিস চোখের আড়ালেও চলে যায়, আর বিপদ লুকিয়ে থাকে ঠিক
                সেখানে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যা দেয়:</strong> চোখের সামনে পুরো কাঠামো, মুখস্থ ছাড়াই
                  Table আর Column খুঁজে পাওয়া, Excel এর মতো ছকে ফলাফল, Foreign Key
                  গুলোর ছবি (ER Diagram), কয়েক ক্লিকে CSV Export, Save করা অনেকগুলো
                  Connection, আর ধীর Query এর Plan ছবির মতো করে দেখা।
                </ListItem>
                <ListItem>
                  <strong>যা আড়াল করে:</strong> GUI ভেতরে ভেতরে কোন SQL চালাচ্ছে,
                  আপনার করা পরিবর্তন সাথে সাথে পাকা হচ্ছে কিনা (Auto commit), আর
                  একটা বোতামের পেছনে কত বড় কাজ লুকিয়ে আছে। একটা Table এ Right-click
                  করলেই Drop বা Truncate এর মতো বিকল্প চলে আসে, যেগুলো পুরো Table বা
                  তার সব Row মুছে দেয়। psql এ সেটা লিখে করতে হয়, GUI তে একটা ভুল
                  ক্লিকই যথেষ্ট।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কাজ", "psql", "GUI"],
          rows: [
            ["শুরু করা", "PostgreSQL এর সাথেই চলে আসে", "আলাদা করে নামাতে আর বসাতে হয়"],
            ["অচেনা Database ঘুরে দেখা", "\\dt, \\d লিখে একটা একটা করে", "গাছ খুললেই সব, ER ছবিসহ"],
            ["ফলাফল দেখা", "Text এর সারি", "ছক, সাজানো আর ছাঁকা যায়"],
            ["একই কাজ বারবার করা", "Script আর -f দিয়ে স্বয়ংক্রিয়", "প্রতিবার হাতে ক্লিক"],
            ["দূরের Server, শুধু SSH", "চলে", "চলে না, জানালা খোলার উপায় নেই"],
            ["অন্যকে ঠিক কী করেছেন বোঝানো", "Command হুবহু Copy করে পাঠানো যায়", "মেনুর পথ লিখে বোঝাতে হয়"],
            ["ভুল করার সহজতা", "লিখতে হয়, তাই একটু ভাবতে হয়", "একটা ক্লিকেই বড় পরিবর্তন সম্ভব"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "GUI শিখুন, কিন্তু psql ছাড়বেন না",
          content: (
            <ContentParagraph>
              চাকরিতে একদিন না একদিন আপনাকে SSH দিয়ে এমন একটা Server এ ঢুকতে হবে,
              যেখানে কোনো জানালা নেই, আছে শুধু Terminal। সেদিন psql ই একমাত্র
              উপায়। তাই এই ট্র্যাকের বেশিরভাগ Lab psql দিয়ে লেখা। GUI কে দেখুন
              একটা আরামদায়ক বাড়তি জানালা হিসেবে, যেটা psql এর জায়গা নেয় না, পাশে
              বসে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TaskToolLab /> },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "the-tools",
      subHeader: { index: "004", title: "The Tools" },
      title: <SectionTitle>পাঁচটা জনপ্রিয় GUI, কোনটা কার জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাজারে PostgreSQL এর জন্য অনেক GUI আছে। নিচে পাঁচটার কথা, যেগুলো
                আপনি টিউটোরিয়াল, অফিস আর চাকরির বিজ্ঞাপনে সবচেয়ে বেশি দেখবেন।
                প্রতিটার তথ্য নেওয়া হয়েছে তাদের নিজেদের Website থেকে। Version নম্বর
                আর দাম সময়ের সাথে বদলায়, তাই নামানোর দিন Website এ যা লেখা থাকবে,
                সেটাই মানবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["GUI", "দাম", "কোথায় চলে", "কোন Database", "কার জন্য ভালো"],
          rows: [
            [
              "pgAdmin 4",
              "বিনামূল্যে, Open Source (PostgreSQL Licence)",
              "Windows, macOS, Linux, Container",
              "শুধু PostgreSQL",
              "যিনি শুধু PostgreSQL নিয়ে কাজ করবেন। Windows এ EDB Installer এর সাথেই চলে আসে",
            ],
            [
              "DBeaver Community",
              "বিনামূল্যে, Open Source",
              "Windows, macOS, Linux",
              "PostgreSQL, MySQL, MariaDB, SQLite আর আরও অনেক",
              "যিনি একসাথে PostgreSQL আর MySQL দুটোই ধরবেন",
            ],
            [
              "TablePlus",
              "Paid License, সীমিত Free Trial",
              "macOS, Windows, Linux, iOS",
              "PostgreSQL, MySQL, SQLite, Redis আর আরও অনেক",
              "যিনি হালকা, দ্রুত, OS এর নিজের চেহারার App চান",
            ],
            [
              "DataGrip",
              "Non-commercial কাজে বিনামূল্যে, অফিসের কাজে Paid (৩০ দিনের Trial)",
              "Cross-platform Desktop App",
              "PostgreSQL, MySQL, Oracle, SQL Server আর আরও অনেক",
              "যিনি JetBrains এর IDE এ অভ্যস্ত, আর শক্তিশালী Autocomplete চান",
            ],
            [
              "VS Code এর PostgreSQL Extension",
              "VS Code Marketplace এর Extension, Microsoft এর বানানো",
              "VS Code যেখানে চলে",
              "PostgreSQL",
              "যিনি সারাদিন VS Code এই থাকেন, আলাদা App খুলতে চান না",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>pgAdmin 4</strong> PostgreSQL কমিউনিটির নিজের GUI। এটা
                লেখা হয়েছে একটা Web App হিসেবে: ভেতরে একটা ছোট Python Server চলে,
                আর আপনি দেখেন একটা Browser এর মতো জানালা। Desktop এ বসালে এই দুটো
                একসাথে একটা App এর মতো খোলে, আর চাইলে পুরো টিমের জন্য একটা Server
                এ Web Mode এ চালানো যায়। এই লেখার সময় pgadmin.org এ সর্বশেষ Version
                ছিল 9.18। Windows এ যাঁরা EDB Installer দিয়ে PostgreSQL বসিয়েছেন,
                তাঁদের মেশিনে pgAdmin আগে থেকেই আছে, Start Menu তে খুঁজলেই পাবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DBeaver Community</strong> একটা বিনামূল্যের Open Source GUI,
                যেটা প্রায় সব জনপ্রিয় Database এর সাথে কথা বলতে পারে। আপনি যদি
                MySQL দিয়ে বানানো ভিডিও কোর্সটা পাশে রেখে PostgreSQL শিখতে থাকেন,
                তাহলে একই App থেকে দুটো Server ই খুলতে পারবেন, এটা বড় সুবিধা।
              </ContentParagraph>
              <ContentParagraph>
                <strong>TablePlus</strong> এর নিজের দাবি, এটা প্রতিটা OS এর নিজস্ব
                চেহারায় বানানো, তাই হালকা আর দ্রুত লাগে। এটা কিনতে হয়। Trial এ
                একসাথে দুটো Tab, দুটো জানালা আর দুটো Advanced Filter এর বেশি খোলা
                যায় না, শেখার জন্য সেটা যথেষ্ট হতে পারে।{" "}
                <strong>DataGrip</strong> JetBrains এর বানানো, যাঁরা IntelliJ বা
                WebStorm চালান তাঁদের কাছে চেনা লাগবে। JetBrains এর Website বলছে
                Non-commercial কাজে এটা বিনামূল্যে। আর <strong>VS Code</strong>{" "}
                এ Microsoft এর বানানো PostgreSQL নামের একটা Extension আছে, যেটা দিয়ে
                Editor এর ভেতর থেকেই Connect, Object Explorer আর Query চালানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই ট্র্যাকের পরামর্শ: একটা বেছে নিন, পাঁচটা না",
          content: (
            <ContentParagraph>
              শুধু PostgreSQL শিখছেন আর একটা বিনামূল্যের App চান, তাহলে pgAdmin।
              পাশাপাশি MySQL এর ভিডিও দেখছেন, তাহলে DBeaver Community, কারণ একই
              জানালায় দুটো Server। সারাদিন VS Code এ থাকলে ওর Extension টা।
              প্রথম মাসে একটার বেশি GUI বসাবেন না। নতুন জিনিস শেখার সময় আসল
              শক্তি খরচ হোক SQL এ, পাঁচটা App এর মেনু মুখস্থ করায় না। এই লেসনে
              ধাপে ধাপে দেখানো হবে pgAdmin আর DBeaver।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "dialog-is-a-string",
      subHeader: { index: "005", title: "Dialog Is a String" },
      title: <SectionTitle>Connect এর ফর্ম আসলে একটা Connection String</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                যেকোনো GUI তে প্রথম কাজ হলো একটা নতুন Connection বানানো। একটা ফর্ম
                খোলে, কয়েকটা ঘর পূরণ করতে হয়। প্রথম দেখায় ঘরগুলো অচেনা মনে হতে
                পারে, কিন্তু আপনি এদের আগেই চেনেন। Module 01 এ দেখা Connection
                String মনে আছে? <code className={CODE}>postgresql://user@host:5432/dbname</code>।
                ফর্মের প্রতিটা ঘর এই String এর ঠিক একটা টুকরো। GUI শুধু টুকরোগুলো
                আলাদা আলাদা ঘরে জিজ্ঞেস করে, যাতে আপনাকে চিহ্নগুলো মনে রাখতে না হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DialogToUriDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>এবার প্রতিটা ঘর একটা একটা করে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Name:</strong> শুধু আপনার নিজের জন্য একটা লেবেল, যেমন
                  Island Tours Local। Server এ যায় না। কয়েকটা Connection হলে নামই
                  আপনাকে বাঁচাবে, তাই নামে পরিবেশটা লিখে রাখুন: Local, Staging,
                  Production।
                </ListItem>
                <ListItem>
                  <strong>Host:</strong> কোন মেশিনে Server চলছে। নিজের মেশিনে
                  PostgreSQL বসালে localhost। Docker এ চালালেও আপনার মেশিন থেকে
                  দেখতে Host localhost ই, কারণ Docker সেই Container এর Port টা
                  আপনার মেশিনের একটা Port এ খুলে দিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Port:</strong> সেই মেশিনের কোন দরজায় PostgreSQL অপেক্ষা
                  করছে। নিজের Port 5432। Install লেসনে যাঁরা আগের কোনো PostgreSQL
                  এর কারণে 5433 নিয়েছেন, তাঁরা এখানে 5433 লিখবেন। Port ভুল হলে
                  প্রথম চেকপোস্টেই Connection refused।
                </ListItem>
                <ListItem>
                  <strong>Database:</strong> Connect করেই কোন Database এ ঢুকবেন।
                  pgAdmin এই ঘরের নাম রেখেছে Maintenance database, আর সাধারণত এখানে
                  postgres লেখা থাকে। pgAdmin এই Database দিয়ে ঢুকে তারপর গাছে
                  Server এর সব Database দেখায়, সেখান থেকে island_tours বেছে নেবেন।
                  DBeaver আর অন্যরা এই ঘরকে সোজা Database বলে।
                </ListItem>
                <ListItem>
                  <strong>Username:</strong> কে হিসেবে ঢুকবেন। নতুন ইনস্টলে
                  সাধারণত postgres, যে সব পারে, মানে Superuser। নিজের মেশিনে শেখার
                  জন্য ঠিক আছে। Production এ কখনো না, কেন সেটা এই লেসনের Safety
                  অংশে।
                </ListItem>
                <ListItem>
                  <strong>Password:</strong> ছবিতে লক্ষ করুন, এটা String এর বাইরে।
                  GUI Password টা আলাদা জায়গায় রাখে, অথবা প্রতিবার জিজ্ঞেস করে।
                  pgAdmin এ Save password নামের একটা Checkbox আছে। Desktop এ
                  pgAdmin 7.2 থেকে Save করা Password চলে যায় OS এর নিজের Password
                  ভাণ্ডারে, যেমন macOS এর Keychain।
                </ListItem>
                <ListItem>
                  <strong>SSL mode:</strong> পথে Data কে তালা দেওয়া হবে কিনা।
                  disable মানে কখনো না, prefer মানে Server পারলে দাও, require মানে
                  তালা ছাড়া Connect করব না। নিজের মেশিনের PostgreSQL এ সাধারণত SSL
                  চালু থাকে না, তাই prefer বা disable। দূরের Server বা Cloud
                  Database এ require। এই তালাটা আসলে কী, সেটা Module 16 এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কিছু GUI উল্টো পথেও যায়। TablePlus এ পুরো একটা URL Paste করে
                Connection বানানো যায়, আর তার Docs এ PostgreSQL এর URL এর আকার
                দেওয়া আছে <code className={CODE}>postgres://user:password@host:port/database</code>।
                সুবিধার, কিন্তু খেয়াল করুন সেখানে Password টা String এর ভেতরে।
                এমন String কখনো Chat এ বা Screenshot এ যাবে না।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা ছোট ফাঁদ এখানেই। Password এর ভেতরে যদি{" "}
                <code className={CODE}>@</code>, <code className={CODE}>#</code>,{" "}
                <code className={CODE}>:</code> বা <code className={CODE}>/</code>{" "}
                এর মতো চিহ্ন থাকে, তাহলে URI এর ভেতরে সেগুলো আলাদা মানে বহন করে।
                @ মানে Password শেষ, এবার Host। PostgreSQL এর Docs তাই বলে, এমন
                চিহ্ন থাকলে URI টা Percent-encode করতে হবে: @ হয়ে যায় %40, # হয়ে
                যায় %23। একটা পরীক্ষার Server এ বানানো sea@view#7 Password হুবহু
                বসিয়ে psql চালালে এই Error এসেছিল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "unencoded-password.txt",
          code: `psql: error: could not translate host name "view#7@127.0.0.1" to address: nodename nor servname provided, or not known`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              psql প্রথম @ দেখেই ভেবেছে Password শেষ, আর বাকি অংশটাকে Host এর নাম
              ধরে খুঁজতে গেছে। একই Password কে sea%40view%237 লিখতেই Connect হয়ে
              গেল। GUI এর আলাদা Password ঘরে লিখলে এই ঝামেলা নেই, কারণ সেখানে GUI
              নিজেই সামলায়। ঝামেলা শুধু তখন, যখন পুরো String টা নিজে হাতে লেখেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Password কখনো লেসনের মতো খোলা জায়গায় না",
          content: (
            <ContentParagraph>
              উপরের sea@view#7 একটা পরীক্ষার Server এর বানানো Password, শুধু
              চিহ্নের সমস্যা দেখানোর জন্য। নিজের আসল Password কোনো Command এ, কোনো
              ফাইলে বা কোনো Screenshot এ রাখবেন না। এই Module জুড়ে নিয়ম একটাই:
              Password থাকে Shell এর POSTGRES_PASSWORD নামের Environment Variable
              এ, অথবা GUI এর Password ঘরে, আর কোথাও না।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "build-a-connection",
      subHeader: { index: "006", title: "Build a Connection" },
      title: <SectionTitle>নিজে ফর্ম পূরণ করে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের ফর্মটা কোনো আসল Server এ Connect করে না। এটা শুধু দেখায়, আপনি
              যা লিখছেন তা থেকে কোন Connection String তৈরি হবে, psql এ একই
              Connection কেমন দেখাবে, আর কোন মান দিলে GUI Connect করতে গিয়ে কোথায়
              আটকাবে। একটা একটা করে ঘর বদলান আর ডানদিকটা লক্ষ করুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectionFormLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>চারটা ছোট পরীক্ষা করুন:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চিহ্নওয়ালা Password:</strong> Demo Password বোতাম চাপুন।
                  নিচের String এ দেখবেন sea%40view%237, মানে @ আর # বদলে গেছে।
                  উপরের শেয়ার করার String এ Password নেই, এটাই অভ্যাস করার মতো।
                </ListItem>
                <ListItem>
                  <strong>নিজের মেশিনে SSL require:</strong> SSL mode এ require
                  চাপুন। Host localhost থাকায় সাথে সাথে সতর্কবার্তা আসবে, কারণ
                  আপনার লোকাল PostgreSQL এ সাধারণত SSL চালু নেই।
                </ListItem>
                <ListItem>
                  <strong>Production:</strong> উপরে Production বাছুন। দুটো
                  সতর্কবার্তা আসবে: Read only বন্ধ, আর Username postgres মানে
                  Superuser। Read only চালু করুন, দেখুন String এর শেষে একটা options
                  অংশ যোগ হলো। এটা কী করে, Safety অংশে নিজের হাতে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>GUI নিজেই Docker এ:</strong> শেষ বোতামটা চাপুন। localhost
                  এখন আর কাজ করবে না, কেন সেটা সতর্কবার্তাই বলে দেবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "walkthrough-pgadmin",
      subHeader: { index: "007", title: "Walkthrough: pgAdmin" },
      title: <SectionTitle>pgAdmin দিয়ে island_tours এ ঢোকা, ধাপে ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ধাপগুলো নেওয়া হয়েছে pgAdmin এর অফিসিয়াল Docs থেকে। আপনার
                Version এ কোনো মেনুর নাম বা জায়গা সামান্য আলাদা হলে App এ যা লেখা
                আছে সেটাই মানবেন, কাজের ক্রম একই থাকবে। শুরুর আগে দুটো জিনিস
                নিশ্চিত করুন: আপনার PostgreSQL চালু আছে (Install লেসনের{" "}
                <code className={CODE}>pg_isready</code>), আর island_tours Database
                টা তৈরি আর Load করা। Load করা না থাকলে{" "}
                <Link href="/sql/topic/load-sample-database" className={LINK}>
                  এই Module এর Lesson 06
                </Link>{" "}
                আগে করে নিন, অথবা এখন শুধু postgres Database দিয়ে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "pgAdmin",
          steps: [
            {
              title: "pgAdmin খুলুন",
              description:
                "Windows এ EDB Installer দিয়ে PostgreSQL বসালে pgAdmin আগে থেকেই আছে, Start Menu তে খুঁজুন। macOS আর Linux এ pgadmin.org/download থেকে নামান। পুরনো Version বা OS এর Password ভাণ্ডার না পেলে প্রথমবার একটা Master Password চাইতে পারে, যেটা Save করা Server Password গুলোকে তালা দেয়। এটা আপনার Database এর Password না, pgAdmin এর নিজের।",
            },
            {
              title: "নতুন Server Register করুন",
              description:
                "বাঁয়ের Object Explorer এ Servers লেখাটায় Right-click করুন, তারপর Register মেনু থেকে Server বেছে নিন। একটা Dialog খুলবে, যার কয়েকটা Tab আছে।",
            },
            {
              title: "General Tab: একটা নাম দিন",
              description:
                "Name ঘরে লিখুন Island Tours Local। এই নামটা শুধু গাছে দেখাবে। চাইলে Background রং বেছে নিন, পরে যখন Production এর Connection যোগ করবেন তখন রংটাই আপনাকে সাবধান করবে।",
            },
            {
              title: "Connection Tab: আসল ঠিকানা",
              description:
                "Host name/address: localhost। Port: 5432 (আপনার যদি 5433 হয়, সেটা)। Maintenance database: postgres। Username: postgres। Password: Install এর সময় যেটা দিয়েছেন। Save password? শুধু নিজের Laptop এ চালু করবেন, অফিসের বা শেয়ার করা মেশিনে না।",
            },
            {
              title: "Save করুন, গাছটা খুলুন",
              description:
                "Save চাপলে pgAdmin সাথে সাথে Connect করার চেষ্টা করবে। সফল হলে গাছে Island Tours Local দেখাবে। সেটা খুলে নামুন: Databases, island_tours, Schemas, public, Tables। আটটা Table চোখের সামনে।",
            },
            {
              title: "Query Tool খুলুন",
              description:
                "island_tours এ Right-click করে Query Tool বেছে নিন, অথবা উপরের Tools মেনু থেকে। নতুন একটা Tab খুলবে, উপরে SQL লেখার জায়গা, নিচে ফলাফলের জায়গা।",
            },
            {
              title: "Query লিখে চালান",
              description:
                "লিখুন: SELECT booking_id, status, total_bdt FROM bookings WHERE status = 'pending'; তারপর F5 চাপুন, যেটা pgAdmin এ Execute এর Shortcut। নিচের Data Output Tab এ চারটা Row আসবে: 14, 17, 20 আর 24।",
            },
            {
              title: "ফলাফল CSV তে Save করুন",
              description:
                "Data Output এর উপরের Save results to file আইকনে ক্লিক করলে ফলাফলটা কমা দিয়ে আলাদা করা একটা ফাইল হয়ে নামবে, যেটা Excel বা Google Sheets এ খোলা যায়।",
            },
            {
              title: "পুরো Database এর ছবি দেখুন",
              description:
                "গাছে island_tours এ Right-click করে ERD For Database বেছে নিন। pgAdmin সব Table এনে Foreign Key গুলো দাগ দিয়ে জুড়ে একটা ছবি বানাবে। Sample Database পাতার ছবির সাথে মিলিয়ে দেখুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Docker এ PostgreSQL চালালে",
          content: (
            <ContentParagraph>
              Install লেসনে যাঁরা island-pg নামের Container চালিয়েছেন আর তার Port
              আপনার মেশিনের 5432 এ খুলে দিয়েছেন, তাঁদের জন্য সব ঘর হুবহু একই:
              Host localhost, Port 5432। আর Port যদি অন্য কোথাও খুলে থাকেন, যেমন
              5433, তাহলে শুধু Port টা বদলাবেন। Container এর ভেতরের Port কত, সেটা
              GUI এর জানার দরকার নেই, তার জানা দরকার আপনার মেশিনের কোন দরজায় টোকা
              দিতে হবে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "walkthrough-dbeaver",
      subHeader: { index: "008", title: "Walkthrough: DBeaver" },
      title: <SectionTitle>DBeaver দিয়ে একই কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DBeaver এর পথটা একটু আলাদা, কিন্তু চেনা ঘরগুলোই আবার আসবে। এই ধাপগুলোও
              নেওয়া হয়েছে DBeaver এর নিজের Docs থেকে। DBeaver Community নামিয়ে নিন
              dbeaver.io থেকে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "DBeaver",
          steps: [
            {
              title: "New Connection Wizard খুলুন",
              description:
                "উপরের Toolbar বা Connections এর পাশের New Connection Wizard বোতামে ক্লিক করুন। DBeaver এর Docs অনুযায়ী Ctrl+Shift+N চাপলেও এটা খোলে।",
            },
            {
              title: "Driver বেছে নিন",
              description:
                "Database এর তালিকা থেকে PostgreSQL খুঁজে নিন, উপরের Search ঘরে লিখলে দ্রুত পাবেন। তারপর Next। Driver মানে সেই ছোট Program, যেটা DBeaver কে PostgreSQL এর ভাষায় কথা বলতে শেখায়।",
            },
            {
              title: "চেনা ঘরগুলো পূরণ করুন",
              description:
                "Host: localhost। Port: 5432। Database: island_tours। Username: postgres। Password: আপনার Password। এখানে সরাসরি island_tours লিখতে পারেন, pgAdmin এর মতো আগে postgres দিয়ে ঢোকার দরকার নেই।",
            },
            {
              title: "Test Connection, তারপর Finish",
              description:
                "Test Connection চাপুন। প্রথমবার Driver এর ফাইল না থাকলে DBeaver সেটা নামাতে চাইতে পারে। Docs বলছে বেশিরভাগ Driver সাথেই থাকে অথবা নিজে থেকে নামানো যায়, তাই অনুমতি দিন। সফল লিখলে Finish।",
            },
            {
              title: "গাছ ধরে Table এ পৌঁছান",
              description:
                "বাঁয়ের Connections গাছে নতুন Connection টা দেখাবে। খুলে খুলে island_tours এর Tables পর্যন্ত নামুন।",
            },
            {
              title: "একটা Table এর ছবি দেখুন",
              description:
                "bookings এ Double-click করলে Database Object Editor খুলবে। তার Diagram Tab এ গেলে bookings আর তার সাথে জোড়া Table গুলোর ছবি দেখাবে।",
            },
            {
              title: "Export করুন",
              description:
                "গাছে একটা Table এ Right-click করে Export Data, তারপর CSV বেছে Next। শেষ পাতায় ফাইল কোথায় যাবে সেটা দেখে Finish। Query এর ফলাফলের ছকেও Right-click করলে একই Export Data পাবেন।",
            },
            {
              title: "Connection এর ধরন ঠিক করুন",
              description:
                "DBeaver এ প্রতিটা Connection এর একটা ধরন থাকে: Development, Test অথবা Production। নতুন Connection নিজে থেকে Development। আসল Customer এর Data যেখানে, সেটাকে অবশ্যই Production বানাবেন। কেন, সেটা নিচের Safety অংশে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL ও একই জানালায়",
          content: (
            <ContentParagraph>
              একই Wizard এ PostgreSQL এর বদলে MySQL বেছে নিলে আপনার MySQL Server এর
              সাথেও Connect করা যায়। শুধু Port টা হবে MySQL এর নিজের 3306, আর
              Username সাধারণত root। MySQL বসানো আর চালু করা{" "}
              <Link href="/sql/topic/install-mysql" className={LINK}>
                এই Module এর Lesson 02
              </Link>{" "}
              তে। দুটো Connection পাশাপাশি থাকলে ভিডিওর MySQL Query আর আপনার
              PostgreSQL Query একই সাথে চালিয়ে মিলিয়ে দেখতে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "see-it-yourself",
      subHeader: { index: "009", title: "See It Yourself" },
      title: <SectionTitle>GUI এর গাছ আসলে কোন প্রশ্নের উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আগেই বলেছি, GUI যা দেখায় সেটা Server কে জিজ্ঞেস করে পাওয়া। কথাটা
                নিজের চোখে দেখার সময় এসেছে। প্রতিটা PostgreSQL Database এর ভেতরে
                information_schema নামে একটা বিশেষ জায়গা আছে, যেখানে Database
                নিজের সম্পর্কে তথ্য রাখে: কোন Table আছে, প্রতিটার কোন Column, কোন
                Foreign Key কোথায় দেখায়। GUI গুলো ঠিক এই ধরনের জায়গা থেকেই, প্রায়ই
                আরও ভেতরের pg_catalog থেকে, তাদের গাছ আর ছবি বানায়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের তিনটা বক্সে আসল PostgreSQL চলছে। SELECT এর নিয়ম শিখবেন
                Module 03 এ, এখন শুধু Run চেপে ফলাফলটা GUI এর কোন অংশের সাথে মেলে
                সেটা খেয়াল করুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="গাছের Tables অংশ"
              query={`SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;`}
              caption="আটটা Row, সবগুলো BASE TABLE, মানে আসল Table। pgAdmin এর গাছে Tables খুললে বা DBeaver এ Tables এর নিচে যে আটটা নাম দেখেন, এটাই সেই তালিকা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Table এর Columns"
              query={`SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'bookings'
ORDER BY ordinal_position;`}
              caption="bookings এর সাতটা Column, তাদের ধরন, খালি রাখা যায় কিনা, আর না দিলে কোন মান বসে। booked_at এর পাশে now() লক্ষ করুন। GUI তে bookings এর Columns খুললে ঠিক এই চারটা তথ্যই একটা সুন্দর ছকে দেখায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ER ছবির দাগগুলো"
              query={`SELECT tc.table_name   AS from_table,
       kcu.column_name AS from_column,
       ccu.table_name  AS to_table,
       ccu.column_name AS to_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name
 AND kcu.table_schema = tc.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
 AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY from_table, from_column;`}
              caption="সাতটা Row, প্রতিটা একটা Foreign Key: কোন Table এর কোন Column কোন Table কে দেখায়। pgAdmin এর ERD বা DBeaver এর Diagram যে সাতটা দাগ আঁকে, এগুলোই সেই সাতটা দাগ। Query টা লম্বা লাগছে? সেটাই GUI এর সুবিধা: আপনাকে এটা লিখতে হয় না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "জানালার পেছনে সবসময় SQL",
          content: (
            <ContentParagraph>
              GUI তে আপনি যাই ক্লিক করুন, শেষ পর্যন্ত সেটা একটা SQL হয়ে Server এ
              যায়। গাছ খোলা মানে একটা SELECT, ছকের একটা ঘর বদলানো মানে একটা
              UPDATE, একটা Table এ Drop মানে একটা DROP TABLE। এই কথাটা মাথায় রাখলে
              কোন ক্লিক নিরাপদ আর কোনটা বিপজ্জনক, সেটা নিজেই আন্দাজ করতে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "grid-edits",
      subHeader: { index: "010", title: "Grid Edits & Auto Commit" },
      title: <SectionTitle>ছকের ঘরে ক্লিক করে বদলানো, আর তার বিপদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বেশিরভাগ GUI তে ফলাফলের ছকের একটা ঘরে Double-click করে মান বদলে
                Save করা যায়, ঠিক Excel এর মতো। pgAdmin এর Docs বলে, SELECT এর
                ফলাফল যদি বদলানোর মতো হয়, তাহলে Query Tool এ সেটা Edit করা যায়।
                শুনতে খুব আরামের। কিন্তু মনে রাখুন, ঘরটা বদলানো মানে আপনার নামে
                Server এ একটা UPDATE যাওয়া।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা নতুন শব্দ: Auto commit। Database এ একটা পরিবর্তন প্রথমে
                কাঁচা থাকে, তারপর Commit হলে পাকা হয়, অন্য সবাই দেখতে পায় আর Crash
                হলেও টিকে থাকে। Auto commit চালু থাকা মানে প্রতিটা সফল Query নিজে
                থেকেই সাথে সাথে Commit। pgAdmin এর Docs এ Auto commit? Switch এর
                বর্ণনা ঠিক এটাই: চালু থাকলে প্রতিটা সফল Query চালানোর পরেই Commit
                হয়ে যায়। মানে ভুলটা ফেরানোর আর কোনো সুযোগ থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                DBeaver এখানে বুদ্ধিমান একটা কাজ করে। তার Docs অনুযায়ী Development
                আর Test ধরনের Connection এ Auto commit চালু থাকে, কিন্তু Production
                ধরনের Connection এ নিজে থেকেই বন্ধ, আর প্রতিটা SQL চালানো আর Data
                বদলানোর আগে আপনার কাছে নিশ্চিত হতে চায়।
              </ContentParagraph>
              <ContentParagraph>
                Auto commit বন্ধ থাকলে কী সুবিধা, সেটা নিচের বক্সে দেখুন। BEGIN
                দিয়ে একটা Transaction শুরু হয়, তার ভেতরের পরিবর্তন তখনো কাঁচা,
                আর ROLLBACK দিলে সব আগের মতো। Transaction এর পুরো গল্প Module 12 এ,
                এখন শুধু Run চাপুন আর দামটার দিকে তাকান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="ভুল বদল, তারপর ফিরিয়ে নেওয়া"
              query={`BEGIN;
UPDATE tours SET price_bdt = 1 WHERE tour_id = 1;
SELECT tour_id, price_bdt FROM tours WHERE tour_id = 1;
ROLLBACK;
SELECT tour_id, price_bdt FROM tours WHERE tour_id = 1;`}
              caption="প্রথম SELECT এ দাম 1.00, কারণ ভুল বদলটা Transaction এর ভেতরে তখনো আছে। ROLLBACK এর পরের SELECT এ দাম আবার 12500.00। Auto commit চালু থাকলে UPDATE চালানোর মুহূর্তেই দাম পাকাভাবে ১ টাকা হয়ে যেত, আর ফেরানোর এই সুযোগটা থাকত না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ছকে বদলানোর আগে তিনটা প্রশ্ন",
          content: (
            <ContentList>
              <ListItem>আমি কোন Server এ? নিচের Status লাইনটা পড়ুন, আর রংটা দেখুন।</ListItem>
              <ListItem>Auto commit চালু না বন্ধ? চালু থাকলে Save চাপা মানেই পাকা।</ListItem>
              <ListItem>
                এই Row টা কি ঠিক সেই Row? আগে WHERE দিয়ে শুধু সেই Row টা SELECT করে
                দেখে নিন, তারপর বদলান।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "export-csv",
      subHeader: { index: "011", title: "Export to CSV" },
      title: <SectionTitle>ফলাফল CSV তে বের করার তিন পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অফিসে সবচেয়ে বেশি যে অনুরোধটা আসে: এই মাসের হিসাবটা একটা Excel এ
                দিয়ে দাও। Excel সরাসরি Database পড়তে পারে না, কিন্তু CSV পারে। CSV
                মানে Comma Separated Values, একটা সাধারণ Text ফাইল যেখানে প্রতিটা
                লাইন একটা Row আর ঘরগুলো কমা দিয়ে আলাদা। তিনভাবে এটা বানানো যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>pgAdmin:</strong> Query Tool এ Query চালান, তারপর Data
                  Output এর Save results to file আইকন।
                </ListItem>
                <ListItem>
                  <strong>DBeaver:</strong> ফলাফলের ছকে বা গাছের Table এ Right-click,
                  Export Data, CSV। Wizard এ Delimiter আর Header এর মতো বিকল্প আছে,
                  শেষে ফাইলের জায়গা দেখে Finish।
                </ListItem>
                <ListItem>
                  <strong>psql:</strong> <code className={CODE}>\copy</code>{" "}
                  Command, এক লাইনে। প্রতি মাসে একই Report লাগলে এটাই সেরা, কারণ
                  Command টা একটা ফাইলে রেখে দিলে পরের মাসে শুধু চালালেই হলো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচে প্রতিটা Tour থেকে confirmed Booking এর আয়ের একটা Report,
                psql দিয়ে CSV তে। পরীক্ষার Server এ চালিয়ে যে ফলাফল এসেছিল, সেটাও
                দেওয়া আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "tour-revenue-to-csv.psql",
          code: `-- psql এর ভেতরে, island_tours এ Connected অবস্থায়। পুরোটা এক লাইনে লিখতে হয়।
\\copy (SELECT t.title, count(b.booking_id) AS bookings, coalesce(sum(b.total_bdt), 0) AS revenue_bdt FROM tours t LEFT JOIN departures d ON d.tour_id = t.tour_id LEFT JOIN bookings b ON b.departure_id = d.departure_id AND b.status = 'confirmed' GROUP BY t.tour_id, t.title ORDER BY revenue_bdt DESC, t.title) TO 'tour-revenue.csv' WITH (FORMAT csv, HEADER)

-- psql বলবে:
-- COPY 9

-- tour-revenue.csv এর প্রথম চার লাইন:
-- title,bookings,revenue_bdt
-- Saint Martin Island Escape,5,125000.00
-- Cox's Bazar Beach Weekend,3,93500.00
-- Sundarbans Mangrove Cruise,3,90000.00`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "\\copy আর COPY এক জিনিস না",
          content: (
            <ContentParagraph>
              Backslash সহ \copy হলো psql এর নিজের Command: Server থেকে Data এনে
              ফাইলটা লেখে আপনার মেশিনে, যেখানে psql চলছে। Backslash ছাড়া COPY হলো
              Server এর SQL Command: ফাইলটা লেখে Server এর মেশিনে, আর তার জন্য
              বিশেষ অনুমতি লাগে। নিজের Laptop এ Report চাইলে \copy। COPY আর বড়
              Data Load এর পুরো গল্প Module 10 এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "safety",
      subHeader: { index: "012", title: "Safety Habits" },
      title: <SectionTitle>Production এ GUI খোলার আগে ছয়টা অভ্যাস</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিজের Laptop এর island_tours এ যা খুশি করুন, ভুল হলে Sample ফাইলটা
                আবার Load করলেই সব ঠিক। কিন্তু একদিন আপনার GUI তে একটা Production
                Connection ও থাকবে, যেখানে আসল Customer, আসল টাকা। দুটো Tab পাশাপাশি
                খোলা, দুটো দেখতে হুবহু এক। অনেক বড় দুর্ঘটনা শুরু হয় ঠিক এখান থেকে:
                কেউ ভেবেছিলেন Local এ আছেন। নিচের ছয়টা অভ্যাস এই ভুলটাকে প্রায়
                অসম্ভব করে দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা পরিবেশের নিজের রং।</strong> pgAdmin এর Server
                  Dialog এ Background আর Foreground রং বেছে নেওয়া যায়। DBeaver এর
                  Production ধরনের Connection এর রং নিজে থেকেই ইটের মতো লাল।
                  TablePlus এ প্রতিটা Connection কে একটা Tag দিতে হয়: Local,
                  Testing, Development, Staging অথবা Production, সাথে একটা রং।
                  Production সবসময় লাল, আর কিছু না।
                </ListItem>
                <ListItem>
                  <strong>Production এ শুধু দেখার কাজ হলে Read only।</strong>{" "}
                  Connection String এর শেষে একটা options অংশ যোগ করে পুরো Session
                  টাকেই Read only করা যায়। পরীক্ষার Server এ এভাবে Connect করে
                  একটা UPDATE চালাতেই PostgreSQL কাজটা ফিরিয়ে দিয়েছে, নিচের কোডে
                  দেখুন।
                </ListItem>
                <ListItem>
                  <strong>Production এ কখনো Superuser না।</strong> Read only
                  Session একটা সিটবেল্ট, তালা না: পরীক্ষার Server এ একজন সাধারণ
                  User ও একটা SET Command দিয়ে সেটা বন্ধ করে ফেলতে পেরেছেন। ভুল
                  ক্লিক থেকে বাঁচায়, ইচ্ছা থেকে না। আসল তালা হলো দেখার কাজের জন্য
                  আলাদা একটা User, যাকে Server শুধু SELECT এর অনুমতি দিয়েছে। এমন
                  User বানানো শিখবেন Module 16 এ।
                </ListItem>
                <ListItem>
                  <strong>Save password শুধু নিজের মেশিনে।</strong> অফিসের শেয়ার
                  করা কম্পিউটারে GUI তে Password Save করলে সেই মেশিনে বসা যে কেউ
                  ঢুকতে পারবেন। pgAdmin নিজেও এই ব্যাপারে সাবধান: Server এর তালিকা
                  ফাইলে Export করলে Password সেখানে যায়ই না।
                </ListItem>
                <ListItem>
                  <strong>Password সহ String কখনো Chat এ না।</strong> Connection
                  দেখাতে হলে Password ছাড়া String পাঠান, আর Screenshot নেওয়ার আগে
                  Connection Dialog বন্ধ করুন।
                </ListItem>
                <ListItem>
                  <strong>কাজ শেষ, Tab বন্ধ।</strong> Production এর একটা Query Tab
                  সারাদিন খোলা রাখবেন না। DBeaver এর Production ধরনের Connection
                  নিজে থেকেই অলস Transaction দশ মিনিটে আর অলস Connection এক ঘণ্টায়
                  বন্ধ করে দেয়। নিজের অভ্যাসও তেমন হোক।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-only-session.sh",
          code: `# Password থাকে Shell এর Environment Variable এ, Command এ না।
# options=-c default_transaction_read_only=on, URI এর ভেতরে Percent-encode করা।
PGPASSWORD="$POSTGRES_PASSWORD" psql \\
  "postgresql://postgres@localhost:5432/island_tours?options=-c%20default_transaction_read_only%3Don" \\
  -c "UPDATE tours SET price_bdt = price_bdt WHERE tour_id = 1"

# PostgreSQL এর উত্তর:
# ERROR:  cannot execute UPDATE in a read-only transaction`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["GUI", "পরিবেশ চেনানোর উপায়", "Docs এ যা বলা আছে"],
          rows: [
            ["pgAdmin", "Server Dialog এর Background আর Foreground রং", "গাছে Server টা সেই রঙে দেখায়"],
            [
              "DBeaver",
              "Connection type: Development, Test, Production",
              "Production: ইটের মতো লাল, Auto commit বন্ধ, SQL চালানো আর Data বদলের আগে নিশ্চিত হওয়া",
            ],
            ["TablePlus", "প্রতিটা Connection এর রং আর Tag", "Tag পাঁচটা: Local, Testing, Development, Staging, Production"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "connect-errors",
      subHeader: { index: "013", title: "When It Won't Connect" },
      title: <SectionTitle>Connect হচ্ছে না? Error এর বাক্যই ঠিকানা বলে দেয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নতুন GUI তে প্রথম Connect প্রায়ই একবারে হয় না। হতাশ হওয়ার কিছু
                নেই। Connect চাপার পর থেকে Object Tree খোলা পর্যন্ত GUI কে চারটা
                দরজা পার হতে হয়, আর প্রতিটা দরজার নিজস্ব Error আছে। বাক্যটা পড়লেই
                বোঝা যায় ঠিক কোন ঘরে ভুল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectCheckpointsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের প্রতিটা বাক্য এই লেসনের জন্য একটা পরীক্ষার PostgreSQL 18 Server
              এ ইচ্ছা করে ভুল মান দিয়ে psql চালিয়ে পাওয়া। আপনার GUI সাধারণত একই
              বাক্যটা নিজের Popup এ দেখাবে, কখনো সামনে পেছনে একটু বাড়তি লেখাসহ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Error এর বাক্য", "কোন দরজায় আটকেছে", "কী দেখবেন, কী করবেন"],
          rows: [
            [
              "Connection refused, তার নিচের লাইনে: Is the server running on that host and accepting TCP/IP connections?",
              "Port এ কেউ নেই",
              "Server চালু কিনা দেখুন (pg_isready, Docker হলে docker ps)। Port টা ঠিক কিনা, 5432 না 5433।",
            ],
            [
              "server does not support SSL, but SSL was required",
              "SSL কথাবার্তা",
              "নিজের মেশিনের Server এ SSL নেই, অথচ আপনি require বলেছেন। SSL mode prefer বা disable দিন।",
            ],
            [
              "fe_sendauth: no password supplied",
              "Login",
              "Password এর ঘর খালি। Password দিন, বা psql এ PGPASSWORD Variable টা আছে কিনা দেখুন।",
            ],
            [
              "password authentication failed for user \"postgres\"",
              "Login",
              "Password বা Username ভুল। Docker এ মনে রাখবেন, POSTGRES_PASSWORD শুধু প্রথমবার খালি Data দিয়ে চালু করার সময় কাজ করে, পরে বদলালে পুরনো Password ই থেকে যায়।",
            ],
            [
              "database \"island_tour\" does not exist",
              "Database বাছাই",
              "নামের বানান ভুল, অথবা Database টা এখনো বানানো হয়নি। Lesson 06 এ island_tours বানানো আর Load করা।",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "GUI নিজেই Docker এ চললে localhost এর ফাঁদ",
          content: (
            <ContentParagraph>
              কেউ কেউ pgAdmin ও একটা Container এ চালান, কারণ pgadmin.org তে
              Container ও দেওয়া আছে। তখন pgAdmin এর ফর্মে localhost লিখলে সে খোঁজে
              নিজের Container এর ভেতরে, আপনার মেশিনে না, আর পায় না। Docker Desktop
              এর Docs অনুযায়ী Container এর ভেতর থেকে আপনার মেশিনকে ডাকার নাম{" "}
              <code className={CODE}>host.docker.internal</code>। তাই Host এর ঘরে
              সেটা লিখুন। এই একটা ভুলে অনেক নতুন Developer এর পুরো বিকেল চলে যায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর একটা টিম GUI কীভাবে ব্যবহার করতে পারে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধরা যাক Island Tours এর ছোট টিমটা এই লেসনের অভ্যাসগুলো মেনে চলে।
                প্রতিটা Developer এর GUI তে তিনটা Connection, তিন রঙে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Local, সাধারণ রং:</strong> নিজের Laptop এর island_tours।
                  এখানে ইচ্ছামতো Table বানানো, Row বদলানো, ভাঙা। ভুল হলে Sample
                  ফাইল আবার Load।
                </ListItem>
                <ListItem>
                  <strong>Staging, হলুদ:</strong> নতুন Feature Production এ যাওয়ার
                  আগে যেখানে পরীক্ষা হয়। Data নকল, কিন্তু পুরো টিম ব্যবহার করে, তাই
                  বদলানোর আগে টিমকে জানানো।
                </ListItem>
                <ListItem>
                  <strong>Production, লাল, Read only:</strong> আসল Customer।
                  Connection টা একটা শুধু দেখার User দিয়ে, String এ Read only অপশনসহ।
                  এখান থেকে কেউ ছকের ঘর বদলান না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এক সকালে Support থেকে প্রশ্ন এল: Booking 17 এর অবস্থা কী, Customer
                ফোন করেছেন। সাদিয়া লাল Connection টা খুলে একটা SELECT চালালেন:
                Booking 17 এখনো pending, মোট 36000 টাকা। উত্তর দিতে দুই মিনিট লাগল।
                Customer বললেন Booking টা বাতিল করতে চান। সাদিয়া ছকে status এর ঘরে
                cancelled লিখে দিলেন না। বাতিল করা হলো Island Tours এর Admin Panel
                থেকে, কারণ App শুধু status বদলায় না, সিট ফেরত দেয়, Customer কে Email
                পাঠায়, হিসাব মেলায়। ছকে হাতে বদলালে এর কোনোটাই ঘটত না।
              </ContentParagraph>
              <ContentParagraph>
                মাসের শেষে হিসাব বিভাগ চাইল কোন Tour থেকে কত আয়। কামরুল Export
                অংশের Query টা চালালেন। নয়টা Tour, সবচেয়ে বেশি Saint Martin Island
                Escape থেকে 125000 টাকা, দুটো Tour থেকে কিছুই না, আর সব মিলিয়ে
                confirmed Booking থেকে 423600 টাকা। Report টা CSV তে বের হয়ে হিসাব
                বিভাগের Excel এ চলে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "GUI তে দেখুন, App দিয়ে বদলান",
          content: (
            <ContentParagraph>
              Production Database এ GUI হলো জানালা, দরজা না। Data বদলানোর কাজ
              যতটা সম্ভব যায় App এর পথ দিয়ে, কারণ App একটা বদলের সাথে বাকি সব
              নিয়মও মেনে চলে। হাতে বদলানো যদি একান্তই লাগে, সেটা হোক লিখে রাখা SQL
              দিয়ে, Transaction এর ভেতরে, আর আরেকজনকে দেখিয়ে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "step-by-step",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>Connect চাপা থেকে ছকে Row পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "FLOW",
          steps: [
            {
              title: "Save করা Connection পড়া",
              description:
                "আপনি Island Tours Local এ Double-click করলেন। GUI তার কাছে রাখা Host, Port, Database আর Username বের করে, আর Password আনে নিজের ভাণ্ডার থেকে বা আপনাকে জিজ্ঞেস করে।",
            },
            {
              title: "Driver Connection বানায়",
              description:
                "GUI এর ভেতরের Driver এই টুকরোগুলো দিয়ে ঠিক সেই কাজ করে, যেটা psql একটা Connection String পেয়ে করে।",
            },
            {
              title: "TCP Connection",
              description:
                "localhost এর 5432 নম্বর Port এ একটা TCP Connection খোলে, সেই চেনা Three-way Handshake দিয়ে। Port এ কেউ না থাকলে এখানেই Connection refused।",
            },
            {
              title: "SSL এর কথা",
              description:
                "SSL mode অনুযায়ী Client জানতে চায় তালা দেওয়া যাবে কিনা। require বলে থাকলে আর Server না পারলে এখানেই থামে।",
            },
            {
              title: "Login",
              description:
                "Username আর Password দিয়ে Server পরিচয় যাচাই করে। ভুল হলে password authentication failed।",
            },
            {
              title: "Database বাছাই",
              description:
                "যে Database চাওয়া হয়েছে, Server সেটা খোঁজে। না পেলে database does not exist। পেলে Connection তৈরি, স্ট্যাটাস লাইনে Connected।",
            },
            {
              title: "গাছ সাজানো",
              description:
                "GUI চুপচাপ কয়েকটা প্রশ্ন পাঠায়, information_schema বা pg_catalog এ: কী কী Database, Schema আর Table আছে। উত্তর দিয়ে বাঁয়ের গাছ বানায়।",
            },
            {
              title: "আপনার Query",
              description:
                "আপনি Query লিখে Run বা F5 চাপলেন। GUI আপনার লেখা SQL টা হুবহু Text হিসেবে Server এ পাঠায়।",
            },
            {
              title: "Server এর কাজ",
              description:
                "Server Query টা পড়ে, কোন পথে চালাবে ঠিক করে, চালায়, আর Row গুলো ফেরত পাঠায়। Module 01 এর Parse, Plan, Execute এর গল্প।",
            },
            {
              title: "ছকে Row, আর Commit",
              description:
                "GUI Row গুলো ছকে সাজায়, কতগুলো Row আর কত সময় লাগল দেখায়। Query টা কিছু বদলালে আর Auto commit চালু থাকলে সেই মুহূর্তেই পাকা।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তৃতীয় ধাপের Handshake টা কীভাবে কাজ করে, DevOps ট্র্যাকের{" "}
              <Link href="/devops/topic/three-way-handshake" className={LINK}>
                Three-way Handshake লেসনে
              </Link>{" "}
              বিস্তারিত আছে। psql আর GUI দুজনেই ঠিক এই পথে হাঁটে, পার্থক্য শুধু
              প্রথম আর শেষ ধাপে: কে টুকরোগুলো জোগাড় করে, আর ফলাফল কোন চেহারায়
              দেখায়।
            </ContentParagraph>
          ),
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
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>GUI কে Database ভাবা।</strong> GUI মুছে আবার বসালে Data ফিরে
                আসবে, বা নতুন GUI এ Data নেই বলে ভয় পাওয়া। Data থাকে Server এ, GUI
                শুধু জানালা।
              </ListItem>
              <ListItem>
                <strong>pgAdmin এর Maintenance database এ island_tours খোঁজা।</strong>{" "}
                ওখানে postgres থাকলেও চলে। Connect হওয়ার পর গাছে Databases খুলে
                island_tours বেছে নিন, তারপর তার উপর Query Tool খুলুন।
              </ListItem>
              <ListItem>
                <strong>ভুল Database এ Query Tool খোলা।</strong> postgres Database
                এর উপর Query Tool খুলে SELECT * FROM bookings লিখলে Error আসবে,
                relation does not exist। Query Tool এর মাথায় দেখুন কোন Database এ
                আছেন।
              </ListItem>
              <ListItem>
                <strong>নিজের মেশিনে SSL require।</strong> Cloud এর জন্য পড়া কোনো
                টিউটোরিয়াল দেখে লোকাল Connection এ require দেওয়া, আর তারপর server
                does not support SSL দেখে বিভ্রান্ত হওয়া।
              </ListItem>
              <ListItem>
                <strong>GUI কে Container এ চালিয়ে localhost লেখা।</strong> তখন
                localhost মানে সেই Container নিজে। Docker Desktop এ
                host.docker.internal।
              </ListItem>
              <ListItem>
                <strong>Production এ Auto commit চালু রেখে ছকে বদলানো।</strong>{" "}
                Save চাপা মাত্রই পাকা, ফেরানোর উপায় থাকে শুধু Backup।
              </ListItem>
              <ListItem>
                <strong>Password সহ String Chat এ পাঠানো</strong> বা Connection Dialog
                খোলা রেখে Screenshot নেওয়া। একবার পাঠানো Password আর ফেরত আনা যায়
                না, বদলাতে হয়।
              </ListItem>
              <ListItem>
                <strong>একসাথে পাঁচটা GUI বসানো।</strong> শেখার শুরুতে একটা বেছে
                নিন। প্রতিটা App এর মেনু শেখায় যে সময় যায়, সেটা SQL শেখায় দিন।
              </ListItem>
              <ListItem>
                <strong>GUI ছাড়া কিছুই না পারা।</strong> যেদিন শুধু SSH আর
                Terminal থাকবে, সেদিন psql না জানলে আটকে যাবেন। দুটোই চালু রাখুন।
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
                <strong>pgAdmin Download</strong>, প্রতিটা OS এর জন্য pgAdmin 4
                নামানোর অফিসিয়াল পাতা, Container আর Python Package সহ।{" "}
                <ExtLink href="https://www.pgadmin.org/download/">pgadmin.org/download</ExtLink>
              </ListItem>
              <ListItem>
                <strong>pgAdmin Server Dialog</strong>, Connection ফর্মের প্রতিটা
                ঘরের অফিসিয়াল ব্যাখ্যা।{" "}
                <ExtLink href="https://www.pgadmin.org/docs/pgadmin4/latest/server_dialog.html">
                  pgadmin.org/docs/pgadmin4/latest/server_dialog.html
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>pgAdmin Query Tool</strong>, Query চালানো, ফলাফল Edit, CSV
                তে Save আর Plan দেখা।{" "}
                <ExtLink href="https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html">
                  pgadmin.org/docs/pgadmin4/latest/query_tool.html
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>pgAdmin ERD Tool</strong>, Database থেকে ER ছবি বানানো।{" "}
                <ExtLink href="https://www.pgadmin.org/docs/pgadmin4/latest/erd_tool.html">
                  pgadmin.org/docs/pgadmin4/latest/erd_tool.html
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>DBeaver Community</strong>, নামানোর পাতা আর পরিচয়।{" "}
                <ExtLink href="https://dbeaver.io/">dbeaver.io</ExtLink>
              </ListItem>
              <ListItem>
                <strong>DBeaver: Create Connection</strong>, নতুন Connection এর
                Wizard ধাপে ধাপে।{" "}
                <ExtLink href="https://dbeaver.com/docs/dbeaver/Create-Connection/">
                  dbeaver.com/docs/dbeaver/Create-Connection
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>DBeaver: Connection Types</strong>, Development, Test আর
                Production এর প্রতিটা Default।{" "}
                <ExtLink href="https://dbeaver.com/docs/dbeaver/Connection-Types/">
                  dbeaver.com/docs/dbeaver/Connection-Types
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>TablePlus: Manage Connections</strong>, Connection বানানো,
                URL থেকে Import, রং আর Tag।{" "}
                <ExtLink href="https://docs.tableplus.com/gui-tools/manage-connections">
                  docs.tableplus.com/gui-tools/manage-connections
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>DataGrip</strong>, JetBrains এর Database IDE এর পাতা।{" "}
                <ExtLink href="https://www.jetbrains.com/datagrip/">jetbrains.com/datagrip</ExtLink>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL for VS Code</strong>, Microsoft এর Extension এর
                পাতা।{" "}
                <ExtLink href="https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql">
                  marketplace.visualstudio.com, ms-ossdata.vscode-pgsql
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>Connection Strings</strong>, PostgreSQL এর Docs এ URI এর পুরো
                নিয়ম আর Percent-encoding এর কথা।{" "}
                <ExtLink href="https://www.postgresql.org/docs/current/libpq-connect.html">
                  postgresql.org/docs/current/libpq-connect.html
                </ExtLink>
              </ListItem>
              <ListItem>
                <strong>Docker Desktop Networking</strong>, Container এর ভেতর থেকে
                host.docker.internal দিয়ে নিজের মেশিনে পৌঁছানো।{" "}
                <ExtLink href="https://docs.docker.com/desktop/features/networking/networking-how-tos/">
                  docs.docker.com/desktop/features/networking/networking-how-tos
                </ExtLink>
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
                  GUI মানে Graphical User Interface: জানালা আর মাউসে চলা Client।
                  psql হলো CLI। দুজনেই একই Server এর একই দরজায় টোকা দেয়।
                </ListItem>
                <ListItem>
                  GUI যা দেখায় সেটা Server কে জিজ্ঞেস করে পাওয়া। GUI বাড়তি ক্ষমতা
                  দেয় না, আর GUI মুছলে কোনো Data হারায় না।
                </ListItem>
                <ListItem>
                  প্রায় সব GUI চার ভাগে: Object Tree, SQL Editor, Result Grid আর
                  Status লাইন।
                </ListItem>
                <ListItem>
                  pgAdmin শুধু PostgreSQL এর, বিনামূল্যে। DBeaver Community অনেক
                  Database এর, বিনামূল্যে। TablePlus Paid, DataGrip Non-commercial
                  কাজে বিনামূল্যে, আর VS Code এর PostgreSQL Extension। শুরুতে একটা।
                </ListItem>
                <ListItem>
                  Connect এর ফর্মের প্রতিটা ঘর Connection String এর একটা টুকরো।
                  Password থাকে আলাদা, আর URI তে বসালে চিহ্নগুলো Percent-encode।
                </ListItem>
                <ListItem>
                  ছকের ঘর বদলানো মানে UPDATE। Auto commit চালু থাকলে সাথে সাথে পাকা।
                  বদলানোর আগে Server, Auto commit আর Row, তিনটাই দেখে নিন।
                </ListItem>
                <ListItem>
                  CSV এর তিন পথ: pgAdmin এর Save results to file, DBeaver এর Export
                  Data, psql এর \copy।
                </ListItem>
                <ListItem>
                  Production এ নিজের রং, Read only, Superuser না, Password Save না,
                  String Chat এ না, কাজ শেষে Tab বন্ধ।
                </ListItem>
                <ListItem>
                  Connect না হলে বাক্যটা পড়ুন: refused মানে Port, SSL মানে SSL mode,
                  password মানে Login, does not exist মানে Database এর নাম।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                গাছটা খুলতে গিয়ে বারবার একটা শব্দ পেরিয়ে এসেছেন: Databases এর পরে
                Schemas, আর তার ভেতরে public। Database এর ভেতরে আবার Schema কেন? আর
                public নামটা কোথা থেকে এল? PostgreSQL একটা Table এর নাম দেখে কীভাবে
                বোঝে কোনটার কথা বলছেন? পরের লেসন,{" "}
                <Link href="/sql/topic/databases-schemas" className={LINK}>
                  Databases, Schemas আর search_path
                </Link>
                , ঠিক এই গাছের প্রতিটা স্তর খুলে দেখাবে।
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
      ["GUI Client", "জানালা আর মাউসে চলা Database Client, Data থাকে Server এ", "pgAdmin, DBeaver, TablePlus"],
      ["CLI", "লিখে চালানো Client, SSH এ একমাত্র উপায়", "psql"],
      ["চার ভাগ", "Object Tree, SQL Editor, Result Grid, Status লাইন", "যেকোনো GUI এর প্রথম পাতা"],
      ["Connection ফর্ম", "Connection String এর টুকরোগুলো আলাদা ঘরে", "pgAdmin এর Server Dialog"],
      ["Maintenance database", "pgAdmin এর প্রথম ঢোকার Database, সাধারণত postgres", "Connection Tab"],
      ["Percent-encoding", "URI তে @ হয় %40, # হয় %23", "sea%40view%237"],
      ["information_schema", "Database নিজের সম্পর্কে যে তথ্য রাখে", "গাছ আর ER ছবির উৎস"],
      ["Auto commit", "প্রতিটা সফল Query সাথে সাথে পাকা", "pgAdmin এর Auto commit? Switch"],
      ["Read only Session", "options দিয়ে পুরো Connection কে শুধু দেখার করা", "cannot execute UPDATE in a read-only transaction"],
      ["\\copy", "psql থেকে CSV, ফাইল লেখে নিজের মেশিনে", "COPY 9"],
      ["পরিবেশের রং", "Production সবসময় লাল আর আলাদা", "DBeaver Connection type, TablePlus Tag"],
      ["চার চেকপোস্ট", "Port, SSL, Login, Database, প্রতিটার নিজস্ব Error", "Connect না হলে Error এর বাক্য"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "সাদিয়া pgAdmin Uninstall করে আবার বসালেন। island_tours এর Data এর কী হলো?",
        options: [
          {
            key: "A",
            text: "সব Data মুছে গেছে, Sample ফাইল আবার Load করতে হবে",
            isCorrect: false,
            explanation: "Data কখনো pgAdmin এর ভেতরে ছিল না, তাই pgAdmin মুছলে Data যায় না।",
          },
          {
            key: "B",
            text: "কিছুই হয়নি, Data Server এ আছে। হারিয়েছে শুধু pgAdmin এ Save করা Connection এর তালিকা",
            isCorrect: true,
            explanation:
              "ঠিক। GUI একটা Client, জানালা মাত্র। নতুন করে Server Register করলেই সব আগের মতো দেখা যাবে।",
          },
          {
            key: "C",
            text: "Data আছে, কিন্তু শুধু psql দিয়ে দেখা যাবে",
            isCorrect: false,
            explanation: "যেকোনো Client দিয়েই দেখা যাবে, নতুন pgAdmin সহ।",
          },
          {
            key: "D",
            text: "শেষ যে Query গুলো চালিয়েছিলেন সেগুলোর পরিবর্তন হারিয়েছে",
            isCorrect: false,
            explanation: "Commit হওয়া পরিবর্তন Server এ পাকা। GUI মুছলে তার কিছু যায় আসে না।",
          },
        ],
      },
      {
        id: 2,
        text: "একজন Developer বললেন, আমার User এর bookings পড়ার অনুমতি নেই, তাই আমি DBeaver দিয়ে খুলে দেখব। কী হবে?",
        options: [
          {
            key: "A",
            text: "DBeaver দেখাতে পারবে, কারণ GUI এর নিজের Admin ক্ষমতা আছে",
            isCorrect: false,
            explanation: "GUI এর কোনো নিজস্ব ক্ষমতা নেই। সব অনুমতি Server দেয়, User দেখে।",
          },
          {
            key: "B",
            text: "একই Username দিয়ে Connect করলে DBeaver ও permission denied পাবে",
            isCorrect: true,
            explanation:
              "ঠিক। নিয়ম Server এর। কোন জানালা দিয়ে এলেন সেটা Server দেখে না, দেখে আপনি কে।",
          },
          {
            key: "C",
            text: "DBeaver পুরনো একটা Copy দেখাবে",
            isCorrect: false,
            explanation: "GUI কোনো Copy রাখে না। প্রতিবার Server কে জিজ্ঞেস করে।",
          },
          {
            key: "D",
            text: "Read only Mode এ খুললে দেখা যাবে",
            isCorrect: false,
            explanation: "Read only মানে লেখা বন্ধ, পড়ার অনুমতি দেওয়া না।",
          },
        ],
      },
      {
        id: 3,
        text: "pgAdmin এর Connection Tab এ Maintenance database এ কী লিখবেন, আর island_tours এ কীভাবে পৌঁছাবেন?",
        options: [
          {
            key: "A",
            text: "সাধারণত postgres। Connect হওয়ার পর গাছে Databases খুলে island_tours বেছে নেবেন",
            isCorrect: true,
            explanation:
              "ঠিক। pgAdmin প্রথমে Maintenance database দিয়ে ঢোকে, তারপর গাছে Server এর সব Database দেখায়।",
          },
          {
            key: "B",
            text: "অবশ্যই island_tours, নাহলে island_tours গাছে দেখাবে না",
            isCorrect: false,
            explanation: "postgres দিয়ে ঢুকলেও গাছে Server এর সব Database দেখায়।",
          },
          {
            key: "C",
            text: "ঘরটা খালি রাখতে হয়",
            isCorrect: false,
            explanation: "pgAdmin এর Docs অনুযায়ী এটা প্রথম Connect করার Database, তাই একটা নাম লাগে।",
          },
          {
            key: "D",
            text: "Server এর Password",
            isCorrect: false,
            explanation: "Password এর আলাদা ঘর আছে। Maintenance database একটা Database এর নাম।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা পরীক্ষার Password ছিল sea@view#7। সেটা হুবহু URI তে বসাতেই Error এল could not translate host name \"view#7@127.0.0.1\"। কেন?",
        options: [
          {
            key: "A",
            text: "Password ভুল ছিল",
            isCorrect: false,
            explanation: "Password ভুল হলে Error হতো password authentication failed। এখানে Server পর্যন্ত যাওয়াই হয়নি।",
          },
          {
            key: "B",
            text: "URI তে @ মানে Password শেষ, তাই psql বাকি অংশকে Host এর নাম ভেবেছে। @ কে %40 আর # কে %23 লিখতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। চিহ্নগুলোর URI তে নিজস্ব মানে আছে, তাই Percent-encode করতে হয়। GUI এর আলাদা Password ঘরে এই সমস্যা নেই।",
          },
          {
            key: "C",
            text: "localhost এর বদলে 127.0.0.1 লেখা হয়েছে",
            isCorrect: false,
            explanation: "127.0.0.1 আর localhost দুটোই নিজের মেশিন। সমস্যা Password এর চিহ্নে।",
          },
          {
            key: "D",
            text: "Server এ SSL চালু নেই",
            isCorrect: false,
            explanation: "SSL এর সমস্যা হলে Error এ SSL শব্দটা থাকত।",
          },
        ],
      },
      {
        id: 5,
        text: "নিজের Laptop এর PostgreSQL এ Connect করতে গিয়ে Error এল: server does not support SSL, but SSL was required। সবচেয়ে সম্ভাব্য সমাধান কী?",
        options: [
          {
            key: "A",
            text: "PostgreSQL আবার ইনস্টল করা",
            isCorrect: false,
            explanation: "Server ঠিক আছে। সে শুধু SSL চালু রাখেনি, যা লোকালে স্বাভাবিক।",
          },
          {
            key: "B",
            text: "Password বদলানো",
            isCorrect: false,
            explanation: "Login এর ধাপে পৌঁছানোর আগেই থেমেছে, তাই Password এর ভূমিকা নেই।",
          },
          {
            key: "C",
            text: "Connection এর SSL mode require থেকে prefer বা disable করা",
            isCorrect: true,
            explanation:
              "ঠিক। লোকাল Server এ সাধারণত SSL থাকে না, আর require বলা মানে তালা ছাড়া Connect করব না।",
          },
          {
            key: "D",
            text: "Port 5432 থেকে 5433 করা",
            isCorrect: false,
            explanation: "Port এ কেউ না থাকলে Error হতো Connection refused।",
          },
        ],
      },
      {
        id: 6,
        text: "pgAdmin এ Auto commit? চালু অবস্থায় আপনি ছকে একটা দাম বদলে Save করলেন। তারপর বুঝলেন ভুল Tour এর দাম বদলেছেন। এখন কী অবস্থা?",
        options: [
          {
            key: "A",
            text: "Ctrl+Z চাপলেই Server এ আগের দাম ফিরে আসবে",
            isCorrect: false,
            explanation: "Ctrl+Z Editor এর লেখা ফেরায়, Server এ পাকা হওয়া পরিবর্তন না।",
          },
          {
            key: "B",
            text: "পরিবর্তনটা সাথে সাথে Commit হয়ে গেছে। ঠিক করতে আরেকটা UPDATE লাগবে, আর আগের দাম জানতে হবে",
            isCorrect: true,
            explanation:
              "ঠিক। Auto commit মানে প্রতিটা সফল Query সাথে সাথে পাকা। এজন্যই Production এ Auto commit বন্ধ রাখা, আর বদলের আগে SELECT করে দেখে নেওয়া।",
          },
          {
            key: "C",
            text: "pgAdmin বন্ধ করলে পরিবর্তনটা বাতিল হয়ে যাবে",
            isCorrect: false,
            explanation: "Commit হয়ে গেলে App বন্ধ করলেও পরিবর্তন থেকে যায়।",
          },
          {
            key: "D",
            text: "কিছুই বদলায়নি, কারণ ছকের পরিবর্তন শুধু GUI তে থাকে",
            isCorrect: false,
            explanation: "ছকের ঘর বদলে Save মানে Server এ একটা UPDATE যাওয়া।",
          },
        ],
      },
      {
        id: 7,
        text: "pgAdmin একটা Container এ চলছে। Host এর ঘরে localhost আর Port 5432 দিয়েছেন, কিন্তু Connect হচ্ছে না, অথচ আপনার মেশিনে PostgreSQL চালু। কেন?",
        options: [
          {
            key: "A",
            text: "Container এর ভেতরে localhost মানে সেই Container নিজে, আপনার মেশিন না। Docker Desktop এ মেশিনটাকে ডাকতে হয় host.docker.internal দিয়ে",
            isCorrect: true,
            explanation: "ঠিক। একই শব্দ, জায়গা ভেদে আলাদা মেশিন। এই ভুলটা খুব সাধারণ।",
          },
          {
            key: "B",
            text: "pgAdmin Container এ চললে PostgreSQL এর সাথে কথা বলতে পারে না",
            isCorrect: false,
            explanation: "পারে, শুধু ঠিক Host এর নাম দিতে হয়।",
          },
          {
            key: "C",
            text: "Port 5432 শুধু psql এর জন্য",
            isCorrect: false,
            explanation: "Port টা Server এর। যেকোনো Client সেখানে আসতে পারে।",
          },
          {
            key: "D",
            text: "Maintenance database ভুল",
            isCorrect: false,
            explanation: "Database এর নাম ভুল হলে Error এ does not exist থাকত। এখানে Server পর্যন্তই পৌঁছানো যায়নি।",
          },
        ],
      },
      {
        id: 8,
        text: "Production এর Customer Data শুধু দেখার জন্য GUI তে একটা Connection বানাবেন। নিচের কোন জোড়া সবচেয়ে নিরাপদ?",
        options: [
          {
            key: "A",
            text: "postgres User, সাধারণ রং, Auto commit চালু",
            isCorrect: false,
            explanation: "Superuser, আলাদা করে চেনার উপায় নেই, আর প্রতিটা ভুল সাথে সাথে পাকা। সবচেয়ে বিপজ্জনক জোড়া।",
          },
          {
            key: "B",
            text: "শুধু SELECT পারে এমন একটা User, লাল রং বা Production Tag, আর Read only Session",
            isCorrect: true,
            explanation:
              "ঠিক। কম ক্ষমতার User, চোখে পড়ার মতো রং, আর Session টাই Read only, তিন স্তরের সুরক্ষা।",
          },
          {
            key: "C",
            text: "postgres User, কিন্তু Password Save না করা",
            isCorrect: false,
            explanation: "Password Save না করা ভালো অভ্যাস, কিন্তু Superuser দিয়ে দেখার কাজ করা তবুও ঝুঁকি।",
          },
          {
            key: "D",
            text: "যেকোনো User, শুধু নামে Production লিখে রাখা",
            isCorrect: false,
            explanation: "নাম একটা লেবেল মাত্র, কোনো ভুল আটকায় না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের মেশিনে একটা GUI চালু করুন, আর তার পেছনটা দেখুন",
    subtitle: "pgAdmin বা DBeaver দিয়ে island_tours এ ঢোকা, আর psql দিয়ে একই কাজের ছায়া",
    stepName: "LAB",
    steps: [
      {
        title: "একটা GUI বেছে নিয়ে বসান",
        description:
          "শুধু PostgreSQL হলে pgAdmin, MySQL ও ধরবেন বলে ভাবলে DBeaver Community। Windows এ EDB Installer দিয়ে PostgreSQL বসিয়ে থাকলে pgAdmin আগে থেকেই আছে।",
      },
      {
        title: "Island Tours Local নামে Connection বানান",
        description:
          "Host localhost, Port 5432 (বা আপনার 5433), Username postgres, Database pgAdmin এ postgres আর DBeaver এ island_tours। Password GUI এর Password ঘরে, আর কোথাও না।",
      },
      {
        title: "গাছ ধরে আটটা Table খুঁজুন",
        description:
          "Databases, island_tours, Schemas, public, Tables। আটটা নাম Sample Database পাতার সাথে মেলান। তারপর দ্বিতীয় কোড এর তিনটা Query GUI এর SQL Editor এ চালিয়ে দেখুন গাছের সাথে মেলে কিনা।",
      },
      {
        title: "ER ছবি আর সাতটা দাগ",
        description:
          "pgAdmin এ ERD For Database, DBeaver এ একটা Table এর Diagram Tab। দাগগুলো গুনুন, তৃতীয় কোডের সাতটা Row এর সাথে মেলান।",
      },
      {
        title: "psql দিয়ে নিজেকে GUI এর মতো পরিচয় দিন",
        description:
          "প্রথম কোডটা Terminal এ চালান। application_name দিয়ে Connect করে pg_stat_activity তে নিজের Connection খুঁজে বের করুন। GUI খোলা থাকলে তার Connection টাও সেখানে দেখবেন, নিজের নামে।",
      },
      {
        title: "Read only, CSV আর ভুল ফেরানো",
        description:
          "চতুর্থ কোডে Read only Session এ UPDATE চালিয়ে Error টা দেখুন। পঞ্চম কোডে \\copy দিয়ে Report CSV তে বের করে Excel এ খুলুন। ষষ্ঠ কোডে BEGIN আর ROLLBACK দিয়ে একটা ভুল বদল ফিরিয়ে নিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-connect-like-a-gui.sh",
        language: "bash",
        code: `# Password আগে একবার Shell এ রাখুন (Install লেসনের নিয়ম), Command এ কখনো না।
# application_name=my-gui মানে Server এর কাছে নিজের একটা নাম বলে দেওয়া।
PGPASSWORD="$POSTGRES_PASSWORD" psql \\
  "postgresql://postgres@localhost:5432/island_tours?application_name=my-gui" \\
  -c "SELECT application_name, usename, datname
      FROM pg_stat_activity
      WHERE application_name = 'my-gui';"

# পরীক্ষার Server এ যা এসেছিল:
#  application_name | usename  |   datname
# ------------------+----------+--------------
#  my-gui           | postgres | island_tours
# (1 row)`,
      },
      {
        filename: "2-what-the-tree-shows.sql",
        language: "sql",
        code: `-- গাছের Tables অংশ: আটটা Row
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- একটা Table এর Columns: bookings এর সাতটা Row
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'bookings'
ORDER BY ordinal_position;

-- যে চারটা pending Booking নিয়ে লেসন শুরু হয়েছিল
SELECT booking_id, status, total_bdt
FROM bookings
WHERE status = 'pending';
--  14 | pending | 50000.00
--  17 | pending | 36000.00
--  20 | pending | 15600.00
--  24 | pending | 15600.00`,
      },
      {
        filename: "3-er-lines.sql",
        language: "sql",
        code: `-- ER ছবির প্রতিটা দাগ একটা Foreign Key। মোট সাতটা।
SELECT tc.table_name   AS from_table,
       kcu.column_name AS from_column,
       ccu.table_name  AS to_table,
       ccu.column_name AS to_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON kcu.constraint_name = tc.constraint_name
 AND kcu.table_schema = tc.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
 AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY from_table, from_column;

--  bookings   | customer_id    | customers    | customer_id
--  bookings   | departure_id   | departures   | departure_id
--  departures | tour_id        | tours        | tour_id
--  payments   | booking_id     | bookings     | booking_id
--  reviews    | booking_id     | bookings     | booking_id
--  tours      | destination_id | destinations | destination_id
--  tours      | guide_id       | guides       | guide_id`,
      },
      {
        filename: "4-read-only-session.sh",
        language: "bash",
        code: `# পুরো Session Read only: options=-c default_transaction_read_only=on, Percent-encode করা
PGPASSWORD="$POSTGRES_PASSWORD" psql \\
  "postgresql://postgres@localhost:5432/island_tours?options=-c%20default_transaction_read_only%3Don" \\
  -c "UPDATE tours SET price_bdt = price_bdt WHERE tour_id = 1"

# ERROR:  cannot execute UPDATE in a read-only transaction`,
      },
      {
        filename: "5-tour-revenue-csv.psql",
        language: "sql",
        code: `-- psql এর ভেতরে চালান (psql -d island_tours)। পুরোটা এক লাইনে।
\\copy (SELECT t.title, count(b.booking_id) AS bookings, coalesce(sum(b.total_bdt), 0) AS revenue_bdt FROM tours t LEFT JOIN departures d ON d.tour_id = t.tour_id LEFT JOIN bookings b ON b.departure_id = d.departure_id AND b.status = 'confirmed' GROUP BY t.tour_id, t.title ORDER BY revenue_bdt DESC, t.title) TO 'tour-revenue.csv' WITH (FORMAT csv, HEADER)

-- COPY 9
-- ফাইলের প্রথম লাইন: title,bookings,revenue_bdt
-- নয়টা Tour এর আয় মিলিয়ে 423600.00, যা confirmed Booking এর মোট টাকা`,
      },
      {
        filename: "6-undo-a-wrong-edit.sql",
        language: "sql",
        code: `-- Auto commit বন্ধ থাকলে যা হয়, সেটা হাতে করে দেখা
BEGIN;
UPDATE tours SET price_bdt = 1 WHERE tour_id = 1;
SELECT tour_id, price_bdt FROM tours WHERE tour_id = 1;   -- 1.00
ROLLBACK;
SELECT tour_id, price_bdt FROM tours WHERE tour_id = 1;   -- 12500.00`,
      },
    ],
  },
  assignment: {
    title: "Mini Project: নিজের নিরাপদ GUI Setup",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দুটো জানালা, একই উত্তর:</strong> pending Booking গুলোর Query টা
        একবার psql এ আর একবার আপনার GUI তে চালান। দুটোর Screenshot পাশাপাশি
        রাখুন (Password বা Connection Dialog যেন দেখা না যায়), আর এক লাইনে লিখুন
        কেন দুটো হুবহু এক।
      </span>,
      <span key="2">
        <strong>তিন রঙের Connection:</strong> GUI তে তিনটা Connection বানান, তিনটাই
        আপাতত নিজের island_tours এ: Local, Staging আর Production নামে। তিনটাকে
        তিনটা আলাদা রং দিন, Production লাল। Production টাকে Read only করুন:
        pgAdmin বা DBeaver এ String এর options অংশ বা নিজের GUI এর Read only
        বিকল্প দিয়ে। একটা UPDATE চালিয়ে প্রমাণ করুন যে সেটা ফিরিয়ে দেয়।
      </span>,
      <span key="3">
        <strong>চার দরজার চারটা Error:</strong> নিজের মেশিনে ইচ্ছা করে চারটা ভুল
        করুন: ভুল Port, লোকালে SSL require, ভুল Password, আর ভুল বানানের
        Database। প্রতিটার Error হুবহু লিখুন আর পাশে লিখুন সেটা চার দরজার কোনটা।
      </span>,
      <span key="4">
        <strong>GUI এর ছবি বনাম SQL:</strong> GUI এর ER ছবিতে সাতটা দাগ গুনুন,
        তারপর Lab এর তৃতীয় Query চালান। একটা ছোট ছক বানান: প্রতিটা দাগ কোন Row,
        আর কোন Table কোনটাকে দেখায়।
      </span>,
      <span key="5">
        <strong>নতুন সহকর্মীর জন্য এক পাতা:</strong> এমন একজনের জন্য এক পাতার
        নির্দেশিকা লিখুন, যিনি কাল প্রথম দিন অফিসে আসবেন। কোন GUI, কোন Connection,
        কোন রং, Password কোথায় থাকবে, Production এ কী করবেন না, আর Connect না হলে
        কোন বাক্য দেখে কী বুঝবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">psql আর GUI এর একই ফলাফলের দুটো Screenshot, এক লাইনের ব্যাখ্যাসহ</span>,
      <span key="2">তিন রঙের Connection এর Screenshot আর Read only এর Error</span>,
      <span key="3">চারটা Error, প্রতিটার দরজার নামসহ</span>,
      <span key="4">সাতটা Foreign Key এর ছক</span>,
      <span key="5">নতুন সহকর্মীর জন্য এক পাতার নির্দেশিকা</span>,
    ],
  },
};
