/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  RecordExplorerLab,
  WhichRecordLab,
} from "../../../components/course/topics/dns/records-animations";
import {
  CnameChainDiagram,
  RecordAnatomyDiagram,
  ZoneTableDiagram,
} from "../../../components/course/topics/dns/records-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const dnsRecordsContent: TopicData = {
  id: "dns-records",
  introduction: {
    badge: "MODULE 04 · LESSON 06",
    title: <SectionTitle>নামের নিচে যা যা লেখা থাকে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এতদিন আমরা বলে এসেছি, Authoritative server এ নামটার আসল Record লেখা
          থাকে। আর Domain জোড়ার সময় A আর CNAME নামে দুইটা Record বসিয়েছিলেন,
          পুরো না বুঝেই। এবার সেই Record এর খাতাটা খুলে পাতা ধরে ধরে পড়ার সময়।
        </ContentParagraph>
        <ContentParagraph>
          একটা নামের নিচে শুধু একটা IP লেখা থাকে না। লেখা থাকে সাইট কোথায়, ইমেইল
          কোথায় যাবে, কে এই নামে ইমেইল পাঠাতে পারে, নামটার হিসাব কে রাখে, এমন
          অনেক কিছু। প্রতিটা তথ্যের জন্য একটা আলাদা ধরনের Record। ধরন অনেকগুলো,
          কিন্তু রোজকার কাজে লাগে সাতটা, আর সেগুলো শিখলেই প্রায় সব কাজ চলে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনটা লম্বা, কারণ এটা এই মডিউলের সবচেয়ে হাতে কলমে অংশ। শেষে আপনি
          যেকোনো DNS পাতা খুলে পড়তে পারবেন, একটা নতুন সাইট বা উপনাম জুড়তে পারবেন,
          নিজের Domain এ ইমেইল চালু করতে পারবেন, আর সবচেয়ে চেনা ভুলগুলো এড়াতে
          পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "একটা Domain একটা ছোট দোকানের সাইনবোর্ডের মতো। তাতে শুধু ঠিকানা লেখা থাকে না, লেখা থাকে চিঠি কোথায় দেবেন, মালিক কে, আর কার সই আসল। প্রতিটা লাইন একটা করে Record।",
      author: "DNS",
      role: "Lesson 06",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "anatomy",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা Record আসলে একটা সারি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Record শব্দটা ভারী শোনালেও জিনিসটা খুব সরল, একটা ছকের একটা সারি।
                একটা খাতার কথা ভাবুন, যার প্রতিটা লাইনে লেখা, কোন নামের কথা,
                কী ধরনের তথ্য, আর তথ্যটা কী। একটা Domain এর সব সারি মিলে যে খাতা,
                তার নাম Zone।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা সারিতে চারটা ঘর থাকে, আর যেকোনো DNS সেবার পাতায় এই চারটাই
                দেখবেন, শুধু নাম বা সাজানো একটু আলাদা হতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RecordAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Name:</strong> কোন নামের জন্য এই সারি। পুরো নাম লিখতে হয়
                না, শুধু সামনের অংশ। www লিখলে বোঝায় www.islandtours.example। আর
                মূল নামটার জন্য লেখা হয় @ চিহ্ন।
              </ListItem>
              <ListItem>
                <strong>Type:</strong> তথ্যটা কী ধরনের। এটাই ঠিক করে Value ঘরে কী
                লিখতে হবে, একটা IP, নাকি আরেকটা নাম, নাকি একটা লেখা।
              </ListItem>
              <ListItem>
                <strong>TTL:</strong> আগের লেসনের সেই মেয়াদ, উত্তরটা কত সেকেন্ড
                মনে রাখা যাবে।
              </ListItem>
              <ListItem>
                <strong>Value:</strong> আসল উত্তর। অনেক পাতায় এটাকে Content,
                Target, Points to বা Data ও বলে, জিনিস একই।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "প্রতিটা ধরন একটা প্রশ্নের উত্তর",
          content: (
            <p>
              Record মনে রাখার সবচেয়ে সহজ উপায়, প্রতিটাকে একটা প্রশ্ন হিসেবে
              ভাবা। Resolver যখন Authoritative server এ আসে, সে শুধু নাম বলে না,
              সাথে বলে কোন ধরনের উত্তর চাই। IP চাইলে A জিজ্ঞেস করে, ইমেইলের সার্ভার
              চাইলে MX। server তখন সেই নামের নিচে সেই ধরনের সারিটা খুঁজে উত্তর
              দেয়। তাই একই নামের নিচে অনেক ধরনের সারি থাকতে পারে, একটার সাথে
              আরেকটা মেশে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "seven",
      subHeader: { index: "002", title: "The Seven Types" },
      title: <SectionTitle>সাত ধরন, এক নজরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আগে পুরো দলটার সাথে পরিচয় হোক, তারপর একজন একজন করে গভীরে যাব। নিচে
              প্রতিটা ধরনে চাপ দিয়ে দেখুন সে কোন প্রশ্নের উত্তর দেয়, দেখতে কেমন,
              আর কখন লাগে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RecordExplorerLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "a-aaaa",
      subHeader: { index: "003", title: "A and AAAA" },
      title: <SectionTitle>A আর AAAA, নাম থেকে সোজা IP</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                A Record হলো DNS এর সবচেয়ে মৌলিক সারি, এই নামের IPv4 ঠিকানা এটা।
                এই পুরো মডিউল জুড়ে নাম থেকে IP বের করার যে কথা বলেছি, তার শেষ
                উত্তরটা প্রায় সবসময় একটা A Record থেকে আসে। AAAA তার যমজ, শুধু
                IPv6 ঠিকানার জন্য। IPv6 ঠিকানা IPv4 এর চার গুণ লম্বা (১২৮ Bit,
                ৩২ এর জায়গায়), তাই নামে চারটা A।
              </ContentParagraph>
              <ContentParagraph>
                দুইটাই একসাথে রাখা যায়, আর রাখাই ভালো। যে যন্ত্র IPv6 বোঝে সে
                AAAA নেবে, বাকিরা A। আপনার সার্ভারের IPv6 ঠিকানা না থাকলে AAAA
                বসাবেন না, ভুল AAAA থাকলে কিছু ব্যবহারকারীর সাইট খুলতে দেরি হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "a-and-aaaa.zone",
          code: `; Name    Type    TTL     Value
@         A       3600    103.94.135.2          ; মূল নাম, islandtours.example
api       A       3600    103.94.135.3          ; api.islandtours.example
@         AAAA    3600    2001:db8::7334        ; মূল নামের IPv6

; একই নামে একাধিক A, দুইটা সার্ভারে ভিড় ভাগ:
shop      A       300     103.94.135.10
shop      A       300     103.94.135.11`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একই নামে দুইটা A, মানে ভিড় ভাগ",
          content: (
            <p>
              একই নামের নিচে একাধিক A Record বসালে DNS সবগুলো IP ই ফেরত দেয়, আর
              প্রতিবার ক্রমটা একটু ঘুরিয়ে দেয়। ফলে কিছু ব্যবহারকারী প্রথম
              সার্ভারে যায়, কিছু দ্বিতীয়টায়। এই সরল কৌশলের নাম Round Robin। তবে
              এর একটা দুর্বলতা আছে, একটা সার্ভার বন্ধ হলে DNS সেটা জানে না, তবুও
              কিছু মানুষকে সেখানে পাঠাতে থাকে। তাই সত্যিকারের ভিড় সামলাতে পরে
              Load Balancer শিখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "cname",
      subHeader: { index: "004", title: "CNAME" },
      title: <SectionTitle>CNAME, একটা নামের ডাকনাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CNAME কোনো IP দেয় না। সে বলে, এই নামটা আসলে ওই আরেকটা নামের
                ডাকনাম, তার ঠিকানাই আমার ঠিকানা। ডাকনামের কথা ভাবুন, কেউ বাবু
                বলে ডাকলে আপনি সাড়া দেন, কিন্তু কাগজে আপনার আসল নামটাই চলে।
                বাবু এর ঠিকানা জানতে হলে আগে জানতে হয় বাবু আসলে কে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CnameChainDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই বাড়তি ধাপটা কেন নেবেন? কারণ এতে আপনি অন্যের IP নিয়ে মাথা ঘামানো
              থেকে মুক্ত। Hosting কোম্পানি আপনাকে একটা নাম দেয়, আর সেই নামের
              পেছনের IP তারা যখন খুশি বদলাতে পারে। আপনি সরাসরি IP বসালে তাদের
              প্রতিটা বদলে আপনার সাইট বন্ধ হতো। CNAME বসালে তাদের বদল আপনার কাছে
              অদৃশ্য।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "CNAME এর দুইটা কড়া নিয়ম",
          content: (
            <p>
              এক, যে নামে CNAME আছে, সেই নামে আর কোনো Record থাকতে পারে না। কারণ
              CNAME বলে এই নামের সব কিছু ওই নামে দেখুন, তারপর আবার নিজে কিছু বলা
              স্ববিরোধী। দুই, এই কারণেই মূল নামে (শুধু islandtours.example) CNAME
              বসানো যায় না, কারণ মূল নামে NS আর অন্য জরুরি Record থাকতেই হয়। তাই
              মূল নামে A, আর www এর মতো উপনামে CNAME, এটাই চেনা ছক।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মূল নামেও CNAME এর মতো কিছু চাইলে",
          content: (
            <p>
              কিছু Hosting মূল নামের জন্যও শুধু একটা নাম দেয়, IP নয়। তখন কী
              করবেন? অনেক DNS সেবা এর জন্য একটা কৌশল রেখেছে। Cloudflare এটাকে বলে
              CNAME Flattening, অন্যরা বলে ALIAS বা ANAME। আপনি মূল নামে একটা নাম
              বসান, আর DNS সেবা নিজে সেই নামের IP খুঁজে বাইরের দুনিয়াকে সাধারণ A
              Record হিসেবে দেয়। বাইরে থেকে নিয়ম ভাঙে না, ভেতরে আপনার সুবিধা
              হয়। আপনার DNS সেবায় এটা আছে কি না, তাদের পাতায় দেখে নিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "subdomain-vs-cname",
      subHeader: { index: "005", title: "Subdomain vs CNAME" },
      title: <SectionTitle>Subdomain আর CNAME এক জিনিস নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে একটা বিভ্রান্তি প্রায় সবার হয়, তাই থেমে পরিষ্কার করে নিই।
                CNAME প্রায় সবসময় www বা blog এর মতো একটা Subdomain (উপনাম) এ বসে।
                তাই মনে হতে পারে CNAME আর Subdomain বুঝি একই জিনিস। তা নয়। দুইটা
                সম্পূর্ণ আলাদা প্রশ্নের উত্তর।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Subdomain একটা নাম:</strong> এটা বলে নামটা কোথায় বসে
                  আছে, আপনার Domain এর নিচে। Record এর ছকে এটা Name এর ঘর, মানে
                  সারির বাঁ দিক।
                </ListItem>
                <ListItem>
                  <strong>CNAME একটা উত্তরের ধরন:</strong> এটা বলে সেই নামটা
                  জিজ্ঞেস করলে DNS কী উত্তর দেবে, এই নাম আসলে ওই আরেকটা নামের
                  ডাকনাম। Record এর ছকে এটা Type এর ঘর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একটা খামের কথা ভাবুন। Subdomain হলো খামের উপরে লেখা ঠিকানা। CNAME
                হলো খামের ভেতরের একটা চিরকুট, যাতে লেখা এই চিঠি ওই আরেক ঠিকানায়
                পাঠিয়ে দিন। ঠিকানা আর চিরকুট দুইটা আলাদা জিনিস। সব খামে চিরকুট
                থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "subdomain-vs-cname.zone",
          code: `; তিনটাই Subdomain (Name এর ঘর দেখুন)। কিন্তু CNAME শুধু দুইটায় (Type এর ঘর দেখুন)।

; Name    Type     Value
api       A        103.94.135.3                      ; Subdomain, কিন্তু CNAME নয়
www       CNAME    islandtours.example               ; Subdomain, আর CNAME, নিজের Domain এর দিকে
blog      CNAME    islandtours.blogservice.example   ; Subdomain, আর CNAME, অন্যের Domain এর দিকে

; শিক্ষা ১: Subdomain এ A Record ও বসে। Subdomain মানেই CNAME নয়।
; শিক্ষা ২: CNAME এর লক্ষ্য আপনার Subdomain হতেই হবে না,
;           সম্পূর্ণ অন্য কারো Domain হতে পারে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>তাহলে দুইটা এত একসাথে দেখা যায় কেন:</strong> কারণ মূল নামে
                CNAME বসানো যায় না। তাই বাস্তবে আপনি যত CNAME দেখবেন, প্রায় সবই
                কোনো না কোনো Subdomain এ। CNAME কোথায় বসে তার উত্তর Subdomain,
                কিন্তু CNAME কী তার উত্তর Subdomain নয়।
              </ListItem>
              <ListItem>
                <strong>Subdomain এর ভেতরে Subdomain:</strong> Name এ ফোঁটা দিয়ে
                আরও গভীরে যাওয়া যায়, যেমন eu.api লিখলে হয়
                eu.api.islandtours.example। প্রতিটা ফোঁটা গাছের আরেক স্তর।
              </ListItem>
              <ListItem>
                <strong>Subdomain আর Subdirectory আলাদা:</strong>{" "}
                blog.islandtours.example একটা Subdomain, এটা DNS এর ব্যাপার, আর
                এটা সম্পূর্ণ আলাদা সার্ভারে যেতে পারে। islandtours.example/blog
                একটা Subdirectory, মানে একই সাইটের ভেতরের একটা পথ। স্ল্যাশের পরের
                অংশ DNS কখনো দেখেই না, সেটা ঠিক করে সার্ভার। তাই Blog টা আলাদা
                সেবায় রাখতে চাইলে Subdomain লাগবে, Subdirectory দিয়ে DNS এ সেটা
                করা যায় না।
              </ListItem>
              <ListItem>
                <strong>প্রতিটা Subdomain এর নিজের Record:</strong> মূল নামের MX
                বা TXT কোনো Subdomain এ নিজে থেকে খাটে না। blog এর জন্য ইমেইল
                চাইলে blog নামে আলাদা MX লাগবে।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "mx",
      subHeader: { index: "006", title: "MX" },
      title: <SectionTitle>MX, ইমেইল কোথায় যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কেউ যখন hello@islandtours.example এ ইমেইল পাঠায়, তার ইমেইল
                সার্ভার আপনার Website এর সার্ভারে যায় না। সে DNS কে জিজ্ঞেস করে,
                islandtours.example এর ইমেইল কে নেয়? এই প্রশ্নের উত্তর MX
                Record, পুরো নাম Mail Exchange। তাই সাইট এক জায়গায় আর ইমেইল
                সম্পূর্ণ আরেক জায়গায় (যেমন Google Workspace এ) থাকতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                MX এর Value তে দুইটা জিনিস, একটা সংখ্যা আর একটা নাম। সংখ্যাটা
                অগ্রাধিকার, যার সংখ্যা ছোট তাকে আগে চেষ্টা করা হয়। প্রথমটা সাড়া
                না দিলে পরেরটায় যায়। এভাবে একটা বাড়তি সার্ভার রাখা যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "mx.zone",
          code: `; Name    Type    TTL      Value (অগ্রাধিকার, তারপর নাম)
@         MX      86400    10 mail1.provider.example    ; আগে এটা
@         MX      86400    20 mail2.provider.example    ; এটা বাড়তি, প্রথমটা বন্ধ হলে

; পড়ুন এভাবে: islandtours.example এর ইমেইল প্রথমে mail1 এ দিন,
; না পারলে mail2 তে।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "MX এ IP নয়, নাম বসাতে হয়",
          content: (
            <p>
              MX এর Value তে সবসময় একটা নাম লিখতে হয়, IP নয়। আর সেই নামটার
              নিজের একটা A Record থাকতে হয়, CNAME নয়। অনেকে ভুল করে সরাসরি IP
              বসিয়ে দেন, তখন কিছু ইমেইল সার্ভার সেটা মানে না আর ইমেইল ফেরত যায়।
              ইমেইল সেবার দেওয়া নামগুলো হুবহু কপি করে বসান, নিজে কিছু বদলাবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "txt",
      subHeader: { index: "007", title: "TXT" },
      title: <SectionTitle>TXT, প্রমাণ আর ইমেইলের সুরক্ষা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TXT Record এ যেকোনো লেখা রাখা যায়। শুরুতে এটা ছিল মানুষের পড়ার
                টুকটাক নোট রাখার জায়গা। আজ এর দুইটা বড় কাজ, আর দুইটাই একটা সহজ
                যুক্তির উপর দাঁড়িয়ে, একটা Domain এর DNS শুধু তার মালিকই বদলাতে
                পারে। তাই DNS এ কিছু লেখা মানেই মালিকের সই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>মালিকানার প্রমাণ:</strong> Google Search Console,
                  কোনো ইমেইল সেবা বা Hosting যখন জানতে চায় Domain টা সত্যিই
                  আপনার কি না, তারা একটা অদ্ভুত লম্বা লেখা দেয় আর বলে এটা TXT
                  Record এ বসান। আপনি বসালে তারা DNS এ সেটা খুঁজে পায়, আর বুঝে
                  যায় আপনি মালিক।
                </ListItem>
                <ListItem>
                  <strong>SPF, কে আমার নামে ইমেইল পাঠাতে পারে:</strong> একটা TXT
                  যেটা তালিকা দেয়, কোন কোন সার্ভার আপনার Domain এর নামে ইমেইল
                  পাঠানোর অনুমতি পেয়েছে। অন্য কেউ আপনার নাম দিয়ে পাঠালে গ্রহীতা
                  ধরে ফেলে।
                </ListItem>
                <ListItem>
                  <strong>DKIM, ইমেইলের গায়ে সই:</strong> আপনার ইমেইল সেবা
                  প্রতিটা ইমেইলে একটা গোপন সই বসায়। সেই সই যাচাই করার চাবিটা রাখা
                  থাকে একটা TXT Record এ। গ্রহীতা চাবি দিয়ে মিলিয়ে দেখে ইমেইলটা
                  পথে বদলানো হয়নি।
                </ListItem>
                <ListItem>
                  <strong>DMARC, না মিললে কী করবেন:</strong> আরেকটা TXT, যেটা
                  গ্রহীতাকে বলে, SPF বা DKIM না মিললে ইমেইলটা নিয়ে কী করা উচিত,
                  রেখে দেবেন, Spam এ ফেলবেন, নাকি ফিরিয়ে দেবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "txt.zone",
          code: `; মালিকানার প্রমাণ (লেখাটা সেবা নিজে দেয়)
@                     TXT   "google-site-verification=AbC123xYz..."

; SPF: শুধু আমার ইমেইল সেবা আমার নামে পাঠাতে পারে
@                     TXT   "v=spf1 include:_spf.provider.example ~all"

; DKIM: সইয়ের চাবি (নাম আর মান দুইটাই ইমেইল সেবা দেয়)
s1._domainkey         TXT   "v=DKIM1; k=rsa; p=MIGfMA0GCSq..."

; DMARC: না মিললে কী করবেন, আর রিপোর্ট কোথায় পাঠাবেন
_dmarc                TXT   "v=DMARC1; p=none; rua=mailto:dmarc@islandtours.example"`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "SPF একটাই, দুইটা হলে দুইটাই বাতিল",
          content: (
            <p>
              একটা নামে SPF Record ঠিক একটাই থাকতে পারে। দুইটা ইমেইল সেবা ব্যবহার
              করলে অনেকে দুইটা আলাদা SPF বসিয়ে দেন, আর তখন দুইটাই অকার্যকর হয়ে
              যায়, সব ইমেইল সন্দেহের তালিকায় পড়ে। সঠিক উপায়, একটাই Record এ
              দুইটা include পাশাপাশি লেখা। আর DMARC শুরু করুন p=none দিয়ে, মানে
              শুধু নজর রাখুন। কয়েক সপ্তাহ রিপোর্ট দেখে সব ঠিক থাকলে তবে কড়া
              করুন, নাহলে নিজের আসল ইমেইলই আটকে যেতে পারে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "ns-soa",
      subHeader: { index: "008", title: "NS and SOA" },
      title: <SectionTitle>NS আর SOA, খাতার মালিকানা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                NS Record আপনি আগেই চেনেন, এগুলোই সেই Name Server, যারা বলে এই
                Domain এর আসল হিসাব কার কাছে। সাধারণত দুই থেকে চারটা থাকে, যাতে
                একটা বন্ধ হলে বাকিরা সামলায়। এই Record আপনি সাধারণত হাতে বসান না,
                DNS সেবা নিজেই বসিয়ে রাখে, আর আপনি শুধু Registrar এ একই নামগুলো
                জানিয়ে দেন।
              </ContentParagraph>
              <ContentParagraph>
                NS দিয়ে আরেকটা কাজও হয়, একটা উপনামের পুরো দায়িত্ব অন্য কাউকে
                দিয়ে দেওয়া। যেমন blog.islandtours.example এর জন্য আলাদা NS বসালে
                সেই উপনামের সব Record অন্য একটা DNS সেবা সামলাবে। একে বলে
                Delegation, Root যেভাবে TLD কে দায়িত্ব দেয়, ঠিক সেই একই ধারণা।
              </ContentParagraph>
              <ContentParagraph>
                আর প্রতিটা Zone এর একদম উপরে একটা বিশেষ সারি থাকে, SOA, পুরো নাম
                Start of Authority। এটা খাতার মলাটের মতো, লেখা থাকে মূল Name
                Server কোনটা, দায়িত্বে কে, আর খাতার সংস্করণ নম্বর কত। এটাও আপনি
                সাধারণত ছোঁন না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "নেই উত্তরের মেয়াদ এই SOA তেই লেখা",
          content: (
            <p>
              আগের লেসনে একটা প্রশ্ন ঝুলে ছিল, নামটা নেই, এই উত্তরটা কতক্ষণ মনে
              রাখা হয়? উত্তর এই SOA তে। এর শেষ সংখ্যাটা (নাম Minimum) ঠিক করে
              NXDOMAIN উত্তর কত সেকেন্ড Cache এ থাকবে। তাই নতুন উপনাম বানানোর আগে
              ভুল করে দেখে ফেললে কতক্ষণ অপেক্ষা করতে হবে, সেটা জানতে dig SOA
              চালিয়ে শেষ সংখ্যাটা দেখুন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "others",
      subHeader: { index: "009", title: "SRV and Others" },
      title: <SectionTitle>SRV, আর আরও তিনটা যা চিনে রাখা ভালো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাধারণ Website এ নিচের Record গুলো কম লাগে, কিন্তু কোনো না কোনো দিন
                সামনে আসবেই। তখন যেন অচেনা না লাগে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SRV:</strong> A Record শুধু বলে কোন যন্ত্র, কিন্তু কোন
                  Port তা বলে না। SRV দুইটাই বলে, এই সেবা অমুক নামের যন্ত্রের অমুক
                  Port এ। Website এর জন্য লাগে না, কারণ Browser জানেই Port 443।
                  কিন্তু Voice Call, Chat বা কিছু Database সেবা নিজেদের ঠিকানা
                  এভাবে খুঁজে নেয়। এর নামটা দেখতে অদ্ভুত, _সেবা._প্রোটোকল দিয়ে
                  শুরু হয়।
                </ListItem>
                <ListItem>
                  <strong>CAA:</strong> বলে দেয় কোন কোন সংস্থা আপনার Domain এর
                  জন্য HTTPS সার্টিফিকেট বানাতে পারবে। না থাকলে যে কেউ পারে,
                  থাকলে শুধু তালিকার লোকজন। একটা বাড়তি নিরাপত্তার স্তর। HTTPS এর
                  মডিউলে আবার দেখা হবে।
                </ListItem>
                <ListItem>
                  <strong>PTR:</strong> উল্টো দিকের প্রশ্ন, এই IP র নাম কী? একে
                  বলে Reverse DNS। এটা Domain এর মালিক বসান না, বসায় IP র মালিক
                  (Hosting বা ISP)। মূলত ইমেইল সার্ভারের জন্য জরুরি, PTR না থাকলে
                  অনেক জায়গা সেই সার্ভারের ইমেইল নেয় না।
                </ListItem>
                <ListItem>
                  <strong>SOA:</strong> আগের অংশেই দেখলেন, Zone এর মলাট।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "srv-caa.zone",
          code: `; SRV: অগ্রাধিকার, ওজন, Port, তারপর নাম
_sip._tcp     SRV   3600   10 5 5060 sip.provider.example

; CAA: শুধু Let's Encrypt সার্টিফিকেট বানাতে পারবে
@             CAA   3600   0 issue "letsencrypt.org"`,
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "name-field",
      subHeader: { index: "010", title: "The Name Field" },
      title: <SectionTitle>Name ঘরের ছোট ছোট ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Record বসাতে গিয়ে বেশিরভাগ ভুল হয় Value তে নয়, Name ঘরে। চারটা
                জিনিস জানলে এই ভুলগুলো আর হবে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>@ মানে মূল নাম:</strong> Name এ @ লিখলে বোঝায় Domain টা
                  নিজে, কোনো উপনাম ছাড়া। কিছু পাতায় @ এর বদলে ঘরটা ফাঁকা রাখতে
                  হয়, বা পুরো Domain লিখতে হয়। তিনটা একই জিনিস।
                </ListItem>
                <ListItem>
                  <strong>উপনামে শুধু সামনের অংশ:</strong> api.islandtours.example
                  এর জন্য Name এ শুধু api লিখুন। পুরো নাম লিখলে কিছু পাতা সেটাকে
                  api.islandtours.example.islandtours.example বানিয়ে ফেলে, আর
                  Record টা কাজ করে না।
                </ListItem>
                <ListItem>
                  <strong>* মানে বাকি সব:</strong> Name এ তারকা চিহ্ন বসালে সেটা
                  এমন যেকোনো উপনামের উত্তর দেয় যার নিজের Record নেই। একে বলে
                  Wildcard। প্রতিটা গ্রাহককে আলাদা উপনাম দিতে হলে খুব কাজের, কিন্তু
                  ভুল বানানের নামও তখন খুলে যায়, তাই ভেবে ব্যবহার করুন।
                </ListItem>
                <ListItem>
                  <strong>শেষের ফোঁটা:</strong> মনে আছে সেই লুকানো শেষের ফোঁটা,
                  যেটা Root? কিছু পুরনো ধাঁচের পাতায় Value তে নাম লেখার সময় শেষে
                  ফোঁটা না দিলে সে নিজের Domain জুড়ে দেয়। আধুনিক পাতাগুলো এটা
                  নিজে সামলায়, তবে অদ্ভুত লম্বা নাম দেখলে এটাই প্রথম সন্দেহ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "বসানোর পর নিজে পড়ে দেখুন",
          content: (
            <p>
              Save করার পর Record এর তালিকায় ফিরে দেখুন পুরো নামটা কী দেখাচ্ছে।
              বেশিরভাগ পাতা Save এর পর পুরো নামটা (যেমন api.islandtours.example)
              লিখে দেখায়। সেটা আপনার চাওয়া নামের সাথে হুবহু মিললে ঠিক আছে। দশ
              সেকেন্ডের এই অভ্যাস ঘণ্টার পর ঘণ্টা খোঁজাখুঁজি বাঁচায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "add-record",
      subHeader: { index: "011", title: "Adding a Record" },
      title: <SectionTitle>হাতে কলমে, একটা Record বসানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সব DNS সেবার পাতা দেখতে আলাদা, কিন্তু কাজটা সবখানে একই ছয় ধাপ।
              ধরুন api.islandtours.example নামে নতুন Backend সার্ভার জুড়বেন। তার
              আগে নিচে কাজ বেছে দেখে নিন কোন কাজে কোন Record লাগে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WhichRecordLab /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "সঠিক জায়গাটা খুঁজে বের করুন",
              description:
                "আগে নিশ্চিত হোন আপনার Name Server কোথায়, কারণ Record বসবে সেখানেই। dig +short NS দিয়ে দেখে নিন। তারপর সেই সেবায় ঢুকে Domain টা বেছে DNS, DNS Records বা Zone Editor নামের পাতায় যান।",
            },
            {
              title: "Add Record চাপুন, Type বাছুন",
              description:
                "নতুন Record যোগ করার বোতামে চাপুন। প্রথমে Type বাছুন, কারণ Type অনুযায়ী বাকি ঘরগুলো বদলে যায়। সার্ভারের IP জানা আছে, তাই এখানে A।",
            },
            {
              title: "Name লিখুন",
              description:
                "Name ঘরে শুধু api লিখুন, পুরো নাম নয়। মূল নামের জন্য হলে লিখতেন @।",
            },
            {
              title: "Value লিখুন",
              description:
                "Value ঘরে সার্ভারের IP বসান, যেমন 103.94.135.3। সামনে পেছনে ফাঁকা জায়গা যেন না থাকে, কপি করলে প্রায়ই একটা বাড়তি ফাঁকা ঢুকে যায়।",
            },
            {
              title: "TTL ঠিক করুন, Save করুন",
              description:
                "নতুন জিনিস, এখনো পরীক্ষা চলছে, তাই TTL 300 রাখুন, বা Auto। সব স্থির হলে পরে বাড়িয়ে নেবেন। তারপর Save।",
            },
            {
              title: "যাচাই করুন",
              description:
                "তালিকায় দেখুন পুরো নামটা ঠিক দেখাচ্ছে কি না। তারপর Terminal এ dig +short A api.islandtours.example চালান। IP টা এলে কাজ শেষ। না এলে সরাসরি Name Server কে জিজ্ঞেস করে দেখুন সেখানে আছে কি না।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "email-setup",
      subHeader: { index: "012", title: "Setting up Email" },
      title: <SectionTitle>হাতে কলমে, নিজের Domain এ ইমেইল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              hello@islandtours.example এর মতো নিজের নামের ইমেইল চালু করা DNS
              Record এর সবচেয়ে বড় হাতে কলমে কাজ, কারণ এতে একসাথে চার ধরনের Record
              লাগে। ইমেইল সেবা যেটাই হোক (Google Workspace, Zoho, Microsoft 365),
              ধাপগুলো একই। প্রতিটা মান সেবাটা নিজে দেয়, আপনি শুধু ঠিক জায়গায়
              বসান।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "মালিকানা প্রমাণ করুন (TXT)",
              description:
                "ইমেইল সেবায় Domain যোগ করলে সে একটা যাচাইয়ের লেখা দেবে। সেটা মূল নামে (@) একটা TXT Record হিসেবে বসান, তারপর সেবার পাতায় Verify চাপুন। সে DNS এ লেখাটা খুঁজে পেলে মেনে নেয় Domain আপনার।",
            },
            {
              title: "ইমেইলের ঠিকানা বসান (MX)",
              description:
                "সেবা এক বা একাধিক MX দেবে, প্রতিটার সাথে একটা অগ্রাধিকারের সংখ্যা। আগের পুরনো MX থাকলে মুছে দিন, তারপর নতুনগুলো হুবহু বসান। এই ধাপের পর থেকে আপনার Domain এ ইমেইল আসতে শুরু করে।",
            },
            {
              title: "কে পাঠাতে পারে, বলে দিন (SPF)",
              description:
                "সেবার দেওয়া SPF লেখাটা মূল নামে একটা TXT হিসেবে বসান। আগে থেকে একটা SPF থাকলে নতুন বসাবেন না, পুরনোটার ভেতরেই নতুন include যোগ করুন, কারণ SPF একটাই থাকতে পারে।",
            },
            {
              title: "সই চালু করুন (DKIM)",
              description:
                "সেবার পাতায় DKIM চালু করলে সে একটা Name আর একটা লম্বা Value দেবে। Name টা দেখতে হবে কিছু একটা ._domainkey এর মতো। দুইটাই হুবহু কপি করে একটা TXT (কিছু সেবায় CNAME) হিসেবে বসান।",
            },
            {
              title: "নীতি ঠিক করুন (DMARC)",
              description:
                "_dmarc নামে একটা TXT বসান, শুরুতে p=none দিয়ে, আর রিপোর্ট পাওয়ার জন্য নিজের একটা ইমেইল ঠিকানা দিন। এতে কিছু আটকাবে না, শুধু রিপোর্ট আসবে কে আপনার নামে ইমেইল পাঠাচ্ছে।",
            },
            {
              title: "পরীক্ষা করুন",
              description:
                "অন্য একটা ঠিকানা থেকে নিজের নতুন ঠিকানায় ইমেইল পাঠান, আর উল্টোটাও। পৌঁছানো ইমেইলের Original বা Show Source খুলে দেখুন SPF, DKIM আর DMARC এর পাশে pass লেখা আছে কি না। তিনটাই pass হলে কাজ নিখুঁত।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "MX না থাকলে আসে না, বাকি তিনটা না থাকলে পৌঁছায় না",
          content: (
            <p>
              চারটার কাজ আলাদা করে মনে রাখুন। MX ছাড়া আপনার কাছে ইমেইল আসবেই না।
              আর SPF, DKIM, DMARC ছাড়া আপনার পাঠানো ইমেইল যাবে ঠিকই, কিন্তু
              গ্রহীতার Inbox এ না পৌঁছে Spam এ পড়বে, বা একেবারেই ফেরত আসবে। আজকাল
              বড় ইমেইল সেবাগুলো এই তিনটা ছাড়া ইমেইল প্রায় নেয়ই না। তাই বুকিং
              নিশ্চিতকরণের ইমেইল পর্যটকের কাছে পৌঁছাতে হলে চারটাই লাগবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "mistakes",
      subHeader: { index: "013", title: "Common Mistakes" },
      title: <SectionTitle>যে ভুলগুলো প্রায় সবাই একবার করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>মূল নামে CNAME:</strong> মূল নামে CNAME বসাতে চাওয়া। বেশিরভাগ
                পাতা বসাতেই দেবে না, আর দিলে ইমেইল ভেঙে যায়। মূল নামে A, বা সেবাটার
                ALIAS বা Flattening।
              </ListItem>
              <ListItem>
                <strong>CNAME এর সাথে আরেক Record:</strong> www এ একটা CNAME আছে,
                তার উপর আবার www এ একটা A বা TXT বসানো। একটা নামে CNAME থাকলে আর
                কিছু চলে না।
              </ListItem>
              <ListItem>
                <strong>পুরনো Record মুছতে ভুলে যাওয়া:</strong> নতুন A বসালেন,
                পুরনোটা রয়ে গেল। এখন অর্ধেক মানুষ পুরনো সার্ভারে যাচ্ছে।
              </ListItem>
              <ListItem>
                <strong>Name এ পুরো Domain লেখা:</strong> ফলে নামটা দুইবার জুড়ে
                যায়। Save এর পর পুরো নামটা পড়ে নিন।
              </ListItem>
              <ListItem>
                <strong>Value তে https বা স্ল্যাশ:</strong> CNAME এর Value তে
                https://cname.hosting.example/ লেখা। এখানে শুধু নামটা বসে, কোনো
                https, কোনো স্ল্যাশ নয়।
              </ListItem>
              <ListItem>
                <strong>দুইটা SPF:</strong> দুইটাই বাতিল হয়ে যায়। একটাতেই সব
                include।
              </ListItem>
              <ListItem>
                <strong>MX এ IP:</strong> MX এ সবসময় নাম।
              </ListItem>
              <ListItem>
                <strong>ভুল জায়গায় বসানো:</strong> Name Server এক জায়গায়, Record
                বসালেন আরেক জায়গায়। সেই Record কেউ কখনো পড়বে না।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "project",
      subHeader: { index: "014", title: "Project Example" },
      title: <SectionTitle>Island Tours এর পুরো Zone</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সব টুকরো এক জায়গায়। Island Tours এর জন্য একটা বাস্তবসম্মত DNS
              তালিকা দেখতে এমন হবে। প্রতিটা সারি পড়ে নিজেকে জিজ্ঞেস করুন, এটা কোন
              প্রশ্নের উত্তর দিচ্ছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ZoneTableDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>সাইট আর API আলাদা সারি:</strong> মূল নাম যায় Website এর
                সার্ভারে, api উপনাম যায় Backend এ। পরে একটাকে আলাদা করে বড় করতে বা
                সরাতে হলে শুধু সেই একটা সারি বদলাবেন, অন্যটা ছোঁবেন না।
              </ListItem>
              <ListItem>
                <strong>ইমেইল পুরোপুরি আলাদা:</strong> MX দেখাচ্ছে ইমেইল সেবার
                দিকে। তাই Website এর সার্ভার বন্ধ থাকলেও বুকিং এর ইমেইল আসা যাওয়া
                বন্ধ হয় না।
              </ListItem>
              <ListItem>
                <strong>বুকিং এর ইমেইল যেন পৌঁছায়:</strong> SPF, DKIM আর DMARC
                ঠিক না থাকলে পর্যটকের বুকিং নিশ্চিতকরণ Spam এ হারিয়ে যায়, আর
                তিনি ভাবেন বুকিং হয়নি। ব্যবসার জন্য এটা ছোট কারিগরি বিষয় নয়, সরাসরি
                টাকার ব্যাপার।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "request-flow",
      subHeader: { index: "015", title: "Step-by-step Flow" },
      title: <SectionTitle>www লিখলে Record গুলো যেভাবে কাজ করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একজন পর্যটক www.islandtours.example লিখলেন। উপরের Zone এ www একটা
              CNAME। Resolver কোন কোন Record পড়ে IP তে পৌঁছায়, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "NS ধরে Authoritative এ",
              description:
                "Resolver তার চেনা হাঁটা হেঁটে TLD server থেকে islandtours.example এর NS Record পেল, মানে জানল হিসাব কার কাছে।",
            },
            {
              title: "www এর A চাইল",
              description:
                "সে Authoritative কে জিজ্ঞেস করল, www.islandtours.example এর A Record কী? কিন্তু www এর নিচে A নেই, আছে একটা CNAME।",
            },
            {
              title: "CNAME পেল, আরেকটা নাম",
              description:
                "server উত্তর দিল, www আসলে islandtours.example এর ডাকনাম। এটা IP নয়, তাই Resolver এর কাজ এখনো শেষ হয়নি।",
            },
            {
              title: "সেই নামের A খুঁজল",
              description:
                "Resolver এবার islandtours.example এর A Record চাইল, আর পেল 103.94.135.2। CNAME এর পথ ধরে অবশেষে একটা IP।",
            },
            {
              title: "IP ফেরত, TTL সহ",
              description:
                "Resolver IP টা পর্যটকের যন্ত্রকে দিল, আর দুইটা Record ই নিজের TTL অনুযায়ী Cache এ রাখল। এরপর যন্ত্র চেনা পথে সার্ভারে পৌঁছাল।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "resources",
      subHeader: { index: "016", title: "Best Resources" },
      title: <SectionTitle>আরও দেখতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিজে প্রতিটা ধরন জিজ্ঞেস করুন</strong>, নিচের Lab এ প্রতিটা
                Record এর জন্য একটা করে কমান্ড আছে। একটা চেনা সাইটের পুরো তালিকা
                নিজে বের করে পড়ুন।
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning, DNS Records</strong>, প্রতিটা Record
                এর আলাদা ছোট পাতা, উদাহরণ সহ।{" "}
                <a
                  href="https://www.cloudflare.com/learning/dns/dns-records/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/dns/dns-records
                </a>
              </ListItem>
              <ListItem>
                <strong>MXToolbox</strong>, একটা Domain এর MX, SPF, DKIM আর DMARC
                ঠিক আছে কি না, এক জায়গায় পরীক্ষা করার সাইট।{" "}
                <a
                  href="https://mxtoolbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  mxtoolbox.com
                </a>
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "recap",
      subHeader: { index: "017", title: "Recap" },
      title: <SectionTitle>৫ মিনিটে পুরো লেসন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                একটা Record একটা সারি, চার ঘর, Name, Type, TTL, Value। একটা Domain
                এর সব সারি মিলে Zone। প্রতিটা Type একটা প্রশ্নের উত্তর।
              </ListItem>
              <ListItem>
                <strong>A</strong> নাম থেকে IPv4, <strong>AAAA</strong> নাম থেকে
                IPv6। একই নামে একাধিক A মানে ভিড় ভাগ।
              </ListItem>
              <ListItem>
                <strong>CNAME</strong> একটা নামের ডাকনাম, IP নয়। যে নামে CNAME,
                সেখানে আর কিছু থাকে না, আর মূল নামে CNAME বসে না।
              </ListItem>
              <ListItem>
                <strong>Subdomain</strong> একটা নাম (Name এর ঘর),{" "}
                <strong>CNAME</strong> একটা উত্তরের ধরন (Type এর ঘর)। Subdomain এ
                A ও বসে, আর CNAME অন্যের Domain এর দিকেও যায়।
              </ListItem>
              <ListItem>
                <strong>MX</strong> ইমেইল কোথায় যাবে, অগ্রাধিকারের সংখ্যা সহ।
                Value তে নাম, IP নয়।
              </ListItem>
              <ListItem>
                <strong>TXT</strong> মালিকানার প্রমাণ আর ইমেইলের সুরক্ষা, SPF কে
                পাঠাতে পারে, DKIM সই, DMARC নীতি। SPF একটাই।
              </ListItem>
              <ListItem>
                <strong>NS</strong> হিসাব কার কাছে, <strong>SOA</strong> Zone এর
                মলাট আর নেই উত্তরের মেয়াদ। <strong>SRV</strong> সেবার যন্ত্র আর
                Port। CAA আর PTR চিনে রাখুন।
              </ListItem>
              <ListItem>
                Name ঘরে @ মানে মূল নাম, উপনামে শুধু সামনের অংশ, * মানে বাকি সব।
                Save এর পর পুরো নামটা পড়ে নিন।
              </ListItem>
              <ListItem>
                নিজের Domain এ ইমেইল মানে চারটা কাজ, TXT দিয়ে প্রমাণ, MX, SPF,
                DKIM, আর DMARC।
              </ListItem>
              <ListItem>
                পরের লেসন: এই সব Record একটা সত্যিকারের সেবায় হাতে কলমে, Cloudflare
                DNS, Proxy আর DNS Only।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["Record", "এক লাইনে"],
    rows: [
      [<span className="font-bold text-primary">A</span>, "নাম থেকে IPv4 ঠিকানা"],
      [<span className="font-bold text-primary">AAAA</span>, "নাম থেকে IPv6 ঠিকানা"],
      [
        <span className="font-bold text-primary">CNAME</span>,
        "একটা নাম আরেকটা নামের ডাকনাম, মূল নামে বসে না",
      ],
      [
        <span className="font-bold text-primary">MX</span>,
        "ইমেইল কোন সার্ভারে যাবে, অগ্রাধিকার সহ",
      ],
      [
        <span className="font-bold text-primary">TXT</span>,
        "যেকোনো লেখা, মালিকানার প্রমাণ, SPF, DKIM, DMARC",
      ],
      [
        <span className="font-bold text-primary">NS</span>,
        "এই Domain এর Authoritative server কারা",
      ],
      [
        <span className="font-bold text-primary">SRV</span>,
        "একটা সেবা কোন যন্ত্রের কোন Port এ",
      ],
      [
        <span className="font-bold text-primary">SOA</span>,
        "Zone এর মলাট, নেই উত্তরের মেয়াদ এখানে",
      ],
      [
        <span className="font-bold text-primary">CAA / PTR</span>,
        "কে সার্টিফিকেট দিতে পারে, আর IP থেকে উল্টো নাম",
      ],
      [
        <span className="font-bold text-primary">@ আর *</span>,
        "@ মানে মূল নাম, * মানে বাকি সব উপনাম",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "api.islandtours.example কে একটা সার্ভারের IP তে নিতে কোন Record, আর Name ঘরে কী লিখবেন?",
        options: [
          {
            key: "A",
            text: "A Record, Name এ api",
            isCorrect: true,
            explanation:
              "ঠিক। IP জানা আছে তাই A, আর Name এ শুধু সামনের অংশ api। পুরো নাম লিখলে সেটা দুইবার জুড়ে যেতে পারে।",
          },
          {
            key: "B",
            text: "MX Record, Name এ @",
            isCorrect: false,
            explanation: "MX শুধু ইমেইলের জন্য, আর @ মানে মূল নাম, উপনাম নয়।",
          },
          {
            key: "C",
            text: "CNAME Record, Value তে IP",
            isCorrect: false,
            explanation: "CNAME এর Value তে নাম বসে, IP নয়।",
          },
        ],
      },
      {
        id: 2,
        text: "মূল নামে (শুধু islandtours.example) CNAME বসানো যায় না কেন?",
        options: [
          {
            key: "A",
            text: "CNAME খুব ধীর",
            isCorrect: false,
            explanation: "গতির ব্যাপার নয়, এটা একটা নিয়মের ব্যাপার।",
          },
          {
            key: "B",
            text: "যে নামে CNAME থাকে সেখানে আর কোনো Record চলে না, অথচ মূল নামে NS এর মতো Record থাকতেই হয়",
            isCorrect: true,
            explanation:
              "ঠিক। তাই মূল নামে A বসে, অথবা DNS সেবার ALIAS বা CNAME Flattening ব্যবহার করতে হয়।",
          },
          {
            key: "C",
            text: "মূল নামে কোনো Record ই বসে না",
            isCorrect: false,
            explanation: "বসে, A, MX, TXT, NS সবই বসে। শুধু CNAME নয়।",
          },
        ],
      },
      {
        id: 3,
        text: "Website দিব্যি চলছে, কিন্তু Domain এর ঠিকানায় কোনো ইমেইল আসছে না। কোন Record দেখবেন?",
        options: [
          {
            key: "A",
            text: "A Record",
            isCorrect: false,
            explanation: "A সাইটের ঠিকানা। ইমেইল A দেখে আসে না।",
          },
          {
            key: "B",
            text: "MX Record",
            isCorrect: true,
            explanation:
              "ঠিক। ইমেইল কোথায় যাবে সেটা শুধু MX বলে। এটা না থাকলে বা ভুল হলে ইমেইল আসে না, সাইট যতই ভালো চলুক।",
          },
          {
            key: "C",
            text: "AAAA Record",
            isCorrect: false,
            explanation: "AAAA হলো IPv6 ঠিকানা, ইমেইলের সাথে সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার পাঠানো ইমেইল গ্রহীতার Spam এ পড়ছে। কোন Record গুলো আগে দেখা উচিত?",
        options: [
          {
            key: "A",
            text: "SPF, DKIM আর DMARC (তিনটাই TXT)",
            isCorrect: true,
            explanation:
              "ঠিক। এই তিনটা প্রমাণ করে ইমেইলটা সত্যিই আপনার Domain থেকে এসেছে। না থাকলে বা ভুল হলে ইমেইল সন্দেহের তালিকায় পড়ে।",
          },
          {
            key: "B",
            text: "NS আর SOA",
            isCorrect: false,
            explanation: "এগুলো Zone এর মালিকানার, ইমেইল বিশ্বাসযোগ্যতার নয়।",
          },
          {
            key: "C",
            text: "CNAME",
            isCorrect: false,
            explanation: "CNAME ডাকনাম, ইমেইল সুরক্ষার সাথে সরাসরি সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "দুইটা ইমেইল সেবা ব্যবহার করছেন, তাই দুইটা আলাদা SPF Record বসালেন। ফল কী?",
        options: [
          {
            key: "A",
            text: "দুইটাই দিব্যি কাজ করবে",
            isCorrect: false,
            explanation: "না। একটা নামে SPF একটাই থাকতে পারে।",
          },
          {
            key: "B",
            text: "দুইটাই বাতিল, একটাতেই দুইটা include লিখতে হতো",
            isCorrect: true,
            explanation:
              "ঠিক। একাধিক SPF থাকলে যাচাই ব্যর্থ হয়। সমাধান, একটা Record, ভেতরে সব সেবার include।",
          },
          {
            key: "C",
            text: "শুধু প্রথমটা কাজ করবে",
            isCorrect: false,
            explanation: "কোনোটাই নির্ভরযোগ্যভাবে কাজ করে না।",
          },
        ],
      },
      {
        id: 6,
        text: "Google বলল একটা লম্বা লেখা DNS এ বসিয়ে প্রমাণ করুন Domain টা আপনার। কোন Record, আর এটা প্রমাণ হয় কেন?",
        options: [
          {
            key: "A",
            text: "TXT, কারণ DNS শুধু মালিকই বদলাতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। লেখাটা DNS এ দেখা গেলে বোঝা যায় যে বসিয়েছে তার হাতে Domain এর নিয়ন্ত্রণ আছে।",
          },
          {
            key: "B",
            text: "A, কারণ IP মালিকের পরিচয়",
            isCorrect: false,
            explanation: "A তে শুধু IP বসে, যাচাইয়ের লেখা বসে না।",
          },
          {
            key: "C",
            text: "MX, কারণ Google ইমেইল সেবা",
            isCorrect: false,
            explanation: "MX ইমেইলের ঠিকানা, যাচাইয়ের লেখার জায়গা নয়।",
          },
        ],
      },
      {
        id: 7,
        text: "www এ একটা CNAME আছে। এবার www এ একটা TXT ও বসাতে চান। কী হবে?",
        options: [
          {
            key: "A",
            text: "বসবে, কোনো সমস্যা নেই",
            isCorrect: false,
            explanation: "না। CNAME এর নামে আর কিছু চলে না।",
          },
          {
            key: "B",
            text: "চলবে না, যে নামে CNAME সেখানে আর কোনো Record থাকতে পারে না",
            isCorrect: true,
            explanation:
              "ঠিক। CNAME বলে এই নামের সব কিছু অন্য নামে দেখুন, তাই পাশে আর কিছু রাখা স্ববিরোধী।",
          },
          {
            key: "C",
            text: "TXT টা CNAME কে মুছে দেবে",
            isCorrect: false,
            explanation: "নিজে থেকে মোছে না, পাতা সাধারণত বসাতেই দেয় না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "একটা সাইটের পুরো খাতা পড়ুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "A আর AAAA",
        description: "একটা নামের IPv4 আর IPv6 ঠিকানা আলাদা করে বের করুন।",
      },
      {
        title: "CNAME এর পথ",
        description:
          "একটা www নামের CNAME কোথায় যায়, আর শেষে কোন IP তে পৌঁছায়, পুরো পথটা দেখুন।",
      },
      {
        title: "MX আর অগ্রাধিকার",
        description: "একটা Domain এর ইমেইল সার্ভারগুলো আর তাদের অগ্রাধিকার দেখুন।",
      },
      {
        title: "TXT, SPF আর DMARC",
        description:
          "একটা Domain এর TXT থেকে SPF খুঁজুন, তারপর আলাদা করে DMARC দেখুন।",
      },
      {
        title: "NS আর SOA",
        description:
          "Name Server গুলো আর Zone এর মলাট দেখুন, নেই উত্তরের মেয়াদটা খুঁজে বের করুন।",
      },
      {
        title: "পুরো ছবি, এক কমান্ডে",
        description: "উত্তরের পুরো গঠনটা পড়তে শিখুন, চারটা ঘর মিলিয়ে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-a-aaaa.sh",
        language: "bash",
        code: `dig +short A google.com        # IPv4
dig +short AAAA google.com     # IPv6, অনেক লম্বা

# দুইটাই পেলে সাইটটা Dual Stack, দুই ধরনের ঠিকানাতেই চলে।
# AAAA তে কিছু না এলে সাইটটার IPv6 নেই।`,
      },
      {
        filename: "2-cname-path.sh",
        language: "bash",
        code: `# শুধু CNAME টুকু
dig +short CNAME www.github.com

# পুরো পথ, ডাকনাম থেকে IP পর্যন্ত
dig +noall +answer www.github.com
# প্রথম লাইনে CNAME (একটা নাম), পরের লাইনে সেই নামের A (IP)।
# এটাই CNAME এর সেই বাড়তি ধাপ, নিজের চোখে।`,
      },
      {
        filename: "3-mx.sh",
        language: "bash",
        code: `dig +short MX google.com
# প্রতিটা লাইনে আগে একটা সংখ্যা, তারপর একটা নাম।
# সংখ্যাটা অগ্রাধিকার, ছোটটা আগে চেষ্টা করা হয়।

# সেই নামের IP বের করুন (MX এ নাম থাকে, IP নয়)
dig +short A smtp.google.com`,
      },
      {
        filename: "4-txt-spf-dmarc.sh",
        language: "bash",
        code: `# সব TXT, এর মধ্যে v=spf1 দিয়ে শুরু লাইনটাই SPF
dig +short TXT google.com
dig +short TXT google.com | grep spf1

# DMARC থাকে আলাদা নামে, _dmarc উপনামে
dig +short TXT _dmarc.google.com
# p=reject মানে না মিললে ফিরিয়ে দিন, p=none মানে শুধু নজর রাখুন`,
      },
      {
        filename: "5-ns-soa.sh",
        language: "bash",
        code: `dig +short NS github.com

dig +short SOA github.com
# উত্তরে সাতটা অংশ: মূল Name Server, দায়িত্বে থাকা ঠিকানা,
# সংস্করণ নম্বর, তারপর চারটা সময়।
# একদম শেষ সংখ্যাটাই নেই উত্তর (NXDOMAIN) কতক্ষণ Cache এ থাকবে।`,
      },
      {
        filename: "6-read-answer.sh",
        language: "bash",
        code: `dig +noall +answer github.com
#   github.com.    60    IN    A    20.205.243.166
#   ^Name          ^TTL  ^     ^Type ^Value
#
# চার ঘর: Name, TTL, Type, Value। মাঝের IN মানে Internet,
# সবসময় থাকে, উপেক্ষা করুন।
#
# যেকোনো ধরন জিজ্ঞেস করতে নামের আগে ধরনটা লিখুন:
dig +noall +answer MX github.com
dig +noall +answer TXT github.com`,
      },
    ],
    tip: "ছয় নম্বর পরীক্ষাটা দিয়ে শেষ করুন, কারণ এখানে এই লেসনের প্রথম ছবিটা সত্যি হয়ে ওঠে। dig এর একটা উত্তরের লাইনে সেই চার ঘরই সাজানো, Name, TTL, Type আর Value। একবার এই লাইনটা পড়তে শিখলে যেকোনো Record, যেকোনো সাইটের, আপনি পড়তে পারবেন। তারপর নিজের পছন্দের একটা সাইট নিয়ে ছয়টা কমান্ডই চালান, আর কাগজে তার পুরো Zone টা এঁকে ফেলুন।",
  },
  assignment: {
    title: "Mini Project: একটা সাইটের Zone আঁকা, আর নিজেরটা সাজানো",
    time: "৭৫ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>একটা সাইটের খাতা:</strong> একটা চেনা সাইট বেছে Lab এর কমান্ডগুলো
        দিয়ে তার A, AAAA, MX, NS আর TXT বের করুন। একটা ছকে সাজান, চার ঘরে, Name,
        Type, TTL, Value।
      </span>,
      <span key="2">
        <strong>ইমেইল কোথায়:</strong> সেই সাইটের MX দেখে আন্দাজ করুন তারা কোন
        ইমেইল সেবা ব্যবহার করে। তাদের SPF আর DMARC আছে কি? DMARC এর p এর মান কী?
      </span>,
      <span key="3">
        <strong>নিজের Zone সাজান:</strong> Island Tours এর জন্য একটা পুরো Record
        তালিকা লিখুন। থাকতে হবে মূল সাইট, www, api, একটা admin উপনাম, ইমেইল
        (MX), SPF আর DMARC। প্রতিটার পাশে TTL আর এক লাইনে কারণ।
      </span>,
      <span key="4">
        <strong>ভুল ধরুন:</strong> এই চারটা সারিতে কী কী ভুল আছে লিখুন: (ক) @
        CNAME cname.hosting.example, (খ) @ MX 10 103.94.135.9, (গ) www CNAME
        https://islandtours.example/, (ঘ) একই নামে দুইটা v=spf1 Record।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় লিখুন (৬ লাইন):</strong> একজন বন্ধু নিজের Domain এ
        ইমেইল চালু করতে চান। তাঁকে বোঝান কোন চার ধরনের Record লাগবে, কোনটা কী কাজ
        করে, আর কোন ক্রমে বসাতে হবে।
      </span>,
    ],
    deliverables: [
      <span key="1">একটা সাইটের Record এর ছক</span>,
      <span key="2">সেই সাইটের ইমেইল সেবা, SPF আর DMARC এর অবস্থা</span>,
      <span key="3">Island Tours এর পুরো Zone, TTL আর কারণ সহ</span>,
      <span key="4">চারটা সারির ভুল আর সঠিক রূপ</span>,
      <span key="5">নিজের Domain এ ইমেইল চালুর ব্যাখ্যা, ৬ লাইনে</span>,
    ],
  },
};
