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
  ConnectionStepLab,
  InjectionLab,
  PoolLab,
} from "../../../components/course/topics/sql-basics/conn-animations";
import {
  ConnectionStringDiagram,
  DirectVsApiSplit,
  MessageLadderDiagram,
  QueryPipelineDiagram,
  ThreeTiersDiagram,
} from "../../../components/course/topics/sql-basics/conn-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const appDatabaseConversationContent: TopicData = {
  id: "app-database-conversation",
  introduction: {
    badge: "MODULE 01 · LESSON 06",
    title: <SectionTitle>App আর Database এর কথোপকথন</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          ঢাকায় বসে Imran Kabir ফোনে Island Tours খুললেন। Account খুলেছেন মাত্র
          কয়েকদিন আগে, এখনো একটাও ট্যুর বুক করেননি। আজ তিনি বেছে নিলেন Saint
          Martin Island Escape, ২০ নভেম্বরের তারিখ, দুইটা সিট। বুক করুন বোতামে
          চাপ দিলেন, আর এক সেকেন্ডের কম সময়ে পর্দায় ভেসে উঠল, আপনার বুকিং নম্বর
          ২৫।
        </ContentParagraph>
        <ContentParagraph>
          ওই এক সেকেন্ডে পর্দার আড়ালে একটা পুরো কথোপকথন হয়ে গেছে। ফোন একটা
          অনুরোধ পাঠিয়েছে Island Tours এর API কে। API সেই অনুরোধ পড়ে PostgreSQL এর
          সাথে কথা বলেছে: কয়েক লাইন SQL পাঠিয়েছে, জেনেছে সিট খালি আছে কিনা, নতুন
          বুকিংটা লিখেছে, আর ফেরত পেয়েছে নতুন বুকিংয়ের নম্বর। তারপর সেই নম্বর ফোনে
          ফেরত গেছে।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি জেনেছেন Database কী, DBMS কী, Data কীভাবে Table এ
          সাজানো থাকে, আর SQL কোন ভাষা। কিন্তু একটা প্রশ্ন এখনো বাকি। SQL টা লেখে
          কে, কোন রাস্তা দিয়ে Database পর্যন্ত যায়, আর উত্তরটা কোন চেহারায় ফেরত
          আসে? এই লেসন ঠিক সেই রাস্তাটার গল্প। শেষে আপনি জানবেন এই কথোপকথনে কারা
          থাকে, কেন Browser কখনো সরাসরি Database এর সাথে কথা বলে না, Connection
          String এর প্রতিটা টুকরো কী বোঝায়, একটা Connection খুলতে কী কী ঘটে,
          Server এর ভেতরে একটা Query কোন চার ধাপ পার হয়, উত্তর কীভাবে ফেরে, আর কেন
          ভালো App কখনো ব্যবহারকারীর লেখা SQL এর ভেতরে জোড়া দেয় না।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "আপনার Code কখনো Database এর ভেতরে ঢোকে না। সে শুধু একটা চিঠি পাঠায়, তাতে লেখা থাকে কী চাই। চিঠির ভাষা SQL, ডাকপিয়ন Driver, আর রাস্তা একটা Connection।",
      author: "App আর Database",
      role: "Lesson 06",
    },
  },
  sections: [
    /* --------------------------------------------------------------- 01 */
    {
      id: "theory",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>এক সেকেন্ডের ভেতরের একটা কথোপকথন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা কথা আগে পরিষ্কার করে নিই। Database নিজে থেকে কিছু করে না। সে
                একটা Program, যে চুপচাপ বসে অপেক্ষা করে কেউ এসে কিছু জিজ্ঞেস করবে।
                কেউ না জিজ্ঞেস করলে সে সারাদিন একটা অক্ষরও পাঠায় না। Imran এর
                বুকিং হয়েছে কারণ কেউ একজন গিয়ে Database কে জিজ্ঞেস করেছে আর লিখতে
                বলেছে। সেই কেউ একজন হলো Island Tours এর API, মানে Server এ চলা
                একটা Program।
              </ContentParagraph>
              <ContentParagraph>
                এই জিজ্ঞেস করার পুরো প্রক্রিয়াটাকে আমরা এই লেসনে বলব কথোপকথন। শব্দটা
                ইচ্ছা করে বেছে নেওয়া। দুইজন মানুষ কথা বললে যা যা লাগে, এখানেও ঠিক
                তাই লাগে। কার সাথে কথা হবে সেটা জানতে হয়, তার কাছে পৌঁছানোর রাস্তা
                লাগে, নিজের পরিচয় দিতে হয়, একটা ভাষা লাগে যেটা দুইজনেই বোঝে, আর
                উত্তরটা শুনে বুঝতে হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কার সাথে:</strong> কোন মেশিনে কোন Database Server, তার
                  ঠিকানা আর দরজা। এর জন্য আছে Connection String, যা আপনি এই লেসনে
                  টুকরো টুকরো করে পড়বেন।
                </ListItem>
                <ListItem>
                  <strong>রাস্তা:</strong> একটা TCP Connection। DevOps ট্র্যাকে যে
                  Handshake দেখেছেন, এখানেও প্রথমে সেটাই হয়।
                </ListItem>
                <ListItem>
                  <strong>পরিচয়:</strong> কোন User হিসেবে ঢুকছি, আর তার প্রমাণ।
                </ListItem>
                <ListItem>
                  <strong>ভাষা:</strong> প্রশ্নটা লেখা হয় SQL এ, যা আগের লেসনে
                  দেখেছেন। আর সেই প্রশ্ন তারের উপর দিয়ে নেওয়ার জন্য Database এর
                  নিজস্ব একটা নিয়মকানুন আছে, যার নাম Protocol।
                </ListItem>
                <ListItem>
                  <strong>উত্তর বোঝা:</strong> Database Row আর Column ফেরত দেয়।
                  আপনার Program এর হাতে সেগুলো পৌঁছায় একটা Array হিসেবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে আপনি নতুন কোনো SQL শিখবেন না। SELECT লেখা শুরু হবে Module
                03 থেকে। এখানে আপনি শিখবেন SQL এর চারপাশের জগৎটা: কে লেখে, কোথা দিয়ে
                যায়, কী দামে যায়, আর কোথায় কী ভুল হতে পারে। এটা জানা থাকলে পরে
                যখন আপনার App বলবে Connection refused বা too many clients, আপনি
                ঘাবড়াবেন না, কারণ আপনি জানবেন কথোপকথনের ঠিক কোন জায়গাটা ভেঙেছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের মূল কথা এক লাইনে",
          content: (
            <ContentParagraph>
              App একটা Connection খোলে, পরিচয় দেয়, SQL টা একটা সাধারণ লেখা হিসেবে
              পাঠায়, আর Database সেটা নিজের ভেতরে পড়ে, বুঝে, চালিয়ে, Row গুলো ফেরত
              দেয়। বাকি সবকিছু, Pool, Parameter, ORM, এই একটা বাক্যকে দ্রুত আর
              নিরাপদ করার উপায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 02 */
    {
      id: "three-players",
      subHeader: { index: "002", title: "Three Players" },
      title: <SectionTitle>তিন পক্ষ: Browser, API আর Database</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রেস্টুরেন্টের কথা ভাবুন। অতিথি টেবিলে বসে মেনু দেখেন আর ওয়েটারকে
                বলেন কী খাবেন। ওয়েটার অর্ডারটা রান্নাঘরের ভাষায় লিখে রান্নাঘরে দেন।
                রান্নাঘর রান্না করে প্লেট ওয়েটারের হাতে দেয়, আর ওয়েটার সেটা টেবিলে আনেন।
                অতিথি কখনো রান্নাঘরে ঢোকেন না, আর রাঁধুনি কখনো অতিথির টেবিলে এসে কথা
                বলেন না। দুইজনের মাঝে সবসময় ওয়েটার।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর প্রতিটা বুকিং ঠিক এই তিন পক্ষে চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Browser, মানে অতিথি:</strong> পর্যটকের ফোন বা ল্যাপটপে চলা
                  Website। সে ট্যুরের তালিকা দেখায়, ফর্ম নেয়, বোতাম চাপলে অনুরোধ
                  পাঠায়। সে শুধু HTTPS বোঝে, মানে Web এর ভাষা।
                </ListItem>
                <ListItem>
                  <strong>API, মানে ওয়েটার:</strong> Server এ চলা Island Tours এর
                  আসল Program, যা লেখা NestJS এ। API এর পুরো নাম Application
                  Programming Interface। নামটা ভারী শোনালেও মানে সহজ: একটা Program
                  বাইরের অন্যদের জন্য যে দরজাগুলো খোলা রাখে, যেমন{" "}
                  <code>POST /bookings</code>, মানে নতুন একটা বুকিং তৈরির অনুরোধ
                  জানানোর দরজা। Browser এই দরজায় টোকা দেয়, আর API ঠিক করে কী হবে।
                </ListItem>
                <ListItem>
                  <strong>Database, মানে রান্নাঘর:</strong> PostgreSQL, যেখানে
                  Tour, Customer, Booking আর Payment এর সব Data থাকে। সে শুধু SQL
                  বোঝে, আর শুধু API এর সাথে কথা বলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ThreeTiersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দুইটা শব্দ পাকা করে নিই, কারণ এগুলো পুরো ট্র্যাকে বারবার আসবে।{" "}
                <strong>Client</strong> মানে যে চায়, আর <strong>Server</strong>{" "}
                মানে যে দেয়। এটা কোনো মেশিনের নাম নয়, একটা ভূমিকার নাম। একই Program
                একই সময়ে দুটো ভূমিকাই নিতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                ছবির মাঝের API কে দেখুন। Browser এর চোখে সে Server, কারণ Browser তার
                কাছে চায় আর সে দেয়। কিন্তু Database এর চোখে সেই একই API একজন
                Client, কারণ এবার সে নিজে Database এর কাছে চাইছে। ওয়েটারও তো তাই:
                অতিথির কাছে তিনি সেবা দেন, রান্নাঘরের কাছে তিনি অর্ডার নিয়ে যান।
              </ContentParagraph>
              <ContentParagraph>
                তাই এই ট্র্যাকে যখন বলা হবে Database Client, তার মানে যেকোনো Program
                যে Database এর কাছে Query পাঠায়। আপনার Node.js App একটা Database
                Client, Module 02 তে যে psql চালাবেন সেটাও একটা Database Client, আর
                pgAdmin এর মতো মাউস দিয়ে চালানো Tool গুলোও তাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এই নকশার একটা নাম আছে",
          content: (
            <ContentParagraph>
              Browser, API আর Database, এই তিন স্তরের নকশাকে বলে Three-tier
              Architecture। Job Interview বা System Design এর আলোচনায় শব্দটা প্রায়ই
              শুনবেন। প্রায় সব Web App এর কঙ্কাল এটাই, বাকি সবকিছু, যেমন Cache,
              Queue বা CDN, এই কঙ্কালের উপর পরে বসানো হয়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 03 */
    {
      id: "why-not-direct",
      subHeader: { index: "003", title: "Why Not Direct" },
      title: <SectionTitle>Browser কেন সরাসরি Database এ যায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা খুব স্বাভাবিক। মাঝখানে API রেখে একটা বাড়তি ধাপ কেন? Browser
                নিজেই যদি PostgreSQL এর সাথে কথা বলত, তাহলে তো সময় বাঁচত। কারণ পাঁচটা,
                আর পাঁচটাই এত গুরুতর যে কোনো একটাই যথেষ্ট ছিল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Password সবার হাতে চলে যেত।</strong> Database এ ঢুকতে
                  User আর Password লাগে। Browser এ যে Code চলে, সেটা আপনার Server
                  থেকে প্রত্যেক দর্শকের কম্পিউটারে নেমে যায়। যে কেউ Browser এর
                  DevTools খুলে সেই Code পড়তে পারেন। মানে Password টা হাজার মানুষের
                  হাতে।
                </ListItem>
                <ListItem>
                  <strong>যে কেউ যেকোনো SQL চালাতে পারতেন।</strong> Password হাতে
                  পেলে কেউ আর আপনার বানানো বোতামের অপেক্ষা করবেন না। তিনি নিজের
                  লেখা SQL পাঠাবেন, অন্যের ফোন নম্বর পড়বেন, নিজের বুকিংয়ের দাম শূন্য
                  করে দেবেন, অথবা পুরো একটা Table মুছে দেবেন।
                </ListItem>
                <ListItem>
                  <strong>নিয়ম পাহারা দেওয়ার কেউ থাকত না।</strong> সিট খালি না
                  থাকলে বুকিং হবে না, দাম Server ঠিক করবে, একজন অন্যের বুকিং বাতিল
                  করতে পারবেন না। এই নিয়মগুলো এমন জায়গায় থাকতে হয় যেটা ব্যবহারকারী
                  বদলাতে পারেন না। Browser এর Code ব্যবহারকারীর নিজের মেশিনে চলে, তিনি
                  চাইলে সেটা বদলাতে পারেন।
                </ListItem>
                <ListItem>
                  <strong>Database এর দরজা Internet এ খোলা রাখতে হতো।</strong>{" "}
                  ভালো নকশায় Database এর Port টা বাইরে থেকে দেখাই যায় না, শুধু API এর
                  মেশিন সেখানে পৌঁছাতে পারে। দরজা খোলা মানেই সারা পৃথিবীর Bot সেখানে
                  Password আন্দাজ করার চেষ্টা শুরু করবে।
                </ListItem>
                <ListItem>
                  <strong>Browser আসলে এই ভাষাই বলতে পারে না।</strong> PostgreSQL
                  এর সাথে কথা বলার নিজস্ব Protocol আছে, যা নিচে দেখবেন। Browser
                  নিরাপত্তার কারণে যেকোনো Server এর সাথে যেকোনো Protocol এ কথা বলার
                  অনুমতিই দেয় না। সে HTTP আর WebSocket এর মতো Web এর নিজস্ব ভাষা বলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <DirectVsApiSplit /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Frontend এর সব Code সবার",
          content: (
            <ContentParagraph>
              Next.js এ যে Environment Variable এর নাম NEXT_PUBLIC_ দিয়ে শুরু হয়,
              সেটার মান Build এর সময় Browser এর Code এর ভেতরে বসে যায়। তাই
              Database এর ঠিকানা বা Password কখনো এমন নামে রাখবেন না। নিয়মটা সব
              Framework এ এক: যা Browser এ পৌঁছায়, তা গোপন নয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তাহলে Supabase বা Firebase কীভাবে Browser থেকে চলে?",
          content: (
            <ContentParagraph>
              ওই সব Service এও Browser সরাসরি Database এর Protocol এ কথা বলে না।
              মাঝে তাদের নিজেদের একটা HTTP API থাকে, যেমন Supabase এর সামনে PostgREST
              নামে একটা Program। আর কোন ব্যবহারকারী কোন Row দেখতে পারবেন, সেই নিয়ম
              বসানো থাকে Database এর ভেতরেই, PostgreSQL এর ক্ষেত্রে যার নাম Row-Level
              Security। মানে ওয়েটারটা আছে, শুধু আপনাকে লিখতে হয় না। এটা আপনি Module
              16 তে বিস্তারিত দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 04 */
    {
      id: "client-server",
      subHeader: { index: "004", title: "Server and Driver" },
      title: <SectionTitle>Database Server একটা Program, আর তার দরজা একটা Port</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০২ তে দেখেছেন, PostgreSQL একটা Program। যখন সে চলে, Operating
                System এর চোখে সে একটা Process, ঠিক আপনার Browser বা Music Player এর
                মতো। শুধু তার কাজ আলাদা: সে একটা নির্দিষ্ট Port এ কান পেতে বসে থাকে,
                কেউ কথা বলতে আসে কিনা।
              </ContentParagraph>
              <ContentParagraph>
                Port কী, সেটা DevOps ট্র্যাকের{" "}
                <Link
                  href="/devops/topic/port-and-socket"
                  className="text-primary underline underline-offset-4"
                >
                  Port আর Socket লেসনে
                </Link>{" "}
                বিস্তারিত আছে। এখানে এটুকু মনে রাখলেই চলবে: একটা মেশিনের IP Address
                যদি একটা বাড়ির ঠিকানা হয়, Port হলো সেই বাড়ির নির্দিষ্ট একটা দরজার
                নম্বর। একই মেশিনে অনেক Program চলে, প্রত্যেকে নিজের দরজায় বসে।
                PostgreSQL এর চেনা দরজা 5432, MySQL এর 3306। চেনা মানে সবাই এটাই ধরে
                নেয়, বদলানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                অন্য পাশে আছে Client, যে কথা বলতে আসে। কিন্তু আপনার Node.js Program
                তো নিজে থেকে PostgreSQL এর Protocol জানে না। তার জন্য লাগে একজন
                দোভাষী, একটা Library, যাকে বলে <strong>Driver</strong>। Driver
                আপনার Program এর ভেতরে বসে থাকে। আপনি Driver এর একটা Function ডেকে
                তার হাতে SQL টা দেন। Driver সেটা ঠিক নিয়মে মুড়িয়ে তারে তোলে, আর ফেরত
                আসা উত্তর খুলে আপনার Program এর বোঝার মতো করে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ভাষা বা Platform", "PostgreSQL এর Driver", "MySQL এর Driver"],
          rows: [
            ["Node.js", "pg (node-postgres)", "mysql2"],
            ["Python", "psycopg", "mysqlclient, PyMySQL"],
            ["Java", "PostgreSQL JDBC Driver", "MySQL Connector/J"],
            ["Command Line", "psql", "mysql"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলটা দেখে একটা জিনিস খেয়াল করুন। প্রতিটা Database এর জন্য আলাদা
                Driver লাগে। কারণ SQL ভাষাটা অনেকটা এক হলেও, সেই SQL তারের উপর দিয়ে
                নেওয়ার নিয়ম, মানে Protocol, প্রতিটা Database এর নিজস্ব। PostgreSQL এর
                Driver দিয়ে MySQL এর সাথে কথা বলা যায় না, ঠিক যেমন বাংলা জানা দোভাষী
                দিয়ে জাপানি অতিথির সাথে কথা চলে না।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা কথা। একটা PostgreSQL Server এর ভেতরে একসাথে অনেকগুলো আলাদা
                Database থাকতে পারে। একই Server এ island_tours থাকতে পারে, পাশে আরেক
                প্রজেক্টের Database ও থাকতে পারে। Connect করার সময়ই আপনাকে বলে দিতে
                হয় কোনটা চান। Server আর তার ভেতরের Database গুলোর এই ঘর আর কামরার
                সম্পর্ক Module 02 তে খুঁটিয়ে দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              পুরো ছবিটা একই, শুধু নামগুলো আলাদা। MySQL Server বসে Port 3306 এ,
              Node.js এ তার জনপ্রিয় Driver mysql2, আর Command Line Client এর নাম
              mysql। যে ভিডিও বা কোর্স MySQL দিয়ে শেখায়, সেখানে MySQL Workbench নামে
              একটা মাউস চালানো Client ও দেখবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 05 */
    {
      id: "connection-string",
      subHeader: { index: "005", title: "Connection String" },
      title: <SectionTitle>Connection String: এক লাইনে পুরো ঠিকানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চিঠি পাঠাতে খামের উপর লিখতে হয় কার কাছে, কোন বাড়ি, কোন রাস্তা, কোন
                শহর। Driver কে Database এর কাছে পাঠাতেও ঠিক এমন একটা ঠিকানা দিতে
                হয়। সবচেয়ে চলতি উপায় হলো সবকিছু এক লাইনে লেখা, যাকে বলে{" "}
                <strong>Connection String</strong>। দেখতে একটা Website এর ঠিকানার
                মতো, কারণ এটা আসলে URI নামের সেই একই নিয়মে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectionStringDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Scheme:</strong> শুরুর <code>postgres://</code> বলে
                  দেয় এটা কোন ধরনের Database এর ঠিকানা। PostgreSQL এ{" "}
                  <code>postgresql://</code> লিখলেও চলে, দুটো একই।
                </ListItem>
                <ListItem>
                  <strong>User:</strong> কোন নামে ঢুকবেন। এখানে island_api, মানে
                  App এর জন্য আলাদা করে বানানো একজন User। কেন App এর নিজের User
                  থাকা উচিত আর সে কেন সবকিছুর মালিক হবে না, সেটা Module 16 এর গল্প।
                </ListItem>
                <ListItem>
                  <strong>Password:</strong> কোলনের পরের অংশ। ছবিতে CHANGE_ME লেখা,
                  কারণ আসল Password কোনো লেসনে, কোনো Code এ লেখা থাকে না।
                </ListItem>
                <ListItem>
                  <strong>Host:</strong> <code>@</code> চিহ্নের পরে, Server কোন মেশিনে।
                  নিজের কম্পিউটারে চললে এখানে থাকে localhost।
                </ListItem>
                <ListItem>
                  <strong>Port:</strong> কোন দরজায়। না লিখলে PostgreSQL এর Driver
                  ধরে নেয় 5432।
                </ListItem>
                <ListItem>
                  <strong>Database:</strong> শেষের স্ল্যাশের পরে, Server এর ভেতরের
                  কোন Database টা চান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুটো খুঁটিনাটি, যেগুলো না জানলে একদিন আধঘণ্টা নষ্ট হবে। প্রথমটা,
                Password এর ভেতরে যদি <code>@</code>, <code>:</code> বা{" "}
                <code>/</code> এর মতো চিহ্ন থাকে, Driver ভুল জায়গায় কেটে ফেলবে,
                কারণ এই চিহ্নগুলোর এই ঠিকানায় নিজস্ব মানে আছে। তখন চিহ্নটাকে
                Percent-encoding দিয়ে লিখতে হয়: <code>@</code> হয়ে যায়{" "}
                <code>%40</code>, <code>:</code> হয়ে যায় <code>%3A</code>।
                PostgreSQL এর Documentation এ এই নিয়মটা স্পষ্ট লেখা আছে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়টা, ঠিকানার শেষে প্রশ্নবোধক চিহ্ন দিয়ে বাড়তি নির্দেশ জুড়ে
                দেওয়া যায়, যেমন <code>?sslmode=require</code>, যার মানে Encrypt না
                করে কথা বলবে না। Cloud এর Database, যেমন Neon বা Supabase, আপনাকে যে
                Connection String দেয় তাতে প্রায়ই এমন কিছু লেখা থাকে। ওগুলো মুছবেন
                না।
              </ContentParagraph>
              <ContentParagraph>
                এবার সবচেয়ে জরুরি প্রশ্ন, এই লাইনটা থাকে কোথায়? উত্তর একটাই: একটা{" "}
                <strong>Environment Variable</strong> এ, সাধারণত যার নাম{" "}
                <code>DATABASE_URL</code>। Environment Variable হলো Operating System
                এর একটা ছোট খাতা, যেখানে একটা নামের পাশে একটা মান লেখা থাকে, আর
                Program চালু হওয়ার সময় সেটা পড়ে নেয়। Code এ লেখা থাকে শুধু নামটা,
                মানটা থাকে Server এর খাতায়। এতে একই Code নিজের ল্যাপটপে এক Database এ,
                আর Production এ আরেক Database এ চলে, Code এর একটা লাইনও না বদলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: ".env  (নিজের ল্যাপটপে, কখনো Git এ নয়)",
          code: `# নিজের কম্পিউটারের PostgreSQL, Module 02 তে বসাবেন
DATABASE_URL=postgres://island_api:CHANGE_ME@localhost:5432/island_tours`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: ".gitignore",
          code: `# .env এ গোপন মান থাকে, তাই এটা কখনো Commit হবে না
.env`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ভুল করে Git এ চলে গেলে",
          content: (
            <ContentParagraph>
              যদি কখনো আসল Password সহ Connection String Git এ Push হয়ে যায়, শুধু
              ফাইলটা মুছে আরেকটা Commit দিলে কাজ হবে না, কারণ পুরনো Commit এ সেটা
              থেকেই যায়। সঙ্গে সঙ্গে Database এর Password বদলে ফেলুন, তারপর নতুন
              Password টা শুধু Server এর Environment এ বসান। আগে Password বদল, পরে
              বাকি সব।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ",
          content: (
            <ContentParagraph>
              অনেক Tool, যেমন Prisma, MySQL এর জন্যও একই চেহারার ঠিকানা নেয়, শুধু
              Scheme আর Port আলাদা: mysql://island_api:CHANGE_ME@localhost:3306/island_tours।
              কাঠামো হুবহু এক, তাই একবার পড়তে শিখলে দুটোই পড়তে পারবেন।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 06 */
    {
      id: "opening",
      subHeader: { index: "006", title: "Opening a Connection" },
      title: <SectionTitle>Connection খোলা: প্রথম SQL এর আগে যা যা ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার Code এ এর জন্য লেখা থাকবে মাত্র এক লাইন,{" "}
                <code>await client.connect()</code>। কিন্তু এই এক লাইনের পেছনে
                বেশ কয়েকটা ধাপ পার হয়, আর প্রতিটা ধাপে App আর Server এর মধ্যে
                বার্তা আসা যাওয়া করে। একবার বার্তা গিয়ে উত্তর ফেরত আসাকে বলে একটা{" "}
                <strong>Round Trip</strong>। Server যত দূরে, প্রতিটা Round Trip তত
                লম্বা।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ ধাপগুলো একটা একটা করে দেখুন। প্রতিটা ধাপে খেয়াল করুন
                তারের উপর কী যাচ্ছে, আর ডান দিকের ঘরে SQL কি এখনো গেছে কিনা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ConnectionStepLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ধাপগুলোর মধ্যে দুটো জিনিস আলাদা করে মনে রাখার মতো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Password তারে যায় না।</strong> Password দিয়ে পরিচয়
                  যাচাই হলে আধুনিক PostgreSQL এর Default পদ্ধতির নাম SCRAM-SHA-256। এখানে
                  Client আর Server কয়েক দফা ধাঁধা আর উত্তর বিনিময় করে, আর সেই উত্তর
                  বানানো যায় শুধু আসল Password জানলে। কেউ মাঝপথে বার্তাগুলো চুরি করে
                  পড়লেও Password টা পাবেন না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Connection এর জন্য একটা আলাদা Process।</strong>{" "}
                  PostgreSQL এর Documentation এর ভাষায়, এটা একটা Process per User
                  নকশা। মূল Process, postmaster, শুধু দরজায় দাঁড়িয়ে থাকে। নতুন কেউ
                  এলে সে তার জন্য একটা নতুন Process জন্ম দেয়, যার নাম Backend
                  Process, আর সেই Connection এর বাকি সব কথা হয় ওই Process এর সাথে।
                  একশটা Connection মানে Server এ একশটা Process।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Connection একবার খুলে গেলে সেটা একটা <strong>Session</strong>, মানে
                একটানা চলা একটা আলাপ। যতক্ষণ বন্ধ না করছেন, একই Connection দিয়ে যত
                খুশি Query পাঠাতে পারেন, আর প্রতিবার আগের ধাপগুলো আর করতে হয় না। এই
                সহজ কথাটা থেকেই পরে Connection Pool এর ধারণা আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "DevOps ট্র্যাকের সাথে যোগসূত্র",
          content: (
            <ContentParagraph>
              দ্বিতীয় ধাপের TCP Handshake হুবহু সেটাই, যা DevOps ট্র্যাকের{" "}
              <Link
                href="/devops/topic/three-way-handshake"
                className="text-primary underline underline-offset-4"
              >
                Three-way Handshake লেসনে
              </Link>{" "}
              দেখেছেন, শুধু Port 443 এর বদলে 5432। Database এর সাথে কথাও শেষ পর্যন্ত
              একটা সাধারণ TCP Connection এর উপর দিয়েই চলে। তাই Network এর সব সমস্যা,
              যেমন Firewall এ আটকে যাওয়া বা লম্বা Round Trip, Database এর কথোপকথনেও
              হুবহু ঘটে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 07 */
    {
      id: "query-journey",
      subHeader: { index: "007", title: "Inside the Server" },
      title: <SectionTitle>Server এর ভেতরে একটা Query এর চার ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Connection তৈরি। এবার App একটা Query পাঠায়। একটা জিনিস শুনে প্রথমে
                অবাক লাগতে পারে: Query টা যায় একদম একটা সাধারণ লেখা হিসেবে। App
                বা Driver Query টা বোঝার, যাচাই করার বা ছোট করার কোনো চেষ্টাই করে না।
                PostgreSQL এর Documentation ঠিক এই কথাটাই বলে, Client এর দিকে কোনো
                Parse হয় না। লেখাটা পৌঁছানোর পর সব কাজ Server এর Backend Process এর।
              </ContentParagraph>
              <ContentParagraph>
                রেস্টুরেন্টের রান্নাঘরে ফিরে যাই। অর্ডারের কাগজটা হাতে পেয়ে রাঁধুনি
                প্রথমে পড়ে দেখেন লেখাটা পড়া যায় কিনা। তারপর দেখেন যে খাবারগুলো চাওয়া
                হয়েছে সেগুলো আদৌ মেনুতে আছে কিনা। তারপর ঠিক করেন কোনটা আগে চুলায়
                দেবেন। শেষে রান্না করেন। Server ঠিক এই চার ধাপে Query চালায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <QueryPipelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Parse, ব্যাকরণ:</strong> লেখাটা SQL এর ব্যাকরণ মেনে লেখা
                  কিনা। SELECT এর জায়গায় SELEC লিখলে এখানেই আটকাবে, Table আছে কি নেই
                  সেটা দেখার আগেই।
                </ListItem>
                <ListItem>
                  <strong>Analyze, নাম যাচাই:</strong> যে Table আর Column এর নাম লেখা
                  আছে, সেগুলো এই Database এ সত্যিই আছে কিনা, আর আপনার সেগুলো পড়ার
                  অনুমতি আছে কিনা। ব্যাকরণ ঠিক কিন্তু Table এর নাম ভুল হলে এখানে
                  আটকাবে।
                </ListItem>
                <ListItem>
                  <strong>Plan, পথ বাছাই:</strong> একই উত্তর পাওয়ার অনেক রাস্তা থাকে।
                  পুরো Table এক মাথা থেকে আরেক মাথা পড়বে, নাকি একটা Index দিয়ে সোজা
                  গিয়ে ধরবে? Server এখানে হিসাব করে সবচেয়ে কম খাটুনির রাস্তা বাছে।
                  এই অংশটা Module 13 এর পুরো বিষয়।
                </ListItem>
                <ListItem>
                  <strong>Execute, আসল কাজ:</strong> বাছাই করা পথে Disk আর Memory থেকে
                  Row তুলে আনা, হিসাব করা। কিছু ভুল শুধু এখানেই ধরা পড়ে, কারণ সেগুলো
                  নির্ভর করে Data এর উপর, যেমন কোনো সংখ্যাকে শূন্য দিয়ে ভাগ করা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের বক্সে আপনি নিজে চারটা ধাপের তিনটা Error ঘটিয়ে দেখবেন। SELECT এর
                নিয়ম এখনো শেখেননি, তাতে সমস্যা নেই, শুধু যেভাবে বলা আছে সেভাবে একটা
                শব্দ বদলে Run চাপুন আর Error এর লেখাটা পড়ুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রথমে যেমন আছে তেমনই Run চাপুন। Error আসবে syntax error, কারণ
                  SELEC বলে কোনো শব্দ SQL এ নেই। এটা Parse ধাপের Error।
                </ListItem>
                <ListItem>
                  এবার SELEC কে SELECT বানান, আর tours কে ইচ্ছা করে tuors লিখুন। Error
                  আসবে relation does not exist। এটা Analyze ধাপের, ব্যাকরণ ঠিক ছিল
                  কিন্তু নামটা মেলেনি।
                </ListItem>
                <ListItem>
                  তারপর tuors ঠিক করে tours লিখুন, আর title কে titel লিখুন। এবার
                  Error এর নিচে একটা HINT ও আসবে, যেখানে PostgreSQL নিজেই আন্দাজ
                  করে বলে দেয় আপনি সম্ভবত title বোঝাতে চেয়েছিলেন।
                </ListItem>
                <ListItem>
                  শেষে সব ঠিক করে price_bdt এর পরে লিখুন <code>/ 0</code>। ব্যাকরণ
                  ঠিক, নাম ঠিক, Plan ও হয়ে গেছে, কিন্তু চালাতে গিয়ে আটকাবে division
                  by zero তে। এটা Execute ধাপের Error।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="চার ধাপের Error"
              query={`SELEC title, price_bdt
FROM tours;`}
              caption="প্রতিবার একটা জিনিস বদলে Run চাপুন। Error এর নিচের ছোট লাইনে ^ চিহ্ন দেখায় Server ঠিক কোন অক্ষরে গিয়ে আটকেছে। Reset চাপলে বক্স আবার শুরুর অবস্থায় ফিরে যাবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Error দেখে আগে ধাপটা চিনুন",
          content: (
            <ContentParagraph>
              Production এ কোনো Query ভাঙলে প্রথম প্রশ্ন হোক, কোন ধাপে ভেঙেছে।
              syntax error মানে SQL এর লেখাতেই গোলমাল, তাই Code দেখুন। does not
              exist মানে নাম মেলেনি, তাই দেখুন ঠিক Database এ Connect করেছেন কিনা,
              বা Table টা এখনো বানানো হয়েছে কিনা। আর division by zero বা এরকম কিছু
              মানে লেখা ঠিক আছে, কিন্তু কোনো একটা Row এর Data অপ্রত্যাশিত।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 08 */
    {
      id: "answer",
      subHeader: { index: "008", title: "The Answer" },
      title: <SectionTitle>উত্তর ফেরত আসে কীভাবে, আর Protocol কাকে বলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Execute শেষ হলে Server উত্তর পাঠায়, কিন্তু একবারে একটা বড় প্যাকেট
                হিসেবে নয়। আগে আসে একটা বার্তা, যাতে লেখা থাকে উত্তরে কয়টা Column,
                তাদের নাম কী আর প্রত্যেকটার Type কী। তারপর প্রতিটা Row আসে নিজের আলাদা
                বার্তায়। শেষে আসে একটা ছোট হিসাব, যেমন SELECT 3, মানে তিনটা Row গেল।
                তারপর আবার ReadyForQuery, মানে পরের প্রশ্নের জন্য তৈরি।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা বার্তার এই যে নির্দিষ্ট নাম আর গঠন, আর কে কখন কোনটা পাঠাবে তার
                নিয়ম, এই পুরো নিয়মকানুনের নাম <strong>Protocol</strong>। PostgreSQL
                এর Protocol এর সরকারি নাম Frontend/Backend Protocol। নিচের ছবিতে একটা
                Connection এর পুরো জীবন দেখুন, খোলা থেকে বন্ধ পর্যন্ত।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MessageLadderDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার নিচের বক্সে Run চাপুন। এটা ঠিক সেই তথ্য যা Driver পায়: উপরে
                Column এর নামগুলো, নিচে Row, আর শেষে কয়টা Row তার হিসাব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="একটা Row এর উত্তর"
              query={`SELECT tour_id, title, price_bdt, created_at
FROM tours
WHERE tour_id = 3;`}
              caption="উত্তরে চারটা Column, একটা Row। price_bdt এ দেখুন 18000.00, দশমিকের পরে দুই ঘর সহ। created_at এর শেষে +06, মানে সময়টা ঢাকার সময় অনুযায়ী দেখানো হচ্ছে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই একই Row যখন Node.js এর pg Driver এর হাতে পৌঁছায়, সে এটাকে একটা
                JavaScript Object বানিয়ে দেয়। প্রতিটা Column একটা Property। কিন্তু
                প্রতিটা Type কোন JavaScript Type হবে, সেটা Driver নিজের নিয়মে ঠিক
                করে, আর সেখানে একটা জিনিস প্রথমবার দেখলে খটকা লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "result.rows, pg Driver যেভাবে দেয়",
          code: `[
  {
    tour_id: 3,                               // integer থেকে Number
    title: 'Sundarbans Mangrove Cruise',      // text থেকে String
    price_bdt: '18000.00',                    // numeric থেকে String, Number নয়
    created_at: 2025-10-05T04:00:00.000Z      // timestamptz থেকে Date Object
  }
]`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>price_bdt কেন String?</strong> PostgreSQL এর numeric
                  Type দশমিকের পরে যত ঘর চান তত নিখুঁত রাখে। JavaScript এর Number তা
                  পারে না, অনেক দশমিক সংখ্যা সে একটু কাছাকাছি মান হিসেবে রাখে। টাকার
                  হিসাবে একটা পয়সাও হারানো চলে না, তাই pg Driver numeric কে নিজে থেকে
                  Number বানায় না, লেখা হিসেবেই হাতে দেয়। এটা Bug নয়, ইচ্ছাকৃত
                  সাবধানতা। টাকার Type নিয়ে পুরো আলোচনা Module 09 তে।
                </ListItem>
                <ListItem>
                  <strong>created_at এ সময় বদলে গেল কেন?</strong> বদলায়নি। ঢাকার
                  সকাল ১০টা আর UTC এর ভোর ৪টা একই মুহূর্ত। JavaScript এর Date সবসময়
                  UTC তে লিখে দেখায়, শেষের Z মানে UTC। সময় আর Time Zone এর এই গোলকধাঁধা
                  Module 04 এ খোলা হবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "psql এর INSERT 0 1 এর মানে",
          content: (
            <ContentParagraph>
              Module 02 থেকে psql চালালে দেখবেন একটা Row ঢোকানোর পর লেখা আসে INSERT 0
              1। এটা সেই শেষের হিসাবের বার্তা, যার নাম CommandComplete। শেষের 1 মানে
              একটা Row ঢুকেছে। মাঝের 0 একটা পুরনো দিনের অবশেষ, আধুনিক PostgreSQL এ
              এটা সবসময় 0, তাই উপেক্ষা করলেই চলে। এই লেসনের Query বক্স সেই 0 টা বাদ
              দিয়ে শুধু INSERT 1 দেখায়।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 09 */
    {
      id: "parameters",
      subHeader: { index: "009", title: "Parameters" },
      title: <SectionTitle>লেখা জোড়া দেবেন না, Parameter দিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যে Query গুলো দেখলেন, সবগুলোতে খোঁজার মান আগে থেকে লেখা ছিল,
                যেমন tour_id = 3। আসল App এ মানটা আসে ব্যবহারকারীর কাছ থেকে। কেউ একটা
                ফর্মে নিজের Email লিখলেন, আর App সেই Email এর Customer খুঁজবে।
              </ContentParagraph>
              <ContentParagraph>
                নতুন Developer এর প্রথম চিন্তা হয় সহজ: SQL এর লেখাটা বানাই, আর মাঝখানে
                ব্যবহারকারীর লেখা Email টা জোড়া দিয়ে দিই। দেখতে নিরীহ, চলেও ঠিকঠাক,
                যতদিন না কেউ ইচ্ছা করে ফর্মে Email এর বদলে SQL এর টুকরো লেখেন। নিচের
                Lab এ দুই রকম Code আর তিন রকম লেখা মিলিয়ে দেখুন Server এর কাছে ঠিক কী
                পৌঁছায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <InjectionLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                জোড়া দেওয়া সংস্করণে কী হলো দেখুন। Server এর কাছে লেখাটা যখন পৌঁছায়,
                তখন কোন অংশ আপনার লেখা আর কোন অংশ ব্যবহারকারীর, সেটা বোঝার কোনো উপায়
                তার নেই। পুরোটা তার কাছে এক টুকরো SQL। ব্যবহারকারী একটা উদ্ধৃতি চিহ্ন
                দিয়ে আপনার লেখা Email এর ঘর বন্ধ করে দিয়েছেন, তারপর নিজের SQL লিখেছেন।
                এই আক্রমণের নাম <strong>SQL Injection</strong>, মানে SQL এর ভেতরে
                বাইরের SQL ঢুকিয়ে দেওয়া। Web এর ইতিহাসে সবচেয়ে বেশি Data চুরি হয়েছে
                এই একটা ভুল দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                Parameter দেওয়া সংস্করণে SQL এর লেখাটায় মানের জায়গায় থাকে একটা
                চিহ্ন, <code>$1</code>। মানটা যায় আলাদা একটা বার্তায়। Server আগে
                লেখাটা Parse করে, তারপর Bind নামের আরেকটা বার্তায় মানটা পায়। ততক্ষণে
                Parse শেষ, তাই মানের ভেতরে যা ই থাকুক, সেটা কখনো SQL হিসেবে পড়া হয়
                না, শুধু একটা Email হিসেবে খোঁজা হয়। আরেকটা বাড়তি সুরক্ষা, এই পথে
                PostgreSQL একবারে একটার বেশি Statement নেয়ই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "find-customer.mjs, ভুল আর ঠিক পাশাপাশি",
          code: `// ভুল: ব্যবহারকারীর লেখা সরাসরি SQL এর ভেতরে জোড়া
const unsafe =
  "SELECT customer_id, full_name FROM customers WHERE email = '" + email + "'";
await client.query(unsafe);

// ঠিক: SQL এর লেখা আর মান আলাদা, মান যায় দ্বিতীয় Argument এ
const result = await client.query(
  'SELECT customer_id, full_name FROM customers WHERE email = $1',
  [email],
);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের বক্সে জোড়া দেওয়ার পরে Server এর কাছে যে লেখাটা পৌঁছায়, সেটাই
              বসানো আছে। Run চাপুন, ১৫ জন Customer এর সবার নাম আর শহর চলে আসবে, অথচ
              ফর্মে কেউ কারো Email ই জানতেন না। তারপর{" "}
              <code>{"'' OR '1'='1'"}</code> অংশটা মুছে সেখানে{" "}
              <code>{"'nusrat.jahan@mail.example'"}</code> লিখে আবার চালান, এবার শুধু
              একজন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="জোড়া দেওয়ার ফল"
              query={`SELECT customer_id, full_name, city
FROM customers
WHERE email = '' OR '1'='1';`}
              caption="এটা সেই লেখা যা জোড়া দেওয়া Code বানিয়েছিল, যখন ফর্মে কেউ লিখেছিলেন ' OR '1'='1। WHERE এর শর্তের একটা অংশ সবসময় সত্য, তাই কোনো Row বাদ পড়ে না।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "MySQL এ, আর একটা সীমা",
          content: (
            <ContentParagraph>
              MySQL এর mysql2 Driver এ চিহ্নটা $1 নয়, প্রশ্নবোধক চিহ্ন, ? । নিয়ম একই:
              মান আলাদা যায়। আর একটা সীমা মনে রাখুন, Parameter শুধু মানের জায়গায়
              বসে, Table বা Column এর নামের জায়গায় বসে না। নাম যদি ব্যবহারকারীর
              পছন্দে বদলাতে হয়, সেটা আগে থেকে ঠিক করা একটা তালিকা থেকে বেছে নিন,
              ব্যবহারকারীর লেখা থেকে কখনো নয়। SQL Injection এর পুরো লড়াই Module 16
              তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "connection-cost",
      subHeader: { index: "010", title: "Connection Pool" },
      title: <SectionTitle>Connection দামি, তাই Pool</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দুটো আগের কথা পাশাপাশি রাখুন। এক, একটা Connection খুলতে প্রথম SQL
                এর আগেই ছয় সাতটা Round Trip খরচ হয়। দুই, প্রতিটা Connection এর জন্য
                Server একটা আলাদা Process চালায়, যার নিজের Memory লাগে। তাহলে প্রতিটা
                বুকিংয়ের জন্য নতুন একটা Connection খুলে, একটা ছোট Query চালিয়ে, আবার
                বন্ধ করে দিলে কী হয়?
              </ContentParagraph>
              <ContentParagraph>
                ভাবুন একটা রিকশা স্ট্যান্ড না থাকলে কী হতো। প্রতিটা যাত্রীর জন্য একটা
                নতুন রিকশা কিনে আনা, যাত্রা শেষে সেটা ফেলে দেওয়া। যাত্রার চেয়ে কেনাতেই
                বেশি সময় আর টাকা। তাই স্ট্যান্ডে কয়েকটা রিকশা দাঁড়িয়ে থাকে। যাত্রী এলে
                একটা নেন, পৌঁছে গেলে রিকশা আবার স্ট্যান্ডে ফেরে। Database এর জন্য এই
                স্ট্যান্ডের নাম <strong>Connection Pool</strong>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PoolLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Pool কাজ করে তিনটা সহজ নিয়মে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>খোলা রাখা:</strong> App চালু হওয়ার পর Pool প্রয়োজন মতো
                  কয়েকটা Connection খুলে রাখে, কিন্তু একটা সীমার বেশি নয়। সীমাটা কত
                  হবে, সেটা Code এ লেখা থাকে না, Environment Variable থেকে আসে, কারণ
                  নিজের ল্যাপটপে আর Production এ সেটা আলাদা হয়।
                </ListItem>
                <ListItem>
                  <strong>ধার দেওয়া:</strong> একটা Request এলে Pool একটা খালি
                  Connection তার হাতে দেয়। সব ব্যস্ত থাকলে Request টা লাইনে দাঁড়ায়।
                </ListItem>
                <ListItem>
                  <strong>ফেরত নেওয়া:</strong> কাজ শেষে Connection বন্ধ হয় না,
                  Pool এ ফেরে। ফেরত দিতে ভুলে গেলে সেই Connection চিরকাল আটকে থাকে।
                  এভাবে কয়েকটা হারালেই Pool খালি, আর নতুন Request গুলো লাইনে দাঁড়িয়েই
                  থাকে। এর নাম Connection Leak, Production এর খুব চেনা একটা বিপদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Server এর দিকেও একটা সীমা আছে। PostgreSQL একসাথে কতগুলো Connection
                নেবে, সেটা ঠিক করে max_connections নামের একটা Setting, যার Default মান
                ১০০। এর বেশি এলে নতুনজন পান sorry, too many clients already, আর বুকিং
                থেমে যায়। Pool এর আরেকটা কাজ তাই এই সীমার অনেক নিচে থাকা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আরও বড় Pool: PgBouncer",
          content: (
            <ContentParagraph>
              একটা App এর ভেতরের Pool সেই App এর Connection সামলায়। কিন্তু একই
              Database এ যদি দশটা App, বা Serverless এর শত শত Instance একসাথে Connect
              করে, প্রত্যেকের আলাদা Pool মিলে আবার সীমা পার হয়ে যায়। তখন মাঝে বসানো
              হয় আলাদা একটা Pooler Program, যেমন PgBouncer, যে সবার হয়ে অল্প কয়েকটা
              আসল Connection ভাগাভাগি করে। এটা Module 17 আর 19 এর গল্প।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "drivers-orms",
      subHeader: { index: "011", title: "Driver, Builder, ORM" },
      title: <SectionTitle>Driver, Query Builder আর ORM: কে কী লেখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাস্তব প্রজেক্টে খুলে দেখলে অনেক সময় একটাও SQL চোখে পড়বে না। তার বদলে
                দেখবেন এমন কিছু,{" "}
                <code>{"prisma.booking.findMany({ where: { status: 'pending' } })"}</code>
                । তাহলে কি SQL ছাড়াই Database চলছে? না। এখানে আপনার আর Driver এর মাঝে
                আরেকটা স্তর বসেছে, যে আপনার হয়ে SQL টা লিখে দেয়। Database এর কাছে শেষ
                পর্যন্ত পৌঁছায় সেই একই জিনিস, একটা SQL এর লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["স্তর", "উদাহরণ", "আপনি কী লেখেন", "Database কী পায়"],
          rows: [
            [
              "Driver",
              "pg, mysql2",
              "নিজের হাতে পুরো SQL, Parameter সহ",
              "আপনার লেখা SQL, হুবহু",
            ],
            [
              "Query Builder",
              "Knex, Kysely",
              "JavaScript এর Function দিয়ে ধাপে ধাপে SQL গড়া",
              "Builder এর বানানো SQL",
            ],
            [
              "ORM",
              "Prisma, Drizzle, TypeORM, Sequelize",
              "Table কে Object হিসেবে ভেবে Method ডাকা",
              "ORM এর বানানো SQL, কখনো একাধিক",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা স্তরের সবগুলোই শেষে Driver কে ডাকে, আর Driver সেই একই Protocol এ
                একই কথোপকথন চালায়, যা এই লেসনে দেখলেন। তাই ORM ব্যবহার করলেও এই
                লেসনের প্রতিটা কথা খাটে: Connection লাগে, Pool লাগে, Parameter লাগে।
                ভালো ORM গুলো Parameter নিজেই ব্যবহার করে।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে SQL শিখছেন কেন, যদি ORM লিখেই দেয়? কারণ যেদিন কোনো Page ধীর হবে,
                সেদিন ORM এর বানানো SQL টাই আপনাকে পড়তে হবে। প্রায় সব ORM এ একটা Setting
                থাকে যা চালু করলে প্রতিটা SQL Log এ লেখা হয়। সেই Log পড়ে বুঝতে না পারলে
                ধীরগতির কারণ খোঁজার কোনো উপায় নেই। কখন ORM সুবিধা দেয় আর কখন সরাসরি
                SQL ভালো, সেই হিসাব Module 17 তে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "node-code",
      subHeader: { index: "012", title: "The Code" },
      title: <SectionTitle>Node.js থেকে প্রথম Query, পুরো Code সহ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার পুরো কথোপকথনটা একটা ছোট Program এ দেখি। এটা আপনি এখনই চালাতে
                পারবেন না, কারণ আপনার কম্পিউটারে এখনো PostgreSQL বসানো হয়নি। Module 02
                তে PostgreSQL বসিয়ে আর Island Tours এর Database Load করে এই লেসনে ফিরে
                এসে চালাবেন। এখন শুধু পড়ুন আর প্রতিটা লাইনকে এই লেসনের কোনো একটা ধাপের
                সাথে মেলান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "একটা ফোল্ডার আর Driver",
              description:
                "একটা নতুন ফোল্ডারে Terminal খুলে npm init -y চালান, তারপর npm install pg। এটাই PostgreSQL এর Node.js Driver, node-postgres, যার Package এর নাম pg।",
            },
            {
              title: ".env ফাইল",
              description:
                "ফোল্ডারে .env নামে একটা ফাইল বানিয়ে DATABASE_URL লিখুন, নিজের User, Password আর Database এর নাম দিয়ে। পাশে একটা .gitignore বানিয়ে তাতে .env লিখে দিন।",
            },
            {
              title: "Program লেখা",
              description:
                "নিচের lookup-tour.mjs ফাইলটা লিখুন। .mjs মানে Node.js এটাকে আধুনিক Module হিসেবে চালাবে, তাই import আর উপরের স্তরে await দুটোই চলবে।",
            },
            {
              title: "চালানো",
              description:
                "node --env-file=.env lookup-tour.mjs চালান। --env-file Node.js কে বলে .env থেকে মানগুলো পড়ে Environment Variable হিসেবে বসাতে। Node.js 20.6 থেকে এই সুবিধা আছে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "lookup-tour.mjs",
          code: `import { Client } from 'pg';

// ঠিকানা আসে Environment থেকে। না থাকলে এখনই স্পষ্ট করে থামুন,
// কোনো Default ঠিকানা আন্দাজ করে নয়।
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Add it to .env and run with --env-file=.env');
}

const client = new Client({ connectionString });

// এক লাইনে DNS, TCP Handshake, TLS, পরিচয় আর প্রমাণ, সবকিছু
await client.connect();

try {
  // SQL এর লেখা আর মান আলাদা: $1 এর জায়গায় বসবে 3
  const result = await client.query(
    'SELECT tour_id, title, price_bdt FROM tours WHERE tour_id = $1',
    [3],
  );

  console.log(result.rows);      // Row গুলো, প্রতিটা একটা Object
  console.log(result.rowCount);  // কয়টা Row এসেছে
} finally {
  // Error হোক বা না হোক, Connection বন্ধ করে বিদায় বলা
  await client.end();
}`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "terminal, Module 02 এর পরে চালালে",
          code: `node --env-file=.env lookup-tour.mjs
# [
#   {
#     tour_id: 3,
#     title: 'Sundarbans Mangrove Cruise',
#     price_bdt: '18000.00'
#   }
# ]
# 1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লাইনগুলো এই লেসনের কোন ধাপ, মিলিয়ে নিন।{" "}
                <code>client.connect()</code> হলো ধাপ ছয়ের পুরো Lab, প্রথম SQL এর আগের
                সব Round Trip। <code>client.query()</code> এর প্রথম Argument যায় Parse
                বার্তায়, দ্বিতীয় Argument এর <code>[3]</code> যায় Bind বার্তায়।
                result.rows হলো RowDescription আর DataRow জুড়ে বানানো Array, আর
                result.rowCount এসেছে শেষের CommandComplete থেকে। আর{" "}
                <code>client.end()</code> পাঠায় Terminate।
              </ContentParagraph>
              <ContentParagraph>
                এই Program একবার চলে আর থেমে যায়, তাই একটা Connection খুলে বন্ধ করাই
                যথেষ্ট। কিন্তু Island Tours এর API এর মতো সারাদিন চলা Server এ প্রতিটা
                Request এর জন্য এভাবে খুললে আগের Lab এর সমস্যাটাই হবে। সেখানে লেখা হয়
                Pool দিয়ে। পার্থক্য খুব সামান্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "db.mjs, সারাদিন চলা Server এর জন্য",
          code: `import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const max = Number(process.env.DB_POOL_MAX);
if (!connectionString || !Number.isInteger(max) || max < 1) {
  throw new Error('DATABASE_URL and DB_POOL_MAX must be set');
}

// App চালু হওয়ার সময় একবার, পুরো App এর জন্য একটাই Pool
export const pool = new Pool({ connectionString, max });

// যেকোনো জায়গা থেকে: Pool একটা Connection ধার দেয়, Query চালায়, ফেরত নেয়
export async function findTour(tourId) {
  const { rows } = await pool.query(
    'SELECT tour_id, title, price_bdt FROM tours WHERE tour_id = $1',
    [tourId],
  );
  return rows[0];
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "pool.query কেন এত সুবিধার",
          content: (
            <ContentParagraph>
              pool.query একাই তিনটা কাজ করে: Pool থেকে একটা Connection ধার নেয়, Query
              চালায়, আর কাজ শেষে, Error হলেও, Connection ফেরত দেয়। তাই ফেরত দিতে ভুলে
              যাওয়ার সুযোগই থাকে না। শুধু যখন কয়েকটা Query কে একটা Transaction এ
              বাঁধতে হয়, তখন হাতে করে ধার নিতে আর ফেরত দিতে হয়। সেটা Module 12 আর 17
              তে।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "see-it",
      subHeader: { index: "013", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দেখুন: এই বক্সেও একটা Session চলছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের Query বক্সগুলোর ভেতরে আসল PostgreSQL চলছে, আপনার Browser এর
                ভেতরেই। এখানে কোনো Network নেই, কোনো দূরের Server নেই, কিন্তু
                PostgreSQL নিজে জানে কে তার সাথে কথা বলছে, কোন Database এ, আর কয়টা
                Session চলছে। নিচের বক্সে Run চাপুন, পাঁচটা ছোট প্রশ্নের উত্তর একসাথে
                আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <SqlPlayground
              title="আমি কে, কোথায়, কয়জন"
              query={`SELECT current_user, current_database(), version();
SHOW port;
SHOW max_connections;
SELECT pid, datname, state FROM pg_stat_activity;`}
              caption="প্রথম উত্তরে কোন User হিসেবে আর কোন Database এ আছেন, আর PostgreSQL এর Version। তারপর Port এর Setting আর max_connections। শেষেরটা হলো এই মুহূর্তে চলা সব Session এর তালিকা, যার পাশে pid হলো সেই Session এর Backend Process এর নম্বর।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>current_user আর current_database:</strong> এই বক্স
                  ঢুকেছে postgres নামের User হিসেবে, postgres নামের Database এ। আসল
                  Server এ এখানে থাকত Connection String এ লেখা User আর Database এর
                  নাম।
                </ListItem>
                <ListItem>
                  <strong>version:</strong> PostgreSQL 18.3, তার পাশে PGlite লেখা।
                  PGlite হলো PostgreSQL কে এমনভাবে বানানো যাতে সেটা Browser এর ভেতরে
                  চলতে পারে।
                </ListItem>
                <ListItem>
                  <strong>port 5432:</strong> Setting টা আছে, কিন্তু এখানে সত্যিকারের
                  কোনো দরজা খোলা নেই, কারণ বক্সটা Network ব্যবহারই করে না। আসল Server
                  এ ঠিক এই দরজাতেই postmaster কান পেতে থাকে।
                </ListItem>
                <ListItem>
                  <strong>max_connections 100:</strong> এই লেসনের Pool এর Lab এ যে
                  সীমার কথা বললাম, সেটাই।
                </ListItem>
                <ListItem>
                  <strong>pg_stat_activity:</strong> একটাই Session, state এ লেখা
                  active, কারণ ঠিক এই মুহূর্তে সে আপনার Query চালাচ্ছে। Module 02 এর
                  পরে নিজের PostgreSQL এ এটা চালালে দেখবেন প্রতিটা খোলা Connection এর
                  জন্য একটা করে সারি, আর প্রত্যেকের আলাদা pid। Production এ কে কতক্ষণ
                  ধরে কী চালাচ্ছে দেখার প্রথম জানালা এটাই, Module 18 এ বিস্তারিত।
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
      title: <SectionTitle>Imran এর বুকিং, API আর Database এর মাঝখানে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursDatabaseBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর গল্পে ফিরি। Imran Kabir, যাঁর customer_id 15, departure
                নম্বর 8 এর জন্য দুইটা সিট চেয়েছেন। এই তারিখটা Saint Martin Island
                Escape এর, ২০ নভেম্বর, একজনের দাম ১২,৫০০ টাকা, আর এই মুহূর্তে খালি
                সিট ১৪টা। API যখন অনুরোধটা পায়, সে Pool থেকে একটা Connection ধার নেয়
                আর এই কয়েকটা SQL পাঠায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "sql",
          filename: "booking.sql, API যা পাঠায় (মানগুলো আসলে Parameter হয়ে যায়)",
          code: `BEGIN;

-- সিট কমানো, কিন্তু শুধু তখনই যখন অন্তত দুইটা খালি আছে
UPDATE departures
SET seats_left = seats_left - 2
WHERE departure_id = 8 AND seats_left >= 2;

-- নতুন বুকিং, আর তার নম্বর সাথে সাথে ফেরত
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 8, 2, 'pending', 25000.00)
RETURNING booking_id, status, total_bdt;

COMMIT;

--  booking_id | status  | total_bdt
-- ------------+---------+-----------
--  25         | pending | 25000.00
-- (1 row)
--
-- এরপর departures এ seats_left 14 থেকে 12 হয়ে যায়।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                BEGIN আর COMMIT এর মানে, মাঝের দুটো কাজ হয় একসাথে দুটোই হবে, নয়তো
                একটাও না। সিট কমল অথচ বুকিং লেখা হলো না, এমন অর্ধেক অবস্থা কখনো
                থাকবে না। এটা Transaction, আর এর পুরো গল্প Module 12 তে। এখানে আমাদের
                দেখার বিষয় কথোপকথনটা, আর এই লেসনের প্রতিটা ধারণা Island Tours এর কোন
                সিদ্ধান্তে নেমে এসেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Browser কখনো Database ছোঁয় না:</strong> ফোন শুধু HTTPS এ{" "}
                  <code>POST /bookings</code> পাঠায়, সাথে departure আর সিটের সংখ্যা।
                  দাম কত হবে, সেটা Browser বলে না। API নিজে Database থেকে দাম পড়ে
                  হিসাব করে, তাই কেউ ফোনে Code বদলে দাম কমাতে পারেন না।
                </ListItem>
                <ListItem>
                  <strong>ঠিকানা থাকে Server এর খাতায়:</strong> API এর Code এ লেখা
                  আছে শুধু process.env.DATABASE_URL। আসল মানটা বসানো থাকে Server এর
                  Environment এ, Git এ কোথাও নেই।
                </ListItem>
                <ListItem>
                  <strong>Database এর দরজা ভেতরে:</strong> PostgreSQL এর Port 5432
                  Internet থেকে বন্ধ। শুধু API এর Container সেখানে পৌঁছাতে পারে।
                  Firewall আর Docker Network দিয়ে এটা কীভাবে করা হয়, DevOps ট্র্যাকে
                  দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>একটা Pool, সারাদিন:</strong> API চালু হওয়ার সময় একবার Pool
                  তৈরি হয়, তার সর্বোচ্চ মাপ আসে Environment Variable থেকে। হাজার বুকিং
                  এলেও PostgreSQL দেখে অল্প কয়েকটা চেনা Connection।
                </ListItem>
                <ListItem>
                  <strong>সব মান Parameter হয়ে যায়:</strong> উপরের SQL এ 15, 8, 2
                  লেখা আছে বোঝার সুবিধার জন্য। আসল Code এ সেগুলো $1, $2, $3, আর মানগুলো
                  যায় আলাদা Bind বার্তায়।
                </ListItem>
                <ListItem>
                  <strong>App এর নিজের User:</strong> Connection String এর User হলো
                  island_api, যার শুধু দরকারি Table গুলোতে পড়া আর লেখার অনুমতি আছে। সে
                  Table মুছতে পারে না, নতুন User বানাতে পারে না। Module 16 এ এই User
                  নিজে হাতে বানাবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "request-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>বোতাম চাপা থেকে বুকিং নম্বর পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার পুরো লেসনটা একটা গল্পে। প্রতিটা ধাপ পড়ার সময় নিজেকে জিজ্ঞেস করুন,
              এই মুহূর্তে কে Client আর কে Server।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "ফোন থেকে API",
              description:
                "Imran বুক করুন চাপলেন। Browser HTTPS এ Island Tours এর API তে POST /bookings পাঠায়, সাথে departure 8 আর সিট 2। এখানে Browser হলো Client, API হলো Server।",
            },
            {
              title: "API যাচাই করে",
              description:
                "API দেখে Imran Login করা আছেন কিনা, সিটের সংখ্যা যুক্তিসঙ্গত কিনা। দাম বা অন্য কোনো হিসাব Browser এর কাছ থেকে নেওয়া হয় না।",
            },
            {
              title: "Pool থেকে একটা Connection",
              description:
                "API তার Pool এর কাছে একটা Connection চায়। একটা খালি ছিল, সকালে খোলা, এখনো জীবিত। তাই DNS, TCP Handshake, TLS আর পরিচয়ের কোনো ধাপ এখন আর লাগে না। এই মুহূর্ত থেকে API হলো Client, PostgreSQL হলো Server।",
            },
            {
              title: "SQL এর লেখা যায়",
              description:
                "Driver BEGIN পাঠায়, তারপর UPDATE এর লেখাটা যায় Parse বার্তায় আর মানগুলো যায় Bind বার্তায়। Server এর Backend Process লেখাটা Parse করে, নাম যাচাই করে, Plan করে, Execute করে, আর জানায় UPDATE 1।",
            },
            {
              title: "বুকিং লেখা",
              description:
                "INSERT একইভাবে যায়। RETURNING থাকার কারণে Server উত্তরে RowDescription আর একটা DataRow পাঠায়, যাতে নতুন booking_id 25, status pending আর total_bdt 25000.00।",
            },
            {
              title: "পাকা করা",
              description:
                "Driver COMMIT পাঠায়। এখন সিট কমানো আর বুকিং লেখা দুটোই স্থায়ী। Server বলে ReadyForQuery, এই Connection আবার খালি।",
            },
            {
              title: "Connection ফেরত",
              description:
                "API Connection টা Pool এ ফেরত দেয়, বন্ধ করে না। পরের বুকিং কয়েক মিলিসেকেন্ড পরে এসে এই একই Connection আর একই Backend Process ব্যবহার করবে।",
            },
            {
              title: "Driver উত্তর সাজায়",
              description:
                "pg Driver DataRow টা একটা JavaScript Object বানিয়েছে। booking_id হলো Number 25, আর total_bdt হলো String 25000.00, যাতে টাকার হিসাবে একটা পয়সাও না হারায়।",
            },
            {
              title: "API থেকে ফোনে",
              description:
                "API একটা JSON উত্তর বানিয়ে HTTPS এ ফোনে পাঠায়। এখন আবার API হলো Server, Browser হলো Client।",
            },
            {
              title: "পর্দায় বুকিং নম্বর",
              description:
                "Imran এর ফোনে ভেসে ওঠে, আপনার বুকিং নম্বর ২৫। পুরো কথোপকথন শেষ হয়েছে এক সেকেন্ডের অনেক কম সময়ে, আর তার বড় কারণ Connection টা আগে থেকেই খোলা ছিল।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "mistakes",
      subHeader: { index: "016", title: "Common Mistakes" },
      title: <SectionTitle>চেনা ভুল আর তাদের চেনা Error</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম কয়েক সপ্তাহে এই Error গুলোর প্রায় সবগুলোর সাথে আপনার দেখা হবে।
                প্রতিটা আসলে বলে দেয় কথোপকথনের কোন ধাপটা ভেঙেছে, তাই ধাপ ধরে চিনে
                রাখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>connect ECONNREFUSED:</strong> সাথে ঠিকানা আর Port লেখা
                  থাকে, যেমন 127.0.0.1:5432। TCP Handshake এর ধাপেই প্রত্যাখ্যান,
                  ওই মেশিনে ওই Port এ কেউ শুনছে না।
                  হয় PostgreSQL চালু নেই, নয়তো Port ভুল। আগে দেখুন Server চলছে কিনা।
                </ListItem>
                <ListItem>
                  <strong>কোনো উত্তরই আসে না, শেষে Timeout:</strong> SYN গেছে, কিন্তু
                  কেউ সাড়া দেয়নি। সাধারণত মাঝে কোনো Firewall Packet ফেলে দিচ্ছে, বা
                  Host এর ঠিকানা ভুল। ECONNREFUSED এর সাথে পার্থক্যটা মনে রাখুন:
                  Refused মানে দরজায় কেউ না বলেছে, Timeout মানে দরজা পর্যন্ত পৌঁছানোই
                  যায়নি।
                </ListItem>
                <ListItem>
                  <strong>password authentication failed for user:</strong> রাস্তা
                  ঠিক, দরজা খোলা, কিন্তু প্রমাণের ধাপে আটকেছে। User এর নাম বা Password
                  ভুল। Password এ বিশেষ চিহ্ন থাকলে Percent-encoding এর কথা মনে করুন।
                </ListItem>
                <ListItem>
                  <strong>database island_tour does not exist:</strong> পরিচয় ঠিক,
                  কিন্তু চাওয়া Database এর নাম ভুল, এখানে শেষের s বাদ পড়েছে। Server এ
                  কোন কোন Database আছে, psql এ দেখার উপায় Module 02 তে।
                </ListItem>
                <ListItem>
                  <strong>sorry, too many clients already:</strong> max_connections এর
                  সীমা পার। হয় Pool নেই, প্রতিটা Request নতুন Connection খুলছে, নয়তো
                  কোথাও Connection ফেরত দেওয়া হচ্ছে না।
                </ListItem>
                <ListItem>
                  <strong>DATABASE_URL খালি, অথচ কোনো স্পষ্ট Error নেই:</strong>{" "}
                  Connection String না দিলে pg চুপচাপ নিজের Default মান নিয়ে নিজের
                  মেশিনে কোনো একটা Database খুঁজতে যায়, আর একটা বিভ্রান্তিকর Error দেয়।
                  তাই এই লেসনের Code এ শুরুতেই নিজে যাচাই করে স্পষ্ট ভাষায় থামা হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>.env Git এ চলে যাওয়া:</strong> .gitignore এ .env লেখা না
                  থাকলে একদিন না একদিন Push হবেই। প্রজেক্টের প্রথম দিনেই লিখে রাখুন।
                </ListItem>
                <ListItem>
                  <strong>ব্যবহারকারীর লেখা SQL এ জোড়া দেওয়া:</strong> আজকের Lab এর
                  ১৫ জন Customer এর তালিকা মনে রাখুন। মান সবসময় Parameter হয়ে যাবে।
                </ListItem>
                <ListItem>
                  <strong>Browser এর Code এ Database এর ঠিকানা:</strong> NEXT_PUBLIC_
                  বা এরকম কোনো উপায়ে ঠিকানা Browser এ চলে গেলে সেটা আর গোপন নয়। Password
                  বদলান, আর ঠিকানা শুধু Server এ রাখুন।
                </ListItem>
              </ContentList>
            </div>
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
                <strong>How Connections Are Established</strong>, PostgreSQL এর
                Documentation এর এক পাতার একটা অংশ। postmaster আর প্রতিটা Connection এর
                আলাদা Backend Process এর কথা মূল উৎস থেকে পড়ুন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/connect-estab.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  postgresql.org/docs/current/connect-estab.html
                </a>
              </ListItem>
              <ListItem>
                <strong>The Path of a Query</strong>, একটা Query Server এর ভেতরে কোন
                কোন ধাপ পার হয়, PostgreSQL এর নিজের ভাষায়। এই লেসনের চার ধাপের
                সাথে মিলিয়ে পড়ুন।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/query-path.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  postgresql.org/docs/current/query-path.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Message Flow</strong>, Frontend/Backend Protocol এর যে অংশে
                StartupMessage, ReadyForQuery, RowDescription আর DataRow এর বর্ণনা।
                পুরোটা পড়ার দরকার নেই, Simple Query অংশটা দেখলেই এই লেসনের ছবিটা
                মিলে যাবে।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/protocol-flow.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  postgresql.org/docs/current/protocol-flow.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Connection Strings</strong>, libpq এর Documentation এ URI এর
                প্রতিটা অংশ, Percent-encoding এর নিয়ম আর sslmode এর মতো বাড়তি
                নির্দেশের তালিকা।{" "}
                <a
                  href="https://www.postgresql.org/docs/current/libpq-connect.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  postgresql.org/docs/current/libpq-connect.html
                </a>
              </ListItem>
              <ListItem>
                <strong>node-postgres</strong>, এই লেসনের pg Driver এর নিজের
                Documentation। Queries আর Pooling পাতা দুটো আগে পড়ুন।{" "}
                <a
                  href="https://node-postgres.com/features/pooling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  node-postgres.com/features/pooling
                </a>
              </ListItem>
              <ListItem>
                <strong>SQL Injection</strong>, Wikipedia র লেখা। আক্রমণটার ইতিহাস আর
                বাস্তবের কিছু বড় ঘটনা, যা দেখায় কেন জোড়া দেওয়া একটা লাইন এত দামি
                হতে পারে।{" "}
                <a
                  href="https://en.wikipedia.org/wiki/SQL_injection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  en.wikipedia.org/wiki/SQL_injection
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
                  Database নিজে থেকে কিছু পাঠায় না। কেউ জিজ্ঞেস করলে উত্তর দেয়।
                  জিজ্ঞেস করে App, Driver এর মাধ্যমে।
                </ListItem>
                <ListItem>
                  তিন পক্ষ: Browser, API আর Database। Client মানে যে চায়, Server মানে
                  যে দেয়, আর API দুই দিকে দুই ভূমিকায়।
                </ListItem>
                <ListItem>
                  Browser কখনো সরাসরি Database এ যায় না: Password ফাঁস হতো, যে কেউ
                  যেকোনো SQL চালাতেন, নিয়ম পাহারার কেউ থাকত না, দরজা খোলা রাখতে হতো,
                  আর Browser সেই Protocol বলতেও পারে না।
                </ListItem>
                <ListItem>
                  Connection String এক লাইনে পুরো ঠিকানা: Scheme, User, Password, Host,
                  Port, Database। এটা থাকে DATABASE_URL নামের Environment Variable এ,
                  কখনো Code বা Git এ নয়।
                </ListItem>
                <ListItem>
                  Connection খুলতে DNS, TCP Handshake, TLS, পরিচয় আর প্রমাণ, প্রথম SQL
                  এর আগেই ছয় সাতটা Round Trip। Server প্রতিটা Connection এর জন্য একটা
                  আলাদা Backend Process চালায়।
                </ListItem>
                <ListItem>
                  Query যায় একটা সাধারণ লেখা হিসেবে। Server তাকে Parse, Analyze, Plan
                  আর Execute করে, আর প্রতিটা ধাপের নিজস্ব Error আছে।
                </ListItem>
                <ListItem>
                  উত্তর আসে কয়েক বার্তায়: RowDescription, প্রতিটা Row এর DataRow,
                  CommandComplete, তারপর ReadyForQuery। এই নিয়মের নাম Protocol।
                </ListItem>
                <ListItem>
                  ব্যবহারকারীর মান কখনো SQL এ জোড়া নয়, সবসময় Parameter, $1। নইলে SQL
                  Injection।
                </ListItem>
                <ListItem>
                  Connection দামি, তাই সারাদিন চলা Server এ Pool: খুলে রাখা, ধার
                  দেওয়া, ফেরত নেওয়া, আর max_connections এর অনেক নিচে থাকা।
                </ListItem>
                <ListItem>
                  Driver, Query Builder বা ORM, যেটাই ব্যবহার করুন, Database এর কাছে
                  শেষে পৌঁছায় SQL এর লেখা। তাই SQL পড়তে জানাটাই আসল দক্ষতা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনে প্রতিটা উদাহরণ ছিল একটা ছোট কাজ: একটা ট্যুর খোঁজা, একটা
                বুকিং লেখা। কিন্তু Island Tours এর মালিক মাস শেষে জানতে চাইবেন কোন
                ট্যুরে কত আয় হলো, কোন মাসে বুকিং বেশি। সেই প্রশ্নগুলো একদম অন্য রকম,
                হাজার Row এক সাথে পড়ে যোগ করার প্রশ্ন। ছোট ছোট অনেক কাজ আর বড় বড় কম
                কাজ, এই দুই ধরনের কাজ একই Database এ চালালে কী হয়, পরের লেসন সেই
                গল্প।
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
      [
        "Client আর Server",
        "যে চায় আর যে দেয়, মেশিন নয়, ভূমিকা",
        "API: Browser এর কাছে Server, Database এর কাছে Client",
      ],
      [
        "Driver",
        "App এর ভেতরের Library যে Database এর Protocol বলে",
        "Node.js এ pg, MySQL এর জন্য mysql2",
      ],
      [
        "Connection String",
        "এক লাইনে Scheme, User, Password, Host, Port আর Database",
        "DATABASE_URL Environment Variable",
      ],
      [
        "Round Trip",
        "একটা বার্তা গিয়ে উত্তর ফেরত আসা",
        "Connection খুলতে ছয় সাতটা",
      ],
      [
        "Backend Process",
        "প্রতিটা Connection এর জন্য Server এর আলাদা একটা Process",
        "pg_stat_activity এর pid",
      ],
      [
        "Parse, Analyze, Plan, Execute",
        "Server এর ভেতরে Query এর চার ধাপ",
        "syntax error, does not exist, division by zero",
      ],
      [
        "Protocol",
        "বার্তার নাম, গঠন আর ক্রমের নিয়ম",
        "StartupMessage, Query, RowDescription, DataRow",
      ],
      [
        "Parameter",
        "SQL এর লেখা আর মান আলাদা বার্তায় যাওয়া",
        "$1 আর মানের Array, MySQL এ ?",
      ],
      [
        "SQL Injection",
        "ব্যবহারকারীর লেখা SQL এর অংশ হয়ে যাওয়া",
        "জোড়া দেওয়া লেখায় OR '1'='1'",
      ],
      [
        "Connection Pool",
        "কয়েকটা খোলা Connection ধার দেওয়া আর ফেরত নেওয়া",
        "pg এর Pool, বড় পরিসরে PgBouncer",
      ],
      [
        "max_connections",
        "Server একসাথে কতগুলো Connection নেবে, Default ১০০",
        "sorry, too many clients already",
      ],
      [
        "ORM",
        "আপনার হয়ে SQL লেখা স্তর, শেষে সেই Driver আর SQL",
        "Prisma, Drizzle, TypeORM",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Island Tours এর Website এর Browser কেন সরাসরি PostgreSQL এর সাথে কথা বলে না?",
        options: [
          {
            key: "A",
            text: "কারণ Browser এর চেয়ে API দ্রুত SQL চালায়",
            isCorrect: false,
            explanation:
              "SQL চালায় Database নিজেই। কারণ গতি নয়, নিরাপত্তা আর নিয়ন্ত্রণ।",
          },
          {
            key: "B",
            text: "কারণ তাহলে Password প্রত্যেক দর্শকের হাতে যেত, যে কেউ যেকোনো SQL চালাতে পারতেন, আর দাম বা সিটের নিয়ম পাহারার কেউ থাকত না",
            isCorrect: true,
            explanation:
              "ঠিক। Browser এর Code সবার মেশিনে নামে, তাই তাতে রাখা যেকোনো গোপন জিনিস আর গোপন থাকে না। সাথে Database এর Port Internet এ খোলা রাখতে হতো, আর Browser সেই Protocol বলতেও পারে না।",
          },
          {
            key: "C",
            text: "কারণ PostgreSQL শুধু Linux এ চলে, আর ফোনে Linux নেই",
            isCorrect: false,
            explanation:
              "PostgreSQL কোথায় চলে তার সাথে এর সম্পর্ক নেই। Client যেকোনো মেশিন থেকেই Connect করতে পারত, সমস্যা হলো কাকে করতে দেওয়া হবে।",
          },
          {
            key: "D",
            text: "কারণ SQL শুধু Server এর Code এ লেখা যায়, Browser এর JavaScript এ নয়",
            isCorrect: false,
            explanation:
              "SQL একটা লেখা মাত্র, যেকোনো জায়গায় লেখা যায়। আটকানো হয় ইচ্ছা করে, নিরাপত্তার জন্য।",
          },
        ],
      },
      {
        id: 2,
        text: "postgres://island_api:CHANGE_ME@db.internal.example:5432/island_tours এই Connection String এ Database এর নাম কোনটা?",
        options: [
          {
            key: "A",
            text: "island_api",
            isCorrect: false,
            explanation: "এটা User এর নাম, কোলনের আগে আর Scheme এর পরে বসে।",
          },
          {
            key: "B",
            text: "db.internal.example",
            isCorrect: false,
            explanation: "এটা Host, মানে Server কোন মেশিনে। @ এর পরে বসে।",
          },
          {
            key: "C",
            text: "island_tours",
            isCorrect: true,
            explanation:
              "ঠিক। শেষের স্ল্যাশের পরের অংশটা Server এর ভেতরের কোন Database চাই, সেটা বলে।",
          },
          {
            key: "D",
            text: "postgres",
            isCorrect: false,
            explanation:
              "এটা Scheme, শুধু বলে এটা PostgreSQL এর ঠিকানা। এখানে কোনো Database এর নাম নয়।",
          },
        ],
      },
      {
        id: 3,
        text: "App যখন PostgreSQL এ একটা Query পাঠায়, তারের উপর দিয়ে আসলে কী যায়?",
        options: [
          {
            key: "A",
            text: "Driver এর আগে থেকে যাচাই আর ছোট করা একটা Binary Program",
            isCorrect: false,
            explanation:
              "Client এর দিকে কোনো Parse বা যাচাই হয় না। সব কাজ Server এর।",
          },
          {
            key: "B",
            text: "Query টা একটা সাধারণ লেখা হিসেবে, যা Server এর Backend Process পড়ে, বোঝে আর চালায়",
            isCorrect: true,
            explanation:
              "ঠিক। PostgreSQL এর Documentation ও তাই বলে: Query যায় Plain Text হিসেবে, Parse হয় Server এ।",
          },
          {
            key: "C",
            text: "প্রয়োজনীয় Table গুলোর একটা কপি, যাতে App নিজেই খুঁজে নিতে পারে",
            isCorrect: false,
            explanation:
              "Table কখনো App এ আসে না। App প্রশ্ন পাঠায়, Database শুধু উত্তরের Row গুলো পাঠায়।",
          },
          {
            key: "D",
            text: "একটা HTTP Request, ঠিক Browser যেমন পাঠায়",
            isCorrect: false,
            explanation:
              "PostgreSQL HTTP বলে না। তার নিজস্ব Frontend/Backend Protocol আছে, তাই Driver লাগে।",
          },
        ],
      },
      {
        id: 4,
        text: "একটা Query তে Error এল relation tuors does not exist। Server এর ভেতরে Query টা কোন ধাপে আটকেছে?",
        options: [
          {
            key: "A",
            text: "Parse, কারণ বানান ভুল",
            isCorrect: false,
            explanation:
              "Parse ধাপ শুধু ব্যাকরণ দেখে। tuors একটা বৈধ নাম হতেই পারত, তাই ব্যাকরণে কোনো ভুল নেই।",
          },
          {
            key: "B",
            text: "Analyze, কারণ ব্যাকরণ ঠিক ছিল কিন্তু ওই নামে কোনো Table এই Database এ নেই",
            isCorrect: true,
            explanation:
              "ঠিক। নাম যাচাইয়ের ধাপে ধরা পড়ে। এমন Error এ নিজেকে জিজ্ঞেস করুন, বানান ঠিক তো, আর ঠিক Database এ Connect করেছি তো।",
          },
          {
            key: "C",
            text: "Plan, কারণ কোনো পথ খুঁজে পাওয়া যায়নি",
            isCorrect: false,
            explanation:
              "Plan পর্যন্ত Query পৌঁছায়ইনি। নাম না মিললে আগেই থামে।",
          },
          {
            key: "D",
            text: "Execute, কারণ Table টা খালি",
            isCorrect: false,
            explanation:
              "খালি Table এ Query চললে কোনো Error হয় না, শুধু শূন্য Row আসে।",
          },
        ],
      },
      {
        id: 5,
        text: "PostgreSQL এ প্রতিটা নতুন Connection এর জন্য Server এর দিকে কী তৈরি হয়?",
        options: [
          {
            key: "A",
            text: "কিছুই না, সব Connection একটাই Process ভাগাভাগি করে",
            isCorrect: false,
            explanation:
              "MySQL প্রতিটা Connection এর জন্য একটা Thread চালায়, আর PostgreSQL আরও এক ধাপ ভারী, একটা পুরো Process।",
          },
          {
            key: "B",
            text: "Database এর একটা আলাদা কপি",
            isCorrect: false,
            explanation:
              "Data একটাই থাকে। Connection প্রতি নতুন কপি হলে কেউ কারো লেখা দেখতে পেতেন না।",
          },
          {
            key: "C",
            text: "postmaster একটা নতুন Backend Process চালু করে, যে শুধু ওই Connection এর কাজ করে",
            isCorrect: true,
            explanation:
              "ঠিক। এজন্যই Connection দামি, আর এজন্যই max_connections এর একটা সীমা থাকে।",
          },
          {
            key: "D",
            text: "একটা নতুন Port খোলা হয়, প্রতিটা Connection এর জন্য আলাদা",
            isCorrect: false,
            explanation:
              "Server সবসময় একই Port 5432 এ শোনে। আলাদা Connection চেনা যায় Client এর দিকের Port আর IP দিয়ে।",
          },
        ],
      },
      {
        id: 6,
        text: "জোড়া দেওয়া Code এ কেউ ফর্মে ' OR '1'='1 লিখে ১৫ জন Customer এর তালিকা পেয়ে গেলেন। $1 Parameter দিয়ে লেখা Code এ একই লেখা কেন কাজ করে না?",
        options: [
          {
            key: "A",
            text: "কারণ Parameter দিলে Driver উদ্ধৃতি চিহ্নগুলো মুছে দেয়",
            isCorrect: false,
            explanation:
              "কিছুই মোছা হয় না। লেখাটা হুবহু পৌঁছায়, শুধু মান হিসেবে, SQL হিসেবে নয়।",
          },
          {
            key: "B",
            text: "কারণ SQL এর লেখা আগে Parse হয়ে যায়, আর মানটা আসে আলাদা Bind বার্তায়, তাই মানের ভেতরের কোনো কিছু আর SQL হিসেবে পড়া হয় না",
            isCorrect: true,
            explanation:
              "ঠিক। পুরো লেখাটা একটা অদ্ভুত Email হিসেবে খোঁজা হয়, এমন Email কারো নেই, তাই শূন্য Row।",
          },
          {
            key: "C",
            text: "কারণ PostgreSQL OR শব্দটা Parameter এ নিষিদ্ধ করে রেখেছে",
            isCorrect: false,
            explanation:
              "কোনো শব্দ নিষিদ্ধ নয়। নিরাপত্তা আসে কাঠামো থেকে, লেখা আর মান আলাদা থাকায়।",
          },
          {
            key: "D",
            text: "কারণ Parameter দিলে Query টা HTTPS এ যায়",
            isCorrect: false,
            explanation:
              "Encrypt হওয়া বা না হওয়ার সাথে Injection এর সম্পর্ক নেই। TLS চালু থাকলেও জোড়া দেওয়া Code একই রকম বিপজ্জনক।",
          },
        ],
      },
      {
        id: 7,
        text: "Island Tours এর API তে Connection Pool রাখার মূল লাভ কোনটা?",
        options: [
          {
            key: "A",
            text: "Query গুলো নিজে থেকে দ্রুত চলে, কারণ Pool তাদের Cache করে রাখে",
            isCorrect: false,
            explanation:
              "Pool Query বা তার ফল মনে রাখে না। সে শুধু খোলা Connection মনে রাখে।",
          },
          {
            key: "B",
            text: "আগে খোলা Connection বারবার ব্যবহার হয়, তাই প্রতিটা Request এ Handshake, TLS, প্রমাণ আর নতুন Process এর খরচ লাগে না, আর Connection এর মোট সংখ্যা সীমার নিচে থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। ধার নেওয়া আর ফেরত দেওয়া, দুটো সহজ কাজে বড় দুটো খরচ বাঁচে, আর too many clients এর ঝুঁকি কমে।",
          },
          {
            key: "C",
            text: "Pool থাকলে আর Password লাগে না",
            isCorrect: false,
            explanation:
              "Pool এর প্রতিটা Connection খোলার সময় স্বাভাবিকভাবেই প্রমাণ দিয়ে খোলে। পার্থক্য হলো সেটা বারবার করতে হয় না।",
          },
          {
            key: "D",
            text: "Pool এক Connection দিয়ে একসাথে অনেক Query চালায়",
            isCorrect: false,
            explanation:
              "একটা Connection এ একসাথে একটাই Query চলে। Pool অনেকগুলো Connection রেখে কাজ ভাগ করে।",
          },
        ],
      },
      {
        id: 8,
        text: "pg Driver price_bdt কে Number 18000 না দিয়ে String 18000.00 হিসেবে দেয়। কেন?",
        options: [
          {
            key: "A",
            text: "এটা pg এর একটা পুরনো Bug, নতুন Version এ ঠিক হয়ে গেছে",
            isCorrect: false,
            explanation: "Bug নয়, ইচ্ছাকৃত আচরণ, আর এখনো তাই।",
          },
          {
            key: "B",
            text: "কারণ PostgreSQL সব মান সবসময় String হিসেবে রাখে",
            isCorrect: false,
            explanation:
              "Database এ numeric একটা আসল সংখ্যার Type। আর pg একই উত্তরের tour_id কে ঠিকই Number বানিয়েছে।",
          },
          {
            key: "C",
            text: "কারণ numeric দশমিকের পরে নিখুঁত মান রাখে, যা JavaScript এর Number সবসময় পারে না, তাই টাকার একটা পয়সাও না হারাতে Driver মানটা লেখা হিসেবেই দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। হিসাবের দরকার হলে সাবধানে নিজে রূপান্তর করুন, বা টাকার জন্য বানানো কোনো Library ব্যবহার করুন। পুরো আলোচনা Module 09 তে।",
          },
          {
            key: "D",
            text: "কারণ Query তে price_bdt এর আগে উদ্ধৃতি চিহ্ন দেওয়া ছিল",
            isCorrect: false,
            explanation:
              "Query তে Column এর নাম সাধারণভাবেই লেখা ছিল। কোন JavaScript Type আসবে, সেটা ঠিক করে Column এর Database Type আর Driver এর নিয়ম।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "কথোপকথনটা নিজের হাতে চালান",
    subtitle: "চারটা পরীক্ষা এখনই Query বক্সে, দুটো Module 02 এর পরে",
    stepName: "LAB",
    steps: [
      {
        title: "চার ধাপের Error",
        description:
          "প্রথম ফাইলের চারটা Query একটা একটা করে লেসনের যেকোনো Query বক্সে চালান, আর প্রতিটা Error কোন ধাপের, পাশে লিখে রাখুন।",
      },
      {
        title: "জোড়া দেওয়া বনাম নিরাপদ",
        description:
          "দ্বিতীয় ফাইলের দুটো Query চালিয়ে দেখুন জোড়া দেওয়া লেখা কী ফেরত দেয়, আর Parameter যা পাঠাত, সেটা কী ফেরত দেয়।",
      },
      {
        title: "আমি কে, কয়জন",
        description:
          "তৃতীয় ফাইলের Query গুলো দিয়ে নিজের Session এর পরিচয় আর Server এর সীমাগুলো পড়ুন।",
      },
      {
        title: "একটা বুকিংয়ের কথোপকথন",
        description:
          "চতুর্থ ফাইলটা পুরোটা একসাথে একটা বক্সে চালান। আগে আর পরে seats_left মিলিয়ে দেখুন।",
      },
      {
        title: "Node.js থেকে প্রথম Query, Module 02 এর পরে",
        description:
          "নিজের PostgreSQL এ Island Tours Load করার পর পঞ্চম ফাইলের Program চালান, তারপর ইচ্ছা করে চারভাবে ভেঙে Error গুলো পড়ুন।",
      },
      {
        title: "Session গুলো দেখা, Module 02 এর পরে",
        description:
          "Node.js Program টা চলার সময় আরেকটা Terminal থেকে ষষ্ঠ ফাইলের Query চালিয়ে নিজের App এর Connection টা খুঁজে বের করুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-four-stages.sql",
        language: "sql",
        code: `-- একটা একটা করে চালান, একসাথে নয়

-- Parse: ব্যাকরণ ভুল
SELEC title FROM tours;
--   ERROR: syntax error at or near "SELEC"

-- Analyze: Table এর নাম নেই
SELECT title FROM tuors;
--   ERROR: relation "tuors" does not exist

-- Analyze: Column এর নাম নেই, সাথে PostgreSQL এর পরামর্শ
SELECT titel FROM tours;
--   ERROR: column "titel" does not exist
--   HINT: Perhaps you meant to reference the column "tours.title".

-- Execute: লেখা ঠিক, চালাতে গিয়ে আটকায়
SELECT title, price_bdt / 0 FROM tours;
--   ERROR: division by zero`,
      },
      {
        filename: "2-glued-vs-safe.sql",
        language: "sql",
        code: `-- জোড়া দেওয়া Code ফর্মের ' OR '1'='1 থেকে এই লেখাটা বানায়
SELECT customer_id, full_name, city
FROM customers
WHERE email = '' OR '1'='1';
--   (15 rows), সব Customer

-- Parameter দিলে Server একই লেখাকে শুধু একটা মান হিসেবে খোঁজে।
-- নিচের দুটো উদ্ধৃতি চিহ্ন মানে লেখার ভেতরের একটা উদ্ধৃতি চিহ্ন,
-- অর্থাৎ পুরোটা একটাই Email:  ' OR '1'='1
SELECT customer_id, full_name, city
FROM customers
WHERE email = ''' OR ''1''=''1';
--   (0 rows)`,
      },
      {
        filename: "3-who-am-i.sql",
        language: "sql",
        code: `SELECT current_user, current_database(), version();
SHOW port;             -- 5432
SHOW max_connections;  -- 100
SELECT pid, datname, state FROM pg_stat_activity;
--   এই মুহূর্তের প্রতিটা Session এর একটা সারি, pid হলো Backend Process`,
      },
      {
        filename: "4-booking-conversation.sql",
        language: "sql",
        code: `SELECT seats_left FROM departures WHERE departure_id = 8;
--   14

BEGIN;
UPDATE departures
SET seats_left = seats_left - 2
WHERE departure_id = 8 AND seats_left >= 2;
--   UPDATE 1
INSERT INTO bookings (customer_id, departure_id, seats, status, total_bdt)
VALUES (15, 8, 2, 'pending', 25000.00)
RETURNING booking_id, status, total_bdt;
--   booking_id 25, pending, 25000.00
COMMIT;

SELECT seats_left FROM departures WHERE departure_id = 8;
--   12`,
      },
      {
        filename: "5-lookup-tour.mjs",
        language: "javascript",
        code: `// Module 02 এর পরে। আগে: npm install pg
// .env এ: DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/island_tours
// চালান: node --env-file=.env 5-lookup-tour.mjs
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = new Client({ connectionString });
await client.connect();
try {
  const { rows } = await client.query(
    'SELECT tour_id, title, price_bdt FROM tours WHERE tour_id = $1',
    [3],
  );
  console.log(rows);
} finally {
  await client.end();
}

// এবার ইচ্ছা করে চারভাবে ভাঙুন, প্রতিবার Error টা লিখে রাখুন:
//   ১. .env এ Password এর একটা অক্ষর বদলান    -> password authentication failed
//   ২. Database এর নাম island_tour লিখুন       -> database "island_tour" does not exist
//   ৩. Port 5432 কে 5433 লিখুন                  -> connect ECONNREFUSED, সাথে 5433
//   ৪. --env-file=.env ছাড়া চালান              -> DATABASE_URL is not set`,
      },
      {
        filename: "6-watch-connections.sql",
        language: "sql",
        code: `-- Module 02 এর পরে, psql থেকে, Node.js Program চলার সময়
SELECT pid, usename, datname, application_name, state, backend_start
FROM pg_stat_activity
WHERE datname = 'island_tours';
-- প্রতিটা খোলা Connection এর একটা সারি। Program বন্ধ হলে তার সারিটাও চলে যায়।`,
      },
    ],
    tip: "পাঁচ নম্বর পরীক্ষার চারটা ভাঙা ইচ্ছা করে করুন, আর প্রতিটা Error কে এই লেসনের একটা ধাপের সাথে মেলান। ECONNREFUSED মানে TCP এর দরজায়, password authentication failed মানে প্রমাণের ধাপে, does not exist মানে পরিচয়ের ধাপে চাওয়া Database নেই, আর শেষেরটা আপনার নিজের যাচাই। একবার নিজের হাতে ঘটালে Production এ এই Error গুলো দেখে আর ঘাবড়াবেন না, কারণ আপনি জানবেন কথোপকথনের কোন জায়গাটা ছিঁড়েছে।",
  },
  assignment: {
    title: "Mini Project: কথোপকথনের মানচিত্র",
    time: "৬০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>নিজের একটা App এর তিন পক্ষ আঁকুন:</strong> একটা খাবার ডেলিভারি App
        ধরুন। Browser বা Mobile App, API আর Database, তিনটা ঘর আঁকুন। প্রতিটা তীরের
        পাশে লিখুন কোন Protocol, কোন Port, আর কোন পক্ষ সেখানে Client। কোন তীরটা
        কখনো থাকবে না, সেটাও কেটে দেখান।
      </span>,
      <span key="2">
        <strong>তিনটা Connection String পড়ুন:</strong> নিচের তিনটার প্রতিটা থেকে
        Scheme, User, Host, Port আর Database আলাদা করে লিখুন:{" "}
        <code>postgres://report_reader:CHANGE_ME@10.0.0.12/analytics</code>,{" "}
        <code>mysql://shop:CHANGE_ME@db.shop.example:3306/orders</code>, আর এমন একটা
        যেখানে Password হলো <code>p@ss:word</code>। শেষেরটা কীভাবে লিখলে Driver ঠিক
        জায়গায় কাটবে? প্রথমটায় Port কত ধরা হবে?
      </span>,
      <span key="3">
        <strong>নিজে একটা Injection বানান:</strong> লেসনের জোড়া দেওয়া Query বক্সে এমন
        একটা ফর্মের লেখা বানান যা শুধু Oliver Bennett এর Row ফেরত আনে, অথচ তাঁর
        Email আপনি জানেন না। তারপর তিন লাইনে লিখুন, Parameter থাকলে এই লেখাটা কেন
        শূন্য Row আনত।
      </span>,
      <span key="4">
        <strong>Module 02 এর পরে, চারটা Error ধরুন:</strong> Lab এর পঞ্চম Program
        নিজের মেশিনে চালান। তারপর চারভাবে ভেঙে প্রতিটার পুরো Error লেখা কপি করুন, আর
        প্রতিটার পাশে লিখুন কথোপকথনের কোন ধাপে ভেঙেছে।
      </span>,
      <span key="5">
        <strong>অন্যকে শেখান (৮ লাইন):</strong> একজন বন্ধু Firebase এর একটা ভিডিও দেখে
        বললেন, Browser থেকেই তো Database চালানো যায়, API লাগবে কেন? তাঁকে বুঝিয়ে
        লিখুন Browser কেন সরাসরি Database এ যায় না, আর Firebase বা Supabase আসলে
        কীভাবে এই সমস্যা সামলায়।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন পক্ষের ছবি, তীরের পাশে Protocol, Port আর Client এর নাম সহ</span>,
      <span key="2">তিনটা Connection String এর ভাঙা টুকরো, আর Percent-encoding করা Password</span>,
      <span key="3">Oliver Bennett কে বের করা ফর্মের লেখা, আর তিন লাইনের ব্যাখ্যা</span>,
      <span key="4">চারটা Error এর হুবহু লেখা, প্রতিটার ধাপ সহ</span>,
      <span key="5">বন্ধুর জন্য ৮ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
