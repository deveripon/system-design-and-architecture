/**
 * What: Module 06, Lesson 10 of the DevOps track: WebSocket and real-time communication. It covers
 * polling, long polling, Server-Sent Events and WebSocket (handshake, frames, closing, wss, heartbeats,
 * proxies, scaling, reconnects, security), then closes the whole HTTP & HTTPS module.
 *
 * Why: HTTP only ever answers, so every live feature (a seat map, a chat, a booking status) needs a way
 * for the server to speak first. The lesson builds that from the reader's own terminal, with a
 * WebSocket server written by hand on node:http, so nothing is a black box. As the last lesson of the
 * module it also retells all ten lessons as one story and hands off to Module 07.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  WsCompareLab,
  WsFrameLab,
  WsHandshakeLab,
  WsReconnectLab,
} from "../../../components/course/topics/http/ws-animations";
import {
  WsDirectionSplit,
  WsFanOutDiagram,
  WsFrameDiagram,
  WsModuleStoryDiagram,
  WsPollingTimelineDiagram,
  WsProxyPathDiagram,
  WsSseStreamDiagram,
  WsUpgradeDiagram,
} from "../../../components/course/topics/http/ws-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const mono = (text: string) => (
  <span className="font-mono font-bold text-primary">{text}</span>
);

const link = (href: string, text: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary underline underline-offset-4"
  >
    {text}
  </a>
);

export const websocketRealtimeContent: TopicData = {
  id: "websocket-realtime",
  introduction: {
    badge: "MODULE 06 · LESSON 10",
    title: <SectionTitle>Server যখন নিজে থেকে কথা বলতে চায়</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          ২০ ডিসেম্বরের Saint Martin এর নৌকা। একজন পর্যটক ফোনে আসনের মানচিত্রটা খুলে
          রেখেছেন, জানালার পাশের 14A এখনো সবুজ, মানে খালি। তিনি একটু ভাবছেন,
          পরিবারের সাথে কথা বলছেন। ঠিক এই সময়ে চট্টগ্রামে বসে আরেকজন একই আসন কিনে
          ফেললেন। প্রথম পর্যটকের পর্দায় 14A তখনো সবুজ। তিনি Click করলেন, আর উত্তর
          এলো 409 Conflict, আসনটা আর খালি নেই (লেসন ০৩)।
        </ContentParagraph>
        <ContentParagraph>
          দোষটা কার? Server জানত আসনটা বিক্রি হয়ে গেছে। পাতাটা জানত না। কারণ এই পুরো
          Module এ আপনি যা শিখেছেন, তার মূল নিয়ম একটাই: HTTP তে Browser জিজ্ঞেস
          করে, Server উত্তর দেয়। Server এর হাতে যত জরুরি খবরই থাকুক, কেউ জিজ্ঞেস না
          করলে সে বলার কোনো রাস্তা পায় না।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন সেই রাস্তা বানানো নিয়ে। প্রথমে তিনটা পুরনো আর সরল উপায় দেখবেন:
          বারবার জিজ্ঞেস করা, উত্তর আসা পর্যন্ত লাইন ধরে রাখা, আর একটা Response যেটা
          শেষই হয় না। তারপর আসল জিনিসটা, WebSocket। একটা HTTP Request কীভাবে নিজেকে
          একটা দুই দিকের পাইপে বদলে ফেলে, তার ভেতরে Byte গুলো কীভাবে সাজানো থাকে,
          কীভাবে বিদায় নেয়, পথের Caddy আর Router এর সাথে কীভাবে মানিয়ে চলে, দশ হাজার
          পর্যটকের জন্য কীভাবে বড় হয়, আর কোন দরজা দিয়ে আক্রমণ আসে। সব কিছু নিজের
          Terminal এ, কোনো Package ছাড়া, একটা WebSocket Server নিজের হাতে লিখে। আর
          যেহেতু এটা Module 06 এর শেষ লেসন, একদম শেষে দশটা লেসনকে একটা গল্পে জোড়া
          লাগাব।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "চিঠির যুগে খবর পেতে হলে আগে নিজেকে চিঠি লিখতে হতো, তারপর উত্তরের অপেক্ষা। ফোন আসার পর লাইনটা একবার খুলে রাখলেই হয়, তারপর যার যখন কিছু বলার থাকে, সে তখনই বলে।",
      author: "WebSocket",
      role: "Lesson 10",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-realtime",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>HTTP এ Server কখনো আগে কথা বলে না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা পার্সেল অফিসের কাউন্টার কল্পনা করুন। আপনি গিয়ে জিজ্ঞেস করেন, আমার
                পার্সেল এসেছে? কাউন্টারের মানুষটা খাতা দেখে উত্তর দেন। কিন্তু তাঁর কাছে
                আপনার ফোন নম্বর নেই। পার্সেলটা দুপুরে এসে পৌঁছালেও তিনি আপনাকে জানাতে
                পারবেন না। আপনাকে আবার গিয়ে জিজ্ঞেস করতে হবে।
              </ContentParagraph>
              <ContentParagraph>
                HTTP ঠিক এই কাউন্টার। লেসন ০২ তে দেখেছেন, প্রতিটা কথোপকথন শুরু হয়
                Client এর একটা Request দিয়ে, আর শেষ হয় Server এর একটা Response দিয়ে।
                Response পাঠানো হয়ে গেলে Server এর আর কিছু বলার অধিকার নেই, যতক্ষণ না
                Client আবার কিছু জিজ্ঞেস করে। Connection টা Keep-Alive এ খোলা থাকতে
                পারে (Module 05 লেসন ০৮), কিন্তু খোলা থাকা আর কথা বলার অনুমতি থাকা এক
                জিনিস নয়। খোলা Connection এ Server নিজে থেকে কিছু লিখলে Browser সেটাকে
                কোনো Request এর উত্তর হিসেবে চিনবে না, ফেলে দেবে।
              </ContentParagraph>
              <ContentParagraph>
                বেশিরভাগ পাতার জন্য এটাই যথেষ্ট। একটা ট্যুরের বিবরণ, ছবি, দাম, এগুলো
                একবার চাইলেই হয়ে যায়। কিন্তু কিছু জিনিস আছে যাদের মূল্যই হলো সাথে সাথে
                জানা। নৌকার আসনের মানচিত্র। Payment এর পরে বুকিংয়ের অবস্থা, যেটা Payment
                Gateway থেকে কয়েক সেকেন্ড পরে নিশ্চিত হয়। Support Chat, যেখানে ওপাশের
                মানুষটা যেকোনো মুহূর্তে উত্তর লিখতে পারেন। নতুন Notification। এসব জায়গায়
                দরকার এমন একটা রাস্তা, যেখানে খবরটা ঘটার সাথে সাথে Server নিজে থেকে
                Browser কে জানাতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                Web এর ভাষায় একেই বলে Real-time। শব্দটা শুনে শূন্য সেকেন্ড ভাববেন না।
                এখানে Real-time মানে ব্যবহারকারী কিছু জিজ্ঞেস না করেই এক সেকেন্ডের মতো
                সময়ের মধ্যে খবরটা পেয়ে যান। আর দুইটা শব্দ এই লেসনে বারবার আসবে। Client
                নিজে গিয়ে খবর আনলে সেটা <strong>Pull</strong>, টেনে আনা। Server নিজে
                থেকে খবর পাঠালে সেটা <strong>Push</strong>, ঠেলে দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsDirectionSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই ফাঁক ভরানোর চারটা উপায় মানুষ বানিয়েছে, আর এই লেসন সেগুলো এই
                ক্রমেই দেখবে, কারণ প্রতিটা আগেরটার একটা দুর্বলতা সারাতে এসেছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Short Polling:</strong> কয়েক সেকেন্ড পরপর জিজ্ঞেস করা, নতুন
                  কিছু হলো? পুরোটাই সাধারণ HTTP, শুধু বারবার।
                </ListItem>
                <ListItem>
                  <strong>Long Polling:</strong> জিজ্ঞেস করে লাইনে অপেক্ষা করা। Server
                  উত্তরটা আটকে রাখে, যতক্ষণ না সত্যিই নতুন কিছু ঘটে।
                </ListItem>
                <ListItem>
                  <strong>Server-Sent Events, সংক্ষেপে SSE:</strong> একটা Response যেটা
                  শেষ হয় না। Server সেই একই উত্তরে একটু একটু করে নতুন খবর লিখে যায়।
                </ListItem>
                <ListItem>
                  <strong>WebSocket:</strong> শুরুটা একটা HTTP Request, তারপর সেই
                  Connection টা HTTP ছেড়ে একটা দুই দিকের পাইপ হয়ে যায়, যেখানে দুই পাশই
                  যখন খুশি কথা বলে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "প্রথম দুইটা HTTP কে ঠকায়, শেষ দুইটা HTTP কে বদলায়",
          content: (
            <p>
              Short Polling আর Long Polling এ HTTP এর নিয়ম একটুও ভাঙে না, প্রতিটা খবর
              আসে একটা সাধারণ Request এর সাধারণ উত্তর হয়ে। তাই এরা যেকোনো Proxy,
              Firewall আর পুরনো Browser এ চলে, কিন্তু খরচ বেশি। SSE নিয়মটাকে বাঁকায়:
              Response আছে, কিন্তু সেটা শেষ হয় না। WebSocket নিয়মটা পুরো ছেড়ে দেয়:
              Handshake এর পরে সেই Connection এ আর HTTP থাকে না। যত নিচে নামবেন, খরচ তত
              কম আর ক্ষমতা তত বেশি, কিন্তু পথের প্রতিটা যন্ত্রকে তত বেশি বুঝতে হয় কী
              চলছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "short-polling",
      subHeader: { index: "002", title: "Short Polling" },
      title: <SectionTitle>Short Polling, কয়েক সেকেন্ড পরপর জিজ্ঞেস করা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লম্বা যাত্রায় গাড়ির পেছনের সিটে বসা শিশুর কথা ভাবুন। প্রতি পাঁচ মিনিটে
                একই প্রশ্ন, পৌঁছে গেছি? বেশিরভাগ উত্তর না। কিন্তু যেই মুহূর্তে পৌঁছানো হয়,
                পরের প্রশ্নেই সে জেনে যায়। Short Polling হুবহু এটা। পাতার JavaScript একটা
                Timer চালায়, আর প্রতি কয়েক সেকেন্ডে Server কে একটা সাধারণ GET পাঠায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "seat-map-polling.js",
          code: `// Browser এর পাতায়: প্রতি ২ সেকেন্ডে আসনের তালিকা আনা
const SEATS_URL = "/api/tours/saint-martin/seats?date=2026-12-20";
let lastVersion = 0;

setInterval(async () => {
  const res = await fetch(SEATS_URL);
  const seats = await res.json();
  if (seats.version !== lastVersion) {
    lastVersion = seats.version;
    drawSeatMap(seats.freeSeats); // কিছু বদলেছে, মানচিত্র আবার আঁকা
  }
}, 2000);`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর চেয়ে সরল কিছু হয় না, আর এটাই এর সবচেয়ে বড় গুণ। Server এ নতুন কিছু
                লাগে না, Proxy বা Firewall এ কিছু বদলাতে হয় না, যেকোনো Browser এ চলে।
                সমস্যা দুইটা, আর দুইটাই Lab এর প্রথম পরীক্ষায় নিজের চোখে দেখবেন। সেখানে
                একটা ছোট Server ২০ সেকেন্ডে দুইটা আসন বিক্রি করে, 3.5 আর 11.2 সেকেন্ডে, আর
                একজন Poller প্রতি ২ সেকেন্ডে জিজ্ঞেস করে। আসল ফলাফলটা এরকম:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "1-short-poll.mjs, আসল ফলাফল",
          code: `   2.0s  [poller] request  1: version 1 <- changed
   3.5s  [server] seat 14A sold, version is now 2
   4.0s  [poller] request  2: version 2 <- changed
   6.0s  [poller] request  3: version 2 (no change)
   8.0s  [poller] request  4: version 2 (no change)
  10.0s  [poller] request  5: version 2 (no change)
  11.2s  [server] seat 14B sold, version is now 3
  12.0s  [poller] request  6: version 3 <- changed
  14.0s  [poller] request  7: version 3 (no change)
  16.0s  [poller] request  8: version 3 (no change)
  18.0s  [poller] request  9: version 3 (no change)
  20.0s  [poller] request 10: version 3 (no change)

requests: 10, useful: 3, wasted: 7, body bytes: 486`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথম সমস্যা <strong>অপচয়</strong>। দশটা Request এর মধ্যে কাজের মাত্র
                তিনটা, আর তার একটা আবার প্রথমবার পাতা খোলার জন্য। বাকি সাতটা খালি হাতে
                ফিরেছে। এখানে Body মাত্র 486 Byte, কিন্তু আসল Request এ প্রতিবার Header
                যায় (লেসন ০৪), Cookie যায় (লেসন ০৫), Server Session খোঁজে (লেসন ০৬), আর
                Database এ একটা Query চলে। এবার হিসাবটা বড় করুন। দশ হাজার পর্যটক একসাথে
                মানচিত্র খুলে রাখলে, প্রতি ২ সেকেন্ডে একবার মানে প্রতি সেকেন্ডে 5,000
                Request, যার বেশিরভাগ শুধু বলে, কিছু বদলায়নি।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় সমস্যা <strong>দেরি</strong>। 3.5 সেকেন্ডে আসন বিক্রি হয়েছে,
                Poller জেনেছে 4.0 তে। 11.2 এর খবর এসেছে 12.0 তে। খবর পৌঁছাতে সবচেয়ে বেশি
                দেরি হতে পারে পুরো এক Interval, আর গড়ে তার অর্ধেক। দেরি কমাতে Interval
                ছোট করলে অপচয় বাড়ে, অপচয় কমাতে Interval বড় করলে দেরি বাড়ে। Short Polling
                এ এই দুইয়ের মাঝে একটা আপস বেছে নিতেই হয়, দুইটা একসাথে ভালো করা যায় না।
              </ContentParagraph>
              <ContentParagraph>
                অপচয়টা একটু কমানোর একটা ভদ্র উপায় আছে, যেটা লেসন ০৪ এ শিখেছেন। Server
                উত্তরের সাথে একটা ETag দেয়, আর Browser পরের Request এ সেটা If-None-Match এ
                ফেরত পাঠায়। কিছু না বদলালে Server Body ছাড়াই 304 Not Modified দেয়। এতে
                Byte কমে, কিন্তু Request এর সংখ্যা একটুও কমে না। Connection, TLS, Header,
                Session এর খোঁজ, সবই প্রতিবার হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Short Polling কখন একদম ঠিক আছে",
          content: (
            <p>
              খারাপ শোনালেও Short Polling কে ছোট করে দেখবেন না। খবর যদি কদাচিৎ বদলায়,
              দেরি কয়েক সেকেন্ড বা এক মিনিট হলেও কারো ক্ষতি নেই, আর ব্যবহারকারী কম,
              তাহলে এটাই সবচেয়ে ভালো উপায়, কারণ এর কোনো নতুন অংশ নেই যা ভাঙতে পারে।
              Island Tours এর Admin Dashboard এ আজকের বুকিংয়ের সংখ্যা প্রতি ৬০ সেকেন্ডে
              একবার Poll করে আনা হয়। ওই পাতা খোলা থাকে বড়জোর পাঁচজনের কাছে, আর সংখ্যাটা
              এক মিনিট পুরনো হলে কিছু যায় আসে না।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "long-polling",
      subHeader: { index: "003", title: "Long Polling" },
      title: <SectionTitle>Long Polling, উত্তর আসা পর্যন্ত লাইন ধরে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পার্সেল অফিসে এবার ফোন করেছেন। কাউন্টারের মানুষটা বললেন, লাইনে থাকুন,
                পার্সেল এলেই বলছি। আপনি ফোন কানে ধরে অপেক্ষা করছেন। পার্সেল এলো, তিনি
                বললেন এসেছে, আপনি ফোন রাখলেন আর সাথে সাথে আবার ফোন করলেন পরের পার্সেলের
                জন্য। আর অনেকক্ষণ কিছু না এলে তিনি বলেন, এখনো আসেনি, আবার ফোন করুন।
              </ContentParagraph>
              <ContentParagraph>
                Long Polling এ Browser একটা সাধারণ GET পাঠায়, সাথে বলে দেয় সে কতটুকু জানে:{" "}
                <code>?since=2</code>, মানে Version 2 পর্যন্ত আমার কাছে আছে। Server এর
                কাছে এর চেয়ে নতুন কিছু থাকলে সাথে সাথে উত্তর দেয়। না থাকলে উত্তরটা আটকে
                রাখে। Response এর Status Line পর্যন্ত পাঠায় না, শুধু Request টা মনে রেখে
                অপেক্ষা করে। আসন বিক্রি হওয়ার মুহূর্তে যত Request অপেক্ষায় আছে, সবগুলোর
                উত্তর একসাথে চলে যায়। আর একটা নির্দিষ্ট সময় পার হলে, সাধারণত ২০ থেকে ৩০
                সেকেন্ড, খালি একটা 204 No Content দিয়ে Request টা শেষ করে। Browser উত্তর
                পাওয়ার সাথে সাথে পরের Request পাঠায়। Lab এর দ্বিতীয় পরীক্ষায় একই দুইটা
                বিক্রি, ধরে রাখার সময় ৮ সেকেন্ড:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "2-long-poll.mjs, আসল ফলাফল",
          code: `   0.0s  [client] request 1 (sent  0.0s): 200, version 1, free 14A 14B 15A 15B 16A
   3.5s  [server] seat 14A sold, answering 1 waiting request(s)
   3.5s  [client] request 2 (sent  0.0s): 200, version 2, free 14B 15A 15B 16A
  11.2s  [server] seat 14B sold, answering 1 waiting request(s)
  11.2s  [client] request 3 (sent  3.5s): 200, version 3, free 15A 15B 16A
  19.2s  [client] request 4 (sent 11.2s): 204, nothing new, asking again
  27.2s  [client] request 5 (sent 19.2s): 204, nothing new, asking again

requests: 5`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsPollingTimelineDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলাফলটা পাশাপাশি পড়ুন। 3.5 সেকেন্ডে আসন বিক্রি হলো, আর একই 3.5
                সেকেন্ডে Client জানল। দেরি প্রায় শূন্য, শুধু Network এ যাওয়া আসার সময়।
                Request ও কম, প্রায় প্রতিটা খবরে একটা, আর মাঝে মাঝে একটা খালি 204।
                শেষ লাইনটা দেখে অবাক হবেন না: পাঁচ নম্বর Request টা ২০ সেকেন্ডের আগেই
                পাঠানো হয়েছিল, তাই Script টা তার পুরো ৮ সেকেন্ড অপেক্ষা করেছে।
              </ContentParagraph>
              <ContentParagraph>
                শুনতে নিখুঁত, কিন্তু Long Polling এর নিজের কিছু ফাঁদ আছে, আর এগুলো
                Production এ সত্যিই দেখা দেয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথের প্রতিটা Timeout ধরে রাখার সময়ের চেয়ে বড় হতে হয়।</strong>{" "}
                  Module 05 লেসন ০৮ এর Idle Timeout মনে করুন। Server যদি Request ৯০
                  সেকেন্ড ধরে রাখে আর মাঝের Load Balancer ৬০ সেকেন্ড চুপ দেখে Connection
                  কেটে দেয়, Browser পাবে 504 বা 502, আর Log এ রহস্যময় Error। তাই ধরে
                  রাখার সময় সাধারণত ৩০ সেকেন্ডের নিচে রাখা হয়।
                </ListItem>
                <ListItem>
                  <strong>দুই Request এর মাঝের ফাঁকে খবর হারাতে পারে।</strong> একটা উত্তর
                  এলো, পরের Request যাওয়ার আগের কয়েক মিলিসেকেন্ডে আরেকটা আসন বিক্রি হলো।
                  ওই মুহূর্তে কেউ অপেক্ষায় নেই, তাই সাথে সাথে কাউকে জানানো হলো না। এই
                  কারণেই Request এ <code>since</code> পাঠানো হয়। পরের Request এ Server
                  দেখে, আপনি তো Version 2 জানেন, আমার কাছে 3 আছে, এই নিন, অপেক্ষা ছাড়াই।
                  Version এর হিসাব না রাখলে খবর নীরবে হারায়।
                </ListItem>
                <ListItem>
                  <strong>অপেক্ষায় থাকা প্রতিটা Request Server এর কিছু ধরে রাখে।</strong>{" "}
                  Node এর মতো Event Loop এ এটা সস্তা, একটা ছোট Object মাত্র। কিন্তু যে
                  Server প্রতিটা Request এর জন্য একটা Thread রাখে (Module 01 এর Process
                  আর Thread), সেখানে দশ হাজার অপেক্ষমাণ Request মানে দশ হাজার ঘুমন্ত
                  Thread।
                </ListItem>
                <ListItem>
                  <strong>HTTP/1.1 এ Browser এর Connection এর সীমা।</strong> লেসন ০২ এ
                  দেখেছেন, HTTP/1.1 এ Browser এক Origin এর জন্য একসাথে সাধারণত ছয়টা
                  Connection খোলে। একটা আটকে থাকা Long Poll তার একটা দখল করে রাখে।
                  HTTP/2 তে এক Connection এ অনেক Stream চলে, তাই সমস্যাটা অনেক কমে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এত ঝামেলা সত্ত্বেও Long Polling আজও বেঁচে আছে একটা কারণে: এটা সাধারণ
                HTTP, তাই এমন জায়গাতেও চলে যেখানে আর কিছু চলে না, যেমন কড়া Corporate
                Proxy এর পেছনে। Socket.IO এর মতো Library গুলো WebSocket আটকে গেলে
                পেছনে এটাতেই ফিরে আসে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "server-sent-events",
      subHeader: { index: "004", title: "Server-Sent Events" },
      title: <SectionTitle>Server-Sent Events, একটা Response যেটা শেষ হয় না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                রেডিওর কথা ভাবুন। আপনি একবার Station টা ধরেন, তারপর Station নিজেই কথা
                বলে যায়, খবর এলেই পড়ে শোনায়। বারবার ধরতে হয় না। কিন্তু একই রেডিওতে আপনি
                Station কে কিছু বলতে পারেন না। কিছু বলতে চাইলে আলাদা করে ফোন করতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                Server-Sent Events ঠিক এই রেডিও। Browser একটা সাধারণ GET পাঠায়। Server
                উত্তর শুরু করে 200 আর <code>Content-Type: text/event-stream</code> দিয়ে,
                তারপর উত্তরটা আর শেষ করে না। যখনই নতুন খবর আসে, সেই একই Response এ কয়েক
                লাইন লিখে দেয়। লেসন ০২ এর Chunked Transfer Encoding মনে আছে? Body কত বড়
                তা আগে থেকে না জেনে অংশে অংশে পাঠানো। SSE সেই সুবিধাটাই ব্যবহার করে,
                শুধু অংশ পাঠানো আর থামায় না। Lab এর তৃতীয় পরীক্ষায় একটা বুকিংয়ের অবস্থা
                এভাবে আসে, curl দিয়ে দেখা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "curl -N .../bk_7Q2M9X/events, আসল ফলাফল",
          code: `$ curl -i -N http://localhost:47703/api/bookings/bk_7Q2M9X/events
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Date: Sat, 31 Oct 2026 06:30:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

retry: 3000

id: 1
event: status
data: {"booking":"bk_7Q2M9X","status":"pending"}

id: 2
event: status
data: {"booking":"bk_7Q2M9X","status":"payment_received"}

id: 3
event: status
data: {"booking":"bk_7Q2M9X","status":"seat_locked"}

id: 4
event: status
data: {"booking":"bk_7Q2M9X","status":"confirmed"}

: booking finished, closing the stream`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Format টা ইচ্ছা করে এত সরল রাখা, যাতে মানুষ চোখে পড়তে পারে। প্রতিটা
                লাইন একটা <code>নাম: মান</code>, আর একটা ফাঁকা লাইন মানে একটা Event শেষ।
                চারটা নাম আছে, আর এক লাইন যা দিয়ে শুরু হয় কোলন দিয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>data:</code> আসল খবর। প্রায় সবসময় একটা JSON। একাধিক data লাইন
                  থাকলে Browser সেগুলো নতুন লাইন দিয়ে জুড়ে একটা বার্তা বানায়।
                </ListItem>
                <ListItem>
                  <code>event:</code> খবরের ধরন। এটা না দিলে ধরন হয়{" "}
                  <code>message</code>। এখানে আমরা <code>status</code> দিয়েছি, তাই Browser
                  এর দিকে সেই নামেই শোনা হয়।
                </ListItem>
                <ListItem>
                  <code>id:</code> খবরের ক্রমিক নম্বর। Browser শেষ পাওয়া id টা মনে রাখে।
                  এর কাজটা একটু পরেই দেখবেন, এটাই SSE এর সবচেয়ে বুদ্ধিমান অংশ।
                </ListItem>
                <ListItem>
                  <code>retry:</code> লাইন কাটলে কত মিলিসেকেন্ড পরে আবার যুক্ত হবে, Server
                  এর পক্ষ থেকে Browser কে দেওয়া নিয়ম।
                </ListItem>
                <ListItem>
                  <code>:</code> দিয়ে শুরু হওয়া লাইন হলো Comment, Browser এটা উপেক্ষা
                  করে। কাজে লাগে Heartbeat হিসেবে: অনেকক্ষণ খবর না থাকলে প্রতি ১৫ থেকে ৩০
                  সেকেন্ডে একটা <code>: keep-alive</code> লিখে দিলে পথের কেউ Connection
                  টাকে চুপ ভেবে কেটে দেয় না (সেকশন ০০৯)।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Browser এর দিকে এর জন্য একটা তৈরি জিনিস আছে, <code>EventSource</code>।
                Library লাগে না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "booking-status.js",
          code: `// Browser এর পাতায়: Payment এর পরে বুকিংয়ের অবস্থা শোনা
const source = new EventSource("/api/bookings/bk_7Q2M9X/events");

source.addEventListener("status", (event) => {
  const update = JSON.parse(event.data);
  showStatus(update.status);           // pending, payment_received, ...
  console.log("last id:", event.lastEventId);
  if (update.status === "confirmed") source.close(); // আর শোনার দরকার নেই
});

source.addEventListener("error", () => {
  // লাইন কেটেছে। EventSource নিজেই retry এর সময় পরে আবার যুক্ত হবে।
  console.log("readyState:", source.readyState); // 0 মানে আবার যুক্ত হচ্ছে
});`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার id এর জাদু। লাইন কেটে গেলে EventSource নিজে থেকেই retry এর সময় পরে
                আবার যুক্ত হয়, কোনো Code লিখতে হয় না। আর আবার যুক্ত হওয়ার Request এর
                সাথে একটা Header জুড়ে দেয়, <code>Last-Event-ID</code>, শেষ যে id টা পেয়েছিল
                সেটা। Server চাইলে সেখান থেকেই আবার শুরু করতে পারে। Long Polling এ যে
                Version এর হিসাব নিজে বানাতে হতো, SSE তে সেটা নিয়মের ভেতরেই আছে। Lab এ
                curl দিয়ে এই Header টা হাতে পাঠিয়ে দেখুন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "আবার যুক্ত হওয়া, আসল ফলাফল",
          code: `$ curl -N -H "Last-Event-ID: 2" http://localhost:47703/api/bookings/bk_7Q2M9X/events
retry: 3000

id: 3
event: status
data: {"booking":"bk_7Q2M9X","status":"seat_locked"}

id: 4
event: status
data: {"booking":"bk_7Q2M9X","status":"confirmed"}

$ curl -i -H "Last-Event-ID: 4" http://localhost:47703/api/bookings/bk_7Q2M9X/events
HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 06:30:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsSseStreamDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ অংশটা একটা ফাঁদ এড়ানোর জন্য। Server Stream শেষ করে দিলেও EventSource
                সেটাকে লাইন কাটা ভাবে আর আবার যুক্ত হয়, তারপর আবার, অনন্তকাল। থামানোর
                দুইটা উপায়। পাতা নিজে <code>source.close()</code> ডাকে, অথবা Server
                আবার যুক্ত হওয়ার Request এ 204 দেয়। 200 আর text/event-stream ছাড়া অন্য
                যেকোনো উত্তর পেলে EventSource হাল ছেড়ে দেয়। আমাদের Lab Server সব খবর
                পাঠানো শেষ হলে ঠিক এটাই করে।
              </ContentParagraph>
              <ContentParagraph>SSE বেছে নেওয়ার আগে এর সীমাগুলো জেনে রাখুন।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>শুধু এক দিকে।</strong> Server থেকে Browser। Browser কিছু
                  পাঠাতে চাইলে সাধারণ POST করে। বুকিংয়ের অবস্থার মতো খবরের জন্য এটাই
                  যথেষ্ট, Chat এর জন্য একটু অস্বস্তিকর।
                </ListItem>
                <ListItem>
                  <strong>শুধু লেখা।</strong> UTF-8 Text, ছবি বা Binary নয়।
                </ListItem>
                <ListItem>
                  <strong>EventSource এ নিজের Header বসানো যায় না।</strong> তাই পরিচয়
                  দিতে হয় Cookie দিয়ে (লেসন ০৫)। অন্য Origin এ Cookie পাঠাতে{" "}
                  <code>{"new EventSource(url, { withCredentials: true })"}</code>, আর
                  Server এ লেসন ০৪ এর CORS Header লাগে।
                </ListItem>
                <ListItem>
                  <strong>Proxy এর Buffer।</strong> কিছু Proxy পুরো উত্তর জমিয়ে তারপর
                  পাঠায়, তাতে Event গুলো আটকে থাকে। Caddy এর নথি অনুযায়ী
                  text/event-stream উত্তর সে সাথে সাথে Flush করে, কিছু বলতে হয় না।
                  Nginx এ <code>proxy_buffering off</code> লাগে, অথবা App উত্তরে{" "}
                  <code>X-Accel-Buffering: no</code> Header দেয়। Compression এর
                  Middleware ও একই কারণে Event আটকে রাখতে পারে।
                </ListItem>
                <ListItem>
                  <strong>HTTP/1.1 এর ছয় Connection এর সীমা।</strong> একই সাইটের ছয়টা
                  Tab খোলা থাকলে ছয়টা Stream ছয়টা Connection খেয়ে ফেলে, সপ্তম Tab আটকে
                  যায়। HTTP/2 তে সব Stream এক Connection এ চলে, তাই আজকের Server এ এটা
                  সাধারণত সমস্যা নয় (লেসন ০২)।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "upgrade-handshake",
      subHeader: { index: "005", title: "Upgrade Handshake" },
      title: <SectionTitle>WebSocket এর জন্ম, একটা HTTP Request থেকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণের সব উপায়ে একটা জিনিস একই ছিল: প্রতিটা খবর HTTP এর কাঠামোর ভেতর
                দিয়ে আসছিল। WebSocket সেই কাঠামো থেকে বেরিয়ে যায়। ভাবুন একটা অফিসের
                সামনের ডেস্কে গিয়ে বললেন, আমাদের অনেক কথা আছে, প্রতিবার ফর্ম না ভরে একটা
                সরাসরি ফোন লাইন খুলে দেবেন? ডেস্কের মানুষটা রাজি হলেন, একটা লাইন খুলে
                দিলেন। এরপর থেকে ফর্মের কোনো নিয়ম নেই, দুইজন যখন খুশি কথা বলবেন।
              </ContentParagraph>
              <ContentParagraph>
                WebSocket এর নিয়ম লেখা আছে RFC 6455 এ, ২০১১ সালের। একটা TCP Connection এ
                দুই দিকের, একই সাথে চলা কথাবার্তা, যাকে বলে Full-duplex। Walkie-talkie তে
                একজন বলার সময় অন্যজনকে চুপ থাকতে হয়, সেটা Half-duplex। ফোনে দুইজন একই
                মুহূর্তে কথা বলতে পারেন, সেটা Full-duplex। আর শুরুটা হয় একটা সাধারণ
                HTTP/1.1 GET দিয়ে, যাতে পুরনো সব Server, Port 443 আর Proxy এর সাথে মানিয়ে
                চলা যায়। Browser এর দিকে পুরো জিনিসটা চার লাইনের:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "seat-map-socket.js",
          code: `// Browser এর পাতায়
const ws = new WebSocket("wss://islandtours.example/ws");

ws.addEventListener("open", () => {
  // readyState এখন 1, OPEN। এর আগে send করলে Error।
  ws.send(JSON.stringify({ type: "watch", tour: "saint-martin", date: "2026-12-20" }));
});
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "seat_sold") markSold(msg.seat);
});
ws.addEventListener("close", (event) => console.log("closed", event.code, event.reason));
ws.addEventListener("error", () => console.log("error, a close event follows"));

// readyState: 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <code>new WebSocket</code> ডাকার সাথে সাথে Browser আগে চেনা কাজগুলো সারে:
                DNS (Module 04), TCP Handshake (Module 05), আর wss হলে TLS Handshake
                (লেসন ০৭)। তারপর সেই Connection এ একটা HTTP Request পাঠায়, যার প্রতিটা
                লাইনের একটা কাজ আছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Request এর লাইন", "কে বসায়", "মানে"],
          rows: [
            [mono("GET /ws HTTP/1.1"), "Browser", "একটা সাধারণ GET। Method টা সবসময় GET, Version 1.1"],
            [mono("Host: islandtours.example"), "Browser", "কোন সাইট, লেসন ০২ এর মতোই"],
            [mono("Upgrade: websocket"), "Browser", "আমি এই Connection এ অন্য Protocol এ যেতে চাই, নাম websocket"],
            [mono("Connection: Upgrade"), "Browser", "পথের পরের জনকে জানানো, এই Connection টা বদলাচ্ছে। এই দুই Header ছাড়া কোনো Proxy রাস্তা খুলবে না"],
            [mono("Sec-WebSocket-Key"), "Browser", "16টা Random Byte, Base64 করা। প্রতিবার নতুন। এর উত্তরেই Server প্রমাণ দেবে"],
            [mono("Sec-WebSocket-Version: 13"), "Browser", "RFC 6455 এর সংস্করণ। আজ শুধু 13 ই চলে"],
            [mono("Origin"), "Browser, নিজে থেকে", "কোন সাইটের পাতা এই Socket খুলছে। নিরাপত্তার জন্য সবচেয়ে জরুরি লাইন, সেকশন ০১২"],
            [mono("Cookie"), "Browser, নিজে থেকে", "এই Host এর Cookie, অন্য যেকোনো Request এর মতো, SameSite এর নিয়ম মেনে (লেসন ০৫)"],
            [mono("Sec-WebSocket-Protocol"), "পাতা, চাইলে", "উপরে কোন ভাষায় কথা হবে তার প্রস্তাব, যেমন graphql-transport-ws। Server একটা বেছে নেয়"],
            [mono("Sec-WebSocket-Extensions"), "Browser", "যেমন permessage-deflate, প্রতিটা বার্তা Compress করার প্রস্তাব"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Server রাজি থাকলে 200 দেয় না। দেয় <strong>101 Switching Protocols</strong>,
                লেসন ০৩ এর সেই 1xx পরিবারের সদস্য, যার কথা তখন বলেছিলাম এই লেসনে আসবে। এর
                মানে, আপনার প্রস্তাবে রাজি, এই Connection এ এখন থেকে আমরা websocket এ কথা
                বলব। উত্তরে সাথে আসে <code>Upgrade: websocket</code>,{" "}
                <code>Connection: Upgrade</code>, আর একটা হিসাব করা লাইন,{" "}
                <code>Sec-WebSocket-Accept</code>। রাজি না থাকলে Server অন্য যেকোনো HTTP
                উত্তর দিতে পারে, আর Lab এ আমাদের Server সেটা করে: পরিচয় না থাকলে 401, ভুল
                সাইট থেকে এলে 403, Upgrade ছাড়া সাধারণ GET এলে 426 Upgrade Required।
              </ContentParagraph>
              <ContentParagraph>
                Accept এর হিসাবটা ছোট্ট। Server Browser এর Key এর পেছনে একটা নির্দিষ্ট
                লেখা জোড়ে, <code>258EAFA5-E914-47DA-95CA-C5AB0DC85B11</code>। এটা একটা GUID,
                RFC তে লেখা, পৃথিবীর প্রতিটা WebSocket Server এই একই লেখা ব্যবহার করে।
                তারপর পুরোটার SHA-1 Hash নেয়, যা 20 Byte, আর সেটা Base64 করে পাঠায়।
                Browser নিজেও একই হিসাব করে রাখে, আর দুইটা না মিললে Connection বাতিল।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsHandshakeLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Key আর Accept কোনো Password নয়",
          content: (
            <p>
              নামের সাথে Sec আছে বলে অনেকে ভাবেন এটা নিরাপত্তার জিনিস। নয়। GUID টা সবার
              জানা, যে কেউ হিসাবটা করতে পারে। এর একমাত্র কাজ প্রমাণ করা যে ওপাশে সত্যিই
              WebSocket বোঝে এমন একটা Server আছে, কোনো বিভ্রান্ত পুরনো Server বা Cache
              নয়, যে কিছু না বুঝে একটা পুরনো উত্তর ফেরত দিচ্ছে। আর নামের Sec অংশটার মানে
              হলো পাতার JavaScript এই Header গুলো নিজে বসাতে বা বদলাতে পারে না, Browser
              নিজে বসায়। কে Connection খুলছে, তার প্রমাণ আসে Cookie বা Token থেকে, আর কোন
              সাইট থেকে খুলছে তার প্রমাণ Origin থেকে।
            </p>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsUpgradeDiagram /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পাতা HTTP/2 তে, Socket HTTP/1.1 এ",
          content: (
            <p>
              Island Tours এর পাতা HTTP/2 তে আসে (লেসন ০২), অথচ উপরের Handshake লেখা
              HTTP/1.1। এটা ভুল নয়। HTTP/2 এর এক Connection এ অনেক Stream চলে, সেখানে
              একটা Connection কে পুরোপুরি অন্য Protocol এ বদলে দেওয়ার উপায় নেই। HTTP/2
              আর HTTP/3 এর উপরে WebSocket চালানোর আলাদা নিয়ম আছে, RFC 8441 আর RFC 9220,
              কিন্তু বেশিরভাগ Server আর Proxy আজও HTTP/1.1 এর Upgrade পথটাই ব্যবহার
              করে। তাই সাধারণত Browser Socket এর জন্য আলাদা একটা TCP Connection খোলে, ALPN
              এ http/1.1 বলে (লেসন ০৭)। এই লেসনে সেই চেনা পথটাই দেখানো হচ্ছে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "frames",
      subHeader: { index: "006", title: "Frames" },
      title: <SectionTitle>101 এর পরে: Frame, Opcode আর Mask</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                101 পাঠানোর পরের Byte থেকে এই TCP Connection এ আর কোনো HTTP নেই। নেই
                Request Line, নেই Header। তাহলে ওপাশ বুঝবে কীভাবে কোথায় একটা বার্তা শেষ
                আর পরেরটা শুরু? Module 05 লেসন ০৩ এর কথাটা মনে করুন: TCP একটা Byte এর
                ধারা, তার কোনো বার্তার সীমানা নেই। আপনি দুইটা বার্তা পাঠালে ওপাশে সেগুলো
                এক টুকরায় আসতে পারে, আবার একটা বার্তা দুই টুকরায় ভাগ হয়েও আসতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                WebSocket সীমানা ফিরিয়ে আনে <strong>Frame</strong> দিয়ে। প্রতিটা বার্তার
                সামনে একটা ছোট মাথা থাকে, যেখানে লেখা এটা কী ধরনের বার্তা আর কত Byte লম্বা।
                ওপাশ মাথাটা পড়ে, ঠিক ততগুলো Byte গোনে, তারপর জানে পরের Frame শুরু।
                Lab এর Server এর <code>readFrames</code> Function টা ঠিক এই কাজ করে, আর
                পুরো Frame না আসা পর্যন্ত বাকিটা জমিয়ে রাখে। একটা Frame এ কী কী থাকে:
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>FIN, 1 Bit:</strong> এই Frame এ বার্তাটা শেষ কি না। বড় একটা
                  বার্তাকে কয়েকটা Frame এ ভাগ করে পাঠানো যায়। শেষেরটা ছাড়া সবগুলোতে FIN 0।
                </ListItem>
                <ListItem>
                  <strong>RSV1 থেকে RSV3, 3 Bit:</strong> Extension এর জন্য রাখা।
                  permessage-deflate চালু থাকলে RSV1 মানে এই বার্তা Compress করা।
                </ListItem>
                <ListItem>
                  <strong>Opcode, 4 Bit:</strong> Frame এর ধরন, নিচের টেবিলে।
                </ListItem>
                <ListItem>
                  <strong>MASK, 1 Bit, আর Payload Length, 7 Bit:</strong> দৈর্ঘ্য 125
                  পর্যন্ত হলে এখানেই লেখা। 126 লেখা থাকলে আসল দৈর্ঘ্য পরের 2 Byte এ, 65,535
                  পর্যন্ত। 127 থাকলে পরের 8 Byte এ।
                </ListItem>
                <ListItem>
                  <strong>Masking Key, 4 Byte:</strong> শুধু Client থেকে আসা Frame এ।
                </ListItem>
                <ListItem>
                  <strong>Payload:</strong> আসল বার্তা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Opcode", "নাম", "কী বহন করে"],
          rows: [
            [mono("0x1"), "Text", "UTF-8 লেখা। অবৈধ UTF-8 এলে Connection বন্ধ করতে হয়, Code 1007"],
            [mono("0x2"), "Binary", "যেকোনো Byte, যেমন ছবি বা নিজের বানানো Format"],
            [mono("0x0"), "Continuation", "আগের ভাগ করা বার্তার পরের অংশ"],
            [mono("0x8"), "Close", "বিদায়, সাথে একটা Close Code (সেকশন ০০৭)"],
            [mono("0x9"), "Ping", "একটা ছোট খোঁচা, ওপাশে কেউ আছেন তো? পাওয়ামাত্র Pong দিতে হয়"],
            [mono("0xA"), "Pong", "Ping এর জবাব (সেকশন ০০৯)"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Close, Ping আর Pong কে বলে Control Frame। এগুলো ১২৫ Byte এর বেশি হতে পারে
                না, ভাগ করা যায় না, আর একটা বড় বার্তার ভাগের মাঝখানেও ঢুকে যেতে পারে, যাতে
                বড় একটা ছবি পাঠানোর সময়ও Heartbeat থেমে না যায়। নিচের ছবিতে RFC এর নিজের
                উদাহরণটা Byte ধরে ধরে খোলা, Browser থেকে পাঠানো Hello।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsFrameDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Mask এর প্রশ্ন। Browser থেকে Server এ যাওয়া প্রতিটা Frame কে একটা
                Random 4 Byte এর Key দিয়ে XOR করতে হয়, আর প্রতিটা Frame এ Key নতুন।
                Server থেকে Browser এ আসা Frame এ Mask থাকে না। Mask ছাড়া কোনো Frame
                Client থেকে এলে Server কে Connection বন্ধ করতে হয়, Code 1002 দিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথমেই একটা ভুল ধারণা সরাই: Mask কোনো Encryption নয়। Key টা তো Frame এর
                ভেতরেই লেখা, যে কেউ খুলতে পারে। তাহলে কেন? RFC চূড়ান্ত হওয়ার আগে
                গবেষকরা একটা সমস্যা দেখালেন। পথে এমন পুরনো Transparent Proxy আর Cache
                থাকে, যারা WebSocket বোঝে না আর Upgrade এর পরের Byte গুলোকেও HTTP ভেবে
                পড়ে। কোনো ক্ষতিকর পাতা যদি নিজের পছন্দের Byte পাঠাতে পারত, সে এমন Byte
                সাজাতে পারত যা দেখতে হুবহু একটা HTTP Request এর মতো, আর সেই বোকা Cache এ
                অন্য সাইটের নামে একটা ভুল উত্তর জমিয়ে দিতে পারত। এর নাম Cache Poisoning।
                Random Mask থাকায় পাতার JavaScript কখনো জানে না তারে ঠিক কোন Byte যাবে।
                তাই এমন সাজানো আর সম্ভব নয়। Mask পথের যন্ত্রগুলোকে রক্ষা করে, আপনার তথ্যকে
                নয়। তথ্য রক্ষা করে wss এর TLS (সেকশন ০০৮)।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsFrameLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "খরচের হিসাবটা এখানেই বদলায়",
          content: (
            <p>
              Server থেকে আসা একটা ছোট বার্তার মাথা মাত্র 2 Byte, Client থেকে গেলে 6 Byte।
              Short Polling এর প্রতিটা Request এ Header আর Cookie মিলে কয়েকশো Byte যায়,
              আর তার উত্তরেও আরও কয়েকশো। দশ হাজার পর্যটকের একটা আসন বিক্রির খবর WebSocket
              এ যায় দশ হাজারটা ছোট Frame এ, প্রতিটা পঞ্চাশ Byte এর মতো। কোনো Request নেই,
              কোনো Session খোঁজা নেই, কোনো নতুন TLS নেই। এই পার্থক্যটাই WebSocket এর আসল
              শক্তি।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "closing",
      subHeader: { index: "007", title: "Closing" },
      title: <SectionTitle>বিদায়: Close Frame আর Close Code</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Module 05 লেসন ০৮ এ শিখেছেন TCP কীভাবে ভদ্রভাবে বিদায় নেয়, FIN আর ACK
                দিয়ে। WebSocket এর বিদায় তার এক তলা উপরে, আর তার আগে ঘটে। TCP শুধু বলতে
                পারে আমার পাঠানো শেষ। কেন শেষ, সেটা বলতে পারে না। WebSocket এর Close Frame
                সেটা বলে: সাথে থাকে একটা 2 Byte এর Close Code, আর চাইলে ১২৩ Byte পর্যন্ত একটা
                কারণ লেখা।
              </ContentParagraph>
              <ContentParagraph>
                ক্রমটা এরকম। যে আগে বিদায় নিতে চায়, সে Close Frame পাঠায়। অন্যজন একটা
                Close Frame দিয়ে জবাব দেয়। এরপর TCP এর পালা, আর এখানে RFC একটা ছোট বুদ্ধি
                রেখেছে: TCP Connection টা সাধারণত Server আগে বন্ধ করে। কারণটা Module 05
                থেকে আপনি জানেন। যে আগে FIN পাঠায়, TIME_WAIT তার ঘাড়ে পড়ে। Client এর
                ঘাড়ে পড়লে সে কিছুক্ষণ একই চার সংখ্যার জোড়া দিয়ে আবার যুক্ত হতে পারত না।
                RFC 6455 নিজেই এই যুক্তি লিখে রেখেছে। Lab এ আমাদের Client{" "}
                <code>{'close(1000, "done")'}</code> ডাকলে Server এর Log এ ঠিক এই ক্রম দেখবেন:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দুই রকম বিদায়, আসল ফলাফল",
          code: `# ভদ্র বিদায়: Client close(1000) ডাকল
client  closed, code 1000, clean = true
server  client said goodbye, close code 1000
server  TCP connection closed

# হঠাৎ মৃত্যু: Server Process টা মেরে ফেলা হলো, কেউ Close Frame পাঠায়নি
client  error event (the close event follows)
client  closed, code 1006, clean = false`,
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Close Code", "নাম", "কখন দেখবেন"],
          rows: [
            [mono("1000"), "Normal Closure", "কাজ শেষ, দুই পাশ একমত। Chat থেকে বেরিয়ে যাওয়া"],
            [mono("1001"), "Going Away", "Tab বন্ধ, অন্য পাতায় যাওয়া, বা Server থামছে"],
            [mono("1002"), "Protocol Error", "নিয়ম ভাঙা Frame, যেমন Client থেকে Mask ছাড়া"],
            [mono("1003"), "Unsupported Data", "যে ধরনের বার্তা নেওয়া হয় না, যেমন শুধু Text নেয় এমন Server এ Binary"],
            [mono("1005"), "No Status Received", "Close এসেছে কিন্তু কোনো Code ছাড়া। তারে কখনো পাঠানো হয় না, শুধু পড়ার সময় দেখায়"],
            [mono("1006"), "Abnormal Closure", "Close Frame ছাড়াই Connection মরে গেছে। এটাও তারে যায় না, Browser নিজে লেখে"],
            [mono("1007"), "Invalid Payload", "Text Frame এ অবৈধ UTF-8"],
            [mono("1008"), "Policy Violation", "নিয়মের বাইরে কিছু, যেমন পরিচয় যাচাই ব্যর্থ"],
            [mono("1009"), "Message Too Big", "Server এর সীমার চেয়ে বড় বার্তা। Lab এর Server 64 KB এর বেশি হলে এটা দেয়"],
            [mono("1011"), "Internal Error", "Server এর ভেতরের সমস্যা, HTTP এর 500 এর মতো"],
            [mono("1012"), "Service Restart", "Server নতুন করে চালু হচ্ছে, একটু পরে আবার আসুন"],
            [mono("1013"), "Try Again Later", "এখন ভিড়, পরে চেষ্টা করুন"],
            [mono("4000 থেকে 4999"), "আপনার নিজের", "App এর নিজের কারণ, যেমন Island Tours এ 4001 মানে Session শেষ"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Log এ 1006 মানে কেউ বিদায় বলেনি",
          content: (
            <p>
              Production এর Log এ সবচেয়ে বেশি যে Code টা দেখবেন, সেটা 1006। এর মানে কোনো
              পাশ থেকে Close Frame আসেনি, Connection টা হঠাৎ মরে গেছে। কারণ হতে পারে Server
              এর Process Crash, Deploy এর সময় হঠাৎ থামানো, পথের কোনো যন্ত্রের Idle Timeout,
              অথবা ফোনের Network বদল। এটা নিজে কোনো Bug নয়, Network এ এটা ঘটবেই। Bug হলো
              এর পরে আবার যুক্ত না হওয়া (সেকশন ০১১)। আর ভালো Server থামার আগে নিজে থেকে
              1001 বা 1012 পাঠায়, যাতে Client বুঝতে পারে এটা পরিকল্পিত বিদায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "wss-and-proxies",
      subHeader: { index: "008", title: "wss and Proxies" },
      title: <SectionTitle>ws:// আর wss://, আর পথের Caddy</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WebSocket এর দুইটা Scheme, লেসন ০১ এর URL এর মতোই।{" "}
                <code>ws://</code> মানে সরাসরি TCP এর উপর, Default Port 80।{" "}
                <code>wss://</code> মানে TLS এর ভেতরে, Default Port 443, ঠিক http আর https
                এর জোড়ার মতো। Production এ সবসময় wss, তিনটা কারণে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>গোপনীয়তা।</strong> Handshake এ Cookie যায়, আর তারপর প্রতিটা
                  বার্তা। ws এ এগুলো পথের সবাই পড়তে পারে, লেসন ০৭ এ যে ক্যাফের Wi-Fi এর
                  গল্প দেখেছেন।
                </ListItem>
                <ListItem>
                  <strong>Mixed Content।</strong> https এ খোলা পাতা থেকে ws:// খুলতে গেলে
                  Browser নিজেই আটকে দেয়, ঠিক যেমন https পাতায় http এর Script আটকায়।
                </ListItem>
                <ListItem>
                  <strong>পথের বোকা যন্ত্র।</strong> অনেক অফিসের Proxy আর কিছু Antivirus
                  Port 80 এর সব কিছু HTTP ভেবে খুলে দেখে, আর Upgrade এর পরের অচেনা Byte দেখে
                  Connection নষ্ট করে দেয়। wss এ তারা শুধু Encrypted Byte দেখে, খোলার চেষ্টা
                  করে না, পার করে দেয়। তাই wss শুধু নিরাপদ নয়, বেশি নির্ভরযোগ্যও।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Island Tours এ ফোনের wss Connection টা শেষ হয় Caddy তে। লেসন ০৭ আর ০৯ এ
                দেখেছেন, Caddy সেখানে TLS খুলে ফেলে, তারপর VPS এর ভেতরে App এর সাথে কথা
                বলে <code>127.0.0.1:3000</code> এ সাধারণ ws এ। WebSocket এর জন্য Caddy তে
                আলাদা কিছু লিখতে হয় না। Caddy এর নথিতে লেখা, reverse_proxy WebSocket
                নিজেই চেনে, Upgrade Request টা App কে পাঠায় আর 101 এর পরে দুই দিকের একটা
                সুড়ঙ্গ বানিয়ে দেয়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsProxyPathDiagram /> },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "Caddyfile (নমুনা)",
          code: `islandtours.example {
	reverse_proxy 127.0.0.1:3000 {
		# Config Reload এর সময় খোলা WebSocket গুলো সাথে সাথে বন্ধ না করে
		# ৫ মিনিট সময় দেওয়া, যাতে সবাই একসাথে আবার যুক্ত হতে না আসেন
		stream_close_delay 5m
	}
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ওই একটা লাইনের পেছনে একটা জরুরি তথ্য আছে, যেটা Caddy এর নথিতে স্পষ্ট
                লেখা। Default অবস্থায় Caddy এর Config Reload হলে সব খোলা WebSocket জোর
                করে বন্ধ হয়, দুই পাশে Close পাঠিয়ে। একটা সামান্য Config বদলে দশ হাজার
                পর্যটক একসাথে বিচ্ছিন্ন, আর একসাথে ফিরে আসার চেষ্টা (সেকশন ০১১ এর ঢল)।{" "}
                <code>stream_close_delay</code> পুরনো Connection গুলোকে কিছুক্ষণ বাঁচিয়ে
                রাখে, যাতে মানুষ নিজের মতো পাতা ছেড়ে যান। এই যন্ত্রে Caddy চালানো হয়নি,
                তাই উপরের Caddyfile টা নমুনা, নিজের Domain আর Port বসিয়ে নেবেন।
              </ContentParagraph>
              <ContentParagraph>
                Nginx এ কাজটা হাতে করতে হয়, আর ভুলের জায়গাও এখানে বেশি। Upgrade আর
                Connection Header দুইটা Hop-by-hop, মানে Nginx নিজে থেকে সেগুলো App এর কাছে
                পাঠায় না। আর Nginx এর Default নিয়মে App ৬০ সেকেন্ড কিছু না পাঠালে
                Connection কেটে যায়। নিচের নমুনাটা নিজের যন্ত্রে মিলিয়ে নেবেন, এখানে
                চালিয়ে দেখা হয়নি।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "nginx",
          filename: "nginx.conf (নমুনা)",
          code: `# Upgrade Header থাকলে Connection: upgrade, না থাকলে close
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    server_name islandtours.example;
    # listen 443 ssl আর Certificate এর লাইনগুলো লেসন ০৮ এর মতো

    location /ws {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;                     # Upgrade শুধু 1.1 এ
        proxy_set_header Upgrade $http_upgrade;     # Hop-by-hop, হাতে পাঠাতে হয়
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;                   # Default 60s, চুপ থাকলে কাটে
    }
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Load Balancer আর Cloudflare",
          content: (
            <p>
              Layer 4 এর Load Balancer শুধু TCP পার করে, WebSocket নিয়ে তার কোনো মাথাব্যথা
              নেই (Module 05 লেসন ০১)। Layer 7 এর Load Balancer কে WebSocket বুঝতে হয়,
              আজকের প্রায় সবগুলোই বোঝে, কিন্তু প্রতিটার নিজের Idle Timeout আছে। Module 04
              লেসন ০৭ এর Cloudflare এর Proxied Record ও WebSocket পার করে। এদের প্রত্যেকের
              Timeout কত, সেটা নিজের Dashboard আর নথিতে দেখে নেবেন। পরের সেকশনের Heartbeat
              এর সময় সেই সংখ্যার চেয়ে ছোট রাখতে হবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "heartbeat",
      subHeader: { index: "009", title: "Heartbeat" },
      title: <SectionTitle>Heartbeat: চুপ থাকা Connection বাঁচিয়ে রাখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা আসনের মানচিত্রে দুপুরবেলা দশ মিনিট কিছুই না ঘটতে পারে। সেই দশ মিনিট
                Connection টা চুপচাপ পড়ে থাকে, তারে একটা Byte ও যায় না। আর এখানেই দুইটা
                বিপদ, দুইটাই আপনি Module 05 লেসন ০৮ এ চিনেছেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথের যন্ত্র ভুলে যায়।</strong> বাসার Router এর NAT টেবিল,
                  মোবাইল Operator এর CGNAT (Module 03 লেসন ১০), Firewall, Load Balancer,
                  প্রত্যেকে চুপ থাকা Connection কিছুক্ষণ পরে টেবিল থেকে মুছে ফেলে। এরপর
                  Server খবর পাঠালে সেটা আর ফোন পর্যন্ত পৌঁছায় না। কেউ জানেও না।
                </ListItem>
                <ListItem>
                  <strong>ওপাশ নীরবে হারিয়ে যায়।</strong> ফোন সুড়ঙ্গে ঢুকল, Battery
                  শেষ হলো, Wi-Fi থেকে Mobile Data তে গেল। কোনো FIN নেই, কোনো RST নেই। এর
                  নাম Half-open। Server ভাবে পর্যটক এখনো দেখছেন, তাঁর জন্য Memory ধরে
                  রাখে, খবর পাঠিয়ে যায় শূন্যে। দিনের শেষে হাজার হাজার মৃত Connection জমে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দুইটারই ওষুধ এক: নিয়মিত একটা ছোট খোঁচা, যাকে বলে Heartbeat। WebSocket এর
                জন্য নিয়মের ভেতরেই এর ব্যবস্থা আছে, Ping আর Pong Frame। Server নির্দিষ্ট
                সময় পরপর একটা Ping পাঠায়। Browser নিজে থেকে, পাতার কোনো Code ছাড়াই, সাথে
                সাথে Pong ফেরত দেয়। এতে দুইটা কাজ একসাথে হয়। পথের প্রতিটা যন্ত্র দেখে
                Connection এ কিছু চলছে, তাদের ঘড়ি আবার শূন্য থেকে শুরু হয়। আর আগের Ping এর
                Pong না এলে Server জানে ওপাশে কেউ নেই, Connection টা নিজে মেরে ফেলে।
              </ContentParagraph>
              <ContentParagraph>
                Lab এর Server প্রতি ৫ সেকেন্ডে Ping দেয়। একটা পরীক্ষায় Client এর Process
                টা <code>kill -STOP</code> দিয়ে জমিয়ে দেওয়া হয়েছিল, ঠিক যেমন একটা ফোন
                হঠাৎ সাড়া দেওয়া বন্ধ করে, FIN না পাঠিয়ে। Server এর Log:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "মৃত Client ধরা, আসল ফলাফল",
          code: `101 sent to 127.0.0.1:63791, now speaking frames
got text (masked=true, 15 bytes): seat 14A please
got text (masked=true, 23 bytes): আসন 14A চাই
no pong since last ping, dropping a dead connection
TCP connection closed`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Heartbeat এর সময় কীভাবে বাছবেন? নিয়ম একটাই: পথের সবচেয়ে অধৈর্য যন্ত্রের
                Idle Timeout এর চেয়ে ছোট। Load Balancer ৬০ সেকেন্ডে কাটলে ২৫ থেকে ৩০
                সেকেন্ড একটা প্রচলিত পছন্দ, যাতে একটা Ping হারালেও পরেরটা সময়মতো পৌঁছায়।
                খুব ছোট রাখবেন না। ফোনের Radio প্রতিটা Ping এ জেগে ওঠে, আর তাতে Battery
                খরচ হয়।
              </ContentParagraph>
              <ContentParagraph>
                একটা জিনিস অনেককে অবাক করে। Browser এর WebSocket API তে পাতার JavaScript
                Ping পাঠাতে পারে না, Pong দেখতেও পারে না। Browser এগুলো নিজে সামলায়। ফলে
                Server মারা গেলে Browser এর দিক থেকে সেটা ধরার উপায় Ping নয়। তাই অনেক App
                নিজের একটা বার্তা দিয়ে Heartbeat বানায়: Server প্রতি ২৫ সেকেন্ডে পাঠায়{" "}
                <code>{'{"type":"tick"}'}</code>, আর পাতা দুইবারের সময় পার হয়েও কিছু না পেলে
                নিজে Connection বন্ধ করে আবার যুক্ত হয়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "TCP Keepalive কেন যথেষ্ট নয়",
          content: (
            <p>
              Module 05 এ TCP এর নিজের Keepalive দেখেছেন। তাহলে আবার কেন? কারণ Linux এ তার
              Default অপেক্ষা দুই ঘণ্টা, ততক্ষণে NAT টেবিল বহু আগে ভুলে গেছে। আর TCP
              Keepalive Kernel এর ভেতরে ঘটে, App জানে না। একটা Proxy মাঝে থাকলে Kernel এর
              Keepalive শুধু Proxy পর্যন্ত যায়, ওপাশের পর্যটক পর্যন্ত নয়। WebSocket এর Ping
              পুরো পথ পার হয়ে Browser পর্যন্ত যায় আর ফেরে, আর App নিজের চোখে দেখে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "scaling",
      subHeader: { index: "010", title: "Scaling" },
      title: <SectionTitle>অনেক Server, অনেক Connection</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                সাধারণ HTTP তে প্রতিটা Request স্বাধীন। একটা Request এক Server এ গেল, পরেরটা
                অন্যটায়, কিছু আসে যায় না, কারণ Session থাকে Redis এ (লেসন ০৬)। WebSocket এ
                ব্যাপারটা আলাদা। একটা Connection খোলা হলে সারা জীবন সেটা একটাই Server এর
                একটাই Process এর সাথে বাঁধা। এই একটা তথ্য থেকে বড় হওয়ার সব সমস্যা আসে।
              </ContentParagraph>
              <ContentParagraph>
                প্রথম সমস্যা <strong>খবর ছড়ানো</strong>, ইংরেজিতে Fan-out। ধরুন API এর
                দুইটা Container চলছে। পর্যটক A এর Socket API 1 এ, C আর D এর API 2 তে। পর্যটক
                B এর বুকিং গেল API 1 এ। API 1 নিজের পর্যটকদের জানাতে পারে, কিন্তু API 2 তে
                কারা বসে আছেন সে জানে না। সমাধান মাঝখানে একটা ডাকঘর, সাধারণত Redis এর
                Pub/Sub। প্রতিটা Container একটা Channel এ SUBSCRIBE করে রাখে, যেমন{" "}
                <code>seats:saint-martin:2026-12-20</code>। বুকিং যে Container এ হলো, সে
                সেই Channel এ PUBLISH করে। Redis সেটা সব Subscriber কে পৌঁছে দেয়, আর
                প্রত্যেকে নিজের পর্যটকদের Frame পাঠায়।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsFanOutDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দ্বিতীয় সমস্যা <strong>সীমা গোনা</strong>। প্রতিটা খোলা Connection
                Server এর কিছু জিনিস সারাক্ষণ ধরে রাখে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>একটা File Descriptor।</strong> Module 05 লেসন ০৭ এর{" "}
                  <code>EMFILE</code> আর <code>ulimit -n</code> মনে করুন। দশ হাজার পর্যটক
                  মানে দশ হাজার খোলা Socket, আর Caddy এর পেছনে App এর দিকে আরও দশ হাজার।
                  Process এর সীমা ১০২৪ থাকলে এক হাজারের পরেই নতুন কেউ ঢুকতে পারবেন না।
                </ListItem>
                <ListItem>
                  <strong>Caddy থেকে App এর পথে একটা Ephemeral Port।</strong> পর্যটকদের
                  দিকে কোনো সমস্যা নেই, কারণ প্রত্যেকের নিজের IP আর Port, চার সংখ্যার জোড়া
                  আলাদা। কিন্তু Caddy থেকে <code>127.0.0.1:3000</code> এর দিকে প্রতিটা
                  Connection এ Caddy নিজের একটা Ephemeral Port খরচ করে। Module 05 লেসন ০৭ এ
                  গুনেছেন, Linux এর Default পরিসরে সেটা 28,232 টা। একটা Caddy থেকে একটাই
                  App এর ঠিকানায় একসাথে এর বেশি Socket খোলা যাবে না। উপায় হলো App কে
                  একাধিক Port বা Container এ চালানো।
                </ListItem>
                <ListItem>
                  <strong>Memory।</strong> প্রতিটা Socket এর পড়ার আর লেখার Buffer, আর
                  আপনার নিজের রাখা তথ্য। সংখ্যাটা ছোট, কিন্তু দশ হাজার দিয়ে গুণ করলে বড়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তৃতীয় সমস্যা <strong>ধীর পাঠক</strong>, ইংরেজিতে Backpressure। পাহাড়ি এলাকার
                দুর্বল নেটওয়ার্কে বসা একজন পর্যটক Server যত দ্রুত পাঠায় তত দ্রুত নিতে
                পারেন না। না যাওয়া Frame গুলো Server এর Memory তে জমতে থাকে। Node এ{" "}
                <code>socket.write</code> false ফেরত দিলে বা{" "}
                <code>socket.writableLength</code> বাড়তে থাকলে সেটাই সংকেত। Browser এর দিকে
                একই জিনিস দেখায় <code>ws.bufferedAmount</code>। আসনের মানচিত্রে নিয়মটা সহজ:
                পুরনো Update জমিয়ে রাখার মানে নেই, জমে গেলে পুরনোগুলো ফেলে দিয়ে শুধু সর্বশেষ
                অবস্থাটা পাঠানো, আর অনেক বেশি জমলে ওই Connection টা বন্ধ করে দেওয়া।
              </ContentParagraph>
              <ContentParagraph>
                আর একটা কথা, যেটা নিয়ে অনেক বিভ্রান্তি। Sticky Session, মানে একই ব্যবহারকারীকে
                সবসময় একই Server এ পাঠানো, খাঁটি WebSocket এর জন্য দরকার হয় না, কারণ
                Connection নিজেই একটা Server এ আটকে থাকে। দরকার হয় তখন, যখন একটা লজিক্যাল
                Session একাধিক আলাদা HTTP Request এ ছড়ানো, যেমন Socket.IO যখন WebSocket না
                পেয়ে Long Polling এ ফিরে যায়। তখন প্রতিটা Poll কে একই Server এ পৌঁছাতে হয়।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "reconnect",
      subHeader: { index: "011", title: "Reconnect" },
      title: <SectionTitle>আবার যুক্ত হওয়া, ঢল না নামিয়ে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা WebSocket ভাঙবেই, প্রশ্ন শুধু কখন। Module 03 লেসন ১১ এর ফোনটা মনে
                করুন: Wi-Fi থেকে Mobile Data তে গেলেই ফোনের IP বদলে যায়, আর TCP এর চার
                সংখ্যার জোড়ার একটা বদলালে সেটা আর আগের Connection নয় (Module 05 লেসন ০৭)।
                HTTP/3 এর QUIC এর Connection Migration এটা সামলাতে পারে (লেসন ০২), কিন্তু
                TCP এর উপরে চলা WebSocket পারে না। ল্যাপটপ ঘুমিয়ে যায়, Deploy হয়, Caddy এর
                Config Reload হয়। প্রতিবার Client কে নিজে থেকে আবার যুক্ত হতে হয়।
              </ContentParagraph>
              <ContentParagraph>
                সবচেয়ে সরল Code হলো close হলেই সাথে সাথে আবার চেষ্টা, না পারলে এক সেকেন্ড
                পরে আবার। একজন পর্যটকের জন্য এটা ঠিক আছে। কিন্তু Deploy এর সময় দশ হাজার
                Connection একসাথে ভাঙে, আর দশ হাজার Client একই মুহূর্তে ফিরে আসার চেষ্টা
                করে। নতুন চালু হওয়া Server কে প্রতিটার জন্য TCP আর TLS Handshake করতে হয়,
                Session যাচাই করতে হয়। সে ডুবে যায়, বেশিরভাগ চেষ্টা ব্যর্থ হয়, আর ব্যর্থরা
                আবার একসাথে ফিরে আসে। এর নাম Thundering Herd, ছুটে আসা পালের ঢল।
              </ContentParagraph>
              <ContentParagraph>
                ওষুধ দুইটা, আর দুইটাই লাগে। <strong>Exponential Backoff:</strong> প্রতিটা
                ব্যর্থতার পরে অপেক্ষা দ্বিগুণ, ১, ২, ৪, ৮ সেকেন্ড, একটা সর্বোচ্চ সীমা পর্যন্ত।
                আর <strong>Jitter:</strong> সেই অপেক্ষাটা সবার জন্য হুবহু এক না রেখে
                প্রত্যেকে সীমার ভেতরে একটা Random সময় বেছে নেয়। শুধু Backoff দিলে কী হয়,
                নিচে নিজেই দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsReconnectLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lab এর ছয় নম্বর Client এ এই নিয়মটাই লেখা। Server চালু অবস্থায় Client যুক্ত
                হলো, তারপর ১১ সেকেন্ডে Server থামানো হলো আর ৩ সেকেন্ড পরে আবার চালু করা হলো।
                Client এর আসল Log দেখুন, প্রতিবার অপেক্ষার সীমা দ্বিগুণ হচ্ছে, আর আসল অপেক্ষা
                তার ভেতরে যেকোনো একটা সংখ্যা:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "6-client.mjs, Server থামিয়ে আবার চালু করা, আসল ফলাফল",
          code: `open, readyState = 1
got: echo: seat 14A please
got: echo: আসন 14A চাই
error event (the close event follows)
closed, code 1006, clean = false
reconnect attempt 1 in 61 ms (ceiling 500 ms)
error event (the close event follows)
closed, code 1006, clean = false
reconnect attempt 2 in 435 ms (ceiling 1000 ms)
error event (the close event follows)
closed, code 1006, clean = false
reconnect attempt 3 in 1813 ms (ceiling 2000 ms)
error event (the close event follows)
closed, code 1006, clean = false
reconnect attempt 4 in 2680 ms (ceiling 4000 ms)
open, readyState = 1
got: echo: seat 14A please
got: echo: আসন 14A চাই
closed, code 1000, clean = true`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আবার যুক্ত হওয়ার কাজ এখানে শেষ নয়, অর্ধেক মাত্র। Connection যতক্ষণ ভাঙা
                ছিল, ততক্ষণে হয়তো আরও তিনটা আসন বিক্রি হয়েছে। নতুন Socket খুললেই সেই খবর
                ফিরে আসে না। SSE তে Last-Event-ID এই কাজটা করে দিত, WebSocket এ নিজে বানাতে
                হয়। Island Tours এ নিয়মটা এরকম। প্রতিটা Update এর সাথে একটা Version নম্বর
                যায়। আবার যুক্ত হওয়ার পরে পাতা আগে সাধারণ HTTP তে পুরো ছবিটা আনে,{" "}
                <code>GET /api/tours/saint-martin/seats</code>, যার সাথে তার Version থাকে।
                তারপর Socket এ শুধু সেই Version এর পরের Update গুলো নেয়। পুরো ছবি HTTP তে,
                বদলগুলো Socket এ, এই জোড়াটা মনে রাখবেন। এতে কোনো খবর হারায় না, আর কোনো
                খবর দুইবার গোনাও হয় না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>সব Close এ আবার চেষ্টা নয়।</strong> 1008 বা নিজের 4001 মানে
                  পরিচয় নেই বা Session শেষ। বারবার চেষ্টা করে লাভ নেই, পর্যটককে Login এ
                  পাঠাতে হবে, বা Mobile App এ Refresh Token দিয়ে নতুন Token আনতে হবে (লেসন ০৬)।
                </ListItem>
                <ListItem>
                  <strong>সফল হলে হিসাব আবার শূন্য।</strong> না হলে পরের বার ভাঙলে প্রথম
                  চেষ্টাই আট সেকেন্ড পরে হবে।
                </ListItem>
                <ListItem>
                  <strong>Browser এর ইঙ্গিত শুনুন।</strong> <code>offline</code> ঘটনায়
                  চেষ্টা থামানো, <code>online</code> হলে সাথে সাথে একবার চেষ্টা। Tab টা
                  পেছনে গেলে <code>visibilitychange</code> দেখে Socket বন্ধ রাখা, সামনে এলে
                  খোলা। এতে Server এর বোঝা আর ফোনের Battery দুইটাই বাঁচে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "security",
      subHeader: { index: "012", title: "Security" },
      title: <SectionTitle>WebSocket এর নিরাপত্তা: দরজায় কে আসছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই সেকশনের প্রথম বাক্যটাই সবচেয়ে জরুরি: <strong>WebSocket এ CORS নেই।</strong>{" "}
                লেসন ০৪ এ দেখেছেন, অন্য Origin এর পাতা fetch দিয়ে আপনার API ডাকলে Browser
                উত্তরটা পাতাকে পড়তে দেয় না, যদি না Server CORS Header দিয়ে অনুমতি দেয়।
                WebSocket এর ক্ষেত্রে Browser এই পাহারা দেয় না। যেকোনো সাইটের পাতা যেকোনো
                Server এ WebSocket খুলতে পারে। Browser শুধু Handshake এ Origin Header টা
                সত্যি করে বসিয়ে দেয়। সেটা দেখে সিদ্ধান্ত নেওয়ার দায় পুরোটাই Server এর।
              </ContentParagraph>
              <ContentParagraph>
                এবার আক্রমণটা ভাবুন। একজন পর্যটক islandtours.example এ Login করা অবস্থায়
                অন্য Tab এ attacker.example খুললেন। সেই পাতার JavaScript চুপচাপ খুলল{" "}
                <code>wss://islandtours.example/ws</code>। Cookie যদি এই Request এ যায়, তাহলে
                Server ভাববে পর্যটক নিজেই এসেছেন, আর আক্রমণকারীর পাতা তাঁর নামে Socket এ
                সব বার্তা পড়তে আর পাঠাতে পারবে। লেসন ০৫ এর CSRF এ আক্রমণকারী শুধু পাঠাতে
                পারত, উত্তর পড়তে পারত না। এখানে দুইটাই পারে। এর নাম Cross-Site WebSocket
                Hijacking।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর Cookie এ <code>SameSite=Lax</code> (লেসন ০৫)। অন্য সাইট থেকে
                খোলা WebSocket কোনো Top-level Navigation নয়, তাই Lax Cookie সেখানে যায় না,
                আক্রমণটা প্রথম ধাপেই আটকে যায়। কিন্তু শুধু এটার উপর ভরসা করবেন না। লেসন ০৫
                এর Same-site আর Cross-origin এর তফাত মনে করুন:{" "}
                <code>blog.islandtours.example</code> একই Site, তাই সেখান থেকে খোলা Socket এ
                Lax Cookie ঠিকই যায়। Blog এ কোনোদিন একটা XSS এর ফুটো থাকলে সেই পাতা
                পর্যটকের নামে Socket খুলতে পারবে। Origin যাচাই সেটা থামায়। তাই নিয়মটা হলো
                দুই স্তর: Cookie এর SameSite, আর Server এ Origin এর একটা অনুমতির তালিকা, যা
                আসে Environment Variable থেকে। Lab এর Server ঠিক এটাই করে, আর curl দিয়ে
                পরীক্ষা করলে উত্তর আসে 101 এর আগেই:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "দরজার পাহারা, আসল ফলাফল",
          code: `== 4. অন্য সাইট থেকে এলে
HTTP/1.1 403 Forbidden
== 5. Cookie ছাড়া এলে
HTTP/1.1 401 Unauthorized`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পরিচয় দেওয়ার উপায় Client এর ধরন অনুযায়ী আলাদা, কারণ Browser এর WebSocket
                API তে নিজের Header বসানো যায় না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Website:</strong> Cookie, যেটা Handshake এ নিজে থেকেই যায়। একই
                  Site এর App এর জন্য এটাই সবচেয়ে ভালো, কারণ HttpOnly Cookie পাতার
                  JavaScript পড়তেও পারে না (লেসন ০৫)।
                </ListItem>
                <ListItem>
                  <strong>Mobile App:</strong> Browser নয়, তাই নিজের Header বসাতে পারে।
                  Island Tours এর App Handshake এ পাঠায়{" "}
                  <code>Authorization: Bearer</code> সহ তার ১৫ মিনিটের Access JWT (লেসন
                  ০৬)। Lab এর Node Client ও এভাবেই Header বসায়।
                </ListItem>
                <ListItem>
                  <strong>অন্য Origin এর পাতা:</strong> আগে সাধারণ HTTP তে, নিয়মিত পরিচয়
                  দিয়ে, একটা এক বারের Ticket নেওয়া, যার মেয়াদ ৩০ সেকেন্ড। তারপর Socket খুলে
                  প্রথম বার্তাতেই সেটা পাঠানো। Server Ticket মিলিয়ে দেখে আর মুছে ফেলে।
                </ListItem>
                <ListItem>
                  <strong>যা কখনো নয়:</strong> URL এর Query তে লম্বা মেয়াদের Token,{" "}
                  <code>wss://.../ws?token=...</code>। লেসন ০১ এ দেখেছেন, URL জমা হয় Caddy
                  এর Access Log এ, Monitoring এ, Error Report এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আরও তিনটা জিনিস, যা শুধু লম্বা সময় খোলা থাকা Connection এর সমস্যা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Connection Session এর চেয়ে বেশি দিন বাঁচতে পারে।</strong> পর্যটক
                  অন্য Tab এ Logout করলেন, Redis থেকে Session মুছে গেল (লেসন ০৬)। কিন্তু
                  খোলা Socket টা জানে না। তাই Logout এর সময় Redis এ একটা খবর PUBLISH করা
                  হয়, আর যে Container এ সেই Session এর Socket আছে সে সেটা 4001 দিয়ে বন্ধ করে।
                  JWT এর বেলায় Server তার exp মনে রাখে, সময় পার হলে Socket বন্ধ।
                </ListItem>
                <ListItem>
                  <strong>প্রতিটা বার্তা অচেনা মানুষের লেখা।</strong> Handshake এ পরিচয়
                  যাচাই হয়েছে মানে প্রতিটা বার্তা নিরাপদ নয়। প্রতিটার Schema যাচাই,
                  আকারের সীমা (Lab এ 64 KB, তার বেশি হলে 1009), প্রতি Connection এ Rate
                  Limit, আর প্রতিটা কাজের অনুমতি: এই পর্যটক কি এই নৌকার আসন ধরে রাখতে পারেন?
                </ListItem>
                <ListItem>
                  <strong>Compression নিয়ে সাবধান।</strong> OWASP এর WebSocket Cheat Sheet
                  পরামর্শ দেয়, দরকার না হলে permessage-deflate বন্ধ রাখতে। গোপন তথ্য আর
                  আক্রমণকারীর নিয়ন্ত্রিত লেখা একসাথে Compress হলে, Compress করা আকার দেখে
                  গোপন অংশ আন্দাজ করার পুরনো কৌশল আছে। তার উপর প্রতিটা Connection এ
                  Compression এর জন্য আলাদা Memory লাগে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "choosing",
      subHeader: { index: "013", title: "Choosing" },
      title: <SectionTitle>কোনটা কখন: চারটা উপায় পাশাপাশি</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              চারটা উপায়ই দেখা হলো। এবার একই পরিস্থিতিতে চারটাকে পাশাপাশি চালিয়ে দেখুন।
              নিচের Lab এ আসনে বদলের সংখ্যা, Poll এর Interval আর পর্যটকের সংখ্যা বদলে
              দেখুন কোন কার্ডের কোন সংখ্যা কীভাবে নড়ে।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsCompareLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["উপায়", "দিক", "Browser এ যা লাগে", "পথে বাধা", "কখন বেছে নেবেন"],
          rows: [
            ["Short Polling", "Client চায়", "fetch আর একটা Timer", "কোনো বাধা নেই", "কদাচিৎ বদল, অল্প ব্যবহারকারী, দেরি চলে। Admin Dashboard"],
            ["Long Polling", "Client চায়, Server ধরে রাখে", "fetch এর একটা Loop", "পথের Timeout ধরে রাখার সময়ের চেয়ে বড় চাই", "WebSocket আটকে গেলে বিকল্প, পুরনো পরিবেশ"],
            ["SSE", "শুধু Server থেকে", "EventSource", "Proxy এর Buffer বন্ধ রাখা", "এক দিকের খবরের ধারা। বুকিংয়ের অবস্থা, Notification, Live Score, AI এর লেখা একটু একটু আসা"],
            ["WebSocket", "দুই দিকেই", "WebSocket", "Upgrade বোঝে এমন Proxy, Heartbeat", "ঘনঘন দুই দিকের কথা। Chat, আসনের Live মানচিত্র, একসাথে Document লেখা, Game"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নিয়মটা এক লাইনে: যেটা দিয়ে কাজ হয়, তার মধ্যে সবচেয়ে সরলটা নিন। অনেকে
                Real-time শুনলেই WebSocket বসিয়ে দেন, তারপর Heartbeat, Reconnect, Fan-out,
                Proxy এর Config, সব সামলাতে গিয়ে হিমশিম খান, অথচ দরকার ছিল শুধু Server থেকে
                কয়েকটা খবর, যা SSE অর্ধেক Code এ করত। আবার উল্টোটাও ঘটে: Chat এ SSE আর POST
                জোড়া দিয়ে চালানো, যেখানে প্রতিটা বার্তা একটা নতুন Request।
              </ContentParagraph>
              <ContentParagraph>আরও তিনটা নাম, যেগুলো এই আলোচনায় আসবেই।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Socket.IO:</strong> WebSocket নয়, WebSocket এর উপরে বানানো নিজের
                  একটা Protocol। Room, বার্তা পৌঁছানোর নিশ্চিতকরণ, নিজে থেকে আবার যুক্ত
                  হওয়া আর Long Polling এ ফিরে যাওয়া দেয়। তাই একটা খাঁটি WebSocket Client
                  Socket.IO Server এর সাথে কথা বলতে পারে না, দুই পাশেই Socket.IO লাগে।
                </ListItem>
                <ListItem>
                  <strong>WebTransport:</strong> HTTP/3 আর QUIC এর উপরে নতুন একটা Web API
                  (লেসন ০২)। এক Connection এ অনেকগুলো আলাদা Stream, আর হারালেও চলে এমন
                  বার্তা। আজ শুধু নামটা জেনে রাখুন।
                </ListItem>
                <ListItem>
                  <strong>Web Push:</strong> পুরোপুরি আলাদা জিনিস। Tab বন্ধ থাকলেও ফোনে
                  Notification পৌঁছানো, Browser এর নিজের Push Service এর মাধ্যমে। আসনের
                  মানচিত্রের জন্য নয়, কাল সকালে নৌকা ছাড়ার মনে করিয়ে দেওয়ার জন্য।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "see-it",
      subHeader: { index: "014", title: "Hands-on" },
      title: <SectionTitle>নিজের চোখে দেখা: DevTools, curl আর Node</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                WebSocket দেখার সবচেয়ে সহজ জায়গা আপনার Browser। যেকোনো Live Chat বা Live
                Score এর সাইট খুলে DevTools এর Network ট্যাবে যান, আর এভাবে পড়ুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  উপরের Filter এ <strong>Socket</strong> বেছে নিন (পুরনো সংস্করণে লেখা থাকে
                  WS)। শুধু WebSocket এর Request গুলো থাকবে। Status Column এ দেখবেন 101।
                </ListItem>
                <ListItem>
                  একটা Request এ Click করুন। <strong>Headers</strong> এ পুরো Handshake:
                  Upgrade, Connection, Sec-WebSocket-Key, তার উত্তরে Sec-WebSocket-Accept।
                </ListItem>
                <ListItem>
                  <strong>Messages</strong> ট্যাবে প্রতিটা Frame, সময় আর আকার সহ। উপরমুখী
                  তীর মানে Browser পাঠিয়েছে, নিচমুখী মানে Server থেকে এসেছে।
                </ListItem>
                <ListItem>
                  SSE এর জন্য Filter এ Fetch/XHR, তারপর Request খুলে{" "}
                  <strong>EventStream</strong> ট্যাব। প্রতিটা Event এর id, event আর data
                  আলাদা সারিতে।
                </ListItem>
                <ListItem>
                  Console এ নিজেও একটা খুলে দেখতে পারেন, যেকোনো wss ঠিকানায়:{" "}
                  <code>new WebSocket(url)</code>, তারপর readyState দেখুন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Terminal এ curl দিয়ে Handshake টা হাতে পাঠানো যায়। এই যন্ত্রের curl Frame
                বোঝে না, তাই 101 পর্যন্ত গিয়ে থেমে থাকে, আর সেটুকুই আমাদের দেখার। Lab এর
                পাঁচ নম্বর Script এর আসল ফলাফল, প্রথমে Accept এর হিসাব দুইভাবে, তারপর আসল
                Handshake আর দুইটা প্রত্যাখ্যান:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "bash 5-handshake.sh, আসল ফলাফল",
          code: `== 1. Accept হাতে হিসাব, openssl দিয়ে
s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
== 2. একই হিসাব, Node দিয়ে
s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
== 3. আসল Handshake, সব ঠিক থাকলে 101
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

== 4. অন্য সাইট থেকে এলে
HTTP/1.1 403 Forbidden
== 5. Cookie ছাড়া এলে
HTTP/1.1 401 Unauthorized
== 6. সাধারণ GET, Upgrade ছাড়া
HTTP/1.1 426 Upgrade Required
Upgrade: websocket
Content-Type: text/plain
Date: Sat, 31 Oct 2026 06:31:51 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

this address speaks WebSocket only`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                আর Node এ কোনো Package ছাড়াই একটা আসল Client। Node এর নথি অনুযায়ী
                WebSocket এখন Node এর একটা Global, Browser এর মতোই একই API, আর Node 22 থেকে
                এটা Default এ চালু থাকে। এই যন্ত্রে Node 25 চলছে। Server এর দিকে Node এ
                তৈরি কিছু নেই। সাধারণত <code>ws</code> নামের Package ব্যবহার হয়, কিন্তু
                এই লেসনে আমরা <code>node:http</code> এর <code>upgrade</code> ঘটনা ধরে
                Handshake আর Frame নিজের হাতে লিখেছি, যাতে কিছুই অদেখা না থাকে। দুই পাশের
                আসল Log:
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "4-ws-server.mjs আর 6-client.mjs, আসল ফলাফল",
          code: `# Server
WebSocket lab on ws://localhost:47704/ws
101 sent to 127.0.0.1:62825, now speaking frames
got text (masked=true, 15 bytes): seat 14A please
got text (masked=true, 23 bytes): আসন 14A চাই
pong, the client is alive
pong, the client is alive

# Client
open, readyState = 1
got: echo: seat 14A please
got: echo: আসন 14A চাই`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "তিনটা জিনিস খেয়াল করুন",
          content: (
            <p>
              প্রথমত, Server এর Log এ প্রতিটা বার্তার পাশে masked=true। Node এর Client
              নিয়ম মেনে নিজে থেকেই Mask করেছে, আমরা কিছু বলিনি। দ্বিতীয়ত, ইংরেজি বার্তাটা
              15 অক্ষর আর 15 Byte, কিন্তু বাংলাটা 11 অক্ষরে 23 Byte, কারণ UTF-8 (লেসন ০১)।
              তৃতীয়ত, pong এর লাইন দুইটা। Server প্রতি ৫ সেকেন্ডে Ping পাঠিয়েছে, আর Client
              এর Code এ Pong এর কোনো লাইন নেই, তবুও Pong গেছে। Browser আর Node দুইটাই এই
              কাজ নিজে করে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours, নৌকার জীবন্ত আসনের মানচিত্র</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসনের শুরুর সেই 409 এর গল্পটা Island Tours এর সত্যিকারের অভিযোগ থেকে।
                ছুটির মৌসুমে একই আসনে দুইজনের Click এর মাঝে কয়েক সেকেন্ডের ফাঁক থাকত, আর
                একজন হতাশ হতেন। দল যা যা ঠিক করল, প্রতিটার পেছনে এই লেসনের একটা অংশ আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>আসনের মানচিত্র WebSocket এ।</strong> পাতা খুলে{" "}
                  <code>wss://islandtours.example/ws</code>। এখানে কথা দুই দিকেই চলে:
                  পর্যটক একটা আসন Click করলে সেটা পাঁচ মিনিটের জন্য ধরে রাখার বার্তা যায়,
                  ছেড়ে দিলে আরেকটা, আর অন্যদের ধরা আর কেনা প্রতি মুহূর্তে আসে। এত ঘনঘন দুই
                  দিকের কথার জন্য WebSocket ই ঠিক জিনিস।
                </ListItem>
                <ListItem>
                  <strong>বুকিংয়ের অবস্থা SSE তে।</strong> Payment এর পরের পাতা শোনে{" "}
                  <code>/api/bookings/bk_7Q2M9X/events</code>। খবর শুধু এক দিকে, অল্প কয়েকটা,
                  তাই WebSocket এর পুরো আয়োজনের দরকার নেই। confirmed এলে পাতা নিজেই
                  Stream বন্ধ করে।
                </ListItem>
                <ListItem>
                  <strong>দরজায় দুই স্তরের পাহারা।</strong> Handshake এ{" "}
                  <code>__Host-session</code> Cookie আসে, App সেটা Redis এ মেলায়। আর
                  Origin মেলানো হয় <code>ALLOWED_ORIGINS</code> Environment Variable এর
                  তালিকার সাথে। Variable টা না থাকলে App চালুই হয় না, কোনো Default ঠিকানা
                  ধরে নেয় না। Mobile App আসে Authorization Header এ তার JWT নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>Heartbeat এর সময় Config থেকে।</strong> App প্রতি{" "}
                  <code>WS_HEARTBEAT_MS</code> পরপর Ping দেয়, যা পথের সবচেয়ে ছোট Idle
                  Timeout এর চেয়ে ছোট রাখা। একটা Pong না এলে পরের বার Connection বন্ধ।
                  সাথে প্রতি ২৫ সেকেন্ডে একটা tick বার্তা, যাতে পাতাও জানে Server বেঁচে আছে।
                </ListItem>
                <ListItem>
                  <strong>খবর ছড়ায় Redis এর Pub/Sub দিয়ে।</strong> আজ API একটাই Container এ
                  চলে, তবুও প্রতিটা আসনের খবর Redis এর Channel হয়ে আসে। যেদিন দ্বিতীয়
                  Container চালু হবে, সেদিন একটা লাইনও বদলাতে হবে না।
                </ListItem>
                <ListItem>
                  <strong>Deploy এর দিনেও কেউ টের পান না।</strong> Caddy তে{" "}
                  <code>stream_close_delay</code>, App থামার আগে সব Socket এ 1012 পাঠায়
                  (Module 05 লেসন ০৮ এর Graceful Shutdown), আর পাতা ফেরে Backoff আর Jitter
                  মেনে। ফিরে এসে আগে HTTP তে পুরো মানচিত্র, তারপর Socket এ শুধু নতুন
                  Version এর বদল।
                </ListItem>
                <ListItem>
                  <strong>বার্তার সীমা।</strong> একটা বার্তা 16 KB এর বেশি নয়, প্রতি
                  Connection এ প্রতি সেকেন্ডে সীমিত সংখ্যক বার্তা, আর প্রতিটা বার্তার Schema
                  যাচাই। ধীর ফোনের জন্য জমে থাকা পুরনো Update ফেলে দিয়ে শুধু সর্বশেষটা।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                ফলাফল: আসন বিক্রির খবর অন্য সব পর্যটকের পর্দায় পৌঁছায় এক সেকেন্ডের অনেক কম
                সময়ে। 409 এখনো আসে, কারণ দুইজন একই মিলিসেকেন্ডে Click করতেই পারেন, আর
                শেষ বিচারক সবসময় Database (লেসন ০৩)। কিন্তু এখন সেটা বিরল ঘটনা, প্রতিদিনের
                হতাশা নয়।
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
      title: <SectionTitle>আসন 14A বিক্রি, এক Click থেকে আরেকজনের পর্দায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটক ঢাকায় বসে ফোনে আসনের মানচিত্র খুলে রেখেছেন। চট্টগ্রামে আরেকজন আসন
              14A কিনছেন। প্রথম জনের পর্দায় আসনটা কীভাবে ধূসর হয়, শুরু থেকে শেষ।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "পাতা আসে, তারপর Socket খোলে",
              description:
                "/tours/saint-martin পাতাটা HTTPS এ এলো (লেসন ০৯)। পাতার JavaScript আগে GET /api/tours/saint-martin/seats দিয়ে পুরো মানচিত্র আনল, Version 41। তারপর new WebSocket(\"wss://islandtours.example/ws\")।",
            },
            {
              title: "নতুন TCP আর TLS",
              description:
                "Browser 103.94.135.2:443 এ নতুন একটা TCP Connection খুলল, ফোনের দিকে Port 51522, বাসার Router এর NAT এ বাইরে 203.0.113.25:62005। তারপর TLS Handshake, ALPN এ http/1.1।",
            },
            {
              title: "Upgrade Request",
              description:
                "GET /ws, সাথে Upgrade: websocket, Connection: Upgrade, একটা নতুন Sec-WebSocket-Key, Origin: https://islandtours.example, আর __Host-session Cookie। Caddy TLS খুলে Request টা 127.0.0.1:3000 এ App কে দিল।",
            },
            {
              title: "App দরজা খোলে",
              description:
                "App Origin মেলাল ALLOWED_ORIGINS এর সাথে, Session মেলাল Redis এ, তারপর 101 Switching Protocols আর Sec-WebSocket-Accept। Caddy 101 টা ফেরত দিয়ে দুই দিকের সুড়ঙ্গ বানাল। Browser Accept মিলিয়ে দেখল, readyState হলো OPEN।",
            },
            {
              title: "পাতা জানায় সে কী দেখছে",
              description:
                "পাতা প্রথম Frame পাঠাল: watch, saint-martin, 2026-12-20, since 41। Mask করা Text Frame। App এই Socket কে সেই নৌকার তালিকায় রাখল।",
            },
            {
              title: "অন্য পর্যটক কেনেন",
              description:
                "চট্টগ্রামের পর্যটকের POST /api/bookings গেল সাধারণ HTTP তে। Database এ বুকিং লেখা হলো, উত্তর 201 আর Location: /api/bookings/bk_7Q2M9X (লেসন ০৩)। App খবরটা Redis এর seats:saint-martin:2026-12-20 Channel এ PUBLISH করল, Version 42।",
            },
            {
              title: "খবর Socket এ ঢোকে",
              description:
                "যে Container গুলো Channel এ SUBSCRIBE করে আছে, প্রত্যেকে খবরটা পেল আর নিজের তালিকার প্রতিটা Socket এ একটা ছোট Text Frame লিখল: seat_sold, 14A, Version 42। Server থেকে যাওয়া, তাই Mask নেই।",
            },
            {
              title: "ফোনের পর্দায় ধূসর",
              description:
                "Caddy Frame টা TLS এ মুড়ে পাঠাল, NAT পার হয়ে ফোনে পৌঁছাল। Browser Frame খুলে message ঘটনা দিল, পাতা 14A কে ধূসর করল। বুকিং থেকে এই পর্যন্ত এক সেকেন্ডের অনেক কম।",
            },
            {
              title: "চুপচাপ সময়ে Heartbeat",
              description:
                "এরপর কয়েক মিনিট কোনো বিক্রি নেই। App নির্দিষ্ট সময় পরপর Ping দিল, Browser নিজে Pong দিল। NAT টেবিল আর Caddy প্রতিবার দেখল Connection টা বেঁচে আছে।",
            },
            {
              title: "বিদায়",
              description:
                "পর্যটক Tab বন্ধ করলেন। Browser Close Frame পাঠাল, Code 1001, Going Away। App জবাব দিল আর TCP বন্ধ করল আগে, তাই TIME_WAIT পড়ল Server এর দিকে (Module 05 লেসন ০৮)। App এই Socket কে নৌকার তালিকা থেকে সরিয়ে দিল।",
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
                <strong>নিচের Lab টা আগে করুন</strong>। ছয়টা পরীক্ষায় Polling এর অপচয়,
                SSE এর Last-Event-ID, হাতে লেখা একটা WebSocket Server আর Reconnect এর
                Jitter, সব নিজের যন্ত্রে ঘটবে। এর চেয়ে ভালো শিক্ষক নেই।
              </ListItem>
              <ListItem>
                <strong>RFC 6455</strong>, WebSocket এর মূল নিয়ম। Section 1.3 এর Handshake,
                5.2 এর Frame এর ছবি আর 5.7 এর উদাহরণগুলো এই লেসনের সাথে মিলিয়ে পড়ুন।{" "}
                {link("https://www.rfc-editor.org/rfc/rfc6455", "rfc-editor.org/rfc/rfc6455")}
              </ListItem>
              <ListItem>
                <strong>MDN এর WebSockets API</strong>, Browser এর দিকের সব ঘটনা, readyState,
                bufferedAmount আর Close Code।{" "}
                {link("https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", "developer.mozilla.org, WebSockets API")}
              </ListItem>
              <ListItem>
                <strong>MDN এর Using server-sent events</strong>, EventSource, Format আর
                আবার যুক্ত হওয়ার নিয়ম।{" "}
                {link("https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events", "developer.mozilla.org, Server-sent events")}
              </ListItem>
              <ListItem>
                <strong>Node.js এর http নথি</strong>, upgrade ঘটনা আর Global WebSocket।{" "}
                {link("https://nodejs.org/api/http.html", "nodejs.org/api/http.html")}
              </ListItem>
              <ListItem>
                <strong>Caddy এর reverse_proxy নথি</strong>, Streaming অংশে WebSocket,
                stream_close_delay আর text/event-stream এর Flush।{" "}
                {link("https://caddyserver.com/docs/caddyfile/directives/reverse_proxy", "caddyserver.com, reverse_proxy")}
              </ListItem>
              <ListItem>
                <strong>Nginx এর WebSocket proxying</strong>, Upgrade আর Connection Header
                কেন হাতে পাঠাতে হয়।{" "}
                {link("https://nginx.org/en/docs/http/websocket.html", "nginx.org/en/docs/http/websocket.html")}
              </ListItem>
              <ListItem>
                <strong>OWASP WebSocket Security Cheat Sheet</strong>, Origin যাচাই, পরিচয়,
                বার্তার সীমা আর Compression এর ঝুঁকি এক পাতায়।{" "}
                {link("https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html", "cheatsheetseries.owasp.org, WebSocket Security")}
              </ListItem>
              <ListItem>
                <strong>Exponential Backoff And Jitter</strong>, AWS এর Architecture Blog এর
                লেখা, কেন Jitter ছাড়া Backoff অর্ধেক সমাধান, Simulation সহ।{" "}
                {link("https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/", "aws.amazon.com, Backoff and Jitter")}
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
      title: <SectionTitle>৫ মিনিটে পুরো লেসন, আর পুরো Module</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>প্রথমে এই লেসনটা, নয় লাইনে।</ContentParagraph>
              <ContentList>
                <ListItem>
                  HTTP তে Server শুধু উত্তর দেয়। Real-time মানে Server নিজে থেকে, জিজ্ঞেস
                  ছাড়াই, প্রায় সাথে সাথে খবর পৌঁছানো, অর্থাৎ Push।
                </ListItem>
                <ListItem>
                  Short Polling সরল আর সব জায়গায় চলে, কিন্তু অপচয় আর দেরির মাঝে আপস করতে
                  হয়। Long Polling দেরি প্রায় শূন্য করে, কিন্তু পথের Timeout আর Version এর
                  হিসাব সামলাতে হয়।
                </ListItem>
                <ListItem>
                  SSE একটা শেষ না হওয়া text/event-stream Response। শুধু Server থেকে, নিজে
                  থেকে আবার যুক্ত হয়, আর Last-Event-ID দিয়ে যেখানে ছিল সেখান থেকে শুরু।
                </ListItem>
                <ListItem>
                  WebSocket শুরু হয় Upgrade চাওয়া একটা HTTP/1.1 GET দিয়ে। উত্তর 101 আর
                  Sec-WebSocket-Accept, যা Key আর GUID এর SHA-1 এর Base64। এটা প্রমাণ, কোনো
                  Password নয়।
                </ListItem>
                <ListItem>
                  101 এর পরে শুধু Frame: FIN, Opcode, দৈর্ঘ্য, Client এর দিকে Mask, তারপর
                  Payload। Mask পথের Cache কে রক্ষা করে, তথ্যকে নয়।
                </ListItem>
                <ListItem>
                  বিদায় আগে Close Frame আর Code দিয়ে, তারপর TCP FIN। Log এ 1006 মানে কেউ
                  বিদায় বলেনি।
                </ListItem>
                <ListItem>
                  Production এ সবসময় wss। Caddy নিজে WebSocket চেনে, Nginx এ Upgrade আর
                  Connection হাতে পাঠাতে হয়। Ping আর Pong পথের Idle Timeout আর নীরবে
                  হারানো Client দুইটাই সামলায়।
                </ListItem>
                <ListItem>
                  প্রতিটা Socket একটা Server এ বাঁধা: খবর ছড়াতে Pub/Sub, File Descriptor আর
                  Port এর সীমা, ধীর পাঠকের জন্য Backpressure। ভাঙলে Backoff আর Jitter দিয়ে
                  ফেরা, আর ফিরে HTTP তে পুরো ছবি।
                </ListItem>
                <ListItem>
                  WebSocket এ CORS নেই। Server নিজে Origin মেলায়, পরিচয় যাচাই করে, প্রতিটা
                  বার্তা যাচাই করে, আর Session শেষ হলে Socket বন্ধ করে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার পুরো Module। দশটা লেসন দশটা আলাদা বিষয় মনে হতে পারে, কিন্তু আসলে
                আপনি দশবার একই জিনিস দেখেছেন, দশ দিক থেকে। জিনিসটা হলো TCP এর তৈরি করা
                নির্ভরযোগ্য রাস্তার উপর দিয়ে যাওয়া একটা চিঠি।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WsModuleStoryDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                গল্পটা একবার টানা বলি, যেভাবে আপনি অন্য কাউকে বলবেন।
              </ContentParagraph>
              <ContentParagraph>
                পর্যটক Address Bar এ লিখলেন{" "}
                <code>https://islandtours.example/tours/saint-martin</code>। Browser প্রথমে
                সেটাকে ভেঙে ভেঙে পড়ল: Scheme https, Host islandtours.example, Port না লেখা
                তাই 443, Path /tours/saint-martin। আর এই তিনটা, Scheme, Host আর Port, মিলে
                পাতাটার Origin, যা দিয়ে পরে Cookie আর CORS এর সব নিয়ম ঠিক হবে (লেসন ০১)।
              </ContentParagraph>
              <ContentParagraph>
                DNS আর TCP এর পরে Browser যে কথাটা বলল, সেটা আসলে কয়েক লাইনের একটা লেখা:
                একটা Request Line, কিছু Header, একটা ফাঁকা লাইন। Server এর উত্তরও তেমনি,
                একটা Status Line দিয়ে শুরু। প্রতিটা Request স্বাধীন, Server আগের কথা মনে
                রাখে না, আর একই IP তে অনেক সাইট থাকতে পারে বলে Host Header বলে দেয় কোনটা।
                আজকের HTTP/2 সেই একই অর্থ Binary Frame এ এক Connection এ অনেকগুলো একসাথে
                পাঠায় (লেসন ০২)।
              </ContentParagraph>
              <ContentParagraph>
                Request Line এর প্রথম শব্দটা Method, Server কে বলে কী করতে চাই: GET দেখতে,
                POST নতুন বুকিং বানাতে। আর উত্তরের তিন অঙ্কের Status Code বলে কী হলো: 201
                বুকিং হয়েছে, 409 আসন আর নেই, 502 পেছনের App সাড়া দেয়নি। কোন Request আবার
                পাঠানো নিরাপদ, সেটাও এই দুইটা থেকে বোঝা যায় (লেসন ০৩)।
              </ContentParagraph>
              <ContentParagraph>
                Header গুলো চিঠির খামের লেখা: এটা কী ধরনের জিনিস, কতক্ষণ Cache করা যাবে, কোন
                সাইট পাঠাল, কোন সাইটকে উত্তর পড়তে দেওয়া যাবে। এখান থেকেই আসে Content-Type,
                Cache-Control, ETag আর 304, আর CORS (লেসন ০৪)। সেই খামের একটা লাইন,
                Set-Cookie, ভুলে যাওয়া Server কে একটা স্মৃতি দেয়: Browser পরের প্রতিটা Request
                এ সেটা ফেরত আনে, আর HttpOnly, Secure, SameSite ঠিক করে কে সেটা পড়তে পারবে আর
                কোথায় যাবে (লেসন ০৫)। সেই Cookie এর ভেতরে থাকে একটা Session ID, যা দিয়ে
                Server Redis এ পর্যটককে চিনে নেয়, অথবা Mobile App এর ক্ষেত্রে একটা Signed JWT,
                যা Server খোঁজাখুঁজি ছাড়াই যাচাই করে (লেসন ০৬)।
              </ContentParagraph>
              <ContentParagraph>
                এই সব কিছু ক্যাফের Wi-Fi আর প্রতিটা Hop এর সামনে খোলা থাকত, যদি না TLS থাকত।
                TLS Handshake এ দুই পাশ একটা গোপন Key এ একমত হয়, যা পথের কেউ জানে না, আর
                তারপর প্রতিটা Byte Encrypted আর অক্ষত যায় (লেসন ০৭)। কিন্তু ওপাশে যে আছে সে
                সত্যিই islandtours.example কি না, সেটা প্রমাণ করে Certificate: একটা Public
                Key, তার মালিকের নাম, আর একটা CA এর Signature, যার Chain গিয়ে মেলে ফোনের
                ভেতরে রাখা Root এর সাথে (লেসন ০৮)।
              </ContentParagraph>
              <ContentParagraph>
                লেসন ০৯ এ এই সব অংশ এক Request এ জোড়া লেগেছিল, Keypress থেকে পর্দায় পাতা,
                প্রতিটা ধাপের সময় মেপে। আর আজ, শেষ লেসনে, সেই চিঠির নিয়মটাই আমরা ভাঙলাম।
                একটা HTTP Request 101 পেয়ে নিজেকে একটা দুই দিকের পাইপে বদলে নিল, যেখানে
                Server ও আগে কথা বলতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                এই কয়েকটা অনুচ্ছেদ যদি আপনি না দেখে বলতে পারেন, আর প্রতিটা বাক্যে কেউ কেন
                জিজ্ঞেস করলে উত্তর দিতে পারেন, তাহলে এই Module আপনার হয়ে গেছে। আর তখন আপনি
                এটা অন্যকে শেখাতেও পারবেন, কারণ শেখানো মানে আসলে এই কেন গুলোর উত্তর দেওয়া।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর Module 07, Linux & VPS Fundamentals",
          content: (
            <p>
              এই পুরো Module এ একটা জায়গা আমরা প্রতিবার ছুঁয়ে গেছি কিন্তু ভেতরে ঢুকিনি:
              VPS টা, যেখানে Caddy চলে, যেখানে App Port 3000 এ বসে আছে, যেখানে Certificate
              আর Private Key একটা Folder এ রাখা, আর যেখানে প্রতিটা Request এর Access Log জমা
              হয়। সেই যন্ত্রটা একটা Linux। Caddyfile ঠিক কোন Folder এ থাকে, Log খুঁজতে
              কোথায় যাবেন, Private Key এর File এর অনুমতি 600 কীভাবে বসায়, আর App কে Server
              চালু হলেই কে চালু করে দেয়, এই সব প্রশ্নের উত্তর পরের Module এ। শুরু হবে Linux
              এর Folder গুলোর মানচিত্র দিয়ে। প্রথম লেসন: Linux Filesystem Architecture।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Real-time", "জিজ্ঞেস ছাড়াই প্রায় সাথে সাথে খবর পাওয়া। Pull এর বদলে Push"],
      ["Short Polling", "Interval পরপর সাধারণ GET। সরল, কিন্তু খালি উত্তর আর Interval সমান দেরি"],
      ["Long Polling", "Server Request ধরে রাখে খবর বা Timeout পর্যন্ত। since দিয়ে খবর না হারানো"],
      ["SSE", "text/event-stream এর একটা শেষ না হওয়া Response। এক দিকে, EventSource, নিজে থেকে আবার যুক্ত"],
      ["Last-Event-ID", "আবার যুক্ত হওয়ার সময় শেষ পাওয়া id। Server সেখান থেকে শুরু করে। 204 পেলে EventSource আর ফেরে না"],
      ["Upgrade", "GET এ Upgrade: websocket আর Connection: Upgrade, উত্তরে 101 Switching Protocols"],
      ["Sec-WebSocket-Accept", "Base64(SHA-1(Key + নির্দিষ্ট GUID))। Server WebSocket বোঝে তার প্রমাণ, নিরাপত্তা নয়"],
      ["Frame", "FIN, Opcode, দৈর্ঘ্য, Mask, Payload। TCP এর Byte ধারায় বার্তার সীমানা"],
      ["Mask", "Client থেকে যাওয়া প্রতি Frame এ নতুন Random 4 Byte এর XOR। পথের Cache রক্ষা, Encryption নয়"],
      ["Close Code", "1000 স্বাভাবিক, 1001 চলে যাওয়া, 1006 Close ছাড়াই মৃত্যু, 1008 নিয়ম ভাঙা, 4000+ নিজের"],
      ["wss", "TLS এর ভেতরে WebSocket, Port 443। Production এ সবসময় এটাই"],
      ["Ping, Pong", "Heartbeat। পথের Idle Timeout আর নীরবে হারানো Client দুইটাই সামলায়"],
      ["Fan-out", "এক Container এর খবর সব Container এর Socket এ, Redis Pub/Sub দিয়ে"],
      ["Backoff, Jitter", "ব্যর্থ হলে অপেক্ষা দ্বিগুণ, আর প্রত্যেকের আলাদা Random সময়, যাতে ঢল না নামে"],
      ["Origin যাচাই", "WebSocket এ CORS নেই। Server নিজে অনুমতির তালিকা মেলায়, না মিললে 403"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "সাধারণ HTTP তে Server কেন নিজে থেকে পাতাকে জানাতে পারে না যে আসন 14A বিক্রি হয়ে গেছে, এমনকি Keep-Alive Connection খোলা থাকলেও?",
        options: [
          {
            key: "A",
            text: "কারণ Keep-Alive এ Connection টা আসলে বন্ধ থাকে",
            isCorrect: false,
            explanation:
              "Keep-Alive এ Connection খোলাই থাকে। সমস্যা Connection এ নয়, নিয়মে।",
          },
          {
            key: "B",
            text: "কারণ HTTP তে প্রতিটা Response কোনো একটা Request এর উত্তর, জিজ্ঞেস ছাড়া পাঠানো কিছু Browser উত্তর হিসেবে চেনে না",
            isCorrect: true,
            explanation:
              "ঠিক। Request ছাড়া Response এর কোনো জায়গা HTTP তে নেই। তাই খোলা Connection থাকলেও Server চুপ।",
          },
          {
            key: "C",
            text: "কারণ TCP শুধু এক দিকে তথ্য পাঠাতে পারে",
            isCorrect: false,
            explanation:
              "TCP দুই দিকেই পাঠায় (Module 05)। সীমাটা HTTP এর নিয়মের, TCP এর নয়।",
          },
          {
            key: "D",
            text: "কারণ Server Browser এর IP জানে না",
            isCorrect: false,
            explanation:
              "Connection এর চার সংখ্যার জোড়াতেই ঠিকানা আছে। জানলেও HTTP তে আগে বলার নিয়ম নেই।",
          },
        ],
      },
      {
        id: 2,
        text: "Long Polling এ আসনে কোনো বদল না হলে Server কী করে?",
        options: [
          {
            key: "A",
            text: "সাথে সাথে খালি উত্তর দেয়, ঠিক Short Polling এর মতো",
            isCorrect: false,
            explanation: "তাহলে সেটা Short Polling ই হতো। Long Polling এর মূল কৌশলই অপেক্ষা।",
          },
          {
            key: "B",
            text: "Request টা ধরে রাখে, বদল এলে সাথে সাথে উত্তর দেয়, আর নির্দিষ্ট সময় পার হলে খালি 204 দিয়ে শেষ করে, তারপর Client আবার জিজ্ঞেস করে",
            isCorrect: true,
            explanation:
              "ঠিক। Lab এর Server এ সেই সময় ৮ সেকেন্ড, Production এ সাধারণত ৩০ সেকেন্ডের নিচে, যাতে পথের Timeout এর আগে শেষ হয়।",
          },
          {
            key: "C",
            text: "Connection টা WebSocket এ বদলে দেয়",
            isCorrect: false,
            explanation: "Long Polling পুরোটাই সাধারণ HTTP। Upgrade শুধু WebSocket এ।",
          },
          {
            key: "D",
            text: "Request টা অনির্দিষ্টকাল ধরে রাখে, যতক্ষণ না কিছু ঘটে",
            isCorrect: false,
            explanation:
              "তাহলে পথের কোনো Load Balancer এর Idle Timeout আগেই Connection কেটে দিত, আর Browser পেত 502 বা 504।",
          },
        ],
      },
      {
        id: 3,
        text: "SSE এর Connection ভেঙে গেলে Browser আবার যুক্ত হওয়ার সময় কী পাঠায়, যাতে হারানো খবর ফিরে আসে?",
        options: [
          {
            key: "A",
            text: "Last-Event-ID Header এ শেষ পাওয়া id",
            isCorrect: true,
            explanation:
              "ঠিক। EventSource নিজেই এটা জুড়ে দেয়। Lab এ Last-Event-ID: 2 পাঠাতেই Server id 3 থেকে শুরু করেছে।",
          },
          {
            key: "B",
            text: "If-None-Match Header এ ETag",
            isCorrect: false,
            explanation: "ETag Cache এর জন্য (লেসন ০৪), SSE এর আবার যুক্ত হওয়ার জন্য নয়।",
          },
          {
            key: "C",
            text: "কিছুই না, আগের খবর সবসময় হারিয়ে যায়",
            isCorrect: false,
            explanation: "SSE এর নিয়মে এই সমস্যার সমাধান ভেতরেই আছে, id আর Last-Event-ID দিয়ে।",
          },
          {
            key: "D",
            text: "retry এর মান",
            isCorrect: false,
            explanation:
              "retry Server এর পক্ষ থেকে Browser কে বলা কত পরে আবার আসবে। Browser এটা ফেরত পাঠায় না।",
          },
        ],
      },
      {
        id: 4,
        text: "Server এর পাঠানো Sec-WebSocket-Accept এর আসল কাজ কী?",
        options: [
          {
            key: "A",
            text: "এটা একটা Password, যা দিয়ে শুধু অনুমতি পাওয়া Browser যুক্ত হতে পারে",
            isCorrect: false,
            explanation:
              "GUID টা সবার জানা, যে কেউ হিসাবটা করতে পারে। পরিচয় আসে Cookie বা Token থেকে।",
          },
          {
            key: "B",
            text: "এটা দিয়ে পরের সব Frame Encrypt হয়",
            isCorrect: false,
            explanation: "Encryption করে wss এর TLS। Accept এর সাথে Frame এর কোনো সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "প্রমাণ করা যে ওপাশের Server সত্যিই WebSocket বোঝে আর এই Request টাই পড়েছে, কোনো বিভ্রান্ত পুরনো Server বা Cache উত্তর দেয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। Browser একই হিসাব করে রাখে, আর 101 এর সাথে আসা Accept না মিললে Connection বাতিল করে।",
          },
          {
            key: "D",
            text: "Server এর Certificate যাচাই করা",
            isCorrect: false,
            explanation: "Certificate যাচাই হয় তার আগেই, TLS Handshake এ (লেসন ০৮)।",
          },
        ],
      },
      {
        id: 5,
        text: "Browser থেকে Server এ যাওয়া প্রতিটা Frame কেন Mask করা থাকে?",
        options: [
          {
            key: "A",
            text: "যাতে পথের কেউ বার্তাটা পড়তে না পারে",
            isCorrect: false,
            explanation:
              "Mask এর Key Frame এর ভেতরেই লেখা থাকে, যে কেউ খুলতে পারে। গোপনীয়তার কাজ TLS এর।",
          },
          {
            key: "B",
            text: "যাতে পাতার JavaScript তারের Byte আগে থেকে সাজাতে না পারে, আর WebSocket না বোঝা পুরনো Proxy বা Cache কে ঠকিয়ে Cache Poisoning করা না যায়",
            isCorrect: true,
            explanation:
              "ঠিক। প্রতিটা Frame এ নতুন Random Key, তাই তারে কী যাবে তা কেউ আগে জানে না। এটা পথের যন্ত্রকে রক্ষা করে।",
          },
          {
            key: "C",
            text: "Compression এর জন্য",
            isCorrect: false,
            explanation: "Compression আলাদা Extension, permessage-deflate, যা RSV1 Bit ব্যবহার করে।",
          },
          {
            key: "D",
            text: "Server থেকে আসা Frame এর সাথে মেলানোর জন্য, কারণ দুই দিকেই Mask থাকে",
            isCorrect: false,
            explanation:
              "Server থেকে আসা Frame এ Mask থাকে না, থাকা নিষেধ। শুধু Client থেকে যাওয়াগুলোতে।",
          },
        ],
      },
      {
        id: 6,
        text: "Production এর Log এ অনেকগুলো WebSocket Close Code 1006 দেখা যাচ্ছে। এর মানে কী?",
        options: [
          {
            key: "A",
            text: "Server Policy ভঙ্গের কারণে বন্ধ করেছে",
            isCorrect: false,
            explanation: "সেটা 1008। Server কারণ জানিয়ে বন্ধ করলে Code সেটাই বলে।",
          },
          {
            key: "B",
            text: "Client ভদ্রভাবে বিদায় নিয়েছে",
            isCorrect: false,
            explanation: "ভদ্র বিদায় হলো 1000 বা 1001।",
          },
          {
            key: "C",
            text: "কোনো পাশ থেকে Close Frame আসেনি, Connection হঠাৎ মরে গেছে। Network, Crash, Deploy বা কোনো Idle Timeout",
            isCorrect: true,
            explanation:
              "ঠিক। 1006 তারে কখনো যায় না, Browser নিজে লেখে। Lab এ Server এর Process মেরে ফেলায় Client ঠিক এটাই পেয়েছিল। উত্তর হলো Backoff আর Jitter দিয়ে আবার যুক্ত হওয়া।",
          },
          {
            key: "D",
            text: "বার্তা খুব বড় ছিল",
            isCorrect: false,
            explanation: "সেটা 1009, Message Too Big।",
          },
        ],
      },
      {
        id: 7,
        text: "Deploy এর পরে দশ হাজার Client আবার যুক্ত হচ্ছে। শুধু Exponential Backoff এর চেয়ে Backoff আর Jitter কেন ভালো?",
        options: [
          {
            key: "A",
            text: "Jitter এ প্রত্যেকে অপেক্ষার সীমার ভেতরে নিজের Random সময় বাছে, তাই সবাই একই মুহূর্তে ফিরে এসে Server কে আবার ডুবিয়ে দেন না",
            isCorrect: true,
            explanation:
              "ঠিক। শুধু Backoff এ সবার অপেক্ষা হুবহু এক, তাই ঢেউ আসে ১, ৩, ৭ সেকেন্ডে, প্রতিটা ঢেউ আগের মতোই বড়। Lab এ সেটা ৪০ সেকেন্ডেও শেষ হয়নি।",
          },
          {
            key: "B",
            text: "Jitter দিলে সবার আগে শেষ Client টা যুক্ত হয়",
            isCorrect: false,
            explanation:
              "উল্টো। Lab এ Jitter এ শেষ কয়েকজন একটু দেরিতে ফেরেন। লাভটা হলো Server ডোবে না আর বেশিরভাগ আগে ফেরেন।",
          },
          {
            key: "C",
            text: "Jitter Server এর Handshake দ্রুত করে",
            isCorrect: false,
            explanation: "Server এর কাজ বদলায় না। বদলায় চেষ্টাগুলো কখন আসে।",
          },
          {
            key: "D",
            text: "কোনো পার্থক্য নেই, দুইটাই একই",
            isCorrect: false,
            explanation: "Lab এর Chart দুইটা পাশাপাশি দেখুন। মোট চেষ্টা প্রায় অর্ধেকে নামে।",
          },
        ],
      },
      {
        id: 8,
        text: "attacker.example এর একটা পাতা চুপচাপ wss://islandtours.example/ws খোলার চেষ্টা করছে। কোন কথাটা সঠিক?",
        options: [
          {
            key: "A",
            text: "চিন্তা নেই, Browser এর CORS এটা আটকে দেবে",
            isCorrect: false,
            explanation: "WebSocket এ CORS এর পাহারা নেই। Browser শুধু Origin Header বসায়।",
          },
          {
            key: "B",
            text: "Sec-WebSocket-Key এই আক্রমণ থামায়",
            isCorrect: false,
            explanation: "Key সবার কাছে একই নিয়মে তৈরি হয়, পরিচয় বা অনুমতির সাথে এর সম্পর্ক নেই।",
          },
          {
            key: "C",
            text: "Server কে নিজে Origin মেলাতে হবে অনুমতির তালিকার সাথে আর 101 এর আগেই 403 দিতে হবে, আর SameSite=Lax Cookie এই ক্ষেত্রে বাড়তি সুরক্ষা দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। দুই স্তর। Lax Cookie অন্য Site থেকে খোলা Socket এ যায় না, আর Origin যাচাই Same-site কিন্তু অন্য Origin এর পাতাকেও আটকায়, যেমন blog.islandtours.example।",
          },
          {
            key: "D",
            text: "wss ব্যবহার করলেই এই আক্রমণ অসম্ভব",
            isCorrect: false,
            explanation:
              "wss তথ্য গোপন রাখে, কিন্তু কে Socket খুলছে তা যাচাই করে না। আক্রমণকারীর পাতাও wss খুলতে পারে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Polling থেকে নিজের হাতে লেখা WebSocket পর্যন্ত",
    subtitle: "ছয়টা পরীক্ষা, কোনো Package লাগে না, শুধু Node 22 বা তার পরের সংস্করণ, curl আর openssl",
    stepName: "LAB",
    steps: [
      {
        title: "Short Polling এর অপচয় গোনা",
        description:
          "একটা ছোট Server আর একজন Poller একসাথে চালান। ২০ সেকেন্ডে কতগুলো Request গেল আর তার কতগুলো খালি হাতে ফিরল, নিজে গুনুন।",
      },
      {
        title: "Long Polling এ লাইন ধরে রাখা",
        description:
          "একই দুইটা আসন বিক্রি, কিন্তু এবার Server Request আটকে রাখে। খবর কত দ্রুত আসে আর খালি 204 কখন আসে দেখুন।",
      },
      {
        title: "SSE, আর Last-Event-ID এর জাদু",
        description:
          "curl -N দিয়ে একটা বুকিংয়ের অবস্থার Stream দেখুন। তারপর Last-Event-ID হাতে পাঠিয়ে দেখুন Server কোথা থেকে শুরু করে, আর সব শেষ হলে 204।",
      },
      {
        title: "নিজের হাতে একটা WebSocket Server",
        description:
          "node:http এর upgrade ঘটনা ধরে Handshake, Frame পড়া, Echo, Ping আর Origin ও Cookie এর পাহারা, সব এক File এ। তিনটা Environment Variable ছাড়া এটা চালুই হবে না।",
      },
      {
        title: "Handshake হাতে করা",
        description:
          "Accept এর হিসাব openssl আর Node দুইভাবে করুন, তারপর curl দিয়ে 101, 403, 401 আর 426 চারটাই ঘটান।",
      },
      {
        title: "Node এর WebSocket Client, আর ফিরে আসা",
        description:
          "Node এর Global WebSocket দিয়ে যুক্ত হন, বার্তা পাঠান, তারপর Server থামিয়ে আবার চালু করুন আর Backoff আর Jitter এর Log দেখুন। শেষে Client কে জমিয়ে দিয়ে Heartbeat এর কাজ দেখুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-short-poll.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47701 node 1-short-poll.mjs
// একই Process এ একটা ছোট Server আর একজন Poller চলে। ২০ সেকেন্ড পরে হিসাব দেখায়।
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const POLL_EVERY_MS = 2000;
const RUN_FOR_MS = 20000;

// নৌকার খালি আসন। মাঝে মাঝে কেউ একটা কিনে ফেলেন।
let version = 1;
let freeSeats = ["14A", "14B", "15A", "15B", "16A"];
const sales = [3500, 11200]; // কখন একটা আসন বিক্রি হবে, শুরু থেকে কত ms পরে
const startedAt = Date.now();
for (const at of sales) {
  setTimeout(() => {
    const sold = freeSeats.shift();
    version += 1;
    console.log(\`  \${elapsed()}  [server] seat \${sold} sold, version is now \${version}\`);
  }, at);
}

function elapsed() {
  return \`\${((Date.now() - startedAt) / 1000).toFixed(1).padStart(4)}s\`;
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ version, freeSeats }));
});

server.listen(port, "127.0.0.1", async () => {
  let lastVersion = 0;
  let requests = 0;
  let useful = 0;
  let bytes = 0;
  const timer = setInterval(async () => {
    const res = await fetch(\`http://localhost:\${port}/api/tours/saint-martin/seats\`);
    const text = await res.text();
    const body = JSON.parse(text);
    requests += 1;
    bytes += text.length;
    const changed = body.version !== lastVersion;
    if (changed) useful += 1;
    lastVersion = body.version;
    console.log(\`  \${elapsed()}  [poller] request \${String(requests).padStart(2)}: version \${body.version} \${changed ? "<- changed" : "(no change)"}\`);
  }, POLL_EVERY_MS);

  setTimeout(() => {
    clearInterval(timer);
    server.close();
    console.log(\`\\nrequests: \${requests}, useful: \${useful}, wasted: \${requests - useful}, body bytes: \${bytes}\`);
  }, RUN_FOR_MS + 100);
});`,
      },
      {
        filename: "2-long-poll.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47702 node 2-long-poll.mjs
// Server Request টা ধরে রাখে, যতক্ষণ না নতুন কিছু ঘটে বা HOLD_MS পার হয়।
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const HOLD_MS = 8000;   // এর মধ্যে কিছু না ঘটলে খালি উত্তর, 204
const RUN_FOR_MS = 20000;

let version = 1;
let freeSeats = ["14A", "14B", "15A", "15B", "16A"];
const waiting = new Set(); // যে Response গুলো এখনো খোলা রেখে অপেক্ষা করছি
const startedAt = Date.now();
const elapsed = () => \`\${((Date.now() - startedAt) / 1000).toFixed(1).padStart(4)}s\`;

for (const at of [3500, 11200]) {
  setTimeout(() => {
    const sold = freeSeats.shift();
    version += 1;
    console.log(\`  \${elapsed()}  [server] seat \${sold} sold, answering \${waiting.size} waiting request(s)\`);
    for (const res of waiting) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ version, freeSeats }));
    }
    waiting.clear();
  }, at);
}

const server = http.createServer((req, res) => {
  const since = Number(new URL(req.url, "http://localhost").searchParams.get("since"));
  if (version > since) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ version, freeSeats }));
    return;
  }
  waiting.add(res);
  const timer = setTimeout(() => {
    waiting.delete(res);
    res.writeHead(204);
    res.end();
  }, HOLD_MS);
  res.on("close", () => clearTimeout(timer));
});

server.listen(port, "127.0.0.1", async () => {
  let since = 0;
  let requests = 0;
  while (Date.now() - startedAt < RUN_FOR_MS) {
    requests += 1;
    const sentAt = elapsed();
    const res = await fetch(\`http://localhost:\${port}/api/tours/saint-martin/seats?since=\${since}\`);
    if (res.status === 204) {
      console.log(\`  \${elapsed()}  [client] request \${requests} (sent \${sentAt}): 204, nothing new, asking again\`);
      continue;
    }
    const body = await res.json();
    since = body.version;
    console.log(\`  \${elapsed()}  [client] request \${requests} (sent \${sentAt}): 200, version \${body.version}, free \${body.freeSeats.join(" ")}\`);
  }
  server.close();
  console.log(\`\\nrequests: \${requests}\`);
});`,
      },
      {
        filename: "3-sse.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47703 node 3-sse.mjs
// তারপর আরেক Terminal এ:
//   curl -N http://localhost:47703/api/bookings/bk_7Q2M9X/events
//   curl -N -H "Last-Event-ID: 2" http://localhost:47703/api/bookings/bk_7Q2M9X/events
//   curl -i -H "Last-Event-ID: 4" http://localhost:47703/api/bookings/bk_7Q2M9X/events
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// একটা বুকিং এর জীবনের ধাপগুলো, প্রতিটার একটা id
const STEPS = [
  { id: 1, status: "pending" },
  { id: 2, status: "payment_received" },
  { id: 3, status: "seat_locked" },
  { id: 4, status: "confirmed" },
];

const server = http.createServer((req, res) => {
  if (req.url !== "/api/bookings/bk_7Q2M9X/events") {
    res.writeHead(404).end();
    return;
  }
  // EventSource আবার যুক্ত হলে শেষ পাওয়া id টা এই Header এ পাঠায়
  const lastId = Number(req.headers["last-event-id"] ?? 0);
  const pending = STEPS.filter((s) => s.id > lastId);
  console.log(\`client connected, Last-Event-ID = \${lastId}, \${pending.length} event(s) to send\`);

  if (pending.length === 0) {
    // সব ধাপ আগেই পাঠানো হয়ে গেছে। 204 পেলে EventSource আর আবার যুক্ত হয় না।
    res.writeHead(204).end();
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  res.write("retry: 3000\\n\\n"); // Browser কে বলা: লাইন কাটলে ৩ সেকেন্ড পরে আবার যুক্ত হবে

  let i = 0;
  const timer = setInterval(() => {
    if (i === pending.length) {
      res.write(": booking finished, closing the stream\\n\\n");
      clearInterval(timer);
      res.end();
      return;
    }
    const step = pending[i++];
    res.write(\`id: \${step.id}\\nevent: status\\ndata: {"booking":"bk_7Q2M9X","status":"\${step.status}"}\\n\\n\`);
  }, 1500);

  req.on("close", () => {
    clearInterval(timer);
    console.log("client went away");
  });
});

server.listen(port, "127.0.0.1", () => console.log(\`SSE lab on http://localhost:\${port}\`));`,
      },
      {
        filename: "4-ws-server.mjs",
        language: "javascript",
        code: `// চালান:
//   export LAB_PORT=47704
//   export ALLOWED_ORIGIN="http://localhost:47704"
//   export LAB_SESSION="$(openssl rand -hex 16)"
//   node 4-ws-server.mjs
// কোনো Package লাগে না। Handshake আর Frame, দুইটাই এখানে হাতে লেখা।
import crypto from "node:crypto";
import http from "node:http";

const port = Number(process.env.LAB_PORT);
const allowedOrigin = process.env.ALLOWED_ORIGIN;
const labSession = process.env.LAB_SESSION;
if (!port) throw new Error("LAB_PORT is not set");
if (!allowedOrigin) throw new Error("ALLOWED_ORIGIN is not set");
if (!labSession) throw new Error("LAB_SESSION is not set");

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"; // RFC 6455 এর নির্দিষ্ট লেখা
const HEARTBEAT_MS = 5000;
const MAX_FRAME_BYTES = 64 * 1024;

const OPCODE = { text: 0x1, close: 0x8, ping: 0x9, pong: 0xa };

const acceptFor = (key) => crypto.createHash("sha1").update(key + GUID).digest("base64");

/** Server থেকে Client এ একটা Frame। Server এর Frame এ Mask থাকে না। */
function frame(opcode, payload = Buffer.alloc(0)) {
  const len = payload.length;
  if (len < 126) return Buffer.concat([Buffer.from([0x80 | opcode, len]), payload]);
  const head = Buffer.from([0x80 | opcode, 126, 0, 0]);
  head.writeUInt16BE(len, 2);
  return Buffer.concat([head, payload]);
}

/**
 * জমে থাকা Byte থেকে যতগুলো পুরো Frame পাওয়া যায় বের করে।
 * TCP একটা Byte এর ধারা, তাই একটা Frame দুই টুকরায় আসতে পারে, বা দুইটা Frame এক টুকরায়।
 * বাকি থাকা অসম্পূর্ণ অংশটা ফেরত দেয়, পরের data এর সাথে জুড়ে আবার দেখার জন্য।
 */
function readFrames(buffer, onFrame) {
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const opcode = buffer[offset] & 0x0f;
    const masked = (buffer[offset + 1] & 0x80) !== 0;
    let len = buffer[offset + 1] & 0x7f;
    let pos = offset + 2;
    if (len === 126) {
      if (buffer.length < pos + 2) break;
      len = buffer.readUInt16BE(pos);
      pos += 2;
    } else if (len === 127) {
      if (buffer.length < pos + 8) break;
      len = Number(buffer.readBigUInt64BE(pos));
      pos += 8;
    }
    if (len > MAX_FRAME_BYTES) return onFrame({ tooBig: true });
    const maskBytes = masked ? 4 : 0;
    if (buffer.length < pos + maskBytes + len) break; // Frame এর বাকিটা এখনো পথে
    const mask = buffer.subarray(pos, pos + maskBytes);
    pos += maskBytes;
    const payload = Buffer.from(buffer.subarray(pos, pos + len));
    if (masked) for (let i = 0; i < len; i++) payload[i] ^= mask[i % 4];
    onFrame({ opcode, masked, payload });
    offset = pos + len;
  }
  return buffer.subarray(offset);
}

function reject(socket, status, reason) {
  console.log(\`refused upgrade: \${status} \${reason}\`);
  socket.end(\`HTTP/1.1 \${status} \${reason}\\r\\nConnection: close\\r\\nContent-Length: 0\\r\\n\\r\\n\`);
}

function hasSession(cookieHeader = "") {
  return cookieHeader.split(";").some((part) => part.trim() === \`__Host-session=\${labSession}\`);
}

// সাধারণ HTTP দিয়ে এলে বলে দেয় এখানে WebSocket লাগবে
const server = http.createServer((req, res) => {
  res.writeHead(426, { Upgrade: "websocket", "Content-Type": "text/plain" });
  res.end("this address speaks WebSocket only\\n");
});

server.on("upgrade", (req, socket) => {
  const key = req.headers["sec-websocket-key"];
  if (req.url !== "/ws") return reject(socket, 404, "Not Found");
  if (req.headers.upgrade?.toLowerCase() !== "websocket" || !key) return reject(socket, 400, "Bad Request");
  if (req.headers["sec-websocket-version"] !== "13") return reject(socket, 426, "Upgrade Required");
  if (req.headers.origin !== allowedOrigin) return reject(socket, 403, "Forbidden");
  if (!hasSession(req.headers.cookie)) return reject(socket, 401, "Unauthorized");

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      \`Sec-WebSocket-Accept: \${acceptFor(key)}\`,
      "",
      "",
    ].join("\\r\\n"),
  );
  console.log(\`101 sent to \${socket.remoteAddress}:\${socket.remotePort}, now speaking frames\`);

  let pending = Buffer.alloc(0);
  let alive = true;

  socket.on("data", (chunk) => {
    pending = readFrames(Buffer.concat([pending, chunk]), (f) => {
      if (f.tooBig) {
        const code = Buffer.alloc(2);
        code.writeUInt16BE(1009); // Message Too Big
        socket.end(frame(OPCODE.close, code));
        return;
      }
      if (f.opcode === OPCODE.text) {
        const text = f.payload.toString("utf8");
        console.log(\`got text (masked=\${f.masked}, \${f.payload.length} bytes): \${text}\`);
        socket.write(frame(OPCODE.text, Buffer.from(\`echo: \${text}\`)));
      } else if (f.opcode === OPCODE.pong) {
        console.log("pong, the client is alive");
        alive = true;
      } else if (f.opcode === OPCODE.close) {
        const code = f.payload.length >= 2 ? f.payload.readUInt16BE(0) : 1005;
        console.log(\`client said goodbye, close code \${code}\`);
        socket.end(frame(OPCODE.close, f.payload.subarray(0, 2)));
      }
    });
  });

  // Heartbeat: আগের Ping এর Pong না এলে ধরে নিই ওপাশ হারিয়ে গেছে
  const heartbeat = setInterval(() => {
    if (!alive) {
      console.log("no pong since last ping, dropping a dead connection");
      socket.destroy();
      return;
    }
    alive = false;
    socket.write(frame(OPCODE.ping));
  }, HEARTBEAT_MS);

  socket.on("close", () => {
    clearInterval(heartbeat);
    console.log("TCP connection closed");
  });
  socket.on("error", (err) => console.log("socket error:", err.code));
});

server.listen(port, "127.0.0.1", () => console.log(\`WebSocket lab on ws://localhost:\${port}/ws\`));`,
      },
      {
        filename: "5-handshake.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান: আগের Terminal এর তিনটা export এই Terminal এও করুন, তারপর  bash 5-handshake.sh
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}" "\${ALLOWED_ORIGIN:?ALLOWED_ORIGIN is not set}" "\${LAB_SESSION:?LAB_SESSION is not set}"

GUID="258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
KEY="dGhlIHNhbXBsZSBub25jZQ=="   # RFC 6455 এর নিজের উদাহরণের Key

echo "== 1. Accept হাতে হিসাব, openssl দিয়ে"
printf '%s' "\${KEY}\${GUID}" | openssl dgst -sha1 -binary | openssl base64

echo "== 2. একই হিসাব, Node দিয়ে"
node -e 'const c=require("node:crypto");console.log(c.createHash("sha1").update(process.argv[1]+process.argv[2]).digest("base64"))' "$KEY" "$GUID"

echo "== 3. আসল Handshake, সব ঠিক থাকলে 101"
curl -si --max-time 2 "http://localhost:\${LAB_PORT}/ws" \\
  -H "Connection: Upgrade" -H "Upgrade: websocket" \\
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: \${KEY}" \\
  -H "Origin: \${ALLOWED_ORIGIN}" -H "Cookie: __Host-session=\${LAB_SESSION}" || true
echo

echo "== 4. অন্য সাইট থেকে এলে"
curl -si --max-time 2 "http://localhost:\${LAB_PORT}/ws" \\
  -H "Connection: Upgrade" -H "Upgrade: websocket" \\
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: \${KEY}" \\
  -H "Origin: https://attacker.example" -H "Cookie: __Host-session=\${LAB_SESSION}" | head -1

echo "== 5. Cookie ছাড়া এলে"
curl -si --max-time 2 "http://localhost:\${LAB_PORT}/ws" \\
  -H "Connection: Upgrade" -H "Upgrade: websocket" \\
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: \${KEY}" \\
  -H "Origin: \${ALLOWED_ORIGIN}" | head -1

echo "== 6. সাধারণ GET, Upgrade ছাড়া"
curl -si --max-time 2 "http://localhost:\${LAB_PORT}/ws"`,
      },
      {
        filename: "6-client.mjs",
        language: "javascript",
        code: `// চালান (৪ নম্বরের Server চালু রেখে, একই তিনটা export সহ):  node 6-client.mjs
// Node 22 থেকে WebSocket একটা Global, Browser এর মতোই। কোনো Package লাগে না।
const port = Number(process.env.LAB_PORT);
const origin = process.env.ALLOWED_ORIGIN;
const session = process.env.LAB_SESSION;
if (!port) throw new Error("LAB_PORT is not set");
if (!origin) throw new Error("ALLOWED_ORIGIN is not set");
if (!session) throw new Error("LAB_SESSION is not set");

const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;
let attempt = 0;
let current = null;
let stopped = false;

function connect() {
  if (stopped) return;
  // Browser নিজে Origin আর Cookie বসায়। Node এ সেটা আমরা নিজে বসাচ্ছি।
  const ws = new WebSocket(\`ws://localhost:\${port}/ws\`, {
    headers: { Origin: origin, Cookie: \`__Host-session=\${session}\` },
  });
  current = ws;

  ws.addEventListener("open", () => {
    attempt = 0; // সফল হলে অপেক্ষার হিসাব আবার শূন্য থেকে
    console.log("open, readyState =", ws.readyState);
    ws.send("seat 14A please");
    ws.send("আসন 14A চাই");
  });

  ws.addEventListener("message", (event) => console.log("got:", event.data));

  ws.addEventListener("close", (event) => {
    console.log(\`closed, code \${event.code}, clean = \${event.wasClean}\`);
    if (stopped) return; // আমরা নিজেই ভদ্রভাবে বিদায় নিয়েছি
    // Exponential Backoff আর Full Jitter, যাতে সবাই একই মুহূর্তে ফিরে না আসেন
    const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
    const delay = Math.round(Math.random() * ceiling);
    attempt += 1;
    console.log(\`reconnect attempt \${attempt} in \${delay} ms (ceiling \${ceiling} ms)\`);
    setTimeout(connect, delay);
  });

  ws.addEventListener("error", () => console.log("error event (the close event follows)"));
}

connect();
// ২০ সেকেন্ড পরে ভদ্র বিদায়। এর মধ্যে Server টা Ctrl+C দিয়ে থামিয়ে আবার চালু করুন।
setTimeout(() => {
  stopped = true;
  current.close(1000, "done");
}, 20000);`,
      },
    ],
    tip: "পরীক্ষা ৬ শেষে একটা বাড়তি পরীক্ষা করুন। Client চালু থাকা অবস্থায় আরেক Terminal এ তার Process ID খুঁজে kill -STOP দিন, Process টা জমে যাবে, ঠিক যেমন একটা ফোন হঠাৎ সুড়ঙ্গে ঢোকে। দশ সেকেন্ডের মধ্যে Server এর Log এ আসবে no pong since last ping। তারপর kill -CONT দিন, Client জেগে দেখবে তার Connection নেই আর নিজে ফিরে আসবে। পুরো লেসনের সবচেয়ে কাজের শিক্ষাটা এই এক পরীক্ষায়: একটা Connection নীরবে মরে যেতে পারে, কেউ বিদায় বলে না, আর সেটা ধরার একমাত্র উপায় নিয়মিত খোঁচা দেওয়া। Production এ যে Socket Server এ Heartbeat নেই, তার Memory দিনে দিনে বাড়ে, আর কেউ বুঝতে পারে না কেন।",
  },
  assignment: {
    title: "Mini Project: my-tours এ Live আসন আর বুকিংয়ের অবস্থা",
    time: "১২০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>অপচয়ের হিসাব:</strong> Lab এর প্রথম পরীক্ষা Interval ১ সেকেন্ড আর ১০ সেকেন্ড
        দিয়ে আবার চালান। প্রতিবার কতগুলো Request খালি গেল আর খবর পৌঁছাতে সর্বোচ্চ কত দেরি
        হলো, একটা টেবিলে লিখুন। তারপর হিসাব করুন দশ হাজার পর্যটকের জন্য প্রতিটা Interval এ
        Server এ প্রতি সেকেন্ডে কতগুলো Request আসত, আর WebSocket এ একটা আসন বিক্রির খবর কত
        Byte এ যেত।
      </span>,
      <span key="2">
        <strong>my-tours এ বুকিংয়ের অবস্থা, SSE তে:</strong> নিজের my-tours API তে{" "}
        <code>GET /api/bookings/:id/events</code> বানান। প্রতিটা Event এ id আর event থাকবে,
        শুরুতে retry, প্রতি ২০ সেকেন্ডে একটা Comment এর Heartbeat, Last-Event-ID থেকে আবার
        শুরু, আর সব শেষ হলে 204। curl দিয়ে প্রমাণ দিন যে মাঝপথে কেটে আবার যুক্ত হলে একটা
        Event ও হারায় না, আবার দুইবারও আসে না।
      </span>,
      <span key="3">
        <strong>হাতে লেখা Server কে শক্ত করুন:</strong> Lab এর চার নম্বর Server এ তিনটা
        জিনিস যোগ করুন। Origin এর একটা তালিকা, কমা দিয়ে আলাদা করে ALLOWED_ORIGINS
        Environment Variable থেকে পড়া। Binary Frame এলে 1003 দিয়ে বন্ধ। আর প্রতি সেকেন্ডে
        ২০টার বেশি বার্তা এলে 1008 দিয়ে বন্ধ। প্রতিটা আচরণ curl বা Node Client দিয়ে ঘটিয়ে
        Terminal এর ফলাফল জমা দিন।
      </span>,
      <span key="4">
        <strong>my-tours এর Live আসনের নকশা:</strong> একটা ছবি আঁকুন, যেখানে দুইটা API
        Container, Redis এর Pub/Sub, Caddy আর তিনজন পর্যটক আছেন। ছবির পাশে লিখুন: Heartbeat
        এর সময় কত আর আপনার পথের কোন Timeout এর চেয়ে কেন ছোট, Reconnect এর নিয়ম কী, আবার
        যুক্ত হওয়ার পরে পাতা কীভাবে নিশ্চিত হয় যে মাঝের কোনো আসন বিক্রির খবর হারায়নি, আর
        কোন কোন Close Code এ পাতা আর চেষ্টা করবে না।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন নতুন সদস্য বলছেন, WebSocket
        তো সব পারে, তাহলে পুরো API টাই WebSocket এ বানাই না কেন, HTTP রাখার কী দরকার? তাঁকে
        বোঝান কোন কাজে HTTP ই ভালো (Cache, Status Code, Retry, Load Balancing, Log), কোন কাজে
        SSE যথেষ্ট, আর কোন কাজে সত্যিই WebSocket লাগে। অন্তত একটা উদাহরণ Island Tours থেকে
        দিন।
      </span>,
    ],
    deliverables: [
      <span key="1">দুই Interval এর টেবিল, আর দশ হাজার পর্যটকের হিসাব</span>,
      <span key="2">SSE Endpoint এর Code, আর কেটে আবার যুক্ত হওয়ার curl ফলাফল</span>,
      <span key="3">তিনটা নতুন আচরণের Code, আর প্রতিটার Terminal ফলাফল</span>,
      <span key="4">Live আসনের ছবি আর তার পাশের নিয়মগুলো</span>,
      <span key="5">নতুন সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
