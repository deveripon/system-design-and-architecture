import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { SqlPlayground } from "../../../components/course/sql/sql-playground";
import { IslandToursDatabaseBrief } from "../../../components/course/topics/island-tours/database-brief";
import { IslandToursDatabaseDiagram } from "../../../components/course/topics/island-tours/database-diagram";
import {
  FollowTheKeysLab,
  KeyRulesLab,
} from "../../../components/course/topics/sql-basics/relational-animations";
import {
  ForeignKeyDiagram,
  OneToManyDiagram,
  TableAnatomyDiagram,
  WideVsSplitDiagram,
} from "../../../components/course/topics/sql-basics/relational-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const code = "font-mono text-[0.875em] text-foreground";
const link = "text-primary underline underline-offset-4";

export const relationalModelContent: TopicData = {
  id: "relational-model",
  introduction: {
    badge: "MODULE 01 · LESSON 04",
    title: <SectionTitle>ছয়টা খাতা, একটা উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Island Tours এর অফিসে একটা ফোন এলো। ওপাশে Nusrat Jahan বললেন, তাঁর
          Booking নম্বর ১৩, তিনি জানতে চান কবে রওনা, কোন ট্যুর, আর Guide কে।
          অফিসের কর্মী Screen এ নম্বরটা লিখলেন, আর এক মুহূর্তে উত্তর চলে এলো:
          Saint Martin Island Escape, রওনা ২০ নভেম্বর ২০২৬, দুটো সিট, Guide
          Jamal Hossain।
        </ContentParagraph>
        <ContentParagraph>
          মজার ব্যাপার হলো, এই উত্তরটা Database এর কোনো এক জায়গায় পুরোটা লেখা
          নেই। Booking এর লাইনে Customer এর নামই নেই, ট্যুরের নামও নেই। আছে শুধু
          কয়েকটা নম্বর। উত্তরটা জোড়া লাগানো হয়েছে ছয়টা আলাদা খাতা থেকে, এক
          নম্বর ধরে আরেক খাতায়, সেখান থেকে আরেক নম্বর ধরে আরেক খাতায়, এভাবে
          হেঁটে হেঁটে।
        </ContentParagraph>
        <ContentParagraph>
          Data সাজানোর এই পদ্ধতির নাম Relational Model। PostgreSQL, MySQL, SQLite,
          SQL Server, Oracle, সবাই এই পদ্ধতিতে চলে, আর আপনার দেখা MySQL ভিডিওতে
          যে RDBMS শব্দটা বারবার আসে, সেটা এই মডেলের উপর বানানো DBMS এর নাম। এই
          লেসনে আপনি শিখবেন Table, Row, Column, Schema, Primary Key আর Foreign Key
          আসলে কী, কেন Data কে ভেঙে কয়েকটা Table এ রাখা হয়, ভাঙা টুকরোগুলো
          আবার কীভাবে জোড়া লাগে, আর Database নিজে কোন কোন ভুল ঢুকতেই দেয় না।
          এই লেসনের প্রতিটা শব্দ পুরো ট্র্যাকে প্রায় প্রতিদিন আসবে, তাই এখানে
          একটু ধীরে চলাটাই লাভের।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "প্রতিটা জিনিস থাকবে নিজের খাতায়, লেখা থাকবে একবারই, আর অন্য খাতায় তার জায়গায় থাকবে শুধু তার নম্বর।",
      author: "Relational Model",
      role: "Lesson 04",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>১৯৭০ সালের একটা সহজ ধারণা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ষাটের দশকের Database গুলোতে Data সাজানো থাকত গাছের ডালের মতো,
                আগে থেকে ঠিক করা কিছু পথে। একটা Customer এর নিচে তাঁর Order,
                Order এর নিচে তার জিনিসপত্র। কোনো Program কিছু জানতে চাইলে তাকে
                জানতে হতো Data কোন পথে সাজানো, আর সেই পথ ধরে ধাপে ধাপে হাঁটতে
                হতো। পথ বদলালে Program ও নতুন করে লিখতে হতো। প্রশ্ন যদি এমন হতো
                যেটার কথা নকশা বানানোর সময় কেউ ভাবেনি, তাহলে উত্তর বের করা ছিল
                রীতিমতো একটা Project।
              </ContentParagraph>
              <ContentParagraph>
                ১৯৭০ সালে IBM এর একজন Computer Scientist, Edgar F. Codd, যাঁর পড়াশোনা
                শুরু হয়েছিল গণিত দিয়ে, একটা প্রবন্ধ লিখলেন,
                নাম ছিল A Relational Model of Data for Large Shared Data Banks।
                তাঁর প্রস্তাব শুনতে প্রায় অতিরিক্ত সহজ লাগে। সব Data রাখা হবে শুধু
                সাধারণ Table এ, সারি আর কলামে। এক Table এর সাথে আরেক Table এর যোগ
                থাকবে কোনো লুকানো পথ দিয়ে না, বরং মান দিয়ে, মানে একটা নম্বর দিয়ে।
                আর প্রশ্ন করার সময় আপনি শুধু বলবেন কী চান। কোন পথে খুঁজে আনতে
                হবে, সেটা ঠিক করবে Database নিজে।
              </ContentParagraph>
              <ContentParagraph>
                এই শেষ কথাটাই আজকের SQL এর মূল। Lesson 05 এ দেখবেন, SQL এ আপনি
                লেখেন কী চাই, কীভাবে আনতে হবে তা লেখেন না। সেটা সম্ভব হয়েছে কারণ
                Data এখন সাজানো একটা সরল, অনুমান করা যায় এমন আকারে: Table।
              </ContentParagraph>
              <ContentParagraph>
                Codd গণিত থেকে একটা শব্দ নিয়েছিলেন, Relation। গণিতে Relation মানে
                একই আকারের কিছু সারির একটা সেট। Codd এর মডেলে Relation মানে ঠিক
                সেটাই, যাকে আমরা রোজকার ভাষায় বলি Table। তাই Relational Database
                মানে এমন Database যেখানে সব Data Table এ থাকে। আর যে DBMS এই
                মডেলে চলে, তাকে বলে RDBMS, Relational Database Management System।
                Lesson 02 তে DBMS কী তা দেখেছেন, RDBMS হলো তারই এই বিশেষ ধরন।
                PostgreSQL, MySQL, SQLite, Microsoft SQL Server, Oracle, সবাই RDBMS।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Relation মানে Table, সম্পর্ক না",
          content: (
            <ContentParagraph>
              অনেকে ভাবেন Relational নাম হয়েছে কারণ Table গুলোর মধ্যে সম্পর্ক
              (Relationship) থাকে। কথাটা শুনতে যুক্তিসঙ্গত, কিন্তু ভুল। Relation
              হলো Table এর গাণিতিক নাম। Table গুলোর মধ্যে সম্পর্ক অবশ্যই থাকে, আর
              সেটাও এই লেসনে শিখবেন, কিন্তু নামটা এসেছে Table থেকে। প্রমাণ
              PostgreSQL নিজেই দেয়। ভুল Table এর নাম লিখলে Error আসে relation
              tuors does not exist, মানে tuors নামে কোনো Table নেই।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 02 */
    {
      id: "the-table",
      subHeader: { index: "002", title: "The Table" },
      title: <SectionTitle>Table: একটা জিনিসের একটা খাতা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                স্কুলের হাজিরা খাতার কথা ভাবুন। প্রতিটা ক্লাসের একটা খাতা। খাতার
                উপরে ছাপানো ঘর: রোল, নাম, তারপর দিনের পর দিন। প্রতিটা লাইনে একজন
                ছাত্র। কেউ সেই খাতায় স্কুলের বাজেট লেখে না, শিক্ষকদের বেতনও না।
                একটা খাতা, একটা ধরনের জিনিস।
              </ContentParagraph>
              <ContentParagraph>
                Table ঠিক এই খাতা। একটা নাম আছে, যেমন <code className={code}>customers</code>।
                উপরে কয়েকটা ঘরের নাম, যেমন <code className={code}>full_name</code>,{" "}
                <code className={code}>city</code>। আর নিচে লাইনের পর লাইন, প্রতিটা
                লাইনে একজন Customer। নিয়মটা কঠোর: একটা Table এ শুধু একটা ধরনের
                জিনিস। Customer এর খাতায় শুধু Customer, Tour এর খাতায় শুধু Tour।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Database এ এমন আটটা খাতা আছে। প্রতিটা ব্যবসার
                একটা করে আলাদা জিনিসের:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={code}>destinations</code>: যে জায়গাগুলোতে ট্যুর
                  হয়, যেমন Saint Martin, Sundarbans, Sylhet। সাতটা Row।
                </ListItem>
                <ListItem>
                  <code className={code}>guides</code>: যাঁরা ট্যুরে সাথে যান।
                  পাঁচজন।
                </ListItem>
                <ListItem>
                  <code className={code}>tours</code>: বিক্রির জন্য ট্যুর প্যাকেজ।
                  নয়টা।
                </ListItem>
                <ListItem>
                  <code className={code}>customers</code>: যাঁরা Account খুলেছেন।
                  পনেরোজন।
                </ListItem>
                <ListItem>
                  <code className={code}>departures</code>: প্রতিটা ট্যুরের নির্দিষ্ট
                  রওনার তারিখ। ষোলোটা।
                </ListItem>
                <ListItem>
                  <code className={code}>bookings</code>: কে কোন তারিখে কয়টা সিট
                  নিলেন। চব্বিশটা।
                </ListItem>
                <ListItem>
                  <code className={code}>payments</code>: টাকা দেওয়ার প্রতিটা চেষ্টা।
                  উনিশটা।
                </ListItem>
                <ListItem>
                  <code className={code}>reviews</code>: ঘুরে আসার পর রেটিং। দশটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছবিতে <code className={code}>customers</code> খাতার একটা
                অংশ। খেয়াল করুন চারটা জিনিস: Table এর নাম, উপরের ঘরের নামগুলো,
                একেকটা লাইন, আর লাইন আর ঘরের কাটাকুটিতে একেকটা ছোট ঘর। পরের
                সেকশনগুলো এই চারটার নাম আর নিয়ম নিয়েই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <TableAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Table এর নাম কেন ছোট হাতের, ইংরেজিতে, আর বহুবচনে",
          content: (
            <ContentParagraph>
              Island Tours এর সব Table এর নাম ছোট হাতের অক্ষরে, শব্দের মাঝে
              Underscore, আর বহুবচনে: <code className={code}>customers</code>,{" "}
              <code className={code}>departures</code>। এটা আইন না, একটা প্রচলিত
              অভ্যাস, যাকে বলে snake_case। আপাতত এটুকু মনে রাখুন, একটা Project এ
              একটা নিয়ম বেছে নিয়ে সবখানে সেটাই মানা হয়। বড় হাতের নাম কেন ঝামেলা
              করে আর নামের পুরো নিয়ম কী, Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 03 */
    {
      id: "rows-and-columns",
      subHeader: { index: "003", title: "Rows and Columns" },
      title: <SectionTitle>Row মানে একটা জিনিস, Column মানে একটা বৈশিষ্ট্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                খাতার উপরের প্রতিটা ছাপানো ঘরকে বলে Column। একটা Column মানে সব
                জিনিসের একটা বৈশিষ্ট্য। <code className={code}>customers</code> এর{" "}
                <code className={code}>city</code> Column এ প্রত্যেক Customer এর
                শহর, আর শুধু শহর। বইয়ে Column কে কখনো বলা হয় Field, আর Relational
                Model এর ভাষায় Attribute। তিনটা নামই একটা জিনিসের।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা লাইনকে বলে Row। একটা Row মানে একটা জিনিস, এখানে একজন
                Customer। Row এর আরেক নাম Record, আর গণিতের ভাষায় Tuple। আপনার MySQL
                ভিডিওতে Row আর Record দুটো শব্দই পাবেন, দুটোর মানে এক।
              </ContentParagraph>
              <ContentParagraph>
                এবার চারটা নিয়ম, যেগুলো Table কে Spreadsheet থেকে আলাদা করে। প্রতিটা
                নিয়মের পেছনে Lesson 01 এর কোনো না কোনো ভোগান্তি আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>এক Column, এক ধরনের মান।</strong> <code className={code}>seats</code>{" "}
                  Column এ শুধু সংখ্যা ঢুকবে। কেউ সেখানে পাঁচ লিখে দিতে পারবেন না,
                  লিখতে হবে 5। কোন Column এ কোন ধরনের মান বসবে, তার নাম Data Type।
                  Spreadsheet এ যেকোনো ঘরে যা খুশি লেখা যায়, Table এ যায় না। Data
                  Type নিয়ে পুরো আলোচনা Module 09 এ।
                </ListItem>
                <ListItem>
                  <strong>এক ঘর, এক মান।</strong> একটা Customer দুটো ট্যুরে গেলে
                  একটা ঘরে লেখা হয় না Saint Martin, Sajek। একটা ঘরে একটাই মান।
                  দুটো ট্যুর মানে দুটো আলাদা Booking, দুটো আলাদা Row। কেন এই নিয়ম
                  এত জরুরি, Relationships সেকশনে স্পষ্ট হবে, আর এর আনুষ্ঠানিক নাম
                  First Normal Form শিখবেন Module 11 এ।
                </ListItem>
                <ListItem>
                  <strong>Row এর কোনো নিজস্ব ক্রম নেই।</strong> খাতায় কে আগে কে
                  পরে লেখা, Table সেটা কথা দেয় না। Database Row গুলো যেকোনো ক্রমে
                  ফেরত দিতে পারে, আজ এক রকম, Data বাড়লে কাল আরেক রকম। নির্দিষ্ট
                  ক্রম চাইলে মুখে বলতে হয়, ORDER BY দিয়ে, যা শিখবেন Module 03 এ।
                </ListItem>
                <ListItem>
                  <strong>Column এর ক্রমেরও মানে নেই।</strong> আপনি কোনো মান চান
                  Column এর নাম ধরে, তিন নম্বর ঘর বলে না। তাই{" "}
                  <code className={code}>city</code> আগে না{" "}
                  <code className={code}>country</code> আগে, তাতে Data এর মানে
                  বদলায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আরেকটা নিয়ম বাকি থাকল, সবচেয়ে বড়টা। Codd এর গণিতে একই রকম দুটো
                সারি একসাথে থাকতেই পারে না। বাস্তবের SQL Table এ কিন্তু পারে, যদি
                না আপনি আলাদা করে আটকান। দুটো Row যদি হুবহু এক হয়, তাহলে কোনটা কে
                বোঝার উপায় থাকে না, একটাকে বদলাতে গেলে দুটোই বদলায়, মুছতে গেলে
                দুটোই মোছে। তাই প্রতিটা Row এর একটা নিজস্ব পরিচয় লাগে। সেই পরিচয়ের
                নাম Primary Key, আর সেখানে যাওয়ার আগে একটা ছোট কিন্তু জরুরি
                শব্দ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Spreadsheet এর Column আর Table এর Column এর আসল তফাত",
          content: (
            <ContentParagraph>
              Spreadsheet এর Column আসলে শুধু একটা দৃশ্যমান সারি, মাথায় কেউ একটা
              নাম লিখে দিয়েছে। নিচের ঘরগুলো সেই নাম মানতে বাধ্য না। Table এর
              Column একটা চুক্তি। তার নাম আছে, ধরন আছে, আর নিয়ম আছে, যেমন খালি
              রাখা যাবে কিনা। প্রতিটা নতুন Row ঢোকার সময় Database সেই চুক্তি মিলিয়ে
              দেখে, না মিললে Row টা ঢুকতেই দেয় না।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 04 */
    {
      id: "schema",
      subHeader: { index: "004", title: "Schema" },
      title: <SectionTitle>Schema: খাতার ছাপানো ঘরগুলো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                একটা ফাঁকা ভর্তির ফর্ম আর একশটা পূরণ করা ফর্মের কথা ভাবুন। ফাঁকা
                ফর্মে কোন কোন ঘর আছে, কোন ঘরে কী লিখতে হবে, কোনটা বাধ্যতামূলক, সেটা
                একবার ঠিক হয়। তারপর প্রতিদিন নতুন নতুন ফর্ম পূরণ হয়।
              </ContentParagraph>
              <ContentParagraph>
                Database এ ফাঁকা ফর্মের নাম Schema। Schema মানে কাঠামো: কোন কোন Table
                আছে, প্রতিটায় কোন কোন Column, প্রতিটা Column এর ধরন কী, আর কোন নিয়ম
                লাগানো। আর পূরণ করা ফর্মগুলো হলো Data, মানে Row গুলো। Schema বদলায়
                কদাচিৎ, যখন ব্যবসায় নতুন কিছু যোগ হয়। Data বদলায় প্রতি সেকেন্ডে,
                প্রতিটা নতুন Booking এ।
              </ContentParagraph>
              <ContentParagraph>
                মজার কথা, Database নিজের Schema নিজের ভেতরেই রাখে, আর আপনি সেটা
                ঠিক অন্য Data এর মতোই জিজ্ঞেস করতে পারেন।{" "}
                <code className={code}>information_schema</code> নামে একটা বিশেষ
                জায়গা আছে, SQL এর Standard এর অংশ, তাই PostgreSQL আর MySQL দুটোতেই
                পাবেন। নিচের বক্সে Run চাপুন। Query টা কীভাবে লেখা হলো সেটা এখন
                বোঝার দরকার নেই, SELECT শিখবেন Module 03 এ। শুধু Output টা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="tours Table এর Schema"
              query={`SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tours'
ORDER BY ordinal_position;`}
              caption={
                <>
                  নয়টা Row আসবে, <code className="font-mono">tours</code> এর নয়টা Column এর জন্য একটা
                  করে। <code className="font-mono">data_type</code> বলছে কোন Column এ কোন ধরনের মান বসে, আর{" "}
                  <code className="font-mono">is_nullable</code> বলছে ঘরটা খালি রাখা যায় কিনা।{" "}
                  <code className="font-mono">tours</code> বদলে <code className="font-mono">bookings</code> লিখে আবার
                  চালান।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Output এ একটা জিনিস খেয়াল করে রাখুন। নয়টা Column এর আটটায়{" "}
                <code className={code}>is_nullable</code> হলো NO, শুধু{" "}
                <code className={code}>guide_id</code> এ YES। মানে প্রতিটা ট্যুরের
                নাম, দাম, সিট সংখ্যা অবশ্যই থাকতে হবে, কিন্তু Guide না থাকলেও চলে।
                কেন এমন, আর খালি ঘরটার নাম কী, সেটা NULL সেকশনে।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস। <code className={code}>price_bdt</code> এর ধরন দেখাচ্ছে
                numeric, আর <code className={code}>created_at</code> এর timestamp
                with time zone। টাকার জন্য কেন numeric, আর সময়ের জন্য কেন time
                zone সহ ধরন, সেই দুটো সিদ্ধান্তের পেছনে বড় গল্প আছে, Module 09 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "PostgreSQL এ Schema শব্দের দ্বিতীয় একটা মানে আছে",
          content: (
            <ContentParagraph>
              এই লেসনে Schema মানে কাঠামো। কিন্তু PostgreSQL এ Schema একটা জিনিসের
              নামও: একটা Database এর ভেতরে Table রাখার একটা ফোল্ডার, যার
              Default নাম <code className={code}>public</code>। একই শব্দ, দুই
              মানে। কোনো লেখায় CREATE SCHEMA বা public Schema পড়লে বুঝবেন সেটা
              ফোল্ডারের কথা। এই দ্বিতীয় মানেটা Module 02 এর Databases, Schemas and
              search_path লেসনে বিস্তারিত।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 05 */
    {
      id: "primary-key",
      subHeader: { index: "005", title: "Primary Key" },
      title: <SectionTitle>Primary Key: প্রতিটা Row এর পরিচয়পত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ধরুন Island Tours এ দুজন Customer আছেন, দুজনের নামই Rahim Uddin।
                বাংলাদেশে এটা খুবই সম্ভব। একজন ফোন করে বললেন, আমার ফোন নম্বরটা বদলে
                দিন। কোন Rahim Uddin এর Row বদলাবেন? নাম দিয়ে চিনলে ভুল জনের নম্বর
                বদলে যাবে। ফোন নম্বর দিয়ে চিনবেন? Database এ পাঁচজন Customer এর ফোন
                নম্বর নেই, আর যাঁর আছে তিনিও কাল নম্বর বদলাতে পারেন। Email? মানুষ
                Email ও বদলায়।
              </ContentParagraph>
              <ContentParagraph>
                দরকার এমন একটা মান, যেটা তিনটা কথা দেয়। এক, দুটো Row এর কখনো এক
                হবে না। দুই, কখনো খালি থাকবে না। তিন, একবার দেওয়া হলে আর বদলাবে না।
                বাস্তবে এর সবচেয়ে কাছের উদাহরণ জাতীয় পরিচয়পত্রের নম্বর, বা ক্লাসের
                রোল নম্বর। নাম এক হতে পারে, রোল কখনো এক হয় না।
              </ContentParagraph>
              <ContentParagraph>
                Table এর যে Column এই তিনটা কথা রাখে, তাকে বলে Primary Key।{" "}
                <code className={code}>customers</code> এর Primary Key হলো{" "}
                <code className={code}>customer_id</code>। Nusrat Jahan এর নম্বর 2,
                Rahim Uddin এর 1। আটটা Table এর প্রতিটায় একই ছাঁচে একটা Primary Key
                আছে: <code className={code}>tour_id</code>,{" "}
                <code className={code}>booking_id</code>,{" "}
                <code className={code}>payment_id</code>, এভাবে। ছবিতে রং করা প্রথম
                Column টা খেয়াল করুন।
              </ContentParagraph>
              <ContentParagraph>
                এই নম্বরগুলো কোনো মানুষ বানায় না। নতুন Customer যোগ হলে Database
                নিজেই পরের খালি নম্বরটা দিয়ে দেয়। আজ নতুন কেউ Account খুললে তিনি
                পাবেন 16, কারণ 15 পর্যন্ত নেওয়া হয়ে গেছে। একটু পরের Lab এ এটা নিজের
                চোখে দেখবেন। নম্বরটা কোনো তথ্য বহন করে না, Customer সম্পর্কে কিছুই
                বলে না, শুধু চেনায়। এমন Key কে বলে Surrogate Key। উল্টোদিকে, যে Key
                বাস্তব জগতের কোনো তথ্য থেকে আসে, যেমন Email, তাকে বলে Natural Key।
                কোনটা কখন বেছে নেবেন, সেই বিতর্ক Module 11 এর Keys in Depth লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                Primary Key এর আরেকটা কাজ আছে, যেটা চোখে পড়ে না কিন্তু রোজ লাগে:
                দ্রুত খোঁজা। লাখ লাখ Booking এর মধ্যেও booking_id 13 খুঁজে পেতে
                Database কে সবগুলো পড়তে হয় না, কারণ Primary Key এর সাথে নিজে থেকেই
                একটা সূচি তৈরি হয়, যেটার নাম Index। বইয়ের শেষের সূচির মতো। Index এর
                ভেতরের গল্প Module 13 এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Primary Key এর তিনটা কথা",
          content: (
            <ContentList>
              <ListItem>অনন্য: কোনো দুটো Row এর এক হবে না।</ListItem>
              <ListItem>কখনো খালি না: প্রতিটা Row এ থাকবেই।</ListItem>
              <ListItem>
                স্থির: একবার দেওয়া হলে বদলাবে না, কারণ অন্য Table গুলো এই নম্বর
                ধরে রাখবে। এই তৃতীয় কথাটা কেন এত জরুরি, পরের সেকশনেই বুঝবেন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              নিজে থেকে নম্বর দেওয়ার কাজটা MySQL এ লেখা হয় AUTO_INCREMENT দিয়ে, আর
              PostgreSQL এ GENERATED ALWAYS AS IDENTITY দিয়ে। আপনার ভিডিওতে প্রথমটা
              দেখবেন। লেখা আলাদা, ধারণা হুবহু এক: Database পরের নম্বরটা দেয়, আপনি
              দেন না। দুটোর পুরো তুলনা Lesson 05 এ, আর লেখার নিয়ম Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 06 */
    {
      id: "foreign-key",
      subHeader: { index: "006", title: "Foreign Key" },
      title: <SectionTitle>Foreign Key: আরেক খাতার নম্বর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার Booking 13 এর Row টা দেখুন। তাতে আছে{" "}
                <code className={code}>customer_id</code> 2 আর{" "}
                <code className={code}>departure_id</code> 8। Customer এর নাম নেই,
                ফোন নেই, শহর নেই। রওনার তারিখও নেই। আছে শুধু দুটো নম্বর।
              </ContentParagraph>
              <ContentParagraph>
                এই নম্বর দুটো এই Table এর নিজের কোনো তথ্য না। 2 হলো{" "}
                <code className={code}>customers</code> Table এর একটা Row এর Primary
                Key, আর 8 হলো <code className={code}>departures</code> Table এর একটা
                Row এর Primary Key। Booking এর Row শুধু বলছে, এই Booking টা ওই
                Customer এর, আর ওই তারিখের। আরেক Table এর Primary Key এর এমন একটা
                কপি, যেটা সেই Table এর একটা Row কে দেখায়, তাকে বলে Foreign Key।
                Foreign মানে বাইরের, কারণ Key টা আসলে আরেক Table এর।
              </ContentParagraph>
              <ContentParagraph>
                হাসপাতালের Prescription এর কথা ভাবুন। ডাক্তার প্রতিটা Prescription এ
                রোগীর পুরো ইতিহাস আবার লেখেন না। লেখেন রোগীর ID। পুরো ইতিহাস থাকে
                রোগীর নিজের ফাইলে, একবারই। দরকার হলে ID ধরে সেই ফাইল খোলা হয়।
                Booking এর <code className={code}>customer_id</code> ঠিক সেই রোগীর
                ID।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <ForeignKeyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এখন আসল প্রশ্ন। কেউ যদি ভুল করে এমন একটা Booking লিখে ফেলেন যার{" "}
                <code className={code}>customer_id</code> 99, অথচ 99 নম্বরের কোনো
                Customer নেই? Spreadsheet এ সেই লাইন চুপচাপ বসে থাকত, আর মাস শেষে
                কেউ খুঁজে বের করত না সেই টাকা কার। Relational Database এ এটা ঘটে না,
                যদি Column টাকে আনুষ্ঠানিকভাবে Foreign Key ঘোষণা করা থাকে। তখন
                Database প্রতিটা নতুন Booking এর সময় নিজে গিয়ে দেখে আসে, 99 নামে
                কোনো Customer আছে কিনা। না থাকলে Booking ঢুকতেই দেয় না।
              </ContentParagraph>
              <ContentParagraph>
                পাহারা চলে উল্টো দিক থেকেও। Nusrat Jahan এর দুটো Booking আছে। কেউ
                যদি তাঁকে <code className={code}>customers</code> থেকে মুছে ফেলতে
                চান, Database আটকে দেয়, কারণ মুছে ফেললে সেই দুটো Booking এমন এক
                Customer কে দেখাবে যিনি আর নেই। এই নিশ্চয়তার নাম Referential
                Integrity: যে নম্বর দেখানো হচ্ছে, সেই Row সবসময় সত্যিই থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম কিন্তু জরুরি কথা। কোনো Column এর নাম{" "}
                <code className={code}>customer_id</code> রাখলেই সেটা Foreign Key হয়ে
                যায় না। নামটা শুধু মানুষের সুবিধার জন্য। Foreign Key হয় Table বানানোর
                সময় একটা নিয়ম লিখে দিলে। Island Tours এর Database ফাইলে{" "}
                <code className={code}>bookings</code> এর এই লাইনটা আছে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "island-tours.sql (bookings Table এর একটা লাইন)",
          code: `customer_id  integer NOT NULL REFERENCES customers (customer_id),`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              REFERENCES customers (customer_id) মানে: এই Column এর প্রতিটা মান
              অবশ্যই <code className={code}>customers</code> Table এর{" "}
              <code className={code}>customer_id</code> এর কোনো একটা মান হতে হবে।
              এই এক টুকরো লেখাই উপরের সব পাহারার উৎস। এভাবে নিয়ম লেখা আপনি শিখবেন
              Module 09 এর Foreign Keys and ON DELETE লেসনে। আজ শুধু চিনে রাখুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              MySQL এ একটা Table কোন Storage Engine দিয়ে Data রাখবে, সেটা বেছে নেওয়া
              যায়। MySQL এর Documentation অনুযায়ী Foreign Key এর পাহারা দেয় InnoDB
              আর NDB Engine, MyISAM দেয় না। ভালো খবর হলো আজকের MySQL এ Default
              Engine InnoDB, তাই নতুন Table এ এটা নিয়ে ভাবতে হয় না। পুরনো কোনো
              Project এ MyISAM Table পেলে জানবেন, সেখানে এই পাহারা পাবেন না।
              PostgreSQL এ এমন কোনো বাছাই নেই, Foreign Key সবসময় পাহারা দেয়।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 07 */
    {
      id: "relationships",
      subHeader: { index: "007", title: "Relationships" },
      title: <SectionTitle>এক থেকে অনেক: Key কোন দিকে বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Nusrat Jahan এর দুটো Booking আছে, 2 আর 13। কিন্তু Booking 13 এর
                Customer একজনই, তিনি। এই অসম সম্পর্কটার নাম One-to-Many, এক থেকে
                অনেক। একদিকে এক, অন্যদিকে অনেক। Island Tours এর প্রায় সব সম্পর্ক এই
                ধরনের: একটা Tour অনেকবার রওনা দেয়, একটা Departure এ অনেক Booking
                হয়, একটা Booking এর জন্য কয়েকবার টাকা দেওয়ার চেষ্টা হতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <OneToManyDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার প্রশ্ন, Foreign Key কোন Table এ বসবে? Customer এর Row এ সব
                Booking এর নম্বর লিখে রাখা যেত না? ভাবুন, Rahim Uddin এর তিনটা
                Booking: 1, 8 আর 17। তাহলে তাঁর Row এর একটা ঘরে লিখতে হতো 1, 8, 17।
                কিন্তু আগের সেকশনের নিয়ম মনে আছে? এক ঘর, এক মান। তিনটা নম্বর এক ঘরে
                রাখা যায় না। আর রাখলেও, চতুর্থ Booking হলে Customer এর Row বদলাতে হতো,
                একটা Booking বাতিল হলে সেই লেখা থেকে একটা নম্বর কেটে দিতে হতো।
              </ContentParagraph>
              <ContentParagraph>
                উল্টোদিক থেকে দেখলে সব সহজ। প্রতিটা Booking এর Customer ঠিক একজন। তাই
                প্রতিটা Booking এর Row এ একটাই নম্বর বসে, তার Customer এর। তিনটা
                Booking মানে তিনটা Row, প্রত্যেকটায় 1। নতুন Booking মানে শুধু একটা নতুন
                Row, Customer এর Row ছোঁয়াই লাগে না। তাই নিয়মটা দাঁড়ায়: Foreign Key
                সবসময় বসে অনেক এর দিকের Table এ।
              </ContentParagraph>
              <ContentParagraph>
                One-to-Many ছাড়া আরও দুটো ধরন আছে, আর Island Tours এ দুটোরই দেখা
                মেলে বা মিলতে পারে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>One-to-One:</strong> একটা Booking এর সর্বোচ্চ একটা Review।{" "}
                  <code className={code}>reviews</code> এর{" "}
                  <code className={code}>booking_id</code> একটা Foreign Key, আর তার
                  উপর UNIQUE নিয়ম আছে, মানে একই Booking এর নম্বর দুটো Review তে বসতে
                  পারে না। এক থেকে অনেক, যেখানে অনেক কে আটকে একে নামানো হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Many-to-Many:</strong> এখন প্রতিটা Guide এর একটাই ভাষা লেখা
                  আছে। ধরুন ব্যবসা চাইল একজন Guide এর অনেক ভাষা রাখতে, আর একটা ভাষায়
                  অনেক Guide। দুই দিকেই অনেক। তখন কোনো Table এ একটা Foreign Key বসিয়ে
                  কাজ হয় না, কারণ দুই দিকেই এক ঘরে অনেক মান রাখতে হতো। সমাধান হলো
                  মাঝখানে তৃতীয় একটা Table, যার প্রতিটা Row এ একটা Guide আর একটা ভাষার
                  জোড়া। এই মাঝের Table এর নাম Junction Table, আর পুরো গল্পটা Module 11
                  এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "সম্পর্কের ধরন চেনার দুই প্রশ্নের কৌশল",
          content: (
            <ContentParagraph>
              দুটো Table নিয়ে দুই দিক থেকে দুটো প্রশ্ন করুন। একজন Customer এর কতগুলো
              Booking থাকতে পারে? অনেক। একটা Booking এর কতজন Customer? একজন। উত্তর
              অনেক আর এক, তাই One-to-Many, আর Key বসবে যে দিকের উত্তর এক, সেই
              Table এ, মানে <code className={code}>bookings</code> এ। দুই উত্তরই
              অনেক হলে Many-to-Many, মাঝে Junction Table। দুই উত্তরই এক হলে
              One-to-One।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 08 */
    {
      id: "follow-the-keys",
      subHeader: { index: "008", title: "Follow the Keys" },
      title: <SectionTitle>হাতে হাতে Key ধরে উত্তর জোড়া লাগানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এবার শুরুর সেই ফোন কলে ফিরে যাই। Booking 13 এর পুরো উত্তর জোড়া
                লাগাতে কী কী লাগল? পাঁচটা ধাপ, প্রতিটা ধাপে একটা নম্বর হাতে নিয়ে
                আরেকটা Table এ যাওয়া:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code className={code}>bookings</code> এ Primary Key 13 এর Row:
                  দুটো সিট, confirmed, হাতে এলো customer_id 2 আর departure_id 8।
                </ListItem>
                <ListItem>
                  customer_id 2 নিয়ে <code className={code}>customers</code> এ: Nusrat
                  Jahan।
                </ListItem>
                <ListItem>
                  departure_id 8 নিয়ে <code className={code}>departures</code> এ: রওনা
                  2026-11-20, হাতে এলো tour_id 1।
                </ListItem>
                <ListItem>
                  tour_id 1 নিয়ে <code className={code}>tours</code> এ: Saint Martin
                  Island Escape, হাতে এলো destination_id 1 আর guide_id 1।
                </ListItem>
                <ListItem>
                  destination_id 1 নিয়ে <code className={code}>destinations</code> এ
                  Saint Martin&apos;s Island, আর guide_id 1 নিয়ে{" "}
                  <code className={code}>guides</code> এ Jamal Hossain।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ এটা নিজে করুন। একটা Booking বেছে নিন, তারপর পরের Key ধরুন
                চাপতে থাকুন। প্রতিবার দেখবেন কোন নম্বর হাতে নিয়ে কোন Table এর কোন Row
                তে পৌঁছালেন। শেষে ছয়টা Table থেকে জোড়া লাগানো উত্তরটা দেখা যাবে।
                Booking 21 একবার অবশ্যই চালাবেন, সেখানে পথটা একটু আগেই থেমে যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FollowTheKeysLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                অফিসের কর্মী Screen এ নম্বর লিখে এক মুহূর্তে যে উত্তর পেলেন, তার
                পেছনে Database ঠিক এই হাঁটাটাই হেঁটেছে। তফাত দুটো। এক, আপনি পাঁচবার
                আলাদা আলাদা প্রশ্ন করেননি, একটা প্রশ্নেই বলে দিয়েছেন কোন Table এর
                কোন Column আরেক Table এর কোন Column এর সাথে মেলাতে হবে। এই মেলানোর
                নাম JOIN, আর পুরো Module 06 শুধু এটা নিয়েই। দুই, প্রতিটা ধাপ Database
                সূচি দেখে করে, পুরো Table পড়ে না, তাই লাখ Row এও উত্তর আসে চোখের
                পলকে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 09 */
    {
      id: "null",
      subHeader: { index: "009", title: "NULL" },
      title: <SectionTitle>NULL: ঘরটা খালি, মানে অজানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Lab এ Booking 21 চালালে দেখেছেন, পথটা <code className={code}>tours</code>{" "}
                এ গিয়ে আটকে গেল। Ratargul Swamp Boat Day ট্যুরের{" "}
                <code className={code}>guide_id</code> এর ঘরে কোনো নম্বর নেই। সেখানে
                আছে NULL।
              </ContentParagraph>
              <ContentParagraph>
                NULL মানে এই ঘরে কোনো মান নেই। কারণ হতে পারে অনেক: মানটা এখনো জানা
                নেই, এখনো ঠিক হয়নি, বা এই Row এর জন্য প্রযোজ্যই না। Ratargul এর Guide
                এখনো ঠিক হয়নি। পাঁচজন Customer ফোন নম্বর দেননি। দুটো Review তে কেউ
                মন্তব্য লেখেননি। সব জায়গায় ঘরটা NULL।
              </ContentParagraph>
              <ContentParagraph>
                NULL কে শূন্য ভাবলে বড় ভুল হবে। guide_id 0 হলে মানে হতো 0 নম্বর
                Guide, যিনি আসলে নেই। NULL ফাঁকা লেখাও না। ফোন নম্বরের ঘরে ফাঁকা লেখা
                মানে কেউ জেনেবুঝে খালি একটা লেখা রেখেছে, আর NULL মানে কোনো মানই নেই।
                শুনতে চুলচেরা লাগে, কিন্তু Query তে এই তফাত আলাদা আলাদা উত্তর দেয়।
              </ContentParagraph>
              <ContentParagraph>
                Foreign Key এ NULL রাখা যায়, যদি না Column এ NOT NULL নিয়ম থাকে। Schema
                সেকশনে দেখেছিলেন, <code className={code}>tours</code> এর একমাত্র{" "}
                <code className={code}>guide_id</code> তেই is_nullable YES। NULL কোনো
                Row কে দেখায় না, তাই Database এর পাহারা দেওয়ার কিছু থাকে না। অন্যদিকে{" "}
                <code className={code}>bookings</code> এর{" "}
                <code className={code}>customer_id</code> এ NOT NULL আছে, কারণ
                Customer ছাড়া Booking এর কোনো মানে নেই।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনের Query বক্সে NULL দেখা যায় বাঁকা অক্ষরে NULL লেখা হিসেবে।
                psql এ, যেটা Module 02 তে বসাবেন, NULL এর ঘর একদম ফাঁকা দেখায়। দুটো
                একই জিনিস, শুধু দেখানোর ধরন আলাদা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "NULL এর সাথে তুলনা করলে অদ্ভুত কিছু ঘটে",
          content: (
            <ContentParagraph>
              Guide নেই এমন ট্যুর খুঁজতে কেউ যদি লেখেন guide_id = NULL, উত্তরে একটাও
              Row আসে না, যদিও Ratargul এর guide_id সত্যিই NULL। সঠিক লেখা হলো
              guide_id IS NULL। কেন এমন হয়, তার পেছনে আছে NULL এর নিজস্ব যুক্তি,
              যেখানে সত্য আর মিথ্যার পাশাপাশি তৃতীয় একটা উত্তর আছে, অজানা। পুরো
              ব্যাখ্যা Module 03 এর NULL and Three-valued Logic লেসনে। এই লেসনের
              Lab এ দুটো লেখাই চালিয়ে তফাতটা নিজের চোখে দেখতে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 10 */
    {
      id: "the-rules",
      subHeader: { index: "010", title: "The Rules" },
      title: <SectionTitle>Database যখন না বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                এতক্ষণ আপনি কয়েকটা নিয়ম দেখেছেন। Primary Key অনন্য আর অপরিবর্তনীয়।
                Foreign Key অচেনা নম্বর ঢুকতে দেয় না। NOT NULL ঘর খালি রাখতে দেয় না।
                Email এর উপর UNIQUE একই Email দুবার ঢুকতে দেয় না। Table এর সাথে
                লাগানো এমন প্রতিটা নিয়মকে বলে Constraint। প্রতিবার কেউ Data লিখতে বা
                বদলাতে গেলে Database সবগুলো Constraint মিলিয়ে দেখে, একটা ভাঙলেই
                পুরো কাজটা ফিরিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ সাতটা চেষ্টা আছে। প্রতিটা Island Tours Database এর একটা
                নতুন কপিতে আসলেই চালানো হয়েছিল। পাঁচটা ফিরিয়ে দেওয়া হয়েছে, দুটো মেনে
                নেওয়া হয়েছে। প্রতিটা বোতাম চেপে দেখুন কোন নিয়মে আটকাল, আর PostgreSQL
                নিজের ভাষায় কী বলল। Error গুলো ইংরেজিতে, কিন্তু খেয়াল করলে দেখবেন
                প্রতিটা Error ঠিক বলে দেয় কোন Constraint ভাঙল আর কোন মানের জন্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <KeyRulesLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                প্রশ্ন আসতে পারে, এসব যাচাই তো Website এর Code এও করা যায়, Database কে
                দিয়ে কেন? কারণ Island Tours এর Database এ শুধু Website লেখে না। লেখে
                Admin Panel, Payment কোম্পানির কাছ থেকে আসা স্বয়ংক্রিয় বার্তা, অফিসের
                কর্মীর চালানো একটা Import Script, আর কখনো কখনো রাত দুটোয় একজন
                Developer নিজে, সরাসরি। প্রতিটা Program এ একই যাচাই ঠিকঠাক লেখা থাকবে,
                এই ভরসা কেউ দিতে পারে না। একটা Program এ একটা যাচাই বাদ পড়লেই খারাপ
                Data ঢুকে যায়। Database এর Constraint কে কেউ পাশ কাটিয়ে যেতে পারে না,
                কোন পথ দিয়ে লেখা হচ্ছে তাতে কিছু যায় আসে না।
              </ContentParagraph>
              <ContentParagraph>
                Constraint এর আরও ধরন আছে। Island Tours এ{" "}
                <code className={code}>seats</code> শূন্যের বেশি হতে হবে, আর{" "}
                <code className={code}>status</code> শুধু pending, confirmed বা
                cancelled হতে পারে। এগুলোকে বলে CHECK Constraint। সব ধরনের Constraint
                লেখা শিখবেন Module 09 এ।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 11 */
    {
      id: "why-split",
      subHeader: { index: "011", title: "Why Split" },
      title: <SectionTitle>কেন ভাঙা হলো, আর কীভাবে জোড়া লাগে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                Lesson 01 এ Island Tours এর শুরুর Spreadsheet মনে করুন। Booking এর
                Sheet এর প্রতিটা লাইনে Customer এর নাম, ট্যুরের নাম, দাম, সব আবার করে
                লেখা থাকত। নিচের বাঁদিকের ছবিতে তেমন চারটা লাইন। খেয়াল করুন একই ট্যুরের নাম আর দাম
                তিনবার লেখা, একই Customer এর নাম দুবার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <WideVsSplitDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                আলাদা Table এ ভাগ করলে কী কী পাওয়া যায়, তালিকা করে দেখি:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা তথ্য একবার।</strong> Saint Martin Island Escape এর
                  দাম আছে একটা মাত্র ঘরে। দাম বদলাতে একটা ঘর বদলালেই হয়, ভুলে কোনো
                  লাইন বাদ পড়ার সুযোগই নেই।
                </ListItem>
                <ListItem>
                  <strong>পরস্পরবিরোধী Data অসম্ভব।</strong> এক জায়গায় 12500 আর আরেক
                  জায়গায় 12000, এমন হতে পারে না, কারণ দ্বিতীয় জায়গাটাই নেই।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা জিনিসের নিজস্ব নিয়ম।</strong> Customer এর Email
                  UNIQUE, Tour এর দাম শূন্যের কম না, এসব নিয়ম যার যার Table এ।
                </ListItem>
                <ListItem>
                  <strong>জায়গা বাঁচে।</strong> একটা ছোট নম্বর বারবার লেখা হয়, লম্বা
                  নাম আর ঠিকানা না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দাম কী দিতে হলো? একটাই: উত্তর এখন এক জায়গায় নেই, জোড়া লাগাতে হয়।
                Booking 13 এর পাশে Customer এর নাম আর ট্যুরের নাম একসাথে দেখতে চাইলে
                চারটা Table মেলাতে হয়। নিচের বক্সে ঠিক সেটা করা একটা Query আছে। এটা
                JOIN দিয়ে লেখা, যা আপনি Module 06 এ শিখবেন। এখন শুধু Run চাপুন, আর
                দেখুন চারটা Table থেকে আসা মান কীভাবে এক লাইনে বসে গেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চারটা Table, এক লাইনের উত্তর"
              query={`SELECT b.booking_id, c.full_name, t.title, d.starts_on, b.seats, b.status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN departures d ON d.departure_id = b.departure_id
JOIN tours t ON t.tour_id = d.tour_id
WHERE b.booking_id = 13;`}
              caption={
                <>
                  প্রতিটা ON এর লাইন একটা Foreign Key কে তার Primary Key এর সাথে মেলাচ্ছে, ঠিক Lab এর মতো।
                  শেষ লাইনের 13 বদলে 17 বা 21 লিখে চালান।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "bookings এ total_bdt কেন রাখা, সেটা তো কপি",
          content: (
            <ContentParagraph>
              ভালো প্রশ্ন। <code className={code}>bookings</code> এর{" "}
              <code className={code}>total_bdt</code> আসলে সিট গুণ ট্যুরের দাম, যা{" "}
              <code className={code}>tours</code> থেকেও হিসাব করা যেত। তবু এটা রাখা হয়েছে
              জেনেবুঝে। ট্যুরের দাম আগামী মাসে বাড়তে পারে, কিন্তু Nusrat Jahan যে দামে
              বুক করেছেন, তাঁর Booking এর মোট টাকা বদলানো উচিত না। এটা কপি না, এটা
              ইতিহাস: বুক করার মুহূর্তে কত টাকা ঠিক হয়েছিল। জেনেবুঝে Data কোথাও আবার
              রাখার এই কৌশলের নাম Denormalization, কখন ঠিক আর কখন বিপদ, Module 11 এ।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 12 */
    {
      id: "see-it",
      subHeader: { index: "012", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দুটো বক্স, দুটো কাজ। প্রথমটায় আপনি নিজে Key ধরে হাঁটবেন, Lab এর মতো,
                কিন্তু এবার আসল Database এ। বক্সে চারটা ছোট প্রশ্ন একসাথে লেখা, প্রতিটা
                একটা Table থেকে একটা Row আনে। Run চাপলে চারটা আলাদা ফলাফল নিচে নিচে
                আসবে। প্রতিটা ফলাফল থেকে কোন নম্বর পরের প্রশ্নে গেছে, সেটা মিলিয়ে
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Booking 17 এর পথ, হাতে হাতে"
              query={`SELECT * FROM bookings   WHERE booking_id   = 17;
SELECT * FROM customers  WHERE customer_id  = 1;
SELECT * FROM departures WHERE departure_id = 11;
SELECT * FROM tours      WHERE tour_id      = 3;`}
              caption={
                <>
                  প্রথম ফলাফলে customer_id 1 আর departure_id 11, তাই পরের দুটো প্রশ্নে 1 আর 11। তৃতীয়
                  ফলাফলে tour_id 3, তাই শেষ প্রশ্নে 3। এবার নিজে আরও দুটো লাইন যোগ করুন, tours এর
                  ফলাফল থেকে destination_id আর guide_id নিয়ে destinations আর guides এ।
                </>
              }
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                দ্বিতীয় বক্সে Database কে দিয়ে না বলাবেন। Statement টা এমন একটা
                Booking ঢোকানোর চেষ্টা করছে যার Customer নেই। Run চাপুন আর Error টা
                পড়ুন। তারপর 99 বদলে 1 লিখে আবার চালান। এবার Database মেনে নেবে, আর
                নিচে INSERT 1 লেখা আসবে। কাজ শেষে Reset চাপলে Database আবার শুরুর
                অবস্থায় ফিরে যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="Foreign Key এর পাহারা"
              query={`INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (99, 8, 1, 'pending', 12500.00);`}
              caption={
                <>
                  Error এর DETAIL লাইনটা খেয়াল করুন: Key (customer_id)=(99) is not present in table
                  customers। Database শুধু না বলে না, কেন না বলছে সেটাও বলে।
                </>
              }
            />
          ),
        },
      ],
    },

    /* --------------------------------------------------------------- 13 */
    {
      id: "vocabulary",
      subHeader: { index: "013", title: "Words You Will Hear" },
      title: <SectionTitle>একই জিনিসের তিন রকম নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বই, ভিডিও, Documentation আর সহকর্মীরা একই জিনিসকে আলাদা আলাদা নামে
              ডাকেন। গণিতের দিক থেকে আসা লেখায় পাবেন Relation আর Tuple, রোজকার কাজে
              Table আর Row, আর Spreadsheet থেকে আসা মানুষ বলবেন Sheet আর লাইন। নিচের
              ছকটা হাতের কাছে রাখুন, তাহলে যেকোনো উৎস পড়ার সময় অনুবাদ নিয়ে আটকাবেন
              না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Relational Model এ", "রোজকার Database এ", "Spreadsheet এ কাছাকাছি", "মানে"],
          rows: [
            ["Relation", "Table", "একটা Sheet", "একই ধরনের জিনিসের খাতা"],
            ["Tuple", "Row, Record", "একটা লাইন", "একটা জিনিস"],
            ["Attribute", "Column, Field", "Column এর মাথা", "সবার একই একটা বৈশিষ্ট্য"],
            ["Domain", "Data Type", "Cell Format", "কোন ধরনের মান বসতে পারে"],
            ["Primary Key", "Primary Key, PK", "সাধারণত নেই", "প্রতিটা Row এর অনন্য পরিচয়"],
            ["Foreign Key", "Foreign Key, FK", "VLOOKUP দিয়ে আরেক Sheet এ খোঁজা", "আরেক Table এর Row কে দেখানো নম্বর"],
            ["Relation Schema", "Schema", "Column এর শিরোনামগুলো", "কাঠামো: কী কী Table, Column আর নিয়ম"],
            ["Integrity Constraint", "Constraint", "Data Validation, যা সহজেই পাশ কাটানো যায়", "Database এর পাহারা দেওয়া নিয়ম"],
            ["RDBMS", "Relational Database", "নেই", "এই মডেলে চলা DBMS, যেমন PostgreSQL, MySQL"],
          ],
        },
      ],
    },

    /* --------------------------------------------------------------- 14 */
    {
      id: "project-example",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর আটটা Table, পুরো মানচিত্র</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseBrief />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসনে একটা একটা করে যা দেখলেন, নিচের ছবিতে সব একসাথে। প্রতিটা বাক্সে
              একটা Table, PK লেখা ঘরটা তার Primary Key, FK লেখা ঘরগুলো Foreign Key। আর
              প্রতিটা দাগ একটা Foreign Key থেকে তার Primary Key পর্যন্ত, N লেখা দিকটা
              অনেক, 1 লেখা দিকটা এক। মোট সাতটা দাগ, সাতটা Foreign Key।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseDiagram />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-4">
              <ContentParagraph>
                ছবিটা দেখে এখন আপনি কয়েকটা জিনিস পড়তে পারবেন, যা লেসনের শুরুতে পারতেন না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সব পথ bookings এ এসে মেলে।</strong> Customer আর Departure
                  এর মাঝখানে বসে আছে Booking, আর Payment আর Review দুটোই Booking কে
                  দেখায়। ব্যবসার হৃদপিণ্ড এই Table, আর এজন্যই Island Tours এর প্রায় সব
                  Report এর শুরু bookings থেকে।
                </ListItem>
                <ListItem>
                  <strong>tours থেকে দুটো দাগ বের হয়েছে।</strong> একটা Destination
                  এর দিকে, একটা Guide এর দিকে। তাই একটা ট্যুরের জায়গা আর Guide দুটোই
                  আলাদা খাতায়, নাম একবারই লেখা।
                </ListItem>
                <ListItem>
                  <strong>reviews থেকে bookings এ দাগটা আলাদা।</strong> সেখানে FK এর
                  সাথে UNIQUE লেখা, মানে One-to-One।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার চলুন দেখি একটা আসল ট্যুর বুকিং App এই Key গুলো কোথায় কোথায় কাজে
                লাগায়। সাধারণত যেভাবে এমন App বানানো হয়, Island Tours ও সেভাবেই ভাবা:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা Booking এর Page:</strong> এমন Page এর ঠিকানার শেষে সাধারণত
                  Booking এর Primary Key থাকে, যেমন একটা ঠিকানা যার শেষে 13। App সেই
                  নম্বর দিয়ে Database কে জিজ্ঞেস করে, আর Primary Key এর সূচি থেকে এক
                  লাফে Row টা পায়।
                </ListItem>
                <ListItem>
                  <strong>আমার Booking গুলো:</strong> লগইন করা Customer এর নম্বর ধরে
                  bookings এর সেইসব Row, যাদের customer_id সেই নম্বর। এখানে
                  One-to-Many সরাসরি একটা Page হয়ে গেছে।
                </ListItem>
                <ListItem>
                  <strong>ট্যুর বন্ধ করা:</strong> Admin Panel এ কেউ একটা ট্যুর বিক্রি
                  বন্ধ করতে চাইলে Row টা মুছে ফেলা যায় না, কারণ পুরনো Departure আর
                  Booking গুলো তাকে দেখাচ্ছে, Foreign Key মুছতে দেবে না। তাই{" "}
                  <code className={code}>is_active</code> false করে দেওয়া হয়। Saint
                  Martin Luxury Stay এখন ঠিক এই অবস্থায়।
                </ListItem>
                <ListItem>
                  <strong>টাকা ফেরত:</strong> Refund হলে Payment এর Row মোছা হয় না,
                  তার status বদলায়। Booking থেকে Payment পর্যন্ত Key এর শিকল অটুট থাকে,
                  তাই ছয় মাস পরেও হিসাব মেলানো যায় কোন টাকা কোন Booking এর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের my-tours এ আপাতত কোনো Code লেখার দরকার নেই। কিন্তু এখন থেকে
                যেকোনো App ব্যবহার করার সময় একটা খেলা খেলুন: ঠিকানার শেষের নম্বরটা খেয়াল
                করুন, আর ভাবুন পেছনে কোন Table এর কোন Primary Key। Module 11 এ আপনি
                শূন্য থেকে নিজের Database ডিজাইন করবেন, তখন এই অভ্যাসটা কাজে দেবে।
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
      title: <SectionTitle>একটা নতুন Booking, প্রতিটা Key এর পাহারার মধ্যে দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন নতুন মানুষ, Tanjila Nur, Island Tours এ Account খুলে ২০ নভেম্বরের
              Saint Martin ট্যুরে একটা সিট বুক করলেন। পেছনে Database এ কোন কোন Row
              তৈরি হলো, আর প্রতিটা ধাপে কোন নিয়ম মিলিয়ে দেখা হলো, ধাপে ধাপে। প্রতিটা
              নম্বর এই Database এ আসলেই যা পাওয়া যায়, তাই।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Account খোলা",
              description:
                "customers Table এ একটা নতুন Row ঢোকে: নাম Tanjila Nur, Email tanjila.nur@mail.example, শহর Dhaka। Database মিলিয়ে দেখে Email খালি না (NOT NULL), আর আগে কেউ এই Email নেয়নি (UNIQUE)। তারপর নিজে থেকে customer_id দেয় 16, আর দেশ না বলায় Default Bangladesh বসায়।",
            },
            {
              title: "ট্যুর আর তারিখ বাছাই",
              description:
                "Website tours থেকে শুধু চালু ট্যুরগুলো দেখায়, যাদের is_active সত্য। Tanjila Saint Martin Island Escape বাছলেন, যার tour_id 1। তারপর departures থেকে tour_id 1 এর তারিখগুলো আসে, চারটা, আর তিনি বাছলেন departure_id 8, রওনা 2026-11-20, যেখানে সিট খালি আছে ১৪টা।",
            },
            {
              title: "Booking এর Row",
              description:
                "bookings এ নতুন Row: customer_id 16, departure_id 8, সিট ১টা, status pending, মোট 12500.00। Database দুটো Foreign Key মিলিয়ে দেখে, customers এ 16 আছে কি, departures এ 8 আছে কি। দুটোই আছে। CHECK নিয়ম দেখে সিট শূন্যের বেশি আর status তিনটা অনুমোদিত মানের একটা। সব ঠিক, তাই booking_id দেয় 25।",
            },
            {
              title: "সিটের হিসাব",
              description:
                "departure 8 এর seats_left কমাতে হবে ১৪ থেকে ১৩ তে। Booking ঢোকানো আর সিট কমানো দুটো আলাদা কাজ, যার একটা হয়ে অন্যটা আটকে গেলে হিসাব ভুল হবে। দুটো একসাথে নিরাপদে করার উপায়, Transaction, শিখবেন Module 12 এ।",
            },
            {
              title: "টাকা দেওয়া",
              description:
                "Tanjila bKash এ টাকা দিলেন। payments এ নতুন Row, যার booking_id 25। আবার Foreign Key এর পাহারা: bookings এ 25 আছে কি? আছে। এরপর Booking এর status বদলে confirmed হয়। কোন Row বদলাবে, Database সেটা খুঁজে নেয় Primary Key 25 দিয়ে।",
            },
            {
              title: "পরে কেউ প্রশ্ন করলে",
              description:
                "এক সপ্তাহ পর Tanjila ফোন করে Booking 25 এর খবর জানতে চাইলেন। অফিসের কর্মী নম্বরটা লিখলেন, আর Database Key ধরে ধরে হাঁটল: bookings থেকে customers, departures, tours, destinations আর guides। Follow the Keys সেকশনের ঠিক সেই পথ।",
            },
            {
              title: "কেউ Account মুছতে চাইলে",
              description:
                "Tanjila এর Booking আর Payment যতক্ষণ আছে, customers থেকে তাঁর Row মোছা যাবে না। Foreign Key ফিরিয়ে দেবে। মুছে ফেলার আগে কী হবে, Booking গুলোও মুছবে নাকি আটকাবে, সেটা Table বানানোর সময়ই ঠিক করে রাখা যায়, Module 09 এ।",
            },
          ],
        },
      ],
    },

    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Relational মানে Relationship ভাবা।</strong> Relation মানে Table।
                Interview তে এই প্রশ্নটা মাঝে মাঝে ফাঁদ হিসেবে আসে।
              </ListItem>
              <ListItem>
                <strong>ধরে নেওয়া Row গুলো একটা ক্রমে আসবে।</strong> নিজের মেশিনে দশটা
                Row প্রতিবার একই ক্রমে আসছে দেখে অনেকে ভাবেন সেটাই নিয়ম। Data বাড়লে বা
                Database অন্য পথ বেছে নিলে ক্রম বদলে যায়। ক্রম চাইলে সবসময় ORDER BY।
              </ListItem>
              <ListItem>
                <strong>এক ঘরে অনেক মান রাখা।</strong> tour_ids এর ঘরে 1,4,7 লেখা।
                শুনতে সহজ, কিন্তু Foreign Key এর পাহারা পাবেন না, খোঁজা কঠিন হবে, আর
                একটা মান বদলাতে পুরো লেখা ভাঙতে হবে। সমাধান আলাদা Row, আর দরকারে
                Junction Table।
              </ListItem>
              <ListItem>
                <strong>নাম বা ফোন নম্বরকে Primary Key বানানো।</strong> নাম মেলে, নম্বর
                বদলায়, কখনো থাকেই না। Primary Key হবে এমন কিছু যা কখনো বদলাবে না।
              </ListItem>
              <ListItem>
                <strong>Column এর নাম customer_id রাখলেই Foreign Key হয়ে গেল ভাবা।</strong>{" "}
                REFERENCES এর নিয়ম না লিখলে Database কোনো পাহারা দেয় না, ভুতুড়ে নম্বর
                নির্বিঘ্নে ঢুকে যায়।
              </ListItem>
              <ListItem>
                <strong>Primary Key এর মান বদলানো।</strong> অন্য Table গুলো সেই নম্বর ধরে
                আছে। বদলালে হয় Database আটকাবে, নয়তো সবার হাতের ঠিকানা ভুল হবে। একবার
                দেওয়া পরিচয় চিরকালের।
              </ListItem>
              <ListItem>
                <strong>NULL কে শূন্য বা ফাঁকা লেখা ভাবা।</strong> NULL মানে মান নেই।
                guide_id = NULL দিয়ে খুঁজলে কিছুই পাবেন না, লিখতে হয় IS NULL।
              </ListItem>
              <ListItem>
                <strong>সব যাচাই শুধু App এর Code এ রাখা।</strong> Database এ লেখার পথ
                অনেক। যে নিয়ম কখনো ভাঙা চলবে না, সেটা Constraint হিসেবে Database এই
                থাকবে।
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
      title: <SectionTitle>আরও পড়তে বা দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে চালান।</strong> এই লেসনের Query বক্স আর নিচের Lab এর পরীক্ষাগুলো
                সবচেয়ে ভালো Resource। একটা Foreign Key নিজের হাতে ফিরিয়ে দিতে দেখলে
                ধারণাটা আর ভোলা যায় না।
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Tutorial, Concepts:</strong> PostgreSQL এর নিজের
                Documentation এর শুরুর পাতা, Table, Row আর Column কী, অল্প কথায়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/tutorial-concepts.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  postgresql.org/docs/current/tutorial-concepts.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL Constraints:</strong> Primary Key, Foreign Key, UNIQUE,
                NOT NULL আর CHECK, সবগুলোর সরকারি বর্ণনা উদাহরণ সহ। এখন পুরোটা পড়ার
                দরকার নেই, Primary Keys আর Foreign Keys অংশ দুটো দেখে নিন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/ddl-constraints.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  postgresql.org/docs/current/ddl-constraints.html
                </a>
              </ListItem>
              <ListItem>
                <strong>PostgreSQL information_schema.columns:</strong> Schema সেকশনের
                Query টা যেখান থেকে Column এর তথ্য আনল, তার প্রতিটা Column এর মানে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/infoschema-columns.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  postgresql.org/docs/current/infoschema-columns.html
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL Foreign Key Constraints:</strong> MySQL এ Foreign Key কীভাবে
                লেখা হয়, কোন Engine এ কাজ করে, আর মুছলে কী হয়।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Relational Model, Wikipedia:</strong> মডেলের ইতিহাস আর গাণিতিক
                ভিত্তি, Relation, Tuple আর Attribute শব্দগুলো কোথা থেকে এলো।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Relational_model"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  en.wikipedia.org/wiki/Relational_model
                </a>
                , আর মানুষটার গল্প{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Edgar_F._Codd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  en.wikipedia.org/wiki/Edgar_F._Codd
                </a>
              </ListItem>
              <ListItem>
                <strong>আপনি যে ভিডিওটা দেখছেন:</strong> একটা MySQL কোর্স। Table তৈরি আর
                Primary ও Foreign Key এর অংশে যা দেখবেন, এই লেসনের ধারণার সাথে হুবহু মিলবে।
                শুধু লেখার কয়েকটা জায়গা MySQL এর মতো, যেমন AUTO_INCREMENT।{" "}
                <a
                  href="https://www.youtube.com/watch?v=hlGoQC332VM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
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
                  ১৯৭০ সালে Edgar F. Codd প্রস্তাব করলেন, সব Data থাকবে সরল Table এ, আর
                  Table গুলোর যোগ থাকবে মান দিয়ে। এর নাম Relational Model, আর এতে চলা
                  DBMS হলো RDBMS।
                </ListItem>
                <ListItem>
                  Relation মানে Table, সম্পর্ক না। PostgreSQL এর Error এও Table কে
                  relation বলা হয়।
                </ListItem>
                <ListItem>
                  একটা Table, একটা ধরনের জিনিস। Row মানে একটা জিনিস, Column মানে সবার
                  একটা বৈশিষ্ট্য, আর ঘরে থাকে ঠিক একটা মান।
                </ListItem>
                <ListItem>
                  Row এর কোনো নিজস্ব ক্রম নেই। ক্রম চাইলে ORDER BY।
                </ListItem>
                <ListItem>
                  Schema হলো কাঠামো, Data হলো Row। Database নিজের Schema নিজেই রাখে,
                  information_schema তে।
                </ListItem>
                <ListItem>
                  Primary Key প্রতিটা Row এর পরিচয়: অনন্য, কখনো খালি না, কখনো বদলায় না।
                  Island Tours এ নম্বরগুলো Database নিজেই দেয়।
                </ListItem>
                <ListItem>
                  Foreign Key হলো আরেক Table এর Primary Key এর কপি, যা সেই Table এর একটা
                  Row কে দেখায়। REFERENCES লেখা থাকলে Database পাহারা দেয়, এর নাম
                  Referential Integrity।
                </ListItem>
                <ListItem>
                  One-to-Many তে Foreign Key বসে অনেক এর দিকের Table এ। One-to-One মানে
                  Foreign Key এর সাথে UNIQUE, Many-to-Many মানে মাঝে Junction Table।
                </ListItem>
                <ListItem>
                  NULL মানে মান নেই, শূন্যও না, ফাঁকা লেখাও না। NULL খুঁজতে IS NULL।
                </ListItem>
                <ListItem>
                  Constraint হলো Table এর সাথে লাগানো নিয়ম। যে পথ দিয়েই লেখা হোক, Database
                  প্রতিবার মিলিয়ে দেখে, ভাঙলে ফিরিয়ে দেয়।
                </ListItem>
                <ListItem>
                  Data ভেঙে রাখার লাভ, প্রতিটা তথ্য একবার, পরস্পরবিরোধী Data অসম্ভব। দাম
                  হলো উত্তর জোড়া লাগাতে হয়, JOIN দিয়ে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে বারবার একটা কথা বলেছি: আপনি শুধু বলবেন কী চান, কীভাবে আনতে হবে
                Database ঠিক করবে। কিন্তু বলবেন কোন ভাষায়? এই লেসনের Query বক্সগুলোতে যে
                লেখা ছিল, SELECT, FROM, WHERE, JOIN, INSERT, সেটাই সেই ভাষা, SQL। পরের
                লেসনে দেখবেন SQL আসলে কী, MySQL আর PostgreSQL এর সাথে তার সম্পর্ক কী,
                আর SQL এর Command গুলো কোন পাঁচটা পরিবারে ভাগ করা।
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
      ["Relational Model", "সব Data সরল Table এ, Table গুলোর যোগ মান দিয়ে", "আটটা Table, সাতটা Foreign Key"],
      ["Relation, Table", "একই ধরনের জিনিসের খাতা", "customers, tours, bookings"],
      ["Row, Record, Tuple", "একটা জিনিস", "Nusrat Jahan এর Row"],
      ["Column, Field, Attribute", "সবার একটা বৈশিষ্ট্য, এক ধরনের মান", "city, price_bdt"],
      ["Schema", "কাঠামো: Table, Column, Type আর নিয়ম", "information_schema.columns"],
      ["Primary Key", "অনন্য, কখনো খালি না, কখনো বদলায় না", "customer_id, booking_id"],
      ["Foreign Key", "আরেক Table এর Primary Key এর কপি", "bookings.customer_id দেখায় customers কে"],
      ["Referential Integrity", "দেখানো Row সবসময় সত্যিই থাকবে", "customer_id 99 এর Booking ফিরিয়ে দেওয়া"],
      ["One-to-Many", "Foreign Key বসে অনেক এর দিকে", "একজন Customer, অনেক Booking"],
      ["One-to-One", "Foreign Key এর সাথে UNIQUE", "একটা Booking, সর্বোচ্চ একটা Review"],
      ["NULL", "মান নেই, খুঁজতে IS NULL", "Ratargul এর guide_id"],
      ["Constraint", "Table এর সাথে লাগানো নিয়ম, Database পাহারা দেয়", "UNIQUE email, NOT NULL email"],
      ["RDBMS", "Relational Model এ চলা DBMS", "PostgreSQL, MySQL"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Relational Database এর নামে Relational শব্দটা কোথা থেকে এসেছে?",
        options: [
          {
            key: "A",
            text: "Table গুলোর মধ্যে সম্পর্ক বা Relationship থাকে বলে",
            isCorrect: false,
            explanation:
              "সবচেয়ে প্রচলিত ভুল ধারণা। সম্পর্ক থাকে ঠিকই, কিন্তু নামটা সেখান থেকে আসেনি।",
          },
          {
            key: "B",
            text: "Relation হলো Table এর গাণিতিক নাম, Codd গণিত থেকে নিয়েছিলেন",
            isCorrect: true,
            explanation:
              "ঠিক। গণিতে Relation মানে একই আকারের সারির সেট, Codd এর মডেলে সেটাই Table। PostgreSQL এর Error এও Table কে relation বলা হয়।",
          },
          {
            key: "C",
            text: "Database টা অন্য Database এর সাথে Relation রাখতে পারে বলে",
            isCorrect: false,
            explanation: "নামটার সাথে একাধিক Database এর সম্পর্কের কোনো যোগ নেই।",
          },
          {
            key: "D",
            text: "IBM এর একটা Product এর নাম থেকে",
            isCorrect: false,
            explanation:
              "Codd IBM এ কাজ করতেন, কিন্তু Relation শব্দটা এসেছে গণিত থেকে, কোনো Product থেকে না।",
          },
        ],
      },
      {
        id: 2,
        text: "customers Table এর একটা Row কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "সব Customer এর একটা বৈশিষ্ট্য, যেমন সবার শহর",
            isCorrect: false,
            explanation: "সেটা Column। Column নিচে নামে, সবার একটা বৈশিষ্ট্য।",
          },
          {
            key: "B",
            text: "একজন Customer, তাঁর সব বৈশিষ্ট্য সহ",
            isCorrect: true,
            explanation:
              "ঠিক। একটা Row মানে একটা জিনিস। customers এর একটা Row মানে একজন Customer।",
          },
          {
            key: "C",
            text: "একজন Customer এর একটা মান, যেমন শুধু তাঁর ফোন নম্বর",
            isCorrect: false,
            explanation: "একটা মান থাকে একটা ঘরে, Row আর Column এর কাটাকুটিতে।",
          },
          {
            key: "D",
            text: "Table এর কাঠামো",
            isCorrect: false,
            explanation: "কাঠামোর নাম Schema। Row হলো Data, কাঠামো না।",
          },
        ],
      },
      {
        id: 3,
        text: "customers Table এর Primary Key হিসেবে কোনটা সবচেয়ে ভালো?",
        options: [
          {
            key: "A",
            text: "full_name",
            isCorrect: false,
            explanation: "দুজনের নাম এক হতেই পারে, আর বিয়ের পর বা ভুল সংশোধনে নাম বদলায়ও।",
          },
          {
            key: "B",
            text: "phone",
            isCorrect: false,
            explanation:
              "Island Tours এ পাঁচজনের ফোন নম্বরই নেই, মানে NULL। আর মানুষ নম্বর বদলায়। Primary Key কখনো খালি থাকতে পারে না, বদলাতেও পারে না।",
          },
          {
            key: "C",
            text: "Database এর নিজে দেওয়া customer_id নম্বর",
            isCorrect: true,
            explanation:
              "ঠিক। অনন্য, কখনো খালি না, আর কোনো বাস্তব তথ্য বহন করে না বলে বদলানোর কারণও নেই।",
          },
          {
            key: "D",
            text: "city",
            isCorrect: false,
            explanation: "একই শহরে অনেকে থাকেন, এটা অনন্য হওয়ার ধারেকাছেও নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "Booking 13 এর Row এ customer_id এর মান 2। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "এই Customer এর দুটো Booking আছে",
            isCorrect: false,
            explanation:
              "কাকতালীয়ভাবে Nusrat Jahan এর সত্যিই দুটো Booking, কিন্তু 2 সংখ্যাটা গোনা না, একটা পরিচয়।",
          },
          {
            key: "B",
            text: "এই Booking টা সেই Customer এর, customers Table এ যাঁর Primary Key 2",
            isCorrect: true,
            explanation:
              "ঠিক। customer_id একটা Foreign Key, customers এর Row 2 কে দেখায়, যিনি Nusrat Jahan।",
          },
          {
            key: "C",
            text: "এটা bookings Table এর দ্বিতীয় Row",
            isCorrect: false,
            explanation:
              "Row এর কোনো নিজস্ব ক্রম নেই, আর Booking এর নিজের পরিচয় booking_id, যা এখানে 13।",
          },
          {
            key: "D",
            text: "Customer দুটো সিট নিয়েছেন",
            isCorrect: false,
            explanation: "সিটের সংখ্যা থাকে seats Column এ, customer_id এ না।",
          },
        ],
      },
      {
        id: 5,
        text: "কেউ এমন একটা Booking ঢোকাতে চাইলেন যার customer_id 99, অথচ 99 নম্বরের কোনো Customer নেই। Island Tours এর Database কী করবে?",
        options: [
          {
            key: "A",
            text: "Booking টা ঢুকিয়ে নেবে, পরে কেউ Customer যোগ করলে মিলে যাবে",
            isCorrect: false,
            explanation:
              "Spreadsheet এ এমনই হতো। এখানে customer_id আনুষ্ঠানিক Foreign Key, তাই Database ঢুকতে দেয় না।",
          },
          {
            key: "B",
            text: "নিজে থেকে 99 নম্বরের একজন খালি Customer বানিয়ে নেবে",
            isCorrect: false,
            explanation: "Database কখনো নিজে থেকে কোনো Row বানিয়ে ভুল ঢাকে না।",
          },
          {
            key: "C",
            text: "Foreign Key ভাঙছে বলে Booking টা ফিরিয়ে দেবে, Error এ জানাবে 99 customers এ নেই",
            isCorrect: true,
            explanation:
              "ঠিক। Error আসে violates foreign key constraint, আর DETAIL এ Key (customer_id)=(99) is not present in table customers।",
          },
          {
            key: "D",
            text: "customer_id এর ঘরে NULL বসিয়ে বাকিটা ঢুকিয়ে নেবে",
            isCorrect: false,
            explanation:
              "Database আপনার দেওয়া মান চুপচাপ বদলায় না। তাছাড়া bookings এর customer_id এ NOT NULL আছে।",
          },
        ],
      },
      {
        id: 6,
        text: "tours আর departures এর মধ্যে সম্পর্ক One-to-Many। Foreign Key কোথায় বসবে?",
        options: [
          {
            key: "A",
            text: "departures এ, tour_id নামে",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা Departure এর Tour একটাই, তাই প্রতিটা Departure এর Row এ একটা tour_id। Key বসে অনেক এর দিকে।",
          },
          {
            key: "B",
            text: "tours এ, departure_ids নামে, সব তারিখের নম্বর কমা দিয়ে লিখে",
            isCorrect: false,
            explanation:
              "এক ঘরে অনেক মান রাখা যায় না, আর এমন লেখায় Foreign Key এর পাহারাও পাওয়া যায় না।",
          },
          {
            key: "C",
            text: "দুই Table এই",
            isCorrect: false,
            explanation:
              "One-to-Many তে একটাই Foreign Key লাগে, অনেক এর দিকে। দুই দিকে রাখলে একই তথ্য দুই জায়গায়, আর তারা একদিন অমিল হবে।",
          },
          {
            key: "D",
            text: "তৃতীয় একটা Junction Table এ",
            isCorrect: false,
            explanation: "Junction Table লাগে Many-to-Many তে, যেখানে দুই দিকেই অনেক।",
          },
        ],
      },
      {
        id: 7,
        text: "Ratargul Swamp Boat Day ট্যুরের guide_id এর ঘরে NULL। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "এই ট্যুরের Guide এর নম্বর শূন্য",
            isCorrect: false,
            explanation: "শূন্য একটা মান, যার মানে হতো 0 নম্বর Guide। NULL মানে কোনো মানই নেই।",
          },
          {
            key: "B",
            text: "Guide এখনো ঠিক হয়নি, ঘরে কোনো মান নেই",
            isCorrect: true,
            explanation:
              "ঠিক। guide_id এ NOT NULL নেই, তাই Guide ছাড়াও ট্যুর রাখা যায়। NULL কোনো Row কে দেখায় না।",
          },
          {
            key: "C",
            text: "Database এ কোনো ভুল হয়েছে, এটা Foreign Key ভাঙছে",
            isCorrect: false,
            explanation:
              "NULL Foreign Key ভাঙে না, কারণ সে কোনো Row কে দেখানোর দাবিই করে না।",
          },
          {
            key: "D",
            text: "guide_id = NULL লিখে খুঁজলে এই ট্যুরটা পাওয়া যাবে",
            isCorrect: false,
            explanation:
              "এটাই NULL এর বিখ্যাত ফাঁদ। = NULL দিয়ে কিছুই আসে না, লিখতে হয় IS NULL। কারণ Module 03 এ।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours ট্যুরের দাম শুধু tours Table এ রাখে, প্রতিটা Booking এর পাশে আবার লেখে না। এর প্রধান লাভ কী?",
        options: [
          {
            key: "A",
            text: "Query লেখা সহজ হয়",
            isCorrect: false,
            explanation:
              "উল্টো, এখন ট্যুরের নামসহ Booking দেখতে JOIN লাগে। ভাঙার দাম এটাই।",
          },
          {
            key: "B",
            text: "দাম বদলাতে একটা ঘরই বদলাতে হয়, আর দুই জায়গায় দুই রকম দাম থাকার সুযোগ থাকে না",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা তথ্য একবার রাখলে পরস্পরবিরোধী Data অসম্ভব। Lesson 01 এর Spreadsheet এর ভোগান্তি এখানেই শেষ।",
          },
          {
            key: "C",
            text: "Database দ্রুত চালু হয়",
            isCorrect: false,
            explanation: "Data সাজানোর ধরনের সাথে Database চালু হওয়ার গতির সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "Booking এর মোট টাকা আর কখনো রাখার দরকার হয় না",
            isCorrect: false,
            explanation:
              "আসলে bookings এ total_bdt রাখা আছে জেনেবুঝে, কারণ বুক করার মুহূর্তের দাম একটা ইতিহাস, পরে দাম বাড়লেও সেটা বদলানো উচিত না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Key ধরে হাঁটা আর Database কে দিয়ে না বলানো",
    subtitle: "Query বক্সে (বা Module 02 এর পর psql এ) ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "একটা Table এর কাঠামো পড়া",
        description:
          "bookings এর Schema বের করুন। কোন Column গুলো খালি রাখা যায় না, আর কোনগুলো সংখ্যা, লিখে রাখুন।",
      },
      {
        title: "Booking 21 এর পথ হাতে হাতে",
        description:
          "পাঁচটা ছোট Query দিয়ে Booking 21 থেকে Guide পর্যন্ত হাঁটুন। কোথায় গিয়ে পথ থামল, আর কেন, সেটা লিখুন।",
      },
      {
        title: "One-to-Many চোখে দেখা",
        description:
          "Rahim Uddin এর সব Booking বের করুন। কয়টা Row এলো, আর প্রতিটায় customer_id কত, মিলিয়ে দেখুন।",
      },
      {
        title: "তিনবার না শোনা",
        description:
          "অচেনা Customer এর Booking, Booking আছে এমন Customer মোছা, আর একই Email এ নতুন Customer, তিনটা চালিয়ে প্রতিটা Error এর DETAIL লাইন নিজের ভাষায় লিখুন।",
      },
      {
        title: "NULL এর ফাঁদ",
        description:
          "Guide নেই এমন ট্যুর দুইভাবে খুঁজুন, = NULL দিয়ে আর IS NULL দিয়ে। কোনটায় কয়টা Row এলো, লিখে রাখুন। কারণটা Module 03 এর জন্য তুলে রাখুন।",
      },
      {
        title: "সব Foreign Key এর তালিকা",
        description:
          "শেষ Query টা লম্বা, বোঝার চেষ্টা করবেন না, শুধু চালান। Database নিজেই বলে দেবে কোন Table এর কোন Column কোন Table কে দেখায়। Project Example এর ছবির সাতটা দাগের সাথে মিলিয়ে দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-schema.sql",
        language: "sql",
        code: `-- bookings Table এর প্রতিটা Column, তার ধরন, আর খালি রাখা যায় কিনা
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Output এর সাতটা Row এর সবগুলোতেই is_nullable NO`,
      },
      {
        filename: "2-follow-booking-21.sql",
        language: "sql",
        code: `-- প্রতিটা ফলাফল থেকে পরের নম্বরটা নিজে বসান
SELECT * FROM bookings   WHERE booking_id   = 21;  -- customer_id 4, departure_id 15
SELECT * FROM customers  WHERE customer_id  = 4;   -- Farhana Akter
SELECT * FROM departures WHERE departure_id = 15;  -- tour_id 7, রওনা 2026-11-21
SELECT * FROM tours      WHERE tour_id      = 7;   -- guide_id এর ঘরে NULL
-- guide_id নেই, তাই guides এ যাওয়ার মতো কোনো নম্বর হাতে নেই`,
      },
      {
        filename: "3-one-to-many.sql",
        language: "sql",
        code: `-- Rahim Uddin (customer_id 1) এর সব Booking
SELECT booking_id, departure_id, seats, status
FROM bookings
WHERE customer_id = 1;

-- তিনটা Row: booking 1, 8 আর 17, তিনটাতেই customer_id 1`,
      },
      {
        filename: "4-three-refusals.sql",
        language: "sql",
        code: `-- একটা একটা করে চালান। প্রতিটাই ফিরিয়ে দেওয়া হবে।

-- ক) অচেনা Customer
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (99, 8, 1, 'pending', 12500.00);

-- খ) Booking আছে এমন Customer মোছা
DELETE FROM customers WHERE customer_id = 2;

-- গ) আগেই নেওয়া Email
INSERT INTO customers (full_name, email, city)
VALUES ('Nusrat Jahan', 'nusrat.jahan@mail.example', 'Dhaka');`,
      },
      {
        filename: "5-null-trap.sql",
        language: "sql",
        code: `-- একই প্রশ্ন, দুই লেখা
SELECT tour_id, title, guide_id FROM tours WHERE guide_id = NULL;   -- 0 rows
SELECT tour_id, title, guide_id FROM tours WHERE guide_id IS NULL;  -- 1 row: Ratargul`,
      },
      {
        filename: "6-all-foreign-keys.sql",
        language: "sql",
        code: `-- শুধু চালান। কোন Table এর কোন Column কোন Table কে দেখায়।
SELECT tc.table_name, kcu.column_name, ccu.table_name AS points_to
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY 1, 2;

-- সাতটা Row, Project Example এর ছবির সাতটা দাগ`,
      },
    ],
    tip: (
      <>
        এই লেসনের যেকোনো Query বক্সে এই কোডগুলো চালাতে পারবেন। একটা বক্সে কয়েকটা Statement একসাথে
        দিলে সবগুলোর ফলাফল নিচে নিচে আসে, আর একটা Error হলে সেখানেই থামে। INSERT বা DELETE চালানোর পর
        Reset চাপলে Database আবার শুরুর অবস্থায় ফিরে যায়। MySQL এ চালালে information_schema এর
        Query গুলো প্রায় একই রকম কাজ করে, কারণ এটা SQL Standard এর অংশ।
      </>
    ),
  },
  assignment: {
    title: "Mini Project: নিজের একটা ছোট Relational Model",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>কাগজে একটা Database:</strong> পরিচিত একটা ছোট ব্যবসা বেছে নিন, যেমন পাড়ার একটা
        কোচিং সেন্টার। তিনটা Table আঁকুন, ধরুন students, courses আর enrollments। প্রতিটার
        Column লিখুন, Primary Key দাগিয়ে দিন, আর প্রতিটা Foreign Key থেকে তার Primary Key পর্যন্ত
        তীর দিন।
      </span>,
      <span key="2">
        <strong>সম্পর্ক চিনুন:</strong> আপনার তিনটা Table এর মধ্যে কোন সম্পর্ক One-to-Many আর কোনটা
        Many-to-Many? দুই প্রশ্নের কৌশল দিয়ে প্রতিটা যাচাই করুন, আর লিখুন enrollments কেন একটা
        Junction Table।
      </span>,
      <span key="3">
        <strong>Key ধরে হাঁটুন:</strong> Query বক্সে Booking 5 আর Booking 20 এর পুরো পথ হাতে হাতে
        বের করুন, Customer থেকে Guide পর্যন্ত। প্রতিটা ধাপে কোন নম্বর নিয়ে কোন Table এ গেলেন লিখুন,
        আর শেষে এক লাইনে উত্তরটা।
      </span>,
      <span key="4">
        <strong>তিনটা না, নিজের ভাষায়:</strong> Lab এর চার নম্বর পরীক্ষার তিনটা Error চালান। প্রতিটার
        জন্য দুই লাইন লিখুন: কোন নিয়ম ভাঙল, আর এই নিয়ম না থাকলে Island Tours এর বাস্তবে কী ক্ষতি হতো।
      </span>,
      <span key="5">
        <strong>শিখিয়ে দিন (৮ থেকে ১০ লাইন):</strong> এমন একজন বন্ধুকে Primary Key আর Foreign Key
        বোঝান যিনি কখনো Database দেখেননি। Database এর বাইরের একটা উদাহরণ ব্যবহার করুন, যেমন
        পরীক্ষার খাতায় নামের বদলে রোল নম্বর। শেষে বলুন Relation শব্দের আসল মানে কী।
      </span>,
    ],
    deliverables: [
      <span key="1">তিনটা Table এর ছবি, Primary Key আর Foreign Key দাগানো</span>,
      <span key="2">প্রতিটা সম্পর্কের ধরন আর দুই প্রশ্নের উত্তর</span>,
      <span key="3">Booking 5 আর 20 এর পথ, প্রতিটা ধাপ সহ</span>,
      <span key="4">তিনটা Error এর ব্যাখ্যা, প্রতিটা দুই লাইনে</span>,
      <span key="5">বন্ধুর জন্য ৮ থেকে ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
