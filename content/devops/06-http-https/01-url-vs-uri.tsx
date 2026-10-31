/**
 * What: Module 06 Lesson 01, URL vs URI. Teaches what a URL is, every part of it, how Bengali text
 * and special characters travel inside one, how relative links resolve, what an origin is, how to
 * design URLs for my-tours, and the security traps that live in a URL.
 *
 * Why: Every later lesson in the HTTP module starts from a URL: the request line carries its path,
 * CORS and cookies are judged by its origin, TLS starts because of its scheme. So the module opens
 * by taking that one line apart. Every output shown here was produced by running the commands.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  EncodeCompareLab,
  OriginCheckLab,
  RelativeResolveLab,
  UrlInspectorLab,
} from "../../../components/course/topics/http/url-animations";
import {
  HostVsPathSplit,
  OpenRedirectSplit,
  PercentBytesDiagram,
  UriFamilyDiagram,
  UrlAnatomyDiagram,
  UrlReadersDiagram,
} from "../../../components/course/topics/http/url-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const urlVsUriContent: TopicData = {
  id: "url-vs-uri",
  introduction: {
    badge: "MODULE 06 · LESSON 01",
    title: <SectionTitle>Address Bar এর এক লাইনে কতগুলো প্রশ্নের উত্তর</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          পর্যটক অনেক খুঁজে অবশেষে পছন্দের ট্যুরটা পেলেন। Saint Martin, ২০ ডিসেম্বর,
          দুইজন। নিচে আগের যাত্রীদের Review গুলোও পড়লেন। এবার বন্ধুকে দেখাতে চান। তিনি
          Address Bar থেকে লাইনটা কপি করে Messenger এ পাঠিয়ে দিলেন:{" "}
          <code>
            https://islandtours.example/tours/saint-martin?date=2026-12-20&amp;guests=2#reviews
          </code>
        </ContentParagraph>
        <ContentParagraph>
          বন্ধু অন্য শহরে, অন্য ফোনে, অন্য Browser এ লিংকটায় চাপ দিলেন। তাঁর পর্দায় খুলল ঠিক
          সেই ট্যুর, সেই তারিখ, দুইজনের হিসাবে দাম, আর পাতাটা নিজে থেকে নেমে গেল Review এর
          অংশে। কেউ তাঁকে কিছু বুঝিয়ে দেয়নি। একটা মাত্র লাইন এতগুলো কথা বয়ে নিয়ে গেল কীভাবে?
          আর দুইটা আলাদা যন্ত্র লাইনটাকে হুবহু একইভাবে পড়ল কীভাবে?
        </ContentParagraph>
        <ContentParagraph>
          আগের Module শেষে একটা প্রশ্ন রেখে এসেছিলাম: TCP তো একটা নির্ভরযোগ্য রাস্তা বানিয়ে
          দিল, কিন্তু Browser সেই রাস্তা দিয়ে আসলে বলে কী? সেই উত্তরের শুরুটা এই লাইনেই।
          Browser কিছু বলার আগে লাইনটা পড়ে, টুকরো করে, আর প্রতিটা টুকরো আলাদা একজনের হাতে
          তুলে দেয়। এই লেসনে আপনি শিখবেন URI, URL আর URN এর তফাত, একটা URL এর প্রতিটা টুকরো
          কী বলে আর কার কাছে যায়, বাংলা লেখা আর বিশেষ চিহ্ন URL এ কীভাবে বসে, পাতার ভেতরের ছোট
          লিংক কোথায় গিয়ে দাঁড়ায়, Origin কী, my-tours এর URL কীভাবে সাজাবেন, আর URL এর ভেতরে
          লুকিয়ে থাকা নিরাপত্তার ফাঁদ গুলো।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "চিঠির খামে ঠিকানা লেখার একটা ক্রম আছে: নাম, বাসা, রাস্তা, শহর, দেশ। ক্রমটা সবাই মানেন বলেই পৃথিবীর যেকোনো ডাকপিয়ন খামটা হাতে নিয়ে বুঝে ফেলেন কোথায় যেতে হবে। URL হলো Internet এর সেই খাম, আর তার ক্রমটা মানে পৃথিবীর প্রতিটা Browser।",
      author: "URL",
      role: "Lesson 01",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-urls",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা লাইন, যা পড়ে পৃথিবীর যেকোনো যন্ত্র একই জিনিস খুঁজে পায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ডাকঘরের কথা ভাবুন। একটা খামে যদি শুধু লেখা থাকে রহিম সাহেবের বাসা, ডাকপিয়ন
                কিছুই করতে পারবেন না। কোন দেশ, কোন শহর, কোন রাস্তা, কোন বাসা, এই তথ্য গুলো
                একটা নির্দিষ্ট ক্রমে থাকতে হয়, আর সেই ক্রমটা পাঠানো মানুষ আর ডাকপিয়ন দুইজনকেই
                জানতে হয়। নিয়মটা আগে থেকে সবাই মেনে নিয়েছেন বলেই একটা খাম চট্টগ্রাম থেকে
                সিলেট পৌঁছায়, মাঝে কাউকে ফোন করে জিজ্ঞেস করতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                Internet এর সমস্যাটা হুবহু এক। কোটি কোটি যন্ত্রে কোটি কোটি জিনিস রাখা আছে: একটা
                পাতা, একটা ছবি, একটা ট্যুরের তালিকা, একটা বুকিং, কারো Email এর ঠিকানা। এদের
                প্রত্যেককে এমনভাবে লিখতে হবে যাতে Browser, curl, ফোনের App, আপনার Node Script,
                সবাই লেখাটা পড়ে একই জিনিস খুঁজে পায়। এই লেখার নিয়মটার নাম URI, আর নিয়মটা লেখা
                আছে RFC 3986 নামের একটা কাগজে। Browser গুলো আরও খুঁটিনাটি সহ যে নিয়ম মেনে চলে
                তার নাম WHATWG URL Standard। দুইটার মূল কথা একই।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা শব্দ বারবার আসবে, Resource। Resource মানে এমন যেকোনো জিনিস যাকে একটা
                নাম দিয়ে চেনানো যায়। Saint Martin ট্যুরের পাতাটা একটা Resource, তার ছবিটা আরেকটা,
                আর বুকিং নম্বর <code>bk_7Q2M9X</code> ও একটা Resource। একটা জিনিস প্রথমেই মাথায়
                ঢুকিয়ে নিন: Resource মানেই Disk এ রাখা একটা File নয়।{" "}
                <code>/tours/saint-martin</code> নামে Island Tours এর Server এ কোনো File নেই। কেউ
                চাইলে App টা Database থেকে ট্যুরের তথ্য তুলে সেই মুহূর্তে পাতাটা বানায়। URL শুধু
                বলে কোন জিনিসটা চাই, জিনিসটা কীভাবে তৈরি হবে তা Server এর ব্যাপার।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "একটা URL চারটা প্রশ্নের উত্তর দেয়",
          content: (
            <ContentList>
              <ListItem>
                <strong>কীভাবে কথা বলবেন?</strong> শুরুর <code>https</code> অংশটা। কোন নিয়মে,
                কোন Protocol এ যোগাযোগ হবে।
              </ListItem>
              <ListItem>
                <strong>কোথায়?</strong> <code>islandtours.example</code>, মানে কোন যন্ত্রে, আর
                লেখা থাকলে সেই যন্ত্রের কোন Port এ।
              </ListItem>
              <ListItem>
                <strong>কী চাই?</strong> <code>/tours/saint-martin?date=2026-12-20&amp;guests=2</code>,
                কোন জিনিসটা আর কোন শর্তে।
              </ListItem>
              <ListItem>
                <strong>পাতার কোথায় চোখ রাখবেন?</strong> শেষের <code>#reviews</code>। এই প্রশ্নটা
                শুধু Browser এর নিজের জন্য, Server এর জন্য নয়। কেন, সেটা এই লেসনের সবচেয়ে মজার
                অংশগুলোর একটা।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "uri-url-urn",
      subHeader: { index: "002", title: "URI, URL, URN" },
      title: <SectionTitle>URI, URL আর URN: একই পরিবারের তিনটা নাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা শব্দ শুনতে প্রায় এক, আর Interview এ প্রায়ই জিজ্ঞেস করা হয়। আসলে তফাতটা খুব
                সহজ, একটা মানুষকে চেনানোর দুইটা উপায় ভাবলেই পরিষ্কার হয়।
              </ContentParagraph>
              <ContentParagraph>
                একজন মানুষকে আপনি দুইভাবে চেনাতে পারেন। এক, তাঁর জাতীয় পরিচয়পত্রের নম্বর দিয়ে।
                নম্বরটা সারাজীবন একই থাকে, আর পৃথিবীতে আর কারো সাথে মেলে না। কিন্তু নম্বর জানলেই
                আপনি জানেন না মানুষটা এখন কোথায় থাকেন। দুই, তাঁর বাসার ঠিকানা দিয়ে। ঠিকানা বলে
                দেয় কোথায় গেলে তাঁকে পাবেন, আর কীভাবে যাবেন। কিন্তু তিনি বাসা বদলালে ঠিকানাও
                বদলায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>URI</strong>, Uniform Resource Identifier। যেকোনো উপায়ে একটা Resource কে
                  চেনানোর লেখা। এটা পুরো পরিবারের নাম, ছাতাটা।
                </ListItem>
                <ListItem>
                  <strong>URL</strong>, Uniform Resource Locator। এমন URI যা চেনানোর পাশাপাশি
                  বলে দেয় জিনিসটা কোথায় আছে আর কীভাবে পৌঁছাতে হবে। বাসার ঠিকানা।{" "}
                  <code>https://islandtours.example/tours/saint-martin</code> একটা URL, কারণ এটা
                  পড়েই Browser জানে কোন Protocol, কোন যন্ত্র, কোন পাতা।
                </ListItem>
                <ListItem>
                  <strong>URN</strong>, Uniform Resource Name। এমন URI যা শুধু একটা স্থায়ী নাম দেয়,
                  কোথায় আছে বলে না। পরিচয়পত্রের নম্বর। একটা বইয়ের ISBN নম্বরকে URN হিসেবে লেখা যায়,{" "}
                  <code>urn:isbn:9780000000002</code>। এটা পড়ে আপনি জানেন কোন বইটার কথা হচ্ছে,
                  কিন্তু কোন দোকানে বা কোন Server এ পাবেন তা জানেন না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UriFamilyDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["নাম", "কী বলে", "উদাহরণ", "কোথায় দেখবেন"],
          rows: [
            [mono("URI"), "কোনো একটা জিনিসকে চেনায়, যেকোনো উপায়ে", "নিচের সবগুলোই", "RFC, HTTP এর নিয়মপত্র, OAuth এর redirect_uri"],
            [mono("URL"), "কোথায় আছে আর কীভাবে পৌঁছাবেন", "https://islandtours.example/tours", "Address Bar, লিংক, API, প্রায় সবখানে"],
            [mono("URN"), "শুধু স্থায়ী নাম, অবস্থান নয়", "urn:isbn:9780000000002", "বই, নথি, কিছু XML আর পুরনো নিয়মপত্র"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার কাজের জগতের সত্যি কথাটা বলি। প্রতিদিনের কাজে প্রায় সবাই সবকিছুকে URL বলেন,
                আর সেটা ভুলও নয়। Browser যে WHATWG URL Standard মেনে চলে, সেটা ইচ্ছা করেই URI আর
                URL এর তফাত তুলে দিয়েছে, সবকিছুকেই URL বলে। Node এর <code>new URL()</code> একটা
                URN কেও দিব্যি Parse করে দেয়। তাই আপনি যখন Code লিখবেন, URL বললেই চলবে। URI শব্দটা
                আপনি দেখবেন মূলত নিয়মপত্রে আর কিছু নির্দিষ্ট জায়গায়, যেমন OAuth এর{" "}
                <code>redirect_uri</code> বা Database এর Connection URI তে।
              </ContentParagraph>
              <ContentParagraph>
                Database এর কথাটা আলাদা করে মনে রাখুন, কারণ SQL Track এ আপনি এটা রোজ ব্যবহার
                করেছেন। <code>DATABASE_URL</code> Environment Variable এ যা থাকে, সেটাও একটা URL:{" "}
                <code>postgresql://app_user:...@db.internal:5432/tours</code>। Scheme টা{" "}
                <code>postgresql</code>, Host <code>db.internal</code>, Port <code>5432</code>,
                Path <code>/tours</code> মানে Database এর নাম। আর মাঝের ব্যবহারকারীর নাম আর
                Password অংশটা নিয়ে একটু পরেই একটা জরুরি সতর্কবার্তা আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Interview এ এক লাইনে",
          content: (
            <p>
              প্রতিটা URL একটা URI, কিন্তু প্রতিটা URI একটা URL নয়। URL চেনায় আর অবস্থানও বলে,
              URN শুধু চেনায়। এটুকু বলার পর একটা উদাহরণ দিন, যেমন ISBN নম্বর বনাম বইয়ের দোকানের
              ঠিকানা, আর যোগ করুন যে Browser এর নিজের নিয়মে আজকাল সবকিছুকেই URL বলা হয়। এই শেষ
              কথাটাই দেখায় যে আপনি শুধু মুখস্থ করেননি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>একটা URL কে টুকরো টুকরো করে দেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পর্যটকের পাঠানো লিংকটা নিন, তবে এবার একটা জিনিস যোগ করে। Port টা সাধারণত লেখা থাকে
                না, কিন্তু বোঝার সুবিধার জন্য এবার লিখে দিচ্ছি:{" "}
                <code>
                  https://islandtours.example:443/tours/saint-martin?date=2026-12-20&amp;guests=2#reviews
                </code>
                । নিচের ছবিতে লাইনটা তার টুকরো গুলোতে ভাগ করা আছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UrlAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টুকরো গুলো আলাদা হয় কিছু বিশেষ চিহ্ন দিয়ে, আর Parser, মানে যে Program লাইনটা পড়ে
                ভাগ করে, ঠিক এই চিহ্ন গুলোই খোঁজে। ক্রমটা একবার মুখস্থ করে ফেলুন, কারণ এটা কখনো
                বদলায় না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  প্রথম <code>:</code> পর্যন্ত Scheme। এখানে <code>https</code>।
                </ListItem>
                <ListItem>
                  <code>{"//"}</code> এর পর থেকে শুরু হয় Authority, মানে কোন যন্ত্র আর কোন Port। পরের{" "}
                  <code>/</code>, <code>?</code> বা <code>#</code> এ গিয়ে শেষ।
                </ListItem>
                <ListItem>
                  Authority শেষ হওয়ার পরের <code>/</code> থেকে শুরু Path, চলে <code>?</code> বা{" "}
                  <code>#</code> পর্যন্ত।
                </ListItem>
                <ListItem>
                  <code>?</code> থেকে শুরু Query, চলে <code>#</code> পর্যন্ত।
                </ListItem>
                <ListItem>
                  <code>#</code> থেকে শেষ পর্যন্ত Fragment।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই চিহ্ন গুলোর এই কাজ আছে বলেই একটা ঝামেলা তৈরি হয়। ধরুন পর্যটক Search এ লিখলেন{" "}
                <code>beach &amp; family</code>। লেখাটার মাঝের <code>&amp;</code> চিহ্নটা Query তে
                বসালে Parser ভাববে এখানে একটা জোড়া শেষ হয়ে নতুন জোড়া শুরু হলো। এই সমস্যার সমাধান
                Percent-encoding, যা আসবে আট নম্বর সেকশনে। আপাতত শুধু মনে রাখুন, URL এর প্রতিটা
                বিশেষ চিহ্নের একটা চাকরি আছে।
              </ContentParagraph>
              <ContentParagraph>
                এবার নিজে হাতে চেষ্টা করুন। নিচের Inspector টা আপনার Browser এর নিজের URL Parser
                ব্যবহার করে, ঠিক যেটা Address Bar এ কাজ করে। তাই এখানে যা দেখবেন, সত্যিকারের Browser
                ও ঠিক তাই করবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UrlInspectorLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Inspector এ <code>:443</code> সহ লিংকটা দিলে দেখবেন port এর ঘরটা খালি। Parser নিজেই
              443 মুছে দিয়েছে, কারণ https এর জন্য 443 তো এমনিতেই ধরে নেওয়া হয়। একই কাজ Node ও করে।
              নিচের Script টা লেসনের শেষের Lab এর প্রথম পরীক্ষা, আর ফলাফলটা সত্যিই চালিয়ে পাওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "parse-output.txt",
          code: `$ node 1-parse.mjs "https://islandtours.example:443/tours/saint-martin?date=2026-12-20&guests=2#reviews"
href      "https://islandtours.example/tours/saint-martin?date=2026-12-20&guests=2#reviews"
protocol  "https:"
username  ""
password  ""
hostname  "islandtours.example"
port      ""
pathname  "/tours/saint-martin"
search    "?date=2026-12-20&guests=2"
hash      "#reviews"
origin    "https://islandtours.example"

Query এর প্রতিটা জোড়া:
   date = 2026-12-20
   guests = 2

Server এর কাছে যাবে: /tours/saint-martin?date=2026-12-20&guests=2`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "সাধারণ চেহারাটা",
          content: (
            <p>
              সব টুকরো একসাথে লিখলে একটা URL এর পূর্ণ চেহারা দাঁড়ায়{" "}
              <code>scheme://userinfo@host:port/path?query#fragment</code>। এর মধ্যে শুধু Scheme
              বাধ্যতামূলক। বাকি প্রতিটা অংশ দরকার না হলে বাদ দেওয়া যায়, যেমন{" "}
              <code>mailto:help@mail.example</code> এ <code>{"//"}</code> নেই, Host নেই, শুধু Scheme
              আর Path। কোন অংশ কখন থাকে আর কখন থাকে না, সামনের সেকশন গুলোতে একটা একটা করে দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "scheme",
      subHeader: { index: "004", title: "Scheme" },
      title: <SectionTitle>Scheme: কোন নিয়মে কথা বলা হবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                URL এর প্রথম শব্দটা Program কে বলে দেয় এই লাইনটা নিয়ে কী করতে হবে। একই ঠিকানা
                তিনভাবে লেখা যায়, আর তিনবার তিনটা আলাদা ঘটনা ঘটে।{" "}
                <code>https://islandtours.example</code> লিখলে Browser একটা Encrypted Connection
                খুলে পাতা চায়। <code>wss://islandtours.example/ws</code> লিখলে একটা WebSocket খোলে,
                যেটা দিয়ে Server নিজে থেকে বার্তা পাঠাতে পারে (লেসন ১০)। আর{" "}
                <code>mailto:help@mail.example</code> এ চাপ দিলে Browser কোনো Server এর কাছেই যায়
                না, আপনার Email App খুলে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Scheme", "Default Port", "কী হয়", "কোথায় দেখবেন"],
          rows: [
            [mono("http"), "80", "Encryption ছাড়া Web। তারের পাশে যে কেউ পড়তে পারে", "আজকাল মূলত https এ পাঠিয়ে দেওয়ার জন্য, লেসন ০৭"],
            [mono("https"), "443", "TLS দিয়ে Encrypted Web", "প্রায় সব সাইট আর API, লেসন ০৭ আর ০৮"],
            [mono("ws, wss"), "80, 443", "WebSocket, দুই দিকে একটানা কথা", "Live Seat Map, Chat, লেসন ১০"],
            [mono("mailto"), "নেই", "Email App খোলে, To আর Subject বসানো", "যোগাযোগ পাতার Email লিংক"],
            [mono("tel"), "নেই", "ফোনের Dialer খোলে", "ফোনে Call করুন বোতাম"],
            [mono("data"), "নেই", "জিনিসটা URL এর ভেতরেই লেখা থাকে", "ছোট Icon, CSS এর ভেতরে ছবি"],
            [mono("file"), "নেই", "নিজের যন্ত্রের Disk এর File", "Browser এ একটা HTML File টেনে আনলে"],
            [mono("postgresql"), "5432", "Database এর সাথে Connection", "DATABASE_URL, SQL Track"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Scheme বড় হাতে লিখলেও চলে, <code>HTTPS://</code> আর <code>https://</code> একই।
                Parser সবসময় ছোট হাতের অক্ষরে বদলে নেয়, তাই নিজে লেখার সময় ছোট হাতেই লিখুন।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা প্রশ্ন, যা অনেকে কখনো ভেবে দেখেননি। Address Bar এ শুধু{" "}
                <code>islandtours.example</code> লিখে Enter চাপলেও তো পাতা খোলে, Scheme কোথায় গেল?
                উত্তর হলো Browser নিজে অনুমান করে। লেখাটা দেখতে একটা Domain এর মতো হলে আধুনিক
                Browser আগে <code>https://</code> জুড়ে চেষ্টা করে। আর লেখাটা দেখতে Domain এর মতো না
                হলে, যেমন <code>saint martin tour</code>, সেটা Search Engine এ পাঠিয়ে দেয়। এই দয়াটা
                শুধু Address Bar এর। আপনার Code এর ভেতরে কেউ অনুমান করবে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "no-scheme.txt",
          code: `$ node 1-parse.mjs "islandtours.example/tours"
TypeError: Invalid URL
  code: 'ERR_INVALID_URL',
  input: 'islandtours.example/tours'

# Scheme ছাড়া লেখাটা Parser এর কাছে URL ই নয়।
# ভুল URL এ চুপচাপ ভুল ফল না দিয়ে Error ছোড়ে, আর এটাই ভালো।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "javascript: একটা Scheme, আর সেটাই বিপদ",
          content: (
            <p>
              <code>javascript:alert(1)</code> ও একটা বৈধ URL, যার Scheme <code>javascript</code>।
              এমন লিংকে চাপ দিলে Browser কোনো পাতায় যায় না, লেখাটাকে Code হিসেবে চালিয়ে দেয়। তাই
              ব্যবহারকারীর দেওয়া কোনো লিংক, যেমন Profile এ নিজের Website এর ঘর, পাতায় বসানোর আগে
              Scheme দেখে নিতে হয়। শুধু <code>http</code> আর <code>https</code> চলবে, বাকি সব বাতিল।
              তেরো নম্বর সেকশনে এর Code আছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "authority",
      subHeader: { index: "005", title: "Authority" },
      title: <SectionTitle>Authority: কোন যন্ত্র, কোন দরজা, আর একটা পুরনো ফাঁদ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>{"//"}</code> এর পরের অংশটার নাম Authority। এর তিনটা টুকরো হতে পারে: userinfo,
                Host আর Port। Host টা প্রায় সবসময় থাকে, বাকি দুইটা ঐচ্ছিক।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Host</strong> হলো যন্ত্রটার নাম বা সরাসরি তার IP Address। নাম হলে, যেমন{" "}
                <code>islandtours.example</code>, Browser কে আগে DNS জিজ্ঞেস করে IP জেনে নিতে হয়,
                যার পুরো গল্পটা Module 04 এ পড়েছেন। উত্তর আসে <code>103.94.135.2</code>। আর Host এর
                জায়গায় সরাসরি IP লিখলে DNS এর দরকারই পড়ে না। বাসার Router এর Setting পাতা খুলতে
                আপনি হয়তো <code>http://192.168.1.1/</code> লিখেছেন, এটা ঠিক সেই জিনিস (Module 03)।
              </ContentParagraph>
              <ContentParagraph>
                IPv6 ঠিকানার বেলায় একটা মজার ঝামেলা আছে। IPv6 এর ভেতরেই কোলন থাকে,{" "}
                <code>2001:db8::7334</code>, আর URL এ কোলন মানে এর পরে Port। তাহলে Parser বুঝবে কীভাবে
                কোনটা ঠিকানার কোলন আর কোনটা Port এর? সমাধান হলো IPv6 ঠিকানাকে চারকোনা বন্ধনীর ভেতরে
                রাখা: <code>http://[2001:db8::7334]:8080/status</code>। বন্ধনীর ভেতরের সব কোলন ঠিকানার,
                বাইরেরটা Port এর।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Port</strong> বলে যন্ত্রের কোন দরজায় টোকা দিতে হবে, Module 05 এর Port and
                Socket লেসনে যা বিস্তারিত দেখেছেন। প্রতিটা Scheme এর একটা Default Port আছে, http এর
                80 আর https এর 443। Default Port হলে লেখার দরকার নেই, আর লিখলেও Parser মুছে দেয়। Port
                লিখতে হয় শুধু যখন সেটা Default নয়। নিজের ল্যাপটপে Dev Server চালালে আপনি রোজ লেখেন{" "}
                <code>http://localhost:3000</code>, কারণ 3000 কোনো Scheme এর Default নয়।
              </ContentParagraph>
              <ContentParagraph>
                Host এ বড় আর ছোট হাতের অক্ষরের কোনো তফাত নেই, ঠিক যেমন DNS এ ছিল না। Parser সব ছোট
                হাতে বদলে নেয়। তাই <code>https://ISLANDTOURS.Example:443/Tours</code> Parse করলে
                পাবেন <code>https://islandtours.example/Tours</code>। খেয়াল করুন, Host ছোট হলো, Port
                উধাও হলো, কিন্তু <code>/Tours</code> এর বড় T রয়ে গেল। কেন, সেটা পরের সেকশনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার তৃতীয় টুকরো, <strong>userinfo</strong>। Host এর আগে একটা <code>@</code> থাকলে,
                তার আগের সবটুকু userinfo, মানে ব্যবহারকারীর নাম আর চাইলে কোলনের পরে Password। বহু
                বছর আগে FTP Server এ ঢুকতে মানুষ এভাবে লিখতেন। আজ Web এ এর প্রায় কোনো ভালো ব্যবহার
                নেই, কিন্তু একটা খারাপ ব্যবহার খুব জনপ্রিয়। নিচের লিংকটা দেখুন আর বলুন তো, এটা কোথায়
                নিয়ে যাবে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "at-sign-trick.txt",
          code: `$ node 1-parse.mjs "https://islandtours.example@attacker.example/login"
href      "https://islandtours.example@attacker.example/login"
protocol  "https:"
username  "islandtours.example"
password  ""
hostname  "attacker.example"
port      ""
pathname  "/login"
search    ""
hash      ""
origin    "https://attacker.example"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লিংকটা শুরু হয়েছে <code>https://islandtours.example</code> দিয়ে, তাই চোখ বলে এটা
                Island Tours। কিন্তু Parser বলছে Host হলো <code>attacker.example</code>। কারণ{" "}
                <code>@</code> এর আগের পুরো <code>islandtours.example</code> লেখাটা আসলে একটা
                ব্যবহারকারীর নাম, কোনো Host নয়। Phishing Email এ এই কৌশলটা বহু বছর ধরে চলছে। অনেক
                Browser এমন লিংকে সতর্ক করে, আর Chrome পাতার ভেতরের ছবি বা Script আনতে এমন URL ব্যবহার
                করতে দেয় না। কিন্তু ধরে নেবেন না যে প্রতিটা App, প্রতিটা Email Client আপনাকে বাঁচাবে।
              </ContentParagraph>
              <ContentParagraph>
                userinfo এর একটা বৈধ ব্যবহার আজও টিকে আছে, আর সেটা আগের সেকশনের Database URL।{" "}
                <code>postgresql://app_user:PASSWORD@db.internal:5432/tours</code> এ{" "}
                <code>app_user</code> ব্যবহারকারী, কোলনের পরে Password। এই কারণেই{" "}
                <code>DATABASE_URL</code> একটা গোপন জিনিস। এটা থাকে Environment Variable এ, কখনো
                Code এ বা Git এ নয়। আর App চালু হওয়ার সময় এই URL টা Log এ ছাপাবেন না, কারণ Log পড়েন
                অনেক মানুষ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "লিংকে @ দেখলে থামুন",
          content: (
            <p>
              একটা Web লিংকের <code>{"//"}</code> আর প্রথম <code>/</code> এর মাঝে কোথাও{" "}
              <code>@</code> দেখলে, আসল Host হলো <code>@</code> এর ডানের অংশটা, বাঁয়ের নয়। নিজের
              পরিবারের কাউকে এই একটা নিয়ম শিখিয়ে দিলেও অনেক প্রতারণা থেকে বাঁচবেন। আর নিজের
              সাইটের কোনো লিংকে কখনো Password বসাবেন না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "path",
      subHeader: { index: "006", title: "Path" },
      title: <SectionTitle>Path: Server এর ভেতরে কোন জিনিসটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Path দেখতে ঠিক Computer এর Folder এর পথের মতো, <code>/tours/saint-martin</code>। আর
                শুরুর দিনে সত্যিই তাই ছিল। Web Server Path টা নিয়ে সোজা Disk এ সেই File খুঁজত,{" "}
                <code>/about.html</code> মানে Disk এর about.html File। আজও ছবি, CSS আর JavaScript এর
                মতো Static File এভাবেই আসে।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু আধুনিক App এ Path হলো একটা Route, মানে App এর কাছে একটা অনুরোধের নাম। Island
                Tours এর App <code>/tours/saint-martin</code> দেখে বোঝে এটা ট্যুরের পাতা, শেষ অংশটা{" "}
                <code>saint-martin</code> হলো ট্যুরের Slug। Slug মানে ছোট হাতের অক্ষর আর হাইফেনে লেখা
                একটা পড়ার মতো পরিচয়, যা দিয়ে App Database এ ট্যুরটা খুঁজে আনে। Disk এ এই নামে কোনো
                File নেই।
              </ContentParagraph>
              <ContentParagraph>
                এখন তিনটা ব্যাপার, যেগুলো না জানলে আপনি একদিন অবাক হবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>এক, Path এ বড় হাত আর ছোট হাত আলাদা।</strong> Host এর মতো নয়। নিয়ম বলে{" "}
                <code>/Tours</code> আর <code>/tours</code> দুইটা আলাদা Path। সেগুলো একই পাতা দেখাবে
                কি না, সেটা Server এর মর্জি। সবচেয়ে চেনা দুর্ঘটনাটা এরকম: Mac এ Disk সাধারণত বড় আর
                ছোট হাতের তফাত করে না, তাই <code>Boat.jpg</code> নামের ছবি <code>/img/boat.jpg</code>{" "}
                লিখলেও আপনার ল্যাপটপে দিব্যি দেখা যায়। Linux Server এ তফাত করে, তাই Deploy এর পরে
                ছবিটা 404। নিয়মটা সহজ: URL এ সবসময় ছোট হাতের অক্ষর।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দুই, শেষের / টা আলাদা একটা URL।</strong> <code>/tours</code> আর{" "}
                <code>/tours/</code> দুইটা আলাদা ঠিকানা। বেশিরভাগ Framework একটাকে আরেকটায় পাঠিয়ে
                দেয়, যাতে একটা পাতার দুইটা ঠিকানা না থাকে। Next.js এর Default হলো শেষের / সরানো,{" "}
                <code>/about/</code> চাইলে সে আপনাকে <code>/about</code> এ পাঠায়। এই সাইটটাও Next.js
                এ বানানো, চাইলে Address Bar এ একটা লেসনের ঠিকানার শেষে / দিয়ে দেখতে পারেন। আর শেষের
                / পাতার ভেতরের ছোট লিংক গুলোর গন্তব্য বদলে দেয়, যা দশ নম্বর সেকশনে হাতে কলমে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>তিন, <code>.</code> আর <code>..</code> মুছে ফেলা হয়।</strong> Terminal এ যেমন{" "}
                <code>cd ..</code> মানে এক ধাপ উপরে, URL এও তাই। Parser পাঠানোর আগেই এগুলো হিসাব করে
                মুছে ফেলে। নিচে দুইটা Request পাঠানো হয়েছে একই লেখা দিয়ে, একবার সাধারণভাবে আর একবার
                curl কে বলে লেখাটা যেমন আছে তেমনই পাঠাতে। পাশে লেখা আছে Server আসলে কী পেল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "dot-segments.sh",
          code: `$ curl -sv "http://localhost:47610/tours/../api/./tours" -o /dev/null 2>&1 | grep '^> GET'
> GET /api/tours HTTP/1.1

$ curl -sv --path-as-is "http://localhost:47610/tours/../api/./tours" -o /dev/null 2>&1 | grep '^> GET'
> GET /tours/../api/./tours HTTP/1.1

# Server এর Log, পরীক্ষা ২ এর Script থেকে:
GET /api/tours   Host: localhost:47610
GET /tours/../api/./tours   Host: localhost:47610`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Path Traversal, যখন Server নিজে মোছে না",
          content: (
            <p>
              দ্বিতীয় Request টা দেখাল যে কেউ চাইলে <code>..</code> সহ লেখাটা হুবহু Server এ পাঠাতে
              পারে। এখন ধরুন একটা Server অসাবধানে Path টা নিয়ে সোজা Disk এ File খোঁজে। কেউ পাঠাল{" "}
              <code>/img/../../etc/passwd</code>, আর Server ছবির Folder ছেড়ে উঠে গিয়ে System এর
              একটা File পাঠিয়ে দিল। এই আক্রমণের নাম Path Traversal। এর থেকে বাঁচার উপায় হলো
              ব্যবহারকারীর দেওয়া Path কখনো সরাসরি Disk এর পথ হিসেবে না নেওয়া। Caddy আর Nginx এর মতো
              পরীক্ষিত Server Static File এর কাজটা এমনিতেই নিরাপদে করে, তাই কাজটা তাদের হাতেই দিন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "query",
      subHeader: { index: "007", title: "Query" },
      title: <SectionTitle>Query: একই জিনিস, ভিন্ন শর্তে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি দোকানে গিয়ে বললেন, শার্ট দেখান। এটা Path, কোন জিনিস চাই। তারপর বললেন, নীল রঙের,
                মাঝারি মাপের, দাম কম থেকে বেশি সাজিয়ে। এগুলো শার্ট বদলায় না, শুধু কোন শার্ট গুলো আর
                কোন ক্রমে দেখাবেন তা বলে। URL এ এই শর্ত গুলোর জায়গা Query।
              </ContentParagraph>
              <ContentParagraph>
                Query শুরু হয় <code>?</code> দিয়ে। তারপর <code>key=value</code> জোড়া, একাধিক জোড়া
                হলে মাঝে <code>&amp;</code>। Island Tours এর ট্যুর খোঁজার URL{" "}
                <code>/tours?date=2026-12-20&amp;guests=2</code> এ দুইটা জোড়া: তারিখ আর কতজন। ভরা
                হয় সাধারণত চার রকম কাজে: Filter (কোন তারিখ, কতজন), Sort (দাম অনুযায়ী), Page (তালিকার
                কত নম্বর পাতা), আর Search এর লেখা।
              </ContentParagraph>
              <ContentParagraph>নিয়মের দিক থেকে কয়েকটা কথা পরিষ্কার জানা দরকার।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একই Key কয়েকবার থাকতে পারে।</strong>{" "}
                  <code>?tag=beach&amp;tag=family</code> বৈধ, আর এর মানে দুইটা Tag। Code এ{" "}
                  <code>{`get("tag")`}</code> শুধু প্রথমটা দেয়, সবগুলো চাইলে <code>{`getAll("tag")`}</code>।
                </ListItem>
                <ListItem>
                  <strong>তালিকা বা Object লেখার কোনো সর্বজনীন নিয়ম নেই।</strong> কেউ লেখেন{" "}
                  <code>tag=beach&amp;tag=family</code>, কেউ <code>tag[]=beach</code>, কেউ{" "}
                  <code>tag=beach,family</code>। প্রতিটা Framework এর অভ্যাস আলাদা। নিজের API তে একটা
                  বেছে নিন আর লিখে রাখুন।
                </ListItem>
                <ListItem>
                  <strong>সবকিছুই লেখা, কোনো সংখ্যা নেই।</strong> <code>guests=2</code> এর মান Server
                  পায় <code>&quot;2&quot;</code> হিসেবে, একটা String। সংখ্যা চাইলে নিজে বদলাতে হবে, আর
                  বদলানোর আগে যাচাই করতে হবে। কেউ <code>guests=two</code> পাঠালে{" "}
                  <code>Number(&quot;two&quot;)</code> হয় <code>NaN</code>, আর যাচাই না থাকলে সেটা চুপচাপ
                  Database এর Query পর্যন্ত চলে যায়।
                </ListItem>
                <ListItem>
                  <strong>খালি মান আর না থাকা আলাদা।</strong> <code>?q=</code> মানে q আছে কিন্তু খালি,{" "}
                  <code>{`get("q")`}</code> দেয় খালি String। Key টাই না থাকলে দেয় <code>null</code>।
                </ListItem>
                <ListItem>
                  <strong>জোড়ার ক্রম App এর কাছে প্রায়ই অর্থহীন, Cache এর কাছে নয়।</strong>{" "}
                  <code>?date=...&amp;guests=2</code> আর <code>?guests=2&amp;date=...</code> App এর
                  চোখে একই খোঁজ। কিন্তু Browser আর CDN এর Cache পুরো URL টাকে চাবি হিসেবে ধরে, তাই এই
                  দুইটা তাদের কাছে আলাদা জিনিস। Cache এর পুরো গল্প লেসন ০৪ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Query হাতে লিখে জোড়া লাগানোর চেয়ে নিরাপদ উপায় হলো <code>URLSearchParams</code>,
                যা Browser আর Node দুই জায়গাতেই আছে। এটা ভাগ করা, যোগ করা, বদলানো আর Encode করা,
                সব নিজে করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "search-params.mjs",
          code: `const params = new URLSearchParams("tag=beach&tag=family&guests=2&q=");

params.getAll("tag");   // [ 'beach', 'family' ]
params.get("guests");   // '2'   একটা String, সংখ্যা নয়
params.get("q");        // ''    আছে, কিন্তু খালি
params.get("none");     // null  নেই-ই

params.append("sort", "price");   // নতুন জোড়া যোগ
params.set("guests", "4");        // থাকা জোড়ার মান বদল
params.toString();
// 'tag=beach&tag=family&guests=4&q=&sort=price'

// একটা পূর্ণ URL এর ভেতরেও একই জিনিস পাওয়া যায়
const url = new URL("https://islandtours.example/tours?date=2026-12-20&guests=2");
url.searchParams.set("guests", "3");
url.href;
// 'https://islandtours.example/tours?date=2026-12-20&guests=3'`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Query সবার চোখের সামনে থাকে",
          content: (
            <p>
              Query টা দেখতে নিরীহ, কিন্তু এটা জমা হয় অনেক জায়গায়: Browser এর History তে, Server
              এর প্রতিটা Access Log এ, মাঝের Proxy আর CDN এর Log এ, Analytics এ, আর লিংক শেয়ার করলে
              অন্য মানুষের হাতে। তাই Query তে কখনো Password, Session, Token বা ব্যক্তিগত তথ্য রাখবেন
              না। কোথায় রাখবেন, সেটা তেরো নম্বর সেকশনে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "fragment",
      subHeader: { index: "008", title: "Fragment" },
      title: <SectionTitle>Fragment: যে অংশটা কখনো Server এ যায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি একটা মোটা বই বন্ধুকে দিয়ে বললেন, ১২০ পাতা থেকে পড়িস। বইয়ের দোকানদারকে এই কথাটা
                জানানোর কোনো দরকার নেই, তিনি শুধু বইটা দেবেন। কোন পাতা খুলবেন সেটা বন্ধুর নিজের কাজ।
                Fragment ঠিক সেই কথাটা, <code>#reviews</code>।
              </ContentParagraph>
              <ContentParagraph>
                Browser পুরো পাতাটা আনার পর দেখে পাতার ভেতরে <code>id=&quot;reviews&quot;</code>{" "}
                লেখা কোনো অংশ আছে কি না, থাকলে সেখানে Scroll করে নেমে যায়। এই কাজের জন্য Server কে
                কিছু জানানোর দরকার নেই, তাই Browser Fragment টা কখনো পাঠায়ই না। কথাটা বই থেকে মেনে
                নেওয়ার দরকার নেই, নিজেই প্রমাণ করা যায়। Lab এর দ্বিতীয় পরীক্ষার ছোট Server টা প্রতিটা
                Request এ যা পায় তা ছাপায়। তাকে Fragment সহ একটা URL পাঠানো হলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "fragment-proof.txt",
          code: `$ curl -s "http://localhost:47610/tours/saint-martin?date=2026-12-20&guests=2#reviews"
{"pathname":"/tours/saint-martin","query":{"date":"2026-12-20","guests":"2"},"hash":""}

# Server এর Terminal এ যা ছাপা হলো:
GET /tours/saint-martin?date=2026-12-20&guests=2   Host: localhost:47610

# একটা সত্যিকারের সাইটেও একই ঘটনা। curl যা পাঠাল:
$ curl -sv "https://example.com/?from=lesson#top" -o /dev/null 2>&1 | grep -E '^> (GET|Host)'
> GET /?from=lesson HTTP/2
> Host: example.com`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুই জায়গাতেই <code>#reviews</code> আর <code>#top</code> গায়েব। Server এর হাতে যা
                পৌঁছায় তা শুধু Path আর Query। এই একটা তথ্য থেকে কয়েকটা কাজের কথা বেরিয়ে আসে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Server Fragment পড়তে পারে না।</strong> তাই Server এর কোনো সিদ্ধান্ত Fragment
                  এর উপর নির্ভর করতে পারে না। Server এর Log বা Analytics এও Fragment কখনো দেখা যাবে
                  না।
                </ListItem>
                <ListItem>
                  <strong>শুধু Fragment বদলালে নতুন Request যায় না।</strong> একই পাতায়{" "}
                  <code>#reviews</code> থেকে <code>#photos</code> এ গেলে Browser শুধু Scroll করে।
                  এই সাইটের ডান পাশে যে সূচিপত্রটা আছে, সেখানে চাপ দিলে পাতা আবার Load হয় না, ঠিক এই
                  কারণে। খেয়াল করলে দেখবেন প্রতিটা সেকশনের একটা id আছে।
                </ListItem>
                <ListItem>
                  <strong>পুরনো Single Page App গুলো এটাকে Route হিসেবে ব্যবহার করত।</strong>{" "}
                  <code>/#/tours/saint-martin</code> এর মতো লিংক দেখলে বুঝবেন, পুরো Path টা Fragment
                  এর ভেতরে লুকানো, যাতে পাতা বদলালেও Server এ নতুন Request না যায়। আজকের Framework
                  গুলো এর বদলে আসল Path ব্যবহার করে।
                </ListItem>
                <ListItem>
                  <strong>লেখার একটা অংশ ধরে লিংক দেওয়া যায়।</strong> আধুনিক Browser{" "}
                  <code>#:~:text=</code> দিয়ে শুরু হওয়া একটা বিশেষ Fragment বোঝে, যা পাতার ভেতরে সেই
                  লেখাটা খুঁজে রঙ করে দেখায়। Search Result থেকে কোনো পাতায় গেলে মাঝে মাঝে হলুদ রঙ
                  করা লাইন দেখেন, সেটা এই জিনিস।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <UrlReadersDiagram /> },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "encoding",
      subHeader: { index: "009", title: "Encoding" },
      title: <SectionTitle>বাংলা লেখা আর বিশেষ চিহ্ন: Percent-encoding আর Punycode</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                URL এর নিয়ম বানানো হয়েছিল খুব ছোট একটা অক্ষরের সেট দিয়ে: ইংরেজি অক্ষর, অঙ্ক আর
                হাতে গোনা কয়েকটা চিহ্ন। এর মধ্যে কিছু চিহ্নের চাকরি আছে, আগেই দেখেছেন:{" "}
                <code>: / ? # [ ] @</code> আর Query এর ভেতরে <code>&amp; =</code>। Space এর কোনো
                জায়গা নেই, আর বাংলার তো প্রশ্নই ওঠে না। অথচ পর্যটক Search এ লিখবেন সেন্ট মার্টিন,
                আর সেটা URL এ যেতেই হবে।
              </ContentParagraph>
              <ContentParagraph>
                সমাধানটার নাম Percent-encoding। নিয়মটা দুই ধাপের। প্রথমে লেখাটাকে UTF-8 নিয়মে Byte
                এ বদলানো হয়। Module 01 এর Binary লেসনে দেখেছেন, Computer এর কাছে প্রতিটা অক্ষর আসলে
                কয়েকটা Byte, আর UTF-8 এ একটা বাংলা অক্ষর তিন Byte জায়গা নেয়। তারপর প্রতিটা Byte কে
                লেখা হয় একটা শতাংশ চিহ্ন আর দুইটা Hex অক্ষর দিয়ে। Byte <code>E0</code> হয়ে যায়{" "}
                <code>%E0</code>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PercentBytesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিতে একটা জিনিস চোখে পড়ার মতো। সেন্ট লিখতে আমরা দেখি তিনটা অক্ষর, কিন্তু Unicode এর
                হিসাবে এটা পাঁচটা Code Point, কারণ এ কার আর হসন্ত আলাদা চিহ্ন। পাঁচটা Code Point,
                প্রতিটা তিন Byte, মোট ১৫ Byte, আর URL এ ৪৫ অক্ষর। পুরো সেন্ট মার্টিন লেখাটা কেমন হয়,
                নিচে Node থেকে সরাসরি দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "encode-output.txt",
          code: `$ node 3-encode.mjs

"সেন্ট মার্টিন"
  encodeURIComponent : %E0%A6%B8%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F%20%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%A8
  encodeURI          : %E0%A6%B8%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F%20%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%A8
  URLSearchParams    : q=%E0%A6%B8%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F+%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%A8

"beach & family"
  encodeURIComponent : beach%20%26%20family
  encodeURI          : beach%20&%20family
  URLSearchParams    : q=beach+%26+family

"50% off"
  encodeURIComponent : 50%25%20off
  encodeURI          : 50%25%20off
  URLSearchParams    : q=50%25+off

"a/b?c#d"
  encodeURIComponent : a%2Fb%3Fc%23d
  encodeURI          : a/b?c#d
  URLSearchParams    : q=a%2Fb%3Fc%23d`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা উপায়, আর তিনটার কাজ আলাদা। এই তফাতটা গুলিয়ে ফেলাই URL নিয়ে সবচেয়ে সাধারণ Bug।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong><code>encodeURIComponent</code></strong> একটা মানের জন্য, URL এর একটা টুকরোর
                  জন্য। এটা বিশেষ চিহ্ন গুলোকেও বদলে দেয়, <code>&amp;</code> হয় <code>%26</code>,{" "}
                  <code>/</code> হয় <code>%2F</code>। Query এর একটা মান বা Path এর একটা অংশ বানাতে এটাই।
                </ListItem>
                <ListItem>
                  <strong><code>encodeURI</code></strong> একটা পুরো URL এর জন্য, যেখানে চিহ্ন গুলো তাদের
                  চাকরি করছে। তাই এটা <code>&amp; / ? #</code> ছুঁয়েও দেখে না। একটা মানের উপর এটা চালালে
                  মানের ভেতরের <code>&amp;</code> টা Query ভেঙে দেবে। বাস্তবে এর দরকার খুব কম পড়ে।
                </ListItem>
                <ListItem>
                  <strong><code>URLSearchParams</code></strong> HTML Form এর পুরনো নিয়ম মানে, যার নাম{" "}
                  <code>application/x-www-form-urlencoded</code>। তফাত একটাই, Space হয় <code>+</code>,{" "}
                  <code>%20</code> নয়। Query বানানোর জন্য এটাই সবচেয়ে নিরাপদ, কারণ জোড়া লাগানো আর
                  Encode করা দুইটাই নিজে করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <code>+</code> নিয়ে একটা ফাঁদ আছে। <code>URLSearchParams</code>{" "}
                <code>beach+family</code> পড়ে <code>beach family</code>, কারণ তার নিয়মে + মানে
                Space। কিন্তু <code>decodeURIComponent(&quot;beach+family&quot;)</code> দেয়{" "}
                <code>beach+family</code>, + টা রয়েই যায়। তাই যে উপায়ে Encode করেছেন, Decode ও সেই
                উপায়েই করুন। নিচের Lab এ তিনটা উপায় পাশাপাশি দেখুন, আর সবচেয়ে জরুরি অংশটা নিচের
                অর্ধেকে: লেখাটা Query তে বসালে Server আসলে কী পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EncodeCompareLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "encode-mistakes.txt",
          code: `# ভুল Function বেছে নিলে Server কী পড়ে
encodeURI দিয়ে বানালে Server পড়ে  : [ [ 'q', 'beach ' ], [ ' family', '' ] ]
encodeURIComponent দিয়ে বানালে    : [ [ 'q', 'beach & family' ] ]

# দুইবার Encode করার ভুল: % নিজেই আবার %25 হয়ে যায়
একবার : %E0%A6%B8%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F
দুইবার: %25E0%25A6%25B8%25E0%25A7%2587%25E0%25A6%25A8%25E0%25A7%258D%25E0%25A6%259F
দুইবারেরটা একবার Decode করলে: %E0%A6%B8%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F

# ভাঙা Percent-encoding এ Decode ব্যর্থ হয়
decodeURIComponent("50%") -> URIError URI malformed`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইবার Encode করার ভুলটা চেনার উপায় হলো তার চেহারা। পাতায় যদি কখনো পর্যটকের নামের
                জায়গায় <code>%E0%A6%B8...</code> লেখা দেখেন, অথবা URL এ <code>%25</code> দেখেন, বুঝবেন
                কোথাও একটা মান দুইবার Encode হয়েছে। নিয়মটা সহজ: একটা মান URL এ ঢোকানোর মুহূর্তে একবার
                Encode, বের করার মুহূর্তে একবার Decode, আর দুইটা কাজই <code>URL</code> আর{" "}
                <code>URLSearchParams</code> কে করতে দিন। আর শেষের Error টা মনে রাখুন। কেউ ইচ্ছা করে
                ভাঙা একটা <code>%</code> পাঠালে আপনার Server যেন Crash না করে, বরং 400 Bad Request
                দিয়ে জানায় যে Request টা ঠিক নেই (লেসন ০৩)।
              </ContentParagraph>
              <ContentParagraph>
                এবার Host এর কথা। Domain Name এর নামও কি বাংলায় হতে পারে? পারে। বাংলাদেশের একটা নিজের
                বাংলা TLD পর্যন্ত আছে, <code>.বাংলা</code>। কিন্তু Host এ Percent-encoding চলে না, কারণ
                Domain Name এর পুরনো নিয়মে একটা Label এ শুধু ইংরেজি অক্ষর, অঙ্ক আর হাইফেন বসতে পারে।
                তাই Host এর জন্য আলাদা একটা রূপান্তর আছে, যার নাম Punycode। এই ব্যবস্থার পুরো নাম IDN,
                Internationalized Domain Name। রূপান্তরের ফল সবসময় <code>xn--</code> দিয়ে শুরু হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HostVsPathSplit /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "punycode.sh",
          code: `$ node -p 'new URL("https://দ্বীপ.example/").hostname'
xn--65bif4fxc.example

$ node -p 'new URL("https://বাংলা.বাংলা/").hostname'
xn--54b7fta0cc.xn--54b7fta0cc

# দেখতে ইংরেজি, কিন্তু কয়েকটা অক্ষর আসলে রুশ বর্ণমালার
$ node -p 'new URL("https://раураl.example/").hostname'
xn--l-7sba6dbr.example`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "দেখতে এক, আসলে আলাদা: Homograph",
          content: (
            <p>
              শেষ উদাহরণটা আবার দেখুন। <code>раураl</code> লেখাটা চোখে ইংরেজি paypal এর মতো, কিন্তু
              এর কয়েকটা অক্ষর রুশ বর্ণমালার, যারা দেখতে হুবহু ইংরেজির মতো। Punycode এ বদলালেই আসল
              চেহারা বেরিয়ে আসে, <code>xn--l-7sba6dbr.example</code>। এই প্রতারণার নাম Homograph Attack।
              তাই Browser গুলো সন্দেহজনক ভাবে বর্ণমালা মেশানো নাম দেখলে Address Bar এ বাংলা বা রুশ
              চেহারা না দেখিয়ে সরাসরি <code>xn--</code> রূপটা দেখায়। আর DNS এর Record, Certificate,
              Server এর Config, সব জায়গায় এই <code>xn--</code> রূপটাই লেখা থাকে, বাংলা রূপটা নয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "relative",
      subHeader: { index: "010", title: "Relative URL" },
      title: <SectionTitle>Relative URL: পাতার ভেতরের ছোট লিংক কোথায় যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যত URL দেখলেন সবগুলো পূর্ণ, Scheme থেকে শুরু। এদের বলে Absolute URL। কিন্তু
                একটা পাতার HTML খুললে দেখবেন বেশিরভাগ লিংক ছোট: <code>href=&quot;/tours&quot;</code>,{" "}
                <code>src=&quot;photos/boat.jpg&quot;</code>, <code>href=&quot;#reviews&quot;</code>।
                এদের বলে Relative URL। এরা একা অসম্পূর্ণ। Browser এদের পূর্ণ করে বর্তমান পাতার URL এর
                সাথে মিলিয়ে, আর বর্তমান পাতার এই URL টাকে বলে Base।
              </ContentParagraph>
              <ContentParagraph>
                ব্যাপারটা ঠিক Terminal এর মতো। আপনি একটা Folder এর ভেতরে দাঁড়িয়ে{" "}
                <code>cat notes.txt</code> লিখলে সেটা এই Folder এর notes.txt, আর{" "}
                <code>cat /etc/hosts</code> লিখলে গোড়া থেকে। URL এর নিয়মও তাই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুরুতে কিছু নেই</strong>, যেমন <code>photos/boat.jpg</code>: Base এর শেষ{" "}
                  <code>/</code> পর্যন্ত রেখে বাকিটা জুড়ে দেওয়া। শেষ <code>/</code> এর পরের অংশটাকে
                  Browser একটা File এর নাম ধরে নিয়ে ফেলে দেয়।
                </ListItem>
                <ListItem>
                  <strong><code>../</code></strong>: এক ধাপ উপরে।
                </ListItem>
                <ListItem>
                  <strong><code>/</code> দিয়ে শুরু</strong>: Host এর গোড়া থেকে, Base এর Path পুরো বাদ।
                </ListItem>
                <ListItem>
                  <strong><code>{"//"}</code> দিয়ে শুরু</strong>: নতুন Host, শুধু Scheme টা Base থেকে নেওয়া।
                </ListItem>
                <ListItem>
                  <strong><code>?</code> বা <code>#</code> দিয়ে শুরু</strong>: শুধু Query বা শুধু
                  Fragment বদলায়, বাকি সব Base এর মতো।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রথম নিয়মটাই সবচেয়ে বেশি ভোগায়, কারণ Base এর শেষে একটা <code>/</code> আছে কি নেই,
                তার উপর ফল বদলে যায়। নিচের Lab এ দুইটা Base দেওয়া আছে, তফাত শুধু শেষের /। একটা লিংক
                বেছে নিয়ে Base বদলে বদলে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RelativeResolveLab /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "resolve-output.txt",
          code: `$ node 4-resolve.mjs

Base: https://islandtours.example/tours/saint-martin
  photos/boat.jpg                          -> https://islandtours.example/tours/photos/boat.jpg
  ../sajek-valley                          -> https://islandtours.example/sajek-valley
  /api/tours                               -> https://islandtours.example/api/tours
  ?guests=4                                -> https://islandtours.example/tours/saint-martin?guests=4
  #reviews                                 -> https://islandtours.example/tours/saint-martin#reviews
  //cdn.islandtours.example/img/boat.jpg   -> https://cdn.islandtours.example/img/boat.jpg

Base: https://islandtours.example/tours/saint-martin/
  photos/boat.jpg                          -> https://islandtours.example/tours/saint-martin/photos/boat.jpg
  ../sajek-valley                          -> https://islandtours.example/tours/sajek-valley
  /api/tours                               -> https://islandtours.example/api/tours
  ?guests=4                                -> https://islandtours.example/tours/saint-martin/?guests=4
  #reviews                                 -> https://islandtours.example/tours/saint-martin/#reviews
  //cdn.islandtours.example/img/boat.jpg   -> https://cdn.islandtours.example/img/boat.jpg`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বাস্তব দুর্ঘটনা দিয়ে বুঝুন। Island Tours এর ট্যুরের পাতায় ছবিটা বসানো ছিল{" "}
                <code>src=&quot;photos/boat.jpg&quot;</code> দিয়ে। কেউ একজন লিংক শেয়ার করলেন শেষে
                একটা <code>/</code> সহ। সেই ঠিকানায় Browser ছবি খুঁজল{" "}
                <code>/tours/saint-martin/photos/boat.jpg</code> এ, যেটা নেই, তাই ভাঙা ছবি। Server
                শেষের / সরিয়ে আবার পাঠিয়ে দিলে সমস্যাটা ঢেকে যায়, কিন্তু আসল সমাধান তিনটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  ছবি, CSS আর Script এর জন্য সবসময় <code>/</code> দিয়ে শুরু করা Path লিখুন,{" "}
                  <code>/img/boat.jpg</code>। এটা যেকোনো পাতা থেকে একই জায়গায় যায়।
                </ListItem>
                <ListItem>
                  Framework এর নিজের উপায় ব্যবহার করুন। Next.js এ পাতা বদলের লিংক{" "}
                  <code>&lt;Link href=&quot;/tours/sajek-valley&quot;&gt;</code>, ছবি{" "}
                  <code>&lt;Image src=&quot;/img/boat.jpg&quot;&gt;</code>।
                </ListItem>
                <ListItem>
                  Code এ দুইটা URL জোড়া লাগাতে কখনো String যোগ করবেন না, <code>new URL(path, base)</code>{" "}
                  ব্যবহার করুন। String যোগ করলে কী হয়, তার একটা সত্যি ঘটনা আছে এই সাইটেরই। সাইটের
                  ঠিকানা লেখা ছিল শেষে / সহ, আর তার সাথে <code>/sql</code> যোগ করে Sitemap বানানো
                  হচ্ছিল। ফল দাঁড়াল <code>https://...app//sql</code>, মাঝে দুইটা /, শত শত লিংকে।
                  সমাধান ছিল এক লাইন: <code>new URL(&quot;/sql&quot;, site).href</code>।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "origin",
      subHeader: { index: "011", title: "Origin" },
      title: <SectionTitle>Origin: Browser এর চোখে কে কার আপন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সেকশনটা ছোট, কিন্তু Module এর বাকি অর্ধেক এর উপর দাঁড়িয়ে। একটা URL এর তিনটা
                টুকরো, Scheme, Host আর Port, একসাথে মিলে যা দাঁড়ায় তার নাম Origin।{" "}
                <code>https://islandtours.example/tours/saint-martin?guests=2</code> এর Origin হলো{" "}
                <code>https://islandtours.example</code>। Path, Query, Fragment, এদের কেউ Origin এর অংশ
                নয়।
              </ContentParagraph>
              <ContentParagraph>
                Browser এর কাছে Origin হলো একটা বাড়ির দেয়াল। এক Origin এর পাতায় চলা JavaScript নিজের
                Origin এর জিনিস ইচ্ছামতো পড়তে পারে, কিন্তু অন্য Origin এর জিনিস পড়তে পারে না, যদি না
                সেই অন্য Origin নিজে অনুমতি দেয়। এই নিয়মের নাম Same-Origin Policy। এর কাজটা ভাবুন: আপনি
                এক Tab এ নিজের Bank এ Login করে আছেন, আরেক Tab এ একটা অচেনা সাইট খুললেন। সেই অচেনা
                সাইটের Script যদি আপনার Bank এর পাতা থেকে তথ্য পড়তে পারত, Internet একদিনও টিকত না।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা URL একই Origin কি না, তা দেখার নিয়ম একটাই: তিনটা ঘরই মিলতে হবে। Parser আগে বড়
                হাতের অক্ষর আর Default Port সরিয়ে নেয়, তারপর মেলায়। নিচে নিজে মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OriginCheckLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["এই URL, তুলনা https://islandtours.example এর সাথে", "Same Origin?", "কারণ"],
          rows: [
            [mono("https://islandtours.example/api/tours"), "হ্যাঁ", "শুধু Path আলাদা, Path গোনা হয় না"],
            [mono("https://ISLANDTOURS.example:443/x"), "হ্যাঁ", "বড় হাত আর 443 দুইটাই Parser মুছে দেয়"],
            [mono("http://islandtours.example"), "না", "Scheme আলাদা"],
            [mono("https://www.islandtours.example"), "না", "Host আলাদা, www একটা আলাদা নাম"],
            [mono("https://api.islandtours.example"), "না", "Host আলাদা, তাই এই API ডাকতে CORS লাগবে"],
            [mono("https://islandtours.example:8443"), "না", "Port আলাদা"],
            [mono("https://seagulltours.example"), "না", "পুরোই আলাদা Domain"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই ধারণাটা কোথায় কোথায় ফিরে আসবে",
          content: (
            <p>
              Island Tours এর Website চলে <code>https://islandtours.example</code> এ। Mobile App আর
              সঙ্গী সাইটের জন্য API চলে <code>https://api.islandtours.example</code> এ, যা একটা আলাদা
              Origin। তাই Website এর পাতা থেকে সেই API ডাকতে গেলে Browser আগে API কে জিজ্ঞেস করবে,
              আপনি কি এই Origin কে অনুমতি দেন? এই জিজ্ঞাসার নিয়মের নাম CORS, লেসন ০৪ এর বড় একটা অংশ।
              আর Cookie পাঠানোর বেলায় Browser একটু ঢিলা একটা মাপকাঠি ব্যবহার করে, যার নাম Site, যেখানে{" "}
              <code>blog.islandtours.example</code> আর <code>islandtours.example</code> একই Site কিন্তু
              আলাদা Origin। সেই গল্প লেসন ০৫ এ। দুইটা লেসনেই এই তিন ঘরের নিয়মটা আপনার কাজে লাগবে।
              আর <code>mailto:</code> এর মতো যেসব URL এ Host ই নেই, তাদের কোনো Origin হয় না, Parser
              লেখে <code>null</code>।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "design",
      subHeader: { index: "012", title: "URL Design" },
      title: <SectionTitle>my-tours এর URL কীভাবে সাজাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                URL হলো আপনার App এর সামনের দরজা। মানুষ এগুলো শেয়ার করেন, Bookmark করেন, Search Engine
                এগুলো মনে রাখে, অন্য App এগুলো Code এ লিখে রাখে। একবার বাইরে চলে গেলে আর ফেরানো যায়
                না। তাই my-tours এর প্রথম পাতা বানানোর আগেই URL এর নিয়মটা ঠিক করে নিন। এখানে আটটা
                নিয়ম, যা বেশিরভাগ ভালো App মেনে চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Path এ জিনিসের নাম, Query তে শর্ত।</strong> কোন জিনিস চাই, তা Path এ:{" "}
                  <code>/tours/saint-martin</code>। সেই জিনিসের কোন রূপ দেখতে চাই, তা Query তে:{" "}
                  <code>?date=2026-12-20&amp;guests=2</code>। একটা ভালো পরীক্ষা: শর্তটা বাদ দিলেও কি
                  পাতাটা অর্থপূর্ণ থাকে? থাকলে সেটা Query।
                </ListItem>
                <ListItem>
                  <strong>বিশেষ্য, ক্রিয়া নয়।</strong> <code>/tours</code>, <code>/bookings</code>,
                  বহুবচনে। <code>/getTours</code> বা <code>/createBooking</code> নয়। দেখানো, বানানো, বদলানো
                  আর মোছা, এই কাজগুলো বলার আলাদা জায়গা আছে, HTTP Method, যা লেসন ০৩ এর বিষয়।
                </ListItem>
                <ListItem>
                  <strong>ছোট হাতের অক্ষর, শব্দের মাঝে হাইফেন।</strong> <code>saint-martin</code>,{" "}
                  <code>Saint_Martin</code> বা <code>SaintMartin</code> নয়। Search Engine হাইফেনকে শব্দের
                  বিভাজন হিসেবে পড়ে, আর বড় হাত Linux Server এ 404 এর কারণ হয়, ছয় নম্বর সেকশনে দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>ভেতরের কারিগরি বাইরে দেখাবেন না।</strong> <code>/tours.php</code> বা{" "}
                  <code>/api/v1/getTourById?id=17</code> এ ভাষা, File আর Database এর গঠন উঁকি দেয়।
                  কাল প্রযুক্তি বদলালে URL বদলাতে হবে।
                </ListItem>
                <ListItem>
                  <strong>URL চিরকালের।</strong> আজ যে লিংক কেউ শেয়ার করলেন, পাঁচ বছর পরেও যেন খোলে।
                  বদলাতে হলে পুরনো ঠিকানা থেকে নতুনটায় স্থায়ী Redirect রাখুন, 301 বা 308 (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>ব্যক্তিগত জিনিসের ID অনুমান করার মতো রাখবেন না।</strong>{" "}
                  <code>/bookings/17</code> দেখে কেউ 18 লিখে দেখতে চাইবেন। <code>bk_7Q2M9X</code> এর মতো
                  এলোমেলো ID অনুমান করা কঠিন। তবে মনে রাখুন, এটা শুধু একটা বাড়তি দেয়াল। আসল পাহারা হলো
                  প্রতিটা Request এ দেখা যে এই বুকিং এই মানুষটার কি না (লেসন ০৬)।
                </ListItem>
                <ListItem>
                  <strong>একটা পাতার একটাই ঠিকানা।</strong> <code>www</code> সহ আর ছাড়া, শেষে / সহ আর
                  ছাড়া, এরা সবাই একটা মূল ঠিকানায় Redirect হবে। এই মূল ঠিকানার নাম Canonical URL।
                </ListItem>
                <ListItem>
                  <strong>ছোট রাখুন।</strong> URL এর কোনো নির্দিষ্ট সর্বোচ্চ দৈর্ঘ্য নিয়মে লেখা নেই,
                  কিন্তু প্রতিটা Server এর একটা সীমা আছে। Nginx এর Default সীমা পার হলে Server ফেরত দেয়{" "}
                  <code>414 URI Too Long</code>। পুরনো অভিজ্ঞতা থেকে ২০০০ অক্ষরের নিচে রাখা নিরাপদ। অনেক
                  তথ্য পাঠাতে হলে সেটা যায় Request এর Body তে, URL এ নয় (লেসন ০৩)।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["এড়িয়ে চলুন", "এভাবে লিখুন", "কেন"],
          rows: [
            [mono("/getTours?id=17"), mono("/tours/saint-martin"), "Path এ জিনিসের পড়ার মতো নাম, কাজের নাম নয়"],
            [mono("/Tours/Saint_Martin"), mono("/tours/saint-martin"), "ছোট হাত আর হাইফেন"],
            [mono("/tours/saint-martin/2026-12-20/2"), mono("/tours/saint-martin?date=2026-12-20&guests=2"), "তারিখ আর মানুষ শর্ত, জিনিস নয়"],
            [mono("/tours.php?search=x"), mono("/tours?q=x"), "ভেতরের প্রযুক্তি লুকানো"],
            [mono("/bookings/17"), mono("/bookings/bk_7Q2M9X"), "অনুমান করা কঠিন, তবু Login আর মালিকানা যাচাই লাগবেই"],
            [mono("/tours?token=..."), "Cookie বা Header এ", "গোপন জিনিস URL এ কখনো নয়"],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "my-tours-url-map.txt",
          code: `# পাতা, মানুষ যেগুলো Browser এ খোলেন
/                                   Home
/tours                              সব ট্যুর
/tours?date=2026-12-20&guests=2     তারিখ আর মানুষের হিসাবে ছাঁকা তালিকা
/tours?q=সেন্ট%20মার্টিন            খোঁজ (Address Bar এ বাংলাই দেখায়)
/tours/saint-martin                 একটা ট্যুর
/tours/saint-martin#reviews         একই পাতা, Review এর অংশে
/bookings/bk_7Q2M9X                 নিজের একটা বুকিং, Login লাগবে
/login?next=/bookings/bk_7Q2M9X     Login, তারপর আগের পাতায় ফেরত

# API, পাতার JavaScript আর Mobile App যেগুলো ডাকে
/api/tours?date=2026-12-20&guests=2
/api/tours/saint-martin
/api/bookings
/api/bookings/bk_7Q2M9X
/api/me`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Canonical URL আর utm এর লেজ",
          content: (
            <p>
              Facebook এ বিজ্ঞাপন দিলে লিংকের শেষে প্রায়ই জুড়ে দেওয়া হয়{" "}
              <code>?utm_source=facebook&amp;utm_campaign=winter</code>, যাতে Analytics বোঝে মানুষ
              কোথা থেকে এলেন। পাতা একই, কিন্তু Search Engine এর চোখে এখন একই পাতার অনেক ঠিকানা। এর
              সমাধান পাতার HTML এ একটা লাইন,{" "}
              <code>&lt;link rel=&quot;canonical&quot; href=&quot;https://islandtours.example/tours/saint-martin&quot;&gt;</code>
              , যা বলে আসল ঠিকানা কোনটা। Next.js এ এটা বসানো হয় পাতার Metadata তে{" "}
              <code>alternates.canonical</code> দিয়ে। এই সাইটের প্রতিটা পাতাতেও এটা আছে, চাইলে Page
              Source খুলে <code>canonical</code> খুঁজে দেখুন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "security",
      subHeader: { index: "013", title: "Security" },
      title: <SectionTitle>URL এ যা কখনো রাখবেন না, আর একটা লিংক কীভাবে প্রতারণা করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>প্রথম নিয়ম: গোপন জিনিস URL এ নয়।</strong> ধরুন একজন Developer সহজ রাস্তা ধরে
                Login এর পরে Token টা URL এ বসিয়ে দিলেন, <code>/bookings?token=...</code>। এখন ভাবুন
                লাইনটা কোথায় কোথায় যাবে। Browser এর History তে। Caddy এর Access Log এ, যেখানে প্রতিটা
                Request এর প্রথম লাইন লেখা হয়। মাঝে কোনো CDN বা Proxy থাকলে তার Log এ। Analytics এর
                Dashboard এ। পর্যটক পাতা থেকে অন্য সাইটের লিংকে চাপ দিলে Referer নামের Header এ, সেই অন্য
                সাইটের কাছে (লেসন ০৪)। আর পর্যটক বন্ধুকে লিংকটা পাঠালে বন্ধুর হাতে, যিনি তখন পর্যটকের
                হয়ে Login করা অবস্থায় পাতাটা খুলবেন।
              </ContentParagraph>
              <ContentParagraph>
                তাই Password, Session, Token, OTP বা কোনো ব্যক্তিগত তথ্য URL এ কখনো নয়। এগুলোর জায়গা
                Cookie (লেসন ০৫), <code>Authorization</code> Header (লেসন ০৬), বা Request এর Body।
                ব্যতিক্রম একটাই জায়গায় মেনে নেওয়া হয়: Email এ পাঠানো এককালীন লিংক, যেমন Password
                ভুলে গেলে নতুন করার লিংক। সেখানে লিংকটা হতে হবে একবার ব্যবহারের, অল্প সময়ের মেয়াদের, আর
                সেই পাতা থেকে অন্য কোনো সাইটের জিনিস আনা চলবে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় নিয়ম: অন্যের দেওয়া ঠিকানায় চোখ বন্ধ করে পাঠাবেন না।</strong> Login পাতা
                প্রায়ই একটা <code>next</code> Parameter নেয়, যাতে Login এর পরে মানুষকে আগের পাতায় ফেরত
                পাঠানো যায়। Server যদি <code>next</code> এ যা আছে সেখানেই পাঠিয়ে দেয়, আক্রমণকারী তখন
                এমন একটা লিংক বানায়:{" "}
                <code>https://islandtours.example/login?next=https://attacker.example</code>। শুরুটা আসল
                সাইটের, তাই মানুষ বিশ্বাস করেন। Login ও হয় আসল সাইটে। তারপর Server নিজেই তাঁকে পাঠিয়ে
                দেয় একটা নকল পাতায়, যা দেখতে হুবহু Island Tours, আর বলে আবার Password দিন। এর নাম Open
                Redirect।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OpenRedirectSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সমাধানে প্রথম যে বুদ্ধিটা মাথায় আসে তা হলো দেখা যে <code>next</code> টা <code>/</code>{" "}
              দিয়ে শুরু কি না। এটা যথেষ্ট নয়। <code>{"//attacker.example"}</code> ও / দিয়ে শুরু, অথচ আগের
              সেকশনেই দেখেছেন দুইটা / মানে নতুন Host। আর <code>/\attacker.example</code> কে Browser
              নিজের নিয়মে <code>{"//"}</code> হিসেবে পড়ে। লেখা দেখে বিচার করলে আপনি সবসময় এক ধাপ পিছিয়ে
              থাকবেন। ঠিক উপায় হলো Browser যেভাবে বুঝবে সেভাবে Parse করা, তারপর Origin মেলানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "safe-next.mjs",
          code: `// নিজের সাইটের Origin আসে Environment Variable থেকে, Code এ লেখা নয়
const siteOrigin = process.env.SITE_ORIGIN;
if (!siteOrigin) throw new Error("SITE_ORIGIN is not set");

function safeNextPath(next) {
  if (typeof next !== "string" || next === "") return "/";
  let target;
  try {
    target = new URL(next, siteOrigin);   // Browser যেভাবে বুঝবে, ঠিক সেভাবে
  } catch {
    return "/";
  }
  if (target.origin !== new URL(siteOrigin).origin) return "/";
  return \`\${target.pathname}\${target.search}\${target.hash}\`;
}

// SITE_ORIGIN=https://islandtours.example দিয়ে চালানোর ফল:
// "/tours/saint-martin?guests=2"                  -> /tours/saint-martin?guests=2
// "/bookings/bk_7Q2M9X"                           -> /bookings/bk_7Q2M9X
// "https://attacker.example/login"                -> /
// "//attacker.example/login"                      -> /
// "/\\\\attacker.example"                           -> /
// "javascript:alert(1)"                           -> /
// "https://islandtours.example@attacker.example/" -> /`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              খেয়াল করুন Function টা কী ফেরত দেয়: পূর্ণ URL নয়, শুধু Path, Query আর Fragment। ফলে
              যা-ই আসুক, শেষ পর্যন্ত মানুষটা নিজের সাইটের ভেতরেই থাকেন। আর চার নম্বর সেকশনের{" "}
              <code>javascript:</code> সতর্কবার্তার সমাধানও একই ধাঁচের। ব্যবহারকারীর দেওয়া লিংক পাতায়
              বসানোর আগে <code>new URL(input)</code> দিয়ে Parse করুন, আর <code>protocol</code> যদি{" "}
              <code>http:</code> বা <code>https:</code> না হয়, লিংকটা বসাবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "URL এর চারটা ফাঁদ, এক জায়গায়",
          content: (
            <ContentList>
              <ListItem>
                গোপন জিনিস Query তে: History, Log, Referer আর শেয়ার করা লিংকে ফাঁস হয়।
              </ListItem>
              <ListItem>
                <code>@</code> এর কৌশল: চোখে এক Host, আসলে আরেক। Host হলো <code>@</code> এর ডানে।
              </ListItem>
              <ListItem>
                Homograph: দেখতে ইংরেজি, আসলে অন্য বর্ণমালা। <code>xn--</code> রূপটা সত্যি বলে।
              </ListItem>
              <ListItem>
                Open Redirect আর <code>javascript:</code>: অন্যের দেওয়া URL লেখা দেখে নয়, Parse করে
                Origin আর Scheme মিলিয়ে তবে ব্যবহার।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে দেখা: Browser, Node আর curl</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                URL এর প্রতিটা নিয়ম আপনি তিন জায়গায় হাতে কলমে দেখতে পারেন। কোনো কিছু Install করার দরকার
                নেই, Browser আর Node আপনার যন্ত্রে আছেই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Browser এ।</strong> Chrome সাধারণত Address Bar এ <code>https://</code> লুকিয়ে
                রাখে। Address Bar এ ডান Click করে Always show full URLs চালু করলে পুরো লাইনটা দেখবেন।
                তারপর যেকোনো পাতায় DevTools খুলুন (Mac এ Cmd Option I, Windows আর Linux এ F12), Console
                এ গিয়ে নিচের লাইন গুলো লিখুন। <code>location</code> হলো বর্তমান পাতার URL, আগে থেকেই Parse
                করা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "devtools-console.js",
          code: `// যেকোনো পাতার DevTools Console এ
location.href        // পুরো URL
location.origin      // Scheme, Host, Port
location.pathname    // Path
location.search      // Query, ? সহ
location.hash        // Fragment, # সহ

// Query থেকে একটা মান
new URLSearchParams(location.search).get("guests")

// Address Bar এ শুধু #reviews বদলে Enter চাপুন, তারপর Network Tab দেখুন:
// কোনো নতুন Request যায়নি। Fragment এর জন্য Server কে কিছু বলার নেই।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              DevTools এর Network Tab এ যেকোনো Request এ Click করলে Headers অংশে Request URL দেখবেন।
              পাতার URL এ Fragment থাকলেও এখানে কখনো থাকবে না। <strong>Node এ</strong> এক লাইনের
              পরীক্ষার জন্য <code>node -p</code> খুব কাজের, এটা লেখাটা চালিয়ে ফলটা ছাপিয়ে দেয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "node-one-liners.sh",
          code: `$ node -p 'new URL("https://islandtours.example/tours?date=2026-12-20&guests=2").searchParams.get("guests")'
2

$ node -p 'new URL("https://ISLANDTOURS.Example:443/Tours").href'
https://islandtours.example/Tours

$ node -p 'new URL("http://[2001:db8::7334]:8080/").host'
[2001:db8::7334]:8080

$ node -p 'URL.canParse("islandtours.example/tours")'
false`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>curl এ</strong> দুইটা জিনিস শিখে রাখুন। <code>-G</code> আর{" "}
              <code>--data-urlencode</code> একসাথে দিলে curl নিজেই মান গুলো Encode করে Query বানায়,
              বাংলা সহ। আর <code>-v</code> দিলে curl যা পাঠায় তা <code>&gt;</code> চিহ্ন দিয়ে ছাপায়,
              তাই প্রথম লাইনেই দেখা যায় Server আসলে কী পেল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-urls.sh",
          code: `# পরীক্ষা ২ এর Server চালু থাকা অবস্থায়
$ curl -s -G "http://localhost:47610/api/tours" \\
    --data-urlencode "q=সেন্ট মার্টিন" \\
    --data-urlencode "guests=2"
{"pathname":"/api/tours","query":{"q":"সেন্ট মার্টিন","guests":"2"},"hash":""}

# Server এর Terminal এ, তারে যা এসেছিল:
GET /api/tours?q=%e0%a6%b8%e0%a7%87%e0%a6%a8%e0%a7%8d%e0%a6%9f+%e0%a6%ae%e0%a6%be%e0%a6%b0%e0%a7%8d%e0%a6%9f%e0%a6%bf%e0%a6%a8&guests=2   Host: localhost:47610

# curl ছোট হাতের Hex আর Space এর জন্য + ব্যবহার করেছে, Node বড় হাতের আর %20।
# দুইটাই বৈধ, আর Server দুইটাকেই একই লেখায় ফেরত আনে।`,
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর URL গুলো, একটা একটা করে</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর দল URL নিয়ে যে সিদ্ধান্ত গুলো নিয়েছে, এই লেসনের প্রতিটা ধারণা তার
                কোথাও না কোথাও কাজ করছে। পুরো গঠনটা আছে{" "}
                <Link href="/devops/project" className="text-primary underline underline-offset-4">
                  Island Tours প্রজেক্টের পাতায়
                </Link>
                , এখানে শুধু URL এর দিকটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটাই মূল ঠিকানা।</strong> সব পাতার Canonical Host{" "}
                  <code>islandtours.example</code>। কেউ <code>www.islandtours.example</code> খুললে
                  Caddy তাঁকে স্থায়ী Redirect দিয়ে মূল ঠিকানায় পাঠায়। আর <code>http://</code> দিয়ে
                  এলে Port 80 এ Caddy শুধু একটাই কাজ করে, <code>https://</code> এ পাঠিয়ে দেয় (লেসন ০৭)।
                </ListItem>
                <ListItem>
                  <strong>ট্যুরের পাতা Slug দিয়ে।</strong> <code>/tours/saint-martin</code>। Slug টা
                  Database এ অনন্য, আর একবার প্রকাশ হলে আর বদলায় না। কখনো বদলাতে হলে পুরনো Slug এর জন্য
                  একটা স্থায়ী Redirect রেখে দেওয়া হয়, যাতে পুরনো শেয়ার করা লিংক ভাঙে না।
                </ListItem>
                <ListItem>
                  <strong>খোঁজের শর্ত Query তে, আর প্রতিটা যাচাই করা।</strong>{" "}
                  <code>/tours?date=2026-12-20&amp;guests=2</code>। App তারিখটা আসলেই একটা বৈধ তারিখ কি
                  না, আর guests ১ থেকে ২০ এর মধ্যে একটা পূর্ণ সংখ্যা কি না, তা দেখে নেয়। না হলে পাতা
                  ভাঙে না, পরিষ্কার একটা 400 আসে (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>বাংলা খোঁজ নিরাপদে।</strong> Search Box এর লেখা দিয়ে URL বানায়{" "}
                  <code>URLSearchParams</code>, হাতে জোড়া লাগিয়ে নয়। তাই কেউ <code>beach &amp; family</code>{" "}
                  লিখলেও খোঁজ ভাঙে না।
                </ListItem>
                <ListItem>
                  <strong>দুইটা Origin, দুইটা কাজ।</strong> Website এর পাতা আর তাদের API একই Origin এ,{" "}
                  <code>https://islandtours.example/api/...</code>, তাই Browser কোনো বাড়তি অনুমতি চায় না।
                  Mobile App আর সঙ্গী সাইটের জন্য আলাদা <code>https://api.islandtours.example</code>।{" "}
                  <code>seagulltours.example</code> এর বুকিং Widget সেখানে ডাকে, আর তাই সেই API তে CORS এর
                  নিয়ম লেখা আছে (লেসন ০৪)।
                </ListItem>
                <ListItem>
                  <strong>বুকিং এর ঠিকানা এলোমেলো ID দিয়ে, Login সহ।</strong>{" "}
                  <code>/bookings/bk_7Q2M9X</code>। ID অনুমান করা কঠিন, তবুও প্রতিটা Request এ App দেখে
                  বুকিংটা Login করা মানুষটারই কি না। Session থাকে Cookie তে, কখনো URL এ নয়।
                </ListItem>
                <ListItem>
                  <strong>Login এর next যাচাই করা।</strong> উপরের <code>safeNextPath</code> এর মতো একটা
                  Function, যার Origin আসে Environment Variable থেকে।
                </ListItem>
                <ListItem>
                  <strong>বিজ্ঞাপনের লেজ Analytics এর জন্য, ঠিকানার জন্য নয়।</strong>{" "}
                  <code>utm_source</code> সহ লিংক Analytics এ যায়, কিন্তু প্রতিটা পাতার Canonical এ শুধু
                  পরিষ্কার ঠিকানাটা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>লিংকে চাপ দেওয়ার পর URL টার কী হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              বন্ধু Messenger এ পর্যটকের পাঠানো লিংকে চাপ দিলেন। পাতা খোলার আগে শুধু URL টাকে ঘিরে কী
              কী ঘটে, শুরু থেকে শেষ পর্যন্ত। খেয়াল করুন, প্রতিটা ধাপ আসলে একটা টুকরোকে তার ঠিক পাঠকের
              হাতে তুলে দেওয়া।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "লেখাটা কি একটা URL?",
              description:
                "Browser আগে দেখে লেখাটা একটা পূর্ণ URL কি না। এখানে শুরুতে https:// আছে, তাই এটা URL, Search এর লেখা নয়। Scheme না থাকলে Browser নিজে https:// জুড়ে নিত।",
            },
            {
              title: "টুকরো করা",
              description:
                "Browser এর Parser লাইনটা ভাগ করে: Scheme https, Host islandtours.example, Port খালি তাই 443, Path /tours/saint-martin, Query date আর guests, Fragment reviews। বাংলা কিছু থাকলে এই ধাপেই Path আর Query তে Percent-encoding আর Host এ Punycode হয়ে যায়।",
            },
            {
              title: "Scheme ঠিক করে কীভাবে কথা হবে",
              description:
                "https মানে Encrypted Connection। তাই TCP এর পরে TLS নামের একটা বাড়তি পরিচয় পর্ব হবে, যার পুরো গল্প লেসন ০৭ আর ০৮ এ।",
            },
            {
              title: "Host যায় DNS এর কাছে",
              description:
                "islandtours.example এর IP জানতে Browser Resolver কে জিজ্ঞেস করে, Cache এ না থাকলে। উত্তর আসে 103.94.135.2। পুরো খোঁজটা Module 04 এ পড়েছেন।",
            },
            {
              title: "Port যায় TCP এর কাছে",
              description:
                "ফোনের Kernel 192.168.1.20:51514 থেকে 103.94.135.2:443 এ একটা TCP Connection খোলে, Three-way Handshake দিয়ে। এটা Module 05 এর গল্প।",
            },
            {
              title: "Path আর Query যায় Server এর কাছে",
              description:
                "Browser Request এর প্রথম লাইনে লেখে GET /tours/saint-martin?date=2026-12-20&guests=2, আর Host নামের একটা Header এ islandtours.example। এই লাইনের পুরো গঠন পরের লেসনের বিষয়।",
            },
            {
              title: "Fragment পকেটে রাখা থাকে",
              description:
                "#reviews কোথাও পাঠানো হয় না। Browser সেটা নিজের কাছে রেখে দেয়, কারণ এই প্রশ্নটার উত্তর পাতা আসার পরে Browser নিজেই দেবে।",
            },
            {
              title: "পাতা এলো, Browser Scroll করল",
              description:
                "Server পাতা পাঠাল। Browser সেটা সাজিয়ে দেখাল, তারপর পাতার ভেতরে id=reviews লেখা অংশটা খুঁজে সেখানে নেমে গেল। পাতার ভেতরের ছোট লিংক আর ছবি গুলো Browser এই URL কে Base ধরে পূর্ণ করে নিল।",
            },
          ],
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় URL ভাঙা, Fragment এর প্রমাণ,
                Encoding এর ভুল, Relative লিংক আর Open Redirect, সব নিজের যন্ত্রে ঘটিয়ে দেখবেন।
              </ListItem>
              <ListItem>
                <strong>MDN, What is a URL</strong>, সহজ ভাষায় URL এর প্রতিটা অংশ, ছবি সহ। শুরু করার
                জন্য সবচেয়ে ভালো পাতা।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.mozilla.org
                </a>
              </ListItem>
              <ListItem>
                <strong>MDN, URL API</strong>, Browser আর Node এর <code>URL</code> আর{" "}
                <code>URLSearchParams</code> এর প্রতিটা Property আর Method।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.mozilla.org/en-US/docs/Web/API/URL
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js এর url নথি</strong>, Node এ একই API, আর পুরনো{" "}
                <code>url.parse</code> কেন আর ব্যবহার করা উচিত নয়।{" "}
                <a
                  href="https://nodejs.org/api/url.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/url.html
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 3986 আর WHATWG URL Standard</strong>, মূল নিয়মপত্র দুইটা। পুরোটা পড়ার
                দরকার নেই। RFC 3986 এর Section 3 এ টুকরো গুলোর সংজ্ঞা, আর Section 5 এ Relative URL
                পূর্ণ করার নিয়ম, যা আপনি Lab এ দেখেছেন।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc3986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc3986
                </a>
                {" আর "}
                <a
                  href="https://url.spec.whatwg.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  url.spec.whatwg.org
                </a>
              </ListItem>
              <ListItem>
                <strong>OWASP, Unvalidated Redirects and Forwards</strong>, Open Redirect এর আরও রূপ আর
                তাদের সমাধান, নিরাপত্তার দিক থেকে।{" "}
                <a
                  href="https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cheatsheetseries.owasp.org
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 8141</strong>, URN এর নিয়মপত্র, কৌতূহল থাকলে।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc8141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc8141
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
                  URI হলো যেকোনো জিনিসকে চেনানোর লেখা। URL চেনায় আর কোথায় আছে তাও বলে, URN শুধু নাম
                  দেয়। প্রতিদিনের কাজে আর Browser এর নিয়মে সবকিছুকেই URL বলা হয়।
                </ListItem>
                <ListItem>
                  ক্রমটা চিরকালের: <code>scheme://userinfo@host:port/path?query#fragment</code>। প্রতিটা
                  বিশেষ চিহ্নের একটা চাকরি আছে।
                </ListItem>
                <ListItem>
                  Scheme বলে কীভাবে, Host আর Port বলে কোথায়, Path বলে কী, Query বলে কোন শর্তে, Fragment
                  বলে পাতার কোথায়।
                </ListItem>
                <ListItem>
                  পাঁচ টুকরোর পাঁচ পাঠক: Scheme পড়ে Browser, Host যায় DNS এ, Port যায় TCP তে, Path আর
                  Query যায় Server এ, Fragment কোথাও যায় না।
                </ListItem>
                <ListItem>
                  Scheme আর Host এ বড় ছোট হাতের তফাত নেই, Path এ আছে। Default Port লেখার দরকার নেই।
                  শেষের / একটা আলাদা URL।
                </ListItem>
                <ListItem>
                  বাংলা আর বিশেষ চিহ্ন Path আর Query তে যায় Percent-encoding এ, Host এ Punycode এ।
                  একটা মানের জন্য <code>encodeURIComponent</code> বা <code>URLSearchParams</code>, একবার
                  Encode, একবার Decode।
                </ListItem>
                <ListItem>
                  Relative URL পূর্ণ হয় বর্তমান পাতার সাপেক্ষে। ছবি আর Script এর জন্য / দিয়ে শুরু করা
                  Path, আর Code এ <code>new URL(path, base)</code>।
                </ListItem>
                <ListItem>
                  Origin মানে Scheme, Host আর Port, তিনটাই মিলতে হবে। CORS আর Cookie দুইটাই এর উপর
                  দাঁড়িয়ে।
                </ListItem>
                <ListItem>
                  গোপন জিনিস URL এ নয়। <code>@</code> এর ডানেরটাই Host। অন্যের দেওয়া URL লেখা দেখে নয়,
                  Parse করে Origin মিলিয়ে তবে ব্যবহার।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০২, HTTP Protocol Basics",
          content: (
            <p>
              এই লেসনে URL এর একটা টুকরো আমরা Server এর দরজা পর্যন্ত পৌঁছে দিয়ে থেমে গেছি: Path আর
              Query মিলে Request Target, যা যায় Request এর প্রথম লাইনে। কিন্তু সেই প্রথম লাইনটা দেখতে
              কেমন? তার পরে আর কী কী লেখা থাকে? Server উত্তরে কী পাঠায়, আর TCP এর একটানা Byte এর ধারায়
              Browser বোঝে কীভাবে যে উত্তরটা শেষ হলো? আর HTTP কেন প্রতিটা Request কে নতুন মানুষের মতো
              দেখে, কিছু মনে রাখে না? পরের লেসনে আপনি নিজের হাতে একটা HTTP Request টাইপ করে পাঠাবেন,
              কোনো Browser ছাড়াই। লেসন ০২: HTTP Protocol Basics।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["URI", "যেকোনো জিনিসকে চেনানোর নিয়মমাফিক লেখা, পুরো পরিবারের নাম"],
      ["URL", "চেনায় আর কোথায় আছে, কীভাবে পৌঁছাবেন তাও বলে"],
      ["URN", "শুধু স্থায়ী নাম, যেমন urn:isbn, অবস্থান বলে না"],
      ["Scheme", "কোন নিয়মে কথা: https, wss, mailto, postgresql"],
      ["Authority", "// এর পরের অংশ: userinfo, Host আর Port"],
      ["Host", "যন্ত্রের নাম বা IP। নাম হলে DNS এ যায়। IPv6 বন্ধনীর ভেতরে"],
      ["Port", "যন্ত্রের দরজা। Default হলে লেখা লাগে না, http 80, https 443"],
      ["userinfo", "@ এর আগের অংশ। Web এ প্রতারণার কৌশল, Database URL এ গোপন Password"],
      ["Path", "Server এর ভেতরে কোন জিনিস। বড় ছোট হাত আলাদা, শেষের / আলাদা URL"],
      ["Query", "একই জিনিস, ভিন্ন শর্তে। সবকিছু String, যাচাই করে নিতে হয়"],
      ["Fragment", "পাতার কোন অংশ। কখনো Server এ যায় না"],
      ["Percent-encoding", "প্রতিটা Byte কে %XX। একটা বাংলা অক্ষর তিন Byte"],
      ["Punycode", "Host এর বাংলা নাম xn-- দিয়ে শুরু ASCII রূপে"],
      ["Relative URL", "বর্তমান পাতার URL কে Base ধরে পূর্ণ হয়"],
      ["Origin", "Scheme, Host আর Port একসাথে। Browser এর নিরাপত্তার দেয়াল"],
      ["Open Redirect", "next এর মতো Parameter এ অন্যের ঠিকানায় চোখ বন্ধ করে পাঠানো"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "URI, URL আর URN নিয়ে কোন কথাটা ঠিক?",
        options: [
          {
            key: "A",
            text: "URL আর URI দুইটা আলাদা জিনিস, কোনো URL কখনো URI নয়",
            isCorrect: false,
            explanation:
              "উল্টো। URL হলো URI এর একটা ধরন, তাই প্রতিটা URL ই একটা URI।",
          },
          {
            key: "B",
            text: "প্রতিটা URL একটা URI, আর URN হলো এমন URI যা শুধু নাম দেয়, অবস্থান বলে না",
            isCorrect: true,
            explanation:
              "ঠিক। URI ছাতা, URL চেনায় আর অবস্থান বলে, URN শুধু চেনায়, যেমন urn:isbn।",
          },
          {
            key: "C",
            text: "URN হলো URL এর ছোট রূপ, Domain ছাড়া লেখা",
            isCorrect: false,
            explanation:
              "URN কোনো সংক্ষিপ্ত রূপ নয়। এর নিজের Scheme আছে, urn:, আর এটা কোনো অবস্থানই বোঝায় না।",
          },
          {
            key: "D",
            text: "https দিয়ে শুরু হলে URL, http দিয়ে শুরু হলে URI",
            isCorrect: false,
            explanation:
              "Scheme দিয়ে এই তফাত হয় না। দুইটাই URL, কারণ দুইটাই অবস্থান বলে।",
          },
        ],
      },
      {
        id: 2,
        text: "পর্যটক খুললেন https://islandtours.example/tours/saint-martin?guests=2#reviews। Island Tours এর Server Request এর প্রথম লাইনে Path আর Query হিসেবে কী পায়?",
        options: [
          {
            key: "A",
            text: "/tours/saint-martin?guests=2#reviews",
            isCorrect: false,
            explanation:
              "Fragment কখনো পাঠানো হয় না। #reviews Browser নিজের কাছে রেখে দেয়।",
          },
          {
            key: "B",
            text: "https://islandtours.example/tours/saint-martin?guests=2#reviews",
            isCorrect: false,
            explanation:
              "পুরো URL যায় না। Scheme ঠিক করে কীভাবে কথা হবে, Host যায় আলাদা Header এ, Fragment কোথাও যায় না।",
          },
          {
            key: "C",
            text: "/tours/saint-martin?guests=2",
            isCorrect: true,
            explanation:
              "ঠিক। Path আর Query মিলে Request Target, শুধু এটুকুই প্রথম লাইনে যায়। Lab এর দ্বিতীয় পরীক্ষায় Server এর Log এ এটাই দেখেছেন।",
          },
          {
            key: "D",
            text: "/tours/saint-martin, Query টা Body তে আলাদা যায়",
            isCorrect: false,
            explanation:
              "Query URL এরই অংশ, Path এর সাথেই প্রথম লাইনে যায়। Body একটা আলাদা জিনিস।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা Email এ লিংক এলো https://islandtours.example@attacker.example/login। চাপ দিলে Browser কোন Host এর কাছে যাবে?",
        options: [
          {
            key: "A",
            text: "islandtours.example, কারণ লিংকটা সেটা দিয়েই শুরু",
            isCorrect: false,
            explanation:
              "চোখ এটাই বলে, আর প্রতারণাটা এখানেই। @ এর আগের অংশটা userinfo, Host নয়।",
          },
          {
            key: "B",
            text: "attacker.example, কারণ @ এর আগের সবটুকু ব্যবহারকারীর নাম",
            isCorrect: true,
            explanation:
              "ঠিক। Parser এর ফলে username হলো islandtours.example আর hostname হলো attacker.example।",
          },
          {
            key: "C",
            text: "দুইটাতেই, পরপর",
            isCorrect: false,
            explanation: "একটা URL এর Host একটাই।",
          },
          {
            key: "D",
            text: "কোথাও না, এটা একটা ভুল URL",
            isCorrect: false,
            explanation:
              "দুঃখজনকভাবে এটা পুরো বৈধ URL। এই কারণেই কৌশলটা এত বছর টিকে আছে।",
          },
        ],
      },
      {
        id: 4,
        text: "Search Box এ পর্যটক লিখলেন beach & family। লেখাটাকে Query এর q এর মান হিসেবে বসাতে কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "encodeURI, কারণ এটা URL এর জন্য বানানো",
            isCorrect: false,
            explanation:
              "encodeURI & চিহ্নটা ছেড়ে দেয়। Server তখন পায় q এর মান beach আর একটা নতুন Key, family।",
          },
          {
            key: "B",
            text: "কিছুই না, Browser নিজে ঠিক করে নেবে",
            isCorrect: false,
            explanation:
              "Browser জানে না আপনার & টা জোড়া ভাগ করার জন্য না লেখার অংশ। আপনাকেই বলে দিতে হবে।",
          },
          {
            key: "C",
            text: "encodeURIComponent, অথবা URLSearchParams দিয়ে পুরো Query বানানো",
            isCorrect: true,
            explanation:
              "ঠিক। দুইটাই & কে %26 বানায়, তাই Server পুরো লেখাটাই ফেরত পায়।",
          },
          {
            key: "D",
            text: "দুইবার encodeURIComponent, যাতে নিশ্চিত থাকা যায়",
            isCorrect: false,
            explanation:
              "দুইবার Encode করলে % নিজেই %25 হয়ে যায়, আর পাতায় %26 এর মতো অদ্ভুত লেখা দেখা যায়।",
          },
        ],
      },
      {
        id: 5,
        text: "পাতাটা https://islandtours.example/tours/saint-martin, শেষে / ছাড়া। পাতার ভেতরে লেখা আছে <img src=\"photos/boat.jpg\">। Browser ছবিটা কোথায় খুঁজবে?",
        options: [
          {
            key: "A",
            text: "https://islandtours.example/tours/saint-martin/photos/boat.jpg",
            isCorrect: false,
            explanation:
              "এটা হতো যদি Base এর শেষে / থাকত। / না থাকায় saint-martin অংশটাকে File এর নাম ধরে ফেলে দেওয়া হয়।",
          },
          {
            key: "B",
            text: "https://islandtours.example/photos/boat.jpg",
            isCorrect: false,
            explanation:
              "এটা হতো /photos/boat.jpg লিখলে, মানে শুরুতে / দিলে।",
          },
          {
            key: "C",
            text: "https://islandtours.example/tours/photos/boat.jpg",
            isCorrect: true,
            explanation:
              "ঠিক। Base এর শেষ / পর্যন্ত, মানে /tours/, রেখে বাকিটা জোড়া। Lab এর চার নম্বর পরীক্ষায় দুই Base এর তফাত দেখেছেন।",
          },
          {
            key: "D",
            text: "photos/boat.jpg নামে একটা নতুন Host এ",
            isCorrect: false,
            explanation:
              "নতুন Host হয় শুধু // দিয়ে শুরু হলে।",
          },
        ],
      },
      {
        id: 6,
        text: "কোন URL টা https://islandtours.example এর সাথে Same Origin?",
        options: [
          {
            key: "A",
            text: "https://api.islandtours.example/tours",
            isCorrect: false,
            explanation:
              "Host আলাদা। একই কোম্পানির হলেও Browser এর চোখে আলাদা Origin, তাই এই API ডাকতে CORS লাগে।",
          },
          {
            key: "B",
            text: "http://islandtours.example/tours",
            isCorrect: false,
            explanation: "Scheme আলাদা, http আর https আলাদা Origin।",
          },
          {
            key: "C",
            text: "https://ISLANDTOURS.example:443/bookings",
            isCorrect: true,
            explanation:
              "ঠিক। Host এর বড় হাত আর https এর Default Port 443, দুইটাই Parser মুছে দেয়। Path Origin এর অংশ নয়।",
          },
          {
            key: "D",
            text: "https://islandtours.example:8443/",
            isCorrect: false,
            explanation: "Port আলাদা, তাই Origin আলাদা।",
          },
        ],
      },
      {
        id: 7,
        text: "একজন Developer Login এর Token টা URL এ রাখতে চান, /bookings?token=...। এর সবচেয়ে বড় সমস্যা কী?",
        options: [
          {
            key: "A",
            text: "URL অনেক লম্বা হয়ে যায়",
            isCorrect: false,
            explanation:
              "লম্বা হওয়াটা ছোট সমস্যা। আসল সমস্যা হলো Token টা কোথায় কোথায় জমা হয়।",
          },
          {
            key: "B",
            text: "Token টা History, Server আর Proxy এর Log, Analytics, Referer আর শেয়ার করা লিংকে ফাঁস হয়",
            isCorrect: true,
            explanation:
              "ঠিক। তাই গোপন জিনিস যায় Cookie, Authorization Header বা Body তে, URL এ কখনো নয়।",
          },
          {
            key: "C",
            text: "Query তে বাংলা লেখা যায় না",
            isCorrect: false,
            explanation:
              "যায়, Percent-encoding দিয়ে। আর এটা Token এর সমস্যার সাথে সম্পর্কিত নয়।",
          },
          {
            key: "D",
            text: "Server Query পড়তে পারে না",
            isCorrect: false,
            explanation:
              "পারে। Server পড়তে পারে না শুধু Fragment।",
          },
        ],
      },
      {
        id: 8,
        text: "Login এর next Parameter যাচাই করতে কেউ লিখলেন, next যদি / দিয়ে শুরু হয় তবে নিরাপদ। এটা কেন যথেষ্ট নয়?",
        options: [
          {
            key: "A",
            text: "কারণ //attacker.example ও / দিয়ে শুরু, অথচ দুইটা / মানে নতুন Host",
            isCorrect: true,
            explanation:
              "ঠিক। লেখা দেখে বিচার না করে new URL(next, নিজের Origin) দিয়ে Parse করে Origin মেলাতে হয়।",
          },
          {
            key: "B",
            text: "কারণ / দিয়ে শুরু করা Path Server বোঝে না",
            isCorrect: false,
            explanation:
              "বোঝে। / দিয়ে শুরু করা Path ই সবচেয়ে সাধারণ।",
          },
          {
            key: "C",
            text: "যথেষ্ট, এতেই সব আক্রমণ আটকায়",
            isCorrect: false,
            explanation:
              "আটকায় না। //attacker.example আর /\\attacker.example দুইটাই পার হয়ে যায়।",
          },
          {
            key: "D",
            text: "কারণ next এ কখনো Query থাকতে পারে না",
            isCorrect: false,
            explanation:
              "পারে, /tours?guests=2 একটা বৈধ next। সমস্যাটা Host নিয়ে, Query নিয়ে নয়।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "URL কে নিজের হাতে ভাঙুন, জোড়া দিন, আর ফাঁদ ধরুন",
    subtitle: "ছয়টা পরীক্ষা, শুধু Node আর curl লাগবে",
    stepName: "LAB",
    steps: [
      {
        title: "একটা URL কে টুকরো করা",
        description:
          "নিজের পছন্দের যেকোনো URL Node এর Parser এ দিন, প্রতিটা টুকরো দেখুন। তারপর @ এর কৌশল আর Scheme ছাড়া লেখা দিয়ে চেষ্টা করুন।",
      },
      {
        title: "Server আসলে কী পায়",
        description:
          "একটা ছোট Server চালান যা প্রতিটা Request এর প্রথম লাইন ছাপায়। Fragment সহ URL পাঠিয়ে প্রমাণ করুন Fragment কখনো পৌঁছায় না।",
      },
      {
        title: "Encoding এর তিন উপায় আর দুইটা ভুল",
        description:
          "বাংলা আর বিশেষ চিহ্ন তিনভাবে Encode করুন। তারপর ভুল Function আর দুইবার Encode করার ফল নিজের চোখে দেখুন।",
      },
      {
        title: "Relative লিংক পূর্ণ করা",
        description:
          "একই লিংক দুইটা Base এর সাপেক্ষে পূর্ণ করুন, যাদের তফাত শুধু শেষের একটা /।",
      },
      {
        title: "curl দিয়ে Query আর Path পাঠানো",
        description:
          "curl কে দিয়ে বাংলা Query Encode করান, আর -v দিয়ে দেখুন তারে আসলে কোন লাইনটা গেল।",
      },
      {
        title: "Open Redirect আটকানো",
        description:
          "safeNextPath চালান আটটা চেষ্টার উপর। তারপর ইচ্ছা করে একটা দুর্বল সংস্করণ লিখে দেখুন কোন চেষ্টা গুলো পার হয়ে যায়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-parse.mjs",
        language: "javascript",
        code: `// চালান:  node 1-parse.mjs "https://islandtours.example:443/tours/saint-martin?date=2026-12-20&guests=2#reviews"
const input = process.argv[2];
if (!input) throw new Error("একটা URL দিন, যেমন node 1-parse.mjs https://example.com/");

const url = new URL(input); // ভুল URL হলে এখানেই TypeError, চুপচাপ ভুল ফল নয়

const parts = ["href", "protocol", "username", "password", "hostname", "port", "pathname", "search", "hash", "origin"];
for (const name of parts) {
  console.log(name.padEnd(9), JSON.stringify(url[name]));
}

console.log("\\nQuery এর প্রতিটা জোড়া:");
for (const [key, value] of url.searchParams) {
  console.log("  ", key, "=", value);
}

console.log("\\nServer এর কাছে যাবে:", \`\${url.pathname}\${url.search}\`);

// আরও চেষ্টা করুন:
//   node 1-parse.mjs "https://islandtours.example@attacker.example/login"
//     -> hostname "attacker.example", username "islandtours.example"
//   node 1-parse.mjs "islandtours.example/tours"
//     -> TypeError: Invalid URL, কারণ Scheme নেই
//   node 1-parse.mjs "http://[2001:db8::7334]:8080/status"
//     -> hostname "[2001:db8::7334]", port "8080"`,
      },
      {
        filename: "2-what-arrives.mjs",
        language: "javascript",
        code: `// চালান:  export LAB_PORT=47610
//         node 2-what-arrives.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const server = http.createServer((req, res) => {
  // Server এর হাতে যা আসে: Method, Request Target আর Host Header
  console.log(\`\${req.method} \${req.url}   Host: \${req.headers.host}\`);

  // Request Target টাকে পুরো URL বানাতে Host লাগে, কারণ Target এ Host থাকে না
  const url = new URL(req.url, \`http://\${req.headers.host}\`);
  const body = {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
    hash: url.hash,
  };
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body) + "\\n");
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`listening on http://localhost:\${port}\`);
});

// আরেক Terminal এ:
//   curl -s "http://localhost:$LAB_PORT/tours/saint-martin?date=2026-12-20&guests=2#reviews"
// উত্তর:
//   {"pathname":"/tours/saint-martin","query":{"date":"2026-12-20","guests":"2"},"hash":""}
// Server এর Terminal এ:
//   GET /tours/saint-martin?date=2026-12-20&guests=2   Host: localhost:47610
//
// এবার Browser এ একই URL খুলুন। Server এর Terminal এ কী ছাপা হলো?
// #reviews কি কোথাও আছে? থামাতে Ctrl+C।`,
      },
      {
        filename: "3-encode.mjs",
        language: "javascript",
        code: `// চালান:  node 3-encode.mjs
const samples = ["সেন্ট মার্টিন", "beach & family", "50% off", "a/b?c#d"];

for (const text of samples) {
  console.log(\`\\n\${JSON.stringify(text)}\`);
  console.log("  encodeURIComponent :", encodeURIComponent(text));
  console.log("  encodeURI          :", encodeURI(text));
  console.log("  URLSearchParams    :", new URLSearchParams({ q: text }).toString());
}

// ভুল Function বেছে নিলে Server কী পড়ে
const base = "https://islandtours.example/api/tours?q=";
const wrong = new URL(base + encodeURI("beach & family"));
const right = new URL(base + encodeURIComponent("beach & family"));
console.log("\\nencodeURI দিয়ে বানালে Server পড়ে  :", [...wrong.searchParams]);
console.log("encodeURIComponent দিয়ে বানালে    :", [...right.searchParams]);

// দুইবার Encode করার ভুল
const once = encodeURIComponent("সেন্ট");
const twice = encodeURIComponent(once);
console.log("\\nএকবার :", once);
console.log("দুইবার:", twice);
console.log("দুইবারেরটা একবার Decode করলে:", decodeURIComponent(twice));

// ভাঙা Percent-encoding
try {
  decodeURIComponent("50%");
} catch (error) {
  console.log('\\ndecodeURIComponent("50%") ->', error.name, error.message);
}

// ফলাফলের শেষ অংশ:
//   encodeURI দিয়ে বানালে Server পড়ে  : [ [ 'q', 'beach ' ], [ ' family', '' ] ]
//   encodeURIComponent দিয়ে বানালে    : [ [ 'q', 'beach & family' ] ]
//   decodeURIComponent("50%") -> URIError URI malformed`,
      },
      {
        filename: "4-resolve.mjs",
        language: "javascript",
        code: `// চালান:  node 4-resolve.mjs
const bases = [
  "https://islandtours.example/tours/saint-martin",
  "https://islandtours.example/tours/saint-martin/",
];
const links = ["photos/boat.jpg", "../sajek-valley", "/api/tours", "?guests=4", "#reviews", "//cdn.islandtours.example/img/boat.jpg"];

for (const base of bases) {
  console.log(\`\\nBase: \${base}\`);
  for (const link of links) {
    console.log(\`  \${link.padEnd(40)} -> \${new URL(link, base).href}\`);
  }
}

// দুই Base এর প্রথম দুই লাইন পাশাপাশি:
//   photos/boat.jpg -> https://islandtours.example/tours/photos/boat.jpg
//   photos/boat.jpg -> https://islandtours.example/tours/saint-martin/photos/boat.jpg
//   ../sajek-valley -> https://islandtours.example/sajek-valley
//   ../sajek-valley -> https://islandtours.example/tours/sajek-valley
// /api/tours আর //cdn... দুই Base এই একই, কারণ তারা Base এর Path ব্যবহারই করে না।`,
      },
      {
        filename: "5-curl.sh",
        language: "bash",
        code: `# আগে লাগবে: আরেক Terminal এ পরীক্ষা ২ এর Server চালু
#   export LAB_PORT=47610
#   node 2-what-arrives.mjs
export LAB_PORT=47610

# ১. বাংলা Search লেখা curl নিজেই Encode করুক
curl -s -G "http://localhost:$LAB_PORT/api/tours" \\
  --data-urlencode "q=সেন্ট মার্টিন" \\
  --data-urlencode "guests=2"
# {"pathname":"/api/tours","query":{"q":"সেন্ট মার্টিন","guests":"2"},"hash":""}

# ২. Fragment কি তারে যায়? -v দিয়ে curl যা পাঠাল তা দেখুন
curl -sv "http://localhost:$LAB_PORT/tours/saint-martin?guests=2#reviews" -o /dev/null 2>&1 | grep '^> GET'
# > GET /tours/saint-martin?guests=2 HTTP/1.1

# ৩. .. আর . কে curl নিজেই মুছে দেয়, --path-as-is দিলে দেয় না
curl -sv "http://localhost:$LAB_PORT/tours/../api/./tours" -o /dev/null 2>&1 | grep '^> GET'
# > GET /api/tours HTTP/1.1
curl -sv --path-as-is "http://localhost:$LAB_PORT/tours/../api/./tours" -o /dev/null 2>&1 | grep '^> GET'
# > GET /tours/../api/./tours HTTP/1.1

# ৪. একটা সত্যিকারের সাইট, একই নিয়ম
curl -sv "https://example.com/?from=lesson#top" -o /dev/null 2>&1 | grep -E '^> (GET|Host)'
# > GET /?from=lesson HTTP/2
# > Host: example.com`,
      },
      {
        filename: "6-safe-redirect.mjs",
        language: "javascript",
        code: `// চালান:  SITE_ORIGIN=https://islandtours.example node 6-safe-redirect.mjs
const siteOrigin = process.env.SITE_ORIGIN;
if (!siteOrigin) throw new Error("SITE_ORIGIN is not set");

/**
 * Login এর পরে কোথায় পাঠাব। next যদি নিজের সাইটের ভেতরের ঠিকানা হয় তবে সেটা,
 * নইলে Home। লেখাটা দেখে নয়, Browser যেভাবে বুঝবে সেভাবে Parse করে বিচার।
 */
function safeNextPath(next) {
  if (typeof next !== "string" || next === "") return "/";
  let target;
  try {
    target = new URL(next, siteOrigin);
  } catch {
    return "/";
  }
  if (target.origin !== new URL(siteOrigin).origin) return "/";
  return \`\${target.pathname}\${target.search}\${target.hash}\`;
}

const attempts = [
  "/tours/saint-martin?guests=2",
  "/bookings/bk_7Q2M9X",
  "https://attacker.example/login",
  "//attacker.example/login",
  "/\\\\attacker.example",
  "javascript:alert(1)",
  "https://islandtours.example@attacker.example/",
  "",
];
for (const next of attempts) {
  console.log(JSON.stringify(next).padEnd(48), "->", safeNextPath(next));
}

// প্রথম দুইটা নিজের Path ফেরত দেয়, বাকি ছয়টা দেয় "/"।
// এবার safeNextPath এর ভেতরটা মুছে শুধু লিখুন:
//   return next.startsWith("/") ? next : "/";
// আবার চালান। কোন দুইটা চেষ্টা এখন পার হয়ে গেল?`,
      },
    ],
    tip: "পরীক্ষা ২ আর ৬ পাশাপাশি রেখে ভাবুন। দ্বিতীয়টায় দেখলেন URL এর একটা অংশ Server কখনো দেখেই না। ষষ্ঠটায় দেখলেন একটা URL চোখে যা বলে আর Parser যা বোঝে, দুইটা আলাদা হতে পারে। দুইটা শিক্ষাই একই জায়গায় নিয়ে যায়: একটা URL সম্পর্কে কোনো সিদ্ধান্ত লেখাটা দেখে নেবেন না, Parse করে নেবেন। Browser, curl, Node, সবাই একই নিয়মে Parse করে। আপনার Code ও যদি সেই নিয়মে করে, তাহলে আপনি আর আক্রমণকারী একই জিনিস দেখবেন, আর তখন তাঁর লুকানোর আর কোনো জায়গা থাকবে না।",
  },
  assignment: {
    title: "Mini Project: my-tours এর URL নকশা আর URL Toolkit",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>পাঁচটা সত্যিকারের URL ব্যবচ্ছেদ:</strong> নিজের Browser এর History থেকে পাঁচটা URL
        নিন, এমনভাবে বেছে যাতে অন্তত একটায় Query, একটায় Fragment, আর একটায় বাংলা বা অন্য অ-ইংরেজি
        লেখা থাকে। প্রতিটাকে Lab এর প্রথম Script এ দিয়ে একটা টেবিল বানান: প্রতিটা টুকরো, তার পাঠক
        কে, আর Server এর কাছে আসলে কোন অংশটা গিয়েছিল।
      </span>,
      <span key="2">
        <strong>my-tours এর URL মানচিত্র:</strong> নিজের my-tours এর জন্য সব পাতা আর API এর URL লিখুন:
        ট্যুরের তালিকা, একটা ট্যুর, তারিখ আর মানুষ দিয়ে খোঁজ, Search, বুকিং বানানো আর দেখা, Login এর
        পরে ফেরত আসা। প্রতিটার পাশে এক লাইনে লিখুন কোন অংশ Path আর কোন অংশ Query, আর কেন।
      </span>,
      <span key="3">
        <strong>URL Toolkit লিখুন:</strong> দুইটা Function লিখুন,{" "}
        <code>buildTourSearchUrl(&#123; q, date, guests, tags &#125;)</code> আর{" "}
        <code>parseTourSearchUrl(url)</code>, শুধু <code>URL</code> আর <code>URLSearchParams</code> দিয়ে।
        সাইটের Origin আসবে Environment Variable থেকে, না থাকলে Function Error ছুড়বে। Test গুলো রাখুন
        কোডের পাশের একটা <code>spec/</code> Folder এ, আর তাতে অন্তত বাংলা q, একাধিক tag, beach &amp;
        family, আর ভুল guests এর ক্ষেত্র থাকতে হবে।
      </span>,
      <span key="4">
        <strong>Open Redirect বন্ধ করুন:</strong> my-tours এর Login এ <code>next</code> Parameter যোগ করুন
        আর <code>safeNextPath</code> দিয়ে সুরক্ষিত করুন। Lab এর আটটা চেষ্টার সাথে নিজের আরও দুইটা চেষ্টা
        যোগ করে একটা টেবিল বানান: চেষ্টা, Function কী ফেরত দিল, আর কেন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য বলছেন, Token টা{" "}
        <code>?token=</code> এ রাখলেই তো সহজ, আর Review এর অংশে নিয়ে যেতে <code>#reviews</code> এর মান
        Server থেকে পড়ে নেব। তাঁকে বুঝিয়ে লিখুন দুইটা পরিকল্পনাই কেন কাজ করবে না বা বিপদ ডাকবে, Token
        কোথায় যাওয়া উচিত, আর Fragment এর কাজটা আসলে কে করে।
      </span>,
    ],
    deliverables: [
      <span key="1">পাঁচটা URL এর টেবিল, প্রতিটা টুকরো আর তার পাঠক সহ</span>,
      <span key="2">my-tours এর URL মানচিত্র, প্রতিটার পাশে Path বনাম Query এর কারণ</span>,
      <span key="3">URL Toolkit এর Code আর spec Folder এর পাস করা Test এর ফলাফল</span>,
      <span key="4">safeNextPath এর Code আর দশটা চেষ্টার টেবিল</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
