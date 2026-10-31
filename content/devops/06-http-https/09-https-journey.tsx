/**
 * What: Module 06 Lesson 09, the Full HTTPS Journey. One request to Island Tours followed from the
 * keypress to the rendered page and back, then measured, sped up and debugged stage by stage.
 *
 * Why: This is the capstone of the HTTP and HTTPS module. The earlier lessons each taught one
 * piece, so this one teaches almost nothing new and instead joins every piece into one story the
 * reader can retell, with real curl output and the same scenario values as Module 05.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  BreakpointLab,
  JourneyStepLab,
  TimingBreakdownLab,
  VisitCompareLab,
} from "../../../components/course/topics/http/journey-animations";
import {
  CaddyHopDiagram,
  ColdRoundTripsDiagram,
  JourneyMapDiagram,
  PageLoadDiagram,
  VisibilityDiagram,
} from "../../../components/course/topics/http/journey-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

function Lesson({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-primary underline underline-offset-4">
      {children}
    </Link>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
      {children}
    </a>
  );
}

export const httpsJourneyContent: TopicData = {
  id: "https-journey",
  introduction: {
    badge: "MODULE 06 · LESSON 09",
    title: <SectionTitle>একটা Enter, আর তার পেছনের পুরো পথ</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          সন্ধ্যাবেলা, ঢাকা। একজন পর্যটক ফোনে লিখলেন{" "}
          <code>islandtours.example/tours/saint-martin</code>, তারপর Enter চাপলেন।
          এক সেকেন্ডেরও কম সময়ে পাতা এলো: Saint Martin Island Escape, কতগুলো আসন
          খালি, আর উপরের কোণে তাঁর নিজের নাম, কারণ গত সপ্তাহে তিনি একবার Login
          করেছিলেন। তাঁর কাছে এটা একটা মুহূর্ত। আপনার কাছে এখন আর তা নয়।
        </ContentParagraph>
        <ContentParagraph>
          এই মডিউলের আটটা লেসনে আপনি এই মুহূর্তটার অংশগুলো একটা একটা করে খুলে
          দেখেছেন। URL কীভাবে ভাঙে, HTTP এর Request আর Response দেখতে কেমন, Method
          আর Status Code এর মানে, Header কী কী বলে, Cookie কেন যায়, Session কোথায়
          থাকে, TLS কীভাবে তালা লাগায়, আর Certificate কেন বিশ্বাস করা যায়। কিন্তু
          শিখেছেন আলাদা আলাদা করে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে প্রায় কিছুই নতুন নেই। এখানে সব অংশ এক সুতায় গাঁথা হবে। আমরা
          পর্যটকের এই একটা Request কে অনুসরণ করব, Enter চাপা থেকে পাতা দেখা পর্যন্ত,
          প্রতিটা ধাপে থেমে দেখব কে কাজটা করছে, পথের কে কী দেখতে পাচ্ছে, আর কোন
          লেসনে সেটা শিখেছিলেন। তারপর তিনটা কাজের জিনিস: নিজের যন্ত্রে প্রতিটা ধাপের
          সময় মাপা, কোন ধাপ কীভাবে দ্রুত করা যায়, আর কিছু না চললে Error দেখে বোঝা
          যাত্রাটা ঠিক কোথায় ভেঙেছে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "যে Request টা আপনার কাছে এক মুহূর্তের, সেটা আসলে অনেকগুলো অচেনা হাতের হাতবদল। প্রত্যেকে নিজের কাজটুকু করে পরের জনের হাতে দেয়, আর কেউই পুরো গল্পটা জানে না। পুরো গল্পটা জানবেন শুধু আপনি।",
      author: "HTTPS",
      role: "Lesson 09",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "whole-map",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>পুরো যাত্রা, এক ছবিতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে পুরো ছবিটা একবারে দেখে নিই, তারপর প্রতিটা অংশে আলাদা করে থামব।
                পর্যটকের Request টা আটটা ধাপে যায় আর ফেরে। প্রতিটা ধাপের একজন
                দায়িত্বশীল আছে, আর প্রতিটা ধাপ এই মডিউলের বা আগের মডিউলের কোনো একটা
                লেসনের বিষয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>১. URL আর HSTS:</strong> Browser নিজের ভেতরেই লেখাটা পড়ে,
                  আর দেখে এই নামের জন্য HTTPS বাধ্যতামূলক কি না। তারে কিছু যায় না।
                </ListItem>
                <ListItem>
                  <strong>২. DNS:</strong> নাম থেকে ঠিকানা,{" "}
                  <code>islandtours.example</code> থেকে <code>103.94.135.2</code>।
                </ListItem>
                <ListItem>
                  <strong>৩. TCP Handshake:</strong> ফোন আর Server এর মাঝে একটা
                  নির্ভরযোগ্য রাস্তা খোলা।
                </ListItem>
                <ListItem>
                  <strong>৪. TLS Handshake:</strong> সেই রাস্তায় তালা লাগানো, আর
                  Server এর পরিচয়পত্র যাচাই।
                </ListItem>
                <ListItem>
                  <strong>৫. HTTP Request:</strong> তালাবন্ধ রাস্তা দিয়ে আসল প্রশ্নটা,
                  সাথে Header আর Cookie।
                </ListItem>
                <ListItem>
                  <strong>৬. Caddy:</strong> Server এর দরজায় তালা খোলা, আর Request টা
                  ভেতরের App এর হাতে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>৭. App:</strong> Session খুঁজে পর্যটককে চেনা, Database থেকে
                  তথ্য আনা, পাতা বানানো।
                </ListItem>
                <ListItem>
                  <strong>৮. Response:</strong> উত্তর একই পথে উল্টো দিকে ফেরে, আর
                  Browser পাতার বাকি ফাইলগুলো চাইতে শুরু করে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JourneyMapDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটার দুইটা জিনিস এখনই খেয়াল করে রাখুন, কারণ পুরো লেসন জুড়ে এরা
                ফিরে আসবে। প্রথমত, তিন, চার আর পাঁচ নম্বর ধাপ একই পথে চলে, ফোন থেকে
                Caddy পর্যন্ত, একটাই TCP Connection এর উপর। Connection একবার খোলা হলে
                তার উপর আগে তালা লাগে, তারপর সেই তালার ভেতর দিয়ে HTTP চলে। এটাই HTTPS
                এর আসল চেহারা: HTTP, TLS এর ভেতরে, TCP এর উপরে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয়ত, ডান দিকের বড় ডোরাকাটা বাক্সটা একটাই যন্ত্র। Caddy, App,
                Redis আর PostgreSQL সবাই Island Tours এর একই Server এ, আলাদা আলাদা
                Program হিসেবে। তাই Request টা Caddy পর্যন্ত Internet পাড়ি দেয়, কিন্তু
                Caddy এর পরে আর বাইরে যায় না, যন্ত্রের ভেতরেই এক Program থেকে আরেক
                Program এ যায়। এই তফাতটা পরে খুব কাজে লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একই যাত্রা এক ধাপ করে চালাতে পারবেন। প্রতিটা ধাপে দেখবেন
                Request টা কোথায় আছে, তারে কী যাচ্ছে, আর পথের লোকেরা তার কতটুকু পড়তে
                পারছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JourneyStepLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনটা কীভাবে পড়বেন",
          content: (
            <p>
              পরের আটটা সেকশন ঠিক এই আট ধাপের ক্রমে সাজানো। প্রতিটায় চারটা প্রশ্নের
              উত্তর পাবেন: এই ধাপে কী ঘটে, কে কাজটা করে, কোন লেসনে বিস্তারিত শিখেছেন,
              আর নিজের চোখে কীভাবে দেখবেন। কোনো ধাপ ঝাপসা লাগলে সেই লেসনে ফিরে যান,
              তারপর এখানে এসে বাকিটা পড়ুন। গল্পের চরিত্রগুলো আগের মডিউলের মতোই:
              পর্যটকের ফোন <code>192.168.1.20</code>, বাসার Router এর বাইরের ঠিকানা{" "}
              <code>203.0.113.25</code>, আর Island Tours এর Server{" "}
              <code>103.94.135.2</code>।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "the-cast",
      subHeader: { index: "002", title: "The Cast" },
      title: <SectionTitle>কে কী জানে, আর কে কী দেখতে পায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              যাত্রার প্রতিটা চরিত্রের কাছে পুরো গল্পের শুধু একটা অংশ থাকে। কে কী
              জানে আর কী করে, সেটা একটা টেবিলে রাখলে পরে Debug করার সময় খুব সুবিধা
              হয়, কারণ তখন প্রশ্নটা হয় এই তথ্যটা কার কাছে থাকার কথা ছিল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["চরিত্র", "কী জানে", "কী করে", "কোথায় শিখেছেন"],
          rows: [
            [
              "Browser",
              "URL, HSTS তালিকা, Cookie, Cache, খোলা Connection",
              "পুরো যাত্রা শুরু আর শেষ করে, TLS এর এক প্রান্ত",
              "লেসন ০১ থেকে ০৮",
            ],
            [
              "Operating System",
              "DNS Cache, Socket, Ephemeral Port",
              "নাম জিজ্ঞেস করে, TCP চালায়",
              "Module 04, Module 05",
            ],
            [
              "বাসার Router",
              "NAT টেবিল: 192.168.1.20:51514 আর 203.0.113.25:62001 এর জোড়া",
              "ঠিকানা বদলে বাইরে পাঠায়, ফেরার পথে আবার বদলায়",
              "Module 03, NAT আর PAT",
            ],
            [
              "Recursive Resolver",
              "অনেকের প্রশ্নের Cache করা উত্তর",
              "নাম থেকে IP খুঁজে দেয়",
              "Module 04",
            ],
            [
              "ISP আর মাঝের Hop",
              "শুধু Packet এর বাইরের মোড়ক",
              "Packet এক হাত থেকে আরেক হাতে দেয়",
              "Module 02",
            ],
            [
              "Caddy",
              "Certificate, Private Key, কোন নাম কোন App এর",
              "TLS শেষ করে, Header বসায়, App এর কাছে পাঠায়",
              "লেসন ০৪, ০৭, ০৮",
            ],
            [
              "App",
              "ব্যবসার নিয়ম: Tour, আসন, বুকিং",
              "পর্যটককে চেনে, পাতা বানায়, Status ঠিক করে",
              "লেসন ০৩, ০৬",
            ],
            ["Redis", "Session ID থেকে কোন User", "প্রতি Request এ পর্যটককে চিনিয়ে দেয়", "লেসন ০৬"],
            ["PostgreSQL", "Tour, আসন, বুকিং এর আসল তথ্য", "Query এর উত্তর দেয়", "SQL Track"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার উল্টো প্রশ্নটা, যা নিরাপত্তার দিক থেকে আরও জরুরি। পথের প্রত্যেকে
              Request টার কতটুকু পড়তে পারে? HTTPS এর পুরো উদ্দেশ্য এই প্রশ্নের উত্তর
              বদলে দেওয়া, তাই এটা ঠিকঠাক জানা দরকার।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VisibilityDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবিটা থেকে তিনটা কথা পরিষ্কার হয়। এক, HTTPS কথা বলার বিষয়টা লুকায়,
                কথা বলাটা লুকায় না। ক্যাফের Wi-Fi এর মালিক জানেন এই ফোনটা{" "}
                <code>islandtours.example</code> এর সাথে কথা বলছে, কখন আর কত Byte।
                কোন Tour দেখছেন, Cookie কী, বুকিংয়ে কী লিখলেন, সেটা জানেন না। Domain
                নামটা দেখা যায় কারণ TLS শুরুর ClientHello তে SNI নামের একটা জায়গায়
                নামটা খোলা লেখায় যায় (লেসন ০৭)।
              </ContentParagraph>
              <ContentParagraph>
                দুই, Caddy হলো প্রথম জায়গা যেখানে পুরো Request পড়া যায়। তাই Caddy যে
                যন্ত্রে চলে, সেটাই সবচেয়ে স্পর্শকাতর জায়গা। Private Key এখানে থাকে, আর
                এই যন্ত্র কারো হাতে গেলে HTTPS এর সব প্রতিশ্রুতি ভেঙে যায় (লেসন ০৮)।
              </ContentParagraph>
              <ContentParagraph>
                তিন, App এর Socket এর ওপাশে বসে আছে Caddy, পর্যটক নন। App এর চোখে
                প্রতিটা Request আসছে <code>127.0.0.1</code> থেকে। পর্যটকের আসল IP App
                জানে শুধু Caddy এর বসানো <code>X-Forwarded-For</code> Header থেকে।
                এটা নিয়ে ছয় নম্বর ধাপে বিস্তারিত বলব।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ভেতরের পথটা সত্যিই ভেতরে তো?",
          content: (
            <p>
              Caddy আর App এর মাঝের পথটা তালা ছাড়া, আর এটা ঠিক আছে শুধু এই কারণে যে
              দুইটা একই যন্ত্রে, আর কথা হচ্ছে <code>127.0.0.1</code> এর ভেতরে। যদি App
              অন্য একটা যন্ত্রে থাকে আর মাঝে একটা Network থাকে, তাহলে এই পথটাও Internet
              এর মতোই বিপজ্জনক। তখন ভেতরের পথেও TLS লাগান, অথবা এমন একটা Private
              Network ব্যবহার করুন যেখানে বাইরের কেউ ঢুকতে পারে না। Module 04 এর
              Cloudflare লেসনে Flexible Mode এর যে বিপদ দেখেছিলেন, সেটা ঠিক এই ভুলটাই:
              বাইরের পথে তালা, কিন্তু পরের পথটা Internet দিয়ে তালা ছাড়া।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "url-and-hsts",
      subHeader: { index: "003", title: "Stage 1, URL and HSTS" },
      title: <SectionTitle>প্রথম ধাপ, একটা Byte বের হওয়ার আগেই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Enter চাপার পর প্রথম কাজটা পুরোপুরি ফোনের ভেতরে হয়, তারে কিছুই যায়
                না। Browser কে আগে বুঝতে হয় লেখাটা কী। পর্যটক Scheme লেখেননি, শুধু{" "}
                <code>islandtours.example/tours/saint-martin</code>। আজকের অনেক
                Browser এমন অবস্থায় আগে HTTPS চেষ্টা করে, আর কাজ না হলে তবেই HTTP।
                তারপর লেখাটা লেসন ০১ এর নিয়মে ভাগ হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "parse-the-url.sh",
          code: `node -e 'const u = new URL("https://islandtours.example/tours/saint-martin#reviews");
console.log({ protocol: u.protocol, host: u.host, port: u.port, pathname: u.pathname, hash: u.hash, origin: u.origin })'

# আসল ফলাফল:
# {
#   protocol: 'https:',
#   host: 'islandtours.example',
#   port: '',
#   pathname: '/tours/saint-martin',
#   hash: '#reviews',
#   origin: 'https://islandtours.example'
# }`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Port খালি</strong>, কারণ https এর Default Port 443। Browser
                  তাই 443 এ যাবে।
                </ListItem>
                <ListItem>
                  <strong>Fragment</strong> <code>#reviews</code> থাকলে সেটা ফোনেই
                  থেকে যায়। Server কখনো এটা দেখে না, এটা শুধু Browser কে বলে পাতার কোন
                  অংশে নামতে হবে।
                </ListItem>
                <ListItem>
                  <strong>Origin</strong> <code>https://islandtours.example</code>,
                  মানে Scheme, Host আর Port এর জোড়া। পরে কোন Cookie যাবে আর কোন
                  JavaScript কোন উত্তর পড়তে পারবে, সবই এই Origin দিয়ে ঠিক হবে (লেসন ০৪,
                  ০৫)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এরপর Browser নিজের স্মৃতিতে চারটা জিনিস খোঁজে, আর এই চারটা খোঁজার ফলই
                ঠিক করে বাকি যাত্রাটা কত লম্বা হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>HSTS তালিকা।</strong> আগে কখনো এই সাইট{" "}
                  <code>Strict-Transport-Security</code> Header পাঠিয়ে থাকলে Browser
                  মনে রেখেছে এই নামে HTTP চলবে না। তখন কেউ <code>http://</code>{" "}
                  লিখলেও Browser নিজেই সেটা https বানিয়ে নেয়, একটা Packet ও না পাঠিয়ে।
                  Chrome এর DevTools এ এটা দেখায় <code>307 Internal Redirect</code>{" "}
                  হিসেবে। Island Tours এই Header এক বছরের জন্য পাঠায় (লেসন ০৭)।
                </ListItem>
                <ListItem>
                  <strong>HTTP Cache।</strong> পাতাটা আগে থেকে রাখা আছে কি না, আর
                  রাখা থাকলে Server কে না জিজ্ঞেস করে ব্যবহার করা যাবে কি না (লেসন
                  ০৪)।
                </ListItem>
                <ListItem>
                  <strong>খোলা Connection।</strong> এই Origin এর সাথে আগে থেকে একটা
                  Connection খোলা থাকলে নতুন Handshake লাগবে না।
                </ListItem>
                <ListItem>
                  <strong>DNS Cache।</strong> নামটার ঠিকানা আগে থেকে জানা থাকলে DNS
                  ধাপটাই বাদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আমাদের গল্পে পর্যটক আজ প্রথমবার এই ফোন থেকে সাইটটা খুলছেন, শুধু গত
                সপ্তাহের Login এর Cookie টা আছে। তাই চারটার কোনোটাই কাজে লাগল না, পুরো
                যাত্রাটাই করতে হবে। পরের বার কতটা ছোট হয়, সেটা দশ নম্বর সেকশনে দেখব।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "dns-and-tcp",
      subHeader: { index: "004", title: "Stage 2 and 3, DNS and TCP" },
      title: <SectionTitle>ঠিকানা খোঁজা, তারপর দরজায় টোকা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Browser এর হাতে এখন একটা নাম, কিন্তু Packet পাঠাতে লাগে IP। Browser
                তাই Operating System কে জিজ্ঞেস করে। Operating System এর ছোট্ট Stub
                Resolver প্রশ্নটা পাঠায় সেই Resolver এর কাছে, যার ঠিকানা DHCP দিয়েছিল,
                সাধারণত বাসার Router বা ISP এর একটা যন্ত্র। Resolver এর Cache এ উত্তর
                না থাকলে সে Root, তারপর <code>.example</code> এর TLD Server, তারপর
                Island Tours এর Authoritative Server ঘুরে আসে। উত্তর আসে একটা A
                Record: <code>103.94.135.2</code>, TTL 3600 সেকেন্ড। এই পুরো গল্পটা
                Module 04 এর{" "}
                <Lesson href="/devops/topic/dns-journey">Full DNS Journey</Lesson>{" "}
                লেসনে ধাপে ধাপে আছে, এখানে আর নতুন করে বলছি না।
              </ContentParagraph>
              <ContentParagraph>
                নিজের যন্ত্রে এই ধাপটা আলাদা করে দেখতে চাইলে <code>dig</code> চালান।
                নিচের ফলাফলটা example.com এর, এই লেখার যন্ত্রে আসলে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stage-2-dns.sh",
          code: `dig +noall +answer example.com A

# আসল ফলাফল:
# example.com.		140	IN	A	104.20.23.154
# example.com.		140	IN	A	172.66.147.243
#
# দুইটা A Record, মানে দুইটা ঠিকানা। 140 হলো TTL এর বাকি সেকেন্ড,
# Resolver এর Cache এ উত্তরটা আর এতক্ষণ থাকবে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ঠিকানা হাতে, এবার দরজায় টোকা। Browser Kernel এর কাছে একটা TCP
                Socket চায়। Kernel ফোনকে একটা Ephemeral Port দেয়, ধরি{" "}
                <code>51514</code>, আর <code>103.94.135.2:443</code> এর দিকে একটা SYN
                পাঠায়। পথে বাসার Router Source টা বদলে করে{" "}
                <code>203.0.113.25:62001</code> আর নিজের NAT টেবিলে জোড়াটা লিখে রাখে,
                যাতে উত্তর এলে ঠিক ফোনটার কাছে ফেরত দিতে পারে (Module 03,{" "}
                <Lesson href="/devops/topic/nat-pat">NAT আর PAT</Lesson>)। Server এর
                Kernel উত্তর দেয় SYN-ACK, ফোন দেয় ACK। এই তিনটা Segment মিলে একটা পুরো
                Round Trip, যাকে বলে RTT (Module 05,{" "}
                <Lesson href="/devops/topic/three-way-handshake">Three-way Handshake</Lesson>
                )।
              </ContentParagraph>
              <ContentParagraph>
                এখানে একটা জিনিস খেয়াল করুন। TCP Handshake এ Caddy নিজে কিছু করে না।
                SYN এর উত্তর দেয় Server যন্ত্রের Kernel, কারণ Caddy আগেই Port 443 এ
                Listen করে বসে আছে। Caddy প্রথম কাজ পায় যখন Connection তৈরি হয়ে যায়
                আর প্রথম তথ্য, মানে TLS এর ClientHello, আসে।
              </ContentParagraph>
              <ContentParagraph>
                TCP এর এই ধাপটাও আলাদা করে পরীক্ষা করা যায়, TLS বা HTTP ছাড়া।{" "}
                <code>nc</code> শুধু Connection খুলে দেখে দরজা খোলে কি না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stage-3-tcp.sh",
          code: `nc -vz -w 3 104.20.23.154 443

# আসল ফলাফল:
# Connection to 104.20.23.154 port 443 [tcp/https] succeeded!
#
# -z মানে Connection খুলে সাথে সাথে বন্ধ করা, কোনো তথ্য না পাঠিয়ে।
# -w 3 মানে ৩ সেকেন্ডে উত্তর না এলে হাল ছেড়ে দেওয়া।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "HTTP/3 হলে এই ধাপটা অন্যরকম",
          content: (
            <p>
              Caddy এর Default এ HTTP/1.1, HTTP/2 আর HTTP/3 তিনটাই চালু থাকে। প্রথম
              উত্তরের সাথে Caddy একটা <code>Alt-Svc</code> Header পাঠায়, যার মানে আমি
              HTTP/3 ও বুঝি। Browser সেটা মনে রাখলে পরের বার হয়তো TCP ব্যবহারই করবে না,
              QUIC দিয়ে UDP এর উপর যাবে। তখন TCP আর TLS এর দুইটা Handshake এক Round
              Trip এ জুড়ে যায় (লেসন ০২, আর Module 05 এর UDP লেসন)। এই লেসনের গল্পটা
              আমরা HTTP/2 দিয়েই বলছি, কারণ প্রথম দেখায় Browser প্রায় সবসময় TCP দিয়েই
              শুরু করে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "tls-and-certificate",
      subHeader: { index: "005", title: "Stage 4, TLS and the Certificate" },
      title: <SectionTitle>তালা লাগানো, আর পরিচয়পত্র যাচাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রাস্তা খোলা, কিন্তু এখনো খোলামেলা। এই রাস্তায় যা যাবে, পথের সবাই পড়তে
                পারবে। তাই HTTP এর একটা Byte পাঠানোর আগে ফোন আর Caddy তালা লাগায়।
                লেসন ০৭ এ এই Handshake ধাপে ধাপে দেখেছেন, এখানে শুধু আমাদের গল্পের
                মানগুলো বসিয়ে নিই।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ClientHello, ফোন থেকে।</strong> আমি{" "}
                  <code>islandtours.example</code> চাই (এটাই SNI, খোলা লেখায়), আমি{" "}
                  <code>h2</code> আর <code>http/1.1</code> বুঝি (এটা ALPN), এই যে আমার
                  Key Share, আর এই আমার পছন্দের Cipher Suite গুলো।
                </ListItem>
                <ListItem>
                  <strong>ServerHello, Caddy থেকে।</strong> Caddy নিজের Key Share
                  পাঠায়। এই মুহূর্ত থেকে দুই পাশ একই গোপন Key জানে, অথচ সেই Key কখনো
                  তারে যায়নি। এর পরের সবকিছু তালাবন্ধ।
                </ListItem>
                <ListItem>
                  <strong>Certificate আর CertificateVerify।</strong> Caddy তার
                  Certificate পাঠায়, সাথে Let&apos;s Encrypt এর Intermediate
                  Certificate। তারপর একটা Signature, যা শুধু সেই পারবে যার কাছে
                  Certificate এর Private Key আছে। এটাই প্রমাণ যে ওপাশে সত্যিই Island
                  Tours, কেউ নাম ধার করে বসে নেই।
                </ListItem>
                <ListItem>
                  <strong>Finished, দুই দিক থেকে।</strong> দুই পাশ নিশ্চিত করে পুরো
                  Handshake এর কোনো অংশ পথে বদলানো হয়নি। ALPN এ ঠিক হয়ে গেছে, কথা চলবে
                  HTTP/2 তে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর মাঝে ফোন নিজের ভেতরে Certificate যাচাই করে, লেসন ০৮ এর তিনটা প্রশ্ন
                দিয়ে। নামটা কি Certificate এর SAN তালিকায় আছে? আজকের তারিখ কি মেয়াদের
                ভেতরে? Leaf থেকে Intermediate হয়ে Chain টা কি ফোনের Trust Store এর
                কোনো Root পর্যন্ত পৌঁছায়? তিনটার একটাতেও না হলে যাত্রা এখানেই শেষ।
                পর্যটক দেখেন লাল সতর্কতার পাতা, আর একটা HTTP Request ও Island Tours এ
                পৌঁছায় না।
              </ContentParagraph>
              <ContentParagraph>
                এই পুরো ধাপটা আলাদা করে দেখা যায় <code>openssl s_client</code> দিয়ে।
                নিচের ফলাফলটা example.com এর সাথে আসলে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "stage-4-tls.sh",
          code: `openssl s_client -connect example.com:443 -servername example.com -brief </dev/null

# আসল ফলাফল:
# CONNECTION ESTABLISHED
# Protocol version: TLSv1.3
# Ciphersuite: TLS_AES_256_GCM_SHA384
# Peer certificate: CN=example.com
# Hash used: SHA256
# Signature type: ecdsa_secp256r1_sha256
# Verification: OK
# Negotiated TLS1.3 group: X25519MLKEM768
#
# -servername দিয়ে SNI তে নামটা পাঠানো হলো, ঠিক Browser এর মতো।
# Verification: OK মানে নাম, মেয়াদ আর Chain তিনটাই মিলেছে।
# শেষ লাইনের group টা Key Share এর পদ্ধতি, লেসন ০৭ এর বিষয়।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন একটু থেমে হিসাব করি, এ পর্যন্ত কতবার যাওয়া আসা হলো। প্রথম Byte টা
              আসার আগে পুরো সময়টা আসলে এই যাওয়া আসাগুলোর যোগফল।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ColdRoundTripsDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "দূরত্বই আসল খরচ",
          content: (
            <p>
              আলো আর Packet এর একটা সর্বোচ্চ গতি আছে, তাই RTT কখনো শূন্য হয় না। ঢাকা
              থেকে সিঙ্গাপুরের একটা Server এ RTT হয়তো 40 থেকে 60 ms, ইউরোপে 150 ms
              এর বেশি। প্রতিটা Handshake এক RTT করে খায়। তাই HTTPS কে দ্রুত করার
              বেশিরভাগ কৌশল আসলে Round Trip কমানোর কৌশল: Connection বারবার ব্যবহার
              করা, TLS 1.3 আর Resumption, HTTP/3, আর Server বা CDN পর্যটকের কাছে আনা।
              বারো নম্বর সেকশনে এগুলো একটা একটা করে দেখব।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "http-request",
      subHeader: { index: "006", title: "Stage 5, The HTTP Request" },
      title: <SectionTitle>অবশেষে আসল প্রশ্নটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তালা লেগে গেছে, এবার Browser আসল কথাটা বলে। HTTP/2 তে Request এর প্রথম
              লাইনটা আর আলাদা লাইন থাকে না, কয়েকটা বিশেষ Header হয়ে যায়, যাদের নাম
              শুরু হয় কোলন দিয়ে। নিচে পর্যটকের Request টা যেভাবে Browser এর ভেতরে তৈরি
              হয়। এটা আমাদের গল্পের মান দিয়ে সাজানো, আসল Browser আরও কয়েকটা Header
              যোগ করে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "stream-1-request.txt",
          code: `:method: GET
:scheme: https
:authority: islandtours.example
:path: /tours/saint-martin
accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
accept-language: bn-BD,bn;q=0.9,en;q=0.8
accept-encoding: gzip, deflate, br, zstd
cookie: __Host-session=<৪৩ অক্ষরের একটা এলোমেলো মান>
user-agent: Mozilla/5.0 (Linux; Android 14) ...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা লাইন এই মডিউলের কোনো একটা লেসনের সিদ্ধান্ত।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>চারটা কোলন দেওয়া লাইন</strong> হলো HTTP/1.1 এর{" "}
                  <code>GET /tours/saint-martin HTTP/1.1</code> আর <code>Host</code>{" "}
                  Header এর HTTP/2 রূপ। <code>:authority</code> এখন Host এর কাজ করে।
                  এই পুরো Request টা যায় Stream 1 নামের একটা ধারায়। পরে একই Connection
                  এ আরও Stream খুলবে, আর সেগুলো পাশাপাশি চলবে (লেসন ০২)।
                </ListItem>
                <ListItem>
                  <strong>GET</strong>, কারণ পর্যটক শুধু পড়তে চান। GET নিরাপদ আর
                  Idempotent, তাই Browser দরকার হলে এটা নিশ্চিন্তে আবার পাঠাতে পারে
                  (লেসন ০৩)।
                </ListItem>
                <ListItem>
                  <strong>Accept এর তিনটা লাইন</strong> বলে Browser কী নিতে পারে: কোন
                  রকম ফাইল, কোন ভাষা, আর কোন চাপ দেওয়া পদ্ধতি (লেসন ০৪)।
                </ListItem>
                <ListItem>
                  <strong>Cookie</strong> গেল, কারণ Browser চারটা শর্ত মিলিয়ে দেখেছে।
                  নামটা <code>__Host-</code> দিয়ে শুরু, তাই এটা শুধু ঠিক এই Host এর,
                  কোনো Subdomain এর নয়। Path <code>/</code>, তাই সব পাতায় যায়।{" "}
                  <code>Secure</code>, আর এটা HTTPS, তাই যেতে বাধা নেই।{" "}
                  <code>SameSite=Lax</code>, আর পর্যটক নিজে Address Bar এ লিখে এসেছেন,
                  অন্য কোনো সাইট থেকে নয়। Max-Age ১৪ দিন, গত সপ্তাহের Login তাই এখনো
                  বৈধ (লেসন ০৫)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই সবকিছু HTTP/2 এর নিয়মে ছোট করে বাঁধা হয়, তারপর TLS এর তালার ভেতরে
                ঢোকে, তারপর TCP এর Segment হয়, তারপর IP এর Packet। বাসার Router এর
                চোখে এটা শুধু <code>203.0.113.25:62001</code> থেকে{" "}
                <code>103.94.135.2:443</code> এর দিকে কয়েকশো এলোমেলো Byte। Cookie টা যে
                ভেতরে আছে, Router জানেই না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "প্রতিটা Request এর সাথে Cookie যায়",
          content: (
            <p>
              একটা কথা মনে রাখার মতো। Cookie শুধু এই পাতার Request এ যায় না, এই Host
              এর প্রতিটা Request এ যায়: প্রতিটা ছবি, প্রতিটা JavaScript ফাইল, প্রতিটা
              API ডাক। তাই একটা বড় Cookie মানে প্রতিটা Request বড়। Island Tours এর
              Cookie এ তাই শুধু একটা এলোমেলো ID থাকে, তথ্য থাকে Redis এ (লেসন ০৬)।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "caddy",
      subHeader: { index: "007", title: "Stage 6, Caddy" },
      title: <SectionTitle>দরজার দারোয়ান, Caddy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালাবন্ধ Byte গুলো পৌঁছাল <code>103.94.135.2</code> এ। Kernel Port
                443 দেখে সেগুলো দিল Caddy কে। এখন Caddy পরপর পাঁচটা কাজ করে, আর এই
                ক্রমটা জানলে Caddy এর যেকোনো সমস্যা বুঝতে সহজ হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>তালা খোলে।</strong> TLS শেষ হয় এখানে, এই কাজের নাম TLS
                  Termination। Caddy এখন Request টা পুরো পড়তে পারে।
                </ListItem>
                <ListItem>
                  <strong>Site বেছে নেয়।</strong> একটা Caddy অনেকগুলো Domain চালাতে
                  পারে। কোনটার জন্য এসেছে, সেটা Caddy বোঝে SNI আর{" "}
                  <code>:authority</code> দেখে।
                </ListItem>
                <ListItem>
                  <strong>নিজের Header বসায়।</strong> Island Tours এর জন্য Caddy
                  প্রতিটা উত্তরে <code>Strict-Transport-Security</code> আর{" "}
                  <code>X-Content-Type-Options</code> যোগ করে (লেসন ০৪, ০৭)।
                </ListItem>
                <ListItem>
                  <strong>App এর জন্য Request সাজায়।</strong> Host যেমন ছিল তেমন রাখে,
                  আর তিনটা Header নিজে বসায়: <code>X-Forwarded-For</code> এ পর্যটকের
                  Public IP, <code>X-Forwarded-Proto</code> এ <code>https</code>, আর{" "}
                  <code>X-Forwarded-Host</code> এ আসল নাম। বাইরে থেকে কেউ এই নামের
                  Header নিজে বানিয়ে পাঠালে Caddy সেগুলো ফেলে দেয়, যাতে কেউ মিথ্যা IP
                  দেখিয়ে App কে বোকা বানাতে না পারে। Island Tours সাথে একটা{" "}
                  <code>X-Request-Id</code> ও বসায়, প্রতিটা Request এর জন্য নতুন।
                </ListItem>
                <ListItem>
                  <strong>App কে দেয়।</strong> <code>127.0.0.1:3000</code> এ, সাধারণ
                  HTTP/1.1 তে, আগে থেকে খোলা রাখা একটা Connection এর উপর। প্রতিটা
                  Request এর জন্য Caddy আর App এর মাঝে নতুন Handshake হয় না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CaddyHopDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Caddy এর Setting দেখতে এরকম। এটা একটা নমুনা, এই লেখার
              যন্ত্রে Caddy চালানো হয়নি, তাই নিজের Server এ বসানোর আগে Caddy এর নথির
              সাথে মিলিয়ে নিন। কিন্তু প্রতিটা লাইনের কাজ উপরের পাঁচটা ধাপের কোনো একটা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile (নমুনা)",
          code: `islandtours.example {
	# উত্তরে নিজের Header (লেসন ০৪, ০৭)
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options nosniff
	}

	# উত্তর ছোট করে পাঠানো, Browser এর Accept-Encoding দেখে
	encode zstd gzip

	# ভেতরের App এর কাছে পাঠানো। X-Forwarded-For, -Proto আর -Host Caddy নিজেই বসায়।
	reverse_proxy 127.0.0.1:3000 {
		header_up X-Request-Id {http.request.uuid}
	}
}

# www থেকে মূল নামে স্থায়ী Redirect (লেসন ০৩)
www.islandtours.example {
	redir https://islandtours.example{uri} permanent
}

# Certificate চাওয়া আর নবীকরণ, Port 80 থেকে 443 এ Redirect:
# এর কোনোটাই লিখতে হয়নি, Caddy নিজে থেকে করে (লেসন ০৮)।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Caddy এর সামনে আরেকজন থাকলে",
          content: (
            <p>
              আমাদের গল্পে পর্যটকের ফোন সরাসরি Caddy এর সাথে কথা বলে। কিন্তু Island
              Tours যদি কোনোদিন Cloudflare এর Proxied Mode চালু করে, তখন Caddy এর
              সামনে থাকবে Cloudflare। তখন Caddy এর চোখে প্রতিটা Request আসবে Cloudflare
              এর একটা IP থেকে, আর পর্যটকের আসল IP থাকবে Cloudflare এর বসানো Header এ।
              Caddy তখন বাইরে থেকে আসা <code>X-Forwarded-For</code> বিশ্বাস করবে শুধু
              তখনই, যখন আপনি <code>trusted_proxies</code> এ Cloudflare এর IP গুলো লিখে
              দেবেন। আর পথে তালা লাগবে দুইবার: ফোন থেকে Cloudflare, তারপর Cloudflare
              থেকে Caddy। Module 04 এর{" "}
              <Lesson href="/devops/topic/cloudflare-dns">Cloudflare DNS</Lesson> লেসনের
              Full (Strict) Mode ঠিক এই দ্বিতীয় তালাটা নিশ্চিত করে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "inside-the-app",
      subHeader: { index: "008", title: "Stage 7, Inside the App" },
      title: <SectionTitle>App এর ভেতরে, পাতা তৈরি হওয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                App এর কাছে Request টা পৌঁছাল তালা ছাড়া, HTTP/1.1 এ, Socket এর ওপাশে{" "}
                <code>127.0.0.1</code>। App এখন যা করে, সেটা আর Network এর কাজ নয়,
                ব্যবসার কাজ। তবুও প্রতিটা সিদ্ধান্তের পেছনে এই মডিউলের কোনো একটা নিয়ম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Log এ একটা লাইন লেখে</strong>, <code>X-Request-Id</code>{" "}
                  সহ। পরে কোনো পর্যটক অভিযোগ করলে এই ID দিয়েই ঠিক এই Request টা খুঁজে
                  পাওয়া যাবে।
                </ListItem>
                <ListItem>
                  <strong>পর্যটককে চেনে।</strong> Cookie থেকে{" "}
                  <code>__Host-session</code> এর মান পড়ে, Redis এ খোঁজে। পায় একটা
                  লাইন: এই Session টা <code>usr_42</code> এর, মেয়াদ এখনো বাকি। প্রায় 1
                  ms। না পেলে পর্যটক Guest, তাতে পাতা আসবে কিন্তু নাম থাকবে না (লেসন
                  ০৬)।
                </ListItem>
                <ListItem>
                  <strong>তথ্য আনে।</strong> PostgreSQL থেকে Tour এর বিবরণ আর কতগুলো
                  আসন খালি। এটা SQL Track এর বিষয়, এখানে শুধু মনে রাখুন এই Query টা
                  ধীর হলে পুরো যাত্রা ধীর হয়, Network যত দ্রুতই হোক।
                </ListItem>
                <ListItem>
                  <strong>Status ঠিক করে।</strong> সব ঠিক থাকলে 200। Slug টা ভুল হলে,
                  যেমন <code>/tours/atlantis</code>, তাহলে 404। App এর ভেতরে কিছু ভেঙে
                  গেলে 500। প্রতিটার মানে লেসন ০৩ এ।
                </ListItem>
                <ListItem>
                  <strong>উত্তরের Header ঠিক করে।</strong> পাতায় পর্যটকের নাম আছে, তাই{" "}
                  <code>Cache-Control: private, no-cache</code>। private মানে কোনো
                  ভাগাভাগি করা Cache, যেমন CDN, এটা রাখতে পারবে না। no-cache মানে
                  Browser রাখতে পারে, কিন্তু প্রতিবার ব্যবহারের আগে Server কে জিজ্ঞেস
                  করতে হবে। সাথে একটা <code>ETag</code>, যাতে পরের বার জিজ্ঞেস করাটা
                  সস্তা হয় (লেসন ০৪)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                App এর পাঠানো উত্তরটা দেখতে মোটামুটি এরকম। এটাও আমাদের গল্পের মান দিয়ে
                সাজানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "app-response.txt",
          code: `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: private, no-cache
ETag: "saint-martin-v42"
X-Request-Id: 6f1c2a9e-...
Content-Length: 18342

<!doctype html><html lang="bn"><head>...`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "X-Forwarded-For কে App কেন বিশ্বাস করতে পারে",
          content: (
            <p>
              যেকোনো Request এ যে কেউ <code>X-Forwarded-For</code> লিখে পাঠাতে পারে।
              তাহলে App এটা বিশ্বাস করছে কোন সাহসে? উত্তরটা Module 05 এর{" "}
              <Lesson href="/devops/topic/port-and-socket">Port and Socket</Lesson>{" "}
              লেসনের Bind Address এ। App শোনে শুধু <code>127.0.0.1:3000</code> এ, তাই
              যন্ত্রের বাইরের কেউ App এর কাছে সরাসরি পৌঁছাতেই পারে না। যে আসে, সে Caddy
              হয়েই আসে, আর Caddy বাইরের বানানো Header ফেলে দিয়ে নিজেরটা বসায়। App যদি{" "}
              <code>0.0.0.0:3000</code> এ শুনত আর Firewall এ Port টা খোলা থাকত, তাহলে
              যে কেউ Caddy কে পাশ কাটিয়ে মিথ্যা IP নিয়ে ঢুকতে পারত। একটা Header এর
              বিশ্বাসযোগ্যতা নির্ভর করে কে সেটা বসাতে পারে তার উপর।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "response-and-page",
      subHeader: { index: "009", title: "Stage 8, The Response" },
      title: <SectionTitle>উত্তর ফেরা, আর পাতার বাকি সব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফেরার পথটা যাওয়ার পথের আয়নার ছবি। Caddy App এর উত্তর নেয়, নিজের
                Header যোগ করে, zstd বা gzip দিয়ে ছোট করে, HTTP/2 এর Frame এ ভরে, তালা
                লাগিয়ে পাঠায়। Packet গুলো <code>203.0.113.25:62001</code> এর দিকে
                রওনা দেয়। বাসার Router NAT টেবিল দেখে বোঝে এটা{" "}
                <code>192.168.1.20:51514</code> এর, ঠিকানা বদলে ফোনকে দেয়। ফোনের Kernel
                Segment গুলো সাজিয়ে Browser কে দেয়, Browser তালা খোলে, চাপ খুলে HTML
                পায়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু যাত্রা এখানে শেষ নয়। HTML হলো পাতার কঙ্কাল। তাতে লেখা আছে আর
                কী কী লাগবে: একটা CSS ফাইল, কয়েকটা JavaScript ফাইল, Tour এর ছবি।
                Browser HTML পড়তে পড়তেই এগুলো চাইতে শুরু করে, আর প্রতিটার জন্য আগে
                নিজের Cache দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PageLoadDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>যে ফাইল Cache এ আছে, তার জন্য Request ই যায় না।</strong>{" "}
                  Island Tours এর CSS আর JavaScript এর নামে একটা Hash থাকে, যেমন{" "}
                  <code>/_next/static/css/</code> এর ভেতরের ফাইলগুলো। ফাইল বদলালে নামই
                  বদলে যায়, তাই পুরনো নামের ফাইলকে এক বছরের জন্য{" "}
                  <code>immutable</code> বলে রাখা নিরাপদ। DevTools এ এদের Size কলামে
                  লেখা থাকে <code>(disk cache)</code> বা <code>(memory cache)</code>{" "}
                  (লেসন ০৪)।
                </ListItem>
                <ListItem>
                  <strong>বাকিরা একই Connection এ নতুন Stream এ যায়।</strong> নতুন
                  DNS নেই, নতুন TCP নেই, নতুন TLS নেই। Stream 3, 5, 7 পাশাপাশি চলে,
                  একটা আরেকটার জন্য অপেক্ষা করে না। HTTP/1.1 এর যুগে Browser এর জন্য
                  একই Host এ ছয়টা পর্যন্ত আলাদা Connection খুলতে হতো, HTTP/2 একটাতেই
                  কাজ সারে (লেসন ০২)।
                </ListItem>
                <ListItem>
                  <strong>আসনের তথ্য আসে একই Origin থেকে।</strong> JavaScript চালু
                  হয়ে <code>/api/tours/saint-martin/seats</code> চায়। Origin একই,
                  তাই CORS এর কোনো প্রশ্নই নেই, আর Connection ও একই।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ কথাটা একটু ভেবে দেখুন। ধরুন Island Tours আসনের API টা সরিয়ে নিল{" "}
                <code>api.islandtours.example</code> এ, যার ঠিকানা{" "}
                <code>103.94.135.3</code>। তখন পাতা খুলতে আরও কী লাগবে? নতুন Host, তাই
                নতুন DNS প্রশ্ন। নতুন ঠিকানা, তাই নতুন TCP Handshake। নতুন নাম, তাই নতুন
                TLS Handshake আর আরেকটা Certificate যাচাই। আর নতুন Origin, তাই লেসন ০৪
                এর CORS এর নিয়ম, হয়তো একটা বাড়তি OPTIONS Preflight ও। একটা Subdomain
                এর সিদ্ধান্ত মানে কয়েকটা বাড়তি Round Trip। এই কারণেই অনেক দল পাতা আর
                API একই Origin এ রাখে।
              </ContentParagraph>
              <ContentParagraph>
                সব ফাইল এসে গেলে Connection টা বন্ধ হয় না, চুপচাপ খোলা থাকে, যদি
                পর্যটক আরেকটা পাতা খোলেন। কারো Idle Timeout পার হলে সে FIN পাঠায়, আর
                Module 05 এর{" "}
                <Lesson href="/devops/topic/connection-close">Connection Close</Lesson>{" "}
                লেসনের চার ধাপের বিদায় শুরু হয়। আর আসন বদলালে পর্যটককে সাথে সাথে
                জানানোর জন্য Island Tours একটা আলাদা পথ খোলে,{" "}
                <code>wss://islandtours.example/ws</code>, যা পরের লেসনের বিষয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "second-visit",
      subHeader: { index: "010", title: "The Second Visit" },
      title: <SectionTitle>দ্বিতীয়বার এলে পথটা কত ছোট</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ আমরা সবচেয়ে লম্বা যাত্রাটা দেখলাম, একদম প্রথমবারেরটা। বাস্তবে
                বেশিরভাগ Request এত লম্বা পথ যায় না। Browser আর পথের অন্যরা অনেক কিছু
                মনে রাখে, আর প্রতিটা মনে রাখা জিনিস যাত্রার একটা অংশ কেটে দেয়। DNS এর
                TTL, খোলা Connection, TLS এর Session Ticket, HTTP Cache আর Cookie, এই
                পাঁচটা স্মৃতি মিলে ঠিক করে পরের বার কতটুকু পথ বাকি।
              </ContentParagraph>
              <ContentParagraph>
                নিচে একই পাতা চারটা আলাদা মুহূর্তে। প্রতিটা বেছে নিয়ে দেখুন কোন ধাপ চলে,
                কোনটা ছোট হয়, আর কোনটা লাগেই না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VisitCompareLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা জিনিস একটু ব্যাখ্যা দাবি করে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>TLS Resumption।</strong> প্রথম Handshake এর শেষে Caddy ফোনকে
                একটা Session Ticket দিয়ে রাখে, অনেকটা আগের পরিচয়ের একটা চিরকুটের মতো।
                পরের বার ফোন সেই চিরকুটটা দেখায়। তখন Caddy কে আর Certificate পাঠাতে
                হয় না, আর ফোনকে আর Certificate যাচাই করতে হয় না। Round Trip এর সংখ্যা
                TLS 1.3 এ একই থাকে, কিন্তু কাজ আর Byte দুইটাই কমে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>304 Not Modified।</strong> পাতাটা <code>no-cache</code>, তাই
                Browser Server কে জিজ্ঞেস না করে ব্যবহার করতে পারে না। কিন্তু জিজ্ঞেস
                করার সময় সাথে পাঠায় <code>If-None-Match: &quot;saint-martin-v42&quot;</code>।
                পাতা না বদলে থাকলে App উত্তর দেয় শুধু 304, কোনো Body ছাড়া। Browser
                নিজের রাখা কপিটাই দেখায়। আসা যাওয়া একটা লাগল, কিন্তু আঠারো হাজার Byte
                আর তারে গেল না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "দ্রুত Website এর আসল রহস্য",
          content: (
            <p>
              সবচেয়ে দ্রুত Request হলো যেটা পাঠাতেই হয়নি, আর সবচেয়ে দ্রুত Handshake
              হলো যেটা করতেই হয়নি। তাই Performance নিয়ে কাজ করার সময় প্রথম প্রশ্নটা
              কীভাবে দ্রুত করব নয়, বরং এটা কি না করলেও চলে। Hash দেওয়া ফাইলের নাম,
              ঠিকঠাক Cache-Control, Connection বারবার ব্যবহার, আর একই Origin, এই
              চারটাই কাজ কমানোর কৌশল, কাজ দ্রুত করার নয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "measure",
      subHeader: { index: "011", title: "Hands-on, Measure It" },
      title: <SectionTitle>নিজের চোখে মাপুন, curl আর DevTools দিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এ পর্যন্ত সময়গুলো ছিল সাজানো উদাহরণ। এবার আসল সংখ্যা। curl এর{" "}
                <code>-w</code> বিকল্প দিয়ে একটা Request এর প্রতিটা ধাপ শেষ হওয়ার
                মুহূর্ত ছাপানো যায়। মনে রাখার সুবিধার জন্য Format টা একটা ফাইলে রাখুন,
                তারপর যেকোনো সাইটে চালান।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "time-every-stage.sh",
          code: `cat > timing.txt <<'EOF'
   dns lookup  %{time_namelookup}s\\n
  tcp connect  %{time_connect}s\\n
tls handshake  %{time_appconnect}s\\n
  pretransfer  %{time_pretransfer}s\\n
   first byte  %{time_starttransfer}s\\n
        total  %{time_total}s\\n
  new conns    %{num_connects}\\n
     protocol  HTTP/%{http_version}, status %{http_code}, from %{remote_ip}:%{remote_port}\\n
EOF

curl -s -o /dev/null -w @timing.txt https://example.com/

# আসল ফলাফল, এই লেখার যন্ত্রে:
#    dns lookup  0.001771s
#   tcp connect  0.006339s
# tls handshake  0.023830s
#   pretransfer  0.023878s
#    first byte  0.041177s
#         total  0.041520s
#   new conns    1
#      protocol  HTTP/2, status 200, from 104.20.23.154:443`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এখানে সবচেয়ে বড় ভুলটা প্রায় সবাই একবার করে। এই সংখ্যাগুলো প্রতিটা
                ধাপের নিজের সময় নয়। প্রতিটা হলো শুরু থেকে ওই মুহূর্ত পর্যন্ত জমানো সময়।{" "}
                <code>tcp connect 0.006339</code> মানে Request শুরুর 6.3 ms পরে TCP
                Handshake শেষ হয়েছে, DNS এর সময় সহ। তাই প্রতিটা ধাপের নিজের সময় পেতে
                পাশাপাশি দুইটা বিয়োগ করতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ধাপ", "হিসাব", "উপরের ফলাফলে", "কোন লেসন"],
          rows: [
            ["DNS", "time_namelookup", "1.8 ms, উত্তর Cache এ ছিল", "Module 04"],
            ["TCP Handshake", "time_connect − time_namelookup", "4.6 ms, এক RTT", "Module 05"],
            ["TLS Handshake", "time_appconnect − time_connect", "17.5 ms, এক RTT আর Certificate যাচাই", "লেসন ০৭, ০৮"],
            ["Server এর অপেক্ষা", "time_starttransfer − time_pretransfer", "17.3 ms, যাওয়া আসা আর Server এর ভাবা", "লেসন ০২, ০৩"],
            ["নামানো", "time_total − time_starttransfer", "0.3 ms, পাতাটা মাত্র 577 Byte", "লেসন ০৪"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একই কমান্ডে দুইবার একই URL দিন। curl দ্বিতীয় Request এর জন্য প্রথমটার
              Connection টাই আবার ব্যবহার করে, ঠিক Browser এর মতো। দশ নম্বর সেকশনের
              দ্বিতীয় যাত্রাটা এখানে নিজের চোখে দেখবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "see-reuse.sh",
          code: `curl -s -o /dev/null -o /dev/null -w @timing.txt https://example.com/ https://example.com/

# আসল ফলাফল, দ্বিতীয় অংশটা:
#    dns lookup  0.000010s
#   tcp connect  0.000000s
# tls handshake  0.000000s
#   pretransfer  0.000037s
#    first byte  0.013713s
#         total  0.013772s
#   new conns    0
#      protocol  HTTP/2, status 200, from 104.20.23.154:443
#
# tcp connect আর tls handshake শূন্য, new conns শূন্য।
# কোনো Handshake হয়নি, মোট সময় 41.5 ms থেকে নেমে 13.8 ms।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ এই দুইটা আসল মাপ আর Island Tours এর জন্য তিনটা সাজানো মাপ
              পাশাপাশি রাখা আছে। প্রতিটা বেছে নিয়ে বিয়োগগুলো নিজে মিলিয়ে দেখুন, আর
              খেয়াল করুন প্রতিবার সবচেয়ে বড় অংশটা কোনটা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TimingBreakdownLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                curl এর <code>-v</code> একই যাত্রাকে সময়ের বদলে কথায় দেখায়। নিচের
                ফলাফলটা আসল, শুধু কয়েকটা লাইন ছেঁটে ফেলা হয়েছে। প্রতিটা অংশের আগে{" "}
                <code>##</code> দিয়ে লেখা মন্তব্যগুলো যোগ করা, যাতে দেখা যায় কোন লাইন
                কোন ধাপের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "read-the-whole-trace.sh",
          code: `curl -v -o /dev/null https://example.com/

## ধাপ ২, DNS
* Host example.com:443 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
## ধাপ ৩, TCP
*   Trying 104.20.23.154:443...
* Connected to example.com (104.20.23.154) port 443
## ধাপ ৪, TLS। ALPN এ curl বলছে আমি h2 আর http/1.1 বুঝি
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
* ALPN: server accepted h2
## ধাপ ৪ এর ভেতরে, Certificate যাচাই (লেসন ০৮)
* Server certificate:
*  subject: CN=example.com
*  start date: Sep 26 22:49:11 2026 GMT
*  expire date: Dec 25 22:56:35 2026 GMT
*  subjectAltName: host "example.com" matched cert's "example.com"
*  issuer: C=US; O=SSL Corporation; CN=Cloudflare TLS Issuing ECC CA 3
*  SSL certificate verify ok.
## ধাপ ৫, HTTP/2 Request, Stream 1
* [HTTP/2] [1] OPENED stream for https://example.com/
* [HTTP/2] [1] [:method: GET]
* [HTTP/2] [1] [:scheme: https]
* [HTTP/2] [1] [:authority: example.com]
* [HTTP/2] [1] [:path: /]
## ধাপ ৮, Response
< HTTP/2 200
< content-type: text/html; charset=utf-8
< server: cloudflare
< age: 9404
< cf-cache-status: HIT
< alt-svc: h3=":443"; ma=86400`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষের কয়েকটা Header আলাদা করে পড়ার মতো, কারণ এরা এই যাত্রার আরেকটা
                রূপ দেখায়। <code>server: cloudflare</code> আর{" "}
                <code>cf-cache-status: HIT</code> বলছে উত্তরটা আসল Server থেকে আসেনি,
                এসেছে Cloudflare এর CDN এর একটা কাছের যন্ত্রের Cache থেকে।{" "}
                <code>age: 9404</code> মানে এই কপিটা প্রায় আড়াই ঘণ্টা ধরে সেখানে রাখা।
                তাই TCP মাত্র কয়েক ms, পথটাই ছোট। আর <code>alt-svc</code> হলো সেই HTTP/3
                এর আমন্ত্রণ, যার কথা চার নম্বর সেকশনে বলেছিলাম।
              </ContentParagraph>
              <ContentParagraph>
                Browser এ একই জিনিস দেখার জায়গা DevTools। Network Tab খুলে পাতাটা আবার
                Load করুন, প্রথম Request টায় ক্লিক করে Timing Tab এ যান। সেখানকার
                নামগুলো curl এর সংখ্যার সাথে এভাবে মেলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["DevTools এ লেখা", "মানে", "curl এ কাছাকাছি", "ধাপ"],
          rows: [
            ["Queueing, Stalled", "Browser নিজের ভেতরে অপেক্ষা করছে, তারে কিছু যায়নি", "নেই", "১"],
            ["DNS Lookup", "নাম থেকে ঠিকানা", "time_namelookup", "২"],
            ["Initial connection", "TCP Handshake, TLS সহ", "time_connect পর্যন্ত, তারপর TLS", "৩"],
            ["SSL", "TLS Handshake, Initial connection এর ভেতরের অংশ", "appconnect − connect", "৪"],
            ["Request sent", "Request পাঠানো", "pretransfer এর আশেপাশে", "৫"],
            ["Waiting for server response", "প্রথম Byte এর অপেক্ষা, অনেকে বলেন TTFB", "starttransfer − pretransfer", "৬, ৭"],
            ["Content Download", "বাকি Body নামানো", "total − starttransfer", "৮"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Protocol কলাম</strong> চালু করুন (কলামের শিরোনামে Right
                Click)। দেখবেন <code>h2</code> বা <code>h3</code>, মানে কোন HTTP
                Version এ কথা হলো।
              </ListItem>
              <ListItem>
                <strong>Connection ID কলাম</strong> চালু করুন। একই সংখ্যা মানে একই
                Connection, বারবার ব্যবহার হচ্ছে। একটা পাতার বিশটা Request হয়তো দুই
                তিনটা Connection ID তে ভাগ করা পাবেন।
              </ListItem>
              <ListItem>
                <strong>Size কলাম</strong> এ <code>(disk cache)</code> বা{" "}
                <code>(memory cache)</code> মানে Request ই যায়নি। Status এ 304 মানে
                জিজ্ঞেস করা হয়েছে, কিন্তু Body আসেনি।
              </ListItem>
              <ListItem>
                <strong>Response Headers</strong> এ <code>x-request-id</code> খুঁজুন।
                কোনো সমস্যা হলে এই একটা মান দিয়ে Server এর Log এ ঠিক এই Request টা
                পাওয়া যায়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "faster",
      subHeader: { index: "012", title: "Making Each Stage Faster" },
      title: <SectionTitle>প্রতিটা ধাপকে দ্রুত করা, কোথায় কী করবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              মাপতে শিখলেন, এবার সারাতে। একটা নিয়ম আগে: যেটা সবচেয়ে বড়, সেটা আগে।
              Server এর অপেক্ষা দুই সেকেন্ড হলে DNS থেকে পাঁচ ms বাঁচানো সময় নষ্ট।
              নিচের টেবিলে প্রতিটা ধাপের খরচ কোথা থেকে আসে, আর কোথায় কী বদলালে কমে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["ধাপ", "খরচটা আসে", "কী করবেন", "কোথায় বদলাবেন"],
          rows: [
            [
              "DNS",
              "Resolver পর্যন্ত যাওয়া আসা, Cache খালি থাকলে আরও বেশি",
              "যুক্তিসঙ্গত লম্বা TTL, পাতায় কম আলাদা Host, দরকারি অন্য Host এর জন্য preconnect",
              "DNS এর Dashboard, HTML এর <link rel=\"preconnect\">",
            ],
            [
              "TCP",
              "এক RTT, দূরত্বের উপর নির্ভর",
              "Connection বারবার ব্যবহার, পর্যটকের কাছে Server বা CDN",
              "Keep-Alive Setting, Hosting এর Region, CDN",
            ],
            [
              "TLS",
              "এক RTT, Certificate পাঠানো আর যাচাই",
              "TLS 1.3, Resumption চালু, ছোট ECDSA Certificate, HTTP/3",
              "Caddy (এগুলো Default এ চালু), Certificate এর Key Type",
            ],
            [
              "Request",
              "Request এর আকার, বিশেষ করে Cookie",
              "Cookie ছোট রাখা, শুধু ID, তথ্য Server এ",
              "App এর Session এর নকশা",
            ],
            [
              "Server এর অপেক্ষা",
              "App এর কাজ: Query, বাইরের Service, হিসাব",
              "ধীর Query তে Index, বারবার লাগা তথ্য Redis এ, বাইরের ডাকে Timeout",
              "App এর Code, Database, Cache",
            ],
            [
              "নামানো",
              "Body এর আকার আর Bandwidth",
              "zstd বা gzip, ছবি ছোট আর আধুনিক Format এ, অপ্রয়োজনীয় JavaScript বাদ",
              "Caddy এর encode, Build এর Setting",
            ],
            [
              "পাতার বাকি ফাইল",
              "প্রতিটা ফাইলের জন্য আলাদা Request",
              "Hash দেওয়া নাম আর এক বছরের immutable Cache, একই Origin",
              "Framework এর Build, Cache-Control",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলের একটা জিনিস চোখে পড়ার মতো। Network এর দিকের বেশিরভাগ ভালো
                জিনিস Caddy নিজে থেকেই চালু রাখে: TLS 1.3, Resumption, HTTP/2, HTTP/3,
                আর Certificate এর নবীকরণ। তাই Island Tours এর মতো একটা ছোট দলের
                Performance এর কাজ প্রায় সবটাই হয় দুই জায়গায়: App এর ভেতরে, আর Cache
                এর নিয়মে। Network এর Setting নিয়ে মাথা ঘামানোর আগে Server এর অপেক্ষাটা
                দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একবার মেপে সিদ্ধান্ত নেবেন না",
          content: (
            <p>
              এই লেসনের example.com এর মাপে প্রথম Request এর first byte একবার এলো 90
              ms এ, পরের দুইবার 36 আর 39 ms এ। একই যন্ত্র, একই সাইট, এক মিনিটের
              ব্যবধান। Network এর সময় সবসময় একটু নাচে। তাই অন্তত তিন থেকে পাঁচবার
              মাপুন, আর সবচেয়ে খারাপটা নয়, মাঝেরটা ধরুন। আর মনে রাখুন, আপনার যন্ত্রের
              মাপ আপনার পর্যটকের মাপ নয়। আপনি হয়তো দ্রুত Wi-Fi তে, তিনি হয়তো দূরের
              কোনো জেলায় Mobile Data তে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "when-it-breaks",
      subHeader: { index: "013", title: "When It Breaks" },
      title: <SectionTitle>যাত্রা কোথায় ভাঙল, Error দেখে চেনা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই লেসনের সবচেয়ে কাজের অংশ সম্ভবত এটাই। যখন কেউ বলে সাইট খুলছে না,
                তখন পুরো যাত্রার ছবিটা মাথায় থাকলে একটা সরল পদ্ধতি পাওয়া যায়: ধাপগুলো
                ক্রমে চলে, আর প্রতিটা ধাপের ভাঙার নিজস্ব চেহারা আছে। DNS না মিললে TCP
                শুরুই হয় না। TCP না হলে TLS এর প্রশ্নই আসে না। Certificate না মিললে
                Caddy পর্যন্ত একটা HTTP Request ও পৌঁছায় না। তাই Error টা দেখে প্রথমে
                বলুন কোন ধাপে ভেঙেছে। তার আগের সব ধাপ নিশ্চয়ই ঠিক ছিল, আর তার পরের
                কোনো ধাপ শুরুই হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                নিচে বারোটা চেনা Error, যেভাবে Browser এ লেখা থাকে। প্রতিটায় দেখবেন
                curl এ একই সমস্যা কেমন দেখায়, কোন ধাপ, আসলে কী ঘটেছে, আর প্রথম কোন
                কমান্ডটা চালাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BreakpointLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা ধাপকে আলাদা করে পরীক্ষা করার কমান্ডগুলো একসাথে রাখলে একটা ছোট
              রোগ নির্ণয়ের ক্রম পাওয়া যায়। উপর থেকে নিচে চালান, যেখানে প্রথম ব্যর্থ
              হবে, সমস্যা সেই ধাপে। নিচের ফলাফলগুলো example.com এর সাথে আসলে চালানো।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "probe-stage-by-stage.sh",
          code: `# ধাপ ২, DNS: নাম থেকে ঠিকানা মেলে?
dig +short example.com
# 104.20.23.154
# 172.66.147.243

# ধাপ ৩, TCP: সেই ঠিকানার 443 এ দরজা খোলে?
nc -vz -w 3 104.20.23.154 443
# Connection to 104.20.23.154 port 443 [tcp/https] succeeded!

# ধাপ ৪, TLS আর Certificate: তালা লাগে, পরিচয়পত্র মেলে?
openssl s_client -connect example.com:443 -servername example.com -brief </dev/null
# Protocol version: TLSv1.3
# Verification: OK

# ধাপ ৫ থেকে ৮, HTTP: উত্তর আসে, কোন Status?
curl -sS -o /dev/null -w '%{http_code}\\n' https://example.com/
# 200`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "একজনের সমস্যা, নাকি সবার",
          content: (
            <p>
              Debug এর প্রথম প্রশ্নটা প্রায়ই কোন ধাপ নয়, বরং কার কার। সবার জন্য ভাঙলে
              সমস্যা Server এর দিকে: Certificate এর মেয়াদ, Caddy বন্ধ, App বন্ধ, DNS এর
              Record। একজনের জন্য ভাঙলে প্রায়ই তাঁর দিকে: ভুল ঘড়ি, পুরনো DNS Cache,
              অফিসের Firewall, কোনো Browser Extension। তাই অভিযোগ এলে নিজের যন্ত্র থেকে
              উপরের চারটা কমান্ড চালান। আপনার কাছে সব ঠিক হলে সমস্যা প্রায় নিশ্চিত
              পর্যটকের পথে, আর তখন তাঁর কাছে চাইবেন Error এর হুবহু লেখা আর একটা{" "}
              <code>x-request-id</code>, যদি থাকে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "cheat-sheet",
      subHeader: { index: "014", title: "Cheat Sheet" },
      title: <SectionTitle>পুরো মডিউলের কমান্ড, এক পাতায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই মডিউলের প্রতিটা লেসনের একটা করে কাজের কমান্ড, যাত্রার ক্রমে সাজানো।
              প্রতিটা example.com বা নিজের যন্ত্রের সাথে চলে, তাই যেকোনো সময় চালিয়ে
              দেখতে পারবেন। Island Tours এর জায়গায় নিজের Domain বসিয়ে নিন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "module-06-cheat-sheet.sh",
          code: `# লেসন ০১, URL ভাঙা
node -e 'console.log(new URL("https://example.com/tours?date=2026-12-20#top"))'

# লেসন ০২, কোন HTTP Version
curl -sI --http1.1 https://example.com | head -1      # HTTP/1.1 200 OK
curl -sI --http2   https://example.com | head -1      # HTTP/2 200

# লেসন ০৩, শুধু Status Code, আর Redirect অনুসরণ
curl -s -o /dev/null -w '%{http_code}\\n' https://example.com/
curl -sIL http://example.com | grep -iE '^(HTTP|location)'

# লেসন ০৪, শুধু Header, আর একটা নির্দিষ্ট Header
curl -sI https://example.com
curl -sI https://example.com | grep -i '^cache-control'

# লেসন ০৫, Cookie রাখা আর পাঠানো (নিজের Lab Server এর সাথে)
curl -c jar.txt https://localhost:47690/...   # পাওয়া Cookie jar.txt এ রাখে
curl -b jar.txt https://localhost:47690/...   # jar.txt থেকে Cookie পাঠায়

# লেসন ০৬, JWT এর প্রথম অংশ পড়া (Base64url, Encrypt করা নয়)
echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' | base64 -d   # {"alg":"HS256","typ":"JWT"}

# লেসন ০৭, TLS এর Version আর Cipher
openssl s_client -connect example.com:443 -servername example.com -brief </dev/null

# লেসন ০৮, Certificate এর নাম, Issuer আর মেয়াদ
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# লেসন ০৯, প্রতিটা ধাপের সময়, আর পুরো যাত্রা কথায়
curl -s -o /dev/null -w @timing.txt https://example.com/
curl -v -o /dev/null https://example.com/`,
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, চট্টগ্রাম থেকে একটা অভিযোগ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এক বৃহস্পতিবার সকালে Island Tours এর সাহায্যের ঠিকানায় একটা বার্তা এলো।
                চট্টগ্রামের একজন পর্যটক লিখেছেন, Saint Martin এর পাতা খুলতে তিন সেকেন্ড
                লাগে, অথচ অন্য সাইট দ্রুত খোলে। পুরনো দিনে দলের প্রথম প্রতিক্রিয়া হতো
                অনুমান: হয়তো তাঁর Internet ধীর, হয়তো Server দূরে, চলো CDN নিই। এখন
                দলটা অনুমান করে না, মাপে, আর এই লেসনের ক্রম মেনে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রথমে প্রমাণ।</strong> পর্যটককে অনুরোধ করা হলো পাতাটা
                  খুলে DevTools এর Timing এর একটা ছবি পাঠাতে, সাথে Response Header এর{" "}
                  <code>x-request-id</code>। তাঁর ছবিতে DNS 40 ms, Initial connection
                  আর SSL মিলে 260 ms, আর Waiting for server response 2.4 সেকেন্ড।
                </ListItem>
                <ListItem>
                  <strong>সবচেয়ে বড় অংশ চিহ্নিত।</strong> Network এর অংশ Mobile Data
                  এর হিসাবে স্বাভাবিক। সমস্যা Server এর অপেক্ষায়। মানে CDN, HTTP/3
                  বা DNS নিয়ে আলোচনা আপাতত বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>ঠিক Request টা খুঁজে বের করা।</strong> App এর Log এ সেই{" "}
                  <code>x-request-id</code> দিয়ে খোঁজা হলো। দেখা গেল খালি আসনের সংখ্যা
                  গুনতে একটা Query সব বুকিংয়ের তালিকা শুরু থেকে শেষ পর্যন্ত পড়ছে, কারণ
                  যে কলাম দিয়ে খোঁজা হচ্ছে তাতে Index নেই। বুকিং যত বেড়েছে, Query তত
                  ধীর হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>সারানো আর আবার মাপা।</strong> কলামে একটা Index যোগ হলো, আর
                  খালি আসনের সংখ্যা Redis এ রাখা হলো অল্প সময়ের জন্য, বুকিং হলেই মুছে
                  ফেলার নিয়মসহ। একই পাতার Server এর অপেক্ষা নেমে এলো প্রায় 150 ms এ।
                  পর্যটককে জানানো হলো, আর তিনি লিখলেন এখন পাতা চোখের পলকে খোলে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই ঘটনার পর দলটা পুরো যাত্রার প্রতিটা ধাপের জন্য নিজেদের সিদ্ধান্তগুলো
                এক জায়গায় লিখে রেখেছে। এই তালিকাটাই এই লেসনের ব্যবহারিক রূপ।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>DNS:</strong> মূল নামের A Record এর TTL 3600। পাতা আর API
                  একই Origin এ, তাই একটা পাতার জন্য একটাই DNS প্রশ্ন।
                </ListItem>
                <ListItem>
                  <strong>Caddy:</strong> TLS 1.3, HTTP/2 আর HTTP/3, Certificate এর
                  নবীকরণ, সব Default এ। এক বছরের HSTS, সব Subdomain সহ। প্রতিটা
                  Request এ নতুন <code>X-Request-Id</code>।
                </ListItem>
                <ListItem>
                  <strong>App:</strong> শোনে শুধু <code>127.0.0.1:3000</code> এ। তাই{" "}
                  <code>X-Forwarded-For</code> বিশ্বাসযোগ্য। App এর Keep-Alive Timeout
                  Caddy এর চেয়ে বেশি, যাতে Module 05 এর সেই রহস্যময় 502 না আসে।
                </ListItem>
                <ListItem>
                  <strong>Session:</strong> <code>__Host-session</code>, HttpOnly,
                  Secure, SameSite=Lax, ১৪ দিন। Redis এ Session এর মেয়াদও ১৪ দিন, যাতে
                  দুই জায়গার হিসাব মেলে।
                </ListItem>
                <ListItem>
                  <strong>Cache:</strong> Hash দেওয়া ফাইল এক বছরের immutable। পর্যটকের
                  নাম থাকা পাতা <code>private, no-cache</code> আর ETag সহ। কোনো পাতাই
                  Cache এ রাখা হয় না যেখানে বুকিংয়ের তথ্য আছে।
                </ListItem>
                <ListItem>
                  <strong>মাপজোক:</strong> প্রতি ঘণ্টায় তিনটা আলাদা জায়গা থেকে{" "}
                  <code>curl -w</code> দিয়ে মূল পাতার সময় মাপা হয়, ধাপে ধাপে। কোনো একটা
                  ধাপ স্বাভাবিকের দ্বিগুণ হলে দলের কাছে সতর্কবার্তা যায়। Certificate এর
                  মেয়াদ ১৪ দিনের কম হলেও।
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
      title: <SectionTitle>Enter থেকে পাতা, বারো ধাপে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পুরো যাত্রা আরেকবার, এবার একটানা, আসল মান দিয়ে। এটা মুখস্থ করার জিনিস
              নয়। প্রতিটা ধাপ পড়ে নিজেকে জিজ্ঞেস করুন, এটা না ঘটলে কী দেখতাম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Browser লেখাটা পড়ে",
              description:
                "Scheme না থাকায় HTTPS ধরে নেয়। Host islandtours.example, Port 443, Path /tours/saint-martin। HSTS তালিকা, Cache, খোলা Connection আর DNS Cache দেখে, কোথাও কিছু নেই।",
            },
            {
              title: "DNS প্রশ্ন যায়",
              description:
                "Stub Resolver থেকে DHCP এর দেওয়া Resolver এ। উত্তর A 103.94.135.2, TTL 3600। Operating System আর Resolver দুইজনেই উত্তরটা মনে রাখে।",
            },
            {
              title: "TCP Handshake",
              description:
                "192.168.1.20:51514 থেকে 103.94.135.2:443 এ SYN। Router ঠিকানা বদলে করে 203.0.113.25:62001। SYN-ACK, ACK। এক RTT।",
            },
            {
              title: "TLS Handshake",
              description:
                "ClientHello তে SNI islandtours.example, ALPN h2। Caddy এর ServerHello, Certificate, CertificateVerify, Finished। এক RTT, তারপর সব তালাবন্ধ।",
            },
            {
              title: "ফোন Certificate যাচাই করে",
              description:
                "নামটা SAN তালিকায় আছে, মেয়াদ ঠিক আছে, Chain একটা বিশ্বস্ত Root পর্যন্ত পৌঁছায়। তিনটাই মিলল।",
            },
            {
              title: "HTTP/2 Request যায়",
              description:
                "Stream 1 এ GET /tours/saint-martin, সাথে Accept এর তিনটা Header আর __Host-session Cookie। পথের সবার কাছে এটা কয়েকশো এলোমেলো Byte।",
            },
            {
              title: "Caddy তালা খোলে",
              description:
                "Site বেছে নেয়, X-Forwarded-For 203.0.113.25, X-Forwarded-Proto https, X-Forwarded-Host আর একটা নতুন X-Request-Id বসায়। খোলা রাখা Connection এ 127.0.0.1:3000 এর App কে দেয়।",
            },
            {
              title: "App পর্যটককে চেনে",
              description:
                "Cookie এর Session ID দিয়ে Redis এ খোঁজে, পায় usr_42। PostgreSQL থেকে Tour আর খালি আসন আনে।",
            },
            {
              title: "App উত্তর বানায়",
              description:
                "200 OK, Content-Type text/html, Cache-Control private, no-cache, একটা ETag। Log এ X-Request-Id সহ একটা লাইন।",
            },
            {
              title: "উত্তর ফেরে",
              description:
                "Caddy HSTS যোগ করে, চাপ দিয়ে ছোট করে, তালা লাগিয়ে পাঠায়। Router 62001 দেখে 51514 এ ফেরায়। ফোনে প্রথম Byte, এটাই TTFB।",
            },
            {
              title: "পাতার বাকি সব",
              description:
                "Cache এ থাকা CSS এর জন্য Request ই যায় না। JavaScript আর ছবি একই Connection এর Stream 3 আর 5 এ, আসনের তথ্য Stream 7 এ। নতুন কোনো Handshake নেই।",
            },
            {
              title: "চুপচাপ, তারপর বিদায়",
              description:
                "Connection খোলা থাকে পরের পাতার আশায়। কারো Idle Timeout পার হলে FIN, ACK, FIN, ACK। Router তার NAT টেবিলের লাইনটা মোছে। বুকিং আর Session শুধু Server এ থেকে যায়।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, নিজের যন্ত্রে একটা ছোট
                Island Tours বানিয়ে পুরো যাত্রা অনুসরণ করবেন, তারপর প্রতিটা ধাপ ইচ্ছা
                করে ভেঙে দেখবেন। এর কোনো ভিডিও বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>MDN, How browsers work</strong>, HTML পাওয়ার পর Browser
                পাতাটা কীভাবে আঁকে, এই লেসন যেখানে থেমেছে সেখান থেকে।{" "}
                <External href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work">
                  developer.mozilla.org
                </External>
              </ListItem>
              <ListItem>
                <strong>Chrome DevTools, Network features reference</strong>, Timing
                Tab এর প্রতিটা নামের সঠিক মানে আর কলাম চালু করার উপায়।{" "}
                <External href="https://developer.chrome.com/docs/devtools/network/reference">
                  developer.chrome.com
                </External>
              </ListItem>
              <ListItem>
                <strong>curl এর man page</strong>, <code>-w</code> এর প্রতিটা
                Variable এর সংজ্ঞা। Terminal এ <code>man curl</code>, অথবা{" "}
                <External href="https://curl.se/docs/manpage.html">curl.se/docs/manpage.html</External>
              </ListItem>
              <ListItem>
                <strong>High Performance Browser Networking</strong>, Ilya Grigorik
                এর বই, অনলাইনে বিনামূল্যে পড়া যায়। TCP, TLS, HTTP/2 আর দূরত্বের খরচ
                নিয়ে সবচেয়ে পরিষ্কার লেখাগুলোর একটা।{" "}
                <External href="https://hpbn.co">hpbn.co</External>
              </ListItem>
              <ListItem>
                <strong>Caddy এর reverse_proxy নথি</strong>, কোন Header Caddy নিজে
                বসায়, কোনটা ফেলে দেয়, আর trusted_proxies কখন লাগে।{" "}
                <External href="https://caddyserver.com/docs/caddyfile/directives/reverse_proxy">
                  caddyserver.com
                </External>
              </ListItem>
              <ListItem>
                <strong>web.dev, Time to First Byte</strong>, TTFB কী, কত হলে ভালো,
                আর কমানোর উপায়।{" "}
                <External href="https://web.dev/articles/ttfb">web.dev/articles/ttfb</External>
              </ListItem>
              <ListItem>
                <strong>What happens when</strong>, একটা বিখ্যাত খোলা লেখা, যেখানে
                অনেকে মিলে google.com লিখে Enter চাপার পরের প্রতিটা ঘটনা লিখেছেন,
                Keyboard এর বোতাম থেকে শুরু করে।{" "}
                <External href="https://github.com/alex/what-happens-when">
                  github.com/alex/what-happens-when
                </External>
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
      title: <SectionTitle>৫ মিনিটে পুরো যাত্রা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রথমে এই লেসনটা, নয় লাইনে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  একটা HTTPS Request আট ধাপে যায় আর ফেরে: URL আর HSTS, DNS, TCP, TLS,
                  HTTP Request, Caddy, App, Response। ধাপগুলো ক্রমে চলে।
                </ListItem>
                <ListItem>
                  HTTPS মানে HTTP, TLS এর ভেতরে, TCP এর উপরে। তিনটাই একই Connection
                  এর উপর, ফোন থেকে Caddy পর্যন্ত।
                </ListItem>
                <ListItem>
                  পথের সবাই দেখে কে কার সাথে, কোন Domain, কত Byte আর কখন। কোন পাতা,
                  কোন Cookie আর কী তথ্য, সেটা দেখে শুধু Caddy আর তার পেছনের App।
                </ListItem>
                <ListItem>
                  Caddy তালা খোলে, X-Forwarded-For, -Proto, -Host বসায়, আর ভেতরে সাধারণ
                  HTTP তে App কে দেয়। App শুধু 127.0.0.1 এ শোনে বলেই এই Header
                  বিশ্বাসযোগ্য।
                </ListItem>
                <ListItem>
                  প্রথমবার প্রথম Byte এর আগে চারটা Round Trip: DNS, TCP, TLS, HTTP।
                  দূরত্বই আসল খরচ।
                </ListItem>
                <ListItem>
                  পরের বার পথ ছোট হয়, কারণ সবাই মনে রাখে: DNS এর TTL, খোলা Connection,
                  TLS এর Ticket, HTTP Cache, Cookie।
                </ListItem>
                <ListItem>
                  <code>curl -w</code> এর সংখ্যাগুলো জমানো সময়। প্রতিটা ধাপের সময়
                  পেতে পাশাপাশি দুইটা বিয়োগ করুন। DevTools এর Timing Tab একই জিনিস
                  দেখায়।
                </ListItem>
                <ListItem>
                  সারানোর কাজ শুরু হয় সবচেয়ে বড় অংশ থেকে, আর প্রায়ই সেটা Server এর
                  অপেক্ষা।
                </ListItem>
                <ListItem>
                  প্রতিটা ধাপের ভাঙার নিজস্ব Error আছে। Error দেখে আগে ধাপ চিনুন, তারপর
                  শুধু সেই ধাপের কমান্ড চালান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার পুরো গল্পটা একবার টানা বলি, যেভাবে আপনি অন্য কাউকে বলবেন।
              </ContentParagraph>
              <ContentParagraph>
                পর্যটক লিখলেন <code>islandtours.example/tours/saint-martin</code>।
                Browser লেখাটাকে URL হিসেবে ভাঙল, Scheme https, Port 443, আর দেখল এই
                নামের জন্য HTTPS বাধ্যতামূলক কি না (লেসন ০১, ০৭)। ঠিকানা জানা ছিল না,
                তাই DNS জিজ্ঞেস করা হলো, উত্তর এলো <code>103.94.135.2</code> (Module
                04)। ফোন আর Server TCP Handshake এ একটা রাস্তা খুলল, বাসার Router
                ঠিকানা বদলে দিল (Module 05, Module 03)। সেই রাস্তায় TLS তালা লাগাল,
                আর ফোন Certificate দেখে নিশ্চিত হলো ওপাশে সত্যিই Island Tours (লেসন
                ০৭, ০৮)।
              </ContentParagraph>
              <ContentParagraph>
                তালার ভেতর দিয়ে গেল একটা HTTP/2 Request: GET, Path, Accept এর Header,
                আর Session এর Cookie, কারণ নাম, Path, Secure আর SameSite চারটাই মিলেছিল
                (লেসন ০২, ০৩, ০৪, ০৫)। Caddy তালা খুলে Header বসিয়ে ভেতরের App কে দিল।
                App Cookie থেকে Redis এ পর্যটককে চিনল, PostgreSQL থেকে আসন আনল, 200
                আর <code>private, no-cache</code> দিয়ে উত্তর বানাল (লেসন ০৬, ০৩, ০৪)।
                উত্তর একই পথে ফিরল, Browser পাতার বাকি ফাইল একই Connection এ চাইল, যার
                অনেকগুলো Cache এ ছিল বলে চাইতেই হলো না। শেষে Connection চুপচাপ পড়ে
                থেকে একসময় FIN দিয়ে বিদায় নিল (Module 05)।
              </ContentParagraph>
              <ContentParagraph>
                এই দুইটা অনুচ্ছেদ যদি না দেখে বলতে পারেন, আর প্রতিটা বাক্যে কেউ কেন
                জিজ্ঞেস করলে উত্তর দিতে পারেন, তাহলে HTTP আর HTTPS এর মূল গল্পটা আপনার
                হয়ে গেছে। আর Error দেখে ধাপ চিনতে পারলে আপনি এখন সেই মানুষ, যাঁকে দলের
                সবাই ডাকে যখন সাইট খুলছে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ১০, WebSocket & Real-time Communication",
          content: (
            <p>
              পুরো এই যাত্রায় একটা জিনিস খেয়াল করেছেন? প্রতিটা কথা শুরু করেছে Browser।
              Browser চেয়েছে, Server দিয়েছে। Server নিজে থেকে কখনো কিছু বলেনি, বলতে
              পারেও না। কিন্তু ধরুন পর্যটক Saint Martin এর পাতা খুলে বসে আছেন, আর এই
              মুহূর্তে আরেকজন শেষ দুইটা আসন বুক করে ফেললেন। পর্যটকের পাতায় এখনো লেখা
              বারোটা খালি। তাঁকে জানানো হবে কীভাবে, যখন Server নিজে থেকে কথা বলতেই পারে
              না? পরের লেসন ঠিক এই প্রশ্নের উত্তর, আর শুরু হবে এই লেসনের শেষ সারিটা
              দিয়ে, <code>wss://islandtours.example/ws</code>।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["আট ধাপ", "URL আর HSTS, DNS, TCP, TLS, HTTP Request, Caddy, App, Response। ক্রমে চলে"],
      ["HTTPS", "HTTP, TLS এর ভেতরে, TCP এর উপরে, একই Connection এ"],
      ["TLS এর দেয়াল", "পথের সবাই দেখে IP, Port, Domain, আকার আর সময়। Path, Cookie, Body দেখে না"],
      ["TLS Termination", "Caddy তে তালা খোলা। ভেতরে App এর কাছে সাধারণ HTTP, শুধু 127.0.0.1 এর ভেতরে"],
      ["X-Forwarded-For", "Caddy এর বসানো পর্যটকের আসল IP। বিশ্বাসযোগ্য শুধু যদি App এর কাছে আর কেউ পৌঁছাতে না পারে"],
      ["X-Request-Id", "প্রতি Request এর একটা ID, Browser থেকে Log পর্যন্ত একই Request খুঁজে পাওয়ার সুতা"],
      ["RTT", "একবার যাওয়া আসার সময়। প্রথমবার প্রথম Byte এর আগে চারটা"],
      ["TTFB", "Request শুরু থেকে উত্তরের প্রথম Byte পর্যন্ত সময়"],
      ["Connection Reuse", "একই Connection এ পরের Request, নতুন DNS, TCP, TLS ছাড়া"],
      ["TLS Resumption", "আগের Session Ticket দেখিয়ে ছোট Handshake, Certificate ছাড়া"],
      ["curl -w", "প্রতিটা ধাপ শেষের জমানো সময়। ধাপের নিজের সময় পেতে বিয়োগ"],
      ["DevTools Timing", "DNS Lookup, Initial connection, SSL, Waiting for server response, Content Download"],
      ["Debug এর নিয়ম", "Error দেখে ধাপ চিনুন। আগের সব ঠিক ছিল, পরের কিছু শুরুই হয়নি"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "পর্যটক https://islandtours.example/tours/saint-martin#reviews খুললেন। #reviews অংশটা যাত্রার কোন ধাপে কার হাতে পৌঁছায়?",
        options: [
          {
            key: "A",
            text: "Caddy এর কাছে, সে ঠিক করে পাতার কোন অংশ পাঠাবে",
            isCorrect: false,
            explanation: "Caddy এটা কখনো দেখে না। Fragment তারেই যায় না।",
          },
          {
            key: "B",
            text: "App এর কাছে, :path এর অংশ হিসেবে",
            isCorrect: false,
            explanation: ":path এ থাকে শুধু /tours/saint-martin। Fragment বাদ পড়ে।",
          },
          {
            key: "C",
            text: "কারো কাছেই না। এটা Browser এর ভেতরে থাকে, পাতার কোন অংশে নামতে হবে শুধু সেটা বলে",
            isCorrect: true,
            explanation: "ঠিক। Fragment প্রথম ধাপেই আলাদা হয়ে যায় আর Browser এর বাইরে যায় না।",
          },
          {
            key: "D",
            text: "DNS Resolver এর কাছে, নামের অংশ হিসেবে",
            isCorrect: false,
            explanation: "DNS শুধু Host নামটা জিজ্ঞেস করে, islandtours.example।",
          },
        ],
      },
      {
        id: 2,
        text: "পর্যটক ক্যাফের Wi-Fi তে Island Tours এর পাতা খুলছেন। ক্যাফের Wi-Fi এর মালিক এর কোনটা দেখতে পারেন?",
        options: [
          {
            key: "A",
            text: "পর্যটক কোন Tour এর পাতা দেখছেন",
            isCorrect: false,
            explanation: "Path টা TLS এর ভেতরে, তালাবন্ধ।",
          },
          {
            key: "B",
            text: "পর্যটকের Session Cookie",
            isCorrect: false,
            explanation: "Cookie একটা Header, আর সব Header TLS এর ভেতরে।",
          },
          {
            key: "C",
            text: "ফোনটা islandtours.example এর সাথে কথা বলছে, কখন আর কত Byte",
            isCorrect: true,
            explanation: "ঠিক। IP, Port, SNI তে Domain নাম, আকার আর সময় TLS এর বাইরে থাকে।",
          },
          {
            key: "D",
            text: "কিছুই না, HTTPS সব লুকিয়ে ফেলে",
            isCorrect: false,
            explanation: "HTTPS কথাটা লুকায়, কথা বলাটা লুকায় না। কে কার সাথে, সেটা দেখা যায়।",
          },
        ],
      },
      {
        id: 3,
        text: "একই curl কমান্ডে দুইবার একই URL দিলে দ্বিতীয় Request এ time_connect আর time_appconnect দুইটাই 0 আসে। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "curl এর ভুল, সংখ্যাগুলো মাপা হয়নি",
            isCorrect: false,
            explanation: "সংখ্যা ঠিকই আছে। num_connects ও 0 দেখায়।",
          },
          {
            key: "B",
            text: "আগের Connection টা আবার ব্যবহার হয়েছে, নতুন TCP বা TLS Handshake হয়নি",
            isCorrect: true,
            explanation: "ঠিক। Connection Reuse, ঠিক Browser এর মতো।",
          },
          {
            key: "C",
            text: "Server এর Cache থেকে উত্তর এসেছে",
            isCorrect: false,
            explanation: "Cache উত্তরের উৎস বদলায়, Handshake এর সংখ্যা নয়।",
          },
          {
            key: "D",
            text: "দ্বিতীয় Request টা HTTP তে গেছে, TLS ছাড়া",
            isCorrect: false,
            explanation: "URL দুইটাই https। TLS চালু, শুধু নতুন করে Handshake লাগেনি।",
          },
        ],
      },
      {
        id: 4,
        text: "curl -w দিল: namelookup 0.030, connect 0.070, appconnect 0.115, pretransfer 0.116, starttransfer 1.905। কোথায় খুঁজবেন?",
        options: [
          {
            key: "A",
            text: "DNS এ, কারণ প্রথম সংখ্যাটাই 30 ms",
            isCorrect: false,
            explanation: "30 ms স্বাভাবিক, আর মোটের তুলনায় খুব ছোট।",
          },
          {
            key: "B",
            text: "TLS এ, কারণ appconnect 115 ms",
            isCorrect: false,
            explanation: "115 ms জমানো সময়। TLS এর নিজের অংশ মাত্র 45 ms।",
          },
          {
            key: "C",
            text: "App এর ভেতরে, কারণ Server এর অপেক্ষা প্রায় 1.79 সেকেন্ড",
            isCorrect: true,
            explanation: "ঠিক। 1.905 থেকে 0.116 বিয়োগ, প্রায় পুরো সময়টাই Server এর ভাবা। ধীর Query বা বাইরের Service খুঁজুন।",
          },
          {
            key: "D",
            text: "CDN নিতে হবে, কারণ মোট সময় দুই সেকেন্ডের কাছে",
            isCorrect: false,
            explanation: "CDN দূরত্ব কমায়। এখানে Network এর অংশ ছোট, CDN প্রায় কিছুই বদলাবে না।",
          },
        ],
      },
      {
        id: 5,
        text: "islandtours.example ঠিকঠাক খোলে, কিন্তু www.islandtours.example খুললে NET::ERR_CERT_COMMON_NAME_INVALID। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "www এর DNS Record নেই",
            isCorrect: false,
            explanation: "DNS না থাকলে Error হতো NXDOMAIN, Certificate পর্যন্ত যাত্রা পৌঁছাতই না।",
          },
          {
            key: "B",
            text: "Server এর Certificate এ www নামটা নেই, তাই নাম মেলেনি",
            isCorrect: true,
            explanation: "ঠিক। DNS আর TCP ঠিক ছিল, TLS এ নাম মেলেনি। Caddy তে www এর জন্য আলাদা Site Block দিলে Caddy সেই নামের Certificate ও নিয়ে আসে।",
          },
          {
            key: "C",
            text: "Certificate এর মেয়াদ শেষ",
            isCorrect: false,
            explanation: "মেয়াদ শেষ হলে মূল নামেও একই Error হতো, আর তার নাম DATE_INVALID।",
          },
          {
            key: "D",
            text: "App বন্ধ",
            isCorrect: false,
            explanation: "App বন্ধ থাকলে TLS ঠিক হতো, তারপর 502 আসত।",
          },
        ],
      },
      {
        id: 6,
        text: "পর্যটক দেখছেন 502 Bad Gateway। এটা থেকে যাত্রার কোন অংশ ঠিক ছিল বলে নিশ্চিত?",
        options: [
          {
            key: "A",
            text: "কিছুই না, 502 যেকোনো জায়গার সমস্যা",
            isCorrect: false,
            explanation: "502 একটা HTTP Status, তাই কেউ একটা HTTP উত্তর পাঠিয়েছে।",
          },
          {
            key: "B",
            text: "DNS, TCP, TLS আর Caddy পর্যন্ত Request পৌঁছানো ঠিক ছিল, সমস্যা Caddy আর App এর মাঝে",
            isCorrect: true,
            explanation: "ঠিক। 502 পাঠিয়েছে Caddy, যার মানে সে পেছনের App থেকে ঠিকঠাক উত্তর পায়নি।",
          },
          {
            key: "C",
            text: "শুধু DNS ঠিক ছিল",
            isCorrect: false,
            explanation: "TCP বা TLS ভাঙলে কোনো HTTP Status ই আসত না।",
          },
          {
            key: "D",
            text: "সব ঠিক ছিল, পর্যটকের Browser এর সমস্যা",
            isCorrect: false,
            explanation: "502 আসে Server এর দিক থেকে, Browser নিজে এটা বানায় না।",
          },
        ],
      },
      {
        id: 7,
        text: "App এর Log এ প্রতিটা Request এর Socket Address 127.0.0.1। তাহলে App পর্যটকের আসল IP জানে কীভাবে, আর সেটা বিশ্বাস করা যায় কেন?",
        options: [
          {
            key: "A",
            text: "TCP Header থেকে, তাই সবসময় বিশ্বাসযোগ্য",
            isCorrect: false,
            explanation: "App এর TCP Connection এর ওপাশে Caddy, তাই TCP থেকে পাওয়া যায় শুধু 127.0.0.1।",
          },
          {
            key: "B",
            text: "Cookie থেকে",
            isCorrect: false,
            explanation: "Cookie এ IP থাকে না।",
          },
          {
            key: "C",
            text: "Caddy এর বসানো X-Forwarded-For থেকে। বিশ্বাসযোগ্য কারণ App শুধু 127.0.0.1 এ শোনে, আর Caddy বাইরের বানানো মান ফেলে দেয়",
            isCorrect: true,
            explanation: "ঠিক। Header এর বিশ্বাসযোগ্যতা নির্ভর করে কে সেটা বসাতে পারে তার উপর।",
          },
          {
            key: "D",
            text: "X-Forwarded-For থেকে, আর এটা যেকোনো অবস্থায় বিশ্বাস করা যায়",
            isCorrect: false,
            explanation: "App বাইরে থেকে সরাসরি পৌঁছানো গেলে যে কেউ মিথ্যা মান পাঠাতে পারত।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours আসনের API টা islandtours.example/api থেকে সরিয়ে api.islandtours.example এ নিতে চায়। পাতা খোলার সময় নতুন কী খরচ যোগ হবে?",
        options: [
          {
            key: "A",
            text: "কিছুই না, একই Domain এর Subdomain",
            isCorrect: false,
            explanation: "Subdomain মানে আলাদা Host আর আলাদা Origin।",
          },
          {
            key: "B",
            text: "শুধু একটা নতুন DNS প্রশ্ন",
            isCorrect: false,
            explanation: "DNS এর পরেও আলাদা Connection লাগবে, আর CORS এর প্রশ্ন আসবে।",
          },
          {
            key: "C",
            text: "নতুন DNS, নতুন TCP আর TLS Handshake, আর অন্য Origin বলে CORS, হয়তো একটা Preflight ও",
            isCorrect: true,
            explanation: "ঠিক। আলাদা Host আর আলাদা IP মানে নতুন Connection, আর আলাদা Origin মানে লেসন ০৪ এর CORS এর নিয়ম।",
          },
          {
            key: "D",
            text: "শুধু CORS, Connection একই থাকবে",
            isCorrect: false,
            explanation: "ঠিকানাই আলাদা, 103.94.135.3, তাই একই Connection চলবে না।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "নিজের যন্ত্রে পুরো যাত্রা, মাপুন, অনুসরণ করুন, ভাঙুন",
    subtitle: "ছয়টা পরীক্ষা, কোনোটাতেই sudo লাগে না, কিছু Install করতে হয় না",
    stepName: "LAB",
    steps: [
      {
        title: "প্রতিটা ধাপের সময় মাপা",
        description:
          "timing.txt বানিয়ে তিনটা আলাদা সাইটে তিনবার করে curl -w চালান। প্রতিবার পাঁচটা ধাপের নিজের সময় বিয়োগ করে বের করুন আর সবচেয়ে বড় অংশটা চিহ্নিত করুন।",
      },
      {
        title: "পুরো যাত্রা কথায় পড়া",
        description:
          "curl -v চালিয়ে ফলাফলের প্রতিটা লাইনের পাশে লিখুন সেটা কোন ধাপের: DNS, TCP, TLS, Certificate যাচাই, Request, Response। তারপর একই সাইট Browser এ খুলে DevTools এর Timing এর সাথে মেলান।",
      },
      {
        title: "Connection Reuse নিজের চোখে",
        description:
          "এক curl কমান্ডে একই URL দুইবার দিন, আর দুইটা ফলাফলের connect, appconnect আর num_connects মিলিয়ে দেখুন।",
      },
      {
        title: "ছোট্ট Island Tours, App",
        description:
          "একটা App বানান যে শুধু 127.0.0.1 এ শোনে, Session Cookie দেয় আর চেনে, আর প্রতিটা Request এর X-Forwarded Header Log এ লেখে।",
      },
      {
        title: "সামনে দারোয়ান, TLS শেষ করা Proxy",
        description:
          "Caddy এর কাজের একটা ছোট নকল বানান: HTTPS আর HTTP/2 এ শোনে, TLS শেষ করে, Header বসিয়ে ভেতরের App কে দেয়, App না পেলে 502 আর দেরি হলে 504 ফেরায়।",
      },
      {
        title: "চালান, অনুসরণ করুন, তারপর ভাঙুন",
        description:
          "নিজের Certificate বানিয়ে দুইটা Server চালান, একটা Request দুই Log এ একই X-Request-Id দিয়ে অনুসরণ করুন, Login এর Cookie দিয়ে Session দেখুন, তারপর প্রতিটা ধাপ ইচ্ছা করে ভেঙে Error গুলো মিলিয়ে নিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-time-stages.sh",
        language: "bash",
        code: `# ১. Format ফাইল একবার বানান
cat > timing.txt <<'EOF'
   dns lookup  %{time_namelookup}s\\n
  tcp connect  %{time_connect}s\\n
tls handshake  %{time_appconnect}s\\n
  pretransfer  %{time_pretransfer}s\\n
   first byte  %{time_starttransfer}s\\n
        total  %{time_total}s\\n
  new conns    %{num_connects}\\n
     protocol  HTTP/%{http_version}, status %{http_code}, from %{remote_ip}:%{remote_port}\\n
EOF

# ২. একটা সাইট তিনবার। নিজের পছন্দের আরও দুইটা সাইট দিয়ে একই কাজ করুন।
for i in 1 2 3; do curl -s -o /dev/null -w @timing.txt https://example.com/; echo "---"; done

# এই লেখার যন্ত্রে তিনবারের first byte এলো 0.090, 0.036 আর 0.039 সেকেন্ডে।
# প্রথমটা বাকি দুইটার দ্বিগুণের বেশি। তাই কখনো একবার মেপে সিদ্ধান্ত নেবেন না।

# ৩. প্রতিটা ধাপের নিজের সময়:
#    DNS      = namelookup
#    TCP      = connect − namelookup
#    TLS      = appconnect − connect
#    অপেক্ষা   = starttransfer − pretransfer
#    নামানো    = total − starttransfer`,
      },
      {
        filename: "2-read-the-trace.sh",
        language: "bash",
        code: `# পুরো যাত্রা কথায়। শুধু ধাপ চেনার লাইনগুলো রাখতে grep
curl -v -o /dev/null https://example.com/ 2>&1 \\
  | grep -E 'resolved|Trying|Connected|ALPN|TLS handshake|SSL connection|subject:|expire date|issuer:|verify ok|\\[:method|\\[:path|^< HTTP'

# এই লেখার যন্ত্রে আসল ফলাফলের শুরুটা:
# * Host example.com:443 was resolved.
# *   Trying 104.20.23.154:443...
# * Connected to example.com (104.20.23.154) port 443
# * ALPN: curl offers h2,http/1.1
# * (304) (OUT), TLS handshake, Client hello (1):
# ...
# * ALPN: server accepted h2
# < HTTP/2 200

# এবার একই সাইট Browser এ খুলুন: DevTools, Network, পাতা আবার Load,
# প্রথম Request এ ক্লিক, Timing Tab। DNS Lookup, Initial connection,
# SSL আর Waiting for server response এর পাশে curl এর বিয়োগ করা সংখ্যা লিখুন।`,
      },
      {
        filename: "3-reuse.sh",
        language: "bash",
        code: `# একই কমান্ডে একই URL দুইবার। প্রতিটা URL এর জন্য একটা করে -o লাগে।
curl -s -o /dev/null -o /dev/null -w @timing.txt https://example.com/ https://example.com/

# এই লেখার যন্ত্রে আসল ফলাফল, দুই অংশ পাশাপাশি:
#                 প্রথম Request     দ্বিতীয় Request
#   tcp connect   0.006339s         0.000000s
# tls handshake   0.023830s         0.000000s
#    first byte   0.041177s         0.013713s
#   new conns     1                 0
#
# দুইটা আলাদা curl কমান্ড চালালে কিন্তু দুইবারই নতুন Connection লাগবে,
# কারণ প্রথম curl শেষ হওয়ার সাথে তার Connection ও বন্ধ হয়ে যায়।
# পরীক্ষা করে দেখুন।`,
      },
      {
        filename: "4-island-app.mjs",
        language: "javascript",
        code: `// চালান:  APP_PORT=47691 node 4-island-app.mjs
// Island Tours এর App এর ছোট্ট নকল। আসলটার মতোই এটা শুধু 127.0.0.1 এ শোনে,
// TLS জানে না, আর বাইরের দুনিয়ার খবর পায় সামনের Proxy এর বসানো Header থেকে।
import http from "node:http";
import { randomBytes } from "node:crypto";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(\`\${name} is not set\`);
  return value;
}

const port = Number(required("APP_PORT"));
const SESSION_TTL_SECONDS = 1209600; // ১৪ দিন, Island Tours এর মতো
const SLOW_ROUTE_DELAY_MS = 5000; // /slow ইচ্ছা করে এতক্ষণ চুপ থাকে

// আসল Island Tours এ Session থাকে Redis এ। এখানে একটা Map, যাতে কিছু Install করতে না হয়।
const sessions = new Map();
const tours = { "saint-martin": { title: "Saint Martin Island Escape", seatsLeft: 12 } };

function readCookie(header, name) {
  for (const part of (header ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

const app = http.createServer(async (req, res) => {
  const requestId = req.headers["x-request-id"] ?? "none";
  console.log(
    \`app   \${req.method} \${req.url}  socket from \${req.socket.remoteAddress}\` +
      \`  x-forwarded-for=\${req.headers["x-forwarded-for"]}\` +
      \`  proto=\${req.headers["x-forwarded-proto"]}  id=\${requestId.slice(0, 8)}\`,
  );
  res.setHeader("x-request-id", requestId);

  if (req.method === "POST" && req.url === "/api/auth/login") {
    const sessionId = randomBytes(32).toString("base64url");
    sessions.set(sessionId, { userId: "usr_42", expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 });
    res.setHeader(
      "set-cookie",
      \`__Host-session=\${sessionId}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=\${SESSION_TTL_SECONDS}\`,
    );
    res.writeHead(204).end();
    return;
  }

  const tourMatch = req.url.match(/^\\/tours\\/([a-z-]+)$/);
  if (req.method === "GET" && tourMatch && tours[tourMatch[1]]) {
    const session = sessions.get(readCookie(req.headers.cookie, "__Host-session"));
    const who = session && session.expiresAt > Date.now() ? session.userId : "guest";
    const tour = tours[tourMatch[1]];
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "private, no-cache" });
    res.end(\`<h1>\${tour.title}</h1><p>seats left: \${tour.seatsLeft}</p><p>signed in as: \${who}</p>\\n\`);
    return;
  }

  if (req.url === "/slow") {
    await new Promise((resolve) => setTimeout(resolve, SLOW_ROUTE_DELAY_MS));
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }).end("finally\\n");
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found\\n");
});

app.listen(port, "127.0.0.1", () => console.log(\`app   listening on http://127.0.0.1:\${port}, plain HTTP, no TLS\`));`,
      },
      {
        filename: "5-edge-proxy.mjs",
        language: "javascript",
        code: `// চালান:  EDGE_PORT=47690 APP_URL=http://127.0.0.1:47691 UPSTREAM_TIMEOUT_MS=2000 \\
//         TLS_CERT_FILE=edge-cert.pem TLS_KEY_FILE=edge-key.pem node 5-edge-proxy.mjs
// Caddy এর কাজটার ছোট্ট নকল: TLS এখানে শেষ হয়, ভেতরে যায় সাধারণ HTTP,
// সাথে X-Forwarded-* আর X-Request-Id। আসল Production এ এই কাজ Caddy করে।
import http from "node:http";
import http2 from "node:http2";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(\`\${name} is not set\`);
  return value;
}

const port = Number(required("EDGE_PORT"));
const upstream = new URL(required("APP_URL"));
const upstreamTimeoutMs = Number(required("UPSTREAM_TIMEOUT_MS"));
const tls = {
  cert: readFileSync(required("TLS_CERT_FILE")),
  key: readFileSync(required("TLS_KEY_FILE")),
};

// ভেতরের App এর সাথে Connection গুলো খোলা রাখা হয়, প্রতি Request এ নতুন Handshake নয়।
const agent = new http.Agent({ keepAlive: true });
// এই Header গুলো শুধু এক Hop এর, পরের Hop এ পাঠানো চলে না।
const HOP_BY_HOP = new Set(["connection", "keep-alive", "proxy-connection", "transfer-encoding", "upgrade", "te", "trailer"]);

const edge = http2.createSecureServer({ ...tls, allowHTTP1: true }, (req, res) => {
  const requestId = randomUUID();
  const clientIp = req.socket.remoteAddress;
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (!name.startsWith(":") && !HOP_BY_HOP.has(name)) headers[name] = value;
  }
  headers.host = req.headers[":authority"] ?? req.headers.host;
  // বাইরে থেকে আসা মান যা-ই থাকুক, নিজেরটা বসানো হয়, ঠিক Caddy এর মতো
  headers["x-forwarded-for"] = clientIp;
  headers["x-forwarded-proto"] = "https";
  headers["x-forwarded-host"] = headers.host;
  headers["x-request-id"] = requestId;

  console.log(\`edge  \${req.method} \${req.url}  HTTP/\${req.httpVersion} over TLS  from \${clientIp}  id=\${requestId.slice(0, 8)}\`);

  const toApp = http.request(
    { host: upstream.hostname, port: upstream.port, method: req.method, path: req.url, headers, agent, timeout: upstreamTimeoutMs },
    (appRes) => {
      const out = {};
      for (const [name, value] of Object.entries(appRes.headers)) {
        if (!HOP_BY_HOP.has(name)) out[name] = value;
      }
      res.writeHead(appRes.statusCode, out);
      appRes.pipe(res);
    },
  );
  toApp.on("timeout", () => toApp.destroy(new Error("upstream timeout")));
  toApp.on("error", (err) => {
    const status = err.message === "upstream timeout" ? 504 : 502;
    console.log(\`edge  answered \${status} because \${err.code ?? err.message}\`);
    if (res.headersSent) return res.destroy();
    res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    res.end(\`\${status} from the edge: \${err.code ?? err.message}\\n\`);
  });
  req.pipe(toApp);
});

edge.listen(port, () => console.log(\`edge  listening on https://localhost:\${port}, forwarding to \${upstream.origin}\`));`,
      },
      {
        filename: "6-run-and-break.sh",
        language: "bash",
        code: `# ক. localhost এর জন্য নিজের Certificate, সাত দিনের (কীভাবে কাজ করে, লেসন ০৮)
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes \\
  -keyout edge-key.pem -out edge-cert.pem -days 7 \\
  -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
chmod 600 edge-key.pem

# খ. দুইটা আলাদা Terminal এ দুইটা Server
APP_PORT=47691 node 4-island-app.mjs
EDGE_PORT=47690 APP_URL=http://127.0.0.1:47691 UPSTREAM_TIMEOUT_MS=2000 \\
  TLS_CERT_FILE=edge-cert.pem TLS_KEY_FILE=edge-key.pem node 5-edge-proxy.mjs

# গ. তৃতীয় Terminal থেকে যাত্রা। --cacert দিয়ে curl কে এই Certificate টা বিশ্বাস করতে বলা হয়।
curl --cacert edge-cert.pem -i https://localhost:47690/tours/saint-martin
# HTTP/2 200
# x-request-id: 793b772c-05c8-469e-8ab2-475f3fd450e9
# cache-control: private, no-cache
# <h1>Saint Martin Island Escape</h1><p>seats left: 12</p><p>signed in as: guest</p>
#
# দুই Server এর Log এ একই id খুঁজুন:
# edge  GET /tours/saint-martin  HTTP/2.0 over TLS  from ::1  id=793b772c
# app   GET /tours/saint-martin  socket from 127.0.0.1  x-forwarded-for=::1  proto=https  id=793b772c

# ঘ. Login, তারপর Cookie সহ আবার
curl --cacert edge-cert.pem -s -c jar.txt -X POST -i https://localhost:47690/api/auth/login
# HTTP/2 204
# set-cookie: __Host-session=<৪৩ অক্ষরের এলোমেলো মান>; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600
curl --cacert edge-cert.pem -s -b jar.txt https://localhost:47690/tours/saint-martin
# ...<p>signed in as: usr_42</p>

# ঙ. এবার প্রতিটা ধাপ ইচ্ছা করে ভাঙুন। প্রতিটার আসল বার্তা নিচে।
curl -sS https://islandtours.invalid/                       # ধাপ ২, DNS
# curl: (6) Could not resolve host: islandtours.invalid
curl -sS https://localhost:47699/                           # ধাপ ৩, কেউ শুনছে না
# curl: (7) Failed to connect to localhost port 47699 after 0 ms: Couldn't connect to server
curl -sS --connect-timeout 3 https://192.0.2.1/             # ধাপ ৩, উত্তরই আসে না
# curl: (28) Failed to connect to 192.0.2.1 port 443 after 3006 ms: Timeout was reached
curl -sS https://localhost:47690/tours/saint-martin         # ধাপ ৪, অচেনা Issuer
# curl: (60) SSL certificate problem: self signed certificate
curl -sS --cacert edge-cert.pem https://127.0.0.1:47690/    # ধাপ ৪, নাম মেলে না
# curl: (60) SSL: no alternative certificate subject name matches target ipv4 address '127.0.0.1'
curl -sS --cacert edge-cert.pem -i https://localhost:47690/slow     # ধাপ ৭, App ধীর
# HTTP/2 504  ...  504 from the edge: upstream timeout
# এবার App এর Terminal এ Ctrl+C দিয়ে App থামান, তারপর:
curl -sS --cacert edge-cert.pem -i https://localhost:47690/tours/saint-martin   # ধাপ ৭, App নেই
# HTTP/2 502  ...  502 from the edge: ECONNREFUSED`,
      },
    ],
    tip: "পরীক্ষা ৬ এর ঙ অংশটা একটা খাতায় তুলে রাখুন, কারণ এটা আসলে পুরো লেসনের সারাংশ। লক্ষ্য করুন প্রতিটা ভাঙা ধাপ কীভাবে নিজের পরিচয় দেয়। DNS ভাঙলে curl এর Error নম্বর 6, TCP ভাঙলে 7 বা 28, TLS বা Certificate ভাঙলে 35 বা 60, আর এদের কোনোটাতেই কোনো HTTP Status নেই, কারণ HTTP পর্যন্ত যাত্রা পৌঁছায়ইনি। অন্যদিকে 502 আর 504 হলো HTTP Status, মানে এতদূর সব ঠিক ছিল, আর কেউ একজন আপনাকে জানাচ্ছে তার পেছনের জন সাড়া দেয়নি বা দেরি করেছে। Production এ কেউ যখন বলবে সাইট খুলছে না, প্রথম প্রশ্নটা হবে Error টা হুবহু কী। সেই এক লাইন থেকেই আপনি বলে দিতে পারবেন যাত্রার কোন ধাপ পর্যন্ত সব ঠিক ছিল।",
  },
  assignment: {
    title: "Mini Project: my-tours এর পুরো যাত্রার মানচিত্র আর মাপজোক",
    time: "৯০ মিনিট",
    difficulty: "Advanced",
    tasks: [
      <span key="1">
        <strong>তিন সাইট, পাঁচ ধাপ:</strong> example.com, আপনার নিজের my-tours (বা
        নিজের যেকোনো Deploy করা সাইট) আর দূরের দেশের একটা সাইট, প্রতিটায় পাঁচবার{" "}
        <code>curl -w</code> চালান। প্রতিটা সাইটের মাঝের মাপটা নিয়ে পাঁচটা ধাপের
        নিজের সময় একটা টেবিলে লিখুন। প্রতিটার সবচেয়ে বড় অংশ চিহ্নিত করুন আর এক
        লাইনে লিখুন কেন সেটাই বড়।
      </span>,
      <span key="2">
        <strong>নিজের যাত্রার মানচিত্র আঁকুন:</strong> my-tours এর একটা পাতার জন্য
        এই লেসনের প্রথম ছবির মতো একটা ছবি আঁকুন। আপনার Domain, আপনার DNS কোথায়, TLS
        কোথায় শেষ হয় (Vercel, Caddy, নাকি Cloudflare), App কোথায় শোনে, Session কোথায়
        থাকে। তারপর পথের প্রতিটা অংশের পাশে লিখুন সেখানে কে কী পড়তে পারে।
      </span>,
      <span key="3">
        <strong>DevTools এর হিসাব:</strong> নিজের সাইটের একটা পাতা DevTools খোলা রেখে
        Load করুন, Protocol আর Connection ID কলাম চালু করে। গুনে লিখুন মোট কয়টা
        Request, কয়টা Cache থেকে এসেছে, কয়টা আলাদা Connection খোলা হয়েছে, আর
        কোনগুলো অন্য Host এ গেছে। প্রতিটা আলাদা Host এর জন্য লিখুন সেটা কি সত্যিই
        দরকার ছিল।
      </span>,
      <span key="4">
        <strong>ভাঙা আর চেনার ড্রিল:</strong> Lab এর দুইটা Server চালু করে নিজে থেকে
        আরও দুইটা নতুন ভাঙন বানান যা Lab এ নেই, যেমন ভুল APP_URL, বা Certificate এর
        মেয়াদ শেষ হয়ে যাওয়া (<code>-days</code> বদলে)। আটটা ভাঙনের প্রতিটার জন্য
        লিখুন: Error এর হুবহু লেখা, কোন ধাপ, আর কোন কমান্ড দিয়ে সেটা প্রমাণ করলেন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১৫ লাইন):</strong> দলের একজন নতুন সদস্য জিজ্ঞেস
        করেছেন, একজন পর্যটক বলছেন সাইট ধীর, আমি কোথা থেকে শুরু করব? তাঁকে একটা
        উত্তর লিখুন যেখানে আট ধাপের যাত্রাটা এক অনুচ্ছেদে বলা আছে, কোন ধাপের সময় কোন
        যন্ত্র দিয়ে মাপবেন, কোন সংখ্যা দেখে কোন ধাপকে সন্দেহ করবেন, আর কেন সবচেয়ে বড়
        অংশ থেকে শুরু করতে হয়।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন সাইটের পাঁচ ধাপের টেবিল, সবচেয়ে বড় অংশ চিহ্নিত আর ব্যাখ্যা সহ</span>,
      <span key="2">my-tours এর যাত্রার ছবি, প্রতিটা অংশে কে কী পড়তে পারে লেখা</span>,
      <span key="3">একটা পাতার DevTools হিসাব: Request, Cache, Connection আর Host এর সংখ্যা</span>,
      <span key="4">আটটা ভাঙনের তালিকা: Error, ধাপ আর প্রমাণের কমান্ড</span>,
      <span key="5">নতুন সদস্যের জন্য ১৫ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
