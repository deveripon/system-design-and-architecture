/**
 * What: Module 06 Lesson 03, HTTP Methods and Status Codes. It teaches what each method promises
 * (safe, idempotent, cacheable), how to lay out the my-tours API, what every important status code
 * means and who writes it, how to shape an error body, and when a failed request is safe to send again.
 *
 * Why: The method and the status code are the two parts of an HTTP message that every browser,
 * proxy, cache and monitor reads without knowing the app, so getting them right decides whether
 * retries, caching and alerts work. The lab commands and their output were run for real against
 * example.com and a local Node server before they were written here.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  RedirectLab,
  RetryDecisionLab,
  SendTwiceLab,
  StatusDecisionLab,
} from "../../../components/course/topics/http/methods-animations";
import {
  ApiMapDiagram,
  GatewayErrorsDiagram,
  IdempotencyKeyDiagram,
  PutVsPatchSplit,
  StatusFamiliesDiagram,
  VerbAndAnswerDiagram,
} from "../../../components/course/topics/http/methods-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

export const httpMethodsStatusCodesContent: TopicData = {
  id: "http-methods-status-codes",
  introduction: {
    badge: "MODULE 06 · LESSON 03",
    title: <SectionTitle>কী চাই, আর কী হলো: Method আর Status Code</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          সন্ধ্যায় একজন পর্যটক ফোনে Island Tours খুলে Saint Martin Island Escape বেছে
          নিলেন, তারপর দুইজনের জন্য বুক করুন বোতামে চাপ দিলেন। এক সেকেন্ডের মধ্যে
          পর্দায় এলো, বুকিং নিশ্চিত। Browser এর Network Tab খোলা থাকলে সেখানে একটা
          লাইন দেখতেন: বাঁ দিকে <code>POST</code>, পাশে <code>/api/bookings</code>,
          আর ডান দিকে একটা সংখ্যা, <code>201</code>।
        </ContentParagraph>
        <ContentParagraph>
          একই সন্ধ্যায় আরেকজন পর্যটক একই নৌকার শেষ আসনটা চাইলেন, কয়েক মুহূর্ত দেরিতে।
          তাঁর Network Tab এ একই লাইন, শুধু সংখ্যাটা <code>409</code>। আর ঠিক যখন দল
          নতুন Version চালু করছিল, তৃতীয় একজন দেখলেন <code>502</code>। তিনজনই একই
          বোতাম চেপেছিলেন। তিনজনের গল্প আলাদা, আর পুরো গল্পটা বলে দিয়েছে একটা শব্দ আর
          তিনটা অঙ্ক।
        </ContentParagraph>
        <ContentParagraph>
          লেসন ০২ এ আপনি HTTP বার্তার পুরো চেহারা দেখেছেন। এই লেসন সেই বার্তার সবচেয়ে
          ছোট, অথচ সবচেয়ে ভারী দুইটা অংশ নিয়ে: Request এর প্রথম শব্দ, যাকে বলে Method,
          আর Response এর প্রথম তিনটা অঙ্ক, যাকে বলে Status Code। লেসন শেষে আপনি জানবেন
          প্রতিটা Method কী প্রতিশ্রুতি দেয় আর সেই প্রতিশ্রুতির উপর কারা ভরসা করে, উত্তর
          না এলে কোন Request আবার পাঠানো নিরাপদ, my-tours এর API এর পথ আর Method কীভাবে
          সাজাবেন, প্রতিটা পরিস্থিতিতে কোন Status Code পাঠাবেন, আর একটা Error এর Code
          দেখেই বুঝবেন দোষটা কার আর সেটা কোথায় জন্মেছে। শেষে নিজের যন্ত্রে একটা ছোট API
          চালাবেন, যেটা প্রায় সব গুরুত্বপূর্ণ Code নিজের হাতে ফেরত দেয়।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "কাউন্টারে গিয়ে আপনি প্রথমে বলেন কী চান: দেখাতে, বুক করতে, বদলাতে, নাকি বাতিল করতে। কাউন্টারের মানুষটা উত্তরে প্রথমে একটা কথাই বলেন: হয়ে গেছে, পাশের কাউন্টারে যান, আপনার কাগজে ভুল আছে, নাকি আমাদের দিক থেকে সমস্যা। বাকি সব কথা আসে এই দুইটার পরে।",
      author: "HTTP",
      role: "Lesson 03",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "verb-and-answer",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>একটা ক্রিয়া, একটা উত্তর</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০২ এ দেখেছেন, Browser যা পাঠায় সেটা আসলে কয়েক লাইনের লেখা। তার
                প্রথম লাইনটার নাম Request Line, আর তাতে তিনটা জিনিস থাকে, ফাঁকা জায়গা
                দিয়ে আলাদা করা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Method</strong>, যেমন <code>POST</code>। ফোন কী করতে চায়।
                </ListItem>
                <ListItem>
                  <strong>Target</strong>, যেমন <code>/api/bookings</code>। কোন জিনিসের
                  উপর কাজটা হবে। এটা লেসন ০১ এর Path আর Query।
                </ListItem>
                <ListItem>
                  <strong>Version</strong>, যেমন <code>HTTP/1.1</code>। কোন নিয়মে কথা
                  হচ্ছে, লেসন ০২ এ এর গল্প শুনেছেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Server এর উত্তরের প্রথম লাইনের নাম Status Line। তাতেও তিনটা জিনিস: Version,
                তিন অঙ্কের একটা Status Code, আর তার পাশে ছোট একটা লেখা, যাকে বলে Reason
                Phrase। যেমন <code>HTTP/1.1 201 Created</code>।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <VerbAndAnswerDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ছবি মাথায় রাখুন। কক্সবাজারে Island Tours এর একটা কাউন্টার আছে। আপনি
                গিয়ে বলেন, Saint Martin এর নৌকার তালিকাটা দেখান। অথবা বলেন, দুইজনের একটা
                বুকিং করুন। অথবা, আমার বুকিংটা বাতিল করুন। প্রতিটা বাক্যে দুইটা অংশ: একটা
                জিনিস, যেমন তালিকা বা বুকিং, আর একটা কাজ, যেমন দেখানো, করা বা বাতিল করা।
                HTTP তে জিনিসটার নাম লেখা থাকে URL এ, আর কাজটা লেখা থাকে Method এ। তাই একই
                ঠিকানা <code>/api/bookings/bk_7Q2M9X</code> এ GET পাঠালে বুকিংটা দেখায়, আর
                DELETE পাঠালে বাতিল করে।
              </ContentParagraph>
              <ContentParagraph>
                কাউন্টারের মানুষটা পুরো উত্তর দেওয়ার আগে প্রথমে একটা কথা বলেন: হয়ে গেছে,
                অথবা ওই পাশের কাউন্টারে যান, অথবা আপনার কাগজে ভুল আছে, অথবা আমাদের দিক থেকে
                একটু সমস্যা হচ্ছে। Status Code ঠিক এই প্রথম কথাটা। বাকি উত্তর, মানে Body,
                আসে তার পরে।
              </ContentParagraph>
              <ContentParagraph>
                এবার আসল প্রশ্ন। Method আর Status Code এর নামগুলো একটা ছোট, নির্দিষ্ট তালিকা
                থেকে আসে। কেউ নিজের মতো BOOK বা CANCEL নামের Method বানায় না, 201 এর বদলে
                নিজের মতো 777 লেখে না। কেন? কারণ এই বার্তাটা শুধু আপনার App আর আপনার Server
                পড়ে না। পথে আরও অনেকে পড়ে: Browser নিজে, Browser এর Cache, Island Tours এর
                Caddy, মাঝের কোনো CDN বা Load Balancer, Search Engine এর Crawler, আপনার
                Monitoring এর Dashboard। এরা কেউ আপনার App এর Code জানে না। তারা শুধু জানে GET
                মানে কী, POST মানে কী, 409 মানে কী, 503 মানে কী। এই ভাগ করা ভাষার জোরেই একটা
                Cache নিজে থেকে বোঝে কোন উত্তর জমিয়ে রাখা চলে, আর একটা Proxy বোঝে কোন Request
                হারালে নিজে থেকে আবার পাঠানো চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই লেসনের মূল কথা",
          content: (
            <p>
              Method আর Status Code আপনার আর আপনার Server এর মধ্যের ব্যক্তিগত চুক্তি নয়।
              এটা পথের সবার সাথে একটা প্রকাশ্য চুক্তি। আপনি GET লিখে যদি ভেতরে কিছু মুছে
              ফেলেন, বা Error হলেও 200 পাঠান, তাহলে আপনার Code হয়তো চলবে, কিন্তু পথের
              প্রত্যেকে আপনার Server কে ভুল বুঝবে। পুরো লেসন জুড়ে এই কথাটাই নানা চেহারায়
              ফিরে আসবে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুইটা ছোট নিয়মও শুরুতেই জেনে রাখুন। Method এর নাম Case-sensitive, মানে বড়
              আর ছোট হাতের অক্ষর আলাদা ধরা হয়, আর প্রচলিত সব Method বড় হাতের অক্ষরে লেখা।
              আর Reason Phrase এর কোনো দাম নেই, Program শুধু সংখ্যাটা পড়ে। HTTP/2 আর HTTP/3
              তে Reason Phrase পাঠানোই হয় না। নিজের Terminal এ একই সাইট দুইভাবে খুলে দেখুন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "reason-phrase.sh",
          code: `# পুরনো http, HTTP/1.1 এ কথা হয়
curl -sI http://example.com | head -1
# HTTP/1.1 200 OK

# https, এখানে curl আর Server HTTP/2 তে কথা বলে
curl -sI https://example.com | head -1
# HTTP/2 200

# দ্বিতীয়টায় OK শব্দটা নেই। কিছু হারায়নি, কারণ কেউ ওটা পড়তই না।`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "get-head",
      subHeader: { index: "002", title: "Methods" },
      title: <SectionTitle>GET আর HEAD: শুধু দেখতে চাই</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GET সবচেয়ে চেনা Method, আর আপনি দিনে হাজারবার এটা পাঠান না জেনেই। Address
                Bar এ একটা ঠিকানা লিখে Enter চাপলেন, GET। একটা Link এ চাপ দিলেন, GET। পাতার
                ভেতরের প্রতিটা ছবি, প্রতিটা CSS আর JavaScript ফাইল, সবই আলাদা আলাদা GET। Code
                এ <code>fetch</code> কে কোনো Method না বললে সেও GET পাঠায়।
              </ContentParagraph>
              <ContentParagraph>
                GET এর মানে একটাই: এই ঠিকানার জিনিসটা আমাকে দিন। কোন Tour, কোন তারিখ,
                কতজন, এসব শর্ত যায় URL এর Query তে, যেটা লেসন ০১ এ দেখেছেন:{" "}
                <code>GET /api/tours?date=2026-12-20&amp;guests=2</code>।
              </ContentParagraph>
              <ContentParagraph>
                GET এর সাথে একটা প্রতিশ্রুতি বাঁধা: এই Request এ Server এর কোনো কিছু
                বদলাবে না। এই প্রতিশ্রুতির নাম Safe, সেকশন ০০৫ এ এর পুরো গুরুত্ব দেখবেন।
                আপাতত দেখুন এই প্রতিশ্রুতির জোরে কী কী সম্ভব হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Browser আপনি চাপ দেওয়ার আগেই কিছু Link এর পাতা আগে থেকে আনিয়ে রাখতে
                  পারে, যাকে বলে Prefetch। কিছু বদলাবে না জানে বলেই এই সাহস।
                </ListItem>
                <ListItem>
                  Search Engine এর Crawler নিশ্চিন্তে প্রতিটা Link এ ঢুকে পড়তে পারে।
                </ListItem>
                <ListItem>
                  Cache উত্তরটা জমিয়ে রেখে পরের জনকে দিতে পারে। কীভাবে, তা লেসন ০৪ এ।
                </ListItem>
                <ListItem>
                  আপনি Refresh চাপতে পারেন, Bookmark করতে পারেন, Link কাউকে পাঠাতে পারেন,
                  কোনো ভয় ছাড়া।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "একটা Email, আর নিজে থেকে বাতিল হয়ে যাওয়া বুকিং",
          content: (
            <p>
              ধরুন my-tours এর প্রথম Version এ বুকিং নিশ্চিতকরণের Email এ একটা Link ছিল,
              বাতিল করতে এখানে চাপুন, যেটা পাঠায় <code>GET /bookings/bk_7Q2M9X/cancel</code>।
              দেখতে নিরীহ। কিন্তু অনেক Email সেবা নিরাপত্তার জন্য চিঠির প্রতিটা Link আগে
              নিজে খুলে দেখে, ভেতরে ক্ষতিকর কিছু আছে কি না। সেই যাচাইয়ের GET গিয়ে পড়ল
              বাতিলের ঠিকানায়, আর পর্যটক কিছু না চেপেই দেখলেন বুকিং বাতিল। দোষ Email সেবার
              নয়। তারা GET এর প্রতিশ্রুতিতে ভরসা করেছে, আর প্রতিশ্রুতিটা ভেঙেছিল my-tours।
              যে কাজ কিছু বদলায়, সেটা কখনো GET দিয়ে নয়।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রায় সবাই একদিন জিজ্ঞেস করেন, GET এর সাথে কি Body পাঠানো যায়? HTTP এর নিয়ম
              বলে, GET এর Body র কোনো নির্দিষ্ট অর্থ নেই, আর পথের কোনো Server বা Proxy সেটা
              ফেলে দিতে পারে, এমনকি পুরো Request টাই ফিরিয়ে দিতে পারে। Browser এর{" "}
              <code>fetch</code> তো চেষ্টাই করতে দেয় না। Node এ চালিয়ে দেখুন, Node এর{" "}
              <code>fetch</code> Browser এর নিয়মই মানে:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "get-with-body.sh",
          code: `node -e 'fetch("https://example.com", { method: "GET", body: "x" }).catch(e => console.log(e.name + ": " + e.message))'
# TypeError: Request with GET/HEAD method cannot have body.`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাই শর্ত যত জটিলই হোক, GET এ শর্ত যায় Query তে। Query এত লম্বা হয়ে যায় যে
                URL এ আঁটে না, এমন খোঁজের জন্য অনেক API একটা আলাদা POST রাখে, যেমন{" "}
                <code>POST /api/tours/search</code>। সেটা আর Safe থাকে না, তাই Cache ও হয় না,
                এই দামটা মেনে নিয়েই।
              </ContentParagraph>
              <ContentParagraph>
                এবার HEAD। HEAD হলো GET এর যমজ ভাই, একটা তফাত সহ: Server উত্তরে ঠিক সেই
                Header গুলোই পাঠায় যা GET এ পাঠাত, কিন্তু Body পাঠায় না। কেন দরকার? ধরুন আপনি
                জানতে চান একটা ৩০০ MB এর ভিডিও কত বড়, বা কবে শেষবার বদলেছে, বা আদৌ আছে কি
                না। পুরোটা নামানোর কী দরকার? HEAD পাঠান, Header পড়ুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Uptime Monitoring প্রতি মিনিটে অল্প খরচে খোঁজ নেয় সাইট বেঁচে আছে কি না।
                </ListItem>
                <ListItem>Link Checker দেখে কোন Link ভাঙা।</ListItem>
                <ListItem>Download Manager আগে দেখে নেয় ফাইল কত বড়।</ListItem>
                <ListItem>
                  আর <code>curl -I</code> আসলে একটা HEAD পাঠায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "head-example.sh",
          code: `curl -I https://example.com
# HTTP/2 200
# date: Sat, 31 Oct 2026 06:28:09 GMT
# content-type: text/html; charset=utf-8
# server: cloudflare
# last-modified: Sat, 24 Oct 2026 11:34:40 GMT
# allow: GET, HEAD
# accept-ranges: bytes
# ...আরও কয়েকটা Header, তারপর শেষ। কোনো Body নেই।`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              দুইটা জিনিস খেয়াল করুন। কোনো Body আসেনি, শুধু Header। আর একটা Header নিজেই
              এই লেসনের কথা বলছে: <code>allow: GET, HEAD</code>। example.com জানিয়ে দিচ্ছে
              এই ঠিকানায় শুধু এই দুইটা Method চলে। সেকশন ০১৪ এ দেখবেন বাকিগুলো পাঠালে সে কী
              বলে। তারিখ আর সময় আপনার যন্ত্রে আলাদা হবে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "HEAD এর জন্য আলাদা Code লাগে না",
          content: (
            <p>
              HEAD এ GET এর চেয়ে আলাদা Header পাঠানো, বা HEAD এ 405 দেওয়া, দুইটাই Server এর
              Bug, যদিও বাস্তবে মাঝে মাঝে দেখা যায়। Node এর <code>http</code> Module নিজেই
              HEAD এর উত্তর থেকে Body ফেলে দেয় আর Header গুলো রেখে দেয়। তাই নিচের Lab এর
              Server এ HEAD এর জন্য একটা লাইনও আলাদা লিখতে হয়নি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "post",
      subHeader: { index: "003", title: "Methods" },
      title: <SectionTitle>POST: এটা নিন, কিছু একটা করুন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GET চায়, POST দেয়। POST এর সাথে একটা Body যায়, আর Body টা কোন ভাষায় লেখা তা
                জানায় Content-Type নামের একটা Header, যার পুরো গল্প লেসন ০৪ এ। POST এর মানে
                ইচ্ছা করেই একটু ঢিলা: এই জিনিসটা নিন, আর এই ঠিকানার নিয়ম অনুযায়ী এটা দিয়ে
                কিছু একটা করুন। সেই কিছু একটা হতে পারে নতুন বুকিং তৈরি, Login, ছবি Upload,
                Payment, অথবা এমন যেকোনো কাজ যা বাকি Method গুলোর কোনোটায় খাপ খায় না।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এর Server চালু করে একটা বুকিং পাঠালে উত্তরটা এমন আসে:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "post-booking.sh",
          code: `curl -si -X POST http://127.0.0.1:47630/api/bookings \\
  -H "Authorization: Bearer usr_42" \\
  -H "Content-Type: application/json" \\
  -d '{"tour":"sundarbans-cruise","guests":2}'

# HTTP/1.1 201 Created
# Content-Type: application/json
# Content-Length: 118
# Location: /api/bookings/bk_02E50C5F
# ...
#
# {
#   "id": "bk_02E50C5F",
#   "tour": "sundarbans-cruise",
#   "guests": 2,
#   "owner": "usr_42",
#   "status": "confirmed"
# }`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উত্তরে তিনটা জিনিস দেখুন। Status Code 201, মানে নতুন কিছু তৈরি হয়েছে।
                Location Header বলছে নতুন জিনিসটা কোন ঠিকানায় থাকে। আর Body তে বুকিংটা
                নিজেই। নতুন বুকিং এর id Server নিজে বেছে নিয়েছে, ফোন নয়, আর আপনার যন্ত্রে
                id টা আলাদা হবে। id কে বাছবে, এই প্রশ্নটা একটু পরে PUT এর সাথে তুলনায় খুব
                কাজে লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                POST কোনো প্রতিশ্রুতি দেয় না। Safe নয়, কারণ সে কিছু বদলায়। আর একই POST
                দুইবার পাঠালে দুইবার কাজ হয়: দুইটা বুকিং, দুইবার টাকা। নিচের Lab এ নিজের চোখে
                দেখবেন, Key ছাড়া একই Payment দুইবার পাঠালে Server সত্যিই দুইবার টাকা কাটে।
              </ContentParagraph>
              <ContentParagraph>
                Browser এই কথাটা জানে, আর সেজন্যই আপনাকে আগে থেকে সাবধান করে। একটা Form জমা
                দেওয়ার পর Refresh চাপলে Chrome জিজ্ঞেস করে, Confirm Form Resubmission।
                Browser বলতে চাইছে, এই পাতাটা এসেছিল একটা POST এর উত্তরে, Refresh করলে সেই
                POST আবার যাবে, আপনি কি নিশ্চিত? পর্যটক কিছু না বুঝে হ্যাঁ চাপলে দ্বিতীয়
                বুকিং।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Post, Redirect, Get",
          content: (
            <p>
              এর প্রচলিত সমাধানের নাম Post/Redirect/Get। Server POST এর উত্তরে নিশ্চিতকরণের
              পাতা সরাসরি না পাঠিয়ে একটা 303 পাঠায়, সাথে{" "}
              <code>Location: /bookings/bk_7Q2M9X/confirmation</code>। Browser সেই ঠিকানায়
              নিজে থেকে একটা GET করে। এখন পর্দায় যে পাতা, সেটা এসেছে একটা GET থেকে।
              Refresh চাপলে শুধু সেই GET আবার যায়, বুকিং আর হয় না। 303 এর বিস্তারিত সেকশন
              ০০৯ এ।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আরেকটা চেনা বিপদ হলো দুইবার চাপ। পর্যটকের Network ধীর, বুক করুন চাপার পর কিছু
              হচ্ছে না দেখে তিনি আবার চাপলেন। দুইটা POST। প্রথম চাপের পর Frontend এ বোতামটা
              বন্ধ করে দেওয়া ভালো অভ্যাস, কিন্তু সেটা আসল পাহারা নয়, কারণ একই Request আসতে
              পারে অন্য পথেও, যেমন ফোনের App নিজে থেকে আবার চেষ্টা করলে। আসল পাহারা বসে
              Server এ, যার নাম Idempotency-Key, সেকশন ০১৩ এ। ততক্ষণ মনে রাখুন POST এর
              উত্তরে কোন Code কখন মানায়:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উত্তর", "কখন", "Island Tours এর উদাহরণ"],
          rows: [
            [mono("201 Created"), "নতুন কিছু তৈরি হয়েছে, Location এ তার ঠিকানা", "POST /api/bookings"],
            [mono("200 OK"), "কাজ হয়েছে, ফলাফল Body তে", "POST /api/auth/login, POST /api/tours/search"],
            [mono("202 Accepted"), "নিয়েছি, পরে করব", "Ticket এর PDF বানিয়ে Email করা"],
            [mono("204 No Content"), "কাজ হয়েছে, বলার কিছু নেই", "POST /api/auth/logout"],
            [mono("303 See Other"), "কাজ হয়েছে, ফলাফল ওই ঠিকানায় দেখুন", "Website এর বুকিং Form জমা দেওয়ার পর"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "put-patch-delete",
      subHeader: { index: "004", title: "Methods" },
      title: <SectionTitle>PUT, PATCH, DELETE, আর বাকি তিনজন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                PUT এর মানে: এই ঠিকানায় ঠিক এই জিনিসটা রাখুন। আগে কিছু থাকলে সেটা সরিয়ে
                পুরোটা নতুন করে রাখুন, না থাকলে তৈরি করুন। কথাটার দুইটা অংশই গুরুত্বপূর্ণ।
                প্রথমত, পুরোটা: PUT এর Body তে যা আছে সেটাই এখন পুরো জিনিস, যা নেই তা মুছে
                যায়। দ্বিতীয়ত, এই ঠিকানায়: ঠিকানাটা Client আগে থেকেই জানে।
              </ContentParagraph>
              <ContentParagraph>
                আর একই PUT দশবার পাঠালেও ফল একবারের মতোই। প্রথমবার guests হলো ৩, তারপর
                প্রতিবার আবার ৩ বসে, কিছুই আর বদলায় না। একবার আর বারবার পাঠানোর ফল এক হওয়ার
                এই গুণের নাম Idempotent, পরের সেকশনে শব্দটা পুরো খুলব।
              </ContentParagraph>
              <ContentParagraph>
                PATCH এর মানে: এই জিনিসটার শুধু এই অংশটুকু বদলান। পর্যটক শুধু অতিথির সংখ্যা
                বদলাতে চাইলে পুরো বুকিং পাঠানোর দরকার নেই, পাঠান শুধু{" "}
                <code>{'{"guests":3}'}</code>। নিচের ছবিতে একই বদল দুইভাবে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <PutVsPatchSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                বাঁ দিকের ঘটনাটা বাস্তবে খুব হয়। App এর একজন Developer ভাবলেন PUT মানে
                বদলানো, আর শুধু বদলানো Field টা পাঠালেন। Server নিয়ম মেনে বাকি সব মুছে দিল।
                তাই PUT দিলে সবসময় পুরো জিনিস পাঠান, আর অংশ বদলাতে চাইলে PATCH।
              </ContentParagraph>
              <ContentParagraph>
                PATCH এর Body কোন ভাষায় লেখা হবে, তার দুইটা প্রচলিত নিয়ম আছে। সহজটার নাম JSON
                Merge Patch: যে Field গুলো বদলাবে শুধু সেগুলো পাঠান, আর কোনো Field মুছতে চাইলে
                তার মান দিন <code>null</code>। তার Content-Type হলো{" "}
                <code>application/merge-patch+json</code>। আরেকটার নাম JSON Patch, সেখানে Body
                হলো কাজের একটা তালিকা, যেমন এই Field এর মান হবে এটা, ওই Field টা সরে যাবে।
                বাস্তবে বেশিরভাগ API সাধারণ <code>application/json</code> নেয় আর Merge Patch এর
                মতো আচরণ করে, নিচের Lab এর Server ও তাই।
              </ContentParagraph>
              <ContentParagraph>
                একটা সূক্ষ্ম কথা। HTTP এর নিয়ম PATCH কে Idempotent বলে প্রতিশ্রুতি দেয় না।
                guests এর মান ৩ করার PATCH বারবার পাঠালে ফল একই, কিন্তু একজন অতিথি যোগ করার
                PATCH প্রতিবার সংখ্যা বাড়ায়। কোনটা হবে তা Body তে কী লেখা তার উপর নির্ভর
                করে, আর পথের কেউ Body পড়ে সেটা বিচার করে না। তাই পথের কেউ PATCH কে নিরাপদে
                আবার পাঠানো যায় বলে ধরে নেয় না।
              </ContentParagraph>
              <ContentParagraph>
                DELETE এর মানে: এই ঠিকানার জিনিসটা সরিয়ে দিন। সফল হলে উত্তর সাধারণত 204, মানে
                হয়ে গেছে, বলার মতো Body নেই। DELETE Idempotent, তবে একটা মজার দিক আছে।
                প্রথমবার DELETE পাঠালে 204, দ্বিতীয়বার পাঠালে 404 বা 410, কারণ মোছার মতো কিছু
                নেই। উত্তর বদলাল, তাহলে কি Idempotent নয়? Idempotent কথাটা উত্তর নিয়ে নয়, Server
                এর অবস্থা নিয়ে। একবার পাঠানোর পরে বুকিং নেই, দশবার পাঠানোর পরেও বুকিং নেই।
                অবস্থা একই।
              </ContentParagraph>
              <ContentParagraph>
                DELETE মানেই যে Database থেকে লাইনটা সত্যিই মুছে যাবে, তা নয়। Island Tours এ
                একটা বুকিং এর DELETE এলে Server লাইনটা রেখে দেয়, অবস্থা লিখে দেয় বাতিল, আর
                ফেরতের টাকার কাজ শুরু করে, কারণ হিসাবের খাতায় সব বুকিং থাকতে হয়। কিন্তু বাইরে
                থেকে, পর্যটকের চোখে, বুকিংটা আর নেই, তাই পরের GET এ উত্তর আসে 410। ভেতরে কী হলো
                সেটা Server এর ব্যাপার, Method শুধু বাইরের চুক্তি।
              </ContentParagraph>
              <ContentParagraph>
                এবার একটা প্রশ্ন যেটা Interview তেও আসে: নতুন জিনিস তৈরি করতে POST নাকি PUT?
                উত্তর লুকিয়ে আছে আরেকটা প্রশ্নে, নতুন জিনিসটার ঠিকানা কে ঠিক করে?{" "}
                <code>POST /api/bookings</code> পাঠালে Server id বেছে নেয় আর Location এ জানায়।{" "}
                <code>PUT /api/bookings/bk_7Q2M9X</code> পাঠালে Client নিজেই id ঠিক করে দেয়।
                বেশিরভাগ সময় id Server ই বানায়, তাই তৈরির কাজে POST ই চলে। PUT দিয়ে তৈরি তখনই
                মানায়, যখন ঠিকানাটা আগে থেকেই স্পষ্ট, যেমন <code>PUT /api/me/avatar</code>, কারণ
                একজন ইউজারের ছবি একটাই।
              </ContentParagraph>
              <ContentParagraph>
                বাকি তিনজনের সাথে আপনার দেখা কম হবে, তবে নাম আর কাজ চিনে রাখা দরকার।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>OPTIONS</strong> জিজ্ঞেস করে, এই ঠিকানায় কী কী করা যায়? উত্তর আসে
                  Allow Header এ। আপনি নিজে খুব কম পাঠাবেন, কিন্তু Browser অনেক পাঠায়: অন্য
                  Origin এর API তে কিছু ধরনের Request পাঠানোর আগে Browser নিজে থেকে একটা OPTIONS
                  পাঠিয়ে অনুমতি নেয়। এর নাম Preflight, আর পুরো গল্পটা লেসন ০৪ এর CORS অংশে।
                </ListItem>
                <ListItem>
                  <strong>CONNECT</strong> একটা Forward Proxy কে বলে,{" "}
                  <code>islandtours.example:443</code> এর সাথে আমার জন্য একটা সুড়ঙ্গ খুলে
                  দিন। অফিসের Proxy র ভেতর দিয়ে HTTPS এভাবেই যায়, আর Proxy ভেতরের কথা পড়তে
                  পারে না। লেসন ০২ এর Forward Proxy আর লেসন ০৭ এর TLS মিলিয়ে এটা পুরো বুঝবেন।
                </ListItem>
                <ListItem>
                  <strong>TRACE</strong> Server কে বলে, আমার Request টা হুবহু ফেরত দিন। Debug
                  এর জন্য বানানো, কিন্তু একসময় এটা দিয়ে Cookie চুরির একটা কৌশল চালু হয়েছিল,
                  তাই প্রায় সব Server এ এটা বন্ধ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "options-and-trace.sh",
          code: `# নিচের Lab এর Server চালু থাকলে: এই ঠিকানায় কী কী চলে?
curl -si -X OPTIONS http://127.0.0.1:47630/api/bookings/bk_ABC
# HTTP/1.1 204 No Content
# Allow: GET, HEAD, PUT, PATCH, DELETE, OPTIONS
# ...

# example.com এ TRACE
curl -s -o /dev/null -w '%{http_code}\\n' -X TRACE https://example.com
# 405`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Method", "কী চায়", "Request এ Body", "সফল হলে সাধারণ উত্তর"],
          rows: [
            [mono("GET"), "জিনিসটা দিন", "না", "200"],
            [mono("HEAD"), "শুধু Header দিন", "না", "200, Body ছাড়া"],
            [mono("POST"), "এটা নিন, কিছু করুন", "হ্যাঁ", "201, 200, 202, 303"],
            [mono("PUT"), "এই ঠিকানায় পুরোটা এটা রাখুন", "হ্যাঁ", "200 বা 204, নতুন হলে 201"],
            [mono("PATCH"), "শুধু এই অংশ বদলান", "হ্যাঁ", "200 বা 204"],
            [mono("DELETE"), "সরিয়ে দিন", "সাধারণত না", "204, 200, অথবা 202"],
            [mono("OPTIONS"), "এখানে কী কী করা যায়", "না", "204 বা 200, সাথে Allow"],
            [mono("CONNECT"), "একটা সুড়ঙ্গ খুলুন", "না", "200"],
            [mono("TRACE"), "হুবহু ফেরত দিন", "না", "প্রায় সব জায়গায় 405"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "safe-idempotent",
      subHeader: { index: "005", title: "Core Idea" },
      title: <SectionTitle>Safe, Idempotent, Cacheable: তিনটা প্রতিশ্রুতি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ কয়েকবার বলেছি এই Method টা Safe, ওইটা Idempotent। এবার শব্দ তিনটা
                পরিষ্কার করি, কারণ এগুলো শুধু তত্ত্ব নয়। পথের প্রত্যেকে, Browser থেকে Proxy
                পর্যন্ত, এই তিনটা প্রতিশ্রুতি দেখেই সিদ্ধান্ত নেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Safe</strong>, যেমন রেস্টুরেন্টের Menu পড়া। একশোবার পড়লেও কিছু
                  অর্ডার হয় না। যে Method Server এর অবস্থা বদলানোর অনুরোধ করে না, সে Safe:
                  GET, HEAD, OPTIONS, TRACE।
                </ListItem>
                <ListItem>
                  <strong>Idempotent</strong>, যেমন Lift এর বোতাম। একবার চাপুন বা পাঁচবার,
                  Lift একবারই আসে। AC কে ২৪ ডিগ্রিতে বসানো Idempotent, এক ডিগ্রি কমানো নয়,
                  কারণ দ্বিতীয়টা পাঁচবার চাপলে পাঁচ ডিগ্রি কমে। যে Request একবার পাঠানো আর
                  বারবার পাঠানোর ফল Server এর উপর একই, সে Idempotent: সব Safe Method, তার সাথে
                  PUT আর DELETE।
                </ListItem>
                <ListItem>
                  <strong>Cacheable</strong>, মানে উত্তরটা জমিয়ে রেখে পরে আবার দেওয়া যায়।
                  GET আর HEAD এর উত্তর, যদি Server অনুমতি দেয়। অনুমতিটা কীভাবে দেয়, তা লেসন
                  ০৪ এর Cache অংশে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুইটা সূক্ষ্ম কথা মনে রাখুন। প্রথমত, Safe মানে Server এ একেবারে কিছুই ঘটবে না,
                এমন নয়। GET এ Server Log লিখতে পারে, কতবার পাতা দেখা হলো গুনতে পারে। কথাটা হলো
                Client কোনো বদল চায়নি, আর কোনো বদল ঘটলে তার দায় Client এর নয়। দ্বিতীয়ত, এগুলো
                প্রতিশ্রুতি, পাহারা নয়। HTTP আপনাকে GET এর Handler এ বুকিং মুছতে আটকাবে না।
                প্রতিশ্রুতিটা রাখার দায় আপনার Code এর।
              </ContentParagraph>
              <ContentParagraph>
                নিচের Lab এ প্রতিটা Method নিজে বারবার পাঠিয়ে দেখুন Server এর খাতায় কী
                বদলায়। কিছু না পড়ে আগে শুধু চাপ দিয়ে দেখুন নিয়মটা নিজে খুঁজে পান কি না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SendTwiceLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Method", "Safe", "Idempotent", "Cacheable"],
          rows: [
            [mono("GET"), "হ্যাঁ", "হ্যাঁ", "হ্যাঁ"],
            [mono("HEAD"), "হ্যাঁ", "হ্যাঁ", "হ্যাঁ"],
            [mono("OPTIONS"), "হ্যাঁ", "হ্যাঁ", "না"],
            [mono("TRACE"), "হ্যাঁ", "হ্যাঁ", "না"],
            [mono("PUT"), "না", "হ্যাঁ", "না"],
            [mono("DELETE"), "না", "হ্যাঁ", "না"],
            [mono("POST"), "না", "না", "নিয়মে শর্তসাপেক্ষে, বাস্তবে প্রায় কেউ করে না"],
            [mono("PATCH"), "না", "নিশ্চয়তা নেই", "না"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দেখুন এই প্রতিশ্রুতির উপর কারা কারা ভরসা করে, যাতে বোঝেন একটা ভাঙলে
                কতজন ভুল করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Browser:</strong> POST এর পাতায় Refresh চাপলে সাবধান করে, GET এর
                  পাতা নিঃশব্দে আবার আনে।
                </ListItem>
                <ListItem>
                  <strong>HTTP Client আর Proxy:</strong> Connection মাঝপথে ভাঙলে অনেক Client আর
                  Proxy Idempotent Request নিজে থেকে আবার পাঠায়, অন্যগুলো পাঠায় না। যেমন Nginx
                  এর Reverse Proxy পেছনের একটা Server এ Request পাঠানোর পরে ব্যর্থ হলে POST আর
                  PATCH কে নিজে থেকে পরের Server এ পাঠায় না, যদি না আপনি আলাদা করে বলে দেন।
                </ListItem>
                <ListItem>
                  <strong>Crawler আর Link Preview:</strong> শুধু GET করে, আর ধরে নেয় তাতে কিছু
                  বদলায় না। Chat App এ একটা Link পাঠালেই তার Preview বানাতে একটা GET চলে যায়,
                  আপনি কিছু চাপার আগেই।
                </ListItem>
                <ListItem>
                  <strong>Cache:</strong> শুধু Safe Method এর উত্তর জমায়। একটা POST এর উত্তর
                  জমিয়ে রেখে পরের জনকে দিলে কী সর্বনাশ হতো, একবার ভাবুন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এই সেকশনের এক লাইন",
          content: (
            <p>
              উত্তর না এলে Idempotent Request নিশ্চিন্তে আবার পাঠানো যায়, বাকিগুলো যায় না।
              সেকশন ০১৩ পুরোটা এই এক লাইনের উপর দাঁড়িয়ে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "api-design",
      subHeader: { index: "006", title: "Design" },
      title: <SectionTitle>my-tours এর API সাজানো: পথে বিশেষ্য, Method এ ক্রিয়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Method গুলো চেনা হলো। এবার এগুলো দিয়ে একটা গোটা API সাজাই, my-tours এর জন্য।
              মূল নিয়মটা কাউন্টারের ছবি থেকেই আসে: URL এ থাকে জিনিস, Method এ থাকে কাজ। যে
              ধারায় API এভাবে সাজানো হয়, তাকে সাধারণত REST ধাঁচের API বলে। নামটা এসেছে
              Representational State Transfer থেকে, তবে নামের চেয়ে নিচের অভ্যাসগুলোই বেশি
              কাজের।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ApiMapDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>পথে বিশেষ্য, বহুবচনে।</strong> <code>/api/tours</code>,{" "}
                <code>/api/bookings</code>। একটা জিনিস তার id বা Slug দিয়ে:{" "}
                <code>/api/tours/saint-martin</code>। Slug হলো লেসন ০১ এর সেই মানুষের পড়ার
                মতো নাম।
              </ListItem>
              <ListItem>
                <strong>পথে কোনো ক্রিয়া নয়।</strong> <code>/api/getTours</code>,{" "}
                <code>/api/createBooking</code>, <code>/api/deleteBooking?id=bk_7Q2M9X</code>{" "}
                দেখতে সহজ লাগে, কিন্তু এতে Method এর কাজটা পথে চলে এসেছে। তখন পথের Cache বা
                Proxy আর বুঝতে পারে না কোনটা পড়া আর কোনটা বদলানো। শেষটা তো GET দিয়েও চলে যেতে
                পারে, ঠিক সেকশন ০০২ এর Email এর বিপদ।
              </ListItem>
              <ListItem>
                <strong>ভেতরের জিনিস ভেতরে।</strong> একটা Tour এর আসন{" "}
                <code>/api/tours/saint-martin/seats</code>। তবে দুই স্তরের বেশি গভীর না করাই
                ভালো, নইলে পথগুলো পড়া কঠিন হয়ে যায়।
              </ListItem>
              <ListItem>
                <strong>ছাঁকা, সাজানো আর পাতা ভাগ Query তে।</strong>{" "}
                <code>/api/tours?date=2026-12-20&amp;guests=2&amp;sort=price&amp;page=2</code>।
                এগুলো জিনিস বদলায় না, শুধু বলে কোন অংশটা দেখতে চান।
              </ListItem>
              <ListItem>
                <strong>id অনুমান করা কঠিন রাখুন।</strong> <code>bk_7Q2M9X</code> দেখে পরেরটা
                আন্দাজ করা যায় না, 1, 2, 3 দেখে যায়। আর সামনের <code>bk_</code> বলে দেয় এটা
                বুকিং এর id, Log পড়ার সময় এটা খুব কাজে লাগে।
              </ListItem>
              <ListItem>
                <strong>যে কাজ কোনো জিনিস নয়।</strong> Login, Logout এর মতো কাজকে জোর করে
                বিশেষ্য বানানোর দরকার নেই, <code>POST /api/auth/login</code> স্বাভাবিক।
                বুকিং বাতিলের মতো কাজের দুইটা প্রচলিত উপায়:{" "}
                <code>DELETE /api/bookings/bk_7Q2M9X</code>, অথবা{" "}
                <code>POST /api/bookings/bk_7Q2M9X/cancel</code>। দুইটাই চলে। একটা বেছে নিয়ে
                পুরো API তে সেটাই মানুন, Island Tours বেছেছে প্রথমটা।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Method আর পথ", "কাজ", "সফল হলে", "যা ভুল হতে পারে"],
          rows: [
            [mono("GET /api/tours"), "Tour খোঁজা, তারিখ আর অতিথি Query তে", "200", "400"],
            [mono("GET /api/tours/saint-martin"), "একটা Tour", "200", "404"],
            [mono("GET /api/tours/saint-martin/seats"), "খালি আসন", "200", "404"],
            [mono("POST /api/bookings"), "নতুন বুকিং", "201 + Location", "401, 415, 400, 422, 409"],
            [mono("GET /api/bookings/bk_7Q2M9X"), "একটা বুকিং", "200", "401, 403, 404, 410"],
            [mono("PATCH /api/bookings/bk_7Q2M9X"), "অতিথির সংখ্যা বদলানো", "200", "401, 403, 409, 422"],
            [mono("DELETE /api/bookings/bk_7Q2M9X"), "বাতিল", "204", "401, 403, 404"],
            [mono("POST /api/payments"), "টাকা দেওয়া, Idempotency-Key সহ", "201", "400, 409, 422"],
            [mono("POST /api/auth/login"), "Login", "200", "401, 429"],
            [mono("POST /api/auth/logout"), "Logout", "204", "401"],
            [mono("GET /api/me"), "আমি কে", "200", "401"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "HTML Form জানে শুধু দুইটা Method",
          content: (
            <p>
              JavaScript ছাড়া একটা সাধারণ HTML Form Server এ শুধু GET বা POST পাঠাতে পারে।
              Form এর method এ delete লিখলে Browser সেটা চিনতে না পেরে GET পাঠায়, আর আপনার
              DELETE এর Handler কখনো ডাকই পায় না। তাই JavaScript ছাড়া চলতে হবে এমন পাতায়
              বাতিলের বোতাম সাধারণত POST পাঠায়, যেমন{" "}
              <code>POST /bookings/bk_7Q2M9X/cancel</code>, অথবা Form এর ভেতরে একটা লুকানো{" "}
              <code>_method</code> Field রাখে, যেটা Server পড়ে নিয়ে আসল Method ঠিক করে।{" "}
              <code>fetch</code> দিয়ে পাঠালে এই সীমা নেই।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "status-families",
      subHeader: { index: "007", title: "Status Codes" },
      title: <SectionTitle>Status Code: তিন অঙ্ক, পাঁচ পরিবার</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার উত্তরের দিক। Status Code সবসময় তিন অঙ্কের, 100 থেকে 599 এর মধ্যে, আর তার
              প্রথম অঙ্কটাই আসল খবর। বাকি দুইটা অঙ্ক শুধু খুঁটিনাটি জানায়।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatusFamiliesDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ভাগটা এত জরুরি যে HTTP এর নিয়মে লেখা আছে, একটা Client কে প্রতিটা Code এর
                পরিবার বুঝতেই হবে, আর অচেনা কোনো Code পেলে সেটাকে তার পরিবারের x00 ধরে নিতে
                হবে। ধরুন কোনো Server একদিন 471 পাঠাল, যেটা কেউ চেনে না। আপনার App সেটাকে 400
                এর মতো ধরবে: Request এ কিছু একটা গোলমাল। এই কারণেই নতুন Code এলে পুরনো Client
                ভাঙে না।
              </ContentParagraph>
              <ContentParagraph>
                আপনার নিজের Code এর সিদ্ধান্তও প্রায়ই পরিবার ধরেই হয়। Monitoring এর Dashboard
                5xx এর হার দেখে রাতে Alarm বাজায়, কারণ 5xx মানে দোষ নিজেদের। 4xx এর হার
                সাধারণত ব্যবহারকারীর ভুলের হিসাব, তবে হঠাৎ অনেক 401 বা 429 মানে কেউ হয়তো
                Password আন্দাজ করার চেষ্টা করছে।
              </ContentParagraph>
              <ContentParagraph>
                1xx পরিবারের সাথে আপনার দেখা সবচেয়ে কম। এগুলো অন্তর্বর্তী উত্তর, আসল উত্তরের
                আগে একটা ছোট খবর। একটা Request এর উত্তরে আগে এক বা একাধিক 1xx আসতে পারে, তারপর
                আসল উত্তরটা। তিনটা নাম চিনে রাখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>100 Continue:</strong> বড় একটা Upload এর আগে Client চাইলে{" "}
                  <code>Expect: 100-continue</code> Header দিয়ে আগে শুধু Header গুলো পাঠায়, আর
                  Server 100 বললে তবেই Body পাঠায়। Server যদি আগেই জানে Body টা নেবে না, যেমন
                  Login নেই, তাহলে বিশাল ফাইলটা অনর্থক পাঠাতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>101 Switching Protocols:</strong> Server বলছে, ঠিক আছে, এই Connection
                  এ এখন থেকে HTTP নয়, অন্য Protocol চলবে। WebSocket ঠিক এভাবে শুরু হয়, লেসন ১০
                  এ।
                </ListItem>
                <ListItem>
                  <strong>103 Early Hints:</strong> Server পাতা বানাতে ব্যস্ত, কিন্তু জানে
                  পাতাটার কোন CSS আর Font লাগবে। তাই আসল উত্তরের আগেই একটা 103 পাঠিয়ে বলে দেয়,
                  এগুলো এখনই আনা শুরু করুন। পাতা খোলে একটু দ্রুত।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "success-2xx",
      subHeader: { index: "008", title: "Status Codes" },
      title: <SectionTitle>2xx: যা চেয়েছিলেন, হয়ে গেছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              2xx পরিবারের সবাই একই খবর দেয়, কাজ হয়েছে। তফাত হলো কীভাবে হয়েছে, আর উত্তরে কী
              আছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Code", "নাম", "কখন", "Body"],
          rows: [
            [mono("200"), "OK", "সাধারণ সফলতা, যেমন GET এর উত্তর বা Login", "আছে"],
            [mono("201"), "Created", "নতুন কিছু তৈরি হয়েছে। Location এ তার ঠিকানা", "সাধারণত নতুন জিনিসটা"],
            [mono("202"), "Accepted", "নিয়েছি, পরে করব। কাজটা Queue তে", "কাজের অবস্থা দেখার ঠিকানা"],
            [mono("204"), "No Content", "হয়েছে, বলার কিছু নেই। DELETE, Logout", "নেই, থাকতেই পারে না"],
            [mono("206"), "Partial Content", "পুরোটা নয়, শুধু চাওয়া অংশ। ভিডিও টেনে মাঝখানে যাওয়া", "শুধু সেই অংশ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                202 একটু বিস্তারে বলি, কারণ এটা অনেকে চেনেন না। বুকিং নিশ্চিত হওয়ার পর
                Island Tours পর্যটককে একটা PDF Ticket Email করে। PDF বানাতে আর Email পাঠাতে
                কয়েক সেকেন্ড লাগে, আর Email সেবা মাঝে মাঝে ধীর থাকে। পর্যটককে এতক্ষণ অপেক্ষা
                করানোর মানে নেই। তাই Server কাজটা একটা Queue তে রেখে সাথে সাথে 202 দেয়, আর
                Body তে দেয় একটা ঠিকানা, যেখানে পরে দেখা যাবে Ticket পাঠানো হলো কি না। মনে
                রাখুন, 202 মানে কাজটা সফল হয়েছে, এমন নয়। মানে শুধু এটুকু যে Server কাজটা হাতে
                নিয়েছে।
              </ContentParagraph>
              <ContentParagraph>
                204 এর একটা কড়া নিয়ম আছে: এর কোনো Body থাকতে পারে না। Body পাঠানোর মতো কিছু
                থাকলে 200 দিন। আর 206 আসে Range নামের একটা Header এর উত্তরে, যেটা দিয়ে Client
                বলে, আমাকে এই Byte থেকে ওই Byte পর্যন্ত দিন। ভাঙা Download আবার শুরু করা বা
                ভিডিওর মাঝখানে চলে যাওয়া এভাবেই কাজ করে, Header টার বিস্তারিত লেসন ০৪ এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সবকিছুতে 200, ভেতরে error",
          content: (
            <p>
              নতুন দলগুলোর একটা খুব প্রচলিত অভ্যাস হলো সব উত্তরে 200 পাঠানো, আর Body তে লিখে
              দেওয়া <code>{'{"success": false, "error": "seat taken"}'}</code>। App এর
              Developer এর কাছে মনে হয় সব ঠিক চলছে। কিন্তু পথের বাকি সবাই এখন অন্ধ।
              Monitoring এর Dashboard দেখায় শতভাগ সফল, অথচ অর্ধেক বুকিং ব্যর্থ। Cache একটা
              Error কে সফল উত্তর ভেবে জমিয়ে রাখতে পারে। HTTP Library গুলো ভুল ধরতে পারে না,
              কারণ তারা Status Code দেখেই সিদ্ধান্ত নেয়। আর আবার চেষ্টা করার কোনো নিয়মই কাজ
              করে না। Error হলে Error এর Code পাঠান, বিস্তারিত দিন Body তে। কীভাবে, তা সেকশন
              ০১২ এ।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "redirects-3xx",
      subHeader: { index: "009", title: "Status Codes" },
      title: <SectionTitle>3xx: জিনিসটা অন্য জায়গায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                3xx এর প্রতিটা উত্তরের সাথে একটা Location Header থাকে, যেখানে লেখা নতুন
                ঠিকানা। Browser সেটা পেয়ে নিজে থেকেই নতুন ঠিকানায় দ্বিতীয় একটা Request পাঠায়,
                আপনি টেরও পান না। এই নিজে থেকে যাওয়াকে বলে Redirect মেনে চলা।
              </ContentParagraph>
              <ContentParagraph>
                পাঁচটা Redirect Code আছে, আর তাদের আলাদা করে দুইটা প্রশ্ন। প্রথম প্রশ্ন,
                সরানোটা কি চিরদিনের, নাকি কিছুক্ষণের? চিরদিনের হলে Browser আর Search Engine
                নতুন ঠিকানাটা মনে রাখে, পরেরবার সরাসরি সেখানে যায়। দ্বিতীয় প্রশ্ন, দ্বিতীয়
                Request এ Method আর Body কি একই থাকবে?
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Code", "নাম", "চিরদিনের", "Method আর Body", "প্রচলিত ব্যবহার"],
          rows: [
            [mono("301"), "Moved Permanently", "হ্যাঁ", "POST হয়ে যায় GET", "পাতা স্থায়ীভাবে সরানো, www থেকে মূল Domain"],
            [mono("302"), "Found", "না", "POST হয়ে যায় GET", "কিছুক্ষণের জন্য, Login পাতায় পাঠানো"],
            [mono("303"), "See Other", "না", "সবসময় GET", "Form জমা দেওয়ার পর ফলাফলের পাতা"],
            [mono("307"), "Temporary Redirect", "না", "দুইটাই থাকে", "কিছুক্ষণের জন্য, POST সহ"],
            [mono("308"), "Permanent Redirect", "হ্যাঁ", "দুইটাই থাকে", "http থেকে https, API এর স্থায়ী সরানো"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                301 আর 302 তে POST হয়ে যায় GET, কথাটা একটা ঐতিহাসিক দুর্ঘটনা। পুরনো নিয়মে
                লেখা ছিল Method বদলাবে না। কিন্তু শুরুর দিকের Browser গুলো POST এর পরে 302 পেলে
                নতুন ঠিকানায় GET পাঠাত, আর এত সাইট এই আচরণের উপর নির্ভর করতে শুরু করল যে আর
                বদলানো গেল না। নিয়ম শেষে মেনে নিল যে Browser এখানে POST কে GET বানাতে পারে। আর
                দুইটা উদ্দেশ্য আলাদা করে বলার জন্য এলো নতুন Code: 303, যেখানে GET বানানোটাই
                উদ্দেশ্য, আর 307 ও 308, যেখানে Method বদলানো নিষেধ।
              </ContentParagraph>
              <ContentParagraph>
                কথাটা নিজের যন্ত্রে মিলিয়ে দেখা যায়। নিচের Lab এর Server এ পাঁচটা ঠিকানা আছে
                যারা পাঁচ রকম Redirect দিয়ে <code>/echo</code> তে পাঠায়, আর{" "}
                <code>/echo</code> বলে দেয় তার কাছে কোন Method আর কোন Body পৌঁছাল। প্রতিটায়
                একটা POST পাঠিয়ে curl কে Redirect মেনে চলতে বলা হলো:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "follow-redirects.sh",
          code: `for c in 301 302 303 307 308; do
  printf "%s  " "$c"
  curl -s -L -d 'guests=2' "http://127.0.0.1:47630/r/$c" | tr -d ' \\n'
  echo
done

# 301  {"method":"GET","body":null}
# 302  {"method":"GET","body":null}
# 303  {"method":"GET","body":null}
# 307  {"method":"POST","body":"guests=2"}
# 308  {"method":"POST","body":"guests=2"}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              301, 302 আর 303 এর পরে <code>/echo</code> পেয়েছে GET, Body ছাড়া। 307 আর 308
              এর পরে পেয়েছে POST, Body সহ। curl ও এখানে Browser এর মতোই আচরণ করছে। নিচের Lab
              এ একই জিনিস ছবিতে দেখুন, প্রথম Request বদলে বদলে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RedirectLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>বাস্তবে কোনটা কোথায় লাগে:</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>http থেকে https:</strong> Island Tours এর Caddy Port 80 এ আসা প্রতিটা
                  Request কে https এর একই ঠিকানায় পাঠায়, নিজে থেকেই, 308 দিয়ে। 308 বলে POST ও
                  POST থাকে। লেসন ০৭ এ এর সাথে HSTS যোগ হবে।
                </ListItem>
                <ListItem>
                  <strong>www থেকে মূল Domain:</strong> <code>www.islandtours.example</code> এর
                  সবকিছু চিরদিনের জন্য <code>islandtours.example</code> এ, 301 বা 308 দিয়ে।
                </ListItem>
                <ListItem>
                  <strong>পাতা সরানো:</strong> পুরনো ঠিকানা <code>/tour/saint-martin</code>,
                  নতুনটা <code>/tours/saint-martin</code>। 301, যাতে Search Engine নতুনটা মনে
                  রাখে আর পুরনো Link গুলোও কাজ করে।
                </ListItem>
                <ListItem>
                  <strong>Form এর পরে:</strong> 303, সেকশন ০০৩ এর Post/Redirect/Get।
                </ListItem>
                <ListItem>
                  <strong>Login না থাকলে:</strong> 302 দিয়ে{" "}
                  <code>/login?next=/bookings</code> এ, আর Login শেষে আবার আগের পাতায়।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "চিরদিনের Redirect সত্যিই চিরদিনের",
          content: (
            <p>
              Browser একটা 301 বা 308 অনেকদিন মনে রাখে, অনেক সময় নিজের Cache মুছে না ফেলা
              পর্যন্ত। ভুল করে একটা 301 দিয়ে ফেললে, পরে Server ঠিক করে দিলেও যাদের Browser
              আগের উত্তরটা মনে রেখেছে তারা ভুল জায়গাতেই যেতে থাকবে। তাই নতুন কোনো Redirect
              প্রথমে 302 বা 307 দিয়ে পরীক্ষা করুন, সব ঠিক থাকলে তবেই স্থায়ী Code এ যান।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "ERR_TOO_MANY_REDIRECTS",
          content: (
            <p>
              দুইজন যদি একে অপরকে Redirect করতে থাকে, Browser কিছুক্ষণ ঘুরে হাল ছেড়ে দেয় আর এই
              Error দেখায়। এর সবচেয়ে প্রচলিত কারণ Module 04 এর Cloudflare লেসনে দেখেছেন:
              Cloudflare এর SSL Mode Flexible, তাই Cloudflare Server এর সাথে কথা বলে http তে,
              আর Server নিয়ম মেনে http কে https এ Redirect করে। সেই https আবার Cloudflare এ
              আসে, Cloudflare আবার http তে Server এ যায়, আর ঘোরা চলতেই থাকে। DevTools এর
              Network Tab এ Preserve log চালু রাখলে প্রতিটা ঘোরা আলাদা লাইনে দেখা যায়।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              আর 304 Not Modified ও 3xx পরিবারে বসে, কিন্তু সে আসলে কোথাও পাঠায় না। সে বলে,
              আপনার কাছে যে কপিটা আছে সেটাই এখনো ঠিক, সেটাই ব্যবহার করুন। পুরো গল্পটা Cache
              এর, তাই লেসন ০৪ এ।
            </ContentParagraph>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "client-errors-who",
      subHeader: { index: "010", title: "Status Codes" },
      title: <SectionTitle>4xx, প্রথম ভাগ: আপনি কে, আর কী চাইছেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                4xx মানে Request এ গোলমাল, আর এই পরিবারের সদস্য অনেক। সহজে মনে রাখার জন্য দুই
                ভাগে দেখি। এই সেকশনে সেই Code গুলো, যেখানে Server Request টা পড়তেই পারেনি,
                অথবা আপনাকে চেনে না, অথবা আপনাকে অনুমতি দেয় না, অথবা জিনিসটা এখানে নেই। পরের
                সেকশনে সেগুলো, যেখানে Server সব বুঝেছে কিন্তু কাজটা করতে পারছে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>400 Bad Request।</strong> Request টার গঠনই ভাঙা, Server পড়তেই পারছে
                না। JSON এর মাঝে কমা নেই, একটা Header এর লেখা ভুল ধাঁচে, Query তে তারিখের
                জায়গায় অর্থহীন লেখা। এটা সবচেয়ে সাধারণ 4xx, আর যখন আর কোনো 4xx ঠিক খাপ খায়
                না, তখনও এটাই।
              </ContentParagraph>
              <ContentParagraph>
                <strong>401 Unauthorized।</strong> নামটা বিভ্রান্তিকর। ইংরেজিতে Unauthorized
                শুনলে মনে হয় অনুমতি নেই, কিন্তু 401 এর আসল মানে হলো, আপনি কে আমি জানি না, আগে
                পরিচয় দিন। Token নেই, বা Token এর মেয়াদ শেষ, বা Token টা জাল। নিয়ম অনুযায়ী
                401 এর সাথে একটা <code>WWW-Authenticate</code> Header পাঠাতেই হয়, যাতে বলা থাকে
                কোন উপায়ে পরিচয় দিতে হবে। Login আর Token কীভাবে কাজ করে, তা লেসন ০৬ এ।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "401.sh",
          code: `# Token ছাড়া বুকিং এর চেষ্টা, নিচের Lab এর Server এ
curl -si -X POST http://127.0.0.1:47630/api/bookings \\
  -H "Content-Type: application/json" -d '{}'

# HTTP/1.1 401 Unauthorized
# WWW-Authenticate: Bearer realm="my-tours"
# Content-Type: application/problem+json
# ...
#
# {
#   "type": "about:blank",
#   "title": "Unauthorized",
#   "status": 401,
#   "detail": "Log in first, then send your token"
# }`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              <strong>403 Forbidden।</strong> Server জানে আপনি কে, আর জানে এই কাজের অনুমতি
              আপনার নেই। <code>usr_77</code> Login করা আছেন, কিন্তু <code>usr_42</code> এর
              বুকিং দেখতে চাইছেন। আবার Login করলেও কিছু বদলাবে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "401 আর 403 আলাদা করার এক প্রশ্ন",
          content: (
            <p>
              নিজেকে জিজ্ঞেস করুন: আবার Login করলে কি কাজ হতে পারে? হতে পারলে 401, সমস্যাটা
              পরিচয়ের। কিছুতেই না হলে 403, সমস্যাটা অনুমতির। লেসন ০৬ এ এই দুইটার নাম পাবেন
              Authentication আর Authorization।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>404 Not Found।</strong> এই ঠিকানায় কিছু নেই। ভুল টাইপ করা Slug, মুছে
                যাওয়া জিনিস, অথবা এমন পথ যা কখনো ছিলই না। 404 এর একটা দ্বিতীয় কাজও আছে,
                গোপন রাখা। ধরুন কেউ অন্যের বুকিং এর id আন্দাজ করে করে দেখছেন। 403 দিলে Server
                স্বীকার করে নিল যে এই id এর একটা বুকিং আছে। 404 দিলে কিছুই বলা হলো না। GitHub
                ঠিক এই কারণে অন্যের Private Repository খুলতে গেলে 404 দেখায়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>410 Gone।</strong> জিনিসটা এখানে ছিল, ইচ্ছা করে সরানো হয়েছে, আর ফিরবে
                না। 404 এর চেয়ে স্পষ্ট খবর, তাই Search Engine আর Client বুঝে নেয় আর খোঁজার
                মানে নেই। নিচের Lab এর Server এ একটা বুকিং DELETE করার পরে তার ঠিকানায় আবার
                GET পাঠালে 410 আসে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>405 Method Not Allowed।</strong> ঠিকানাটা আছে, কিন্তু এই Method টা এখানে
                চলে না, যেমন <code>DELETE /api/tours</code>। নিয়ম অনুযায়ী 405 এর সাথে একটা{" "}
                <code>Allow</code> Header পাঠাতে হয়, যেখানে লেখা কোন Method গুলো চলে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "405.sh",
          code: `curl -si -X DELETE http://127.0.0.1:47630/api/tours

# HTTP/1.1 405 Method Not Allowed
# Allow: GET, HEAD, OPTIONS
# Content-Type: application/problem+json
# ...
#
# {
#   "type": "about:blank",
#   "title": "Method Not Allowed",
#   "status": 405,
#   "detail": "DELETE is not allowed on /api/tours"
# }`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              মজার ব্যাপার হলো example.com নিজেই এই নিয়মটা পুরো মানে না। POST পাঠালে সে 405
              দেয় ঠিকই, কিন্তু সাথে Allow পাঠায় না, Allow পাঠায় শুধু GET আর HEAD এর উত্তরে।
              বাস্তবের Server গুলো সব নিয়ম সবসময় মানে না, তাই নিজের Client লেখার সময় কোনো
              Header থাকবেই, এমন ধরে নেবেন না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Code", "মানে", "উদাহরণ", "Client এর করণীয়"],
          rows: [
            [mono("400"), "Request পড়াই যাচ্ছে না", "JSON এ কমা নেই", "Request ঠিক করা"],
            [mono("401"), "আপনি কে জানি না", "Token নেই বা মেয়াদ শেষ", "Login করে আবার"],
            [mono("403"), "চিনি, অনুমতি নেই", "অন্যের বুকিং দেখা", "কিছু করার নেই, বার্তা দেখানো"],
            [mono("404"), "এখানে কিছু নেই", "ভুল Slug", "ঠিকানা ঠিক করা"],
            [mono("410"), "ছিল, আর নেই, ফিরবেও না", "মুছে ফেলা বুকিং", "খোঁজা বন্ধ করা"],
            [mono("405"), "ঠিকানা আছে, Method চলে না", "DELETE /api/tours", "Allow দেখে ঠিক Method"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "client-errors-cant",
      subHeader: { index: "011", title: "Status Codes" },
      title: <SectionTitle>4xx, দ্বিতীয় ভাগ: বুঝেছি, কিন্তু পারছি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>409 Conflict।</strong> Saint Martin এর নৌকায় একটাই আসন বাকি। দুইজন
                পর্যটক প্রায় একই মুহূর্তে বুক করুন চাপলেন। দুইটা Request ই একদম ঠিকঠাক: গঠন
                ঠিক, Token ঠিক, মান ঠিক। কিন্তু দ্বিতীয়টা পৌঁছানোর সময় Server এর অবস্থা বদলে
                গেছে, আসন আর নেই। Request এর সাথে Server এর এখনকার অবস্থার সংঘর্ষ, তাই 409
                Conflict। একই Email দিয়ে দ্বিতীয়বার Account খোলার চেষ্টাও 409।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "409.sh",
          code: `# শেষ আসনটা usr_42 নেওয়ার পরে usr_77 একই আসন চাইলেন
curl -si -X POST http://127.0.0.1:47630/api/bookings \\
  -H "Authorization: Bearer usr_77" -H "Content-Type: application/json" \\
  -d '{"tour":"saint-martin","guests":1}'

# HTTP/1.1 409 Conflict
# Content-Type: application/problem+json
# ...
#
# {
#   "type": "about:blank",
#   "title": "Conflict",
#   "status": 409,
#   "detail": "Only 0 seat(s) left on saint-martin",
#   "seatsLeft": 0
# }`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Body তে <code>seatsLeft: 0</code> রাখা হয়েছে, যাতে App বুঝে পর্যটককে বলতে পারে
                আসন শেষ, আর অন্য তারিখ দেখাতে পারে। আর দুইজনের মধ্যে ঠিক একজনই জিতবেন, এই
                নিশ্চয়তা আসে Database থেকে, যেখানে আসন কমানোর কাজটা এমনভাবে লেখা হয় যে দুইটা
                Request একসাথে একই আসন নিতে পারে না।
              </ContentParagraph>
              <ContentParagraph>
                <strong>412 Precondition Failed।</strong> Island Tours এর দুইজন কর্মী একই সময়ে
                Saint Martin Tour এর দাম বদলাচ্ছেন। দুইজনই পাতা খুলেছিলেন যখন দাম ছিল 8500।
                প্রথমজন করলেন 9000, দ্বিতীয়জন না জেনে করলেন 8800, আর প্রথমজনের বদলটা নিঃশব্দে
                হারিয়ে গেল। এটা আটকানোর উপায় হলো Request এর সাথে একটা শর্ত পাঠানো: আমি যে
                Version টা দেখেছিলাম, জিনিসটা যদি এখনো সেটাই থাকে তবেই বদলটা হবে। এর মধ্যে
                বদলে গিয়ে থাকলে Server বদলটা না করে 412 দেয়, আর দ্বিতীয় কর্মী নতুন দাম দেখে
                আবার সিদ্ধান্ত নেন। শর্তের Header এর নাম If-Match, আর Version এর চিহ্নের নাম
                ETag, দুইটারই পুরো গল্প লেসন ০৪ এ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>413 Content Too Large।</strong> Body এত বড় যে Server নেবে না। পর্যটক
                Passport এর ২০ MB এর ছবি Upload করছেন, অথচ সীমা ৫ MB। মজার দিক হলো এই Code
                প্রায়ই App দেয় না, সামনের Proxy দেয়। Nginx এর নিজের একটা সীমা আছে,{" "}
                <code>client_max_body_size</code>, যার Default মাত্র 1 MB। তাই নিজের ল্যাপটপে
                Upload চলে, Server এ গিয়ে 413। Caddy তে এই সীমা বসানো হয়{" "}
                <code>request_body</code> Directive দিয়ে। নিচের Lab এর Server এর সীমা 10000
                Byte।
              </ContentParagraph>
              <ContentParagraph>
                <strong>415 Unsupported Media Type।</strong> Body টা এমন ধরনে লেখা যা Server
                নেয় না। Server JSON চায়, App পাঠিয়েছে Form এর ধাঁচে{" "}
                <code>tour=saint-martin&amp;guests=1</code>। curl এ <code>-d</code> দিলে curl
                নিজে থেকে Content-Type দেয় <code>application/x-www-form-urlencoded</code>, তাই
                JSON পাঠাতে চাইলে Content-Type নিজে বলে দিতে হয়। এই ভুলটা প্রথম সপ্তাহে প্রায়
                সবাই করেন।
              </ContentParagraph>
              <ContentParagraph>
                <strong>422 Unprocessable Content।</strong> Server Body পড়তে পেরেছে, গঠন ঠিক,
                ধরনও ঠিক, কিন্তু মানগুলো অর্থহীন: <code>guests: -2</code>, অথবা এমন একটা তারিখ
                যা পেরিয়ে গেছে। 400 আর 422 এর সীমা নিয়ে দলে দলে তর্ক হয়, আর অনেক API দুইটার
                জন্যই 400 দেয়। Island Tours এর নিয়ম: পড়তেই না পারলে 400, পড়তে পেরেছে কিন্তু মান
                মানছে না হলে 422। যেকোনো একটা নিয়ম বেছে নিয়ে পুরো API তে সেটা মানাটাই আসল।
              </ContentParagraph>
              <ContentParagraph>
                <strong>429 Too Many Requests।</strong> একই জায়গা থেকে অল্প সময়ে অনেক বেশি
                Request। এর সবচেয়ে বড় কাজ Login পাহারা দেওয়া: কেউ একটার পর একটা Password
                আন্দাজ করছে, তাকে থামাতে হবে। 429 এর সাথে <code>Retry-After</code> Header এ লিখে
                দিন কত সেকেন্ড পরে আবার আসা যাবে। এই ধরনের পাহারার নাম Rate Limiting। নিচের
                Lab এর Server এক মিনিটে তিনবারের বেশি Login এর চেষ্টা নেয় না:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "429.sh",
          code: `for i in 1 2 3 4; do
  curl -s -o /dev/null -w "%{http_code}  Login চেষ্টা $i\\n" \\
    -X POST http://127.0.0.1:47630/api/auth/login -H "Content-Type: application/json" -d '{}'
done
curl -s -D - -o /dev/null -X POST http://127.0.0.1:47630/api/auth/login \\
  -H "Content-Type: application/json" -d '{}' | grep -i retry-after

# 401  Login চেষ্টা 1
# 401  Login চেষ্টা 2
# 401  Login চেষ্টা 3
# 429  Login চেষ্টা 4
# Retry-After: 60`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এখন নিজেকে পরীক্ষা করুন। নিচে বারোটা পরিস্থিতি, প্রতিটায় চারটা Code থেকে ঠিকটা
              বেছে নিন। আগের দুই সেকশনের প্রায় সব Code এখানে আছে, আর কয়েকটা পরের সেকশন থেকেও।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <StatusDecisionLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Code", "মানে", "উদাহরণ", "সাথে যা পাঠাবেন"],
          rows: [
            [mono("409"), "Server এর এখনকার অবস্থার সাথে সংঘর্ষ", "শেষ আসন আরেকজন নিয়েছেন", "নতুন অবস্থা, যেমন seatsLeft"],
            [mono("412"), "শর্ত মিলল না", "দাম এর মধ্যে বদলে গেছে", "নতুন ETag"],
            [mono("413"), "Body বেশি বড়", "২০ MB এর ছবি", "সীমাটা কত"],
            [mono("415"), "Body র ধরন অচেনা", "JSON এর জায়গায় Form", "কোন ধরন চলে"],
            [mono("422"), "পড়া গেছে, মান অর্থহীন", "guests: -2", "কোন Field এ কী ভুল"],
            [mono("429"), "অনেক বেশি Request", "ষষ্ঠবার Login", "Retry-After"],
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "server-errors",
      subHeader: { index: "012", title: "Status Codes" },
      title: <SectionTitle>5xx, আর ভুলের উত্তরে কী লিখবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              5xx মানে Request টা ঠিক ছিল, Server পারেনি। দোষ নিজেদের, আর এই Code গুলো দেখলেই
              দলের কাউকে না কাউকে নড়েচড়ে বসতে হয়। চারটা Code চিনলেই প্রায় সব ঘটনা ধরা যায়,
              আর তাদের সবচেয়ে কাজের দিক হলো Code টা কে লিখেছে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <GatewayErrorsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>500 Internal Server Error:</strong> App এর ভেতরে এমন কোনো Error, যা
                Code ধরে সামলায়নি। undefined এর একটা Property পড়া, Database এর একটা
                অপ্রত্যাশিত উত্তর। App এর একদম বাইরের স্তরে একটা পাহারা থাকা উচিত, যা এমন
                যেকোনো Error ধরে 500 পাঠায় আর ভেতরের বিস্তারিত Log এ লেখে। পাহারা না থাকলে
                Node এর পুরো Process টাই পড়ে যেতে পারে, আর তখন পরের সবাই পাবেন 502।
              </ListItem>
              <ListItem>
                <strong>502 Bad Gateway:</strong> এটা App লেখেনি। লিখেছে মাঝের Proxy, Island
                Tours এ Caddy। Caddy Request টা App এর কাছে পাঠাতে গিয়ে ঠিকঠাক উত্তর পায়নি: App
                বন্ধ বলে Connection Refused, App মাঝপথে Crash করেছে, অথবা Module 05 এর শেষ
                লেসনের সেই ঘটনা, App ঠিক তখনই একটা পুরনো Keep-Alive Connection বন্ধ করছিল যখন
                Caddy তাতে Request পাঠাল।
              </ListItem>
              <ListItem>
                <strong>503 Service Unavailable:</strong> এখন পারব না, একটু পরে আসুন। এটা একটা
                ইচ্ছাকৃত উত্তর: Database এর বড় বদলের জন্য কিছুক্ষণের বিরতি, অথবা এত ভিড় যে নতুন
                Request নেওয়া নিরাপদ নয়, অথবা App সবে চালু হয়েছে আর এখনো তৈরি নয়। সাথে{" "}
                <code>Retry-After</code> দিলে ভদ্র Client রা সেই সময় পর্যন্ত অপেক্ষা করে। আর
                Load Balancer এর Health Check একটা Server এর কাছ থেকে 503 পেলে সেই Server এ নতুন
                Request পাঠানো থামিয়ে দেয়।
              </ListItem>
              <ListItem>
                <strong>504 Gateway Timeout:</strong> এটাও Proxy র লেখা। Caddy Request টা App কে
                দিয়েছে, কিন্তু নির্দিষ্ট সময়ের মধ্যে কোনো উত্তর আসেনি, হয়তো App একটা ধীর
                Database Query তে আটকে আছে। এখানে একটা ভয়ের কথা: Proxy হাল ছেড়ে দিয়েছে মানে
                App হাল ছেড়ে দিয়েছে, এমন নয়। App হয়তো আরও দশ সেকেন্ড পরে বুকিংটা ঠিকই করে
                ফেলবে, কিন্তু পর্যটক ততক্ষণে 504 দেখে ফেলেছেন। এই বিপদের সমাধান পরের সেকশনে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              কে লিখল, কীভাবে বুঝবেন? উত্তরের <code>Server</code> Header আর Body র চেহারা দেখুন।
              App এর নিজের Error এ Body টা আপনার API এর চেনা ধাঁচে, যেমন JSON। Proxy র Error
              এ Body টা Proxy র নিজের ধাঁচে, প্রায়ই একটা সাধারণ HTML পাতা, ছোট একটা লেখা, বা
              একদম খালি। নিচের Lab এর খেলনা Gateway টা ইচ্ছা করেই নিজের নাম Server Header এ
              লিখে দেয়। পেছনের App বন্ধ থাকলে উত্তরটা এমন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "502-from-the-gateway.sh",
          code: `curl -si http://127.0.0.1:47631/api/tours

# HTTP/1.1 502 Bad Gateway
# Content-Type: text/plain
# Server: toy-gateway
# ...
#
# 502 Bad Gateway (from the gateway, not from the app)

# আর Gateway এর নিজের Terminal এ লেখা হয় কেন:
# GET /api/tours -> 502, ECONNREFUSED`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার দ্বিতীয় প্রশ্ন: 4xx বা 5xx পাঠানোর সময় Body তে কী লিখবেন? Status Code বলে
                কোন পরিবারের ভুল, কিন্তু App কে পর্যটককে কী দেখাতে হবে তা জানার জন্য আরও একটু
                তথ্য লাগে। প্রতিটা API নিজের মতো ধাঁচ বানালে প্রতিটা Client কে আলাদা আলাদা করে
                শিখতে হয়। তাই এর জন্যও একটা ভাগ করা নিয়ম আছে, RFC 9457, যার নাম Problem Details।
                Content-Type হয় <code>application/problem+json</code>, আর Body তে থাকে কয়েকটা
                নির্দিষ্ট Field।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>type</code>: ভুলের ধরন বোঝানো একটা URI। আলাদা কোনো ধরন না থাকলে{" "}
                  <code>about:blank</code>।
                </ListItem>
                <ListItem>
                  <code>title</code>: ছোট একটা শিরোনাম, মানুষের পড়ার জন্য।
                </ListItem>
                <ListItem>
                  <code>status</code>: Status Code টাই আবার, যাতে Body একা পড়লেও বোঝা যায়।
                </ListItem>
                <ListItem>
                  <code>detail</code>: এই নির্দিষ্ট ঘটনাটার বিস্তারিত।
                </ListItem>
                <ListItem>
                  <code>instance</code>: এই ঘটনার একটা পরিচয়, যেমন কোন ঠিকানায় ঘটল।
                </ListItem>
                <ListItem>
                  আর নিজের দরকারি যেকোনো Field, যেমন <code>seatsLeft</code>।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এর একটা আসল ধাঁচের 409 দেখতে এরকম। Lab এর Server টা এর ছোট রূপ
                পাঠায়, <code>type</code> হিসেবে শুধু <code>about:blank</code> দিয়ে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "island-tours-409.http",
          code: `HTTP/1.1 409 Conflict
Content-Type: application/problem+json
X-Request-Id: 7f3a9c2e

{
  "type": "https://islandtours.example/problems/seat-taken",
  "title": "Seat no longer available",
  "status": 409,
  "detail": "The last seat on saint-martin for 2026-12-20 was booked a moment ago.",
  "instance": "/api/bookings",
  "seatsLeft": 0
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "ভেতরের খবর বাইরে নয়",
          content: (
            <p>
              500 এর Body তে কখনো Stack Trace, SQL Query, File এর Path বা Library এর Version
              দেবেন না। এগুলো আক্রমণকারীর জন্য মানচিত্র। পর্যটকের দরকার শুধু এটুকু জানা যে
              সমস্যাটা আমাদের, আর একটা পরিচয় নম্বর, যেমন <code>X-Request-Id</code>, যেটা দিয়ে
              Support এর কেউ Log এ গিয়ে আসল ঘটনা খুঁজে পান। নিচের Lab এর Server ঠিক এটাই করে:
              Terminal এর Log এ লেখা হয় <code>a bug the team has not found yet</code>, আর Client
              পায় শুধু <code>Something went wrong on our side</code>। X-Request-Id এর পুরো
              গল্প লেসন ০৪ এ।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "retries",
      subHeader: { index: "013", title: "Core Idea" },
      title: <SectionTitle>আবার পাঠাবেন কি না, আর Idempotency-Key</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 এর শেষ লেসনের শেষ কথাটা মনে করুন: Connection ভেঙে গেলে আপনি শুধু
                জানেন উত্তরটা আসেনি। Request টা পৌঁছেছিল কি না, কাজটা হয়েছিল কি না, জানেন না।
                এই লেসনের সব অংশ এবার এক জায়গায় আসে, কারণ আবার পাঠাবেন কি না, সেই সিদ্ধান্ত
                নির্ভর করে দুইটা জিনিসের উপর: Method টা কী, আর কী ফেরত এলো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>4xx, 429 বাদে:</strong> হুবহু আবার পাঠাবেন না। দোষ Request এর, আবার
                  পাঠালে একই উত্তর আসবে। আগে Request ঠিক করুন।
                </ListItem>
                <ListItem>
                  <strong>429 আর 503, সাথে Retry-After:</strong> Server নিজেই সময় বলে দিয়েছে।
                  সেই সময় পার করে আবার পাঠান।
                </ListItem>
                <ListItem>
                  <strong>কোনো উত্তর নেই, ECONNRESET, 502, 504, এমনকি অনেক 500:</strong> কাজটা
                  হয়েছে কি না অজানা। Method Idempotent হলে আবার পাঠান। না হলে অন্ধভাবে নয়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আবার পাঠানোরও একটা ভদ্রতা আছে। সাথে সাথে আবার পাঠালে, আর সবাই একসাথে আবার
                পাঠালে, একটা অসুস্থ Server এর উপর চাপ আরও বাড়ে। প্রচলিত নিয়ম হলো প্রতিবার
                অপেক্ষা দ্বিগুণ করা, যেমন ১ সেকেন্ড, ২ সেকেন্ড, ৪ সেকেন্ড, যাকে বলে Exponential
                Backoff। তার সাথে প্রতিবার একটু এলোমেলো সময় যোগ করা হয়, যাকে বলে Jitter, যাতে
                হাজারটা ফোন একই মুহূর্তে ফিরে না আসে। আর কয়েকবারের পর থামতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <RetryDecisionLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Lab এ সবচেয়ে বিপজ্জনক ঘরটা নিশ্চয়ই চোখে পড়েছে: POST, আর উত্তর আসেনি। Payment
              এর মতো কাজে এটা সবচেয়ে বেশি ঘটে, আর সবচেয়ে দামি। পর্যটক Pay চাপলেন, ফোনের
              Network দুর্বল, ত্রিশ সেকেন্ড কিছু নেই। আবার পাঠালে হয়তো দুইবার টাকা কাটবে, না
              পাঠালে হয়তো বুকিংটা হবেই না। সমাধান হলো POST কে Idempotent বানিয়ে নেওয়া, একটা
              Header দিয়ে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <IdempotencyKeyDiagram /> },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "একটা কাজের জন্য একটা Key",
              description:
                "পর্যটক Pay চাপার মুহূর্তে App একটা নতুন এলোমেলো Key বানায়, সাধারণত একটা UUID। এই Key একটা কাজের, একটা চেষ্টার নয়।",
            },
            {
              title: "প্রতিটা চেষ্টায় একই Key",
              description:
                "প্রথম চেষ্টা আর পরের সবগুলোতে একই Key যায় Idempotency-Key Header এ। Body ও হুবহু একই থাকে।",
            },
            {
              title: "Server প্রথমবার কাজ করে আর লিখে রাখে",
              description:
                "Key টা নতুন হলে Server কাজটা করে, আর Key এর পাশে Request এর একটা ছাপ আর উত্তরটা খাতায় লিখে রাখে, একটা নির্দিষ্ট সময়ের জন্য।",
            },
            {
              title: "একই Key আবার এলে পুরনো উত্তর",
              description:
                "Server কাজটা আর করে না। খাতা থেকে আগের উত্তরটাই ফেরত দেয়, টাকা আর কাটে না।",
            },
            {
              title: "একই Key, অন্য Body, অথবা আগেরটা এখনো চলছে",
              description:
                "একই Key এর সাথে অন্য টাকার অঙ্ক এলে Server বোঝে কিছু গোলমাল আছে আর 422 দেয়। প্রথম চেষ্টাটা এখনো চলতে থাকা অবস্থায় একই Key এলে 409।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Stripe এর মতো Payment সেবা অনেক বছর ধরে ঠিক এই নামের Header ব্যবহার করে, আর IETF
              এ এটাকে সবার জন্য একটা নিয়ম বানানোর খসড়া চলছে, যেটা ২০২৬ এ এসেও এখনো RFC হয়নি।
              ওপরের ৪২২ আর ৪০৯ এর নিয়ম দুইটাও সেই খসড়া থেকে। নিয়ম পাকা না হলেও অভ্যাসটা
              সবখানে চলে। নিচের Lab এর Server এ নিজে চালিয়ে দেখুন:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "idempotency-key.sh",
          code: `BODY='{"booking":"bk_7Q2M9X","amountBdt":8500}'

# Key ছাড়া, একই Payment দুইবার
curl -s -X POST http://127.0.0.1:47630/api/payments -H "Content-Type: application/json" -d "$BODY"
curl -s -X POST http://127.0.0.1:47630/api/payments -H "Content-Type: application/json" -d "$BODY"
# {"chargeId":"ch_1","totalChargesSoFar":1}
# {"chargeId":"ch_2","totalChargesSoFar":2}     দুইবার টাকা কাটা

# একটা Key বানিয়ে, একই Key দিয়ে দুইবার
KEY=$(node -e 'console.log(crypto.randomUUID())')
curl -s -X POST http://127.0.0.1:47630/api/payments -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $KEY" -d "$BODY"
curl -si -X POST http://127.0.0.1:47630/api/payments -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $KEY" -d "$BODY"
# {"chargeId":"ch_3","totalChargesSoFar":3}
# HTTP/1.1 201 Created
# Idempotent-Replayed: true
# ... "chargeId": "ch_3" ...                     একই উত্তর, নতুন টাকা কাটা নেই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Key এর তিনটা প্রচলিত ভুল",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                প্রতিটা চেষ্টায় নতুন Key বানানো। তাহলে Server প্রতিটাকে নতুন কাজ ভাবে, আর পুরো
                আয়োজনটা অর্থহীন।
              </li>
              <li>
                Key এর খাতা শুধু একটা Server এর Memory তে রাখা। দ্বিতীয় চেষ্টা অন্য Server এ
                গেলে সে খাতাটা দেখে না। খাতা রাখতে হয় সবার ভাগ করা জায়গায়, যেমন Redis বা
                Database এ।
              </li>
              <li>
                Key কে ইউজারের সাথে না বাঁধা। তাহলে একজনের Key আন্দাজ করে আরেকজন অন্যের উত্তর
                দেখে ফেলতে পারেন। Key খোঁজার সময় সবসময় ইউজার আর Key দুইটা মিলিয়ে খুঁজুন।
              </li>
            </ul>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে দেখা: curl আর DevTools</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার যন্ত্রগুলো হাতে নিন। এই লেসনের সব কিছু দুইটা জায়গায় দেখা যায়, Terminal এ
              curl দিয়ে আর Browser এর DevTools এ। প্রথমে curl এর সেই Option গুলো, যা এই লেসনে
              বারবার লাগছে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Option", "কী করে", "উদাহরণ"],
          rows: [
            [mono("-X"), "কোন Method পাঠাবে, তা ঠিক করে", "-X DELETE"],
            [mono("-i"), "উত্তরের Header গুলো সহ দেখায়", "curl -i ..."],
            [mono("-I"), "HEAD পাঠায়, শুধু Header দেখায়", "curl -I https://example.com"],
            [mono("-v"), "পুরো কথোপকথন দেখায়: পাঠানো লাইন > দিয়ে, আসা লাইন < দিয়ে", "curl -v ..."],
            [mono("-L"), "Redirect পেলে নতুন ঠিকানায় যায়", "curl -L ..."],
            [mono("-d"), "Body পাঠায়, আর Method নিজে থেকে POST করে দেয়", "-d '{\"guests\":2}'"],
            [mono("-H"), "একটা Header যোগ করে", "-H 'Content-Type: application/json'"],
            [mono("-s -o /dev/null -w '%{http_code}'"), "Body ফেলে দিয়ে শুধু Status Code লেখে", "দ্রুত পরীক্ষার জন্য"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "-X POST আর -d এক জিনিস নয়",
          content: (
            <p>
              <code>-d</code> দিলে curl নিজেই POST পাঠায়, আলাদা করে <code>-X POST</code> লাগে
              না। আর <code>-X</code> দিয়ে Method জোর করে বসালে curl Redirect এর পরেও সেই
              Method ই পাঠায়, 301 বা 302 এর পরেও। সেকশন ০০৯ এর পরীক্ষা তাই শুধু{" "}
              <code>-d</code> দিয়ে করা হয়েছে, যাতে curl Browser এর মতো আচরণ করে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার একটা সত্যিকারের Server এ আটটা Method পাঠিয়ে দেখি। example.com এমন একটা
              সাইট, যা শুধু উদাহরণ দেওয়ার জন্যই রাখা:
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "every-method-on-example-com.sh",
          code: `for m in GET HEAD OPTIONS POST PUT PATCH DELETE TRACE; do
  if [ "$m" = HEAD ]; then
    curl -s -o /dev/null -I -w "$m  %{http_code}  %{size_download} bytes\\n" https://example.com
  else
    curl -s -o /dev/null -X "$m" -w "$m  %{http_code}  %{size_download} bytes\\n" https://example.com
  fi
done

# GET  200  577 bytes
# HEAD  200  0 bytes
# OPTIONS  405  558 bytes
# POST  405  558 bytes
# PUT  405  558 bytes
# PATCH  405  558 bytes
# DELETE  405  558 bytes
# TRACE  405  155 bytes`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                GET এ 200 আর 577 Byte এর একটা পাতা। HEAD এ 200, কিন্তু শূন্য Byte, ঠিক যেমন
                হওয়ার কথা। বাকি সবগুলোতে 405, কারণ এটা শুধু দেখার জন্য একটা সাইট, এখানে কিছু
                তৈরি বা বদলানোর ব্যবস্থাই নেই। আপনার যন্ত্রে Byte এর সংখ্যা আলাদা হতে পারে,
                কারণ সাইটটা মাঝে মাঝে বদলায়, কিন্তু Code গুলো একই থাকবে।
              </ContentParagraph>
              <ContentParagraph>
                এবার Browser। আপনার যেকোনো প্রিয় সাইটে এই পাঁচটা কাজ একবার করে দেখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Chrome এ F12 চাপুন, Mac এ Cmd, Option আর I একসাথে, তারপর Network Tab খুলুন।
                </ListItem>
                <ListItem>
                  Column গুলোর শিরোনামে Right-click করে Method Column টা চালু করুন। Status Column
                  আগে থেকেই থাকে।
                </ListItem>
                <ListItem>
                  উপরের Filter বাক্সে <code>method:POST</code> লিখলে শুধু POST গুলো দেখাবে, আর{" "}
                  <code>status-code:404</code> লিখলে শুধু 404 গুলো। <code>status-code:200</code>{" "}
                  লিখে পাশের Invert চালু করলে দেখাবে 200 ছাড়া বাকি সব, ভাঙা Request খুঁজতে এটা
                  সবচেয়ে কাজের।
                </ListItem>
                <ListItem>
                  Preserve log চালু রাখুন। নইলে Redirect হয়ে নতুন পাতায় গেলে আগের পাতার Request
                  গুলো মুছে যায়, আর 301 বা 303 এর লাইনটা আপনি দেখতেই পান না।
                </ListItem>
                <ListItem>
                  যেকোনো Request এ Right-click করে Copy, তারপর Copy as cURL। পুরো Request টা,
                  সব Header সহ, একটা curl কমান্ড হয়ে Clipboard এ চলে আসে। Terminal এ চালালে
                  হুবহু সেই Request টা আবার যায়। Browser এর একটা ভুল Terminal এ ধরে ঘাঁটার
                  সবচেয়ে সহজ রাস্তা এটা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Copy as cURL এর সাথে আপনার পরিচয়ও আসে",
          content: (
            <p>
              Copy as cURL এর কমান্ডে আপনার Cookie আর Token ও চলে আসে, কারণ সেগুলোও Request এর
              অংশ। সেই কমান্ড কোথাও Paste করে কাউকে পাঠানোর আগে Cookie আর Authorization এর
              অংশগুলো মুছে দিন। নইলে যিনি পাবেন, তিনি কিছুক্ষণের জন্য আপনি হয়ে যেতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, শেষ আসন আর একটা ব্যস্ত সন্ধ্যা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ডিসেম্বরের ছুটির আগে Island Tours এর সবচেয়ে ব্যস্ত সন্ধ্যা। Saint Martin এর
                নৌকার আসন মিনিটে মিনিটে কমছে, অনেক পর্যটকের ফোনের Network দুর্বল, আর ঠিক এই
                সন্ধ্যাতেই দলকে একটা জরুরি Deploy করতে হবে। এই লেসনের প্রতিটা সিদ্ধান্ত এমন
                একটা সন্ধ্যার জন্যই নেওয়া। Island Tours এর API Method আর Status Code নিয়ে যে
                সাতটা নিয়ম মানে, সেগুলো দেখি।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথে বিশেষ্য, Method এ ক্রিয়া।</strong> API টা সেকশন ০০৬ এর মানচিত্রের
                  মতোই। কোনো GET কখনো কিছু বদলায় না, তাই Email এর Link যাচাইকারী বা Chat App এর
                  Preview কখনো কারো বুকিং ছোঁয় না।
                </ListItem>
                <ListItem>
                  <strong>শেষ আসনের লড়াইয়ে 409।</strong> Database এ আসন কমানোর কাজটা এমনভাবে
                  লেখা যে দুইজন একসাথে একই আসন নিতে পারেন না। হেরে যাওয়া Request পায় 409, আর
                  Problem Details এর Body তে <code>seatsLeft: 0</code>। App পর্দায় লেখে, আসনটা
                  এইমাত্র অন্য কেউ নিয়েছেন, আর পাশের তারিখগুলো দেখায়। 500 নয়, কারণ কিছু ভাঙেনি।
                  400 নয়, কারণ পর্যটকের কোনো ভুল নেই।
                </ListItem>
                <ListItem>
                  <strong>Payment এ Idempotency-Key।</strong> Pay চাপার মুহূর্তে App Key বানায়,
                  আর প্রতিটা চেষ্টায় সেটাই পাঠায়। Key এর খাতা থাকে Redis এ, যাতে দ্বিতীয়
                  চেষ্টা যেকোনো App Container এ গেলেও খাতাটা পাওয়া যায়। খাতায় কতক্ষণ রাখা
                  হবে, তা আসে <code>IDEMPOTENCY_TTL_SECONDS</code> নামের Environment Variable
                  থেকে। এটা চালুর পর দুইবার টাকা কাটার অভিযোগ বন্ধ হয়ে গেছে।
                </ListItem>
                <ListItem>
                  <strong>Website এর Form এর পরে 303।</strong> JavaScript ছাড়া চলা বুকিং এর Form
                  জমা হলে Server 303 দিয়ে নিশ্চিতকরণের পাতায় পাঠায়। পর্যটক Refresh চাপলে আর
                  দ্বিতীয় বুকিং হয় না।
                </ListItem>
                <ListItem>
                  <strong>Login এ 429।</strong> একই Account এ অল্প সময়ে কয়েকবার ভুল Password
                  হলে 429, সাথে Retry-After। কয়বার আর কত সময়, দুইটাই Environment Variable থেকে
                  আসে, Code এ লেখা কোনো সংখ্যা থেকে নয়, যাতে আক্রমণের দিনে Deploy ছাড়াই কড়া করা
                  যায়।
                </ListItem>
                <ListItem>
                  <strong>Deploy আর Maintenance এ 503।</strong> Database এর বড় বদলের সময় Caddy
                  নিজেই 503 আর Retry-After দেয়। আর নতুন চালু হওয়া App টা পুরো তৈরি না হওয়া
                  পর্যন্ত তার Health Check এ 503 বলে, তাই অর্ধেক চালু একটা App এ কোনো পর্যটকের
                  Request যায় না।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা Error এ Problem Details আর X-Request-Id।</strong> পর্যটক
                  Support এ শুধু পর্দার ছোট কোডটা বললেই দলের কেউ Log এ গিয়ে পুরো ঘটনা খুঁজে পান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর Monitoring? Dashboard এ সবচেয়ে বড় করে রাখা আছে 5xx এর হার, Caddy আর App আলাদা
                করে। App এর 500 বাড়লে মানে Code এ Bug। Caddy র 502 বাড়লে মানে App বারবার পড়ে
                যাচ্ছে, বা Keep-Alive এর হিসাব গোলমাল। আর 504 বাড়লে প্রথম সন্দেহ ধীর Database।
                Code এর পরিবার আর সেটা কে লিখেছে, এই দুইটা মিলিয়েই রাতের তদন্তের অর্ধেক শেষ।
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
      title: <SectionTitle>একটা বুকিং, বোতাম থেকে 201 পর্যন্ত</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক বুক করুন চাপলেন। এখান থেকে উত্তর ফেরা পর্যন্ত Method আর Status Code এর
              দিক থেকে কী কী ঘটে, আর প্রতিটা ধাপে কী ভুল হতে পারত, শুরু থেকে শেষ পর্যন্ত।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "App Request বানায়",
              description:
                "POST /api/bookings, Body তে tour আর guests, Content-Type: application/json, আর Authorization এ পর্যটকের Token। Method POST, কারণ একটা নতুন জিনিস তৈরি হবে আর তার id বেছে নেবে Server।",
            },
            {
              title: "Caddy Request টা নেয়",
              description:
                "TLS খুলে (লেসন ০৭) Caddy Request টা 127.0.0.1:3000 এর App কে দেয়। App বন্ধ থাকলে এখানেই থামে, Caddy নিজে লেখে 502। Body টা Caddy র সীমার চেয়ে বড় হলে Caddy নিজেই 413 দেয়।",
            },
            {
              title: "App Method আর পথ পড়ে",
              description:
                "এই দুইটা মিলিয়ে App ঠিক করে কোন Function চলবে। ঠিকানাটা আছে কিন্তু Method ভুল হলে 405, সাথে Allow। ঠিকানাই না থাকলে 404।",
            },
            {
              title: "পরিচয় দেখা",
              description:
                "Token নেই বা মেয়াদ শেষ হলে 401, সাথে WWW-Authenticate। App পর্যটককে Login পাতায় পাঠায়।",
            },
            {
              title: "Body পড়া",
              description:
                "Content-Type JSON না হলে 415। JSON টা ভাঙা হলে 400।",
            },
            {
              title: "মান যাচাই",
              description:
                "Tour টা আছে কি না, guests 1 থেকে 10 এর মধ্যে কি না, তারিখ পেরিয়ে গেছে কি না। কোনোটা না মিললে 422, Body তে কোন Field এ কী ভুল।",
            },
            {
              title: "আসন ধরে রাখা",
              description:
                "Database এ আসন কমানোর কাজটা চলে। আসন আর না থাকলে 409, seatsLeft: 0 সহ। এখানে কোনো অজানা Error ঘটলে বাইরের পাহারা ধরে 500 পাঠায়, বিস্তারিত যায় Log এ।",
            },
            {
              title: "সফল, 201",
              description:
                "নতুন বুকিং bk_7Q2M9X তৈরি। উত্তর 201 Created, Location: /api/bookings/bk_7Q2M9X, Body তে বুকিং। App নিশ্চিতকরণের পর্দা দেখায়।",
            },
            {
              title: "Payment, Key সহ",
              description:
                "এবার POST /api/payments, নতুন একটা Idempotency-Key সহ। উত্তর এলে 201। উত্তর না এলে App একই Key দিয়ে আবার পাঠায়, প্রতিবার একটু বেশি অপেক্ষা করে।",
            },
            {
              title: "উত্তর হারালে কী",
              description:
                "বুকিং এর POST এর উত্তরে যদি 504 আসে, বা কিছুই না আসে, App অন্ধভাবে আবার POST করে না। আগে GET /api/bookings দিয়ে দেখে বুকিংটা তৈরি হয়েছে কি না, তারপর সিদ্ধান্ত নেয়।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা পরীক্ষায় প্রায় সব Method আর
                প্রায় সব গুরুত্বপূর্ণ Code নিজের যন্ত্রে ঘটিয়ে দেখবেন, 502 আর 504 সহ। এর কোনো
                ভিডিও বিকল্প নেই।
              </ListItem>
              <ListItem>
                <strong>RFC 9110, HTTP Semantics</strong>, Method আর Status Code এর আসল নিয়মের
                কাগজ। Section 9 এ Method, Section 15 এ সব Status Code। পুরোটা পড়ার দরকার নেই,
                কোনো Code নিয়ে সন্দেহ হলে সেই অংশটা খুলুন।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9110
                </a>
              </ListItem>
              <ListItem>
                <strong>MDN এর Method আর Status Code এর পাতা</strong>, প্রতিটার জন্য আলাদা পাতা,
                উদাহরণ সহ, আর কোন Browser কী মানে তার তালিকা।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Methods
                </a>
                {" আর "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Status
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 9457, Problem Details</strong>, ভুলের উত্তরের Body র ভাগ করা নিয়ম।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc9457"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  rfc-editor.org/rfc/rfc9457
                </a>
              </ListItem>
              <ListItem>
                <strong>Idempotency-Key এর খসড়া</strong>, IETF এর পাতা, যেখানে খসড়াটার এখনকার
                অবস্থাও লেখা থাকে।{" "}
                <a
                  href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  datatracker.ietf.org
                </a>
              </ListItem>
              <ListItem>
                <strong>curl এর Manual</strong>, এই লেসনের প্রতিটা Option এর সঠিক আচরণ, Redirect
                এর পরে Method বদলানো সহ।{" "}
                <a
                  href="https://curl.se/docs/manpage.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  curl.se/docs/manpage.html
                </a>
              </ListItem>
              <ListItem>
                <strong>Chrome DevTools এর Network Reference</strong>, Filter এর সব শব্দ,
                Preserve log আর Copy as cURL এর বিস্তারিত।{" "}
                <a
                  href="https://developer.chrome.com/docs/devtools/network/reference"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  developer.chrome.com
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
                  Request এর প্রথম শব্দ Method, কী করতে চাই। Response এর প্রথম তিন অঙ্ক Status
                  Code, কী হলো। URL এ জিনিস, Method এ কাজ।
                </ListItem>
                <ListItem>
                  এই দুইটা একটা প্রকাশ্য চুক্তি। Browser, Cache, Proxy, Crawler আর Monitoring
                  আপনার Code না জেনেই এগুলো পড়ে সিদ্ধান্ত নেয়।
                </ListItem>
                <ListItem>
                  GET আর HEAD শুধু পড়ে, Safe। POST কিছু করে, কোনো প্রতিশ্রুতি দেয় না। PUT পুরোটা
                  বদলায়, PATCH শুধু অংশ, DELETE সরায়।
                </ListItem>
                <ListItem>
                  Idempotent মানে একবার আর বারবার পাঠানোর ফল Server এর উপর এক: GET, HEAD,
                  OPTIONS, PUT, DELETE। উত্তর বদলাতে পারে, অবস্থা নয়।
                </ListItem>
                <ListItem>
                  Status Code এর প্রথম অঙ্ক পরিবার: 1xx খবর, 2xx সফল, 3xx অন্য জায়গায়, 4xx
                  Request এর দোষ, 5xx Server এর দোষ।
                </ListItem>
                <ListItem>
                  301 আর 302 তে POST হয়ে যায় GET, 303 তে সবসময় GET, 307 আর 308 তে Method আর Body
                  দুইটাই থাকে। চিরদিনের Redirect সাবধানে।
                </ListItem>
                <ListItem>
                  401 পরিচয়, 403 অনুমতি, 404 নেই, 409 সংঘর্ষ, 422 অর্থহীন মান, 429 অনেক বেশি।
                </ListItem>
                <ListItem>
                  500 আর 503 লেখে App, 502 আর 504 লেখে মাঝের Proxy। 504 মানে কাজটা হয়নি, এমন নয়।
                </ListItem>
                <ListItem>
                  ভুলের উত্তরে সঠিক Code আর Problem Details এর Body, ভেতরের খবর কখনো নয়।
                </ListItem>
                <ListItem>
                  উত্তর না এলে Idempotent Request আবার পাঠানো যায়। POST কে নিরাপদ করে
                  Idempotency-Key, একটা কাজের জন্য একটা Key।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৪, HTTP Headers",
          content: (
            <p>
              পুরো লেসনে একটা কথা বারবার এসেছে, এই Header টার বিস্তারিত লেসন ০৪ এ। Location,
              Allow, Retry-After, WWW-Authenticate, Content-Type, Idempotency-Key, X-Request-Id,
              সবাই Header। Method আর Status Code বলে কী চাই আর কী হলো, আর Header গুলো বলে
              বাকি সব কিছু: Body টা কোন ভাষায়, উত্তরটা কতক্ষণ জমিয়ে রাখা চলে, অন্য সাইট থেকে
              এই API ডাকা যাবে কি না। পরের লেসনে বার্তার সেই অংশটাই পুরো খুলব: Content-Type,
              Cache-Control, আর সেই বিখ্যাত CORS Error, যা প্রায় সবাইকে একদিন না একদিন থামিয়ে
              দেয়।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Method", "Request এর প্রথম শব্দ, কী করতে চাই। বড় হাতের অক্ষরে, Case-sensitive"],
      ["Status Code", "Response এর তিন অঙ্ক, কী হলো। প্রথম অঙ্কটা পরিবার"],
      ["GET", "জিনিসটা দিন। Safe, Idempotent, Cacheable। Body নয়, শর্ত Query তে"],
      ["HEAD", "GET এর Header, Body ছাড়া। আকার আর অস্তিত্ব যাচাই"],
      ["POST", "এটা নিন, কিছু করুন। কোনো প্রতিশ্রুতি নেই, দুইবার মানে দুইবার কাজ"],
      ["PUT", "এই ঠিকানায় পুরোটা এটা। Idempotent, যা পাঠাননি তা মুছে যায়"],
      ["PATCH", "শুধু এই অংশ বদলান। Idempotent হওয়ার নিশ্চয়তা নেই"],
      ["DELETE", "সরিয়ে দিন। Idempotent, দ্বিতীয়বার 404 বা 410 এলেও"],
      ["OPTIONS", "এখানে কী কী চলে। উত্তর Allow এ, Browser এর Preflight"],
      ["Safe", "Client কোনো বদল চায়নি"],
      ["Idempotent", "একবার আর বারবার পাঠানোর ফল Server এর উপর একই"],
      ["201 + Location", "নতুন জিনিস তৈরি, তার ঠিকানা সহ"],
      ["303", "কাজ হয়েছে, ফলাফল দেখতে ওই ঠিকানায় GET করুন। Post/Redirect/Get"],
      ["307, 308", "Redirect, Method আর Body অক্ষত। 308 চিরদিনের"],
      ["401 আর 403", "আবার Login করলে কাজ হতে পারে কি না, এই এক প্রশ্নে তফাত"],
      ["409", "Server এর এখনকার অবস্থার সাথে সংঘর্ষ, যেমন শেষ আসন"],
      ["422", "Body পড়া গেছে, মান অর্থহীন"],
      ["429", "অনেক বেশি Request, সাথে Retry-After"],
      ["502 আর 504", "মাঝের Proxy র লেখা। পেছনের App উত্তর দেয়নি, বা সময়মতো দেয়নি"],
      ["Problem Details", "ভুলের Body র ভাগ করা ধাঁচ, application/problem+json"],
      ["Idempotency-Key", "একটা কাজের জন্য একটা Key। POST এর দ্বিতীয় চেষ্টাকে নিরাপদ করে"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "পর্যটক বুকিং এর Form জমা দেওয়ার পর পাতাটা Refresh করলেন, আর Browser জিজ্ঞেস করল আবার পাঠাবে কি না। Browser কেন জিজ্ঞেস করল?",
        options: [
          {
            key: "A",
            text: "পাতাটা একটা POST এর উত্তরে এসেছিল, আর POST আবার পাঠালে আবার কাজ হতে পারে",
            isCorrect: true,
            explanation:
              "ঠিক। POST Safe ও নয়, Idempotent ও নয়। Browser জানে Refresh মানে সেই POST আবার যাওয়া, তাই আগে অনুমতি চায়। সমাধান Post/Redirect/Get।",
          },
          {
            key: "B",
            text: "Server এর Cache শেষ হয়ে গেছে",
            isCorrect: false,
            explanation: "Cache এর সাথে এর সম্পর্ক নেই। প্রশ্নটা Browser নিজে করছে, Method দেখে।",
          },
          {
            key: "C",
            text: "Network এর Connection ভেঙে গিয়েছিল",
            isCorrect: false,
            explanation: "Connection ঠিক থাকলেও এই প্রশ্ন আসে। কারণটা Method, Network নয়।",
          },
          {
            key: "D",
            text: "পাতাটা 404 দিয়েছিল",
            isCorrect: false,
            explanation: "পাতাটা দিব্যি এসেছিল। প্রশ্নটা এসেছে কারণ সেটা একটা POST এর উত্তর।",
          },
        ],
      },
      {
        id: 2,
        text: "কোন জোড়ার দুইটা Method ই Idempotent?",
        options: [
          {
            key: "A",
            text: "POST আর PATCH",
            isCorrect: false,
            explanation: "দুইটার কোনোটাই নিয়ম অনুযায়ী Idempotent নয়। দুইবার POST মানে দুইবার কাজ।",
          },
          {
            key: "B",
            text: "PUT আর DELETE",
            isCorrect: true,
            explanation:
              "ঠিক। PUT একই জিনিস একই জায়গায় বারবার বসায়, DELETE একবার সরানোর পর আবার সরানোর কিছু থাকে না। দুইটাতেই বারবার পাঠানোর ফল একবারের মতো।",
          },
          {
            key: "C",
            text: "GET আর POST",
            isCorrect: false,
            explanation: "GET Idempotent, কিন্তু POST নয়।",
          },
          {
            key: "D",
            text: "PATCH আর PUT",
            isCorrect: false,
            explanation: "PUT Idempotent, কিন্তু PATCH এর সেই নিশ্চয়তা নেই। একজন অতিথি যোগ করার PATCH প্রতিবার সংখ্যা বাড়ায়।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা বুকিং এ প্রথম DELETE এর উত্তর 204, দ্বিতীয় DELETE এর উত্তর 410। তাহলে কি DELETE Idempotent নয়?",
        options: [
          {
            key: "A",
            text: "ঠিক, উত্তর বদলেছে বলে Idempotent নয়",
            isCorrect: false,
            explanation: "Idempotent কথাটা উত্তর নিয়ে নয়, Server এর অবস্থা নিয়ে।",
          },
          {
            key: "B",
            text: "এখনো Idempotent, কারণ দুইবারের পরেও Server এর অবস্থা একই: বুকিং নেই",
            isCorrect: true,
            explanation:
              "ঠিক। একবার পাঠানোর পরে আর দশবার পাঠানোর পরে Server এর অবস্থা হুবহু এক। উত্তরের Code বদলানো চলে।",
          },
          {
            key: "C",
            text: "দ্বিতীয়বার Server এর উচিত ছিল আবার 204 দেওয়া, নইলে নিয়ম ভাঙে",
            isCorrect: false,
            explanation: "দ্বিতীয়বার 404 বা 410 দেওয়া পুরোপুরি নিয়মসম্মত, আর বেশি সৎ উত্তর।",
          },
          {
            key: "D",
            text: "DELETE কখনো Idempotent নয়",
            isCorrect: false,
            explanation: "HTTP এর নিয়মে DELETE Idempotent Method এর তালিকায় আছে।",
          },
        ],
      },
      {
        id: 4,
        text: "কেউ Login না করেই GET /api/me পাঠালেন। কোন উত্তর ঠিক?",
        options: [
          {
            key: "A",
            text: "403, সাথে কিছু না",
            isCorrect: false,
            explanation: "403 মানে Server জানে আপনি কে আর আপনার অনুমতি নেই। এখানে Server জানেই না আপনি কে।",
          },
          {
            key: "B",
            text: "404",
            isCorrect: false,
            explanation: "পথটা আছে। সমস্যা পরিচয়ের, ঠিকানার নয়।",
          },
          {
            key: "C",
            text: "401, সাথে WWW-Authenticate Header",
            isCorrect: true,
            explanation:
              "ঠিক। পরিচয় নেই, আর Login করলে কাজ হবে, তাই 401। নিয়ম অনুযায়ী WWW-Authenticate পাঠাতেই হয়।",
          },
          {
            key: "D",
            text: "400",
            isCorrect: false,
            explanation: "Request এর গঠনে কোনো ভুল নেই। শুধু পরিচয়টা নেই।",
          },
        ],
      },
      {
        id: 5,
        text: "দুইজন পর্যটক প্রায় একসাথে Saint Martin এর শেষ আসনটা চাইলেন। দ্বিতীয়জনের Request টা একদম ঠিকঠাক। তাঁকে কোন Code দেওয়া উচিত?",
        options: [
          {
            key: "A",
            text: "500, কারণ বুকিং টা হলো না",
            isCorrect: false,
            explanation: "Server এ কিছু ভাঙেনি। 500 দিলে Monitoring অকারণে Alarm বাজাবে।",
          },
          {
            key: "B",
            text: "422, কারণ আসনের সংখ্যা ভুল",
            isCorrect: false,
            explanation: "Request এর মান অর্থহীন নয়, একটা আসন চাওয়া একদম স্বাভাবিক। সমস্যা Server এর এখনকার অবস্থায়।",
          },
          {
            key: "C",
            text: "200, Body তে লিখে দেওয়া যে আসন নেই",
            isCorrect: false,
            explanation: "এটা সবকিছুতে 200 এর ভুল। পথের সবাই ভাববে বুকিং সফল।",
          },
          {
            key: "D",
            text: "409, Body তে seatsLeft: 0",
            isCorrect: true,
            explanation:
              "ঠিক। Request ঠিক, কিন্তু Server এর এখনকার অবস্থার সাথে সংঘর্ষ। Body তে নতুন অবস্থা দিলে App অন্য তারিখ দেখাতে পারে।",
          },
        ],
      },
      {
        id: 6,
        text: "Browser একটা POST পাঠাল, Server উত্তর দিল 302 আর একটা নতুন Location। Browser এর দ্বিতীয় Request টা সাধারণত কেমন হয়?",
        options: [
          {
            key: "A",
            text: "নতুন ঠিকানায় POST, একই Body সহ",
            isCorrect: false,
            explanation: "পুরনো নিয়মে এমনই লেখা ছিল, কিন্তু Browser গুলো কখনো এভাবে করেনি। Method আর Body রাখতে চাইলে 307 বা 308।",
          },
          {
            key: "B",
            text: "নতুন ঠিকানায় GET, Body ছাড়া",
            isCorrect: true,
            explanation:
              "ঠিক। ঐতিহাসিক কারণে 301 আর 302 এর পরে Browser POST কে GET বানায়। Lab এ curl ও ঠিক এটাই করেছে।",
          },
          {
            key: "C",
            text: "Browser কোনো দ্বিতীয় Request পাঠায় না",
            isCorrect: false,
            explanation: "3xx পেলে Browser নিজে থেকেই Location এর ঠিকানায় যায়।",
          },
          {
            key: "D",
            text: "নতুন ঠিকানায় PUT",
            isCorrect: false,
            explanation: "কোনো Redirect POST কে PUT বানায় না।",
          },
        ],
      },
      {
        id: 7,
        text: "Payment এর একটা POST এর উত্তরে Caddy 504 দিল। App এর জন্য সবচেয়ে ভালো পরের কাজ কোনটা?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে একই POST আবার পাঠানো, Key ছাড়া",
            isCorrect: false,
            explanation: "504 মানে Proxy অপেক্ষা ছেড়েছে, App হয়তো টাকা কেটেও ফেলেছে। আবার পাঠালে দুইবার কাটতে পারে।",
          },
          {
            key: "B",
            text: "পর্যটককে বলে দেওয়া Payment ব্যর্থ হয়েছে",
            isCorrect: false,
            explanation: "সেটা হয়তো সত্যি নয়। 504 কাজের ফলাফল জানায় না, শুধু জানায় উত্তর সময়মতো আসেনি।",
          },
          {
            key: "C",
            text: "একই Idempotency-Key দিয়ে আবার পাঠানো, অথবা আগে খোঁজ নেওয়া কাজটা হয়েছিল কি না",
            isCorrect: true,
            explanation:
              "ঠিক। একই Key থাকলে আবার পাঠানো নিরাপদ, কাজ হয়ে থাকলে Server আগের উত্তরটাই দেবে। Key না থাকলে আগে খোঁজ নিতে হবে।",
          },
          {
            key: "D",
            text: "নতুন একটা Key বানিয়ে আবার পাঠানো",
            isCorrect: false,
            explanation: "নতুন Key মানে Server এর চোখে নতুন কাজ। Key এর পুরো উদ্দেশ্যটাই নষ্ট।",
          },
        ],
      },
      {
        id: 8,
        text: "500 আর 502 এর আসল তফাত কোনটা?",
        options: [
          {
            key: "A",
            text: "500 বেশি গুরুতর, 502 কম",
            isCorrect: false,
            explanation: "দুইটাই গুরুতর। তফাতটা গুরুত্বে নয়, কে লিখেছে তাতে।",
          },
          {
            key: "B",
            text: "500 লেখে App নিজে, ভেতরের কোনো Error এ। 502 লেখে মাঝের Proxy, যখন পেছনের App ঠিকঠাক উত্তর দেয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। তাই 502 দেখলে App এর Log এ হয়তো কিছুই পাবেন না। দেখতে হবে App চালু আছে কি না, আর Proxy র Log।",
          },
          {
            key: "C",
            text: "502 মানে Client এর ভুল",
            isCorrect: false,
            explanation: "5xx পরিবারের কোনো Code ই Client এর ভুল বোঝায় না।",
          },
          {
            key: "D",
            text: "কোনো তফাত নেই, দুইটা একই জিনিসের দুই নাম",
            isCorrect: false,
            explanation: "তফাত আছে, আর Production এ সমস্যা খোঁজার সময় সেটাই প্রথম সূত্র।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "প্রায় সব Method আর Code নিজের যন্ত্রে ঘটান",
    subtitle: "ছয়টা পরীক্ষা, শুধু Node আর curl, কিছু Install করতে হবে না",
    stepName: "LAB",
    steps: [
      {
        title: "একটা সত্যিকারের Server এ আটটা Method",
        description:
          "example.com এ GET থেকে TRACE পর্যন্ত সব পাঠান। কোনটা 200, কোনটা 405, HEAD এ কত Byte এলো, আর Allow Header কী বলে, মিলিয়ে নিন।",
      },
      {
        title: "নিজের my-tours API চালু করা",
        description:
          "Node এর একটা ফাইলে ছোট একটা API, যেটা Tour, বুকিং, Login আর Payment সামলায়। প্রথম Terminal এ চালু রাখুন, বাকি পরীক্ষা দ্বিতীয় Terminal এ।",
      },
      {
        title: "একটা বুকিং এর পুরো জীবন",
        description:
          "POST এ 201 আর Location, তারপর GET, PATCH, PUT, DELETE, আর মোছার পরে আবার DELETE ও GET। PUT এর পরে Body র চেহারা আর দ্বিতীয় DELETE এর Code খেয়াল করুন।",
      },
      {
        title: "ভুলের মিছিল",
        description:
          "এগারো রকম ভুল Request পাঠিয়ে 400, 401, 403, 404, 405, 409, 413, 415, 422, 429 আর 500 নিজের চোখে দেখুন।",
      },
      {
        title: "Redirect আর Idempotency-Key",
        description:
          "পাঁচ রকম Redirect এ একটা POST এর কী হয়, আর একই Payment Key ছাড়া আর Key সহ দুইবার পাঠালে কতবার টাকা কাটে।",
      },
      {
        title: "502 আর 504 কোথায় জন্মায়",
        description:
          "API এর সামনে একটা খেলনা Gateway বসান। একটা ধীর Route এ 504, আর API বন্ধ করে দিলে 502, দুইটাই Gateway নিজে লেখে।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-every-method.sh",
        language: "bash",
        code: `# চালান:  bash 1-every-method.sh
# একই ঠিকানায় আটটা Method, প্রতিটার Status Code আর কত Byte Body এলো
for m in GET HEAD OPTIONS POST PUT PATCH DELETE TRACE; do
  if [ "$m" = HEAD ]; then
    curl -s -o /dev/null -I -w "$m  %{http_code}  %{size_download} bytes\\n" https://example.com
  else
    curl -s -o /dev/null -X "$m" -w "$m  %{http_code}  %{size_download} bytes\\n" https://example.com
  fi
done

# যে ঠিকানা নেই
curl -s -o /dev/null -w "GET /nope  %{http_code}\\n" https://example.com/nope

# GET এর উত্তরে Server নিজেই বলে দিচ্ছে কোন কোন Method চলে
curl -sI https://example.com | grep -i '^allow'

# যা এলো (আপনার যন্ত্রে Byte এর সংখ্যা আলাদা হতে পারে, Code গুলো একই থাকবে):
# GET  200  577 bytes
# HEAD  200  0 bytes
# OPTIONS  405  558 bytes
# POST  405  558 bytes
# PUT  405  558 bytes
# PATCH  405  558 bytes
# DELETE  405  558 bytes
# TRACE  405  155 bytes
# GET /nope  404
# allow: GET, HEAD`,
      },
      {
        filename: "2-tours-api.mjs",
        language: "javascript",
        code: `// চালান (প্রথম Terminal এ, চালু রাখুন):  LAB_PORT=47630 node 2-tours-api.mjs
// my-tours এর একটা ছোট API। শুধু Node এর নিজস্ব Module, কিছু Install করতে হবে না।
// সব Data Memory তে থাকে, Server বন্ধ করলেই মুছে যায়।
import http from "node:http";
import { randomBytes } from "node:crypto";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const MAX_BODY_BYTES = 10_000; // এর বড় Body এলে 413
const LOGIN_LIMIT = 3; // প্রতি মিনিটে এতবার Login চেষ্টা, তারপর 429
const LOGIN_WINDOW_MS = 60_000;
const SLOW_ROUTE_MS = 5_000; // /api/slow এতক্ষণ চুপ থাকে, পরীক্ষা ৬ এর 504 এর জন্য

const tours = new Map([
  ["saint-martin", { slug: "saint-martin", name: "Saint Martin Island Escape", seatsLeft: 1 }],
  ["sundarbans-cruise", { slug: "sundarbans-cruise", name: "Sundarbans Mangrove Cruise", seatsLeft: 12 }],
]);
const bookings = new Map(); // id থেকে বুকিং
const deleted = new Set(); // মুছে ফেলা বুকিং এর id, 410 এর জন্য
const payments = new Map(); // Idempotency-Key থেকে আগের উত্তর
const loginTries = new Map(); // IP থেকে চেষ্টার সময়গুলো
let charges = 0;

// প্রতিটা ভুলের উত্তর একই চেহারায়: RFC 9457 এর Problem Details
function problem(res, status, title, detail, extra = {}) {
  send(res, status, { type: "about:blank", title, status, detail, ...extra }, {
    "Content-Type": "application/problem+json",
  });
}

function send(res, status, body, headers = {}) {
  if (body === undefined) {
    res.writeHead(status, headers); // 204 এর কোনো Body নেই
    return res.end();
  }
  const text = JSON.stringify(body, null, 2) + "\\n";
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(text),
    ...headers,
  });
  res.end(text); // HEAD হলে Node নিজেই Body টা ফেলে দেয়, Header গুলো থাকে
}

// Bearer Token থেকে ইউজার। এই Lab এ Token টা শুধু ইউজারের id, আসল Token লেসন ০৬ এ।
function userOf(req) {
  const auth = req.headers.authorization ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) reject(Object.assign(new Error("too large"), { status: 413 }));
      else chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

async function readJson(req, res) {
  if (!(req.headers["content-type"] ?? "").startsWith("application/json")) {
    problem(res, 415, "Unsupported Media Type", "Body must be JSON, send Content-Type: application/json");
    return null;
  }
  const raw = await readBody(req);
  try {
    return JSON.parse(raw);
  } catch {
    problem(res, 400, "Bad Request", "Body is not valid JSON");
    return null;
  }
}

// কোন ঠিকানায় কোন Method চলে। OPTIONS আর 405 দুইজনই এই একটা তালিকা পড়ে।
function allowFor(path) {
  if (/^\\/api\\/tours(\\/[a-z-]+)?$/.test(path)) return "GET, HEAD, OPTIONS";
  if (path === "/api/bookings") return "POST, OPTIONS";
  if (/^\\/api\\/bookings\\/bk_[A-Z0-9]+$/.test(path)) return "GET, HEAD, PUT, PATCH, DELETE, OPTIONS";
  return "OPTIONS";
}

function validBooking(body) {
  return tours.has(body.tour) && Number.isInteger(body.guests) && body.guests >= 1 && body.guests <= 10;
}

async function handle(req, res) {
  const url = new URL(req.url, "http://lab.invalid");
  const path = url.pathname;
  const m = req.method;

  const allowed = allowFor(path);

  // OPTIONS: এই ঠিকানায় কী কী করা যায়
  if (m === "OPTIONS") return send(res, 204, undefined, { Allow: allowed });

  // ঠিকানাটা আছে কিন্তু এই Method চলে না: 405, সাথে Allow
  if (allowed !== "OPTIONS" && !allowed.split(", ").includes(m)) {
    res.setHeader("Allow", allowed);
    return problem(res, 405, "Method Not Allowed", \`\${m} is not allowed on \${path}\`);
  }

  if (path === "/api/tours") return send(res, 200, [...tours.values()]);

  const tourMatch = path.match(/^\\/api\\/tours\\/([a-z-]+)$/);
  if (tourMatch) {
    const tour = tours.get(tourMatch[1]);
    if (!tour) return problem(res, 404, "Not Found", \`No tour named \${tourMatch[1]}\`);
    return send(res, 200, tour);
  }

  if (path === "/api/bookings") {
    const user = userOf(req);
    if (!user) {
      res.setHeader("WWW-Authenticate", 'Bearer realm="my-tours"');
      return problem(res, 401, "Unauthorized", "Log in first, then send your token");
    }
    const body = await readJson(req, res);
    if (!body) return;
    if (!validBooking(body)) return problem(res, 422, "Unprocessable Content", "tour must exist and guests must be 1 to 10");
    const tour = tours.get(body.tour);
    if (tour.seatsLeft < body.guests) {
      return problem(res, 409, "Conflict", \`Only \${tour.seatsLeft} seat(s) left on \${tour.slug}\`, { seatsLeft: tour.seatsLeft });
    }
    tour.seatsLeft -= body.guests;
    const id = "bk_" + randomBytes(4).toString("hex").toUpperCase();
    const booking = { id, tour: body.tour, guests: body.guests, owner: user, status: "confirmed" };
    bookings.set(id, booking);
    return send(res, 201, booking, { Location: \`/api/bookings/\${id}\` });
  }

  const bookingMatch = path.match(/^\\/api\\/bookings\\/(bk_[A-Z0-9]+)$/);
  if (bookingMatch) {
    const id = bookingMatch[1];
    const user = userOf(req);
    if (!user) {
      res.setHeader("WWW-Authenticate", 'Bearer realm="my-tours"');
      return problem(res, 401, "Unauthorized", "Log in first, then send your token");
    }
    if (deleted.has(id)) return problem(res, 410, "Gone", \`Booking \${id} was cancelled and removed\`);
    const booking = bookings.get(id);
    if (!booking) return problem(res, 404, "Not Found", \`No booking \${id}\`);
    if (booking.owner !== user) return problem(res, 403, "Forbidden", "This booking belongs to someone else");

    if (m === "GET" || m === "HEAD") return send(res, 200, booking);
    if (m === "DELETE") {
      bookings.delete(id);
      deleted.add(id);
      tours.get(booking.tour).seatsLeft += booking.guests;
      return send(res, 204);
    }
    // বাকি থাকল PUT আর PATCH। PUT পুরোটা বদলে দেয়, PATCH শুধু যা পাঠানো হয়েছে।
    // ছোট রাখার জন্য এই Lab এ PUT আর PATCH আসন গোনে না। আসল App এ গুনতে হয়।
    const body = await readJson(req, res);
    if (!body) return;
    const next = m === "PUT" ? { id, owner: user, status: "confirmed", ...body } : { ...booking, ...body };
    if (!validBooking(next)) return problem(res, 422, "Unprocessable Content", "tour must exist and guests must be 1 to 10");
    bookings.set(id, next);
    return send(res, 200, next);
  }

  if (path === "/api/auth/login" && m === "POST") {
    const ip = req.socket.remoteAddress;
    const now = Date.now();
    const recent = (loginTries.get(ip) ?? []).filter((t) => now - t < LOGIN_WINDOW_MS);
    if (recent.length >= LOGIN_LIMIT) {
      const wait = Math.ceil((LOGIN_WINDOW_MS - (now - recent[0])) / 1000);
      res.setHeader("Retry-After", String(wait));
      return problem(res, 429, "Too Many Requests", \`Too many login attempts, try again in \${wait} seconds\`);
    }
    loginTries.set(ip, [...recent, now]);
    res.setHeader("WWW-Authenticate", 'Bearer realm="my-tours"');
    return problem(res, 401, "Unauthorized", "Wrong email or password");
  }

  if (path === "/api/payments" && m === "POST") {
    const key = req.headers["idempotency-key"];
    const raw = await readBody(req);
    if (key && payments.has(key)) {
      const saved = payments.get(key);
      if (saved.raw !== raw) return problem(res, 422, "Unprocessable Content", "This Idempotency-Key was used with a different body");
      return send(res, saved.status, saved.body, { "Idempotent-Replayed": "true" });
    }
    charges += 1;
    const body = { chargeId: "ch_" + charges, totalChargesSoFar: charges };
    if (key) payments.set(key, { raw, status: 201, body });
    return send(res, 201, body);
  }

  // Redirect এর পাঁচ রকম। সবাই /echo তে পাঠায়, /echo বলে দেয় কোন Method আর Body পৌঁছাল।
  const redirect = path.match(/^\\/r\\/(301|302|303|307|308)$/);
  if (redirect) {
    res.writeHead(Number(redirect[1]), { Location: "/echo" });
    return res.end();
  }
  if (path === "/echo") {
    const raw = await readBody(req);
    return send(res, 200, { method: m, body: raw || null });
  }

  if (path === "/api/slow") {
    await new Promise((r) => setTimeout(r, SLOW_ROUTE_MS));
    return send(res, 200, { done: true });
  }

  if (path === "/api/bug") throw new Error("a bug the team has not found yet");

  return problem(res, 404, "Not Found", \`Nothing at \${path}\`);
}

http
  .createServer((req, res) => {
    handle(req, res).catch((err) => {
      if (err.status === 413) {
        res.setHeader("Connection", "close");
        return problem(res, 413, "Content Too Large", \`Body is larger than \${MAX_BODY_BYTES} bytes\`);
      }
      // ভেতরের খবর Log এ যায়, ব্যবহারকারীর কাছে নয়
      console.error("unhandled:", err.message);
      problem(res, 500, "Internal Server Error", "Something went wrong on our side");
    });
  })
  .listen(port, "127.0.0.1", () => console.log(\`my-tours lab API on http://127.0.0.1:\${port}\`));`,
      },
      {
        filename: "3-booking-life.sh",
        language: "bash",
        code: `# চালান (দ্বিতীয় Terminal এ, API চালু থাকা অবস্থায়):  LAB_PORT=47630 bash 3-booking-life.sh
API="http://127.0.0.1:$LAB_PORT"
ME="Authorization: Bearer usr_42"
JSON="Content-Type: application/json"

# ১. নতুন বুকিং: POST, উত্তর 201 আর Location
RESP=$(curl -si -X POST "$API/api/bookings" -H "$ME" -H "$JSON" \\
  -d '{"tour":"sundarbans-cruise","guests":2}')
echo "$RESP"
LOC=$(echo "$RESP" | grep -i '^location:' | tr -d '\\r' | cut -d' ' -f2)

# ২. Location এ যে ঠিকানা পেলেন সেখানে GET
curl -s "$API$LOC" -H "$ME"

# ৩. PATCH: শুধু guests বদলান
curl -s -X PATCH "$API$LOC" -H "$ME" -H "$JSON" -d '{"guests":3}'

# ৪. PUT: পুরো বুকিং নতুন করে পাঠান
curl -s -X PUT "$API$LOC" -H "$ME" -H "$JSON" -d '{"tour":"sundarbans-cruise","guests":4}'

# ৫. DELETE, তারপর আবার GET
curl -s -o /dev/null -w 'DELETE  %{http_code}\\n' -X DELETE "$API$LOC" -H "$ME"
curl -s -o /dev/null -w 'DELETE  %{http_code}\\n' -X DELETE "$API$LOC" -H "$ME"
curl -s -o /dev/null -w 'GET     %{http_code}\\n' "$API$LOC" -H "$ME"

# যা এলো (id প্রতিবার আলাদা হবে):
# HTTP/1.1 201 Created
# Content-Type: application/json
# Content-Length: 118
# Location: /api/bookings/bk_02E50C5F
# ...
# { "id": "bk_02E50C5F", "tour": "sundarbans-cruise", "guests": 2, "owner": "usr_42", "status": "confirmed" }
# { ... "guests": 2 ... }                       ২. GET, একই বুকিং
# { ... "guests": 3 ... }                       ৩. PATCH, শুধু guests বদলাল
# { "id": "bk_02E50C5F", "owner": "usr_42", "status": "confirmed",
#   "tour": "sundarbans-cruise", "guests": 4 }  ৪. PUT, পুরোটা নতুন করে লেখা
# DELETE  204
# DELETE  410                                   দ্বিতীয় DELETE, অবস্থা একই
# GET     410`,
      },
      {
        filename: "4-error-parade.sh",
        language: "bash",
        code: `# চালান (দ্বিতীয় Terminal এ, API নতুন করে চালু করে):  LAB_PORT=47630 bash 4-error-parade.sh
API="http://127.0.0.1:$LAB_PORT"
ME="Authorization: Bearer usr_42"
OTHER="Authorization: Bearer usr_77"
JSON="Content-Type: application/json"
code() { curl -s -o /dev/null -w "%{http_code}  $1\\n" "\${@:2}"; }

code "JSON এ একটা কমা নেই"       -X POST "$API/api/bookings" -H "$ME" -H "$JSON" -d '{"tour":"saint-martin" "guests":1}'
code "Token ছাড়া বুকিং"           -X POST "$API/api/bookings" -H "$JSON" -d '{"tour":"saint-martin","guests":1}'
code "যে Tour নেই"                "$API/api/tours/cox-bazar"
code "Tour মুছে ফেলার চেষ্টা"      -X DELETE "$API/api/tours"
code "Form পাঠালেন, JSON নয়"      -X POST "$API/api/bookings" -H "$ME" -d 'tour=saint-martin&guests=1'
code "guests মাইনাস দুই"          -X POST "$API/api/bookings" -H "$ME" -H "$JSON" -d '{"tour":"saint-martin","guests":-2}'

# শেষ আসনটা usr_42 নিলেন, তারপর usr_77 একই আসন চাইলেন
LOC=$(curl -si -X POST "$API/api/bookings" -H "$ME" -H "$JSON" -d '{"tour":"saint-martin","guests":1}' \\
  | grep -i '^location:' | tr -d '\\r' | cut -d' ' -f2)
echo "201  শেষ আসনটা নিলেন, $LOC"
code "আরেকজন একই আসন চাইলেন"      -X POST "$API/api/bookings" -H "$OTHER" -H "$JSON" -d '{"tour":"saint-martin","guests":1}'
code "অন্যের বুকিং দেখতে চাইলেন"   "$API$LOC" -H "$OTHER"

head -c 20000 /dev/zero | tr '\\0' 'x' | code "২০ KB এর Body" -X POST "$API/api/bookings" -H "$ME" -H "$JSON" --data-binary @-
for i in 1 2 3 4; do code "Login চেষ্টা $i" -X POST "$API/api/auth/login" -H "$JSON" -d '{}'; done
curl -s -D - -o /dev/null -X POST "$API/api/auth/login" -H "$JSON" -d '{}' | grep -i 'retry-after'
code "Server এর ভেতরের Bug"       "$API/api/bug"

# যা এলো:
# 400  JSON এ একটা কমা নেই
# 401  Token ছাড়া বুকিং
# 404  যে Tour নেই
# 405  Tour মুছে ফেলার চেষ্টা
# 415  Form পাঠালেন, JSON নয়
# 422  guests মাইনাস দুই
# 201  শেষ আসনটা নিলেন, /api/bookings/bk_A3D76203
# 409  আরেকজন একই আসন চাইলেন
# 403  অন্যের বুকিং দেখতে চাইলেন
# 413  ২০ KB এর Body
# 401  Login চেষ্টা 1
# 401  Login চেষ্টা 2
# 401  Login চেষ্টা 3
# 429  Login চেষ্টা 4
# Retry-After: 60
# 500  Server এর ভেতরের Bug
#
# আর প্রথম Terminal এ, API এর Log এ:
# unhandled: a bug the team has not found yet`,
      },
      {
        filename: "5-redirects-and-payments.sh",
        language: "bash",
        code: `# চালান (দ্বিতীয় Terminal এ):  LAB_PORT=47630 bash 5-redirects-and-payments.sh
API="http://127.0.0.1:$LAB_PORT"
JSON="Content-Type: application/json"

# ১. পাঁচ রকম Redirect, প্রতিবার একটা POST পাঠিয়ে। -L দিলে curl Redirect পেলে নতুন ঠিকানায় যায়।
for c in 301 302 303 307 308; do
  printf "%s  " "$c"
  curl -s -L -d 'guests=2' "$API/r/$c"  | tr -d ' \\n'
  echo
done

# ২. Idempotency-Key ছাড়া একই Payment দুইবার
BODY='{"booking":"bk_7Q2M9X","amountBdt":8500}'
curl -s -X POST "$API/api/payments" -H "$JSON" -d "$BODY" | tr -d ' \\n'; echo
curl -s -X POST "$API/api/payments" -H "$JSON" -d "$BODY" | tr -d ' \\n'; echo

# ৩. একটা Key বানিয়ে, একই Key দিয়ে দুইবার
KEY=$(node -e 'console.log(crypto.randomUUID())')
curl -s -X POST "$API/api/payments" -H "$JSON" -H "Idempotency-Key: $KEY" -d "$BODY" | tr -d ' \\n'; echo
curl -s -D - -X POST "$API/api/payments" -H "$JSON" -H "Idempotency-Key: $KEY" -d "$BODY" \\
  | grep -iE '^HTTP|^idempotent|chargeId' | tr -d '\\r'

# ৪. একই Key, কিন্তু অন্য টাকার অঙ্ক
curl -s -o /dev/null -w "%{http_code}  same key, different body\\n" -X POST "$API/api/payments" \\
  -H "$JSON" -H "Idempotency-Key: $KEY" -d '{"booking":"bk_7Q2M9X","amountBdt":9000}'

# যা এলো:
# 301  {"method":"GET","body":null}
# 302  {"method":"GET","body":null}
# 303  {"method":"GET","body":null}
# 307  {"method":"POST","body":"guests=2"}
# 308  {"method":"POST","body":"guests=2"}
# {"chargeId":"ch_1","totalChargesSoFar":1}
# {"chargeId":"ch_2","totalChargesSoFar":2}     Key ছাড়া: দুইবার টাকা কাটা
# {"chargeId":"ch_3","totalChargesSoFar":3}
# HTTP/1.1 201 Created
# Idempotent-Replayed: true
#   "chargeId": "ch_3",                         Key সহ: আগের উত্তর, নতুন কাটা নেই
# 422  same key, different body`,
      },
      {
        filename: "6-gateway.mjs",
        language: "javascript",
        code: `// তিনটা Terminal লাগবে।
//   প্রথম:   LAB_PORT=47630 node 2-tours-api.mjs
//   দ্বিতীয়:  GATEWAY_PORT=47631 UPSTREAM_PORT=47630 UPSTREAM_TIMEOUT_MS=2000 node 6-gateway.mjs
//   তৃতীয়:   নিচের curl গুলো, সবগুলো Gateway এর Port 47631 এ
// Caddy এর একটা খুব ছোট খেলনা রূপ। সব Request পেছনের API তে পাঠায়, আর
// পেছনের জন না পারলে নিজে 502 বা 504 বানিয়ে ফেরত দেয়।
import http from "node:http";

const port = Number(process.env.GATEWAY_PORT);
const upstreamPort = Number(process.env.UPSTREAM_PORT);
const timeoutMs = Number(process.env.UPSTREAM_TIMEOUT_MS);
if (!port || !upstreamPort || !timeoutMs) {
  throw new Error("GATEWAY_PORT, UPSTREAM_PORT and UPSTREAM_TIMEOUT_MS must all be set");
}

http
  .createServer((req, res) => {
    let answered = false; // একটা Request এর উত্তর একবারই যায়
    const fail = (status, title, why) => {
      if (answered) return;
      answered = true;
      console.log(\`\${req.method} \${req.url} -> \${status}, \${why}\`);
      res.writeHead(status, { "Content-Type": "text/plain", Server: "toy-gateway" });
      res.end(\`\${status} \${title} (from the gateway, not from the app)\\n\`);
    };

    const upstream = http.request(
      { host: "127.0.0.1", port: upstreamPort, method: req.method, path: req.url, headers: req.headers },
      (answer) => {
        answered = true;
        res.writeHead(answer.statusCode, answer.headers);
        answer.pipe(res);
      },
    );
    // পেছনের জন এত সময়ের মধ্যে চুপ থাকলে 504
    upstream.setTimeout(timeoutMs, () => {
      fail(504, "Gateway Timeout", \`no answer within \${timeoutMs} ms\`);
      upstream.destroy();
    });
    // পেছনের জনের সাথে Connection ই হলো না, বা মাঝপথে ভেঙে গেল: 502
    upstream.on("error", (err) => fail(502, "Bad Gateway", err.code));
    req.pipe(upstream);
  })
  .listen(port, "127.0.0.1", () => console.log(\`toy gateway on http://127.0.0.1:\${port}\`));

// তৃতীয় Terminal এ:
//   curl -s -o /dev/null -w '%{http_code}  normal, through the gateway\\n' http://127.0.0.1:47631/api/tours
//   curl -s -o /dev/null -w '%{http_code}  bug inside the app\\n'          http://127.0.0.1:47631/api/bug
//   curl -s -w '%{http_code}  after %{time_total} s\\n'                    http://127.0.0.1:47631/api/slow
//   এবার প্রথম Terminal এ Ctrl+C দিয়ে API বন্ধ করুন, তারপর:
//   curl -si http://127.0.0.1:47631/api/tours
//
// যা এলো:
//   200  normal, through the gateway
//   500  bug inside the app                    এই 500 App এর লেখা, Gateway শুধু পৌঁছে দিল
//   504 Gateway Timeout (from the gateway, not from the app)
//   504  after 2.007078 s                      Gateway দুই সেকেন্ড অপেক্ষা করে হাল ছাড়ল
//   HTTP/1.1 502 Bad Gateway
//   Content-Type: text/plain
//   Server: toy-gateway
//   ...
//   502 Bad Gateway (from the gateway, not from the app)
//
// আর দ্বিতীয় Terminal এ, Gateway এর Log এ:
//   GET /api/slow -> 504, no answer within 2000 ms
//   GET /api/tours -> 502, ECONNREFUSED`,
      },
    ],
    tip: "পরীক্ষা ৩ আর ৬ পাশাপাশি রেখে ভাবুন। পরীক্ষা ৩ এ দ্বিতীয় DELETE এর উত্তর 410, অথচ Server এর অবস্থা বদলায়নি, এটাই Idempotent এর আসল চেহারা। পরীক্ষা ৬ এ 504 পাওয়ার পরেও পেছনের API টা পাঁচ সেকেন্ড পরে নিজের কাজ ঠিকই শেষ করেছে, শুধু শোনার কেউ ছিল না। এই দুইটা একসাথে মাথায় রাখলেই বুঝবেন কেন GET বা PUT আবার পাঠানো নিশ্চিন্তের, আর POST আবার পাঠানোর আগে কেন Idempotency-Key লাগে।",
  },
  assignment: {
    title: "Mini Project: my-tours এর API চুক্তিপত্র",
    time: "৯০ মিনিট",
    difficulty: "Beginner",
    tasks: [
      <span key="1">
        <strong>চুক্তিপত্র লিখুন:</strong> my-tours এর জন্য অন্তত বারোটা Endpoint এর একটা
        তালিকা বানান। প্রতিটার জন্য লিখুন Method আর পথ, কাজটা কী, সফল হলে কোন Code, আর কোন
        কোন ভুলে কোন Code। প্রতিটা Method এর পাশে এক লাইনে লিখুন কেন সেটাই বেছেছেন, বিশেষ
        করে যেখানে POST আর PUT, বা PATCH আর PUT এর মধ্যে বাছতে হয়েছে।
      </span>,
      <span key="2">
        <strong>Code এ বসান:</strong> Lab এর Server টা নিজের মতো করে বাড়ান, যাতে আপনার তালিকার
        অন্তত ছয়টা Endpoint চলে। 201 এর সাথে Location, 204, 405 এর সাথে Allow, 409, 422, আর
        প্রতিটা ভুলে Problem Details এর Body, সবগুলো যেন থাকে। প্রতিটার জন্য একটা curl কমান্ড আর
        তার আসল ফলাফল জমা দিন।
      </span>,
      <span key="3">
        <strong>Idempotent এর প্রমাণ:</strong> একটা ছোট Script লিখুন যেটা GET, POST, PUT, PATCH
        আর DELETE প্রত্যেকটা তিনবার করে পাঠায়, আর প্রতিবারের পরে Server এর অবস্থা ছাপে। ফলাফল
        দেখে প্রতিটা Method এর পাশে লিখুন সেটা Safe কি না আর Idempotent কি না, আর আপনার কোনো
        Endpoint এই প্রতিশ্রুতি ভাঙছে কি না।
      </span>,
      <span key="4">
        <strong>Payment এ Idempotency-Key:</strong> নিজের Server এর Payment এ Key এর খাতা যোগ
        করুন। খাতায় কতক্ষণ রাখা হবে তা পড়ুন <code>IDEMPOTENCY_TTL_SECONDS</code> নামের
        Environment Variable থেকে, আর সেটা না থাকলে Server যেন চালুই না হয়। দেখান যে একই Key
        তে দ্বিতীয়বার টাকা কাটে না, অন্য Body তে 422 আসে, আর সময় পার হলে একই Key আবার নতুন কাজ
        হিসেবে গণ্য হয়।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য সব উত্তরে 200 পাঠান,
        আর ভুল হলে Body তে লেখেন success: false। তাঁকে বোঝান এতে কে কে বিভ্রান্ত হয়, আর এর
        বদলে কী পাঠাতে হবে। উদাহরণ হিসেবে শেষ আসনের 409 আর App বন্ধ থাকার 502 ব্যবহার করুন,
        আর বলুন দুইটার মধ্যে কোনটা আবার চেষ্টা করলে সারতে পারে আর কেন।
      </span>,
    ],
    deliverables: [
      <span key="1">বারোটা Endpoint এর চুক্তিপত্র, প্রতিটা Method বাছার কারণ সহ</span>,
      <span key="2">ছয়টা Endpoint এর Code, আর প্রতিটার curl কমান্ড ও আসল ফলাফল</span>,
      <span key="3">তিনবার করে পাঠানোর Script, তার ফলাফল আর Method প্রতি সিদ্ধান্ত</span>,
      <span key="4">Idempotency-Key এর Code, আর তিনটা আচরণের Terminal প্রমাণ</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
