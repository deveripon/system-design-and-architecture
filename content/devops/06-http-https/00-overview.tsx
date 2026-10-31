/**
 * What: The overview chapter of DevOps Module 06, HTTP & HTTPS. It says why the module exists, what
 * the ten lessons teach, where the knowledge is used at work, and how to study it.
 *
 * Why: Every module opens with a map before its first lesson, so the reader knows why the lessons
 * matter before meeting them. It reuses the shared overview visuals so every module overview looks
 * and reads the same.
 */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  BeforeAfterSplit,
  ModuleBridgeDiagram,
  ModuleRoadmap,
} from "../../../components/course/topics/overview/module-overview";
import { RealLifeLab } from "../../../components/course/topics/overview/overview-animations";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const httpHttpsOverviewContent: TopicData = {
  id: "http-https-overview",
  introduction: {
    badge: "MODULE 06 · OVERVIEW",
    title: <SectionTitle>রাস্তা তৈরি হলো, এবার সেই রাস্তায় কথা বলার ভাষা</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আগের মডিউল শেষে আপনার হাতে একটা নির্ভরযোগ্য রাস্তা ছিল। পর্যটকের ফোন
          আর Island Tours এর Server এর মাঝে TCP একটা Connection খুলে দিল, প্রতিটা
          Byte নির্ভুল আর ঠিক ক্রমে পৌঁছানোর দায়িত্ব নিল, আর কথা শেষে ভদ্রভাবে
          বিদায়ও নিল। কিন্তু একটা প্রশ্ন আমরা ইচ্ছা করে ঝুলিয়ে রেখেছিলাম। সেই
          রাস্তা দিয়ে Browser আসলে কী বলল?
        </ContentParagraph>
        <ContentParagraph>
          TCP এর চোখে পর্যটকের বুকিং শুধু কিছু Byte এর একটা ধারা। কোনটা নৌকার
          তালিকা দেখার অনুরোধ আর কোনটা নতুন বুকিং, কে অনুরোধটা পাঠালেন, তিনি আগে
          Login করেছেন কি না, Server রাজি হলো নাকি অস্বীকার করল, এর কিছুই TCP জানে
          না, জানার দায়ও তার নেই। সেই Byte গুলোকে অর্থ দেয় HTTP, এমন একটা ভাষা যা
          পৃথিবীর প্রতিটা Browser আর প্রতিটা Web Server আগে থেকে মেনে নিয়েছে। আর
          সেই কথাগুলো যেন পথের কেউ পড়তে বা বদলাতে না পারে, সেই তালাটার নাম HTTPS।
        </ContentParagraph>
        <ContentParagraph>
          এই পাতাটা কোনো লেসন নয়, এটা মডিউলের মানচিত্র। এখানে আপনি জানবেন এই
          মডিউল কেন আছে, দশটা লেসনে কী কী শিখবেন, কেন শেখাটা জরুরি, কাজের জায়গায়
          কোথায় কোথায় লাগবে, আর বাস্তবে কীভাবে ব্যবহার করবেন। অনেক নতুন শব্দ
          এখানে শুধু নাম হিসেবে আসবে। ঘাবড়াবেন না, প্রতিটা শব্দের পাশে বলে দেওয়া
          আছে কোন লেসন সেটা বোঝাবে।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "ফোনের লাইন যত পরিষ্কারই হোক, দুই পাশের দুইজন যদি একই ভাষা না জানেন, কথা হয় না। আর কথাটা যদি গোপন হয়, তাহলে শুধু ভাষা জানলেই চলে না, খেয়াল রাখতে হয় লাইনের মাঝখানে কেউ কান পেতে আছে কি না।",
      author: "HTTP & HTTPS",
      role: "Overview",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "why-this-module",
      subHeader: { index: "001", title: "Why This Module" },
      title: <SectionTitle>সব চলছে, তবু পর্দায় লাল লেখা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা দৃশ্য ভাবুন। আপনি my-tours এর Frontend আর Backend দুইটাই
                বানিয়েছেন। Backend আলাদা চালালে ঠিক উত্তর দেয়, Frontend ও সুন্দর
                খোলে। এবার দুইটা জোড়া লাগালেন, Frontend থেকে Backend এর কাছে ট্যুরের
                তালিকা চাইলেন। পাতায় কিছুই এলো না। Browser এর Console খুলে দেখলেন একটা
                লম্বা লাল লেখা, তার ভেতরে একটা শব্দ, CORS।
              </ContentParagraph>
              <ContentParagraph>
                আপনার Backend কিন্তু উত্তর দিয়েছিল। উত্তরটা Browser পর্যন্ত এসেও
                ছিল। Browser নিজেই সেটা আপনার Code এর হাতে দিতে রাজি হয়নি। কেন, কোন
                নিয়মে, আর নিয়মটা মানাতে হয় কোন পাশে, এই প্রশ্নগুলোর উত্তর আপনার
                Code এ নেই। উত্তর আছে Browser আর Server এর মাঝের কথোপকথনে, যার ভাষার
                নাম HTTP।
              </ContentParagraph>
              <ContentParagraph>
                এরকম আরও অনেক মুহূর্ত আছে, যেগুলো এই মডিউল ছাড়া রহস্যই থেকে যায়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  Login সফল হলো, পাতাও বদলাল, কিন্তু একবার Refresh দিলেই আবার
                  Login এর পাতা।
                </ListItem>
                <ListItem>
                  একটা API ডাকলে কখনো 401 আসে, কখনো 403, আর আপনি জানেন না দুইটার
                  তফাত কী, বা কোনটা কখন ফেরত দেওয়া উচিত।
                </ListItem>
                <ListItem>
                  নতুন Version Deploy করলেন, অথচ কয়েকজন পর্যটক এখনো পুরনো পাতা
                  দেখছেন।
                </ListItem>
                <ListItem>
                  তিন মাস ঠিকঠাক চলার পর এক সকালে সবাই দেখছেন Your connection is
                  not private, আর কেউ সাইটে ঢুকছেন না।
                </ListItem>
                <ListItem>
                  ধীর Network এ একজন পর্যটক Pay বোতাম দুইবার চাপলেন, আর তাঁর
                  টাকা কাটা হলো দুইবার।
                </ListItem>
                <ListItem>
                  নৌকার খালি আসনের Live তালিকা নিজের ল্যাপটপে চমৎকার চলে, কিন্তু
                  Server এ তোলার পর ঠিক এক মিনিট পরপর থেমে যায়।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                শুরুর CORS এর ঘটনা আর তালিকার ছয়টা, এই সাতটা সমস্যার একটাও আপনার
                Code এর Logic এ নয়। সাতটাই ঘটে Browser আর Server এর কথোপকথনের ভেতরে। কে কী চাইল, কী শর্তে চাইল, উত্তরের সাথে কী নির্দেশ
                এলো, সেই নির্দেশ কতক্ষণ মানতে হবে, আর পুরো কথাটা তালাবন্ধ ছিল কি না।
                এই মডিউল সেই কথোপকথনটা আপনার চোখের সামনে খুলে দেয়। শেষ করার পর উপরের
                প্রতিটা লাইন পড়ে আপনি বলতে পারবেন কী ঘটছে, কোথায় তাকিয়ে নিশ্চিত
                হবেন, আর কোন পাশে হাত দিলে ঠিক হবে।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "CORS, 401, 403, এই শব্দগুলো এখন না বুঝলে কোনো সমস্যা নেই",
          content: (
            <p>
              উপরের তালিকায় কয়েকটা শব্দ আর সংখ্যা ইচ্ছা করেই ব্যাখ্যা ছাড়া রাখা
              হয়েছে। এগুলো সেই দরজা, যেগুলোর সামনে একজন Web Developer একদিন না একদিন
              দাঁড়ানই। এই মডিউলের প্রতিটা লেসন এরকম একটা বা দুইটা দরজা খুলে দেয়।
              মডিউল শেষে এই পাতায় ফিরে এসে তালিকাটা আবার পড়বেন, দেখবেন প্রতিটা লাইন
              তখন একটা চেনা গল্প।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "big-picture",
      subHeader: { index: "002", title: "The Big Picture" },
      title: <SectionTitle>পুরো মডিউল, এক কথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা ব্যাংকের কাউন্টারের কথা ভাবুন। আপনি টাকা জমা দিতে গেলে মুখে
                গল্প বলেন না, একটা ছাপানো Form পূরণ করেন। Form এর উপরে লেখা কী কাজ,
                জমা না তোলা। তারপর নির্দিষ্ট ঘরে হিসাব নম্বর, টাকার অঙ্ক, তারিখ। একদম
                নিচে সই। কাউন্টারের কর্মকর্তা Form টা দেখেই বোঝেন কী চাওয়া হচ্ছে, কারণ
                ঘরগুলো সবার জন্য একই। কাজ শেষে তিনি একটা রসিদ দেন, যার উপরে লেখা থাকে
                কাজটা হলো কি না।
              </ContentParagraph>
              <ContentParagraph>
                HTTP ঠিক এই ছাপানো Form। Browser যখন Server এর কাছে কিছু চায়, সে
                একটা নির্দিষ্ট ছাঁচে কয়েকটা লাইন লেখে। প্রথম লাইনে কী কাজ আর কোন
                জিনিসটা, তারপর কয়েকটা ঘরে বাড়তি তথ্য, আর দরকার হলে শেষে আসল Data।
                Server একই রকম ছাঁচে রসিদ ফেরত দেয়, যার প্রথম লাইনেই একটা সংখ্যা
                বলে দেয় কাজটা হলো কি না। এই চাওয়াটার নাম Request, আর রসিদটার নাম
                Response। আর ব্যাংকে যেমন খামটা সিলমোহর করা থাকলে পথের কেউ ভেতরের
                Form পড়তে পারেন না, HTTPS তেমনি পুরো কথাটাকে তালাবন্ধ করে পাঠায়।
              </ContentParagraph>
              <ContentParagraph>
                এটা কোনো কাল্পনিক ছবি নয়। নিচে একটা আসল কথোপকথন, এই লেখার সময়
                Terminal থেকে example.com এর সাথে চালানো, শুধু ছোট করে দেখানো।{" "}
                <code>&gt;</code> চিহ্নের লাইনগুলো আপনার যন্ত্র পাঠিয়েছে, আর{" "}
                <code>&lt;</code> চিহ্নের লাইনগুলো Server ফেরত দিয়েছে। এর একটা লাইনও
                এখন বোঝার দরকার নেই। শুধু খেয়াল করুন, পুরো ব্যাপারটা সাধারণ লেখা,
                মানুষ পড়তে পারে এমন। লেসন ২ এ এর প্রতিটা লাইন আপনি নিজের হাতে টাইপ
                করে পাঠাবেন।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "first-look.sh",
          code: `# একটা Request পাঠিয়ে আসা যাওয়ার লেখাগুলো দেখা (লেসন ২ এ পুরোটা)
curl -sv --http1.1 http://example.com/ -o /dev/null

> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Sat, 31 Oct 2026 06:27:07 GMT
< Content-Type: text/html; charset=utf-8
< Connection: keep-alive
< Server: cloudflare
< Age: 9462`,
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleBridgeDiagram
              label="Diagram: আগের মডিউল কী দিল, এই মডিউল কী যোগ করে, পরেরটা কী চায়"
              caption="তিনটা মডিউল একটা শিকলের তিনটা আংটা। আগের মডিউল TCP/IP দুইটা Program এর মাঝে একটা নির্ভরযোগ্য Byte এর রাস্তা খুলে দিয়েছে, কিন্তু সেই Byte এর মানে কী, তা বলেনি। এই মডিউল সেই রাস্তার উপর একটা সাধারণ ভাষা বসায়, যাতে Browser চাইতে পারে আর Server উত্তর দিতে পারে, আর তারপর পুরো কথাটায় তালা লাগায়। পরের মডিউল Linux & VPS ধরে নেয় আপনি এই ভাষা জানেন, তারপর আপনাকে নিজের একটা Server এ নামিয়ে দেয়, যেখানে এই ভাষায় উত্তর দেওয়ার Program টা আপনি নিজে চালাবেন আর পাহারা দেবেন।"
              before={{
                tag: "Module 05",
                title: "TCP/IP & Transport",
                lines: ["নির্ভরযোগ্য Connection", "Byte ঠিক ক্রমে পৌঁছায়", "Byte এর মানে জানে না"],
              }}
              current={{
                tag: "Module 06",
                title: "HTTP & HTTPS",
                lines: ["Request আর Response এর ভাষা", "মনে রাখা, Login, অনুমতি", "তালাবন্ধ কথা, HTTPS"],
              }}
              after={{
                tag: "Module 07",
                title: "Linux & VPS",
                lines: ["নিজের Server এ নামা", "Program চালানো আর পাহারা", "এই ভাষার উত্তরদাতা আপনি"],
              }}
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলটা আগের মডিউলগুলোর অনেকগুলো খোলা সুতো এক জায়গায় বাঁধে, তাই
                সুতোগুলো একবার মনে করিয়ে দিই। Module 02 এর শেষ লেসনে আপনি একটা
                Request এর পুরো যাত্রা দেখেছিলেন, URL লেখা থেকে Database পর্যন্ত। সেই
                যাত্রার শুরু আর শেষ, অর্থাৎ Browser কী লিখে পাঠায় আর Server কী লিখে
                ফেরত দেয়, তখন খোলা হয়নি। এই মডিউলে খোলা হবে।
              </ContentParagraph>
              <ContentParagraph>
                Module 04 এর Domain Setup লেসনে শুনেছিলেন, একটা Hosting সেবায় শুধু DNS
                Record বসালেই হয় না, সেবার ভেতরেও Domain টা যোগ করতে হয়, দুইটা কারণে।
                একটা হলো Server কে জানতে হয় আপনি কোন নামের সাইট চাইছেন, আরেকটা হলো
                সেই নামের একটা Certificate লাগে। প্রথম কারণটা HTTP এর একটা ছোট লাইনে
                লুকানো, দ্বিতীয়টা HTTPS এর। দুইটাই এই মডিউলে পরিষ্কার হবে।
              </ContentParagraph>
              <ContentParagraph>
                আর Module 05 এর শেষ লেসনে দেখেছিলেন একটা Connection কাজ শেষেও কিছুক্ষণ
                খোলা রাখা হয়, যদি পর্যটক আরেকটা পাতা খোলেন। কে সেই সিদ্ধান্ত নেয়, আর
                দিনে কয়েকবার যে রহস্যময় 502 আসত, সেই সংখ্যাটা আসলে কোন ভাষার, তার
                উত্তরও এখানে। আগে যা আলাদা আলাদা অংশ ছিল, এই মডিউলের শেষে তা একটা
                পুরো যাত্রা হয়ে যাবে, Address Bar থেকে পর্দায় আঁকা পাতা পর্যন্ত।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-you-will-learn",
      subHeader: { index: "003", title: "What You Will Learn" },
      title: <SectionTitle>দশটা লেসন, দশটা প্রশ্ন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              প্রতিটা লেসন একটা প্রশ্নের উত্তর দেয়। নিচে দশটা লেসন আর তাদের প্রশ্ন।
              যেকোনোটায় চাপ দিলে সরাসরি সেই লেসনে চলে যাবেন, তবে প্রথমবার ক্রম
              ধরে পড়াই ভালো, কারণ প্রতিটা লেসন আগেরটার উপর দাঁড়িয়ে।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <ModuleRoadmap
              moduleId="http-https"
              questions={{
                "url-vs-uri":
                  "Address Bar এর একটা লাইনে আসলে কয়টা আলাদা তথ্য লুকিয়ে আছে, আর তার কোন অংশটা কখনো Server পর্যন্ত যায়ই না?",
                "http-basics":
                  "TCP এর Byte এর ধারায় Browser ঠিক কী লিখে পাঠায়, আর Server প্রতিবার আপনাকে ভুলে যায় কেন?",
                "http-methods-status-codes":
                  "একই ঠিকানায় দেখা, বানানো, বদলানো আর মোছা আলাদা হয় কীভাবে, আর উত্তরের তিন অঙ্কের সংখ্যাটা কী বলে?",
                "http-headers":
                  "Request আর Response এর গায়ে লেখা ছোট ছোট নির্দেশগুলো কী করে, আর CORS এর লাল লেখাটা কোথা থেকে আসে?",
                "cookies":
                  "সবকিছু ভুলে যাওয়া Server আপনাকে পরের Request এ চেনে কীভাবে, আর সেই চেনার চাবি চুরি হওয়া ঠেকায় কে?",
                "session-vs-jwt":
                  "Login এর পরে আপনার পরিচয় Server এর খাতায় রাখবেন নাকি একটা সই করা কাগজে, আর কোনটার দাম কোথায়?",
                "https-tls-ssl":
                  "পথের প্রতিটা হাত পার হয়েও কথাটা গোপন আর অক্ষত থাকে কীভাবে, আর তালাটা লাগে কোন ধাপে?",
                "certificates-keys":
                  "আপনি যে আসল Island Tours এর সাথেই কথা বলছেন, নকল কারো সাথে নয়, Browser সেটা নিশ্চিত হয় কীভাবে?",
                "https-journey":
                  "Enter চাপা থেকে পাতা আঁকা পর্যন্ত প্রতিটা ধাপ কোনটার পর কোনটা, কোথায় কত সময় যায়, আর আটকালে কোথায় খুঁজবেন?",
                "websocket-realtime":
                  "Browser না চাইলে Server কথা বলতে পারে না, তাহলে Live আসনের তালিকা নিজে থেকে বদলায় কীভাবে?",
              }}
              footer="দশটা লেসন চার ভাগে পড়লে মনে রাখা সহজ। প্রথম চারটা হলো ভাষাটা নিজে: ঠিকানা, বার্তার ছাঁচ, কাজের নাম আর উত্তরের সংখ্যা, আর গায়ের নির্দেশ। পরের দুইটা হলো মনে রাখা: Cookie আর Login। তার পরের দুইটা হলো তালা: HTTPS আর Certificate। শেষ দুইটা হলো পুরো ছবি: পুরো যাত্রা একসাথে, আর Server নিজে থেকে কথা বলার উপায়।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার একই দশটা লেসন একটা গল্প হিসেবে শুনুন, যাতে বোঝা যায় কোনটা
                কোনটার জন্য পথ তৈরি করে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>লেসন ১, URL vs URI:</strong> শুরু হবে সবচেয়ে চেনা
                  জিনিসটা দিয়ে, Address Bar এর লাইন। আপনি প্রতিদিন দেখেন, কিন্তু
                  একটা লাইনে কয়টা ভাগ আছে, কোন ভাগ কী কাজ করে, বাংলা লেখা কেন অদ্ভুত
                  চিহ্নে বদলে যায়, আর <code>#</code> চিহ্নের পরের অংশটা কেন কখনো
                  Server পর্যন্ত যায় না, তা হয়তো কখনো ভাবেননি। এখানে একটা ছোট শব্দও
                  আসবে, Origin, যেটা পরে Cookie আর CORS দুই জায়গাতেই চাবির কাজ করবে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ২, HTTP Protocol Basics:</strong> এবার ঠিকানা ধরে
                  আসল কথা। TCP এর Connection খোলার পর Browser কয়েকটা লাইন লেখে আর
                  Server কয়েকটা লাইন ফেরত দেয়। আপনি নিজের হাতে, কোনো Browser ছাড়া,
                  সেই লাইনগুলো টাইপ করে একটা Server এর সাথে কথা বলবেন। জানবেন Server
                  প্রতিটা Request কে নতুন মানুষের মতো দেখে কেন, একটাই IP তে একশটা সাইট
                  চলে কীভাবে, আর HTTP এর তিনটা বড় Version এর গল্প, যার সর্বশেষটা
                  চলে আপনার চেনা UDP র উপরে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৩, HTTP Methods & Status Codes:</strong> একই ঠিকানায়
                  আপনি একটা ট্যুর দেখতে পারেন, বুক করতে পারেন, বুকিং বদলাতে বা বাতিল
                  করতে পারেন। Request এর প্রথম শব্দটা বলে দেয় কোনটা, আর এই শব্দের
                  সাথে কিছু গুরুত্বপূর্ণ প্রতিশ্রুতি জড়ানো, যেমন একই Request দুইবার
                  গেলে কী হবে। উপরের দুইবার টাকা কাটার সমস্যার সমাধান এখানেই। সাথে
                  উত্তরের তিন অঙ্কের সংখ্যাগুলো, 200 থেকে 504, প্রতিটার আসল মানে আর
                  নিজের API তে কখন কোনটা ফেরত দেবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৪, HTTP Headers:</strong> প্রতিটা Request আর Response
                  এর গায়ে কিছু ছোট নির্দেশ লেখা থাকে, যাদের বলে Header। কোন ভাষায়
                  পাতা চাই, উত্তরটা কী ধরনের ফাইল, কতক্ষণ মনে রাখা যাবে। এই লেসনের
                  সবচেয়ে বড় দুইটা অংশ হলো Cache, অর্থাৎ পুরনো পাতা কেন দেখায় আর কীভাবে
                  ঠিক করবেন, আর CORS, অর্থাৎ শুরুর সেই লাল লেখাটা কেন আসে আর কোন পাশে
                  কী বদলালে যায়।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৫, Cookies:</strong> HTTP নিজে কিছু মনে রাখে না, অথচ
                  সাইট আপনাকে চেনে। এই চেনাটা আসে একটা ছোট লেখা থেকে, যা Server একবার
                  দিয়ে দেয় আর Browser প্রতিবার ফেরত আনে। লেসনটা দেখাবে সেই লেখার গায়ে
                  কী কী শর্ত বসানো যায়, আর প্রতিটা শর্ত কোন একটা সত্যিকারের আক্রমণ
                  ঠেকায়। Refresh দিলেই Logout হয়ে যাওয়ার সমস্যাটা প্রায় সবসময় এখানেই
                  ধরা পড়ে।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৬, Session vs JWT:</strong> Login এর পর Server কে
                  প্রতিটা Request এ জানতে হয় আপনি কে। দুইটা বড় পথ আছে। একটায় Server
                  নিজের খাতায় লিখে রাখে আর আপনাকে শুধু একটা নম্বর দেয়। অন্যটায় Server
                  আপনার পরিচয় একটা কাগজে লিখে সই করে আপনার হাতেই দিয়ে দেয়। দুইটার
                  সুবিধা আর দাম আলাদা জায়গায়, আর এই লেসন শেষে আপনি নিজের App এর জন্য
                  যুক্তি দিয়ে একটা বেছে নিতে পারবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৭, HTTPS, TLS, and SSL:</strong> এতক্ষণের সব কথা
                  খোলা চিঠির মতো যায়। ক্যাফের Wi-Fi, বাসার Router, ISP আর মাঝের
                  প্রতিটা Hop চাইলে পড়তে পারে, বদলাতেও পারে। এই লেসন দেখাবে দুইজন
                  অচেনা যন্ত্র, যারা আগে কখনো কথা বলেনি, খোলা রাস্তার উপর দিয়েই কীভাবে
                  একটা গোপন চাবিতে একমত হয়। আর HTTPS কী লুকায় আর কী লুকায় না, সেটাও।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৮, Certificates, Public Key, and Private Key:</strong>{" "}
                  গোপন চাবিতে একমত হলেই হয় না, নিশ্চিত হতে হয় ওপাশে আসল Island Tours
                  ই আছে। এই নিশ্চয়তা আসে একটা ডিজিটাল পরিচয়পত্র থেকে, আর সেই পরিচয়পত্রে
                  সই করে এমন কিছু প্রতিষ্ঠান, যাদের আপনার Browser আগে থেকেই বিশ্বাস
                  করে। নিজের হাতে একটা পরিচয়পত্র বানাবেন, Browser কেন সেটা মানে না তা
                  দেখবেন, আর তিন মাস পরে সাইট বন্ধ হয়ে যাওয়ার সমস্যাটা কেন ঘটে আর কীভাবে
                  ঠেকায় তা শিখবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ৯, Full HTTPS Journey:</strong> এবার সব অংশ এক
                  সুতোয়। পর্যটক Address Bar এ একটা লাইন লিখে Enter চাপলেন। নাম থেকে
                  ঠিকানা, Connection, তালা, পরিচয়পত্র যাচাই, Request, Server এর ভেতরের
                  কাজ, উত্তর, আর পাতা আঁকা পর্যন্ত প্রতিটা ধাপ ঠিক ক্রমে। প্রতিটা ধাপে
                  কত সময় গেল তা নিজের Terminal এ মাপবেন, আর সাইট না খুললে কোন ধাপে
                  আটকেছে তা বার্তা দেখে বের করার একটা ছক পাবেন।
                </ListItem>
                <ListItem>
                  <strong>লেসন ১০, WebSocket & Real-time Communication:</strong> HTTP
                  তে কথা সবসময় Browser শুরু করে। তাহলে Server নিজে থেকে কীভাবে জানাবে
                  যে নৌকার একটা আসন এইমাত্র বিক্রি হয়ে গেল? এই লেসনে চারটা উপায়
                  পাশাপাশি দেখবেন, একটা সাধারণ HTTP Request কীভাবে একটা খোলা দুইমুখী
                  লাইনে বদলে যায় তা নিজের হাতে করবেন, আর এক মিনিট পরপর থেমে যাওয়ার
                  সমস্যাটা ধরবেন। মডিউলের শেষ লেসন বলে এর শেষে দশটা লেসন একটা গল্পে
                  জোড়া লাগানো হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                দশটা লেসনেই একই দৃশ্য চলে, আগের মডিউলের সেই একই পর্যটক। ঢাকা থেকে
                তিনি ফোনে <code>https://islandtours.example/tours/saint-martin</code>{" "}
                খুলেছেন, Saint Martin Island Escape ট্যুরের পাতা। ফোনের ঠিকানা
                192.168.1.20, বাসার Router এর বাইরের ঠিকানা 203.0.113.25, আর Server
                103.94.135.2 এর Port 443। সেখানে Caddy নামের একটা Program দরজায়
                দাঁড়িয়ে তালা খোলে আর কথাটা ভেতরের App এর হাতে দেয়, যে App বসে আছে
                Port 3000 এ। প্রতিটা লেসন এই একই ভ্রমণকে নিজের দিক থেকে দেখে, তাই শেষে
                আপনার মাথায় দশটা আলাদা বিষয় থাকবে না, থাকবে একটাই যাত্রা।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "why-learn-it",
      subHeader: { index: "004", title: "Why Learn It" },
      title: <SectionTitle>fetch তো এক লাইনেই কাজ করে, তবু কেন শিখব</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রশ্নটা ন্যায্য। JavaScript এ <code>fetch</code> এর এক লাইন লিখলেই
                Data চলে আসে। Next.js বা NestJS এর মতো Framework Request পড়ে,
                Response সাজায়, Cookie বসায়, সব করে দেয়। Vercel আর Caddy এর মতো সেবা
                HTTPS নিজে থেকে চালু করে। তাহলে ভেতরের লেখাগুলো জানার দরকার কী?
              </ContentParagraph>
              <ContentParagraph>
                সৎ উত্তর হলো, Framework আপনার হয়ে লেখাগুলো লেখে, কিন্তু কী লিখবে
                সেই সিদ্ধান্তগুলো আপনাকেই দিতে হয়। কোন Status Code ফেরত দেবেন, কোন
                জিনিস কতক্ষণ Cache হবে, Cookie এর গায়ে কোন শর্ত বসবে, কোন সাইট থেকে
                আসা Request মানবেন, Login এর পরিচয় কোথায় রাখবেন। এই প্রতিটা প্রশ্নের
                একটা Default উত্তর Framework দিয়ে রাখে, আর সেই Default আপনার App এর
                জন্য ঠিক কি না, তা বিচার করতে হলে ভাষাটা জানতে হয়। তার উপর এই স্তরের
                ভুলগুলো প্রায়ই চুপচাপ থাকে। ভুল Cache এর কোনো Error নেই, শুধু পর্যটক
                পুরনো দাম দেখেন। দুর্বল Cookie এর কোনো Error নেই, শুধু একদিন কারো
                Account বেহাত হয়।
              </ContentParagraph>
              <ContentParagraph>
                না শিখলে পরে যা যা দাম দিতে হয়, সেগুলো এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Debug করবেন অন্ধকারে:</strong> Browser এর Developer Tools
                  এর Network Tab প্রতিটা Request আর Response খুলে দেখায়। কিন্তু
                  সেখানে কী খুঁজতে হবে তা না জানলে পুরো তালিকাটা শুধু রঙিন লাইনের সারি।
                  এই মডিউলের পরে সেই তালিকাই হবে আপনার সবচেয়ে বড় Debug এর যন্ত্র।
                </ListItem>
                <ListItem>
                  <strong>নিজের API অন্যদের কাছে অদ্ভুত লাগবে:</strong> Mobile App
                  বানানো সহকর্মী, Partner কোম্পানি বা ভবিষ্যতের আপনি, সবাই ধরে নেন
                  একটা API একটা সাধারণ নিয়ম মানবে। সব Error এ 200 ফেরত দিলে বা মোছার
                  কাজ GET দিয়ে করলে তাঁদের Code ভাঙবে, আর ভাঙবে এমন জায়গায় যা খুঁজে পেতে
                  সময় লাগে।
                </ListItem>
                <ListItem>
                  <strong>নিরাপত্তার ফুটো থাকবে, কেউ টের পাবে না:</strong> Cookie এর
                  একটা শর্ত বাদ পড়লে, Login এর চাবি ভুল জায়গায় রাখলে, বা একটা সই করা
                  কাগজ ঠিকমতো যাচাই না করলে App সুন্দর চলে, যতদিন না কেউ সেই ফুটোটা
                  খুঁজে পান। এই মডিউলের তিনটা লেসন পুরোপুরি এই ফুটোগুলো নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>সাইট এক সকালে বন্ধ হয়ে যাবে:</strong> HTTPS এর পরিচয়পত্রের
                  একটা মেয়াদ আছে। নবীকরণ কে করে, না হলে কী হয়, কীভাবে আগে থেকে টের
                  পাবেন, এসব না জানলে সমস্যাটা প্রথম জানাবেন আপনার পর্যটকেরা।
                </ListItem>
                <ListItem>
                  <strong>পরের মডিউলগুলো ভিত ছাড়া দাঁড়াবে:</strong> Linux আর VPS এর
                  মডিউলে আপনি নিজের Server এ HTTP এর উত্তর দেবেন। Reverse Proxy র
                  মডিউলে Caddy আর Nginx এর প্রায় প্রতিটা লাইন HTTP এর Header, HTTPS
                  আর Timeout নিয়ে। Backend Architecture এর মডিউলে Auth আর API নকশা,
                  আর Observability তে Status Code গুনে সাইটের স্বাস্থ্য মাপা। সব
                  জায়গায় এই মডিউলের শব্দ ফিরে আসবে।
                </ListItem>
                <ListItem>
                  <strong>Interview এর সবচেয়ে পরিচিত প্রশ্নে আটকাবেন:</strong> Browser
                  এ একটা ঠিকানা লিখে Enter চাপলে কী হয়, Session আর JWT এর তফাত কী,
                  HTTPS কীভাবে কাজ করে, PUT আর PATCH এ পার্থক্য কোথায়। Web এর কাজের
                  Interview এ এগুলো প্রায় নিশ্চিত আসে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এই মডিউল কয়েকটা প্রচলিত ভুল ধারণাও সরিয়ে দেয়, যেগুলো অনেকে বছরের পর
                বছর বয়ে বেড়ান।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>ভুল ধারণা, HTTPS থাকলেই সাইট নিরাপদ:</strong> HTTPS রাস্তার
                  কথাটা রক্ষা করে, Server এর ভেতরের ভুল নয়। তালাবন্ধ খামে ভুল নির্দেশ
                  পাঠালেও সেটা ভুল নির্দেশই থাকে। HTTPS ঠিক কোন জিনিসটা রক্ষা করে, তা
                  লেসন ৭ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, CORS আমার Server কে রক্ষা করে:</strong> CORS এর
                  নিয়ম মানে Browser, Server নয়। Terminal থেকে একই Request পাঠালে CORS
                  কিছুই আটকায় না। তাহলে CORS আসলে কাকে রক্ষা করে, তা লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, JWT এর ভেতরের লেখা গোপন:</strong> সাধারণ একটা JWT
                  যে কেউ খুলে পড়তে পারেন, সেটা শুধু সই করা, তালাবন্ধ নয়। লেসন ৬ এ নিজের
                  হাতে একটা খুলে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, POST দিয়ে পাঠালে GET এর চেয়ে নিরাপদ:</strong>{" "}
                  দুইটাই একই রকম খোলা, যদি না রাস্তাটা HTTPS হয়। পার্থক্যটা অন্য
                  জায়গায়, আর সেটা লেসন ১ আর লেসন ৩ মিলিয়ে বুঝবেন।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Cookie মানেই বিজ্ঞাপনের নজরদারি:</strong> আপনার
                  প্রতিটা Login এই Cookie এর উপরেই দাঁড়িয়ে। নজরদারির Cookie আর Login
                  এর Cookie এর তফাত, আর Browser গুলো কেন একটাকে কড়া হাতে আটকাচ্ছে,
                  লেসন ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>ভুল ধারণা, Real-time মানেই WebSocket:</strong> অনেক Live
                  জিনিসের জন্য আরও সহজ উপায় আছে, যেটা সাধারণ HTTP এর উপরেই চলে। কোন
                  কাজে কোনটা, লেসন ১০ এ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "পুরো মডিউলে একটাই অভ্যাস ধরে রাখুন",
          content: (
            <p>
              Web এর যেকোনো সমস্যায় দুইটা প্রশ্ন করুন। Browser আসলে কী পাঠাল, আর
              Server আসলে কী ফেরত দিল। অনুমান নয়, চোখে দেখা লেখা। প্রায় প্রতিটা
              রহস্যের উত্তর এই দুইটা লেখার কোনো একটা লাইনে বসে থাকে, একটা ভুল সংখ্যা,
              একটা বাদ পড়া Header, একটা ভুল শর্তের Cookie। দশটা লেসন আসলে এই দুইটা
              লেখা পড়তে শেখার দশটা ধাপ, আর প্রতিটা লেসন শেখাবে কোথায় তাকিয়ে লেখাটা
              দেখা যায়।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "where-it-helps",
      subHeader: { index: "005", title: "Where It Helps" },
      title: <SectionTitle>কাজের জায়গায় ঠিক কোন মুহূর্তগুলোতে লাগবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচে সাতটা সত্যিকারের মুহূর্ত, যেগুলো একজন Web Developer বা DevOps
              Engineer এর কাজে বারবার আসে। একটা একটা করে বেছে দেখুন, এই মডিউল না
              জানলে সেই মুহূর্তটা কেমন যায়, আর জানলে কেমন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <RealLifeLab
              scenarios={[
                {
                  id: "cors-error",
                  label: "Console এ CORS এর লাল লেখা",
                  situation:
                    "Frontend চলছে localhost:5173 এ, Backend চলছে localhost:3001 এ। Frontend থেকে ট্যুরের তালিকা চাইলে পাতায় কিছু আসে না, Console এ লেখা blocked by CORS policy। অথচ Terminal থেকে একই ঠিকানায় চাইলে তালিকা দিব্যি আসে।",
                  without:
                    "Internet ঘেঁটে একটা Setting নকল করেন, যা সব সাইটকে সব কিছুর অনুমতি দিয়ে দেয়। লাল লেখা যায়, কিন্তু Login যোগ করার দিন আবার ফেরে, আর এবার নকল করা Setting টা কাজই করে না।",
                  withIt:
                    "জানেন Port আলাদা হওয়ায় Browser এর চোখে এরা দুইটা আলাদা Origin, আর অন্য Origin এর উত্তর Code এর হাতে দেওয়ার আগে Browser Server এর একটা লিখিত অনুমতি খোঁজে। Server এ শুধু নিজের Frontend এর Origin টার অনুমতি লেখেন, আর Login এর জন্য যে বাড়তি শর্ত লাগে সেটাও জানেন।",
                  lessons: ["HTTP Headers", "URL vs URI"],
                },
                {
                  id: "logout-on-refresh",
                  label: "Refresh দিলেই Logout",
                  situation:
                    "Login সফল, পাতা বদলাল, নাম দেখাচ্ছে। কিন্তু Refresh দিলেই আবার Login এর পাতা। Production এ ঠিক চলে, শুধু নিজের যন্ত্রে এমন হয়। অথবা উল্টো, নিজের যন্ত্রে চলে, Production এ হয়।",
                  without:
                    "Login এর Code বারবার পড়েন, Database এ User খোঁজেন, সব ঠিক পান। শেষে কারো কথায় পরিচয়টা Browser এর এমন জায়গায় রাখেন, যেখান থেকে যেকোনো Script সেটা পড়ে নিতে পারে।",
                  withIt:
                    "Developer Tools এ দেখেন Server যে Cookie দিয়েছিল তা Browser আদৌ রেখেছে কি না, আর রাখলে পরের Request এ ফেরত পাঠাচ্ছে কি না। গায়ের কোন শর্তটা এই ঠিকানায় মিলছে না, তা পড়েই বুঝে যান, আর নিরাপত্তা না কমিয়েই ঠিক করেন।",
                  lessons: ["Cookies", "Session vs JWT"],
                },
                {
                  id: "double-charge",
                  label: "একবার Pay, দুইবার টাকা",
                  situation:
                    "ধীর Mobile Network এ একজন পর্যটক Pay চাপলেন। কিছুক্ষণ কিছু না দেখে আবার চাপলেন। তাঁর একটা বুকিংয়ের জন্য টাকা কাটা হলো দুইবার, আর Support এ রাগী একটা বার্তা এলো।",
                  without:
                    "বোতামটা প্রথম চাপের পর বন্ধ করে দেন। পরের সপ্তাহে একই ঘটনা, এবার কারণ App নিজেই Network এর গোলমালে Request টা আবার পাঠিয়েছিল।",
                  withIt:
                    "জানেন কোন ধরনের Request দুইবার গেলেও ফল একবারই হয় আর কোনটায় হয় না। Payment এর মতো কাজে প্রতিটা চেষ্টার সাথে একটা অনন্য চাবি পাঠান, যাতে Server একই চাবি দ্বিতীয়বার দেখলে নতুন করে টাকা না কেটে আগের ফলটাই ফেরত দেয়।",
                  lessons: ["HTTP Methods & Status Codes", "HTTP Protocol Basics"],
                },
                {
                  id: "stale-page",
                  label: "Deploy এর পরেও পুরনো পাতা",
                  situation:
                    "ট্যুরের দাম বদলে নতুন Version তুললেন। আপনি নিজে নতুন দাম দেখছেন, কিন্তু কয়েকজন পর্যটক এখনো পুরনো দাম দেখছেন, আর একজন পুরনো দামে বুক করতে চাইছেন।",
                  without:
                    "পর্যটকদের বলেন Cache Clear করুন। কেউ জানেন না সেটা কী। পরের Deploy তে একই ঘটনা।",
                  withIt:
                    "জানেন Server নিজেই প্রতিটা উত্তরের সাথে বলে দেয় সেটা কতক্ষণ মনে রাখা যাবে, Browser এ আর মাঝের CDN এ। দামের মতো বদলানো জিনিস কখনো লম্বা সময় মনে রাখতে দেন না, আর ছবির মতো না বদলানো জিনিস বছরখানেক রাখতে দেন, এমনভাবে যাতে নতুন ফাইল এলে পুরনোটা নিজে থেকেই বাদ পড়ে।",
                  lessons: ["HTTP Headers", "Full HTTPS Journey"],
                },
                {
                  id: "cert-expired",
                  label: "এক সকালে Your connection is not private",
                  situation:
                    "তিন মাস সব ঠিক চলছিল। আজ সকাল থেকে সবাই একটা লাল সতর্কবার্তা দেখছেন, আর বেশিরভাগ পর্যটক ভয়ে ফিরে যাচ্ছেন। Server চালু, App চালু, কিছুই বদলানো হয়নি।",
                  without:
                    "Server Restart করেন, DNS দেখেন, Hosting এর Support কে লেখেন। কয়েক ঘণ্টা পরে কেউ জানান সাইটের পরিচয়পত্রের মেয়াদ গতকাল শেষ হয়েছে।",
                  withIt:
                    "সতর্কবার্তার ছোট লেখাটা পড়েই বোঝেন সমস্যাটা মেয়াদের। এক লাইনের Command এ মেয়াদ দেখেন, কেন নিজে থেকে নবীকরণ হয়নি তা খোঁজেন, আর এরপর থেকে মেয়াদ শেষের অনেক আগেই নিজে খবর পাওয়ার ব্যবস্থা রাখেন।",
                  lessons: ["Certificates, Public Key, and Private Key", "HTTPS, TLS, and SSL"],
                },
                {
                  id: "slow-site",
                  label: "সাইট ধীর, কিন্তু কোথায়",
                  situation:
                    "পর্যটকেরা বলছেন প্রথম পাতা খুলতে অনেক সময় লাগে। Server এর CPU প্রায় অলস, Database এর Query দ্রুত। তবু পাতা আসতে দুই সেকেন্ডের বেশি।",
                  without:
                    "Code Optimize করেন, বড় Server কেনেন। পাতা একই রকম ধীর থাকে, কারণ সময়টা যাচ্ছিল Code এ পৌঁছানোর আগেই।",
                  withIt:
                    "একটা Command এ সময়টা ভাগ করে মাপেন: নাম খোঁজায় কত, Connection এ কত, তালা লাগাতে কত, প্রথম উত্তর আসতে কত। দেখেন সবচেয়ে বড় ভাগটা কোথায়, আর ঠিক সেই ধাপটাই ঠিক করেন।",
                  lessons: ["Full HTTPS Journey", "HTTP Protocol Basics"],
                },
                {
                  id: "realtime-stops",
                  label: "Live তালিকা এক মিনিট পরপর থামে",
                  situation:
                    "নৌকার খালি আসনের Live তালিকা ল্যাপটপে নিখুঁত চলে। Server এ তুলে সামনে Proxy বসানোর পর ঠিক এক মিনিট চুপ থাকলেই তালিকা আর বদলায় না, পাতা Refresh দিলে আবার চলে।",
                  without:
                    "প্রতি কয়েক সেকেন্ডে পুরো পাতা নিজে থেকে Refresh করার Code বসান। Server এর উপর চাপ দশগুণ বাড়ে, আর Live ভাবটাও চলে যায়।",
                  withIt:
                    "জানেন চুপ করে থাকা একটা খোলা লাইনকে মাঝের Proxy নিজের সময়সীমা পার হলে কেটে দেয়। লাইনে নিয়মিত ছোট একটা সাড়া পাঠানোর ব্যবস্থা করেন, কেটে গেলে নিজে থেকে আবার জোড়ার Code লেখেন, আর Proxy র সময়সীমাটাও মিলিয়ে নেন।",
                  lessons: ["WebSocket & Real-time Communication", "HTTP Headers"],
                },
              ]}
              footer="সাতটা মুহূর্তের প্রতিটায় খেয়াল করুন, তফাতটা বুদ্ধির নয়, জানার। যিনি জানেন তিনি বেশি পরিশ্রম করছেন না, বরং কম করছেন, কারণ তিনি জানেন Request আর Response এর কোন লাইনে তাকাতে হবে। নিচে লেখা লেসনের নামগুলো মনে রাখুন, মডিউল পড়ার সময় এই মুহূর্তগুলো আবার ফিরে আসবে।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এর বাইরেও এই মডিউলের শব্দ আর ধারণা আপনার চোখে পড়বে এই জায়গাগুলোতে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Browser এর Developer Tools এ:</strong> Network Tab এ প্রতিটা
                  Request এর Method, Status, Header আর সময়ের ভাগ। Application Tab এ
                  Cookie এর তালিকা আর তাদের গায়ের শর্ত। Address Bar এর তালার চিহ্নে চাপ
                  দিলে সাইটের পরিচয়পত্র। এই তিন জায়গা এই মডিউলে আপনার রোজকার
                  কাজের টেবিল হবে।
                </ListItem>
                <ListItem>
                  <strong>Error বার্তায়:</strong> 404, 500, 502, 503 এর মতো সংখ্যা,
                  CORS এর লাল লেখা, ERR_CERT_DATE_INVALID এর মতো Browser এর
                  সতর্কবার্তা, আর Log এ লেখা Request এর লাইন, যেখানে প্রতিটা Request
                  এর Method, ঠিকানা আর Status এক লাইনে থাকে।
                </ListItem>
                <ListItem>
                  <strong>Config ফাইলে:</strong> Caddy বা Nginx এর Config এ HTTPS আর
                  Header এর লাইন, Next.js এর Config এ Header বসানোর অংশ, App এর
                  Environment Variable এ Login এর গোপন চাবি, আর Cloudflare এর
                  Dashboard এ SSL এর Mode, যা Module 04 এ এক ঝলক দেখেছিলেন।
                </ListItem>
                <ListItem>
                  <strong>Terminal এ:</strong> <code>curl</code> এর নানা রূপ, যা
                  দিয়ে আপনি Browser ছাড়াই যেকোনো Request পাঠাবেন আর পুরো উত্তর
                  দেখবেন, Cookie রাখবেন, সময় মাপবেন। <code>openssl</code>, যা দিয়ে
                  যেকোনো সাইটের পরিচয়পত্র খুলে পড়বেন আর নিজেরটা বানাবেন। আর Node.js
                  এ নিজের হাতে লেখা ছোট ছোট Server। প্রতিটা Command যে লেসনে আসবে,
                  সেখানেই হাতে কলমে করানো হবে।
                </ListItem>
                <ListItem>
                  <strong>API এর নথিতে:</strong> যেকোনো সেবার API এর নথি, Payment
                  Gateway হোক বা ইমেইল পাঠানোর সেবা, একই ভাষায় লেখা। কোন Method, কোন
                  ঠিকানা, কোন Header এ চাবি, সফল হলে কোন Status, ব্যর্থ হলে কোনটা। এই
                  মডিউলের পরে যেকোনো API এর নথি আপনি প্রথমবারেই পড়তে পারবেন।
                </ListItem>
                <ListItem>
                  <strong>দলের আলাপে আর Interview এ:</strong> REST, Idempotent,
                  Preflight, HttpOnly, SameSite, Bearer Token, Handshake, Chain of
                  Trust, এই শব্দগুলো সহকর্মীরা প্রতিদিনের আলাপে ধরে নিয়েই বলেন। আর
                  Browser এ ঠিকানা লেখার পর কী হয়, এই প্রশ্নটা Interview এ সম্ভবত
                  সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নগুলোর একটা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "in-real-life",
      subHeader: { index: "006", title: "In Real Life" },
      title: <SectionTitle>Island Tours আর আপনার my-tours এ এর ব্যবহার</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Island Tours এ একজন পর্যটক একটা ট্যুরের পাতা খুললেই পর্দার পেছনে
                কয়েক ডজন Request যায়। পাতার মূল লেখা, ছবি, Style এর ফাইল, Script, আর
                ট্যুরের তারিখ ও দামের Data। বুকিং করলে আরও কয়েকটা, Login থাকলে প্রতিটার
                সাথে পরিচয়ের প্রমাণ। আর প্রতিটা Request ই HTTPS এ তালাবন্ধ। তাই এই
                মডিউলের জ্ঞান Island Tours এর কোনো এক কোণায় নয়, প্রতিটা পাতার প্রতিটা
                অংশে।
              </ContentParagraph>
              <ContentParagraph>
                দিনের কাজে এটা যেভাবে চেহারা নেয়, তার কয়েকটা নমুনা। প্রতিটার পাশে
                বলা আছে কোন লেসনে সেটা খোলা হবে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>দরজায় একজন তালাওয়ালা:</strong> Server এর Port 443 এ Caddy
                  বসে থাকে। সে HTTPS এর তালা খোলে, পরিচয়পত্রটা নিজে জোগাড় করে আর মেয়াদ
                  শেষের আগে নিজেই নবীকরণ করে। Port 80 এ কেউ এলে তাকে তালাবন্ধ ঠিকানায়
                  পাঠিয়ে দেয়। ভেতরের App তালা নিয়ে কিছুই ভাবে না। এই ভাগাভাগি কেন আর
                  কীভাবে, লেসন ৭ আর ৮ এ।
                </ListItem>
                <ListItem>
                  <strong>পরিষ্কার একটা API:</strong> ট্যুরের তালিকা, একটা ট্যুর, নতুন
                  বুকিং, বুকিং বদলানো আর বাতিল, প্রতিটার নিজের ঠিকানা আর নিজের কাজের
                  শব্দ। নতুন বুকিং সফল হলে Server বলে দেয় বুকিংটা কোথায় পাওয়া যাবে, আর
                  একই আসন দুইজন একসাথে চাইলে দ্বিতীয়জন একটা নির্দিষ্ট সংখ্যা পান, যা দেখে
                  App বোঝে আসনটা আর খালি নেই। লেসন ১ আর ৩ এ।
                </ListItem>
                <ListItem>
                  <strong>কী মনে রাখা যাবে, কী নয়:</strong> ট্যুরের ছবি আর Style এর
                  ফাইল এক বছর পর্যন্ত মনে রাখতে বলা হয়। দাম আর খালি আসনের সংখ্যা কখনো
                  লম্বা সময় নয়। আর কারো বুকিংয়ের তথ্য মাঝের কোনো CDN এ কখনো জমা হয় না।
                  লেসন ৪ এ।
                </ListItem>
                <ListItem>
                  <strong>Partner সাইটে বুকিংয়ের ছোট জানালা:</strong>{" "}
                  seagulltours.example নামের একটা Partner সাইট নিজের পাতায় Island Tours
                  এর বুকিংয়ের একটা ছোট অংশ বসিয়েছে। তাদের পাতা থেকে Island Tours এর
                  কাছে Request আসে, আর Server ঠিক কোন সাইটকে কতটুকু অনুমতি দেবে তা লিখে
                  রাখে। লেসন ৪ আর ৫ এ।
                </ListItem>
                <ListItem>
                  <strong>দুই রকম Login:</strong> Website এ Login করলে পরিচয়টা থাকে
                  Server এর খাতায়, Redis এ, আর Browser এর হাতে থাকে শুধু একটা লম্বা
                  এলোমেলো নম্বর, এমন শর্তে বাঁধা যে কোনো Script সেটা পড়তে পারে না। Mobile
                  App এ পরিচয় যায় একটা সই করা ছোট কাগজে, যার মেয়াদ মাত্র পনেরো মিনিট।
                  একই কোম্পানি দুই জায়গায় দুই পথ কেন বেছে নিল, তা লেসন ৫ আর ৬ এর
                  সবচেয়ে কাজের আলোচনা।
                </ListItem>
                <ListItem>
                  <strong>দুইবার টাকা না কাটা:</strong> Payment এর প্রতিটা চেষ্টার সাথে
                  App একটা অনন্য চাবি পাঠায়। Network এর গোলমালে একই চেষ্টা দুইবার
                  পৌঁছালেও টাকা কাটা হয় একবার। লেসন ৩ এ।
                </ListItem>
                <ListItem>
                  <strong>Live আসনের তালিকা:</strong> কেউ একটা আসন বুক করলেই সেই নৌকার
                  পাতা যাঁরা খুলে রেখেছেন, তাঁদের পর্দায় আসনটা সাথে সাথে বিক্রিত দেখায়।
                  এর জন্য Browser আর Server এর মাঝে একটা খোলা লাইন থাকে, যেটা চুপ থাকলেও
                  মাঝের Proxy কেটে দেয় না। লেসন ১০ এ।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আপনার নিজের my-tours এ এই মডিউল চলাকালীন আপনি নিজে হাতে যা যা করবেন,
                সেটা এরকম।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  কোনো Browser বা Library ছাড়া, শুধু Terminal এ লেখা টাইপ করে, একটা
                  Server এর সাথে কথা বলবেন। তারপর Node.js এ নিজের একটা ছোট Server
                  লিখবেন, যা কোন Port এ বসবে তা Environment Variable থেকে পড়ে, আর না
                  পেলে পরিষ্কার একটা বার্তা দিয়ে থেমে যায়।
                </ListItem>
                <ListItem>
                  my-tours এর API এর পুরো নকশা কাগজে করবেন, কোন কাজের কোন ঠিকানা, কোন
                  শব্দ, আর সফল ও ব্যর্থ হলে কোন সংখ্যা।
                </ListItem>
                <ListItem>
                  নিজের Frontend আর Backend এর মাঝে CORS এর লাল লেখাটা ইচ্ছা করে ঘটাবেন,
                  তারপর ঠিক যতটুকু অনুমতি দরকার ততটুকু দিয়ে সারাবেন।
                </ListItem>
                <ListItem>
                  একবার Server এর খাতায় আর একবার সই করা কাগজে, দুই পথেই Login বানাবেন,
                  আর সই করা কাগজটায় একটা অক্ষর বদলে দেখবেন Server কীভাবে ধরে ফেলে।
                </ListItem>
                <ListItem>
                  নিজের যন্ত্রের জন্য একটা পরিচয়পত্র বানিয়ে HTTPS এ Server চালাবেন,
                  Browser এর সতর্কবার্তা দেখবেন আর বুঝবেন কেন আসে।
                </ListItem>
                <ListItem>
                  একটা সত্যিকারের সাইটে একটা Request এর সময় ধাপে ধাপে ভাগ করে মাপবেন, আর
                  নিজের Server এ খালি আসনের একটা Live তালিকা বানাবেন।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                এগুলোর কোনোটাই বড় কাজ নয়, বেশিরভাগ কয়েক মিনিটের। কিন্তু এই ছোট
                পরীক্ষাগুলোই পরের মডিউলে নিজের Server এ নামার পর আপনার হাত চালু রাখবে।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "before-and-after",
      subHeader: { index: "007", title: "Before and After" },
      title: <SectionTitle>এই মডিউল আপনাকে কোথা থেকে কোথায় নিয়ে যাবে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.CUSTOM,
          component: (
            <BeforeAfterSplit
              before={[
                "Address Bar এর লাইনটা একটা লম্বা লেখা, তার ভাগগুলো চেনেন না",
                "fetch কাজ না করলে কোথায় তাকাবেন জানেন না",
                "সব ব্যর্থতাই আপনার কাছে শুধু Error, 401 আর 403 একই কথা",
                "CORS এর লাল লেখা এলে Internet থেকে Setting নকল করেন",
                "Cookie আর Login কীভাবে জোড়া লাগে তা নিয়ে কখনো ভাবেননি",
                "HTTPS মানে শুধু Address Bar এ একটা তালার চিহ্ন",
                "Real-time কিছু লাগলেই প্রতি সেকেন্ডে Refresh এর কথা ভাবেন",
              ]}
              after={[
                "একটা URL দেখেই বলতে পারেন কোন অংশ কোথায় যায় আর কোনটা Server পায় না",
                "Network Tab এ Request আর Response পড়ে সমস্যার লাইনটা খুঁজে নিতে পারেন",
                "নিজের API তে প্রতিটা পরিস্থিতির জন্য যুক্তি দিয়ে ঠিক Status Code বাছেন",
                "CORS এর লাল লেখা পড়ে বুঝে ঠিক যতটুকু অনুমতি দরকার ততটুকু দেন",
                "Cookie এর প্রতিটা শর্ত কোন আক্রমণ ঠেকায় তা বলতে পারেন, আর Session বা JWT বুঝে বাছেন",
                "HTTPS এর তালা কীভাবে লাগে, পরিচয়পত্র কীভাবে যাচাই হয়, অন্যকে এঁকে বোঝাতে পারেন",
                "Live কাজের জন্য চারটা উপায়ের মধ্যে যুক্তি দিয়ে একটা বাছতে পারেন",
              ]}
              footer="বাঁ দিকের তালিকায় নিজেকে পেলে লজ্জার কিছু নেই, অনেক বছর কাজ করা Developer ও এর অর্ধেক জায়গায় দাঁড়িয়ে থাকেন, কারণ Framework এই সব কিছু এত সুন্দর করে লুকিয়ে রাখে। ডান দিকের তালিকাটা মডিউল শেষে নিজেকে যাচাই করার জন্য রেখে দিন। যে লাইনটা তখনও পারছেন না মনে হবে, সেটার লেসনটা আরেকবার পড়ুন।"
            />
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এই মডিউলে আপনার লক্ষ্য শব্দ চেনা নয়, অন্যকে বোঝাতে পারা। মান যাচাইয়ের
                একটা সহজ উপায় আছে। মডিউল শেষে এমন কাউকে বসান যিনি এসব জানেন না, আর
                একটা সাদা কাগজে এঁকে তাঁকে বোঝান, পর্যটক Address Bar এ Island Tours এর
                ঠিকানা লিখে Enter চাপার পর থেকে Saint Martin এর পাতা পর্দায় আসা পর্যন্ত
                কী কী ঘটে। কোথায় তালা লাগে, Browser কী লিখে পাঠায়, Server কী লিখে ফেরত
                দেয়, Server তাঁকে চেনে কীভাবে, আর পাতার ছবিগুলো পরের বার কেন আরও দ্রুত
                আসে।
              </ContentParagraph>
              <ContentParagraph>
                তিনি যদি মাঝপথে একটা কেন জিজ্ঞেস করেন আর আপনি উত্তর দিতে পারেন,
                তাহলে আপনি সত্যিই শিখেছেন। যেখানে আটকে যাবেন, সেটাই ফাঁক, আর সেই
                ফাঁক কোন লেসনে ভরবে তা উপরের Roadmap দেখে বের করে নিতে পারবেন।
                প্রতিটা লেসনের Assignment এর শেষ কাজটা এই কারণেই নিজের ভাষায় লিখে
                বোঝানোর।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "how-to-study",
      subHeader: { index: "008", title: "How to Study" },
      title: <SectionTitle>এই মডিউল কীভাবে পড়লে সবচেয়ে বেশি পাবেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                <strong>আগে যা জানা থাকা দরকার।</strong> এই মডিউল আগের মডিউলগুলোর
                উপর দাঁড়িয়ে, বিশেষ করে Module 05 এর উপর। চারটা জিনিস ঝাপসা থাকলে আগে
                একবার চোখ বুলিয়ে নিন। Module 05 এর TCP Deep Dive, যেখানে দেখেছেন TCP
                বার্তা চেনে না, চেনে শুধু Byte এর ধারা। একই মডিউলের Port & Socket আর
                Connection Close, কারণ Connection খোলা রাখা আর হঠাৎ কাটা পড়া এখানে
                বারবার আসবে। Module 04 এর DNS Records আর Domain Setup Guide, কারণ
                HTTPS এর পরিচয়পত্র একটা Domain এর নামেই হয়। আর Module 02 এর End to End
                Request Journey। এগুলো নতুন করে পড়ানো হবে না, শুধু নাম ধরে মনে করিয়ে
                দেওয়া হবে।
              </ContentParagraph>
              <ContentParagraph>
                <strong>কত সময় লাগবে।</strong> পুরো মডিউলের জন্য এক সপ্তাহ ধরুন।
                লেসনগুলোর গায়ে লেখা পড়ার সময় ১৫ থেকে ৬০ মিনিটের মধ্যে, কিন্তু সেটা
                শুধু পড়ার। Lab আর Assignment সহ প্রতিটা লেসনে এক থেকে দুই ঘণ্টা ধরলে
                বাস্তবসম্মত হবে। Session vs JWT, HTTPS TLS SSL, Certificates আর Full
                HTTPS Journey সবচেয়ে ভারী, এই চারটার জন্য বাড়তি সময় রাখুন, পারলে
                একদিনে একটার বেশি নয়।
              </ContentParagraph>
              <ContentParagraph>
                <strong>ক্রম ভাঙবেন না।</strong> প্রথম চার লেসন ভাষাটা নিজে, সেগুলো
                ছাড়া Cookie এর লেসনের প্রতিটা লাইন অচেনা লাগবে, কারণ Cookie আসলে একটা
                Header। লেসন ৫ এর আগে লেসন ৬ পড়লে Session এর চাবি কোথায় থাকে সেটাই
                ধরতে পারবেন না। লেসন ৭ এর তালার গল্প না জেনে লেসন ৮ এর পরিচয়পত্র
                শুধু কিছু ফাইলের নাম। আর লেসন ৯ এর পুরো যাত্রাটা তখনই কাজে লাগে যখন
                আগের আটটা পড়া আছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Developer Tools খোলা রেখে পড়ুন:</strong> Browser এ F12
                  চাপলে বা ডান Click করে Inspect বাছলে Developer Tools খোলে। তার
                  Network Tab টা পুরো মডিউলে খোলা রাখুন। যেকোনো সাইট খুলে লেসনে পড়া
                  জিনিসটা নিজের চোখে খুঁজুন। পড়া আর দেখা মিললে মনে থাকে।
                </ListItem>
                <ListItem>
                  <strong>Terminal ও খোলা রাখুন:</strong> প্রতিটা লেসনে আসল Command
                  আর তার আসল Output দেওয়া আছে, বেশিরভাগ <code>curl</code>,{" "}
                  <code>openssl</code> আর ছোট Node.js Script। নিজে চালান, নিজের
                  ফলাফল লেসনের সাথে মিলিয়ে দেখুন। সময়, তারিখ আর কিছু সংখ্যা আলাদা
                  হবে, সেটাই স্বাভাবিক, আকারটা মিললেই হলো।
                </ListItem>
                <ListItem>
                  <strong>Interactive অংশগুলো এড়িয়ে যাবেন না:</strong> প্রতিটা
                  লেসনে কয়েকটা জায়গা আছে যেখানে আপনি নিজে বোতাম চেপে কিছু বদলাতে বা ধাপে
                  ধাপে এগোতে পারেন। সেখানে আগে নিজে অনুমান করুন কী হবে, তারপর চাপুন।
                  অনুমান ভুল হলে সেটাই সবচেয়ে ভালো শেখা।
                </ListItem>
                <ListItem>
                  <strong>Quiz এ ভুল উত্তরের ব্যাখ্যাও পড়ুন:</strong> প্রতিটা
                  প্রশ্নের প্রতিটা Option এর নিচে লেখা আছে কেন ঠিক বা কেন ভুল। ভুল
                  Option গুলো ইচ্ছা করে সেই ভুল ধারণা থেকে বানানো, যা মানুষ সত্যিই
                  করে।
                </ListItem>
                <ListItem>
                  <strong>কিছু জিনিস আপনার যন্ত্রে নাও চলতে পারে:</strong> সব curl
                  এ HTTP এর সবচেয়ে নতুন Version চালানোর ক্ষমতা থাকে না, আর Caddy বা
                  Nginx এর Config গুলো আসল Server ছাড়া চালিয়ে দেখা যায় না। এগুলো লেসনে
                  নমুনা হিসেবে চিহ্নিত করা আছে। নমুনাটা পড়ে এগিয়ে যান, পরের মডিউলে নিজের
                  Server পেলে চালিয়ে দেখবেন।
                </ListItem>
                <ListItem>
                  <strong>গোপন জিনিস কখনো Command এ লিখবেন না:</strong> Login এর
                  লেসনগুলোতে একটা গোপন চাবি লাগবে। লেসনগুলো দেখাবে সেটা কীভাবে
                  Environment Variable এ রাখতে হয়, যাতে Terminal এর ইতিহাসে বা Code
                  এ কখনো না থাকে। প্রথম দিন থেকেই এই অভ্যাসটা নিন।
                </ListItem>
                <ListItem>
                  <strong>আটকে গেলে:</strong> আগে সেই লেসনের শেষের Recap আর Summary
                  ছকটা পড়ুন, প্রায়ই সেখানেই জট খোলে। তাতেও না হলে নিজেকে সেই দুইটা
                  প্রশ্ন করুন, Browser কী পাঠাল আর Server কী ফেরত দিল, আর Network Tab এ
                  গিয়ে দুইটাই চোখে দেখুন। এই মডিউলে প্রায় সব বিভ্রান্তির মূল একটাই,
                  অনুমান করা যে কী গেছে, দেখে না নিয়ে।
                </ListItem>
                <ListItem>
                  <strong>একটা খাতা রাখুন:</strong> প্রতিটা নতুন Status Code, Header
                  আর Browser এর সতর্কবার্তার পাশে এক লাইনে মানে লিখুন, আর পাশে লিখুন
                  কোথায় তাকিয়ে বা কোন Command দিয়ে সেটা যাচাই করা যায়। মডিউল শেষে এই
                  এক পাতাই আপনার সবচেয়ে কাজের নোট হবে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                মানচিত্র দেখা শেষ। এবার প্রথম লেসন খুলুন, <strong>URL vs URI</strong>।
                সেখানে শুরু হবে Address Bar এর সেই লাইনটা দিয়ে, যেটা আপনি আজও কয়েকশবার
                দেখেছেন, কিন্তু হয়তো একবারও ভেঙে পড়েননি।
              </ContentParagraph>
            </div>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["লেসন", "এক লাইনে যা নিয়ে ফিরবেন"],
    rows: [
      [
        "URL vs URI",
        "একটা ঠিকানার প্রতিটা ভাগ, কোন ভাগ Server পায় আর কোনটা পায় না, আর Origin নামের চাবি",
      ],
      [
        "HTTP Protocol Basics",
        "TCP এর Byte এর উপর লেখা Request আর Response, Server কেন কিছু মনে রাখে না, আর তিন Version এর গল্প",
      ],
      [
        "HTTP Methods & Status Codes",
        "কাজের শব্দ আর তাদের প্রতিশ্রুতি, উত্তরের সংখ্যার আসল মানে, আর কোন Request আবার পাঠানো নিরাপদ",
      ],
      [
        "HTTP Headers",
        "Request আর Response এর গায়ের নির্দেশ, কী কতক্ষণ মনে রাখা যাবে, আর CORS কেন আর কীভাবে",
      ],
      [
        "Cookies",
        "সব ভুলে যাওয়া Server আপনাকে চেনে কীভাবে, আর প্রতিটা শর্ত কোন আক্রমণ ঠেকায়",
      ],
      [
        "Session vs JWT",
        "Login এর পরিচয় Server এর খাতায় নাকি সই করা কাগজে, আর দুইটার আসল দাম",
      ],
      [
        "HTTPS, TLS, and SSL",
        "খোলা রাস্তায় গোপন চাবিতে একমত হওয়া, আর HTTPS কী লুকায় ও কী লুকায় না",
      ],
      [
        "Certificates, Public Key, and Private Key",
        "ওপাশে আসল সাইটই আছে তার প্রমাণ, বিশ্বাসের শিকল, আর মেয়াদ শেষের আগে নবীকরণ",
      ],
      [
        "Full HTTPS Journey",
        "Enter থেকে পাতা পর্যন্ত প্রতিটা ধাপ ক্রমে, প্রতিটার সময়, আর আটকালে কোথায় খুঁজবেন",
      ],
      [
        "WebSocket & Real-time Communication",
        "Server নিজে থেকে কথা বলার চার উপায়, খোলা লাইন বাঁচিয়ে রাখা, আর কোন কাজে কোনটা",
      ],
    ],
  },
};
