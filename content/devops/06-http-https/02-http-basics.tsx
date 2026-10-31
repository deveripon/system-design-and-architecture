/**
 * What: Lesson 02 of the DevOps Module 06 (HTTP & HTTPS): what HTTP is, how a request and a response
 * are written on the wire, why the protocol is stateless, how a body ends, keep-alive, and the story
 * of HTTP/0.9 to HTTP/3.
 *
 * Why: Every later lesson in the module (methods, headers, cookies, sessions, TLS) is a detail of the
 * message shape taught here, so this lesson makes the reader write HTTP by hand first. Every command
 * and output in it was run for real against example.com and a local Node server.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  ContentLengthLab,
  MessageAnatomyLab,
  ProtocolLossLab,
  StatelessLab,
  VersionTimelineLab,
} from "../../../components/course/topics/http/basics-animations";
import {
  BodyEndSplit,
  HttpOnTcpDiagram,
  IntermediariesDiagram,
  KeepAliveSplit,
  MultiplexDiagram,
  RequestAnatomyDiagram,
  RequestResponseDiagram,
  ResponseAnatomyDiagram,
  VirtualHostDiagram,
} from "../../../components/course/topics/http/basics-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const httpBasicsContent: TopicData = {
  id: "http-basics",
  introduction: {
    badge: "MODULE 06 · LESSON 02",
    title: <SectionTitle>রাস্তা তৈরি, এবার কথাটা কোন ভাষায় হবে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          Module 05 শেষে পর্যটকের ফোন আর Island Tours এর Server এর মাঝে একটা TCP
          Connection খোলা ছিল। ফোন <code>192.168.1.20</code>, Port{" "}
          <code>51514</code>। Server <code>103.94.135.2</code>, Port{" "}
          <code>443</code>। Three-way Handshake হয়ে গেছে, রাস্তা দুই দিকেই খোলা,
          একটা Byte ও হারাবে না। সব তৈরি। এখন ফোন কী পাঠাবে?
        </ContentParagraph>
        <ContentParagraph>
          প্রশ্নটা যতটা সহজ শোনায়, ততটা সহজ নয়। TCP একটা নির্ভুল পাইপ, কিন্তু
          পাইপের ভেতর দিয়ে কী যাবে তা নিয়ে তার কোনো মতামত নেই। পর্যটক চাইছেন Saint
          Martin ট্যুরের পাতাটা। সেই চাওয়াটা কোন শব্দে, কোন ক্রমে, কোন চিহ্ন দিয়ে
          লিখলে Server বুঝবে? Server উত্তরে পাতাটা পাঠাবে, নাকি জানাবে যে ট্যুরটা আর
          নেই, সেটা ফোন বুঝবে কীভাবে? আর উত্তরটা কোথায় শেষ হলো, সেটাই বা কে বলবে?
        </ContentParagraph>
        <ContentParagraph>
          এই সব প্রশ্নের একটাই উত্তর, একটা চুক্তি যা পৃথিবীর প্রতিটা Browser আর
          প্রতিটা Web Server মেনে চলে। তার নাম HTTP। এই লেসনে আপনি HTTP নিজের হাতে
          লিখে পাঠাবেন, কোনো Browser ছাড়াই। দেখবেন একটা Request আর একটা Response
          আসলে কয়েক লাইন সাধারণ লেখা। তারপর জানবেন HTTP কেন কিছু মনে রাখে না,
          একটা উত্তর কোথায় শেষ হয় তা কীভাবে বোঝা যায়, একটা Connection দিয়ে কীভাবে
          অনেক Request যায়, আর HTTP/1.1, HTTP/2, HTTP/3 এর তফাত আসলে কোথায়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "দুইজন মানুষের মাঝে টেলিফোনের লাইন জুড়ে দিলেই কথা হয় না। দুইজনকেই একই ভাষা জানতে হয়, জানতে হয় কে আগে বলবে, আর কখন বোঝা যাবে যে অন্যজনের বলা শেষ।",
      author: "HTTP",
      role: "Lesson 02",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what-http-is",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>TCP দিল নির্ভুল রাস্তা, HTTP দিল কথার মানে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ছোট পরীক্ষা মাথায় করুন। আপনার হাতে একটা পাইপ, যার এক মাথায় আপনি,
                অন্য মাথায় একজন অচেনা মানুষ। পাইপ দিয়ে যা পাঠাবেন তা হুবহু, ঠিক
                ক্রমে ওপাশে পৌঁছাবে, এই নিশ্চয়তা আছে। এখন আপনি একটা বই চাইতে চান।
                কী লিখবেন? বই দিন? বইয়ের নাম? ওপাশের মানুষটা কোন ভাষা বোঝেন, আপনি
                জানেন না। তিনি উত্তরে কী লিখবেন, সেটাও আপনি জানেন না।
              </ContentParagraph>
              <ContentParagraph>
                TCP ঠিক এই পাইপটা। Module 05 এ দেখেছেন, TCP কথা দেয় যে Byte গুলো
                হারাবে না, ক্রম উল্টাবে না, দ্রুততা সামলানো হবে। কিন্তু Byte গুলোর
                মানে কী, তা TCP জানে না। তার কাছে <code>GET</code> শব্দটা শুধু তিনটা
                Byte: <code>47 45 54</code>। দুই প্রান্তের দুইটা Program কে নিজেরা
                একটা ভাষা ঠিক করে নিতে হয়, যেটা দুইজনেই বোঝে।
              </ContentParagraph>
              <ContentParagraph>
                Module 02 এর প্রথম লেসনে একটা কথা বলা হয়েছিল, Protocol মানে একটা
                চুক্তি। কে আগে কথা বলবে, কোন ক্রমে কী বলবে, কীভাবে বোঝা যাবে কথা
                শেষ। Web এর জন্য সেই চুক্তিটার নাম <strong>HTTP</strong>,
                HyperText Transfer Protocol। নামের তিনটা শব্দ আলাদা করে দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>HyperText</strong> মানে এমন লেখা যার ভেতরে অন্য লেখার
                  দিকে Link আছে। একটা Web পাতা ঠিক তাই: লেখা, আর তার ভেতরে অন্য
                  পাতার Link। ১৯৯১ সালে HTTP বানানো হয়েছিল শুধু এই পাতাগুলো আনার জন্য।
                </ListItem>
                <ListItem>
                  <strong>Transfer</strong> মানে এক জায়গা থেকে আরেক জায়গায় নিয়ে
                  যাওয়া। আজ HTTP শুধু পাতা নয়, ছবি, ভিডিও, JSON, PDF, যেকোনো কিছু
                  বয়ে নেয়। নামটা পুরনো রয়ে গেছে, কাজটা অনেক বড় হয়েছে।
                </ListItem>
                <ListItem>
                  <strong>Protocol</strong> মানে সেই চুক্তি। দুই পাশ একই নিয়ম মানে
                  বলেই আপনার ফোনের Browser এমন একটা Server এর সাথে কথা বলতে পারে,
                  যেটা হয়তো অন্য দেশের অন্য কোম্পানি অন্য ভাষায় লিখেছে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Module 05 এর TCP/IP Model লেসনের তলাগুলো মনে করুন। TCP আর IP থাকে
                Operating System এর Kernel এর ভেতরে। HTTP থাকে সবচেয়ে উপরের তলায়,
                Application Layer এ, মানে Program এর ভেতরে। Browser HTTP বলে,
                curl বলে, Island Tours এর Caddy বলে, আপনার Node App বলে। Kernel
                HTTP বোঝে না, বোঝার দরকারও নেই। সে শুধু Byte গুলো পৌঁছে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HttpOnTcpDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর একটা জিনিস শুরুতেই পরিষ্কার করে রাখি, কারণ এটা সবাই গুলিয়ে ফেলে।
                HTTP চলে সাধারণত Port <code>80</code> এ, আর HTTPS চলে Port{" "}
                <code>443</code> এ, Port and Socket লেসনের তালিকায় যেমন দেখেছেন।
                HTTPS কোনো আলাদা ভাষা নয়। HTTPS মানে হুবহু একই HTTP, শুধু একটা
                Encrypt করা খামের ভেতরে। খামটা কীভাবে তৈরি হয়, সেটা এই Module এর
                HTTPS, TLS, and SSL লেসনের বিষয়।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসনে আমরা বেশিরভাগ সময় খাম ছাড়া, সাধারণ HTTP দিয়ে কাজ করব।
                কারণটা সোজা: খাম খোলা থাকলে ভেতরের লেখাটা নিজের চোখে পড়া যায়। ভাষাটা
                একবার চিনে ফেললে, খামের ভেতরে থাকলেও আপনি জানবেন ভেতরে ঠিক কী আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "HTTP আসলে শুধু লেখা",
          content: (
            <p>
              HTTP/1.1 এর একটা Request হলো কয়েক লাইন সাধারণ ইংরেজি অক্ষর। প্রতিটা
              অক্ষর একটা Byte, Module 01 এর Binary লেসনে যেমন দেখেছেন। G মানে 0x47, E
              মানে 0x45, T মানে 0x54।{" "}
              <Link
                href="/devops/reference/ascii-table"
                className="text-primary underline underline-offset-4"
              >
                ASCII তালিকাটা
              </Link>{" "}
              খুলে মিলিয়ে নিতে পারেন। এই কারণেই একটা সাধারণ Terminal থেকে হাতে টাইপ
              করে HTTP বলা যায়, যা আপনি একটু পরেই করবেন। HTTP/2 আর HTTP/3 এ লেখার
              বদলে Binary Frame যায়, কিন্তু ভেতরের কথাগুলো, মানে কী চাওয়া হলো আর
              কী উত্তর এলো, একই থাকে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "request-response",
      subHeader: { index: "002", title: "Request-Response Model" },
      title: <SectionTitle>একজন চায়, একজন দেয়: Request আর Response</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা রেস্তোরাঁর কথা ভাবুন। আপনি টেবিলে বসে একটা কাগজে লিখলেন, এক প্লেট
                ভাত আর ডাল। ওয়েটার কাগজটা রান্নাঘরে নিয়ে গেলেন, রাঁধুনি রান্না করলেন,
                ওয়েটার এক প্লেট খাবার নিয়ে ফিরলেন। একটা অর্ডার, একটা প্লেট। ওয়েটার
                কখনো নিজে থেকে এসে বলেন না, এই নিন, আপনার জন্য কিছু এনেছি। প্রতিবার
                শুরু করেন আপনি।
              </ContentParagraph>
              <ContentParagraph>
                HTTP ঠিক এভাবে চলে, আর এই ধরনটার নাম{" "}
                <strong>Request-Response Model</strong>। যে চায় তাকে বলে{" "}
                <strong>Client</strong>, যে দেয় তাকে বলে <strong>Server</strong>।
                Client যা পাঠায় তার নাম <strong>Request</strong>, Server যা ফেরত দেয়
                তার নাম <strong>Response</strong>। Module 02 এর Client, Server আর ISP
                লেসনে এই দুইটা ভূমিকার কথা শুনেছেন, এবার দেখবেন তারা আসলে কী বলাবলি
                করে।
              </ContentParagraph>
              <ContentParagraph>
                এই মডেলের চারটা নিয়ম আছে, আর পুরো Web এই চারটার উপর দাঁড়িয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সবসময় Client শুরু করে।</strong> Server চুপ করে বসে শোনে,
                  Port 80 বা 443 এ। কেউ কিছু না চাইলে সে কিছুই পাঠায় না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Request এর জন্য ঠিক একটা Response।</strong> কম নয়,
                  বেশিও নয়। Server এর হাতে কাজ না থাকলেও, ভুল হলেও, একটা Response
                  যায়, যাতে Client জানতে পারে কী হলো।
                </ListItem>
                <ListItem>
                  <strong>Response আসে একই Connection দিয়ে।</strong> যে TCP
                  Connection দিয়ে Request এসেছিল, উত্তর যায় সেটা দিয়েই। Server
                  আলাদা করে আপনাকে খুঁজে বের করে না।
                </ListItem>
                <ListItem>
                  <strong>Response এর পরে আদান প্রদানটা শেষ।</strong> পরের Request
                  একদম নতুন একটা আদান প্রদান, আগেরটার সাথে প্রোটোকলের দিক থেকে কোনো
                  সম্পর্ক নেই। এই নিয়মটার নাম Stateless, সাত নম্বর সেকশনে এর পুরো গল্প।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RequestResponseDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Client আর Server কোনো যন্ত্রের নাম নয়, একটা ভূমিকার নাম। একই Program
                এক সাথে দুইটাই হতে পারে। Island Tours এর Caddy পর্যটকের Browser এর
                কাছে Server। আবার সেই Caddy যখন ভেতরে Port 3000 এর App কে Request
                পাঠায়, তখন সে Client। আর App যখন Payment Gateway কে টাকা কাটতে বলে,
                তখন App নিজেই Client। কে আগে চাইছে, সেটাই ঠিক করে কে Client।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা পাতা মানে একটা Request নয়। পর্যটক যখন Saint Martin ট্যুরের
                পাতা খোলেন, Browser প্রথমে একটা Request এ শুধু HTML টা আনে। HTML পড়ে
                সে দেখে আরও লাগবে: একটা CSS ফাইল, কয়েকটা JavaScript ফাইল, নৌকার
                ছবিগুলো, একটা Font। প্রতিটার জন্য আলাদা Request, আলাদা Response। একটা
                সাধারণ পাতায় কয়েক ডজন Request হওয়া খুব স্বাভাবিক। এই লেসনের শেষের
                দিকে Browser এর DevTools খুলে নিজের চোখে গুনবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Server নিজে কথা বলতে না পারলে Chat চলে কীভাবে",
          content: (
            <p>
              প্রশ্নটা মনে আসা খুব স্বাভাবিক। কেউ আপনাকে Message পাঠালে সেটা আপনার
              পর্দায় নিজে থেকেই ভেসে ওঠে, আপনি কিছু চাননি। সাধারণ HTTP দিয়ে এটা
              সরাসরি হয় না, তাই এর জন্য আলাদা কৌশল আছে: বারবার জিজ্ঞেস করা, একটা
              Request খোলা রেখে দেওয়া, আর WebSocket। এই Module এর শেষ লেসন,
              WebSocket & Real-time Communication, পুরোটা এই প্রশ্নের উত্তর।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "request-anatomy",
      subHeader: { index: "003", title: "Request Anatomy" },
      title: <SectionTitle>একটা Request এর ভেতরে কী কী থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একটা আসল Request খুলে দেখি। পর্যটক Saint Martin ট্যুরে
                ২০২৬ সালের ২০ ডিসেম্বরের জন্য দুইজনের আসন বুক করছেন। Browser
                Island Tours এর API কে নিচের লেখাটা পাঠায়। HTTP/1.1 এ তারের উপর
                দিয়ে ঠিক এই অক্ষরগুলোই যায়, একটাও বেশি নয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RequestAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Request এর চারটা অংশ, সবসময় এই ক্রমে। একটা একটা করে দেখি।
              </ContentParagraph>
              <ContentParagraph>
                <strong>১. Request Line।</strong> প্রথম লাইন, তিন টুকরো, মাঝে একটা
                করে Space। প্রথম টুকরো <strong>Method</strong>, মানে কী করতে চাই।
                এখানে <code>POST</code>, মানে নতুন কিছু জমা দিতে চাই। শুধু দেখতে চাইলে
                হতো <code>GET</code>। কোন Method কখন, তা পরের লেসন HTTP Methods &
                Status Codes এর বিষয়। দ্বিতীয় টুকরো <strong>Target</strong>, মানে
                কোন জিনিসটা নিয়ে কথা। এখানে <code>/api/bookings</code>। তৃতীয়
                টুকরো <strong>Version</strong>, মানে কোন নিয়মে কথা বলছি। এখানে{" "}
                <code>HTTP/1.1</code>।
              </ContentParagraph>
              <ContentParagraph>
                <strong>২. Headers।</strong> এরপর কয়েকটা লাইন, প্রতিটায় একটা নাম,
                একটা কোলন, তারপর একটা মান। চিঠির খামের উপরে যেমন বাড়তি নির্দেশ লেখা
                থাকে, ভঙ্গুর, সাবধানে রাখুন, Header ঠিক তেমন। মূল কথাটা নয়, মূল
                কথার সাথে বাড়তি তথ্য। এখানে চারটা আছে। <code>Host</code> বলছে কোন
                সাইটের কাছে চাইছি। <code>Content-Type</code> বলছে Body টা JSON।{" "}
                <code>Content-Length</code> বলছে Body ঠিক 54 Byte।{" "}
                <code>Accept</code> বলছে উত্তরটা JSON এ পেলে ভালো। Header এর নাম
                বড় হাতের না ছোট হাতের অক্ষরে, তাতে কিছু যায় আসে না,{" "}
                <code>host</code> আর <code>Host</code> একই। কোন Header কী করে,
                তার পুরো ছবি HTTP Headers লেসনে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>৩. একটা ফাঁকা লাইন।</strong> একদম ফাঁকা, কিছুই লেখা নেই।
                দেখতে তুচ্ছ, কিন্তু এটাই সবচেয়ে জরুরি লাইন। Server Header গুলো
                একটা একটা পড়তে থাকে, আর যেই ফাঁকা লাইনটা পায়, বোঝে Header শেষ।
                ফাঁকা লাইনটা না পাঠালে Server চুপ করে আরও Header এর অপেক্ষায় বসে
                থাকে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>৪. Body।</strong> আসল তথ্য, এখানে বুকিং এর বিবরণ। Body
                ঐচ্ছিক। একটা পাতা দেখতে চাওয়ার GET Request এ সাধারণত কোনো Body
                থাকে না, শুধু প্রথম তিনটা অংশ।
              </ContentParagraph>
              <ContentParagraph>
                এবার লাইনের শেষের কথা। প্রতিটা লাইন শেষ হয় দুইটা অদৃশ্য অক্ষরে:{" "}
                <code>\r</code> আর <code>\n</code>। <code>\r</code> এর নাম Carriage
                Return, Byte টা 0x0D। <code>\n</code> এর নাম Line Feed, Byte টা
                0x0A। দুইটা মিলে বলে <strong>CRLF</strong>। নামগুলো পুরনো টাইপরাইটার
                থেকে এসেছে: Carriage Return মানে কাগজ ধরা অংশটা বাঁয়ে ফেরানো, Line
                Feed মানে কাগজটা এক লাইন উপরে তোলা। HTTP এর চুক্তি বলে প্রতিটা লাইন
                CRLF দিয়ে শেষ হবে। তাহলে ফাঁকা লাইনটা আসলে কী? আগের লাইনের CRLF এর
                ঠিক পরে আরেকটা CRLF। মানে Header এর শেষ চিহ্ন হলো চারটা Byte:{" "}
                <code>0D 0A 0D 0A</code>।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "booking-request.txt",
          code: `POST /api/bookings HTTP/1.1\\r\\n
Host: islandtours.example\\r\\n
Content-Type: application/json\\r\\n
Content-Length: 54\\r\\n
Accept: application/json\\r\\n
\\r\\n
{"tour":"saint-martin","date":"2026-12-20","guests":2}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আপনি Address Bar এ একটা URL লেখেন, কিন্তু Server এর কাছে পুরো URL টা
              কখনো এক টুকরো হয়ে যায় না। আগের লেসন URL vs URI তে URL এর যে অংশগুলো
              চিনেছেন, Browser সেগুলো আলাদা আলাদা জায়গায় বসায়। নিচের তালিকাটা
              দেখুন, এটা মনে রাখলে Request পড়া অনেক সহজ হয়ে যায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["URL এর অংশ", "উদাহরণ", "Request এর কোথায় যায়"],
          rows: [
            [mono("Scheme"), "https", "কোথাও লেখা হয় না। ঠিক করে Port কত (443) আর খামটা লাগবে কি না"],
            [mono("Host"), "islandtours.example", "প্রথমে DNS এ, IP জানার জন্য। তারপর Host Header এ"],
            [mono("Port"), "লেখা না থাকলে 443", "TCP Connection এর গন্তব্য Port, Request এর লেখায় নয়"],
            [mono("Path"), "/tours/saint-martin", "Request Line এর Target এ"],
            [mono("Query"), "?date=2026-12-20&guests=2", "Path এর ঠিক পরে, একই Target এ"],
            [mono("Fragment"), "#reviews", "কোথাও যায় না। Browser নিজের কাছে রাখে, পাতার কোন অংশে যেতে হবে সেটা দেখাতে"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "লাইনের শেষে শুধু \\n দিলে কী হয়",
          content: (
            <p>
              চুক্তি অনুযায়ী CRLF লাগে। বাস্তবে অনেক Server দয়া করে শুধু{" "}
              <code>\n</code> ও মেনে নেয়, আবার কিছু Server নেয় না। তাই নিজে হাতে
              HTTP লেখার সময় সবসময় <code>\r\n</code> লিখবেন। macOS এর Terminal এ{" "}
              <code>nc -c</code> আর Linux এ <code>nc -C</code> আপনার Enter কে নিজে
              থেকেই CRLF বানিয়ে দেয়। পরের এক সেকশনে দুইটাই কাজে লাগবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "response-anatomy",
      subHeader: { index: "004", title: "Response Anatomy" },
      title: <SectionTitle>উত্তরটাও একই ছাঁচে লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বুকিং সফল হলো। Island Tours এর App উত্তরে যা পাঠায়, সেটা দেখুন।
                গঠনটা হুবহু Request এর মতো: প্রথম লাইন, Header গুলো, একটা ফাঁকা
                লাইন, Body। তফাত শুধু প্রথম লাইনে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ResponseAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Response এর প্রথম লাইনের নাম <strong>Status Line</strong>। এখানেও
                তিন টুকরো। প্রথমে Version, <code>HTTP/1.1</code>। তারপর{" "}
                <strong>Status Code</strong>, তিন অঙ্কের একটা সংখ্যা, এখানে{" "}
                <code>201</code>। শেষে <strong>Reason Phrase</strong>, মানুষের পড়ার
                জন্য ছোট একটা লেখা, এখানে <code>Created</code>।
              </ContentParagraph>
              <ContentParagraph>
                Program গুলো শুধু সংখ্যাটা দেখে, লেখাটা নয়। Reason Phrase যেকোনো কিছু
                হতে পারে, এমনকি ফাঁকাও, তাতে কোনো Browser এর আচরণ বদলায় না। আর
                সংখ্যার প্রথম অঙ্কটাই বলে দেয় মোটামুটি কী ঘটেছে। এখানে শুধু এক লাইনে
                পরিচয় করিয়ে রাখি, প্রতিটা Code এর পুরো মানে পরের লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["প্রথম অঙ্ক", "মানে", "একটা চেনা উদাহরণ"],
          rows: [
            [mono("1xx"), "শুনছি, চালিয়ে যান", "101, WebSocket এ বদলে যাওয়ার সময়"],
            [mono("2xx"), "সফল", "200 OK, 201 Created"],
            [mono("3xx"), "অন্য জায়গায় দেখুন", "301, 308, পাতাটা সরে গেছে"],
            [mono("4xx"), "Client এর দিকে ভুল", "404 Not Found, ভুল ঠিকানা চাওয়া হয়েছে"],
            [mono("5xx"), "Server এর দিকে ভুল", "500, 502, Server নিজেই সামলাতে পারেনি"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Header আর Body Request এর মতোই কাজ করে। এখানে{" "}
              <code>Location</code> নামের একটা নতুন Header আছে, যেটা বলছে নতুন বুকিংটা{" "}
              <code>/api/bookings/bk_7Q2M9X</code> ঠিকানায় পাওয়া যাবে। নিচের Lab এ
              দুইটা Message এর প্রতিটা লাইনে চাপ দিয়ে দেখুন কোনটা কী কাজ করে, আর
              পুরো Message টা আসলে কত Byte।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MessageAnatomyLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "HTTP/2 তে দুইটা ছোট তফাত চোখে পড়বে",
          content: (
            <p>
              curl দিয়ে কোনো আধুনিক সাইট দেখলে প্রথম লাইনটা দেখবেন{" "}
              <code>HTTP/2 200</code>, পেছনে কোনো OK নেই। HTTP/2 তে Reason Phrase
              বাদ দেওয়া হয়েছে, কারণ কেউ সেটা পড়ত না। আর Header এর নামগুলো সব ছোট
              হাতের অক্ষরে, <code>content-type</code>। মানে একই, শুধু চেহারা আলাদা।
              কেন, সেটা HTTP/2 এর সেকশনে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "by-hand",
      subHeader: { index: "005", title: "Hands-on" },
      title: <SectionTitle>Browser ছাড়া, নিজের হাতে HTTP বলা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার কথা কম, কাজ বেশি। আপনি নিজে একটা Server এর সাথে HTTP বলবেন,
                কোনো Browser ছাড়া। এর জন্য লাগবে <strong>nc</strong>, পুরো নাম
                Netcat। nc খুব সাধারণ একটা যন্ত্র: সে একটা TCP Connection খোলে,
                আপনি যা টাইপ করেন তা হুবহু পাঠিয়ে দেয়, আর যা আসে তা হুবহু দেখায়।
                HTTP এর কিছুই সে জানে না। ঠিক সেই কারণেই সে কাজের, কারণ HTTP টা
                বলবেন আপনি নিজে।
              </ContentParagraph>
              <ContentParagraph>
                লক্ষ্য <code>example.com</code>, একটা Domain যেটা শুধু শেখানো আর
                উদাহরণের জন্য রাখা আছে। Port 80, মানে খাম ছাড়া সাধারণ HTTP।
                নিচের প্রথম লাইনটা <code>printf</code> দিয়ে Request টা লেখে, প্রতিটা
                লাইনের শেষে <code>\r\n</code> সহ। <code>sleep 3</code> টা আছে
                একটা কারণে: macOS এর nc তার Input শেষ হলেই বেরিয়ে যায়, উত্তর আসার
                আগেই। তিন সেকেন্ড অপেক্ষা করিয়ে রাখলে উত্তরটা আসার সময় পায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "http-by-hand.sh",
          code: `# একটা পুরো HTTP Request, হাতে লেখা
(printf 'GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n'; sleep 3) \\
  | nc example.com 80

# আসল উত্তর (2026-10-31 এ নেওয়া, CF-RAY এর মানটা সরানো, Body ছোট করা):
HTTP/1.1 200 OK
Date: Sat, 31 Oct 2026 06:26:55 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: close
Server: cloudflare
Last-Modified: Sat, 24 Oct 2026 11:34:40 GMT
Allow: GET, HEAD
Accept-Ranges: bytes
Age: 9450
cf-cache-status: HIT
CF-RAY: (একটা Request ID)
alt-svc: h3=":443"; ma=86400

241
<!doctype html><html lang=en><head><meta charset=utf-8>...<title>Example Domain</title>...
0

# হাতে টাইপ করতে চাইলে: macOS এ nc -c, Linux এ nc -C, তারপর তিনটা লাইন আর একটা ফাঁকা Enter
nc -c example.com 80
GET / HTTP/1.1
Host: example.com
Connection: close
`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনি এইমাত্র Browser এর কাজটা নিজে করলেন। উত্তরটা লাইন ধরে পড়ি,
                কারণ এর প্রায় প্রতিটা লাইন এই Module এর কোনো না কোনো লেসনের দরজা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>HTTP/1.1 200 OK</code>: Status Line। Server একই Version এ
                  উত্তর দিল, ফলাফল সফল।
                </ListItem>
                <ListItem>
                  <code>Content-Type: text/html; charset=utf-8</code>: Body টা একটা
                  HTML পাতা, লেখা UTF-8 এ।
                </ListItem>
                <ListItem>
                  <code>Transfer-Encoding: chunked</code>: Body টুকরো টুকরো আসবে,
                  প্রতিটার আগে তার মাপ। নিচে যে <code>241</code> দেখছেন, ওটা প্রথম
                  টুকরোর মাপ, Hex এ। 0x241 মানে 577 Byte। শেষের <code>0</code> মানে
                  আর কোনো টুকরো নেই। আট নম্বর সেকশনে এর পুরো গল্প।
                </ListItem>
                <ListItem>
                  <code>Connection: close</code>: আপনি চেয়েছিলেন উত্তর দিয়ে
                  Connection বন্ধ করতে, Server রাজি হলো। না চাইলে HTTP/1.1 এ
                  Connection খোলা থাকে, নয় নম্বর সেকশন।
                </ListItem>
                <ListItem>
                  <code>Server: cloudflare</code>, <code>Age: 9450</code> আর{" "}
                  <code>cf-cache-status: HIT</code>: আপনি আসলে example.com এর আসল
                  Server এর সাথে কথা বলেননি। কথা বলেছেন Cloudflare এর একটা কাছের
                  Server এর সাথে, যে পাতাটার একটা কপি 9450 সেকেন্ড ধরে রেখে দিয়েছে।
                  এটা একটা CDN, তেরো নম্বর সেকশনে দেখবেন। Cache এর Header গুলোর
                  বিস্তারিত HTTP Headers লেসনে।
                </ListItem>
                <ListItem>
                  <code>alt-svc: h3=&quot;:443&quot;; ma=86400</code>: Server বলছে,
                  চাইলে পরের বার UDP 443 এ HTTP/3 তে আসতে পারেন, এই খবর একদিন ধরে
                  সত্যি। বারো নম্বর সেকশনে এর মানে বুঝবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                প্রতিদিনের কাজে অবশ্য nc লাগে না, লাগে <strong>curl</strong>। curl
                নিজেই Request লিখে দেয়। আর <code>-v</code> দিলে, মানে Verbose, সে
                দেখায় ঠিক কী পাঠাল আর কী পেল। চিহ্ন তিনটা মনে রাখুন:{" "}
                <code>&gt;</code> দিয়ে শুরু লাইন curl পাঠিয়েছে, <code>&lt;</code>{" "}
                দিয়ে শুরু লাইন Server পাঠিয়েছে, আর <code>*</code> দিয়ে শুরু লাইন
                curl এর নিজের মন্তব্য।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "curl-verbose.sh",
          code: `curl -sv http://example.com/ -o /dev/null

# আসল ফলাফল (CF-RAY সরানো):
* Host example.com:80 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
*   Trying 104.20.23.154:80...
* Connected to example.com (104.20.23.154) port 80
> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Sat, 31 Oct 2026 06:27:44 GMT
< Content-Type: text/html; charset=utf-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< Server: cloudflare
< cf-cache-status: HIT
< alt-svc: h3=":443"; ma=86400
<
{ [589 bytes data]
* Connection #0 to host example.com left intact`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রথম চারটা <code>*</code> লাইনে আগের দুই Module এর গল্প: DNS নাম
              থেকে IP দিল (Module 04), তারপর TCP Connection খুলল (Module 05)।
              তারপর <code>&gt;</code> লাইনগুলো আপনার হাতে লেখা Request এর মতোই,
              শুধু curl নিজে থেকে <code>User-Agent</code> আর <code>Accept</code>{" "}
              যোগ করেছে। শেষ লাইনটা খেয়াল করুন: <em>left intact</em>, মানে curl
              Connection টা বন্ধ করেনি, আবার ব্যবহারের জন্য রেখে দিয়েছে। এবার
              আমরা <code>Connection: close</code> চাইনি, তাই Server ও বলেছে{" "}
              <code>keep-alive</code>।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "আপনি যা পড়তে পারলেন, পথের সবাই তা পড়তে পারে",
          content: (
            <p>
              Port 80 এর সাধারণ HTTP পুরোটা খোলা লেখা। আপনি যেমন nc দিয়ে পড়লেন,
              ঠিক তেমনি ক্যাফের Wi-Fi, বাসার Router, ISP আর পথের প্রতিটা Hop এটা
              পড়তে পারে, চাইলে বদলেও দিতে পারে। Password, Cookie, বুকিং এর তথ্য,
              সব। এই কারণেই আজ প্রায় সব সাইট HTTPS এ চলে। একই পরীক্ষা Port 443 এ
              করলে nc শুধু অর্থহীন Byte দেখাবে, কারণ সেখানে কথা শুরুর আগেই একটা
              Encrypt করা খাম তৈরি হয়। সেই খাম খুলে দেখার যন্ত্র{" "}
              <code>openssl s_client</code>, HTTPS, TLS, and SSL লেসনে চালাবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "host-header",
      subHeader: { index: "006", title: "Host Header" },
      title: <SectionTitle>এক IP, অনেক সাইট: Host Header এর কাজ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বড় অ্যাপার্টমেন্ট ভবনের কথা ভাবুন। ভবনের ঠিকানা একটাই, কিন্তু
                ভেতরে পঞ্চাশটা ফ্ল্যাট। চিঠির খামে শুধু ভবনের ঠিকানা লিখলে দারোয়ান
                চিঠিটা হাতে নিয়ে দাঁড়িয়ে থাকবেন, কোন ফ্ল্যাটে দেবেন বুঝবেন না। খামে
                ফ্ল্যাটের নম্বরটাও লিখতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                Internet এ IP হলো ভবনের ঠিকানা। আর একটা IP তে অনেক সাইট থাকা খুব
                সাধারণ ঘটনা, কারণ একটা Server এ দশটা সাইট চালানো যায়, আর IPv4
                ঠিকানা দামি আর সীমিত (Module 03 এর IP Address লেসন)। সমস্যা হলো,
                DNS যখন নামটাকে IP তে বদলে দেয় (Module 04), তারপর TCP আর IP এর
                স্তরে নামটার আর কোনো চিহ্ন থাকে না। Server এর Kernel শুধু জানে কেউ
                তার 443 Port এ এসেছে। কোন নাম লিখে এসেছে, জানে না।
              </ContentParagraph>
              <ContentParagraph>
                তাই Browser নামটা নিজে Request এর ভেতরে লিখে দেয়, <code>Host</code>{" "}
                Header এ। Server এর সামনের Program, Island Tours এ যেটা Caddy, প্রতিটা
                Request এর Host লাইনটা পড়ে ঠিক করে কোন সাইটের কাছে পাঠাবে। একই IP তে
                অনেক সাইট চালানোর এই কৌশলের নাম <strong>Virtual Hosting</strong>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VirtualHostDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজে পরীক্ষা করে দেখুন। example.com এর IP তেই একটা ভুল নাম দিয়ে
              Request পাঠান, আর একবার Host লাইনটা পুরো বাদ দিয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "wrong-host.sh",
          code: `# একই IP, কিন্তু এমন একটা নাম যেটা এই Server চেনে না
(printf 'GET / HTTP/1.1\\r\\nHost: no-such-site.example\\r\\nConnection: close\\r\\n\\r\\n'; sleep 3) \\
  | nc example.com 80

# আসল উত্তর:
HTTP/1.1 409 Conflict
Content-Type: text/plain; charset=UTF-8
Content-Length: 17
Connection: close
Server: cloudflare

error code: 1001

# Host লাইনটাই নেই
(printf 'GET / HTTP/1.1\\r\\nConnection: close\\r\\n\\r\\n'; sleep 3) | nc example.com 80

# আসল উত্তর:
HTTP/1.1 400 Bad Request
Server: cloudflare
Content-Type: text/html
Content-Length: 155
Connection: close`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই IP, একই Port, একই Path। শুধু একটা লাইন বদলাল, আর উত্তর বদলে
                গেল। প্রথমবার Cloudflare বলল এই নামে তার কাছে কোনো সাইট নেই (তার
                নিজের ভাষায় Error 1001)। দ্বিতীয়বার বলল Request টাই ভুল, কারণ
                HTTP/1.1 এ Host লাইনটা বাধ্যতামূলক।
              </ContentParagraph>
              <ContentParagraph>
                Module 04 এর Domain Setup লেসনে একটা কথা ছিল যেটা তখন একটু রহস্যময়
                লাগতে পারে: DNS এ Record বসানোই যথেষ্ট নয়, যে সেবায় সাইট চলছে সেখানেও
                Domain টা যোগ করতে হয়। কারণটা আপনি এইমাত্র দেখলেন। DNS শুধু
                Request টাকে সঠিক ভবনে পাঠায়। ভবনের দারোয়ান, মানে Server এর
                Program, Host লাইনে লেখা নামটা না চিনলে Request টা ফেরত দেয়। Vercel,
                Cloudflare, যেকোনো Hosting এর Dashboard এ Add Domain বোতামটা আসলে এই
                দারোয়ানকে নামটা শিখিয়ে দেয়।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Caddy এই কাজটা কীভাবে করে, তার একটা নমুনা নিচে।
                প্রতিটা Block এর মাথায় একটা নাম, মানে একটা Host। Caddy এই লেখাটা
                পড়ে বোঝে কোন Host এলে কী করতে হবে। Caddy সামনে এসব Module এ নিজের
                VPS এ বসাবেন, এখন শুধু পড়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile (নমুনা, নিজের নামে বদলে নিন)",
          code: `# Host: islandtours.example এলে ভেতরের App এর কাছে পাঠাও
islandtours.example {
	reverse_proxy 127.0.0.1:3000
}

# Host: www.islandtours.example এলে App কে বিরক্ত না করে নিজেই উত্তর দাও:
# 308, মানে স্থায়ীভাবে সরে গেছে, আসল নামে যান
www.islandtours.example {
	redir https://islandtours.example{uri} 308
}

# ধরি Admin Panel ও একই Server এ, আলাদা Port এ চলে
admin.islandtours.example {
	reverse_proxy 127.0.0.1:3001
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "HTTP/2 তে Host এর নাম :authority, আর HTTPS এ নামটা আরও আগে লাগে",
          content: (
            <p>
              HTTP/2 আর HTTP/3 তে Host Header এর জায়গায় একটা বিশেষ Header আসে, নাম{" "}
              <code>:authority</code>। কাজ হুবহু এক। আর HTTPS এর বেলায় একটা মজার
              ঝামেলা আছে: Host লাইনটা থাকে Encrypt করা খামের ভেতরে, অথচ খাম তৈরির
              সময়ই Server কে জানতে হয় কোন সাইটের Certificate দেখাবে। তাই TLS
              Handshake এর একদম শুরুতে Browser নামটা আলাদা করে একবার বলে দেয়, যাকে
              বলে SNI। HTTPS, TLS, and SSL লেসনে এটা দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "stateless",
      subHeader: { index: "007", title: "Stateless" },
      title: <SectionTitle>Stateless: HTTP কেন কাউকে মনে রাখে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রেলস্টেশনের টিকিট পরীক্ষকের কথা ভাবুন। তিনি দিনে হাজার মানুষ দেখেন,
                কারো মুখ মনে রাখেন না। আপনি দশ মিনিট আগে টিকিট দেখিয়েছিলেন, তাতে
                কিছু যায় আসে না, আবার প্ল্যাটফর্মে ঢুকতে গেলে আবার দেখাতে হবে।
                শুনতে বিরক্তিকর, কিন্তু এর একটা বড় সুবিধা আছে: যেকোনো পরীক্ষক
                যেকোনো যাত্রীকে সামলাতে পারেন। একজন ছুটিতে গেলে আরেকজন এসে বসেন,
                কারো কোনো খাতা হাতবদল করতে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                HTTP ঠিক এই পরীক্ষক। <strong>Stateless</strong> মানে, প্রতিটা Request
                নিজের ভেতরেই সম্পূর্ণ। Server কে বোঝার জন্য যা যা জানা দরকার, সবকিছু
                সেই Request এর ভেতরে থাকতে হয়। প্রোটোকলের দিক থেকে Server আগের
                Request গুলোর কথা মনে রাখে না, রাখার নিয়মও নেই। দুই নম্বর সেকশনের
                চতুর্থ নিয়মটা এটাই: Response এর পরে আদান প্রদানটা শেষ।
              </ContentParagraph>
              <ContentParagraph>
                এভাবে বানানোর কারণ চারটা, আর চারটাই এই Track এর পরের Module গুলোতে
                বারবার ফিরে আসবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>যেকোনো Server যেকোনো Request সামলাতে পারে।</strong> ভিড়
                  বাড়লে দশটা Server বসিয়ে সামনে একটা Load Balancer দিন, সে Request
                  গুলো ভাগ করে দেবে। কোন Server আগে কাকে দেখেছে, সেটা ভাবতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>Server Restart হলে কোনো আলাপ হারায় না।</strong> মনে রাখার
                  কিছু ছিলই না, তাই হারানোরও কিছু নেই। Deploy এর সময় পুরনো Server
                  থামিয়ে নতুনটা চালু করা সহজ হয়।
                </ListItem>
                <ListItem>
                  <strong>Cache আর আবার চেষ্টা করা সহজ।</strong> একটা Request নিজেই
                  সম্পূর্ণ বলে মাঝের কেউ তার উত্তর জমা রেখে পরের একই Request কে
                  দিয়ে দিতে পারে, আর ব্যর্থ হলে একই Request আবার পাঠানো যায়।
                </ListItem>
                <ListItem>
                  <strong>মাঝের যন্ত্রগুলো স্বাধীনভাবে কাজ করতে পারে।</strong> Proxy,
                  CDN, Load Balancer প্রতিটা Request আলাদাভাবে দেখে সিদ্ধান্ত নেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার উল্টোটা ঘটিয়ে দেখি, মানে একটা Server যে মনে রাখার চেষ্টা করে।
                নিচের ছোট Server টা শেষ যে এসেছিল তার নাম একটা Variable এ রেখে দেয়।
                তারপর দুইজন আলাদা পর্যটক পরপর আসেন, আর প্রথমজন জানতে চান, আমি কে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "stateless-bug.mjs",
          code: `// চালান:  LAB_PORT=47622 node stateless-bug.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// ভুল ধারণা: Server মনে রাখবে কে এইমাত্র কথা বলল
let lastVisitor = null;

http
  .createServer((req, res) => {
    const url = new URL(req.url, \`http://\${req.headers.host}\`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    if (url.pathname === "/hello") {
      lastVisitor = url.searchParams.get("name");
      res.end(\`hello \${lastVisitor}\\n\`);
      return;
    }
    if (url.pathname === "/me") {
      // এই Request এ কোনো নাম নেই। Server শুধু আন্দাজ করতে পারে।
      res.end(\`you are \${lastVisitor}\\n\`);
      return;
    }
    res.statusCode = 404;
    res.end("not found\\n");
  })
  .listen(port, "127.0.0.1", () => console.log(\`listening on http://127.0.0.1:\${port}\`));

// আরেক Terminal এ:
//   curl 'http://127.0.0.1:47622/hello?name=tourist-a'   ->  hello tourist-a
//   curl 'http://127.0.0.1:47622/hello?name=tourist-b'   ->  hello tourist-b
//   curl 'http://127.0.0.1:47622/me'                     ->  you are tourist-b
// শেষ প্রশ্নটা করেছিলেন tourist-a, কিন্তু উত্তর গেল tourist-b এর নামে।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ Request টায় কে কথা বলছে, সেই তথ্য Request এর ভেতরে ছিল না। Server
                আন্দাজ করল, আর ভুল আন্দাজ করল। এই একই ভুল Production এ ঘটলে একজন
                পর্যটক আরেকজনের বুকিং দেখে ফেলেন, যা একটা গুরুতর নিরাপত্তা ঘটনা। আর
                Server দুইটা হলে ব্যাপারটা আরও খারাপ হয়, কারণ তখন একটা Server এর
                Variable অন্য Server জানেই না। নিচের Lab এ নিজে চালিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatelessLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে Facebook কীভাবে মনে রাখে যে আপনি লগইন করে আছেন? উত্তর হলো,
                মনে রাখার দায়িত্বটা Request এর ঘাড়ে। লগইনের সময় Server আপনার
                Browser কে একটা ছোট পরিচয়ের টুকরো দেয়, আর Browser এরপর প্রতিটা
                Request এর সাথে সেটা নিজে থেকেই পাঠায়, যেভাবে যাত্রী প্রতিবার
                টিকিট দেখান। সেই টুকরোটার নাম <strong>Cookie</strong>, এই Module এর
                Cookies লেসনের বিষয়। আর Cookie এর ভেতরে কী থাকবে, একটা Session ID যেটা
                Server একটা ভাগ করা খাতায় মিলিয়ে দেখে, নাকি একটা সই করা টিকিট যেটা
                নিজেই নিজের প্রমাণ, সেটা Session vs JWT লেসনের প্রশ্ন।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম তফাত পরিষ্কার রাখুন। <em>প্রোটোকল</em> Stateless মানে
                এই নয় যে <em>App</em> কিছু মনে রাখে না। Island Tours এর App বুকিং,
                পর্যটক, Session সব মনে রাখে। কিন্তু রাখে Database আর Redis এ, যেখানে
                সব Server পৌঁছাতে পারে, কোনো একটা Server এর Memory তে নয়। ঠিক এই
                কারণেই Island Tours একই App এর দুইটা Container পাশাপাশি চালাতে পারে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "একই TCP Connection মানে একই মানুষ, এটা ভাববেন না",
          content: (
            <p>
              Keep-Alive এর কারণে একটা Connection দিয়ে অনেক Request যায়, নয় নম্বর
              সেকশনে দেখবেন। তখন মনে হতে পারে, একই Connection এ যা আসছে তা একই
              মানুষের। Browser থেকে Caddy পর্যন্ত কথাটা সাধারণত সত্যি। কিন্তু Caddy
              থেকে ভেতরের App পর্যন্ত Connection গুলো Caddy নিজে খোলা রাখে আর সব
              পর্যটকের Request সেগুলো দিয়েই পাঠায়। মানে একই Connection এ পরপর তিনটা
              Request আসতে পারে তিনজন আলাদা মানুষের। পরিচয় সবসময় Request এর ভেতর
              থেকে নেবেন, Connection থেকে কখনো নয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "message-length",
      subHeader: { index: "008", title: "Message Length" },
      title: <SectionTitle>Body কোথায় শেষ, সেটা বোঝা যায় কীভাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এর TCP Deep Dive লেসনের একটা কথা এখানে খুব জরুরি হয়ে ওঠে।
                TCP একটা Byte এর ধারা, কোনো বার্তার সারি নয়। Server দুইবারে দুইটা
                লেখা পাঠালে Browser সেগুলো একবারে একসাথে পেতে পারে, আবার একটা লেখা
                তিন টুকরো হয়েও আসতে পারে। ধারার ভেতরে কোথাও কোনো দাগ নেই যেটা বলবে,
                এখানে একটা উত্তর শেষ।
              </ContentParagraph>
              <ContentParagraph>
                Header এর শেষ বোঝা সহজ, ফাঁকা লাইনটাই সেই দাগ। কিন্তু Body এর ভেতরে
                তো যেকোনো কিছু থাকতে পারে, ফাঁকা লাইনও, একটা ছবির Byte ও। তাই Body
                কোথায় শেষ, সেটা আলাদা করে বলে দিতে হয়। HTTP/1.1 এ তার তিনটা উপায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Content-Length।</strong> পাঠানোর আগেই মাপ জানা থাকলে
                  Header এ বলে দেওয়া, Body ঠিক এত Byte। গ্রাহক গুনে গুনে নেয়,
                  গোনা শেষ মানে Body শেষ।
                </ListItem>
                <ListItem>
                  <strong>Transfer-Encoding: chunked।</strong> মাপ আগে জানা না
                  থাকলে, যেমন পাতাটা তৈরি হতে হতে পাঠানো হচ্ছে, Body টুকরো টুকরো
                  পাঠানো। প্রতিটা টুকরোর আগে তার মাপ, Hex সংখ্যায়, আর শেষে মাপ 0 এর
                  একটা খালি টুকরো, যার মানে আর কিছু নেই।
                </ListItem>
                <ListItem>
                  <strong>Connection বন্ধ করে দেওয়া।</strong> সবচেয়ে পুরনো উপায়:
                  Server পাঠানো শেষ করে Connection বন্ধ করে দেয়, আর Module 05 এর FIN
                  দেখে Browser বোঝে Body শেষ। কাজ করে, কিন্তু Connection আর আবার
                  ব্যবহার করা যায় না। তাই আজ প্রায় শুধু Response এ, আর সেটাও কদাচিৎ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <BodyEndSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              ছবির দুইটা উদাহরণই নিচের ছোট Node Server থেকে নেওয়া, যেটা আপনি Lab এ
              চালাবেন। <code>/length</code> পুরো Body আগেই জানে, তাই মাপ বলে দেয়।{" "}
              <code>/chunked</code> আধা সেকেন্ড পরপর একটা করে নৌকার খবর পাঠায়,
              শেষ মাপ কেউ আগে জানে না। curl এর <code>--raw</code> বলে টুকরোগুলো
              জোড়া না লাগিয়ে হুবহু দেখাতে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "length-vs-chunked.sh",
          code: `curl -s -i http://127.0.0.1:47620/length

# আসল ফলাফল:
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 15
Date: Sat, 31 Oct 2026 06:29:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

seats left: 12

curl -s --raw -i http://127.0.0.1:47620/chunked

# আসল ফলাফল, প্রতিটা টুকরো আধা সেকেন্ড পরপর এলো:
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Date: Sat, 31 Oct 2026 06:29:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

d
boat 1 ready

d
boat 2 ready

d
boat 3 ready

0
`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>d</code> হলো Hex এ 13, আর <code>boat 1 ready</code> এর পরে
                লাইন ভাঙার অক্ষর সহ ঠিক 13 Byte। example.com এর উত্তরে যে{" "}
                <code>241</code> দেখেছিলেন, সেটা 577, আর curl এর{" "}
                <code>-w &apos;%&#123;size_download&#125;&apos;</code> দিয়ে মাপলেও ঠিক
                577 আসে। কখন কোনটা ব্যবহার হয়, মোটামুটি নিয়মটা এরকম: ছোট JSON আর
                জমা রাখা ফাইলে মাপ জানা, তাই Content-Length। যে পাতা Server তৈরি
                করতে করতে পাঠায়, যেমন Next.js এর Streaming, বা বড় একটা Export যেটা
                Database থেকে পড়তে পড়তে যায়, সেখানে chunked।
              </ContentParagraph>
              <ContentParagraph>
                Content-Length যদি সত্যি না বলে, তখন কী হয়? দুই দিকেই বিপদ, আর দুইটা
                বিপদের চেহারা একদম আলাদা। নিচের Lab এ মাপটা কম, ঠিক আর বেশি করে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ContentLengthLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "মাপটা Byte এ, অক্ষরে নয়, আর বাংলায় তফাতটা বড়",
          content: (
            <div className="space-y-3">
              <p>
                JavaScript এর <code>.length</code> অক্ষর গোনে, Content-Length চায়
                Byte। ইংরেজি অক্ষরে দুইটা সমান, তাই ভুলটা Development এ ধরা পড়ে না।
                বাংলা লেখা UTF-8 এ সাধারণত প্রতি অক্ষরে তিন Byte, তাই প্রথম বাংলা নামের
                বুকিংটাই ভেঙে যায়। নিচের সংখ্যাগুলো আসল, Node এ চালিয়ে নেওয়া।
              </p>
              <pre className="font-mono text-[0.75rem] bg-muted/30 border border-border px-3 py-2 overflow-x-auto">
{`"seats=2"        length 7    bytes 7
"আসন"            length 3    bytes 9
"সেন্ট মার্টিন"    length 13   bytes 37`}
              </pre>
              <p>
                সমাধান সহজ: নিজে হাতে Content-Length লিখবেন না। Node এর{" "}
                <code>res.end(body)</code>, Express, NestJS, Next.js সবাই নিজেরাই
                ঠিকভাবে গুনে দেয়। একান্ত লিখতেই হলে <code>Buffer.byteLength(body)</code>{" "}
                ব্যবহার করবেন, <code>body.length</code> কখনো নয়।
              </p>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "keep-alive",
      subHeader: { index: "009", title: "Keep-Alive" },
      title: <SectionTitle>Keep-Alive: একটা Connection, অনেক Request</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা TCP Connection খোলা বিনা খরচে হয় না। Module 05 এর Three-way
                Handshake লেসনে দেখেছেন, প্রথম Byte পাঠানোর আগেই একটা পুরো Round
                Trip চলে যায়, মানে Packet টা ওপাশে গিয়ে ফিরে আসার সময়। HTTPS হলে তার
                উপরে TLS এর আরও অন্তত একটা। ধরি ঢাকা থেকে Server পর্যন্ত একটা Round
                Trip এ 50 ms। তাহলে প্রতিটা নতুন Connection এ শুধু হাত মেলাতেই 100 ms,
                কোনো কাজ শুরুর আগেই।
              </ContentParagraph>
              <ContentParagraph>
                HTTP/1.0 এর স্বাভাবিক নিয়ম ছিল, প্রতিটা Response এর পরে Connection
                বন্ধ। মানে পাঁচটা ছবিওয়ালা একটা পাতায় ছয়বার হাত মেলানো, ছয়বার বিদায়।
                HTTP/1.1 এই নিয়মটা উল্টে দিল। এখন স্বাভাবিক নিয়ম হলো Connection খোলা
                রাখা, যাতে পরের Request একই রাস্তা দিয়ে যেতে পারে। এর নাম{" "}
                <strong>Persistent Connection</strong>, প্রতিদিনের ভাষায়{" "}
                <strong>Keep-Alive</strong>। কেউ বন্ধ করতে চাইলে বলে দেয়{" "}
                <code>Connection: close</code>, যেমন আপনি nc এর পরীক্ষায় বলেছিলেন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <KeepAliveSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিজের Server এ দেখুন। curl কে একসাথে দুইটা URL দিলে সে প্রথমটার
              Connection দ্বিতীয়টার জন্য আবার ব্যবহার করে। আর Server এর Log এ
              প্রতিটা Request এর পাশে লেখা থাকে Client এর Port, মানে কোন TCP
              Connection থেকে এলো। Port এক থাকা মানে Connection এক।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "reuse.sh",
          code: `# দুইটা URL, একটা curl
curl -sv http://127.0.0.1:47620/length http://127.0.0.1:47620/ 2>&1 \\
  | grep -E 'Connected|Re-using|left intact|^> GET'

# আসল ফলাফল:
* Connected to 127.0.0.1 (127.0.0.1) port 47620
> GET /length HTTP/1.1
* Connection #0 to host 127.0.0.1 left intact
* Re-using existing connection with host 127.0.0.1
> GET / HTTP/1.1
* Connection #0 to host 127.0.0.1 left intact

# Server এর Log, দুইটা Request একই Port থেকে:
GET /length HTTP/1.1  from port 53126
GET / HTTP/1.1  from port 53126

# এবার HTTP/1.0 এর ভাষায় চাইলে Server নিজেই বন্ধের কথা বলে:
curl -s -i --http1.0 http://127.0.0.1:47620/length
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 15
Date: Sat, 31 Oct 2026 06:32:12 GMT
Connection: close`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Connection খোলা রাখা মানে Server এর একটা খরচ, Kernel এর খাতায় একটা
                পাতা আর একটা File Descriptor (Module 05 এর Port and Socket লেসন)।
                তাই কেউ চিরকাল খোলা রাখে না। কিছুক্ষণ চুপচাপ থাকলে Server
                Connection বন্ধ করে দেয়। এই সময়টার নাম{" "}
                <strong>Keep-Alive Timeout</strong> বা Idle Timeout। উপরের উত্তরে{" "}
                <code>Keep-Alive: timeout=5</code> লাইনটা খেয়াল করুন: Node বলে দিচ্ছে
                সে পাঁচ সেকেন্ড অপেক্ষা করবে। Node এর এই Default মান 5000 ms, আর
                Node 24.6 থেকে সে ভেতরে আরও এক সেকেন্ড বাড়তি ধৈর্য রাখে, যাকে বলে{" "}
                <code>keepAliveTimeoutBuffer</code>। মানে মুখে বলে পাঁচ, আসলে বন্ধ
                করে ছয় সেকেন্ডে, যাতে Client পাঁচ শুনে আগেই সরে যায়।
              </ContentParagraph>
              <ContentParagraph>
                এই লেসন বানানোর সময় একটা ঘটনা ঘটেছিল যেটা বলার মতো। Lab এর একটা
                Script প্রথমে লেখা হয়েছিল ঠিক ছয় সেকেন্ড চুপ থেকে আবার Request
                পাঠানোর জন্য। ফলাফল: <code>ECONNRESET</code>। Client যে মুহূর্তে
                পুরনো Connection এ নতুন Request পাঠাল, ঠিক সেই মুহূর্তে Server সেটা
                বন্ধ করছিল। Module 05 এর Connection Close লেসনে এই দৌড়টার কথা ছিল,
                আর সেখান থেকেই নিয়মটা এসেছে: পেছনের জনের ধৈর্য সামনের জনের চেয়ে
                বেশি হতে হবে। Caddy যদি ৬০ সেকেন্ড চুপ Connection রাখে, তার পেছনের App
                কে রাখতে হবে তার চেয়ে বেশি, নইলে মাঝে মাঝে 502 আসবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Keep-Alive দুইটা আলাদা জিনিসের নাম, গুলিয়ে ফেলবেন না",
          content: (
            <p>
              HTTP এর Keep-Alive মানে একটা Response এর পরে Connection খোলা রাখা, যাতে
              পরের Request সেটা ব্যবহার করতে পারে। TCP এর Keepalive, যেটা Module 05
              এর Connection Close লেসনে দেখেছেন, একদম আলাদা: চুপ থাকা Connection এ
              মাঝে মাঝে ছোট একটা Probe পাঠিয়ে দেখা ওপাশটা বেঁচে আছে কি না। নাম প্রায়
              এক, কাজ আলাদা, তারও আলাদা জায়গায়। প্রথমটা Application তলার, দ্বিতীয়টা
              Kernel এর।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "versions",
      subHeader: { index: "010", title: "HTTP Versions" },
      title: <SectionTitle>HTTP/0.9 থেকে HTTP/1.1: সমস্যা আর সমাধানের গল্প</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTP এর Version গুলো মুখস্থ করার তালিকা নয়। প্রতিটা Version এসেছে
                আগেরটার একটা নির্দিষ্ট যন্ত্রণা সারাতে। আর একটা জিনিস প্রথমেই মনে
                রাখুন, তাহলে বাকিটা সহজ হয়ে যায়: প্রতিটা Version এ <em>কথার মানে</em>{" "}
                একই থেকে গেছে। GET মানে চাওয়া, 404 মানে পাওয়া যায়নি, Content-Type
                মানে Body এর ধরন, সব Version এ। বদলেছে শুধু <em>তারে পাঠানোর
                কায়দা</em>। আজকের নিয়মের কাগজও এভাবেই ভাগ করা: RFC 9110 বলে মানে কী,
                আর RFC 9112, 9113, 9114 বলে HTTP/1.1, HTTP/2 আর HTTP/3 তারে কীভাবে
                লেখা হয়।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ পাঁচটা Version এক এক করে খুলুন। প্রতিটার নিচে লেখা যে
                সমস্যাটা রয়ে গেল, আর পরের বোতামটা দেখায় পরের Version কীভাবে সেটা
                সারাল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VersionTimelineLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTP/0.9 এর একটা মজার পরীক্ষা করা যায়। সেই সময়ের Request ছিল শুধু
                এক লাইন, কোনো Version নেই, কোনো Header নেই। আজকের একটা Server কে
                এভাবে জিজ্ঞেস করলে দেখুন কী হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "http-0.9.sh",
          code: `# ১৯৯১ সালের মতো এক লাইনের Request
(printf 'GET /\\r\\n'; sleep 3) | nc example.com 80

# আসল উত্তর, পুরোটা এটুকুই:
Cloudflare encountered an error processing this request:`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উত্তরে কোনো Status Line নেই, কোনো Header নেই, শুধু এক লাইন লেখা, তারপর
                Connection বন্ধ। মানে Server টা ঠিক HTTP/0.9 এর ঢঙেই উত্তর দিল, আর
                সেই ঢঙে ভুল জানানোর কোনো উপায় নেই বলে শুধু একটা লেখা পাঠাল। Program এর
                পক্ষে এটা বোঝা অসম্ভব যে এটা ভুল নাকি আসল পাতা। HTTP/1.0 এর Status
                Code ঠিক এই সমস্যার সমাধান।
              </ContentParagraph>
              <ContentParagraph>
                এবার HTTP/1.1 এর যে সমস্যাটা আজও আপনার চোখে পড়বে, সেটা একটু ধরে
                বোঝা দরকার। একটা HTTP/1.1 Connection এ একসাথে শুধু একটা Response
                চলতে পারে। Browser Request পাঠাল, উত্তর পুরো না আসা পর্যন্ত সেই
                Connection এ আর কিছু চাইতে পারবে না। সামনের উত্তরটা ধীর হলে পেছনের
                সবাই লাইনে দাঁড়িয়ে থাকে, যেমন ব্যাংকের একটা কাউন্টারে সামনের একজনের
                জটিল কাজে পুরো লাইন আটকে যায়। এর নাম{" "}
                <strong>Head-of-Line Blocking</strong>, লাইনের মাথার কারণে আটকে থাকা।
              </ContentParagraph>
              <ContentParagraph>
                HTTP/1.1 একটা সমাধানের চেষ্টা করেছিল, নাম Pipelining: উত্তরের অপেক্ষা
                না করে পরপর অনেক Request পাঠিয়ে দেওয়া। কিন্তু উত্তরগুলো তবুও ক্রম
                মেনেই আসতে হতো, আর মাঝের অনেক Proxy এটা ঠিকমতো সামলাতে পারত না। শেষে
                Browser গুলো এটা বন্ধই করে দিল। তার বদলে Browser একটা Host এর জন্য
                সাধারণত ছয়টা পর্যন্ত Connection খোলে, ছয়টা কাউন্টার। সেই যুগের
                Developer রা আরও কৌশল বের করেছিলেন: সব JavaScript এক ফাইলে জুড়ে
                দেওয়া, সব ছোট ছবি একটা বড় ছবিতে বসানো, ফাইলগুলো কয়েকটা আলাদা
                Subdomain এ ছড়িয়ে দেওয়া যাতে ছয়ের সীমা বারবার পাওয়া যায়। এই কৌশলগুলো
                পুরনো লেখায় দেখলে এখন বুঝবেন কেন ছিল।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "http2",
      subHeader: { index: "011", title: "HTTP/2" },
      title: <SectionTitle>HTTP/2: একটা রাস্তায় অনেক কথা একসাথে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTP/2 এর মূল চিন্তাটা সহজ: ছয়টা কাউন্টার খোলার বদলে একটাই
                কাউন্টার রাখি, কিন্তু সেই কাউন্টারে সবার কাজ একটু একটু করে পালা করে
                চলুক। এর জন্য তিনটা বড় বদল আনা হলো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেখার বদলে Binary Frame।</strong> HTTP/2 তে Message আর
                  লাইন ধরে লেখা হয় না। সবকিছু ছোট ছোট টুকরোয় ভাগ হয়, যার নাম{" "}
                  <strong>Frame</strong>। প্রতিটা Frame এর মাথায় লেখা থাকে সে কোন
                  ধরনের (Header বহন করছে নাকি Body, যাদের নাম HEADERS আর DATA), কত
                  বড়, আর কোন Stream এর।
                </ListItem>
                <ListItem>
                  <strong>Stream আর Multiplexing।</strong> প্রতিটা Request আর তার
                  Response মিলে একটা <strong>Stream</strong>, যার একটা নম্বর আছে।
                  একটা TCP Connection এর ভেতরে একসাথে অনেক Stream চলতে পারে, তাদের
                  Frame গুলো একটার ফাঁকে আরেকটা ঢুকে যায়। ওপাশে Stream নম্বর দেখে
                  আবার আলাদা করে সাজানো হয়। এক রাস্তায় অনেক কথা মিশিয়ে পাঠানোর নাম{" "}
                  <strong>Multiplexing</strong>। কেউ আর কারো জন্য লাইনে দাঁড়ায় না।
                </ListItem>
                <ListItem>
                  <strong>HPACK দিয়ে Header ছোট করা।</strong> একটা পাতার পঞ্চাশটা
                  Request এ <code>User-Agent</code>, <code>Accept</code>, Cookie
                  প্রায় একই থাকে। HTTP/1.1 প্রতিবার পুরোটা আবার লেখে। HTTP/2 এর দুই
                  পাশ একটা যৌথ তালিকা রাখে, আর একবার পাঠানো Header পরের বার শুধু তার
                  তালিকার নম্বর দিয়ে পাঠানো যায়। এই কৌশলের নাম HPACK।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <MultiplexDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                HTTP/2 তে Request Line আর Status Line ও আর নেই। তাদের টুকরোগুলো এখন
                বিশেষ কিছু Header, যাদের নাম শুরু হয় কোলন দিয়ে:{" "}
                <code>:method</code>, <code>:path</code>, <code>:scheme</code>,{" "}
                <code>:authority</code> (Host এর কাজ করে), আর উত্তরে{" "}
                <code>:status</code>। এদের বলে Pseudo-Header। আর সব Header এর নাম
                বাধ্যতামূলকভাবে ছোট হাতের অক্ষরে, কারণ HPACK এর তালিকায় একই জিনিস
                দুই চেহারায় রাখার মানে হয় না।
              </ContentParagraph>
              <ContentParagraph>
                একটা Server HTTP/2 বোঝে কি না, Browser জানে কীভাবে? এই Module এ আমরা
                যে Browser এর কথা বলছি, তারা HTTP/2 শুধু HTTPS এর উপরেই চালায়। আর
                HTTPS এর খাম তৈরির সময়, TLS Handshake এর ভেতরেই, Browser একটা ছোট
                তালিকা দেয়: আমি h2 আর http/1.1 বুঝি। Server একটা বেছে নেয়। এই কথোপকথনের
                নাম <strong>ALPN</strong>, আর এর বিস্তারিত HTTPS, TLS, and SSL
                লেসনে। নিচে curl দিয়ে নিজেই দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "which-version.sh",
          code: `# একই সাইট, দুই Version এ
curl -sI --http1.1 https://example.com | head -3
HTTP/1.1 200 OK
Date: Sat, 31 Oct 2026 06:27:49 GMT
Content-Type: text/html; charset=utf-8

curl -sI --http2 https://example.com | head -3
HTTP/2 200
date: Sat, 31 Oct 2026 06:27:49 GMT
content-type: text/html; charset=utf-8

# শুধু Version টা জানতে
curl -s -o /dev/null -w '%{http_version}\\n' https://example.com
2

# TLS এর ভেতরে ALPN এর দরদাম
curl -sv https://example.com -o /dev/null 2>&1 | grep ALPN
* ALPN: curl offers h2,http/1.1
* ALPN: server accepted h2`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দেখুন, HTTP/2 এর উত্তরে Reason Phrase নেই, শুধু <code>200</code>, আর
                Header এর নাম ছোট হাতের অক্ষরে। curl এগুলো পড়ার মতো করে দেখাচ্ছে,
                আসলে তারে গেছে Binary Frame।
              </ContentParagraph>
              <ContentParagraph>
                HTTP/2 এর শুরুতে আরেকটা জিনিস ছিল, Server Push: Browser চাওয়ার আগেই
                Server নিজে থেকে CSS আর JavaScript পাঠিয়ে দেওয়া। শুনতে চমৎকার, কিন্তু
                বাস্তবে Server প্রায়ই এমন জিনিস পাঠাত যা Browser এর কাছে আগে থেকেই
                Cache এ ছিল। Chrome ২০২২ সালে এটা বন্ধ করে দেয়। তার বদলে এখন আছে 103
                Early Hints, মানে আসল উত্তরের আগে একটা ছোট আগাম খবর, এগুলো লাগবে।
                পরের লেসনে এই Code টা দেখবেন।
              </ContentParagraph>
              <ContentParagraph>
                তাহলে HTTP/2 কি সব সমস্যা সারিয়ে দিল? প্রায়, একটা বাদে। Head-of-Line
                Blocking HTTP এর স্তর থেকে চলে গেল, কিন্তু নিচে TCP এর স্তরে রয়ে গেল।
                TCP Deep Dive লেসনে দেখেছেন, TCP কথা দেয় Byte গুলো ঠিক ক্রমে দেবে।
                তাই একটা Packet হারালে, সেটা আবার না আসা পর্যন্ত TCP তার পরের সব
                Byte আটকে রাখে, এমনকি সেগুলো অন্য Stream এর হলেও। TCP জানেই না
                ভেতরে Stream বলে কিছু আছে। ফলে ভালো Network এ HTTP/2 দারুণ, কিন্তু
                খারাপ Mobile Network এ, যেখানে Packet প্রায়ই হারায়, একটা হারানো Packet
                সব Stream কে একসাথে থামিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "http3",
      subHeader: { index: "012", title: "HTTP/3 and QUIC" },
      title: <SectionTitle>HTTP/3: TCP ছেড়ে UDP এর উপরে QUIC</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                TCP এর আটকে থাকা সারাতে TCP কে বদলানো প্রায় অসম্ভব, কারণ TCP থাকে
                প্রতিটা যন্ত্রের Kernel এ আর পথের হাজার হাজার Router আর Firewall এ।
                তাই HTTP/3 অন্য পথ নিল। সে TCP ছেড়ে দিল, আর UDP এর উপরে একটা নতুন
                Transport বানাল, নাম <strong>QUIC</strong>। Module 05 এর UDP Deep
                Dive লেসন মনে করুন: UDP প্রায় কিছুই কথা দেয় না, শুধু Datagram পৌঁছে
                দেওয়ার চেষ্টা করে। ঠিক সেই কারণেই সে একটা খালি ক্যানভাস, যার উপরে QUIC
                নিজের মতো নিয়ম আঁকতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                QUIC নিজেই নির্ভরযোগ্যতা দেয়, হারানো Packet আবার পাঠায়, ক্রম মেলায়,
                গতি সামলায়, ঠিক TCP এর মতো। কিন্তু একটা বড় তফাতে। QUIC জানে ভেতরে
                Stream আছে, আর প্রতিটা Stream এর ক্রম আলাদাভাবে রাখে। একটা Stream এর
                Packet হারালে শুধু সেই Stream অপেক্ষা করে, বাকিরা নিজের মতো চলতে
                থাকে।
              </ContentParagraph>
              <ContentParagraph>আরও তিনটা সুবিধা আছে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুরু দ্রুত।</strong> TCP তে আগে TCP Handshake, তারপর
                  আলাদা করে TLS Handshake। QUIC এ TLS 1.3 ভেতরেই গাঁথা, তাই দুইটা
                  একসাথে এক Round Trip এ হয়ে যায়। আগে কথা হয়ে থাকলে আরও দ্রুত, যাকে
                  বলে 0-RTT, যার নিজের কিছু ঝুঁকি আছে, HTTPS, TLS, and SSL লেসনে।
                </ListItem>
                <ListItem>
                  <strong>Network বদলালেও Connection টিকে থাকে।</strong> Module 05 এর
                  Port and Socket লেসনে দেখেছেন, একটা TCP Connection এর পরিচয় চারটা
                  সংখ্যা: দুই পাশের IP আর Port। পর্যটক বাসার Wi-Fi থেকে বেরিয়ে Mobile
                  Data তে গেলেন, Module 03 এর শেষ লেসনের মতো, তাঁর IP বদলে গেল। চারটা
                  সংখ্যার একটা বদলানো মানে TCP এর চোখে সেটা আর সেই Connection নয়, সব
                  আবার শুরু থেকে। QUIC এর Connection এর পরিচয় একটা আলাদা নম্বর,
                  Connection ID, যেটা IP বদলালেও একই থাকে। ডাউনলোড মাঝপথে থামে না।
                </ListItem>
                <ListItem>
                  <strong>সবসময় Encrypt করা।</strong> QUIC এ খাম ছাড়া কোনো কথা হয় না।
                  HTTP/3 মানেই HTTPS।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Browser কীভাবে জানে একটা Server HTTP/3 বোঝে? প্রথমবার সে সাধারণত
                HTTP/2 তে যায়। আর উত্তরের সাথে Server একটা Header দিয়ে খবরটা দেয়।
                example.com এর উত্তরে সেটা আপনি nc আর curl দুই জায়গাতেই দেখেছেন:{" "}
                <code>alt-svc: h3=&quot;:443&quot;; ma=86400</code>। মানে, একটা বিকল্প
                সেবা (Alternative Service) আছে: h3, মানে HTTP/3, একই Host এর Port
                443 এ, তবে UDP তে। <code>ma</code> মানে max-age, খবরটা 86400 সেকেন্ড,
                মানে একদিন সত্যি। Browser এটা মনে রাখে আর পরের Request গুলো HTTP/3
                তে চেষ্টা করে। DNS এর HTTPS নামের একটা নতুন Record দিয়েও এই খবরটা
                আগেই দেওয়া যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "http3-check.sh",
          code: `# এই Mac এর curl এ HTTP/3 নেই, আর সেটা সে পরিষ্কার বলে দেয়:
curl -sI --http3 https://example.com
curl: option --http3: the installed libcurl version doesn't support this

# তাই HTTP/3 নিজের চোখে দেখার সহজ জায়গা Browser এর DevTools:
#   Network tab, যেকোনো কলামের নামে Right Click, Protocol চালু করুন।
#   h3 মানে HTTP/3, h2 মানে HTTP/2, http/1.1 মানে HTTP/1.1।
#   প্রথম Load এ h2 দেখা গেলে পাতাটা আরেকবার Reload করুন, alt-svc মনে রেখে
#   Browser এবার h3 চেষ্টা করবে।`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ProtocolLossLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "HTTP/1.1", "HTTP/2", "HTTP/3"],
          rows: [
            ["নিচে কী", "TCP", "TCP", "QUIC, UDP এর উপরে"],
            ["তারে কীভাবে", "লেখা, লাইন ধরে", "Binary Frame", "Binary Frame"],
            ["এক Connection এ একসাথে", "একটা উত্তর", "অনেক Stream", "অনেক Stream"],
            ["Packet হারালে", "সেই Connection থামে", "সব Stream থামে", "শুধু সেই Stream থামে"],
            ["Header ছোট করা", "নেই", "HPACK", "QPACK"],
            ["শুরুর Round Trip, HTTPS সহ", "TCP 1 + TLS 1", "TCP 1 + TLS 1", "একসাথে 1"],
            ["Encrypt বাধ্যতামূলক", "না", "Browser এ হ্যাঁ", "সবসময়"],
            ["Port", "TCP 80 বা 443", "TCP 443", "UDP 443"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "HTTP/3 চালু করলে Firewall এ UDP 443 খুলতে ভুলবেন না",
          content: (
            <p>
              Module 05 এর Port and Socket লেসনের Firewall তালিকায় UDP 443 এর পাশে
              লেখা ছিল ঐচ্ছিক। কারণটা এখন পরিষ্কার: এটা শুধু HTTP/3 এর জন্য। খোলা না
              থাকলে কিছু ভাঙে না, Browser নিঃশব্দে HTTP/2 তে ফিরে যায়, শুধু HTTP/3
              এর সুবিধাটা পাওয়া যায় না। আবার কিছু অফিস আর Network UDP 443 আটকে রাখে,
              তখনও একই ঘটনা। তাই HTTP/3 কখনো একা চলে না, সবসময় HTTP/2 পেছনে থাকে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "intermediaries",
      subHeader: { index: "013", title: "Intermediaries" },
      title: <SectionTitle>Browser আর App এর মাঝে যারা দাঁড়িয়ে থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ ছবিটা ছিল সরল: একদিকে Client, অন্যদিকে Server। বাস্তবে মাঝখানে
                প্রায় সবসময় কেউ না কেউ থাকে। example.com এর পরীক্ষাতেই দেখেছেন, উত্তর
                দিয়েছিল Cloudflare, আসল Server নয়। এই মাঝের যন্ত্রগুলোকে বলে{" "}
                <strong>Intermediary</strong>। চার ধরনের সাথে আপনার প্রায়ই দেখা হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Forward Proxy।</strong> থাকে Client এর দিকে, Client এর হয়ে
                  কাজ করে। অফিস বা বিশ্ববিদ্যালয়ের Network এ প্রায়ই থাকে: সবার Request
                  তার ভেতর দিয়ে যায়, সে কিছু সাইট আটকায়, কিছু Cache করে। Server এর
                  চোখে সব Request আসে Proxy থেকে।
                </ListItem>
                <ListItem>
                  <strong>Reverse Proxy।</strong> থাকে Server এর দিকে, Server এর হয়ে
                  কাজ করে। বাইরের সবার জন্য একটাই দরজা। Island Tours এ এটা Caddy: সে
                  HTTPS এর খাম খোলে, Host দেখে ঠিক App এ পাঠায়, উত্তর Compress করে।
                  ভেতরের App কে কখনো সরাসরি Internet এর মুখোমুখি হতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>CDN, Content Delivery Network।</strong> পৃথিবীর নানা শহরে
                  ছড়ানো অনেক Reverse Proxy, যারা জনপ্রিয় ফাইলের কপি নিজের কাছে রাখে।
                  ঢাকার পর্যটক ছবি পান ঢাকার কাছের Server থেকে, অন্য মহাদেশ থেকে নয়।
                  example.com এর <code>Server: cloudflare</code>,{" "}
                  <code>Age</code> আর <code>cf-cache-status: HIT</code> লাইনগুলো
                  ঠিক এটাই বলছিল।
                </ListItem>
                <ListItem>
                  <strong>Load Balancer।</strong> অনেকগুলো একই রকম Server এর সামনে
                  বসে Request গুলো তাদের মাঝে ভাগ করে দেয়। Stateless এর সেকশনের Lab
                  এ যে পালা করে A আর B তে পাঠাচ্ছিল, সে এটাই।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IntermediariesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ছবির সবচেয়ে জরুরি কথাটা তীরগুলোতে। প্রতিটা Intermediary একটা পুরো HTTP
                Request গ্রহণ করে, তারপর পরের জনকে নিজে একটা নতুন Request পাঠায়,
                আলাদা একটা TCP Connection এ। মানে Browser থেকে App পর্যন্ত একটা
                লম্বা আলাপ নয়, কয়েকটা আলাদা আলাপের একটা শিকল। এর তিনটা ফল আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা ধাপের Version আলাদা হতে পারে।</strong> Island Tours
                  এ Browser আর Caddy কথা বলে HTTP/2 বা HTTP/3 তে। Caddy আর App কথা
                  বলে একই যন্ত্রের ভেতরে সাধারণ HTTP/1.1 এ, খাম ছাড়া, কারণ সেই রাস্তা
                  কখনো যন্ত্রের বাইরে যায় না।
                </ListItem>
                <ListItem>
                  <strong>App এর চোখে Client হলো Caddy।</strong> App যখন দেখে
                  Request টা কোন IP থেকে এলো, দেখে <code>127.0.0.1</code>, কারণ TCP
                  Connection টা খুলেছে Caddy। পর্যটকের আসল IP জানতে Caddy একটা Header
                  যোগ করে দেয়, <code>X-Forwarded-For</code>। Module 04 এর Cloudflare
                  লেসনের <code>CF-Connecting-IP</code> ঠিক এই একই সমস্যার সমাধান।
                  এই Header গুলোর পুরো গল্প HTTP Headers লেসনে।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা ধাপের নিজের Timeout।</strong> নয় নম্বর সেকশনের
                  Keep-Alive এর দৌড় প্রতিটা জোড়ার মাঝে আলাদা করে ঘটতে পারে। একটা 502
                  পেলে প্রথম প্রশ্ন, কোন জোড়ার মাঝে আলাপটা ভাঙল।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "own-server",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের HTTP Server, আর Browser এর DevTools</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার উল্টো দিকে বসুন। Client হয়ে অনেক কথা বলেছেন, এবার নিজে Server
                হবেন। Node এর সাথেই আসে <code>node:http</code>, যেটা দিয়ে কয়েক
                লাইনে একটা পুরো HTTP Server বানানো যায়। নিচের Server টা এই লেসনের Lab
                এ বারবার কাজে লাগবে। Port টা Code এ লেখা নেই, আসে{" "}
                <code>LAB_PORT</code> নামের Environment Variable থেকে, আর না থাকলে
                Server চালুই হয় না। চুপচাপ একটা আন্দাজের Port এ বসে পড়ার চেয়ে এটা
                অনেক ভালো, কারণ ভুলটা সাথে সাথে চোখে পড়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "2-tiny-server.mjs",
          code: `// চালান:  LAB_PORT=47620 node 2-tiny-server.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const server = http.createServer((req, res) => {
  // প্রতিটা Request এর প্রথম লাইন, আর কোন Port থেকে এলো (মানে কোন TCP Connection)
  console.log(\`\${req.method} \${req.url} HTTP/\${req.httpVersion}  from port \${req.socket.remotePort}\`);

  if (req.url === "/length") {
    // পুরো Body আগে থেকেই জানা, তাই আগেই বলে দেওয়া যায় কত Byte আসছে
    const body = "seats left: 12\\n";
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
    return;
  }

  if (req.url === "/chunked") {
    // Body তৈরি হচ্ছে ধীরে ধীরে, শেষ মাপ কেউ জানে না, তাই টুকরো টুকরো
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("boat 1 ready\\n");
    setTimeout(() => res.write("boat 2 ready\\n"), 500);
    setTimeout(() => res.end("boat 3 ready\\n"), 1000);
    return;
  }

  // শুধু Body দিলাম, Content-Length টা Node নিজে গুনে বসাবে
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("hello from my own HTTP server\\n");
});

server.listen(port, "127.0.0.1", () => {
  console.log(\`listening on http://127.0.0.1:\${port}\`);
  console.log(\`keep-alive timeout: \${server.keepAliveTimeout} ms\`);
});`,
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "talk-to-own-server.sh",
          code: `curl -sv http://127.0.0.1:47620/ 2>&1 | grep -E '^[<>]'

# আসল ফলাফল:
> GET / HTTP/1.1
> Host: 127.0.0.1:47620
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=utf-8
< Date: Sat, 31 Oct 2026 06:30:01 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 30
<

# Server এর Terminal এ:
listening on http://127.0.0.1:47620
keep-alive timeout: 5000 ms
GET / HTTP/1.1  from port 52532`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Code এ আপনি লিখেছিলেন শুধু একটা Header, Content-Type। বাকি চারটা Node
                নিজে যোগ করেছে: <code>Date</code>, <code>Connection: keep-alive</code>,{" "}
                <code>Keep-Alive: timeout=5</code>, আর <code>Content-Length: 30</code>,
                কারণ <code>res.end</code> এ পুরো Body একবারে দেওয়ায় সে গুনে নিতে
                পেরেছে। একটা মজার তফাত আছে, Lab এ নিজে ধরবেন: যদি{" "}
                <code>res.writeHead</code> দিয়ে Header আগেই পাকা করে ফেলেন আর
                Content-Length না দেন, তাহলে Node আর মাপ জানে না, তখন সে নিজে থেকেই{" "}
                <code>Transfer-Encoding: chunked</code> বেছে নেয়।
              </ContentParagraph>
              <ContentParagraph>
                এবার Browser এর চোখ দিয়ে দেখার পালা। প্রতিটা Browser এ একটা যন্ত্র আছে
                যেটা প্রতিটা Request আর Response দেখায়, নাম{" "}
                <strong>DevTools</strong>, আর তার ভেতরের <strong>Network</strong>{" "}
                tab টা এই Module এর সবচেয়ে কাজের জানালা। নিচের ধাপগুলো একবার নিজে করে
                নিন, তারপর এই Module এর প্রতিটা লেসনে এটা খোলা রাখবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "DevTools খুলুন",
              description:
                "Chrome বা Edge এ F12, অথবা macOS এ Cmd + Option + I। উপরের সারি থেকে Network বেছে নিন। তারপর পাতাটা Reload করুন, কারণ Network tab শুধু খোলার পরের Request গুলোই ধরে।",
            },
            {
              title: "সারিগুলো পড়ুন",
              description:
                "প্রতিটা সারি একটা Request। Name মানে কোন ফাইল, Status মানে Status Code, Type মানে কী ধরনের জিনিস, Size কত বড়, Time কত সময় লাগল। নিচের দিকে লেখা থাকে মোট কয়টা Request হলো।",
            },
            {
              title: "Protocol কলাম চালু করুন",
              description:
                "যেকোনো কলামের নামে Right Click করে Protocol বেছে নিন। এখন প্রতিটা সারির পাশে দেখবেন http/1.1, h2 বা h3। একই পাতার ভেতরেও আলাদা ফাইল আলাদা Server থেকে আলাদা Version এ আসতে পারে।",
            },
            {
              title: "একটা Request এ চাপ দিন",
              description:
                "ডান দিকে খুলবে Headers tab। General অংশে Request URL, Request Method, Status Code আর Remote Address, মানে কোন IP আর Port এ কথা হলো। নিচে Response Headers আর Request Headers আলাদা করে। Raw লেখা চালু করলে HTTP/1.1 এর লেখার মতো করে দেখায়।",
            },
            {
              title: "Response আর Timing দেখুন",
              description:
                "Response বা Preview tab এ Body টা। Timing tab এ সময়টা ভাগ ভাগ করে: DNS, Connection, TLS, অপেক্ষা, ডাউনলোড। এই ভাগগুলোর মানে পুরোটা বুঝবেন Full HTTPS Journey লেসনে।",
            },
            {
              title: "দুইটা ছোট চেকবক্স চিনে রাখুন",
              description:
                "Preserve log চালু থাকলে অন্য পাতায় গেলেও আগের Request গুলো মোছে না, Redirect দেখার সময় খুব কাজের। Disable cache চালু থাকলে Browser নিজের জমানো কপি ব্যবহার করে না, প্রতিটা ফাইল নতুন করে আনে।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Copy as cURL খুব কাজের, কিন্তু কাউকে পাঠানোর আগে দেখে নিন",
          content: (
            <p>
              Network tab এ যেকোনো Request এ Right Click করলে Copy as cURL পাবেন। এটা
              হুবহু সেই Request টা একটা curl কমান্ড বানিয়ে দেয়, Terminal এ চালিয়ে
              আবার পাঠানো যায়, Bug খোঁজার জন্য দারুণ। কিন্তু এর ভেতরে আপনার Cookie আর
              Authorization Header ও থাকে, মানে আপনার লগইন। কমান্ডটা কোনো Chat, Issue
              বা Forum এ বসানোর আগে সেই লাইনগুলো মুছে দেবেন। না মুছলে যে কেউ সেটা চালিয়ে
              আপনার Account এ ঢুকে যেতে পারে। Cookies লেসনে দেখবেন কেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর দরজায় HTTP</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Server <code>103.94.135.2</code> এ সবার আগে বসে
                Caddy। এই লেসনের প্রায় প্রতিটা ধারণা সেখানে একটা করে সিদ্ধান্ত হয়ে
                আছে। ছয়টা দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>বাইরে তিন Version, ভেতরে এক।</strong> Caddy এর Default নিয়মে
                  HTTP/1.1, HTTP/2 আর HTTP/3, তিনটাই চালু থাকে। পর্যটকের Browser যেটা
                  পারে সেটায় কথা বলে, বেশিরভাগ সময় h2 বা h3। কিন্তু Caddy থেকে Port
                  3000 এর App পর্যন্ত আলাপটা সাধারণ HTTP/1.1, খাম ছাড়া, কারণ সেটা
                  একই যন্ত্রের ভেতরে <code>127.0.0.1</code> এ, বাইরের কেউ সেখানে
                  পৌঁছাতে পারে না।
                </ListItem>
                <ListItem>
                  <strong>Firewall এ TCP 443 আর UDP 443 দুইটাই খোলা।</strong> UDP
                  টা শুধু HTTP/3 এর জন্য। Port 80 ও খোলা, কিন্তু সেখানে Caddy শুধু
                  একটা কাজ করে: সবাইকে 308 দিয়ে HTTPS এ পাঠিয়ে দেয়।
                </ListItem>
                <ListItem>
                  <strong>Host দেখে সিদ্ধান্ত।</strong>{" "}
                  <code>islandtours.example</code> যায় App এ।{" "}
                  <code>www.islandtours.example</code> এর জন্য App কে বিরক্ত করা হয়
                  না, Caddy নিজেই 308 দিয়ে আসল নামে পাঠিয়ে দেয়। যে নাম Caddy চেনে না,
                  সেটা App পর্যন্ত পৌঁছায়ই না।
                </ListItem>
                <ListItem>
                  <strong>App Stateless, তাই Restart বা দ্বিগুণ করা সহজ।</strong> App এর Memory তে
                  কোনো পর্যটকের Session রাখা হয় না, রাখা হয় Redis এ। তাই Deploy এর
                  সময় App থামিয়ে নতুন করে চালু করলেও কেউ লগআউট হন না। আর ভিড় বাড়লে
                  একই App এর আরেকটা Container পাশে চালিয়ে দিলেই হয়, Caddy তখন Request
                  গুলো দুইজনের মাঝে ভাগ করে দিতে পারে, কোনো Code বদলাতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>Keep-Alive এর ধৈর্যের ক্রম ঠিক রাখা।</strong> Module 05 এর
                  শেষ লেসনের কথা মেনে App এর Keep-Alive Timeout, যা আসে{" "}
                  <code>KEEP_ALIVE_TIMEOUT_MS</code> নামের Environment Variable থেকে,
                  Caddy এর চুপ Connection রাখার সময়ের চেয়ে বেশি। নয় নম্বর সেকশনে যে
                  ECONNRESET এর দৌড় দেখেছেন, সেটা এখানে ঘটে না।
                </ListItem>
                <ListItem>
                  <strong>Body এর একটা সীমা।</strong> বুকিং এর JSON কয়েকশো Byte এর
                  বেশি হয় না। তাই App একটা সীমা বেঁধে রাখে, তার বেশি বড় Body এলে
                  পুরোটা পড়ার আগেই Request টা ফিরিয়ে দেয়। নইলে কেউ ইচ্ছা করে বিশাল
                  একটা Body পাঠিয়ে Server এর Memory ভরিয়ে দিতে পারত। কোন Status Code
                  দিয়ে ফেরায়, সেটা পরের লেসনে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর একটাও আলাদা করে খুব বড় কিছু নয়। কিন্তু প্রতিটার পেছনে এই লেসনের
                একটা করে কেন আছে, আর কেউ জিজ্ঞেস করলে আপনি এখন সেই কেন টা বলতে পারবেন।
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
      title: <SectionTitle>Saint Martin এর পাতা, এক Request এর পুরো পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ট্যুরের তালিকা থেকে Saint Martin এর কার্ডে চাপ দিলেন। ধরি একটু
              আগেই তিনি সাইটে ছিলেন, তাই একটা Connection আগে থেকেই খোলা। এরপর HTTP এর
              স্তরে ঠিক কী কী ঘটে, শুরু থেকে শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Browser URL টা ভাঙে",
              description:
                "https://islandtours.example/tours/saint-martin থেকে Scheme https, মানে Port 443 আর খাম লাগবে। Host islandtours.example। Path /tours/saint-martin। URL vs URI লেসনের অংশগুলো এখানে কাজে লাগল।",
            },
            {
              title: "খোলা Connection খোঁজে",
              description:
                "Browser দেখল islandtours.example এর জন্য একটা HTTP/2 Connection আগে থেকেই খোলা, 192.168.1.20:51514 থেকে 103.94.135.2:443। তাই নতুন DNS, Handshake কিছুই লাগল না। না থাকলে কী কী লাগত, সেটা Full HTTPS Journey লেসনে।",
            },
            {
              title: "Request তৈরি হয়",
              description:
                "Browser একটা নতুন Stream খুলল, তার HEADERS Frame এ :method GET, :path /tours/saint-martin, :authority islandtours.example, সাথে Accept, Accept-Language, Cookie। আগের Request এ পাঠানো Header গুলো HPACK এর তালিকা থেকে নম্বর দিয়ে গেল, তাই Frame টা খুব ছোট।",
            },
            {
              title: "Byte গুলো নিচে নামে আর রওনা দেয়",
              description:
                "Frame টা খামে ঢুকল, তারপর Kernel এর TCP তে Segment, IP তে Packet। বাসার Router Source বদলে দিল 203.0.113.25:62001 এ, Module 05 এর মতো। তারপর Hop থেকে Hop।",
            },
            {
              title: "Caddy পড়ে আর সিদ্ধান্ত নেয়",
              description:
                "Caddy খাম খুলে Frame পড়ল। :authority দেখে বুঝল এটা islandtours.example এর জন্য, তাই ভেতরের App এর কাছে পাঠাতে হবে।",
            },
            {
              title: "Caddy নিজে নতুন একটা Request পাঠায়",
              description:
                "Caddy 127.0.0.1:3000 এর সাথে আগে থেকে খোলা একটা Keep-Alive Connection বেছে নিল আর লিখল GET /tours/saint-martin HTTP/1.1, সাথে Host আর X-Forwarded-For: 203.0.113.25। App এর চোখে এটা একটা সাধারণ HTTP/1.1 Request।",
            },
            {
              title: "App উত্তর বানায়",
              description:
                "App Cookie দেখে পর্যটককে চিনল, ট্যুরের তথ্য পড়ল, HTML বানাতে বানাতে পাঠাতে শুরু করল। শেষ মাপ আগে জানা নেই, তাই 200 OK আর Transfer-Encoding: chunked।",
            },
            {
              title: "Caddy উত্তরটা অনুবাদ করে ফেরত দেয়",
              description:
                "Caddy HTTP/1.1 এর টুকরোগুলো নিয়ে HTTP/2 এর DATA Frame বানাল, Status টা গেল :status 200 হয়ে। শেষ Frame এ একটা চিহ্ন, END_STREAM, যার মানে এই Stream এর উত্তর শেষ। HTTP/2 তে chunked লাগে না, এই চিহ্নটাই সেই কাজ করে।",
            },
            {
              title: "Browser আরও চায়, একই Connection এ",
              description:
                "HTML পড়ে Browser দেখল আরও লাগবে: style.css, app.js, তিনটা নৌকার ছবি। প্রতিটার জন্য নতুন Stream, সবাই একসাথে একই Connection এ, কেউ কারো জন্য লাইনে দাঁড়াল না।",
            },
            {
              title: "পাতা আঁকা হয়, Connection চুপ করে থাকে",
              description:
                "সব ফাইল এসে গেল, পর্দায় Saint Martin। Connection টা বন্ধ হলো না, পরের চাপের অপেক্ষায় চুপচাপ খোলা রইল। অনেকক্ষণ কেউ কিছু না চাইলে কোনো এক পাশের Idle Timeout পার হবে, আর Module 05 এর Connection Close লেসনের মতো ভদ্রভাবে বিদায়।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় হাতে লেখা
                Request, নিজের Server, Body এর শেষ, Keep-Alive আর Version, সব নিজের
                যন্ত্রে দেখবেন। পড়ার চেয়ে এটা অনেক বেশি মনে থাকে।
              </ListItem>
              <ListItem>
                <strong>MDN এর HTTP গাইড</strong>, HTTP এর প্রতিটা অংশের সবচেয়ে
                সহজ আর নির্ভরযোগ্য ব্যাখ্যা, উদাহরণ সহ। Overview আর Evolution of
                HTTP পাতা দুইটা দিয়ে শুরু করুন।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.mozilla.org/en-US/docs/Web/HTTP
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9110 আর RFC 9112</strong>, HTTP এর মানে আর HTTP/1.1 এর
                লেখার নিয়ম, আসল নিয়মের কাগজ। পুরোটা পড়ার দরকার নেই, Message এর গঠনের
                অংশটা একবার দেখুন, এই লেসনের ছবির সাথে মিলিয়ে।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9110
                </a>
                {" আর "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9112
                </a>
              </ListItem>
              <ListItem>
                <strong>HTTP/3 explained</strong>, curl এর নির্মাতা Daniel Stenberg
                এর লেখা ছোট একটা বিনামূল্যের বই। QUIC কেন আর কীভাবে, ছবি সহ।{" "}
                <a
                  href="https://http3-explained.haxx.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  http3-explained.haxx.se
                </a>
              </ListItem>
              <ListItem>
                <strong>Node.js এর http নথি</strong>, createServer, keepAliveTimeout,
                keepAliveTimeoutBuffer আর Agent এর আসল আচরণ এখানে লেখা।{" "}
                <a
                  href="https://nodejs.org/api/http.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nodejs.org/api/http.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Chrome DevTools এর Network নথি</strong>, Network tab এর প্রতিটা
                কলাম আর বোতামের মানে।{" "}
                <a
                  href="https://developer.chrome.com/docs/devtools/network/reference"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.chrome.com/docs/devtools/network/reference
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
                  TCP একটা নির্ভুল Byte এর পাইপ, মানে বোঝে না। HTTP হলো সেই চুক্তি
                  যেটা Byte গুলোকে মানে দেয়। থাকে Program এর ভেতরে, Application
                  Layer এ। HTTPS মানে একই HTTP, একটা Encrypt করা খামে।
                </ListItem>
                <ListItem>
                  Request-Response: সবসময় Client শুরু করে, প্রতিটা Request এ ঠিক একটা
                  Response, একই Connection দিয়ে। Client আর Server ভূমিকার নাম,
                  যন্ত্রের নয়।
                </ListItem>
                <ListItem>
                  প্রতিটা Message এর চার অংশ: প্রথম লাইন (Request Line বা Status Line),
                  Header গুলো, একটা ফাঁকা লাইন, তারপর ঐচ্ছিক Body। প্রতিটা লাইনের শেষে
                  CRLF।
                </ListItem>
                <ListItem>
                  Host Header বলে কোন সাইট চাই। এর জোরেই এক IP তে অনেক সাইট চলে, আর
                  এই কারণেই Hosting এর দিকেও Domain যোগ করতে হয়।
                </ListItem>
                <ListItem>
                  Stateless: প্রতিটা Request নিজেই সম্পূর্ণ। তাই যেকোনো Server যেকোনো
                  Request সামলাতে পারে। মনে রাখার কাজটা করে Request এর সাথে আসা Cookie
                  আর ভাগ করা Store।
                </ListItem>
                <ListItem>
                  Byte এর ধারায় দাগ নেই, তাই Body এর শেষ বলতে হয়: Content-Length
                  (Byte এ, অক্ষরে নয়), chunked, অথবা Connection বন্ধ।
                </ListItem>
                <ListItem>
                  Keep-Alive একটা Connection এ অনেক Request চালায়, Handshake এর খরচ
                  বাঁচায়। চুপ থাকলে Idle Timeout এ বন্ধ হয়, আর পেছনের জনের ধৈর্য
                  সামনের জনের চেয়ে বেশি রাখতে হয়।
                </ListItem>
                <ListItem>
                  HTTP/1.1 এ এক Connection এ একবারে একটা উত্তর। HTTP/2 এক TCP
                  Connection এ অনেক Stream মেশায়, কিন্তু Packet হারালে সব থামে। HTTP/3
                  UDP এর উপরে QUIC দিয়ে প্রতিটা Stream কে স্বাধীন করে, শুরু করে দ্রুত,
                  আর Network বদলালেও টিকে থাকে।
                </ListItem>
                <ListItem>
                  মাঝের Proxy, CDN আর Load Balancer প্রতিটা ধাপে নতুন Request পাঠায়।
                  তাই প্রতিটা ধাপের Version আর Timeout আলাদা, আর App এর চোখে Client হলো
                  সামনের Proxy।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই লেসনটা যদি একটা বাক্যে বলতে হয়: HTTP হলো কয়েক লাইনের একটা চিঠি,
                যার প্রথম লাইন বলে কী চাই, মাঝের লাইনগুলো বলে বাড়তি কথা, একটা ফাঁকা
                লাইন বলে বাড়তি কথা শেষ, আর বাকিটা আসল জিনিস। বাকি সব Version, সব
                কৌশল, এই চিঠিটা দ্রুত আর নিরাপদে পৌঁছানোর চেষ্টা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর: HTTP Methods & Status Codes",
          content: (
            <p>
              এই লেসনে প্রথম লাইনের দুইটা শব্দকে আমরা ইচ্ছা করে শুধু নাম ধরে ডেকেছি।
              Request Line এর Method, যেটা বলে কী করতে চাই, আর Status Line এর Status
              Code, যেটা বলে কী হলো। GET আর POST এর তফাত কী, PUT আর PATCH কখন, কোন
              Request আবার পাঠানো নিরাপদ, 401 আর 403 কেন আলাদা, 502 আর 504 দেখলে কোথায়
              খুঁজবেন, এসবই পরের লেসনে, HTTP Methods & Status Codes। সেখানে আপনার
              নিজের Server প্রতিটা Code ফেরত দেবে, আর আপনি curl দিয়ে প্রতিটা ধরবেন।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["HTTP", "Byte গুলোকে মানে দেওয়ার চুক্তি, Program এর ভেতরে, TCP এর উপরে"],
      ["HTTPS", "একই HTTP, TLS এর Encrypt করা খামের ভেতরে, সাধারণত Port 443"],
      ["Request-Response", "Client শুরু করে, প্রতিটা Request এ ঠিক একটা Response"],
      ["Request Line", "Method, Target, Version। যেমন POST /api/bookings HTTP/1.1"],
      ["Status Line", "Version, Status Code, Reason Phrase। যেমন HTTP/1.1 201 Created"],
      ["Header", "নাম: মান, এক লাইনে একটা। নামের বড় ছোট হাতের অক্ষরে তফাত নেই"],
      ["CRLF", "প্রতিটা লাইনের শেষের \\r\\n। দুইটা পরপর মানে Header শেষ"],
      ["Host", "কোন সাইট চাই। এক IP তে অনেক সাইট, Virtual Hosting"],
      ["Stateless", "প্রতিটা Request নিজে সম্পূর্ণ। Server প্রোটোকলের দিক থেকে কিছু মনে রাখে না"],
      ["Content-Length", "Body ঠিক কত Byte। অক্ষর নয়, Byte"],
      ["chunked", "মাপ না জেনে টুকরো টুকরো পাঠানো। প্রতিটার আগে Hex মাপ, শেষে 0"],
      ["Keep-Alive", "Response এর পরে Connection খোলা রাখা, পরের Request এর জন্য"],
      ["Head-of-Line Blocking", "সামনের জনের কারণে পেছনের সবার আটকে থাকা"],
      ["HTTP/2", "Binary Frame, এক TCP Connection এ অনেক Stream, HPACK"],
      ["HTTP/3", "UDP এর উপরে QUIC, স্বাধীন Stream, দ্রুত শুরু, Connection ID"],
      ["Alt-Svc", "Server এর খবর: এই Host এ HTTP/3 ও আছে"],
      ["Reverse Proxy", "Server এর সামনের দরজা, Island Tours এ Caddy"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "পর্যটকের ফোন আর Server এর মাঝে TCP Connection খোলা হয়ে গেছে। এখন Saint Martin এর পাতা পেতে কোন জিনিসটা Server কে বলে দেয় ঠিক কী চাওয়া হচ্ছে?",
        options: [
          {
            key: "A",
            text: "TCP Header এর Port নম্বর",
            isCorrect: false,
            explanation:
              "Port শুধু বলে কোন Program এর কাছে যাবে, যেমন 443 এর Caddy। কোন পাতা চাই, সেটা Port জানে না।",
          },
          {
            key: "B",
            text: "HTTP Request এর Request Line, যেমন GET /tours/saint-martin HTTP/1.1",
            isCorrect: true,
            explanation:
              "ঠিক। TCP শুধু Byte বয়ে নেয়। কী চাওয়া হচ্ছে, সেটা লেখা থাকে HTTP Request এর প্রথম লাইনে, Method আর Target হিসেবে।",
          },
          {
            key: "C",
            text: "IP Packet এর Destination Address",
            isCorrect: false,
            explanation:
              "IP ঠিকানা শুধু যন্ত্রটা খুঁজে দেয়। সেই যন্ত্রে হাজারটা পাতা থাকতে পারে।",
          },
          {
            key: "D",
            text: "DNS এর A Record",
            isCorrect: false,
            explanation:
              "DNS নাম থেকে IP দেয়, তারপর তার কাজ শেষ। Request এর ভেতরের কথায় তার কোনো ভূমিকা নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "একটা HTTP/1.1 Request এ Server কীভাবে বোঝে যে Header শেষ হয়ে Body শুরু হচ্ছে?",
        options: [
          {
            key: "A",
            text: "Body শুরু হয় একটা বিশেষ Header দিয়ে, যার নাম Body-Start",
            isCorrect: false,
            explanation: "এমন কোনো Header নেই।",
          },
          {
            key: "B",
            text: "একটা পুরো ফাঁকা লাইন, মানে পরপর দুইটা CRLF",
            isCorrect: true,
            explanation:
              "ঠিক। শেষ Header এর CRLF এর পরে আরেকটা CRLF, মোট চার Byte 0D 0A 0D 0A। এটা দেখলেই Server জানে Header শেষ।",
          },
          {
            key: "C",
            text: "Server একটা নির্দিষ্ট সংখ্যক লাইন পড়ে, তারপর ধরে নেয় Body",
            isCorrect: false,
            explanation:
              "Header এর সংখ্যা প্রতিটা Request এ আলাদা, তাই গুনে বোঝার উপায় নেই।",
          },
          {
            key: "D",
            text: "TCP একটা নতুন Segment এ Body পাঠায়",
            isCorrect: false,
            explanation:
              "TCP Segment এর সীমা আর HTTP এর অংশের সীমা মেলে না। Header আর Body একই Segment এ আসতেও পারে।",
          },
        ],
      },
      {
        id: 3,
        text: "Server 103.94.135.2 তে islandtours.example আর admin.islandtours.example দুইটাই চলে। একই IP আর Port এ আসা Request কার জন্য, Caddy সেটা কীভাবে জানে?",
        options: [
          {
            key: "A",
            text: "Request এর Host Header পড়ে",
            isCorrect: true,
            explanation:
              "ঠিক। IP আর Port দুইটার জন্য একই, তফাত শুধু Host লাইনে। HTTP/2 তে একই কাজ করে :authority।",
          },
          {
            key: "B",
            text: "Client এর IP দেখে",
            isCorrect: false,
            explanation:
              "একই পর্যটক দুইটা সাইটেই যেতে পারেন, তাই Client এর IP দিয়ে বোঝা যায় না।",
          },
          {
            key: "C",
            text: "DNS Server কে জিজ্ঞেস করে",
            isCorrect: false,
            explanation:
              "DNS এর কাজ Request আসার আগেই শেষ। Caddy কাউকে জিজ্ঞেস করে না, Request এর ভেতরেই উত্তর আছে।",
          },
          {
            key: "D",
            text: "প্রতিটা সাইট আলাদা Port এ চলে, তাই আলাদা করা যায়",
            isCorrect: false,
            explanation:
              "বাইরে থেকে দুইটাই 443 এ আসে। ভেতরে App আলাদা Port এ থাকতে পারে, কিন্তু সেই সিদ্ধান্ত Caddy নেয় Host দেখেই।",
          },
        ],
      },
      {
        id: 4,
        text: "HTTP Stateless, এই কথার সবচেয়ে সঠিক মানে কোনটা?",
        options: [
          {
            key: "A",
            text: "HTTP দিয়ে বানানো App কোনো তথ্য জমা রাখতে পারে না",
            isCorrect: false,
            explanation:
              "App Database আর Redis এ সবকিছু রাখে। Stateless কথাটা প্রোটোকলের, App এর নয়।",
          },
          {
            key: "B",
            text: "প্রতিটা Request নিজের ভেতরেই সম্পূর্ণ, প্রোটোকলের দিক থেকে Server আগের Request মনে রাখে না",
            isCorrect: true,
            explanation:
              "ঠিক। তাই যেকোনো Server যেকোনো Request সামলাতে পারে, আর পরিচয় আসে Request এর সাথে, যেমন Cookie তে।",
          },
          {
            key: "C",
            text: "প্রতিটা Request এর পরে TCP Connection বন্ধ হয়ে যায়",
            isCorrect: false,
            explanation:
              "এটা HTTP/1.0 এর পুরনো অভ্যাস, Stateless এর মানে নয়। HTTP/1.1 Stateless হয়েও Connection খোলা রাখে।",
          },
          {
            key: "D",
            text: "HTTP এ কোনো Header থাকে না",
            isCorrect: false,
            explanation: "Header আছে, আর সেগুলোই প্রতিটা Request কে সম্পূর্ণ করে তোলে।",
          },
        ],
      },
      {
        id: 5,
        text: "একটা Request এর Body ঠিক 7 Byte, কিন্তু Header এ লেখা Content-Length: 12। তারপর কী ঘটার সম্ভাবনা সবচেয়ে বেশি?",
        options: [
          {
            key: "A",
            text: "Server বাড়তি 5 Byte নিজে থেকে ফাঁকা দিয়ে ভরে নেয়",
            isCorrect: false,
            explanation: "Server কিছু বানিয়ে নেয় না। সে বিশ্বাস করে আরও 5 Byte আসবে।",
          },
          {
            key: "B",
            text: "Server আরও 5 Byte এর অপেক্ষায় থাকে, Client উত্তরের অপেক্ষায়, যতক্ষণ না Timeout হয়",
            isCorrect: true,
            explanation:
              "ঠিক। দুইজনেই অপেক্ষা করে। বাইরে থেকে মনে হয় সাইট ঝুলে গেছে। এই কারণেই মাপটা Framework কে গুনতে দিতে হয়।",
          },
          {
            key: "C",
            text: "Server সাথে সাথে 200 OK পাঠায়",
            isCorrect: false,
            explanation: "Body পুরো না পেলে Server Request টাকে সম্পূর্ণ ধরে না।",
          },
          {
            key: "D",
            text: "TCP বাড়তি Byte গুলো নিজে পাঠিয়ে দেয়",
            isCorrect: false,
            explanation: "TCP শুধু যা দেওয়া হয় তাই পাঠায়, HTTP এর মাপ সে জানেই না।",
          },
        ],
      },
      {
        id: 6,
        text: "HTTP/1.1 এর Keep-Alive এর মূল লাভ কী?",
        options: [
          {
            key: "A",
            text: "Request গুলো Encrypt হয়ে যায়",
            isCorrect: false,
            explanation: "Encrypt করে TLS, Keep-Alive এর সাথে এর কোনো সম্পর্ক নেই।",
          },
          {
            key: "B",
            text: "Server Client কে মনে রাখে",
            isCorrect: false,
            explanation:
              "Keep-Alive এর পরেও HTTP Stateless থাকে। একই Connection এ আলাদা মানুষের Request ও আসতে পারে।",
          },
          {
            key: "C",
            text: "প্রতিটা Request এর জন্য নতুন TCP আর TLS Handshake করতে হয় না, সময় বাঁচে",
            isCorrect: true,
            explanation:
              "ঠিক। একবার হাত মিলিয়ে অনেক Request। প্রতিটা Handshake এ অন্তত একটা Round Trip বাঁচে।",
          },
          {
            key: "D",
            text: "একসাথে অনেক Response একই Connection এ মিশিয়ে পাঠানো যায়",
            isCorrect: false,
            explanation:
              "সেটা HTTP/2 এর Multiplexing। HTTP/1.1 এর Keep-Alive এ উত্তরগুলো তবুও একটার পর একটা আসে।",
          },
        ],
      },
      {
        id: 7,
        text: "খারাপ Mobile Network এ একটা Packet হারাল। HTTP/2 আর HTTP/3 এর আচরণে তফাত কী?",
        options: [
          {
            key: "A",
            text: "দুইটাতেই সব Stream থেমে যায়",
            isCorrect: false,
            explanation: "HTTP/3 এর পুরো উদ্দেশ্যই এটা এড়ানো।",
          },
          {
            key: "B",
            text: "HTTP/2 তে TCP এর কারণে সব Stream থামে, HTTP/3 তে QUIC শুধু সেই Stream টা থামায়",
            isCorrect: true,
            explanation:
              "ঠিক। TCP জানে না ভেতরে Stream আছে, তাই ক্রম রাখতে সব আটকায়। QUIC প্রতিটা Stream এর ক্রম আলাদা রাখে।",
          },
          {
            key: "C",
            text: "HTTP/3 তে হারানো Packet আর কখনো পাঠানো হয় না",
            isCorrect: false,
            explanation:
              "QUIC হারানো Packet আবার পাঠায়, UDP এর উপরে নিজের নির্ভরযোগ্যতা নিয়ে।",
          },
          {
            key: "D",
            text: "HTTP/2 তে শুধু সেই Stream থামে, HTTP/3 তে সব",
            isCorrect: false,
            explanation: "উল্টো বলা হয়েছে।",
          },
        ],
      },
      {
        id: 8,
        text: "Island Tours এর App Log এ প্রতিটা Request এর Client IP দেখাচ্ছে 127.0.0.1। কেন?",
        options: [
          {
            key: "A",
            text: "সব পর্যটক একই যন্ত্র থেকে আসছেন",
            isCorrect: false,
            explanation: "127.0.0.1 মানে নিজের যন্ত্র, Loopback, কোনো পর্যটকের ঠিকানা নয়।",
          },
          {
            key: "B",
            text: "App এর TCP Connection খুলেছে Caddy, তাই App এর চোখে Client হলো Caddy। আসল IP আসে X-Forwarded-For Header এ",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা Intermediary নতুন Connection এ নতুন Request পাঠায়। পর্যটকের IP জানতে Caddy এর যোগ করা Header পড়তে হয়।",
          },
          {
            key: "C",
            text: "NAT পর্যটকের IP মুছে দিয়েছে",
            isCorrect: false,
            explanation:
              "বাসার Router এর NAT Source কে 203.0.113.25 করে, 127.0.0.1 নয়। আর Caddy সেই Public IP টা ঠিকই দেখে।",
          },
          {
            key: "D",
            text: "HTTP/2 তে Client IP পাঠানো হয় না",
            isCorrect: false,
            explanation:
              "Client IP কখনো HTTP এর ভেতরে থাকে না, থাকে IP Packet এ। আর Caddy থেকে App এর আলাপটা HTTP/1.1 এই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "HTTP নিজের হাতে, ছয়টা পরীক্ষায়",
    subtitle: "Node 22 বা তার পরের Version আর curl লাগবে, কোনো Package Install নয়",
    stepName: "LAB",
    steps: [
      {
        title: "HTTP আসলে শুধু লেখা",
        description:
          "Node এর net দিয়ে একটা খালি TCP Socket খুলুন, হাতে লেখা HTTP পাঠান example.com এ, আর গুনে দেখুন কত Byte গেল আর কত এলো।",
      },
      {
        title: "নিজের Server",
        description:
          "node:http দিয়ে ছোট একটা Server চালান। curl -v দিয়ে কথা বলুন, আর দেখুন আপনি না লিখলেও Node নিজে কোন Header গুলো যোগ করল।",
      },
      {
        title: "nc দিয়ে নিজের Server এর সাথে কথা",
        description:
          "একই Connection এ পরপর দুইটা Request হাতে লিখে পাঠান। তারপর example.com এ ভুল Host আর Host ছাড়া Request পাঠিয়ে উত্তর মিলিয়ে নিন।",
      },
      {
        title: "Body কোথায় শেষ",
        description:
          "একই Server এর /length আর /chunked দুইটা Route এর উত্তর --raw দিয়ে পাশাপাশি দেখুন, আর বাংলা লেখায় অক্ষর আর Byte এর তফাত মাপুন।",
      },
      {
        title: "Keep-Alive আর Idle Timeout মাপা",
        description:
          "একটা Script দিয়ে চারটা Request পাঠান, মাঝে চুপ থাকার সময় বদলে বদলে। কখন একই Connection আবার ব্যবহার হয় আর কখন নতুন খোলে, Port দেখে বের করুন।",
      },
      {
        title: "কোন Version এ কথা হচ্ছে",
        description:
          "curl দিয়ে একই সাইট HTTP/1.0, HTTP/1.1 আর HTTP/2 তে চান, ALPN এর দরদাম দেখুন, আর DevTools এ Protocol কলামে h2 বা h3 খুঁজুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-raw-client.mjs",
        language: "javascript",
        code: `// চালান:  node 1-raw-client.mjs example.com
import net from "node:net";

const host = process.argv[2];
if (!host) throw new Error("Pass a host name, for example: node 1-raw-client.mjs example.com");

// HTTP এর পুরো Request টা শুধু কয়েক লাইন লেখা। প্রতিটা লাইনের শেষে \\r\\n,
// আর একটা ফাঁকা লাইন মানে Header শেষ।
const request =
  "GET / HTTP/1.1\\r\\n" +
  \`Host: \${host}\\r\\n\` +
  "Connection: close\\r\\n" +
  "\\r\\n";

const socket = net.connect({ host, port: 80 }, () => {
  console.log(\`TCP connected to \${socket.remoteAddress}:\${socket.remotePort}\`);
  console.log(\`sending \${Buffer.byteLength(request)} bytes of plain text\`);
  socket.write(request);
});

let received = "";
socket.on("data", (chunk) => (received += chunk.toString("latin1")));
socket.on("end", () => {
  const [head] = received.split("\\r\\n\\r\\n");
  console.log(\`received \${Buffer.byteLength(received, "latin1")} bytes, the head is:\`);
  console.log(head);
});
socket.on("error", (err) => console.error("socket error:", err.code));

// আসল ফলাফল (2026-10-31, CF-RAY সরানো):
//   TCP connected to 104.20.23.154:80
//   sending 56 bytes of plain text
//   received 931 bytes, the head is:
//   HTTP/1.1 200 OK
//   Content-Type: text/html; charset=utf-8
//   Transfer-Encoding: chunked
//   Connection: close
//   Server: cloudflare
//   ...
// প্রশ্ন: 56 Byte এর Request টার প্রতিটা Byte কোথা থেকে এলো, নিজে গুনে মেলান।`,
      },
      {
        filename: "2-tiny-server.sh",
        language: "bash",
        code: `# ১. উপরের Hands-on সেকশনের 2-tiny-server.mjs ফাইলটা বানিয়ে এক Terminal এ চালান
export LAB_PORT=47620
node 2-tiny-server.mjs
# listening on http://127.0.0.1:47620
# keep-alive timeout: 5000 ms

# ২. আরেক Terminal এ, তিনটা Route
curl -sv http://127.0.0.1:47620/ 2>&1 | grep -E '^[<>]'
curl -s -i http://127.0.0.1:47620/length
curl -s -i http://127.0.0.1:47620/chunked

# ৩. প্রশ্নের উত্তর খুঁজুন:
#    আপনি Code এ কোন Header লিখেছিলেন, আর উত্তরে কোনগুলো এলো?
#    "/" এ Content-Length এলো কেন, "/chunked" এ এলো না কেন?
#    "/" এর Code এ res.setHeader এর বদলে res.writeHead(200, {...}) লিখে
#    আবার চালান। এবার Content-Length না chunked?

# ৪. LAB_PORT ছাড়া চালালে কী হয়, সেটাও একবার দেখে নিন
unset LAB_PORT
node 2-tiny-server.mjs
# Error: LAB_PORT is not set`,
      },
      {
        filename: "3-by-hand.sh",
        language: "bash",
        code: `# Server টা চালু রাখুন (LAB_PORT=47620)

# একই Connection এ দুইটা Request, এক সেকেন্ডের ব্যবধানে
(printf 'GET /length HTTP/1.1\\r\\nHost: 127.0.0.1\\r\\n\\r\\n'; sleep 1; \\
 printf 'GET / HTTP/1.1\\r\\nHost: 127.0.0.1\\r\\n\\r\\n'; sleep 2) | nc 127.0.0.1 47620

# আসল ফলাফল, দুইটা পুরো উত্তর পরপর:
#   HTTP/1.1 200 OK ... Content-Length: 15 ... seats left: 12
#   HTTP/1.1 200 OK ... Content-Length: 30 ... hello from my own HTTP server
# Server এর Log এ দুইটাই একই Port থেকে:
#   GET /length HTTP/1.1  from port 52533
#   GET / HTTP/1.1  from port 52533

# এবার example.com এ: ভুল Host, তারপর Host ছাড়া
(printf 'GET / HTTP/1.1\\r\\nHost: no-such-site.example\\r\\nConnection: close\\r\\n\\r\\n'; sleep 3) | nc example.com 80
#   HTTP/1.1 409 Conflict ... error code: 1001
(printf 'GET / HTTP/1.1\\r\\nConnection: close\\r\\n\\r\\n'; sleep 3) | nc example.com 80
#   HTTP/1.1 400 Bad Request

# ফাঁকা লাইনটা ভুলে গেলে? শেষের \\r\\n টা বাদ দিয়ে চালান আর দেখুন
(printf 'GET / HTTP/1.1\\r\\nHost: 127.0.0.1\\r\\n'; sleep 6) | nc 127.0.0.1 47620
# পুরো ছয় সেকেন্ড কিছুই আসে না, Server এখনো আরও Header এর অপেক্ষায়।
# sleep শেষে nc নিজের দিক বন্ধ করে, মানে FIN পাঠায় (Module 05)। তখনই কেবল:
#   HTTP/1.1 400 Bad Request
#   Connection: close
# Server বুঝল আর কোনো Header আসবে না, অথচ Header শেষের ফাঁকা লাইনটা আসেনি।`,
      },
      {
        filename: "4-body-end.sh",
        language: "bash",
        code: `# মাপ জানা বনাম টুকরো টুকরো, curl কে বলুন জোড়া না লাগাতে
curl -s --raw -i http://127.0.0.1:47620/length
curl -s --raw -i http://127.0.0.1:47620/chunked
# chunked এর প্রতিটা টুকরোর আগে "d", মানে 13। শেষে "0"।
# টুকরোগুলো আধা সেকেন্ড পরপর আসে, সেটা চোখে দেখতে -N যোগ করুন:
curl -s -N --raw http://127.0.0.1:47620/chunked

# example.com এর Body কত বড়, মেপে দেখুন
curl -s -o /dev/null -w 'size_download=%{size_download}\\n' https://example.com
# size_download=577   (আর nc তে দেখা প্রথম টুকরোর মাপ ছিল 241, মানে 577)

# অক্ষর বনাম Byte
node -e 'for (const s of ["seats=2","আসন","সেন্ট মার্টিন"]) console.log(JSON.stringify(s), "length", s.length, "bytes", Buffer.byteLength(s))'
# "seats=2" length 7 bytes 7
# "আসন" length 3 bytes 9
# "সেন্ট মার্টিন" length 13 bytes 37`,
      },
      {
        filename: "5-reuse.mjs",
        language: "javascript",
        code: `// আগে Server চালু রাখুন (LAB_PORT=47620 node 2-tiny-server.mjs), তারপর:
//      LAB_PORT=47620 node 5-reuse.mjs
import http from "node:http";
import { setTimeout as sleep } from "node:timers/promises";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// keepAlive: একটা Request শেষ হলে Connection বন্ধ না করে পরের জনের জন্য রেখে দেওয়া
const agent = new http.Agent({ keepAlive: true });
const started = Date.now();
const at = () => \`\${((Date.now() - started) / 1000).toFixed(1)}s\`;

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: "127.0.0.1", port, path, agent }, (res) => {
      const { localPort } = res.socket;
      res.socket.labPort = localPort;
      res.resume();
      res.on("end", () => {
        console.log(\`\${at()}  GET \${path}  status \${res.statusCode}  my port \${localPort}\`);
        resolve();
      });
    });
    req.on("socket", (socket) => {
      if (!socket.labWatched) {
        socket.labWatched = true;
        socket.on("close", () => console.log(\`\${at()}  connection from port \${socket.labPort} closed\`));
      }
    });
    req.on("error", reject);
  });
}

await get("/length");
await get("/");          // একই Connection এ, তাই একই Port
await sleep(2000);
await get("/length");    // ২ সেকেন্ড চুপ ছিল, তবুও একই Connection
await sleep(8000);       // এবার ৮ সেকেন্ড চুপ, Server এর ধৈর্য পার
await get("/");          // নতুন Connection, নতুন Port
agent.destroy();         // শেষে নিজেরাই বন্ধ করলাম

// আসল ফলাফল:
//   0.0s  GET /length  status 200  my port 53043
//   0.0s  GET /  status 200  my port 53043
//   2.0s  GET /length  status 200  my port 53043
//   8.0s  connection from port 53043 closed      <- 2.0 + 5 + 1 সেকেন্ড
//   10.0s  GET /  status 200  my port 53082
//   10.0s  connection from port 53082 closed
// এবার sleep(8000) কে sleep(6000) করে কয়েকবার চালান। মাঝে মাঝে ECONNRESET
// আসবে: আপনার Request আর Server এর বন্ধ করা ঠিক একই মুহূর্তে পড়েছে।`,
      },
      {
        filename: "6-versions.sh",
        language: "bash",
        code: `# একই সাইট, তিন Version এ চাওয়া
curl -sv --http1.0 http://example.com -o /dev/null 2>&1 | grep -E '^[<>] (GET|HTTP|Connection)'
#   > GET / HTTP/1.0
#   < HTTP/1.1 200 OK
#   < Connection: close
curl -sI --http1.1 https://example.com | head -1     # HTTP/1.1 200 OK
curl -sI --http2   https://example.com | head -1     # HTTP/2 200

# curl নিজে কোনটা বেছে নেয়, আর TLS এর ভেতরে ALPN এর দরদাম
curl -s -o /dev/null -w '%{http_version}\\n' https://example.com     # 2
curl -sv https://example.com -o /dev/null 2>&1 | grep ALPN
#   * ALPN: curl offers h2,http/1.1
#   * ALPN: server accepted h2

# HTTP/3 এর খবরটা কোথায়
curl -sI https://example.com | grep -i alt-svc
#   alt-svc: h3=":443"; ma=86400

# এই curl এ HTTP/3 নেই, পরিষ্কার Error দেয়
curl -sI --http3 https://example.com
#   curl: option --http3: the installed libcurl version doesn't support this

# Browser এ: DevTools, Network, Protocol কলাম চালু করে কয়েকটা চেনা সাইট খুলুন।
# কোন সাইট h3, কোনটা h2, আর একই পাতার ভেতরে কোন ফাইল কোন Version এ এলো, লিখে রাখুন।`,
      },
    ],
    tip: "পরীক্ষা ৩ এর শেষ অংশটা, ফাঁকা লাইন ছাড়া Request, একটু সময় নিয়ে করুন। যতক্ষণ Client নিজের দিক খোলা রাখে, Server কোনো Error দেয় না, কিছুই বলে না, শুধু অপেক্ষা করে। 400 আসে কেবল তখন, যখন Client হাল ছেড়ে নিজের দিক বন্ধ করে। Production এ ঝুলে থাকা Request এর অনেকগুলোর চেহারা ঠিক এরকম: কেউ ভুল করেনি বলে মনে হয়, অথচ এক পাশ ভাবছে কথা শেষ আর অন্য পাশ ভাবছে কথা এখনো চলছে। HTTP এর প্রায় প্রতিটা নিয়ম, ফাঁকা লাইন, Content-Length, chunked এর শেষের 0, আসলে একটাই প্রশ্নের উত্তর দেয়: কথাটা কোথায় শেষ। এই প্রশ্নটা মাথায় রাখলে HTTP এর অর্ধেক Bug আপনি নিজেই ধরে ফেলবেন।",
  },
  assignment: {
    title: "Mini Project: my-tours এর প্রথম HTTP Server",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>হাতে লেখা Request, লাইন ধরে ব্যাখ্যা:</strong> nc দিয়ে example.com এ
        একটা GET পাঠান। পুরো উত্তরটা একটা ফাইলে রাখুন, আর প্রতিটা লাইনের পাশে এক
        লাইনে লিখুন সেটা কী বলছে। কোন লাইনগুলো Cache এর, কোনটা HTTP/3 এর খবর, কোনটা
        Body এর শেষ বোঝায়, আলাদা করে চিহ্নিত করুন।
      </span>,
      <span key="2">
        <strong>একটা আসল পাতার হিসাব:</strong> আপনার পছন্দের একটা সাইট DevTools এর
        Network tab খোলা রেখে Disable cache চালু করে Reload করুন। লিখে রাখুন: মোট কয়টা
        Request, কয়টা h3, কয়টা h2, কয়টা http/1.1, সবচেয়ে বড় ফাইল কোনটা আর কত বড়,
        আর কয়টা আলাদা Host থেকে ফাইল এলো। তারপর একবার Disable cache বন্ধ করে
        Reload করুন, আর তফাতটা দুই লাইনে ব্যাখ্যা করুন।
      </span>,
      <span key="3">
        <strong>my-tours এর প্রথম API:</strong> শুধু <code>node:http</code> দিয়ে একটা
        Server বানান যার তিনটা Route: <code>GET /api/tours</code> তিনটা ট্যুরের একটা
        JSON তালিকা দেয়, <code>GET /api/tours/saint-martin</code> একটা ট্যুর দেয়, আর
        বাকি সব কিছুতে 404 আর ছোট একটা JSON Error। Port আসবে Environment Variable
        থেকে, না থাকলে Server চালুই হবে না। প্রতিটা উত্তরে Content-Type ঠিক থাকতে
        হবে। curl -v দিয়ে তিনটা Route এর পুরো উত্তর জমা দিন, আর দেখান যে
        Content-Length আপনি নিজে লেখেননি।
      </span>,
      <span key="4">
        <strong>Idle Timeout নিজে মাপুন আর বদলান:</strong> আপনার my-tours Server এর{" "}
        <code>keepAliveTimeout</code> একটা Environment Variable থেকে পড়ুন। Lab এর
        5-reuse.mjs বদলে বের করুন ঠিক কত সেকেন্ড চুপ থাকলে Connection বন্ধ হয়, একবার
        Default এ আর একবার আপনার দেওয়া মানে। Node মুখে যা বলে (Keep-Alive Header) আর
        আসলে যখন বন্ধ করে, দুইটার তফাত ব্যাখ্যা করুন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> একজন বন্ধু জিজ্ঞেস করেছেন,
        HTTP যদি কাউকে মনে না রাখে, তাহলে Facebook আমাকে লগইন অবস্থায় রাখে কীভাবে?
        আর HTTP/3 নাকি UDP তে চলে, UDP তো Packet হারায়, তাহলে পাতা ভেঙে যায় না কেন?
        দুইটা প্রশ্নের উত্তর দিন এমনভাবে যাতে তিনি অন্য কাউকে বুঝিয়ে বলতে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">example.com এর পুরো উত্তর, প্রতিটা লাইনের পাশে ব্যাখ্যা সহ</span>,
      <span key="2">একটা সাইটের Request এর হিসাব, আর Cache সহ ও ছাড়া তফাতের ব্যাখ্যা</span>,
      <span key="3">my-tours এর Server Code, আর তিনটা Route এর curl -v ফলাফল</span>,
      <span key="4">দুইটা মাপা Idle Timeout, আর বলা আর করার তফাতের ব্যাখ্যা</span>,
      <span key="5">বন্ধুর জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
