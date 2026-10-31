/**
 * What: Module 06 Lesson 04, HTTP Headers. Header anatomy, request and response headers,
 * Content-Type, negotiation and compression, caching with Cache-Control and ETag, the same-origin
 * policy and CORS, security headers, and the headers a reverse proxy adds, all on Island Tours.
 *
 * Why: Most real HTTP bugs a developer meets (an old page after a deploy, a red CORS error, every
 * log line showing 127.0.0.1) live in headers, not in the body. The lesson teaches each header by
 * the job it does and the problem it solves, with commands and lab scripts that were run for real.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  CacheTimelineLab,
  CorsCheckLab,
  HeaderInspectorLab,
} from "../../../components/course/topics/http/headers-animations";
import {
  CacheLayersDiagram,
  CorsPreflightDiagram,
  CorsWhoEnforcesSplit,
  EtagRevalidationDiagram,
  ForwardedHeadersDiagram,
  HeaderAnatomyDiagram,
  HeaderFamiliesDiagram,
  HeadersEnvelopeDiagram,
  NegotiationDiagram,
  SameOriginDiagram,
} from "../../../components/course/topics/http/headers-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const httpHeadersContent: TopicData = {
  id: "http-headers",
  introduction: {
    badge: "MODULE 06 · LESSON 04",
    title: <SectionTitle>Body নয়, গোলমালটা লেবেলে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          এক সপ্তাহে Island Tours এর দলের কাছে তিনটা অভিযোগ এলো। প্রথমটা: বুকিং
          পাতার একটা ভুল দাম ঠিক করে Deploy করা হলো, অথচ পরদিন সকালেও অনেক
          পর্যটক পুরনো দাম দেখছেন। দ্বিতীয়টা: Island Tours এর Blog এ যে ছোট
          বাক্সটা আজকের দাম দেখাত, সেটা হঠাৎ ফাঁকা, আর Browser এর Console লাল
          লেখায় ভরা, CORS policy। তৃতীয়টা: Server এর Log এ দেখা যাচ্ছে প্রতিটা
          বুকিং এসেছে একই ঠিকানা থেকে, 127.0.0.1, যেন সারা দেশের পর্যটক একটাই
          মানুষ।
        </ContentParagraph>
        <ContentParagraph>
          তিনটা সমস্যার কোনোটাই পাতার ভেতরের লেখায় নয়, Code এর কোনো হিসাবেও নয়।
          তিনটাই লুকিয়ে ছিল Header এ, মানে প্রতিটা Request আর Response এর মাথায়
          বসানো সেই ছোট ছোট লাইনগুলোতে, যেগুলো লেসন ০২ এ আপনি প্রথম দেখেছেন। আর
          তিনটাই সারানো গেছে একটা করে লাইন বদলে।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসনে আপনি Header গুলোকে চিনবেন তাদের কাজ দিয়ে, নাম মুখস্থ করে নয়।
          একটা Header লাইনের গঠন, Browser নিজে থেকে কী কী পাঠায়, Server কী কী
          জানায়, Content-Type কেন এত জরুরি, Compression কীভাবে ঠিক হয়, Cache কে
          কতক্ষণ রাখতে দেবেন আর কীভাবে যাচাই করবেন, Same-Origin Policy আর CORS
          পুরোটা, নিরাপত্তার Header, আর Caddy এর মতো Reverse Proxy যে Header গুলো
          যোগ করে। প্রতিটা জিনিস নিজের যন্ত্রে চালিয়ে দেখবেন, আর শেষে উপরের তিনটা
          অভিযোগের সমাধান নিজেই লিখতে পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "কুরিয়ারের পার্সেল কেউ খুলে দেখে না ভেতরে কী আছে। সবাই লেবেল পড়ে। ঠিকানা কোথায়, ভেতরে কাচ আছে কি না, কতদিন গুদামে রাখা যাবে। লেবেল ভুল হলে জিনিসটা যতই ভালো হোক, ভুল জায়গায় যায়, অথবা ভেঙে যায়।",
      author: "HTTP Headers",
      role: "Lesson 04",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "what-is-a-header",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Header আসলে কী, আর এগুলো ছাড়া কেন চলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এ দেখেছেন, TCP দুই পাশের মাঝে একটা নির্ভরযোগ্য রাস্তা
                বানায়, আর সেই রাস্তা দিয়ে যায় শুধু Byte এর একটা ধারা। TCP জানে না
                Byte গুলো কী। লেসন ০২ এ দেখেছেন, HTTP সেই ধারার উপর একটা চুক্তি
                বসায়: প্রথমে একটা শুরুর লাইন, তারপর কয়েকটা Header লাইন, তারপর একটা
                ফাঁকা লাইন, তারপর Body।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা প্রশ্ন করুন। example.com এর পাতাটা চাইলে Server 577 Byte
                এর একটা Body পাঠায়। শুধু এই 577 Byte হাতে পেয়ে Browser কী বুঝবে? এটা
                কি একটা HTML পাতা, একটা ছবি, নাকি একটা JSON? এটা কি চাপ দিয়ে ছোট
                করা, আগে খুলতে হবে? এটা কি রেখে দেওয়া যাবে, পরের বার আবার চাইতে
                হবে না? Body নিজে এর একটারও উত্তর দেয় না। উত্তর দেয় Header।
              </ContentParagraph>
              <ContentParagraph>
                Header হলো একটা বার্তার সাথে লাগানো তথ্য, বার্তাটা নিয়ে তথ্য। এর
                ইংরেজি নাম Metadata, মানে তথ্যের তথ্য। প্রতিটা Header এক লাইনের,
                একটা নাম আর একটা মান, মাঝে কোলন। ঠিক কুরিয়ারের পার্সেলের লেবেলের
                মতো, যেটা পড়ে সবাই পার্সেলটা না খুলেই জানে কী করতে হবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HeadersEnvelopeDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কথা না বাড়িয়ে একটা আসল Request আর Response দেখি। নিচের কমান্ডে{" "}
              <code>curl</code> এর <code>-v</code> মানে Verbose, curl সব খুলে
              দেখাবে। <code>-o /dev/null</code> মানে curl Body টা ফেলে দেবে, আমরা
              শুধু Header দেখব। যে লাইনের শুরুতে <code>{">"}</code>, সেটা আপনার যন্ত্র পাঠিয়েছে।
              যে লাইনের শুরুতে <code>{"<"}</code>, সেটা Server থেকে এসেছে। এটা
              example.com থেকে আসল ফলাফল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-look.sh",
          code: `curl -sv -o /dev/null https://example.com 2>&1 | grep -E "^[<>]"

> GET / HTTP/2
> Host: example.com
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/2 200
< date: Sat, 31 Oct 2026 06:27:21 GMT
< content-type: text/html; charset=utf-8
< server: cloudflare
< last-modified: Sat, 24 Oct 2026 11:34:40 GMT
< allow: GET, HEAD
< accept-ranges: bytes
< age: 9337
< cf-cache-status: HIT
< cf-ray: a53097ee4c2d8cdb-DAC
< alt-svc: h3=":443"; ma=86400
<`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আপনার যন্ত্র পাঠিয়েছে তিনটা Header, Server ফেরত দিয়েছে দশটা। এই
                লেসন শেষে এর প্রতিটা লাইন আপনি অন্য কাউকে বুঝিয়ে বলতে পারবেন। এখনই
                তিনটা জিনিস খেয়াল করুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দুই পাশই Header পাঠায়।</strong> Browser এর Header বলে সে
                  কী চায় আর কী বোঝে। Server এর Header বলে সে কী দিল আর সেটা নিয়ে কী
                  করতে হবে।
                </ListItem>
                <ListItem>
                  <strong>যে পড়ে, সে কাজ করে।</strong> Header নিজে কিছু করে না।
                  একটা <code>content-type: text/html</code> লেখা থাকলে Browser পাতা
                  আঁকে। একটা <code>age: 9337</code> লেখা থাকলে বোঝা যায় জিনিসটা
                  মাঝের কোনো Cache এ ৯৩৩৭ সেকেন্ড ধরে জমা ছিল। প্রতিটা Header একটা
                  নির্দেশ বা একটা তথ্য, আর কাজটা করে যে পড়ছে।
                </ListItem>
                <ListItem>
                  <strong>অচেনা Header চুপচাপ উপেক্ষা করা হয়।</strong>{" "}
                  <code>cf-ray</code> বা <code>cf-cache-status</code> Cloudflare এর
                  নিজের Header। curl এগুলো চেনে না, তবু কোনো Error দেয়নি। HTTP এর
                  এই নিয়মটাই নতুন Header যোগ করা সম্ভব করেছে, পুরনো কোনো Browser না
                  ভেঙেই। কেউ নতুন একটা Header আবিষ্কার করলে যে চেনে সে ব্যবহার করে,
                  যে চেনে না সে এড়িয়ে যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Header, Body আর Metadata, এক নজরে",
          content: (
            <p>
              Body হলো আসল জিনিস: পাতার HTML, একটা ছবি, একটা বুকিং এর JSON। Header
              হলো সেই জিনিস সম্পর্কে তথ্য: এটা কী, কত বড়, কীভাবে ছোট করা, কতক্ষণ
              রাখা যাবে, কে পাঠাল, কে পড়তে পারবে। অনেক Request এ Body থাকেই না, যেমন
              একটা সাধারণ GET। কিন্তু Header ছাড়া কোনো HTTP বার্তা হয় না, কারণ
              অন্তত Host লাগবেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "anatomy",
      subHeader: { index: "002", title: "Anatomy" },
      title: <SectionTitle>একটা Header লাইনের গঠন, আর যে নিয়মগুলো সবার জন্য এক</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শত শত Header আছে, কিন্তু সবার লেখার নিয়ম এক। একবার এই নিয়মগুলো
              বুঝলে যেকোনো অচেনা Header পড়তে পারবেন। নিচের ছবিতে দুইটা Header কে
              টুকরো টুকরো করে দেখানো হলো।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HeaderAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>নাম, কোলন, মান।</strong> কোলনের পরের ফাঁকা জায়গা থাকা না
                  থাকা সমান, Server দুই পাশের ফাঁকা কেটে ফেলে। নামে কোনো ফাঁকা থাকে না।
                </ListItem>
                <ListItem>
                  <strong>নামের বড় ছোট হাত সমান।</strong> <code>Content-Type</code>,{" "}
                  <code>content-type</code> আর <code>CONTENT-TYPE</code> একই Header।
                  উপরের curl এর ফলাফলে HTTP/2 তে সব নাম ছোট হাতে এসেছিল, কারণ HTTP/2
                  তে নিয়মই হলো ছোট হাতে পাঠানো। HTTP/1.1 এ Server যেভাবে লেখে
                  সেভাবেই আসে। তাই Code এ কখনো নামের বানান হুবহু মিলিয়ে খুঁজবেন না।
                  Node এর <code>req.headers</code> সব নাম আগেই ছোট হাতে করে রাখে,
                  এজন্য সেখানে সবসময় <code>req.headers[&quot;content-type&quot;]</code>{" "}
                  লিখতে হয়।
                </ListItem>
                <ListItem>
                  <strong>মানের গঠন Header ভেদে আলাদা।</strong> কোনোটায় একটা শব্দ (
                  <code>nosniff</code>), কোনোটায় একটা সংখ্যা (
                  <code>Content-Length: 577</code>), কোনোটায় একটা তারিখ, কোনোটায়
                  একটা তালিকা। সেমিকোলনের পরে আসে Parameter, যেমন{" "}
                  <code>charset=utf-8</code>। কমা দিয়ে আলাদা করা থাকে তালিকার অংশ,
                  আর <code>q=0.9</code> এর মতো ওজন দিয়ে বলা হয় কোনটা কতটা পছন্দ।
                </ListItem>
                <ListItem>
                  <strong>তারিখ সবসময় GMT তে, একটা নির্দিষ্ট ছাঁচে।</strong>{" "}
                  <code>Sat, 24 Oct 2026 11:34:40 GMT</code>। বাংলাদেশের সময় নয়,
                  কারো স্থানীয় সময়ই নয়, যাতে পৃথিবীর যেকোনো যন্ত্র একইভাবে পড়তে
                  পারে।
                </ListItem>
                <ListItem>
                  <strong>একই নাম দুইবার এলে জুড়ে যায়।</strong> একই Header দুই লাইনে
                  পাঠালে প্রায় সব ক্ষেত্রে সেটা কমা দিয়ে জোড়া একটা লাইনের সমান ধরা
                  হয়। ব্যতিক্রম একটাই, <code>Set-Cookie</code>, কারণ একটা Cookie এর
                  মানের ভেতরেই কমা থাকতে পারে। তাই প্রতিটা Cookie আলাদা লাইনে আসে,
                  লেসন ০৫ এ দেখবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শেষ নিয়মটা নিজের চোখে দেখি। Lab এর এক নম্বর পরীক্ষার ছোট Server টা
                যা পায় তা দুইভাবে ছাপে: <code>rawHeaders</code> এ ঠিক যেভাবে এসেছে
                সেভাবে, আর <code>headers</code> এ Node যেভাবে সাজিয়ে রাখে সেভাবে।
                curl দিয়ে একটা Header দুইবার পাঠানো হয়েছে, একটার নাম ইচ্ছা করে ছোট
                হাতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "echo-headers-output.txt",
          code: `curl -s -H "X-Request-Id: req-001" \\
     -H "accept-language: bn-BD, bn;q=0.9, en;q=0.8" \\
     -H "X-Trace: a" -H "X-Trace: b" \\
     "http://localhost:47641/api/tours?date=2026-12-20"

# Server যা পেল, যেভাবে এসেছে (rawHeaders):
GET /api/tours?date=2026-12-20 HTTP/1.1
  Host: localhost:47641
  User-Agent: curl/8.7.1
  Accept: */*
  X-Request-Id: req-001
  accept-language: bn-BD, bn;q=0.9, en;q=0.8
  X-Trace: a
  X-Trace: b

# Node যেভাবে সাজিয়ে রাখে (req.headers):
  "host": "localhost:47641",
  "user-agent": "curl/8.7.1",
  "accept": "*/*",
  "x-request-id": "req-001",
  "accept-language": "bn-BD, bn;q=0.9, en;q=0.8",
  "x-trace": "a, b"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা জিনিস প্রমাণ হলো। সব নাম ছোট হাতে হয়ে গেছে, আর দুইটা{" "}
                <code>X-Trace</code> জুড়ে হয়েছে <code>a, b</code>। এবার দুইটা
                ব্যবহারিক নিয়ম, যেগুলো না জানলে একদিন অবাক হবেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Header এর মোট আকারের একটা সীমা আছে।</strong> Node এর
                  Default সীমা 16 KB, সব Header মিলিয়ে। অনেক Server আর Proxy এর সীমা
                  এর চেয়েও কম। সীমা পার হলে Server উত্তর দেয়{" "}
                  <code>431 Request Header Fields Too Large</code>, অথবা কিছু না বলেই
                  Connection কেটে দেয়। বাস্তবে এটা প্রায় সবসময় ঘটে অনেক বড় Cookie
                  বা অনেক বড় Token এর কারণে, লেসন ০৫ আর ০৬ এ আবার আসবে।
                </ListItem>
                <ListItem>
                  <strong>নিজের Header বানানো যায়।</strong> একসময় নিয়ম ছিল নিজের
                  বানানো Header এর নামের শুরুতে <code>X-</code> বসানো। ২০১২ সালে RFC
                  6648 এই অভ্যাসটা বাদ দিতে বলেছে, কারণ ভালো একটা Header পরে মান্য হয়ে
                  গেলে নামের X- টা আর সরানো যায় না। তবু পুরনো অনেক নাম রয়ে গেছে,{" "}
                  <code>X-Request-Id</code>, <code>X-Forwarded-For</code>। নতুন কিছু
                  বানালে একটা পরিষ্কার নাম দিন, X- ছাড়া।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের Lab এ একটা পর্যটকের ফোন থেকে Island Tours এর Tour পাতার একটা
                আসল চেহারার Request আর তার Response সাজানো আছে। যেকোনো লাইনে চাপ দিয়ে
                দেখুন সেটা কী বলে আর কে বসায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HeaderInspectorLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "request-headers",
      subHeader: { index: "003", title: "Request Headers" },
      title: <SectionTitle>Request Header, যা Browser আপনাকে না জানিয়েই পাঠায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              curl পাঠিয়েছিল তিনটা Header। Browser এ একটা পাতা খুললে যায় এক ডজনের
              বেশি, আর তার প্রায় কোনোটাই আপনি নিজে লেখেননি। নামগুলো মুখস্থ করার
              বদলে প্রশ্ন দিয়ে মনে রাখুন। প্রতিটা Header কোনো একটা প্রশ্নের উত্তর।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <HeaderFamiliesDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Header", "একটা আসল উদাহরণ", "কী বলে", "কে বসায়"],
          rows: [
            [mono("Host"), "islandtours.example", "কোন সাইট চাই। একই IP তে অনেক সাইট, লেসন ০২", "Browser, URL থেকে"],
            [mono("User-Agent"), "Mozilla/5.0 (...) Chrome/156.0.0.0 Safari/537.36", "কোন Browser, কোন যন্ত্র", "Browser"],
            [mono("Accept"), "text/html,application/xhtml+xml,...,*/*;q=0.8", "কোন রূপের উত্তর চাই", "Browser"],
            [mono("Accept-Encoding"), "gzip, deflate, br, zstd", "কোন Compression খুলতে পারি", "Browser"],
            [mono("Accept-Language"), "bn-BD,bn;q=0.9,en;q=0.8", "পছন্দের ভাষা", "Browser, যন্ত্রের Setting"],
            [mono("Referer"), "https://islandtours.example/tours", "কোন পাতা থেকে এলাম", "Browser"],
            [mono("Origin"), "https://admin.islandtours.example", "কোন Origin এর পাতা এই Request পাঠাল", "Browser, শুধু কিছু Request এ"],
            [mono("Sec-Fetch-Site"), "same-origin, same-site, cross-site", "Request টা কোথা থেকে শুরু", "Browser, JavaScript বদলাতে পারে না"],
            [mono("Cookie"), "__Host-session=...", "আগে পাওয়া Cookie ফেরত দেওয়া", "Browser, লেসন ০৫"],
            [mono("Authorization"), "Bearer eyJhbGciOi...", "আমার পরিচয়ের প্রমাণ", "App এর Code, লেসন ০৬"],
            [mono("If-None-Match"), '"TLA3YHQRl1KfW0Q0"', "এই কপি আছে, বদলালে তবেই দিন", "Browser, Cache থেকে"],
            [mono("Range"), "bytes=0-99", "পুরোটা নয়, শুধু এই অংশ", "Video Player, Download Manager"],
            [mono("Content-Type"), "application/json", "আমার পাঠানো Body টা কী", "Body থাকলে, পাঠানো Code"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              তালিকাটা আন্দাজে লেখা নয়। Lab এর এক নম্বর Server চালু রেখে Chrome 156
              দিয়ে <code>http://localhost:47641/</code> খোলা হয়েছিল, Server এর
              Terminal এ যা এসেছে হুবহু নিচে। Chrome টা Headless অবস্থায় চালানো, তাই
              User-Agent এ HeadlessChrome লেখা, সাধারণ Chrome এ সেখানে শুধু Chrome
              থাকে। খেয়াল করুন পাতাটা আসার পরেই Browser নিজে থেকে একটা{" "}
              <code>/favicon.ico</code> চেয়েছে, মানে Tab এর ছোট্ট ছবিটা, আর সেই
              Request এর Header গুলো একটু আলাদা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "what-chrome-sends.txt",
          code: `GET / HTTP/1.1
  Host: localhost:47641
  Connection: keep-alive
  sec-ch-ua: "Not:A-Brand";v="8", "Chromium";v="156", "Google Chrome";v="156"
  sec-ch-ua-mobile: ?0
  sec-ch-ua-platform: "macOS"
  Upgrade-Insecure-Requests: 1
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/156.0.0.0 Safari/537.36
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
  Sec-Fetch-Site: none
  Sec-Fetch-Mode: navigate
  Sec-Fetch-User: ?1
  Sec-Fetch-Dest: document
  Accept-Encoding: gzip, deflate, br, zstd
  Accept-Language: en-US,en;q=0.9

GET /favicon.ico HTTP/1.1
  Host: localhost:47641
  Accept: image/jxl,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
  Sec-Fetch-Site: same-origin
  Sec-Fetch-Mode: no-cors
  Sec-Fetch-Dest: image
  Referer: http://localhost:47641/
  Accept-Encoding: gzip, deflate, br, zstd
  (বাকি লাইন উপরের মতোই, তাই বাদ দেওয়া)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাতার Request এ <code>Sec-Fetch-Site: none</code>, কারণ কেউ নিজে Address
              Bar এ লিখেছে, কোনো সাইট থেকে আসেনি। <code>Sec-Fetch-Dest: document</code>{" "}
              মানে একটা পুরো পাতা। Favicon এর Request এ সব বদলে গেছে: Accept এ এখন শুধু
              ছবি, <code>Sec-Fetch-Site: same-origin</code> কারণ পাতাটা নিজেই চেয়েছে,{" "}
              <code>Sec-Fetch-Dest: image</code>, আর প্রথমবার একটা{" "}
              <code>Referer</code>। একই Browser, একই সাইট, শুধু Request এর কারণ আলাদা,
              আর Header গুলো ঠিক সেটাই বলে দিচ্ছে। <code>sec-ch-ua</code> দিয়ে শুরু
              হওয়া লাইনগুলো Client Hints, লম্বা User-Agent এর বদলে Browser এর নাম আর
              Version ভাগ করে বলার নতুন উপায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর মধ্যে চারটা নিয়ে আলাদা করে কথা বলা দরকার, কারণ এই চারটা নিয়েই
                সবচেয়ে বেশি ভুল ধারণা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>User-Agent এর উপর ভরসা নয়।</strong> এখনকার প্রায় প্রতিটা
                  Browser এর User-Agent শুরু হয় <code>Mozilla/5.0</code> দিয়ে, এমনকি
                  Chrome আর Safari ও। কারণটা ইতিহাসের: নব্বইয়ের দশকে সাইটগুলো শুধু
                  Mozilla দেখলে ভালো পাতা দিত, তাই সবাই নিজেকে Mozilla বলা শুরু করল।
                  এই লেখা যে কেউ যা খুশি বসাতে পারে, curl এ <code>-A</code> দিয়েই।
                  পরিসংখ্যানের জন্য কাজের, কিন্তু কাউকে ঢুকতে দেওয়া বা না দেওয়ার
                  সিদ্ধান্ত এর উপর নেবেন না।
                </ListItem>
                <ListItem>
                  <strong>Referer এর বানান ভুল, আর সেটা ইচ্ছা করেই রাখা।</strong>{" "}
                  ইংরেজি শব্দটা Referrer, কিন্তু ১৯৯৬ সালের মূল নিয়মপত্রে একটা r কম
                  লেখা হয়েছিল, আর ততদিনে সারা পৃথিবীর Server সেই বানান চিনে ফেলেছে।
                  এটা বলে পর্যটক কোন পাতা থেকে এসেছেন। কতটুকু বলবে, সেটা ঠিক করে{" "}
                  <code>Referrer-Policy</code> (এই নামে বানান ঠিক)। এখনকার Browser এর
                  Default হলো <code>strict-origin-when-cross-origin</code>: নিজের
                  সাইটের ভেতরে পুরো URL যায়, অন্য সাইটে গেলে শুধু Origin যায়, মানে{" "}
                  <code>https://islandtours.example/</code>, Path আর Query ছাড়া। লেসন
                  ০১ এর সতর্কবাণী এখানেই কাজে লাগে: Query তে গোপন কিছু থাকলে আগে সেটা
                  পুরো URL সহ অন্য সাইটে চলে যেত।
                </ListItem>
                <ListItem>
                  <strong>Origin সব Request এ যায় না।</strong> Browser Origin পাঠায়
                  যখন Request টা অন্য Origin এ যাচ্ছে, আর যখন Method টা GET বা HEAD নয়,
                  যেমন একটা POST। এতে থাকে শুধু Scheme, Host আর Port, কোনো Path নয়।
                  CORS পুরোটা এই Header এর উপর দাঁড়িয়ে, এই লেসনের ০০৯ থেকে ০১১ সেকশনে।
                  আর লেসন ০৫ এ দেখবেন একটা জাল Request ধরতেও Server এটা পড়ে।
                </ListItem>
                <ListItem>
                  <strong>Sec-Fetch Header গুলো JavaScript জাল করতে পারে না।</strong>{" "}
                  এখনকার Browser প্রতিটা Request এর সাথে <code>Sec-Fetch-Site</code>,{" "}
                  <code>Sec-Fetch-Mode</code> আর <code>Sec-Fetch-Dest</code> পাঠায়।
                  এরা বলে Request টা একই সাইট থেকে শুরু হয়েছে নাকি অন্য সাইট থেকে,
                  একটা পাতা খুলতে নাকি একটা ছবি আনতে। কোনো পাতার JavaScript এগুলো
                  বদলাতে পারে না। একই নিয়ম <code>Host</code>, <code>Cookie</code>,{" "}
                  <code>Origin</code> আর <code>Referer</code> এর বেলায়ও, Browser এগুলো
                  কোনো Script কে বসাতে দেয় না। তাই কোনো Request যদি Browser থেকে
                  এসে থাকে, Server এদের উপর কিছুটা ভরসা করতে পারে। কিন্তু curl বা যে
                  কোনো Script এগুলো যা খুশি বসাতে পারে, তাই এরা একটা বাড়তি পাহারা,
                  একমাত্র পাহারা নয়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের Browser কী পাঠায়, দেখে নিন",
          content: (
            <p>
              Lab এর এক নম্বর Server চালু রেখে Browser এ{" "}
              <code>http://localhost:47641/</code> খুলুন, তারপর Terminal দেখুন।
              curl এর তিনটা Header এর পাশে Browser এর পুরো তালিকাটা দেখবেন,{" "}
              <code>Sec-Fetch-*</code> সহ। একই পাতা অন্য একটা Browser এ খুলে দুইটা
              তালিকা মিলিয়ে দেখুন। কোথায় কোথায় আলাদা, আর কেন, সেটা অ্যাসাইনমেন্টের
              প্রথম কাজ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "response-headers",
      subHeader: { index: "004", title: "Response Headers" },
      title: <SectionTitle>Response Header, আর DevTools এ এগুলো পড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার Server এর দিক। সেকশন ০০১ এর example.com এর উত্তরটা আবার নিই, আর
              এবার প্রতিটা লাইন ধরে ধরে পড়ি। এটাই সবচেয়ে ভালো অভ্যাস: অচেনা একটা
              সাইটের উত্তর দেখে প্রতিটা লাইনের মানে বলতে পারা।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["লাইন", "মানে"],
          rows: [
            [mono("HTTP/2 200"), "Status Line। Version আর Status Code, লেসন ০২ আর ০৩"],
            [mono("date: Sat, 31 Oct 2026 06:27:21 GMT"), "Server এর ঘড়িতে উত্তরটা বানানোর সময়, GMT তে"],
            [mono("content-type: text/html; charset=utf-8"), "Body টা একটা HTML পাতা, অক্ষর UTF-8 এ। সেকশন ০০৫"],
            [mono("server: cloudflare"), "উত্তরটা কে দিল। এখানে আসল Server এর সামনে বসা CDN"],
            [mono("last-modified: Sat, 24 Oct 2026 11:34:40 GMT"), "পাতাটা শেষবার কবে বদলেছে। যাচাইয়ের কাজে লাগে, সেকশন ০০৮"],
            [mono("allow: GET, HEAD"), "এই URL এ কোন Method চলে। লেসন ০৩ এর 405 এর সাথে এটা আসার কথা"],
            [mono("accept-ranges: bytes"), "পুরোটা না চেয়ে Byte এর একটা অংশ চাওয়া যাবে"],
            [mono("age: 9337"), "CDN এর Cache এ জিনিসটা ৯৩৩৭ সেকেন্ড, মানে আড়াই ঘণ্টার বেশি ধরে আছে"],
            [mono("cf-cache-status: HIT"), "Cloudflare এর নিজের Header। HIT মানে আসল Server এ না গিয়ে Cache থেকে দিয়েছে"],
            [mono("cf-ray: ...-DAC"), "Cloudflare এর নিজের Request নম্বর। শেষের DAC হলো ঢাকার Data Center এর কোড"],
            [mono("alt-svc: h3=\":443\"; ma=86400"), "HTTP/3 ও চলে, পরের বার চেষ্টা করতে পারেন। লেসন ০২"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>cf-ray</code> এর শেষের <code>DAC</code> টা খেয়াল করার মতো।
                এটা ঢাকা বিমানবন্দরের তিন অক্ষরের কোড, Cloudflare এর প্রতিটা Data
                Center এভাবে নাম পায়। মানে আপনার Request টা পৃথিবী ঘুরে আমেরিকায়
                যায়নি, ঢাকার Cloudflare থেকেই উত্তর এসেছে, আর <code>age</code> আর{" "}
                <code>HIT</code> বলছে আসল Server জানেও না যে আপনি চেয়েছিলেন। Module
                02 এর Latency এর হিসাবটা মনে করুন, কাছের জায়গা থেকে উত্তর আসা মানে
                দ্রুত উত্তর।
              </ContentParagraph>
              <ContentParagraph>
                আর খেয়াল করুন কী নেই। কোনো <code>cache-control</code> নেই। এর ফল কী
                হয়, সেটা সেকশন ০০৭ এ দেখবেন। নিচের তালিকায় সেই Response Header গুলো,
                যেগুলো প্রায় প্রতিদিন আপনার কাজে লাগবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Header", "একটা উদাহরণ", "কাজ", "কোথায় বেশি"],
          rows: [
            [mono("Content-Type"), "application/json; charset=utf-8", "Body টা কী", "সেকশন ০০৫"],
            [mono("Content-Length"), "577", "Body কত Byte, ঠিক কোথায় শেষ", "লেসন ০২"],
            [mono("Content-Encoding"), "gzip", "Body কীভাবে ছোট করা", "সেকশন ০০৬"],
            [mono("Content-Disposition"), 'attachment; filename="ticket-bk_7Q2M9X.txt"', "পাতায় দেখাবে নাকি ফাইল হিসেবে নামবে", "নিচে"],
            [mono("Location"), "/api/bookings/bk_7Q2M9X", "নতুন জিনিসটা কোথায়, বা কোথায় যেতে হবে", "লেসন ০৩, 201 আর 3xx"],
            [mono("Cache-Control"), "public, max-age=60", "কে কতক্ষণ রাখতে পারবে", "সেকশন ০০৭"],
            [mono("ETag"), '"TLA3YHQRl1KfW0Q0"', "এই Body এর আঙুলের ছাপ", "সেকশন ০০৮"],
            [mono("Vary"), "Accept-Encoding, Origin", "উত্তর কোন Request Header এর উপর নির্ভর করে", "সেকশন ০০৬, ০১০"],
            [mono("Retry-After"), "120", "কত সেকেন্ড পরে আবার চেষ্টা করবেন", "লেসন ০৩, 429 আর 503"],
            [mono("Set-Cookie"), "__Host-session=...; HttpOnly", "Browser কে মনে রাখতে দেওয়া", "লেসন ০৫"],
            [mono("Access-Control-Allow-Origin"), "https://admin.islandtours.example", "অন্য Origin এর JavaScript পড়তে পারবে কি না", "সেকশন ০১০"],
            [mono("Strict-Transport-Security"), "max-age=31536000", "এই সাইট শুধু HTTPS এ", "সেকশন ০১২, লেসন ০৭"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Content-Disposition</strong> নিয়ে একটু বলি, কারণ এটা
                প্রায়ই লাগে। পর্যটক বুকিং শেষে টিকিটটা নামাতে চান। Server যদি শুধু
                Body টা পাঠায়, Browser সেটা একটা পাতায় খুলে দেখায়। সাথে{" "}
                <code>Content-Disposition: attachment</code> থাকলে Browser পাতা খোলে
                না, ফাইলটা নামিয়ে রাখে, আর <code>filename</code> থেকে নামটা নেয়।{" "}
                <code>inline</code> লিখলে আবার পাতায় দেখায়, যেমন PDF টা Browser এই
                খুলুক চাইলে। ফাইলের নাম বাংলায় দিতে চাইলে সাধারণ{" "}
                <code>filename</code> এ হয় না, তখন <code>filename*=UTF-8&apos;&apos;</code>{" "}
                এর পরে লেসন ০১ এর Percent-encoding এ লেখা নাম দিতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>DevTools এ Header পড়া।</strong> Terminal এর বাইরে Header দেখার
                সবচেয়ে সহজ জায়গা Browser নিজেই। ধাপগুলো এরকম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Network Tab খুলুন",
              description:
                "Chrome এ F12, অথবা Mac এ Cmd+Option+I, তারপর Network। খোলা অবস্থায় পাতাটা Reload করুন, কারণ DevTools খোলার আগের Request গুলো সে দেখেনি।",
            },
            {
              title: "একটা Request বেছে নিন",
              description:
                "তালিকার প্রথম লাইনটা সাধারণত পাতার HTML নিজে। সেটায় চাপ দিন, ডান পাশে Headers নামের Tab খুলবে।",
            },
            {
              title: "General অংশ পড়ুন",
              description:
                "Request URL, Request Method, Status Code, Remote Address আর Referrer Policy। Remote Address এ দেখবেন কোন IP আর Port এ কথা হয়েছে, যেমন 103.94.135.2:443। Module 04 আর 05 এর পুরো কাজের ফল এই একটা লাইন।",
            },
            {
              title: "Response Headers আর Request Headers",
              description:
                "দুইটা আলাদা অংশ। HTTP/2 তে Request Headers এর মাথায় :authority, :method, :path, :scheme দেখবেন। এগুলো HTTP/2 এর Pseudo-header, HTTP/1.1 এর Request Line আর Host এর জায়গা নিয়েছে, লেসন ০২ এ এর কথা আছে। Raw বা View source চাপলে Header গুলো তারের উপর যেভাবে গেছে সেভাবে দেখায়।",
            },
            {
              title: "Size কলামটা দেখুন",
              description:
                "সেখানে দুইটা সংখ্যা থাকে, তারে কতটুকু এসেছে আর খোলার পরে আসল আকার কত। Compression থাকলে প্রথমটা ছোট। আর সংখ্যার বদলে memory cache বা disk cache লেখা থাকলে Request টা তারে যায়ইনি, Browser নিজের Cache থেকে দিয়েছে।",
            },
            {
              title: "Copy as cURL",
              description:
                "যেকোনো Request এ Right Click করে Copy, তারপর Copy as cURL। Terminal এ বসালে সব Header সহ ঠিক একই Request আবার পাঠাতে পারবেন। Bug খোঁজার সময় এটা সবচেয়ে কাজের কৌশল। তবে এতে আপনার Cookie আর Token ও থাকে, তাই কাউকে পাঠানোর আগে মুছে নিন।",
            },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "content-type",
      subHeader: { index: "005", title: "Content-Type" },
      title: <SectionTitle>Content-Type: Body টা কী, সেটা না বললে Browser আন্দাজ করে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একই 577 Byte একটা HTML পাতা হতে পারে, আবার শুধু লেখাও হতে পারে।
                Browser কোনটা ধরবে, সেটা ঠিক হয় একটা Header দিয়ে, Content-Type। এর
                মানের নাম MIME Type, দুই অংশে লেখা, মাঝে একটা স্ল্যাশ: প্রথমে বড় জাত,
                তারপর নির্দিষ্ট ধরন। <code>text/html</code> মানে লেখা, তার মধ্যে
                HTML। <code>image/webp</code> মানে ছবি, WebP ধরনের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["MIME Type", "কী", "Island Tours এ কোথায়"],
          rows: [
            [mono("text/html; charset=utf-8"), "HTML পাতা", "/tours/saint-martin"],
            [mono("text/css"), "পাতার সাজ", "/_next/static/... .css"],
            [mono("text/javascript"), "JavaScript", "/_next/static/... .js"],
            [mono("application/json"), "JSON Data", "/api/tours, /api/bookings"],
            [mono("application/problem+json"), "Error এর বিবরণ, লেসন ০৩", "API এর 4xx আর 5xx উত্তর"],
            [mono("image/webp, image/png, image/svg+xml"), "ছবি", "Tour এর ছবি, Logo"],
            [mono("application/pdf"), "PDF", "বুকিং এর টিকিট"],
            [mono("application/x-www-form-urlencoded"), "সাধারণ HTML Form এর Body", "যোগাযোগের Form"],
            [mono("multipart/form-data"), "ফাইল সহ Form", "পর্যটকের ছবি Upload"],
            [mono("text/event-stream"), "Server থেকে টানা খবর", "আসনের খবর, লেসন ১০"],
            [mono("application/octet-stream"), "অচেনা Byte, ধরন জানা নেই", "যখন কেউ ধরন বলেনি"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>charset এর দাম বাংলায় সবচেয়ে বেশি।</strong> লেখা Byte এ
                বদলানোর নিয়মের নাম Encoding, আর আজকের প্রায় সবকিছু UTF-8। Module 01 এ
                দেখেছেন, একটা ইংরেজি অক্ষর UTF-8 এ এক Byte, কিন্তু একটা বাংলা অক্ষর
                তিন Byte। Lab এর দুই নম্বর পরীক্ষার পাতায় একটা বাংলা শিরোনাম আছে,
                সেটার প্রথম কয়েকটা Byte এরকম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "bangla-bytes.txt",
          code: `curl -s http://localhost:47642/no-charset | xxd | head -2
00000000: 3c68 313e e0a6 b8e0 a787 e0a6 a8e0 a78d  <h1>............
00000010: e0a6 9f20 e0a6 aee0 a6be e0a6 b0e0 a78d  ... ............

# একই Byte গুলো কেউ যদি UTF-8 না ধরে Windows-1252 ধরে পড়ে, তাহলে
# "সেন্ট মার্টিন" হয়ে যায় এরকম:
à¦¸à§‡à¦¨à§�à¦Ÿ à¦®à¦¾à¦°à§�à¦Ÿà¦¿à¦¨`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>e0 a6 b8</code> এই তিনটা Byte মিলে একটা বাংলা অক্ষর, স। Server
                যদি <code>charset=utf-8</code> না বলে, আর পাতার ভেতরেও{" "}
                <code>{'<meta charset="utf-8">'}</code> না থাকে, Browser কে আন্দাজ
                করতে হয়। কখনো সে ঠিক আন্দাজ করে, কখনো পুরনো Windows-1252 ধরে নেয়,
                আর তখন পর্যটক উপরের মতো অর্থহীন চিহ্ন দেখেন। এই ভাঙা চেহারার নাম
                Mojibake। এটা দেখলেই বুঝবেন, Byte গুলো ঠিক আছে, শুধু পড়ার নিয়ম ভুল।
                সমাধান সবসময় এক: লেখা পাঠালে charset সহ পাঠান।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Request এর Content-Type ও সমান জরুরি।</strong> Browser বা
                আপনার Code যখন Body সহ কিছু পাঠায়, তখন Server কে জানাতে হয় Body টা
                কী। Server এর Framework ঠিক এই Header দেখে ঠিক করে Body কে কীভাবে
                ভাঙবে। একই বুকিং তিনভাবে পাঠানো যায়:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "three-bodies.txt",
          code: `# ১. JSON, App এর JavaScript থেকে
Content-Type: application/json

{"tour":"saint-martin","guests":2}

# ২. সাধারণ HTML Form থেকে, লেসন ০১ এর Query এর মতো করে লেখা
Content-Type: application/x-www-form-urlencoded

tour=saint-martin&guests=2

# ৩. ফাইল সহ Form, প্রতিটা অংশ একটা boundary দিয়ে আলাদা
Content-Type: multipart/form-data; boundary=----it7Q2M9X

------it7Q2M9X
Content-Disposition: form-data; name="guests"

2
------it7Q2M9X--`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                JSON পাঠিয়ে Content-Type দিতে ভুলে গেলে কী হয়? <code>fetch</code>{" "}
                এ একটা String Body দিলে Browser নিজে থেকে বসায়{" "}
                <code>text/plain;charset=UTF-8</code>। Server এর JSON Parser এটা
                দেখে Body ছোঁয়ই না, ফলে Code এ <code>req.body</code> ফাঁকা আসে আর
                বুকিং ব্যর্থ হয় একটা 400 দিয়ে, অথবা Server কড়া হলে 415 Unsupported
                Media Type দিয়ে, লেসন ০৩ এর দুইটা Code। Body দেখতে ঠিক, Header ভুল।
              </ContentParagraph>
              <ContentParagraph>
                <strong>উল্টো দিকের সবচেয়ে চেনা Error।</strong> আপনার Frontend এর
                Code একটা API ডাকে আর ধরে নেয় উত্তর JSON, তারপর{" "}
                <code>response.json()</code> চালায়। একদিন API এর সামনের Proxy একটা
                502 দেয়, তার Body একটা HTML পাতা। তখন Console এ আসে এরকম:{" "}
                <code>{`SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`}</code>
                । ওই <code>{"<"}</code> টা HTML এর প্রথম অক্ষর। এই Error দেখলে JSON
                Parser কে দোষ দেবেন না, আগে Network Tab এ দেখুন Status কত আর
                Content-Type কী এসেছে। ভালো Code Parse করার আগে নিজেই এই দুইটা মিলিয়ে
                নেয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Sniffing, আর nosniff।</strong> Content-Type না থাকলে বা ভুল
                থাকলে Browser Body এর প্রথম কয়েকটা Byte দেখে ধরন আন্দাজ করার চেষ্টা
                করে। এর নাম MIME Sniffing। সুবিধাজনক শোনালেও এটা বিপজ্জনক। ধরুন একজন
                পর্যটক প্রোফাইলের ছবি হিসেবে একটা ফাইল Upload করলেন, যার ভেতরে আসলে
                HTML আর JavaScript। Browser আন্দাজ করে সেটাকে পাতা হিসেবে চালিয়ে
                দিলে সেই Script Island Tours এর নামে চলবে। Response এ{" "}
                <code>X-Content-Type-Options: nosniff</code> বসালে Browser আর আন্দাজ
                করে না, Content-Type যা বলে তাই মানে। এই Header এর একমাত্র বৈধ মান{" "}
                <code>nosniff</code>, আর এটা প্রতিটা Response এ থাকা উচিত।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "negotiation-compression",
      subHeader: { index: "006", title: "Negotiation" },
      title: <SectionTitle>Content Negotiation আর Compression: চাওয়া, পাওয়া, আর Vary</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Browser বলে সে কী কী বোঝে, Server তার মধ্য থেকে নিজের সামর্থ্য অনুযায়ী
              একটা বেছে নেয় আর জানায় কোনটা দিল। এই দরকষাকষির নাম Content
              Negotiation। প্রতিটা চাওয়ার Header এর একটা জোড়া আছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <NegotiationDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Accept।</strong> Browser পাতা চাইলে HTML কে সবার আগে রাখে,
                আর ছবি চাইলে বলে <code>image/avif,image/webp,...</code>। একই URL
                থেকে কেউ HTML আর কেউ JSON চাইতে পারে, যদিও বাস্তবে বেশিরভাগ API
                একটা URL এ একটাই রূপ দেয়। Server কিছুই দিতে না পারলে উত্তর{" "}
                <code>406 Not Acceptable</code>, যদিও খুব কম Server এতটা কড়া।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Accept-Language।</strong> পর্যটকের ফোন বাংলায় সেট করা থাকলে
                প্রথম পছন্দ <code>bn-BD</code>। Island Tours এটা দেখে প্রথমবার আসা
                পর্যটককে বাংলা পাতায় পাঠানোর প্রস্তাব দিতে পারে। তবে বেশিরভাগ সাইট
                ভাষা রাখে URL এ, যেমন <code>/bn/tours</code>, Header এ নয়। কারণ একটা
                URL বন্ধুকে পাঠালে তিনি যেন একই ভাষার পাতা দেখেন, তাঁর ফোনের ভাষা
                যাই হোক।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Accept-Encoding আর Compression।</strong> এটাই সবচেয়ে বেশি কাজের
                জোড়া। লেখা ধরনের জিনিস, HTML, CSS, JavaScript, JSON, চাপ দিয়ে অনেক
                ছোট করা যায়, কারণ এদের ভেতরে একই শব্দ বারবার আসে। তিনটা পদ্ধতি এখন
                চলে: পুরনো আর সব জায়গায় চলা <code>gzip</code>, Google এর বানানো{" "}
                <code>br</code> (Brotli), আর নতুন <code>zstd</code> (Zstandard)।
                Chrome পাঠায় <code>gzip, deflate, br, zstd</code>। curl নিজে থেকে কিছুই
                পাঠায় না, তাই curl কে সবসময় পুরো আকারের জিনিস দেওয়া হয়, যদি না{" "}
                <code>--compressed</code> লেখেন বা নিজে Header বসান। Lab এর তিন নম্বর
                পরীক্ষায় দুইশো Tour এর একটা তালিকা তিনভাবে চাওয়া হয়েছে, আসল ফলাফল:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "compression-sizes.txt",
          code: `curl -s -o /dev/null -w "%{size_download} bytes\\n" http://localhost:47643/api/tours
23706 bytes

curl -s -o /dev/null -w "%{size_download} bytes\\n" -H "Accept-Encoding: gzip" http://localhost:47643/api/tours
1209 bytes

curl -s -o /dev/null -w "%{size_download} bytes\\n" -H "Accept-Encoding: gzip, deflate, br, zstd" http://localhost:47643/api/tours
646 bytes

# example.com এর ছোট পাতাটা: 577 Byte, gzip এ 400 Byte`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ২৩ হাজার Byte থেকে সাড়ে ছয়শো। সংখ্যাটা অবাক করার মতো, কারণ Lab এর
                তালিকায় একই লেখা দুইশোবার আছে। আসল একটা API এর উত্তর সাধারণত এতটা
                ছোট হয় না, তবু কয়েক গুণ ছোট হওয়া খুবই স্বাভাবিক। আর মোবাইল Data তে
                একজন পর্যটকের কাছে প্রতিটা Byte এর দাম আছে। উল্টো দিকে example.com এর
                ছোট পাতাটা 577 থেকে মাত্র 400, কারণ ছোট জিনিসে চাপ দিয়ে লাভ কম। তাই
                Server গুলো সাধারণত খুব ছোট উত্তরে Compression করেই না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ছবি আর ভিডিও আবার চাপবেন না।</strong> JPEG, PNG, WebP,
                  MP4, ZIP আগে থেকেই চাপা। আবার gzip করলে একটুও ছোট হয় না, শুধু
                  CPU এর সময় নষ্ট।
                </ListItem>
                <ListItem>
                  <strong>Content-Length তখন চাপা আকারের।</strong> Body যতটা তারে
                  যাচ্ছে, Content-Length ততটাই বলে। খোলার পরের আকার কোনো Header এ
                  থাকে না।
                </ListItem>
                <ListItem>
                  <strong>Vary না দিলে একজনের উত্তর আরেকজন পায়।</strong> ধরুন একটা
                  CDN এর Cache এ প্রথম যিনি এলেন তাঁর Browser br বোঝে, তাই br এ চাপা
                  উত্তরটা জমা হলো। এরপর এলো একটা পুরনো App, যেটা শুধু gzip বোঝে। CDN
                  যদি না জানে উত্তরটা Accept-Encoding এর উপর নির্ভর করে, সে জমা রাখা
                  br কপিটাই দিয়ে দেবে, আর App টা পাবে অর্থহীন Byte।{" "}
                  <code>Vary: Accept-Encoding</code> Cache কে বলে, এই Header এর
                  প্রতিটা আলাদা মানের জন্য আলাদা কপি রাখুন। Lab এর Server ঠিক এটা
                  বসায়।
                </ListItem>
                <ListItem>
                  <strong>Island Tours এ Compression করে Caddy।</strong> App নিজে
                  এই কাজ করে না, Caddy এর <code>encode</code> Directive করে। Caddy এর
                  নিজের ভেতরে zstd আর gzip আছে, আর তালিকায় যেটা আগে লেখা সেটা আগে
                  পছন্দ। সেকশন ০১৪ এ পুরো Config দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "cache-control",
      subHeader: { index: "007", title: "Cache-Control" },
      title: <SectionTitle>Cache-Control: কে রাখবে, কতক্ষণ রাখবে, আর কখন জিজ্ঞেস করবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সবচেয়ে দ্রুত Request হলো যেটা পাঠাতেই হয়নি। Island Tours এর Logo টা
                প্রতিটা পাতায় আছে। পর্যটক দশটা পাতা ঘুরলে Logo টা দশবার Server থেকে
                আনার কোনো মানে নেই। একবার এনে রেখে দিলেই হয়। এই রেখে দেওয়ার জায়গার
                নাম Cache, আর কোন জিনিস কে কতক্ষণ রাখতে পারবে, সেটা Server ঠিক করে
                দেয় একটা Header দিয়ে, Cache-Control।
              </ContentParagraph>
              <ContentParagraph>
                Module 04 এ DNS এর Cache আর TTL দেখেছেন। HTTP এর Cache একই ভাবনা:
                একটা উত্তর জমা রাখা, আর একটা মেয়াদ পর্যন্ত তাকে বিশ্বাস করা। পার্থক্য হলো
                এখানে মেয়াদ শেষে সবটা আবার আনতে হয় না, ছোট্ট একটা প্রশ্ন করে যাচাই
                করে নেওয়া যায়। প্রথমে দেখি জমা থাকে কোথায় কোথায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CacheLayersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা শব্দ আগে পরিষ্কার করি। জমা রাখা একটা কপি <strong>Fresh</strong>{" "}
                বা তাজা, যতক্ষণ তার মেয়াদ আছে। তাজা কপি Browser কাউকে জিজ্ঞেস না
                করেই ব্যবহার করে, Request তারেই যায় না। মেয়াদ পার হলে কপিটা{" "}
                <strong>Stale</strong> বা বাসি। বাসি কপি সাথে সাথে ফেলে দেওয়া হয় না,
                বরং Server কে জিজ্ঞেস করা হয় এটা এখনো চলবে কি না। এই জিজ্ঞেস করার
                নাম <strong>Revalidation</strong>, পরের সেকশনের বিষয়। এবার
                Cache-Control এর শব্দগুলো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["শব্দ", "মানে", "কখন"],
          rows: [
            [mono("max-age=60"), "৬০ সেকেন্ড তাজা, যেকোনো Cache এর জন্য", "যে জিনিস একটু পুরনো হলেও চলে"],
            [mono("s-maxage=60"), "শুধু Shared Cache, মানে CDN এর জন্য মেয়াদ। থাকলে CDN max-age এর বদলে এটা মানে", "CDN বেশিক্ষণ রাখুক, Browser কম"],
            [mono("public"), "Shared Cache ও রাখতে পারবে", "সবার জন্য একই উত্তর, যেমন Tour এর তালিকা"],
            [mono("private"), "শুধু এই মানুষের Browser রাখতে পারবে, CDN নয়", "একজনের নিজের তথ্য"],
            [mono("no-cache"), "রাখা যাবে, কিন্তু প্রতিবার ব্যবহারের আগে যাচাই করতে হবে", "HTML পাতা, যা সবসময় সর্বশেষ হতে হবে"],
            [mono("no-store"), "কোথাও রাখাই যাবে না", "গোপন বা ক্ষণে ক্ষণে বদলানো তথ্য"],
            [mono("must-revalidate"), "বাসি হয়ে গেলে যাচাই ছাড়া কখনো ব্যবহার নয়", "পুরনো দেখানো ক্ষতিকর হলে"],
            [mono("immutable"), "মেয়াদের মধ্যে এটা কখনো বদলাবে না, Reload এও যাচাই লাগবে না", "নামে Hash থাকা ফাইল"],
            [mono("stale-while-revalidate=300"), "বাসি হওয়ার পরেও আরও ৩০০ সেকেন্ড পুরনোটা দেখানো চলবে, আর সেই ফাঁকে পেছনে নতুনটা আনা হবে", "দ্রুততা দরকার, একটু পুরনো চলে"],
            [mono("stale-if-error=86400"), "Server ভেঙে পড়লে এক দিন পর্যন্ত পুরনোটাই দেখানো চলবে", "Server বন্ধ থাকলেও পাতা খুলুক"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "no-cache মানে Cache করবেন না, নয়",
          content: (
            <p>
              নামটা বিভ্রান্ত করে, আর এই ভুলটা অভিজ্ঞ ডেভেলপাররাও করেন। no-cache
              মানে রেখে দিতে পারেন, কিন্তু ব্যবহারের আগে প্রতিবার যাচাই করুন। কিছুই
              রাখা যাবে না বোঝাতে চাইলে লিখতে হবে <code>no-store</code>। পর্যটকের
              বুকিং এর তালিকা বা Payment এর পাতা no-cache দিয়ে রক্ষা করা যায় না,
              সেগুলো no-store।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Cache-Control না থাকলে কী হয়?</strong> সেকশন ০০৪ এ example.com
                এর উত্তরে কোনো Cache-Control ছিল না, ছিল শুধু{" "}
                <code>last-modified</code>। এমন অবস্থায় HTTP এর Caching এর নিয়মপত্র
                RFC 9111 Cache কে নিজে একটা মেয়াদ আন্দাজ করার অনুমতি দেয়, যার নাম
                Heuristic Freshness। প্রচলিত হিসাব হলো, জিনিসটা শেষ বদলের পর যত সময়
                পার হয়েছে তার দশ ভাগের এক ভাগ। example.com এর পাতা সাত দিন আগে
                বদলেছিল, তাই একটা Browser এটাকে প্রায় ষোলো ঘণ্টা তাজা ধরে নিতে পারে।
                আপনি নিজের সাইটে একটা ফাইল বদলালেন, অথচ কেউ কেউ ঘণ্টার পর ঘণ্টা
                পুরনোটা দেখছে, আর আপনি কোথাও কোনো Cache Setting করেননি। কারণ এটাই।
                শিক্ষা: প্রতিটা Response এ নিজে স্পষ্ট করে Cache-Control বলুন, আন্দাজের
                উপর ছেড়ে দেবেন না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Expires আর Age।</strong> Cache-Control আসার আগে মেয়াদ বলা হতো{" "}
                <code>Expires</code> দিয়ে, একটা নির্দিষ্ট তারিখ আর সময়। এখনো দেখবেন,
                কিন্তু দুইটাই থাকলে Cache-Control এর max-age জেতে, আর নতুন Code এ
                Expires লেখার দরকার নেই। <code>Age</code> আসে মাঝের Cache থেকে, বলে
                জিনিসটা সেখানে কত সেকেন্ড ধরে আছে। example.com এর <code>age: 9337</code>{" "}
                এটাই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Browser নিজেও Cache-Control পাঠায়।</strong> Reload চাপলে
                Browser অন্তত পাতাটা নিজে যাচাই করে নেয়, আর Hard Reload, মানে
                Ctrl+Shift+R বা Mac এ Cmd+Shift+R, চাপলে Request এ{" "}
                <code>Cache-Control: no-cache</code> বসিয়ে জানায় যে জমা কপি থাকলেও
                তার নতুন করে যাচাই করা উত্তর চাই। এজন্য আপনি নিজের যন্ত্রে Hard Reload করে নতুনটা দেখছেন, অথচ
                পর্যটক পুরনোটা দেখছেন, কারণ তিনি Hard Reload করেন না। DevTools এর
                Network Tab এ Disable cache টিক দিলেও একই কাজ হয়, তবে শুধু DevTools
                খোলা থাকা পর্যন্ত।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কোন Method Cache হয়।</strong> লেসন ০৩ এ দেখেছেন GET আর HEAD
                Cacheable। বাস্তবে Browser আর CDN শুধু এই দুইটাই Cache করে। একটা
                POST এর উত্তর কেউ জমা রাখে না, তাই বুকিং এর Request কখনো Cache থেকে
                ফেরত আসবে না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ একই চারবার দেখা পাঁচটা আলাদা নিয়মে চালিয়ে দেখুন। প্রতিটা
                নিয়মের দাম আর লাভ সংখ্যায় দেখা যাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CacheTimelineLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "একজনের তথ্য কখনো public নয়",
          content: (
            <p>
              Cache এর সবচেয়ে ভয়ংকর ভুল হলো একজন মানুষের নিজের তথ্যকে public বলে
              ফেলা। ধরুন <code>/api/me</code> এর উত্তরে কেউ ভুল করে{" "}
              <code>public, max-age=300</code> দিল। প্রথম যে পর্যটক এলেন, CDN তাঁর
              নাম আর বুকিং এর তালিকা জমা রাখল। পরের পাঁচ মিনিট যে কেউ{" "}
              <code>/api/me</code> চাইলে CDN সেই প্রথম পর্যটকের তথ্যই দিয়ে দেবে।
              বাস্তবে বড় বড় সাইটে এই ভুল ঘটেছে। নিয়মটা সোজা: Login করা মানুষের নিজের
              কিছু হলে <code>private, no-store</code>। আর Lab এর চার নম্বর Server ঠিক
              এটাই করে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "validation",
      subHeader: { index: "008", title: "ETag and 304" },
      title: <SectionTitle>ETag, Last-Modified আর 304: বাসি কপি যাচাই, আর Cache Busting</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কপিটা বাসি হয়ে গেছে। এখন দুইটা উপায়: পুরোটা আবার আনা, অথবা Server কে
                জিজ্ঞেস করা, আমার কাছে যেটা আছে সেটা কি এখনো ঠিক? দ্বিতীয় উপায়টা
                সম্ভব হয় দুইটা Header দিয়ে, যাদের বলে Validator, মানে যাচাইয়ের চিহ্ন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ETag:</strong> Body এর একটা আঙুলের ছাপ, Server যেভাবে খুশি
                  বানায়। Body এর Hash নেওয়া সবচেয়ে প্রচলিত, যেমন Lab এর চার নম্বর
                  Server করে। মানটা সবসময় উদ্ধৃতি চিহ্নের ভেতরে, যেমন{" "}
                  <code>&quot;TLA3YHQRl1KfW0Q0&quot;</code>। সামনে <code>W/</code> থাকলে
                  সেটা Weak ETag, মানে অর্থে একই কিন্তু Byte এ হুবহু একই না ও হতে পারে।
                </ListItem>
                <ListItem>
                  <strong>Last-Modified:</strong> শেষ বদলের সময়। ETag এর চেয়ে দুর্বল,
                  কারণ এক সেকেন্ডের মধ্যে দুইবার বদলালে ধরা পড়ে না। দুইটাই থাকলে
                  ETag জেতে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                যাচাইয়ের সময় Browser ছাপটা ফেরত পাঠায়, ETag থাকলে{" "}
                <code>If-None-Match</code> এ, তারিখ থাকলে <code>If-Modified-Since</code>{" "}
                এ। Server মিলিয়ে দেখে। না বদলালে উত্তর{" "}
                <code>304 Not Modified</code>, কোনো Body ছাড়া, আর Browser নিজের কপিটা
                আবার তাজা ধরে নেয়। বদলালে পুরো <code>200</code>, নতুন Body আর নতুন
                ছাপ সহ। Lab এর আসল ফলাফলটা ছবিতে:
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <EtagRevalidationDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              একই জিনিস একটা আসল সাইটে। example.com এর পাতার ETag আর Last-Modified
              দিয়ে যাচাই, তারপর Range দিয়ে শুধু প্রথম 100 Byte চাওয়া। নিচের সবগুলো
              আসল ফলাফল। খেয়াল করুন ETag এর শেষের <code>241</code>: এটা Hex এ 577,
              মানে পাতার আকার। এই ধরনের ETag এ ফাইলের বদলের সময় আর আকার জুড়ে ছাপ
              বানানো হয়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "validate-example-com.sh",
          code: `# ETag দিয়ে যাচাই
curl -s -D - -o /dev/null -H 'If-None-Match: "6adc97d0-241"' https://example.com | head -1
HTTP/2 304

# তারিখ দিয়ে যাচাই
curl -sI -H "If-Modified-Since: Sat, 24 Oct 2026 11:34:40 GMT" https://example.com | head -1
HTTP/2 304

# পুরোটা নয়, প্রথম 100 Byte
curl -s -D - -o /dev/null -H "Range: bytes=0-99" https://example.com
HTTP/2 206
content-type: text/html; charset=utf-8
content-length: 100
etag: "6adc97d0-241"`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>304 Byte বাঁচায়, Round Trip নয়।</strong> যাচাই করতেও একবার
                  Server এ যেতে আসতে হয়। পর্যটক মালয়েশিয়ায় বসে থাকলে সেই যাওয়া আসার
                  সময়টা লাগবেই। তাই সবচেয়ে দ্রুত হলো তাজা কপি, যেখানে কোনো প্রশ্নই
                  নেই। 304 হলো দ্বিতীয় সেরা।
                </ListItem>
                <ListItem>
                  <strong>206 আর Range।</strong> Server <code>accept-ranges: bytes</code>{" "}
                  বললে একটা অংশ চাওয়া যায়। ভিডিও মাঝখান থেকে চালানো আর আধা নামানো
                  ফাইল বাকিটা নামানো, দুইটাই এভাবে হয়।
                </ListItem>
                <ListItem>
                  <strong>একই ETag, অন্য কাজ: If-Match আর 412।</strong> দুইজন Admin একই
                  বুকিং খুলে বসে আছেন। প্রথমজন অতিথির সংখ্যা বদলে সেভ করলেন। দ্বিতীয়জন
                  পুরনো পাতা থেকে তারিখ বদলে সেভ করলে প্রথমজনের বদলটা মুছে যাবে।
                  সমাধান: PATCH এর সাথে পাঠান <code>If-Match</code>, যে ETag দেখে পাতা
                  খোলা হয়েছিল সেটা। এর মধ্যে বুকিং বদলে গেলে ETag মিলবে না, Server দেবে{" "}
                  <code>412 Precondition Failed</code>, লেসন ০৩ এর সেই Code। এই কৌশলের
                  নাম Optimistic Concurrency।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>Cache Busting: এক বছর রাখুন, তবু Deploy এর দিনেই নতুনটা দিন।</strong>{" "}
                এখানে একটা দ্বন্দ্ব আছে। JavaScript আর CSS ফাইল লম্বা সময় রাখলে সাইট
                দ্রুত, কিন্তু Deploy এর পরে পুরনো ফাইল দেখায়। সমাধানটা চতুর: ফাইলের
                ভেতরটা বদলালে ফাইলের নামটাই বদলে দিন। নামের ভেতরে ফাইলের Hash বসান,
                যেমন <code>app.3f9a1c.js</code>। ভেতরটা বদলালে নাম হয়ে যায়{" "}
                <code>app.8b2e7d.js</code>, মানে একটা একদম নতুন URL, যেটা কোনো Cache এ
                নেই। পুরনো নামের ফাইল কেউ আর চায়ই না। তাই সেগুলো নিশ্চিন্তে এক বছর
                রাখতে দেওয়া যায়, <code>immutable</code> সহ।
              </ContentParagraph>
              <ContentParagraph>
                Next.js এটা নিজে থেকেই করে। <code>/_next/static</code> এর প্রতিটা
                ফাইলের নামে Hash থাকে, আর Next.js এর নথি অনুযায়ী সেগুলোর উপর সে
                নিজেই বসায় <code>public, max-age=31536000, immutable</code>, যেটা
                আপনি চাইলেও বদলাতে পারবেন না। একটা শর্ত: যে HTML পাতা এই নামগুলো ধরে
                রাখে, সেটাকে লম্বা সময় রাখা যাবে না। HTML পুরনো থাকলে সে পুরনো নামই
                চাইবে। তাই HTML হয় <code>no-cache</code>, ETag সহ, যাতে প্রতিবার ছোট্ট
                একটা যাচাই হয় আর Deploy এর সাথে সাথে নতুন নামগুলো পৌঁছায়।
              </ContentParagraph>
              <ContentParagraph>
                সব মিলিয়ে Island Tours এর নিয়মপত্র এরকম। প্রতিটা লাইনের কারণ এতক্ষণে
                আপনি নিজেই বলতে পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কী", "Cache-Control", "কেন"],
          rows: [
            [mono("/_next/static/..."), "public, max-age=31536000, immutable", "নামে Hash, Next.js নিজে বসায়"],
            [mono("/tours/saint-martin"), "no-cache, ETag সহ", "HTML, Deploy এর সাথে সাথে নতুন নাম পৌঁছাতে হবে"],
            [mono("/images/tours/..."), "public, max-age=604800", "ছবি বদলালে নতুন নামে Upload হয়, তাই সাত দিন নিরাপদ"],
            [mono("GET /api/tours?date=..."), "public, max-age=0, s-maxage=60, stale-while-revalidate=300", "সবার জন্য একই, এক মিনিট পুরনো চলে, CDN রাখে, Browser প্রতিবার যাচাই করে"],
            [mono("GET /api/tours/saint-martin/seats"), "no-store", "আসন প্রতি মুহূর্তে বদলায়, পুরনো সংখ্যা দেখানো মানে ভুল বুকিং"],
            [mono("GET /api/me"), "private, no-store", "একজন মানুষের নিজের তথ্য"],
            [mono("POST /api/bookings"), "no-store", "বুকিং এর উত্তর কোথাও জমা থাকবে না"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "same-origin",
      subHeader: { index: "009", title: "Same-Origin Policy" },
      title: <SectionTitle>Same-Origin Policy: CORS বোঝার আগে যে দেয়ালটা বুঝতে হয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                CORS Error নিয়ে প্রশ্ন Internet এ সম্ভবত সবচেয়ে বেশি। আর প্রায় সব
                বিভ্রান্তির কারণ একটাই: মানুষ CORS কে একটা দেয়াল ভাবে। আসলে দেয়ালটার
                নাম Same-Origin Policy, আর CORS হলো সেই দেয়ালে একটা দরজা। আগে দেয়ালটা
                বুঝি।
              </ContentParagraph>
              <ContentParagraph>
                লেসন ০১ এ Origin শিখেছেন: Scheme, Host আর Port, এই তিনটা মিলে একটা
                Origin। দুইটা URL এর তিনটাই হুবহু মিললে তবেই একই Origin।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SameOriginDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Same-Origin Policy বা SOP</strong> হলো Browser এর একটা নিয়ম:
                একটা পাতার JavaScript শুধু নিজের Origin এর উত্তর পড়তে পারে। অন্য
                Origin এ Request পাঠানো অনেক সময় যায়, কিন্তু উত্তরটা পড়া যায় না, যদি
                না সেই Origin অনুমতি দেয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>এই নিয়ম কেন?</strong> লেসন ০৫ এ দেখবেন, Browser একটা সাইটের
                Cookie সেই সাইটের প্রতিটা Request এ নিজে থেকে লাগিয়ে দেয়। এবার ভাবুন
                SOP নেই। পর্যটক Island Tours এ Login করা অবস্থায় অন্য একটা Tab এ{" "}
                <code>attacker.example</code> খুললেন। সেই পাতার JavaScript চুপচাপ{" "}
                <code>fetch(&quot;https://islandtours.example/api/me&quot;)</code>{" "}
                চালাল। Browser নিজে থেকে পর্যটকের Cookie লাগিয়ে দিল, Island Tours ভাবল
                পর্যটক নিজেই চাইছেন, আর তাঁর নাম, ফোন নম্বর, সব বুকিং চলে গেল অচেনা
                সাইটের হাতে। SOP ঠিক এই পড়াটা আটকায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>SOP কী আটকায় না।</strong> এটাই সবচেয়ে বেশি অবাক করে। অন্য
                Origin এর ছবি দেখানো (<code>{"<img>"}</code>), Script চালানো (
                <code>{"<script src>"}</code>), CSS নেওয়া, অন্য সাইটের Link এ যাওয়া,
                এমনকি অন্য সাইটে একটা Form Submit করা, এর সবই চলে। ওয়েব এভাবেই
                বানানো, একটা সাইট আরেকটার ছবি আর Script ব্যবহার করে। SOP আটকায়
                মূলত একটা জিনিস: JavaScript দিয়ে অন্য Origin এর উত্তরের ভেতরটা পড়া।
                আর Form Submit আটকায় না বলেই লেসন ০৫ এ CSRF নামের আরেকটা বিপদ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের যন্ত্রে প্রথম CORS Error টা প্রায় সবসময় এখান থেকে",
          content: (
            <p>
              Frontend চলছে <code>http://localhost:5173</code> এ, API চলছে{" "}
              <code>http://localhost:3000</code> এ। নাম একই, localhost, তাই মনে হয়
              একই জায়গা। কিন্তু Port আলাদা, তাই Origin আলাদা, আর প্রথম fetch টাই লাল
              Error দেয়। একই কারণে <code>localhost</code> আর <code>127.0.0.1</code>{" "}
              ও দুইটা আলাদা Origin, যদিও দুইটা একই যন্ত্র। Lab এর পাঁচ নম্বর পরীক্ষায়
              ঠিক এটা নিজের চোখে দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "cors",
      subHeader: { index: "010", title: "CORS" },
      title: <SectionTitle>CORS: Server যখন বলে, এই Origin কে পড়তে দিন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর নিজের পাতা নিজের API ডাকে, একই Origin, কোনো সমস্যা
                নেই। কিন্তু Blog চলে <code>https://blog.islandtours.example</code> এ,
                Admin প্যানেল <code>https://admin.islandtours.example</code> এ, আর
                Partner সাইট <code>https://seagulltours.example</code> নিজের পাতায়
                Island Tours এর দাম দেখাতে চায়। এরা সবাই আলাদা Origin, আর এদের পড়তে
                দিতে হবে। এর জন্য আছে <strong>CORS</strong>, Cross-Origin Resource
                Sharing: Server কয়েকটা Response Header দিয়ে Browser কে জানায়, এই
                Origin এর JavaScript আমার উত্তর পড়তে পারবে।
              </ContentParagraph>
              <ContentParagraph>
                CORS দুই রকম Request কে দুইভাবে সামলায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Simple Request।</strong> Method GET, HEAD বা POST, আর বাড়তি
                  কোনো Header নেই, আর POST হলে Body এর Content-Type তিনটার একটা:{" "}
                  <code>application/x-www-form-urlencoded</code>,{" "}
                  <code>multipart/form-data</code> বা <code>text/plain</code>। এগুলো
                  এমন Request, যা একটা সাধারণ HTML Form ও পাঠাতে পারত, তাই Browser
                  এগুলো সোজা পাঠিয়ে দেয়, সাথে একটা <code>Origin</code> Header। উত্তর
                  এলে দেখে তাতে <code>Access-Control-Allow-Origin</code> আছে কি না আর
                  সেটা এই পাতার Origin এর সাথে মেলে কি না। মিললে JavaScript উত্তর পায়,
                  না মিললে পায় না।
                </ListItem>
                <ListItem>
                  <strong>Preflighted Request।</strong> বাকি সব। PUT, PATCH বা DELETE,
                  JSON এর Content-Type, <code>Authorization</code> বা নিজের বানানো কোনো
                  Header। এমন Request একটা সাধারণ Form কখনো পাঠাতে পারত না, তাই পুরনো
                  Server গুলো এর জন্য তৈরি নয়। এজন্য Browser আসল Request এর আগে নিজে
                  থেকে একটা <code>OPTIONS</code> Request পাঠিয়ে অনুমতি চায়। এর নাম
                  Preflight। Server হ্যাঁ বললে তবেই আসল Request যায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CorsPreflightDiagram /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Header", "কোন দিকে", "কাজ"],
          rows: [
            [mono("Origin"), "Request", "কোন Origin এর পাতা পাঠাচ্ছে। Browser নিজে বসায়"],
            [mono("Access-Control-Request-Method"), "Preflight Request", "আসল Request এর Method কী হবে"],
            [mono("Access-Control-Request-Headers"), "Preflight Request", "আসল Request এ কোন বাড়তি Header থাকবে"],
            [mono("Access-Control-Allow-Origin"), "Response", "কোন একটা Origin পড়তে পারবে, অথবা * মানে যে কেউ"],
            [mono("Access-Control-Allow-Methods"), "Preflight Response", "কোন কোন Method চলবে"],
            [mono("Access-Control-Allow-Headers"), "Preflight Response", "কোন কোন বাড়তি Header চলবে"],
            [mono("Access-Control-Allow-Credentials"), "Response", "true হলে Cookie সহ Request এর উত্তর ও পড়তে দেওয়া"],
            [mono("Access-Control-Max-Age"), "Preflight Response", "Preflight এর উত্তর কত সেকেন্ড মনে রাখা যাবে"],
            [mono("Access-Control-Expose-Headers"), "Response", "JavaScript কে কোন বাড়তি Response Header পড়তে দেওয়া"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই তালিকার কয়েকটা নিয়ম না জানলে আটকে যাবেন, তাই আলাদা করে বলছি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Allow-Origin এ একটাই Origin।</strong> কমা দিয়ে কয়েকটা Origin
                  লেখা যায় না। কয়েকটা Origin কে অনুমতি দিতে চাইলে Server একটা তালিকা
                  রাখে, Request এর Origin সেই তালিকায় আছে কি না দেখে, থাকলে সেই
                  Origin টাই ফেরত লেখে। তখন উত্তর Origin এর উপর নির্ভর করে, তাই সাথে{" "}
                  <code>Vary: Origin</code> দিতে হয়, নাহলে CDN একজনের জন্য বানানো
                  উত্তর আরেক Origin কে দিয়ে দেবে। Lab এর পাঁচ নম্বর API ঠিক এটা করে, আর
                  তালিকাটা পড়ে একটা Environment Variable থেকে।
                </ListItem>
                <ListItem>
                  <strong>Cookie সহ হলে নিয়ম কড়া।</strong> JavaScript যখন{" "}
                  <code>credentials: &quot;include&quot;</code> দিয়ে Cookie সহ Request
                  পাঠায়, তখন উত্তরে লাগবে <code>Access-Control-Allow-Credentials: true</code>,
                  আর Allow-Origin এ <code>*</code> চলবে না, হুবহু Origin টা লিখতে হবে।
                  কারণটা যৌক্তিক: যে কেউ পড়তে পারবে আর Cookie সহ পড়তে পারবে, দুইটা
                  একসাথে মানে SOP পুরো তুলে দেওয়া।
                </ListItem>
                <ListItem>
                  <strong>Preflight এর উত্তর মনে রাখা যায়।</strong> প্রতিটা PATCH এর
                  আগে একটা বাড়তি OPTIONS মানে দ্বিগুণ Round Trip।{" "}
                  <code>Access-Control-Max-Age: 600</code> দিলে Browser দশ মিনিট আর
                  জিজ্ঞেস করে না। Browser নিজের একটা সর্বোচ্চ সীমা রাখে, Chrome দুই
                  ঘণ্টার বেশি মানে না।
                </ListItem>
                <ListItem>
                  <strong>JavaScript সব Response Header পড়তে পারে না।</strong>{" "}
                  অন্য Origin এর উত্তর থেকে JavaScript নিজে থেকে পড়তে পারে শুধু কয়েকটা
                  সাধারণ Header, যেমন Content-Type, Content-Length, Cache-Control।
                  Admin প্যানেল যদি নতুন বুকিং এর <code>Location</code> বা{" "}
                  <code>X-Request-Id</code> পড়তে চায়, Server কে বলতে হবে{" "}
                  <code>Access-Control-Expose-Headers: Location, X-Request-Id</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার নিজে চালিয়ে দেখুন। নিচের Lab টা ঠিক Browser এর মতো করে সিদ্ধান্ত
                নেয়, আর শেষে যে Console Error দেখায় সেগুলো Chrome এর আসল লেখা, Lab এর
                পাঁচ নম্বর পরীক্ষা চালিয়ে মিলিয়ে নেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CorsCheckLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Browser ছাড়াও CORS এর কথাবার্তা দেখা যায়। curl এ Origin Header বসিয়ে
              Browser এর ভান করলে Server ঠিক যা Browser কে বলত সেটাই বলে। নিচে Lab এর
              API কে একটা Preflight পাঠানো হয়েছে, আসল ফলাফল।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "fake-preflight.sh",
          code: `curl -s -D - -X OPTIONS \\
  -H "Origin: http://localhost:47645" \\
  -H "Access-Control-Request-Method: PATCH" \\
  -H "Access-Control-Request-Headers: content-type" \\
  http://localhost:47646/api/bookings/bk_7Q2M9X

HTTP/1.1 204 No Content
Vary: Origin
Access-Control-Allow-Origin: http://localhost:47645
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 600`,
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "cors-errors",
      subHeader: { index: "011", title: "CORS Errors" },
      title: <SectionTitle>CORS Error পড়া আর সারানো, আর CORS যা নয়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সারানোর আগে সবচেয়ে জরুরি সত্যটা। Lab এর পাঁচ নম্বর পরীক্ষায় curl দিয়ে
                নিজেকে <code>https://attacker.example</code> বলে পরিচয় দিয়ে Tour এর
                তালিকা চাওয়া হয়েছিল। Server কোনো Allow-Origin দেয়নি, তবু পুরো তালিকা
                এসে Terminal এ ছাপা হয়েছিল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CorsWhoEnforcesSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর থেকে তিনটা শিক্ষা, আর তিনটাই Production এ কাজে লাগে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>CORS Server এর তালা নয়।</strong> যে তথ্য সবার দেখার কথা
                  নয়, সেটা CORS দিয়ে লুকানো যায় না। সেটা লুকায় Authentication, লেসন
                  ০৬ এ।
                </ListItem>
                <ListItem>
                  <strong>Simple Request আটকালেও Server কাজটা করে ফেলেছে।</strong> Lab
                  এর পাঁচ নম্বর পরীক্ষায় <code>127.0.0.1</code> থেকে খোলা পাতার GET টা
                  আটকে গিয়েছিল, কিন্তু API এর Terminal এ সেটা পৌঁছানোর লাইন ছিল। শুধু
                  উত্তরটা JavaScript পায়নি। তাই যে POST কিছু বদলায়, সেটা CORS এর ভরসায়
                  রাখা যায় না, লেসন ০৫ এর CSRF সেখান থেকেই আসে।
                </ListItem>
                <ListItem>
                  <strong>JavaScript এর কাছে CORS Error দেখতে প্রায় কিছুই না।</strong>{" "}
                  আটকে গেলে fetch এর হাতে আসে শুধু{" "}
                  <code>TypeError: Failed to fetch</code>, কোনো Status Code নয়, কোনো
                  কারণ নয়। আসল কারণ লেখা থাকে শুধু Console এ, আর বিস্তারিত Network Tab
                  এ। তাই CORS এর সমস্যা ধরতে Code এ নয়, DevTools এ তাকান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচের ছকে Chrome এর Console এ সবচেয়ে বেশি দেখা লেখাগুলো, প্রতিটার আসল
                কারণ আর সমাধান সহ। প্রথম দুইটা আর পঞ্চমটা Lab এ আসল Chrome চালিয়ে
                নেওয়া, বাকিগুলো একই ছাঁচের।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Console এ যা লেখা (মূল অংশ)", "আসল কারণ", "সমাধান"],
          rows: [
            [
              mono("No 'Access-Control-Allow-Origin' header is present on the requested resource."),
              "Server CORS Header দেয়নি, অথবা Origin তালিকায় নেই। আরেকটা খুব চেনা কারণ: Server ভেঙে 500 দিয়েছে বা Proxy 502 দিয়েছে, আর সেই Error এর উত্তরে CORS Header ছিল না",
              "Network Tab এ আগে Status দেখুন। CORS Header বসান এমন জায়গায় যা Error এর উত্তরেও চলে",
            ],
            [
              mono("Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header ..."),
              "OPTIONS এর উত্তরে Allow-Origin নেই",
              "OPTIONS এর জন্য আলাদা করে উত্তর দিন, তালিকা মিলিয়ে",
            ],
            [
              mono("Response to preflight request doesn't pass access control check: It does not have HTTP ok status."),
              "OPTIONS এ 401, 404 বা 405 এসেছে। প্রায়ই কারণ Login যাচাইয়ের Code টা OPTIONS কেও আটকাচ্ছে, অথচ Preflight কখনো Cookie বা Token পাঠায় না",
              "OPTIONS কে Login যাচাইয়ের আগেই 204 দিয়ে উত্তর দিন",
            ],
            [
              mono("Redirect is not allowed for a preflight request."),
              "URL টা অন্য কোথাও পাঠিয়ে দিচ্ছে: http থেকে https, www যোগ, বা শেষে একটা স্ল্যাশ",
              "শেষ ঠিকানাটাই সরাসরি ডাকুন",
            ],
            [
              mono("The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'."),
              "Cookie সহ Request, আর Server * দিয়েছে",
              "তালিকা মিলিয়ে হুবহু Origin ফেরত দিন, সাথে Allow-Credentials: true আর Vary: Origin",
            ],
            [
              mono("Request header field authorization is not allowed by Access-Control-Allow-Headers in preflight response."),
              "Authorization পাঠানো হচ্ছে, অনুমতির তালিকায় নেই",
              "Allow-Headers এ Authorization যোগ করুন",
            ],
            [
              mono("Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response."),
              "Method টা অনুমতির তালিকায় নেই",
              "Allow-Methods এ যোগ করুন",
            ],
            [
              mono("The 'Access-Control-Allow-Origin' header contains multiple values ..., but only one is allowed."),
              "Caddy আর App দুইজনই Header টা বসাচ্ছে",
              "এক জায়গায় রাখুন, Island Tours এ App এ",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "তিনটা ভুল সমাধান, যেগুলো Internet এ খুব চলে",
          content: (
            <div className="space-y-3">
              <p>
                <strong>এক, fetch এ mode: &quot;no-cors&quot;।</strong> Error চলে যায়,
                কিন্তু উত্তরটা হয়ে যায় Opaque, মানে বন্ধ একটা বাক্স, JavaScript এর
                ভেতরটা পড়তেই পারে না। সমস্যা লুকানো হলো, সারানো হলো না।
              </p>
              <p>
                <strong>দুই, CORS বন্ধ করার Browser Extension।</strong> শুধু আপনার
                যন্ত্রে চলে। পর্যটকের Browser এ সেই Extension নেই।
              </p>
              <p>
                <strong>তিন, যে Origin ই আসুক সেটা ফেরত লিখে দেওয়া, Credentials সহ।</strong>{" "}
                দেখতে তালিকার মতো, কিন্তু তালিকায় কিছু মেলানোই হচ্ছে না। এতে{" "}
                <code>attacker.example</code> ও পর্যটকের Cookie সহ তাঁর তথ্য পড়তে
                পারে, মানে SOP পুরোটাই নেই। Origin সবসময় একটা নির্দিষ্ট তালিকার সাথে
                মেলাবেন, আর সেই তালিকা আসবে Environment Variable থেকে।
              </p>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Development এ CORS এড়ানোর ভদ্র উপায়",
          content: (
            <p>
              নিজের যন্ত্রে Frontend আর API আলাদা Port এ থাকলে Frontend এর Dev Server
              কে বলুন <code>/api</code> এর Request গুলো পেছনে API এর কাছে পাঠিয়ে দিতে।
              Vite এ এর নাম Proxy, Next.js এ Rewrites। তখন Browser এর চোখে পাতা আর API
              একই Origin, CORS এর প্রশ্নই নেই। Production এ Island Tours ঠিক এটাই
              করে, পাতা আর <code>/api</code> দুইটাই একই Origin এ, Caddy এর পেছনে। CORS
              লাগে শুধু Blog, Admin আর Partner এর জন্য।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "security-headers",
      subHeader: { index: "012", title: "Security Headers" },
      title: <SectionTitle>নিরাপত্তার Header: কয়েকটা লাইন, অনেকগুলো আক্রমণ বন্ধ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কিছু Header কোনো তথ্য দেয় না, Browser কে নিয়ম দেয়: এই সাইটে এটা করবেন
              না, ওটা করতে দেবেন না। Browser সেই নিয়ম মানে বলে এক লাইনেই কয়েক ধরনের
              আক্রমণ বন্ধ হয়ে যায়। Island Tours এর প্রতিটা উত্তরে এগুলো বসায় Caddy।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Header", "Island Tours এর মান", "কী থেকে রক্ষা"],
          rows: [
            [mono("Strict-Transport-Security"), "max-age=31536000; includeSubDomains", "কেউ যেন পর্যটককে https ছাড়া পাতায় নিতে না পারে। পুরো গল্প লেসন ০৭ এ"],
            [mono("Content-Security-Policy"), "default-src 'self'; img-src 'self' data:; frame-ancestors 'none'", "অন্য কোথাও থেকে Script ঢুকিয়ে চালানো, আর অন্য সাইটে লুকিয়ে বসানো"],
            [mono("X-Content-Type-Options"), "nosniff", "MIME Sniffing, সেকশন ০০৫"],
            [mono("Referrer-Policy"), "strict-origin-when-cross-origin", "অন্য সাইটে পুরো URL চলে যাওয়া"],
            [mono("Permissions-Policy"), "camera=(), microphone=(), geolocation=()", "পাতার কোনো Script যেন ক্যামেরা, মাইক বা অবস্থান চাইতে না পারে"],
            [mono("X-Frame-Options"), "DENY", "পুরনো Browser এর জন্য, frame-ancestors এর পুরনো রূপ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Content-Security-Policy বা CSP</strong> সবচেয়ে শক্তিশালী, আর
                সবচেয়ে সাবধানে বসাতে হয়। এটা একটা তালিকা: এই পাতা কোথা থেকে Script
                নিতে পারবে, কোথা থেকে ছবি, কোথা থেকে CSS। <code>default-src &apos;self&apos;</code>{" "}
                মানে সবকিছু শুধু নিজের Origin থেকে। কেউ যদি পর্যটকের রিভিউ এর ঘরে একটা{" "}
                <code>{"<script>"}</code> ঢুকিয়ে দিতে পারে, যে আক্রমণের নাম XSS, তবু
                Browser সেটা চালাবে না, কারণ সেটা অনুমোদিত কোনো জায়গা থেকে আসেনি। কিন্তু
                তালিকায় কিছু বাদ পড়লে সাইটের নিজের জিনিসও ভেঙে যায়, যেমন একটা Analytics
                এর Script। তাই প্রথমে বসান{" "}
                <code>Content-Security-Policy-Report-Only</code>, যা কিছু আটকায় না, শুধু
                Console এ জানায় কী আটকাত। কয়েকদিন দেখে তালিকা ঠিক করে তারপর আসলটা।
                Next.js এর নথিতে CSP বসানোর আলাদা একটা পাতা আছে, Best Resources এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>frame-ancestors, আর Clickjacking।</strong> একটা অচেনা সাইট
                Island Tours এর Payment পাতা নিজের পাতার ভেতরে একটা অদৃশ্য{" "}
                <code>{"<iframe>"}</code> এ বসিয়ে উপরে একটা নকল বোতাম রাখতে পারে।
                পর্যটক ভাবেন একটা খেলার বোতাম চাপছেন, আসলে চাপছেন নিচের Pay বোতাম। এর
                নাম Clickjacking। <code>frame-ancestors &apos;none&apos;</code> বলে এই পাতা
                কেউ নিজের ভেতরে বসাতে পারবে না। একটা ব্যতিক্রম আছে: Partner সাইট
                seagulltours.example এ Island Tours এর বুকিং Widget বসানো, সেটা{" "}
                <code>/widget</code> এর নিচে। শুধু সেই Path এ Island Tours দেয়{" "}
                <code>frame-ancestors https://seagulltours.example</code>, বাকি সব
                পাতায় none। পুরনো <code>X-Frame-Options</code> একই কাজ করত, কিন্তু
                নির্দিষ্ট একটা সাইটকে অনুমতি দিতে পারে না। Next.js এর নথিও বলে এর জায়গা
                নিয়েছে CSP এর frame-ancestors।
              </ContentParagraph>
              <ContentParagraph>
                <strong>যা বলার দরকার নেই, তা বলবেন না।</strong> Express এর উপর বানানো
                App, NestJS সহ, নিজে থেকে বসায় <code>X-Powered-By: Express</code>। এটা
                আক্রমণকারীকে বলে দেয় কোন Framework চলছে, কোন দুর্বলতা খুঁজতে হবে।
                Express এ <code>app.disable(&quot;x-powered-by&quot;)</code> দিয়ে বন্ধ
                করুন। Caddy নিজে বসায় <code>Server: Caddy</code>, সেটাও সেকশন ০১৪ এর
                Config এ মুছে দেওয়া হয়েছে। এটা মূল নিরাপত্তা নয়, শুধু অপ্রয়োজনীয়
                তথ্য না দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "proxy-headers",
      subHeader: { index: "013", title: "Proxy Headers" },
      title: <SectionTitle>X-Forwarded-For, X-Forwarded-Proto আর X-Request-Id: Proxy এর পেছনের সত্যি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এই লেসনের শুরুর তৃতীয় অভিযোগটা মনে করুন: Log এ প্রতিটা বুকিং এসেছে
              127.0.0.1 থেকে। কারণটা Island Tours এর গঠনে। পর্যটকের Connection শেষ হয়
              Caddy তে। Caddy তারপর নিজে App এর সাথে নতুন একটা Connection খোলে। তাই App
              এর দিক থেকে দেখলে কথা বলছে শুধু Caddy।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ForwardedHeadersDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentList>
                <ListItem>
                  <strong>X-Forwarded-For:</strong> আসল Client এর IP। মাঝে কয়েকটা
                  Proxy থাকলে প্রতিটা নিজের দেখা IP টা শেষে জুড়ে দেয়, যেমন{" "}
                  <code>203.0.113.25, 198.51.100.40</code>। বাঁ দিকেরটা যে দাবি করছে
                  সে Client, ডান দিকে ক্রমশ Proxy গুলো।
                </ListItem>
                <ListItem>
                  <strong>X-Forwarded-Proto:</strong> বাইরে Request টা http এ এসেছিল
                  নাকি https এ। Caddy আর App এর মাঝে সাধারণ http চলে, তাই App নিজে
                  থেকে ভাবে সব http। এই Header না পড়লে App এর বানানো Redirect URL
                  গুলো http দিয়ে শুরু হবে, আর লেসন ০৫ এ দেখবেন Secure Cookie বসানোতেও
                  গোলমাল হয়।
                </ListItem>
                <ListItem>
                  <strong>X-Forwarded-Host:</strong> বাইরে কোন নাম চাওয়া হয়েছিল। Caddy
                  এমনিতেই Host Header হুবহু পাঠায়, তাই এটা মূলত তখন লাগে যখন মাঝের
                  কেউ Host বদলে দেয়।
                </ListItem>
                <ListItem>
                  <strong>Forwarded:</strong> এই তিনটার মান্য একটা রূপ, RFC 7239 এ,
                  যেমন <code>Forwarded: for=203.0.113.25;proto=https;host=islandtours.example</code>।
                  ভালো, কিন্তু এখনো X-Forwarded গুলোই বেশি চলে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>এখানেই একটা বড় ফাঁদ।</strong> X-Forwarded-For একটা সাধারণ
                Header, যে কেউ পাঠাতে পারে। App যদি চোখ বুজে এটা বিশ্বাস করে, একজন
                আক্রমণকারী প্রতিটা Request এ নিজেকে নতুন একটা IP বলে দাবি করবে, আর IP
                ধরে করা Rate Limit বা লগইনের চেষ্টা গোনা অকেজো হয়ে যাবে। দুইটা নিয়মে এটা
                বন্ধ হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সামনের দরজা বাইরের দাবি মানে না।</strong> Caddy এর নথি
                  অনুযায়ী Caddy বাইরে থেকে আসা X-Forwarded Header গুলোর মান Default এ
                  উপেক্ষা করে, নিজে যা দেখেছে সেটাই লেখে। Caddy এর সামনে আরেকটা Proxy
                  থাকলে, যেমন Cloudflare, তখন তাদের IP এর তালিকা{" "}
                  <code>trusted_proxies</code> এ দিতে হয়, তবেই Caddy তাদের পাঠানো মান
                  বিশ্বাস করে। আর তখন Module 04 এর <code>CF-Connecting-IP</code> এর
                  কথা মনে রাখুন, Cloudflare আসল IP টা সেখানেও দেয়। Lab এর ছয় নম্বর
                  পরীক্ষায় curl দিয়ে <code>X-Forwarded-For: 198.51.100.7</code>{" "}
                  পাঠানো হয়েছিল, Proxy সেটা ফেলে দিয়ে নিজের দেখা IP লিখেছে।
                </ListItem>
                <ListItem>
                  <strong>App শুধু চেনা Proxy কে বিশ্বাস করে।</strong> Island Tours এর
                  App এই Header পড়ে কেবল তখন, যখন Socket এর অন্য পাশে 127.0.0.1, মানে
                  Caddy। Express এ এর নাম <code>trust proxy</code> Setting। কেউ যদি
                  কোনোভাবে Caddy কে পাশ কাটিয়ে সরাসরি Port 3000 এ পৌঁছায়, তার পাঠানো
                  X-Forwarded-For App বিশ্বাস করে না। আর Module 05 এ দেখেছেন, App
                  127.0.0.1 এ বসে থাকে বলে বাইরে থেকে Port 3000 এ পৌঁছানোই যায় না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                <strong>X-Request-Id, একটা Request এর নাম।</strong> একজন পর্যটক লিখলেন,
                বুকিং করতে গিয়ে Error দেখেছি। দিনে কয়েক লাখ Log লাইনের মধ্যে তাঁর
                Request টা কোনটা? Island Tours এ প্রতিটা Request ঢোকার সময় App একটা
                নম্বর দেয়, যদি আগে থেকে না থাকে: একটা UUID, যেমন{" "}
                <code>7363fa00-c570-4484-9701-1b8c99bc1651</code>। সেই নম্বর লেখা হয়
                প্রতিটা Log লাইনে, পাঠানো হয় Database আর Payment এর ডাকের সাথে, ফেরত
                যায় Response এর <code>X-Request-Id</code> Header এ, আর Error পাতায়
                ছোট করে লেখা থাকে, এই নম্বরটা আমাদের জানান। পর্যটক নম্বরটা পাঠালে
                এক খোঁজেই পুরো গল্প বেরিয়ে আসে। বাইরে থেকে নম্বর এলে App আগে দেখে নেয়
                সেটা UUID এর চেহারার কি না, নাহলে নতুন একটা বানায়, যাতে কেউ Log এ
                আজেবাজে লেখা ঢোকাতে না পারে। পরে Observability এর Module এ এর বড় ভাই{" "}
                <code>traceparent</code> দেখবেন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "set-and-verify",
      subHeader: { index: "014", title: "Setting Headers" },
      title: <SectionTitle>নিজে বসান, নিজে যাচাই করুন: Node, Next.js আর Caddy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Header তিন জায়গায় বসানো যায়, আর কোনটা কোথায় বসবে সেটা আগে ঠিক না করলে
              একই Header দুইবার বসে, অথবা কোথাও বসে না। প্রথমে নিচের স্তরটা, খালি Node।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "node-headers.mjs",
          code: `// চালান:  LAB_PORT=47649 node node-headers.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8"); // বসানো বা বদলানো
    res.setHeader("Cache-Control", "private, no-store");
    res.appendHeader("Vary", "Origin");                                // আগেরটা রেখে যোগ করা
    res.appendHeader("Vary", "Accept-Encoding");
    res.removeHeader("X-Powered-By");                                  // থাকলে মুছে ফেলা
    console.log("Cache-Control is", res.getHeader("cache-control"));   // নাম ছোট হাতেও চলে

    res.end(JSON.stringify({ id: "usr_42" }));

    // Body পাঠানো শুরু হওয়ার পরে আর Header বসানো যায় না:
    try {
      res.setHeader("X-Too-Late", "1");
    } catch (err) {
      console.log(err.code); // ERR_HTTP_HEADERS_SENT
    }
  })
  .listen(port, "127.0.0.1");

// curl -s -D - http://localhost:47649/
//   HTTP/1.1 200 OK
//   Content-Type: application/json; charset=utf-8
//   Cache-Control: private, no-store
//   Vary: Origin
//   Vary: Accept-Encoding           (দুই লাইন, অর্থে "Origin, Accept-Encoding" এর সমান)
//
// Server এর Terminal এ:
//   Cache-Control is private, no-store
//   ERR_HTTP_HEADERS_SENT`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষের <code>ERR_HTTP_HEADERS_SENT</code> টা খুব চেনা হয়ে যাবে। Express
                এ এটা আসে <code>Cannot set headers after they are sent to the client</code>{" "}
                বার্তা নিয়ে। কারণ সবসময় এক: Header আগে যায়, Body পরে। Body এর প্রথম
                Byte তারে চলে গেলে Header এর অংশ শেষ, আর ফেরত আনা যায় না। Code এ প্রায়
                সবসময় এর মানে একটা Request এ দুইবার উত্তর দেওয়ার চেষ্টা, যেমন একটা{" "}
                <code>return</code> ভুলে যাওয়ায় Error এর উত্তর দেওয়ার পরেও Code নিচে
                নেমে আবার উত্তর দিচ্ছে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Next.js এ।</strong> পাতা আর ফাইলের জন্য Header বসানোর জায়গা{" "}
                <code>next.config.ts</code> এর <code>headers()</code>। এই প্রকল্পের
                Next.js এর নিজের নথি থেকে মিলিয়ে নেওয়া চেহারাটা এরকম: প্রতিটা নিয়মে
                একটা <code>source</code>, মানে কোন Path, আর একটা Header এর তালিকা।
                একই Path এ দুইটা নিয়ম একই Header বসালে শেষেরটা জেতে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "next.config.ts",
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // সব পাতা
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // শুধু Partner এর Widget, এটা seagulltours.example নিজের পাতায় বসাতে পারবে
        source: "/widget/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors https://seagulltours.example" },
        ],
      },
    ];
  },
};

export default nextConfig;

// মনে রাখুন: /_next/static এর Cache-Control এখানে বদলানো যায় না,
// Next.js নিজে public, max-age=31536000, immutable বসায়।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>Caddy তে।</strong> সামনের দরজায় বসানো Header সব পাতায় একসাথে লাগে,
              App এর Code না ছুঁয়েই। নিচের Config টা Caddy এর নথির{" "}
              <code>header</code>, <code>encode</code> আর <code>reverse_proxy</code>{" "}
              Directive মিলিয়ে লেখা একটা নমুনা। এই যন্ত্রে Caddy চালিয়ে পরীক্ষা করা হয়নি,
              তাই নিজের Server এ বসানোর পরে নিচের curl দিয়ে যাচাই করে নেবেন। Header এর
              নামের আগে চিহ্নগুলোর মানে: কিছু না থাকলে Caddy Header টা বসায় বা
              বদলায়, <code>+</code> থাকলে আগেরটা রেখে যোগ করে, <code>-</code> থাকলে
              মুছে ফেলে, আর <code>?</code> থাকলে আগে না থাকলে তবেই বসায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile (নমুনা)",
          code: `islandtours.example {
	# zstd আর gzip, Browser যেটা বোঝে, তালিকার আগেরটা আগে
	encode zstd gzip

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options nosniff
		Referrer-Policy strict-origin-when-cross-origin
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
		# App নিজে কিছু না বললে তবেই এই CSP
		?Content-Security-Policy "default-src 'self'; img-src 'self' data:; frame-ancestors 'none'"
		# Caddy যেন নিজের নাম না বলে
		-Server
	}

	# Caddy নিজে থেকেই X-Forwarded-For, X-Forwarded-Proto আর
	# X-Forwarded-Host বসায়, আর বাইরে থেকে আসা মানগুলো উপেক্ষা করে
	reverse_proxy 127.0.0.1:3000
}

www.islandtours.example {
	redir https://islandtours.example{uri} permanent
}`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["কোন Header", "কে বসায়", "কেন সেখানে"],
          rows: [
            ["নিরাপত্তার Header, Compression", "Caddy", "সব পাতায় একই, App বদলালেও হারায় না"],
            ["Content-Type, ETag, Cache-Control", "App", "প্রতিটা Route এর জন্য আলাদা, শুধু App জানে উত্তরটা কী"],
            ["CORS এর Header", "App, শুধু /api এ", "কোন Origin অনুমোদিত সেটা App এর Config, আর দুই জায়গায় বসালে Header দুইবার আসে"],
            ["X-Forwarded-*", "Caddy", "শুধু সামনের দরজা আসল Client কে দেখে"],
            ["X-Request-Id", "App", "App এর Log এ লাগে, না থাকলে App নিজে বানায়"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>যাচাই।</strong> Header বসানো শেষ হলো তখনই, যখন তারের উপর সেটা
              দেখা গেল। নিচের ছোট Loop টা আপনার নিজের সাইটের কয়েকটা Path থেকে শুধু
              দরকারি Header গুলো তুলে আনে। নিজের Domain বসিয়ে চালাবেন। উদাহরণ হিসেবে
              example.com এ চালানোর আসল ফলাফল নিচে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "check-headers.sh",
          code: `# SITE এ নিজের সাইটের ঠিকানা দিন
export SITE="https://example.com"

# Loop এর নাম path নয়, p। zsh এ path নামটা PATH এর সাথে বাঁধা,
# সেটা বদলালে পরের লাইনে curl ই আর খুঁজে পাওয়া যায় না।
for p in / /no-such-page; do
  echo "== $p"
  curl -sI "$SITE$p" | grep -iE '^(HTTP/|content-type|cache-control|etag|last-modified|strict-transport-security|x-content-type-options)'
done

# example.com এর আসল ফলাফল:
== /
HTTP/2 200
content-type: text/html; charset=utf-8
last-modified: Sat, 24 Oct 2026 11:34:40 GMT
== /no-such-page
HTTP/2 404
content-type: text/html; charset=utf-8

# Cache-Control আর নিরাপত্তার Header কোথাও নেই, সেটাও একটা তথ্য।
# আর Error পাতাটাও দেখুন: 404 এর উত্তরেও Header ঠিক থাকা চাই।`,
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, তিনটা অভিযোগ আর তিনটা লাইন</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর তিনটা অভিযোগে ফিরে যাই। প্রতিটায় দল কীভাবে খুঁজেছে, কী
                পেয়েছে, আর কী বদলেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Deploy এর পরেও পুরনো দাম।</strong> দল একজন ভুক্তভোগী পর্যটকের
                  ফোনে পাতাটা খুলিয়ে Network Tab দেখল। পাতার HTML এর Size কলামে লেখা
                  disk cache, মানে Request তারেই যায়নি। Response Header এ ছিল{" "}
                  <code>Cache-Control: public, max-age=86400</code>, কেউ একবার পাতা
                  দ্রুত করার জন্য বসিয়েছিলেন। Lab এর এক দিনের নিয়মটার মতো, Deploy এর
                  পরেও পর্যটকের Browser কাউকে জিজ্ঞেস করছিল না। সমাধান: HTML পাতায়{" "}
                  <code>no-cache</code>, ETag সহ, আর <code>/_next/static</code> যেমন
                  ছিল তেমন এক বছর, কারণ তাদের নাম Deploy এ বদলায়। যাঁদের ফোনে পুরনো
                  কপি এক দিনের জন্য জমা ছিল, তাঁদের জন্য কিছু করার ছিল না, মেয়াদ শেষ
                  হওয়ার অপেক্ষা ছাড়া। Cache এর ভুল সারানো যায়, কিন্তু যা আগেই অন্যের
                  যন্ত্রে জমা হয়ে গেছে তা ফেরত আনা যায় না।
                </ListItem>
                <ListItem>
                  <strong>Blog এর দামের বাক্স ফাঁকা।</strong> Console এ লেখা ছিল{" "}
                  <code>No &apos;Access-Control-Allow-Origin&apos; header is present</code>।
                  দল curl দিয়ে Blog এর Origin বসিয়ে API কে ডাকল, উত্তরে সত্যিই
                  Allow-Origin নেই। App এর অনুমোদিত তালিকা আসে{" "}
                  <code>CORS_ALLOWED_ORIGINS</code> নামের Environment Variable থেকে,
                  আর সেখানে লেখা ছিল <code>http://blog.islandtours.example</code>।
                  সেই সপ্তাহেই Blog http থেকে https এ গেছে। Host আর Port একই, শুধু
                  Scheme আলাদা, আর সেকশন ০০৯ এর ছবি অনুযায়ী সেটাই আলাদা Origin।
                  সমাধান: তালিকায় <code>https://blog.islandtours.example</code>, Code
                  এ একটা লাইন ও না বদলে, শুধু Config বদলে।
                </ListItem>
                <ListItem>
                  <strong>সব বুকিং 127.0.0.1 থেকে।</strong> App Log এ লিখছিল Socket এর
                  ঠিকানা, যেটা সবসময় Caddy। এর একটা লুকানো ক্ষতিও ছিল: লগইনের ভুল
                  চেষ্টা IP ধরে গোনা হতো, তাই সারা দেশের সব পর্যটক মিলে একটাই IP, আর
                  একজনের পাঁচটা ভুল চেষ্টায় সবার লগইন আটকে যেত। সমাধান: App এ{" "}
                  <code>trust proxy</code> শুধু 127.0.0.1 এর জন্য, Log এ Client এর IP
                  আসে X-Forwarded-For থেকে, আর প্রতিটা লাইনে X-Request-Id।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এর পাশাপাশি দল আরও তিনটা জিনিস ঠিক করেছে, যাতে এই ধরনের সমস্যা আর না
                আসে। Caddy তে নিরাপত্তার Header আর Compression, সেকশন ০১৪ এর মতো। App এ{" "}
                <code>X-Powered-By</code> বন্ধ। আর প্রতিটা Deploy এর পরে একটা ছোট Script
                চলে, যেটা পাঁচটা গুরুত্বপূর্ণ Path এর Cache-Control আর নিরাপত্তার Header
                পড়ে প্রত্যাশিত মানের সাথে মেলায়, না মিললে দলকে জানায়। Header একবার ঠিক
                করে ভুলে যাওয়ার জিনিস নয়, কারণ কেউ একজন একদিন পাতা দ্রুত করতে গিয়ে আবার
                একটা max-age বসিয়ে দেবেন।
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
      title: <SectionTitle>Tour পাতার একটা Request, Header এর চোখে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক আগেও একবার সেন্ট মার্টিনের পাতা দেখেছেন। আজ আবার খুললেন{" "}
              <code>https://islandtours.example/tours/saint-martin</code>। শুধু Header
              এর দিক থেকে কী কী ঘটে, শুরু থেকে শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "Browser Request এর Header সাজায়",
              description:
                "Host: islandtours.example, Accept এ HTML সবার আগে, Accept-Encoding: gzip, deflate, br, zstd, Accept-Language: bn-BD, Sec-Fetch-Site: none কারণ পর্যটক নিজে Address Bar এ লিখেছেন, Cookie এ __Host-session। আর আগের কপিটা আছে বলে If-None-Match এ সেই কপির ETag।",
            },
            {
              title: "পথে কেউ Header ছোঁয় না",
              description:
                "বাসার Router NAT এর নিয়মে Packet এর Source বদলে করে 203.0.113.25, কিন্তু Header গুলো থাকে TCP এর Payload এর ভেতরে, Router সেখানে তাকায় না। আর HTTPS এ এগুলো Encrypt করা থাকে, মাঝের কেউ পড়তেও পারে না। সেই গল্প লেসন ০৭ এ।",
            },
            {
              title: "Caddy Host পড়ে, Header যোগ করে",
              description:
                "Host দেখে Caddy বুঝল কোন সাইট। বাইরে থেকে আসা কোনো X-Forwarded Header থাকলে সেগুলো উপেক্ষা করে নিজে লিখল X-Forwarded-For: 203.0.113.25, X-Forwarded-Proto: https, X-Forwarded-Host, তারপর Request টা পাঠাল 127.0.0.1:3000 এ।",
            },
            {
              title: "App যাচাই করে",
              description:
                "App প্রথমে একটা X-Request-Id বানাল। পাতাটা তৈরি করে তার ETag হিসাব করল আর If-None-Match এর সাথে মেলাল। এর মধ্যে Deploy হয়ে গেছে, পাতা বদলেছে, তাই মেলেনি।",
            },
            {
              title: "App উত্তরের Header লেখে",
              description:
                "200, Content-Type: text/html; charset=utf-8, Cache-Control: no-cache, নতুন ETag, X-Request-Id। Body এর প্রথম Byte পাঠানোর আগেই সব Header ঠিক করা, কারণ এরপর আর বদলানো যায় না।",
            },
            {
              title: "Caddy উত্তর সাজায়",
              description:
                "Accept-Encoding এ zstd ছিল, তাই Caddy Body চাপল zstd দিয়ে, বসাল Content-Encoding: zstd আর Vary: Accept-Encoding। সাথে নিরাপত্তার Header গুলো, Strict-Transport-Security থেকে Permissions-Policy, আর মুছে দিল Server।",
            },
            {
              title: "Browser উত্তর পড়ে",
              description:
                "Content-Encoding দেখে আগে Body খুলল, Content-Type আর charset দেখে HTML হিসেবে বাংলা ঠিকঠাক আঁকল, Cache-Control আর ETag দেখে নতুন কপিটা জমা রাখল, পরের বারের যাচাইয়ের জন্য।",
            },
            {
              title: "বাকি ফাইলগুলো আর তারেই যায় না",
              description:
                "নতুন HTML চাইল নতুন নামের JavaScript ফাইল, যেটা Cache এ নেই, তাই সেটা এলো। কিন্তু Logo, Font আর বদলায়নি এমন JavaScript ফাইলগুলো এক বছরের জন্য তাজা, তাই Browser সেগুলো নিজের Cache থেকেই দিল, একটা Request ও না পাঠিয়ে।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় এই লেসনের প্রায়
                সবকিছু নিজের যন্ত্রে ঘটবে, CORS এর লাল Error সহ।
              </ListItem>
              <ListItem>
                <strong>MDN এর HTTP Headers তালিকা</strong>, প্রতিটা Header এর এক পাতা,
                কোন Browser কী মানে সহ। অচেনা Header দেখলে প্রথম গন্তব্য।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.mozilla.org/en-US/docs/Web/HTTP/Headers
                </a>
              </ListItem>
              <ListItem>
                <strong>MDN এর CORS নির্দেশিকা</strong>, Simple আর Preflight এর
                প্রতিটা শর্ত, ছবি সহ।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.mozilla.org/en-US/docs/Web/HTTP/CORS
                </a>
              </ListItem>
              <ListItem>
                <strong>web.dev এর HTTP Cache নির্দেশিকা</strong>, কোন জিনিসে কোন
                Cache-Control, সিদ্ধান্ত নেওয়ার একটা ছক সহ।{" "}
                <a
                  href="https://web.dev/articles/http-cache"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  web.dev/articles/http-cache
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9110 আর RFC 9111</strong>, HTTP এর অর্থের নিয়ম আর Caching এর
                নিয়ম। পুরোটা পড়ার দরকার নেই, তর্ক বাধলে আসল কথাটা এখানে।{" "}
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
                  href="https://www.rfc-editor.org/rfc/rfc9111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9111
                </a>
              </ListItem>
              <ListItem>
                <strong>Caddy এর header Directive এর নথি</strong>, প্রতিটা চিহ্ন আর
                উদাহরণ।{" "}
                <a
                  href="https://caddyserver.com/docs/caddyfile/directives/header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  caddyserver.com/docs/caddyfile/directives/header
                </a>
              </ListItem>
              <ListItem>
                <strong>Next.js এর headers আর CSP এর নথি</strong>, next.config এ Header
                বসানো আর একটা পূর্ণ CSP।{" "}
                <a
                  href="https://nextjs.org/docs/app/api-reference/config/next-config-js/headers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nextjs.org/docs/app/api-reference/config/next-config-js/headers
                </a>
                {" আর "}
                <a
                  href="https://nextjs.org/docs/app/guides/content-security-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  nextjs.org/docs/app/guides/content-security-policy
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
                  Header হলো বার্তা সম্পর্কে তথ্য, পার্সেলের লেবেলের মতো। নাম, কোলন,
                  মান। নামে বড় ছোট হাত সমান, একই নাম দুইবার এলে কমা দিয়ে জোড়ে,
                  Set-Cookie ছাড়া। অচেনা Header চুপচাপ উপেক্ষা হয়।
                </ListItem>
                <ListItem>
                  Request Header এর প্রায় সব Browser নিজে বসায়। Host, Cookie, Origin,
                  Referer আর Sec-Fetch JavaScript বদলাতে পারে না, কিন্তু curl পারে।
                </ListItem>
                <ListItem>
                  Content-Type বলে Body টা কী, charset সহ। ভুল বা না থাকলে বাংলা ভাঙে,
                  JSON Parse ভাঙে, আর Browser আন্দাজ করে। nosniff সেই আন্দাজ বন্ধ করে।
                </ListItem>
                <ListItem>
                  Accept পরিবার চায়, Content পরিবার জানায়। Compression লেখাকে কয়েক গুণ
                  ছোট করে। উত্তর কোনো Request Header এর উপর নির্ভর করলে Vary দিতেই হবে।
                </ListItem>
                <ListItem>
                  Cache-Control ঠিক করে কে কতক্ষণ রাখবে। no-cache মানে রাখা যাবে
                  কিন্তু যাচাই করতে হবে, no-store মানে রাখাই যাবে না। না বললে Cache নিজে আন্দাজ করে।
                  একজনের তথ্য সবসময় private, no-store।
                </ListItem>
                <ListItem>
                  ETag আর Last-Modified দিয়ে বাসি কপি যাচাই হয়, না বদলালে 304, Body
                  ছাড়া। নামে Hash রাখলে ফাইল এক বছর রাখা যায়, HTML কে রাখতে হয় no-cache।
                </ListItem>
                <ListItem>
                  Same-Origin Policy অন্য Origin এর উত্তর পড়া আটকায়। CORS হলো Server এর
                  দেওয়া অনুমতি। Simple Request সোজা যায়, বাকিদের আগে Preflight। Cookie
                  সহ হলে * চলে না। আর CORS Browser চাপায়, এটা Server এর তালা নয়।
                </ListItem>
                <ListItem>
                  নিরাপত্তার Header কয়েক লাইনে XSS, Clickjacking আর Sniffing কমায়।
                  Caddy এর মতো Proxy যোগ করে X-Forwarded Header, যেগুলো শুধু চেনা Proxy
                  থেকে বিশ্বাস করতে হয়। আর X-Request-Id একটা Request কে সব Log এ খুঁজে
                  পেতে দেয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এক বাক্যে: Body বলে কী, Header বলে কীভাবে, কতক্ষণ, কার জন্য আর কোন
                নিয়মে। কেউ যদি জিজ্ঞেস করে পাতাটা পুরনো দেখাচ্ছে কেন, বা CORS Error
                কেন, বা Log এ সবাই এক IP কেন, আপনি এখন জানেন প্রথমে কোথায় তাকাতে হবে,
                Network Tab এর Headers এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৫, Cookies",
          content: (
            <p>
              এই লেসনে একটা Header বারবার নাম শুনিয়ে চলে গেছে, Set-Cookie। লেসন ০২ এ
              দেখেছেন HTTP Stateless, প্রতিটা Request নতুন, Server কিছু মনে রাখে না।
              তাহলে Island Tours কীভাবে জানে আপনি Login করা আছেন? উত্তর এই একটা Header
              আর তার জোড়া Cookie। পরের লেসনে দেখবেন Server কীভাবে Browser কে কিছু মনে
              রাখতে দেয়, HttpOnly, Secure আর SameSite কেন এত জরুরি, আর এই লেসনের
              Same-Origin Policy যা আটকায় না, সেই CSRF আক্রমণ কীভাবে বন্ধ করতে হয়।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Header", "বার্তা সম্পর্কে তথ্য, নাম: মান। নামে বড় ছোট হাত সমান"],
      ["Request Header", "Browser যা বলে: কাকে চাই, কী রূপে, কোথা থেকে, পরিচয়, শর্ত"],
      ["Response Header", "Server যা বলে: এটা কী, কতক্ষণ রাখা যাবে, কোথায় যেতে হবে, কে পড়তে পারবে"],
      ["Content-Type", "Body এর MIME Type আর charset। ভুল হলে বাংলা আর JSON দুইটাই ভাঙে"],
      ["nosniff", "Browser কে ধরন আন্দাজ করতে না দেওয়া"],
      ["Content Negotiation", "Accept পরিবার চায়, Content পরিবার জানায় কোনটা দেওয়া হলো"],
      ["Compression", "gzip, br, zstd। লেখাকে কয়েক গুণ ছোট করে, ছবিকে নয়"],
      ["Vary", "উত্তর কোন Request Header এর উপর নির্ভর করে, Cache কে জানানো"],
      ["Cache-Control", "max-age, s-maxage, private, public, no-cache, no-store, immutable"],
      ["ETag আর 304", "Body এর ছাপ। না বদলালে 304, Body ছাড়া"],
      ["Cache Busting", "ফাইলের নামে Hash, তাই এক বছর রাখা যায় আর Deploy এ নতুন URL"],
      ["Same-Origin Policy", "অন্য Origin এর উত্তর JavaScript পড়তে পারে না"],
      ["CORS", "Server এর Header দিয়ে দেওয়া অনুমতি। Browser চাপায়, Server এর তালা নয়"],
      ["Preflight", "আসল Request এর আগে OPTIONS দিয়ে অনুমতি চাওয়া"],
      ["Security Headers", "HSTS, CSP, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy"],
      ["X-Forwarded-For", "Proxy এর পেছনে আসল Client এর IP, শুধু চেনা Proxy থেকে বিশ্বাসযোগ্য"],
      ["X-Request-Id", "একটা Request এর নম্বর, প্রতিটা Log লাইনে আর Response এ"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "একটা Server পাঠাল content-type: text/html, আরেকটা পাঠাল Content-Type: text/html। আপনার Code এ এদের কীভাবে ধরবেন?",
        options: [
          {
            key: "A",
            text: "দুইটা আলাদা Header, দুইটাই আলাদা করে খুঁজতে হবে",
            isCorrect: false,
            explanation: "Header এর নামে বড় ছোট হাতের কোনো পার্থক্য নেই, দুইটা একই Header।",
          },
          {
            key: "B",
            text: "একই Header। নামের বড় ছোট হাত সমান, তাই নাম না মিলিয়ে খুঁজুন, যেমন Node এ সব নাম ছোট হাতে",
            isCorrect: true,
            explanation: "ঠিক। HTTP/2 তে সব নাম ছোট হাতেই আসে, আর Node এর req.headers আগেই সব ছোট হাতে করে রাখে।",
          },
          {
            key: "C",
            text: "ছোট হাতেরটা ভুল, Browser সেটা উপেক্ষা করবে",
            isCorrect: false,
            explanation: "ছোট হাতের নাম পুরোপুরি বৈধ। HTTP/2 তে এটাই নিয়ম।",
          },
          {
            key: "D",
            text: "শুধু HTTP/1.1 এ একই, HTTP/2 তে আলাদা",
            isCorrect: false,
            explanation: "সব Version এই নামের বড় ছোট হাত সমান। HTTP/2 শুধু তারে ছোট হাতে পাঠায়।",
          },
        ],
      },
      {
        id: 2,
        text: "Island Tours এর HTML পাতায় Cache-Control: no-cache দেওয়া। এর ঠিক মানে কী?",
        options: [
          {
            key: "A",
            text: "Browser পাতাটা কোথাও রাখবে না",
            isCorrect: false,
            explanation: "সেটা no-store। নামটা বিভ্রান্তিকর, আর এই ভুলটাই সবচেয়ে বেশি হয়।",
          },
          {
            key: "B",
            text: "Browser রাখতে পারে, কিন্তু প্রতিবার ব্যবহারের আগে Server কে জিজ্ঞেস করে যাচাই করবে",
            isCorrect: true,
            explanation: "ঠিক। ETag থাকলে যাচাইটা ছোট্ট, না বদলালে 304। তাই Deploy এর সাথে সাথে নতুন পাতা পৌঁছায়।",
          },
          {
            key: "C",
            text: "শুধু CDN রাখবে, Browser নয়",
            isCorrect: false,
            explanation: "কোন Cache রাখবে সেটা বলে private আর public, আর CDN এর আলাদা মেয়াদ বলে s-maxage।",
          },
          {
            key: "D",
            text: "পাতাটা এক দিন তাজা থাকবে",
            isCorrect: false,
            explanation: "মেয়াদ বলে max-age। no-cache মানে কোনো মেয়াদ ছাড়াই প্রতিবার যাচাই।",
          },
        ],
      },
      {
        id: 3,
        text: "Browser If-None-Match এ একটা ETag পাঠাল, Server উত্তর দিল 304 Not Modified। এরপর কী ঘটে?",
        options: [
          {
            key: "A",
            text: "Browser পাতাটা আবার পুরোটা চায়",
            isCorrect: false,
            explanation: "304 মানে পুরোটা আবার আনার দরকার নেই।",
          },
          {
            key: "B",
            text: "উত্তরে কোনো Body নেই, Browser নিজের জমা কপিটাই আবার তাজা ধরে ব্যবহার করে",
            isCorrect: true,
            explanation: "ঠিক। Byte বাঁচে। তবে যাওয়া আসার একটা Round Trip লাগেই, তাই তাজা কপি আরও দ্রুত।",
          },
          {
            key: "C",
            text: "এটা একটা Error, Console এ লাল লেখা আসে",
            isCorrect: false,
            explanation: "304 কোনো Error নয়, এটা Cache এর স্বাভাবিক আর সফল যাচাই।",
          },
          {
            key: "D",
            text: "Server নতুন ETag সহ পুরো Body পাঠায়",
            isCorrect: false,
            explanation: "সেটা হয় জিনিস বদলালে, তখন উত্তর 200।",
          },
        ],
      },
      {
        id: 4,
        text: "API একই URL এ কাউকে gzip আর কাউকে br এ চাপা উত্তর দেয়। Response এ Vary: Accept-Encoding কেন লাগবে?",
        options: [
          {
            key: "A",
            text: "নাহলে Browser Body খুলতে পারবে না",
            isCorrect: false,
            explanation: "Body খোলার জন্য Browser দেখে Content-Encoding, Vary নয়।",
          },
          {
            key: "B",
            text: "মাঝের Cache যেন প্রতিটা Encoding এর আলাদা কপি রাখে, একজনের br কপি এমন কাউকে না দেয় যে শুধু gzip বোঝে",
            isCorrect: true,
            explanation: "ঠিক। Vary বলে উত্তরটা কোন Request Header এর উপর নির্ভর করে, আর Cache সেই অনুযায়ী আলাদা কপি রাখে।",
          },
          {
            key: "C",
            text: "Compression চালু করতে Vary লাগে",
            isCorrect: false,
            explanation: "Compression চালু হয় Server এর Setting এ। Vary শুধু Cache কে জানায়।",
          },
          {
            key: "D",
            text: "Vary শুধু ভাষার জন্য",
            isCorrect: false,
            explanation: "Vary যেকোনো Request Header এর নাম নিতে পারে, Accept-Encoding, Accept-Language, Origin।",
          },
        ],
      },
      {
        id: 5,
        text: "https://blog.islandtours.example এর পাতা থেকে fetch(\"https://islandtours.example/api/tours\") চালানো হলো। কোনটা সত্যি?",
        options: [
          {
            key: "A",
            text: "দুইটাই Island Tours এর, তাই একই Origin, CORS লাগবে না",
            isCorrect: false,
            explanation: "Origin মেলায় Scheme, Host আর Port। blog.islandtours.example আর islandtours.example আলাদা Host।",
          },
          {
            key: "B",
            text: "আলাদা Origin। Server উত্তরে Access-Control-Allow-Origin না দিলে JavaScript উত্তরটা পড়তে পারবে না",
            isCorrect: true,
            explanation: "ঠিক। এটা একটা Simple GET, তাই Preflight লাগবে না, কিন্তু উত্তরে মিলে যাওয়ার মতো Allow-Origin লাগবে।",
          },
          {
            key: "C",
            text: "Request টাই Browser পাঠাবে না",
            isCorrect: false,
            explanation: "Simple Request Browser সোজা পাঠায়। আটকায় শুধু উত্তর পড়া।",
          },
          {
            key: "D",
            text: "আলাদা Origin, তাই সবসময় আগে একটা OPTIONS যাবে",
            isCorrect: false,
            explanation: "Preflight লাগে শুধু Simple এর বাইরের Request এ, যেমন PATCH বা JSON এর Content-Type।",
          },
        ],
      },
      {
        id: 6,
        text: "curl দিয়ে Origin: https://attacker.example বসিয়ে API চাইলে পুরো তালিকা চলে এলো। এটা কী প্রমাণ করে?",
        options: [
          {
            key: "A",
            text: "API এর CORS ভেঙে গেছে, এখনই ঠিক করতে হবে",
            isCorrect: false,
            explanation: "CORS ঠিকই আছে। curl কখনোই CORS মানে না।",
          },
          {
            key: "B",
            text: "CORS Browser চাপায়, Server নয়। তাই গোপন তথ্য CORS দিয়ে নয়, Authentication দিয়ে রক্ষা করতে হয়",
            isCorrect: true,
            explanation: "ঠিক। CORS রক্ষা করে Browser ব্যবহারকারীকে, যাতে অন্য সাইটের JavaScript তাঁর Cookie নিয়ে তাঁর তথ্য পড়তে না পারে।",
          },
          {
            key: "C",
            text: "curl এর Origin Header কাজ করে না",
            isCorrect: false,
            explanation: "Header টা Server এ ঠিকই পৌঁছেছে, Lab এর Log এ দেখা গেছে। শুধু curl উত্তর মিলিয়ে দেখে না।",
          },
          {
            key: "D",
            text: "Server এর Vary: Origin ভুল",
            isCorrect: false,
            explanation: "Vary: Origin শুধু Cache এর জন্য, এর সাথে এর কোনো সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 7,
        text: "Admin প্যানেলের Cookie সহ PATCH আটকে গেল: must not be the wildcard '*' when the request's credentials mode is 'include'। সঠিক সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "fetch এ mode: \"no-cors\" দেওয়া",
            isCorrect: false,
            explanation: "তাতে উত্তর Opaque হয়ে যায়, JavaScript কিছুই পড়তে পারে না। সমস্যা লুকায়, সারে না।",
          },
          {
            key: "B",
            text: "যে Origin ই আসুক সেটা ফেরত লিখে দেওয়া",
            isCorrect: false,
            explanation: "তালিকা ছাড়া ফেরত লেখা মানে attacker.example ও Cookie সহ পড়তে পারবে। এটা SOP তুলে দেওয়ার সমান।",
          },
          {
            key: "C",
            text: "Environment Variable এর তালিকায় Origin টা আছে কি না দেখে হুবহু সেটা ফেরত দেওয়া, সাথে Allow-Credentials: true আর Vary: Origin",
            isCorrect: true,
            explanation: "ঠিক। Cookie সহ Request এ হুবহু Origin লাগে, আর তালিকাটা Config এ থাকে বলে বদলাতে Code ছুঁতে হয় না।",
          },
          {
            key: "D",
            text: "Cookie বাদ দিয়ে Token টা URL এর Query তে পাঠানো",
            isCorrect: false,
            explanation: "লেসন ০১ এ দেখেছেন URL এর গোপন কথা Log আর History তে চলে যায়। আর এতে CORS এর সমস্যাও মেটে না।",
          },
        ],
      },
      {
        id: 8,
        text: "Caddy এর পেছনে চলা App এর Log এ প্রতিটা পর্যটকের IP 127.0.0.1। সঠিক সমাধান কোনটা?",
        options: [
          {
            key: "A",
            text: "App কে Port 3000 এ সরাসরি Internet এ খুলে দেওয়া, যাতে আসল IP দেখা যায়",
            isCorrect: false,
            explanation: "তাতে Caddy এর HTTPS, Compression আর নিরাপত্তার Header সব হারায়। Module 05 এ দেখেছেন App কেন 127.0.0.1 এ বসে থাকে।",
          },
          {
            key: "B",
            text: "X-Forwarded-For পড়া, কিন্তু শুধু তখন যখন Request টা চেনা Proxy, মানে 127.0.0.1 এর Caddy থেকে এসেছে",
            isCorrect: true,
            explanation: "ঠিক। Caddy বাইরের দাবি উপেক্ষা করে নিজে আসল IP লেখে, আর App শুধু Caddy কে বিশ্বাস করে।",
          },
          {
            key: "C",
            text: "যে Request এ X-Forwarded-For আছে, সবসময় সেটাই বিশ্বাস করা",
            isCorrect: false,
            explanation: "এই Header যে কেউ জাল করতে পারে। চোখ বুজে বিশ্বাস করলে IP ধরে করা প্রতিটা পাহারা অকেজো।",
          },
          {
            key: "D",
            text: "User-Agent থেকে পর্যটককে চেনা",
            isCorrect: false,
            explanation: "User-Agent বলে Browser এর ধরন, মানুষ বা IP নয়, আর সেটাও যে কেউ বদলাতে পারে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Header গুলো নিজের যন্ত্রে বসান, ভাঙুন আর সারান",
    subtitle: "ছয়টা পরীক্ষা, শুধু Node, curl আর Browser, কোনো Package লাগে না",
    stepName: "LAB",
    steps: [
      {
        title: "Header গুলো নিজের চোখে",
        description:
          "একটা Server যা পায় তাই ফেরত দেয়। curl দিয়ে নিজের Header পাঠান, তারপর Browser দিয়ে খুলে দেখুন Browser নিজে থেকে কী কী পাঠায়।",
      },
      {
        title: "Content-Type বদলালে কী হয়",
        description:
          "একই Body কয়েকটা আলাদা লেবেলে। charset ছাড়া বাংলা, ভুল লেবেলের JSON, আর পাতার বদলে ফাইল নামানো।",
      },
      {
        title: "Compression মেপে দেখা",
        description:
          "দুইশো Tour এর তালিকা কিছু না চেয়ে, gzip চেয়ে আর Browser এর মতো চেয়ে। তিনটা আকার মিলিয়ে দেখুন, আর Vary খুঁজুন।",
      },
      {
        title: "ETag আর 304",
        description:
          "একটা Tour এর পাতা, ETag সহ। ছাপ দেখিয়ে আবার চাইলে 304, একটা আসন বুক হলে আবার 200।",
      },
      {
        title: "CORS নিজের হাতে ভাঙা আর সারানো",
        description:
          "দুইটা Origin, একটা পাতা আর একটা API। localhost থেকে চলে, 127.0.0.1 থেকে ভাঙে, আর curl কখনো আটকায় না।",
      },
      {
        title: "Proxy এর পেছনে আসল IP",
        description:
          "Caddy এর একটা ছোট নকল আর তার পেছনে একটা App। App কী দেখে, আর জাল X-Forwarded-For কীভাবে ফেলে দেওয়া হয়।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-echo-headers.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47641 node 1-echo-headers.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const server = http.createServer((req, res) => {
  // rawHeaders এ নামগুলো ঠিক যেভাবে এসেছে সেভাবেই থাকে, জোড়ায় জোড়ায়
  const raw = [];
  for (let i = 0; i < req.rawHeaders.length; i += 2) {
    raw.push(\`\${req.rawHeaders[i]}: \${req.rawHeaders[i + 1]}\`);
  }
  console.log(\`\\n\${req.method} \${req.url} HTTP/\${req.httpVersion}\`);
  for (const line of raw) console.log("  " + line);

  // req.headers এ নাম ছোট হাতের, আর একই নামের মান জোড়া লাগানো
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ raw, parsed: req.headers }, null, 2) + "\\n");
});

server.listen(port, "127.0.0.1", () =>
  console.log(\`echo server on http://localhost:\${port}\`),
);

// আরেকটা Terminal এ:
//   curl -s -H "X-Request-Id: req-001" \\
//        -H "accept-language: bn-BD, bn;q=0.9, en;q=0.8" \\
//        -H "X-Trace: a" -H "X-Trace: b" \\
//        "http://localhost:47641/api/tours?date=2026-12-20"
//
// Server এর Terminal এ যা এসেছিল (আসল ফলাফল):
//   GET /api/tours?date=2026-12-20 HTTP/1.1
//     Host: localhost:47641
//     User-Agent: curl/8.7.1
//     Accept: */*
//     X-Request-Id: req-001
//     accept-language: bn-BD, bn;q=0.9, en;q=0.8
//     X-Trace: a
//     X-Trace: b
//
// আর উত্তরের "parsed" অংশে: নাম সব ছোট হাতে, দুইটা X-Trace জুড়ে "a, b"
//   "accept-language": "bn-BD, bn;q=0.9, en;q=0.8",
//   "x-trace": "a, b"
//
// এবার Browser এ http://localhost:47641/ খুলুন আর Terminal দেখুন।
// curl পাঠিয়েছিল তিনটা Header, Browser পাঠাবে এক ডজনের বেশি।`,
      },
      {
        filename: "2-content-type.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47642 node 2-content-type.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const html = "<h1>সেন্ট মার্টিন দ্বীপ ভ্রমণ</h1>";
const booking = JSON.stringify({ id: "bk_7Q2M9X", tour: "saint-martin", guests: 2 });

const routes = {
  // একই HTML, একবার charset ছাড়া, একবার সহ
  "/no-charset": ["text/html", html],
  "/utf8": ["text/html; charset=utf-8", html],
  // JSON, কিন্তু ভুল লেবেল লাগানো
  "/json-as-html": ["text/html; charset=utf-8", booking],
  "/json": ["application/json; charset=utf-8", booking],
  // একই Body, Browser কে বলা হচ্ছে ফাইল হিসেবে নামাতে
  "/ticket": ["text/plain; charset=utf-8", "Ticket bk_7Q2M9X\\n"],
};

http
  .createServer((req, res) => {
    const route = routes[req.url];
    if (!route) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("not found\\n");
    }
    const [type, body] = route;
    res.setHeader("Content-Type", type);
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.url === "/ticket") {
      res.setHeader("Content-Disposition", 'attachment; filename="ticket-bk_7Q2M9X.txt"');
    }
    res.end(body);
  })
  .listen(port, "127.0.0.1", () => console.log(\`open http://localhost:\${port}/no-charset\`));

// আরেকটা Terminal এ, প্রতিটা Route এর Header দেখুন:
//   for p in no-charset utf8 json-as-html json ticket; do
//     echo "== /$p"; curl -s -D - -o /dev/null http://localhost:47642/$p
//   done
//
// আসল ফলাফলের অংশ:
//   == /no-charset
//   Content-Type: text/html
//   == /utf8
//   Content-Type: text/html; charset=utf-8
//   == /ticket
//   Content-Type: text/plain; charset=utf-8
//   Content-Disposition: attachment; filename="ticket-bk_7Q2M9X.txt"
//
// তারপর Browser এ চারটা পাতা খুলুন:
//   http://localhost:47642/no-charset   (বাংলা ঠিক আসে, নাকি ভাঙে?)
//   http://localhost:47642/utf8         (সবসময় ঠিক)
//   http://localhost:47642/json-as-html (JSON টা পাতার লেখা হয়ে গেল)
//   http://localhost:47642/ticket       (পাতা খোলে না, ফাইল নামে)`,
      },
      {
        filename: "3-compress.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47643 node 3-compress.mjs
import http from "node:http";
import zlib from "node:zlib";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// দুইশো Tour এর একটা তালিকা, আসল API এর মতো একই ধাঁচের Field বারবার
const names = ["saint-martin", "sundarbans-cruise", "sajek-valley"];
const tours = Array.from({ length: 200 }, (_, i) => ({
  slug: \`\${names[i % 3]}-\${i}\`,
  title: "Saint Martin Island Escape",
  priceMinor: 1250000,
  currency: "BDT",
  seatsLeft: i % 17,
}));
const body = Buffer.from(JSON.stringify(tours));

http
  .createServer((req, res) => {
    const accepted = req.headers["accept-encoding"] ?? "";
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // উত্তর Accept-Encoding এর উপর নির্ভর করে, Cache কে সেটা জানিয়ে রাখা
    res.setHeader("Vary", "Accept-Encoding");

    let out = body;
    if (/\\bbr\\b/.test(accepted)) {
      out = zlib.brotliCompressSync(body);
      res.setHeader("Content-Encoding", "br");
    } else if (/\\bgzip\\b/.test(accepted)) {
      out = zlib.gzipSync(body);
      res.setHeader("Content-Encoding", "gzip");
    }
    res.setHeader("Content-Length", out.length);
    console.log(\`Accept-Encoding: "\${accepted}" -> \${res.getHeader("Content-Encoding") ?? "identity"}, \${out.length} bytes\`);
    res.end(out);
  })
  .listen(port, "127.0.0.1", () => console.log(\`tour list on http://localhost:\${port}/api/tours\`));

// আরেকটা Terminal এ, একই URL তিনভাবে:
//   curl -s -o /dev/null -w "%{size_download} bytes\\n" http://localhost:47643/api/tours
//   curl -s -o /dev/null -w "%{size_download} bytes\\n" -H "Accept-Encoding: gzip" http://localhost:47643/api/tours
//   curl -s -o /dev/null -w "%{size_download} bytes\\n" -H "Accept-Encoding: gzip, deflate, br, zstd" http://localhost:47643/api/tours
//
// Server এর Terminal এ (আসল ফলাফল):
//   Accept-Encoding: "" -> identity, 23706 bytes
//   Accept-Encoding: "gzip" -> gzip, 1209 bytes
//   Accept-Encoding: "gzip, deflate, br, zstd" -> br, 646 bytes
//
// উত্তরের Header দেখুন:
//   curl -s -D - -o /dev/null -H "Accept-Encoding: br" http://localhost:47643/api/tours
//   Content-Type: application/json; charset=utf-8
//   Vary: Accept-Encoding
//   Content-Encoding: br
//   Content-Length: 646`,
      },
      {
        filename: "4-etag-cache.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47644 node 4-etag-cache.mjs
import { createHash } from "node:crypto";
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

let seatsLeft = 12;
let hits = 0;

function tourBody() {
  return JSON.stringify({ slug: "saint-martin", title: "Saint Martin Island Escape", seatsLeft });
}

http
  .createServer((req, res) => {
    hits += 1;
    if (req.url === "/api/tours/saint-martin") {
      const body = tourBody();
      // Body বদলালেই ETag বদলায়, তাই Body এর Hash ই ভালো ETag
      const etag = \`"\${createHash("sha256").update(body).digest("base64url").slice(0, 16)}"\`;
      res.setHeader("Cache-Control", "public, max-age=10");
      res.setHeader("ETag", etag);
      if (req.headers["if-none-match"] === etag) {
        console.log(\`#\${hits} GET tour -> 304, no body sent\`);
        res.writeHead(304);
        return res.end();
      }
      console.log(\`#\${hits} GET tour -> 200, \${body.length} bytes, ETag \${etag}\`);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(body);
    }
    if (req.url === "/book" && req.method === "POST") {
      seatsLeft -= 1;
      console.log(\`#\${hits} POST /book -> seatsLeft is now \${seatsLeft}\`);
      res.writeHead(201, { "Cache-Control": "no-store" });
      return res.end();
    }
    if (req.url === "/api/me") {
      // একজন মানুষের নিজের তথ্য: কোথাও জমা রাখা চলবে না
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(JSON.stringify({ id: "usr_42" }));
    }
    res.writeHead(404);
    res.end();
  })
  .listen(port, "127.0.0.1", () => console.log(\`cache lab on http://localhost:\${port}\`));

// আরেকটা Terminal এ:
//   curl -s -D - http://localhost:47644/api/tours/saint-martin
//     Cache-Control: public, max-age=10
//     ETag: "TLA3YHQRl1KfW0Q0"
//
//   # ছাপটা দেখিয়ে আবার চাওয়া
//   curl -s -D - -H 'If-None-Match: "TLA3YHQRl1KfW0Q0"' http://localhost:47644/api/tours/saint-martin
//     HTTP/1.1 304 Not Modified        (কোনো Body নেই)
//
//   # একটা আসন বুক করুন, তারপর আবার একই ছাপ দেখান
//   curl -s -X POST http://localhost:47644/book
//   curl -s -D - -o /dev/null -H 'If-None-Match: "TLA3YHQRl1KfW0Q0"' http://localhost:47644/api/tours/saint-martin
//     HTTP/1.1 200 OK                  (নতুন Body, নতুন ETag)
//
// Server এর Terminal এ (আসল ফলাফল, আপনার ETag এর অক্ষর একই হবে, কারণ Body একই):
//   #1 GET tour -> 200, 75 bytes, ETag "TLA3YHQRl1KfW0Q0"
//   #3 GET tour -> 304, no body sent
//   #4 POST /book -> seatsLeft is now 11
//   #5 GET tour -> 200, 75 bytes, ETag "bL6pwOGnAYzQQ4lP"`,
      },
      {
        filename: "5-cors.mjs",
        language: "javascript",
        code: `// চালান:
//   export LAB_PORT=47645 API_PORT=47646
//   export ALLOWED_ORIGINS="http://localhost:47645"
//   node 5-cors.mjs
import http from "node:http";

const pagePort = Number(process.env.LAB_PORT);
const apiPort = Number(process.env.API_PORT);
if (!pagePort) throw new Error("LAB_PORT is not set");
if (!apiPort) throw new Error("API_PORT is not set");
if (!process.env.ALLOWED_ORIGINS) throw new Error("ALLOWED_ORIGINS is not set");
// কোন Origin গুলো পড়তে পারবে, সেটা Code এ নয়, Environment Variable এ
const allowed = new Set(process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()));

// ১. Page Server: এই পাতাটা একটা Origin, API আরেকটা Origin
const page = \`<!doctype html><meta charset="utf-8"><title>CORS lab</title>
<button id="get">GET /api/tours</button>
<button id="patch">PATCH /api/bookings/bk_7Q2M9X</button>
<pre id="out"></pre>
<script>
const api = "http://localhost:\${apiPort}";
const out = document.getElementById("out");
const show = (t) => (out.textContent += t + "\\\\n");
document.getElementById("get").onclick = () =>
  fetch(api + "/api/tours").then((r) => r.json()).then((j) => show("GET ok: " + JSON.stringify(j))).catch((e) => show("GET failed: " + e));
document.getElementById("patch").onclick = () =>
  fetch(api + "/api/bookings/bk_7Q2M9X", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guests: 3 }),
  }).then((r) => r.json()).then((j) => show("PATCH ok: " + JSON.stringify(j))).catch((e) => show("PATCH failed: " + e));
</script>\`;

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page);
  })
  .listen(pagePort, "127.0.0.1", () => console.log(\`page on http://localhost:\${pagePort}\`));

// ২. API Server
http
  .createServer((req, res) => {
    const origin = req.headers.origin;
    console.log(\`\${req.method} \${req.url}  Origin: \${origin ?? "(none)"}\`);

    // উত্তর Origin এর উপর নির্ভর করে, তাই Cache কে জানানো
    res.setHeader("Vary", "Origin");
    if (origin && allowed.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    if (req.method === "OPTIONS") {
      // Preflight: Browser জিজ্ঞেস করছে, আসল Request টা পাঠাতে পারি?
      console.log(\`  preflight asks: \${req.headers["access-control-request-method"]} with \${req.headers["access-control-request-headers"] ?? "no extra headers"}\`);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "600");
      res.writeHead(204);
      return res.end();
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "GET" && req.url === "/api/tours") {
      return res.end(JSON.stringify([{ slug: "saint-martin" }]));
    }
    if (req.method === "PATCH" && req.url === "/api/bookings/bk_7Q2M9X") {
      return res.end(JSON.stringify({ id: "bk_7Q2M9X", guests: 3 }));
    }
    res.writeHead(404);
    res.end(JSON.stringify({ error: "not found" }));
  })
  .listen(apiPort, "127.0.0.1", () => console.log(\`api on http://localhost:\${apiPort}\`));

// পরীক্ষা ক: Browser এ http://localhost:47645 খুলুন, দুইটা বোতামই চাপুন।
//   দুইটাই চলবে। API এর Terminal এ PATCH এর আগে একটা OPTIONS দেখবেন।
// পরীক্ষা খ: এবার http://127.0.0.1:47645 খুলুন, একই পাতা, একই বোতাম।
//   দুইটাই ব্যর্থ, Console এ লাল CORS Error। কারণ 127.0.0.1 আর localhost দুইটা আলাদা Origin।
//   API এর Terminal দেখুন: GET টা কিন্তু পৌঁছেছিল। PATCH এর শুধু OPTIONS এসেছিল, PATCH নিজে আসেনি।
// পরীক্ষা গ: Browser ছাড়া, curl দিয়ে Browser এর ভান করুন:
//   curl -s -D - -H "Origin: https://attacker.example" http://localhost:47646/api/tours
//     HTTP/1.1 200 OK
//     Vary: Origin                      (Allow-Origin নেই, তবু পুরো তালিকা এলো)
//     [{"slug":"saint-martin"}]
//   curl -s -D - -X OPTIONS -H "Origin: http://localhost:47645" \\
//        -H "Access-Control-Request-Method: PATCH" \\
//        -H "Access-Control-Request-Headers: content-type" \\
//        http://localhost:47646/api/bookings/bk_7Q2M9X
//     HTTP/1.1 204 No Content
//     Access-Control-Allow-Origin: http://localhost:47645
//     Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
//     Access-Control-Allow-Headers: Content-Type
//     Access-Control-Max-Age: 600`,
      },
      {
        filename: "6-proxy-headers.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47647 APP_PORT=47648 node 6-proxy-headers.mjs
import { randomUUID } from "node:crypto";
import http from "node:http";

const proxyPort = Number(process.env.LAB_PORT);
const appPort = Number(process.env.APP_PORT);
if (!proxyPort) throw new Error("LAB_PORT is not set");
if (!appPort) throw new Error("APP_PORT is not set");

// ১. App: Caddy এর পেছনের App এর মতো, শুধু Proxy এর সাথে কথা বলে
http
  .createServer((req, res) => {
    console.log(\`app: socket says the client is \${req.socket.remoteAddress}\`);
    console.log(\`app: X-Forwarded-For   = \${req.headers["x-forwarded-for"]}\`);
    console.log(\`app: X-Forwarded-Proto = \${req.headers["x-forwarded-proto"]}\`);
    console.log(\`app: X-Forwarded-Host  = \${req.headers["x-forwarded-host"]}\`);
    console.log(\`app: X-Request-Id      = \${req.headers["x-request-id"]}\`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(\`hello, \${req.headers["x-forwarded-for"]}\\n\`);
  })
  .listen(appPort, "127.0.0.1");

// ২. Proxy: সামনের দরজা, Caddy যা করে তার ছোট একটা নকল
http
  .createServer((req, res) => {
    const headers = { ...req.headers };
    // বাইরে থেকে আসা X-Forwarded-For বিশ্বাস করা হয় না, নিজে যা দেখেছে সেটাই লেখে
    headers["x-forwarded-for"] = req.socket.remoteAddress;
    headers["x-forwarded-proto"] = "http";
    headers["x-forwarded-host"] = req.headers.host;
    const requestId = req.headers["x-request-id"] ?? randomUUID();
    headers["x-request-id"] = requestId;

    const upstream = http.request(
      { host: "127.0.0.1", port: appPort, path: req.url, method: req.method, headers },
      (up) => {
        res.writeHead(up.statusCode, { ...up.headers, "x-request-id": requestId });
        up.pipe(res);
      },
    );
    upstream.on("error", () => {
      res.writeHead(502, { "x-request-id": requestId });
      res.end("bad gateway\\n");
    });
    req.pipe(upstream);
  })
  .listen(proxyPort, "127.0.0.1", () => console.log(\`proxy on http://localhost:\${proxyPort}\`));

// আরেকটা Terminal এ:
//   curl -s -D - http://localhost:47647/api/me
//     x-request-id: 7363fa00-c570-4484-9701-1b8c99bc1651
//     hello, 127.0.0.1
//
//   # এবার মিথ্যা বলুন: নিজেকে অন্য IP বলে দাবি করুন
//   curl -s -H "X-Forwarded-For: 198.51.100.7" -H "X-Request-Id: req-from-client-1" http://localhost:47647/api/me
//     hello, 127.0.0.1                  (মিথ্যাটা Proxy ফেলে দিয়েছে)
//
// App এর Log এ (আসল ফলাফল):
//   app: socket says the client is 127.0.0.1
//   app: X-Forwarded-For   = 127.0.0.1
//   app: X-Forwarded-Proto = http
//   app: X-Forwarded-Host  = localhost:47647
//   app: X-Request-Id      = req-from-client-1
//
// নিজের যন্ত্রে সবাই 127.0.0.1, তাই দুইটা সংখ্যা একই। আসল Server এ Socket দেখাবে
// Caddy কে, আর X-Forwarded-For দেখাবে পর্যটকের 203.0.113.25।`,
      },
    ],
    tip: "পরীক্ষা ৫ এর দুইটা অংশ পাশাপাশি রেখে ভাবুন, কারণ এই লেসনের সবচেয়ে কাজের শিক্ষাটা সেখানে। localhost থেকে খোলা পাতা আর 127.0.0.1 থেকে খোলা পাতা আসলে একই যন্ত্রের একই পাতা, তবু একটা চলে আর একটা ভাঙে, কারণ Browser এর কাছে দুইটা আলাদা Origin। আর ভাঙা অবস্থায় ও GET টা Server এ পৌঁছেছিল, শুধু উত্তরটা JavaScript পায়নি, অথচ PATCH টা পৌঁছায়ইনি, কারণ তার Preflight আটকে গিয়েছিল। এই দুইটা জিনিস মাথায় থাকলে Production এ কোনো CORS Error আপনাকে আর ঘণ্টার পর ঘণ্টা আটকে রাখবে না: আগে দেখুন Origin দুইটা ঠিক কোন টুকরোয় আলাদা, তারপর দেখুন আটকেছে আসল Request নাকি তার Preflight।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Header নিয়মপত্র",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুইটা Browser, একটা তালিকা:</strong> Lab এর এক নম্বর Server চালু
        রেখে দুইটা আলাদা Browser থেকে <code>http://localhost:47641/</code> খুলুন। দুই
        Browser এর পাঠানো সব Header পাশাপাশি লিখুন। প্রতিটার পাশে এক লাইনে লিখুন এটা
        কোন প্রশ্নের উত্তর, আর কোথায় দুই Browser আলাদা, কেন আলাদা।
      </span>,
      <span key="2">
        <strong>তিনটা আসল সাইট পড়ুন:</strong> নিজের পছন্দের তিনটা সাইটের মূল পাতায়{" "}
        <code>curl -sI</code> চালান। প্রতিটার Cache-Control, ETag বা Last-Modified,
        Content-Encoding আর নিরাপত্তার Header লিখুন। কোন সাইট কোন জিনিস বাদ দিয়েছে,
        আর তার ফল কী হতে পারে, প্রতিটার জন্য দুই লাইনে লিখুন।
      </span>,
      <span key="3">
        <strong>CORS এর তিনটা Error নিজে বানান:</strong> Lab এর পাঁচ নম্বর API তে ছোট
        বদল করে Chrome এর Console এ তিনটা আলাদা CORS Error আনুন: একটা Allow-Origin না
        দিয়ে, একটা Cookie সহ Request এ * দিয়ে, আর একটা OPTIONS এ 401 দিয়ে। প্রতিটার
        Console এর লেখা, Network Tab এর ছবি আর এক লাইনের সমাধান জমা দিন।
      </span>,
      <span key="4">
        <strong>my-tours এ Header বসান:</strong> নিজের my-tours Server এ চারটা Route এর
        Cache-Control ঠিক করুন: একটা HTML পাতা, Tour এর তালিকা, একটা আসনের সংখ্যা আর{" "}
        <code>/api/me</code>, প্রতিটার কারণ সহ। Tour এর পাতায় ETag আর 304 চালু করুন।
        CORS এর অনুমোদিত তালিকা পড়ুন <code>CORS_ALLOWED_ORIGINS</code> থেকে, আর সেটা না
        থাকলে Server যেন চালুই না হয়। প্রতিটা Route এর <code>curl -sI</code> ফলাফল জমা
        দিন।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য লিখেছেন,
        Frontend থেকে API ডাকলে CORS Error আসছে, অথচ Postman এ একদম ঠিক চলছে, তাহলে কি
        Browser এর Bug? তাঁকে বোঝান Same-Origin Policy কী আর কেন আছে, Postman কেন
        আটকায় না, তাঁর Error এর আসল কারণ খুঁজতে DevTools এ কোথায় দেখবেন, আর কোন দুইটা
        ভুল সমাধান কখনো করবেন না।
      </span>,
    ],
    deliverables: [
      <span key="1">দুই Browser এর Header এর পাশাপাশি তালিকা, ব্যাখ্যা সহ</span>,
      <span key="2">তিনটা সাইটের Header আর প্রতিটার দুই লাইনের মূল্যায়ন</span>,
      <span key="3">তিনটা CORS Error এর Console লেখা, Network Tab এর ছবি আর সমাধান</span>,
      <span key="4">my-tours এর Header Code আর চারটা Route এর curl ফলাফল</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
