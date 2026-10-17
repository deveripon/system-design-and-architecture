import Link from "next/link";
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
  LoadErrorLab,
  LoadModeLab,
} from "../../../components/course/topics/sql-setup/load-animations";
import {
  FileAnatomyDiagram,
  HostVsContainerSplit,
  LoadPathDiagram,
} from "../../../components/course/topics/sql-setup/load-diagrams";
import {
  SAMPLE_DATABASE_MYSQL_PATH,
  SAMPLE_DATABASE_PATH,
} from "../../../lib/sql/playground-config";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const LINK = "text-primary underline underline-offset-4";
const DOWNLOAD =
  "inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.15em] transition-colors";

export const loadSampleDatabaseContent: TopicData = {
  id: "load-sample-database",
  introduction: {
    badge: "MODULE 02 · LESSON 06",
    title: <SectionTitle>খালি Server এ আসল দোকান সাজানো</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এই মডিউলে আপনি অনেকটা পথ পেরিয়ে এসেছেন। নিজের মেশিনে PostgreSQL ইনস্টল
          করেছেন, psql দিয়ে Server এর সাথে কথা বলতে শিখেছেন, একটা GUI Client
          দেখেছেন, আর জেনেছেন একটা Server এর ভেতরে Database আর Schema কীভাবে
          সাজানো থাকে। কিন্তু একটা কথা খেয়াল করেছেন? আপনার নিজের Server টা এখনো
          ফাঁকা। নতুন দোকান ভাড়া নেওয়া হয়েছে, তাক বসানো হয়েছে, দোকানদারও
          হাজির, অথচ তাকে একটাও জিনিস নেই।
        </ContentParagraph>
        <ContentParagraph>
          এতদিন যত Query বক্সে Run চেপেছেন, সেগুলোর ভেতরে একটা তৈরি করা Database
          ছিল, আপনার Browser এর ভেতরে। আজ ঠিক সেই Database টা, একই আটটা Table,
          একই প্রতিটা Row, আপনার নিজের Server এ তুলে আনবেন। কাজটার নাম Load করা।
          শেষে আপনি যেকোনো লেসনের যেকোনো Query নিজের psql এ চালিয়ে হুবহু একই
          উত্তর পাবেন। আর পাবেন একটা জিনিস যেটা Query বক্স কখনো দিতে পারে না: একটা
          সত্যিকারের Server, যেটা আপনার মেশিন বন্ধ করে আবার চালু করলেও সব মনে রাখে।
        </ContentParagraph>
        <ContentParagraph>
          পথে শিখবেন একটা SQL ফাইলের ভেতরে আসলে কী থাকে, Load এর প্রতিটা লাইনের
          Output কী বলছে, Load ঠিকমতো হলো কিনা কীভাবে নিশ্চিত হবেন, যতবার খুশি কীভাবে
          একদম শুরুর অবস্থায় ফিরবেন, Docker আর MySQL এ একই কাজ কীভাবে করবেন, আর
          সবচেয়ে জরুরি, কোন ভুলে Data চুপচাপ দ্বিগুণ হয়ে যায় আর সেটা কীভাবে আটকাবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আমি শুধু একটা লেখা ভরা ফাইল। আমার ভেতরে আছে কয়েকটা হুকুম, উপর থেকে নিচে সাজানো: আগের সব সরানো, নতুন তাক বসানো, তাকে জিনিস রাখা। যতবার আমাকে চালাবেন, দোকানটা ঠিক একই রকম করে সাজিয়ে দেব।",
      author: "island-tours.sql",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------------- */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Load মানে কী, আর কেন নিজের Server এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। রিয়া নামের একজন নতুন Developer Island Tours এ যোগ
                দিয়েছেন। প্রথম দিন তিনি নিজের Laptop এ PostgreSQL ইনস্টল করলেন,
                psql খুললেন, আর লিখলেন <code>SELECT * FROM tours;</code>। উত্তর এল,
                Table টা নেই। খুবই স্বাভাবিক। নতুন ইনস্টল করা Server একদম খালি থাকে।
                তার ভেতরে শুধু Server এর নিজের কাজের কয়েকটা Database থাকে, ব্যবসার
                কোনো Data থাকে না।
              </ContentParagraph>
              <ContentParagraph>
                টিমের একজন তাঁকে একটা ফাইল পাঠালেন, নাম island-tours.sql, আর বললেন,
                এটা Load করে নিন। রিয়া জিজ্ঞেস করলেন, Load মানে কী? এই লেসন সেই
                প্রশ্নের পুরো উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                একটা SQL ফাইল আসলে একটা সাধারণ লেখার ফাইল, ঠিক যেমন একটা চিঠি।
                পার্থক্য শুধু এই যে চিঠির প্রতিটা বাক্য একটা SQL Statement: একটা Table বানানো, একটা Table এ এই Row গুলো রাখা, এই রকম। এমন ফাইলকে বলে{" "}
                <strong>SQL Script</strong>। আর Load করা মানে সেই ফাইলের সব
                Statement একটার পর একটা, উপর থেকে নিচে, একটা Database এর উপর চালিয়ে
                দেওয়া। কাজ শেষে Database এর চেহারা ঠিক তেমন হয়, যেমনটা ফাইল লিখে
                রেখেছে।
              </ContentParagraph>
              <ContentParagraph>
                একটা উপমা দিই। আসবাবপত্রের দোকান থেকে একটা আলমারি কিনলেন, খুলে
                দেখলেন ভেতরে কাঠের টুকরো আর একটা কাগজ। কাগজে লেখা, প্রথমে এই দুটো
                টুকরো জোড়া দিন, তারপর তাক বসান, তারপর দরজা লাগান। কাগজটা হলো
                Script, আপনি হাত দিয়ে ধাপগুলো মেনে চলছেন, আর শেষে যে আলমারি দাঁড়িয়ে
                আছে সেটা হলো Load করা Database। কাগজে ক্রম ভুল থাকলে দরজা লাগানোর
                সময় দেখবেন কব্জা লাগানোর জায়গাই নেই। SQL Script এও ক্রম ঠিক এতটাই
                জরুরি, Section 004 এ দেখবেন কেন।
              </ContentParagraph>
              <ContentParagraph>
                প্রশ্ন আসতে পারে, Query বক্স তো ভালোই চলছিল, নিজের Server এ Load করার
                দরকার কী? তিনটা কারণ। প্রথমত, Query বক্সটা একটা অনুশীলনের ঘর, Page
                বন্ধ করলেই সব মুছে যায়। নিজের Server এ আপনার করা প্রতিটা পরিবর্তন থেকে
                যায়। দ্বিতীয়ত, চাকরিতে আপনি সবসময় একটা আসল Server এর সাথে কাজ
                করবেন, psql বা GUI দিয়ে, আর ঠিক এই Load করার কাজটা প্রতিটা নতুন
                প্রজেক্টের প্রথম দিনের কাজ। তৃতীয়ত, এই ট্র্যাকের সামনের অনেক কিছু,
                যেমন Index বানিয়ে গতি মাপা, একসাথে দুটো Connection খুলে Lock দেখা,
                Backup নেওয়া, Query বক্সে করা যায় না। সেগুলোর জন্য আপনার নিজের Server
                এ এই Data থাকা লাগবে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা কথা মনে রাখুন",
          content: (
            <ContentParagraph>
              Load করা মানে নতুন কিছু শেখা না। ফাইলের ভেতরের প্রতিটা Statement আপনি
              চাইলে হাতে টাইপ করে একটা একটা করে চালাতে পারতেন, ফলাফল একই হতো। psql
              শুধু সেই কাজটা দ্রুত আর নির্ভুলভাবে করে দেয়: ফাইল পড়ে, প্রতিটা
              Statement Server এর কাছে পাঠায়, আর প্রতিটার উত্তর আপনাকে দেখায়।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "before-you-start",
      subHeader: { index: "002", title: "Before You Start" },
      title: <SectionTitle>শুরুর আগে তিনটা জিনিস নিশ্চিত করুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Load করার আগে মাত্র তিনটা প্রশ্নের উত্তর হ্যাঁ হতে হবে। প্রতিটা
                প্রশ্নের জন্য একটা ছোট Command আছে, আর প্রতিটার উত্তর কেমন দেখায়
                সেটাও নিচে দেওয়া। কোনোটা না মিললে আগে সেই লেসনে ফিরে যান, এখানে জোর
                করে এগোবেন না। Load এর বেশিরভাগ ঝামেলা আসলে এই তিনটার কোনো একটায়
                লুকিয়ে থাকে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server চলছে তো?</strong> <code>pg_isready</code> চালালে
                  শেষে <code>accepting connections</code> লেখা আসতে হবে। না এলে
                  Server বন্ধ, চালু করার উপায়{" "}
                  <Link href="/sql/topic/install-postgresql" className={LINK}>
                    Lesson 01
                  </Link>{" "}
                  এ, আপনার Operating System অনুযায়ী।
                </ListItem>
                <ListItem>
                  <strong>psql আছে তো?</strong> <code>psql --version</code> চালালে
                  Version এর নম্বর আসবে। <code>command not found</code> এলে psql এর
                  ফোল্ডার আপনার PATH এ নেই, এটাও Lesson 01 এ ঠিক করা আছে।
                </ListItem>
                <ListItem>
                  <strong>Connect করতে পারছেন তো?</strong> নিচের তৃতীয় Command টা
                  একটা লাইন উত্তর দিলেই বুঝবেন আপনার পরিচয় (Role) ঠিক আছে। এটা না
                  হলে কোন Error এ কী করবেন, সেটা{" "}
                  <Link href="/sql/topic/psql-basics" className={LINK}>
                    Lesson 03
                  </Link>{" "}
                  আর{" "}
                  <Link href="/sql/topic/errors-and-help" className={LINK}>
                    Lesson 07
                  </Link>{" "}
                  এ।
                </ListItem>
              </ContentList>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: তিনটা যাচাই",
          code: `# ১. Server চলছে কিনা
pg_isready
# উত্তরের শেষে থাকবে: accepting connections
# (সামনের Socket বা Host এর অংশটা মেশিন ভেদে আলাদা)

# ২. psql আছে কিনা আর কোন Version
psql --version
# উত্তর এমন কিছু: psql (PostgreSQL) 18.6

# ৩. Connect করে নিজের পরিচয় জিজ্ঞেস করা
psql -d postgres -c "SELECT current_user;"
# একটা ছোট Table আসবে, ভেতরে আপনার Role এর নাম`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোন নামে Connect করছেন, সেটা আগে জেনে নিন",
          content: (
            <ContentParagraph>
              macOS এ Homebrew বা Postgres.app দিয়ে ইনস্টল করলে সাধারণত আপনার নিজের
              কম্পিউটারের User নামেই একটা Role থাকে, তাই আলাদা করে নাম বলতে হয় না।
              Windows আর Docker এ বলতে হয় <code>-U postgres</code>। Ubuntu তে হয়
              Lesson 01 এ নিজের নামে একটা Role বানিয়েছেন, নয়তো{" "}
              <code>sudo -u postgres</code> দিয়ে চালাতে হয়। তৃতীয় Command টা যে
              রূপে কাজ করল, এই লেসনের বাকি সব Command এও ঠিক সেই রূপটাই ব্যবহার
              করবেন।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "get-the-file",
      subHeader: { index: "003", title: "Get the File" },
      title: <SectionTitle>ফাইলটা নামান, আর একবার চোখ বুলিয়ে নিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                পুরো Island Tours Database একটা ছোট ফাইলে, প্রায় দশ KB। নিচের প্রথম
                বোতাম চাপলে PostgreSQL এর ফাইলটা নেমে আসবে। দ্বিতীয়টা একই Data এর
                MySQL সংস্করণ, সেটা লাগবে শুধু Section 012 এ, যদি MySQL ও চালান।
                দুটো ফাইলের উৎস আর ব্যাখ্যা একসাথে আছে{" "}
                <Link href="/sql/database" className={LINK}>
                  Sample Database পাতায়
                </Link>
                ।
              </ContentParagraph>
              <div className="my-6 flex flex-wrap gap-3">
                <a
                  href={SAMPLE_DATABASE_PATH}
                  download
                  className={`${DOWNLOAD} border-primary bg-primary text-primary-foreground hover:opacity-90`}
                >
                  island-tours.sql (PostgreSQL)
                </a>
                <a
                  href={SAMPLE_DATABASE_MYSQL_PATH}
                  download
                  className={`${DOWNLOAD} border-border text-foreground hover:border-primary/50`}
                >
                  island-tours.mysql.sql (MySQL)
                </a>
              </div>
              <ContentParagraph>
                বেশিরভাগ Browser ফাইলটা রাখে আপনার Downloads ফোল্ডারে। Load করার সময়
                psql কে বলতে হবে ফাইলটা কোথায়, তাই সবচেয়ে সহজ হলো Terminal খুলে
                আগে সেই ফোল্ডারে চলে যাওয়া। তারপর তিনটা ছোট পরীক্ষা: ফাইলটা সত্যিই
                আছে কিনা, তার প্রথম কয়েকটা লাইন কী, আর মোট কত লাইন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal (macOS, Linux)",
          code: `cd ~/Downloads

ls -l island-tours.sql
# ফাইলের আকার দেখাবে 10352 (Byte)

head -n 5 island-tours.sql
# -- Island Tours sample database for the SQL & Database Mastery track.
# -- PostgreSQL. Safe to run again: it drops and recreates every table.
# -- Every person, email and phone number here is made up.
#
# DROP TABLE IF EXISTS reviews, payments, bookings, departures, tours, guides, destinations, customers CASCADE;

wc -l island-tours.sql
# 197 island-tours.sql`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "PowerShell (Windows)",
          code: `cd $HOME\\Downloads

Get-Item .\\island-tours.sql        # আছে কিনা, আর তার আকার
Get-Content .\\island-tours.sql -TotalCount 5   # প্রথম পাঁচ লাইন`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দ্বিতীয়বার নামালে নাম বদলে যেতে পারে",
          content: (
            <ContentParagraph>
              একই ফাইল দুইবার নামালে অনেক Browser দ্বিতীয়টার নাম বদলে দেয়, যেমন{" "}
              <code>island-tours (1).sql</code>। নামের ভেতরে Space আর বন্ধনী চলে আসে,
              আর তখন Command এ সেই নাম Quote ছাড়া লিখলে psql ফাইল খুঁজে পায় না।
              সবচেয়ে সহজ সমাধান, পুরনো ফাইলটা মুছে নতুনটার নাম আবার
              island-tours.sql করে দেওয়া। কেন Space ঝামেলা করে, সেটা Section 013 এর
              Lab এ নিজের চোখে দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "inside-the-file",
      subHeader: { index: "004", title: "Inside the File" },
      title: <SectionTitle>ফাইলের ভেতরে চারটা অংশ, একটা নির্দিষ্ট ক্রমে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Load চালানোর আগে ফাইলটা একবার খুলে পড়া খুব ভালো অভ্যাস। যেকোনো Text
                Editor এ খুলুন, VS Code, Notepad, যা হাতের কাছে আছে। কারণ পরে চাকরিতে
                কেউ আপনাকে একটা Script দিয়ে বলবে চালিয়ে দিন, আর না পড়ে চালালে কী
                মুছে যাবে আপনি জানবেনই না। এই ফাইলে মোট চারটা অংশ আছে, উপর থেকে নিচে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <FileAnatomyDiagram />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "island-tours.sql (প্রথম অংশ)",
          code: `-- Island Tours sample database for the SQL & Database Mastery track.
-- PostgreSQL. Safe to run again: it drops and recreates every table.
-- Every person, email and phone number here is made up.

DROP TABLE IF EXISTS reviews, payments, bookings, departures, tours, guides, destinations, customers CASCADE;

CREATE TABLE destinations (
  destination_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL UNIQUE,
  region         text NOT NULL,
  kind           text NOT NULL
);

-- ... আরও সাতটা CREATE TABLE ...

INSERT INTO destinations (name, region, kind) VALUES
  ('Saint Martin''s Island', 'Chattogram', 'island'),
  ('Cox''s Bazar', 'Chattogram', 'beach'),
  ('Sundarbans', 'Khulna', 'forest'),
  -- ... আরও চারটা Row ...

-- ... আরও সাতটা INSERT ...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>প্রথম অংশ, মন্তব্য।</strong> দুটো হাইফেন দিয়ে শুরু হওয়া লাইন
                মানুষের জন্য লেখা, Server এগুলো পড়েই না। এখানে ফাইলটা নিজের পরিচয়
                দিচ্ছে, আর সবচেয়ে জরুরি কথাটা আগেই বলে দিচ্ছে: আবার চালানো নিরাপদ,
                কারণ সে আগে সবকিছু মুছে তারপর নতুন করে বানায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় অংশ, একটা DROP TABLE।</strong> এক লাইনে আটটা Table
                এর নাম, সবগুলো মুছে ফেলার হুকুম। দুটো ছোট শব্দ এখানে বড় কাজ করে।{" "}
                <code>IF EXISTS</code> মানে Table টা না থাকলে Error না দিয়ে শুধু জানিয়ে এগিয়ে যাওয়া। প্রথমবার Load করার সময় কোনো Table থাকে না, তাই
                এই শব্দ দুটো না থাকলে প্রথম লাইনেই Error হতো। আর <code>CASCADE</code>{" "}
                মানে এই Table এর উপর অন্য কিছু নির্ভর করলে সেটাও সাথে মুছে দেওয়া। এর পুরো
                অর্থ আর বিপদ Module 09 এ শিখবেন। আপাতত এটুকু জানলেই হবে: এই এক লাইনের
                কারণেই ফাইলটা যতবার খুশি চালানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>তৃতীয় অংশ, আটটা CREATE TABLE।</strong> প্রতিটা একটা খালি
                Table বানায়, তার Column, প্রতিটা Column এর Type আর নিয়মসহ। এখানে
                ক্রমটা খেয়াল করুন, উপরের ছবির ডান দিকে যেটা দেখানো আছে। tours Table
                এর একটা Column destinations কে দেখায়, আরেকটা guides কে। এই দেখানোর
                নাম Foreign Key, যেটা Module 01 এর{" "}
                <Link href="/sql/topic/relational-model" className={LINK}>
                  Relational Model লেসনে
                </Link>{" "}
                দেখেছেন। যাকে দেখানো হচ্ছে সে না থাকলে PostgreSQL দেখানোর নিয়মটাই
                বানাতে দেয় না। তাই destinations আর guides আগে, তারপর tours। একই
                কারণে bookings আসে customers আর departures এর পরে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>চতুর্থ অংশ, আটটা INSERT।</strong> প্রতিটা Table এ একটাই
                INSERT Statement, কিন্তু তার ভেতরে কমা দিয়ে আলাদা করা অনেকগুলো Row।
                একবারে অনেক Row ঢোকানোর এই লেখা Module 10 এ শিখবেন। এখানেও ক্রম
                একই: যে Row অন্য Table এর কোনো Row কে দেখায়, সেই অন্য Row আগে
                ঢুকতে হবে। একটা মজার জিনিস খেয়াল করুন:{" "}
                <code>{"'Saint Martin''s Island'"}</code>। নামের ভেতরের Apostrophe টা
                দুইবার লেখা, কারণ SQL এ লেখা শুরু আর শেষ হয় একটা Single Quote দিয়ে।
                ভেতরে একটা Quote রাখতে হলে দুটো পাশাপাশি লিখতে হয়। এটা Module 01 এর{" "}
                <Link href="/sql/topic/what-is-sql" className={LINK}>
                  What SQL Is লেসনে
                </Link>{" "}
                দেখেছেন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "অচেনা Script চালানোর আগে প্রথম লাইনগুলো পড়ুন",
          content: (
            <ContentParagraph>
              এই ফাইলের দ্বিতীয় অংশটা একটা DROP। আপনার Database এ যদি আগে থেকে
              tours বা bookings নামে নিজের কোনো Table থাকত, এই ফাইল সেটাও মুছে দিত,
              কোনো প্রশ্ন না করে। এখানে সেটা ইচ্ছাকৃত আর নিরাপদ, কারণ আমরা একটা
              আলাদা island_tours Database এ Load করব। কিন্তু অভ্যাসটা এখনই গড়ে তুলুন:
              যেকোনো Script চালানোর আগে খুলে দেখুন তার ভেতরে DROP, DELETE বা TRUNCATE
              আছে কিনা, আর থাকলে সেটা কোন Database এ চলবে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "create-the-database",
      subHeader: { index: "005", title: "Create the Database" },
      title: <SectionTitle>আগে খালি একটা Database, তারপর তার ভেতরে Load</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                ফাইলটা Table বানায়, কিন্তু Database বানায় না। এটা ইচ্ছা করেই এভাবে
                রাখা। কোন Database এ Load হবে, সেই সিদ্ধান্ত আপনার, ফাইলের না। তাই
                প্রথমে একটা খালি Database বানাতে হবে, নাম দেব <code>island_tours</code>।{" "}
                <Link href="/sql/topic/databases-schemas" className={LINK}>
                  আগের লেসনে
                </Link>{" "}
                দেখেছেন, একটা Server এর ভেতরে অনেকগুলো Database পাশাপাশি থাকতে পারে,
                একে অপরের থেকে আলাদা। island_tours হবে সেরকম একটা আলাদা ঘর, যাতে
                এখানে যা খুশি করলেও আপনার অন্য কোনো কাজে আঁচড় না লাগে।
              </ContentParagraph>
              <ContentParagraph>
                বানানোর দুটো উপায়, ফলাফল হুবহু এক। প্রথমটা Terminal থেকে{" "}
                <code>createdb</code>, PostgreSQL এর সাথে আসা একটা ছোট Program, যে
                আপনার হয়ে Server কে একটা SQL Command পাঠিয়ে দেয়। দ্বিতীয়টা psql এর
                ভেতর থেকে নিজেই সেই SQL Command লেখা, <code>CREATE DATABASE</code>।
                নিচে আপনার মেশিন অনুযায়ী রূপটা নিন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: Database বানানো",
          code: `# macOS (Homebrew বা Postgres.app), আর Ubuntu যদি নিজের নামে Role থাকে
createdb island_tours

# Ubuntu, যদি শুধু postgres Role দিয়ে কাজ করেন
sudo -u postgres createdb island_tours

# Windows (PowerShell), Password চাইবে
createdb -U postgres island_tours

# Docker, Container এর নাম island-pg হলে
docker exec island-pg createdb -U postgres island_tours`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql এর ভেতর থেকে, একই কাজ",
          code: `CREATE DATABASE island_tours;
-- উত্তর: CREATE DATABASE`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                বানানো হয়েছে কিনা দেখতে Server এর সব Database এর তালিকা চান।
                Terminal থেকে <code>psql -l</code>, আর psql এর ভেতর থেকে{" "}
                <code>\l</code>। নিচের Output টা একটা নতুন PostgreSQL 18 Server থেকে
                নেওয়া। আপনার মেশিনে Collate বা Ctype এর ঘরে অন্য কিছু লেখা থাকতে
                পারে, সেটা নিয়ে এখন ভাবার দরকার নেই। দেখার জিনিস শুধু একটা:
                island_tours নামের লাইনটা আছে কিনা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql: \\l (কয়েকটা Column বাদ দিয়ে)",
          code: `                            List of databases
     Name     |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype
--------------+----------+----------+-----------------+------------+------------
 island_tours | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8
 postgres     | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8
 template0    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8
 template1    | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8
(4 rows)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "already exists দেখে ভয় পাবেন না",
          content: (
            <ContentParagraph>
              দ্বিতীয়বার createdb চালালে আসবে{" "}
              <code>
                createdb: error: database creation failed: ERROR: database
                &quot;island_tours&quot; already exists
              </code>
              । এটা কোনো ক্ষতি না, শুধু জানাচ্ছে Database টা আগে থেকেই আছে। সোজা
              পরের ধাপে, Load এ চলে যান।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "load-it",
      subHeader: { index: "006", title: "Load It" },
      title: <SectionTitle>এক লাইনের Command, আর তার প্রতিটা লাইনের উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এবার আসল কাজ। Command টা ছোট:{" "}
                <code>psql -d island_tours -f island-tours.sql</code>। ভেঙে পড়লে,{" "}
                <code>-d island_tours</code> বলে কোন Database এর সাথে Connect হবে, আর <code>-f island-tours.sql</code> বলে কোন ফাইলের সব Statement চলবে। শেষ হলে psql নিজেই বেরিয়ে আসে। কোথায় কী ঘটে, আগে
                ছবিটা দেখে নিন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LoadPathDiagram />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: Load (Downloads ফোল্ডারে দাঁড়িয়ে)",
          code: `# macOS, আর Ubuntu যদি নিজের নামে Role থাকে
psql -d island_tours -f island-tours.sql

# Ubuntu, postgres Role দিয়ে: < চিহ্ন দিয়ে ফাইলটা পড়ায় আপনার নিজের Shell
sudo -u postgres psql -d island_tours < island-tours.sql`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "powershell",
          filename: "PowerShell (Windows)",
          code: `psql -U postgres -d island_tours -f island-tours.sql
# Password চাইবে, Lesson 01 এ যেটা দিয়েছিলেন`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথমবার চালালে স্ক্রিনে প্রায় পঁচিশটা লাইন আসে। নিচে হুবহু সেটা,
              একটা নতুন PostgreSQL 18.6 Server এ চালিয়ে নেওয়া। একবার পুরোটা পড়ুন,
              তারপর ব্যাখ্যাটা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "প্রথমবার Load এর Output",
          code: `psql:island-tours.sql:5: NOTICE:  table "reviews" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "payments" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "bookings" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "departures" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "tours" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "guides" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "destinations" does not exist, skipping
psql:island-tours.sql:5: NOTICE:  table "customers" does not exist, skipping
DROP TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 7
INSERT 0 5
INSERT 0 9
INSERT 0 15
INSERT 0 16
INSERT 0 24
INSERT 0 19
INSERT 0 10`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>আটটা NOTICE।</strong> প্রথম নজরে মনে হতে পারে কিছু ভুল
                হয়েছে, কিন্তু না। NOTICE মানে শুধু একটা খবর, Error না। লাইনের শুরুতে
                লেখা আছে কোন ফাইলের কোন লাইন থেকে খবরটা এল, এখানে ফাইলের পাঁচ নম্বর
                লাইন, মানে সেই DROP TABLE। Server বলছে, reviews নামে কোনো Table নেই,
                তাই মোছার কিছু নেই, এড়িয়ে যাচ্ছি। এটা হয় ঠিক ওই <code>IF EXISTS</code>{" "}
                এর কারণে। নতুন Database এ প্রথমবার এই আটটা লাইন আসবেই, দ্বিতীয়বার আর
                আসবে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DROP TABLE আর আটটা CREATE TABLE।</strong> প্রতিটা Statement
                সফল হলে psql সেই Command এর নামটা ছাপে। এটাকে বলে Command Tag। আটটা
                CREATE TABLE মানে আটটা Table তৈরি হয়েছে, Section 004 এর ক্রমেই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>আটটা INSERT।</strong> এখানে দুটো সংখ্যা। প্রথম সংখ্যাটা সবসময়
                0, PostgreSQL এর পুরনো একটা ব্যবস্থার চিহ্ন যেটা এখন আর ব্যবহার হয় না,
                তাই এটাকে উপেক্ষা করুন। দ্বিতীয় সংখ্যাটাই আসল: কতগুলো Row ঢুকল। 7,
                5, 9, 15, 16, 24, 19, 10। Sample Database পাতার আটটা Table এর Row এর
                সংখ্যার সাথে হুবহু মিলে যাচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা জিনিস খেয়াল করুন, যেটা নেই: কোনো লাইন <code>ERROR</code>{" "}
                দিয়ে শুরু হয়নি। Load সফল কিনা বোঝার সবচেয়ে দ্রুত উপায় এটাই।
                Output এ ERROR শব্দটা খুঁজুন। না পেলে সব ঠিক।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কেন Ubuntu তে < চিহ্ন",
          content: (
            <ContentParagraph>
              <code>sudo -u postgres psql ... -f ~/Downloads/island-tours.sql</code>{" "}
              লিখলে psql চলে postgres নামের OS User হিসেবে, আর অনেক Linux এ অন্য
              User আপনার Home ফোল্ডারের ভেতরে ঢুকতে পারে না। তখন আসে{" "}
              <code>Permission denied</code>। <code>&lt; island-tours.sql</code>{" "}
              লিখলে ফাইলটা খোলে আপনার নিজের Shell, আপনার অনুমতিতে, আর তার ভেতরের
              লেখাগুলো psql এর কাছে পাঠিয়ে দেয়। psql এর ফাইল খোলার দরকারই পড়ে না।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "verify-the-load",
      subHeader: { index: "007", title: "Verify the Load" },
      title: <SectionTitle>Load হয়েছে বলে মনে হলেই হবে না, গুনে দেখুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Output এ ERROR না থাকা একটা ভালো লক্ষণ, কিন্তু প্রমাণ না। প্রমাণ হলো
                নিজে Database এর ভেতরে ঢুকে দেখা Table গুলো আছে, আর প্রতিটায় ঠিক কতগুলো
                Row। এই অভ্যাসটা পরে Production এ অনেক বিপদ বাঁচাবে: কোনো Data সরানো বা
                Load করার পর সবসময় গুনে মিলিয়ে নেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমে psql দিয়ে island_tours এ ঢুকুন,{" "}
                <code>psql -d island_tours</code> (Windows বা Docker এ সাথে{" "}
                <code>-U postgres</code>)। Prompt এ Database এর নাম দেখাবে,{" "}
                <code>island_tours=#</code>। তারপর <code>\dt</code>, যেটা এই Database এর Table গুলোর তালিকা দেখায়।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql: \\dt",
          code: `              List of tables
 Schema |     Name     | Type  |  Owner
--------+--------------+-------+----------
 public | bookings     | table | postgres
 public | customers    | table | postgres
 public | departures   | table | postgres
 public | destinations | table | postgres
 public | guides       | table | postgres
 public | payments     | table | postgres
 public | reviews      | table | postgres
 public | tours        | table | postgres
(8 rows)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আটটা Table, সবগুলো <code>public</code> Schema তে, যেটা আগের লেসনে
              দেখেছেন। Owner এর ঘরে যে নাম, সেটা যে Role দিয়ে Load করেছেন তার নাম।
              macOS এ সেখানে আপনার নিজের নাম দেখবেন। এবার Row গোনার পালা। নিচের
              Query টা আটটা Table এর Row একসাথে গোনে। এটা কীভাবে লেখা হয়েছে সেটা
              এখন বোঝার দরকার নেই, UNION ALL শিখবেন Module 07 এ। আপাতত শুধু Run চাপুন,
              তারপর ঠিক এই Query টা নিজের psql এও চালান। দুই জায়গায় একই সংখ্যা এলে
              বুঝবেন আপনার Load একদম নিখুঁত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আটটা Table, কতগুলো করে Row"
              query={`SELECT 'destinations' AS table_name, count(*) FROM destinations
UNION ALL SELECT 'guides', count(*) FROM guides
UNION ALL SELECT 'tours', count(*) FROM tours
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'departures', count(*) FROM departures
UNION ALL SELECT 'bookings', count(*) FROM bookings
UNION ALL SELECT 'payments', count(*) FROM payments
UNION ALL SELECT 'reviews', count(*) FROM reviews;`}
              caption="উত্তর হবে 7, 5, 9, 15, 16, 24, 19 আর 10। এই আটটা সংখ্যা মনে রাখার দরকার নেই, Sample Database পাতায় সবসময় পাবেন। দরকার শুধু মিলিয়ে দেখা।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "নিজের psql এ একই Query এর উত্তর",
          code: `  table_name  | count
--------------+-------
 destinations |     7
 guides       |     5
 tours        |     9
 customers    |    15
 departures   |    16
 bookings     |    24
 payments     |    19
 reviews      |    10
(8 rows)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "কোথায় আছি, এই প্রশ্নটা সবসময় করতে পারেন",
          content: (
            <ContentParagraph>
              <code>SELECT current_database();</code> চালালে psql বলে দেয় আপনি এখন
              কোন Database এর ভেতরে আছেন। সংখ্যা না মিললে প্রথম সন্দেহ এটাই: হয়তো
              Load করেছেন এক Database এ, আর এখন বসে আছেন আরেকটায়। Section 013 এ এই
              ভুলটা বিস্তারিত দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "walk-through-it",
      subHeader: { index: "008", title: "Walk Through It" },
      title: <SectionTitle>একটা Table এর ভেতরে ঢুকে চারদিকে তাকানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Row গোনা হলো। এবার দেখা যাক Table গুলো কেমন করে বানানো। psql এর{" "}
                <code>\d</code> এর পরে একটা Table এর নাম দিলে সে সেই Table এর পুরো
                বর্ণনা দেয়: কোন কোন Column, কোন Type, কোনটা খালি থাকতে পারে, আর কোন
                কোন নিয়ম পাহারা দিচ্ছে। এটাকে বলে Table এর Structure দেখা। Module 01
                এ এই কথাগুলো ছবিতে দেখেছিলেন, এখন সেগুলো আপনার নিজের Server এ জীবন্ত।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql: \\d tours",
          code: `                                      Table "public.tours"
     Column     |           Type           | Collation | Nullable |           Default
----------------+--------------------------+-----------+----------+------------------------------
 tour_id        | integer                  |           | not null | generated always as identity
 title          | text                     |           | not null |
 destination_id | integer                  |           | not null |
 guide_id       | integer                  |           |          |
 duration_days  | smallint                 |           | not null |
 price_bdt      | numeric(10,2)            |           | not null |
 max_seats      | smallint                 |           | not null |
 is_active      | boolean                  |           | not null | true
 created_at     | timestamp with time zone |           | not null | now()
Indexes:
    "tours_pkey" PRIMARY KEY, btree (tour_id)
Check constraints:
    "tours_duration_days_check" CHECK (duration_days > 0)
    "tours_max_seats_check" CHECK (max_seats > 0)
    "tours_price_bdt_check" CHECK (price_bdt >= 0::numeric)
Foreign-key constraints:
    "tours_destination_id_fkey" FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
    "tours_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(guide_id)
Referenced by:
    TABLE "departures" CONSTRAINT "departures_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES tours(tour_id)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                প্রথমবার দেখলে অনেক কিছু মনে হয়, কিন্তু এটা আসলে পাঁচটা ছোট অংশ।
                উপর থেকে একটা একটা করে পড়ুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Column এর তালিকা।</strong> প্রতিটা লাইনে একটা Column, তার
                  Type, আর Nullable এর ঘরে <code>not null</code> মানে এখানে খালি রাখা
                  যাবে না। guide_id এর ঘরটা ফাঁকা, মানে এটা খালি থাকতে পারে। ঠিক এই
                  কারণেই Ratargul Swamp Boat Day এর Guide নেই, তবু Row টা ঢুকতে
                  পেরেছে। Default এর ঘরে লেখা মান তখন বসে, যখন INSERT এ সেই Column এর
                  কিছু বলা হয় না।
                </ListItem>
                <ListItem>
                  <strong>Indexes।</strong> <code>tours_pkey</code> হলো Primary Key, আর
                  তার জন্য PostgreSQL নিজে থেকেই একটা Index বানিয়ে রেখেছে, যাতে tour_id
                  দিয়ে খোঁজা দ্রুত হয়। Index কী আর কেন, পুরোটা Module 13 এ।
                </ListItem>
                <ListItem>
                  <strong>Check constraints।</strong> তিনটা নিয়ম: দিনের সংখ্যা শূন্যের
                  বেশি, সিট শূন্যের বেশি, দাম ঋণাত্মক না। প্রতিটা নিয়মের একটা নাম আছে।
                  কেউ নিয়ম ভাঙলে Error এর ভেতরে ঠিক এই নামটা আসবে, তাই নামগুলো চিনে
                  রাখা কাজের।
                </ListItem>
                <ListItem>
                  <strong>Foreign-key constraints।</strong> এই Table অন্য কাকে কাকে
                  দেখায়: destination_id দেখায় destinations কে, guide_id দেখায় guides
                  কে।
                </ListItem>
                <ListItem>
                  <strong>Referenced by।</strong> উল্টো দিক: অন্য কোন Table এই Table
                  কে দেখায়। departures এর tour_id। এই অংশটা বলে দেয়, tours থেকে কোনো
                  ট্যুর মুছতে গেলে departures এ তার তারিখ থাকলে কী হবে, সেটা ভাবতে হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একই ভাবে <code>\d bookings</code> চালিয়ে দেখুন। সেখানে Check
                constraints এর ঘরে status এর নিয়মটা দেখবেন, শুধু pending, confirmed
                আর cancelled চলবে। আর Referenced by এ দেখবেন দুটো Table, payments আর
                reviews, দুটোই bookings কে দেখায়। পুরো আটটা Table এর সম্পর্ক একটা
                ছবিতে নিচে।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <IslandToursDatabaseDiagram />,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Query বক্সেও Structure দেখা যায়",
          content: (
            <ContentParagraph>
              <code>\d</code> হলো psql এর নিজের Command, তাই এই সাইটের Query বক্সে
              চলবে না। বক্সে একই তথ্য পেতে চাইলে Database এর নিজের বর্ণনার Table থেকে
              জিজ্ঞেস করতে হয়, যেমন{" "}
              <code>
                SELECT table_name FROM information_schema.tables WHERE table_schema =
                &apos;public&apos;;
              </code>
              । এটা আটটা Table এর নাম দেয়, ঠিক \dt এর মতো। information_schema নিয়ে
              বিস্তারিত পরের মডিউলগুলোতে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "time-zone",
      subHeader: { index: "009", title: "Time Zone" },
      title: <SectionTitle>একই মুহূর্ত, দুই রকম ঘড়ির লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Load এর পর অনেকে একটা জিনিস দেখে চমকে যান। Query বক্সে Booking 1 এর
                সময় দেখায় <code>2025-12-20 10:15:00+06</code>, অথচ নিজের Server এ, বিশেষ
                করে Docker এ, একই Row দেখায় <code>2025-12-20 04:15:00+00</code>। মনে
                হয় Load এর সময় সময়টা ছয় ঘণ্টা সরে গেছে। আসলে কিছুই সরেনি।
              </ContentParagraph>
              <ContentParagraph>
                booked_at Column এর Type হলো <code>timestamptz</code>, মানে সময়ের
                সাথে Time Zone এর হিসাবও রাখা হয়। Database ভেতরে একটা নির্দিষ্ট মুহূর্ত
                রাখে, আর দেখানোর সময় সেই মুহূর্তটা আপনার Connection এর Time Zone এর
                ঘড়িতে লিখে দেয়। ঢাকার ঘড়িতে সকাল সোয়া দশটা আর লন্ডনের হিসাবে ভোর
                সোয়া চারটা, একই মুহূর্ত। শেষের <code>+06</code> বা <code>+00</code>{" "}
                বলে দেয় কোন ঘড়িতে লেখা। Docker এর PostgreSQL Image আর অনেক Cloud
                Server চলে UTC তে, তাই সেখানে +00 দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের বক্সে নিজেই দেখুন। এই সাইটের বক্স ঢাকার ঘড়িতে চলে। একই Row
                দুইবার পড়া হচ্ছে, মাঝখানে শুধু Connection এর Time Zone বদলানো।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একই Booking, দুই ঘড়িতে"
              query={`SHOW timezone;
SELECT booking_id, booked_at FROM bookings WHERE booking_id = 1;

SET timezone = 'UTC';
SELECT booking_id, booked_at FROM bookings WHERE booking_id = 1;

SET timezone = 'Asia/Dhaka';  -- আবার ঢাকায় ফেরা`}
              caption="প্রথমবার 10:15:00+06, দ্বিতীয়বার 04:15:00+00। সংখ্যা আলাদা, মুহূর্ত একই। শেষ লাইনটা বক্সকে আবার ঢাকার ঘড়িতে ফিরিয়ে দেয়, যাতে এই পাতার বাকি বক্সগুলো আগের মতো দেখায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজের Server এ সবসময় ঢাকার ঘড়িতে দেখতে চাইলে দুটো উপায়। শুধু এই
              Session এর জন্য <code>SET timezone = &apos;Asia/Dhaka&apos;;</code>,
              psql বন্ধ করলেই সেটা ভুলে যায়। আর island_tours এ যতবার Connect করবেন
              ততবারের জন্য, Database এর সাথেই সেটিংটা বেঁধে দেওয়া যায়। নিচের
              Command টা একটা PostgreSQL 18 Server এ চালিয়ে দেখা, পরের Connection থেকেই
              +06 দেখায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "psql: Database এর নিজের Time Zone",
          code: `-- আপনার Server এখন কোন ঘড়িতে দেখাচ্ছে
SHOW timezone;

-- island_tours এ প্রতিটা নতুন Connection ঢাকার ঘড়িতে
ALTER DATABASE island_tours SET timezone TO 'Asia/Dhaka';

-- psql থেকে বেরিয়ে আবার ঢুকুন, তারপর
SELECT booking_id, booked_at FROM bookings WHERE booking_id = 1;
--  booking_id |       booked_at
-- ------------+------------------------
--           1 | 2025-12-20 10:15:00+06`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Data বদলায় না, শুধু দেখানো বদলায়",
          content: (
            <ContentParagraph>
              Time Zone বদলানো কোনো Row এর একটা Byte ও বদলায় না। এটা শুধু চশমা
              বদলানোর মতো। তাই দুটো Server এ দুই রকম সময় দেখালে আগে Time Zone মিলিয়ে
              নিন, তারপর সন্দেহ করুন Data ভুল কিনা। সময় আর Time Zone এর পুরো গল্প
              Module 04 আর Module 09 এ।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "reset-and-load-safely",
      subHeader: { index: "010", title: "Reset and Load Safely" },
      title: <SectionTitle>যতবার খুশি নতুন করে শুরু, আর অর্ধেক Load থেকে সাবধান</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এই ট্র্যাকে আপনি Data বদলাবেন, মুছবেন, ইচ্ছা করে ভুল করবেন। সেটাই
                শেখার উপায়। আর প্রতিবার শেষে একদম শুরুর অবস্থায় ফেরার সবচেয়ে সহজ
                উপায় হলো একই ফাইল আবার চালানো। ফাইলটা প্রথমেই আটটা Table মুছে নতুন
                করে বানায়, তাই আপনি যা-ই করে থাকুন, শেষে Data হুবহু আগের মতো।
                দ্বিতীয়বার চালালে Output একটু ছোট হয়, কারণ এবার মোছার মতো Table আছে, তাই
                কোনো NOTICE নেই।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দ্বিতীয়বার Load এর Output (শুরুর অংশ)",
          code: `DROP TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 7
INSERT 0 5
INSERT 0 9
...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরও বড় পরিষ্কার চাইলে, মানে island_tours এর ভেতরে নিজে যে বাড়তি Table
              বানিয়েছেন সেগুলোও মুছে ফেলতে চাইলে, পুরো Database টাই ফেলে দিয়ে আবার
              বানান। <code>dropdb</code> হলো createdb এর উল্টো Program।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: একদম শূন্য থেকে",
          code: `dropdb island_tours        # পুরো Database মুছে ফেলে, ফেরানোর উপায় নেই
createdb island_tours
psql -d island_tours -f island-tours.sql`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Reset মানে আপনার নিজের কাজও যাবে",
          content: (
            <ContentParagraph>
              ফাইল আবার চালালে আটটা Table এ আপনি যা যা বদলেছিলেন সব হারাবে। আর
              dropdb চালালে island_tours এর ভেতরে নিজের বানানো সবকিছুও যাবে। তাই
              নিজের Practice এর জন্য যদি কিছু রাখতে চান, সেটা আলাদা একটা Database এ
              রাখুন, যেমন my_tours। কীভাবে, সেটা Section 015 এ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এবার এই লেসনের সবচেয়ে জরুরি অংশ। psql একটা Script চালানোর সময় কোনো
                Statement এ Error পেলে কী করে? Default ভাবে, সে Error টা ছাপে আর{" "}
                <strong>পরের Statement এ চলে যায়</strong>। শুনতে নিরীহ, কিন্তু এর ফল
                ভয়ানক হতে পারে: ফাইলটা অর্ধেক চলে, আর শেষে psql জানায় সব ঠিক আছে।
              </ContentParagraph>
              <ContentParagraph>
                এটা আটকানোর জন্য psql এর দুটো সুইচ আছে। প্রথমটা{" "}
                <code>-v ON_ERROR_STOP=1</code>, যেটা psql কে প্রথম Error এই থামিয়ে দেয়। দ্বিতীয়টা{" "}
                <code>--single-transaction</code>, যেটা পুরো ফাইলটা একটা Transaction এর ভেতরে চালায়, যাতে কোথাও Error হলে আগের সব কাজও বাতিল হয়ে যায়। হয়
                সবটা হবে, নয়তো কিছুই না। Transaction কী, তার পুরো গল্প Module 12 এ। আপাতত
                নিচের Lab এ দেখুন একই ভুল ফাইল তিনভাবে চালালে Database এর কী অবস্থা হয়।
                প্রথমে বাছাই করা Scenario টা চালিয়ে দেখুন, তারপর অন্যটা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LoadModeLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Lab এর Exit Code এর ঘরটা খেয়াল করেছেন? প্রতিটা Program শেষ হওয়ার সময়
                Operating System কে একটা সংখ্যা জানিয়ে যায়, সেটাই Exit Code। Terminal এ
                ঠিক পরেই <code>echo $?</code> লিখলে সেটা দেখা যায়। PostgreSQL এর Docs
                অনুযায়ী psql এর চারটা মান: 0 মানে স্বাভাবিকভাবে শেষ, 1 মানে psql এর
                নিজের কোনো সমস্যা (যেমন ফাইল পায়নি), 2 মানে Server এর সাথে Connection
                ভেঙেছে, আর 3 মানে Script এর ভেতরে Error হয়েছে আর ON_ERROR_STOP চালু ছিল।
              </ContentParagraph>
              <ContentParagraph>
                কেন এটা জরুরি? কারণ পরে আপনি Script চালাবেন Deploy এর সময়, CI
                Pipeline এর ভেতরে, যেখানে কোনো মানুষ Output পড়ছে না। সেখানে Pipeline
                শুধু Exit Code দেখে সিদ্ধান্ত নেয় এগোবে কিনা। ON_ERROR_STOP ছাড়া একটা
                অর্ধেক চলা Script ও 0 ফেরত দেয়, আর Pipeline খুশি মনে এগিয়ে যায়।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: নিরাপদ Load, আজ থেকে এভাবেই",
          code: `psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f island-tours.sql
echo $?
# 0  মানে পুরো ফাইল সফল, কিছুই বাদ পড়েনি
# 3  মানে কোথাও Error, আর কিছুই বদলায়নি, ভুলটা ঠিক করে আবার চালান`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বাতিল হওয়া Row ও নম্বর খেয়ে ফেলে",
          content: (
            <ContentParagraph>
              Lab এর তিন লাইনের ফাইলটা single-transaction দিয়ে চালানোর পর Guide এর
              সংখ্যা আবার 5 এ ফিরে আসে। কিন্তু এরপর নতুন একজন Guide ঢোকালে তিনি পান
              guide_id 7, 6 না। যে INSERT বাতিল হয়েছিল, সে 6 নম্বরটা ততক্ষণে নিয়ে
              ফেলেছিল, আর নম্বর কখনো ফেরত দেওয়া হয় না। তাই ID এর মাঝে ফাঁক দেখলে ভয়
              পাবেন না, এটা স্বাভাবিক। কেন এমন, Module 10 এ।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "other-ways-in",
      subHeader: { index: "011", title: "Other Ways In" },
      title: <SectionTitle>psql এর ভেতর থেকে, GUI থেকে, Docker থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                এখন পর্যন্ত Load করেছেন Terminal থেকে, এক লাইনে। কিন্তু একই কাজের
                আরও কয়েকটা দরজা আছে, আর বাস্তবে কোনটা লাগবে সেটা নির্ভর করে আপনি
                কোথায় বসে আছেন তার উপর।
              </ContentParagraph>
              <ContentParagraph>
                <strong>psql এর ভেতর থেকে, \i দিয়ে।</strong> psql খোলা অবস্থায় যদি
                মনে পড়ে ফাইলটা চালাতে হবে, বের হওয়ার দরকার নেই।{" "}
                <code>\i island-tours.sql</code> লিখলে psql ফাইলটা পড়ে ঠিক -f এর মতোই
                চালায়। i এসেছে include থেকে। পথটা গোনা হয় সেই ফোল্ডার থেকে, যেখানে
                দাঁড়িয়ে psql চালু করেছিলেন, তাই অন্য ফোল্ডারে থাকলে পুরো পথ লিখুন।
                শুরুর আগে Prompt এ দেখে নিন আপনি island_tours এ আছেন কিনা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "psql এর ভেতরে",
          code: `island_tours=# \\i island-tours.sql
DROP TABLE
CREATE TABLE
...
INSERT 0 10
island_tours=# SELECT count(*) FROM bookings;
 count
-------
    24
(1 row)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                <strong>GUI থেকে।</strong>{" "}
                <Link href="/sql/topic/gui-clients" className={LINK}>
                  Lesson 04
                </Link>{" "}
                এর যেকোনো GUI তেও একই কাজ হয়, শুধু বোতাম দিয়ে। pgAdmin এর
                অফিসিয়াল Docs অনুযায়ী ধাপগুলো এরকম: বাম পাশের গাছে island_tours
                Database টা বেছে নিয়ে Query Tool খুলুন। Query Tool এর Open File বোতাম
                (অথবা Cmd/Ctrl + O) দিয়ে island-tours.sql খুলুন, ফাইলের সব লেখা
                Editor এ চলে আসবে। তারপর Execute script বোতাম, অথবা F5। DBeaver এর
                Docs বলে, তার SQL Editor এ Execute SQL Script পুরো Editor এর সব Query
                একটার পর একটা চালায়, Semicolon দেখে আলাদা করে। দুই ক্ষেত্রেই আসল
                কথা একটাই: চালানোর আগে নিশ্চিত হোন Editor টা island_tours এর সাথে
                জোড়া, postgres এর সাথে না। মেনুর নাম আপনার Version এ একটু আলাদা হলে
                নিজের App এর লেখাটাই মানুন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Docker থেকে।</strong> যদি Lesson 01 এ PostgreSQL চালিয়ে থাকেন
                একটা Container এ, যার নাম island-pg, তাহলে একটা নতুন জিনিস মাথায়
                রাখতে হবে। Container এর ভেতরে psql চালালে সে শুধু Container এর নিজের
                ফাইলগুলো দেখতে পায়, আপনার Downloads ফোল্ডার তার কাছে অচেনা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <HostVsContainerSplit />,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: Docker এর Container এ Load",
          code: `# প্রথম উপায়: ফাইলটা Container এর ভেতরে কপি করে, তারপর -f
docker exec island-pg createdb -U postgres island_tours
docker cp island-tours.sql island-pg:/tmp/island-tours.sql
docker exec island-pg psql -U postgres -d island_tours -f /tmp/island-tours.sql

# দ্বিতীয় উপায় (macOS, Linux): আপনার Shell ফাইলটা পড়ে পাঠিয়ে দেয়
# -i না দিলে Container লেখাটা পায়ই না
docker exec -i island-pg psql -U postgres -d island_tours < island-tours.sql`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Windows PowerShell এ < চিহ্ন চলে না",
          content: (
            <ContentParagraph>
              PowerShell এ <code>&lt; island-tours.sql</code> লিখলে সে ফাইল পাঠায় না,
              উল্টো জানায় যে এই চিহ্নটা ভবিষ্যতের জন্য সংরক্ষিত। তাই Windows এ সবসময়
              -f ব্যবহার করুন, আর Docker হলে প্রথম উপায়টা, docker cp দিয়ে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "the-mysql-path",
      subHeader: { index: "012", title: "The MySQL Path" },
      title: <SectionTitle>একই Data, MySQL এ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                যদি{" "}
                <Link href="/sql/topic/install-mysql" className={LINK}>
                  Lesson 02
                </Link>{" "}
                তে MySQL ইনস্টল করে থাকেন, কোনো MySQL কোর্স বা ভিডিওর সাথে মিলিয়ে
                অনুশীলন করার জন্য, তাহলে একই Island Tours Data সেখানেও তুলে রাখুন।
                তখন ভিডিওর প্রতিটা উদাহরণ আপনি দুই জায়গায় চালিয়ে উত্তর মেলাতে পারবেন।
              </ContentParagraph>
              <ContentParagraph>
                এর জন্য আলাদা একটা ফাইল, island-tours.mysql.sql, Section 003 এর দ্বিতীয়
                বোতাম। একই আটটা Table, একই প্রতিটা Row, শুধু MySQL এর ভাষায় লেখা।
                PostgreSQL এর ফাইলটা MySQL এ চালালে প্রথম CREATE TABLE এই আটকে যাবে,
                কারণ কয়েকটা Type আর লেখার নিয়ম দুই Database এ আলাদা। ধাপগুলো প্রায় একই,
                শুধু Program আর Flag আলাদা।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: MySQL এ Load",
          code: `# ১. খালি Database (Password চাইবে)
mysql -u root -p -e "CREATE DATABASE island_tours"

# ২. Load, এবার -f না, < চিহ্ন দিয়ে, আর Database এর নাম অবশ্যই
mysql -u root -p island_tours < island-tours.mysql.sql

# ৩. যাচাই
mysql -u root -p island_tours -e "SHOW TABLES; SELECT COUNT(*) FROM bookings;"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              MySQL চুপচাপ কাজ করে। সফল হলে কোনো Output দেয় না, ঠিক যেমন অনেক
              Unix Program। তাই তৃতীয় ধাপটা বাদ দেবেন না। নিচের Output MySQL 8.4.11
              এ চালিয়ে নেওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "MySQL: SHOW TABLES আর DESCRIBE tours",
          code: `+------------------------+
| Tables_in_island_tours |
+------------------------+
| bookings               |
| customers              |
| departures             |
| destinations           |
| guides                 |
| payments               |
| reviews                |
| tours                  |
+------------------------+

+----------------+---------------+------+-----+-------------------+-------------------+
| Field          | Type          | Null | Key | Default           | Extra             |
+----------------+---------------+------+-----+-------------------+-------------------+
| tour_id        | int           | NO   | PRI | NULL              | auto_increment    |
| title          | varchar(255)  | NO   |     | NULL              |                   |
| destination_id | int           | NO   | MUL | NULL              |                   |
| guide_id       | int           | YES  | MUL | NULL              |                   |
| duration_days  | smallint      | NO   |     | NULL              |                   |
| price_bdt      | decimal(10,2) | NO   |     | NULL              |                   |
| max_seats      | smallint      | NO   |     | NULL              |                   |
| is_active      | tinyint(1)    | NO   |     | 1                 |                   |
| created_at     | datetime      | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+----------------+---------------+------+-----+-------------------+-------------------+`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                PostgreSQL এর <code>\d tours</code> এর সাথে মিলিয়ে দেখুন, কয়েকটা
                পার্থক্য চোখে পড়বে, আর প্রতিটার পেছনে একটা কারণ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ID এর জন্য <code>generated always as identity</code> এর জায়গায়{" "}
                  <code>auto_increment</code>। কাজ একই, নিজে থেকে বাড়তে থাকা নম্বর।
                </ListItem>
                <ListItem>
                  <code>text</code> এর জায়গায় <code>varchar(255)</code>। MySQL এ
                  TEXT Column এ UNIQUE নিয়ম বসাতে গেলে দৈর্ঘ্য আলাদা করে বলে দিতে হয়, VARCHAR এ দৈর্ঘ্যটা নামের সাথেই থাকে।
                </ListItem>
                <ListItem>
                  <code>boolean</code> এর জায়গায় <code>tinyint(1)</code>। MySQL এ
                  BOOLEAN আসলে একটা ছোট সংখ্যা, 1 মানে true, 0 মানে false।
                </ListItem>
                <ListItem>
                  <code>timestamp with time zone</code> এর জায়গায় <code>datetime</code>।
                  এই Column কোনো Time Zone রাখে না। তাই ফাইলে সময়গুলো লেখা আছে
                  ঢাকার ঘড়িতে, আর MySQL এ Booking 1 এর সময় দেখায় শুধু{" "}
                  <code>2025-12-20 10:15:00</code>, শেষে কোনো +06 ছাড়া।
                </ListItem>
                <ListItem>
                  Key এর ঘরে <code>MUL</code> মানে এই Column এ Index আছে যেখানে একই মান
                  অনেকবার আসতে পারে। MySQL প্রতিটা Foreign Key এর জন্য নিজে থেকে এমন
                  Index বানায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                MySQL এর Client এর ভেতরে থাকা অবস্থায় ফাইল চালাতে চাইলে psql এর \i এর
                মতো একটা Command আছে, <code>source</code>। তার পরে ফাইলের নাম দিলে mysql ফাইলটা পড়ে ভেতরের সব Statement একটার পর একটা চালায়, ঠিক &lt; চিহ্নের মতোই।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mysql এর ভেতরে",
          code: `mysql> USE island_tours;
mysql> source island-tours.mysql.sql
mysql> SELECT COUNT(*) FROM reviews;
+----------+
| COUNT(*) |
+----------+
|       10 |
+----------+
1 row in set (0.00 sec)`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এর তিনটা পরিচিত Error",
          content: (
            <ContentParagraph>
              Database এর নাম দিতে ভুলে গেলে <code>ERROR 1046 (3D000): No database
              selected</code>। Database এখনো বানানো না হলে{" "}
              <code>ERROR 1049 (42000): Unknown database &apos;island_tours&apos;</code>।
              আর দ্বিতীয়বার বানাতে চাইলে{" "}
              <code>ERROR 1007 (HY000): Can&apos;t create database &apos;island_tours&apos;;
              database exists</code>, যেটা PostgreSQL এর already exists এর মতোই নিরীহ।
              প্রথম দুটো নিচের Lab এও আছে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "when-it-fails",
      subHeader: { index: "013", title: "When It Fails" },
      title: <SectionTitle>Error এর প্রথম শব্দটাই বলে দেয় কে বিপদে আছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                Load এর Error গুলো প্রথমবার ভয় ধরায়, কিন্তু আসলে এগুলো খুব কম রকমের,
                আর প্রায় প্রতিটা একই কয়েকটা কারণে আসে। পড়ার একটা সহজ কৌশল আছে:
                Message এর প্রথম শব্দটা দেখুন। <code>psql: error:</code> দিয়ে শুরু
                হলে সমস্যা আপনার কম্পিউটারে, ফাইল বা পথ নিয়ে, Server পর্যন্ত কিছু
                পৌঁছায়ইনি। <code>FATAL:</code> থাকলে Server Connect করতেই দেয়নি।{" "}
                <code>ERROR:</code> দিয়ে শুরু হলে Connection ঠিক ছিল, Server একটা
                নির্দিষ্ট Statement কে ফিরিয়ে দিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ নয়টা Error, প্রতিটা সত্যিকারের Server এ চালিয়ে পাওয়া।
                প্রতিটায় ক্লিক করে আগে নিজে আন্দাজ করুন কে বলছে আর কেন, তারপর উত্তর
                মিলিয়ে নিন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: <LoadErrorLab />,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                আরও তিনটা Error আছে যেগুলো Load এর সময় দেখা দিতে পারে, কিন্তু সেগুলোর
                মূল কারণ Load এ না, তার আগের ধাপে। দেখলে Load এর Command বারবার না
                চালিয়ে সেই লেসনে ফিরে যান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>role &quot;...&quot; does not exist</code> বা{" "}
                  <code>password authentication failed</code>: আপনি কে, সেটা Server
                  মানছে না। Role আর Password এর ব্যাপার, Lesson 01 আর Lesson 03।
                </ListItem>
                <ListItem>
                  <code>Connection refused</code> বা <code>No such file or directory</code>{" "}
                  Socket এর পথ নিয়ে: Server চলছেই না, বা অন্য Port এ। Lesson 01।
                </ListItem>
                <ListItem>
                  <code>Peer authentication failed</code>: Ubuntu তে Role এর নাম আর
                  আপনার OS User এর নাম মিলছে না। Lesson 01 এর Ubuntu অংশ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                যেকোনো PostgreSQL Error এর প্রতিটা অংশ পড়তে শেখা, তার কোড দেখে কারণ
                বোঝা আর Docs থেকে উত্তর খোঁজা, এই পুরো দক্ষতাটা পরের লেসনের বিষয়,{" "}
                <Link href="/sql/topic/errors-and-help" className={LINK}>
                  Reading Errors and Finding Help
                </Link>
                ।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "first-questions",
      subHeader: { index: "014", title: "See It Yourself" },
      title: <SectionTitle>নতুন Data এর কাছে প্রথম পাঁচটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentParagraph>
                নতুন কোনো Database হাতে পেলে অভিজ্ঞ Developer রা প্রথমেই কয়েকটা ছোট
                প্রশ্ন করে Data টা চিনে নেন। কতগুলো জিনিস আছে, কোনগুলো অসম্পূর্ণ, কোথায়
                অদ্ভুত কিছু লুকিয়ে আছে। চলুন সেভাবেই Island Tours কে চিনি। Query গুলো
                এখনো আপনার লেখার কথা না, SELECT শুরু হবে Module 03 এ। শুধু Run চাপুন,
                উত্তর পড়ুন, আর তারপর <strong>হুবহু একই Query নিজের psql এ চালান</strong>।
                দুই জায়গায় একই উত্তর মানে আপনার Load এ কোনো ফাঁক নেই।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রশ্ন ১: কতগুলো Booking, কোন অবস্থায়, কত টাকার"
              query={`SELECT status, count(*) AS bookings, sum(total_bdt) AS total_bdt
FROM bookings
GROUP BY status
ORDER BY status;`}
              caption="১৭টা confirmed, ৪টা pending, ৩টা cancelled। cancelled গুলোর টাকাও এখানে যোগ হয়েছে, যেটা আয়ের হিসাবে গোনা যাবে না। কোন Booking কে আয় ধরবেন আর কোনটাকে না, সেই প্রশ্ন Module 05 এ ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রশ্ন ২, ৩, ৪: কোথায় কিছু নেই"
              query={`-- ২. কে কখনো কিছু বুক করেননি
SELECT full_name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.customer_id);

-- ৩. কোন ট্যুরের Guide নেই
SELECT title FROM tours WHERE guide_id IS NULL;

-- ৪. কোন জায়গায় একটাও ট্যুর নেই
SELECT name FROM destinations d
WHERE NOT EXISTS (SELECT 1 FROM tours t WHERE t.destination_id = d.destination_id);`}
              caption="তিনটা উত্তর: Imran Kabir, Ratargul Swamp Boat Day আর Kuakata। তিনটাই Sample Database এ ইচ্ছা করে রাখা ফাঁক। বাস্তবের Data তে এমন ফাঁক সবসময় থাকে, আর এগুলো না জানলে Report চুপচাপ ভুল হয়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="প্রশ্ন ৫: কোথায় কিছু গোলমাল"
              query={`SELECT title, is_active FROM tours WHERE is_active = false;

SELECT method, status, count(*)
FROM payments
WHERE status <> 'paid'
GROUP BY method, status;`}
              caption="একটা ট্যুর বন্ধ, Saint Martin Luxury Stay। আর দুটো Payment ঠিকমতো হয়নি, দুটোই bKash এ: একটা failed, একটা refunded। টাকার Table থেকে এগুলো মুছে ফেলা হয় না, শুধু অবস্থা বদলে রাখা হয়, কেন তা Module 10 এ।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই পাঁচটা প্রশ্ন একটা অভ্যাস",
          content: (
            <ContentParagraph>
              যেকোনো নতুন Database এ, চাকরির প্রথম দিনে বা একটা নতুন Feature এর আগে,
              এই ধরনের প্রশ্ন দিয়ে শুরু করুন: কোন Table এ কত Row, কোন অবস্থায় কতগুলো,
              কোথায় খালি, কোথায় অদ্ভুত। দশ মিনিটে Data সম্পর্কে যা জানবেন, তা পরে
              ঘণ্টার পর ঘণ্টা Debug করা বাঁচাবে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "project-example",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর টিম Data কীভাবে Load করে</SectionTitle>,
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
                Theory এর রিয়ার কথায় ফিরি। Island Tours এ নতুন কেউ যোগ দিলে তিনি
                কখনো আসল Customer দের Data পান না। তাঁকে দেওয়া হয় ঠিক এরকম একটা
                ফাইল, যেটার নাম বাস্তবে প্রায়ই <strong>Seed File</strong>, মানে বীজ।
                বীজ থেকে যেমন একটা পুরো গাছ গজায়, এই ছোট ফাইল থেকে একটা পুরো চলনসই
                Database দাঁড়িয়ে যায়। নাম, Email, ফোন সব বানানো, কিন্তু Data এর আকার
                আর সম্পর্কগুলো আসলের মতো, তাই সব Feature এটা দিয়েই পরীক্ষা করা যায়।
              </ContentParagraph>
              <ContentParagraph>
                কেন আসল Data দেওয়া হয় না? কারণ আসল Data তে আছে হাজার মানুষের ফোন নম্বর,
                ঠিকানা আর টাকার লেনদেন। একটা Laptop হারালে বা ভুল করে কোনো Public
                Repository তে Upload হয়ে গেলে সেটা সবার হাতে চলে যায়। তাই নিয়ম পরিষ্কার:
                Developer এর মেশিনে Seed Data, আর Production এর Data থাকে শুধু
                Production এ। কখনো আসলের কাছাকাছি Data লাগলে Production থেকে একটা
                Copy নিয়ে তার ব্যক্তিগত তথ্য বদলে দেওয়া হয়। Backup নেওয়ার সেই কাজ, pg_dump,
                শিখবেন Module 18 এ।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা জিনিস। Island Tours এর Seed File এ Table বানানোর অংশটা বাস্তবে
                আলাদা থাকে, সেগুলোকে বলে Migration: Database এর কাঠামো ধাপে ধাপে বদলানোর
                ছোট ছোট Script, যেগুলো Code এর সাথে Git এ থাকে। আর Seed File শুধু Data
                ঢোকায়। এই ট্র্যাকের ফাইলে দুটো একসাথে, কারণ শুরুতে সেটাই সহজ।
                Migration এর পুরো গল্প Module 17 এ।
              </ContentParagraph>
              <ContentParagraph>
                এবার আপনার নিজের my-tours এর পালা। আপনার Practice এর জন্য একটা আলাদা
                Database বানান, নাম my_tours, আর সেখানেও একই ফাইল Load করুন। এখন আপনার
                এক Server এ দুটো Database, ঠিক যেমন আগের লেসনে দেখেছেন। island_tours
                থাকবে পরিষ্কার, প্রতিটা লেসনের উদাহরণের সাথে মেলানোর জন্য। আর my_tours এ
                যা খুশি করবেন, নিজের Table বানাবেন, Data বদলাবেন, ভাঙবেন। গোলমাল হয়ে গেলে
                শুধু my_tours এ ফাইলটা আবার চালাবেন।
              </ContentParagraph>
            </>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal: নিজের Practice এর Database",
          code: `createdb my_tours
psql -v ON_ERROR_STOP=1 --single-transaction -d my_tours -f island-tours.sql

psql -l     # এখন তালিকায় island_tours আর my_tours, দুটোই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Seed Data",
          content: (
            <ContentParagraph>
              Seed Data মানে একটা খালি Database কে কাজের উপযোগী করে তোলার জন্য আগে থেকে
              তৈরি করা Data। Test, Demo আর নতুন Developer এর মেশিনের জন্য। নিয়ম একটাই,
              এর ভেতরে কখনো সত্যিকারের মানুষের তথ্য থাকবে না। island-tours.sql এর তৃতীয়
              লাইন ঠিক সেই কথাটাই বলে।
            </ContentParagraph>
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------- */
    {
      id: "step-by-step",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>খালি Server থেকে প্রথম উত্তর পর্যন্ত, পুরোটা একবারে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো লেসনটা আটটা ধাপে। পরে কোনো নতুন মেশিনে, নতুন প্রজেক্টে বা একজন
              বন্ধুকে সাহায্য করতে গিয়ে এই তালিকাটাই মেনে চলবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Server আর psql যাচাই",
              description:
                "pg_isready এ accepting connections, psql --version এ একটা নম্বর, আর psql -d postgres -c \"SELECT current_user;\" এ নিজের Role এর নাম। তিনটা না মিললে সামনে এগোবেন না।",
            },
            {
              title: "ফাইল নামানো আর দেখা",
              description:
                "Sample Database পাতা থেকে island-tours.sql নামান, Terminal এ Downloads ফোল্ডারে যান, ls দিয়ে দেখুন আছে কিনা, head দিয়ে প্রথম লাইনগুলো পড়ুন।",
            },
            {
              title: "ফাইলের ভেতরটা পড়া",
              description:
                "একটা Editor এ খুলে চারটা অংশ চিনুন: মন্তব্য, DROP, আটটা CREATE TABLE, আটটা INSERT। DROP টা কোন Database এ চলবে, সেটা আপনিই ঠিক করবেন।",
            },
            {
              title: "খালি Database বানানো",
              description:
                "createdb island_tours, অথবা psql এর ভেতরে CREATE DATABASE island_tours;। psql -l এ নামটা দেখুন।",
            },
            {
              title: "নিরাপদভাবে Load",
              description:
                "psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f island-tours.sql। তারপর echo $? এ 0 দেখুন। প্রথমবার আটটা NOTICE আসবেই, সেগুলো Error না।",
            },
            {
              title: "গুনে মেলানো",
              description:
                "psql -d island_tours, তারপর \\dt এ আটটা Table, আর গোনার Query তে 7, 5, 9, 15, 16, 24, 19, 10। একটা সংখ্যাও না মিললে প্রথমে দেখুন কোন Database এ আছেন।",
            },
            {
              title: "ঘড়ি মেলানো, দরকার হলে",
              description:
                "SHOW timezone; দেখুন। +00 দেখালে আর ঢাকার সময় চাইলে ALTER DATABASE island_tours SET timezone TO 'Asia/Dhaka';, তারপর নতুন করে Connect।",
            },
            {
              title: "প্রথম পাঁচটা প্রশ্ন",
              description:
                "See It Yourself এর Query গুলো নিজের psql এ চালান আর Query বক্সের উত্তরের সাথে মেলান। মিললে আপনার নিজের Server এখন এই ট্র্যাকের জন্য পুরোপুরি তৈরি।",
            },
          ],
        },
      ],
    },

    /* --------------------------------------------------------------------- */
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
                <strong>psql এর অফিসিয়াল Docs।</strong> <code>-f</code>,{" "}
                <code>--single-transaction</code>, <code>ON_ERROR_STOP</code> আর Exit
                Status, এই লেসনের প্রতিটা Flag এর মূল বর্ণনা এখানে। পাতাটা লম্বা, Ctrl+F
                দিয়ে Flag এর নাম খুঁজে পড়ুন।{" "}
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
                <strong>createdb।</strong> এই ছোট Program টা কী করে আর কোন কোন Option
                নেয়।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/app-createdb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/app-createdb.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Creating a Database।</strong> PostgreSQL এর Docs এর ছোট একটা
                অধ্যায়, CREATE DATABASE আর createdb কেন একই কাজ।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/manage-ag-createdb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  postgresql.org/docs/current/manage-ag-createdb.html
                </a>
              </ListItem>
              <ListItem>
                <strong>pgAdmin Query Tool।</strong> Open File, Execute script আর তাদের
                Shortcut এর অফিসিয়াল বর্ণনা।{" "}
                <a
                  href="https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  pgadmin.org/docs/pgadmin4/latest/query_tool.html
                </a>
              </ListItem>
              <ListItem>
                <strong>docker cp।</strong> Container এর ভেতরে আর বাইরে ফাইল কপি করার
                অফিসিয়াল Reference।{" "}
                <a
                  href="https://docs.docker.com/reference/cli/docker/container/cp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  docs.docker.com/reference/cli/docker/container/cp
                </a>
              </ListItem>
              <ListItem>
                <strong>MySQL: Executing SQL Statements from a Text File।</strong> MySQL
                এ ফাইল চালানোর দুই উপায়, &lt; চিহ্ন আর source, MySQL 8.4 এর Manual
                থেকে।{" "}
                <a
                  href="https://dev.mysql.com/doc/refman/8.4/en/mysql-batch-commands.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  dev.mysql.com/doc/refman/8.4/en/mysql-batch-commands.html
                </a>
              </ListItem>
              <ListItem>
                <strong>যে MySQL কোর্সটা পাশাপাশি দেখছেন।</strong> এই ভিডিও MySQL দিয়ে
                শেখায়। Island Tours এর MySQL ফাইলটা Load করা থাকলে ভিডিওর উদাহরণগুলো
                একই Data তে চালিয়ে দেখতে পারবেন।{" "}
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

    /* --------------------------------------------------------------------- */
    {
      id: "recap",
      subHeader: { index: "018", title: "Recap" },
      title: <SectionTitle>যা শিখলেন, আর এরপর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <>
              <ContentList>
                <ListItem>
                  Load মানে একটা SQL Script এর সব Statement উপর থেকে নিচে একটা
                  Database এর উপর চালানো। psql ফাইল পড়ে, Server শুধু SQL দেখে।
                </ListItem>
                <ListItem>
                  island-tours.sql এর চারটা অংশ: মন্তব্য, একটা DROP TABLE IF EXISTS,
                  আটটা CREATE TABLE, আটটা INSERT। ক্রমটা ঠিক করা Foreign Key দেখে:
                  যাকে দেখানো হয় সে আগে।
                </ListItem>
                <ListItem>
                  ফাইল Database বানায় না। আগে createdb island_tours, তারপর psql -d
                  island_tours -f island-tours.sql।
                </ListItem>
                <ListItem>
                  প্রথমবারের আটটা NOTICE Error না। INSERT 0 N এর N হলো ঢোকা Row এর সংখ্যা।
                  Output এ ERROR শব্দ না থাকলে আর গোনা সংখ্যা মিললে Load নিখুঁত।
                </ListItem>
                <ListItem>
                  timestamptz একটা মুহূর্ত রাখে, দেখানো হয় Connection এর ঘড়িতে। +00 আর +06
                  একই মুহূর্ত।
                </ListItem>
                <ListItem>
                  ফাইল আবার চালালেই Reset। নিজের কাজ রাখুন আলাদা Database এ, my_tours।
                </ListItem>
                <ListItem>
                  ON_ERROR_STOP ছাড়া psql Error পেরিয়ে চলতে থাকে আর শেষে 0 ফেরত দেয়।
                  নিরাপদ রূপ: -v ON_ERROR_STOP=1 --single-transaction, Exit Code 3 মানে
                  কিছুই বদলায়নি।
                </ListItem>
                <ListItem>
                  Docker এ Container আপনার ফাইল দেখে না: docker cp, অথবা docker exec -i
                  আর &lt;। Windows PowerShell এ &lt; চলে না। MySQL এ আলাদা ফাইল,
                  mysql ... island_tours &lt; island-tours.mysql.sql।
                </ListItem>
                <ListItem>
                  Error এর প্রথম শব্দ: psql: error মানে আপনার দিকে, FATAL মানে Connect
                  হয়নি, ERROR মানে একটা Statement ফেরত এসেছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন আপনার নিজের মেশিনে একটা পূর্ণ, চলনসই Database আছে, ঠিক Query বক্সের
                মতোই। এই মডিউলের শেষ লেসনে শিখবেন যেকোনো PostgreSQL Error কে টুকরো করে
                পড়া, Error Code দেখে কারণ বোঝা আর অফিসিয়াল Docs থেকে নিজে উত্তর খুঁজে
                নেওয়া। তারপর Module 03 থেকে শুরু হবে আসল কাজ, নিজের হাতে SELECT লেখা।
                পরের লেসন:{" "}
                <Link href="/sql/topic/errors-and-help" className={LINK}>
                  Reading Errors and Finding Help
                </Link>
                ।
              </ContentParagraph>
            </>
          ),
        },
      ],
    },
  ],

  summary: {
    headers: ["বিষয়", "এক লাইনে", "Command বা উদাহরণ"],
    rows: [
      ["SQL Script", "SQL Statement এ ভরা একটা লেখার ফাইল", "island-tours.sql"],
      ["Load", "Script এর সব Statement উপর থেকে নিচে চালানো", "psql -d island_tours -f island-tours.sql"],
      ["আগে Database", "ফাইল Table বানায়, Database না", "createdb island_tours"],
      ["ফাইলের ক্রম", "যে Table কে দেখানো হয়, সে আগে তৈরি হয়", "destinations, guides, তারপর tours"],
      ["IF EXISTS", "না থাকলে Error না দিয়ে NOTICE দিয়ে এগিয়ে যাওয়া", "প্রথম Load এর আটটা NOTICE"],
      ["INSERT 0 N", "N হলো ঢোকা Row এর সংখ্যা, প্রথম 0 উপেক্ষা করুন", "INSERT 0 24"],
      ["যাচাই", "Table এর তালিকা আর প্রতিটায় Row গোনা", "\\dt, আর 7, 5, 9, 15, 16, 24, 19, 10"],
      ["Structure দেখা", "Column, Type, নিয়ম আর সম্পর্ক এক জায়গায়", "\\d tours"],
      ["Time Zone", "মুহূর্ত একই, ঘড়ির লেখা আলাদা", "ALTER DATABASE island_tours SET timezone TO 'Asia/Dhaka'"],
      ["Reset", "ফাইল আবার চালানো, অথবা dropdb আর createdb", "নিজের কাজ my_tours এ"],
      ["নিরাপদ Load", "প্রথম Error এ থামা আর সব বাতিল করা", "-v ON_ERROR_STOP=1 --single-transaction"],
      ["Exit Code", "0 ঠিক, 1 psql এর সমস্যা, 2 Connection, 3 Script এ Error", "echo $?"],
      ["Docker", "Container আপনার ফাইল দেখে না", "docker cp, অথবা docker exec -i ... < file"],
      ["MySQL", "আলাদা ফাইল, আর < দিয়ে Load", "mysql -u root -p island_tours < island-tours.mysql.sql"],
    ],
  },

  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "psql -d island_tours -f island-tours.sql চালালে ফাইলটা কে পড়ে?",
        options: [
          {
            key: "A",
            text: "PostgreSQL Server, ফাইলের পথ দেখে নিজের Disk থেকে",
            isCorrect: false,
            explanation:
              "Server ফাইলের পথ কখনো দেখে না। সে শুধু SQL লেখাগুলো পায়, যেগুলো psql তাকে একটা একটা করে পাঠায়।",
          },
          {
            key: "B",
            text: "psql, আপনার নিজের কম্পিউটারে বসে",
            isCorrect: true,
            explanation:
              "ঠিক। psql ফাইল খোলে, পড়ে, আর প্রতিটা Statement Server এর কাছে পাঠায়। তাই ফাইল না পাওয়ার Error শুরু হয় psql: error দিয়ে।",
          },
          {
            key: "C",
            text: "island_tours Database নিজেই",
            isCorrect: false,
            explanation:
              "Database হলো Data এর সংগ্রহ, সে কোনো ফাইল পড়ে না। পড়ার কাজ psql এর।",
          },
          {
            key: "D",
            text: "Operating System এর Terminal",
            isCorrect: false,
            explanation:
              "Terminal শুধু Command টা psql কে দেয়। -f এর ফাইল খোলে psql নিজে। শুধু < চিহ্ন ব্যবহার করলে ফাইল খোলে Shell।",
          },
        ],
      },
      {
        id: 2,
        text: "প্রথমবার Load করার সময় আটটা লাইন আসে: NOTICE: table \"reviews\" does not exist, skipping। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Load ব্যর্থ হয়েছে, reviews Table তৈরি হয়নি",
            isCorrect: false,
            explanation:
              "NOTICE Error না। reviews Table টা কয়েক লাইন পরেই CREATE TABLE এ তৈরি হয়েছে।",
          },
          {
            key: "B",
            text: "DROP TABLE IF EXISTS মোছার মতো কিছু পায়নি, তাই জানিয়ে এগিয়ে গেছে",
            isCorrect: true,
            explanation:
              "ঠিক। নতুন Database এ কোনো Table থাকে না, তাই IF EXISTS Error না দিয়ে শুধু খবর দেয়। দ্বিতীয়বার Load করলে এই লাইনগুলো আর আসে না।",
          },
          {
            key: "C",
            text: "ফাইলটা ভুল Database এ চলছে",
            isCorrect: false,
            explanation:
              "ভুল Database এ চললেও প্রথমবার এই NOTICE আসত। এটা দিয়ে Database ঠিক কিনা বোঝা যায় না।",
          },
          {
            key: "D",
            text: "Server এর reviews Table পড়ার অনুমতি নেই",
            isCorrect: false,
            explanation:
              "অনুমতির সমস্যা হলে আসত ERROR: permission denied। এখানে Table টাই নেই, অনুমতির প্রশ্নই ওঠে না।",
          },
        ],
      },
      {
        id: 3,
        text: "Output এ INSERT 0 24 লেখা। 24 কী বোঝায়?",
        options: [
          {
            key: "A",
            text: "ফাইলের 24 নম্বর লাইন",
            isCorrect: false,
            explanation: "লাইন নম্বর আসে psql:island-tours.sql:5: এর মতো শুরুর অংশে, Command Tag এ না।",
          },
          {
            key: "B",
            text: "24টা Row ঢুকেছে, এখানে bookings Table এ",
            isCorrect: true,
            explanation:
              "ঠিক। দ্বিতীয় সংখ্যাটা ঢোকা Row এর সংখ্যা। bookings এ 24টা Booking, Sample Database পাতার সংখ্যার সাথে মেলে।",
          },
          {
            key: "C",
            text: "24 মিলিসেকেন্ড সময় লেগেছে",
            isCorrect: false,
            explanation: "psql সময় দেখায় শুধু \\timing চালু থাকলে, আলাদা লাইনে। Command Tag এ সময় থাকে না।",
          },
          {
            key: "D",
            text: "নতুন Row এর ID",
            isCorrect: false,
            explanation:
              "প্রথম সংখ্যাটা একসময় একটা পুরনো ধরনের ID এর জন্য ছিল, এখন সবসময় 0। দ্বিতীয়টা সংখ্যা, ID না।",
          },
        ],
      },
      {
        id: 4,
        text: "কেউ পুরো ফাইল না চালিয়ে শুধু INSERT এর অংশটা আবার চালালেন, কোনো Flag ছাড়া। কী হবে?",
        options: [
          {
            key: "A",
            text: "প্রথম Error এই থেমে যাবে, কিছুই বদলাবে না",
            isCorrect: false,
            explanation:
              "এটা হতো ON_ERROR_STOP চালু থাকলে। Flag ছাড়া psql Error পেরিয়ে চলতে থাকে।",
          },
          {
            key: "B",
            text: "UNIQUE নিয়ম থাকা Table এ Error, বাকিগুলোতে নকল Row, আর শেষে Exit Code 0",
            isCorrect: true,
            explanation:
              "ঠিক। destinations, customers আর reviews এ Error হয়, অথচ guides, tours, departures, bookings আর payments এ সব Row দ্বিতীয়বার ঢুকে যায়। Bookings হয়ে যায় 48।",
          },
          {
            key: "C",
            text: "PostgreSQL নিজে থেকে নকল Row চিনে বাদ দেবে",
            isCorrect: false,
            explanation:
              "PostgreSQL শুধু সেই নিয়মগুলো পাহারা দেয় যা Table এ বলা আছে। guides এ কোনো UNIQUE নিয়ম নেই, তাই হুবহু একই Guide আবার ঢোকা তার চোখে বৈধ।",
          },
          {
            key: "D",
            text: "সব Table আগে মুছে নতুন করে Row ঢুকবে",
            isCorrect: false,
            explanation:
              "মোছার কাজটা করে ফাইলের DROP অংশ, যেটা এখানে চালানোই হয়নি।",
          },
        ],
      },
      {
        id: 5,
        text: "তিন লাইনের একটা ফাইলের তৃতীয় লাইনে Error। কোন Command চালালে Database এ কোনো পরিবর্তনই থাকবে না?",
        options: [
          {
            key: "A",
            text: "psql -d island_tours -f my-additions.sql",
            isCorrect: false,
            explanation: "প্রথম দুটো লাইন ঢুকে যাবে, তৃতীয়টা হবে না, আর Exit Code 0।",
          },
          {
            key: "B",
            text: "psql -v ON_ERROR_STOP=1 -d island_tours -f my-additions.sql",
            isCorrect: false,
            explanation:
              "থামবে আর 3 ফেরত দেবে, কিন্তু প্রথম দুটো লাইন ততক্ষণে ঢুকে গেছে, Database অর্ধেক বদলানো।",
          },
          {
            key: "C",
            text: "psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f my-additions.sql",
            isCorrect: true,
            explanation:
              "ঠিক। পুরো ফাইল একটা Transaction এ চলে। Error হতেই psql ROLLBACK পাঠায়, প্রথম দুটো লাইনও বাতিল। হয় সবটা, নয়তো কিছুই না।",
          },
          {
            key: "D",
            text: "\\i my-additions.sql",
            isCorrect: false,
            explanation: "\\i হলো -f এর মতোই, কোনো বাড়তি সুরক্ষা ছাড়া। আগের দুটো লাইন থেকে যাবে।",
          },
        ],
      },
      {
        id: 6,
        text: "Docker এ চলা Server, নাম island-pg। কোন Command টা কাজ করবে না?",
        options: [
          {
            key: "A",
            text: "docker exec island-pg psql -U postgres -d island_tours -f ~/Downloads/island-tours.sql",
            isCorrect: true,
            explanation:
              "ঠিক, এটাই কাজ করবে না। psql চলছে Container এর ভেতরে, আর আপনার Downloads ফোল্ডার Container এর File System এ নেই।",
          },
          {
            key: "B",
            text: "আগে docker cp island-tours.sql island-pg:/tmp/island-tours.sql, তারপর -f /tmp/island-tours.sql",
            isCorrect: false,
            explanation: "এটা কাজ করে। ফাইলটা আগে Container এর ভেতরে চলে যায়, তারপর psql সেখানে পায়।",
          },
          {
            key: "C",
            text: "docker exec -i island-pg psql -U postgres -d island_tours < island-tours.sql",
            isCorrect: false,
            explanation:
              "এটাও কাজ করে, macOS আর Linux এর Shell এ। ফাইল পড়ে আপনার Shell, -i দিয়ে লেখাগুলো Container এর psql এর কাছে যায়।",
          },
          {
            key: "D",
            text: "docker exec island-pg createdb -U postgres island_tours",
            isCorrect: false,
            explanation: "এটা কাজ করে, কোনো ফাইলের দরকারই নেই। শুধু Database বানায়।",
          },
        ],
      },
      {
        id: 7,
        text: "Docker এর Server এ Booking 1 এর সময় দেখাচ্ছে 2025-12-20 04:15:00+00, অথচ Query বক্সে 10:15:00+06। কী হয়েছে?",
        options: [
          {
            key: "A",
            text: "Load এর সময় সময়টা ভুলভাবে ঢুকেছে",
            isCorrect: false,
            explanation: "দুটো একই মুহূর্ত। Data তে কোনো ভুল নেই।",
          },
          {
            key: "B",
            text: "দুই Connection এর Time Zone আলাদা, মুহূর্ত একই",
            isCorrect: true,
            explanation:
              "ঠিক। timestamptz একটা মুহূর্ত রাখে, দেখায় Connection এর ঘড়িতে। Docker এর Image চলে UTC তে, বক্স চলে ঢাকার ঘড়িতে।",
          },
          {
            key: "C",
            text: "Docker এর PostgreSQL পুরনো Version",
            isCorrect: false,
            explanation: "Version এর সাথে এর সম্পর্ক নেই। শুধু Time Zone এর সেটিং।",
          },
          {
            key: "D",
            text: "booked_at Column টা Time Zone রাখে না",
            isCorrect: false,
            explanation:
              "উল্টো। timestamptz রাখে বলেই একই মুহূর্ত দুই ঘড়িতে ঠিকঠাক দেখানো যায়। MySQL এর DATETIME রাখে না।",
          },
        ],
      },
      {
        id: 8,
        text: "MySQL এ mysql -u root -p < island-tours.mysql.sql চালিয়ে পেলেন ERROR 1046 (3D000): No database selected। সমাধান কী?",
        options: [
          {
            key: "A",
            text: "PostgreSQL এর ফাইলটা ব্যবহার করা",
            isCorrect: false,
            explanation: "PostgreSQL এর ফাইল MySQL এ CREATE TABLE এই আটকে যাবে। ফাইল ঠিকই আছে।",
          },
          {
            key: "B",
            text: "Command এ Database এর নাম দেওয়া: mysql -u root -p island_tours < island-tours.mysql.sql",
            isCorrect: true,
            explanation:
              "ঠিক। ফাইলে কোনো USE লাইন নেই, তাই কোন Database এ Table বানাবে সেটা Command থেকেই জানাতে হয়।",
          },
          {
            key: "C",
            text: "root এর বদলে অন্য User দিয়ে চালানো",
            isCorrect: false,
            explanation: "User এর সমস্যা হলে আসত Access denied। এখানে Database বলা হয়নি।",
          },
          {
            key: "D",
            text: "MySQL Server আবার চালু করা",
            isCorrect: false,
            explanation: "Server চলছে বলেই তো এই Error টা ফেরত দিতে পেরেছে।",
          },
        ],
      },
    ],
  },

  practicalLab: {
    title: "নিজের Server এ Island Tours, নিরাপদে আর যাচাই করে",
    subtitle: "নামানো থেকে প্রথম পাঁচটা উত্তর পর্যন্ত, আর ইচ্ছা করে একটা ভুল",
    stepName: "LAB",
    steps: [
      {
        title: "যাচাই আর ফাইল",
        description:
          "প্রথম কোডের তিনটা যাচাই চালান। তারপর Sample Database পাতা থেকে ফাইল নামিয়ে Downloads এ গিয়ে ls আর head দিয়ে দেখুন।",
      },
      {
        title: "Database বানিয়ে নিরাপদ Load",
        description:
          "দ্বিতীয় কোড আপনার মেশিন অনুযায়ী চালান। শেষে echo $? এ 0 দেখুন, আর Output এ ERROR শব্দটা খুঁজুন।",
      },
      {
        title: "গুনে মেলানো",
        description:
          "তৃতীয় কোডটা psql এ চালান। আটটা সংখ্যা Query বক্সের সাথে মেলান, আর \\d bookings এর Check constraints অংশটা পড়ুন।",
      },
      {
        title: "ইচ্ছা করে একটা অর্ধেক Load",
        description:
          "চতুর্থ কোডের ছোট ফাইলটা বানিয়ে প্রথমে Flag ছাড়া চালান, Guide আর ট্যুরের সংখ্যা দেখুন। তারপর ফাইল আবার Load করে Reset করুন, আর এবার নিরাপদ Flag দিয়ে চালিয়ে তফাতটা লিখুন।",
      },
      {
        title: "Docker বা MySQL, যেটা চালান",
        description:
          "পঞ্চম বা ষষ্ঠ কোড দিয়ে একই Data Docker এর Container এ বা MySQL এ তুলুন, আর বুকিংয়ের সংখ্যা 24 এসেছে কিনা দেখুন।",
      },
      {
        title: "প্রথম পাঁচটা প্রশ্ন, নিজের Server এ",
        description:
          "See It Yourself এর তিনটা বক্সের Query নিজের psql এ চালান। Query বক্সের উত্তরের সাথে মিললে এই লেসন সম্পূর্ণ।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-check-and-download.sh",
        language: "bash",
        code: `pg_isready                          # ... accepting connections
psql --version                      # psql (PostgreSQL) 18.x
psql -d postgres -c "SELECT current_user;"

cd ~/Downloads                      # Windows: cd $HOME\\Downloads
ls -l island-tours.sql              # 10352 Byte
head -n 5 island-tours.sql`,
      },
      {
        filename: "2-create-and-load.sh",
        language: "bash",
        code: `# macOS, আর Ubuntu যদি নিজের নামে Role থাকে
createdb island_tours
psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f island-tours.sql
echo $?                             # 0 হতে হবে

# Ubuntu, postgres Role দিয়ে
sudo -u postgres createdb island_tours
sudo -u postgres psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f - < island-tours.sql
# -f - মানে ফাইলের নামের বদলে Shell যা পাঠাচ্ছে সেটাই পড়া

# Windows PowerShell (Password চাইবে)
createdb -U postgres island_tours
psql -U postgres -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f island-tours.sql
echo $LASTEXITCODE                  # PowerShell এ Exit Code এভাবে দেখে`,
      },
      {
        filename: "3-verify.sql",
        language: "sql",
        code: `-- psql -d island_tours দিয়ে ঢুকে
SELECT current_database();          -- island_tours

\\dt

SELECT 'destinations' AS table_name, count(*) FROM destinations
UNION ALL SELECT 'guides', count(*) FROM guides
UNION ALL SELECT 'tours', count(*) FROM tours
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'departures', count(*) FROM departures
UNION ALL SELECT 'bookings', count(*) FROM bookings
UNION ALL SELECT 'payments', count(*) FROM payments
UNION ALL SELECT 'reviews', count(*) FROM reviews;
-- 7, 5, 9, 15, 16, 24, 19, 10

\\d bookings`,
      },
      {
        filename: "4-my-additions.sql",
        language: "sql",
        code: `-- এই তিন লাইন একটা ফাইলে রাখুন, তৃতীয় লাইনের Email ইচ্ছা করে পুরনো
INSERT INTO guides (full_name, phone, language, hired_on) VALUES ('Tania Sultana', '+8801000000206', 'English', '2026-10-01');
INSERT INTO tours (title, destination_id, guide_id, duration_days, price_bdt, max_seats) VALUES ('Kuakata Sunrise and Sunset', 7, 6, 2, 9000.00, 20);
INSERT INTO customers (full_name, email, city) VALUES ('Rahim Uddin', 'rahim.uddin@mail.example', 'Dhaka');

-- Flag ছাড়া:      psql -d island_tours -f 4-my-additions.sql
--                 guides 6, tours 10, Exit Code 0
-- Reset:          psql -d island_tours -f island-tours.sql
-- নিরাপদ Flag:    psql -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f 4-my-additions.sql
--                 guides 5, tours 9, Exit Code 3`,
      },
      {
        filename: "5-docker.sh",
        language: "bash",
        code: `docker exec island-pg createdb -U postgres island_tours
docker cp island-tours.sql island-pg:/tmp/island-tours.sql
docker exec island-pg psql -U postgres -v ON_ERROR_STOP=1 --single-transaction -d island_tours -f /tmp/island-tours.sql
docker exec island-pg psql -U postgres -d island_tours -c "SELECT count(*) FROM bookings;"
# count: 24`,
      },
      {
        filename: "6-mysql.sh",
        language: "bash",
        code: `mysql -u root -p -e "CREATE DATABASE island_tours"
mysql -u root -p island_tours < island-tours.mysql.sql
mysql -u root -p island_tours -e "SHOW TABLES; SELECT COUNT(*) FROM bookings;"
# আটটা Table, আর COUNT(*) 24`,
      },
    ],
    tip: (
      <ContentParagraph>
        Lab এর চতুর্থ ধাপটা island_tours এর বদলে my_tours এ করলে আরও ভালো। তাহলে
        island_tours সবসময় পরিষ্কার থাকবে, আর ভুল করার জায়গা হবে my_tours।
      </ContentParagraph>
    ),
  },

  assignment: {
    title: "Mini Project: নিজের Seed File, নিরাপদে Load করা",
    time: "৬০ থেকে ৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>দুই Database, এক Server:</strong> island_tours আর my_tours, দুটোতেই
        Island Tours ফাইলটা নিরাপদ Flag দিয়ে Load করুন। দুটো Database এই গোনার
        Query চালিয়ে আটটা সংখ্যা মেলান, আর psql -l এর Output রেখে দিন।
      </span>,
      <span key="2">
        <strong>ফাইলের ক্রম ভেঙে দেখুন:</strong> island-tours.sql এর একটা Copy
        বানান, নাম broken-order.sql। তার ভেতরে tours এর CREATE TABLE টা কেটে
        destinations এর CREATE TABLE এর আগে বসান। my_tours এ নিরাপদ Flag দিয়ে চালান।
        কোন Error এল, কোন লাইনে, আর Exit Code কত, লিখুন। তারপর ব্যাখ্যা করুন কেন।
      </span>,
      <span key="3">
        <strong>নিজের ছোট Seed File:</strong> my-seed.sql নামে একটা ফাইল লিখুন,
        যেটা Kuakata তে একজন নতুন Guide আর তাঁকে দিয়ে দুটো নতুন ট্যুর যোগ করে।
        Lab এর তিন লাইনের ফাইলটা দেখে লিখতে পারেন। my_tours এ নিরাপদ Flag দিয়ে চালান,
        তারপর See It Yourself এর চতুর্থ প্রশ্নটা আবার চালিয়ে দেখান যে Kuakata আর
        ফাঁকা নেই।
      </span>,
      <span key="4">
        <strong>ঘড়ির পরীক্ষা:</strong> নিজের Server এ SHOW timezone; চালান। তারপর
        Booking 1 এর booked_at দুইবার দেখুন, একবার আপনার Server এর ঘড়িতে, একবার SET
        timezone = &apos;UTC&apos; করে। দুটো লেখা আর তাদের পার্থক্যের কারণ এক লাইনে লিখুন।
      </span>,
      <span key="5">
        <strong>একজন বন্ধুকে শেখান:</strong> একজন বন্ধুর জন্য ছয় লাইনের একটা
        নির্দেশনা লিখুন, যেটা মেনে তিনি একদম খালি PostgreSQL এ Island Tours Load করে
        যাচাই করতে পারবেন। প্রতিটা লাইনে একটা Command আর কেন। তারপর জিজ্ঞেস করুন,
        ON_ERROR_STOP কেন দরকার, আর তিনি নিজের ভাষায় বোঝাতে পারেন কিনা দেখুন।
      </span>,
    ],
    deliverables: [
      <span key="1">psql -l এর Output, আর দুই Database এর আটটা করে সংখ্যা</span>,
      <span key="2">broken-order.sql এর Error, লাইন নম্বর, Exit Code আর ব্যাখ্যা</span>,
      <span key="3">my-seed.sql ফাইল, আর Kuakata এখন যে ফাঁকা নেই তার প্রমাণ</span>,
      <span key="4">দুই ঘড়ির দুটো লেখা আর এক লাইনের কারণ</span>,
      <span key="5">বন্ধুর জন্য ছয় লাইনের নির্দেশনা</span>,
    ],
  },
};
