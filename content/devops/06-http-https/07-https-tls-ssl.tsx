/**
 * What: Module 06 Lesson 07, HTTPS, TLS and SSL. It shows what plain HTTP exposes on the path, the
 * three guarantees TLS gives, how two sides agree on a key in public, the TLS 1.3 handshake message by
 * message, what HTTPS hides and what it does not, HSTS, where TLS terminates, and how to read the
 * errors.
 *
 * Why: Every login, cookie and booking in this module rides inside TLS, so the reader needs to know
 * exactly what the padlock promises before the next lesson opens the certificate that backs it. Every
 * command output here was captured on a real run against example.com or a local lab server.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  HandshakeStepLab,
  KeyExchangeLab,
  RoundTripLab,
  WireViewLab,
} from "../../../components/course/topics/http/tls-animations";
import {
  CipherSuiteDiagram,
  HstsFlowDiagram,
  LockKindsSplit,
  PlainPathDiagram,
  TerminationDiagram,
  ThreeGuaranteesDiagram,
  Tls13HandshakeDiagram,
  TlsLayerSplit,
  TlsTimelineDiagram,
  VisibleHiddenSplit,
} from "../../../components/course/topics/http/tls-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const httpsTlsSslContent: TopicData = {
  id: "https-tls-ssl",
  introduction: {
    badge: "MODULE 06 · LESSON 07",
    title: <SectionTitle>তালাটা আসলে কী পাহারা দেয়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          কক্সবাজারের একটা ক্যাফে। একজন পর্যটক কফি নিয়ে বসলেন, ফোনে ক্যাফের
          ফ্রি Wi-Fi ধরলেন, তারপর Island Tours খুলে Login করলেন, সেন্ট মার্টিনের
          নৌকায় দুইটা আসন বুক করবেন। Wi-Fi টা কে চালান, তিনি জানেন না। Router টা
          কাউন্টারের পেছনে, তার মালিক একজন অচেনা মানুষ। অথচ পর্যটকের Password, তাঁর
          Session Cookie, তাঁর বুকিং, সবকিছু ঠিক ওই Router এর ভেতর দিয়ে যাচ্ছে।
        </ContentParagraph>
        <ContentParagraph>
          আগের লেসনগুলোতে আপনি দেখেছেন HTTP আসলে কী: TCP এর রাস্তা দিয়ে পাঠানো সাধারণ
          লেখা, যেটা যে কেউ পড়তে পারে। আজকের প্রশ্নটা সোজা। এই লেখা পথের মানুষগুলোর
          হাত থেকে কীভাবে বাঁচানো হয়? Address Bar এর ছোট্ট তালাটা ঠিক কোন কোন জিনিসের
          প্রতিশ্রুতি দেয়, আর কোনগুলোর দেয় না?
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Plain HTTP পথে কী কী খুলে রাখে, TLS কোন তিনটা
          প্রতিশ্রুতি দেয়, SSL আর TLS নামের গল্প, দুই রকমের তালা, সবার সামনে বসে কীভাবে
          একটা গোপন চাবি বানানো যায়, TLS 1.3 Handshake এর প্রতিটা বার্তা, কত Round Trip
          লাগে, Cipher Suite এর নাম কীভাবে পড়তে হয়, HTTPS কী লুকায় আর কী লুকায় না,
          HSTS কেন দরকার, TLS কোথায় শেষ হয়, আর তালা ভাঙলে Browser এর Error গুলোর
          মানে কী। সবকিছু নিজের যন্ত্রে চালিয়ে দেখবেন। শুধু Certificate এর ভেতরের গল্পটা
          রেখে দেব পরের লেসনের জন্য।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "পোস্টকার্ডে লেখা চিঠি ডাকপিয়ন থেকে শুরু করে পথের সবাই পড়তে পারেন। খামে ভরে সিল করলে তাঁরা দেখেন শুধু উপরের ঠিকানাটা। HTTPS সেই খাম, আর সিলটা এমন যে কেউ খুলে আবার আটকে দিলেও প্রাপক সাথে সাথে টের পান।",
      author: "HTTPS",
      role: "Lesson 07",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "plain-http-postcard",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Plain HTTP একটা খোলা পোস্টকার্ড</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTP Basics লেসনে আপনি নিজের হাতে একটা Request লিখেছিলেন। মনে আছে
                তার চেহারা? প্রথম লাইনে Method আর Path, তারপর Header গুলো, একটা ফাঁকা
                লাইন, তারপর Body। পুরোটা সাধারণ লেখা, যেটা যে কেউ Notepad এ খুলে পড়তে
                পারে। HTTP কে এভাবে বানানো হয়েছিল ইচ্ছা করেই, যাতে মানুষ পড়তে পারে আর
                ভুল খুঁজতে সহজ হয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার Module 05 এর Packet, Segment, Frame লেসনটা মনে করুন। Browser যে লেখা
                দেয়, TCP সেটাকে Segment এর ভেতরে ভরে, IP সেটাকে Packet এ ভরে, Wi-Fi
                সেটাকে Frame এ ভরে। মোড়কের ভেতর মোড়ক। কিন্তু এই মোড়কগুলো কোনোটাই তালা
                নয়। পথের প্রতিটা Router শুধু উপরের মোড়কটা দেখে আর পরের জনকে দেয়, সেটা
                ঠিক। কিন্তু চাইলে কেউ মোড়ক খুলে ভেতরের লেখা পড়তেই পারে, কিছুই তাকে আটকায়
                না। Router এর কাজ নয় বলে সে পড়ে না, পারে না বলে নয়।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে পর্যটকের Login Request টা ক্যাফে থেকে Island Tours পর্যন্ত যাওয়ার
                পথে কার কার হাত ঘুরে যায়? Module 02 তে Hop by Hop যাত্রাটা দেখেছিলেন, সেই
                তালিকাটাই নিচের ছবিতে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PlainPathDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির কাগজটা বানানো নয়। এই লেসনের Lab এ একটা ছোট Program আছে, যেটা ফোন
                আর Server এর মাঝে দাঁড়িয়ে থাকে, ঠিক ক্যাফের Router এর মতো, আর যা যা পার
                হয় তা ছাপিয়ে দেয়। Plain HTTP তে একটা Login পাঠালে সে ঠিক এটুকু ছাপাল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "spy-saw-this.txt",
          code: `[spy] client -> server, যা পড়া গেল:
POST /api/auth/login HTTP/1.1
Host: localhost:47671
User-Agent: curl/8.7.1
Accept: */*
content-type: application/json
Content-Length: 62

{"email":"tourist@mail.example","password":"648e542dc19e515e"}
[spy] server -> client, ঠিকানা বদলে দিলাম`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Password টা হুবহু। আর শেষ লাইনটা আরও ভয়ের। মাঝের Program টা শুধু পড়েনি,
                Server এর উত্তরের ভেতরে টাকা পাঠানোর ঠিকানাটাও বদলে দিয়েছে, আর ফোন সেই
                বদলানো উত্তরটাকেই আসল ভেবে নিয়েছে। কারণ Plain HTTP তে ফোনের হাতে এমন কোনো
                উপায় নেই যা দিয়ে সে বুঝবে, পথে কেউ একটা অক্ষরও বদলেছে।
              </ContentParagraph>
              <ContentParagraph>
                এটাই সমস্যার মূল। HTTP কোনো কিছু লুকায় না, কোনো বদল ধরে না, আর ওপাশে কে
                বসে আছে তাও যাচাই করে না। TCP শুধু নিশ্চিত করে Byte গুলো ঠিক ক্রমে পৌঁছাবে,
                Module 05 এ যেমন দেখেছেন। কে সেই Byte পড়ল বা বদলাল, তা নিয়ে TCP এর কোনো
                মাথাব্যথা নেই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "এটা পুরনো দিনের গল্প নয়",
          content: (
            <p>
              আজও অনেক কিছু Plain HTTP তে চলে। বাসার Router এর Admin পাতা প্রায়ই{" "}
              <code>http://192.168.1.1</code>, অনেক Printer আর Camera এর পাতাও তাই। এমনকি
              example.com ও এখনো Port 80 এ সাধারণ HTTP তে উত্তর দেয়:{" "}
              <code>curl -sI http://example.com</code> চালালে প্রথম লাইনে আসে{" "}
              <code>HTTP/1.1 200 OK</code>, কোথাও HTTPS এ পাঠিয়ে দেওয়া হয় না। নিজের
              Server এ এই ভুল যেন না থাকে, সেটা এই লেসনের HSTS সেকশনে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "three-dangers",
      subHeader: { index: "002", title: "Three Dangers" },
      title: <SectionTitle>পথের তিনটা বিপদ: পড়া, বদলানো, সাজা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পথের মাঝখানে বসে থাকা কেউ আপনার সাথে তিন রকমের ক্ষতি করতে পারে। এই তিনটা
                আলাদা করে চিনে রাখা দরকার, কারণ TLS এর প্রতিটা অংশ ঠিক এই তিনটার একটা না
                একটা ঠেকানোর জন্য বানানো। নিরাপত্তার ভাষায় মাঝখানে বসে থাকা এই লোকটার একটা
                নাম আছে, Man in the Middle, ছোট করে MITM।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পড়ে ফেলা (Eavesdropping):</strong> ক্যাফের মালিক Router এর ভেতর
                  দিয়ে যাওয়া সব Request এর একটা নকল রেখে দিলেন। পর্যটকের Password, তাঁর
                  ফোন নম্বর, কোন তারিখে কোথায় যাচ্ছেন, সব তাঁর খাতায়। সবচেয়ে বড় ক্ষতি
                  Cookie পড়ে ফেলা। Session Cookie টা হাতে পেলে Password ছাড়াই তিনি পর্যটক
                  সেজে Island Tours এ ঢুকতে পারবেন। Cookie আর Session এর পুরো গল্প আগের দুই
                  লেসনে দেখেছেন, এখানে শুধু মনে রাখুন যে Cookie পড়া যায় মানে Account
                  দখল করা যায়।
                </ListItem>
                <ListItem>
                  <strong>বদলে দেওয়া (Tampering):</strong> মাঝের লোকটা পড়েই থামলেন না,
                  লেখাটা বদলে দিলেন। একসময় কিছু ISP সত্যিই Plain HTTP পাতার ভেতরে নিজেদের
                  বিজ্ঞাপন ঢুকিয়ে দিত। আরও খারাপ ক্ষেত্রে কেউ পাতার ভেতরে একটা Script ঢুকিয়ে
                  দেয়, যেটা পর্যটকের Browser এ চলে, অথবা Lab এর মতো টাকার ঠিকানাটাই বদলে
                  দেয়। এখানে ক্ষতিটা শুধু তথ্য ফাঁস নয়, পর্যটক ভুল কাজ করে ফেলেন।
                </ListItem>
                <ListItem>
                  <strong>অন্য কেউ সাজা (Impersonation):</strong> সবচেয়ে চালাক আক্রমণ।
                  ক্যাফের এক কোণে বসা কেউ নিজের ল্যাপটপে একই নামের একটা Wi-Fi খুললেন। অথবা
                  Module 04 এ যেমন দেখেছেন, কেউ DNS এর উত্তরটা বদলে দিলেন, যাতে
                  islandtours.example এর জন্য ফোন একটা ভুল IP পায়। এখন ফোন যার সাথে কথা
                  বলছে সে Island Tours নয়, অথচ পাতাটা দেখতে হুবহু এক। পর্যটক নিজের হাতে
                  Password টা তাঁকে দিয়ে দেবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তিনটার মধ্যে একটা সূক্ষ্ম তফাত আছে। প্রথমটায় আক্রমণকারী চুপচাপ শোনে,
                ধরা পড়ার ভয় কম। দ্বিতীয় আর তৃতীয়টায় সে কিছু একটা করে, আর পর্যটক ক্ষতিটা
                বুঝতেও পারেন না, কারণ পর্দায় সব স্বাভাবিক দেখায়। তাই একটা ভালো সমাধানকে
                তিনটাই একসাথে ঠেকাতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "মাঝখানে কে থাকে, এর উত্তর প্রায় সবসময় অনেকজন",
          content: (
            <p>
              নিজের বাসার Wi-Fi হলেও আপনি একা নন। আপনার ISP, তার উপরের বড় ISP, সমুদ্রের
              তারের মালিক কোম্পানি, Server যে Data Center এ আছে তার Network, প্রত্যেকে
              Packet হাতে পায়। এদের বেশিরভাগই ভালো মানুষ, কিন্তু নিরাপত্তা ভালো মানুষের
              উপর ভরসা করে বানানো যায় না। নিয়মটা হলো, পথটাকে শত্রু ধরে নিন, আর এমন ব্যবস্থা
              করুন যাতে পথের কেউ ভালো হোক বা খারাপ, কিছু যায় আসে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "three-guarantees",
      subHeader: { index: "003", title: "Three Guarantees" },
      title: <SectionTitle>তিনটা প্রতিশ্রুতি, আর TLS কোথায় বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তিনটা বিপদের উল্টো দিকে তিনটা প্রতিশ্রুতি। এই তিনটা শব্দ পুরো নিরাপত্তা
                জগতে বারবার শুনবেন, তাই নামগুলো ইংরেজিতেই মনে রাখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Confidentiality, গোপনীয়তা:</strong> পথে যা যায় তা শুধু দুই পাশ
                  পড়তে পারে। এর যন্ত্র Encryption, মানে লেখাটাকে একটা চাবি দিয়ে এমনভাবে
                  ঘুলিয়ে দেওয়া, যাতে চাবি ছাড়া সেটা এলোমেলো Byte ছাড়া কিছু নয়।
                </ListItem>
                <ListItem>
                  <strong>Integrity, অখণ্ডতা:</strong> পথে কেউ একটা Byte ও বদলালে প্রাপক
                  সাথে সাথে ধরে ফেলেন। এর যন্ত্র একটা ছোট হিসাব, যাকে Tag বলে, প্রতিটা
                  অংশের সাথে যায়। অংশটা বদলালে Tag আর মেলে না।
                </ListItem>
                <ListItem>
                  <strong>Authentication, পরিচয় যাচাই:</strong> ওপাশে যে বসে আছে সে সত্যিই
                  islandtours.example এর মালিক। এর যন্ত্র Certificate, যার ভেতরে কী থাকে আর
                  কে তাতে সই করে, সেটা পরের লেসনের পুরো বিষয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ThreeGuaranteesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তিনটা প্রতিশ্রুতি যে নিয়মের বই দেয়, তার নাম <strong>TLS</strong>,
                Transport Layer Security। আর <strong>HTTPS</strong> হলো TLS এর ভেতরে চলা
                HTTP, এর বেশি কিছু নয়। শেষের S মানে Secure। HTTP নিজে একটুও বদলায়নি, একই
                GET, একই Header, একই Status Code। শুধু Browser আর TCP এর মাঝখানে একটা নতুন
                তলা ঢুকেছে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TlsLayerSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তলাটা যন্ত্রের কোথায় থাকে? Module 05 এর TCP/IP Model লেসনে দেখেছিলেন,
                TCP আর IP থাকে Operating System এর Kernel এ। TLS সেখানে নয়। TLS থাকে
                Program এর ভেতরে, একটা Library হিসেবে। Chrome এর ভেতরে BoringSSL, Node.js এর
                ভেতরে OpenSSL, Mac এর curl এর ভেতরে LibreSSL। Kernel জানে শুধু একটা TCP
                Connection খোলা আছে আর তাতে কিছু Byte যাচ্ছে। সেই Byte গুলো যে তালাবদ্ধ,
                Kernel তা জানেও না।
              </ContentParagraph>
              <ContentParagraph>
                আর Port এর কথা। Port Socket লেসনের তালিকায় দেখেছেন, HTTP এর ঘর 80 আর
                HTTPS এর ঘর 443। এটা শুধু একটা চুক্তি। URL লেসনে দেখেছেন, Address Bar এ{" "}
                <code>https://</code> দেখলে Browser বোঝে দুইটা কাজ করতে হবে। Port উল্লেখ না
                থাকলে যেতে হবে 443 এ, আর TCP খোলার পরে HTTP এর একটা অক্ষর পাঠানোর আগেই TLS
                শুরু করতে হবে। কোন Port এ আসলে কী চলবে, শেষ পর্যন্ত সেটা Server এর সাজের
                উপর।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "TLS শুধু Web এর জন্য নয়",
          content: (
            <p>
              একই TLS আরও অনেক জায়গায় চলে, আর এই লেসনের সব ধারণা সেখানেও একই। Email
              পড়ার IMAPS Port 993 এ, App থেকে Email পাঠানোর SMTP Submission এ, PostgreSQL
              এর Connection এ (তার Setting এর নাম sslmode, আবার সেই পুরনো SSL নাম), আর এই
              Module এর শেষ লেসনের <code>wss://</code> এ। একবার TLS বুঝলে সবগুলো বোঝা হয়ে
              যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "ssl-vs-tls",
      subHeader: { index: "004", title: "SSL vs TLS" },
      title: <SectionTitle>SSL থেকে TLS: একই জিনিসের দুই নাম কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কাজের জায়গায় আপনি SSL আর TLS দুইটা শব্দই শুনবেন, প্রায় একই অর্থে।
                কেউ বলবেন SSL Certificate কিনতে হবে, Cloudflare এর Menu তে লেখা থাকবে
                SSL/TLS, Nginx এর Setting এর নাম <code>ssl_certificate</code>। অথচ আজ
                পৃথিবীর কোনো ভালো Server আসল SSL চালায় না। গল্পটা ছোট, কিন্তু জানা থাকলে
                বিভ্রান্তি থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TlsTimelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Netscape নামের একটা Browser কোম্পানি ১৯৯৫ সালে Web এ কেনাকাটার জন্য SSL
                বানায়, Secure Sockets Layer। তারপর নিয়মটা সবার হাতে তুলে দেওয়ার জন্য
                IETF এর কাছে যায়, যারা Internet এর নিয়মের বই বা RFC লেখে। IETF নাম বদলে
                রাখে TLS। ভেতরে মজার একটা চিহ্ন রয়ে গেছে। প্রতিটা Version এর একটা ভেতরের
                নম্বর আছে। SSL 3.0 এর নম্বর ছিল <code>0x0300</code>, আর TLS 1.0 এর নম্বর{" "}
                <code>0x0301</code>, মানে ভেতরে ভেতরে সেটা আসলে SSL 3.1। সেই হিসাবে TLS 1.3
                এর নম্বর <code>0x0304</code>। এই সংখ্যাটা একটু পরে curl এর আসল Output এ
                নিজের চোখে দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                প্রতিটা নতুন Version এসেছে আগেরটার কোনো দুর্বলতা ঢাকতে। দুইটা SSL ই এমনভাবে
                ভেঙেছে যে আজ সেগুলো নিষিদ্ধ। TLS 1.0 আর 1.1 এর দুর্বলতা ধরা পড়ার পর Browser
                গুলো ২০২০ সালে সেগুলো বন্ধ করে দেয়, আর RFC 8996 ২০২১ সালে আনুষ্ঠানিকভাবে
                অবসরে পাঠায়। আজ যা দেখবেন তা দুইটাই:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>TLS 1.3 (২০১৮, RFC 8446):</strong> আজকের মান। দ্রুত, সরল, আর
                  পুরনো সব দুর্বল বিকল্প কেটে বাদ দেওয়া। আপনার Browser আর ভালো Server
                  নিজেরাই এটা বেছে নেয়।
                </ListItem>
                <ListItem>
                  <strong>TLS 1.2 (২০০৮, RFC 5246):</strong> এখনো চলে, কারণ কিছু পুরনো
                  Android ফোন, পুরনো Library আর কিছু অফিসের Network যন্ত্র 1.3 বোঝে না।
                  ঠিকভাবে সাজালে এখনো নিরাপদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই একটা Server এর জন্য সঠিক সাজ হলো শুধু TLS 1.2 আর TLS 1.3 চালু রাখা।
                Island Tours এর Caddy নিজে থেকেই ঠিক এটা করে, তার Default সর্বনিম্ন tls1.2
                আর সর্বোচ্চ tls1.3, কিছু বদলাতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু সব Server এমন নয়, আর এখানে একটা আসল পর্যবেক্ষণ আছে। এই লেসন লেখার
                সময় example.com এর সাথে জোর করে TLS 1.1 চালানোর চেষ্টা করা হয়েছিল। প্রথমে
                আমাদের নিজের OpenSSL ই রাজি হলো না, বলল{" "}
                <code>no protocols available</code>, মানে এত পুরনো Version তার কাছে নিজেই
                বন্ধ। নিরাপত্তার মাপকাঠি জোর করে শূন্যে নামিয়ে আবার চেষ্টা করলে Server টা
                ঠিকই TLS 1.1 এ রাজি হয়ে গেল। মানে কোন পুরনো Version চলবে, সেটা Server এর
                মালিকের সিদ্ধান্ত, আর অনেকে সেই সিদ্ধান্তটা কখনো নেন না। আপনার নিজের Server
                এর বেলায় সিদ্ধান্তটা নিন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "old-versions.sh",
          code: `# পুরনো Version এর চেষ্টা: আপনার OpenSSL নিজেই আটকে দেয়
echo | openssl s_client -connect example.com:443 -servername example.com -tls1_1 -brief
# ...:error:0A0000BF:SSL routines:tls_setup_handshake:no protocols available

# মাপকাঠি শূন্যে নামিয়ে জোর করলে, শুধু দেখার জন্য, কখনো Production এ নয়
echo | openssl s_client -connect example.com:443 -servername example.com \\
  -tls1_1 -cipher 'DEFAULT@SECLEVEL=0' -brief
# Protocol version: TLSv1.1
# Ciphersuite: ECDHE-RSA-AES128-SHA
# Hash used: MD5-SHA1`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "কথা বলার সময় কোন শব্দটা বলবেন",
          content: (
            <p>
              মানুষ SSL Certificate বললে বুঝে নিন TLS এর Certificate, কারণ জিনিসটা আসলে এক।
              নিজে লেখার সময় TLS লিখুন, আর Version এর কথা উঠলে নম্বর সহ বলুন, TLS 1.2 বা
              TLS 1.3। কেউ যদি বলেন আমাদের Server এ SSL চালু, আর আপনি জানতে চান সত্যিই
              কোন Version, তাহলে এই লেসনের openssl কমান্ডটা চালিয়ে দেখে নিন। কথার চেয়ে
              Output বেশি বিশ্বাসযোগ্য।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "two-kinds-of-lock",
      subHeader: { index: "005", title: "Two Kinds of Lock" },
      title: <SectionTitle>দুই রকমের তালা: Symmetric আর Asymmetric</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Encryption এর কথা উঠলেই একটা চাবির কথা আসে। চাবি ছাড়া তালাবদ্ধ লেখা খোলা
                যায় না। কিন্তু চাবি দুই রকমের হয়, আর TLS এর পুরো নকশাটা বুঝতে হলে এই দুইটার
                তফাত আগে পরিষ্কার হওয়া দরকার। এখানে শুধু ধারণাটা দেখব, Key Pair এর গভীর
                গল্পটা পরের লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Symmetric তালা</strong> হলো আমাদের চেনা আলমারির তালা। একটাই চাবি,
                সেটা দিয়ে লাগানো যায়, সেটা দিয়েই খোলা যায়। ফোন আর Server দুইজনের কাছে যদি
                একই চাবির নকল থাকে, তাহলে ফোন তালা দিয়ে পাঠায়, Server একই চাবিতে খোলে।
                আজকের প্রচলিত দুইটা Symmetric তালার নাম <strong>AES</strong> আর{" "}
                <strong>ChaCha20</strong>। এরা ভীষণ দ্রুত। আধুনিক CPU তে AES চালানোর জন্য
                আলাদা Hardware নির্দেশ থাকে, তাই প্রতি সেকেন্ডে কয়েক Gigabyte তালাবদ্ধ করা
                কোনো ব্যাপারই নয়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু Symmetric তালার একটা বড় সমস্যা আছে, আর সমস্যাটা পুরো লেসনের চাবিকাঠি।
                চাবির নকলটা ওপাশে পৌঁছাবেন কীভাবে? পর্যটক আর Island Tours আগে কখনো দেখা
                করেননি। ক্যাফের Router দিয়েই চাবিটা পাঠাতে হবে, আর Router এর মালিক সব
                দেখছেন। চাবি পাঠালে তিনিও চাবি পেয়ে গেলেন, তালার আর কোনো মানে রইল না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Asymmetric তালা</strong> এই সমস্যার জন্যই বানানো। এখানে জিনিস দুইটা।
                একটা খোলা তালা, যেটা চাপ দিলেই বন্ধ হয়ে যায়, আর একটা চাবি, যেটা দিয়েই
                শুধু সেটা খোলে। Server এমন হাজারটা খোলা তালা যে কাউকে বিলিয়ে দেয়, এর নাম{" "}
                <strong>Public Key</strong>। চাবিটা একটাই, Server নিজের কাছে লুকিয়ে রাখে,
                এর নাম <strong>Private Key</strong>। যে কেউ একটা বাক্সে চিঠি রেখে Server এর
                তালাটা চেপে দিতে পারে, কিন্তু খুলতে পারে শুধু Server।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <LockKindsSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Asymmetric এর দাম হলো গতি। এর হিসাবগুলো Symmetric এর চেয়ে হাজার গুণ ধীর,
                তাই পুরো একটা পাতা বা ছবি এভাবে তালাবদ্ধ করা অর্থহীন। TLS তাই দুইটাকে
                দুই কাজে লাগায়, ঠিক যেভাবে একটা অফিস একবার রেজিস্টার্ড ডাকে একটা চাবি
                পাঠায়, তারপর রোজকার সব চিঠি সাধারণ তালাবদ্ধ ব্যাগে পাঠায়:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুরুর কয়েক মিলিসেকেন্ডে Asymmetric:</strong> দুই পাশ মিলে একটা
                  নতুন Symmetric চাবিতে একমত হয়, আর Server প্রমাণ করে যে সে-ই আসল মালিক।
                  এই দুইটা কাজকে বলে Key Exchange আর Signature।
                </ListItem>
                <ListItem>
                  <strong>তারপর পুরো সময় Symmetric:</strong> প্রতিটা Request, প্রতিটা
                  Response, প্রতিটা ছবি সেই নতুন চাবিতে AES বা ChaCha20 দিয়ে তালাবদ্ধ হয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এখন প্রশ্ন, দুই পাশ একটা Symmetric চাবিতে একমত হয় ঠিক কীভাবে, যখন পথের সবাই
                সব দেখছে? পুরনো দিনে ফোন নিজে একটা চাবি বানিয়ে Server এর খোলা তালায় ভরে
                পাঠাত। আজ তার চেয়েও সুন্দর একটা কৌশল চলে, যেখানে চাবিটা কখনো তারেই যায়
                না। পরের সেকশন সেটা নিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "key-exchange",
      subHeader: { index: "006", title: "Key Exchange" },
      title: <SectionTitle>সবার সামনে বসে একটা গোপন চাবি বানানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রঙের খেলা দিয়ে শুরু করি, কারণ ধারণাটা প্রথমবার শুনলে জাদুর মতো লাগে।
                ফোন আর Server দুইজন একটা সাধারণ রঙে একমত হলেন, ধরুন হলুদ, আর এটা সবাই
                জানে। এবার দুইজন নিজের নিজের একটা গোপন রং বেছে নিলেন, যা কাউকে বলবেন না।
                ফোন হলুদের সাথে নিজের গোপন রং মেশালেন, Server ও তাই করলেন। এই দুইটা মেশানো
                রং তাঁরা সবার সামনে বিনিময় করলেন। ক্যাফের মালিক দুইটা মেশানো রংই দেখলেন।
              </ContentParagraph>
              <ContentParagraph>
                এবার আসল কৌশল। ফোন Server এর পাঠানো মেশানো রঙে নিজের গোপন রংটা আবার মেশালেন।
                Server ও ফোনের পাঠানো মেশানো রঙে নিজের গোপন রং মেশালেন। দুইজনের বাটিতেই
                এখন হলুদ, ফোনের গোপন রং আর Server এর গোপন রং, তিনটাই আছে, শুধু মেশানোর ক্রম
                আলাদা। রং মেশানোয় ক্রমে কিছু যায় আসে না, তাই দুইজনের বাটিতে হুবহু একই রং।
                আর ক্যাফের মালিক? তাঁর কাছে দুইটা মেশানো রং আছে, কিন্তু মেশানো রং থেকে আলাদা
                করে গোপন রংটা বের করা যায় না। তিনি শেষ রংটা বানাতে পারেন না।
              </ContentParagraph>
              <ContentParagraph>
                এই কৌশলের নাম <strong>Diffie-Hellman</strong> Key Exchange, ১৯৭৬ সালে
                দুইজন গবেষকের নামে। রঙের জায়গায় আসলে চলে সংখ্যা, আর মেশানোর জায়গায় একটা
                বিশেষ গুণ। নিচের Lab এ ছোট সংখ্যা দিয়ে আসল হিসাবটাই করা হয়েছে। এখানে{" "}
                <code>mod</code> মানে ভাগ করার পর যা অবশিষ্ট থাকে, ঘড়ির হিসাবের মতো। ঘড়িতে
                ১০টার চার ঘণ্টা পরে ২টা বাজে, ১৪ নয়, কারণ ঘড়ি ১২ তে ঘুরে যায়। এখানে ঘড়িটা
                ঘোরে 23 এ।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeyExchangeLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আসল TLS এ সংখ্যার জায়গায় চলে Elliptic Curve নামের একটা গাণিতিক বাঁকা রেখার
                উপরের বিন্দু, আর সবচেয়ে প্রচলিত বাঁকা রেখাটার নাম <strong>X25519</strong>।
                নাম দেখে ঘাবড়াবেন না, ধারণাটা হুবহু উপরের Lab এর মতো। দুই পাশ একটা করে প্রকাশ্য
                অর্ধেক পাঠায়, যাকে TLS এর ভাষায় বলে <strong>Key Share</strong>, আর দুই পাশ
                আলাদা হিসাব করে একই গোপন সংখ্যায় পৌঁছায়। সেই গোপন সংখ্যা থেকেই বানানো হয়
                AES বা ChaCha20 এর Symmetric চাবি।
              </ContentParagraph>
              <ContentParagraph>
                এই পদ্ধতির পুরো নাম <strong>ECDHE</strong>। EC মানে Elliptic Curve, DH মানে
                Diffie-Hellman, আর শেষের E টা সবচেয়ে জরুরি, Ephemeral, মানে ক্ষণস্থায়ী।
                প্রতিটা Connection এ দুই পাশ একদম নতুন গোপন সংখ্যা বানায়, আর কাজ শেষে মুছে
                ফেলে। এর ফল একটা দারুণ সুরক্ষা, যার নাম <strong>Forward Secrecy</strong>।
              </ContentParagraph>
              <ContentParagraph>
                Forward Secrecy বোঝার জন্য একটা খারাপ দিনের কথা ভাবুন। কেউ আজ ক্যাফে বসে
                পর্যটকের সব তালাবদ্ধ Byte রেকর্ড করে রাখল, খুলতে পারল না, শুধু জমিয়ে রাখল।
                এক বছর পরে কোনোভাবে Island Tours এর Server থেকে Private Key টা চুরি হলো। এখন
                কি সে পুরনো রেকর্ড খুলতে পারবে? ECDHE তে পারবে না। কারণ Private Key দিয়ে
                শুধু পরিচয় প্রমাণের সই করা হয়েছিল, চাবি বানানো হয়েছিল সেই ক্ষণস্থায়ী গোপন
                সংখ্যা থেকে, যা এক বছর আগেই মুছে গেছে। পুরনো দিনের যে পদ্ধতিতে ফোন চাবিটা
                Server এর Public Key এ ভরে পাঠাত, সেখানে Private Key চুরি মানে সব পুরনো রেকর্ড
                খুলে যাওয়া। TLS 1.3 সেই পুরনো পদ্ধতিটা পুরোপুরি বাদ দিয়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "আসল Output এ যে অচেনা নামটা দেখবেন: X25519MLKEM768",
          content: (
            <div className="space-y-3">
              <p>
                এই লেসনের openssl পরীক্ষায় example.com এর সাথে Handshake এর শেষে একটা লাইন
                এসেছে: <code>Negotiated TLS1.3 group: X25519MLKEM768</code>। এটা দুইটা Key
                Exchange এর জোড়া। একটা চেনা X25519, আরেকটা ML-KEM-768, যেটা ভবিষ্যতের
                Quantum Computer এর বিরুদ্ধে টেকার জন্য বানানো। চিন্তাটা হলো, কেউ আজ রেকর্ড
                করে রাখল আর বহু বছর পরে একটা শক্তিশালী Quantum Computer দিয়ে খোলার চেষ্টা
                করল। দুইটা একসাথে চালালে দুইটাকেই ভাঙতে হয়।
              </p>
              <p>
                ২০২৬ সালের হিসাবে Chrome, Edge আর Firefox এটা নিজে থেকেই ব্যবহার করে, আর
                Cloudflare এর মতো বড় সেবাগুলো রাজি হয়। আপনাকে কিছু চালু করতে হয় না, আপনার
                Library আর Browser নতুন হলেই এটা ঘটে। জানা থাকা দরকার শুধু এই কারণে যে
                ClientHello এখন আগের চেয়ে বড়, কারণ এই Key Share টা বড়, আর Output এ নামটা দেখে
                যেন অবাক না হন।
              </p>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "tls13-handshake",
      subHeader: { index: "007", title: "TLS 1.3 Handshake" },
      title: <SectionTitle>TLS 1.3 Handshake, প্রতিটা বার্তা ধরে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সব জোড়া লাগানোর পালা। Module 05 এর Three-way Handshake দিয়ে TCP এর
                রাস্তা খুলেছিল। তার ঠিক পরে, HTTP এর একটা অক্ষর যাওয়ার আগে, আরেকটা পরিচয়পর্ব
                চলে, যার নাম TLS Handshake। এর তিনটা কাজ: কোন Version আর কোন তালা চলবে তাতে
                একমত হওয়া, সবার সামনে একটা গোপন চাবি বানানো, আর Server যে আসল সেটা প্রমাণ
                করা। TLS 1.3 এই তিনটা কাজ মাত্র এক Round Trip এ সেরে ফেলে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <Tls13HandshakeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রতিটা বার্তার ভেতরে কী থাকে, ধীরে ধীরে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ClientHello, ফোন থেকে:</strong> ফোন জানায় সে কোন কোন TLS Version
                  বোঝে, কোন কোন Cipher Suite চালাতে পারে, আর সাথে পাঠিয়ে দেয় নিজের Key
                  Share, মানে আগের সেকশনের সেই প্রকাশ্য অর্ধেকটা। ফোন আগে থেকেই আন্দাজ করে
                  নেয় Server কোন বাঁকা রেখা পছন্দ করবে, তাই প্রশ্ন আর উত্তরের একটা বাড়তি
                  চক্কর বাঁচে। এর সাথে দুইটা ছোট কিন্তু জরুরি জিনিস যায়।{" "}
                  <strong>SNI</strong>, Server Name Indication, যেখানে লেখা থাকে কোন নামের
                  সাথে কথা বলতে চায়, এখানে islandtours.example। আর{" "}
                  <strong>ALPN</strong>, যেখানে জানায় তালার ভেতরে সে কোন HTTP বলবে, h2
                  নাকি http/1.1।
                </ListItem>
                <ListItem>
                  <strong>ServerHello, Server থেকে:</strong> Server তালিকা থেকে একটা
                  Version আর একটা Suite বেছে নেয়, আর নিজের Key Share পাঠায়। এই মুহূর্তে দুই
                  পাশই একই গোপন সংখ্যা হিসাব করে ফেলেছে, আর তা থেকে চাবি বানিয়েছে। এর পরের
                  সব বার্তা তালাবদ্ধ।
                </ListItem>
                <ListItem>
                  <strong>EncryptedExtensions:</strong> বাকি সিদ্ধান্তগুলো, যেমন ALPN এর
                  উত্তর h2। এগুলো আগে খোলা যেত, TLS 1.3 এগুলোও তালার ভেতরে ঢুকিয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Certificate:</strong> Server এর পরিচয়পত্র, যাতে লেখা এই Public
                  Key টা islandtours.example এর, আর একজন বিশ্বস্ত প্রতিষ্ঠান তাতে সই
                  করেছে। TLS 1.2 তে এটা খোলা যেত, পথের সবাই দেখত। 1.3 তে তালাবদ্ধ।
                  Certificate এর ভেতরে ঠিক কী কী থাকে আর ফোন কীভাবে সেটা যাচাই করে, পুরো পরের
                  লেসন।
                </ListItem>
                <ListItem>
                  <strong>CertificateVerify:</strong> এই বার্তাটাই আসল প্রমাণ। Certificate তো
                  যে কেউ নকল করে পাঠাতে পারে, ওটা একটা প্রকাশ্য কাগজ। তাই Server এ পর্যন্ত
                  হওয়া পুরো কথোপকথনের উপর নিজের Private Key দিয়ে একটা সই করে। Certificate
                  এর Public Key দিয়ে ফোন সইটা মিলিয়ে দেখে। মিললে প্রমাণ হলো, ওপাশে যে আছে
                  তার কাছে সত্যিই সেই Private Key আছে। নকল Server এর কাছে Certificate এর নকল
                  থাকতে পারে, কিন্তু Private Key থাকে না।
                </ListItem>
                <ListItem>
                  <strong>Finished, দুই পাশ থেকে:</strong> প্রত্যেকে পুরো Handshake এর একটা
                  হিসাব পাঠায়, নতুন চাবি দিয়ে বানানো। মাঝের কেউ যদি ClientHello থেকে
                  শক্তিশালী Suite গুলো মুছে দিয়ে দুই পাশকে একটা দুর্বল Suite এ ঠেলে দিতে
                  চায়, এই হিসাব মিলবে না, আর Connection তখনই বাতিল। এই ধরনের আক্রমণের নাম
                  Downgrade Attack।
                </ListItem>
                <ListItem>
                  <strong>তারপর HTTP:</strong> ফোন নিজের Finished এর ঠিক পরেই, অপেক্ষা না করে,
                  আসল Request পাঠিয়ে দেয়, <code>GET /tours/saint-martin</code>, সব Header আর
                  Cookie সহ, তালার ভেতরে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HandshakeStepLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Lab এ দেখা একটা অদ্ভুত বার্তা: change_cipher_spec",
          content: (
            <p>
              এই লেসনের চার নম্বর পরীক্ষায় মাঝের Program টা TLS এর প্রতিটা অংশের ধরন ছাপায়।
              সেখানে ফোনের দিক থেকে একটা <code>change_cipher_spec</code> দেখবেন, অথচ উপরের
              তালিকায় এমন কিছু নেই। এটা একটা ইচ্ছাকৃত অভিনয়। TLS 1.3 যখন বানানো হচ্ছিল,
              দেখা গেল অনেক অফিসের পুরনো Network যন্ত্র অচেনা চেহারার Handshake দেখলে
              Connection কেটে দেয়। তাই TLS 1.3 নিজেকে একটু TLS 1.2 এর মতো সাজিয়ে পাঠায়, এই
              অর্থহীন বার্তাটা সেই সাজের অংশ। দুই পাশ এটা দেখে উপেক্ষা করে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "round-trips",
      subHeader: { index: "008", title: "Round Trips and Cost" },
      title: <SectionTitle>কত Round Trip লাগে, আর TLS এর আসল দাম</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 02 এর Latency লেসনে দেখেছিলেন, একটা বার্তা যেতে আর তার উত্তর আসতে যে
                সময় লাগে, তাকে বলে Round Trip Time, ছোট করে RTT। আর RTT কমানোর কোনো
                Software নেই, আলোর গতি আর তারের দৈর্ঘ্যই ঠিক করে দেয়। ঢাকা থেকে Singapore এর
                একটা Server এ RTT মোটামুটি 40 ms, আমেরিকার পূর্ব উপকূলে 250 ms এর কাছাকাছি।
                তাই প্রতিটা Handshake কতবার যাওয়া আসা করে, সেটা সরাসরি পর্যটকের অপেক্ষার
                সময়।
              </ContentParagraph>
              <ContentParagraph>
                একটা HTTPS পাতার প্রথম Byte পেতে তিন ধাপ পার হতে হয়: TCP Handshake, TLS
                Handshake, তারপর Request আর তার উত্তর। নিচের Lab এ সব রকমের Connection
                পাশাপাশি রাখা হয়েছে, Server এর দূরত্ব বদলে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RoundTripLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এর সংখ্যাগুলো হিসাব, আসল মাপ নয়। আসল মাপ curl দিয়ে নেওয়া যায়, আর এই লেসন
                লেখার সময় example.com এর সাথে কয়েকবার নেওয়া হয়েছিল। curl এর{" "}
                <code>-w</code> দিয়ে বলে দেওয়া যায় কোন কোন সময় ছাপাবে।{" "}
                <code>time_connect</code> হলো TCP Handshake শেষ হওয়ার মুহূর্ত, আর{" "}
                <code>time_appconnect</code> হলো TLS Handshake শেষ হওয়ার মুহূর্ত। দুইটাই শুরু
                থেকে গোনা, তাই TLS এর নিজের ভাগ বের করতে <code>tls</code> থেকে{" "}
                <code>tcp</code> বাদ দিতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "measure-handshake.sh",
          code: `for i in 1 2 3; do
  curl -s -o /dev/null -w 'ip=%{remote_ip} tcp=%{time_connect}s tls=%{time_appconnect}s\\n' https://example.com
done
# ip=104.20.23.154 tcp=0.057775s tls=0.117824s
# ip=104.20.23.154 tcp=0.054606s tls=0.119558s
# ip=104.20.23.154 tcp=0.055761s tls=0.123489s

# একই কাজ, কিন্তু TLS 1.2 এর উপরে যেতে দেওয়া হলো না
for i in 1 2 3; do
  curl -s -o /dev/null --tls-max 1.2 -w 'tcp=%{time_connect}s tls=%{time_appconnect}s\\n' https://example.com
done
# tcp=0.055725s tls=0.168223s
# tcp=0.058520s tls=0.183458s
# tcp=0.054271s tls=0.172982s

# তালা ছাড়া, তুলনার জন্য
curl -s -o /dev/null -w 'tcp=%{time_connect}s tls=%{time_appconnect}s\\n' http://example.com
# tcp=0.008040s tls=0.000000s`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম তিন সারি TLS 1.3। TCP Handshake শেষ হয়েছে প্রায় 56 ms এ, আর TCP
                Handshake নিজেই এক Round Trip, তাই এই পথে RTT প্রায় 56 ms। TLS শেষ হয়েছে প্রায়
                118 ms এ, মানে TLS এর নিজের ভাগ প্রায় 62 ms, এক Round Trip আর সামান্য হিসাব।
                পরের তিন সারি TLS 1.2, একই পথে TLS এর ভাগ প্রায় 117 ms, মোটামুটি দুই Round
                Trip। বইয়ে যা পড়লেন, আসল মাপে হুবহু তাই এলো। আর Plain HTTP তে{" "}
                <code>tls=0</code>, কারণ কোনো Handshake ই হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                একটা মজার জিনিসও ধরা পড়েছে। শেষ সারিতে TCP মাত্র 8 ms। একই IP, একই মিনিট,
                অথচ RTT সাত ভাগের এক ভাগ। example.com আসলে Cloudflare এর পেছনে, আর Module 04 এ
                দেখেছেন একই IP পৃথিবীর অনেক জায়গা থেকে Anycast এ ঘোষণা করা হয়। কখনো পথটা
                ঢাকার কাছের কোনো Edge এ যায়, কখনো দূরের কোনোটায়। তাই নিজে মাপার সময় সবসময়
                কয়েকবার মাপুন, আর TLS এর ভাগটা TCP এর সাথে তুলনা করুন, একা নয়। Server 250 ms
                দূরে হলে TLS 1.2 এর বাড়তি Round Trip একাই প্রতিটা নতুন Connection এ এক সেকেন্ডের
                চার ভাগের এক ভাগ খেয়ে ফেলে।
              </ContentParagraph>
              <ContentParagraph>
                এবার বাকি তিনটা ধারণা, যেগুলো Lab এর সারিতে দেখলেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Resumption, আবার ফিরে আসা:</strong> Handshake শেষে Server ফোনকে
                  একটা <strong>Session Ticket</strong> দেয়। পরের বার ফোন এই Ticket টা দেখালে
                  দুই পাশ আগের পরিচয়ের সূত্র ধরে নতুন চাবি বানায়, Certificate আর সইয়ের
                  পুরো পর্ব আর লাগে না। এতে হিসাব আর Byte বাঁচে। কিন্তু খেয়াল করুন, Round
                  Trip একটাই থাকে।
                </ListItem>
                <ListItem>
                  <strong>0-RTT, Early Data:</strong> ফিরে আসা ফোন চাইলে প্রথম বার্তার সাথেই
                  Request টা পাঠিয়ে দিতে পারে, Handshake শেষ হওয়ার অপেক্ষা না করে। দ্রুত,
                  কিন্তু একটা ফাঁদ আছে। মাঝের কেউ এই প্রথম বার্তাটা নকল করে আবার পাঠাতে পারে,
                  আর Server হয়তো দুইবার একই কাজ করে ফেলে। এর নাম Replay। তাই 0-RTT এ শুধু
                  এমন Request পাঠানো নিরাপদ যেটা দুইবার ঘটলে ক্ষতি নেই, যেমন একটা GET। বুকিং
                  বা Payment এর POST কখনো নয়। কোন Method বারবার পাঠানো নিরাপদ, তা Methods
                  লেসনে দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>HTTP/3 আর QUIC:</strong> HTTP Basics লেসনে দেখেছেন, HTTP/3 চলে UDP
                  এর উপরে QUIC নামের Protocol এ। QUIC রাস্তা খোলা আর তালা লাগানো একসাথে করে,
                  তাই আলাদা TCP Handshake এর Round Trip টা আর থাকে না।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["বিষয়", "TLS 1.2", "TLS 1.3"],
          rows: [
            ["Handshake এর Round Trip", "2", "1, ফিরে এলে চাইলে 0"],
            ["Certificate পথে", "খোলা, সবাই দেখে", "তালাবদ্ধ"],
            ["চাবি বিনিময়", "পুরনো RSA পদ্ধতিও চলে, Forward Secrecy ছাড়া", "শুধু ECDHE ধরনের, সবসময় Forward Secrecy"],
            ["Cipher Suite", "কয়েক ডজন, দুর্বলগুলো সহ", "মাত্র পাঁচটা, সবগুলো শক্ত"],
            ["Renegotiation", "চলে, আর এর ইতিহাসে একাধিক দুর্বলতা", "নেই। openssl এর Output এ লেখা থাকে forbids renegotiation"],
            ["আজ কখন দেখবেন", "পুরনো Client বা পুরনো Server", "বাকি প্রায় সব জায়গায়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর একটা পুরনো ভয় ভাঙা দরকার, যেটা এখনো অনেক মিটিংয়ে শুনবেন: HTTPS চালালে
                Server ধীর হয়ে যায়। একসময় কথাটা কিছুটা সত্য ছিল। আজ নয়। আধুনিক CPU তে
                AES এর জন্য আলাদা Hardware নির্দেশ আছে, আর যে ফোনে নেই, সেখানে ChaCha20
                Software এই দ্রুত চলে। Handshake এর হিসাব প্রতি Connection এ একবার, আর
                Connection খোলা রেখে একটার পর একটা Request পাঠালে, যা Keep-Alive আর HTTP/2
                এর কাজ, সেই দামটা হাজার Request এ ভাগ হয়ে যায়। TLS এর আসল দাম CPU নয়, Round
                Trip। সেটা কমানোর উপায়ও এই সেকশনেই দেখলেন: TLS 1.3, Connection খোলা রাখা,
                Resumption, আর ব্যবহারকারীর কাছে Server বা CDN বসানো।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "cipher-suites",
      subHeader: { index: "009", title: "Cipher Suites" },
      title: <SectionTitle>Cipher Suite এর নাম পড়তে শেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ClientHello তে ফোন যে তালাগুলোর তালিকা পাঠায়, তার প্রতিটার একটা লম্বা নাম
                আছে। এই নামগুলোকে বলে <strong>Cipher Suite</strong>। প্রথমবার দেখলে
                এলোমেলো অক্ষর মনে হয়, কিন্তু আসলে প্রতিটা নাম কয়েকটা সিদ্ধান্তের তালিকা,
                একটা নির্দিষ্ট ক্রমে লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CipherSuiteDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নামের মধ্যে সবচেয়ে জরুরি অংশটা <strong>AEAD</strong>, Authenticated
                Encryption with Associated Data। শব্দটা ভারী, কিন্তু মানে সহজ: তালা লাগানো
                আর বদল ধরা, দুইটা কাজ একসাথে। GCM আর POLY1305 এই ধরনের। প্রতিটা তালাবদ্ধ অংশের
                শেষে একটা ছোট Tag যায়, যেটা সেই অংশের প্রতিটা Byte থেকে চাবি দিয়ে হিসাব করা।
                এটাই তৃতীয় সেকশনের Integrity প্রতিশ্রুতির যন্ত্র। পথে কেউ একটা Byte বদলালে
                প্রাপক Tag মিলিয়ে দেখেন, মেলে না, আর Connection তখনই ভেঙে দেন। কোনো প্রশ্ন নেই,
                কোনো দ্বিতীয় সুযোগ নেই।
              </ContentParagraph>
              <ContentParagraph>
                এটা নিজের চোখে দেখা যায়। Lab এর চার নম্বর পরীক্ষায় মাঝের Program টা HTTPS এর
                উত্তরের শেষ Byte টা উল্টে দেয়, Plain HTTP তে যেভাবে টাকার ঠিকানা বদলেছিল। এবার
                ফলাফল আলাদা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "tamper-result.txt",
          code: `[spy] server -> client  793 bytes, record: application_data
[spy] application_data র একটা Byte বদলে দিলাম

curl: (56) LibreSSL SSL_read: LibreSSL/3.3.6: error:06FFF064:digital envelope routines:CRYPTO_internal:bad decrypt, errno 0`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                curl বদলানো উত্তরটা দেখায়ইনি। একটা ভুল উত্তর দেখানোর চেয়ে কোনো উত্তর না
                দেখানো অনেক নিরাপদ, আর TLS ঠিক সেটাই বেছে নেয়। মাঝের লোকটা এখনো Connection
                ভেঙে দিতে পারে, সেটা কেউ ঠেকাতে পারে না, কিন্তু চুপচাপ মিথ্যা ঢুকিয়ে দিতে আর
                পারে না।
              </ContentParagraph>
              <ContentParagraph>
                TLS 1.3 এ মাত্র পাঁচটা Suite আছে, আর বাস্তবে আপনি দেখবেন তিনটা:{" "}
                <code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>,{" "}
                <code>TLS_CHACHA20_POLY1305_SHA256</code>। তিনটাই শক্ত, কোনটা বাছা হলো তা
                নিয়ে মাথা ঘামানোর দরকার নেই। মজার ব্যাপার, এই লেসনের দুইটা পরীক্ষায় একই
                example.com এর সাথে দুইটা আলাদা Suite এসেছে। openssl পেয়েছে{" "}
                <code>TLS_AES_256_GCM_SHA384</code>, আর Mac এর curl দেখিয়েছে{" "}
                <code>AEAD-CHACHA20-POLY1305-SHA256</code>, যেটা আসলে{" "}
                <code>TLS_CHACHA20_POLY1305_SHA256</code> এর LibreSSL এর দেওয়া নাম। কারণ
                প্রতিটা Client নিজের পছন্দের ক্রমে তালিকা পাঠায়, আর Server সেই তালিকা থেকে
                বাছে। একই Suite এর নাম Library ভেদে আলাদা হতে পারে, এটাও মনে রাখুন।
              </ContentParagraph>
              <ContentParagraph>
                TLS 1.2 এর তালিকা অনেক লম্বা, আর তাতে পুরনো দুর্বল জিনিসও আছে। কোনো Scanner
                এর রিপোর্টে বা কোনো Server এর Setting এ নিচের শব্দগুলো দেখলে সতর্ক হন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>RC4, 3DES, DES, NULL, EXPORT, MD5:</strong> ভাঙা বা ইচ্ছা করে দুর্বল
                  বানানো। কোনো অবস্থাতেই থাকা চলবে না।
                </ListItem>
                <ListItem>
                  <strong>নামের শুরুতে ECDHE বা DHE নেই, যেমন AES128-GCM-SHA256:</strong>{" "}
                  এখানে চাবি বিনিময় হয় পুরনো RSA পদ্ধতিতে, মানে Forward Secrecy নেই।
                </ListItem>
                <ListItem>
                  <strong>CBC আর SHA এর জোড়া, যেমন ECDHE-RSA-AES128-SHA:</strong> TLS 1.1 এর
                  পরীক্ষায় ঠিক এটাই এসেছিল। পুরনো ধরনের, আজকের AEAD Suite থাকতে এর দরকার
                  নেই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজে তালিকা বানাবেন না",
          content: (
            <p>
              Cipher Suite এর তালিকা হাতে লিখে সাজানো ভুল করার সবচেয়ে সহজ উপায়। Caddy এর মতো
              আধুনিক Server নিজে থেকেই ভালো তালিকা চালায়। Nginx বা অন্য কিছুতে হাতে লিখতে হলে
              Mozilla SSL Configuration Generator থেকে Intermediate সাজটা নিন, যেটা TLS 1.2
              আর 1.3 চালু রাখে আর শুধু শক্ত Suite গুলো রাখে। লিংক এই লেসনের Resources এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "what-https-hides",
      subHeader: { index: "010", title: "What HTTPS Hides" },
      title: <SectionTitle>HTTPS কী লুকায়, আর কী লুকায় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                অনেকে ভাবেন HTTPS চালু মানে পথের কেউ আর কিছুই জানে না। কথাটা পুরোপুরি ঠিক
                নয়, আর ঠিক কোথায় ভুল তা জানা একজন ভালো Engineer এর কাজ। একটা খামের কথা
                ভাবুন। ভেতরের চিঠি কেউ পড়তে পারে না, কিন্তু খামের উপরে ঠিকানা লেখা থাকে, না
                থাকলে ডাকপিয়ন পৌঁছে দেবেন কীভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VisibleHiddenSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>খামের উপরে যা থাকে, একে একে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>IP Address আর Port:</strong> এগুলো IP আর TCP এর Header এ থাকে,
                  TLS এর নিচের তলায়। Router গুলো এগুলো দেখেই পথ ঠিক করে, Module 03 এ যেমন
                  দেখেছেন। তাই এগুলো কখনো লুকানো যায় না।
                </ListItem>
                <ListItem>
                  <strong>SNI তে Server এর নাম:</strong> HTTP Basics লেসনে দেখেছেন একটা IP তে
                  অনেকগুলো সাইট থাকতে পারে। চাবি তৈরির আগেই Server কে ঠিক করতে হয় কোন
                  সাইটের Certificate দেখাবে, তাই নামটা ClientHello তে খোলাই যায়। Lab এর চার
                  নম্বর পরীক্ষায় মাঝের Program টা পুরো তালাবদ্ধ Connection থেকে ঠিক দুইটা
                  জিনিস পড়তে পেরেছে: <code>localhost</code>, মানে SNI, আর{" "}
                  <code>http/1.1</code>, মানে ALPN। এই ফাঁক বন্ধ করার জন্য এসেছে{" "}
                  <strong>ECH</strong>, Encrypted Client Hello, যেখানে আসল নামটাও তালাবদ্ধ
                  হয়ে যায়, আর তালার চাবি Server আগে থেকে DNS এ রেখে দেয়। এটা এখন IETF এর
                  মান, Chrome আর Firefox এ চলে, Cloudflare এর পেছনের সাইটগুলোতে কাজ করে,
                  কিন্তু এখনো সব জায়গায় নয়।
                </ListItem>
                <ListItem>
                  <strong>DNS প্রশ্ন:</strong> TLS শুরুর আগেই ফোন জিজ্ঞেস করেছে
                  islandtours.example এর IP কী। সাধারণ DNS খোলা চলে। Module 04 এর Recursive
                  Resolver লেসনে DoH আর DoT দেখেছেন, যেগুলো এই প্রশ্নটাকেও তালাবদ্ধ করে।
                </ListItem>
                <ListItem>
                  <strong>আকার আর সময়:</strong> কত Byte গেল, কখন গেল, কতক্ষণ চলল। শুধু এই
                  দিয়ে চতুর কেউ কখনো কখনো আন্দাজ করতে পারে কোন পাতা খোলা হলো, কারণ প্রতিটা
                  পাতার আকার আলাদা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WireViewLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এ Caddy কে দর্শক হিসেবে বেছে নিয়ে দেখেছেন, সে সব পড়তে পারে। এটা কোনো
                দুর্বলতা নয়, এটাই কথা ছিল। HTTPS পথটাকে বাঁচায়, গন্তব্যকে নয়। Server যদি
                অসৎ হয়, বা তার Database ফাঁস হয়, বা আপনার Browser এ একটা খারাপ Extension বসে
                থাকে, HTTPS কিছুই করতে পারে না। আর Path টা পথে লুকানো থাকলেও Server এর Log আর
                Browser এর History তে থেকে যায়, URL লেসনে যেমন দেখেছেন।
              </ContentParagraph>
              <ContentParagraph>
                তাই তালার আসল মানে মনে রাখার মতো করে বলি। তালা বলে: এই Connection টা গোপন,
                পথে কেউ বদলায়নি, আর আপনি সত্যিই এই নামের মালিকের সাথে কথা বলছেন। তালা এটা
                বলে না যে নামটা সঠিক বা মালিকটা সৎ। কেউ <code>islandtours-login.example</code>{" "}
                নামে একটা নকল সাইট বানিয়ে সেই নামের জন্য একটা বৈধ Certificate নিয়ে নিতে পারে,
                আর তার পাতাতেও তালা জ্বলবে। Phishing পাতায় তালা থাকে। নামটা নিজের চোখে
                পড়ার দায়িত্ব এখনো ব্যবহারকারীর।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "see-it-yourself",
      subHeader: { index: "011", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে Handshake: curl আর openssl</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা যা পড়লেন, সব দুইটা কমান্ডে দেখা যায়। প্রথমটা curl এর{" "}
                <code>-v</code>, মানে verbose, যা প্রতিটা ধাপ ছাপিয়ে দেয়। নিচের Output টা
                এই লেসন লেখার সময় Mac এ আসলেই এসেছে, শুধু শেষের Response Header গুলোর কয়েকটা
                বাদ দেওয়া হয়েছে। আপনার যন্ত্রে IP, তারিখ আর কিছু শব্দ আলাদা হতে পারে, কারণ
                Linux এর curl LibreSSL নয়, OpenSSL ব্যবহার করে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-verbose.sh",
          code: `curl -sv -o /dev/null https://example.com

* Host example.com:443 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
*   Trying 104.20.23.154:443...
* Connected to example.com (104.20.23.154) port 443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/cert.pem
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=example.com
*  start date: Sep 26 22:49:11 2026 GMT
*  expire date: Dec 25 22:56:35 2026 GMT
*  subjectAltName: host "example.com" matched cert's "example.com"
*  issuer: C=US; O=SSL Corporation; CN=Cloudflare TLS Issuing ECC CA 3
*  SSL certificate verify ok.
* using HTTP/2
> GET / HTTP/2
> Host: example.com
< HTTP/2 200
< server: cloudflare
< alt-svc: h3=":443"; ma=86400`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>লাইন ধরে ধরে পড়ি।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Resolved, Trying, Connected:</strong> DNS আর TCP Handshake, Module
                  04 আর 05। এখনো তালার কোনো কথা নেই।
                </ListItem>
                <ListItem>
                  <strong>ALPN: curl offers h2,http/1.1:</strong> ClientHello তে curl জানাল
                  সে HTTP/2 আর HTTP/1.1 দুইটাই বলতে পারে।
                </ListItem>
                <ListItem>
                  <strong>(304):</strong> চতুর্থ সেকশনের সেই ভেতরের নম্বর, 0x0304, মানে TLS
                  1.3। ব্র্যাকেটের সংখ্যাগুলো প্রতিটা বার্তার নিজের নম্বর।
                </ListItem>
                <ListItem>
                  <strong>OUT Client hello (1), IN Server hello (2):</strong> খোলা দুইটা
                  বার্তা। এর পর থেকে সব তালাবদ্ধ।
                </ListItem>
                <ListItem>
                  <strong>Unknown (8):</strong> এটা EncryptedExtensions, যার নম্বর 8। Mac এর
                  LibreSSL নামটা চেনে না, তাই Unknown লেখে। আসল জীবনের Output এমনই, সবসময়
                  বইয়ের মতো সুন্দর হয় না।
                </ListItem>
                <ListItem>
                  <strong>Certificate (11), CERT verify (15), Finished (20):</strong> Server
                  এর পরিচয়পত্র, সই আর হিসাব। তারপর curl এর নিজের Finished, OUT।
                </ListItem>
                <ListItem>
                  <strong>SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256:</strong>{" "}
                  ঠিক হলো Version আর Suite। Library টা এখনো নিজেকে SSL বলে ডাকে, চতুর্থ
                  সেকশনের সেই পুরনো নাম।
                </ListItem>
                <ListItem>
                  <strong>ALPN: server accepted h2:</strong> তালার ভেতরে HTTP/2 চলবে।
                </ListItem>
                <ListItem>
                  <strong>Server certificate থেকে SSL certificate verify ok:</strong> curl
                  Certificate এর নাম, মেয়াদ আর সই করা প্রতিষ্ঠান যাচাই করল। এই পাঁচ লাইনের
                  প্রতিটা শব্দের মানে পরের লেসনে। আপাতত দেখে রাখুন মেয়াদটা মাত্র তিন মাসের।
                </ListItem>
                <ListItem>
                  <strong>GET / HTTP/2 থেকে বাকিটা:</strong> এই অংশটাই তালার ভেতরের HTTP।
                  curl আপনাকে দেখাচ্ছে কারণ তালার দুই মাথার একটা curl নিজেই। পথের কেউ এটা দেখে
                  না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দ্বিতীয় কমান্ড <code>openssl s_client</code>, যেটা শুধু TLS এর অংশটা করে, HTTP
                এর কিছু না। <code>-servername</code> দিয়ে SNI তে কোন নাম যাবে বলে দিতে হয়,
                না দিলে অনেক Server ভুল Certificate দেখায় বা Connection ই ফিরিয়ে দেয়।{" "}
                <code>-brief</code> দিলে শুধু সারাংশ আসে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "openssl-brief.sh",
          code: `echo | openssl s_client -connect example.com:443 -servername example.com -brief

Connecting to 104.20.23.154
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_256_GCM_SHA384
Peer certificate: CN=example.com
Hash used: SHA256
Signature type: ecdsa_secp256r1_sha256
Verification: OK
Negotiated TLS1.3 group: X25519MLKEM768
DONE

# একই Server, TLS 1.2 জোর করে
echo | openssl s_client -connect example.com:443 -servername example.com -tls1_2 -brief
Protocol version: TLSv1.2
Ciphersuite: ECDHE-ECDSA-CHACHA20-POLY1305
Peer Temp Key: X25519, 253 bits
Verification: OK`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>Protocol version, Ciphersuite:</strong> Version আর তালা, যা নবম
                  সেকশনে পড়তে শিখেছেন।
                </ListItem>
                <ListItem>
                  <strong>Signature type: ecdsa_secp256r1_sha256:</strong> CertificateVerify
                  এর সই কোন পদ্ধতিতে হলো।
                </ListItem>
                <ListItem>
                  <strong>Negotiated TLS1.3 group:</strong> Key Exchange এর বাঁকা রেখা, ষষ্ঠ
                  সেকশনের X25519MLKEM768। TLS 1.2 তে একই জিনিস আসে Peer Temp Key নামে, আর
                  সেখানে সাধারণ X25519। Temp শব্দটাই Ephemeral, মানে Forward Secrecy আছে।
                </ListItem>
                <ListItem>
                  <strong>Verification: OK:</strong> Certificate যাচাই পাস। এটা না এলে বাকি
                  সব অর্থহীন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Browser এও একই জিনিস দেখা যায়। Address Bar এ সাইটের নামের বাঁ পাশের চিহ্নে চাপ
                দিন, Connection is secure লেখা আসবে, সেখান থেকে Certificate খোলা যায়। Chrome এর
                DevTools এর Security Panel এ (কিছু নতুন Version এ এর নাম Privacy and security) Version, Key Exchange আর Cipher এর নাম লেখা থাকে,
                আর Network Tab এ কোনো Request বেছে Timing এ গেলে SSL নামে Handshake এর সময়টা
                আলাদা করে দেখায়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "redirect-hsts",
      subHeader: { index: "012", title: "Redirect and HSTS" },
      title: <SectionTitle>HTTP থেকে HTTPS: Redirect, HSTS আর Mixed Content</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server এ HTTPS চালু করলেই কাজ শেষ নয়। পর্যটক Address Bar এ শুধু
                islandtours.example লেখেন, কেউ https টাইপ করে না। পুরনো Link, পুরনো
                Bookmark, কারো পাঠানো একটা SMS, এদের অনেকগুলোই <code>http://</code> দিয়ে
                শুরু। এই সবগুলোকে নিরাপদে HTTPS এ আনা একটা আলাদা কাজ, তিন ধাপে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম ধাপ, Port 80 এ শুধু Redirect।</strong> Server Port 80 এ শোনে,
                কিন্তু কোনো পাতা দেখায় না, শুধু বলে একই ঠিকানার HTTPS রূপে যান। এর জন্য দুইটা
                Status Code চলে, 301 আর 308, দুইটাই স্থায়ী। তফাতটা Methods লেসনে দেখেছেন: 308
                Method বদলাতে দেয় না, তাই একটা POST ও POST থাকে। Caddy নিজে থেকেই এই কাজ করে,
                আর 308 ব্যবহার করে। Lab এর ছয় নম্বর পরীক্ষার Server ও একই কাজ করে, তার আসল
                Output:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "redirect-then-hsts.sh",
          code: `curl -sIL --cacert localhost-cert.pem http://localhost:47674/tours/saint-martin

HTTP/1.1 308 Permanent Redirect
location: https://localhost:47675/tours/saint-martin

HTTP/1.1 200 OK
strict-transport-security: max-age=300
content-type: text/plain; charset=utf-8`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>দ্বিতীয় ধাপ, HSTS।</strong> শুধু Redirect এ একটা ফাঁক থাকে। প্রথম
                Request টা, যেটা Port 80 এ গেল, সেটা খোলা। ক্যাফের মাঝের লোকটা ঠিক সেই Request
                টা আটকে দিতে পারে, Redirect টা কখনো পর্যটকের কাছে পৌঁছাতেই দেয় না। সে নিজে
                Island Tours এর সাথে HTTPS এ কথা বলে, আর পর্যটকের সাথে Plain HTTP তে, মাঝখানে
                সব পড়ে। পর্যটকের Address Bar এ তালা নেই, কিন্তু কে খেয়াল করে। এই আক্রমণের নাম{" "}
                <strong>SSL Stripping</strong>।
              </ContentParagraph>
              <ContentParagraph>
                এর উত্তর একটা Header, <code>Strict-Transport-Security</code>, ছোট করে HSTS।
                HTTPS এর উত্তরের সাথে Server এটা পাঠায়, আর Browser নিজের খাতায় লিখে রাখে: এই
                নামের সাথে এত সেকেন্ড ধরে শুধু HTTPS। এর পর থেকে কেউ http লিখলেও বা পুরনো Link
                এ চাপ দিলেও Browser তারে কিছু পাঠানোর আগেই নিজে https বানিয়ে নেয়। Port 80 এ
                আর একটাও Request যায় না, তাই আটকানোর কিছু থাকে না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HstsFlowDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>Header টার তিনটা অংশ।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>max-age=31536000</code>: কত সেকেন্ড মনে রাখবে। এই সংখ্যাটা এক বছর।
                  প্রতিবার HTTPS এ আসলে মেয়াদটা আবার নতুন করে শুরু হয়।
                </ListItem>
                <ListItem>
                  <code>includeSubDomains</code>: নিয়মটা সব Subdomain এর জন্যও, যেমন
                  www, api, blog, admin। এটা দেওয়ার আগে নিশ্চিত হন প্রতিটা Subdomain এ HTTPS
                  আছে। না থাকলে সেগুলো Browser এ খুলবেই না।
                </ListItem>
                <ListItem>
                  <code>preload</code>: আপনি চান নামটা Browser এর ভেতরের তালিকায় ঢুকুক।
                  hstspreload.org এ জমা দিলে Chrome, Firefox, Safari আর Edge এর সাথে আসা
                  তালিকায় নামটা ওঠে, তখন একদম প্রথম বারের ফাঁকটাও আর থাকে না। শর্ত হলো বৈধ
                  Certificate, Port 80 থেকে একই নামে HTTPS এ Redirect, সব Subdomain এ HTTPS,
                  আর মূল নামে max-age কমপক্ষে এক বছর সহ includeSubDomains আর preload।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                HSTS এর একটা কড়া দিক আছে, যেটা জেনে রাখা জরুরি। HSTS থাকা নামে Certificate এর
                কোনো সমস্যা হলে Browser আর ঝুঁকি নিয়ে এগিয়ে যান বোতামটা দেখায় না। ব্যবহারকারীর
                হাতে কোনো উপায় থাকে না। এটা ইচ্ছা করেই, কারণ আক্রমণকারীর নকল Certificate দেখে
                মানুষ বোতামে চাপ দিয়েই বসে। তাই HSTS ধাপে ধাপে চালু করুন, প্রথমে{" "}
                <code>max-age=300</code>, পাঁচ মিনিট। এক সপ্তাহ কিছু না ভাঙলে এক সপ্তাহ, তারপর
                এক মাস, তারপর এক বছর। Preload এ জমা দেওয়ার আগে খুব ভেবে নিন, কারণ তালিকা থেকে
                নাম সরাতে মাসের পর মাস লাগে, আর তার মধ্যে কোনো Subdomain এ HTTP চালানো যাবে না।
              </ContentParagraph>
              <ContentParagraph>
                Browser গুলোও এখন নিজে থেকে এই দিকে হাঁটছে। Google এর ঘোষণা অনুযায়ী Chrome
                154, অক্টোবর ২০২৬ থেকে Always Use Secure Connections নামের Setting টা সবার জন্য
                নিজে থেকে চালু রাখে। তখন Chrome যেকোনো Public সাইটে আগে HTTPS চেষ্টা করে, আর
                HTTPS না পেলে খোলা পাতায় যাওয়ার আগে ব্যবহারকারীর অনুমতি চায়। তবুও নিজের
                Server এ Redirect আর HSTS রাখুন। সব ব্যবহারকারী Chrome চালান না, আর Browser এর
                অভ্যাসের উপর নিজের নিরাপত্তা ছেড়ে দেওয়া ঠিক নয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>তৃতীয় ধাপ, Mixed Content দূর করা।</strong> পাতাটা HTTPS এ এলো, কিন্তু
                ভেতরে কোথাও লেখা আছে{" "}
                <code>{'<script src="http://cdn.islandtours.example/map.js">'}</code>। পাতাটা
                তালাবদ্ধ, অথচ Script টা খোলা পথে আসবে, আর মাঝের লোকটা সেটা বদলে দিলে পুরো পাতা
                তার হাতে। Browser তাই এমন Script, Style আর iframe সরাসরি আটকে দেয়, আর Console এ
                Mixed Content এর সতর্কবার্তা লেখে। ছবি আর ভিডিও এর বেলায় Browser নিজে https এ
                বদলে চেষ্টা করে, না পেলে আটকায়। সমাধান সোজা: পাতার ভেতরের সব ঠিকানা
                <code> https://</code> দিয়ে লিখুন, অথবা নিজের সাইটের জিনিস হলে{" "}
                <code>/map.js</code> এর মতো শুধু Path দিন। Headers লেসনের CSP তে{" "}
                <code>upgrade-insecure-requests</code> নামের একটা নির্দেশও আছে, যেটা পাতার সব
                http ঠিকানাকে নিজে থেকে https বানিয়ে নেয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "localhost এ HSTS এর পরীক্ষা, আর .dev নামের ফাঁদ",
          content: (
            <p>
              Lab এ HSTS এর মেয়াদ ইচ্ছা করে পাঁচ মিনিট রাখা হয়েছে। নিজের যন্ত্রে বড় max-age
              দিয়ে পরীক্ষা করলে পরের অনেকদিন Browser সেই নাম আর Port এ Plain HTTP খুলতে
              দেবে না। আরেকটা ফাঁদ: <code>.dev</code> আর <code>.app</code> এর মতো কিছু TLD
              পুরোটাই Preload তালিকায়। এমন নামে কেনা Domain কোনোদিনও Plain HTTP তে খুলবে না,
              প্রথম দিন থেকেই HTTPS লাগবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "tls-termination",
      subHeader: { index: "013", title: "TLS Termination" },
      title: <SectionTitle>TLS কোথায় শেষ হয়, আর তারপরের পথটা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালাবদ্ধ সুড়ঙ্গের দুইটা মাথা থাকে। এক মাথা পর্যটকের Browser, এটা সহজ। অন্য
                মাথাটা কোথায়? অনেকে ভাবেন সুড়ঙ্গ সোজা App এর Code পর্যন্ত যায়। বেশিরভাগ
                সময় তা নয়। Port Socket লেসনে দেখেছেন, Island Tours এর App চলে Port 3000 এ,
                আর তার সামনে বসে Caddy, একটা Reverse Proxy। তালাটা খোলে Caddy। যেখানে TLS এর
                সুড়ঙ্গ শেষ হয় আর তালা খোলা হয়, তাকে বলে <strong>TLS Termination</strong>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TerminationDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম প্রশ্ন, Caddy তালা খুলে App কে সাধারণ HTTP তে দিচ্ছে, এটা কি নিরাপদ? এখানে
                হ্যাঁ, কারণ সেই পথটা <code>127.0.0.1</code>। Port Socket লেসনের Bind Address
                মনে করুন। Loopback এর Byte যন্ত্র ছেড়ে বাইরে যায় না, কোনো তারে ওঠে না, কোনো
                Router দেখে না। আর App যেহেতু শুধু 127.0.0.1 এ শোনে, বাইরের কেউ সরাসরি Port
                3000 এ পৌঁছাতেই পারে না। সব আসতে হয় Caddy এর দরজা দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় প্রশ্ন, App তাহলে জানবে কীভাবে যে আসল Request টা HTTPS এ এসেছিল? App
                এর চোখে তো সবই সাধারণ HTTP। এটা জানা দরকার, কারণ App নিজের Link বানানোর সময়
                https লিখবে কি না, আর Cookie তে Secure চিহ্ন দেবে কি না, তা এর উপর নির্ভর
                করে। Caddy তাই প্রতিটা Request এর সাথে কয়েকটা Header জুড়ে দেয়, নিজে থেকেই:{" "}
                <code>X-Forwarded-Proto: https</code>, <code>X-Forwarded-For</code> এ
                পর্যটকের IP, আর <code>X-Forwarded-Host</code>। Headers লেসনে এদের দেখেছেন।
                মনে রাখার নিয়ম একটাই, App এই Header গুলো বিশ্বাস করবে শুধু তখন, যখন Request টা
                নিজের চেনা Proxy থেকে এসেছে। বাইরের কেউ নিজে এই Header লিখে পাঠাতে পারে, Caddy
                তাই বাইরে থেকে আসা মানগুলো ফেলে দিয়ে নিজেরটা বসায়।
              </ContentParagraph>
              <ContentParagraph>
                এবার পথটা যদি একটা যন্ত্রে না থেমে Network পার হয়? সামনে Cloudflare বসালে
                বা একটা Load Balancer বসালে ঠিক এটা ঘটে। প্রথম সুড়ঙ্গ শেষ হয় Cloudflare এ,
                সেখান থেকে আপনার Server পর্যন্ত আরেকটা পথ, আর সেই পথ Internet দিয়ে যায়। Module
                04 এর Cloudflare লেসনের SSL/TLS Mode গুলো আসলে এই দ্বিতীয় পথের প্রশ্ন:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Flexible:</strong> দ্বিতীয় পথটা Plain HTTP। Browser এ তালা জ্বলে,
                  পর্যটক নিশ্চিন্ত, অথচ পথের অর্ধেক খোলা। আর আপনার Server যদি নিজে HTTPS এ
                  Redirect করে, Cloudflare HTTP তে আসে, Server আবার HTTPS এ পাঠায়, চক্র চলতেই
                  থাকে। এটাই ERR_TOO_MANY_REDIRECTS এর সবচেয়ে চেনা কারণ।
                </ListItem>
                <ListItem>
                  <strong>Full:</strong> দ্বিতীয় পথেও TLS, কিন্তু Cloudflare Server এর
                  Certificate যাচাই করে না। পড়া ঠেকায়, নকল সাজা ঠেকায় না।
                </ListItem>
                <ListItem>
                  <strong>Full (strict):</strong> দ্বিতীয় পথেও TLS, আর Certificate যাচাই
                  সহ। লক্ষ্য সবসময় এটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর থেকে একটা নিয়ম বেরিয়ে আসে, যেটা Server সাজানোর সময় সবচেয়ে কাজে লাগবে।
                Certificate আর তার Private Key রাখতে হয় ঠিক সেখানে, যেখানে তালা খোলা হয়।
                Caddy তালা খুললে Caddy এর কাছে। Cloudflare খুললে আপনার নামের একটা Certificate
                Cloudflare এর কাছে, আর Full (strict) এ আরেকটা আপনার Server এ। কোনো Load
                Balancer খুললে Certificate টা তার কাছে Upload করতে হয়। আর যদি Load Balancer
                শুধু Layer 4 এ কাজ করে, মানে তালা না খুলেই Byte গুলো পার করে দেয়, OSI লেসনের সেই
                তফাত, তাহলে সে Path বা Header দেখে Request ভাগ করতে পারে না, কারণ সে ভেতরের
                কিছুই পড়তে পারে না। এর নাম TLS Passthrough।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Caddy এর সাজ দেখতে প্রায় এরকম। এটা শেখানোর জন্য একটা নমুনা,
                এই লেসনের যন্ত্রে Caddy চালানো হয়নি। Domain আর App এর ঠিকানা সরাসরি লেখা নেই,
                Caddy সেগুলো Environment Variable থেকে পড়ে, <code>{"{$NAME}"}</code> লেখাটা তার
                নিয়ম। ফলে Domain বদলাতে হলে File এ হাত দিতে হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile",
          code: `# নমুনা। চালানোর আগে Environment এ দিন:
#   SITE_DOMAIN=islandtours.example
#   APP_UPSTREAM=127.0.0.1:3000

{$SITE_DOMAIN} {
	# TLS: Certificate আনা, নবায়ন, TLS 1.2 থেকে 1.3, Port 80 থেকে 308, সব নিজে থেকে
	reverse_proxy {$APP_UPSTREAM}
	header Strict-Transport-Security "max-age=31536000; includeSubDomains"
}

www.{$SITE_DOMAIN} {
	redir https://{$SITE_DOMAIN}{uri} permanent
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Database এর পথও একই প্রশ্ন",
          content: (
            <p>
              Island Tours এর API, PostgreSQL আর Redis এখন একই VPS এ Docker এর ভেতরে, তাদের
              মাঝের পথ যন্ত্র ছেড়ে বাইরে যায় না। কোনোদিন Database আলাদা একটা Server এ গেলে
              সেই পথও Network পার হবে, তখন সেখানেও TLS লাগবে। PostgreSQL এ এর জন্য{" "}
              <code>sslmode=verify-full</code>, যেখানে শুধু তালা নয়, Certificate এর নামও
              যাচাই হয়, ঠিক Full (strict) এর মতো। নিয়মটা সব জায়গায় এক: যে পথ Network পার
              হয়, সেখানে তালা।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "tls-errors",
      subHeader: { index: "014", title: "Reading the Errors" },
      title: <SectionTitle>তালা ভাঙলে: Error গুলো পড়তে শেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একদিন না একদিন আপনার কোনো সাইটে Browser একটা লাল পাতা দেখাবে, Your connection
                is not private। ভয় পাওয়ার কিছু নেই। পাতার নিচে একটা ছোট Code লেখা থাকে, আর
                সেই Code ঠিক বলে দেয় তিনটা প্রতিশ্রুতির কোনটা রাখা যায়নি। নিচের টেবিলে
                সবচেয়ে চেনা Error গুলো, Browser আর curl দুইটার ভাষায়। curl এর কয়েকটা লাইন এই
                লেসনের Lab থেকে আসল Output।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Browser এ", "curl এ", "আসল মানে", "প্রথমে কী দেখবেন"],
          rows: [
            [
              mono("NET::ERR_CERT_DATE_INVALID"),
              "certificate has expired",
              "Certificate এর মেয়াদ শেষ, অথবা যন্ত্রের ঘড়ি ভুল",
              "যন্ত্রের date, তারপর Certificate এর তারিখ, আর নবায়ন কেন হয়নি",
            ],
            [
              mono("NET::ERR_CERT_COMMON_NAME_INVALID"),
              "no alternative certificate subject name matches target",
              "যে নামে ঢুকলেন সেটা Certificate এর নামের তালিকায় নেই",
              "www বা কোনো Subdomain বাদ পড়েছে কি না",
            ],
            [
              mono("NET::ERR_CERT_AUTHORITY_INVALID"),
              "self signed certificate, unable to get local issuer certificate",
              "সই করা প্রতিষ্ঠানকে Browser চেনে না",
              "Self-signed কি না, মাঝের Certificate পাঠানো হচ্ছে কি না",
            ],
            [
              mono("ERR_SSL_VERSION_OR_CIPHER_MISMATCH"),
              "no protocols available, alert protocol version",
              "দুই পাশের কোনো Version বা Suite মেলেনি",
              "openssl s_client -tls1_2 আর -tls1_3 দিয়ে আলাদা চেষ্টা",
            ],
            [
              mono("ERR_SSL_PROTOCOL_ERROR"),
              "Empty reply from server, wrong version number",
              "TLS এর Port এ HTTP, বা HTTP এর Port এ TLS বলা হচ্ছে",
              "Port নম্বর, আর কে আসলে তালা খোলে",
            ],
            [
              mono("ERR_TOO_MANY_REDIRECTS"),
              "Maximum redirects followed",
              "Redirect এর চক্র, প্রায়ই Flexible Mode আর HTTPS Redirect একসাথে",
              "Cloudflare এর Mode, আর App X-Forwarded-Proto পড়ে কি না",
            ],
            [
              mono("ssl/tls alert handshake failure"),
              "SSL alert number 40",
              "Server Handshake এ রাজি হলো না, প্রায়ই SNI নেই বা ভুল",
              "-servername দেওয়া হয়েছে কি না, নামটা ঠিক কি না",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "errors-from-the-lab.sh",
          code: `# নিজের বানানো Certificate, যাকে কোনো CA সই করেনি
curl -sS https://localhost:47672/
# curl: (60) SSL certificate problem: self signed certificate

# Certificate টা localhost নামের, অথচ ঢোকা হলো IP দিয়ে
curl -sS --cacert localhost-cert.pem https://127.0.0.1:47672/
# curl: (60) SSL: no alternative certificate subject name matches target ipv4 address '127.0.0.1'

# HTTPS এর Port এ Plain HTTP
curl -sS http://localhost:47672/
# curl: (52) Empty reply from server

# Plain HTTP এর Port এ HTTPS
curl -sS https://localhost:47674/
# curl: (35) LibreSSL/3.3.6: error:1404B42E:SSL routines:ST_CONNECT:tlsv1 alert protocol version

# Node এর fetch ও একই কথা বলে, নিজের ভাষায়
node -e 'fetch("https://localhost:47672/").catch(e => console.log(e.cause.code))'
# DEPTH_ZERO_SELF_SIGNED_CERT`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                টেবিলের সব কিছু মুখস্থ করতে হবে না। যেকোনো TLS সমস্যায় একই পাঁচটা ধাপ ধরে
                এগোন, প্রায় সবসময় তৃতীয় বা চতুর্থ ধাপে উত্তর পেয়ে যাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Error এর Code টা হুবহু পড়ুন",
              description:
                "লাল পাতার বড় লেখা সব Error এ একই। নিচের ছোট Code টাই আসল খবর, যেমন NET::ERR_CERT_DATE_INVALID। সেটা টুকে নিন।",
            },
            {
              title: "নিজের যন্ত্রের ঘড়ি দেখুন",
              description:
                "শুধু একজন ব্যবহারকারীর সব সাইটে সমস্যা হলে প্রায়ই তাঁর ঘড়ি ভুল। ব্যাটারি ফুরিয়ে যাওয়া পুরনো ফোন কখনো কখনো বহু বছর পেছনের তারিখে চালু হয়, তখন প্রতিটা Certificate তার চোখে এখনো শুরুই হয়নি।",
            },
            {
              title: "curl -v দিয়ে আবার চেষ্টা",
              description:
                "Browser এর বাইরে একই ঠিকানা। curl এর Output এ কোন ধাপে থামল দেখা যায়: TCP এ, Handshake এ, নাকি Certificate যাচাইয়ে।",
            },
            {
              title: "openssl s_client দিয়ে Server এর দিকটা",
              description:
                "সঠিক -servername দিয়ে চালান। Version, Suite, Certificate এর নাম আর তারিখ, আর Verification এর ফলাফল একসাথে আসে। নাম, তারিখ আর সই করা প্রতিষ্ঠানের খুঁটিনাটি পড়ার নিয়ম পরের লেসনে।",
            },
            {
              title: "মাঝের স্তরগুলো দেখুন",
              description:
                "কে তালা খোলে? Caddy, Cloudflare, Load Balancer? তার Setting আর তার Certificate দেখুন। Flexible Mode, ভুল Port, আর পুরনো Certificate রেখে দেওয়া একটা Proxy, এই তিনটাই সবচেয়ে বেশি দেখা যায়।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বাইপাস করার বোতামের লোভ",
          content: (
            <p>
              curl এ <code>-k</code> বা Node এ <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code> দিলে
              সব Error চুপ হয়ে যায়, আর Code এ এমন একটা লাইন রেখে দেওয়া Production এর সবচেয়ে
              বিপজ্জনক অভ্যাসগুলোর একটা। এটা Authentication পুরোপুরি বন্ধ করে দেয়, মানে
              তৃতীয় প্রতিশ্রুতিটা আর নেই, আর মাঝের যে কেউ নকল Server সাজতে পারে। নিজের
              যন্ত্রে নিজের বানানো Certificate এর জন্য সঠিক উপায় হলো সেটা বিশ্বাস করতে বলা,
              যেমন Lab এ <code>--cacert</code> দিয়ে করা হয়েছে। যাচাই বন্ধ করা কখনো নয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, ক্যাফের Wi-Fi তে একটা বুকিং</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর সেই পর্যটক, কক্সবাজারের ক্যাফে, অচেনা Wi-Fi। Island Tours এর দল
                ঠিক এই মানুষটার কথা ভেবে TLS নিয়ে ছয়টা সিদ্ধান্ত নিয়েছে। প্রতিটা সিদ্ধান্তের
                পাশে লেখা আছে এই লেসনের কোন অংশ থেকে সেটা এসেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Port 80 শুধু দরজা দেখায়।</strong> Caddy Port 80 এ শোনে, কিন্তু
                  একটাও পাতা দেখায় না, সব Request কে 308 দিয়ে HTTPS এ পাঠায়। এটা Caddy নিজে
                  থেকেই করে, দলকে লিখতে হয়নি।
                </ListItem>
                <ListItem>
                  <strong>শুধু TLS 1.2 আর 1.3।</strong> Caddy এর Default, বদলানো হয়নি। কোনো
                  পুরনো Version এর অনুরোধ এলে Handshake এখানেই থামে।
                </ListItem>
                <ListItem>
                  <strong>HSTS এক বছরের, ধাপে ধাপে চালু করা।</strong> প্রথম সপ্তাহে
                  max-age=300, তারপর এক সপ্তাহ, এক মাস, শেষে এক বছর সহ includeSubDomains।
                  তার আগে www, api, blog, admin আর updates, প্রতিটা Subdomain এ HTTPS আছে কি না
                  একটা একটা করে দেখা হয়েছে। Preload এ এখনো জমা দেওয়া হয়নি। দল নিশ্চিত হতে
                  চায় কোনো পুরনো Partner এর যন্ত্রের জন্য কোনোদিন Plain HTTP লাগবে না, কারণ
                  Preload ফেরানো কঠিন।
                </ListItem>
                <ListItem>
                  <strong>App বাইরে থেকে অদৃশ্য।</strong> App শুধু 127.0.0.1:3000 এ শোনে।
                  X-Forwarded-Proto সে বিশ্বাস করে শুধু Caddy থেকে আসা Request এ, আর তার ভিত্তিতে
                  Session Cookie তে Secure বসায়, Cookie লেসনে যেমন দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>0-RTT বন্ধ।</strong> বুকিং আর Payment দুইটাই POST, আর একটা Replay
                  মানে একই আসন দুইবার বুক হওয়া। কয়েক মিলিসেকেন্ডের জন্য এই ঝুঁকি নেওয়ার
                  মানে হয় না।
                </ListItem>
                <ListItem>
                  <strong>বাইরের প্রতিটা ডাকও HTTPS, যাচাই সহ।</strong> Payment Gateway আর
                  Email সেবার সাথে App কথা বলে HTTPS এ, আর Code এর কোথাও যাচাই বন্ধ করার কোনো
                  লাইন নেই। Code Review তে <code>rejectUnauthorized: false</code> দেখলে সেই
                  Pull Request সাথে সাথে ফেরত যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফলাফলটা ক্যাফের মালিকের চোখ দিয়ে দেখুন। তিনি জানেন কেউ একজন 192.168.1.20 থেকে
                103.94.135.2 এর Port 443 এ কথা বলছেন, SNI থেকে জানেন নামটা islandtours.example,
                আর জানেন কয়েকশো Byte গেছে, কয়েক হাজার এসেছে। তিনি জানেন না কোন ট্যুর, কোন
                তারিখ, কত টাকা, কোন Password। আর বদলাতে চাইলে Connection টা ভেঙে যাবে, পর্যটক
                একটা Error দেখবেন, কিন্তু ভুল কোনো তথ্য দেখবেন না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা HTTPS Request, Address Bar থেকে উত্তর পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ক্যাফের Wi-Fi তে বসে Address Bar এ শুধু লিখলেন islandtours.example/tours/saint-martin।
              তারপর কী কী ঘটে, এই লেসনের চোখ দিয়ে, শুরু থেকে শেষ। পুরো যাত্রার সব স্তর
                একসাথে জোড়া লাগানো হবে দুই লেসন পরে, Full HTTPS Journey তে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Browser HTTPS বেছে নেয়",
              description:
                "Scheme লেখা হয়নি। Browser তার HSTS খাতায় islandtours.example খুঁজে পায়, মেয়াদ আছে, তাই সরাসরি https আর Port 443। Port 80 এ একটাও Byte যায় না, তাই SSL Stripping এর সুযোগই নেই।",
            },
            {
              title: "DNS আর TCP",
              description:
                "DNS থেকে 103.94.135.2, তারপর TCP Handshake, ফোনের 192.168.1.20:51514 থেকে 103.94.135.2:443। ক্যাফের Router NAT করে Source বদলে দেয় 203.0.113.25:62001। এখনো কোনো তালা নেই।",
            },
            {
              title: "ClientHello",
              description:
                "ফোন জানায় TLS 1.3 বোঝে, কোন Suite চলবে, পাঠায় নিজের Key Share, SNI তে islandtours.example আর ALPN এ h2। এই বার্তাটা খোলা, ক্যাফের মালিক নামটা পড়তে পারেন।",
            },
            {
              title: "ServerHello, আর দুই পাশে একই চাবি",
              description:
                "Caddy একটা Suite বেছে নিজের Key Share পাঠায়। দুই পাশ আলাদা হিসাব করে একই গোপন সংখ্যা পায়, তা থেকে Symmetric চাবি বানায়। ক্যাফের মালিক দুইটা Key Share দেখেছেন, চাবি বানাতে পারেন না।",
            },
            {
              title: "Certificate আর সই, তালার ভেতরে",
              description:
                "Caddy পাঠায় islandtours.example এর Certificate, তারপর নিজের Private Key দিয়ে পুরো কথোপকথনের উপর একটা সই। ফোন Certificate যাচাই করে আর সই মেলায়। এই প্রথম ফোন নিশ্চিত, ওপাশে আসল Island Tours।",
            },
            {
              title: "Finished, তারপর GET",
              description:
                "দুই পাশের হিসাব মিলল, কেউ Handshake এ হাত দেয়নি। ফোন সাথে সাথে পাঠায় GET /tours/saint-martin, Cookie সহ, HTTP/2 তে, তালার ভেতরে। পুরো TLS অংশে খরচ হলো এক Round Trip।",
            },
            {
              title: "Caddy তালা খোলে, App কে দেয়",
              description:
                "Caddy Request টা পড়ে, X-Forwarded-Proto: https আর X-Forwarded-For: 203.0.113.25 জুড়ে দেয়, আর 127.0.0.1:3000 এ App কে সাধারণ HTTP তে দেয়। এই পথ যন্ত্রের বাইরে যায় না।",
            },
            {
              title: "উত্তর, তালাবদ্ধ হয়ে ফেরে",
              description:
                "App 200 আর পাতাটা দেয়। Caddy সেটা তালাবদ্ধ করে পাঠায়, সাথে HSTS Header, যাতে খাতার মেয়াদ আবার এক বছর হয়। প্রতিটা অংশের সাথে একটা Tag, পথে একটা Byte বদলালেও ফোন ধরে ফেলবে।",
            },
            {
              title: "পরের বারের জন্য Ticket",
              description:
                "Caddy একটা Session Ticket ও দিয়ে রাখে। Connection খোলা থাকে, পরের পাতাগুলো একই সুড়ঙ্গে যায়। কাল পর্যটক ফিরে এলে Ticket দেখিয়ে Certificate এর পুরো পর্ব ছাড়াই ঢুকবেন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 17 */
    {
      id: "resources",
      subHeader: { index: "017", title: "Best Resources" },
      title: <SectionTitle>আরও গভীরে যেতে চাইলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>নিচের Lab টা আগে করুন।</strong> মাঝের Program টা দিয়ে নিজের চোখে
                Password পড়া, তারপর HTTPS এ সেটা না পারা, আর একটা Byte বদলালে Connection
                ভেঙে যাওয়া দেখা, কোনো ভিডিও এর চেয়ে বেশি শেখায়।
              </ListItem>
              <ListItem>
                <strong>The Illustrated TLS 1.3 Connection</strong>, একটা আসল Handshake এর
                প্রতিটা Byte রঙ দিয়ে ভাগ করে ব্যাখ্যা করা। এই লেসনের সপ্তম সেকশন পড়ার পরে
                দেখুন, প্রতিটা বার্তা চিনতে পারবেন।{" "}
                <a
                  href="https://tls13.xargs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  tls13.xargs.org
                </a>
              </ListItem>
              <ListItem>
                <strong>Cloudflare Learning Center, TLS Handshake</strong>, সহজ ভাষায় ছবি
                সহ, TLS 1.2 আর 1.3 পাশাপাশি।{" "}
                <a
                  href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  cloudflare.com/learning/ssl
                </a>
              </ListItem>
              <ListItem>
                <strong>Mozilla SSL Configuration Generator</strong>, Nginx, Apache, HAProxy
                বা অন্য Server এর জন্য সঠিক TLS সাজ বানিয়ে দেয়। Intermediate বেছে নিন।{" "}
                <a
                  href="https://ssl-config.mozilla.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  ssl-config.mozilla.org
                </a>
              </ListItem>
              <ListItem>
                <strong>SSL Labs Server Test</strong>, নিজের Domain দিলে Version, Suite,
                Certificate আর HSTS সব পরীক্ষা করে একটা গ্রেড দেয়। নিজের সাইট A না পেলে
                রিপোর্টটা পড়ুন, প্রতিটা লাইন এখন আপনার চেনা।{" "}
                <a
                  href="https://www.ssllabs.com/ssltest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  ssllabs.com/ssltest
                </a>
              </ListItem>
              <ListItem>
                <strong>HSTS Preload</strong>, শর্তগুলো, নিজের Domain এর অবস্থা দেখা, আর জমা
                দেওয়ার পাতা।{" "}
                <a
                  href="https://hstspreload.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  hstspreload.org
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 8446 আর RFC 6797</strong>, TLS 1.3 আর HSTS এর মূল নিয়মের বই।
                পুরোটা পড়ার দরকার নেই, কিন্তু 0-RTT এর Replay নিয়ে TLS 1.3 এর অংশটা একবার
                পড়ে দেখুন।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc8446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc8446
                </a>
                {" আর "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc6797"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc6797
                </a>
              </ListItem>
              <ListItem>
                <strong>Caddy এর Automatic HTTPS নথি</strong>, Island Tours এর Caddy নিজে
                থেকে যা যা করে তার পূর্ণ তালিকা।{" "}
                <a
                  href="https://caddyserver.com/docs/automatic-https"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  caddyserver.com/docs/automatic-https
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
                  Plain HTTP একটা খোলা পোস্টকার্ড। পথের প্রতিটা হাত সেটা পড়তে পারে, বদলাতে
                  পারে, আর নকল Server সেজে উত্তর দিতে পারে।
                </ListItem>
                <ListItem>
                  TLS তিনটা প্রতিশ্রুতি দেয়: Confidentiality, Integrity, Authentication।
                  যন্ত্র তিনটা: Encryption, AEAD এর Tag, আর Certificate সহ সই। HTTPS মানে একই
                  HTTP, TLS এর সুড়ঙ্গের ভেতরে, সাধারণত Port 443 এ।
                </ListItem>
                <ListItem>
                  SSL পুরনো নাম, ভাঙা আর নিষিদ্ধ। আজ চলে শুধু TLS 1.2 আর TLS 1.3। নামটা টিকে
                  আছে SSL Certificate আর Setting এর নামে।
                </ListItem>
                <ListItem>
                  Symmetric তালা দ্রুত, কিন্তু চাবি ভাগ করা কঠিন। Asymmetric ধীর, কিন্তু চাবি
                  ভাগ করতে হয় না। TLS শুরুতে Asymmetric দিয়ে একমত হয় আর পরিচয় প্রমাণ করে,
                  তারপর সব Symmetric এ।
                </ListItem>
                <ListItem>
                  ECDHE এ দুই পাশ প্রকাশ্য Key Share বিনিময় করে একই গোপন সংখ্যায় পৌঁছায়, যা
                  কখনো তারে যায় না। প্রতিবার নতুন, তাই Forward Secrecy।
                </ListItem>
                <ListItem>
                  TLS 1.3 এর Handshake এক Round Trip: ClientHello আর ServerHello খোলা, তারপর
                  Certificate, CertificateVerify আর Finished তালাবদ্ধ। CertificateVerify ই
                  প্রমাণ করে Server এর কাছে Private Key আছে।
                </ListItem>
                <ListItem>
                  TLS এর আসল দাম Round Trip, CPU নয়। Resumption, 0-RTT (শুধু নিরাপদ GET এর
                  জন্য), Keep-Alive আর QUIC এই দাম কমায়।
                </ListItem>
                <ListItem>
                  HTTPS লুকায় Path, Header, Cookie, Body আর Status। লুকায় না IP, Port, SNI এর
                  নাম, DoH ছাড়া DNS, আর আকার ও সময়। তালা মানে সঠিক মালিক, সৎ মালিক নয়।
                </ListItem>
                <ListItem>
                  Port 80 শুধু 308 দিয়ে Redirect করে, HSTS প্রথম বারের পরের ফাঁক বন্ধ করে,
                  Preload প্রথম বারেরটাও। পাতার ভেতরের সব ঠিকানা https, নইলে Mixed Content।
                </ListItem>
                <ListItem>
                  তালা যেখানে খোলে, Certificate আর Private Key সেখানে। Network পার হওয়া প্রতিটা
                  পথে আবার তালা, Cloudflare এ Full (strict)। যাচাই বন্ধ করা কখনো সমাধান নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর: Certificates, Public Key, and Private Key",
          content: (
            <p>
              এই পুরো লেসনে একটা প্রশ্ন ইচ্ছা করে খোলা রেখেছি। ফোন Certificate টা যাচাই করল,
              ঠিক আছে, কিন্তু কীভাবে? Certificate তো একটা কাগজ, যে কেউ একটা বানাতে পারে, Lab এ
              আপনি নিজেই এক লাইনে একটা বানিয়েছেন, আর curl সেটা মানেনি। তাহলে Island Tours
              এর Certificate কে কেন মানল? কে সেটাতে সই করেছিল, ফোন সেই সইকারীকে কেন চেনে,
              Certificate এর ভেতরে আসলে কী কী লেখা থাকে, Let&apos;s Encrypt কীভাবে বিনা খরচে একটা
              দেয়, আর Private Key টা কোথায় কীভাবে রাখতে হয়, এই সবকিছু পরের লেসনে।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Plain HTTP", "খোলা লেখা, পথের যে কেউ পড়তে, বদলাতে আর নকল সাজতে পারে"],
      ["MITM", "Man in the Middle, পথের মাঝখানে বসে থাকা আক্রমণকারী"],
      ["Confidentiality", "শুধু দুই পাশ পড়তে পারে। যন্ত্র Encryption"],
      ["Integrity", "একটা Byte বদলালেও ধরা পড়ে। যন্ত্র AEAD এর Tag"],
      ["Authentication", "ওপাশে সত্যিই নামের মালিক। যন্ত্র Certificate আর সই"],
      ["TLS", "এই তিন প্রতিশ্রুতির নিয়মের বই। আজ 1.2 আর 1.3, SSL পুরনো নাম"],
      ["HTTPS", "TLS এর ভেতরে HTTP, সাধারণত Port 443"],
      ["Symmetric", "এক চাবি লাগায় আর খোলে। AES, ChaCha20। দ্রুত"],
      ["Asymmetric", "Public Key বিলানো যায়, Private Key লুকানো। ধীর, শুধু শুরুতে"],
      ["ECDHE", "সবার সামনে Key Share বিনিময়, গোপন সংখ্যা তারে যায় না, প্রতিবার নতুন"],
      ["Forward Secrecy", "পরে Private Key চুরি হলেও পুরনো রেকর্ড খোলে না"],
      ["SNI", "ClientHello তে খোলা লেখা Server এর নাম। ECH এটা লুকায়"],
      ["ALPN", "তালার ভেতরে কোন HTTP চলবে, h2 নাকি http/1.1"],
      ["CertificateVerify", "Private Key দিয়ে কথোপকথনের উপর সই, মালিকানার প্রমাণ"],
      ["1-RTT, 0-RTT", "TLS 1.3 এর এক Round Trip, ফিরে এলে Early Data, Replay এর ঝুঁকি সহ"],
      ["Cipher Suite", "কোন তালা আর কোন Hash, যেমন TLS_AES_128_GCM_SHA256"],
      ["HSTS", "Browser কে বলা এই নামে এত সময় শুধু HTTPS, Preload এ প্রথম বারেও"],
      ["Mixed Content", "HTTPS পাতার ভেতরে http ঠিকানা, Browser আটকায়"],
      ["TLS Termination", "যেখানে তালা খোলা হয়। Certificate আর Private Key সেখানেই থাকে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "ক্যাফের Wi-Fi তে একজন পর্যটক Plain HTTP তে Login করলেন। Router এর মালিক কী কী করতে পারেন?",
        options: [
          {
            key: "A",
            text: "কিছুই না, কারণ TCP Byte গুলো ঠিক ক্রমে পৌঁছে দেয়",
            isCorrect: false,
            explanation:
              "TCP শুধু ক্রম আর পৌঁছানো নিশ্চিত করে। কে পড়ল বা বদলাল, তা নিয়ে TCP এর কোনো কাজ নেই।",
          },
          {
            key: "B",
            text: "শুধু কোন সাইটে গেলেন সেটা দেখতে পারেন, ভেতরের কিছু নয়",
            isCorrect: false,
            explanation:
              "এটা HTTPS এর অবস্থা। Plain HTTP তে ভেতরের সবকিছুই খোলা।",
          },
          {
            key: "C",
            text: "Password সহ পুরো Request পড়তে পারেন, উত্তর বদলে দিতে পারেন, আর ফোন টের পাবে না",
            isCorrect: true,
            explanation:
              "ঠিক। Lab এর মাঝের Program টা ঠিক এটাই করেছে: Password ছাপিয়েছে আর টাকার ঠিকানা বদলে দিয়েছে।",
          },
          {
            key: "D",
            text: "শুধু Password পড়তে পারেন, কিন্তু কিছু বদলাতে পারেন না",
            isCorrect: false,
            explanation:
              "Plain HTTP তে বদল ধরার কোনো উপায় নেই, তাই বদলানোও যায়। Integrity আসে শুধু TLS থেকে।",
          },
        ],
      },
      {
        id: 2,
        text: "HTTPS চালু থাকলেও পথের মানুষ কোনটা জানতে পারেন?",
        options: [
          {
            key: "A",
            text: "কোন Path খোলা হলো, যেমন /tours/saint-martin",
            isCorrect: false,
            explanation: "Path HTTP এর অংশ, তাই তালার ভেতরে থাকে।",
          },
          {
            key: "B",
            text: "Session Cookie এর মান",
            isCorrect: false,
            explanation: "Cookie একটা Header, আর সব Header তালার ভেতরে।",
          },
          {
            key: "C",
            text: "Server এর নাম, কারণ সেটা ClientHello এর SNI তে খোলা থাকে",
            isCorrect: true,
            explanation:
              "ঠিক। চাবি তৈরির আগেই Server কে বুঝতে হয় কোন সাইটের Certificate দেখাবে, তাই নামটা খোলা যায়। ECH থাকলে এটাও লুকানো যায়।",
          },
          {
            key: "D",
            text: "উত্তরের Status Code",
            isCorrect: false,
            explanation: "Status Line ও HTTP এর অংশ, তালার ভেতরে।",
          },
        ],
      },
      {
        id: 3,
        text: "Handshake এর পরে আসল Data কেন Asymmetric নয়, Symmetric তালায় যায়?",
        options: [
          {
            key: "A",
            text: "Symmetric তালা অনেক বেশি দ্রুত, আর চাবিটা ততক্ষণে দুই পাশেই তৈরি হয়ে গেছে",
            isCorrect: true,
            explanation:
              "ঠিক। Asymmetric এর কাজ শুধু শুরুতে একমত হওয়া আর পরিচয় প্রমাণ করা। বিশাল Data র জন্য সেটা হাজার গুণ ধীর।",
          },
          {
            key: "B",
            text: "Symmetric তালা বেশি গোপন, Asymmetric ভাঙা যায়",
            isCorrect: false,
            explanation:
              "দুইটাই ঠিকভাবে ব্যবহার করলে শক্ত। কারণটা গতি, গোপনীয়তার তফাত নয়।",
          },
          {
            key: "C",
            text: "Browser Asymmetric তালা চালাতে পারে না",
            isCorrect: false,
            explanation: "পারে, Handshake এর সময় ঠিক সেটাই চালায়।",
          },
          {
            key: "D",
            text: "Server এর Private Key প্রতিটা Request এ পাঠাতে হয় বলে",
            isCorrect: false,
            explanation: "Private Key কখনো কোথাও পাঠানো হয় না। সেটা শুধু Server এর কাছে থাকে।",
          },
        ],
      },
      {
        id: 4,
        text: "ECDHE Key Exchange এ তারের উপর দিয়ে আসলে কী যায়?",
        options: [
          {
            key: "A",
            text: "শেষের গোপন সংখ্যাটা, তবে তালাবদ্ধ করে",
            isCorrect: false,
            explanation: "শেষের গোপন সংখ্যা কখনো তারে যায় না, দুই পাশ আলাদা হিসাবে তা পায়।",
          },
          {
            key: "B",
            text: "শুধু দুই পাশের প্রকাশ্য Key Share, যা দেখে গোপন সংখ্যা হিসাব করা যায় না",
            isCorrect: true,
            explanation:
              "ঠিক। Lab এর A আর B এর মতো। ক্যাফে দুইটাই দেখে, কিন্তু আসল মাপের সংখ্যায় গোপনটা বের করতে পারে না।",
          },
          {
            key: "C",
            text: "দুই পাশের নিজের নিজের গোপন সংখ্যা",
            isCorrect: false,
            explanation: "সেগুলো পাঠালে পুরো কৌশলটাই অর্থহীন হয়ে যেত।",
          },
          {
            key: "D",
            text: "Server এর Private Key",
            isCorrect: false,
            explanation: "Private Key কখনো Server ছাড়ে না। ECDHE তে সেটা শুধু সই করতে লাগে।",
          },
        ],
      },
      {
        id: 5,
        text: "কেউ আজ তালাবদ্ধ Traffic রেকর্ড করে রাখল, এক বছর পরে Server এর Private Key চুরি করল। ECDHE থাকলে কী হবে?",
        options: [
          {
            key: "A",
            text: "সব পুরনো রেকর্ড খুলে যাবে",
            isCorrect: false,
            explanation: "এটা পুরনো RSA পদ্ধতির বিপদ, যেটা TLS 1.3 বাদ দিয়েছে।",
          },
          {
            key: "B",
            text: "পুরনো রেকর্ড খুলবে না, কারণ চাবি বানানো হয়েছিল ক্ষণস্থায়ী গোপন সংখ্যা থেকে যা মুছে গেছে",
            isCorrect: true,
            explanation:
              "ঠিক, এটাই Forward Secrecy। Private Key শুধু সই করেছিল, চাবি বানায়নি। তবে চুরির পরের নতুন Connection এ সে নকল Server সাজতে পারবে, তাই Key বদলাতে হবে, যা পরের লেসনে।",
          },
          {
            key: "C",
            text: "শুধু শেষ এক ঘণ্টার রেকর্ড খুলবে",
            isCorrect: false,
            explanation: "সময়ের কোনো সীমা নেই, কোনো পুরনো রেকর্ডই খোলে না।",
          },
          {
            key: "D",
            text: "Browser নিজে থেকে সব পুরনো Session মুছে দেবে",
            isCorrect: false,
            explanation: "Browser এর এখানে কিছু করার নেই, সুরক্ষাটা গণিত থেকে আসে।",
          },
        ],
      },
      {
        id: 6,
        text: "TLS 1.3 Handshake এর কোন বার্তা প্রমাণ করে যে Server এর কাছে সত্যিই Certificate এর Private Key আছে?",
        options: [
          {
            key: "A",
            text: "ServerHello",
            isCorrect: false,
            explanation: "ServerHello শুধু Version, Suite আর Key Share জানায়। এতে কোনো প্রমাণ নেই।",
          },
          {
            key: "B",
            text: "Certificate",
            isCorrect: false,
            explanation:
              "Certificate একটা প্রকাশ্য কাগজ, যে কেউ নকল পাঠাতে পারে। নকল দিয়ে কিছু প্রমাণ হয় না।",
          },
          {
            key: "C",
            text: "CertificateVerify",
            isCorrect: true,
            explanation:
              "ঠিক। Server পুরো কথোপকথনের উপর Private Key দিয়ে সই করে, আর ফোন Certificate এর Public Key দিয়ে মেলায়। Private Key ছাড়া এই সই বানানো যায় না।",
          },
          {
            key: "D",
            text: "ClientHello",
            isCorrect: false,
            explanation: "ClientHello ফোন পাঠায়, Server নয়।",
          },
        ],
      },
      {
        id: 7,
        text: "Island Tours উত্তরের সাথে পাঠায় Strict-Transport-Security: max-age=31536000। এর সঠিক ফল কোনটা?",
        options: [
          {
            key: "A",
            text: "Server এক বছর ধরে Port 80 বন্ধ রাখবে",
            isCorrect: false,
            explanation: "Header টা Browser কে নির্দেশ দেয়, Server এর Port এ কিছু বদলায় না।",
          },
          {
            key: "B",
            text: "এক বছর ধরে Browser এই নামে শুধু HTTPS ব্যবহার করবে, http লিখলেও, আর Certificate এর সমস্যায় বাইপাস করার বোতাম দেখাবে না",
            isCorrect: true,
            explanation:
              "ঠিক। তাই প্রথম Request এর পরের সব Request এ SSL Stripping এর সুযোগ থাকে না।",
          },
          {
            key: "C",
            text: "Certificate এর মেয়াদ এক বছর বাড়বে",
            isCorrect: false,
            explanation: "HSTS এর সাথে Certificate এর মেয়াদের কোনো সম্পর্ক নেই।",
          },
          {
            key: "D",
            text: "প্রথম বারের Request টাও নিরাপদ হয়ে যাবে",
            isCorrect: false,
            explanation:
              "প্রথম বারে Browser এখনো Header টা পায়নি। সেই ফাঁক বন্ধ করে শুধু Preload তালিকা।",
          },
        ],
      },
      {
        id: 8,
        text: "Cloudflare এর SSL/TLS Mode Flexible। নিচের কোনটা সত্যি?",
        options: [
          {
            key: "A",
            text: "Browser থেকে আপনার Server পর্যন্ত পুরো পথ তালাবদ্ধ",
            isCorrect: false,
            explanation: "শুধু Browser থেকে Cloudflare পর্যন্ত। বাকিটা খোলা।",
          },
          {
            key: "B",
            text: "Browser এ তালা দেখায়, কিন্তু Cloudflare থেকে আপনার Server পর্যন্ত পথটা Plain HTTP",
            isCorrect: true,
            explanation:
              "ঠিক। আর Server নিজে HTTPS এ Redirect করলে চক্র তৈরি হয়, ERR_TOO_MANY_REDIRECTS। লক্ষ্য সবসময় Full (strict)।",
          },
          {
            key: "C",
            text: "Cloudflare আপনার Server এর Certificate কঠোরভাবে যাচাই করে",
            isCorrect: false,
            explanation: "এটা Full (strict) এর কাজ। Flexible এ দ্বিতীয় পথে TLS ই নেই।",
          },
          {
            key: "D",
            text: "Flexible মানে TLS 1.2 আর 1.3 দুইটাই চলে",
            isCorrect: false,
            explanation: "Mode টা Version এর ব্যাপার নয়, দ্বিতীয় পথে তালা আছে কি না তার ব্যাপার।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "তালা ছাড়া আর তালা সহ, নিজের যন্ত্রে মাঝের লোক হয়ে দেখা",
    subtitle: "ছয়টা পরীক্ষা, sudo লাগে না, শুধু curl, openssl আর Node",
    stepName: "LAB",
    steps: [
      {
        title: "Handshake পড়া",
        description:
          "curl -v আর openssl s_client দিয়ে example.com এর Handshake দেখুন। Version, Suite, group, Certificate এর নাম আর সইকারী লিখে রাখুন।",
      },
      {
        title: "Version আর SNI",
        description:
          "একই Server এ TLS 1.3 আর 1.2 জোর করে চালান, Suite এর নামের তফাত দেখুন। তারপর TLS 1.1 আর SNI ছাড়া চেষ্টা করে দেখুন কে কোথায় থামে।",
      },
      {
        title: "Plain HTTP তে মাঝের লোক",
        description:
          "একটা App আর তার সামনে একটা মাঝের Program চালান। Login পাঠিয়ে দেখুন মাঝের Program Password পড়তে পারে আর উত্তর বদলাতে পারে।",
      },
      {
        title: "HTTPS এ একই মাঝের লোক",
        description:
          "একই কাজ, এবার TLS সহ। মাঝের Program শুধু SNI আর ALPN পড়তে পারে। তারপর সে একটা Byte বদলালে কী হয় দেখুন।",
      },
      {
        title: "Handshake এর দাম মাপা",
        description:
          "curl -w দিয়ে TLS 1.3 আর 1.2 এর সময় মাপুন, তারপর openssl দিয়ে Session Ticket রেখে Resumption ঘটান।",
      },
      {
        title: "Redirect আর HSTS",
        description:
          "একটা ছোট Server বানান যেটা HTTP থেকে 308 দিয়ে HTTPS এ পাঠায় আর HSTS Header দেয়। curl দিয়ে পুরো পথটা দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-read-the-handshake.sh",
        language: "bash",
        code: `# ১. curl দিয়ে Handshake এর প্রতিটা ধাপ, শুধু TLS এর লাইনগুলো রেখে
curl -sv -o /dev/null https://example.com 2>&1 \\
  | grep -E "ALPN|TLS handshake|SSL connection|subject:|issuer:|verify ok"

# ২. openssl দিয়ে শুধু TLS এর সারাংশ
echo | openssl s_client -connect example.com:443 -servername example.com -brief

# ৩. দুইটার Output পাশাপাশি রেখে লিখুন:
#    কোন Version? কোন Cipher Suite? কোন group? Certificate কার নামে, কে সই করেছে?
#    curl আর openssl কি একই Suite পেল? না পেলে কেন?`,
      },
      {
        filename: "2-versions-and-sni.sh",
        language: "bash",
        code: `# ১. TLS 1.3 আর TLS 1.2 পাশাপাশি, একই Server
for v in -tls1_3 -tls1_2; do
  echo "--- $v"
  echo | openssl s_client -connect example.com:443 -servername example.com $v -brief 2>&1 \\
    | grep -E "Protocol version|Ciphersuite|group|Temp Key|Verification"
done

# ২. TLS 1.1: আপনার নিজের OpenSSL ই রাজি হবে না
echo | openssl s_client -connect example.com:443 -servername example.com -tls1_1 -brief 2>&1 | head -2
# ...:error:0A0000BF:SSL routines:tls_setup_handshake:no protocols available

# ৩. SNI ছাড়া: Server জানে না কোন সাইটের Certificate দেখাবে
echo | openssl s_client -connect example.com:443 -noservername -brief 2>&1 | head -2
# ...:SSL routines:ssl3_read_bytes:ssl/tls alert handshake failure:...:SSL alert number 40`,
      },
      {
        filename: "3-spy-http.mjs",
        language: "javascript",
        code: `// Terminal ১:  LAB_PORT=47670 SPY_PORT=47671 node 3-spy-http.mjs
// Terminal ২:  export LAB_PASSWORD="$(openssl rand -hex 8)"
//              curl -s -X POST http://localhost:47671/api/auth/login \\
//                -H 'content-type: application/json' \\
//                -d "{\\"email\\":\\"tourist@mail.example\\",\\"password\\":\\"$LAB_PASSWORD\\"}"
// Terminal ১ এ দেখুন মাঝের Program টা কী পড়ল, আর Terminal ২ এ উত্তরের pay_to কী এলো।
import http from "node:http";
import net from "node:net";

const appPort = Number(process.env.LAB_PORT);
const spyPort = Number(process.env.SPY_PORT);
if (!appPort) throw new Error("LAB_PORT is not set");
if (!spyPort) throw new Error("SPY_PORT is not set");

// আসল App: Login নেয়, আর কোথায় টাকা পাঠাতে হবে তা জানায়
const app = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true, pay_to: "islandtours.example" }));
  });
});
app.listen(appPort, "127.0.0.1");

// মাঝের লোক: সব Byte এক পাশ থেকে আরেক পাশে দেয়, আর পথে পড়ে ও বদলায়
const spy = net.createServer((client) => {
  const upstream = net.connect(appPort, "127.0.0.1");
  client.on("data", (chunk) => {
    console.log("\\n[spy] client -> server, যা পড়া গেল:\\n" + chunk.toString());
    upstream.write(chunk);
  });
  upstream.on("data", (chunk) => {
    const changed = chunk.toString().replace("islandtours.example", "attackerpay.example");
    console.log("[spy] server -> client, ঠিকানা বদলে দিলাম");
    client.write(changed);
  });
  client.on("end", () => upstream.end());
  upstream.on("end", () => client.end());
  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
});
spy.listen(spyPort, "127.0.0.1", () =>
  console.log(\`app on \${appPort}, spy on \${spyPort}. Request টা spy এর Port এ পাঠান।\`),
);`,
      },
      {
        filename: "4-spy-https.mjs",
        language: "javascript",
        code: `// আগে একবার localhost এর জন্য একটা Key আর Certificate বানান (এর মানে পরের লেসনে):
//   openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes \\
//     -keyout localhost-key.pem -out localhost-cert.pem -days 7 \\
//     -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
// Terminal ১:  LAB_PORT=47672 SPY_PORT=47673 LAB_KEY=localhost-key.pem LAB_CERT=localhost-cert.pem node 4-spy-https.mjs
// Terminal ২:  একই curl, শুধু https আর --cacert localhost-cert.pem সহ, Port 47673 এ
// তারপর Terminal ১ থামিয়ে সামনে SPY_TAMPER=1 লাগিয়ে আবার চালান, আর curl টা আবার পাঠান।
import fs from "node:fs";
import https from "node:https";
import net from "node:net";

const appPort = Number(process.env.LAB_PORT);
const spyPort = Number(process.env.SPY_PORT);
const keyFile = process.env.LAB_KEY;
const certFile = process.env.LAB_CERT;
if (!appPort) throw new Error("LAB_PORT is not set");
if (!spyPort) throw new Error("SPY_PORT is not set");
if (!keyFile || !certFile) throw new Error("LAB_KEY and LAB_CERT must point to the key and certificate files");
const tamper = process.env.SPY_TAMPER === "1";

// একই App, এবার TLS এর ভেতরে
const app = https.createServer(
  { key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) },
  (req, res) => {
    req.resume();
    req.on("end", () => {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ ok: true, pay_to: "islandtours.example" }));
    });
  },
);
app.listen(appPort, "127.0.0.1");

// TLS Record এর প্রথম Byte বলে দেয় ভেতরে কী ধরনের জিনিস
const RECORD = { 20: "change_cipher_spec", 21: "alert", 22: "handshake", 23: "application_data" };

// পাঁচ বা তার বেশি অক্ষরের পড়া যায় এমন অংশ খোঁজে, যেমন একটা নাম
const readable = (buf) => (buf.toString("latin1").match(/[a-z0-9.\\/-]{5,}/gi) ?? []).slice(0, 6);

const spy = net.createServer((client) => {
  const upstream = net.connect(appPort, "127.0.0.1");
  client.on("data", (chunk) => {
    console.log(\`[spy] client -> server  \${chunk.length} bytes, record: \${RECORD[chunk[0]] ?? chunk[0]}, পড়া গেল: \${JSON.stringify(readable(chunk))}\`);
    upstream.write(chunk);
  });
  upstream.on("data", (chunk) => {
    console.log(\`[spy] server -> client  \${chunk.length} bytes, record: \${RECORD[chunk[0]] ?? chunk[0]}\`);
    if (tamper && chunk[0] === 23) {
      chunk[chunk.length - 1] ^= 0xff; // শেষ Byte টা উল্টে দেওয়া
      console.log("[spy] application_data র একটা Byte বদলে দিলাম");
    }
    client.write(chunk);
  });
  client.on("end", () => upstream.end());
  upstream.on("end", () => client.end());
  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
});
spy.listen(spyPort, "127.0.0.1", () =>
  console.log(\`https app on \${appPort}, spy on \${spyPort}\${tamper ? ", tamper on" : ""}\`),
);`,
      },
      {
        filename: "5-handshake-cost.sh",
        language: "bash",
        code: `# ১. TLS 1.3 এ তিনবার মাপুন। tls থেকে tcp বাদ দিলে TLS এর নিজের ভাগ
for i in 1 2 3; do
  curl -s -o /dev/null -w 'tcp=%{time_connect}s tls=%{time_appconnect}s first_byte=%{time_starttransfer}s\\n' https://example.com
done

# ২. একই মাপ, TLS 1.2 এর উপরে যেতে না দিয়ে
for i in 1 2 3; do
  curl -s -o /dev/null --tls-max 1.2 -w 'tcp=%{time_connect}s tls=%{time_appconnect}s\\n' https://example.com
done

# ৩. Resumption: প্রথমবার Session Ticket টা একটা ফাইলে রাখুন
printf 'HEAD / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' \\
  | openssl s_client -connect example.com:443 -servername example.com \\
      -sess_out session.pem -ign_eof 2>&1 | grep -E "^(New|Reused)"

# ৪. দ্বিতীয়বার সেই Ticket দেখিয়ে ঢুকুন
printf 'HEAD / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' \\
  | openssl s_client -connect example.com:443 -servername example.com \\
      -sess_in session.pem -ign_eof 2>&1 | grep -E "^(New|Reused)|Early data"

# ৫. ফাইলটা মুছে ফেলুন। এর ভেতরে একটা গোপন চাবির উপাদান আছে, রেখে দেওয়ার জিনিস নয়
rm -f session.pem`,
      },
      {
        filename: "6-redirect-hsts.mjs",
        language: "javascript",
        code: `// Terminal ১:  LAB_PORT=47674 LAB_TLS_PORT=47675 LAB_KEY=localhost-key.pem LAB_CERT=localhost-cert.pem node 6-redirect-hsts.mjs
// Terminal ২:  curl -sI http://localhost:47674/tours/saint-martin
//              curl -sIL --cacert localhost-cert.pem http://localhost:47674/tours/saint-martin
import fs from "node:fs";
import http from "node:http";
import https from "node:https";

const httpPort = Number(process.env.LAB_PORT);
const tlsPort = Number(process.env.LAB_TLS_PORT);
const keyFile = process.env.LAB_KEY;
const certFile = process.env.LAB_CERT;
if (!httpPort) throw new Error("LAB_PORT is not set");
if (!tlsPort) throw new Error("LAB_TLS_PORT is not set");
if (!keyFile || !certFile) throw new Error("LAB_KEY and LAB_CERT must point to the key and certificate files");

// Port 80 এর কাজ: কিছু না দেখিয়ে একই ঠিকানার HTTPS রূপে পাঠিয়ে দেওয়া
http
  .createServer((req, res) => {
    const host = (req.headers.host ?? "").split(":")[0];
    res.writeHead(308, { location: \`https://\${host}:\${tlsPort}\${req.url}\` });
    res.end();
  })
  .listen(httpPort, "127.0.0.1");

// HTTPS অংশ: উত্তরের সাথে HSTS, Lab এ ছোট মেয়াদ (৫ মিনিট)
https
  .createServer({ key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) }, (req, res) => {
    res.writeHead(200, {
      "strict-transport-security": "max-age=300",
      "content-type": "text/plain; charset=utf-8",
    });
    res.end(\`secure page \${req.url}\\n\`);
  })
  .listen(tlsPort, "127.0.0.1", () => console.log(\`http \${httpPort} redirects, https \${tlsPort} serves\`));`,
      },
    ],
    tip: "পরীক্ষা ৩ আর ৪ পাশাপাশি রাখুন, কারণ পুরো লেসনটা এই দুইটার তফাতে। একই App, একই Login, একই মাঝের Program। প্রথমটায় সে Password পড়ল আর টাকার ঠিকানা বদলে দিল, ফোন কিছুই টের পেল না। দ্বিতীয়টায় সে পেল শুধু দুইটা শব্দ, localhost আর http/1.1, আর একটা Byte বদলাতেই curl উত্তরটা দেখাতেই অস্বীকার করল। Confidentiality আর Integrity নিজের চোখে দেখা হয়ে গেল। আর তৃতীয় প্রতিশ্রুতিটা দেখেছেন --cacert এ: curl নিজের বানানো Certificate মানেনি, যতক্ষণ না আপনি --cacert দিয়ে নিজে বলে দিলেন যে এই File টা বিশ্বাসযোগ্য। সেই বিশ্বাস দুনিয়াজুড়ে কীভাবে তৈরি হয়, পরের লেসনে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর সামনে নিজের হাতে HTTPS",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>নিজের পথের মানচিত্র:</strong> বাসার Wi-Fi থেকে আপনার প্রিয় একটা সাইট পর্যন্ত
        পথে কারা কারা থাকে, তার একটা তালিকা বানান: Router, ISP, আর যা যা জানেন। প্রতিটার
        পাশে দুইটা কলামে লিখুন, Plain HTTP হলে সে কী কী জানত, আর HTTPS এ কী কী জানে। SNI,
        DNS আর Packet এর আকার যেন বাদ না পড়ে।
      </span>,
      <span key="2">
        <strong>Handshake মুখস্থ নয়, এঁকে বুঝুন:</strong> না দেখে কাগজে TLS 1.3 Handshake
        আঁকুন, প্রতিটা বার্তার নাম, কোনটা খোলা আর কোনটা তালাবদ্ধ, আর কোন মুহূর্তে দুই পাশে
        চাবি তৈরি হয়। তারপর TLS 1.2 এর জন্য আরেকটা ছবি। Server 250 ms দূরে হলে প্রতিটা নতুন
        Connection এ কত সময় বাঁচে, হিসাব করে লিখুন।
      </span>,
      <span key="3">
        <strong>তিনটা সাইটের তুলনা:</strong> প্রতিদিন ব্যবহার করেন এমন তিনটা সাইটে
        openssl s_client -brief আর curl -w চালান। একটা টেবিলে লিখুন Version, Cipher Suite,
        group, TLS এর সময় আর HSTS Header আছে কি না (<code>curl -sI</code> দিয়ে)। কোথাও
        X25519MLKEM768 পেলেন কি না, আর কোথাও HSTS নেই কি না, সেটা আলাদা করে চিহ্নিত করুন।
      </span>,
      <span key="4">
        <strong>my-tours এ HTTPS বসান:</strong> নিজের my-tours Server এর সামনে Lab এর
        মতো একটা HTTPS স্তর বসান, localhost এর নিজের Certificate দিয়ে। Port 80 এর ভূমিকার
        Server টা শুধু 308 দেবে, HTTPS অংশ HSTS দেবে max-age=300 সহ। দুইটা Port আর Key ও
        Certificate এর Path সব Environment Variable থেকে পড়বেন, না থাকলে Server চালুই হবে না।
        প্রমাণ হিসেবে জমা দিন: curl -sIL এর Output, Lab এর মাঝের Program দিয়ে দেখানো যে
        Login এর Password আর পড়া যায় না, আর Environment Variable ছাড়া চালানোর Error টা।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> একজন বন্ধু বললেন, সাইটে তো তালা আছে,
        তাহলে নিশ্চয়ই নিরাপদ, ঠিক না? তাঁকে বোঝান তালা ঠিক কোন তিনটা জিনিসের প্রতিশ্রুতি
        দেয়, কোন চারটা জিনিস তবুও পথের মানুষ জানে, আর কেন একটা Phishing সাইটেও তালা জ্বলতে
        পারে। শেষে এক লাইনে বলুন তালা দেখার পর নিজে কোন জিনিসটা যাচাই করবেন।
      </span>,
    ],
    deliverables: [
      <span key="1">পথের তালিকা, HTTP আর HTTPS এর দুই কলাম সহ</span>,
      <span key="2">TLS 1.3 আর 1.2 এর দুইটা ছবি, আর 250 ms এ বাঁচা সময়ের হিসাব</span>,
      <span key="3">তিনটা সাইটের তুলনার টেবিল</span>,
      <span key="4">my-tours এর HTTPS স্তরের Code, curl আর মাঝের Program এর Output, আর Variable ছাড়া চালানোর Error</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
