/* eslint-disable react/jsx-key */
import {
  ContentList,
  ContentParagraph,
  ListItem,
  SectionTitle,
} from "../../../components/course/content-components";
import { IslandToursBrief } from "../../../components/course/topics/island-tours/project-brief";
import {
  SetupScenarioLab,
  WherePasteLab,
} from "../../../components/course/topics/dns/setup-animations";
import {
  FourAsksDiagram,
  TranslateRecordDiagram,
  TwoHandoffsDiagram,
} from "../../../components/course/topics/dns/setup-diagrams";
import {
  CONTENT_TYPES,
  INFO_BOX_VARIANTS,
  TopicData,
} from "../../../types/content";

export const domainSetupGuideContent: TopicData = {
  id: "domain-setup-guide",
  introduction: {
    badge: "MODULE 04 · LESSON 10",
    title: <SectionTitle>কোন মান কোথা থেকে আসে, কোথায় বসে</SectionTitle>,
    description: (
      <div className="space-y-4">
        <ContentParagraph>
          আপনি একটা Domain কিনলেন। এখন সেটাকে একটা সাইটের সাথে জুড়তে হবে। একটা
          নির্দেশিকা বলছে Name Server বদলান। আরেকটা বলছে একটা A Record বসান। তৃতীয়টা
          বলছে CNAME। ইমেইল সেবা চাইছে MX আর তিনটা TXT। আর প্রতিটা জায়গায় একটাই
          প্রশ্ন মাথায় ঘোরে, এই মানগুলো আমি পাব কোথায়? কে দেবে? আর পেলে কোন পাতায়
          গিয়ে বসাব?
        </ContentParagraph>
        <ContentParagraph>
          আগের নয় লেসনে প্রতিটা টুকরো আলাদা করে শিখেছেন। Name Server কী জানেন,
          প্রতিটা Record কী করে জানেন। কিন্তু বাস্তবে কাজ করতে বসলে বিভ্রান্তিটা
          ধারণায় থাকে না, থাকে হাতবদলে। কোন তথ্য কার কাছ থেকে নিয়ে কার কাছে দিতে
          হবে। এই লেসনের পুরোটা সেই একটা বিষয় নিয়ে।
        </ContentParagraph>
        <ContentParagraph>
          শেষে আপনি যেকোনো সেবার Domain জোড়ার পাতা খুলে বুঝবেন সে কী চাইছে আর কেন,
          তার দেওয়া মান নিজের DNS পাতার ঠিক ঘরে বসাতে পারবেন, আটটা সবচেয়ে চেনা
          পরিস্থিতি শুরু থেকে শেষ পর্যন্ত করতে পারবেন, আর আরেকজনকে পুরো বিষয়টা
          বুঝিয়ে দিতে পারবেন।
        </ContentParagraph>
      </div>
    ),
    quote: {
      text: "Domain Setup এ আপনি একজন ডাকপিয়ন। এক বাড়ি থেকে চিঠি নিয়ে আরেক বাড়িতে দেন। চিঠিতে কী লেখা তা আপনি ঠিক করেন না, আপনার কাজ শুধু সঠিক চিঠি সঠিক বাড়িতে পৌঁছানো।",
      author: "DNS",
      role: "Lesson 10",
    },
  },
  sections: [
    /* ---------------------------------------------------------------- 1 */
    {
      id: "two-handoffs",
      subHeader: { index: "001", title: "The Core Idea" },
      title: <SectionTitle>পুরো ব্যাপারটা আসলে দুইটা হাতবদল</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Domain Setup এ তিনটা পক্ষ থাকে। আপনার Registrar, যেখানে Domain
                কিনেছেন। আপনার DNS সেবা, যেখানে Record গুলো থাকে। আর যে সেবায় আপনি
                Domain টা জুড়তে চান, সেটা Hosting হতে পারে, ইমেইল সেবা হতে পারে,
                বা অন্য যেকোনো App।
              </ContentParagraph>
              <ContentParagraph>
                এই তিনজনের মধ্যে তথ্য চলে শুধু দুই পথে, আর দুই পথেই বাহক আপনি।
                এই ছবিটা এই লেসনের সবচেয়ে জরুরি ছবি। বাকি সব কিছু এরই বিস্তার।
              </ContentParagraph>
            </div>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TwoHandoffsDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>হাতবদল ১, সেবা থেকে DNS এ:</strong> যে সেবায় জুড়ছেন সে
                আপনাকে Record এর মান দেয়। আপনি সেগুলো কপি করে নিজের DNS সেবার
                পাতায় বসান।
              </ListItem>
              <ListItem>
                <strong>হাতবদল ২, DNS থেকে Registrar এ:</strong> আপনার DNS সেবা
                আপনাকে Name Server এর নাম দেয়। আপনি সেগুলো কপি করে Registrar এর
                পাতায় বসান। এটা একবারই করতে হয়, যখন DNS সেবা ঠিক করেন বা বদলান।
              </ListItem>
              <ListItem>
                <strong>উল্টো দিকে একটা ছোট তথ্য যায়:</strong> সেবাকে আপনি শুধু
                একটা জিনিস বলেন, আপনার Domain এর নাম। সেটা লিখতে হয় সেবার নিজের
                পাতায়, Add Domain ঘরে।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "বিভ্রান্তি হলে একটাই প্রশ্ন: এই তথ্যটা কার সম্পত্তি",
          content: (
            <p>
              কোনো মান কোথা থেকে আসবে বুঝতে না পারলে নিজেকে জিজ্ঞেস করুন, এই
              তথ্যটা কার। Name Server এর নাম সেই কোম্পানির, যার DNS server। তাই
              সেটা তারাই দেবে। একটা IP সেই কোম্পানির, যার সার্ভার। তাই সেটা Hosting
              দেবে। একটা যাচাইয়ের লেখা সেই সেবার বানানো, যে যাচাই করতে চায়। তাই
              সেটা সে দেবে। আপনার নিজের সম্পত্তি শুধু একটাই, Domain এর নামটা।
              বাকি সব কিছু আপনি অন্যের কাছ থেকে নিয়ে আসেন।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 2 */
    {
      id: "nameservers",
      subHeader: { index: "002", title: "Name Servers" },
      title: <SectionTitle>Name Server পাব কোথায়, বসাব কোথায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রথমে দ্বিতীয় হাতবদলটা পরিষ্কার করি, কারণ এটা সবার আগে করতে হয়
                আর এখানেই প্রথম হোঁচট। Name Server নিয়ে তিনটা প্রশ্নের উত্তর জানা
                থাকলে আর কোনো ধাঁধা থাকে না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>কে দেয়:</strong> যে কোম্পানি আপনার DNS চালাবে। আপনি
                  তাদের পাতায় গিয়ে নিজের Domain যোগ করেন (Cloudflare এ Onboard a
                  domain, অন্য জায়গায় Add site বা Add zone)। যোগ করার সাথে সাথে
                  তারা আপনার জন্য দুইটা (কখনো চারটা) Name Server এর নাম দেখায়।
                </ListItem>
                <ListItem>
                  <strong>দেখতে কেমন:</strong> এগুলো সাধারণ নাম, IP নয়। যেমন
                  ada.ns.cloudflare.com, ns1.vercel-dns.com, বা
                  ns-123.awsdns-45.com। কিছু সেবায় প্রতিটা গ্রাহক আলাদা জোড়া পায়,
                  তাই বন্ধুর নাম দেখে বসাবেন না, নিজের পাতায় যা দেখায় সেটাই নিন।
                </ListItem>
                <ListItem>
                  <strong>বসে কোথায়:</strong> শুধু Registrar এ। Domain এর পাতা খুলে
                  Nameservers অংশে যান, Custom বা Use custom nameservers বেছে নিন,
                  পুরনো নাম মুছে নতুনগুলো বসান।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                আর একটা কথা, যেটা অনেকেই জানেন না। Domain কেনার মুহূর্তেই তাতে
                Name Server বসানো থাকে, Registrar এর নিজের। প্রায় প্রতিটা Registrar
                বিনা খরচে একটা সাধারণ DNS সেবা দেয়, আর নতুন Domain সেটাই ব্যবহার
                করে। তাই Name Server বদলানো বাধ্যতামূলক নয়। Registrar এর DNS পাতাতেই
                Record বসিয়ে কাজ চালানো যায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                তাহলে কখন বদলাবেন আর কখন নয়? এই সিদ্ধান্তটা একবার নিলেই চলে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Registrar এর DNS এই থাকুন, যদি:</strong> শুধু একটা সাইট
                  আর ইমেইল চালাতে চান, আর Registrar এর DNS পাতায় আপনার দরকারি সব
                  ধরনের Record বসানো যায়। সবচেয়ে কম ঝামেলা, এক জায়গায় সব।
                </ListItem>
                <ListItem>
                  <strong>Cloudflare এর মতো আলাদা DNS সেবায় যান, যদি:</strong>{" "}
                  দ্রুত আর নির্ভরযোগ্য DNS চান, Proxy আর আক্রমণ ঠেকানোর সুবিধা
                  চান, অথবা Registrar এর পাতা ধীর বা সীমিত। বাস্তবে বেশিরভাগ দল
                  এটাই করে।
                </ListItem>
                <ListItem>
                  <strong>Hosting এর Name Server বসান, যদি:</strong> Hosting এমন
                  কিছু দেয় যা শুধু তাদের DNS এই সম্ভব (যেমন Wildcard এর
                  স্বয়ংক্রিয় সার্টিফিকেট, পরের লেসনে দেখবেন), আর এই Domain এ
                  অন্য কিছু চালানোর পরিকল্পনা নেই। মনে রাখুন, তখন ইমেইলের Record ও
                  Hosting এর পাতায় বসাতে হবে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Name Server বদলালে পুরনো জায়গার সব Record অদৃশ্য হয়ে যায়",
          content: (
            <p>
              Name Server বদলানোর মুহূর্ত থেকে পৃথিবী আপনার পুরনো DNS পাতাকে আর
              জিজ্ঞেস করে না। সেখানে যত Record ছিল, সাইট, ইমেইল, যাচাই, সব কার্যত
              নেই হয়ে যায়, যতক্ষণ না নতুন জায়গায় আবার বসান। নতুন DNS সেবা নিজে
              থেকে পুরনো Record গুলো আনার চেষ্টা করে, কিন্তু সব পায় না। তাই বদলের
              আগে পুরনো পাতার প্রতিটা সারি টুকে রাখুন, আর নতুন পাতায় মিলিয়ে বসিয়ে
              তবেই Name Server বদলান। Cloudflare এর লেসনে পুরো ধাপগুলো আছে।
            </p>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "where-is-my-dns.sh",
          code: `# এই মুহূর্তে আমার DNS কোথায় চলছে? Record বসাতে হবে সেখানেই।
dig +short NS islandtours.example

# উত্তর পড়ার নিয়ম:
#   xxx.ns.cloudflare.com        ->  DNS Cloudflare এ, Record বসবে Cloudflare এর পাতায়
#   ns1.vercel-dns.com           ->  DNS Vercel এ
#   dns1.registrar-servers.com   ->  DNS Namecheap (Registrar) এর নিজের পাতায়
#   ns01.domaincontrol.com       ->  DNS GoDaddy (Registrar) এর নিজের পাতায়
#   ns-123.awsdns-45.com         ->  DNS AWS Route 53 এ

# Registrar এ যা লেখা (TLD এর কাছে যা পৌঁছেছে)
whois islandtours.example | grep -i "name server"`,
        },
      ],
    },
    /* ---------------------------------------------------------------- 3 */
    {
      id: "what-apps-ask",
      subHeader: { index: "003", title: "What Apps Ask For" },
      title: <SectionTitle>সেবাগুলো আপনার কাছে কী চায়, আর কেন</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার প্রথম হাতবদল, যেটা বারবার করতে হয়। প্রতিটা সেবার Domain জোড়ার
              পাতা দেখতে আলাদা, কিন্তু তারা যা চায় তা সবসময় চার রকমের মধ্যে পড়ে।
              এই চারটা চিনে রাখলে নতুন কোনো সেবাই আর অচেনা লাগবে না।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <FourAsksDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                এবার সেই প্রশ্ন, যেটা সবচেয়ে বেশি ভাবায়। সেবাটা এই মানগুলো পায়
                কোথা থেকে? সে কীভাবে জানে আমাকে কোন IP বা কোন নাম দিতে হবে? উত্তরটা
                প্রতিটা ধরনের জন্য আলাদা, আর প্রতিটাই সরল।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>IP (A Record এর জন্য):</strong> এটা সেবার নিজের সার্ভারের
                  বা Load Balancer এর ঠিকানা। সার্ভারগুলো তাদের, তাই ঠিকানাও তারা
                  জানে। বড় Hosting গুলো সব গ্রাহককে একই এক বা কয়েকটা IP দেয়।
                </ListItem>
                <ListItem>
                  <strong>CNAME এর লক্ষ্য:</strong> এটা সেবার নিজের Domain এর একটা
                  নাম, যেটা তারা নিজেরা বানিয়ে নিজেদের DNS এ বসিয়ে রেখেছে। আপনার
                  নাম সেই নামের ডাকনাম হয়। তারা পরে নিজেদের IP বদলালে শুধু নিজেদের
                  Record বদলায়, আপনাকে কিছু করতে হয় না। এই কারণেই সেবাগুলো IP র
                  চেয়ে CNAME দিতে বেশি পছন্দ করে।
                </ListItem>
                <ListItem>
                  <strong>যাচাইয়ের লেখা (TXT):</strong> এটা সেবার Backend
                  এলোমেলোভাবে বানায়, ঠিক যে মুহূর্তে আপনি Domain যোগ করেন, আর নিজের
                  Database এ আপনার Account এর পাশে লিখে রাখে। পরে সে DNS এ একই
                  লেখা খুঁজে মিলিয়ে নেয়।
                </ListItem>
                <ListItem>
                  <strong>MX এর নাম:</strong> ইমেইল সেবার নিজের ইমেইল সার্ভারের
                  নাম। সব গ্রাহকের জন্য একই।
                </ListItem>
                <ListItem>
                  <strong>DKIM এর চাবি:</strong> সেবা আপনার Domain এর জন্য একজোড়া
                  চাবি বানায়। গোপন অংশটা নিজের কাছে রাখে সই করার জন্য, আর প্রকাশ্য
                  অংশটা আপনাকে দেয় DNS এ বসাতে। তাই এটা প্রতিটা গ্রাহকের আলাদা।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "সেবাকে নিজের Domain এর নাম বলতে হয় কেন",
          content: (
            <p>
              একটা স্বাভাবিক প্রশ্ন, DNS এ A Record বসিয়ে দিলেই তো মানুষ সেবার
              সার্ভারে পৌঁছে যাবে, তাহলে সেবার পাতায় আবার Domain যোগ করতে হয় কেন?
              কারণ সেবার একটা IP র পেছনে হাজার হাজার গ্রাহকের সাইট থাকে। একটা
              Request এলে সার্ভার দেখে Browser কোন নাম চেয়েছে, আর নিজের তালিকায়
              খোঁজে এই নাম কোন গ্রাহকের কোন সাইটের। আপনি Domain যোগ না করলে নামটা
              সেই তালিকায় নেই, তাই সার্ভার জানে না কী দেখাতে হবে, আর একটা ভুলের
              পাতা দেখায়। আর দ্বিতীয় কারণ, HTTPS এর সার্টিফিকেট নাম ধরে বানাতে হয়,
              সেবাকে জানতে হয় কোন নামের জন্য বানাবে। তাই কাজ সবসময় দুই জায়গায়,
              সেবার পাতায় নামটা যোগ করা, আর DNS এ Record বসানো।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 4 */
    {
      id: "scenarios",
      subHeader: { index: "004", title: "Six Destinations" },
      title: <SectionTitle>ছয় রকম জায়গা, একই গল্প</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              নিচের Lab এ ছয় রকম জায়গা আছে, যেখানে মানুষ সবচেয়ে বেশি Domain জোড়ে।
              প্রতিটায় দেখুন মানগুলো কোন পাতায় পাওয়া যায়, দেখতে কেমন, আসলে কার, আর
              কে যাচাই করে। তারপর লেসনের বাকি অংশে এগুলোর প্রতিটা ধাপে ধাপে করবেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <SetupScenarioLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 5 */
    {
      id: "translate",
      subHeader: { index: "005", title: "Entering Records" },
      title: <SectionTitle>সেবার ছক নিজের DNS পাতায় বসানো</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              সেবা আপনাকে একটা ছক দিল। এখন সেটা নিজের DNS পাতার ফর্মে বসাতে হবে।
              দুই জায়গার ঘরের নাম প্রায়ই মেলে না, আর এখানেই ছোট ছোট ভুল হয়।
              নিচের ছবিতে মিলটা দেখুন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <TranslateRecordDiagram /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>সেবা Name এ পুরো নাম দেখালে:</strong> কিছু সেবা Name এর
                ঘরে www.islandtours.example বা _dmarc.islandtours.example এর মতো
                পুরো নাম দেখায়। বেশিরভাগ DNS পাতায় আপনাকে শুধু সামনের অংশ (www বা
                _dmarc) বসাতে হবে। Save এর পর তালিকায় পুরো নামটা পড়ে মিলিয়ে নিন।
              </ListItem>
              <ListItem>
                <strong>সেবা Name এ @ বা ফাঁকা দেখালে:</strong> মানে মূল নাম।
                নিজের DNS পাতায় @ বসান। কিছু পাতায় ঘরটা ফাঁকা রাখতে হয়, কিছুতে
                পুরো Domain লিখতে হয়।
              </ListItem>
              <ListItem>
                <strong>MX এর Priority:</strong> সেবা লিখবে 1 smtp.google.com বা
                Priority 1। অনেক DNS পাতায় Priority র আলাদা ঘর থাকে, তখন সংখ্যা
                আর নাম দুই ঘরে আলাদা বসান।
              </ListItem>
              <ListItem>
                <strong>TXT এর উদ্ধৃতি চিহ্ন:</strong> সেবা লেখাটা উদ্ধৃতি চিহ্নের
                ভেতরে দেখালে, বেশিরভাগ DNS পাতায় চিহ্ন ছাড়াই বসাতে হয়, পাতা নিজে
                জুড়ে নেয়। Save এর পর দুই জোড়া চিহ্ন দেখালে একটা বাড়তি হয়েছে।
              </ListItem>
              <ListItem>
                <strong>শেষের ফোঁটা:</strong> সেবা cname.hosting.example. এভাবে
                শেষে ফোঁটা সহ দেখাতে পারে। সেটা একই নাম। আধুনিক পাতায় ফোঁটা সহ বা
                ছাড়া দুইভাবেই চলে।
              </ListItem>
              <ListItem>
                <strong>TTL:</strong> সেবা কিছু না বললে Auto বা ৩০০। জোড়ার সময়
                ছোট রাখুন, ভুল হলে দ্রুত শোধরানো যায়।
              </ListItem>
              <ListItem>
                <strong>Cloudflare এ Proxy status:</strong> অন্য সেবার দেওয়া
                Record প্রথমে সবসময় DNS only রাখুন। সেবা নিজে যাচাই শেষ করার পর,
                আর শুধু তাদের নির্দেশিকা অনুমতি দিলে, তবে Proxied করার কথা ভাবুন।
              </ListItem>
            </ContentList>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "বসানোর আগে একই নামের পুরনো Record সরান",
          content: (
            <p>
              নতুন Domain এ Registrar প্রায়ই নিজে থেকে কিছু Record বসিয়ে রাখে,
              যেমন মূল নামে একটা A Record যেটা তাদের বিজ্ঞাপনের পাতায় দেখায়, আর
              www এ একটা CNAME। সেবার দেওয়া Record বসানোর আগে দেখুন একই Name আর
              একই Type এ আগে থেকে কিছু আছে কি না। থাকলে সেটা মুছুন বা বদলে দিন।
              নাহলে একই নামে দুইটা A থাকবে, আর অর্ধেক মানুষ বিজ্ঞাপনের পাতায় যাবে।
              বিশেষ করে একটা পুরনো AAAA Record খুঁজে দেখুন। সেবা AAAA না দিয়ে
              থাকলে পুরনোটা মুছতে হবে, নাহলে IPv6 ব্যবহারকারীরা ভুল জায়গায় যাবেন
              আর সেবার যাচাই ব্যর্থ হবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 6 */
    {
      id: "where-to-paste",
      subHeader: { index: "006", title: "Right Place" },
      title: <SectionTitle>নিজেকে পরীক্ষা করুন, কোনটা কোথায় বসে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এগোনোর আগে একটা ছোট পরীক্ষা। সাতটা মান একটা একটা করে আসবে, আপনি
              বলবেন কোনটা কোন পাতায় বসাতে হবে। সাতটাই ঠিক হলে এই লেসনের মূল
              বিভ্রান্তিটা আপনি পার করে ফেলেছেন।
            </ContentParagraph>
          ),
        },
        { type: CONTENT_TYPES.CUSTOM, component: <WherePasteLab /> },
      ],
    },
    /* ---------------------------------------------------------------- 7 */
    {
      id: "apex-www",
      subHeader: { index: "007", title: "Apex and www" },
      title: <SectionTitle>মূল নাম আর www, কেন দুইটা আলাদা Record</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রায় প্রতিটা Hosting আপনাকে দুইটা Record দেয়, মূল নামের জন্য একটা
                A, আর www এর জন্য একটা CNAME। কেন দুইটা দুই ধরনের? উত্তরটা Record
                এর লেসনের সেই নিয়মে, মূল নামে CNAME বসানো যায় না।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>www (আর যেকোনো উপনাম):</strong> এখানে CNAME চলে, তাই
                  Hosting তার পছন্দের জিনিসটাই দেয়, নিজের একটা নাম। এতে তারা পরে
                  স্বাধীনভাবে IP বদলাতে পারে।
                </ListItem>
                <ListItem>
                  <strong>মূল নাম (@):</strong> এখানে CNAME চলে না, তাই Hosting
                  বাধ্য হয়ে একটা IP দেয়, A Record হিসেবে। এই IP তারা সহজে বদলাতে
                  পারে না, কারণ লক্ষ লক্ষ গ্রাহকের DNS এ এটা লেখা।
                </ListItem>
                <ListItem>
                  <strong>যে Hosting মূল নামের জন্যও শুধু একটা নাম দেয়:</strong>{" "}
                  কিছু Hosting কোনো স্থির IP দেয় না। তখন তিনটা উপায়। আপনার DNS
                  সেবা CNAME Flattening বা ALIAS সমর্থন করলে (Cloudflare করে)
                  মূল নামে সেই নামটাই বসান। না করলে DNS সেবা বদলান। অথবা মূল
                  নামকে www তে Redirect করে দিন, আর আসল সাইট www তে রাখুন।
                </ListItem>
                <ListItem>
                  <strong>দুইটার একটাকে মূল করুন:</strong> Hosting এর পাতায় দুই
                  নামই যোগ করুন, আর একটাকে প্রধান করে অন্যটাকে তার দিকে Redirect
                  করুন। নাহলে একই সাইট দুই ঠিকানায় থাকে, যা Search Engine এর জন্য
                  খারাপ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 8 */
    {
      id: "walk-hosting",
      subHeader: { index: "008", title: "Walkthrough: Website" },
      title: <SectionTitle>হাতে কলমে ১, নতুন Domain থেকে চালু Website</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এবার সবচেয়ে চেনা পুরো কাজটা, শুরু থেকে শেষ পর্যন্ত। আপনি একটা
              Registrar থেকে islandtours.example কিনেছেন, DNS রাখবেন Cloudflare এ,
              আর সাইট বসানো একটা Managed Hosting এ। প্রতিটা ধাপে লেখা আছে আপনি কোন
              পাতায় আছেন, কারণ এই কাজে আপনি তিনটা আলাদা Website এর মধ্যে যাওয়া আসা
              করবেন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "[Cloudflare] Domain যোগ করুন, Name Server নিন",
              description:
                "Cloudflare এ ঢুকে Onboard a domain চাপুন, islandtours.example লিখুন, Free Plan বাছুন। সে যে Record খুঁজে পায় তা দেখাবে, নতুন Domain হলে প্রায় ফাঁকা। Continue চাপলে দুইটা Name Server এর নাম দেখাবে। দুইটাই কপি করুন। এটাই হাতবদল ২ এর প্রথম অর্ধেক।",
            },
            {
              title: "[Registrar] Name Server বসান",
              description:
                "Registrar এ ঢুকে Domain টা খুলুন। Nameservers অংশে Custom বাছুন, পুরনো নাম মুছে Cloudflare এর দুইটা বসিয়ে Save করুন। হাতবদল ২ শেষ। এখন থেকে Registrar এর পাতায় আর কোনো কাজ নেই, নবায়ন ছাড়া।",
            },
            {
              title: "[Terminal] অপেক্ষা আর যাচাই",
              description:
                "dig +short NS islandtours.example চালান। Cloudflare এর নাম দেখালে পরের ধাপে যান। Cloudflare এর পাতায়ও Domain এর অবস্থা Pending থেকে Active হবে। সাধারণত কয়েক মিনিট থেকে কয়েক ঘণ্টা।",
            },
            {
              title: "[Hosting] নিজের Domain যোগ করুন",
              description:
                "Hosting এ Project খুলে Settings, তারপর Domains এ যান। islandtours.example লিখে Add চাপুন। সে জিজ্ঞেস করতে পারে www ও যোগ করবেন কি না, হ্যাঁ বলুন। এখন সে দুইটা নামের পাশে Invalid Configuration দেখাবে, আর নিচে একটা ছক, কোন Record বসাতে হবে।",
            },
            {
              title: "[Hosting] ছকটা পড়ুন আর কপি করুন",
              description:
                "ছকে সাধারণত দুইটা সারি থাকে। মূল নামের জন্য Type A, Name @, আর একটা IP। www এর জন্য Type CNAME, Name www, আর Hosting এর একটা নাম। প্রতিটা মানের পাশের Copy বোতামে চেপে নিন। এটাই হাতবদল ১ এর প্রথম অর্ধেক।",
            },
            {
              title: "[Cloudflare] Record দুইটা বসান",
              description:
                "Cloudflare এ DNS, তারপর Records এ যান। আগে দেখুন @ বা www নামে পুরনো A, AAAA বা CNAME আছে কি না, থাকলে মুছুন। তারপর Add record দিয়ে দুইটা সারি বসান, হুবহু যেমন Hosting দেখিয়েছে। দুইটারই Proxy status আপাতত DNS only রাখুন। হাতবদল ১ শেষ।",
            },
            {
              title: "[Terminal] নিজে মিলিয়ে দেখুন",
              description:
                "dig +short A islandtours.example আর dig +short CNAME www.islandtours.example চালান। Hosting এর দেওয়া মান দুইটা ফেরত এলে DNS এর কাজ নিখুঁত।",
            },
            {
              title: "[Hosting] যাচাই আর সার্টিফিকেট",
              description:
                "Hosting এর Domains পাতায় ফিরে যান। সে নিজে কয়েক সেকেন্ড পরপর DNS দেখে, অথবা Refresh বোতাম চাপুন। Invalid Configuration বদলে Valid Configuration হবে, আর সে নিজে থেকে HTTPS সার্টিফিকেট বানানো শুরু করবে। এক দুই মিনিট পর https দিয়ে সাইট খুলুন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.TIP,
          title: "নিজের সার্ভার (VPS) হলে তফাত শুধু দুই জায়গায়",
          content: (
            <p>
              সাইট যদি Managed Hosting এ না হয়ে নিজের ভাড়া করা সার্ভারে হয়, তাহলে
              চার আর পাঁচ নম্বর ধাপ বদলে যায়। কেউ আপনাকে কোনো ছক দেয় না। আপনি
              সার্ভার কোম্পানির পাতায় সার্ভারের Public IP টা দেখে নিজেই A Record
              বানান, মূল নামে সেই IP, আর www তে মূল নামের দিকে একটা CNAME। আর আট
              নম্বর ধাপে কেউ আপনার হয়ে সার্টিফিকেট বানায় না। সার্ভারে ঢুকে Web
              server (Nginx বা Caddy) এর সেটিংয়ে নিজের Domain এর নাম বসাতে হয়, আর
              সার্টিফিকেট নিজে নিতে হয়। এই দুইটা কাজ সামনের মডিউলে বিস্তারিত আসবে।
            </p>
          ),
        },
      ],
    },
    /* ---------------------------------------------------------------- 9 */
    {
      id: "walk-ns-method",
      subHeader: { index: "009", title: "Walkthrough: Other Paths" },
      title: <SectionTitle>হাতে কলমে ২, একই কাজের আরও তিনটা পথ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                উপরের আট ধাপ সবচেয়ে চেনা পথ, কিন্তু একমাত্র নয়। একই গন্তব্যে আরও
                তিনভাবে পৌঁছানো যায়। কোনটা কখন, জেনে রাখুন।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথ ক, DNS Registrar এই রেখে:</strong> Cloudflare একেবারে
                  বাদ। প্রথম তিন ধাপ লাগে না। Hosting এর ছকটা নিয়ে সোজা Registrar
                  এর নিজের DNS পাতায় বসান (Namecheap এ Advanced DNS, GoDaddy তে
                  DNS Management)। সবচেয়ে কম ধাপ, নতুনদের জন্য ভালো শুরু।
                </ListItem>
                <ListItem>
                  <strong>পথ খ, Hosting এর Name Server দিয়ে:</strong> Hosting এর
                  Domains পাতায় Nameservers বা Use our DNS নামের একটা বিকল্প থাকে।
                  সেটা বাছলে সে দুইটা Name Server দেয়। সেগুলো Registrar এ বসান।
                  এরপর আপনাকে কোনো A বা CNAME বসাতেই হয় না, Hosting নিজেই নিজের
                  DNS এ সব বসিয়ে নেয়। সবচেয়ে কম কাজ, কিন্তু ইমেইলের মতো বাকি সব
                  Record এখন Hosting এর DNS পাতায় বসাতে হবে।
                </ListItem>
                <ListItem>
                  <strong>পথ গ, Hosting থেকেই Domain কিনে:</strong> কিছু Hosting
                  নিজেই Domain বিক্রি করে। সেখান থেকে কিনলে তারা একসাথে Registrar,
                  DNS সেবা আর Hosting, তিনটাই। দুইটা হাতবদলই তাদের ভেতরে ঘটে, তাই
                  আপনি কিছুই বসান না, সাইট নিজে থেকে চালু হয়ে যায়। এই কারণেই
                  অনেকের কাছে মনে হয় কোনো Setup লাগেই না। লেগেছে, শুধু আপনাকে
                  দেখানো হয়নি।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.CONCEPT,
          title: "এক চাপে জোড়ার বোতাম আসলে কী করে",
          content: (
            <p>
              কিছু Hosting এর পাতায় Record এর ছকের পাশে একটা বোতাম থাকে, যেমন
              Configure automatically বা Connect with Cloudflare। চাপলে সে আপনাকে
              আপনার DNS সেবায় Login করতে বলে আর অনুমতি চায়। অনুমতি দিলে সে নিজেই
              আপনার DNS পাতায় ঢুকে Record গুলো বসিয়ে দেয়। এতে কোনো জাদু নেই। একই
              দুইটা Record, একই জায়গায়, শুধু কপি আর বসানোর কাজটা আপনার বদলে একটা
              Program করল। ভেতরে কী ঘটে জানা থাকলে বোতামটা ব্যর্থ হলেও আপনি হাতে
              করে নিতে পারবেন।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 10 */
    {
      id: "walk-email",
      subHeader: { index: "010", title: "Walkthrough: Email" },
      title: <SectionTitle>হাতে কলমে ৩, একই Domain এ ইমেইল জোড়া</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Website চালু। এবার একই Domain এ ইমেইল। এখানে সবচেয়ে জরুরি কথাটা
                আগে, ইমেইলের জন্য Name Server ছুঁতে হয় না, Website এর Record ও
                ছুঁতে হয় না। আপনি শুধু একই DNS পাতায় আরও কয়েকটা সারি যোগ করেন।
                একটা Domain এ যত খুশি সেবা জোড়া যায়, প্রতিটা নিজের Record নিয়ে।
              </ContentParagraph>
              <ContentParagraph>
                ইমেইলে সাধারণত দুইটা আলাদা সেবা লাগে, আর দুইটা প্রায়ই গুলিয়ে যায়।
                একটা মানুষের ইমেইলের জন্য (যেমন Google Workspace), যেখানে আপনি আর
                আপনার দল ইমেইল পড়েন আর লেখেন। আরেকটা App এর ইমেইলের জন্য (যেমন
                Resend বা SendGrid), যেখান থেকে আপনার Backend বুকিং নিশ্চিতকরণ
                পাঠায়। দুইটা সেবা, দুইটা আলাদা ছক, একই DNS পাতা।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "[ইমেইল সেবা] Domain যোগ করুন, যাচাইয়ের লেখা নিন",
              description:
                "ইমেইল সেবার Admin পাতায় নিজের Domain লিখুন। সে একটা TXT Record এর মান দেখাবে, যেটা শুধু আপনার জন্য বানানো। কপি করুন।",
            },
            {
              title: "[DNS সেবা] TXT বসান, [ইমেইল সেবা] Verify চাপুন",
              description:
                "নিজের DNS পাতায় Type TXT, Name @, আর Value তে লেখাটা বসান। এক মিনিট পর ইমেইল সেবার পাতায় Verify চাপুন। সে DNS এ লেখাটা খুঁজে পেলে মেনে নেয় Domain আপনার।",
            },
            {
              title: "[ইমেইল সেবা] MX এর মান নিন, [DNS সেবা] বসান",
              description:
                "সেবা এবার MX দেখাবে, একটা বা কয়েকটা, Priority সহ। নিজের DNS পাতায় আগের সব MX মুছে এগুলো বসান, Name @। এখন থেকে আপনার Domain এ ইমেইল আসবে।",
            },
            {
              title: "[ইমেইল সেবা] SPF আর DKIM নিন, [DNS সেবা] বসান",
              description:
                "SPF একটা TXT, Name @। DKIM চালু করলে সেবা একটা অদ্ভুত Name (কিছু একটা._domainkey) আর একটা লম্বা Value দেবে। দুইটাই হুবহু বসান। আগে থেকে একটা SPF থাকলে নতুন বসাবেন না, পুরনোটার ভেতরে নতুন include যোগ করুন।",
            },
            {
              title: "[App এর ইমেইল সেবা] আলাদা করে একই কাজ",
              description:
                "App থেকে ইমেইল পাঠানোর সেবায় আলাদা করে Domain যোগ করুন। সে নিজের একটা ছক দেবে, সাধারণত একটা DKIM আর একটা উপনামে (যেমন send) SPF আর MX। এগুলোও একই DNS পাতায় বসান। উপনাম ব্যবহার করায় এগুলো প্রথম সেবার Record এর সাথে ধাক্কা খায় না।",
            },
            {
              title: "[DNS সেবা] DMARC, তারপর পরীক্ষা",
              description:
                "_dmarc নামে একটা TXT বসান, p=none দিয়ে। এটা কোনো সেবা দেয় না, আপনি নিজে লেখেন। তারপর দুই সেবার পাতায় দেখুন সব সারির পাশে Verified এসেছে কি না, আর একটা পরীক্ষার ইমেইল পাঠিয়ে SPF, DKIM, DMARC তিনটাই pass দেখে নিন।",
            },
          ],
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "one-domain-three-services.txt",
          code: `; এক Domain, এক DNS পাতা, তিনটা সেবা থেকে আসা Record

; ---- Hosting দিয়েছে ----
A      @                76.76.21.21
CNAME  www              cname.hosting.example

; ---- মানুষের ইমেইল সেবা দিয়েছে ----
TXT    @                "google-site-verification=AbC123..."
MX     @                1 smtp.google.com
TXT    @                "v=spf1 include:_spf.google.com ~all"
TXT    google._domainkey  "v=DKIM1; k=rsa; p=MIIB..."

; ---- App এর ইমেইল সেবা দিয়েছে (send উপনামে) ----
TXT    s1._domainkey    "p=MIGfMA0GCSq..."
MX     send             10 feedback.mailservice.example
TXT    send             "v=spf1 include:mailservice.example ~all"

; ---- আপনি নিজে লিখেছেন ----
TXT    _dmarc           "v=DMARC1; p=none; rua=mailto:dmarc@islandtours.example"`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "প্রতিটা সারির পাশে লিখে রাখুন কে দিয়েছিল",
          content: (
            <p>
              ছয় মাস পরে এই DNS পাতা খুললে দশ বারোটা সারি দেখবেন, আর মনে থাকবে না
              কোনটা কোন সেবার জন্য। তখন একটা পুরনো সেবা বাদ দিতে গিয়ে ভুল সারি
              মুছে ফেলা খুব সহজ। বেশিরভাগ DNS পাতায় প্রতিটা Record এর সাথে একটা
              Comment বা Note লেখা যায়। বসানোর সময়ই লিখে রাখুন, যেমন Hosting এর
              জন্য, বা App এর ইমেইল, DKIM। পাতায় সেই সুবিধা না থাকলে উপরের মতো
              একটা ফাইল নিজের কাছে রাখুন। এই দুই মিনিটের অভ্যাস ভবিষ্যতের একটা
              দুর্ঘটনা ঠেকায়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 11 */
    {
      id: "subdomains",
      subHeader: { index: "011", title: "Subdomains" },
      title: <SectionTitle>হাতে কলমে ৪, উপনাম দিয়ে আলাদা আলাদা সেবা</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা Domain কিনলে তার নিচে যত খুশি উপনাম বানানো যায়, বিনা খরচে,
                কাউকে জিজ্ঞেস না করে। আর প্রতিটা উপনাম সম্পূর্ণ আলাদা একটা সেবার
                দিকে দেখাতে পারে। এটা DNS এর সবচেয়ে কাজের ক্ষমতাগুলোর একটা।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>উপনাম বানাতে কিছু কিনতে হয় না:</strong> শুধু DNS পাতায়
                  একটা নতুন Record যোগ করুন, Name এ উপনামটা লিখে। Registrar এ কিছু
                  করতে হয় না।
                </ListItem>
                <ListItem>
                  <strong>কাজটা প্রতিবার একই:</strong> নতুন সেবার পাতায় পুরো
                  উপনামটা (যেমন blog.islandtours.example) যোগ করুন। সে একটা CNAME
                  দেবে। DNS পাতায় Name এ blog আর Value তে সেই নামটা বসান।
                </ListItem>
                <ListItem>
                  <strong>উপনামে প্রায় সবসময় CNAME:</strong> কারণ এখানে মূল নামের
                  সেই বাধা নেই। তাই উপনামে জোড়া মূল নামের চেয়ে সহজ আর নিরাপদ।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "text",
          filename: "subdomains.txt",
          code: `; একই Domain, পাঁচটা উপনাম, পাঁচটা আলাদা সেবা

A      @        76.76.21.21                       ; মূল সাইট, Hosting এ
CNAME  www      cname.hosting.example
A      api      103.94.135.3                      ; নিজের সার্ভারে Backend
CNAME  blog     islandtours.blogservice.example   ; আলাদা Blog সেবা
CNAME  status   stats.statuspage.example          ; Status পাতার সেবা
CNAME  docs     islandtours.docshost.example      ; নির্দেশিকার সেবা
CNAME  shop     shops.storeservice.example        ; অনলাইন দোকানের সেবা

; প্রতিটা CNAME এর লক্ষ্য সেই সেবার পাতা থেকে নেওয়া,
; আর প্রতিটা সেবার পাতায় উপনামটা আলাদা করে যোগ করা।`,
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "সেবা বাদ দিলে তার Record ও মুছুন",
          content: (
            <p>
              ধরুন blog উপনামটা একটা Blog সেবার দিকে দেখাত। এক বছর পরে সেই সেবা
              বাদ দিলেন, Account মুছলেন, কিন্তু DNS এর CNAME টা রয়ে গেল। এখন সেই
              CNAME এমন একটা নামের দিকে দেখাচ্ছে যেটা সেবার কাছে আর কারো নয়। অন্য
              কেউ সেই সেবায় Account খুলে ঠিক সেই নামটা নিয়ে নিলে, আপনার
              blog.islandtours.example এ তার সাইট দেখাবে, আপনার নামে। এই আক্রমণের
              নাম Subdomain Takeover, আর এটা বাস্তবে নিয়মিত ঘটে। নিয়মটা সরল, কোনো
              সেবা বাদ দেওয়ার আগে তার Record DNS থেকে মুছুন, পরে নয়।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 12 */
    {
      id: "verification",
      subHeader: { index: "012", title: "The Verify Button" },
      title: <SectionTitle>Verify বোতামে চাপলে পেছনে কী ঘটে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                প্রতিটা সেবার পাতায় একটা Verify, Check বা Refresh বোতাম থাকে, আর
                একটা অবস্থা, Pending বা Invalid থেকে Verified বা Valid। এই বোতামের
                পেছনে কী ঘটে জানা থাকলে আটকে গেলে কারণটা নিজেই ধরতে পারবেন।
              </ContentParagraph>
              <ContentParagraph>
                সেবার Backend আসলে সেই কাজটাই করে যা আপনি Terminal এ dig দিয়ে
                করেন। সে আপনার Domain এর জন্য একটা DNS প্রশ্ন করে, উত্তরটা নিজের
                প্রত্যাশার সাথে মেলায়, আর মিললে নিজের Database এ অবস্থা বদলে দেয়।
                তিন রকম পরীক্ষা হয়।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>পথের পরীক্ষা:</strong> সে আপনার নামের A বা CNAME খোঁজে,
                  আর দেখে উত্তরটা তার নিজের IP বা নিজের নামের দিকে যাচ্ছে কি না।
                </ListItem>
                <ListItem>
                  <strong>মালিকানার পরীক্ষা:</strong> সে আপনার নামের TXT খোঁজে, আর
                  দেখে তার বানানো লেখাটা সেখানে আছে কি না।
                </ListItem>
                <ListItem>
                  <strong>সার্টিফিকেটের পরীক্ষা:</strong> পথ ঠিক হলে সে একটা
                  সার্টিফিকেট সংস্থার কাছে আবেদন করে। সংস্থা নিজে আপনার Domain এ
                  একটা ছোট Request পাঠিয়ে দেখে সেটা সত্যিই এই সেবার সার্ভারে
                  পৌঁছায় কি না। পৌঁছালে সার্টিফিকেট দেয়। এই কারণে সার্টিফিকেট
                  আসে DNS ঠিক হওয়ার একটু পরে।
                </ListItem>
              </ContentList>
              <ContentParagraph>
                তাই Verify ব্যর্থ হলে প্রথম কাজ, সেবা যা দেখতে চায় তা নিজে dig দিয়ে
                দেখা। আপনি দেখতে পেলে সেও পাবে, শুধু একটু পরে। আপনি না পেলে সেও
                পাবে না, আর তখন সমস্যা আপনার DNS পাতায়।
              </ContentParagraph>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.CODE_BLOCK,
          language: "bash",
          filename: "check-like-the-service.sh",
          code: `D=islandtours.example

# সেবা যা যা দেখে, আপনিও তাই দেখুন। @1.1.1.1 দিয়ে, যাতে নিজের Cache না ঠকায়।
dig +short A     $D        @1.1.1.1     # Hosting এর IP এসেছে?
dig +short AAAA  $D        @1.1.1.1     # পুরনো IPv6 রয়ে যায়নি তো? ফাঁকা থাকা চাই
dig +short CNAME www.$D    @1.1.1.1     # Hosting এর নাম এসেছে?
dig +short TXT   $D        @1.1.1.1     # যাচাইয়ের লেখা আর SPF আছে?
dig +short MX    $D        @1.1.1.1     # ইমেইল সেবার নাম?
dig +short TXT   _dmarc.$D @1.1.1.1
dig +short TXT   google._domainkey.$D @1.1.1.1    # DKIM, Name টা হুবহু মিলিয়ে

# সার্টিফিকেট আটকে থাকলে: কোনো CAA Record অন্য সংস্থাকে আটকাচ্ছে না তো?
dig +short CAA   $D        @1.1.1.1

# সব ঠিক থাকলে শেষ প্রমাণ, সাইট আর সার্টিফিকেট
curl -sI https://$D | head -3
curl -sI https://www.$D | head -3`,
        },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentList>
              <ListItem>
                <strong>Pending এ আটকে আছে, অথচ dig ঠিক দেখায়:</strong> সেবার
                Resolver এর Cache এ পুরনো উত্তর। অপেক্ষা করুন, কয়েক মিনিট পর আবার
                Verify চাপুন।
              </ListItem>
              <ListItem>
                <strong>Invalid Configuration, IP মিলছে না:</strong> একই নামে
                পুরনো আরেকটা A বা AAAA রয়ে গেছে। মুছুন।
              </ListItem>
              <ListItem>
                <strong>Cloudflare ব্যবহার করছেন আর যাচাই হচ্ছে না:</strong> Record
                টা Proxied হয়ে আছে। তখন বাইরে থেকে Cloudflare এর IP দেখা যায়,
                সেবার নয়। DNS only করুন।
              </ListItem>
              <ListItem>
                <strong>TXT খুঁজে পাচ্ছে না:</strong> Name ঘরে পুরো Domain লিখে
                ফেলেছেন, ফলে নামটা দুইবার জুড়ে গেছে। অথবা Record টা ভুল DNS পাতায়
                বসিয়েছেন।
              </ListItem>
              <ListItem>
                <strong>DNS ঠিক, সার্টিফিকেট আসছে না:</strong> একটা CAA Record
                আছে যেটা সেবার সার্টিফিকেট সংস্থাকে অনুমতি দেয়নি। CAA তে সেই
                সংস্থা যোগ করুন, সেবার নির্দেশিকায় নামটা থাকে।
              </ListItem>
              <ListItem>
                <strong>এই Domain অন্য Account এ ব্যবহার হচ্ছে:</strong> আপনি বা
                আগের মালিক আগে কখনো এই Domain এই সেবার আরেক Account এ যোগ
                করেছিলেন। সেবা তখন একটা TXT দিয়ে মালিকানা প্রমাণ করতে বলে। বসিয়ে
                দিলে সে Domain টা পুরনো Account থেকে সরিয়ে আপনাকে দেয়।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 13 */
    {
      id: "moving",
      subHeader: { index: "013", title: "Moving Things" },
      title: <SectionTitle>সরানো: তিনটা আলাদা কাজ, যা প্রায়ই গুলিয়ে যায়</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                Domain সরানো কথাটা তিনটা সম্পূর্ণ আলাদা কাজ বোঝাতে পারে। কোনটা করতে
                চান পরিষ্কার না থাকলে ভুল কাজটা করে ফেলবেন। তিন পক্ষের প্রতিটার
                জন্য একটা করে সরানো।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Hosting বদল (সাইট অন্য সার্ভারে):</strong> শুধু A আর
                  CNAME এর মান বদলায়। নতুন Hosting এর পাতায় Domain যোগ করুন, নতুন
                  ছক নিন, DNS পাতায় পুরনো মান বদলে নতুন বসান। Registrar আর Name
                  Server ছোঁয়াই লাগে না। ইমেইল নিরাপদ থাকে।
                </ListItem>
                <ListItem>
                  <strong>DNS সেবা বদল (Record অন্য জায়গায়):</strong> নতুন DNS
                  সেবায় সব Record হুবহু বসান, তারপর Registrar এ Name Server বদলান।
                  Record এর মান বদলায় না, তাই সাইট আর ইমেইল যেখানে ছিল সেখানেই
                  থাকে। Cloudflare এর লেসনের নয় ধাপ এটাই।
                </ListItem>
                <ListItem>
                  <strong>Registrar বদল (Domain Transfer):</strong> Domain এর
                  মালিকানার হিসাব এক কোম্পানি থেকে আরেক কোম্পানিতে নেওয়া, সাধারণত
                  সস্তা নবায়নের জন্য। পুরনো Registrar এ Domain Unlock করে একটা
                  গোপন সংকেত নিন (নাম Auth Code বা EPP Code), নতুন Registrar এ
                  Transfer শুরু করে সংকেতটা দিন, আর ইমেইলে আসা অনুমোদন দিন। পাঁচ
                  থেকে সাত দিন লাগে। Name Server আর Record এতে বদলায় না, যদি DNS
                  আলাদা সেবায় থাকে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.WARNING,
          title: "Registrar বদলের আগে দেখুন DNS কোথায়",
          content: (
            <p>
              Domain Transfer এর একটা লুকানো ফাঁদ আছে। আপনার DNS যদি পুরনো
              Registrar এর নিজের DNS সেবায় চলে, তাহলে Transfer শেষ হওয়ার পর পুরনো
              Registrar সেই DNS সেবা বন্ধ করে দিতে পারে, আর আপনার সব Record একসাথে
              হারিয়ে যায়। তাই Transfer এর আগে dig +short NS চালান। উত্তরে পুরনো
              Registrar এর Name Server দেখালে আগে DNS টা একটা আলাদা সেবায় (যেমন
              Cloudflare) সরিয়ে নিন, তারপর Transfer শুরু করুন। আর জেনে রাখুন, নতুন
              কেনা বা সদ্য Transfer করা Domain ৬০ দিন পর্যন্ত আবার Transfer করা
              যায় না।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 14 */
    {
      id: "recipe",
      subHeader: { index: "014", title: "The Universal Recipe" },
      title: <SectionTitle>যেকোনো সেবা, একই সাত ধাপ</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              এতক্ষণ যা যা দেখলেন, সব এই সাত ধাপের ভিন্ন ভিন্ন রূপ। ভবিষ্যতে এমন
              কোনো সেবা সামনে এলে যার নাম আগে শোনেননি, এই তালিকা ধরে এগোলেই হবে।
              এটা মুখস্থ করে নিন, আর অন্যকে শেখানোর সময় এটা দিয়েই শুরু করুন।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "জানুন আপনার DNS কোথায়",
              description:
                "dig +short NS চালান। উত্তর যে কোম্পানির নাম দেখায়, Record বসাতে হবে তাদের পাতায়। এই ধাপ বাদ দিলে ভুল পাতায় বসানোর ঝুঁকি থাকে।",
            },
            {
              title: "সেবার পাতায় নিজের Domain যোগ করুন",
              description:
                "সেবার Settings এ Domains, Custom domain বা Add domain খুঁজুন। পুরো নামটা লিখুন, মূল নাম বা উপনাম, যেটা জুড়তে চান।",
            },
            {
              title: "সেবা যা চায় তা পড়ুন",
              description:
                "সে একটা ছক দেখাবে। মিলিয়ে নিন সে চার রকমের কোনগুলো চাইছে: পথ দেখানোর Record, প্রমাণের Record, ইমেইলের Record, নাকি Name Server। প্রতিটা সারির Type, Name আর Value আলাদা করে পড়ুন।",
            },
            {
              title: "DNS পাতায় একই নামের পুরনো Record দেখুন",
              description:
                "একই Name আর একই Type এ আগে থেকে কিছু থাকলে মুছুন বা বদলান। একই Name এ CNAME বসাতে হলে সেই নামের বাকি সব Record সরাতে হবে।",
            },
            {
              title: "Record গুলো হুবহু বসান",
              description:
                "প্রতিটা মান Copy বোতাম দিয়ে নিন, হাতে টাইপ নয়। Name এ শুধু সামনের অংশ। TTL ছোট। Cloudflare এ DNS only। Save এর পর তালিকায় পুরো নামটা পড়ে নিন।",
            },
            {
              title: "নিজে dig দিয়ে দেখুন",
              description:
                "প্রতিটা Record @1.1.1.1 দিয়ে dig করুন। সেবার দেওয়া মান ফেরত এলে আপনার কাজ শেষ।",
            },
            {
              title: "সেবার পাতায় Verify করুন, তারপর শেষ পরীক্ষা",
              description:
                "Verify বা Refresh চাপুন, অবস্থা Valid হওয়া পর্যন্ত দেখুন। তারপর আসল কাজটা করে দেখুন: https দিয়ে সাইট খুলুন, অথবা একটা ইমেইল পাঠান আর নিন।",
            },
          ],
        },
      ],
    },
    /* --------------------------------------------------------------- 15 */
    {
      id: "project",
      subHeader: { index: "015", title: "Project Example" },
      title: <SectionTitle>Island Tours এর Domain এ সাতটা সেবা</SectionTitle>,
      blocks: [
        { type: CONTENT_TYPES.CUSTOM, component: <IslandToursBrief /> },
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <div className="space-y-6">
              <ContentParagraph>
                একটা বাস্তব ব্যবসার Domain এ সাধারণত পাঁচ থেকে দশটা সেবা জোড়া
                থাকে। Island Tours এর জন্য তালিকাটা এরকম, আর প্রতিটা সারিতে লক্ষ্য
                করুন মানটা কে দিয়েছে।
              </ContentParagraph>
              <ContentList>
                <ListItem>
                  <strong>Registrar:</strong> Domain এখানে কেনা। এখানে লেখা শুধু
                  দুইটা জিনিস, মালিকের তথ্য আর Cloudflare এর দুইটা Name Server
                  (Cloudflare দিয়েছে)।
                </ListItem>
                <ListItem>
                  <strong>Cloudflare (DNS):</strong> নিচের সব Record এখানে বসানো।
                </ListItem>
                <ListItem>
                  <strong>মূল সাইট আর www:</strong> A আর CNAME, মান দিয়েছে
                  Hosting।
                </ListItem>
                <ListItem>
                  <strong>api:</strong> A Record, IP নেওয়া নিজের সার্ভারের পাতা
                  থেকে।
                </ListItem>
                <ListItem>
                  <strong>দলের ইমেইল:</strong> যাচাইয়ের TXT, MX, SPF আর DKIM, মান
                  দিয়েছে ইমেইল সেবা।
                </ListItem>
                <ListItem>
                  <strong>বুকিং নিশ্চিতকরণের ইমেইল:</strong> send উপনামে DKIM, SPF
                  আর MX, মান দিয়েছে App এর ইমেইল সেবা।
                </ListItem>
                <ListItem>
                  <strong>status উপনাম:</strong> একটা CNAME, মান দিয়েছে Status
                  পাতার সেবা।
                </ListItem>
                <ListItem>
                  <strong>Search Console:</strong> একটা যাচাইয়ের TXT, মান দিয়েছে
                  Google।
                </ListItem>
                <ListItem>
                  <strong>DMARC:</strong> একমাত্র Record যেটা কেউ দেয়নি, দল নিজে
                  লিখেছে।
                </ListItem>
              </ContentList>
            </div>
          ),
        },
        {
          type: CONTENT_TYPES.INFO_BOX,
          variant: INFO_BOX_VARIANTS.IMPORTANT,
          title: "দলের জন্য একটা Domain এর খাতা রাখুন",
          content: (
            <p>
              এই তালিকাটাই একটা ব্যবসার সবচেয়ে অবহেলিত নথি। একটা পাতায় লিখে রাখুন,
              Domain কোন Registrar এ আর কার Login এ, DNS কোথায়, প্রতিটা Record কোন
              সেবার জন্য আর সেই সেবার Account কার, আর Domain এর নবায়ন কবে। যেদিন
              কিছু ভাঙবে, বা যে মানুষটা সব বসিয়েছিলেন তিনি দল ছেড়ে যাবেন, সেদিন
              এই এক পাতা কয়েক দিনের খোঁজাখুঁজি বাঁচাবে।
            </p>
          ),
        },
      ],
    },
    /* --------------------------------------------------------------- 16 */
    {
      id: "request-flow",
      subHeader: { index: "016", title: "Step-by-step Flow" },
      title: <SectionTitle>একটা মান, কার হাত থেকে কার হাতে</SectionTitle>,
      blocks: [
        {
          type: CONTENT_TYPES.HTML,
          content: (
            <ContentParagraph>
              শেষবার পুরো শিকলটা, এবার একটা মানকে অনুসরণ করে। Hosting এর IP টা
              কীভাবে শেষ পর্যন্ত একজন পর্যটকের Browser এ পৌঁছায়।
            </ContentParagraph>
          ),
        },
        {
          type: CONTENT_TYPES.STEP_FLOW,
          stepName: "STEP",
          steps: [
            {
              title: "Hosting নিজের সার্ভারের IP জানে",
              description:
                "76.76.21.21 তাদের Load Balancer এর ঠিকানা। এটা তাদের সম্পত্তি, তারা নিজেদের পাতায় এটা আপনাকে দেখায়।",
            },
            {
              title: "আপনি সেটা DNS সেবায় বসান",
              description:
                "Cloudflare এর পাতায় A Record হিসেবে। এখন Cloudflare এর Authoritative server জানে islandtours.example এর উত্তর কী।",
            },
            {
              title: "Cloudflare এর Name Server এর নাম Registrar এ লেখা",
              description:
                "এটা আপনি আগেই বসিয়েছিলেন। Registrar সেটা TLD এর Registry তে পৌঁছে দিয়েছে।",
            },
            {
              title: "একজন পর্যটক নামটা লেখেন",
              description:
                "তাঁর Resolver TLD কে জিজ্ঞেস করে, TLD বলে Cloudflare এর Name Server এর কথা (আপনার দ্বিতীয় হাতবদলের ফল)।",
            },
            {
              title: "Resolver Cloudflare কে জিজ্ঞেস করে",
              description:
                "Cloudflare বলে 76.76.21.21 (আপনার প্রথম হাতবদলের ফল)। Resolver সেটা পর্যটকের Browser কে দেয়।",
            },
            {
              title: "Browser Hosting এর সার্ভারে পৌঁছায়",
              description:
                "সার্ভার দেখে Browser islandtours.example চেয়েছে, নিজের তালিকায় নামটা খুঁজে পায় (কারণ আপনি Hosting এর পাতায় Domain যোগ করেছিলেন), আর আপনার সাইটটা দেয়।",
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
                <strong>একটা আসল Domain এ করুন</strong>, একটা সস্তা Domain কিনে
                (বছরে কয়েকশ টাকার মধ্যে পাওয়া যায়) এই লেসনের আট ধাপ নিজে করুন।
                পড়ে যা বুঝবেন, একবার করলে তার চেয়ে অনেক বেশি পাকা হবে।
              </ListItem>
              <ListItem>
                <strong>Vercel Docs, Add a domain</strong>, একটা Hosting এর Domain
                জোড়ার পাতা আর ছক কেমন হয়, ছবি সহ।{" "}
                <a
                  href="https://vercel.com/docs/domains/working-with-domains/add-a-domain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  vercel.com/docs/domains
                </a>
              </ListItem>
              <ListItem>
                <strong>GitHub Docs, Custom domain for GitHub Pages</strong>, চারটা
                A Record আর www এর CNAME এর সরকারি তালিকা।{" "}
                <a
                  href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  docs.github.com/pages
                </a>
              </ListItem>
              <ListItem>
                <strong>Google Workspace, Set up MX records</strong>, ইমেইলের জন্য
                MX আর যাচাইয়ের ধাপ।{" "}
                <a
                  href="https://support.google.com/a/answer/140034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  support.google.com/a/answer/140034
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
            <ContentList>
              <ListItem>
                Domain Setup মানে দুইটা হাতবদল। সেবা থেকে Record এর মান নিয়ে DNS
                সেবায় বসানো, আর DNS সেবা থেকে Name Server এর নাম নিয়ে Registrar এ
                বসানো। আপনি শুধু বাহক।
              </ListItem>
              <ListItem>
                <strong>Name Server</strong> দেয় DNS সেবা, বসে Registrar এ। নতুন
                Domain এ Registrar এর নিজের Name Server বসানোই থাকে, বদলানো
                বাধ্যতামূলক নয়।
              </ListItem>
              <ListItem>
                <strong>Record এর মান</strong> দেয় সেই সেবা যেখানে জুড়ছেন, তার
                Domains পাতায়। IP আর CNAME এর লক্ষ্য তাদের সার্ভারের, যাচাইয়ের
                লেখা তাদের বানানো।
              </ListItem>
              <ListItem>
                সেবা চার রকম জিনিস চায়: পথ দেখানোর Record, প্রমাণের Record,
                ইমেইলের Record, অথবা পুরো Name Server।
              </ListItem>
              <ListItem>
                কাজ সবসময় দুই জায়গায়: সেবার পাতায় Domain যোগ করা, আর DNS পাতায়
                Record বসানো। একটা বাদ পড়লে চলবে না।
              </ListItem>
              <ListItem>
                মূল নামে A (কারণ সেখানে CNAME চলে না), উপনামে CNAME। বসানোর আগে একই
                নামের পুরনো A, AAAA আর CNAME সরান।
              </ListItem>
              <ListItem>
                এক Domain এ যত খুশি সেবা। ইমেইল জুড়তে Name Server বা Website এর
                Record ছুঁতে হয় না, শুধু আরও সারি যোগ হয়।
              </ListItem>
              <ListItem>
                Verify বোতাম আসলে dig করে। আটকে গেলে সেবা যা দেখতে চায় তা নিজে
                dig দিয়ে দেখুন।
              </ListItem>
              <ListItem>
                সরানো তিন রকম: Hosting বদল (Record এর মান), DNS সেবা বদল (Name
                Server), Registrar বদল (Transfer)। তিনটা আলাদা।
              </ListItem>
              <ListItem>
                সেবা বাদ দিলে আগে তার Record মুছুন, নাহলে Subdomain Takeover এর
                ঝুঁকি।
              </ListItem>
              <ListItem>
                পরের লেসন: এবার উল্টো দিক। আপনি নিজেই সেই সেবা, যে গ্রাহককে Record
                দেয়। Wildcard আর Custom Domain, Multi-tenant App এর জন্য।
              </ListItem>
            </ContentList>
          ),
        },
      ],
    },
  ],
  summary: {
    headers: ["প্রশ্ন", "উত্তর"],
    rows: [
      [
        <span className="font-bold text-primary">Name Server কে দেয়</span>,
        "যে কোম্পানি আপনার DNS চালাবে, তাদের পাতায় Domain যোগ করলে",
      ],
      [
        <span className="font-bold text-primary">Name Server কোথায় বসে</span>,
        "শুধু Registrar এ",
      ],
      [
        <span className="font-bold text-primary">A বা CNAME এর মান কে দেয়</span>,
        "Hosting, তার Domains পাতায়। নিজের সার্ভার হলে সার্ভারের IP",
      ],
      [
        <span className="font-bold text-primary">MX, SPF, DKIM কে দেয়</span>,
        "ইমেইল সেবা, তার Domain যোগ করার নির্দেশিকায়",
      ],
      [
        <span className="font-bold text-primary">যাচাইয়ের TXT কে দেয়</span>,
        "যে সেবা যাচাই করতে চায়, সে নিজে এলোমেলোভাবে বানায়",
      ],
      [
        <span className="font-bold text-primary">Record কোথায় বসে</span>,
        "DNS সেবায়, মানে dig +short NS যাকে দেখায় তার পাতায়",
      ],
      [
        <span className="font-bold text-primary">নিজের Domain এর নাম কোথায় লিখি</span>,
        "সেবার পাতায়, Add Domain ঘরে",
      ],
      [
        <span className="font-bold text-primary">মূল নামে কী</span>,
        "A Record, অথবা DNS সেবার ALIAS বা CNAME Flattening",
      ],
      [
        <span className="font-bold text-primary">উপনামে কী</span>,
        "প্রায় সবসময় CNAME",
      ],
      [
        <span className="font-bold text-primary">Verify কী করে</span>,
        "সেবা নিজে DNS প্রশ্ন করে উত্তর মিলিয়ে দেখে",
      ],
    ],
  },
  knowledgeCheck: {
    questions: [
      {
        id: 1,
        text: "Cloudflare আপনাকে দুইটা Name Server এর নাম দিল। এগুলো কোথায় বসাবেন?",
        options: [
          {
            key: "A",
            text: "Cloudflare এর DNS Records পাতায়, NS Record হিসেবে",
            isCorrect: false,
            explanation:
              "না। Cloudflare নিজেই নিজের পাতায় সেগুলো বসিয়ে রাখে। আপনার কাজ এগুলো বাইরে জানানো।",
          },
          {
            key: "B",
            text: "Registrar এ, যেখানে Domain কিনেছেন, Nameservers অংশে",
            isCorrect: true,
            explanation:
              "ঠিক। Name Server সবসময় Registrar এ বসে। Registrar সেটা TLD এ পৌঁছে দেয়, আর তখন পৃথিবী Cloudflare কে জিজ্ঞেস করতে শুরু করে।",
          },
          {
            key: "C",
            text: "Hosting এর Domains পাতায়",
            isCorrect: false,
            explanation: "Hosting এর পাতায় শুধু নিজের Domain এর নামটা লিখতে হয়।",
          },
        ],
      },
      {
        id: 2,
        text: "Hosting এর Domains পাতা একটা A Record দেখাল, যার Value 76.76.21.21। এই IP টা কোথা থেকে এলো?",
        options: [
          {
            key: "A",
            text: "এটা Hosting এর নিজের সার্ভারের ঠিকানা, যা তারা সব গ্রাহককে দেয়",
            isCorrect: true,
            explanation:
              "ঠিক। সার্ভার তাদের, তাই ঠিকানাও তারা জানে। আপনি শুধু সেটা কপি করে নিজের DNS পাতায় বসান।",
          },
          {
            key: "B",
            text: "এটা আপনার Registrar এর দেওয়া",
            isCorrect: false,
            explanation: "Registrar শুধু মালিকানা আর Name Server রাখে।",
          },
          {
            key: "C",
            text: "এটা আপনার বাসার Public IP",
            isCorrect: false,
            explanation: "সাইট আপনার বাসায় নয়, Hosting এর সার্ভারে।",
          },
        ],
      },
      {
        id: 3,
        text: "DNS এ A Record ঠিক বসিয়েছেন, dig ঠিক IP দিচ্ছে, কিন্তু সাইটে Hosting এর একটা ভুলের পাতা দেখাচ্ছে। সবচেয়ে সম্ভাব্য কারণ?",
        options: [
          {
            key: "A",
            text: "Hosting এর পাতায় Domain টা যোগ করা হয়নি",
            isCorrect: true,
            explanation:
              "ঠিক। Request সার্ভারে পৌঁছাচ্ছে, কিন্তু সার্ভার এই নাম চেনে না। কাজ দুই জায়গায়, DNS এ Record আর সেবার পাতায় Domain।",
          },
          {
            key: "B",
            text: "Name Server ভুল",
            isCorrect: false,
            explanation: "তা হলে dig ঠিক IP দিত না।",
          },
          {
            key: "C",
            text: "TTL খুব ছোট",
            isCorrect: false,
            explanation: "TTL এর সাথে এর সম্পর্ক নেই।",
          },
        ],
      },
      {
        id: 4,
        text: "Hosting মূল নামের জন্য A আর www এর জন্য CNAME দেয় কেন, দুইটাই CNAME নয় কেন?",
        options: [
          {
            key: "A",
            text: "মূল নামে CNAME বসানো যায় না, তাই সেখানে বাধ্য হয়ে IP দিতে হয়",
            isCorrect: true,
            explanation:
              "ঠিক। মূল নামে NS এর মতো Record থাকতেই হয়, আর CNAME এর পাশে অন্য কিছু চলে না। উপনামে সেই বাধা নেই।",
          },
          {
            key: "B",
            text: "A Record দ্রুত",
            isCorrect: false,
            explanation: "গতির ব্যাপার নয়, নিয়মের ব্যাপার।",
          },
          {
            key: "C",
            text: "www সবসময় আলাদা সার্ভারে থাকে",
            isCorrect: false,
            explanation: "না, দুইটাই একই সাইটে যায়।",
          },
        ],
      },
      {
        id: 5,
        text: "চালু Website আছে, এবার একই Domain এ Google Workspace এর ইমেইল জুড়বেন। কী কী ছুঁতে হবে?",
        options: [
          {
            key: "A",
            text: "Name Server বদলে Google এর করতে হবে",
            isCorrect: false,
            explanation: "না। ইমেইলের জন্য Name Server বদলাতে হয় না।",
          },
          {
            key: "B",
            text: "একই DNS পাতায় শুধু নতুন সারি যোগ হবে: যাচাইয়ের TXT, MX, SPF, DKIM",
            isCorrect: true,
            explanation:
              "ঠিক। Website এর A আর CNAME যেমন আছে তেমন থাকে। একটা Domain এ অনেক সেবা পাশাপাশি চলে।",
          },
          {
            key: "C",
            text: "A Record বদলে Google এর IP দিতে হবে",
            isCorrect: false,
            explanation: "তা করলে Website বন্ধ হয়ে যাবে। ইমেইল MX দেখে আসে, A নয়।",
          },
        ],
      },
      {
        id: 6,
        text: "একটা সেবা বলছে এই TXT বসিয়ে প্রমাণ করুন Domain আপনার। লেখাটা সেবা পেল কোথা থেকে?",
        options: [
          {
            key: "A",
            text: "সে নিজে এলোমেলোভাবে বানিয়ে নিজের Database এ আপনার Account এর পাশে রেখেছে",
            isCorrect: true,
            explanation:
              "ঠিক। পরে সে DNS এ একই লেখা খুঁজে মিলিয়ে নেয়। মিললে বোঝা যায় আপনার হাতে DNS এর নিয়ন্ত্রণ আছে।",
          },
          {
            key: "B",
            text: "Registrar থেকে",
            isCorrect: false,
            explanation: "Registrar এর এতে কোনো ভূমিকা নেই।",
          },
          {
            key: "C",
            text: "এটা সব গ্রাহকের জন্য একই একটা লেখা",
            isCorrect: false,
            explanation: "তা হলে যে কেউ যেকোনো Domain নিজের বলে দাবি করতে পারত।",
          },
        ],
      },
      {
        id: 7,
        text: "Cloudflare এ Record বসিয়েছেন, কিন্তু Hosting এর পাতা বলছে Invalid Configuration, IP মিলছে না। dig করলে একটা 104 দিয়ে শুরু IP আসছে। কারণ?",
        options: [
          {
            key: "A",
            text: "Record টা Proxied, তাই বাইরে Cloudflare এর IP দেখা যাচ্ছে",
            isCorrect: true,
            explanation:
              "ঠিক। Hosting নিজের IP খুঁজছে, পাচ্ছে Cloudflare এর। Record টা DNS only করুন।",
          },
          {
            key: "B",
            text: "Hosting বন্ধ",
            isCorrect: false,
            explanation: "Hosting ই তো পরীক্ষাটা করছে।",
          },
          {
            key: "C",
            text: "Domain এর মেয়াদ শেষ",
            isCorrect: false,
            explanation: "তা হলে dig কোনো IP ই দিত না।",
          },
        ],
      },
      {
        id: 8,
        text: "সাইটটা এক Hosting থেকে আরেক Hosting এ সরাবেন, বাকি সব যেমন আছে থাকবে। কী বদলাতে হবে?",
        options: [
          {
            key: "A",
            text: "শুধু DNS পাতায় A আর CNAME এর মান, নতুন Hosting এর দেওয়া মান দিয়ে",
            isCorrect: true,
            explanation:
              "ঠিক। Registrar আর Name Server ছোঁয়াই লাগে না, আর ইমেইলের Record নিরাপদ থাকে।",
          },
          {
            key: "B",
            text: "Registrar এ Name Server",
            isCorrect: false,
            explanation: "সেটা DNS সেবা বদলের কাজ, Hosting বদলের নয়।",
          },
          {
            key: "C",
            text: "Domain টা নতুন Hosting এ Transfer করতে হবে",
            isCorrect: false,
            explanation: "Transfer মানে Registrar বদল, যার এখানে দরকার নেই।",
          },
        ],
      },
    ],
  },
  practicalLab: {
    title: "অন্যরা কীভাবে জুড়েছে, বাইরে থেকে পড়ুন",
    subtitle: "Terminal এ ছয়টা পরীক্ষা",
    stepName: "LAB",
    steps: [
      {
        title: "তিন পক্ষ আলাদা করুন",
        description:
          "একটা সাইটের Registrar, DNS সেবা আর Hosting কে কে, আলাদা করে বের করুন।",
      },
      {
        title: "মূল নাম আর www এর ছক",
        description:
          "একটা সাইটে মূল নামে A আর www তে CNAME, এই চেনা ছকটা নিজের চোখে দেখুন।",
      },
      {
        title: "GitHub Pages এর চার IP",
        description:
          "GitHub Pages এ চলা একটা সাইট খুঁজে দেখুন সেই চারটা চেনা IP।",
      },
      {
        title: "ইমেইল কোন সেবায়",
        description:
          "MX আর SPF পড়ে বের করুন একটা প্রতিষ্ঠান কোন কোন ইমেইল সেবা ব্যবহার করে।",
      },
      {
        title: "TXT থেকে সেবার তালিকা",
        description:
          "একটা Domain এর যাচাইয়ের TXT গুলো পড়ে আন্দাজ করুন সে কোন কোন সেবায় যুক্ত।",
      },
      {
        title: "উপনাম আর তাদের গন্তব্য",
        description:
          "একটা Domain এর কয়েকটা চেনা উপনাম কোন কোন সেবার দিকে দেখায়, বের করুন।",
      },
    ],
    codeBlocks: [
      {
        filename: "1-three-parties.sh",
        language: "bash",
        code: `D=vercel.com

echo "Registrar:";  whois $D | grep -i "registrar:" | head -1
echo "DNS সেবা:";   dig +short NS $D | head -2
echo "Hosting:";    whois $(dig +short A $D | head -1) | grep -i -E "orgname|netname" | head -2

# তিনটা উত্তর তিনটা আলাদা কোম্পানি হতে পারে।
# নিজের পছন্দের আরও তিনটা সাইটে চালিয়ে একটা ছক বানান।`,
      },
      {
        filename: "2-apex-and-www.sh",
        language: "bash",
        code: `D=nextjs.org

dig +noall +answer A $D           # মূল নাম: A Record, একটা IP
dig +noall +answer A www.$D       # www: প্রথমে CNAME, তারপর সেই নামের A

# মূল নামে IP, www তে একটা নাম। ঠিক সেই ছক, যা Hosting গুলো দেয়।
# CNAME এর লক্ষ্যটা পড়ুন। নামটা দেখেই বোঝা যায় কোন Hosting।`,
      },
      {
        filename: "3-github-pages.sh",
        language: "bash",
        code: `# GitHub Pages এর চারটা IP, সব গ্রাহকের জন্য একই
dig +short A github.io

# একটা username.github.io সাইট
dig +short A octocat.github.io

# যে সাইট নিজের Domain এ GitHub Pages চালায়, তার www এর CNAME
# দেখাবে username.github.io, আর মূল নামে থাকবে উপরের চার IP।`,
      },
      {
        filename: "4-email-provider.sh",
        language: "bash",
        code: `D=github.com

dig +short MX $D
# smtp.google.com বা aspmx.l.google.com  ->  Google Workspace
# xxx.mail.protection.outlook.com        ->  Microsoft 365
# mx.zoho.com                            ->  Zoho Mail

dig +short TXT $D | grep spf1
# SPF এর প্রতিটা include একটা করে সেবা, যে এই Domain এর নামে ইমেইল পাঠাতে পারে।
# একটা বড় প্রতিষ্ঠানে চার পাঁচটা include থাকা স্বাভাবিক।`,
      },
      {
        filename: "5-verification-txt.sh",
        language: "bash",
        code: `dig +short TXT github.com

# প্রতিটা লাইনের শুরুটা পড়ুন:
#   google-site-verification=...       Google Search Console বা Workspace
#   MS=ms...                           Microsoft 365
#   facebook-domain-verification=...   Meta
#   atlassian-domain-verification=...  Atlassian (Jira)
#   stripe-verification=...            Stripe
#   v=spf1 ...                         SPF
#
# এই তালিকাটা একটা প্রতিষ্ঠানের ব্যবহার করা সেবার একটা খোলা মানচিত্র।
# প্রতিটা লাইন একদিন কেউ একজন কোনো সেবার পাতা থেকে কপি করে বসিয়েছিলেন।`,
      },
      {
        filename: "6-subdomains.sh",
        language: "bash",
        code: `D=github.com
for S in www docs blog status api shop support; do
  R=$(dig +short $S.$D | head -1)
  echo "$S.$D  ->  \${R:-(নেই)}"
done

# প্রথম লাইনে একটা নাম এলে সেটা CNAME, আর নামটা দেখে সেবা চেনা যায়।
# IP এলে সেটা সরাসরি A Record।
# লক্ষ্য করুন, একই Domain এর উপনামগুলো কত আলাদা জায়গায় যায়।`,
      },
    ],
    tip: "পাঁচ নম্বর পরীক্ষাটা মন দিয়ে দেখুন। একটা বড় প্রতিষ্ঠানের TXT Record গুলো পড়লে পুরো লেসনটা এক জায়গায় দেখা যায়। প্রতিটা লাইন একটা সেবার দেওয়া একটা মান, যেটা কেউ একজন সেই সেবার পাতা থেকে কপি করে নিজের DNS পাতায় বসিয়েছিলেন, তারপর সেবার পাতায় Verify চেপেছিলেন। ঠিক সেই দুই হাতবদল, বছরের পর বছর, একটা একটা করে। আপনিও এখন থেকে ঠিক এই কাজটাই করবেন।",
  },
  assignment: {
    title: "Mini Project: Domain Setup শেখানোর উপকরণ",
    time: "৯০ মিনিট",
    difficulty: "Intermediate",
    tasks: [
      <span key="1">
        <strong>দুই হাতবদল আঁকুন:</strong> লেসনের ছবি না দেখে, কাগজে তিন পক্ষ আর
        দুইটা হাতবদল আঁকুন। প্রতিটা তীরের উপর লিখুন কী যাচ্ছে আর একটা আসল উদাহরণ।
      </span>,
      <span key="2">
        <strong>পাঁচ সাইটের জরিপ:</strong> পাঁচটা সাইট নিয়ে প্রতিটার Registrar, DNS
        সেবা, Hosting আর ইমেইল সেবা একটা ছকে লিখুন। কোনগুলোতে চারটাই আলাদা
        কোম্পানি?
      </span>,
      <span key="3">
        <strong>পুরো Setup লিখুন:</strong> ধরুন একজন গ্রাহক Namecheap এ একটা Domain
        কিনেছেন। তিনি চান DNS Cloudflare এ, সাইট একটা Managed Hosting এ, দলের
        ইমেইল Google Workspace এ, আর blog উপনামে আলাদা একটা Blog সেবা। তাঁর জন্য
        ধাপে ধাপে নির্দেশিকা লিখুন। প্রতিটা ধাপে উল্লেখ করুন তিনি কোন পাতায়
        আছেন, কী কপি করছেন, আর কোথায় বসাচ্ছেন।
      </span>,
      <span key="4">
        <strong>সমস্যা ধরুন:</strong> প্রতিটার কারণ আর সমাধান লিখুন। (ক) Hosting
        বলছে Invalid Configuration, অথচ A Record বসানো। (খ) Verify চাপলে বলে TXT
        পাওয়া যায়নি। (গ) সাইট চলে কিন্তু তালার চিহ্ন নেই, সার্টিফিকেট আসছে না।
        (ঘ) Name Server বদলের পর ইমেইল বন্ধ। (ঙ) www তে সাইট খোলে, www ছাড়া খোলে
        না।
      </span>,
      <span key="5">
        <strong>শেখান (১০ মিনিটের পাঠ):</strong> একজন বন্ধুকে, যিনি শুধু জানেন
        Domain কেনা যায়, দশ মিনিটে বোঝানোর জন্য একটা ছোট পাঠ লিখুন। শুরু করুন
        দুই হাতবদল দিয়ে, শেষ করুন সাত ধাপের তালিকা দিয়ে। এমনভাবে লিখুন যাতে তিনি
        পড়ে নিজে একটা Domain জুড়তে পারেন।
      </span>,
    ],
    deliverables: [
      <span key="1">নিজের হাতে আঁকা দুই হাতবদলের ছবি</span>,
      <span key="2">পাঁচ সাইটের চার পক্ষের ছক</span>,
      <span key="3">চার সেবার পুরো Setup নির্দেশিকা, পাতা ধরে ধরে</span>,
      <span key="4">পাঁচ সমস্যার কারণ আর সমাধান</span>,
      <span key="5">বন্ধুর জন্য দশ মিনিটের পাঠ</span>,
    ],
  },
};
